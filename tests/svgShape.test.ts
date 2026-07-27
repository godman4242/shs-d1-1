/**
 * SESSION 15 A2 — the SVG→polygon converter (`scripts/art/svgShape.ts`).
 *
 * Written RED-FIRST against hand-made fixtures (a triangle, a curve, a hole)
 * before the converter was pointed at any real art, exactly as SESSION15 §4 A2
 * requires. The real shapes are 100 % flat solid fill (FIGHTER_ART_IDS.md §2),
 * so the pressure here is geometry, not colour:
 *
 *   - dropped segments  → §2 diagnosis (b), a silently missing body part;
 *   - a wrong hole rule → filled eye sockets and solid mouths;
 *   - a wrong pivot     → §3.4's failure, in its subtler non-20× form.
 *
 * Every one of those is pinned as a NEGATIVE below.
 *
 * ⚠️ SESSION16 R2 (finding 4) — WHY THE REAL-ART TESTS ARE SPLIT IN TWO.
 * This file used to `readFileSync` a gitignored `reference/` SVG in a describe
 * CALLBACK BODY, which runs at COLLECTION time. In any checkout but the one
 * laptop that holds the extraction, that throw took the whole file down before a
 * single test ran: 44 tests vanished (639 → 595), `npm test` exited 1, and the
 * 36 fixture tests that need no reference art died as collateral. The push-time
 * CI workflow runs `npm test` on a bare `actions/checkout`, so this was not
 * hypothetical. Measured, before the fix:
 *     ❯ tests/svgShape.test.ts (0 test)
 *     Error: ENOENT … /freshclone/reference/extracted/shapes/2664.svg
 *     Test Files  1 failed | 39 passed (40) · Tests  595 passed (595)
 * So the split is:
 *   - THE COMMITTED ARTIFACT (`SHAPE_2664`) carries every assertion that is
 *     really about the ART, and runs everywhere. It is the converter's own
 *     output, committed, so it is the honest subject of those claims anyway.
 *   - RE-DERIVATION FROM THE SOURCE SVG is `describe.skipIf`-gated and reads the
 *     file LAZILY inside each `it`, never at collection time. It answers a
 *     different question — "does the converter still reproduce this?" — and can
 *     only be asked where the gitignored corpus exists.
 * Do not merge them back together, and do not add an ungated `reference/` read.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  classifyEvenOdd,
  convertFillPath,
  convertShapeSvg,
  flattenSubpath,
  interiorPoint,
  parsePath,
  pointInRing,
  type ShapeArt,
  type Subpath,
} from '../scripts/art/svgShape';
import { emit, TOLERANCE } from '../scripts/art/emit';
import { SHAPE_2664 } from '../src/game/art/generated/shape2664';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SHAPE_DIR = path.join(ROOT, 'reference', 'extracted', 'shapes');
/** `reference/` is gitignored — present on the extraction laptop, absent in CI. */
const HAVE_REFERENCE = existsSync(path.join(SHAPE_DIR, '2664.svg'));

/**
 * Paint accessors. `paints` is ONE ordered array (SESSION16 R2 finding 1), so
 * these narrow it by kind. Typed structurally rather than against one of the
 * declarations, so they serve both the converter's `ShapeArt` and the runtime
 * `ArtShape` — separate interfaces that describe the same emitted data.
 */
interface FillLike {
  readonly kind: 'fill';
  readonly color: number;
  readonly rings: ReadonlyArray<{ readonly points: readonly number[]; readonly hole: boolean }>;
}
interface StrokeLike {
  readonly kind: 'stroke';
  readonly color: number;
  readonly width: number;
  readonly polylines: ReadonlyArray<readonly number[]>;
}
interface ShapeLike {
  readonly paints: ReadonlyArray<FillLike | StrokeLike>;
}

const fillsOf = (shape: ShapeLike): FillLike[] => shape.paints.filter((p): p is FillLike => p.kind === 'fill');
const strokesOf = (shape: ShapeLike): StrokeLike[] =>
  shape.paints.filter((p): p is StrokeLike => p.kind === 'stroke');

/** Fail-closed accessors: the lint config bans both `!` and `x as T`. */
function first<T>(arr: readonly T[]): T {
  const v = arr.at(0);
  if (v === undefined) throw new Error('expected at least one element');
  return v;
}
function at(a: readonly number[], i: number): number {
  const v = a.at(i);
  if (v === undefined) throw new Error(`index ${String(i)} out of range`);
  return v;
}
const onlySubpath = (d: string): Subpath => first(parsePath(d));

/** Ring helpers — rings are flat [x0,y0,x1,y1,…]. */
const square = (x: number, y: number, s: number): number[] => [x, y, x + s, y, x + s, y + s, x, y + s];

/** Ground truth for a quadratic Bézier, used to grade the flattener. */
function quadAt(t: number, p: readonly number[]): [number, number] {
  const u = 1 - t;
  const [x0, y0, cx, cy, x1, y1] = [at(p, 0), at(p, 1), at(p, 2), at(p, 3), at(p, 4), at(p, 5)];
  return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1];
}

function distToPolyline(px: number, py: number, pts: readonly number[]): number {
  let best = Infinity;
  for (let i = 0; i + 3 < pts.length; i += 2) {
    const ax = at(pts, i);
    const ay = at(pts, i + 1);
    const bx = at(pts, i + 2);
    const by = at(pts, i + 3);
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
    best = Math.min(best, Math.hypot(px - (ax + t * dx), py - (ay + t * dy)));
  }
  return best;
}

describe('parsePath: SVG path data → subpaths', () => {
  it('parses the triangle fixture, closed, with two line segments', () => {
    const subs = parsePath('M0 0 L10 0 L0 10 Z');
    expect(subs).toHaveLength(1);
    const s = first(subs);
    expect([s.startX, s.startY]).toEqual([0, 0]);
    expect(s.closed).toBe(true);
    expect(s.segs).toEqual([
      { kind: 'L', x: 10, y: 0 },
      { kind: 'L', x: 0, y: 10 },
    ]);
  });

  it('parses the curve fixture', () => {
    const subs = parsePath('M0 0 Q5 10 10 0');
    expect(subs[0]?.segs).toEqual([{ kind: 'Q', cx: 5, cy: 10, x: 10, y: 0 }]);
  });

  // FFDec omits the repeated command letter — 'L1 2 3 4' is TWO segments.
  // Reading it as one would silently delete geometry (§2 diagnosis (b)).
  it('expands IMPLICIT repeated L commands into separate segments', () => {
    expect(parsePath('M0 0 L1 2 3 4')[0]?.segs).toEqual([
      { kind: 'L', x: 1, y: 2 },
      { kind: 'L', x: 3, y: 4 },
    ]);
  });

  it('expands IMPLICIT repeated Q commands into separate segments', () => {
    expect(parsePath('M0 0 Q1 1 2 2 3 3 4 4')[0]?.segs).toEqual([
      { kind: 'Q', cx: 1, cy: 1, x: 2, y: 2 },
      { kind: 'Q', cx: 3, cy: 3, x: 4, y: 4 },
    ]);
  });

  it('splits multiple subpaths on each M', () => {
    const subs = parsePath('M0 0 L1 0 M5 5 L6 5');
    expect(subs).toHaveLength(2);
    expect([subs[1]?.startX, subs[1]?.startY]).toEqual([5, 5]);
  });

  it('accepts commas and negative numbers as separators', () => {
    expect(parsePath('M-1.5,-2.5L3.5,-4.5')[0]?.segs).toEqual([{ kind: 'L', x: 3.5, y: -4.5 }]);
  });

  // FAIL CLOSED. Silently skipping a command we do not model is exactly how a
  // body part goes missing while every test stays green.
  it.each(['C', 'A', 'S', 'T', 'H', 'V', 'm', 'l', 'q'])('THROWS on unsupported command %s', (cmd) => {
    expect(() => parsePath(`M0 0 ${cmd}1 2 3 4 5 6 7`)).toThrow(/unsupported|command/i);
  });

  it('THROWS on a truncated coordinate list rather than inventing a zero', () => {
    expect(() => parsePath('M0 0 L1')).toThrow();
    expect(() => parsePath('M0 0 Q1 2 3')).toThrow();
  });

  it('THROWS when the path does not open with a moveto', () => {
    expect(() => parsePath('L1 2')).toThrow();
  });
});

describe('flattenSubpath: quadratics → polylines', () => {
  const straight = onlySubpath('M0 0 L10 0 L10 10');
  const curve = onlySubpath('M0 0 Q10 0 10 10');

  it('leaves straight segments exactly alone (no invented vertices)', () => {
    expect(flattenSubpath(straight, 0.1)).toEqual([0, 0, 10, 0, 10, 10]);
  });

  it('subdivides a curve and stays within tolerance of the true Bézier', () => {
    const tol = 0.05;
    const pts = flattenSubpath(curve, tol);
    expect(pts.length).toBeGreaterThan(6);
    for (let i = 0; i <= 200; i++) {
      const [x, y] = quadAt(i / 200, [0, 0, 10, 0, 10, 10]);
      expect(distToPolyline(x, y, pts)).toBeLessThanOrEqual(tol);
    }
  });

  it('keeps the exact endpoints', () => {
    const pts = flattenSubpath(curve, 0.05);
    expect([pts[0], pts[1]]).toEqual([0, 0]);
    expect([pts.at(-2), pts.at(-1)]).toEqual([10, 10]);
  });

  it('a tighter tolerance yields strictly more vertices', () => {
    expect(flattenSubpath(curve, 0.01).length).toBeGreaterThan(flattenSubpath(curve, 0.5).length);
  });

  it('does not duplicate the start point when a ring is closed', () => {
    const ring = onlySubpath('M0 0 L10 0 L10 10 Z');
    expect(flattenSubpath(ring, 0.1)).toEqual([0, 0, 10, 0, 10, 10]);
  });
});

describe('pointInRing / interiorPoint', () => {
  it('ray-casts a square correctly', () => {
    const s = square(0, 0, 10);
    expect(pointInRing(5, 5, s)).toBe(true);
    expect(pointInRing(15, 5, s)).toBe(false);
    expect(pointInRing(5, -3, s)).toBe(false);
  });

  it('is winding-agnostic', () => {
    const cw = square(0, 0, 10);
    const ccw = [at(cw, 6), at(cw, 7), at(cw, 4), at(cw, 5), at(cw, 2), at(cw, 3), at(cw, 0), at(cw, 1)];
    expect(pointInRing(5, 5, ccw)).toBe(true);
  });

  // A centroid is NOT good enough: for a U the centroid falls in the notch.
  it('returns a point strictly INSIDE a concave U (centroid would miss)', () => {
    const u = [0, 0, 10, 0, 10, 10, 6, 10, 6, 4, 4, 4, 4, 10, 0, 10];
    const [x, y] = interiorPoint(u);
    expect(pointInRing(x, y, u)).toBe(true);
  });
});

describe('classifyEvenOdd: the HOLE fixture', () => {
  // REGRESSION (found red during A2): probing from interiorPoint() classified
  // the OUTER ring as a hole, because the centre of a square-with-a-hole lies
  // inside the hole. Nesting must be probed from the boundary.
  it('does not let a hole swallow the ring that contains it', () => {
    const [outer] = classifyEvenOdd([square(0, 0, 10), square(3, 3, 4)]);
    expect(outer).toBe(false);
  });

  it('marks a ring nested inside another as a hole', () => {
    expect(classifyEvenOdd([square(0, 0, 10), square(3, 3, 4)])).toEqual([false, true]);
  });

  it('is order-independent (hole listed first)', () => {
    expect(classifyEvenOdd([square(3, 3, 4), square(0, 0, 10)])).toEqual([true, false]);
  });

  it('treats disjoint rings as two solids, not a hole', () => {
    expect(classifyEvenOdd([square(0, 0, 5), square(20, 20, 5)])).toEqual([false, false]);
  });

  /**
   * SESSION16 R2 finding 3 (kickoff seeded suspect 5). `boundaryProbe` bets the
   * whole verdict on ONE point — the midpoint of the ring's longest edge — and
   * its docstring names the wrong hazard: it worries about hitting another
   * ring's VERTEX, when FFDec's even-odd output routinely tessellates abutting
   * regions of one path along a byte-identical shared EDGE, which is frequently
   * the longest. The probe then lands exactly ON a sibling's edge, and
   * `pointInRing` has no on-boundary tolerance: a coincident horizontal edge
   * contributes no crossing while the sibling's vertical edge at that y
   * contributes one, so depth = 1 and a fully SOLID region is emitted as
   * hole: true — the renderer punches transparency through opaque colour.
   *
   * Measured on real art: 24 rings across 19 shapes come back wrong, up to
   * 345 px² on shape 2865 and 48.8 % of a fill on 689, and the gap survives
   * painter's-order compositing, so no later fill repaints it. The 16 fighter
   * shapes are CLEAN (0 mismatches, nearest probe-to-sibling 0.0534 px), which
   * is why nothing visible is wrong today.
   */
  // The other half of the shared-edge fix, and its own guard: when EVERY edge
  // midpoint of a ring lies on a sibling, the two are coincident and nesting has
  // no answer. It must fail closed rather than guess, per this converter's
  // contract — a guess punches transparency through solid colour.
  it('THROWS on a ring that lies entirely on a sibling rather than guessing', () => {
    const s = square(0, 0, 10);
    expect(() => classifyEvenOdd([s, [...s]])).toThrow(/entirely on a sibling/i);
  });

  it('treats two rings SHARING A BORDER as two solids, either way round', () => {
    // The shared edge is deliberately each ring's longest, so the first-longest
    // tie-break lands the probe exactly on it — real shape 1318's mechanism.
    const below = [0, 0, 10, 0, 10, -10, 0, -10];
    const above = [0, 0, 10, 0, 10, 10, 0, 10];
    expect(classifyEvenOdd([below, above])).toEqual([false, false]);
    expect(classifyEvenOdd([above, below])).toEqual([false, false]);
  });

  // Even-odd, not nonzero: an island inside a hole fills again.
  it('alternates through three levels of nesting', () => {
    expect(classifyEvenOdd([square(0, 0, 30), square(5, 5, 20), square(10, 10, 10)])).toEqual([
      false,
      true,
      false,
    ]);
  });
});

describe('convertFillPath: the hole fixture end to end', () => {
  it('turns a square-with-a-square-hole path into one solid + one hole ring', () => {
    const rings = convertFillPath('M0 0 L10 0 L10 10 L0 10 Z M3 3 L7 3 L7 7 L3 7 Z', 0.1);
    expect(rings.map((r) => r.hole)).toEqual([false, true]);
    expect(rings[0]?.points).toEqual([0, 0, 10, 0, 10, 10, 0, 10]);
  });

  it('drops degenerate there-and-back subpaths that enclose no area', () => {
    // FFDec emits these for crease detail; kept, they would punch phantom holes.
    const rings = convertFillPath('M0 0 L10 0 L10 10 L0 10 Z M2 2 L5 5 L2 2 Z', 0.1);
    expect(rings).toHaveLength(1);
  });

  // The short fixture above is caught by the vertex-count check BEFORE the
  // zero-area check ever runs — planting a break in the area filter left it
  // green. This one has four distinct vertices and zero area, so it can only
  // be rejected by the area filter itself.
  it('drops a MULTI-VERTEX zero-area spur (the area filter, not the count)', () => {
    const rings = convertFillPath('M0 0 L10 0 L10 10 L0 10 Z M2 2 L5 2 L8 2 L5 2 Z', 0.1);
    expect(rings).toHaveLength(1);
  });

  // SESSION16 R2 finding 3, end to end: the shared-border rings above, as a real
  // fill path. Two abutting rectangles are two solids, never a hole.
  it('does not turn an abutting rectangle into a hole', () => {
    const rings = convertFillPath('M0 10 L20 10 L20 0 L0 0 Z M0 10 L20 10 L20 20 L0 20 Z', 0.1);
    expect(rings.map((r) => r.hole)).toEqual([false, false]);
  });
});

/**
 * SESSION16 R2 finding 6 — WELD had no test anywhere in its plausible range.
 * Mutation-tested: WELD = 1 punches a phantom hole through the committed head
 * and deletes 24 of the 86 fighter rings, and the full 639-test suite stayed
 * GREEN even after regenerating the committed artifact from the mutant. These
 * three fixtures are what make the constant load-bearing. Verified against every
 * mutant: pristine 3 pass · WELD=0 → A and C red · 1e-3 and 1e-2 → all green
 * (both are provably output-identical to shipped, so the pin does not
 * over-constrain) · 0.1 and 1 → B red · strip removed → C red.
 */
describe('weld: the WELD distance itself', () => {
  it('welds an EXACTLY coincident duplicate vertex', () => {
    expect(first(convertFillPath('M0 0 L10 0 L10 0 L10 10 L0 10 Z', 0.02)).points).toEqual([
      0, 0, 10, 0, 10, 10, 0, 10,
    ]);
  });

  // The parts are 9–37 px tall and the emitter flattens at 0.02 px, so a 0.03 px
  // pair is REAL geometry, not float noise.
  it('keeps a 0.03 px apart pair — they are TWO real vertices', () => {
    expect(first(convertFillPath('M0 0 L10 0 L10 10 L9.97 10.03 L0 10 Z', 0.02)).points).toEqual([
      0, 0, 10, 0, 10, 10, 9.97, 10.03, 0, 10,
    ]);
  });

  it('strips a trailing vertex that repeats the start', () => {
    expect(first(convertFillPath('M0 0 L10 0 L10 10 L0 0 Z', 0.02)).points).toEqual([0, 0, 10, 0, 10, 10]);
  });
});

/**
 * RE-DERIVATION from the gitignored source SVG — the question "does the
 * converter still reproduce this shape?", which only the extraction laptop can
 * ask. Gated AND lazy: `skipIf` stops the bodies running, and the read lives
 * inside `realArt()` rather than in this callback, so collection cannot throw
 * even if a future vitest walks skipped suites. See the file header (finding 4).
 *
 * The assertions about the ART itself live in the committed-artifact describe
 * below, which runs everywhere.
 */
describe.skipIf(!HAVE_REFERENCE)('convertShapeSvg: re-derives a REAL part shape (2664, the head)', () => {
  let cached: ShapeArt | undefined;
  /** Lazy + memoised: the read happens inside the first `it`, never at collection. */
  const art = (): ShapeArt =>
    (cached ??= convertShapeSvg(readFileSync(path.join(SHAPE_DIR, '2664.svg'), 'utf8'), 2664, 0.05));

  it('recovers the fill colour BYTE-EXACT from the SVG (§2 bar B)', () => {
    expect(fillsOf(art()).map((f) => f.color)).toEqual([0xffcc99]);
  });

  it('recovers both black stroke passes with their widths', () => {
    expect(strokesOf(art()).map((s) => s.color)).toEqual([0x000000, 0x000000]);
    expect(strokesOf(art()).every((s) => s.width > 0)).toBe(true);
  });

  /**
   * SESSION16 R2 finding 1, on the real file: 2664's document order is F S S, so
   * fills-then-strokes happens to be right here — which is exactly why the bug
   * was invisible. Pinning it means a future reordering of the emitter cannot
   * silently invert the one shape we can check against the source.
   */
  it('keeps the SVG document order — 2664 is fill, outline, crease', () => {
    expect(art().paints.map((p) => p.kind)).toEqual(['fill', 'stroke', 'stroke']);
  });

  // FFDec bumps hairlines to 1.0 for on-screen legibility and records the real
  // width in ffdec:original-stroke-width. Taking the bumped value would draw
  // the OG's fine crease lines at twice their true weight.
  it('prefers ffdec:original-stroke-width over the legibility-bumped one', () => {
    expect(strokesOf(art()).map((s) => s.width)).toEqual([1.5, 0.5]);
  });

  /**
   * The ONLY assertion in the repo that can catch the converter drifting away
   * from the art the game actually draws (SESSION16 R2 finding 5). Everything
   * else checks the artifact against itself. It also finally references
   * TOLERANCE from a test — the emitter constants were unpinned, so changing
   * TOLERANCE to 1.0 or DECIMALS to 1 used to leave all 639 tests green.
   */
  it('re-deriving from the source SVG reproduces the committed file BYTE FOR BYTE', () => {
    const rederived = emit(convertShapeSvg(readFileSync(path.join(SHAPE_DIR, '2664.svg'), 'utf8'), 2664, TOLERANCE));
    expect(rederived).toBe(readFileSync(path.join(ROOT, 'src', 'game', 'art', 'generated', 'shape2664.ts'), 'utf8'));
  });

  /**
   * SESSION18 A4.2 — the same check, for EVERY committed shape rather than the
   * one the test was written around.
   *
   * The ratchet's provenance gates read each artifact's header against its own
   * data, so they catch tampering but — as their own docstring says — "can never
   * catch a CONVERTER bug". Until A4.2 that left `2664` as the only shape any
   * gate could hold the converter to, and A4.2 commits THIRTEEN more. A shape
   * whose `.ts` was emitted by an older converter, or hand-edited after
   * emission, is otherwise indistinguishable from a correct one.
   *
   * Directory-driven on purpose: a shape added later is covered the moment it
   * lands, with nobody having to remember to extend a list.
   */
  it('re-derives EVERY committed generated shape byte for byte, not just 2664', () => {
    const dir = path.join(ROOT, 'src', 'game', 'art', 'generated');
    const files = readdirSync(dir).filter((f) => /^shape\d+\.ts$/.test(f)).sort();

    expect(files.length, 'no generated art found — the glob or the directory moved').toBeGreaterThan(0);

    const drifted = files.filter((file) => {
      const id = Number(/^shape(\d+)\.ts$/.exec(file)?.[1]);
      const svg = readFileSync(path.join(SHAPE_DIR, `${String(id)}.svg`), 'utf8');
      return emit(convertShapeSvg(svg, id, TOLERANCE)) !== readFileSync(path.join(dir, file), 'utf8');
    });

    expect(drifted, 'committed art that the converter no longer reproduces').toEqual([]);
  });

  // Found by eye, not by a test: the converted head had a visible NOTCH at the
  // crown. FFDec writes the outline as an OPEN path whose last point happens to
  // equal its first, with no `Z`; weld() strips that duplicate, leaving the
  // stroke one segment short of closing. Fills are unaffected (implicitly
  // closed) — only strokes show it, as a gap in the OG's heavy black outline.
  it('closes an outline whose path returns to its start without a Z', () => {
    const outline = strokesOf(art())[0]?.polylines[0] ?? [];
    expect(outline.length).toBeGreaterThan(8);
    expect([outline.at(0), outline.at(1)]).toEqual([outline.at(-2), outline.at(-1)]);
  });

  it('does NOT close an outline that genuinely ends elsewhere', () => {
    // the ear crease: starts at (2.75,-4.05), ends at (2.45,-1.75)
    const crease = strokesOf(art())[1]?.polylines[0] ?? [];
    expect(crease.length).toBeGreaterThan(4);
    expect([crease.at(0), crease.at(1)]).not.toEqual([crease.at(-2), crease.at(-1)]);
  });

  it('emits no NaN anywhere', () => {
    const all = [
      ...fillsOf(art()).flatMap((f) => f.rings.flatMap((r) => [...r.points])),
      ...strokesOf(art()).flatMap((s) => s.polylines.flat()),
      // Widths are numbers the emitter writes out too, and a non-numeric
      // stroke-width used to become `width: NaN` in the committed file with no
      // throw. The old version of this test only walked coordinates.
      ...strokesOf(art()).map((s) => s.width),
    ];
    expect(all.length).toBeGreaterThan(0);
    expect(all.every(Number.isFinite)).toBe(true);
  });
});

/**
 * SESSION16 R2 finding 1 — PAINT ORDER IS DATA, and it used to be discarded.
 *
 * The converter walked `<path>` elements in document order but pushed into two
 * separate accumulators, and no type in the chain carried an index, so the
 * emitted contract could only ever say "all fills, then all strokes".
 *
 * That is not what the SWF says. Shape 2662 — one of the 16 fighter shapes — has
 * document order `S F F F F F F F F S`: a 2.5 px black stroke FIRST, then eight
 * face fills. The OG paints that outline UNDERNEATH the flesh, so only its outer
 * ~1.25 px shows. Promoting it above the fills stamps the full band on top:
 * scored against FFDec's own 16× PNG render of 2662, document order agreed on
 * 44513/44513 opaque pixels and fills-then-strokes on 32952 — 26.2 % of the
 * shape's ink turned black, swallowing the nose, lips and jawline. The order is
 * authored, not an FFDec artifact: the DefineShape4 bitstream carries a
 * StateNewStyles record between the two groups. 132 of the 1822 exports put a
 * stroke before a fill and 162 genuinely interleave, so no fills-then-strokes
 * sort could ever reconstruct it.
 */
describe('convertShapeSvg: paint order — a SWF style group is a z-order', () => {
  it('keeps an UNDER-FILL stroke UNDER the fill — the shape 2662 pattern', () => {
    const svg = `<svg><g transform="matrix(1.0, 0.0, 0.0, 1.0, 2.0, 2.0)">
      <path d="M0 0 L10 0 L10 10 L0 10 Z" fill="none" stroke="#000000" stroke-width="4"/>
      <path d="M0 0 L10 0 L10 10 L0 10 Z" fill="#ffcc99" stroke="none"/>
      </g></svg>`;
    expect(convertShapeSvg(svg, 9999, 0.05).paints.map((p) => p.kind)).toEqual(['stroke', 'fill']);
  });

  // The harmless direction, so the fix cannot pass by simply inverting everything.
  it('keeps a fill-then-stroke shape in that order', () => {
    const svg = `<svg><g transform="matrix(1.0, 0.0, 0.0, 1.0, 0, 0)">
      <path d="M0 0 L10 0 L10 10 L0 10 Z" fill="#ffcc99" stroke="none"/>
      <path d="M0 0 L10 0 L10 10 L0 10 Z" fill="none" stroke="#000000" stroke-width="1.5"/>
      </g></svg>`;
    expect(convertShapeSvg(svg, 9997, 0.05).paints.map((p) => p.kind)).toEqual(['fill', 'stroke']);
  });

  // One path carrying both: FFDec emits fill and line within a single style
  // group, and a group's strokes draw over its own fills, so fill comes first.
  it('emits a fill-and-stroke path as fill first, then its own stroke', () => {
    const svg = `<svg><g transform="matrix(1.0, 0.0, 0.0, 1.0, 0, 0)">
      <path d="M0 0 L10 0 L10 10 Z" fill="#ff0000" stroke="#000000" stroke-width="1"/>
      </g></svg>`;
    expect(convertShapeSvg(svg, 9996, 0.05).paints.map((p) => p.kind)).toEqual(['fill', 'stroke']);
  });

  // Eleven alternations occur in the real corpus; two is enough to pin the rule.
  it('preserves a genuine F S F S interleave', () => {
    const svg = `<svg><g transform="matrix(1.0, 0.0, 0.0, 1.0, 0, 0)">
      <path d="M0 0 L10 0 L10 10 L0 10 Z" fill="#111111" stroke="none"/>
      <path d="M0 0 L10 0" fill="none" stroke="#222222" stroke-width="1"/>
      <path d="M0 0 L10 0 L10 10 L0 10 Z" fill="#333333" stroke="none"/>
      <path d="M0 0 L10 0" fill="none" stroke="#444444" stroke-width="1"/>
      </g></svg>`;
    const paints = convertShapeSvg(svg, 9995, 0.05).paints;
    expect(paints.map((p) => p.kind)).toEqual(['fill', 'stroke', 'fill', 'stroke']);
    expect(paints.map((p) => p.color)).toEqual([0x111111, 0x222222, 0x333333, 0x444444]);
  });
});

describe('convertShapeSvg: fail-closed on anything it cannot see', () => {
  // The path matcher only recognises SELF-CLOSING <path/>. FFDec always emits
  // that form, but "the parser silently returned nothing" is the single worst
  // failure mode this converter has — it is §2 diagnosis (b) with no symptom
  // until someone notices a limb is missing. So a shape that yields fewer
  // parsed paths than the file contains must THROW, not shrug.
  it('THROWS when a <path> element is present but unparsed', () => {
    const svg = `<svg><g transform="matrix(1.0, 0.0, 0.0, 1.0, 0, 0)">
      <path d="M0 0 L10 0 L10 10 Z" fill="#ff0000" stroke="none"></path>
      </g></svg>`;
    expect(() => convertShapeSvg(svg, 1, 0.05)).toThrow(/path/i);
  });

  it('THROWS on a shape that yields no geometry at all', () => {
    expect(() => convertShapeSvg('<svg><g/></svg>', 1, 0.05)).toThrow();
  });

  /**
   * SESSION16 R2, found by re-planting A2's guards after the refactor: THIS
   * GUARD HAD NO TEST. Neutering the `<g>` purity check left all 44 tests green
   * — the third time on this project that a plant found a guard nobody had ever
   * watched fail.
   *
   * It is the guard the whole shape-local pivot claim rests on. The converter
   * IGNORES the wrapper translate because FFDec's `d` data is already
   * shape-local with the joint pivot at (0,0); if that `<g>` ever carried a
   * scale or a rotation, the data would NOT be shape-local, the translate could
   * not be discarded, and every animation node in A4 would place its part
   * wrongly — §3.4's failure in its quiet form.
   */
  it('THROWS when the wrapper <g> carries a SCALE — the data would not be shape-local', () => {
    const svg = `<svg><g transform="matrix(2.0, 0.0, 0.0, 2.0, 5, 5)">
      <path d="M0 0 L10 0 L10 10 Z" fill="#ff0000" stroke="none"/>
      </g></svg>`;
    expect(() => convertShapeSvg(svg, 1, 0.05)).toThrow(/pure translation/i);
  });

  it('THROWS when the wrapper <g> carries a ROTATION', () => {
    const svg = `<svg><g transform="matrix(0.0, 1.0, -1.0, 0.0, 0, 0)">
      <path d="M0 0 L10 0 L10 10 Z" fill="#ff0000" stroke="none"/>
      </g></svg>`;
    expect(() => convertShapeSvg(svg, 1, 0.05)).toThrow(/pure translation/i);
  });

  // The other half of the same rule: a pure translation with a real offset is
  // ACCEPTED and its offset IGNORED. Without this, "throw on everything"
  // would satisfy the two tests above.
  it('ACCEPTS a pure translation and discards its offset', () => {
    const svg = `<svg><g transform="matrix(1.0, 0.0, 0.0, 1.0, 7.0, 9.0)">
      <path d="M0 0 L10 0 L10 10 Z" fill="#ff0000" stroke="none"/>
      </g></svg>`;
    const ring = fillsOf(convertShapeSvg(svg, 1, 0.05))[0]?.rings[0]?.points ?? [];
    expect(ring).toEqual([0, 0, 10, 0, 10, 10]);
  });

  // SESSION16 R2 — a guard added in the same session as its own test, because
  // `Number('thin')` is NaN and `width: NaN` used to reach the committed file.
  it('THROWS on a non-numeric stroke width rather than emitting NaN', () => {
    const svg = `<svg><g transform="matrix(1.0, 0.0, 0.0, 1.0, 0, 0)">
      <path d="M0 0 L10 0" fill="none" stroke="#000000" stroke-width="thin"/>
      </g></svg>`;
    expect(() => convertShapeSvg(svg, 1, 0.05)).toThrow(/stroke width/i);
  });

  it('THROWS on a zero stroke width', () => {
    const svg = `<svg><g transform="matrix(1.0, 0.0, 0.0, 1.0, 0, 0)">
      <path d="M0 0 L10 0" fill="none" stroke="#000000" stroke-width="0"/>
      </g></svg>`;
    expect(() => convertShapeSvg(svg, 1, 0.05)).toThrow(/stroke width/i);
  });

  // The empty "none" placeholders (hat7000, weapon13000, …) are SPRITES with no
  // shape at all, so they never reach this function — there is no SVG for them.
  it('still accepts a normal self-closing shape', () => {
    const svg = `<svg><g transform="matrix(1.0, 0.0, 0.0, 1.0, 0, 0)">
      <path d="M0 0 L10 0 L10 10 Z" fill="#ff0000" stroke="none"/>
      </g></svg>`;
    expect(fillsOf(convertShapeSvg(svg, 1, 0.05))).toHaveLength(1);
  });

  /**
   * SESSION16 R2 finding 2 — ALPHA WAS SILENTLY DISCARDED, in a file whose
   * stated contract is that everything unsupported fails closed. FFDec writes
   * the SWF's fill alpha as `fill-opacity`; nothing in the art path ever read
   * it, and `ArtFill`/`ArtStroke` have no channel to hold it, so 130 corpus
   * shapes converted without complaint into fully OPAQUE art — including eight
   * carrying a 100 %-invisible paint that would have become fully visible.
   *
   * The fix THROWS rather than adding an alpha field: no shape in the current
   * import set needs alpha (all 16 fighter shapes are free of it, checked), and
   * adding the field would change the emitted format and commit the not-yet-
   * written renderer to honouring it, for zero present benefit. Gradients (D3)
   * and bitmap fills (D4) already fail closed the same way. When a shape that
   * needs alpha arrives, implement it deliberately, with the renderer.
   */
  it('THROWS on a translucent fill — alpha has no field to live in', () => {
    const svg = `<svg><g transform="matrix(1.0, 0.0, 0.0, 1.0, 0, 0)">
      <path d="M3 19 L3 3 L19 3 L19 19 Z" fill="#333333" fill-opacity="0.0" stroke="none"/>
      </g></svg>`;
    expect(() => convertShapeSvg(svg, 1221, 0.05)).toThrow(/opacity/i);
  });

  it('THROWS on a translucent stroke', () => {
    const svg = `<svg><g transform="matrix(1.0, 0.0, 0.0, 1.0, 0, 0)">
      <path d="M0 0 L10 0" fill="none" stroke="#fefe56" stroke-opacity="0.5" stroke-width="8.0"/>
      </g></svg>`;
    expect(() => convertShapeSvg(svg, 2529, 0.05)).toThrow(/opacity/i);
  });

  // Guards the other direction: the throw must not fire on an explicit full
  // opacity, or the converter would reject art it handles perfectly well.
  it('still accepts an explicitly FULLY-OPAQUE opacity', () => {
    const svg = `<svg><g transform="matrix(1.0, 0.0, 0.0, 1.0, 0, 0)">
      <path d="M0 0 L10 0 L10 10 Z" fill="#ff0000" fill-opacity="1" stroke="none"/>
      </g></svg>`;
    expect(fillsOf(convertShapeSvg(svg, 1, 0.05))).toHaveLength(1);
  });
});

/**
 * THE COMMITTED ARTIFACT — the art the game actually draws. Runs in every clone
 * (finding 4): it imports `SHAPE_2664` and touches no gitignored file, so these
 * are the assertions CI can actually enforce. The re-derivation describe above
 * asks the different question of whether the converter still reproduces it.
 */
describe('the committed head artifact (SHAPE_2664)', () => {
  it('is one solid fill and two black strokes, in the OG paint order', () => {
    expect(SHAPE_2664.paints.map((p) => p.kind)).toEqual(['fill', 'stroke', 'stroke']);
    expect(fillsOf(SHAPE_2664).map((f) => f.color)).toEqual([0xffcc99]);
    expect(strokesOf(SHAPE_2664).map((s) => s.color)).toEqual([0x000000, 0x000000]);
    expect(strokesOf(SHAPE_2664).map((s) => s.width)).toEqual([1.5, 0.5]);
  });

  // The visual defect named directly: the OG's skin is solid. A hole here is a
  // see-through face, and this is the assertion a wrong hole rule trips over.
  it('has NO holes — the head is solid skin', () => {
    expect(fillsOf(SHAPE_2664).flatMap((f) => f.rings).map((r) => r.hole)).toEqual([false]);
  });

  /**
   * SESSION16 R2 finding 7 — the old bounds test was one-sided in the direction
   * that permits shrinkage. All four of its assertions constrained the bounding
   * box to sit INSIDE the header window and none required it to FILL it, so the
   * head could shrink to a 0.64 × 0.76 px speck, or slip its pivot by ±1.5 px,
   * and stay green — including the "subtler non-20× units error" that §3.4 and
   * this file's own docblock both claim is pinned. It was not.
   *
   * The header box in shape-local coords is x[-3.9, 10.4] y[-11.85, 5.1] (width
   * 14.3, height 16.95, origin offset 3.9, 11.85). FFDec's box is the INKED
   * extent, so the FILL sits inset by the widest stroke's half-width; measured
   * at 0.75–0.90 px across all 16 fighter shapes, hence the 0.95 allowance.
   */
  it('FILLS the header box — a shrink or a pivot slip cannot hide', () => {
    const pts = fillsOf(SHAPE_2664).flatMap((f) => f.rings).flatMap((r) => [...r.points]);
    const xs = pts.filter((_, i) => i % 2 === 0);
    const ys = pts.filter((_, i) => i % 2 === 1);
    const REACH = 1.5 / 2 + 0.2;
    expect(pts.length).toBeGreaterThan(80);
    // inside the box (the old assertions) …
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(-3.9 - 0.8);
    expect(Math.max(...xs)).toBeLessThanOrEqual(14.3 - 3.9 + 0.8);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(-11.85 - 0.8);
    expect(Math.max(...ys)).toBeLessThanOrEqual(16.95 - 11.85 + 0.8);
    // … AND reaching every edge of it, which is the half that was missing.
    expect(Math.min(...xs)).toBeLessThanOrEqual(-3.9 + REACH);
    expect(Math.max(...xs)).toBeGreaterThanOrEqual(14.3 - 3.9 - REACH);
    expect(Math.min(...ys)).toBeLessThanOrEqual(-11.85 + REACH);
    expect(Math.max(...ys)).toBeGreaterThanOrEqual(16.95 - 11.85 - REACH);
  });

  it('keeps the joint pivot at (0,0) — coordinates straddle the origin', () => {
    const pts = fillsOf(SHAPE_2664).flatMap((f) => f.rings).flatMap((r) => [...r.points]);
    const xs = pts.filter((_, i) => i % 2 === 0);
    const ys = pts.filter((_, i) => i % 2 === 1);
    expect(Math.min(...xs)).toBeLessThan(0);
    expect(Math.max(...xs)).toBeGreaterThan(0);
    expect(Math.min(...ys)).toBeLessThan(0);
    expect(Math.max(...ys)).toBeGreaterThan(0);
  });

  it('holds no NaN or Infinity, coordinates and widths alike', () => {
    const all = [
      ...fillsOf(SHAPE_2664).flatMap((f) => f.rings).flatMap((r) => [...r.points]),
      ...strokesOf(SHAPE_2664).flatMap((s) => s.polylines.flatMap((p) => [...p])),
      ...strokesOf(SHAPE_2664).map((s) => s.width),
    ];
    expect(all.length).toBeGreaterThan(0);
    expect(all.every(Number.isFinite)).toBe(true);
  });

  it('closes the outline and leaves the ear crease open', () => {
    const outline = strokesOf(SHAPE_2664)[0]?.polylines[0] ?? [];
    expect([outline.at(0), outline.at(1)]).toEqual([outline.at(-2), outline.at(-1)]);
    const crease = strokesOf(SHAPE_2664)[1]?.polylines[0] ?? [];
    expect([crease.at(0), crease.at(1)]).not.toEqual([crease.at(-2), crease.at(-1)]);
  });
});
