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
import { inkedBounds, planShape, type DrawOp, type ShapeInput, type StrokeOp } from '../src/core/artPlan';
import { VIEW, type ViewTransform } from '../src/core/viewport';
import { SHAPE_2664 } from '../src/game/art/generated/shape2664';

/** An arbitrary stage anchor — the planner must be origin-agnostic. */
const ORIGIN = { x: 300, y: 300 };

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
    expect(only(planShape(shape, ORIGIN, LOUD)).points).toEqual([
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

  it('SKIPS hole rings — A3 ONLY; A4 must triangulate them via Earcut (SESSION17 P6)', () => {
    const withHole: ShapeInput = {
      id: 9006,
      paints: [
        {
          kind: 'fill',
          color: 0xffcc99,
          rings: [
            { points: [0, 0, 10, 0, 10, 10], hole: false },
            { points: [2, 2, 4, 2, 4, 4], hole: true },
          ],
        },
      ],
    };

    expect(planShape(withHole, ORIGIN, VIEW)).toHaveLength(1);
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
      for (const p of op.points) {
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
    const xs = ops.flatMap((op) => op.points.map((p) => p.x));
    const ys = ops.flatMap((op) => op.points.map((p) => p.y));

    expect(Math.max(...xs) - Math.min(...xs)).toBeCloseTo(15.3408, 3);
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(18.36, 3);
  });
});
