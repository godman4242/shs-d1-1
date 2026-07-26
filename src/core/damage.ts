/**
 * PHYSICAL DAMAGE — the ONE place the number comes from (SESSION13 D5/D6),
 * shared by stroke slashes (core/slash.ts) and enemy strikes (Sim).
 *
 * THE ORDER IS THE CONTRACT. Reordering any step changes the result, so it is
 * pinned by test:
 *
 *   1. raw   = minDamage + rand × damageRange
 *   2.       × stance/mastery multiplier            (D2a — core/mastery.ts)
 *   3.       × CRIT_MULT + CRIT_FLAT_BONUS          (only when Focus is full)
 *   4.       × stance triangle (win 1.2 / lose 0.9) (D5 — pre-defence)
 *   5.       − defence   (SUBTRACT, never divide; heavy defender's stat ×0.8)
 *   6.       floored by the ATTACKER's level        (≤10 → 1, ≤20 → lvl/8, …)
 *   7.       body-part crit ×1.3 — a POSITIONED NO-OP (see below)
 *
 * NOT IMPLEMENTED, and why:
 * - **Elemental resists** — no elemental system exists in this build.
 * - **Body-part crit ×1.3** — needs limb hitboxes we do not have. It lands as a
 *   no-op hook in its real position (AFTER the floor) so the order-sensitive
 *   test can pin WHERE it goes now, and only the multiplier has to arrive later.
 * - **The source's `×2` doubling** — its flag is never set anywhere in the
 *   payload. Dead code; deliberately not ported.
 *
 * RNG SCOPE (D6): `damageRange = weapon.maxDamage − weapon.minDamage`, and with
 * no weapon model that range is **0** — a roll of width zero. This function
 * therefore takes NO rng parameter: threading determinism through the pipeline
 * to randomise nothing would be paying a cost for no behaviour. The roll
 * activates with the weapon model.
 *
 * HEAVY-PENALTY APPLICATION SITE (Stage-2 landmine — apply ONE form only): the
 * defence-side ×(1 − HEAVY_DEF_PENALTY) cut. `STANCE_TABLE.heavy
 * .damageTakenMult` (1.25) is deliberately data-only and must NEVER also apply.
 */
import {
  CRIT_FLAT_BONUS,
  CRIT_MULT,
  DAMAGE_FLOOR,
  HEAVY_DEF_PENALTY,
  MIN_DAMAGE_TIERS,
} from '../config/combat';
import { ONE } from '../config/nums';
import type { StanceId } from '../config/stances';
import type { FighterStats } from '../config/stats';
import { damageMultFor } from './mastery';
import { matchupMult } from './stance';

export interface AttackerStats {
  /** Step 1's floor: `atk × ATTACK_DMG_PER_POINT + weapon.minDamage`. */
  minDamage: number;
  /** `weapon.maxDamage − weapon.minDamage` — currently 0 (see RNG SCOPE). */
  damageRange: number;
  stance: StanceId;
  /** Whether this swing crits — a FULL Focus bar decides upstream (D4). */
  crit: boolean;
  /** Drives step 2 (mastery) and step 6 (the level floor). */
  stats: FighterStats;
}

export interface DefenderStats {
  stance: StanceId;
  defense: number;
}

const HEAVY: StanceId = 'heavy';

/** Step 6 — the attacker's level sets the minimum a landed hit can deal. */
export function minDamageForLevel(level: number): number {
  if (level <= MIN_DAMAGE_TIERS.tier1MaxLevel) return DAMAGE_FLOOR;
  if (level <= MIN_DAMAGE_TIERS.tier2MaxLevel) return level / MIN_DAMAGE_TIERS.tier2Divisor;
  if (level <= MIN_DAMAGE_TIERS.tier3MaxLevel) return level / MIN_DAMAGE_TIERS.tier3Divisor;
  return level / MIN_DAMAGE_TIERS.tier4Divisor;
}

/**
 * Step 7 — body-part crit, positioned but inert. Returns its input unchanged
 * until limb hitboxes exist; its POSITION (after the floor) is what is pinned.
 */
function bodyPartCrit(damage: number): number {
  return damage;
}

export function physicalDamage(attacker: AttackerStats, defender: DefenderStats): number {
  // 1. base roll (width 0 today — no rng threaded, see RNG SCOPE)
  let damage = attacker.minDamage;
  // 2. stance/mastery
  damage *= damageMultFor(attacker.stance, attacker.stats);
  // 3. crit
  if (attacker.crit) damage = damage * CRIT_MULT + CRIT_FLAT_BONUS;
  // 4. stance triangle, BEFORE defence
  damage *= matchupMult(attacker.stance, defender.stance);
  // 5. defence SUBTRACTS; a heavy defender's own stat is cut to 0.8
  const penalty = defender.stance === HEAVY ? ONE - HEAVY_DEF_PENALTY : ONE;
  damage -= defender.defense * penalty;
  // 6. floor by the ATTACKER's level
  damage = Math.max(minDamageForLevel(attacker.stats.level), damage);
  // 7. body-part crit — positioned no-op
  return bodyPartCrit(damage);
}
