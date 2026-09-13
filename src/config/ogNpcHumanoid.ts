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

/** `EnemyKatana.as:60` / `:64` (twins: `EnemyKnife.as:64/68`, `EnemySpear.as:64/68`, `EnemyCivilian.as:71/75`, `EnemyCivilianOld.as:50/54`, `EnemyArcher.as:62/66`, `EnemySpearElite.as:178/182`) — after GETUP_FRONT the body steps back 40 px. */
export const OG_HUMANOID_GETUP_STEP = 40;

/** `EnemyKatana.as:82` (twins: Knife `:86`, Spear `:86`, RoomGoblin `:69`, RoomOgre `:69`, Civilian `:93`, CivilianOld `:72`, Archer `:84`, SpearElite `:200`) — the bar slides 100 px left while downed… */
export const OG_HUMANOID_DOWNED_BAR_X = -100;
/** `EnemyKatana.as:97` (twins: Knife `:101`, Spear `:101`, RoomGoblin `:77`, RoomOgre `:77`, Civilian `:108`, CivilianOld `:87`, Archer `:99`, SpearElite `:215`) — …and back on getting up. */
export const OG_HUMANOID_BAR_X_RESET = 0;

/**
 * `EnemyKatana.as:100/104` — DOWNEDUP steps the body 100 px back, `movePositionX(∓100)`.
 * Twins, every one verified to hold the same pair and each naming its own file (an
 * abbreviation like "Knife" is prose no gate can resolve): `EnemyKnife.as:104/108`,
 * `EnemySpear.as:104/108`, `RoomGoblin.as:80/84`, `RoomOgre.as:80/84`,
 * `EnemyCivilian.as:111/115`, `EnemyCivilianOld.as:90/94`, `EnemyArcher.as:102/106`,
 * `EnemySpearElite.as:218/222`.
 */
export const OG_HUMANOID_DOWNEDUP_STEP = 100;

/**
 * `EnemyKatana.as:213` — FALL_STATE gravity per frame, `velY += 3`.
 * Twins, each naming its file and each verified to read `velY += 3;` verbatim:
 * `EnemyKnife.as:232`, `EnemySpear.as:261`, `RoomGoblin.as:262`, `RoomOgre.as:280`,
 * `EnemyCivilian.as:292`, `EnemyCivilianFemale.as:185`, `EnemyCivilianOld.as:243`,
 * `EnemyArcher.as:257`, `EnemySpearElite.as:375`.
 */
export const OG_HUMANOID_FALL_GRAVITY = 3;

/** `EnemyKnife.as:115` (twins: Spear `:119`, RoomGoblin `:91`, RoomOgre `:91`, SpearElite `:239`) — a DOWNSTAB on a downed target does double. */
export const OG_HUMANOID_DOWNSTAB_MULT = 2;
