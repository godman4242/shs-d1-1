/**
 * LANE L4b, SLICE 2b — THE ARCHERS AND THE SPEAR ELITES: `EnemyArcher` (ai 2) →
 * `FriendlyArcher` (ai 34); `EnemySpearElite` (ai 28, and ai 37 as a boss) →
 * `FriendlySpearElite` (ai 31).
 *
 * Written from the `.as` files, not from the ports. Every "frame" is one `update()`
 * at the original's 24 fps; every clip is 3 frames. The friendlies are built from the
 * PLAYER's live stats (`world.playerStats`), never from their roster row; the archer's
 * shot is an `arrow` event solved the way `fireArrow` solves it; a landed FRIENDLY hit
 * and a killing hit on an elite call `world.externalRedFreezeCheck()`.
 */
import { describe, expect, it } from 'vitest';
import { OG_ANIM, OG_LAUNCH, OG_PART, OG_STATE, type OgPart } from '../src/config/ogActor';
import { OG_NPCS } from '../src/config/ogNpcs';
import { EnemyArcher } from '../src/core/npc/EnemyArcher';
import { EnemySpearElite } from '../src/core/npc/EnemySpearElite';
import { FriendlyArcher } from '../src/core/npc/FriendlyArcher';
import { FriendlySpearElite } from '../src/core/npc/FriendlySpearElite';
import type { Npc } from '../src/core/npc/Npc';
import { NpcDamage } from '../src/core/npc/NpcDamage';
import type { AnimLibrary, HitGeometry, HitShape, NpcEvent, NpcTarget, NpcWorld } from '../src/core/npc/types';
import type { Rng } from '../src/core/Sim';

const GROUND = 358;
const WIDTH = 800;
const CLIP = 3;

/** A world that counts its red-freeze checks and records who was asked for. */
interface World extends NpcWorld {
  redFreezeChecks: number;
  asked: boolean[];
}
const world = (over: Partial<NpcWorld> = {}, enemy: NpcTarget | null = null): World => {
  const w: World = {
    groundY: GROUND,
    stageWidth: WIDTH,
    stagePosition: 0,
    redFreeze: false,
    playerLevel: 20,
    censored: false,
    playback: false,
    adventureMode: false,
    nearestEnemy: (_x, isEnemy) => {
      w.asked.push(isEnemy);
      return enemy;
    },
    cutsceneShowing: false,
    transitioning: false,
    noAggro: false,
    npcBlocked: () => false,
    playerStats: { maxHp: 200, defense: 40, minDamage: 30, damageRange: 21 },
    peaceful: false,
    duelMode: false,
    externalRedFreezeCheck: () => {
      w.redFreezeChecks++;
    },
    redFreezeChecks: 0,
    asked: [],
    ...over,
  };
  return w;
};
const anims: AnimLibrary = { clip: () => ({ durationFrames: CLIP, loop: false }) };
const geometry = (part: OgPart | null = null): HitGeometry => ({
  partAtPoint: () => part,
  partHitBy: () => part,
  partX: () => 0,
});
const seq = (...vals: number[]): Rng => {
  let i = 0;
  return () => vals[Math.min(i++, vals.length - 1)] ?? 0;
};
const counting = (): Rng & { calls: number } => {
  const f = (() => {
    f.calls++;
    return 0.5;
  }) as Rng & { calls: number };
  f.calls = 0;
  return f;
};

class Dummy implements NpcTarget {
  hits: Array<{ part: unknown; damage: number; launch: number }> = [];
  dead = false;
  downed = false;
  airborne = false;
  /** What `checkHitObject` answers — a friendly's red-freeze check hangs on it. */
  lands = true;
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
  isAirborne(): boolean {
    return this.airborne;
  }
  checkHitObject(thing: HitShape, damage: NpcDamage): boolean {
    this.hits.push({ part: thing.part, damage: damage.damage, launch: damage.launchType });
    return this.lands;
  }
}

const run = (npc: Npc, n: number): void => {
  for (let i = 0; i < n; i++) npc.update();
};
const ofType = <T extends NpcEvent['type']>(npc: Npc, type: T): Array<Extract<NpcEvent, { type: T }>> =>
  npc.events.filter((e): e is Extract<NpcEvent, { type: T }> => e.type === type);

interface Opts {
  rng?: Rng;
  world?: Partial<NpcWorld>;
  target?: Dummy;
  part?: OgPart | null;
}
const stats = (npc: Npc): void => {
  npc.setPosition(400, GROUND);
  npc.level = 10;
  npc.damage = 10;
  npc.defense = 3;
  npc.maxhp = 50;
  npc.setHP(50);
};
const archer = (o: Opts = {}): { npc: EnemyArcher; t: Dummy; w: World } => {
  const t = o.target ?? new Dummy(700);
  const w = world(o.world, t);
  const npc = new EnemyArcher(w, anims, geometry(o.part), o.rng ?? seq(0.5), t);
  stats(npc);
  return { npc, t, w };
};
const friendlyArcher = (o: Opts = {}): { npc: FriendlyArcher; t: Dummy; w: World } => {
  const t = o.target ?? new Dummy(700);
  const w = world(o.world, t);
  const npc = new FriendlyArcher(w, anims, geometry(o.part), o.rng ?? seq(0.5), t);
  stats(npc);
  return { npc, t, w };
};
const elite = (o: Opts & { boss?: boolean } = {}): { npc: EnemySpearElite; t: Dummy; w: World } => {
  const t = o.target ?? new Dummy(700);
  const w = world(o.world, t);
  const npc = new EnemySpearElite(w, anims, geometry(o.part), o.rng ?? seq(0.5), t, o.boss ?? false);
  stats(npc);
  return { npc, t, w };
};
const friendlyElite = (o: Opts = {}): { npc: FriendlySpearElite; t: Dummy; w: World } => {
  const t = o.target ?? new Dummy(700);
  const w = world(o.world, t);
  const npc = new FriendlySpearElite(w, anims, geometry(o.part), o.rng ?? seq(0.5), t);
  stats(npc);
  return { npc, t, w };
};
const hit = (damage: number, lvl = 10): NpcDamage => new NpcDamage(damage, lvl);

// ------------------------------------------------------------------ Archer --

describe('EnemyArcher.as — walk to a spot, reload, aim, loose; knife inside 100', () => {
  it('WALK picks a destX inset 20 px from the edges and an int speed 5..6 under the knife walk (:139-143)', () => {
    const { npc } = archer({ rng: seq(0.5, 0.5) });
    npc.startAction(OG_STATE.WALK);
    expect([npc.destX, npc.walkSpeed, npc.animation]).toEqual([400, 6, OG_ANIM.KNIFEWALK]);
    const low = archer({ rng: seq(0, 0) }).npc;
    low.startAction(OG_STATE.WALK);
    expect([low.destX, low.walkSpeed]).toEqual([20, 5]);
    const high = archer({ rng: seq(0.999, 0.999) }).npc;
    high.startAction(OG_STATE.WALK);
    expect([high.destX, high.walkSpeed]).toEqual([779, 6]);
  });

  it('IDLE is the bow idle for zero frames; WALK faces destX and steps toward it (:136-138, :183-201)', () => {
    const { npc } = archer({ rng: seq(0.1, 0.5) }); // destX 96, speed 6
    npc.startAction(OG_STATE.IDLE);
    expect(npc.animation).toBe(OG_ANIM.BOWIDLE);
    npc.update();
    // IDLE's own frame only starts the walk; the first step is next frame.
    expect([npc.actionState, npc.facingRight, npc.posX]).toEqual([OG_STATE.WALK, true, 400]);
    npc.update();
    expect([npc.facingRight, npc.posX]).toEqual([false, 394]);
  });

  it('arrival within 10 px of destX stops to RELOAD facing the target, and the walk step is skipped — exact at 10 (:186-191, :162-172)', () => {
    const { npc } = archer({ target: new Dummy(100) });
    npc.startAction(OG_STATE.WALK);
    npc.destX = 409;
    npc.update();
    expect([npc.actionState, npc.animation, npc.facingRight, npc.posX]).toEqual([OG_STATE.RELOAD, OG_ANIM.ARROWRELOAD, false, 400]);
    const far = archer().npc;
    far.startAction(OG_STATE.WALK);
    far.destX = 410;
    far.update();
    expect(far.actionState).toBe(OG_STATE.WALK);
  });

  it('WALK: the target inside 100 px draws the knife — exact at 100, measured after the step (:202-205, :173-174)', () => {
    const at = (tx: number): [number, string] => {
      const { npc } = archer({ target: new Dummy(tx) });
      npc.startAction(OG_STATE.WALK);
      npc.walkSpeed = 0;
      npc.destX = 0;
      npc.update();
      return [npc.actionState, npc.animation];
    };
    expect(at(499)).toEqual([OG_STATE.ATTACK, OG_ANIM.KNIFEATTACK]);
    expect(at(500)).toEqual([OG_STATE.WALK, OG_ANIM.KNIFEWALK]);
  });

  it('WALK: inside the 20 px insets a d10 of 0 stops to reload; on the inset it never does (:206-209)', () => {
    const at = (posX: number, roll: number): number => {
      const { npc } = archer({ rng: seq(0.9, 0.5, roll), target: new Dummy(2000) });
      npc.startAction(OG_STATE.WALK); // destX 704, speed 6
      npc.walkSpeed = 0;
      npc.setPosition(posX, GROUND);
      npc.update();
      return npc.actionState;
    };
    expect(at(21, 0)).toBe(OG_STATE.RELOAD);
    expect(at(20, 0)).toBe(OG_STATE.WALK);
    expect(at(779, 0)).toBe(OG_STATE.RELOAD);
    expect(at(780, 0)).toBe(OG_STATE.WALK);
    expect(at(400, 0.1)).toBe(OG_STATE.WALK);
  });

  it('the knife lands ONCE, when its clip ends, then WALK — which here arrives at once and reloads (:119-121)', () => {
    const { npc, t } = archer({ target: new Dummy(500), rng: seq(0.5, 0.5) });
    npc.startAction(OG_STATE.ATTACK);
    run(npc, CLIP - 1);
    expect(t.hits).toEqual([]);
    npc.update();
    expect(t.hits).toEqual([{ part: OG_PART.weapon, damage: 10, launch: OG_LAUNCH.LAUNCH_NONE }]);
    // WALK's destX = 20 + 0.5·760 = 400 = posX: arrived, so the same frame reloads.
    expect([npc.actionState, npc.animation]).toEqual([OG_STATE.RELOAD, OG_ANIM.ARROWRELOAD]);
  });

  it('RELOAD → pull back → AIM; ARROWFIRE ends into RELOAD again (:110-118, :144-146)', () => {
    const { npc } = archer();
    npc.startAction(OG_STATE.RELOAD);
    run(npc, CLIP);
    expect([npc.actionState, npc.animation]).toEqual([OG_STATE.RELOAD, OG_ANIM.ARROWPULLBACK]);
    run(npc, CLIP);
    expect([npc.actionState, npc.animation]).toEqual([OG_STATE.AIM, OG_ANIM.ARROWPULLBACK]);
    npc.startAnim(OG_ANIM.ARROWFIRE);
    run(npc, CLIP);
    expect([npc.actionState, npc.animation]).toEqual([OG_STATE.RELOAD, OG_ANIM.ARROWRELOAD]);
  });

  it('AIM decides on the one-second trigger only: re-target, knife inside 100, else face and fire on a coin (:211-243)', () => {
    const { npc, t } = archer({ rng: seq(0, 0.5), target: new Dummy(100) });
    npc.startAction(OG_STATE.AIM);
    npc.faceRight();
    npc.update(); // aiCounter 0 → the trigger fires on the first frame
    expect([npc.facingRight, npc.animation, ofType(npc, 'arrow').length]).toEqual([false, OG_ANIM.ARROWFIRE, 1]);
    const held = archer({ rng: seq(0.5), target: new Dummy(100) }).npc;
    held.startAction(OG_STATE.AIM);
    held.update();
    expect(ofType(held, 'arrow').length).toBe(0); // int(0.5·2) = 1: hold
    run(held, 23);
    expect(held.aiCounter).toBe(1);
    const near = archer({ target: new Dummy(450) }).npc;
    near.startAction(OG_STATE.AIM);
    near.update();
    expect(near.animation).toBe(OG_ANIM.KNIFEATTACK);
    t.dead = true;
  });

  it('fireArrow solves a 30° shot at the target 60 px above the feet, jittered, as ints (:271-302)', () => {
    // dx 300: velA = √(3·300/0.866) = 32.24, velX = 27.92, t = 10.75, velY = −1.5·t = −16.12; jitter 0.5·8−4 = 0.
    const { npc } = archer({ rng: seq(0.5) });
    npc.fireArrow();
    expect(ofType(npc, 'arrow')).toEqual([
      { type: 'arrow', x: 400, y: GROUND - 60, velX: 27, velY: -16, damage: 10, canLaunch: false },
    ]);
    expect(npc.animation).toBe(OG_ANIM.ARROWFIRE);
    const left = archer({ rng: seq(0.5), target: new Dummy(100) }).npc;
    left.fireArrow();
    expect(ofType(left, 'arrow')[0]?.velX).toBe(-27);
    const jittered = archer({ rng: seq(0.999) }).npc; // +3.99 → −12.13 → −12
    jittered.fireArrow();
    expect(ofType(jittered, 'arrow')[0]?.velY).toBe(-12);
  });

  it('fireArrow at a target straight above: 0/0 is NaN and int(NaN) is 0 — the arrow leaves with no velocity (:277-281)', () => {
    const { npc } = archer({ target: new Dummy(400, GROUND - 100) });
    npc.fireArrow();
    expect(ofType(npc, 'arrow')[0]).toMatchObject({ velX: 0, velY: 0 });
  });

  it('the arrow can launch by the archer\'s level: >50 a coin, >20 a d3, >10 a d4, else never — rolled only in its tier (:288-299)', () => {
    const can = (level: number, ...rolls: number[]): boolean => {
      const rng = counting();
      const { npc } = archer({ rng: rolls.length > 0 ? seq(0.5, ...rolls) : rng });
      npc.level = level;
      npc.fireArrow();
      if (rolls.length === 0) expect(rng.calls).toBe(1); // jitter only
      return ofType(npc, 'arrow')[0]?.canLaunch ?? false;
    };
    expect(can(51, 0.5)).toBe(true);
    expect(can(51, 0.49)).toBe(false);
    expect(can(21, 0)).toBe(true);
    expect(can(21, 0.34)).toBe(false);
    expect(can(11, 0.24)).toBe(true);
    expect(can(11, 0.25)).toBe(false);
    expect(can(10)).toBe(false);
  });

  it('ENEMYLAND rolls a destX and WALKs, which rolls it again (:49-52); FLY_END floors it (:53-55)', () => {
    const rng = counting();
    const { npc } = archer({ rng });
    npc.startAction(OG_STATE.LAND);
    run(npc, CLIP);
    // The WALK's destX (20 + 0.5·760 = 400) is where it stands: it arrives and reloads in the same frame.
    expect([npc.actionState, rng.calls]).toEqual([OG_STATE.RELOAD, 3]);
    const flown = archer().npc;
    flown.actionState = OG_STATE.FLY;
    flown.startAnim(OG_ANIM.FLY_END);
    run(flown, CLIP);
    expect(flown.actionState).toBe(OG_STATE.DOWNED);
  });

  it('die is the base\'s death plus the bow dropped: prop 13000 (:304-308)', () => {
    const { npc } = archer();
    npc.startAction(OG_STATE.WALK);
    npc.die();
    expect(npc.dead).toBe(true);
    expect(npc.events.at(-1)).toEqual({ type: 'setProp', itemId: 13000 });
  });

  it('update re-targets only when the target is gone and never on the trigger; no target → nothing steps (:27-34)', () => {
    const { npc } = archer();
    npc.startAction(OG_STATE.WALK);
    npc.walkSpeed = 0;
    npc.destX = 2000;
    run(npc, 30);
    expect([npc.actionState, npc.aiCounter]).toEqual([OG_STATE.WALK, 0]);
    const none = archer({ world: { nearestEnemy: () => null } }).npc;
    none.target = null;
    none.startAction(OG_STATE.WALK);
    none.update();
    expect(none.frameCounter).toBe(0);
  });
});

describe('FriendlyArcher.as — the player\'s archer, at three quarters of the player', () => {
  it('setLevel: damage / defense / maxhp are 0.75 × the PLAYER\'s live stats, xp 0, level as given (:21-34)', () => {
    const { npc } = friendlyArcher();
    npc.setLevel(17);
    // playerATK = int(30 + 21/2) = 40 → 30; defense 40 → 30; maxhp 200 → 150.
    expect([npc.damage, npc.defense, npc.maxhp, npc.getHP(), npc.xp, npc.level]).toEqual([30, 30, 150, 150, 0, 17]);
    const odd = friendlyArcher({ world: { playerStats: { maxHp: 201, defense: 41, minDamage: 31, damageRange: 21 } } }).npc;
    odd.setLevel(1);
    expect([odd.damage, odd.defense, odd.maxhp]).toEqual([30, 30, 150]); // int(41·0.75)=30, int(41.5)=41·0.75=30, int(150.75)
  });

  it('init takes only the paperdoll, elements and loot from the row, then levels to the PLAYER\'s level (:36-59)', () => {
    const row = OG_NPCS.find((n) => n.id === 65);
    if (row === undefined) return;
    const { npc } = friendlyArcher();
    npc.init({ ...row, fire: 3, earth: 2 });
    expect([npc.level, npc.damage, npc.maxhp, npc.xp, npc.actionState]).toEqual([20, 30, 150, 0, OG_STATE.WALK]);
    expect([npc.STAT_FIREATK, npc.STAT_EARTHDEF, npc.STAT_EARTHATK, npc.STAT_WINDDEF]).toEqual([3, 3, 2, 2]);
  });

  it('a friendly hunts ENEMIES: setIsFriendly and every re-target ask with isEnemy = false (NPC.as:262, :29)', () => {
    const { npc, w } = friendlyArcher();
    npc.setIsFriendly();
    npc.target = null;
    npc.startAction(OG_STATE.WALK);
    npc.update();
    expect(w.asked).toEqual([false, false]);
  });

  it('a friendly in AIM always fires — no coin (:233-236)', () => {
    const { npc } = friendlyArcher({ rng: seq(0.5, 0.5), target: new Dummy(100) });
    npc.setIsFriendly();
    npc.startAction(OG_STATE.AIM);
    npc.update();
    expect(ofType(npc, 'arrow').length).toBe(1);
  });

  it('checkHitObject: a landed hit that will kill it calls the red-freeze check; a survivable one does not; a refused or missed one is false (:61-83)', () => {
    const { npc, w } = friendlyArcher({ part: OG_PART.torso });
    expect(npc.checkHitObject({ kind: 'other', part: null, owner: null }, hit(10))).toBe(true);
    expect([npc.getHP(), w.redFreezeChecks]).toEqual([43, 0]);
    npc.gotHitCounter = 0;
    expect(npc.checkHitObject({ kind: 'other', part: null, owner: null }, hit(100))).toBe(true);
    expect([npc.getHP() <= 0, w.redFreezeChecks]).toEqual([true, 1]);
    const guarded = friendlyArcher({ part: OG_PART.torso }).npc;
    guarded.gotHitCounter = 5;
    expect(guarded.checkHitObject({ kind: 'other', part: null, owner: null }, hit(10))).toBe(false);
    expect(guarded.gotHitFlag).toBe(false);
    const miss = friendlyArcher().npc;
    expect(miss.checkHitObject({ kind: 'other', part: null, owner: null }, hit(10))).toBe(false);
  });
});

// ------------------------------------------------------------- Spear elite --

describe('EnemySpearElite.as — the duellist\'s spear master, and the boss balance', () => {
  it('setLevel on a non-boss is the base\'s (:47-50)', () => {
    const { npc } = elite();
    npc.setLevel(30);
    expect([npc.damage, npc.defense, npc.maxhp, npc.xp, npc.level]).toEqual([30, 9, 150, 80, 30]);
  });

  it('setLevel on a BOSS: scale, xp lvl·5+45, then balance against the player — hits to kill each way (:51-123)', () => {
    const { npc } = elite({ boss: true });
    npc.setLevel(30);
    // factor 3 → 30 / 9 / 150; lvldiff 10 → 20 hits to kill the boss, 8 to kill the player;
    // playerhit = 40 − 9 = 31 → bossHP 620 > 150; bosshit = int(200 / 8) = 25 → bossATK 65 > 30.
    expect([npc.damage, npc.defense, npc.maxhp, npc.getHP(), npc.xp, npc.level]).toEqual([65, 9, 620, 620, 195, 30]);
  });

  it('the boss floor chain FALLS THROUGH: at player level 20 a hit of 3 clears lvl/8 and lvl/6 but is still raised to lvl/4 = 5 (:95-110)', () => {
    const { npc } = elite({ boss: true, world: { playerStats: { maxHp: 200, defense: 40, minDamage: 12, damageRange: 0 } } });
    npc.maxhp = 10;
    npc.setLevel(30); // maxhp 30, defense 9 → playerhit 12 − 9 = 3 → 5; bossHP = 5 · 20 = 100 > 30
    expect(npc.maxhp).toBe(100);
  });

  it('boss floors: never fewer than 3 hits to kill it, 1 to kill the player; at level ≤ 5 it hits and defends for 1 (:86-93, :124-128)', () => {
    const low = elite({ boss: true }).npc;
    low.setLevel(5);
    // factor 0.5 → 5 / 1 / 25; diff −15 → boss hits 3 (floored), player hits 33; playerhit 39 → bossHP 117;
    // bosshit int(200/33) = 6 → bossATK 46; then lvl ≤ 5 → 1 / 1.
    expect([low.damage, low.defense, low.maxhp, low.xp]).toEqual([1, 1, 117, 70]);
    const high = elite({ boss: true }).npc;
    high.setLevel(40);
    // factor 4 → 40 / 12 / 200; diff 20 → player hits 18 − 20 → 1; bosshit 200 → bossATK 240.
    expect([high.damage, high.defense, high.maxhp]).toEqual([240, 12, 840]);
  });

  it('WALK: an int speed 3..4 under the relaxed walk, toward the target (:295-298, :349-360)', () => {
    const { npc } = elite({ rng: seq(0.5, 0.9) });
    npc.startAction(OG_STATE.WALK);
    expect([npc.walkSpeed, npc.animation]).toEqual([4, OG_ANIM.SPEARRELAXWALK]);
    npc.update(); // AI at 300 px: nothing
    expect([npc.facingRight, npc.posX]).toEqual([true, 404]);
  });

  it('a jumping target is waited out: WALK → IDLE, IDLE → WALK once it lands (:337-348)', () => {
    const { npc, t } = elite({ target: new Dummy(700) });
    t.airborne = true;
    npc.startAction(OG_STATE.WALK);
    npc.update();
    expect([npc.actionState, npc.animation, npc.posX]).toEqual([OG_STATE.IDLE, OG_ANIM.SPEARIDLE, 400]);
    t.airborne = false;
    npc.update();
    expect(npc.actionState).toBe(OG_STATE.WALK);
  });

  it('update never returns early on a missing target: AI runs every frame, and WALK with no target idles (:139-142, :331-334, :344-348)', () => {
    const { npc } = elite({ world: { nearestEnemy: () => null } });
    npc.target = null;
    npc.startAction(OG_STATE.WALK);
    npc.update();
    expect([npc.actionState, npc.animation]).toEqual([OG_STATE.IDLE, OG_ANIM.SPEARIDLE]);
  });

  it('AI inside 100 px: a d4 — 1 spin, 2 flurry, 3 launch (each arming the SPIN cooldown), 0 the plain stab — exact at 100 (:527-560)', () => {
    const at = (tx: number, roll: number): [number, string, number, number, number] => {
      const { npc } = elite({ target: new Dummy(tx), rng: seq(roll) });
      npc.startAction(OG_STATE.WALK);
      npc.walkSpeed = 0;
      npc.update();
      return [npc.actionState, npc.animation, npc.spearSpinCoolDown, npc.spearFlurryCoolDown, npc.spearLaunchCoolDown];
    };
    // 5 · 24 = 120, armed inside doAction and ticked once by the same update's tail: 119.
    expect(at(499, 0.25)).toEqual([OG_STATE.ATTACK, OG_ANIM.SPEARSPINSTART, 119, 0, 0]);
    expect(at(499, 0.5)).toEqual([OG_STATE.ATTACK, OG_ANIM.SPEARFLURRY, 119, 0, 0]);
    expect(at(499, 0.75)).toEqual([OG_STATE.ATTACK, OG_ANIM.SPEARLAUNCH, 119, 0, 0]);
    expect(at(499, 0)).toEqual([OG_STATE.ATTACK, OG_ANIM.SPEARSTABSTART, 0, 0, 0]);
    expect(at(500, 0.25)[1]).toBe(OG_ANIM.SPEARSWING); // 100 px is the ranged band: d5 of 1 = swing
  });

  it('AI: a special on cooldown falls through to the plain stab; the cooldown ticks down each frame (:537, :273-284)', () => {
    const { npc } = elite({ target: new Dummy(480), rng: seq(0.25) });
    npc.startAction(OG_STATE.WALK);
    npc.walkSpeed = 0;
    npc.spearSpinCoolDown = 2;
    npc.update();
    expect([npc.animation, npc.spearSpinCoolDown]).toEqual([OG_ANIM.SPEARSTABSTART, 1]);
  });

  it('AI inside 200 px: a d5 — 0 lunge, 1 swing, 2 kick (a skill), 3 and 4 nothing — exact at 200 (:561-579)', () => {
    const at = (tx: number, roll: number): [number, string] => {
      const { npc } = elite({ target: new Dummy(tx), rng: seq(roll) });
      npc.startAction(OG_STATE.WALK);
      npc.walkSpeed = 0;
      npc.update();
      return [npc.actionState, npc.animation];
    };
    expect(at(599, 0)).toEqual([OG_STATE.ATTACK, OG_ANIM.SPEARLUNGESTART]);
    expect(at(599, 0.2)).toEqual([OG_STATE.ATTACK, OG_ANIM.SPEARSWING]);
    expect(at(599, 0.4)).toEqual([OG_STATE.DOSKILL, OG_ANIM.SPEARKICKSTART]);
    expect(at(599, 0.6)).toEqual([OG_STATE.WALK, OG_ANIM.SPEARRELAXWALK]);
    expect(at(600, 0)).toEqual([OG_STATE.WALK, OG_ANIM.SPEARRELAXWALK]);
  });

  it('AI: a DOWNED target inside 50 px gets the downstab; at 50 it is the melee band (:530-533, :321-323)', () => {
    const { npc, t } = elite({ target: new Dummy(449), rng: seq(0) });
    t.downed = true;
    npc.startAction(OG_STATE.WALK);
    npc.walkSpeed = 0;
    npc.update();
    expect([npc.actionState, npc.animation]).toEqual([OG_STATE.STAB, OG_ANIM.DOWNSTAB]);
    const edge = elite({ target: new Dummy(450), rng: seq(0) });
    edge.t.downed = true;
    edge.npc.startAction(OG_STATE.WALK);
    edge.npc.walkSpeed = 0;
    edge.npc.update();
    expect(edge.npc.animation).toBe(OG_ANIM.SPEARSTABSTART);
  });

  it('AI is silent while frozen, dead, downed, airborne or launched (:496-499)', () => {
    const { npc } = elite({ target: new Dummy(480), rng: seq(0) });
    npc.startAction(OG_STATE.DOWNED);
    npc.update();
    expect(npc.actionState).toBe(OG_STATE.DOWNED);
    const air = elite({ target: new Dummy(480), rng: seq(0) }).npc;
    air.startAction(OG_STATE.WALK);
    air.setPosition(400, GROUND - 100);
    air.AI();
    expect(air.actionState).toBe(OG_STATE.WALK);
  });

  it('in peace, a duel elite bows ONCE and walks when the target comes within 100 map px; outside a duel it never bows (:509-526)', () => {
    const { npc, t } = elite({ world: { peaceful: true, duelMode: true } });
    npc.startAction(OG_STATE.WALK);
    npc.update();
    expect([npc.actionState, npc.animation, npc.hasBowed]).toEqual([OG_STATE.POSE, OG_ANIM.BOW2, true]);
    run(npc, 30);
    expect(npc.actionState).toBe(OG_STATE.POSE);
    t.x = 499;
    npc.AI();
    expect(npc.actionState).toBe(OG_STATE.WALK);
    const room = elite({ world: { peaceful: true } }).npc;
    room.startAction(OG_STATE.WALK);
    room.update();
    expect([room.actionState, room.hasBowed]).toEqual([OG_STATE.WALK, false]);
    // Peace ends while posing: AI walks it out of the bow.
    const posed = elite({ world: { peaceful: true, duelMode: true } }).npc;
    posed.startAction(OG_STATE.WALK);
    posed.update();
    posed.world.peaceful = false;
    posed.AI();
    expect(posed.actionState).toBe(OG_STATE.WALK);
  });

  it('the spin: START → MID (knock-down hits every frame) → END → WALK and a fresh AI in the same frame (:157-168, :261-265, :395-401)', () => {
    const { npc, t } = elite({ target: new Dummy(700), rng: seq(0.6) });
    npc.startAction(OG_STATE.ATTACK);
    npc.startAnim(OG_ANIM.SPEARSPINSTART);
    run(npc, CLIP);
    expect(npc.animation).toBe(OG_ANIM.SPEARSPINMID);
    expect(t.hits.map((h) => h.launch)).toEqual([OG_LAUNCH.LAUNCH_KNOCKDOWN]);
    run(npc, CLIP);
    expect([npc.animation, t.hits.length]).toEqual([OG_ANIM.SPEARSPINEND, 3]);
    run(npc, CLIP);
    expect([npc.actionState, npc.animation]).toEqual([OG_STATE.WALK, OG_ANIM.SPEARRELAXWALK]);
  });

  it('the lunge carries 20 px a mid-frame and stabs; the launch hits LAUNCH_AIR; flurry and swing hit every frame (:387-423)', () => {
    const { npc, t } = elite({ target: new Dummy(700) });
    npc.startAction(OG_STATE.ATTACK);
    npc.startAnim(OG_ANIM.SPEARLUNGEMID);
    npc.update();
    expect([npc.posX, t.hits[0]?.launch]).toEqual([420, OG_LAUNCH.LAUNCH_NONE]);
    npc.startAnim(OG_ANIM.SPEARLAUNCH);
    npc.update();
    expect(t.hits[1]?.launch).toBe(OG_LAUNCH.LAUNCH_AIR);
    npc.startAnim(OG_ANIM.SPEARFLURRY);
    npc.update();
    npc.startAnim(OG_ANIM.SPEARSWING);
    npc.update();
    expect(t.hits.length).toBe(4);
  });

  it('the kick: the first mid-clip carries 20 and kicks with the left foot (knock-down), the second carries 10 and does not (:425-451, :252-260)', () => {
    const { npc, t } = elite({ target: new Dummy(700) });
    npc.startAction(OG_STATE.DOSKILL);
    npc.startAnim(OG_ANIM.SPEARKICKSTART);
    run(npc, CLIP);
    expect([npc.animation, npc.posX]).toEqual([OG_ANIM.SPEARKICKMID, 420]);
    expect(t.hits).toEqual([{ part: OG_PART.l_foot, damage: 10, launch: OG_LAUNCH.LAUNCH_KNOCKDOWN }]);
    run(npc, CLIP);
    expect([npc.animation, npc.posX, t.hits.length]).toEqual([OG_ANIM.SPEARKICKMID2, 470, 3]);
    run(npc, CLIP);
    expect([npc.animation, npc.posX, t.hits.length]).toEqual([OG_ANIM.SPEARKICKEND, 490, 3]);
  });

  it('the stab lands once as its start clip ends; the downstab lands double only on a downed target (:226-245)', () => {
    const { npc, t } = elite({ target: new Dummy(700) });
    npc.startAction(OG_STATE.ATTACK);
    npc.startAnim(OG_ANIM.SPEARSTABSTART);
    run(npc, CLIP);
    expect([t.hits.map((h) => h.damage), npc.animation]).toEqual([[10], OG_ANIM.SPEARSTABEND]);
    const stab = elite({ target: new Dummy(700) });
    stab.npc.startAction(OG_STATE.STAB);
    run(stab.npc, CLIP);
    expect([stab.t.hits, stab.npc.animation]).toEqual([[], OG_ANIM.DOWNSTAB_UP]);
    stab.t.downed = true;
    stab.npc.startAnim(OG_ANIM.DOWNSTAB);
    run(stab.npc, CLIP);
    expect(stab.t.hits.map((h) => h.damage)).toEqual([20]);
  });

  it('a landed hit calls the red-freeze check only when the elite is FRIENDLY (:229-231, :390-392)', () => {
    const { npc, w } = elite({ target: new Dummy(700) });
    npc.startAction(OG_STATE.ATTACK);
    npc.startAnim(OG_ANIM.SPEARFLURRY);
    npc.update();
    expect(w.redFreezeChecks).toBe(0);
    const f = friendlyElite({ target: new Dummy(700) });
    f.npc.setIsFriendly(); // the dispatch's call: `isFriendly` is what gates the check
    f.npc.startAction(OG_STATE.ATTACK);
    f.npc.startAnim(OG_ANIM.SPEARFLURRY);
    f.npc.update();
    expect(f.w.redFreezeChecks).toBe(1);
    f.t.lands = false;
    f.npc.update();
    expect(f.w.redFreezeChecks).toBe(1);
  });

  it('checkHitObject: the weapon snaps a breakable projectile for no damage; a killing hit calls the check; a set flag skips the scan (:455-490)', () => {
    const { npc, w } = elite({ part: OG_PART.weapon });
    expect(npc.checkHitObject({ kind: 'other', part: null, owner: null, breakable: true }, hit(10))).toBe(false);
    expect([npc.getHP(), ofType(npc, 'breakProjectile').length]).toEqual([50, 1]);
    expect(npc.checkHitObject({ kind: 'other', part: null, owner: null }, hit(10))).toBe(false); // the base deflects a weapon hit
    expect(npc.getHP()).toBe(50);
    const body = elite({ part: OG_PART.torso });
    expect(body.npc.checkHitObject({ kind: 'other', part: null, owner: null }, hit(100))).toBe(true);
    expect([body.npc.isGoingToDie(), body.w.redFreezeChecks]).toEqual([true, 1]);
    let scans = 0;
    const flagged = new EnemySpearElite(w, anims, { partAtPoint: () => null, partHitBy: () => (scans++, OG_PART.torso), partX: () => 0 }, seq(0.5));
    flagged.gotHitFlag = true;
    expect(flagged.checkHitObject({ kind: 'other', part: null, owner: null }, hit(10))).toBe(false);
    expect([scans, flagged.gotHitFlag]).toEqual([0, false]);
  });

  it('GOTLAUNCHEDDOWNED under a red freeze keeps the bar hidden (:196-199)', () => {
    const { npc } = elite({ world: { redFreeze: true } });
    npc.startAction(OG_STATE.DOWNED);
    npc.hideHealthBar();
    run(npc, CLIP);
    expect([npc.healthBarVisible, npc.healthBarX, npc.animation]).toEqual([false, -100, OG_ANIM.GOTLAUNCHEDDOWNEDEND]);
    const shown = elite().npc;
    shown.startAction(OG_STATE.DOWNED);
    shown.hideHealthBar();
    run(shown, CLIP);
    expect(shown.healthBarVisible).toBe(true);
  });
});

describe('FriendlySpearElite.as — the player\'s spear master', () => {
  it('setLevel and init are the friendly archer\'s, on the spear elite (:19-57)', () => {
    const row = OG_NPCS.find((n) => n.id === 65);
    if (row === undefined) return;
    const { npc, w } = friendlyElite();
    npc.init(row);
    expect([npc.level, npc.damage, npc.defense, npc.maxhp, npc.xp, npc.isBoss, npc.actionState]).toEqual([
      20, 30, 30, 150, 0, false, OG_STATE.WALK,
    ]);
    npc.setIsFriendly();
    expect(w.asked).toEqual([false]);
  });
});
