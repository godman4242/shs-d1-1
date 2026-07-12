/**
 * Stage 2 M4 — src/core/AISeamController.ts (spec item 2).
 * Telegraph-then-commit: windup ≥ telegraphMs before ANY strike; stance
 * switches queue AI_PENDING_STANCE_MS with a telegraph flash; kunai only in
 * the 240–720 px band (tier kunaiChance); injected rng only. The controller
 * DECIDES; the Sim executes — these tests drive next()/react() directly
 * with synthetic views.
 */
import { describe, expect, it } from 'vitest';
import { AI_PENDING_STANCE_MS, AI_STRIKE_RANGE, AI_TIERS } from '../src/config/ai';
import { AISeamController } from '../src/core/AISeamController';
import type { OpponentIntent, OpponentView } from '../src/core/OpponentController';
import type { Rng } from '../src/core/Sim';
import { msToFrames } from '../src/core/time';

const view = (over: Partial<OpponentView> = {}): OpponentView => ({
  playerPos: { x: 100, y: 430 },
  enemyPos: { x: 700, y: 430 },
  playerStance: 'balanced',
  enemyStance: 'heavy', // heavy BEATS balanced — no counter-pick urge
  enemyFocus: 50,
  playerJumping: false,
  ...over,
});
/** In strike range (dist 100 < 132), enemy already counter-stanced. */
const closeView = (over: Partial<OpponentView> = {}): OpponentView =>
  view({ enemyPos: { x: 200, y: 430 }, ...over });

const lowRng: Rng = () => 0; // every chance-roll passes
const highRng: Rng = () => 0.99; // every chance-roll fails

/** Drive next() from `from` until the predicate matches; returns the frame. */
const frameWhere = (
  ai: AISeamController,
  v: OpponentView,
  from: number,
  upTo: number,
  pred: (i: OpponentIntent) => boolean,
): number => {
  for (let f = from; f < upTo; f++) {
    if (pred(ai.next(f, v))) return f;
  }
  return -1;
};

describe('AISeamController — telegraph-then-commit (gate: windup ≥ telegraphMs)', () => {
  it('telegraphs first, then strikes no earlier than telegraphMs later', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal);
    const first = ai.next(1, closeView());
    expect(first.telegraph).toEqual({ kind: 'strike', durationMs: 520 });
    expect(first.strike).toBeUndefined();
    const strikeFrame = frameWhere(ai, closeView(), 2, 200, (i) => i.strike === true);
    expect(strikeFrame).toBe(1 + msToFrames(520)); // exactly the windup, never earlier
  });
  it('never strikes without a telegraph across a long deterministic run', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal);
    let telegraphFrame = -1;
    for (let f = 1; f < 600; f++) {
      const intent = ai.next(f, closeView());
      if (intent.telegraph?.kind === 'strike') telegraphFrame = f;
      if (intent.strike === true) {
        expect(telegraphFrame).toBeGreaterThan(-1);
        expect(f - telegraphFrame).toBeGreaterThanOrEqual(msToFrames(520));
      }
    }
  });
  it('waits (no commitment) when the aggression roll fails', () => {
    const ai = new AISeamController(highRng, AI_TIERS.normal);
    for (let f = 1; f < 120; f++) {
      const intent = ai.next(f, closeView());
      expect(intent.strike).toBeUndefined();
      expect(intent.telegraph).toBeUndefined();
    }
  });
});

describe('AISeamController — movement (approach/engage)', () => {
  it('approaches when outside strike range but inside AI_APPROACH_RANGE', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.easy); // kunaiChance 0
    const intent = ai.next(1, view({ enemyPos: { x: 500, y: 430 } })); // dist 400
    expect(intent.moveX).toBe(-1); // player is to the left
  });
  it('stays idle beyond AI_APPROACH_RANGE (620)', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.easy);
    const intent = ai.next(1, view({ enemyPos: { x: 750, y: 430 } })); // dist 650
    expect(intent).toEqual({});
  });
  it('stops approaching inside strike range', () => {
    const ai = new AISeamController(highRng, AI_TIERS.easy);
    const intent = ai.next(1, closeView());
    expect(intent.moveX).toBeUndefined();
  });
});

describe('AISeamController — kunai (240–720 band, tier chance)', () => {
  it('throws in the band when the roll passes, then recovers (no instant repeat)', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal); // kunaiChance 0.25
    const v = view({ enemyPos: { x: 500, y: 430 } }); // dist 400 ∈ [240, 720]
    const intent = ai.next(1, v);
    expect(intent.throwKunai).toBe(true);
    expect(ai.next(2, v).throwKunai).toBeUndefined(); // recovering
  });
  it('easy tier (kunaiChance 0) never throws', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.easy);
    for (let f = 1; f < 300; f++) {
      expect(ai.next(f, view({ enemyPos: { x: 500, y: 430 } })).throwKunai).toBeUndefined();
    }
  });
  it('never throws below the 240 px minimum', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal);
    const v = view({ enemyPos: { x: 300, y: 430 } }); // dist 200 < 240
    expect(ai.next(1, v).throwKunai).toBeUndefined();
  });
});

describe('AISeamController — counter stance pick (queued + telegraphed)', () => {
  // Player light: the counter is balanced (STANCE_BEATS balanced → light).
  // Enemy balanced→? costs 34×1.5=51 > 50 focus — use a light enemy (cost 34).
  const counterableView = (): OpponentView =>
    closeView({ playerStance: 'light', enemyStance: 'light', enemyFocus: 50 });
  it('queues the pick with a stance telegraph, switching after AI_PENDING_STANCE_MS', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal); // pick chance 0.5
    const first = ai.next(1, counterableView());
    expect(first.telegraph).toEqual({ kind: 'stance', durationMs: AI_PENDING_STANCE_MS });
    expect(first.switchStance).toBeUndefined();
    const v = counterableView();
    const switchFrame = frameWhere(ai, v, 2, 200, (i) => i.switchStance !== undefined);
    expect(switchFrame).toBe(1 + msToFrames(AI_PENDING_STANCE_MS));
    const intentAt = new AISeamController(lowRng, AI_TIERS.normal);
    intentAt.next(1, counterableView());
    const done = frameWhere(intentAt, v, 2, 200, (i) => i.switchStance !== undefined);
    expect(done).toBeGreaterThan(1);
  });
  it('skips the pick when Focus cannot afford the switch', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal);
    const broke = closeView({ playerStance: 'light', enemyStance: 'light', enemyFocus: 10 });
    const intent = ai.next(1, broke);
    expect(intent.telegraph?.kind).not.toBe('stance'); // goes for the strike instead
  });
  it('never picks when already countering', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal);
    const intent = ai.next(1, closeView()); // heavy already beats balanced
    expect(intent.telegraph?.kind).toBe('strike');
  });
});

describe('AISeamController — react seam (block/dodge with reactMs cooldown)', () => {
  it('blocks when the roll passes, then cannot react again inside reactMs', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal); // block 0.30
    expect(ai.react(100)).toBe('block'); // 0 < 0.30
    expect(ai.react(101)).toBeNull(); // cooling down (320 ms)
    expect(ai.react(100 + msToFrames(320))).toBe('block');
  });
  it('dodges when block fails but dodge passes', () => {
    // rolls: block 0.35 (>0.30 fail), dodge 0.10 (<0.15 pass)
    const rolls = [0.35, 0.1];
    let i = 0;
    const seq: Rng = () => rolls[i++ % rolls.length] ?? 0;
    const ai = new AISeamController(seq, AI_TIERS.normal);
    expect(ai.react(100)).toBe('dodge');
  });
  it('a failed roll still consumes the reaction window', () => {
    const ai = new AISeamController(highRng, AI_TIERS.normal);
    expect(ai.react(100)).toBeNull();
    // 0.99 fails both — but the attention window is spent regardless:
    const spy: Rng = () => 0; // would pass if rolled
    const ai2 = new AISeamController(spy, AI_TIERS.normal);
    expect(ai2.react(100)).toBe('block');
    expect(ai2.react(105)).toBeNull(); // still inside 320 ms
  });
  it('AI_STRIKE_RANGE sanity: closeView really is inside it', () => {
    expect(Math.abs(closeView().enemyPos.x - closeView().playerPos.x)).toBeLessThan(AI_STRIKE_RANGE);
  });
});
