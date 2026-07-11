/**
 * Jump trajectory (Stage 2 item 6, pulled forward — the Stage 1 gate item
 * "line up → jump (start.x → end.x, arc)" needs it; deviation logged in the
 * session log). Pure parabola: peak `apex` px above the straight start→end
 * interpolation at t=0.5. Screen coordinates: +y is DOWN, so apex subtracts.
 */
import { FOUR, ONE, ZERO } from '../config/nums';
import { lerp, type Vec } from './vec';

export function jumpArcPoint(t: number, start: Vec, end: Vec, apex: number): Vec {
  const tc = t < ZERO ? ZERO : t > ONE ? ONE : t;
  const onGroundLine = lerp(start, end, tc);
  return { x: onGroundLine.x, y: onGroundLine.y - apex * FOUR * tc * (ONE - tc) };
}
