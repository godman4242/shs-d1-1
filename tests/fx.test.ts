/**
 * core/fx — render-FX clock + droplet ballistics (Stage 2 M10).
 *
 * WHY THIS EXISTS: audit-verified bug — DuelScene FX ignored sim.timeScale
 * (droplets integrated raw delta; trails/redStrokes aged on raw time.now),
 * so Shunpo slow-mo ran gameplay at 0.35× while blood/trails ran 1×. The
 * scene can't be unit-tested (no-game-imports guard: Phaser crashes Node
 * workers), so the fixable math lives here in core/ and the scene is pure
 * wiring — proven in the browser during Shunpo (session log M10).
 *
 * Contract under test:
 *  - advanceFxClock scales elapsed wall delta by the ACTIVE timescale
 *    (sim.timeScale in combat, FINISHER_FLASH.slowMoScale in the kill beat).
 *  - integrateDroplet is semi-implicit Euler in the EXACT order the scene
 *    used (vy += g·dt FIRST, then x/y advance with the updated vy) — a
 *    reordering would change every droplet arc on screen.
 *  - integrateDroplet is pure: same droplet in → same droplet out, input
 *    untouched (render records are reused across frames).
 */
import { describe, expect, it } from 'vitest';
import { advanceFxClock, integrateDroplet } from '../src/core/fx';

describe('advanceFxClock — FX time advances at the active timescale', () => {
  it('advances by the full delta at timescale 1', () => {
    expect(advanceFxClock(1000, 16, 1)).toBe(1016);
  });

  it('advances at 0.35× during Shunpo/kill-beat slow-mo', () => {
    expect(advanceFxClock(1000, 100, 0.35)).toBe(1035);
  });

  it('freezes when the timescale is 0', () => {
    expect(advanceFxClock(500, 100, 0)).toBe(500);
  });

  it('accumulates across frames (order-independent sum)', () => {
    const afterTwo = advanceFxClock(advanceFxClock(0, 16, 0.5), 16, 0.5);
    expect(afterTwo).toBe(16);
  });
});

describe('integrateDroplet — semi-implicit Euler, gravity-first', () => {
  const droplet = { x: 10, y: 20, vx: 30, vy: -40 };

  it('applies gravity to vy BEFORE advancing y (scene-order contract)', () => {
    // vy' = -40 + 780·0.5 = 350 ; x' = 10 + 30·0.5 = 25 ; y' = 20 + 350·0.5 = 195.
    // Explicit-Euler (old-vy) would give y' = 0 — this pin catches a reorder.
    expect(integrateDroplet(droplet, 0.5, 780)).toEqual({ x: 25, y: 195, vx: 30, vy: 350 });
  });

  it('a zero dt changes nothing (frozen fx clock ⇒ frozen blood)', () => {
    expect(integrateDroplet(droplet, 0, 780)).toEqual(droplet);
  });

  it('slow-mo dt scales displacement (0.35× step moves 0.35× horizontally)', () => {
    const full = integrateDroplet(droplet, 0.1, 780);
    const slow = integrateDroplet(droplet, 0.1 * 0.35, 780);
    expect(full.x - droplet.x).toBeCloseTo(3, 12);
    expect(slow.x - droplet.x).toBeCloseTo(3 * 0.35, 12);
  });

  it('is pure — the input droplet is not mutated', () => {
    integrateDroplet(droplet, 0.5, 780);
    expect(droplet).toEqual({ x: 10, y: 20, vx: 30, vy: -40 });
  });
});
