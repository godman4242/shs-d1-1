/**
 * PALETTE — every colour in the game lives here. Pure data, no logic.
 *
 * All values are INFERRED seeds, deliberately shifted ±5–8% HSL from the
 * original for trade-dress distance (bladeChi additionally +2 hue).
 * Do NOT "correct" these back toward the original — the shift is the point.
 * Changing any value requires updating tests/config-values.test.ts in the
 * same commit (intentional double-entry ratchet).
 */
export const COL = {
  // Sky & atmosphere
  skyTop: 0xd6dbf0,
  skyLow: 0xeef0ff,
  bladeChi: 0x72c4ea,

  // Forest / arena
  forestBright: 0x4aa433,
  forestMid: 0x30942f,
  forestMid2: 0x33a130,
  forestShadow: 0x1f7532,
  forestDark: 0x163012,
  sage: 0x64905f,
  canopy: 0x7fa443,
  trunk: 0x0a2228,

  // Fighter
  kimono: 0xf3f3eb,
  kimono2: 0xe9eddb,
  haori: 0x2d3d60,
  haoriShade: 0x1c2945,
  hair: 0x241f1b,
  hatStraw: 0xbc9552,
  wood: 0x794802,
  outline: 0x040304,

  // Blood
  blood: 0xa50103,
  bloodDark: 0x950202,
  bloodBright: 0xc81a10,

  // HUD
  healthGreen: 0x5cbf2f,
  focusBlue: 0x3d80d6,
  gold: 0xeaa83c,
  buttonRed: 0x902010,
  cream: 0xefedc2,
  goldTrim: 0xc8a44e,

  // Enemy
  haoriEnemy: 0x6d2030,
  scarf: 0xc94730,
} as const;

export type ColName = keyof typeof COL;
