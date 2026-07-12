/**
 * Cross-process determinism (Stage 2 gate item): spawn the seeded probe in
 * TWO separate OS processes (child `vitest run` each — no extra runner deps
 * exist in the fixed stack) and require byte-identical fingerprints. Also
 * cross-checks the children against this process's own run, so all THREE
 * processes agree.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { duelFingerprint } from './utils/duel-bot';

const PROBE_SEED = 7; // must match determinism-probe.test.ts

describe('Sim determinism — cross-process', () => {
  it(
    'two child processes + this process produce byte-identical duels',
    { timeout: 180_000 },
    () => {
      const dir = mkdtempSync(join(tmpdir(), 'sshd-fp-'));
      try {
        const outs = ['a', 'b'].map((tag) => {
          const out = join(dir, `fingerprint-${tag}.json`);
          execFileSync('npx', ['vitest', 'run', 'tests/determinism-probe.test.ts'], {
            cwd: process.cwd(),
            env: { ...process.env, FINGERPRINT_OUT: out },
            stdio: 'pipe',
            timeout: 120_000,
          });
          expect(existsSync(out)).toBe(true);
          return readFileSync(out, 'utf8');
        });
        expect(outs[1]).toBe(outs[0]);
        expect(outs[0]).toBe(duelFingerprint(PROBE_SEED));
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    },
  );
});
