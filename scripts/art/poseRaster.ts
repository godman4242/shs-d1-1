/**
 * HEADLESS POSE RENDER (SESSION20 A6.1) — the fighter, composed and planned by
 * the REAL planner, rasterised to a PNG from Node. BUILD-TIME ONLY.
 *
 * THE PURE HALF. `scripts/art/renderPose.ts` is the CLI that calls `main()`
 * here — the same split as `emit.ts` (pure) and `generate.ts` (CLI), and for the
 * same reason: SESSION16 R2 finding 5 found that a `main()` at module scope
 * makes a module unimportable, because importing it runs the CLI and throws on
 * argv. `vite-node` strips the script path out of `process.argv`, so the usual
 * "am I the entry point" guard cannot work here — the split is the only honest
 * fix, and the A6.2 comparator and the A6.4 loop both need to call `renderPose`
 * without a CLI parse happening underneath them.
 *
 * WHY (kickoff D3): every SESSION 19 comparison went through a manual browser
 * screenshot, at an unknown scale, on a JPEG, over a backdrop injected by hand —
 * and every defect in that session's outfit was caught by a human eye instead of
 * by a gate. A render→compare→score loop cannot run on that. This is the first
 * half of the loop: an image, in milliseconds, identical every time.
 *
 * ⚠️ "IDENTICAL" MEANS THE PIXELS, NOT THE FILE. `main` prints a `rasterDigest`
 * — a hash of the pixels, portable across machines — beside the PNG's own
 * sha256, which is NOT portable because `deflateSync` output depends on the zlib
 * Node was built against (`rasterise.ts`'s header has the measurement, and CI
 * runs a different Node from this Mac). Gate on the digest, never on the file.
 *
 * ⛔ THE LIMIT, AND IT BOUNDS EVERY NUMBER TAKEN FROM THIS RENDER. It draws
 * `composePose` → `planPose`'s own output through `./rasterise`, so it tests
 * PLACEMENT — which part, at which anchor, in what order, at what size. It is
 * NOT a second game: Phaser's own fill triangulation, stroke joins and GPU
 * antialiasing are all approximated, and `rasterise.ts`'s header lists exactly
 * how. A defect only Phaser can produce (a mis-packed hole ring, a shader) is
 * invisible here and stays the live `?art=` route's job.
 *
 * ⭐ THE BACKDROP IS MAGENTA ON PURPOSE, AND IT IS CHECKED. The game canvas is
 * TRANSPARENT on `?art=idle`/`?art=dressed`, and a black outline over a black
 * page is invisible — SESSION 19 lost a round to exactly that. So a backdrop is
 * required, it is recorded in the render, and `assertBackdropIsNotArt` throws if
 * it collides with any colour the plan actually paints. Without that check,
 * "everything that is not the backdrop is the fighter" quietly deletes whatever
 * garment happens to share the backdrop's hue.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { OG_IDLE_STAGE } from '../../src/config/art';
import { GAME_HEIGHT, GAME_WIDTH } from '../../src/config/display';
import { OG_DRESSED_SLOT_SHAPES, OG_IDLE_NODES, OG_SLOT_ALIASES, OG_SLOT_SHAPES } from '../../src/config/ogPose';
import { inkedBounds, type Bounds, type DrawOp } from '../../src/core/artPlan';
import { composePose, type PosedPart } from '../../src/core/composePose';
import { planPose } from '../../src/core/planPose';
import { VIEW } from '../../src/core/viewport';
import { FIGHTER_SHAPES } from '../../src/game/art/fighterShapes';
import { encodePng, rasterDigest, rasterise, type Raster, type RasterRegion } from './rasterise';
import {
  DEFAULT_BACKDROP,
  DEFAULT_SUPERSAMPLE,
  parseArgs,
  type PoseVariant,
  type RenderPoseArgs,
} from './renderPoseArgs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));

/** Re-exported so callers need only this module. Defined in `./renderPoseArgs`. */
export type { PoseVariant, RenderPoseArgs };
export { DEFAULT_BACKDROP, DEFAULT_SUPERSAMPLE, parseArgs };

export interface RenderPoseOptions {
  readonly variant: PoseVariant;
  readonly supersample?: number;
  readonly backdrop?: number;
  /** Clear space kept around the planned ink. Defaults to the scene's own snapshot pad. */
  readonly pad?: number;
  /** Render the WHOLE stage instead of a crop around the fighter. */
  readonly full?: boolean;
}

export interface SlotFootprint {
  readonly slot: number;
  readonly shapeIds: readonly number[];
  readonly bounds: Bounds;
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

const slotMapFor = (variant: PoseVariant): ReadonlyArray<readonly number[]> =>
  variant === 'dressed' ? OG_DRESSED_SLOT_SHAPES : OG_SLOT_SHAPES;

/**
 * Fail closed if the backdrop is a colour the fighter is painted in.
 *
 * A comparator segments our render as "everything that is not the backdrop". If
 * the backdrop is `0x6a6669` and the gi is too, the gi silently becomes
 * background and the score improves — a defect that reads as progress, which is
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

/**
 * Where each slot's art lands, in stage px.
 *
 * Planned ONE SLOT AT A TIME through the same `planPose`, so these are the real
 * planner's numbers rather than a re-derivation — the same trick `?art=idle&debug=1`
 * uses. This is what gate A6-B attributes error with, and it is also the check
 * that the plumbing here matches the kickoff's §P6 table, which was committed
 * before this file existed.
 */
function footprintsOf(parts: readonly PosedPart[], origin: { x: number; y: number }): SlotFootprint[] {
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
      bounds: inkedBounds(planPose(group, FIGHTER_SHAPES, origin, VIEW)),
    }));
}

/** Compose → plan → rasterise. Pure apart from reading the committed art. */
export function renderPose(options: RenderPoseOptions): PoseRender {
  const {
    variant,
    supersample = DEFAULT_SUPERSAMPLE,
    backdrop = DEFAULT_BACKDROP,
    pad = OG_IDLE_STAGE.snapshotPad,
    full = false,
  } = options;

  const parts = composePose(OG_IDLE_NODES, slotMapFor(variant), OG_SLOT_ALIASES);
  const origin = { x: OG_IDLE_STAGE.anchorX, y: OG_IDLE_STAGE.anchorY };
  const plan = planPose(parts, FIGHTER_SHAPES, origin, VIEW);
  assertBackdropIsNotArt(plan, backdrop);

  const ink = inkedBounds(plan);
  const region: RasterRegion = full
    ? { x: 0, y: 0, width: GAME_WIDTH, height: GAME_HEIGHT }
    : {
        x: Math.floor(ink.minX - pad),
        y: Math.floor(ink.minY - pad),
        width: Math.ceil(ink.maxX + pad) - Math.floor(ink.minX - pad),
        height: Math.ceil(ink.maxY + pad) - Math.floor(ink.minY - pad),
      };

  // ⚠️ `--full` is the ONE mode whose region is not derived from the plan, so it
  // is the one mode that can silently cut a limb off at the canvas edge — and a
  // clipped render reads as a too-small fighter, exactly the failure `inkBox`'s
  // own `clipped` flag exists to name. The cropped mode always fits by
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
    footprints: footprintsOf(parts, origin),
  };
}

/** The §P6 table, regenerated — slot, parts, box, size, all in stage px. */
export function footprintTable(footprints: readonly SlotFootprint[]): string {
  const rows = footprints.map((fp) => {
    const { minX, minY, maxX, maxY } = fp.bounds;
    return (
      `  ${String(fp.slot).padStart(2)} ${fp.shapeIds.join('+').padEnd(11)} ` +
      `${f1(minX).padStart(7)}..${f1(maxX).padEnd(7)} ${f1(minY).padStart(7)}..${f1(maxY).padEnd(7)} ` +
      `${f1(maxX - minX).padStart(6)} x ${f1(maxY - minY)}`
    );
  });
  return ['  slot shapes         x0..x1            y0..y1             w x h', ...rows].join('\n');
}

function write(relOrAbs: string, bytes: Uint8Array): string {
  const target = path.isAbsolute(relOrAbs) ? relOrAbs : path.join(ROOT, relOrAbs);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, bytes);
  return target;
}

export function main(argv: readonly string[]): void {
  const args: RenderPoseArgs = parseArgs(argv);
  const render = renderPose({
    variant: args.variant,
    supersample: args.supersample,
    backdrop: args.backdrop,
    full: args.full,
  });
  const { raster, ink, region } = render;
  const png = encodePng(raster.rgb, raster.width, raster.height, 3);
  const outPath = write(args.out, png);

  console.log(
    `${render.variant}: ${render.parts.length} parts, ${render.plan.length} draw ops\n` +
      `  ink      ${f1(ink.minX)}..${f1(ink.maxX)} x ${f1(ink.minY)}..${f1(ink.maxY)} stage px ` +
      `(${f1(ink.maxX - ink.minX)} x ${f1(ink.maxY - ink.minY)})\n` +
      `  region   ${region.width}x${region.height} at (${region.x}, ${region.y})\n` +
      `  backdrop 0x${raster.backdrop.toString(16).padStart(6, '0')}   supersample ${raster.supersample}x\n` +
      `  pixels   rasterDigest ${rasterDigest(raster).slice(0, 16)}   <- THE RENDER'S IDENTITY (portable)\n` +
      `  png      ${path.relative(ROOT, outPath)}  ${png.length} bytes  ` +
      `sha256 ${createHash('sha256').update(png).digest('hex').slice(0, 16)} (build-dependent, do NOT gate on it)`,
  );

  if (args.mask !== null) {
    const maskPng = encodePng(raster.coverage, raster.width, raster.height, 1);
    console.log(`  mask     ${path.relative(ROOT, write(args.mask, maskPng))}  ${maskPng.length} bytes`);
  }

  if (args.slots) console.log(footprintTable(render.footprints));
}
