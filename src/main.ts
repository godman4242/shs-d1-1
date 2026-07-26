import Phaser from 'phaser';
import { COL } from './config/palette';
import { GAME_WIDTH, GAME_HEIGHT } from './config/display';
import { DuelIntro } from './game/DuelIntro';
import { DuelResult } from './game/DuelResult';
import { DuelScene } from './game/DuelScene';
import { EncounterScene } from './game/EncounterScene';
import { createFidelityHarness } from './game/fidelity';

/**
 * SESSION14 A4: `?scene=encounter` routes to the crowd fight. The duel stays the
 * default boot scene, so every existing check — including the in-browser
 * fidelity gate — lands exactly where it did before.
 */
const wantsEncounter = new URLSearchParams(window.location.search).get('scene') === 'encounter';

const game = new Phaser.Game({
  // WEBGL explicitly (not AUTO): the art direction relies on WebGL-only
  // features (e.g. Graphics gradients). Failing loudly beats degrading silently.
  type: Phaser.WEBGL,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: COL.skyTop,
  parent: 'app',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // The FIRST scene in this array auto-starts. DuelScene remains the default —
  // it launches the intro/result overlays itself — and `?scene=encounter`
  // boots the A4 crowd fight instead.
  scene: wantsEncounter
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
