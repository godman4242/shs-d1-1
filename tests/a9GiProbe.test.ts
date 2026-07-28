/**
 * ⭐ GATE A9-E (SESSION22 A9.4, landed by the OWNER'S RULING 2026-07-28) — THE
 * GI'S BACK EDGE IS ONE SMOOTH CURVE, AND THE BALLOON CANNOT COME BACK.
 *
 * ⛔ WHY. The traced 9015's flood fill leaked across the jacket's back into the
 * far-sleeve region and merged them into a balloon (SESSION21 §P6 — proven;
 * the doubled-sleeve theory is refuted). The source's back is ONE smooth curve
 * shoulder to hip. The repair carved the leaked lobe off by measurement
 * (subtracting 9001's own isolate region, bridged across the occluded band).
 *
 * THE BAR: no SECONDARY local maximum on the back-edge profile with prominence
 * over 2 stage px ≈ 1.66 shape-local px (stage/local ≈ 1.204, measured A9.6).
 * The repaired shape measures ~0.44 local (0.53 stage) — a trace step. The
 * balloon measured ~4 local (4.80 stage): this gate, run against the pre-repair
 * shape, is RED — watched before the repair landed (the red-first proof).
 *
 * Shape-local +x is AFT (the fighter faces −x): the back edge is max-x per row.
 */
import { describe, expect, it } from 'vitest';
import { SHAPE_9015 } from '../src/game/art/generated/shape9015';

/** 2 stage px, in shape-local units (stage/local ≈ 1.204 — A9.6's measurement). */
const PROMINENCE_BAR_LOCAL = 1.66;
/** Row bins across the ring's height; ends trimmed — corners are not "the back". */
const BINS = 60;
const TRIM = 0.1;

/** Max-x of the ring boundary per y-bin, sampled along every edge. */
function backProfile(points: readonly number[]): number[] {
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 1; i < points.length; i += 2) {
    const y = points[i] ?? 0;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const y0 = minY + (maxY - minY) * TRIM;
  const y1 = maxY - (maxY - minY) * TRIM;
  const prof = new Array<number>(BINS).fill(-Infinity);
  const n = points.length / 2;
  for (let e = 0; e < n; e += 1) {
    const ax = points[2 * e] ?? 0;
    const ay = points[2 * e + 1] ?? 0;
    const bx = points[(2 * ((e + 1) % n))] ?? 0;
    const by = points[(2 * ((e + 1) % n)) + 1] ?? 0;
    const steps = Math.max(1, Math.ceil(Math.abs(by - ay) * 8));
    for (let s = 0; s <= steps; s += 1) {
      const t = s / steps;
      const y = ay + (by - ay) * t;
      if (y < y0 || y > y1) continue;
      const bin = Math.min(BINS - 1, Math.floor(((y - y0) / (y1 - y0)) * BINS));
      const x = ax + (bx - ax) * t;
      if (x > (prof[bin] ?? -Infinity)) prof[bin] = x;
    }
  }
  return prof.filter((v) => v !== -Infinity);
}

/**
 * The balloon's signature, exactly as A9.4 measured it: the back edge PEAKS
 * mid-torso and RECEDES before the hem, where the source's back is a monotone
 * shoulder→hip widening whose widest point IS the hem. Score = how far any
 * row's back edge overhangs the hem's own width (peak minus the max of the
 * hem-most 15 % of rows). Monotone-to-hem ≈ 0; the balloon measures ~3.5
 * local (~4.2 stage, the agents' 4.80 within binning); the repair ~0.4.
 */
function worstHemOverhang(prof: readonly number[]): number {
  const hemBins = Math.max(1, Math.ceil(prof.length * 0.15));
  let hemMax = -Infinity;
  for (let i = prof.length - hemBins; i < prof.length; i += 1) {
    hemMax = Math.max(hemMax, prof[i] ?? -Infinity);
  }
  let worst = 0;
  for (const v of prof) worst = Math.max(worst, v - hemMax);
  return worst;
}

describe('A9-E — the gi body\'s back edge is one smooth curve', () => {
  it('has no secondary back-edge bump over 2 stage px — the balloon is gone and stays gone', () => {
    // The SILHOUETTE ring is the largest outer ring across every fill —
    // colour-blind on purpose: the legacy blob's silhouette was its BLACK
    // fill, the re-authored shape's is its base fill, and the probe must go
    // red on the former and green on the latter without knowing which it has.
    let outer: readonly number[] | undefined;
    let bestArea = -Infinity;
    for (const p of SHAPE_9015.paints) {
      if (p.kind !== 'fill') continue;
      for (const r of p.rings) {
        if (r.hole) continue;
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (let i = 0; i + 1 < r.points.length; i += 2) {
          const x = r.points[i] ?? 0, y = r.points[i + 1] ?? 0;
          if (x < x0) x0 = x; if (x > x1) x1 = x;
          if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
        const area = (x1 - x0) * (y1 - y0);
        if (area > bestArea) { bestArea = area; outer = r.points; }
      }
    }
    if (outer === undefined) throw new Error('9015 has no outer fill ring');
    const worst = worstHemOverhang(backProfile(outer));
    expect(worst, `worst secondary bump ${worst.toFixed(2)} local px (bar ${String(PROMINENCE_BAR_LOCAL)})`)
      .toBeLessThanOrEqual(PROMINENCE_BAR_LOCAL);
  });
});
