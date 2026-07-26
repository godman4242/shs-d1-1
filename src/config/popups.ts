/**
 * DAMAGE POPUPS — SESSION14 A4 (D9). Pure data, no logic.
 *
 * MEASURED, `COMBAT_MEASUREMENTS.md` e-3, quoted so nobody re-derives it:
 *
 *   "Popups are small numerals that rise ~25 px @1080 (13.3 stage px) over
 *    ~0.200 s while fading, and **scale UP as they rise** (29×40 px → 42×62 px
 *    over 15 frames), so glyph size alone can never identify a crit."
 *
 * ⚠️ CRITS ARE NOT ENCODED BY SIZE, COLOUR, OR ANYTHING ELSE (e-3, f-10). Across
 * ~845 s of sampled play there is *"no 'CRITICAL' popup, no gold or oversized
 * popup, and no crit-vs-normal popup pair"* anywhere. A popup's appearance is a
 * function of WHO took the damage and HOW LONG AGO — never of how the damage was
 * rolled. `core/damagePopup.ts` therefore has no crit parameter at all, which is
 * the strongest available guarantee: the information cannot leak if it is never
 * passed in.
 *
 * Every px value here is **stage-space native** (like `config/fx.ts`): popups are
 * drawn straight onto the 1024×576 canvas and never reach the Sim.
 */
import { COL } from './palette';

export const DAMAGE_POPUP = {
  /** MEASURED — ~25 px @1080 = 13.3 stage px of upward travel. */
  riseStagePx: 13.3,
  /** MEASURED — "~0.200 s" while fading. (The "15 frames" in the same sentence
   *  agrees with this to within the corpus's own sampling error; the seconds
   *  figure is the one stated directly, so it is the one used.) */
  durationMs: 200,
  /**
   * MEASURED — the numeral's starting glyph box is 29×40 px @1080. Converted to
   * stage space once, by the canvas ratio 1024/1920 = 0.5333:
   *   29 × 0.5333 = 15.5   ·   40 × 0.5333 = 21.3
   * (`scaleTo` then grows it, which is the measured 42×62 end state.)
   */
  glyphStagePx: { w: 15.5, h: 21.3 },
  /**
   * ⚠️ INFERRED — the corpus records how a popup MOVES but not where it is
   * BORN relative to the body it belongs to. This lifts it clear of the torso.
   * Veto = measure a spawn offset from a frame.
   */
  spawnAboveStagePx: 40,
  scaleFrom: 1,
  /**
   * MEASURED — 29×40 px → 42×62 px, i.e. ×1.448 wide and ×1.552 tall. Rendered
   * as ONE uniform scale because a glyph stretched non-uniformly would be a
   * claim the corpus does not make; 1.5 is the midpoint of the two ratios.
   * Veto = model width and height separately, with a frame to back it.
   */
  scaleTo: 1.5,
} as const;

export const POPUP_COLOR = {
  /** MEASURED (e-3) — damage the PLAYER took reads dark/black (13 of 14 events). */
  playerHurt: COL.outline,
  /**
   * MEASURED (e-3) — damage dealt to an ENEMY reads red. ⚠️ The exact HUE was
   * not sampled, so this reuses the OG's own recovered authored red rather than
   * inventing a new one. Veto = sample the popup red from a frame.
   */
  enemyHurt: COL.winRed,
} as const;
