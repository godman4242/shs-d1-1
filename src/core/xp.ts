/**
 * xp.ts (Stage 3 M2) — the XP curve: cumulative level thresholds and the
 * level lookup. Pure math over config/xp data; no Phaser, no storage, ZERO
 * numeric literals. The game/ boundary renders totalXp/xpThreshold(level)
 * (the original HUD's "0 / 550" anatomy) and owns persistence.
 *
 * Semantics (video study SYNTHESIS §1.2): thresholds are CUMULATIVE caps —
 * a character is level N while xpThreshold(N-1) <= totalXp < xpThreshold(N),
 * so reaching the cap exactly finishes the level. L1–L10 come straight from
 * the frame-backed table; L11+ extrapolate by growing the per-level delta by
 * XP_DELTA_STEP (INFERRED — flagged in config/xp.ts).
 */
import { ONE, TWO, ZERO } from '../config/nums';
import { XP_DELTA_STEP, XP_THRESHOLDS } from '../config/xp';

/** Table read with strict-index narrowing (the callers keep i in range). */
const tableAt = (i: number): number => {
  const cap = XP_THRESHOLDS[i];
  if (cap === undefined) throw new RangeError('xp: threshold index out of range');
  return cap;
};

/** Cumulative XP total needed to FINISH `level` (the HUD bar's denominator). */
export const xpThreshold = (level: number): number => {
  if (!Number.isInteger(level) || level < ONE) {
    throw new RangeError('xpThreshold: level must be a positive integer');
  }
  if (level <= XP_THRESHOLDS.length) return tableAt(level - ONE);
  // Beyond the table: keep growing the per-level delta by XP_DELTA_STEP.
  let threshold = tableAt(XP_THRESHOLDS.length - ONE);
  let delta = threshold - tableAt(XP_THRESHOLDS.length - TWO);
  for (let n = XP_THRESHOLDS.length; n < level; n += ONE) {
    delta += XP_DELTA_STEP;
    threshold += delta;
  }
  return threshold;
};

/** The level a cumulative XP total puts a character at (never below one). */
export const levelForXp = (xp: number): number => {
  if (!Number.isFinite(xp) || xp < ZERO) {
    throw new RangeError('levelForXp: xp must be finite and non-negative');
  }
  // Walk the frame-backed table first…
  for (let i = ZERO; i < XP_THRESHOLDS.length; i += ONE) {
    if (xp < tableAt(i)) return i + ONE;
  }
  // …then the extrapolated tail, incrementally (O(level), stays fast even
  // for a MAX_SAFE_INTEGER total — the delta growth guarantees termination).
  let level = XP_THRESHOLDS.length;
  let threshold = tableAt(XP_THRESHOLDS.length - ONE);
  let delta = threshold - tableAt(XP_THRESHOLDS.length - TWO);
  while (xp >= threshold) {
    level += ONE;
    delta += XP_DELTA_STEP;
    threshold += delta;
  }
  return level;
};
