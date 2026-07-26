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
 */
import { readFileSync } from 'node:fs';
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
  type Subpath,
} from '../scripts/art/svgShape';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SHAPE_DIR = path.join(ROOT, 'reference', 'extracted', 'shapes');

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
});

describe('convertShapeSvg: a REAL part shape (2664, the head)', () => {
  const svg = readFileSync(path.join(SHAPE_DIR, '2664.svg'), 'utf8');
  const art = convertShapeSvg(svg, 2664, 0.05);

  it('recovers the fill colour BYTE-EXACT from the SVG (§2 bar B)', () => {
    expect(art.fills.map((f) => f.color)).toEqual([0xffcc99]);
  });

  it('recovers both black stroke passes with their widths', () => {
    expect(art.strokes.map((s) => s.color)).toEqual([0x000000, 0x000000]);
    expect(art.strokes.every((s) => s.width > 0)).toBe(true);
  });

  // FFDec bumps hairlines to 1.0 for on-screen legibility and records the real
  // width in ffdec:original-stroke-width. Taking the bumped value would draw
  // the OG's fine crease lines at twice their true weight.
  it('prefers ffdec:original-stroke-width over the legibility-bumped one', () => {
    expect(art.strokes.map((s) => s.width)).toEqual([1.5, 0.5]);
  });

  it('produces a non-trivial outline whose bounds match the SVG header', () => {
    const pts = art.fills[0]?.rings[0]?.points ?? [];
    expect(pts.length).toBeGreaterThan(40);
    const xs = pts.filter((_, i) => i % 2 === 0);
    const ys = pts.filter((_, i) => i % 2 === 1);
    // header: width 14.3 height 16.95, origin offset (3.9, 11.85)
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(-3.9 - 0.8);
    expect(Math.max(...xs)).toBeLessThanOrEqual(14.3 - 3.9 + 0.8);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(-11.85 - 0.8);
    expect(Math.max(...ys)).toBeLessThanOrEqual(16.95 - 11.85 + 0.8);
  });

  it('keeps coordinates in the SHAPE-LOCAL frame — the joint pivot is (0,0)', () => {
    // The FFDec <g> offset must be REMOVED, not baked in: it is what makes the
    // animation nodes (x,y,rotation) land the part correctly in A4.
    const pts = art.fills[0]?.rings[0]?.points ?? [];
    const xs = pts.filter((_, i) => i % 2 === 0);
    expect(Math.min(...xs)).toBeLessThan(0);
  });

  it('emits no NaN anywhere', () => {
    const all = [
      ...art.fills.flatMap((f) => f.rings.flatMap((r) => [...r.points])),
      ...art.strokes.flatMap((s) => s.polylines.flat()),
    ];
    expect(all.length).toBeGreaterThan(0);
    expect(all.every(Number.isFinite)).toBe(true);
  });
});
