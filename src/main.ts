import Phaser from 'phaser';
import { COL } from './config/palette';
import { GAME_WIDTH, GAME_HEIGHT } from './config/display';
import { DuelIntro } from './game/DuelIntro';
import { DuelResult } from './game/DuelResult';
import { DuelScene } from './game/DuelScene';
import { EncounterScene } from './game/EncounterScene';
import { createFidelityHarness } from './game/fidelity';
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

const game = new Phaser.Game({
  // WEBGL explicitly (not AUTO): the art direction relies on WebGL-only
  // features (e.g. Graphics gradients). Failing loudly beats degrading silently.
  type: Phaser.WEBGL,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: COL.skyTop,
  transparent: wantsOgArt,
  parent: 'app',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // The FIRST scene in this array auto-starts. DuelScene remains the default —
  // it launches the intro/result overlays itself — and `?scene=encounter`
  // boots the A4 crowd fight instead.
  scene: wantsOgArt
    ? [OgArtScene]
    : wantsEncounter
      ? [EncounterScene, DuelScene, DuelIntro, DuelResult]
      : [DuelScene, DuelIntro, DuelResult, EncounterScene],
});

// Dev-only verification seams: __game lets automated browser checks step the
// loop manually when Chrome occlusion-throttles rAF; __fidelity runs the
// measured fidelity gate (config/fidelity.ts assertions against real canvas
// pixels). Both absent from production builds.
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__game = game;
  (window as unknown as Record<string, unknown>).__fidelity = createFidelityHarness(game);
}
