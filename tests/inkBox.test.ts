/**
 * INK BOX (SESSION17 A3.2) — the measurement rule of SESSION17 §P2, written down
 * as a tested function instead of improvised in a console.
 *
 * §P2 fixes the rule because the gate is ±1 px on a ~20 px ANTIALIASED object:
 * "measure the bounding box of all canvas pixels whose alpha ≥ 50 % of full, on
 * a transparent-background render of the shape alone". It also concedes that
 * ±1 px is roughly the method's own noise floor. That concession is precisely
 * why `spanX` and `coveredX` are BOTH returned: an object whose ink runs from
 * x=100.0 to x=117.14 lights pixels 100..117, so the distance between outermost
 * lit pixel centres is 17 and the number of lit columns is 18. The true 17.14
 * sits between them. Reporting one number alone would silently pick a side of
 * the noise floor and call it precision.
 */
import { describe, expect, it } from 'vitest';
import { inkBox } from '../src/core/inkBox';

const ALPHA_HALF = 128;

/**
 * Build an RGBA buffer of `width * height` with `lit` pixels at the given alpha.
 * Colour channels are irrelevant to the rule — only alpha is read.
 */
function buffer(width: number, height: number, lit: Array<[x: number, y: number, alpha: number]>): number[] {
  const data = new Array<number>(width * height * 4).fill(0);
  for (const [x, y, alpha] of lit) data[(y * width + x) * 4 + 3] = alpha;
  return data;
}

describe('inkBox: the §P2 measurement rule', () => {
  it('measures a single lit pixel as span 0, covered 1', () => {
    const box = inkBox(buffer(5, 5, [[2, 3, 255]]), 5, 5, ALPHA_HALF);

    expect(box.minX).toBe(2);
    expect(box.maxX).toBe(2);
    expect(box.spanX).toBe(0);
    expect(box.coveredX).toBe(1);
    expect(box.minY).toBe(3);
    expect(box.spanY).toBe(0);
    expect(box.coveredY).toBe(1);
  });

  it('measures a 3-wide by 4-tall block as span 2x3, covered 3x4', () => {
    const lit: Array<[number, number, number]> = [];
    for (let x = 3; x < 6; x += 1) for (let y = 2; y < 6; y += 1) lit.push([x, y, 255]);

    const box = inkBox(buffer(10, 10, lit), 10, 10, ALPHA_HALF);

    expect([box.spanX, box.spanY]).toEqual([2, 3]);
    expect([box.coveredX, box.coveredY]).toEqual([3, 4]);
  });

  it('EXCLUDES pixels just below the threshold and INCLUDES pixels exactly at it', () => {
    // The antialiasing case the rule exists to settle: a 0.6 px stroke lays down
    // a fringe of partly-covered pixels, and where the box stops must not be a
    // matter of taste.
    const box = inkBox(
      buffer(9, 9, [
        [1, 1, 127], // fringe — below half, excluded
        [4, 4, 128], // exactly half — included
        [6, 6, 255],
        [8, 8, 127], // fringe — below half, excluded
      ]),
      9,
      9,
      ALPHA_HALF,
    );

    expect([box.minX, box.minY, box.maxX, box.maxY]).toEqual([4, 4, 6, 6]);
  });

  it('flags a measurement CLIPPED by the sampled region border', () => {
    // A clipped box reads as a too-small object — the exact failure §2 would
    // send you hunting for a units bug. It must announce itself instead.
    const box = inkBox(buffer(6, 6, [[0, 3, 255]]), 6, 6, ALPHA_HALF);

    expect(box.clipped).toBe(true);
  });

  it('does not flag clipped when the ink has a clear margin on every side', () => {
    const box = inkBox(buffer(6, 6, [[2, 3, 255]]), 6, 6, ALPHA_HALF);

    expect(box.clipped).toBe(false);
  });
});

describe('inkBox: fails closed', () => {
  it('throws when no pixel meets the threshold rather than returning an empty box', () => {
    // Returning zeros here would report "0.0 x 0.0 px" — a number that looks
    // like a measurement and is actually "I rendered nothing".
    expect(() => inkBox(buffer(4, 4, [[1, 1, 100]]), 4, 4, ALPHA_HALF)).toThrow(/no ink/i);
  });

  it('throws when the buffer length does not match width * height * 4', () => {
    expect(() => inkBox(buffer(4, 4, []), 5, 4, ALPHA_HALF)).toThrow(/length/i);
  });
});
