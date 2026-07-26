/**
 * src/core/slash.ts — stroke-vs-hitbox resolution, and the damage pipeline
 * behind it (src/core/damage.ts).
 *
 * ⚠️ REWRITTEN FOR SESSION13 B2/B3. Two things changed SHAPE, not just value:
 *
 * 1. **`resolveSlash` no longer knows where the attacker is, or what its reach
 *    is.** Reach is an ARC-LENGTH BUDGET spent when the stroke is truncated
 *    (`DrawnStroke.truncateTo`), so the polyline that arrives here has already
 *    been cut to what the swing could cover. The old design combined that
 *    budget with a Euclidean `withinReach` radius test from the attacker, which
 *    double-counted reach against two different quantities — and the source has
 *    no radius anywhere.
 * 2. **The damage multipliers come from MASTERY, not a per-stance table**, and
 *    `COUNTER_BONUS` is gone: the stance triangle now pays ×1.2 for winning the
 *    matchup and PENALISES ×0.9 for losing it. The old one-sided bonus had no
 *    penalty half at all.
 *
 * At the stated character (level 9, mastery 0 — see `config/stats.ts`) the
 * damage curves are light ×0.5 · balanced ×1.0 · heavy ×1.4. Every expectation
 * below is written as the arithmetic that produced it.
 *
 * The heavy penalty stays DEFENSE-SIDE ONLY (Stage-2 landmine: `damageTakenMult`
 * is data-only and must never also apply).
 */
import { describe, expect, it } from 'vitest';
import { PLAYER_STATS } from '../src/config/stats';
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
  minDamage: 10,
  damageRange: 0, // no weapon model yet — a roll of width zero (D6)
  stance: 'balanced',
  crit: false,
  stats: PLAYER_STATS, // level 9, mastery 0
  ...over,
});
const target = (over: Partial<TargetHitbox> = {}): TargetHitbox => ({
  polygon: squareAt(100, 100),
  stance: 'balanced',
  hp: 100,
  defense: 0,
  ...over,
});
/** Horizontal stroke crossing x=0..200 at y=100 — clean hit on target(). */
const throughStroke = (): DrawnStroke => new DrawnStroke([v(0, 100), v(200, 100)]);
/** A budget large enough that truncation is not what is under test. */
const UNCUT = 10_000;
/** Spend a reach budget along a stroke, the way the Sim does. */
const cut = (s: DrawnStroke, budget = UNCUT): Vec[] => s.truncateTo(budget);

describe('resolveSlash — hit detection', () => {
  it('a stroke crossing the hitbox hits', () => {
    expect(resolveSlash(cut(throughStroke()), target(), attacker()).hit).toBe(true);
  });
  it('a stroke far away misses with zero effect', () => {
    const s = new DrawnStroke([v(0, 300), v(200, 300)]);
    expect(resolveSlash(cut(s), target(), attacker())).toEqual({
      hit: false,
      damage: 0,
      crit: false,
      severed: [],
    });
  });
  it('a stroke fully inside the hitbox still hits (no edge crossing)', () => {
    const s = new DrawnStroke([v(90, 100), v(110, 100)]);
    expect(resolveSlash(cut(s), target(), attacker()).hit).toBe(true);
  });
});

describe('resolveSlash — the damage pipeline (D6 order, at mastery 0)', () => {
  it('base: minDamage × mastery mult — balanced 10 × 1.0 = 10', () => {
    expect(resolveSlash(cut(throughStroke()), target(), attacker()).damage).toBe(10);
  });
  it('crit multiplies by CRIT_MULT (1.3): 10 → 13', () => {
    const r = resolveSlash(cut(throughStroke()), target(), attacker({ crit: true }));
    expect(r.crit).toBe(true);
    expect(r.damage).toBeCloseTo(13, 9);
  });
  it('WINNING the matchup pays ×1.2: light vs heavy, 10 × 0.5 × 1.2 = 6', () => {
    const r = resolveSlash(cut(throughStroke()), target({ stance: 'heavy' }), attacker({ stance: 'light' }));
    expect(r.damage).toBeCloseTo(6, 9);
  });
  it('LOSING the matchup is PENALISED ×0.9 — the half COUNTER_BONUS never had', () => {
    // heavy attacker vs light defender: light BEATS heavy, so 10 × 1.4 × 0.9.
    const r = resolveSlash(cut(throughStroke()), target({ stance: 'light' }), attacker({ stance: 'heavy' }));
    expect(r.damage).toBeCloseTo(12.6, 9);
  });
  it('a mirror matchup is exactly ×1.0: heavy vs heavy, 10 × 1.4 = 14', () => {
    const r = resolveSlash(cut(throughStroke()), target({ stance: 'heavy' }), attacker({ stance: 'heavy' }));
    expect(r.damage).toBeCloseTo(14, 9);
  });
  it('crit and matchup stack: 10 × 0.5 × 1.3 × 1.2 = 7.8', () => {
    const r = resolveSlash(
      cut(throughStroke()),
      target({ stance: 'heavy' }),
      attacker({ stance: 'light', crit: true }),
    );
    expect(r.damage).toBeCloseTo(7.8, 9);
  });
  it('a landed hit never deals less than the level floor (level 9 ⇒ 1)', () => {
    const r = resolveSlash(cut(throughStroke()), target(), attacker({ minDamage: 0 }));
    expect(r.damage).toBe(1);
  });
  it("the floor SCALES with the ATTACKER's level (≤20 ⇒ lvl/8)", () => {
    const lvl16 = { ...PLAYER_STATS, level: 16 };
    const r = resolveSlash(cut(throughStroke()), target({ defense: 999 }), attacker({ stats: lvl16 }));
    expect(r.damage).toBe(2); // 16 / 8
  });
  it('crit on a whiff reports crit:false (no crit without contact)', () => {
    const s = new DrawnStroke([v(0, 300), v(200, 300)]);
    expect(resolveSlash(cut(s), target(), attacker({ crit: true })).crit).toBe(false);
  });
});

describe('resolveSlash — defense SUBTRACTS, and the heavy penalty has ONE form', () => {
  it('defense reduces damage after the multiplier stack: 10 − 5 = 5', () => {
    const r = resolveSlash(cut(throughStroke()), target({ defense: 5 }), attacker());
    expect(r.damage).toBe(5);
  });
  it("heavy defender: its OWN defense stat is cut to ×0.8 — 10×0.9 − 5×0.8 = 5", () => {
    // Exact 5 pins the defense-side form AND that damageTakenMult (1.25) is NOT
    // also applied: double-application would read 6.25 or 7.25, never 5.
    const r = resolveSlash(cut(throughStroke()), target({ stance: 'heavy', defense: 5 }), attacker());
    expect(r.damage).toBe(5);
  });
  it('overwhelming defense floors at the level minimum', () => {
    const r = resolveSlash(cut(throughStroke()), target({ defense: 999 }), attacker());
    expect(r.damage).toBe(1);
  });
});

describe('resolveSlash — multi-foe: one stroke resolves against each foe', () => {
  it('a long horizontal line hits two separated foes', () => {
    const s = new DrawnStroke([v(0, 100), v(400, 100)]);
    const foeA = target({ polygon: squareAt(100, 100) });
    const foeB = target({ polygon: squareAt(300, 100) });
    expect(resolveSlash(cut(s), foeA, attacker()).hit).toBe(true);
    expect(resolveSlash(cut(s), foeB, attacker()).hit).toBe(true);
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
    const r = resolveSlash(cut(throughStroke()), partedTarget(5), attacker());
    expect(r.damage).toBeGreaterThanOrEqual(5);
    expect(r.severed).toEqual(['head']);
  });
  it('a non-lethal blow severs nothing', () => {
    const r = resolveSlash(cut(throughStroke()), partedTarget(100), attacker());
    expect(r.severed).toEqual([]);
  });
  it('a target without parts severs nothing even on a kill', () => {
    const r = resolveSlash(cut(throughStroke()), target({ hp: 1 }), attacker());
    expect(r.severed).toEqual([]);
  });
});

describe('REACH is an arc-length budget, NOT a radius (SESSION13 B3)', () => {
  it('CRUX (frame-verified): a long stroke on a short budget cannot reach a far target', () => {
    // duel_dense 428.0→431.5: one long arc bloodies in-reach enemies while the
    // far enemy keeps full HP — the blade path TERMINATES where the budget runs
    // out. Same stroke, two budgets, opposite outcomes.
    const s = new DrawnStroke([v(500, 100), v(300, 100), v(50, 100)]);
    expect(resolveSlash(s.truncateTo(60), target(), attacker()).hit).toBe(false);
    expect(resolveSlash(s.truncateTo(500), target(), attacker()).hit).toBe(true);
  });
  it('a CURVY stroke covers less GROUND than a straight one on the same budget', () => {
    // The property a radius test cannot express, and the reason the source
    // spends reach along the drawn line rather than around the fighter.
    const budget = 150;
    const straight = new DrawnStroke([v(0, 100), v(400, 100)]).truncateTo(budget);
    const zigzag = new DrawnStroke([
      v(0, 100), v(50, 150), v(100, 100), v(150, 150), v(200, 100), v(250, 150), v(300, 100),
    ]).truncateTo(budget);
    expect(zigzag.at(-1)?.x ?? 0).toBeLessThan(straight.at(-1)?.x ?? 0);
  });
  it('the budget is spent EXACTLY — the cut ends at the budget, not at a sample', () => {
    const cutPts = new DrawnStroke([v(0, 100), v(400, 100)]).truncateTo(137);
    expect(cutPts.at(-1)?.x).toBeCloseTo(137, 6);
  });
  it('a budget longer than the stroke returns the whole stroke', () => {
    const s = new DrawnStroke([v(0, 100), v(200, 100)]);
    expect(s.truncateTo(UNCUT).at(-1)?.x).toBeCloseTo(200, 6);
  });
});
