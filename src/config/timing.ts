/**
 * TIMING — pure data, no logic. All simulation time is counted in fixed
 * 60Hz frames; wall-clock ms only exist at the game-layer boundary.
 */
import type { StanceId } from './stances';

/** Spec-fixed — the simulation advances on a fixed 60Hz timestep. */
export const FIXED_HZ = 60;

/** Spec-fixed — unit conversion for Sim.advance(deltaMs): ms per second. */
export const MS_PER_S = 1000;

/**
 * Spec-fixed (pure math, not tuning) — 1-ulp guard for Sim.advance's
 * owed-frames floor: elapsedMs × FIXED_HZ / MS_PER_S lands a hair above OR
 * below the true integer (e.g. one exact step computes to 1.0000000000000002,
 * three to 2.9999999999999996), so the floor is taken after nudging by this
 * epsilon. Orders of magnitude above ulp noise, orders below a frame.
 */
export const FRAME_QUANT_EPS = 1e-9;

export interface SlashPhaseFrames {
  windup: number;
  active: number;
  recovery: number;
}

/** INFERRED — per-stance slash phase timing, in fixed 60Hz frames. */
export const SLASH_FRAMES: Record<StanceId, SlashPhaseFrames> = {
  light: { windup: 4, active: 3, recovery: 8 },
  balanced: { windup: 6, active: 3, recovery: 12 },
  heavy: { windup: 10, active: 4, recovery: 16 },
};
