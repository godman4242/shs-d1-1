/**
 * POSE PLANNING (SESSION18 A4.4) — `PosedPart[]` → stage-space `DrawOp[]`.
 *
 * ⚠️ THIS STEP EXISTS BECAUSE `planShape` CANNOT ROTATE. A3 only ever drew one
 * shape at one place, so the planner translates and scales and nothing else. The
 * composed fighter needs every part turned about its OWN joint pivot, and the
 * kickoff's build sequence does not mention it — "reuse `drawPlan`" covers the
 * drawing, not the transform.
 *
 * Rotation is where a composition silently goes wrong, in three distinct ways,
 * and none of them is visible to the silhouette measurement §2 grades with:
 *   - rotating about the STAGE origin instead of the part's pivot → limbs fly
 *     off, but a limb 20 px out still lands inside a generous bbox;
 *   - rotating the WRONG WAY (Flash's y-axis points down, so a positive angle
 *     is clockwise on screen) → the pose mirrors joint by joint;
 *   - rotating AFTER the offset instead of before → every part orbits its
 *     parent, which looks like a slightly-wrong pose rather than a bug.
 * All three are pinned below as negatives.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { composePose } from '../src/core/composePose';
import { inkedBounds } from '../src/core/artPlan';
import { VIEW } from '../src/core/viewport';
import { OG_DRESSED_SLOT_SHAPES, OG_IDLE_NODES, OG_SLOT_ALIASES, OG_SLOT_SHAPES } from '../src/config/ogPose';
import { SHAPE_2644 } from '../src/game/art/generated/shape2644';
import { SHAPE_2646 } from '../src/game/art/generated/shape2646';
import { SHAPE_2648 } from '../src/game/art/generated/shape2648';
import { SHAPE_2650 } from '../src/game/art/generated/shape2650';
import { SHAPE_2653 } from '../src/game/art/generated/shape2653';
import { SHAPE_2655 } from '../src/game/art/generated/shape2655';
import { SHAPE_2658 } from '../src/game/art/generated/shape2658';
import { SHAPE_2664 } from '../src/game/art/generated/shape2664';
import { SHAPE_2667 } from '../src/game/art/generated/shape2667';
import { SHAPE_2670 } from '../src/game/art/generated/shape2670';
import { SHAPE_2672 } from '../src/game/art/generated/shape2672';
import { SHAPE_2674 } from '../src/game/art/generated/shape2674';
import { SHAPE_2676 } from '../src/game/art/generated/shape2676';
import { SHAPE_2678 } from '../src/game/art/generated/shape2678';

import { planPose } from '../src/core/planPose';
import type { PosedPart } from '../src/core/composePose';
import type { DrawOp, ShapeInput } from '../src/core/artPlan';
import type { ViewTransform } from '../src/core/viewport';

/** Scale 1, no offset — a stage coordinate then reads as `origin + local`. */
const UNIT: ViewTransform = { scale: 1, offsetX: 0, offsetY: 0 };
const ORIGIN = { x: 100, y: 200 };

/** A unit arm along +x, so a rotation's effect is unmistakable. */
const ARM: ShapeInput = {
  id: 1,
  paints: [{ kind: 'fill', color: 0x123456, rings: [{ points: [0, 0, 10, 0], hole: false }] }],
};

const part = (over: Partial<PosedPart> = {}): PosedPart => ({
  slot: 0,
  shapeId: 1,
  x: 0,
  y: 0,
  rotationRad: 0,
  ...over,
});

const shapes = (...list: ShapeInput[]): ReadonlyMap<number, ShapeInput> =>
  new Map(list.map((s) => [s.id, s]));

function pointsOf(op: DrawOp): ReadonlyArray<{ readonly x: number; readonly y: number }> {
  if (op.kind === 'holedFill') throw new Error('pointsOf: this fixture has no holes');
  return op.points;
}

const first = (ops: readonly DrawOp[]): DrawOp => {
  const op = ops.at(0);
  if (op === undefined) throw new Error('planPose returned no ops');
  return op;
};

const QUARTER_TURN = Math.PI / 2;

describe('planPose: rotation is about the part pivot (GATE A4-B)', () => {
  it('leaves an unrotated part exactly where planShape would put it', () => {
    const ops = planPose([part()], shapes(ARM), ORIGIN, UNIT);

    expect(pointsOf(first(ops))).toEqual([
      { x: 100, y: 200 },
      { x: 110, y: 200 },
    ]);
  });

  /**
   * Flash's y-axis points DOWN, so a positive `rotation` is CLOCKWISE on screen
   * and (1,0) turns to (0,1). Getting the sign wrong mirrors the pose joint by
   * joint — the fighter still reads as a fighter, which is why this is a test.
   */
  it('turns +90° CLOCKWISE — the arm along +x points DOWN, not up', () => {
    const ops = planPose([part({ rotationRad: QUARTER_TURN })], shapes(ARM), ORIGIN, UNIT);

    const [pivot, tip] = pointsOf(first(ops));

    expect([pivot?.x, pivot?.y]).toEqual([100, 200]);
    expect(tip?.x).toBeCloseTo(100, 10);
    expect(tip?.y).toBeCloseTo(210, 10); // +y is DOWN. 190 would be anticlockwise.
  });

  it('rotates about the PART pivot, not the stage origin — the pivot never moves', () => {
    const spun = planPose([part({ rotationRad: 1.234 })], shapes(ARM), ORIGIN, UNIT);

    // The shape's own (0,0) is its joint. Whatever the angle, it lands on the
    // part anchor. Rotating about the stage origin would fling it away.
    expect(pointsOf(first(spun)).at(0)).toEqual({ x: 100, y: 200 });
  });

  /**
   * ROTATE THEN OFFSET, never the reverse. With the offset applied first the
   * part orbits its parent instead of turning in place: here that is (0,10)
   * versus (10,0) — a 14 px error on a 20 px fighter that still looks like a
   * pose.
   */
  it('rotates BEFORE applying the node offset, so a part turns in place', () => {
    const ops = planPose([part({ x: 10, y: 0, rotationRad: QUARTER_TURN })], shapes(ARM), ORIGIN, UNIT);

    const [pivot, tip] = pointsOf(first(ops));

    expect([pivot?.x, pivot?.y]).toEqual([110, 200]);
    expect(tip?.x).toBeCloseTo(110, 10); // offset-then-rotate gives 100
    expect(tip?.y).toBeCloseTo(210, 10); // offset-then-rotate gives 210 too — the pivot is the tell
  });

  it('scales the node offset into stage px like every other length', () => {
    const view: ViewTransform = { scale: 3, offsetX: 999, offsetY: 999 };

    const ops = planPose([part({ x: 10, y: -20 })], shapes(ARM), ORIGIN, view);

    // 100 + 10*3 = 130 · 200 + -20*3 = 140 — and NOT 1129/1139, which is what
    // the transform's offsets would add if a position rule were used.
    expect(pointsOf(first(ops)).at(0)).toEqual({ x: 130, y: 140 });
  });
});

describe('planPose: the draw list', () => {
  it('emits parts in the order given — the composer already sorted them by slot', () => {
    const a: ShapeInput = { id: 1, paints: [{ kind: 'fill', color: 0xaaaaaa, rings: [{ points: [0, 0], hole: false }] }] };
    const b: ShapeInput = { id: 2, paints: [{ kind: 'fill', color: 0xbbbbbb, rings: [{ points: [0, 0], hole: false }] }] };

    const ops = planPose([part({ shapeId: 1 }), part({ shapeId: 2 })], shapes(a, b), ORIGIN, UNIT);

    expect(ops.map((op) => op.color)).toEqual([0xaaaaaa, 0xbbbbbb]);
  });

  it('preserves each shape\'s own paint order inside its part (GATE A3-C, still)', () => {
    const strokeUnderFill: ShapeInput = {
      id: 1,
      paints: [
        { kind: 'stroke', color: 0x000000, width: 1, polylines: [[0, 0, 1, 1]] },
        { kind: 'fill', color: 0xffcc99, rings: [{ points: [0, 0, 1, 0, 1, 1], hole: false }] },
      ],
    };

    expect(planPose([part()], shapes(strokeUnderFill), ORIGIN, UNIT).map((op) => op.kind)).toEqual([
      'stroke',
      'fill',
    ]);
  });

  it('keeps a holed shape PACKED through the rotation (A4.1 survives A4.4)', () => {
    const holed: ShapeInput = {
      id: 1,
      paints: [
        {
          kind: 'fill',
          color: 0x000000,
          rings: [
            { points: [0, 0, 10, 0, 10, 10, 0, 10], hole: false },
            { points: [2, 2, 4, 2, 4, 4, 2, 4], hole: true },
          ],
        },
      ],
    };

    const ops = planPose([part({ rotationRad: QUARTER_TURN })], shapes(holed), ORIGIN, UNIT);

    expect(ops.map((op) => op.kind)).toEqual(['holedFill']);
    const op = first(ops);
    if (op.kind !== 'holedFill') throw new Error('expected a packed op');
    expect(op.holeIndices).toEqual([4]);
  });

  it('does NOT rotate stroke WIDTHS — a turned limb is not a thicker one', () => {
    const stroked: ShapeInput = {
      id: 1,
      paints: [{ kind: 'stroke', color: 0x000000, width: 2, polylines: [[0, 0, 1, 0]] }],
    };

    const op = first(planPose([part({ rotationRad: 1 })], shapes(stroked), ORIGIN, UNIT));
    if (op.kind !== 'stroke') throw new Error('expected a stroke op');

    expect(op.widthStage).toBeCloseTo(2, 10);
  });
});

describe('planPose: fails closed', () => {
  it('throws on a part whose shape is not supplied, rather than skipping it', () => {
    expect(() => planPose([part({ shapeId: 404 })], shapes(ARM), ORIGIN, UNIT)).toThrow(/404/);
  });

  it('throws on an empty pose rather than returning a plan that draws nothing', () => {
    expect(() => planPose([], shapes(ARM), ORIGIN, UNIT)).toThrow(/empty|no parts/i);
  });
});

/**
 * THE REAL COMPOSED FIGHTER (SESSION18 A4.4) — the numbers the browser is graded
 * against, DERIVED BY THE SUITE rather than transcribed from a console.
 *
 * This is SESSION17's A3-A pattern applied to the whole pose: the `?art=idle`
 * probe reports what the canvas shows, and it is compared against a figure this
 * file computes from the committed art. A number typed into a kickoff by hand
 * cannot grade anything — it can only be agreed with.
 *
 * ⚠️ `src/game/art/fighterShapes.ts` is NOT importable here — `no-game-imports`
 * exempts only `art/types.ts` and `art/generated/`, and widening that exemption
 * to a hand-written file would trade a live guard for convenience. The map is
 * rebuilt from the generated art instead, and a TEXT-level check below keeps the
 * real registry from drifting away from it.
 */
describe('planPose: the committed idle fighter', () => {
  const SHAPES: ReadonlyMap<number, ShapeInput> = new Map(
    [
      SHAPE_2644, SHAPE_2646, SHAPE_2648, SHAPE_2650, SHAPE_2653, SHAPE_2655, SHAPE_2658,
      SHAPE_2664, SHAPE_2667, SHAPE_2670, SHAPE_2672, SHAPE_2674, SHAPE_2676, SHAPE_2678,
    ].map((s) => [s.id, s]),
  );

  const plan = (): DrawOp[] =>
    planPose(composePose(OG_IDLE_NODES, OG_SLOT_SHAPES, OG_SLOT_ALIASES), SHAPES, { x: 0, y: 0 }, VIEW);

  it('plans all 21 parts into 90 draw ops without a missing shape', () => {
    expect(plan()).toHaveLength(90);
  });

  /**
   * GATE A4-A, the packing half, on the REAL pose: the composed idle fighter
   * contains exactly FOUR hole instances — shape 2646 contributes two (its two
   * outer rings each own one) and 2648 contributes one, drawn twice at slots 6
   * and 10. The browser probe runs `Earcut.deviation` over these same four.
   */
  it('carries exactly 4 packed hole instances — 2646 ×2, 2648 ×1 drawn twice', () => {
    const packed = plan().filter((op) => op.kind === 'holedFill');

    expect(packed).toHaveLength(4);
    expect(packed.map((op) => op.flatXY.length / 2).sort((a, b) => a - b)).toEqual([85, 121, 136, 136]);
  });

  /**
   * GATE A4-F. The composed silhouette is **128.16 stage px** tall. §P9's
   * video-derived figure is 143.5 with the kasa and 131.8 without — so this is
   * **2.8 % low**, inside the ±5 % the gate allows.
   */
  it('stands 128.164 stage px tall — within ±5 % of §P9\'s 131.8 (GATE A4-F)', () => {
    const box = inkedBounds(plan());

    expect(box.maxY - box.minY).toBeCloseTo(128.164, 2);
    expect(Math.abs((box.maxY - box.minY) / 131.8 - 1)).toBeLessThan(0.05);
  });

  it('is 52.661 stage px wide, and its origin sits at its FEET', () => {
    const box = inkedBounds(plan());

    expect(box.maxX - box.minX).toBeCloseTo(52.661, 2);
    // Every node offset is negative in y, so the figure builds UPWARD from (0,0).
    expect(box.minY).toBeLessThan(0);
    expect(box.maxY).toBeCloseTo(1.35, 1);
  });

  /**
   * `fighterShapes.ts` cannot be imported here, so it is checked as TEXT — the
   * same technique the provenance gate uses. Without this, the registry the
   * scene actually uses and the slot map that names the parts could drift apart
   * and only a runtime throw would notice.
   *
   * ⚠️ SESSION19 A5.2: BOTH slot maps, not just the bare one. `?art=dressed`
   * draws traced garment art that the bare map never names, and checking only
   * the bare map would let a dressed-only shape go unregistered until the scene
   * threw in the browser. EXACT equality both ways still holds — a registered
   * shape no map names is dead weight, and this caught 9017 the moment it
   * landed.
   */
  it('the real FIGHTER_SHAPES registry names exactly the ids BOTH slot maps need', () => {
    const src = readFileSync(
      path.join(fileURLToPath(new URL('..', import.meta.url)), 'src', 'game', 'art', 'fighterShapes.ts'),
      'utf8',
    );
    const registered = [...src.matchAll(/SHAPE_(\d+),$/gm)].map((m) => Number(m[1])).sort((a, b) => a - b);
    const needed = [...new Set([...OG_SLOT_SHAPES.flat(), ...OG_DRESSED_SLOT_SHAPES.flat()])].sort((a, b) => a - b);

    expect(registered).toEqual(needed);
  });
});
