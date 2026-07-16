/**
 * core/fighterAnimator — per-fighter pose state machine (Stage 4 M0,
 * ported from iaido-duel's fighterAnimator.test.ts, same-owner original
 * code; RED-first). Owns base locomotion (idle breath / walk) + transient
 * overlays (slash / hit / death) + the smoothed guard hold.
 */
import { describe, expect, it } from 'vitest';
import { FighterAnimator } from '../src/core/fighterAnimator';
import { IDLE_POSE } from '../src/config/poses';

const run = (a: FighterAnimator, ms: number, step = 16): ReturnType<FighterAnimator['update']> => {
  let pose = IDLE_POSE;
  for (let t = 0; t < ms; t += step) pose = a.update(step);
  return pose;
};

describe('FighterAnimator', () => {
  it('idle breathing makes the head bob over time', () => {
    const a = new FighterAnimator();
    const p1 = a.update(16);
    const p2 = run(a, 800);
    expect(p1.head.y).not.toBeCloseTo(p2.head.y, 3);
    expect(a.actionName()).toBe('none');
  });

  it('walking moves the feet apart from the idle stance, in antiphase', () => {
    const a = new FighterAnimator();
    a.setMoving(true);
    const p = run(a, 200);
    expect(Math.abs(p.footF.x - IDLE_POSE.footF.x)).toBeGreaterThan(2);
    expect(Math.sign(p.footF.x - IDLE_POSE.footF.x)).toBe(-Math.sign(p.footB.x - IDLE_POSE.footB.x));
  });

  it('slash drives the sword hand forward during the strike then returns to none', () => {
    const a = new FighterAnimator();
    a.startSlash();
    let forward = -Infinity;
    for (let t = 0; t < 200; t += 16) {
      const p = a.update(16);
      forward = Math.max(forward, p.handF.x);
    }
    expect(forward).toBeGreaterThan(IDLE_POSE.handF.x + 10);
    run(a, 600); // let it finish
    expect(a.actionName()).toBe('none');
  });

  it('per-stance arcs (Tell 6): Light sweeps a longer arc AND finishes faster than Heavy', () => {
    const runSlash = (stance: 'light' | 'heavy'): { maxSwordX: number; ms: number } => {
      const a = new FighterAnimator();
      a.startSlash(stance);
      let maxSwordX = -Infinity;
      let ms = 0;
      for (let t = 0; t < 1200; t += 8) {
        const p = a.update(8);
        maxSwordX = Math.max(maxSwordX, p.sword.x);
        if (a.actionName() !== 'slash') {
          ms = t;
          break;
        }
      }
      return { maxSwordX, ms };
    };
    const light = runSlash('light');
    const heavy = runSlash('heavy');
    expect(light.maxSwordX).toBeGreaterThan(heavy.maxSwordX); // longer reach arc
    expect(light.ms).toBeLessThan(heavy.ms); // fewer frames — faster swing
  });

  it('hit recoil knocks the head back then eases home', () => {
    const a = new FighterAnimator();
    a.startHit();
    const p = run(a, 90, 15); // inside the recoil phase
    expect(p.head.x).toBeLessThan(IDLE_POSE.head.x);
    run(a, 400); // recoil + return fully elapsed
    expect(a.actionName()).toBe('none');
  });

  it('a slash cannot be interrupted by a hit reaction', () => {
    const a = new FighterAnimator();
    a.startSlash();
    a.startHit(); // ignored mid-slash
    expect(a.actionName()).toBe('slash');
  });

  it('guard=telegraph blends toward the wind-up and holds', () => {
    const a = new FighterAnimator();
    a.setGuard('telegraph');
    const p = run(a, 300);
    expect(p.sword.x).toBeLessThan(0); // wind-up sword is behind the body
    expect(a.guardLevel()).toBe('telegraph');
  });

  it('startDeath re-entry guard: a second call must not rewind the collapse', () => {
    const a = new FighterAnimator();
    a.startDeath();
    const collapsed = run(a, 500); // > deathMs — fully down
    expect(collapsed.head.y).toBeGreaterThan(IDLE_POSE.head.y);
    a.startDeath(); // second call — must be a no-op
    const p = a.update(16);
    expect(p.head.y).toBeCloseTo(collapsed.head.y, 1);
  });

  it('death collapses to the ground and is terminal (moving/guard ignored)', () => {
    const a = new FighterAnimator();
    a.startDeath();
    const p = run(a, 500);
    expect(p.head.y).toBeGreaterThan(30); // on the ground plane (DEAD band)
    expect(a.isDead).toBe(true);
    a.setMoving(true);
    a.setGuard('block');
    const p2 = a.update(16);
    expect(p2.head.y).toBeGreaterThan(30); // still down
    expect(a.guardLevel()).toBe('none');
  });
});
