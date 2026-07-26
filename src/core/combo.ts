/**
 * HIT COMBO counter — CORRECTED FROM SOURCE (SESSION13 D8, 2026-07-26).
 *
 * +1 per landed hit; resets to **0**, and **only when the player takes damage**.
 * Purely cosmetic: no damage, XP or coin bonus, and no decay.
 *
 * ⚠️ This REVERSES the Stage-2 "CONTRACT" (reset-to-1 on a kill, plus a
 * COMBO_CHAIN_GAP_S timeout). Both were wrong; the payload has neither. The
 * old reading and its refutation live in `docs/DIVERGENCES.md`.
 *
 * With no decay there is nothing time-dependent left, so this class no longer
 * touches the Sim clock — `hit()` takes no frame. If a frame argument ever
 * comes back, gap decay came back with it.
 */
import { ONE, ZERO } from '../config/nums';

export class Combo {
  private count = ZERO;

  get value(): number {
    return this.count;
  }

  /** A landed hit; returns the new chain value. */
  hit(): number {
    this.count += ONE;
    return this.count;
  }

  /** Damage taken breaks the chain to 0 — the ONLY thing that resets it. */
  damaged(): void {
    this.count = ZERO;
  }
}
