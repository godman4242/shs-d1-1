import type { OpponentController } from './OpponentController';

/**
 * Deterministic random source in [0, 1). Seeded mulberry32 is injected at
 * the boundary (Stage 2, constants via src/config/rng.ts) — Math.random is
 * banned everywhere in core/.
 */
export type Rng = () => number;

/**
 * Fixed-timestep combat simulation (FIXED_HZ ticks per second).
 *
 * Pure and framework-free: no Phaser, no DOM, no wall clock, zero numeric
 * literals (tests/config-purity.test.ts enforces all of it). The Phaser
 * layer renders what Sim computes and never owns gameplay state.
 *
 * Stage 2 implements the real loop: advance(deltaMs) with clamping, damage
 * resolution, Focus/Critical meters, stance switching, spawn invuln, skills,
 * projectiles, Shunpo, kill beat — consuming PlayerIntent + OpponentIntent
 * and emitting typed SimEvent[] for FX/SFX.
 */
export class Sim {
  constructor(
    readonly rng: Rng,
    readonly opponent: OpponentController,
  ) {}
}
