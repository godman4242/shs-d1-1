/**
 * LANE L4b, SLICE 1 — the five pattern-setters, each overriding exactly
 * `update` / `startAction` / `doAction`: EnemyKatana (ai 3), EnemyKnife (ai 1 and
 * the absent-<ai> default), EnemySpear (ai 4), RoomGoblin (room ai 22), RoomOgre
 * (room ai 23).
 *
 * Written from the `.as` files, not from the ports. Every "frame" is one
 * `update()` call at the original's 24 fps. The anim library below gives every
 * clip 3 frames so a finished-clip case fires on the third step after `startAnim`.
 */
import { describe, expect, it } from 'vitest';
import { OG_ANIM, OG_STATE } from '../src/config/ogActor';
import { OG_NPC_DEFAULTS } from '../src/config/ogNpcBase';
import { EnemyKatana } from '../src/core/npc/EnemyKatana';
import { EnemyKnife } from '../src/core/npc/EnemyKnife';
import { EnemySpear } from '../src/core/npc/EnemySpear';
import { RoomGoblin } from '../src/core/npc/RoomGoblin';
import { RoomOgre } from '../src/core/npc/RoomOgre';
import type { Npc } from '../src/core/npc/Npc';
import type { NpcDamage } from '../src/core/npc/NpcDamage';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from '../src/core/npc/types';
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

/** A target that records every swing made at it. */
class Dummy implements NpcTarget {
  hits: number[] = [];
  downed = false;
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
    return this.downed;
  }
  checkHitObject(_thing: unknown, damage: NpcDamage): boolean {
    this.hits.push(damage.damage);
    return true;
  }
}

/** Step `n` frames. */
const run = (npc: Npc, n: number): void => {
  for (let i = 0; i < n; i++) npc.update();
};
/** Step until the actor's state changes, or `max` frames. Returns frames stepped. */
const untilState = (npc: Npc, state: number, max = 400): number => {
  let n = 0;
  while (npc.actionState !== state && n < max) {
    npc.update();
    n++;
  }
  return n;
};

interface Opts {
  rng?: Rng;
  world?: Partial<NpcWorld>;
  target?: Dummy;
}
const katana = (o: Opts = {}): { npc: EnemyKatana; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyKatana(world({ nearestEnemy: () => t, ...o.world }), anims, geometry, o.rng ?? seq(0.5), t);
  npc.setPosition(400, GROUND);
  npc.level = 10;
  npc.damage = 7;
  npc.maxhp = 50;
  npc.setHP(50);
  return { npc, t };
};
const knife = (o: Opts = {}): { npc: EnemyKnife; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyKnife(world({ nearestEnemy: () => t, ...o.world }), anims, geometry, o.rng ?? seq(0.5), t);
  npc.setPosition(400, GROUND);
  npc.level = 10;
  npc.damage = 7;
  npc.maxhp = 50;
  npc.setHP(50);
  return { npc, t };
};
const spear = (o: Opts = {}): { npc: EnemySpear; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemySpear(world({ nearestEnemy: () => t, ...o.world }), anims, geometry, o.rng ?? seq(0.5), t);
  npc.setPosition(400, GROUND);
  npc.level = 10;
  npc.damage = 7;
  npc.maxhp = 50;
  npc.setHP(50);
  return { npc, t };
};
const goblin = (o: Opts & { doChase?: boolean } = {}): { npc: RoomGoblin; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new RoomGoblin(world({ nearestEnemy: () => t, ...o.world }), anims, geometry, o.rng ?? seq(0.5), t, o.doChase ?? false);
  npc.setPosition(400, GROUND);
  npc.level = 10;
  npc.damage = 7;
  npc.maxhp = 50;
  npc.setHP(50);
  return { npc, t };
};
const ogre = (o: Opts & { doChase?: boolean } = {}): { npc: RoomOgre; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new RoomOgre(world({ nearestEnemy: () => t, ...o.world }), anims, geometry, o.rng ?? seq(0.5), t, o.doChase ?? false);
  npc.setPosition(400, GROUND);
  npc.level = 10;
  npc.damage = 7;
  npc.maxhp = 50;
  npc.setHP(50);
  return { npc, t };
};

// ------------------------------------------------------------------ Katana --

describe('EnemyKatana.as — walk, attack every frame, the shared update switch', () => {
  it('WALK sets an int walkSpeed 4..6 and the walk clip; IDLE poses the walk clip and stops the clock (:136-142)', () => {
    const { npc } = katana({ rng: seq(0.5) });
    npc.startAction(OG_STATE.WALK);
    expect(npc.walkSpeed).toBe(5);
    expect(npc.animation).toBe(OG_ANIM.KATANAWALK);
    const zero = katana({ rng: seq(0) }).npc;
    zero.startAction(OG_STATE.WALK);
    expect(zero.walkSpeed).toBe(4);
    const top = katana({ rng: seq(0.999) }).npc;
    top.startAction(OG_STATE.WALK);
    expect(top.walkSpeed).toBe(6);
    npc.startAction(OG_STATE.IDLE);
    expect(npc.stepAnimation()).toBe('');
  });

  it('IDLE walks next frame; WALK faces and closes on the target, then attacks inside 100 px (:165-193)', () => {
    const { npc, t } = katana({ rng: seq(0.5) });
    npc.startAction(OG_STATE.IDLE);
    npc.update();
    expect(npc.actionState).toBe(OG_STATE.WALK);
    npc.update();
    expect(npc.facingRight).toBe(false);
    expect(npc.posX).toBe(395);
    t.x = 700;
    npc.update();
    expect(npc.facingRight).toBe(true);
    expect(npc.posX).toBe(400);
    const frames = untilState(npc, OG_STATE.ATTACK);
    expect(frames).toBeGreaterThan(0);
    expect(700 - npc.x).toBeLessThan(100);
    expect(npc.animation).toBe(OG_ANIM.KATANAATTACK);
  });

  it('the vertical tolerance is 10 px facing LEFT and 50 px facing RIGHT — the source\'s asymmetry (:176, :185)', () => {
    const left = katana({ target: new Dummy(350, GROUND - 30) });
    left.npc.startAction(OG_STATE.WALK);
    left.npc.update();
    expect(left.npc.actionState).toBe(OG_STATE.WALK); // 30 > 10: keeps walking
    const right = katana({ target: new Dummy(450, GROUND - 30) });
    right.npc.startAction(OG_STATE.WALK);
    right.npc.update();
    expect(right.npc.actionState).toBe(OG_STATE.ATTACK); // 30 < 50: attacks
  });

  it('the 100 px melee boundary is EXACT: 99 px attacks, 100 px walks (:175, :185)', () => {
    const near = katana({ target: new Dummy(499) });
    near.npc.startAction(OG_STATE.WALK);
    near.npc.update();
    expect(near.npc.actionState).toBe(OG_STATE.ATTACK);
    const edge = katana({ target: new Dummy(500) });
    edge.npc.startAction(OG_STATE.WALK);
    edge.npc.update();
    expect(edge.npc.actionState).toBe(OG_STATE.WALK);
  });

  it('ATTACK swings on EVERY frame of the clip, then walks when the clip ends (:44-46, :195-197)', () => {
    const { npc, t } = katana({ target: new Dummy(350) });
    npc.startAction(OG_STATE.ATTACK);
    run(npc, CLIP);
    // The clip-end check runs BEFORE doAction: on its last frame the clip ends into WALK
    // first, so a 3-frame attack swings on 2 frames, not 3.
    expect(t.hits).toEqual([7, 7]);
    // …and, still inside 100 px, doAction re-enters ATTACK in the SAME frame.
    expect(npc.actionState).toBe(OG_STATE.ATTACK);
    run(npc, CLIP);
    expect(t.hits).toEqual([7, 7, 7, 7]);
  });

  it('FALL: gravity 3 until the ground, LAND, then the land clip ends into WALK (:44, :148-150, :208-216)', () => {
    const { npc } = katana();
    npc.setPosition(400, GROUND - 100);
    npc.startAction(OG_STATE.FALL);
    expect(npc.animation).toBe(OG_ANIM.ENEMYJUMP);
    const n = untilState(npc, OG_STATE.LAND);
    // velY starts at 0: y = 258 + 3·k(k−1)/2 ≥ 358 → k = 9
    expect(n).toBe(9);
    expect(npc.y).toBe(GROUND);
    expect(npc.animation).toBe(OG_ANIM.ENEMYLAND);
    run(npc, CLIP);
    expect(npc.actionState).toBe(OG_STATE.WALK);
  });

  it('the shared switch: GETUP_FRONT steps 40 back into IDLE; DOWNEDUP steps 100 back, resets the bar, WALKs (:56-66, :96-105)', () => {
    const { npc } = katana();
    npc.startAction(OG_STATE.VICTIM);
    npc.startAnim(OG_ANIM.KNEEGROIN_VICTIM);
    run(npc, CLIP);
    expect(npc.animation).toBe(OG_ANIM.GETUP_FRONT);
    run(npc, CLIP);
    expect(npc.posX).toBe(360);
    // IDLE lasts ZERO frames: doAction runs in the same frame and walks (:172-174).
    expect(npc.actionState).toBe(OG_STATE.WALK);
    expect(npc.animation).toBe(OG_ANIM.KATANAWALK);
    const down = katana().npc;
    down.startAction(OG_STATE.DOWNED);
    expect(down.animation).toBe(OG_ANIM.GOTLAUNCHEDDOWNED);
    down.healthBarX = -100;
    down.startAnim(OG_ANIM.DOWNEDUP);
    run(down, CLIP);
    // 400 − 100, then the same frame's WALK step toward the target at 100: −5 more.
    expect([down.posX, down.healthBarX, down.actionState]).toEqual([295, 0, OG_STATE.WALK]);
  });

  it('GOTLAUNCHEDDOWNED: dead → fade; alive → bar shown at −100, then DOWNEDUP if knocked down else the get-up (:72-93)', () => {
    const { npc } = katana();
    npc.startAction(OG_STATE.KNOCKDOWNED);
    npc.hideHealthBar();
    run(npc, CLIP);
    expect([npc.healthBarVisible, npc.healthBarX, npc.animation]).toEqual([true, -100, OG_ANIM.DOWNEDUP]);
    const launched = katana().npc;
    launched.startAction(OG_STATE.DOWNED);
    run(launched, CLIP);
    expect(launched.animation).toBe(OG_ANIM.GOTLAUNCHEDDOWNEDEND);
    run(launched, CLIP);
    expect(launched.animation).toBe(OG_ANIM.DOWNEDUP);
    const dead = katana().npc;
    dead.startAction(OG_STATE.DOWNED);
    dead.dead = true;
    run(dead, CLIP);
    expect(dead.ttl).toBe(OG_NPC_DEFAULTS.ttlMax - 1);
  });

  it('a finished death clip counts the fade; FLY_END downs; GOTLAUNCHED_PEAK falls (:37-45, :50-52, :68-70)', () => {
    const { npc } = katana();
    npc.startAction(OG_STATE.DYING);
    npc.startAnim(OG_ANIM.DEATHINHALF);
    run(npc, CLIP);
    expect(npc.ttl).toBe(OG_NPC_DEFAULTS.ttlMax - 1 - CLIP); // doDying ran on every frame too
    const fly = katana().npc;
    fly.startAction(OG_STATE.FLY);
    fly.startAnim(OG_ANIM.FLY_END);
    run(fly, CLIP);
    expect(fly.actionState).toBe(OG_STATE.DOWNED);
    const peak = katana().npc;
    peak.startAction(OG_STATE.GOTLAUNCHED);
    peak.startAnim(OG_ANIM.GOTLAUNCHED_PEAK);
    peak.velY = 10; // keep it airborne for the check
    peak.y = 0;
    run(peak, CLIP);
    expect(peak.animation).toBe(OG_ANIM.GOTLAUNCHED_FALL);
  });

  it('update: frozen or disposed → nothing; a dead target is replaced through the world, or the frame is skipped (:21-31)', () => {
    const { npc, t } = katana();
    npc.startAction(OG_STATE.WALK);
    npc.animFrozen = true;
    npc.update();
    expect(npc.posX).toBe(400);
    npc.animFrozen = false;
    t.dead = true;
    npc.world.nearestEnemy = () => null;
    npc.update();
    expect(npc.posX).toBe(400);
    expect(npc.target).toBeNull();
    const ally = new Dummy(700);
    npc.world.nearestEnemy = () => ally;
    npc.update();
    expect(npc.target).toBe(ally);
    expect(npc.facingRight).toBe(true);
  });

  it('i-frames tick down once per frame, and the target is re-picked every 24 frames (:110-116)', () => {
    const calls: boolean[] = [];
    const t = new Dummy(100);
    const { npc } = katana({
      target: t,
      world: {
        nearestEnemy: (_x, isEnemy) => {
          calls.push(isEnemy);
          return t;
        },
      },
    });
    npc.startAction(OG_STATE.ATTACK);
    npc.gotHitCounter = 3;
    run(npc, 2);
    expect(npc.gotHitCounter).toBe(1);
    npc.aiCounter = 0;
    run(npc, 25);
    // frame 1 (the counter started at 0), then the reset frame, then 24 frames later
    expect(calls).toEqual([true, true, true]);
    expect(npc.target).toBe(t);
    // The source ASSIGNS the answer, null included: the next frame then re-asks and skips.
    npc.world.nearestEnemy = () => null;
    npc.aiCounter = 0;
    npc.update();
    expect(npc.target).toBeNull();
  });
});

// ------------------------------------------------------------------- Knife --

describe('EnemyKnife.as — the absent-<ai> default: 50 px melee, one hit per swing, stabs the downed', () => {
  it('walkSpeed is 4 or 5; melee is 50 px and 50 px vertical on BOTH sides (:140, :181, :200)', () => {
    const { npc } = knife({ rng: seq(0.9) });
    npc.startAction(OG_STATE.WALK);
    expect(npc.walkSpeed).toBe(5);
    expect(npc.animation).toBe(OG_ANIM.KNIFEWALK);
    const left = knife({ target: new Dummy(360, GROUND - 30) });
    left.npc.startAction(OG_STATE.WALK);
    left.npc.update();
    expect(left.npc.actionState).toBe(OG_STATE.ATTACK);
    const far = knife({ target: new Dummy(340) });
    far.npc.startAction(OG_STATE.WALK);
    far.npc.update();
    expect(far.npc.actionState).toBe(OG_STATE.WALK);
  });

  it('the 50 px melee boundary is EXACT: 49 px attacks, 50 px walks (:181, :200)', () => {
    const near = knife({ target: new Dummy(351) });
    near.npc.startAction(OG_STATE.WALK);
    near.npc.update();
    expect(near.npc.actionState).toBe(OG_STATE.ATTACK);
    const edge = knife({ target: new Dummy(350) });
    edge.npc.startAction(OG_STATE.WALK);
    edge.npc.update();
    expect(edge.npc.actionState).toBe(OG_STATE.WALK);
  });

  it('KNIFEATTACK hits ONCE, when the clip ends, then walks (:51-54, :217-218)', () => {
    const { npc, t } = knife({ target: new Dummy(370) });
    npc.startAction(OG_STATE.ATTACK);
    run(npc, CLIP - 1);
    expect(t.hits).toEqual([]);
    npc.update();
    expect(t.hits).toEqual([7]);
    // …and, still inside 50 px, doAction re-enters ATTACK in the SAME frame: a knife in
    // range swings continuously, one hit per clip.
    expect(npc.actionState).toBe(OG_STATE.ATTACK);
    expect(npc.frameCounter).toBe(0);
  });

  it('a downed target inside melee gets STAB: DOWNSTAB, double damage if still downed, DOWNSTAB_UP, then WALK (:112-117, :183-186)', () => {
    const t = new Dummy(370);
    t.downed = true;
    const { npc } = knife({ target: t });
    npc.startAction(OG_STATE.WALK);
    npc.update();
    expect(npc.actionState).toBe(OG_STATE.STAB);
    expect(npc.animation).toBe(OG_ANIM.DOWNSTAB);
    run(npc, CLIP);
    expect(t.hits).toEqual([14]);
    expect(npc.animation).toBe(OG_ANIM.DOWNSTAB_UP);
    run(npc, CLIP);
    // DOWNSTAB_UP ends into WALK, and the still-downed target in range means STAB again
    // in the same frame.
    expect(npc.actionState).toBe(OG_STATE.STAB);
    // A target that got up in time is not stabbed.
    const up = new Dummy(370);
    up.downed = true;
    const k2 = knife({ target: up }).npc;
    k2.startAction(OG_STATE.STAB);
    up.downed = false;
    run(k2, CLIP);
    expect(up.hits).toEqual([]);
  });
});

// ------------------------------------------------------------------- Spear --

describe('EnemySpear.as — a coin makes a stabber; the charge is 8 px/frame', () => {
  it('isStabber is decided at construction by the rng (:19)', () => {
    expect(spear({ rng: seq(0.6) }).npc.isStabber).toBe(true);
    expect(spear({ rng: seq(0.2) }).npc.isStabber).toBe(false);
  });

  it('walkSpeed is 3 or 4; the charge starts on a 1-in-4 roll inside 400 px (:144, :192, :204)', () => {
    const { npc } = spear({ rng: seq(0.5, 0.5, 0.9) }); // ctor coin, walkSpeed, then charge rolls
    npc.startAction(OG_STATE.WALK);
    expect(npc.walkSpeed).toBe(4);
    expect(npc.animation).toBe(OG_ANIM.SPEARWALK);
    npc.update(); // roll 0.9 → 3: no charge, walks
    expect(npc.actionState).toBe(OG_STATE.WALK);
    expect(npc.posX).toBe(396);
    const charger = spear({ rng: seq(0.5, 0.5, 0.1) }).npc; // 0.1 × 4 → 0: charge
    charger.startAction(OG_STATE.WALK);
    charger.update();
    expect(charger.actionState).toBe(OG_STATE.RUN);
    expect(charger.animation).toBe(OG_ANIM.SPEARCHARGE);
  });

  it('the 400 px charge boundary is EXACT: 399 px may charge, 400 px never does (:192, :204)', () => {
    const near = spear({ rng: seq(0.5, 0.5, 0.0), target: new Dummy(1) }); // 399 px, roll 0 → charge
    near.npc.startAction(OG_STATE.WALK);
    near.npc.update();
    expect(near.npc.actionState).toBe(OG_STATE.RUN);
    const edge = spear({ rng: seq(0.5, 0.5, 0.0), target: new Dummy(0) }); // 400 px
    edge.npc.startAction(OG_STATE.WALK);
    edge.npc.update();
    expect(edge.npc.actionState).toBe(OG_STATE.WALK);
  });

  it('RUN moves 8 px toward the facing; a non-stabber runs its weapon in every frame inside 100 px (:214-241)', () => {
    const { npc, t } = spear({ rng: seq(0.2), target: new Dummy(100) });
    expect(npc.isStabber).toBe(false);
    npc.faceLeft();
    npc.startAction(OG_STATE.RUN);
    npc.update();
    expect(npc.posX).toBe(392);
    t.x = 350; // now inside 100, target on the left, facing left → distanceAway ≥ 0 → hit
    npc.update();
    expect(npc.posX).toBe(384);
    expect(t.hits).toEqual([7]);
    npc.update();
    expect(t.hits).toEqual([7, 7]);
  });

  it('a stabber level with the target does the SPEARSTABSTART attack: hit on its end, SPEARSTABEND, then WALK (:112-115, :50-54, :233-236)', () => {
    const { npc, t } = spear({ rng: seq(0.6), target: new Dummy(350) });
    expect(npc.isStabber).toBe(true);
    npc.faceLeft();
    npc.startAction(OG_STATE.RUN);
    npc.update();
    expect(npc.actionState).toBe(OG_STATE.ATTACK);
    expect(npc.animation).toBe(OG_ANIM.SPEARSTABSTART);
    run(npc, CLIP);
    expect(t.hits).toEqual([7]);
    expect(npc.animation).toBe(OG_ANIM.SPEARSTABEND);
    run(npc, CLIP);
    expect(npc.actionState).toBe(OG_STATE.WALK);
  });

  it('inside 50 px a downed target gets STAB; beyond 400 px the charge gives up (:227-230, :243-246)', () => {
    const t = new Dummy(370);
    t.downed = true;
    const { npc } = spear({ rng: seq(0.6), target: t });
    npc.faceLeft();
    npc.startAction(OG_STATE.RUN);
    npc.update();
    expect(npc.actionState).toBe(OG_STATE.STAB);
    expect(npc.facingRight).toBe(false);
    const far = spear({ target: new Dummy(100) }).npc;
    far.faceRight(); // charging AWAY from a target 300 px off; after 13 frames it is > 400
    far.startAction(OG_STATE.RUN);
    const n = untilState(far, OG_STATE.WALK);
    expect(n).toBe(13);
  });
});

// ------------------------------------------------------------------ Goblin --

describe('RoomGoblin.as — a wanderer with an aggro switch', () => {
  it('constructs with doChase and a raised bar; IDLE holds 48 frames, then a 1-in-3 walks (:13-27, :111-114, :159-172)', () => {
    const { npc } = goblin({ doChase: true, rng: seq(0.4) }); // 0.4 × 3 → 1: walk
    expect(npc.doChase).toBe(true);
    expect(npc.healthBarY).toBe(-80);
    npc.startAction(OG_STATE.IDLE);
    expect([npc.idleCounter, npc.animation]).toEqual([48, OG_ANIM.GOB_IDLE]);
    run(npc, 47);
    expect(npc.actionState).toBe(OG_STATE.IDLE);
    npc.update();
    expect(npc.actionState).toBe(OG_STATE.WALK);
  });

  it('the fidget roll `int(random() * 2 == 1)` fires ONLY on an exact 0.5 — ported as it reads (:168-171)', () => {
    const exact = goblin({ rng: seq(0.9, 0.5) }).npc; // walk roll 2.7 → 2 ≠ 1; fidget roll exactly 0.5
    exact.startAction(OG_STATE.IDLE);
    run(exact, 48);
    expect(exact.animation).toBe(OG_ANIM.GOB_FIDGET);
    run(exact, CLIP);
    expect(exact.animation).toBe(OG_ANIM.GOB_IDLE);
    const near = goblin({ rng: seq(0.9, 0.49) }).npc;
    near.startAction(OG_STATE.IDLE);
    run(near, 48);
    expect(near.animation).toBe(OG_ANIM.GOB_IDLE);
  });

  it('WALK picks a random destX, signs walkSpeed toward it, faces it; arriving within 10 px re-rolls idle/walk (:115-127, :178-213)', () => {
    const { npc } = goblin({ rng: seq(0.25, 0.5, 0.0) }); // destX 200 (< 400) → walks left at −(0.5×2+4) = −5; arrival coin 0 → IDLE
    npc.startAction(OG_STATE.WALK);
    expect([npc.destX, npc.walkSpeed, npc.facingRight, npc.animation]).toEqual([200, -5, false, OG_ANIM.GOB_WALK]);
    const n = untilState(npc, OG_STATE.IDLE);
    expect(n).toBe(39); // 400 − 5·39 = 205, |205 − 200| < 10
    const right = goblin({ rng: seq(0.75, 0.5) }).npc; // destX 600 → +5, faces right
    right.startAction(OG_STATE.WALK);
    expect([right.destX, right.walkSpeed, right.facingRight]).toEqual([600, 5, true]);
  });

  it('room furniture blocks: step back, re-pick destX on the other side, turn (:181-202)', () => {
    const { npc } = goblin({ rng: seq(0.75, 0.5, 0.5, 0.5), world: { npcBlocked: (_x, facingRight) => facingRight } });
    npc.startAction(OG_STATE.WALK); // destX 600, +5, facing right
    npc.update(); // moves to 405, blocked facing right → back to 400, destX = random × 400 = 200, turn left
    expect(npc.posX).toBe(400);
    expect([npc.destX, npc.facingRight, npc.walkSpeed]).toEqual([200, false, -5]);
  });

  it('spotPlayer: with doChase, the player inside 300 px in FRONT triggers a 5..7 px charge and onAlert (:274-300)', () => {
    const t = new Dummy(650);
    const { npc } = goblin({ doChase: true, rng: seq(0.5), target: t });
    npc.startAction(OG_STATE.IDLE);
    npc.faceRight();
    npc.update();
    expect([npc.onAlert, npc.actionState, npc.walkSpeed, npc.animation]).toEqual([true, OG_STATE.RUN, 6, OG_ANIM.GOB_RUN]);
    const behind = goblin({ doChase: true, target: new Dummy(150) }).npc; // 250 px BEHIND a right-facing goblin
    behind.startAction(OG_STATE.IDLE);
    behind.faceRight();
    behind.update();
    expect(behind.onAlert).toBe(false);
    const noChase = goblin({ doChase: false, target: t }).npc;
    noChase.startAction(OG_STATE.IDLE);
    noChase.update();
    expect(noChase.actionState).toBe(OG_STATE.IDLE);
  });

  it('no aggro during a transition, under noAggro, or under a cutscene (:276-280)', () => {
    for (const over of [{ transitioning: true }, { noAggro: true }, { cutsceneShowing: true }] as const) {
      const g = goblin({ doChase: true, target: new Dummy(650), world: over }).npc;
      g.startAction(OG_STATE.IDLE);
      g.faceRight();
      g.update();
      expect(g.onAlert, JSON.stringify(over)).toBe(false);
    }
  });

  it('RUN: keeps running at walkSpeed, swings inside 50 px, idles if it runs off the stage (:219-228)', () => {
    const t = new Dummy(430);
    const { npc } = goblin({ target: t });
    npc.walkSpeed = 6;
    npc.startAction(OG_STATE.RUN);
    npc.update();
    expect([npc.posX, npc.actionState, npc.animation]).toEqual([406, OG_STATE.ATTACK, OG_ANIM.GOB_ATTACK]);
    run(npc, CLIP);
    expect(npc.actionState).toBe(OG_STATE.WALK); // GOB_ATTACK ends into WALK (:51-53); the swing itself is the clip's
    const off = goblin({ target: new Dummy(100) }).npc;
    off.setPosition(WIDTH - 2, GROUND);
    off.walkSpeed = 6;
    off.startAction(OG_STATE.RUN);
    off.update();
    expect(off.actionState).toBe(OG_STATE.IDLE);
  });

  it('has no FLY or STUN handling at all, and cannot be knocked down into DOWNEDUP — the source\'s gaps are kept', () => {
    const { npc } = goblin();
    npc.gotFly(8, -12);
    expect(npc.actionState).toBe(OG_STATE.FLY);
    const x = npc.posX;
    run(npc, 5);
    expect(npc.posX).toBe(x); // no doAction case for FLY: it never moves again
  });
});

// -------------------------------------------------------------------- Ogre --

describe('RoomOgre.as — the goblin\'s twin, but it naps instead of fidgeting and sees only 200 px', () => {
  it('bar at −200; IDLE timeout: 1-in-3 walks, otherwise NAP (:26, :177-190)', () => {
    const { npc } = ogre({ rng: seq(0.9, 0.5, 0.5) }); // walk roll 2 ≠ 1 → NAP; nap coin 0.5×2 → 1: NAP2; duration (5 + 5)×24
    expect(npc.healthBarY).toBe(-200);
    npc.startAction(OG_STATE.IDLE);
    run(npc, 48);
    expect([npc.actionState, npc.animation, npc.idleCounter]).toEqual([OG_STATE.NAP, OG_ANIM.OGRE_NAP2_START, 240]);
  });

  it('NAP1: START ends into MID; at the end of the nap MID → END; END ends into WALK (:98-103, :290-302)', () => {
    const { npc } = ogre({ rng: seq(0.2, 0.0) }); // nap coin 0 → NAP1; duration 5×24 = 120
    npc.startAction(OG_STATE.NAP);
    expect([npc.animation, npc.idleCounter]).toEqual([OG_ANIM.OGRE_NAP1_START, 120]);
    run(npc, CLIP);
    expect(npc.animation).toBe(OG_ANIM.OGRE_NAP1_MID);
    run(npc, 120 - CLIP);
    expect(npc.animation).toBe(OG_ANIM.OGRE_NAP1_END);
    run(npc, CLIP);
    expect(npc.actionState).toBe(OG_STATE.WALK);
  });

  it('NAP2: START runs until the counter ends, then NAP2_END, then WALK (:294-297)', () => {
    const { npc } = ogre({ rng: seq(0.9, 0.0) }); // nap coin 1 → NAP2; 5×24
    npc.startAction(OG_STATE.NAP);
    expect(npc.animation).toBe(OG_ANIM.OGRE_NAP2_START);
    run(npc, 120);
    expect(npc.animation).toBe(OG_ANIM.OGRE_NAP2_END);
    run(npc, CLIP);
    expect(npc.actionState).toBe(OG_STATE.WALK);
  });

  it('sees the player only within 200 px, and the RUN clip is the walk clip (:136-138, :315-320)', () => {
    const far = ogre({ doChase: true, target: new Dummy(650) }).npc; // 250 px: the goblin would charge
    far.startAction(OG_STATE.IDLE);
    far.faceRight();
    far.update();
    expect(far.onAlert).toBe(false);
    const near = ogre({ doChase: true, target: new Dummy(550) }).npc;
    near.startAction(OG_STATE.IDLE);
    near.faceRight();
    near.update();
    expect([near.onAlert, near.actionState, near.animation]).toEqual([true, OG_STATE.RUN, OG_ANIM.OGRE_WALK]);
  });

  it('OGRE_SWINGDOWN is the attack clip and ends into WALK; OGRE_FIDGET ends into OGRE_IDLE (:50-53, :95-97, :139-141)', () => {
    const { npc } = ogre();
    npc.startAction(OG_STATE.ATTACK);
    expect(npc.animation).toBe(OG_ANIM.OGRE_SWINGDOWN);
    run(npc, CLIP);
    expect(npc.actionState).toBe(OG_STATE.WALK);
    npc.startAction(OG_STATE.IDLE);
    npc.startAnim(OG_ANIM.OGRE_FIDGET);
    run(npc, CLIP);
    expect(npc.animation).toBe(OG_ANIM.OGRE_IDLE);
  });
});
