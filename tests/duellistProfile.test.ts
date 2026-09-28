/**
 * L5-OPP SLICE 1a — THE PROFILE STRINGS. `core/npc/duellistProfile.ts` against the
 * source's own parsers: `XMLNpc.parseBattleStatsString` / `parsePlayerStatsString` /
 * `parseEquipmentString` / `parseSkillStatsString` / `getMastery`, `Item.parseNoQty`
 * and `IntStat.parse` (Android structure, web numbers: ruling R6).
 *
 * Every expected value below is derived by reading those functions, and the comment on
 * each test names the branch it exercises. AS3's `int(x)` / `uint(x)` are ECMA-262
 * ToInt32 / ToUint32 of ToNumber(x); no Flash VM runs here, so the coercion cases are
 * the spec's, not an executed AVM2's.
 */
import { describe, expect, it } from 'vitest';
import {
  OG_EQUIPMENT_SLOTS,
  OG_ITEM_NOCOLOR,
  OG_PLAYER_STATS_COUNT,
  OG_SKILL_ID_FLOOR,
  OG_STAT,
} from '../src/config/ogDuellistProfile';
import { OG_SKILLS } from '../src/config/ogSkills';
import {
  getMastery,
  parseBattleStats,
  parseEquipment,
  parsePlayerStats,
  parseProfileItem,
  parseSkillStats,
} from '../src/core/npc/duellistProfile';

/** A 44-slot stats vector with `slots` set and every other slot 0. */
function vector(slots: Record<number, number>, length = OG_PLAYER_STATS_COUNT): number[] {
  const v = new Array<number>(length).fill(0);
  for (const [k, val] of Object.entries(slots)) v[Number(k)] = val;
  return v;
}

/** `XMLNpc.DEFAULT_EQSTRING` (`XMLNpc.as:36`), the eq string a duellist gets when its own is empty. */
const DEFAULT_EQSTRING = '4017|0|6019|0|8005|0|0|11017|12017|13002|13002|0|0';

describe('parseBattleStatsString — field i lands in the switch\'s slot', () => {
  it('a 14-field battle string fills exactly the 14 switch slots', () => {
    const s = '90|120|5|10|12|8|6|1|2|3|4|2|500|0';
    expect(parseBattleStats(s)).toEqual(vector({
      [OG_STAT.hp]: 90, [OG_STAT.maxHp]: 120, [OG_STAT.chi]: 5, [OG_STAT.maxChi]: 10,
      [OG_STAT.attack]: 12, [OG_STAT.defense]: 8, [OG_STAT.speed]: 6,
      [OG_STAT.fireAtk]: 1, [OG_STAT.windAtk]: 2, [OG_STAT.waterAtk]: 3, [OG_STAT.earthAtk]: 4,
      [OG_STAT.buffType]: 2, [OG_STAT.buffExpiry]: 500, [OG_STAT.buff2Expiry]: 0,
    }));
  });

  it('R6 (web): fields 14–17 of an 18-field string are DROPPED (`if(_loc5_ <= 13)`); on Android the last would overwrite buff2Expiry', () => {
    const v = parseBattleStats('90|120|5|10|12|8|6|1|2|3|4|2|500|7|11|22|33|44');
    expect(v[OG_STAT.buff2Expiry]).toBe(7);
    expect(v).toEqual(parseBattleStats('90|120|5|10|12|8|6|1|2|3|4|2|500|7'));
  });

  it('coerces each field the way AS3 `int()` does: junk and empty are 0, decimals truncate toward 0, hex parses', () => {
    const v = parseBattleStats('abc||12.9|-3.9| 7 |0x10|6|1|2|3|4|0|0|0');
    expect([v[OG_STAT.hp], v[OG_STAT.maxHp], v[OG_STAT.chi], v[OG_STAT.maxChi], v[OG_STAT.attack], v[OG_STAT.defense]])
      .toEqual([0, 0, 12, -3, 7, 16]);
  });
});

describe('parsePlayerStatsString — 14 or 18 fields is a battle string, anything else is slot-by-slot', () => {
  it('routes a 14-field string through the battle parse (slot 2 is chi = slot 3, not slot 2)', () => {
    const v = parsePlayerStats('90|120|5|10|12|8|6|1|2|3|4|0|0|0');
    expect(v[OG_STAT.chi]).toBe(5);
    expect(v[2]).toBe(0);
  });

  it('routes an 18-field string through the battle parse too (its first 14 fields only)', () => {
    const v = parsePlayerStats('90|120|5|10|12|8|6|1|2|3|4|2|500|7|11|22|33|44');
    expect(v[OG_STAT.buff2Expiry]).toBe(7);
    expect(v[2]).toBe(0);
  });

  it('a full saved vector: 44 values and the trailing separator\'s empty field', () => {
    const values = Array.from({ length: OG_PLAYER_STATS_COUNT }, (_, i) => i + 100);
    expect(parsePlayerStats(values.join('|') + '|')).toEqual(values);
  });

  it('QUIRK: `i < length - 1` drops the LAST field even when there is no trailing separator', () => {
    expect(parsePlayerStats('1|2|3')).toEqual(vector({ 0: 1, 1: 2 }));
    expect(parsePlayerStats('1|2|3|')).toEqual(vector({ 0: 1, 1: 2, 2: 3 }));
  });

  it('a string longer than 45 fields grows the vector past 44', () => {
    const values = Array.from({ length: OG_PLAYER_STATS_COUNT + 2 }, (_, i) => i);
    expect(parsePlayerStats(values.join('|') + '|')).toEqual(values);
  });
});

describe('Item.parseNoQty — "id,mod@value#mod@value#"', () => {
  it('reads colours as item fields and every other id as a stat modifier; the trailing # is skipped', () => {
    expect(parseProfileItem('13002,80@16711680#81@255#6@12#28@3#')).toEqual({
      itemID: 13002, primaryColor: 16711680, secondaryColor: 255, uses: 0,
      itemName: '', named: false, creator: '',
      modifiers: [{ modifierID: 6, value: 12 }, { modifierID: 28, value: 3 }],
    });
  });

  it('a bare id has no colours, no uses, no modifiers', () => {
    expect(parseProfileItem('4017')).toEqual({
      itemID: 4017, primaryColor: OG_ITEM_NOCOLOR, secondaryColor: OG_ITEM_NOCOLOR, uses: 0,
      itemName: '', named: false, creator: '', modifiers: [],
    });
  });

  it('R6 (web wins): an over-cap modifier is NOT clamped (Android clamps attack to prog1[79] = 90)', () => {
    expect(parseProfileItem('13002,6@500#').modifiers).toEqual([{ modifierID: 6, value: 500 }]);
  });

  it('QUIRK: only EXACTLY two comma fields read modifiers; a third comma drops them all', () => {
    expect(parseProfileItem('13002,6@5,junk').modifiers).toEqual([]);
    expect(parseProfileItem('13002,6@5,junk').itemID).toBe(13002);
  });

  it('reads uses, and a modifier with no @ is value 0 (`int(undefined)`)', () => {
    const it0 = parseProfileItem('2001,82@40#6#');
    expect(it0.uses).toBe(40);
    expect(it0.modifiers).toEqual([{ modifierID: 6, value: 0 }]);
  });

  it('a colour is a uint: -1 wraps to 4294967295', () => {
    expect(parseProfileItem('4017,80@-1#').primaryColor).toBe(4294967295);
  });

  it('a name makes an item `named`, except on the two clan invitations', () => {
    expect(parseProfileItem('4017,89@Kenji#')).toMatchObject({ itemName: 'Kenji', named: true });
    expect(parseProfileItem('2213,89@Clan#')).toMatchObject({ itemName: 'Clan', named: false });
    expect(parseProfileItem('2214,89@Clan#')).toMatchObject({ named: false });
  });

  it('QUIRK: a creator clears `named` only if the name mod came FIRST and was "0"', () => {
    expect(parseProfileItem('4017,89@0#125@bob#')).toMatchObject({ named: false, creator: 'bob' });
    expect(parseProfileItem('4017,125@bob#89@0#')).toMatchObject({ named: true, creator: 'bob' });
    expect(parseProfileItem('4017,89@Kenji#125@bob#')).toMatchObject({ named: true });
  });
});

describe('parseEquipmentString — one item per | field, in a vector that starts 13 long', () => {
  it('parses the source\'s own DEFAULT_EQSTRING slot for slot', () => {
    const eq = parseEquipment(DEFAULT_EQSTRING);
    expect(eq).toHaveLength(OG_EQUIPMENT_SLOTS);
    expect(eq.map((i) => i?.itemID)).toEqual([4017, 0, 6019, 0, 8005, 0, 0, 11017, 12017, 13002, 13002, 0, 0]);
  });

  it('a short string leaves the missing slots null; an empty field is item 0, not null', () => {
    const eq = parseEquipment('4017|');
    expect(eq).toHaveLength(OG_EQUIPMENT_SLOTS);
    expect(eq[0]?.itemID).toBe(4017);
    expect(eq[1]?.itemID).toBe(0);
    expect(eq.slice(2).every((i) => i === null)).toBe(true);
  });

  it('a string longer than 13 fields grows the vector', () => {
    expect(parseEquipment(DEFAULT_EQSTRING + '|5000')).toHaveLength(OG_EQUIPMENT_SLOTS + 1);
  });

  it('R6 (web): everything from the first ^ is cut before parsing', () => {
    const eq = parseEquipment('4017|6019^1234|9999');
    expect(eq.slice(0, 3).map((i) => i?.itemID ?? null)).toEqual([4017, 6019, null]);
  });
});

describe('parseSkillStatsString + IntStat.parse — "id,level|id,level"', () => {
  it('reads each pair in order', () => {
    expect(parseSkillStats('1005,3|1012,1')).toEqual([{ id: 1005, value: 3 }, { id: 1012, value: 1 }]);
  });

  it('R6 (web): an id below 1000 gets 1000 added; 1000 itself and above are unchanged', () => {
    expect(parseSkillStats('5,3|1000,2|-5,1')).toEqual([
      { id: 1005, value: 3 }, { id: 1000, value: 2 }, { id: 995, value: 1 },
    ]);
  });

  it('the floor\'s premise: every skill-table id is at or above it, so a real id passes through unchanged', () => {
    expect(OG_SKILLS).toHaveLength(75);
    for (const { id } of OG_SKILLS) {
      expect(id).toBeGreaterThanOrEqual(OG_SKILL_ID_FLOOR);
      expect(parseSkillStats(`${id},1`)).toEqual([{ id, value: 1 }]);
    }
  });

  it('null is an empty list (Android); "" is ONE skill, id 1000 at level 0', () => {
    expect(parseSkillStats(null)).toEqual([]);
    expect(parseSkillStats('')).toEqual([{ id: 1000, value: 0 }]);
  });

  it('R6 (web): everything from the first ^ is cut before parsing', () => {
    expect(parseSkillStats('1005,3^x|1012,1')).toEqual([{ id: 1005, value: 3 }]);
  });
});

describe('getMastery — the first matching id\'s level, else 0', () => {
  const skills = parseSkillStats('1005,3|1012,1|1005,9');
  it('returns the FIRST match on a duplicated id', () => {
    expect(getMastery(skills, 1005)).toBe(3);
    expect(getMastery(skills, 1012)).toBe(1);
  });
  it('returns 0 for a skill the duellist does not have', () => {
    expect(getMastery(skills, 1054)).toBe(0);
    expect(getMastery([], 1005)).toBe(0);
  });
});
