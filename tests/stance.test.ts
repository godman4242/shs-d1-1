/**
 * Stage 1 item 5 — src/core/stance.ts: Stance enum + counter-triangle logic.
 * Design note (STAGE1_KICKOFF §2 / SYNTHESIS §6.1): v0.717 PvE hard-locks
 * stance in combat, so this module is ONLY the enum + triangle — no
 * switching/meter assumptions baked in; Stage 2 decides the Focus-gated
 * in-combat variant.
 */
import { describe, expect, it } from 'vitest';
import { STANCE_MATCHUP } from '../src/config/combat';
import { beats, matchupMult, nextStance, Stance } from '../src/core/stance';

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

describe('matchupMult — the stance triangle (SESSION13 D5)', () => {
  // ⚠️ This replaces `counterMult`/`COUNTER_BONUS`, which modelled a
  // counter/parry/riposte mechanic the original does not have. The forum's
  // "~20 %" was always this matchup. Note the NEW asymmetry: losing the
  // matchup is a real penalty, which the old one-sided bonus never had.
  it('winning the matchup pays STANCE_MATCHUP.win', () => {
    expect(matchupMult(Stance.Light, Stance.Heavy)).toBe(STANCE_MATCHUP.win);
    expect(matchupMult(Stance.Heavy, Stance.Balanced)).toBe(STANCE_MATCHUP.win);
    expect(matchupMult(Stance.Balanced, Stance.Light)).toBe(STANCE_MATCHUP.win);
  });
  it('LOSING the matchup is penalised — the half the old model was missing', () => {
    expect(matchupMult(Stance.Heavy, Stance.Light)).toBe(STANCE_MATCHUP.lose);
    expect(matchupMult(Stance.Balanced, Stance.Heavy)).toBe(STANCE_MATCHUP.lose);
    expect(matchupMult(Stance.Light, Stance.Balanced)).toBe(STANCE_MATCHUP.lose);
  });
  it('a mirror match is exactly 1', () => {
    expect(matchupMult(Stance.Balanced, Stance.Balanced)).toBe(STANCE_MATCHUP.same);
    expect(matchupMult(Stance.Light, Stance.Light)).toBe(1);
  });
});

describe('nextStance — SPACE cycle (Stage 2 M2)', () => {
  it('cycles light → balanced → heavy → light', () => {
    expect(nextStance('light')).toBe('balanced');
    expect(nextStance('balanced')).toBe('heavy');
    expect(nextStance('heavy')).toBe('light');
  });
});
