/**
 * ENCOUNTER SCENE — SESSION14 A4 (D3). A CROWD fight, not a duel.
 *
 * ⚠️ A SEPARATE SCENE, ON PURPOSE — `DuelScene` is not touched (D3, and
 * SESSION13 §2's SCOPE TRAP). A duel is a NAMED 1v1: white nameplate, VS card,
 * win/defeat cards, an opponent whose HP is derived from the player's stats so
 * the fight lasts K hits. An encounter is a crowd of trash mobs that die in ONE
 * hit. Putting a mode flag on `DuelScene` is exactly how the one-hit-kill rule
 * would leak into the duel.
 *
 * Shared with the duel: `Sim`, the damage pipeline, the fighter art, the HUD
 * chrome. NOT shared: the VS intro, the named nameplate, the result card,
 * `deriveEnemy`.
 *
 * Render-only, like every scene here: `Sim` owns all state, including corpse
 * lifetimes. The popups are pure FX driven off `damage` events.
 */
import Phaser from 'phaser';
import { AI_TIERS } from '../config/ai';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/display';
import { ENCOUNTER_GROUND_Y } from '../config/mobs';
import { COL } from '../config/palette';
import { DAMAGE_POPUP } from '../config/popups';
import { SLASH_ARC } from '../config/fx';
import { AISeamController } from '../core/AISeamController';
import { DrawnStroke } from '../core/DrawnStroke';
import { advanceFxClock } from '../core/fx';
import { popupExpired, popupFrame, popupFromDamage, type PopupSpec } from '../core/damagePopup';
import { encounterSetup } from '../core/encounterSetup';
import { mulberry32 } from '../core/rng';
import { FighterAnimator } from '../core/fighterAnimator';
import { Sim } from '../core/Sim';
import { stageToWorld, worldToStage } from '../core/viewport';
import type { Vec } from '../core/vec';
import { drawSamurai, ENEMY_LOOK, PLAYER_LOOK } from './samurai';

/** One rising numeral. `at` is STAGE space; `bornAt` is on the FX clock. */
interface Popup extends PopupSpec {
  at: Vec;
  bornAt: number;
}

interface Trail {
  points: readonly Vec[];
  bornAt: number;
}

export class EncounterScene extends Phaser.Scene {
  private sim!: Sim;
  private fx!: Phaser.GameObjects.Graphics;
  private hud!: Phaser.GameObjects.Graphics;
  private playerAnim!: FighterAnimator;
  private mobAnims: FighterAnimator[] = [];
  private popups: Popup[] = [];
  private trails: Trail[] = [];
  private dragging = false;
  private dragPoints: Vec[] = [];
  private fxNow = 0;
  private lastPlayerX = 0;
  private comboText!: Phaser.GameObjects.Text;

  constructor() {
    super('encounter');
  }

  create(): void {
    this.popups = [];
    this.trails = [];
    this.dragging = false;
    this.dragPoints = [];
    this.fxNow = 0;

    // One shared mulberry32 stream, exactly like the duel — but EVERY mob gets
    // its OWN controller instance (they carry telegraph/mode state, and one
    // shared machine would interleave eight fighters' decisions).
    const rng = mulberry32(Date.now());
    this.sim = new Sim(rng, encounterSetup(() => new AISeamController(rng, AI_TIERS.normal)));

    this.playerAnim = new FighterAnimator();
    this.mobAnims = this.sim.enemies.map(() => new FighterAnimator());
    this.lastPlayerX = worldToStage(this.sim.player.pos).x;

    this.drawArena();
    this.fx = this.add.graphics().setDepth(10);
    this.hud = this.add.graphics().setDepth(20);
    this.comboText = this.add
      .text(GAME_WIDTH / 2, 60, '', { fontFamily: 'monospace', fontSize: '28px', color: '#f4be09' })
      .setOrigin(0.5)
      .setDepth(21);

    // No VS card and no READY countdown: an encounter simply starts.
    this.sim.beginCombat();

    // INPUT BOUNDARY: pointer arrives in stage px, converted to WORLD once here.
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.dragging = true;
      this.dragPoints = [stageToWorld({ x: p.x, y: p.y })];
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.dragging) this.dragPoints.push(stageToWorld({ x: p.x, y: p.y }));
    });
    const release = (): void => {
      if (!this.dragging) return;
      this.dragging = false;
      const points = this.dragPoints;
      this.dragPoints = [];
      if (points.length < 2) return;
      const stroke = new DrawnStroke(points);
      const outcome = this.sim.applyStroke(stroke);
      if (outcome.gesture === 'slash') {
        this.playerAnim.startSlash(this.sim.player.stance);
        this.trails.push({ points: outcome.cutPoints, bornAt: this.fxNow });
      }
    };
    this.input.on('pointerup', release);
    this.input.on('pointerupoutside', release);
    this.input.keyboard?.on('keydown-R', () => { this.scene.restart(); });
  }

  private drawArena(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(COL.skyTop, COL.skyTop, COL.skyLow, COL.skyLow, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const groundStageY = worldToStage({ x: 0, y: ENCOUNTER_GROUND_Y }).y;
    g.fillStyle(COL.forestShadow, 1);
    g.fillRect(0, groundStageY, GAME_WIDTH, GAME_HEIGHT - groundStageY);
    g.fillStyle(COL.forestDark, 1);
    g.fillRect(0, groundStageY, GAME_WIDTH, 6);
  }

  override update(_time: number, delta: number): void {
    this.sim.advance(delta * this.sim.timeScale);
    this.fxNow = advanceFxClock(this.fxNow, delta, this.sim.timeScale);
    const fxNow = this.fxNow;

    for (const ev of this.sim.drainEvents()) {
      if (ev.type === 'damage') {
        // Popups are pure FX off an existing event — no gameplay coupling (D9).
        const victim =
          ev.target === 'player'
            ? this.sim.player
            : this.sim.enemies[this.sim.enemyIds.indexOf(ev.target)];
        if (victim !== undefined) {
          const at = worldToStage(victim.pos);
          this.popups.push({
            ...popupFromDamage(ev, 'player'),
            at: { x: at.x, y: at.y - DAMAGE_POPUP.spawnAboveStagePx },
            bornAt: fxNow,
          });
        }
        const idx = this.sim.enemyIds.indexOf(ev.target);
        if (idx >= 0) this.mobAnims[idx]?.startHit();
        else this.playerAnim.startHit();
      } else if (ev.type === 'comboChanged') {
        this.comboText.setText(ev.value > 1 ? `${String(ev.value)} HIT COMBO` : '');
      }
    }

    // Dead mobs collapse; the Sim owns how long the corpse lingers.
    this.sim.enemies.forEach((e, i) => {
      const anim = this.mobAnims[i];
      if (anim !== undefined && e.hp === 0 && !anim.isDead) anim.startDeath();
    });

    this.popups = this.popups.filter((p) => !popupExpired(fxNow - p.bornAt));
    this.trails = this.trails.filter((t) => fxNow - t.bornAt < SLASH_ARC.hangMs + SLASH_ARC.fadeMs);

    this.render(delta, fxNow);
  }

  private render(delta: number, fxNow: number): void {
    const g = this.fx;
    g.clear();

    // Blade trails, world → stage at the draw boundary.
    for (const t of this.trails) {
      const age = fxNow - t.bornAt;
      const alpha = Math.max(0, 1 - age / (SLASH_ARC.hangMs + SLASH_ARC.fadeMs));
      g.lineStyle(SLASH_ARC.coreHalfWidth, COL.blood, alpha);
      g.beginPath();
      t.points.forEach((p, i) => {
        const s = worldToStage(p);
        if (i === 0) g.moveTo(s.x, s.y);
        else g.lineTo(s.x, s.y);
      });
      g.strokePath();
    }

    // Live drag.
    if (this.dragging && this.dragPoints.length > 1) {
      g.lineStyle(SLASH_ARC.coreHalfWidth, COL.bloodBright, 0.8);
      g.beginPath();
      this.dragPoints.forEach((p, i) => {
        const s = worldToStage(p);
        if (i === 0) g.moveTo(s.x, s.y);
        else g.lineTo(s.x, s.y);
      });
      g.strokePath();
    }

    // Mobs first, then the player on top.
    this.sim.enemies.forEach((e, i) => {
      const anim = this.mobAnims[i];
      if (anim === undefined || e.corpseAlpha === 0) return;
      const s = worldToStage(e.pos);
      const pose = anim.update(delta, 0);
      drawSamurai(g, s.x, s.y, e.pos.x < this.sim.player.pos.x ? 1 : -1, ENEMY_LOOK, pose, e.corpseAlpha);
    });

    const ps = worldToStage(this.sim.player.pos);
    const playerPose = this.playerAnim.update(delta, ps.x - this.lastPlayerX);
    this.lastPlayerX = ps.x;
    drawSamurai(g, ps.x, ps.y, 1, PLAYER_LOOK, playerPose, 1);

    // Damage popups, on top of everything.
    for (const p of this.popups) {
      const f = popupFrame(fxNow - p.bornAt);
      g.fillStyle(p.color, f.alpha);
      // Drawn as a scaling block per digit rather than a Text object: Graphics
      // is the project's only render primitive (procedural vector art only).
      // The glyph box is the MEASURED 29×40 @1080, converted to stage space in
      // config, so the popup is the right SIZE even while the digit shapes
      // themselves are still placeholder blocks.
      const w = DAMAGE_POPUP.glyphStagePx.w * f.scale;
      const h = DAMAGE_POPUP.glyphStagePx.h * f.scale;
      p.text.split('').forEach((_, i) => {
        g.fillRect(p.at.x + (i - p.text.length / 2) * w, p.at.y + f.dy, w, h);
      });
    }

    this.drawHud();
  }

  private drawHud(): void {
    const g = this.hud;
    g.clear();
    const player = this.sim.player;
    g.fillStyle(COL.barBrown, 1);
    g.fillRect(24, 24, 220, 18);
    g.fillStyle(COL.healthGreen, 1);
    g.fillRect(24, 24, 220 * Math.max(0, player.hp / player.maxHp), 18);
    const alive = this.sim.enemies.filter((e) => e.hp > 0).length;
    g.fillStyle(COL.plateBrown, 0.85);
    g.fillRect(GAME_WIDTH - 150, 24, 126, 26);
    g.fillStyle(COL.enemyGreen, 1);
    for (let i = 0; i < alive; i++) g.fillRect(GAME_WIDTH - 140 + i * 14, 32, 9, 10);
  }
}
