/**
 * Slash resolution — stroke-vs-hitbox geometry + severing. The damage NUMBER
 * comes from core/damage.ts (physicalDamage — one site, shared with enemy
 * strikes; the heavy-penalty landmine is documented there).
 *
 * ⚠️ SESSION13 B3: this function no longer knows where the attacker IS, and no
 * longer takes a reach. Reach is spent as an ARC-LENGTH BUDGET when the stroke
 * is truncated (`DrawnStroke.truncateTo`), so by the time the polyline arrives
 * here it has already been cut to what the swing could actually cover. The old
 * design combined an arc budget with a Euclidean `withinReach` radius test from
 * the attacker, which double-counted reach against two different quantities —
 * the source has no radius anywhere.
 *
 * severed (INFERRED): the original dismembers on kills, so a LETHAL blow
 * (damage ≥ target hp) severs exactly the named parts the stroke crosses.
 */
import { ONE, ZERO } from '../config/nums';
import type { StanceId } from '../config/stances';
import { physicalDamage, type AttackerStats } from './damage';
import { pointInPolygon, segmentsIntersect } from './geometry';
import type { Vec } from './vec';

export type SlashAttacker = AttackerStats;

export interface TargetHitbox {
  polygon: readonly Vec[];
  stance: StanceId;
  hp: number;
  /** Defense stat — subtracted from the attack term. */
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

/**
 * `points` is the ALREADY-TRUNCATED polyline — the portion of the stroke the
 * reach budget paid for. A plain crosses-hitbox test is all that remains.
 */
export function resolveSlash(
  points: readonly Vec[],
  target: TargetHitbox,
  attacker: SlashAttacker,
): SlashResult {
  if (!strokeCrossesPolygon(points, target.polygon)) {
    return { hit: false, damage: ZERO, crit: false, severed: [] };
  }
  const damage = physicalDamage(attacker, { stance: target.stance, defense: target.defense });
  const severed: string[] = [];
  const lethal = damage >= target.hp;
  if (lethal && target.parts !== undefined) {
    for (const [name, partPoly] of Object.entries(target.parts)) {
      if (strokeCrossesPolygon(points, partPoly)) severed.push(name);
    }
  }
  return { hit: true, damage, crit: attacker.crit, severed };
}
