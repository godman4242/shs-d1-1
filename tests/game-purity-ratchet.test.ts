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
import { TRACED_ID_MIN } from '../scripts/art/emit';
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
        /**
         * SESSION19 A5.2 — TWO KINDS OF ART, TWO KINDS OF PROVENANCE, AND THE ID
         * DECIDES WHICH.
         *
         * Equipment art died with the CDN, so the outfit is TRACED from the
         * videos. This clause used to demand an `ffdec.sh -export shape` command
         * from every file — which a traced shape can only satisfy by claiming an
         * extraction that never happened, in the one repo where provenance is
         * the whole point. Ids >= 9000 are traced and nothing else is, so the
         * check is keyed on the id and cannot be dodged by editing the prose.
         *
         * BOTH DIRECTIONS ARE CHECKED. An OG shape that claims to be traced is
         * just as much a lie as a traced shape that claims to be extracted, and
         * a one-way check would wave the first one through.
         */
        const isTraced = id !== undefined && Number(id) >= TRACED_ID_MIN;
        const claimsExtracted = src.includes('ffdec.sh -export shape');
        const claimsTraced = src.includes('TRACED FROM VIDEO');
        const converted = src.includes('scripts/art/generate.ts');
        const declaresGenerated = src.includes('GENERATED — DO NOT EDIT');
        const declaresApprox = src.includes('APPROXIMATED FILLS:');
        const rel = path.relative(ROOT, file);
        if (id === undefined) bad.push(`${rel}: no 'source characterId'`);
        if (!converted) bad.push(`${rel}: no conversion command`);
        if (isTraced) {
          if (!claimsTraced) bad.push(`${rel}: id ${id} is traced but the header does not say so`);
          if (claimsExtracted) bad.push(`${rel}: TRACED art claims an FFDec extraction that never happened`);
          if (!src.includes('source frame')) bad.push(`${rel}: traced art names no source FRAME`);
          if (!src.includes('scripts/art/traceGarment.py')) bad.push(`${rel}: traced art names no tracing command`);
          // A trace whose placement/limits are unstated reads as measured fact.
          if (!src.includes('⚠️ INFERRED:')) bad.push(`${rel}: traced art declares nothing INFERRED`);
        } else {
          if (!claimsExtracted) bad.push(`${rel}: no extraction command`);
          if (claimsTraced) bad.push(`${rel}: payload-extracted art claims to be traced from video`);
        }
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

    /**
     * SESSION16 R2 finding 5 — THE CARVE-OUT'S STATED PAYMENT WAS NEVER MADE.
     *
     * The gate above greps HEADER TEXT and never reads the DATA, so provenance
     * was a caption rather than a claim. A shape2664.ts that was mirrored,
     * translated, recoloured, stroke-amputated, or handed another shape's
     * geometry entirely passed 639/639 tests, both typechecks and lint — while
     * the block comment on GENERATED_ART_DIR asserted the exemption was "paid
     * for by the provenance gate below". It was not. This is the payment.
     *
     * Text-level on purpose: it needs no import and no `reference/`, so it runs
     * in every clone and in CI, which is exactly where the D7 exemption needs
     * defending. It catches post-emit editing, a bad merge, and a stale artifact.
     *
     * ⚠️ HONEST LIMIT, so nobody reads more into this than it gives: `emit()`
     * derives the header and the data from the SAME object, so these clauses can
     * never catch a CONVERTER bug — only tampering after the fact. Catching
     * converter drift needs the byte-for-byte re-derivation test in
     * tests/svgShape.test.ts, which can only run where the gitignored corpus is.
     */
    it('the provenance header is a CHECKSUM over the data, not a caption (D7)', () => {
      const bad: string[] = [];
      for (const file of generated) {
        const src = readSource(file);
        const rel = path.relative(ROOT, file);

        // ── (1) THE IDENTITY TRIPLE ───────────────────────────────────────────
        // Header id, exported const name, the object's own `id`, and the
        // filename must all agree EXACTLY. The older check uses
        // basename.includes(id), which also accepts shape12664.ts.
        const headerId = /source characterId\s*:\s*(\d+)/.exec(src)?.[1];
        const constId = /export const SHAPE_(\d+)\s*:/.exec(src)?.[1];
        const dataId = /^\s*id:\s*(\d+),/m.exec(src)?.[1];
        if (headerId === undefined || constId === undefined || dataId === undefined) {
          bad.push(`${rel}: unreadable identity — header=${String(headerId)} const=${String(constId)} data=${String(dataId)}`);
        } else if (new Set([headerId, constId, dataId]).size !== 1) {
          bad.push(`${rel}: identity disagrees — header=${headerId} const=${constId} data=${dataId}`);
        } else if (path.basename(file) !== `shape${headerId}.ts`) {
          bad.push(`${rel}: filename is not exactly shape${headerId}.ts`);
        }

        // ── (2) THE COUNTS ────────────────────────────────────────────────────
        const counts = /(\d+) paint op\(s\) in SWF paint order: (\d+) solid fill\(s\), (\d+) stroke pass\(es\)/.exec(src);
        const rings = /(\d+) ring\(s\) \((\d+) hole\(s\)\), (\d+) vertices/.exec(src);
        // An UNPARSEABLE header is itself a failure. Failing open here is the
        // exact mistake the <path></path> fix was made to stop.
        if (counts === null || rings === null) {
          bad.push(`${rel}: CONTENT block does not parse — cannot verify the header against the data`);
        } else {
          const pointArrays = [...src.matchAll(/\{ points: \[([^\]]*)\], hole: (true|false) \}/g)];
          const actual = {
            paints: (src.match(/^\s*kind: '(?:fill|stroke)',$/gm) ?? []).length,
            fills: (src.match(/^\s*kind: 'fill',$/gm) ?? []).length,
            strokes: (src.match(/^\s*kind: 'stroke',$/gm) ?? []).length,
            rings: pointArrays.length,
            holes: pointArrays.filter((m) => m[2] === 'true').length,
            verts: pointArrays.reduce((n, m) => n + (m[1] ?? '').split(',').length / 2, 0),
          };
          const claimed = {
            paints: Number(counts[1]),
            fills: Number(counts[2]),
            strokes: Number(counts[3]),
            rings: Number(rings[1]),
            holes: Number(rings[2]),
            verts: Number(rings[3]),
          };
          for (const key of ['paints', 'fills', 'strokes', 'rings', 'holes', 'verts'] as const) {
            if (claimed[key] !== actual[key]) {
              bad.push(`${rel}: header claims ${String(claimed[key])} ${key}, data has ${String(actual[key])}`);
            }
          }
        }

        // ── (3) THE PALETTE ───────────────────────────────────────────────────
        // Without this, "Colours are BYTE-EXACT to the SWF's recorded RGB" — the
        // header's loudest claim — is unchecked, and a magenta outline passes
        // every count. Order matters: it is the SWF's paint order.
        const palette = /palette\s+:\s+fills (.*?)\s+\|\s+strokes (.*)/.exec(src);
        if (palette === null) {
          bad.push(`${rel}: no parseable palette line — the byte-exact colour claim is unverifiable`);
        } else {
          const fillColours = [...src.matchAll(/kind: 'fill',\n\s*color: (0x[0-9a-f]{6}),/g)].map((m) => m[1]);
          const strokeSpecs = [...src.matchAll(/kind: 'stroke',\n\s*color: (0x[0-9a-f]{6}),\n\s*width: ([0-9.]+),/g)].map(
            (m) => `${String(m[1])}@${String(m[2])}`,
          );
          const claimedFills = palette[1] === 'none' ? [] : (palette[1] ?? '').split(' · ');
          const claimedStrokes = palette[2] === 'none' ? [] : (palette[2] ?? '').split(' · ');
          if (claimedFills.join(',') !== fillColours.join(',')) {
            bad.push(`${rel}: header fill palette [${claimedFills.join(', ')}] ≠ data [${fillColours.join(', ')}]`);
          }
          if (claimedStrokes.join(',') !== strokeSpecs.join(',')) {
            bad.push(`${rel}: header stroke palette [${claimedStrokes.join(', ')}] ≠ data [${strokeSpecs.join(', ')}]`);
          }
        }
      }
      expect(bad, `Generated art whose header does not match its data (D7):\n  ${bad.join('\n  ')}`).toEqual([]);
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
