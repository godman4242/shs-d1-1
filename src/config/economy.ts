/**
 * ECONOMY CONSTANTS — pure data, no logic (Stage 2 spec item 10; consumed
 * by DuelResult at M6 and progression at Stage 3). Double-entered in
 * tests/config-values.test.ts.
 *
 * Labels/deviations:
 * - KILL_REWARD is INFERRED (errata: 20+ video samples show NO flat per-
 *   level formula — SYNTHESIS §1.2; this seed drives the Stage-2 Victory
 *   screen's +10/+8 gate items). coins is 8, NOT 5 (spec-verified).
 * - MAX_DAN_RANK is 10, not the spec text's 5 (research 2026-07-11: dan
 *   ranks kyu→10; spec's own tenthGold corroborates). Kheshav open decision
 *   #2, default 10 — veto = revert here + in config-values.test.ts.
 * - REBIRTH keeps the spec's attackBonusPerRebirth field; research says the
 *   real bonus is +10 CHOSEN-ELEMENTAL skill points, stacking — that
 *   revision is queued for Stage 3 progression (open decision #3).
 * - HAS_CASH_PURCHASE=false is a DELIBERATE deviation (original sold gold
 *   for cash; this recreation has no cash path).
 */

/** INFERRED — Stage-2 duel reward seed (see docblock). */
export const KILL_REWARD = { xpPerFoeLevel: 10, coinsPerFoeLevel: 8 };

/** CONTRACT — level-up modal: +1 SP, +3 stat, full HP/Chi/AP refill. */
export const LEVEL_UP_REWARD = { skillPoints: 1, statPoints: 3, fullRefill: true };

/** CONTRACT — first-run skill-point cap (L80 corroborated on film, A-17). */
export const FIRST_RUN_SP_CAP = 80;

/** CONTRACT (research) — 10 dan ranks; spec text said 5 (see docblock). */
export const MAX_DAN_RANK = 10;

/** Spec-fixed payout schedule; elemental revision queued Stage 3 (docblock). */
export const REBIRTH = { earlyGold: 25, tenthGold: 100, lateGold: 25, attackBonusPerRebirth: 10 };

/** CONTRACT (research + B-19/B-20) — War Room parameters, consumed Stage 5. */
export const WAR_ROOM = {
  unlockLevel: 10,
  killCap: 350,
  buildDonationCap: 500,
  deployMods: { fieldToMountain: 60, mountainToMountain: 100, fieldToForest: 75 },
  controlPointFlagBonus: 1.2,
};

/** Spec-fixed — deliberate deviation: no cash purchase path, ever. */
export const HAS_CASH_PURCHASE = false;
