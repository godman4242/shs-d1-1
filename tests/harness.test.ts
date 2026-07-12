/**
 * 24-seed duel harness (Stage 2 spec item 14 / gate):
 * good-play wins 100%, no-play wins 0%, median duration ∈ [20, 60] s,
 * ≥22 distinct durations across the 24 seeds. The spec's reference median
 * (~24.7 s) is implementation-specific to its own bot; the binding assert
 * is the spec's own [20, 60] band (decision flagged in the session log —
 * veto = retune the bot cadence).
 */
import { describe, expect, it } from 'vitest';
import { runDuel, type DuelOutcome } from './utils/duel-bot';

const SEEDS = Array.from({ length: 24 }, (_, i) => i + 1);

describe('24-seed harness (normal tier)', () => {
  const good: DuelOutcome[] = SEEDS.map((s) => runDuel(s, 'good'));
  const none: DuelOutcome[] = SEEDS.map((s) => runDuel(s, 'none'));

  it('good play wins 24/24', () => {
    expect(good.filter((r) => r.winner === 'player')).toHaveLength(24);
  });
  it('no play wins 0/24 (the enemy always closes it out)', () => {
    expect(none.filter((r) => r.winner === 'player')).toHaveLength(0);
    expect(none.filter((r) => r.winner === 'timeout')).toHaveLength(0);
  });
  it('median good-play duel length lands in the boss/PvP band [20, 60] s', () => {
    const secs = good.map((r) => r.seconds).sort((a, b) => a - b);
    const lo = secs[11];
    const hi = secs[12];
    expect(lo).toBeDefined();
    expect(hi).toBeDefined();
    const median = ((lo ?? 0) + (hi ?? 0)) / 2;
    expect(median).toBeGreaterThanOrEqual(20);
    expect(median).toBeLessThanOrEqual(60);
  });
  it('≥22 distinct durations (jitter + reactions differentiate the seeds)', () => {
    expect(new Set(good.map((r) => r.frames)).size).toBeGreaterThanOrEqual(22);
  });
});
