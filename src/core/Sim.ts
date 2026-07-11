import { JUMP_APEX_PX, JUMP_DURATION_FRAMES } from '../config/duel';
import { ONE, ZERO } from '../config/nums';
import type { StanceId } from '../config/stances';
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
  private jump: JumpState | null = null;

  constructor(
    readonly rng: Rng,
    readonly opponent: OpponentController,
    spawn: FighterSpawn,
  ) {
    this.state = { pos: { ...spawn.pos }, hp: spawn.hp, stance: spawn.stance };
    this.halfW = spawn.halfW;
    this.halfH = spawn.halfH;
  }

  get fighter(): Readonly<{ pos: Readonly<Vec>; hp: number; stance: StanceId }> {
    return this.state;
  }

  get jumping(): boolean {
    return this.jump !== null;
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
      if (first !== undefined && last !== undefined) {
        const groundY = this.state.pos.y;
        this.jump = { from: { x: first.x, y: groundY }, to: { x: last.x, y: groundY }, frame: ZERO };
        this.state.pos = { x: first.x, y: groundY };
      }
      return { gesture, slash: null };
    }
    // launch / stab: recognized, acted on from Stage 2.
    return { gesture, slash: null };
  }

  /** Advance one fixed frame (FIXED_HZ per second — the scene accumulates). */
  tick(): void {
    if (this.jump === null) return;
    this.jump.frame += ONE;
    const t = this.jump.frame / JUMP_DURATION_FRAMES;
    this.state.pos = jumpArcPoint(t, this.jump.from, this.jump.to, JUMP_APEX_PX);
    if (t >= ONE) this.jump = null;
  }
}
