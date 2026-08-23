/**
 * THE WORKFLOW SCRIPTS — the only 1,100 lines in this repo that nothing checked.
 *
 * `scripts/gauntlet/*.workflow.js` spawn 40+ agents apiece and drive every L0 wave, yet
 * until 2026-08-23 no test, lint or typecheck ever read them: they are `.js`, they live
 * outside `src/`, and `node --check` REJECTS all of them (top-level `return` is legal
 * only inside a function body, which is how the workflow runtime evaluates them). So a
 * broken script was discovered by launching it — at the cost of the wave.
 *
 * `scripts/gauntlet/wfcheck.mjs` compiles each script the way the runtime does and then
 * EXECUTES it against stubs on both branches — every agent dead, and every agent alive.
 * Both matter: the dead branch is the fail-closed accounting (§0 — zero live critics
 * means UNJUDGED, never confirmed), and the alive branch is the code that only ever runs
 * when a wave succeeds, which is exactly the code a wave cannot afford to have wrong.
 *
 * The bug that motivated this: `HUNTS` spread a `const FRAME_HUNTS` declared BELOW it.
 * That parses clean and throws ReferenceError the moment it evaluates. Compiling alone
 * would have shipped it.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const CHECK = join(process.cwd(), 'scripts/gauntlet/wfcheck.mjs');
const DIR = join(process.cwd(), 'scripts/gauntlet');

const SCRIPTS = readdirSync(DIR).filter((f) => f.endsWith('.workflow.js')).sort();

function check(file: string): { ok: boolean; out: string } {
  try {
    return { ok: true, out: execFileSync('node', [CHECK, file, 'run'], { encoding: 'utf8' }) };
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string };
    return { ok: false, out: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

let tmp = '';
afterEach(() => {
  if (tmp) rmSync(tmp, { recursive: true, force: true });
  tmp = '';
});

function scratch(body: string): string {
  tmp = mkdtempSync(join(tmpdir(), 'wfcheck-'));
  const p = join(tmp, 'x.workflow.js');
  writeFileSync(p, body, 'utf8');
  return p;
}

describe('the workflow scripts are checked at all', () => {
  it('finds every workflow script in scripts/gauntlet/', () => {
    expect(SCRIPTS.length).toBeGreaterThanOrEqual(7);
    expect(SCRIPTS).toContain('l0-finish-wf3.workflow.js');
    expect(SCRIPTS).toContain('l0-finish-wf4.workflow.js');
    expect(SCRIPTS).toContain('l0-rewrite.workflow.js');
  });

  it.each(SCRIPTS)('%s compiles AND runs on both branches', (name) => {
    const r = check(join(DIR, name));
    expect(r.out).toContain('SYNTAX OK');
    expect(r.out).toContain('RUN OK  [all agents DEAD]');
    expect(r.out).toContain('RUN OK  [all agents ALIVE]');
    expect(r.ok).toBe(true);
  });
});

describe('the checker actually catches things (chaos-planted)', () => {
  it('goes RED on a syntax error', () => {
    const r = check(scratch('export const meta = { name: "x" }\nconst a = (\nreturn {}\n'));
    expect(r.ok).toBe(false);
    expect(r.out).toContain('SYNTAX FAIL');
  });

  it('goes RED on a temporal-dead-zone spread that PARSES CLEAN', () => {
    // The exact shape of the real bug: an array spreads a const declared after it.
    const r = check(scratch([
      'export const meta = { name: "x", description: "d", phases: [] }',
      'const A = [...B]',
      'const B = ["one"]',
      'return { A }',
    ].join('\n')));
    expect(r.out).toContain('SYNTAX OK');          // parsing alone would have passed it
    expect(r.ok).toBe(false);
    expect(r.out).toContain('Cannot access');
    expect(r.out).toContain('before initialization');
  });

  it('goes RED when only the ALIVE branch is broken', () => {
    // A wave that succeeds is the branch a dead-agent-only stub never exercises.
    const r = check(scratch([
      'export const meta = { name: "x", description: "d", phases: [] }',
      'const r = await agent("go")',
      'if (r) { throw new Error("only fires when the agent LIVED") }',
      'return { ok: true }',
    ].join('\n')));
    expect(r.out).toContain('RUN OK  [all agents DEAD]');
    expect(r.out).toContain('RUN FAIL [all agents ALIVE]');
    expect(r.ok).toBe(false);
  });

  it('really runs pipeline stages rather than stubbing them away', () => {
    const r = check(scratch([
      'export const meta = { name: "x", description: "d", phases: [] }',
      'await pipeline(["a"], (i) => i, () => { throw new Error("stage two ran") })',
      'return {}',
    ].join('\n')));
    expect(r.ok).toBe(false);
    expect(r.out).toContain('stage two ran');
  });
});

describe('the widened fan-outs stay widened', () => {
  const src = (n: string): string => readFileSync(join(DIR, n), 'utf8');

  it('l0-rewrite verifies every slice with TWO distinct lenses', () => {
    const s = src('l0-rewrite.workflow.js');
    expect(s).toContain("key: 'evidence'");
    expect(s).toContain("key: 'calibration'");
    // 14 slices x (1 writer + 2 verifiers) = 42, counted by executing it.
    expect(check(join(DIR, 'l0-rewrite.workflow.js')).out).toContain('[all agents ALIVE]  42 agents');
  });

  it('l0-rewrite approval is UNANIMOUS — one refusal is a refusal', () => {
    const s = src('l0-rewrite.workflow.js');
    expect(s).toContain('!r.verifiers.every((v) => v.approve)');
    // A slice only one lens read is not verified: the other lens ran for nobody.
    expect(s).toContain('r.verifiers.length < VERIFY_LENSES.length');
    expect(s).toContain('partial.length === 0');
  });

  it('l0-finish-wf4 splits the 7,381-frame corpus across three hunters', () => {
    const s = src('l0-finish-wf4.workflow.js');
    expect(s).toContain('const FRAME_HUNTS');
    // Declared BEFORE HUNTS, or it throws at evaluation — the bug this file was born of.
    expect(s.indexOf('const FRAME_HUNTS')).toBeLessThan(s.indexOf('const HUNTS'));
    expect(s).toContain('session24');
    expect(s).toContain('zFtCaTO0_1M');
    expect(s).toContain('Nr4fQstqHDM');
    // 6 hunters + 1 completeness on a converging 2-round run = 13.
    expect(check(join(DIR, 'l0-finish-wf4.workflow.js')).out).toContain('[all agents ALIVE]  13 agents');
  });
});
