/**
 * OG_KNIFE — `EnemyKnife.as` (247 lines), ai 1 — and the ABSENT-`<ai>` default, so the
 * most common enemy in the roster (70 rows). Lane L4b, slice 1. All CONTRACT.
 */
export const OG_KNIFE = {
  /** `EnemyKnife.as:140` — `walkSpeed = random() * 2 + 4`, an int: 4 or 5. */
  walk: { range: 2, base: 4 },
  /** `EnemyKnife.as:181` / `:200` — attack (or stab a downed target) within 50 px, 50 px vertical, both sides. */
  melee: { x: 50, dy: 50 },
} as const;
