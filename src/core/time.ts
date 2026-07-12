/**
 * Fixed-clock conversions (Stage 2 M4) — the ONE ms→frames site, shared by
 * Sim (cooldowns, windows) and AISeamController (telegraphs, recovery).
 * Ceil: a telegraph or protection window must never round SHORTER than the
 * milliseconds its config contract promises.
 */
import { FIXED_HZ, MS_PER_S } from '../config/timing';

export function msToFrames(ms: number): number {
  return Math.ceil((ms * FIXED_HZ) / MS_PER_S);
}
