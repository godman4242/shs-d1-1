/**
 * LANE L4b, SLICE 3b — `EnemyBoar` (ai 18) and `EnemyWolfAlpha` (ai 11, and ai 16
 * in the ROOM dispatch only). Both `extends NPC`, neither with children.
 *
 * Written from the `.as` files, not from the ports. Every "frame" is one `update()`
 * at 24 fps; every clip here is 3 frames.
 *
 * These two are where the lane stops being wanderers. The boar is the first actor
 * to override the REACTION side, and its three reaction overrides collapse into one
 * body — a knock-down and a fly both BECOME a launch. The alpha is a wolf at double
 * scale whose howl calls another wolf into the fight, and whose `gotHit` drops the
 * one guard that keeps a downed body on the floor.
 */
import { describe, expect, it } from 'vitest';
import { OG_ANIM, OG_LAUNCH, OG_PART, OG_STATE } from '../src/config/ogActor';
import { OG_BOAR } from '../src/config/ogEnemyBoar';
import { OG_SPEAR_ELITE } from '../src/config/ogEnemySpearElite';
import { OG_WOLF } from '../src/config/ogEnemyWolf';
import { OG_ALPHA } from '../src/config/ogEnemyWolfAlpha';
import { OG_ANIMAL } from '../src/config/ogNpcAnimal';
import { OG_NPC_LAUNCH } from '../src/config/ogNpcBase';
import { OG_NPCS } from '../src/config/ogNpcs';
import { EnemyBoar } from '../src/core/npc/EnemyBoar';
import { EnemyWolf } from '../src/core/npc/EnemyWolf';
import { EnemyWolfAlpha } from '../src/core/npc/EnemyWolfAlpha';
import type { Npc } from '../src/core/npc/Npc';
import { NpcDamage } from '../src/core/npc/NpcDamage';
import type { AnimLibrary, HitGeometry, HitShape, NpcEvent, NpcTarget, NpcWorld } from '../src/core/npc/types';
import type { Rng } from '../src/core/Sim';
import { counting, parked, rollsFor, seq } from './utils/npcHarness';

const GROUND = 358;
const WIDTH = 800;
const CLIP = 3;

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
const anims: AnimLibrary = { clip: () => ({ durationFrames: CLIP, loop: false }) };
const geometry: HitGeometry = { partAtPoint: () => null, partHitBy: () => null, partX: () => 0 };

class Dummy implements NpcTarget {
  hits: Array<{ part: unknown; damage: number; launchType: number }> = [];
  dead = false;
  constructor(
    public x: number,
    public y = GROUND,
  ) {}
  getMapPosition(): number {
    return this.x;
  }
  isDead(): boolean {
    return this.dead;
  }
  isDowned(): boolean {
    return false;
  }
  isAirborne(): boolean {
    return false;
  }
  checkHitObject(thing: HitShape, damage: NpcDamage): boolean {
    this.hits.push({ part: thing.part, damage: damage.damage, launchType: damage.launchType });
    return true;
  }
}

const ofType = <T extends NpcEvent['type']>(npc: Npc, type: T): Array<Extract<NpcEvent, { type: T }>> =>
  npc.events.filter((e): e is Extract<NpcEvent, { type: T }> => e.type === type);

const stats = (npc: Npc): void => {
  npc.setPosition(400, GROUND);
  npc.level = 10;
  npc.damage = 10;
  npc.defense = 3;
  npc.maxhp = 50;
  npc.setHP(50);
};

interface Opts {
  rng?: Rng;
  world?: Partial<NpcWorld>;
  target?: Dummy;
  doChase?: boolean;
}
const boar = (o: Opts = {}): { npc: EnemyBoar; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyBoar(
    world({ nearestEnemy: () => t, ...o.world }),
    anims,
    geometry,
    o.rng ?? seq(0.5),
    t,
    o.doChase ?? false,
  );
  stats(npc);
  return { npc, t };
};
const alpha = (o: Opts = {}): { npc: EnemyWolfAlpha; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyWolfAlpha(world({ nearestEnemy: () => t, ...o.world }), anims, geometry, o.rng ?? seq(0.5), t);
  stats(npc);
  return { npc, t };
};
const wolf = (o: Opts = {}): { npc: EnemyWolf; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyWolf(world({ nearestEnemy: () => t, ...o.world }), anims, geometry, o.rng ?? seq(0.5), t);
  stats(npc);
  return { npc, t };
};

const rowFor = (ai: number): NonNullable<ReturnType<typeof OG_NPCS.find>> => {
  const r = OG_NPCS.find((n) => n.ai === ai);
  if (r === undefined) throw new Error(`no roster row with ai ${ai}`);
  return r;
};

// ───────────────────────────────────────────────────────────────── the boar ──

describe('EnemyBoar — the first reaction-side overrides, and they collapse to one', () => {
  it('`gotKnockDown()` and `gotFly()` are ONE LINE each and both become a launch (`:353-361`)', () => {
    const a = boar().npc;
    a.startAction(OG_STATE.WALK);
    a.gotKnockDown();
    expect(a.actionState).toBe(OG_STATE.GOTLAUNCHED);
    expect(a.getAnim()).toBe(OG_ANIM.BOAR_ROLLING);
    expect(a.velY).toBe(OG_NPC_LAUNCH.velYGround); // the GROUND launch, not a knock-down

    const b = boar().npc;
    b.startAction(OG_STATE.WALK);
    b.gotFly(99, -99); // both velocities are accepted and discarded
    expect(b.actionState).toBe(OG_STATE.GOTLAUNCHED);
    expect(b.velY).toBe(OG_NPC_LAUNCH.velYGround);
    expect(Math.abs(b.velX)).toBe(OG_NPC_LAUNCH.velXAbs); // not 99
  });

  it('`canGotFly` RESTATES the base default — the wolf is the one that opts out (`:28` vs `NPC.as:74`)', () => {
    // All five canGot* flags are declared true on NPC.as:70-78. The boar never
    // writes false, so it inherits exposure; the wolf and the four wanderers do.
    // (The first measurement called the boar "the only animal with canGotFly = true"
    // from a grep that only saw classes which ASSIGN the flag — hence this pin.)
    const b = boar().npc;
    expect(b.canGotFly).toBe(true);
    expect(wolf().npc.canGotFly).toBe(false); // the wolf writes false
    expect(alpha().npc.canGotFly).toBe(false); // so does the alpha
    // The boar's `true` is not accidental permissiveness: the same constructor
    // DOES opt out of two flags, so it is choosing to stay exposed to the fly.
    expect([b.canGotKneeGroin, b.canGotStun]).toEqual([false, false]);
  });

  it('its `gotLaunched` has a REAL downed guard where the base\'s is dead code (`:295`)', () => {
    const downed = boar().npc;
    downed.startAction(OG_STATE.DOWNED);
    downed.gotLaunched();
    expect(downed.actionState).toBe(OG_STATE.DOWNED); // refused

    const dying = boar().npc;
    dying.actionState = OG_STATE.DYING;
    dying.gotLaunched();
    expect(dying.actionState).toBe(OG_STATE.DYING); // refused
  });

  it('…and NO `canGotLaunched` check at all, where the base returns on it (`NPC.as:538`)', () => {
    const a = boar().npc;
    a.canGotLaunched = false; // the base would refuse here
    a.startAction(OG_STATE.WALK);
    a.gotLaunched();
    expect(a.actionState).toBe(OG_STATE.GOTLAUNCHED); // the boar launches anyway
  });

  it('its airborne set omits FLY, which the base includes (`:299` vs `NPC.as:543`)', () => {
    const a = boar().npc;
    a.actionState = OG_STATE.FLY;
    a.gotLaunched();
    // FLY is not in the boar's airborne list, so it takes the GROUND branch.
    expect(a.velY).toBe(OG_NPC_LAUNCH.velYGround);

    const b = boar().npc;
    b.actionState = OG_STATE.FALL; // FALL is in the list
    b.gotLaunched();
    expect(b.velY).toBe(OG_NPC_LAUNCH.velYAirborne);
  });

  it('`doLaunched` lands into WALK, never into DOWNED (`:340`)', () => {
    const a = boar().npc;
    a.startAction(OG_STATE.GOTLAUNCHED);
    a.setPosition(400, GROUND - 1);
    a.velY = 50; // straight into the floor
    a.velX = 0;
    a.doLaunched();
    expect(a.y).toBe(GROUND);
    expect(a.actionState).toBe(OG_STATE.WALK);

    // …where the wolf's lands into DOWNED.
    const w = wolf().npc;
    w.startAction(OG_STATE.GOTLAUNCHED);
    w.setPosition(400, GROUND - 1);
    w.velY = 50;
    w.velX = 0;
    w.doLaunched();
    expect(w.actionState).toBe(OG_STATE.DOWNED);
  });

  it('a dead boar landing mid-launch DIES instead of walking (`:337-341`)', () => {
    const a = boar().npc;
    a.startAction(OG_STATE.GOTLAUNCHED);
    a.setPosition(400, GROUND - 1);
    a.velY = 50;
    a.velX = 0;
    a.dead = true;
    a.doLaunched();
    expect(a.actionState).toBe(OG_STATE.DYING);
  });

  it('RUN hits on EVERY frame — no range test and no overworld fence (`:195-201`)', () => {
    const t = new Dummy(9999); // nowhere near
    const a = boar({ target: t, world: { adventureMode: true } }).npc;
    a.destX = 9999;
    a.startAction(OG_STATE.RUN);
    a.doAction();
    a.doAction();
    expect(t.hits).toHaveLength(2);
    expect(t.hits[0]?.part).toBe(OG_PART.head);
  });

  it('`knocker` is rolled ONCE on entering RUN and decides the whole charge (`:141`)', () => {
    const t1 = new Dummy(9999);
    const hit = boar({ target: t1, rng: seq(0) }).npc; // int(0 * 4) === 0 → knocker
    hit.destX = 9999;
    hit.startAction(OG_STATE.RUN);
    expect(hit.knocker).toBe(true);
    hit.doAction();
    expect(t1.hits[0]?.launchType).toBe(OG_LAUNCH.LAUNCH_KNOCKDOWN);

    const t2 = new Dummy(9999);
    const plain = boar({ target: t2, rng: seq(0.5) }).npc; // int(0.5 * 4) === 2 → not
    plain.destX = 9999;
    plain.startAction(OG_STATE.RUN);
    expect(plain.knocker).toBe(false);
    plain.doAction();
    expect(t2.hits[0]?.launchType).toBe(OG_LAUNCH.LAUNCH_NONE);
  });

  it('the knocker roll is a d4 — one charge in four (`:141`)', () => {
    expect(OG_BOAR.knockerDice).toBe(4);
    const rolls = [0, 0.24, 0.25, 0.5, 0.75, 0.99].map((r) => {
      const a = boar({ rng: seq(r) }).npc;
      a.destX = 9999;
      a.startAction(OG_STATE.RUN);
      return a.knocker;
    });
    expect(rolls).toEqual([true, true, false, false, false, false]);
  });

  it('it charges at 10 — slower than every wanderer and than the wolf (`:133`/`:138`)', () => {
    const a = boar().npc;
    a.destX = 9999;
    a.startAction(OG_STATE.RUN);
    expect(a.walkSpeed).toBe(OG_BOAR.runSpeed);
    expect(OG_BOAR.runSpeed).toBeLessThan(OG_ANIMAL.runSpeed);
    expect(OG_BOAR.runSpeed).toBeLessThan(OG_WOLF.run.room);
  });

  it('the arrival coin is rolled ONLY in the overworld — a room always walks (`:208`)', () => {
    const room = counting(0);
    const a = boar({ rng: room, target: new Dummy(9999) }).npc;
    a.startAction(OG_STATE.RUN); // consumes the knocker roll
    const before = room.calls;
    a.destX = a.posX; // arrived
    a.walkSpeed = 0;
    a.doAction();
    expect(a.actionState).toBe(OG_STATE.WALK);
    // the WALK it entered rolls a destX; the arrival COIN is never rolled.
    expect(room.calls - before).toBe(1);

    const over = boar({ rng: seq(0), target: new Dummy(9999), world: { adventureMode: true } }).npc;
    over.startAction(OG_STATE.RUN);
    over.destX = over.posX;
    over.walkSpeed = 0;
    over.doAction();
    expect(over.actionState).toBe(OG_STATE.IDLE); // the coin rolled 0 → IDLE
  });

  it('⚠️ the off-stage red-freeze plays a DEER clip — the source\'s bug (`:219`)', () => {
    const a = boar({ rng: seq(0), world: { adventureMode: true }, target: new Dummy(9999) }).npc;
    a.setPosition(-OG_ANIMAL.offStage.dest, GROUND);
    a.startAction(OG_STATE.RUN);
    a.destX = a.posX;
    a.walkSpeed = 0;
    a.doAction();
    expect(a.actionState).toBe(OG_STATE.REDFREEZE);
    expect(a.getAnim()).toBe(OG_ANIM.DEER_IDLE); // not BOAR_IDLE
  });

  it('entering GOTLAUNCHED plays BOAR_ROLLING (`:157-158`)', () => {
    const a = boar().npc;
    a.startAction(OG_STATE.GOTLAUNCHED);
    expect(a.getAnim()).toBe(OG_ANIM.BOAR_ROLLING);
  });

  it('`die()` bails out mid-launch, paying nothing (`:277-281`)', () => {
    const a = boar().npc;
    a.actionState = OG_STATE.GOTLAUNCHED;
    a.die();
    expect(a.dead).toBe(true);
    expect(ofType(a, 'death')).toHaveLength(0);
    expect(ofType(a, 'xp')).toHaveLength(0);
    expect(a.getAnim()).not.toBe(OG_ANIM.BOAR_DEATH);
  });

  it('all three idle clips share one duration — set after the branch (`:113`)', () => {
    for (const [r, clip] of [
      [0, OG_ANIM.BOAR_IDLE],
      [0.4, OG_ANIM.BOAR_FIDGET],
      [0.9, OG_ANIM.BOAR_GRAZING],
    ] as const) {
      const a = boar({ rng: seq(r) }).npc;
      a.startAction(OG_STATE.IDLE);
      expect(a.getAnim(), `rng ${r}`).toBe(clip);
      expect(a.idleCounter, `rng ${r}`).toBe(OG_ANIMAL.idleFrames);
    }
  });

  it('an un-chased OVERWORLD boar never enters ATTACK, however close it gets (`:202`)', () => {
    const t = new Dummy(400);
    const a = boar({ target: t, doChase: false, world: { adventureMode: true } }).npc;
    a.destX = 9999;
    a.startAction(OG_STATE.RUN);
    a.walkSpeed = 0;
    a.doAction();
    expect(a.actionState).toBe(OG_STATE.RUN); // the gate is (doChase || !adventureMode)

    const b = boar({ target: new Dummy(400), doChase: true, world: { adventureMode: true } }).npc;
    b.destX = 9999;
    b.startAction(OG_STATE.RUN);
    b.walkSpeed = 0;
    b.doAction();
    expect(b.actionState).toBe(OG_STATE.ATTACK);
  });
});

// ──────────────────────────────────────────────────────────────── the alpha ──

describe('EnemyWolfAlpha — a wolf at double scale that calls for help', () => {
  it('its CONSTRUCTOR acts, like the wolf\'s and unlike all four wanderers (`:23`)', () => {
    const a = new EnemyWolfAlpha(world(), anims, geometry, seq(0.9), null); // 0.9 → no howl
    expect(a.getAnim()).toBe(OG_ANIM.WOLF_SNARL);
    expect(a.idleCounter).toBe(OG_ALPHA.idle.snarlFrames);
  });

  it('⚠️ and it can SPAWN A WOLF from its constructor, before `init` ever runs (`:23` → `:216` → `:289`)', () => {
    const a = new EnemyWolfAlpha(world(), anims, geometry, seq(0), null); // 0 → howl, 0 → left edge
    const spawns = ofType(a, 'spawn');
    expect(spawns).toHaveLength(1);
    expect(a.actionState).toBe(OG_STATE.POSE);
    expect(a.getAnim()).toBe(OG_ANIM.WOLF_HOWL);
  });

  it('the howl calls roster id 65, fatal, 50 px OUTSIDE an edge, a coin picking which (`:289-296`)', () => {
    const left = alpha({ rng: seq(0) }).npc;
    left.startAction(OG_STATE.POSE);
    const l = ofType(left, 'spawn');
    expect(l[l.length - 1]).toEqual({
      type: 'spawn',
      npcId: OG_ALPHA.spawn.npcId,
      x: -OG_ALPHA.spawn.edgeOffset,
      y: GROUND,
      fatal: true,
    });

    const right = alpha({ rng: seq(0.9) }).npc;
    right.startAction(OG_STATE.POSE);
    const r = ofType(right, 'spawn');
    expect(r[r.length - 1]?.x).toBe(WIDTH + OG_ALPHA.spawn.edgeOffset);
  });

  it('it does NOT howl for help in the overworld (`:288`)', () => {
    const a = alpha({ rng: seq(0), world: { adventureMode: true } }).npc;
    const before = ofType(a, 'spawn').length;
    a.startAction(OG_STATE.POSE);
    expect(ofType(a, 'spawn')).toHaveLength(before);
    expect(a.getAnim()).toBe(OG_ANIM.WOLF_HOWL); // it still howls, it just calls nobody
  });

  it('⚠️ a DOWNED alpha hit with launch-air LAUNCHES AGAIN; a downed wolf does not (`:489`)', () => {
    const a = alpha().npc;
    a.canGotLaunched = true; // the guard under test is the `!isDowned()` one, not this
    a.startAction(OG_STATE.DOWNED);
    a.gotHit(OG_PART.torso, new NpcDamage(1, 1, OG_LAUNCH.LAUNCH_AIR));
    expect(a.actionState).toBe(OG_STATE.GOTLAUNCHED);

    const w = wolf().npc;
    w.canGotLaunched = true;
    w.startAction(OG_STATE.DOWNED);
    w.gotHit(OG_PART.torso, new NpcDamage(1, 1, OG_LAUNCH.LAUNCH_AIR));
    expect(w.actionState).toBe(OG_STATE.DOWNED); // its `!isDowned()` guard holds it down
  });

  it('KNOCKDOWNED falls through into DOWNED, so it lies there EIGHT times as long (`:271-276`)', () => {
    const a = alpha().npc;
    a.startAction(OG_STATE.KNOCKDOWNED);
    expect(a.idleCounter).toBe(OG_ALPHA.downedFrames);
    expect(a.getAnim()).toBe(OG_ANIM.WOLF_LAUNCHEDEND);

    const w = wolf().npc;
    w.startAction(OG_STATE.KNOCKDOWNED);
    expect(w.idleCounter).toBe(OG_WOLF.downed.knockdownFrames);
    expect(OG_ALPHA.downedFrames).toBe(OG_WOLF.downed.launchedFrames);
    expect(OG_ALPHA.downedFrames / OG_WOLF.downed.knockdownFrames).toBe(8);
  });

  it('the arrival roll is a d4 whose outcome 2 HOWLS — the wolf\'s d3 has no such outcome (`:323-341`)', () => {
    expect(OG_ALPHA.arriveDice).toBe(4);
    expect(OG_WOLF.arriveDice).toBe(3);
    const a = alpha({ rng: seq(0.5) }).npc; // int(0.5 * 4) === 2 → POSE
    a.startAction(OG_STATE.WALK);
    a.destX = a.posX;
    a.walkSpeed = 0;
    a.doAction();
    expect(a.actionState).toBe(OG_STATE.POSE);
  });

  it('RUN re-rolls destX, which the wolf does not (`:248`)', () => {
    const a = alpha({ rng: seq(0.25) }).npc;
    a.destX = 777;
    a.startAction(OG_STATE.RUN);
    expect(a.destX).toBe(Math.trunc(0.25 * WIDTH)); // re-rolled

    const w = wolf({ rng: seq(0.25) }).npc;
    w.destX = 777;
    w.startAction(OG_STATE.RUN);
    expect(w.destX).toBe(777); // kept
  });

  it('RUN is a flat 15 in both modes; the wolf steps down in the overworld (`:251`/`:256`)', () => {
    const a = alpha({ rng: seq(0.99) }).npc;
    a.startAction(OG_STATE.RUN);
    expect(a.walkSpeed).toBe(OG_ALPHA.runSpeed);
    a.world.adventureMode = true;
    a.startAction(OG_STATE.RUN);
    expect(a.walkSpeed).toBe(OG_ALPHA.runSpeed); // no split

    const w = wolf().npc;
    w.destX = 9999;
    w.startAction(OG_STATE.RUN);
    expect(w.walkSpeed).toBe(OG_WOLF.run.room);
    w.world.adventureMode = true;
    w.startAction(OG_STATE.RUN);
    expect(w.walkSpeed).toBe(OG_WOLF.run.adventure); // it does split
  });

  it('the bite and pounce bands are wider than the wolf\'s, and strict (`:343`/`:347`)', () => {
    const at = (dist: number): number => {
      const t = new Dummy(400 + dist);
      const a = alpha({ target: t, rng: seq(0) }).npc;
      a.startAction(OG_STATE.WALK);
      a.destX = 9999;
      a.walkSpeed = 0;
      a.doAction();
      return a.actionState;
    };
    expect(at(100)).not.toBe(OG_STATE.ATTACK); // `> 100`, not `>=`
    expect(at(101)).toBe(OG_STATE.ATTACK);
    expect(at(149)).toBe(OG_STATE.ATTACK);
    expect(at(150)).toBe(OG_STATE.CHARGING); // `>= 150` starts the pounce band
    expect(at(299)).toBe(OG_STATE.CHARGING);
    expect(at(300)).not.toBe(OG_STATE.CHARGING); // `< 300`, not `<=`
    // and the wolf's bands really are the narrower pair
    expect([OG_ALPHA.bite.minX, OG_ALPHA.bite.maxX]).toEqual([100, 150]);
    expect([OG_WOLF.bite.minX, OG_WOLF.bite.maxX]).toEqual([50, 100]);
  });

  it('the pounce hits THREE parts, where the wolf hits two (`:400-404`)', () => {
    const t = new Dummy(400);
    const a = alpha({ target: t }).npc;
    a.startAction(OG_STATE.CHARGING);
    a.startAnim(OG_ANIM.WOLF_POUNCE_MID);
    a.doAction();
    expect(t.hits.map((h) => h.part)).toEqual([OG_PART.head, OG_PART.r_hand, OG_PART.torso]);

    const tw = new Dummy(400);
    const w = wolf({ target: tw }).npc;
    w.startAction(OG_STATE.CHARGING);
    w.startAnim(OG_ANIM.WOLF_POUNCE_MID);
    w.doAction();
    expect(tw.hits.map((h) => h.part)).toEqual([OG_PART.head, OG_PART.r_hand]);
  });

  it('FALL and LAND play the LAUNCHED clips, not the wolf\'s pounce clips (`:278`/`:281`)', () => {
    const a = alpha().npc;
    a.startAction(OG_STATE.FALL);
    expect(a.getAnim()).toBe(OG_ANIM.WOLF_LAUNCHED);
    a.startAction(OG_STATE.LAND);
    expect(a.getAnim()).toBe(OG_ANIM.WOLF_LAUNCHEDEND);

    const w = wolf().npc;
    w.startAction(OG_STATE.FALL);
    expect(w.getAnim()).toBe(OG_ANIM.WOLF_POUNCE_MIDHIGH);
    w.startAction(OG_STATE.LAND);
    expect(w.getAnim()).toBe(OG_ANIM.WOLF_POUNCE_END);
  });

  it('the pounce-mid clip ending has NO `actionState !== FALL` guard; the wolf\'s does (`:190-192`)', () => {
    // Airborne on purpose: on the ground, FALL lands on the first frame and the
    // LAND clip would mask what is being tested.
    const a = alpha().npc;
    a.setPosition(400, GROUND - 200);
    a.startAction(OG_STATE.FALL);
    a.startAnim(OG_ANIM.WOLF_POUNCE_MID);
    for (let i = 0; i < CLIP; i++) a.update();
    // Preflight at the ASSERTION, not the setup: session 35 parked this alpha in FALL on the
    // ground, the first update landed it, and the LAND clip masked the clip under test.
    parked(a, OG_STATE.FALL, 'airborne, so FALL does not land before the clip is read');
    expect(a.getAnim()).toBe(OG_ANIM.WOLF_POUNCE_END);

    const w = wolf().npc;
    w.setPosition(400, GROUND - 200);
    w.startAction(OG_STATE.FALL);
    w.startAnim(OG_ANIM.WOLF_POUNCE_MID);
    for (let i = 0; i < CLIP; i++) w.update();
    parked(w, OG_STATE.FALL, 'airborne, so FALL does not land before the clip is read');
    expect(w.getAnim()).toBe(OG_ANIM.WOLF_POUNCE_MID); // its guard refuses to advance
  });

  it('`init` doubles the scale and does NOT ground the body (`:34`, `:40-47`)', () => {
    const a = alpha().npc;
    a.setPosition(400, GROUND - 100); // in the air
    a.init(rowFor(11));
    expect(a.scale).toBe(OG_ALPHA.scale);
    expect(a.y).toBe(GROUND - 100);
    expect(a.actionState).toBe(OG_STATE.FALL); // off the ground → FALL, like the wolf
  });

  it('`setLevel` at or below level 5 is NEVER balanced — just stomped (`:74-78`)', () => {
    const a = alpha().npc;
    a.level = 10;
    a.damage = 40;
    a.defense = 12;
    a.maxhp = 200;
    a.setLevel(OG_ALPHA.setLevel.trivialLevel);
    expect(a.damage).toBe(OG_ALPHA.setLevel.trivialStat);
    expect(a.defense).toBe(OG_ALPHA.setLevel.trivialStat);
    // …and maxhp is NOT forced to 1 (the base's trivial floor does force it).
    expect(a.maxhp).toBeGreaterThan(OG_ALPHA.setLevel.trivialStat);
  });

  it('`setLevel` KEEPS the animal xp curve, where the stag\'s overwrites it (`:73`)', () => {
    const a = alpha().npc;
    a.level = 10;
    a.setLevel(30);
    expect(a.xp).toBe(30 * OG_ALPHA.xp.perLevel + OG_ALPHA.xp.base);
  });

  it('the balance gives it hp for `10 + lvldiff` hits and damage to kill in `15 − lvldiff` (`:86`/`:87`)', () => {
    const a = alpha({ world: { playerLevel: 20, playerStats: { maxHp: 200, defense: 40, minDamage: 30, damageRange: 20 } } }).npc;
    a.level = 20;
    a.damage = 1;
    a.defense = 0;
    a.maxhp = 1;
    a.setLevel(20); // lvldiff 0
    const playerATK = 30 + 20 / 2; // 40
    expect(a.maxhp).toBe(playerATK * OG_ALPHA.setLevel.hitsToKillBossBase);
    expect(a.damage).toBe(Math.trunc(200 / OG_ALPHA.setLevel.hitsToKillPlayerBase) + 40);
  });

  it('its floor chain FALLS THROUGH — a matching tier that fails hands the NEXT divisor (`:97-112`)', () => {
    // playerLVL 15, playerATK − defense = 1. Tier 2 matches on level (15 <= 20) but
    // `1 < 15/8 === 1` is false, so tier 3 runs and the floor becomes 15/6 === 2.
    const a = alpha({ world: { playerLevel: 15, playerStats: { maxHp: 100, defense: 0, minDamage: 1, damageRange: 0 } } }).npc;
    a.level = 15;
    a.damage = 0;
    a.defense = 0;
    a.maxhp = 1;
    a.setLevel(15);
    expect(a.maxhp).toBe(2 * OG_ALPHA.setLevel.hitsToKillBossBase); // 2, not 1
  });

  it('its balance is NOT the spear boss\'s copy — two numbers differ (`:87`, `:88-91`)', () => {
    const B = OG_SPEAR_ELITE.boss;
    const A = OG_ALPHA.setLevel;
    // Same where the source is the same…
    expect(A.hitsToKillBossBase).toBe(B.hitsToKillBossBase);
    expect(A.floor).toEqual(B.floor);
    expect(A.damageRangeDiv).toBe(2);
    // …and different exactly where it is not.
    expect(A.hitsToKillPlayerBase).toBe(15);
    expect(B.hitsToKillPlayerBase).toBe(18);
    expect(A.hitsToKillBossMin).toBe(1);
    expect(B.hitsToKillBossMin).toBe(3);
  });

  it('it reads no cutscene at all, where every other animal has exactly one (`grep`: 0)', () => {
    // rng 0.5 → int(1.5) === 1: not 0, so no howl; and 1 < 2, so the walk roll passes.
    // Every other animal's idle re-roll is fenced by `!isShowing()`; the alpha's is not.
    const a = alpha({ rng: seq(0.5), world: { cutsceneShowing: true } }).npc;
    const rolls = rollsFor(a, () => {
      a.startAction(OG_STATE.IDLE);
      a.idleCounter = 1;
      a.doAction();
    });
    // Preflight — every value the body consumed, MEASURED: the howl escape (`startAction`),
    // the walk escape (`doAction`), then WALK's `destX` and speed. The first two are the two
    // BANDS session 35's clamped seq(0.9) fed one value, and that run consumed only TWO — it
    // never escaped IDLE — so the values AND the count are pinned, not just the count.
    expect(rolls.values).toEqual([0.5, 0.5, 0.5, 0.5]);
    expect(a.actionState).toBe(OG_STATE.WALK); // it walked anyway, mid-cutscene
  });

  it('a head, neck or weapon hit doubles and beheads (`:466-473`)', () => {
    for (const part of [OG_PART.head, OG_PART.neck, OG_PART.weapon]) {
      const a = alpha().npc;
      a.defense = 0;
      a.gotHit(part, new NpcDamage(10, 0));
      expect(a.behead, String(part)).toBe(true);
      expect(a.getHP(), String(part)).toBe(50 - 10 * OG_ALPHA.partMult);
    }
    const plain = alpha().npc;
    plain.defense = 0;
    plain.gotHit(OG_PART.torso, new NpcDamage(10, 0));
    expect(plain.behead).toBe(false);
  });

  it('`doLaunched`, `die` and `redFreeze` match the wolf\'s exactly (`:524`, `:542`, `:566`)', () => {
    // redFreeze spares CHARGING in both.
    for (const make of [alpha, wolf]) {
      const n = make().npc;
      n.startAction(OG_STATE.CHARGING);
      n.redFreeze();
      expect(n.animFrozen).toBe(false);
      const m = make().npc;
      m.startAction(OG_STATE.WALK);
      m.redFreeze();
      expect(m.animFrozen).toBe(true);
    }
    // die() pays a sound, loot and xp, and bails mid-launch — in both.
    const a = alpha().npc;
    a.actionState = OG_STATE.GOTLAUNCHED;
    a.die();
    expect(ofType(a, 'sound').map((e) => e.name)).toContain('die');
    expect(ofType(a, 'death')).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────── config twins ──

describe('slice 3b config — what the alpha shares with the wolf, and what it does not', () => {
  it('the alpha\'s twins of the wolf do not drift', () => {
    expect(OG_ALPHA.arriveX).toBe(OG_WOLF.arriveX);
    expect(OG_ALPHA.pounceHighDice).toBe(OG_WOLF.pounceHighDice);
    expect(OG_ALPHA.pounceStep).toBe(OG_WOLF.pounceStep);
    expect(OG_ALPHA.partMult).toBe(OG_WOLF.partMult);
    expect(OG_ALPHA.xp).toEqual(OG_WOLF.xp);
    expect(OG_ALPHA.idle.retryFrames).toBe(OG_WOLF.idle.retryFrames);
    expect(OG_ALPHA.idle.walkBelow).toBe(OG_WOLF.idle.walkBelow);
  });

  it('…and the ones that are NOT twins really differ', () => {
    expect(OG_ALPHA.scale).not.toBe(OG_WOLF.scale);
    expect(OG_ALPHA.walk).not.toEqual(OG_WOLF.walk);
    expect(OG_ALPHA.arriveDice).not.toBe(OG_WOLF.arriveDice);
    expect(OG_ALPHA.bite).not.toEqual(OG_WOLF.bite);
    expect(OG_ALPHA.pounce.minX).not.toBe(OG_WOLF.pounce.minX);
  });

  it('the boar needs no launch number of its own — the arc is the base\'s', () => {
    const a = boar().npc;
    a.startAction(OG_STATE.WALK);
    a.gotLaunched();
    expect(a.velY).toBe(OG_NPC_LAUNCH.velYGround);
    expect(Math.abs(a.velX)).toBe(OG_NPC_LAUNCH.velXAbs);
  });
});
