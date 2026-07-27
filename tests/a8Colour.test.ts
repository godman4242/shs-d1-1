/**
 * ⭐ GATE A8-A / A8-D (SESSION21 A8.1) — EVERY TRACED GARMENT'S FILL IS COMPARED
 * TO THE SOURCE'S OWN COLOUR, AND THE SUITE HOLDS THE ERROR AS A RATCHET.
 *
 * ⛔ WHY THIS EXISTS. SESSION 20 ended with the silhouette score reading 0.9006
 * against a source frame while the source's own two frames agree at only 0.8808
 * — we scored ABOVE the ceiling and the fighter still visibly did not match.
 * A width profile is blind to colour. It cannot see that the robe is ~20 levels
 * too dark or the straw ~25, so those errors were free, and they stayed.
 *
 * ⚠️ IT IS A RATCHET, NOT A TARGET. `WORST_CHANNEL_DELTA` below may only ever
 * move DOWN, and only in a commit that says why. Raising an entry to make a diff
 * go green converts the only colour measurement in the repo into a rubber stamp
 * — the same edit `tests/a6Score.test.ts` forbids for the silhouette floors.
 *
 * ⚠️ WHICH NUMBERS THESE ARE. The source side is `scripts/art/sourceColour.ts`'s
 * COMMITTED medians, so this runs in a clean clone with no `reference/`. It is
 * derived data about colour, exactly as `sourceProfile.ts` is derived data about
 * proportion. Re-measure with `python3 scripts/art/colourRuler.py`.
 *
 * ⛔ AND WHAT THIS CANNOT SEE. It grades ONE flat fill per garment against the
 * source's MEDIAN. The source garments are not flat — the kasa's straw is woven
 * and two-toned, the gi has a lighter front panel and a darker back — so a
 * garment can pass here and still read wrong because it is missing INTERIOR
 * STRUCTURE. That is §P4.2 and §P4.9 of the kickoff, and no single-colour gate
 * can reach them. **A green A8-D is necessary and not sufficient: look at the
 * three band crops.**
 */
import { describe, expect, it } from 'vitest';
import { COLOUR_FRAME, SOURCE_FILLS } from '../scripts/art/sourceColour';
import type { ArtShape } from '../src/game/art/types';
import { SHAPE_9001 } from '../src/game/art/generated/shape9001';
import { SHAPE_9011 } from '../src/game/art/generated/shape9011';
import { SHAPE_9012 } from '../src/game/art/generated/shape9012';
import { SHAPE_9014 } from '../src/game/art/generated/shape9014';
import { SHAPE_9015 } from '../src/game/art/generated/shape9015';
import { SHAPE_9017 } from '../src/game/art/generated/shape9017';
import { SHAPE_9019 } from '../src/game/art/generated/shape9019';

const TRACED: readonly ArtShape[] = [
  SHAPE_9001, SHAPE_9011, SHAPE_9012, SHAPE_9014, SHAPE_9015, SHAPE_9017, SHAPE_9019,
];

/**
 * ⛔ THE RATCHET — MEASURED 2026-07-28, MAY ONLY MOVE DOWN.
 *
 * Per garment, the worst single-channel gap between our committed fill and the
 * source's median inside that garment's own traced mask. These are the numbers
 * as they stand BEFORE any colour is touched — committed first on purpose, so
 * that nothing can be tuned against a bar that was written after the answer was
 * known (the A6.2 discipline: the baseline lands in its own commit).
 *
 * ⭐ GATE A8-D WANTS EVERY ENTRY AT OR BELOW 12. Four of seven already are; the
 * three that are not name the defect §P4.12 of the kickoff describes.
 */
const WORST_CHANNEL_DELTA: Readonly<Record<number, number>> = {
  9001: 1, // far sleeve   — ⚠️ n=41, the smallest sample here; the weakest row
  9011: 22, // hakama      — ours is DARK; the kickoff's §P4.12 said so and was right
  9012: 22, // juban collar — ours is DARK; §P4.12's own sample missed this garment
  9014: 2, // obi
  9015: 7, // gi body
  9017: 23, // kasa straw  — ours is LIGHT, ⛔ NOT dark; §P4.12 had the sign backwards
  9019: 2, // near sleeve
};

/** Gate A8-D's own bar, kept separate from today's measured state above. */
const A8_D_TOLERANCE = 12;

function interiorFills(shape: ArtShape): number[] {
  return shape.paints
    .filter((p) => p.kind === 'fill' && p.color !== 0x000000)
    .map((p) => p.color);
}

const channels = (rgb: number): [number, number, number] => [
  (rgb >> 16) & 0xff,
  (rgb >> 8) & 0xff,
  rgb & 0xff,
];

/**
 * A garment with no committed ratchet is a FAILURE, never a skip. Reading the
 * table with `?? Infinity` would let a newly traced garment slip in ungraded and
 * still turn the suite green — a gate that quietly stops covering things.
 */
function ratchetFor(shapeId: number): number {
  const committed = WORST_CHANNEL_DELTA[shapeId];
  if (committed === undefined) {
    throw new Error(`shape ${shapeId} has no committed colour ratchet — measure it, do not skip it`);
  }
  return committed;
}

/** The worst single-channel gap between our committed fill and the source's median. */
function worstDelta(shape: ArtShape, median: readonly [number, number, number]): number {
  const fills = interiorFills(shape);
  const first = fills[0];
  if (first === undefined) throw new Error(`shape ${shape.id} has no non-black fill to grade`);
  // Indexed one channel at a time on purpose: both sides are fixed 3-tuples, so
  // this needs no `?? 0` fallback — and a fallback is how a missing channel
  // would score 0 error instead of failing.
  const ours = channels(first);
  return Math.max(
    Math.abs(ours[0] - median[0]),
    Math.abs(ours[1] - median[1]),
    Math.abs(ours[2] - median[2]),
  );
}

describe('A8-A — the colour ruler: every traced garment is measured against the source', () => {
  it('covers every traced shape, and every measured garment is a traced shape', () => {
    // Both directions, like the provenance gate: a garment that loses its
    // measurement, and a measurement whose garment is gone, are different bugs
    // and a one-way check catches only one of them.
    const measured = SOURCE_FILLS.map((f) => f.shapeId).sort((a, b) => a - b);
    const traced = TRACED.map((s) => s.id).sort((a, b) => a - b);
    expect(measured).toEqual(traced);
  });

  it('names the frame the source colours were measured from', () => {
    expect(COLOUR_FRAME).toContain('reference/frames/');
  });

  it('every traced garment paints its interior in ONE colour, so ONE fill is graded', () => {
    // `trace_one` emits a single sampled `fillcol` for every interior ring, so
    // two different non-black fills in one shape would mean the tracer changed
    // under this gate's feet and the "our fill" it compares is a guess.
    for (const shape of TRACED) {
      const fills = new Set(interiorFills(shape));
      expect(fills.size, `shape ${shape.id} interior fills`).toBe(1);
    }
  });

  it('every garment is within its committed per-channel ratchet', () => {
    for (const src of SOURCE_FILLS) {
      const shape = TRACED.find((s) => s.id === src.shapeId);
      if (shape === undefined) throw new Error(`shape ${src.shapeId} is measured but not traced`);
      const ours = channels(interiorFills(shape)[0] ?? 0);
      const worst = worstDelta(shape, src.median);
      expect(
        worst,
        `${src.garment} (${src.shapeId}): ours rgb(${ours.join(',')}) vs source median ` +
          `rgb(${src.median.join(',')}) — worst channel ${worst}`,
      ).toBeLessThanOrEqual(ratchetFor(src.shapeId));
    }
  });

  it('reports which garments GATE A8-D still fails, without softening the gate', () => {
    // ⚠️ NOT an assertion that they pass — they do not, and A8.4 is the step that
    // fixes them. This pins WHICH ones fail so the list cannot quietly grow.
    const failing = SOURCE_FILLS.filter((f) => ratchetFor(f.shapeId) > A8_D_TOLERANCE)
      .map((f) => f.shapeId)
      .sort((a, b) => a - b);
    expect(failing).toEqual([9011, 9012, 9017]);
  });
});
