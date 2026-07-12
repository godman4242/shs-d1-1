/**
 * Determinism probe (Stage 2 gate: same seed + intents = same result,
 * CROSS-PROCESS). Dual-mode:
 * - In the normal suite: asserts two fresh in-process runs of the same
 *   seeded duel produce byte-identical fingerprints.
 * - Spawned as a child process (FINGERPRINT_OUT set): additionally WRITES
 *   the fingerprint to that path so tests/determinism.test.ts can compare
 *   two separate OS processes.
 */
import { writeFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { duelFingerprint } from './utils/duel-bot';

const PROBE_SEED = 7;

it('same seed + same scripted intents → identical result (in-process ×2)', () => {
  const a = duelFingerprint(PROBE_SEED);
  const b = duelFingerprint(PROBE_SEED);
  expect(b).toBe(a);
  const out = process.env.FINGERPRINT_OUT;
  if (out !== undefined && out !== '') writeFileSync(out, a);
});
