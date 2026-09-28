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
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { OG_ANIM, OG_LAUNCH, OG_PART, OG_STATE, type OgPart, type OgState } from '../src/config/ogActor';
import {
  OG_CLIP_END_LABELS,
  OG_DO_ACTION_LABELS,
  OG_SLASH_TYPE,
  OG_STANCE_REACH,
  OG_START_ACTION_LABELS,
  OG_AI_SKILL_LISTS,
  OG_SKILL,
} from '../src/config/ogMcsPlayer';
import { REACH } from '../src/config/reach';
import { initDuellistBody, type DuellistBody } from '../src/core/npc/duellistBody';
import { DuelHitGeometry, OgAnimLibrary } from '../src/core/npc/duelSeam';
import { deriveDuellist } from '../src/core/npc/duellistStats';
import { newPlayerState, writeBattleStats, writeEquipment, writeSkillStats } from '../src/core/npc/duellistWriter';
import { MCSPlayer, type MovePoint } from '../src/core/npc/MCSPlayer';
import { Npc } from '../src/core/npc/Npc';
import { NpcDamage } from '../src/core/npc/NpcDamage';
import type { AnimLibrary, HitGeometry, HitShape, NpcTarget, PlayerWorld } from '../src/core/npc/types';
import type { Rng } from '../src/core/Sim';
import { getChiCost, getCooldown, skillCooldownModifier, skillData } from '../src/core/npc/xmlSkill';

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
  playerCanSeeSlash: false,
  playbackShowSlash: false,
  networkPlayBack: false,
  playerSpeed: 0,
  playerSpeedBuff: false,
  playerHasSlash: false,
  playerSlashArray: [],
});
const anims: AnimLibrary = { clip: () => ({ durationFrames: 3, loop: false }) };
const geometry: HitGeometry = {
  partAtPoint: () => null, partHitBy: () => null, partX: () => 0, partsHitBy: () => [], clipHitTestPoint: () => false,
};
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

  it('a moving body is stopped: dest set, slash cleared, IDLE (5a), then clearInteractTarget — UNPORTED, and loud', () => {
    const p = player(body2(), true);
    p.actionState = OG_STATE.WALK;
    p.posX = 300;
    p.hasSlash = true;
    p.hasSlashBuffer = true;
    expect(() => {
      p.setStance(LIGHT);
    }).toThrow('unported: StageManager.clearInteractTarget');
    expect([p.destX, p.destY, p.hasSlash, p.hasSlashBuffer, p.actionState, p.animation])
      .toEqual([300, GROUND, false, false, OG_STATE.IDLE, 'idle']);
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

  it('unstubbed, the fields are set BEFORE startAction: the RUN (5a) reads hasSlash already cleared, so it runs sheathed', () => {
    const p = player(body());
    p.setPosition(400, GROUND);
    p.hasSlash = true;
    p.initMove({ x: 600, y: GROUND });
    expect([p.destX, p.hasSlash, p.actionState, p.animation]).toEqual([600, false, OG_STATE.RUN, 'run_sheathed']);
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
    p.moveTo(523.97, 358.4);
    expect([p.inputArray, p.destX, p.destY, p.actionState]).toEqual([[{ x: 523, y: 358 }], 523, 358, OG_STATE.RUN]);
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
  alpha: 1,
  visible: true,
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

/** Run one maker: the points it handed `gotInput`. `initSlash` asks `startAction` (5a) for ONE state, recorded, not run. */
function stroke(p: MCSPlayer, make: (p: MCSPlayer) => void) {
  const started: OgState[] = [];
  vi.spyOn(p, 'startAction').mockImplementation((s) => {
    started.push(s);
  });
  make(p);
  expect(started).toHaveLength(1);
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

  it('a stroke in a free state is copied to slashArray, then initSlash takes its first point (100 px off: it RUNs, 5a)', () => {
    const { p, moves } = routed(OG_STATE.IDLE);
    const input = STROKE.map((q) => ({ ...q }));
    p.gotInput(input, true);
    expect([p.destX, p.actionState, p.animation]).toEqual([STROKE[0]?.x, OG_STATE.RUN, 'balanced_run']);
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

  it('doShunpo: lands at the end, doubles the damage, then endSlash (4c) hits, poses and clears the flag', () => {
    const { p, order, hits } = ender(body2(), () => 0.5);
    p.doShunpo = true;
    start(p, T.hor, [{ x: 420, y: 318 }, { x: 520, y: 318 }]);
    expect([p.posX, p.y, p.slashDamage, hits[0]?.damage.damage, order, p.doShunpo])
      .toEqual([520, GROUND, 172, 172, ['hit', OG_STATE.POSE], false]);
  });

  it('doShunpo unstubbed: endSlash reaches NPCManager.checkPlayerHit — UNPORTED, loud', () => {
    const { p } = slasher(body2(), () => 0.5);
    p.doShunpo = true;
    expect(() => {
      start(p, T.hor, [{ x: 420, y: 318 }, { x: 520, y: 318 }]);
    }).toThrow('unported: NPCManager.checkPlayerHit');
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

/*
 * L5-OPP SLICE 4c — THE SLASH END. `doSlash`, `endSlash`, `endDownStab` (`MCSPlayer.as:2708`,
 * `:2767`, `:2862`; web `§1t99s0§.as:2780`, `:2839`, `:2940`) and the `deductReloadBar`
 * `endSlash` calls (`:3240`, web `:3293`). Read line by line, `doSlash`, `endDownStab` and
 * `deductReloadBar` are the same in both builds (all 36 of `doSlash`'s clip names too); the web
 * `endSlash` adds the `Damage` attacker (ported) and a closing timer block that never runs on
 * the duellist (ruled out, DIVERGENCES "L5-OPP SLICE 4c"). The hit is `NPCManager.checkPlayerHit`,
 * the seam (slice 8): spied here, loud unstubbed. Every number worked by hand.
 */

/** A slasher whose `startAction` and hit land in one ordered log (`'hit'` for the hit). */
function ender(b: DuellistBody, rng: Rng = NO_DRAW) {
  const { p } = slasher(b, rng);
  const order: Array<OgState | 'hit'> = [];
  const hits: Array<{ points: readonly MovePoint[]; offset: number; damage: NpcDamage }> = [];
  vi.spyOn(p, 'startAction').mockImplementation((s) => {
    order.push(s);
  });
  vi.spyOn(p, 'checkPlayerHit').mockImplementation((points, offset, damage) => {
    order.push('hit');
    hits.push({ points, offset, damage });
  });
  return { p, order, hits };
}

/** `doSlash` once a frame until `endSlash` has run (it asks for POSE or FALL): the frames it took. */
function slashToEnd(p: MCSPlayer, order: ReadonlyArray<OgState | 'hit'>): number {
  for (let frame = 1; frame <= 20; frame += 1) {
    p.doSlash();
    if (order.includes(OG_STATE.POSE) || order.includes(OG_STATE.FALL)) return frame;
  }
  return -1;
}

/** The packet `endSlash` handed the hit, as plain fields. */
const packet = (d: NpcDamage | undefined) =>
  d && [d.damage, d.attackerlvl, d.launchType, d.stance, d.piercingDamage, d.attacker];

describe.each([
  ['fixture 1', body1, 1, BALANCED, 0, 102],
  ['fixture 2', body2, 45, HEAVY, 86, 78],
])('slice 4c, %s: slashTarget\'s stroke from initSlash to endSlash', (_name, body, level, stance, damage, reload) => {
  it('to the right: doSlash runs it home in 3 frames, then endSlash lands, hits, poses and faces right', () => {
    const { p, order, hits } = ender(body(), () => 0.5);
    p.changeTarget(foe(440, GROUND, true));
    p.reload = 150;
    p.slashTarget();
    p.startSlash();
    const frames = slashToEnd(p, order);
    // f1 400→498 at 40: 440, 480, 498; f2 400→482 at 30: 430, 460, 482. The stroke ends at y 308 / 310,
    // 50 / 48 over the ground (not > 100), so it lands. Point 3 (f1) / 2 (f2) is left of the end: right, +5.
    // Reload 150 less 48 (balanced) / 72 (heavy, × 1.5).
    const endX = level === 1 ? 498 : 482;
    expect([frames, p.posX, p.y, p.velX, p.velY, p.facingRight, p.reload, p.hasSlash, p.slashCommitted, order])
      .toEqual([3, endX, GROUND, 5, 0, true, reload, false, false, [OG_STATE.SLASH, 'hit', OG_STATE.POSE]]);
    expect(hits.map((h) => [h.points, h.offset])).toEqual([[p.slashArray, 0]]);
    expect(packet(hits[0]?.damage)).toEqual([damage, level, 0, stance, 0, p]);
  });

  it('to the left: 2 frames, and it ends facing left, −5', () => {
    const { p, order } = ender(body(), () => 0.5);
    p.changeTarget(foe(360, GROUND, true));
    p.slashTarget();
    p.startSlash();
    const frames = slashToEnd(p, order);
    // f1 400→344 at 40: 360, 344; f2 400→354 at 30: 370, 354.
    expect([frames, p.posX, p.velX, p.facingRight]).toEqual([2, level === 1 ? 344 : 354, -5, false]);
  });
});

describe('slice 4c: doSlash — a frame of the slash (the same in both builds)', () => {
  const START = ['horslash_parta', 'downslash_parta', 'upslash_parta'];
  const MOVING = [...START, 'horslash_partb', 'downslash_partb', 'upslash_partb', 'fallslash_partb', 'jumpslash_partb'];
  const STILL = ['jumpslash_parta', 'fallslash_parta', 'idle'];
  /** One frame of a heading-right slash in `stance` on `clip`: the x it reached. */
  const x = (stance: number, clip: string) => {
    const { p } = ender(body1());
    p.stance = stance;
    p.startAnim(clip);
    p.destX = 700;
    p.doSlash();
    return p.posX;
  };

  it('it travels only on its own stance\'s slash clips, at the stance\'s speed (dual heavy\'s, reversed balanced\'s)', () => {
    const run = (stance: number, name: string, clips: string[]) => clips.map((c) => x(stance, `${name}_${c}`));
    expect(run(LIGHT, 'light', MOVING)).toEqual(MOVING.map(() => 450));
    expect(run(BALANCED, 'balanced', MOVING)).toEqual(MOVING.map(() => 440));
    expect(run(HEAVY, 'heavy', MOVING)).toEqual(MOVING.map(() => 430));
    expect(run(DUAL, 'dual', MOVING)).toEqual(MOVING.map(() => 430));
    const rev = ['slash_parta', 'slash_partb', 'fallslash_partb', 'jumpslash_partb'];
    expect(run(REVERSED, 'reversed', rev)).toEqual(rev.map(() => 440));
    expect(run(LIGHT, 'light', STILL)).toEqual(STILL.map(() => BODY_X));
    expect([x(HEAVY, 'balanced_horslash_parta'), x(REVERSED, 'reversed_jumpslash_parta'), x(-1, 'light_horslash_parta')])
      .toEqual([BODY_X, BODY_X, BODY_X]);
  });

  it('a non-flat slash above the ground also drops by velY; a flat one, or one on the ground, does not', () => {
    const y = (type: number, fromY: number) => {
      const { p } = ender(body1());
      p.startAnim('balanced_horslash_partb');
      p.slashType = type;
      p.destX = 700;
      p.velY = 12;
      p.setPosition(BODY_X, fromY);
      p.doSlash();
      return p.y;
    };
    expect([T.jump, T.up, T.drop, T.air, T.downstab].map((t) => y(t, 300))).toEqual([312, 312, 312, 312, 312]);
    expect([T.hor, T.horDown, T.horUp].map((t) => y(t, 300))).toEqual([300, 300, 300]);
    expect(y(T.jump, GROUND)).toBe(GROUND);
  });

  it('arriving calls endSlash: a stroke ending 208 px up falls from 90 below its end, velY zeroed', () => {
    const { p, order } = ender(body1());
    p.startAnim('balanced_jumpslash_partb');
    p.slashType = T.jump;
    p.slashArray = [{ x: 380, y: 150 }, { x: 410, y: 150 }];
    p.destX = 410;
    p.velY = 12;
    p.setPosition(BODY_X, 200);
    p.doSlash();
    // 208 over the ground: FALL, y = 150 + 90 = 240, velY 0. The frame goes on to its own drop, which
    // then adds velY 0: stopping there instead would read the same, so no test can tell them apart.
    expect([p.posX, p.y, p.velY, order]).toEqual([410, 240, 0, [OG_STATE.FALL, 'hit']]);
  });
});

describe('slice 4c: endSlash — the landing, the hit and the next stroke (web)', () => {
  /** Fixture 2 (heavy, level 45, canLaunch) at BODY_X with `pts` as its stroke, set up, then ended. */
  const ended = (pts: MovePoint[], setUp: (p: MCSPlayer) => void = () => undefined) => {
    const e = ender(body2());
    e.p.slashArray = pts;
    e.p.hasSlash = true;
    e.p.slashCommitted = true;
    setUp(e.p);
    e.p.endSlash();
    return e;
  };
  const flat = [{ x: 400, y: 318 }, { x: 500, y: 318 }];

  it('a stroke ending more than 100 px up falls from 90 below its end: FALL, then the hit (258 lands, 257 falls)', () => {
    const land = (endY: number) => {
      const { p, order } = ended([{ x: 400, y: 318 }, { x: 500, y: endY }], (q) => { q.velY = 9; });
      return [p.y, p.velY, order];
    };
    expect(land(258)).toEqual([GROUND, 0, ['hit', OG_STATE.POSE]]);
    expect(land(257)).toEqual([347, 0, [OG_STATE.FALL, 'hit']]);
    expect(land(200.5)).toEqual([290.5, 0, [OG_STATE.FALL, 'hit']]);
  });

  it('the packet: the rolled damage, the level, the stance, the piercing stat and (web) the attacker', () => {
    const { p, hits } = ended(flat, (q) => {
      q.slashDamage = 86;
      q.STAT_PIERCINGDMG = 7;
      q.world.stagePosition = 30;
    });
    expect(packet(hits[0]?.damage)).toEqual([86, 45, 0, HEAVY, 7, p]);
    expect(hits[0]?.offset).toBe(30);
    expect(hits[0]?.points).toBe(p.slashArray);
  });

  it('only an UP slash on a body that can launch launches (LAUNCH_AIR, 1)', () => {
    const launch = (type: number, can: boolean) =>
      ended(flat, (q) => { q.slashType = type; q.canLaunch = can; }).hits[0]?.damage.launchType;
    expect([launch(T.up, true), launch(T.up, false), launch(T.hor, true), launch(T.jump, true)]).toEqual([1, 0, 0, 0]);
  });

  it('it faces the way the stroke\'s last lengthThreshhold points run: the last against point len − 3, never below 0', () => {
    const faces = (xs: number[]) => {
      const { p } = ended(xs.map((x) => ({ x, y: 318 })));
      return [p.facingRight, p.velX];
    };
    expect(faces([100, 300, 500, 520, 510, 505])).toEqual([false, -5]); // 505 vs 520, not vs 100
    expect(faces([600, 700, 650])).toEqual([true, 5]); // index 0: 650 vs 600, not vs 700
    expect(faces([500, 501])).toEqual([true, 5]);
    expect(faces([500, 500])).toEqual([false, -5]);
  });

  it('the facing re-reads slashArray AFTER the hit, as the source does (the review\'s catch)', () => {
    const { p } = ended(flat, (q) => {
      vi.spyOn(q, 'checkPlayerHit').mockImplementation(() => {
        q.slashArray = [{ x: 600, y: 318 }, { x: 700, y: 318 }];
      });
    });
    // fresh: 700 > 600, right. A stale last point (500) against the fresh first (600) would face left.
    expect([p.facingRight, p.velX]).toEqual([true, 5]);
  });

  it('a buffered stroke BECOMES the next one, uncopied; with none, hasSlash is cleared', () => {
    const next = [{ x: 1, y: 2 }];
    const buffered = ended(flat, (q) => { q.slashArrayBuffer = next; q.hasSlashBuffer = true; }).p;
    const none = ended(flat).p;
    expect([buffered.slashArray === next, buffered.hasSlash, buffered.hasSlashBuffer, buffered.slashCommitted])
      .toEqual([true, true, false, false]);
    expect([none.slashArray, none.hasSlash, none.hasSlashBuffer, none.slashCommitted]).toEqual([flat, false, false, false]);
  });

  it('pays the reload (heavy: 150 − 72) before the hit, and clears doShunpo', () => {
    const { p, order, hits } = ender(body2());
    p.slashArray = flat;
    p.reload = 150;
    p.doShunpo = true;
    let paidBeforeHit = false;
    vi.spyOn(p, 'checkPlayerHit').mockImplementation(() => {
      paidBeforeHit = p.reload === 78;
      order.push('hit');
    });
    p.endSlash();
    expect([paidBeforeHit, p.reload, p.doShunpo, order, hits]).toEqual([true, 78, false, ['hit', OG_STATE.POSE], []]);
  });

  it('the player sees the stroke only with canSeeSlash, or a replay that shows slashes, and never in the red freeze', () => {
    const lines = (w: Partial<PlayerWorld>) => ended(flat, (q) => { Object.assign(q.world, w); }).p.events
      .filter((e) => e.type === 'enemyLine');
    const drawn = [{ type: 'enemyLine', points: flat, offset: 30, slashLength: 112 }];
    expect(lines({ playerCanSeeSlash: true, stagePosition: 30 })).toEqual(drawn);
    expect(lines({ playback: true, playbackShowSlash: true, stagePosition: 30 })).toEqual(drawn);
    expect(lines({ playerCanSeeSlash: true, redFreeze: true })).toEqual([]);
    expect(lines({ playback: true })).toEqual([]);
    expect(lines({ playbackShowSlash: true })).toEqual([]);
    expect(lines({})).toEqual([]);
  });

  it('unstubbed, the hit is NPCManager.checkPlayerHit — UNPORTED, loud; the mobs\' packets carry no attacker', () => {
    const { p } = slasher(body2());
    p.slashArray = flat;
    expect(() => {
      p.endSlash();
    }).toThrow('unported: NPCManager.checkPlayerHit');
    expect(new NpcDamage(5, 3).attacker).toBeNull();
  });
});

describe('slice 4c: the body carries what endSlash reads (`initPlayer` / `initAttackStats`)', () => {
  it('the level, slashUsage and the piercing stat come from the body', () => {
    const p = player({ ...body2(), level: 45, slashUsage: 33, piercingDmg: 7 });
    expect([p.level, p.slashUsage, p.STAT_PIERCINGDMG]).toEqual([45, 33, 7]);
  });
});

describe('slice 4c: deductReloadBar — the stroke\'s cost (the same in both builds)', () => {
  const after = (stance: number, reload: number, usage = 25) => {
    const { p } = ender(body1());
    p.stance = stance;
    p.slashUsage = usage;
    p.reload = reload;
    p.deductReloadBar();
    return p.reload;
  };

  it('light half, balanced and reversed whole, heavy and dual × 1.5, each stored to an int', () => {
    expect([LIGHT, BALANCED, REVERSED, HEAVY, DUAL].map((s) => after(s, 150))).toEqual([137, 125, 125, 112, 112]);
  });

  it('a full bar empties first; it never goes below 0; no stance costs nothing', () => {
    expect([after(BALANCED, 192, 48), after(BALANCED, 191, 48), after(BALANCED, 10, 48), after(-1, 150)])
      .toEqual([0, 143, 0, 150]);
  });
});

describe('slice 4c: endDownStab — the same in both builds', () => {
  it('pose, clear the slash, and take the buffered stroke uncopied', () => {
    const { p, order } = ender(body2());
    const next = [{ x: 1, y: 2 }];
    p.hasSlash = true;
    p.slashCommitted = true;
    p.slashArrayBuffer = next;
    p.hasSlashBuffer = true;
    p.endDownStab();
    expect([order, p.slashArray === next, p.hasSlash, p.hasSlashBuffer, p.slashCommitted])
      .toEqual([[OG_STATE.POSE], true, true, false, false]);
    const { p: q, order: o } = ender(body2());
    q.hasSlash = true;
    q.endDownStab();
    expect([o, q.hasSlash, q.hasSlashBuffer, q.slashCommitted]).toEqual([[OG_STATE.POSE], false, false, false]);
  });
});

/*
 * L5-OPP SLICE 5a — THE GROUND STROKE. `update` whole (web `§1t99s0§.as:1179`, Android
 * `MCSPlayer.as:275`), its clip-end switch (web helper `§1t99s0§.as:305`, Android `:298`) with the
 * bands sheathe, ground `_START`, ground `_END` and pose → sheathe; `startAction` (web `:1258`,
 * Android `:1206`) and `doAction` (web `:1936`, Android `:1877`) with IDLE, RUN, WALK, SLASH and
 * POSE. Every other label of the three switches goes through one `unported` site per switch,
 * naming what it was handed; a value with no label is the source's no-op. One difference between
 * the builds: `doAction` POSE ends in a `break` in the web (`:2195`); Android falls through into
 * SKILL_BULLCHARGE. Web ported. Every expected number was worked by hand from the source.
 */
const RUN_CLIP = ['light_run', 'balanced_run', 'heavy_run', 'dual_run', 'reversed_run'];
const STANCE_PREFIX = ['LIGHT', 'BALANCED', 'HEAVY', 'DUAL', 'REVERSED'];
const anim = (key: string): string => {
  const name = (OG_ANIM as Record<string, string>)[key];
  if (name === undefined) throw new Error(`no OG_ANIM.${key}`);
  return name;
};
const stateName = (s: OgState) => Object.entries(OG_STATE).find(([, v]) => v === s)?.[0];

/** A body out of any switch's reach: its init stance, on the ground at BODY_X, idle, no clip, a live target far off. */
function idleBody(b: DuellistBody = body1(), rng: Rng = NO_DRAW, lib: AnimLibrary = anims): MCSPlayer {
  const p = new MCSPlayer(world(false), lib, geometry, rng, b);
  p.setStance(b.stance);
  p.world.peaceful = false;
  p.setPosition(BODY_X, GROUND);
  p.actionState = OG_STATE.IDLE;
  p.changeTarget(foe(700, GROUND, true));
  return p;
}

/** `update` once a frame; the AI (slice 7) spied, the frames it ran on recorded. */
function framed(p: MCSPlayer) {
  let frame = 0;
  const ai: number[] = [];
  vi.spyOn(p, 'AI').mockImplementation(() => {
    ai.push(frame);
  });
  const run = (n: number, each: (f: number) => void = () => undefined) => {
    for (let i = 0; i < n; i += 1) {
      frame += 1;
      p.update();
      each(frame);
    }
  };
  return { ai, run, now: () => frame };
}

describe('slice 5a: update — one frame, in the source\'s order (the same in both builds)', () => {
  it('the AI runs on the first frame and every 12th after (EnemyPlayer.as:52, aiCounterMax 12)', () => {
    const p = idleBody();
    const { ai, run } = framed(p);
    run(49);
    expect(ai).toEqual([1, 13, 25, 37, 49]);
  });

  it('unspied, the REAL AI runs on frame 1 (7a): a level-1 body draws its skip die first', () => {
    expect(() => {
      idleBody().update();
    }).toThrow('drew a random number');
  });

  it('a dead body runs no AI, and its counter does not move (`!dead &&` comes first)', () => {
    const p = idleBody();
    const { ai, run } = framed(p);
    p.dead = true;
    run(3);
    expect([ai, p.aiCounter]).toEqual([[], 0]);
    p.dead = false;
    run(1);
    expect(ai).toEqual([4]);
  });

  it('no AI in adventure mode or under a network replay, yet the trigger was asked (the counter reset to 12)', () => {
    for (const flag of ['adventureMode', 'networkPlayBack'] as const) {
      const p = idleBody();
      const { ai, run } = framed(p);
      p.world[flag] = true;
      run(1);
      expect([flag, ai, p.aiCounter]).toEqual([flag, [], 12]);
    }
  });

  it('the reload refills one a frame, never past maxreload (190 → 191 → 192 → 192)', () => {
    const p = idleBody();
    const { run } = framed(p);
    p.reload = 190;
    const seen: number[] = [];
    run(3, () => seen.push(p.reload));
    expect(seen).toEqual([191, 192, 192]);
  });

  it('gotHitCounter counts down to 0 and stops', () => {
    const p = idleBody();
    const { run } = framed(p);
    p.gotHitCounter = 2;
    const seen: number[] = [];
    run(3, () => seen.push(p.gotHitCounter));
    expect(seen).toEqual([1, 0, 0]);
  });

  it('speech: −1 (the start) stays; from 2 it counts 1, 0, then clears the bubble ONCE and parks at −1', () => {
    const p = idleBody();
    const { run } = framed(p);
    expect(p.speechCounter).toBe(-1);
    run(1);
    expect(p.events.filter((e) => e.type === 'speechClear')).toEqual([]);
    p.speechCounter = 2;
    const seen: number[] = [];
    run(4, () => seen.push(p.speechCounter));
    expect(seen).toEqual([1, 0, -1, -1]);
    expect(p.events.filter((e) => e.type === 'speechClear')).toHaveLength(1);
  });

  it('invisCounter: on reaching 0 it cancels the stealth (a hidden body puffs smoke and shows)', () => {
    const p = idleBody();
    const { run } = framed(p);
    p.visible = false;
    p.invisCounter = 2;
    run(1);
    expect([p.invisCounter, p.visible]).toEqual([1, false]);
    run(1);
    expect([p.invisCounter, p.visible, p.events.filter((e) => e.type === 'smoke')])
      .toEqual([0, true, [{ type: 'smoke', x: BODY_X, y: GROUND }]]);
  });

  it('logsubCounter: on reaching 0 it calls cancelLogSub — UNPORTED (slice 6), loud', () => {
    const p = idleBody();
    const { run } = framed(p);
    p.logsubCounter = 2;
    run(1);
    expect(p.logsubCounter).toBe(1);
    expect(() => {
      run(1);
    }).toThrow('unported: MCSPlayer.cancelLogSub');
  });

  it('a disposed body does nothing; a frozen one does nothing at 0 HP, and runs above it', () => {
    const gone = idleBody();
    const g = framed(gone);
    gone.disposed = true;
    g.run(1);
    expect([g.ai, gone.reload]).toEqual([[], 0]);
    const frozen = idleBody();
    const f = framed(frozen);
    frozen.animFrozen = true;
    frozen.setHP(0);
    f.run(1);
    expect([f.ai, frozen.reload]).toEqual([[], 0]);
    frozen.setHP(1);
    f.run(1);
    expect([f.ai, frozen.reload]).toEqual([[2], 1]);
  });

  it('the clip clock steps first: a clip that finishes this frame is ended before the AI and doAction', () => {
    const p = idleBody();
    const order: string[] = [];
    vi.spyOn(p, 'AI').mockImplementation(() => order.push('AI'));
    vi.spyOn(p, 'doAction').mockImplementation(() => order.push('doAction'));
    vi.spyOn(p, 'clipEnded').mockImplementation((name) => {
      order.push(name);
      return true;
    });
    p.startAnim(anim('BALANCEDSLASH_END'));
    p.frameCounter = 2;
    p.update();
    expect(order).toEqual(['balanced_horslash_partc', 'AI', 'doAction']);
  });
});

describe('slice 5a: EnemyPlayer.update — the target, before MCSPlayer.update (the same in both builds)', () => {
  const dead = (): NpcTarget => ({ ...foe(300, GROUND, true), isDead: () => true });

  it('a live target is kept; a null or dead one is re-aimed at the nearest enemy, from the int map x, isEnemy', () => {
    const asked: Array<[number, boolean]> = [];
    const next = foe(620, GROUND, false);
    for (const t of [foe(500, GROUND, true), null, dead()]) {
      const p = idleBody();
      framed(p);
      p.target = t;
      p.setPosition(400.7, GROUND);
      p.world.nearestEnemy = (x, isEnemy) => {
        asked.push([x, isEnemy]);
        return next;
      };
      p.update();
      expect(p.target).toBe(t !== null && !t.isDead() ? t : next);
    }
    expect(asked).toEqual([[400, true], [400, true]]);
  });

  it('no enemy left: IDLE before the frame, so a POSE on an _END clip never reaches the null read', () => {
    const p = idleBody();
    framed(p);
    p.target = null;
    p.actionState = OG_STATE.POSE;
    p.startAnim(anim('HEAVYSLASH_END'));
    p.update();
    expect([p.actionState, p.animation, p.target]).toEqual([OG_STATE.IDLE, 'idle', null]);
  });

  it('a dead or frozen body does not re-aim', () => {
    for (const setUp of [(q: MCSPlayer) => { q.dead = true; }, (q: MCSPlayer) => { q.animFrozen = true; }]) {
      const p = idleBody();
      framed(p);
      p.target = null;
      const near = vi.fn(() => foe(620, GROUND, false));
      p.world.nearestEnemy = near;
      setUp(p);
      p.update();
      expect([near.mock.calls.length, p.target]).toEqual([0, null]);
    }
  });
});

describe('slice 5a: the clip-end switch — the four ground-stroke bands (the same in both builds)', () => {
  const ended = (name: string, setUp: (p: MCSPlayer) => void = () => undefined) => {
    const p = idleBody();
    p.actionState = OG_STATE.POSE;
    setUp(p);
    const handled = p.clipEnded(name);
    return { p, handled };
  };

  it('each of the 13 ground _START clips opens its _MID', () => {
    for (const P of STANCE_PREFIX) {
      const kinds = P === 'REVERSED' ? [''] : ['', 'DOWN', 'UP'];
      for (const k of kinds) {
        const { p, handled } = ended(anim(`${P}SLASH${k}_START`));
        expect([handled, p.animation]).toEqual([true, anim(`${P}SLASH${k}_MID`)]);
      }
    }
  });

  it('each of the 13 ground _END clips opens its _POSE', () => {
    for (const P of STANCE_PREFIX) {
      const kinds = P === 'REVERSED' ? [''] : ['', 'DOWN', 'UP'];
      for (const k of kinds) {
        const { p, handled } = ended(anim(`${P}SLASH${k}_END`));
        expect([handled, p.animation]).toEqual([true, anim(`${P}SLASH${k}_POSE`)]);
      }
    }
  });

  /** The 23 labels of the pose group: 13 _POSE, 5 JUMPSLASH_LAND, 5 FALLSLASH_END. */
  const POSES = STANCE_PREFIX.flatMap((P) => [
    ...(P === 'REVERSED' ? [''] : ['', 'DOWN', 'UP']).map((k) => `${P}SLASH${k}_POSE`),
    `${P}JUMPSLASH_LAND`, `${P}FALLSLASH_END`,
  ]);

  it('each of the 23 pose-group clips sheathes the sword, the state left as it was', () => {
    expect(POSES).toHaveLength(23);
    for (const key of POSES) {
      const { p, handled } = ended(anim(key));
      expect([key, handled, p.animation, p.actionState]).toEqual([key, true, 'sheathesword', OG_STATE.POSE]);
    }
  });

  it('under the kill-cam freeze the pose group asks for REDFREEZE (a later slice: loud); in REDFREEZE, nothing', () => {
    expect(() => ended(anim('HEAVYSLASH_POSE'), (p) => { p.world.redFreeze = true; }))
      .toThrow('unported: MCSPlayer.startAction (REDFREEZE)');
    const { p, handled } = ended(anim('HEAVYSLASH_POSE'), (q) => {
      q.world.redFreeze = true;
      q.actionState = OG_STATE.REDFREEZE;
    });
    expect([handled, p.animation, p.actionState]).toEqual([true, '', OG_STATE.REDFREEZE]);
    const calm = ended(anim('HEAVYSLASH_POSE'), (q) => { q.actionState = OG_STATE.REDFREEZE; });
    expect(calm.p.animation).toBe('');
  });

  it('the sheathe (either clip) ends in IDLE, unless the freeze; sheathetoidle always does', () => {
    for (const key of ['SHEATHESWORD', 'SHEATHESWORDCHIBURI', 'SHEATHETOIDLE']) {
      const { p, handled } = ended(anim(key));
      expect([key, handled, p.actionState, p.animation]).toEqual([key, true, OG_STATE.IDLE, 'idle']);
    }
    for (const [key, state] of [['SHEATHESWORD', OG_STATE.POSE], ['SHEATHETOIDLE', OG_STATE.IDLE]] as const) {
      const { p } = ended(anim(key), (q) => { q.world.redFreeze = true; });
      expect([key, p.actionState]).toEqual([key, state]);
    }
  });

  it('every other of the 146 labels is UNPORTED and names its clip; a clip with no label is `default: return false`', () => {
    const ported = new Set([
      ...['SHEATHESWORDCHIBURI', 'SHEATHESWORD', 'SHEATHETOIDLE', ...POSES].map(anim),
      ...STANCE_PREFIX.flatMap((P) => (P === 'REVERSED' ? [''] : ['', 'DOWN', 'UP'])
        .flatMap((k) => [anim(`${P}SLASH${k}_START`), anim(`${P}SLASH${k}_END`)])),
      // 5b: the jump _START, fall _START and downstab bands.
      ...STANCE_PREFIX.flatMap((P) => [anim(`${P}JUMPSLASH_START`), anim(`${P}FALLSLASH_START`)]),
      anim('DOWNSTAB'), anim('DOWNSTAB_UP'),
      // 6a: the flinch.
      anim('FLINCH_WEAPON'), anim('FLINCH'),
      // 6b: the fall and the getups.
      ...['FLY_END', 'KNEEGROIN_VICTIM', 'BACKTHROW_VICTIM', 'GETUP_FRONT', 'GOTLAUNCHED_PEAK', 'GOTLAUNCHEDDOWNED',
        'GOTLAUNCHEDDOWNEDEND', 'DOWNEDUP', 'DOWNEDUP2', 'FLIPUP'].map(anim),
      // 6c: the death's ten.
      ...['DEFEATED1', 'ENEMYDEATH', 'DEATH_FORWARD', 'DEFEATED2', 'ENEMYDEATHNOHEAD', 'ENEMYDEATHNOHAND', 'DEATHDOWNED',
        'DEATHINHALF', 'SEPPUKU_END', 'SEPPUKU_NOHEAD'].map(anim),
    ]);
    const others = OG_CLIP_END_LABELS.filter((n) => !ported.has(n));
    expect([ported.size, others.length]).toEqual([86, 60]);
    for (const name of others) {
      expect(() => idleBody().clipEnded(name)).toThrow(`unported: MCSPlayer.update clip end (${name})`);
    }
    expect([idleBody().clipEnded('idle'), idleBody().clipEnded('balanced_run')]).toEqual([false, false]);
  });
});

describe('slice 5a: startAction — the wrapper and IDLE, RUN, WALK, SLASH, POSE (the same in both builds)', () => {
  const started = (state: OgState, setUp: (p: MCSPlayer) => void = () => undefined) => {
    const p = idleBody();
    setUp(p);
    p.startAction(state);
    return p;
  };

  it('records the state; a change with a charging FX up removes it — UNPORTED (no ported path writes it)', () => {
    const fx = {};
    const same = started(OG_STATE.IDLE, (p) => { p.chargingFx = fx; });
    expect([same.actionState, same.chargingFx]).toEqual([OG_STATE.IDLE, fx]);
    expect(() => started(OG_STATE.WALK, (p) => { p.chargingFx = fx; })).toThrow('unported: Projectile.removeProjectile');
    expect(started(OG_STATE.WALK).chargingFx).toBeNull();
  });

  it('IDLE: the sheathed idle, then checkNextSlash', () => {
    const p = idleBody();
    const next = vi.spyOn(p, 'checkNextSlash');
    p.startAction(OG_STATE.IDLE);
    expect([p.animation, next.mock.calls.length]).toEqual(['idle', 1]);
  });

  it('IDLE: tired at or under a quarter of max HP (25 of 100; 26 is not), never under the freeze or in adventure mode', () => {
    const at = (hp: number, setUp: (p: MCSPlayer) => void = () => undefined) => started(OG_STATE.IDLE, (p) => {
      p.maxhp = 100;
      p.setHP(hp);
      setUp(p);
    }).animation;
    expect([at(25), at(26), at(25, (p) => { p.world.redFreeze = true; }), at(25, (p) => { p.world.adventureMode = true; })])
      .toEqual(['tired', 'idle', 'idle', 'idle']);
  });

  it('IDLE takes the buffered stroke: checkNextSlash → initSlash (a stroke 150 px off RUNs)', () => {
    const p = started(OG_STATE.IDLE, (q) => {
      q.slashArrayBuffer = [{ x: 250, y: 318 }, { x: 150, y: 318 }];
      q.hasSlashBuffer = true;
    });
    expect([p.actionState, p.destX, p.hasSlash, p.hasSlashBuffer]).toEqual([OG_STATE.RUN, 250, true, false]);
  });

  it('RUN: with a slash, the stance\'s run; without, sheathed; no stance keeps the clip it had', () => {
    const runs = [LIGHT, BALANCED, HEAVY, DUAL, REVERSED].map((st) => started(OG_STATE.RUN, (p) => {
      p.stance = st;
      p.hasSlash = true;
    }).animation);
    expect(runs).toEqual(RUN_CLIP);
    expect(started(OG_STATE.RUN).animation).toBe('run_sheathed');
    expect(started(OG_STATE.RUN, (p) => {
      p.stance = -1;
      p.hasSlash = true;
    }).animation).toBe('');
  });

  it('WALK: the sheathed walk', () => {
    expect([started(OG_STATE.WALK).animation, started(OG_STATE.WALK, (p) => { p.hasSlash = true; }).animation])
      .toEqual(['walk', 'walk']);
  });

  it('RUN and WALK above the ground FALL (5b), the fall clip over their own; on it, not', () => {
    for (const s of [OG_STATE.RUN, OG_STATE.WALK]) {
      const up = started(s, (p) => { p.y = GROUND - 1; });
      expect([up.actionState, up.animation]).toEqual([OG_STATE.FALL, 'balanced_fallslash_partb']);
      expect(started(s, (p) => { p.y = GROUND; }).actionState).toBe(s);
    }
  });

  it('SLASH: startSlash', () => {
    const p = idleBody();
    const slash = vi.spyOn(p, 'startSlash').mockImplementation(() => undefined);
    p.startAction(OG_STATE.SLASH);
    expect([p.actionState, slash.mock.calls.length]).toEqual([OG_STATE.SLASH, 1]);
  });

  it('POSE: the stroke\'s end clip per stance and slash type; a downstab sheathes; then checkNextSlash', () => {
    const expected = (P: string, t: number): string => {
      if (t === T.downstab) return 'SHEATHESWORD';
      if (t === T.jump || t === T.drop) return `${P}FALLSLASH_END`;
      if (t === T.up) return `${P}JUMPSLASH_LAND`;
      if (t === T.horDown && P !== 'REVERSED') return `${P}SLASHDOWN_END`;
      if (t === T.horUp && P !== 'REVERSED') return `${P}SLASHUP_END`;
      return `${P}SLASH_END`;
    };
    const types = [T.hor, T.jump, T.drop, T.up, T.air, T.downstab, T.horDown, T.horUp];
    [LIGHT, BALANCED, HEAVY, DUAL, REVERSED].forEach((st, i) => {
      const P = STANCE_PREFIX[i] ?? '';
      for (const t of types) {
        const p = idleBody();
        const next = vi.spyOn(p, 'checkNextSlash');
        p.stance = st;
        p.slashType = t;
        p.startAction(OG_STATE.POSE);
        expect([P, t, p.animation, next.mock.calls.length]).toEqual([P, t, anim(expected(P, t)), 1]);
      }
    });
    const none = (t: number) => started(OG_STATE.POSE, (p) => {
      p.stance = -1;
      p.slashType = t;
    }).animation;
    expect([none(T.hor), none(T.downstab)]).toEqual(['', 'sheathesword']);
  });

  it('every other of the 35 labels is UNPORTED and names its state; a state with no label is only recorded', () => {
    const ported: OgState[] = [
      OG_STATE.IDLE, OG_STATE.RUN, OG_STATE.WALK, OG_STATE.FALL, OG_STATE.SLASH, OG_STATE.POSE,
      OG_STATE.GOTLAUNCHED, OG_STATE.KNOCKDOWNED, OG_STATE.DOWNED, // 6b
    ];
    const others = OG_START_ACTION_LABELS.filter((s) => !ported.includes(s));
    expect(others).toHaveLength(26);
    for (const s of others) {
      expect(() => started(s)).toThrow(`unported: MCSPlayer.startAction (${stateName(s)})`);
    }
    const unlabeled = Object.values(OG_STATE).filter((s) => !OG_START_ACTION_LABELS.includes(s));
    expect(unlabeled.map(stateName)).toContain('FLINCH');
    for (const s of unlabeled) {
      const p = started(s);
      expect([stateName(s), p.actionState, p.animation]).toEqual([stateName(s), s, '']);
    }
  });
});

describe('slice 5a: doAction — IDLE, RUN, WALK, SLASH, POSE (WEB: POSE ends in a break)', () => {
  const acting = (state: OgState, setUp: (p: MCSPlayer) => void = () => undefined) => {
    const p = idleBody(body2());
    p.actionState = state;
    const asked: OgState[] = [];
    setUp(p);
    vi.spyOn(p, 'startAction').mockImplementation((s) => {
      asked.push(s);
    });
    p.doAction();
    return { p, asked };
  };

  it('IDLE does nothing', () => {
    const { p, asked } = acting(OG_STATE.IDLE, (q) => { q.destX = 600; });
    expect([p.posX, asked]).toEqual([BODY_X, []]);
  });

  it('RUN: 12 px a frame toward destX; on arrival velX 0, then SLASH with a slash, else IDLE', () => {
    const step = acting(OG_STATE.RUN, (q) => { q.destX = 500; });
    expect([step.p.posX, step.p.velX, step.asked]).toEqual([412, 12, []]);
    const home = acting(OG_STATE.RUN, (q) => { q.destX = 412; q.velX = 9; });
    expect([home.p.posX, home.p.velX, home.asked]).toEqual([412, 0, [OG_STATE.IDLE]]);
    const strike = acting(OG_STATE.RUN, (q) => { q.destX = 390; q.hasSlash = true; });
    expect([strike.p.posX, strike.asked]).toEqual([390, [OG_STATE.SLASH]]);
  });

  it('WALK: the body\'s walkSpeed, 4 px a frame; on arrival the same choice', () => {
    const step = acting(OG_STATE.WALK, (q) => { q.destX = 300; });
    expect([step.p.walkSpeed, step.p.posX, step.p.velX, step.asked]).toEqual([4, 396, -4, []]);
    const home = acting(OG_STATE.WALK, (q) => { q.destX = 403; q.hasSlash = true; });
    expect([home.p.posX, home.p.velX, home.asked]).toEqual([403, 0, [OG_STATE.SLASH]]);
  });

  it('SLASH: doSlash', () => {
    const p = idleBody();
    p.actionState = OG_STATE.SLASH;
    const slash = vi.spyOn(p, 'doSlash').mockImplementation(() => undefined);
    p.doAction();
    expect(slash.mock.calls.length).toBe(1);
  });

  it('POSE on each of the 13 ground _END clips hands the target the weapon and a packet (web: with the attacker)', () => {
    for (const P of STANCE_PREFIX) {
      for (const k of P === 'REVERSED' ? [''] : ['', 'DOWN', 'UP']) {
        const hits: Array<[unknown, NpcDamage]> = [];
        const t = foe(440, GROUND, true);
        t.checkHitObject = (thing, damage) => {
          hits.push([thing, damage]);
          return false;
        };
        const { p } = acting(OG_STATE.POSE, (q) => {
          q.changeTarget(t);
          q.startAnim(anim(`${P}SLASH${k}_END`));
          q.slashDamage = 86;
          q.STAT_PIERCINGDMG = 7;
        });
        expect(hits.map(([thing]) => thing)).toEqual([{ kind: 'part', part: OG_PART.weapon, owner: p }]);
        expect(packet(hits[0]?.[1])).toEqual([86, 45, OG_LAUNCH.LAUNCH_NONE, HEAVY, 7, p]);
      }
    }
  });

  it('POSE on any other clip hits nothing; with no target on an _END clip it is the source\'s null read', () => {
    const t = foe(440, GROUND, true);
    const hit = vi.fn(() => false);
    t.checkHitObject = hit;
    for (const key of ['HEAVYSLASH_POSE', 'SHEATHESWORD', 'HEAVYFALLSLASH_END', 'HEAVYSLASH_MID']) {
      acting(OG_STATE.POSE, (q) => {
        q.changeTarget(t);
        q.startAnim(anim(key));
      });
    }
    expect(hit).not.toHaveBeenCalled();
    expect(() => acting(OG_STATE.POSE, (q) => {
      q.target = null;
      q.startAnim(anim('HEAVYSLASH_END'));
    })).toThrow(TypeError);
  });

  it('WEB: POSE does not fall into SKILL_BULLCHARGE (Android does; its body runs on bullcharge_run)', () => {
    const { p } = acting(OG_STATE.POSE, (q) => {
      q.startAnim(anim('BULLCHARGE_RUN'));
      q.destX = 600;
    });
    expect([p.posX, p.velX]).toEqual([BODY_X, 0]);
  });

  it('every other of the 27 labels is UNPORTED and names its state; a state with no label does nothing', () => {
    const ported: OgState[] = [
      OG_STATE.IDLE, OG_STATE.RUN, OG_STATE.WALK, OG_STATE.FALL, OG_STATE.SLASH, OG_STATE.POSE,
      OG_STATE.GOTLAUNCHED, OG_STATE.FLY, OG_STATE.STUN, OG_STATE.DOWNED, // 6b
      OG_STATE.DYING, // 6c
    ];
    const others = OG_DO_ACTION_LABELS.filter((s) => !ported.includes(s));
    expect(others).toHaveLength(16);
    for (const s of others) {
      expect(() => acting(s)).toThrow(`unported: MCSPlayer.doAction (${stateName(s)})`);
    }
    for (const s of Object.values(OG_STATE).filter((v) => !OG_DO_ACTION_LABELS.includes(v))) {
      const { p, asked } = acting(s, (q) => { q.destX = 600; });
      expect([stateName(s), p.posX, asked]).toEqual([stateName(s), BODY_X, []]);
    }
  });
});

describe('slice 5a: the body carries what the state machine reads (`EnemyPlayer`\'s constructor, `initPlayer`)', () => {
  it('aiCounterMax 12, the body\'s walkSpeed 4, and the counters idle: speech −1, stealth and log 0, no FX', () => {
    const p = player(body2());
    expect([p.aiCounterMax, p.walkSpeed, p.speechCounter, p.invisCounter, p.logsubCounter, p.chargingFx])
      .toEqual([12, 4, -1, 0, 0, null]);
  });
});

describe('slice 5a: the three switches\' labels are the source\'s, in its order (Android names)', () => {
  const AS = new URL('../reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as', import.meta.url);
  const hasSource = existsSync(AS);
  /** The `case` labels at one switch's own indentation, between two source lines. */
  const labels = (from: number, to: number, indent: number) => readFileSync(AS, 'utf8').split(/\r?\n/)
    .slice(from - 1, to)
    .flatMap((l) => new RegExp(`^ {${indent}}case ([A-Z_0-9]+):$`).exec(l)?.[1] ?? []);

  it('names why it would skip: the decompiled source is gitignored (study-only)', () => {
    expect(hasSource || !existsSync(new URL('../reference/decompiled', import.meta.url))).toBe(true);
  });

  it.skipIf(!hasSource)('the clip-end switch: 146 labels (MCSPlayer.as:298-1147)', () => {
    expect(OG_CLIP_END_LABELS).toEqual(labels(298, 1147, 15).map(anim));
    expect(OG_CLIP_END_LABELS).toHaveLength(146);
  });

  it.skipIf(!hasSource)('startAction: 35 labels; doAction: 27 (MCSPlayer.as:1227-1874, 1885-2234)', () => {
    const st = (n: string): OgState => {
      const v = (OG_STATE as Record<string, OgState>)[n.replace(/_STATE$/, '')];
      if (v === undefined) throw new Error(`no OG_STATE for ${n}`);
      return v;
    };
    expect(OG_START_ACTION_LABELS).toEqual(labels(1227, 1874, 12).map(st));
    expect(OG_DO_ACTION_LABELS).toEqual(labels(1885, 2234, 12).map(st));
    expect([OG_START_ACTION_LABELS.length, OG_DO_ACTION_LABELS.length]).toEqual([35, 27]);
  });
});

/*
 * THE FIRST END-TO-END STROKE (ERRATUM 12 item 3). slashTarget's stroke, then `update` once a
 * frame with the source's clip lengths (`OG_ANIM_CLIPS`), `checkPlayerHit` (slice 8) and the AI
 * (slice 7) spied. Worked from the source by hand, frame by frame:
 *   fixture 1 (balanced, speed 40): 400 → 498, arriving on frame 3 before `parta` (12) ends;
 *     `endSlash` pays the reload (2 − 48 → 0), hits, POSEs: `partc` (4) frames 3–6, hitting the
 *     target on 4, 5, 6; `partd` (11) 7–17; `sheathesword` (31) 18–48; IDLE on 49.
 *   fixture 2 (heavy, speed 30): 400 → 482 on frame 3; `partc` (7) 3–9, hits 4–9; `partd` (11)
 *     10–20; `sheathesword` 21–51; IDLE on 52.
 *   Reload: +1 a frame after doAction; 1, 2, then 0 + 1 on frame 3, so k − 2 on frame k ≥ 3.
 *   The AI: frames 1, 13, 25, 37, 49 (12 a cycle, the first on frame 1).
 */
describe.each([
  ['fixture 1', body1, 'balanced', 498, [3, 7, 18, 49], 1, BALANCED, 0],
  ['fixture 2', body2, 'heavy', 482, [3, 10, 21, 52], 45, HEAVY, 86],
])('slice 5a, %s: slashTarget\'s stroke through the real update, frame by frame', (_n, body, clip, endX, at, level, stance, damage) => {
  it('state, clip, x, y, facing and reload at every frame, the hit on the landing, the target hit on each _END frame', () => {
    const p = idleBody(body(), () => 0.5, new OgAnimLibrary());
    const { ai, run, now } = framed(p);
    const t = foe(440, GROUND, true);
    const weapon: number[] = [];
    t.checkHitObject = () => {
      weapon.push(now());
      return false;
    };
    p.changeTarget(t);
    const landed: number[] = [];
    const hit = vi.spyOn(p, 'checkPlayerHit').mockImplementation(() => {
      landed.push(now());
    });
    p.slashTarget();
    const [poseAt, partdAt, sheatheAt, idleAt] = at as [number, number, number, number];
    const trace: string[] = [];
    const want: string[] = [];
    run(idleAt + 2, (f) => {
      trace.push([f, stateName(p.actionState), p.animation, p.posX, p.y, p.facingRight, p.reload].join(' '));
      const [state, c] = f < poseAt ? ['SLASH', `${clip}_horslash_parta`]
        : f < partdAt ? ['POSE', `${clip}_horslash_partc`]
          : f < sheatheAt ? ['POSE', `${clip}_horslash_partd`]
            : f < idleAt ? ['POSE', 'sheathesword'] : ['IDLE', 'idle'];
      const x = f === 1 ? 400 + (stance === BALANCED ? 40 : 30) : f === 2 ? 400 + (stance === BALANCED ? 80 : 60) : endX;
      want.push([f, state, c, x, GROUND, true, f < 3 ? f : f - 2].join(' '));
    });
    expect(trace).toEqual(want);
    expect(landed).toEqual([poseAt]);
    expect(weapon).toEqual(Array.from({ length: partdAt - poseAt - 1 }, (_, i) => poseAt + 1 + i));
    expect(ai).toEqual([1, 13, 25, 37, 49]);
    expect(packet(hit.mock.calls[0]?.[2])).toEqual([damage, level, 0, stance, 0, p]);
    expect([p.slashCommitted, p.hasSlash, p.velX]).toEqual([false, false, 5]);
  });
});

/*
 * L5-OPP SLICE 5b — THE AIR AND THE DOWNSTAB. `startAction` FALL (web `§1t99s0§.as:1332`, Android
 * `MCSPlayer.as:1280`), `doAction` FALL (web `:1977`, Android `:1917`) and the clip-end bands jump
 * `_START` (web `:375`, Android `:356`), fall `_START` (web `:430`, Android `:411`) and downstab (web
 * `:516`, Android `:497`). The web adds three lines, all ported: the attacker on the landing's
 * packet (`:1991`) and on the downstab's (`:520`), and the landing's reset of its juggle counter
 * (`§1t4438s0§`, `:2001`). Two source quirks, the same in both builds, ported as they are: a light
 * JUMP stroke's start falls straight into light's fall MID (`:359`, web `:378`), and light's FALL
 * plays BALANCED's fall MID for every type but UP (`:1289`, web `:1341`).
 */
describe('slice 5b: the clip-end switch — the jump, fall and downstab bands', () => {
  const ended = (name: string, setUp: (p: MCSPlayer) => void = () => undefined, b: DuellistBody = body1(), rng: Rng = NO_DRAW) => {
    const p = idleBody(b, rng);
    p.actionState = OG_STATE.SLASH;
    p.slashArray = [{ x: 420, y: 211 }, { x: 440, y: 150 }];
    setUp(p);
    const handled = p.clipEnded(name);
    return { p, handled };
  };
  const FALL_FROM_JUMP = ['LIGHTFALLSLASH_MID', 'BALANCEDFALLSLASH_START', 'HEAVYFALLSLASH_START', 'DUALFALLSLASH_START', 'REVERSEDFALLSLASH_START'];

  it('each JUMPSLASH_START: a JUMP stroke falls, the body 90 px under the stroke\'s FIRST point (211 → 301); an UP stroke rises, y kept', () => {
    STANCE_PREFIX.forEach((P, i) => {
      const jump = ended(anim(`${P}JUMPSLASH_START`), (p) => { p.slashType = T.jump; });
      expect([P, jump.handled, jump.p.animation, jump.p.y]).toEqual([P, true, anim(FALL_FROM_JUMP[i] ?? ''), 301]);
      const up = ended(anim(`${P}JUMPSLASH_START`), (p) => { p.slashType = T.up; });
      expect([P, up.handled, up.p.animation, up.p.y]).toEqual([P, true, anim(`${P}JUMPSLASH_RISE`), GROUND]);
    });
  });

  it('SOURCE QUIRK (both builds): light\'s JUMP skips its fall slash\'s START, straight to light_fallslash_partb (MCSPlayer.as:359)', () => {
    const { p } = ended(anim('LIGHTJUMPSLASH_START'), (q) => { q.slashType = T.jump; });
    expect(p.animation).toBe('light_fallslash_partb');
  });

  it('each JUMPSLASH_START on any other slash type: handled, and nothing moves', () => {
    for (const P of STANCE_PREFIX) {
      for (const t of [T.hor, T.drop, T.air, T.downstab, T.horDown, T.horUp]) {
        const { p, handled } = ended(anim(`${P}JUMPSLASH_START`), (q) => { q.slashType = t; });
        expect([P, t, handled, p.animation, p.y]).toEqual([P, t, true, '', GROUND]);
      }
    }
  });

  it('each FALLSLASH_START opens its MID', () => {
    for (const P of STANCE_PREFIX) {
      const { p, handled } = ended(anim(`${P}FALLSLASH_START`));
      expect([P, handled, p.animation]).toEqual([P, true, anim(`${P}FALLSLASH_MID`)]);
    }
  });

  it('DOWNSTAB: the target is handed the weapon and getDamage() × 2 (web: with the attacker), THEN the reload is paid, then DOWNSTAB_UP', () => {
    const t = foe(440, GROUND, true);
    const seen: Array<[unknown, NpcDamage, number]> = [];
    const { p, handled } = ended(anim('DOWNSTAB'), (q) => {
      q.setStance(DUAL);
      q.changeTarget(t);
      q.STAT_PIERCINGDMG = 7;
      q.reload = 100;
      t.checkHitObject = (thing, damage) => {
        seen.push([thing, damage, q.reload]);
        return false;
      };
    }, body2(), () => 0.5);
    // dual: int(int(57 + 0.5 × 10) × 1.4) = int(86.8) = 86, × 2 = 172; Damage(172, 45): no launch, no stance.
    expect(seen.map(([thing, , reload]) => [thing, reload])).toEqual([[{ kind: 'part', part: OG_PART.weapon, owner: p }, 100]]);
    expect(packet(seen[0]?.[1])).toEqual([172, 45, OG_LAUNCH.LAUNCH_NONE, -1, 7, p]);
    // dual pays slashUsage × 1.5: 100 − 72 = 28.
    expect([handled, p.reload, p.animation, p.actionState]).toEqual([true, 28, 'downstab_up', OG_STATE.SLASH]);
  });

  it('DOWNSTAB on a full bar: the crit is rolled BEFORE the bar is paid (int(86 × 1.3) = 111, × 2 = 222), and the bar empties', () => {
    const hits: NpcDamage[] = [];
    const t = foe(440, GROUND, true);
    t.checkHitObject = (_thing, damage) => {
      hits.push(damage);
      return false;
    };
    const { p } = ended(anim('DOWNSTAB'), (q) => {
      q.setStance(DUAL);
      q.changeTarget(t);
      q.reload = q.maxreload;
    }, body2(), () => 0.5);
    expect([hits.map((d) => d.damage), p.reload]).toEqual([[222], 0]);
  });

  it('DOWNSTAB under the kill-cam freeze: the hit and the reload, then REDFREEZE (a later slice: loud); in REDFREEZE, nothing at all', () => {
    const hit = vi.fn(() => false);
    const t = foe(440, GROUND, true);
    t.checkHitObject = hit;
    expect(() => ended(anim('DOWNSTAB'), (q) => {
      q.changeTarget(t);
      q.world.redFreeze = true;
    }, body2(), () => 0.5)).toThrow('unported: MCSPlayer.startAction (REDFREEZE)');
    expect(hit).toHaveBeenCalledTimes(1);
    const { p, handled } = ended(anim('DOWNSTAB'), (q) => {
      q.changeTarget(t);
      q.actionState = OG_STATE.REDFREEZE;
      q.reload = 100;
    });
    expect([handled, hit.mock.calls.length, p.reload, p.animation]).toEqual([true, 1, 100, '']);
  });

  it('DOWNSTAB with no target is the source\'s null read', () => {
    expect(() => ended(anim('DOWNSTAB'), (q) => { q.target = null; }, body2(), () => 0.5)).toThrow(TypeError);
  });

  it('DOWNSTAB_UP: endDownStab (POSE, the sword sheathed)', () => {
    const { p, handled } = ended(anim('DOWNSTAB_UP'), (q) => {
      q.slashType = T.downstab;
      q.slashCommitted = true;
    });
    expect([handled, p.actionState, p.animation, p.slashCommitted]).toEqual([true, OG_STATE.POSE, 'sheathesword', false]);
  });
});

describe('slice 5b: startAction FALL — the clip per stance and slash type (the same in both builds)', () => {
  const falling = (stance: number, t: number) => {
    const p = idleBody();
    p.stance = stance;
    p.slashType = t;
    p.startAction(OG_STATE.FALL);
    return p;
  };
  const TYPES = [T.hor, T.jump, T.drop, T.up, T.air, T.downstab, T.horDown, T.horUp];

  it('an UP stroke plays the stance\'s jump slash (partc); every other type its fall slash\'s MID; no stance keeps the clip', () => {
    [BALANCED, HEAVY, DUAL, REVERSED].forEach((st) => {
      const P = STANCE_PREFIX[st] ?? '';
      for (const t of TYPES) {
        const p = falling(st, t);
        expect([P, t, p.actionState, p.animation]).toEqual([P, t, OG_STATE.FALL, anim(t === T.up ? `${P}JUMPSLASH_SLASH` : `${P}FALLSLASH_MID`)]);
      }
    });
    expect([falling(-1, T.up).animation, falling(-1, T.hor).animation]).toEqual(['', '']);
  });

  it('SOURCE QUIRK (both builds): light plays BALANCED\'s fall MID for every type but UP (MCSPlayer.as:1289)', () => {
    for (const t of TYPES) {
      expect([t, falling(LIGHT, t).animation]).toEqual([t, t === T.up ? 'light_jumpslash_partc' : 'balanced_fallslash_partb']);
    }
  });
});

describe('slice 5b: doAction FALL — gravity, the light re-slash, the landing (WEB: the attacker and the juggle reset)', () => {
  const inAir = (setUp: (p: MCSPlayer) => void, b: DuellistBody = body2()) => {
    const p = idleBody(b);
    p.actionState = OG_STATE.FALL;
    p.slashDamage = 86;
    p.STAT_PIERCINGDMG = 7;
    const order: string[] = [];
    const hits: Array<[unknown, NpcDamage]> = [];
    const t = foe(440, GROUND, true);
    t.checkHitObject = (thing, damage) => {
      order.push('hit');
      hits.push([thing, damage]);
      return false;
    };
    p.changeTarget(t);
    setUp(p);
    vi.spyOn(p, 'startAction').mockImplementation((s) => {
      order.push(stateName(s) ?? '');
    });
    p.doAction();
    return { p, order, hits };
  };

  it('above the ground: velY += 3, y += velY, then the body moves velX (the stage-clamped movePlayer)', () => {
    const { p, order } = inAir((q) => {
      q.y = 200;
      q.velY = 4;
      q.velX = 5;
    });
    expect([p.velY, p.y, p.posX, order]).toEqual([7, 207, 405, []]);
    const edge = inAir((q) => {
      q.setPosition(798, 200);
      q.velX = 5;
    });
    expect(edge.p.posX).toBe(800);
  });

  it('lands at the ground or under it (355 + 3 lands, 354 + 3 does not): y = ground, POSE, THEN the hit', () => {
    const at = (y: number) => inAir((q) => {
      q.y = y;
      q.velY = 0;
    });
    const landed = at(355);
    expect([landed.p.y, landed.p.velY, landed.order]).toEqual([GROUND, 3, ['POSE', 'hit']]);
    const deep = at(400);
    expect([deep.p.y, deep.order]).toEqual([GROUND, ['POSE', 'hit']]);
    const above = at(354);
    expect([above.p.y, above.order]).toEqual([357, []]);
  });

  it('the landing hands the target the weapon and slashDamage (web: with the attacker), and WEB resets the juggle count', () => {
    const { p, hits } = inAir((q) => {
      q.y = 355;
      q.juggleCount = 4;
    });
    expect(hits.map(([thing]) => thing)).toEqual([{ kind: 'part', part: OG_PART.weapon, owner: p }]);
    expect(packet(hits[0]?.[1])).toEqual([86, 45, OG_LAUNCH.LAUNCH_NONE, HEAVY, 7, p]);
    expect(p.juggleCount).toBe(0);
    expect(inAir((q) => { q.y = 100; q.juggleCount = 4; }).p.juggleCount).toBe(4);
  });

  it('light, a slash waiting within 50 px of its first point AFTER this frame\'s move: SLASH, even on the landing (49 does, 50 does not)', () => {
    const light = (firstX: number, setUp: (p: MCSPlayer) => void = () => undefined) => inAir((q) => {
      q.stance = LIGHT;
      q.hasSlash = true;
      q.slashArray = [{ x: firstX, y: 200 }];
      q.velX = 5;
      q.y = 355;
      setUp(q);
    });
    // posX 400 + 5 = 405: |454 − 405| = 49 slashes; |455 − 405| = 50 lands.
    expect(light(454).order).toEqual(['SLASH']);
    expect(light(455).order).toEqual(['POSE', 'hit']);
    expect(light(356).order).toEqual(['SLASH']);
    expect(light(355).order).toEqual(['POSE', 'hit']);
    expect(light(454, (q) => { q.hasSlash = false; }).order).toEqual(['POSE', 'hit']);
    expect(light(454, (q) => { q.stance = BALANCED; }).order).toEqual(['POSE', 'hit']);
  });

  it('a landing with no target is the source\'s null read', () => {
    expect(() => inAir((q) => {
      q.y = 355;
      q.target = null;
    })).toThrow(TypeError);
  });

  it('the juggle count (web only, `§1t4438s0§`) starts at 0', () => {
    expect(player(body2()).juggleCount).toBe(0);
  });
});

/*
 * TWO END-TO-END AIR STROKES, through the real `update` with the source's clip lengths, the AI and
 * `checkPlayerHit` spied. Worked from the source by hand, frame by frame.
 *
 * (1) THE JUMP STROKE — fixture 2 (heavy, reach 112, speed 30) at x 400; slashTarget on a target at
 *   map x 440, clip y 250, facing right. Stroke (402,210) … (482,202), 5 points; 358 − 210 = 148 > 100:
 *   JUMP, standing (|402 − 400| < 50). startSlash: heavy_jumpslash_parta (11), destX 482, destY 202,
 *   dist √6788 = 82.39, time 2.746: velX 29, velY int(−2.91) = −2; slashDamage 86.
 *   1–10   SLASH parta, still (a jump slash's START does not travel).
 *   11     parta ends: JUMP → heavy_fallslash_parta (3), y = 210 + 90 = 300.
 *   14     parta ends → partb (1); doSlash travels: 430, y 300 − 2 = 298.
 *   15     partb ends (no label: `default`); 460, 296.
 *   16     arrives at 482 → endSlash: the reload paid (15 − 72 → 0), 358 − 202 = 156 > 100 so
 *          y = 202 + 90 = 292, velY 0, FALL (partb again: startAnim's no-op), checkPlayerHit,
 *          velX +5; doSlash's own drop adds velY 0.
 *   17–22  FALL: velY 3, 6 … 18; y 295, 301, 310, 322, 337, 355; x +5 a frame to 512.
 *   23     velY 21, y 376, x 517 (the move comes BEFORE the ground test, `:1920`); 376 ≥ 358:
 *          y 358, POSE (heavy_fallslash_partc, 16), the landing's hit.
 *   39     partc ends → sheathesword (31), state POSE.   70  sheathesword ends → IDLE.
 *   Reload k on frames 1–15, then k − 15.
 *
 * (2) THE DOWNSTAB — fixture 2 set to DUAL (reach 171, canStab) at x 400; stabTarget on a target at
 *   map x 330 on the ground, facing LEFT: from 330 + 100 = 430, y int(408 − 85.5) = 322, 8 points
 *   straight down to (430, 462). A downstab (0 < 50 x-wise, 322 < 462); destX 430 − 55 = 375,
 *   standing (25 < 50); it faces right (400 < 430). startSlash: y 358, downstab (15), no speed.
 *   1–14   SLASH downstab, still.
 *   15     downstab ends: getDamage() × 2 = 172, the target hit, the reload paid (14 − 72 → 0),
 *          downstab_up (20).
 *   35     downstab_up ends: endDownStab → POSE → sheathesword (31).   66  → IDLE.
 *   Reload k on frames 1–14, then k − 14. No checkPlayerHit: a downstab never reaches endSlash.
 * The AI: frames 1, 13, 25, 37, 49, 61 (both).
 */
describe('slice 5b: two air strokes through the real update, frame by frame', () => {
  const run = (make: (p: MCSPlayer) => void, t: NpcTarget, setUp: (p: MCSPlayer) => void, frames: number) => {
    const p = idleBody(body2(), () => 0.5, new OgAnimLibrary());
    setUp(p);
    const f = framed(p);
    const weapon: Array<[number, NpcDamage]> = [];
    t.checkHitObject = (_thing, damage) => {
      weapon.push([f.now(), damage]);
      return false;
    };
    p.changeTarget(t);
    const landed: Array<[number, NpcDamage]> = [];
    vi.spyOn(p, 'checkPlayerHit').mockImplementation((_s, _o, damage) => {
      landed.push([f.now(), damage]);
    });
    make(p);
    const trace: string[] = [];
    f.run(frames, (n) => {
      trace.push([n, stateName(p.actionState), p.animation, p.posX, p.y, p.facingRight, p.reload].join(' '));
    });
    return { p, ai: f.ai, trace, weapon, landed };
  };
  const row = (n: number, state: string, clip: string, x: number, y: number, reload: number) =>
    [n, state, clip, x, y, true, reload].join(' ');

  it('the JUMP stroke: rise, fall, land, POSE, sheathe, IDLE — state, clip, x, y, facing and reload at every frame', () => {
    const { p, ai, trace, weapon, landed } = run((q) => { q.slashTarget(); }, foe(440, 250, true), () => undefined, 72);
    const FALL_Y = [295, 301, 310, 322, 337, 355];
    const want = Array.from({ length: 72 }, (_, i) => {
      const n = i + 1;
      const reload = n <= 15 ? n : n - 15;
      if (n <= 10) return row(n, 'SLASH', 'heavy_jumpslash_parta', 400, 358, reload);
      if (n <= 13) return row(n, 'SLASH', 'heavy_fallslash_parta', 400, 300, reload);
      if (n === 14) return row(n, 'SLASH', 'heavy_fallslash_partb', 430, 298, reload);
      if (n === 15) return row(n, 'SLASH', 'heavy_fallslash_partb', 460, 296, reload);
      if (n === 16) return row(n, 'FALL', 'heavy_fallslash_partb', 482, 292, reload);
      if (n <= 22) return row(n, 'FALL', 'heavy_fallslash_partb', 482 + 5 * (n - 16), FALL_Y[n - 17] ?? 0, reload);
      if (n <= 38) return row(n, 'POSE', 'heavy_fallslash_partc', 517, 358, reload);
      if (n <= 69) return row(n, 'POSE', 'sheathesword', 517, 358, reload);
      return row(n, 'IDLE', 'idle', 517, 358, reload);
    });
    expect(trace).toEqual(want);
    expect(landed.map(([n, d]) => [n, packet(d)])).toEqual([[16, [86, 45, 0, HEAVY, 0, p]]]);
    expect(weapon.map(([n, d]) => [n, packet(d)])).toEqual([[23, [86, 45, 0, HEAVY, 0, p]]]);
    expect(ai).toEqual([1, 13, 25, 37, 49, 61]);
    expect([p.slashType, p.slashCommitted, p.hasSlash, p.velX, p.velY]).toEqual([T.jump, false, false, 5, 21]);
  });

  it('the DOWNSTAB from a dual body: DOWNSTAB, DOWNSTAB_UP, endDownStab, POSE, IDLE — every frame', () => {
    const { p, ai, trace, weapon, landed } = run(
      (q) => { q.stabTarget(); }, foe(330, GROUND, false), (q) => { q.setStance(DUAL); }, 68,
    );
    const want = Array.from({ length: 68 }, (_, i) => {
      const n = i + 1;
      const reload = n <= 14 ? n : n - 14;
      if (n <= 14) return row(n, 'SLASH', 'downstab', 400, 358, reload);
      if (n <= 34) return row(n, 'SLASH', 'downstab_up', 400, 358, reload);
      if (n <= 65) return row(n, 'POSE', 'sheathesword', 400, 358, reload);
      return row(n, 'IDLE', 'idle', 400, 358, reload);
    });
    expect([p.stance, p.slashLength, p.canStab]).toEqual([DUAL, 171, true]);
    expect(trace).toEqual(want);
    expect(weapon.map(([n, d]) => [n, packet(d)])).toEqual([[15, [172, 45, 0, -1, 0, p]]]);
    expect(landed).toEqual([]);
    expect(ai).toEqual([1, 13, 25, 37, 49, 61]);
    expect([p.slashType, p.slashCommitted, p.hasSlash, p.destX]).toEqual([T.downstab, false, false, 430]);
  });
});

/*
 * L5-OPP SLICE 6a — THE HIT AND THE FLINCH. `checkHitObject` whole (web `§1t99s0§.as:3328-3660`,
 * Android `MCSPlayer.as:3275-3579`), `getDefense`, `isSlashing`, `isUsingSkill` (the web list),
 * `isCharging`, `EnemyPlayer.getSkillLevel`, `doFlinch`, `endFlinch` and the FLINCH clip end; the
 * constructor carries `initPlayer`'s HP, chi and defense and `initElementDefenseStats`' four; every
 * reception override 6a does not port is shadowed with `unported`. Where the builds differ the
 * WEB side is ported (R6), and each test that tells them apart says what Android would give.
 * Every expected number was worked by hand from the web source.
 */
const touching = (parts: readonly OgPart[]): HitGeometry => ({ ...geometry, partsHitBy: () => parts });
const WEAPON: HitShape = { kind: 'part', part: OG_PART.weapon, owner: null };

/** Fixture 2 (heavy, defense 71, elemental defences 10 / 8 / 6 / 5) in IDLE on its sheathed idle, `parts` touching it. */
function struck(parts: readonly OgPart[] = [OG_PART.torso], b: DuellistBody = body2(), rng: Rng = NO_DRAW, lib: AnimLibrary = anims): MCSPlayer {
  const p = new MCSPlayer(world(false), lib, touching(parts), rng, b);
  p.setStance(b.stance);
  p.world.peaceful = false;
  p.setPosition(BODY_X, GROUND);
  p.startAction(OG_STATE.IDLE);
  p.changeTarget(foe(700, GROUND, true));
  return p;
}

/** A packet from a level-45 attacker that is not the body. */
function blow(damage: number, launch: number = OG_LAUNCH.LAUNCH_NONE, stance = -1): NpcDamage {
  const d = new NpcDamage(damage, 45, launch, stance);
  d.setAttacker(new Npc(world(true), anims, geometry, NO_DRAW));
  return d;
}

describe('slice 6a: the constructor carries initPlayer\'s HP, chi and defense, and the four elemental defences', () => {
  it('fixture 1: HP 9 of 9 (the actor default is 1), chi 10 of 10, defense 1, no elemental defence', () => {
    const p = player(body1());
    expect([p.getHP(), p.maxhp, p.chi, p.maxchi, p.defense, p.STAT_FIREDEF, p.STAT_WINDDEF, p.STAT_WATERDEF, p.STAT_EARTHDEF])
      .toEqual([9, 9, 10, 10, 1, 0, 0, 0, 0]);
  });

  it('fixture 2: HP 590 of 590, chi 40 of 50, defense 71, fire 10, wind 8, water 6, earth 5', () => {
    const p = player(body2());
    expect([p.getHP(), p.maxhp, p.chi, p.maxchi, p.defense, p.STAT_FIREDEF, p.STAT_WINDDEF, p.STAT_WATERDEF, p.STAT_EARTHDEF])
      .toEqual([590, 590, 40, 50, 71, 10, 8, 6, 5]);
  });

  it('5a\'s IDLE still reads the carried HP: both fixtures untired, and a quarter of fixture 2\'s 590 (147) tires it', () => {
    expect([struck([], body1()).animation, struck().animation]).toEqual(['idle', 'idle']);
    const p = struck();
    p.setHP(147);
    p.startAction(OG_STATE.IDLE);
    expect(p.animation).toBe('tired');
  });
});

describe('slice 6c: the mob fall-through stays closed — the duellist answers with its own reception', () => {
  it('a 20-damage hit is the duellist\'s gotHit (the mob code took HP 1 to −18): 20 − 1 = 19 floors fixture 1 at 0', () => {
    const p = player(body1());
    expect([p.gotHit(OG_PART.torso, new NpcDamage(20, 45)), p.getHP(), p.dead]).toEqual([true, 0, false]);
  });

  it('the source\'s overrides are the class\'s own; deathAnimEnd is NPC\'s (EnemyPlayer\'s differs only on the network)', () => {
    const own = (m: string) => Object.prototype.hasOwnProperty.call(MCSPlayer.prototype, m);
    expect(['gotHit', 'die', 'gotDeathTouch', 'createLoot', 'rewardXP'].filter(own)).toEqual([
      'gotHit', 'die', 'gotDeathTouch', 'createLoot', 'rewardXP',
    ]);
    expect(own('deathAnimEnd')).toBe(false);
  });

  it('checkDie on a body at 0 HP dies: DYING, dead', () => {
    const p = struck([OG_PART.torso], body2(), () => 0.9);
    p.setHP(0);
    expect([p.checkDie(), p.dead, p.actionState]).toEqual([true, true, OG_STATE.DYING]);
  });
});

describe('slice 6a: the helpers — getDefense, isSlashing, isCharging, isUsingSkill (WEB list), getSkillLevel', () => {
  it('getDefense: heavy takes int(71 × 0.8) = 56, every other stance the whole 71 (the same in both builds)', () => {
    const at = (stance: number) => {
      const p = player(body2());
      p.stance = stance;
      return p.getDefense();
    };
    expect([LIGHT, BALANCED, HEAVY, DUAL, REVERSED].map(at)).toEqual([71, 71, 56, 71, 71]);
  });

  it('isSlashing is SLASH alone', () => {
    const p = player(body2());
    const on = Object.values(OG_STATE).filter((s) => {
      p.actionState = s;
      return p.isSlashing();
    });
    expect(on).toEqual([OG_STATE.SLASH]);
  });

  it('isCharging: SHUNPO, THOUSANDSTABS, DEADLYCLEAVE, CHARGING', () => {
    const p = player(body2());
    const on = Object.values(OG_STATE).filter((s) => {
      p.actionState = s;
      return p.isCharging();
    });
    expect(on.map(stateName).sort()).toEqual(['CHARGING', 'SKILL_DEADLYCLEAVE', 'SKILL_SHUNPO', 'SKILL_THOUSANDSTABS']);
  });

  it('WEB isUsingSkill: Android\'s 20 states and the charging four, plus SMOKEBOMB, SMOKEBOMB2, FIREBREATH, WATERSPLASH', () => {
    const p = player(body2());
    const on = Object.values(OG_STATE).filter((s) => {
      p.actionState = s;
      return p.isUsingSkill();
    });
    expect(on.map(stateName)).toEqual([
      'CHARGING', 'SMOKEBOMB', 'DOSKILL', 'SMOKEBOMB2', 'WINDKICK', 'DASH', 'BACKSTEP',
      'SKILL_GROUNDPUNCH', 'SKILL_CHIBURST', 'SKILL_SHUNPO', 'SKILL_THOUSANDSTABS', 'SKILL_DEADLYCLEAVE',
      'SKILL_SPIRITTHIEF', 'SKILL_DEATHTOUCH', 'SKILL_FLASHBANG', 'SKILL_STEALTH', 'SKILL_SHADOWCLONE',
      'SKILL_MASSCLONE', 'SKILL_SUBSTITUTIONLOG', 'SKILL_BACKTHROW', 'SKILL_BULLCHARGE', 'SKILL_FIREBREATH',
      'SKILL_WATERSPLASH', 'SKILL_INFERNO', 'SKILL_TSUNAMI', 'SKILL_TORNADO', 'SKILL_EARTHQUAKE',
    ]);
  });

  it('EnemyPlayer.getSkillLevel: a null skillList is 0 (the source\'s guard); else the id\'s level, 0 when absent', () => {
    const p = player(body2());
    p.skillList = null; // 7a: init fills it from the profile; the source's guard stays
    expect(p.getSkillLevel(1004)).toBe(0);
    p.skillList = [{ id: 1003, value: 5 }, { id: 1004, value: 2 }, { id: 1004, value: 9 }];
    expect([p.getSkillLevel(1004), p.getSkillLevel(1074)]).toEqual([2, 0]);
  });
});

describe('slice 6a: checkHitObject — the guards and the two evades (WEB)', () => {
  it('a body still guarding (gotHitCounter > 0), mid screen transition, or in SKILL_UNDYING takes nothing', () => {
    const guarded = (setUp: (p: MCSPlayer) => void) => {
      const p = struck();
      setUp(p);
      return [p.checkHitObject(WEAPON, blow(100)), p.getHP()];
    };
    expect(guarded((p) => { p.gotHitCounter = 1; })).toEqual([false, 590]);
    expect(guarded((p) => { p.world.transitioning = true; })).toEqual([false, 590]);
    expect(guarded((p) => { p.actionState = OG_STATE.SKILL_UNDYING; })).toEqual([false, 590]);
  });

  it('WEB: a packet whose attacker is the body itself is refused (Android has no such guard)', () => {
    const p = struck();
    const self = new NpcDamage(100, 45);
    self.setAttacker(p);
    expect([p.checkHitObject(WEAPON, self), p.getHP(), p.gotHitCounter]).toEqual([false, 590, 0]);
    const nobody = new NpcDamage(100, 45);
    expect(p.checkHitObject(WEAPON, nobody)).toBe(true);
  });

  it('WEB roll dodge in FORWARDROLL: level 1 → 75, 2 → 85, 3 and up → 95 (Android 80 / 85 / 90 / 95 / 100)', () => {
    const dodged = (level: number, draw: number) => {
      const p = struck([OG_PART.torso], body2(), () => draw);
      p.actionState = OG_STATE.FORWARDROLL;
      p.skillList = [{ id: 1004, value: level }];
      const got = p.checkHitObject(WEAPON, blow(100));
      return [got, p.getHP(), p.gotHitCounter, p.events.filter((e) => e.type === 'sound')];
    };
    const JUMP = [{ type: 'sound', name: 'jump' }];
    expect(dodged(1, 0.74)).toEqual([true, 590, 12, JUMP]);
    expect(dodged(1, 0.75)[1]).toBe(546);
    expect(dodged(2, 0.84)[1]).toBe(590);
    expect(dodged(2, 0.85)[1]).not.toBe(590);
    expect(dodged(3, 0.94)[1]).toBe(590);
    expect(dodged(5, 0.94)[1]).toBe(590);
    expect(dodged(5, 0.95)[1]).not.toBe(590);
  });

  it('the roll draws its die even with no skill (chance 0), then the hit lands', () => {
    let draws = 0;
    const p = struck([OG_PART.torso], body2(), () => {
      draws += 1;
      return 0;
    });
    p.actionState = OG_STATE.FORWARDROLL;
    expect([p.checkHitObject(WEAPON, blow(100)), draws, p.getHP()]).toEqual([true, 1, 546]);
  });

  it('WEB full-Focus evade: slashing on a full bar with the stance\'s skill (1074 / 1075 / 1076) — no draw, no damage', () => {
    const evaded = (stance: number, skill: number, setUp: (p: MCSPlayer) => void = () => undefined) => {
      const p = struck();
      p.stance = stance;
      p.actionState = OG_STATE.SLASH;
      p.reload = p.maxreload;
      p.skillList = [{ id: skill, value: 1 }];
      setUp(p);
      return [p.checkHitObject(WEAPON, blow(100)), p.getHP() === 590, p.gotHitCounter];
    };
    expect(evaded(LIGHT, 1074)).toEqual([true, true, 12]);
    expect(evaded(BALANCED, 1075)).toEqual([true, true, 12]);
    expect(evaded(HEAVY, 1076)).toEqual([true, true, 12]);
    expect(evaded(HEAVY, 1074)).toEqual([true, false, 12]);
    expect(evaded(DUAL, 1076)).toEqual([true, false, 12]);
    expect(evaded(HEAVY, 1076, (p) => { p.reload -= 1; })).toEqual([true, false, 12]);
    expect(evaded(HEAVY, 1076, (p) => { p.actionState = OG_STATE.IDLE; })).toEqual([true, false, 12]);
  });
});

describe('slice 6a: checkHitObject — the part scan (WEB: parts 3 and 4 never take the hit)', () => {
  it('a miss, or a touch on the weapon (3) or the prop (4) alone, lands nothing and returns false', () => {
    for (const parts of [[], [OG_PART.weapon], [OG_PART.prop], [OG_PART.prop, OG_PART.weapon]]) {
      const p = struck(parts);
      expect([parts, p.checkHitObject(WEAPON, blow(100)), p.getHP(), p.gotHitCounter, p.events]).toEqual([parts, false, 590, 0, []]);
    }
  });

  it('past the weapon and the prop the scan goes on: the next part takes it', () => {
    const p = struck([OG_PART.prop, OG_PART.weapon, OG_PART.l_hand]);
    expect([p.checkHitObject(WEAPON, blow(100)), p.getHP()]).toEqual([true, 546]);
  });

  it('a slashing body that can deflect snaps a breakable projectile on ANY part touched first, weapon included', () => {
    const snapped = (parts: readonly OgPart[], setUp: (p: MCSPlayer) => void = () => undefined, breakable = true) => {
      const p = struck(parts);
      p.canDeflect = true;
      p.actionState = OG_STATE.SLASH;
      setUp(p);
      const got = p.checkHitObject({ kind: 'other', part: null, owner: null, breakable }, blow(100));
      return [got, p.getHP(), p.events];
    };
    const SNAP = [{ type: 'breakProjectile' }, { type: 'sound', name: 'deflect' }];
    expect(snapped([OG_PART.weapon])).toEqual([false, 590, SNAP]);
    expect(snapped([OG_PART.weapon, OG_PART.torso])).toEqual([false, 590, SNAP]);
    expect(snapped([OG_PART.torso])).toEqual([false, 590, SNAP]);
    expect(snapped([OG_PART.torso], (p) => { p.canDeflect = false; })[1]).toBe(546);
    expect(snapped([OG_PART.torso], (p) => { p.actionState = OG_STATE.IDLE; })[1]).toBe(546);
    expect(snapped([OG_PART.torso], () => undefined, false)[1]).toBe(546);
  });
});

describe('slice 6a: checkHitObject — the landed hit', () => {
  it('fixture 2 (heavy): 100 − int(71 × 0.8) = 44; fire 15−10 = 5, wind 12−8 = 4, water 3−6 floors to 1, earth 20−5 = 15; 590 → 521', () => {
    const p = struck();
    p.stunCounter = 7;
    const d = new NpcDamage(100, 45, OG_LAUNCH.LAUNCH_NONE, -1, 15, 3, 12, 20);
    expect(p.checkHitObject(WEAPON, d)).toBe(true);
    expect([p.getHP(), p.gotHitCounter, p.stunCounter, p.healthBarFraction, d.victimPosX])
      .toEqual([521, 12, 0, 521 / 590, 400]);
    // The texts in the source's order: physical, fire, wind, water, earth (web `:3621-3642`).
    expect(p.events).toEqual([
      { type: 'sound', name: 'hit' },
      { type: 'floatingText', x: 400, y: 258, text: '44', colour: 10027008 },
      { type: 'floatingText', x: 400, y: 258, text: '5', colour: 16737792 },
      { type: 'floatingText', x: 400, y: 258, text: '4', colour: 13421772 },
      { type: 'floatingText', x: 400, y: 258, text: '1', colour: 26367 },
      { type: 'floatingText', x: 400, y: 258, text: '15', colour: 6697728 },
    ]);
  });

  it('the least a hit does is the attacker\'s floor: 20 − 56 → int(45 / 4) = 11, plus piercing 3', () => {
    const p = struck();
    const d = blow(20);
    d.setPiercingDamage(3);
    p.checkHitObject(WEAPON, d);
    expect(p.getHP()).toBe(590 - 14);
  });

  it('WEB: stunCounter clears only on a landed hit (Android clears it on every call past the dodges)', () => {
    const p = struck([OG_PART.weapon]);
    p.stunCounter = 7;
    p.checkHitObject(WEAPON, blow(100));
    expect(p.stunCounter).toBe(7);
  });

  it('a stealthed body shows itself when struck (cancelStealth: a smoke event, visible again)', () => {
    const p = struck();
    p.visible = false;
    p.checkHitObject(WEAPON, blow(100));
    expect([p.visible, p.events[0]]).toEqual([true, { type: 'smoke', x: 400, y: 358 }]);
  });

  it('a hit that takes HP to 0 or under sets it to 0, clears the target, and does not die here (the seam\'s checkDie does)', () => {
    const p = struck();
    p.setHP(40);
    expect([p.checkHitObject(WEAPON, blow(100)), p.getHP(), p.target, p.actionState, p.animation])
      .toEqual([true, 0, null, OG_STATE.IDLE, 'idle']);
    expect(p.events).toEqual([{ type: 'sound', name: 'hit' }]);
    const exact = struck();
    exact.setHP(44);
    expect([exact.checkHitObject(WEAPON, blow(100)), exact.getHP(), exact.target, exact.actionState, exact.events])
      .toEqual([true, 0, null, OG_STATE.IDLE, [{ type: 'sound', name: 'hit' }]]);
  });

  it('a hit with no elemental damage writes one text: an amount of 0 writes none', () => {
    const p = struck();
    p.checkHitObject(WEAPON, blow(100));
    expect(p.events.flatMap((e) => (e.type === 'floatingText' ? [e.text] : []))).toEqual(['44']);
  });

  it('the victim position is the map x, truncated (`getMapPosition():int`)', () => {
    const p = struck();
    p.setPosition(400.7, GROUND);
    const d = blow(100);
    p.checkHitObject(WEAPON, d);
    expect(d.victimPosX).toBe(400);
  });

  it('the log substitution (logsubCounter > 0) goes through cancelLogSub on the AI: slice 7, loud', () => {
    const p = struck();
    p.logsubCounter = 3;
    expect(() => p.checkHitObject(WEAPON, blow(100))).toThrow('unported: MCSPlayer.cancelLogSub');
  });

  it('a charging FX is removed unless the body charges chi and the hit does not launch: unported (no path sets it)', () => {
    const fx = {};
    const p = struck();
    p.chargingFx = fx;
    p.actionState = OG_STATE.SKILL_CHICHARGE;
    expect(p.checkHitObject(WEAPON, blow(100))).toBe(true);
    const q = struck();
    q.chargingFx = fx;
    expect(() => q.checkHitObject(WEAPON, blow(100))).toThrow('unported: Projectile.removeProjectile');
    const launched = struck();
    launched.chargingFx = fx;
    launched.actionState = OG_STATE.SKILL_CHICHARGE;
    expect(() => launched.checkHitObject(WEAPON, blow(100, OG_LAUNCH.LAUNCH_AIR))).toThrow('unported: Projectile.removeProjectile');
    // The removal comes BEFORE the damage (web `:3477`). Since 6b the launch's own `startAction`
    // also removes it, with the same message, AFTER the damage: HP tells the two apart.
    expect(launched.getHP()).toBe(590);
  });
});

describe('slice 6a: checkHitObject — the reaction (WEB: the juggle cap per attacker stance)', () => {
  const reacting = (launch: number, setUp: (p: MCSPlayer) => void = () => undefined, stance = -1) => {
    const p = struck();
    setUp(p);
    return { p, got: () => p.checkHitObject(WEAPON, blow(100, launch, stance)) };
  };

  it('a plain hit on a body that is not downed flinches it; a downed body does not', () => {
    const { p, got } = reacting(OG_LAUNCH.LAUNCH_NONE);
    expect([got(), p.actionState, p.animation]).toEqual([true, OG_STATE.FLINCH, 'flinch']);
    const down = reacting(OG_LAUNCH.LAUNCH_NONE, (q) => { q.actionState = OG_STATE.DOWNED; });
    expect([down.got(), down.p.actionState]).toEqual([true, OG_STATE.DOWNED]);
  });

  it('the death touch (6c): 44, then a flat 500 through gotHit; chi 0', () => {
    const { p, got } = reacting(OG_LAUNCH.DEATHTOUCH);
    expect([got(), p.getHP(), p.getChi(), p.actionState]).toEqual([true, 46, 0, OG_STATE.FLINCH]);
  });

  it('the launch and the knockdown write the body\'s facing into the packet (1 right, 0 left) before they react', () => {
    const facing = (launch: number, right: boolean, method: 'gotLaunched' | 'gotKnockDown') => {
      const p = struck();
      if (right) p.faceRight();
      else p.faceLeft();
      vi.spyOn(p, method).mockImplementation(() => undefined);
      const d = blow(100, launch);
      p.checkHitObject(WEAPON, d);
      return d.flyVelX;
    };
    expect([facing(OG_LAUNCH.LAUNCH_AIR, true, 'gotLaunched'), facing(OG_LAUNCH.LAUNCH_AIR, false, 'gotLaunched')]).toEqual([1, 0]);
    expect([facing(OG_LAUNCH.LAUNCH_KNOCKDOWN, true, 'gotKnockDown'), facing(OG_LAUNCH.LAUNCH_KNOCKDOWN, false, 'gotKnockDown')])
      .toEqual([1, 0]);
  });

  it('the knee groin hands on the packet\'s position and the attacker\'s level', () => {
    const p = struck();
    const groin = vi.spyOn(p, 'gotKneeGroin').mockImplementation(() => undefined);
    const d = blow(100, OG_LAUNCH.KNEEGROIN);
    d.setFlyVel(310, 350);
    p.checkHitObject(WEAPON, d);
    expect(groin.mock.calls).toEqual([[310, 350, 45]]);
  });

  it('a death touch lands AFTER the reaction chain: the body is already flinching', () => {
    const p = struck();
    const states: string[] = [];
    vi.spyOn(p, 'gotDeathTouch').mockImplementation(() => {
      states.push(stateName(p.actionState) ?? '');
    });
    p.checkHitObject(WEAPON, blow(100, OG_LAUNCH.DEATHTOUCH));
    expect(states).toEqual(['FLINCH']);
  });

  it('a body already in the air (GOTLAUNCHED, FALL, JUMP) is launched again by a plain hit: the airborne hop, -20', () => {
    for (const s of [OG_STATE.GOTLAUNCHED, OG_STATE.FALL, OG_STATE.JUMP]) {
      const { p, got } = reacting(OG_LAUNCH.LAUNCH_NONE, (q) => { q.actionState = s; });
      expect([got(), p.actionState, p.velY, p.juggleCount]).toEqual([true, OG_STATE.GOTLAUNCHED, -20, 1]);
    }
  });

  it('WEB juggle cap: a non-LIGHT attacker\'s launch is skipped at juggleCount 3, a LIGHT one\'s at 5; the damage lands', () => {
    const capped = reacting(OG_LAUNCH.LAUNCH_AIR, (q) => { q.juggleCount = 3; }, HEAVY);
    expect([capped.got(), capped.p.getHP(), capped.p.actionState, capped.p.juggleCount]).toEqual([true, 546, OG_STATE.IDLE, 3]);
    const mob = reacting(OG_LAUNCH.LAUNCH_AIR, (q) => { q.juggleCount = 3; });
    expect([mob.got(), mob.p.actionState]).toEqual([true, OG_STATE.IDLE]);
    const launched = (n: number, stance: number) => {
      const r = reacting(OG_LAUNCH.LAUNCH_AIR, (q) => { q.juggleCount = n; }, stance);
      r.got();
      return [r.p.actionState, r.p.juggleCount];
    };
    expect(launched(2, HEAVY)).toEqual([OG_STATE.GOTLAUNCHED, 3]);
    expect(launched(4, LIGHT)).toEqual([OG_STATE.GOTLAUNCHED, 5]);
    const light = reacting(OG_LAUNCH.LAUNCH_AIR, (q) => { q.juggleCount = 5; }, LIGHT);
    expect([light.got(), light.p.actionState]).toEqual([true, OG_STATE.IDLE]);
  });

  it('a stun packet stuns through NPC.gotStun (ported): STUN, zom_idle, the duration in flyVelX', () => {
    const d = blow(100, OG_LAUNCH.STUN);
    d.setStunTime(30);
    const p = struck();
    p.checkHitObject(WEAPON, d);
    expect([p.actionState, p.animation, p.stunCounter]).toEqual([OG_STATE.STUN, 'zom_idle', 30]);
  });

  it('a downed body hit by a launch packet is not launched, and not flinched', () => {
    const { p, got } = reacting(OG_LAUNCH.LAUNCH_AIR, (q) => { q.actionState = OG_STATE.KNOCKDOWNED; });
    expect([got(), p.actionState, p.getHP()]).toEqual([true, OG_STATE.KNOCKDOWNED, 546]);
  });
});

describe('slice 6a: doFlinch / endFlinch and the FLINCH clip end (the same in both builds)', () => {
  it('doFlinch: a sheathed or tired clip flinches bare (FLINCH), any other with the weapon; the state, clip and frame are kept', () => {
    const from = (clip: string) => {
      const p = struck();
      p.startAnim(clip);
      p.frameCounter = 2;
      p.doFlinch();
      return [p.actionState, p.animation, p.prevActionState, p.prevAnim, p.prevFrameCounter];
    };
    for (const clip of ['idle', 'walk', 'run_sheathed', 'tired']) {
      expect(from(clip)).toEqual([OG_STATE.FLINCH, 'flinch', OG_STATE.IDLE, clip, 2]);
    }
    expect(from('heavy_stance')).toEqual([OG_STATE.FLINCH, 'flinch_weapon', OG_STATE.IDLE, 'heavy_stance', 2]);
  });

  it('doFlinch leaves a body charging chi, already flinching, or slashing alone', () => {
    for (const s of [OG_STATE.SKILL_CHICHARGE, OG_STATE.FLINCH, OG_STATE.SLASH]) {
      const p = struck();
      p.actionState = s;
      p.doFlinch();
      expect([stateName(p.actionState), p.animation]).toEqual([stateName(s), 'idle']);
    }
  });

  it('endFlinch restores the state, the clip and its frame, then runs the AI (controlledBy 1)', () => {
    const p = struck();
    p.startAnim('heavy_stance');
    p.frameCounter = 2;
    p.doFlinch();
    const ai = vi.spyOn(p, 'AI').mockImplementation(() => undefined);
    p.endFlinch();
    expect([p.actionState, p.animation, p.frameCounter, ai.mock.calls.length]).toEqual([OG_STATE.IDLE, 'heavy_stance', 2, 1]);
  });

  it('endFlinch back into a skill or POSE goes IDLE instead; unspied, the REAL AI runs (7a)', () => {
    const back = (s: OgState) => {
      const p = struck();
      p.actionState = s;
      p.startAnim('heavy_stance');
      p.doFlinch();
      vi.spyOn(p, 'AI').mockImplementation(() => undefined);
      p.endFlinch();
      return [stateName(p.actionState), p.animation];
    };
    expect(back(OG_STATE.POSE)).toEqual(['IDLE', 'idle']);
    expect(back(OG_STATE.DASH)).toEqual(['IDLE', 'idle']);
    expect(back(OG_STATE.SMOKEBOMB)).toEqual(['IDLE', 'idle']);
    expect(back(OG_STATE.WALK)).toEqual(['WALK', 'heavy_stance']);
    const q = struck();
    q.doFlinch();
    // back to IDLE, then the AI: level 45 draws no skip die; its first is the skill die
    expect(() => { q.endFlinch(); }).toThrow('drew a random number');
    expect(q.actionState).toBe(OG_STATE.IDLE);
  });

  it('the clip-end switch: FLINCH_WEAPON and FLINCH both end the flinch', () => {
    for (const clip of ['flinch_weapon', 'flinch']) {
      const p = struck();
      p.doFlinch();
      const end = vi.spyOn(p, 'endFlinch').mockImplementation(() => undefined);
      expect([p.clipEnded(clip), end.mock.calls.length]).toEqual([true, 1]);
    }
  });
});

describe('slice 6a: a plain hit into the IDLE duellist, through the real update', () => {
  it('HP 590 → 546, gotHitCounter 12 down to 0, flinch for its 8 frames, then IDLE on the idle clip and the AI', () => {
    const p = struck([OG_PART.torso], body2(), NO_DRAW, new OgAnimLibrary());
    const f = framed(p);
    f.run(1);
    expect(p.checkHitObject(WEAPON, blow(100))).toBe(true);
    const trace: string[] = [];
    f.run(10, (n) => {
      trace.push([n, stateName(p.actionState), p.animation, p.gotHitCounter].join(' '));
    });
    expect(trace).toEqual([
      '2 FLINCH flinch 11', '3 FLINCH flinch 10', '4 FLINCH flinch 9', '5 FLINCH flinch 8', '6 FLINCH flinch 7',
      '7 FLINCH flinch 6', '8 FLINCH flinch 5', '9 IDLE idle 4', '10 IDLE idle 3', '11 IDLE idle 2',
    ]);
    expect([p.getHP(), f.ai]).toEqual([546, [1, 9]]);
    expect(p.checkHitObject(WEAPON, blow(100))).toBe(false);
    f.run(2);
    expect([p.gotHitCounter, p.checkHitObject(WEAPON, blow(100)), p.getHP()]).toEqual([0, true, 502]);
  });
});

/*
 * L5-OPP SLICE 6b — THE LAUNCH AND THE GETUP. `gotLaunched` (web `§1t99s0§.as:4497`, Android
 * `MCSPlayer.as:4137`), `gotKneeGroin` (`:4574` / `:4197`) and `MCSPlayer`'s own `doLaunched`
 * (`:3991` / `:3887`); `gotKnockDown`, `gotBackThrow`, `gotFly`, `gotFlyAway` and `doFly` add only
 * the human's UI to `NPC`'s, so the duellist runs `NPC`'s; `checkHitObject`'s fly-away; the three
 * switches' reception groups. WEB where the builds differ (R6). Every expected number was worked
 * by hand from the source.
 */
describe('slice 6b: the reactions — gotLaunched counts (WEB), gotKneeGroin costs chi, the rest are NPC\'s', () => {
  it('WEB gotLaunched counts first, then NPC\'s: from the ground GOTLAUNCHED, the rise clip, velY −25, pushed against the facing', () => {
    const p = struck();
    p.gotLaunched();
    expect([p.juggleCount, p.actionState, p.animation, p.velY, p.velX]).toEqual([1, OG_STATE.GOTLAUNCHED, 'gotlaunchedupwards_parta', -25, -3]);
    const q = struck();
    q.faceLeft();
    q.gotLaunched();
    expect(q.velX).toBe(3);
  });

  it('in the air: the hop is −20, the facing flips, the count goes on', () => {
    const p = struck();
    p.gotLaunched();
    p.gotLaunched();
    expect([p.juggleCount, p.velY, p.isFacingRight(), p.velX]).toEqual([2, -20, false, 3]);
  });

  it('WEB: the count rises BEFORE NPC\'s guard, so a dying body that is not launched still counts one', () => {
    const p = struck();
    p.actionState = OG_STATE.DYING;
    p.gotLaunched();
    expect([p.juggleCount, p.actionState, p.velY]).toEqual([1, OG_STATE.DYING, 0]);
  });

  it('gotKnockDown is NPC\'s: on the ground KNOCKDOWNED, the downed clip, the bar hidden', () => {
    const p = struck();
    p.showHealthBar();
    p.gotKnockDown();
    expect([p.actionState, p.animation, p.healthBarVisible]).toEqual([OG_STATE.KNOCKDOWNED, 'gotlauncheddowned', false]);
  });

  it('gotKneeGroin: VICTIM at the attacker\'s point, then chi 40 less 15 = 25; less 45 floors at 0 (MCSPlayer.as:4203-4208)', () => {
    const p = struck();
    p.gotKneeGroin(310, 350, 15);
    expect([p.actionState, p.animation, p.posX, p.y, p.isFacingRight(), p.chi]).toEqual([OG_STATE.VICTIM, 'kneegroin_victim', 310, 350, false, 25]);
    const q = struck();
    q.gotKneeGroin(510, 358, 45);
    expect([q.isFacingRight(), q.chi]).toEqual([true, 0]);
  });

  it('gotKneeGroin\'s own guard: a downed or dying body, or one that cannot be knee-groined, keeps its chi', () => {
    for (const s of [OG_STATE.DOWNED, OG_STATE.DYING]) {
      const p = struck();
      p.actionState = s;
      p.gotKneeGroin(310, 350, 15);
      expect([stateName(p.actionState), p.chi, p.posX]).toEqual([stateName(s), 40, 400]);
    }
    const q = struck();
    q.canGotKneeGroin = false;
    q.gotKneeGroin(310, 350, 15);
    expect([q.actionState, q.chi]).toEqual([OG_STATE.IDLE, 40]);
  });

  it('gotBackThrow and gotFly are NPC\'s: VICTIM on the back-throw clip; FLY on fly_start, facing against the flight, the bar hidden', () => {
    const p = struck();
    p.showHealthBar();
    p.gotBackThrow(450, 358);
    expect([p.actionState, p.animation, p.posX, p.isFacingRight(), p.healthBarVisible]).toEqual([OG_STATE.VICTIM, 'backthrow_victim', 450, true, false]);
    const q = struck();
    q.showHealthBar();
    q.gotFly(12, -15);
    expect([q.actionState, q.animation, q.velX, q.velY, q.isFacingRight(), q.healthBarVisible]).toEqual([OG_STATE.FLY, 'fly_start', 12, -15, false, false]);
  });

  it('WEB fly-away through checkHitObject: thrown away from the thing\'s x, then the packet carries the body\'s velocity as a FLY', () => {
    const p = struck();
    const d = blow(100, OG_LAUNCH.LAUNCH_FLYAWAY);
    expect(p.checkHitObject({ ...WEAPON, x: 450 }, d)).toBe(true);
    expect([p.actionState, p.animation, p.velX, p.velY, p.isFacingRight()]).toEqual([OG_STATE.FLY, 'fly_start', -20, -10, true]);
    expect([d.launchType, d.flyVelX, d.flyVelY]).toEqual([OG_LAUNCH.LAUNCH_FLY, -20, -10]);
    const q = struck();
    const e = blow(100, OG_LAUNCH.LAUNCH_FLYAWAY);
    q.checkHitObject({ ...WEAPON, x: 350 }, e);
    expect([q.velX, q.isFacingRight(), e.launchType, e.flyVelX]).toEqual([20, false, OG_LAUNCH.LAUNCH_FLY, 20]);
  });

  it('the thing\'s x is an `int` parameter (`NPC.as:611`): 400.5 truncates to 400, not right of a body at 400.2', () => {
    const p = struck();
    p.setPosition(400.2, GROUND);
    p.checkHitObject({ ...WEAPON, x: 400.5 }, blow(100, OG_LAUNCH.LAUNCH_FLYAWAY));
    expect([p.velX, p.isFacingRight()]).toEqual([20, false]);
  });

  it('a fly-away from a shape that carries no x is loud (the seam gives it, slice 8)', () => {
    expect(() => struck().checkHitObject(WEAPON, blow(100, OG_LAUNCH.LAUNCH_FLYAWAY))).toThrow('the thing\'s x');
  });
});

describe('slice 6b: doLaunched — MCSPlayer\'s own, not NPC\'s (the same in both builds)', () => {
  const airborne = (x: number, y: number, velX: number, velY: number) => {
    const p = struck();
    p.actionState = OG_STATE.GOTLAUNCHED;
    p.setPosition(x, y);
    p.velX = velX;
    p.velY = velY;
    p.doLaunched();
    return p;
  };

  it('a frame: y by velY, x by velX UNCLAMPED (movePositionX: 1 − 3 = −2), then gravity 3; at the edge NO bounce (NPC\'s re-launches under 20)', () => {
    const p = airborne(1, 300, -3, -10);
    expect([p.posX, p.y, p.velX, p.velY, p.juggleCount, p.animation]).toEqual([-2, 290, -3, -7, 0, 'idle']);
  });

  it('the peak clip plays while −4 < velY < 0, after gravity', () => {
    expect(airborne(400, 300, 0, -4).animation).toBe('gotlaunchedupwards_partb');
    expect(airborne(400, 300, 0, -7).animation).toBe('idle');
    expect(airborne(400, 300, 0, -3).animation).toBe('idle');
  });

  it('it lands at the ground: DOWNED on the downed clip, the bar hidden, the juggle count reset (WEB :4017)', () => {
    const p = struck();
    p.showHealthBar();
    p.juggleCount = 3;
    p.actionState = OG_STATE.GOTLAUNCHED;
    p.setPosition(400, 350);
    p.velY = 10;
    p.doLaunched();
    expect([p.y, p.actionState, p.animation, p.healthBarVisible, p.juggleCount]).toEqual([358, OG_STATE.DOWNED, 'gotlauncheddowned', false, 0]);
  });

  it('it lands ON the ground too: 348 + 10 = 358 is a landing (`>=`, web `:4008`)', () => {
    const p = airborne(400, 348, 0, 10);
    expect([p.y, p.actionState]).toEqual([358, OG_STATE.DOWNED]);
  });

  it('it lands whatever velY\'s sign (NPC\'s waits for velY > 0): below the ground and rising, it lands', () => {
    expect(airborne(400, 370, 0, -5).actionState).toBe(OG_STATE.DOWNED);
  });
});

describe('slice 6b: the three switches\' reception groups (the same in both builds)', () => {
  it('startAction: GOTLAUNCHED plays the rise; KNOCKDOWNED and DOWNED the downed clip', () => {
    const clip = (s: OgState) => {
      const p = struck();
      p.startAction(s);
      return [stateName(p.actionState), p.animation];
    };
    expect(clip(OG_STATE.GOTLAUNCHED)).toEqual(['GOTLAUNCHED', 'gotlaunchedupwards_parta']);
    expect(clip(OG_STATE.KNOCKDOWNED)).toEqual(['KNOCKDOWNED', 'gotlauncheddowned']);
    expect(clip(OG_STATE.DOWNED)).toEqual(['DOWNED', 'gotlauncheddowned']);
  });

  it('doAction: GOTLAUNCHED is doLaunched, FLY doFly, STUN doStun; DOWNED does nothing', () => {
    const p = struck();
    const launched = vi.spyOn(p, 'doLaunched').mockImplementation(() => undefined);
    const fly = vi.spyOn(p, 'doFly').mockImplementation(() => undefined);
    p.actionState = OG_STATE.GOTLAUNCHED;
    p.doAction();
    p.actionState = OG_STATE.FLY;
    p.doAction();
    expect([launched.mock.calls.length, fly.mock.calls.length]).toEqual([1, 1]);
    const q = struck();
    q.actionState = OG_STATE.STUN;
    q.stunCounter = 2;
    q.doAction();
    expect([q.actionState, q.stunCounter]).toEqual([OG_STATE.STUN, 1]);
    q.doAction();
    expect(q.actionState).toBe(OG_STATE.IDLE);
    const r = struck();
    r.actionState = OG_STATE.DOWNED;
    r.velY = 5;
    r.doAction();
    expect([r.actionState, r.y, r.velY, r.animation]).toEqual([OG_STATE.DOWNED, 358, 5, 'idle']);
  });

  it('doFly is NPC\'s, reached through doAction: the arc at gravity 1, landing on FLY_END', () => {
    const p = struck();
    p.gotFly(12, -15);
    p.doAction();
    expect([p.posX, p.y, p.velY]).toEqual([412, 343, -14]);
    p.setPosition(412, 345);
    p.velY = 5;
    p.doAction();
    expect([p.y, p.animation]).toEqual([358, 'fly_end']);
  });
});

describe('slice 6b: the clip ends — the fall and the getups (the same in both builds)', () => {
  const ended = (clip: string, setUp: (p: MCSPlayer) => void = () => undefined) => {
    const p = struck();
    setUp(p);
    expect(p.clipEnded(clip)).toBe(true);
    return p;
  };
  const flipper = (p: MCSPlayer) => {
    p.setStance(DUAL);
  };

  it('FLY_END: DOWNED on the downed clip; KNEEGROIN_VICTIM: the front getup; GOTLAUNCHED_PEAK: the fall', () => {
    expect([ended('fly_end').actionState, ended('fly_end').animation]).toEqual([OG_STATE.DOWNED, 'gotlauncheddowned']);
    expect(ended('kneegroin_victim').animation).toBe('getup_front');
    expect(ended('gotlaunchedupwards_partb').animation).toBe('gotlaunchedupwards_partc');
  });

  it('BACKTHROW_VICTIM: DOWNED, the flip-up if it can (not in adventure mode), else the long getup; 410 px the way it faces, clamped', () => {
    const right = ended('backthrow_victim', (p) => { p.setPosition(100, GROUND); });
    expect([right.actionState, right.animation, right.posX]).toEqual([OG_STATE.DOWNED, 'gotlauncheddownedend', 510]);
    const left = ended('backthrow_victim', (p) => { p.setPosition(500, GROUND); p.faceLeft(); });
    expect(left.posX).toBe(90);
    expect(ended('backthrow_victim', (p) => { p.setPosition(600, GROUND); }).posX).toBe(800);
    expect(ended('backthrow_victim', flipper).animation).toBe('flipupfromdowned');
    expect(ended('backthrow_victim', (p) => { flipper(p); p.world.adventureMode = true; }).animation).toBe('gotlauncheddownedend');
  });

  it('GETUP_FRONT: 40 px back from the facing, then IDLE', () => {
    const victim = (p: MCSPlayer) => {
      p.actionState = OG_STATE.VICTIM;
      p.startAnim('getup_front');
    };
    const right = ended('getup_front', victim);
    expect([right.posX, right.actionState, right.animation]).toEqual([360, OG_STATE.IDLE, 'idle']);
    expect(ended('getup_front', (p) => { victim(p); p.faceLeft(); }).posX).toBe(440);
  });

  it('GOTLAUNCHEDDOWNED, alive: the bar shown at x −100; then the flip-up (bar hidden again), a knocked-down body\'s DOWNEDUP2, or the long getup', () => {
    const down = ended('gotlauncheddowned', (p) => { p.actionState = OG_STATE.DOWNED; });
    expect([down.animation, down.healthBarVisible, down.healthBarX]).toEqual(['gotlauncheddownedend', true, -100]);
    const knocked = ended('gotlauncheddowned', (p) => { p.actionState = OG_STATE.KNOCKDOWNED; });
    expect(knocked.animation).toBe('downedup2');
    const flip = ended('gotlauncheddowned', (p) => { flipper(p); p.actionState = OG_STATE.KNOCKDOWNED; });
    expect([flip.animation, flip.healthBarVisible, flip.healthBarX]).toEqual(['flipupfromdowned', false, -100]);
    const adventure = ended('gotlauncheddowned', (p) => { flipper(p); p.actionState = OG_STATE.KNOCKDOWNED; p.world.adventureMode = true; });
    expect([adventure.animation, adventure.healthBarVisible]).toEqual(['downedup2', true]);
  });

  it('GOTLAUNCHEDDOWNED keeps the bar hidden at 0 HP or in the red freeze; dead, it is the death\'s end (6c)', () => {
    expect(ended('gotlauncheddowned', (p) => { p.setHP(0); }).healthBarVisible).toBe(false);
    expect(ended('gotlauncheddowned', (p) => { p.world.redFreeze = true; }).healthBarVisible).toBe(false);
    const p = struck();
    p.dead = true;
    p.actionState = OG_STATE.DOWNED;
    expect([p.clipEnded('gotlauncheddowned'), p.ttl, p.actionState, p.animation]).toEqual([true, 95, OG_STATE.DOWNED, 'idle']);
  });

  it('GOTLAUNCHEDDOWNEDEND: DOWNEDUP2; DOWNEDUP and DOWNEDUP2: the bar back at x 0 and shown, 120 px back, IDLE', () => {
    expect(ended('gotlauncheddownedend').animation).toBe('downedup2');
    for (const clip of ['downedup', 'downedup2']) {
      const p = ended(clip, (q) => { q.moveHealthBarX(-100); q.actionState = OG_STATE.DOWNED; q.startAnim(clip); });
      expect([p.healthBarX, p.healthBarVisible, p.posX, p.actionState, p.animation]).toEqual([0, true, 280, OG_STATE.IDLE, 'idle']);
      expect(ended(clip, (q) => { q.faceLeft(); }).posX).toBe(520);
    }
  });

  it('FLIPUP: the bar shown (not in the red freeze) at x 0, then IDLE', () => {
    const p = ended('flipupfromdowned', (q) => { q.moveHealthBarX(-100); q.actionState = OG_STATE.KNOCKDOWNED; q.startAnim('flipupfromdowned'); });
    expect([p.healthBarVisible, p.healthBarX, p.actionState, p.animation, p.posX]).toEqual([true, 0, OG_STATE.IDLE, 'idle', 400]);
    expect(ended('flipupfromdowned', (q) => { q.world.redFreeze = true; }).healthBarVisible).toBe(false);
  });
});

describe('slice 6b: the launch and the getup, through checkHitObject and the real update', () => {
  const run = (p: MCSPlayer, f: ReturnType<typeof framed>, n: number, rows: string[], ys: number[] = []) => {
    let last = `${stateName(p.actionState)} ${p.animation}`;
    f.run(n, (k) => {
      ys.push(p.y);
      const now = `${stateName(p.actionState)} ${p.animation}`;
      if (now !== last) rows.push(`${k} ${now} ${p.y}`);
      last = now;
    });
  };

  it('an AIR hit: rise, peak, fall at gravity 3, DOWNED, the long getup, DOWNEDUP2, IDLE 120 px back', () => {
    const p = struck([OG_PART.torso], body2(), NO_DRAW, new OgAnimLibrary());
    const f = framed(p);
    f.run(1);
    expect(p.checkHitObject(WEAPON, blow(100, OG_LAUNCH.LAUNCH_AIR, HEAVY))).toBe(true);
    const rows: string[] = [];
    const ys: number[] = [];
    run(p, f, 86, rows, ys);
    expect(rows).toEqual([
      '9 GOTLAUNCHED gotlaunchedupwards_partb 242', '18 GOTLAUNCHED gotlaunchedupwards_partc 341',
      '19 DOWNED gotlauncheddowned 358', '37 DOWNED gotlauncheddownedend 358', '62 DOWNED downedup2 358',
      '87 IDLE idle 358',
    ]);
    expect(ys.slice(0, 18)).toEqual([333, 311, 292, 276, 263, 253, 246, 242, 241, 243, 248, 256, 267, 281, 298, 318, 341, 358]);
    expect([p.getHP(), p.posX, p.juggleCount, p.healthBarVisible, p.healthBarX]).toEqual([546, 226, 0, true, 0]);
    expect(f.ai).toEqual([1, 13, 25, 37, 49, 61, 73, 85]);
  });

  it('a knockdown: a body that can flip up flips (DUAL), one that cannot takes DOWNEDUP2 (HEAVY)', () => {
    const p = struck([OG_PART.torso], body2(), NO_DRAW, new OgAnimLibrary());
    p.setStance(DUAL);
    const f = framed(p);
    f.run(1);
    p.checkHitObject(WEAPON, blow(100, OG_LAUNCH.LAUNCH_KNOCKDOWN));
    const rows: string[] = [];
    run(p, f, 39, rows);
    expect(rows).toEqual(['19 KNOCKDOWNED flipupfromdowned 358', '40 IDLE idle 358']);
    expect([p.getHP(), p.posX, p.healthBarVisible, p.healthBarX]).toEqual([561, 400, true, 0]);

    const q = struck([OG_PART.torso], body2(), NO_DRAW, new OgAnimLibrary());
    const g = framed(q);
    g.run(1);
    q.checkHitObject(WEAPON, blow(100, OG_LAUNCH.LAUNCH_KNOCKDOWN));
    const qrows: string[] = [];
    run(q, g, 43, qrows);
    expect(qrows).toEqual(['19 KNOCKDOWNED downedup2 358', '44 IDLE idle 358']);
    expect(q.posX).toBe(280);
  });

  it('the juggle: a second and a third launch in the air, the fourth skipped for a HEAVY attacker; the landing resets the count', () => {
    const p = struck([OG_PART.torso], body2(), NO_DRAW, new OgAnimLibrary());
    const f = framed(p);
    f.run(1);
    const rows: string[] = [];
    const air = () => p.checkHitObject(WEAPON, blow(100, OG_LAUNCH.LAUNCH_AIR, HEAVY));
    const hits: Array<[boolean, number, number, number]> = [];
    const hit = () => {
      hits.push([air(), p.juggleCount, p.velY, p.y]);
      rows.push(`hit ${stateName(p.actionState)} ${p.animation} ${p.y}`);
    };
    hit();
    run(p, f, 12, rows);
    hit();
    run(p, f, 12, rows);
    hit();
    run(p, f, 12, rows);
    hit();
    run(p, f, 8, rows);
    expect(hits).toEqual([[true, 1, -25, 358], [true, 2, -20, 256], [true, 3, -20, 214], [true, 3, 16, 172]]);
    expect(rows).toEqual([
      'hit GOTLAUNCHED gotlaunchedupwards_parta 358', '9 GOTLAUNCHED gotlaunchedupwards_partb 242',
      'hit GOTLAUNCHED gotlaunchedupwards_parta 256', '19 GOTLAUNCHED gotlaunchedupwards_partb 181',
      'hit GOTLAUNCHED gotlaunchedupwards_parta 214', '31 GOTLAUNCHED gotlaunchedupwards_partb 139',
      'hit GOTLAUNCHED gotlaunchedupwards_partb 172', '40 GOTLAUNCHED gotlaunchedupwards_partc 229',
      '45 DOWNED gotlauncheddowned 358',
    ]);
    expect([p.getHP(), p.juggleCount, p.posX]).toEqual([414, 0, 340]);
  });
});

/*
 * L5-OPP SLICE 6c — THE BLOW, THE DEATH AND THE REWARD. `gotHit` whole (web `§1t99s0§.as:3661-3941`,
 * Android `MCSPlayer.as:3580-3837`), the web `Damage` cancel-launch (`§1t67s0§.as:97-104`), `die`
 * (`:4057` / `:3952`), `EnemyPlayer`'s `gotDeathTouch`, `createLoot` and `rewardXP`, the clip-end
 * death group and `doAction` DYING. Every expected number was worked by hand from the web source.
 */

/** A scripted `Math.random`: throws past its last draw, so a test names every draw it expects. */
function drawn(values: readonly number[]): Rng {
  let i = 0;
  return () => {
    const v = values[i];
    if (v === undefined) throw new Error(`drew a random number past the script (${values.length})`);
    i += 1;
    return v;
  };
}

describe('slice 6c: the web Damage cancel-launch (`§1t67s0§.as:97-104`)', () => {
  it('an AIR packet becomes NONE; every other launch type is left as it is', () => {
    const after = Object.values(OG_LAUNCH).map((l) => {
      const d = new NpcDamage(10, 1, l);
      d.cancelLaunch();
      return [l, d.launchType];
    });
    expect(after).toEqual(Object.values(OG_LAUNCH).map((l) => [l, l === OG_LAUNCH.LAUNCH_AIR ? OG_LAUNCH.LAUNCH_NONE : l]));
  });
});

describe('slice 6c: gotHit — the guards and the evades (WEB: 75 / 85 / 95, the Focus evade, both SILENT here)', () => {
  it('the hit guard and SKILL_UNDYING refuse: false, nothing changes', () => {
    const guarded = struck();
    guarded.gotHitCounter = 3;
    const undying = struck();
    undying.actionState = OG_STATE.SKILL_UNDYING;
    for (const p of [guarded, undying]) {
      expect([p.gotHit(OG_PART.torso, blow(100)), p.getHP(), p.events]).toEqual([false, 590, []]);
    }
  });

  it('no self-hit guard and no transition test here (both are checkHitObject\'s): the body\'s own packet lands', () => {
    const p = struck();
    p.world.transitioning = true;
    const d = new NpcDamage(100, 45);
    d.setAttacker(p);
    expect([p.gotHit(OG_PART.torso, d), p.getHP()]).toEqual([true, 546]);
  });

  it('the roll: 75 / 85 / 95 at levels 1 / 2 / 3+, guard 12, NO sound (checkHitObject\'s plays Snd_jump)', () => {
    const rolled = (level: number, draw: number) => {
      const p = struck([OG_PART.torso], body2(), () => draw);
      p.actionState = OG_STATE.FORWARDROLL;
      p.skillList = [{ id: 1004, value: level }];
      return [p.gotHit(OG_PART.torso, blow(100)), p.getHP(), p.gotHitCounter, p.events];
    };
    expect(rolled(1, 0.74)).toEqual([true, 590, 12, []]);
    expect(rolled(1, 0.75)[1]).toBe(546);
    expect(rolled(2, 0.84)[1]).toBe(590);
    expect(rolled(2, 0.85)[1]).toBe(546);
    expect(rolled(3, 0.94)[1]).toBe(590);
    expect(rolled(5, 0.94)[1]).toBe(590);
    expect(rolled(5, 0.95)[1]).toBe(546);
  });

  it('the full-Focus evade: slashing on a full bar with the stance\'s 1076 (heavy): guard 12, no sound, no damage', () => {
    const p = struck();
    p.actionState = OG_STATE.SLASH;
    p.reload = p.maxreload;
    p.skillList = [{ id: 1076, value: 1 }];
    expect([p.gotHit(OG_PART.torso, blow(100)), p.getHP(), p.gotHitCounter, p.events]).toEqual([true, 590, 12, []]);
  });

  it('the log substitution goes through doSubstitutionLog on the AI (slice 7): loud', () => {
    const p = struck();
    p.logsubCounter = 3;
    expect(() => p.gotHit(OG_PART.torso, blow(100))).toThrow('unported: MCSPlayer.doSubstitutionLog');
  });

  it('the stun clears on every call past the evades, even on a body already at 0 HP (which then returns false)', () => {
    const p = struck();
    p.setHP(0);
    p.stunCounter = 7;
    expect([p.gotHit(OG_PART.torso, blow(100)), p.stunCounter, p.getHP(), p.events]).toEqual([false, 0, 0, []]);
  });

  it('a charging FX is removed BEFORE the damage unless the body charges chi and the hit does not launch', () => {
    const fx = {};
    const charging = struck();
    charging.chargingFx = fx;
    charging.actionState = OG_STATE.SKILL_CHICHARGE;
    expect([charging.gotHit(OG_PART.torso, blow(100)), charging.getHP()]).toEqual([true, 546]);
    const q = struck();
    q.chargingFx = fx;
    expect(() => q.gotHit(OG_PART.torso, blow(100))).toThrow('unported: Projectile.removeProjectile');
    expect(q.getHP()).toBe(590);
    const launched = struck();
    launched.chargingFx = fx;
    launched.actionState = OG_STATE.SKILL_CHICHARGE;
    expect(() => launched.gotHit(OG_PART.torso, blow(100, OG_LAUNCH.LAUNCH_AIR))).toThrow('unported: Projectile.removeProjectile');
    expect(launched.getHP()).toBe(590);
  });
});

describe('slice 6c: gotHit — the blow (WEB: the triangle\'s × 0.9, the head × 1.3)', () => {
  it('fixture 2 (heavy): 100 − 56 = 44; the elements as checkHitObject\'s; the texts in the source\'s order', () => {
    const p = struck();
    const d = new NpcDamage(100, 45, OG_LAUNCH.LAUNCH_NONE, -1, 15, 3, 12, 20);
    expect(p.gotHit(OG_PART.torso, d)).toBe(true);
    expect([p.getHP(), p.gotHitCounter, p.healthBarFraction, d.victimPosX, p.behead, p.gotHitFlag])
      .toEqual([521, 12, 521 / 590, 400, false, true]);
    expect(p.events).toEqual([
      { type: 'sound', name: 'hit' },
      { type: 'floatingText', x: 400, y: 258, text: '44', colour: 10027008 },
      { type: 'floatingText', x: 400, y: 258, text: '5', colour: 16737792 },
      { type: 'floatingText', x: 400, y: 258, text: '4', colour: 13421772 },
      { type: 'floatingText', x: 400, y: 258, text: '1', colour: 26367 },
      { type: 'floatingText', x: 400, y: 258, text: '15', colour: 6697728 },
    ]);
  });

  it('the stance triangle on the ATTACKER\'s stance: heavy struck by light × 1.2 (120 − 56), by balanced × 0.9 (90 − 56)', () => {
    const took = (stance: number, bodyStance = HEAVY) => {
      const p = struck();
      p.stance = bodyStance;
      p.gotHit(OG_PART.torso, blow(100, OG_LAUNCH.LAUNCH_NONE, stance));
      return 590 - p.getHP();
    };
    expect([took(LIGHT), took(BALANCED), took(HEAVY), took(-1)]).toEqual([64, 34, 44, 44]);
    // balanced beats light, heavy beats balanced, light beats heavy: × 1.2 from the stance a body
    // loses to, × 0.9 from the one it beats; dual and reversed are outside the triangle
    expect([took(BALANCED, LIGHT), took(HEAVY, LIGHT), took(HEAVY, BALANCED), took(LIGHT, BALANCED)])
      .toEqual([120 - 71, 90 - 71, 120 - 71, 90 - 71]);
    expect([took(LIGHT, DUAL), took(BALANCED, REVERSED)]).toEqual([100 - 71, 100 - 71]);
  });

  it('a head, hat or neck hit × 1.3 after the defence (Android × 1.5): int(44 × 1.3) = 57; the weapon is an ordinary part here', () => {
    for (const part of [OG_PART.head, OG_PART.hat, OG_PART.neck]) {
      const p = struck();
      p.gotHit(part, blow(100));
      expect([part, p.getHP(), p.behead]).toEqual([part, 590 - 57, false]);
    }
    const w = struck();
    expect([w.gotHit(OG_PART.weapon, blow(100)), w.getHP()]).toEqual([true, 546]);
    const both = struck();
    both.gotHit(OG_PART.head, blow(100, OG_LAUNCH.LAUNCH_NONE, LIGHT));
    expect(both.getHP()).toBe(590 - 83);
  });

  it('the floor is the attacker\'s: 20 − 56 → int(45 / 4) = 11; × 1.3 on a head hit comes after it (14)', () => {
    const p = struck();
    p.gotHit(OG_PART.torso, blow(20));
    const h = struck();
    h.gotHit(OG_PART.head, blow(20));
    expect([590 - p.getHP(), 590 - h.getHP()]).toEqual([11, 14]);
  });

  it('a killing blow: HP 0, true, no reaction, no text, no death here; a head kill keeps behead, any other part clears it (WEB)', () => {
    const p = struck();
    p.setHP(40);
    expect([p.gotHit(OG_PART.head, blow(100)), p.getHP(), p.behead, p.actionState, p.dead, p.target === null])
      .toEqual([true, 0, true, OG_STATE.IDLE, false, false]);
    expect(p.events).toEqual([{ type: 'sound', name: 'hit' }]);
    const q = struck();
    q.setHP(40);
    q.behead = true;
    q.gotHit(OG_PART.torso, blow(100));
    expect([q.getHP(), q.behead]).toEqual([0, false]);
  });
});

describe('slice 6c: gotHit — the reaction (WEB: a downed or capped body turns the AIR packet into NONE)', () => {
  const reacting = (launch: number, setUp: (p: MCSPlayer) => void = () => undefined, stance = -1) => {
    const p = struck();
    setUp(p);
    const d = blow(100, launch, stance);
    return { p, d, got: () => p.gotHit(OG_PART.torso, d) };
  };

  it('a plain hit flinches; a downed body is not flinched, and its AIR packet leaves as NONE', () => {
    const plain = reacting(OG_LAUNCH.LAUNCH_NONE);
    expect([plain.got(), plain.p.actionState]).toEqual([true, OG_STATE.FLINCH]);
    const down = reacting(OG_LAUNCH.LAUNCH_AIR, (q) => { q.actionState = OG_STATE.KNOCKDOWNED; });
    expect([down.got(), down.p.actionState, down.d.launchType, down.p.getHP()])
      .toEqual([true, OG_STATE.KNOCKDOWNED, OG_LAUNCH.LAUNCH_NONE, 546]);
  });

  it('the juggle cap: a non-LIGHT packet at 3, a LIGHT one at 5, cancels the launch (the packet leaves as NONE), no flinch', () => {
    const capped = reacting(OG_LAUNCH.LAUNCH_AIR, (q) => { q.juggleCount = 3; }, HEAVY);
    expect([capped.got(), capped.p.actionState, capped.p.juggleCount, capped.d.launchType, capped.p.getHP()])
      .toEqual([true, OG_STATE.IDLE, 3, OG_LAUNCH.LAUNCH_NONE, 546]);
    const light = reacting(OG_LAUNCH.LAUNCH_AIR, (q) => { q.juggleCount = 5; }, LIGHT);
    expect([light.got(), light.p.actionState, light.d.launchType]).toEqual([true, OG_STATE.IDLE, OG_LAUNCH.LAUNCH_NONE]);
    const under = (n: number, stance: number) => {
      const r = reacting(OG_LAUNCH.LAUNCH_AIR, (q) => { q.juggleCount = n; }, stance);
      r.got();
      return [r.p.actionState, r.p.juggleCount, r.d.launchType];
    };
    expect(under(2, HEAVY)).toEqual([OG_STATE.GOTLAUNCHED, 3, OG_LAUNCH.LAUNCH_AIR]);
    expect(under(4, LIGHT)).toEqual([OG_STATE.GOTLAUNCHED, 5, OG_LAUNCH.LAUNCH_AIR]);
  });

  it('a body in the air (GOTLAUNCHED, FALL, JUMP) is launched again by a plain hit; the launch writes the facing first', () => {
    for (const s of [OG_STATE.GOTLAUNCHED, OG_STATE.FALL, OG_STATE.JUMP]) {
      const r = reacting(OG_LAUNCH.LAUNCH_NONE, (q) => { q.actionState = s; });
      expect([r.got(), r.p.actionState, r.p.velY, r.p.juggleCount, r.d.flyVelX]).toEqual([true, OG_STATE.GOTLAUNCHED, -20, 1, 1]);
    }
    const left = reacting(OG_LAUNCH.LAUNCH_AIR, (q) => { q.faceLeft(); });
    left.got();
    expect([left.p.actionState, left.d.flyVelX]).toEqual([OG_STATE.GOTLAUNCHED, 0]);
  });

  it('the knockdown writes the facing and knocks down; fly and stun go to their reactions', () => {
    const kd = reacting(OG_LAUNCH.LAUNCH_KNOCKDOWN);
    expect([kd.got(), kd.p.actionState, kd.d.flyVelX]).toEqual([true, OG_STATE.KNOCKDOWNED, 1]);
    const fly = reacting(OG_LAUNCH.LAUNCH_FLY, (q) => { q.faceLeft(); });
    fly.d.setFlyVel(-30, -12);
    expect([fly.got(), fly.p.actionState, fly.p.velX, fly.p.velY]).toEqual([true, OG_STATE.FLY, -30, -12]);
    const stun = reacting(OG_LAUNCH.STUN);
    stun.d.setStunTime(30);
    expect([stun.got(), stun.p.actionState, stun.p.stunCounter]).toEqual([true, OG_STATE.STUN, 30]);
  });

  it('gotHit has no knee groin or back throw (both builds; checkHitObject\'s own): those packets flinch, and cost no chi', () => {
    for (const launch of [OG_LAUNCH.KNEEGROIN, OG_LAUNCH.BACKTHROW]) {
      const r = reacting(launch);
      const groin = vi.spyOn(r.p, 'gotKneeGroin');
      const back = vi.spyOn(r.p, 'gotBackThrow');
      r.d.setFlyVel(310, 350);
      expect([r.got(), r.p.actionState, r.p.getChi(), groin.mock.calls.length, back.mock.calls.length])
        .toEqual([true, OG_STATE.FLINCH, 40, 0, 0]);
    }
  });

  it('a fly-away goes away from the struck PART\'s x (an int), then hands the packet the body\'s velocity as a FLY', () => {
    const p = new MCSPlayer(world(false), anims, { ...touching([OG_PART.torso]), partX: () => 400.9 }, NO_DRAW, body2());
    p.setStance(HEAVY);
    p.world.peaceful = false;
    p.setPosition(400.2, GROUND);
    p.startAction(OG_STATE.IDLE);
    const away = vi.spyOn(p, 'gotFlyAway');
    const d = blow(100, OG_LAUNCH.LAUNCH_FLYAWAY);
    p.gotHit(OG_PART.torso, d);
    expect(away.mock.calls).toEqual([[400, GROUND]]);
    expect([d.launchType, d.flyVelX, d.flyVelY]).toEqual([OG_LAUNCH.LAUNCH_FLY, p.velX, p.velY]);
  });

  it('a death touch lands AFTER the reaction chain, with the packet\'s fly velocity', () => {
    const r = reacting(OG_LAUNCH.DEATHTOUCH);
    const states: Array<[string, number, number]> = [];
    vi.spyOn(r.p, 'gotDeathTouch').mockImplementation((x: number, y: number) => {
      states.push([stateName(r.p.actionState) ?? '', x, y]);
    });
    r.d.setFlyVel(7, -9);
    r.got();
    expect(states).toEqual([['FLINCH', 7, -9]]);
  });
});

describe('slice 6c: EnemyPlayer.gotDeathTouch — a 500 packet through gotHit, then the fly, then chi 0 (the same on the AI)', () => {
  it('the guard is cleared first, so it lands inside a hit: a flat 500 (a level-0 packet\'s floor is its damage), chi 0, guard 12', () => {
    const p = struck();
    p.gotHitCounter = 12;
    p.gotDeathTouch(0, 0);
    expect([p.getHP(), p.getChi(), p.gotHitCounter, p.actionState]).toEqual([90, 0, 12, OG_STATE.FLINCH]);
    expect(p.events).toEqual([
      { type: 'sound', name: 'hit' },
      { type: 'floatingText', x: 400, y: 258, text: '500', colour: 10027008 },
    ]);
  });

  it('a fly velocity flies the body after the blow; none, no fly', () => {
    const p = struck();
    p.gotDeathTouch(30, -12);
    expect([p.actionState, p.animation, p.velX, p.velY, p.isFacingRight()]).toEqual([OG_STATE.FLY, 'fly_start', 30, -12, false]);
  });

  it('a killing touch with a fly velocity dies inside gotFly (NPC.gotFly\'s HP test): the only die on the AI\'s reception path', () => {
    const p = struck([OG_PART.torso], body2(), drawn([0.5, 0.9, 0.5]));
    p.setHP(400);
    p.gotDeathTouch(30, -12);
    expect([p.getHP(), p.dead, p.actionState, p.animation, p.getChi()]).toEqual([0, true, OG_STATE.DYING, 'defeatedanimationv2', 0]);
    const still = struck();
    still.setHP(400);
    still.gotDeathTouch(0, 0);
    expect([still.getHP(), still.dead, still.actionState]).toEqual([0, false, OG_STATE.IDLE]);
  });

  it('through checkHitObject: 44, then the touch\'s 500 (its own text first), chi 0', () => {
    const p = struck();
    expect(p.checkHitObject(WEAPON, blow(100, OG_LAUNCH.DEATHTOUCH))).toBe(true);
    expect([p.getHP(), p.getChi()]).toEqual([46, 0]);
    expect(p.events.flatMap((e) => (e.type === 'floatingText' ? [e.text] : [e.type]))).toEqual(['sound', 'sound', '500', '44']);
  });
});

describe('slice 6c: die, createLoot, rewardXP (EnemyPlayer\'s, the duellist\'s branch)', () => {
  it('the constructor carries the body\'s xp (EnemyPlayer.init: level × 5 + 45)', () => {
    expect([player(body1()).xp, player(body2()).xp]).toEqual([50, 270]);
  });

  it('die removes a charging FX first (slice 7\'s, loud), before anything else', () => {
    const p = struck();
    p.chargingFx = {};
    p.setHP(0);
    expect(() => { p.die(); }).toThrow('unported: Projectile.removeProjectile');
    expect([p.dead, p.events]).toEqual([false, []]);
  });

  it('createLoot: a random item at the body\'s level (the dialog rolls its own 1 in 2), then coins: at level ≤ 10 always', () => {
    const p = player(body1(), false, drawn([0.99]));
    p.createLoot();
    expect(p.events).toEqual([
      { type: 'loot', kind: 'randomItemChance', amount: 1, itemId: null, level: 1 },
      { type: 'loot', kind: 'coins', amount: 0, itemId: null, level: 1 },
    ]);
  });

  it('createLoot above level 10: coins 1 in 3 (int(random × 3) == 0), then int(random × level)', () => {
    const lucky = player(body2(), false, drawn([0.33, 0.5]));
    lucky.createLoot();
    expect(lucky.events).toEqual([
      { type: 'loot', kind: 'randomItemChance', amount: 1, itemId: null, level: 45 },
      { type: 'loot', kind: 'coins', amount: 22, itemId: null, level: 45 },
    ]);
    const not = player(body2(), false, drawn([0.34]));
    not.createLoot();
    expect(not.events).toEqual([{ type: 'loot', kind: 'randomItemChance', amount: 1, itemId: null, level: 45 }]);
    const coins = (level: number) => {
      const p = player(body2(), false, drawn([0.5]));
      p.level = level;
      p.createLoot();
      return p.events.flatMap((e) => (e.type === 'loot' && e.kind === 'coins' ? [e.amount] : []));
    };
    expect([coins(10), coins(11)]).toEqual([[5], []]);
  });

  it('createLoot: a friendly body drops nothing (WEB), and draws nothing', () => {
    const p = player(body2());
    p.isFriendly = true;
    p.createLoot();
    expect(p.events).toEqual([]);
  });

  it('rewardXP: a player under level 10 gets calcXP × 3, from 10 up calcXP as elite (× 2)', () => {
    const xp = (playerLevel: number) => {
      const p = player(body2());
      p.level = 11;
      p.xp = 100;
      p.world.playerLevel = playerLevel;
      p.rewardXP();
      return p.events;
    };
    expect(xp(9)).toEqual([{ type: 'xp', amount: 330 }]);
    expect(xp(10)).toEqual([{ type: 'xp', amount: 210 }]);
    const low = player(body1());
    low.world.playerLevel = 1;
    low.rewardXP();
    expect(low.events).toEqual([{ type: 'xp', amount: 150 }]);
  });
});

describe('slice 6c: the death\'s clip ends and doAction DYING (the same in both builds but the web\'s return)', () => {
  const DEATH_CLIPS = [
    'defeatedanimationv1', 'deathenemy', 'death', 'defeatedanimationv2', 'deathnohead',
    'deathnohand', 'deathdowned', 'deathinhalf', 'seppuku_end', 'seppuku_nohead',
  ];

  it('each of the ten death clips ends in deathAnimEnd: the ttl counts down one (NPC\'s, the duellist\'s own on the AI)', () => {
    for (const clip of DEATH_CLIPS) {
      const p = struck();
      p.actionState = OG_STATE.DYING;
      expect([clip, p.clipEnded(clip), p.ttl, p.actionState]).toEqual([clip, true, 95, OG_STATE.DYING]);
    }
  });

  it('doAction DYING is doDying: one off the ttl a frame, none in the red freeze', () => {
    const p = struck();
    p.actionState = OG_STATE.DYING;
    p.doAction();
    p.doAction();
    const frozen = struck();
    frozen.actionState = OG_STATE.DYING;
    frozen.world.redFreeze = true;
    frozen.doAction();
    expect([p.ttl, frozen.ttl]).toEqual([94, 96]);
  });
});

describe('slice 6c: the blow, the death and the reward, through checkHitObject, checkDie and the real update', () => {
  it('a killing hit, then checkDie (the seam\'s): the reward, DYING, the 29-frame death clip, the fade over 12, gone at 95', () => {
    const p = struck([OG_PART.torso], body2(), drawn([0.2, 0.5, 0.9, 0.1]), new OgAnimLibrary());
    p.world.playerLevel = 44;
    const f = framed(p);
    f.run(1);
    p.setHP(40);
    expect([p.checkHitObject(WEAPON, blow(100)), p.getHP(), p.target, p.dead]).toEqual([true, 0, null, false]);
    const before = p.events.length;
    expect(p.checkDie()).toBe(true);
    expect(p.events.slice(before)).toEqual([
      { type: 'sound', name: 'die' },
      { type: 'loot', kind: 'randomItemChance', amount: 1, itemId: null, level: 45 },
      { type: 'loot', kind: 'coins', amount: 22, itemId: null, level: 45 },
      { type: 'xp', amount: 566 },
      { type: 'death', anim: 'deathenemy', behead: false, downed: false, dice: 0 },
    ]);
    expect([p.dead, p.actionState, p.animation, p.healthBarVisible, p.ttl]).toEqual([true, OG_STATE.DYING, 'deathenemy', false, 96]);
    const ttl: number[] = [];
    const seen: string[] = [];
    f.run(100, (k) => {
      ttl.push(p.ttl);
      const row = `${stateName(p.actionState)} ${p.animation} ${p.alpha.toFixed(3)} ${p.visible} ${p.disposed}`;
      if (seen.at(-1)?.split(': ')[1] !== row) seen.push(`${k}: ${row}`);
    });
    // One a frame from DYING (doDying), two on the frame the clip ends (29: deathAnimEnd, then the
    // web's update goes on into doAction), so 95 − k from there; alpha from ttl 11 (frame 84).
    expect([ttl[27], ttl[28], ttl[82], ttl[83], ttl[93], ttl[94], ttl[99]]).toEqual([68, 66, 12, 11, 1, 0, 0]);
    expect(seen).toEqual([
      '2: DYING deathenemy 1.000 true false',
      '85: DYING deathenemy 0.917 true false', '86: DYING deathenemy 0.833 true false',
      '87: DYING deathenemy 0.750 true false', '88: DYING deathenemy 0.667 true false',
      '89: DYING deathenemy 0.583 true false', '90: DYING deathenemy 0.500 true false',
      '91: DYING deathenemy 0.417 true false', '92: DYING deathenemy 0.333 true false',
      '93: DYING deathenemy 0.250 true false', '94: DYING deathenemy 0.167 true false',
      '95: DYING deathenemy 0.083 true false', '96: DYING deathenemy 0.000 false true',
    ]);
    expect(f.ai).toEqual([1]);
  });

  it('a killing blow in the air: die only marks it dead; it flies on, lands, and GOTLAUNCHEDDOWNED\'s end is its one tick', () => {
    const p = struck([OG_PART.torso], body2(), () => 0.5, new OgAnimLibrary());
    p.setHP(50);
    const f = framed(p);
    f.run(1);
    expect(p.checkHitObject(WEAPON, blow(100, OG_LAUNCH.LAUNCH_AIR))).toBe(true);
    const rows: string[] = [];
    let last = '';
    const watch = (k: number) => {
      const now = `${stateName(p.actionState)} ${p.animation}`;
      if (now !== last) rows.push(`${k} ${now} ${p.y}`);
      last = now;
    };
    f.run(12, watch);
    expect([p.checkHitObject(WEAPON, blow(100, OG_LAUNCH.LAUNCH_AIR)), p.getHP(), p.juggleCount]).toEqual([true, 0, 1]);
    const before = p.events.length;
    expect(p.checkDie()).toBe(true);
    expect(p.events.slice(before)).toEqual([
      { type: 'sound', name: 'die' },
      { type: 'loot', kind: 'randomItemChance', amount: 1, itemId: null, level: 45 },
      { type: 'xp', amount: 0 },
    ]);
    expect([p.dead, p.actionState]).toEqual([true, OG_STATE.GOTLAUNCHED]);
    rows.length = 0;
    const ttl: number[] = [];
    f.run(187, (k) => {
      watch(k);
      ttl.push(p.ttl);
    });
    expect(rows).toEqual(['18 GOTLAUNCHED gotlaunchedupwards_partc 341', '19 DOWNED gotlauncheddowned 358']);
    // SOURCE QUIRK (both builds): a clip ends once, and DOWNED has no doAction, so the body the
    // blow killed in the air lies where it fell, 95, never fading (the duel's red freeze ends it).
    expect([ttl[22], ttl[23], ttl.at(-1), p.alpha, p.visible, p.disposed]).toEqual([96, 95, 95, 1, true, false]);
    expect(f.ai).toEqual([1, 13]);
  });
});

/*
 * L5-OPP SLICE 7a — THE BRAIN. `EnemyPlayer.AI` (Android `EnemyPlayer.as:990`, web
 * `§1t122s0§.as:1040`), `isUnderSlash`, `doEvade`, `hasSkill`, `canUseSkill` (WEB: its chi test),
 * `getUsableSkills`, `doSkill`, `update`'s cooldown tick, `init`'s cooldown table, `getDamage` /
 * `getBaseDamage` (a boss's), `SkillManager.startSkill`'s preamble and tail with ONE unported
 * catch-all for the arms, `getChargingTime`, `cancelChargingTime`, `canSmokeAway`. Where the
 * builds differ the WEB wins (R6): the no-target wander, the chi test, the cooldown's `/ 600`.
 *
 * THE TWO END-TO-END RUNS, worked by hand from the source BEFORE the code (the AI runs on frames
 * 1, 13, 25, 37, 49; `reload` reads k − 1 at frame k's AI and gains 1 after `doAction`).
 *
 * RUN 1 — fixture 1 with only its three passive stances (no usable skill), level 1, balanced,
 * reach 126, at x 400 on the ground; the target stands at 500 facing right. Draws, in order:
 *   F1  skip 0.1 (0.5 < 1): the level-≤3 skip, nothing else.                         [1 draw]
 *   F13 skip 0.5; skill die int(0.5 × 4) = 2; reload 12 < 24 → doReload int(24 + 0.125 × 168)
 *       = 45; no STEALTH → moveTo(int(0.53125 × 800) = 425): |400 − 425|² = 625 ≤ 10000, WALK
 *       at 4: 404 … 424 (F18), F19 the last 1 px → 425, IDLE.                       [4 draws]
 *   F25 skip 0.5; skill die int(0.1 × 4) = 0 → faceTarget (right), getUsableSkills(75) = [];
 *       reload 24 < 45 → no FOCUS → IDLE → moveTo(0.5 × 800 = 400): WALK left, 421 … 405 (F29),
 *       401 (F30), 400 IDLE (F31).                                                  [3 draws]
 *   F37 skip 0.5; die 2; reload 36 < 45 → IDLE → moveTo(425): 404 … 424, 425 IDLE (F43). [3]
 *   F49 skip 0.5; die 2; reload 48 ≥ 45 and ≥ 24 → the stroke: launch die int(0.5 × 3) = 1 →
 *       slashTarget: the target is right and faces right, so the stroke starts `near` = 42 short:
 *       (458, 318), 6 points of (+20, −2). |458 − 425| = 33 < 50 → SLASH where it stands,
 *       facing right; startSlash draws getDamage's 0.5; doReload = 0. doSlash moves 40: 465.  [4]
 *   15 draws in all; reload 49 at F49's end.
 *
 * RUN 2 — fixture 2 (level 45, heavy, reach 112) whose only active skill, SMOKEBOMB 1, is still on
 * its init cooldown (6 s × 24 × 1 = 144, the human's speed 0), at x 400; the target at 700. The
 * human's slash (100, 300), (410, 300), (420, 300) covers the body at its second point.
 *   F1  no skip draw (level 45); the evade die int(0.5 × 3) = 1 ≤ 1; isUnderSlash asks the clip
 *       twice (100, then 410: a hit) → doEvade: ROLL, JUMP, DASHLEFT, DASHRIGHT unowned,
 *       SMOKEBOMB on cooldown → the fallback: die int(0.5 × 4) = 2 → the flat stroke from
 *       (400, 358 − 50 = 308), away from the target (400 < 700: −20), 5 points. |400 − 400| < 50:
 *       SLASH where it stands; the aim point (340, 308) is left → faces left; getDamage draws
 *       0.5; doSlash moves 30 left: 370. The cooldown ticks 144 → 143.              [3 draws]
 */
const SMOKEBOMB = OG_SKILL.SMOKEBOMB;
const stancesOnly = [{ id: 1000, value: 1 }, { id: 1001, value: 1 }, { id: 1002, value: 1 }];
const SLASH_OVER_BODY: readonly MovePoint[] = [{ x: 100, y: 300 }, { x: 410, y: 300 }, { x: 420, y: 300 }];

/** A body out of the switches' reach (as `idleBody`), with the given skills and world facts. */
function brain(b: DuellistBody, rng: Rng, w: Partial<PlayerWorld> = {}, lib: AnimLibrary = anims, geo: HitGeometry = geometry): MCSPlayer {
  const wo = { ...world(false), ...w, peaceful: false };
  const p = new MCSPlayer(wo, lib, geo, rng, b);
  p.setStance(b.stance);
  p.setPosition(BODY_X, GROUND);
  p.actionState = OG_STATE.IDLE;
  p.changeTarget(foe(700, GROUND, true));
  return p;
}
const allUsable = (p: MCSPlayer) => {
  for (const id of p.cooldownArray.keys()) p.cooldownArray.set(id, 0);
};
/** Every skill id the four lists name, at level 1: a profile that owns them all. */
const everySkill = () => [...new Set(Object.values(OG_AI_SKILL_LISTS).flat())].map((id) => ({ id, value: 1 }));

describe('slice 7a: XMLSkill.getCooldown / getChiCost and the cooldown scale (WEB: / 600, capped at 600)', () => {
  const skill = (id: number) => {
    const s = skillData(id);
    if (s === null) throw new Error(`no skill ${id}`);
    return s;
  };

  it('seconds × 24 into an int, then × the scale into an int; past the last row, the last row', () => {
    expect(getCooldown(skill(1003), 1, 1)).toBe(48); // jump: 2 s
    expect(getCooldown(skill(1004), 2, 1)).toBe(84); // roll: 3.5 s → 84
    expect(getCooldown(skill(1004), 5, 1)).toBe(72); // past its 3 rows: the last, 3 s
    expect(getCooldown(skill(1003), 1, 0.75)).toBe(36);
  });

  it('the passive test comes first: a passive row WITH seconds still cools down in 0 (no shipped row has both)', () => {
    const passive = { id: 1, category: 0, passive: true, levels: [{ value: 1, cooldownS: 5 }] };
    expect([getCooldown(passive, 1, 1), getCooldown({ ...passive, passive: false }, 1, 1)]).toEqual([0, 120]);
  });

  it('a passive skill and level 0 cool down in 0; an absent id has no data (`getSkillData` → null)', () => {
    expect([getCooldown(skill(1000), 1, 1), getCooldown(skill(1004), 0, 1)]).toEqual([0, 0]);
    expect(skillData(1077)).toBeNull(); // the web's arm: no Android data row
  });

  it('getChiCost: the level\'s chi, 0 when the row has none; level 0 reads row −1 (a Vector RangeError)', () => {
    expect([getChiCost(skill(1005), 1), getChiCost(skill(1003), 1), getChiCost(skill(1005), 9)]).toEqual([5, 0, 0]);
    expect(() => getChiCost(skill(1005), 0)).toThrow(RangeError);
  });

  it('WEB: 1 − min(speed, 600) / 600 × 0.5 (Android: / 300, capped at 300); a buff is × 1.5 into an int', () => {
    expect(skillCooldownModifier(0, false)).toBe(1);
    expect(skillCooldownModifier(300, false)).toBe(0.75); // Android 0.5
    expect(skillCooldownModifier(450, false)).toBe(0.625); // Android capped: 0.5
    expect(skillCooldownModifier(900, false)).toBe(0.5);
    expect(skillCooldownModifier(301, true)).toBe(1 - (451 / 600) * 0.5); // int(451.5) = 451
  });
});

describe('slice 7a: init\'s cooldown table, update\'s tick, canUseSkill (WEB: the chi test)', () => {
  it('the body\'s list IS the profile\'s, untouched (OPP-D item 2: the duellist is no boss, never re-rolled)', () => {
    const skills = [{ id: 1003, value: 1 }, { id: 1005, value: 2 }];
    const p = brain({ ...body1(), skills }, NO_DRAW);
    expect([p.skillList, p.isBoss]).toEqual([skills, false]);
  });

  it('init fills each skill\'s FULL cooldown, scaled by the HUMAN\'s speed; a passive one 0; an unknown id nothing', () => {
    const skills = [{ id: 1003, value: 1 }, { id: 1000, value: 1 }, { id: 1077, value: 1 }];
    const p = brain({ ...body1(), skills }, NO_DRAW, { playerSpeed: 300 });
    expect([...p.cooldownArray.entries()]).toEqual([[1003, 36], [1000, 0]]); // Android: 24
  });

  it('update ticks it down to 0, once per frame, and canUseSkill turns true on the frame it reaches 0', () => {
    const p = brain({ ...body1(), skills: [{ id: 1003, value: 1 }] }, NO_DRAW, { playerSpeed: 300 });
    const f = framed(p);
    f.run(35);
    expect([p.cooldownArray.get(1003), p.canUseSkill(1003)]).toEqual([1, false]);
    f.run(1);
    expect([p.cooldownArray.get(1003), p.canUseSkill(1003)]).toEqual([0, true]);
    f.run(2);
    expect(p.cooldownArray.get(1003)).toBe(0);
  });

  it('the tick walks the LIST, so an id listed twice ticks twice a frame (as the source loops)', () => {
    const p = brain({ ...body1(), skills: [{ id: 1003, value: 1 }, { id: 1003, value: 1 }] }, NO_DRAW);
    framed(p).run(1);
    expect(p.cooldownArray.get(1003)).toBe(46);
  });

  it('canUseSkill: owned AND at 0 (an id with no entry is never 0); WEB: a chi-costing skill is refused at chi 0', () => {
    const p = brain({ ...body1(), skills: [{ id: 1003, value: 1 }, { id: 1005, value: 1 }, { id: 1077, value: 1 }] }, NO_DRAW);
    allUsable(p);
    p.chi = 0;
    expect([p.hasSkill(1005), p.canUseSkill(1003), p.canUseSkill(1005), p.canUseSkill(1077), p.canUseSkill(1004)])
      .toEqual([true, true, false, false, false]); // Android: FOCUS true at chi 0
    p.chi = 1;
    expect(p.canUseSkill(1005)).toBe(true);
  });
});

describe('slice 7a: getUsableSkills — OPP-D item 1, the dead very-close list', () => {
  it('at 150 px the CLOSE list, in its order (the very-close test is overwritten), and the sign does not matter', () => {
    const p = brain({ ...body1(), skills: everySkill() }, NO_DRAW);
    allUsable(p);
    p.chi = 100;
    expect(p.getUsableSkills(150)).toEqual(OG_AI_SKILL_LISTS.close);
    expect(p.getUsableSkills(-150)).toEqual(OG_AI_SKILL_LISTS.close);
    expect(p.getUsableSkills(299)).toEqual(OG_AI_SKILL_LISTS.close);
    expect(p.getUsableSkills(300)).toEqual(OG_AI_SKILL_LISTS.mid);
    expect(p.getUsableSkills(400)).toEqual(OG_AI_SKILL_LISTS.long);
  });

  it('the very-close five in no other list (1048, 1044, 1042, 1043, 1064) are never returned at any range', () => {
    const dead = [1048, 1044, 1042, 1043, 1064];
    const p = brain({ ...body1(), skills: dead.map((id) => ({ id, value: 1 })) }, NO_DRAW);
    allUsable(p);
    p.chi = 100;
    expect([0, 50, 199, 250, 350, 900].map((d) => p.getUsableSkills(d))).toEqual([[], [], [], [], [], []]);
  });

  it('only the usable: a skill on cooldown is left out', () => {
    const p = brain({ ...body1(), skills: [{ id: 1006, value: 1 }, { id: 1013, value: 1 }] }, NO_DRAW);
    allUsable(p);
    p.chi = 100;
    p.cooldownArray.set(1006, 5);
    expect(p.getUsableSkills(100)).toEqual([1013]);
  });
});

describe('slice 7a: startSkill — the preamble and the tail; every arm is ONE unported catch-all', () => {
  const body = () => brain({ ...body1(), skills: [{ id: 1003, value: 1 }] }, NO_DRAW);

  it('refuses at peace and when dead, before anything else (no stealth cancelled)', () => {
    const p = body();
    p.visible = false;
    p.world.peaceful = true;
    expect(p.startSkill(OG_SKILL.JUMP, 1, -1, -1)).toBe(false);
    p.world.peaceful = false;
    p.dead = true;
    expect(p.startSkill(OG_SKILL.JUMP, 1, -1, -1)).toBe(false);
    expect([p.visible, p.events]).toEqual([false, []]);
  });

  it('refuses a body that cannot change stance, but for the smoke-away and a charging body\'s four charged skills', () => {
    const p = body();
    p.actionState = OG_STATE.SLASH;
    expect(p.startSkill(OG_SKILL.JUMP, 1, -1, -1)).toBe(false);
    expect(p.startSkill(SMOKEBOMB, 1, -1, -1)).toBe(false);
    p.actionState = OG_STATE.SKILL_SHUNPO;
    expect(() => p.startSkill(OG_SKILL.SHUNPO, 1, -1, -1)).toThrow('unported: SkillManager.startSkill (SHUNPO)');
    expect(p.startSkill(OG_SKILL.JUMP, 1, -1, -1)).toBe(false);
  });

  it('the smoke-away (level > 1) passes a busy body only when it can smoke away: downed, launched, falling, jumping', () => {
    const p = body();
    p.actionState = OG_STATE.SLASH;
    expect(p.canSmokeAway()).toBe(false);
    expect(p.startSkill(SMOKEBOMB, 2, -1, -1)).toBe(false);
    for (const s of [OG_STATE.IDLE, OG_STATE.DOWNED, OG_STATE.GOTLAUNCHED, OG_STATE.FALL, OG_STATE.JUMP]) {
      p.actionState = s;
      expect(p.canSmokeAway()).toBe(true);
      expect(() => p.startSkill(SMOKEBOMB, 2, -1, -1)).toThrow('unported: SkillManager.startSkill (SMOKEBOMB)');
    }
  });

  it('a charged shot not dropped at (0, 0) needs a charge of a second or more', () => {
    const p = body();
    p.chargingTime = 23;
    expect(p.startSkill(OG_SKILL.CHARGEDSHOT, 1, -1, -1)).toBe(false);
    expect(() => p.startSkill(OG_SKILL.CHARGEDSHOT, 1, 0, 0)).toThrow('unported: SkillManager.startSkill (CHARGEDSHOT)');
    p.chargingTime = 24;
    expect(() => p.startSkill(OG_SKILL.CHARGEDSHOT, 1, -1, -1)).toThrow('unported: SkillManager.startSkill (CHARGEDSHOT)');
  });

  it('then the stealth is cancelled, and an id with an arm is unported; an id with none falls out, true', () => {
    const p = body();
    p.visible = false;
    expect(() => p.startSkill(OG_SKILL.JUMP, 1, -1, -1)).toThrow('unported: SkillManager.startSkill (JUMP)');
    expect([p.visible, p.events]).toEqual([true, [{ type: 'smoke', x: BODY_X, y: GROUND }]]);
    expect(p.startSkill(1008, 1, -1, -1)).toBe(true);
    expect(() => p.startSkill(1077, 1, -1, -1)).toThrow('unported: SkillManager.startSkill (WEB_1077)');
  });

  it('getChargingTime is chargingTime / 24 into an int, at most 10; cancelChargingTime zeroes it', () => {
    const p = body();
    expect([23, 48, 263, 264, 300].map((t) => { p.chargingTime = t; return p.getChargingTime(); })).toEqual([0, 2, 10, 10, 10]);
    p.cancelChargingTime();
    expect(p.chargingTime).toBe(0);
  });
});

describe('slice 7a: doSkill — the level, startSkill, and the cooldown on a start', () => {
  it('an unusable skill starts nothing; a started one takes its cooldown at the level, scaled now', () => {
    const p = brain({ ...body1(), skills: [{ id: 1003, value: 1 }] }, NO_DRAW, { playerSpeed: 300 });
    const start = vi.spyOn(p, 'startSkill').mockImplementation(() => true);
    expect(p.doSkill(1003)).toBe(false);
    expect(start).not.toHaveBeenCalled();
    p.cooldownArray.set(1003, 0);
    p.world.playerSpeed = 0;
    expect(p.doSkill(1003, 120)).toBe(true);
    expect(start.mock.calls).toEqual([[1003, 1, 120, -1]]);
    expect(p.cooldownArray.get(1003)).toBe(48);
  });

  it('a refused start leaves the cooldown at 0', () => {
    const p = brain({ ...body1(), skills: [{ id: 1003, value: 1 }] }, NO_DRAW);
    p.cooldownArray.set(1003, 0);
    p.world.peaceful = true;
    expect([p.doSkill(1003), p.cooldownArray.get(1003)]).toEqual([false, 0]);
  });
});

describe('slice 7a: getDamage / getBaseDamage — a boss\'s is its minDamage, no draw (the duellist is no boss)', () => {
  it('isBoss answers minDamage from both getters without drawing', () => {
    const p = brain(body2(), NO_DRAW);
    p.isBoss = true;
    expect([p.getDamage(), p.getBaseDamage()]).toEqual([57, 57]);
  });
});

describe('slice 7a: AI — the guards, the smoke-away, the skip (OPP-D item 3)', () => {
  it('returns at once, drawing nothing, while frozen, using a skill, flinching, stunned or undying', () => {
    for (const s of [OG_STATE.DOSKILL, OG_STATE.FLINCH, OG_STATE.STUN, OG_STATE.SKILL_UNDYING, OG_STATE.SKILL_SHUNPO]) {
      const p = brain(body1(), NO_DRAW);
      p.actionState = s;
      p.AI();
    }
    const q = brain(body1(), NO_DRAW);
    q.animFrozen = true;
    q.AI();
  });

  it('downed or launched: nothing, unless the smoke-away is usable above level 1 — then it smokes (7b\'s arm)', () => {
    const p = brain({ ...body2(), skills: [{ id: SMOKEBOMB, value: 1 }] }, NO_DRAW);
    allUsable(p);
    p.chi = 100;
    p.actionState = OG_STATE.DOWNED;
    p.AI();
    const q = brain({ ...body2(), skills: [{ id: SMOKEBOMB, value: 2 }] }, NO_DRAW);
    allUsable(q);
    q.chi = 100;
    q.actionState = OG_STATE.GOTLAUNCHED;
    expect(() => { q.AI(); }).toThrow('unported: SkillManager.startSkill (SMOKEBOMB)');
  });

  it('the 1-in-5 skip at level ≤ 3 only: level 3 returns on a 0.1; level 4 draws no skip die at all', () => {
    const p = brain({ ...body1(), level: 3 }, drawn([0.1]));
    p.AI(); // a second draw would throw
    expect([p.actionState, p.destX]).toEqual([OG_STATE.IDLE, 0]);
    const q = brain({ ...body1(), level: 4, skills: stancesOnly }, drawn([0.1, 0.5]));
    q.doReload = 1000;
    q.AI(); // 0.1 is the skill die (0: an empty pick), 0.5 the wander's x; a skip die would have returned on 0.1
    expect([q.actionState, q.destX]).toEqual([OG_STATE.WALK, 400]);
  });
});

describe('slice 7a: AI — no target, at peace, a hidden target (WEB: the wander\'s bounds)', () => {
  it('with no enemy left, a body within 100 of an edge wanders to random × 500 + 150 (Android: 50, × 700 + 50)', () => {
    const at = (x: number, draws: number[]) => {
      const p = brain({ ...body2(), skills: stancesOnly }, drawn(draws));
      p.target = null;
      p.setPosition(x, GROUND);
      p.AI();
      return [p.actionState, p.destX];
    };
    expect(at(99, [0.5])).toEqual([OG_STATE.RUN, 400]);
    expect(at(701, [0])).toEqual([OG_STATE.RUN, 150]);
    expect(at(100, [])).toEqual([OG_STATE.IDLE, 0]);
    expect(at(700, [])).toEqual([OG_STATE.IDLE, 0]);
  });

  it('at peace in a duel: the bow once (IDLE, then BOW2), then an IDLE body within 100 of its target wanders', () => {
    const p = brain({ ...body2(), skills: stancesOnly }, NO_DRAW);
    p.world.peaceful = true;
    p.AI();
    expect([p.hasBowed, p.animation, p.actionState]).toEqual([true, OG_ANIM.BOW2, OG_STATE.IDLE]);
    p.startAnim('heavy_stance');
    p.AI(); // bowed already: no second bow, and 300 px off, no wander
    expect(p.animation).toBe('heavy_stance');
    // SOURCE QUIRK: the bow's IDLE lets the same tick's wander run, so a body within 100 bows for no frame
    const q = brain({ ...body2(), skills: stancesOnly }, drawn([0.625]));
    q.world.peaceful = true;
    q.changeTarget(foe(450, GROUND, true));
    q.AI();
    expect([q.hasBowed, q.actionState, q.destX]).toEqual([true, OG_STATE.WALK, 500]);
    q.world.duelMode = false;
    q.hasBowed = false;
    q.actionState = OG_STATE.POSE;
    q.AI(); // no bow outside a duel, and POSE is not IDLE: no wander, no draw
    expect(q.hasBowed).toBe(false);
  });

  it('a hidden target (alpha < 1, or invisible): 1 in 3 ticks wander, and nothing else', () => {
    const run = (t: Partial<NpcTarget>, draws: number[]) => {
      const p = brain({ ...body2(), skills: stancesOnly }, drawn(draws));
      p.changeTarget({ ...foe(700, GROUND, true), ...t });
      p.AI();
      return [p.actionState, p.destX];
    };
    expect(run({ alpha: 0.5 }, [0.2, 0.75])).toEqual([OG_STATE.RUN, 600]);
    expect(run({ visible: false }, [0.4])).toEqual([OG_STATE.IDLE, 0]);
  });
});

describe('slice 7a: AI — the stroke branch (the reload, the launch, the skill pick)', () => {
  it('a full reload strokes: launchTarget on a 0 of the 1-in-3 when it can launch, else slashTarget; doReload = 0', () => {
    const at = (canLaunch: boolean, die: number) => {
      const p = brain({ ...body2(), skills: stancesOnly }, drawn([0.5, die, 0.5]));
      p.canLaunch = canLaunch;
      p.reload = p.maxreload;
      const launch = vi.spyOn(p, 'launchTarget').mockImplementation(() => undefined);
      const slash = vi.spyOn(p, 'slashTarget').mockImplementation(() => undefined);
      p.AI();
      return [launch.mock.calls.length, slash.mock.calls.length, p.doReload];
    };
    expect(at(true, 0.2)).toEqual([1, 0, 0]);
    expect(at(false, 0.2)).toEqual([0, 1, 0]);
    expect(at(true, 0.4)).toEqual([0, 1, 0]);
  });

  it('an airborne body cannot launch: the 0 of the die strokes flat instead (airborne is > 50 px up, NPC.as:772)', () => {
    const at = (up: number) => {
      const p = brain({ ...body2(), skills: stancesOnly }, drawn([0.5, 0.2]));
      p.canLaunch = true;
      p.reload = p.maxreload;
      p.y = GROUND - up; // IDLE in the air: FALL is refused a stroke before this test
      const launch = vi.spyOn(p, 'launchTarget').mockImplementation(() => undefined);
      const slash = vi.spyOn(p, 'slashTarget').mockImplementation(() => undefined);
      p.AI();
      return [launch.mock.calls.length, slash.mock.calls.length];
    };
    expect(at(50)).toEqual([1, 0]);
    expect(at(51)).toEqual([0, 1]);
  });

  it('a started STEALTH ends the tick: no wander after it', () => {
    const p = brain({ ...body2(), skills: [{ id: OG_SKILL.STEALTH, value: 1 }] }, drawn([0.5, 0.5]));
    allUsable(p);
    p.chi = 100;
    vi.spyOn(p, 'startSkill').mockImplementation(() => true);
    p.AI(); // a wander would draw a third number and throw
    expect([p.actionState, p.destX]).toEqual([OG_STATE.IDLE, 0]);
  });

  it('while reload < doReload, only an IDLE or POSE body wanders; a walking one keeps walking', () => {
    const at = (state: OgState, draws: number[]) => {
      const p = brain({ ...body2(), skills: stancesOnly }, drawn(draws));
      p.actionState = state;
      p.doReload = 100;
      p.AI();
      return p.destX;
    };
    expect(at(OG_STATE.WALK, [0.5])).toBe(0);
    expect(at(OG_STATE.POSE, [0.5, 0.75])).toBe(600);
  });

  it('under 24 with STEALTH usable, it hides (7c\'s arm) instead of wandering', () => {
    const p = brain({ ...body2(), skills: [{ id: OG_SKILL.STEALTH, value: 1 }] }, drawn([0.5, 0.5]));
    allUsable(p);
    p.chi = 100;
    expect(() => { p.AI(); }).toThrow('unported: SkillManager.startSkill (STEALTH)');
    expect(p.doReload).toBe(24 + 0.5 * (p.maxreload - 24));
  });

  it('the skill pick (1 in 4): the charged skills write their state and charge first, OPP-D items 5 and 6', () => {
    const pick = (id: number, x = 700) => {
      const p = brain({ ...body2(), skills: [{ id, value: 1 }] }, drawn([0.1, 0]));
      allUsable(p);
      p.chi = 100;
      p.changeTarget(foe(x, GROUND, true)); // 300 px: the MID list; 200 px: the CLOSE
      const start = vi.spyOn(p, 'startSkill').mockImplementation(() => true);
      p.AI();
      return [start.mock.calls[0], p.actionState, p.chargingTime, p.facingRight];
    };
    const S = OG_STATE;
    expect(pick(OG_SKILL.CHARGEDSHOT)).toEqual([[OG_SKILL.CHARGEDSHOT, 1, -1, -1], S.IDLE, 48, true]);
    expect(pick(OG_SKILL.SHUNPO)).toEqual([[OG_SKILL.SHUNPO, 1, -1, -1], S.SKILL_SHUNPO, 96, true]);
    expect(pick(OG_SKILL.THOUSANDSTABS)).toEqual([[OG_SKILL.THOUSANDSTABS, 1, -1, -1], S.SKILL_THOUSANDSTABS, 96, true]);
    // the cleave wears the FLURRY's state (item 5)
    expect(pick(OG_SKILL.DEADLYCLEAVE, 600)).toEqual([[OG_SKILL.DEADLYCLEAVE, 1, -1, -1], S.SKILL_THOUSANDSTABS, 120, true]);
  });

  it('while reload < doReload: FOCUS first (7c\'s arm); an IDLE body with no FOCUS wanders', () => {
    const p = brain({ ...body2(), skills: [{ id: OG_SKILL.FOCUS, value: 1 }] }, drawn([0.5]));
    allUsable(p);
    p.chi = 100;
    p.doReload = 100;
    expect(() => { p.AI(); }).toThrow('unported: SkillManager.startSkill (FOCUS)');
  });
});

describe('slice 7a: AI — a downed or airborne target', () => {
  const downed = (t: NpcTarget): NpcTarget => ({ ...t, isDowned: () => true });

  it('a downed target: the heavenly swords at its x if usable (7e), then stab, else a coin: the downed slash or a wander', () => {
    const p = brain({ ...body2(), skills: stancesOnly }, drawn([0.2]));
    p.changeTarget(downed(foe(700, GROUND, true)));
    const low = vi.spyOn(p, 'slashDownedTarget').mockImplementation(() => undefined);
    p.AI();
    expect(low).toHaveBeenCalledTimes(1);
    const q = brain({ ...body2(), skills: stancesOnly }, drawn([0.7, 0.25]));
    q.changeTarget(downed(foe(700, GROUND, true)));
    q.AI();
    expect(q.destX).toBe(200);
    const r = brain({ ...body2(), skills: stancesOnly }, NO_DRAW);
    r.changeTarget(downed(foe(700, GROUND, true)));
    r.canStab = true;
    const stab = vi.spyOn(r, 'stabTarget').mockImplementation(() => undefined);
    r.AI();
    expect(stab).toHaveBeenCalledTimes(1);
  });

  it('the heavenly swords are asked first, with the target\'s x as the drop point', () => {
    const p = brain({ ...body2(), skills: [{ id: OG_SKILL.HEAVENLYSWORDS, value: 1 }] }, NO_DRAW);
    allUsable(p);
    p.chi = 100;
    p.changeTarget(downed(foe(700, GROUND, true)));
    expect(() => { p.AI(); }).toThrow('unported: SkillManager.startSkill (HEAVENLYSWORDS)');
  });

  it('the air stab between 50 and 200 px (exclusive), facing the target first (7d\'s arm)', () => {
    const at = (x: number) => {
      const p = brain({ ...body2(), skills: [{ id: OG_SKILL.AIRSTAB, value: 1 }] }, drawn([0.2]));
      allUsable(p);
      p.chi = 100;
      p.changeTarget(downed(foe(x, GROUND, true)));
      p.faceLeft();
      const start = vi.spyOn(p, 'startSkill').mockImplementation(() => true);
      vi.spyOn(p, 'slashDownedTarget').mockImplementation(() => undefined);
      p.AI();
      return [start.mock.calls.map((c) => c[0]), p.facingRight];
    };
    expect(at(500)).toEqual([[OG_SKILL.AIRSTAB], true]);
    expect(at(450)).toEqual([[], false]);
    expect(at(600)).toEqual([[], false]);
  });

  it('an airborne target within 120: a light or balanced body strokes the diagonal on its side; heavy does nothing', () => {
    const air = (x: number, stance: number) => {
      const p = brain({ ...body1(), level: 45, skills: stancesOnly, stance }, NO_DRAW);
      p.canAirCombo = true;
      p.changeTarget({ ...foe(x, GROUND - 100, true), isAirborne: () => true });
      const left = vi.spyOn(p, 'slashDiagonalLeft').mockImplementation(() => undefined);
      const right = vi.spyOn(p, 'slashDiagonalRight').mockImplementation(() => undefined);
      p.AI();
      return [left.mock.calls.length, right.mock.calls.length];
    };
    expect(air(300, LIGHT)).toEqual([1, 0]);
    expect(air(519, BALANCED)).toEqual([0, 1]);
    expect(air(520, BALANCED)).toEqual([0, 0]);
    expect(air(450, HEAVY)).toEqual([0, 0]);
  });
});

describe('slice 7a: the clip hit tests — ONE geometry member, `clipHitTestPoint`, its calls counted', () => {
  it('a body with a stroke asks the TARGET\'s clip, shape-exact, point by point until one hits; none hit → re-aims', () => {
    const calls: unknown[][] = [];
    const geo: HitGeometry = { ...geometry, clipHitTestPoint: (c, x, y, shape) => { calls.push([c, x, y, shape]); return x === 478; } };
    const p = brain({ ...body1(), level: 45, skills: stancesOnly }, NO_DRAW, {}, anims, geo);
    const t = foe(500, GROUND, true);
    p.changeTarget(t);
    p.slashTarget(); // 6 points from (458, 318), 58 px off: the body RUNs to it
    expect([p.actionState, p.hasSlash]).toEqual([OG_STATE.RUN, true]);
    const again = vi.spyOn(p, 'slashTarget').mockImplementation(() => undefined);
    p.AI();
    expect([calls, again.mock.calls.length]).toEqual([[[t, 458, 318, true], [t, 478, 316, true]], 0]);
    calls.length = 0;
    p.inputArray = [{ x: 1, y: 2 }, { x: 3, y: 4 }];
    p.AI();
    expect([calls, again.mock.calls.length]).toEqual([[[t, 1, 2, true], [t, 3, 4, true]], 1]);
  });

  it('isUnderSlash asks the BODY\'s clip, bounding-box, at each point of the human\'s slash less the stage position', () => {
    const calls: unknown[][] = [];
    const geo: HitGeometry = { ...geometry, clipHitTestPoint: (c, x, y, shape) => { calls.push([c, x, y, shape]); return false; } };
    const p = brain(body2(), NO_DRAW, { playerSlashArray: SLASH_OVER_BODY, stagePosition: 30 }, anims, geo);
    expect(p.isUnderSlash()).toBe(false);
    expect(calls).toEqual([[p, 70, 300, false], [p, 380, 300, false], [p, 390, 300, false]]);
  });

  it('DuelHitGeometry answers "no" and counts it, like its other four questions', () => {
    const g = new DuelHitGeometry();
    expect([g.clipHitTestPoint(foe(0, 0, true), 1, 2, true), g.consulted]).toEqual([false, 1]);
  });
});

describe('slice 7a: the two end-to-end runs through the real update (hand-worked above, ±0)', () => {
  it('RUN 1: the skip, the wander while reload < doReload, then the stroke and doReload = 0', () => {
    const rng = drawn([0.1, 0.5, 0.5, 0.125, 0.53125, 0.5, 0.1, 0.5, 0.5, 0.5, 0.53125, 0.5, 0.5, 0.5, 0.5]);
    const p = brain({ ...body1(), skills: stancesOnly }, rng, {}, new OgAnimLibrary());
    p.changeTarget(foe(500, GROUND, true));
    const ai: number[] = [];
    let frame = 0;
    const real = p.AI.bind(p);
    vi.spyOn(p, 'AI').mockImplementation(() => { ai.push(frame); real(); });
    const rows: string[] = [];
    for (frame = 1; frame <= 49; frame += 1) {
      p.update();
      rows.push([frame, stateName(p.actionState), p.posX, p.facingRight, p.reload, p.doReload].join(' '));
    }
    const row = (f: number) => rows[f - 1];
    expect(ai).toEqual([1, 13, 25, 37, 49]);
    expect([row(1), row(12)]).toEqual(['1 IDLE 400 true 1 -1', '12 IDLE 400 true 12 -1']);
    expect([row(13), row(18), row(19), row(24)]).toEqual(['13 WALK 404 true 13 45', '18 WALK 424 true 18 45', '19 IDLE 425 true 19 45', '24 IDLE 425 true 24 45']);
    expect([row(25), row(29), row(30), row(31)]).toEqual(['25 WALK 421 false 25 45', '29 WALK 405 false 29 45', '30 WALK 401 false 30 45', '31 IDLE 400 false 31 45']);
    expect([row(37), row(42), row(43), row(48)]).toEqual(['37 WALK 404 true 37 45', '42 WALK 424 true 42 45', '43 IDLE 425 true 43 45', '48 IDLE 425 true 48 45']);
    expect(row(49)).toBe('49 SLASH 465 true 49 0');
    expect([p.animation, p.slashArray.length, p.slashArray[0], p.slashArray[5]])
      .toEqual(['balanced_horslash_parta', 6, { x: 458, y: 318 }, { x: 558, y: 308 }]);
    expect(() => rng()).toThrow('past the script (15)');
  });

  it('RUN 2: the human\'s slash over the body, no evasive skill ready → doEvade\'s makeSlash fallback', () => {
    const rng = drawn([0.5, 0.5, 0.5]);
    const calls: number[][] = [];
    const geo: HitGeometry = { ...geometry, clipHitTestPoint: (_c, x, y) => { calls.push([x, y]); return x === 410; } };
    const p = brain(body2(), rng, { playerHasSlash: true, playerSlashArray: SLASH_OVER_BODY }, new OgAnimLibrary(), geo);
    expect(p.cooldownArray.get(SMOKEBOMB)).toBe(144);
    p.update();
    expect(calls).toEqual([[100, 300], [410, 300]]);
    expect([stateName(p.actionState), p.animation, p.posX, p.facingRight, p.cooldownArray.get(SMOKEBOMB)])
      .toEqual(['SLASH', 'heavy_horslash_parta', 370, false, 143]);
    expect(p.slashArray).toEqual([{ x: 400, y: 308 }, { x: 380, y: 308 }, { x: 360, y: 308 }, { x: 340, y: 308 }, { x: 320, y: 308 }]);
    expect(() => rng()).toThrow('past the script (3)');
  });

  it('doEvade: the first evasive skill that starts wins (ROLL before JUMP), and the diagonals\' steps are 10 and −17', () => {
    const p = brain({ ...body2(), skills: [{ id: OG_SKILL.JUMP, value: 1 }, { id: OG_SKILL.ROLL, value: 1 }] }, NO_DRAW);
    allUsable(p);
    const start = vi.spyOn(p, 'startSkill').mockImplementation(() => true);
    p.doEvade();
    expect(start.mock.calls.map((c) => c[0])).toEqual([OG_SKILL.ROLL]);
    const q = brain({ ...body2(), skills: stancesOnly }, drawn([0.1, 0.5, 0.5]));
    const made = vi.spyOn(q, 'makeSlash');
    q.doEvade();
    expect(made.mock.calls[0]).toEqual([400, 228, 10, -17]);
  });
});

describe('the harness rule — unported calls throw, and their count only goes down', () => {
  it('MCSPlayer.ts names exactly 12 unported sites: the switches\' catch-alls and the calls out of 5a, 6a and 6c', () => {
    // 5a replaced the ONE startAction stub with three dispatchers. A dispatcher that ports some of
    // its labels needs its own site for the rest, so the count ROSE from 3 (see DIVERGENCES
    // "L5-OPP SLICE 5a"); the AI, cancelLogSub and the FX removal are calls 5a's code makes. 6a
    // raised it again, 8 → 24, by design: `checkHitObject`'s FX removal and fly-away, and one
    // shadow per reception override not ported yet, so no hit falls into the mobs' code
    // (DIVERGENCES "L5-OPP SLICE 6a"). 6b took out 9: eight shadows and the fly-away (DIVERGENCES
    // "L5-OPP SLICE 6b"); 6c took out the last six and added three calls the web `gotHit` and `die`
    // make into slice 7's code: the log substitution and two more FX removals (DIVERGENCES "6c").
    const src = readFileSync(new URL('../src/core/npc/MCSPlayer.ts', import.meta.url), 'utf8');
    expect([...src.matchAll(/unported\('([^']*)'/g)].map((m) => m[1])).toEqual([
      'MCSPlayer.update clip end', 'Projectile.removeProjectile', 'MCSPlayer.startAction', 'MCSPlayer.doAction',
      'SkillManager.startSkill', 'MCSPlayer.cancelLogSub', 'MCSPlayer.doSubstitutionLog', 'StageManager.clearInteractTarget',
      'NPCManager.checkPlayerHit', 'Projectile.removeProjectile', 'Projectile.removeProjectile', 'Projectile.removeProjectile',
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
