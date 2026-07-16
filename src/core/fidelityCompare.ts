import type { FidelityProbe, FidelityScan } from '../config/fidelity';
import { ONE, ZERO } from '../config/nums';

/** One sampled color, 0–255 per channel. */
export type Rgb = readonly [number, number, number];

export interface ProbeResult {
  readonly id: string;
  readonly expected: Rgb;
  readonly actual: Rgb;
  /** Largest per-channel |expected − actual|. */
  readonly maxDelta: number;
  readonly pass: boolean;
}

export interface ScanResult {
  readonly id: string;
  readonly expectedPx: number;
  /** Canvas px where the target color's first sustained run begins (null = never found). */
  readonly foundPx: number | null;
  readonly deltaPx: number;
  readonly pass: boolean;
}

export interface FidelityReport {
  readonly results: readonly ProbeResult[];
  readonly scans: readonly ScanResult[];
  readonly failures: readonly ProbeResult[];
  readonly scanFailures: readonly ScanResult[];
  readonly pass: boolean;
}

/**
 * Compare one measured-reference probe against a sampled color. Pure —
 * pass/fail is per-channel distance within the probe's own tolerance
 * (inclusive). A missing/NaN channel can never pass.
 */
export function compareProbe(probe: FidelityProbe, actual: Rgb): ProbeResult {
  const deltas = probe.rgb.map((expected, channel) => {
    const sampled = actual[channel];
    return sampled === undefined ? Number.POSITIVE_INFINITY : Math.abs(expected - sampled);
  });
  const maxDelta = Math.max(...deltas);
  return {
    id: probe.id,
    expected: probe.rgb,
    actual,
    maxDelta,
    pass: maxDelta <= probe.tol,
  };
}

/**
 * Locate an element edge along a sampled pixel line. Pure — the harness
 * samples the canvas and provides the line's geometry; this finds the first
 * run of ≥ minRun consecutive samples within the scan's color tolerance and
 * compares its start position against the expected edge (inclusive tolPx).
 *
 * `firstPx` is the canvas-px position of samples[0]; `stepPx` is +1/−1 for
 * forward/reverse scans; `expectedPx` is the expected edge in canvas px.
 */
export function compareScan(
  scan: FidelityScan,
  samples: readonly Rgb[],
  firstPx: number,
  stepPx: number,
  expectedPx: number,
): ScanResult {
  const matches = (sample: Rgb): boolean =>
    scan.rgb.every((expected, channel) => {
      const c = sample[channel];
      return c !== undefined && Math.abs(expected - c) <= scan.tol;
    });

  let run = ZERO;
  let foundPx: number | null = null;
  for (let i = ZERO; i < samples.length; i += ONE) {
    const sample = samples[i];
    if (sample !== undefined && matches(sample)) {
      run += ONE;
      if (run >= scan.minRun) {
        foundPx = firstPx + (i - (run - ONE)) * stepPx;
        break;
      }
    } else {
      run = ZERO;
    }
  }

  const deltaPx = foundPx === null ? Number.POSITIVE_INFINITY : Math.abs(foundPx - expectedPx);
  return { id: scan.id, expectedPx, foundPx, deltaPx, pass: deltaPx <= scan.tolPx };
}

/** Roll probe + scan results into a report: pass iff everything passed. */
export function summarize(
  results: readonly ProbeResult[],
  scans: readonly ScanResult[] = [],
): FidelityReport {
  return {
    results,
    scans,
    failures: results.filter((r) => !r.pass),
    scanFailures: scans.filter((s) => !s.pass),
    pass: results.every((r) => r.pass) && scans.every((s) => s.pass),
  };
}
