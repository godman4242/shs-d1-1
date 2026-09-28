/**
 * THE DUELLIST'S DERIVED STATS — what `XMLNpc.initDuelist` makes of the three profile
 * strings: the hp / chi / attack / defense / speed a Duel Mode opponent fights with, its
 * elemental attacks and defences, and its weapon's damage and slash cost. L5-OPP slice
 * 1b-i, a pure record; `EnemyPlayer.init` and `MCSPlayer.init*` build on it in 1b-ii.
 *
 * Android structure, web numbers (ruling R6); where the two builds differ in STRUCTURE
 * the web side is ported, and `docs/DIVERGENCES.md` "L5-OPP SLICE 1b-i" rules each one:
 *   - `findBonusStatFrom` also skips hair, and sums the web `Item.getModifiers` (own
 *     modifiers with an attack/defense → max-HP pool, then the item row's modifiers);
 *   - `initDuelist`'s live attack / defense buff (×1.5), against an injected clock
 *     (core has no `Date.now()`);
 *   - NOT ported: the halving test. It reads the game's `action` (a PvP room or a war room),
 *     and the Sim has neither.
 *
 * AS3 stores every one of these into an `int`, so each result is ToInt32'd (`| ZERO`):
 * `*= 1.5` truncates toward zero, and sums wrap.
 */
import { ONE, ZERO } from '../../config/nums';
import {
  OG_BONUS_SKIPPED_SLOTS,
  OG_BONUS_SLOTS,
  OG_BUFF,
  OG_BUFF_MULT,
  OG_DEFAULT_EQSTRING,
  OG_DEFAULT_STATS_STRING,
  OG_DEFAULT_WEAPON_ART,
  OG_EQ,
  OG_ITEM_DEFAULT_SLASHUSAGE,
  OG_ITEM_DEFAULT_TYPE,
  OG_MOD_NEVER_MERGED,
  OG_MOD_TO_HP,
  OG_SLASH_USAGE_FLOOR,
  OG_STAT,
  OG_UNARMED_SLASH_USAGE,
} from '../../config/ogDuellistProfile';
import { OG_ITEMS, type OgItem } from '../../config/ogItems';
import {
  parseEquipment,
  parsePlayerStats,
  parseSkillStats,
  type ProfileItem,
  type ProfileModifier,
  type SkillStat,
} from './duellistProfile';

/** `QuestEngine.getItemData`: the first row with the id (ids are unique), else none. */
export const ITEM_ROWS = new Map<number, OgItem>(OG_ITEMS.map((row) => [row.id, row]));

/** `initDuelist`'s fields, as the fight reads them. */
export interface DuellistStats {
  readonly currentHp: number;
  readonly hp: number;
  readonly currentChi: number;
  readonly chi: number;
  readonly attack: number;
  readonly defense: number;
  readonly speed: number;
  readonly fireAtk: number;
  readonly windAtk: number;
  readonly waterAtk: number;
  readonly earthAtk: number;
  readonly fireDef: number;
  readonly windDef: number;
  readonly waterDef: number;
  readonly earthDef: number;
  readonly criticalDmg: number;
  readonly piercingDmg: number;
  readonly minDamage: number;
  readonly damageRange: number;
  readonly slashUsage: number;
  /** The paperdoll's weapon id: the slot's item, or 13001 for item 0. */
  readonly weaponArt: number;
  readonly skills: readonly SkillStat[];
}

/**
 * WEB `Item.getModifiers` (`§1t17s0§`'s `§1t522s0§`): the item's own modifiers, with
 * attack (armour, hats) or defense (rings) pooled into max-HP, then the row's modifiers
 * appended.
 */
function webModifiers(item: ProfileItem, row: OgItem): ProfileModifier[] {
  const type = row.type ?? OG_ITEM_DEFAULT_TYPE;
  const mods: ProfileModifier[] = [];
  let pool = ZERO;
  let hpIndex = -ONE;
  for (const mod of item.modifiers) {
    const pooled =
      (OG_MOD_TO_HP.defenseOnTypes.includes(type) && mod.modifierID === OG_STAT.defense) ||
      (OG_MOD_TO_HP.attackOnTypes.includes(type) && mod.modifierID === OG_STAT.attack);
    if (pooled) {
      pool = (pool + mod.value) | ZERO;
    } else {
      mods.push({ modifierID: mod.modifierID, value: mod.value });
      if (mod.modifierID === OG_STAT.maxHp) hpIndex = mods.length - ONE;
    }
  }
  if (pool > ZERO) {
    const own = mods[hpIndex];
    if (own === undefined) {
      mods.push({ modifierID: OG_STAT.maxHp, value: pool });
    } else {
      mods[hpIndex] = { modifierID: OG_STAT.maxHp, value: Math.min((own.value + pool) | ZERO, OG_MOD_TO_HP.mergedCap) };
    }
  }
  for (const tableMod of row.modifiers ?? []) {
    const merges = !OG_MOD_NEVER_MERGED.includes(tableMod.id) && mods.some((m) => m.modifierID === tableMod.id);
    if (merges) {
      // `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1717` adds an
      // XMLList to an int with no `int()`: AVM2's `add` concatenates there, so the web
      // game may store "5"+"20" → 520. Unmeasured, so refused.
      throw new Error(`UNMEASURED: item ${item.itemID}'s table modifier ${tableMod.id} merges with an earlier modifier of the same id (web Item.getModifiers)`);
    }
    mods.push({ modifierID: tableMod.id, value: tableMod.value ?? ZERO });
  }
  return mods;
}

/**
 * `StatsManager.findBonusStatFrom` (`StatsManager.as:2029-2070`), web structure
 * (`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2464-2506`):
 * over the first 13 slots, skipping hair / head / neck / scabbard, every item the table
 * knows adds its row's `defense` (to DEFENSE only) and its web modifiers with the stat's
 * id. An item the table does not know adds nothing.
 */
export function findBonusStat(statId: number, equipment: ReadonlyArray<ProfileItem | null>): number {
  let bonus = ZERO;
  for (let slot = ZERO; slot < OG_BONUS_SLOTS; slot++) {
    const item = equipment[slot];
    if (OG_BONUS_SKIPPED_SLOTS.includes(slot) || !item) continue;
    const row = ITEM_ROWS.get(item.itemID);
    if (!row) continue;
    if (statId === OG_STAT.defense) bonus = (bonus + (row.defense ?? ZERO)) | ZERO;
    for (const mod of webModifiers(item, row)) {
      if (mod.modifierID === statId) bonus = (bonus + mod.value) | ZERO;
    }
  }
  return bonus;
}

/**
 * `XMLNpc.initDuelist`'s arithmetic (`XMLNpc.as:298-365`, web
 * `reference/decompiled/shs3_payload/scripts/§1t76s0§.as:348-424`).
 * `serverTime` is the web build's server clock, which a live buff's expiry is compared
 * against. The name, network id, side and the paperdoll's colour tags are not stats and
 * stay out.
 */
export function deriveDuellist(
  statsStr: string | null,
  eqStr: string | null,
  skillStr: string | null,
  serverTime: number,
): DuellistStats {
  // `if(str == null || str == "")`: an empty string takes the default too.
  const stats = parsePlayerStats(statsStr === null || statsStr === '' ? OG_DEFAULT_STATS_STRING : statsStr);
  const equipment = parseEquipment(eqStr === null || eqStr === '' ? OG_DEFAULT_EQSTRING : eqStr);
  const withBonus = (id: number, from: number = id): number =>
    ((stats[from] ?? ZERO) + findBonusStat(id, equipment)) | ZERO;

  const hp = withBonus(OG_STAT.maxHp);
  const chi = withBonus(OG_STAT.maxChi);
  let attack = withBonus(OG_STAT.attack);
  let defense = withBonus(OG_STAT.defense);
  const speed = withBonus(OG_STAT.speed);
  const buffLive = (stats[OG_STAT.buffExpiry] ?? ZERO) > serverTime;
  const buffType = stats[OG_STAT.buffType];
  if (buffType === OG_BUFF.attack && buffLive) {
    attack = (attack * OG_BUFF_MULT) | ZERO;
  } else if (buffType === OG_BUFF.defense && buffLive) {
    defense = (defense * OG_BUFF_MULT) | ZERO;
  }

  const weaponID = equipment[OG_EQ.weapon]?.itemID ?? ZERO;
  const weapon = ITEM_ROWS.get(weaponID);
  let minDamage = attack;
  let damageRange = ZERO;
  let slashUsage = OG_UNARMED_SLASH_USAGE;
  if (weapon && weaponID !== ZERO) {
    const min = weapon.mindamage ?? ZERO;
    minDamage = (attack + min) | ZERO;
    damageRange = ((weapon.maxdamage ?? ZERO) - min) | ZERO;
    slashUsage = Math.max(weapon.slashusage ?? OG_ITEM_DEFAULT_SLASHUSAGE, OG_SLASH_USAGE_FLOOR);
  }

  return {
    currentHp: stats[OG_STAT.hp] ?? ZERO,
    hp,
    currentChi: stats[OG_STAT.chi] ?? ZERO,
    chi,
    attack,
    defense,
    speed,
    fireAtk: withBonus(OG_STAT.fireAtk),
    windAtk: withBonus(OG_STAT.windAtk),
    waterAtk: withBonus(OG_STAT.waterAtk),
    earthAtk: withBonus(OG_STAT.earthAtk),
    // Each defence reads ANOTHER element's attack, in both builds and in the roster
    // constructor too: the elemental-counter design, not a typo. Never "fix" it.
    fireDef: withBonus(OG_STAT.fireDef, OG_STAT.waterAtk),
    windDef: withBonus(OG_STAT.windDef, OG_STAT.earthAtk),
    waterDef: withBonus(OG_STAT.waterDef, OG_STAT.windAtk),
    earthDef: withBonus(OG_STAT.earthDef, OG_STAT.fireAtk),
    criticalDmg: findBonusStat(OG_STAT.criticalDmg, equipment),
    piercingDmg: findBonusStat(OG_STAT.piercingDmg, equipment),
    minDamage,
    damageRange,
    slashUsage,
    weaponArt: weaponID === ZERO ? OG_DEFAULT_WEAPON_ART : weaponID,
    skills: parseSkillStats(skillStr),
  };
}
