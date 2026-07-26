/**
 * src/core/combo.ts — the HIT COMBO counter, CORRECTED from source
 * (SESSION13 D8, 2026-07-26).
 *
 * ⚠️ THE STAGE-2 "CONTRACT" WAS WRONG. It said the chain resets to **1 on a
 * kill** and breaks on a gap of COMBO_CHAIN_GAP_S. The payload says otherwise:
 * the counter is **purely cosmetic**, resets to **0**, and **only when the
 * player takes damage** — never on a kill, and with **no gap decay at all**.
 * The old belief and its correction are recorded in `docs/DIVERGENCES.md`;
 * `COMBO_CHAIN_GAP_S` and `Combo.kill()` are deleted, not quietly retired.
 *
 * Consequence worth stating: the counter no longer needs the Sim clock, so
 * `hit()` takes no frame argument. A signature that still wanted one would be
 * modelling decay that does not exist.
 */
import { describe, expect, it } from 'vitest';
import { Combo } from '../src/core/combo';

describe('Combo — escalation', () => {
  it('starts at 0 (no combo shown until the first hit)', () => {
    expect(new Combo().value).toBe(0);
  });
  it('escalates +1 per hit, unconditionally', () => {
    const c = new Combo();
    expect(c.hit()).toBe(1);
    expect(c.hit()).toBe(2);
    expect(c.hit()).toBe(3);
  });
});

describe('Combo — NO gap decay (D8: the chain never times out)', () => {
  it('an arbitrarily late hit still chains — there is no gap window', () => {
    const c = new Combo();
    c.hit();
    c.hit();
    // Nothing advances the counter's state but hits and damage, so any
    // amount of intervening time is irrelevant by construction.
    expect(c.hit()).toBe(3);
  });
});

describe('Combo — damage taken is the ONLY reset, and it resets to 0', () => {
  it('damage taken zeroes the chain; the next hit starts at 1', () => {
    const c = new Combo();
    c.hit();
    c.hit();
    c.damaged();
    expect(c.value).toBe(0);
    expect(c.hit()).toBe(1);
  });
  it('repeated damage keeps it at 0', () => {
    const c = new Combo();
    c.hit();
    c.damaged();
    c.damaged();
    expect(c.value).toBe(0);
  });
});

describe('Combo — a kill does NOT touch the counter (reverses the Stage-2 pin)', () => {
  it('there is no kill() verb at all', () => {
    // A `kill` method reappearing is exactly the regression this pins.
    expect((Combo.prototype as unknown as Record<string, unknown>).kill).toBeUndefined();
  });
  it('the chain simply continues across a kill (the Sim never resets it)', () => {
    const c = new Combo();
    c.hit();
    c.hit();
    c.hit(); // the killing blow — just another hit
    expect(c.value).toBe(3);
  });
});
