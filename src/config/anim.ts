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

/**
 * Walk-cycle numbers — MEASURED off the v0.717 longplay B (Nr4fQstqHDM),
 * upright in-fight/travel walk, fixed-camera window t=465.0–466.3
 * (walk-b05b frames 089–133, 60fps extract; Session 8 motion corpus).
 * Conversion: study px @1080 ÷ 1.875 = stage px. Amplitude reads are
 * hakama-occluded at the ankle — re-verify pass queued (see
 * docs/research/fidelity/MOTION_MEASUREMENTS.md).
 */
export const WALK = {
  /**
   * MEASURED — world distance per full stride (same-foot plant to plant).
   * Stride period 16 video frames @ ~8.4 px/f = ~135 px @1080 → 72 stage px.
   * The stride phase advances by distance/stridePx — never by wall time.
   */
  stridePx: 72,
  /** MEASURED (coarse) — fore/aft foot travel; visible split ~60 px @1080 → ±16 stage px. */
  footSwing: 16,
  /** MEASURED (coarse) — swing-foot clearance ~10 px @1080 → 6 stage px. */
  footLift: 6,
  /** INFERRED — knee tracks the foot at roughly half amplitude. */
  kneeSwing: 8,
  /** INFERRED — knee lift stays subtle. */
  kneeLift: 3,
  /** INFERRED — pelvis/chest vertical bob (runs at 2× stride frequency). */
  bob: 3,
  /** INFERRED — sword-hand counter-swing vs the front leg. */
  armSwing: 7,
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

/** Animator phase timing (ms) for transient overlays + base cycles. */
export const ANIM_TIMING = {
  /**
   * MEASURED — hit stagger: 12 frames total @60fps (4 upright + 8 bent)
   * off longplay B duel t=3774.5–3774.8 (duel-strike-A, frames 036–047).
   * Split: snap into recoil…
   */
  hitRecoilMs: 67,
  /** MEASURED — …then ease back home (8 of the 12 stagger frames). */
  hitReturnMs: 133,
  /**
   * MEASURED — death collapse: tip-airborne → ground 12f, settled at 20f
   * ≈ 333ms (longplay A one-hit kill t≈3315.5, crumple frames 153→165→173).
   */
  deathMs: 333,
  /** INFERRED — idle breath period (ms per full cycle). */
  idlePeriodMs: 2600,
  /** INFERRED — guard pose blend-in/out time. */
  guardBlendMs: 130,
  /** Below this blend weight the guard overlay is skipped entirely. */
  guardEps: 0.001,
  /**
   * MEASURED — the original steps poses every 4th video frame (strict
   * 4-frame cadence via pixel-difference MAE over duel t=3774–3775):
   * 15fps animation inside 60fps gameplay. Scenes latch the drawn pose to
   * this step so motion keeps the OG's chunky stepping. 0 = smooth (veto).
   */
  poseStepMs: 1000 / 15,
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
