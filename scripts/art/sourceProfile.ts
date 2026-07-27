/**
 * THE SOURCE FIGHTER'S OWN WIDTH PROFILE (SESSION20 A6.3) — MEASURED, committed
 * as derived data so the suite can grade against it without `reference/`.
 * BUILD-TIME ONLY.
 *
 * ⛔ WHY NUMBERS AND NOT THE FRAMES. `reference/` is gitignored — the videos and
 * their stills are study-only and never distributed — and a runtime read of it is
 * the bug that once broke every fresh clone (SESSION16 finding 4). Nineteen
 * measurements per frame are derived data about proportion, the same kind of
 * committed target the A5-C set already is, and they let a clean checkout run the
 * gate.
 *
 * PROVENANCE — reproduce with:
 *   ffmpeg -hide_banner -loglevel error -ss 560 -i reference/videos/zFtCaTO0_1M.mp4 \
 *          -t 62 -vf fps=2 -q:v 1 reference/frames/s19_trace/zFt_%04d.png -y
 *   python3 -c "import sys; sys.path.insert(0,'scripts/art'); \
 *       from compareToSource import figure_of_frame, TRACING_FRAME; \
 *       from proportions import profile; print(profile(figure_of_frame(TRACING_FRAME)))"
 *
 * SEGMENTATION RULE: `proportions.py`'s `silhouette_from_frame` — the fighter is
 * the only object in the frame that is not depth-blurred — over rows 560..900 of
 * the 1080p frame, with the HUD suppressed by its own sharpness mask. Width at a
 * sample height is the COUNT of inked pixels on that row, divided by the figure's
 * own height. Measured 2026-07-27; `ffmpeg` pulls are proven byte-exact.
 *
 * ⛔ WHAT THESE NUMBERS INCLUDE THAT OUR FIGHTER CANNOT. The source is carrying a
 * SWORD — the hilt juts left at ~40 % of the height and the scabbard tip shows
 * below right — and slots 3 and 4 are EMPTY BY DESIGN in our fighter, because
 * they are the game's own "none" placeholders and the equipment art died with the
 * CDN. The source's feet are also hidden in GRASS, while ours are drawn.
 * ⇒ **Perfect agreement is not achievable and should not be chased.** The two
 * frames agree with each other at only 0.8808, and that ceiling is itself
 * measured between two ARMED fighters.
 */

/** One frame's measured silhouette. */
export interface SourceProfile {
  /** The still it came from, under the gitignored `reference/` tree. */
  readonly frame: string;
  /** Seconds into `zFtCaTO0_1M.mp4`, the watermark-free longplay. */
  readonly timestampSec: number;
  /** The figure's height in video px, as segmented. */
  readonly heightPx: number;
  /** Width / height at 5 %, 10 % … 95 % of the figure's own height. */
  readonly profile: readonly number[];
}

/**
 * The frame SESSION 19 traced the outfit from (A5.1 chose it by LOOKING: lone
 * fighter, clean side profile — the rig's own view, every garment unoccluded).
 */
export const TRACING_PROFILE: SourceProfile = {
  frame: 'reference/frames/s19_trace/zFt_0061.png',
  timestampSec: 590.0,
  heightPx: 233,
  profile: [
    0.18455, 0.32618, 0.44206, 0.16738, 0.17597, 0.20172, 0.24893, 0.30901, 0.40343, 0.33047,
    0.26609, 0.24464, 0.26609, 0.32189, 0.36052, 0.40343, 0.39485, 0.39914, 0.39056,
  ],
};

/**
 * HELD OUT. Never traced from — this is the frame that says whether the outfit
 * generalises or was fitted to its own source. Treat it as the real grade.
 */
export const HELDOUT_PROFILE: SourceProfile = {
  frame: 'reference/frames/s19_trace/zFt_0071.png',
  timestampSec: 595.0,
  heightPx: 242,
  profile: [
    0.11983, 0.24380, 0.38843, 0.16942, 0.15289, 0.17769, 0.21901, 0.26033, 0.33884, 0.31818,
    0.24380, 0.23140, 0.23140, 0.25620, 0.30992, 0.38430, 0.37603, 0.37603, 0.37603,
  ],
};

/**
 * ⭐ THE CEILING, and it is the most important number here. The source's own two
 * frames score this against EACH OTHER, five seconds apart, same fighter, same
 * outfit. It is compression noise plus a pose change, and a loop chasing 1.000 is
 * chasing exactly that. Reproduced independently by `compareToSource.py` to four
 * decimals, which is what verifies that pipeline's frame side against SESSION 19.
 */
export const FRAME_TO_FRAME_CEILING = 0.8808;
