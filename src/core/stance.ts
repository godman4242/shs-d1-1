/**
 * Stance enum + counter triangle (Stage 1 item 5).
 *
 * Deliberately ONLY the enum and triangle: v0.717 PvE hard-locks stance in
 * combat ("CANNOT CHANGE STANCE" — SYNTHESIS §6.1), so no switching or meter
 * assumptions live here. Stage 2 decides the Focus-gated in-combat variant.
 * String-initialized enum: members ARE the StanceId union values, and the
 * purity scanner treats string enums as literal-free.
 */
import { COUNTER_BONUS } from '../config/combat';
import { ONE } from '../config/nums';
import { STANCE_BEATS, type StanceId } from '../config/stances';

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
