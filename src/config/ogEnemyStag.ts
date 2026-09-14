/**
 * OG_STAG — `EnemyStag.as` (339 lines), ai 21, no children. Lane L4b, slice 3a.
 * All CONTRACT. The shared wanderer numbers are in `ogNpcAnimal.ts`; `idle` is
 * the horse's, imported rather than copied (byte-identical, and the stag rides
 * `MCSHorse` with `HORSE_*` clips — the source treats it as a horse variant).
 *
 * The stag is the only one of the four that CHARGES: a chasing stag rears
 * (ATTACK), and the rear clip ending turns into CHARGING (`:98-108`), which
 * gallops and gores with `PART_head` at `LAUNCH_KNOCKDOWN` every frame (`:265-272`).
 *
 * ⚠️ TWO source quirks carried, both pinned in `tests/npcSlice3a.test.ts`:
 *   - **the constructor takes `doChase` and never assigns it** (`:12-28`) — the
 *     bear (`EnemyBear.as:23`) and horse (`EnemyHorse.as:23`) both do. A stag's `doChase`
 *     can therefore only ever be set by `init()`'s `!isAdventureMode()` branch (`EnemyStag.as:41-44`).
 *   - **`setLevel` (`:48-70`) is a hand copy of `NPC.as:239-260`** and differs
 *     from it in nothing but decompiler artifacts (a split `var factor:Number =
 *     NaN;` declaration and `this.` prefixes). It needs no number of its own —
 *     it reuses `OG_NPC_SET_LEVEL` and `OG_NPC_XP`. DIVERGENCES records it as a
 *     no-op override, like `EnemyCivilianOld.update()`.
 */
import { OG_HORSE } from './ogEnemyHorse';

export const OG_STAG = {
  /** `EnemyStag.as:127-140` ↔ `EnemyHorse.as:83-96`, `EnemyStag.as:215-220` ↔ `EnemyHorse.as:155-160` — byte-identical. */
  idle: OG_HORSE.idle,

  /**
   * `:190`/`:195` — the gore charge runs at 15 px per frame with NO overworld
   * step-down, where RUN has one (`OG_ANIMAL.runSpeed` vs `runSpeedRoom`). Same
   * literal as `runSpeedRoom`, a different rule, so it is named separately.
   */
  chargeSpeed: 15,

  /**
   * `:305`/`:319` — a chasing stag rears at a player within 400 px (then charges);
   * a non-chasing one bolts at `OG_ANIMAL.fleeDist` instead. Twin of `OG_BEAR.chaseDist`.
   */
  chaseDist: 400,
} as const;
