/**
 * Stage 0 gate item 2 (updated for the Stage-1 Sim surface) — the Sim seam
 * constructs with injected dependencies only (rng function + opponent
 * controller + spawn data). No Math.random, no Phaser, no globals.
 */
import { PLAYER_STATS } from '../src/config/stats';
import { expect, it } from 'vitest';
import { Sim, type Rng } from '../src/core/Sim';
import type { OpponentController } from '../src/core/OpponentController';

it('Sim constructs with an injected rng and opponent controller', () => {
  const rng: Rng = () => 0.5;
  const opponent: OpponentController = { next: () => ({}) };
  const fighter = {
    pos: { x: 0, y: 0 },
    hp: 1,
    minDamage: 1,
    damageRange: 0,
    stats: PLAYER_STATS,
    defense: 0,
    stance: 'balanced' as const,
    deflectLearned: false,
    halfW: 1,
    halfH: 1,
  };
  const sim = new Sim(rng, opponent, { player: fighter, enemy: { ...fighter } });
  expect(sim).toBeInstanceOf(Sim);
  expect(sim.rng()).toBe(0.5);
});
