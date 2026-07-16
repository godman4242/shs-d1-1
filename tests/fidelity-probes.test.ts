import { describe, expect, it } from 'vitest';
import { BAR_GRADIENTS, FIDELITY_PROBES } from '../src/config/fidelity';

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

  it('states are limited to the two canonical sampling states', () => {
    for (const p of FIDELITY_PROBES) {
      expect(['fighting', 'result-win'], p.id).toContain(p.state);
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
