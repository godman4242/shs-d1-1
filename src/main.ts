import Phaser from 'phaser';
import { COL } from './config/palette';
import { GAME_WIDTH, GAME_HEIGHT } from './config/display';
import { DuelIntro } from './game/DuelIntro';
import { DuelResult } from './game/DuelResult';
import { DuelScene } from './game/DuelScene';

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
  // DuelScene auto-starts and launches the intro/result overlays itself
  // (?scene=duel is the only route until Stage 6 adds the world scenes).
  scene: [DuelScene, DuelIntro, DuelResult],
});

// Dev-only verification seam: lets automated browser checks step the loop
// manually when Chrome occlusion-throttles rAF. Absent from production builds.
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__game = game;
}
