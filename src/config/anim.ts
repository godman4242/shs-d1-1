/**
 * ANIMATION FEEL — Stage 4 M0 (skeletal fighters, ported from iaido-duel;
 * same-owner original code, kickoff §2 M0). Pure data, no logic.
 *
 * All values INFERRED — they are OUR read of the original's motion,
 * re-tuned to THIS repo's study-frame proportions (chunky ~120px fighter,
 * samurai.ts v2 fidelity pass), NOT iaido-duel's slim 7-head build.
 * Changing any value requires updating tests/config-values.test.ts in the
 * same commit (double-entry ratchet).
 */

/** INFERRED — procedural walk-cycle amplitudes (px), applied to pose joints per frame. */
export const WALK = {
  /** Fore/aft foot travel. */
  footSwing: 13,
  /** Vertical lift of the leading foot. */
  footLift: 7,
  /** Fore/aft knee travel. */
  kneeSwing: 7,
  /** Vertical lift of the leading knee. */
  kneeLift: 2,
  /** Pelvis/chest vertical bob (runs at 2× stride frequency). */
  bob: 2.5,
  /** Sword-hand counter-swing vs the front leg. */
  armSwing: 5,
} as const;

/** INFERRED — idle breathing/sway amplitudes (px); the body looks alive at rest. */
export const IDLE_BREATH = {
  chest: 1.5,
  neck: 1.3,
  head: 1.1,
  hat: 1.1,
  hand: 1.0,
} as const;

/** INFERRED — easing shape (housed here so core/ stays literal-free). */
export const EASE = {
  /** easeOutCubic exponent: 1 − (1−x)^cubicExp. */
  cubicExp: 3,
} as const;

/** INFERRED — animator phase timing (ms) for transient overlays + base cycles. */
export const ANIM_TIMING = {
  /** Hit reaction: snap into the recoil pose… */
  hitRecoilMs: 90,
  /** …then ease back to the base pose. */
  hitReturnMs: 120,
  /** Death collapse duration (idle → DEAD keyframe). */
  deathMs: 320,
  /** Walk stride period (ms per full cycle). */
  walkPeriodMs: 560,
  /** Idle breath period (ms per full cycle). */
  idlePeriodMs: 2600,
  /** Guard pose blend-in/out time. */
  guardBlendMs: 130,
  /** Below this blend weight the guard overlay is skipped entirely. */
  guardEps: 0.001,
} as const;

/**
 * INFERRED — flowing scarf (fidelity tell 20: secondary motion in idle/move).
 * A trailing tapered ribbon hung off the neck; the tail lags body motion and
 * idle-flutters. Sized to OUR fighter build.
 */
export const SCARF = {
  /** Tail points beyond the neck anchor. */
  segments: 5,
  /** Px between scarf points (local space, trailing −x). */
  segLen: 8,
  /** Base half-width of the ribbon at the neck. */
  width: 6,
  /** Idle flutter amplitude (px). */
  sway: 5,
  /** Idle flutter speed (cycles/s). */
  flutterHz: 1.6,
  /** Tail displacement per unit local body velocity (px per px/ms). */
  flowGain: 30,
  /** Clamp on velocity-driven tail displacement (px). */
  flowMax: 22,
  /** Low-pass factor on the body-velocity estimate (0..1, per frame). */
  flowSmoothing: 0.18,
  /** Local x offset from the neck where the scarf anchors (behind the shoulder). */
  anchorX: -6,
  /** Local y offset from the neck. */
  anchorY: 3,
  /** Gravity sag added per segment down the tail (px). */
  droop: 2.5,
} as const;

/** Idle flutter angular frequency (rad/ms) — precomputed so game/ draws stay ratchet-lean. */
export const SCARF_FLUTTER_RAD_PER_MS = (SCARF.flutterHz * 2 * Math.PI) / 1000;
