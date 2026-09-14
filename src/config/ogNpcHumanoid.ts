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

/**
 * `EnemyKatana.as:82` — the bar slides 100 px left while downed…
 * Twins, each naming its file: `EnemyKnife.as:86`, `EnemySpear.as:86`, `RoomGoblin.as:69`,
 * `RoomOgre.as:69`, `EnemyCivilian.as:93`, `EnemyCivilianOld.as:72`, `EnemyArcher.as:84`,
 * `EnemySpearElite.as:200`.
 */
export const OG_HUMANOID_DOWNED_BAR_X = -100;
/**
 * `EnemyKatana.as:97` — …and back on getting up.
 * Twins, each naming its file: `EnemyKnife.as:101`, `EnemySpear.as:101`, `RoomGoblin.as:77`,
 * `RoomOgre.as:77`, `EnemyCivilian.as:108`, `EnemyCivilianOld.as:87`, `EnemyArcher.as:99`,
 * `EnemySpearElite.as:215`.
 */
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
 * `EnemyKatana.as:205` — FALL_STATE gravity per frame, `velY += 3`.
 * Twins, each naming its file and each verified to read `velY += 3;` verbatim:
 * `EnemyKnife.as:232`, `EnemySpear.as:261`, `RoomGoblin.as:262`, `RoomOgre.as:280`,
 * `EnemyCivilian.as:292`, `EnemyCivilianFemale.as:185`, `EnemyCivilianOld.as:243`,
 * `EnemyArcher.as:257`, `EnemySpearElite.as:375`.
 */
export const OG_HUMANOID_FALL_GRAVITY = 3;

/**
 * `EnemyKnife.as:115` — a DOWNSTAB on a downed target does double. Twins, each naming its
 * file: `EnemySpear.as:119`, `RoomGoblin.as:91`, `RoomOgre.as:91`, `EnemySpearElite.as:239`.
 */
export const OG_HUMANOID_DOWNSTAB_MULT = 2;
