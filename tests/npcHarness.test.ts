/**
 * THE PREFLIGHT, PROVEN AGAINST THE THREE FAILURES IT WAS BUILT FOR.
 *
 * Session 35 wrote 99 tests across L4b slice 3 and **3 of 3 first-run failures were TEST
 * bugs, not port bugs**. Each cost a debugging cycle, and each read as bare `OG_STATE`
 * integers — `expected 10 to be 1` — with no hint of what had moved.
 *
 * This file reconstructs all three BROKEN setups verbatim and asserts that each one now
 * fails as a single readable preflight line. That is the point of the commit: not that the
 * helpers exist, but that they catch the specific bugs that were actually paid for.
 *
 * ⚠️ IT ALSO CORRECTS THE KICKOFF. `docs/sessions/HARNESS_KICKOFF.md` claimed all three
 * shared one root — "an actor parked in a state its own `doAction` left at once". Measured
 * against the source that is true of exactly ONE of the three, so two helpers could never
 * have covered it and `parked()` would have been actively WRONG on the bear. The three
 * checks map one-to-one onto the three failures, and each `describe` below names which.
 *
 * The fixture here is deliberately minimal and local: the subject is the HELPER, so it
 * wants the smallest actor that can exhibit the bug, not `npcSlice3a`'s full factory.
 */
import { describe, expect, it } from 'vitest';
import { OG_ANIM, OG_STATE } from '../src/config/ogActor';
import { OG_ALPHA } from '../src/config/ogEnemyWolfAlpha';
import { EnemyBear } from '../src/core/npc/EnemyBear';
import { EnemyWolfAlpha } from '../src/core/npc/EnemyWolfAlpha';
import type { Npc } from '../src/core/npc/Npc';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from '../src/core/npc/types';
import type { Rng } from '../src/core/Sim';
import { counting, parked, readsWhatYouWrote, rollsFor, seq, stateName } from './utils/npcHarness';

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
  checkHitObject(): boolean {
    return true;
  }
}

const stats = (npc: Npc): void => {
  npc.setPosition(400, GROUND);
  npc.level = 10;
  npc.damage = 10;
  npc.defense = 3;
  npc.maxhp = 50;
  npc.setHP(50);
};

const bear = (rng: Rng = seq(0.5), target: NpcTarget = new Dummy(511)): EnemyBear => {
  const npc = new EnemyBear(world({ nearestEnemy: () => target }), anims, geometry, rng, target);
  stats(npc);
  return npc;
};

const alpha = (rng: Rng = seq(0.5), over: Partial<NpcWorld> = {}): EnemyWolfAlpha => {
  // A target, wired to `nearestEnemy`, exactly as `npcSlice3b`'s factory does. Without one
  // the alpha's `update()` takes a different path and never advances the clip — which is
  // how the first draft of this file "proved" that `parked()` caught nothing.
  const t = new Dummy(100);
  const npc = new EnemyWolfAlpha(world({ nearestEnemy: () => t, ...over }), anims, geometry, rng, t);
  stats(npc);
  return npc;
};

describe('stateName — the reason any of this is readable', () => {
  it('names a state instead of printing its ordinal', () => {
    expect(stateName(OG_STATE.FALL)).toBe('FALL');
    expect(stateName(OG_STATE.LAND)).toBe('LAND');
  });

  it('does not pretend to know an ordinal that is not a state', () => {
    expect(stateName(9999)).toBe('OG_STATE(9999)');
  });
});

/**
 * SESSION 35 FAILURE (2) — "an alpha parked in FALL on the ground lands on frame 1 and the
 * LAND clip masked what was under test." The ONE failure the kickoff's premise describes.
 */
describe('parked() — failure (2): the actor left the state the test parked it in', () => {
  it('PASSES at setup, which is exactly why placement matters', () => {
    // `startAction(FALL)` only starts a clip, so the actor really IS in FALL here. A
    // preflight put on this line catches nothing — the kickoff's wording hides that.
    const a = alpha();
    a.startAction(OG_STATE.FALL);
    expect(() => {
      parked(a, OG_STATE.FALL);
    }).not.toThrow();
  });

  it('reproduces the failure as ONE readable line when placed at the assertion', () => {
    // The broken setup, verbatim: parked in FALL while standing ON the ground.
    const a = alpha();
    a.startAction(OG_STATE.FALL);
    a.startAnim(OG_ANIM.WOLF_POUNCE_MID);
    for (let i = 0; i < CLIP; i += 1) a.update();

    expect(() => {
      parked(a, OG_STATE.FALL);
    }).toThrow(/left FALL for LAND/);
    // And it names the clip that did the masking, which is what the test was reading.
    expect(() => {
      parked(a, OG_STATE.FALL);
    }).toThrow(new RegExp(OG_ANIM.WOLF_LAUNCHEDEND));
  });

  it('stays silent on the FIXED setup — airborne, as the shipped test now does it', () => {
    const a = alpha();
    a.setPosition(400, GROUND - 200);
    a.startAction(OG_STATE.FALL);
    a.startAnim(OG_ANIM.WOLF_POUNCE_MID);
    for (let i = 0; i < CLIP; i += 1) a.update();
    expect(() => {
      parked(a, OG_STATE.FALL);
    }).not.toThrow();
    expect(a.getAnim()).toBe(OG_ANIM.WOLF_POUNCE_END);
  });

  it('accepts an actor parked by direct assignment, and never calls startAction itself', () => {
    // The suites park both ways, and a direct assignment is used precisely to skip the
    // clip and rng side effects a real startAction would fire.
    const a = alpha(counting(0.5));
    const before = (a as unknown as { rng: { calls: number } }).rng.calls;
    a.actionState = OG_STATE.GOTLAUNCHED;
    expect(() => {
      parked(a, OG_STATE.GOTLAUNCHED);
    }).not.toThrow();
    expect((a as unknown as { rng: { calls: number } }).rng.calls).toBe(before);
  });
});

/**
 * SESSION 35 FAILURE (1) — "the bear's cooldown is TICKED BEFORE it is CHECKED, so a
 * cooldown of 1 is already spent." NEITHER `parked()` nor `rollsFor()`: nothing left a
 * state and no rng was rolled. This is the third check the kickoff did not ask for.
 */
describe('readsWhatYouWrote() — failure (1): the counter did not survive to the branch', () => {
  it('reproduces the failure as ONE readable line, naming both numbers', () => {
    const a = bear();
    a.destX = 9999;
    a.startAction(OG_STATE.RUN);
    a.idleCounter = 1;
    // `doAction` decrements idleCounter at the TOP, before the switch that reads it.
    expect(() => {
      readsWhatYouWrote(a, 'idleCounter', () => {
        a.doAction();
      });
    }).toThrow(/setup wrote idleCounter = 1, but the body CONSULTED 0/);
  });

  it('fires on a cooldown of 2 as well — the tick is UNCONDITIONAL', () => {
    // Worth pinning rather than treating as noise: `doAction` decrements any non-zero
    // counter, so EVERY non-zero cooldown a test writes is consulted one lower. The check
    // is not about the number 1; it is about the tick.
    const a = bear();
    a.destX = 9999;
    a.startAction(OG_STATE.RUN);
    a.idleCounter = 2;
    expect(() => {
      readsWhatYouWrote(a, 'idleCounter', () => {
        a.doAction();
      });
    }).toThrow(/wrote idleCounter = 2, but the body CONSULTED 1/);
  });

  it('stays silent at zero, where there is nothing to tick', () => {
    const a = bear();
    a.destX = 9999;
    a.startAction(OG_STATE.RUN);
    a.idleCounter = 0;
    expect(() => {
      readsWhatYouWrote(a, 'idleCounter', () => {
        a.doAction();
      });
    }).not.toThrow();
  });

  it('says so when the body never read the field at all', () => {
    // Writing a field in setup proves nothing if the branch never consults it — a silent
    // vacuous test, and the one failure mode worse than a wrong number.
    const a = bear();
    a.idleCounter = 5;
    expect(() => {
      readsWhatYouWrote(a, 'idleCounter', () => {
        /* nothing reads it */
      });
    }).toThrow(/never read 'idleCounter' at all/);
  });

  it('restores the real property afterwards, value and all', () => {
    const a = bear();
    a.destX = 9999;
    a.startAction(OG_STATE.RUN);
    a.idleCounter = 4;
    try {
      readsWhatYouWrote(a, 'idleCounter', () => {
        a.doAction();
      });
    } catch {
      /* expected — the tick */
    }
    expect(a.idleCounter).toBe(3);
    // A DATA descriptor again, not the temporary accessor — `value` and `writable` exist
    // only on a data property.
    expect(Object.getOwnPropertyDescriptor(a, 'idleCounter')).toMatchObject({ value: 3, writable: true });
  });
});

/**
 * SESSION 35 FAILURE (3) — "an rng of 0.9 failed the walk roll the cutscene test needed to
 * pass." The actor FAILED to leave IDLE, so a "left its state" check is green. `seq`
 * CLAMPS, so one value silently served two rolls with different bands.
 */
describe('rollsFor() — failure (3): one seq value, two bands', () => {
  it('reports the values a body consumed, not just how many', () => {
    const a = alpha(seq(0.9), { cutsceneShowing: true });
    const record = rollsFor(a, () => {
      a.startAction(OG_STATE.IDLE);
      a.idleCounter = 1;
      a.doAction();
    });
    // TWO rolls, ONE supplied value — the mis-sizing, made visible.
    expect(record.calls).toBe(2);
    expect(record.values).toEqual([0.9, 0.9]);
  });

  it('shows WHY 0.9 fails where 0.5 passes — the two bands disagree on the same number', () => {
    // roll A, the howl escape: asInt(v * howlDice) === 0
    // roll B, the walk escape: asInt(v * idle.walkDice) < idle.walkBelow
    const band = (v: number): { howl: boolean; walk: boolean } => ({
      howl: Math.trunc(v * OG_ALPHA.howlDice) === 0,
      walk: Math.trunc(v * OG_ALPHA.idle.walkDice) < OG_ALPHA.idle.walkBelow,
    });
    expect(band(0.9)).toEqual({ howl: false, walk: false }); // no howl, and NO walk — the bug
    expect(band(0.5)).toEqual({ howl: false, walk: true }); // no howl, and it walks
  });

  it('the actor really does stay in IDLE on 0.9 and walk on 0.5', () => {
    const stuck = alpha(seq(0.9), { cutsceneShowing: true });
    stuck.startAction(OG_STATE.IDLE);
    stuck.idleCounter = 1;
    stuck.doAction();
    expect(stuck.actionState).toBe(OG_STATE.IDLE);

    const walks = alpha(seq(0.5), { cutsceneShowing: true });
    walks.startAction(OG_STATE.IDLE);
    walks.idleCounter = 1;
    walks.doAction();
    expect(walks.actionState).toBe(OG_STATE.WALK);
  });

  it('restores the real rng even when the body throws', () => {
    const a = alpha(seq(0.25));
    const before = (a as unknown as { rng: Rng }).rng;
    expect(() =>
      rollsFor(a, () => {
        throw new Error('boom');
      }),
    ).toThrow('boom');
    expect((a as unknown as { rng: Rng }).rng).toBe(before);
  });
});

describe('seq — the clamp that made failure (3) silent', () => {
  it('returns its last value forever rather than signalling exhaustion', () => {
    const r = seq(0.9);
    expect([r(), r(), r()]).toEqual([0.9, 0.9, 0.9]);
  });

  it('hands out one value per roll when sized properly', () => {
    const r = seq(0.9, 0.9, 0.5);
    expect([r(), r(), r(), r()]).toEqual([0.9, 0.9, 0.5, 0.5]);
  });

  it('an empty seq is zero forever', () => {
    const r = seq();
    expect([r(), r()]).toEqual([0, 0]);
  });
});
