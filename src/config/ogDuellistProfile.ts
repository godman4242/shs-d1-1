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
  /** `StatsManager.as:250` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:288` */
  fireDef: 200,
  /** `StatsManager.as:252` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:290` */
  windDef: 201,
  /** `StatsManager.as:254` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:292` */
  waterDef: 202,
  /** `StatsManager.as:256` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:294` */
  earthDef: 203,
  /** `StatsManager.as:258` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:296` */
  criticalDmg: 204,
  /** `StatsManager.as:260` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:298` */
  piercingDmg: 205,
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

// ─── L5-OPP slice 1b-i: THE DERIVED STATS (`XMLNpc.initDuelist`, `findBonusStatFrom`) ───

/** The equipment slots `initDuelist` and `findBonusStatFrom` name (`StatsManager.EQ_*`). */
export const OG_EQ = {
  /** `StatsManager.as:266` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:304` */
  hair: 2,
  /** `StatsManager.as:270` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:308` */
  head: 4,
  /** `StatsManager.as:274` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:312` */
  neck: 6,
  /** `StatsManager.as:280` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:318` */
  weapon: 9,
  /** `StatsManager.as:282` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:320` */
  scabbard: 10,
} as const;

/**
 * `StatsManager.as:2036` — `findBonusStatFrom` reads only the first 13 slots, even when a
 * long eq string grew the vector. Web: `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2474`.
 */
export const OG_BONUS_SLOTS = 13;

/**
 * The slots `findBonusStatFrom` skips. Android skips head, neck and scabbard; the WEB
 * build also skips hair (ruled WEB, DIVERGENCES "L5-OPP SLICE 1b-i"). No hair item carries
 * a defense or a table modifier, so only a hair item's OWN modifiers are lost.
 */
export const OG_BONUS_SKIPPED_SLOTS: readonly number[] = [OG_EQ.head, OG_EQ.neck, OG_EQ.scabbard, OG_EQ.hair];

/** The buff types `initDuelist` tests (`StatsManager.BUFF_*`). */
export const OG_BUFF = {
  /** `StatsManager.as:290` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:328` */
  attack: 1,
  /** `StatsManager.as:292` · `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:330` */
  defense: 2,
} as const;

/**
 * WEB ONLY — `reference/decompiled/shs3_payload/scripts/§1t76s0§.as:378` (attack) and
 * `reference/decompiled/shs3_payload/scripts/§1t76s0§.as:382` (defense): a live buff multiplies
 * the stat by 1.5, truncated into an `int`. Android `initDuelist` has no buff branch.
 */
export const OG_BUFF_MULT = 1.5;

/**
 * `XMLNpc.as:354` — no weapon (or one the item table lacks): `slashUsage = 48`.
 * Web: `reference/decompiled/shs3_payload/scripts/§1t76s0§.as:413`.
 */
export const OG_UNARMED_SLASH_USAGE = 48;

/**
 * `XMLNpc.as:361` — a weapon's `slashusage` below 48 is raised to 48.
 * Web: `reference/decompiled/shs3_payload/scripts/§1t76s0§.as:420`.
 */
export const OG_SLASH_USAGE_FLOOR = 48;

/**
 * `XMLItem.as:158` — an item row with no `slashusage` reads as 48.
 * Web: `reference/decompiled/shs3_payload/scripts/§1t104s0§.as:170`.
 */
export const OG_ITEM_DEFAULT_SLASHUSAGE = 48;

/**
 * `XMLItem.as:76` — an item row with no `type` reads as type 0 (the 153 untyped rows, the
 * 4k armour band among them). Web: `reference/decompiled/shs3_payload/scripts/§1t104s0§.as:74`.
 */
export const OG_ITEM_DEFAULT_TYPE = 0;

/**
 * `XMLNpc.as:395` — the paperdoll's weapon when the weapon slot is item 0.
 * Web: `reference/decompiled/shs3_payload/scripts/§1t76s0§.as:486`.
 */
export const OG_DEFAULT_WEAPON_ART = 13001;

/**
 * WEB ONLY — the web `Item.getModifiers` (`§1t17s0§.as`, `§1t522s0§`), which web
 * `findBonusStatFrom` sums instead of Android's own-list-plus-table loops. An item's OWN
 * modifier of one of these kinds turns into max-HP, pooled; a pool above zero is added
 * to the item's last own max-HP modifier (capped) or pushed as a new, UNCAPPED one; a
 * pool at or below zero is dropped. Ruled WEB, DIVERGENCES "L5-OPP SLICE 1b-i".
 */
export const OG_MOD_TO_HP = {
  /** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1670` — defense on a ring or amulet. */
  defenseOnTypes: [11] as readonly number[],
  /** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1674` — attack on armour or a hat. */
  attackOnTypes: [0, 3] as readonly number[],
  /** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1697` — the cap when the pool merges. */
  mergedCap: 173,
} as const;

/**
 * WEB ONLY — `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1709`: a table
 * modifier with one of these ids is always pushed as its own entry, never merged into an
 * own modifier of the same id.
 */
export const OG_MOD_NEVER_MERGED: readonly number[] = [103, 106];

/**
 * `XMLNpc.DEFAULT_EQSTRING`, the eq string of a duellist whose own is empty. A string, so
 * claimcheck has no number to check; web twin `§1t76s0§`'s `§1t9212s0§`, the same string.
 */
export const OG_DEFAULT_EQSTRING = '4017|0|6019|0|8005|0|0|11017|12017|13002|13002|0|0';

/** `initDuelist`'s stats string when its own is empty: 14 zeros, a battle string. Same in both builds. */
export const OG_DEFAULT_STATS_STRING = '0|0|0|0|0|0|0|0|0|0|0|0|0|0';

// ─── L5-OPP slice 1b-ii: THE BODY (`EnemyPlayer.init`, `MCSPlayer.initPlayer` & co.) ───

/**
 * `EnemyPlayer.init`'s speed formulas (`EnemyPlayer.as:754-757`; web
 * `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:771-774`, the same literals):
 * `baseReload = 48 + speed * 6` and `baseSlashLength = 120 + floor(90 * speed / (20 + speed))`.
 * The slash formula is `REACH`'s (`reach.ts`, the player's) with no dan term;
 * `tests/duellistBody.test.ts` pins the three shared numbers equal.
 */
export const OG_DUELLIST_SPEED = {
  /** `EnemyPlayer.as:754` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:771` */
  reload: { base: 48, perSpeed: 6 },
  /** `EnemyPlayer.as:756-757` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:773-774` */
  slashLength: { base: 120, maxIncrement: 90, halfSpeed: 20 },
} as const;

/** The skills `EnemyPlayer.init` reads with `getMastery` to pick the stance. */
export const OG_STANCE_SKILL = {
  /** `EnemyPlayer.as:758` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:775` */
  light: 1000,
  /** `EnemyPlayer.as:759` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:776` */
  balanced: 1001,
  /** `EnemyPlayer.as:760` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:777` */
  heavy: 1002,
  /** `EnemyPlayer.as:836` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:862` */
  reversed: 1500,
  /** `EnemyPlayer.as:840` · `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:866` */
  dual: 1501,
} as const;

/** `MCSPlayer`'s stance ids, the argument `setStance` receives. */
export const OG_STANCE = {
  /** `MCSPlayer.as:27` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:27` */
  light: 0,
  /** `MCSPlayer.as:29` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:29` */
  balanced: 1,
  /** `MCSPlayer.as:31` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:31` */
  heavy: 2,
  /** `MCSPlayer.as:33` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:33` */
  dual: 3,
  /** `MCSPlayer.as:35` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:35` */
  reversed: 4,
} as const;

/**
 * `EnemyPlayer.as:846` — equal masteries: `setStance(Math.random() * 3)`, which the `int`
 * parameter truncates to 0, 1 or 2. Web: `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:872`.
 */
export const OG_RANDOM_STANCE_COUNT = 3;

/**
 * WEB ONLY — `reference/decompiled/shs3_payload/scripts/§1t76s0§.as:104`: `XMLNpc.stance`
 * starts at -1, and `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:858` skips the
 * mastery pick only when it is not -1. Android `initDuelist` has no stance argument.
 */
export const OG_NO_STANCE = -1;

/**
 * WEB — a duellist's level scaling (`reference/decompiled/shs3_payload/scripts/§1t122s0§.as:812-821`):
 * above 30 and below 80, `minDamage` and max-HP ×1.1; below 10, ×0.9; each truncated into an
 * `int`. Android scales every level above 30 and uses ×0.8 below 10 (DIVERGENCES "L5-OPP SLICE
 * 1b-ii" has both builds' lines).
 */
export const OG_DUELLIST_LEVEL_SCALE = {
  /** `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:812` — `level > 30 && level < 80` */
  strong: { above: 30, below: 80 },
  /** `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:814` */
  strongMult: 1.1,
  /** `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:818` — `level < 10` */
  weakBelow: 10,
  /** `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:820` */
  weakMult: 0.9,
} as const;

/** `MCSPlayer.initPlayer`'s constants. */
export const OG_BODY_INIT = {
  /** `MCSPlayer.as:207` · `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:208` */
  walkSpeed: 4,
  /**
   * WEB — `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249`: `maxreload = 8 * 24`,
   * seconds at OG_FPS. Android `initPlayer` has `5 * 24`.
   */
  maxReloadSec: 8,
} as const;

/** `EnemyPlayer.as:816` — `xp = level * 5 + 45`. Web: `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:836`. */
export const OG_DUELLIST_XP = { perLevel: 5, base: 45 } as const;
