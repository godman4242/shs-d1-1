/**
 * WORLD → STAGE transform (SESSION13 D1 / P4) — the ORIGINAL'S OWN routine,
 * transcribed, not fitted.
 *
 * The payload's resize handler, for logical `w = 800, h = 480, hTall = 690`:
 *
 *   if (windowAspect <= w/hTall)      { contentAspect = w/hTall; h = hTall; }
 *   if (contentAspect >= windowAspect) { scale = stageW/w;  xOff = 0;
 *                                        yOff = (stageH − h*scale)/2; }
 *   else                               { scale = stageH/h;
 *                                        xOff = (stageW − w*scale)/2; yOff = 0; }
 *   scaleX = scaleY = scale;   // ONE uniform scale on BOTH axes
 *
 * On our 1024×576 canvas that resolves to scale 1.2, xOff 32, yOff 0 —
 * `stage = (32 + 1.2·worldX, 1.2·worldY)`, uniform ×1.2 with 32 px pillarbox
 * bars. `tests/viewport.test.ts` pins it.
 *
 * TWO RULES, and they are different — mixing them up is the whole reason the
 * split exists:
 *   - a POSITION converts with the offset (`worldToStage` / `stageToWorld`)
 *   - a LENGTH converts with the scale ONLY (`worldToStageLength` / inverse)
 */
import { GAME_HEIGHT, GAME_WIDTH, WORLD_HEIGHT, WORLD_HEIGHT_TALL, WORLD_WIDTH } from '../config/display';
import { TWO, ZERO } from '../config/nums';
import type { Vec } from './vec';

export interface ViewTransform {
  /** Uniform scale applied to BOTH axes (the original never stretches). */
  scale: number;
  /** Pillarbox offset — stage px added to a scaled world x. */
  offsetX: number;
  /** Letterbox offset — stage px added to a scaled world y. */
  offsetY: number;
}

/** Run the original's resize routine for an arbitrary canvas size. */
export function computeViewTransform(stageW: number, stageH: number): ViewTransform {
  const windowAspect = stageW / stageH;
  let contentAspect = WORLD_WIDTH / WORLD_HEIGHT;
  let contentH = WORLD_HEIGHT;
  // Very tall windows only: swap to the taller content box.
  if (windowAspect <= WORLD_WIDTH / WORLD_HEIGHT_TALL) {
    contentAspect = WORLD_WIDTH / WORLD_HEIGHT_TALL;
    contentH = WORLD_HEIGHT_TALL;
  }
  if (contentAspect >= windowAspect) {
    const scale = stageW / WORLD_WIDTH;
    return { scale, offsetX: ZERO, offsetY: (stageH - contentH * scale) / TWO };
  }
  const scale = stageH / contentH;
  return { scale, offsetX: (stageW - WORLD_WIDTH * scale) / TWO, offsetY: ZERO };
}

/** The transform for THIS build's canvas — scale 1.2, xOff 32, yOff 0. */
export const VIEW: ViewTransform = computeViewTransform(GAME_WIDTH, GAME_HEIGHT);

/** World POSITION → stage position (offset applied). */
export function worldToStage(p: Vec, t: ViewTransform = VIEW): Vec {
  return { x: t.offsetX + p.x * t.scale, y: t.offsetY + p.y * t.scale };
}

/** Stage POSITION → world position (offset removed). */
export function stageToWorld(p: Vec, t: ViewTransform = VIEW): Vec {
  return { x: (p.x - t.offsetX) / t.scale, y: (p.y - t.offsetY) / t.scale };
}

/** World LENGTH → stage length (scale only — never the offset). */
export function worldToStageLength(len: number, t: ViewTransform = VIEW): number {
  return len * t.scale;
}

/** Stage LENGTH → world length (scale only — never the offset). */
export function stageToWorldLength(len: number, t: ViewTransform = VIEW): number {
  return len / t.scale;
}
