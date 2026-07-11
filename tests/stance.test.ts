/**
 * Stage 1 item 5 — src/core/stance.ts: Stance enum + counter-triangle logic.
 * Design note (STAGE1_KICKOFF §2 / SYNTHESIS §6.1): v0.717 PvE hard-locks
 * stance in combat, so this module is ONLY the enum + triangle — no
 * switching/meter assumptions baked in; Stage 2 decides the Focus-gated
 * in-combat variant.
 */
import { describe, expect, it } from 'vitest';
import { COUNTER_BONUS } from '../src/config/combat';
import { beats, counterMult, Stance } from '../src/core/stance';

describe('Stance enum', () => {
  it('maps to the StanceId string union used across config tables', () => {
    expect(Stance.Light).toBe('light');
    expect(Stance.Balanced).toBe('balanced');
    expect(Stance.Heavy).toBe('heavy');
  });
});

describe('counter triangle — light > heavy > balanced > light', () => {
  it('each stance beats exactly its prey', () => {
    expect(beats(Stance.Light, Stance.Heavy)).toBe(true);
    expect(beats(Stance.Heavy, Stance.Balanced)).toBe(true);
    expect(beats(Stance.Balanced, Stance.Light)).toBe(true);
  });
  it('the reverse matchups do not counter', () => {
    expect(beats(Stance.Heavy, Stance.Light)).toBe(false);
    expect(beats(Stance.Balanced, Stance.Heavy)).toBe(false);
    expect(beats(Stance.Light, Stance.Balanced)).toBe(false);
  });
  it('no stance beats itself', () => {
    expect(beats(Stance.Light, Stance.Light)).toBe(false);
    expect(beats(Stance.Balanced, Stance.Balanced)).toBe(false);
    expect(beats(Stance.Heavy, Stance.Heavy)).toBe(false);
  });
});

describe('counterMult', () => {
  it('pays COUNTER_BONUS on a counter matchup', () => {
    expect(counterMult(Stance.Light, Stance.Heavy)).toBe(COUNTER_BONUS);
  });
  it('is exactly 1 otherwise (incl. mirror matches)', () => {
    expect(counterMult(Stance.Heavy, Stance.Light)).toBe(1);
    expect(counterMult(Stance.Balanced, Stance.Balanced)).toBe(1);
  });
});
