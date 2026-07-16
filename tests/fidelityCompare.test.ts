import { describe, expect, it } from 'vitest';
import { compareProbe, compareScan, summarize } from '../src/core/fidelityCompare';
import type { Rgb } from '../src/core/fidelityCompare';
import type { FidelityProbe, FidelityScan } from '../src/config/fidelity';

const probe = (over: Partial<FidelityProbe> = {}): FidelityProbe => ({
  id: 'test-probe',
  state: 'fighting',
  x: 0.5,
  y: 0.5,
  rgb: [100, 150, 200],
  tol: 20,
  note: 'unit fixture',
  ...over,
});

const scan = (over: Partial<FidelityScan> = {}): FidelityScan => ({
  id: 'test-scan',
  state: 'fighting',
  axis: 'y',
  at: 0.5,
  from: 0.3,
  to: 0.6,
  edge: 0.4,
  tolPx: 4,
  rgb: [0, 0, 0],
  tol: 20,
  minRun: 3,
  note: 'unit fixture t=0',
  ...over,
});

const WHITE: Rgb = [255, 255, 255];
const BLACK: Rgb = [0, 0, 0];

describe('fidelityCompare — pure comparator (core/, zero literals)', () => {
  it('passes when every channel is within tolerance', () => {
    const r = compareProbe(probe(), [110, 140, 210]);
    expect(r.pass).toBe(true);
    expect(r.maxDelta).toBe(10);
  });

  it('fails when any single channel exceeds tolerance', () => {
    const r = compareProbe(probe(), [100, 150, 221]);
    expect(r.pass).toBe(false);
    expect(r.maxDelta).toBe(21);
  });

  it('passes exactly AT the tolerance boundary (inclusive)', () => {
    const r = compareProbe(probe(), [120, 150, 200]);
    expect(r.maxDelta).toBe(20);
    expect(r.pass).toBe(true);
  });

  it('reports the max delta across channels, not the first', () => {
    const r = compareProbe(probe(), [101, 165, 202]);
    expect(r.maxDelta).toBe(15);
  });

  it('carries id, expected and actual through for the report', () => {
    const r = compareProbe(probe({ id: 'hp-bar-left' }), [1, 2, 3]);
    expect(r.id).toBe('hp-bar-left');
    expect(r.expected).toEqual([100, 150, 200]);
    expect(r.actual).toEqual([1, 2, 3]);
  });

  it('summarize: pass only when every probe passes', () => {
    const ok = compareProbe(probe(), [100, 150, 200]);
    const bad = compareProbe(probe({ id: 'other' }), [0, 0, 0]);
    expect(summarize([ok]).pass).toBe(true);
    expect(summarize([ok, bad]).pass).toBe(false);
  });

  it('summarize: failures lists exactly the failing probes in order', () => {
    const ok = compareProbe(probe({ id: 'a' }), [100, 150, 200]);
    const bad1 = compareProbe(probe({ id: 'b' }), [255, 150, 200]);
    const bad2 = compareProbe(probe({ id: 'c' }), [100, 255, 200]);
    const rep = summarize([ok, bad1, bad2]);
    expect(rep.failures.map((f) => f.id)).toEqual(['b', 'c']);
    expect(rep.results).toHaveLength(3);
  });

  it('an empty report passes (no probes = nothing violated)', () => {
    expect(summarize([]).pass).toBe(true);
    expect(summarize([]).failures).toEqual([]);
  });
});

describe('compareScan — edge-position scans (pure, core/)', () => {
  // A scan line: 5 non-matching samples then the target color from index 5.
  const row = (...runs: Array<[Rgb, number]>): Rgb[] =>
    runs.flatMap(([rgb, n]) => Array.from({ length: n }, () => rgb));

  it('finds the edge exactly at the expected position', () => {
    const samples = row([WHITE, 5], [BLACK, 10]);
    const r = compareScan(scan(), samples, 100, 1, 105);
    expect(r.foundPx).toBe(105);
    expect(r.deltaPx).toBe(0);
    expect(r.pass).toBe(true);
  });

  it('passes inside and exactly AT tolPx (inclusive), fails beyond it', () => {
    const samples = row([WHITE, 5], [BLACK, 10]);
    expect(compareScan(scan(), samples, 100, 1, 103).pass).toBe(true);
    expect(compareScan(scan(), samples, 100, 1, 101).pass).toBe(true); // delta 4 == tolPx
    expect(compareScan(scan(), samples, 100, 1, 100).pass).toBe(false); // delta 5
  });

  it('ignores a noise run shorter than minRun', () => {
    // one stray black pixel at index 1, real black run starts at index 6
    const samples = row([WHITE, 1], [BLACK, 1], [WHITE, 4], [BLACK, 8]);
    const r = compareScan(scan(), samples, 0, 1, 6);
    expect(r.foundPx).toBe(6);
    expect(r.pass).toBe(true);
  });

  it('fails with a null foundPx when the target color never appears', () => {
    const samples = row([WHITE, 20]);
    const r = compareScan(scan(), samples, 0, 1, 10);
    expect(r.foundPx).toBeNull();
    expect(r.pass).toBe(false);
    expect(r.deltaPx).toBe(Number.POSITIVE_INFINITY);
  });

  it('computes foundPx correctly on a reverse scan (stepPx = -1)', () => {
    // scanning upward from px 200: matches begin at the 5th sample => px 196
    const samples = row([WHITE, 4], [BLACK, 10]);
    const r = compareScan(scan(), samples, 200, -1, 196);
    expect(r.foundPx).toBe(196);
    expect(r.pass).toBe(true);
  });

  it('matches within the color tolerance only', () => {
    const nearBlack: Rgb = [10, 10, 10];
    const tooLight: Rgb = [30, 30, 30];
    const okRun = row([WHITE, 5], [nearBlack, 5]);
    const badRun = row([WHITE, 5], [tooLight, 5]);
    expect(compareScan(scan(), okRun, 0, 1, 5).pass).toBe(true);
    expect(compareScan(scan(), badRun, 0, 1, 5).foundPx).toBeNull();
  });

  it('summarize folds scan failures into the overall verdict', () => {
    const okPoint = compareProbe(probe(), [100, 150, 200]);
    const okScan = compareScan(scan({ id: 's-ok' }), row([WHITE, 5], [BLACK, 5]), 0, 1, 5);
    const badScan = compareScan(scan({ id: 's-bad' }), row([WHITE, 10]), 0, 1, 5);
    const good = summarize([okPoint], [okScan]);
    expect(good.pass).toBe(true);
    expect(good.scanFailures).toEqual([]);
    const bad = summarize([okPoint], [okScan, badScan]);
    expect(bad.pass).toBe(false);
    expect(bad.scanFailures.map((s) => s.id)).toEqual(['s-bad']);
  });
});
