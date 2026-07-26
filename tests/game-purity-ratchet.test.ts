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
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { listTsFiles, listUnscannableFiles, readSource, scanNumericLiterals } from './utils/configPurity';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const GAME_DIR = path.join(ROOT, 'src', 'game');
const BASELINE_PATH = path.join(ROOT, 'tests', 'game-purity-baseline.json');

/**
 * SESSION 15 D7 — THE ONE CARVE-OUT, DELIBERATE AND NARROW.
 *
 * `src/game/art/generated/` holds vector art TRACED FROM THE ORIGINAL GAME and
 * emitted by `scripts/art/generate.ts`. Each file is thousands of coordinates
 * read out of the OG's own DefineShape records.
 *
 * The ratchet exists to stop INVENTED numbers. Traced coordinates are the
 * opposite of invented — they are the most strongly sourced numbers in the
 * repo — and hand-reviewing a baseline diff of 60,000 polygon vertices is not
 * a meaningful act of review.
 *
 * ⚠️ This is a carve-out for GENERATED, PROVENANCED data only. It is scoped to
 * exactly one directory, never widened to `src/game/art/` as a whole (the
 * hand-written `types.ts` there stays fully ratcheted), and it is paid for by
 * the provenance gate below: a file in here WITHOUT a header naming its source
 * characterId and extraction command is a FAILURE, not an exemption.
 */
const GENERATED_ART_DIR = path.join(GAME_DIR, 'art', 'generated');
const isGeneratedArt = (file: string): boolean => file.startsWith(GENERATED_ART_DIR + path.sep);

type Multiset = Record<string, number>;
type Baseline = Record<string, Multiset>;

function currentMultisets(): Baseline {
  const result: Baseline = {};
  // src/main.ts is game-layer too — it sat outside every literal gate
  // until the Stage-2 audit demonstrated a planted `width: 907` staying
  // green (finding verified inline).
  const files = [...listTsFiles(GAME_DIR), path.join(ROOT, 'src', 'main.ts')].filter(
    (f) => !isGeneratedArt(f), // SESSION15 D7 — see the comment on GENERATED_ART_DIR
  );
  for (const file of files) {
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
    it('BASELINE REFRESHED (deliberate act — this failure is the receipt)', () => {
      const before = readFileSync(BASELINE_PATH, 'utf8');
      const after = `${JSON.stringify(current, null, 2)}\n`;
      writeFileSync(BASELINE_PATH, after);
      // Audit fix: an AMBIENTLY leaked env var must not silently disarm the
      // pre-commit gate. If the baseline actually changed, this run goes RED
      // — the deliberate refresh sees it once and commits the diff; a leaked
      // var with drift can never sneak through green.
      expect(after, 'Baseline rewritten — review + commit the diff, then rerun without the env var').toBe(before);
    });
    return;
  }

  const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as Baseline;

  it('every game/ file is baselined (new files need a deliberate entry)', () => {
    const unbaselined = Object.keys(current).filter((f) => !(f in baseline));
    expect(unbaselined, `New src/game/ files — refresh the baseline deliberately:\n  ${unbaselined.join('\n  ')}`).toEqual([]);
  });

  it('src/game/ holds no unscannable payload files (parity with core/config)', () => {
    expect(listUnscannableFiles(GAME_DIR)).toEqual([]);
  });

  it('no scene ever calls sim.tick() — advance() owns the clock (audit guard)', () => {
    const offenders: string[] = [];
    for (const file of listTsFiles(GAME_DIR)) {
      if (readSource(file).includes('.tick(')) offenders.push(path.relative(ROOT, file));
    }
    expect(offenders, 'tick() bypasses the accumulator + MAX_FRAME_MS clamp — scenes must call advance()').toEqual([]);
  });

  // ── SESSION 15 D7: what the carve-out above is PAID FOR WITH ───────────────
  // The ratchet is switched off for generated art, so these take its place.
  // Every one of them is the reason the exemption is safe.
  describe('generated art must earn its ratchet exemption', () => {
    const generated = listTsFiles(GAME_DIR).filter(isGeneratedArt);

    it('every exempt file carries a provenance header (source id + command)', () => {
      const bad: string[] = [];
      for (const file of generated) {
        const src = readSource(file);
        const idMatch = /source characterId\s*:\s*(\d+)/.exec(src);
        const id = idMatch?.[1];
        const hasCommand = src.includes('ffdec.sh -export shape') && src.includes('scripts/art/generate.ts');
        const declaresGenerated = src.includes('GENERATED — DO NOT EDIT');
        const declaresApprox = src.includes('APPROXIMATED FILLS:');
        const rel = path.relative(ROOT, file);
        if (id === undefined) bad.push(`${rel}: no 'source characterId'`);
        if (!hasCommand) bad.push(`${rel}: no extraction/conversion command`);
        if (!declaresGenerated) bad.push(`${rel}: not marked GENERATED — DO NOT EDIT`);
        // SESSION15 gate item 6 — approximations must be listed, never silent.
        if (!declaresApprox) bad.push(`${rel}: header does not state its APPROXIMATED FILLS`);
        // The filename must match the id it claims, or provenance is a fiction.
        if (id !== undefined && !path.basename(file).includes(id)) {
          bad.push(`${rel}: filename does not match declared characterId ${id}`);
        }
      }
      expect(bad, `Generated art without provenance is a gate failure (D7):\n  ${bad.join('\n  ')}`).toEqual([]);
    });

    it('loads NOTHING at runtime — the data is compiled in (D1)', () => {
      // reference/ is gitignored, so a loader would work locally and break in
      // every clone, CI run and deploy. Static `import type` only.
      const offenders: string[] = [];
      for (const file of [...generated, path.join(GAME_DIR, 'art', 'types.ts')]) {
        const src = readSource(file);
        for (const pattern of [/\bfetch\s*\(/, /\bimport\s*\(/, /\brequire\s*\(/, /readFileSync/, /XMLHttpRequest/]) {
          if (pattern.test(src)) offenders.push(`${path.relative(ROOT, file)}: ${pattern.source}`);
        }
      }
      expect(offenders, 'Runtime loading in the art path — reference/ is gitignored').toEqual([]);
    });

    it('src/ holds zero image files (the stack invariant: procedural vector only)', () => {
      const imageExt = /\.(png|jpe?g|gif|webp|bmp|svg|avif|tga|dds)$/i;
      const walk = (dir: string): string[] =>
        readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
          e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
        );
      const images = walk(path.join(ROOT, 'src')).filter((f) => imageExt.test(f));
      expect(images.map((f) => path.relative(ROOT, f))).toEqual([]);
    });
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
