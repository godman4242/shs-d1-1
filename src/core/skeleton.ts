/**
 * Pure pose math (Stage 4 M0, ported from iaido-duel — same-owner original
 * code): keyframe interpolation, per-joint offset application, and the
 * per-stance arc scaler (Tell 6). Framework-free, literal-free; all pose
 * data lives in config/poses.ts.
 */
import type { Offsets } from './anim';
import { ARM_JOINTS, IDLE_POSE, type Joint, type Pose } from '../config/poses';

/** Linear interpolation between two poses; t=0 → a, t=1 → b. */
export const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const out = {} as Pose;
  (Object.keys(a) as Joint[]).forEach((k) => {
    out[k] = { x: a[k].x + (b[k].x - a[k].x) * t, y: a[k].y + (b[k].y - a[k].y) * t };
  });
  return out;
};

/** Add per-joint offsets to a pose (joints absent from `offs` are copied unchanged). */
export const addOffsets = (pose: Pose, offs: Offsets): Pose => {
  const out = {} as Pose;
  (Object.keys(pose) as Joint[]).forEach((k) => {
    const o = offs[k];
    out[k] = o ? { x: pose[k].x + o.x, y: pose[k].y + o.y } : { x: pose[k].x, y: pose[k].y };
  });
  return out;
};

/**
 * Scale a slash keyframe's ARM sweep by `k` (its deviation from `base`),
 * leaving the rest of the body untouched. Drives per-stance arc geometry
 * (Tell 6): Light reach > balanced ⇒ k>1 ⇒ long sweeping arc; Heavy ⇒ k<1.
 */
export const scaleArc = (pose: Pose, k: number, base: Pose = IDLE_POSE): Pose => {
  const out = { ...pose };
  for (const j of ARM_JOINTS) {
    out[j] = {
      x: base[j].x + (pose[j].x - base[j].x) * k,
      y: base[j].y + (pose[j].y - base[j].y) * k,
    };
  }
  return out;
};
