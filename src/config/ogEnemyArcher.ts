/**
 * OG_ARCHER — `EnemyArcher.as` (311 lines), ai 2, and the parent of `FriendlyArcher`
 * (ai 34). Lane L4b, slice 2b. All CONTRACT. The get-up / bar / fall twins are
 * `ogNpcHumanoid.ts`'s; the friendly's 0.75 scaling is `ogNpcFriendly.ts`'s.
 */
export const OG_ARCHER = {
  /**
   * `EnemyArcher.as:140` — `destX = 20 + random() * (width − 40)`: a wander target
   * inset 20 px from either edge; `:206` — and only inside that same inset may a
   * walk turn into a reload.
   */
  inset: 20,
  insetBoth: 40,
  /** `EnemyArcher.as:141` — `walkSpeed = random() * 2 + 5`, an int: 5 or 6. */
  walk: { range: 2, base: 5 },
  /** `EnemyArcher.as:187` — arrived when within 10 px of `destX`: stop and reload. */
  arriveX: 10,
  /** `EnemyArcher.as:202` / `:219` — inside 100 px it draws the knife instead. */
  meleeX: 100,
  /** `EnemyArcher.as:206` — while walking, a d10 of 0 stops to reload. */
  reloadDice: 10,
  /** `EnemyArcher.as:237` — an ENEMY archer fires on a coin; a friendly always (`:233`). */
  fireDice: 2,
  arrow: {
    /** `EnemyArcher.as:274` / `:276` — the arrow leaves, and is aimed at, 60 px above the feet. */
    yOffset: -60,
    /** `Projectile.as:8` — `GRAVITY = 3`, the arc the shot is solved against. */
    gravity: 3,
    /** `EnemyArcher.as:277` / `:279` — cos 30°: the shot leaves at a fixed 30° elevation. */
    cos30: 0.866,
    /** `EnemyArcher.as:281` — `0.5 · g · t²`. */
    half: 0.5,
    /** `EnemyArcher.as:286` — `velY += random() * 8 − 4`. */
    jitter: { range: 8, offset: 4 },
    /**
     * `EnemyArcher.as:288-299` — whether the arrow can launch, by the archer's level:
     * above 50 a coin (`int(random() * 2) > 0`), above 20 a d3 of 0, above 10 a d4 of 0,
     * else never.
     */
    launch: { highLevel: 50, highDice: 2, midLevel: 20, midDice: 3, lowLevel: 10, lowDice: 4 },
  },
  /** `EnemyArcher.as:307` — on death the prop slot becomes item 13000 (the bow is dropped). */
  deathProp: 13000,
} as const;
