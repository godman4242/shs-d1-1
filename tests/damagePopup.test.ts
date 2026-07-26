/**
 * DAMAGE POPUPS — SESSION14 A4 (D9 / P7), gate item 16.
 *
 * Popups are pure render FX driven off existing `SimEvent`s: no gameplay
 * coupling, no new state in the Sim. They are in scope because a crowd fight
 * without them is unreadable, and because the numbers were already measured.
 *
 * ⚠️ THE LOAD-BEARING ASSERTION IS A NEGATIVE ONE: **a crit must be
 * indistinguishable from a normal hit.** `COMBAT_MEASUREMENTS.md` f-10 searched
 * ~845 s of play and found "no 'CRITICAL' popup, no gold or oversized popup, and
 * no crit-vs-normal popup pair" — so encoding a crit by size (the obvious thing
 * to reach for) would be inventing a tell the original does not have.
 */
import { describe, expect, it } from 'vitest';
import { DAMAGE_POPUP, POPUP_COLOR } from '../src/config/popups';
import { popupColor, popupExpired, popupFrame, popupFromDamage } from '../src/core/damagePopup';
import { PLAYER_ID, type SimEvent } from '../src/core/Sim';

type DamageEvent = Extract<SimEvent, { type: 'damage' }>;
const dmg = (over: Partial<DamageEvent> = {}): DamageEvent => ({
  type: 'damage',
  target: 'enemy0',
  amount: 7,
  crit: false,
  severed: [],
  ...over,
});

describe('damage popups — COLOUR encodes DIRECTION (e-3, proven not guessed)', () => {
  it('dark = the PLAYER took it; red = an ENEMY took it', () => {
    expect(popupColor(true)).toBe(POPUP_COLOR.playerHurt);
    expect(popupColor(false)).toBe(POPUP_COLOR.enemyHurt);
    expect(POPUP_COLOR.playerHurt).not.toBe(POPUP_COLOR.enemyHurt);
  });

  it('reads the direction off a real damage event, by actor id', () => {
    expect(popupFromDamage(dmg({ target: PLAYER_ID }), PLAYER_ID).color).toBe(
      POPUP_COLOR.playerHurt,
    );
    expect(popupFromDamage(dmg({ target: 'enemy3' }), PLAYER_ID).color).toBe(
      POPUP_COLOR.enemyHurt,
    );
  });

  it('shows the damage number itself', () => {
    expect(popupFromDamage(dmg({ amount: 12 }), PLAYER_ID).text).toBe('12');
  });

  it('rounds fractional damage to a whole numeral — the OG never shows decimals', () => {
    expect(popupFromDamage(dmg({ amount: 5.5555 }), PLAYER_ID).text).toBe('6');
  });
});

describe('⚠️ damage popups — a CRIT IS INDISTINGUISHABLE from a normal hit (f-10)', () => {
  it('a crit and a normal hit of the same size produce the SAME popup', () => {
    const normal = popupFromDamage(dmg({ amount: 9, crit: false }), PLAYER_ID);
    const critical = popupFromDamage(dmg({ amount: 9, crit: true }), PLAYER_ID);
    expect(critical).toEqual(normal);
  });

  it('…on the player side too', () => {
    const normal = popupFromDamage(dmg({ target: PLAYER_ID, crit: false }), PLAYER_ID);
    const critical = popupFromDamage(dmg({ target: PLAYER_ID, crit: true }), PLAYER_ID);
    expect(critical).toEqual(normal);
  });

  it('the animation cannot depend on crit-ness, because it never receives it', () => {
    // The structural guarantee behind the two behavioural tests above: a popup's
    // appearance over time is a function of AGE alone. Information that is never
    // passed in cannot leak into the render.
    expect(popupFrame.length).toBe(1);
  });
});

describe('damage popups — the measured anatomy (e-3)', () => {
  it('starts at the spawn point, full size, fully opaque', () => {
    expect(popupFrame(0)).toEqual({ dy: 0, scale: DAMAGE_POPUP.scaleFrom, alpha: 1 });
  });

  it('rises exactly 13.3 stage px, upward, over its lifetime', () => {
    expect(DAMAGE_POPUP.riseStagePx).toBeCloseTo(13.3, 10);
    // Negative dy = upward on a y-down canvas.
    expect(popupFrame(DAMAGE_POPUP.durationMs).dy).toBeCloseTo(-13.3, 10);
    expect(popupFrame(DAMAGE_POPUP.durationMs / 2).dy).toBeCloseTo(-13.3 / 2, 10);
  });

  it('SCALES UP as it rises — the property that makes size useless as a crit tell', () => {
    expect(DAMAGE_POPUP.scaleTo).toBeGreaterThan(DAMAGE_POPUP.scaleFrom);
    expect(popupFrame(DAMAGE_POPUP.durationMs).scale).toBeCloseTo(DAMAGE_POPUP.scaleTo, 10);
    const half = popupFrame(DAMAGE_POPUP.durationMs / 2).scale;
    expect(half).toBeGreaterThan(DAMAGE_POPUP.scaleFrom);
    expect(half).toBeLessThan(DAMAGE_POPUP.scaleTo);
  });

  it('fades to nothing over the same 200 ms', () => {
    expect(DAMAGE_POPUP.durationMs).toBe(200);
    expect(popupFrame(DAMAGE_POPUP.durationMs).alpha).toBeCloseTo(0, 10);
    expect(popupFrame(DAMAGE_POPUP.durationMs / 2).alpha).toBeCloseTo(0.5, 10);
  });

  it('expires exactly at the end of its 200 ms, and not before', () => {
    expect(popupExpired(DAMAGE_POPUP.durationMs - 1)).toBe(false);
    expect(popupExpired(DAMAGE_POPUP.durationMs)).toBe(true);
  });

  it('clamps rather than flying off or going negative when over-aged', () => {
    // A backgrounded tab can hand the scene a huge delta; a popup must settle,
    // never invert its alpha or shoot up the screen.
    const late = popupFrame(DAMAGE_POPUP.durationMs * 10);
    expect(late.dy).toBeCloseTo(-DAMAGE_POPUP.riseStagePx, 10);
    expect(late.alpha).toBe(0);
    expect(late.scale).toBeCloseTo(DAMAGE_POPUP.scaleTo, 10);
    expect(popupFrame(-50)).toEqual({ dy: 0, scale: DAMAGE_POPUP.scaleFrom, alpha: 1 });
  });
});
