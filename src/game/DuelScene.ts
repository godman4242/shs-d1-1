import Phaser from 'phaser';
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
import { DUEL_ATTACKER, DUMMY_SPAWN } from '../config/duel';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/display';
import { SLASH_ARC } from '../config/fx';
import { COL } from '../config/palette';
import { FIXED_HZ } from '../config/timing';
import { DrawnStroke } from '../core/DrawnStroke';
import { closestPointOnPolyline } from '../core/geometry';
import type { OpponentController } from '../core/OpponentController';
import { Sim } from '../core/Sim';
import type { Vec } from '../core/vec';

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

/**
 * Stage 1 DuelScene — RENDER-ONLY (src/game/CLAUDE.md). `Sim` owns the
 * fighter's HP/position/jump; this scene builds strokes from pointer drags,
 * hands them to sim.applyStroke, and draws: layered forest, the fighter
 * capsule + HP bar, the red directional stroke (SLASH_ARC), the two-layer
 * blade trail (white core in a chi-colored edge, pinched tips), and
 * directional blood. Numeric literals here are render layout/feel only —
 * tolerated until the Stage 2 ratchet; every gameplay number is config/core.
 */
export class DuelScene extends Phaser.Scene {
  private sim!: Sim;
  private fx!: Phaser.GameObjects.Graphics;
  private dragPoints: Vec[] = [];
  private dragging = false;
  private trails: Trail[] = [];
  private redStrokes: Trail[] = [];
  private droplets: Droplet[] = [];
  private simAccMs = 0;

  constructor() {
    super('duel');
  }

  create(): void {
    const opponent: OpponentController = { next: () => ({}) }; // Stage 2: AISeamController
    this.sim = new Sim(Math.random, opponent, { ...DUMMY_SPAWN, pos: { ...DUMMY_SPAWN.pos } });

    this.drawForest();
    this.fx = this.add.graphics();

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.dragging = true;
      this.dragPoints = [{ x: p.x, y: p.y }];
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.dragging && this.dragPoints.length < 2048) this.dragPoints.push({ x: p.x, y: p.y });
    });
    this.input.on('pointerup', (p: Phaser.Input.Pointer) => {
      if (this.dragging) {
        this.dragPoints.push({ x: p.x, y: p.y }); // release point is part of the stroke
        this.finishStroke();
      }
      this.dragging = false;
    });
  }

  /** Multi-layer forest: sky → far mountains → canopy → tree rows → ground. */
  private drawForest(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(COL.skyTop, COL.skyTop, COL.skyLow, COL.skyLow, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Far mountain silhouettes (pastel, misty)
    g.fillStyle(COL.sage, 0.55);
    for (let i = 0; i < 5; i++) {
      const cx = i * 260 - 40 + ((i * 97) % 60);
      const h = 150 + ((i * 53) % 70);
      g.fillTriangle(cx - 190, 400, cx, 400 - h, cx + 190, 400);
    }

    // Canopy blobs behind the treeline
    g.fillStyle(COL.canopy, 0.8);
    for (let i = 0; i < 12; i++) {
      const cx = i * 92 + ((i * 41) % 30);
      g.fillCircle(cx, 320 + ((i * 29) % 26), 46 + ((i * 17) % 18));
    }

    // Mid treeline (two staggered rows of conifer silhouettes)
    const rows: Array<{ col: number; baseY: number; h: number; step: number; off: number }> = [
      { col: COL.forestMid2, baseY: 452, h: 130, step: 74, off: 8 },
      { col: COL.forestShadow, baseY: 462, h: 156, step: 88, off: 46 },
    ];
    for (const row of rows) {
      g.fillStyle(row.col, 1);
      for (let x = -20 + row.off; x < GAME_WIDTH + 40; x += row.step) {
        const h = row.h + ((x * 31) % 34);
        g.fillTriangle(x - 34, row.baseY, x, row.baseY - h, x + 34, row.baseY);
        g.fillRect(x - 4, row.baseY - 10, 8, 14);
      }
    }

    // Grass band the fighter stands on, then foreground shadow band
    g.fillStyle(COL.forestMid, 1);
    g.fillRect(0, 448, GAME_WIDTH, GAME_HEIGHT - 448);
    g.fillStyle(COL.forestBright, 1);
    g.fillRect(0, 448, GAME_WIDTH, 10);
    g.fillStyle(COL.forestDark, 1);
    g.fillRect(0, 512, GAME_WIDTH, GAME_HEIGHT - 512);
    g.fillStyle(COL.trunk, 0.9);
    for (let i = 0; i < 6; i++) {
      const cx = i * 210 + ((i * 71) % 48);
      g.fillEllipse(cx, 556, 150, 26);
    }
  }

  private finishStroke(): void {
    const stroke = new DrawnStroke(this.dragPoints);
    this.dragPoints = [];
    if (stroke.points.length < 2) return;

    const now = this.time.now;
    this.redStrokes.push({ points: stroke.points, bornAt: now });

    const outcome = this.sim.applyStroke(stroke, { ...DUEL_ATTACKER, crit: false });
    if (outcome.gesture !== 'slash') return;

    this.trails.push({ points: stroke.points, bornAt: now });
    if (outcome.slash?.hit === true) {
      const impact =
        closestPointOnPolyline(this.sim.fighter.pos, stroke.points) ?? this.sim.fighter.pos;
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

  /** Polyline with pinched tips: width peaks mid-stroke, BLADE_MIN_TAPER at ends. */
  private strokePinched(
    g: Phaser.GameObjects.Graphics,
    points: readonly Vec[],
    color: number,
    baseWidth: number,
    alpha: number,
  ): void {
    const n = points.length;
    for (let i = 1; i < n; i++) {
      const a = points[i - 1];
      const b = points[i];
      if (a === undefined || b === undefined) continue;
      const t = i / (n - 1);
      const pinch = Math.max(BLADE_MIN_TAPER, Math.sin(Math.PI * t));
      g.lineStyle(baseWidth * pinch, color, alpha);
      g.beginPath();
      g.moveTo(a.x, a.y);
      g.lineTo(b.x, b.y);
      g.strokePath();
    }
  }

  override update(_time: number, delta: number): void {
    // Fixed-step accumulator: sim time follows the wall clock at FIXED_HZ even
    // when Chrome throttles rendering (occluded-window fps drop found in the
    // Stage 1 browser verify). 250 = Stage 2's MAX_FRAME_MS clamp, inlined
    // until config/combat-sim.ts exists.
    this.simAccMs += Math.min(delta, 250);
    const stepMs = 1000 / FIXED_HZ;
    while (this.simAccMs >= stepMs) {
      this.sim.tick();
      this.simAccMs -= stepMs;
    }

    const now = this.time.now;
    const dt = delta / 1000;
    const g = this.fx;
    g.clear();

    // Live drag: the red directional stroke (SLASH_ARC render path)
    if (this.dragging && this.dragPoints.length > 1) {
      this.strokePinched(g, this.dragPoints, COL.blood, SLASH_ARC.bodyHalfWidth, 0.35);
      this.strokePinched(g, this.dragPoints, COL.bloodBright, SLASH_ARC.coreHalfWidth, 0.8);
    }
    this.redStrokes = this.redStrokes.filter((s) => now - s.bornAt < SLASH_ARC.hangMs + SLASH_ARC.fadeMs);
    for (const s of this.redStrokes) {
      const age = now - s.bornAt;
      const alpha = age < SLASH_ARC.hangMs ? 1 : 1 - (age - SLASH_ARC.hangMs) / SLASH_ARC.fadeMs;
      this.strokePinched(g, s.points, COL.blood, SLASH_ARC.bodyHalfWidth, 0.3 * alpha);
      this.strokePinched(g, s.points, COL.bloodBright, SLASH_ARC.coreHalfWidth, 0.7 * alpha);
    }

    // Two-layer blade trail: chi-colored edge under a white core, fading
    this.trails = this.trails.filter((t) => now - t.bornAt < BLADE_FADE_MS);
    for (const t of this.trails) {
      const alpha = 1 - (now - t.bornAt) / BLADE_FADE_MS;
      this.strokePinched(g, t.points, COL.bladeChi, BLADE_EDGE_WIDTH, alpha);
      this.strokePinched(g, t.points, COL.kimono, BLADE_CORE_WIDTH, alpha);
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

    this.drawFighter(g);
  }

  /** Fighter capsule + overhead HP bar, straight from sim state. */
  private drawFighter(g: Phaser.GameObjects.Graphics): void {
    const { pos, hp } = this.sim.fighter;
    const w = DUMMY_SPAWN.halfW * 2;
    const h = DUMMY_SPAWN.halfH * 2;
    const left = pos.x - DUMMY_SPAWN.halfW;
    const top = pos.y - DUMMY_SPAWN.halfH;

    g.fillStyle(COL.outline, 1);
    g.fillRoundedRect(left - 3, top - 3, w + 6, h + 6, DUMMY_SPAWN.halfW + 3);
    g.fillStyle(COL.haoriEnemy, 1);
    g.fillRoundedRect(left, top, w, h, DUMMY_SPAWN.halfW);
    g.fillStyle(COL.kimono, 1);
    g.fillCircle(pos.x, top + 18, 13); // head
    g.fillStyle(COL.scarf, 1);
    g.fillRect(left + 4, top + 32, w - 8, 7); // scarf band

    // Overhead HP bar (green on dark, like the original's enemy bars)
    const barW = 64;
    const barX = pos.x - barW / 2;
    const barY = top - 18;
    g.fillStyle(COL.outline, 0.85);
    g.fillRect(barX - 1, barY - 1, barW + 2, 8);
    g.fillStyle(COL.healthGreen, 1);
    g.fillRect(barX, barY, (barW * hp) / DUMMY_SPAWN.hp, 6);
  }
}
