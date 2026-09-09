/**
 * OG_KATANA — `EnemyKatana.as` (220 lines), ai 3. Lane L4b, slice 1. All CONTRACT.
 * The shared humanoid numbers are in `ogNpcHumanoid.ts`.
 */
export const OG_KATANA = {
  /** `EnemyKatana.as:140` — `walkSpeed = random() * 3 + 4`, an int: 4, 5 or 6. */
  walk: { range: 3, base: 4 },
  /**
   * `EnemyKatana.as:175-176` / `:185` — attack when within 100 px, but the vertical
   * tolerance is 10 px facing LEFT and 50 px facing RIGHT. An asymmetry in the source,
   * ported as it reads.
   */
  melee: { x: 100, dyLeft: 10, dyRight: 50 },
} as const;
