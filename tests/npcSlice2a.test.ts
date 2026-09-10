/**
 * LANE L4b, SLICE 2a — PARENTS WITH THEIR CHILDREN: `EnemyWolf` (ai 8) → `EnemyWolf2`
 * (ai 10), `EnemyFox` (ai 24); `EnemyCivilian` (ai 7, the room fallback) →
 * `EnemyCivilianFemale` (ai 33), `EnemyCivilianOld` (ai 32).
 *
 * Written from the `.as` files, not from the ports. Every "frame" is one `update()`
 * at the original's 24 fps; every clip is 3 frames, so a finished-clip case fires on
 * the third step after `startAnim`. The wolf is the first actor to override the
 * RECEPTION side (`gotHit` / `doLaunched` / `die` / `redFreeze`); each of those is
 * pinned against the base's behaviour where the two differ.
 */
import { describe, expect, it } from 'vitest';
import { OG_ANIM, OG_LAUNCH, OG_PART, OG_STATE } from '../src/config/ogActor';
import { OG_NPC_FLOATING_TEXT, OG_NPC_HIT_IFRAMES } from '../src/config/ogNpcBase';
import { OG_NPCS } from '../src/config/ogNpcs';
import { EnemyCivilian } from '../src/core/npc/EnemyCivilian';
import { EnemyCivilianFemale } from '../src/core/npc/EnemyCivilianFemale';
import { EnemyCivilianOld } from '../src/core/npc/EnemyCivilianOld';
import { EnemyFox } from '../src/core/npc/EnemyFox';
import { EnemyWolf } from '../src/core/npc/EnemyWolf';
import { EnemyWolf2 } from '../src/core/npc/EnemyWolf2';
import type { Npc } from '../src/core/npc/Npc';
import { NpcDamage } from '../src/core/npc/NpcDamage';
import type { AnimLibrary, HitGeometry, HitShape, NpcEvent, NpcTarget, NpcWorld } from '../src/core/npc/types';
import type { Rng } from '../src/core/Sim';

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
  ...over,
});
const anims: AnimLibrary = { clip: () => ({ durationFrames: CLIP, loop: false }) };
const geometry: HitGeometry = { partAtPoint: () => null, partHitBy: () => null, partX: () => 0 };
const seq = (...vals: number[]): Rng => {
  let i = 0;
  return () => vals[Math.min(i++, vals.length - 1)] ?? 0;
};
/** An rng that counts its calls — for pinning that a roll is NOT made. */
const counting = (): Rng & { calls: number } => {
  const f = (() => {
    f.calls++;
    return 0.5;
  }) as Rng & { calls: number };
  f.calls = 0;
  return f;
};

/** A target that records every swing made at it, with the attacker's part. */
class Dummy implements NpcTarget {
  hits: Array<{ part: unknown; damage: number }> = [];
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
  checkHitObject(thing: HitShape, damage: NpcDamage): boolean {
    this.hits.push({ part: thing.part, damage: damage.damage });
    return true;
  }
}

const run = (npc: Npc, n: number): void => {
  for (let i = 0; i < n; i++) npc.update();
};
const untilState = (npc: Npc, state: number, max = 400): number => {
  let n = 0;
  while (npc.actionState !== state && n < max) {
    npc.update();
    n++;
  }
  return n;
};
const ofType = <T extends NpcEvent['type']>(npc: Npc, type: T): Array<Extract<NpcEvent, { type: T }>> =>
  npc.events.filter((e): e is Extract<NpcEvent, { type: T }> => e.type === type);

interface Opts {
  rng?: Rng;
  world?: Partial<NpcWorld>;
  target?: Dummy;
}
const stats = (npc: Npc): void => {
  npc.setPosition(400, GROUND);
  npc.level = 10;
  npc.damage = 10;
  npc.defense = 3;
  npc.maxhp = 50;
  npc.setHP(50);
};
const wolf = (o: Opts = {}): { npc: EnemyWolf; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyWolf(world({ nearestEnemy: () => t, ...o.world }), anims, geometry, o.rng ?? seq(0.5), t);
  stats(npc);
  return { npc, t };
};
const wolf2 = (o: Opts = {}): { npc: EnemyWolf2; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyWolf2(world({ nearestEnemy: () => t, ...o.world }), anims, geometry, o.rng ?? seq(0.5), t);
  stats(npc);
  return { npc, t };
};
const fox = (o: Opts = {}): { npc: EnemyFox; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyFox(world({ nearestEnemy: () => t, ...o.world }), anims, geometry, o.rng ?? seq(0.5), t);
  stats(npc);
  return { npc, t };
};
const civilian = (o: Opts & { doChase?: boolean; noTarget?: boolean } = {}): { npc: EnemyCivilian; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyCivilian(world(o.world), anims, geometry, o.rng ?? seq(0.5), o.noTarget ? null : t, o.doChase ?? false);
  stats(npc);
  return { npc, t };
};
const female = (o: Opts & { doChase?: boolean } = {}): { npc: EnemyCivilianFemale; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyCivilianFemale(world(o.world), anims, geometry, o.rng ?? seq(0.5), t, o.doChase ?? false);
  stats(npc);
  return { npc, t };
};
const old = (o: Opts = {}): { npc: EnemyCivilianOld; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyCivilianOld(world(o.world), anims, geometry, o.rng ?? seq(0.5), t);
  stats(npc);
  return { npc, t };
};
const hit = (damage: number, lvl = 10, launch: number = OG_LAUNCH.LAUNCH_NONE): NpcDamage => new NpcDamage(damage, lvl, launch);

/** Put a wolf in WALK with no movement of its own, so the distance checks are the only thing that acts. */
const walkStill = (npc: EnemyWolf): void => {
  npc.startAction(OG_STATE.WALK);
  npc.walkSpeed = 0;
  npc.destX = 0;
};

// -------------------------------------------------------------------- Wolf --

describe('EnemyWolf.as — construction, init, the wander loop', () => {
  it('the constructor snarls in IDLE and refuses fly / groin / stun but takes launch and knock-down (:12-22, :134-137)', () => {
    const { npc } = wolf();
    expect([npc.canGotLaunched, npc.canGotKnockDown, npc.canGotFly, npc.canGotKneeGroin, npc.canGotStun]).toEqual([
      true, true, false, false, false,
    ]);
    expect([npc.actionState, npc.animation, npc.idleCounter]).toEqual([OG_STATE.IDLE, OG_ANIM.WOLF_SNARL, 24]);
  });

  it('init: the body is scaled 1.2, xp is level·5+45, and it WALKs on the ground or FALLs in the air (:24-43)', () => {
    const row = OG_NPCS.find((n) => n.id === 65);
    expect(row).toBeDefined();
    if (row === undefined) return;
    const { npc } = wolf();
    npc.init(row);
    expect([npc.scale, npc.level, npc.xp, npc.damage, npc.maxhp, npc.actionState]).toEqual([1.2, 10, 95, 8, 40, OG_STATE.WALK]);
    const air = wolf().npc;
    air.setPosition(400, GROUND - 50);
    air.init(row);
    expect([air.actionState, air.animation]).toEqual([OG_STATE.FALL, OG_ANIM.WOLF_POUNCE_MIDHIGH]);
  });

  it('IDLE: 24 frames of snarl, then a half-second re-roll that walks two times in three — exact at 2/3 (:223-234)', () => {
    const { npc } = wolf({ rng: seq(0.666, 0.5, 0.5) });
    run(npc, 23);
    expect([npc.actionState, npc.idleCounter]).toEqual([OG_STATE.IDLE, 1]);
    npc.update();
    expect(npc.actionState).toBe(OG_STATE.WALK); // int(0.666·3) = 1 < 2
    const stays = wolf({ rng: seq(0.667) }).npc;
    run(stays, 24);
    expect([stays.actionState, stays.idleCounter]).toEqual([OG_STATE.IDLE, 12]); // int(0.667·3) = 2
  });

  it('WALK: a random destX, an int speed 4..5 signed toward it; walking AWAY from the target is the backwards clip at half speed (:139-158)', () => {
    // destX = int(0.9·800) = 720 > 400 → +int(0.5·2+4) = 5; the target at 100 is behind → backwards, 5/2 → 2.
    const { npc } = wolf({ rng: seq(0.9, 0.5) });
    npc.startAction(OG_STATE.WALK);
    expect([npc.destX, npc.walkSpeed, npc.animation, npc.facingRight]).toEqual([720, 2, OG_ANIM.WOLF_WALKBACKWARDS, false]);
    // destX = int(0.1·800) = 80 < 400 → −int(0.75·2+4) = −5, toward the target → the walk clip.
    const toward = wolf({ rng: seq(0.1, 0.75) }).npc;
    toward.startAction(OG_STATE.WALK);
    expect([toward.destX, toward.walkSpeed, toward.animation]).toEqual([80, -5, OG_ANIM.WOLF_WALK]);
  });

  it('RUN: 15 px per frame in a room, 12 in the overworld, signed toward destX, and faces that way (:160-186)', () => {
    const { npc } = wolf();
    npc.destX = 700;
    npc.startAction(OG_STATE.RUN);
    expect([npc.walkSpeed, npc.facingRight, npc.animation]).toEqual([15, true, OG_ANIM.WOLF_RUN]);
    npc.destX = 0;
    npc.startAction(OG_STATE.RUN);
    expect([npc.walkSpeed, npc.facingRight]).toEqual([-15, false]);
    const adv = wolf({ world: { adventureMode: true } }).npc;
    adv.destX = 700;
    adv.startAction(OG_STATE.RUN);
    expect(adv.walkSpeed).toBe(12);
  });

  it('arrival within 10 px of destX rolls a d3: 0 idles, 1 walks again, 2 runs somewhere new — exact at 10 (:236-253)', () => {
    const far = new Dummy(-1000);
    const idle = wolf({ rng: seq(0), target: far }).npc;
    idle.startAction(OG_STATE.WALK);
    idle.walkSpeed = 0;
    idle.destX = 409;
    idle.update();
    expect(idle.actionState).toBe(OG_STATE.IDLE);
    const notYet = wolf({ rng: seq(0), target: far }).npc;
    notYet.startAction(OG_STATE.WALK);
    notYet.walkSpeed = 0;
    notYet.destX = 410;
    notYet.update();
    expect(notYet.actionState).toBe(OG_STATE.WALK);
    const runs = wolf({ rng: seq(0.7, 0.9), target: far }).npc;
    runs.startAction(OG_STATE.WALK);
    runs.walkSpeed = 0;
    runs.destX = 400;
    runs.update();
    expect([runs.actionState, runs.destX]).toEqual([OG_STATE.RUN, 720]); // int(0.7·3) = 2 → new destX int(0.9·800)
  });
});

describe('EnemyWolf.as — bite, pounce, fall', () => {
  it('bites when 50 < dist < 100: 50 no, 51 yes, 99 yes; dist is an int, so 50.5 reads 50 (:254-258)', () => {
    const at = (tx: number): number => {
      const { npc } = wolf({ target: new Dummy(tx) });
      walkStill(npc);
      npc.update();
      return npc.actionState;
    };
    expect(at(350)).toBe(OG_STATE.WALK);
    expect(at(349)).toBe(OG_STATE.ATTACK);
    expect(at(301)).toBe(OG_STATE.ATTACK);
    expect(at(349.5)).toBe(OG_STATE.WALK);
  });

  it('pounces when 100 ≤ dist < 250 on a d3 of 0: 100 yes, 249 yes, 250 no, and never on a 1 (:259-262)', () => {
    const at = (tx: number, roll = 0): number => {
      const { npc } = wolf({ target: new Dummy(tx), rng: seq(roll) });
      walkStill(npc);
      npc.update();
      return npc.actionState;
    };
    expect(at(300)).toBe(OG_STATE.CHARGING);
    expect(at(151)).toBe(OG_STATE.CHARGING);
    expect(at(150)).toBe(OG_STATE.WALK);
    expect(at(300, 0.34)).toBe(OG_STATE.WALK);
  });

  it('ATTACK bites with the weapon part on every frame in a room and never in the overworld; the bite ends into WALK (:92-95, :187-190, :293-298)', () => {
    const { npc, t } = wolf({ target: new Dummy(330) });
    npc.startAction(OG_STATE.ATTACK);
    expect([npc.animation, npc.facingRight]).toEqual([OG_ANIM.WOLF_BITE, false]);
    run(npc, CLIP);
    // Two bites, then the clip ends into WALK — which, still 70 px away, re-enters ATTACK in the same frame.
    expect(t.hits.map((h) => h.part)).toEqual([OG_PART.weapon, OG_PART.weapon]);
    expect(npc.actionState).toBe(OG_STATE.ATTACK);
    const adv = wolf({ target: new Dummy(330), world: { adventureMode: true } });
    adv.npc.startAction(OG_STATE.ATTACK);
    run(adv.npc, CLIP - 1);
    expect(adv.t.hits).toEqual([]);
  });

  it('CHARGING: the pounce start ends into MIDHIGH on 0 or MID on 1; while airborne it carries 15 px a frame and tests head and right hand (:97-113, :191-194, :299-316)', () => {
    const { npc, t } = wolf({ target: new Dummy(700), rng: seq(0) });
    npc.startAction(OG_STATE.CHARGING);
    expect([npc.animation, npc.facingRight]).toEqual([OG_ANIM.WOLF_POUNCE_START, true]);
    run(npc, CLIP);
    expect(npc.animation).toBe(OG_ANIM.WOLF_POUNCE_MIDHIGH);
    // Frame 3 already moved (the switch runs before doAction); frames 4 and 5 move; frame 6 ends the clip into POUNCE_END.
    run(npc, CLIP);
    expect([npc.posX, npc.animation]).toEqual([445, OG_ANIM.WOLF_POUNCE_END]);
    expect(t.hits.map((h) => h.part)).toEqual([
      OG_PART.head, OG_PART.r_hand, OG_PART.head, OG_PART.r_hand, OG_PART.head, OG_PART.r_hand,
    ]);
    run(npc, CLIP);
    expect(npc.actionState).toBe(OG_STATE.WALK);
    const mid = wolf({ rng: seq(0.5) }).npc;
    mid.startAction(OG_STATE.CHARGING);
    run(mid, CLIP);
    expect(mid.animation).toBe(OG_ANIM.WOLF_POUNCE_MID);
  });

  it('in the overworld the pounce still moves but tests nothing (:310-314)', () => {
    const { npc, t } = wolf({ target: new Dummy(700), rng: seq(0), world: { adventureMode: true } });
    npc.startAction(OG_STATE.CHARGING);
    run(npc, CLIP + 1);
    expect(npc.posX).toBe(430);
    expect(t.hits).toEqual([]);
  });

  it('the pounce end kills a wolf whose hp reached 0 mid-air (:81-90)', () => {
    const { npc } = wolf();
    npc.startAction(OG_STATE.CHARGING);
    npc.setHP(0);
    npc.startAnim(OG_ANIM.WOLF_POUNCE_END);
    run(npc, CLIP);
    expect([npc.dead, npc.actionState, npc.animation]).toEqual([true, OG_STATE.DYING, OG_ANIM.WOLF_DEATH]);
  });

  it('FALL wears MIDHIGH under gravity 3; the clip ending in FALL does nothing; LAND is POUNCE_END and ends into WALK (:107-113, :207-212, :327-337)', () => {
    const { npc } = wolf();
    npc.setPosition(400, GROUND - 100);
    npc.startAction(OG_STATE.FALL);
    expect(npc.animation).toBe(OG_ANIM.WOLF_POUNCE_MIDHIGH);
    run(npc, CLIP);
    expect(npc.animation).toBe(OG_ANIM.WOLF_POUNCE_MIDHIGH); // not POUNCE_END: actionState == FALL_STATE
    expect(untilState(npc, OG_STATE.LAND)).toBe(9 - CLIP);
    expect([npc.y, npc.animation]).toEqual([GROUND, OG_ANIM.WOLF_POUNCE_END]);
    run(npc, CLIP);
    expect(npc.actionState).toBe(OG_STATE.WALK);
  });

  it('DOWNED: the fall clip ends into the downed pose with the bar back, 48 frames later the get-up, which ends into WALK (:67-80, :91-95, :203-206, :320-326)', () => {
    const { npc } = wolf();
    npc.hideHealthBar();
    npc.startAction(OG_STATE.DOWNED);
    expect([npc.animation, npc.idleCounter]).toEqual([OG_ANIM.WOLF_LAUNCHEDEND, 48]);
    run(npc, CLIP);
    expect([npc.animation, npc.healthBarVisible]).toEqual([OG_ANIM.WOLF_DOWNED, true]);
    expect(untilState(npc, OG_STATE.WALK)).toBe(51 - CLIP);
  });

  it('KNOCKDOWNED is DOWNED with a 6-frame floor (:198-202)', () => {
    const { npc } = wolf();
    npc.startAction(OG_STATE.KNOCKDOWNED);
    expect([npc.actionState, npc.animation, npc.idleCounter]).toEqual([OG_STATE.DOWNED, OG_ANIM.WOLF_LAUNCHEDEND, 6]);
    expect(untilState(npc, OG_STATE.WALK)).toBe(9);
  });

  it('update: no target and none to find → nothing steps; a dead target is replaced on the way in (:47-58)', () => {
    const { npc } = wolf({ world: { nearestEnemy: () => null } });
    npc.target = null;
    npc.startAction(OG_STATE.WALK);
    npc.update();
    expect(npc.frameCounter).toBe(0);
    const t2 = new Dummy(700);
    const { npc: w, t } = wolf({ world: { nearestEnemy: () => t2 } });
    t.dead = true;
    w.update();
    expect(w.target).toBe(t2);
  });
});

describe('EnemyWolf.as — the reception side, pinned against the base', () => {
  it('gotHit: head, neck AND WEAPON double the damage and behead — the weapon does not deflect as NPC.as:410 does (:371-382)', () => {
    for (const [part, hp] of [
      [OG_PART.head, 33],
      [OG_PART.neck, 33],
      [OG_PART.weapon, 33],
      [OG_PART.torso, 43],
    ] as const) {
      const { npc } = wolf();
      expect(npc.gotHit(part, hit(10))).toBe(true);
      expect(npc.getHP(), String(part)).toBe(hp);
      expect(npc.gotHitFlag).toBe(true);
      expect(npc.behead).toBe(part !== OG_PART.torso);
    }
  });

  it('gotHit: defence comes off, floored at the attacker-level minimum; i-frames are 12 (:383-392)', () => {
    const { npc } = wolf();
    npc.gotHit(OG_PART.torso, hit(2));
    expect(npc.getHP()).toBe(49); // 2 − 3 < 1 → 1
    expect(npc.gotHitCounter).toBe(OG_NPC_HIT_IFRAMES);
    expect(npc.gotHit(OG_PART.torso, hit(10))).toBe(false);
  });

  it('gotHit: elements are clamped at zero but NEVER defended — the base subtracts STAT_*DEF (:350-370)', () => {
    const { npc } = wolf();
    npc.STAT_FIREDEF = 3;
    const d = hit(10);
    d.fireDamage = 5;
    d.windDamage = -4;
    npc.gotHit(OG_PART.torso, d);
    expect(npc.getHP()).toBe(38); // 7 physical + 5 fire, wind 0
    const texts = ofType(npc, 'floatingText');
    expect(texts.map((e) => [e.text, e.colour, e.y])).toEqual([
      ['7', OG_NPC_FLOATING_TEXT.colour.physical, GROUND - 100],
      ['5', OG_NPC_FLOATING_TEXT.colour.fire, GROUND - 100],
    ]);
    expect(ofType(npc, 'sound').map((e) => e.name)).toEqual(['hit']);
  });

  it('gotHit: launch-air launches, knock-down floors it; fly and stun do nothing; behead is NOT cleared on survival (:393-402)', () => {
    const launched = wolf().npc;
    launched.startAction(OG_STATE.WALK);
    launched.gotHit(OG_PART.head, hit(10, 10, OG_LAUNCH.LAUNCH_AIR));
    expect([launched.actionState, launched.animation, launched.velY, launched.behead]).toEqual([
      OG_STATE.GOTLAUNCHED, OG_ANIM.WOLF_LAUNCHED, -25, true,
    ]);
    const floored = wolf().npc;
    floored.startAction(OG_STATE.WALK);
    floored.gotHit(OG_PART.torso, hit(10, 10, OG_LAUNCH.LAUNCH_KNOCKDOWN));
    expect([floored.actionState, floored.animation, floored.idleCounter]).toEqual([OG_STATE.DOWNED, OG_ANIM.WOLF_LAUNCHEDEND, 6]);
    const flown = wolf().npc;
    flown.startAction(OG_STATE.WALK);
    flown.gotHit(OG_PART.torso, hit(10, 10, OG_LAUNCH.LAUNCH_FLY));
    expect(flown.actionState).toBe(OG_STATE.WALK);
    const stunned = wolf().npc;
    stunned.startAction(OG_STATE.WALK);
    stunned.gotHit(OG_PART.torso, hit(10, 10, OG_LAUNCH.STUN));
    expect(stunned.actionState).toBe(OG_STATE.WALK);
  });

  it('gotHit on a wolf already at 0 hp is a no-op that still returns true (:388, :426)', () => {
    const { npc } = wolf();
    npc.setHP(0);
    expect(npc.gotHit(OG_PART.torso, hit(10))).toBe(true);
    expect([npc.gotHitCounter, npc.events]).toEqual([0, []]);
  });

  it('doLaunched: gravity 3, no peak clip, lands into DOWNED with the bar left alone (the base hides it) (:429-439)', () => {
    const { npc } = wolf();
    npc.startAction(OG_STATE.WALK);
    npc.gotLaunched();
    npc.showHealthBar();
    npc.update();
    // Facing the target on the left, the launch throws it right (+3).
    expect([npc.y, npc.posX, npc.velY, npc.animation]).toEqual([GROUND - 25, 403, -22, OG_ANIM.WOLF_LAUNCHED]);
    // y = 358 − 25k + 3k(k−1)/2 ≥ 358 at k = 18.
    expect(untilState(npc, OG_STATE.DOWNED)).toBe(17);
    expect([npc.y, npc.healthBarVisible, npc.animation]).toEqual([GROUND, true, OG_ANIM.WOLF_LAUNCHEDEND]);
  });

  it('doLaunched: inside 20 px of an edge it is re-launched with velX doubled (:440-444)', () => {
    const { npc } = wolf();
    npc.startAction(OG_STATE.GOTLAUNCHED);
    npc.setPosition(15, GROUND - 60);
    npc.faceLeft();
    npc.velX = -3;
    npc.velY = 0;
    npc.update();
    // re-launch while airborne: velY −20, facing flips to right, velX = −3 → doubled.
    expect([npc.posX, npc.velY, npc.facingRight, npc.velX]).toEqual([12, -20, true, -6]);
  });

  it('die: pays loot and XP even in playback (the base does not), and rolls no dice (:447-469)', () => {
    const rng = counting();
    const { npc } = wolf({ rng, world: { playback: true } });
    npc.reward = [{ id: 0, qty: 1, chance: 1 }];
    npc.startAction(OG_STATE.WALK);
    npc.faceRight();
    npc.setPosition(400, GROUND - 40);
    const before = rng.calls;
    npc.die();
    expect(ofType(npc, 'loot').length).toBe(1);
    expect(ofType(npc, 'xp').length).toBe(1);
    expect([npc.y, npc.actionState, npc.animation, npc.dead, npc.healthBarVisible, npc.facingRight]).toEqual([
      GROUND, OG_STATE.DYING, OG_ANIM.WOLF_DEATH, true, false, true,
    ]);
    expect(ofType(npc, 'death')).toEqual([{ type: 'death', anim: OG_ANIM.WOLF_DEATH, behead: false, downed: false, dice: -1 }]);
    // createLoot rolled its own two (spread and lift for one coin); die() itself rolled none — the base rolls the face flip and the clip.
    expect(rng.calls - before).toBe(2);
  });

  it('die: launched → just dead; downed → the death clip from the floor (:452-463); the death clip ends into the fade (:64-66)', () => {
    const air = wolf().npc;
    air.startAction(OG_STATE.GOTLAUNCHED);
    air.die();
    expect([air.dead, air.actionState, air.animation]).toEqual([true, OG_STATE.GOTLAUNCHED, OG_ANIM.WOLF_LAUNCHED]);
    const { npc } = wolf();
    npc.startAction(OG_STATE.DOWNED);
    npc.die();
    expect([npc.actionState, npc.animation, ofType(npc, 'death')[0]?.downed]).toEqual([OG_STATE.DYING, OG_ANIM.WOLF_DEATH, true]);
    // DYING's doAction runs doDying on every frame of the clip, and deathAnimEnd once more when it ends: 96 − 4.
    run(npc, CLIP);
    expect(npc.ttl).toBe(92);
  });

  it('redFreeze: hides the bar, darkens or vanishes, and freezes everything except launched, dying and CHARGING — the base spares FLY instead (:471-486)', () => {
    const { npc } = wolf();
    npc.showHealthBar();
    npc.startAction(OG_STATE.CHARGING);
    npc.redFreeze();
    expect([npc.healthBarVisible, npc.filter, npc.animFrozen]).toEqual([false, 'dark', false]);
    const flying = wolf().npc;
    flying.actionState = OG_STATE.FLY;
    flying.alpha = 0.5;
    flying.redFreeze();
    expect([flying.visible, flying.animFrozen]).toEqual([false, true]);
  });
});

// ------------------------------------------------------------------- Wolf2 --

describe('EnemyWolf2.as — the runner: overrides doAction only', () => {
  it('the constructor picks a destX and RUNs at once (:6-12)', () => {
    const { npc } = wolf2({ rng: seq(0.9) });
    expect([npc.destX, npc.actionState, npc.animation]).toEqual([720, OG_STATE.RUN, OG_ANIM.WOLF_RUN]);
  });

  it('IDLE re-rolls into a RUN, never a WALK, and not under a cutscene (:20-32)', () => {
    const { npc } = wolf2({ rng: seq(0.9, 0.5, 0.1) });
    npc.startAction(OG_STATE.IDLE);
    run(npc, 24);
    expect([npc.actionState, npc.destX]).toEqual([OG_STATE.RUN, 80]);
    const cut = wolf2({ rng: seq(0.9, 0.5), world: { cutsceneShowing: true } }).npc;
    cut.startAction(OG_STATE.IDLE);
    run(cut, 24);
    expect(cut.actionState).toBe(OG_STATE.IDLE);
  });

  it('WALK lasts zero frames: it becomes a RUN to a new destX (:33-36)', () => {
    const { npc } = wolf2({ rng: seq(0.9, 0.5, 0.1) });
    npc.startAction(OG_STATE.WALK);
    npc.update();
    expect([npc.actionState, npc.destX]).toEqual([OG_STATE.RUN, 80]);
  });

  it('RUN: arrival is a d3 where 0 idles and anything else runs again; it never bites, only pounces (:37-57)', () => {
    const far = new Dummy(-1000);
    const again = wolf2({ rng: seq(0.9, 0.34, 0.1), target: far }).npc;
    again.walkSpeed = 0;
    again.destX = 400;
    again.update();
    expect([again.actionState, again.destX]).toEqual([OG_STATE.RUN, 80]); // int(0.34·3) = 1: the wolf would WALK
    const { npc } = wolf2({ target: new Dummy(325), rng: seq(0.9) });
    npc.walkSpeed = 0;
    npc.update();
    expect(npc.actionState).toBe(OG_STATE.RUN); // 75 px: a wolf would bite
    const pounce = wolf2({ target: new Dummy(250), rng: seq(0.9, 0) }).npc;
    pounce.walkSpeed = 0;
    pounce.update();
    expect(pounce.actionState).toBe(OG_STATE.CHARGING);
  });

  it('ATTACK and CHARGING hit in the overworld too — no adventure guard (:58-75)', () => {
    const { npc, t } = wolf2({ target: new Dummy(700), rng: seq(0.9, 0), world: { adventureMode: true } });
    npc.startAction(OG_STATE.ATTACK);
    npc.update();
    expect(t.hits.map((h) => h.part)).toEqual([OG_PART.weapon]);
    npc.startAction(OG_STATE.CHARGING);
    npc.startAnim(OG_ANIM.WOLF_POUNCE_MID);
    npc.update();
    expect(t.hits.map((h) => h.part)).toEqual([OG_PART.weapon, OG_PART.head, OG_PART.r_hand]);
    expect(npc.walkSpeed).toBe(12);
  });
});

// --------------------------------------------------------------------- Fox --

describe('EnemyFox.as — the wolf that flees and sings', () => {
  it('init: no scale change, xp level·5+45 (:19-37)', () => {
    const row = OG_NPCS.find((n) => n.id === 65);
    if (row === undefined) return;
    const { npc } = fox();
    npc.init(row);
    expect([npc.scale, npc.xp, npc.actionState]).toEqual([1, 95, OG_STATE.WALK]);
  });

  it('IDLE re-roll: walking clears the bubble; in the overworld a d5 of 0 then a d9 picks a line by INDEX (:46-98)', () => {
    // walk roll 0 → WALK (destX 0, speed −4); d5 0 → speak; d9 0.5 → line 4.
    const { npc } = fox({ rng: seq(0, 0, 0, 0, 0.5), world: { adventureMode: true } });
    run(npc, 24);
    expect(npc.actionState).toBe(OG_STATE.WALK);
    expect(npc.events.filter((e) => e.type === 'speechClear' || e.type === 'speech')).toEqual([
      { type: 'speechClear' },
      { type: 'speech', table: 'fox', id: 4 },
    ]);
    const room = fox({ rng: seq(0, 0, 0, 0, 0.5) }).npc;
    run(room, 24);
    expect(ofType(room, 'speech')).toEqual([]);
    const quiet = fox({ rng: seq(0, 0, 0, 0.2, 0.5), world: { adventureMode: true } }).npc;
    run(quiet, 24);
    expect(ofType(quiet, 'speech')).toEqual([]); // int(0.2·5) = 1
  });

  it('checkPlayer: the player within 200 px IN FRONT sends it running 100 px past the far edge, bubble cleared — exact at 200 (:216-237)', () => {
    const flee = (tx: number, facingRight: boolean): EnemyFox => {
      const { npc } = fox({ target: new Dummy(tx) });
      npc.startAction(OG_STATE.IDLE);
      if (facingRight) npc.faceRight();
      else npc.faceLeft();
      npc.update();
      return npc;
    };
    const left = flee(201, false);
    expect([left.actionState, left.destX, left.walkSpeed, left.facingRight]).toEqual([OG_STATE.RUN, WIDTH + 100, 15, true]);
    expect(left.events.at(-1)).toEqual({ type: 'speechClear' });
    expect(flee(200, false).actionState).toBe(OG_STATE.IDLE);
    const right = flee(599, true);
    expect([right.actionState, right.destX, right.walkSpeed]).toEqual([OG_STATE.RUN, -100, -15]);
    expect(flee(599, false).actionState).toBe(OG_STATE.IDLE); // behind it
  });

  it('WALK: arrival is a coin; bite and pounce only in a room (:101-128)', () => {
    const { npc } = fox({ target: new Dummy(-1000), rng: seq(0) });
    npc.startAction(OG_STATE.WALK);
    npc.walkSpeed = 0;
    npc.destX = 400;
    npc.update();
    expect(npc.actionState).toBe(OG_STATE.IDLE);
    const bites = fox({ target: new Dummy(325) }).npc;
    walkStill(bites);
    bites.update();
    expect(bites.actionState).toBe(OG_STATE.ATTACK);
    // In the overworld the same 75 px is prey's distance: checkPlayer runs first and it flees, no bite.
    const wanders = fox({ target: new Dummy(325), world: { adventureMode: true } }).npc;
    walkStill(wanders);
    wanders.update();
    expect([wanders.actionState, wanders.destX]).toEqual([OG_STATE.RUN, WIDTH + 100]);
  });

  it('RUN: arriving 50 px past an edge in the overworld parks it in REDFREEZE_STATE under the idle clip — exact at −50 (:129-152)', () => {
    const arrive = (posX: number, adventure: boolean): EnemyFox => {
      const { npc } = fox({ target: new Dummy(-1000), rng: seq(0.5, 0.5, 0.5), world: { adventureMode: adventure } });
      npc.actionState = OG_STATE.RUN;
      npc.walkSpeed = -12;
      npc.setPosition(posX + 12, GROUND);
      npc.destX = posX;
      npc.update();
      return npc;
    };
    const parked = arrive(-50, true);
    expect([parked.actionState, parked.animation, parked.posX]).toEqual([OG_STATE.REDFREEZE, OG_ANIM.WOLF_IDLE, -50]);
    parked.update();
    expect([parked.actionState, parked.posX]).toEqual([OG_STATE.REDFREEZE, -50]);
    expect(arrive(-49, true).actionState).toBe(OG_STATE.WALK); // int(0.5·3) = 1
    expect(arrive(-50, false).actionState).toBe(OG_STATE.WALK);
    expect(arrive(WIDTH + 51, true).actionState).toBe(OG_STATE.REDFREEZE);
    expect(arrive(WIDTH + 50, true).actionState).toBe(OG_STATE.WALK);
  });

  it('ATTACK and CHARGING keep the wolf\'s adventure guard (:166-189)', () => {
    const { npc, t } = fox({ target: new Dummy(700), world: { adventureMode: true } });
    npc.startAction(OG_STATE.ATTACK);
    npc.update();
    npc.startAction(OG_STATE.CHARGING);
    npc.startAnim(OG_ANIM.WOLF_POUNCE_MID);
    npc.update();
    expect([t.hits, npc.posX]).toEqual([[], 415]);
  });
});

// ---------------------------------------------------------------- Civilian --

describe('EnemyCivilian.as — the wanderer with no target of its own', () => {
  it('init: level 1 whatever the roster says, xp 50, straight into WALK even in the air (:28-39)', () => {
    const row = OG_NPCS.find((n) => n.id === 5);
    if (row === undefined) return;
    const { npc } = civilian();
    npc.setPosition(400, GROUND - 50);
    npc.init(row);
    expect([npc.level, npc.xp, npc.damage, npc.maxhp, npc.actionState, npc.animation]).toEqual([
      1, 50, 3, 1, OG_STATE.WALK, OG_ANIM.WALK_SHEATHED,
    ]);
  });

  it('update never looks for a target: with none it still walks (:41-47, :229-230)', () => {
    const { npc } = civilian({ noTarget: true, rng: seq(0.9, 0.5) });
    npc.startAction(OG_STATE.WALK);
    npc.update();
    expect([npc.target, npc.posX]).toEqual([null, 405]);
  });

  it('ENEMYLAND and FLY_END both end into DOWNED — the fighters go to WALK (:61-64)', () => {
    const { npc } = civilian();
    npc.startAction(OG_STATE.LAND);
    run(npc, CLIP);
    expect([npc.actionState, npc.animation]).toEqual([OG_STATE.DOWNED, OG_ANIM.GOTLAUNCHEDDOWNED]);
  });

  it('GETUP_FRONT steps 40 back into an IDLE that LASTS; DOWNEDUP steps 100 back into WALK (:68-78, :107-117)', () => {
    const { npc } = civilian();
    npc.startAction(OG_STATE.VICTIM);
    npc.startAnim(OG_ANIM.GETUP_FRONT);
    run(npc, CLIP);
    expect([npc.posX, npc.actionState, npc.animation, npc.idleCounter]).toEqual([360, OG_STATE.IDLE, OG_ANIM.IDLE2, 47]);
    const up = civilian({ rng: seq(0.9, 0.5) }).npc;
    up.startAction(OG_STATE.DOWNED);
    up.healthBarX = -100;
    up.startAnim(OG_ANIM.DOWNEDUP);
    run(up, CLIP);
    expect([up.posX, up.healthBarX, up.actionState]).toEqual([305, 0, OG_STATE.WALK]);
  });

  it('IDLE: 48 frames, then a one-second re-roll that walks only on a d3 of EXACTLY 1; not under a cutscene (:133-136, :214-223)', () => {
    const roll = (r: number, cutscene = false): number => {
      const { npc } = civilian({ rng: seq(r, 0.5, 0.5), world: { cutsceneShowing: cutscene } });
      npc.startAction(OG_STATE.IDLE);
      run(npc, 48);
      return npc.actionState;
    };
    expect(roll(0.34)).toBe(OG_STATE.WALK);
    expect(roll(0.666)).toBe(OG_STATE.WALK);
    expect(roll(0.667)).toBe(OG_STATE.IDLE);
    expect(roll(0)).toBe(OG_STATE.IDLE);
    expect(roll(0.34, true)).toBe(OG_STATE.IDLE);
    const { npc } = civilian({ rng: seq(0) });
    npc.startAction(OG_STATE.IDLE);
    run(npc, 48);
    expect(npc.idleCounter).toBe(24);
  });

  it('WALK: a random destX, an int speed 4..5 signed toward it, facing that way (:137-150)', () => {
    const { npc } = civilian({ rng: seq(0.9, 0.5) });
    npc.startAction(OG_STATE.WALK);
    expect([npc.destX, npc.walkSpeed, npc.facingRight]).toEqual([720, 5, true]);
    const left = civilian({ rng: seq(0.1, 0.75) }).npc;
    left.startAction(OG_STATE.WALK);
    expect([left.destX, left.walkSpeed, left.facingRight]).toEqual([80, -5, false]);
  });

  it('WALK: furniture in the way steps it back and re-picks a destX on the other side (:231-253)', () => {
    let blocked = true;
    const { npc } = civilian({ rng: seq(0.9, 0.5, 0.5, 0.5), world: { npcBlocked: () => blocked } });
    npc.startAction(OG_STATE.WALK); // destX 720, +5, facing right
    npc.update();
    expect([npc.posX, npc.destX, npc.walkSpeed, npc.facingRight]).toEqual([400, 200, -5, false]);
    blocked = false;
    npc.update();
    expect(npc.posX).toBe(395);
  });

  it('WALK: arrival within 10 px is a coin — 0 idles, 1 walks again (:254-264)', () => {
    const idle = civilian({ rng: seq(0.9, 0.5, 0) }).npc;
    idle.startAction(OG_STATE.WALK);
    idle.destX = 405;
    idle.update();
    expect(idle.actionState).toBe(OG_STATE.IDLE);
    const walks = civilian({ rng: seq(0.9, 0.5, 0.5, 0.1, 0.5) }).npc;
    walks.startAction(OG_STATE.WALK);
    walks.destX = 405;
    walks.update();
    expect([walks.actionState, walks.destX]).toEqual([OG_STATE.WALK, 80]);
  });

  it('RUN: a d6 picks the clip; from 2 up it is a real run at 10 in the walk\'s direction, 0 and 1 keep the walk speed (:151-188)', () => {
    const pick = (r: number, speed: number): [string, number] => {
      const { npc } = civilian({ rng: seq(r) });
      npc.walkSpeed = speed;
      npc.startAction(OG_STATE.RUN);
      return [npc.animation, npc.walkSpeed];
    };
    expect(pick(0, 5)).toEqual([OG_ANIM.KNIFEWALK, 5]);
    expect(pick(0.17, -5)).toEqual([OG_ANIM.KATANAWALK, -5]);
    expect(pick(0.34, 5)).toEqual([OG_ANIM.RUN_LIGHT, 10]);
    expect(pick(0.5, -5)).toEqual([OG_ANIM.RUN_BALANCED, -10]);
    expect(pick(0.67, 5)).toEqual([OG_ANIM.RUN_HEAVY, 10]);
    expect(pick(0.99, 5)).toEqual([OG_ANIM.NINJARUN, 10]);
  });

  it('RUN: leaving the stage idles it — exact at 0 and at the width (:270-276)', () => {
    const at = (posX: number, speed: number): number => {
      const { npc } = civilian();
      npc.actionState = OG_STATE.RUN;
      npc.walkSpeed = speed;
      npc.setPosition(posX - speed, GROUND);
      npc.update();
      return npc.actionState;
    };
    expect(at(0, -10)).toBe(OG_STATE.RUN);
    expect(at(-1, -10)).toBe(OG_STATE.IDLE);
    expect(at(WIDTH, 10)).toBe(OG_STATE.RUN);
    expect(at(WIDTH + 1, 10)).toBe(OG_STATE.IDLE);
  });

  it('spotPlayer (doChase): the player within 300 px IN FRONT → bolt at 5..7, RUN, and one of five alert lines by id — exact at 300 (:306-352)', () => {
    const spot = (tx: number, facingRight: boolean, doChase = true): EnemyCivilian => {
      const { npc } = civilian({ target: new Dummy(tx), doChase, rng: seq(0, 0, 0.5) });
      npc.startAction(OG_STATE.IDLE);
      if (facingRight) npc.faceRight();
      else npc.faceLeft();
      npc.update();
      return npc;
    };
    const s = spot(699, true);
    expect([s.actionState, s.walkSpeed, s.onAlert, s.animation]).toEqual([OG_STATE.RUN, 5, true, OG_ANIM.KNIFEWALK]);
    expect(ofType(s, 'speech')).toEqual([{ type: 'speech', table: 'lang', id: 412 }]);
    expect(spot(700, true).actionState).toBe(OG_STATE.IDLE);
    expect(spot(101, false).walkSpeed).toBe(-5);
    expect(spot(699, false).actionState).toBe(OG_STATE.IDLE); // behind
    expect(spot(699, true, false).actionState).toBe(OG_STATE.IDLE); // no doChase
  });

  it('spotPlayer under a screen transition: alerted, but the run and the line wait for the fade (:322-328)', () => {
    const { npc } = civilian({ target: new Dummy(600), doChase: true, world: { transitioning: true }, rng: seq(0.9, 0.5, 0, 0, 0.5) });
    npc.startAction(OG_STATE.WALK);
    npc.walkSpeed = 0;
    npc.faceRight();
    npc.update();
    expect([npc.onAlert, npc.walkSpeed, npc.actionState, ofType(npc, 'speech')]).toEqual([true, 5, OG_STATE.WALK, []]);
    npc.world.transitioning = false;
    npc.update();
    expect([npc.actionState, ofType(npc, 'speech').length]).toEqual([OG_STATE.RUN, 1]);
  });

  it('REDFREEZE_STATE freezes the clock: the next update returns at once (:204-205)', () => {
    const { npc } = civilian();
    npc.startAction(OG_STATE.REDFREEZE);
    npc.update();
    expect([npc.animFrozen, npc.frameCounter]).toEqual([true, 0]);
  });
});

describe('EnemyCivilianFemale.as — the same wanderer at a fixed 3', () => {
  it('WALK is the female walk at ±3; the furniture bounce re-signs to ±3 (:30-43, :122-146)', () => {
    let blocked = false;
    const { npc } = female({ rng: seq(0.9, 0.5), world: { npcBlocked: () => blocked } });
    npc.startAction(OG_STATE.WALK);
    expect([npc.animation, npc.destX, npc.walkSpeed, npc.facingRight]).toEqual([OG_ANIM.SEXY_WALK, 720, 3, true]);
    blocked = true;
    npc.update();
    expect([npc.posX, npc.destX, npc.walkSpeed, npc.facingRight]).toEqual([400, 200, -3, false]);
  });

  it('RUN is the parent\'s d6, so a real run is ±10 off the 3\'s sign; doChase spots (:44-81, :117-120)', () => {
    const { npc } = female({ rng: seq(0.1, 0.34) }); // WALK rolls only destX: the speed is fixed
    npc.startAction(OG_STATE.WALK);
    npc.startAction(OG_STATE.RUN);
    expect([npc.animation, npc.walkSpeed]).toEqual([OG_ANIM.RUN_LIGHT, -10]);
    const chaser = female({ target: new Dummy(600), doChase: true, rng: seq(0, 0, 0) }).npc;
    chaser.startAction(OG_STATE.IDLE);
    chaser.faceRight();
    chaser.update();
    expect(chaser.actionState).toBe(OG_STATE.RUN);
  });
});

describe('EnemyCivilianOld.as — the same wanderer at 1, who never chases', () => {
  it('IDLE and WALK wear the old-man clips; WALK is ±1 (:111-128)', () => {
    const { npc } = old({ rng: seq(0.1) });
    npc.startAction(OG_STATE.IDLE);
    expect([npc.animation, npc.idleCounter]).toEqual([OG_ANIM.OLDMAN_IDLE, 48]);
    npc.startAction(OG_STATE.WALK);
    expect([npc.animation, npc.destX, npc.walkSpeed, npc.facingRight]).toEqual([OG_ANIM.OLDMAN_WALK, 80, -1, false]);
  });

  it('RUN is the walk clip at ±1 with no dice (:129-139); the furniture bounce re-signs to ±1 (:180-204)', () => {
    const rng = counting();
    const { npc } = old({ rng });
    npc.walkSpeed = -1;
    npc.startAction(OG_STATE.RUN);
    expect([npc.animation, npc.walkSpeed, rng.calls]).toEqual([OG_ANIM.OLDMAN_WALK, -1, 0]);
    let blocked = false;
    const b = old({ rng: seq(0.9, 0.5), world: { npcBlocked: () => blocked } }).npc;
    b.startAction(OG_STATE.WALK);
    blocked = true;
    b.update();
    expect([b.posX, b.destX, b.walkSpeed]).toEqual([400, 200, -1]);
  });

  it('doChase is always off: the player right in front never makes him run (:6-18, :175-178)', () => {
    const { npc } = old({ target: new Dummy(500) });
    npc.startAction(OG_STATE.IDLE);
    npc.faceRight();
    run(npc, 5);
    expect([npc.actionState, npc.onAlert]).toEqual([OG_STATE.IDLE, false]);
  });

  it('his own update: ENEMYLAND ends into DOWNED, as the parent\'s does (:40-43)', () => {
    const { npc } = old();
    npc.startAction(OG_STATE.LAND);
    run(npc, CLIP);
    expect(npc.actionState).toBe(OG_STATE.DOWNED);
  });
});
