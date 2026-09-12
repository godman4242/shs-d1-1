/**
 * OG_BOAR — `EnemyBoar.as` (364 lines), ai 18, no children. Lane L4b, slice 3b.
 * All CONTRACT. What it shares with slice 3a's wanderers is in `ogNpcAnimal.ts`.
 *
 * The boar is the first actor in the lane to override the REACTION side:
 * `gotLaunched` (its own body), `doLaunched`, and `gotKnockDown` / `gotFly`, which
 * are one line each and both call its OWN `gotLaunched` (`:353-361`). It needs no
 * launch number of its own — its arc is the base's (`OG_NPC_LAUNCH`), and the
 * differences are all in the GUARDS, not the physics.
 *
 * ⚠️ Unlike every animal before it, `canGotFly = true` (`:28`), so `NPC.gotHit`'s
 * fly branch actually reaches `gotFly()` — which turns the fly into a launch.
 */

export const OG_BOAR = {
  /**
   * `:100` — entering IDLE rolls a d3 for the clip: 0 → BOAR_IDLE, 1 →
   * BOAR_FIDGET, 2 → BOAR_GRAZING. The duration (`:113`, `OG_ANIMAL.idleFrames`)
   * is set AFTER the branch, so all three share it — the horse's shape, not the bear's.
   *
   * `:170` — `int(random() * 3) == 1` walks: ONE in three, like the bear.
   */
  idle: { dice: 3, /** `:105` */ fidgetOn: 1, /** `:109` */ grazeOn: 2, walkDice: 3, walkOn: 1 },

  /**
   * `:133`/`:138` — the charge runs at 10, SLOWER than every 3a animal's 12 and
   * than the wolf's 15/12 pair. Flat: no room/overworld split.
   */
  runSpeed: 10,

  /**
   * `:141` — entering RUN rolls `int(random() * 4) == 0`: a ONE-IN-FOUR chance that
   * this whole charge knocks down instead of merely hurting. The roll is made once,
   * at the start of the charge, and `doAction` re-reads the flag every frame.
   */
  knockerDice: 4,

  /**
   * `:202` — a charging boar that gets within 50 px of its target swings. Note the
   * gate: `(this.doChase || !isAdventureMode())`, so an un-chased OVERWORLD boar
   * charges straight past without ever entering ATTACK.
   */
  attackRangeX: 50,

  /**
   * `:256`/`:269` — a chasing boar charges a player it can see within 400 px, where
   * a non-chasing one bolts at `OG_ANIMAL.fleeDist`. Twin of `OG_BEAR.chaseDist`
   * and `OG_STAG.chaseDist`.
   */
  chaseDist: 400,
} as const;
