/**
 * VIEWPORT — the original's own world→stage transform (SESSION13 D1 / P4).
 *
 * The payload's resize routine, read verbatim for logical w=800, h=480,
 * hTall=690:
 *
 *   if (windowAspect <= 800/690)      { contentAspect = 800/690; h = 690; }
 *   if (contentAspect >= windowAspect) { scale = stageW/800; xOff = 0;
 *                                       yOff = (stageH − h*scale)/2; }
 *   else                              { scale = stageH/h;
 *                                       xOff = (stageW − 800*scale)/2; yOff = 0; }
 *   scaleX = scaleY = scale;   // ONE uniform scale, both axes
 *
 * For OUR 1024×576 canvas that lands on the else branch and yields
 * scale 1.2 / xOff 32 / yOff 0 — i.e. `stage = (32 + 1.2·worldX, 1.2·worldY)`,
 * uniform ×1.2 with 32 px pillarbox bars. This is COMPUTED by the original,
 * not fitted by us, which is why it is pinned here rather than commented.
 *
 * Corroboration (independent of the source read): the result card's red
 * field is measured starting at study-frame x≈53–56 and ending x≈1861–1865
 * on a 1920-wide capture. The world region at that capture scale is
 * x ∈ [60, 1860] — the card's "black pillars" ARE the pillarbox bars.
 */
import { describe, expect, it } from 'vitest';
import { GAME_HEIGHT, GAME_WIDTH, WORLD_HEIGHT, WORLD_WIDTH } from '../src/config/display';
import {
  computeViewTransform,
  stageToWorld,
  stageToWorldLength,
  worldToStage,
  worldToStageLength,
} from '../src/core/viewport';

describe('viewport — the original\'s resize routine (P4)', () => {
  it('OUR canvas (1024×576): scale 1.2, xOff 32, yOff 0 — the pinned transform', () => {
    expect(computeViewTransform(GAME_WIDTH, GAME_HEIGHT)).toEqual({
      scale: 1.2,
      offsetX: 32,
      offsetY: 0,
    });
  });

  it('world corners land on the pillarboxed stage rectangle', () => {
    const t = computeViewTransform(GAME_WIDTH, GAME_HEIGHT);
    expect(worldToStage({ x: 0, y: 0 }, t)).toEqual({ x: 32, y: 0 });
    expect(worldToStage({ x: WORLD_WIDTH, y: WORLD_HEIGHT }, t)).toEqual({ x: 992, y: 576 });
  });

  it('the pillarbox bars are exactly 32 px wide on each side', () => {
    const t = computeViewTransform(GAME_WIDTH, GAME_HEIGHT);
    expect(t.offsetX).toBe(32);
    expect(GAME_WIDTH - (t.offsetX + WORLD_WIDTH * t.scale)).toBe(32);
  });

  it('stageToWorld is the exact inverse of worldToStage', () => {
    const t = computeViewTransform(GAME_WIDTH, GAME_HEIGHT);
    for (const p of [
      { x: 0, y: 0 },
      { x: 190, y: 358 },
      { x: 557, y: 358 },
      { x: WORLD_WIDTH, y: WORLD_HEIGHT },
    ]) {
      const back = stageToWorld(worldToStage(p, t), t);
      expect(back.x).toBeCloseTo(p.x, 10);
      expect(back.y).toBeCloseTo(p.y, 10);
    }
  });

  it('lengths scale WITHOUT the x offset (the two rules are different)', () => {
    const t = computeViewTransform(GAME_WIDTH, GAME_HEIGHT);
    // A length of 100 world px is 120 stage px wherever it sits.
    expect(worldToStageLength(100, t)).toBe(120);
    expect(stageToWorldLength(120, t)).toBe(100);
    // Offsetting a POSITION is not the same as scaling a LENGTH: the gap
    // between two positions must convert as a length.
    const a = worldToStage({ x: 190, y: 0 }, t);
    const b = worldToStage({ x: 557, y: 0 }, t);
    expect(b.x - a.x).toBeCloseTo(worldToStageLength(557 - 190, t), 10);
  });

  it('a WIDE window pillarboxes (else branch); a 5:3 window fits exactly', () => {
    // 5:3 exactly — contentAspect === windowAspect → first branch, no bars.
    expect(computeViewTransform(1600, 960)).toEqual({ scale: 2, offsetX: 0, offsetY: 0 });
    // Wider than 5:3 → pillarbox.
    const wide = computeViewTransform(2000, 480);
    expect(wide.scale).toBe(1);
    expect(wide.offsetX).toBe(600);
    expect(wide.offsetY).toBe(0);
  });

  it('a TALLER-than-5:3 window letterboxes against h=480 (yOff > 0)', () => {
    // 800×600 → windowAspect 1.333 < contentAspect 1.667 → first branch:
    // scale = 800/800 = 1, yOff = (600 − 480)/2 = 60.
    expect(computeViewTransform(800, 600)).toEqual({ scale: 1, offsetX: 0, offsetY: 60 });
  });

  it('a VERY tall window (aspect ≤ 800/690) switches to the h=690 content box', () => {
    // 690×690 → windowAspect 1 ≤ 800/690 ≈ 1.159 → hTall override:
    // contentAspect = 800/690 ≥ 1 → first branch: scale = 690/800 = 0.8625,
    // yOff = (690 − 690 × 0.8625)/2 = 47.4375.
    const t = computeViewTransform(690, 690);
    expect(t.scale).toBeCloseTo(0.8625, 10);
    expect(t.offsetX).toBe(0);
    expect(t.offsetY).toBeCloseTo(47.4375, 10);
  });
});
