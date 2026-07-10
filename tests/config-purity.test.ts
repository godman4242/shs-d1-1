/**
 * CONFIG-PURITY GATE — Stage 0 requirement #8, enforced forever.
 *
 *   - src/core/**  : ZERO numeric literals (incl. implicit enum ordinals).
 *   - src/core/**  : imports resolve only inside src/core/ or src/config/.
 *                    No bare specifiers (bans Phaser and every other package).
 *                    Non-static dynamic import()/require() fails closed.
 *   - src/config/**: imports resolve only inside src/config/ (types only).
 *   - Both dirs    : no unscannable payload files (.json/.js/…) may exist.
 *
 * Also self-tests the scanner against tricky fixtures so a scanner
 * regression cannot silently disarm the gate. Hardened per adversarial
 * audit 2026-07-11 (dynamic-specifier fail-open, .mts/.cts blind spot,
 * triple-slash directives, implicit enum ordinals, import-equals).
 */
import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  listTsFiles,
  listUnscannableFiles,
  readSource,
  resolveImportTarget,
  scanImports,
  scanNumericLiterals,
  type LiteralHit,
} from './utils/configPurity';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CORE_DIR = path.join(ROOT, 'src', 'core');
const CONFIG_DIR = path.join(ROOT, 'src', 'config');

function formatHits(hits: LiteralHit[]): string {
  return hits.map((h) => `  ${path.relative(ROOT, h.file)}:${h.line}:${h.col} → ${h.text}`).join('\n');
}

function checkImports(dir: string, allowedDirs: string[], label: string): void {
  for (const file of listTsFiles(dir)) {
    for (const imp of scanImports(readSource(file), file)) {
      const rel = `${path.relative(ROOT, file)}:${imp.line}`;
      expect(imp.static, `${rel} non-static dynamic specifier '${imp.specifier}' — ${label} must import statically`).toBe(true);
      const target = resolveImportTarget(file, imp.specifier);
      expect(target, `${rel} bare import '${imp.specifier}' — ${label} is framework-free`).not.toBeNull();
      const allowed = target !== null && allowedDirs.some((d) => target.startsWith(d + path.sep));
      expect(allowed, `${rel} import '${imp.specifier}' escapes ${label}'s allowed dirs`).toBe(true);
    }
  }
}

describe('config-purity: src/core/', () => {
  it('contains ZERO numeric literals (all gameplay numbers live in src/config/)', () => {
    const files = listTsFiles(CORE_DIR);
    expect(files.length).toBeGreaterThan(0);
    const hits = files.flatMap((f) => scanNumericLiterals(readSource(f), f));
    expect(hits, `Numeric literals found in src/core/ — move them to src/config/:\n${formatHits(hits)}`).toEqual([]);
  });

  it('imports only from src/core/ or src/config/ (no Phaser, no packages, no game/)', () => {
    checkImports(CORE_DIR, [CORE_DIR, CONFIG_DIR], 'core/');
  });

  it('contains no unscannable payload files (.json/.js/… could smuggle numbers)', () => {
    expect(listUnscannableFiles(CORE_DIR)).toEqual([]);
  });
});

describe('config-purity: src/config/', () => {
  it('imports only from within src/config/ (pure data, no Phaser, no logic deps)', () => {
    checkImports(CONFIG_DIR, [CONFIG_DIR], 'config/');
  });

  it('contains no unscannable payload files', () => {
    expect(listUnscannableFiles(CONFIG_DIR)).toEqual([]);
  });
});

describe('config-purity: scanner self-test (a scanner regression must fail loudly)', () => {
  const caught: Array<[name: string, source: string]> = [
    ['decimal', 'const x = 42;'],
    ['float', 'const x = 0.5;'],
    ['hex', 'const x = 0xff;'],
    ['binary', 'const x = 0b101;'],
    ['octal', 'const x = 0o17;'],
    ['exponent', 'const x = 1e9;'],
    ['numeric separator', 'const x = 1_000;'],
    ['bigint', 'const x = 10n;'],
    ['negative (unary minus + literal)', 'const x = -7;'],
    ['enum explicit numeric initializer', 'enum E { A = 1 }'],
    ['enum IMPLICIT ordinal', 'enum E { A, B }'],
    ['enum computed initializer', 'enum E { A = "x".length }'],
    ['literal in type position', 'type X = 5;'],
    ['template expression', 'const s = `v${9}`;'],
    ['default parameter', 'function f(a = 3) { return a; }'],
    ['array index', 'declare const a: number[]; const x = a[2];'],
  ];
  it.each(caught)('catches: %s', (_name, source) => {
    expect(scanNumericLiterals(source, 'fixture.ts').length).toBeGreaterThan(0);
  });

  const clean: Array<[name: string, source: string]> = [
    ['digits inside a string', "const s = '42';"],
    ['digits inside a comment', '// tuned to 42 once upon a time\nconst s = "x";'],
    ['identifier containing digits', 'export function mulberry32(seed: string): string { return seed; }'],
    ['string-initialized enum', 'enum Stance { Light = "light", Heavy = "heavy" }'],
  ];
  it.each(clean)('does not false-positive: %s', (_name, source) => {
    expect(scanNumericLiterals(source, 'fixture.ts')).toEqual([]);
  });

  it('sees through every static import form (incl. import-equals and triple-slash)', () => {
    const source = [
      '/// <reference path="../game/legacy.ts" />',
      '/// <reference types="phaser" />',
      "import Phaser from 'phaser';",
      "import type { T } from '../game/DuelScene';",
      "export { x } from './sibling';",
      "const p = import('phaser');",
      'const q = require(`phaser`);', // no-substitution template IS static
      "import PhaserEq = require('phaser');",
    ].join('\n');
    const hits = scanImports(source, 'fixture.ts');
    expect(hits.map((h) => h.specifier)).toEqual([
      '../game/legacy.ts',
      'phaser',
      'phaser',
      '../game/DuelScene',
      './sibling',
      'phaser',
      'phaser',
      'phaser',
    ]);
    expect(hits.every((h) => h.static)).toBe(true);
  });

  const nonStatic: Array<[name: string, source: string]> = [
    ['template substitution import()', 'const n = "x"; const p = import(`./levels/${n}`);'],
    ['concatenated require()', "const q = require('pha' + 'ser');"],
    ['variable import()', "const m = 'phaser'; const p = import(m);"],
    ['argument-less require()', 'const r = require();'],
  ];
  it.each(nonStatic)('fails closed on: %s', (_name, source) => {
    const hits = scanImports(source, 'fixture.ts');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.some((h) => !h.static)).toBe(true);
  });

  it('listTsFiles covers .ts/.tsx/.mts/.cts and listUnscannableFiles flags payloads', () => {
    const probe = path.join(ROOT, 'tests', 'fixtures', 'scan-probe');
    expect(listTsFiles(probe).map((f) => path.basename(f))).toEqual(['a.ts', 'b.mts', 'c.cts', 'd.tsx']);
    expect(listUnscannableFiles(probe).map((f) => path.basename(f))).toEqual(['payload.json']);
  });

  it('the .mts fixture literal is caught (blocker regression test)', () => {
    const probe = path.join(ROOT, 'tests', 'fixtures', 'scan-probe', 'b.mts');
    expect(scanNumericLiterals(readSource(probe), probe).length).toBeGreaterThan(0);
  });
});
