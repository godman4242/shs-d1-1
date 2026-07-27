/**
 * SESSION 20 A6.1 — render the composed fighter to a PNG, headless.
 *
 *   npx vite-node scripts/art/renderPose.ts -- dressed
 *   npx vite-node scripts/art/renderPose.ts -- idle --out renders/idle.png --slots
 *   npx vite-node scripts/art/renderPose.ts -- dressed --mask renders/dressed-mask.png
 *
 * Flags: `--out <png>` · `--mask <png>` (8-bit ink coverage) · `--supersample N`
 *        `--backdrop 0xRRGGBB` · `--full` (whole stage, not a crop) · `--slots`
 *        (print the per-slot footprint table gate A6-B attributes error with).
 *
 * This file is the CLI ONLY. Everything it does lives in `./poseRaster`, so the
 * A6.2 comparator and the A6.4 loop can import `renderPose()` without a CLI
 * parse running underneath them — the split `emit.ts`/`generate.ts` already use
 * (SESSION16 R2 finding 5). Outputs land in the gitignored `renders/`; nothing
 * this writes is committed, and nothing in `src/` imports any of it.
 */
import { main } from './poseRaster';

main(process.argv.slice(2));
