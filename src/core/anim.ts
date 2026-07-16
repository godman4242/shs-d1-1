/**
 * Pure animation math (Stage 4 M0, ported from iaido-duel — same-owner
 * original code): easing, a timed-segment phase clock, and procedural
 * locomotion offsets. No side effects; all feel numbers come from
 * config/anim.ts so this module stays literal-free (config-purity gate).
 */
import { IDLE_BREATH, EASE, WALK } from '../config/anim';
import { ONE, TAU, TWO, ZERO } from '../config/nums';

export const clamp01 = (t: number): number => (t < ZERO ? ZERO : t > ONE ? ONE : t);

export const easeOutCubic = (t: number): number => ONE - Math.pow(ONE - clamp01(t), EASE.cubicExp);

export const easeInOutSine = (t: number): number =>
  (ONE - Math.cos(Math.PI * clamp01(t))) / TWO;

export const easeInQuad = (t: number): number => {
  const x = clamp01(t);
  return x * x;
};

export interface Segment {
  name: string;
  ms: number;
}

export interface PhaseResult {
  name: string;
  t: number;
  done: boolean;
}

/** Locate `elapsedMs` within timed segments; `t` is progress [0,1] in the active one. */
export function phaseAt(segments: readonly Segment[], elapsedMs: number): PhaseResult {
  let acc = ZERO;
  let lastName = ''; // string literals are fine — only numerics are banned in core/

  for (const seg of segments) {
    if (elapsedMs < acc + seg.ms) {
      return { name: seg.name, t: clamp01((elapsedMs - acc) / seg.ms), done: false };
    }
    acc += seg.ms;
    lastName = seg.name;
  }
  return { name: lastName, t: ONE, done: true };
}

export interface JointOffset {
  x: number;
  y: number;
}

export type Offsets = Record<string, JointOffset | undefined>;

/** Procedural side-view walk cycle. `phase` in [0,1). */
export function walkOffsets(
  phase: number,
  amp = ONE,
): Record<'footF' | 'kneeF' | 'footB' | 'kneeB' | 'pelvis' | 'chest' | 'handF', JointOffset> {
  const a = phase * TAU;
  const swing = Math.sin(a);
  const bob = Math.cos(TWO * a); // two bobs per stride
  return {
    footF: { x: WALK.footSwing * swing * amp, y: -WALK.footLift * Math.max(ZERO, swing) * amp },
    kneeF: { x: WALK.kneeSwing * swing * amp, y: -WALK.kneeLift * Math.max(ZERO, swing) * amp },
    footB: { x: -WALK.footSwing * swing * amp, y: -WALK.footLift * Math.max(ZERO, -swing) * amp },
    kneeB: { x: -WALK.kneeSwing * swing * amp, y: -WALK.kneeLift * Math.max(ZERO, -swing) * amp },
    pelvis: { x: ZERO, y: -WALK.bob * bob * amp },
    chest: { x: ZERO, y: -WALK.bob * bob * amp },
    handF: { x: -WALK.armSwing * swing * amp, y: ZERO }, // arm counter-swings the front leg
  };
}

/** Gentle idle breathing/sway. `phase` in [0,1). */
export function idleOffsets(
  phase: number,
  amp = ONE,
): Record<'chest' | 'neck' | 'head' | 'hat' | 'handF', JointOffset> {
  const breathe = Math.sin(phase * TAU);
  return {
    chest: { x: ZERO, y: -IDLE_BREATH.chest * breathe * amp },
    neck: { x: ZERO, y: -IDLE_BREATH.neck * breathe * amp },
    head: { x: ZERO, y: -IDLE_BREATH.head * breathe * amp },
    hat: { x: ZERO, y: -IDLE_BREATH.hat * breathe * amp },
    handF: { x: ZERO, y: IDLE_BREATH.hand * breathe * amp },
  };
}
