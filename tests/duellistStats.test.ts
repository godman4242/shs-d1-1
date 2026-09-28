/**
 * L5-OPP SLICE 1b-i — THE DERIVED STATS. `core/npc/duellistStats.ts` against the source's
 * `XMLNpc.initDuelist` (`XMLNpc.as:290-401`, web `§1t76s0§.as:340-500`) and
 * `StatsManager.findBonusStatFrom` (`StatsManager.as:2029-2070`, web `§1t1523s0§.as:2464-2506`),
 * which in the web build sums `Item.getModifiers` (`§1t17s0§.as:1643-1731`).
 *
 * Where the builds differ the WEB side is ported, and each test says so. Every expected
 * number below was worked by hand from those functions and the item rows in `ogItems.ts`
 * (quoted beside each fixture), NOT read back from the port. AS3 stores into an `int`
 * field with ToInt32, so `*= 1.5` and every sum truncate toward zero.
 */
import { describe, expect, it } from 'vitest';
import { OG_STAT } from '../src/config/ogDuellistProfile';
import { parseEquipment } from '../src/core/npc/duellistProfile';
import { deriveDuellist, findBonusStat } from '../src/core/npc/duellistStats';

/** A battle string (14 fields) with the buff fields last. */
function battle(hp: number, maxHp: number, chi: number, maxChi: number, atk: number, def: number, spd: number,
  fire: number, wind: number, water: number, earth: number, buffType = 0, buffExpiry = 0, buff2Expiry = 0): string {
  return [hp, maxHp, chi, maxChi, atk, def, spd, fire, wind, water, earth, buffType, buffExpiry, buff2Expiry].join('|');
}

/** 13 eq fields, every slot item 0 except the ones given. */
function eq(slots: Record<number, string>): string {
  return Array.from({ length: 13 }, (_, i) => slots[i] ?? '0').join('|');
}

describe('OPP-B fixture 1 — the defaults (every string empty)', () => {
  // stats → the 14-zero battle string; eq → DEFAULT_EQSTRING
  // `4017|0|6019|0|8005|0|0|11017|12017|13002|13002|0|0`. None of those rows carries a
  // defense above 0 or a modifier, so every bonus is 0. The weapon is 13002 "Branch"
  // (mindamage 1, maxdamage 2, no slashusage → XMLItem's 48).
  it('reproduces initDuelist at ±0', () => {
    expect(deriveDuellist(null, null, null, 0)).toEqual({
      currentHp: 0, hp: 0, currentChi: 0, chi: 0, attack: 0, defense: 0, speed: 0,
      fireAtk: 0, windAtk: 0, waterAtk: 0, earthAtk: 0,
      fireDef: 0, windDef: 0, waterDef: 0, earthDef: 0, criticalDmg: 0, piercingDmg: 0,
      minDamage: 1, damageRange: 1, slashUsage: 48, weaponArt: 13002, skills: [],
    });
  });

  it('an EMPTY string takes the same defaults as null', () => {
    expect(deriveDuellist('', '', null, 0)).toEqual(deriveDuellist(null, null, null, 0));
  });
});

describe('OPP-B fixture 2 — a mid-level duellist wearing modifier items', () => {
  // Rows (ogItems.ts): 4050 Zaku armour — no type (→ 0), defense 35, table 6:10 1:30 2:5.
  // 5000 gloves — type 1, no defense. 7001 Straw Hat — type 3, defense 2. 11034 Pants —
  // type 7, defense 10, table 2:10 1:30 8:8 5:6. 12017 sandals — defense 0. 13031 Yellow
  // Flash Blade — min 10, max 20, slashusage 24. 3001 Ring — type 11, defense 1.
  const STATS = battle(250, 300, 40, 50, 30, 20, 15, 5, 6, 7, 8);
  const EQ = eq({
    0: '4050,8@4#', // own speed 4, then the table's 6:10 1:30 2:5
    1: '5000,7@3#', // own defense 3 on gloves: type 1 is not converted
    2: '6019,6@99#', // HAIR: skipped by the web sum (Android would add attack 99)
    3: '7001,1@170#6@10#', // own HP 170; attack on a type-3 hat pools into it → 180 → cap 173
    4: '8005', // head: skipped
    6: '3000,7@50#', // neck: skipped
    7: '11034', // table 1:30 8:8
    8: '12017',
    9: '13031,200@3#', // own fire-defense 3
    10: '13002,204@9#', // scabbard: skipped (its critical 9 is lost)
    11: '3001,7@4#6@2#', // a ring: its own defense 4 becomes HP 4 (pushed, no own HP); attack 2 stays
    12: '99999,6@50#', // not in the item table: the whole item is skipped, own mods too
  });
  const d = deriveDuellist(STATS, EQ, '1005,3|1010,1', 0);

  it('hp = 300 + armour 30 + hat 173 (capped) + pants 30 + ring 4 = 537', () => {
    expect(d.currentHp).toBe(250);
    expect(d.hp).toBe(537);
  });

  it('attack = 30 + armour table 10 + ring 2 = 42 (hat attack pooled, hair skipped)', () => {
    expect(d.attack).toBe(42);
  });

  it('defense = 20 + table 35 + 2 + 10 + 1 + gloves own 3 = 71 (the ring\'s own 4 became HP)', () => {
    expect(d.defense).toBe(71);
  });

  it('speed = 15 + armour own 4 + pants table 8 = 27; chi untouched', () => {
    expect(d.speed).toBe(27);
    expect([d.currentChi, d.chi]).toEqual([40, 50]);
  });

  it('each elemental DEFENCE reads ANOTHER element\'s attack (XMLNpc.as:334-337), plus its own bonus', () => {
    // fireDef = stats[WATERATK] 7 + weapon own 3 · windDef = stats[EARTHATK] 8 ·
    // waterDef = stats[WINDATK] 6 · earthDef = stats[FIREATK] 5
    expect([d.fireAtk, d.windAtk, d.waterAtk, d.earthAtk]).toEqual([5, 6, 7, 8]);
    expect([d.fireDef, d.windDef, d.waterDef, d.earthDef]).toEqual([10, 8, 6, 5]);
  });

  it('critical and piercing come from equipment only; a scabbard\'s are skipped', () => {
    expect([d.criticalDmg, d.piercingDmg]).toEqual([0, 0]);
  });

  it('the weapon: minDamage = attack 42 + 10, range 10, slashusage 24 floored to 48', () => {
    expect([d.minDamage, d.damageRange, d.slashUsage, d.weaponArt]).toEqual([52, 10, 48, 13031]);
  });

  it('the skill string goes through 1a\'s parse', () => {
    expect(d.skills).toEqual([{ id: 1005, value: 3 }, { id: 1010, value: 1 }]);
  });
});

describe('OPP-B fixture 3 — the web-only branches (buffs, the HP pool, the skipped hair)', () => {
  const buffed = (type: number, expiry: number, now: number, atk = 33, def = 21) =>
    deriveDuellist(battle(100, 100, 10, 10, atk, def, 10, 0, 0, 0, 0, type, expiry), null, null, now);

  it('a live ATTACK buff multiplies attack by 1.5, truncated (33 → 49), and minDamage uses it', () => {
    const d = buffed(1, 500, 499);
    expect([d.attack, d.defense, d.minDamage]).toEqual([49, 21, 50]);
  });

  it('a buff whose expiry is not AFTER the clock does nothing (expiry 500, clock 500)', () => {
    const d = buffed(1, 500, 500);
    expect([d.attack, d.defense, d.minDamage]).toEqual([33, 21, 34]);
  });

  it('a live DEFENSE buff multiplies defense by 1.5 (21 → 31)', () => {
    const d = buffed(2, 500, 0);
    expect([d.attack, d.defense]).toEqual([33, 31]);
  });

  it('a negative buffed attack truncates TOWARD ZERO, as an AS3 int store does (-33 → -49)', () => {
    expect(buffed(1, 500, 0, -33).attack).toBe(-49);
  });

  it('any other buff type does nothing, and the halving test is NOT ported', () => {
    // buff2Expiry 7 would halve attack/defense/speed in a PvP room (both builds) or a war
    // room (web). The Sim has neither room. DIVERGENCES "L5-OPP SLICE 1b-i".
    const d = deriveDuellist(battle(100, 100, 10, 10, 33, 21, 11, 0, 0, 0, 0, 3, 500, 7), null, null, 0);
    expect([d.attack, d.defense, d.speed]).toEqual([33, 21, 11]);
  });

  it('an own attack pooled into HP with NO own HP modifier is pushed UNCAPPED (200)', () => {
    expect(findBonusStat(OG_STAT.maxHp, parseEquipment(eq({ 3: '7001,6@200#' })))).toBe(200);
    expect(findBonusStat(OG_STAT.attack, parseEquipment(eq({ 3: '7001,6@200#' })))).toBe(0);
  });

  it('a pool at or below zero is DROPPED: the attack is lost and no HP appears', () => {
    const e = parseEquipment(eq({ 3: '7001,6@-5#' }));
    expect([findBonusStat(OG_STAT.attack, e), findBonusStat(OG_STAT.maxHp, e)]).toEqual([0, 0]);
  });

  it('the pool merges into the LAST own HP modifier, and only that one is capped', () => {
    // last: 100 + min(170 + 10, 173) = 273 · first would be min(100 + 10, 173) + 170 = 280
    const e = parseEquipment(eq({ 3: '7001,1@100#1@170#6@10#' }));
    expect(findBonusStat(OG_STAT.maxHp, e)).toBe(100 + 173);
  });

  it('attack on a non-armour, non-hat item is NOT pooled (gloves, type 1)', () => {
    expect(findBonusStat(OG_STAT.attack, parseEquipment(eq({ 1: '5000,6@7#' })))).toBe(7);
  });

  it('the web sum skips HAIR, HEAD, NECK and SCABBARD', () => {
    for (const slot of [2, 4, 6, 10]) {
      expect(findBonusStat(OG_STAT.attack, parseEquipment(eq({ [slot]: '7001,1@1#' }))) +
        findBonusStat(OG_STAT.maxHp, parseEquipment(eq({ [slot]: '7001,1@1#' })))).toBe(0);
    }
    // …and reads the other nine.
    for (const slot of [0, 1, 3, 5, 7, 8, 9, 11, 12]) {
      expect(findBonusStat(OG_STAT.speed, parseEquipment(eq({ [slot]: '7001,8@2#' })))).toBe(2);
    }
  });

  it('only DEFENSE adds the item row\'s own `defense` field', () => {
    const e = parseEquipment(eq({ 3: '7001' }));
    expect([findBonusStat(OG_STAT.defense, e), findBonusStat(OG_STAT.attack, e)]).toEqual([2, 0]);
  });

  it('a slot past the 13th is never read, even when a long eq string grew the vector', () => {
    const e = parseEquipment(`${eq({})}|7001,8@2#`);
    expect(e).toHaveLength(14);
    expect(findBonusStat(OG_STAT.speed, e)).toBe(0);
  });
});

describe('the one path left UNMEASURED — an own modifier merged with a same-id table modifier', () => {
  // `§1t17s0§.as:1717`: `mod.value += modifierXML[i].value` with an XMLList on the right and
  // no `int()`. AVM2's generic `add` on an XMLList operand CONCATENATES strings, so an own
  // max-HP 5 merged with the helmet's table 20 would store "520" → 520. No AS3 runtime runs
  // here, so the port refuses the path loudly instead of guessing either answer.
  it('throws on an own HP modifier merged with 7028 Helmet\'s table HP', () => {
    expect(() => findBonusStat(OG_STAT.maxHp, parseEquipment(eq({ 3: '7028,1@5#' }))))
      .toThrow(/UNMEASURED/);
  });

  it('throws when the HP pool itself meets a table HP modifier (4050 armour with own attack)', () => {
    expect(() => deriveDuellist(null, eq({ 0: '4050,6@12#', 9: '13002' }), null, 0)).toThrow(/UNMEASURED/);
  });

  it('7028 and 11034 with no own modifiers sum cleanly (their rows repeat no id)', () => {
    const e = parseEquipment(eq({ 3: '7028', 7: '11034' }));
    expect(findBonusStat(OG_STAT.maxHp, e)).toBe(20 + 30);
    expect(findBonusStat(OG_STAT.speed, e)).toBe(10 + 8);
    expect(findBonusStat(OG_STAT.defense, e)).toBe(5 + 10 + 5);
  });
});
