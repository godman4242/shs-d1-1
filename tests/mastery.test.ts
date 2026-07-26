/**
 * src/core/mastery.ts + the order of src/core/damage.ts (SESSION13 D2/D2a/D6).
 *
 * Gate item 5: **mastery is ONE value driving BOTH reach and damage.** Reading
 * reach from a mastery-0 character while leaving damage at the mastery-10
 * ceiling is precisely the self-inconsistency the Session-11 adjudication
 * reverted, so a mastery change MUST move both numbers or this goes red.
 *
 * Gate item 11: the damage pipeline's ORDER is the contract.
 */
import { describe, expect, it } from 'vitest';
import { REACH } from '../src/config/reach';
import { PLAYER_STATS, type FighterStats } from '../src/config/stats';
import { minDamageForLevel, physicalDamage } from '../src/core/damage';
import { damageMultFor, reachBase, reachFor } from '../src/core/mastery';

const withMastery = (m: number): FighterStats => ({
  ...PLAYER_STATS,
  mastery: { light: m, balanced: m, heavy: m },
});

describe('reachBase — the source formula, at our stated character', () => {
  it('SPD 1, dan 0 ⇒ 120 + floor(90 × 1 / 21) = 124', () => {
    expect(reachBase(PLAYER_STATS)).toBe(124);
  });
  it('the SPD term SOFT-CAPS — `SPD/(20+SPD)` can never reach 1', () => {
    // No amount of Speed buys more than the dan term itself, so reach is
    // bounded at 120 + 90 = 210 for a never-rebirthed character. That ceiling
    // is the reason a 300-px "light reach" constant was wrong IN KIND.
    const huge = { ...PLAYER_STATS, spd: 1_000_000 };
    expect(reachBase(huge)).toBeLessThan(REACH.base + REACH.danBase);
    expect(reachBase({ ...PLAYER_STATS, spd: 20 })).toBeLessThan(
      20 * (reachBase(PLAYER_STATS) - REACH.base) + REACH.base,
    );
  });
  it('rebirth rank raises the dan term', () => {
    expect(reachBase({ ...PLAYER_STATS, danRank: 10 })).toBeGreaterThan(reachBase(PLAYER_STATS));
  });
});

describe('reachFor — at mastery 0 (the stated character)', () => {
  it('light 124 × 1.4 = 173.6', () => {
    expect(reachFor('light', PLAYER_STATS)).toBeCloseTo(173.6, 9);
  });
  it('balanced 124 × (1 + 0) = 124', () => {
    expect(reachFor('balanced', PLAYER_STATS)).toBeCloseTo(124, 9);
  });
  it('heavy hits its FLOOR: max(124 × 0.5, 100) = 100', () => {
    // 62 would be the unfloored value — the floor is what makes heavy usable.
    expect(reachFor('heavy', PLAYER_STATS)).toBe(REACH.heavyFloor);
  });
  it('a 133 for balanced means the mastery off-by-one is back (gate item 4)', () => {
    // 124 × (1 + 0.02 × 1) ≈ 126.5, and the old "starts at level 1" mining read
    // would have produced 133 from a different base. Either is a regression:
    // the skill-level getter returns 0 for anything unpurchased (CONTRACT-SRC).
    expect(reachFor('balanced', PLAYER_STATS)).not.toBeCloseTo(133, 0);
    expect(PLAYER_STATS.mastery.balanced).toBe(0);
  });
});

describe('damageMultFor — the SAME curves, permuted (D2a)', () => {
  it('at mastery 0: light 0.5 · balanced 1.0 · heavy 1.4', () => {
    expect(damageMultFor('light', PLAYER_STATS)).toBeCloseTo(0.5, 9);
    expect(damageMultFor('balanced', PLAYER_STATS)).toBeCloseTo(1.0, 9);
    expect(damageMultFor('heavy', PLAYER_STATS)).toBeCloseTo(1.4, 9);
  });
  it('at mastery 10 they reproduce the LEGACY STANCE_TABLE.dmgMult exactly', () => {
    // 0.9 / 1.2 / 1.4 were the old hardcoded values. That they fall out of the
    // curves at the cap is what proves that table held CEILINGS, and that this
    // module is its generalisation rather than a replacement guess.
    const m10 = withMastery(10);
    expect(damageMultFor('light', m10)).toBeCloseTo(0.9, 9);
    expect(damageMultFor('balanced', m10)).toBeCloseTo(1.2, 9);
    expect(damageMultFor('heavy', m10)).toBeCloseTo(1.4, 9);
  });
});

describe('GATE ITEM 5 — one mastery value moves BOTH tables', () => {
  it('raising BALANCED mastery moves balanced reach AND balanced damage together', () => {
    const before = { reach: reachFor('balanced', PLAYER_STATS), dmg: damageMultFor('balanced', PLAYER_STATS) };
    const after = { reach: reachFor('balanced', withMastery(10)), dmg: damageMultFor('balanced', withMastery(10)) };
    expect(after.reach).toBeGreaterThan(before.reach);
    expect(after.dmg).toBeGreaterThan(before.dmg);
  });
  it('raising HEAVY mastery moves heavy reach AND leaves heavy damage flat (by design)', () => {
    // Heavy is the permuted pair of light: scaling reach, FLAT damage. The
    // asymmetry is the source's, and pinning it stops a "tidy-up" that would
    // make all three stances scale the same way in both tables.
    const m10 = withMastery(10);
    expect(reachFor('heavy', m10)).toBeGreaterThan(reachFor('heavy', PLAYER_STATS));
    expect(damageMultFor('heavy', m10)).toBe(damageMultFor('heavy', PLAYER_STATS));
  });
  it('…and LIGHT is the mirror: flat reach, scaling damage', () => {
    const m10 = withMastery(10);
    expect(reachFor('light', m10)).toBe(reachFor('light', PLAYER_STATS));
    expect(damageMultFor('light', m10)).toBeGreaterThan(damageMultFor('light', PLAYER_STATS));
  });
});

describe('minDamageForLevel — the level-tiered floor (D6 step 6)', () => {
  it('≤10 ⇒ a flat 1', () => {
    expect(minDamageForLevel(1)).toBe(1);
    expect(minDamageForLevel(10)).toBe(1);
  });
  it('≤20 ⇒ lvl/8 · ≤30 ⇒ lvl/6 · else lvl/4', () => {
    expect(minDamageForLevel(16)).toBe(2);
    expect(minDamageForLevel(24)).toBe(4);
    expect(minDamageForLevel(40)).toBe(10);
  });
  it('the tiers step UP with level (never a cliff downwards)', () => {
    let prev = 0;
    for (let lvl = 1; lvl <= 60; lvl++) {
      const floor = minDamageForLevel(lvl);
      expect(floor).toBeGreaterThanOrEqual(prev);
      prev = floor;
    }
  });
});

describe('GATE ITEM 11 — the damage pipeline ORDER is the contract', () => {
  const atk = (over: Partial<Parameters<typeof physicalDamage>[0]> = {}): Parameters<typeof physicalDamage>[0] => ({
    minDamage: 10,
    damageRange: 0,
    stance: 'heavy',
    crit: false,
    stats: PLAYER_STATS,
    ...over,
  });

  it('multipliers apply BEFORE defence subtracts, not after', () => {
    // heavy ×1.4 vs a balanced defender (heavy WINS ⇒ ×1.2), defence 5.
    //   correct order: 10 × 1.4 × 1.2 − 5 = 11.8
    //   defence-first: (10 − 5) × 1.4 × 1.2 = 8.4
    // The two disagree, which is what makes this an ORDER pin rather than a
    // value pin.
    expect(physicalDamage(atk(), { stance: 'balanced', defense: 5 })).toBeCloseTo(11.8, 9);
  });
  it('defence SUBTRACTS — it never divides', () => {
    //   subtract: 10 × 1.4 × 1.2 − 5 = 11.8   (above)
    //   divide:   10 × 1.4 × 1.2 / 5 = 3.36
    expect(physicalDamage(atk(), { stance: 'balanced', defense: 5 })).not.toBeCloseTo(3.36, 9);
  });
  it('the level floor applies AFTER defence, so it can rescue an overwhelmed hit', () => {
    // If the floor ran before defence, a huge defence would drive the result
    // negative and the max() could never save it.
    expect(physicalDamage(atk(), { stance: 'balanced', defense: 9999 })).toBe(
      minDamageForLevel(PLAYER_STATS.level),
    );
  });
  it('crit rides the MULTIPLIER stack, ahead of defence', () => {
    //   correct: 10 × 1.4 × 1.3 × 1.2 − 5 = 16.84
    //   post-defence crit: (10 × 1.4 × 1.2 − 5) × 1.3 = 15.34
    expect(physicalDamage(atk({ crit: true }), { stance: 'balanced', defense: 5 })).toBeCloseTo(16.84, 9);
  });
  it("the heavy penalty cuts the DEFENDER's own stat, and only once", () => {
    // heavy attacker vs heavy defender is a MIRROR (×1.0), and the defender's
    // own defence stat is cut to 0.8: 10 × 1.4 − 5×0.8 = 14 − 4 = 10.
    // A double-applied penalty (also ×damageTakenMult 1.25) would read 12.5.
    expect(physicalDamage(atk(), { stance: 'heavy', defense: 5 })).toBeCloseTo(10, 9);
  });
});
