/**
 * `buildLedgerPackets.py` — the scoping step for the `REBUILD_READINESS.md` rewrite.
 *
 * The rewrite is the point of lane L0 and it is the one step where an agent inventing
 * a claim id would be most expensive. §2's standing rule is A SCRIPT BEATS A SWARM, so
 * the partition is mechanical: each writer receives ONLY the findings admissible for
 * its own slice of the ledger, and may cite nothing else.
 *
 * TWO PROPERTIES ARE LOAD-BEARING, and both are tested here rather than trusted.
 *
 *  1. CONSERVATION. Every usable finding lands in exactly one packet. A swarm of
 *     writers each reading the whole 2,999-line evidence doc will collectively drop
 *     findings and no one will notice; a partition that provably covers the set
 *     cannot. The script exits non-zero if conservation is violated.
 *
 *  2. §0's BAR. A KILLED claim — refuted, or never judged at all — may not enter any
 *     packet. An unjudged claim is a LEAD, and a lead in a writer's hand is a lead in
 *     the ledger.
 *
 * And the lesson this lane paid for: a NOT-UPHELD finding is TRUE but does not delete
 * the line it aims at. 36% of claimed overturns were rejected on exactly that, so the
 * packet must carry the distinction in words the writer cannot skim past.
 *
 * Hermetic: a throwaway L0 tree + ledger per test, so this runs in a clean clone.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = join(process.cwd(), 'scripts/gauntlet/buildLedgerPackets.py');

interface Routing {
  destinations: Record<string, number>;
  rules: Record<string, number>;
  routed: Array<{ id: string; dest: string; rule: string }>;
  usable: number;
  conserved: boolean;
}

let dir = '';

function put(rel: string, body: string): void {
  const abs = join(dir, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body, 'utf8');
}

/** A ledger with a §2 scorecard, two §4 system blocks and a §6 list. */
const LEDGER = [
  '# REBUILD READINESS',
  '',
  '## 2. Readiness scorecard (per system)',
  '',
  '| System | Score | Rebuild-ready now | The thing blocking a 1:1 |',
  '|---|---:|---|---|',
  '| **combat-core** | 42 | gesture map | **reach cap in px**; crit final read |',
  '| **ui-hud** | 57 | combat-HUD geometry | aspect-ratio truth |',
  '',
  '## 4. Per-system gap ledgers',
  '',
  '### combat-core — 42',
  '',
  '- ① the stance tables are MASTERY-9 CEILING values, not base.',
  '',
  '### ui-hud — 57',
  '',
  '- ③ Focus numerics (max/fill/switch-cost).',
  '',
  '## 6. What is structurally UNRECOVERABLE',
  '',
  '- **Verbatim dialogue** — the actual script is gone; author original lines.',
  '',
  '## 7. The verdict',
  '',
  'Not for a pixel-perfect 1:1.',
  '',
].join('\n');

function build(claims: unknown[], summary: Record<string, unknown> = {}): Routing {
  put('L0/LEDGER_EVIDENCE.json', JSON.stringify({ claims, summary }));
  put('ledger.md', LEDGER);
  execFileSync('python3', [SCRIPT, '--root', join(dir, 'L0'), '--ledger', join(dir, 'ledger.md'),
    '--out', join(dir, 'packets')], { stdio: 'pipe', timeout: 60_000 });
  return JSON.parse(readFileSync(join(dir, 'packets/ROUTING.json'), 'utf8')) as Routing;
}

function packet(name: string): string {
  const p = join(dir, `packets/${name}.md`);
  return existsSync(p) ? readFileSync(p, 'utf8') : '';
}

const claim = (id: string, over: Record<string, unknown> = {}) => ({
  id, unit: 'critic-new_finding', status: 'UPHELD', artifact_class: 'A2',
  cite: 'reference/x.as:1', text: `what ${id} found`, claims_overturn: true,
  ledger_text: '', lane_impact: '', live_critics: 2, build: 'web v0.717', why: 'survived',
  ...over,
});

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'sshd-packets-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('buildLedgerPackets — routing, strongest rule first', () => {
  it('routes by the ledger sentence to the §4 system block that contains it', () => {
    const r = build([claim('x/a', {
      ledger_text: '① the stance tables are MASTERY-9 CEILING values, not base.',
    })]);
    expect(r.routed[0]?.dest).toBe('combat-core');
    expect(r.routed[0]?.rule).toBe('ledger_text');
  });

  it('routes a §2 scorecard-row sentence to that row’s system', () => {
    const r = build([claim('x/b', { ledger_text: 'aspect-ratio truth' })]);
    expect(r.routed[0]?.dest).toBe('ui-hud');
  });

  it('routes a §6 entry to the §6 packet — gate L0-E’s writer owns those', () => {
    const r = build([claim('x/c', {
      ledger_text: '**Verbatim dialogue** — the actual script is gone; author original lines.',
    })]);
    expect(r.routed[0]?.dest).toBe('six');
  });

  it('falls back to the id prefix when the sentence is not in the ledger', () => {
    const r = build([claim('ui-hud/no-sentence', { ledger_text: 'a line from some other doc' })]);
    expect(r.routed[0]).toMatchObject({ dest: 'ui-hud', rule: 'id_prefix' });
  });

  it('falls back to lane_impact when neither the sentence nor the prefix names a system', () => {
    const r = build([claim('bindata/z', { lane_impact: 'L3: items-equipment gets its icons' })]);
    expect(r.routed[0]).toMatchObject({ dest: 'items-equipment', rule: 'lane_impact' });
  });

  it('lands a genuinely cross-cutting finding in the frame packet — never drops it', () => {
    const r = build([claim('actionscript/method-note', {
      lane_impact: 'All lanes — a governing rule for every payload-derived number.',
    })]);
    expect(r.routed[0]).toMatchObject({ dest: 'frame', rule: 'frame_fallback' });
    expect(packet('frame')).toContain('[[actionscript/method-note]]');
  });
});

describe('buildLedgerPackets — §0’s bar, mechanically', () => {
  it('never lets a KILLED claim into any packet', () => {
    const r = build([
      claim('x/dead', { status: 'KILLED', ledger_text: 'aspect-ratio truth' }),
      claim('x/live', { ledger_text: 'aspect-ratio truth' }),
    ]);
    expect(r.usable).toBe(1);
    expect(packet('ui-hud')).toContain('[[x/live]]');
    expect(packet('ui-hud')).not.toContain('x/dead');
  });

  it('carries a NOT-UPHELD finding but says the line it aimed at SURVIVES', () => {
    build([claim('x/true-wrong-target', {
      status: 'NOT-UPHELD', ledger_text: 'aspect-ratio truth',
    })]);
    const body = packet('ui-hud');
    expect(body).toContain('[[x/true-wrong-target]]');
    expect(body).toMatch(/SURVIVES/);
  });

  it('writes each id in [[…]] form so a writer copies a citable reference', () => {
    build([claim('combat-core/reach', { ledger_text: 'crit final read' })]);
    expect(packet('combat-core')).toContain('[[combat-core/reach]]');
  });
});

describe('buildLedgerPackets — conservation', () => {
  it('lands every usable claim in exactly one packet', () => {
    const r = build([
      claim('x/a', { ledger_text: 'crit final read' }),
      claim('ui-hud/b'),
      claim('bindata/c', { lane_impact: 'economy: prices' }),
      claim('actionscript/d', { lane_impact: 'all lanes' }),
      claim('x/e', { status: 'NOT-UPHELD', ledger_text: 'aspect-ratio truth' }),
    ]);
    expect(r.usable).toBe(5);
    expect(r.routed).toHaveLength(5);
    expect(Object.values(r.destinations).reduce((a, b) => a + b, 0)).toBe(5);
    expect(new Set(r.routed.map((x) => x.id)).size).toBe(5);
    expect(r.conserved).toBe(true);
  });

  it('records which rule placed each claim, so the routing is auditable', () => {
    const r = build([
      claim('x/a', { ledger_text: 'crit final read' }),
      claim('ui-hud/b'),
    ]);
    expect(r.rules).toMatchObject({ ledger_text: 1, id_prefix: 1 });
  });
});
