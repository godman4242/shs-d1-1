/**
 * Stage 1 item 4 — src/core/slash.ts: resolveSlash(stroke, target, attacker).
 * Damage = (ATK+Weapon) × STANCE_TABLE[stance].dmgMult × (crit?CRIT_MULT:1)
 *          × (STANCE_BEATS[attacker]===defender ? COUNTER_BONUS : 1)
 * severed lists crossed named parts on a LETHAL blow (INFERRED design —
 * dismemberment rides the kill in the original).
 */
import { describe, expect, it } from 'vitest';
import { DrawnStroke } from '../src/core/DrawnStroke';
import { resolveSlash, type SlashAttacker, type TargetHitbox } from '../src/core/slash';
import type { Vec } from '../src/core/vec';

const v = (x: number, y: number): Vec => ({ x, y });
/** 40×40 square centred on (cx, cy). */
const squareAt = (cx: number, cy: number): Vec[] => [
  v(cx - 20, cy - 20),
  v(cx + 20, cy - 20),
  v(cx + 20, cy + 20),
  v(cx - 20, cy + 20),
];
const attacker = (over: Partial<SlashAttacker> = {}): SlashAttacker => ({
  atkPlusWeapon: 10,
  stance: 'balanced',
  crit: false,
  ...over,
});
const target = (over: Partial<TargetHitbox> = {}): TargetHitbox => ({
  polygon: squareAt(100, 100),
  stance: 'balanced',
  hp: 100,
  ...over,
});
/** Horizontal stroke crossing x=0..200 at y=100 — clean hit on target(). */
const throughStroke = (): DrawnStroke => new DrawnStroke([v(0, 100), v(200, 100)]);

describe('resolveSlash — hit detection', () => {
  it('a stroke crossing the hitbox hits', () => {
    expect(resolveSlash(throughStroke(), target(), attacker()).hit).toBe(true);
  });
  it('a stroke far away misses with zero effect', () => {
    const s = new DrawnStroke([v(0, 300), v(200, 300)]);
    expect(resolveSlash(s, target(), attacker())).toEqual({
      hit: false,
      damage: 0,
      crit: false,
      severed: [],
    });
  });
  it('a stroke fully inside the hitbox still hits (no edge crossing)', () => {
    const s = new DrawnStroke([v(90, 100), v(110, 100)]);
    expect(resolveSlash(s, target(), attacker()).hit).toBe(true);
  });
});

describe('resolveSlash — damage formula', () => {
  it('base: (ATK+Weapon) × dmgMult — balanced 10 → 12', () => {
    expect(resolveSlash(throughStroke(), target(), attacker()).damage).toBe(12);
  });
  it('crit multiplies by CRIT_MULT (1.3): 12 → 15.6', () => {
    const r = resolveSlash(throughStroke(), target(), attacker({ crit: true }));
    expect(r.crit).toBe(true);
    expect(r.damage).toBeCloseTo(15.6, 9);
  });
  it('counter matchup pays COUNTER_BONUS: light vs heavy 10 → 11.25', () => {
    const r = resolveSlash(throughStroke(), target({ stance: 'heavy' }), attacker({ stance: 'light' }));
    expect(r.damage).toBeCloseTo(11.25, 9);
  });
  it('crit and counter stack: 10 × 0.9 × 1.3 × 1.25 = 14.625', () => {
    const r = resolveSlash(
      throughStroke(),
      target({ stance: 'heavy' }),
      attacker({ stance: 'light', crit: true }),
    );
    expect(r.damage).toBeCloseTo(14.625, 9);
  });
  it('reverse matchup gets NO counter bonus: heavy vs light → 14', () => {
    const r = resolveSlash(throughStroke(), target({ stance: 'light' }), attacker({ stance: 'heavy' }));
    expect(r.damage).toBeCloseTo(14, 9);
  });
  it('a landed hit never deals less than DAMAGE_FLOOR', () => {
    const r = resolveSlash(throughStroke(), target(), attacker({ atkPlusWeapon: 0 }));
    expect(r.damage).toBe(1);
  });
  it('crit on a whiff reports crit:false (no crit without contact)', () => {
    const s = new DrawnStroke([v(0, 300), v(200, 300)]);
    expect(resolveSlash(s, target(), attacker({ crit: true })).crit).toBe(false);
  });
});

describe('resolveSlash — multi-foe: one stroke resolves against each foe', () => {
  it('a long horizontal line hits two separated foes', () => {
    const s = new DrawnStroke([v(0, 100), v(400, 100)]);
    const foeA = target({ polygon: squareAt(100, 100) });
    const foeB = target({ polygon: squareAt(300, 100) });
    expect(resolveSlash(s, foeA, attacker()).hit).toBe(true);
    expect(resolveSlash(s, foeB, attacker()).hit).toBe(true);
  });
});

describe('resolveSlash — severing (INFERRED: parts sever on lethal crossings)', () => {
  const partedTarget = (hp: number): TargetHitbox =>
    target({
      hp,
      parts: {
        head: squareAt(100, 100), // crossed by throughStroke()
        legs: squareAt(100, 200), // not crossed
      },
    });
  it('a lethal blow severs exactly the crossed parts', () => {
    const r = resolveSlash(throughStroke(), partedTarget(5), attacker());
    expect(r.damage).toBeGreaterThanOrEqual(5);
    expect(r.severed).toEqual(['head']);
  });
  it('a non-lethal blow severs nothing', () => {
    const r = resolveSlash(throughStroke(), partedTarget(100), attacker());
    expect(r.severed).toEqual([]);
  });
  it('a target without parts severs nothing even on a kill', () => {
    const r = resolveSlash(throughStroke(), target({ hp: 1 }), attacker());
    expect(r.severed).toEqual([]);
  });
});
