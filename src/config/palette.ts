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
  // codec-shifted rendering of this.
  winRed: 0x990000,
  silhouetteDark: 0x192209,
  gold: 0xf0ac33,
  buttonRed: 0x96200c,
  cream: 0xf2efc5,
  goldTrim: 0xcfa948,

  // Enemy
  haoriEnemy: 0x722031,
  scarf: 0xd14a2b,
} as const;

export type ColName = keyof typeof COL;
