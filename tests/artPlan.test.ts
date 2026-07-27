/**
 * ART PLANNER (SESSION17 A3.1) — the pure `ArtShape` → ordered `DrawOp[]` step.
 *
 * WHY THIS FILE EXISTS AT ALL (SESSION17 D2): `tests/no-game-imports.test.ts`
 * forbids a test from reaching `src/game/**` because Phaser crashes the Node
 * worker, so a renderer written inside a scene is UNTESTABLE BY CONSTRUCTION.
 * Splitting the pure planning step into `src/core/` is what makes gate A3-C —
 * paint order — provable at all. `SHAPE_2664` is `F S S`, where source order and
 * the fills-then-strokes bug produce IDENTICAL pixels, so no screenshot this
 * session can catch that regression. This test is the entire defence
 * (SESSION17 §6 Risk 1).
 *
 * THE TWO-DECLARATION CONTRACT (SESSION17 D-A): `src/core/` may not import
 * `src/game/art/types.ts` — `tests/config-purity.test.ts` resolves every import,
 * `import type` included. So the planner re-declares its input structurally.
 * `plans the COMMITTED art without a cast` below is what stops the two
 * declarations drifting: it is a compile-time assignability check with a runtime
 * assertion attached.
 */
import { describe, expect, it } from 'vitest';
import {
  inkedBounds,
  planShape,
  trianglesOf,
  type DrawOp,
  type HoledFillOp,
  type ShapeInput,
  type StrokeOp,
} from '../src/core/artPlan';
import { VIEW, type ViewTransform } from '../src/core/viewport';
import { SHAPE_2664 } from '../src/game/art/generated/shape2664';

/** An arbitrary stage anchor — the planner must be origin-agnostic. */
const ORIGIN = { x: 300, y: 300 };

/** Scale 1, no offset — so a packed stage coordinate reads as `300 + local`. */
const UNIT: ViewTransform = { scale: 1, offsetX: 0, offsetY: 0 };

/**
 * A transform whose offsets are LOUD. Points must land at
 * `origin + local * scale`; if an op picks up 999 the origin was applied twice
 * (SESSION17 §2 diagnosis (b)) or the planner called `worldToStage` where it
 * owed `worldToStageLength`.
 */
const LOUD: ViewTransform = { scale: 2, offsetX: 999, offsetY: 999 };

const kinds = (ops: readonly DrawOp[]): string[] => ops.map((op) => op.kind);

/** The single op a one-paint fixture must produce. Throws loudly, never skips. */
function only(ops: readonly DrawOp[]): DrawOp {
  expect(ops).toHaveLength(1);
  const [op] = ops;
  if (op === undefined) throw new Error('planShape returned no ops');
  return op;
}

function onlyStroke(ops: readonly DrawOp[]): StrokeOp {
  const op = only(ops);
  if (op.kind !== 'stroke') throw new Error(`expected a stroke op, got '${op.kind}'`);
  return op;
}

function holed(ops: readonly DrawOp[], index: number): HoledFillOp {
  const op = ops.at(index);
  if (op === undefined) throw new Error(`no op at index ${String(index)} — got ${String(ops.length)} ops`);
  if (op.kind !== 'holedFill') throw new Error(`expected a holedFill op at ${String(index)}, got '${op.kind}'`);
  return op;
}

/**
 * An op's own vertex list. Throws on a packed op rather than reaching for a
 * `flatXY` fallback: every caller below is asserting about art with NO holes, so
 * a packed op arriving here means the plan changed shape, not that the helper
 * needs to be more accommodating.
 */
function pointsOf(op: DrawOp): ReadonlyArray<{ readonly x: number; readonly y: number }> {
  if (op.kind === 'holedFill') throw new Error('pointsOf: expected an unpacked op — this fixture has no holes');
  return op.points;
}

/** A closed square as a flat shape-local ring, [x0,y0,…], 4 vertices. */
const square = (x: number, y: number, size: number): number[] => [x, y, x + size, y, x + size, y + size, x, y + size];

describe('artPlan: paint order (GATE A3-C)', () => {
  it('emits ops in the source paints order, NOT fills-then-strokes', () => {
    // Document order S,F — the shape of the SESSION16 R2 finding: the OG puts a
    // black stroke UNDERNEATH the fills of shape 2662, and hoisting strokes to
    // the top turned 26.2 % of its ink black.
    const strokeUnderFill: ShapeInput = {
      id: 9001,
      paints: [
        { kind: 'stroke', color: 0x000000, width: 1, polylines: [[0, 0, 1, 1]] },
        { kind: 'fill', color: 0xffcc99, rings: [{ points: [0, 0, 1, 0, 1, 1], hole: false }] },
      ],
    };

    expect(kinds(planShape(strokeUnderFill, ORIGIN, VIEW))).toEqual(['stroke', 'fill']);
  });

  it('plans the committed SHAPE_2664 as F,S,S — its own recorded order', () => {
    expect(kinds(planShape(SHAPE_2664, ORIGIN, VIEW))).toEqual(['fill', 'stroke', 'stroke']);
  });

  it('preserves order across an interleaved F,S,F,S shape', () => {
    const interleaved: ShapeInput = {
      id: 9002,
      paints: [
        { kind: 'fill', color: 0x111111, rings: [{ points: [0, 0], hole: false }] },
        { kind: 'stroke', color: 0x222222, width: 1, polylines: [[0, 0]] },
        { kind: 'fill', color: 0x333333, rings: [{ points: [0, 0], hole: false }] },
        { kind: 'stroke', color: 0x444444, width: 1, polylines: [[0, 0]] },
      ],
    };

    expect(planShape(interleaved, ORIGIN, VIEW).map((op) => op.color)).toEqual([
      0x111111, 0x222222, 0x333333, 0x444444,
    ]);
  });
});

describe('artPlan: coordinate transform', () => {
  it('maps shape-local px to stage px as origin + local * scale', () => {
    const shape: ShapeInput = {
      id: 9003,
      paints: [{ kind: 'fill', color: 0x000000, rings: [{ points: [3, -4, 0, 0], hole: false }] }],
    };

    // 300 + 3*2 = 306 · 300 + -4*2 = 292 — and NOT 1305/1291, which is what the
    // transform's offsets would add if a position rule were used for a length.
    expect(pointsOf(only(planShape(shape, ORIGIN, LOUD)))).toEqual([
      { x: 306, y: 292 },
      { x: 300, y: 300 },
    ]);
  });

  it('converts stroke width with the scale ONLY — 1.5 world px is 1.8 stage px at VIEW (D5)', () => {
    const shape: ShapeInput = {
      id: 9004,
      paints: [{ kind: 'stroke', color: 0x000000, width: 1.5, polylines: [[0, 0]] }],
    };

    expect(onlyStroke(planShape(shape, ORIGIN, VIEW)).widthStage).toBeCloseTo(1.8, 10);
  });
});

describe('artPlan: ring and polyline fan-out', () => {
  it('emits one fill op per non-hole ring', () => {
    const twoRings: ShapeInput = {
      id: 9005,
      paints: [
        {
          kind: 'fill',
          color: 0xffcc99,
          rings: [
            { points: [0, 0, 1, 0], hole: false },
            { points: [5, 5, 6, 5], hole: false },
          ],
        },
      ],
    };

    const ops = planShape(twoRings, ORIGIN, VIEW);

    expect(ops).toHaveLength(2);
    expect(ops.every((op) => op.kind === 'fill' && op.color === 0xffcc99)).toBe(true);
  });

  it('emits one stroke op per polyline', () => {
    const twoLines: ShapeInput = {
      id: 9007,
      paints: [
        {
          kind: 'stroke',
          color: 0x000000,
          width: 0.5,
          polylines: [
            [0, 0, 1, 1],
            [4, 4, 5, 5],
          ],
        },
      ],
    };

    expect(planShape(twoLines, ORIGIN, VIEW)).toHaveLength(2);
  });
});

/**
 * GATE A4-A, packing half (SESSION18 A4.1). `core/` may not import Phaser, so
 * the planner does not triangulate — it PACKS, and the scene calls
 * `Phaser.Geom.Polygon.Earcut(flatXY, holeIndices)` on the result (SESSION18 D1).
 * The packing is the half that can be silently wrong: Earcut reads everything
 * before `holeIndices[0]` as the outer ring and every span after it as a hole IN
 * that ring, so pairing a hole with the wrong outer produces a plausible-looking
 * mesh rather than an error.
 *
 * ⚠️ THE KICKOFF'S §P4 RECIPE IS WRONG FOR THE FIGHTER'S OWN TORSO, and this
 * block is where that shows. §P4 says "concatenate THE non-hole ring, then each
 * hole ring" — singular. Converting shape 2646 (torso, slot 15) on 2026-07-27
 * gives its first fill paint **two outer rings and two holes, one hole in each**:
 *   ring0 out  area 153.77  bbox [-9.60,-21.55 .. 9.82,-6.55]
 *   ring1 out  area  58.02  bbox [-1.50, -9.05 .. 8.85,  2.15]
 *   ring2 HOLE area  -4.46  bbox [-7.85,-14.73 .. -4.95,-11.95]   (inside ring0)
 *   ring3 HOLE area  -3.34  bbox [ 2.05, -5.20 ..  4.85, -3.05]   (inside ring1)
 * The singular recipe packs ring0+ring2+ring3 and DROPS ring1 — a hole cut where
 * the torso is solid and a missing slab where it is not. `pairs each hole with
 * the outer ring that CONTAINS it` below is that shape in miniature.
 */
describe('artPlan: hole packing (GATE A4-A, packing half)', () => {
  it('packs an outer ring and its two holes into one op with CUMULATIVE holeIndices', () => {
    const withHoles: ShapeInput = {
      id: 9101,
      paints: [
        {
          kind: 'fill',
          color: 0xffcc99,
          rings: [
            { points: square(0, 0, 20), hole: false },
            { points: [2, 2, 4, 2, 4, 4], hole: true },
            { points: [10, 10, 12, 10, 12, 12], hole: true },
          ],
        },
      ],
    };

    const op = holed(planShape(withHoles, ORIGIN, UNIT), 0);

    // 4 + 3 + 3 vertices, flat: 20 numbers. holeIndices are VERTEX indices, not
    // number indices — Earcut counts vertices, so 8/14 here would be the bug.
    expect(op.flatXY).toHaveLength(20);
    expect(op.holeIndices).toEqual([4, 7]);
    expect(op.color).toBe(0xffcc99);
  });

  it('pairs each hole with the outer ring that CONTAINS it — the real shape 2646 topology', () => {
    // Two disjoint outers, one hole inside each, in the source's own ring order
    // (out, out, hole, hole) — exactly 2646's first fill paint.
    const twoBlobs: ShapeInput = {
      id: 9102,
      paints: [
        {
          kind: 'fill',
          color: 0xfeca98,
          rings: [
            { points: square(0, 0, 10), hole: false },
            { points: square(20, 0, 10), hole: false },
            { points: square(2, 2, 2), hole: true },
            { points: square(22, 2, 2), hole: true },
          ],
        },
      ],
    };

    const ops = planShape(twoBlobs, ORIGIN, UNIT);

    expect(ops).toHaveLength(2);
    // Each op is ONE outer + ONE hole: 8 vertices, 16 numbers, one hole start.
    expect(holed(ops, 0).holeIndices).toEqual([4]);
    expect(holed(ops, 1).holeIndices).toEqual([4]);
    // The hole at 22..24 belongs to the outer at 20..30, NOT to the first outer.
    expect(holed(ops, 1).flatXY.slice(0, 4)).toEqual([320, 300, 330, 300]);
    expect(holed(ops, 1).flatXY.slice(8, 12)).toEqual([322, 302, 324, 302]);
  });

  it('leaves a hole-free outer ring as a plain fill op', () => {
    const mixed: ShapeInput = {
      id: 9103,
      paints: [
        {
          kind: 'fill',
          color: 0x112233,
          rings: [
            { points: square(0, 0, 10), hole: false },
            { points: square(20, 0, 10), hole: false },
            { points: square(22, 2, 2), hole: true },
          ],
        },
      ],
    };

    expect(kinds(planShape(mixed, ORIGIN, UNIT))).toEqual(['fill', 'holedFill']);
  });

  it('routes packed coordinates through the SAME stage transform as every other op', () => {
    const withHole: ShapeInput = {
      id: 9104,
      paints: [
        {
          kind: 'fill',
          color: 0x000000,
          rings: [
            { points: [3, -4, 20, -4, 20, 20, 3, 20], hole: false },
            { points: [4, 1, 5, 1, 5, 2], hole: true },
          ],
        },
      ],
    };

    // 300 + 3*2 = 306 · 300 + -4*2 = 292 — and NOT 1305/1291, which is what
    // LOUD's offsets would add if a position rule were used for a length.
    expect(holed(planShape(withHole, ORIGIN, LOUD), 0).flatXY.slice(0, 2)).toEqual([306, 292]);
  });

  it('throws when a hole ring lies outside EVERY outer ring rather than guessing an owner', () => {
    const orphan: ShapeInput = {
      id: 9105,
      paints: [
        {
          kind: 'fill',
          color: 0x000000,
          rings: [
            { points: square(0, 0, 10), hole: false },
            { points: square(50, 50, 2), hole: true },
          ],
        },
      ],
    };

    expect(() => planShape(orphan, ORIGIN, UNIT)).toThrow(/no outer ring contains/i);
  });

  it('throws when a hole ring lies inside MORE THAN ONE outer ring (island nesting)', () => {
    // Even-odd depth 0/1/2/3: a big blob, a hole in it, an island in the hole,
    // and a hole in the island. The depth-3 ring sits inside both the big blob
    // and the island, so "which outer owns it" has two answers and the innermost
    // rule is not implemented. Fail LOUD (SESSION18 D-A4.1) — a wrong pairing
    // here is a hole punched through solid colour with nothing to see it.
    const nested: ShapeInput = {
      id: 9106,
      paints: [
        {
          kind: 'fill',
          color: 0x000000,
          rings: [
            { points: square(0, 0, 30), hole: false },
            { points: square(5, 5, 20), hole: true },
            { points: square(10, 10, 10), hole: false },
            { points: square(12, 12, 6), hole: true },
          ],
        },
      ],
    };

    expect(() => planShape(nested, ORIGIN, UNIT)).toThrow(/more than one outer ring/i);
  });

  it('keeps the SHAPE_2664 plan hole-free — the A3 render must not change', () => {
    expect(kinds(planShape(SHAPE_2664, ORIGIN, VIEW))).toEqual(['fill', 'stroke', 'stroke']);
  });

  it('inkedBounds measures a packed op from its outer ring', () => {
    const withHole: ShapeInput = {
      id: 9107,
      paints: [
        {
          kind: 'fill',
          color: 0x000000,
          rings: [
            { points: square(0, 0, 10), hole: false },
            { points: square(2, 2, 2), hole: true },
          ],
        },
      ],
    };

    const ops = planShape(withHole, ORIGIN, UNIT);

    // Assert the SHAPE of the plan first: with the A3 skip still in place this
    // box is right for the wrong reason (a plain fill of the same outer ring).
    expect(kinds(ops)).toEqual(['holedFill']);
    expect(inkedBounds(ops)).toEqual({ minX: 300, minY: 300, maxX: 310, maxY: 310 });
  });
});

/**
 * The other half of the Earcut boundary. `Earcut` returns flat VERTEX INDICES,
 * three per triangle, indexing the packed `flatXY` — so turning them back into
 * `fillTriangle`'s six coordinates is index arithmetic, and index arithmetic in
 * a Phaser scene is both unratcheted-literal-bait and untestable by construction
 * (`tests/no-game-imports.test.ts`). It lives here for the same reason the
 * packing does.
 */
describe('artPlan: Earcut index fan-out', () => {
  const SQUARE = [0, 0, 10, 0, 10, 10, 0, 10];

  it('turns index triples into the six coordinates fillTriangle wants', () => {
    expect(trianglesOf(SQUARE, [0, 1, 2, 0, 2, 3])).toEqual([
      [0, 0, 10, 0, 10, 10],
      [0, 0, 10, 10, 0, 10],
    ]);
  });

  it('reads INDICES as vertices, not as positions in the flat array', () => {
    // Index 1 is the vertex (10,0). Treating it as a flat offset would read
    // (0,10) — a mirrored triangle that still renders, which is the whole
    // reason this is a test and not a comment.
    expect(trianglesOf(SQUARE, [0, 1, 2]).at(0)?.slice(2, 4)).toEqual([10, 0]);
  });

  it('throws on an index list that is not whole triangles', () => {
    expect(() => trianglesOf(SQUARE, [0, 1, 2, 0])).toThrow(/triangle/i);
  });

  it('throws on an index pointing past the end of the packed array', () => {
    expect(() => trianglesOf(SQUARE, [0, 1, 9])).toThrow(/range/i);
  });
});

describe('artPlan: fails closed on malformed coordinates', () => {
  it('throws on an odd-length fill ring rather than dropping the last number', () => {
    const odd: ShapeInput = {
      id: 9008,
      paints: [{ kind: 'fill', color: 0x000000, rings: [{ points: [0, 0, 1], hole: false }] }],
    };

    expect(() => planShape(odd, ORIGIN, VIEW)).toThrow(/pair/i);
  });

  it('throws on an odd-length HOLE ring, even though A3 skips holes', () => {
    // Fail-closed (SESSION15 A2): skipping a ring must not also skip validating
    // it, or A4 inherits corrupt coordinates that A3 silently passed over.
    const odd: ShapeInput = {
      id: 9010,
      paints: [
        {
          kind: 'fill',
          color: 0x000000,
          rings: [
            { points: [0, 0, 1, 0, 1, 1], hole: false },
            { points: [2, 2, 3], hole: true },
          ],
        },
      ],
    };

    expect(() => planShape(odd, ORIGIN, VIEW)).toThrow(/pair/i);
  });

  it('throws on an odd-length stroke polyline', () => {
    const odd: ShapeInput = {
      id: 9009,
      paints: [{ kind: 'stroke', color: 0x000000, width: 1, polylines: [[0, 0, 1, 1, 2]] }],
    };

    expect(() => planShape(odd, ORIGIN, VIEW)).toThrow(/pair/i);
  });
});

describe('artPlan: the committed SHAPE_2664 (the shape A3.2 renders)', () => {
  /**
   * Compile-time contract AND runtime proof: `SHAPE_2664` is typed with
   * `src/game/art/types.ts`'s `ArtShape`, which `src/core/` cannot import. If
   * the two declarations ever drift, THIS LINE stops compiling (SESSION17 D-A).
   */
  it('plans the COMMITTED art without a cast (the two-declaration contract)', () => {
    const input: ShapeInput = SHAPE_2664;

    expect(planShape(input, ORIGIN, VIEW)).toHaveLength(3);
  });

  it('carries byte-exact colours: fill 0xffcc99, strokes 0x000000 (GATE A3-B)', () => {
    const ops = planShape(SHAPE_2664, ORIGIN, VIEW);

    expect(ops.map((op) => op.color)).toEqual([0xffcc99, 0x000000, 0x000000]);
  });

  it('carries both stroke widths: 1.5 and 0.5 world px → 1.8 and 0.6 stage px', () => {
    const widths = planShape(SHAPE_2664, ORIGIN, VIEW)
      .filter((op): op is Extract<DrawOp, { kind: 'stroke' }> => op.kind === 'stroke')
      .map((op) => op.widthStage);

    expect(widths[0]).toBeCloseTo(1.8, 10);
    expect(widths[1]).toBeCloseTo(0.6, 10);
  });

  /**
   * GATE A3-A, derived rather than transcribed. A3.2 measures the canvas with
   * the SESSION17 §P2 rule (alpha ≥ 50 %, CSS px, devicePixelRatio 1) and
   * compares against THIS number — so the target the browser is held to is
   * computed by the suite from the data the renderer actually draws, not copied
   * out of a kickoff by hand.
   *
   * INK, not fill: a stroke straddles its path, so each stroke op's box grows by
   * half its width on every side. Measuring the fill polygon instead yields
   * 15.341 × 18.360 — 1.8 px low, which looks exactly like a scale bug and is
   * not (SESSION17 §P2).
   */
  it('has an INKED stage bbox of 17.141 × 20.160 stage px (GATE A3-A)', () => {
    const ops = planShape(SHAPE_2664, ORIGIN, VIEW);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const op of ops) {
      const pad = op.kind === 'stroke' ? op.widthStage / 2 : 0;
      for (const p of pointsOf(op)) {
        minX = Math.min(minX, p.x - pad);
        minY = Math.min(minY, p.y - pad);
        maxX = Math.max(maxX, p.x + pad);
        maxY = Math.max(maxY, p.y + pad);
      }
    }

    expect(maxX - minX).toBeCloseTo(17.1408, 3);
    expect(maxY - minY).toBeCloseTo(20.16, 3);
  });

  /**
   * `inkedBounds` is what the browser probe derives its snapshot region from,
   * so it must agree with the hand-derived figure above. The test above computes
   * the box inline on purpose — two independent paths to the same number, rather
   * than a helper checked against itself.
   */
  it('inkedBounds agrees with the independently-computed A3-A box', () => {
    const bounds = inkedBounds(planShape(SHAPE_2664, ORIGIN, VIEW));

    expect(bounds.maxX - bounds.minX).toBeCloseTo(17.1408, 3);
    expect(bounds.maxY - bounds.minY).toBeCloseTo(20.16, 3);
  });

  it('inkedBounds pads each stroke by HALF its width, not the full width', () => {
    // A whole-width pad would report 18.94 x 21.96 — a "too big" failure that
    // looks like a scale bug and is not.
    const oneStroke: ShapeInput = {
      id: 9011,
      paints: [{ kind: 'stroke', color: 0x000000, width: 10, polylines: [[0, 0, 10, 0]] }],
    };

    const bounds = inkedBounds(planShape(oneStroke, ORIGIN, { scale: 1, offsetX: 0, offsetY: 0 }));

    // A 10-long path stroked 10 wide inks 20 x 10, not 30 x 20.
    expect(bounds.maxX - bounds.minX).toBeCloseTo(20, 10);
    expect(bounds.maxY - bounds.minY).toBeCloseTo(10, 10);
  });

  it('inkedBounds throws on an empty plan rather than returning an infinite box', () => {
    expect(() => inkedBounds([])).toThrow(/empty/i);
  });

  it('has a GEOMETRY-only stage bbox of 15.341 × 18.360 — the number a fill-measurement gives', () => {
    const ops = planShape(SHAPE_2664, ORIGIN, VIEW);
    const xs = ops.flatMap((op) => pointsOf(op).map((p) => p.x));
    const ys = ops.flatMap((op) => pointsOf(op).map((p) => p.y));

    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(15.3408, 3);
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(18.36, 3);
  });
});
