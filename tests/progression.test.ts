/**
 * Stage 3 M1 — src/core/progression.ts: the level-up / rebirth / dan-rank
 * math (spec item 1, errata-read). Confirmed facts (research
 * `docs/research/original-game-facts.md`):
 * - Level-up = +1 skill point, +3 stat points, full HP/Chi/AP refill.
 * - First run: 80 SP cap (1 SP/level, level cap 80). Rebirth resets to L1.
 * - Rebirth 1–9 → earlyGold + 10 CHOSEN-elemental (stacking); 10th → tenthGold
 *   (decision #3 elemental default; the spec's "+10 Attack" label was wrong).
 * - MAX_DAN_RANK = 10 (decision #2; spec text's 5 is self-contradictory).
 * Chaos guards planted red-first: non-finite/negative pools, over-cap SP,
 * rebirth past the ceiling, unknown element, junk currency amounts.
 */
import { describe, expect, it } from 'vitest';
import {
  FIRST_RUN_SP_CAP,
  LEVEL_UP_REWARD,
  MAX_DAN_RANK,
  REBIRTH,
} from '../src/config/economy';
import {
  ELEMENTS,
  accrueCoins,
  canRebirth,
  initProgression,
  levelUp,
  rebirth,
  type Progression,
} from '../src/core/progression';

/** Arbitrary but distinct pool maxes so a mis-wired refill can't hide. */
const POOLS = { hp: 100, chi: 50, ap: 30 };

/** A first-run character with every pool fully drained (proves refill). */
const drained = (): Progression => {
  const p = initProgression(POOLS);
  return {
    ...p,
    hp: { ...p.hp, current: 0 },
    chi: { ...p.chi, current: 0 },
    ap: { ...p.ap, current: 0 },
  };
};

describe('initProgression — a fresh first-run character', () => {
  it('starts at level 1, dan rank 0, with empty progression pools', () => {
    const p = initProgression(POOLS);
    expect(p.level).toBe(1);
    expect(p.danRank).toBe(0);
    expect(p.skillPoints).toBe(0);
    expect(p.statPoints).toBe(0);
    expect(p.coins).toBe(0);
    expect(p.gold).toBe(0);
  });

  it('starts every element at zero points', () => {
    const p = initProgression(POOLS);
    for (const el of ELEMENTS) expect(p.elemental[el]).toBe(0);
  });

  it('starts with pools full (current === max)', () => {
    const p = initProgression(POOLS);
    expect(p.hp).toEqual({ current: 100, max: 100 });
    expect(p.chi).toEqual({ current: 50, max: 50 });
    expect(p.ap).toEqual({ current: 30, max: 30 });
  });

  it('rejects a non-finite pool max (chaos)', () => {
    expect(() => initProgression({ hp: Number.NaN, chi: 50, ap: 30 })).toThrow();
    expect(() => initProgression({ hp: 100, chi: Number.POSITIVE_INFINITY, ap: 30 })).toThrow();
  });

  it('rejects a negative pool max (chaos)', () => {
    expect(() => initProgression({ hp: -1, chi: 50, ap: 30 })).toThrow();
  });
});

describe('levelUp — the level-up modal (exact deltas)', () => {
  it('grants exactly +1 skill point', () => {
    const p = initProgression(POOLS);
    expect(levelUp(p).skillPoints).toBe(p.skillPoints + LEVEL_UP_REWARD.skillPoints);
    expect(LEVEL_UP_REWARD.skillPoints).toBe(1);
  });

  it('grants exactly +3 stat points', () => {
    const p = initProgression(POOLS);
    expect(levelUp(p).statPoints).toBe(p.statPoints + LEVEL_UP_REWARD.statPoints);
    expect(LEVEL_UP_REWARD.statPoints).toBe(3);
  });

  it('increments the level by one', () => {
    expect(levelUp(initProgression(POOLS)).level).toBe(2);
  });

  it('fully refills HP / Chi / AP', () => {
    const up = levelUp(drained());
    expect(up.hp).toEqual({ current: 100, max: 100 });
    expect(up.chi).toEqual({ current: 50, max: 50 });
    expect(up.ap).toEqual({ current: 30, max: 30 });
  });

  it('does not touch dan rank, elemental points, or currencies', () => {
    const up = levelUp(initProgression(POOLS));
    expect(up.danRank).toBe(0);
    expect(up.coins).toBe(0);
    expect(up.gold).toBe(0);
    for (const el of ELEMENTS) expect(up.elemental[el]).toBe(0);
  });
});

describe('80 SP first-run cap', () => {
  const grind = (p: Progression, times: number): Progression => {
    let out = p;
    for (let i = 0; i < times; i++) out = levelUp(out);
    return out;
  };

  it('skill points never exceed FIRST_RUN_SP_CAP on the first run', () => {
    const p = grind(initProgression(POOLS), 200);
    expect(p.skillPoints).toBe(FIRST_RUN_SP_CAP);
    expect(FIRST_RUN_SP_CAP).toBe(80);
  });

  it('stat points keep accruing past the SP cap (the cap is SP-only)', () => {
    const p = grind(initProgression(POOLS), 200);
    expect(p.statPoints).toBe(200 * LEVEL_UP_REWARD.statPoints);
  });

  it('the cap lifts after a rebirth (danRank > 0)', () => {
    const reborn = rebirth(initProgression(POOLS), 'fire');
    const p = grind(reborn, 100);
    expect(p.skillPoints).toBeGreaterThan(FIRST_RUN_SP_CAP);
  });
});

describe('rebirth — dan ladder + elemental stacking', () => {
  it('the first rebirth advances dan rank to 1', () => {
    expect(rebirth(initProgression(POOLS), 'fire').danRank).toBe(1);
  });

  it('grants +10 of the chosen element, stacking across N rebirths', () => {
    const per = REBIRTH.elementalPointsPerRebirth;
    let p = initProgression(POOLS);
    for (let n = 1; n <= MAX_DAN_RANK; n++) {
      p = rebirth(p, 'fire');
      expect(p.elemental.fire).toBe(n * per);
      // untouched elements stay at zero
      expect(p.elemental.water).toBe(0);
    }
    expect(per).toBe(10);
  });

  it('distributes points across elements when re-picked differently', () => {
    let p = rebirth(initProgression(POOLS), 'fire');
    p = rebirth(p, 'water');
    expect(p.elemental.fire).toBe(REBIRTH.elementalPointsPerRebirth);
    expect(p.elemental.water).toBe(REBIRTH.elementalPointsPerRebirth);
    expect(p.elemental.earth).toBe(0);
  });

  it('resets the character to a fresh level 1', () => {
    let p = levelUp(levelUp(initProgression(POOLS))); // L3, some SP/stat
    p = rebirth(p, 'earth');
    expect(p.level).toBe(1);
    expect(p.skillPoints).toBe(0);
    expect(p.statPoints).toBe(0);
  });

  it('fully refills the pools on rebirth', () => {
    const p = rebirth(drained(), 'wind');
    expect(p.hp).toEqual({ current: 100, max: 100 });
    expect(p.chi).toEqual({ current: 50, max: 50 });
    expect(p.ap).toEqual({ current: 30, max: 30 });
  });
});

describe('rebirth gold payout schedule', () => {
  it('rebirths 1–9 each pay earlyGold', () => {
    let p = initProgression(POOLS);
    for (let n = 1; n < MAX_DAN_RANK; n++) {
      p = rebirth(p, 'fire');
      expect(p.gold).toBe(n * REBIRTH.earlyGold);
    }
    expect(p.gold).toBe((MAX_DAN_RANK - 1) * REBIRTH.earlyGold); // 9 × 25 = 225
  });

  it('the 10th (final) rebirth pays tenthGold on top', () => {
    let p = initProgression(POOLS);
    for (let n = 1; n <= MAX_DAN_RANK; n++) p = rebirth(p, 'fire');
    expect(p.gold).toBe((MAX_DAN_RANK - 1) * REBIRTH.earlyGold + REBIRTH.tenthGold); // 325
  });
});

describe('MAX_DAN_RANK is the ceiling', () => {
  const toMax = (): Progression => {
    let p = initProgression(POOLS);
    for (let n = 0; n < MAX_DAN_RANK; n++) p = rebirth(p, 'fire');
    return p;
  };

  it('canRebirth is true below the ceiling and false at it', () => {
    let p = initProgression(POOLS);
    for (let n = 0; n < MAX_DAN_RANK; n++) {
      expect(canRebirth(p)).toBe(true);
      p = rebirth(p, 'fire');
    }
    expect(p.danRank).toBe(MAX_DAN_RANK);
    expect(canRebirth(p)).toBe(false);
  });

  it('rebirth at the ceiling refuses (throws) (chaos)', () => {
    const maxed = toMax();
    expect(() => rebirth(maxed, 'fire')).toThrow();
  });

  it('rebirth rejects an unknown element (chaos)', () => {
    // @ts-expect-error — feeding a non-element on purpose
    expect(() => rebirth(initProgression(POOLS), 'lightning')).toThrow();
  });
});

describe('two currencies — coins grindable, gold earnable', () => {
  it('coins accrue via accrueCoins (the grindable currency)', () => {
    expect(accrueCoins(initProgression(POOLS), 8).coins).toBe(8);
  });

  it('gold accrues via rebirth (the earnable currency)', () => {
    expect(rebirth(initProgression(POOLS), 'fire').gold).toBeGreaterThan(0);
  });

  it('the two currencies move independently', () => {
    const withCoins = accrueCoins(initProgression(POOLS), 8);
    expect(withCoins.gold).toBe(0); // coins didn't touch gold
    const reborn = rebirth(initProgression(POOLS), 'fire');
    expect(reborn.coins).toBe(0); // gold didn't touch coins
  });

  it('accrueCoins ignores a non-finite amount (chaos)', () => {
    expect(accrueCoins(initProgression(POOLS), Number.NaN).coins).toBe(0);
    expect(accrueCoins(initProgression(POOLS), Number.POSITIVE_INFINITY).coins).toBe(0);
  });

  it('accrueCoins ignores a negative amount (chaos)', () => {
    expect(accrueCoins(initProgression(POOLS), -5).coins).toBe(0);
  });
});
