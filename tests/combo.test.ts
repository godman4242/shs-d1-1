/**
 * Stage 2 M3 — src/core/combo.ts: the HIT COMBO counter.
 * COMBO_RULES (SYNTHESIS §7, CONTRACT): resets to 1 (not 0) per kill;
 * breaks on damage taken and on gaps in the hit chain. Escalates +1 per
 * consecutive hit. Pure counter — no damage effect (video evidence shows
 * a HUD counter only).
 */
import { describe, expect, it } from 'vitest';
import { COMBO_CHAIN_GAP_S } from '../src/config/combat';
import { FIXED_HZ } from '../src/config/timing';
import { Combo } from '../src/core/combo';

const gapFrames = COMBO_CHAIN_GAP_S * FIXED_HZ;

describe('Combo — escalation', () => {
  it('starts at 0 (no combo shown until the first hit)', () => {
    expect(new Combo().value).toBe(0);
  });
  it('escalates +1 per hit inside the chain window', () => {
    const c = new Combo();
    expect(c.hit(10)).toBe(1);
    expect(c.hit(20)).toBe(2);
    expect(c.hit(30)).toBe(3);
  });
  it('a hit exactly AT the gap boundary still chains', () => {
    const c = new Combo();
    c.hit(100);
    expect(c.hit(100 + gapFrames)).toBe(2);
  });
});

describe('Combo — breaks (to 0) on damage taken', () => {
  it('damage taken zeroes the chain; the next hit starts at 1', () => {
    const c = new Combo();
    c.hit(10);
    c.hit(20);
    c.damaged();
    expect(c.value).toBe(0);
    expect(c.hit(30)).toBe(1);
  });
});

describe('Combo — breaks (to 1) on chain gaps', () => {
  it('a hit past the gap window restarts the chain at 1', () => {
    const c = new Combo();
    c.hit(10);
    c.hit(20);
    expect(c.hit(21 + gapFrames)).toBe(1);
  });
});

describe('Combo — kills reset to 1, not 0 (CONTRACT: B-11, B-21, B-28)', () => {
  it('a kill sets the counter to exactly 1', () => {
    const c = new Combo();
    c.hit(10);
    c.hit(20);
    c.hit(30);
    c.kill(30);
    expect(c.value).toBe(1);
  });
  it('the chain continues from 1 after a quick follow-up hit', () => {
    const c = new Combo();
    c.hit(10);
    c.kill(10);
    expect(c.hit(20)).toBe(2);
  });
});
