/**
 * `buildWorklist.py` decides WHAT STILL NEEDS JUDGING, so a stale answer is expensive in
 * exactly one direction: it re-lists claims that are already judged, and a relaunch pays
 * full agent cost to re-judge them.
 *
 * It shipped with its run list HARDCODED — `run2 … run7` — while `gateL0.py` and
 * `buildLedgerEvidence.py` both glob `run*`. So the moment run8 landed, the gate counted
 * 1,587 pooled claims and 1,169 judged ids while the worklist still reported 1,506 rows
 * and 814 judged, and offered 653 findings for re-judging that two waves had already
 * ruled on. Nothing warned: a hardcoded list that is merely OUT OF DATE looks identical
 * to a hardcoded list that is complete.
 *
 * These tests pin the discovery itself. Hermetic: a throwaway L0 tree per test.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = join(process.cwd(), 'scripts/gauntlet/buildWorklist.py');

interface Manifest {
  totals: {
    claim_rows: number;
    distinct_ids: number;
    already_judged: number;
    critic_findings_unjudged: number;
  };
  packets: Array<{ unit: string; file: string; claims: number }>;
}

let dir = '';
let root = '';

function put(rel: string, body: string): void {
  const abs = join(dir, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body, 'utf8');
}

const claim = (id: string) => ({
  id, unit: 'critic-new_finding', artifact_class: 'A2', cite: 'reference/x.as:1',
  text: `what ${id} found`, verdict: 'HELD', origin: 'critic', overturns_ledger: false,
});
const verdict = (id: string) => ({
  claim_id: id, refuted: false, own_cite: 'reference/y.as:2', reason: `judged ${id}`,
});

/** Write one extracted run directory. */
function run(name: string, claims: unknown[], verdicts: unknown[]): void {
  put(`${name}/claims.json`, JSON.stringify(claims));
  put(`${name}/verdicts.json`, JSON.stringify(verdicts));
}

function build(): Manifest {
  execFileSync('python3', [SCRIPT, '--root', root], { stdio: 'pipe', timeout: 60_000 });
  return JSON.parse(readFileSync(join(root, 'worklist/MANIFEST.json'), 'utf8')) as Manifest;
}

interface PacketRow { id: string; citelint?: { status?: string } }

/** Every claim row the worklist is actually offering for judging, across all packets. */
function offered(m: Manifest): PacketRow[] {
  return m.packets.flatMap((p) => {
    const path = join(root, 'worklist', p.file);
    return existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as PacketRow[]) : [];
  });
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'sshd-worklist-'));
  root = dir;
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('buildWorklist — run discovery', () => {
  it('pools a run directory beyond the original hardcoded run2..run7 window', () => {
    run('run2', [claim('a/one')], []);
    run('run8', [claim('a/two')], []);
    const m = build();
    expect(m.totals.claim_rows).toBe(2);
    expect(m.totals.distinct_ids).toBe(2);
  });

  it('counts a claim judged by a LATER run as judged, not as work still to do', () => {
    run('run2', [claim('a/one')], []);
    run('run9', [], [verdict('a/one')]);
    const m = build();
    expect(m.totals.already_judged).toBe(1);
    expect(m.totals.critic_findings_unjudged).toBe(0);
    expect(offered(m).map((r) => r.id)).not.toContain('a/one');
  });

  it('still offers a genuinely unjudged claim for judging', () => {
    run('run2', [claim('a/one'), claim('a/two')], []);
    run('run8', [], [verdict('a/one')]);
    const m = build();
    expect(m.totals.already_judged).toBe(1);
    expect(m.totals.critic_findings_unjudged).toBe(1);
    const ids = offered(m).map((r) => r.id);
    expect(ids).toContain('a/two');
    expect(ids).not.toContain('a/one');
  });

  it('picks up a citelint report for a later run', () => {
    run('run2', [claim('a/one')], []);
    run('run8', [claim('a/two')], []);
    put('citelint-run8.json', JSON.stringify({
      claims: [{ id: 'a/two', status: 'BROKEN', problems: ['MISSING_PATH:x'], notes: [] }],
    }));
    const m = build();
    expect(offered(m).find((r) => r.id === 'a/two')?.citelint?.status).toBe('BROKEN');
  });
});
