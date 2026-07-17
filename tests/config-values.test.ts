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
import { GAME_HEIGHT, GAME_WIDTH } from '../src/config/display';
import { DUEL_ENEMY, DUEL_SPAWNS, JUMP_APEX_PX, JUMP_DURATION_FRAMES } from '../src/config/duel';
import {
  FIRST_RUN_SP_CAP,
  HAS_CASH_PURCHASE,
  KILL_REWARD,
  LEVEL_UP_REWARD,
  MAX_DAN_RANK,
  REBIRTH,
  WAR_ROOM,
} from '../src/config/economy';
import { CHI_COST, CHI_FILL_PER_S, CHI_MAX } from '../src/config/chi';
import { PROFILE_START_POOLS } from '../src/config/profile';
import { XP_DELTA_STEP, XP_THRESHOLDS } from '../src/config/xp';
import { SKILL_COOLDOWN_MS } from '../src/config/skills';
import { BLOOD_FX, FINISHER_FLASH, SLASH_ARC } from '../src/config/fx';
import { GESTURE_DIAG_DEG, LAUNCH_FLICK_MAX_LEN } from '../src/config/gesture';
import { ANIM_TIMING, EASE, IDLE_BREATH, SCARF, SCARF_FLUTTER_RAD_PER_MS, WALK } from '../src/config/anim';
import { FOUR, HALF, HALF_TURN_DEG, ONE, TAU, TWO, ZERO } from '../src/config/nums';
import { LAUNCH_UNLOCK_LEVEL, STANCE_BEATS, STANCE_CYCLE, STANCE_TABLE } from '../src/config/stances';
import { FIXED_HZ, FRAME_QUANT_EPS, MS_PER_S, SLASH_FRAMES } from '../src/config/timing';

describe('palette.ts — near-OG hues (owner veto of the trade-dress shift, 2026-07-12)', () => {
  it('COL matches hex-for-hex (no extras, no omissions)', () => {
    expect(COL).toEqual({
      skyTop: 0xdae4f2,
      skyLow: 0xf2f5fc,
      bladeChi: 0x6ec2ee,
      forestBright: 0x52b52f,
      forestMid: 0x389f2b,
      forestMid2: 0x3cab2f,
      forestShadow: 0x257f2c,
      forestDark: 0x183511,
      sage: 0x6b9a64,
      canopy: 0x86ae3e,
      trunk: 0x0b2426,
      kimono: 0xf5f5ef,
      kimono2: 0xecf0de,
      haori: 0x2a3c66,
      haoriShade: 0x1a284a,
      hair: 0x241f1b,
      hatStraw: 0xc59d4c,
      wood: 0x7f4d05,
      outline: 0x030303,
      blood: 0xad0000,
      bloodDark: 0x8e0000,
      bloodBright: 0xd11810,
      healthGreen: 0x02990b,
      focusBlue: 0x2e49e2,
      enemyGreen: 0x179b32,
      barBrown: 0x321e00,
      plateBrown: 0x542c06,
      ringRed: 0x950d00,
      slotGrey: 0x313131,
      slotDark: 0x0d0d0d,
      winRed: 0x990000,
      black: 0x000000,
      gold: 0xf0ac33,
      buttonRed: 0x96200c,
      cream: 0xf2efc5,
      goldTrim: 0xcfa948,
      vsRed: 0xff1800,
      fightGradTop: 0xff4700,
      fightGradBottom: 0xffdf00,
      nameGold: 0xf4be09,
      nameWhite: 0xfafafa,
      btnMaroon: 0x5c1200,
      splashDark: 0x220300,
      haoriEnemy: 0x722031,
      scarf: 0xd14a2b,
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

describe('display.ts — stage dimensions (audit: were the only unpinned config numbers)', () => {
  it('GAME_WIDTH / GAME_HEIGHT', () => {
    expect(GAME_WIDTH).toBe(1024);
    expect(GAME_HEIGHT).toBe(576);
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
    expect(TAU).toBe(2 * Math.PI);
  });
});

describe('anim.ts — skeletal-fighter feel (Session 8: walk + hit + pose-step MEASURED off longplay B)', () => {
  it('WALK cycle — stride MEASURED (b05b t=465.0–466.3: 16f stride @ ~8.4 px/f → 72 stage px)', () => {
    expect(WALK).toEqual({
      stridePx: 72,
      footSwing: 16,
      footLift: 6,
      kneeSwing: 8,
      kneeLift: 3,
      bob: 3,
      armSwing: 7,
    });
  });
  it('IDLE_BREATH amplitudes', () => {
    expect(IDLE_BREATH).toEqual({ chest: 1.5, neck: 1.3, head: 1.1, hat: 1.1, hand: 1.0 });
  });
  it('EASE shape', () => {
    expect(EASE).toEqual({ cubicExp: 3 });
  });
  it('ANIM_TIMING phases — stagger 12f + 15fps pose step MEASURED (duel t=3774–3775)', () => {
    expect(ANIM_TIMING).toEqual({
      hitRecoilMs: 67,
      hitReturnMs: 133,
      deathMs: 333,
      idlePeriodMs: 2600,
      guardBlendMs: 130,
      guardEps: 0.001,
      poseStepMs: 1000 / 15,
    });
  });
  it('SCARF ribbon + derived flutter frequency', () => {
    expect(SCARF).toEqual({
      segments: 5,
      segLen: 8,
      width: 6,
      sway: 5,
      flutterHz: 1.6,
      flowGain: 30,
      flowMax: 22,
      flowSmoothing: 0.18,
      anchorX: -6,
      anchorY: 3,
      droop: 2.5,
    });
    expect(SCARF_FLUTTER_RAD_PER_MS).toBeCloseTo((1.6 * 2 * Math.PI) / 1000, 12);
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
  it('DUEL_ENEMY — nameplate identity; level 1 ⇒ +10/+8 gate rewards', () => {
    expect(DUEL_ENEMY).toEqual({ name: 'RONIN', level: 1 });
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

describe('economy.ts — Stage 2 item 10, exact spec names and values', () => {
  it('KILL_REWARD — coins is 8, NOT 5 (spec-verified); whole record INFERRED', () => {
    expect(KILL_REWARD).toEqual({ xpPerFoeLevel: 10, coinsPerFoeLevel: 8 });
  });
  it('LEVEL_UP_REWARD (CONTRACT: +1 SP / +3 stat / full refill modals)', () => {
    expect(LEVEL_UP_REWARD).toEqual({ skillPoints: 1, statPoints: 3, fullRefill: true });
  });
  it('caps and rebirth', () => {
    expect(FIRST_RUN_SP_CAP).toBe(80);
    expect(MAX_DAN_RANK).toBe(10); // research: 10, not spec text 5 — see docblock
    expect(REBIRTH).toEqual({ earlyGold: 25, tenthGold: 100, lateGold: 25, elementalPointsPerRebirth: 10 });
  });
  it('War Room + no cash path', () => {
    expect(WAR_ROOM).toEqual({
      unlockLevel: 10,
      killCap: 350,
      buildDonationCap: 500,
      deployMods: { fieldToMountain: 60, mountainToMountain: 100, fieldToForest: 75 },
      controlPointFlagBonus: 1.2,
    });
    expect(HAS_CASH_PURCHASE).toBe(false);
  });
});

describe('chi.ts — Stage 3 M3, the Chi meter (ALL INFERRED — no frame-backed reads)', () => {
  it('pool + regen', () => {
    expect(CHI_MAX).toBe(100);
    expect(CHI_FILL_PER_S).toBe(4);
  });
  it('CHI_COST — nuke > escape > parry, charged on top of cooldowns', () => {
    expect(CHI_COST).toEqual({ chiPunch: 30, smokeBomb: 25, stab: 10 });
  });
});

describe('profile.ts — Stage 3 M4, the A-00 guest-start pools', () => {
  it('PROFILE_START_POOLS (CONTRACT: Player sheet reads HP 10 / CHI 10 / AP 30)', () => {
    expect(PROFILE_START_POOLS).toEqual({ hp: 10, chi: 10, ap: 30 });
  });
});

describe('xp.ts — Stage 3 M2, the frame-backed XP curve', () => {
  it('XP_THRESHOLDS (CONTRACT: SYNTHESIS §1.2 cumulative caps, one segment read each)', () => {
    expect(XP_THRESHOLDS).toEqual([
      550, // A-00
      1450, // A-01
      2950, // A-03
      5150, // A-06
      8350, // A-14
      12150, // A-21
      16350, // B-04 (B-05's 15,350 = single-frame anomaly, flagged)
      20900, // B-08
      25900, // B-18
      31400, // B-22
    ]);
  });
  it('XP_DELTA_STEP (INFERRED: L11+ delta growth, observed tail 4550→5000→5500)', () => {
    expect(XP_DELTA_STEP).toBe(500);
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
  it('SLASH_FRAMES per-phase structure (Session 8B: MEASURED from duel-move pixel-diff cadence)', () => {
    expect(SLASH_FRAMES).toEqual({
      light: { windup: 4, active: 4, recovery: 4 },
      balanced: { windup: 4, active: 4, recovery: 8 },
      heavy: { windup: 4, active: 4, recovery: 12 },
    });
  });
});
