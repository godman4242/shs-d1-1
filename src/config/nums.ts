/**
 * PURE-MATH CONSTANTS — src/core/ allows ZERO numeric literals (not even 0 or 1),
 * so identity/structural numbers are named here. These are Spec-fixed
 * (architecture mandate, STAGE1_KICKOFF §1), not gameplay tuning: never
 * "balance" them. Gameplay numbers belong in the other config files.
 */
export const ZERO = 0;
export const ONE = 1;
export const TWO = 2;
export const FOUR = 4;
export const HALF = 0.5;
/** Degrees in a half turn — for degree↔radian conversion with Math.PI. */
export const HALF_TURN_DEG = 180;
/** Full turn in radians (2π) — periodic locomotion clocks (Stage 4 M0). */
export const TAU = TWO * Math.PI;
