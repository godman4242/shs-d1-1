/**
 * GATES L0-B … L0-F — the binary gate for lane L0.
 *
 * `GAUNTLET.md` §3.6: *"Binary. Every item green with pasted output, or the lane is
 * open. Never soften a gate to fit a result."* A gate a human eyeballs is a gate that
 * gets softened, so `scripts/gauntlet/gateL0.py` decides each item mechanically and
 * exits non-zero if any is red.
 *
 * The load-bearing one is **L0-B**. §0 says an UNJUDGED claim is a LEAD and may not
 * enter the ledger — and the way that rule gets broken is not by anyone deciding to
 * break it, but by a claim quietly drifting into a rewrite nobody re-checked. So the
 * rewritten `REBUILD_READINESS.md` cites its evidence as `[[unit/claim-slug]]`
 * references, and this gate resolves every one of them against the pooled verdicts.
 *
 * Hermetic: each test builds a throwaway L0 tree in a temp dir, so the gate runs in a
 * clean clone with no `reference/` study material present.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = join(process.cwd(), 'scripts/gauntlet/gateL0.py');

const SOURCES = [
  'questdata', 'skilldata', 'npcdata', 'itemdata', 'bindata', 'actionscript',
  'android-blobs', 'string-table', 'frames', 'uistrings-payload',
];
const SYSTEMS = [
  'combat-core', 'skills-meters', 'progression', 'rebirth-elements', 'items-equipment',
  'economy', 'enemies-ai', 'world-exploration', 'quests-story', 'ui-hud',
  'art-anim-audio-feel', 'meta-social',
];

interface GateRow { id: string; green: boolean; detail: string }
interface GateReport { green: boolean; gates: GateRow[] }

let dir = '';

function put(rel: string, body: string): void {
  const abs = join(dir, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body, 'utf8');
}

function run(): { report: GateReport; code: number } {
  const out = join(dir, 'gate.json');
  let code = 0;
  try {
    execFileSync(
      'python3',
      [SCRIPT, '--root', join(dir, 'docs/gauntlet/L0'),
        '--ledger', join(dir, 'docs/research/REBUILD_READINESS.md'),
        '--out', out],
      { stdio: 'pipe', timeout: 60_000 },
    );
  } catch (err) {
    code = (err as { status?: number }).status ?? 1;
  }
  return { report: JSON.parse(readFileSync(out, 'utf8')) as GateReport, code };
}

function gate(report: GateReport, id: string): GateRow {
  const row = report.gates.find((g) => g.id === id);
  if (!row) throw new Error(`gate ${id} missing from report: ${report.gates.map((g) => g.id).join(',')}`);
  return row;
}

/** A minimal L0 tree in which every gate is green. Each test breaks exactly one thing. */
function buildGreenTree(): void {
  for (const unit of SOURCES) {
    put(`docs/gauntlet/L0/sources/${unit}.md`, `# ${unit} survey`);
    put(`docs/gauntlet/L0/critics/src-${unit}.cite.md`, 'cite review');
    put(`docs/gauntlet/L0/critics/src-${unit}.hunter.md`, 'hunter review');
  }
  put('docs/gauntlet/L0/run2/claims.json', JSON.stringify(
    SYSTEMS.map((s) => ({ id: `${s}/anchor`, unit: s, artifact_class: 'A2', cite: 'x', text: 't' }))));
  put('docs/gauntlet/L0/run2/verdicts.json', JSON.stringify(
    SYSTEMS.map((s) => ({ claim_id: `${s}/anchor`, refuted: false, own_cite: 'artifact', reason: 'r' }))));
  put('docs/gauntlet/L0/citelint.json', JSON.stringify({
    summary: {}, claims: SYSTEMS.map((s) => ({ id: `${s}/anchor`, status: 'RESOLVES', problems: [], notes: [] })),
  }));
  put('docs/gauntlet/L0/convergence.json', JSON.stringify({ converged: true, dead_rounds: 0, rounds_run: 3, dry_streak: 2 }));

  const scorecard = SYSTEMS.map((s) => `| ${s} | 70 | [[${s}/anchor]] |`).join('\n');
  put('docs/research/REBUILD_READINESS.md', [
    '# REBUILD READINESS', '',
    '## 2. Readiness scorecard (per system)', '',
    '| system | score | evidence |', '|---|---|---|', scorecard, '',
    '## 6. What is structurally UNRECOVERABLE', '',
    '- **The dead IAP economy** — NEGATIVE-SEARCH: `grep -rc iap reference/` -> 0 hits.', '',
    '## 7. The verdict', '',
  ].join('\n'));
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'sshd-gate-'));
  buildGreenTree();
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('gateL0 — the binary gate for lane L0', () => {
  it('is green on a complete tree, and exits 0', () => {
    const { report, code } = run();
    expect(report.gates.map((g) => g.id)).toEqual(['L0-A', 'L0-B', 'L0-C', 'L0-D', 'L0-E', 'L0-F']);
    const red = report.gates.filter((g) => !g.green);
    expect(red.map((g) => `${g.id}: ${g.detail}`)).toEqual([]);
    expect(report.green).toBe(true);
    expect(code).toBe(0);
  });

  /**
   * The gate's own fail-open. Before the rewrite, the ledger cites nothing, so "every
   * cited claim resolves" and "every cited claim was judged" are both vacuously true —
   * and a vacuous green reads as a pass. An un-rewritten ledger is an OPEN lane.
   */
  it('L0-A and L0-B go red on a ledger that cites nothing at all', () => {
    const led = join(dir, 'docs/research/REBUILD_READINESS.md');
    writeFileSync(led, readFileSync(led, 'utf8').replace(/\[\[[^\]]+\]\]/g, 'STILL_UNHELD'));
    const { report, code } = run();
    expect(gate(report, 'L0-A').green).toBe(false);
    expect(gate(report, 'L0-A').detail).toContain('cites no claim');
    expect(gate(report, 'L0-B').green).toBe(false);
    expect(gate(report, 'L0-B').detail).toContain('cites no claim');
    expect(code).toBe(1);
  });

  it('L0-A goes red when a ledger-cited claim has a BROKEN cite', () => {
    put('docs/gauntlet/L0/citelint.json', JSON.stringify({
      summary: {},
      claims: SYSTEMS.map((s, i) => ({
        id: `${s}/anchor`, status: i === 0 ? 'BROKEN' : 'RESOLVES',
        problems: i === 0 ? ['MISSING_PATH:reference/gone.as'] : [], notes: [],
      })),
    }));
    const { report, code } = run();
    expect(gate(report, 'L0-A').green).toBe(false);
    expect(gate(report, 'L0-A').detail).toContain('combat-core/anchor');
    expect(code).toBe(1);
  });

  /** The rule this whole lane exists to protect. */
  it('L0-B goes red when the ledger cites a claim NO critic ever judged', () => {
    const led = join(dir, 'docs/research/REBUILD_READINESS.md');
    writeFileSync(led, readFileSync(led, 'utf8') + '\nA new finding [[combat-core/never-judged]].\n');
    const { report, code } = run();
    expect(gate(report, 'L0-B').green).toBe(false);
    expect(gate(report, 'L0-B').detail).toContain('combat-core/never-judged');
    expect(code).toBe(1);
  });

  it('L0-B goes red when the ledger cites a claim the critics REFUTED', () => {
    put('docs/gauntlet/L0/run2/verdicts.json', JSON.stringify(
      SYSTEMS.map((s, i) => ({
        claim_id: `${s}/anchor`, refuted: i === 0, own_cite: 'artifact', reason: 'r',
      }))));
    const { report } = run();
    expect(gate(report, 'L0-B').green).toBe(false);
    expect(gate(report, 'L0-B').detail).toContain('combat-core/anchor');
  });

  /** A VOID verdict (§0: no artifact of its own) is not judgement at all. */
  it('L0-B treats a verdict with no own_cite as VOID, so the claim stays unjudged', () => {
    put('docs/gauntlet/L0/run2/verdicts.json', JSON.stringify(
      SYSTEMS.map((s, i) => ({
        claim_id: `${s}/anchor`, refuted: false, own_cite: i === 0 ? '   ' : 'artifact', reason: 'r',
      }))));
    const { report } = run();
    expect(gate(report, 'L0-B').green).toBe(false);
    expect(gate(report, 'L0-B').detail).toContain('combat-core/anchor');
  });

  it('L0-C goes red when convergence was declared with a dead round in it', () => {
    put('docs/gauntlet/L0/convergence.json',
      JSON.stringify({ converged: true, dead_rounds: 1, rounds_run: 3, dry_streak: 2 }));
    const { report } = run();
    expect(gate(report, 'L0-C').green).toBe(false);
    expect(gate(report, 'L0-C').detail).toContain('dead');
  });

  it('L0-C goes red when no convergence receipt exists at all', () => {
    rmSync(join(dir, 'docs/gauntlet/L0/convergence.json'));
    const { report } = run();
    expect(gate(report, 'L0-C').green).toBe(false);
  });

  it('L0-D goes red when a source has a survey but fewer than two critics', () => {
    rmSync(join(dir, 'docs/gauntlet/L0/critics/src-frames.hunter.md'));
    const { report } = run();
    expect(gate(report, 'L0-D').green).toBe(false);
    expect(gate(report, 'L0-D').detail).toContain('frames');
  });

  it('L0-D goes red when a source was never surveyed', () => {
    rmSync(join(dir, 'docs/gauntlet/L0/sources/android-blobs.md'));
    const { report } = run();
    expect(gate(report, 'L0-D').green).toBe(false);
    expect(gate(report, 'L0-D').detail).toContain('android-blobs');
  });

  it('L0-E goes red when a §6 entry is kept without a pasted negative search', () => {
    const led = join(dir, 'docs/research/REBUILD_READINESS.md');
    writeFileSync(led, readFileSync(led, 'utf8').replace(
      '- **The dead IAP economy** — NEGATIVE-SEARCH: `grep -rc iap reference/` -> 0 hits.',
      '- **The dead IAP economy** — nothing to copy, design an offline faucet.'));
    const { report } = run();
    expect(gate(report, 'L0-E').green).toBe(false);
    expect(gate(report, 'L0-E').detail).toContain('IAP');
  });

  it('L0-E is green on an EMPTY §6 — a provably minimal list may be empty', () => {
    const led = join(dir, 'docs/research/REBUILD_READINESS.md');
    writeFileSync(led, readFileSync(led, 'utf8').replace(
      '- **The dead IAP economy** — NEGATIVE-SEARCH: `grep -rc iap reference/` -> 0 hits.',
      'Every entry the payload disproved has been deleted. Nothing remains.'));
    const { report, code } = run();
    expect(gate(report, 'L0-E').green).toBe(true);
    expect(code).toBe(0);
  });

  it('L0-F goes red when a system score carries no claim reference', () => {
    const led = join(dir, 'docs/research/REBUILD_READINESS.md');
    writeFileSync(led, readFileSync(led, 'utf8').replace(
      '| ui-hud | 70 | [[ui-hud/anchor]] |', '| ui-hud | 70 | looks about right |'));
    const { report } = run();
    expect(gate(report, 'L0-F').green).toBe(false);
    expect(gate(report, 'L0-F').detail).toContain('ui-hud');
  });

  it('L0-F accepts an explicit STILL_UNHELD in place of a cite', () => {
    const led = join(dir, 'docs/research/REBUILD_READINESS.md');
    writeFileSync(led, readFileSync(led, 'utf8').replace(
      '| ui-hud | 70 | [[ui-hud/anchor]] |', '| ui-hud | 70 | STILL_UNHELD |'));
    const { report, code } = run();
    expect(gate(report, 'L0-F').green).toBe(true);
    expect(code).toBe(0);
  });
});
