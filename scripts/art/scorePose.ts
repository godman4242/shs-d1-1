/**
 * SESSION 20 A6.4 — the SEALED score, on demand, as JSON. BUILD-TIME ONLY.
 *
 *   npx vite-node scripts/art/scorePose.ts            # dressed
 *   npx vite-node scripts/art/scorePose.ts -- idle
 *
 * Prints exactly what `tests/a6Score.test.ts` gates on, so the loop and the
 * suite can never disagree about what the fighter scores. Needs no `reference/`:
 * our side is the renderer's own coverage mask, the source side is the committed
 * numbers in `./sourceProfile`.
 *
 * ⚠️ This is the SEALED score, not `compareToSource.py`'s DIAGNOSTIC score. They
 * are different numbers by construction (see `silhouette.ts`), and the loop tunes
 * against this one because it is the one the suite holds as a floor.
 */
import { renderPose } from './poseRaster';
import { rasterDigest } from './rasterise';
import { profileAgreement, widthProfile } from './silhouette';
import { FRAME_TO_FRAME_CEILING, HELDOUT_PROFILE, TRACING_PROFILE } from './sourceProfile';

const arg = process.argv[2];
const variant = arg === 'idle' ? 'idle' : 'dressed';

const render = renderPose({ variant });
const profile = widthProfile(render.raster);
const tracing = profileAgreement(profile, TRACING_PROFILE.profile);
const heldout = profileAgreement(profile, HELDOUT_PROFILE.profile);

console.log(
  JSON.stringify({
    variant,
    tracing,
    heldout,
    // The HELD-OUT frame is the honest grade and what the loop ranks on: a
    // change must not win by pleasing only the frame it was traced from.
    mean: (tracing + heldout) / 2,
    gap: Math.abs(tracing - heldout),
    ceiling: FRAME_TO_FRAME_CEILING,
    // ⛔ THE PROFILE SCORE IS SCALE-FREE, so a taller fighter costs it nothing —
    // A6.4's sweep found and walked straight through that hole. Height travels
    // with the score from here so the loop can refuse to buy proportion with size.
    heightStage: render.ink.maxY - render.ink.minY,
    digest: rasterDigest(render.raster),
    slot15: render.footprints.find((f) => f.slot === 15)?.bounds ?? null,
  }),
);
