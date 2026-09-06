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

/** Rebuilt from the generated art — see the header, and `tests/planPose.test.ts`. */
const SHAPES: ReadonlyMap<number, ShapeInput> = new Map(
  [
    SHAPE_2641, SHAPE_2644, SHAPE_2646, SHAPE_2648, SHAPE_2650, SHAPE_2653, SHAPE_2655, SHAPE_2658,
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
  it('dressed: 19 parts, 99 draw ops, with all 52 of its strokes', () => {
    const r = render('dressed');
    // 96 → 103 ops when the gi pair landed by the OWNER'S RULING (SESSION22
    // A9.4): 9015 trades its blob ring for base + measured panel shadow +
    // contour + chest crease; 9019 for base + 3-ring shadow + contour + two
    // creases + the crest ring. On top of A9.6's 81 → 96 (the branch) and
    // A9.3/A9.5's 57 → 81 (kasa detail, hakama inset contours, obi shadow).
    // ⬇️ 21 → 19 parts and 103 → 99 ops in LANE L3B: slots 5 and 9 (the bare
    // feet) draw nothing on the DRESSED fighter, because the reference frame
    // shows none and `setShoes` dresses those parts with art the CDN took. The
    // BARE doll below is untouched and still draws 21. See `ogPose.ts`.
    expect(r.parts).toHaveLength(19);
    expect(r.plan).toHaveLength(99);
    expect(census(r.plan)).toEqual({ fill: 44, stroke: 52, holedFill: 3 });
  });

  it('idle: 21 parts, 90 draw ops, with all 41 of its strokes', () => {
    const r = render('idle');
    expect(r.parts).toHaveLength(21);
    expect(r.plan).toHaveLength(90);
    expect(census(r.plan)).toEqual({ fill: 45, stroke: 41, holedFill: 4 });
  });

  it('lands where SESSION 18 and the kickoff §P6 measured it, to 0.1 stage px', () => {
    const dressed = render('dressed').ink;
    // ⚠️ minX moved 474.9 -> 472.1 in SESSION20 A6.4 (hakama waistband). maxX
    // moved 538.9 -> 545.7 at SESSION22 A9.6: the branch's fork tip emerging
    // aft-low behind the hakama is now the fighter's widest point — exactly
    // what the source frames show.
    // ⬆️ maxY moved 431.4 -> 429.1 at LANE L3B. The bottom edge had been the
    // SANDALS; with the bare feet no longer drawn on a dressed fighter it is now
    // the hakama's own hem, which is what `zFt_0061.png` shows as the ground
    // line. minY (the kasa) is untouched, so the figure shortened from BELOW.
    expect([dressed.minX, dressed.maxX, dressed.minY, dressed.maxY].map((n) => Number(n.toFixed(1)))).toEqual([
      472.1, 545.7, 290.9, 429.1,
    ]);
    // SESSION 18 A4-F recorded the bare plan as 52.661 x 128.164 stage px.
    const idle = render('idle').ink;
    expect(idle.maxX - idle.minX).toBeCloseTo(52.661, 2);
    expect(idle.maxY - idle.minY).toBeCloseTo(128.164, 2);
  });

  it('crops to the frames the CLI reports', () => {
    // Width 115 → 122 at SESSION22 A9.6: the branch's fork tip widened the ink.
    // Height 190 → 188 at LANE L3B: two fewer stage px of figure, no feet.
    expect(render('dressed').region).toEqual({ x: 448, y: 266, width: 122, height: 188 });
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
// SESSION22 A9.2 moved this once (9012 + 9001 re-authored), A9.3/A9.5 again:
// kasa two-tone + ribs + band + fringe with an INSET w2 contour, hakama
// measured-flat #dcd9d4 with a clean hem and inset w1.5 contour, obi two-tone.
// Idle is untouched — the bare fighter draws no traced art.
// …A9.6 (the branch), then A9.4 by the owner's ruling (the gi pair, balloon cut).
/**
 * ⚠️ RE-BASELINED DELIBERATELY IN LANE L3B (was `ebf871c5…`) — the DRESSED
 * fighter stopped drawing its two bare feet, which the reference frame does not
 * show and which were the loudest thing in the render the owner rejected. Both
 * sealed floors ROSE in the same commit (0.9005 → 0.9123, 0.8490 → 0.8566) and
 * the height ceiling FELL (140.5 → 138.3), which is what makes this a repair
 * rather than a re-baseline of convenience. `ogPose.ts` carries the evidence.
 */
const GOLDEN_DRESSED = 'baa2c8d69323319283110d3aab419f30a89c45f6d8a47016db6f594225813b34';
/**
 * ⚠️ RE-BASELINED ONCE, DELIBERATELY, IN LANE L3 — the render changed ON PURPOSE
 * (was `6dae62d1…`). Slots 7 and 11 drew `[calf, foottop]`; the payload pins the
 * foottop to the BACK, so they now draw `[foottop, calf]`
 * (`src/config/ogCompositing.ts` ← `MCSCharacter.as`). This is the BARE doll, so
 * only this digest moved: `GOLDEN_DRESSED` is UNCHANGED because the traced
 * hakama (9011) replaces both shapes on those slots, which is itself the
 * evidence that the correction is scoped to the parts it should touch.
 */
const GOLDEN_IDLE = 'aedc52d179760fe6cd981a7ca2b778480353a650d90f21246a57ec6a43bc3bd1';
