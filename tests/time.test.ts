/**
 * Stage 2 M4 — src/core/time.ts: the ONE ms→frames conversion (ceil — a
 * telegraph/window never rounds shorter than its ms contract).
 */
import { describe, expect, it } from 'vitest';
import { msToFrames } from '../src/core/time';

describe('msToFrames', () => {
  it('converts at FIXED_HZ with ceil', () => {
    expect(msToFrames(1000)).toBe(60);
    expect(msToFrames(520)).toBe(32); // 31.2 → 32 (Normal telegraph)
    expect(msToFrames(4960)).toBe(298); // 297.6 → 298 (chi punch CD)
    expect(msToFrames(0)).toBe(0);
  });
});
