/**
 * critical.ts (Stage 2 spec item 3) — the TWO meters' math, in one place:
 * - CRITICAL (crit payout): fills in combat at CRITICAL_FILL_PER_S, capped
 *   at CRITICAL_MAX; a full meter makes the next LANDED hit crit ×CRIT_MULT
 *   and resets (consumption lives in Sim.applyStroke/executeStrike).
 * - FOCUS (stance switch): starts at FOCUS_START, fills at FOCUS_FILL_PER_S,
 *   drains FOCUS_SWITCH_COST × WEAPON_WEIGHT[stance] on an in-combat switch
 *   (the gate lives in Sim.requestStanceSwitch).
 * Meters are stored in integer FRAME UNITS and converted multiply-first
 * (units × ratePerS / FIXED_HZ) so every read is exact — the same
 * drift-free pattern as Sim.advance's owed-frames accumulator.
 * (Audit note: this module was spec-named but initially folded into Sim
 * unflagged — extracted 2026-07-12 to honor the deliverable.)
 */
import { CRITICAL_FILL_PER_S, CRITICAL_MAX, FOCUS_FILL_PER_S } from '../config/combat';
import { FIXED_HZ } from '../config/timing';

/** Focus points → integer frame units (1 unit = 1 fixed frame of fill). */
export const focusToUnits = (focus: number): number => (focus * FIXED_HZ) / FOCUS_FILL_PER_S;

/** Integer frame units → Focus points. */
export const unitsToFocus = (units: number): number => (units * FOCUS_FILL_PER_S) / FIXED_HZ;

/** Integer frame units → Critical points, clamped at CRITICAL_MAX. */
export const unitsToCritical = (units: number): number =>
  Math.min(CRITICAL_MAX, (units * CRITICAL_FILL_PER_S) / FIXED_HZ);

/** True when the meter is full — the next landed hit crits and resets. */
export const criticalReady = (units: number): boolean => unitsToCritical(units) >= CRITICAL_MAX;
