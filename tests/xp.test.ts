/**
 * Stage 3 M2 — the XP curve. L1–L10 cumulative caps are CONTRACT (frame-backed,
 * video study SYNTHESIS §1.2: A-00, A-01, A-03, A-06, A-14, A-21, B-04, B-08,
 * B-18, B-22 — one on-screen reading each). Thresholds are CUMULATIVE bar caps
 * ("cap to finish level N"): the HUD renders totalXp/cap (e.g. the observed
 * 787/1450 at L2). Beyond L10 the study has no reads — extrapolation is
 * INFERRED (per-level delta keeps growing by XP_DELTA_STEP, matching the
 * observed 4550→5000→5500 tail) and flagged in config/xp.ts.
 * Chaos guards planted red-first: junk level, junk xp, huge-xp termination.
 */
import { describe, expect, it } from 'vitest';
import { XP_DELTA_STEP, XP_THRESHOLDS } from '../src/config/xp';
import { levelForXp, xpThreshold } from '../src/core/xp';

/** SYNTHESIS §1.2 table, verbatim — the double-entry ratchet for the curve. */
const OBSERVED: readonly number[] = [
  550, 1450, 2950, 5150, 8350, 12150, 16350, 20900, 25900, 31400,
];

describe('XP_THRESHOLDS — the frame-backed L1–L10 table', () => {
  it('pins all ten observed cumulative caps exactly', () => {
    expect(XP_THRESHOLDS).toEqual(OBSERVED);
  });

  it('is strictly increasing with decaying growth ratio (the study shape)', () => {
    const cap = (i: number): number => XP_THRESHOLDS[i] ?? Number.NaN;
    for (let i = 1; i < XP_THRESHOLDS.length; i++) {
      expect(cap(i)).toBeGreaterThan(cap(i - 1));
    }
    // growth ratio decays monotonically: ×2.64 at L2 down to ×1.21 at L10
    for (let i = 2; i < XP_THRESHOLDS.length; i++) {
      expect(cap(i) / cap(i - 1)).toBeLessThan(cap(i - 1) / cap(i - 2));
    }
  });
});

describe('xpThreshold — cumulative cap to finish a level', () => {
  it('returns the table value for L1–L10', () => {
    OBSERVED.forEach((cap, i) => {
      expect(xpThreshold(i + 1)).toBe(cap);
    });
  });

  it('extrapolates L11+ by growing the per-level delta by XP_DELTA_STEP (INFERRED)', () => {
    // last observed delta is 31400 − 25900 = 5500; the tail grew 4550→5000→5500
    expect(XP_DELTA_STEP).toBe(500);
    expect(xpThreshold(11)).toBe(31400 + 5500 + 500); // 37 400
    expect(xpThreshold(12)).toBe(37400 + 5500 + 2 * 500); // 43 900
  });

  it('is strictly increasing far past the table (L1–L100)', () => {
    for (let level = 2; level <= 100; level++) {
      expect(xpThreshold(level)).toBeGreaterThan(xpThreshold(level - 1));
    }
  });

  it('rejects a non-positive-integer level (chaos)', () => {
    expect(() => xpThreshold(0)).toThrow();
    expect(() => xpThreshold(-3)).toThrow();
    expect(() => xpThreshold(1.5)).toThrow();
    expect(() => xpThreshold(Number.NaN)).toThrow();
  });
});

describe('levelForXp — current level for a cumulative XP total', () => {
  it('is level 1 from 0 up to (but excluding) the first cap', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(549)).toBe(1);
  });

  it('crosses to the next level exactly AT each cap (bar full = level done)', () => {
    expect(levelForXp(550)).toBe(2);
    expect(levelForXp(1449)).toBe(2);
    expect(levelForXp(1450)).toBe(3);
    expect(levelForXp(31399)).toBe(10);
    expect(levelForXp(31400)).toBe(11); // leaves the table
    expect(levelForXp(37399)).toBe(11);
    expect(levelForXp(37400)).toBe(12); // extrapolated boundary
  });

  it('round-trips with xpThreshold across L1–L80 (property)', () => {
    for (let level = 1; level <= 80; level++) {
      const cap = xpThreshold(level);
      expect(levelForXp(cap - 1)).toBe(level);
      expect(levelForXp(cap)).toBe(level + 1);
    }
  });

  it('terminates fast and stays an integer on a huge total (chaos)', () => {
    const level = levelForXp(Number.MAX_SAFE_INTEGER);
    expect(Number.isInteger(level)).toBe(true);
    expect(level).toBeGreaterThan(10);
  });

  it('rejects a non-finite or negative total (chaos)', () => {
    expect(() => levelForXp(Number.NaN)).toThrow();
    expect(() => levelForXp(Number.POSITIVE_INFINITY)).toThrow();
    expect(() => levelForXp(-1)).toThrow();
  });
});
