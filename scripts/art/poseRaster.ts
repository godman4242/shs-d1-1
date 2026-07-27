/**
 * HEADLESS POSE RENDER (SESSION20 A6.1) — the game's OWN shape registry, wired
 * into the pose pipeline, plus the CLI's output. BUILD-TIME ONLY.
 *
 * ⚠️ THIS FILE IS DELIBERATELY THIN, AND THAT IS THE DESIGN. It is the only part
 * of the renderer that imports `src/game/art/fighterShapes.ts`, and
 * `tests/no-game-imports.test.ts` forbids a test from reaching `src/game/**` —
 * so ANYTHING that lives here is unreachable from the suite. An adversarial
 * review of A6.1's first draft proved what that costs: with the pipeline living
 * here, a mutant that swapped the dressed/bare slot map, deleted the backdrop
 * guard AND moved the crop by a pixel passed typecheck, lint and all 46 test
 * files at once.
 *
 * ⇒ The pipeline moved to `./poseScene`, which takes the shape map as an
 * argument, and `tests/poseRender.test.ts` drives it with the same 21 shapes
 * rebuilt from `art/generated/**`. What remains here is the registry hand-off
 * and console formatting — and `renders/` is not committed, so the formatting
 * has no downstream reader but a human.
 *
 * THE CLI is `./renderPose`, which only calls `main()` — the `emit.ts`/`generate.ts`
 * split (SESSION16 R2 finding 5). `vite-node` strips the script path out of
 * `process.argv`, so the usual "am I the entry point" guard cannot work here.
 *
 * ⛔ THE LIMIT, AND IT BOUNDS EVERY NUMBER TAKEN FROM THIS RENDER. It draws
 * `composePose` → `planPose`'s own output, so it tests PLACEMENT — which part,
 * at which anchor, in what order, at what size. It is NOT a second game:
 * Phaser's fill triangulation, stroke joins and GPU antialiasing are all
 * approximated, and `rasterise.ts`'s header lists exactly how. A defect only
 * Phaser can produce — a mis-packed hole ring above all — is invisible here and
 * stays `Earcut.deviation`'s job on the live `?art=` route.
 *
 * ⚠️ "DETERMINISTIC" MEANS THE PIXELS, NOT THE FILE. `main` prints a
 * `rasterDigest` — a hash of the pixels, portable across machines — beside the
 * PNG's own sha256, which is NOT portable: `deflateSync` output depends on the
 * zlib Node was built against, and CI runs a different Node from the dev Mac.
 * Gate on the digest, never on the file.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { FIGHTER_SHAPES } from '../../src/game/art/fighterShapes';
import { encodePng, rasterDigest } from './rasterise';
import {
  renderPoseWith,
  type PoseRender,
  type RenderPoseOptions,
  type SlotFootprint,
} from './poseScene';
import { parseArgs, type PoseVariant, type RenderPoseArgs } from './renderPoseArgs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));

export type { PoseRender, PoseVariant, RenderPoseOptions, SlotFootprint };

/**
 * The pose pipeline, against the registry THE GAME ITSELF DRAWS FROM.
 *
 * `FIGHTER_SHAPES` is keyed by each shape's own `id`, never by a hand-typed key,
 * so the map cannot drift from the art. This one-line hand-off is the only thing
 * in the render path the suite cannot see; `tests/planPose.test.ts` pins the
 * registry's contents against both slot maps as TEXT, in both directions.
 */
export function renderPose(options: RenderPoseOptions & { readonly variant: PoseVariant }): PoseRender {
  return renderPoseWith(options.variant, FIGHTER_SHAPES, options);
}

const f1 = (n: number): string => n.toFixed(1);

/** The kickoff's §P6 table, regenerated — slot, parts, box, size, all in stage px. */
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

  if (args.json !== null) {
    // Everything the A6.2 comparator needs to put a slot's footprint onto a
    // pixel: the crop it was rendered into, and each slot's box in STAGE px.
    // Written as data rather than re-derived in Python — a second opinion about
    // where a garment sits is exactly what this session exists to prevent.
    const meta = {
      variant: render.variant,
      region: render.region,
      ink: render.ink,
      backdrop: raster.backdrop,
      supersample: raster.supersample,
      rasterDigest: rasterDigest(raster),
      parts: render.parts.length,
      ops: render.plan.length,
      slots: render.footprints.map((fp) => ({ slot: fp.slot, shapeIds: [...fp.shapeIds], bounds: fp.bounds })),
    };
    const jsonPath = write(args.json, new TextEncoder().encode(`${JSON.stringify(meta, null, 2)}\n`));
    console.log(`  json     ${path.relative(ROOT, jsonPath)}  ${meta.slots.length} slots`);
  }

  if (args.slots) console.log(footprintTable(render.footprints));
}
