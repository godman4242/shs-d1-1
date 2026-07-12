/**
 * SKILL CONSTANTS — pure data, no logic (Stage 2 M3).
 * Cooldowns follow the original's frame-quantized .92/.96-ending pattern
 * (SYNTHESIS §1.1 — every observed cooldown ends in .92/.96; the kickoff
 * binds that pattern for INFERRED values too). Damage numbers live in
 * combat.ts (CHI_PUNCH_DMG_L1) and combat-sim.ts (PROJECTILE_DMG).
 * Chi COSTS are deliberately absent: the Chi meter is Stage-3 scope
 * (flagged Stage-2 decision — skills are cooldown-gated only until then).
 */
import type { SkillVerb } from './combat-sim';

export const SKILL_COOLDOWN_MS: Record<SkillVerb, number> = {
  /** CONTRACT — on-screen 4.96 s (A-02 t=7:05). */
  chiPunch: 4960,
  /** INFERRED — .96 pattern; escape utility on a long timer. */
  smokeBomb: 7960,
  /** INFERRED — .92 pattern; short parry cooldown. */
  stab: 920,
};
