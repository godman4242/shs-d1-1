/**
 * FOCUS — the original's ONE meter, and its crit meter (SESSION13 D4).
 *
 * ⚠️ This module used to be `critical.ts` and modelled TWO meters (Focus for
 * stance switching, a separate Critical for crits). The payload has three
 * meters in total — HP, Chi, Focus — and when **Focus** fills the HUD prints
 * "CRITICAL HIT". The standalone Critical meter was our invention; it and its
 * `CRITICAL_*` constants are deleted.
 *
 * Everything here is integer units, on purpose:
 *
 * - **Fill** uses a residual accumulator: `acc += 2; while (acc >= 5) { acc -= 5;
 *   focus = min(192, focus + 1) }`. The obvious closed form `floor(ticks × 2/5)`
 *   is a function of TOTAL ticks, so it is correct only for a meter that is
 *   never spent — on the tick after any spend it silently recomputes the meter
 *   back to where it would have been, erasing the spend. This is spend-safe,
 *   exact, float-free, and still 24 units/s at 60 Hz.
 * - **Display** is `(current − 48) / 144`: the first 48 units are invisible.
 *   That one quirk explains the measured 5.97 s fill against a raw 8 s meter,
 *   why small spends show no visible drop, and why the forum's "−20 % per
 *   slash" looked false in footage.
 */
import {
  FOCUS_ACC_DEN,
  FOCUS_ACC_NUM,
  FOCUS_DISPLAY_OFFSET,
  FOCUS_DISPLAY_SPAN,
  FOCUS_MAX,
} from '../config/combat';
import { ONE, ZERO } from '../config/nums';

/** One tick of fill. Returns the new `{ units, acc }` residual pair. */
export function focusTick(units: number, acc: number): { units: number; acc: number } {
  let u = units;
  let a = acc + FOCUS_ACC_NUM;
  while (a >= FOCUS_ACC_DEN) {
    a -= FOCUS_ACC_DEN;
    u = Math.min(FOCUS_MAX, u + ONE);
  }
  return { units: u, acc: a };
}

/**
 * Spend on a slash. A FULL bar zeroes FIRST (the crit is consumed), and then
 * the stance cost subtracts from zero — a no-op. Never gates the swing (P3):
 * the spend simply clamps at 0.
 */
export function focusSpend(units: number, cost: number): number {
  const afterCrit = focusReady(units) ? ZERO : units;
  return Math.max(ZERO, afterCrit - cost);
}

/** True when the meter is full — the next landed hit crits, and it resets. */
export function focusReady(units: number): boolean {
  return units >= FOCUS_MAX;
}

/** Bar fill fraction 0..1 — the OG's `(current − 48) / 144`, clamped. */
export function focusDisplay(units: number): number {
  const raw = (units - FOCUS_DISPLAY_OFFSET) / FOCUS_DISPLAY_SPAN;
  return Math.max(ZERO, Math.min(ONE, raw));
}

/** Top-up granted by a kill. */
export function focusOnKill(units: number, bonus: number): number {
  return Math.min(FOCUS_MAX, units + bonus);
}
