/**
 * Stage 1 item 2 — src/core/geometry.ts: point-in-polygon, segment
 * intersection, polyline closest-point, point-to-polyline distance.
 */
import { describe, expect, it } from 'vitest';
import {
  closestPointOnPolyline,
  distToPolyline,
  pointInPolygon,
  segmentsIntersect,
  type Vec,
} from '../src/core/geometry';

const v = (x: number, y: number): Vec => ({ x, y });
const square: Vec[] = [v(0, 0), v(10, 0), v(10, 10), v(0, 10)];
// U-shape: notch cut into the top between x=4..6 down to y=6
const uShape: Vec[] = [v(0, 0), v(10, 0), v(10, 10), v(6, 10), v(6, 6), v(4, 6), v(4, 10), v(0, 10)];

describe('pointInPolygon', () => {
  it('detects a point inside a square', () => {
    expect(pointInPolygon(v(5, 5), square)).toBe(true);
  });
  it('detects points outside a square', () => {
    expect(pointInPolygon(v(15, 5), square)).toBe(false);
    expect(pointInPolygon(v(5, -1), square)).toBe(false);
  });
  it('works with reversed (clockwise) winding', () => {
    const cw = [...square].reverse();
    expect(pointInPolygon(v(5, 5), cw)).toBe(true);
    expect(pointInPolygon(v(15, 5), cw)).toBe(false);
  });
  it('a point in the notch of a concave polygon is outside', () => {
    expect(pointInPolygon(v(5, 8), uShape)).toBe(false); // inside the notch void
    expect(pointInPolygon(v(2, 8), uShape)).toBe(true); // left prong is solid
  });
  it('degenerate polygons (< 3 points) contain nothing', () => {
    expect(pointInPolygon(v(0, 0), [])).toBe(false);
    expect(pointInPolygon(v(0, 0), [v(0, 0), v(1, 1)])).toBe(false);
  });
});

describe('segmentsIntersect', () => {
  it('detects a clean X crossing', () => {
    expect(segmentsIntersect(v(0, 0), v(10, 10), v(0, 10), v(10, 0))).toBe(true);
  });
  it('rejects parallel non-touching segments', () => {
    expect(segmentsIntersect(v(0, 0), v(10, 0), v(0, 5), v(10, 5))).toBe(false);
  });
  it('rejects far-apart segments whose infinite lines would cross', () => {
    expect(segmentsIntersect(v(0, 0), v(1, 1), v(10, 0), v(10, 20))).toBe(false);
  });
  it('detects endpoint touching', () => {
    expect(segmentsIntersect(v(0, 0), v(5, 5), v(5, 5), v(10, 0))).toBe(true);
  });
  it('detects collinear overlap', () => {
    expect(segmentsIntersect(v(0, 0), v(10, 0), v(5, 0), v(15, 0))).toBe(true);
  });
  it('rejects collinear but disjoint segments', () => {
    expect(segmentsIntersect(v(0, 0), v(4, 0), v(6, 0), v(10, 0))).toBe(false);
  });
});

describe('closestPointOnPolyline', () => {
  const line: Vec[] = [v(0, 0), v(10, 0), v(10, 10)];
  it('projects onto the interior of a segment', () => {
    expect(closestPointOnPolyline(v(5, 3), line)).toEqual({ x: 5, y: 0 });
  });
  it('clamps to a vertex when the projection falls outside every segment', () => {
    expect(closestPointOnPolyline(v(-4, -3), line)).toEqual({ x: 0, y: 0 });
  });
  it('picks the nearer of two segments around a corner', () => {
    expect(closestPointOnPolyline(v(11, 9), line)).toEqual({ x: 10, y: 9 });
  });
  it('a single-point polyline returns that point', () => {
    expect(closestPointOnPolyline(v(3, 4), [v(1, 1)])).toEqual({ x: 1, y: 1 });
  });
  it('an empty polyline has no closest point', () => {
    expect(closestPointOnPolyline(v(0, 0), [])).toBeNull();
  });
});

describe('distToPolyline', () => {
  const line: Vec[] = [v(0, 0), v(10, 0)];
  it('is the perpendicular distance inside a segment span', () => {
    expect(distToPolyline(v(5, 7), line)).toBe(7);
  });
  it('is the vertex distance beyond the ends (3-4-5)', () => {
    expect(distToPolyline(v(13, 4), line)).toBe(5);
  });
  it('is 0 for a point on the polyline', () => {
    expect(distToPolyline(v(5, 0), line)).toBe(0);
  });
  it('an empty polyline has no distance', () => {
    expect(distToPolyline(v(0, 0), [])).toBeNull();
  });
});
