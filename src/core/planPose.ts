/**
 * POSE PLANNING (SESSION18 A4.4) — a composed `PosedPart[]` → one ordered
 * stage-space `DrawOp[]`. Pure: no Phaser, no canvas, no state.
 *
 * ⚠️ WHY THIS EXISTS AT ALL: `planShape` CANNOT ROTATE. A3 drew one shape at one
 * fixed place, so the planner only ever translated and scaled. A composed
 * fighter needs every part turned about its own joint pivot, and the kickoff's
 * A4.4 step does not mention it — "reuse `drawPlan`" covers the drawing, not the
 * transform. Rather than growing `planShape` a fourth parameter that the A3
 * route would always pass as zero, the rotation is applied to the shape's own
 * LOCAL coordinates and the existing planner does the rest unchanged.
 *
 * THE TRANSFORM, in the order it must happen:
 *   1. rotate each shape-local point about (0,0) — the part's joint pivot;
 *   2. add the node's `(x, y)`, in the fighter's own pixel space;
 *   3. scale into stage px and add the fighter's stage anchor.
 * Steps 2 and 3 are `planShape`'s existing job, because `worldToStageLength` is
 * linear: `origin + (rotate(p) + node) * scale` is the same point as
 * `(origin + node * scale) + rotate(p) * scale`. Only step 1 is new.
 *
 * ⚠️ FLASH'S Y-AXIS POINTS DOWN, so a positive `rotation` is CLOCKWISE on screen
 * and the standard matrix below is already the right one — no sign flip. Getting
 * that wrong mirrors the pose joint by joint and still reads as a fighter.
 */
import { ONE, TWO, ZERO } from '../config/nums';
import { planShape, type DrawOp, type PaintInput, type ShapeInput } from './artPlan';
import type { PosedPart } from './composePose';
import type { Vec } from './vec';
import { worldToStageLength, type ViewTransform } from './viewport';

/** The 2×2 half of a Flash matrix: x' = a·x + c·y, y' = b·x + d·y. */
interface Mat2 {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
}

/**
 * Transform a flat `[x0,y0,…]` contour about the origin; `mirrored` then
 * reflects the TRANSFORMED point across the pivot's vertical axis
 * (SESSION23 A11.2/A11.4 — rotation is just the matrix [cos, sin, −sin, cos],
 * so both recorded node forms share this ONE site).
 *
 * The order matters and is the whole mirror contract: reflect-after-transform
 * is `M·A·p`, which together with the negated node offset in `planPose` makes
 * the finished figure the exact x-reflection of the unmirrored one about the
 * fighter's anchor — what `tests/a11Mirror.test.ts` pins op by op. Negating
 * the angle instead (`R(−θ)`) without flipping the art is the P4 double-flip
 * trap: the branch would come out wrong in exactly one facing.
 */
function transformFlat(flat: readonly number[], m: Mat2, mirrored: boolean): number[] {
  const out: number[] = [];
  for (let i = ZERO; i < flat.length; i += TWO) {
    const x = flat[i];
    const y = flat[i + ONE];
    if (x === undefined || y === undefined) {
      throw new Error(`planPose: coordinate array must hold whole x,y pairs — got ${String(flat.length)} numbers`);
    }
    const tx = x * m.a + y * m.c;
    out.push(mirrored ? -tx : tx, x * m.b + y * m.d);
  }
  return out;
}

/**
 * The same shape with every coordinate transformed about its pivot.
 *
 * Stroke WIDTHS are copied untouched — turning a limb does not thicken it, and
 * A11.4 keeps the same rule for matrix nodes (the recorded swings scale the
 * weapon's GEOMETRY; whether the OG also scaled stroke widths is a LOOK
 * question, deferred with the videos as judge). The `hole` verdicts survive
 * because an affine map preserves nesting, so A4.1's packing still pairs each
 * hole with the same outer ring.
 */
function transformShape(shape: ShapeInput, m: Mat2, mirrored: boolean): ShapeInput {
  const paints: PaintInput[] = shape.paints.map((paint) =>
    paint.kind === 'fill'
      ? {
          kind: 'fill',
          color: paint.color,
          rings: paint.rings.map((ring) => ({ points: transformFlat(ring.points, m, mirrored), hole: ring.hole })),
        }
      : {
          kind: 'stroke',
          color: paint.color,
          width: paint.width,
          polylines: paint.polylines.map((line) => transformFlat(line, m, mirrored)),
        },
  );
  return { id: shape.id, paints };
}

/**
 * Plan every part of a composed pose, in the order given.
 *
 * `parts` arrives from `composePose` already sorted by slot, which IS the SWF's
 * creation order and therefore the back-to-front draw order — so this function
 * does not sort, and must not: re-sorting here would quietly become a second
 * opinion on z-order.
 *
 * Throws on a missing shape and on an empty pose. A pose that silently drops a
 * part renders as a missing limb, which SESSION15 §2 diagnosis (b) says costs
 * hours of looking in the wrong place.
 */
export function planPose(
  parts: readonly PosedPart[],
  shapes: ReadonlyMap<number, ShapeInput>,
  origin: Vec,
  view: ViewTransform,
): DrawOp[] {
  if (parts.length === ZERO) throw new Error('planPose: empty pose — no parts to draw');

  const ops: DrawOp[] = [];
  for (const part of parts) {
    const shape = shapes.get(part.shapeId);
    if (shape === undefined) {
      throw new Error(`planPose: slot ${String(part.slot)} needs shape ${String(part.shapeId)}, which was not supplied`);
    }
    // A mirrored part reflects its node offset too — the art flip in
    // `transformFlat` plus this sign is the complete mirror (nothing else moves).
    const mirrored = part.mirrored === true;
    const anchor: Vec = {
      x: origin.x + worldToStageLength(mirrored ? -part.x : part.x, view),
      y: origin.y + worldToStageLength(part.y, view),
    };
    // Both recorded transform forms, one code path: a rotation IS the matrix
    // [cos, sin, −sin, cos]. composePose guarantees exactly one form per part.
    let m: Mat2;
    if (part.rotationRad !== undefined) {
      const cos = Math.cos(part.rotationRad);
      const sin = Math.sin(part.rotationRad);
      m = { a: cos, b: sin, c: -sin, d: cos };
    } else if (
      part.a !== undefined && part.b !== undefined && part.c !== undefined && part.d !== undefined
    ) {
      m = { a: part.a, b: part.b, c: part.c, d: part.d };
    } else {
      throw new Error(`planPose: slot ${String(part.slot)} carries neither a rotation nor a full matrix`);
    }
    ops.push(...planShape(transformShape(shape, m, mirrored), anchor, view));
  }
  return ops;
}
