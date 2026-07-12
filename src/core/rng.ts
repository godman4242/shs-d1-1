/**
 * Seeded mulberry32 (Stage 2) — the ONLY randomness source for core/.
 * Deterministic: same seed → same sequence, which the Sim's replay/harness
 * tests depend on. Magic numbers live in src/config/rng.ts.
 */
import {
  MULBERRY_INCREMENT,
  MULBERRY_OR_A,
  MULBERRY_OR_B,
  MULBERRY_SHIFT_A,
  MULBERRY_SHIFT_B,
  MULBERRY_SHIFT_C,
  UINT32_RANGE,
} from '../config/rng';
import { ZERO } from '../config/nums';
import type { Rng } from './Sim';

export function mulberry32(seed: number): Rng {
  let state = seed >>> ZERO; // coerce to uint32 (negative seeds wrap)
  return () => {
    state = (state + MULBERRY_INCREMENT) | ZERO;
    let t = Math.imul(state ^ (state >>> MULBERRY_SHIFT_A), MULBERRY_OR_A | state);
    t = (t + Math.imul(t ^ (t >>> MULBERRY_SHIFT_B), MULBERRY_OR_B | t)) ^ t;
    return ((t ^ (t >>> MULBERRY_SHIFT_C)) >>> ZERO) / UINT32_RANGE;
  };
}
