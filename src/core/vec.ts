/**
 * 2D vector math (Stage 1 item 1). Pure functions over plain {x, y} records —
 * no classes, no mutation, so Sim state stays structurally cloneable.
 */
import { ZERO } from '../config/nums';

export interface Vec {
  x: number;
  y: number;
}

export function add(a: Vec, b: Vec): Vec {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Vec, b: Vec): Vec {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function dot(a: Vec, b: Vec): number {
  return a.x * b.x + a.y * b.y;
}

/** z-component of the 3D cross product — the signed parallelogram area. */
export function cross(a: Vec, b: Vec): number {
  return a.x * b.y - a.y * b.x;
}

export function len(v: Vec): number {
  return Math.hypot(v.x, v.y);
}

/** Unit vector in v's direction; the zero vector normalizes to itself (no 0/0 NaN). */
export function norm(v: Vec): Vec {
  const l = len(v);
  return l === ZERO ? { x: ZERO, y: ZERO } : { x: v.x / l, y: v.y / l };
}

export function lerp(a: Vec, b: Vec, t: number): Vec {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function dist(a: Vec, b: Vec): number {
  return len(sub(a, b));
}
