/**
 * FX CONSTANTS — pure data, no logic (Stage 1 item 7, spec-exact names).
 *
 * These drive a DIFFERENT render path than the BLADE_ and BLOOD_ constants
 * in combat.ts — NOT duplicates, never consolidate (src/config/CLAUDE.md):
 *   - SLASH_ARC      → the red directional stroke drawn at attack moment
 *                      (SYNTHESIS §1.1: tutorial demo line + attack stroke)
 *   - BLOOD_FX       → burst + persistent scenery pools (§4: stains persist;
 *                      pools land Stage 2/6 — Stage 1 uses combat.ts spray)
 *   - FINISHER_FLASH → kill-beat flash/slow-mo ramp (consumed Stage 2)
 * The spec explicitly bans inventing BLADE_WIDTH / BLOOD_PARTICLES.
 */

/** INFERRED — red directional stroke: tapered body around the drawn path. */
export const SLASH_ARC = {
  bodyHalfWidth: 26,
  coreHalfWidth: 11,
  taperPow: 1.6,
  minTaper: 0.1,
  hangMs: 200,
  fadeMs: 180,
} as const;

/** INFERRED — blood burst counts/speeds + persistent pool spread. */
export const BLOOD_FX = {
  burstCount: 12,
  burstCountSevered: 20,
  speedMin: 90,
  speedMax: 280,
  poolSpreadRadius: 46,
  poolSpreadMs: 2600,
  poolAlpha: 0.9,
} as const;

/** INFERRED — kill-beat flash + slow-mo ramp (SYNTHESIS §4: hard cuts, ~0.6–1s holds). */
export const FINISHER_FLASH = {
  durationMs: 420,
  snapInMs: 60,
  slowMoScale: 0.35,
  slowMoRampMs: 90,
} as const;
