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
/*
 * ⚠️ `COUNTER_BONUS = 1.25` IS DELETED (SESSION13 D5). It modelled a
 * counter/parry/riposte mechanic **that does not exist in the original**. The
 * forum's "~20 %" is the STANCE MATCHUP, below — a different thing that applies
 * to every swing, not to a reaction.
 */
/**
 * CONTRACT-SRC — the stance triangle's damage multipliers, applied to physical
 * damage BEFORE defence subtracts. Our triangle itself
 * (light▸heavy▸balanced▸light) is confirmed correct and stays.
 */
export const STANCE_MATCHUP = { win: 1.2, lose: 0.9, same: 1.0 } as const;
/**
 * INFERRED — the source's crit term is `× 1.3 + flatCritBonus`. No value for
 * the flat part was found in the payload, so it is named at the identity 0
 * rather than invented. Veto = supply a value once one is measured.
 */
export const CRIT_FLAT_BONUS = 0;
/**
 * CONTRACT — heavy stance defensive penalty (research-confirmed: sources
 * frame it as a DEFENSE-STAT cut, defense ×0.8 — not a damage-taken bonus).
 * Stage 2 landmine: apply EITHER this OR STANCE_TABLE.heavy.damageTakenMult,
 * never both — double-counting would overshoot the original.
 */
export const HEAVY_DEF_PENALTY = 0.2;
/** CONTRACT — absolute minimum damage per landed hit. */
export const DAMAGE_FLOOR = 1;
/**
 * CONTRACT-SRC — the min-damage floor scales with the ATTACKER's level:
 *   ≤10 → 1 · ≤20 → lvl/8 · ≤30 → lvl/6 · else lvl/4
 * At our stated level 9 the first tier applies, so the floor is a flat 1 — but
 * the whole ladder is implemented because it governs every later level.
 */
export const MIN_DAMAGE_TIERS = {
  tier1MaxLevel: 10,
  tier2MaxLevel: 20,
  tier2Divisor: 8,
  tier3MaxLevel: 30,
  tier3Divisor: 6,
  tier4Divisor: 4,
} as const;
/** CONTRACT — Chi Punch damage at skill level 1. */
export const CHI_PUNCH_DMG_L1 = 10;
/** CONTRACT — spawn invulnerability in seconds; ends early on first slash. */
export const SPAWN_INVULN_S = 5;
/*
 * COMBO_CHAIN_GAP_S was DELETED in SESSION13 A2 (D8): the payload has no
 * combo gap decay at all. The combo resets to 0 on damage taken and on
 * nothing else. See docs/DIVERGENCES.md.
 */

// ── Focus: ONE meter, in the source's own integer units (SESSION13 D4) ──
/*
 * ⚠️ THE STANDALONE `CRITICAL_*` METER IS DELETED. The original has THREE
 * meters — HP, Chi, Focus — and **Focus IS the crit meter**: when it fills, the
 * HUD prints "CRITICAL HIT". Modelling a fourth was our invention.
 *
 * Why the exact shape below and not a simplified 0–100 equivalent: the hidden
 * first 48 units explain THREE separate anomalies at once — our measured fill
 * of 5.97 s against a raw 8.000 s meter, small spends producing no visible drop,
 * and the forum's "−20 % per slash" looking false in footage. One mechanism,
 * three anomalies. Simplify it and you re-derive three wrong constants.
 */
/** CONTRACT-SRC — the meter's real ceiling, in integer units. */
export const FOCUS_MAX = 192;
/** CONTRACT-SRC — fills at 24 units/s (= 2/5 of a unit per 60 Hz frame). */
export const FOCUS_FILL_PER_S = 24;
/**
 * CONTRACT-SRC — the residual accumulator's numerator/denominator.
 * `FOCUS_FILL_PER_S / FIXED_HZ` = 24/60 = **2/5** in lowest terms. Named rather
 * than divided because D4 requires INTEGER accumulation: a closed form over
 * total ticks silently overwrites every spend on the next tick.
 */
export const FOCUS_ACC_NUM = 2;
export const FOCUS_ACC_DEN = 5;
/** CONTRACT-SRC — a kill tops the meter up by this much. */
export const FOCUS_KILL_BONUS = 6;
/**
 * CONTRACT-SRC — the bar renders `(current − 48) / 144`, so the first 48 units
 * are INVISIBLE. 144 units at 24/s = exactly the 6.000 s visible fill our study
 * pass measured as 5.97 s.
 */
export const FOCUS_DISPLAY_OFFSET = 48;
export const FOCUS_DISPLAY_SPAN = 144;
/** CONTRACT-SRC — the meter starts empty; the first 48 units fill unseen. */
export const FOCUS_START = 0;
/**
 * CONTRACT-SRC — in-combat stance switching costs 48 Focus and is GATED on
 * affording it (`if (focus < 48) return;`). Was an INFERRED 34 scaled by a
 * `WEAPON_WEIGHT` table that has no source basis; both are deleted (D9).
 */
export const FOCUS_SWITCH_COST = 48;
/**
 * CONTRACT-SRC — Focus spent per slash, by stance (from the source's `usage`,
 * floored at 48). ⚠️ Slashing is NOT gated on Focus (P3): the slash-entry guard
 * checks death and action-state only. The spend simply clamps at 0, so you can
 * always swing — you just cannot always switch stance.
 */
export const FOCUS_SPEND = { light: 24, balanced: 48, heavy: 72 } as const;

// ── Drawn-stroke processing (Stage 1 consumer: core/DrawnStroke.ts) ──
// Strokes are SIM data → WORLD space (SESSION13 A0).
/**
 * CONTRACT-SRC — the original resamples drawn strokes every 20 world px.
 * Was an INFERRED 8 stage px (6.67 world after A0); this is the source's own
 * number, and the same spacing AUTO SLASH synthesises its stroke at.
 */
export const RESAMPLE_SPACING = 20;
/** INFERRED */ export const SMOOTH_ITERATIONS = 2;
/** INFERRED */ export const CHAIKIN_RATIO = 0.25;
/** INFERRED — a count, not a length. */ export const MAX_STROKE_POINTS = 256;

// ── Blade trail (Stage 1 consumer: game render layer) ─────────────────
// stage-space native — these are RENDER widths drawn straight onto the
// 1024×576 canvas, never fed to the Sim, so the A0 world split leaves them
// alone (rescaling them would visibly change the art).
/** INFERRED — stage-space native */ export const BLADE_CORE_WIDTH = 7;
/** INFERRED — stage-space native */ export const BLADE_EDGE_WIDTH = 13;
/** INFERRED */ export const BLADE_FADE_MS = 200;
/** INFERRED — a ratio */ export const BLADE_MIN_TAPER = 0.12;

// ── Blood spray (Stage 1 consumer: game render layer) ─────────────────
/** INFERRED — a count */ export const BLOOD_COUNT = 9;
/** INFERRED — a count */ export const BLOOD_COUNT_SEVERED = 16;
/** INFERRED — degrees */ export const BLOOD_SPREAD_DEG = 42;
/** INFERRED — stage-space native (droplets are pure render FX) */
export const BLOOD_SPEED_MIN = 60;
/** INFERRED — stage-space native */ export const BLOOD_SPEED_MAX = 240;
