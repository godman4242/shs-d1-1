/**
 * LANE L4b, SLICE 0 — `src/core/npc/NpcController.ts`: an `Npc` behind the
 * EXISTING `OpponentController` seam.
 *
 * Two facts this file pins, both decided in the slice-0 plan:
 *   1. THE ORIGINAL RUNS AT 24 fps AND THE SIM AT 60 Hz. The actor is not
 *      rescaled; it is STEPPED — exactly 24 `update()` calls per 60 ticks, on a
 *      fixed integer accumulator, so every ported constant stays verbatim.
 *   2. THE SIM OWNS THE ENEMY'S X. Each tick the controller re-syncs the actor's
 *      x from the view before stepping, and the intent's `moveX` is the SIGN of
 *      the actor's own displacement, HELD between steps so the Sim keeps moving
 *      at its own `ENEMY_SPEED` on the ticks the actor does not think.
 *      The actor's y is its own: the Sim never moves an enemy's y.
 *
 * What the seam can express is `moveX`, `strike` (the actor's own
 * `target.checkHitObject` swing) and a `telegraph` on entering ATTACK_STATE.
 * What it cannot carry is a FINDING for L5, listed in DIVERGENCES, not widened here.
 */
import { describe, expect, it } from 'vitest';
import { OG_STATE, type OgState } from '../src/config/ogActor';
import { FIXED_HZ, MS_PER_S, OG_FPS } from '../src/config/timing';
import { Npc } from '../src/core/npc/Npc';
import { NpcController } from '../src/core/npc/NpcController';
import { NpcDamage } from '../src/core/npc/NpcDamage';
import type { AnimLibrary, HitGeometry, NpcWorld } from '../src/core/npc/types';
import type { OpponentIntent, OpponentView } from '../src/core/OpponentController';

const GROUND = 430;
const ATTACK_FRAMES = 12;

const world = (): NpcWorld => ({
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
  peaceful: false,
  duelMode: false,
  externalRedFreezeCheck: () => undefined,
});
const anims: AnimLibrary = { clip: () => ({ durationFrames: ATTACK_FRAMES, loop: false }) };
const geometry: HitGeometry = { partAtPoint: () => null, partHitBy: () => null, partX: () => 0 };

/**
 * The smallest real descendant: walks toward its target at 5 px/frame, enters
 * ATTACK inside 100 px, swings once on the next frame, then walks again.
 */
class Walker extends Npc {
  updates = 0;
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    // Every real descendant starts the attack clip here (`EnemyKatana.as:139`).
    if (actionState === OG_STATE.ATTACK) this.startAnim('attack');
    else this.startAnim('walk');
  }
  override update(): void {
    this.updates++;
    const t = this.target;
    if (t === null) return;
    if (this.actionState === OG_STATE.ATTACK) {
      t.checkHitObject({ kind: 'part', part: null, owner: this }, new NpcDamage(this.damage, this.level));
      this.startAction(OG_STATE.WALK);
      return;
    }
    if (Math.abs(t.x - this.x) < 100) {
      this.startAction(OG_STATE.ATTACK);
      return;
    }
    this.movePositionX(t.x < this.x ? -5 : 5);
  }
}

const view = (enemyX: number, playerX = 100, over: Partial<OpponentView> = {}): OpponentView => ({
  playerPos: { x: playerX, y: GROUND },
  enemyPos: { x: enemyX, y: GROUND },
  playerStance: 'balanced',
  enemyStance: 'balanced',
  enemyFocus: 0,
  playerJumping: false,
  ...over,
});

const make = (): { npc: Walker; ai: NpcController } => {
  const npc = new Walker(world(), anims, geometry, () => 0.5);
  npc.setPosition(700, GROUND);
  npc.startAction(OG_STATE.WALK);
  return { npc, ai: new NpcController(npc) };
};

describe('NpcController — 24 fps inside 60 Hz', () => {
  it('steps the actor exactly OG_FPS times per FIXED_HZ ticks, on an integer clock', () => {
    const { npc, ai } = make();
    for (let f = 0; f < FIXED_HZ; f++) ai.next(f, view(700 - f));
    expect(npc.updates).toBe(OG_FPS);
    for (let f = FIXED_HZ; f < FIXED_HZ * 10; f++) ai.next(f, view(700));
    expect(npc.updates).toBe(OG_FPS * 10);
    expect([OG_FPS, FIXED_HZ]).toEqual([24, 60]);
  });

  it('the step pattern is 2 ticks, 3 ticks, 2, 3 … — never two steps in one tick', () => {
    const { npc, ai } = make();
    const stepsPerTick: number[] = [];
    for (let f = 0; f < 10; f++) {
      const before = npc.updates;
      ai.next(f, view(700));
      stepsPerTick.push(npc.updates - before);
    }
    expect(stepsPerTick).toEqual([0, 0, 1, 0, 1, 0, 0, 1, 0, 1]);
  });
});

describe('NpcController — position authority and the intent it emits', () => {
  it('re-syncs the actor\'s x from the view before every step; y stays the actor\'s own', () => {
    const { npc, ai } = make();
    npc.y = GROUND - 50;
    ai.next(0, view(650, 100, { enemyPos: { x: 650, y: GROUND + 99 } }));
    expect(npc.posX).toBe(650);
    expect(npc.x).toBe(650);
    expect(npc.y).toBe(GROUND - 50);
  });

  it('moveX is the sign of the actor\'s displacement, and is HELD on the ticks between steps', () => {
    const { ai } = make();
    expect(ai.next(0, view(700))).toEqual({});
    expect(ai.next(1, view(700))).toEqual({});
    expect(ai.next(2, view(700))).toEqual({ moveX: -1 }); // first step: walked 5 px left
    expect(ai.next(3, view(698))).toEqual({ moveX: -1 }); // no step this tick — held
    const right = make();
    for (let f = 0; f < 5; f++) right.ai.next(f, view(700, 1000));
    expect(right.ai.next(5, view(700, 1000)).moveX).toBe(1);
  });

  it('a swing at the target becomes ONE strike intent on the tick it happens', () => {
    const { npc, ai } = make();
    const strikes: number[] = [];
    const telegraphs: number[] = [];
    for (let f = 0; f < 30; f++) {
      const i = ai.next(f, view(150)); // 50 px away: attack next step, swing the step after
      if (i.strike === true) strikes.push(f);
      if (i.telegraph !== undefined) telegraphs.push(f);
    }
    // step ticks: 2, 4, 7, 9, 12, 14, 17, 19, 22, 24, 27, 29
    // step 1 (tick 2): enter ATTACK → telegraph. step 2 (tick 4): swing → strike. step 3: attack again …
    // The swings on steps 4, 6, 8, 10, 12 are REFUSED by the proxy's twelve-step guard —
    // the player's own gotHitCounter (NPC.as:387/:462) — exactly as the source refuses them.
    expect(telegraphs).toEqual([2, 7, 12, 17, 22, 27]);
    expect(strikes).toEqual([4]);
    expect(npc.actionState).toBe(OG_STATE.WALK);
  });

  it('the proxy refuses a second swing for twelve actor steps, like the player\'s own i-frames', () => {
    const { ai } = make();
    const strikes: number[] = [];
    for (let f = 0; f < 60; f++) if (ai.next(f, view(150)).strike === true) strikes.push(f);
    // swings land on steps 2 and 14 (step 14 is tick 34); steps 4..12 are inside the guard
    expect(strikes).toEqual([4, 34]);
  });

  it('the telegraph carries the attack clip\'s length in ms at the ORIGINAL frame rate', () => {
    const { ai } = make();
    let seen: OpponentIntent['telegraph'];
    for (let f = 0; f < 5; f++) {
      const t = ai.next(f, view(150)).telegraph;
      if (t !== undefined) seen = t;
    }
    expect(seen).toEqual({ kind: 'strike', durationMs: (ATTACK_FRAMES * MS_PER_S) / OG_FPS });
  });

  it('stops moving while attacking: moveX drops out of the intent on the attack step', () => {
    const { ai } = make();
    ai.next(0, view(150));
    ai.next(1, view(150));
    expect(ai.next(2, view(150)).moveX).toBeUndefined();
  });

  it('never emits anything the seam does not already define (gate L4b-B)', () => {
    const { ai } = make();
    const allowed = new Set(['strike', 'throwKunai', 'moveX', 'switchStance', 'telegraph']);
    for (let f = 0; f < 60; f++) {
      for (const k of Object.keys(ai.next(f, view(150 + f)))) expect(allowed.has(k), k).toBe(true);
    }
  });

  it('the target proxy reports the player\'s position and never dead — the Sim ends the fight itself', () => {
    const { npc, ai } = make();
    ai.next(0, view(700, 123, { playerPos: { x: 123, y: GROUND - 7 } }));
    expect(npc.target?.x).toBe(123);
    expect(npc.target?.y).toBe(GROUND - 7);
    expect(npc.target?.getMapPosition()).toBe(123);
    expect(npc.target?.isDead()).toBe(false);
  });
});
