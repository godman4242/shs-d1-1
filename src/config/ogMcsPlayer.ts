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
