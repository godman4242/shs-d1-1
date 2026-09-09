/**
 * OG_HUMANOID_* — the numbers the humanoid actors' `update()` switch and `doAction()`
 * REPEAT verbatim, class after class (lane L4b, slice 1). All CONTRACT. Cited to
 * `EnemyKatana.as`, the pattern-setter; every twin is named so a reader can check the
 * copy really is a copy. Class-specific numbers live in each class's own config file.
 *
 * ⚠️ These are shared because the SOURCE repeats them by copy-paste, not because the
 * classes share code. Each TS class still writes its own `update()` out in full,
 * exactly as its `.as` file does — the kickoff forbids flattening the tree, and the
 * per-class gaps (RoomGoblin has no FLY case at all) are behaviour.
 */

/** `EnemyKatana.as:60` / `:64` (twins: `EnemyKnife.as:64/68`, `EnemySpear.as:64/68`) — after GETUP_FRONT the body steps back 40 px. */
export const OG_HUMANOID_GETUP_STEP = 40;

/** `EnemyKatana.as:82` (twins: Knife `:86`, Spear `:86`, RoomGoblin `:69`, RoomOgre `:69`) — the bar slides 100 px left while downed… */
export const OG_HUMANOID_DOWNED_BAR_X = -100;
/** `EnemyKatana.as:97` (twins: Knife `:101`, Spear `:101`, RoomGoblin `:77`, RoomOgre `:77`) — …and back on getting up. */
export const OG_HUMANOID_BAR_X_RESET = 0;

/** `EnemyKatana.as:100` / `:104` (twins: Knife `:104/108`, Spear `:104/108`, RoomGoblin `:80/84`, RoomOgre `:80/84`) — DOWNEDUP steps the body 100 px back. */
export const OG_HUMANOID_DOWNEDUP_STEP = 100;

/** `EnemyKatana.as:213` (twins: Knife `:232`, Spear `:261`, RoomGoblin `:262`, RoomOgre `:280`) — FALL_STATE gravity per frame. */
export const OG_HUMANOID_FALL_GRAVITY = 3;

/** `EnemyKnife.as:115` (twins: Spear `:119`, RoomGoblin `:91`, RoomOgre `:91`) — a DOWNSTAB on a downed target does double. */
export const OG_HUMANOID_DOWNSTAB_MULT = 2;
