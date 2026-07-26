/**
 * Kunai entity math (Stage 2 spec item 5) — pure functions only. The Sim
 * owns the active list, applies damage/deflection, and enforces the
 * PROJECTILE_MAX_ACTIVE cap; nothing here touches fighter state.
 * Kunai fly straight at the target's position at throw time (INFERRED —
 * arrows arc in the study footage, thrown blades do not).
 */
import { PROJECTILE_HIT_RADIUS, PROJECTILE_SPEED } from '../config/combat-sim';
import { WORLD_WIDTH } from '../config/display';
import { ZERO } from '../config/nums';
import { FIXED_HZ, MS_PER_S } from '../config/timing';
import { sub } from './vec';
import type { Vec } from './vec';

export interface Projectile {
  pos: Vec;
  /** px per ms — |vel| = PROJECTILE_SPEED. */
  vel: Vec;
}

/** Spawn at `from`, aimed at `target`, at PROJECTILE_SPEED px/ms. */
export function spawnProjectile(from: Vec, target: Vec): Projectile {
  const aim = sub(target, from);
  const len = Math.hypot(aim.x, aim.y);
  const dir = len > ZERO ? { x: aim.x / len, y: aim.y / len } : { x: ZERO, y: ZERO };
  return {
    pos: { ...from },
    vel: { x: dir.x * PROJECTILE_SPEED, y: dir.y * PROJECTILE_SPEED },
  };
}

/** Advance one fixed frame (velocity is px/ms; one frame is MS_PER_S/FIXED_HZ ms). */
export function stepProjectile(p: Projectile): Projectile {
  const stepMs = MS_PER_S / FIXED_HZ;
  return {
    pos: { x: p.pos.x + p.vel.x * stepMs, y: p.pos.y + p.vel.y * stepMs },
    vel: p.vel,
  };
}

/** True when the kunai is within PROJECTILE_HIT_RADIUS of the target point. */
export function projectileHits(p: Projectile, target: Vec): boolean {
  return Math.hypot(p.pos.x - target.x, p.pos.y - target.y) <= PROJECTILE_HIT_RADIUS;
}

/** True once the kunai has left the horizontal WORLD bounds (A0). */
export function isOffArena(p: Projectile): boolean {
  return p.pos.x < ZERO || p.pos.x > WORLD_WIDTH;
}
