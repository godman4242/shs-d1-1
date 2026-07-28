/**
 * THE RECORDED-FRAME STEPPER (SESSION23 A11.4) — plays `OG_ANIMS` tables at
 * the measured 15 fps latch. Pure and injectable: anims arrive as a record,
 * time arrives as millisecond deltas, and every output is a deterministic
 * function of the calls made — no Phaser, no clock, no randomness
 * (`tests/a11AnimPlayer.test.ts`).
 *
 * THE CARRY-FORWARD CONTRACT. Recorded frames are as sparse as the source
 * stored them: a frame lists only the nodes it changes. The player overlays
 * each entered frame on a carried per-slot map. MEASURED example
 * (`balancedhorizontalslash_partc`, frame node counts 19,0,19,0,19,19,7):
 * the empty frames are recorded HOLDS and the final frame overlays only 7
 * nodes — without carry the fighter would lose 12 parts on the swing's last
 * frame. `play()` keeps the map across switches for the same reason; full
 * animations open with full frames, so nothing leaks into them.
 *
 * The latch banks time exactly like the scene latch it replaces: fractional
 * steps accumulate and are spent whole, so many small deltas land on the
 * same frame as one big one (determinism gate).
 */
import { ANIM_TIMING } from '../config/anim';
import type { OgAnim, OgAnimNode } from '../config/ogAnims';
import { ONE, ZERO } from '../config/nums';

/**
 * Distance → animation time for locomotion (SESSION23 A11.4, owner-LOOK fix).
 *
 * Session 8's anti-foot-skating rule, carried to the transcribed clip: the
 * stride phase advances by TRAVEL, never wall time. `dxPx` of ground covered
 * against a measured `stridePx` (WALK.stridePx, 72 stage px per full stride)
 * spans `cycleFrames` of the clip; multiplying by the 15 fps step converts
 * that into latch time, so `OgAnimPlayer.step` keeps its whole-frame
 * quantisation while cadence tracks speed exactly.
 */
export function strideMs(dxPx: number, stridePx: number, cycleFrames: number): number {
  return (dxPx / stridePx) * cycleFrames * ANIM_TIMING.poseStepMs;
}

export class OgAnimPlayer {
  private readonly anims: Readonly<Record<string, OgAnim>>;
  private animName: string;
  private accMs = ZERO;
  private frame = ZERO;
  private finished = false;
  private readonly carried = new Map<number, OgAnimNode>();

  constructor(anims: Readonly<Record<string, OgAnim>>, initial: string) {
    this.anims = anims;
    this.animName = initial;
    this.applyFrame();
  }

  /** The animation currently playing. */
  get current(): string {
    return this.animName;
  }

  /** The frame the latch is holding — 0-based, always < durationFrames. */
  get frameIndex(): number {
    return this.frame;
  }

  /** True once a non-looping animation has entered its last frame's hold. */
  get done(): boolean {
    return this.finished;
  }

  /** Switch animations: frame 0, bank cleared, carried nodes KEPT (see header). */
  play(name: string): void {
    this.animName = name;
    this.frame = ZERO;
    this.accMs = ZERO;
    this.finished = false;
    this.applyFrame();
  }

  /** Advance the latch by a delta; spends whole 15 fps steps, banks the rest. */
  step(deltaMs: number): void {
    this.accMs += deltaMs;
    while (this.accMs >= ANIM_TIMING.poseStepMs) {
      this.accMs -= ANIM_TIMING.poseStepMs;
      this.advanceOne();
    }
  }

  /** The carried pose: one node per slot seen so far, latest frame wins. */
  nodes(): readonly OgAnimNode[] {
    return [...this.carried.values()];
  }

  private anim(): OgAnim {
    const a = this.anims[this.animName];
    if (a === undefined) {
      throw new Error(`OgAnimPlayer: unknown animation '${this.animName}'`);
    }
    return a;
  }

  private advanceOne(): void {
    if (this.finished) return;
    const a = this.anim();
    const next = this.frame + ONE;
    if (next >= a.frames.length) {
      if (a.loop) {
        this.frame = ZERO;
        this.applyFrame();
      } else {
        // Hold the last frame; the caller decides what plays next (the
        // a→b→c chain policy is the scene's, not the data's).
        this.finished = true;
      }
      return;
    }
    this.frame = next;
    this.applyFrame();
  }

  private applyFrame(): void {
    const frame = this.anim().frames[this.frame];
    if (frame === undefined) {
      throw new Error(
        `OgAnimPlayer: animation '${this.animName}' has no frame ${String(this.frame)}`,
      );
    }
    for (const node of frame) this.carried.set(node.slot, node);
  }
}
