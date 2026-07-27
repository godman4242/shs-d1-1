/**
 * ART PLANNER (SESSION17 A3.1) — `ArtShape` → an ordered list of stage-space
 * draw ops. Pure: no Phaser, no canvas, no side effects.
 *
 * WHY IT LIVES IN `core/` (SESSION17 D2): `tests/no-game-imports.test.ts`
 * forbids a test from reaching `src/game/**` (Phaser crashes the Node worker),
 * so anything written inside a scene is untestable by construction. Paint order
 * is the one property this session's pixels CANNOT check — `SHAPE_2664` is
 * `F S S`, where source order and the fills-then-strokes bug render identically
 * — so it has to be provable in the suite. `tests/artPlan.test.ts` is that
 * proof; `src/core/viewport.ts` is the precedent for render math living here.
 *
 * WHY THE INPUT TYPES ARE RE-DECLARED (SESSION17 D-A): the real declarations are
 * `ArtShape` & co. in `src/game/art/types.ts`, and `core/` may not import them —
 * `tests/config-purity.test.ts` resolves every import, `import type` included.
 * The interfaces below are structurally identical on purpose. What stops them
 * drifting is `plans the COMMITTED art without a cast` in the test file: it
 * assigns the real `SHAPE_2664` to `ShapeInput`, so a divergence fails typecheck.
 */
import { ONE, TWO, ZERO } from '../config/nums';
import type { Vec } from './vec';
import { worldToStageLength, type ViewTransform } from './viewport';

/** A flat [x0,y0,x1,y1,…] contour in shape-local px. `hole` is the even-odd verdict. */
export interface RingInput {
  readonly points: readonly number[];
  readonly hole: boolean;
}

export interface FillInput {
  readonly kind: 'fill';
  readonly color: number;
  readonly rings: readonly RingInput[];
}

export interface StrokeInput {
  readonly kind: 'stroke';
  readonly color: number;
  /** Shape-local (world) px — converted to stage px by the planner, never by hand. */
  readonly width: number;
  readonly polylines: ReadonlyArray<readonly number[]>;
}

export type PaintInput = FillInput | StrokeInput;

export interface ShapeInput {
  readonly id: number;
  /** Source SWF order, back to front. The planner preserves it exactly. */
  readonly paints: readonly PaintInput[];
}

/** One closed polygon to fill, in STAGE px. */
export interface FillOp {
  readonly kind: 'fill';
  readonly color: number;
  readonly points: readonly Vec[];
}

/** One polyline to stroke, in STAGE px, at a STAGE width. */
export interface StrokeOp {
  readonly kind: 'stroke';
  readonly color: number;
  readonly widthStage: number;
  readonly points: readonly Vec[];
}

export type DrawOp = FillOp | StrokeOp;

/**
 * Shape-local px → stage px.
 *
 * A coordinate is a LENGTH from the shape's own pivot, so it converts with
 * `worldToStageLength` (scale only) and picks up the anchor separately. Using
 * `worldToStage` here would add the viewport's 32 px pillarbox offset a second
 * time — SESSION17 §2 diagnosis (b).
 *
 * Throws on a half-finished pair rather than dropping the trailing number:
 * `noUncheckedIndexedAccess` makes the missing `y` visible, and coercing it to
 * zero would fold a corrupt contour onto the origin instead of reporting it.
 */
function toStagePoints(flat: readonly number[], origin: Vec, view: ViewTransform): Vec[] {
  const points: Vec[] = [];
  for (let i = ZERO; i < flat.length; i += TWO) {
    const x = flat[i];
    const y = flat[i + ONE];
    if (x === undefined || y === undefined) {
      throw new Error(`artPlan: coordinate array must hold whole x,y pairs — got ${String(flat.length)} numbers`);
    }
    points.push({
      x: origin.x + worldToStageLength(x, view),
      y: origin.y + worldToStageLength(y, view),
    });
  }
  return points;
}

/**
 * Plan `shape` with its local origin anchored at the stage position `origin`.
 *
 * ⚠️ HOLE RINGS ARE SKIPPED — A3 ONLY. `SHAPE_2664` has none (SESSION17 P6), so
 * nothing this session draws is affected. A4 must replace the skip with a real
 * `Phaser.Geom.Polygon.Earcut` triangulation, checked with `Earcut.deviation`.
 */
export function planShape(shape: ShapeInput, origin: Vec, view: ViewTransform): DrawOp[] {
  const ops: DrawOp[] = [];
  for (const paint of shape.paints) {
    if (paint.kind === 'fill') {
      for (const ring of paint.rings) {
        // Validate BEFORE the skip: a ring we do not draw must still not be a
        // ring we failed to check (fail-closed, SESSION15 A2).
        const points = toStagePoints(ring.points, origin, view);
        if (ring.hole) continue;
        ops.push({ kind: 'fill', color: paint.color, points });
      }
      continue;
    }
    const widthStage = worldToStageLength(paint.width, view);
    for (const polyline of paint.polylines) {
      ops.push({ kind: 'stroke', color: paint.color, widthStage, points: toStagePoints(polyline, origin, view) });
    }
  }
  return ops;
}
