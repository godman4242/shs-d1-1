/**
 * Stage-1 Sim — the single owner of gameplay state (scenes render only).
 * Minimal surface for the Stage 1 gate: one dummy fighter with HP, a
 * stroke-application seam (slash damages / up-stroke jumps), and a fixed
 * per-frame tick that advances the jump arc. Stage 2 replaces the internals
 * with the full advance(deltaMs) loop; this seam is what DuelScene calls.
 */
import { describe, expect, it } from 'vitest';
import { JUMP_DURATION_FRAMES } from '../src/config/duel';
import { DrawnStroke } from '../src/core/DrawnStroke';
import type { OpponentController } from '../src/core/OpponentController';
import { Sim, type FighterSpawn, type Rng } from '../src/core/Sim';
import type { SlashAttacker } from '../src/core/slash';
import type { Vec } from '../src/core/vec';

const v = (x: number, y: number): Vec => ({ x, y });
const rng: Rng = () => 0.5;
const opponent: OpponentController = { next: () => ({}) };
const spawn = (): FighterSpawn => ({
  pos: v(100, 200),
  hp: 100,
  stance: 'balanced',
  halfW: 20,
  halfH: 40,
});
const attacker: SlashAttacker = { atkPlusWeapon: 10, stance: 'balanced', crit: false };
const makeSim = (): Sim => new Sim(rng, opponent, spawn());
/** Horizontal stroke straight through the spawned fighter. */
const slashStroke = (): DrawnStroke => new DrawnStroke([v(0, 200), v(300, 200)]);

describe('Sim — construction and hitbox', () => {
  it('exposes fighter state from the spawn', () => {
    const sim = makeSim();
    expect(sim.fighter.pos).toEqual({ x: 100, y: 200 });
    expect(sim.fighter.hp).toBe(100);
    expect(sim.fighter.stance).toBe('balanced');
  });
  it('fighterHitbox is the axis-aligned rect around pos', () => {
    expect(makeSim().fighterHitbox()).toEqual([
      v(80, 160),
      v(120, 160),
      v(120, 240),
      v(80, 240),
    ]);
  });
});

describe('Sim — slash strokes damage the fighter (HP-based, not instant kill)', () => {
  it('a hit reduces HP by the resolved damage: 100 → 88', () => {
    const sim = makeSim();
    const outcome = sim.applyStroke(slashStroke(), attacker);
    expect(outcome.gesture).toBe('slash');
    expect(outcome.slash?.hit).toBe(true);
    expect(sim.fighter.hp).toBe(88); // partial damage — the foe survives
  });
  it('a missing stroke leaves HP untouched', () => {
    const sim = makeSim();
    const outcome = sim.applyStroke(new DrawnStroke([v(0, 500), v(300, 500)]), attacker);
    expect(outcome.slash?.hit).toBe(false);
    expect(sim.fighter.hp).toBe(100);
  });
  it('HP floors at 0, never negative', () => {
    const sim = makeSim();
    for (let i = 0; i < 20; i++) sim.applyStroke(slashStroke(), attacker);
    expect(sim.fighter.hp).toBe(0);
  });
});

describe('Sim — up strokes make the fighter jump (start.x → end.x, arc)', () => {
  const jumpStroke = (): DrawnStroke => new DrawnStroke([v(300, 200), v(320, 60)]);
  it('starts the jump at the stroke start x on the fighter ground line', () => {
    const sim = makeSim();
    const outcome = sim.applyStroke(jumpStroke(), attacker);
    expect(outcome.gesture).toBe('jump');
    expect(outcome.slash).toBeNull();
    expect(sim.jumping).toBe(true);
    expect(sim.fighter.pos).toEqual({ x: 300, y: 200 });
  });
  it('is airborne (above ground) mid-jump', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(), attacker);
    for (let i = 0; i < JUMP_DURATION_FRAMES / 2; i++) sim.tick();
    expect(sim.fighter.pos.y).toBeLessThan(200);
  });
  it('lands exactly at the stroke end x on the same ground line', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(), attacker);
    for (let i = 0; i < JUMP_DURATION_FRAMES; i++) sim.tick();
    expect(sim.fighter.pos).toEqual({ x: 320, y: 200 });
    expect(sim.jumping).toBe(false);
  });
  it('tick without a jump changes nothing', () => {
    const sim = makeSim();
    sim.tick();
    expect(sim.fighter.pos).toEqual({ x: 100, y: 200 });
  });
});

describe('Sim — launch and stab are Stage-2 no-ops', () => {
  it('classifies but does not act', () => {
    const sim = makeSim();
    const stab = sim.applyStroke(new DrawnStroke([v(100, 0), v(100, 300)]), attacker);
    expect(stab.gesture).toBe('stab');
    expect(stab.slash).toBeNull();
    const launch = sim.applyStroke(new DrawnStroke([v(100, 250), v(100, 200)]), attacker);
    expect(launch.gesture).toBe('launch');
    expect(launch.slash).toBeNull();
    expect(sim.fighter.hp).toBe(100);
    expect(sim.jumping).toBe(false);
  });
});
