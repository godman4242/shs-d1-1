/**
 * WALL INSURANCE — `salvageJournal.py --critic-json`.
 *
 * Lane L0 has hit the usage limit EIGHT times. The standing rule (GAUNTLET.md §3.4,
 * "journal as you go") is why nothing has been lost: agents write their output to disk
 * BEFORE returning, so a dead run is salvageable from the journal.
 *
 * Wall #8 found the hole in that rule. Both workflows reported `0 agents done`, yet
 * SEVEN critic reviews were on disk — and the journals held zero result records, so
 * `salvageJournal.py` could extract nothing. The PROSE survived; the STRUCTURED
 * VERDICTS did not. That prose can never be re-ingested either: §3.2 forbids a blind
 * re-judge from reading another agent's reasoning, so the only lawful use of a lost
 * verdict is to judge the claim again from scratch. Seven reviews' worth of judging
 * was simply gone.
 *
 * The fix has two halves. The workflows now make every agent write the exact
 * structured object it is about to return as JSON alongside its prose; this half
 * teaches the salvage script to extract from those side-files when the journal is
 * empty or absent, and to merge without double-counting when it is not.
 *
 * Hermetic: a throwaway tree per test, so this runs in a clean clone with no
 * `reference/` study material and no workflow transcripts present.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = join(process.cwd(), 'scripts/gauntlet/salvageJournal.py');

interface Claim { id?: string; unit?: string; text?: string; origin?: string }
interface Verdict { claim_id?: string; own_cite?: string; reason?: string; refuted?: boolean }

let dir = '';

function put(rel: string, body: string): void {
  const abs = join(dir, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body, 'utf8');
}

/** One agent's structured return, written to disk the way the workflows now do. */
function sidecar(rel: string, body: unknown): void {
  put(rel, JSON.stringify(body));
}

/** A harness journal: one JSON object per line, results nested under `result`. */
function journal(rel: string, results: unknown[]): void {
  put(rel, results.map((r) => JSON.stringify({ result: r })).join('\n'));
}

function run(extra: string[]): string {
  return execFileSync('python3', [SCRIPT, '--out', join(dir, 'out'), ...extra],
    { stdio: 'pipe', timeout: 60_000, encoding: 'utf8' });
}

function extracted(): { claims: Claim[]; verdicts: Verdict[] } {
  return {
    claims: JSON.parse(readFileSync(join(dir, 'out/claims.json'), 'utf8')) as Claim[],
    verdicts: JSON.parse(readFileSync(join(dir, 'out/verdicts.json'), 'utf8')) as Verdict[],
  };
}

const verdict = (id: string, cite = 'reference/y.as:2') => ({
  claim_id: id, refuted: false, own_cite: cite, reason: `judged ${id}`,
});
const finding = (id: string) => ({
  id, text: `finding ${id}`, artifact_class: 'A2', cite: 'reference/x.as:1', verdict: 'HELD',
});

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'sshd-salvage-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('salvageJournal — the journal path still works', () => {
  it('extracts verdicts and survey claims from a journal', () => {
    journal('wf.jsonl', [
      { unit: 'combat-core', claims: [finding('combat-core/a')] },
      { verdicts: [verdict('combat-core/a')], new_findings: [finding('combat-core/b')] },
    ]);
    run([join(dir, 'wf.jsonl')]);
    const { claims, verdicts } = extracted();
    expect(verdicts.map((v) => v.claim_id)).toEqual(['combat-core/a']);
    expect(claims.map((c) => c.id).sort()).toEqual(['combat-core/a', 'combat-core/b']);
    expect(claims.find((c) => c.id === 'combat-core/a')?.unit).toBe('combat-core');
  });
});

describe('salvageJournal --critic-json — what wall #8 destroyed', () => {
  it('extracts verdicts from side-files when there is NO journal at all', () => {
    sidecar('critics/t1-overturns-01.cite.s26a.json', {
      verdicts: [verdict('combat-core/a'), verdict('combat-core/b')],
      judged_count: 2, packet_size: 2,
    });
    run(['--critic-json', join(dir, 'critics/*.json')]);
    expect(extracted().verdicts.map((v) => v.claim_id).sort())
      .toEqual(['combat-core/a', 'combat-core/b']);
  });

  it('extracts a critic new_finding as a claim', () => {
    sidecar('critics/t1-overturns-01.hunter.s26a.json', {
      verdicts: [verdict('combat-core/a')], new_findings: [finding('combat-core/fresh')],
    });
    run(['--critic-json', join(dir, 'critics/*.json')]);
    const claim = extracted().claims.find((c) => c.id === 'combat-core/fresh');
    expect(claim?.origin).toBe('critic');
  });

  it('extracts a hunter-shaped side-file, keeping its unit', () => {
    sidecar('critics/dryloop-r1-t2.s26d.json', {
      unit: 'frames', claims: [finding('frames/new-crop')], searched: 'frames.json',
    });
    run(['--critic-json', join(dir, 'critics/*.json')]);
    expect(extracted().claims.find((c) => c.id === 'frames/new-crop')?.unit).toBe('frames');
  });

  it('reads every side-file, not just the first', () => {
    sidecar('critics/a.json', { verdicts: [verdict('u/one')] });
    sidecar('critics/b.json', { verdicts: [verdict('u/two')] });
    sidecar('critics/c.json', { verdicts: [verdict('u/three')] });
    run(['--critic-json', join(dir, 'critics/*.json')]);
    expect(extracted().verdicts).toHaveLength(3);
  });
});

describe('salvageJournal — merging the two sources without double-counting', () => {
  it('does NOT count a verdict twice when the agent both returned and wrote to disk', () => {
    journal('wf.jsonl', [{ verdicts: [verdict('combat-core/a')] }]);
    sidecar('critics/t1.cite.s26a.json', { verdicts: [verdict('combat-core/a')] });
    run([join(dir, 'wf.jsonl'), '--critic-json', join(dir, 'critics/*.json')]);
    expect(extracted().verdicts).toHaveLength(1);
  });

  it('keeps two DIFFERENT verdicts on the same claim — two lenses is not a duplicate', () => {
    journal('wf.jsonl', [{ verdicts: [verdict('combat-core/a', 'reference/cite.as:1')] }]);
    sidecar('critics/t1.hunter.s26a.json', {
      verdicts: [verdict('combat-core/a', 'reference/hunter.as:9')],
    });
    run([join(dir, 'wf.jsonl'), '--critic-json', join(dir, 'critics/*.json')]);
    expect(extracted().verdicts).toHaveLength(2);
  });

  it('does not count a claim twice when it lands from both sources', () => {
    journal('wf.jsonl', [{ verdicts: [], new_findings: [finding('combat-core/dup')] }]);
    sidecar('critics/t1.cite.s26a.json', { verdicts: [], new_findings: [finding('combat-core/dup')] });
    run([join(dir, 'wf.jsonl'), '--critic-json', join(dir, 'critics/*.json')]);
    expect(extracted().claims.filter((c) => c.id === 'combat-core/dup')).toHaveLength(1);
  });
});

describe('salvageJournal — fails closed, never silently', () => {
  it('NAMES a side-file it could not parse instead of dropping it quietly', () => {
    sidecar('critics/good.json', { verdicts: [verdict('u/one')] });
    put('critics/truncated.json', '{"verdicts": [{"claim_id": "u/two"');
    const out = run(['--critic-json', join(dir, 'critics/*.json')]);
    expect(out).toContain('truncated.json');
    expect(extracted().verdicts).toHaveLength(1);
  });

  it('refuses to run with neither a journal nor a --critic-json glob', () => {
    expect(() => run([])).toThrow();
  });

  it('says out loud when a glob matched nothing, rather than writing an empty run', () => {
    const out = run(['--critic-json', join(dir, 'critics/*.json')]);
    expect(out).toContain('matched 0 files');
  });
});
