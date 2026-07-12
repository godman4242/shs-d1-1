import { MAX_FRAME_MS } from '../config/combat-sim';
import { JUMP_APEX_PX, JUMP_DURATION_FRAMES } from '../config/duel';
import { ONE, TWO, ZERO } from '../config/nums';
import type { StanceId } from '../config/stances';
import { FIXED_HZ, FRAME_QUANT_EPS, MS_PER_S } from '../config/timing';
import type { DrawnStroke } from './DrawnStroke';
import type { Gesture } from './gesture';
import type { OpponentController } from './OpponentController';
import { resolveSlash, type SlashAttacker, type SlashResult } from './slash';
import { jumpArcPoint } from './trajectory';
import type { Vec } from './vec';

/**
 * Deterministic random source in [0, 1). Seeded mulberry32 is injected at
 * the boundary (Stage 2, constants via src/config/rng.ts) — Math.random is
 * banned everywhere in core/.
 */
export type Rng = () => number;

export interface FighterSpawn {
  pos: Vec;
  hp: number;
  stance: StanceId;
  halfW: number;
  halfH: number;
}

export interface StrokeOutcome {
  gesture: Gesture;
  /** Slash resolution when the gesture was a slash; null otherwise. */
  slash: SlashResult | null;
}

interface JumpState {
  from: Vec;
  to: Vec;
  frame: number;
}

/**
 * Fixed-timestep combat simulation — the SINGLE owner of gameplay state.
 * Pure and framework-free: no Phaser, no DOM, no wall clock, zero numeric
 * literals (tests/config-purity.test.ts enforces all of it). Scenes render
 * what Sim computes and never own gameplay state.
 *
 * Stage-1 surface: one dummy fighter (HP + position), applyStroke (slash
 * damages via resolveSlash; up-stroke starts a jump start.x → end.x along
 * jumpArcPoint), tick() advancing one fixed frame. launch/stab classify but
 * do not act yet. Stage 2 replaces the internals with the full
 * advance(deltaMs) loop (damage events, meters, AI intents, SimEvent[]).
 */
export class Sim {
  private readonly state: { pos: Vec; hp: number; stance: StanceId };
  private readonly halfW: number;
  private readonly halfH: number;
  /** The spawn ground line — jumps always launch from and land on it
   * (capturing pos.y mid-air left the fighter floating; browser-verified bug). */
  private readonly groundY: number;
  private jump: JumpState | null = null;
  /** Total clamped wall-clock ms fed to advance() since spawn. */
  private elapsedMs = ZERO;
  private frameCount = ZERO;

  constructor(
    readonly rng: Rng,
    readonly opponent: OpponentController,
    spawn: FighterSpawn,
  ) {
    this.state = { pos: { ...spawn.pos }, hp: spawn.hp, stance: spawn.stance };
    this.halfW = spawn.halfW;
    this.halfH = spawn.halfH;
    this.groundY = spawn.pos.y;
  }

  get fighter(): Readonly<{ pos: Readonly<Vec>; hp: number; stance: StanceId }> {
    return this.state;
  }

  get jumping(): boolean {
    return this.jump !== null;
  }

  /** Fixed frames elapsed since spawn — the Sim's own clock. */
  get frame(): number {
    return this.frameCount;
  }

  /** Axis-aligned hitbox rectangle around the fighter's current position. */
  fighterHitbox(): Vec[] {
    const { pos } = this.state;
    return [
      { x: pos.x - this.halfW, y: pos.y - this.halfH },
      { x: pos.x + this.halfW, y: pos.y - this.halfH },
      { x: pos.x + this.halfW, y: pos.y + this.halfH },
      { x: pos.x - this.halfW, y: pos.y + this.halfH },
    ];
  }

  /** Resolve a finished stroke: slash → damage; jump → arc start.x → end.x. */
  applyStroke(stroke: DrawnStroke, attacker: SlashAttacker): StrokeOutcome {
    const gesture = stroke.gesture;
    // Degenerate strokes (taps) classify as 'slash' by default — gate here at
    // the core seam so no caller can land a full-damage tap (audit finding).
    if (stroke.points.length < TWO) return { gesture, slash: null };
    if (gesture === 'slash') {
      const result = resolveSlash(
        stroke,
        { polygon: this.fighterHitbox(), stance: this.state.stance, hp: this.state.hp },
        attacker,
      );
      if (result.hit) this.state.hp = Math.max(ZERO, this.state.hp - result.damage);
      return { gesture, slash: result };
    }
    if (gesture === 'jump') {
      const first = stroke.points.at(ZERO);
      const last = stroke.points.at(-ONE);
      // One jump at a time: a jump gesture while airborne is ignored.
      if (this.jump === null && first !== undefined && last !== undefined) {
        this.jump = {
          from: { x: first.x, y: this.groundY },
          to: { x: last.x, y: this.groundY },
          frame: ZERO,
        };
        this.state.pos = { x: first.x, y: this.groundY };
      }
      return { gesture, slash: null };
    }
    // launch / stab: recognized, acted on from Stage 2.
    return { gesture, slash: null };
  }

  /**
   * Advance the sim by a wall-clock delta (Stage 2 spec item 1). Owns the
   * fixed-step accumulator: clamps any single delta to MAX_FRAME_MS (a
   * throttled/backgrounded tab must not fast-forward the fight), ignores
   * NaN (would poison the accumulator forever) and negatives (would rewind
   * it). Scenes call ONLY this — never tick() — so sim time follows the
   * wall clock at FIXED_HZ regardless of render fps.
   */
  advance(deltaMs: number): void {
    if (Number.isNaN(deltaMs) || deltaMs < ZERO) return;
    this.elapsedMs += Math.min(deltaMs, MAX_FRAME_MS);
    // Owed frames from TOTAL elapsed time (multiplicative — no cumulative
    // drift, unlike a repeated-subtraction remainder). FRAME_QUANT_EPS
    // absorbs the 1-ulp float noise either side of exact step boundaries.
    const owed = Math.floor((this.elapsedMs * FIXED_HZ) / MS_PER_S + FRAME_QUANT_EPS);
    while (this.frameCount < owed) this.tick();
  }

  /** Advance one fixed frame (advance() consumes the accumulator into these). */
  tick(): void {
    this.frameCount += ONE;
    if (this.jump === null) return;
    this.jump.frame += ONE;
    const t = this.jump.frame / JUMP_DURATION_FRAMES;
    this.state.pos = jumpArcPoint(t, this.jump.from, this.jump.to, JUMP_APEX_PX);
    if (t >= ONE) this.jump = null;
  }
}
