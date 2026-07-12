import Phaser from 'phaser';
import { DUEL_ENEMY } from '../config/duel';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/display';
import { KILL_REWARD } from '../config/economy';
import { COL } from '../config/palette';
import { showBanner } from './banners';

/**
 * DuelResult (spec item 13) — overlay after the kill beat: hard cut to a
 * flat dark-red field (SYNTHESIS §4 — no fades), YOU WIN / YOU WERE
 * DEFEATED banner (same template family), reward lines, R to restart.
 * Victory pays KILL_REWARD × foe level (+10 XP / +8 coins at level 1 —
 * gate items); Defeat pays 0/0. Render-only.
 */
export class DuelResult extends Phaser.Scene {
  constructor() {
    super('duel-result');
  }

  create(data: { winner: 'player' | 'enemy' }): void {
    const won = data.winner === 'player';

    const g = this.add.graphics();
    // Hard cut: flat dark-red field with black silhouette band (no fade).
    g.fillStyle(won ? COL.bloodDark : COL.outline, 0.88);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(COL.outline, won ? 0.65 : 0.9);
    g.fillRect(0, GAME_HEIGHT - 170, GAME_WIDTH, 170);

    showBanner(this, won ? 'YOU WIN' : 'YOU WERE DEFEATED', {
      y: GAME_HEIGHT / 2 - 60,
      scale: won ? 1.3 : 0.95,
    });

    const xp = won ? KILL_REWARD.xpPerFoeLevel * DUEL_ENEMY.level : 0;
    const coins = won ? KILL_REWARD.coinsPerFoeLevel * DUEL_ENEMY.level : 0;
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 46, `+${xp} XP      +${coins} COINS`, {
        fontFamily: 'Georgia, serif',
        fontStyle: 'bold',
        fontSize: '30px',
        color: '#eaa83c',
        stroke: '#040304',
        strokeThickness: 6,
      })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 108, 'PRESS  R  TO RESTART', {
        fontFamily: 'Georgia, serif',
        fontSize: '20px',
        color: '#efedc2',
        stroke: '#040304',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // R restarts the WHOLE duel cleanly: result closes, DuelScene.create()
    // runs again (fresh Sim, timescales re-pinned to 1 — the known stuck-
    // timescale failure class is chaos-checked in the browser gate).
    this.input.keyboard?.on('keydown-R', () => {
      this.scene.stop();
      this.scene.get('duel').scene.restart();
    });
  }
}
