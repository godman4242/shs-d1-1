/**
 * THE DUELLIST PROFILE WRITERS — how a player's state becomes the three strings (`stats`,
 * `eq`, `skills`) that another player's Duel Mode fights. L5-OPP slice 2. The source saves
 * them (`QueryManagerBase.as:1900-1908`; web
 * `reference/decompiled/shs3_payload/scripts/§1t1832s0§.as:1882-1890`), so what these write
 * is a real profile by construction, and `duellistProfile.ts` parses it back.
 *
 * `StatsManager.getBattleStatsString` / `getEquipmentString` / `getSkillStatsString` and
 * `Item.toStringNoQty` (`StatsManager.as:4396-4463`, `Item.as:229-261`), ported from the
 * Android build for structure with the WEB build's differences (ruling R6), each ruled in
 * `docs/DIVERGENCES.md` "L5-OPP SLICE 2":
 *   - the battle string is 18 fields: the web writer appends the weapon row's damage and
 *     slash cost and the total defense (`OG_BATTLE_WRITE_WEAPON`);
 *   - the eq and skill strings end in `^` + a checksum unless the caller passes `false`
 *     (the save and the duel calls use the default);
 *   - an item with a creator and nothing else still gets its comma.
 * Not ported: the web item's fields 206–208 (xp, xp level, and a third). The 1a parse keeps
 * them as ordinary modifiers, so they are written in the modifier run. The web writes 206/207
 * after the colours (207 only beside a 206, and not when 0) and 208 after the uses, outside
 * its comma test. No save the game makes hits the difference (DIVERGENCES "L5-OPP SLICE 2").
 *
 * `newPlayerState` is `StatsManager.initNewPlayer`: the state the R1 ruling feeds these.
 */
import { ZERO } from '../../config/nums';
import {
  OG_BATTLE_STATS_ORDER,
  OG_BATTLE_WRITE_WEAPON,
  OG_CLAN_INVITATION_IDS,
  OG_EQ,
  OG_ITEM_DEFAULT_SLASHUSAGE,
  OG_ITEM_MOD,
  OG_ITEM_NOCOLOR,
  OG_NEW_PLAYER,
  OG_PLAYER_STATS_COUNT,
  OG_PROFILE_CHECKSUM_MOD,
  OG_PROFILE_SUFFIX_SEP,
  OG_STAT,
} from '../../config/ogDuellistProfile';
import type { ProfileItem, SkillStat } from './duellistProfile';
import { findBonusStat, ITEM_ROWS } from './duellistStats';

/** What `StatsManager` holds for one player: `playerStats`, `equipment`, `skillStats`. */
export interface ProfileState {
  readonly stats: readonly number[];
  readonly equipment: readonly ProfileItem[];
  readonly skills: readonly SkillStat[];
}

/** WEB `§1t9731s0§`: the char-code sum, as an `int`, mod `OG_PROFILE_CHECKSUM_MOD`. */
export function profileChecksum(str: string): number {
  let sum = ZERO;
  for (let i = ZERO; i < str.length; i++) sum = (sum + str.charCodeAt(i)) | ZERO;
  return sum % OG_PROFILE_CHECKSUM_MOD;
}

/** Web: `str + "^" + checksum(str)` when the caller asks for it (the default). */
function withChecksum(str: string, checksum: boolean): string {
  return checksum ? `${str}${OG_PROFILE_SUFFIX_SEP}${profileChecksum(str)}` : str;
}

/**
 * `Item.toStringNoQty`, with the web comma test
 * (`reference/decompiled/shs3_payload/scripts/§1t17s0§.as:330`), which adds
 * `creator != ""`. Android's (`Item.as:232`) does not, so a creator-only item is written
 * `"4017125@bob#"` there and parses back as item 0. AS3 writes a null name or creator as
 * `"null"`, as the template literal does.
 */
export function writeProfileItem(it: ProfileItem): string {
  let str = String(it.itemID);
  const noColor = OG_ITEM_NOCOLOR;
  if (it.modifiers.length > ZERO || it.primaryColor !== noColor || it.secondaryColor !== noColor ||
    it.uses > ZERO || it.named || it.creator !== '') {
    str += ',';
  }
  for (const m of it.modifiers) str += `${m.modifierID}@${m.value}#`;
  if (it.primaryColor !== noColor) str += `${OG_ITEM_MOD.primaryColor}@${it.primaryColor}#`;
  if (it.secondaryColor !== noColor) str += `${OG_ITEM_MOD.secondaryColor}@${it.secondaryColor}#`;
  if (it.uses !== ZERO) str += `${OG_ITEM_MOD.uses}@${it.uses}#`;
  if (it.named || OG_CLAN_INVITATION_IDS.includes(it.itemID)) str += `${OG_ITEM_MOD.name}@${it.itemName}#`;
  if (it.creator !== '') str += `${OG_ITEM_MOD.creator}@${it.creator}#`;
  return str;
}

/**
 * WEB `getBattleStatsString` (`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:5117-5154`):
 * the 14 carried stats in slot order, each followed by `|`, then the weapon row's
 * `mindamage`, damage range and `slashusage` (floored), then defense + its equipment bonus.
 */
export function writeBattleStats(s: ProfileState): string {
  let str = '';
  s.stats.forEach((v, i) => {
    if (OG_BATTLE_STATS_ORDER.includes(i)) str += `${v}|`;
  });
  const w = OG_BATTLE_WRITE_WEAPON;
  const weaponID = s.equipment[OG_EQ.weapon]?.itemID ?? ZERO;
  const row = ITEM_ROWS.get(weaponID);
  let minDamage = ZERO;
  let damageRange = ZERO;
  let slashUsage: number = w.unarmedSlashUsage;
  if (row && weaponID !== ZERO) {
    minDamage = row.mindamage ?? ZERO;
    damageRange = ((row.maxdamage ?? ZERO) - minDamage) | ZERO;
    slashUsage = Math.max(row.slashusage ?? OG_ITEM_DEFAULT_SLASHUSAGE, w.slashUsageFloor);
  }
  const defense = ((s.stats[OG_STAT.defense] ?? ZERO) + findBonusStat(OG_STAT.defense, s.equipment)) | ZERO;
  return `${str}${minDamage}|${damageRange}|${slashUsage}|${defense}`;
}

/** `getEquipmentString`: every slot's item, `|`-joined; web: then the checksum. */
export function writeEquipment(equipment: readonly ProfileItem[], checksum = true): string {
  return withChecksum(equipment.map(writeProfileItem).join('|'), checksum);
}

/** `getSkillStatsString`: `id,level`, `|`-joined; web: then the checksum. */
export function writeSkillStats(skills: readonly SkillStat[], checksum = true): string {
  return withChecksum(skills.map((sk) => `${sk.id},${sk.value}`).join('|'), checksum);
}

/** `new Item(id, 1)`: no colour, no uses, no name, no creator, no modifiers. */
function plainItem(itemID: number): ProfileItem {
  return {
    itemID, primaryColor: OG_ITEM_NOCOLOR, secondaryColor: OG_ITEM_NOCOLOR, uses: ZERO,
    itemName: '', named: false, creator: '', modifiers: [],
  };
}

/**
 * `StatsManager.initNewPlayer` with its default arguments, as far as the writers read it:
 * the carried stats, the 13 slots, the 7 skills. A fresh copy each call.
 */
export function newPlayerState(): ProfileState {
  const stats = new Array<number>(OG_PLAYER_STATS_COUNT).fill(ZERO);
  for (const [key, value] of Object.entries(OG_NEW_PLAYER.stats)) {
    stats[OG_STAT[key as keyof typeof OG_NEW_PLAYER.stats]] = value;
  }
  return {
    stats,
    equipment: Object.values(OG_NEW_PLAYER.equipment).map(plainItem),
    skills: Object.values(OG_NEW_PLAYER.skills).map((id) => ({ id, value: OG_NEW_PLAYER.skillLevel })),
  };
}
