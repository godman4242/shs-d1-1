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
  /** Attacker position on the stage (Session 11: reach gating). */
  pos: Vec;
  /** Max slash reach in px — from STANCE_TABLE[stance].reach (Session 11). */
  reach: number;
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

function withinReach(p: Vec, origin: Vec, reachSq: number): boolean {
  const dx = p.x - origin.x;
  const dy = p.y - origin.y;
  return dx * dx + dy * dy <= reachSq;
}

/** True when the IN-REACH portion of the stroke touches the polygon. The blade
 * path terminates at the stance reach cap (frame-verified: one long arc bloodies
 * in-reach enemies while the far enemy keeps full HP), so only segments with at
 * least one endpoint within reach of the attacker can cut. Boundary-spanning
 * segments count whole — an INFERRED slack of at most one segment length, until
 * the study pass measures the real blade-FX clip. */
function strokeCrossesPolygonWithinReach(
  points: readonly Vec[],
  poly: readonly Vec[],
  origin: Vec,
  reachSq: number,
): boolean {
  const start = points.at(ZERO);
  if (start !== undefined && withinReach(start, origin, reachSq) && pointInPolygon(start, poly)) return true;
  let prevPt: Vec | null = null;
  for (const cur of points) {
    if (prevPt !== null && (withinReach(prevPt, origin, reachSq) || withinReach(cur, origin, reachSq))) {
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
  // Session 11: blade-path-with-reach — only the stroke's in-reach portion cuts.
  // A stroke drawn over a beyond-reach enemy deals NO damage, even when the
  // stroke itself starts at the attacker (CRUX test, frame-verified).
  const reachSq = attacker.reach * attacker.reach;
  if (!strokeCrossesPolygonWithinReach(stroke.points, target.polygon, attacker.pos, reachSq)) {
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
