import Phaser from 'phaser';
import {
  FIDELITY_ENEMY_BAR,
  FIDELITY_PROBES,
  FIDELITY_SCANS,
  type FidelityProbe,
  type FidelityScan,
  type FidelityState,
} from '../config/fidelity';
import { MAX_FRAME_MS } from '../config/combat-sim';
import { GAME_WIDTH } from '../config/display';
import {
  compareProbe,
  compareScan,
  summarize,
  type FidelityReport,
  type ProbeResult,
  type Rgb,
  type ScanResult,
} from '../core/fidelityCompare';
import { worldToStage } from '../core/viewport';
import type { Sim } from '../core/Sim';

/**
 * Fidelity gate harness — DEV-ONLY (wired behind import.meta.env.DEV in
 * main.ts, absent from production builds). Drives the running game into the
 * two canonical states, reads real pixels back off the canvas, and compares
 * them against the frame-measured assertions in config/fidelity.ts
 * (core/fidelityCompare.ts does the pure math).
 *
 * Run from DevTools with the tab VISIBLE (rAF must tick):
 *   await __fidelity.run()
 * The report prints as a table; `pass === true` is the gate.
 *
 * The result-win pass launches the real DuelResult scene, which accrues the
 * win into the persisted profile — so localStorage is backed up wholesale
 * before and restored after (the harness never leaves a polluted save).
 */

type PixelReader = (x: number, y: number) => Rgb;

/**
 * Sim ms to run before sampling the 'fighting' state. 4 s puts Focus at 96 of
 * 192 units — a third of the VISIBLE bar, comfortably past the probe's sampling
 * column — while staying inside the 5 s spawn invulnerability, so the player's
 * HP bar is still pinned at FULL and the length probes keep their meaning.
 */
const FIGHTING_SETTLE_MS = 4000;

/** A DuelScene through the dev keyhole: we only reach for its sim. */
interface DuelSceneSeam {
  sim: Sim;
}

/** DuelIntro through its DEV-only sampling seam (freeze at a beat). */
interface IntroSeam {
  devHoldAt(step: 'vs' | 'fight'): void;
  devRelease(): void;
}

/** One real-frame wait per iteration — with a manual game.loop.step()
 * fallback, because Chrome occlusion-throttles rAF in background tabs (the
 * known failure class the __game loop-step seam exists for). A manual step
 * drives the exact same update/render path, just on our clock. */
const settleFrames = async (game: Phaser.Game, frames: number): Promise<void> => {
  for (let i = 0; i < frames; i++) {
    let onRender: (() => void) | undefined;
    const rendered = await new Promise<boolean>((resolve) => {
      onRender = () => {
        resolve(true);
      };
      game.events.once(Phaser.Core.Events.POST_RENDER, onRender);
      setTimeout(() => {
        resolve(false);
      }, 150);
    });
    if (!rendered && onRender !== undefined) {
      game.events.off(Phaser.Core.Events.POST_RENDER, onRender);
      game.loop.step(performance.now());
    }
  }
};

/** Snapshot the drawing buffer and hand back a clamped pixel reader.
 * The capture fires during a render, so schedule it FIRST, then force a
 * frame through settleFrames (real or manually stepped). */
const snapshot = async (game: Phaser.Game): Promise<PixelReader> => {
  const captured = scheduleSnapshot(game);
  await settleFrames(game, 1);
  return captured;
};

const scheduleSnapshot = (game: Phaser.Game): Promise<PixelReader> =>
  new Promise((resolve, reject) => {
    game.renderer.snapshot((snap) => {
      if (!(snap instanceof HTMLImageElement)) {
        reject(new Error('fidelity: snapshot returned no image'));
        return;
      }
      const canvas = document.createElement('canvas');
      canvas.width = snap.width;
      canvas.height = snap.height;
      const ctx = canvas.getContext('2d');
      if (ctx === null) {
        reject(new Error('fidelity: 2d context unavailable'));
        return;
      }
      ctx.drawImage(snap, 0, 0);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve((x, y) => {
        const cx = Math.min(canvas.width - 1, Math.max(0, Math.round(x)));
        const cy = Math.min(canvas.height - 1, Math.max(0, Math.round(y)));
        const at = (cy * canvas.width + cx) * 4;
        return [data[at] ?? 0, data[at + 1] ?? 0, data[at + 2] ?? 0];
      });
    });
  });

const backupStorage = (): Map<string, string> => {
  const backup = new Map<string, string>();
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key !== null) backup.set(key, localStorage.getItem(key) ?? '');
  }
  return backup;
};

const restoreStorage = (backup: Map<string, string>): void => {
  localStorage.clear();
  for (const [key, value] of backup) localStorage.setItem(key, value);
};

export interface FidelityRun extends FidelityReport {
  /** Snapshot dimensions the normalized probes were resolved against. */
  readonly width: number;
  readonly height: number;
}

export interface FidelityHarness {
  run(): Promise<FidelityRun>;
}

export const createFidelityHarness = (game: Phaser.Game): FidelityHarness => {
  const byState = (state: FidelityState): readonly FidelityProbe[] =>
    FIDELITY_PROBES.filter((p) => p.state === state);
  const scansByState = (state: FidelityState): readonly FidelityScan[] =>
    FIDELITY_SCANS.filter((s) => s.state === state);

  const sampleScreen = (
    probes: readonly FidelityProbe[],
    read: PixelReader,
    w: number,
    h: number,
  ): ProbeResult[] => probes.map((p) => compareProbe(p, read(p.x * w, p.y * h)));

  /** Walk one scan line across the snapshot and locate the target edge. */
  const runScan = (scan: FidelityScan, read: PixelReader, w: number, h: number): ScanResult => {
    const size = scan.axis === 'x' ? w : h;
    const fixed = scan.at * (scan.axis === 'x' ? h : w);
    const a = Math.round(scan.from * size);
    const b = Math.round(scan.to * size);
    const step = b >= a ? 1 : -1;
    const samples: Rgb[] = [];
    for (let px = a; step > 0 ? px <= b : px >= b; px += step) {
      samples.push(scan.axis === 'x' ? read(px, fixed) : read(fixed, px));
    }
    return compareScan(scan, samples, a, step, scan.edge * size);
  };

  const run = async (): Promise<FidelityRun> => {
    const duel = game.scene.getScene('duel');
    const w = game.scale.gameSize.width;
    const h = game.scale.gameSize.height;
    const results: ProbeResult[] = [];
    const scanResults: ScanResult[] = [];

    const sampleState = (state: FidelityState, read: PixelReader): void => {
      results.push(...sampleScreen(byState(state), read, w, h));
      scanResults.push(...scansByState(state).map((s) => runScan(s, read, w, h)));
    };

    // ── States 1+2: the intro beats — VS band, then the FIGHT! splash.
    // The intro's DEV seam freezes the sequence at each beat; 8 settled
    // frames outlast the banner reveal tween (90 ms) before sampling. ──
    duel.scene.restart();
    await settleFrames(game, 2);
    const intro = game.scene.getScene('duel-intro') as unknown as IntroSeam;
    intro.devHoldAt('vs');
    await settleFrames(game, 8);
    let read = await snapshot(game);
    sampleState('vs-intro', read);

    intro.devHoldAt('fight');
    await settleFrames(game, 8);
    read = await snapshot(game);
    sampleState('fight-splash', read);
    intro.devRelease();

    // ── State 3: fighting, a few seconds in ──
    // Kill the intro overlay and fire the signal DuelScene waits on (its
    // once-listener calls sim.beginCombat) — combat live.
    game.scene.stop('duel-intro');
    duel.events.emit('intro-done');
    await settleFrames(game, 2);

    // ⚠️ NOT t≈0 ANY MORE (SESSION13 D4). This state used to be sampled at
    // t≈0 and documented as "full HP/Chi/Focus", which was only true because
    // our Focus meter started half-full. The source's meter starts EMPTY and
    // fills at 24 units/s, and its first 48 units are INVISIBLE — so at t≈0 the
    // pill is genuinely blank and `focus-strip-left` samples the brown backing.
    //
    // The probe itself was measured mid-fight (B t=3774, note: "fill length
    // varies in-fight"), so the fix is to sample a matching moment rather than
    // to re-fit the assertion. FIGHTING_SETTLE_MS sits inside SPAWN_INVULN_S
    // (5 s), so the enemy cannot land a hit and the HP-bar length probes still
    // pin a FULL bar.
    // NOTE: `advance()` clamps EVERY call to MAX_FRAME_MS so a backgrounded tab
    // cannot fast-forward a fight — one big advance() would buy 250 ms, not 4 s.
    // So step it in clamp-sized bites. ⚠️ NOT `tick()`: a scene calling tick()
    // directly bypasses the fixed-step accumulator, and there is an audit guard
    // that fails exactly this (it caught the first version of this code).
    const settleSim = (duel as unknown as DuelSceneSeam).sim;
    for (let ms = 0; ms < FIGHTING_SETTLE_MS; ms += MAX_FRAME_MS) settleSim.advance(MAX_FRAME_MS);
    await settleFrames(game, 2);
    duel.scene.pause();
    await settleFrames(game, 1);

    read = await snapshot(game);
    sampleState('fighting', read);

    // Enemy overhead bar — anchored to the sim's enemy position (stage px),
    // scaled into snapshot space alongside the normalized screen probes.
    const sim = (duel as unknown as DuelSceneSeam).sim;
    const scale = w / GAME_WIDTH;
    const enemyProbe: FidelityProbe = {
      id: 'enemy-bar-green',
      state: 'fighting',
      x: 0,
      y: 0,
      rgb: FIDELITY_ENEMY_BAR.rgb,
      tol: FIDELITY_ENEMY_BAR.tol,
      note: FIDELITY_ENEMY_BAR.note,
    };
    // A0: sim positions are WORLD units — convert to stage the same way the
    // scene draws them, THEN apply the probe's stage-px offset.
    const enemyStage = worldToStage(sim.enemy.pos);
    results.push(
      compareProbe(
        enemyProbe,
        read(
          (enemyStage.x + FIDELITY_ENEMY_BAR.dx) * scale,
          (enemyStage.y + FIDELITY_ENEMY_BAR.dy) * scale,
        ),
      ),
    );

    // ── States 4+5: result cards (profile-safe via storage backup; the
    // defeat branch writes nothing, but both run inside the same guard) ──
    const backup = backupStorage();
    try {
      duel.scene.launch('duel-result', { winner: 'player' });
      await settleFrames(game, 8);
      read = await snapshot(game);
      sampleState('result-win', read);
      game.scene.stop('duel-result');
      await settleFrames(game, 1);

      duel.scene.launch('duel-result', { winner: 'enemy' });
      await settleFrames(game, 8);
      read = await snapshot(game);
      sampleState('result-defeat', read);
      game.scene.stop('duel-result');
    } finally {
      restoreStorage(backup);
    }

    // Leave a clean, live duel behind (fresh sim, intro relaunched).
    duel.scene.resume();
    duel.scene.restart();

    const report = summarize(results, scanResults);
    const hex = (rgb: Rgb): string =>
      `#${rgb.map((c) => c.toString(16).padStart(2, '0')).join('')}`;
    // DevTools-readable verdict table.
     
    console.table(
      report.results.map((r) => ({
        probe: r.id,
        expected: hex(r.expected),
        actual: hex(r.actual),
        maxDelta: r.maxDelta,
        pass: r.pass,
      })),
    );

    console.table(
      report.scans.map((s) => ({
        scan: s.id,
        expectedPx: Math.round(s.expectedPx * 10) / 10,
        foundPx: s.foundPx,
        deltaPx: Number.isFinite(s.deltaPx) ? Math.round(s.deltaPx * 10) / 10 : Infinity,
        pass: s.pass,
      })),
    );

    const failed = report.failures.length + report.scanFailures.length;
    console.log(
      `fidelity gate: ${report.pass ? 'PASS' : `FAIL (${String(failed)} of ${String(report.results.length + report.scans.length)} probes)`} — ${String(report.results.length)} points + ${String(report.scans.length)} scans`,
    );
    return { ...report, width: w, height: h };
  };

  return { run };
};
