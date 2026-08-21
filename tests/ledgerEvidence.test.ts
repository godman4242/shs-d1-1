/**
 * `buildLedgerEvidence.py` decides which claims may rewrite `REBUILD_READINESS.md`,
 * so its classification is the choke point where a refuted claim could slip back in.
 *
 * The three-way status is the point. "True" and "overturns the thing it says it
 * overturns" are DIFFERENT QUESTIONS — WF-3a rejected 46% of claimed overturns while
 * upholding the findings themselves — and collapsing them is how a readiness ledger
 * gets rewritten by findings that never actually contradicted it.
 *
 * Hermetic: a throwaway L0 tree per test, so this runs in a clean clone.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = join(process.cwd(), 'scripts/gauntlet/buildLedgerEvidence.py');

interface Row { id: string; status: string; why: string; claims_overturn: boolean }

let dir = '';

function put(rel: string, body: string): void {
  const abs = join(dir, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body, 'utf8');
}

/** Build a one-run L0 tree from the given claims + verdicts, then classify. */
function classify(claims: unknown[], verdicts: unknown[]): Record<string, Row> {
  put('run2/claims.json', JSON.stringify(claims));
  put('run2/verdicts.json', JSON.stringify(verdicts));
  execFileSync('python3', [SCRIPT, '--root', dir], { stdio: 'pipe', timeout: 60_000 });
  const report = JSON.parse(readFileSync(join(dir, 'LEDGER_EVIDENCE.json'), 'utf8')) as {
    claims: Row[];
  };
  return Object.fromEntries(report.claims.map((r) => [r.id, r]));
}

const claim = (id: string, overturns = true) => ({
  id, unit: 'combat-core', artifact_class: 'A2', cite: 'reference/x.as:1',
  text: 't', overturns_ledger: overturns, ledger_text: 'the ledger sentence under attack',
});
const verdict = (id: string, extra: Record<string, unknown> = {}) => ({
  claim_id: id, refuted: false, own_cite: 'reference/y.as:2', reason: 'r', ...extra,
});

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'sshd-evidence-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('buildLedgerEvidence — what may rewrite the ledger', () => {
  it('UPHOLDS a claim that survived its critics', () => {
    const out = classify([claim('a/survivor')], [verdict('a/survivor'), verdict('a/survivor')]);
    expect(out['a/survivor']?.status).toBe('UPHELD');
  });

  /** §0: an unjudged claim is a LEAD, not a finding. This is the fail-open that cost run 1. */
  it('KILLS a claim no critic ever judged', () => {
    const out = classify([claim('a/orphan')], []);
    expect(out['a/orphan']?.status).toBe('KILLED');
    expect(out['a/orphan']?.why).toContain('UNJUDGED');
  });

  /** §0: a verdict with no artifact of its own is VOID, so it is not judgement at all. */
  it('KILLS a claim whose only verdict is VOID (no own_cite)', () => {
    const out = classify([claim('a/void-judged')], [verdict('a/void-judged', { own_cite: '  ' })]);
    expect(out['a/void-judged']?.status).toBe('KILLED');
    expect(out['a/void-judged']?.why).toContain('UNJUDGED');
  });

  it('KILLS a claim a majority of its critics refuted', () => {
    const out = classify([claim('a/killed')], [
      verdict('a/killed', { refuted: true }),
      verdict('a/killed', { refuted: true }),
      verdict('a/killed'),
    ]);
    expect(out['a/killed']?.status).toBe('KILLED');
    expect(out['a/killed']?.why).toContain('REFUTED by 2 of 3');
  });

  it('SURVIVES a minority refute', () => {
    const out = classify([claim('a/minority')], [
      verdict('a/minority', { refuted: true }), verdict('a/minority'), verdict('a/minority'),
    ]);
    expect(out['a/minority']?.status).toBe('UPHELD');
  });

  /** With fewer than three critics, a single refute IS the majority. */
  it('KILLS on one refute when only one critic ruled', () => {
    const out = classify([claim('a/lonely')], [verdict('a/lonely', { refuted: true })]);
    expect(out['a/lonely']?.status).toBe('KILLED');
  });

  /**
   * The 46% case. The finding is TRUE and survives as a claim; the ledger sentence it
   * aimed at does not fall. It must never be filed with the overturns that do.
   */
  it('marks a surviving claim NOT-UPHELD when its overturn was rejected', () => {
    const out = classify([claim('a/wrong-target')], [
      verdict('a/wrong-target', { overturn_upheld: false }),
      verdict('a/wrong-target', { overturn_upheld: false }),
    ]);
    expect(out['a/wrong-target']?.status).toBe('NOT-UPHELD');
    expect(out['a/wrong-target']?.why).toContain('does NOT fall');
  });

  it('UPHOLDS the overturn when at least one critic ruled it does fall', () => {
    const out = classify([claim('a/right-target')], [
      verdict('a/right-target', { overturn_upheld: true }),
      verdict('a/right-target', { overturn_upheld: false }),
    ]);
    expect(out['a/right-target']?.status).toBe('UPHELD');
  });

  it('keeps a rejected overturn OUT of the surviving-overturn group in the report', () => {
    classify(
      [claim('a/good'), claim('a/bad')],
      [verdict('a/good', { overturn_upheld: true }), verdict('a/bad', { overturn_upheld: false })],
    );
    const md = readFileSync(join(dir, 'LEDGER_EVIDENCE.md'), 'utf8');
    const [overturnSection, rejectedSection] = md.split('## Rejected overturns');
    expect(overturnSection).toContain('[[a/good]]');
    expect(overturnSection).not.toContain('[[a/bad]]');
    expect(rejectedSection).toContain('a/bad');
  });

  it('pools every run directory rather than reading only the newest', () => {
    put('run3/claims.json', JSON.stringify([claim('b/from-run3')]));
    put('run3/verdicts.json', JSON.stringify([verdict('b/from-run3')]));
    const out = classify([claim('a/from-run2')], [verdict('a/from-run2')]);
    expect(out['a/from-run2']?.status).toBe('UPHELD');
    expect(out['b/from-run3']?.status).toBe('UPHELD');
  });

  /** A later run's verdict must reach an earlier run's claim, or the judged set shrinks. */
  it('lets a later run judge an earlier run\'s claim', () => {
    put('run3/claims.json', JSON.stringify([]));
    put('run3/verdicts.json', JSON.stringify([verdict('a/late-judged', { refuted: true })]));
    const out = classify([claim('a/late-judged')], []);
    expect(out['a/late-judged']?.status).toBe('KILLED');
    expect(out['a/late-judged']?.why).toContain('REFUTED');
  });
});
