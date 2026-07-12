/**
 * GAME-PURITY RATCHET (Stage 2 spec item 15) — src/game/ tolerates numeric
 * literals (render layout/feel), but only the ones already baselined:
 * per-file value MULTISETS committed in tests/game-purity-baseline.json.
 *
 *   - NEW value, or MORE copies of an existing value → FAIL (a substituted
 *     value is a new value + a removal, so substitutions fail too).
 *   - Fewer copies / removals → PASS (the ratchet only tightens).
 *   - A new game/ file → FAIL until deliberately baselined.
 *
 * Refreshing the baseline is a DELIBERATE act:
 *   UPDATE_GAME_PURITY_BASELINE=1 npx vitest run tests/game-purity-ratchet.test.ts
 * rewrites the file; the git diff is the review surface.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { listTsFiles, readSource, scanNumericLiterals } from './utils/configPurity';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const GAME_DIR = path.join(ROOT, 'src', 'game');
const BASELINE_PATH = path.join(ROOT, 'tests', 'game-purity-baseline.json');

type Multiset = Record<string, number>;
type Baseline = Record<string, Multiset>;

function currentMultisets(): Baseline {
  const result: Baseline = {};
  for (const file of listTsFiles(GAME_DIR)) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    const counts: Multiset = {};
    for (const hit of scanNumericLiterals(readSource(file), file)) {
      counts[hit.text] = (counts[hit.text] ?? 0) + 1;
    }
    result[rel] = counts;
  }
  return result;
}

describe('game-purity ratchet: src/game/ numeric-literal baseline', () => {
  const current = currentMultisets();

  if (process.env.UPDATE_GAME_PURITY_BASELINE === '1') {
    it('BASELINE REFRESHED (deliberate act — review the git diff)', () => {
      writeFileSync(BASELINE_PATH, `${JSON.stringify(current, null, 2)}\n`);
      expect(true).toBe(true);
    });
    return;
  }

  const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as Baseline;

  it('every game/ file is baselined (new files need a deliberate entry)', () => {
    const unbaselined = Object.keys(current).filter((f) => !(f in baseline));
    expect(unbaselined, `New src/game/ files — refresh the baseline deliberately:\n  ${unbaselined.join('\n  ')}`).toEqual([]);
  });

  it('no new or substituted numeric values (removals are fine)', () => {
    const violations: string[] = [];
    for (const [file, counts] of Object.entries(current)) {
      const allowed = baseline[file] ?? {};
      for (const [value, count] of Object.entries(counts)) {
        const cap = allowed[value] ?? 0;
        if (count > cap) violations.push(`${file}: '${value}' ×${count} (baseline allows ×${cap})`);
      }
    }
    expect(
      violations,
      `Numeric values in src/game/ beyond the committed baseline — either move them to src/config/ (preferred) or refresh the baseline deliberately:\n  ${violations.join('\n  ')}`,
    ).toEqual([]);
  });
});
