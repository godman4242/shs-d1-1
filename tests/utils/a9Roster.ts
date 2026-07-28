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
  9011, // hakama — A9.5 (measured flat; clean hem; inset contour)
  9012, // collar/juban — A9.2 (was 75.9% ink as a blob)
  9014, // obi — A9.5 (base kept measured over D4's borderline SWF mapping)
  9015, // gi body — A9.4, OWNER RULING 2026-07-28 (balloon cut; A9-E green)
  9017, // kasa — A9.3 (two tones + ribs + band line + fringe; inset contour)
  9019, // gi sleeve, near — A9.4 (creases + crest, measured)
]);

/**
 * Garments measured genuinely FLAT in the source may keep ONE tone (kickoff
 * D3's obi veto). Joining requires citing the measured iqr beside the id.
 */
export const MEASURED_FLAT: ReadonlySet<number> = new Set<number>([
  // Hakama: iqr (3,2,5), and BOTH p25 (217,211,214) and p75 (220,213,219) sit
  // within 12 of the SWF's #dcd9d4 — a shadow tone would be invented, not
  // measured. Graded against both ends by the gate (worst channels 6 and 7).
  9011,
]);

/**
 * ⛔ EMPTY, AND THAT IS GATE A9-A MET IN FULL: all seven traced garments are
 * re-authored in the ORIGINAL's grammar. The last two (the gi pair) landed by
 * the OWNER'S RULING of 2026-07-28 — "not perfect, but I will accept it for
 * now" — which is also the one commit allowed to re-base the held-out floor
 * (see tests/a6Score.test.ts). The pin mechanism stays: a future traced shape
 * starts life HERE, exactly as the first seven did.
 */
export const LEGACY: Readonly<Record<number, { inkFillRings: number; tones: readonly number[] }>> = {};
