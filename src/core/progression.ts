/**
 * progression.ts (Stage 3 spec item 1, errata-read) — pure level-up / rebirth
 * / dan-rank math. No Phaser, no storage, ZERO numeric literals (every number
 * comes from src/config/economy). The game/ boundary owns persistence
 * (localStorage) and the XP→level curve; this module owns only the atomic
 * state transitions, so it stays deterministic and fully unit-testable.
 *
 * Research-backed contract (docs/research/original-game-facts.md):
 * - levelUp = +1 SP, +3 stat, full HP/Chi/AP refill.
 * - First run (danRank 0): SP capped at FIRST_RUN_SP_CAP; the cap lifts once
 *   you rebirth (danRank > 0), matching "80 SP first run".
 * - rebirth grants elementalPointsPerRebirth of the CHOSEN element (stacking),
 *   pays earlyGold on ranks 1..9 and tenthGold on the 10th (final), and resets
 *   the character to a fresh L1. MAX_DAN_RANK (=10) is the ceiling.
 *
 * Flagged decisions (RESUME open decisions #2/#3; kickoff-pre-approved):
 * - Rebirth pays a FLAT +10 elemental; research notes a 10th-rebirth "+20"
 *   nuance we deliberately do NOT model (would need an invented config field).
 *   → docs/DIVERGENCES.md.
 * - Rebirth resets skillPoints/statPoints to 0 (fresh L1); the exact spent-
 *   point reset beyond "resets to L1" is INFERRED. Veto = keep them.
 * - Level itself is not hard-capped in core; a level ceiling is a Stage-4 UI
 *   concern. The gate's binding contract is the SP cap. Veto = clamp level.
 */
import {
  FIRST_RUN_SP_CAP,
  LEVEL_UP_REWARD,
  MAX_DAN_RANK,
  REBIRTH,
} from '../config/economy';
import { ONE, ZERO } from '../config/nums';

/** The four elemental trees (Stage 4/5 build the trees; Stage 3 stores points). */
export const ELEMENTS = ['fire', 'water', 'earth', 'wind'] as const;
export type ElementId = (typeof ELEMENTS)[number];

/** A depletable resource with a current value and its ceiling. */
export interface Pool {
  current: number;
  max: number;
}

/** The player's persistent progression state (pure data; game/ persists it). */
export interface Progression {
  level: number;
  /** Rebirth count, 0..MAX_DAN_RANK; == the dan rank. */
  danRank: number;
  /** Unspent skill points (capped on the first run). */
  skillPoints: number;
  /** Unspent stat points. */
  statPoints: number;
  /** Grindable currency (kills). */
  coins: number;
  /** Earnable currency (rebirth payouts). */
  gold: number;
  /** Chosen-elemental points earned via rebirth, per element. */
  elemental: Record<ElementId, number>;
  hp: Pool;
  chi: Pool;
  ap: Pool;
}

/** Refill a pool to its ceiling (a level-up / rebirth full refill). */
const refill = (p: Pool): Pool => ({ current: p.max, max: p.max });

/** Clamp SP to the first-run cap; after a rebirth (danRank > 0) the cap lifts. */
const capSkillPoints = (sp: number, danRank: number): number =>
  danRank === ZERO ? Math.min(sp, FIRST_RUN_SP_CAP) : sp;

/**
 * A fresh first-run character. Pool maxes are supplied by the caller (the
 * game/ boundary owns the real starting stats) and must be finite and
 * non-negative — a bad max would poison every future refill.
 */
export const initProgression = (maxes: { hp: number; chi: number; ap: number }): Progression => {
  const pool = (max: number): Pool => {
    if (!Number.isFinite(max) || max < ZERO) {
      throw new RangeError('initProgression: pool max must be finite and non-negative');
    }
    return { current: max, max };
  };
  return {
    level: ONE,
    danRank: ZERO,
    skillPoints: ZERO,
    statPoints: ZERO,
    coins: ZERO,
    gold: ZERO,
    elemental: { fire: ZERO, water: ZERO, earth: ZERO, wind: ZERO },
    hp: pool(maxes.hp),
    chi: pool(maxes.chi),
    ap: pool(maxes.ap),
  };
};

/** The level-up modal: +1 SP (first-run capped), +3 stat, full HP/Chi/AP refill. */
export const levelUp = (p: Progression): Progression => ({
  ...p,
  level: p.level + ONE,
  skillPoints: capSkillPoints(p.skillPoints + LEVEL_UP_REWARD.skillPoints, p.danRank),
  statPoints: p.statPoints + LEVEL_UP_REWARD.statPoints,
  hp: LEVEL_UP_REWARD.fullRefill ? refill(p.hp) : p.hp,
  chi: LEVEL_UP_REWARD.fullRefill ? refill(p.chi) : p.chi,
  ap: LEVEL_UP_REWARD.fullRefill ? refill(p.ap) : p.ap,
});

/** True while the character can still rebirth (below the dan-rank ceiling). */
export const canRebirth = (p: Progression): boolean => p.danRank < MAX_DAN_RANK;

/**
 * Rebirth into the next dan rank: +elementalPointsPerRebirth of the chosen
 * element (stacking), gold by tier (earlyGold ranks 1..9, tenthGold the 10th),
 * reset to a fresh L1 with full pools. Refuses past MAX_DAN_RANK or on an
 * unknown element.
 */
export const rebirth = (p: Progression, element: ElementId): Progression => {
  if (!canRebirth(p)) {
    throw new RangeError('rebirth: already at MAX_DAN_RANK (the ceiling)');
  }
  if (!ELEMENTS.includes(element)) {
    throw new RangeError('rebirth: unknown element');
  }
  const danRank = p.danRank + ONE;
  // danRank is 1..MAX (canRebirth blocks the rest); < MAX → earlyGold, else
  // the final rank → tenthGold. REBIRTH.lateGold (11+) is unreachable here.
  const goldGain = danRank < MAX_DAN_RANK ? REBIRTH.earlyGold : REBIRTH.tenthGold;
  return {
    ...p,
    danRank,
    level: ONE,
    skillPoints: ZERO,
    statPoints: ZERO,
    gold: p.gold + goldGain,
    elemental: {
      ...p.elemental,
      [element]: p.elemental[element] + REBIRTH.elementalPointsPerRebirth,
    },
    hp: refill(p.hp),
    chi: refill(p.chi),
    ap: refill(p.ap),
  };
};

/** Accrue grindable coins; a non-finite or negative amount is ignored. */
export const accrueCoins = (p: Progression, amount: number): Progression =>
  Number.isFinite(amount) && amount >= ZERO ? { ...p, coins: p.coins + amount } : p;
