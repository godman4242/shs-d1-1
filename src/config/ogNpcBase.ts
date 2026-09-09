/**
 * OG_NPC_* — every number in `NPC.as` (the 1,238-line base of all 34 enemy actors
 * AND of `MCSPlayer`), plus the handful `MCSActor.as` and `Damage.as` add.
 * Lane L4b, slice 0. Hand-written against the source with a line cite on every
 * value; `tests/npcBase.test.ts` drives the port through them.
 *
 * ALL CONTRACT. Each value is the source's own literal, verbatim, at the
 * ORIGINAL's frame rate (`OG_FPS` = 24, `timing.ts`) and in the original's
 * 800×480 logical coordinates, which are this repo's WORLD px (`display.ts`).
 * Nothing here is rescaled to the 60 Hz Sim — `core/npc/NpcController.ts` steps
 * the actor at 24 Hz instead, so these stay quotable against the `.as` file.
 *
 * ⚠️ What is deliberately NOT here: blood-emitter angles/velocities/counts from
 * `die()` (`NPC.as:920-1090`). They parameterise a particle system, not a
 * decision; the death EVENT carries the anim choice and the dice, and the render
 * side owns the blood. DIVERGENCES "L4b slice 0" records it.
 *
 * ⚠️ C2 — the decompiled scripts are the ANDROID build (v0.682).
 */

/** `NPC.as:14-28` — the field initialisers every actor starts with. */
export const OG_NPC_DEFAULTS = {
  /** `NPC.as:14` — `damage:int = 10`. Overwritten by `init()` from the roster row. */
  damage: 10,
  /** `NPC.as:16` — `defense:int = 1`. */
  defense: 1,
  /** `NPC.as:22` — `aiCounterMax:int = 24`: ONE SECOND at 24 fps between re-targets. */
  aiCounterMax: 24,
  /** `NPC.as:28` — `TTLMAX:int = 96`: FOUR SECONDS from the death anim ending to disposal. */
  ttlMax: 96,
} as const;

/** `NPC.as:462` — `gotHitCounter = 12`: half a second of i-frames after any hit. */
export const OG_NPC_HIT_IFRAMES = 12;

/** `NPC.as:218` and `:252` — `xp = level * 2 + 20`. */
export const OG_NPC_XP = { perLevel: 2, base: 20 } as const;

/**
 * `NPC.as:94-110` — `getGreyLevel()`: the mob level at or below which a kill is
 * worth NOTHING to a player of `playerLevel`. Piecewise on the PLAYER's level:
 *   < 6            → 0
 *   < 40           → playerLevel − floor(playerLevel / 10) − 5
 *   < 60           → playerLevel − floor(playerLevel / 5)  − 1
 *   else           → playerLevel − 9
 */
export const OG_NPC_GREY_LEVEL = {
  /** `:97` */ zeroBelow: 6,
  /** `:101` */ midBelow: 40,
  /** `:103` */ midDiv: 10,
  /** `:103` */ midSub: 5,
  /** `:105` */ highBelow: 60,
  /** `:107` */ highDiv: 5,
  /** `:107` */ highSub: 1,
  /** `:109` */ topSub: 9,
} as const;

/**
 * `NPC.as:112-164` — `getZeroDifference()`: how many levels BELOW the player a mob
 * has to be before its XP reaches zero. `[playerLevelBelow, value]`, first match
 * wins; the last row (`< 80 → 17`, `:159-161`) and the fall-through (`:163`) are
 * BOTH 17 in the source — recorded as the cap rather than as a row.
 */
export const OG_NPC_ZERO_DIFFERENCE: ReadonlyArray<readonly [below: number, value: number]> = [
  [8, 5], // :115
  [10, 6], // :119
  [12, 7], // :123
  [16, 8], // :127
  [20, 9], // :131
  [30, 11], // :135
  [40, 12], // :139
  [45, 13], // :143
  [50, 14], // :147
  [55, 15], // :151
  [60, 16], // :155
];
/** `NPC.as:159-163` — `< 80 → 17`, and the fall-through is also 17. */
export const OG_NPC_ZERO_DIFFERENCE_CAP = 17;

/** `NPC.as:166-190` — `calcXP(playerLevel, mobLevel, xp, elite)`. */
export const OG_NPC_CALC_XP = {
  /** `:172` — a mob more than this many levels ABOVE the player pays nothing. */
  maxLevelsAbove: 3,
  /** `:179` — +5 % per level the mob is above the player. */
  bonusPerLevelAbove: 0.05,
  /** `:187` — elites pay double. */
  eliteMult: 2,
} as const;

/** `NPC.as:239-259` — `setLevel(lvl)`: rescale a roster row to another level. */
export const OG_NPC_SET_LEVEL = {
  /** `:242` — at or below this level the scale factor is cut… */
  softCapLevel: 20,
  /** `:244` — …by this. */
  softCapFactor: 0.9,
  /** `:253` — at or below this level damage, defense AND max hp are forced to… */
  trivialLevel: 10,
  /** `:255-257` — …this. The "mobs die in one hit" rule, at its source. */
  trivialStat: 1,
} as const;

/**
 * `NPC.as:397-420` — elemental damage that was > 0 before defence can never fall
 * below 1; elemental damage that was ≤ 0 clamps to 0.
 */
export const OG_NPC_ELEMENT_FLOOR = 1;

/** `NPC.as:453` — a head/hat/neck hit multiplies physical damage by 1.5. */
export const OG_NPC_BEHEAD_MULT = 1.5;

/** `NPC.as:457` — Death Touch overrides the damage outright and forces LAUNCH_FLY. */
export const OG_NPC_DEATHTOUCH_DAMAGE = 500;

/** `NPC.as:497-513` — the floating damage numbers: y offset and one colour per kind. */
export const OG_NPC_FLOATING_TEXT = {
  /** `:497` — `mcs.y - 100`. */
  yOffset: -100,
  colour: {
    /** `:497` — 0x990000 */ physical: 10027008,
    /** `:501` — 0xFF6600 */ fire: 16737792,
    /** `:505` — 0xCCCCCC */ wind: 13421772,
    /** `:509` — 0x0066FF */ water: 26367,
    /** `:513` — 0x663300 */ earth: 6697728,
  },
} as const;

/** `NPC.as:536-568` / `:702-723` — `gotLaunched()` and its per-frame physics `doLaunched()`. */
export const OG_NPC_LAUNCH = {
  /** `:544` — re-launched while already airborne (juggle): a shorter hop. */
  velYAirborne: -20,
  /** `:558` — launched from the ground. */
  velYGround: -25,
  /** `:562` / `:566` — always pushed AWAY from the way the actor faces. */
  velXAbs: 3,
  /** `:706` — gravity, per frame. */
  gravity: 3,
  /** `:707` — the PEAK anim plays while `-4 < velY < 0`. */
  peakBandTop: -4,
  /** `:718` — within this many px of either stage edge the actor bounces… */
  edgeMargin: 20,
  /** `:721` — …with velX doubled. */
  edgeBounceMult: 2,
} as const;

/** `NPC.as:611-637` — `gotFlyAway(xpos, ypos)`: thrown AWAY from a point. */
export const OG_NPC_FLYAWAY = {
  /** `:627` / `:633` */ velXAbs: 20,
  /** `:628` / `:634` */ velY: -10,
} as const;

/** `NPC.as:725-745` — `doFly()`: the per-frame physics of FLY_STATE. */
export const OG_NPC_FLY = {
  /** `:733` — gravity, per frame — a THIRD of the launch gravity. */
  gravity: 1,
  /** `:735` — lands when `y >= groundY - 10`. */
  landAboveGround: 10,
  /** `:740` — same edge bounce as `doLaunched`. */
  edgeMargin: 20,
  /** `:743` */ edgeBounceMult: 2,
} as const;

/** `NPC.as:774` — `isAirborne()`: more than 50 px above the ground. */
export const OG_NPC_AIRBORNE_ABOVE_GROUND = 50;

/** `NPC.as:777-858` — `createLoot()`. */
export const OG_NPC_LOOT = {
  /** `:792` / `:796` — a downed body's loot spills 100 px BEHIND it. */
  downedOffsetX: 100,
  /** `:805` — `<chance>` is a fraction in the roster; the roll is against 100. */
  chancePercent: 100,
  /** `:812` — `movtx = random() * 16 - 8`. */
  spreadXRange: 16,
  /** `:812` */ spreadXOffset: -8,
  /** `:813` / `:817` — within this many px of an edge the spread is flipped inward. */
  edgeMargin: 100,
  /** `:821` / `:824` — spin, signed by the spread direction. */
  rotAbs: 20,
  /** `:828` — coins: `movty = -random() * 10 - 20`. */
  coinLiftRange: 10,
  /** `:828` */ coinLiftBase: -20,
  /** `:832` — anything else: `-random() * 10 - 25`. */
  itemLiftRange: 10,
  /** `:832` */ itemLiftBase: -25,
  /** `:834` — spawned 50 px above the body. */
  spawnAboveY: 50,
  /** `:837-857` — the loot-type dispatch. */
  type: {
    /** `:837` — `1 * qty` coins. */ coin: 0,
    /** `:841` — `5 * qty` coins. */ bigCoin: 1,
    /** `:845` — the quest item. */ questItem: 2,
    /** `:849` — a random item at the mob's level. */ randomItem: 3,
  },
  /** `:839` */ coinValue: 1,
  /** `:843` */ bigCoinValue: 5,
} as const;

/**
 * `NPC.as:871-891` — `getColorXP()`: the nameplate colour band by level gap,
 * highest band first. Value 4 ≥ player + 5 · 3 ≥ player + 3 · 2 ≥ player − 2 ·
 * 1 above the grey level · 0 otherwise.
 */
export const OG_NPC_COLOUR_XP = {
  /** `:874` */ redAbove: 5,
  /** `:878` */ orangeAbove: 3,
  /** `:882` */ yellowBelow: 2,
  bands: { red: 4, orange: 3, yellow: 2, green: 1, grey: 0 },
} as const;

/**
 * `NPC.as:898-1117` — `die()`. Every dice roll is `int(Math.random() * N)`;
 * only the roll WIDTHS and the branch labels are gameplay — the blood emitters
 * each branch spawns are render (see the file header).
 */
export const OG_NPC_DEATH = {
  /** `:966` — `random() * 2 < 1`: a coin flip on whether the body turns around. */
  flipFaceDice: 2,
  /** `:941` / `:983` / `:1032` / `:1054` — the blood-placement sub-roll. */
  bloodDice: 3,
  /** `:1005` — the uncensored, fatal death picks from SEVEN. */
  fatalDice: 7,
  /** `:1096` — the censored / non-fatal death picks from FIVE. */
  gentleDice: 5,
  /** `:1006` / `:1097` — `dice <= 1` (two faces) → ENEMYDEATH. */
  plainBelow: 1,
  /** `:1012` / `:1101` */ forwardAt: 2,
  /** `:1017` / `:1105` — DEFEATED2, unless red-freeze is running. */
  defeatedAt: 3,
  /** `:1029` */ noHandAt: 4,
  /** `:1051` */ inHalfAt: 5,
} as const;

/** `NPC.as:1134-1136` / `:1153-1155` — the body fades over its last 12 frames. */
export const OG_NPC_FADE_FRAMES = 12;

/** `NPC.as:1174` — red-freeze darkens a live body by −255 (full black). */
export const OG_NPC_REDFREEZE_DARKEN = -255;

/** `MCSActor.as:1000` / `:1002` — `hp` and `maxhp` both start at 1. */
export const OG_ACTOR_HP_DEFAULT = 1;

/** `Damage.as` — the non-zero defaults and the two launch-direction encodings. */
export const OG_DAMAGE = {
  /** `Damage.as:50` — constructor default `stance:int = -1`: no stance. */
  stanceNone: -1,
  /** `Damage.as:48` — `victimPosX:int = -1`: no forced victim position. */
  victimPosNone: -1,
  /** `Damage.as:117` — `setLaunchDir(true)` stores 1 in `flyVelX`… */
  launchDirRight: 1,
  /** `Damage.as:121` — …and `false` stores 0. */
  launchDirLeft: 0,
} as const;
