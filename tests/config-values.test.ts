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
  AI_MELEE_RANGE,
  AI_PENDING_STANCE_MS,
  AI_POINT_BLANK_X,
  AI_RECOVER_JITTER_FRAC,
  AI_TELEGRAPH_MS,
  AI_THINK_INTERVAL_MS,
  AI_TIERS,
  AUTO_SLASH_POINT_SPACING,
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
  CRIT_FLAT_BONUS,
  CRIT_MULT,
  DAMAGE_FLOOR,
  FOCUS_ACC_DEN,
  FOCUS_ACC_NUM,
  FOCUS_DISPLAY_OFFSET,
  FOCUS_DISPLAY_SPAN,
  FOCUS_FILL_PER_S,
  FOCUS_KILL_BONUS,
  FOCUS_MAX,
  FOCUS_SPEND,
  FOCUS_START,
  FOCUS_SWITCH_COST,
  HEAVY_DEF_PENALTY,
  MAX_STROKE_POINTS,
  MIN_DAMAGE_TIERS,
  RESAMPLE_SPACING,
  SMOOTH_ITERATIONS,
  SPAWN_INVULN_S,
  STANCE_MATCHUP,
} from '../src/config/combat';
import {
  DASH_SPEED_PX_PER_FRAME,
  DEFLECT_RADIUS,
  MOVE_DEADZONE_PX,
  MOVE_RUN_PX_S,
  MOVE_RUN_THRESHOLD_PX,
  MOVE_STANDING_RANGE_PX,
  MOVE_WALK_PX_S,
  DEFLECT_WINDOW_MS,
  ENEMY_BASE,
  MAX_FRAME_MS,
  PLAYER_BASE,
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
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  WORLD_HEIGHT,
  WORLD_HEIGHT_TALL,
  WORLD_WIDTH,
} from '../src/config/display';
import {
  DUEL_ENEMY,
  DUEL_SPAWNS,
  ENEMY_D_BASE,
  ENEMY_K_BASE,
  ENEMY_KD_FLOOR,
  JUMP_APEX_PX,
  JUMP_DURATION_FRAMES,
  LOW_LEVEL_OVERRIDE,
  XP_PER_LEVEL,
  XP_REWARD_BASE,
} from '../src/config/duel';
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
import {
  ATTACK_DMG_PER_POINT,
  ENEMY_STATS,
  MASTERY_MAX,
  PLAYER_STATS,
} from '../src/config/stats';
import { REACH } from '../src/config/reach';
import { FOCUS_CAPTION } from '../src/config/fidelity';
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
    // SESSION13 D5: COUNTER_BONUS is DELETED — it modelled a mechanic the
    // original does not have. The stance triangle replaces it, and unlike the
    // old one-sided bonus it PENALISES losing the matchup.
    expect(STANCE_MATCHUP).toEqual({ win: 1.2, lose: 0.9, same: 1.0 });
    expect(CRIT_FLAT_BONUS).toBe(0); // named at the identity — no source value found
    expect(HEAVY_DEF_PENALTY).toBe(0.2);
    expect(DAMAGE_FLOOR).toBe(1);
    expect(CHI_PUNCH_DMG_L1).toBe(10);
    expect(SPAWN_INVULN_S).toBe(5);
    // The level-tiered min-damage floor (D6 step 6).
    expect(MIN_DAMAGE_TIERS).toEqual({
      tier1MaxLevel: 10,
      tier2MaxLevel: 20,
      tier2Divisor: 8,
      tier3MaxLevel: 30,
      tier3Divisor: 6,
      tier4Divisor: 4,
    });
  });
  it('Focus — the ONE meter, in the source\'s integer units (SESSION13 D4)', () => {
    expect(FOCUS_MAX).toBe(192);
    expect(FOCUS_FILL_PER_S).toBe(24);
    expect(FOCUS_START).toBe(0);
    expect(FOCUS_SWITCH_COST).toBe(48); // flat; WEAPON_WEIGHT is deleted (D9)
    expect(FOCUS_KILL_BONUS).toBe(6);
    expect(FOCUS_SPEND).toEqual({ light: 24, balanced: 48, heavy: 72 });
  });
  it('Focus display quirk + residual accumulator terms', () => {
    expect(FOCUS_DISPLAY_OFFSET).toBe(48);
    expect(FOCUS_DISPLAY_SPAN).toBe(144);
    // 24/60 in lowest terms — the accumulator MUST be integer (D4).
    expect(FOCUS_ACC_NUM).toBe(2);
    expect(FOCUS_ACC_DEN).toBe(5);
    expect(FOCUS_ACC_NUM / FOCUS_ACC_DEN).toBe(FOCUS_FILL_PER_S / 60);
    // …and 144 units at 24/s is exactly the 6.000 s VISIBLE fill measured 5.97.
    expect(FOCUS_DISPLAY_SPAN / FOCUS_FILL_PER_S).toBe(6);
  });
});

describe('combat.ts — Stage 1 stroke/blade/blood constants (spec item 3 + item-7 NOTE)', () => {
  it('drawn-stroke processing', () => {
    expect(RESAMPLE_SPACING).toBe(20); // CONTRACT-SRC (B3); was an INFERRED 8 stage
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
  it('STANCE_TABLE — reach and dmgMult are GONE (SESSION13 D2a: both are mastery-derived)', () => {
    expect(STANCE_TABLE).toEqual({
      light: { speed: 1.4, damageTakenMult: 1.0 },
      balanced: { speed: 1.0, damageTakenMult: 1.0 },
      heavy: { speed: 0.7, damageTakenMult: 1.25 },
    });
    // A reach/dmgMult creeping back is exactly the regression this pins: one
    // mastery value must drive both, via core/mastery.ts.
    for (const params of Object.values(STANCE_TABLE)) {
      expect(params).not.toHaveProperty('reach');
      expect(params).not.toHaveProperty('dmgMult');
    }
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

describe('display.ts — the TWO spaces (SESSION13 A0: world sim vs stage canvas)', () => {
  it('GAME_WIDTH / GAME_HEIGHT — the canvas, deliberately unchanged by the world split', () => {
    expect(GAME_WIDTH).toBe(1024);
    expect(GAME_HEIGHT).toBe(576);
  });
  it('WORLD_* — the original\'s own logical stage (CONTRACT-SRC: w=800, h=480, hTall=690)', () => {
    expect(WORLD_WIDTH).toBe(800);
    expect(WORLD_HEIGHT).toBe(480);
    expect(WORLD_HEIGHT_TALL).toBe(690);
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
  it('WALK cycle — stride MEASURED (b05b t=465.0–466.3: 16f stride @ ~8.4 px/f → 72 stage px); bob/armSwing MEASURED Session 8B (walk-nw detrended hat-bob ~0.9%h; arms weapon-locked in all duel viewers)', () => {
    expect(WALK).toEqual({
      stridePx: 72,
      footSwing: 16,
      footLift: 6,
      kneeSwing: 8,
      kneeLift: 3,
      bob: 1,
      armSwing: 0,
    });
  });
  it('IDLE_BREATH amplitudes — MEASURED (coarse) Session 8B: idle hat-bob ≤0.5%h across 3 standing windows → halved from the inferred seed', () => {
    expect(IDLE_BREATH).toEqual({ chest: 0.8, neck: 0.7, head: 0.6, hat: 0.6, hand: 0.5 });
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
  it('DUEL_SPAWNS — WORLD space (A0): 260/700/430 stage → 190/557/358, gap 440 → 367', () => {
    expect(DUEL_SPAWNS).toEqual({
      player: { pos: { x: 190, y: 358 }, halfW: 22, halfH: 50 },
      enemy: { pos: { x: 557, y: 358 }, halfW: 22, halfH: 50 },
    });
  });
  it('jump arc constants (apex in WORLD px: 120 stage ÷ 1.2)', () => {
    expect(JUMP_DURATION_FRAMES).toBe(24);
    expect(JUMP_APEX_PX).toBe(100);
  });
  it('DUEL_ENEMY — LEVEL 9 (D3: the lowest level that escapes the ≤8 override)', () => {
    expect(DUEL_ENEMY).toEqual({ name: 'RONIN', level: 9 });
  });
  it('the named-duellist K/D pair, the ≤8 override, and the XP formula', () => {
    expect(ENEMY_K_BASE).toBe(10);
    expect(ENEMY_D_BASE).toBe(18);
    expect(ENEMY_KD_FLOOR).toBe(3);
    expect(LOW_LEVEL_OVERRIDE).toEqual({ maxLevel: 8 });
    expect(XP_PER_LEVEL).toBe(5);
    expect(XP_REWARD_BASE).toBe(45);
    // level × 5 + 45 = 90 at our level 9 — NOT the old +10 seed.
    expect(DUEL_ENEMY.level * XP_PER_LEVEL + XP_REWARD_BASE).toBe(90);
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
    expect(GESTURE_DIAG_DEG).toBe(45); // an angle — unaffected by the A0 split
    expect(LAUNCH_FLICK_MAX_LEN).toBe(75); // A0: world px (was 90 stage)
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
    expect(SMOKE_BOMB_DISTANCE).toBe(150); // A0: world px (was 180 stage)
    expect(SMOKE_BOMB_IFRAMES_MS).toBe(420);
    expect(DEFLECT_WINDOW_MS).toBe(260);
    expect(DEFLECT_RADIUS).toBe(53.33); // A0: world px (was 64 stage)
  });
  it('projectiles (kunai)', () => {
    expect(PROJECTILE_SPEED).toBe(0.4583); // A0: world px/ms (was 0.55 stage)
    expect(PROJECTILE_DMG).toBe(8);
    expect(PROJECTILE_HIT_RADIUS).toBe(21.67); // A0: world px (was 26 stage)
    expect(PROJECTILE_MAX_ACTIVE).toBe(8);
  });
  it('player movement + windup', () => {
    // CONTRACT-SRC (B1) — the OG's two gaits in WORLD px/s. At the ×1.2 render
    // scale these are 115.2 and 345.6 stage px/s, against measured 112–126 and
    // 341–349. Our single INFERRED 280 stage px/s matched NEITHER.
    expect(MOVE_WALK_PX_S).toBe(96);
    expect(MOVE_RUN_PX_S).toBe(288);
    expect(MOVE_RUN_THRESHOLD_PX).toBe(100);
    expect(MOVE_DEADZONE_PX).toBe(25);
    expect(MOVE_STANDING_RANGE_PX).toBe(50);
    expect(PLAYER_WINDUP_MS).toBe(0);
  });
  it('dash speeds by stance (SESSION13 B3 — replaces the fixed-distance dash)', () => {
    // SESSION13 B3: the dash is NOT a fixed distance. DASH_SLASH_PX and
    // DASH_MIN_STROKE_PX are deleted; the samurai travels to the stroke's LAST
    // POINT at a per-stance speed, bounded by the reach budget the stroke was
    // already truncated to.
    expect(DASH_SPEED_PX_PER_FRAME).toEqual({ light: 50, balanced: 40, heavy: 30 });
    // INFERRED — review-hardened bound: a mouse slip must not dash (real
    // swings measure well over 100px of path; slips are single-digit).

  });
  it('base fighter loadouts', () => {
    expect(PLAYER_BASE).toEqual({
      hp: 100,
      minDamage: 10, // atk 1 × 3 + weapon 7 — reproduces the old atkPlusWeapon
      damageRange: 0, // no weapon model yet (D6 RNG scope)
      defense: 5,
      stance: 'balanced',
      deflectLearned: true,
      stats: PLAYER_STATS,
    });
    // ⚠️ The enemy's AUTHORED base is 1, not 150 (D3). Named-enemy HP is not
    // authored at all — it is `effPlayerDmg × K` at spawn. A 150 here would
    // WIN the source's `max(scaledBase, …)` and quietly keep HP an INPUT,
    // defeating the derivation entirely.
    expect(ENEMY_BASE).toEqual({
      hp: 1,
      minDamage: 1,
      damageRange: 0,
      defense: 5,
      stance: 'heavy',
      deflectLearned: false,
      stats: ENEMY_STATS,
    });
  });
  it('skill hotbar verbs', () => {
    expect(SKILL_VERB).toEqual({ 1: 'chiPunch', 2: 'smokeBomb', 3: 'stab' });
  });
});

describe('ai.ts — Stage 2 item 8, exact spec names and values', () => {
  it('AI_TIERS — four fields DELETED (D8): the three react fields and telegraphMs', () => {
    expect(AI_TIERS).toEqual({
      easy: { attackMs: 180, recoverMs: 760, counterStancePickChance: 0.2, aggression: 0.3, kunaiChance: 0 },
      normal: { attackMs: 180, recoverMs: 620, counterStancePickChance: 0.5, aggression: 0.55, kunaiChance: 0.25 },
      hard: { attackMs: 160, recoverMs: 480, counterStancePickChance: 0.8, aggression: 0.8, kunaiChance: 0.40 },
    });
  });
  it('ranges, speed, jitter, duel target', () => {
    // A0: all four converted to WORLD units (÷1.2 from 240/720, 132, 620, 0.17).
    expect(AI_KUNAI_RANGE).toEqual({ min: 200, max: 600 });
    // D8: the melee trigger is BOTH axes at 50 world px. AI_STRIKE_RANGE (110)
    // is deleted — 2× too generous, and it had no vertical term at all.
    expect(AI_MELEE_RANGE).toEqual({ x: 50, y: 50 });
    expect(AI_TELEGRAPH_MS).toEqual({ closing: 600, pointBlank: 267 });
    expect(AI_POINT_BLANK_X).toBe(25); // INFERRED split between the two cases
    expect(AI_THINK_INTERVAL_MS).toBe(500);
    expect(AUTO_SLASH_POINT_SPACING).toBe(20);
    expect(AI_APPROACH_RANGE).toBe(516.67);
    expect(ENEMY_SPEED).toBe(0.1417);
    expect(AI_RECOVER_JITTER_FRAC).toBe(0.35);
    // SESSION13 D10/B0: source-derived, replacing the inherited spec guess.
    expect(DUEL_TARGET_SECONDS).toEqual({ min: 8, max: 25 });
    expect(AI_PENDING_STANCE_MS).toBe(600); // Stage-2 decision — see ai.ts docblock
  });
});

describe('economy.ts — Stage 2 item 10, exact spec names and values', () => {
  it('KILL_REWARD — coins only, FLAT and still INFERRED (XP moved to the source formula)', () => {
    // D3: XP is `level × 5 + 45` (config/duel.ts). Coins have NO source
    // formula, so they stay a flat 8 rather than being scaled by foe level —
    // scaling a guess by 9 is arithmetic, not evidence.
    expect(KILL_REWARD).toEqual({ coinsFlat: 8 });
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
    // FOCUS_CAPTION is double-entered here on purpose, like every other
    // spec-pinned value: changing a measured number means updating BOTH files in
    // the same commit. Measured off A1 (Nr4fQstqHDM_t428.5.png) at stage scale
    // 1920/1024 = 1.875; colours are stated by §1t113s0§.as:110-111.
    expect(FOCUS_CAPTION).toEqual({
      x: 202,
      y: 553,
      fontPx: 12, // cap 17 px @1920 = 9.07 stage px at this HUD's 0.78 ratio
      scaleX: 0.716, // 125.33 stage px measured / 175 rendered — the OG face is condensed
      lockColor: '#bbbbbb', // source-exact <font color='#BBBBBB'> + getString(960)
      critColor: '#000000', // source-exact <font color='#000000'> + getString(175)
      lockStrokePx: 3, // our outline convention — grey caption needs it
      critStrokePx: 0, // …and the BLACK caption must NOT have it, or it vanishes
    });
  });

  it('SKILL_COOLDOWN_MS — the duel\'s three hotbar verbs', () => {
    expect(SKILL_COOLDOWN_MS).toEqual({
      chiPunch: 5000, // CONTRACT-SRC — skill 1042 <cooldown>5</cooldown> (was 4960, frame-read)
      smokeBomb: 6000, // CONTRACT-SRC — skill 1010 L1 <cooldown>6</cooldown> (was INFERRED 7960)
      stab: 920, // DIVERGENCE (authored) — OG Stab 1018 is a PASSIVE with no cooldown
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

describe('stats.ts — SESSION13 A0.5: the inputs D2/D3/D6 need (nothing consumes them yet)', () => {
  it('MASTERY_MAX / ATTACK_DMG_PER_POINT', () => {
    expect(MASTERY_MAX).toBe(10);
    expect(ATTACK_DMG_PER_POINT).toBe(3);
  });
  it('PLAYER_STATS — level 9, SPD 1, dan 0, mastery 0 (a character who spent nothing)', () => {
    expect(PLAYER_STATS).toEqual({
      level: 9,
      spd: 1,
      atk: 1,
      defense: 5,
      danRank: 0,
      mastery: { light: 0, balanced: 0, heavy: 0 },
      weapon: { minDamage: 7, maxDamage: 7 },
    });
  });
  it('ENEMY_STATS — level 9 too (Δ=0 ⇒ K=10 / D=18)', () => {
    expect(ENEMY_STATS).toEqual({
      level: 9,
      spd: 1,
      atk: 1,
      defense: 5,
      danRank: 0,
      mastery: { light: 0, balanced: 0, heavy: 0 },
      weapon: { minDamage: 4, maxDamage: 4 },
    });
  });
  it('the PLAYER weapon decomposition reproduces the pre-A0.5 atkPlusWeapon exactly', () => {
    // 1 × 3 + 7 = 10, the old PLAYER_BASE.atkPlusWeapon. A decomposition of an
    // existing seed, not a new number.
    expect(PLAYER_STATS.atk * ATTACK_DMG_PER_POINT + PLAYER_STATS.weapon.minDamage).toBe(
      PLAYER_BASE.minDamage,
    );
    // ⚠️ The ENEMY deliberately does NOT follow suit: B4 makes its authored
    // base 1 so the source's `max(scaledBase, …)` cannot override the
    // derivation. Its stats still describe the character; they just do not set
    // its combat numbers any more.
    expect(ENEMY_BASE.minDamage).toBe(1);
  });
  it('damageRange is ZERO until a real weapon model lands (D6 RNG scope note)', () => {
    expect(PLAYER_STATS.weapon.maxDamage - PLAYER_STATS.weapon.minDamage).toBe(0);
    expect(ENEMY_STATS.weapon.maxDamage - ENEMY_STATS.weapon.minDamage).toBe(0);
  });
});

describe('reach.ts — SESSION13 A0.5: every literal in the source reach formula', () => {
  it('REACH names all nine constants', () => {
    expect(REACH).toEqual({
      base: 120,
      danBase: 90,
      danPerRank: 5,
      spdSoftcap: 20,
      lightMult: 1.4,
      balancedPerMastery: 0.02,
      heavyBase: 0.5,
      heavyPerMastery: 0.04,
      heavyFloor: 100,
    });
  });
});
