/**
 * Stage 1 item 3 — src/core/DrawnStroke.ts: raw pointer points → resampled
 * (RESAMPLE_SPACING=8, capped MAX_STROKE_POINTS=256) → Chaikin-smoothed
 * (SMOOTH_ITERATIONS=2, CHAIKIN_RATIO=0.25) → length/direction/gesture.
 * Item 9 — chaos: ±1e308 coordinates in, ALL outputs finite.
 */
import { describe, expect, it } from 'vitest';
import { MAX_STROKE_POINTS, RESAMPLE_SPACING } from '../src/config/combat';
import { DrawnStroke } from '../src/core/DrawnStroke';
import { distToPolyline } from '../src/core/geometry';
import type { Vec } from '../src/core/vec';

const v = (x: number, y: number): Vec => ({ x, y });

describe('DrawnStroke — resampling + smoothing', () => {
  it('preserves the endpoints of a stroke', () => {
    const s = new DrawnStroke([v(0, 0), v(37, 22), v(80, 0)]);
    expect(s.points.at(0)).toEqual({ x: 0, y: 0 });
    expect(s.points.at(-1)).toEqual({ x: 80, y: 0 });
  });

  it('a straight stroke stays straight and keeps its length', () => {
    const s = new DrawnStroke([v(0, 0), v(80, 0)]);
    expect(s.points.length).toBeGreaterThan(2); // resampled every 8px, not just endpoints
    for (const p of s.points) expect(p.y).toBe(0);
    expect(s.length).toBeCloseTo(80, 6);
  });

  it('densifies a sparse stroke to ~uniform spacing before smoothing', () => {
    const s = new DrawnStroke([v(0, 0), v(160, 0)]);
    // 160px at 8px spacing = 21 resampled points; 2 Chaikin iterations ≈ 4×
    expect(s.points.length).toBeGreaterThanOrEqual(21);
  });

  it('cuts sharp corners (the raw corner vertex is smoothed away)', () => {
    const s = new DrawnStroke([v(0, 0), v(100, 0), v(100, 100)]);
    expect(s.points).not.toContainEqual({ x: 100, y: 0 });
    const cornerGap = distToPolyline(v(100, 0), [...s.points]);
    expect(cornerGap).not.toBeNull();
    expect(cornerGap).toBeGreaterThan(0); // path pulled off the corner…
    expect(cornerGap).toBeLessThan(RESAMPLE_SPACING); // …but only gently
  });

  it('caps runaway strokes at MAX_STROKE_POINTS before smoothing', () => {
    const raw: Vec[] = [];
    for (let x = 0; x <= 40000; x += 4) raw.push(v(x, 0));
    const s = new DrawnStroke(raw);
    // 2 Chaikin iterations at most quadruple the capped resample count
    expect(s.points.length).toBeLessThanOrEqual(4 * MAX_STROKE_POINTS);
  });
});

describe('DrawnStroke — derived length / direction / gesture', () => {
  it('direction is the unit net direction of the stroke', () => {
    const s = new DrawnStroke([v(0, 0), v(80, 0)]);
    expect(s.direction.x).toBeCloseTo(1, 9);
    expect(s.direction.y).toBeCloseTo(0, 9);
  });
  it('a right-to-left stroke points -x', () => {
    const s = new DrawnStroke([v(80, 10), v(0, 10)]);
    expect(s.direction.x).toBeCloseTo(-1, 9);
  });
  it('classifies its own gesture (long up stroke = jump)', () => {
    const s = new DrawnStroke([v(50, 300), v(50, 0)]);
    expect(s.gesture).toBe('jump');
  });
  it('an empty stroke is a finite, zero-length slash', () => {
    const s = new DrawnStroke([]);
    expect(s.points).toEqual([]);
    expect(s.length).toBe(0);
    expect(s.direction).toEqual({ x: 0, y: 0 });
    expect(s.gesture).toBe('slash');
  });
});

describe('DrawnStroke — chaos: hostile input never leaks non-finite output', () => {
  const finiteVec = (p: Vec): boolean => Number.isFinite(p.x) && Number.isFinite(p.y);

  it('NaN/Infinity coordinates clamp to 0', () => {
    const s = new DrawnStroke([v(NaN, 5), v(10, Infinity), v(-Infinity, 12)]);
    expect(s.points.at(0)).toEqual({ x: 0, y: 5 });
    expect(s.points.every(finiteVec)).toBe(true);
    expect(Number.isFinite(s.length)).toBe(true);
    expect(finiteVec(s.direction)).toBe(true);
  });

  it('±1e308 coordinates (finite but overflow-prone) → all outputs finite', () => {
    const s = new DrawnStroke([v(1e308, 1e308), v(-1e308, -1e308), v(1e308, -1e308)]);
    expect(s.points.length).toBeGreaterThan(0);
    expect(s.points.every(finiteVec)).toBe(true);
    expect(Number.isFinite(s.length)).toBe(true);
    expect(finiteVec(s.direction)).toBe(true);
    expect(['slash', 'jump', 'launch', 'stab']).toContain(s.gesture);
  });

  it('mixed hostile input (NaN + ±1e308 + normal points) → all outputs finite', () => {
    const s = new DrawnStroke([v(0, 0), v(NaN, NaN), v(1e308, -1e308), v(50, 50)]);
    expect(s.points.every(finiteVec)).toBe(true);
    expect(Number.isFinite(s.length)).toBe(true);
    expect(finiteVec(s.direction)).toBe(true);
  });
});
