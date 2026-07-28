/**
 * GATE A11-B — MIRRORING IS A COMPOSE-TIME TRANSFORM (SESSION23 A11.2).
 *
 * Kickoff D3: one shape set, one pose table, a mirror FLAG in core — never a
 * second art set and never a scene-side `scaleX` hack. The flag rides
 * `composePose` (API surface); every piece of mirror MATH lives in `planPose`
 * (single site), because split mirror math is how a figure gets flipped twice.
 *
 * Kickoff P4 (the trap this file exists for): the branch's facing override is
 * ITSELF a horizontal mirror of the recorded values (`142 = 180 − 38`,
 * SESSION22 A9.6) — so a mirrored fighter must flip it BACK, and arguing about
 * rotation conventions (−38° vs 142°) is exactly where a double-flip hides.
 * This file refuses the numerology: it pins that the ENTIRE mirrored plan is
 * the exact x-reflection of the unmirrored plan about the anchor's vertical
 * axis — every op, every coordinate, colors, widths and z-order unchanged.
 * The branch cannot be wrong in either facing if the whole reflection is
 * exact; which facing the DUEL then shows is the browser LOOK's job.
 */
import { describe, expect, it } from 'vitest';
import { OG_DRESSED_NODES, OG_DRESSED_SLOT_SHAPES, OG_SLOT_ALIASES } from '../src/config/ogPose';
import type { DrawOp, ShapeInput } from '../src/core/artPlan';
import { composePose } from '../src/core/composePose';
import { planPose } from '../src/core/planPose';
import { VIEW } from '../src/core/viewport';
import { SHAPE_2641 } from '../src/game/art/generated/shape2641';
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
import { SHAPE_9001 } from '../src/game/art/generated/shape9001';
import { SHAPE_9011 } from '../src/game/art/generated/shape9011';
import { SHAPE_9012 } from '../src/game/art/generated/shape9012';
import { SHAPE_9014 } from '../src/game/art/generated/shape9014';
import { SHAPE_9015 } from '../src/game/art/generated/shape9015';
import { SHAPE_9017 } from '../src/game/art/generated/shape9017';
import { SHAPE_9019 } from '../src/game/art/generated/shape9019';

/** Rebuilt from the generated art — the same pure-data path as poseRender.test.ts. */
const SHAPES: ReadonlyMap<number, ShapeInput> = new Map(
  [
    SHAPE_2641, SHAPE_2644, SHAPE_2646, SHAPE_2648, SHAPE_2650, SHAPE_2653, SHAPE_2655, SHAPE_2658,
    SHAPE_2664, SHAPE_2667, SHAPE_2670, SHAPE_2672, SHAPE_2674, SHAPE_2676, SHAPE_2678,
    SHAPE_9001, SHAPE_9011, SHAPE_9012, SHAPE_9014, SHAPE_9015, SHAPE_9017, SHAPE_9019,
  ].map((s) => [s.id, s]),
);

const ORIGIN = { x: 260, y: 489.6 };

/** Every x-coordinate an op carries, reflected about `axisX`; y untouched. */
function assertOpsMirrored(base: readonly DrawOp[], mirrored: readonly DrawOp[], axisX: number): void {
  expect(mirrored.length).toBe(base.length);
  base.forEach((b, i) => {
    const m = mirrored[i];
    if (m === undefined) throw new Error('length already asserted');
    expect(m.kind).toBe(b.kind);
    expect(m.color).toBe(b.color);
    if (b.kind === 'holedFill' && m.kind === 'holedFill') {
      expect(m.holeIndices).toEqual(b.holeIndices);
      expect(m.flatXY.length).toBe(b.flatXY.length);
      for (let j = 0; j < b.flatXY.length; j += 2) {
        expect(m.flatXY[j]).toBeCloseTo(2 * axisX - (b.flatXY[j] ?? NaN), 6);
        expect(m.flatXY[j + 1]).toBeCloseTo(b.flatXY[j + 1] ?? NaN, 6);
      }
      return;
    }
    if ((b.kind === 'fill' && m.kind === 'fill') || (b.kind === 'stroke' && m.kind === 'stroke')) {
      if (b.kind === 'stroke' && m.kind === 'stroke') expect(m.widthStage).toBeCloseTo(b.widthStage, 6);
      expect(m.points.length).toBe(b.points.length);
      b.points.forEach((p, j) => {
        expect(m.points[j]?.x).toBeCloseTo(2 * axisX - p.x, 6);
        expect(m.points[j]?.y).toBeCloseTo(p.y, 6);
      });
      return;
    }
    throw new Error(`op ${String(i)}: kinds diverged after the kind assertion — impossible`);
  });
}

describe('A11-B — the mirror flag on composePose', () => {
  const base = composePose(OG_DRESSED_NODES, OG_DRESSED_SLOT_SHAPES, OG_SLOT_ALIASES);
  const mir = composePose(OG_DRESSED_NODES, OG_DRESSED_SLOT_SHAPES, OG_SLOT_ALIASES, true);

  it('tags every part mirrored and changes NOTHING else — geometry stays recorded', () => {
    expect(mir.length).toBe(base.length);
    base.forEach((b, i) => {
      const m = mir[i];
      expect(m?.slot).toBe(b.slot);
      expect(m?.shapeId).toBe(b.shapeId);
      expect(m?.x).toBe(b.x);
      expect(m?.y).toBe(b.y);
      expect(m?.rotationRad).toBe(b.rotationRad);
      expect(m?.mirrored).toBe(true);
    });
  });

  it('defaults to unmirrored, so every existing caller keeps its exact output', () => {
    base.forEach((b) => {
      expect(b.mirrored ?? false).toBe(false);
    });
  });
});

describe('A11-B — planPose mirror math: exact x-reflection about the anchor axis', () => {
  it('a deliberately asymmetric synthetic part reflects exactly (fill + stroke + rotation)', () => {
    // An L-shape so any axis confusion (y-flip, double-flip, pivot drift)
    // breaks the reflection instead of hiding in symmetry.
    const lShape: ShapeInput = {
      id: 7,
      paints: [
        { kind: 'fill', color: 0x123456, rings: [{ points: [0, 0, 20, 0, 20, 4, 4, 4, 4, 12, 0, 12], hole: false }] },
        { kind: 'stroke', color: 0x654321, width: 2, polylines: [[0, 0, 20, 0, 20, 4]] },
      ],
    };
    const shapes = new Map<number, ShapeInput>([[7, lShape]]);
    const node = { slot: 0, shapeId: 7, x: 10, y: -5, rotationRad: 0.3 };
    const basePlan = planPose([node], shapes, ORIGIN, VIEW);
    const mirPlan = planPose([{ ...node, mirrored: true }], shapes, ORIGIN, VIEW);
    expect(basePlan.length).toBeGreaterThan(0);
    assertOpsMirrored(basePlan, mirPlan, ORIGIN.x);
  });

  it('THE REAL FIGHTER reflects exactly — branch, garments, all 21 parts, z-order intact (P4)', () => {
    const base = composePose(OG_DRESSED_NODES, OG_DRESSED_SLOT_SHAPES, OG_SLOT_ALIASES);
    const mir = composePose(OG_DRESSED_NODES, OG_DRESSED_SLOT_SHAPES, OG_SLOT_ALIASES, true);
    const basePlan = planPose(base, SHAPES, ORIGIN, VIEW);
    const mirPlan = planPose(mir, SHAPES, ORIGIN, VIEW);
    expect(basePlan.length).toBe(103); // the committed dressed plan size (a11DuelFighter probe)
    assertOpsMirrored(basePlan, mirPlan, ORIGIN.x);
  });
});
