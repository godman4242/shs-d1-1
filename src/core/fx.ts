/**
 * Render-FX math kept pure for testability (Stage 2 M10).
 *
 * WHY IN core/: DuelScene FX ignored sim.timeScale (audit finding — slow-mo
 * ran gameplay at 0.35× while blood/trails ran 1×), and the no-game-imports
 * guard means scene code can never be unit-tested. The clock/ballistics math
 * lives here; the scene passes its own render-feel numbers in as arguments
 * (they stay under the M8 game-purity ratchet — config/CLAUDE.md bans
 * inventing spec-unnamed blood constants).
 *
 * NOT gameplay state: nothing here feeds Sim. Kill-beat timing and the
 * invuln blink deliberately stay on the wall clock (cinematic hold must
 * stay ~0.9 s real) — that wiring is DuelScene's, verified in-browser.
 */

/** One blood droplet's kinematic state (bornAt stays a scene concern). */
export interface FxDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Advance the FX clock by a wall-clock delta at the active timescale. */
export function advanceFxClock(fxNowMs: number, deltaMs: number, timeScale: number): number {
  return fxNowMs + deltaMs * timeScale;
}

/** Semi-implicit Euler step, gravity applied to vy BEFORE the position advance. */
export function integrateDroplet(d: FxDroplet, dtS: number, gravityPxS2: number): FxDroplet {
  const vy = d.vy + gravityPxS2 * dtS;
  return { x: d.x + d.vx * dtS, y: d.y + vy * dtS, vx: d.vx, vy };
}
