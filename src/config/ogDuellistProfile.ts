/**
 * OG_DUELLIST_* — every number in the three strings a Duel Mode opponent is made of
 * (`stats`, `eq`, `skills`), as `XMLNpc.as` parses them. Lane L5-OPP, slice 1a.
 * Hand-written against the source with a line cite on every value;
 * `tests/duellistProfile.test.ts` drives `core/npc/duellistProfile.ts` through them.
 *
 * ALL CONTRACT.
 *
 * ⚠️ RULING R6 (`docs/sessions/L5_OPPONENT_KICKOFF.md`, ERRATUM 2 item 8): the ANDROID
 * code is the structure, the WEB build's numbers win. So every value below carries TWO
 * cites, the Android line and its web twin (`reference/decompiled/shs3_payload/…`), and
 * claimcheck checks BOTH at ±0. A web number that drifted from the Android one would go
 * red here instead of shipping silently. Three values exist in the web build only; each
 * says so and names its ruling (`docs/DIVERGENCES.md`, "L5-OPP SLICE 1a").
 *
 * ⚠️ C2 — the Android scripts are v0.682, the web ones v0.717.
 */

/**
 * `StatsManager.as:104` — `playerStatsCount:int = 44`: a parsed stats vector's length.
 * Web: `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:128`.
 */
export const OG_PLAYER_STATS_COUNT = 44;

/**
 * The stat slots a battle string writes (`StatsManager.as`). The web twin of every
 * index is the same number, in `§1t1523s0§.as` (web cites on each line).
 */
export const OG_STAT = {
  /** `StatsManager.as:170` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:204` */
  hp: 0,
  /** `StatsManager.as:172` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:206` */
  maxHp: 1,
  /** `StatsManager.as:176` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:210` */
  chi: 3,
  /** `StatsManager.as:178` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:212` */
  maxChi: 4,
  /** `StatsManager.as:182` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:216` */
  attack: 6,
  /** `StatsManager.as:184` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:218` */
  defense: 7,
  /** `StatsManager.as:186` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:220` */
  speed: 8,
  /** `StatsManager.as:226` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:260` */
  fireAtk: 28,
  /** `StatsManager.as:228` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:262` */
  windAtk: 29,
  /** `StatsManager.as:230` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:264` */
  waterAtk: 30,
  /** `StatsManager.as:232` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:266` */
  earthAtk: 31,
  /** `StatsManager.as:238` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:272` */
  buffType: 38,
  /** `StatsManager.as:240` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:274` */
  buffExpiry: 39,
  /** `StatsManager.as:242` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:276` */
  buff2Expiry: 40,
} as const;

/**
 * `parseBattleStatsString`'s switch, as data: field `i` of a battle string lands in stat
 * slot `OG_BATTLE_STATS_ORDER[i]`. The same 14 cases in both builds (web `§1t9220s0§`).
 * What happens to a field past the 14th differs: see `OG_BATTLE_STATS_WEB_LAST_FIELD`.
 */
export const OG_BATTLE_STATS_ORDER: readonly number[] = [
  OG_STAT.hp, OG_STAT.maxHp, OG_STAT.chi, OG_STAT.maxChi, OG_STAT.attack, OG_STAT.defense,
  OG_STAT.speed, OG_STAT.fireAtk, OG_STAT.windAtk, OG_STAT.waterAtk, OG_STAT.earthAtk,
  OG_STAT.buffType, OG_STAT.buffExpiry, OG_STAT.buff2Expiry,
];

/**
 * WEB ONLY — `reference/decompiled/shs3_payload/scripts/§1t76s0§.as:277`: the web battle
 * parse writes a field only `if(_loc5_ <= 13)`, so fields 14–17 of an 18-field string are
 * DROPPED. Android's `parseBattleStatsString` has no guard (it writes every field) and no
 * switch default, so there fields 14–17 overwrite `buff2Expiry` and the last wins. Ruled WEB
 * (DIVERGENCES "L5-OPP SLICE 1a"): `buff2Expiry` feeds `initDuelist`'s halving test.
 */
export const OG_BATTLE_STATS_WEB_LAST_FIELD = 13;

/**
 * `XMLNpc.as:691` — a stats string of EXACTLY 14 or 18 fields is a battle string; any
 * other length is read slot-by-slot. Web: `reference/decompiled/shs3_payload/scripts/§1t76s0§.as:902`.
 */
export const OG_BATTLE_STATS_LENGTHS: readonly number[] = [14, 18];

/**
 * `XMLNpc.as:705` — `new Vector.<Item>(13)`: the equipment vector's starting length.
 * Web: `reference/decompiled/shs3_payload/scripts/§1t76s0§.as:922`.
 */
export const OG_EQUIPMENT_SLOTS = 13;

/**
 * `Item.as:6` — `NOCOLOR:uint = 1`: a colour slot nobody set.
 * Web: `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:6`.
 */
export const OG_ITEM_NOCOLOR = 1;

/**
 * The modifier ids `Item.parseNoQty` reads as item FIELDS rather than stat modifiers.
 * Every other id becomes a stat modifier. The web build reads three more (206–208,
 * web `Item` = `§1t17s0§`): the Android port adds them as ordinary modifiers, and no
 * stat id reaches 206 (the highest, `STAT_PIERCINGDMG`, is 205).
 */
export const OG_ITEM_MOD = {
  /** `Item.as:8` · `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:8` */
  primaryColor: 80,
  /** `Item.as:10` · `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:10` */
  secondaryColor: 81,
  /** `Item.as:12` · `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:12` */
  uses: 82,
  /** `Item.as:14` · `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:14` */
  name: 89,
  /** `Item.as:16` · `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:16` */
  creator: 125,
} as const;

/**
 * `Item.as:167` — `isClanInvitation`: a name on these two items does NOT make them
 * `named`. Web: `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:222`.
 */
export const OG_CLAN_INVITATION_IDS: readonly number[] = [2213, 2214];

/**
 * `Item.USEPROCGENNAME = "0"`: a creator mod on an item whose name is this string
 * clears `named` again (`Item.setCreator`). A string, so claimcheck has no number to
 * check; the web twin is `§1t17s0§.as`'s `§1t8742s0§`, the same "0".
 */
export const OG_USE_PROCGEN_NAME = '0';

/**
 * WEB ONLY — `reference/decompiled/shs3_payload/scripts/§1t76s0§.as:301` calls
 * `IntStat.parse(field, 1000)`, and the web `IntStat.parse` (`§1t57s0§`) adds that floor
 * to any skill id below it. Android's `IntStat.parse` has no floor.
 * Ruled IN (DIVERGENCES "L5-OPP SLICE 1a"): all 75 skill-table ids sit at 1000 or
 * above (1000..1501, `ogSkills.ts`, the Android table; the web payload has none), so
 * the floor maps a short legacy id onto the table and leaves a well-formed one
 * unchanged. `tests/duellistProfile.test.ts` pins that premise.
 */
export const OG_SKILL_ID_FLOOR = 1000;

/**
 * WEB ONLY — `§1t1701s0§.as`'s `§1t11255s0§ = "^"`: the web build cuts the eq and skill
 * strings at the first `^` before parsing. Android has no cut. Ruled IN with the floor
 * above: a no-op on a string without `^`, and the web format on one with it.
 */
export const OG_PROFILE_SUFFIX_SEP = '^';
