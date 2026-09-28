/**
 * L5-OPP SLICE 3a — THE STANCE. `core/npc/MCSPlayer.ts` against the source's `setStance`,
 * `initSpecialSkills` (the AI's branch), `canChangeStance`, `stopMoving`'s guard, `getDamage`
 * and `getBaseDamage` (`MCSPlayer.as:2965`, `:3019`, `:3127`, `:2363`, `:3198`, `:3226`; web
 * `§1t99s0§.as:3043`, `:3083`, `:3184`, `:2439`, `:3255`, `:3279`).
 *
 * Where the builds differ the WEB side is ported (ruling R6), and each test that tells them
 * apart says what Android would give. Every expected number was worked by hand from the web
 * functions, on bodies whose own numbers `tests/duellistBody.test.ts` and
 * `tests/duellistWriter.test.ts` pin. AS3 stores into `int` fields, so every product truncates.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { OG_STATE, type OgState } from '../src/config/ogActor';
import { OG_STANCE_REACH } from '../src/config/ogMcsPlayer';
import { REACH } from '../src/config/reach';
import { initDuellistBody, type DuellistBody } from '../src/core/npc/duellistBody';
import { deriveDuellist } from '../src/core/npc/duellistStats';
import { newPlayerState, writeBattleStats, writeEquipment, writeSkillStats } from '../src/core/npc/duellistWriter';
import { MCSPlayer } from '../src/core/npc/MCSPlayer';
import type { AnimLibrary, HitGeometry, PlayerWorld } from '../src/core/npc/types';
import type { Rng } from '../src/core/Sim';

const GROUND = 358;
const LIGHT = 0;
const BALANCED = 1;
const HEAVY = 2;
const DUAL = 3;
const REVERSED = 4;

const world = (battle: boolean): PlayerWorld => ({
  groundY: GROUND,
  stageWidth: 800,
  stagePosition: 0,
  redFreeze: false,
  playerLevel: 20,
  censored: false,
  playback: false,
  adventureMode: false,
  nearestEnemy: () => null,
  cutsceneShowing: false,
  transitioning: false,
  noAggro: false,
  npcBlocked: () => false,
  playerStats: { maxHp: 200, defense: 40, minDamage: 30, damageRange: 21 },
  peaceful: !battle,
  duelMode: true,
  externalRedFreezeCheck: () => undefined,
  battle,
});
const anims: AnimLibrary = { clip: () => ({ durationFrames: 3, loop: false }) };
const geometry: HitGeometry = { partAtPoint: () => null, partHitBy: () => null, partX: () => 0 };
const NO_DRAW: Rng = () => {
  throw new Error('drew a random number');
};

/** Fixture 1: `StatsManager.initNewPlayer` through the writers, level 1 (slice 2's round trip). */
function body1(): DuellistBody {
  const s = newPlayerState();
  const d = deriveDuellist(writeBattleStats(s), writeEquipment(s.equipment), writeSkillStats(s.skills), 0);
  return initDuellistBody(d, 1, -1, () => 0.5);
}

/** Fixture 2: `tests/duellistBody.test.ts`'s mid-level duellist at level 45. */
function body2(): DuellistBody {
  const stats = [250, 300, 40, 50, 30, 20, 15, 5, 6, 7, 8, 0, 0, 0].join('|');
  const slots: Record<number, string> = {
    0: '4050,8@4#', 1: '5000,7@3#', 2: '6019,6@99#', 3: '7001,1@170#6@10#', 4: '8005', 6: '3000,7@50#',
    7: '11034', 8: '12017', 9: '13031,200@3#', 10: '13002,204@9#', 11: '3001,7@4#6@2#', 12: '99999,6@50#',
  };
  const eq = Array.from({ length: 13 }, (_, i) => slots[i] ?? '0').join('|');
  return initDuellistBody(deriveDuellist(stats, eq, '1000,4|1001,2|1002,4|1010,1', 0), 45, -1, NO_DRAW);
}

function player(b: DuellistBody, battle = false, rng: Rng = NO_DRAW): MCSPlayer {
  return new MCSPlayer(world(battle), anims, geometry, rng, b);
}

/** The five special-move flags, in the order `initSpecialSkills` names them. */
const specials = (p: MCSPlayer) => ({
  launch: p.canLaunch, deflect: p.canDeflect, airCombo: p.canAirCombo, flipUp: p.canFlipUp, stab: p.canStab,
});

describe('the fixtures are the bodies slices 1b-ii and 2 pin', () => {
  it('fixture 1: base reach 124, masteries 1 / 1 / 1, balanced, reload 0 of 192', () => {
    const b = body1();
    expect([b.baseSlashLength, b.lightMastery, b.balancedMastery, b.heavyMastery, b.stance, b.reload, b.maxReload])
      .toEqual([124, 1, 1, 1, BALANCED, 0, 192]);
  });

  it('fixture 2: base reach 171, masteries 4 / 2 / 4, heavy, minDamage 57 range 10', () => {
    const b = body2();
    expect([b.baseSlashLength, b.lightMastery, b.balancedMastery, b.heavyMastery, b.stance, b.minDamage, b.damageRange])
      .toEqual([171, 4, 2, 4, HEAVY, 57, 10]);
  });
});

describe('setStance — the reach per stance (WEB numbers)', () => {
  it('fixture 1 in init\'s own call: balanced, int(124 × (1 + 0.2 × 1 × 0.1)) = int(126.48) = 126', () => {
    const b = body1();
    const p = player(b);
    p.slashCommitted = true;
    p.setStance(b.stance);
    expect([p.getStance(), p.slashLength, p.slashCommitted, p.reload]).toEqual([BALANCED, 126, false, 0]);
  });

  it('fixture 1, every stance: light 173, heavy 100 (int(66.96) is floored), dual 124, reversed 173', () => {
    // Android: light and reversed int(124 × 1.5) = 186; balanced int(124 × 1.005) = 124.
    const reach = (stance: number) => {
      const p = player(body1());
      p.setStance(stance);
      return p.slashLength;
    };
    expect([LIGHT, BALANCED, HEAVY, DUAL, REVERSED].map(reach)).toEqual([173, 126, 100, 124, 173]);
  });

  it('WEB: fixture 2 heavy is int(171 × 0.66) = 112, where Android floors int(88.92) to 100', () => {
    const p = player(body2());
    p.setStance(HEAVY);
    expect(p.slashLength).toBe(112);
  });

  it('fixture 2: light int(239.4) = 239 (Android 256), balanced int(177.84) = 177 (Android 172)', () => {
    const at = (stance: number) => {
      const p = player(body2());
      p.setStance(stance);
      return p.slashLength;
    };
    expect([at(LIGHT), at(BALANCED)]).toEqual([239, 177]);
  });

  it('dual never reaches below 100, and takes the base as it is above that', () => {
    const p = player({ ...body1(), baseSlashLength: 60 });
    p.setStance(DUAL);
    expect(p.slashLength).toBe(100);
    const q = player({ ...body1(), baseSlashLength: 101 });
    q.setStance(DUAL);
    expect(q.slashLength).toBe(101);
  });
});

describe('initSpecialSkills — the AI\'s branch reads the stance mastery', () => {
  it('fixture 2 heavy (mastery 4): launch and deflect, no stab; the other two are cleared', () => {
    const p = player(body2());
    p.canFlipUp = true;
    p.canAirCombo = true;
    p.setStance(HEAVY);
    expect(specials(p)).toEqual({ launch: true, deflect: true, airCombo: false, flipUp: false, stab: false });
  });

  it('ERRATUM 2 item 4: heavy LAUNCHES at mastery 3 (the Sim\'s INFERRED unlock says 5)', () => {
    const p = player({ ...body1(), heavyMastery: 3 });
    p.setStance(HEAVY);
    expect([p.canLaunch, p.canDeflect, p.canStab]).toEqual([true, false, false]);
    const q = player({ ...body1(), heavyMastery: 2 });
    q.setStance(HEAVY);
    expect(q.canLaunch).toBe(false);
  });

  it('the thresholds, stance by stance: 3 / 4 / 5', () => {
    const at = (stance: number, key: 'lightMastery' | 'balancedMastery' | 'heavyMastery', m: number) => {
      const p = player({ ...body1(), [key]: m });
      p.setStance(stance);
      return specials(p);
    };
    expect(at(LIGHT, 'lightMastery', 3)).toEqual({ launch: true, deflect: false, airCombo: false, flipUp: false, stab: false });
    expect(at(LIGHT, 'lightMastery', 5)).toEqual({ launch: true, deflect: true, airCombo: true, flipUp: false, stab: false });
    expect(at(BALANCED, 'balancedMastery', 3)).toEqual({ launch: false, deflect: false, airCombo: false, flipUp: true, stab: false });
    expect(at(BALANCED, 'balancedMastery', 4)).toEqual({ launch: false, deflect: true, airCombo: false, flipUp: true, stab: false });
    expect(at(BALANCED, 'balancedMastery', 5)).toEqual({ launch: true, deflect: true, airCombo: false, flipUp: true, stab: false });
    expect(at(HEAVY, 'heavyMastery', 5)).toEqual({ launch: true, deflect: true, airCombo: false, flipUp: false, stab: true });
  });

  it('dual and reversed unlock all five whatever the mastery', () => {
    for (const stance of [DUAL, REVERSED]) {
      const p = player(body1());
      p.setStance(stance);
      expect(specials(p)).toEqual({ launch: true, deflect: true, airCombo: true, flipUp: true, stab: true });
    }
  });
});

describe('setStance in battle — the reload cost, the idle clip, stopMoving', () => {
  const inBattle = (reload: number) => {
    const p = player({ ...body2(), reload }, true);
    p.setStance(HEAVY);
    return p;
  };

  it('WEB: a change costs 48 frames of reload, floored at 0 (100 → 52, 30 → 0, 192 → 144)', () => {
    // Android: above half of 192 the reload drops to 64 (so 100 → 64 and 192 → 64); else −32.
    expect([inBattle(100).reload, inBattle(30).reload, inBattle(192).reload]).toEqual([52, 0, 144]);
  });

  it('starts the stance\'s idle clip in battle only', () => {
    expect(inBattle(0).animation).toBe('heavy_stance');
    const p = player(body2());
    p.setStance(HEAVY);
    expect(p.animation).toBe('');
  });

  it('through the intro (not battle) a change is free', () => {
    const p = player({ ...body2(), reload: 100 });
    p.setStance(HEAVY);
    expect(p.reload).toBe(100);
  });

  it('init\'s own call (reload 0, IDLE): battle and intro agree on every field but the clip', () => {
    const fields = (battle: boolean) => {
      const p = player(body2(), battle);
      p.setStance(HEAVY);
      return [p.stance, p.slashLength, p.reload, p.destX, p.destY, specials(p)];
    };
    expect(fields(true)).toEqual(fields(false));
  });

  it('WEB: stopMoving leaves a body that cannot change stance alone (Android would stop it)', () => {
    const p = player(body2(), true);
    p.actionState = OG_STATE.SLASH;
    p.posX = 300;
    expect(() => {
      p.setStance(LIGHT);
    }).not.toThrow();
    expect([p.destX, p.slashLength]).toEqual([0, 239]);
  });

  it('a moving body is stopped: dest set, slash cleared, then startAction — UNPORTED, and loud', () => {
    const p = player(body2(), true);
    p.actionState = OG_STATE.WALK;
    p.posX = 300;
    p.hasSlash = true;
    p.hasSlashBuffer = true;
    expect(() => {
      p.setStance(LIGHT);
    }).toThrow('unported: MCSPlayer.startAction');
    expect([p.destX, p.destY, p.hasSlash, p.hasSlashBuffer]).toEqual([300, GROUND, false, false]);
  });
});

describe('canChangeStance — the same in both builds', () => {
  const can = (s: OgState, prev: OgState = OG_STATE.IDLE) => {
    const p = player(body1());
    p.actionState = s;
    p.prevActionState = prev;
    return p.canChangeStance();
  };

  it('idle, pose, run, walk and the chi charge may change; a slash may not', () => {
    const S = OG_STATE;
    expect([S.IDLE, S.POSE, S.RUN, S.WALK, S.SKILL_CHICHARGE, S.SLASH].map((s) => can(s)))
      .toEqual([true, true, true, true, true, false]);
  });

  it('a flinch may, only out of one of the four moving-or-idle states', () => {
    expect([can(OG_STATE.FLINCH, OG_STATE.WALK), can(OG_STATE.FLINCH, OG_STATE.POSE), can(OG_STATE.FLINCH, OG_STATE.SLASH)])
      .toEqual([true, true, false]);
  });
});

describe('getDamage / getBaseDamage (WEB), fixture 2, one draw of 0.5 → base int(57 + 5) = 62', () => {
  const dmg = (stance: number, reload = 0, crit = 0) => {
    const p = player({ ...body2(), reload }, false, () => 0.5);
    p.stance = stance;
    p.lightMastery = 4;
    p.STAT_CRITICALDMG = crit;
    return p.getDamage();
  };

  it('WEB: heavy, dual and reversed ×1.4 = int(86.8) = 86 (Android ×1.5 = 93)', () => {
    expect([dmg(HEAVY), dmg(DUAL), dmg(REVERSED)]).toEqual([86, 86, 86]);
  });

  it('WEB: light int(62 × 0.66) = 40 (Android 32), balanced int(62 × 1.04) = 64 (Android 62)', () => {
    expect([dmg(LIGHT), dmg(BALANCED)]).toEqual([40, 64]);
  });

  it('WEB: a full reload is ×1.3 in EVERY stance, plus STAT_CRITICALDMG (Android: light ×1.5, else ×1.2)', () => {
    expect([dmg(HEAVY, 192), dmg(LIGHT, 192), dmg(BALANCED, 192)]).toEqual([111, 52, 83]);
    expect(dmg(HEAVY, 192, 7)).toBe(118);
    expect(dmg(HEAVY, 191)).toBe(86);
  });

  it('draws exactly once; getBaseDamage is the unscaled roll', () => {
    let draws = 0;
    const p = player(body2(), false, () => {
      draws++;
      return 0.99;
    });
    expect(p.getBaseDamage()).toBe(66);
    p.getDamage();
    expect(draws).toBe(2);
  });
});

describe('the harness rule — unported calls throw, and their count only goes down', () => {
  it('MCSPlayer.ts names exactly 2 unported sites (startAction, clearInteractTarget)', () => {
    const src = readFileSync(new URL('../src/core/npc/MCSPlayer.ts', import.meta.url), 'utf8');
    expect(src.match(/unported\('/g)).toHaveLength(2);
  });
});

describe('the factored per-mastery terms against the Sim player\'s REACH', () => {
  it('0.2 × 0.1 and 0.4 × 0.1 are REACH\'s 0.02 and 0.04 as numbers, not as doubles', () => {
    // Why the config keeps the source's factors: `0.2 * m * 0.1` and `0.02 * m` round apart,
    // and a truncated product can land on either side of an integer.
    expect(OG_STANCE_REACH.balanced.perMastery * OG_STANCE_REACH.balanced.scale).toBeCloseTo(REACH.balancedPerMastery, 15);
    expect(OG_STANCE_REACH.heavy.perMastery * OG_STANCE_REACH.heavy.scale).toBeCloseTo(REACH.heavyPerMastery, 15);
    expect(0.2 * 3 * 0.1).not.toBe(0.02 * 3);
  });
});
