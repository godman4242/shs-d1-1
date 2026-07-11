/**
 * Stage 0 gate item 2 (updated for the Stage-1 Sim surface) — the Sim seam
 * constructs with injected dependencies only (rng function + opponent
 * controller + spawn data). No Math.random, no Phaser, no globals.
 */
import { expect, it } from 'vitest';
import { Sim, type Rng } from '../src/core/Sim';
import type { OpponentController } from '../src/core/OpponentController';

it('Sim constructs with an injected rng and opponent controller', () => {
  const rng: Rng = () => 0.5;
  const opponent: OpponentController = { next: () => ({}) };
  const sim = new Sim(rng, opponent, {
    pos: { x: 0, y: 0 },
    hp: 1,
    stance: 'balanced',
    halfW: 1,
    halfH: 1,
  });
  expect(sim).toBeInstanceOf(Sim);
  expect(sim.rng()).toBe(0.5);
});
