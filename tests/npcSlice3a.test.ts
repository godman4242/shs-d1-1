/**
 * LANE L4b, SLICE 3a — THE FOUR WANDERERS: `EnemyBear` (ai 17), `EnemyDeer`
 * (ai 19), `EnemyHorse` (ai 12), `EnemyStag` (ai 21). All `extends NPC`, none
 * with children.
 *
 * Written from the `.as` files, not from the ports. Every "frame" is one
 * `update()` at the original's 24 fps; every clip here is 3 frames, so a
 * finished-clip case fires on the third step after `startAnim`.
 *
 * These four look like one animal with four skins. They are not, and every test
 * below exists because a porter copying one onto another would ship a bug:
 * only the bear fights and only the bear's counter ticks outside IDLE; only the
 * deer has a behind-the-back flee band and no target re-acquire; only the horse
 * refuses to move without `doChase`; only the stag charges — and the stag's
 * constructor silently DROPS the `doChase` it is handed.
 */
import { describe, expect, it } from 'vitest';
import { OG_ANIM, OG_LAUNCH, OG_PART, OG_STATE } from '../src/config/ogActor';
import { OG_BEAR } from '../src/config/ogEnemyBear';
import { OG_DEER } from '../src/config/ogEnemyDeer';
import { OG_HORSE } from '../src/config/ogEnemyHorse';
import { OG_STAG } from '../src/config/ogEnemyStag';
import { OG_WOLF } from '../src/config/ogEnemyWolf';
import { OG_ANIMAL } from '../src/config/ogNpcAnimal';
import { OG_NPC_SET_LEVEL, OG_NPC_XP } from '../src/config/ogNpcBase';
import { OG_NPCS } from '../src/config/ogNpcs';
import { EnemyBear } from '../src/core/npc/EnemyBear';
import { EnemyDeer } from '../src/core/npc/EnemyDeer';
import { EnemyHorse } from '../src/core/npc/EnemyHorse';
import { EnemyStag } from '../src/core/npc/EnemyStag';
import { EnemyWolf } from '../src/core/npc/EnemyWolf';
import type { Npc } from '../src/core/npc/Npc';
import { NpcDamage } from '../src/core/npc/NpcDamage';
import type { AnimLibrary, HitGeometry, HitShape, NpcEvent, NpcTarget, NpcWorld } from '../src/core/npc/types';
import type { Rng } from '../src/core/Sim';
import { counting, readsWhatYouWrote, seq } from './utils/npcHarness';

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
  /** No mob reads its target's facing; only the duellist's strokes do (`tests/mcsPlayer.test.ts`). */
  isFacingRight(): boolean {
    throw new Error('a mob read its target\'s facing');
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

const run = (npc: Npc, n: number): void => {
  for (let i = 0; i < n; i++) npc.update();
};
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
const bear = (o: Opts = {}): { npc: EnemyBear; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyBear(
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
const deer = (o: Opts = {}): { npc: EnemyDeer; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyDeer(world({ nearestEnemy: () => t, ...o.world }), anims, geometry, o.rng ?? seq(0.5), t);
  stats(npc);
  return { npc, t };
};
const horse = (o: Opts = {}): { npc: EnemyHorse; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyHorse(
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
const stag = (o: Opts = {}): { npc: EnemyStag; t: Dummy } => {
  const t = o.target ?? new Dummy(100);
  const npc = new EnemyStag(
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

const rowFor = (ai: number): NonNullable<ReturnType<typeof OG_NPCS.find>> => {
  const r = OG_NPCS.find((n) => n.ai === ai);
  if (r === undefined) throw new Error(`no roster row with ai ${ai}`);
  return r;
};

// ───────────────────────────────────────────────────────────── config twins ──

describe('slice 3a config — the shared animal numbers, and the twins that must not drift', () => {
  it('OG_ANIMAL does not drift from the wolf it shares its literals with', () => {
    // `EnemyWolf.as:32` ↔ bear `:38` / deer `:35` / horse `:41` / stag `:37`
    expect(OG_ANIMAL.xp).toEqual(OG_WOLF.xp);
    // `EnemyWolf.as:329` ↔ bear `:222` / deer `:200` / horse `:216` / stag `:280`
    expect(OG_ANIMAL.fallGravity).toBe(OG_WOLF.fallGravity);
    // `EnemyWolf.as:182` ↔ horse `:122`/`:134`, stag `:166`/`:178`
    expect(OG_ANIMAL.runSpeed).toBe(OG_WOLF.run.adventure);
    // `EnemyWolf.as:166`/`:178` ↔ horse `:118`/`:130`, stag `:162`/`:174`
    expect(OG_ANIMAL.runSpeedRoom).toBe(OG_WOLF.run.room);
    // `EnemyWolf.as:237` ↔ all four
    expect(OG_ANIMAL.arriveX).toBe(OG_WOLF.arriveX);
  });

  it('the arrival roll is a COIN here and a d3 for the wolf — not a twin', () => {
    expect(OG_ANIMAL.arriveDice).toBe(2);
    expect(OG_WOLF.arriveDice).toBe(3);
  });

  it('NO wanderer acts in its constructor — the wolf snarls in its own (`EnemyWolf.as:16`)', () => {
    // All four set only their `canGot*` flags and (bear, horse) `doChase`; the
    // first `startAction` comes from `init()` via `reset()`. The wolf's
    // constructor calls `startAction(IDLE_STATE)` directly, so it is already
    // snarling with a 24-frame timer before anything else touches it.
    const fresh: Array<[string, Npc & { idleCounter: number }]> = [
      ['bear', new EnemyBear(world(), anims, geometry, seq(0.5), null, false)],
      ['deer', new EnemyDeer(world(), anims, geometry, seq(0.5), null)],
      ['horse', new EnemyHorse(world(), anims, geometry, seq(0.5), null, false)],
      ['stag', new EnemyStag(world(), anims, geometry, seq(0.5), null, false)],
    ];
    for (const [name, npc] of fresh) {
      expect(npc.getAnim(), name).toBe('');
      expect(npc.idleCounter, name).toBe(0);
    }
    const w = new EnemyWolf(world(), anims, geometry, seq(0.5), null);
    expect(w.getAnim()).toBe(OG_ANIM.WOLF_SNARL);
    expect(w.idleCounter).toBe(OG_WOLF.idle.snarlFrames);
  });

  it('`init` enters IDLE TWICE — once inside `reset()` and once on its own (`NPC.as:204`, then e.g. `EnemyBear.as:40`)', () => {
    for (const [name, make, ai] of [
      ['bear', bear, 17],
      ['deer', deer, 19],
      ['horse', horse, 12],
      ['stag', stag, 21],
    ] as const) {
      const rng = counting(0);
      const npc = make({ rng }).npc;
      npc.init(rowFor(ai));
      expect(rng.calls, name).toBe(2);
    }
  });

  it('an animal NEVER loads the roster\'s elemental columns, so it defends with zeroes (`NPC.as:229-236`)', () => {
    // None of the four overrides `gotHit`, so they all run the BASE's, which
    // subtracts STAT_*DEF — and their `init` bodies assign none of the eight.
    const row = { ...rowFor(17), fire: 7, earth: 5 };
    expect(row.fire).toBeGreaterThan(0); // the row really does carry them
    expect(row.earth).toBeGreaterThan(0);
    for (const [name, make] of [
      ['bear', bear],
      ['deer', deer],
      ['horse', horse],
      ['stag', stag],
    ] as const) {
      const npc = make().npc;
      npc.init(row);
      expect(
        [npc.STAT_FIREATK, npc.STAT_EARTHDEF, npc.STAT_EARTHATK, npc.STAT_WINDDEF, npc.STAT_FIREDEF, npc.STAT_WATERDEF],
        name,
      ).toEqual([0, 0, 0, 0, 0, 0]);
    }
  });

  it("the stag's idle block IS the horse's object, not a copy of it", () => {
    // `EnemyStag.as:127-140` ↔ `EnemyHorse.as:83-96`, `:215-220` ↔ `:155-160`.
    expect(OG_STAG.idle).toBe(OG_HORSE.idle);
  });

  it('the bear walks on ONE roll in three where the wolf walks on two', () => {
    expect(OG_BEAR.idle.walkOn).toBe(1);
    expect(OG_BEAR.idle.walkDice).toBe(3);
    expect(OG_WOLF.idle.walkBelow).toBe(2); // `int(rnd*3) < 2` — two in three
  });
});

// ──────────────────────────────────────────────────────────────── the bear ──

/**
 * Harness finish, F3 — CONFIRMED TEST GAP: no test called `EnemyHorse.die()`, and none of the four
 * `die()` bodies was ever run with playback on or `dontGiveLoot` set, so DIVERGENCES' "each of
 * these is pinned" was false for the missing guard. The base guards the payout
 * (`NPC.as:903-908`: `playDie()`, then `!isPlayback() && !dontGiveLoot`) and rolls a facing coin
 * (`:966`) and a death clip (`:1005`/`:1096`); all four animal bodies do none of it.
 */
describe('slice 3a — the four `die()` bodies against the base', () => {
  it('pays XP in PLAYBACK and under `dontGiveLoot`, plays no sound and rolls nothing — all four (`EnemyHorse.as:257-266`)', () => {
    const rolls = { bear: counting(), deer: counting(), horse: counting(), stag: counting() };
    const w = { playback: true };
    const four: Array<[keyof typeof rolls, Npc, string]> = [
      ['bear', bear({ rng: rolls.bear, world: w }).npc, OG_ANIM.BEAR_DEATH],
      ['deer', deer({ rng: rolls.deer, world: w }).npc, OG_ANIM.DEER_DEATH],
      ['horse', horse({ rng: rolls.horse, world: w }).npc, OG_ANIM.HORSE_DEATH],
      ['stag', stag({ rng: rolls.stag, world: w }).npc, OG_ANIM.HORSE_DEATH],
    ];
    for (const [name, npc, clip] of four) {
      npc.dontGiveLoot = true;
      npc.setPosition(400, 100);
      const drawn = rolls[name].calls;
      npc.die();
      expect(ofType(npc, 'xp'), name).toHaveLength(1);
      expect(ofType(npc, 'sound'), name).toHaveLength(0);
      expect(rolls[name].calls - drawn, `${name}: an empty reward list, so any draw is the base's coin or clip roll`).toBe(0);
      expect([npc.actionState, npc.getAnim(), npc.y, npc.dead], name).toEqual([OG_STATE.DYING, clip, GROUND, true]);
      expect(ofType(npc, 'death')[0]?.downed, name).toBe(false);
    }
  });
});

describe('EnemyBear — the only fighter of the four', () => {
  it('ONE idle roll picks both the clip and the duration (`:97-118`)', () => {
    const a = bear({ rng: seq(0) }).npc;
    a.startAction(OG_STATE.IDLE);
    expect(a.getAnim()).toBe(OG_ANIM.BEAR_IDLE);
    expect(a.idleCounter).toBe(OG_ANIMAL.idleFrames);

    const b = bear({ rng: seq(0.4) }).npc; // int(0.4*3) === 1
    b.startAction(OG_STATE.IDLE);
    expect(b.getAnim()).toBe(OG_ANIM.BEAR_SIT);
    expect(b.idleCounter).toBe(OG_BEAR.idle.sitFrames); // sitting holds 72, not 48

    const c = bear({ rng: seq(0.9) }).npc; // int(0.9*3) === 2
    c.startAction(OG_STATE.IDLE);
    expect(c.getAnim()).toBe(OG_ANIM.BEAR_FIDGET);
    expect(c.idleCounter).toBe(OG_ANIMAL.idleFrames);
  });

  it('entering IDLE rolls exactly once — the duration re-reads the same dice', () => {
    const rng = counting(0.4);
    const a = bear({ rng }).npc;
    a.startAction(OG_STATE.IDLE);
    expect(rng.calls).toBe(1);
    expect(a.idleCounter).toBe(OG_BEAR.idle.sitFrames);
  });

  it('`idleCounter` ticks in EVERY state — the attack cooldown runs down mid-gallop (`:163-166`)', () => {
    const a = bear().npc;
    a.destX = 9999;
    a.startAction(OG_STATE.RUN);
    a.idleCounter = 10;
    a.doAction();
    expect(a.idleCounter).toBe(9);
  });

  it('…where the deer, horse and stag tick it only inside IDLE', () => {
    for (const make of [deer, horse, stag]) {
      const n = make().npc as Npc & { destX: number; idleCounter: number };
      n.destX = 9999;
      n.startAction(OG_STATE.RUN);
      n.idleCounter = 10;
      n.doAction();
      expect(n.idleCounter).toBe(10);
    }
  });

  it('the tick is floored at zero by its `> 0` guard (`:163`)', () => {
    const a = bear().npc;
    a.startAction(OG_STATE.FALL);
    a.idleCounter = 0;
    a.doAction();
    expect(a.idleCounter).toBe(0); // not −1
  });

  it('mauls at 99 px and not at 100 — the band is strict (`:197`)', () => {
    // walkSpeed +12 lands the bear on 412 BEFORE the distance is measured.
    const far = new Dummy(512);
    const a = bear({ target: far }).npc;
    a.destX = 9999;
    a.startAction(OG_STATE.RUN);
    a.idleCounter = 0;
    a.doAction();
    expect(a.actionState).toBe(OG_STATE.RUN); // |412 − 512| === 100 → no swing

    const near = new Dummy(511);
    const b = bear({ target: near }).npc;
    b.destX = 9999;
    b.startAction(OG_STATE.RUN);
    b.idleCounter = 0;
    b.doAction();
    expect(b.actionState).toBe(OG_STATE.ATTACK); // |412 − 511| === 99 → swing
    expect(b.idleCounter).toBe(OG_BEAR.attack.cooldownFrames); // and 5 × 24 of cooldown
  });

  it('the cooldown is TICKED BEFORE it is CHECKED, so the last frame of it is already spent (`:163` then `:197`)', () => {
    const swing = (cooldown: number): number => {
      const a = bear({ target: new Dummy(511) }).npc;
      a.destX = 9999;
      a.startAction(OG_STATE.RUN);
      a.idleCounter = cooldown;
      // THE HISTORICAL TRAP, stated by the harness preflight: session 35 wrote a cooldown and
      // expected the branch to see it. It never does — the tick at `:163` runs first — so the
      // preflight FIRES here, naming both numbers, and that is what this test pins.
      expect(() => {
        readsWhatYouWrote(a, 'idleCounter', () => {
          a.doAction();
        });
      }).toThrow(`setup wrote idleCounter = ${cooldown}, but the body CONSULTED ${cooldown - 1}`);
      return a.actionState;
    };
    // 2 → ticked to 1 → `1 <= 0` is false → no swing.
    expect(swing(2)).toBe(OG_STATE.RUN);
    // 1 → ticked to 0 → `0 <= 0` is TRUE → it swings on the same frame.
    expect(swing(1)).toBe(OG_STATE.ATTACK);
  });

  it('swings in the OVERWORLD — it has no `isAdventureMode()` fence, unlike the wolf (`:212-214`)', () => {
    const t = new Dummy(400);
    const a = bear({ target: t, world: { adventureMode: true } }).npc;
    a.startAction(OG_STATE.ATTACK);
    a.doAction();
    expect(t.hits).toHaveLength(1);
    expect(t.hits[0]?.part).toBe(OG_PART.r_hand);
    expect(t.hits[0]?.launchType).toBe(OG_LAUNCH.LAUNCH_NONE); // a plain hit, no knockdown
  });

  it('ATTACK faces with its OWN comparison, which disagrees with `faceTarget()` at equal x (`:148-155`)', () => {
    const t = new Dummy(400); // exactly the bear's x
    const a = bear({ target: t }).npc;
    a.faceRight();
    a.startAction(OG_STATE.ATTACK);
    expect(a.isFacingRight()).toBe(false); // `mcs.x < target.mcs.x` is FALSE → faceLeft

    a.faceLeft();
    a.faceTarget(); // `NPC.as:1205` — `target.x < this.x` is FALSE → faceRight
    expect(a.isFacingRight()).toBe(true);
  });

  it('gallops at a FLAT 12 in a room and in the overworld alike (`:137`/`:142`)', () => {
    const a = bear().npc;
    a.destX = 9999;
    a.startAction(OG_STATE.RUN);
    expect(a.walkSpeed).toBe(OG_ANIMAL.runSpeed);
    a.world.adventureMode = true; // `world({...})` is a COPY — mutate the actor's own
    a.startAction(OG_STATE.RUN);
    expect(a.walkSpeed).toBe(OG_ANIMAL.runSpeed); // no room/overworld split
  });

  it('walks at ±3, signed toward destX (`:124`/`:129`)', () => {
    const a = bear({ rng: seq(0) }).npc; // destX = int(0 * 800) = 0 < posX 400
    a.startAction(OG_STATE.WALK);
    expect(a.walkSpeed).toBe(-OG_ANIMAL.walkSpeed);
    expect(a.isFacingRight()).toBe(false);

    const b = bear({ rng: seq(0.99) }).npc; // destX = 792 > posX 400
    b.startAction(OG_STATE.WALK);
    expect(b.walkSpeed).toBe(OG_ANIMAL.walkSpeed);
    expect(b.isFacingRight()).toBe(true);
  });

  it('`init` turns chasing ON outside the overworld and leaves it alone inside (`:42-45`)', () => {
    const row = rowFor(17);
    const a = bear({ doChase: false }).npc;
    a.init(row);
    expect(a.doChase).toBe(true);

    const b = bear({ doChase: false, world: { adventureMode: true } }).npc;
    b.init(row);
    expect(b.doChase).toBe(false);
  });

  it('`init` pays the ANIMAL xp curve, not the base one (`:38`)', () => {
    const row = rowFor(17);
    const a = bear().npc;
    a.init(row);
    expect(a.xp).toBe(a.level * OG_ANIMAL.xp.perLevel + OG_ANIMAL.xp.base);
    expect(a.xp).not.toBe(a.level * OG_NPC_XP.perLevel + OG_NPC_XP.base);
  });

  it('a NON-chasing bear bolts away at 200 px, only when it is facing the player (`:241`)', () => {
    const t = new Dummy(250); // 150 px to the left of the bear at 400
    const a = bear({ target: t, doChase: false }).npc;
    a.faceLeft();
    a.startAction(OG_STATE.IDLE);
    a.idleCounter = 99; // keep the idle timer out of it
    a.doAction();
    expect(a.actionState).toBe(OG_STATE.RUN);
    expect(a.destX).toBe(WIDTH + OG_ANIMAL.offStage.dest); // away, to the right

    const b = bear({ target: new Dummy(250), doChase: false }).npc;
    b.faceRight(); // back turned — the bear never notices
    b.startAction(OG_STATE.IDLE);
    b.idleCounter = 99;
    b.doAction();
    expect(b.actionState).toBe(OG_STATE.IDLE);
  });

  it('a CHASING bear charges AT the player from 400 px (`:246`)', () => {
    const t = new Dummy(1); // 399 px to the left
    const a = bear({ target: t, doChase: true }).npc;
    a.faceLeft();
    a.startAction(OG_STATE.IDLE);
    a.idleCounter = 99;
    a.doAction();
    expect(a.actionState).toBe(OG_STATE.RUN);
    expect(a.destX).toBe(-OG_ANIMAL.offStage.dest); // toward, to the left
  });

  it('the flee / charge bands are strict: 200 and 400 exactly (`:241`/`:246`)', () => {
    const at = (dist: number, doChase: boolean): number => {
      const a = bear({ target: new Dummy(400 - dist), doChase }).npc;
      a.faceLeft();
      a.startAction(OG_STATE.IDLE);
      a.idleCounter = 99;
      a.doAction();
      return a.actionState;
    };
    expect(at(199, false)).toBe(OG_STATE.RUN);
    expect(at(200, false)).toBe(OG_STATE.IDLE); // `< 200`, not `<=`
    expect(at(399, true)).toBe(OG_STATE.RUN);
    expect(at(400, true)).toBe(OG_STATE.IDLE); // `< 400`, not `<=`
  });

  it('the swing clip ending picks a NEW destX and gallops (`:74-76`)', () => {
    const a = bear({ rng: seq(0.5) }).npc;
    a.startAction(OG_STATE.ATTACK);
    a.destX = 0;
    run(a, CLIP);
    expect(a.destX).toBe(Math.trunc(0.5 * WIDTH));
    expect(a.getAnim()).toBe(OG_ANIM.BEAR_RUN);
  });

  it('`die()` pays out with NO death sound and no launch or downed branch (`:267`)', () => {
    const a = bear().npc;
    a.setPosition(400, 100); // off the ground
    a.actionState = OG_STATE.GOTLAUNCHED; // the wolf would bail here; the bear does not
    a.die();
    expect(ofType(a, 'sound')).toHaveLength(0); // the wolf plays one, the bear does not
    expect(a.y).toBe(GROUND); // grounded regardless of the launch
    expect(a.actionState).toBe(OG_STATE.DYING);
    expect(a.getAnim()).toBe(OG_ANIM.BEAR_DEATH);
    expect(ofType(a, 'death')).toHaveLength(1);
    expect(ofType(a, 'death')[0]?.downed).toBe(false);
    expect(a.dead).toBe(true);
  });

  /**
   * Harness finish, F3 — CONFIRMED TEST GAP: the bear's five `canGot* = false`
   * (`EnemyBear.as:24-28`) were asserted nowhere, so deleting one had nothing to turn red.
   * Every base reaction returns on its flag (`NPC.as:538`/`:572`/`:587`/`:613`/`:641`/`:660`/
   * `:680`); driven here through all seven, so a single dropped refusal changes the state.
   */
  it('refuses launch, knock-down, fly, fly-away, knee-groin, back-throw AND stun — all seven no-op (`:24-28`)', () => {
    const a = bear().npc;
    a.startAction(OG_STATE.WALK);
    const snap = (): unknown => ({ state: a.actionState, anim: a.getAnim(), x: a.x, y: a.y, right: a.isFacingRight() });
    const before = snap();
    a.gotLaunched();
    a.gotKnockDown();
    a.gotFly(10, -10);
    a.gotFlyAway(0, 0);
    a.gotKneeGroin(0, GROUND, 0);
    a.gotBackThrow(0, GROUND);
    a.gotStun(24, 0);
    expect(snap()).toEqual(before);
    expect([a.canGotLaunched, a.canGotKnockDown, a.canGotFly, a.canGotKneeGroin, a.canGotStun]).toEqual([
      false,
      false,
      false,
      false,
      false,
    ]);
  });

  it('re-acquires a dead target and re-targets on the AI clock (`:55-62`, `:84-87`)', () => {
    let asked = 0;
    const t = new Dummy(100);
    const a = new EnemyBear(
      world({
        nearestEnemy: () => {
          asked++;
          return t;
        },
      }),
      anims,
      geometry,
      seq(0.5),
      null,
    );
    stats(a);
    a.update();
    expect(asked).toBeGreaterThan(0);
  });
});

// ──────────────────────────────────────────────────────────────── the deer ──

describe('EnemyDeer — pure prey, and (like the horse) never re-targets', () => {
  it('`update()` NEVER asks for a nearest enemy — not even when its target DIES (`:42-69`)', () => {
    const make = (): { npc: EnemyDeer; t: Dummy; asked: () => number } => {
      let asked = 0;
      const t = new Dummy(100);
      const npc = new EnemyDeer(
        world({
          nearestEnemy: () => {
            asked++;
            return new Dummy(700);
          },
        }),
        anims,
        geometry,
        seq(0.5),
        t,
      );
      stats(npc);
      return { npc, t, asked: () => asked };
    };

    const live = make();
    run(live.npc, 200);
    expect(live.asked()).toBe(0);

    // The branch the bear and stag have and the deer does not: a DEAD target is
    // simply kept. Without this case a planted re-acquire never fires and the
    // test above stays green with the guard removed.
    const gone = make();
    gone.t.dead = true;
    run(gone.npc, 200);
    expect(gone.asked()).toBe(0);
    expect(gone.npc.target).toBe(gone.t); // still holding the corpse

    // …and the bear, given the same dead target, DOES go looking.
    let bearAsked = 0;
    const dead = new Dummy(100);
    dead.dead = true;
    const b = new EnemyBear(
      world({
        nearestEnemy: () => {
          bearAsked++;
          return new Dummy(700);
        },
      }),
      anims,
      geometry,
      seq(0.5),
      dead,
    );
    stats(b);
    b.update();
    expect(bearAsked).toBeGreaterThan(0);
    expect(b.target).not.toBe(dead);
  });

  it('…where the bear and the stag do, and the horse does not', () => {
    const count = (make: (o: Opts) => { npc: Npc }): number => {
      let asked = 0;
      const t = new Dummy(100);
      const n = make({ world: { nearestEnemy: () => (asked++, t) }, target: t }).npc;
      run(n, 200);
      return asked;
    };
    expect(count(bear)).toBeGreaterThan(0);
    expect(count(stag)).toBeGreaterThan(0);
    expect(count(horse)).toBe(0);
  });

  it('the idle d4 sets the duration FIRST, and two rolls raise it (`:78-98`)', () => {
    const cases: Array<[number, string, number]> = [
      [0, OG_ANIM.DEER_IDLE, OG_ANIMAL.idleFrames],
      [0.3, OG_ANIM.DEER_GRAZING, OG_DEER.idle.longFrames], // int(0.3*4) === 1
      [0.55, OG_ANIM.DEER_FIDGET, OG_ANIMAL.idleFrames], // int(0.55*4) === 2
      [0.8, OG_ANIM.DEER_SIT, OG_DEER.idle.longFrames], // int(0.8*4) === 3
    ];
    for (const [r, clip, frames] of cases) {
      const a = deer({ rng: seq(r) }).npc;
      a.startAction(OG_STATE.IDLE);
      expect(a.getAnim(), `rng ${r}`).toBe(clip);
      expect(a.idleCounter, `rng ${r}`).toBe(frames);
    }
  });

  it('rising from SIT costs an extra clip: GETUP, and only then WALK (`:141-144`, `:60-62`)', () => {
    const a = deer({ rng: seq(0.8) }).npc; // SIT
    a.startAction(OG_STATE.IDLE);
    expect(a.getAnim()).toBe(OG_ANIM.DEER_SIT);
    a.idleCounter = 1;
    a.doAction(); // 1 → 0 → fires → sees DEER_SIT → GETUP, and does NOT change state
    expect(a.getAnim()).toBe(OG_ANIM.DEER_GETUP);
    expect(a.actionState).toBe(OG_STATE.IDLE);
    run(a, CLIP); // the getup clip finishes → WALK
    expect(a.actionState).toBe(OG_STATE.WALK);
  });

  it('a roll that is neither GETUP nor WALK re-enters IDLE and rolls a fresh clip (`:149-152`)', () => {
    const a = deer({ rng: seq(0, 0.9, 0.3) }).npc;
    a.startAction(OG_STATE.IDLE); // rng 0 → DEER_IDLE
    a.idleCounter = 1;
    a.doAction(); // rng 0.9 → int(2.7) === 2 ≠ walkOn → startAction(IDLE) → rng 0.3 → GRAZING
    expect(a.getAnim()).toBe(OG_ANIM.DEER_GRAZING);
  });

  it('spots the player at 200 px facing it, but only at 50 behind its back (`:219`)', () => {
    const at = (dist: number, facingRight: boolean): number => {
      const a = deer({ target: new Dummy(400 - dist) }).npc;
      if (facingRight) a.faceRight();
      else a.faceLeft();
      a.startAction(OG_STATE.IDLE);
      a.idleCounter = 99;
      a.doAction();
      return a.actionState;
    };
    // facing the player (left, toward a player on the left)
    expect(at(199, false)).toBe(OG_STATE.RUN);
    expect(at(200, false)).toBe(OG_STATE.IDLE);
    // back turned
    expect(at(49, true)).toBe(OG_STATE.RUN);
    expect(at(50, true)).toBe(OG_STATE.IDLE);
    expect(at(150, true)).toBe(OG_STATE.IDLE); // inside 200 but behind — still nothing
  });

  it('at exactly equal x neither branch runs (`:217`/`:232` are both strict)', () => {
    const a = deer({ target: new Dummy(400) }).npc;
    a.faceLeft();
    a.startAction(OG_STATE.IDLE);
    a.idleCounter = 99;
    a.doAction();
    expect(a.actionState).toBe(OG_STATE.IDLE);
  });

  it('bolts OFF-STAGE in the overworld but to a RANDOM x in a room (`:222-229`)', () => {
    const over = deer({ target: new Dummy(350), rng: seq(0.5), world: { adventureMode: true } }).npc;
    over.faceLeft();
    over.startAction(OG_STATE.IDLE);
    over.idleCounter = 99;
    over.doAction();
    expect(over.destX).toBe(WIDTH + OG_ANIMAL.offStage.dest);

    const room = deer({ target: new Dummy(350), rng: seq(0.25) }).npc;
    room.faceLeft();
    room.startAction(OG_STATE.IDLE);
    room.idleCounter = 99;
    room.doAction();
    expect(room.destX).toBe(Math.trunc(0.25 * WIDTH)); // a random x, not the edge
  });

  it('has no ATTACK body at all — the case is empty (`:191-192`)', () => {
    const t = new Dummy(400);
    const a = deer({ target: t }).npc;
    a.actionState = OG_STATE.ATTACK;
    a.doAction();
    expect(t.hits).toHaveLength(0);
  });

  it('`die()` matches the bear\'s: no sound, grounded, one death event (`:249`)', () => {
    const a = deer().npc;
    a.setPosition(400, 100);
    a.die();
    expect(ofType(a, 'sound')).toHaveLength(0);
    expect(a.y).toBe(GROUND);
    expect(a.getAnim()).toBe(OG_ANIM.DEER_DEATH);
    expect(ofType(a, 'death')).toHaveLength(1);
  });
});

// ─────────────────────────────────────────────────────────────── the horse ──

describe('EnemyHorse — does nothing at all without doChase', () => {
  it('an un-chased horse never leaves IDLE (`:153`, `:166-169`)', () => {
    const a = horse({ doChase: false, rng: seq(0) }).npc;
    a.startAction(OG_STATE.IDLE);
    run(a, 300);
    expect(a.actionState).toBe(OG_STATE.IDLE);
  });

  it('a chasing horse leaves IDLE the frame its timer runs out (`:155-166`)', () => {
    const a = horse({ doChase: true, rng: seq(0) }).npc;
    a.startAction(OG_STATE.IDLE);
    expect(a.idleCounter).toBe(OG_ANIMAL.idleFrames);
    run(a, OG_ANIMAL.idleFrames);
    expect(a.actionState).toBe(OG_STATE.WALK);
  });

  it('the third act-roll does nothing — the timer simply restarts (`:155-166`)', () => {
    const a = horse({ doChase: true, rng: seq(0.9) }).npc; // int(0.9*3) === 2
    a.startAction(OG_STATE.IDLE);
    a.idleCounter = 1;
    a.doAction();
    expect(a.actionState).toBe(OG_STATE.IDLE);
    expect(a.idleCounter).toBe(OG_ANIMAL.idleRetryFrames);
  });

  it('`checkPlayer` returns on its first line unless chasing (`:232-235`)', () => {
    const quiet = horse({ target: new Dummy(350), doChase: false }).npc;
    quiet.faceLeft();
    quiet.startAction(OG_STATE.IDLE);
    quiet.idleCounter = 99;
    quiet.doAction();
    expect(quiet.actionState).toBe(OG_STATE.IDLE);

    const keen = horse({ target: new Dummy(350), doChase: true }).npc;
    keen.faceLeft();
    keen.startAction(OG_STATE.IDLE);
    keen.idleCounter = 99;
    keen.doAction();
    expect(keen.actionState).toBe(OG_STATE.POSE); // it REARS, it does not gallop
    expect(keen.getAnim()).toBe(OG_ANIM.HORSE_REARING);
  });

  it('the rear clip ending is what starts the gallop (`:65-67`)', () => {
    const a = horse({ target: new Dummy(350), doChase: true }).npc;
    a.faceLeft();
    a.startAction(OG_STATE.IDLE);
    a.idleCounter = 99;
    a.doAction();
    expect(a.actionState).toBe(OG_STATE.POSE);
    run(a, CLIP);
    expect(a.getAnim()).toBe(OG_ANIM.HORSE_RUN);
  });

  it('all three idle clips share one duration — it is set AFTER the branch (`:96`)', () => {
    for (const r of [0, 0.4, 0.9]) {
      const a = horse({ rng: seq(r) }).npc;
      a.startAction(OG_STATE.IDLE);
      expect(a.idleCounter, `rng ${r}`).toBe(OG_ANIMAL.idleFrames);
    }
  });

  it('gallops 15 in a room and 12 in the overworld — read twice, once per direction (`:116`/`:128`)', () => {
    const a = horse().npc;
    a.destX = 9999;
    a.startAction(OG_STATE.RUN);
    expect(a.walkSpeed).toBe(OG_ANIMAL.runSpeedRoom);
    a.world.adventureMode = true;
    a.startAction(OG_STATE.RUN);
    expect(a.walkSpeed).toBe(OG_ANIMAL.runSpeed);

    const b = horse().npc;
    b.destX = -9999; // the other direction, same pair
    b.startAction(OG_STATE.RUN);
    expect(b.walkSpeed).toBe(-OG_ANIMAL.runSpeedRoom);
    b.world.adventureMode = true;
    b.startAction(OG_STATE.RUN);
    expect(b.walkSpeed).toBe(-OG_ANIMAL.runSpeed);
  });

  it('`init` neither grounds the body nor flips doChase — the bear and stag do both (`:31-45`)', () => {
    const row = rowFor(12);
    const h = horse({ doChase: false }).npc;
    h.setPosition(400, GROUND - 100);
    h.init(row);
    expect(h.y).toBe(GROUND - 100); // left in the air
    expect(h.doChase).toBe(false); // left alone

    const b = bear({ doChase: false }).npc;
    b.setPosition(400, GROUND - 100);
    b.init(rowFor(17));
    expect(b.y).toBe(GROUND);
    expect(b.doChase).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────── the stag ──

describe('EnemyStag — the charger, and the constructor that drops its argument', () => {
  it('THE CONSTRUCTOR DISCARDS doChase (`:12-28`) where the bear and horse keep it', () => {
    const s = new EnemyStag(world(), anims, geometry, seq(0.5), null, true);
    expect(s.doChase).toBe(false); // handed true, never assigned

    const b = new EnemyBear(world(), anims, geometry, seq(0.5), null, true);
    expect(b.doChase).toBe(true);
    const h = new EnemyHorse(world(), anims, geometry, seq(0.5), null, true);
    expect(h.doChase).toBe(true);
  });

  it('`init` is the ONLY thing that can ever set it (`:41-44`)', () => {
    const room = stag({ doChase: true }).npc;
    expect(room.doChase).toBe(false);
    room.init(rowFor(21));
    expect(room.doChase).toBe(true);

    const over = stag({ doChase: true, world: { adventureMode: true } }).npc;
    over.init(rowFor(21));
    expect(over.doChase).toBe(false); // and in the overworld, nothing sets it at all
  });

  it('`setLevel` is behaviourally identical to the base\'s (`:48-70` ↔ `NPC.as:239-260`)', () => {
    const s = stag().npc;
    const d = deer().npc; // does NOT override setLevel — it runs the base body
    for (const n of [s, d] as Npc[]) {
      n.level = 10;
      n.damage = 40;
      n.defense = 12;
      n.maxhp = 200;
      n.setHP(200);
    }
    s.setLevel(30);
    d.setLevel(30);
    const shape = (n: Npc): unknown => ({
      level: n.level,
      damage: n.damage,
      defense: n.defense,
      maxhp: n.maxhp,
      hp: n.getHP(),
      xp: n.xp,
    });
    expect(shape(s)).toEqual(shape(d));
  });

  it('…including the soft cap at 20 and the one-hit floor at 10', () => {
    const s = stag().npc;
    s.level = 10;
    s.damage = 40;
    s.defense = 12;
    s.maxhp = 200;
    s.setLevel(OG_NPC_SET_LEVEL.softCapLevel); // 20 → the 0.9 cap applies
    expect(s.damage).toBe(Math.trunc(40 * ((20 / 10) * OG_NPC_SET_LEVEL.softCapFactor)));

    const t = stag().npc;
    t.level = 5;
    t.damage = 40;
    t.defense = 12;
    t.maxhp = 200;
    t.setLevel(OG_NPC_SET_LEVEL.trivialLevel); // 10 → everything forced to 1
    expect([t.damage, t.defense, t.maxhp, t.getHP()]).toEqual([1, 1, 1, 1]);
  });

  it('`setLevel` OVERWRITES the animal xp with the base curve — a levelled stag pays less (`:62`)', () => {
    const s = stag().npc;
    s.init(rowFor(21));
    const beforeLevel = s.level;
    expect(s.xp).toBe(beforeLevel * OG_ANIMAL.xp.perLevel + OG_ANIMAL.xp.base);
    s.setLevel(30);
    expect(s.xp).toBe(30 * OG_NPC_XP.perLevel + OG_NPC_XP.base);
    expect(s.xp).toBeLessThan(30 * OG_ANIMAL.xp.perLevel + OG_ANIMAL.xp.base);
  });

  it('the rear clip ends into CHARGING from ATTACK, and into RUN from anywhere else (`:98-108`)', () => {
    const a = stag().npc;
    a.destX = 9999;
    a.startAction(OG_STATE.ATTACK);
    expect(a.getAnim()).toBe(OG_ANIM.HORSE_REARING);
    run(a, CLIP);
    expect(a.actionState).toBe(OG_STATE.CHARGING);

    const b = stag().npc;
    b.destX = 9999;
    b.startAction(OG_STATE.POSE);
    b.startAnim(OG_ANIM.HORSE_REARING);
    run(b, CLIP);
    expect(b.actionState).not.toBe(OG_STATE.CHARGING);
    expect(b.getAnim()).toBe(OG_ANIM.HORSE_RUN);
  });

  it('CHARGING gores with the HEAD at LAUNCH_KNOCKDOWN, on EVERY frame (`:265-272`)', () => {
    const t = new Dummy(400);
    const a = stag({ target: t }).npc;
    a.destX = 9999;
    a.startAction(OG_STATE.CHARGING);
    a.doAction();
    a.doAction();
    expect(t.hits).toHaveLength(2);
    expect(t.hits[0]?.part).toBe(OG_PART.head);
    expect(t.hits[0]?.launchType).toBe(OG_LAUNCH.LAUNCH_KNOCKDOWN);
  });

  it('the charge runs at 15 with NO overworld step-down, in BOTH directions, unlike RUN (`:190`/`:195`)', () => {
    // Both branches: the source writes the speed twice, and only RUN's pair reads
    // `isAdventureMode()`. Testing one direction alone leaves the other unguarded.
    const a = stag().npc;
    a.destX = 9999; // ahead → the `else` branch
    a.world.adventureMode = true;
    a.startAction(OG_STATE.CHARGING);
    expect(a.walkSpeed).toBe(OG_STAG.chargeSpeed);
    a.startAction(OG_STATE.RUN);
    expect(a.walkSpeed).toBe(OG_ANIMAL.runSpeed); // RUN steps down, CHARGING does not

    const b = stag().npc;
    b.destX = -9999; // behind → the `if` branch
    b.world.adventureMode = true;
    b.startAction(OG_STATE.CHARGING);
    expect(b.walkSpeed).toBe(-OG_STAG.chargeSpeed);
    b.startAction(OG_STATE.RUN);
    expect(b.walkSpeed).toBe(-OG_ANIMAL.runSpeed);
  });

  it('the charge ends at destX, into WALK (`:268-271`)', () => {
    const a = stag({ rng: seq(0) }).npc;
    a.destX = 405;
    a.startAction(OG_STATE.CHARGING); // destX 405 > posX 400 → +15
    a.doAction(); // 400 → 415; |405 − 415| === 10, NOT < 10
    expect(a.actionState).toBe(OG_STATE.CHARGING);
    a.destX = 420;
    a.doAction(); // 415 → 430; |420 − 430| === 10 → still not
    expect(a.actionState).toBe(OG_STATE.CHARGING);
    a.destX = 435;
    a.doAction(); // 430 → 445; |435 − 445| === 10 → not
    a.destX = 448;
    a.doAction(); // 445 → 460; |448 − 460| === 12 → not; now close the gap
    a.destX = a.posX + 9;
    a.walkSpeed = 0;
    a.doAction();
    expect(a.actionState).toBe(OG_STATE.WALK);
  });

  it('the off-stage red-freeze carries an extra `!doChase` guard the other three lack (`:256`)', () => {
    const offStage = (n: Npc & { destX: number }): number => {
      n.setPosition(-OG_ANIMAL.offStage.dest, GROUND);
      n.destX = -OG_ANIMAL.offStage.dest;
      n.startAction(OG_STATE.RUN);
      n.walkSpeed = 0;
      n.doAction();
      return n.actionState;
    };
    const chasing = stag({ rng: seq(0), world: { adventureMode: true } }).npc;
    chasing.doChase = true;
    expect(offStage(chasing)).not.toBe(OG_STATE.REDFREEZE);

    const idle = stag({ rng: seq(0), world: { adventureMode: true } }).npc;
    idle.doChase = false;
    expect(offStage(idle)).toBe(OG_STATE.REDFREEZE);

    // …and a bear red-freezes off-stage whatever its chase flag says.
    const b = bear({ rng: seq(0), world: { adventureMode: true } }).npc;
    b.doChase = true;
    expect(offStage(b)).toBe(OG_STATE.REDFREEZE);
  });

  it('its idle act-roll is NOT fenced by doChase, where the horse\'s is (`:213` vs `EnemyHorse.as:153`)', () => {
    const s = stag({ rng: seq(0) }).npc;
    s.doChase = false;
    s.startAction(OG_STATE.IDLE);
    run(s, OG_ANIMAL.idleFrames);
    expect(s.actionState).toBe(OG_STATE.WALK); // an un-chased stag still wanders

    const h = horse({ doChase: false, rng: seq(0) }).npc;
    h.startAction(OG_STATE.IDLE);
    run(h, OG_ANIMAL.idleFrames);
    expect(h.actionState).toBe(OG_STATE.IDLE); // an un-chased horse does not
  });

  it('a CHASING stag rears to gore at 400, a quiet one bolts at 200 (`:299-322`)', () => {
    const keen = stag({ target: new Dummy(1) }).npc; // 399 px away
    keen.doChase = true;
    keen.faceLeft();
    keen.startAction(OG_STATE.IDLE);
    keen.idleCounter = 99;
    keen.doAction();
    expect(keen.actionState).toBe(OG_STATE.ATTACK);
    expect(keen.destX).toBe(-OG_ANIMAL.offStage.dest);

    const quiet = stag({ target: new Dummy(250) }).npc; // 150 px away
    quiet.doChase = false;
    quiet.faceLeft();
    quiet.startAction(OG_STATE.IDLE);
    quiet.idleCounter = 99;
    quiet.doAction();
    expect(quiet.actionState).toBe(OG_STATE.POSE);
    expect(quiet.getAnim()).toBe(OG_ANIM.HORSE_REARING);
  });

  it('`die()` matches its three siblings: no sound, grounded, one death event (`:327`)', () => {
    const a = stag().npc;
    a.setPosition(400, 100);
    a.die();
    expect(ofType(a, 'sound')).toHaveLength(0);
    expect(a.y).toBe(GROUND);
    expect(a.getAnim()).toBe(OG_ANIM.HORSE_DEATH);
    expect(ofType(a, 'death')).toHaveLength(1);
  });
});
