/**
 * AI CONSTANTS — pure data, no logic (Stage 2 spec item 8; names and values
 * are spec-EXACT and double-entered in tests/config-values.test.ts).
 * AISeamController (core/) is the only consumer of the tier table; the Sim
 * executes movement with ENEMY_SPEED.
 */

export interface AITierParams {
  /** Windup shown before ANY strike (the telegraph-then-commit contract). */
  telegraphMs: number;
  /** Swing duration after the telegraph, before recovery starts. */
  attackMs: number;
  /** Recovery after a swing (jittered ±AI_RECOVER_JITTER_FRAC). */
  recoverMs: number;
  /** Reaction attention window: at most one block/dodge roll per reactMs. */
  reactMs: number;
  reactBlockChance: number;
  reactDodgeChance: number;
  counterStancePickChance: number;
  /** Chance per decision to commit to a strike when in range. */
  aggression: number;
  kunaiChance: number;
}

export const AI_TIERS: Record<'easy' | 'normal' | 'hard', AITierParams> = {
  easy: {
    telegraphMs: 700,
    attackMs: 180,
    recoverMs: 760,
    reactMs: 420,
    reactBlockChance: 0.15,
    reactDodgeChance: 0.05,
    counterStancePickChance: 0.2,
    aggression: 0.3,
    kunaiChance: 0,
  },
  normal: {
    telegraphMs: 520,
    attackMs: 180,
    recoverMs: 620,
    reactMs: 320,
    reactBlockChance: 0.3,
    reactDodgeChance: 0.15,
    counterStancePickChance: 0.5,
    aggression: 0.55,
    kunaiChance: 0.25,
  },
  hard: {
    telegraphMs: 380,
    attackMs: 160,
    recoverMs: 480,
    reactMs: 220,
    reactBlockChance: 0.45,
    reactDodgeChance: 0.25,
    counterStancePickChance: 0.8,
    aggression: 0.8,
    kunaiChance: 0.4,
  },
};

/**
 * WORLD-SPACE (SESSION13 A0): every px value below was authored in stage px
 * and converted once, `/1.2` for lengths (`src/core/viewport.ts`). The
 * pre-conversion stage value is kept in each comment as provenance.
 */
/** Kunai only fly inside this horizontal band (world px). Was 240/720 stage. */
export const AI_KUNAI_RANGE = { min: 200, max: 600 };
/** World px. Was 132 stage. */
export const AI_STRIKE_RANGE = 110;
/** World px. Was 620 stage. Reserved for Stage-4 aggro; unused in 1v1. */
export const AI_APPROACH_RANGE = 516.67;
/** World px per ms. Was 0.17 stage px/ms (= 170 stage px/s → 141.67 world px/s). */
export const ENEMY_SPEED = 0.1417;
export const AI_RECOVER_JITTER_FRAC = 0.35;
/** Boss/PvP-shaped duel tuning target (PvE trash is 3–10 s — SYNTHESIS §1.1). */
export const DUEL_TARGET_SECONDS = { min: 20, max: 60 };

/**
 * INFERRED — Stage-2 decision (flagged 2026-07-12): the spec queues stance
 * switches for "pendingStanceMs" but names no value; 600 ms reads as a
 * visible flash without stalling the fight. Veto = retune.
 */
export const AI_PENDING_STANCE_MS = 600;

/**
 * CONTRACT-SRC (SESSION13 D7/D8) — the AI decision cadence: one decision every
 * half second. Introduced in A3 for AUTO SLASH; **B4 also re-points the enemy
 * AI at it**, replacing `AITierParams.reactMs`, which was doing double duty as
 * both the reaction window and `decisionHoldUntil` and is deleted with
 * `react()`.
 *
 * Note it is COARSER than every tier's `reactMs` (420/320/220), so while
 * auto-slash gates on this the controller's own internal hold never binds —
 * there is exactly one cadence in play, not two.
 */
export const AI_THINK_INTERVAL_MS = 500;

/**
 * CONTRACT-SRC (SESSION13 D7) — AUTO SLASH synthesises a stroke of
 * `floor(reach / this)` points spaced this far apart, in WORLD px. This is
 * also the source's own stroke resample spacing (B3 moves `RESAMPLE_SPACING`
 * onto the same number).
 */
export const AUTO_SLASH_POINT_SPACING = 20;
