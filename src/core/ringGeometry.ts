/**
 * RING CONTAINMENT (SESSION18 A4.1) — is one closed contour nested inside
 * another? Pure: flat `[x0,y0,x1,y1,…]` arrays in, booleans out.
 *
 * ⚠️ WHY THIS IS ONE IMPLEMENTATION AND NOT TWO. It was extracted verbatim from
 * `scripts/art/svgShape.ts`, which still imports it, because two callers now ask
 * the SAME question about the same rings and their answers must agree:
 *   - the converter asks "how many rings contain this one?" (even-odd parity)
 *     to decide `ring.hole`;
 *   - `artPlan.ts` asks "WHICH ring contains this hole?" to pack it as an Earcut
 *     `holeIndices` span against the right outer ring.
 * A second, drifting copy of this rule would punch a hole through solid colour
 * with no test able to see it. The rule already produced 24 wrong verdicts
 * across 19 shapes once (SESSION16 R2 finding 3) — it is not a rule to retype.
 *
 * It lives in `src/core/` (not `scripts/`) because `src/` may not import from
 * `scripts/`, and because `core/` is the folder the purity gate holds to zero
 * numeric literals — which is where a geometry epsilon belongs.
 */
import { RING_ON_EPSILON } from '../config/art';
import { ONE, TWO, ZERO } from '../config/nums';

/** Bounds-checked flat-array read — `noUncheckedIndexedAccess` makes it explicit. */
function coord(a: readonly number[], i: number): number {
  const v = a[i];
  if (v === undefined) throw new Error(`ringGeometry: coordinate index ${String(i)} out of range`);
  return v;
}

/** Even-odd ray cast toward +x. Winding-agnostic by construction. */
export function pointInRing(x: number, y: number, ring: readonly number[]): boolean {
  let inside = false;
  const n = ring.length;
  for (let i = ZERO; i + ONE < n; i += TWO) {
    const j = (i + TWO) % n;
    const ax = coord(ring, i);
    const ay = coord(ring, i + ONE);
    const bx = coord(ring, j);
    const by = coord(ring, j + ONE);
    if (ay > y !== by > y) {
      const t = (y - ay) / (by - ay);
      if (x < ax + t * (bx - ax)) inside = !inside;
    }
  }
  return inside;
}

/**
 * Every edge midpoint of the ring, LONGEST EDGE FIRST.
 *
 * ⚠️ Nesting MUST be probed from the boundary, not from an interior point. A
 * ring nested inside R cannot contain a boundary point of R, but it very much
 * can contain an interior one: the centre of a square-with-a-hole lies inside
 * the hole, which made the outer ring classify itself as a hole. That was a
 * real red here, not a hypothetical.
 *
 * ⚠️ But ONE probe is not enough, and the longest edge is not the safe choice
 * this once claimed (SESSION16 R2 finding 3). The old docstring worried about
 * landing on another ring's VERTEX; the real hazard is another ring's EDGE.
 * FFDec tessellates abutting regions of a single even-odd path along a
 * byte-identical shared edge, and that shared edge is frequently the ring's
 * longest — so the one probe landed exactly ON a sibling, where `pointInRing`
 * has no on-boundary tolerance and answers essentially arbitrarily. 24 rings
 * across 19 real shapes were emitted with the wrong verdict, up to 345 px².
 * Hence: candidates, longest first, so behaviour is unchanged wherever nothing
 * touches, and there is somewhere to go when something does.
 */
export function boundaryProbes(ring: readonly number[]): Array<readonly [number, number]> {
  const n = ring.length;
  const out: Array<{ len: number; p: readonly [number, number] }> = [];
  for (let i = ZERO; i + ONE < n; i += TWO) {
    const j = (i + TWO) % n;
    const ax = coord(ring, i);
    const ay = coord(ring, i + ONE);
    const cx = coord(ring, j);
    const cy = coord(ring, j + ONE);
    out.push({ len: Math.hypot(cx - ax, cy - ay), p: [(ax + cx) / TWO, (ay + cy) / TWO] });
  }
  out.sort((a, b) => b.len - a.len);
  return out.map((e) => e.p);
}

/** The first (longest-edge) probe. Kept for callers that want just one point. */
export function boundaryProbe(ring: readonly number[]): readonly [number, number] {
  const p = boundaryProbes(ring).at(ZERO);
  if (p === undefined) throw new Error('ringGeometry: cannot probe an empty ring');
  return p;
}

/** Distance from a point to the closest point on any of the ring's edges. */
export function distToRing(px: number, py: number, ring: readonly number[]): number {
  const n = ring.length;
  let best = Infinity;
  for (let i = ZERO; i + ONE < n; i += TWO) {
    const j = (i + TWO) % n;
    const ax = coord(ring, i);
    const ay = coord(ring, i + ONE);
    const bx = coord(ring, j);
    const by = coord(ring, j + ONE);
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 === ZERO ? ZERO : Math.max(ZERO, Math.min(ONE, ((px - ax) * dx + (py - ay) * dy) / len2));
    best = Math.min(best, Math.hypot(px - (ax + t * dx), py - (ay + t * dy)));
  }
  return best;
}

/**
 * Is `inner` nested inside `outer`? Decided from the first boundary probe of
 * `inner` that is not sitting ON `outer`.
 *
 * Choosing the probe PER PAIR is sound because rings of one even-odd path do not
 * properly cross: `inner` is wholly inside or wholly outside `outer`, so any
 * point of `inner` that is not on the boundary answers for all of it. (Genuinely
 * overlapping subpaths do occur in ~5 places in the wider corpus and a per-ring
 * `hole` boolean cannot represent them under any epsilon — that is a separate,
 * unfixed limitation, recorded in docs/DIVERGENCES.md.)
 */
export function ringContains(outer: readonly number[], inner: readonly number[]): boolean {
  for (const [px, py] of boundaryProbes(inner)) {
    if (distToRing(px, py, outer) > RING_ON_EPSILON) return pointInRing(px, py, outer);
  }
  // Fails CLOSED: every edge midpoint of `inner` lies on `outer`, so the two are
  // coincident and the nesting question has no answer. Guessing would silently
  // punch a hole through solid colour.
  throw new Error('ringGeometry: ring lies entirely on a sibling ring — cannot classify as hole or solid');
}
