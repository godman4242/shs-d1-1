/**
 * THE SOURCE FIGHTER'S PAINT LEDGER (LANE L3B) — MEASURED, and committed as
 * derived data so the suite can grade against it with no `reference/`.
 * BUILD-TIME ONLY. **GENERATED — regenerate, do not hand-edit.**
 *
 * ⛔ WHY NUMBERS AND NOT THE FRAMES. `reference/` is gitignored — the videos and
 * their stills are study-only and never distributed — and a runtime read of it is
 * the bug that once broke every fresh clone (SESSION16 finding 4). Sixty shares
 * are derived data about colour blocking, the same kind of committed target
 * `sourceProfile.ts` holds for proportion and `sourceColour.ts` for tone.
 *
 * PROVENANCE — reproduce with:
 *   python3 scripts/art/bandRuler.py --emit
 *
 * WHAT A CELL IS: within one horizontal band of the figure (bands are fractions
 * of its OWN height, so scale cancels), the share of in-figure pixels whose
 * nearest ANCHOR colour belongs to that paint class. Anchors are colours
 * committed shapes actually paint — never hand-picked thresholds.
 *
 * ⭐ `spread` IS THE POINT OF THE HELD-OUT ROW. Two frames of the same fighter,
 * five seconds apart, disagree by this much per cell. That is the measurement's
 * own noise, and GATE A13-A tolerates it rather than pretending to resolve
 * through it — the same argument `sourceProfile.ts` makes with its
 * `FRAME_TO_FRAME_CEILING`.
 *
 * ⛔ WHAT THIS LEDGER CANNOT SEE, stated because the last gate did not state its
 * blind spot and the owner found it instead:
 *   1. LEFT-RIGHT ARRANGEMENT. A band integrates across the row, so white at the
 *      front and white at the back score identically.
 *   2. THE SHAPE OF A REGION. Two crisp crests and one black smear of equal area
 *      are the same number. It grades an ink BUDGET, never a mark's placement.
 *   3. THE OG's OWN MASK. `silhouette_from_frame` includes the grass the fighter
 *      stands in; part of the hem band's non-white share is scenery, not cloth.
 *      That is why the hem band's spread is the widest in the table, and why the
 *      gate goes correctly blind there rather than confidently wrong.
 *   4. A GARMENT ON THE WRONG SLOT, when both slots fall inside one band.
 *   5. One frame, one pose, one outfit.
 */

/** One horizontal band of the figure, as fractions of its own height. */
export interface SourceBand {
  readonly name: string;
  readonly lo: number;
  readonly hi: number;
}

/** A paint class, named by the shapes that paint it. */
export type PaintClass = 'ink' | 'white' | 'grey' | 'skin' | 'straw';

/** One classifier anchor: a colour a COMMITTED shape actually paints. */
export interface PaintAnchor {
  readonly rgb: readonly [number, number, number];
  readonly paint: PaintClass;
  /** Which committed shape or measurement this colour is, verbatim. */
  readonly from: string;
}

/** Every class's share of one band's in-figure pixels, in percent. */
export interface BandShare {
  readonly band: string;
  readonly pixels: number;
  readonly share: Readonly<Record<PaintClass, number>>;
}

export const SOURCE_BANDS: readonly SourceBand[] = [
  { name: 'kasa', lo: 0.00, hi: 0.18 },
  { name: 'head/collar', lo: 0.18, hi: 0.30 },
  { name: 'gi body', lo: 0.30, hi: 0.52 },
  { name: 'obi/waist', lo: 0.52, hi: 0.62 },
  { name: 'hakama', lo: 0.62, hi: 0.88 },
  { name: 'hem/feet', lo: 0.88, hi: 1.00 },
];

export const PAINT_ANCHORS: readonly PaintAnchor[] = [
  { rgb: [0, 0, 0], paint: 'ink', from: 'outline — every shape\'s stroke colour' },
  { rgb: [220, 217, 212], paint: 'white', from: 'hakama base — shape9011 fill (SWF #dcd9d4)' },
  { rgb: [196, 193, 196], paint: 'white', from: 'collar shadow — shape9012, sourceColour p25' },
  { rgb: [105, 101, 104], paint: 'grey', from: 'gi base — shape9015, sourceColour p75' },
  { rgb: [103, 100, 103], paint: 'grey', from: 'gi shadow — shape9015, sourceColour p25' },
  { rgb: [254, 202, 152], paint: 'skin', from: 'flesh base — shape2674 (SWF, extracted)' },
  { rgb: [183, 143, 108], paint: 'skin', from: 'flesh shadow — shape2667 (SWF, extracted)' },
  { rgb: [154, 119, 57], paint: 'straw', from: 'kasa base — shape9017, sourceColour p75' },
  { rgb: [116, 84, 33], paint: 'straw', from: 'kasa shadow — shape9017, sourceColour p25' },
];

/**
 * The frame SESSION 19 traced the outfit from, and the one this gate grades
 * against. A5.1 chose it by LOOKING: lone fighter, clean side profile.
 */
export const TRACING_BAND_FRAME = 'reference/frames/s19_trace/zFt_0061.png';
export const TRACING_BAND_FRAME_T = 590.0;
export const TRACING_BANDS: readonly BandShare[] = [
  { band: 'kasa', pixels: 2527, share: { ink: 25.762, white: 0.198, grey: 2.493, skin: 9.893, straw: 61.654 } },
  { band: 'head/collar', pixels: 1170, share: { ink: 43.590, white: 9.316, grey: 25.299, skin: 10.085, straw: 11.709 } },
  { band: 'gi body', pixels: 3705, share: { ink: 30.715, white: 1.970, grey: 52.362, skin: 6.694, straw: 8.259 } },
  { band: 'obi/waist', pixels: 1395, share: { ink: 31.971, white: 20.932, grey: 31.541, skin: 8.029, straw: 7.527 } },
  { band: 'hakama', pixels: 4971, share: { ink: 14.705, white: 69.443, grey: 4.667, skin: 6.719, straw: 4.466 } },
  { band: 'hem/feet', pixels: 1843, share: { ink: 3.310, white: 43.733, grey: 28.595, skin: 22.246, straw: 2.116 } },
];

/**
 * HELD OUT — never traced from. Here it does one job and it is not "a second
 * target": it supplies the NOISE FLOOR. Measuring how far the source drifts from
 * itself in five seconds is what stops the gate demanding a precision the source
 * does not have.
 */
export const HELDOUT_BAND_FRAME = 'reference/frames/s19_trace/zFt_0071.png';
export const HELDOUT_BAND_FRAME_T = 595.0;
export const HELDOUT_BANDS: readonly BandShare[] = [
  { band: 'kasa', pixels: 2357, share: { ink: 14.128, white: 0.000, grey: 6.534, skin: 14.255, straw: 65.083 } },
  { band: 'head/collar', pixels: 1309, share: { ink: 55.157, white: 8.785, grey: 16.272, skin: 7.639, straw: 12.147 } },
  { band: 'gi body', pixels: 3527, share: { ink: 30.479, white: 1.956, grey: 51.857, skin: 7.031, straw: 8.676 } },
  { band: 'obi/waist', pixels: 1510, share: { ink: 29.470, white: 19.205, grey: 35.497, skin: 7.152, straw: 8.675 } },
  { band: 'hakama', pixels: 4715, share: { ink: 11.983, white: 72.937, grey: 4.772, skin: 7.275, straw: 3.033 } },
  { band: 'hem/feet', pixels: 2335, share: { ink: 3.298, white: 78.544, grey: 7.452, skin: 10.064, straw: 0.642 } },
];

/**
 * The hardest pixel per class in the tracing frame — the one nearest a TIE
 * between its winning anchor and the runner-up (`margin` is the gap in squared
 * RGB). The TypeScript classifier must sort every one of these the way the
 * Python that emitted them did; a witness set of easy pixels would prove
 * nothing, and a transcription typo in the anchor table is exactly the failure
 * two implementations of one rule invite.
 */
export interface PaintWitness {
  readonly rgb: readonly [number, number, number];
  readonly paint: PaintClass;
  readonly margin: number;
}

export const PAINT_WITNESSES: readonly PaintWitness[] = [
  { rgb: [56, 41, 26], paint: 'ink', margin: 5 },
  { rgb: [208, 205, 204], paint: 'white', margin: 0 },
  { rgb: [106, 99, 101], paint: 'grey', margin: 0 },
  { rgb: [137, 132, 138], paint: 'skin', margin: 4 },
  { rgb: [160, 138, 84], paint: 'straw', margin: 4 },
];
