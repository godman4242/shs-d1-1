/**
 * POSE KEYFRAMES — Stage 4 M0 skeletal fighters (structure ported from
 * iaido-duel, same-owner original code). Pure data, no logic.
 *
 * All coordinates INFERRED — authored fresh at THIS repo's study-frame
 * proportions (samurai.ts v2 fidelity pass: chunky ~120px fighter, big
 * head, wide hakama), NOT iaido-duel's slim 7-head build. Local space:
 * origin at the pelvis, +x faces forward, +y is down; the feet plant at
 * +49 (the pelvis rides 52px above groundY at the render call).
 *
 * Coordinates are ART: tests/skeleton.test.ts pins IDLE exactly (it is the
 * anatomical contract every other pose derives from) and pins the action
 * poses BEHAVIOURALLY (windup-behind, follow-through-front, guard-high,
 * recoil-back, dead-on-the-ground) — visual polish stays a one-file edit.
 */

export interface PosePoint {
  x: number;
  y: number;
}

export type Joint =
  | 'hat'
  | 'head'
  | 'neck'
  | 'chest'
  | 'pelvis'
  | 'shoulderF'
  | 'elbowF'
  | 'handF'
  | 'sword'
  | 'hipF'
  | 'kneeF'
  | 'footF'
  | 'hipB'
  | 'kneeB'
  | 'footB';

export type Pose = Record<Joint, PosePoint>;

/** INFERRED — standing base: our chunky build, two-hand grip forward, kasa low. */
export const IDLE_POSE: Pose = {
  pelvis: { x: 0, y: 0 },
  chest: { x: 2, y: -34 },
  neck: { x: 2, y: -42 },
  head: { x: 3, y: -50 },
  hat: { x: 4, y: -70 },
  shoulderF: { x: 7, y: -36 },
  elbowF: { x: 14, y: -24 },
  handF: { x: 15, y: -14 },
  sword: { x: 59, y: -28 },
  hipF: { x: 5, y: 0 },
  kneeF: { x: 7, y: 26 },
  footF: { x: 11, y: 49 },
  hipB: { x: -5, y: 0 },
  kneeB: { x: -6, y: 26 },
  footB: { x: -11, y: 49 },
};

/** INFERRED — blade drawn up-and-back over the shoulder (windup / the enemy "tell"). */
export const SLASH_WINDUP: Pose = {
  ...IDLE_POSE,
  shoulderF: { x: 3, y: -38 },
  elbowF: { x: 0, y: -46 },
  handF: { x: -10, y: -44 },
  sword: { x: -34, y: -62 },
};

/** INFERRED — blade swept down across the front (follow-through). */
export const SLASH_FOLLOW: Pose = {
  ...IDLE_POSE,
  shoulderF: { x: 7, y: -32 },
  elbowF: { x: 22, y: -26 },
  handF: { x: 38, y: -6 },
  sword: { x: 72, y: 24 },
};

/** INFERRED — sword held horizontal in front: a defensive guard (block). */
export const GUARD_POSE: Pose = {
  ...IDLE_POSE,
  shoulderF: { x: 5, y: -37 },
  elbowF: { x: 16, y: -36 },
  handF: { x: 26, y: -32 },
  sword: { x: 62, y: -36 },
};

/** INFERRED — torso/head knocked back away from the strike. */
export const HIT_RECOIL: Pose = {
  ...IDLE_POSE,
  chest: { x: -3, y: -32 },
  neck: { x: -4, y: -40 },
  head: { x: -6, y: -48 },
  hat: { x: -5, y: -67 },
  shoulderF: { x: 2, y: -34 },
  elbowF: { x: 9, y: -22 },
  handF: { x: 11, y: -12 },
  sword: { x: 44, y: -24 },
};

/**
 * INFERRED — collapsed on the ground (the loser falls). Authored ON the
 * ground plane (y ≈ the feet's +49), unlike iaido's pelvis-height corpse:
 * the death lerp IDLE→DEAD drops the whole body onto the grass band.
 */
export const DEAD: Pose = {
  pelvis: { x: 0, y: 40 },
  chest: { x: -18, y: 36 },
  neck: { x: -30, y: 38 },
  head: { x: -40, y: 38 },
  hat: { x: -54, y: 42 },
  shoulderF: { x: -16, y: 33 },
  elbowF: { x: -27, y: 40 },
  handF: { x: -35, y: 44 },
  sword: { x: -62, y: 46 },
  hipF: { x: 5, y: 42 },
  kneeF: { x: 20, y: 45 },
  footF: { x: 38, y: 47 },
  hipB: { x: -4, y: 43 },
  kneeB: { x: -14, y: 46 },
  footB: { x: -30, y: 48 },
};

/** Sword-arm joints whose deviation from IDLE defines the slash arc's reach (Tell 6). */
export const ARM_JOINTS: readonly Joint[] = ['shoulderF', 'elbowF', 'handF', 'sword'];
