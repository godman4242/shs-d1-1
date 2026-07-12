/**
 * Slash resolution (Stage 1 item 4; Stage 2 adds defense).
 *
 * Damage = max(DAMAGE_FLOOR,
 *   (ATK+Weapon) × STANCE_TABLE[stance].dmgMult × (crit ? CRIT_MULT : 1)
 *                × counter  −  effectiveDefense)
 * counter = COUNTER_BONUS iff attacker's stance beats the defender's.
 * CRIT_MULT is on the MULTIPLIER STACK (pre-defense): research 2026-07-11 —
 * the fan wiki's per-stance crit table is exactly 1.3 × our dmgMults, i.e.
 * crit scales the attack term, not the post-defense result. 1.3 per the
 * errata block in docs/MASTER_SPEC.md, never hardcoded here.
 *
 * HEAVY-PENALTY APPLICATION SITE (Stage-2 landmine — apply ONE form only):
 * effectiveDefense = defense × (1 − HEAVY_DEF_PENALTY) iff the DEFENDER is
 * heavy-stanced (research: A-14 tooltip "−20% defense while heavy-stanced").
 * STANCE_TABLE.heavy.damageTakenMult (1.25) is deliberately data-only and
 * must NEVER also be applied — double-counting overshoots the original.
 * Veto = swap to the damageTakenMult form, never both.
 *
 * Spec's signature is resolveSlash(stroke, targetHitbox); the formula needs
 * attacker data (ATK+Weapon, stance, crit), so it is an explicit third
 * parameter (flagged in STAGE1 session log; veto = fold into the stroke).
 *
 * severed (INFERRED): the original dismembers on kills, so a LETHAL blow
 * (damage ≥ target hp) severs exactly the named parts the stroke crosses.
 */
import { CRIT_MULT, DAMAGE_FLOOR, HEAVY_DEF_PENALTY } from '../config/combat';
import { ONE, ZERO } from '../config/nums';
import { STANCE_TABLE, type StanceId } from '../config/stances';
import type { DrawnStroke } from './DrawnStroke';
import { pointInPolygon, segmentsIntersect } from './geometry';
import { counterMult } from './stance';
import type { Vec } from './vec';

export interface SlashAttacker {
  atkPlusWeapon: number;
  stance: StanceId;
  /** Whether this swing crits — the Critical bar decides upstream (Stage 2). */
  crit: boolean;
}

export interface TargetHitbox {
  polygon: readonly Vec[];
  stance: StanceId;
  hp: number;
  /** Defense stat — subtracted from the attack term (Stage 2). */
  defense: number;
  /** Optional named sub-hitboxes for severing (e.g. head, arm). */
  parts?: Readonly<Record<string, readonly Vec[]>>;
}

export interface SlashResult {
  hit: boolean;
  damage: number;
  crit: boolean;
  severed: string[];
}

/** True when the stroke touches the polygon: starts inside, or crosses an edge. */
function strokeCrossesPolygon(points: readonly Vec[], poly: readonly Vec[]): boolean {
  const start = points.at(ZERO);
  if (start !== undefined && pointInPolygon(start, poly)) return true;
  let prevPt: Vec | null = null;
  for (const cur of points) {
    if (prevPt !== null) {
      let prevVtx = poly.at(-ONE);
      if (prevVtx !== undefined) {
        for (const vtx of poly) {
          if (segmentsIntersect(prevPt, cur, prevVtx, vtx)) return true;
          prevVtx = vtx;
        }
      }
    }
    prevPt = cur;
  }
  return false;
}

export function resolveSlash(stroke: DrawnStroke, target: TargetHitbox, attacker: SlashAttacker): SlashResult {
  if (!strokeCrossesPolygon(stroke.points, target.polygon)) {
    return { hit: false, damage: ZERO, crit: false, severed: [] };
  }
  const raw =
    attacker.atkPlusWeapon *
    STANCE_TABLE[attacker.stance].dmgMult *
    (attacker.crit ? CRIT_MULT : ONE) *
    counterMult(attacker.stance, target.stance);
  // ONE form of the heavy penalty only — see the docblock landmine note.
  const heavyStance: StanceId = 'heavy';
  const heavyPenaltyMult = target.stance === heavyStance ? ONE - HEAVY_DEF_PENALTY : ONE;
  const damage = Math.max(DAMAGE_FLOOR, raw - target.defense * heavyPenaltyMult);
  const severed: string[] = [];
  const lethal = damage >= target.hp;
  if (lethal && target.parts !== undefined) {
    for (const [name, partPoly] of Object.entries(target.parts)) {
      if (strokeCrossesPolygon(stroke.points, partPoly)) severed.push(name);
    }
  }
  return { hit: true, damage, crit: attacker.crit, severed };
}
