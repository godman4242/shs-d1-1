/**
 * OG_DEER — `EnemyDeer.as` (261 lines), ai 19, no children. Lane L4b, slice 3a.
 * All CONTRACT. The shared wanderer numbers are in `ogNpcAnimal.ts`.
 *
 * The deer is pure prey: it has no ATTACK body (`:191-192` is an empty case) and
 * — like the horse, unlike the bear and the stag — its `update()` neither re-acquires a
 * dead target nor calls `checkAITrigger()` (`:42-69`), so the target it was handed is
 * the target it keeps, and `checkPlayer()` reads that target on every IDLE and WALK
 * frame (`:155` / `:170`).
 */

export const OG_DEER = {
  /**
   * `:78` — entering IDLE rolls a d4 for the clip, and two of the four set a timer 2.5×
   * as long (120 against 48): `:80` 0 → DEER_IDLE, `:84` 1 → DEER_GRAZING, `:89` 2 →
   * DEER_FIDGET, `:93` 3 → DEER_SIT. There is NO `else`, so the duration set at
   * `:79` (`OG_ANIMAL.idleFrames`) stands for rolls 0 and 2.
   */
  idle: {
    dice: 4,
    /** `:87`/`:96` — a five-second timer. SIT waits it out; the 62-frame GRAZING clip ends first and re-rolls IDLE (`:56-58`). */
    longFrames: 120,
    /** `:84` */ grazeOn: 1,
    /** `:89` */ fidgetOn: 2,
    /** `:93` */ sitOn: 3,
    /**
     * `:145` — `int(random() * 3) == 1` walks. Unlike the bear, a deer that
     * rolls anything else re-enters IDLE (`:149-152`) and rolls a fresh clip.
     */
    walkDice: 3,
    walkOn: 1,
  },

  /**
   * `:219`/`:234` — the deer spots a player at `OG_ANIMAL.fleeDist` when it is
   * LOOKING at them, but only at 50 px when its back is turned. The bear, horse
   * and stag have no behind-the-back band: they check facing as a gate, not a range.
   */
  behindDist: 50,
} as const;
