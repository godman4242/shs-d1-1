/**
 * core/trajectory.ts — jumpArcPoint(t, start, end, apex), pulled forward
 * from the Stage 2 list (STAGE1_KICKOFF deviation, logged): the Stage 1 gate
 * item "line up → jump (start.x → end.x, arc)" needs the arc function now.
 * Screen coordinates: +y is DOWN, so the apex SUBTRACTS from y.
 */
import { describe, expect, it } from 'vitest';
import { jumpArcPoint } from '../src/core/trajectory';
import type { Vec } from '../src/core/vec';

const start: Vec = { x: 100, y: 400 };
const end: Vec = { x: 300, y: 400 };

describe('jumpArcPoint', () => {
  it('t=0 is the start, t=1 is the end', () => {
    expect(jumpArcPoint(0, start, end, 120)).toEqual(start);
    expect(jumpArcPoint(1, start, end, 120)).toEqual(end);
  });
  it('t=0.5 is the horizontal midpoint at full apex height', () => {
    expect(jumpArcPoint(0.5, start, end, 120)).toEqual({ x: 200, y: 280 });
  });
  it('clamps t outside [0,1]', () => {
    expect(jumpArcPoint(-1, start, end, 120)).toEqual(start);
    expect(jumpArcPoint(2, start, end, 120)).toEqual(end);
  });
  it('apex 0 degenerates to straight interpolation', () => {
    expect(jumpArcPoint(0.25, start, end, 0)).toEqual({ x: 150, y: 400 });
  });
  it('interpolates sloped ground (start and end at different heights)', () => {
    const high: Vec = { x: 0, y: 100 };
    const low: Vec = { x: 100, y: 300 };
    const mid = jumpArcPoint(0.5, high, low, 50);
    expect(mid.x).toBe(50);
    expect(mid.y).toBe(150); // lerp 200 − apex 50
  });
});
