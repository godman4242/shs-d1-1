import Phaser from 'phaser';
import { COL } from '../config/palette';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/display';

function hex(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}

/**
 * Render-only placeholder proving the pipeline boots (Stage 0).
 * Stage 1 replaces this with DuelScene. Never owns gameplay state.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(COL.skyTop, COL.skyTop, COL.skyLow, COL.skyLow, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'SSHD 1:1 — Stage 0 scaffold OK', {
        color: hex(COL.haori),
        fontSize: '28px',
        fontFamily: 'Georgia, serif',
      })
      .setOrigin(0.5);
  }
}
