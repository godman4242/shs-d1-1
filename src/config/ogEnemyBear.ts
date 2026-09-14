/**
 * OG_BEAR — `EnemyBear.as` (279 lines), ai 17, no children. Lane L4b, slice 3a.
 * All CONTRACT. What it shares with the other three wanderers is in
 * `ogNpcAnimal.ts` (`OG_ANIMAL`); only the bear's own rules are here.
 *
 * The bear is the ONLY animal of slice 3a that FIGHTS: it closes to 100 px and
 * swings its right hand, then sits on a five-second cooldown. That cooldown is
 * why its `doAction` ticks `idleCounter` at the TOP, in EVERY state (`:163-166`),
 * where the deer, horse and stag tick it only inside IDLE — copy the deer's shape
 * onto the bear and the bear never attacks twice.
 */

export const OG_BEAR = {
  /**
   * `EnemyBear.as:97` — entering IDLE rolls a d3 for the clip: 0 → BEAR_IDLE,
   * 1 → BEAR_SIT, else → BEAR_FIDGET. ONE roll, read twice (`:98-108` picks the
   * clip, `:110` picks the duration).
   */
  idle: {
    dice: 3,
    /** `:112` — sitting (dice 1) holds for three seconds; every other roll takes `OG_ANIMAL.idleFrames`. */
    sitFrames: 72,
    /**
     * `:173` — `int(random() * 3) == 1`: ONE in three walks. The wolf's twin band
     * is `< 2` (two in three, `OG_WOLF.idle.walkBelow`), so this is NOT its twin.
     */
    walkDice: 3,
    /** `:173` — the `== 1`. */
    walkOn: 1,
  },

  /**
   * `:197` — mid-gallop, a target within 100 px and a spent cooldown starts the
   * swing; `:200` — the swing then arms `5 * 24` frames of cooldown.
   *
   * ⚠️ `:212-214` swings at `PART_r_hand` with NO `isAdventureMode()` guard — the
   * wolf's bite and pounce are both fenced by one (`EnemyWolf.as:294`). A bear
   * mauls in the overworld; a wolf does not.
   */
  attack: { rangeX: 100, cooldownFrames: 120 },

  /**
   * `:246`/`:259` — a CHASING bear (the room dispatch's `doChase`, or any bear
   * outside the overworld — `:42-45`) charges a player it can see within 400 px,
   * where a non-chasing one bolts at `OG_ANIMAL.fleeDist`.
   */
  chaseDist: 400,
} as const;
