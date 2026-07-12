import Phaser from 'phaser';
import { DUEL_ENEMY } from '../config/duel';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/display';
import { COL } from '../config/palette';
import { showBanner, type BannerHandle } from './banners';
import { drawSamurai, ENEMY_LOOK, PLAYER_LOOK } from './samurai';

/**
 * DuelIntro (spec item 12) — overlay scene run above DuelScene:
 * VS card → opponent name banner → READY → FIGHT!, then emits 'intro-done'
 * on the DuelScene so it can call sim.beginCombat(). Clicking fast-forwards
 * one step per click. Strokes drawn before FIGHT! are discarded by the SIM
 * (gate item) — the overlay never has to swallow input itself.
 * Render-only: owns zero gameplay state.
 */
type Step = 'vs' | 'name' | 'ready' | 'fight' | 'done';

const STEP_MS: Record<Exclude<Step, 'done'>, number> = {
  vs: 1300,
  name: 950,
  ready: 800,
  fight: 550,
};

export class DuelIntro extends Phaser.Scene {
  private step: Step = 'vs';
  private stepAt = 0;
  private lastNow = 0;
  private banner: BannerHandle | null = null;
  private card: Phaser.GameObjects.Container | null = null;

  constructor() {
    super('duel-intro');
  }

  create(): void {
    this.step = 'vs';
    this.stepAt = this.time.now;
    this.lastNow = this.time.now;
    this.banner = null;
    this.showVsCard();
    this.input.on('pointerdown', () => {
      this.advance();
    });
  }

  override update(): void {
    if (this.step === 'done') return;
    // Occluded-tab clock jump: on resume, time.now leaps by the hidden
    // wall-time and would blow through every step in 3 frames (the original
    // Flash game simply paused when hidden). Re-anchor the step timer so
    // the sequence resumes where it left off.
    const now = this.time.now;
    if (now - this.lastNow > 500) this.stepAt += now - this.lastNow;
    this.lastNow = now;
    if (now - this.stepAt >= STEP_MS[this.step]) this.advance();
  }

  /** VS card (B-23 anatomy): player panel left, enemy right, cracked VS. */
  private showVsCard(): void {
    const c = this.add.container(0, 0).setDepth(999);
    const g = this.add.graphics();
    g.fillStyle(COL.outline, 0.78);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    // portrait panels
    g.fillStyle(COL.hatStraw, 1);
    g.fillRoundedRect(GAME_WIDTH / 2 - 380, 138, 300, 300, 18);
    g.fillStyle(COL.kimono2, 1);
    g.fillRoundedRect(GAME_WIDTH / 2 + 80, 138, 300, 300, 18);
    g.fillStyle(COL.forestDark, 0.25);
    g.fillRoundedRect(GAME_WIDTH / 2 - 372, 146, 284, 284, 14);
    g.fillRoundedRect(GAME_WIDTH / 2 + 88, 146, 284, 284, 14);
    c.add(g);
    const fighters = this.add.graphics();
    drawSamurai(fighters, GAME_WIDTH / 2 - 230, 418, 1, PLAYER_LOOK, 'idle');
    drawSamurai(fighters, GAME_WIDTH / 2 + 230, 418, -1, ENEMY_LOOK, 'idle');
    c.add(fighters);
    c.add(
      this.add
        .text(GAME_WIDTH / 2 - 230, 462, 'GUEST', {
          fontFamily: 'Georgia, serif', fontStyle: 'bold', fontSize: '26px',
          color: '#efedc2', stroke: '#040304', strokeThickness: 5,
        })
        .setOrigin(0.5),
    );
    c.add(
      this.add
        .text(GAME_WIDTH / 2 + 230, 462, `${DUEL_ENEMY.name} (${DUEL_ENEMY.level})`, {
          fontFamily: 'Georgia, serif', fontStyle: 'bold', fontSize: '26px',
          color: '#efedc2', stroke: '#040304', strokeThickness: 5,
        })
        .setOrigin(0.5),
    );
    this.card = c;
    this.banner = showBanner(this, 'VS', { scale: 1.4 });
  }

  private clearVisuals(): void {
    this.banner?.destroy();
    this.banner = null;
    this.card?.destroy(true);
    this.card = null;
  }

  private advance(): void {
    this.clearVisuals();
    this.stepAt = this.time.now;
    if (this.step === 'vs') {
      this.step = 'name';
      this.banner = showBanner(this, DUEL_ENEMY.name, {
        sub: `LEVEL ${DUEL_ENEMY.level}`,
      });
      return;
    }
    if (this.step === 'name') {
      this.step = 'ready';
      this.banner = showBanner(this, 'READY…');
      return;
    }
    if (this.step === 'ready') {
      this.step = 'fight';
      this.banner = showBanner(this, 'FIGHT!', { scale: 1.3 });
      // FIGHT! is combat-live immediately (the banner just lingers briefly).
      this.scene.get('duel').events.emit('intro-done');
      return;
    }
    if (this.step === 'fight') {
      this.step = 'done';
      this.scene.stop();
    }
  }
}
