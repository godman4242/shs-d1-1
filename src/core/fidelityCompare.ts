import type { FidelityProbe } from '../config/fidelity';

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

export interface FidelityReport {
  readonly results: readonly ProbeResult[];
  readonly failures: readonly ProbeResult[];
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

/** Roll probe results into a report: pass iff every probe passed. */
export function summarize(results: readonly ProbeResult[]): FidelityReport {
  return {
    results,
    failures: results.filter((r) => !r.pass),
    pass: results.every((r) => r.pass),
  };
}
