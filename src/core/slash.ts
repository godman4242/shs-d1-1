/**
 * Slash resolution (Stage 1 item 4).
 *
 * Damage = (ATK+Weapon) × STANCE_TABLE[stance].dmgMult × (crit ? CRIT_MULT : 1)
 *          × counter, counter = COUNTER_BONUS iff attacker's stance beats the
 * defender's. CRIT_MULT is read from config — 1.3 per the errata block in
 * docs/MASTER_SPEC.md, never hardcoded here.
 *
 * Spec's signature is resolveSlash(stroke, targetHitbox); the formula needs
 * attacker data (ATK+Weapon, stance, crit), so it is an explicit third
 * parameter (flagged in STAGE1 session log; veto = fold into the stroke).
 *
 * severed (INFERRED): the original dismembers on kills, so a LETHAL blow
 * (damage ≥ target hp) severs exactly the named parts the stroke crosses.
 */
import { CRIT_MULT, DAMAGE_FLOOR } from '../config/combat';
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
  const damage = Math.max(DAMAGE_FLOOR, raw);
  const severed: string[] = [];
  const lethal = damage >= target.hp;
  if (lethal && target.parts !== undefined) {
    for (const [name, partPoly] of Object.entries(target.parts)) {
      if (strokeCrossesPolygon(stroke.points, partPoly)) severed.push(name);
    }
  }
  return { hit: true, damage, crit: attacker.crit, severed };
}
