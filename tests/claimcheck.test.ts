/**
 * CLAIMCHECK'S OWN GATE — and the pre-commit wiring for the cite gate.
 *
 * Two halves, for two different reasons:
 *
 * 1. HERMETIC UNIT TESTS, which always run. Every rule in `claimcheckLib.ts` replaced a
 *    simpler rule that a measurement falsified, and each of those falsifications is
 *    pinned here as a test. Without them the next person "simplifies" the resolver back
 *    to last-named-cite inheritance and the gate silently starts checking the wrong file.
 *
 * 2. THE REAL CORPUS, which runs `npm run claimcheck` over this repo and requires exit 0.
 *    This is how the gate reaches pre-commit: the hook runs `npx vitest run`, so a commit
 *    that breaks a cite goes red without the hook needing a fourth step. It takes ~0.5 s.
 *
 * ⚠️ THE REAL-CORPUS HALF SKIPS WITHOUT `reference/`. The decompiled sources are
 * study-only, local-only and gitignored (`RECREATE, NEVER RIP`), so a clean clone has
 * none and the alternative would be a suite that cannot pass there — the same
 * hermetic-vs-real split `tests/citeLint.test.ts` already makes. The skip is loud and the
 * reason is asserted, so it can never quietly come to mean something else.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { Cite } from '../scripts/gates/claimcheckLib.ts';
import {
  DEFAULT_WINDOW,
  checkValues,
  citesOnLine,
  headerDefault,
  literalNear,
  moduleCites,
  numericFields,
  prepare,
  scopeFor,
  splitLines,
} from '../scripts/gates/claimcheckLib.ts';

const ROOT = join(import.meta.dirname, '..');
const AS_DIR = 'reference/decompiled/shs3_android_payload/scripts';
const hasReference = existsSync(join(ROOT, AS_DIR));

/** Cite spans as `file:start-end`, so a test reads like the comment it parsed. */
const spans = (cites: Cite[]): string[] => cites.map((c) => `${c.file}:${c.start}-${c.end}`);

describe('claimcheckLib.splitLines — cites come from comments, values from code', () => {
  it('splits a trailing line comment', () => {
    const [l] = splitLines("  IDLE: 'idle', // MCSActor.as:8");
    expect(l?.code.trim()).toBe("IDLE: 'idle',");
    expect(l?.comment.trim()).toBe('MCSActor.as:8');
  });

  it('does not open a comment inside a string literal', () => {
    // `ogItems.ts` holds URL-ish and path-ish strings; a naive `//` scan eats the rest of
    // the line and loses every real cite after it.
    const [l] = splitLines("  url: 'http://x/y', // NPC.as:5");
    expect(l?.code).toContain("'http://x/y'");
    expect(l?.comment.trim()).toBe('NPC.as:5');
  });

  it('marks a bare `*/` line as a comment line even though it carries no text', () => {
    // THE BUG THIS CAUGHT: using `comment !== ''` for contiguity stopped the upward walk
    // dead at the closing delimiter, so a value never saw the docblock above its
    // enclosing `export const` — three colour bands in ogNpcBase.ts failed against cites
    // that do cover them.
    const lines = splitLines('/**\n * `NPC.as:871-891`\n */\nexport const X = {\n  a: 1,\n};');
    expect(lines[2]?.comment.trim()).toBe('');
    expect(lines[2]?.isComment).toBe(true);
    expect(lines[3]?.isComment).toBe(false);
  });

  it('keeps a block comment open across lines', () => {
    const lines = splitLines('/* NPC.as:1\n   NPC.as:2 */ const a = 1;');
    expect(lines[0]?.comment).toContain('NPC.as:1');
    expect(lines[1]?.comment).toContain('NPC.as:2');
    expect(lines[1]?.code.trim()).toBe('const a = 1;');
  });
});

describe('claimcheckLib.citesOnLine — every spelling the corpus actually uses', () => {
  it('reads a named cite and a range', () => {
    expect(spans(citesOnLine('`NPC.as:204` and `EnemyCivilian.as:329-348`', 1, null))).toEqual([
      'NPC.as:204-204',
      'EnemyCivilian.as:329-348',
    ]);
  });

  it('keeps BOTH lines of a slash list with the colon not repeated', () => {
    // `EnemyKnife.as:64/68` — a naive /(\S+\.as):(\d+)/ captures 64 and SILENTLY DROPS
    // 68, so that cite is never checked at all.
    expect(spans(citesOnLine('`EnemyKnife.as:64/68`', 1, null))).toEqual(['EnemyKnife.as:64-64', 'EnemyKnife.as:68-68']);
  });

  it('keeps both lines of a slash list with the colon repeated', () => {
    expect(spans(citesOnLine('`EnemyFox.as:177/:181`', 1, null))).toEqual([
      'EnemyFox.as:177-177',
      'EnemyFox.as:181-181',
    ]);
  });

  it('honours a cite that carries its own reference/ path', () => {
    const [c] = citesOnLine('(`reference/decompiled/shs3_payload/scripts/x.as:110-111`)', 1, 'NPC.as');
    expect(c?.file).toBe('reference/decompiled/shs3_payload/scripts/x.as');
    expect(c?.via).toBe('path');
  });

  /**
   * THE RULE THAT TWO MEASUREMENTS FALSIFIED, IN BOTH DIRECTIONS.
   * "Inherit the last named cite anywhere above" mis-resolves ~30 values in
   * `ogEnemyWolfAlpha.ts`, which names `EnemySpearElite.as` mid-file as a CONTRAST.
   * "The header always wins" mis-resolves the bare cites that genuinely follow a
   * mid-clause named cite. Same line first, header second — and nothing else.
   */
  it('resolves a bare cite from the named cite EARLIER ON ITS OWN LINE', () => {
    expect(spans(citesOnLine('`EnemyWolf2.as:24` ↔ `:227`', 1, 'EnemyWolf.as'))).toEqual([
      'EnemyWolf2.as:24-24',
      'EnemyWolf2.as:227-227',
    ]);
  });

  it('falls back to the header default when its own line names nothing', () => {
    const [c] = citesOnLine('`:305` — a chasing stag rears', 1, 'EnemyStag.as');
    expect(c?.file).toBe('EnemyStag.as');
    expect(c?.via).toBe('header');
  });

  it('drops a bare cite that has no line-local name and no header', () => {
    expect(citesOnLine('`:305`', 1, null)).toEqual([]);
  });

  it('accepts the § in a decompiled web-build filename', () => {
    const [c] = citesOnLine('`§1t113s0§.as:110`', 1, null);
    expect(c?.file).toBe('§1t113s0§.as');
  });
});

describe('claimcheckLib.headerDefault', () => {
  it('takes the first .as name in the header', () => {
    expect(headerDefault(' * OG_ALPHA — `EnemyWolfAlpha.as` (584 lines)\n * `EnemySpearElite.as:79`')).toBe(
      'EnemyWolfAlpha.as',
    );
  });

  /**
   * `ogAi.ts`'s header cite is PATH-PREFIXED. A backtick-anchored regex that cannot see
   * past the directory grabs the second name on the line instead — silently re-pointing
   * the file that carries the most numeric data rows in src/config.
   */
  it('sees past a path prefix inside the backticks', () => {
    expect(headerDefault(' * `reference/decompiled/shs3_android_payload/scripts/NPCManager.as` and `XMLNpc.as`')).toBe(
      'NPCManager.as',
    );
  });

  it('returns null when the header cites nothing', () => {
    expect(headerDefault(' * just prose, no cite at all')).toBeNull();
  });
});

describe('claimcheckLib.numericFields — read from the CODE side only', () => {
  it('finds a field and its value', () => {
    expect(numericFields(prepare('export const X = {\n  scale: 1.2,\n};'))).toEqual([
      { key: 'scale', value: 1.2, line: 2 },
    ]);
  });

  /**
   * A field regex run over RAW text matches prose inside the comments and invents fields
   * that do not exist — and one of those phantoms inflated the bug list in the
   * measurement that sized this gate.
   */
  it('invents nothing from prose inside a comment', () => {
    expect(numericFields(prepare('/** the source writes speed: 9 here */\nexport const X = { a: 1 };'))).toEqual([
      { key: 'a', value: 1, line: 2 },
    ]);
  });

  it('skips `line:` and `ai:` — those values ARE line numbers and dispatch ordinals', () => {
    expect(numericFields(prepare('  { ai: 0, line: 519, x: 650 },'))).toEqual([{ key: 'x', value: 650, line: 1 }]);
  });

  it('skips a string value', () => {
    expect(numericFields(prepare("  { actor: 'EnemyPlayer', n: 3 },"))).toEqual([{ key: 'n', value: 3, line: 1 }]);
  });
});

describe('claimcheckLib.scopeFor — a value is governed by every docblock above it', () => {
  const src = [
    '/**',
    ' * `NPC.as:871-891` — getColorXP()',
    ' */',
    'export const X = {',
    '  /** `:874` */ redAbove: 5,',
    '  /** `NPC.as:83` */',
    '  idle: {',
    '    dice: 3,',
    '  },',
    '};',
  ].join('\n');

  it('unions the value line, the block above it, and the export docblock', () => {
    // `redAbove` must see BOTH its own `:874` and the export's `NPC.as:871-891`.
    expect(spans(scopeFor(prepare(src), 5))).toEqual(['NPC.as:871-891', 'NPC.as:874-874']);
  });

  /**
   * THE WALK MUST NOT STOP AT THE `export const`. `dice: 3` is cited by the docblock above
   * its OWN `idle: {`, one level in — a claim that it is "uncited" was itself a false
   * finding in the inventory that preceded this gate.
   */
  it('reaches the docblock above a NESTED object, not just the export', () => {
    expect(spans(scopeFor(prepare(src), 8))).toEqual(['NPC.as:871-891', 'NPC.as:83-83']);
  });
});

describe('claimcheckLib.literalNear', () => {
  const lines = ['a', 'velY += 3;', 'b', 'x = 120;', 'c'];
  const cite = (start: number, end = start): Cite => ({
    file: 'F.as',
    start,
    end,
    line: 1,
    raw: `F.as:${start}`,
    via: 'named',
  });

  it('finds a literal inside an expression', () => {
    expect(literalNear(lines, cite(2), 3, 0)).toBe(true);
  });

  it('respects digit boundaries — 12 does not match inside 120', () => {
    expect(literalNear(lines, cite(4), 12, 0)).toBe(false);
    expect(literalNear(lines, cite(4), 120, 0)).toBe(true);
  });

  /**
   * The source writes `mcs.y - 60` where the config writes `yOffset: -60`: the minus
   * lives in the operator. The trade-off is stated rather than hidden — the check is
   * sign-blind, so a config that wrote +60 for a source −60 would pass.
   */
  it('strips the sign before searching', () => {
    expect(literalNear(['var y = mcs.y - 60;'], cite(1), -60, 0)).toBe(true);
  });

  it('honours the window in both directions and nothing beyond it', () => {
    expect(literalNear(lines, cite(3), 3, 1)).toBe(true);
    expect(literalNear(lines, cite(1), 120, 1)).toBe(false);
  });

  /**
   * The fourth false-pass hole (L5-OPP slice 3a, 2026-09-29). Every obfuscated web name
   * carries a free-standing 1 and 0 (`§1t4414s0§`: the `1` after `§`, the `0` after `s`), so
   * ANY web cite vouched for a value of 0 or 1. It passed `floor: 0` cited to
   * `this.§1t4414s0§ -= 48;`, a line with no zero on it. Measured when closed: 0 new
   * failures over the whole corpus.
   */
  it('reads no digit inside a §-quoted web name', () => {
    const web = ['this.§1t4414s0§ -= 48;', 'if(this.§1t4414s0§ < 0)'];
    expect(literalNear(web, cite(1), 0, 0)).toBe(false);
    expect(literalNear(web, cite(1), 1, 0)).toBe(false);
    expect(literalNear(web, cite(1), 4414, 0)).toBe(false);
    expect(literalNear(web, cite(1), 48, 0)).toBe(true);
    expect(literalNear(web, cite(2), 0, 0)).toBe(true);
  });
});

/**
 * THE THREE FALSE-PASS HOLES (harness finish, F1). The gate reported "0 failures" over four
 * cites VERIFIED wrong by hand — `EnemyKatana.as:213` is `break;` (the gravity is `:205`),
 * and `EnemyDeer.as:224` / `EnemyHorse.as:242` / `EnemyStag.as:302` each sit one line past
 * their `+ 100`. Each mechanism that let them through is pinned here, in miniature, so a
 * later "simplification" that re-opens one goes red without needing `reference/`.
 */
describe('claimcheckLib — the three false-pass holes', () => {
  /** A fake source tree: file → lines. A cite naming a file not here does not exist. */
  const tree = (files: Record<string, string[]>) => (c: Cite) => files[c.file] ?? null;
  const kinds = (r: ReturnType<typeof checkValues>): string[] => r.failures.map((f) => `${f.kind} ${f.detail}`);

  it('HOLE 1 — a bare `export const NAME = 3` is a numeric field', () => {
    // `OG_HUMANOID_FALL_GRAVITY = 3` sat under the wrong cite and was never literal-checked
    // AT ALL: `numericFields` read only `key: value`.
    expect(numericFields(prepare('/** `A.as:1` */\nexport const OG_X_GRAVITY = 3;\nconst Y = -100;'))).toEqual([
      { key: 'OG_X_GRAVITY', value: 3, line: 2 },
      { key: 'Y', value: -100, line: 3 },
    ]);
  });

  it('HOLE 2 — a good cite does not cover a bad sibling: every cite must hold a value it governs', () => {
    // `fallGravity: 3` was governed by six cites and passed if ANY held a 3, so the sixth —
    // `EnemyKatana.as:213`, a `break;` — was never judged on its own.
    const mod = prepare(['export const X = {', '  /** `Good.as:1` · `Bad.as:2` — gravity. */', '  fallGravity: 3,', '};'].join('\n'));
    const r = checkValues(mod, 'x.ts', tree({ 'Good.as': ['velY += 3;'], 'Bad.as': ['a', 'break;'] }), 0, [], []);
    expect(kinds(r).filter((k) => k.includes('Bad.as:2'))).toHaveLength(1);
    expect(kinds(r).some((k) => k.includes('Good.as:1'))).toBe(false);
  });

  it('HOLE 3 — the default window is ±0: a cite one line off its literal is wrong', () => {
    // The three `+ 100` cites were each exactly one line off — the old ±1 window's width —
    // and the gate reported 0 failures over them. Measured over the whole corpus, ±0 raised
    // four new failures: three real drifts and one context cite (allow-listed with a reason).
    const mod = prepare(['export const X = {', '  /** `Deer.as:3` — flee 100 px past the edge. */', '  dest: 100,', '};'].join('\n'));
    const r = checkValues(mod, 'x.ts', tree({ 'Deer.as': ['if (a)', '  this.destX = w + 100;', '}'] }), DEFAULT_WINDOW, [], []);
    expect(r.failures.map((f) => f.kind)).toContain('LITERAL-ABSENT');
    expect(DEFAULT_WINDOW).toBe(0);
  });

  it('a CONTEXT cite is not judged per-cite, and it cannot vouch for a value either', () => {
    // A contrast — "NOT the base's `* 2 + 20` (`NPC.as:218`)" — is a correct cite that states
    // a different number. It is allow-listed by name, and being allow-listed REMOVES it from
    // the union: a cite declared as context must never be the one that makes a value pass.
    const mod = prepare(['export const X = {', '  /** `Own.as:1` — flat, NOT the base (`Base.as:1`). */', '  walkSpeed: 3,', '};'].join('\n'));
    const context = [{ file: 'x.ts', cite: 'Base.as:1', why: 'a contrast' }];
    const holdsBoth = tree({ 'Own.as': ['walkSpeed = 3;'], 'Base.as': ['walkSpeed = 4;'] });
    expect(checkValues(mod, 'x.ts', holdsBoth, 0, [], context).failures).toEqual([]);
    const onlyContextHolds = tree({ 'Own.as': ['walkSpeed = 9;'], 'Base.as': ['walkSpeed = 3;'] });
    expect(kinds(checkValues(mod, 'x.ts', onlyContextHolds, 0, [], context))).toEqual([
      expect.stringContaining('LITERAL-ABSENT'),
      expect.stringContaining('Own.as:1'),
    ]);
  });
});

describe('claimcheck over the real corpus', () => {
  it('names why it is skipped, so a skip can never come to mean something else', () => {
    expect(hasReference || !existsSync(join(ROOT, AS_DIR))).toBe(true);
    if (!hasReference) {
      process.stdout.write(
        `\n[claimcheck] SKIPPED: ${AS_DIR} is absent (study-only, gitignored). This is not a pass.\n`,
      );
    }
  });

  it.skipIf(!hasReference)('resolves every cite in src/config and src/core/npc', () => {
    // Runs the real gate. Exit 0 or this throws with the report attached.
    const out = execFileSync('node', ['scripts/gates/claimcheck.ts'], {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, NO_COLOR: '1' },
    });
    expect(out).toContain('every cite resolves and every cited value is where it says it is');
  });

  it.skipIf(!hasReference)('checks a corpus of the size this gate was built for', () => {
    // A guard against the gate quietly shrinking — a resolver bug that drops most cites
    // would otherwise read as a clean pass. The floor is well under the measured 1,703 /
    // 401 so that ordinary authoring does not trip it.
    const out = execFileSync('node', ['scripts/gates/claimcheck.ts'], { cwd: ROOT, encoding: 'utf8' });
    const cites = Number(/cites resolved\s+(\d+)/.exec(out)?.[1] ?? 0);
    const values = Number(/cited values checked (\d+)/.exec(out)?.[1] ?? 0);
    expect(cites).toBeGreaterThan(1600);
    expect(values).toBeGreaterThan(350);
  });

  it.skipIf(!hasReference)('every cite in the two swept trees resolves to a file that exists', () => {
    // The same assertion from the inside, so a failure names the cite rather than an exit
    // code — and so `moduleCites` itself is exercised against the real corpus.
    const files = execFileSync('git', ['ls-files', 'src/config', 'src/core/npc'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n')
      .filter((f) => f.endsWith('.ts'));
    const missing: string[] = [];
    for (const rel of files) {
      const mod = prepare(execFileSync('cat', [join(ROOT, rel)], { encoding: 'utf8' }));
      for (const c of moduleCites(mod)) {
        const target = c.file.includes('/') ? c.file : join(AS_DIR, c.file);
        if (!existsSync(join(ROOT, target))) missing.push(`${rel}:${c.line} → ${c.raw}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
