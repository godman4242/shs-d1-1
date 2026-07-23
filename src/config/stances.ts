/**
 * STANCES — pure data, no logic. The triangle logic itself lives in
 * src/core/stance.ts (Stage 1); this file only names the numbers.
 */

/** The three stances. Every stance-indexed table uses this key type. */
export type StanceId = 'light' | 'balanced' | 'heavy';

export interface StanceParams {
  /** Max effective stroke reach in px. */
  reach: number;
  /** Animation/measure speed multiplier. */
  speed: number;
  /** Outgoing damage multiplier. */
  dmgMult: number;
  /** Incoming damage multiplier. */
  damageTakenMult: number;
}

/** INFERRED — per-stance combat parameters.
 * These are the wiki's MASTERY-9 CEILING values (REBUILD_READINESS §3.3), not
 * base stats. Decide-and-flag 2026-07-23: the build TARGETS mastery-9 — the
 * only sourced numbers (veto = model the mastery curve instead). Heavy's
 * ceiling reach is 100 (the earlier 120 was a carry error). Base-scaling
 * (e.g. L1 Light dmg ×0.5, Heavy reach ×0.5→×0.9) stays UNMODELED until the
 * Session 11 study pass measures real px from footage. */
export const STANCE_TABLE: Record<StanceId, StanceParams> = {
  light: { reach: 300, speed: 1.4, dmgMult: 0.9, damageTakenMult: 1.0 },
  balanced: { reach: 200, speed: 1.0, dmgMult: 1.2, damageTakenMult: 1.0 },
  heavy: { reach: 100, speed: 0.7, dmgMult: 1.4, damageTakenMult: 1.25 },
};

/** CONTRACT — counter triangle: key BEATS value. light>heavy>balanced>light. */
export const STANCE_BEATS: Record<StanceId, StanceId> = {
  light: 'heavy',
  heavy: 'balanced',
  balanced: 'light',
};

/** INFERRED — SPACE-cycle order (portrait UI order light/balanced/heavy). */
export const STANCE_CYCLE: readonly StanceId[] = ['light', 'balanced', 'heavy'];

/** INFERRED — stance level at which the launch gesture (up-flick) unlocks. */
export const LAUNCH_UNLOCK_LEVEL: Record<StanceId, number> = {
  light: 3,
  balanced: 5,
  heavy: 5,
};
