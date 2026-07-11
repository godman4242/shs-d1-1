/**
 * Gesture classification (Stage 1 item 6). Video-confirmed map
 * (SYNTHESIS §5): horizontal=slash · up=jump · up-flick=launch · down=stab.
 * Screen coordinates: +y is DOWN. Net displacement (last − first) picks the
 * sector; path length separates flick (launch) from full up-stroke (jump).
 * Degenerate strokes (<2 points, zero net) fall out as slash — the harmless
 * default; callers gate on stroke length before acting.
 */
import { GESTURE_DIAG_DEG, LAUNCH_FLICK_MAX_LEN } from '../config/gesture';
import { HALF_TURN_DEG, ONE, ZERO } from '../config/nums';
import { polylineLength } from './geometry';
import { sub, type Vec } from './vec';

export type Gesture = 'slash' | 'jump' | 'launch' | 'stab';

const DIAG_RAD = (GESTURE_DIAG_DEG * Math.PI) / HALF_TURN_DEG;

export function classifyGesture(points: readonly Vec[]): Gesture {
  const first = points.at(ZERO);
  const last = points.at(-ONE);
  if (first === undefined || last === undefined) return 'slash';
  const net = sub(last, first);
  const angleFromHorizontal = Math.atan2(Math.abs(net.y), Math.abs(net.x));
  if (angleFromHorizontal <= DIAG_RAD) return 'slash';
  if (net.y > ZERO) return 'stab';
  return polylineLength(points) < LAUNCH_FLICK_MAX_LEN ? 'launch' : 'jump';
}
