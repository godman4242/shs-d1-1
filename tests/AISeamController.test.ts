/**
 * Stage 2 M4 — src/core/AISeamController.ts (spec item 2).
 * Telegraph-then-commit: windup ≥ telegraphMs before ANY strike; stance
 * switches queue AI_PENDING_STANCE_MS with a telegraph flash; kunai only in
 * the AI_KUNAI_RANGE band (tier kunaiChance); injected rng only. The controller
 * DECIDES; the Sim executes — these tests drive next()/react() directly
 * with synthetic views.
 */
import { describe, expect, it } from 'vitest';
import {
  AI_MELEE_RANGE,
  AI_PENDING_STANCE_MS,
  AI_POINT_BLANK_X,
  AI_TELEGRAPH_MS,
  AI_TIERS,
} from '../src/config/ai';
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
/**
 * Inside the MELEE GATE (SESSION13 D8): `|dx| < 50 && Δy < 50` world px, on
 * BOTH axes. dist 30 here — and 30 > AI_POINT_BLANK_X, so this is the
 * "closing" telegraph case. The enemy is already counter-stanced.
 * ⚠️ The old fixture sat at dist 100, which the deleted `AI_STRIKE_RANGE`
 * (110) admitted and the real 50 px gate does not.
 */
const closeView = (over: Partial<OpponentView> = {}): OpponentView =>
  view({ enemyPos: { x: 130, y: 430 }, ...over });

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
  it('telegraphs first, then strikes exactly THAT telegraph\'s duration later', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal);
    const first = ai.next(1, closeView());
    // closeView is the CLOSING case (dist 30 > AI_POINT_BLANK_X 25) → 600 ms.
    expect(first.telegraph).toEqual({ kind: 'strike', durationMs: AI_TELEGRAPH_MS.closing });
    expect(first.strike).toBeUndefined();
    const strikeFrame = frameWhere(ai, closeView(), 2, 200, (i) => i.strike === true);
    // Exactly the windup it announced, never earlier — the contract is the
    // announced duration, NOT a global "≥520 ms" floor (SESSION13 D8).
    expect(strikeFrame).toBe(1 + msToFrames(AI_TELEGRAPH_MS.closing));
  });
  it('never strikes without a telegraph across a long deterministic run', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal);
    let telegraphFrame = -1;
    for (let f = 1; f < 600; f++) {
      const intent = ai.next(f, closeView());
      if (intent.telegraph?.kind === 'strike') telegraphFrame = f;
      if (intent.strike === true) {
        expect(telegraphFrame).toBeGreaterThan(-1);
        expect(f - telegraphFrame).toBeGreaterThanOrEqual(msToFrames(AI_TELEGRAPH_MS.pointBlank));
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
  it('NEVER stalls beyond AI_APPROACH_RANGE — closes distance instead (audit major)', () => {
    // A duel has no out-of-aggro state: the old hard-idle froze the enemy
    // forever once a faster player kited past AI_APPROACH_RANGE.
    const ai = new AISeamController(highRng, AI_TIERS.easy);
    const intent = ai.next(1, view({ enemyPos: { x: 750, y: 430 } })); // dist 650
    expect(intent.moveX).toBe(-1);
  });
  it('kunai fires at the TOP of AI_KUNAI_RANGE (audit major: the band\'s upper reach)', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal);
    const intent = ai.next(1, view({ enemyPos: { x: 700, y: 430 } })); // dist 600 = AI_KUNAI_RANGE.max
    expect(intent.throwKunai).toBe(true);
  });
  it('stops approaching inside strike range', () => {
    const ai = new AISeamController(highRng, AI_TIERS.easy);
    const intent = ai.next(1, closeView());
    expect(intent.moveX).toBeUndefined();
  });
});

describe('AISeamController — kunai (AI_KUNAI_RANGE band, tier chance)', () => {
  it('throws in the band when the roll passes, then recovers (no instant repeat)', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal); // kunaiChance 0.25
    const v = view({ enemyPos: { x: 500, y: 430 } }); // dist 400 ∈ [200, 600]
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
  it('never throws below AI_KUNAI_RANGE.min', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal);
    const v = view({ enemyPos: { x: 280, y: 430 } }); // dist 180 < AI_KUNAI_RANGE.min 200
    expect(ai.next(1, v).throwKunai).toBeUndefined();
  });
});

describe('AISeamController — decision cadence (browser-verify finding)', () => {
  it('rolls decisions once per reactMs beat, not every tick (chances stay tier-semantic)', () => {
    let rolls = 0;
    const counting: Rng = () => {
      rolls++;
      return 0.99; // every decision fails
    };
    const ai = new AISeamController(counting, AI_TIERS.normal);
    const v = view({ enemyPos: { x: 500, y: 430 } }); // in the kunai band
    for (let f = 1; f <= 60; f++) ai.next(f, v);
    // One decision round per 320 ms (reactMs) ≈ 4 rounds max in 60 frames,
    // ≤ 2 rng calls per round (kunai roll + aggression roll; stance-pick
    // needs Focus + non-countering first). 60 rolls would mean per-tick.
    expect(rolls).toBeLessThanOrEqual(8);
  });
  it('failed kunai rolls still fall through to approach movement', () => {
    const ai = new AISeamController(highRng, AI_TIERS.normal);
    const intent = ai.next(1, view({ enemyPos: { x: 500, y: 430 } }));
    expect(intent.moveX).toBe(-1);
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

describe('AISeamController — SESSION13 D8: no reactions, a two-case telegraph, a 50 px gate', () => {
  it('HAS NO react() AT ALL (the enemy never blocks or dodges in the original)', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal);
    expect((ai as unknown as Record<string, unknown>).react).toBeUndefined();
  });
  it('the tier table no longer carries ANY reaction field', () => {
    for (const tier of Object.values(AI_TIERS)) {
      expect(tier).not.toHaveProperty('reactMs');
      expect(tier).not.toHaveProperty('reactBlockChance');
      expect(tier).not.toHaveProperty('reactDodgeChance');
      // …nor a single global telegraph: the windup is two measured cases.
      expect(tier).not.toHaveProperty('telegraphMs');
    }
  });
  it('closeView really is inside the melee gate, on BOTH axes', () => {
    const v = closeView();
    expect(Math.abs(v.enemyPos.x - v.playerPos.x)).toBeLessThan(AI_MELEE_RANGE.x);
    expect(Math.abs(v.enemyPos.y - v.playerPos.y)).toBeLessThan(AI_MELEE_RANGE.y);
  });
  it('will NOT strike from outside the 50 px gate — it closes instead', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal);
    // dist 60: inside the DELETED AI_STRIKE_RANGE (110), outside the real gate.
    const intent = ai.next(1, view({ enemyPos: { x: 160, y: 430 } }));
    expect(intent.telegraph).toBeUndefined();
    expect(intent.moveX).toBeDefined();
  });
  it('will NOT strike when the vertical gap exceeds the gate (the old model had NO y term)', () => {
    const ai = new AISeamController(lowRng, AI_TIERS.normal);
    const intent = ai.next(1, view({ enemyPos: { x: 130, y: 330 } })); // Δy 100
    expect(intent.telegraph).toBeUndefined();
  });
  it('telegraphs 600 ms while CLOSING and 267 ms POINT-BLANK', () => {
    const closing = new AISeamController(lowRng, AI_TIERS.normal);
    expect(closing.next(1, closeView()).telegraph?.durationMs).toBe(AI_TELEGRAPH_MS.closing);
    const pointBlank = new AISeamController(lowRng, AI_TIERS.normal);
    const near = view({ enemyPos: { x: 100 + AI_POINT_BLANK_X, y: 430 } });
    expect(pointBlank.next(1, near).telegraph?.durationMs).toBe(AI_TELEGRAPH_MS.pointBlank);
  });
});
