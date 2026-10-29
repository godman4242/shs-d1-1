/**
 * `MCSPlayer`'s body constants — the duellist's body, ported slice by slice (L5-OPP slice 3
 * on). CONTRACT: every value is read out of the source.
 *
 * Ruling R6: the ANDROID code is the structure and the WEB build's numbers win. Where the
 * web value differs, only the web line is cited and the Android value is named in prose;
 * `docs/DIVERGENCES.md` "L5-OPP SLICE 3a" has both builds' lines. Every expression is kept
 * in the source's own factors (`0.2 * m * 0.1`, not `0.02 * m`): AS3 and JS share IEEE
 * doubles, so the same factors in the same order give the same bits, and the result is
 * truncated into an `int` field.
 */
import { OG_ANIM as A, OG_STATE as S, type OgState } from './ogActor';

/**
 * WEB — `setStance`'s reach (`slashLength`) per stance. Android: light and reversed ×1.5,
 * balanced `1 + 0.5 * m * 0.01`, heavy `0.5 + 0.5 * m * 0.01`.
 */
export const OG_STANCE_REACH = {
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094` — `baseSlashLength * 1.4` */
  lightMult: 1.4,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3105` — `* (1 + 0.2 * balancedMastery * 0.1)` */
  balanced: { base: 1, perMastery: 0.2, scale: 0.1 },
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3116` — `* (0.5 + 0.4 * heavyMastery * 0.1)` */
  heavy: { base: 0.5, perMastery: 0.4, scale: 0.1 },
  /**
   * `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3117` · `MCSPlayer.as:3053` — heavy and
   * dual never reach below 100 (dual's own test: `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3143` · `MCSPlayer.as:3079`).
   */
  floor: 100,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3131` — `baseSlashLength * 1.4` */
  reversedMult: 1.4,
} as const;

/**
 * WEB — what a stance change costs in battle: `reload -= 48`, floored at 0. Android: above
 * half of `maxreload` the reload drops to a third, otherwise it loses a sixth.
 */
export const OG_STANCE_CHANGE_RELOAD = {
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3162` */
  cost: 48,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3163` — `if(reload < 0)` */
  floor: 0,
} as const;

/**
 * `initSpecialSkills`, the AI's branch (`controlledBy` 1): the mastery each special move
 * needs, per stance. The same in both builds. (The human's branch reads skill ownership
 * instead, and the opponent never enters it.)
 */
export const OG_SPECIAL_SKILL_MASTERY = {
  light: {
    /** `MCSPlayer.as:3166` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3223` */
    launch: 3,
    /** `MCSPlayer.as:3167` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3224` */
    deflect: 4,
    /** `MCSPlayer.as:3168` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3225` */
    airCombo: 5,
  },
  balanced: {
    /** `MCSPlayer.as:3174` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3231` */
    flipUp: 3,
    /** `MCSPlayer.as:3175` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3232` */
    deflect: 4,
    /** `MCSPlayer.as:3176` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3233` */
    launch: 5,
  },
  heavy: {
    /** `MCSPlayer.as:3182` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3239` */
    launch: 3,
    /** `MCSPlayer.as:3183` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3240` */
    deflect: 4,
    /** `MCSPlayer.as:3184` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3241` */
    stab: 5,
  },
} as const;

/**
 * WEB — `getDamage`'s stance multipliers. Android: light `0.5 + 0.5 * m * 0.01`, balanced
 * `1 + 0.5 * m * 0.01`, the other three ×1.5.
 */
export const OG_STANCE_DAMAGE = {
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3262` — `* (0.5 + 0.4 * lightMastery * 0.1)` */
  light: { base: 0.5, perMastery: 0.4, scale: 0.1 },
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3265` — `* (1 + 0.2 * balancedMastery * 0.1)` */
  balanced: { base: 1, perMastery: 0.2, scale: 0.1 },
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3270` — heavy, dual and reversed */
  otherMult: 1.4,
  /**
   * `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3274` — a full reload: `* 1.3 + STAT_CRITICALDMG`,
   * every stance. Android: ×1.5 in light, ×1.2 otherwise.
   */
  critMult: 1.3,
} as const;

/**
 * `initMove`'s two distance tests, on `dist * dist` (the source never takes a root). The same
 * in both builds.
 */
export const OG_MOVE_DIST_SQ = {
  /** `MCSPlayer.as:2322` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2397` — in adventure mode, a move under 25 px is refused */
  adventureMin: 625,
  /** `MCSPlayer.as:2337` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2413` — up to 100 px walks, beyond it runs */
  walkMax: 10000,
} as const;

/**
 * The AI's stroke makers (`launchTarget`, `slashDiagonalLeft` / `Right`, `stabTarget`,
 * `slashTarget`, `slashDownedTarget`) and the `makeSlash` they all end in: where a stroke
 * starts and how far each of its points steps. The same in both builds. A stroke is
 * `int(slashLength / pointGap)` points; the signs live in the port, as the source writes them.
 */
export const OG_STROKE = {
  /** `MCSPlayer.as:4722` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5091` — `slashLength / 20` points */
  pointGap: 20,
  launch: {
    /** `MCSPlayer.as:4586` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4955` */
    changeX: 0,
    /** `MCSPlayer.as:4585` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4954` — straight up */
    changeY: -20,
  },
  diagonal: {
    /** `MCSPlayer.as:4597` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4966` — radians off the angle to the target (10°) */
    angleOffset: 0.1745,
    /** `MCSPlayer.as:4600` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4969` — the stroke starts this far above the body */
    rise: 80,
    /** `MCSPlayer.as:4601` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4970` — `-20 * Math.sin(angle)`, both diagonals */
    changeY: -20,
    /** `MCSPlayer.as:4602` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4971` — the LEFT one's x is `-20 * Math.sin` too, not `cos` */
    leftChangeX: -20,
    /** `MCSPlayer.as:4618` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4987` — `20 * Math.cos(angle)` */
    rightChangeX: 20,
  },
  stab: {
    /** `MCSPlayer.as:4631` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5000` — behind the target, the way it faces */
    behind: 100,
    /** `MCSPlayer.as:4637` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5006` — the stroke ends this far below the target's y */
    below: 50,
    /** `MCSPlayer.as:4638` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5007` — it starts half a reach above that */
    lengthDiv: 2,
    /** `MCSPlayer.as:4640` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5009` */
    changeX: 0,
    /** `MCSPlayer.as:4639` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5008` — straight down */
    changeY: 20,
  },
  slash: {
    /** `MCSPlayer.as:4658` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5027` — the stroke runs this far above the target's y */
    rise: 40,
    /** `MCSPlayer.as:4673` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5042` — toward the target (negative when it is on the left) */
    changeX: 20,
    /** `MCSPlayer.as:4660` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5029` */
    changeY: -2,
    /** `MCSPlayer.as:4663` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5032` — `slashLength * 2 / 3` */
    far: { num: 2, den: 3 },
    /** `MCSPlayer.as:4667` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5036` — `slashLength / 3` */
    nearDiv: 3,
  },
  downed: {
    /** `MCSPlayer.as:4696` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5065` — behind the target, the way it faces */
    behind: 100,
    /** `MCSPlayer.as:4704` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5073` */
    rise: 10,
    /** `MCSPlayer.as:4712` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5081` */
    changeX: 20,
    /** `MCSPlayer.as:4706` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5075` — flat */
    changeY: 0,
    /** `MCSPlayer.as:4707` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5076` — the stroke is centred on the point */
    lengthDiv: 2,
  },
} as const;

/**
 * `slashType` (`MCSPlayer.as:37-53`): which stroke `initSlash` read, and so which clip
 * `startSlash` plays. The same in both builds. `LAUNCH_SLASH` (5) is declared and never read in
 * either build, so it is not carried.
 */
export const OG_SLASH_TYPE = {
  /** `MCSPlayer.as:37` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:37` */
  hor: 0,
  /** `MCSPlayer.as:39` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:39` */
  jump: 1,
  /** `MCSPlayer.as:41` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:41` */
  drop: 2,
  /** `MCSPlayer.as:43` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:43` */
  up: 3,
  /** `MCSPlayer.as:45` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:45` */
  air: 4,
  /** `MCSPlayer.as:49` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:49` */
  downstab: 6,
  /** `MCSPlayer.as:51` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:51` */
  horDown: 7,
  /** `MCSPlayer.as:53` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:53` */
  horUp: 8,
} as const;

/**
 * `initSlash` / `startSlash`: how a stroke is read and how fast the body travels it. The same
 * in both builds (the one structural difference, the downstab's side test, is in the port).
 */
export const OG_SLASH = {
  /** `MCSPlayer.as:9` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:9` — a stroke starting this close slashes where it stands; farther, it runs */
  standingRange: 50,
  /** `MCSPlayer.as:11` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:11` — a stroke this far above the body is a jump slash (and above the ground, it ends in the air) */
  jumpThreshhold: 100,
  /** `MCSPlayer.as:2424` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2496` — a light fall's stroke ending this far below the body is a drop slash */
  dropBelow: 100,
  /** `MCSPlayer.as:2437` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2509` — a stroke ending within this of its start, x-wise, and above it, is a downstab */
  stabSpanX: 50,
  /** `MCSPlayer.as:2448` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2520` — a flat stroke tilting more than this, either way, slashes up or down */
  tilt: 25,
  /** `MCSPlayer.as:2461` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2533` — the downstab lands this far short of the stroke, on the body's side */
  downstabShort: 55,
  /** `InputManager.as:53` · `reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:53` — `lengthThreshhold`: the facing reads point `lengthThreshhold - 1` */
  lengthThreshhold: 4,
  /** `MCSPlayer.as:15` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:15` — px a frame, light */
  lightSpeed: 50,
  /** `MCSPlayer.as:17` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:17` — balanced and reversed */
  balancedSpeed: 40,
  /** `MCSPlayer.as:19` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:19` — heavy and dual */
  heavySpeed: 30,
  /** `MCSPlayer.as:2703` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2775` — a shunpo slash lands where it ends and hits twice as hard */
  shunpoDamageMult: 2,
} as const;

/**
 * `endSlash` / `deductReloadBar`: where a slash leaves the body and what it costs. The same in
 * both builds.
 */
export const OG_SLASH_END = {
  /** `MCSPlayer.as:2791` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2864` — a stroke ending in the air leaves the body this far below its end, falling */
  airDrop: 90,
  /** `MCSPlayer.as:2827` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2900` — px a frame, the way the stroke's last points ran; minus this the other way */
  driftX: 5,
  /** `MCSPlayer.as:3249` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3302` — light spends half the weapon's `slashUsage` */
  lightUsageDiv: 2,
  /** `MCSPlayer.as:3257` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3310` — heavy and dual spend one and a half */
  heavyUsageMult: 1.5,
} as const;

/**
 * THE STATE MACHINE (slices 5a, 5b): `update`, `startAction`, `doAction`. The same in both builds
 * (DIVERGENCES "L5-OPP SLICE 5 — THE MAP": inside 5a and 5b every constant-bearing line pair
 * decodes to equal values).
 */
export const OG_STATE_MACHINE = {
  /** `MCSPlayer.as:13` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:13` — px a frame, RUN (`runSpeed`) */
  runSpeed: 12,
  /** `MCSPlayer.as:1230` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1282` — IDLE plays `tired` at or under `maxhp / 4` */
  tiredHpDiv: 4,
  /** `EnemyPlayer.as:52` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:52` — the AI runs on the first `update` and every 12th after */
  aiCounterMax: 12,
  /** `MCSPlayer.as:103` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:101` — no speech bubble; `update`'s tick parks the counter here once it clears the bubble */
  speechOff: -1,
  /** `MCSPlayer.as:25` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:25` — px a frame added to `velY` each FALL frame (slice 5b) */
  gravity: 3,
  /** `MCSPlayer.as:1922` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1982` — a light body falling with a slash whose first point is closer than this, x-wise, slashes */
  fallSlashRange: 50,
  /** `MCSPlayer.as:360` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:379` — a JUMP stroke's start drops the body this far under the stroke's first point (the other four stances' lines say the same) */
  jumpSlashDrop: 90,
  /** `MCSPlayer.as:500` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:519` — the downstab hits for twice `getDamage()` */
  downstabDamageMult: 2,
} as const;

/**
 * THE RECEPTION (slice 6a): `checkHitObject`'s two evades and juggle cap, and `getDefense`. WEB
 * where the builds differ (ruling R6; DIVERGENCES "L5-OPP SLICE 6 — THE MAP"). The hit guard
 * (12 frames) and the floating text are `NPC`'s own numbers on the same lines of the web
 * `checkHitObject`, so the port reads `OG_NPC_HIT_IFRAMES` and `OG_NPC_FLOATING_TEXT`.
 */
export const OG_RECEPTION = {
  /** `SkillManager.as:16` · `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:16` — SKILL_ROLL, the forward roll's dodge */
  rollSkill: 1004,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3364` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3689` (`gotHit`) — a roll at this skill level… */
  rollLevelLow: 1,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3366` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3691` — …dodges 75 in 100 (Android: 80) */
  rollChanceLow: 75,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3368` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3693` */
  rollLevelMid: 2,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3370` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3695` — the same in both builds */
  rollChanceMid: 85,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3372` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3697` — this level and up… */
  rollLevelTop: 3,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3374` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3699` — …dodge 95 in 100 (Android: 90, 95, 100 for levels 3, 4, 5) */
  rollChanceTop: 95,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3376` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3701` — `int(Math.random() * 100) < chance` */
  rollDice: 100,
  /**
   * WEB only: the full-Focus evade's passives, one per stance, which `checkHitObject` reads.
   * Absent from the Android build (its `SkillManager.as` ends at 1073) and from `skilldata.xml`.
   */
  focusEvadeSkill: {
    /** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:108` */
    light: 1074,
    /** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:110` */
    balanced: 1075,
    /** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:112` */
    heavy: 1076,
  },
  /** `MCSPlayer.as:3235` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3288` — heavy takes hits at `defense * 0.8`, truncated (`getDefense` is `:int`) */
  heavyDefenseMult: 0.8,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3581` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3860` (`gotHit`) — a launch is skipped once `juggleCount` reaches 3, unless the attacker's stance is light (Android: 3, for stance −1 only) */
  juggleCap: 3,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3583` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3864` — a light attacker juggles to 5 */
  juggleCapLight: 5,
} as const;

/**
 * THE BLOW (slice 6c): the web `gotHit`'s multipliers, and `EnemyPlayer`'s death touch. CONTRACT.
 * The roll, the juggle cap, the hit guard and the texts are `OG_RECEPTION`'s and `NPC`'s numbers
 * on `gotHit`'s own lines. AS3 stores each product into an `int`: truncated.
 */
export const OG_BLOW = {
  /** `MCSPlayer.as:3703` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3790` — the body struck by the stance it loses to takes × 1.2 */
  stanceAdvantageMult: 1.2,
  /** WEB only, `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3798` — struck by the stance it beats, × 0.9 */
  stanceDisadvantageMult: 0.9,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3807` — a head, hat or neck hit, after the defence (Android × 1.5; `NPC`'s is its own, `OG_NPC_BEHEAD_MULT`) */
  headMult: 1.3,
  /** `EnemyPlayer.as:1636` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1732` — the death touch's packet, at attacker level 0 through `gotHit`, whose floor keeps it whole (`NPC`'s own is a direct override, `OG_NPC_DEATHTOUCH_DAMAGE`) */
  deathTouchDamage: 500,
} as const;

/**
 * THE REWARD (slice 6c): `EnemyPlayer.createLoot` and `rewardXP`, the duellist's branch
 * (`isDuelist`), the same in both builds. CONTRACT.
 */
export const OG_DUELLIST_REWARD = {
  /** `EnemyPlayer.as:1296` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1361` — at this level and under the coins always drop… */
  coinLevelMax: 10,
  /** `EnemyPlayer.as:1296` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1361` — …above it, 1 in 3 (`int(Math.random() * 3) == 0`) */
  coinDice: 3,
  /** `EnemyPlayer.as:1316` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1381` — a player under this level… */
  xpLowLevelBelow: 10,
  /** `EnemyPlayer.as:1318` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1383` — …gets the plain `calcXP` × 3; from it up, `calcXP` as elite */
  xpLowLevelMult: 3,
} as const;

/**
 * THE GETUP (slice 6b): the reception's clip ends, the same in both builds. CONTRACT. The
 * mobs' humanoid getups (`OG_HUMANOID_*`, `ogNpcHumanoid.ts`) are their own classes' and step
 * 100 where this steps 120: not twins (`tests/configTwins.test.ts`, the deny-list).
 * `doLaunched`'s gravity and peak band are `NPC`'s (`OG_NPC_LAUNCH`): the override repeats
 * them on the same class chain.
 */
export const OG_GETUP = {
  /** `MCSPlayer.as:560` · `MCSPlayer.as:564` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:580` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:584` — BACKTHROW_VICTIM moves the body this far the way it faces */
  backThrowStep: 410,
  /** `MCSPlayer.as:570` · `MCSPlayer.as:574` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:590` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:594` — GETUP_FRONT steps back from the facing */
  frontStep: 40,
  /** `MCSPlayer.as:598` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:618` — GOTLAUNCHEDDOWNED moves the health bar */
  downedBarX: -100,
  /** `MCSPlayer.as:625` · `MCSPlayer.as:679` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:645` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:699` — DOWNEDUP and FLIPUP put it back */
  barXReset: 0,
  /** `MCSPlayer.as:634` · `MCSPlayer.as:638` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:654` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:658` — DOWNEDUP steps back from the facing */
  downedUpStep: 120,
} as const;

/**
 * THE SKILL IDS `SkillManager.startSkill`'s `switch` has an arm for (slice 7a): its 46 labels in
 * 38 arms, and the web's one more (1077, an arm no AI list names). CONTRACT. The web
 * `§1t120s0§.as` holds each Android constant on the same line, with the same value (the slice-7
 * map decoded all of them). SKILL_UNDYING 1068 and the stances have no arm, so they are not here.
 * Twins, pinned in `tests/configTwins.test.ts`: `OG_RECEPTION.rollSkill` is ROLL, and
 * `OG_NEW_PLAYER.skills` names JUMP, CHIPUNCH, DASHRIGHT and DASHLEFT again.
 */
export const OG_SKILL = {
  JUMP: 1003, // SkillManager.as:14
  ROLL: 1004, // SkillManager.as:16
  FOCUS: 1005, // SkillManager.as:18
  SLASHWAVE: 1006, // SkillManager.as:20
  KUNAITHROW: 1007, // SkillManager.as:22
  SMOKEBOMB: 1010, // SkillManager.as:24
  SUBSTITUTIONLOG: 1012, // SkillManager.as:26
  FIREBREATH: 1013, // SkillManager.as:28
  TRAP: 1024, // SkillManager.as:30
  TRAPFIRE: 1025, // SkillManager.as:32
  TRAPWATER: 1026, // SkillManager.as:34
  TRAPWIND: 1027, // SkillManager.as:36
  TRAPEARTH: 1028, // SkillManager.as:38
  KUNAIFIRE: 1029, // SkillManager.as:40
  KUNAIWATER: 1030, // SkillManager.as:42
  KUNAIWIND: 1031, // SkillManager.as:44
  KUNAIEARTH: 1032, // SkillManager.as:46
  GROUNDPUNCH: 1033, // SkillManager.as:48
  WINDKICK: 1034, // SkillManager.as:50
  WATERSPLASH: 1035, // SkillManager.as:52
  SHUNPO: 1039, // SkillManager.as:54
  THOUSANDSTABS: 1040, // SkillManager.as:56
  DEADLYCLEAVE: 1041, // SkillManager.as:58
  CHIPUNCH: 1042, // SkillManager.as:60
  CHIKICK: 1043, // SkillManager.as:62
  SPIRITTHIEF: 1044, // SkillManager.as:64
  CHIBURST: 1045, // SkillManager.as:66
  CHARGEDSHOT: 1046, // SkillManager.as:68
  HEAVENLYSWORDS: 1047, // SkillManager.as:70
  DEATHTOUCH: 1048, // SkillManager.as:72
  DASHRIGHT: 1049, // SkillManager.as:74
  DASHLEFT: 1050, // SkillManager.as:76
  WINDMILL: 1051, // SkillManager.as:78
  FLASHBANG: 1052, // SkillManager.as:80
  SHADOWCLONE: 1053, // SkillManager.as:82
  STEALTH: 1054, // SkillManager.as:84
  MASSCLONE: 1055, // SkillManager.as:86
  BACKTHROW: 1064, // SkillManager.as:88
  AIRSTAB: 1065, // SkillManager.as:90
  BULLCHARGE: 1066, // SkillManager.as:92
  PUNCHLUNGE: 1067, // SkillManager.as:94
  CHICHARGE: 1069, // SkillManager.as:98
  INFERNO: 1070, // SkillManager.as:100
  TSUNAMI: 1071, // SkillManager.as:102
  TORNADO: 1072, // SkillManager.as:104
  EARTHQUAKE: 1073, // SkillManager.as:106
  WEB_1077: 1077, // reference/decompiled/shs3_payload/scripts/§1t120s0§.as:114
} as const;

const K = OG_SKILL;

/**
 * `EnemyPlayer`'s four range lists, in the source's order (`EnemyPlayer.as:30-36`, the same in
 * both builds). OPP-D item 1: `getUsableSkills` never returns `veryClose` (its test is an `if`,
 * not an `else if`), so its five skills in no other list are dead on the AI.
 */
export const OG_AI_SKILL_LISTS = {
  /** `EnemyPlayer.as:30` */
  veryClose: [
    K.DEADLYCLEAVE, K.DEATHTOUCH, K.SPIRITTHIEF, K.SLASHWAVE, K.FIREBREATH, K.GROUNDPUNCH, K.WATERSPLASH, K.WINDKICK,
    K.SHUNPO, K.THOUSANDSTABS, K.CHIPUNCH, K.CHIKICK, K.CHIBURST, K.HEAVENLYSWORDS, K.FLASHBANG, K.BACKTHROW,
  ],
  /** `EnemyPlayer.as:32` */
  close: [
    K.SLASHWAVE, K.FIREBREATH, K.GROUNDPUNCH, K.WATERSPLASH, K.WINDKICK, K.SHUNPO, K.DEADLYCLEAVE, K.CHIBURST,
    K.HEAVENLYSWORDS, K.FLASHBANG, K.WINDMILL, K.BULLCHARGE, K.PUNCHLUNGE,
  ],
  /** `EnemyPlayer.as:34` */
  mid: [
    K.WINDMILL, K.DASHLEFT, K.DASHRIGHT, K.THOUSANDSTABS, K.SHUNPO, K.KUNAITHROW, K.TRAP, K.TRAPFIRE, K.TRAPWATER,
    K.TRAPWIND, K.TRAPEARTH, K.KUNAIFIRE, K.KUNAIWATER, K.KUNAIWIND, K.KUNAIEARTH, K.CHARGEDSHOT, K.HEAVENLYSWORDS,
    K.SHADOWCLONE, K.MASSCLONE, K.SUBSTITUTIONLOG, K.BULLCHARGE, K.PUNCHLUNGE,
  ],
  /** `EnemyPlayer.as:36` */
  long: [
    K.KUNAITHROW, K.TRAP, K.TRAPFIRE, K.TRAPWATER, K.TRAPWIND, K.TRAPEARTH, K.KUNAIFIRE, K.KUNAIWATER, K.KUNAIWIND,
    K.KUNAIEARTH, K.CHARGEDSHOT, K.HEAVENLYSWORDS, K.SHADOWCLONE, K.MASSCLONE, K.SUBSTITUTIONLOG, K.BULLCHARGE,
  ],
} as const;

/**
 * THE BRAIN (slice 7a): `EnemyPlayer.AI`, `getUsableSkills` and `doEvade`. CONTRACT. The same in
 * both builds but the no-target wander, where the web wins (ruling R6) and Android's is in prose.
 * Every `Math.random() * n` is a die of `n` faces; each product lands in an `int`.
 */
export const OG_AI = {
  /** `EnemyPlayer.as:1006` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1056` · `SkillManager.as:137` · `SkillManager.as:141` · `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:149` · `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:153` — a SMOKEBOMB above this level is the smoke-away: the downed AI's only skill, and `startSkill` lets it through a busy body */
  smokeAwayLevelAbove: 1,
  /** `EnemyPlayer.as:1012` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1062` — at this level and under… */
  skipLevelMax: 3,
  /** `EnemyPlayer.as:1012` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1062` — …1 in 5 AI ticks do nothing (`Math.random() * 5 < 1`) */
  skipDice: 5,
  /** WEB `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1071` — with no target, a body this close to an edge wanders (Android: 50) */
  wanderEdge: 100,
  /** WEB `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1073` — to `random * (width - 300) + 150` (Android: `- 100`, `+ 50`) */
  wanderSpan: 300,
  /** WEB `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1073` */
  wanderFrom: 150,
  /** `EnemyPlayer.as:1036` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1086` — at peace, an IDLE body this close to its target walks away */
  peacefulNear: 100,
  /** `EnemyPlayer.as:1044` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1094` — a hidden target: 1 in 3 ticks wander */
  hiddenDice: 3,
  /** `EnemyPlayer.as:1050` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1100` — above this level the body evades the human's slash… */
  evadeLevelAbove: 3,
  /** `EnemyPlayer.as:1050` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1100` — …2 in 3 times (`int(Math.random() * 3) <= 1`) */
  evadeDice: 3,
  /** `EnemyPlayer.as:1050` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1100` */
  evadeRollMax: 1,
  /** `EnemyPlayer.as:1079` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1129` — the air stab on a downed target farther than this… */
  airStabNear: 50,
  /** `EnemyPlayer.as:1079` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1129` — …and nearer than this */
  airStabFar: 200,
  /** `EnemyPlayer.as:1088` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1138` — no stab: a coin between the downed slash and a wander */
  downedDice: 2,
  /** `EnemyPlayer.as:1099` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1149` — an airborne target this close takes a diagonal */
  airComboRange: 120,
  /** `EnemyPlayer.as:1116` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1166` — 1 in 4 ticks try a skill */
  skillDice: 4,
  /** `EnemyPlayer.as:1126` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1176` — the charge the AI writes before a skill it never charges (OPP-D item 6) */
  chargedShotTime: 48,
  /** `EnemyPlayer.as:1131` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1181` */
  shunpoTime: 96,
  /** `EnemyPlayer.as:1136` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1186` */
  thousandStabsTime: 96,
  /** `EnemyPlayer.as:1141` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1191` */
  deadlyCleaveTime: 120,
  /** `EnemyPlayer.as:1160` · `EnemyPlayer.as:1162` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1210` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1212` — under this reload the body re-rolls `doReload` in `[24, maxreload)` */
  reloadFloor: 24,
  /** `EnemyPlayer.as:1172` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1222` — 1 in 3 strokes launch, when the body can */
  launchDice: 3,
  /** `EnemyPlayer.as:1416` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1509` — `doSkill`'s default point: no drag target */
  noPos: -1,
  /** `MCSPlayer.as:151` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:151` — `doReload` before the first re-roll: any reload is at or above it */
  doReloadStart: -1,
} as const;

/** `getUsableSkills`' three squared ranges (`EnemyPlayer.as:1389-1397` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1480-1488`). CONTRACT. */
export const OG_AI_RANGE_SQ = {
  /** `EnemyPlayer.as:1389` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1480` — the very-close list's test, overwritten by the next (OPP-D item 1) */
  veryClose: 40000,
  /** `EnemyPlayer.as:1393` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1484` */
  close: 90000,
  /** `EnemyPlayer.as:1397` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1488` */
  mid: 160000,
} as const;

/** `doEvade`'s fallback stroke, when no evasive skill starts. CONTRACT, the same in both builds. */
export const OG_EVADE = {
  /** `EnemyPlayer.as:1253` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1314` — one of four strokes */
  dice: 4,
  /** `EnemyPlayer.as:1256` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1317` — the two diagonals start `random * 100 + 80` above the body */
  riseDice: 100,
  /** `EnemyPlayer.as:1256` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1317` */
  rise: 80,
  /** `EnemyPlayer.as:1257` · `EnemyPlayer.as:1258` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1318` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1319` — radians, 60° */
  angle: 1.047,
  /** `EnemyPlayer.as:1258` · `EnemyPlayer.as:1270` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1319` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1331` — the step, `20 * cos` / `-20 * sin` on the diagonals, flat 20 away from the target */
  step: 20,
  /** `EnemyPlayer.as:1267` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1328` — the flat stroke runs this far above the body */
  flatRise: 50,
} as const;

/**
 * The cooldown scale (`XMLSkill.getCooldown` × `StatsManager.getSkillCooldownModifier`): the
 * HUMAN's speed, not the body's (OPP-D item 7). WEB (ruling R6, ERRATUM 5): `/ 600`, capped at 600;
 * Android `/ 300`, capped at 300. CONTRACT.
 */
export const OG_COOLDOWN_SPEED = {
  /** `StatsManager.as:1849` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2284` — a speed buff × 1.5, into an `int` */
  buffMult: 1.5,
  /** WEB `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2291` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2295` — the cap and the divisor (Android 300) */
  cap: 600,
  /** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2295` — at the cap, half the cooldown */
  scale: 0.5,
} as const;

/** `getChargingTime`: `chargingTime / 24` (the frame rate, `OG_FPS`), capped. CONTRACT, the same in both builds. */
export const OG_CHARGING = {
  /** `MCSPlayer.as:4347` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4716` */
  cap: 10,
} as const;

/**
 * THE EVASION (slice 7b): the numbers the evasion states, the dash/backstep FX and the
 * NINJASMOKEBOMB clip end carry. CONTRACT, line-cited in both builds where they agree.
 */
export const OG_EVASION = {
  /** `MCSPlayer.as:1480` — JUMP_STATE's launch velocity */
  jumpVelY: -30,
  /** `MCSPlayer.as:1985` — JUMP_STATE's gravity per frame */
  jumpGravity: 4,
  /** `MCSPlayer.as:1988` — JUMP_STATE's horizontal travel per frame */
  jumpStep: 8,
  /** `MCSPlayer.as:1975` — FORWARDROLL's move on its END clip */
  forwardRollStep: 10,
  /** `MCSPlayer.as:752` — NINJASMOKEBOMB's smoke escape distance */
  smokeEscape: 400,
  /** `MCSPlayer.as:1497` — SMOKEBOMB2's airborne move */
  smokeBomb2AirMove: 100,
  /** `MCSPlayer.as:1523` — SMOKEBOMB2's airborne lift (web) */
  smokeBomb2Lift: 250,
  /** `MCSPlayer.as:1522` — SMOKEBOMB2's fall velocity (web quirk) */
  smokeBomb2VelX: -3,
  /** `MCSPlayer.as:1803` — DASH_STATE's velocity */
  dashVel: 50,
  /** `MCSPlayer.as:1816` — BACKSTEP_STATE's velocity */
  backstepVel: 50,
  /** `MCSPlayer.as:1520` — SMOKEBOMB2's ground lift */
  smokeBomb2GroundLift: 3,
  /** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1581` — SMOKEBOMB2's juggle count on the ground branch (web) */
  smokeBomb2Juggle: 5,
} as const;

/**
 * The labels of the three switches, in source order, transcribed from the Android build's
 * names (`scripts/gates` has no decoder for the web's; the slice-5 map paired every group
 * across the builds). A label the port has not reached yet goes through ONE `unported` site
 * per switch; a value with no label is the source's no-op. Pinned against the source by
 * `tests/mcsPlayer.test.ts`.
 */
/** `update`'s clip-end `switch` (Android `MCSPlayer.as:298-1147`; web, moved whole into a helper that returns `false` on `default`, `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:305-1177`): 146 labels. */
export const OG_CLIP_END_LABELS: readonly string[] = [
  A.SHEATHESWORDCHIBURI, A.SHEATHESWORD, A.SHEATHETOIDLE, A.LIGHTSLASH_START,
  A.LIGHTSLASHDOWN_START, A.LIGHTSLASHUP_START, A.BALANCEDSLASH_START, A.BALANCEDSLASHDOWN_START,
  A.BALANCEDSLASHUP_START, A.HEAVYSLASH_START, A.HEAVYSLASHDOWN_START, A.HEAVYSLASHUP_START,
  A.DUALSLASH_START, A.DUALSLASHDOWN_START, A.DUALSLASHUP_START, A.REVERSEDSLASH_START,
  A.LIGHTJUMPSLASH_START, A.BALANCEDJUMPSLASH_START, A.HEAVYJUMPSLASH_START, A.DUALJUMPSLASH_START,
  A.REVERSEDJUMPSLASH_START, A.LIGHTFALLSLASH_START, A.BALANCEDFALLSLASH_START, A.HEAVYFALLSLASH_START,
  A.DUALFALLSLASH_START, A.REVERSEDFALLSLASH_START, A.LIGHTSLASH_END, A.LIGHTSLASHDOWN_END,
  A.LIGHTSLASHUP_END, A.BALANCEDSLASH_END, A.BALANCEDSLASHDOWN_END, A.BALANCEDSLASHUP_END,
  A.HEAVYSLASH_END, A.HEAVYSLASHDOWN_END, A.HEAVYSLASHUP_END, A.DUALSLASH_END,
  A.DUALSLASHDOWN_END, A.DUALSLASHUP_END, A.REVERSEDSLASH_END, A.LIGHTSLASH_POSE,
  A.LIGHTSLASHDOWN_POSE, A.LIGHTSLASHUP_POSE, A.BALANCEDSLASH_POSE, A.BALANCEDSLASHDOWN_POSE,
  A.BALANCEDSLASHUP_POSE, A.HEAVYSLASH_POSE, A.HEAVYSLASHDOWN_POSE, A.HEAVYSLASHUP_POSE,
  A.DUALSLASH_POSE, A.DUALSLASHDOWN_POSE, A.DUALSLASHUP_POSE, A.REVERSEDSLASH_POSE,
  A.LIGHTJUMPSLASH_LAND, A.BALANCEDJUMPSLASH_LAND, A.HEAVYJUMPSLASH_LAND, A.DUALJUMPSLASH_LAND,
  A.REVERSEDJUMPSLASH_LAND, A.LIGHTFALLSLASH_END, A.BALANCEDFALLSLASH_END, A.HEAVYFALLSLASH_END,
  A.DUALFALLSLASH_END, A.REVERSEDFALLSLASH_END, A.DOWNSTAB, A.DOWNSTAB_UP,
  A.DEFEATED1, A.ENEMYDEATH, A.DEATH_FORWARD, A.DEFEATED2,
  A.ENEMYDEATHNOHEAD, A.ENEMYDEATHNOHAND, A.DEATHDOWNED, A.DEATHINHALF,
  A.SEPPUKU_END, A.SEPPUKU_NOHEAD, A.FLY_END, A.KNEEGROIN_VICTIM,
  A.BACKTHROW_VICTIM, A.GETUP_FRONT, A.GOTLAUNCHED_PEAK, A.GOTLAUNCHEDDOWNED,
  A.GOTLAUNCHEDDOWNEDEND, A.DOWNEDUP, A.DOWNEDUP2, A.BACKTHROW,
  A.FLIPUP, A.FORWARDROLL_END, A.SHEATHEDLAND, A.KUNAITHROW,
  A.KATANAATTACK, A.PICKUP, A.PUNCH, A.SPARTAKICK_END,
  A.PUNCH_END, A.KNEEGROIN, A.BOW, A.BOW2,
  A.THROWGRENADE, A.JUTSU_GROUND_PARTB, A.CHARGEDSHOT_END, A.CHICHARGE_END,
  A.SEPPUKU_START, A.SEPPUKU_MID, A.FLINCH_WEAPON, A.FLINCH,
  A.FORWARDROLL_START, A.NINJASMOKEBOMB, A.JUTSU_BLOW_PARTA, A.JUTSU_BLOW_PARTB,
  A.GROUNDPUNCH_PARTA, A.GROUNDPUNCH_PARTB, A.STOMP_PARTA, A.STOMP_PARTB,
  A.PUNCHCOMBO_PARTA, A.PUNCHCOMBO_PARTB, A.PUNCHCOMBO_PARTC, A.PUNCHCOMBO_PARTD,
  A.CLEAVE_END, A.CLEAVE_POSE, A.FLURRY_PARTB, A.FLURRY_PARTC,
  A.FLURRY_PARTD, A.FLURRY_POSE, A.SPARTAKICK_START, A.PUNCH_START,
  A.JUTSU_GROUND_PARTA, A.DEATHTOUCH_PARTA, A.DEATHTOUCH_PARTB, A.DEATHTOUCH_PARTC,
  A.DEATHTOUCH_PARTD, A.SHUNPO_END, A.DASH_START, A.BACKSTEP_START,
  A.DASH_END, A.BACKSTEP_END, A.FOCUS_START, A.FOCUS_END,
  A.AIRSTAB_START, A.AIRSTAB_MID, A.AIRSTAB_STAB, A.AIRSTAB_END,
  A.BULLCHARGE_START, A.PUNCHLUNGE_START, A.PUNCHLUNGE_MID, A.PUNCHLUNGE_END,
  A.ZOM_GETUP, A.CHICHARGE_START,
];

/** `startAction`'s `switch` (Android `MCSPlayer.as:1227-1874`; web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1279-1933`): 35 labels. */
export const OG_START_ACTION_LABELS: readonly OgState[] = [
  S.IDLE, S.RUN, S.WALK, S.FALL, S.SLASH,
  S.POSE, S.REDFREEZE, S.GOTLAUNCHED, S.KNOCKDOWNED, S.DOWNED,
  S.FORWARDROLL, S.JUMP, S.LAND, S.SMOKEBOMB, S.SMOKEBOMB2,
  S.LOGSUBSTITUTION, S.WINDKICK, S.SKILL_SPIRITTHIEF, S.SKILL_BACKTHROW, S.SKILL_DEATHTOUCH,
  S.CHARGING, S.SKILL_SHUNPO, S.SKILL_THOUSANDSTABS, S.SKILL_DEADLYCLEAVE, S.DOSKILL,
  S.DASH, S.BACKSTEP, S.SKILL_FLASHBANG, S.SKILL_STEALTH, S.SKILL_SHADOWCLONE,
  S.SKILL_MASSCLONE, S.SKILL_SUBSTITUTIONLOG, S.SKILL_BULLCHARGE, S.SKILL_UNDYING, S.SKILL_CHICHARGE,
];

/** `doAction`'s `switch` (Android `MCSPlayer.as:1885-2234`; web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:1945-2308`): 27 labels. */
export const OG_DO_ACTION_LABELS: readonly OgState[] = [
  S.IDLE, S.RUN, S.WALK, S.FALL, S.GOTLAUNCHED,
  S.FLY, S.STUN, S.DOWNED, S.SLASH, S.REDFREEZE,
  S.FORWARDROLL, S.JUMP, S.LAND, S.DYING, S.WINDKICK,
  S.SKILL_DEATHTOUCH, S.CHARGING, S.SKILL_SHUNPO, S.SKILL_THOUSANDSTABS, S.SKILL_DEADLYCLEAVE,
  S.DOSKILL, S.DASH, S.BACKSTEP, S.POSE, S.SKILL_BULLCHARGE,
  S.SKILL_UNDYING, S.SKILL_CHICHARGE,
];
