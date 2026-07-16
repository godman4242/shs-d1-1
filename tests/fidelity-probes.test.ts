import { describe, expect, it } from 'vitest';
import { BAR_GRADIENTS, FIDELITY_PROBES, FIDELITY_SCANS } from '../src/config/fidelity';

const CANONICAL_STATES = [
  'fighting',
  'result-win',
  'result-defeat',
  'vs-intro',
  'fight-splash',
] as const;

/**
 * Schema sanity for the measured fidelity assertions (config/fidelity.ts).
 * The VALUES are frame-measured CONTRACT data — pinned here only in shape,
 * never re-derived (provenance lives in each probe's note).
 */
describe('fidelity probes — schema sanity', () => {
  it('has at least a dozen probes (a thin gate is a lying gate)', () => {
    expect(FIDELITY_PROBES.length).toBeGreaterThanOrEqual(12);
  });

  it('ids are unique', () => {
    const ids = FIDELITY_PROBES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('coords are normalized fractions in [0, 1]', () => {
    for (const p of FIDELITY_PROBES) {
      expect(p.x, p.id).toBeGreaterThanOrEqual(0);
      expect(p.x, p.id).toBeLessThanOrEqual(1);
      expect(p.y, p.id).toBeGreaterThanOrEqual(0);
      expect(p.y, p.id).toBeLessThanOrEqual(1);
    }
  });

  it('rgb channels are 0-255 integers', () => {
    for (const p of FIDELITY_PROBES) {
      expect(p.rgb, p.id).toHaveLength(3);
      for (const c of p.rgb) {
        expect(Number.isInteger(c), p.id).toBe(true);
        expect(c, p.id).toBeGreaterThanOrEqual(0);
        expect(c, p.id).toBeLessThanOrEqual(255);
      }
    }
  });

  it('tolerances are positive and honest (no pass-everything probes)', () => {
    for (const p of FIDELITY_PROBES) {
      expect(p.tol, p.id).toBeGreaterThan(0);
      expect(p.tol, p.id).toBeLessThanOrEqual(32);
    }
  });

  it('every probe cites its source frame in the note', () => {
    for (const p of FIDELITY_PROBES) {
      expect(p.note, p.id).toMatch(/t=\d+/);
    }
  });

  it('states are limited to the canonical sampling states', () => {
    for (const p of FIDELITY_PROBES) {
      expect(CANONICAL_STATES, p.id).toContain(p.state);
    }
  });
});

describe('fidelity scans — schema sanity (v2 slice 2b edge-scan kind)', () => {
  it('the dense gate holds: >= 40 probes total across >= 4 states', () => {
    expect(FIDELITY_PROBES.length + FIDELITY_SCANS.length).toBeGreaterThanOrEqual(40);
    const states = new Set([
      ...FIDELITY_PROBES.map((p) => p.state),
      ...FIDELITY_SCANS.map((s) => s.state),
    ]);
    expect(states.size).toBeGreaterThanOrEqual(4);
  });

  it('ids are unique across probes AND scans', () => {
    const ids = [...FIDELITY_PROBES.map((p) => p.id), ...FIDELITY_SCANS.map((s) => s.id)];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('states are canonical', () => {
    for (const s of FIDELITY_SCANS) {
      expect(CANONICAL_STATES, s.id).toContain(s.state);
    }
  });

  it('line coords are normalized and the expected edge lies on the scan line', () => {
    for (const s of FIDELITY_SCANS) {
      for (const v of [s.at, s.from, s.to, s.edge]) {
        expect(v, s.id).toBeGreaterThanOrEqual(0);
        expect(v, s.id).toBeLessThanOrEqual(1);
      }
      expect(s.edge, s.id).toBeGreaterThanOrEqual(Math.min(s.from, s.to));
      expect(s.edge, s.id).toBeLessThanOrEqual(Math.max(s.from, s.to));
      expect(s.from, s.id).not.toBe(s.to);
    }
  });

  it('color + position tolerances are positive and honest', () => {
    for (const s of FIDELITY_SCANS) {
      expect(s.tol, s.id).toBeGreaterThan(0);
      expect(s.tol, s.id).toBeLessThanOrEqual(32);
      expect(s.tolPx, s.id).toBeGreaterThan(0);
      expect(s.tolPx, s.id).toBeLessThanOrEqual(8);
      expect(s.minRun, s.id).toBeGreaterThanOrEqual(2);
      expect(s.minRun, s.id).toBeLessThanOrEqual(10);
    }
  });

  it('rgb channels are 0-255 integers', () => {
    for (const s of FIDELITY_SCANS) {
      expect(s.rgb, s.id).toHaveLength(3);
      for (const c of s.rgb) {
        expect(Number.isInteger(c), s.id).toBe(true);
        expect(c, s.id).toBeGreaterThanOrEqual(0);
        expect(c, s.id).toBeLessThanOrEqual(255);
      }
    }
  });

  it('every scan cites its source frame in the note', () => {
    for (const s of FIDELITY_SCANS) {
      expect(s.note, s.id).toMatch(/t=\d+/);
    }
  });
});

describe('bar gradients — measured per-stage-row color stops', () => {
  it('carries one color per stage row of each bar (hp 9, chi 8, focus 9)', () => {
    expect(BAR_GRADIENTS.hp).toHaveLength(9);
    expect(BAR_GRADIENTS.chi).toHaveLength(8);
    expect(BAR_GRADIENTS.focus).toHaveLength(9);
  });

  it('every stop is a valid 24-bit color', () => {
    for (const rows of [BAR_GRADIENTS.hp, BAR_GRADIENTS.chi, BAR_GRADIENTS.focus]) {
      for (const c of rows) {
        expect(Number.isInteger(c)).toBe(true);
        expect(c).toBeGreaterThanOrEqual(0);
        expect(c).toBeLessThanOrEqual(0xffffff);
      }
    }
  });

  it('gradients actually grade (top stop differs from bottom stop)', () => {
    expect(BAR_GRADIENTS.hp[0]).not.toBe(BAR_GRADIENTS.hp[8]);
    expect(BAR_GRADIENTS.chi[0]).not.toBe(BAR_GRADIENTS.chi[7]);
    expect(BAR_GRADIENTS.focus[0]).not.toBe(BAR_GRADIENTS.focus[8]);
  });
});
