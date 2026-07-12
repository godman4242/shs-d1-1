/**
 * HIT COMBO counter (Stage 2 M3 — COMBO_RULES, SYNTHESIS §7, CONTRACT):
 * +1 per consecutive hit; resets to 1 (not 0) per KILL (B-11/B-21/B-28);
 * breaks to 0 on damage taken (A-12) and restarts at 1 after a chain gap
 * (B-19; gap length COMBO_CHAIN_GAP_S is INFERRED — see config/combat.ts).
 * Pure counter: the video evidence shows a HUD element only, so it carries
 * NO damage effect. Frames are the Sim's fixed clock.
 */
import { COMBO_CHAIN_GAP_S } from '../config/combat';
import { ONE, ZERO } from '../config/nums';
import { FIXED_HZ } from '../config/timing';

export class Combo {
  private count = ZERO;
  private lastHitFrame: number | null = null;

  get value(): number {
    return this.count;
  }

  /** A landed hit at the given frame; returns the new chain value. */
  hit(frame: number): number {
    const gapFrames = COMBO_CHAIN_GAP_S * FIXED_HZ;
    const chained = this.lastHitFrame !== null && frame - this.lastHitFrame <= gapFrames;
    this.count = chained ? this.count + ONE : ONE;
    this.lastHitFrame = frame;
    return this.count;
  }

  /** Damage taken breaks the chain to 0 — the next hit starts fresh at 1. */
  damaged(): void {
    this.count = ZERO;
    this.lastHitFrame = null;
  }

  /** A kill resets the counter to exactly 1 (CONTRACT: 1, never 0). */
  kill(frame: number): void {
    this.count = ONE;
    this.lastHitFrame = frame;
  }
}
