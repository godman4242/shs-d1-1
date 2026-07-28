/**
 * ⭐ GATE A9-A / A9-B / A9-C / A9-D (SESSION22 A9.1) — THE PAINT GRAMMAR GATE:
 * a re-authored garment must be DRAWN THE WAY THE ORIGINAL DRAWS, and the
 * pre-A9 traced blobs are pinned exactly as they stand, so the only way a
 * garment changes is by being re-authored into the grammar.
 *
 * ⛔ WHY THIS EXISTS. Three sessions tuned the traced garments while every gate
 * stayed green, and the owner still ruled the art not 1:1 — because the gap is
 * STRUCTURAL. The original is cel-shaded Flash vector: a flat base tone plus
 * one hard-edged shadow tone, a stroked contour of stated width, thin detail
 * lines. The trace is a silhouette with a hole punched in it: one all-ink fill
 * ring as an outline, one flat tone, no strokes. A colour gate grades the
 * hole's colour; it cannot see the hole. This gate reads the PAINT LIST.
 *
 * ⭐ THE GRAMMAR IS MEASURED OFF THE ORIGINAL'S OWN SHAPES, NOT INVENTED.
 * 12 of the 14 OG fighter shapes outline with a real ink stroke (widths
 * 0.5–2); the two that do not are named and pinned below. The byte-identity
 * regeneration test holds those shapes to the SWF's own data, so the positive
 * control cannot drift away from the source.
 *
 * ⚠️ THE ROSTER IS A RATCHET. A shape moves LEGACY → REAUTHORED in the same
 * commit that re-authors it, and never back. Editing a legacy blob in place
 * trips its pin; deleting a pin without re-authoring trips the partition test.
 * The bar numbers (stroke width [0.5, 2.5], 12 levels/channel, the OG's own
 * worst ink share) come from the SESSION22 kickoff §2 and may not be widened.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ArtShape } from '../src/game/art/types';
import { grammarOf, violationsOf } from '../scripts/art/grammar';
import type { GrammarBar, ToneTargets } from '../scripts/art/grammar';
import { inkShareOf } from '../scripts/art/inkShareLib';
import { SOURCE_FILLS } from '../scripts/art/sourceColour';
// ⚠️ The generated shapes are imported DIRECTLY, never via fighterShapes.ts —
// the runtime-boundary guard exempts only the pure-data art files, and the
// registry is a runtime module (kickoff §3: everything but poseRaster takes
// the shape map as an argument; keep it so). The corpus test below holds this
// hand list to the generated directory, so a new shape cannot land uncovered.
import { SHAPE_2641 } from '../src/game/art/generated/shape2641';
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

const ALL_SHAPES: readonly ArtShape[] = [
  SHAPE_2641, SHAPE_2644, SHAPE_2646, SHAPE_2648, SHAPE_2650, SHAPE_2653, SHAPE_2655,
  SHAPE_2658, SHAPE_2664, SHAPE_2667, SHAPE_2670, SHAPE_2672, SHAPE_2674, SHAPE_2676,
  SHAPE_2678, SHAPE_9001, SHAPE_9011, SHAPE_9012, SHAPE_9014, SHAPE_9015, SHAPE_9017,
  SHAPE_9019,
];
/** All committed OG art — the 14 fighter shapes AND the branch (the CLI's own reference set). */
const OG_SHAPES: readonly ArtShape[] = ALL_SHAPES.filter((s) => s.id < 9000);
const TRACED: readonly ArtShape[] = ALL_SHAPES.filter((s) => s.id >= 9000);
const GENERATED_DIR = fileURLToPath(new URL('../src/game/art/generated', import.meta.url));

/** The OG's own two exceptions, named so they are exemptions and not leaks. */
const SOLID_HAIR = 2670; // one solid ink mass IS the design
const RING_OUTLINED_FOOTTOP = 2672; // the one OG part outlined by filled rings

/**
 * ⭐ A9-B's bar is the ORIGINAL's own worst non-hair part, computed live from
 * the committed OG art — the suite owns the number, it is not transcribed.
 */
const OG_SHARES = OG_SHAPES.filter((s) => s.id !== SOLID_HAIR).map((s) => inkShareOf(s));
const worstOg = OG_SHARES.reduce((a, b) => (b.share > a.share ? b : a));

/** SESSION22 kickoff §2 — fixed before any re-authored art existed. */
const BAR: GrammarBar = {
  strokeWidthMin: 0.5,
  strokeWidthMax: 2.5,
  channelTolerance: 12,
  maxInkShare: worstOg.share,
};

/**
 * ⛔ THE ROSTER — shapes already re-authored in the OG grammar. A9.2–A9.5 move
 * ids IN (in the same commit as the re-authoring), never out, never edited to
 * fit a result. When all seven traced garments are here, LEGACY below is empty
 * and GATE A9-A is met.
 */
const REAUTHORED: ReadonlySet<number> = new Set<number>([]);

/**
 * Garments measured genuinely FLAT in the source may keep ONE tone (kickoff
 * D3's obi veto). Joining this set requires citing the garment's measured iqr
 * in a comment beside its id — an empty set today because no garment has been
 * re-authored yet, and the decision is made at authoring time, by measurement.
 */
const MEASURED_FLAT: ReadonlySet<number> = new Set<number>([]);

/**
 * ⛔ THE PRE-A9 TRACED BLOBS, PINNED EXACTLY AS THEY STAND (probed 2026-07-28,
 * baseline f7e3801). Every one is the same anti-grammar: no strokes, one
 * all-ink fill ring for an outline, one flat tone. The pin freezes them: any
 * in-place edit fails here with instructions to re-author instead.
 */
const LEGACY: Readonly<Record<number, { inkFillRings: number; tones: readonly number[] }>> = {
  9001: { inkFillRings: 1, tones: [0x666367] }, // gi sleeve, far — 70.6% ink ⛔
  9011: { inkFillRings: 1, tones: [0xc8c3c5] }, // hakama
  9012: { inkFillRings: 1, tones: [0xb6b4b6] }, // collar/juban — 75.9% ink ⛔
  9014: { inkFillRings: 1, tones: [0xcdcacb] }, // obi
  9015: { inkFillRings: 1, tones: [0x6e6b6d] }, // gi body
  9017: { inkFillRings: 1, tones: [0x8e6f38] }, // kasa
  9019: { inkFillRings: 1, tones: [0x6a6669] }, // gi sleeve, near
};

/** Lookups throw, never cast — a missing shape is a finding, not a type. */
function shapeOf(id: number): ArtShape {
  const shape = ALL_SHAPES.find((s) => s.id === id);
  if (shape === undefined) throw new Error(`shape ${String(id)} is not in the corpus`);
  return shape;
}

/** A roster shape with no colour targets is a FAILURE, never a skip (A8-A rule). */
function targetsFor(shapeId: number): ToneTargets {
  const row = SOURCE_FILLS.find((f) => f.shapeId === shapeId);
  if (row === undefined) {
    throw new Error(`shape ${String(shapeId)} has no committed p25/p75 targets — measure it, do not skip it`);
  }
  return { p25: row.p25, p75: row.p75 };
}

describe('A9 partition — every traced garment is either re-authored or pinned legacy', () => {
  it('grades exactly the committed corpus: every generated shape is imported above', () => {
    // Directory-driven like the byte-identity gate (SESSION18 A4.2's lesson):
    // a shape added to generated/ without joining this gate goes red HERE.
    const onDisk = readdirSync(GENERATED_DIR)
      .map((f) => /^shape(\d+)\.ts$/.exec(f)?.[1])
      .filter((m): m is string => m !== undefined)
      .map(Number)
      .sort((a, b) => a - b);
    expect(ALL_SHAPES.map((s) => s.id).sort((a, b) => a - b)).toEqual(onDisk);
    expect(new Set(ALL_SHAPES.map((s) => s.id)).size).toBe(ALL_SHAPES.length);
    expect(path.isAbsolute(GENERATED_DIR)).toBe(true);
  });

  it('REAUTHORED and LEGACY together are exactly the traced shapes, with no overlap', () => {
    const tracedIds = TRACED.map((s) => s.id).sort((a, b) => a - b);
    const covered = [...REAUTHORED, ...Object.keys(LEGACY).map(Number)].sort((a, b) => a - b);
    expect(covered).toEqual(tracedIds);
    for (const id of REAUTHORED) {
      expect(LEGACY[id], `shape ${String(id)} is both re-authored and legacy`).toBeUndefined();
    }
  });

  it('MEASURED_FLAT names only traced garments', () => {
    const tracedIds = new Set(TRACED.map((s) => s.id));
    for (const id of MEASURED_FLAT) expect(tracedIds.has(id), `id ${String(id)}`).toBe(true);
  });
});

describe('A9 positive control — the grammar is how the ORIGINAL actually draws', () => {
  it('every OG fighter shape outlines with an ink stroke, except the two named', () => {
    for (const s of OG_SHAPES) {
      const g = grammarOf(s);
      if (s.id === SOLID_HAIR || s.id === RING_OUTLINED_FOOTTOP) continue;
      expect(g.inkStrokes, `shape ${String(s.id)} ink strokes`).toBeGreaterThanOrEqual(1);
      expect(g.inkFillRings, `shape ${String(s.id)} ink fill rings`).toBe(0);
    }
  });

  it('every OG ink-stroke width sits inside the bar the kickoff fixed, [0.5, 2.5]', () => {
    for (const s of OG_SHAPES) {
      for (const w of grammarOf(s).inkStrokeWidths) {
        expect(w, `shape ${String(s.id)} stroke width`).toBeGreaterThanOrEqual(BAR.strokeWidthMin);
        expect(w, `shape ${String(s.id)} stroke width`).toBeLessThanOrEqual(BAR.strokeWidthMax);
      }
    }
  });

  it('pins the two exemptions exactly, so a leak cannot hide behind them', () => {
    const hair = grammarOf(shapeOf(SOLID_HAIR));
    expect([hair.inkStrokes, hair.inkFillRings, hair.tones.length]).toEqual([0, 1, 0]);
    const foottop = grammarOf(shapeOf(RING_OUTLINED_FOOTTOP));
    expect([foottop.inkStrokes, foottop.inkFillRings, foottop.tones.length]).toEqual([0, 2, 2]);
  });

  it('two-tone is the OG norm: the multi-tone shapes, by id', () => {
    const multi = OG_SHAPES.filter((s) => grammarOf(s).tones.length >= 2)
      .map((s) => s.id)
      .sort((a, b) => a - b);
    expect(multi).toEqual([2641, 2644, 2646, 2648, 2650, 2653, 2658, 2667, 2672, 2678]);
  });

  it('shape 2653 carries the SWF cloth pair byte-exact — kickoff D4\'s source', () => {
    const tones = [...grammarOf(shapeOf(2653)).tones].sort((a, b) => a - b);
    expect(tones).toEqual([0x9e9a97, 0xdcd9d4]);
  });

  it('the ink-share bar is the OG\'s own worst non-hair part — 2674, just over 61%', () => {
    // Also the refactor guard: inkShareLib must reproduce the CLI's committed
    // numbers (61.4% worst, SESSION21 A8.3) or this pin goes red.
    expect(worstOg.id).toBe(2674);
    expect(worstOg.share).toBeGreaterThan(61);
    expect(worstOg.share).toBeLessThan(62);
  });
});

describe('A9-A/B/C/D — every re-authored garment obeys the grammar', () => {
  it('every roster shape passes all four gates, with zero violations', () => {
    for (const id of REAUTHORED) {
      const shape = shapeOf(id);
      const v = violationsOf(
        grammarOf(shape),
        inkShareOf(shape).share,
        targetsFor(id),
        MEASURED_FLAT.has(id),
        BAR,
      );
      expect(v, `shape ${String(id)} grammar violations`).toEqual([]);
    }
  });
});

describe('A9 legacy pins — a traced blob can only change by being re-authored', () => {
  it('every legacy shape matches its pin exactly: no strokes, the pinned ring and tone', () => {
    for (const [idText, pin] of Object.entries(LEGACY)) {
      const id = Number(idText);
      const g = grammarOf(shapeOf(id));
      const label = `shape ${String(id)} — edit means re-author: move it to REAUTHORED, do not tune the blob`;
      expect(g.strokeCount, label).toBe(0);
      expect(g.inkFillRings, label).toBe(pin.inkFillRings);
      expect([...g.tones].sort((a, b) => a - b), label).toEqual([...pin.tones].sort((a, b) => a - b));
    }
  });

  it('names the over-inked garments so the list can only shrink: 9001 and 9012', () => {
    // ⚠️ NOT an assertion that they pass A9-B — they do not, and A9.2 is the
    // step that fixes them. It pins WHICH legacy garments are over the OG's
    // own worst, exactly as the owner counted ("one or 2 of them").
    const over = TRACED.filter((s) => inkShareOf(s).share > BAR.maxInkShare)
      .map((s) => s.id)
      .sort((a, b) => a - b);
    expect(over).toEqual([9001, 9012]);
  });
});

describe('A9 instrument — violationsOf catches each defect class by name', () => {
  /** A minimal well-formed garment: base + shadow fills, one ink contour stroke. */
  const SQUARE = [0, 0, 10, 0, 10, 10, 0, 10];
  const baseFill: ArtShape['paints'][number] = {
    kind: 'fill',
    color: 0xc0bcbe,
    rings: [{ points: SQUARE, hole: false }],
  };
  const shadowFill: ArtShape['paints'][number] = {
    kind: 'fill',
    color: 0x8a8688,
    rings: [{ points: [0, 5, 10, 5, 10, 10, 0, 10], hole: false }],
  };
  const contour: ArtShape['paints'][number] = {
    kind: 'stroke',
    color: 0x000000,
    width: 2,
    polylines: [SQUARE],
  };
  const good: ArtShape = { id: 9999, paints: [baseFill, shadowFill, contour] };
  const targets: ToneTargets = { p25: [138, 134, 136], p75: [192, 188, 190] };
  const bar: GrammarBar = { ...BAR, maxInkShare: 61.4 };
  const okShare = 40;

  it('accepts the well-formed two-tone stroked garment', () => {
    expect(violationsOf(grammarOf(good), okShare, targets, false, bar)).toEqual([]);
  });

  it('rejects a missing ink stroke', () => {
    const noStroke: ArtShape = { id: 9999, paints: [baseFill, shadowFill] };
    const v = violationsOf(grammarOf(noStroke), okShare, targets, false, bar);
    expect(v.some((m) => m.includes('A9-A') && m.includes('stroke')), v.join(' | ')).toBe(true);
  });

  it('rejects an all-ink fill ring — the traced blob outline', () => {
    const blob: ArtShape = {
      id: 9999,
      paints: [{ kind: 'fill', color: 0x000000, rings: [{ points: SQUARE, hole: false }] }, ...good.paints],
    };
    const v = violationsOf(grammarOf(blob), okShare, targets, false, bar);
    expect(v.some((m) => m.includes('A9-A') && m.includes('ink fill ring')), v.join(' | ')).toBe(true);
  });

  it('rejects a stroke width outside [0.5, 2.5]', () => {
    const wide: ArtShape = {
      id: 9999,
      paints: [baseFill, shadowFill, { kind: 'stroke', color: 0x000000, width: 3, polylines: [SQUARE] }],
    };
    const v = violationsOf(grammarOf(wide), okShare, targets, false, bar);
    expect(v.some((m) => m.includes('A9-A') && m.includes('width')), v.join(' | ')).toBe(true);
  });

  it('rejects a single tone on a garment not measured flat, and allows it on one that is', () => {
    const flat: ArtShape = { id: 9999, paints: [baseFill, contour] };
    const strict = violationsOf(grammarOf(flat), okShare, { p25: [190, 186, 188], p75: [194, 190, 192] }, false, bar);
    expect(strict.some((m) => m.includes('A9-C')), strict.join(' | ')).toBe(true);
    const exempt = violationsOf(grammarOf(flat), okShare, { p25: [190, 186, 188], p75: [194, 190, 192] }, true, bar);
    expect(exempt).toEqual([]);
  });

  it('rejects a base tone more than 12 levels off its p75 target', () => {
    const off = violationsOf(grammarOf(good), okShare, { p25: [138, 134, 136], p75: [222, 218, 220] }, false, bar);
    expect(off.some((m) => m.includes('A9-D') && m.includes('base')), off.join(' | ')).toBe(true);
  });

  it('rejects a shadow tone more than 12 levels off its p25 target', () => {
    const off = violationsOf(grammarOf(good), okShare, { p25: [100, 96, 98], p75: [192, 188, 190] }, false, bar);
    expect(off.some((m) => m.includes('A9-D') && m.includes('shadow')), off.join(' | ')).toBe(true);
  });

  it('rejects an ink share over the OG\'s own worst', () => {
    const v = violationsOf(grammarOf(good), 70.6, targets, false, bar);
    expect(v.some((m) => m.includes('A9-B')), v.join(' | ')).toBe(true);
  });
});
