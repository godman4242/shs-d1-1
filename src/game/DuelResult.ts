import Phaser from 'phaser';
import { DUEL_ENEMY, XP_PER_LEVEL, XP_REWARD_BASE } from '../config/duel';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/display';
import { KILL_REWARD } from '../config/economy';
import { COL } from '../config/palette';
import { accrueXp } from '../core/profile';
import { accrueCoins } from '../core/progression';
import { showBanner } from './banners';
import { loadProfile, saveProfile } from './profileStore';

/**
 * DuelResult (spec item 13) — overlay after the kill beat: hard cut to the
 * measured card system (fidelity v2 slice 2b). BOTH outcomes share one
 * presentation: authored #990000 field INSET between black pillars (B win
 * card t=3783.2-3783.8: field x 53-1865 @1080, no top border), black tableau
 * band from row 894 (soft measurement; A defeat corroborates at 906).
 * The defeat branch (A-22, t=3361-3364.3 — the only defeat capture; its
 * VS-duel variant is unverified) adds the dark brush splash, the red
 * "YOU WERE DEFEATED!" headline (same authored #990000) and the LEAVE AREA /
 * FREE RESPAWN buttons. Victory pays the SOURCE reward — `level × 5 + 45` XP
 * (**90** at our level 9, SESSION13 D3) plus a flat INFERRED 8 coins; Defeat
 * pays nothing and shows no reward line (matches the OG card). Render-only.
 *
 * Stage geometry = OG px ÷ 1.875. Field x 28-995, tableau top y 477.
 */
export class DuelResult extends Phaser.Scene {
  constructor() {
    super('duel-result');
  }

  create(data: { winner: 'player' | 'enemy' }): void {
    const won = data.winner === 'player';

    const g = this.add.graphics();
    // Hard cut (SYNTHESIS §4 — no fades): black base = pillars, then the
    // inset authored-red field, then the tableau band.
    g.fillStyle(COL.black, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    g.fillStyle(COL.winRed, 1);
    g.fillRect(28, 0, 967, GAME_HEIGHT);
    g.fillStyle(COL.black, 1);
    g.fillRect(0, 477, GAME_WIDTH, GAME_HEIGHT - 477);
    // Tableau silhouettes rising into the field (ORIGINAL shapes; kept clear
    // of the x≈896 scan column — the OG band top is flat there).
    g.fillEllipse(210, 477, 200, 38);
    g.fillEllipse(430, 481, 260, 30);
    g.fillEllipse(640, 479, 160, 22);
    g.fillTriangle(300, 477, 330, 411, 352, 477); // kneeling victor silhouette
    g.fillEllipse(331, 408, 26, 16);

    if (won) {
      showBanner(this, 'YOU WIN', { y: GAME_HEIGHT / 2 - 60, scale: 1.3 });
    } else {
      // Dark brush splash behind the headline (measured bbox (560,204)-
      // (1418,518) @1080 → stage (299,109)-(756,276), interior #220300).
      const splash = this.add.graphics();
      splash.fillStyle(COL.splashDark, 1);
      splash.fillEllipse(527, 192, 458, 168);
      splash.fillEllipse(340, 140, 130, 60);
      splash.fillEllipse(716, 246, 120, 56);
      this.add
        .text(519, 199, 'YOU WERE DEFEATED!', {
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontStyle: 'bold italic',
          fontSize: '48px',
          color: '#990000',
          stroke: '#fafafa',
          strokeThickness: 4,
        })
        .setOrigin(0.5);
      // Buttons (measured: boxes x 814-1115, interiors y 516-547 / 608-638
      // @1080 → stage 434-595, y 275-292 / 324-340; resting fill #5c1200,
      // gold chrome, white brush labels). LEAVE AREA has no world to leave
      // until Stage 4's town — both restart the duel for now (DIVERGENCES).
      this.drawButton(432, 269, 'LEAVE AREA');
      this.drawButton(432, 320, 'FREE RESPAWN');
    }

    const xp = won ? DUEL_ENEMY.level * XP_PER_LEVEL + XP_REWARD_BASE : 0;
    const coins = won ? KILL_REWARD.coinsFlat : 0;

    // M4 accrual seam: a win pays the SAME numbers the banner shows into the
    // persisted profile (accrueXp levels through the M2 curve if a cap is
    // crossed). create() runs once per fight (resultLaunched guard), so a
    // kill can't double-pay. Render stays the same math — display parity.
    if (won) {
      saveProfile(accrueCoins(accrueXp(loadProfile(), xp), coins));
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
    }

    // R restarts the WHOLE duel cleanly: result closes, DuelScene.create()
    // runs again (fresh Sim, timescales re-pinned to 1 — the known stuck-
    // timescale failure class is chaos-checked in the browser gate).
    this.input.keyboard?.on('keydown-R', () => {
      this.restartDuel();
    });
  }

  /** OG button chrome: gold border, dark maroon fill, white brush label. */
  private drawButton(x: number, y: number, label: string): void {
    const w = 165;
    const h = 26;
    const g = this.add.graphics();
    g.fillStyle(COL.goldTrim, 1);
    g.fillRoundedRect(x, y, w, h, 6);
    g.fillStyle(COL.btnMaroon, 1);
    g.fillRoundedRect(x + 2, y + 2, w - 4, h - 4, 5);
    this.add
      .text(x + w / 2, y + h / 2, label, {
        fontFamily: 'Georgia, serif',
        fontStyle: 'bold',
        fontSize: '14px',
        color: '#fafafa',
        stroke: '#040304',
        strokeThickness: 3,
      })
      .setOrigin(0.5);
    // FREE RESPAWN restarts the encounter in the OG (A-22: back at the same
    // pre-fight beat ~3s later); LEAVE AREA maps to the same restart until
    // the Stage-4 town exists.
    this.add
      .zone(x + w / 2, y + h / 2, w, h)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.restartDuel();
      });
  }

  private restartDuel(): void {
    this.scene.stop();
    this.scene.get('duel').scene.restart();
  }
}
