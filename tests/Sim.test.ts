/**
 * Stage-1 Sim — the single owner of gameplay state (scenes render only).
 * Minimal surface for the Stage 1 gate: one dummy fighter with HP, a
 * stroke-application seam (slash damages / up-stroke jumps), and a fixed
 * per-frame tick that advances the jump arc. Stage 2 replaces the internals
 * with the full advance(deltaMs) loop; this seam is what DuelScene calls.
 */
import { describe, expect, it } from 'vitest';
import { MAX_FRAME_MS } from '../src/config/combat-sim';
import { JUMP_DURATION_FRAMES } from '../src/config/duel';
import { FIXED_HZ } from '../src/config/timing';
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

describe('Sim.advance — fixed-step accumulator owned by the Sim (Stage 2)', () => {
  const stepMs = 1000 / FIXED_HZ;
  const jumpStroke = (): DrawnStroke => new DrawnStroke([v(300, 200), v(320, 60)]);

  it('runs one fixed tick per full step of accumulated time', () => {
    const sim = makeSim();
    sim.advance(stepMs);
    expect(sim.frame).toBe(1);
  });

  it('carries fractional remainders across calls', () => {
    const sim = makeSim();
    sim.advance(stepMs * 0.6);
    expect(sim.frame).toBe(0);
    sim.advance(stepMs * 0.6); // 1.2 steps accumulated
    expect(sim.frame).toBe(1);
  });

  it('clamps a single oversized delta to MAX_FRAME_MS', () => {
    const clamped = makeSim();
    clamped.advance(MAX_FRAME_MS);
    const huge = makeSim();
    huge.advance(1e9);
    expect(huge.frame).toBe(clamped.frame);
    expect(clamped.frame).toBeGreaterThanOrEqual(14); // ≈15 steps fit in 250 ms
  });

  it('clamps Infinity like any oversized delta (chaos: ∞)', () => {
    const clamped = makeSim();
    clamped.advance(MAX_FRAME_MS);
    const inf = makeSim();
    inf.advance(Number.POSITIVE_INFINITY);
    expect(inf.frame).toBe(clamped.frame);
  });

  it('ignores NaN without poisoning the accumulator (chaos: NaN)', () => {
    const sim = makeSim();
    sim.advance(Number.NaN);
    expect(sim.frame).toBe(0);
    sim.advance(stepMs); // a NaN'd accumulator would never tick again
    expect(sim.frame).toBe(1);
  });

  it('ignores negative deltas without rewinding accumulated time (chaos: negative)', () => {
    const sim = makeSim();
    sim.advance(stepMs * 0.9);
    sim.advance(-1000);
    expect(sim.frame).toBe(0);
    sim.advance(stepMs * 0.2); // 0.9 + 0.2 steps — only if the negative was ignored
    expect(sim.frame).toBe(1);
  });

  it('drives gameplay identically to N direct tick() calls (jump arc)', () => {
    const byTicks = makeSim();
    byTicks.applyStroke(jumpStroke(), attacker);
    for (let i = 0; i < 3; i++) byTicks.tick();
    const byAdvance = makeSim();
    byAdvance.applyStroke(jumpStroke(), attacker);
    byAdvance.advance(stepMs * 3);
    expect(byAdvance.fighter.pos).toEqual(byTicks.fighter.pos);
  });
});

describe('Sim — degenerate strokes are inert at the core seam (audit finding)', () => {
  it('a single-point tap inside the hitbox neither hits nor damages', () => {
    const sim = makeSim();
    const tap = new DrawnStroke([v(100, 200)]); // dead centre of the fighter
    const outcome = sim.applyStroke(tap, attacker);
    expect(outcome.slash).toBeNull();
    expect(sim.fighter.hp).toBe(100);
    expect(sim.jumping).toBe(false);
  });
});

describe('Sim — jump edge cases (found in Stage 1 browser verify)', () => {
  const jumpStroke = (fromX: number, toX: number): DrawnStroke =>
    new DrawnStroke([v(fromX, 300), v(toX, 100)]);
  it('a jump gesture while airborne is ignored (no mid-air ground capture)', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(300, 320), attacker);
    for (let i = 0; i < JUMP_DURATION_FRAMES / 2; i++) sim.tick();
    const midAir = { ...sim.fighter.pos };
    sim.applyStroke(jumpStroke(500, 520), attacker);
    expect(sim.fighter.pos).toEqual(midAir); // unchanged — stroke ignored
    for (let i = 0; i < JUMP_DURATION_FRAMES; i++) sim.tick();
    expect(sim.fighter.pos).toEqual({ x: 320, y: 200 }); // original jump completes
  });
  it('sequential jumps always land back on the spawn ground line', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(300, 320), attacker);
    for (let i = 0; i < JUMP_DURATION_FRAMES; i++) sim.tick();
    sim.applyStroke(jumpStroke(320, 400), attacker);
    for (let i = 0; i < JUMP_DURATION_FRAMES; i++) sim.tick();
    expect(sim.fighter.pos).toEqual({ x: 400, y: 200 });
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
