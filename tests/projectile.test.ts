/**
 * Stage 2 M3 — src/core/projectile.ts: kunai entity math (spec item 5).
 * Pure functions: spawn (velocity toward a target), per-frame step, hit
 * test (radius), arena despawn. The Sim owns the active list and applies
 * damage/deflection; these functions never touch fighter state.
 */
import { describe, expect, it } from 'vitest';
import { PROJECTILE_HIT_RADIUS, PROJECTILE_SPEED } from '../src/config/combat-sim';
import { GAME_WIDTH } from '../src/config/display';
import { FIXED_HZ } from '../src/config/timing';
import { isOffArena, projectileHits, spawnProjectile, stepProjectile } from '../src/core/projectile';

const stepMs = 1000 / FIXED_HZ;

describe('spawnProjectile', () => {
  it('spawns at the origin moving toward the target at PROJECTILE_SPEED', () => {
    const p = spawnProjectile({ x: 400, y: 200 }, { x: 100, y: 200 });
    expect(p.pos).toEqual({ x: 400, y: 200 });
    expect(p.vel.x).toBeCloseTo(-PROJECTILE_SPEED, 10); // straight left
    expect(p.vel.y).toBeCloseTo(0, 10);
  });
  it('normalizes diagonal aim (|vel| = PROJECTILE_SPEED)', () => {
    const p = spawnProjectile({ x: 0, y: 0 }, { x: 300, y: 400 }); // 3-4-5
    expect(Math.hypot(p.vel.x, p.vel.y)).toBeCloseTo(PROJECTILE_SPEED, 10);
    expect(p.vel.x).toBeCloseTo(PROJECTILE_SPEED * 0.6, 10);
    expect(p.vel.y).toBeCloseTo(PROJECTILE_SPEED * 0.8, 10);
  });
});

describe('stepProjectile', () => {
  it('advances one fixed frame: PROJECTILE_SPEED px/ms × stepMs', () => {
    const p = spawnProjectile({ x: 400, y: 200 }, { x: 100, y: 200 });
    const moved = stepProjectile(p);
    expect(moved.pos.x).toBeCloseTo(400 - PROJECTILE_SPEED * stepMs, 10);
    expect(moved.pos.y).toBeCloseTo(200, 10);
  });
});

describe('projectileHits', () => {
  it('hits inside PROJECTILE_HIT_RADIUS, misses outside', () => {
    const p = spawnProjectile({ x: 100 + PROJECTILE_HIT_RADIUS, y: 200 }, { x: 0, y: 200 });
    expect(projectileHits(p, { x: 100, y: 200 })).toBe(true);
    const far = spawnProjectile({ x: 100 + PROJECTILE_HIT_RADIUS + 1, y: 200 }, { x: 0, y: 200 });
    expect(projectileHits(far, { x: 100, y: 200 })).toBe(false);
  });
});

describe('isOffArena', () => {
  it('true only past the horizontal arena bounds', () => {
    const at = (x: number) => spawnProjectile({ x, y: 200 }, { x: x - 100, y: 200 });
    expect(isOffArena(at(-1))).toBe(true);
    expect(isOffArena(at(GAME_WIDTH + 1))).toBe(true);
    expect(isOffArena(at(GAME_WIDTH / 2))).toBe(false);
  });
});
