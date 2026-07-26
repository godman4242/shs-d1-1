/**
 * FIGHTER STATS — pure data, no logic (SESSION13 A0.5).
 *
 * The D2 (reach), D3 (enemy derivation) and D6 (damage pipeline) formulas all
 * take stat inputs that this project has never had. This file creates them.
 * **Nothing consumes them yet** — A0.5 lands green and alone by design; B2/B3/B4
 * wire them.
 *
 * All values WORLD/stat-space; none are px.
 *
 * ⚠️ THE REACH STAT IS **SPD (Speed)**, NOT AGILITY. Confirmed twice in the
 * payload: the reach getter reads the Speed stat index, and the source's own
 * stat-point notes say *"Speed does not touch damage — it sets blade LENGTH."*
 * (The SESSION13 kickoff's §4 A0.5 line still says "agility" — that is a
 * leftover from its own first draft, which §1 D2 explicitly corrects. Named
 * `spd` here to match the correction, decide-and-flag; veto = rename, but then
 * fix D2 too.)
 *
 * ⚠️ `DUEL_ENEMY.level` in `duel.ts` is still **1** and is NOT yet consistent
 * with the 9 seeded here. B4 lands both together with the XP knock-on
 * (`level×5+45` = 90) — gate item 1. Until then nothing reads these levels.
 */
import type { StanceId } from './stances';

/** CONTRACT-SRC — mastery skills cap at level 10. */
export const MASTERY_MAX = 10;

/** CONTRACT-SRC — each point of the Attack stat adds this much damage. */
export const ATTACK_DMG_PER_POINT = 3;

export interface WeaponDamage {
  /** Low end of the damage roll. */
  minDamage: number;
  /**
   * High end. `damageRange = maxDamage − minDamage`, and with no weapon model
   * yet that range is deliberately **0** — a roll of width zero (D6's RNG
   * scope note: do not thread the injected RNG through the damage pipeline to
   * randomise nothing).
   */
  maxDamage: number;
}

export interface FighterStats {
  level: number;
  /** Speed — sets blade LENGTH, never damage. Drives the D2 reach formula. */
  spd: number;
  /** Attack stat — ATTACK_DMG_PER_POINT damage per point. */
  atk: number;
  defense: number;
  /** Rebirth rank (0 = never rebirthed); feeds the reach formula's dan term. */
  danRank: number;
  /**
   * Per-stance mastery, 0..MASTERY_MAX. **ONE source of truth** — D2a: the same
   * number must drive BOTH the reach table and the damage multipliers, or the
   * build repeats the self-inconsistency the Session-11 adjudication reverted
   * (reach read at mastery 0 while damage sat at the mastery-10 ceiling).
   */
  mastery: Record<StanceId, number>;
  weapon: WeaponDamage;
}

/**
 * INFERRED-from-measurement — a level-9 character who never spent a stat or
 * skill point. Stat points are optional in this game, and our own PLAYER-screen
 * measurement caught a real high-level player sitting at ATK 1 · DEF 1 · SPD 1,
 * so this is exactly what the original produces. Mastery 0 is CONTRACT-SRC: the
 * skill-level getter returns 0 for any unpurchased skill
 * (`if (skill != null) return skill.level(); return 0;`).
 *
 * Level 9 is D3's decision: the LOWEST level that escapes the source's
 * `if (level <= 8) { minDamage = 1; defense = 1; }` override, which at our old
 * level 1 forced the enemy to 1 damage and 1 defence and made the duel
 * literally unlosable.
 *
 * The weapon split is chosen so `atk × ATTACK_DMG_PER_POINT + weapon.minDamage`
 * reproduces the pre-A0.5 `PLAYER_BASE.atkPlusWeapon` (10) EXACTLY — decomposing
 * an existing total, not inventing a new one.
 */
export const PLAYER_STATS: FighterStats = {
  level: 9,
  spd: 1,
  atk: 1,
  defense: 5,
  danRank: 0,
  mastery: { light: 0, balanced: 0, heavy: 0 },
  weapon: { minDamage: 7, maxDamage: 7 },
};

/**
 * INFERRED — the enemy at the SAME level 9, so Δ = 0 and the duel is the
 * original's own level-matched fight: **K = 10** (player kills in 10 hits) and
 * **D = 18** (enemy kills the player in 18). Levelling only the enemy would give
 * Δ = 8 → K = 18 / D = 10, an enemy-favoured slog.
 *
 * Weapon split reproduces `ENEMY_BASE.atkPlusWeapon` (7) exactly. Note that D3
 * makes the enemy's real min-damage DERIVED (`max(scaledBase, playerMaxHP / D)`),
 * so these seeds are a floor, not the operative number, once B4 lands.
 */
export const ENEMY_STATS: FighterStats = {
  level: 9,
  spd: 1,
  atk: 1,
  defense: 5,
  danRank: 0,
  mastery: { light: 0, balanced: 0, heavy: 0 },
  weapon: { minDamage: 4, maxDamage: 4 },
};
