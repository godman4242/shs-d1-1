/**
 * Stage 3 M4 — the profile seam's CORE half: cumulative XP on Progression,
 * accrueXp (XP → levelUp wiring through the M2 curve), and the strict
 * corrupt-save validator (the M1-review deferral: game/ persistence
 * re-enters core ONLY through sanitizeProgression). The game/ half
 * (localStorage store) is 6 boundary lines, verified in the browser gate.
 * Chaos guards planted red-first: junk amounts, overflow, every corrupt
 * save shape the review enumerated.
 */
import { describe, expect, it } from 'vitest';
import { FIRST_RUN_SP_CAP, MAX_DAN_RANK, REBIRTH } from '../src/config/economy';
import { accrueXp, sanitizeProgression } from '../src/core/profile';
import {
  accrueCoins,
  initProgression,
  rebirth,
  type Progression,
} from '../src/core/progression';
import { levelForXp, xpThreshold } from '../src/core/xp';

const POOLS = { hp: 100, chi: 50, ap: 30 };

/** A character with something to lose in every field (incl. nonzero xp). */
const rich = (): Progression => {
  let p = initProgression(POOLS);
  p = rebirth(p, 'fire');
  p = accrueXp(p, 600); // past the first cap → L2 (+1 SP, +3 stat)
  return accrueCoins(p, 123);
};

describe('Progression.xp — cumulative XP total on the record', () => {
  it('starts at zero', () => {
    expect(initProgression(POOLS).xp).toBe(0);
  });

  it('rebirth resets xp to zero (fresh L1 — level is DERIVED from xp)', () => {
    const p = accrueXp(initProgression(POOLS), 700);
    expect(rebirth(p, 'water').xp).toBe(0);
  });
});

describe('accrueXp — XP accrual drives levelUp through the M2 curve', () => {
  it('adds xp without leveling below the first cap', () => {
    const p = accrueXp(initProgression(POOLS), 549);
    expect(p.xp).toBe(549);
    expect(p.level).toBe(1);
    expect(p.skillPoints).toBe(0);
    expect(p.statPoints).toBe(0);
  });

  it('reaching a cap EXACTLY finishes the level (+1 SP, +3 stat, refill)', () => {
    let p = initProgression(POOLS);
    p = { ...p, hp: { ...p.hp, current: 1 } }; // drained → refill provable
    p = accrueXp(p, xpThreshold(1)); // exactly 550
    expect(p.level).toBe(2);
    expect(p.skillPoints).toBe(1);
    expect(p.statPoints).toBe(3);
    expect(p.hp).toEqual({ current: 100, max: 100 });
  });

  it('one accrual crossing multiple caps applies one levelUp per level', () => {
    const p = accrueXp(initProgression(POOLS), xpThreshold(2)); // 1450 → L3
    expect(p.level).toBe(3);
    expect(p.skillPoints).toBe(2);
    expect(p.statPoints).toBe(6);
  });

  it('keeps level === levelForXp(xp) across arbitrary accruals (property)', () => {
    let p = initProgression(POOLS);
    for (const amount of [10, 540, 1, 899, 30000, 12345]) {
      p = accrueXp(p, amount);
      expect(p.level).toBe(levelForXp(p.xp));
    }
  });

  it('touches only xp/level/SP/stat/pools — currencies, rank, elements intact', () => {
    const p = rich();
    const grown = accrueXp(p, 5000);
    expect(grown.danRank).toBe(p.danRank);
    expect(grown.coins).toBe(p.coins);
    expect(grown.gold).toBe(p.gold);
    expect(grown.elemental).toEqual(p.elemental);
  });

  it('does not mutate its input (pure snapshot)', () => {
    const p = rich();
    const snapshot = structuredClone(p);
    accrueXp(p, 5000);
    expect(p).toEqual(snapshot);
  });

  it('ignores fractional, negative, and non-finite amounts (chaos)', () => {
    const p = initProgression(POOLS);
    expect(accrueXp(p, 0.5).xp).toBe(0);
    expect(accrueXp(p, -10).xp).toBe(0);
    expect(accrueXp(p, Number.NaN).xp).toBe(0);
  });

  it('refuses to grow xp past the safe-integer range — sums stay exact AND the level walk stays bounded (chaos)', () => {
    // MAX_VALUE is a mathematical integer, so a naive isInteger guard admits
    // it — and levelForXp(1.8e308) would walk the quadratic curve ~1e152
    // times (found the hard way: this exact test hung the suite).
    expect(accrueXp(initProgression(POOLS), Number.MAX_VALUE).xp).toBe(0);
    const near = accrueXp({ ...initProgression(POOLS), xp: 0 }, 1_000_000);
    expect(near.xp).toBe(1_000_000); // sane totals still accrue + level fine
    expect(near.level).toBe(levelForXp(1_000_000));
  });
});

describe('sanitizeProgression — the ONLY door back into core for saved data', () => {
  const roundTrip = (p: Progression): unknown => JSON.parse(JSON.stringify(p)) as unknown;

  it('accepts a JSON round-trip of a real character and rebuilds it equal', () => {
    const p = rich();
    const clean = sanitizeProgression(roundTrip(p));
    expect(clean).toEqual(p);
    expect(clean).not.toBe(p); // a NEW object — never the caller's reference
  });

  it('strips unknown extra keys instead of carrying them through', () => {
    const raw = { ...roundTrip(rich()) as Record<string, unknown>, evil: 'payload' };
    const clean = sanitizeProgression(raw);
    expect(clean).not.toBeNull();
    expect(clean).not.toHaveProperty('evil');
  });

  it('rejects non-objects (chaos)', () => {
    for (const junk of [null, undefined, 42, 'save', [], true]) {
      expect(sanitizeProgression(junk)).toBeNull();
    }
  });

  it('rejects every corrupt field shape the review enumerated (chaos)', () => {
    const base = (): Record<string, unknown> => roundTrip(rich()) as Record<string, unknown>;
    const corruptions: Array<(r: Record<string, unknown>) => void> = [
      (r) => delete r.coins, // missing field
      (r) => (r.skillPoints = Number.NaN), // NaN poisoning
      (r) => (r.danRank = -1), // sub-zero dan ladder
      (r) => (r.danRank = 1.5), // fractional rank
      (r) => (r.danRank = MAX_DAN_RANK + 1), // past the ceiling
      (r) => (r.coins = -5), // negative currency
      (r) => (r.xp = 0.25), // fractional xp
      (r) => (r.xp = 1e300), // unsafe-integer xp: must reject FAST, not hang levelForXp
      (r) => delete (r.elemental as Record<string, unknown>).fire, // missing element
      (r) => ((r.elemental as Record<string, unknown>).fire = Number.NaN),
      (r) => ((r.hp as Record<string, unknown>).current = 999), // current > max
      (r) => ((r.chi as Record<string, unknown>).max = 0), // zero-max pool
      (r) => (r.level = 9), // level inconsistent with xp (curve mismatch)
    ];
    for (const corrupt of corruptions) {
      const raw = base();
      corrupt(raw);
      expect(sanitizeProgression(raw)).toBeNull();
    }
  });

  it('rejects a first-run save with SP above the cap (impossible via play) (chaos)', () => {
    const raw = roundTrip(initProgression(POOLS)) as Record<string, unknown>;
    raw.skillPoints = FIRST_RUN_SP_CAP + 1;
    expect(sanitizeProgression(raw)).toBeNull();
  });

  it('accepts a maxed veteran (danRank at the ceiling, big elemental totals)', () => {
    let p = initProgression(POOLS);
    for (let i = 0; i < MAX_DAN_RANK; i++) p = rebirth(p, 'earth');
    expect(p.elemental.earth).toBe(MAX_DAN_RANK * REBIRTH.elementalPointsPerRebirth);
    expect(sanitizeProgression(roundTrip(p))).toEqual(p);
  });
});
