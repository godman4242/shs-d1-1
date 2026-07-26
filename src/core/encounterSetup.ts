/**
 * ENCOUNTER SETUP — SESSION14 A2. The sibling of `duelSetup`, never a reuse of it.
 *
 * A duel is a NAMED 1v1 (white nameplate, VS card, derived opponent). An
 * encounter is a crowd of trash mobs that die in one hit. They share the `Sim`,
 * the damage pipeline and the HUD chrome — and nothing else (D3).
 *
 * ⚠️ Mobs do NOT go through `deriveEnemy` (P1). See `core/mobModel.ts`.
 */
import {
  ENCOUNTER_BODY,
  ENCOUNTER_GROUND_Y,
  ENCOUNTER_MOB_BAND,
  ENCOUNTER_PLAYER_X,
  ENCOUNTER_SIZE,
  MOB_BASE,
  MOB_STATS,
} from '../config/mobs';
import { PLAYER_BASE } from '../config/combat-sim';
import { DUEL_SPAWNS } from '../config/duel';
import { ONE, ZERO } from '../config/nums';
import { deriveMob } from './mobModel';
import type { OpponentController } from './OpponentController';
import type { EnemySlot, FighterSpawn, SimSetup } from './Sim';

/**
 * Where mob `i` of `count` stands — an even spread across the band, at the
 * ground line. ⚠️ INFERRED (D10): spawn geometry is a known-unknown, so this is
 * an honest placeholder rather than a measurement. A single mob sits at the
 * band's near edge rather than dividing by zero.
 */
export function mobSpawnX(i: number, count: number): number {
  const span = ENCOUNTER_MOB_BAND.maxX - ENCOUNTER_MOB_BAND.minX;
  const gaps = count - ONE;
  if (gaps <= ZERO) return ENCOUNTER_MOB_BAND.minX;
  return ENCOUNTER_MOB_BAND.minX + (span * i) / gaps;
}

/** One trash mob's spawn — HP 1, damage and defence from the level override. */
export function mobSpawn(i: number, count: number): FighterSpawn {
  const derived = deriveMob(MOB_BASE);
  return {
    pos: { x: mobSpawnX(i, count), y: ENCOUNTER_GROUND_Y },
    hp: derived.hp,
    minDamage: derived.minDamage,
    damageRange: MOB_STATS.weapon.maxDamage - MOB_STATS.weapon.minDamage,
    defense: derived.defense,
    /** INFERRED — mobs carry no stance identity of their own; balanced is the
     *  neutral middle of the triangle (×1.0 both ways). */
    stance: 'balanced',
    deflectLearned: false,
    stats: MOB_STATS,
    halfW: ENCOUNTER_BODY.halfW,
    halfH: ENCOUNTER_BODY.halfH,
  };
}

/**
 * An encounter as the N-actor `Sim` takes it.
 *
 * `makeController` is a FACTORY, not a controller: every mob must get its OWN
 * instance, because controllers carry telegraph/mode state and one shared
 * instance would interleave eight fighters into a single decision machine.
 */
export function encounterSetup(
  makeController: (index: number) => OpponentController,
  count: number = ENCOUNTER_SIZE,
): SimSetup {
  const enemies: EnemySlot[] = [];
  for (let i = ZERO; i < count; i += ONE) {
    enemies.push({ spawn: mobSpawn(i, count), controller: makeController(i) });
  }
  return {
    player: {
      ...PLAYER_BASE,
      halfW: DUEL_SPAWNS.player.halfW,
      halfH: DUEL_SPAWNS.player.halfH,
      pos: { x: ENCOUNTER_PLAYER_X, y: ENCOUNTER_GROUND_Y },
    },
    enemies,
  };
}
