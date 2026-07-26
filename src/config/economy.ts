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
 * - REBIRTH.elementalPointsPerRebirth (was the spec's "attackBonusPerRebirth"):
 *   research (original-game-facts.md "Rebirth bonus") says the real payout is
 *   +10 CHOSEN-elemental skill points, stacking — NOT +10 Attack. Field
 *   renamed at Stage 3 progression per open decision #3 (default elemental).
 *   Veto = revert the name here + in config-values.test.ts + progression.ts.
 * - HAS_CASH_PURCHASE=false is a DELIBERATE deviation (original sold gold
 *   for cash; this recreation has no cash path).
 */

/**
 * ⚠️ SESSION13 D3 — XP IS NO LONGER A PER-LEVEL SEED. The source's named-enemy
 * reward is `level × 5 + 45` (`XP_PER_LEVEL` / `XP_REWARD_BASE` in
 * `config/duel.ts`, evaluated by `core/enemyModel.ts`), which pays **90** at
 * our level 9 — not the 10 our `xpPerFoeLevel: 10` produced at level 1.
 *
 * Our +10/+8 was an INFERRED seed verified only against OUR OWN build's
 * screenshots; it was never an OG measurement, so the Stage-2 gate row that
 * reads "+10 XP / +8 COINS" is updated rather than left silently false.
 *
 * COINS have NO source formula found, so they stay INFERRED — and FLAT, not
 * per-level: scaling them by the foe's level would invent a curve nobody
 * measured (level 9 × 8 = 72 coins is not evidence, it is arithmetic on a
 * guess). Veto = restore per-level coins and say so.
 */
export const KILL_REWARD = { coinsFlat: 8 };

/** CONTRACT — level-up modal: +1 SP, +3 stat, full HP/Chi/AP refill. */
export const LEVEL_UP_REWARD = { skillPoints: 1, statPoints: 3, fullRefill: true };

/** CONTRACT — first-run skill-point cap (L80 corroborated on film, A-17). */
export const FIRST_RUN_SP_CAP = 80;

/** CONTRACT (research) — 10 dan ranks; spec text said 5 (see docblock). */
export const MAX_DAN_RANK = 10;

/**
 * Payout schedule (research): rebirths 1–9 pay earlyGold, the 10th (final,
 * Jūdan) pays tenthGold; lateGold (11+) is source data kept for the record
 * but UNREACHABLE under MAX_DAN_RANK=10 (see docs/DIVERGENCES.md). Every
 * rebirth grants elementalPointsPerRebirth of the CHOSEN element, stacking.
 */
export const REBIRTH = { earlyGold: 25, tenthGold: 100, lateGold: 25, elementalPointsPerRebirth: 10 };

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
