/**
 * Stance enum + counter triangle (Stage 1 item 5) + SPACE-cycle order
 * (Stage 2 M2). Switching COSTS/permissions live in Sim (Focus-gated in
 * combat, free out of combat — SYNTHESIS §6.1 decision); this module only
 * answers stance-vs-stance questions. String-initialized enum: members ARE
 * the StanceId union values, and the purity scanner treats string enums as
 * literal-free.
 */
import { STANCE_MATCHUP } from '../config/combat';
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

/**
 * Damage multiplier for the stance MATCHUP (SESSION13 D5): attacker beats
 * defender → ×1.2, loses → ×0.9, same → ×1.0. Applied to physical damage
 * BEFORE defence subtracts.
 *
 * ⚠️ This replaces `counterMult`/`COUNTER_BONUS`, which modelled a
 * counter/parry/riposte mechanic that **does not exist** in the original. The
 * forum's "~20 %" was always this matchup. Note the asymmetry: losing the
 * matchup is a real PENALTY (×0.9), which the old one-sided bonus never had.
 */
export function matchupMult(attacker: StanceId, defender: StanceId): number {
  if (beats(attacker, defender)) return STANCE_MATCHUP.win;
  if (beats(defender, attacker)) return STANCE_MATCHUP.lose;
  return STANCE_MATCHUP.same * ONE;
}

/** The stance SPACE cycles to next: light → balanced → heavy → light. */
export function nextStance(current: StanceId): StanceId {
  const idx = STANCE_CYCLE.indexOf(current);
  return STANCE_CYCLE.at((idx + ONE) % STANCE_CYCLE.length) ?? current;
}
