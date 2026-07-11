/**
 * Planar geometry for slash resolution (Stage 1 item 2): point-in-polygon,
 * segment intersection, polyline closest-point / distance. Pure functions;
 * polygons are Vec[] rings (either winding), polylines are ordered Vec[].
 */
import { ONE, TWO, ZERO } from '../config/nums';
import { cross, dist, dot, lerp, sub, type Vec } from './vec';

export type { Vec };

function clamp01(t: number): number {
  return t < ZERO ? ZERO : t > ONE ? ONE : t;
}

/** p is already known collinear with a–b; is it within the segment's box? */
function onSegment(a: Vec, b: Vec, p: Vec): boolean {
  return (
    Math.min(a.x, b.x) <= p.x &&
    p.x <= Math.max(a.x, b.x) &&
    Math.min(a.y, b.y) <= p.y &&
    p.y <= Math.max(a.y, b.y)
  );
}

/**
 * Even-odd ray cast (horizontal ray toward +x). Winding-agnostic; points on
 * an edge are unspecified (hitboxes never rely on exact-boundary points).
 */
export function pointInPolygon(p: Vec, poly: readonly Vec[]): boolean {
  let prev = poly.at(-ONE);
  if (poly.length <= TWO || prev === undefined) return false;
  let inside = false;
  for (const cur of poly) {
    const edgeCrossesRayLevel = cur.y > p.y !== prev.y > p.y;
    if (edgeCrossesRayLevel) {
      const t = (p.y - prev.y) / (cur.y - prev.y);
      const xAtRayLevel = prev.x + t * (cur.x - prev.x);
      if (p.x < xAtRayLevel) inside = !inside;
    }
    prev = cur;
  }
  return inside;
}

/** Segment a1–a2 vs b1–b2, including endpoint-touch and collinear overlap. */
export function segmentsIntersect(a1: Vec, a2: Vec, b1: Vec, b2: Vec): boolean {
  const d1 = cross(sub(a2, a1), sub(b1, a1));
  const d2 = cross(sub(a2, a1), sub(b2, a1));
  const d3 = cross(sub(b2, b1), sub(a1, b1));
  const d4 = cross(sub(b2, b1), sub(a2, b1));
  const properCrossing =
    ((d1 > ZERO && d2 < ZERO) || (d1 < ZERO && d2 > ZERO)) &&
    ((d3 > ZERO && d4 < ZERO) || (d3 < ZERO && d4 > ZERO));
  if (properCrossing) return true;
  if (d1 === ZERO && onSegment(a1, a2, b1)) return true;
  if (d2 === ZERO && onSegment(a1, a2, b2)) return true;
  if (d3 === ZERO && onSegment(b1, b2, a1)) return true;
  if (d4 === ZERO && onSegment(b1, b2, a2)) return true;
  return false;
}

/** Nearest point on the polyline to p; null only for an empty polyline. */
export function closestPointOnPolyline(p: Vec, pts: readonly Vec[]): Vec | null {
  let best: Vec | null = null;
  let bestDist = ZERO;
  const consider = (q: Vec): void => {
    const d = dist(p, q);
    if (best === null || d < bestDist) {
      best = q;
      bestDist = d;
    }
  };
  let prev: Vec | null = null;
  for (const cur of pts) {
    if (prev === null) {
      consider(cur); // first vertex — also covers single-point polylines
    } else {
      const seg = sub(cur, prev);
      const segLenSq = dot(seg, seg);
      const t = segLenSq === ZERO ? ZERO : clamp01(dot(sub(p, prev), seg) / segLenSq);
      consider(lerp(prev, cur, t));
    }
    prev = cur;
  }
  return best;
}

/** Distance from p to the polyline; null only for an empty polyline. */
export function distToPolyline(p: Vec, pts: readonly Vec[]): number | null {
  const q = closestPointOnPolyline(p, pts);
  return q === null ? null : dist(p, q);
}

/** Total arc length of a polyline (0 for fewer than 2 points). */
export function polylineLength(pts: readonly Vec[]): number {
  let total = ZERO;
  let prev: Vec | null = null;
  for (const cur of pts) {
    if (prev !== null) total += dist(prev, cur);
    prev = cur;
  }
  return total;
}
