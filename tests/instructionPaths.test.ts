/**
 * THE INSTRUCTION-PATH GATE'S OWN GATE.
 *
 * Two halves, for the reason `tests/claimcheck.test.ts` splits the same way:
 *
 * 1. HERMETIC TESTS of the extractor, including KNOWN-POSITIVE CONTROLS. A scan that
 *    cannot match is not evidence of absence — JClaw learned that when a documented
 *    `git grep -nE` credential battery measured 0 of 9 planted secrets and reported
 *    CLEAN for months (f588bc44). The controls here plant the real defect in a fixture
 *    and require the extractor to find it, so a green from the real run means something.
 *
 * 2. THE REAL RUN over this repo's standing instruction files, requiring exit 0.
 *
 * ⚠️ THE THREE FALSE-PASS CONTROLS ARE THE POINT. Each pins a way this gate was MEASURED
 * to report a clean zero over a live defect. Do not "simplify" them away.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FILES, ROOTS, check, extract, problems } from '../scripts/gates/instructionPaths.ts';

const ROOT = join(import.meta.dirname, '..');

describe('extract — known-positive controls', () => {
  it('finds a backticked path token', () => {
    expect(extract('see `src/core/sim.ts` for it')).toEqual(['src/core/sim.ts']);
  });

  it('finds a directory token', () => {
    expect(extract('lives in `docs/sessions/`')).toEqual(['docs/sessions/']);
  });

  it('strips a `file:line` cite suffix so the path still resolves', () => {
    expect(extract('at `src/core/sim.ts:12`')).toEqual(['src/core/sim.ts']);
  });

  it('would have caught the real defect — CLAUDE.md naming a deleted ship-bar file', () => {
    expect(extract('auto-injects from `.claude/ship-bar.md`.')).toEqual(['.claude/ship-bar.md']);
  });

  it('ignores prose, URLs and slashless tokens', () => {
    expect(extract('`and/or` `https://x.dev/a.ts` `a b/c.ts` `Sim.ts` plain')).toEqual([]);
  });
});

describe('the three false-pass controls', () => {
  /**
   * CONTROL 1 — $HOME is never a base. `.claude/ship-bar.md` does NOT exist here but DOES
   * exist at ~/.claude/ship-bar.md, so resolving bare tokens against $HOME would have made
   * this gate green over the exact defect it was built for. Measured, not reasoned.
   */
  it('never resolves anything against $HOME — asserted on the SOURCE, not the environment', () => {
    // The first version of this control asserted that ~/.claude/ship-bar.md EXISTS, to show
    // that a $HOME fallback would have hidden the founding defect. That made the test depend
    // on a file outside the repo — the exact thing this gate's own header forbids — and it
    // passed locally and FAILED IN CI, where $HOME holds no such file. Assert the property
    // statically instead: the gate may not reach for $HOME at all. Environment-independent,
    // and strictly stronger than the behavioural check it replaces.
    const gate = readFileSync(join(ROOT, 'scripts/gates/instructionPaths.ts'), 'utf8');
    expect(gate).not.toMatch(/process\.env\.HOME|homedir\(/);
    // And the other half of the same hazard: a `~`-rooted token never becomes a lookup.
    expect(extract('see `~/.claude/ship-bar.md`')).toEqual([]);
    // The founding defect still resolves to nothing under the repo root.
    expect(existsSync(join(ROOT, '.claude/ship-bar.md'))).toBe(false);
    expect(extract('auto-injects from `.claude/ship-bar.md`.')).toEqual(['.claude/ship-bar.md']);
  });

  /** CONTROL 2 — extensionless paths stay in scope. "extension or trailing slash" alone
   *  silently drops `.githooks/pre-commit`, the path the Quality gate section leans on. */
  it('keeps an extensionless path whose first segment is a declared ROOT', () => {
    expect(extract('runs `.githooks/pre-commit`')).toEqual(['.githooks/pre-commit']);
    expect(extract('see `src/core/npc`')).toEqual(['src/core/npc']);
  });

  /** CONTROL 3 — every ROOT exists AND is tracked. An untracked ROOT (the gitignored
   *  `reference/` is the live temptation) would make this suite red on every CI run. */
  it('declares only ROOTS that exist and are tracked', () => {
    expect(check(ROOT).missingRoots).toEqual([]);
    for (const r of ROOTS) {
      const tracked = execFileSync('git', ['-C', ROOT, 'ls-files', '--', r], { encoding: 'utf8' });
      expect(tracked.length, `ROOTS entry ${r} is not tracked — CI would not have it`).toBeGreaterThan(0);
    }
  });
});

describe('the real instruction files', () => {
  const report = check(ROOT);

  it('names no path that does not exist', () => {
    expect(report.dead).toEqual([]);
  });

  it('gets at least one token out of every file it claims to read', () => {
    // A file contributing nothing is indistinguishable from one never opened. This is the
    // broken-extractor guard, and it is deliberately NOT a count floor: a floor is a second
    // copy of a number every prose edit can drift, which is this repo's own killer.
    expect(report.emptyFiles).toEqual([]);
    expect(report.tokens.length).toBeGreaterThan(FILES.length);
  });

  it('reports no problems at all', () => {
    expect(problems(report)).toEqual([]);
  });

  it('exits 0 from the command the docs-only fast path runs', () => {
    const out = execFileSync('node', [join(ROOT, 'scripts/gates/instructionPaths.ts')], { encoding: 'utf8' });
    expect(out).toContain('every path an instruction file names resolves');
  });
});
