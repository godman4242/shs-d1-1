/**
 * OG_ANIMAL — the numbers the four-legged WANDERERS of slice 3a share verbatim:
 * `EnemyBear` (279 lines, ai 17), `EnemyDeer` (261, ai 19), `EnemyHorse` (269,
 * ai 12), `EnemyStag` (339, ai 21). Lane L4b, slice 3a. All CONTRACT.
 *
 * A value lives here only when all four use the SAME literal for the SAME rule,
 * and every twin line is named. Where a literal repeats but the rule differs
 * (each animal's idle die, the bear's attack band, the deer's behind-the-back
 * flee) it stays in that animal's own file.
 *
 * ⚠️ `xp`, `fallGravity`, `runSpeedRoom` and `runSpeed` are also `EnemyWolf.as`'s
 * (slice 2a, `ogEnemyWolf.ts`). That file is NOT edited — it shipped — so the two
 * copies are pinned equal by `tests/npcSlice3a.test.ts` ("the animal twins do not
 * drift from the wolf's"), which is what stops them silently diverging.
 *
 * ⚠️ C2 — the decompiled scripts are the ANDROID build (v0.682).
 */

export const OG_ANIMAL = {
  /**
   * `EnemyBear.as:38` · `EnemyDeer.as:35` · `EnemyHorse.as:41` · `EnemyStag.as:37`
   * — `xp = level * 5 + 45`, NOT the base's `* 2 + 20` (`NPC.as:218`). Twins:
   * `EnemyWolf.as:32`, `EnemyFox.as:26`, `EnemyCivilian.as:35`.
   *
   * ⚠️ The stag's `setLevel` OVERWRITES this with the BASE curve (`:62`), so a
   * levelled stag is worth less than an unlevelled one. The source's, pinned.
   */
  xp: { perLevel: 5, base: 45 },

  /**
   * `EnemyBear.as:124`/`:129` · `EnemyDeer.as:104`/`:109` · `EnemyHorse.as:103`/`:108`
   * · `EnemyStag.as:147`/`:152` — WALK is ±3 px per frame, signed toward `destX`.
   * Flat, unlike the wolf's `random() * 2 + 4` (`EnemyWolf.as:144`).
   */
  walkSpeed: 3,

  /**
   * `EnemyBear.as:137`/`:142` · `EnemyDeer.as:117`/`:122` — the bear and the deer
   * gallop at a FLAT 12 in a room and in the overworld alike. Twin of the horse's
   * and stag's OVERWORLD speed (`EnemyHorse.as:122`/`:134`, `EnemyStag.as:166`/`:178`)
   * and of `OG_WOLF.run.adventure` (`EnemyWolf.as:182`).
   */
  runSpeed: 12,

  /**
   * `EnemyHorse.as:118`/`:130` · `EnemyStag.as:162`/`:174` — the horse and the stag
   * gallop FASTER in a room than in the overworld. The bear and the deer have no
   * such split. Twin of `OG_WOLF.run.room` (`EnemyWolf.as:168`).
   */
  runSpeedRoom: 15,

  /**
   * `EnemyBear.as:182`/`:202` · `EnemyDeer.as:159`/`:174` · `EnemyHorse.as:175`/`:190`
   * · `EnemyStag.as:231`/`:246`/`:268` — arrived when within 10 px of `destX`.
   * Twin of `OG_WOLF.arriveX` (`EnemyWolf.as:237`).
   */
  arriveX: 10,

  /**
   * `EnemyBear.as:184` · `EnemyDeer.as:161`/`:176` · `EnemyHorse.as:177`/`:192`
   * · `EnemyStag.as:233`/`:248` — on arrival a COIN: 0 idles, 1 walks again.
   * The wolf rolls a d3 here instead (`OG_WOLF.arriveDice`), so this is NOT its twin.
   */
  arriveDice: 2,

  /**
   * `EnemyBear.as:172` · `EnemyDeer.as:138` · `EnemyHorse.as:152` · `EnemyStag.as:212`
   * — when an idle times out, the next re-roll is half a second away.
   */
  idleRetryFrames: 24,

  /**
   * `EnemyBear.as:116` · `EnemyDeer.as:79` · `EnemyHorse.as:96` · `EnemyStag.as:140`
   * — two seconds of standing about. The deer's GRAZING and SIT override it
   * (`OG_DEER.idle.longFrames`); the bear's SIT does too (`OG_BEAR.idle.sitFrames`).
   */
  idleFrames: 48,

  /**
   * `EnemyBear.as:222` · `EnemyDeer.as:200` · `EnemyHorse.as:216` · `EnemyStag.as:280`
   * — FALL gravity per frame. Twin of `OG_WOLF.fallGravity` (`EnemyWolf.as:329`)
   * and of `EnemyKatana.as:213`.
   */
  fallGravity: 3,

  /**
   * `EnemyBear.as:241`/`:254` · `EnemyDeer.as:219`/`:234` · `EnemyHorse.as:239`/`:248`
   * · `EnemyStag.as:299`/`:313` — a player this close, seen, starts the bolt.
   */
  fleeDist: 200,

  /**
   * The overworld's edge, in two different rules that share both literals:
   *   - `margin` `EnemyBear.as:205` · `EnemyDeer.as:184` · `EnemyHorse.as:200`
   *     · `EnemyStag.as:256` — `posX <= -50 || posX > stageWidth + 50` is OFF-STAGE,
   *     and an off-stage animal parks itself in `REDFREEZE_STATE`.
   *   - `dest` `EnemyBear.as:243`/`:248` · `EnemyDeer.as:224`/`:238`
   *     · `EnemyHorse.as:242`/`:250` · `EnemyStag.as:302`/`:307` — fleeing aims 100 px
   *     PAST the edge, so the bolt does not stop at it.
   */
  offStage: { margin: 50, dest: 100 },
} as const;
