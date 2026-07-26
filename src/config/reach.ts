/**
 * REACH FORMULA CONSTANTS — pure data, no logic (SESSION13 A0.5 / D2).
 *
 * Reach is NOT a per-stance constant. The source computes it from stats:
 *
 *   base     = 120 + floor( (90 + 5 × danRank) × SPD / (20 + SPD) )
 *   light    = base × 1.4
 *   balanced = base × (1 + 0.02 × balancedMastery)
 *   heavy    = max( base × (0.5 + 0.04 × heavyMastery), 100 )
 *
 * Every literal above is named here so `src/core/` stays literal-free. All
 * values are CONTRACT-SRC (read out of the payload) and are in **WORLD px** —
 * which is the whole reason A0 moved the sim to 800×480 first: these drop in
 * with no conversion.
 *
 * At our stated character (SPD 1, danRank 0, mastery 0 — see `stats.ts`):
 *   base = 120 + floor(90 × 1 / 21) = 120 + 4 = **124**
 *   light 173.6 · balanced 124 · heavy **100** (it hits the floor)
 *
 * ⚠️ NOTE THE PERMUTATION, because it is what makes D2a's "one mastery drives
 * both tables" work. The same three curve shapes appear in the reach table and
 * the DAMAGE table, swapped between light and heavy:
 *
 *            reach                        damage
 *   light    × 1.4          (flat)        × (0.5 + 0.04·m)
 *   balanced × (1 + 0.02·m)               × (1 + 0.02·m)
 *   heavy    × (0.5 + 0.04·m), floored    × 1.4          (flat)
 *
 * That also explains the legacy `STANCE_TABLE.dmgMult` values 0.9 / 1.2 / 1.4:
 * they are the curves evaluated at **mastery 10** (0.5+0.4 = 0.9; 1+0.2 = 1.2;
 * 1.4 flat) — i.e. ceilings, exactly as that table was labelled. B2/B3 replace
 * both tables with the curves at the ONE stated mastery.
 *
 * Reach is spent as an **arc-length budget** along the drawn stroke, not as a
 * radius — a curvy slash covers less ground than a straight one (B3).
 */
export const REACH = {
  /** CONTRACT-SRC — flat base every character starts from. */
  base: 120,
  /** CONTRACT-SRC — dan term's constant part. */
  danBase: 90,
  /** CONTRACT-SRC — added to `danBase` per rebirth rank. */
  danPerRank: 5,
  /** CONTRACT-SRC — soft-cap denominator: `SPD / (spdSoftcap + SPD)`. */
  spdSoftcap: 20,
  /** CONTRACT-SRC — light stance's flat reach multiplier. */
  lightMult: 1.4,
  /** CONTRACT-SRC — balanced reach gains this fraction per mastery level. */
  balancedPerMastery: 0.02,
  /** CONTRACT-SRC — heavy reach multiplier at mastery 0. */
  heavyBase: 0.5,
  /** CONTRACT-SRC — heavy reach gains this fraction per mastery level. */
  heavyPerMastery: 0.04,
  /** CONTRACT-SRC — heavy reach never falls below this (world px). */
  heavyFloor: 100,
} as const;
