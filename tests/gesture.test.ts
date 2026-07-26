/**
 * Stage 1 item 6 — src/core/gesture.ts: classifyGesture(points).
 * Video-confirmed map (SYNTHESIS §5): horizontal=slash · up=jump ·
 * up-flick=launch · down=stab. Screen coordinates: +y is DOWN, so an
 * "up" stroke has decreasing y.
 */
import { describe, expect, it } from 'vitest';
import { classifyGesture } from '../src/core/gesture';
import type { Vec } from '../src/core/vec';

const v = (x: number, y: number): Vec => ({ x, y });

describe('classifyGesture — horizontal strokes are slashes', () => {
  it('left-to-right', () => {
    expect(classifyGesture([v(0, 100), v(200, 100)])).toBe('slash');
  });
  it('right-to-left', () => {
    expect(classifyGesture([v(200, 100), v(0, 100)])).toBe('slash');
  });
  it('shallow diagonal (~30° above horizontal) still slashes', () => {
    expect(classifyGesture([v(0, 100), v(173, 0)])).toBe('slash');
  });
  it('a wavy but net-horizontal stroke slashes (net direction governs)', () => {
    expect(classifyGesture([v(0, 100), v(50, 80), v(100, 120), v(200, 100)])).toBe('slash');
  });
});

describe('classifyGesture — long up strokes jump', () => {
  it('straight up', () => {
    expect(classifyGesture([v(50, 300), v(50, 0)])).toBe('jump');
  });
  it('steep diagonal up (~60° above horizontal)', () => {
    expect(classifyGesture([v(0, 300), v(100, 127)])).toBe('jump');
  });
  it('up stroke just past the flick cutoff jumps (length 76 ≥ 75)', () => {
    expect(classifyGesture([v(0, 76), v(0, 0)])).toBe('jump');
  });
});

describe('classifyGesture — short up flicks launch', () => {
  it('short straight-up flick (length 50)', () => {
    expect(classifyGesture([v(0, 50), v(0, 0)])).toBe('launch');
  });
  it('up stroke just under the flick cutoff launches (length 74 < 75)', () => {
    expect(classifyGesture([v(0, 74), v(0, 0)])).toBe('launch');
  });
});

describe('classifyGesture — down strokes stab', () => {
  it('straight down', () => {
    expect(classifyGesture([v(50, 0), v(50, 200)])).toBe('stab');
  });
  it('steep diagonal down', () => {
    expect(classifyGesture([v(0, 0), v(100, 173)])).toBe('stab');
  });
  it('a short down stroke is still a stab, never a launch', () => {
    expect(classifyGesture([v(0, 0), v(0, 40)])).toBe('stab');
  });
});

describe('classifyGesture — the 45° sector boundary is inclusive (slash)', () => {
  // atan2(100,100) === 45·π/180 exactly in doubles — pins the load-bearing `<=`.
  it('an exactly-45° up-diagonal is still a slash', () => {
    expect(classifyGesture([v(0, 100), v(100, 0)])).toBe('slash');
  });
  it('an exactly-45° down-diagonal is still a slash', () => {
    expect(classifyGesture([v(0, 0), v(100, 100)])).toBe('slash');
  });
});

describe('classifyGesture — degenerate input', () => {
  it('empty and single-point strokes default to slash (harmless no-op class)', () => {
    expect(classifyGesture([])).toBe('slash');
    expect(classifyGesture([v(5, 5)])).toBe('slash');
  });
  it('zero net displacement (closed loop) defaults to slash', () => {
    expect(classifyGesture([v(0, 0), v(50, 50), v(0, 0)])).toBe('slash');
  });
});
