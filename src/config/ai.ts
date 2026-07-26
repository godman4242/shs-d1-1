/**
 * AI CONSTANTS — pure data, no logic (Stage 2 spec item 8; names and values
 * are spec-EXACT and double-entered in tests/config-values.test.ts).
 * AISeamController (core/) is the only consumer of the tier table; the Sim
 * executes movement with ENEMY_SPEED.
 */

/**
 * ⚠️ SESSION13 D8 removed FOUR fields from this interface:
 * - `reactMs` / `reactBlockChance` / `reactDodgeChance` — the enemy does **not
 *   block or dodge** in the original (measured: zero blocking across the study
 *   corpus). `react()` modelled behaviour the game lacks. `reactMs` was also
 *   doing double duty as the decision cadence, so it is replaced by the
 *   explicit `AI_THINK_INTERVAL_MS` rather than simply deleted.
 * - `telegraphMs` — the windup is not one global number per tier. It is TWO
 *   measured cases (`AI_TELEGRAPH_MS`), chosen by range at commit time.
 */
export interface AITierParams {
  /** Swing duration after the telegraph, before recovery starts. */
  attackMs: number;
  /** Recovery after a swing (jittered ±AI_RECOVER_JITTER_FRAC). */
  recoverMs: number;
  counterStancePickChance: number;
  /** Chance per decision to commit to a strike when in range. */
  aggression: number;
  kunaiChance: number;
}

export const AI_TIERS: Record<'easy' | 'normal' | 'hard', AITierParams> = {
  easy: {
    attackMs: 180,
    recoverMs: 760,
    counterStancePickChance: 0.2,
    aggression: 0.3,
    kunaiChance: 0,
  },
  normal: {
    attackMs: 180,
    recoverMs: 620,
    counterStancePickChance: 0.5,
    aggression: 0.55,
    kunaiChance: 0.25,
  },
  hard: {
    attackMs: 160,
    recoverMs: 480,
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
/**
 * CONTRACT-SRC (SESSION13 D8) — the melee trigger is `|dx| < 50 && Δy < 50`
 * in WORLD px, on BOTH axes.
 *
 * ⚠️ This replaces `AI_STRIKE_RANGE` (132 stage ≈ 110 world), which was **2×
 * too generous and had no vertical term at all**. The gate is half the
 * mechanism behind emergent turn-taking: enemies do NOT take turns in the
 * original, and the appearance of it comes from independent 0.5 s decision
 * timers PLUS this narrow range gate. Widen it and the behaviour stops
 * emerging — which is why no attack token is (or should be) implemented.
 */
export const AI_MELEE_RANGE = { x: 50, y: 50 } as const;

/**
 * CONTRACT-SRC — the windup is TWO measured cases, not one global number:
 * 600 ms when the enemy commits while still closing, 267 ms point-blank.
 * The old single global `telegraphMs` (≥520 per tier) is wrong.
 */
export const AI_TELEGRAPH_MS = { closing: 600, pointBlank: 267 } as const;
/**
 * INFERRED — where "closing" becomes "point-blank". The two telegraph
 * durations are measured; the boundary between them is not, so it is set at
 * half the melee gate. Veto = measure the real split.
 */
export const AI_POINT_BLANK_X = 25;
/** World px. Was 620 stage. Reserved for Stage-4 aggro; unused in 1v1. */
export const AI_APPROACH_RANGE = 516.67;
/** World px per ms. Was 0.17 stage px/ms (= 170 stage px/s → 141.67 world px/s). */
export const ENEMY_SPEED = 0.1417;
export const AI_RECOVER_JITTER_FRAC = 0.35;
/**
 * SESSION13 D10/B0 — the 24-seed harness band, RE-DERIVED ONCE from the source
 * model and fixed for the session. Was `{ min: 20, max: 60 }`, which was never
 * a measurement: it came from the original kickoff SPEC, around that spec's own
 * ~24.7 s reference (flagged in the harness header for a year as "the reference
 * bot's own number").
 *
 * K = 10 hits-to-kill at the bot's 0.842 s cadence, plus 1–3 closing swings,
 * predicts a ~10 s median — so `[20, 60]` misses by ~2×. Preserving the spec
 * band's own relative width `[0.81×, 2.43×]` around the model-derived centre
 * gives `[8, 25]`: same discriminating power, honest centre.
 *
 * The full derivation is pinned in `tests/harness.test.ts`, together with the
 * stop-and-escalate rule that forbids widening it.
 */
export const DUEL_TARGET_SECONDS = { min: 8, max: 25 };

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
