/**
 * GUARD — no test may import src/game/** or phaser, directly OR transitively
 * (Phaser needs a browser; under Node it crashes the whole worker). Queued in
 * STAGE1_KICKOFF §3 to land with the first scene; chaos-proven by planting
 * direct + transitive canary imports (red) and removing them (green).
 *
 * Scope note: bare imports other than 'phaser' (vitest, node:*) are fine in
 * TEST files — this guard protects the runtime boundary, not core purity
 * (config-purity.test.ts owns that).
 */
import { describe, expect, it } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listTsFiles, readSource, resolveImportTarget, scanImports } from './utils/configPurity';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TESTS_DIR = path.join(ROOT, 'tests');
const GAME_DIR = path.join(ROOT, 'src', 'game');
const FIXTURES_DIR = path.join(TESTS_DIR, 'fixtures');

/**
 * Resolve an import target to an actual source file. Vite maps .js-suffixed
 * relative imports onto .ts sources, so those suffixes are stripped and
 * re-tried — otherwise `import '../src/game/DuelScene.js'` would evade the
 * guard (audit finding: the resolver must not fail open).
 */
function resolveTsFile(target: string): string | null {
  const bases = [target];
  const jsSuffix = /\.(m|c)?jsx?$/.exec(target);
  if (jsSuffix !== null) bases.push(target.slice(0, -jsSuffix[0].length));
  const candidates = bases.flatMap((b) => [b, `${b}.ts`, `${b}.tsx`, `${b}.mts`, `${b}.cts`, path.join(b, 'index.ts')]);
  for (const cand of candidates) {
    if (existsSync(cand) && statSync(cand).isFile()) return cand;
  }
  return null;
}

describe('runtime boundary: tests never load Phaser', () => {
  it('no test transitively reaches src/game/** or the phaser package', () => {
    const offenders: string[] = [];
    const queue = listTsFiles(TESTS_DIR).filter((f) => !f.startsWith(FIXTURES_DIR + path.sep));
    const visited = new Set(queue);
    for (;;) {
      const file = queue.pop();
      if (file === undefined) break;
      for (const imp of scanImports(readSource(file), file)) {
        const at = `${path.relative(ROOT, file)}:${imp.line}`;
        // Fail CLOSED on dynamic specifiers the scanner can't resolve —
        // matching config-purity's stance (audit finding).
        if (!imp.static) {
          offenders.push(`${at} non-static dynamic import '${imp.specifier}'`);
          continue;
        }
        // Subpath imports (phaser/dist/…) load Phaser just as surely.
        if (imp.specifier === 'phaser' || imp.specifier.startsWith('phaser/')) {
          offenders.push(`${at} imports '${imp.specifier}'`);
          continue;
        }
        const target = resolveImportTarget(file, imp.specifier);
        if (target === null) continue; // other bare specifiers are fine in tests
        const resolved = resolveTsFile(target);
        if (resolved === null) continue;
        if (resolved.startsWith(GAME_DIR + path.sep)) {
          offenders.push(`${at} reaches ${path.relative(ROOT, resolved)}`);
          continue;
        }
        if (!visited.has(resolved)) {
          visited.add(resolved);
          queue.push(resolved);
        }
      }
    }
    expect(offenders, `Tests must never load Phaser:\n  ${offenders.join('\n  ')}`).toEqual([]);
  });
});
