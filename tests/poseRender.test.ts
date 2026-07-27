/**
 * THE REAL FIGHTER, RASTERISED (SESSION20 A6.1) — the gate that makes the
 * headless render trustworthy enough to measure against.
 *
 * ⛔ WHY THIS FILE EXISTS, AND IT IS AN ADMISSION. A6.1 first shipped with its
 * tests entirely on synthetic 2–4-op scenes, on the stated belief that a test
 * could not reach the real plan because `tests/no-game-imports.test.ts` forbids
 * importing `src/game/art/fighterShapes.ts`. **That belief was wrong**, and an
 * adversarial review proved it by pointing at `tests/planPose.test.ts`, which has
 * built the real 90-op idle plan inside the suite since SESSION 18 — the
 * `art/generated/**` pure-data carve-out allows exactly this. The map is rebuilt
 * from the generated art here for the same reason it is rebuilt there, and that
 * file's own `the real FIGHTER_SHAPES registry names exactly the ids BOTH slot
 * maps need` test is what stops the two from drifting.
 *
 * WHAT THE OLD, SMALLER TESTS COULD NOT SEE — each of these mutations passed the
 * whole 46-file suite, typecheck and lint, and each was caught only when this
 * file landed:
 *   - swapping `slotMapFor`'s ternary, so `dressed` renders the BARE fighter and
 *     every A6 measurement is taken of the wrong figure;
 *   - `if (ops.length > 40) continue` in the stroke branch, which deletes all 16
 *     strokes on the dressed plan and all 41 on the idle one — a fighter with no
 *     outlines at all;
 *   - shifting the sub-pixel sample from the centre to the corner, which moves
 *     the whole silhouette by an eighth of a pixel in one axis;
 *   - `Math.floor` → `Math.round` in the crop, which moves the frame by 1 px.
 * A gate that only ever sees a 20×20 test rectangle sees none of them.
 */
import { describe, expect, it } from 'vitest';
import { OG_IDLE_STAGE } from '../src/config/art';
import { OG_DRESSED_SLOT_SHAPES, OG_SLOT_SHAPES } from '../src/config/ogPose';
import type { ShapeInput } from '../src/core/artPlan';
import { rasterDigest } from '../scripts/art/rasterise';
import { assertBackdropIsNotArt, cropRegion, renderPoseWith, slotMapFor } from '../scripts/art/poseScene';
import { DEFAULT_BACKDROP, DEFAULT_SUPERSAMPLE } from '../scripts/art/renderPoseArgs';
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

/** Rebuilt from the generated art — see the header, and `tests/planPose.test.ts`. */
const SHAPES: ReadonlyMap<number, ShapeInput> = new Map(
  [
    SHAPE_2644, SHAPE_2646, SHAPE_2648, SHAPE_2650, SHAPE_2653, SHAPE_2655, SHAPE_2658,
    SHAPE_2664, SHAPE_2667, SHAPE_2670, SHAPE_2672, SHAPE_2674, SHAPE_2676, SHAPE_2678,
    SHAPE_9001, SHAPE_9011, SHAPE_9012, SHAPE_9014, SHAPE_9015, SHAPE_9017, SHAPE_9019,
  ].map((s) => [s.id, s]),
);

const render = (variant: 'idle' | 'dressed'): ReturnType<typeof renderPoseWith> =>
  renderPoseWith(variant, SHAPES, { backdrop: DEFAULT_BACKDROP, supersample: DEFAULT_SUPERSAMPLE });

/** How many of each op kind the plan carries — a stroke that vanishes shows here. */
function census(ops: ReturnType<typeof renderPoseWith>['plan']): Record<string, number> {
  const out: Record<string, number> = { fill: 0, stroke: 0, holedFill: 0 };
  for (const op of ops) out[op.kind] = (out[op.kind] ?? 0) + 1;
  return out;
}

describe('slotMapFor — which fighter a variant actually selects', () => {
  it('maps dressed to the TRACED slot map and idle to the BARE one', () => {
    // Swapping this ternary renders the wrong fighter with a fully green suite.
    expect(slotMapFor('dressed')).toBe(OG_DRESSED_SLOT_SHAPES);
    expect(slotMapFor('idle')).toBe(OG_SLOT_SHAPES);
  });

  it('the two maps are genuinely different — dressed names traced ids, idle names none', () => {
    const traced = (map: ReadonlyArray<readonly number[]>): number[] =>
      map.flat().filter((id) => id >= 9000);
    expect(new Set(traced(OG_DRESSED_SLOT_SHAPES))).toEqual(new Set([9001, 9011, 9012, 9014, 9015, 9017, 9019]));
    expect(traced(OG_SLOT_SHAPES)).toEqual([]);
  });
});

describe('cropRegion — the frame the fighter is rendered into', () => {
  it('floors the near edge and ceils the far one, so the ink can never be clipped', () => {
    expect(cropRegion({ minX: 10.2, minY: 20.8, maxX: 30.4, maxY: 50.1 }, 4)).toEqual({
      x: 6,
      y: 16,
      width: 29, // ceil(34.4) - 6
      height: 39, // ceil(54.1) - 16
    });
  });

  it('is exact when the ink and pad are already whole', () => {
    expect(cropRegion({ minX: 10, minY: 20, maxX: 30, maxY: 50 }, 5)).toEqual({ x: 5, y: 15, width: 30, height: 40 });
  });
});

describe('the REAL composed fighter, rasterised', () => {
  it('dressed: 20 parts, 55 draw ops, with all 16 of its strokes', () => {
    const r = render('dressed');
    expect(r.parts).toHaveLength(20);
    expect(r.plan).toHaveLength(55);
    expect(census(r.plan)).toEqual({ fill: 37, stroke: 16, holedFill: 2 });
  });

  it('idle: 21 parts, 90 draw ops, with all 41 of its strokes', () => {
    const r = render('idle');
    expect(r.parts).toHaveLength(21);
    expect(r.plan).toHaveLength(90);
    expect(census(r.plan)).toEqual({ fill: 45, stroke: 41, holedFill: 4 });
  });

  it('lands where SESSION 18 and the kickoff §P6 measured it, to 0.1 stage px', () => {
    const dressed = render('dressed').ink;
    expect([dressed.minX, dressed.maxX, dressed.minY, dressed.maxY].map((n) => Number(n.toFixed(1)))).toEqual([
      474.9, 538.9, 290.9, 431.4,
    ]);
    // SESSION 18 A4-F recorded the bare plan as 52.661 x 128.164 stage px.
    const idle = render('idle').ink;
    expect(idle.maxX - idle.minX).toBeCloseTo(52.661, 2);
    expect(idle.maxY - idle.minY).toBeCloseTo(128.164, 2);
  });

  it('crops to the frames the CLI reports', () => {
    expect(render('dressed').region).toEqual({ x: 450, y: 266, width: 113, height: 190 });
    expect(render('idle').region).toEqual({ x: 456, y: 279, width: 102, height: 177 });
  });

  /**
   * ⭐ THE PIXEL GATE. Everything above pins counts and boxes; this pins the
   * IMAGE. Any change to the fill rule, the stroke geometry, the sub-pixel
   * convention, the downsample, the crop or the slot map moves it — including
   * changes no hand-written probe thought to look for.
   *
   * ⚠️ It is a REGRESSION gate, not a correctness one: the values come from the
   * implementation the rest of this suite proves correct and that was checked by
   * eye against the live Phaser canvas. It is PORTABLE — `rasterise` uses only
   * exactly-specified arithmetic — unlike a hash of the PNG, whose bytes move
   * with the zlib Node was built against.
   *
   * ⚠️ It is also the ONLY thing standing between A6.2's scores and a silently
   * different fighter, so **do not "refresh" it to make a diff go green.** If it
   * moves, either the render changed on purpose (say so, in the same commit) or
   * something is broken.
   */
  it('GOLDEN: the dressed and idle renders still produce the same pixels', () => {
    expect(rasterDigest(render('dressed').raster)).toBe(GOLDEN_DRESSED);
    expect(rasterDigest(render('idle').raster)).toBe(GOLDEN_IDLE);
  });

  it('the two variants do NOT render the same pixels', () => {
    expect(rasterDigest(render('dressed').raster)).not.toBe(rasterDigest(render('idle').raster));
  });
});

describe('assertBackdropIsNotArt — on the real plan', () => {
  it('refuses black, which is the colour of every outline the fighter carries', () => {
    expect(() => { assertBackdropIsNotArt(render('dressed').plan, 0x000000); }).toThrow(/PAINTS/);
  });

  it('refuses EVERY colour the dressed fighter is painted in — not a hand-picked one', () => {
    // ⚠️ Written first as a hardcoded `0x676467` and it did not throw: that is
    // the gi's grey in the SOURCE VIDEO, not in our traced art. Deriving the set
    // from the plan cannot be wrong that way, and it grows with the outfit.
    const colours = [...new Set(render('dressed').plan.map((op) => op.color))];
    expect(colours.length).toBeGreaterThan(5);
    for (const colour of colours) {
      expect(() => { assertBackdropIsNotArt(render('dressed').plan, colour); }).toThrow(/PAINTS/);
    }
  });

  it('accepts the magenta the renderer actually uses', () => {
    expect(() => { assertBackdropIsNotArt(render('dressed').plan, DEFAULT_BACKDROP); }).not.toThrow();
  });

  it('AND THE PIPELINE ACTUALLY CALLS IT — deleting the call must not be silent', () => {
    // ⚠️ Testing the function alone leaves the CALL SITE ungated: a chaos plant
    // that deleted `assertBackdropIsNotArt(plan, backdrop)` from `renderPoseWith`
    // passed the whole suite, because every assertion invoked the guard directly.
    // This one goes through the pipeline, so it fails if the call disappears.
    expect(() => renderPoseWith('dressed', SHAPES, { backdrop: 0x000000 })).toThrow(/PAINTS/);
    expect(() => renderPoseWith('idle', SHAPES, { backdrop: 0x000000 })).toThrow(/PAINTS/);
  });
});

describe('the render is anchored where the scene anchors it', () => {
  it('uses OG_IDLE_STAGE\'s anchor, not a second opinion about where the fighter stands', () => {
    // The scene builds its origin from these two numbers; a divergence here
    // would make every comparison measure a fighter the game never draws.
    expect(OG_IDLE_STAGE.anchorX).toBe(512);
    expect(OG_IDLE_STAGE.anchorY).toBe(430);
    const r = render('idle');
    expect(r.ink.maxY).toBeCloseTo(OG_IDLE_STAGE.anchorY + 1.35, 1);
  });
});

/** Pinned in the same commit as the code they describe — see the GOLDEN test. */
const GOLDEN_DRESSED = '17f385375bb5c6e853422cd8aa5bd49f414bb3f90e27a02b6f69dcbe4596de7d';
const GOLDEN_IDLE = '6dae62d12576cc22e2b62f92dc7481c5634f6e6c88279d3b5d6be4e97638ca97';
