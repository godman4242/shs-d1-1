/**
 * SESSION 15 A2 — SVG shape → polygon converter. BUILD-TIME ONLY.
 *
 * This file never ships. It reads an FFDec-exported `reference/extracted/
 * shapes/<id>.svg` (gitignored) and emits committed TypeScript into
 * `src/game/art/`. SESSION15 D1: `reference/` is gitignored, so a runtime
 * loader is IMPOSSIBLE, not merely unwise — the data must be compiled in.
 *
 * Scope, settled by measurement in docs/research/fidelity/FIGHTER_ART_IDS.md:
 *   - the 16 fighter shapes are 100 % flat solid fill — no gradients (D3) and
 *     no bitmap fills (D4) occur, so neither is implemented here;
 *   - the path command set is exactly `M L Q Z` — quadratic only, SWF has no
 *     cubics — so one subdivision routine covers everything.
 *
 * Everything unsupported FAILS CLOSED. A converter that skips what it does not
 * understand loses a body part silently, which lands as SESSION15 §2's
 * permitted diagnosis (b) after hours of looking in the wrong place.
 *
 * COORDINATES: the `d` data inside FFDec's wrapper <g> is ALREADY in the
 * shape-local frame whose origin is the part's joint pivot; the <g> translate
 * only shifts it into a positive-sized viewport. We therefore IGNORE the <g>
 * offset. Baking it in would break every animation node in A4.
 */

export interface LineSeg {
  readonly kind: 'L';
  readonly x: number;
  readonly y: number;
}
export interface QuadSeg {
  readonly kind: 'Q';
  readonly cx: number;
  readonly cy: number;
  readonly x: number;
  readonly y: number;
}
export type Seg = LineSeg | QuadSeg;

export interface Subpath {
  readonly startX: number;
  readonly startY: number;
  readonly segs: readonly Seg[];
  readonly closed: boolean;
}

/** A flat [x0,y0,x1,y1,…] contour. `hole` is the even-odd verdict. */
export interface Ring {
  readonly points: readonly number[];
  readonly hole: boolean;
}
export interface FillArt {
  readonly color: number;
  readonly rings: readonly Ring[];
}
export interface StrokeArt {
  readonly color: number;
  readonly width: number;
  readonly polylines: ReadonlyArray<readonly number[]>;
}
export interface ShapeArt {
  readonly id: number;
  readonly fills: readonly FillArt[];
  readonly strokes: readonly StrokeArt[];
}

/** Rings smaller than this (px²) enclose no area — FFDec crease detail. */
const DEGENERATE_AREA = 1e-6;
/** Two vertices closer than this are the same vertex. */
const WELD = 1e-9;

const SUPPORTED = new Set(['M', 'L', 'Q', 'Z']);

/**
 * Fail-closed indexed access. `noUncheckedIndexedAccess` is on and the lint
 * config bans both `!` and `x as number`, so every read is checked; an
 * out-of-range read here would mean a malformed ring, which must throw rather
 * than quietly become 0 and warp the geometry.
 */
function coord(a: readonly number[], i: number): number {
  const v = a[i];
  if (v === undefined) throw new Error(`svgShape: coordinate index ${String(i)} out of range`);
  return v;
}

function group(m: RegExpMatchArray, i: number): string {
  const v = m[i];
  if (v === undefined) throw new Error(`svgShape: regex group ${String(i)} missing`);
  return v;
}

/**
 * Tokenise SVG path data into subpaths. Absolute `M`/`L`/`Q`/`Z` only — every
 * other command throws, including the relative forms, which FFDec never emits
 * and which would be silently misread as absolute.
 */
export function parsePath(d: string): Subpath[] {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  const subs: Subpath[] = [];
  let cmd = '';
  let startX = 0;
  let startY = 0;
  let segs: Seg[] = [];
  let open = false;
  let i = 0;

  const flush = (closed: boolean): void => {
    if (open) subs.push({ startX, startY, segs, closed });
    open = false;
    segs = [];
  };
  const num = (): number => {
    const t = tokens[i++];
    if (t === undefined || !/^-?[\d.]/.test(t)) {
      throw new Error(`svgShape: truncated coordinate list near token ${i} in path`);
    }
    return Number(t);
  };

  while (i < tokens.length) {
    const tok = tokens.at(i);
    if (tok === undefined) break;
    if (/^[A-Za-z]$/.test(tok)) {
      if (!SUPPORTED.has(tok)) {
        throw new Error(`svgShape: unsupported path command '${tok}' — refusing to drop geometry`);
      }
      cmd = tok;
      i++;
      if (cmd === 'Z') {
        flush(true);
        continue;
      }
    } else if (cmd === '' || cmd === 'Z') {
      throw new Error('svgShape: path data must open with a moveto command');
    }

    if (cmd === 'M') {
      flush(false);
      startX = num();
      startY = num();
      open = true;
      cmd = 'L'; // per SVG spec, coordinates following an M are implicit L
    } else if (cmd === 'L') {
      if (!open) throw new Error('svgShape: path data must open with a moveto command');
      segs.push({ kind: 'L', x: num(), y: num() });
    } else {
      if (!open) throw new Error('svgShape: path data must open with a moveto command');
      const cx = num();
      const cy = num();
      segs.push({ kind: 'Q', cx, cy, x: num(), y: num() });
    }
  }
  flush(false);
  return subs;
}

/** Adaptive de Casteljau: split while the control point is off-chord. */
function emitQuad(
  out: number[],
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  tol: number,
  depth: number,
): void {
  // Flatness = distance from the control point to the chord's midpoint. For a
  // quadratic the curve's max deviation from the chord is exactly half of it.
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  if (depth >= 24 || Math.hypot(cx - mx, cy - my) / 2 <= tol) {
    out.push(x1, y1);
    return;
  }
  const ax = (x0 + cx) / 2;
  const ay = (y0 + cy) / 2;
  const bx = (cx + x1) / 2;
  const by = (cy + y1) / 2;
  const midX = (ax + bx) / 2;
  const midY = (ay + by) / 2;
  emitQuad(out, x0, y0, ax, ay, midX, midY, tol, depth + 1);
  emitQuad(out, midX, midY, bx, by, x1, y1, tol, depth + 1);
}

/** Flatten one subpath to a polyline. Closed rings do not repeat the start. */
export function flattenSubpath(sub: Subpath, tolerance: number): number[] {
  if (!(tolerance > 0)) throw new Error('svgShape: tolerance must be > 0');
  const out: number[] = [sub.startX, sub.startY];
  let x = sub.startX;
  let y = sub.startY;
  for (const s of sub.segs) {
    if (s.kind === 'L') out.push(s.x, s.y);
    else emitQuad(out, x, y, s.cx, s.cy, s.x, s.y, tolerance, 0);
    x = s.x;
    y = s.y;
  }
  return out;
}

/** Drop repeated vertices, and any trailing vertex equal to the start. */
function weld(points: readonly number[]): number[] {
  const out: number[] = [];
  for (let i = 0; i + 1 < points.length; i += 2) {
    const x = coord(points, i);
    const y = coord(points, i + 1);
    const n = out.length;
    if (n >= 2 && Math.abs(coord(out, n - 2) - x) < WELD && Math.abs(coord(out, n - 1) - y) < WELD) {
      continue;
    }
    out.push(x, y);
  }
  const n = out.length;
  if (
    n >= 4 &&
    Math.abs(coord(out, 0) - coord(out, n - 2)) < WELD &&
    Math.abs(coord(out, 1) - coord(out, n - 1)) < WELD
  ) {
    out.length = n - 2;
  }
  return out;
}

function signedArea(ring: readonly number[]): number {
  let a = 0;
  const n = ring.length;
  for (let i = 0; i + 1 < n; i += 2) {
    const jx = (i + 2) % n;
    a += coord(ring, i) * coord(ring, jx + 1) - coord(ring, jx) * coord(ring, i + 1);
  }
  return a / 2;
}

/** Even-odd ray cast toward +x. Winding-agnostic by construction. */
export function pointInRing(x: number, y: number, ring: readonly number[]): boolean {
  let inside = false;
  const n = ring.length;
  for (let i = 0; i + 1 < n; i += 2) {
    const j = (i + 2) % n;
    const ax = coord(ring, i);
    const ay = coord(ring, i + 1);
    const bx = coord(ring, j);
    const by = coord(ring, j + 1);
    if (ay > y !== by > y) {
      const t = (y - ay) / (by - ay);
      if (x < ax + t * (bx - ax)) inside = !inside;
    }
  }
  return inside;
}

/**
 * A point strictly inside the ring. A centroid is NOT sufficient — for a
 * concave ring it can land in the notch and flip the hole verdict.
 */
export function interiorPoint(ring: readonly number[]): readonly [number, number] {
  const ys: number[] = [];
  const xs: number[] = [];
  for (let i = 0; i + 1 < ring.length; i += 2) {
    xs.push(coord(ring, i));
    ys.push(coord(ring, i + 1));
  }
  const yMid = (Math.min(...ys) + Math.max(...ys)) / 2;
  const cross: number[] = [];
  const n = ring.length;
  for (let i = 0; i + 1 < n; i += 2) {
    const j = (i + 2) % n;
    const ax = coord(ring, i);
    const ay = coord(ring, i + 1);
    const bx = coord(ring, j);
    const by = coord(ring, j + 1);
    if (ay > yMid !== by > yMid) cross.push(ax + ((yMid - ay) / (by - ay)) * (bx - ax));
  }
  cross.sort((a, b) => a - b);
  if (cross.length >= 2) {
    return [(coord(cross, 0) + coord(cross, 1)) / 2, yMid];
  }
  return [xs.reduce((s, v) => s + v, 0) / xs.length, yMid];
}

/**
 * A point ON the ring — the midpoint of its longest edge.
 *
 * ⚠️ Nesting MUST be probed from the boundary, not from `interiorPoint`. A
 * ring nested inside R cannot contain a boundary point of R, but it very much
 * can contain an interior one: the centre of a square-with-a-hole lies inside
 * the hole, which made the outer ring classify itself as a hole. That was a
 * real red here, not a hypothetical. The longest edge is used because its
 * midpoint is the least likely to coincide with another ring's vertices.
 */
export function boundaryProbe(ring: readonly number[]): readonly [number, number] {
  const n = ring.length;
  let best = -1;
  let bx = coord(ring, 0);
  let by = coord(ring, 1);
  for (let i = 0; i + 1 < n; i += 2) {
    const j = (i + 2) % n;
    const ax = coord(ring, i);
    const ay = coord(ring, i + 1);
    const cx = coord(ring, j);
    const cy = coord(ring, j + 1);
    const len = Math.hypot(cx - ax, cy - ay);
    if (len > best) {
      best = len;
      bx = (ax + cx) / 2;
      by = (ay + cy) / 2;
    }
  }
  return [bx, by];
}

/**
 * Even-odd containment: a ring is a hole iff an ODD number of the other rings
 * contain it. Not nonzero-winding — an island inside a hole fills again.
 */
export function classifyEvenOdd(rings: ReadonlyArray<readonly number[]>): boolean[] {
  return rings.map((ring, i) => {
    const [px, py] = boundaryProbe(ring);
    let depth = 0;
    rings.forEach((other, j) => {
      if (i !== j && pointInRing(px, py, other)) depth++;
    });
    return depth % 2 === 1;
  });
}

/** One `fill=` path's data → classified rings. */
export function convertFillPath(d: string, tolerance: number): Ring[] {
  const raw = parsePath(d)
    .map((s) => weld(flattenSubpath(s, tolerance)))
    // Fill subpaths are implicitly closed; a there-and-back crease encloses no
    // area and must go, or it punches a phantom hole through the body.
    .filter((p) => p.length >= 6 && Math.abs(signedArea(p)) > DEGENERATE_AREA);
  const holes = classifyEvenOdd(raw);
  return raw.map((points, i) => ({ points, hole: holes.at(i) === true }));
}

/** One `stroke=` path's data → open polylines (no hole logic applies). */
export function convertStrokePath(d: string, tolerance: number): number[][] {
  return parsePath(d)
    .map((s) => {
      const pts = weld(flattenSubpath(s, tolerance));
      // A closed stroke must return to its start; weld() removed that vertex.
      if (s.closed && pts.length >= 4) pts.push(coord(pts, 0), coord(pts, 1));
      return pts;
    })
    .filter((p) => p.length >= 4);
}

function attrs(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) out[group(m, 1)] = group(m, 2);
  return out;
}

function parseColor(v: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(v.trim());
  if (m === null) throw new Error(`svgShape: unsupported colour '${v}' (expected #rrggbb)`);
  return parseInt(group(m, 1), 16);
}

/**
 * Convert one FFDec shape SVG. Fill and stroke paths are separate elements in
 * FFDec's output; both are kept — the OG's heavy black outline is a large part
 * of its look and it widens the silhouette §2 bar A measures.
 */
export function convertShapeSvg(svg: string, id: number, tolerance: number): ShapeArt {
  const g = /<g transform="matrix\(([^)]*)\)"/.exec(svg);
  if (g !== null) {
    const [a, b, c, dd] = group(g, 1)
      .split(',')
      .map((v) => Number(v.trim()));
    // We deliberately ignore the translate, but a scale or rotation here would
    // mean the `d` data is NOT shape-local and every pivot would be wrong.
    if (a !== 1 || b !== 0 || c !== 0 || dd !== 1) {
      throw new Error(`svgShape: shape ${id} wrapper <g> is not a pure translation — pivots would be wrong`);
    }
  }

  const fills: FillArt[] = [];
  const strokes: StrokeArt[] = [];
  for (const m of svg.matchAll(/<path\b[^>]*\/>/g)) {
    const a = attrs(m[0]);
    const d = a.d;
    if (d === undefined) continue;
    const fill = a.fill ?? 'none';
    if (fill !== 'none') fills.push({ color: parseColor(fill), rings: convertFillPath(d, tolerance) });
    const stroke = a.stroke;
    if (stroke !== undefined && stroke !== 'none') {
      // FFDec bumps hairlines up to 1.0 for legibility and records the real
      // width; use the original so the outline weight stays faithful.
      const original = a['ffdec:original-stroke-width'];
      const width = Number(original ?? a['stroke-width'] ?? '1');
      strokes.push({ color: parseColor(stroke), width, polylines: convertStrokePath(d, tolerance) });
    }
  }
  return { id, fills, strokes };
}
