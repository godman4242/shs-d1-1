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

/**
 * Turn a flat `[x0,y0,…]` contour about the origin; `mirrored` then reflects
 * the TURNED point across the pivot's vertical axis (SESSION23 A11.2).
 *
 * The order matters and is the whole mirror contract: reflect-after-rotate is
 * `M·R(θ)·p`, which together with the negated node offset in `planPose` makes
 * the finished figure the exact x-reflection of the unmirrored one about the
 * fighter's anchor — what `tests/a11Mirror.test.ts` pins op by op. Negating
 * the angle instead (`R(−θ)`) without flipping the art is the P4 double-flip
 * trap: the branch would come out wrong in exactly one facing.
 */
function rotateFlat(flat: readonly number[], cos: number, sin: number, mirrored: boolean): number[] {
  const out: number[] = [];
  for (let i = ZERO; i < flat.length; i += TWO) {
    const x = flat[i];
    const y = flat[i + ONE];
    if (x === undefined || y === undefined) {
      throw new Error(`planPose: coordinate array must hold whole x,y pairs — got ${String(flat.length)} numbers`);
    }
    const rx = x * cos - y * sin;
    out.push(mirrored ? -rx : rx, x * sin + y * cos);
  }
  return out;
}

/**
 * The same shape with every coordinate turned about its pivot.
 *
 * Stroke WIDTHS are copied untouched — turning a limb does not thicken it — and
 * the `hole` verdicts survive because rotation preserves nesting exactly, so
 * A4.1's packing still pairs each hole with the same outer ring.
 */
function rotateShape(shape: ShapeInput, rotationRad: number, mirrored: boolean): ShapeInput {
  const cos = Math.cos(rotationRad);
  const sin = Math.sin(rotationRad);

  const paints: PaintInput[] = shape.paints.map((paint) =>
    paint.kind === 'fill'
      ? {
          kind: 'fill',
          color: paint.color,
          rings: paint.rings.map((ring) => ({ points: rotateFlat(ring.points, cos, sin, mirrored), hole: ring.hole })),
        }
      : {
          kind: 'stroke',
          color: paint.color,
          width: paint.width,
          polylines: paint.polylines.map((line) => rotateFlat(line, cos, sin, mirrored)),
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
    // `rotateFlat` plus this sign is the complete mirror (nothing else moves).
    const mirrored = part.mirrored === true;
    const anchor: Vec = {
      x: origin.x + worldToStageLength(mirrored ? -part.x : part.x, view),
      y: origin.y + worldToStageLength(part.y, view),
    };
    ops.push(...planShape(rotateShape(shape, part.rotationRad, mirrored), anchor, view));
  }
  return ops;
}
