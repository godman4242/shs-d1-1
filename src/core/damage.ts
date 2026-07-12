/**
 * Physical damage formula (Stage 2 M3) — the ONE place the number comes
 * from, shared by stroke slashes (core/slash.ts) and enemy strikes (Sim):
 *
 *   damage = max(DAMAGE_FLOOR,
 *     (ATK+Weapon) × STANCE_TABLE[stance].dmgMult × (crit ? CRIT_MULT : 1)
 *       × counter  −  defense × (defender heavy ? 1 − HEAVY_DEF_PENALTY : 1))
 *
 * Crit rides the MULTIPLIER STACK (pre-defense): research 2026-07-11 — the
 * fan wiki's per-stance crit table is exactly 1.3 × our dmgMults.
 *
 * HEAVY-PENALTY APPLICATION SITE (landmine — apply ONE form only): the
 * defense-side ×(1−HEAVY_DEF_PENALTY) cut (A-14 tooltip). STANCE_TABLE's
 * heavy.damageTakenMult (1.25) is deliberately data-only and must NEVER
 * also be applied. Veto = swap forms, never both.
 */
import { CRIT_MULT, DAMAGE_FLOOR, HEAVY_DEF_PENALTY } from '../config/combat';
import { ONE } from '../config/nums';
import { STANCE_TABLE, type StanceId } from '../config/stances';
import { counterMult } from './stance';

export interface AttackerStats {
  atkPlusWeapon: number;
  stance: StanceId;
  crit: boolean;
}

export interface DefenderStats {
  stance: StanceId;
  defense: number;
}

export function physicalDamage(attacker: AttackerStats, defender: DefenderStats): number {
  const raw =
    attacker.atkPlusWeapon *
    STANCE_TABLE[attacker.stance].dmgMult *
    (attacker.crit ? CRIT_MULT : ONE) *
    counterMult(attacker.stance, defender.stance);
  const heavyStance: StanceId = 'heavy';
  const penalty = defender.stance === heavyStance ? ONE - HEAVY_DEF_PENALTY : ONE;
  return Math.max(DAMAGE_FLOOR, raw - defender.defense * penalty);
}
