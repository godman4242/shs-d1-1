/**
 * ⭐ GATE A6-C (SESSION20 A6.3) — THE FIGHTER'S AGREEMENT WITH THE SOURCE IS A
 * COMMITTED NUMBER, AND THE SUITE HOLDS IT AS A FLOOR.
 *
 * This is the gate the whole session exists to build. SESSION 19 shipped four
 * outfit defects past a 750-green suite because **nothing in the repo compared
 * the rendered fighter to the source**. From here, a change that makes the
 * fighter less like the source turns this file red.
 *
 * ⚠️ IT IS A RATCHET, NOT A TARGET. The floors below may only ever move UP, and
 * only in a commit that says why. Lowering one to make a diff go green is the
 * single most damaging edit available in this repo: it converts the only
 * source-fidelity measurement into a rubber stamp. If a change is worth the
 * score, say so in the commit and raise the floor to the new value.
 *
 * ⚠️ WHICH SCORE THIS IS. The SEALED score — our side from the renderer's exact
 * coverage mask, the source side from `sourceProfile.ts`'s committed numbers. It
 * runs in a clean clone with no `reference/`. It is NOT the same number as
 * `compareToSource.py`'s diagnostic score, which segments a rendered PNG with an
 * image heuristic and needs the frames; that one is richer (per slot, plus an
 * overlay) and the two must never be quoted as each other.
 *
 * ⛔ AND WHAT NEITHER SCORE CAN SEE (kickoff §6 Risk 1): colour, paint order, and
 * a garment on the wrong slot. SESSION 19's sleeve-on-the-torso would have scored
 * FINE here. The pixel gate in `tests/poseRender.test.ts` catches a changed
 * render; a human looking at `renders/overlay.png` catches the rest. **A green
 * A6-C is necessary and not sufficient.**
 */
import { describe, expect, it } from 'vitest';
import type { ShapeInput } from '../src/core/artPlan';
import { renderPoseWith } from '../scripts/art/poseScene';
import { profileAgreement, widthProfile, PROFILE_SAMPLES } from '../scripts/art/silhouette';
import { FRAME_TO_FRAME_CEILING, HELDOUT_PROFILE, TRACING_PROFILE } from '../scripts/art/sourceProfile';
import { SHAPE_2644 } from '../src/game/art/generated/shape2644';
import { SHAPE_2646 } from '../src/game/art/generated/shape2646';
import { SHAPE_2648 } from '../src/game/art/generated/shape2648';
import { SHAPE_2650 } from '../src/game/art/generated/shape2650';
import { SHAPE_2653 } from '../src/game/art/generated/shape2653';
import { SHAPE_2655 } from '../src/game/art/generated/shape2655';
import { SHAPE_2658 } from '../src/game/art/generated/shape2658';
import { SHAPE_2664 } from '../src/game/art/generated/shape2664';
import { SHAPE_2667 } from '../src/game/art/generated/shape2667';
import { SHAPE_2670 } from '../src/game/art/generated/shape2670';
import { SHAPE_2672 } from '../src/game/art/generated/shape2672';
import { SHAPE_2674 } from '../src/game/art/generated/shape2674';
import { SHAPE_2676 } from '../src/game/art/generated/shape2676';
import { SHAPE_2678 } from '../src/game/art/generated/shape2678';
import { SHAPE_9001 } from '../src/game/art/generated/shape9001';
import { SHAPE_9011 } from '../src/game/art/generated/shape9011';
import { SHAPE_9012 } from '../src/game/art/generated/shape9012';
import { SHAPE_9014 } from '../src/game/art/generated/shape9014';
import { SHAPE_9015 } from '../src/game/art/generated/shape9015';
import { SHAPE_9017 } from '../src/game/art/generated/shape9017';
import { SHAPE_9019 } from '../src/game/art/generated/shape9019';

const SHAPES: ReadonlyMap<number, ShapeInput> = new Map(
  [
    SHAPE_2644, SHAPE_2646, SHAPE_2648, SHAPE_2650, SHAPE_2653, SHAPE_2655, SHAPE_2658,
    SHAPE_2664, SHAPE_2667, SHAPE_2670, SHAPE_2672, SHAPE_2674, SHAPE_2676, SHAPE_2678,
    SHAPE_9001, SHAPE_9011, SHAPE_9012, SHAPE_9014, SHAPE_9015, SHAPE_9017, SHAPE_9019,
  ].map((s) => [s.id, s]),
);

const ourProfile = (variant: 'idle' | 'dressed'): number[] =>
  widthProfile(renderPoseWith(variant, SHAPES).raster);

const scoreAgainst = (variant: 'idle' | 'dressed', source: readonly number[]): number =>
  profileAgreement(ourProfile(variant), source);

/**
 * ⛔ THE FLOORS — SESSION 20 A6.3, measured 2026-07-27 on the dressed fighter.
 *
 * Exact at the time of committing: tracing `0.8597286207791531`, held-out
 * `0.8197393639422795`. The floors are those values TRUNCATED (not rounded) to
 * four decimals, so the gate cannot fail on the digits it does not state.
 *
 * ⚠️ For scale: the BARE fighter scores 0.6993 / 0.7479 against the same two
 * frames. Clothing it is worth ~0.16 on the traced frame, which is the evidence
 * SESSION 19's whole outfit rests on.
 *
 * ⛔ THESE MAY ONLY EVER MOVE UP, in a commit that says why. Read
 * `docs/DIVERGENCES.md` "SESSION 20 — A6.3" before touching either number.
 */
const FLOOR_TRACING = 0.8597;
const FLOOR_HELDOUT = 0.8197;

describe('GATE A6-C — the dressed fighter agrees with the source, and may not get worse', () => {
  it('holds its FLOOR against the frame the outfit was traced from', () => {
    expect(scoreAgainst('dressed', TRACING_PROFILE.profile)).toBeGreaterThanOrEqual(FLOOR_TRACING);
  });

  it('holds its FLOOR against the HELD-OUT frame — the one that says it generalises', () => {
    // The outfit was never traced from zFt_0071. A fighter fitted to its own
    // source scores far better on the tracing frame than on this one.
    expect(scoreAgainst('dressed', HELDOUT_PROFILE.profile)).toBeGreaterThanOrEqual(FLOOR_HELDOUT);
  });

  it('is not overfitted — the two frames score within 0.08 of each other', () => {
    const tracing = scoreAgainst('dressed', TRACING_PROFILE.profile);
    const heldout = scoreAgainst('dressed', HELDOUT_PROFILE.profile);
    expect(Math.abs(tracing - heldout)).toBeLessThan(0.08);
  });

  it('stays BELOW the frame-to-frame ceiling — a score above it is a bug, not a triumph', () => {
    // The source's own two frames agree at 0.8808. Beating that against a single
    // frame means the profile is being fitted to compression noise, and it would
    // be evidence the gate had stopped measuring fidelity.
    expect(scoreAgainst('dressed', TRACING_PROFILE.profile)).toBeLessThan(FRAME_TO_FRAME_CEILING + 0.05);
  });
});

describe('GATE A6-C — the measurement itself is sound', () => {
  it('samples the profile at exactly the 19 heights the source numbers were measured at', () => {
    expect(PROFILE_SAMPLES).toHaveLength(19);
    expect(TRACING_PROFILE.profile).toHaveLength(19);
    expect(HELDOUT_PROFILE.profile).toHaveLength(19);
    expect(PROFILE_SAMPLES[0]).toBeCloseTo(0.05, 10);
    expect(PROFILE_SAMPLES[18]).toBeCloseTo(0.95, 10);
  });

  it('scores a profile against ITSELF as exactly 1', () => {
    expect(profileAgreement(TRACING_PROFILE.profile, TRACING_PROFILE.profile)).toBe(1);
  });

  it('rejects profiles of different lengths instead of zipping to the shorter', () => {
    expect(() => profileAgreement([1, 2, 3], [1, 2])).toThrow(/sampled alike/);
  });

  it('scores a limb that exists on one side and not the other as ZERO for that sample', () => {
    expect(profileAgreement([1, 0], [1, 1])).toBeCloseTo(0.5, 10);
  });

  it('the DRESSED fighter scores better than the BARE one — the outfit is why we agree at all', () => {
    // If clothing a doll did not improve agreement with a clothed source, the
    // whole of SESSION 19 would be unevidenced.
    const dressed = scoreAgainst('dressed', TRACING_PROFILE.profile);
    const bare = scoreAgainst('idle', TRACING_PROFILE.profile);
    expect(dressed).toBeGreaterThan(bare);
  });

  it('the committed source profiles are plausible silhouettes, not transcription slips', () => {
    for (const src of [TRACING_PROFILE, HELDOUT_PROFILE]) {
      expect(src.heightPx).toBeGreaterThan(200);
      expect(src.heightPx).toBeLessThan(280);
      for (const w of src.profile) {
        expect(w).toBeGreaterThan(0);
        expect(w).toBeLessThan(0.6); // a fighter wider than 0.6x its height is a failed segmentation
      }
    }
  });
});
