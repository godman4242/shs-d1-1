/**
 * GATE L2-B — THE FOCUS METER'S CAPTION (lane L2, meters half).
 *
 * The original's third bar is `reloadbar`, and it carries its own text field with
 * THREE states. Transcribed verbatim from the web build's own update function,
 * `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:325-359`:
 *
 *   var pct:Number = (param1 - 48) / (param2 - 48);      // FOCUS_DISPLAY_OFFSET/SPAN
 *   if(pct < 0) pct = 0;
 *   bar.scaleX = pct;
 *   if(pct == 0)                -> htmlText = "<font color='#BBBBBB'>" + getString(960)
 *   else if(pct > 0 && pct < 1) -> visible = false
 *   else if(pct >= 1)           -> Snd_criticalDamage; "<font color='#000000'>" + getString(175)
 *
 * String ids, resolved against `docs/gauntlet/L0/index/strings.json`:
 *   175 = 'Critical Hit'
 *   960 = ABSENT from the android table — web-only, exactly as C4 predicted. Its
 *         text is read off the frame instead (A1): `CANNOT CHANGE STANCE`, in
 *         reference/frames/combat_analysis/Nr4fQstqHDM_t428.5.png, printed ON the
 *         third bar at the same width as the HP and Chi bars above it.
 *
 * The middle state is the non-obvious one: between empty and full the caption is
 * HIDDEN, not blank-but-present and not left showing the previous text.
 */
import { describe, expect, it } from 'vitest';
import { FOCUS_DISPLAY_OFFSET, FOCUS_DISPLAY_SPAN, FOCUS_MAX } from '../src/config/combat';
import { focusCaption } from '../src/core/focusCaption';

describe('focusCaption — the third bar\'s three source-stated states', () => {
  it('an EMPTY meter shows the grey stance-lock caption', () => {
    expect(focusCaption(0)).toBe('cannotChangeStance');
  });

  it('a partially charged meter shows NOTHING — the caption is hidden, not blank', () => {
    expect(focusCaption(0.01)).toBe('hidden');
    expect(focusCaption(0.5)).toBe('hidden');
    expect(focusCaption(0.99)).toBe('hidden');
  });

  it('a FULL meter shows the crit caption', () => {
    expect(focusCaption(1)).toBe('criticalHit');
  });

  it('clamps like the source: pct < 0 becomes 0, and over-full stays full', () => {
    // `if(pct < 0) pct = 0;` — a negative display is the empty state, never hidden.
    expect(focusCaption(-0.5)).toBe('cannotChangeStance');
    expect(focusCaption(-1)).toBe('cannotChangeStance');
    expect(focusCaption(1.5)).toBe('criticalHit');
  });

  it('the boundaries are EXACTLY the source\'s: 0 and 1, not ranges around them', () => {
    expect(focusCaption(Number.MIN_VALUE)).toBe('hidden');
    expect(focusCaption(1 - Number.EPSILON)).toBe('hidden');
  });

  it('lines up with the real meter: raw Focus < 48 is the stance-lock state', () => {
    // `(focus - 48) / (192 - 48)` — the first 48 units are invisible, so anything
    // below the stance-switch cost reads as an empty bar AND locks the switch.
    const display = (raw: number): number =>
      (raw - FOCUS_DISPLAY_OFFSET) / FOCUS_DISPLAY_SPAN;
    expect(focusCaption(display(0))).toBe('cannotChangeStance');
    expect(focusCaption(display(47))).toBe('cannotChangeStance');
    expect(focusCaption(display(FOCUS_DISPLAY_OFFSET))).toBe('cannotChangeStance');
    expect(focusCaption(display(49))).toBe('hidden');
    expect(focusCaption(display(FOCUS_MAX))).toBe('criticalHit');
  });
});
