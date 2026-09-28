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
import { describe, expect, it, vi } from 'vitest';
import { OG_STATE, type OgState } from '../src/config/ogActor';
import { OG_SLASH_TYPE, OG_STANCE_REACH } from '../src/config/ogMcsPlayer';
import { REACH } from '../src/config/reach';
import { initDuellistBody, type DuellistBody } from '../src/core/npc/duellistBody';
import { deriveDuellist } from '../src/core/npc/duellistStats';
import { newPlayerState, writeBattleStats, writeEquipment, writeSkillStats } from '../src/core/npc/duellistWriter';
import { MCSPlayer, type MovePoint } from '../src/core/npc/MCSPlayer';
import { Npc } from '../src/core/npc/Npc';
import type { AnimLibrary, HitGeometry, NpcTarget, PlayerWorld } from '../src/core/npc/types';
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

/*
 * SLICE 3b — THE MOVEMENT. `initMove` (web `§1t99s0§.as:2394`, Android `MCSPlayer.as:2318`),
 * `movement` (`:2968` / `:2890`), `movePlayer`'s opponent branch (`:2999` / `:2921`) and
 * `moveTo` (`:4934` / `:4565`). Only `initMove` differs between the builds; each test that
 * tells them apart says what Android would give. The stage is 800 wide (`world`).
 */
/** `MCSPlayer.as:13` `runSpeed = 12` and `:207` `walkSpeed = 4`; the web's are the same (`§1t99s0§.as:13`, `:208`). */
const RUN_SPEED = 12;
const WALK_SPEED = 4;
const STAGE = 800;

/** A body at `posX` whose `startAction` records the state it was asked for instead of throwing. */
function mover(b: DuellistBody, posX: number, adventure = false) {
  const p = player(b);
  p.world.adventureMode = adventure;
  p.setPosition(posX, GROUND);
  const started: OgState[] = [];
  vi.spyOn(p, 'startAction').mockImplementation((s: OgState) => {
    started.push(s);
  });
  return { p, started };
}

describe.each([
  ['fixture 1', body1],
  ['fixture 2', body2],
])('slice 3b, %s: initMove', (_name, body) => {
  it('a move within 100 px walks: dest set, the slash and its buffer cleared, then WALK', () => {
    const { p, started } = mover(body(), 400);
    p.hasSlash = true;
    p.hasSlashBuffer = true;
    p.initMove({ x: 330, y: GROUND });
    expect([p.destX, p.destY, p.hasSlash, p.hasSlashBuffer, started]).toEqual([330, GROUND, false, false, [OG_STATE.WALK]]);
  });

  it('exactly 100 px still walks (dist² = 10000 is <=); 101 px runs', () => {
    const walk = mover(body(), 200);
    walk.p.initMove({ x: 100, y: GROUND });
    const run = mover(body(), 200);
    run.p.initMove({ x: 99, y: GROUND });
    expect([walk.started, run.started]).toEqual([[OG_STATE.WALK], [OG_STATE.RUN]]);
  });

  it('WEB: the distance is int(posX − dest.x), so 200 → 99.5 is 100 px and walks (Android: 200 − 99 = 101, runs)', () => {
    const { p, started } = mover(body(), 200);
    p.initMove({ x: 99.5, y: 300.7 });
    expect([p.destX, p.destY, started]).toEqual([99, 300, [OG_STATE.WALK]]);
  });

  it('dest is clamped to the stage, but the walk/run choice reads the UNCLAMPED point', () => {
    const left = mover(body(), 50);
    left.p.initMove({ x: -30, y: GROUND }); // 80 px to the point, 50 to the edge: walks
    const right = mover(body(), 700);
    right.p.initMove({ x: 950, y: GROUND }); // 250 px to the point, 100 to the edge: runs
    expect([left.p.destX, left.started, right.p.destX, right.started]).toEqual([0, [OG_STATE.WALK], STAGE, [OG_STATE.RUN]]);
  });

  it('WEB: in adventure mode a move under 25 px is refused and dest does NOT move (Android sets destX first)', () => {
    const { p, started } = mover(body(), 100, true);
    p.destX = 100;
    p.initMove({ x: 80, y: GROUND });
    expect([p.destX, started]).toEqual([100, []]);
  });

  it('in adventure mode exactly 25 px is allowed (dist² = 625 is not < 625)', () => {
    const { p, started } = mover(body(), 100, true);
    p.initMove({ x: 75, y: GROUND });
    expect([p.destX, started]).toEqual([75, [OG_STATE.WALK]]);
  });

  it('in adventure mode a far move is refused while jumping, falling, launched, downed or airborne', () => {
    const refused = (setUp: (p: MCSPlayer) => void) => {
      const { p, started } = mover(body(), 100, true);
      setUp(p);
      p.initMove({ x: 500, y: GROUND });
      return started.length;
    };
    const cases = [
      (p: MCSPlayer) => { p.actionState = OG_STATE.JUMP; },
      (p: MCSPlayer) => { p.actionState = OG_STATE.FALL; },
      (p: MCSPlayer) => { p.actionState = OG_STATE.GOTLAUNCHED; },
      (p: MCSPlayer) => { p.actionState = OG_STATE.DOWNED; },
      (p: MCSPlayer) => { p.y = GROUND - 51; },
    ];
    expect(cases.map(refused)).toEqual([0, 0, 0, 0, 0]);
    expect(refused(() => undefined)).toBe(1);
  });

  it('outside adventure mode (the duel) none of those refuse: a jumping body is sent RUN', () => {
    const { p, started } = mover(body(), 100);
    p.actionState = OG_STATE.JUMP;
    p.y = GROUND - 51;
    p.initMove({ x: 500, y: GROUND });
    expect(started).toEqual([OG_STATE.RUN]);
  });

  it('unstubbed, the fields are set BEFORE startAction — UNPORTED, and loud', () => {
    const p = player(body());
    p.setPosition(400, GROUND);
    p.hasSlash = true;
    expect(() => {
      p.initMove({ x: 600, y: GROUND });
    }).toThrow('unported: MCSPlayer.startAction');
    expect([p.destX, p.hasSlash]).toEqual([600, false]);
  });
});

describe.each([
  ['fixture 1', body1],
  ['fixture 2', body2],
])('slice 3b, %s: movement(speed) — posX / velX / facing at ±0 (the same in both builds)', (_name, body) => {
  /** One `movement` call from `posX` toward `destX`: [returned, posX, x, velX, facingRight]. */
  const step = (posX: number, destX: number, speed: number, facingRight: boolean, velX = 7) => {
    const p = player(body());
    p.setPosition(posX, GROUND);
    p.destX = destX;
    p.velX = velX;
    p.facingRight = facingRight;
    const moving = p.movement(speed);
    return [moving, p.posX, p.x, p.velX, p.isFacingRight()];
  };

  it('approach from the left: one run step right, facing right', () => {
    expect(step(100, 300, RUN_SPEED, false)).toEqual([true, 112, 112, RUN_SPEED, true]);
  });

  it('approach from the right: one walk step left, facing left', () => {
    expect(step(300, 100, WALK_SPEED, true)).toEqual([true, 296, 296, -WALK_SPEED, false]);
  });

  it('arriving inside one step snaps to dest, returns false, and leaves velX and facing alone', () => {
    expect(step(100, 108, RUN_SPEED, false)).toEqual([false, 108, 108, 7, false]);
    expect(step(108, 100, RUN_SPEED, true)).toEqual([false, 100, 100, 7, true]);
  });

  it('exactly one step away is an arrival on both sides (−speed is not < −speed; speed is <= speed)', () => {
    expect(step(100, 112, RUN_SPEED, false)).toEqual([false, 112, 112, 7, false]);
    expect(step(112, 100, RUN_SPEED, true)).toEqual([false, 100, 100, 7, true]);
    expect(step(100, 113, RUN_SPEED, false)).toEqual([true, 112, 112, RUN_SPEED, true]);
  });

  it('the stage edges: arriving at 0 and at the stage width', () => {
    expect(step(10, 0, RUN_SPEED, true)).toEqual([false, 0, 0, 7, true]);
    expect(step(30, 0, RUN_SPEED, true)).toEqual([true, 18, 18, -RUN_SPEED, false]);
    expect(step(STAGE - 5, STAGE, RUN_SPEED, false)).toEqual([false, STAGE, STAGE, 7, false]);
  });
});

describe('slice 3b: movePlayer — the opponent\'s branch clamps to the stage, then movePositionX', () => {
  const moved = (posX: number, dist: number, stagePosition = 0) => {
    const p = player(body2());
    p.world.stagePosition = stagePosition;
    p.setPosition(posX, GROUND);
    p.movePlayer(dist);
    return [p.posX, p.x];
  };

  it('inside the stage it moves the full distance, map and screen x together', () => {
    expect(moved(400, -120, 150)).toEqual([280, 130]);
  });

  it('past either edge it stops ON the edge (the knockback callers pass ±400)', () => {
    expect([moved(780, 400), moved(20, -400), moved(0, -1), moved(STAGE, 1)]).toEqual([[STAGE, STAGE], [0, 0], [0, 0], [STAGE, STAGE]]);
  });
});

describe('slice 3b: moveTo — the AI\'s six calls (`EnemyPlayer.as:1023-1168`)', () => {
  it('replaces inputArray with ONE int point; gotInput (slice 4a) routes it to initMove, which starts a RUN', () => {
    const p = player(body2());
    p.setPosition(100, GROUND);
    p.actionState = OG_STATE.IDLE;
    p.inputArray.push({ x: 1, y: 2 }, { x: 3, y: 4 });
    // The AI passes `Math.random() * getGameStageWidth()`; the int parameters truncate it.
    expect(() => {
      p.moveTo(523.97, 358.4);
    }).toThrow('unported: MCSPlayer.startAction');
    expect([p.inputArray, p.destX, p.destY]).toEqual([[{ x: 523, y: 358 }], 523, 358]);
  });
});

/*
 * L5-OPP SLICE 4a — THE STROKE MAKERS. `getTargetPosition` (`EnemyPlayer.as:1194`), the six
 * makers and `makeSlash` (`MCSPlayer.as:4577-4733`), `lineArrayDeepCopy` (`:2237`) and
 * `EnemyPlayer.gotInput` (`EnemyPlayer.as:958`); web `§1t122s0§.as:1244`, `§1t99s0§.as:4946-5104`,
 * `:2311`, `§1t122s0§.as:1008`. The same in both builds, function by function.
 *
 * The body stands at map x 400 on the ground (358), the stage unscrolled, so a map x is a
 * screen x. Reach: fixture 1 balanced 126 (6 points), fixture 2 heavy 112 (5 points). Every
 * stroke ends in `gotInput(inputArray, true)` → `initSlash`, which is slice 4b: the tests
 * read the points it was handed, then see the throw.
 */
const BODY_X = 400;
const LEFT_X = 250;
const RIGHT_X = 560;

/** A target at map x `mapX`, clip y `y`, facing right or left. */
const foe = (mapX: number, y: number, facingRight: boolean): NpcTarget => ({
  x: mapX,
  y,
  getMapPosition: () => mapX,
  isFacingRight: () => facingRight,
  isDead: () => false,
  isDowned: () => false,
  isAirborne: () => false,
  checkHitObject: () => false,
});

/** A duellist in its init stance at BODY_X, idle, aimed at `t`. */
function striker(b: DuellistBody, t: NpcTarget | null): MCSPlayer {
  const p = player(b);
  p.setStance(b.stance); // out of battle: a battle setStance reaches startAction (slice 5)
  p.world.peaceful = false; // …but a duel is not peaceful, or every stroke is read as a move
  p.setPosition(BODY_X, GROUND);
  p.actionState = OG_STATE.IDLE;
  if (t !== null) p.changeTarget(t);
  return p;
}

/** `n` points from (x, y), stepping (dx, dy). `makeSlash`'s own test pins this shape by literal. */
const line = (x: number, y: number, dx: number, dy: number, n: number) =>
  Array.from({ length: n }, (_, i) => ({ x: x + i * dx, y: y + i * dy }));

/** Run one maker: the points it handed `gotInput`, after `initSlash`'s loud stop at `startAction` (slice 5). */
function stroke(p: MCSPlayer, make: (p: MCSPlayer) => void) {
  expect(() => {
    make(p);
  }).toThrow('unported: MCSPlayer.startAction');
  expect(p.slashArray).toEqual(p.inputArray);
  expect(p.slashArray).not.toBe(p.inputArray);
  return p.inputArray;
}

describe('slice 4a: makeSlash — int(slashLength / 20) points, the first at the start', () => {
  it('reach 126: six points, each one step on', () => {
    const p = striker(body1(), foe(LEFT_X, GROUND, true));
    p.inputArray.push({ x: 1, y: 1 });
    expect(stroke(p, (q) => {
      q.makeSlash(10, 20, 3, -4);
    })).toEqual([
      { x: 10, y: 20 }, { x: 13, y: 16 }, { x: 16, y: 12 }, { x: 19, y: 8 }, { x: 22, y: 4 }, { x: 25, y: 0 },
    ]);
  });

  it('reach 39 is int(1.95) = 1 point, and reach 0 still pushes the start (the loop just never runs)', () => {
    const short = striker(body1(), null);
    short.slashLength = 39;
    const none = striker(body1(), null);
    none.slashLength = 0;
    const at = (p: MCSPlayer) => stroke(p, (q) => {
      q.makeSlash(7, 8, 20, 0);
    });
    expect([at(short), at(none)]).toEqual([[{ x: 7, y: 8 }], [{ x: 7, y: 8 }]]);
  });
});

describe.each([
  ['fixture 1', body1, 126, 6],
  ['fixture 2', body2, 112, 5],
])('slice 4a, %s: the stroke makers (reach 126 → 6 points, 112 → 5)', (_name, body, reach, n) => {
  const run = (t: NpcTarget, make: (p: MCSPlayer) => void) => stroke(striker(body(), t), make);

  it('the fixture has the reach the table says', () => {
    expect(striker(body(), null).slashLength).toBe(reach);
  });

  it('getTargetPosition is the target\'s MAP position, with no stage offset (EnemyPlayer\'s override)', () => {
    const p = striker(body(), foe(RIGHT_X, GROUND, true));
    p.world.stagePosition = 150;
    expect(p.getTargetPosition()).toBe(RIGHT_X);
  });

  it('launchTarget: straight up from the target\'s feet, 20 px a point', () => {
    expect(run(foe(LEFT_X, GROUND, true), (p) => {
      p.launchTarget();
    })).toEqual(line(LEFT_X, GROUND, 0, -20, n));
    expect(run(foe(RIGHT_X, 300.7, false), (p) => {
      p.launchTarget();
    })).toEqual(line(RIGHT_X, 300, 0, -20, n));
  });

  it('slashDiagonalRight: from 80 px above the body, (20 cos a, −20 sin a), a = atan(dy / dx) − 0.1745', () => {
    // Left target at y 258: atan(100 / 150) − 0.1745 = 0.4135 → int(18.31) = 18, int(−8.04) = −8.
    expect(run(foe(LEFT_X, 258, true), (p) => {
      p.slashDiagonalRight();
    })).toEqual(line(BODY_X, 278, 18, -8, n));
    // Right target at y 258: atan(100 / 160) − 0.1745 = 0.3841 → 18, int(−7.49) = −7.
    expect(run(foe(RIGHT_X, 258, true), (p) => {
      p.slashDiagonalRight();
    })).toEqual(line(BODY_X, 278, 18, -7, n));
    // A near-level target (y 350): atan(8 / 150) − 0.1745 < 0, so the stroke runs DOWN: int(2.42) = 2.
    expect(run(foe(LEFT_X, 350, true), (p) => {
      p.slashDiagonalRight();
    })).toEqual(line(BODY_X, 278, 19, 2, n));
  });

  it('slashDiagonalLeft: the source\'s x is −20 sin a as well (not cos), so both steps are equal', () => {
    expect(run(foe(LEFT_X, 258, true), (p) => {
      p.slashDiagonalLeft();
    })).toEqual(line(BODY_X, 278, -8, -8, n));
    expect(run(foe(RIGHT_X, 300.7, false), (p) => {
      p.slashDiagonalLeft();
    })).toEqual(line(BODY_X, 278, -3, -3, n));
  });

  it('the diagonals at dx = 0: atan(∞) = π/2; and at dx = dy = 0 the angle is NaN and int(NaN) = 0', () => {
    expect(run(foe(BODY_X, 258, true), (p) => {
      p.slashDiagonalRight();
    })).toEqual(line(BODY_X, 278, 3, -19, n));
    expect(run(foe(BODY_X, GROUND, true), (p) => {
      p.slashDiagonalLeft();
    })).toEqual(line(BODY_X, 278, 0, 0, n));
  });

  it('the diagonals read getMapPosition() as the source\'s int, in the angle too: posX 400.9 aims from 400', () => {
    // dx = 150, not 150.9: atan(100 / 150) − 0.1745 → int(−8.04) = −8; 150.9 gives −7 (measured, node).
    const p = striker(body(), foe(LEFT_X, 258, true));
    p.setPosition(BODY_X + 0.9, GROUND);
    expect(stroke(p, (q) => {
      q.slashDiagonalLeft();
    })).toEqual(line(BODY_X, 278, -8, -8, n));
  });

  it('stabTarget: from 100 px behind the target, down to 50 below its y, starting half a reach above that', () => {
    const top = 408 - reach / 2; // 345 or 352: int(408 − 63), int(408 − 56)
    expect(run(foe(LEFT_X, GROUND, true), (p) => {
      p.stabTarget();
    })).toEqual(line(LEFT_X - 100, top, 0, 20, n));
    expect(run(foe(RIGHT_X, GROUND, false), (p) => {
      p.stabTarget();
    })).toEqual(line(RIGHT_X + 100, top, 0, 20, n));
  });

  it('slashTarget: 40 px above the target, toward it, starting a third or two thirds of a reach off it', () => {
    // Reach 126: 84 and 42 exactly. Reach 112: 74.67 and 37.33, truncated after the add.
    const far = reach === 126 ? 84 : 74.67;
    const near = reach === 126 ? 42 : 37.33;
    const at = (t: NpcTarget) => run(t, (p) => {
      p.slashTarget();
    });
    expect(at(foe(LEFT_X, GROUND, true))).toEqual(line(Math.trunc(LEFT_X + far), 318, -20, -2, n));
    expect(at(foe(LEFT_X, GROUND, false))).toEqual(line(Math.trunc(LEFT_X + near), 318, -20, -2, n));
    expect(at(foe(RIGHT_X, GROUND, true))).toEqual(line(Math.trunc(RIGHT_X - near), 318, 20, -2, n));
    expect(at(foe(RIGHT_X, GROUND, false))).toEqual(line(Math.trunc(RIGHT_X - far), 318, 20, -2, n));
  });

  it('slashTarget with no target makes nothing and calls nothing', () => {
    const p = striker(body(), null);
    p.inputArray.push({ x: 9, y: 9 });
    p.slashTarget();
    expect([p.inputArray, p.slashArray]).toEqual([[{ x: 9, y: 9 }], []]);
  });

  it('slashDownedTarget: through the point 100 px behind the target, centred on it, 10 px above its y', () => {
    const half = reach / 2;
    const at = (t: NpcTarget) => run(t, (p) => {
      p.slashDownedTarget();
    });
    expect(at(foe(LEFT_X, GROUND, true))).toEqual(line(150 + half, 348, -20, 0, n));
    expect(at(foe(LEFT_X, GROUND, false))).toEqual(line(350 + half, 348, -20, 0, n));
    expect(at(foe(RIGHT_X, GROUND, true))).toEqual(line(460 - half, 348, 20, 0, n));
    expect(at(foe(RIGHT_X, GROUND, false))).toEqual(line(660 - half, 348, 20, 0, n));
    // The side is the POINT's, not the target's: a target at 480 facing right puts it at 380.
    expect(at(foe(480, GROUND, true))).toEqual(line(380 + half, 348, -20, 0, n));
  });
});

describe('slice 4a: EnemyPlayer.gotInput — the routing (the same in both builds)', () => {
  const STROKE = [{ x: 300, y: 318 }, { x: 280, y: 316 }];
  /** A body in `state`, its move spied so the routing is visible without reaching startAction. */
  function routed(state: OgState, setUp: (p: MCSPlayer) => void = () => undefined) {
    const p = striker(body1(), null);
    p.actionState = state;
    setUp(p);
    const moves: unknown[] = [];
    vi.spyOn(p, 'initMove').mockImplementation((d) => {
      moves.push(d);
    });
    return { p, moves };
  }

  it('a stroke in a free state is copied to slashArray, then initSlash takes its first point (to startAction: UNPORTED, loud)', () => {
    const { p, moves } = routed(OG_STATE.IDLE);
    const input = STROKE.map((q) => ({ ...q }));
    expect(() => {
      p.gotInput(input, true);
    }).toThrow('unported: MCSPlayer.startAction');
    expect(p.destX).toBe(STROKE[0]?.x);
    expect([p.slashArray, p.hasSlashBuffer, moves]).toEqual([STROKE, false, []]);
    expect(p.slashArray[0]).not.toBe(input[0]);
  });

  it('a move in a free state goes to initMove with its first point', () => {
    const { p, moves } = routed(OG_STATE.RUN);
    p.gotInput(STROKE, false);
    expect([moves, p.slashArray]).toEqual([[STROKE[0]], []]);
  });

  it('committed, falling (not light), launched, downed, jumping or rolling: a stroke is BUFFERED, a move dropped', () => {
    const S = OG_STATE;
    const busy: Array<[OgState, (p: MCSPlayer) => void]> = [
      [S.IDLE, (p) => { p.slashCommitted = true; }],
      [S.FALL, (p) => { p.stance = BALANCED; }],
      [S.GOTLAUNCHED, () => undefined],
      [S.DOWNED, () => undefined],
      [S.KNOCKDOWNED, () => undefined],
      [S.FLY, () => undefined],
      [S.VICTIM, () => undefined],
      [S.JUMP, () => undefined],
      [S.FORWARDROLL, () => undefined],
    ];
    for (const [state, setUp] of busy) {
      const line = routed(state, setUp);
      line.p.gotInput(STROKE, true);
      expect([line.p.slashArrayBuffer, line.p.hasSlashBuffer, line.p.slashArray]).toEqual([STROKE, true, []]);
      expect(line.p.slashArrayBuffer).not.toBe(STROKE);
      const move = routed(state, setUp);
      move.p.gotInput(STROKE, false);
      expect([move.moves, move.p.hasSlashBuffer]).toEqual([[], false]);
    }
  });

  it('falling in LIGHT stance: a stroke is not buffered, it slashes; a move is still dropped', () => {
    const light = (p: MCSPlayer) => { p.stance = LIGHT; };
    const slash = routed(OG_STATE.FALL, light);
    // 100 px off and falling: initSlash reads an AIR slash and asks for no action (4b).
    slash.p.gotInput(STROKE, true);
    expect(slash.p.hasSlash).toBe(true);
    const move = routed(OG_STATE.FALL, light);
    move.p.gotInput(STROKE, false);
    expect([slash.p.hasSlashBuffer, slash.p.slashArray, move.moves]).toEqual([false, STROKE, []]);
  });

  it('peaceful: a stroke is read as a move', () => {
    const { p, moves } = routed(OG_STATE.IDLE, (q) => { q.world.peaceful = true; });
    p.gotInput(STROKE, true);
    expect([moves, p.slashArray]).toEqual([[STROKE[0]], []]);
  });

  it('dead, or at 0 HP: nothing at all', () => {
    const dead = routed(OG_STATE.IDLE, (q) => { q.dead = true; });
    dead.p.gotInput(STROKE, true);
    dead.p.gotInput(STROKE, false);
    const spent = routed(OG_STATE.IDLE, (q) => { q.setHP(0); });
    spent.p.gotInput(STROKE, true);
    spent.p.gotInput(STROKE, false);
    expect([dead.moves, dead.p.slashArray, spent.moves, spent.p.slashArray]).toEqual([[], [], [], []]);
  });

  it('lineArrayDeepCopy: new points, x shifted by the offset (the human\'s argument), y untouched', () => {
    const p = striker(body1(), null);
    const copy = p.lineArrayDeepCopy(STROKE, -5);
    expect(copy).toEqual([{ x: 295, y: 318 }, { x: 275, y: 316 }]);
    expect(copy[0]).not.toBe(STROKE[0]);
    expect(p.lineArrayDeepCopy(STROKE)).toEqual(STROKE);
  });
});

/*
 * SLICE 4b — THE SLASH START. `initSlash`, `checkNextSlash`, `startSlash` (Android
 * `MCSPlayer.as:2403` / `:2503` / `:2516`, web `§1t99s0§.as:2475` / `:2575` / `:2588`) and the
 * `cancelStealth` `initSlash` opens with (`:4359`, web `:4728`). Read line by line, the builds
 * differ in one place: the downstab's side test reads `mcs.x` (the SCREEN x) in Android and
 * `posX` in the web; web ported. The web `isAirborne` also counts FALL (`§1t68s0§.as:793`):
 * ruled onto `MCSPlayer` alone. `startAction` (slice 5) is spied, so each test sees the state
 * `initSlash` asked for; `endSlash` (4c) stays loud. Every number worked by hand, the
 * velocities re-run in node.
 */
const T = OG_SLASH_TYPE;

/** A duellist in its init stance at BODY_X on the ground, idle, its `startAction` recorded. */
function slasher(b: DuellistBody, rng: Rng = NO_DRAW) {
  const p = player(b, false, rng);
  p.setStance(b.stance);
  p.world.peaceful = false;
  p.setPosition(BODY_X, GROUND);
  p.actionState = OG_STATE.IDLE;
  const actions: OgState[] = [];
  vi.spyOn(p, 'startAction').mockImplementation((s) => {
    actions.push(s);
  });
  return { p, actions };
}

/** Hand `initSlash` a stroke the way `gotInput` does: copied into `slashArray`, then its first point. */
function init(p: MCSPlayer, pts: [MovePoint, ...MovePoint[]]): void {
  p.slashArray = pts.map((q) => ({ ...q }));
  p.initSlash(pts[0]);
}

/** A stroke `startSlash` reads: in `slashArray`, typed as `initSlash` would have typed it. */
function start(p: MCSPlayer, type: number, pts: MovePoint[]): void {
  p.slashType = type;
  p.slashArray = pts;
  p.startSlash();
}

describe.each([
  ['fixture 1', body1, 6, 'balanced', 40, 0],
  ['fixture 2', body2, 5, 'heavy', 30, 86],
])('slice 4b, %s: the makers\' strokes through initSlash and startSlash', (_name, body, n, clip, speed, damage) => {
  it('launchTarget: a rise of 20 × (n − 1) is HOR_SLASHUP, never UP (100 is not > 100); 150 px off, so RUN', () => {
    const { p, actions } = slasher(body());
    p.changeTarget(foe(LEFT_X, GROUND, true));
    p.hasSlashBuffer = true;
    p.launchTarget();
    expect([p.destX, p.destY, p.hasSlash, p.hasSlashBuffer, p.slashType, actions])
      .toEqual([LEFT_X, GROUND, true, false, T.horUp, [OG_STATE.RUN]]);
  });

  it('slashTarget on a near target to the right: HOR, SLASH where it stands, facing point 3 (right)', () => {
    const { p, actions } = slasher(body());
    p.changeTarget(foe(440, GROUND, true));
    p.faceLeft();
    p.slashTarget();
    const first = n === 6 ? 398 : 402; // int(440 − 42), int(440 − 37.33)
    expect([p.destX, p.destY, p.slashType, p.facingRight, actions])
      .toEqual([first, 318, T.hor, true, [OG_STATE.SLASH]]);
  });

  it('slashTarget on a near target to the left: HOR, SLASH, and point 3 is left of the body, so it faces left', () => {
    const { p, actions } = slasher(body());
    p.changeTarget(foe(360, GROUND, true));
    p.slashTarget();
    const first = n === 6 ? 444 : 434; // int(360 + 84), int(360 + 74.67)
    expect([p.destX, p.slashType, p.facingRight, actions]).toEqual([first, T.hor, false, [OG_STATE.SLASH]]);
  });

  it('startSlash on the right-hand stroke: committed, faces right, the stance\'s HOR clip, lands on the ground', () => {
    const { p } = slasher(body(), () => 0.5);
    p.changeTarget(foe(440, GROUND, true));
    p.faceLeft();
    p.slashTarget();
    p.startSlash();
    // f1 (398,318)→(498,308), speed 40: xdiff 98, ydiff 40 → (37, 15); f2 (402,318)→(482,310), speed 30: 82, 40 → (26, 13).
    const [endX, vel] = n === 6 ? [498, [37, 15]] : [482, [26, 13]];
    expect([p.slashCommitted, p.facingRight, p.animation, p.destX, p.destY, [p.velX, p.velY], p.slashDamage])
      .toEqual([true, true, `${clip}_horslash_parta`, endX, GROUND, vel, damage]);
  });

  it('startSlash on the left-hand stroke: faces left, velX negative', () => {
    const { p } = slasher(body(), () => 0.5);
    p.changeTarget(foe(360, GROUND, true));
    p.slashTarget();
    p.startSlash();
    // f1 (444,318)→(344,308): −56, 40 → (−32, 23); f2 (434,318)→(354,310): −46, 40 → (−22, 19).
    const [endX, vel] = n === 6 ? [344, [-32, 23]] : [354, [-22, 19]];
    expect([p.facingRight, p.destX, p.destY, [p.velX, p.velY]]).toEqual([false, endX, GROUND, vel]);
    expect(speed).toBe(n === 6 ? 40 : 30);
  });
});

describe('slice 4b: initSlash — reading the stroke (the same in both builds but one line)', () => {
  const at = (setUp: (p: MCSPlayer) => void, pts: [MovePoint, ...MovePoint[]]) => {
    const s = slasher(body1());
    setUp(s.p);
    init(s.p, pts);
    return s;
  };
  const idle = () => undefined;
  const type = (setUp: (p: MCSPlayer) => void, pts: [MovePoint, ...MovePoint[]]) => at(setUp, pts).p.slashType;

  it('destX is the first point truncated and clamped to the stage (0–800); destY its y, truncated', () => {
    const d = (x: number, y: number) => {
      const { p } = at(idle, [{ x, y }, { x: x + 100, y }]);
      return [p.destX, p.destY];
    };
    expect([d(-5, 300), d(900, 300), d(450.7, 300.9)]).toEqual([[0, 300], [800, 300], [450, 300]]);
  });

  it('JUMP: a stroke starting more than 100 px above the body (108); at exactly 100 it is flat', () => {
    expect(type(idle, [{ x: 500, y: 250 }, { x: 600, y: 250 }])).toBe(T.jump);
    expect(type(idle, [{ x: 500, y: 258 }, { x: 600, y: 258 }])).toBe(T.hor);
  });

  it('LIGHT and FALLING: ending more than 100 px below the body is DROP, else AIR; far off and falling, no action', () => {
    const fall = (p: MCSPlayer) => {
      p.stance = LIGHT;
      p.actionState = OG_STATE.FALL;
      p.setPosition(BODY_X, 200);
    };
    const drop = at(fall, [{ x: 500, y: 301 }, { x: 600, y: 301 }]);
    const air = at(fall, [{ x: 500, y: 300 }, { x: 600, y: 300 }]);
    const near = at(fall, [{ x: 420, y: 300 }, { x: 520, y: 300 }]);
    expect([drop.p.slashType, drop.actions, air.p.slashType, air.actions, near.actions])
      .toEqual([T.drop, [], T.air, [], [OG_STATE.SLASH]]);
    // Falling in BALANCED is not the light branch: the same stroke reads flat.
    expect(type((p) => { fall(p); p.stance = BALANCED; }, [{ x: 500, y: 300 }, { x: 600, y: 300 }])).toBe(T.hor);
  });

  it('DOWNSTAB: canStab, a stroke running down, ending within 50 px of its start x; lands 55 short, on the body\'s side', () => {
    const stab = (p: MCSPlayer) => { p.canStab = true; };
    const s = at(stab, [{ x: 450, y: 300 }, { x: 460, y: 380 }]);
    // posX 400 < 450: 450 − 55 = 395, 5 px off, so SLASH; point 3 clamps to point 1 (460): faces right.
    expect([s.p.slashType, s.p.destX, s.actions, s.p.facingRight]).toEqual([T.downstab, 395, [OG_STATE.SLASH], true]);
    const right = at(stab, [{ x: 350, y: 300 }, { x: 340, y: 380 }]);
    expect([right.p.slashType, right.p.destX]).toEqual([T.downstab, 405]);
    // 50 px across is not within 50; nor is any stroke without canStab. Both read as a down-tilt.
    expect(type(stab, [{ x: 450, y: 300 }, { x: 500, y: 380 }])).toBe(T.horDown);
    expect(type(idle, [{ x: 450, y: 300 }, { x: 460, y: 380 }])).toBe(T.horDown);
  });

  it('WEB: the downstab\'s side is read from posX (map); Android reads mcs.x (screen) and lands on the other side', () => {
    const s = at((p) => {
      p.canStab = true;
      p.world.stagePosition = 150;
      p.setPosition(BODY_X, GROUND); // screen x 250, map x 400
    }, [{ x: 380, y: 300 }, { x: 385, y: 380 }]);
    // web: 400 < 380 is false → 380 + 55 = 435. Android: 250 < 380 → 380 − 55 = 325.
    expect([s.p.x, s.p.slashType, s.p.destX]).toEqual([250, T.downstab, 435]);
  });

  it('the downstab\'s landing is clamped to the stage: −25 → 0, 835 → 800', () => {
    const land = (bodyX: number, x: number) => at((p) => {
      p.canStab = true;
      p.setPosition(bodyX, GROUND);
    }, [{ x, y: 300 }, { x, y: 380 }]).p.destX;
    expect([land(10, 30), land(795, 780)]).toEqual([0, 800]);
  });

  it('UP: rising more than 100 px (108) from a body on the ground; not from a body in the air', () => {
    const up: [MovePoint, MovePoint] = [{ x: 500, y: GROUND }, { x: 500, y: 250 }];
    expect(type(idle, up)).toBe(T.up);
    expect(type(idle, [{ x: 500, y: GROUND }, { x: 500, y: 258 }])).toBe(T.horUp);
    expect(type((p) => { p.setPosition(BODY_X, 300); }, [{ x: 500, y: 300 }, { x: 500, y: 192 }])).toBe(T.horUp);
  });

  it('WEB: a body in the FALL state is airborne on the ground too, so the same rise is HOR_SLASHUP (Android: UP)', () => {
    const s = at((p) => { p.actionState = OG_STATE.FALL; }, [{ x: 500, y: GROUND }, { x: 500, y: 250 }]);
    expect([s.p.slashType, s.actions]).toEqual([T.horUp, []]);
  });

  it('the tilt: first y − last y of 26 is HOR_SLASHUP, 25 and −25 are flat, −26 is HOR_SLASHDOWN', () => {
    const tilt = (dy: number) => type(idle, [{ x: 500, y: 300 }, { x: 600, y: 300 - dy }]);
    expect([tilt(26), tilt(25), tilt(-25), tilt(-26)]).toEqual([T.horUp, T.hor, T.hor, T.horDown]);
  });

  it('the tilt is an int: 25.5 truncates to 25, which is flat (the review\'s catch)', () => {
    expect(type(idle, [{ x: 500, y: 300 }, { x: 600, y: 274.5 }])).toBe(T.hor);
  });

  it('standing range: 49 px off slashes where it stands, 50 runs; a launched body never stands, it runs', () => {
    const acts = (setUp: (p: MCSPlayer) => void, x: number) => at(setUp, [{ x, y: 318 }, { x: x + 100, y: 318 }]).actions;
    expect([acts(idle, 449), acts(idle, 450), acts(idle, 351), acts(idle, 350)])
      .toEqual([[OG_STATE.SLASH], [OG_STATE.RUN], [OG_STATE.SLASH], [OG_STATE.RUN]]);
    expect(acts((p) => { p.actionState = OG_STATE.GOTLAUNCHED; }, 420)).toEqual([OG_STATE.RUN]);
  });

  it('the facing point is lengthThreshhold − 1 = 3, clamped into the stroke', () => {
    const faces = (pts: [MovePoint, ...MovePoint[]]) => {
      const { p } = at((q) => { q.faceLeft(); }, pts);
      return p.facingRight;
    };
    const y = 318;
    expect(faces([{ x: 410, y }, { x: 380, y }, { x: 380, y }, { x: 450, y }, { x: 380, y }])).toBe(true);
    expect(faces([{ x: 410, y }, { x: 380, y }])).toBe(false); // 3 → 1
    expect(faces([{ x: 410, y }])).toBe(true); // 3 → 0
  });

  it('cancelStealth first: a hidden or faded body puffs smoke at its int map x and clip y, then shows fully', () => {
    const smoke = (setUp: (p: MCSPlayer) => void) => {
      const { p } = at((q) => {
        q.setPosition(BODY_X + 0.9, GROUND + 0.6);
        setUp(q);
      }, [{ x: 420, y: 318 }, { x: 520, y: 318 }]);
      return [p.events.filter((e) => e.type === 'smoke'), p.visible, p.alpha];
    };
    const puff = [{ type: 'smoke', x: BODY_X, y: GROUND }];
    expect(smoke((p) => { p.visible = false; })).toEqual([puff, true, 1]);
    expect(smoke((p) => { p.alpha = 0.5; })).toEqual([puff, true, 1]);
    expect(smoke(idle)).toEqual([[], true, 1]);
  });
});

describe('slice 4b: checkNextSlash — the next stroke, or the buffered one', () => {
  const pts = [{ x: 420, y: 318 }, { x: 520, y: 318 }];
  const buffered = [{ x: 600, y: 318 }, { x: 700, y: 318 }];

  it('hasSlash: re-reads slashArray from its first point, and the buffer is dropped', () => {
    const { p, actions } = slasher(body1());
    p.slashArray = pts;
    p.slashArrayBuffer = buffered;
    p.hasSlash = true;
    p.hasSlashBuffer = true;
    p.checkNextSlash();
    expect([p.destX, p.slashArray, p.hasSlashBuffer, actions]).toEqual([420, pts, false, [OG_STATE.SLASH]]);
  });

  it('the buffer only: it BECOMES slashArray (the same array, not a copy) and is read', () => {
    const { p, actions } = slasher(body1());
    p.slashArrayBuffer = buffered;
    p.hasSlashBuffer = true;
    p.checkNextSlash();
    expect(p.slashArray).toBe(buffered);
    expect([p.destX, p.hasSlash, p.hasSlashBuffer, actions]).toEqual([600, true, false, [OG_STATE.RUN]]);
  });

  it('neither: nothing', () => {
    const { p, actions } = slasher(body1());
    p.slashArray = pts;
    p.checkNextSlash();
    expect([p.destX, p.hasSlash, actions]).toEqual([0, false, []]);
  });
});

describe('slice 4b: startSlash — the clip, the landing and the speed (the same in both builds)', () => {
  /** `startSlash` rolls the damage: one draw. */
  const HALF: Rng = () => 0.5;
  const flat = [{ x: 500, y: 318 }, { x: 600, y: 318 }];
  const clipOf = (stance: number, type: number) => {
    const { p } = slasher(body1(), HALF);
    p.stance = stance;
    const before = p.animation;
    start(p, type, flat);
    return p.animation === before ? '—' : p.animation;
  };

  it('the clip per stance and slash type; only light has an AIR clip; reversed plays one clip for all three flat types', () => {
    const types = [T.hor, T.horDown, T.horUp, T.jump, T.drop, T.up, T.air, T.downstab];
    const row = (stance: number) => types.map((t) => clipOf(stance, t));
    const std = (s: string) => [
      `${s}_horslash_parta`, `${s}_downslash_parta`, `${s}_upslash_parta`, `${s}_jumpslash_parta`,
      `${s}_fallslash_parta`, `${s}_jumpslash_parta`,
    ];
    expect(row(LIGHT)).toEqual([...std('light'), 'light_jumpslash_partb', 'downstab']);
    expect(row(BALANCED)).toEqual([...std('balanced'), '—', 'downstab']);
    expect(row(HEAVY)).toEqual([...std('heavy'), '—', 'downstab']);
    expect(row(DUAL)).toEqual([...std('dual'), '—', 'downstab']);
    expect(row(REVERSED)).toEqual([
      'reversed_slash_parta', 'reversed_slash_parta', 'reversed_slash_parta', 'reversed_jumpslash_parta',
      'reversed_fallslash_parta', 'reversed_jumpslash_parta', '—', 'downstab',
    ]);
  });

  it('the speed: light 50, balanced and reversed 40, heavy and dual 30 (a 300 px flat stroke from the body)', () => {
    const vel = (stance: number) => {
      const { p } = slasher(body1(), HALF);
      p.stance = stance;
      start(p, T.hor, [{ x: BODY_X, y: GROUND }, { x: 700, y: GROUND }]);
      return [p.velX, p.velY];
    };
    expect([LIGHT, BALANCED, REVERSED, HEAVY, DUAL].map(vel)).toEqual([[50, 0], [40, 0], [40, 0], [30, 0], [30, 0]]);
  });

  it('facing: right only when the first x is less than the last; equal faces left', () => {
    const faces = (lastX: number) => {
      const { p } = slasher(body1(), HALF);
      p.faceRight();
      start(p, T.hor, [{ x: 500, y: 318 }, { x: lastX, y: 200 }]);
      return p.facingRight;
    };
    expect([faces(501), faces(500), faces(499)]).toEqual([true, false, false]);
  });

  it('destX is the last point clamped; destY the ground unless the stroke ends more than 100 px up (258 stays, 259 lands)', () => {
    const land = (x: number, y: number) => {
      const { p } = slasher(body1(), HALF);
      start(p, T.hor, [{ x: 500, y: 318 }, { x, y }]);
      return [p.destX, p.destY];
    };
    expect([land(600, 258), land(600, 259), land(900, 300), land(-10, 300)])
      .toEqual([[600, 258], [600, GROUND], [800, GROUND], [0, GROUND]]);
  });

  it('a downstab: drops the clip to the ground, keeps its facing, and has no speed (dist / 0 → velocity 0)', () => {
    const { p } = slasher(body1(), HALF);
    p.stance = HEAVY;
    p.setPosition(BODY_X, 300);
    p.faceLeft();
    p.velX = 7;
    p.velY = 7;
    start(p, T.downstab, [{ x: 450, y: 300 }, { x: 460, y: 380 }]);
    expect([p.y, p.posX, p.facingRight, p.animation, p.destX, p.destY, p.velX, p.velY])
      .toEqual([GROUND, BODY_X, false, 'downstab', 460, GROUND, 0, 0]);
  });

  it('the landing is an int: a fractional last point truncates in destX and in an air destY (the review\'s catch)', () => {
    const land = (x: number, y: number) => {
      const { p } = slasher(body1(), HALF);
      start(p, T.hor, [{ x: 500, y: 318 }, { x, y }]);
      return [p.destX, p.destY];
    };
    expect([land(600.7, 318), land(600, 200.5)]).toEqual([[600, GROUND], [600, 200]]);
  });

  it('ydiff is an int: from y 300.9 to the ground it is 57, not 57.1, so velY is 38, not 39 (the review\'s catch)', () => {
    const { p } = slasher(body1(), HALF);
    start(p, T.hor, [{ x: BODY_X, y: 300.9 }, { x: 413, y: 318 }]);
    expect([p.velX, p.velY]).toEqual([8, 38]);
  });

  it('on its own point, dist is 0 and 0 / 0 is NaN; int(NaN) is 0', () => {
    const { p } = slasher(body1(), HALF);
    p.velX = 7;
    p.velY = 7;
    start(p, T.hor, [{ x: BODY_X, y: GROUND }, { x: BODY_X, y: GROUND }]);
    expect([p.velX, p.velY]).toEqual([0, 0]);
  });

  it('doShunpo: lands at the end, doubles the damage, then endSlash — UNPORTED, loud', () => {
    const { p } = slasher(body2(), () => 0.5);
    p.doShunpo = true;
    expect(() => {
      start(p, T.hor, [{ x: 420, y: 318 }, { x: 520, y: 318 }]);
    }).toThrow('unported: MCSPlayer.endSlash');
    expect([p.posX, p.y, p.slashDamage]).toEqual([520, GROUND, 172]);
  });
});

describe('slice 4b: the ruling — WEB isAirborne on the duellist only', () => {
  it('the duellist counts FALL on the ground; the mobs\' Npc keeps the height-only test', () => {
    const { p } = slasher(body1());
    const air = () => [p.isAirborne(), Npc.prototype.isAirborne.call(p)];
    p.actionState = OG_STATE.FALL;
    const falling = air();
    p.actionState = OG_STATE.IDLE;
    const standing = air();
    p.setPosition(BODY_X, 300);
    expect([falling, standing, air()]).toEqual([[true, false], [false, false], [true, true]]);
  });
});

describe('the harness rule — unported calls throw, and their count only goes down', () => {
  it('MCSPlayer.ts names exactly 3 unported sites (startAction, clearInteractTarget, endSlash)', () => {
    const src = readFileSync(new URL('../src/core/npc/MCSPlayer.ts', import.meta.url), 'utf8');
    expect(src.match(/unported\('[^']*'\)/g)).toEqual([
      "unported('MCSPlayer.startAction')", "unported('StageManager.clearInteractTarget')", "unported('MCSPlayer.endSlash')",
    ]);
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
