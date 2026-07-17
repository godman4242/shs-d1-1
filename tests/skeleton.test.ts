/**
 * config/poses + core/skeleton — 15-joint pose keyframes and pure pose math
 * (Stage 4 M0, ported from iaido-duel's skeleton.test.ts, same-owner
 * original code; RED-first). Keyframes are authored at OUR study-frame
 * proportions (feet at +49 below the pelvis origin, grip at −14) — action
 * poses are pinned BEHAVIOURALLY (what the pose must read as), not
 * coordinate-for-coordinate: the coordinates are art, iterated at the
 * fidelity gate.
 */
import { describe, expect, it } from 'vitest';
import {
  ARM_JOINTS,
  DEAD,
  GUARD_POSE,
  HIT_RECOIL,
  IDLE_POSE,
  SLASH_FOLLOW,
  SLASH_WINDUP,
  type Joint,
} from '../src/config/poses';
import { addOffsets, lerpPose, scaleArc } from '../src/core/skeleton';

const JOINTS: Joint[] = [
  'hat', 'head', 'neck', 'chest', 'pelvis',
  'shoulderF', 'elbowF', 'handF', 'sword',
  'hipF', 'kneeF', 'footF', 'hipB', 'kneeB', 'footB',
];

describe('pose keyframes', () => {
  it('every keyframe defines exactly the 15 joints', () => {
    for (const pose of [IDLE_POSE, SLASH_WINDUP, SLASH_FOLLOW, GUARD_POSE, HIT_RECOIL, DEAD]) {
      expect(Object.keys(pose).sort()).toEqual([...JOINTS].sort());
    }
  });

  it('IDLE reads as a semi-crouch combat fighter at our proportions: head above pelvis, feet on the ground, sword forward (Session 8B: measured semi-crouch)', () => {
    expect(IDLE_POSE.pelvis).toEqual({ x: 0, y: 4 }); // dropped 4px (knee bend)
    expect(IDLE_POSE.head.y).toBeLessThan(-40); // head well above the pelvis (+y is down)
    expect(IDLE_POSE.hat.y).toBeLessThan(IDLE_POSE.head.y); // kasa above the head
    expect(IDLE_POSE.footF.y).toBeGreaterThan(40); // feet at ground depth
    expect(IDLE_POSE.footB.y).toBe(IDLE_POSE.footF.y); // both planted
    expect(IDLE_POSE.sword.x).toBeGreaterThan(IDLE_POSE.handF.x); // blade points forward
    expect(IDLE_POSE.kneeF.x).toBeGreaterThan(7); // knees splay wider (semi-crouch)
    expect(IDLE_POSE.kneeB.x).toBeLessThan(-7);
    expect(IDLE_POSE.footF.x).toBeGreaterThan(12); // feet wider base
    expect(IDLE_POSE.footB.x).toBeLessThan(-12);
    expect(IDLE_POSE.chest.x).toBeGreaterThan(4); // torso leans forward
    expect(IDLE_POSE.handF.y).toBeGreaterThan(-12); // blade hand lower (low-forward)
  });

  it('WINDUP pulls the blade up and behind; FOLLOW sweeps it down across the front (Tell 6 arc)', () => {
    expect(SLASH_WINDUP.sword.x).toBeLessThan(0); // behind the body
    expect(SLASH_WINDUP.sword.y).toBeLessThan(IDLE_POSE.sword.y); // raised
    expect(SLASH_FOLLOW.sword.x).toBeGreaterThan(IDLE_POSE.sword.x); // out front
    expect(SLASH_FOLLOW.sword.y).toBeGreaterThan(IDLE_POSE.sword.y); // swept low
  });

  it('GUARD holds the blade forward and high; RECOIL knocks head/chest back', () => {
    expect(GUARD_POSE.sword.x).toBeGreaterThan(0);
    expect(GUARD_POSE.sword.y).toBeLessThan(IDLE_POSE.sword.y);
    expect(HIT_RECOIL.head.x).toBeLessThan(IDLE_POSE.head.x);
    expect(HIT_RECOIL.chest.x).toBeLessThan(IDLE_POSE.chest.x);
  });

  it('DEAD collapses the body ONTO the ground plane (no floating corpse), head fallen behind', () => {
    expect(DEAD.head.y).toBeGreaterThan(IDLE_POSE.head.y); // dropped (y grows downward)
    expect(DEAD.head.x).toBeLessThan(0); // fell back behind the pelvis
    // every joint lies near the ground band the feet stand on (float-fix over iaido)
    for (const j of JOINTS) {
      expect(DEAD[j].y).toBeGreaterThan(30);
      expect(DEAD[j].y).toBeLessThanOrEqual(IDLE_POSE.footF.y);
    }
  });
});

describe('core/skeleton pose math', () => {
  it('lerpPose anchors endpoints and interpolates the midpoint', () => {
    expect(lerpPose(IDLE_POSE, SLASH_FOLLOW, 0)).toEqual(IDLE_POSE);
    expect(lerpPose(IDLE_POSE, SLASH_FOLLOW, 1)).toEqual(SLASH_FOLLOW);
    const mid = lerpPose(IDLE_POSE, SLASH_FOLLOW, 0.5);
    expect(mid.sword.x).toBeCloseTo((IDLE_POSE.sword.x + SLASH_FOLLOW.sword.x) / 2, 6);
    expect(mid.sword.y).toBeCloseTo((IDLE_POSE.sword.y + SLASH_FOLLOW.sword.y) / 2, 6);
  });

  it('addOffsets adds deltas and leaves unlisted joints untouched, returning a new object', () => {
    const out = addOffsets(IDLE_POSE, { chest: { x: 0, y: -5 } });
    expect(out.chest.y).toBeCloseTo(IDLE_POSE.chest.y - 5, 6);
    expect(out.pelvis.x).toBeCloseTo(IDLE_POSE.pelvis.x, 6);
    expect(out).not.toBe(IDLE_POSE);
  });

  it('scaleArc scales ARM joint deviation from idle by k and leaves the body untouched', () => {
    const k = 1.5;
    const out = scaleArc(SLASH_WINDUP, k);
    for (const j of ARM_JOINTS) {
      expect(out[j].x - IDLE_POSE[j].x).toBeCloseTo(k * (SLASH_WINDUP[j].x - IDLE_POSE[j].x), 6);
      expect(out[j].y - IDLE_POSE[j].y).toBeCloseTo(k * (SLASH_WINDUP[j].y - IDLE_POSE[j].y), 6);
    }
    expect(out.footF).toEqual(SLASH_WINDUP.footF); // body untouched
    expect(out.chest).toEqual(SLASH_WINDUP.chest);
    expect(scaleArc(SLASH_WINDUP, 1)).toEqual(SLASH_WINDUP); // k=1 identity
  });
});
