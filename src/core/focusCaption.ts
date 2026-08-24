/**
 * THE FOCUS METER'S CAPTION — pure, and transcribed from the source's own branch.
 *
 * The original's third HUD bar (`reloadbar`) owns a text field with three states,
 * chosen from the bar's own fill fraction. Verbatim, from the web build's update
 * function (`reference/decompiled/shs3_payload/scripts/§1t113s0§.as:325-359`):
 *
 *   if(pct == 0)                -> grey  getString(960)  ["CANNOT CHANGE STANCE"]
 *   else if(pct > 0 && pct < 1) -> visible = false
 *   else if(pct >= 1)           -> black getString(175)  ["Critical Hit"]
 *
 * The middle state is the one worth naming: a partly-charged meter shows NOTHING.
 * It does not keep the previous caption and it does not go blank-but-present — the
 * field is hidden outright, which is why the bar reads as bare colour mid-fight.
 *
 * `display` is the already-offset fraction the bar is scaled by — `focusDisplay`,
 * i.e. `(focus - FOCUS_DISPLAY_OFFSET) / FOCUS_DISPLAY_SPAN`. The source clamps a
 * negative fraction to zero *before* branching, so an under-offset meter is the
 * stance-locked state, never the hidden one.
 */
import { ONE, ZERO } from '../config/nums';

export type FocusCaption = 'cannotChangeStance' | 'hidden' | 'criticalHit';

export const focusCaption = (display: number): FocusCaption => {
  if (display <= ZERO) return 'cannotChangeStance';
  if (display >= ONE) return 'criticalHit';
  return 'hidden';
};
