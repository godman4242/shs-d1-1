import { describe, expect, it } from 'vitest';
import { compareProbe, summarize } from '../src/core/fidelityCompare';
import type { FidelityProbe } from '../src/config/fidelity';

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
