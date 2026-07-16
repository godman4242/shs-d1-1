/**
 * PALETTE — every colour in the game lives here. Pure data, no logic.
 *
 * All values are INFERRED seeds tuned toward the study-frame reading.
 * HISTORY: through Stage 2 these carried a deliberate ±5–8% HSL trade-dress
 * shift; Kheshav vetoed that margin on 2026-07-12 ("as close to the OG as
 * possible") and the shift was reverted — hues now sit at our best reading
 * of the original's look. Colour schemes are unprotectable; the DRAWINGS
 * remain original work (that line still holds — see root CLAUDE.md).
 * Changing any value requires updating tests/config-values.test.ts in the
 * same commit (intentional double-entry ratchet).
 */
export const COL = {
  // Sky & atmosphere
  skyTop: 0xdae4f2,
  skyLow: 0xf2f5fc,
  bladeChi: 0x6ec2ee,

  // Forest / arena
  forestBright: 0x52b52f,
  forestMid: 0x389f2b,
  forestMid2: 0x3cab2f,
  forestShadow: 0x257f2c,
  forestDark: 0x183511,
  sage: 0x6b9a64,
  canopy: 0x86ae3e,
  trunk: 0x0b2426,

  // Fighter
  kimono: 0xf5f5ef,
  kimono2: 0xecf0de,
  haori: 0x2a3c66,
  haoriShade: 0x1a284a,
  hair: 0x241f1b,
  hatStraw: 0xc59d4c,
  wood: 0x7f4d05,
  outline: 0x030303,

  // Blood
  blood: 0xad0000,
  bloodDark: 0x8e0000,
  bloodBright: 0xd11810,

  // HUD — bar/plate/slot values are frame-MEASURED (fidelity gate v1,
  // 2026-07-16: B-23 duel window medians, see config/fidelity.ts provenance).
  healthGreen: 0x02990b,
  focusBlue: 0x2e49e2,
  enemyGreen: 0x179b32,
  barBrown: 0x321e00,
  plateBrown: 0x542c06,
  ringRed: 0x950d00,
  slotGrey: 0x313131,
  slotDark: 0x0d0d0d,
  // Authored value recovered from LOSSLESS archive shots (A5/Wiki14/A8
  // combo numeral all read exact #990000); the video's #a30e00 was the
  // codec-shifted rendering of this. The defeat card's field AND headline
  // read the identical video value (A t=3361-3364) — one shared card red.
  winRed: 0x990000,
  // Result-card tableau band + intro bands + card pillars: re-measured
  // 2026-07-16 (slice 2b) as pure black — three win-card frames (B t=3783.2/
  // .5/.8) and the defeat statics all read (0,0,0)-(0,2,0) inside the band;
  // v1's olive (25,34,9) reading did not reproduce and was corrected.
  black: 0x000000,
  gold: 0xf0ac33,
  buttonRed: 0x96200c,
  cream: 0xf2efc5,
  goldTrim: 0xcfa948,

  // Intro band glyphs + defeat card — frame-MEASURED (fidelity v2 slice 2b,
  // B t=3771.55-3772.55 VS / t=3773.48-3773.65 FIGHT!, A t=3361-3364 defeat;
  // medians across 3 frames each, provenance in config/fidelity.ts).
  vsRed: 0xff1800,
  // FIGHT! vertical gradient endpoints: linear fit through the two measured
  // F-stem anchors (OG rows 512 -> (255,109,0) and 550 -> (255,181,0)),
  // extrapolated to the glyph box edges (rows 492/572) — INFERRED endpoints,
  // CONTRACT anchors (the gate probes assert the anchors, not the endpoints).
  fightGradTop: 0xff4700,
  fightGradBottom: 0xffdf00,
  nameGold: 0xf4be09,
  nameWhite: 0xfafafa,
  btnMaroon: 0x5c1200,
  splashDark: 0x220300,

  // Enemy
  haoriEnemy: 0x722031,
  scarf: 0xd14a2b,
} as const;

export type ColName = keyof typeof COL;
