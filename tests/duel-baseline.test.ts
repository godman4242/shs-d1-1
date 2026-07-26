/**
 * THE DUEL BASELINE — SESSION14 A0, and the session's binding invariant (D2).
 *
 * SESSION 14 generalises `Sim` from hard-wired 1v1 to N enemies. That refactor
 * touches every gameplay path, and its dangerous failure mode is **not** a
 * crash: it is the duel drifting by a few frames while every existing test
 * stays green, because none of them pins an absolute value.
 *
 * ⚠️ In particular `tests/determinism.test.ts` does NOT protect against this.
 * It proves that runs agree **with each other** (in-process ×2 and
 * cross-process), which survives any behaviour change so long as the change is
 * deterministic. A silent retune would sail straight through it.
 *
 * So this file records what the duel actually DID at commit `335e615`, the
 * close of SESSION 13, as exact expected values. After the N-actor refactor,
 * "the duel did not move" becomes a diff rather than a memory — and at N=1 the
 * generalisation must reproduce these numbers BYTE-IDENTICALLY, not merely
 * land inside the `[8, 25] s` band.
 *
 * **If this file goes red during SESSION 14, the refactor is not a
 * generalisation yet. Fix the refactor. Do not re-record these numbers.**
 * (Re-recording them is only legitimate for a deliberate, documented model
 * change — and then the DIVERGENCES entry comes first.)
 */
import { describe, expect, it } from 'vitest';
import { DUEL_TARGET_SECONDS } from '../src/config/ai';
import { FIXED_HZ } from '../src/config/timing';
import { duelEnemyDerived } from '../src/core/duelSetup';
import { duelFingerprint, runDuel, type DuelOutcome } from './utils/duel-bot';

const SEEDS = Array.from({ length: 24 }, (_, i) => i + 1);

/** Frames per seed, good-play policy, seeds 1..24 in order. Commit 335e615. */
const BASELINE_GOOD_FRAMES = [
  593, 584, 711, 634, 701, 643, 642, 544, 700, 564, 611, 604,
  551, 610, 635, 656, 758, 594, 550, 639, 695, 726, 705, 621,
];

/** Frames per seed, no-play policy (the player never acts). Commit 335e615. */
const BASELINE_NONE_FRAMES = [
  2818, 2805, 3135, 3044, 2901, 2940, 3019, 2679, 3260, 2763, 2746, 2540,
  2766, 2864, 2993, 2957, 3144, 2771, 2660, 2932, 3029, 2524, 3172, 3106,
];

/**
 * One seed's full outcome, serialised — the strongest single pin here, because
 * it includes the rolling state checksum over the whole fight, not just its
 * length. Two runs of different length are obviously different; two runs of the
 * SAME length that diverged mid-fight are only caught by this.
 */
const BASELINE_FINGERPRINT_SEED_7 =
  '{"winner":"player","frames":642,"seconds":10.7,"playerHp":82.66666666666669,"enemyHp":0,"checksum":2653939183}';

const median = (frames: readonly number[]): number => {
  const sorted = [...frames].sort((a, b) => a - b);
  return (((sorted[11] ?? 0) + (sorted[12] ?? 0)) / 2) / FIXED_HZ;
};

describe('duel baseline — SESSION13 close (335e615), pinned EXACTLY', () => {
  const good: DuelOutcome[] = SEEDS.map((s) => runDuel(s, 'good'));
  const none: DuelOutcome[] = SEEDS.map((s) => runDuel(s, 'none'));

  it('good-play frames are unchanged, seed by seed', () => {
    expect(good.map((r) => r.frames)).toEqual(BASELINE_GOOD_FRAMES);
  });
  it('no-play frames are unchanged, seed by seed', () => {
    // The losing side matters just as much: an N-actor refactor that changed
    // only the ENEMY's path would leave good-play untouched and show up here.
    expect(none.map((r) => r.frames)).toEqual(BASELINE_NONE_FRAMES);
  });
  it('the full outcome fingerprint for seed 7 is unchanged (checksum included)', () => {
    expect(duelFingerprint(7)).toBe(BASELINE_FINGERPRINT_SEED_7);
  });
  it('the median is 10.575 s — the number SESSION13 shipped', () => {
    expect(median(BASELINE_GOOD_FRAMES)).toBeCloseTo(10.575, 10);
    expect(median(good.map((r) => r.frames))).toBeCloseTo(10.575, 10);
  });
  it('…and it sits inside the derived band, which is a WEAKER claim than the above', () => {
    // Kept so the relationship is explicit: passing the band is necessary but
    // nowhere near sufficient. The band would tolerate a ±7 s drift; the
    // per-seed pins tolerate none.
    const m = median(good.map((r) => r.frames));
    expect(m).toBeGreaterThanOrEqual(DUEL_TARGET_SECONDS.min);
    expect(m).toBeLessThanOrEqual(DUEL_TARGET_SECONDS.max);
  });
});

describe('duel baseline — the derived enemy (SESSION13 D3), pinned EXACTLY', () => {
  it('hp 50 · minDamage 100/18 · defense 5 · K 10 · D 18 · xp 90', () => {
    const d = duelEnemyDerived();
    expect(d.hp).toBe(50);
    expect(d.minDamage).toBeCloseTo(100 / 18, 10);
    expect(d.defense).toBe(5);
    expect(d.k).toBe(10);
    expect(d.d).toBe(18);
    expect(d.xpReward).toBe(90);
  });
});
