/**
 * COMBAT CONSTANTS — pure data, no logic.
 * Labels: CONTRACT = verified behaviour of the original game;
 *         INFERRED = tuned seed matching observed feel, adjustable.
 */

// ── Damage ────────────────────────────────────────────────────────────
/**
 * CONTRACT — critical damage = 1.3 × physical damage.
 * Research 2026-07-11 (docs/research/original-game-facts.md): the fan wiki's
 * Stances page gives the 1.3× formula and a per-stance crit table that is
 * exactly 1.3 × our STANCE_TABLE dmgMults (1.17/1.56/1.82) — same lineage as
 * this config. The older "3×" claim traces to a 2014 tips page; patch notes
 * show the multiplier changed across versions. Was 3 in the kickoff spec —
 * revert BOTH here and in tests/config-values.test.ts if Kheshav vetoes.
 */
export const CRIT_MULT = 1.3;
/** INFERRED — bonus when attacker's stance beats defender's (counter triangle). */
export const COUNTER_BONUS = 1.25;
/**
 * CONTRACT — heavy stance defensive penalty (research-confirmed: sources
 * frame it as a DEFENSE-STAT cut, defense ×0.8 — not a damage-taken bonus).
 * Stage 2 landmine: apply EITHER this OR STANCE_TABLE.heavy.damageTakenMult,
 * never both — double-counting would overshoot the original.
 */
export const HEAVY_DEF_PENALTY = 0.2;
/** CONTRACT — minimum damage per landed hit. */
export const DAMAGE_FLOOR = 1;
/** CONTRACT — Chi Punch damage at skill level 1. */
export const CHI_PUNCH_DMG_L1 = 10;
/** CONTRACT — spawn invulnerability in seconds; ends early on first slash. */
export const SPAWN_INVULN_S = 5;
/**
 * INFERRED — Stage-2 decision (flagged 2026-07-12): COMBO_RULES (§7) say the
 * chain breaks "on gaps" but name no duration; 3 s bridges kill-to-kill in
 * observed multi-mook brawls (11-chains, B-26) without keeping stale chains
 * alive. Veto = retune.
 */
export const COMBO_CHAIN_GAP_S = 3;

// ── Meters ────────────────────────────────────────────────────────────
/** INFERRED */ export const FOCUS_MAX = 100;
/** INFERRED */ export const FOCUS_SWITCH_COST = 34;
/** INFERRED */ export const FOCUS_START = 50;
/**
 * INFERRED — Stage-2 decision (flagged 2026-07-12): the spec says "Focus
 * drain/fill" but names no fill rate; the original's Focus skill (active
 * fill) is out of Stage-2 scope, so passive in-combat fill seeds the meter.
 * 4/s ≈ one balanced-stance switch (cost 51) affordable every ~13 s.
 * Veto = different rate, or fill-on-hit instead of per-second.
 */
export const FOCUS_FILL_PER_S = 4;
/** INFERRED */ export const CRITICAL_MAX = 100;
/** INFERRED */ export const CRITICAL_FILL_PER_S = 8;

// ── Weapons ───────────────────────────────────────────────────────────
/** INFERRED — weight-class scalar (heavier drains Critical harder per swing). */
export const WEAPON_WEIGHT = { light: 1.0, balanced: 1.5, heavy: 2.5 } as const;

// ── Drawn-stroke processing (Stage 1 consumer: core/DrawnStroke.ts) ──
/** INFERRED */ export const RESAMPLE_SPACING = 8;
/** INFERRED */ export const SMOOTH_ITERATIONS = 2;
/** INFERRED */ export const CHAIKIN_RATIO = 0.25;
/** INFERRED */ export const MAX_STROKE_POINTS = 256;

// ── Blade trail (Stage 1 consumer: game render layer) ─────────────────
/** INFERRED */ export const BLADE_CORE_WIDTH = 7;
/** INFERRED */ export const BLADE_EDGE_WIDTH = 13;
/** INFERRED */ export const BLADE_FADE_MS = 200;
/** INFERRED */ export const BLADE_MIN_TAPER = 0.12;

// ── Blood spray (Stage 1 consumer: game render layer) ─────────────────
/** INFERRED */ export const BLOOD_COUNT = 9;
/** INFERRED */ export const BLOOD_COUNT_SEVERED = 16;
/** INFERRED */ export const BLOOD_SPREAD_DEG = 42;
/** INFERRED */ export const BLOOD_SPEED_MIN = 60;
/** INFERRED */ export const BLOOD_SPEED_MAX = 240;
