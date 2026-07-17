/**
 * core/fighterAnimator — per-fighter pose state machine (Stage 4 M0,
 * ported from iaido-duel's fighterAnimator.test.ts, same-owner original
 * code; RED-first). Owns base locomotion (idle breath / distance-driven
 * walk stride, Session 8) + transient overlays (slash / hit / death) +
 * the smoothed guard hold.
 */
import { describe, expect, it } from 'vitest';
import { FighterAnimator } from '../src/core/fighterAnimator';
import { WALK } from '../src/config/anim';
import { IDLE_POSE } from '../src/config/poses';

const run = (a: FighterAnimator, ms: number, step = 16, dx = 0): ReturnType<FighterAnimator['update']> => {
  let pose = IDLE_POSE;
  for (let t = 0; t < ms; t += step) pose = a.update(step, dx);
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
    const p = run(a, 200, 16, 4); // translating 4px per frame
    expect(Math.abs(p.footF.x - IDLE_POSE.footF.x)).toBeGreaterThan(2);
    expect(Math.sign(p.footF.x - IDLE_POSE.footF.x)).toBe(-Math.sign(p.footB.x - IDLE_POSE.footB.x));
  });

  it('stride phase advances with DISTANCE, never wall time (no foot-skating)', () => {
    // chaos case: locomotion feed disconnected (dx=0) — legs must freeze
    const parked = new FighterAnimator();
    for (let i = 0; i < 60; i++) parked.update(16);
    const frozen = parked.update(16);
    expect(frozen.footF.x).toBe(IDLE_POSE.footF.x); // idle breath never moves feet

    // same distance, wildly different wall time ⇒ identical stride pose
    // (sample the LAST MOVING update — a dx=0 call correctly falls back to idle)
    const slow = new FighterAnimator();
    const fast = new FighterAnimator();
    let ps = IDLE_POSE;
    let pf = IDLE_POSE;
    for (let i = 0; i < 80; i++) ps = slow.update(16, 0.5); // 1280ms, 40px
    for (let i = 0; i < 4; i++) pf = fast.update(16, 10); //     64ms, 40px
    expect(pf.footF.x).toBeCloseTo(ps.footF.x, 6);
    expect(pf.footB.y).toBeCloseTo(ps.footB.y, 6);
  });

  it('the cycle closes after exactly one measured stride length', () => {
    const a = new FighterAnimator();
    const before = a.update(16, WALK.stridePx); // one full stride ⇒ phase wraps to 0
    let after = IDLE_POSE;
    for (let i = 0; i < 16; i++) after = a.update(16, WALK.stridePx / 16);
    expect(after.footF.x).toBeCloseTo(before.footF.x, 4);
    expect(after.footB.x).toBeCloseTo(before.footB.x, 4);
  });

  it('retreating (negative dx) runs the stride cycle backward', () => {
    const a = new FighterAnimator();
    let mid = IDLE_POSE;
    for (let i = 0; i < 5; i++) mid = a.update(16, 6); // forward: phase advances
    expect(mid.footF.x).not.toBeCloseTo(IDLE_POSE.footF.x, 2);
    let home = IDLE_POSE;
    for (let i = 0; i < 5; i++) home = a.update(16, -6); // step back the same distance
    expect(home.footF.x).toBeCloseTo(IDLE_POSE.footF.x, 4); // cycle rewound to plant
  });

  it('measured amplitude pin: mid-swing front foot reaches the config footSwing', () => {
    const a = new FighterAnimator();
    // advance exactly a quarter stride: sin(2π·0.25)=1 ⇒ full forward swing
    const quarter = WALK.stridePx / 4;
    let p = IDLE_POSE;
    for (let i = 0; i < 10; i++) p = a.update(16, quarter / 10);
    expect(p.footF.x - IDLE_POSE.footF.x).toBeCloseTo(WALK.footSwing, 1);
    expect(IDLE_POSE.footF.y - p.footF.y).toBeCloseTo(WALK.footLift, 1);
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

  it('death collapses to the ground and is terminal (movement/guard ignored)', () => {
    const a = new FighterAnimator();
    a.startDeath();
    const p = run(a, 500);
    expect(p.head.y).toBeGreaterThan(30); // on the ground plane (DEAD band)
    expect(a.isDead).toBe(true);
    a.setGuard('block');
    const p2 = a.update(16, 8); // corpses do not walk
    expect(p2.head.y).toBeGreaterThan(30); // still down
    expect(a.guardLevel()).toBe('none');
  });
});
