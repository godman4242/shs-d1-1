/**
 * Stance enum + counter triangle (Stage 1 item 5) + SPACE-cycle order
 * (Stage 2 M2). Switching COSTS/permissions live in Sim (Focus-gated in
 * combat, free out of combat — SYNTHESIS §6.1 decision); this module only
 * answers stance-vs-stance questions. String-initialized enum: members ARE
 * the StanceId union values, and the purity scanner treats string enums as
 * literal-free.
 */
import { COUNTER_BONUS } from '../config/combat';
import { ONE } from '../config/nums';
import { STANCE_BEATS, STANCE_CYCLE, type StanceId } from '../config/stances';

export enum Stance {
  Light = 'light',
  Balanced = 'balanced',
  Heavy = 'heavy',
}

/** True when attacker's stance counters defender's (key BEATS value). */
export function beats(attacker: StanceId, defender: StanceId): boolean {
  return STANCE_BEATS[attacker] === defender;
}

/** Damage multiplier for the matchup: COUNTER_BONUS on a counter, else 1. */
export function counterMult(attacker: StanceId, defender: StanceId): number {
  return beats(attacker, defender) ? COUNTER_BONUS : ONE;
}

/** The stance SPACE cycles to next: light → balanced → heavy → light. */
export function nextStance(current: StanceId): StanceId {
  const idx = STANCE_CYCLE.indexOf(current);
  return STANCE_CYCLE.at((idx + ONE) % STANCE_CYCLE.length) ?? current;
}
