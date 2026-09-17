import Phaser from 'phaser';
import { COL } from './config/palette';
import { GAME_WIDTH, GAME_HEIGHT } from './config/display';
import { AUTO_FIDELITY_SETTLE_MS } from './config/fidelity';
import { DuelIntro } from './game/DuelIntro';
import { DuelResult } from './game/DuelResult';
import { DuelScene } from './game/DuelScene';
import { EncounterScene } from './game/EncounterScene';
import { createFidelityHarness } from './game/fidelity';
import { IdleFighterScene } from './game/IdleFighterScene';
import { OgArtScene } from './game/OgArtScene';

/**
 * SESSION14 A4: `?scene=encounter` routes to the crowd fight. The duel stays the
 * default boot scene, so every existing check — including the in-browser
 * fidelity gate — lands exactly where it did before.
 */
const params = new URLSearchParams(window.location.search);
const wantsEncounter = params.get('scene') === 'encounter';


/**
 * SESSION17 A3.2: `?art=og` shows one imported OG shape beside the procedural
 * fighter. The canvas goes TRANSPARENT on this route only — SESSION17 §P2
 * measures the shape's size as the box of pixels at ≥ 50 % alpha, which is
 * meaningless over an opaque background. Every other route keeps its
 * background, so the 55/55 fidelity gate is untouched.
 */
const wantsOgArt = params.get('art') === 'og';

/**
 * SESSION18 A4.4: `?art=idle` composes the WHOLE fighter — 14 shapes at the 19
 * node transforms the payload records. Transparent for the same reason as
 * `?art=og`: §P2's alpha rule is undefined over an opaque background.
 */
const wantsIdleArt = params.get('art') === 'idle';

/**
 * SESSION19 A5.2: `?art=dressed` is the SAME scene with the dressed slot map —
 * traced garment art replacing a part's shape. Same transparent canvas, because
 * it is measured the same way.
 */
const wantsDressedArt = params.get('art') === 'dressed';

/**
 * SEAM SPIKE (2026-09-17): `?npc=katana` drives the duel's opponent with a
 * PORTED `EnemyKatana` (`core/npc/duelSeam.ts`) instead of `AISeamController`.
 *
 * ⛔ A SPIKE, NOT A FEATURE — it must never become the default. `AISeamController`
 * stays the shipped opponent; the flag is the only way in, and the verdict on
 * what it does is in `docs/DIVERGENCES.md` findings 15-18. The scene reads it
 * off the registry rather than re-parsing the query string, so this file stays
 * the one place a route flag is declared.
 */
const wantsNpcKatana = params.get('npc') === 'katana';

const game = new Phaser.Game({
  // WEBGL explicitly (not AUTO): the art direction relies on WebGL-only
  // features (e.g. Graphics gradients). Failing loudly beats degrading silently.
  type: Phaser.WEBGL,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: COL.skyTop,
  transparent: wantsOgArt || wantsIdleArt || wantsDressedArt,
  parent: 'app',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // The FIRST scene in this array auto-starts. DuelScene remains the default —
  // it launches the intro/result overlays itself — and `?scene=encounter`
  // boots the A4 crowd fight instead.
  scene: wantsIdleArt || wantsDressedArt
    ? [IdleFighterScene]
    : wantsOgArt
      ? [OgArtScene]
      : wantsEncounter
        ? [EncounterScene, DuelScene, DuelIntro, DuelResult]
        : [DuelScene, DuelIntro, DuelResult, EncounterScene],
});

// The spike's one input, handed to DuelScene before any scene's create() runs
// (Phaser builds the registry in its constructor and boots scenes afterwards).
game.registry.set('npcKatana', wantsNpcKatana);

// Dev-only verification seams: __game lets automated browser checks step the
// loop manually when Chrome occlusion-throttles rAF; __fidelity runs the
// measured fidelity gate (config/fidelity.ts assertions against real canvas
// pixels). Both absent from production builds.
if (import.meta.env.DEV) {
  const fidelity = createFidelityHarness(game);
  (window as unknown as Record<string, unknown>).__game = game;
  (window as unknown as Record<string, unknown>).__fidelity = fidelity;

  // SESSION23: `?fidelity=auto` — the gate runs itself once the game is up and
  // parks a compact verdict in localStorage. Why: a HIDDEN tab gets no rAF, so
  // the game (and therefore the gate) freezes — an automated session can now
  // open this URL in a fresh, visible window (`open -na "Google Chrome" --args
  // --new-window <url>`) and poll the verdict from any same-origin tab instead
  // of needing a human to keep a window frontmost. The key is cleared first so
  // a poller can never read a stale verdict as a fresh one.
  if (params.get('fidelity') === 'auto') {
    // A 'running' marker lands IMMEDIATELY, so a poller can tell "the page
    // booted in this profile and the gate is in flight" from "nothing ever
    // loaded here" — the two failure modes need different fixes.
    localStorage.setItem(
      '__fidelityAuto',
      JSON.stringify({ state: 'running', startedAt: new Date().toISOString() }),
    );
    game.events.once(Phaser.Core.Events.READY, () => {
      window.setTimeout(() => {
        void fidelity
          .run()
          .then((report) => {
            localStorage.setItem(
              '__fidelityAuto',
              JSON.stringify({
                pass: report.pass,
                points: report.results.length,
                scans: report.scans.length,
                failed:
                  report.results.filter((r) => !r.pass).length +
                  report.scans.filter((s) => !s.pass).length,
                failures: [
                  ...report.results.filter((r) => !r.pass),
                  ...report.scans.filter((s) => !s.pass),
                ],
                finishedAt: new Date().toISOString(),
              }),
            );
          })
          .catch((err: unknown) => {
            localStorage.setItem(
              '__fidelityAuto',
              JSON.stringify({ pass: false, error: String(err), finishedAt: new Date().toISOString() }),
            );
          });
      }, AUTO_FIDELITY_SETTLE_MS);
    });
  }
}
