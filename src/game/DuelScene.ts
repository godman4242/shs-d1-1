import Phaser from 'phaser';
import { AI_TIERS } from '../config/ai';
import {
  BLADE_CORE_WIDTH,
  BLADE_EDGE_WIDTH,
  BLADE_FADE_MS,
  BLADE_MIN_TAPER,
  BLOOD_COUNT,
  BLOOD_COUNT_SEVERED,
  BLOOD_SPEED_MAX,
  BLOOD_SPEED_MIN,
  BLOOD_SPREAD_DEG,
} from '../config/combat';
import { ENEMY_BASE, PLAYER_BASE, SKILL_VERB } from '../config/combat-sim';
import { DUEL_ENEMY, DUEL_SPAWNS } from '../config/duel';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/display';
import { FINISHER_FLASH, SLASH_ARC } from '../config/fx';
import { COL } from '../config/palette';
import { SKILL_COOLDOWN_MS } from '../config/skills';
import type { StanceId } from '../config/stances';
import { AISeamController } from '../core/AISeamController';
import { DrawnStroke } from '../core/DrawnStroke';
import { closestPointOnPolyline } from '../core/geometry';
import { mulberry32 } from '../core/rng';
import { nextStance } from '../core/stance';
import { Sim, type FighterSide } from '../core/Sim';
import type { Vec } from '../core/vec';
import { drawSamurai, ENEMY_LOOK, PLAYER_LOOK, type SamuraiPose } from './samurai';

/** Render-FX record: a finished stroke's blade trail, fading out. */
interface Trail {
  points: readonly Vec[];
  bornAt: number;
}

/** Render-FX record: one blood droplet. */
interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bornAt: number;
}

const BLOOD_LIFE_MS = 650;
const BLOOD_GRAVITY = 780; // px/s² — render feel only
const DEG_TO_RAD = Math.PI / 180;
const LETTERBOX_H = 26; // combat letterbox strip (fidelity tell 21)
const STANCE_RING: Record<StanceId, number> = {
  light: COL.focusBlue,
  balanced: COL.hatStraw,
  heavy: COL.blood,
};

/**
 * Stage-2 DuelScene — RENDER-ONLY (src/game/CLAUDE.md): builds PlayerIntent
 * from input, calls sim.advance(delta × sim.timeScale), drains SimEvents
 * into FX, and draws everything from sim state. Layout anatomy is built
 * FROM the study frames (A-00 combat frame + B-23 HUD; kickoff fidelity
 * pull-forward): bamboo/pastel parallax arena, letterbox strips, flat-color
 * bold-outline fighters, enemy "NAME (LEVEL)" + overhead green bar,
 * portrait/coins/XP HUD, skill bar, HIT COMBO plate, AUTO SLASH OFF plate.
 * Palette is the repo's trade-dress-shifted set (invariant).
 * Numeric literals here are render layout only — baselined by the M8 ratchet.
 */
export class DuelScene extends Phaser.Scene {
  private sim!: Sim;
  private fx!: Phaser.GameObjects.Graphics;
  private hud!: Phaser.GameObjects.Graphics;
  private texts!: {
    coins: Phaser.GameObjects.Text;
    xp: Phaser.GameObjects.Text;
    combo: Phaser.GameObjects.Text;
    comboPlate: Phaser.GameObjects.Text;
    nameplate: Phaser.GameObjects.Text;
    stance: Phaser.GameObjects.Text;
    autoSlash: Phaser.GameObjects.Text;
    slots: Phaser.GameObjects.Text[];
  };
  private dragPoints: Vec[] = [];
  private dragging = false;
  private trails: Trail[] = [];
  private redStrokes: Trail[] = [];
  private droplets: Droplet[] = [];
  private keys?: Record<'A' | 'D' | 'SHIFT', Phaser.Input.Keyboard.Key>;
  private telegraphUntil = 0;
  private telegraphKind: 'strike' | 'stance' = 'strike';
  private enemyGuardUntil = 0;
  private killBeatAt = 0;
  private resultLaunched = false;

  constructor() {
    super('duel');
  }

  create(): void {
    // Timescale discipline (known failure class: stuck timescale on
    // restart): pin BOTH clocks to 1 in create(), mirror sim.timeScale each
    // update, and restore on shutdown.
    this.time.timeScale = 1;
    this.tweens.timeScale = 1;
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.time.timeScale = 1;
      this.tweens.timeScale = 1;
    });
    this.killBeatAt = 0;
    this.resultLaunched = false;
    this.telegraphUntil = 0;
    this.enemyGuardUntil = 0;
    this.trails = [];
    this.redStrokes = [];
    this.droplets = [];
    this.dragPoints = [];
    this.dragging = false;

    // Seeded mulberry32 at the boundary (Math.random is banned in core/).
    // Sim and AI share one stream — call order is deterministic.
    const rng = mulberry32(Date.now());
    const opponent = new AISeamController(rng, AI_TIERS.normal);
    this.sim = new Sim(rng, opponent, {
      player: { ...PLAYER_BASE, ...DUEL_SPAWNS.player, pos: { ...DUEL_SPAWNS.player.pos } },
      enemy: { ...ENEMY_BASE, ...DUEL_SPAWNS.enemy, pos: { ...DUEL_SPAWNS.enemy.pos } },
    });

    this.drawArena();
    this.fx = this.add.graphics().setDepth(10);
    this.hud = this.add.graphics().setDepth(20);
    this.createHudTexts();

    // Intro overlay owns VS → name → READY → FIGHT!; combat goes live on
    // its signal (sim discards every pre-FIGHT stroke — gate item).
    this.events.once('intro-done', () => {
      this.sim.beginCombat();
    });
    this.scene.launch('duel-intro');

    // SPACE cycles stance; clicking the portrait swaps too (gate item).
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.sim.requestStanceSwitch('player', nextStance(this.sim.player.stance));
    });
    this.input.keyboard?.on('keydown-ONE', () => { this.sim.queueSkill('chiPunch'); });
    this.input.keyboard?.on('keydown-TWO', () => { this.sim.queueSkill('smokeBomb'); });
    this.input.keyboard?.on('keydown-THREE', () => { this.sim.queueSkill('stab'); });
    this.keys = this.input.keyboard?.addKeys('A,D,SHIFT') as Record<
      'A' | 'D' | 'SHIFT',
      Phaser.Input.Keyboard.Key
    > | undefined;

    const portraitZone = this.add.zone(88, GAME_HEIGHT - 64, 120, 96).setInteractive();
    portraitZone.on(
      'pointerdown',
      (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: { stopPropagation: () => void }) => {
        ev.stopPropagation(); // a portrait click is a UI action, not a stroke
        this.sim.requestStanceSwitch('player', nextStance(this.sim.player.stance));
      },
    );

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.dragging = true;
      this.dragPoints = [{ x: p.x, y: p.y }];
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.dragging && this.dragPoints.length < 2048) this.dragPoints.push({ x: p.x, y: p.y });
    });
    // Off-canvas releases emit 'pointerupoutside' — both must finish the
    // stroke or it is silently swallowed (Stage-1 audit finding).
    const finishDrag = (p: Phaser.Input.Pointer): void => {
      if (this.dragging) {
        this.dragPoints.push({ x: p.x, y: p.y });
        this.finishStroke();
      }
      this.dragging = false;
    };
    this.input.on('pointerup', finishDrag);
    this.input.on('pointerupoutside', finishDrag);
  }

  /** Bamboo/pastel parallax arena (fidelity tell 19, from the A-00 combat
   * frame): pastel sky, mist mounds, dark canopy, staggered bamboo rows,
   * grass band, stone lanterns, letterbox strips. */
  private drawArena(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(COL.skyTop, COL.skyTop, COL.skyLow, COL.skyLow, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Far mist mounds (pastel sage)
    g.fillStyle(COL.sage, 0.5);
    for (let i = 0; i < 5; i++) {
      const cx = i * 260 - 40 + ((i * 97) % 60);
      g.fillEllipse(cx, 430, 460, 190 + ((i * 53) % 60));
    }

    // Dark canopy ceiling (hangs into the frame)
    g.fillStyle(COL.forestDark, 0.92);
    g.fillRect(0, 0, GAME_WIDTH, 74);
    for (let i = 0; i < 13; i++) {
      const cx = i * 86 + ((i * 41) % 40);
      g.fillEllipse(cx, 84, 150, 60 + ((i * 29) % 30));
    }

    // Back bamboo row (thin, muted)
    for (let i = 0; i < 11; i++) {
      const bx = 30 + i * 96 + ((i * 37) % 28);
      this.drawBamboo(g, bx, 12 + ((i * 13) % 10), COL.forestShadow, 0.85);
    }
    // Mid grass mounds
    g.fillStyle(COL.forestBright, 0.9);
    for (let i = 0; i < 4; i++) {
      g.fillEllipse(140 + i * 280, 470, 340, 130);
    }
    // Front bamboo row (bold)
    for (let i = 0; i < 7; i++) {
      const bx = 70 + i * 150 + ((i * 61) % 44);
      this.drawBamboo(g, bx, 20 + ((i * 17) % 12), COL.forestMid2, 1);
    }

    // Stone lanterns on the ground band (arena dressing from the frame)
    for (const lx of [150, 560]) {
      g.fillStyle(COL.outline, 0.9);
      g.fillRect(lx - 12, 396, 24, 40);
      g.fillTriangle(lx - 20, 400, lx + 20, 400, lx, 382);
      g.fillStyle(COL.kimono2, 0.85);
      g.fillRect(lx - 8, 404, 16, 12);
    }

    // Grass band + foreground shadow
    g.fillStyle(COL.forestMid, 1);
    g.fillRect(0, 436, GAME_WIDTH, GAME_HEIGHT - 436);
    g.fillStyle(COL.forestBright, 1);
    g.fillRect(0, 436, GAME_WIDTH, 9);
    g.fillStyle(COL.forestDark, 1);
    g.fillRect(0, 516, GAME_WIDTH, GAME_HEIGHT - 516);

    // Combat letterbox strips
    g.fillStyle(COL.outline, 1);
    g.fillRect(0, 0, GAME_WIDTH, LETTERBOX_H);
    g.fillRect(0, GAME_HEIGHT - LETTERBOX_H, GAME_WIDTH, LETTERBOX_H);
  }

  /** One bamboo stalk: segmented vertical culm with node lines + leaves. */
  private drawBamboo(g: Phaser.GameObjects.Graphics, x: number, w: number, color: number, alpha: number): void {
    g.fillStyle(COL.outline, alpha);
    g.fillRect(x - w / 2 - 2, 60, w + 4, 380);
    g.fillStyle(color, alpha);
    g.fillRect(x - w / 2, 60, w, 380);
    g.fillStyle(COL.forestShadow, alpha);
    for (let y = 100; y < 440; y += 62) g.fillRect(x - w / 2, y, w, 4);
    g.fillStyle(color, alpha * 0.9);
    g.fillEllipse(x - w, 96, 34, 10);
    g.fillEllipse(x + w, 150, 30, 9);
  }

  private createHudTexts(): void {
    const style = (size: number, color = '#efedc2'): Phaser.Types.GameObjects.Text.TextStyle => ({
      fontFamily: 'Georgia, serif',
      fontStyle: 'bold',
      fontSize: `${size}px`,
      color,
      stroke: '#040304',
      strokeThickness: 4,
    });
    this.texts = {
      coins: this.add.text(56, 34, '0', style(20)).setDepth(21),
      xp: this.add.text(GAME_WIDTH - 24, 34, '0 / 550  XP', style(18)).setOrigin(1, 0).setDepth(21),
      combo: this.add
        .text(GAME_WIDTH - 60, 74, '', {
          ...style(64, '#c81a10'),
          fontStyle: 'bold italic',
          strokeThickness: 6,
        })
        .setOrigin(1, 0)
        .setDepth(21),
      comboPlate: this.add
        .text(GAME_WIDTH - 24, 148, '', { ...style(16), backgroundColor: '#040304' })
        .setOrigin(1, 0)
        .setDepth(21),
      nameplate: this.add
        .text(0, 0, `${DUEL_ENEMY.name} (${DUEL_ENEMY.level})`, style(16, '#c81a10'))
        .setOrigin(0.5, 1)
        .setDepth(21),
      stance: this.add.text(150, GAME_HEIGHT - 40, '', style(14)).setDepth(21),
      autoSlash: this.add
        .text(24, 60, 'AUTO SLASH OFF', { ...style(14), backgroundColor: '#794802' })
        .setPadding(8, 4, 8, 4)
        .setDepth(21),
      slots: [1, 2, 3].map((n, i) =>
        this.add
          .text(GAME_WIDTH / 2 - 90 + i * 74, GAME_HEIGHT - 62, String(n), style(16))
          .setDepth(22),
      ),
    };
  }

  private finishStroke(): void {
    const stroke = new DrawnStroke(this.dragPoints);
    this.dragPoints = [];
    if (stroke.points.length < 2) return;

    const now = this.time.now;
    this.redStrokes.push({ points: stroke.points, bornAt: now });

    const outcome = this.sim.applyStroke(stroke);
    if (outcome.gesture !== 'slash') return;

    this.trails.push({ points: stroke.points, bornAt: now });
    if (outcome.slash?.hit === true) {
      const enemyPos = this.sim.enemy.pos;
      const impact = closestPointOnPolyline(enemyPos, stroke.points) ?? enemyPos;
      const severed = outcome.slash.severed.length > 0;
      this.spawnBlood(impact, stroke.direction, severed, now);
    }
  }

  /** Directional burst along the cut: right cut → 0°, left cut → 180°. */
  private spawnBlood(at: Vec, direction: Vec, severed: boolean, now: number): void {
    const count = severed ? BLOOD_COUNT_SEVERED : BLOOD_COUNT;
    const baseAngle = Math.atan2(direction.y, direction.x);
    const spread = BLOOD_SPREAD_DEG * DEG_TO_RAD;
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * spread;
      const speed = BLOOD_SPEED_MIN + Math.random() * (BLOOD_SPEED_MAX - BLOOD_SPEED_MIN);
      this.droplets.push({
        x: at.x,
        y: at.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        bornAt: now,
      });
    }
  }

  override update(_time: number, delta: number): void {
    // Held-state intent BEFORE advancing: A/D movement + SHIFT Shunpo.
    const moveX = (this.keys?.D.isDown === true ? 1 : 0) - (this.keys?.A.isDown === true ? 1 : 0);
    this.sim.setPlayerIntent({ moveX, shunpoHeld: this.keys?.SHIFT.isDown === true });

    // Sim owns the fixed-step accumulator; the scene forwards
    // delta × sim.timeScale (spec item 11 — Shunpo slow-mo).
    this.sim.advance(delta * this.sim.timeScale);

    // Mirror the sim timescale onto Phaser's clocks TOGETHER (tween/timer FX
    // must slow with the fight); the kill beat overrides below.
    const now = this.time.now;
    const inKillBeat = this.killBeatAt > 0 && now - this.killBeatAt < FINISHER_FLASH.durationMs;
    const ts = inKillBeat ? FINISHER_FLASH.slowMoScale : this.sim.timeScale;
    this.time.timeScale = ts;
    this.tweens.timeScale = ts;

    for (const ev of this.sim.drainEvents()) {
      if (ev.type === 'enemyTelegraph') {
        this.telegraphUntil = now + ev.durationMs;
        this.telegraphKind = ev.kind;
      } else if (ev.type === 'strikeBlocked') {
        this.enemyGuardUntil = now + 260;
      } else if (ev.type === 'damage' && ev.target === 'player') {
        const p = this.sim.player.pos;
        this.spawnBlood({ x: p.x, y: p.y - 20 }, { x: -1, y: 0 }, false, now);
      } else if (ev.type === 'fightEnded') {
        this.killBeatAt = now;
        this.pendingWinner = ev.winner;
      }
    }

    // Kill beat (SYNTHESIS §4): hard hold on the frozen frame, then the
    // result screen. FINISHER_FLASH drives the flash + slow-mo ramp.
    if (this.killBeatAt > 0 && !this.resultLaunched && now - this.killBeatAt >= 900) {
      this.resultLaunched = true;
      this.time.timeScale = 1;
      this.tweens.timeScale = 1;
      this.scene.launch('duel-result', { winner: this.pendingWinner });
    }

    const dt = delta / 1000;
    const g = this.fx;
    g.clear();

    // Live drag: the red directional stroke (SLASH_ARC render path)
    if (this.dragging && this.dragPoints.length > 1) {
      this.strokePinched(g, this.dragPoints, COL.blood, SLASH_ARC.bodyHalfWidth, 0.35, SLASH_ARC.minTaper, SLASH_ARC.taperPow);
      this.strokePinched(g, this.dragPoints, COL.bloodBright, SLASH_ARC.coreHalfWidth, 0.8, SLASH_ARC.minTaper, SLASH_ARC.taperPow);
    }
    this.redStrokes = this.redStrokes.filter((s) => now - s.bornAt < SLASH_ARC.hangMs + SLASH_ARC.fadeMs);
    for (const s of this.redStrokes) {
      const age = now - s.bornAt;
      const alpha = age < SLASH_ARC.hangMs ? 1 : 1 - (age - SLASH_ARC.hangMs) / SLASH_ARC.fadeMs;
      this.strokePinched(g, s.points, COL.blood, SLASH_ARC.bodyHalfWidth, 0.3 * alpha, SLASH_ARC.minTaper, SLASH_ARC.taperPow);
      this.strokePinched(g, s.points, COL.bloodBright, SLASH_ARC.coreHalfWidth, 0.7 * alpha, SLASH_ARC.minTaper, SLASH_ARC.taperPow);
    }

    // Two-layer blade trail: chi-colored edge under a white core, fading
    this.trails = this.trails.filter((t) => now - t.bornAt < BLADE_FADE_MS);
    for (const t of this.trails) {
      const alpha = 1 - (now - t.bornAt) / BLADE_FADE_MS;
      this.strokePinched(g, t.points, COL.bladeChi, BLADE_EDGE_WIDTH, alpha, BLADE_MIN_TAPER, 1);
      this.strokePinched(g, t.points, COL.kimono, BLADE_CORE_WIDTH, alpha, BLADE_MIN_TAPER, 1);
    }

    // Blood droplets: integrate, then draw
    this.droplets = this.droplets.filter((d) => now - d.bornAt < BLOOD_LIFE_MS);
    for (const d of this.droplets) {
      d.vy += BLOOD_GRAVITY * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      const alpha = 1 - (now - d.bornAt) / BLOOD_LIFE_MS;
      g.fillStyle(COL.bloodBright, alpha);
      g.fillCircle(d.x, d.y, 3);
      g.fillStyle(COL.blood, alpha * 0.8);
      g.fillCircle(d.x - d.vx * 0.008, d.y - d.vy * 0.008, 2);
    }

    this.drawFighters(g, now);

    // Kunai: short dark bolts along the velocity direction.
    for (const k of this.sim.projectiles) {
      const mag = Math.hypot(k.vel.x, k.vel.y) || 1;
      const dx = (k.vel.x / mag) * 14;
      const dy = (k.vel.y / mag) * 14;
      g.lineStyle(3, COL.outline, 1);
      g.beginPath();
      g.moveTo(k.pos.x - dx, k.pos.y - dy);
      g.lineTo(k.pos.x, k.pos.y);
      g.strokePath();
      g.fillStyle(COL.kimono, 1);
      g.fillCircle(k.pos.x, k.pos.y, 2.5);
    }

    // Kill-beat flash: hard red cut over everything, snapping in fast.
    if (this.killBeatAt > 0) {
      const age = now - this.killBeatAt;
      const a =
        age < FINISHER_FLASH.snapInMs
          ? age / FINISHER_FLASH.snapInMs
          : Math.max(0, 1 - (age - FINISHER_FLASH.snapInMs) / FINISHER_FLASH.durationMs);
      g.fillStyle(COL.bloodDark, 0.85 * a);
      g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    this.drawHud(now);
  }

  private pendingWinner: FighterSide = 'player';

  private drawFighters(g: Phaser.GameObjects.Graphics, now: number): void {
    const player = this.sim.player;
    const enemy = this.sim.enemy;

    // Spawn-invuln / i-frame blink (research CONTRACT: blinking indicator).
    const blinkOff = Math.floor(now / 100) % 2 === 0;
    const playerAlpha = player.invulnerable && blinkOff ? 0.25 : 1;

    // Enemy windup flash: pulsing aura (red strike / blue pending stance).
    if (now < this.telegraphUntil) {
      const pulse = 0.3 + 0.3 * Math.abs(Math.sin(now / 90));
      g.fillStyle(this.telegraphKind === 'strike' ? COL.blood : COL.focusBlue, pulse);
      g.fillEllipse(enemy.pos.x, enemy.pos.y + 30, 120, 40);
    }

    const enemyPose: SamuraiPose =
      now < this.enemyGuardUntil ? 'guard' : now < this.telegraphUntil ? 'windup' : 'idle';
    const playerFacing = player.pos.x <= enemy.pos.x ? 1 : -1;
    drawSamurai(g, player.pos.x, player.pos.y + 60, playerFacing, PLAYER_LOOK, 'idle', playerAlpha);
    drawSamurai(g, enemy.pos.x, enemy.pos.y + 60, playerFacing === 1 ? -1 : 1, ENEMY_LOOK, enemyPose);

    // Enemy overhead: green HP bar + nameplate (fidelity tell 22).
    const barW = 76;
    const ex = enemy.pos.x;
    const ey = enemy.pos.y - 92;
    g.fillStyle(COL.outline, 0.9);
    g.fillRect(ex - barW / 2 - 1, ey - 1, barW + 2, 9);
    g.fillStyle(COL.healthGreen, 1);
    g.fillRect(ex - barW / 2, ey, (barW * enemy.hp) / enemy.maxHp, 7);
    this.texts.nameplate.setPosition(ex, ey - 4);
  }

  private drawHud(now: number): void {
    const g = this.hud;
    g.clear();
    const player = this.sim.player;

    // Low-HP red vignette: ramps from 50% HP (SYNTHESIS §4).
    const hpFrac = player.hp / player.maxHp;
    if (hpFrac < 0.5) {
      const a = ((0.5 - hpFrac) / 0.5) * 0.4;
      g.fillStyle(COL.blood, a);
      g.fillRect(0, 0, GAME_WIDTH, 60);
      g.fillRect(0, GAME_HEIGHT - 60, GAME_WIDTH, 60);
      g.fillRect(0, 0, 46, GAME_HEIGHT);
      g.fillRect(GAME_WIDTH - 46, 0, 46, GAME_HEIGHT);
    }

    // Top-left: coin token (HUD anatomy from the B-23 frame).
    g.fillStyle(COL.outline, 1);
    g.fillCircle(38, 44, 13);
    g.fillStyle(COL.gold, 1);
    g.fillCircle(38, 44, 11);

    // Top-right: XP bar under the label.
    g.fillStyle(COL.outline, 0.9);
    g.fillRect(GAME_WIDTH - 204, 58, 180, 10);
    g.fillStyle(COL.gold, 1);
    g.fillRect(GAME_WIDTH - 203, 59, 2, 8); // 0 XP — progression is Stage 3

    // Bottom-left: portrait in stance-colored ring + bars.
    const px = 88;
    const py = GAME_HEIGHT - 64;
    g.fillStyle(COL.outline, 1);
    g.fillCircle(px - 24, py, 34);
    g.fillStyle(STANCE_RING[player.stance], 1);
    g.fillCircle(px - 24, py, 31);
    g.fillStyle(COL.kimono2, 1);
    g.fillCircle(px - 24, py, 25);
    // mini kasa on the portrait head
    g.fillStyle(COL.outline, 1);
    g.fillTriangle(px - 46, py - 6, px - 2, py - 6, px - 24, py - 24);
    g.fillStyle(COL.hatStraw, 1);
    g.fillTriangle(px - 43, py - 7, px - 5, py - 7, px - 24, py - 22);

    // HP (green) / Focus (blue) bars — gate: SPACE swap drains the blue bar.
    const bx = px + 18;
    g.fillStyle(COL.outline, 0.9);
    g.fillRect(bx - 1, py - 21, 152, 12);
    g.fillRect(bx - 1, py - 5, 152, 12);
    g.fillStyle(COL.healthGreen, 1);
    g.fillRect(bx, py - 20, (150 * player.hp) / player.maxHp, 10);
    g.fillStyle(COL.focusBlue, 1);
    g.fillRect(bx, py - 4, (150 * player.focus) / 100, 10);
    // Shunpo sliver + Critical sliver (spec meters; thin INFERRED strips).
    g.fillStyle(COL.kimono, 0.9);
    g.fillRect(bx, py + 10, (150 * this.sim.shunpo) / 100, 3);
    g.fillStyle(COL.gold, 0.9);
    g.fillRect(bx, py + 15, (150 * player.critical) / 100, 3);

    // Bottom-center: skill bar (3 numbered slots + cooldown sweep).
    const verbs = [SKILL_VERB[1], SKILL_VERB[2], SKILL_VERB[3]];
    verbs.forEach((verb, i) => {
      if (verb === undefined) return;
      const sx = GAME_WIDTH / 2 - 100 + i * 74;
      const sy = GAME_HEIGHT - 76;
      g.fillStyle(COL.outline, 0.92);
      g.fillRoundedRect(sx, sy, 56, 56, 10);
      g.fillStyle(COL.wood, 1);
      g.fillRoundedRect(sx + 3, sy + 3, 50, 50, 8);
      const remaining = this.sim.cooldownRemainingS(verb);
      const total = SKILL_COOLDOWN_MS[verb] / 1000;
      if (remaining > 0) {
        g.fillStyle(COL.outline, 0.65);
        g.fillRoundedRect(sx + 3, sy + 3, 50, 50 * Math.min(1, remaining / total), 8);
      }
    });

    // HUD texts (values from sim state each frame — render-only scene).
    this.texts.combo.setText(this.sim.combo > 1 ? String(this.sim.combo) : '');
    this.texts.comboPlate.setText(this.sim.combo > 1 ? ' HIT COMBO ' : '');
    this.texts.stance.setText(`${player.stance.toUpperCase()} STANCE`);
    void now;
  }

  /**
   * Polyline with pinched tips: width peaks mid-stroke, floors at minTaper.
   * Each render path passes ITS OWN taper (SLASH_ARC.minTaper/taperPow for
   * the red stroke, BLADE_MIN_TAPER for the trail) — conflating them left
   * SLASH_ARC.taperPow/minTaper dead (audit finding).
   */
  private strokePinched(
    g: Phaser.GameObjects.Graphics,
    points: readonly Vec[],
    color: number,
    baseWidth: number,
    alpha: number,
    minTaper: number,
    taperPow: number,
  ): void {
    const n = points.length;
    for (let i = 1; i < n; i++) {
      const a = points[i - 1];
      const b = points[i];
      if (a === undefined || b === undefined) continue;
      const t = i / (n - 1);
      const pinch = Math.max(minTaper, Math.sin(Math.PI * t) ** taperPow);
      g.lineStyle(baseWidth * pinch, color, alpha);
      g.beginPath();
      g.moveTo(a.x, a.y);
      g.lineTo(b.x, b.y);
      g.strokePath();
    }
  }
}
