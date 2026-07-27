/**
 * THE SEALED SCORE (SESSION20 A6.3) — the fighter's width profile, and its
 * agreement with the source, computed from the RASTER with no `reference/`.
 * BUILD-TIME ONLY.
 *
 * ⛔ WHY THIS EXISTS RATHER THAN THE SUITE CALLING `compareToSource.py`.
 * Gate A6-C asks for "a committed number the suite enforces as a FLOOR", and the
 * suite **cannot** run the Python comparator: `reference/` is gitignored, a clean
 * clone has no frames, and a runtime read of it is the bug SESSION16 finding 4
 * cost this repo a broken checkout for. So the source side is committed as
 * DERIVED DATA — nineteen numbers per frame, the same kind of measured target
 * `docs/DIVERGENCES.md` already carries for A5-C — and our side is computed here
 * from the exact coverage mask.
 *
 * ⚠️ TWO SCORES EXIST AND THEY ARE NOT THE SAME NUMBER. Say which one you mean.
 *   - THE SEALED SCORE (this file): our side from the EXACT coverage mask, the
 *     source side from committed numbers. Portable, runs in CI, gates the suite.
 *   - THE DIAGNOSTIC SCORE (`compareToSource.py`): both sides through
 *     `proportions.py`'s image segmentation, on the real frame. Richer — per
 *     slot, plus an overlay to look at — but it needs `reference/`.
 * They disagree slightly by construction: a heuristic segmentation of a rendered
 * PNG is not the same set of pixels as the renderer's own coverage. Neither is
 * wrong; quoting one as the other would be.
 */
import type { Raster } from './rasterise';

/**
 * Where the profile is sampled, as fractions of the figure's own height:
 * 5 %, 10 % … 95 %. Identical to `scripts/art/proportions.py`'s `DECILES`, and
 * it must stay identical — the committed source profiles were measured at
 * exactly these heights.
 */
export const PROFILE_SAMPLES: readonly number[] = Array.from({ length: 19 }, (_, i) => (i + 1) / 20);

/** Any pixel carrying ink at all. Anti-aliased edges count; the source's do too. */
const INK = 1;

/**
 * The fighter's width at each sample height, as a FRACTION of its own height —
 * so two figures at different scales compare directly, which is the whole reason
 * the profile is the primary comparison rather than four landmark widths.
 *
 * ⚠️ WIDTH IS THE COUNT OF INKED PIXELS ON THE ROW, not the row's outer span.
 * `proportions.py` uses `fig.sum(axis=1)` — a count — and a span would read wider
 * wherever the silhouette has a gap. The committed source numbers are counts, so
 * this must count too.
 */
export function widthProfile(raster: Raster): number[] {
  const { width, height, coverage } = raster;
  const rowWidth: number[] = [];
  let top = -1;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) {
    let n = 0;
    for (let x = 0; x < width; x += 1) {
      const c = coverage[y * width + x];
      if (c !== undefined && c >= INK) n += 1;
    }
    rowWidth.push(n);
    if (n > 0) {
      if (top < 0) top = y;
      bottom = y;
    }
  }
  if (top < 0) throw new Error('widthProfile: the raster carries no ink — nothing to measure');

  const h = bottom - top + 1;
  return PROFILE_SAMPLES.map((f) => {
    const row = rowWidth[Math.round(top + f * (h - 1))];
    if (row === undefined) throw new Error('widthProfile: sample row out of range');
    return row / h;
  });
}

/**
 * Width-profile agreement, 1.000 = identical.
 *
 * Per-sample `min/max`, averaged — the SAME statistic SESSION 19 A5-E reported
 * and `compareToSource.py` reimplements, so the numbers are comparable across
 * all three. A sample where BOTH are zero counts as agreement; one where only
 * one is counts as zero, which is what a missing limb should score.
 *
 * Throws on a length mismatch: silently zipping to the shorter array would score
 * a truncated profile as a good one.
 */
export function profileAgreement(ours: readonly number[], theirs: readonly number[]): number {
  if (ours.length !== theirs.length) {
    throw new Error(`profileAgreement: ${String(ours.length)} samples vs ${String(theirs.length)} — profiles must be sampled alike`);
  }
  if (ours.length === 0) throw new Error('profileAgreement: empty profiles');

  let total = 0;
  for (let i = 0; i < ours.length; i += 1) {
    const a = ours[i];
    const b = theirs[i];
    if (a === undefined || b === undefined) throw new Error('profileAgreement: missing sample');
    if (a <= 0 && b <= 0) total += 1;
    else if (a > 0 && b > 0) total += Math.min(a, b) / Math.max(a, b);
  }
  return total / ours.length;
}
