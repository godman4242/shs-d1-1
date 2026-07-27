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
import { TRIANGLE_VERTS } from '../config/art';
import { HALF, ONE, TWO, ZERO } from '../config/nums';
import { ringContains } from './ringGeometry';
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

/**
 * One polygon WITH HOLES, in STAGE px, packed for `Phaser.Geom.Polygon.Earcut`.
 *
 * The planner packs; the scene triangulates (SESSION18 D1). `core/` may import
 * no packages, so Earcut cannot be called here — but the packing is the half
 * that can be SILENTLY wrong, and this is the folder a test can reach. Earcut
 * reads everything before `holeIndices[0]` as the outer ring and every span
 * after it as a hole IN that ring, so a hole paired with the wrong outer yields
 * a plausible mesh rather than an error.
 */
export interface HoledFillOp {
  readonly kind: 'holedFill';
  readonly color: number;
  /** Flat [x0,y0,…]: the outer ring, then each of ITS hole rings, in ring order. */
  readonly flatXY: readonly number[];
  /** Earcut's `holeIndices` — the VERTEX index each hole ring starts at. */
  readonly holeIndices: readonly number[];
}

export type DrawOp = FillOp | StrokeOp | HoledFillOp;

/** Bounds-checked index read — `noUncheckedIndexedAccess` makes it explicit. */
function at<T>(items: readonly T[], i: number): T {
  const item = items[i];
  if (item === undefined) throw new Error(`artPlan: index ${String(i)} out of range`);
  return item;
}

/** `Vec[]` → the flat `[x0,y0,x1,y1,…]` Earcut reads. */
function flatten(points: readonly Vec[]): number[] {
  return points.flatMap((p) => [p.x, p.y]);
}

/** The inverse — for measuring a packed op without unpacking its hole spans. */
function unflatten(flat: readonly number[]): Vec[] {
  const points: Vec[] = [];
  for (let i = ZERO; i < flat.length; i += TWO) {
    points.push({ x: at(flat, i), y: at(flat, i + ONE) });
  }
  return points;
}

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
 * Which outer ring owns each hole ring of one fill paint.
 *
 * ⚠️ THE KICKOFF'S §P4 RECIPE — "concatenate THE non-hole ring, then each hole
 * ring" — IS WRONG FOR THE FIGHTER'S OWN TORSO. Shape 2646's first fill paint
 * carries TWO outer rings and TWO holes, one hole inside each outer (measured
 * 2026-07-27). Packing all the holes against the first outer both cuts a hole
 * where the torso is solid and drops the second outer entirely.
 *
 * Containment is decided on the SHAPE-LOCAL points by `ringContains` — the very
 * function the converter used to set `ring.hole`, so the two verdicts cannot
 * drift. Local vs stage makes no difference: the view transform is a uniform
 * scale plus a translation, which preserves nesting exactly.
 *
 * Both failure modes throw rather than guess (SESSION18 D-A4.1): a mis-owned
 * hole is a hole punched through solid colour, and no gate in this session's
 * silhouette-based bar can see one.
 */
function ownerOfHole(shapeId: number, hole: RingInput, outers: ReadonlyArray<{ ring: RingInput }>): number {
  const owners: number[] = [];
  outers.forEach((outer, i) => {
    if (ringContains(outer.ring.points, hole.points)) owners.push(i);
  });

  const owner = owners.at(ZERO);
  if (owner === undefined) {
    throw new Error(`artPlan: no outer ring contains a hole ring in shape ${String(shapeId)}`);
  }
  if (owners.length > ONE) {
    throw new Error(
      `artPlan: a hole ring lies inside more than one outer ring in shape ${String(shapeId)} — ` +
        'innermost-wins pairing is not implemented (SESSION18 D-A4.1)',
    );
  }
  return owner;
}

/**
 * Plan `shape` with its local origin anchored at the stage position `origin`.
 *
 * Hole rings are PACKED, not skipped (SESSION18 A4.1): each outer ring that owns
 * holes becomes one `holedFill` op the scene hands to Earcut; every other outer
 * ring stays a plain `fill`, so a shape without holes plans exactly as it did in
 * A3 and the `?art=og` render does not move.
 */
export function planShape(shape: ShapeInput, origin: Vec, view: ViewTransform): DrawOp[] {
  const ops: DrawOp[] = [];
  for (const paint of shape.paints) {
    if (paint.kind === 'fill') {
      // Transform EVERY ring first, holes included: this is where a malformed
      // contour throws, and a ring we pack must not be a ring we failed to
      // check (fail-closed, SESSION15 A2).
      const staged = paint.rings.map((ring) => toStagePoints(ring.points, origin, view));
      const outers = paint.rings
        .map((ring, i) => ({ ring, points: at(staged, i), holes: [] as Array<readonly Vec[]> }))
        .filter((o) => !o.ring.hole);

      paint.rings.forEach((ring, i) => {
        if (!ring.hole) return;
        const owner = ownerOfHole(shape.id, ring, outers);
        at(outers, owner).holes.push(at(staged, i));
      });

      for (const outer of outers) {
        if (outer.holes.length === ZERO) {
          ops.push({ kind: 'fill', color: paint.color, points: outer.points });
          continue;
        }
        const flatXY: number[] = [...flatten(outer.points)];
        const holeIndices: number[] = [];
        for (const hole of outer.holes) {
          holeIndices.push(flatXY.length / TWO);
          flatXY.push(...flatten(hole));
        }
        ops.push({ kind: 'holedFill', color: paint.color, flatXY, holeIndices });
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

/** One triangle's six stage-px coordinates, as `Graphics.fillTriangle` takes them. */
export type Triangle = readonly [number, number, number, number, number, number];

/**
 * `Earcut`'s flat index triples → drawable triangles.
 *
 * The indices are VERTEX indices into the packed array, so vertex `v` lives at
 * `flatXY[2v]`/`flatXY[2v+1]`. Treating one as a flat offset instead still
 * produces triangles — mirrored, subtly wrong ones — which is why this is here,
 * in the folder a test can reach, rather than inline in the scene where
 * `tests/no-game-imports.test.ts` puts it out of reach.
 */
export function trianglesOf(flatXY: readonly number[], indices: readonly number[]): Triangle[] {
  if (indices.length % TRIANGLE_VERTS !== ZERO) {
    throw new Error(`artPlan: ${String(indices.length)} indices is not a whole number of triangles`);
  }
  const vertex = (v: number): readonly [number, number] => [at(flatXY, v * TWO), at(flatXY, v * TWO + ONE)];

  const out: Triangle[] = [];
  for (let i = ZERO; i < indices.length; i += TRIANGLE_VERTS) {
    out.push([
      ...vertex(at(indices, i)),
      ...vertex(at(indices, i + ONE)),
      ...vertex(at(indices, i + TWO)),
    ]);
  }
  return out;
}

/** An axis-aligned box in stage px. */
export interface Bounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

/**
 * The INKED extent of a plan — the box a screenshot actually shows.
 *
 * A stroke straddles its path, so each stroke op grows by HALF its width on
 * every side; a fill stops at its polygon. Measuring the fill polygon instead
 * gives 15.341 × 18.360 for `SHAPE_2664` against an inked 17.141 × 20.160 —
 * 1.8 px low, which looks exactly like a scale bug and is not (SESSION17 §P2).
 *
 * Throws on an empty plan: the alternative is a box built from ±Infinity, which
 * propagates as NaN into whatever measures against it.
 */
export function inkedBounds(ops: readonly DrawOp[]): Bounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const op of ops) {
    const pad = op.kind === 'stroke' ? op.widthStage * HALF : ZERO;
    // A packed op's hole rings lie inside its outer ring, so measuring the whole
    // flat array gives the same box as measuring the outer alone — and does it
    // without this function having to know which span is which.
    const vertices = op.kind === 'holedFill' ? unflatten(op.flatXY) : op.points;
    for (const p of vertices) {
      minX = Math.min(minX, p.x - pad);
      minY = Math.min(minY, p.y - pad);
      maxX = Math.max(maxX, p.x + pad);
      maxY = Math.max(maxY, p.y + pad);
    }
  }

  if (!Number.isFinite(minX) || !Number.isFinite(minY)) {
    throw new Error('inkedBounds: empty plan — nothing to measure');
  }
  return { minX, minY, maxX, maxY };
}
