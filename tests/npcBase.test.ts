/**
 * LANE L4b, SLICE 0 — `src/core/npc/Npc.ts`, the port of `NPC.as` (1,238 lines),
 * driven through `src/config/ogNpcBase.ts`.
 *
 * Every number asserted below is the source's own, quoted by `NPC.as:<line>` in
 * the config it is read from. The tests are an INDEPENDENT reading of the AS3 —
 * they were written from the source, not from the port — so a port that drifts
 * from the file fails here rather than in a subclass three slices later.
 *
 * The base's `startAction()` is EMPTY in the source (`NPC.as:277`): it does not
 * even record the state. Every real descendant's first line is
 * `this.actionState = actionState`, so a one-line `Probe` subclass does the same
 * here, and the state-machine tests read the state through it. Nothing else is
 * overridden: what is under test is the base.
 *
 * ⚠️ The original runs at 24 fps (`OG_FPS`). Every "frame" below is one call to
 * the per-frame method, never a Sim tick.
 */
import { describe, expect, it } from 'vitest';
import { OG_ANIM, OG_LAUNCH, OG_PART, OG_STATE, type OgPart, type OgState } from '../src/config/ogActor';
import {
  OG_NPC_AIRBORNE_ABOVE_GROUND,
  OG_NPC_DEFAULTS,
  OG_NPC_FADE_FRAMES,
  OG_NPC_FLOATING_TEXT,
  OG_NPC_HIT_IFRAMES,
} from '../src/config/ogNpcBase';
import { OG_NPCS, type OgNpc } from '../src/config/ogNpcs';
import { Npc } from '../src/core/npc/Npc';
import { NpcDamage } from '../src/core/npc/NpcDamage';
import type { AnimLibrary, HitGeometry, NpcEvent, NpcTarget, NpcWorld } from '../src/core/npc/types';
import { mulberry32 } from '../src/core/rng';
import type { Rng } from '../src/core/Sim';

// ---------------------------------------------------------------- harness --

const GROUND = 358;
const WIDTH = 800;

const world = (over: Partial<NpcWorld> = {}): NpcWorld => ({
  groundY: GROUND,
  stageWidth: WIDTH,
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
  peaceful: false,
  duelMode: false,
  externalRedFreezeCheck: () => undefined,
  ...over,
});

/** Every clip is 3 frames, non-looping; 'loopclip' loops at 4; 'missing' is unknown. */
const anims: AnimLibrary = {
  clip: (name) =>
    name === 'missing' ? null : name === 'loopclip' ? { durationFrames: 4, loop: true } : { durationFrames: 3, loop: false },
};

const geometry = (part: OgPart | null = OG_PART.torso, partX = 0): HitGeometry => ({
  partAtPoint: () => part,
  partHitBy: () => part,
  partX: () => partX,
  partsHitBy: () => [],
});

/** A fixed-value rng, or a sequence that holds its last value. */
const seq = (...vals: number[]): Rng => {
  let i = 0;
  return () => vals[Math.min(i++, vals.length - 1)] ?? 0;
};

const targetAt = (x: number, y = GROUND): NpcTarget => ({
  x,
  y,
  getMapPosition: () => x,
  isFacingRight: () => {
    throw new Error('a mob read its target\'s facing');
  },
  isDead: () => false,
  isDowned: () => false,
  isAirborne: () => false,
  checkHitObject: () => false,
});

/** The one-line subclass every real descendant is: it records the state. */
class Probe extends Npc {
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
  }
}

interface Opts {
  world?: Partial<NpcWorld>;
  part?: OgPart | null;
  partX?: number;
  rng?: Rng;
  target?: NpcTarget | null;
}

const make = (o: Opts = {}): Probe => {
  const npc = new Probe(world(o.world), anims, geometry(o.part, o.partX), o.rng ?? seq(0.5), o.target ?? targetAt(100));
  npc.setPosition(400, GROUND);
  npc.faceRight();
  return npc;
};

/** A live fighter: 50 hp, defense 2, level 10, on the ground, idle. */
const fighter = (o: Opts = {}): Probe => {
  const npc = make(o);
  npc.level = 10;
  npc.defense = 2;
  npc.maxhp = 50;
  npc.setHP(50);
  npc.startAction(OG_STATE.IDLE);
  return npc;
};

const hit = (damage: number, attackerlvl = 0, launchType: number = OG_LAUNCH.LAUNCH_NONE): NpcDamage =>
  new NpcDamage(damage, attackerlvl, launchType);

const ofType = <T extends NpcEvent['type']>(events: readonly NpcEvent[], type: T): Array<Extract<NpcEvent, { type: T }>> =>
  events.filter((e): e is Extract<NpcEvent, { type: T }> => e.type === type);

// ------------------------------------------------------------ static maths --

describe('NPC.as:94-190 — the XP maths are static and keyed on the PLAYER level', () => {
  it('getGreyLevel: four bands on the player level (:97-109)', () => {
    expect(Npc.getGreyLevel(5)).toBe(0);
    expect(Npc.getGreyLevel(6)).toBe(6 - 0 - 5);
    expect(Npc.getGreyLevel(20)).toBe(20 - 2 - 5);
    expect(Npc.getGreyLevel(39)).toBe(39 - 3 - 5);
    expect(Npc.getGreyLevel(40)).toBe(40 - 8 - 1);
    expect(Npc.getGreyLevel(59)).toBe(59 - 11 - 1);
    expect(Npc.getGreyLevel(60)).toBe(60 - 9);
    expect(Npc.getGreyLevel(80)).toBe(71);
  });

  it('getZeroDifference: twelve rows, first match wins, 17 caps (:115-163)', () => {
    const rows: Array<[level: number, value: number]> = [
      [1, 5], [7, 5], [8, 6], [9, 6], [10, 7], [12, 8], [16, 9], [20, 11], [30, 12],
      [40, 13], [45, 14], [50, 15], [55, 16], [60, 17], [79, 17], [80, 17], [200, 17],
    ];
    for (const [level, value] of rows) expect(Npc.getZeroDifference(level), `level ${level}`).toBe(value);
  });

  it('calcXP: grey mobs and mobs > 3 above pay nothing; above pays +5 %/level; below pays a fraction; elite doubles (:166-190)', () => {
    expect(Npc.calcXP(20, 13, 60, false)).toBe(0); // 13 is exactly the grey level at player 20
    expect(Npc.calcXP(20, 24, 60, false)).toBe(0); // 4 above
    // 3 above: allowed. The expectation repeats the SOURCE's expression, because
    // `60 × 1.15` and `60 × (1 + 0.05 × 3)` straddle a double-rounding boundary.
    expect(Npc.calcXP(20, 23, 60, false)).toBe(Math.trunc(60 * (1 + 0.05 * (23 - 20))));
    expect(Npc.calcXP(20, 22, 60, false)).toBe(66);
    expect(Npc.calcXP(20, 20, 60, false)).toBe(60);
    // 5 below at player 20: zeroDifference(20) = 11 → 60 × (1 − 5/11) = 32.7 → int 32.
    expect(Npc.calcXP(20, 15, 60, false)).toBe(32);
    // Elite doubles the TRUNCATED value, not the real one.
    expect(Npc.calcXP(20, 15, 60, true)).toBe(64);
  });

  it('getColorXP: the nameplate band by level gap (:871-891)', () => {
    const npc = make({ world: { playerLevel: 20 } });
    const band = (level: number): number => {
      npc.level = level;
      return npc.getColorXP();
    };
    expect([band(25), band(24), band(23), band(22), band(18), band(17), band(14), band(13)]).toEqual([
      4, 3, 3, 2, 2, 1, 1, 0,
    ]);
  });
});

// ------------------------------------------------------- init / setLevel --

describe('NPC.as:192-260 — reset, init from a roster row, setLevel', () => {
  const row = OG_NPCS.find(
    (n): n is OgNpc & Required<Pick<OgNpc, 'hp' | 'attack' | 'defense' | 'lvl' | 'loot'>> =>
      n.hp !== undefined && n.attack !== undefined && n.defense !== undefined && n.lvl !== undefined && n.loot !== undefined,
  );
  if (row === undefined) throw new Error('no fully-populated roster row');

  it('init copies the BASE stats verbatim and derives xp = lvl × 2 + 20 (:211-236)', () => {
    const npc = make();
    npc.init(row);
    expect([npc.damage, npc.defense, npc.maxhp, npc.level]).toEqual([row.attack, row.defense, row.hp, row.lvl]);
    expect(npc.getHP()).toBe(row.hp);
    expect(npc.xp).toBe(row.lvl * 2 + 20);
    expect(npc.reward).toEqual(row.loot);
    expect(npc.paperdoll).toBe(row.mcs);
  });

  it('init: on the ground → WALK, in the air → FALL (:220-227)', () => {
    const onGround = make();
    onGround.init(row);
    expect(onGround.actionState).toBe(OG_STATE.WALK);
    const inAir = make();
    inAir.setPosition(400, GROUND - 200);
    inAir.init(row);
    expect(inAir.actionState).toBe(OG_STATE.FALL);
  });

  it('init maps <fire> → FIREATK + EARTHDEF and <earth> → EARTHATK + WINDDEF (XMLNpc.as:196-212)', () => {
    const npc = make();
    npc.init({ ...row, fire: 10, earth: 7 });
    expect([npc.STAT_FIREATK, npc.STAT_EARTHDEF, npc.STAT_EARTHATK, npc.STAT_WINDDEF]).toEqual([10, 10, 7, 7]);
    expect([npc.STAT_WINDATK, npc.STAT_WATERATK, npc.STAT_FIREDEF, npc.STAT_WATERDEF]).toEqual([0, 0, 0, 0]);
  });

  it('init on a row with no <hp>/<attack>/<defense>/<lvl> reads them as 0, as XMLNpc.as does', () => {
    const bare = OG_NPCS.find((n) => n.hp === undefined);
    if (bare === undefined) throw new Error('no hp-less row');
    const npc = make();
    npc.init(bare);
    expect(npc.maxhp).toBe(0);
    expect(npc.xp).toBe((bare.lvl ?? 0) * 2 + 20);
  });

  it('reset restores the live defaults: visible, full hp, idle, facing right, ttl (:192-209)', () => {
    const npc = fighter();
    npc.setHP(3);
    npc.dead = true;
    npc.behead = true;
    npc.alpha = 0.2;
    npc.visible = false;
    npc.faceLeft();
    npc.ttl = 1;
    npc.velX = 9;
    npc.reset();
    expect(npc.getHP()).toBe(50);
    expect([npc.dead, npc.behead, npc.gotHitFlag, npc.dontGiveLoot]).toEqual([false, false, false, false]);
    expect([npc.visible, npc.alpha, npc.facingRight]).toEqual([true, 1, true]);
    expect([npc.velX, npc.velY, npc.aiCounter, npc.ttl]).toEqual([0, 0, 0, OG_NPC_DEFAULTS.ttlMax]);
    expect(npc.actionState).toBe(OG_STATE.IDLE);
    expect(npc.healthBarVisible).toBe(true);
  });

  it('setLevel scales by lvl/level, ×0.9 at or under 20, and truncates like AS3 ints (:239-252)', () => {
    const npc = make();
    npc.level = 10;
    npc.damage = 30;
    npc.defense = 8;
    npc.maxhp = 100;
    npc.setLevel(30);
    expect([npc.level, npc.damage, npc.defense, npc.maxhp, npc.getHP(), npc.xp]).toEqual([30, 90, 24, 300, 300, 80]);
    const soft = make();
    soft.level = 10;
    soft.damage = 30;
    soft.defense = 8;
    soft.maxhp = 100;
    soft.setLevel(15); // factor 1.5 × 0.9 = 1.35 → 40.5 → 40, 10.8 → 10, 135
    expect([soft.damage, soft.defense, soft.maxhp, soft.xp]).toEqual([40, 10, 135, 50]);
  });

  it('setLevel at or under 10 forces damage, defense and max hp to 1 — mobs die in one hit (:253-258)', () => {
    const npc = make();
    npc.level = 30;
    npc.damage = 90;
    npc.defense = 24;
    npc.maxhp = 300;
    npc.setLevel(5);
    expect([npc.damage, npc.defense, npc.maxhp, npc.getHP()]).toEqual([1, 1, 1, 1]);
  });
});

// ----------------------------------------------------------- AI trigger --

describe('NPC.as:285-294 — checkAITrigger fires once per aiCounterMax frames', () => {
  it('is true on the 24th call and every 24th after, false between', () => {
    const npc = make();
    npc.aiCounter = 0;
    const fired: number[] = [];
    for (let i = 1; i <= 72; i++) if (npc.checkAITrigger()) fired.push(i);
    expect(fired).toEqual([1, 25, 49]);
    expect(OG_NPC_DEFAULTS.aiCounterMax).toBe(24);
  });
});

// --------------------------------------------------------------- gotHit --

describe('NPC.as:386-519 — gotHit: defence, floors, parts, elements, i-frames', () => {
  it('subtracts defense, floors by the attacker-level ladder, and posts the number (:445-462, :497)', () => {
    const npc = fighter();
    expect(npc.gotHit(OG_PART.torso, hit(10, 15))).toBe(true);
    expect(npc.getHP()).toBe(42); // 10 − 2; floor at level 15 is 1
    expect(npc.gotHitCounter).toBe(OG_NPC_HIT_IFRAMES);
    expect(npc.stunCounter).toBe(0);
    expect(npc.gotHitFlag).toBe(true);
    expect(ofType(npc.events, 'floatingText')).toEqual([
      { type: 'floatingText', x: 400, y: GROUND + OG_NPC_FLOATING_TEXT.yOffset, text: '8', colour: OG_NPC_FLOATING_TEXT.colour.physical },
    ]);
    expect(ofType(npc.events, 'sound')).toEqual([{ type: 'sound', name: 'hit' }]);
    expect(npc.healthBarFraction).toBeCloseTo(42 / 50);
  });

  it('an attacker of level 0 has NO floor below its own damage — defense never bites (Damage.as:154-158)', () => {
    const npc = fighter();
    npc.defense = 20;
    npc.gotHit(OG_PART.torso, hit(10, 0));
    expect(npc.getHP()).toBe(40);
  });

  it('a head, hat or neck hit beheads: ×1.5, and the flag clears again while alive (:428-432, :451-454, :467)', () => {
    for (const part of [OG_PART.head, OG_PART.hat, OG_PART.neck]) {
      const npc = fighter();
      npc.gotHit(part, hit(10, 15));
      expect(npc.getHP(), `part ${part}`).toBe(50 - Math.trunc(8 * 1.5));
      expect(npc.behead).toBe(false);
    }
  });

  it('the WEAPON part deflects: no damage, no flag, returns false (:434-437)', () => {
    const npc = fighter();
    expect(npc.gotHit(OG_PART.weapon, hit(10, 15))).toBe(false);
    expect(npc.getHP()).toBe(50);
    expect(npc.gotHitFlag).toBe(false);
    expect(npc.gotHitCounter).toBe(0);
  });

  it('elemental damage: positive before defence never drops below 1; non-positive clamps to 0; each posts its colour (:392-420, :499-515)', () => {
    const npc = fighter();
    npc.STAT_FIREDEF = 10;
    npc.STAT_WINDDEF = 3;
    const d = hit(10, 15);
    d.setFireDamage(5);
    d.setWindDamage(0);
    d.setWaterDamage(4);
    npc.gotHit(OG_PART.torso, d);
    expect(npc.getHP()).toBe(50 - 8 - 1 - 4);
    expect(ofType(npc.events, 'floatingText').map((e) => [e.text, e.colour])).toEqual([
      ['8', OG_NPC_FLOATING_TEXT.colour.physical],
      ['1', OG_NPC_FLOATING_TEXT.colour.fire],
      ['4', OG_NPC_FLOATING_TEXT.colour.water],
    ]);
  });

  it('Death Touch overrides the damage to 500 and forces LAUNCH_FLY (:455-459)', () => {
    const npc = fighter();
    const d = hit(10, 15, OG_LAUNCH.DEATHTOUCH);
    npc.gotHit(OG_PART.torso, d);
    expect(npc.getHP()).toBe(50 - 500);
    expect(d.launchType).toBe(OG_LAUNCH.LAUNCH_FLY);
    expect(npc.isGoingToDie()).toBe(true);
    // Dead on the spot: no reaction, no floating number, but the hit sound still plays.
    expect(npc.actionState).toBe(OG_STATE.IDLE);
    expect(ofType(npc.events, 'floatingText')).toEqual([]);
    expect(ofType(npc.events, 'sound')).toEqual([{ type: 'sound', name: 'hit' }]);
  });

  it('twelve frames of i-frames: a second hit inside them is refused (:387-390, :462)', () => {
    const npc = fighter();
    npc.gotHit(OG_PART.torso, hit(10, 15));
    expect(npc.canHit()).toBe(false);
    expect(npc.gotHit(OG_PART.torso, hit(10, 15))).toBe(false);
    expect(npc.getHP()).toBe(42);
    npc.gotHitCounter = 0;
    expect(npc.canHit()).toBe(true);
    expect(npc.gotHit(OG_PART.torso, hit(10, 15))).toBe(true);
    expect(npc.getHP()).toBe(34);
  });

  it('checkHit / checkHitObject / checkHitTrap / testHit route through the geometry port (:301-384)', () => {
    const miss = fighter({ part: null });
    expect(miss.checkHit(0, 0, hit(10))).toBe(false);
    expect(miss.checkHitObject({ kind: 'other', part: null, owner: null }, hit(10))).toBe(false);
    expect(miss.testHit({ kind: 'other', part: null, owner: null })).toBe(false);
    expect(miss.getHP()).toBe(50);

    const body = fighter();
    expect(body.checkHit(0, 0, hit(10, 15))).toBe(true);
    expect(body.getHP()).toBe(42);
    // checkHit scans only while !gotHitFlag — the flag from the first hit blocks the scan.
    expect(body.checkHit(0, 0, hit(10, 15))).toBe(false);
    expect(body.testHit({ kind: 'other', part: null, owner: null })).toBe(false);
    body.gotHitFlag = false;
    expect(body.testHit({ kind: 'other', part: null, owner: null })).toBe(true);

    const trap = fighter();
    expect(trap.checkHitTrap({ kind: 'other', part: null, owner: null }, hit(10, 15))).toBe(true);
    expect(trap.gotHitFlag, 'a trap hit clears the flag again').toBe(false);

    const deflect = fighter({ part: OG_PART.weapon });
    expect(deflect.checkHitObject({ kind: 'part', part: OG_PART.weapon, owner: null }, hit(10))).toBe(false);
    expect(deflect.getHP()).toBe(50);
  });
});

// ------------------------------------------------------------ reactions --

describe('NPC.as:464-494 + :536-700 — the reaction each launch type dispatches to', () => {
  it('LAUNCH_AIR from the ground: GOTLAUNCHED, velY −25, pushed away from the facing (:558-567)', () => {
    const npc = fighter();
    npc.gotHit(OG_PART.torso, hit(10, 15, OG_LAUNCH.LAUNCH_AIR));
    expect(npc.actionState).toBe(OG_STATE.GOTLAUNCHED);
    expect([npc.velX, npc.velY]).toEqual([-3, -25]);
    const left = fighter();
    left.faceLeft();
    left.gotHit(OG_PART.torso, hit(10, 15, OG_LAUNCH.LAUNCH_AIR));
    expect([left.velX, left.velY]).toEqual([3, -25]);
  });

  it('a hit while ALREADY airborne (FALL/JUMP/GOTLAUNCHED) re-launches: velY −20 and the body turns (:473, :542-553)', () => {
    const npc = fighter();
    npc.startAction(OG_STATE.FALL);
    npc.gotHit(OG_PART.torso, hit(10, 15)); // plain hit — the state alone triggers the juggle
    expect(npc.actionState).toBe(OG_STATE.GOTLAUNCHED);
    expect(npc.facingRight).toBe(false);
    expect([npc.velX, npc.velY]).toEqual([3, -20]);
  });

  it('gotLaunched respects canGotLaunched and never fires while DYING (:538)', () => {
    const npc = fighter();
    npc.canGotLaunched = false;
    npc.gotLaunched();
    expect(npc.actionState).toBe(OG_STATE.IDLE);
    const dying = fighter();
    dying.startAction(OG_STATE.DYING);
    dying.gotLaunched();
    expect(dying.actionState).toBe(OG_STATE.DYING);
  });

  it('LAUNCH_KNOCKDOWN only on the ground: KNOCKDOWNED, snapped to the ground, bar hidden (:570-583)', () => {
    const npc = fighter();
    npc.y = GROUND + 4;
    npc.gotHit(OG_PART.torso, hit(10, 15, OG_LAUNCH.LAUNCH_KNOCKDOWN));
    expect(npc.actionState).toBe(OG_STATE.KNOCKDOWNED);
    expect(npc.y).toBe(GROUND);
    expect(npc.healthBarVisible).toBe(false);
    const air = fighter();
    air.y = GROUND - 30;
    air.gotKnockDown();
    expect(air.actionState).toBe(OG_STATE.IDLE);
  });

  it('LAUNCH_FLY: FLY state, FLY_START clip, faces AGAINST the velocity, bar hidden (:585-609)', () => {
    const npc = fighter();
    const d = hit(10, 15, OG_LAUNCH.LAUNCH_FLY);
    d.setFlyVel(8, -12);
    npc.gotHit(OG_PART.torso, d);
    expect(npc.actionState).toBe(OG_STATE.FLY);
    expect(npc.animation).toBe(OG_ANIM.FLY_START);
    expect(npc.facingRight).toBe(false);
    expect([npc.velX, npc.velY]).toEqual([8, -12]);
    expect(npc.healthBarVisible).toBe(false);
  });

  it('gotFly on a body already at 0 hp dies instead of flying (:591-595)', () => {
    const npc = fighter();
    npc.setHP(0);
    npc.gotFly(8, -12);
    expect(npc.dead).toBe(true);
  });

  it('LAUNCH_FLYAWAY reads the hit PART\'s x against the body\'s screen x (:482, :611-637)', () => {
    // The part's x is the port's answer; 0 < 400 → "the point is to the left" → face left, fly right.
    const npc = fighter({ partX: 0 });
    npc.gotHit(OG_PART.torso, hit(10, 15, OG_LAUNCH.LAUNCH_FLYAWAY));
    expect(npc.actionState).toBe(OG_STATE.FLY);
    expect(npc.facingRight).toBe(false);
    expect([npc.velX, npc.velY]).toEqual([20, -10]);
    const other = fighter({ partX: 900 });
    other.gotHit(OG_PART.torso, hit(10, 15, OG_LAUNCH.LAUNCH_FLYAWAY));
    expect(other.facingRight).toBe(true);
    expect([other.velX, other.velY]).toEqual([-20, -10]);
  });

  it('KNEEGROIN: VICTIM state, the victim clip, moved to the attacker\'s point, faces it (:639-656)', () => {
    const npc = fighter();
    const d = hit(10, 15, OG_LAUNCH.KNEEGROIN);
    d.setFlyVel(500, GROUND); // the point rides in the velocity slots
    npc.gotHit(OG_PART.torso, d);
    expect(npc.actionState).toBe(OG_STATE.VICTIM);
    expect(npc.animation).toBe(OG_ANIM.KNEEGROIN_VICTIM);
    expect([npc.posX, npc.x, npc.y]).toEqual([500, 500, GROUND]);
    expect(npc.facingRight).toBe(true);
  });

  it('BACKTHROW: like KNEEGROIN, and hides the bar (:658-676)', () => {
    const npc = fighter();
    const d = hit(10, 15, OG_LAUNCH.BACKTHROW);
    d.setFlyVel(300, GROUND);
    npc.gotHit(OG_PART.torso, d);
    expect(npc.actionState).toBe(OG_STATE.VICTIM);
    expect(npc.animation).toBe(OG_ANIM.BACKTHROW_VICTIM);
    expect(npc.facingRight).toBe(false);
    expect(npc.healthBarVisible).toBe(false);
  });

  it('STUN: STUN state for the duration, ZOM_IDLE, optional forced x; doStun counts it down to IDLE (:678-700)', () => {
    const npc = fighter();
    const d = hit(10, 15, OG_LAUNCH.STUN);
    d.setStunTime(5, 250);
    npc.gotHit(OG_PART.torso, d);
    expect(npc.actionState).toBe(OG_STATE.STUN);
    expect(npc.stunCounter).toBe(5);
    expect(npc.animation).toBe(OG_ANIM.ZOM_IDLE);
    expect(npc.posX).toBe(250);
    for (let i = 0; i < 4; i++) npc.doStun();
    expect(npc.actionState).toBe(OG_STATE.STUN);
    npc.doStun();
    expect(npc.actionState).toBe(OG_STATE.IDLE);
    const stay = fighter();
    stay.gotStun(3); // posx 0 → position untouched
    expect(stay.posX).toBe(400);
  });

  it('a DOWNED body hit with LAUNCH_AIR is NOT re-launched — the dispatch guard is the only thing stopping it (:473)', () => {
    // gotLaunched() itself would re-launch a downed body (the source's :538 guard is
    // dead code — see Npc.ts header), so this `!isDowned()` in gotHit is load-bearing.
    const npc = fighter();
    npc.startAction(OG_STATE.DOWNED);
    npc.gotHit(OG_PART.torso, hit(10, 15, OG_LAUNCH.LAUNCH_AIR));
    expect(npc.actionState).toBe(OG_STATE.DOWNED);
    expect(npc.getHP()).toBe(42);
  });

  it('a downed body takes no knockdown, fly, knee or stun (:572, :587, :641, :680)', () => {
    for (const state of [OG_STATE.DOWNED, OG_STATE.KNOCKDOWNED, OG_STATE.VICTIM]) {
      const npc = fighter();
      npc.startAction(state);
      npc.gotKnockDown();
      npc.gotFly(5, -5);
      npc.gotKneeGroin(1, 1, 1);
      npc.gotStun(9);
      expect(npc.actionState, `state ${state}`).toBe(state);
    }
  });
});

// -------------------------------------------------------------- physics --

describe('NPC.as:702-745 — doLaunched and doFly, one frame per call', () => {
  it('doLaunched: gravity 3, the PEAK clip inside −4 < velY < 0, lands DOWNED on frame 18 (:702-723)', () => {
    const npc = fighter();
    npc.gotLaunched();
    const peaks: number[] = [];
    let frames = 0;
    while (npc.actionState === OG_STATE.GOTLAUNCHED && frames < 100) {
      npc.doLaunched();
      frames++;
      if (npc.animation === OG_ANIM.GOTLAUNCHED_PEAK) peaks.push(frames);
    }
    expect(frames).toBe(18);
    expect(npc.actionState).toBe(OG_STATE.DOWNED);
    expect(npc.y).toBe(GROUND);
    expect(npc.healthBarVisible).toBe(false);
    // velY runs −25, −22, … and is −1 after the 8th frame — the only frame in the band.
    expect(peaks[0]).toBe(8);
    expect(npc.posX).toBe(400 - 3 * 18);
  });

  it('doLaunched at a stage edge re-launches and DOUBLES velX (:718-722)', () => {
    const npc = fighter();
    npc.setPosition(10, GROUND);
    npc.gotLaunched(); // facing right → velX −3, heading for the left edge
    npc.doLaunched();
    expect(npc.actionState).toBe(OG_STATE.GOTLAUNCHED);
    expect(npc.velY).toBe(-20); // the re-launch is the airborne (juggle) case
    expect(Math.abs(npc.velX)).toBe(6);
  });

  it('doFly: gravity 1, lands (FLY_END) at ground − 10, then idles until the clip ends (:725-745)', () => {
    const npc = fighter();
    npc.gotFly(8, -12);
    let frames = 0;
    while (npc.animation !== OG_ANIM.FLY_END && frames < 200) {
      npc.doFly();
      frames++;
    }
    expect(npc.animation).toBe(OG_ANIM.FLY_END);
    expect(npc.y).toBe(GROUND);
    // −12, −11, … : velY turns positive on frame 13; y is back near the ground ~frame 25.
    expect(frames).toBeGreaterThan(13);
    const x = npc.posX;
    npc.doFly();
    expect(npc.posX, 'FLY_END is a full stop').toBe(x);
  });

  it('doFly at a stage edge re-launches and doubles velX (:740-744)', () => {
    const npc = fighter();
    npc.setPosition(WIDTH - 10, GROUND);
    npc.gotFly(8, -12); // velX > 0 heading off the right edge
    npc.doFly();
    expect(npc.actionState).toBe(OG_STATE.GOTLAUNCHED);
    expect(Math.abs(npc.velX)).toBe(6); // gotLaunched reset it to ±3, then ×2
  });

  it('isDowned / isAirborne (:767-775)', () => {
    const npc = fighter();
    for (const s of [OG_STATE.DOWNED, OG_STATE.KNOCKDOWNED, OG_STATE.FLY, OG_STATE.VICTIM]) {
      npc.startAction(s);
      expect(npc.isDowned(), `state ${s}`).toBe(true);
    }
    npc.startAction(OG_STATE.IDLE);
    expect(npc.isDowned()).toBe(false);
    npc.y = GROUND - OG_NPC_AIRBORNE_ABOVE_GROUND;
    expect(npc.isAirborne()).toBe(false);
    npc.y = GROUND - OG_NPC_AIRBORNE_ABOVE_GROUND - 1;
    expect(npc.isAirborne()).toBe(true);
  });
});

// --------------------------------------------------------------- flinch --

describe('NPC.as:747-765 — doFlinch / endFlinch save and restore the interrupted action', () => {
  it('records state, clip and frame; endFlinch puts them back', () => {
    const npc = fighter();
    npc.startAction(OG_STATE.WALK);
    npc.startAnim(OG_ANIM.KATANAWALK);
    npc.stepAnimation();
    npc.stepAnimation();
    npc.doFlinch();
    expect(npc.actionState).toBe(OG_STATE.FLINCH);
    expect(npc.animation).toBe(OG_ANIM.FLINCH_WEAPON);
    npc.endFlinch();
    expect(npc.actionState).toBe(OG_STATE.WALK);
    expect(npc.animation).toBe(OG_ANIM.KATANAWALK);
    expect(npc.frameCounter).toBe(2);
  });

  it('does nothing mid-flinch or mid-slash (:749)', () => {
    const npc = fighter();
    npc.startAction(OG_STATE.SLASH);
    npc.startAnim(OG_ANIM.KATANAWALK);
    npc.doFlinch();
    expect(npc.actionState).toBe(OG_STATE.SLASH);
    expect(npc.animation).toBe(OG_ANIM.KATANAWALK);
  });
});

// ------------------------------------------------------------------ die --

describe('NPC.as:898-1117 — die(): loot, XP, then a death chosen by state and dice', () => {
  const lootRow = { id: 0, qty: 2, chance: 0.5 } as const;
  const dying = (o: Opts = {}): Probe => {
    const npc = fighter(o);
    npc.reward = [lootRow];
    npc.setHP(0);
    return npc;
  };

  it('pays loot and XP first, unless playback or dontGiveLoot (:904-908)', () => {
    // rng: loot chance roll 0.3 (< 50 → drop) · movtx · movty · movtx · movty · flip · dice
    const npc = dying({ rng: seq(0.3, 0.5, 0.5, 0.5, 0.5, 0.9, 0.1) });
    npc.die();
    expect(ofType(npc.events, 'sound')).toEqual([{ type: 'sound', name: 'die' }]);
    expect(ofType(npc.events, 'lootProjectile').length).toBe(2);
    expect(ofType(npc.events, 'loot')).toEqual([{ type: 'loot', kind: 'coins', amount: 2, itemId: null, level: 10 }]);
    expect(ofType(npc.events, 'xp')).toEqual([{ type: 'xp', amount: Npc.calcXP(20, 10, npc.xp, false) }]);

    const replay = dying({ world: { playback: true } });
    replay.die();
    expect(ofType(replay.events, 'loot')).toEqual([]);
    expect(ofType(replay.events, 'xp')).toEqual([]);
    const silent = dying();
    silent.dontGiveLoot = true;
    silent.die();
    expect(ofType(silent.events, 'xp')).toEqual([]);
  });

  it('a failed chance roll drops nothing; red-freeze suppresses the projectiles but not the payout (:806-859)', () => {
    const none = dying({ rng: seq(0.7) }); // 70 ≥ 50 → no drop
    none.die();
    expect(ofType(none.events, 'loot')).toEqual([]);
    const frozen = dying({ rng: seq(0.3), world: { redFreeze: true } });
    frozen.reward = [{ id: 1, qty: 3, chance: 1 }]; // chance 100 → no roll at all
    frozen.die();
    expect(ofType(frozen.events, 'lootProjectile')).toEqual([]);
    expect(ofType(frozen.events, 'loot')).toEqual([{ type: 'loot', kind: 'coins', amount: 15, itemId: null, level: 10 }]);
  });

  it('loot types 2 / 3 / other route to quest item / random item / basic item (:845-857)', () => {
    const npc = dying({ rng: seq(0.5), world: { redFreeze: true } });
    npc.reward = [
      { id: 2, qty: 1, chance: 1 },
      { id: 3, qty: 1, chance: 1 },
      { id: 20040, qty: 4, chance: 1 },
    ];
    npc.die();
    expect(ofType(npc.events, 'loot')).toEqual([
      { type: 'loot', kind: 'questItem', amount: 1, itemId: null, level: 10 },
      { type: 'loot', kind: 'randomItem', amount: 1, itemId: null, level: 10 },
      { type: 'loot', kind: 'itemBasic', amount: 4, itemId: 20040, level: 10 },
    ]);
  });

  it('loot spills from 50 px up, spread ±8 with a signed spin, and 100 px behind a downed body (:788-834)', () => {
    // chance 1 → no roll; then movtx, movty, movtx, movty
    const npc = dying({ rng: seq(0.0, 0.5, 1.0, 0.5) });
    npc.startAction(OG_STATE.DOWNED);
    npc.reward = [{ id: 0, qty: 2, chance: 1 }];
    npc.die();
    const drops = ofType(npc.events, 'lootProjectile');
    expect(drops.map((d) => [d.x, d.y, d.velX, d.rot, d.lootType])).toEqual([
      [300, GROUND - 50, -8, -20, 0],
      [300, GROUND - 50, 8, 20, 0],
    ]);
    // coins lift −20 − rand×10; the second roll was 0.5 → −25
    expect(drops.map((d) => d.velY)).toEqual([-25, -25]);
  });

  it('near an edge the spread is flipped inward (:813-819)', () => {
    const npc = dying({ rng: seq(0.0, 0.5) });
    npc.setPosition(50, GROUND);
    npc.reward = [{ id: 0, qty: 1, chance: 1 }];
    npc.die();
    expect(ofType(npc.events, 'lootProjectile')[0]?.velX).toBe(8);
  });

  it('killed mid-launch: just dead, the launch continues (:909-913)', () => {
    const npc = dying();
    npc.startAction(OG_STATE.GOTLAUNCHED);
    npc.die();
    expect(npc.dead).toBe(true);
    expect(npc.actionState).toBe(OG_STATE.GOTLAUNCHED);
    expect(ofType(npc.events, 'death')).toEqual([]);
  });

  it('killed while downed: DYING with DEATHDOWNED (:914-923)', () => {
    const npc = dying();
    npc.startAction(OG_STATE.DOWNED);
    npc.die();
    expect([npc.dead, npc.actionState, npc.animation]).toEqual([true, OG_STATE.DYING, OG_ANIM.DEATHDOWNED]);
    expect(ofType(npc.events, 'death')).toEqual([{ type: 'death', anim: OG_ANIM.DEATHDOWNED, behead: false, downed: true, dice: -1 }]);
  });

  it('killed mid-seppuku: SEPPUKU_MID, or SEPPUKU_NOHEAD when beheaded and uncensored (:924-960)', () => {
    const mid = dying();
    mid.startAnim(OG_ANIM.SEPPUKU_START);
    mid.die();
    expect(mid.animation).toBe(OG_ANIM.SEPPUKU_MID);
    const nohead = dying();
    nohead.startAnim(OG_ANIM.SEPPUKU_START);
    nohead.behead = true;
    nohead.die();
    expect(nohead.animation).toBe(OG_ANIM.SEPPUKU_NOHEAD);
    const censored = dying({ world: { censored: true } });
    censored.startAnim(OG_ANIM.SEPPUKU_START);
    censored.behead = true;
    censored.die();
    expect(censored.animation).toBe(OG_ANIM.SEPPUKU_MID);
  });

  it('a standing death snaps to the ground, coin-flips the facing, and hides the bar (:962-975, :1116)', () => {
    // rng #1 is the loot chance roll (0.9 → no drop); #2 is the flip: 0.2×2 < 1 → turn
    const turned = dying({ rng: seq(0.9, 0.2) });
    turned.y = GROUND - 20;
    turned.die();
    expect([turned.y, turned.actionState, turned.facingRight, turned.healthBarVisible]).toEqual([GROUND, OG_STATE.DYING, false, false]);
    const kept = dying({ rng: seq(0.9, 0.7) });
    kept.die();
    expect(kept.facingRight).toBe(true);
  });

  it('fatal + uncensored: a 7-way dice picks the clip; 6 also throws the weapon and hat (:1005-1090)', () => {
    const cases: Array<[roll: number, anim: string, dice: number, extra: string[]]> = [
      [0.1, OG_ANIM.ENEMYDEATH, 0, []],
      [0.2, OG_ANIM.ENEMYDEATH, 1, []],
      [0.3, OG_ANIM.DEATH_FORWARD, 2, []],
      [0.45, OG_ANIM.DEFEATED2, 3, []],
      [0.6, OG_ANIM.ENEMYDEATHNOHAND, 4, []],
      [0.75, OG_ANIM.DEATHINHALF, 5, []],
      [0.9, OG_ANIM.ENEMYDEATH, 6, ['flyingWeapon', 'flyingHat']],
    ];
    for (const [roll, anim, dice, extra] of cases) {
      const npc = dying({ rng: seq(0.9, roll) });
      npc.die();
      expect(npc.animation, `roll ${roll}`).toBe(anim);
      expect(ofType(npc.events, 'death')).toEqual([{ type: 'death', anim, behead: false, downed: false, dice }]);
      expect(npc.events.filter((e) => e.type === 'flyingWeapon' || e.type === 'flyingHat').map((e) => e.type)).toEqual(extra);
    }
  });

  it('dice 3 under red-freeze falls through to the weapon-throwing default (:1017)', () => {
    const npc = dying({ rng: seq(0.9, 0.45), world: { redFreeze: true } });
    npc.die();
    expect(npc.animation).toBe(OG_ANIM.ENEMYDEATH);
    expect(ofType(npc.events, 'flyingWeapon').length).toBe(1);
  });

  it('fatal + uncensored + beheaded: ENEMYDEATHNOHEAD, no dice (:977-1003)', () => {
    const npc = dying({ rng: seq(0.9, 0.9) });
    npc.behead = true;
    npc.die();
    expect(npc.animation).toBe(OG_ANIM.ENEMYDEATHNOHEAD);
    expect(ofType(npc.events, 'death')[0]?.behead).toBe(true);
  });

  it('censored or non-fatal + beheaded: ENEMYDEATH with the hat flying (:1091-1103)', () => {
    const npc = dying({ world: { censored: true } });
    npc.behead = true;
    npc.die();
    expect(npc.animation).toBe(OG_ANIM.ENEMYDEATH);
    expect(npc.events.filter((e) => e.type === 'flyingHat').length).toBe(1);
    expect(npc.events.filter((e) => e.type === 'flyingWeapon').length).toBe(0);
  });

  it('censored or non-fatal: a 5-way dice; 4 throws the weapon only (:1094-1115)', () => {
    const cases: Array<[roll: number, anim: string, weapon: number]> = [
      [0.1, OG_ANIM.ENEMYDEATH, 0],
      [0.5, OG_ANIM.DEATH_FORWARD, 0],
      [0.7, OG_ANIM.DEFEATED2, 0],
      [0.9, OG_ANIM.ENEMYDEATH, 1],
    ];
    for (const [roll, anim, weapon] of cases) {
      const npc = dying({ rng: seq(0.9, roll) });
      npc.setFatal(false);
      npc.die();
      expect(npc.animation, `roll ${roll}`).toBe(anim);
      expect(npc.events.filter((e) => e.type === 'flyingWeapon').length).toBe(weapon);
    }
  });

  it('checkDie dies at 0 hp and reports it; isGoingToDie is the read-only twin (:521-534)', () => {
    const npc = fighter();
    expect(npc.checkDie()).toBe(false);
    npc.setHP(0);
    expect(npc.isGoingToDie()).toBe(true);
    expect(npc.checkDie()).toBe(true);
    expect(npc.dead).toBe(true);
  });
});

// ------------------------------------------------------- fade / freeze --

describe('NPC.as:1119-1196 — deathAnimEnd, doDying, redFreeze, updateHealthBar', () => {
  it('the body lingers 96 frames, fades over the last 12, then disposes (:1130-1143)', () => {
    const npc = fighter();
    for (let i = 0; i < OG_NPC_DEFAULTS.ttlMax - OG_NPC_FADE_FRAMES; i++) npc.deathAnimEnd();
    expect(npc.alpha).toBe(1);
    npc.deathAnimEnd();
    expect(npc.alpha).toBeCloseTo(11 / 12);
    for (let i = 0; i < 10; i++) npc.deathAnimEnd();
    expect(npc.disposed).toBe(false);
    npc.deathAnimEnd();
    expect([npc.ttl, npc.visible, npc.disposed]).toEqual([0, false, true]);
    expect(ofType(npc.events, 'dispose').length).toBe(1);
  });

  it('doDying is the same countdown (:1146-1163), and red-freeze pauses both (:1126, :1148)', () => {
    const npc = fighter();
    npc.doDying();
    expect(npc.ttl).toBe(OG_NPC_DEFAULTS.ttlMax - 1);
    npc.world.redFreeze = true;
    npc.doDying();
    npc.deathAnimEnd();
    expect(npc.ttl).toBe(OG_NPC_DEFAULTS.ttlMax - 1);
  });

  it('redFreeze darkens a live body, hides a fading one, and freezes the clock unless airborne or dying (:1165-1180)', () => {
    const live = fighter();
    live.redFreeze();
    expect([live.filter, live.visible, live.healthBarVisible, live.animFrozen]).toEqual(['dark', true, false, true]);
    const fading = fighter();
    fading.alpha = 0.5;
    fading.redFreeze();
    expect(fading.visible).toBe(false);
    for (const s of [OG_STATE.GOTLAUNCHED, OG_STATE.DYING, OG_STATE.FLY]) {
      const npc = fighter();
      npc.startAction(s);
      npc.redFreeze();
      expect(npc.animFrozen, `state ${s}`).toBe(false);
    }
  });

  it('updateHealthBar hides at 0 and shows the fraction otherwise (:1182-1193)', () => {
    const npc = fighter();
    npc.setHP(25);
    npc.updateHealthBar();
    expect([npc.healthBarVisible, npc.healthBarFraction]).toEqual([true, 0.5]);
    npc.setHP(0);
    npc.updateHealthBar();
    expect(npc.healthBarVisible).toBe(false);
  });
});

// ------------------------------------------------------------- targets --

describe('NPC.as:262-266, :1200-1215 — targets and facing', () => {
  it('faceTarget turns toward the target\'s screen x; changeTarget swaps it', () => {
    const npc = fighter({ target: targetAt(100) });
    npc.faceTarget();
    expect(npc.facingRight).toBe(false);
    npc.changeTarget(targetAt(700));
    npc.faceTarget();
    expect(npc.facingRight).toBe(true);
  });

  it('setIsFriendly flips the flag and re-targets the nearest ENEMY of a friendly', () => {
    const calls: Array<[number, boolean]> = [];
    const ally = targetAt(600);
    const npc = fighter({
      world: {
        nearestEnemy: (x, isEnemy) => {
          calls.push([x, isEnemy]);
          return ally;
        },
      },
    });
    npc.setIsFriendly();
    expect(npc.isFriendly).toBe(true);
    expect(npc.target).toBe(ally);
    expect(calls).toEqual([[400, false]]);
  });

  it('disposeMCS drops the body once; getNetworkPlayer is "" ; setScale is uniform (:1217-1236)', () => {
    const npc = fighter();
    npc.setScale(2);
    expect(npc.scale).toBe(2);
    expect(npc.getNetworkPlayer()).toBe('');
    npc.disposeMCS();
    npc.disposeMCS();
    expect(npc.disposed).toBe(true);
    expect(ofType(npc.events, 'dispose').length).toBe(1);
  });
});

// ----------------------------------------------------------- anim clock --

describe('MCSCharacter.as:1280-1345 — the animation clock every subclass switches on', () => {
  it('startAnim: same clip is a no-op; unknown clip is a no-op; a new clip resets the frame', () => {
    const npc = make();
    npc.startAnim('a');
    npc.stepAnimation();
    npc.startAnim('a');
    expect(npc.frameCounter).toBe(1);
    npc.startAnim('missing');
    expect(npc.animation).toBe('a');
    npc.startAnim('b');
    expect([npc.animation, npc.frameCounter]).toEqual(['b', 0]);
  });

  it('stepAnimation returns the key exactly once, on the frame a non-looping clip finishes', () => {
    const npc = make();
    npc.startAnim('a');
    expect([npc.stepAnimation(), npc.stepAnimation(), npc.stepAnimation(), npc.stepAnimation()]).toEqual(['', '', 'a', '']);
    // NPC.as:272 — the public wrapper steps the same clock and discards the key.
    npc.startAnim('b');
    npc.updateAnimation();
    expect(npc.frameCounter).toBe(1);
  });

  it('a looping clip wraps to frame 0 and never reports finishing', () => {
    const npc = make();
    npc.startAnim('loopclip');
    const out = [npc.stepAnimation(), npc.stepAnimation(), npc.stepAnimation(), npc.stepAnimation(), npc.stepAnimation()];
    expect(out).toEqual(['', '', '', '', '']);
    expect(npc.frameCounter).toBe(1);
  });

  it('setPose freezes the clock on one frame and leaves the key alone', () => {
    const npc = make();
    npc.startAnim('a');
    npc.setPose('a', 2);
    expect([npc.stepAnimation(), npc.stepAnimation(), npc.stepAnimation(), npc.stepAnimation()]).toEqual(['', '', '', '']);
    expect(npc.animation).toBe('a');
  });
});

// ---------------------------------------------------------- determinism --

describe('the base is deterministic under the injected rng', () => {
  it('two actors with the same seed and the same inputs emit identical events', () => {
    const run = (): NpcEvent[] => {
      const npc = fighter({ rng: mulberry32(7) });
      npc.reward = [{ id: 0, qty: 3, chance: 0.5 }, { id: 3, qty: 1, chance: 0.9 }];
      npc.gotHit(OG_PART.head, hit(10, 15, OG_LAUNCH.LAUNCH_AIR));
      for (let i = 0; i < 20; i++) npc.doLaunched();
      npc.setHP(0);
      npc.die();
      for (let i = 0; i < 100; i++) npc.deathAnimEnd();
      return npc.events;
    };
    expect(run()).toEqual(run());
  });
});
