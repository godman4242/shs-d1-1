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
/**
 * INFERRED — Stage-2 decision (flagged 2026-07-12): the spec names drain
 * but no refill; 12/s ≈ a third of the drain rate, so held slow-mo is a
 * spend, not a stance. Veto = different rate or no in-duel refill.
 */
export const SHUNPO_FILL_PER_S = 12;

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
/**
 * MEASURED — dash-through slash displacement, stage px. Session 9
 * (2026-07-17): strike-C frame reads (HONDA SHIZUKA mop-up, f176–248) show
 * the attacker translating in EXACTLY ONE video frame, +240 / +~240 / −235
 * px @1080 across three dashes (second read approximate) — mean ≈238.3
 * ÷ 1.875 (stage scale) = 127.1. Constant magnitude across all three ⇒
 * fixed distance (pass-through), not stop-at-target. Motion ledger:
 * MOTION_MEASUREMENTS.md.
 */
export const DASH_SLASH_PX = 127;
/**
 * INFERRED — review-hardened bound (Session 9 adversarial review): the dash
 * needs a minimum stroke length so a mouse slip (single-digit px, still a
 * valid 2-point 'slash') can't teleport the player. Real swings measure
 * well over 100px of path; 40 sits comfortably between.
 */
export const DASH_MIN_STROKE_PX = 40;

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
