/**
 * DUEL SETUP — the one place a duel's two fighters are built (SESSION13 B4).
 *
 * Exists so the scene and the 24-seed harness cannot drift: the enemy's HP and
 * damage are DERIVED from the player's own stats (`core/enemyModel.ts`), and a
 * harness that spawned an authored seed instead would be measuring a different
 * game from the one that ships.
 */
import { ENEMY_BASE, PLAYER_BASE } from '../config/combat-sim';
import { DUEL_ENEMY, DUEL_SPAWNS } from '../config/duel';
import { deriveEnemy } from './enemyModel';
import type { OpponentController } from './OpponentController';
import type { FighterSpawn, SimSetup } from './Sim';

export interface DuelSpawns {
  player: FighterSpawn;
  enemy: FighterSpawn;
}

/** The derived enemy's numbers, exposed for the HUD/result screen. */
export function duelEnemyDerived(): ReturnType<typeof deriveEnemy> {
  return deriveEnemy(
    {
      maxHp: PLAYER_BASE.hp,
      minDamage: PLAYER_BASE.minDamage,
      damageRange: PLAYER_BASE.damageRange,
      level: PLAYER_BASE.stats.level,
    },
    {
      baseHp: ENEMY_BASE.hp,
      baseMinDamage: ENEMY_BASE.minDamage,
      defense: ENEMY_BASE.defense,
      level: DUEL_ENEMY.level,
    },
  );
}

export function duelSpawns(): DuelSpawns {
  const derived = duelEnemyDerived();
  return {
    player: { ...PLAYER_BASE, ...DUEL_SPAWNS.player, pos: { ...DUEL_SPAWNS.player.pos } },
    enemy: {
      ...ENEMY_BASE,
      ...DUEL_SPAWNS.enemy,
      pos: { ...DUEL_SPAWNS.enemy.pos },
      hp: derived.hp,
      minDamage: derived.minDamage,
      defense: derived.defense,
    },
  };
}

/**
 * The duel as the N-actor `Sim` takes it (SESSION14 A1): a player and an array
 * of exactly ONE enemy. Both the scene and the 24-seed harness build the Sim
 * through here, so the duel cannot drift from the thing the harness measures.
 *
 * Encounters get a sibling of this function in A2 — they do NOT reuse it, and
 * in particular trash mobs must never run through `deriveEnemy` (P1: a mob's
 * HP is an authored 1, a different AI class from the named duellist).
 */
export function duelSetup(opponent: OpponentController): SimSetup {
  const spawns = duelSpawns();
  return { player: spawns.player, enemies: [{ spawn: spawns.enemy, controller: opponent }] };
}
