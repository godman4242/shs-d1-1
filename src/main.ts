import Phaser from 'phaser';
import { COL } from './config/palette';
import { GAME_WIDTH, GAME_HEIGHT } from './config/display';
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
  scene: [DuelScene],
});

// Dev-only verification seam: lets automated browser checks step the loop
// manually when Chrome occlusion-throttles rAF. Absent from production builds.
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__game = game;
}
