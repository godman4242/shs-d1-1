/**
 * FighterAnimator (Stage 4 M0, ported from iaido-duel — same-owner
 * original code): owns ONE fighter's pose each frame. Layering: base
 * locomotion (idle breath / walk stride) → transient action overlay
 * (slash / hit / death) → smoothed guard hold. Pure state machine — no
 * Phaser, no literals; every feel number lives in config/anim.ts,
 * per-stance timing in config/timing.ts + config/stances.ts.
 *
 * This is RENDER-side animation state (which frame of a swing to draw),
 * never gameplay state — Sim stays the single owner of truth (hp, phase,
 * cooldowns). Scenes construct animators and drive them from Sim events.
 */
import { ANIM_TIMING } from '../config/anim';
import { ONE, ZERO } from '../config/nums';
import { DEAD, GUARD_POSE, HIT_RECOIL, IDLE_POSE, SLASH_FOLLOW, SLASH_WINDUP, type Pose } from '../config/poses';
import { STANCE_TABLE, type StanceId } from '../config/stances';
import { FIXED_HZ, MS_PER_S, SLASH_FRAMES } from '../config/timing';
import { easeInOutSine, easeInQuad, easeOutCubic, idleOffsets, phaseAt, walkOffsets, type Segment } from './anim';
import { addOffsets, lerpPose, scaleArc } from './skeleton';

export type GuardLevel = 'none' | 'telegraph' | 'block';
export type AnimAction = 'none' | 'slash' | 'hit' | 'dead';

const FRAME_MS = MS_PER_S / FIXED_HZ;

/** Per-stance slash phase clock (frames → ms): Light fast, Heavy slow (Tell 6). */
const slashSegsFor = (stance: StanceId): Segment[] => {
  const f = SLASH_FRAMES[stance];
  return [
    { name: 'windup', ms: f.windup * FRAME_MS },
    { name: 'strike', ms: f.active * FRAME_MS },
    { name: 'recover', ms: f.recovery * FRAME_MS },
  ];
};

const HIT_SEGS: Segment[] = [
  { name: 'recoil', ms: ANIM_TIMING.hitRecoilMs },
  { name: 'return', ms: ANIM_TIMING.hitReturnMs },
];

export class FighterAnimator {
  private moving = false;
  private guard: GuardLevel = 'none';
  private guardT = ZERO; // smoothed 0..1 toward the guard pose
  private action: AnimAction = 'none';
  private actionElapsed = ZERO;
  private locoPhase = ZERO;
  private dead = false;
  // per-stance slash arc + timing (set at startSlash; default = balanced, k=1)
  private slashSegs: Segment[] = slashSegsFor('balanced');
  private slashWindup: Pose = SLASH_WINDUP;
  private slashFollow: Pose = SLASH_FOLLOW;

  setMoving(b: boolean): void {
    if (!this.dead) this.moving = b;
  }

  setGuard(g: GuardLevel): void {
    if (!this.dead) this.guard = g;
  }

  startSlash(stance: StanceId = 'balanced'): void {
    if (this.dead) return;
    this.action = 'slash';
    this.actionElapsed = ZERO;
    this.slashSegs = slashSegsFor(stance);
    // arc amplitude scales with stance reach (Light long, Heavy short) — Tell 6
    const k = STANCE_TABLE[stance].reach / STANCE_TABLE.balanced.reach;
    this.slashWindup = scaleArc(SLASH_WINDUP, k);
    this.slashFollow = scaleArc(SLASH_FOLLOW, k);
  }

  startHit(): void {
    if (!this.dead && this.action !== 'slash') {
      this.action = 'hit';
      this.actionElapsed = ZERO;
    }
  }

  startDeath(): void {
    if (this.dead) return; // re-entry must not rewind the collapse
    this.dead = true;
    this.guard = 'none';
    this.action = 'dead';
    this.actionElapsed = ZERO;
  }

  get isDead(): boolean {
    return this.dead;
  }

  actionName(): AnimAction {
    return this.action;
  }

  guardLevel(): GuardLevel {
    return this.guard;
  }

  /** Advance one frame and return the pose to draw. `dtMs` is scene-scaled (fx clock). */
  update(dtMs: number): Pose {
    // base locomotion layer
    const period = this.moving ? ANIM_TIMING.walkPeriodMs : ANIM_TIMING.idlePeriodMs;
    this.locoPhase = (this.locoPhase + dtMs / period) % ONE;
    const base = this.moving
      ? addOffsets(IDLE_POSE, walkOffsets(this.locoPhase))
      : addOffsets(IDLE_POSE, idleOffsets(this.locoPhase));

    // 1) death wins
    if (this.action === 'dead') {
      this.actionElapsed += dtMs;
      return lerpPose(IDLE_POSE, DEAD, easeInQuad(Math.min(ONE, this.actionElapsed / ANIM_TIMING.deathMs)));
    }

    // 2) transient action overlay
    if (this.action === 'slash') {
      this.actionElapsed += dtMs;
      const p = phaseAt(this.slashSegs, this.actionElapsed);
      if (p.done) {
        this.action = 'none';
      } else if (p.name === 'windup') {
        return lerpPose(base, this.slashWindup, easeOutCubic(p.t));
      } else if (p.name === 'strike') {
        return lerpPose(this.slashWindup, this.slashFollow, easeOutCubic(p.t));
      } else {
        return lerpPose(this.slashFollow, base, easeInOutSine(p.t));
      }
    } else if (this.action === 'hit') {
      this.actionElapsed += dtMs;
      const p = phaseAt(HIT_SEGS, this.actionElapsed);
      if (p.done) {
        this.action = 'none';
      } else if (p.name === 'recoil') {
        return lerpPose(base, HIT_RECOIL, easeOutCubic(p.t));
      } else {
        return lerpPose(HIT_RECOIL, base, easeInOutSine(p.t));
      }
    }

    // 3) guard hold (smoothed blend toward telegraph-windup or block pose)
    const target = this.guard === 'none' ? ZERO : ONE;
    this.guardT += (Math.sign(target - this.guardT) * dtMs) / ANIM_TIMING.guardBlendMs;
    this.guardT = Math.max(ZERO, Math.min(ONE, this.guardT));
    if (this.guardT > ANIM_TIMING.guardEps) {
      const held = this.guard === 'block' ? GUARD_POSE : SLASH_WINDUP;
      return lerpPose(base, held, easeInOutSine(this.guardT));
    }

    // 4) plain locomotion
    return base;
  }
}
