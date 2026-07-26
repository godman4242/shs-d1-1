/**
 * DISPLAY — pure data, no logic.
 *
 * TWO SPACES (SESSION13 D1). Keep them straight:
 *
 * - **WORLD** (`WORLD_WIDTH` × `WORLD_HEIGHT`) is the SIMULATION space and is
 *   the original's own logical stage, read out of the payload's resize
 *   routine: `w = 800, h = 480, hTall = 690`. Every gameplay constant is
 *   expressed here, so source values drop in with no conversion at all.
 * - **STAGE** (`GAME_WIDTH` × `GAME_HEIGHT`) is the CANVAS and never moves.
 *   INFERRED — 16:9 letterboxed stage per the Stage 1 gate (1024×576).
 *
 * 800×480 is 5:3 and the canvas is 16:9, so **no uniform transform maps one
 * onto the other**: the original pillarboxes. `src/core/viewport.ts` runs the
 * original's own routine and yields `stage = (32 + 1.2·worldX, 1.2·worldY)`
 * for our canvas — pinned in `tests/viewport.test.ts`, never guessed.
 *
 * Because the stage is FIXED, the 55/55 browser fidelity gate (which only
 * ever samples rendered canvas pixels) is invariant under this split by
 * construction.
 */
export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 576;

/** CONTRACT-SRC — the original's logical stage width (its own `w`). */
export const WORLD_WIDTH = 800;
/** CONTRACT-SRC — the original's logical stage height (its own `h`). */
export const WORLD_HEIGHT = 480;
/**
 * CONTRACT-SRC — the original's `hTall`: on windows TALLER than 800/690 it
 * swaps to this content box instead of letterboxing further. Our 16:9 canvas
 * never reaches that branch, but the routine is implemented whole so the
 * transform stays the original's rather than a special case of it.
 */
export const WORLD_HEIGHT_TALL = 690;
