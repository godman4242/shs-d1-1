/**
 * GESTURE CLASSIFICATION THRESHOLDS — pure data, no logic.
 *
 * The gesture MAP is video-confirmed (SYNTHESIS §5: horizontal=slash,
 * up=jump, up-flick=launch, down=stab), but the original's exact sector
 * boundaries are not observable on film — both values are INFERRED tuning.
 * Stage 1 kickoff decision: spec names no gesture constants, yet core/ bans
 * literals, so they are named here (veto = retune, file stays).
 */

/**
 * INFERRED — sector half-angle in degrees: strokes within ±this of
 * horizontal classify as slash; steeper strokes are up (jump/launch) or
 * down (stab) by sign.
 */
export const GESTURE_DIAG_DEG = 45;

/**
 * INFERRED — up-strokes with path length under this (px) are a "flick" →
 * launch; longer up-strokes are a jump. Length proxies flick speed: raw
 * pointer points carry no per-point timestamps in our pipeline. Revisit at
 * Stage 2 if launch feel is off.
 */
export const LAUNCH_FLICK_MAX_LEN = 90;
