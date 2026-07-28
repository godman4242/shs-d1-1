/**
 * THE A9 ROSTER (SESSION22 A9.2) — which traced garments have been re-authored
 * into the ORIGINAL's own paint grammar, and which are still the SESSION19
 * traced blobs. ONE module, because TWO gates read it: `a9Grammar.test.ts`
 * enforces the grammar on roster shapes and pins the legacy ones;
 * `a8Colour.test.ts` grades ONLY legacy shapes (a re-authored garment's colour
 * gate is A9-D, which at 12 levels is TIGHTER than every legacy ratchet it
 * replaces). Two copies of this list is how a garment ends up graded by
 * neither.
 *
 * ⛔ RATCHET DIRECTION: ids move LEGACY → REAUTHORED in the same commit that
 * re-authors them, and never back. The partition test in a9Grammar holds the
 * two sets to exactly the traced corpus.
 */

/** Shapes re-authored in the OG grammar (base + shadow + stroked contour). */
export const REAUTHORED: ReadonlySet<number> = new Set<number>([
  9001, // gi sleeve, far — A9.2 (was 70.6% ink as a blob)
  9012, // collar/juban — A9.2 (was 75.9% ink as a blob)
]);

/**
 * Garments measured genuinely FLAT in the source may keep ONE tone (kickoff
 * D3's obi veto). Joining requires citing the measured iqr beside the id.
 */
export const MEASURED_FLAT: ReadonlySet<number> = new Set<number>([]);

/**
 * ⛔ THE PRE-A9 TRACED BLOBS, PINNED EXACTLY AS THEY STAND (probed 2026-07-28,
 * baseline f7e3801). Every one is the same anti-grammar: no strokes, one
 * all-ink fill ring for an outline, one flat tone. The pin freezes them: any
 * in-place edit fails with instructions to re-author instead.
 */
export const LEGACY: Readonly<Record<number, { inkFillRings: number; tones: readonly number[] }>> = {
  9011: { inkFillRings: 1, tones: [0xc8c3c5] }, // hakama
  9014: { inkFillRings: 1, tones: [0xcdcacb] }, // obi
  9015: { inkFillRings: 1, tones: [0x6e6b6d] }, // gi body
  9017: { inkFillRings: 1, tones: [0x8e6f38] }, // kasa
  9019: { inkFillRings: 1, tones: [0x6a6669] }, // gi sleeve, near
};
