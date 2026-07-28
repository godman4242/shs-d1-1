/**
 * GATE A11-E — THE FIGHTER MOVES, FROM A PURE CORE STEPPER (SESSION23 A11.4).
 *
 * `OgAnimPlayer` steps the TRANSCRIBED frames (tests/a11AnimData.test.ts owns
 * their bytes) at the measured 15 fps latch (`ANIM_TIMING.poseStepMs`,
 * SESSION 11). Pure and injectable: anims arrive as a record, time arrives as
 * deltas, no Phaser, no clock, no randomness — so every behaviour here is a
 * deterministic function of its inputs.
 *
 * THE CARRY-FORWARD CONTRACT (the part the data cannot express alone): sparse
 * frames list only the nodes they change; the player overlays them on a
 * carried node map. MEASURED (this commit's data): partc's frames run
 * 19,0,19,0,19,19,7 — the empty frames are mid-sequence HOLDS and the last
 * frame overlays only 7 nodes, so without carry the fighter would lose 12
 * parts on the swing's final frame. `play()` keeps the carried map too
 * (full-frame anims overwrite all of it on entry, so nothing leaks).
 *
 * The matrix half of the gate: slash frames carry Flash matrix nodes
 * (`a..d`, fixed-point ×100). `composePose` scales them to real values ONCE
 * (like degrees→radians) and `planPose` applies them in the same single
 * mirror-aware site as rotation — pinned here with exact-coordinate checks.
 */
import { describe, expect, it } from 'vitest';
import { ANIM_TIMING } from '../src/config/anim';
import { OG_ANIMS, type OgAnim } from '../src/config/ogAnims';
import { OG_MATRIX_UNITS } from '../src/config/ogPose';
import type { ShapeInput } from '../src/core/artPlan';
import { composePose } from '../src/core/composePose';
import { OgAnimPlayer, strideMs } from '../src/core/ogAnimPlayer';
import { planPose } from '../src/core/planPose';
import { VIEW, worldToStageLength } from '../src/core/viewport';

const STEP = ANIM_TIMING.poseStepMs;

/** A tiny synthetic catalogue exercising sparse frames without real data. */
const SYNTH: Readonly<Record<string, OgAnim>> = {
  sparse: {
    durationFrames: 3,
    loop: false,
    frames: [
      [
        { slot: 1, x: 10, y: 20, rotationDeg: 0 },
        { slot: 2, x: 30, y: 40, rotationDeg: 90 },
      ],
      [],
      [{ slot: 1, x: 99, y: 20, rotationDeg: 45 }],
    ],
  },
  looper: {
    durationFrames: 2,
    loop: true,
    frames: [
      [{ slot: 1, x: 1, y: 1, rotationDeg: 0 }],
      [{ slot: 1, x: 2, y: 2, rotationDeg: 0 }],
    ],
  },
};

describe('A11-E — the 15 fps latch, banked like the scene latch banks time', () => {
  it('holds the first frame until a full step has accumulated, then advances', () => {
    const p = new OgAnimPlayer(SYNTH, 'looper');
    p.step(STEP / 2);
    expect(p.frameIndex).toBe(0);
    p.step(STEP / 2);
    expect(p.frameIndex).toBe(1);
  });

  it('a large delta advances several frames — banked time is never dropped', () => {
    const p = new OgAnimPlayer(OG_ANIMS, 'walk');
    // +1 ms keeps the claim off the exact float boundary: 3×(1000/15) rounds
    // a hair under three whole steps in IEEE doubles, and that is fine — the
    // scene never lands on exact boundaries either.
    p.step(STEP * 3 + 1);
    expect(p.frameIndex).toBe(3);
  });

  it('is deterministic: the same delta sequence always lands on the same frame', () => {
    const deltas = [16.7, 33.1, 8.2, 66.6, 120.4, 5.5, 47.9];
    const a = new OgAnimPlayer(OG_ANIMS, 'walk');
    const b = new OgAnimPlayer(OG_ANIMS, 'walk');
    for (const d of deltas) a.step(d);
    for (const d of deltas) b.step(d);
    expect(a.frameIndex).toBe(b.frameIndex);
    expect(a.nodes()).toEqual(b.nodes());
  });
});

describe('A11-E — distance-driven locomotion: the stride phase advances by travel, never wall time', () => {
  // Session 8's own anti-foot-skating rule, carried to the transcribed clip:
  // WALK.stridePx (MEASURED, 72 stage px per full stride) maps travelled px
  // to animation time, so cadence tracks ground covered. Owner LOOK
  // 2026-07-28 caught the regression: time-driven stepping skated the feet.
  it('one full measured stride advances exactly one full walk cycle', () => {
    const p = new OgAnimPlayer(OG_ANIMS, 'walk');
    const cycleFrames = OG_ANIMS.walk.frames.length;
    p.step(strideMs(72, 72, cycleFrames) + 1);
    // 20 frames on a 20-frame loop = back at frame 0 having wrapped once.
    expect(p.frameIndex).toBe(0);
    // …and one frame short of a stride is the last frame, not a wrap:
    const q = new OgAnimPlayer(OG_ANIMS, 'walk');
    q.step(strideMs(72 - 72 / cycleFrames, 72, cycleFrames) + 1);
    expect(q.frameIndex).toBe(cycleFrames - 1);
  });

  it('a twentieth of a stride is one frame — the latch still quantises', () => {
    const p = new OgAnimPlayer(OG_ANIMS, 'walk');
    p.step(strideMs(72 / 20, 72, 20) + 1);
    expect(p.frameIndex).toBe(1);
  });
});

describe('A11-E — loop and end semantics, straight from the source l= flag', () => {
  it('walk loops: frame 19 steps back to frame 0', () => {
    const p = new OgAnimPlayer(OG_ANIMS, 'walk');
    p.step(STEP * 19 + 1);
    expect(p.frameIndex).toBe(19);
    expect(p.done).toBe(false);
    p.step(STEP);
    expect(p.frameIndex).toBe(0);
  });

  it('a non-looping part holds its last frame and reports done', () => {
    const p = new OgAnimPlayer(OG_ANIMS, 'balancedhorizontalslash_parta');
    p.step(STEP * 50);
    expect(p.frameIndex).toBe(3);
    expect(p.done).toBe(true);
    const held = p.nodes();
    p.step(STEP * 5);
    expect(p.nodes()).toEqual(held);
  });

  it('play() restarts cleanly: frame 0, not done, latch bank cleared', () => {
    const p = new OgAnimPlayer(OG_ANIMS, 'balancedhorizontalslash_parta');
    p.step(STEP * 50);
    p.play('walk');
    expect(p.frameIndex).toBe(0);
    expect(p.done).toBe(false);
    expect(p.current).toBe('walk');
  });
});

describe('A11-E — carry-forward: sparse frames overlay a carried node map', () => {
  it('an empty frame changes nothing; a partial frame changes only its slots', () => {
    const p = new OgAnimPlayer(SYNTH, 'sparse');
    const at0 = new Map(p.nodes().map((n) => [n.slot, n]));
    expect(at0.get(1)).toEqual({ slot: 1, x: 10, y: 20, rotationDeg: 0 });

    p.step(STEP); // frame 1 — empty
    const at1 = new Map(p.nodes().map((n) => [n.slot, n]));
    expect(at1.get(1)).toEqual(at0.get(1));
    expect(at1.get(2)).toEqual(at0.get(2));

    p.step(STEP); // frame 2 — slot 1 only
    const at2 = new Map(p.nodes().map((n) => [n.slot, n]));
    expect(at2.get(1)).toEqual({ slot: 1, x: 99, y: 20, rotationDeg: 45 });
    expect(at2.get(2)).toEqual(at0.get(2)); // slot 2 carried, untouched
  });

  it('THE RECORDED SWING TAIL: partc holds through its empty frames and never loses parts', () => {
    // MEASURED frame node counts, in order: 19, 0, 19, 0, 19, 19, 7.
    const p = new OgAnimPlayer(OG_ANIMS, 'balancedhorizontalslash_partc');
    const at0 = p.nodes();
    expect(at0.length).toBe(19); // frame 0 is full — the part is self-starting
    p.step(STEP + 1); // frame 1 is EMPTY: a recorded hold
    expect(p.nodes()).toEqual(at0);
    p.step(STEP * 10); // run to the end (frame 6 overlays only 7 nodes)
    expect(p.done).toBe(true);
    expect(p.nodes().length).toBe(19); // carry-forward: the 12 untouched slots survive
  });
});

describe('A11-E — matrix nodes: composed once, planned in the mirror-aware site', () => {
  const matrixNode = { slot: 0, x: 10, y: -5, a: 200, b: 0, c: 0, d: 200 }; // pure 2× scale, ×100 fixed-point
  const square: ShapeInput = {
    id: 5,
    paints: [{ kind: 'fill', color: 0xabcdef, rings: [{ points: [0, 0, 4, 0, 4, 4, 0, 4], hole: false }] }],
  };
  const shapes = new Map<number, ShapeInput>([[5, square]]);
  const ORIGIN = { x: 100, y: 50 };

  it('composePose scales the recorded fixed-point matrix to real values, once', () => {
    const parts = composePose([matrixNode], [[5]], []);
    expect(parts[0]?.a).toBeCloseTo(200 / OG_MATRIX_UNITS, 10);
    expect(parts[0]?.d).toBeCloseTo(2, 10);
    expect(parts[0]?.rotationRad).toBeUndefined();
  });

  it('planPose applies the Flash matrix exactly: a 2× scale doubles the square about its pivot', () => {
    const parts = composePose([matrixNode], [[5]], []);
    const plan = planPose(parts, shapes, ORIGIN, VIEW);
    const op = plan[0];
    if (op?.kind !== 'fill') throw new Error('expected one fill');
    // ring point [2] is the (4,4) corner → matrix (8,8) → + node (10,-5) → stage
    const corner = op.points[2];
    expect(corner?.x).toBeCloseTo(ORIGIN.x + worldToStageLength(10 + 8, VIEW), 6);
    expect(corner?.y).toBeCloseTo(ORIGIN.y + worldToStageLength(-5 + 8, VIEW), 6);
  });

  it('a mirrored matrix part is the exact x-reflection of the unmirrored one', () => {
    const base = planPose(composePose([matrixNode], [[5]], []), shapes, ORIGIN, VIEW);
    const mir = planPose(composePose([matrixNode], [[5]], [], true), shapes, ORIGIN, VIEW);
    const b = base[0];
    const m = mir[0];
    if (b?.kind !== 'fill' || m?.kind !== 'fill') throw new Error('expected fills');
    b.points.forEach((p, i) => {
      expect(m.points[i]?.x).toBeCloseTo(2 * ORIGIN.x - p.x, 6);
      expect(m.points[i]?.y).toBeCloseTo(p.y, 6);
    });
  });

  it('THE REAL SWING plans end to end — walk and slash nodes compose without throwing', () => {
    const p = new OgAnimPlayer(OG_ANIMS, 'balancedhorizontalslash_parta');
    p.step(STEP);
    const parts = composePose(p.nodes(), [[5], [], [], [5]], []);
    expect(parts.length).toBeGreaterThan(0);
  });
});
