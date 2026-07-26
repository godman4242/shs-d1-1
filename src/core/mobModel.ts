/**
 * TRASH MOB DERIVATION — SESSION14 A2 (D4 / P1).
 *
 * Deliberately NOT `deriveEnemy`. That function models the **named duellist**
 * class, whose HP is recomputed from the player's stats so a fight lasts K hits.
 * A mob belongs to a different AI class whose HP is an authored 1, and routing
 * mobs through the duellist derivation would give every trash enemy 50 HP —
 * exactly the "wrong class" mistake `SOURCE_CONSTANTS.md` §3.8 made and
 * SESSION13's P1 corrected.
 *
 * What IS shared is the source's own low-level override (`lowLevelOverride`), so
 * a mob's damage and defence are the rule's OUTPUT, not a constant we typed.
 *
 * ⚠️ NO XP REWARD FIELD. The named duellist's `level × 5 + 45` is CONTRACT-SRC
 * for its own class; there is no measured mob reward, and inventing one by
 * analogy would be arithmetic dressed as evidence (`config/CLAUDE.md`: "don't
 * invent constants that feel missing"). Nothing consumes it yet. Veto = add one
 * WITH a source line.
 */
import { MOB_HP } from '../config/mobs';
import { lowLevelOverride } from './enemyModel';

export interface MobAuthored {
  level: number;
  /** Only reachable above the override's level ceiling — see `config/mobs.ts`. */
  baseMinDamage: number;
  baseDefense: number;
}

export interface DerivedMob {
  hp: number;
  minDamage: number;
  defense: number;
}

export function deriveMob(mob: MobAuthored): DerivedMob {
  const { minDamage, defense } = lowLevelOverride(mob.level, mob.baseMinDamage, mob.baseDefense);
  return { hp: MOB_HP, minDamage, defense };
}
