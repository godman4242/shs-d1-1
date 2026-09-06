/**
 * OUR FIGHTER'S PAINT LEDGER (LANE L3B) — the same six-band, five-class
 * measurement `scripts/art/bandRuler.py` takes of the source frame, taken here
 * of OUR raster with no `reference/`. BUILD-TIME ONLY.
 *
 * ⛔ WHY IT EXISTS. SESSION 29's render passed silhouette 0.9185 (floor 0.9005),
 * aspect within 0.009, white coverage within 0.8 pp and dark ink within 0.6 pp,
 * and the owner rejected it on sight. The reason those four agreed is measured:
 * the defects CANCEL over the whole figure. There is no white above the hip
 * (the juban and obi are painted, in the right white, and then covered by the
 * gi's silhouette) and too much below it (one leg shape drawn twice, splayed).
 * Summed, they annihilate. Split into bands, they do not — 2.5 pp against
 * 25.3 pp. This file is the split.
 *
 * ⚠️ TWO MEASUREMENT RULES THAT MUST NOT DRIFT FROM THE PYTHON TWIN.
 *   BANDS and ANCHORS are NOT defined here. They are read from the generated
 *   `sourceBands.ts`, which the Python emitter wrote — so there is exactly one
 *   copy of each in TypeScript and it is the one that came from the ruler.
 *   `PAINT_WITNESSES` pins the classifier itself: the hardest pixel per class,
 *   the one nearest a tie, sorted here the way the emitter sorted it.
 *
 * ⛔ AND ONE ASYMMETRY THAT CANNOT BE REMOVED, so it is declared instead.
 * The source side is a video frame segmented by an image heuristic, and its
 * anti-aliased edge pixels are blends with the SCENERY. Our side is an exact
 * coverage mask, and its edge pixels are blends with the magenta BACKDROP —
 * a colour the fighter never paints, which would sort a half-covered black
 * outline into `grey`. So our side un-composites: a pixel's paint colour is
 * recovered exactly as `(rgb - (1 - a) * backdrop) / a`. That is exact given the
 * raster, but it means our edges read as PURE PAINT where the source's read as
 * paint-blended-with-grass. The gate absorbs that in the source's own
 * frame-to-frame spread; it does not pretend the two rules are identical.
 */
import { INK_ALPHA_THRESHOLD } from '../../src/config/art';
import type { Raster } from './rasterise';
import { PAINT_ANCHORS, SOURCE_BANDS, type BandShare, type PaintClass } from './sourceBands';

/** Full coverage, as the raster stores it. */
const FULL_COVERAGE = 255;
const RGB_CHANNELS = 3;
/** Byte ceiling for a recovered channel — un-compositing can overshoot by rounding. */
const CHANNEL_MAX = 255;

/** The five paint classes, in the emitter's own order. */
export const PAINT_CLASSES: readonly PaintClass[] = ['ink', 'white', 'grey', 'skin', 'straw'];

/**
 * Nearest anchor in squared RGB — the classifier, in full.
 *
 * Squared distance, never a square root: the ordering is identical and the
 * arithmetic stays in integers, so this and the Python twin cannot disagree by
 * a floating-point hair on a near-tie. `PAINT_WITNESSES` are exactly those
 * near-ties.
 */
export function paintClassOf(r: number, g: number, b: number): PaintClass {
  let best: PaintClass | undefined;
  let bestDistance = Infinity;
  for (const anchor of PAINT_ANCHORS) {
    const [ar, ag, ab] = anchor.rgb;
    const d = (r - ar) * (r - ar) + (g - ag) * (g - ag) + (b - ab) * (b - ab);
    if (d < bestDistance) {
      bestDistance = d;
      best = anchor.paint;
    }
  }
  if (best === undefined) throw new Error('paintClassOf: the anchor table is empty');
  return best;
}

/** Bounds-checked read — `noUncheckedIndexedAccess` makes the absence explicit. */
function at(values: ArrayLike<number>, i: number): number {
  const v = values[i];
  if (v === undefined) throw new Error(`bandLedger: index ${String(i)} out of range`);
  return v;
}

/**
 * The paint colour under a partially-covered pixel, with the backdrop divided
 * back out. Rounding in the raster's 8-bit store is amplified by 1/a, which is
 * why only pixels at or above `INK_ALPHA_THRESHOLD` are ever classified — at
 * half coverage the recovered channel is within ±1 of the truth.
 */
function uncomposite(rgb: number, coverage: number, backdropChannel: number): number {
  const a = coverage / FULL_COVERAGE;
  const paint = (rgb - (1 - a) * backdropChannel) / a;
  return Math.min(CHANNEL_MAX, Math.max(0, Math.round(paint)));
}

/**
 * Rows of the raster that carry figure, top and bottom inclusive.
 *
 * ⚠️ The figure's own height is what the bands are fractions of, so this is the
 * step that makes the measurement scale-free — a 140 px render and a 233 px
 * video fighter divide into the same six bands.
 */
function figureRows(raster: Raster): { top: number; bottom: number } {
  const { width, height, coverage } = raster;
  let top = -1;
  let bottom = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (at(coverage, y * width + x) >= INK_ALPHA_THRESHOLD) {
        if (top < 0) top = y;
        bottom = y;
        break;
      }
    }
  }
  if (top < 0) throw new Error('bandLedger: the raster carries no ink at or above the alpha threshold');
  return { top, bottom };
}

/**
 * OUR side of the ledger: every band's per-class share of its own in-figure
 * pixels, in percent, in `SOURCE_BANDS` order.
 *
 * Throws rather than returning a zeroed row for an empty band: a band with no
 * pixels is a render that lost a limb, and scoring it as "0 % of everything"
 * would read as a small, tidy disagreement instead of a missing garment.
 */
export function bandLedger(raster: Raster): BandShare[] {
  const { width, rgb, coverage, backdrop } = raster;
  const backdropR = (backdrop >> 16) & 0xff;
  const backdropG = (backdrop >> 8) & 0xff;
  const backdropB = backdrop & 0xff;

  const { top, bottom } = figureRows(raster);
  const figureHeight = bottom - top + 1;

  return SOURCE_BANDS.map((band) => {
    const y0 = top + Math.trunc(figureHeight * band.lo);
    const y1 = top + Math.trunc(figureHeight * band.hi);
    const counts = new Map<PaintClass, number>(PAINT_CLASSES.map((c) => [c, 0]));
    let pixels = 0;

    for (let y = y0; y < y1; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const i = y * width + x;
        const a = at(coverage, i);
        if (a < INK_ALPHA_THRESHOLD) continue;
        const paint = paintClassOf(
          uncomposite(at(rgb, i * RGB_CHANNELS), a, backdropR),
          uncomposite(at(rgb, i * RGB_CHANNELS + 1), a, backdropG),
          uncomposite(at(rgb, i * RGB_CHANNELS + 2), a, backdropB),
        );
        counts.set(paint, (counts.get(paint) ?? 0) + 1);
        pixels += 1;
      }
    }

    if (pixels === 0) {
      throw new Error(`bandLedger: band '${band.name}' holds no figure pixels — the render is missing a garment, not merely off-target`);
    }

    const share = Object.fromEntries(
      PAINT_CLASSES.map((c) => [c, (100 * (counts.get(c) ?? 0)) / pixels]),
    ) as Record<PaintClass, number>;
    return { band: band.name, pixels, share };
  });
}

/**
 * How far one ledger sits from another, cell by cell, in percentage points.
 *
 * Throws on a band-name mismatch: zipping two ledgers that disagree about which
 * band is which would compare the kasa against the hem and report a number.
 */
export function cellDeltas(
  ours: readonly BandShare[],
  theirs: readonly BandShare[],
): Array<{ band: string; paint: PaintClass; ours: number; theirs: number; delta: number }> {
  if (ours.length !== theirs.length) {
    throw new Error(`cellDeltas: ${String(ours.length)} bands vs ${String(theirs.length)} — ledgers must be banded alike`);
  }
  const out: Array<{ band: string; paint: PaintClass; ours: number; theirs: number; delta: number }> = [];
  for (let i = 0; i < ours.length; i += 1) {
    const a = ours[i];
    const b = theirs[i];
    if (a === undefined || b === undefined) throw new Error('cellDeltas: missing band');
    if (a.band !== b.band) throw new Error(`cellDeltas: band ${String(i)} is '${a.band}' on one side and '${b.band}' on the other`);
    for (const paint of PAINT_CLASSES) {
      out.push({ band: a.band, paint, ours: a.share[paint], theirs: b.share[paint], delta: Math.abs(a.share[paint] - b.share[paint]) });
    }
  }
  return out;
}

/**
 * ⭐ GATE A13-A's RULE, in one place so the CLI that reports it and the test
 * that enforces it cannot drift.
 *
 * A cell fails when our share differs from the tracing frame's by more than the
 * source disagrees with ITSELF between two frames, doubled — or by more than a
 * fixed floor, whichever is larger.
 *
 * ⚠️ BOTH CONSTANTS ARE JUDGEMENT, AND THEY ARE STATED HERE SO THEY CAN BE
 * ARGUED WITH RATHER THAN TUNED. Neither was chosen by trying values until a
 * particular render passed — that is the move `GAUNTLET.md` §3.6 forbids, and it
 * is how a fidelity gate becomes a rubber stamp.
 */
export const GATE_A13A = {
  /**
   * Signal must be twice the noise. The conventional bar, and the reason it is
   * not 1x: at 1x, every cell whose two source frames happen to agree closely
   * becomes an exact-match demand on a lossy video measurement.
   */
  spreadMultiple: 2,
  /**
   * Percentage points. A floor exists because `gi body / white` has a spread of
   * 0.01 pp — two frames agreeing to a hundredth is luck, not precision, and
   * without a floor that cell would demand our render match a video frame to
   * within one part in ten thousand. Five points is one twentieth of a band:
   * below that, a difference is not something an eye can name, which is the
   * only standard this lane answers to.
   */
  noiseFloorPp: 5,
} as const;

export interface CellVerdict {
  readonly band: string;
  readonly paint: PaintClass;
  readonly ours: number;
  readonly target: number;
  readonly delta: number;
  /** |tracing - held-out| for this cell: the source's disagreement with itself. */
  readonly spread: number;
  readonly tolerance: number;
  readonly pass: boolean;
}

/**
 * Grade a ledger against the source's, cell by cell.
 *
 * `ours` is deliberately a plain ledger rather than a raster, so the SAME rule
 * can be pointed at a RECORDED ledger — which is what makes the red-proof in
 * `tests/a13Bands.test.ts` a permanent, executable artifact instead of a pasted
 * claim about a render that no longer exists.
 */
export function gradeLedger(
  ours: readonly BandShare[],
  tracing: readonly BandShare[],
  heldout: readonly BandShare[],
): CellVerdict[] {
  const against = cellDeltas(ours, tracing);
  const noise = cellDeltas(tracing, heldout);
  if (against.length !== noise.length) throw new Error('gradeLedger: cell counts differ between the target and the noise floor');

  return against.map((cell, i) => {
    const n = noise[i];
    if (n === undefined) throw new Error('gradeLedger: missing noise cell');
    if (n.band !== cell.band || n.paint !== cell.paint) {
      throw new Error(`gradeLedger: cell ${String(i)} is '${cell.band}/${cell.paint}' against '${n.band}/${n.paint}' — the two ledgers are not aligned`);
    }
    const tolerance = Math.max(GATE_A13A.noiseFloorPp, GATE_A13A.spreadMultiple * n.delta);
    return {
      band: cell.band,
      paint: cell.paint,
      ours: cell.ours,
      target: cell.theirs,
      delta: cell.delta,
      spread: n.delta,
      tolerance,
      pass: cell.delta <= tolerance,
    };
  });
}
