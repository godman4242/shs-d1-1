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

/**
 * SAVED WORKFLOWS get the same treatment. `.claude/workflows/*.js` are invocable by name
 * (`Workflow({ name: 'measure-verify' })`), which makes them MORE dangerous than the
 * gauntlet scripts, not less: a saved one is launched from a single line with no chance
 * to reread it. They are checked by the same `wfcheck.mjs`, on the same two branches.
 */
const SAVED_DIR = join(process.cwd(), '.claude/workflows');
const SAVED = readdirSync(SAVED_DIR).filter((f) => f.endsWith('.js')).sort();

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

  it('finds every SAVED workflow in .claude/workflows/', () => {
    expect(SAVED).toContain('measure-verify.js');
  });

  it.each(SAVED)('%s (saved) compiles AND runs on both branches', (name) => {
    const r = check(join(SAVED_DIR, name));
    expect(r.out).toContain('SYNTAX OK');
    expect(r.out).toContain('RUN OK  [all agents DEAD]');
    expect(r.out).toContain('RUN OK  [all agents ALIVE]');
    expect(r.ok).toBe(true);
  });
});

/**
 * MEASURE-VERIFY'S FAIL-CLOSED ACCOUNTING.
 *
 * A DEAD agent and an agent that FOUND NOTHING return the same thing. Two fan-outs
 * shipped from this account ignored that difference and reported a clean pass over work
 * that never ran; both were caught only because a run happened to die. These assertions
 * are the executable version of that lesson, and they are checkable precisely because the
 * accounting is plain code rather than a prompt.
 */
describe('measure-verify keeps its fail-closed accounting', () => {
  const FILE = join(SAVED_DIR, 'measure-verify.js');
  const src = readFileSync(FILE, 'utf8');

  it('spawns one measure per unit and one verify per lens per unit', () => {
    // 4 units x (1 measure + 2 lenses) = 12 agents / 8 verdicts — the shape session 35
    // ran by hand for slice 3a.
    expect(check(FILE).out).toContain('[all agents ALIVE]  12 agents');
  });

  it('spawns NO verifier when the measurement died — and does not drop the unit', () => {
    // Dead measure => UNMEASURED, so its lenses are never asked. 4 agents, not 12.
    expect(check(FILE).out).toContain('[all agents DEAD]  4 agents');
    expect(src).toContain("status: 'UNMEASURED'");
    expect(src).toContain("verdict: 'UNVERIFIED'");
  });

  it('treats zero live verifiers as UNVERIFIED, never CLEAN', () => {
    expect(src).toContain("live.length === 0 ? 'UNVERIFIED' : 'VERIFIED'");
  });

  it('never lets a unit vanish from the result — a missing unit reads as a clean one', () => {
    expect(src).toContain('results[i] ?? { unit: u.name');
  });

  /**
   * THE FLAW THE FIRST REAL RUN EXPOSED (`wf_99c74d25-624`): all 8 verifiers died on the
   * session limit, the integrity line said `0/8 live verdicts`, and beside it the result
   * carried `fatalCount: 0`. Anything reading `fatalCount === 0` read a dead run as clean.
   * Pinned on the EXECUTED dead branch, not on the source text.
   */
  it('a run with dead verifiers carries fatalCount: null and status UNVERIFIED — never a 0 that reads as clean', () => {
    const out = check(FILE).out;
    const result = (label: string): unknown => {
      const line = new RegExp(`\\[all agents ${label}\\][^\\n]*\\n(?:\\s+INTEGRITY:[^\\n]*\\n)?\\s+RESULT: ([^\\n]*)`).exec(out)?.[1];
      expect(line, `no RESULT line for the ${label} branch`).toBeTypeOf('string');
      return JSON.parse(line ?? '{}');
    };
    expect(result('DEAD')).toMatchObject({ status: 'UNVERIFIED', fatalCount: null });
    expect(result('ALIVE')).toMatchObject({ status: 'VERIFIED', fatalCount: 0 });
  });

  it('returns a loud integrity line stating live-vs-expected for both phases', () => {
    expect(src).toContain('live verdicts');
    expect(src).toContain('DIED — it was not clean');
  });

  it('tells every agent it is READ-ONLY, and says why', () => {
    expect(src).toContain('READ-ONLY');
    expect(src).toContain('parallel-overwrite');
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

  it('t1 — the tier that REWRITES the ledger — carries three lenses', () => {
    const s = src('l0-finish-wf3.workflow.js');
    expect(s).toContain("lenses: ['cite', 'hunter', 'contradiction']");
    // 3 packets x 3 lenses = 9, counted by executing it.
    const r = execFileSync('node', [CHECK, join(DIR, 'l0-finish-wf3.workflow.js'), 'run',
      JSON.stringify({ tier: 't1', batches: 3 })], { encoding: 'utf8' });
    expect(r).toContain('[all agents ALIVE]  9 agents');
  });

  it('buildWorklist advertises the SAME lenses the workflow actually spawns', () => {
    // A manifest that promises two lenses while the run spawns three is a manifest that
    // lies to the next session — and this lane already lost work to a stale manifest.
    const wf = src('l0-finish-wf3.workflow.js');
    const py = readFileSync(join(process.cwd(), 'scripts/gauntlet/buildWorklist.py'), 'utf8');
    const inWorkflow = /lenses: \[([^\]]+)\],\n\s+what: 'CLAIMS A LEDGER OVERTURN/.exec(wf);
    const inScript = /emit\(tier1, "t1-overturns", args\.batch_size, "WF-3a", \[([^\]]+)\]\)/.exec(py);
    const wfLenses = inWorkflow?.[1];
    const pyLenses = inScript?.[1];
    expect(wfLenses, 'TIERS.t1.lenses not found in l0-finish-wf3.workflow.js').toBeTypeOf('string');
    expect(pyLenses, 'the t1 emit() lens list not found in buildWorklist.py').toBeTypeOf('string');
    const norm = (x: string): string[] => x.split(',').map((t) => t.trim().replace(/['"]/g, '')).sort();
    expect(norm(pyLenses ?? '')).toEqual(norm(wfLenses ?? ''));
  });

  it('buildWorklist DEFAULTS to a depth-sized batch, not a throughput-sized one', () => {
    // checkpointL0.sh rebuilds the worklist on every bank and passes no --batch-size, so
    // a width that lives only in a command line reverts the next time a wave lands.
    const py = readFileSync(join(process.cwd(), 'scripts/gauntlet/buildWorklist.py'), 'utf8');
    const m = /^BATCH_SIZE = (\d+)$/m.exec(py);
    expect(m, 'BATCH_SIZE not found in buildWorklist.py').not.toBeNull();
    expect(Number(m?.[1] ?? 0)).toBeLessThanOrEqual(8);
    const sh = readFileSync(join(process.cwd(), 'scripts/gauntlet/checkpointL0.sh'), 'utf8');
    expect(sh).toContain('buildWorklist.py');
    expect(sh).not.toContain('--batch-size');   // if this ever appears, keep the two in step
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
