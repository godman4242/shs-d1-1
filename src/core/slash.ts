/**
 * Slash resolution (Stage 1 item 4; Stage 2 adds defense): stroke-vs-hitbox
 * geometry + severing. The damage NUMBER comes from core/damage.ts
 * (physicalDamage — one site, shared with enemy strikes; the heavy-penalty
 * landmine is documented there).
 *
 * Spec's signature is resolveSlash(stroke, targetHitbox); the formula needs
 * attacker data (ATK+Weapon, stance, crit), so it is an explicit third
 * parameter (flagged in STAGE1 session log; veto = fold into the stroke).
 *
 * severed (INFERRED): the original dismembers on kills, so a LETHAL blow
 * (damage ≥ target hp) severs exactly the named parts the stroke crosses.
 */
import { ONE, ZERO } from '../config/nums';
import type { StanceId } from '../config/stances';
import { physicalDamage } from './damage';
import type { DrawnStroke } from './DrawnStroke';
import { pointInPolygon, segmentsIntersect } from './geometry';
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
  // Formula (incl. the single-form heavy penalty) lives in core/damage.ts —
  // shared with enemy strikes so the two paths can never drift apart.
  const damage = physicalDamage(attacker, { stance: target.stance, defense: target.defense });
  const severed: string[] = [];
  const lethal = damage >= target.hp;
  if (lethal && target.parts !== undefined) {
    for (const [name, partPoly] of Object.entries(target.parts)) {
      if (strokeCrossesPolygon(stroke.points, partPoly)) severed.push(name);
    }
  }
  return { hit: true, damage, crit: attacker.crit, severed };
}
