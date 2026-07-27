/**
 * THE POSE PIPELINE (SESSION20 A6.1) — compose → plan → crop → rasterise, with
 * the shape map INJECTED. BUILD-TIME ONLY.
 *
 * ⛔ WHY THE SHAPE MAP IS A PARAMETER, AND IT IS THE WHOLE POINT OF THIS FILE.
 * A6.1 first put this pipeline in `poseRaster.ts`, which imports
 * `src/game/art/fighterShapes.ts` — and `tests/no-game-imports.test.ts` forbids
 * a test from reaching `src/game/**`, so the pipeline had NO suite coverage. An
 * adversarial review then showed what that costs: swapping the `slotMapFor`
 * ternary (so `dressed` renders the BARE fighter), deleting the backdrop guard,
 * and changing the crop's rounding ALL passed typecheck, lint and the full
 * 46-file suite — together, in one mutant.
 *
 * Taking the map as an argument moves every one of those decisions into a file a
 * test can import. `poseRaster.ts` is now the thin part that supplies
 * `FIGHTER_SHAPES`, and `tests/poseRender.test.ts` supplies the same 21 shapes
 * rebuilt from `art/generated/**` under the pure-data carve-out — the technique
 * `tests/planPose.test.ts` has used since SESSION 18. What stops the two lists
 * from drifting is that file's own registry check, which pins the registry
 * against BOTH slot maps in both directions.
 */
import { OG_IDLE_STAGE } from '../../src/config/art';
import { GAME_HEIGHT, GAME_WIDTH } from '../../src/config/display';
import { OG_DRESSED_SLOT_SHAPES, OG_IDLE_NODES, OG_SLOT_ALIASES, OG_SLOT_SHAPES } from '../../src/config/ogPose';
import { inkedBounds, type Bounds, type DrawOp, type ShapeInput } from '../../src/core/artPlan';
import { composePose, type PosedPart } from '../../src/core/composePose';
import { planPose } from '../../src/core/planPose';
import { VIEW } from '../../src/core/viewport';
import { rasterise, type Raster, type RasterRegion } from './rasterise';
import { DEFAULT_BACKDROP, DEFAULT_SUPERSAMPLE, type PoseVariant } from './renderPoseArgs';

/**
 * Which slot map a variant draws.
 *
 * ⚠️ `idle` is the BARE doll and that is a REAL GAME STATE, not scaffolding —
 * the owner confirmed (2026-07-27) that clothes are equipped and removed per
 * item at any time, and unequipped is the naked fighter. Swapping these two
 * renders the wrong figure and every measurement downstream is of that figure.
 */
export function slotMapFor(variant: PoseVariant): ReadonlyArray<readonly number[]> {
  return variant === 'dressed' ? OG_DRESSED_SLOT_SHAPES : OG_SLOT_SHAPES;
}

/**
 * The frame to render into: the ink, grown by `pad`, snapped OUTWARD.
 *
 * Floor the near edge and ceil the far one — never round. Rounding can move the
 * frame inward by a pixel and clip the very ink the render exists to measure,
 * and a clipped render reads as a smaller fighter (`inkBox.clipped` names that
 * failure for the live canvas; this is the same hazard, headless).
 */
export function cropRegion(ink: Bounds, pad: number): RasterRegion {
  const x = Math.floor(ink.minX - pad);
  const y = Math.floor(ink.minY - pad);
  return { x, y, width: Math.ceil(ink.maxX + pad) - x, height: Math.ceil(ink.maxY + pad) - y };
}

/**
 * Fail closed if the backdrop is a colour the fighter is painted in.
 *
 * A comparator segments our render as "everything that is not the backdrop". If
 * the backdrop is `0x676467` and the gi is too, the gi silently becomes
 * background and the score IMPROVES — a defect that reads as progress, which is
 * the single most expensive kind this project has hit.
 */
export function assertBackdropIsNotArt(plan: readonly DrawOp[], backdrop: number): void {
  const clash = plan.find((op) => op.color === backdrop);
  if (clash !== undefined) {
    throw new Error(
      `renderPose: backdrop 0x${backdrop.toString(16).padStart(6, '0')} is a colour the plan PAINTS — ` +
        'segmenting on "not the backdrop" would delete that part',
    );
  }
}

export interface SlotFootprint {
  readonly slot: number;
  readonly shapeIds: readonly number[];
  readonly bounds: Bounds;
}

/**
 * Where each slot's art lands, in stage px.
 *
 * Planned ONE SLOT AT A TIME through the same `planPose`, so these are the real
 * planner's numbers rather than a re-derivation — the same trick
 * `?art=idle&debug=1` uses. This is what gate A6-B attributes error with, and it
 * is what reproduces the kickoff's §P6 table, committed before this code existed.
 */
export function slotFootprints(
  parts: readonly PosedPart[],
  shapes: ReadonlyMap<number, ShapeInput>,
  origin: { x: number; y: number },
): SlotFootprint[] {
  const bySlot = new Map<number, PosedPart[]>();
  for (const part of parts) {
    const group = bySlot.get(part.slot);
    if (group === undefined) bySlot.set(part.slot, [part]);
    else group.push(part);
  }
  return [...bySlot.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([slot, group]) => ({
      slot,
      shapeIds: group.map((p) => p.shapeId),
      bounds: inkedBounds(planPose(group, shapes, origin, VIEW)),
    }));
}

export interface RenderPoseOptions {
  readonly supersample?: number;
  readonly backdrop?: number;
  /** Clear space kept around the planned ink. Defaults to the scene's own snapshot pad. */
  readonly pad?: number;
  /** Render the WHOLE stage instead of a crop around the fighter. */
  readonly full?: boolean;
}

export interface PoseRender {
  readonly variant: PoseVariant;
  readonly parts: readonly PosedPart[];
  readonly plan: readonly DrawOp[];
  /** The planner's inked extent, in stage px — the box a screenshot actually shows. */
  readonly ink: Bounds;
  readonly region: RasterRegion;
  readonly raster: Raster;
  readonly footprints: readonly SlotFootprint[];
}

const f1 = (n: number): string => n.toFixed(1);

/** Compose → plan → crop → rasterise, against the shape map you hand it. */
export function renderPoseWith(
  variant: PoseVariant,
  shapes: ReadonlyMap<number, ShapeInput>,
  options: RenderPoseOptions = {},
): PoseRender {
  const {
    supersample = DEFAULT_SUPERSAMPLE,
    backdrop = DEFAULT_BACKDROP,
    pad = OG_IDLE_STAGE.snapshotPad,
    full = false,
  } = options;

  const parts = composePose(OG_IDLE_NODES, slotMapFor(variant), OG_SLOT_ALIASES);
  const origin = { x: OG_IDLE_STAGE.anchorX, y: OG_IDLE_STAGE.anchorY };
  const plan = planPose(parts, shapes, origin, VIEW);
  assertBackdropIsNotArt(plan, backdrop);

  const ink = inkedBounds(plan);
  const region = full ? { x: 0, y: 0, width: GAME_WIDTH, height: GAME_HEIGHT } : cropRegion(ink, pad);

  // ⚠️ `--full` is the ONE mode whose region is not derived from the plan, so it
  // is the one mode that can silently cut a limb off at the canvas edge — and a
  // clipped render reads as a too-small fighter. The cropped mode always fits by
  // construction; checking both costs nothing and cannot rot.
  if (ink.minX < region.x || ink.minY < region.y || ink.maxX > region.x + region.width || ink.maxY > region.y + region.height) {
    throw new Error(
      `renderPose: the plan's ink (${f1(ink.minX)}..${f1(ink.maxX)} x ${f1(ink.minY)}..${f1(ink.maxY)}) ` +
        `does not fit the ${String(region.width)}x${String(region.height)} region at (${String(region.x)}, ${String(region.y)}) — ` +
        'the render would be CLIPPED, which measures as a smaller fighter',
    );
  }

  return {
    variant,
    parts,
    plan,
    ink,
    region,
    raster: rasterise(plan, { region, backdrop, supersample }),
    footprints: slotFootprints(parts, shapes, origin),
  };
}
