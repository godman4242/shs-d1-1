/**
 * THE DUELLIST PROFILE STRINGS — a Duel Mode opponent is three strings (`stats`, `eq`,
 * `skills`), and this is how the source parses them. L5-OPP slice 1a: the parse only.
 * The DERIVED stats (`StatsManager.findBonusStatFrom`, `XMLNpc.initDuelist`'s arithmetic,
 * `EnemyPlayer.init`) are slice 1b.
 *
 * Ported from the Android build for structure, with the web build's numbers (ruling R6,
 * `docs/sessions/L5_OPPONENT_KICKOFF.md`). Where the two builds differ, the web side
 * shipped and `docs/DIVERGENCES.md` "L5-OPP SLICE 1a" records both:
 *   - a battle string's fields past the 14th are dropped (Android writes them);
 *   - no modifier cap (Android clamps in `Item.parseNoQty`; the web build does not);
 *   - the skill-id floor (`OG_SKILL_ID_FLOOR`, web only);
 *   - the `^` cut on the eq and skill strings (web only). It runs AFTER the null check,
 *     which is Android's order: the web build tests `indexOf` first and throws on null.
 *
 * AS3 coerces every string field with `int()` / `uint()`: ECMA-262 ToInt32 / ToUint32
 * of ToNumber, which is what `| ZERO` / `>>> ZERO` do to `Number(x)` here. One known
 * gap: ES2015's `0b`/`0o` literals parse in JS and are NaN (so 0) in AS3. The game's
 * own strings never carry them. A signed hex (`-0x10`) is NaN in JS and in ES3's grammar;
 * AVM2 itself was not checked.
 */
import { ONE, TWO, ZERO } from '../../config/nums';
import {
  OG_BATTLE_STATS_LENGTHS,
  OG_BATTLE_STATS_ORDER,
  OG_BATTLE_STATS_WEB_LAST_FIELD,
  OG_CLAN_INVITATION_IDS,
  OG_EQUIPMENT_SLOTS,
  OG_ITEM_MOD,
  OG_ITEM_NOCOLOR,
  OG_PLAYER_STATS_COUNT,
  OG_PROFILE_SUFFIX_SEP,
  OG_SKILL_ID_FLOOR,
  OG_USE_PROCGEN_NAME,
} from '../../config/ogDuellistProfile';

/** One stat modifier on an item (`Modifier`). */
export interface ProfileModifier {
  readonly modifierID: number;
  readonly value: number;
}

/** `Item` as `parseNoQty` leaves it. Quantity is always 1 there and nothing reads it. */
export interface ProfileItem {
  readonly itemID: number;
  readonly primaryColor: number;
  readonly secondaryColor: number;
  readonly uses: number;
  /** `""` by default; `null` when a name mod has no `@value` (AS3 types `undefined` to null). */
  readonly itemName: string | null;
  readonly named: boolean;
  readonly creator: string | null;
  readonly modifiers: readonly ProfileModifier[];
}

/** `IntStat` — a skill id and its level. */
export interface SkillStat {
  readonly id: number;
  readonly value: number;
}

/** AS3 `int(x)`. `undefined` (a missing field) is 0. */
function asInt(x: string | undefined): number {
  return Number(x) | ZERO;
}

/** AS3 `uint(x)`. */
function asUint(x: string | undefined): number {
  return Number(x) >>> ZERO;
}

/** WEB ONLY: everything from the first `^` is cut (`OG_PROFILE_SUFFIX_SEP`). */
function cutSuffix(str: string): string {
  return str.split(OG_PROFILE_SUFFIX_SEP)[ZERO] ?? str;
}

function zeroVector(): number[] {
  return new Array<number>(OG_PLAYER_STATS_COUNT).fill(ZERO);
}

/**
 * `XMLNpc.parseBattleStatsString` (`XMLNpc.as:216-270`), with the web build's guard after
 * the switch: a field past the 14th is dropped (`OG_BATTLE_STATS_WEB_LAST_FIELD`).
 */
export function parseBattleStats(str: string): number[] {
  const stats = zeroVector();
  let statIndex = ZERO;
  str.split('|').forEach((field, i) => {
    statIndex = OG_BATTLE_STATS_ORDER[i] ?? statIndex;
    if (i <= OG_BATTLE_STATS_WEB_LAST_FIELD) stats[statIndex] = asInt(field);
  });
  return stats;
}

/**
 * `XMLNpc.parsePlayerStatsString` (`XMLNpc.as:688-701`). The slot-by-slot branch copies
 * `i < length - 1`: it assumes a trailing `|` and drops the last field either way.
 */
export function parsePlayerStats(str: string): number[] {
  const fields = str.split('|');
  if (OG_BATTLE_STATS_LENGTHS.includes(fields.length)) return parseBattleStats(str);
  const stats = zeroVector();
  for (let i = ZERO; i < fields.length - ONE; i++) stats[i] = asInt(fields[i]);
  return stats;
}

/** `Item.isClanInvitation` (`Item.as:165-168`). */
function isClanInvitation(id: number): boolean {
  return OG_CLAN_INVITATION_IDS.includes(id);
}

/**
 * `Item.parseNoQty` (`Item.as:106-163`): `"id"` or `"id,mod@value#mod@value#"`.
 * Modifiers are read only when there are EXACTLY two comma fields.
 */
export function parseProfileItem(str: string): ProfileItem {
  const parts = str.split(',');
  const itemID = asInt(parts[ZERO]);
  let primaryColor = OG_ITEM_NOCOLOR;
  let secondaryColor = OG_ITEM_NOCOLOR;
  let uses = ZERO;
  let itemName: string | null = '';
  let named = false;
  let creator: string | null = '';
  const modifiers: ProfileModifier[] = [];
  if (parts.length === TWO) {
    for (const mod of (parts[ONE] ?? '').split('#')) {
      if (mod === '') continue;
      const pair = mod.split('@');
      const modid = asInt(pair[ZERO]);
      const raw = pair[ONE];
      if (modid === OG_ITEM_MOD.primaryColor) {
        primaryColor = asUint(raw);
      } else if (modid === OG_ITEM_MOD.secondaryColor) {
        secondaryColor = asUint(raw);
      } else if (modid === OG_ITEM_MOD.uses) {
        uses = asInt(raw);
      } else if (modid === OG_ITEM_MOD.name) {
        itemName = raw ?? null;
        if (!isClanInvitation(itemID)) named = true;
      } else if (modid === OG_ITEM_MOD.creator) {
        // `Item.setCreator`
        creator = raw ?? null;
        if (named && itemName === OG_USE_PROCGEN_NAME) named = false;
      } else {
        modifiers.push({ modifierID: modid, value: asInt(raw) });
      }
    }
  }
  return { itemID, primaryColor, secondaryColor, uses, itemName, named, creator, modifiers };
}

/**
 * `XMLNpc.parseEquipmentString` (`XMLNpc.as:703-712`). The vector starts 13 long, all
 * null, and grows if the string has more fields; an EMPTY field is item 0, not null.
 */
export function parseEquipment(str: string): Array<ProfileItem | null> {
  const slots = new Array<ProfileItem | null>(OG_EQUIPMENT_SLOTS).fill(null);
  cutSuffix(str).split('|').forEach((field, i) => {
    slots[i] = parseProfileItem(field);
  });
  return slots;
}

/** `IntStat.parse` (`IntStat.as:19-23`), with the web build's id floor. */
function parseSkillStat(field: string): SkillStat {
  const parts = field.split(',');
  let id = asInt(parts[ZERO]);
  if (id < OG_SKILL_ID_FLOOR) id += OG_SKILL_ID_FLOOR;
  return { id, value: asInt(parts[ONE]) };
}

/**
 * `XMLNpc.parseSkillStatsString` (`XMLNpc.as:714-727`). `null` is no skills; `""` is
 * ONE skill (id 0, floored to 1000) at level 0.
 */
export function parseSkillStats(str: string | null): SkillStat[] {
  if (str === null) return [];
  return cutSuffix(str).split('|').map(parseSkillStat);
}

/**
 * `XMLNpc.getMastery` (`XMLNpc.as:671-686`): the FIRST matching id's level, else 0.
 * Its `skillList == null` branch re-parses a roster row's XML; a duellist's list is
 * always set by `initDuelist`, so that branch is never reached here.
 */
export function getMastery(skills: readonly SkillStat[], skillId: number): number {
  return skills.find((s) => s.id === skillId)?.value ?? ZERO;
}
