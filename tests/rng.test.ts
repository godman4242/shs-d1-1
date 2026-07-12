/**
 * Stage 2 item — src/core/rng.ts: seeded mulberry32, the only randomness
 * source core/ may use (Math.random is banned there). Constants live in
 * src/config/rng.ts; this suite pins behavior against an independent
 * reference implementation so a constant transcription slip cannot hide.
 */
import { describe, expect, it } from 'vitest';
import { mulberry32 } from '../src/core/rng';

/** Canonical mulberry32 (Tommy Ettinger, public domain) — reference copy. */
function reference(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('mulberry32', () => {
  it('matches the canonical algorithm exactly (seeds 1, 42, 2^31)', () => {
    for (const seed of [1, 42, 2 ** 31]) {
      const ours = mulberry32(seed);
      const ref = reference(seed);
      for (let i = 0; i < 20; i++) expect(ours()).toBe(ref());
    }
  });
  it('is deterministic: same seed → identical sequence', () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    for (let i = 0; i < 10; i++) expect(a()).toBe(b());
  });
  it('different seeds diverge', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).not.toEqual(seqB);
  });
  it('always yields values in [0, 1)', () => {
    const r = mulberry32(999);
    for (let i = 0; i < 1000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
  it('seeds wrap to uint32 (-1 behaves as 0xFFFFFFFF)', () => {
    const a = mulberry32(-1);
    const b = mulberry32(0xffffffff);
    for (let i = 0; i < 5; i++) expect(a()).toBe(b());
  });
  it('is roughly uniform (1000 draws, loose mean check)', () => {
    const r = mulberry32(7);
    let sum = 0;
    for (let i = 0; i < 1000; i++) sum += r();
    expect(sum / 1000).toBeGreaterThan(0.45);
    expect(sum / 1000).toBeLessThan(0.55);
  });
});
