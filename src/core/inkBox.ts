/**
 * INK BOX (SESSION17 A3.2) — SESSION17 §P2's measurement rule, as code.
 *
 * The rule, verbatim: "measure the bounding box of all canvas pixels whose alpha
 * ≥ 50 % of full, on a transparent-background render of the shape alone, and
 * report the box in CSS pixels at `devicePixelRatio` 1."
 *
 * It exists as a committed function because the A3-A gate is ±1 px on a ~20 px
 * ANTIALIASED object, and §P2 is explicit that "a loosely-defined 'read the
 * pixels' will produce a number that drifts with whoever reads it". A rule that
 * lives in a console transcript cannot be re-run by A4.
 *
 * ⚠️ TWO WIDTHS ARE RETURNED ON PURPOSE, and neither is more correct.
 * Ink running from x = 100.0 to x = 117.14 lights pixel columns 100..117:
 *   `spanX`    = 17 — distance between the outermost lit pixel CENTRES
 *   `coveredX` = 18 — the NUMBER of lit columns
 * The true 17.14 lies between them. That gap IS the ±1 px noise floor §P2 warns
 * about; collapsing it to a single number would pick a side of the noise and
 * present it as precision.
 */
import { RGBA_ALPHA_OFFSET, RGBA_STRIDE } from '../config/art';
import { ONE, ZERO } from '../config/nums';

export interface InkBox {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
  /** Distance between outermost lit pixel centres — the LOW estimate. */
  readonly spanX: number;
  readonly spanY: number;
  /** Count of lit pixel columns/rows (`span + 1`) — the HIGH estimate. */
  readonly coveredX: number;
  readonly coveredY: number;
  /**
   * The ink reaches the sampled region's border, so the object may continue
   * past it and the measurement is a LOWER BOUND, not a size. A clipped read
   * looks exactly like a too-small render — the failure §2 would otherwise send
   * you hunting through units for.
   */
  readonly clipped: boolean;
}

/**
 * Bounding box of every pixel in `rgba` whose alpha is at least `minAlpha`.
 *
 * Throws rather than returning an empty box when nothing is lit: "0 × 0 px"
 * reads as a measurement when it actually means "I rendered nothing".
 */
export function inkBox(rgba: ArrayLike<number>, width: number, height: number, minAlpha: number): InkBox {
  const expected = width * height * RGBA_STRIDE;
  if (rgba.length !== expected) {
    throw new Error(`inkBox: buffer length ${String(rgba.length)} does not match width*height*4 = ${String(expected)}`);
  }

  let minX = width;
  let minY = height;
  let maxX = -ONE;
  let maxY = -ONE;

  for (let y = ZERO; y < height; y += ONE) {
    for (let x = ZERO; x < width; x += ONE) {
      const alpha = rgba[(y * width + x) * RGBA_STRIDE + RGBA_ALPHA_OFFSET];
      if (alpha === undefined || alpha < minAlpha) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < ZERO) {
    throw new Error(`inkBox: no ink — no pixel in the ${String(width)}x${String(height)} region reached alpha ${String(minAlpha)}`);
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    spanX: maxX - minX,
    spanY: maxY - minY,
    coveredX: maxX - minX + ONE,
    coveredY: maxY - minY + ONE,
    clipped: minX === ZERO || minY === ZERO || maxX === width - ONE || maxY === height - ONE,
  };
}
