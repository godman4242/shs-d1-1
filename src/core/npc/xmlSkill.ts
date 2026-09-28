/**
 * THE SKILL DATA THE AI READS (L5-OPP slice 7a): `QuestEngine.getSkillData`, `XMLSkill.getCooldown`
 * and `getChiCost` (Android `XMLSkill.as:268`, `:289`; web `reference/decompiled/shs3_payload/scripts/§1t105s0§.as:276`, `reference/decompiled/shs3_payload/scripts/§1t105s0§.as:297`, the same),
 * and `StatsManager.getSkillCooldownModifier` (WEB `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2279-2296`, ruling R6).
 *
 * The rows are `OG_SKILLS`, the Android build's (v0.682): the web payload carries no skill table
 * (its caveat is in `ogSkills.ts`), so a web-only id such as 1077 has no data, as `getSkillData`
 * answers null for an id it does not hold.
 *
 * `XMLSkill` compares `levelList[lvl].chi.toString == ""`: the METHOD, never called, so the test is
 * always false and an absent tag reads as `int("")`, 0. The port reads an absent field as 0.
 */
import { OG_COOLDOWN_SPEED } from '../../config/ogMcsPlayer';
import { OG_SKILLS, type OgSkill, type OgSkillLevel } from '../../config/ogSkills';
import { OG_FPS } from '../../config/timing';
import { ONE, ZERO } from '../../config/nums';
import { asInt } from './MCSActor';

/** `QuestEngine.getSkillData(id)`: the skill's row, or null. */
export function skillData(id: number): OgSkill | null {
  return OG_SKILLS.find((s) => s.id === id) ?? null;
}

/** `levelList[lvl]`: a `Vector` read past either end throws a RangeError. */
function row(skill: OgSkill, lvl: number): OgSkillLevel {
  const r = skill.levels[lvl];
  if (r === undefined) throw new RangeError(`XMLSkill ${skill.id}: no level row ${lvl}`);
  return r;
}

/** `XMLSkill.as:268` · web `reference/decompiled/shs3_payload/scripts/§1t105s0§.as:276`: the chi at a level; 0 past the last row. Level 0 reads row −1 and throws. */
export function getChiCost(skill: OgSkill, level: number): number {
  const lvl = level - ONE;
  if (lvl >= skill.levels.length) return ZERO;
  return row(skill, lvl).chi ?? ZERO;
}

/**
 * `XMLSkill.as:289` · web `reference/decompiled/shs3_payload/scripts/§1t105s0§.as:297`: a passive skill 0; else the level's seconds (past the
 * last row, the last row's; level 0, none) × 24 into an `int`, then × the scale into the `:int`
 * return. `scale` is `skillCooldownModifier`'s, read when the cooldown is.
 */
export function getCooldown(skill: OgSkill, level: number, scale: number): number {
  if (skill.passive) return ZERO;
  const lvl = level - ONE;
  let val = ZERO;
  if (lvl >= skill.levels.length) val = asInt((row(skill, skill.levels.length - ONE).cooldownS ?? ZERO) * OG_FPS);
  else if (lvl >= ZERO) val = asInt((row(skill, lvl).cooldownS ?? ZERO) * OG_FPS);
  return asInt(val * scale);
}

/**
 * WEB `StatsManager.getSkillCooldownModifier` (`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2279`): the HUMAN's speed (stat plus
 * bonus, × 1.5 into an `int` under a speed buff), capped at 600, gives `1 − speed / 600 × 0.5`.
 * Android caps at 300 and divides by 300 (`StatsManager.as:1856`).
 */
export function skillCooldownModifier(speed: number, buffed: boolean): number {
  const k = OG_COOLDOWN_SPEED;
  let s = buffed ? asInt(speed * k.buffMult) : speed;
  if (s > k.cap) s = k.cap;
  return ONE - (s / k.cap) * k.scale;
}
