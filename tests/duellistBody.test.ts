/**
 * L5-OPP SLICE 1b-ii — THE BODY'S STATS. `core/npc/duellistBody.ts` against the source's
 * `EnemyPlayer.init` (`EnemyPlayer.as:740-870`; web `§1t122s0§.as:751-896`, the body in
 * `§1t4880s0§` from `:758`) and `MCSPlayer.initPlayer` / `initAttackStats` /
 * `initElementDefenseStats` (`MCSPlayer.as:182`, `:249`, `:260`; web `§1t99s0§.as:183`,
 * `:271`, `:282`), on the AI's path: `isDuelist`, `controlledBy == 1` (`DuelModeUI.as:381`,
 * web `§1t5565s0§.as:423`).
 *
 * Where the builds differ the WEB side is ported, and each test says so. Every expected
 * number was worked by hand from those functions, on top of records whose own numbers
 * `tests/duellistStats.test.ts` pins. AS3 stores into `int` fields with ToInt32, so every
 * `*= 1.1` truncates toward zero.
 */
import { describe, expect, it } from 'vitest';
import { OG_DUELLIST_SPEED } from '../src/config/ogDuellistProfile';
import { REACH } from '../src/config/reach';
import { initDuellistBody } from '../src/core/npc/duellistBody';
import { deriveDuellist } from '../src/core/npc/duellistStats';

/** A battle string (14 fields), no buffs. */
function battle(hp: number, maxHp: number, chi: number, maxChi: number, atk: number, def: number, spd: number,
  fire = 0, wind = 0, water = 0, earth = 0): string {
  return [hp, maxHp, chi, maxChi, atk, def, spd, fire, wind, water, earth, 0, 0, 0].join('|');
}

/** 13 eq fields, every slot item 0 except the ones given. */
function eq(slots: Record<number, string>): string {
  return Array.from({ length: 13 }, (_, i) => slots[i] ?? '0').join('|');
}

/** An rng the test forbids: the stance pick must not draw unless the masteries tie. */
const NO_DRAW = (): number => {
  throw new Error('the stance pick drew a random number');
};

describe('OPP-B body fixture 1 — the defaults at level 1', () => {
  // Record (duellistStats fixture 1): every stat 0, weapon 13002 Branch → minDamage 1, range 1,
  // slashUsage 48. Level 1 < 10 → web ×0.9: minDamage int(0.9) = 0, max-HP int(0) = 0.
  // Speed 0: baseReload 48 + 0 = 48; baseSlashLength 120 + floor(0 / 20) = 120.
  // All three masteries 0 → tied → setStance(int(random * 3)); random 0.5 → 1.
  it('reproduces EnemyPlayer.init + MCSPlayer.init* at ±0', () => {
    expect(initDuellistBody(deriveDuellist(null, null, null, 0), 1, -1, () => 0.5)).toEqual({
      hp: 0, maxHp: 0, chi: 0, maxChi: 0, defense: 0, baseReload: 48, minDamage: 0, damageRange: 1,
      baseSlashLength: 120, slashUsage: 48, lightMastery: 0, balancedMastery: 0, heavyMastery: 0,
      level: 1, walkSpeed: 4, reload: 0, maxReload: 192, statAtk: 0,
      fireAtk: 0, windAtk: 0, waterAtk: 0, earthAtk: 0, criticalDmg: 0, piercingDmg: 0,
      fireDef: 0, windDef: 0, waterDef: 0, earthDef: 0, xp: 50, stance: 1,
      skills: [], // no skill string: none (7a carries the list for init's cooldown table)
    });
  });
});

describe('OPP-B body fixture 2 — the mid-level duellist, level 45', () => {
  // The record is duellistStats fixture 2 (hp 537 / current 250, chi 50 / current 40,
  // attack 42, defense 71, speed 27, minDamage 52, range 10, slashUsage 48, elements
  // 5/6/7/8 → defences 10/8/6/5), with mastery skills added.
  const STATS = battle(250, 300, 40, 50, 30, 20, 15, 5, 6, 7, 8);
  const EQ = eq({
    0: '4050,8@4#', 1: '5000,7@3#', 2: '6019,6@99#', 3: '7001,1@170#6@10#', 4: '8005', 6: '3000,7@50#',
    7: '11034', 8: '12017', 9: '13031,200@3#', 10: '13002,204@9#', 11: '3001,7@4#6@2#', 12: '99999,6@50#',
  });
  const record = deriveDuellist(STATS, EQ, '1000,4|1001,2|1002,4|1010,1', 0);
  // Built inside each test, so a throwing rng fails a TEST rather than the file's collection.
  const body = () => initDuellistBody(record, 45, -1, NO_DRAW);

  it('the record is the one duellistStats pins', () => {
    expect([record.hp, record.currentHp, record.attack, record.defense, record.speed, record.minDamage])
      .toEqual([537, 250, 42, 71, 27, 52]);
  });

  it('level 45 (above 30, below 80): minDamage int(52 × 1.1) = 57, max-HP int(537 × 1.1) = 590', () => {
    const b = body();
    expect([b.minDamage, b.maxHp]).toEqual([57, 590]);
  });

  it('HP starts FULL: the saved current HP (250) never reaches the AI body', () => {
    const b = body();
    // initPlayer sets hp = currenthp, then `if(controlledBy == 1) setHP(xml.hp)`, then the
    // scaling sets it to the scaled max.
    expect(b.hp).toBe(590);
  });

  it('chi starts at the SAVED current chi (40), not the max (50): nothing refills it', () => {
    const b = body();
    expect([b.chi, b.maxChi]).toEqual([40, 50]);
  });

  it('speed 27: baseReload 48 + 27 × 6 = 210; baseSlashLength 120 + floor(90 × 27 / 47) = 171', () => {
    const b = body();
    expect([b.baseReload, b.baseSlashLength]).toEqual([210, 171]);
  });

  it('defense, range, slash cost and the elements pass through unscaled', () => {
    const b = body();
    expect([b.defense, b.damageRange, b.slashUsage, b.statAtk]).toEqual([71, 10, 48, 42]);
    expect([b.fireAtk, b.windAtk, b.waterAtk, b.earthAtk]).toEqual([5, 6, 7, 8]);
    expect([b.fireDef, b.windDef, b.waterDef, b.earthDef]).toEqual([10, 8, 6, 5]);
  });

  it('the masteries are skills 1000 / 1001 / 1002, and level, xp (45 × 5 + 45 = 270) and the reload', () => {
    const b = body();
    expect([b.lightMastery, b.balancedMastery, b.heavyMastery]).toEqual([4, 2, 4]);
    expect([b.level, b.xp, b.walkSpeed, b.reload, b.maxReload]).toEqual([45, 270, 4, 0, 192]);
  });

  it('light 4 ties heavy 4 over balanced 2: HEAVY wins, because its test runs second', () => {
    const b = body();
    expect(b.stance).toBe(2);
  });
});

describe('OPP-B body fixture 3 — the web-only branches and the dropped stats', () => {
  // Record: hp 200, attack 30, default eq (Branch: minDamage 31, range 1).
  const rec = (skills: string | null = null, eqStr: string | null = null) =>
    deriveDuellist(battle(100, 200, 10, 20, 30, 5, 10), eqStr, skills, 0);
  const at = (level: number) => initDuellistBody(rec(), level, -1, () => 0);

  it('WEB: level 80 and above is NOT scaled (Android scales every level above 30)', () => {
    expect([at(80).minDamage, at(80).maxHp, at(85).minDamage, at(85).maxHp]).toEqual([31, 200, 31, 200]);
  });

  it('level 79 and 31 are ×1.1 (int(34.1) = 34, int(220.00000000000003) = 220); 30 is not', () => {
    for (const lvl of [79, 31]) expect([at(lvl).minDamage, at(lvl).maxHp, at(lvl).hp]).toEqual([34, 220, 220]);
    expect([at(30).minDamage, at(30).maxHp]).toEqual([31, 200]);
  });

  it('WEB: below 10 is ×0.9 (int(27.9) = 27, 180), not Android\'s ×0.8 (24, 160); 10 is not scaled', () => {
    expect([at(9).minDamage, at(9).maxHp, at(9).hp]).toEqual([27, 180, 180]);
    expect([at(10).minDamage, at(10).maxHp]).toEqual([31, 200]);
  });

  it('BOTH builds drop critical and piercing: init passes initAttackStats only five arguments', () => {
    // 3001 Ring (type 11): own critical 7 and piercing 3 are not pooled into HP, so the
    // record carries them; the body gets initAttackStats' defaults, 0 and 0.
    const r = rec(null, eq({ 9: '13002', 11: '3001,204@7#205@3#' }));
    expect([r.criticalDmg, r.piercingDmg]).toEqual([7, 3]);
    const b = initDuellistBody(r, 20, -1, () => 0);
    expect([b.criticalDmg, b.piercingDmg]).toEqual([0, 0]);
  });

  it('WEB: a stance argument other than -1 is used as given, before any mastery test', () => {
    expect(initDuellistBody(rec('1500,1'), 20, 3, NO_DRAW).stance).toBe(3);
    expect(initDuellistBody(rec(), 20, 0, NO_DRAW).stance).toBe(0);
  });

  it('skill 1500 → REVERSED (4), tested before 1501 → DUAL (3); a level-0 entry does not count', () => {
    expect(initDuellistBody(rec('1501,1|1500,1'), 20, -1, NO_DRAW).stance).toBe(4);
    expect(initDuellistBody(rec('1501,2'), 20, -1, NO_DRAW).stance).toBe(3);
    expect(initDuellistBody(rec('1500,0|1000,3'), 20, -1, NO_DRAW).stance).toBe(0);
  });

  it('three equal masteries draw ONE random number: int(r × 3)', () => {
    const tied = rec('1000,2|1001,2|1002,2');
    const draws: number[] = [];
    for (const r of [0, 0.34, 0.999]) {
      let n = 0;
      draws.push(initDuellistBody(tied, 20, -1, () => (n++, r)).stance);
      expect(n).toBe(1);
    }
    expect(draws).toEqual([0, 1, 2]);
  });

  it('the pick: light needs > balanced AND >= heavy; heavy needs > balanced AND >= light; else balanced', () => {
    const pick = (skills: string) => initDuellistBody(rec(skills), 20, -1, NO_DRAW).stance;
    expect(pick('1000,3|1001,2')).toBe(0);
    expect(pick('1001,5|1000,3')).toBe(1);
    expect(pick('1002,3')).toBe(2);
    expect(pick('1000,1|1002,1')).toBe(2); // light = heavy over balanced 0: heavy wins
    expect(pick('1000,2|1001,2|1002,1')).toBe(1); // light ties balanced: balanced
  });

  it('speed -20 divides by zero: 120 + floor(-Infinity) stored into an int is 0', () => {
    const b = initDuellistBody(deriveDuellist(battle(1, 1, 0, 0, 0, 0, -20), null, null, 0), 20, -1, () => 0);
    expect([b.baseReload, b.baseSlashLength]).toEqual([48 - 120, 0]);
  });

  it('a negative speed FLOORS, it does not truncate: speed -7 → 120 + floor(-48.46) = 71', () => {
    const b = initDuellistBody(deriveDuellist(battle(1, 1, 0, 0, 0, 0, -7), null, null, 0), 20, -1, () => 0);
    expect([b.baseReload, b.baseSlashLength]).toEqual([48 - 42, 71]);
  });
});

describe('the slash-length formula is the player\'s REACH with no dan term', () => {
  // Two copies of three numbers, from two source functions: pinned, so an edit to one is
  // an edit someone has to look at in the other.
  it('base, the 90 and the soft cap agree with reach.ts', () => {
    const s = OG_DUELLIST_SPEED.slashLength;
    expect([s.base, s.maxIncrement, s.halfSpeed]).toEqual([REACH.base, REACH.danBase, REACH.spdSoftcap]);
  });
});
