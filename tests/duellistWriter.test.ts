/**
 * L5-OPP SLICE 2 — THE PROFILE WRITERS. `core/npc/duellistWriter.ts` against the source's
 * `StatsManager.getBattleStatsString` / `getEquipmentString` / `getSkillStatsString` and
 * `Item.toStringNoQty` (`StatsManager.as:4396`, `:4417`, `:4447`, `Item.as:229`; web
 * `§1t1523s0§.as:5117`, `:5172`, `:5231`, `§1t17s0§.as:326`). These write the three strings a
 * player saves (`QueryManagerBase.as:1900-1908`; web `§1t1832s0§.as:1882-1890`) and another
 * player's Duel Mode reads as its opponent, so a string they produce is a real profile.
 *
 * Where the builds differ the WEB writer is ported, and each test says so. Every expected
 * string was written by hand from those functions; every checksum was computed by an
 * independent one-liner (`sum(map(ord, s)) % 54321`). The round trip ends in 1b's parse,
 * derive and body, whose own numbers `tests/duellistStats.test.ts` and
 * `tests/duellistBody.test.ts` pin.
 */
import { describe, expect, it } from 'vitest';
import { initDuellistBody } from '../src/core/npc/duellistBody';
import { parseEquipment, parsePlayerStats, parseSkillStats, type ProfileItem } from '../src/core/npc/duellistProfile';
import { deriveDuellist } from '../src/core/npc/duellistStats';
import {
  newPlayerState,
  profileChecksum,
  writeBattleStats,
  writeEquipment,
  writeProfileItem,
  writeSkillStats,
  type ProfileState,
} from '../src/core/npc/duellistWriter';

/** A plain item, as `Item.parseNoQty` leaves one: no colours, no uses, no name. */
function item(itemID: number, mods: Array<[number, number]> = [], extra: Partial<ProfileItem> = {}): ProfileItem {
  return {
    itemID, primaryColor: 1, secondaryColor: 1, uses: 0, itemName: '', named: false, creator: '',
    modifiers: mods.map(([modifierID, value]) => ({ modifierID, value })), ...extra,
  };
}

/** A 44-slot stats vector: the given slots, every other one 0. */
function stats(slots: Record<number, number>): number[] {
  return Array.from({ length: 44 }, (_, i) => slots[i] ?? 0);
}

/** The slots a battle string carries (`getBattleStatsString`'s 14-way test). */
const CARRIED = [0, 1, 3, 4, 6, 7, 8, 28, 29, 30, 31, 38, 39, 40];

/** What the parse gives back for a stats vector: the carried slots, 0 elsewhere. */
function carried(s: readonly number[]): number[] {
  return s.map((v, i) => (CARRIED.includes(i) ? v : 0));
}

const NO_DRAW = (): number => {
  throw new Error('the stance pick drew a random number');
};

/** write → parse → derive → body, the path a saved profile takes into a duel. */
function roundTrip(s: ProfileState, level: number, rng: () => number, serverTime = 0) {
  const d = deriveDuellist(writeBattleStats(s), writeEquipment(s.equipment), writeSkillStats(s.skills), serverTime);
  return initDuellistBody(d, level, -1, rng);
}

// ─── Fixture 1: a brand-new character (`StatsManager.initNewPlayer`) ───

describe('fixture 1 — StatsManager.initNewPlayer, the source\'s own new character', () => {
  // `StatsManager.as:689-747`, web `§1t1523s0§.as:1007-1064`: every field the writers carry
  // is the same in both builds (only HGOLD differs, 0 vs 3, and no writer carries it).
  const s = newPlayerState();

  it('carries the new character\'s writer-visible state: the 7 carried stats, 13 slots in EQ_ order, 7 skills at level 1', () => {
    expect(s.stats).toEqual(stats({ 0: 10, 1: 10, 3: 10, 4: 10, 6: 1, 7: 1, 8: 1 }));
    expect(s.equipment.map((it) => it.itemID)).toEqual([4017, 0, 0, 0, 1, 0, 0, 11017, 12017, 0, 13100, 0, 0]);
    expect(s.equipment.every((it) => writeProfileItem(it) === String(it.itemID))).toBe(true);
    expect(s.skills).toEqual([1000, 1001, 1002, 1003, 1042, 1049, 1050].map((id) => ({ id, value: 1 })));
  });

  it('WEB: the battle string is 18 fields: the 14 stats, then weapon 0/0/48 and defense 1', () => {
    // No weapon (item 0): `_loc4_ = 0; _loc5_ = 0; _loc6_ = 48`, and the lookup is skipped.
    expect(writeBattleStats(s)).toBe('10|10|10|10|1|1|1|0|0|0|0|0|0|0|0|0|48|1');
  });

  it('WEB: the eq and skill strings carry a ^checksum by default; without it they are the bare lists', () => {
    expect(writeEquipment(s.equipment)).toBe('4017|0|0|0|1|0|0|11017|12017|0|13100|0|0^2871');
    expect(writeEquipment(s.equipment, false)).toBe('4017|0|0|0|1|0|0|11017|12017|0|13100|0|0');
    expect(writeSkillStats(s.skills)).toBe('1000,1|1001,1|1002,1|1003,1|1042,1|1049,1|1050,1^2776');
    expect(writeSkillStats(s.skills, false)).toBe('1000,1|1001,1|1002,1|1003,1|1042,1|1049,1|1050,1');
  });

  it('round trip: the parse gives back every carried field', () => {
    expect(parsePlayerStats(writeBattleStats(s))).toEqual(carried(s.stats));
    expect(parseEquipment(writeEquipment(s.equipment))).toEqual(s.equipment);
    expect(parseSkillStats(writeSkillStats(s.skills))).toEqual(s.skills);
  });

  it('round trip: the body at level 1 (worked by hand from EnemyPlayer.init)', () => {
    // No bonus: 4017 / 12017 have defense 0, 11017 none; head (slot 4) and scabbard (10)
    // are skipped. Unarmed: minDamage = attack 1, range 0, slashUsage 48. Level 1 < 10 →
    // ×0.9: max-HP int(9) = 9, minDamage int(0.9) = 0. Speed 1: 48 + 6 = 54,
    // 120 + floor(90 / 21) = 124. Masteries 1 / 1 / 1 tie → int(0.5 × 3) = 1.
    expect(roundTrip(s, 1, () => 0.5)).toEqual({
      hp: 9, maxHp: 9, chi: 10, maxChi: 10, defense: 1, baseReload: 54, minDamage: 0, damageRange: 0,
      baseSlashLength: 124, slashUsage: 48, lightMastery: 1, balancedMastery: 1, heavyMastery: 1,
      level: 1, walkSpeed: 4, reload: 0, maxReload: 192, statAtk: 1,
      fireAtk: 0, windAtk: 0, waterAtk: 0, earthAtk: 0, criticalDmg: 0, piercingDmg: 0,
      fireDef: 0, windDef: 0, waterDef: 0, earthDef: 0, xp: 50, stance: 1,
    });
  });

  it('is a fresh copy each call: nothing a caller does to one reaches the next', () => {
    const a = newPlayerState();
    (a.stats as number[])[0] = 999;
    expect(newPlayerState().stats[0]).toBe(10);
  });
});

// ─── Fixture 2: duellistBody's mid-level duellist, as the state that wrote it ───

describe('fixture 2 — the mid-level duellist (duellistBody fixture 2) written from its state', () => {
  // The same stats, eq and skills `tests/duellistBody.test.ts` fixture 2 types by hand, as
  // StatsManager would hold them; slots 10 (level) and 11 (gold) are set to prove they drop.
  const s: ProfileState = {
    stats: stats({ 0: 250, 1: 300, 3: 40, 4: 50, 6: 30, 7: 20, 8: 15, 10: 45, 11: 999, 28: 5, 29: 6, 30: 7, 31: 8 }),
    equipment: [
      item(4050, [[8, 4]]), item(5000, [[7, 3]]), item(6019, [[6, 99]]), item(7001, [[1, 170], [6, 10]]), item(8005),
      item(0), item(3000, [[7, 50]]), item(11034), item(12017), item(13031, [[200, 3]]), item(13002, [[204, 9]]),
      item(3001, [[7, 4], [6, 2]]), item(99999, [[6, 50]]),
    ],
    skills: [{ id: 1000, value: 4 }, { id: 1001, value: 2 }, { id: 1002, value: 4 }, { id: 1010, value: 1 }],
  };
  const EQ = '4050,8@4#|5000,7@3#|6019,6@99#|7001,1@170#6@10#|8005|0|3000,7@50#|11034|12017|13031,200@3#|13002,204@9#|3001,7@4#6@2#|99999,6@50#';

  it('WEB: the four trailing fields are the weapon row (13031: 10 / 10 / slashusage 24 floored to 48) and defense + bonus', () => {
    // Defense 20 + findBonusStat(DEFENSE) 51 = 71, the record's defense in duellistStats fixture 2.
    expect(writeBattleStats(s)).toBe('250|300|40|50|30|20|15|5|6|7|8|0|0|0|10|10|48|71');
  });

  it('the eq string is fixture 2\'s own, and the skill string too', () => {
    expect(writeEquipment(s.equipment)).toBe(`${EQ}^7362`);
    expect(writeSkillStats(s.skills)).toBe('1000,4|1001,2|1002,4|1010,1^1527');
  });

  it('round trip: the level and gold slots do not survive; every carried field does', () => {
    const back = parsePlayerStats(writeBattleStats(s));
    expect(back).toEqual(carried(s.stats));
    expect([back[10], back[11]]).toEqual([0, 0]);
    expect(parseEquipment(writeEquipment(s.equipment))).toEqual(s.equipment);
  });

  it('round trip: the body equals fixture 2\'s pinned body (minDamage 57, max-HP 590) at level 45', () => {
    const typed = initDuellistBody(
      deriveDuellist('250|300|40|50|30|20|15|5|6|7|8|0|0|0', EQ, '1000,4|1001,2|1002,4|1010,1', 0), 45, -1, NO_DRAW);
    const b = roundTrip(s, 45, NO_DRAW);
    expect(b).toEqual(typed);
    expect([b.minDamage, b.maxHp, b.hp]).toEqual([57, 590, 590]);
  });
});

// ─── Fixture 3: the web-only writer branches ───

describe('fixture 3 — the web-only branches: a creator-only item, colours, uses, a name, a live buff', () => {
  // Slot 0 is a crafted item as `parseNoQty` leaves "4017,89@0#125@bob#": the procedural
  // name "0" clears `named` again, so only the creator is written.
  const crafted = item(4017, [], { itemName: '0', named: false, creator: 'bob' });
  const s: ProfileState = {
    stats: stats({ 0: 100, 1: 200, 3: 10, 4: 20, 6: 20, 7: 5, 8: 10, 10: 30, 28: 1, 29: 2, 30: 3, 31: 4, 38: 1, 39: 2000000000, 40: 7 }),
    equipment: [
      crafted, item(5000, [], { primaryColor: 4294967295, secondaryColor: 65280 }), item(0),
      item(7001, [], { itemName: 'Kage', named: true }), item(0), item(0), item(0), item(0), item(0),
      item(13100, [], { uses: 50 }), item(0), item(0), item(0),
    ],
    skills: [{ id: 1000, value: 3 }, { id: 1001, value: 1 }, { id: 1500, value: 1 }],
  };
  const EQ = '4017,125@bob#|5000,80@4294967295#81@65280#|0|7001,89@Kage#|0|0|0|0|0|13100,82@50#|0|0|0';

  it('WEB: a creator alone still gets its comma (Android glues "125@bob#" onto the id)', () => {
    expect(writeProfileItem(crafted)).toBe('4017,125@bob#');
    expect(parseEquipment(writeProfileItem(crafted))[0]?.itemID).toBe(4017);
  });

  it('BOTH builds: a clan invitation writes its name unasked, with no comma, so it parses back as item 0', () => {
    // `named || isClanInvitation(id)` writes the name; the comma test reads `named` alone.
    const invite = item(2213, [], { itemName: 'Clan' });
    expect(writeProfileItem(invite)).toBe('221389@Clan#');
    expect(parseEquipment(writeProfileItem(invite))[0]?.itemID).toBe(0);
  });

  it('colours as uint, then uses, then the name, in the source\'s order', () => {
    expect(writeEquipment(s.equipment)).toBe(`${EQ}^5599`);
  });

  it('WEB: the weapon fields for a row with no slashusage (13100: 4 / 4 / 48), and defense 5 + the hat\'s 2', () => {
    expect(writeBattleStats(s)).toBe('100|200|10|20|20|5|10|1|2|3|4|1|2000000000|7|4|4|48|7');
  });

  it('round trip: every item comes back but the crafted one\'s procedural name, which is never written', () => {
    const back = parseEquipment(writeEquipment(s.equipment));
    expect(back.slice(1)).toEqual(s.equipment.slice(1));
    expect(back[0]).toEqual({ ...crafted, itemName: '' });
    expect(parsePlayerStats(writeBattleStats(s))).toEqual(carried(s.stats));
    expect(parseSkillStats(writeSkillStats(s.skills))).toEqual(s.skills);
  });

  it('round trip: the body at level 20, with the attack buff live (worked by hand)', () => {
    // Attack 20 × 1.5 = 30 (buff type 1, expiry past the clock 0); minDamage 30 + 4 = 34,
    // range 8 - 4 = 4, slashUsage 48; defense 5 + 2 = 7; no scaling at 20; 1500 → REVERSED (4).
    // Each defence reads another element's attack: fire ← water 3, wind ← earth 4,
    // water ← wind 2, earth ← fire 1.
    const b = roundTrip(s, 20, NO_DRAW);
    expect([b.statAtk, b.minDamage, b.damageRange, b.slashUsage, b.defense, b.maxHp, b.hp, b.chi, b.stance])
      .toEqual([30, 34, 4, 48, 7, 200, 200, 10, 4]);
    expect([b.fireDef, b.windDef, b.waterDef, b.earthDef]).toEqual([3, 4, 2, 1]);
  });
});

// ─── The checksum ───

describe('profileChecksum — web `§1t9731s0§`: the char-code sum mod 54321', () => {
  it('wraps at 54321: 1000 × "9" is 57000 → 2679', () => {
    expect(profileChecksum('9'.repeat(1000))).toBe(2679);
  });

  it('is cut by the parse: the round trip never sees it', () => {
    expect(parseSkillStats('1000,1^2776')).toEqual(parseSkillStats('1000,1'));
  });
});
