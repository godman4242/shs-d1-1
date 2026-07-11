/**
 * DrawnStroke (Stage 1 item 3) — raw pointer points → combat-ready stroke.
 *
 * Pipeline (spec order): sanitize → resample to RESAMPLE_SPACING px (capped
 * at MAX_STROKE_POINTS; a runaway stroke is truncated, never re-spaced) →
 * Chaikin corner-cutting ×SMOOTH_ITERATIONS at CHAIKIN_RATIO → derive
 * length, unit net direction, gesture.
 *
 * Overflow guard (spec: "clamp to 0, bail to endpoints"): non-finite input
 * coordinates clamp to 0; if the sanitized polyline's total length is
 * non-finite (finite-but-huge coords like ±1e308 overflow in arithmetic),
 * processing bails to the sanitized endpoints, and every derived scalar is
 * clamped to a finite value. The chaos test red-proofs this path.
 */
import { CHAIKIN_RATIO, MAX_STROKE_POINTS, RESAMPLE_SPACING, SMOOTH_ITERATIONS } from '../config/combat';
import { ONE, TWO, ZERO } from '../config/nums';
import { polylineLength } from './geometry';
import { classifyGesture, type Gesture } from './gesture';
import { dist, lerp, norm, sub, type Vec } from './vec';

function finiteOrZero(n: number): number {
  return Number.isFinite(n) ? n : ZERO;
}

function sanitizeVec(p: Vec): Vec {
  return { x: finiteOrZero(p.x), y: finiteOrZero(p.y) };
}

/** Uniform re-spacing along the polyline; emits at most MAX_STROKE_POINTS. */
function resample(pts: readonly Vec[]): Vec[] {
  const first = pts.at(ZERO);
  if (first === undefined) return [];
  const out: Vec[] = [first];
  let sinceLastEmit = ZERO;
  let prev = first;
  for (const cur of pts) {
    let d = dist(prev, cur);
    while (sinceLastEmit + d >= RESAMPLE_SPACING && out.length < MAX_STROKE_POINTS) {
      const q = lerp(prev, cur, (RESAMPLE_SPACING - sinceLastEmit) / d);
      out.push(q);
      prev = q;
      sinceLastEmit = ZERO;
      d = dist(prev, cur);
    }
    if (out.length >= MAX_STROKE_POINTS) return out; // truncate runaway strokes
    sinceLastEmit += d;
    prev = cur;
  }
  const last = pts.at(-ONE);
  const tail = out.at(-ONE);
  if (last !== undefined && tail !== undefined && (tail.x !== last.x || tail.y !== last.y)) {
    out.push(last);
  }
  return out;
}

/** One Chaikin corner-cutting pass; endpoints are preserved. */
function chaikin(pts: readonly Vec[]): Vec[] {
  const first = pts.at(ZERO);
  const last = pts.at(-ONE);
  if (pts.length <= TWO || first === undefined || last === undefined) return [...pts];
  const out: Vec[] = [first];
  let prev: Vec | null = null;
  for (const cur of pts) {
    if (prev !== null) {
      out.push(lerp(prev, cur, CHAIKIN_RATIO), lerp(prev, cur, ONE - CHAIKIN_RATIO));
    }
    prev = cur;
  }
  out.push(last);
  return out;
}

export class DrawnStroke {
  readonly points: readonly Vec[];
  readonly length: number;
  /** Unit net direction (last − first); the zero vector when degenerate. */
  readonly direction: Vec;
  readonly gesture: Gesture;

  constructor(raw: readonly Vec[]) {
    const clean = raw.map(sanitizeVec);
    let pts: Vec[];
    if (Number.isFinite(polylineLength(clean))) {
      pts = resample(clean);
      for (let i = ZERO; i < SMOOTH_ITERATIONS; i += ONE) pts = chaikin(pts);
    } else {
      // Arithmetic on these coords overflows — bail to the sanitized endpoints.
      const first = clean.at(ZERO);
      const last = clean.at(-ONE);
      pts = first !== undefined && last !== undefined ? [first, last] : [];
    }
    this.points = pts;
    this.length = finiteOrZero(polylineLength(pts));
    const first = pts.at(ZERO);
    const last = pts.at(-ONE);
    const dir = first !== undefined && last !== undefined ? norm(sub(last, first)) : { x: ZERO, y: ZERO };
    this.direction = sanitizeVec(dir);
    this.gesture = classifyGesture(pts);
  }
}
