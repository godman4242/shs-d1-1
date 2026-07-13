/**
 * XP CURVE CONSTANTS — pure data, no logic (Stage 3 M2). Consumed by
 * src/core/xp.ts. Double-entered in tests/config-values.test.ts AND pinned
 * verbatim in tests/xp.test.ts.
 *
 * Labels:
 * - XP_THRESHOLDS is CONTRACT — every entry is a frame-backed on-screen
 *   reading (video study SYNTHESIS §1.2: A-00, A-01, A-03, A-06, A-14, A-21,
 *   B-04, B-08, B-18, B-22). Thresholds are CUMULATIVE bar caps: the HUD
 *   renders totalXp/cap (observed 787/1450 at L2), and reaching the cap
 *   finishes the level. B-05's lone 15,350 read at L7 was a single-frame
 *   anomaly (SYNTHESIS flags it); 16,350 (B-04) is the pinned value. The
 *   original's +200-XP display glitch (787/1450 → 9987/1450, A-01) is an
 *   upstream bug we deliberately do NOT replicate.
 * - XP_DELTA_STEP is INFERRED — the study has no reads past L10, so L11+ is
 *   extrapolated: the per-level delta keeps growing by this step, matching
 *   the observed tail (deltas …4550 → 5000 → 5500). Growth ratio keeps
 *   decaying toward 1, consistent with the study's "decays smoothly toward
 *   ~1.2". Revisit if later research surfaces real L11+ caps.
 */

/** CONTRACT (frame-backed) — cumulative XP cap to finish L1…L10, in order. */
export const XP_THRESHOLDS: readonly number[] = [
  550, 1450, 2950, 5150, 8350, 12150, 16350, 20900, 25900, 31400,
];

/** INFERRED — L11+ extrapolation: per-level XP delta grows by this each level. */
export const XP_DELTA_STEP = 500;
