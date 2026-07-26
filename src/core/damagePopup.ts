/**
 * DAMAGE POPUP MATH — SESSION14 A4 (D9 / P7).
 *
 * Pure functions, exactly like `core/fx.ts` (which owns the droplet integration
 * the same scenes call). Living in `core/` buys the zero-numeric-literal purity
 * gate for free, so every one of the measured numbers below is forced to stay in
 * `config/popups.ts` where its provenance is written down.
 *
 * ⚠️ NO CRIT PARAMETER, ANYWHERE IN THIS FILE, ON PURPOSE.
 * `COMBAT_MEASUREMENTS.md` f-10 searched ~845 s of play and found no "CRITICAL"
 * popup, no gold or oversized popup, and no crit-vs-normal pair. Encoding a crit
 * by size is the obvious thing to reach for and it would be inventing a tell the
 * original does not have — so the information is never passed in. A guarantee
 * made by the signature beats one made by a comment.
 */
import { DAMAGE_POPUP, POPUP_COLOR } from '../config/popups';
import { ONE, ZERO } from '../config/nums';
import type { ActorId } from './Sim';

/** How a popup looks right now: offset from its spawn point, size, opacity. */
export interface PopupFrame {
  /** Stage px from the spawn point. NEGATIVE is upward (the canvas is y-down). */
  dy: number;
  scale: number;
  alpha: number;
}

/** What a popup says and what colour it says it in. */
export interface PopupSpec {
  text: string;
  color: number;
}

/** MEASURED (e-3): dark = the PLAYER took it, red = an ENEMY took it. */
export function popupColor(targetIsPlayer: boolean): number {
  return targetIsPlayer ? POPUP_COLOR.playerHurt : POPUP_COLOR.enemyHurt;
}

/**
 * Build a popup from a `damage` SimEvent. The event's `crit` flag is
 * deliberately ignored — see the file header.
 */
export function popupFromDamage(
  event: { target: ActorId; amount: number },
  playerId: ActorId,
): PopupSpec {
  return {
    text: String(Math.round(event.amount)),
    color: popupColor(event.target === playerId),
  };
}

export function popupExpired(ageMs: number): boolean {
  return ageMs >= DAMAGE_POPUP.durationMs;
}

/**
 * The popup's appearance at `ageMs`: rises `riseStagePx` while scaling up and
 * fading out, all over `durationMs`. Clamped at both ends — a backgrounded tab
 * can hand a scene an enormous delta, and a popup must settle rather than
 * invert its alpha or fly off the top of the screen.
 */
export function popupFrame(ageMs: number): PopupFrame {
  const t = Math.max(ZERO, Math.min(ONE, ageMs / DAMAGE_POPUP.durationMs));
  return {
    // `ZERO - x` rather than `-x`: at t=0 the latter yields NEGATIVE zero, which
    // renders identically but compares unequal to +0 and quietly poisons any
    // downstream equality check.
    dy: ZERO - DAMAGE_POPUP.riseStagePx * t,
    scale: DAMAGE_POPUP.scaleFrom + (DAMAGE_POPUP.scaleTo - DAMAGE_POPUP.scaleFrom) * t,
    alpha: ONE - t,
  };
}
