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
