/**
 * TRASH MOBS + ENCOUNTERS — SESSION14 A2 (D4, D10, D11). Pure data, no logic.
 *
 * ⚠️ A mob is a DIFFERENT AI CLASS from the named duellist (P1). The duellist's
 * HP is recomputed at spawn from the player's own stats so a fight lasts K hits
 * (`core/enemyModel.ts`); a mob's HP is an authored **1**. Nothing here may be
 * routed through `deriveEnemy` — that is the "wrong class" trap
 * `SOURCE_CONSTANTS.md` §3.8 fell into and SESSION13 P1 corrected.
 *
 * ⚠️ HP OBFUSCATION IS DELIBERATELY ABSENT (P10). The original multiplies stored
 * HP by a random 2..6 per session to defeat memory scanners. It is anti-cheat,
 * not gameplay — reproducing it would be a fidelity error and would make every
 * HP read non-deterministic. Recorded here and in `tests/mobs.test.ts` so a
 * future session cannot "discover" it and faithfully implement a bug-generator.
 */
import type { FighterStats } from './stats';

/**
 * CONTRACT-SRC — the recovered enemy table authors trash HP as `<hp>1</hp>`,
 * **and** `setLevel` forces it. Independently corroborated by the study pass:
 * >15 bar-disappearance events across 3 encounters, and no non-named enemy's HP
 * bar was ever observed at anything other than 100 % on the last frame it
 * existed (`COMBAT_MEASUREMENTS.md` e-2).
 */
export const MOB_HP = 1;

/**
 * INFERRED — any level at or below `LOW_LEVEL_OVERRIDE.maxLevel` (8) produces
 * identical mobs, because the source's own
 * `if (level <= 8) { minDamage = 1; defense = 1; }` override fires for all of
 * them. Level 1 is chosen as the plainest member of that band; the exact value
 * is not observable. Veto = a measured per-encounter mob level.
 */
export const MOB_LEVEL = 1;

/**
 * ⚠️ INFERRED, and **never observable in play** — every mob is level ≤ 8, so the
 * override forces damage and defence to 1 before these are ever read.
 *
 * They exist so the override has something to override, which is what makes the
 * chaos check meaningful: raise a mob past level 8 and both numbers must change.
 * If they were absent, "mob damage is 1" would be an authored constant wearing a
 * derivation's clothes. Seeded from the generic authored enemy stats.
 */
export const MOB_BASE = {
  level: MOB_LEVEL,
  baseMinDamage: 7,
  baseDefense: 5,
} as const;

/** INFERRED — a plain level-1 body: no stat points, no mastery, no rebirths. */
export const MOB_STATS: FighterStats = {
  level: MOB_LEVEL,
  spd: 1,
  atk: 1,
  defense: MOB_BASE.baseDefense,
  danRank: 0,
  mastery: { light: 0, balanced: 0, heavy: 0 },
  weapon: { minDamage: 4, maxDamage: 4 },
};

/**
 * MEASURED (P8) — an **8-enemy dungeon fight** is on film. Eight is a real
 * observed crowd, not a guess. Veto = a different count, but keep it filmed.
 */
export const ENCOUNTER_SIZE = 8;

/**
 * ⚠️ INFERRED — SPAWN GEOMETRY IS NOT SOURCED (D10). `REBUILD_READINESS` lists
 * "aggro/spawn geometry" as a known-unknown, so this is an honest placeholder:
 * mobs spread evenly across a band of the world at the ground line. It is
 * labelled INFERRED rather than dressed up, and A6's duration band is the thing
 * that will tell us whether the spread is wrong (§2 diagnosis (b)).
 *
 * WORLD SPACE (800×480). Ground line and body half-extents match the duel's, so
 * a mob renders as the same 52×120 stage box a duellist does.
 */
export const ENCOUNTER_MOB_BAND = { minX: 300, maxX: 750 } as const;
export const ENCOUNTER_GROUND_Y = 358;
export const ENCOUNTER_BODY = { halfW: 22, halfH: 50 } as const;
/** INFERRED — the player enters an encounter from the left, as in the duel. */
export const ENCOUNTER_PLAYER_X = 190;

/**
 * CONTRACT-SRC (P6) — a corpse lingers **96 frames (4.0 s)**, alpha-fading over
 * the **last 12**. Applies to any dead actor, not just mobs; it matters most in
 * encounters, because with one-hit kills an instant despawn makes a crowd fight
 * look like the enemies were never there (D11).
 */
export const CORPSE_LINGER_FRAMES = 96;
export const CORPSE_FADE_FRAMES = 12;
