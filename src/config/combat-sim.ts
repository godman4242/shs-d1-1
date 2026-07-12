/**
 * COMBAT-SIM CONSTANTS — pure data, no logic. Stage 2 spec item 9: every
 * name and value below is spec-exact and double-entered in
 * tests/config-values.test.ts (change = update both files, same commit).
 * Labels: MAX_FRAME_MS is Spec-fixed (architecture: the advance() clamp);
 * the rest are INFERRED tuning seeds handed down by the kickoff spec.
 */
import type { StanceId } from './stances';

/** Spec-fixed — Sim.advance() clamps any single delta to this many ms. */
export const MAX_FRAME_MS = 250;

// ── Shunpo (SHIFT-hold slow-mo) ───────────────────────────────────────
/** INFERRED */ export const SHUNPO_TIMESCALE = 0.35;
/** INFERRED */ export const SHUNPO_MAX = 100;
/** INFERRED */ export const SHUNPO_DRAIN_PER_S = 34;
/** INFERRED */ export const SHUNPO_MIN_TO_START = 10;

// ── Smoke Bomb + Stab/Deflect ─────────────────────────────────────────
/** INFERRED */ export const SMOKE_BOMB_DISTANCE = 180;
/** INFERRED */ export const SMOKE_BOMB_IFRAMES_MS = 420;
/** INFERRED */ export const DEFLECT_WINDOW_MS = 260;
/** INFERRED */ export const DEFLECT_RADIUS = 64;

// ── Projectiles (kunai) ───────────────────────────────────────────────
/** INFERRED — px per ms. */ export const PROJECTILE_SPEED = 0.55;
/** INFERRED */ export const PROJECTILE_DMG = 8;
/** INFERRED */ export const PROJECTILE_HIT_RADIUS = 26;
/** INFERRED */ export const PROJECTILE_MAX_ACTIVE = 8;

// ── Player movement ───────────────────────────────────────────────────
/** INFERRED — px per ms. */ export const PLAYER_MOVE_SPEED = 0.28;
/** INFERRED — player strokes strike instantly (no windup). */
export const PLAYER_WINDUP_MS = 0;

// ── Base fighter loadouts ─────────────────────────────────────────────
export interface FighterBase {
  hp: number;
  atkPlusWeapon: number;
  defense: number;
  stance: StanceId;
  deflectLearned: boolean;
}

/** INFERRED — spec item 9 player seed. */
export const PLAYER_BASE: FighterBase = {
  hp: 100,
  atkPlusWeapon: 10,
  defense: 5,
  stance: 'balanced',
  deflectLearned: true,
};

/** INFERRED — spec item 9 enemy seed. */
export const ENEMY_BASE: FighterBase = {
  hp: 150,
  atkPlusWeapon: 7,
  defense: 5,
  stance: 'heavy',
  deflectLearned: false,
};

// ── Skill hotbar ──────────────────────────────────────────────────────
export type SkillVerb = 'chiPunch' | 'smokeBomb' | 'stab';

/** Spec-fixed — hotbar slot number → skill verb. */
export const SKILL_VERB: Record<number, SkillVerb> = {
  1: 'chiPunch',
  2: 'smokeBomb',
  3: 'stab',
};
