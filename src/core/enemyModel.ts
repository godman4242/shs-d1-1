/**
 * ENEMY DERIVATION (SESSION13 D3) — the named duellist's HP and damage are
 * **not authored**. The original recomputes them at spawn from the PLAYER's own
 * stats so that a fight always lasts K hits:
 *
 *   Δ            = enemyLevel − playerLevel
 *   K            = max(10 + Δ, 3)          // hits the player needs
 *   D            = max(18 − Δ, 3)          // hits the enemy needs
 *   effPlayerDmg = (playerMinDmg + playerDmgRange/2) − enemyDefense,
 *                  floored by the PLAYER's level
 *   enemyHP      = max( scaledBaseHP, effPlayerDmg × K )
 *   enemyMinDmg  = max( scaledBase,   playerMaxHP  / D )
 *   xpReward     = enemyLevel × 5 + 45
 *   if (enemyLevel <= 8) { enemyMinDmg = 1; enemyDefense = 1; }  // AFTER the HP line
 *
 * K/D are the NAMED-DUELLIST class's pair — the class that draws the white
 * `charname + " (" + level + ")"` nameplate `DuelScene` renders. Read verbatim:
 * `_loc8_ = 10 + _loc7_; _loc9_ = 18 - _loc7_;`, each floored at 3. (The generic
 * 8/16 pair belongs to a DIFFERENT class; `SOURCE_CONSTANTS.md` §3.8 quoted the
 * wrong one and was corrected.)
 *
 * THE DESIGN IS SYMMETRIC, and this is the cleanest one-line statement of the
 * original's combat model: **the player kills in K hits, the enemy kills the
 * player in D hits.** Both sides are tuned in HITS, neither in hit points — so
 * hits-to-kill is the tuning knob and HP is an OUTPUT.
 *
 * The `level <= 8` override fires AFTER the HP derivation, so HP still scales
 * but damage and defence are forced to 1. Our old `DUEL_ENEMY.level = 1` sat
 * inside it, which is why the duel was literally unlosable; both fighters go to
 * level 9 — the lowest level that escapes it.
 */
import { ENEMY_K_BASE, ENEMY_KD_FLOOR, ENEMY_D_BASE, LOW_LEVEL_OVERRIDE, XP_PER_LEVEL, XP_REWARD_BASE } from '../config/duel';
import { DAMAGE_FLOOR } from '../config/combat';
import { HALF } from '../config/nums';
import { minDamageForLevel } from './damage';

export interface PlayerSide {
  maxHp: number;
  minDamage: number;
  damageRange: number;
  level: number;
}

export interface EnemyAuthored {
  /** The authored/level-scaled base the source's `max(...)` compares against. */
  baseHp: number;
  baseMinDamage: number;
  defense: number;
  level: number;
}

export interface DerivedEnemy {
  hp: number;
  minDamage: number;
  defense: number;
  xpReward: number;
  /** Hits the player needs — exposed because it IS the tuning knob. */
  k: number;
  /** Hits the enemy needs. */
  d: number;
}

export function deriveEnemy(player: PlayerSide, enemy: EnemyAuthored): DerivedEnemy {
  const delta = enemy.level - player.level;
  const k = Math.max(ENEMY_K_BASE + delta, ENEMY_KD_FLOOR);
  const d = Math.max(ENEMY_D_BASE - delta, ENEMY_KD_FLOOR);
  const effPlayerDmg = Math.max(
    player.minDamage + player.damageRange * HALF - enemy.defense,
    minDamageForLevel(player.level),
  );
  const hp = Math.max(enemy.baseHp, effPlayerDmg * k);
  let minDamage = Math.max(enemy.baseMinDamage, player.maxHp / d);
  let defense = enemy.defense;
  // Fires AFTER the HP derivation: HP still scales, damage/defence do not.
  if (enemy.level <= LOW_LEVEL_OVERRIDE.maxLevel) {
    minDamage = DAMAGE_FLOOR;
    defense = DAMAGE_FLOOR;
  }
  return { hp, minDamage, defense, xpReward: enemy.level * XP_PER_LEVEL + XP_REWARD_BASE, k, d };
}
