/**
 * TIMING — pure data, no logic. All simulation time is counted in fixed
 * 60Hz frames; wall-clock ms only exist at the game-layer boundary.
 */
import type { StanceId } from './stances';

/** Spec-fixed — the simulation advances on a fixed 60Hz timestep. */
export const FIXED_HZ = 60;

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
