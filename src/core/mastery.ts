/**
 * MASTERY — the ONE value that drives BOTH reach and damage (SESSION13 D2/D2a).
 *
 * The source does not store per-stance reach or damage constants; it computes
 * them from the character's stats and mastery:
 *
 *   base     = 120 + floor( (90 + 5 × danRank) × SPD / (20 + SPD) )
 *   reach:   light  base × 1.4                       (flat)
 *            balanced base × (1 + 0.02 × mastery)
 *            heavy  max( base × (0.5 + 0.04 × mastery), 100 )
 *   damage:  light  × (0.5 + 0.04 × mastery)
 *            balanced × (1 + 0.02 × mastery)
 *            heavy  × 1.4                             (flat)
 *
 * Note the PERMUTATION: the same three curve shapes appear in both tables,
 * swapped between light and heavy. Evaluated at mastery 10 the damage curves
 * give 0.9 / 1.2 / 1.4 — exactly the legacy `STANCE_TABLE.dmgMult`, confirming
 * those were ceilings and that this module is their generalisation.
 *
 * Why both live here rather than in two tables (D2a): reading reach from a
 * mastery-0 character while leaving damage at the mastery-10 ceiling is the
 * precise self-inconsistency the Session-11 adjudication reverted. Changing a
 * mastery level MUST move both numbers.
 */
import { REACH } from '../config/reach';
import { ONE } from '../config/nums';
import type { StanceId } from '../config/stances';
import type { FighterStats } from '../config/stats';

const LIGHT: StanceId = 'light';
const BALANCED: StanceId = 'balanced';

/** `120 + floor( (90 + 5×dan) × SPD / (20 + SPD) )` — the stat-driven base. */
export function reachBase(stats: FighterStats): number {
  const danTerm = REACH.danBase + REACH.danPerRank * stats.danRank;
  return REACH.base + Math.floor((danTerm * stats.spd) / (REACH.spdSoftcap + stats.spd));
}

/**
 * The stance's reach in WORLD px — an ARC-LENGTH BUDGET spent along the drawn
 * stroke, not a radius (B3). Heavy is floored.
 */
export function reachFor(stance: StanceId, stats: FighterStats): number {
  const base = reachBase(stats);
  const mastery = stats.mastery[stance];
  if (stance === LIGHT) return base * REACH.lightMult;
  if (stance === BALANCED) return base * (ONE + REACH.balancedPerMastery * mastery);
  return Math.max(base * (REACH.heavyBase + REACH.heavyPerMastery * mastery), REACH.heavyFloor);
}

/** The stance's outgoing damage multiplier — the same curves, permuted. */
export function damageMultFor(stance: StanceId, stats: FighterStats): number {
  const mastery = stats.mastery[stance];
  if (stance === LIGHT) return REACH.heavyBase + REACH.heavyPerMastery * mastery;
  if (stance === BALANCED) return ONE + REACH.balancedPerMastery * mastery;
  return REACH.lightMult;
}
