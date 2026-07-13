/**
 * CHI CONSTANTS — pure data, no logic (Stage 3 M3, the Stage-2 deferral:
 * "skills are cooldown-gated only until the Chi meter lands"). Double-entered
 * in tests/config-values.test.ts.
 *
 * ALL THREE are INFERRED tuning seeds — the study has NO frame-backed reads
 * of skill Chi costs or an in-duel regen rate (B-23 shows the blue bar at
 * 47/47; CHI REGEN exists as an item stat, A-13/B-28). Values are chosen for
 * the duel prototype's 100-point meter family (HP 100 / Focus 100 / Shunpo
 * 100) and a 20–60 s duel: the nuke costs most, the escape a bit less, the
 * parry stays spammable; a full bar regens in 25 s so costs stay decisions.
 * Revisit against real reads if later research surfaces costs.
 */
import type { SkillVerb } from './combat-sim';

/** INFERRED — Chi pool ceiling (prototype meter family). */
export const CHI_MAX = 100;

/** INFERRED — passive in-duel refill, points per second. */
export const CHI_FILL_PER_S = 4;

/** INFERRED — Chi price of each hotbar skill, charged on top of its cooldown. */
export const CHI_COST: Record<SkillVerb, number> = {
  chiPunch: 30,
  smokeBomb: 25,
  stab: 10,
};
