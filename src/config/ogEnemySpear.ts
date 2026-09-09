/**
 * OG_SPEAR — `EnemySpear.as` (276 lines), ai 4. Lane L4b, slice 1. All CONTRACT.
 *
 * Two spears in one class: at construction a coin decides `isStabber`
 * (`:19`). A stabber charges, then does a proper SPEARSTABSTART attack when it
 * arrives level with you; a non-stabber charges and simply runs its weapon into
 * you, testing the hit on every frame of the charge.
 */
export const OG_SPEAR = {
  /** `EnemySpear.as:19` — `int(random() * 2) == 1`. */
  stabberDice: 2,
  /** `EnemySpear.as:144` — `walkSpeed = random() * 2 + 3`, an int: 3 or 4. */
  walk: { range: 2, base: 3 },
  /**
   * `EnemySpear.as:192` / `:204` — while walking, within 400 px (10 px vertical facing
   * left, 50 facing right — the same asymmetry as the katana) a 1-in-4 roll per frame
   * starts the charge.
   */
  charge: { x: 400, dyLeft: 10, dyRight: 50, dice: 4 },
  run: {
    /** `EnemySpear.as:217` / `:221` — the charge moves 8 px per frame. */
    speed: 8,
    /** `EnemySpear.as:225` — inside 100 px the charge resolves… */
    engageX: 100,
    /** `EnemySpear.as:227` — …a downed target inside 50 px gets the DOWNSTAB… */
    stabX: 50,
    /** `EnemySpear.as:233` — …a stabber level within 50 px vertical does the real stab. */
    attackDy: 50,
    /** `EnemySpear.as:243` — beyond 400 px the charge gives up and walks. */
    giveUpX: 400,
  },
} as const;
