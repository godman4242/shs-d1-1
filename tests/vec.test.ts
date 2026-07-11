/**
 * Stage 1 item 1 — src/core/vec.ts: 2D vector math.
 * Spec functions: add, sub, dot, cross, len, norm, lerp, dist.
 * core/ has zero literals, so pure-math constants come from src/config/nums.ts.
 */
import { describe, expect, it } from 'vitest';
import { add, cross, dist, dot, len, lerp, norm, sub, type Vec } from '../src/core/vec';

const v = (x: number, y: number): Vec => ({ x, y });

describe('vec.add / vec.sub', () => {
  it('add sums components', () => {
    expect(add(v(1, 2), v(3, 4))).toEqual({ x: 4, y: 6 });
  });
  it('sub subtracts components (a - b)', () => {
    expect(sub(v(3, 4), v(1, 2))).toEqual({ x: 2, y: 2 });
  });
});

describe('vec.dot / vec.cross', () => {
  it('dot of perpendicular vectors is 0', () => {
    expect(dot(v(1, 0), v(0, 1))).toBe(0);
  });
  it('dot of parallel unit vectors is 1', () => {
    expect(dot(v(1, 0), v(1, 0))).toBe(1);
  });
  it('cross gives the signed area (z of the 3D cross product)', () => {
    expect(cross(v(1, 0), v(0, 1))).toBe(1);
    expect(cross(v(0, 1), v(1, 0))).toBe(-1);
    expect(cross(v(2, 3), v(4, 6))).toBe(0); // parallel
  });
});

describe('vec.len / vec.dist', () => {
  it('len of a 3-4 vector is 5', () => {
    expect(len(v(3, 4))).toBe(5);
  });
  it('len of the zero vector is 0', () => {
    expect(len(v(0, 0))).toBe(0);
  });
  it('dist between (1,1) and (4,5) is 5', () => {
    expect(dist(v(1, 1), v(4, 5))).toBe(5);
  });
});

describe('vec.norm', () => {
  it('returns a unit vector preserving direction', () => {
    expect(norm(v(3, 4))).toEqual({ x: 0.6, y: 0.8 });
  });
  it('norm of the zero vector is the zero vector (no NaN from 0/0)', () => {
    expect(norm(v(0, 0))).toEqual({ x: 0, y: 0 });
  });
});

describe('vec.lerp', () => {
  it('t=0 returns a, t=1 returns b', () => {
    expect(lerp(v(1, 2), v(5, 6), 0)).toEqual({ x: 1, y: 2 });
    expect(lerp(v(1, 2), v(5, 6), 1)).toEqual({ x: 5, y: 6 });
  });
  it('t=0.5 returns the midpoint', () => {
    expect(lerp(v(0, 0), v(10, 20), 0.5)).toEqual({ x: 5, y: 10 });
  });
});
