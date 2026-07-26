/**
 * STANCES — pure data, no logic. The triangle logic itself lives in
 * src/core/stance.ts (Stage 1); this file only names the numbers.
 */

/** The three stances. Every stance-indexed table uses this key type. */
export type StanceId = 'light' | 'balanced' | 'heavy';

export interface StanceParams {
  /** Animation/measure speed multiplier. */
  speed: number;
  /** Incoming damage multiplier. */
  damageTakenMult: number;
}

/**
 * INFERRED — what is LEFT of the per-stance table (SESSION13 D2/D2a).
 *
 * ⚠️ `reach` AND `dmgMult` HAVE BEEN REMOVED. Both are functions of the
 * character's stats and mastery, not per-stance constants:
 *   - reach comes from the source formula (`src/config/reach.ts`,
 *     evaluated by `src/core/mastery.ts`)
 *   - dmgMult is the SAME mastery curve family, permuted between light and
 *     heavy — the old 0.9 / 1.2 / 1.4 were those curves at mastery 10
 *
 * Keeping them here while reading reach from a mastery-0 character is exactly
 * the self-inconsistency the Session-11 adjudication reverted, so ONE mastery
 * value now drives both (gate item 5).
 *
 * `damageTakenMult` stays DATA-ONLY and must never be applied — the heavy
 * penalty is the defence-side ×0.8 cut in `core/damage.ts` (Stage-2 landmine:
 * apply ONE form, never both).
 */
export const STANCE_TABLE: Record<StanceId, StanceParams> = {
  light: { speed: 1.4, damageTakenMult: 1.0 },
  balanced: { speed: 1.0, damageTakenMult: 1.0 },
  heavy: { speed: 0.7, damageTakenMult: 1.25 },
};

/**
 * CONTRACT — counter triangle: key BEATS value. light>heavy>balanced>light.
 * CONFIRMED BY DEVELOPER TEXT (Session 11): the dojo tutorial states verbatim
 * "BALANCED IS EFFECTIVE AGAINST LIGHT. HEAVY IS EFFECTIVE AGAINST BALANCED.
 * LIGHT IS EFFECTIVE AGAINST HEAVY." (video A t≈396.0) — which is exactly this
 * table. Was "wiki-confirmed"; now the game's own words. Never relitigate.
 * Provenance: docs/research/fidelity/COMBAT_MEASUREMENTS.md §0 row D-3.
 */
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
