/**
 * COMBAT-SIM CONSTANTS — pure data, no logic. Stage 2 spec item 9: every
 * name and value below is spec-exact and double-entered in
 * tests/config-values.test.ts (change = update both files, same commit).
 * Labels: MAX_FRAME_MS is Spec-fixed (architecture: the advance() clamp);
 * the rest are INFERRED tuning seeds handed down by the kickoff spec.
 */
import type { StanceId } from './stances';
import { ATTACK_DMG_PER_POINT, ENEMY_STATS, PLAYER_STATS, type FighterStats } from './stats';

/** Spec-fixed — Sim.advance() clamps any single delta to this many ms. */
export const MAX_FRAME_MS = 250;

// ── Shunpo (SHIFT-hold slow-mo) ───────────────────────────────────────
/** INFERRED */ export const SHUNPO_TIMESCALE = 0.35;
/** INFERRED */ export const SHUNPO_MAX = 100;
/** INFERRED */ export const SHUNPO_DRAIN_PER_S = 34;
/** INFERRED */ export const SHUNPO_MIN_TO_START = 10;
/**
 * INFERRED — Stage-2 decision (flagged 2026-07-12): the spec names drain
 * but no refill; 12/s ≈ a third of the drain rate, so held slow-mo is a
 * spend, not a stance. Veto = different rate or no in-duel refill.
 */
export const SHUNPO_FILL_PER_S = 12;

// ── Smoke Bomb + Stab/Deflect ─────────────────────────────────────────
// WORLD-SPACE (SESSION13 A0): px values converted once, `/1.2`; the
// pre-conversion stage value is named in each comment.
/** INFERRED — world px. Was 180 stage. */ export const SMOKE_BOMB_DISTANCE = 150;
/** INFERRED */ export const SMOKE_BOMB_IFRAMES_MS = 420;
/** INFERRED */ export const DEFLECT_WINDOW_MS = 260;
/** INFERRED — world px. Was 64 stage. */ export const DEFLECT_RADIUS = 53.33;

// ── Projectiles (kunai) ───────────────────────────────────────────────
/** INFERRED — world px per ms. Was 0.55 stage. */ export const PROJECTILE_SPEED = 0.4583;
/** INFERRED */ export const PROJECTILE_DMG = 8;
/** INFERRED — world px. Was 26 stage. */ export const PROJECTILE_HIT_RADIUS = 21.67;
/** INFERRED */ export const PROJECTILE_MAX_ACTIVE = 8;

// ── Player movement (SESSION13 B1 / D-movement) ───────────────────────
/*
 * CONTRACT-SRC — the original's own two gaits, in WORLD px/s. Our single
 * INFERRED 0.28 stage px/ms (= 280 stage px/s) matched NEITHER measured gait.
 * Cross-check against the study footage at the ×1.2 render scale:
 *   walk 96 × 1.2 = 115.2 stage px/s  vs measured 112–126 ✓
 *   run  288 × 1.2 = 345.6 stage px/s vs measured 341–349 ✓ (dead centre)
 * No fudge factor — this is what made the A0 transform worth landing first.
 */
export const MOVE_WALK_PX_S = 96;
export const MOVE_RUN_PX_S = 288;
/**
 * CONTRACT-SRC — gait is chosen by DESTINATION TYPE first; for a plain ground
 * move it falls through to this distance threshold: farther than 100 world px
 * ⇒ run, otherwise walk. Latched at command time along with the target.
 */
export const MOVE_RUN_THRESHOLD_PX = 100;
/** CONTRACT-SRC — a move command closer than this to the fighter is ignored. */
export const MOVE_DEADZONE_PX = 25;
/** CONTRACT-SRC — when the destination is a FIGHTER, stop this far short. */
export const MOVE_STANDING_RANGE_PX = 50;
/**
 * DEPRECATED alias kept only until every call site reads the gait pair.
 * INFERRED — world px per ms. Was 0.28 stage.
 */
export const PLAYER_MOVE_SPEED = 0.2333;
/** INFERRED — player strokes strike instantly (no windup). */
export const PLAYER_WINDUP_MS = 0;
/*
 * ⚠️ `DASH_SLASH_PX` (a fixed 105.9 px pass-through) and `DASH_MIN_STROKE_PX`
 * ARE DELETED (SESSION13 B3/D2). The original does not dash a fixed distance:
 * the samurai travels to the drawn stroke's LAST POINT, uncapped, at a
 * per-stance speed. Because the stroke is now truncated to the reach budget
 * first, "uncapped" is bounded by reach rather than by a magic constant — and
 * the old measurement (one video frame ≈ 105.9 world px) is reproduced by
 * 40 px/frame × the 15 fps sampling floor, i.e. it was never a distance at all.
 */
/** CONTRACT-SRC — dash travel per 60 Hz frame, in WORLD px, by stance. */
export const DASH_SPEED_PX_PER_FRAME = { light: 50, balanced: 40, heavy: 30 } as const;

// ── Base fighter loadouts ─────────────────────────────────────────────
export interface FighterBase {
  hp: number;
  /** Step 1 of the damage pipeline: `atk × ATTACK_DMG_PER_POINT + weapon.min`. */
  minDamage: number;
  /** `weapon.max − weapon.min` — 0 until a weapon model lands (D6). */
  damageRange: number;
  defense: number;
  stance: StanceId;
  deflectLearned: boolean;
  /** Level + mastery + dan + SPD: what the D2/D6 formulas read. */
  stats: FighterStats;
}

/**
 * INFERRED hp; everything else DERIVED from `stats.ts` so there is exactly one
 * source of truth for the character (D2a). `minDamage` reproduces the old
 * `atkPlusWeapon: 10` exactly — it is a decomposition, not a new number.
 */
export const PLAYER_BASE: FighterBase = {
  hp: 100,
  minDamage: PLAYER_STATS.atk * ATTACK_DMG_PER_POINT + PLAYER_STATS.weapon.minDamage,
  damageRange: PLAYER_STATS.weapon.maxDamage - PLAYER_STATS.weapon.minDamage,
  defense: PLAYER_STATS.defense,
  stance: 'balanced',
  deflectLearned: true,
  stats: PLAYER_STATS,
};

/**
 * INFERRED seed. ⚠️ B4 makes hp and minDamage DERIVED at spawn from the
 * player's own stats (`enemyHP = effPlayerDmg × K`), so these are the pre-scale
 * floor the source's `max(scaledBase, …)` compares against, not the fight's
 * operative numbers.
 */
export const ENEMY_BASE: FighterBase = {
  /**
   * ⚠️ THE AUTHORED BASE IS 1, NOT 150 (D3). Named-enemy HP is not authored at
   * all — it is recomputed at spawn as `effPlayerDmg × K`, and the source's own
   * data authors trash HP as `<hp>1</hp>` and lets `max(scaledBase, …)` be a
   * no-op. Our old 150 was a PvP-dummy seed modelling nothing; leaving it in
   * place would have won the `max()` (150 > 50) and quietly defeated the whole
   * derivation, keeping HP an INPUT. INFERRED — veto = supply a real
   * level-scaled base once one is measured, and the max() starts biting again.
   */
  hp: 1,
  /** Same reasoning: the operative value is `max(base, playerMaxHp / D)`. */
  minDamage: 1,
  damageRange: ENEMY_STATS.weapon.maxDamage - ENEMY_STATS.weapon.minDamage,
  defense: ENEMY_STATS.defense,
  stance: 'heavy',
  deflectLearned: false,
  stats: ENEMY_STATS,
};

// ── Skill hotbar ──────────────────────────────────────────────────────
export type SkillVerb = 'chiPunch' | 'smokeBomb' | 'stab';

/** Spec-fixed — hotbar slot number → skill verb. */
export const SKILL_VERB: Record<number, SkillVerb> = {
  1: 'chiPunch',
  2: 'smokeBomb',
  3: 'stab',
};
