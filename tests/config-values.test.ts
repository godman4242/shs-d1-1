/**
 * SPEC-VALUE PINS — Stage 0 gate items 4–7.
 *
 * Expected values are transcribed from the Stage 0 spec, independently of
 * src/config/ (a second transcription — a typo has to happen twice, in two
 * files, identically, to slip through). Changing any config value is a
 * deliberate act: update BOTH files in the same commit, or the gate is red.
 */
import { describe, expect, it } from 'vitest';
import { COL } from '../src/config/palette';
import {
  CHI_PUNCH_DMG_L1,
  COUNTER_BONUS,
  CRIT_MULT,
  CRITICAL_FILL_PER_S,
  CRITICAL_MAX,
  DAMAGE_FLOOR,
  FOCUS_MAX,
  FOCUS_START,
  FOCUS_SWITCH_COST,
  HEAVY_DEF_PENALTY,
  SPAWN_INVULN_S,
  WEAPON_WEIGHT,
} from '../src/config/combat';
import { LAUNCH_UNLOCK_LEVEL, STANCE_BEATS, STANCE_TABLE } from '../src/config/stances';
import { FIXED_HZ, SLASH_FRAMES } from '../src/config/timing';

describe('palette.ts — exact trade-dress-shifted seeds (Stage 0 item 4)', () => {
  it('COL matches the spec hex-for-hex (no extras, no omissions)', () => {
    expect(COL).toEqual({
      skyTop: 0xd6dbf0,
      skyLow: 0xeef0ff,
      bladeChi: 0x72c4ea,
      forestBright: 0x4aa433,
      forestMid: 0x30942f,
      forestMid2: 0x33a130,
      forestShadow: 0x1f7532,
      forestDark: 0x163012,
      sage: 0x64905f,
      canopy: 0x7fa443,
      trunk: 0x0a2228,
      kimono: 0xf3f3eb,
      kimono2: 0xe9eddb,
      haori: 0x2d3d60,
      haoriShade: 0x1c2945,
      hair: 0x241f1b,
      hatStraw: 0xbc9552,
      wood: 0x794802,
      outline: 0x040304,
      blood: 0xa50103,
      bloodDark: 0x950202,
      bloodBright: 0xc81a10,
      healthGreen: 0x5cbf2f,
      focusBlue: 0x3d80d6,
      gold: 0xeaa83c,
      buttonRed: 0x902010,
      cream: 0xefedc2,
      goldTrim: 0xc8a44e,
      haoriEnemy: 0x6d2030,
      scarf: 0xc94730,
    });
  });
});

describe('combat.ts — exact core constants (Stage 0 item 5)', () => {
  it('damage constants', () => {
    // 1.3 per research 2026-07-11 (spec said 3; see combat.ts CRIT_MULT docblock)
    expect(CRIT_MULT).toBe(1.3);
    expect(COUNTER_BONUS).toBe(1.25);
    expect(HEAVY_DEF_PENALTY).toBe(0.2);
    expect(DAMAGE_FLOOR).toBe(1);
    expect(CHI_PUNCH_DMG_L1).toBe(10);
    expect(SPAWN_INVULN_S).toBe(5);
  });
  it('meters', () => {
    expect(FOCUS_MAX).toBe(100);
    expect(FOCUS_SWITCH_COST).toBe(34);
    expect(FOCUS_START).toBe(50);
    expect(CRITICAL_MAX).toBe(100);
    expect(CRITICAL_FILL_PER_S).toBe(8);
  });
  it('weapon weights', () => {
    expect(WEAPON_WEIGHT).toEqual({ light: 1.0, balanced: 1.5, heavy: 2.5 });
  });
});

describe('stances.ts — exact table + triangle (Stage 0 item 6)', () => {
  it('STANCE_TABLE', () => {
    expect(STANCE_TABLE).toEqual({
      light: { reach: 300, speed: 1.4, dmgMult: 0.9, damageTakenMult: 1.0 },
      balanced: { reach: 200, speed: 1.0, dmgMult: 1.2, damageTakenMult: 1.0 },
      heavy: { reach: 120, speed: 0.7, dmgMult: 1.4, damageTakenMult: 1.25 },
    });
  });
  it('STANCE_BEATS triangle: light>heavy>balanced>light', () => {
    expect(STANCE_BEATS).toEqual({ light: 'heavy', heavy: 'balanced', balanced: 'light' });
  });
  it('LAUNCH_UNLOCK_LEVEL', () => {
    expect(LAUNCH_UNLOCK_LEVEL).toEqual({ light: 3, balanced: 5, heavy: 5 });
  });
});

describe('timing.ts — fixed step + slash phases (Stage 0 item 7)', () => {
  it('FIXED_HZ', () => {
    expect(FIXED_HZ).toBe(60);
  });
  it('SLASH_FRAMES per-phase structure', () => {
    expect(SLASH_FRAMES).toEqual({
      light: { windup: 4, active: 3, recovery: 8 },
      balanced: { windup: 6, active: 3, recovery: 12 },
      heavy: { windup: 10, active: 4, recovery: 16 },
    });
  });
});
