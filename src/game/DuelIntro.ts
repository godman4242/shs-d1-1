import Phaser from 'phaser';
import { DUEL_ENEMY } from '../config/duel';
import { GAME_WIDTH } from '../config/display';
import { COL } from '../config/palette';

/**
 * DuelIntro — overlay scene run above DuelScene.
 *
 * REFIT (fidelity v2 slice 2b, 2026-07-16): the original's VS-duel intro is a
 * TWO-beat sequence measured off the B longplay (t=3771.2-3773.85 @60fps):
 *   1. VS beat  — a full-width black band (rows 448-584 @1080) over the LIVE
 *      arena + HUD, face portraits and names inside the band, a giant red
 *      brush VS glyph (bbox (754,392)-(1118,640), core #ff1800) overflowing it.
 *   2. FIGHT! beat — the same band, orange gradient FIGHT! glyph (bbox
 *      (824,492)-(1090,572)), then the band collapses and combat is on.
 * There is NO separate name banner and NO READY… step in the original —
 * spec item 12's four-step description is corrected by measurement (logged
 * in DIVERGENCES; veto = restore the four-step sequence).
 *
 * Step timing is INFERRED from the one clean capture (VS ≈2.0s, glyph ≈450ms,
 * band tail ≈150ms). Clicking fast-forwards one beat per click. Strokes drawn
 * before FIGHT! are discarded by the SIM (gate item) — the overlay never has
 * to swallow input itself. Render-only: owns zero gameplay state.
 *
 * Stage geometry = OG px ÷ 1.875 (1920×1080 → 1024×576, full-bleed 16:9).
 */
type Step = 'vs' | 'fight' | 'tail' | 'done';

const STEP_MS: Record<Exclude<Step, 'done'>, number> = {
  vs: 2000,
  fight: 450,
  tail: 150,
};

/** Band rows 448-584 @1080 → stage rows 239-311 (top 239, height 73). */
const BAND_Y = 239;
const BAND_H = 73;

export class DuelIntro extends Phaser.Scene {
  private step: Step = 'vs';
  private stepAt = 0;
  private lastNow = 0;
  private band: Phaser.GameObjects.Graphics | null = null;
  private beat: Phaser.GameObjects.Container | null = null;
  /** DEV-only sampling seam (fidelity harness): step the sequence is frozen at. */
  private devHold: Step | null = null;

  constructor() {
    super('duel-intro');
  }

  create(): void {
    this.step = 'vs';
    this.stepAt = this.time.now;
    this.lastNow = this.time.now;
    // ⚠️ devHold is deliberately NOT reset here. The fidelity harness restarts
    // the duel and calls devHoldAt() as little as TWO settled frames later —
    // which can land on THIS scene object before this create() has run (the
    // scene instance persists across restarts, still carrying step='done').
    // The seam records the hold; create() re-applies it below. Nulling it here
    // instead let the fresh intro run FREE under the sampler, and the FIGHT!-
    // glyph probes then read the black gaps between the VS strokes —
    // intermittently, because create() usually wins the two-frame race unless
    // the GPU is loaded (SESSION23: several piled-up game windows).
    // The band persists across both beats (measured: identical rows in the
    // VS and FIGHT! frames); only the glyph layer swaps.
    this.band = this.add.graphics().setDepth(998);
    this.band.fillStyle(COL.black, 1);
    this.band.fillRect(0, BAND_Y, GAME_WIDTH, BAND_H);
    this.showVsBeat();
    // Re-apply a hold the harness recorded before this create() ran (the
    // race documented above): fast-forward to the requested beat and freeze.
    if (this.devHold !== null && this.devHold !== 'done') this.devHoldAt(this.devHold);
    this.input.on('pointerdown', () => {
      this.advance();
    });
  }

  /** Fidelity-harness seam: fast-forward to a beat and freeze there. */
  devHoldAt(step: Exclude<Step, 'done'>): void {
    while (this.step !== step && this.step !== 'done') this.advance();
    this.devHold = step;
  }

  /** Release a devHoldAt freeze; the sequence resumes from a fresh timer. */
  devRelease(): void {
    this.devHold = null;
    this.stepAt = this.time.now;
  }

  override update(): void {
    if (this.step === 'done') return;
    if (this.step === this.devHold) return;
    // Occluded-tab clock jump: on resume, time.now leaps by the hidden
    // wall-time and would blow through every step in 3 frames (the original
    // Flash game simply paused when hidden). Re-anchor the step timer so
    // the sequence resumes where it left off.
    const now = this.time.now;
    if (now - this.lastNow > 500) this.stepAt += now - this.lastNow;
    this.lastNow = now;
    if (now - this.stepAt >= STEP_MS[this.step]) this.advance();
  }

  /** VS beat: names + portrait busts in the band, red VS glyph overflowing it. */
  private showVsBeat(): void {
    const c = this.add.container(0, 0).setDepth(999);

    // Names sit ON the band (B: left name gold, left-aligned x=122, row
    // center 551; right name white, right-aligned to x=1848 → stage 65/294
    // and 986/294; cap ≈34px @1080 → 26px font here).
    c.add(
      this.add
        .text(65, 294, 'GUEST', {
          fontFamily: 'Georgia, serif', fontStyle: 'bold', fontSize: '26px',
          color: '#f4be09', stroke: '#040304', strokeThickness: 4,
        })
        .setOrigin(0, 0.5),
    );
    c.add(
      this.add
        .text(986, 294, DUEL_ENEMY.name.toUpperCase(), {
          fontFamily: 'Georgia, serif', fontStyle: 'bold', fontSize: '26px',
          color: '#fafafa', stroke: '#040304', strokeThickness: 4,
        })
        .setOrigin(1, 0.5),
    );

    // Face busts inside the band, facing each other (ORIGINAL drawings —
    // only the content boxes are measured: player x 412-588, enemy
    // x 1238-1478 @1080 → stage 220-314 / 660-788).
    const busts = this.add.graphics();
    this.drawBust(busts, 267, 278, 1, false);
    this.drawBust(busts, 724, 278, -1, true);
    c.add(busts);

    // The red VS glyph — ORIGINAL brush-stroke polygons (font letterforms
    // put ink in the wrong places; the OG's stroke layout is measured:
    // box (754,392)-(1118,640) → stage (402,209)-(596,341), core #ff1800,
    // V right-stroke through (880,520) and S upper bowl through (1000,480)
    // → stage (469,277) / (533,256) — both gate-probed).
    const vsGlyph = this.add.graphics();
    this.drawVsGlyph(vsGlyph);
    c.add(vsGlyph);

    // Zoom-in transient (measured: one ~80ms oversized frame, then settled).
    c.setScale(1.18).setAlpha(0.6);
    this.tweens.add({ targets: c, alpha: 1, scale: 1, duration: 80, ease: 'Quad.easeOut' });
    this.beat = c;
  }

  /** FIGHT! beat: orange gradient glyph on the same band. */
  private showFightBeat(): void {
    const c = this.add.container(0, 0).setDepth(999);
    const fight = this.add.graphics();
    this.drawFightGlyph(fight);
    c.add(fight);

    c.setScale(1.5).setAlpha(0.5);
    this.tweens.add({ targets: c, alpha: 1, scale: 1, duration: 80, ease: 'Quad.easeOut' });
    this.beat = c;
  }

  /**
   * Original blocky-brush FIGHT! — font letterforms put ink in the wrong
   * places (serif/slant misses the measured F-stem), so the letters are
   * bar-rect unions painted in 1-px gradient strips. Ink box measured
   * (824,492)-(1090,572) @1080 → stage (439.5,262) 142×43; the row colors
   * are the linear fit through the two gate-asserted F-stem anchors
   * (OG rows 512/550 → (255,109,0)/(255,181,0)).
   */
  private drawFightGlyph(g: Phaser.GameObjects.Graphics): void {
    const bx = 439.5;
    const by = 262;
    // Letter bars as [x, y, w, h] in glyph-box units (142×43):
    // F stem+arms · I · G (C-bars + notch) · H · T · !
    const rects = [
      [0, 0, 8, 43], [0, 0, 21, 8], [0, 18, 19, 7],
      [26, 0, 8, 43],
      [36, 0, 24, 8], [36, 0, 8, 43], [36, 35, 24, 8], [52, 18, 8, 25], [47, 18, 13, 7],
      [68, 0, 8, 43], [84, 0, 8, 43], [68, 18, 24, 7],
      [100, 0, 24, 8], [108, 0, 8, 43],
      [130, 0, 8, 28], [130, 36, 8, 7],
    ];
    for (let i = 0; i < 43; i++) {
      const green = Math.round(71 + (152 * i) / 42);
      g.fillStyle((0xff << 16) | (green << 8), 1);
      for (const [rx, ry, rw, rh] of rects) {
        if (rx === undefined || ry === undefined || rw === undefined || rh === undefined) continue;
        if (i >= ry && i < ry + rh) g.fillRect(bx + rx, by + i, rw, 1);
      }
    }
  }

  /** Original brush VS — stroke layout hits the measured probe points. */
  private drawVsGlyph(g: Phaser.GameObjects.Graphics): void {
    const quad = (pts: number[][]): void => {
      g.fillPoints(pts.map(([x, y]) => new Phaser.Geom.Point(x, y)), true);
    };
    // Soft black brush shadow first (offset copy, like the OG's).
    for (const [pass, dx, dy] of [['shadow', 5, 7] as const, ['ink', 0, 0] as const]) {
      g.fillStyle(pass === 'shadow' ? COL.black : COL.vsRed, pass === 'shadow' ? 0.85 : 1);
      // V — two strokes meeting at a bottom apex; the right stroke passes
      // through stage (469,277) (OG (880,520), gate-probed).
      quad([[402 + dx, 209 + dy], [428 + dx, 209 + dy], [464 + dx, 338 + dy], [445 + dx, 338 + dy]]);
      quad([[474 + dx, 209 + dy], [498 + dx, 209 + dy], [465 + dx, 338 + dy], [448 + dx, 338 + dy]]);
      // brush overshoot flare at the V apex
      quad([[445 + dx, 338 + dy], [464 + dx, 338 + dy], [472 + dx, 341 + dy], [440 + dx, 341 + dy]]);
      // S — blocky brush bars; the upper-left bowl covers stage (533,256)
      // (OG (1000,480), gate-probed).
      quad([[512 + dx, 209 + dy], [596 + dx, 209 + dy], [590 + dx, 233 + dy], [518 + dx, 233 + dy]]);
      quad([[512 + dx, 209 + dy], [538 + dx, 216 + dy], [538 + dx, 276 + dy], [512 + dx, 270 + dy]]);
      quad([[512 + dx, 252 + dy], [596 + dx, 258 + dy], [596 + dx, 282 + dy], [512 + dx, 276 + dy]]);
      quad([[570 + dx, 258 + dy], [596 + dx, 258 + dy], [596 + dx, 328 + dy], [570 + dx, 322 + dy]]);
      quad([[508 + dx, 317 + dy], [596 + dx, 317 + dy], [588 + dx, 341 + dy], [502 + dx, 341 + dy]]);
    }
  }

  /** Original bust drawing (kasa'd player / topknot enemy) — never traced. */
  private drawBust(g: Phaser.GameObjects.Graphics, cx: number, cy: number, face: number, topknot: boolean): void {
    g.fillStyle(COL.outline, 1);
    g.fillEllipse(cx, cy + 26, 52, 30); // shoulders
    g.fillStyle(topknot ? COL.haoriEnemy : COL.haori, 1);
    g.fillEllipse(cx, cy + 25, 46, 24);
    g.fillStyle(COL.kimono2, 1);
    g.fillCircle(cx, cy, 17); // head
    g.fillStyle(COL.outline, 1);
    g.fillCircle(cx + face * 8, cy - 2, 2.2); // eye toward the foe
    if (topknot) {
      g.fillStyle(COL.hair, 1);
      g.fillEllipse(cx, cy - 14, 18, 10);
      g.fillCircle(cx - face * 4, cy - 20, 5);
    } else {
      // kasa
      g.fillStyle(COL.outline, 1);
      g.fillTriangle(cx - 26, cy - 8, cx + 26, cy - 8, cx, cy - 28);
      g.fillStyle(COL.hatStraw, 1);
      g.fillTriangle(cx - 23, cy - 9, cx + 23, cy - 9, cx, cy - 26);
    }
  }

  private clearBeat(): void {
    this.beat?.destroy(true);
    this.beat = null;
  }

  private advance(): void {
    this.stepAt = this.time.now;
    if (this.step === 'vs') {
      this.step = 'fight';
      this.clearBeat();
      this.showFightBeat();
      // FIGHT! is combat-live immediately (the band lingers briefly).
      this.scene.get('duel').events.emit('intro-done');
      return;
    }
    if (this.step === 'fight') {
      // Measured exit: the glyph fades ~150ms before the band collapses.
      this.step = 'tail';
      this.clearBeat();
      return;
    }
    if (this.step === 'tail') {
      this.step = 'done';
      this.scene.stop();
    }
  }
}
