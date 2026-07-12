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
  AI_APPROACH_RANGE,
  AI_KUNAI_RANGE,
  AI_PENDING_STANCE_MS,
  AI_RECOVER_JITTER_FRAC,
  AI_STRIKE_RANGE,
  AI_TIERS,
  DUEL_TARGET_SECONDS,
  ENEMY_SPEED,
} from '../src/config/ai';
import {
  BLADE_CORE_WIDTH,
  BLADE_EDGE_WIDTH,
  BLADE_FADE_MS,
  BLADE_MIN_TAPER,
  BLOOD_COUNT,
  BLOOD_COUNT_SEVERED,
  BLOOD_SPEED_MAX,
  BLOOD_SPEED_MIN,
  BLOOD_SPREAD_DEG,
  CHAIKIN_RATIO,
  CHI_PUNCH_DMG_L1,
  COUNTER_BONUS,
  CRIT_MULT,
  CRITICAL_FILL_PER_S,
  CRITICAL_MAX,
  COMBO_CHAIN_GAP_S,
  DAMAGE_FLOOR,
  FOCUS_FILL_PER_S,
  FOCUS_MAX,
  FOCUS_START,
  FOCUS_SWITCH_COST,
  HEAVY_DEF_PENALTY,
  MAX_STROKE_POINTS,
  RESAMPLE_SPACING,
  SMOOTH_ITERATIONS,
  SPAWN_INVULN_S,
  WEAPON_WEIGHT,
} from '../src/config/combat';
import {
  DEFLECT_RADIUS,
  DEFLECT_WINDOW_MS,
  ENEMY_BASE,
  MAX_FRAME_MS,
  PLAYER_BASE,
  PLAYER_MOVE_SPEED,
  PLAYER_WINDUP_MS,
  PROJECTILE_DMG,
  PROJECTILE_HIT_RADIUS,
  PROJECTILE_MAX_ACTIVE,
  PROJECTILE_SPEED,
  SHUNPO_DRAIN_PER_S,
  SHUNPO_FILL_PER_S,
  SHUNPO_MAX,
  SHUNPO_MIN_TO_START,
  SHUNPO_TIMESCALE,
  SKILL_VERB,
  SMOKE_BOMB_DISTANCE,
  SMOKE_BOMB_IFRAMES_MS,
} from '../src/config/combat-sim';
import { DUEL_SPAWNS, JUMP_APEX_PX, JUMP_DURATION_FRAMES } from '../src/config/duel';
import { SKILL_COOLDOWN_MS } from '../src/config/skills';
import { BLOOD_FX, FINISHER_FLASH, SLASH_ARC } from '../src/config/fx';
import { GESTURE_DIAG_DEG, LAUNCH_FLICK_MAX_LEN } from '../src/config/gesture';
import { FOUR, HALF, HALF_TURN_DEG, ONE, TWO, ZERO } from '../src/config/nums';
import { LAUNCH_UNLOCK_LEVEL, STANCE_BEATS, STANCE_CYCLE, STANCE_TABLE } from '../src/config/stances';
import { FIXED_HZ, FRAME_QUANT_EPS, MS_PER_S, SLASH_FRAMES } from '../src/config/timing';

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
    expect(COMBO_CHAIN_GAP_S).toBe(3); // Stage-2 decision — see combat.ts docblock
  });
  it('meters', () => {
    expect(FOCUS_MAX).toBe(100);
    expect(FOCUS_SWITCH_COST).toBe(34);
    expect(FOCUS_START).toBe(50);
    expect(FOCUS_FILL_PER_S).toBe(4); // Stage-2 decision — see combat.ts docblock
    expect(CRITICAL_MAX).toBe(100);
    expect(CRITICAL_FILL_PER_S).toBe(8);
  });
  it('weapon weights', () => {
    expect(WEAPON_WEIGHT).toEqual({ light: 1.0, balanced: 1.5, heavy: 2.5 });
  });
});

describe('combat.ts — Stage 1 stroke/blade/blood constants (spec item 3 + item-7 NOTE)', () => {
  it('drawn-stroke processing', () => {
    expect(RESAMPLE_SPACING).toBe(8);
    expect(SMOOTH_ITERATIONS).toBe(2);
    expect(CHAIKIN_RATIO).toBe(0.25);
    expect(MAX_STROKE_POINTS).toBe(256);
  });
  it('blade trail', () => {
    expect(BLADE_CORE_WIDTH).toBe(7);
    expect(BLADE_EDGE_WIDTH).toBe(13);
    expect(BLADE_FADE_MS).toBe(200);
    expect(BLADE_MIN_TAPER).toBe(0.12);
  });
  it('blood spray', () => {
    expect(BLOOD_COUNT).toBe(9);
    expect(BLOOD_COUNT_SEVERED).toBe(16);
    expect(BLOOD_SPREAD_DEG).toBe(42);
    expect(BLOOD_SPEED_MIN).toBe(60);
    expect(BLOOD_SPEED_MAX).toBe(240);
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
  it('STANCE_CYCLE — SPACE order (Stage 2 M2)', () => {
    expect(STANCE_CYCLE).toEqual(['light', 'balanced', 'heavy']);
  });
  it('LAUNCH_UNLOCK_LEVEL', () => {
    expect(LAUNCH_UNLOCK_LEVEL).toEqual({ light: 3, balanced: 5, heavy: 5 });
  });
});

describe('nums.ts — pure-math identities (Stage 1; core/ bans ALL literals)', () => {
  it('identity constants are exactly their names', () => {
    expect(ZERO).toBe(0);
    expect(ONE).toBe(1);
    expect(TWO).toBe(2);
    expect(FOUR).toBe(4);
    expect(HALF).toBe(0.5);
    expect(HALF_TURN_DEG).toBe(180);
  });
});

describe('duel.ts — Stage-2 arena layout (all INFERRED)', () => {
  it('DUEL_SPAWNS — player left, enemy right, on the ground band', () => {
    expect(DUEL_SPAWNS).toEqual({
      player: { pos: { x: 260, y: 430 }, halfW: 26, halfH: 60 },
      enemy: { pos: { x: 700, y: 430 }, halfW: 26, halfH: 60 },
    });
  });
  it('jump arc constants', () => {
    expect(JUMP_DURATION_FRAMES).toBe(24);
    expect(JUMP_APEX_PX).toBe(120);
  });
});

describe('fx.ts — Stage 1 item 7, exact spec names and values', () => {
  it('SLASH_ARC (red directional stroke FX)', () => {
    expect(SLASH_ARC).toEqual({
      bodyHalfWidth: 26,
      coreHalfWidth: 11,
      taperPow: 1.6,
      minTaper: 0.1,
      hangMs: 200,
      fadeMs: 180,
    });
  });
  it('BLOOD_FX (burst + persistent pool render path)', () => {
    expect(BLOOD_FX).toEqual({
      burstCount: 12,
      burstCountSevered: 20,
      speedMin: 90,
      speedMax: 280,
      poolSpreadRadius: 46,
      poolSpreadMs: 2600,
      poolAlpha: 0.9,
    });
  });
  it('FINISHER_FLASH (kill-beat flash, consumed Stage 2)', () => {
    expect(FINISHER_FLASH).toEqual({
      durationMs: 420,
      snapInMs: 60,
      slowMoScale: 0.35,
      slowMoRampMs: 90,
    });
  });
});

describe('gesture.ts — classification thresholds (Stage 1, INFERRED)', () => {
  it('sector boundary and flick cutoff', () => {
    expect(GESTURE_DIAG_DEG).toBe(45);
    expect(LAUNCH_FLICK_MAX_LEN).toBe(90);
  });
});

describe('combat-sim.ts — Stage 2 item 9, exact spec names and values', () => {
  it('frame clamp', () => {
    expect(MAX_FRAME_MS).toBe(250);
  });
  it('Shunpo (SHIFT-hold slow-mo)', () => {
    expect(SHUNPO_TIMESCALE).toBe(0.35);
    expect(SHUNPO_MAX).toBe(100);
    expect(SHUNPO_DRAIN_PER_S).toBe(34);
    expect(SHUNPO_MIN_TO_START).toBe(10);
    expect(SHUNPO_FILL_PER_S).toBe(12); // Stage-2 decision — see combat-sim.ts docblock
  });
  it('Smoke Bomb + Stab/Deflect', () => {
    expect(SMOKE_BOMB_DISTANCE).toBe(180);
    expect(SMOKE_BOMB_IFRAMES_MS).toBe(420);
    expect(DEFLECT_WINDOW_MS).toBe(260);
    expect(DEFLECT_RADIUS).toBe(64);
  });
  it('projectiles (kunai)', () => {
    expect(PROJECTILE_SPEED).toBe(0.55);
    expect(PROJECTILE_DMG).toBe(8);
    expect(PROJECTILE_HIT_RADIUS).toBe(26);
    expect(PROJECTILE_MAX_ACTIVE).toBe(8);
  });
  it('player movement + windup', () => {
    expect(PLAYER_MOVE_SPEED).toBe(0.28);
    expect(PLAYER_WINDUP_MS).toBe(0);
  });
  it('base fighter loadouts', () => {
    expect(PLAYER_BASE).toEqual({
      hp: 100,
      atkPlusWeapon: 10,
      defense: 5,
      stance: 'balanced',
      deflectLearned: true,
    });
    expect(ENEMY_BASE).toEqual({
      hp: 150,
      atkPlusWeapon: 7,
      defense: 5,
      stance: 'heavy',
      deflectLearned: false,
    });
  });
  it('skill hotbar verbs', () => {
    expect(SKILL_VERB).toEqual({ 1: 'chiPunch', 2: 'smokeBomb', 3: 'stab' });
  });
});

describe('ai.ts — Stage 2 item 8, exact spec names and values', () => {
  it('AI_TIERS — every tier exactly as the spec writes it', () => {
    expect(AI_TIERS).toEqual({
      easy: {
        telegraphMs: 700, attackMs: 180, recoverMs: 760, reactMs: 420,
        reactBlockChance: 0.15, reactDodgeChance: 0.05,
        counterStancePickChance: 0.2, aggression: 0.3, kunaiChance: 0,
      },
      normal: {
        telegraphMs: 520, attackMs: 180, recoverMs: 620, reactMs: 320,
        reactBlockChance: 0.30, reactDodgeChance: 0.15,
        counterStancePickChance: 0.5, aggression: 0.55, kunaiChance: 0.25,
      },
      hard: {
        telegraphMs: 380, attackMs: 160, recoverMs: 480, reactMs: 220,
        reactBlockChance: 0.45, reactDodgeChance: 0.25,
        counterStancePickChance: 0.8, aggression: 0.8, kunaiChance: 0.40,
      },
    });
  });
  it('ranges, speed, jitter, duel target', () => {
    expect(AI_KUNAI_RANGE).toEqual({ min: 240, max: 720 });
    expect(AI_STRIKE_RANGE).toBe(132);
    expect(AI_APPROACH_RANGE).toBe(620);
    expect(ENEMY_SPEED).toBe(0.17);
    expect(AI_RECOVER_JITTER_FRAC).toBe(0.35);
    expect(DUEL_TARGET_SECONDS).toEqual({ min: 20, max: 60 });
    expect(AI_PENDING_STANCE_MS).toBe(600); // Stage-2 decision — see ai.ts docblock
  });
});

describe('skills.ts — cooldowns (frame-quantized .92/.96 pattern)', () => {
  it('SKILL_COOLDOWN_MS', () => {
    expect(SKILL_COOLDOWN_MS).toEqual({
      chiPunch: 4960, // CONTRACT (A-02 on-screen)
      smokeBomb: 7960, // INFERRED
      stab: 920, // INFERRED
    });
  });
});

describe('timing.ts — fixed step + slash phases (Stage 0 item 7)', () => {
  it('FIXED_HZ', () => {
    expect(FIXED_HZ).toBe(60);
  });
  it('MS_PER_S (Stage 2 — Sim.advance step conversion)', () => {
    expect(MS_PER_S).toBe(1000);
  });
  it('FRAME_QUANT_EPS (Stage 2 — owed-frames 1-ulp guard)', () => {
    expect(FRAME_QUANT_EPS).toBe(1e-9);
  });
  it('SLASH_FRAMES per-phase structure', () => {
    expect(SLASH_FRAMES).toEqual({
      light: { windup: 4, active: 3, recovery: 8 },
      balanced: { windup: 6, active: 3, recovery: 12 },
      heavy: { windup: 10, active: 4, recovery: 16 },
    });
  });
});
