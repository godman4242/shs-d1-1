/**
 * OG_HORSE — `EnemyHorse.as` (269 lines), ai 12, no children. Lane L4b, slice 3a.
 * All CONTRACT. The shared wanderer numbers are in `ogNpcAnimal.ts`.
 *
 * The horse is the only one of the four that will not move on its own without
 * `doChase`: its IDLE re-roll is fenced by `!isShowing() && this.doChase`, and the
 * `else` (`:166-169`) re-enters IDLE, so an un-chased horse grazes forever. Its
 * `checkPlayer()` returns immediately on `!doChase` (`:232-235`) — the only one of
 * the four with that guard.
 *
 * ⚠️ `init()` does NOT set `mcs.y = getGroundY()` and has no `doChase = true`
 * adventure branch — the bear (`EnemyBear.as:42-46`) and the stag (`EnemyStag.as:41-45`) have both. `EnemyHorse.as:34-36`
 * is an EMPTY `if` on `xml.mcs.prop.toString` (no call parens, so a Function object
 * against `""`): decompiled dead code, carried as a comment only.
 *
 * `EnemyStag` imports `idle` from here — its block is byte-identical (`EnemyStag.as:127-140`
 * ↔ `EnemyHorse.as:83-96`, `EnemyStag.as:215-220` ↔ `EnemyHorse.as:155-160`) and both ride
 * `MCSHorse` with `HORSE_*` clips.
 */

export const OG_HORSE = {
  /**
   * `:83` — entering IDLE rolls a d3 for the clip: 0 → HORSE_IDLE, 1 →
   * HORSE_GRAZING, 2 → HORSE_PAWING. The duration (`:96`, `OG_ANIMAL.idleFrames`)
   * is set AFTER the branch and is the same for all three.
   *
   * `:155` — when that timer runs out, a SECOND d3 decides what to do: 0 walks,
   * 1 picks a fresh `destX` and gallops, 2 does nothing at all and the timer
   * simply restarts.
   */
  idle: {
    dice: 3,
    /** `:92` */ pawOn: 2,
    actDice: 3,
    /** `:160` */ runOn: 1,
  },
} as const;
