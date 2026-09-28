/**
 * THE DUELLIST'S BODY STATS — what `EnemyPlayer.init` (`EnemyPlayer.as:740-870`) makes of
 * `initDuelist`'s record through `MCSPlayer.initPlayer` / `initAttackStats` /
 * `initElementDefenseStats` (`MCSPlayer.as:182-268`). L5-OPP slice 1b-ii, a pure record:
 * the numbers the body fights with, and the stance `setStance` is handed (slice 3 ports
 * `setStance`, which turns `baseSlashLength` into `slashLength`).
 *
 * Only the Duel Mode opponent's path is ported: `isDuelist`, `controlledBy == 1` (the AI;
 * `DuelModeUI.as:381`). Android structure, web numbers (ruling R6); where the builds differ in
 * STRUCTURE the web side is ported, and `docs/DIVERGENCES.md` "L5-OPP SLICE 1b-ii" rules each:
 *   - the level scaling: web scales above 30 only below 80, and below 10 by ×0.9;
 *   - `maxreload` is 8 s (Android 5 s);
 *   - the web `stance` argument, used as given when it is not -1.
 * NOT ported here: the skill cooldown table (slice 7: the AI reads it, and it scales by the
 * LOCAL player's speed), the display name, the reward, and every flag `initPlayer` resets.
 *
 * AS3 stores every one of these into an `int`, so each result is ToInt32'd (`| ZERO`).
 */
import { ONE, ZERO } from '../../config/nums';
import {
  OG_BODY_INIT,
  OG_DUELLIST_LEVEL_SCALE,
  OG_DUELLIST_SPEED,
  OG_DUELLIST_XP,
  OG_NO_STANCE,
  OG_RANDOM_STANCE_COUNT,
  OG_STANCE,
  OG_STANCE_SKILL,
} from '../../config/ogDuellistProfile';
import { OG_FPS } from '../../config/timing';
import type { Rng } from '../Sim';
import { getMastery } from './duellistProfile';
import type { DuellistStats } from './duellistStats';

/** `MCSPlayer`'s fields after `EnemyPlayer.init`, as the fight reads them. */
export interface DuellistBody {
  readonly hp: number;
  readonly maxHp: number;
  readonly chi: number;
  readonly maxChi: number;
  readonly defense: number;
  readonly baseReload: number;
  readonly minDamage: number;
  readonly damageRange: number;
  readonly baseSlashLength: number;
  readonly slashUsage: number;
  readonly lightMastery: number;
  readonly balancedMastery: number;
  readonly heavyMastery: number;
  readonly level: number;
  readonly walkSpeed: number;
  readonly reload: number;
  readonly maxReload: number;
  /** `STAT_ATK`: the record's attack, not its `minDamage`. */
  readonly statAtk: number;
  readonly fireAtk: number;
  readonly windAtk: number;
  readonly waterAtk: number;
  readonly earthAtk: number;
  /** Always 0: `init` calls `initAttackStats` with five arguments, so its defaults win. */
  readonly criticalDmg: number;
  readonly piercingDmg: number;
  readonly fireDef: number;
  readonly windDef: number;
  readonly waterDef: number;
  readonly earthDef: number;
  readonly xp: number;
  /** The argument `setStance` receives (`OG_STANCE`). */
  readonly stance: number;
}

/**
 * `init`'s stance pick (`EnemyPlayer.as:836-859`; web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:858-885`, which first
 * uses the web-only `stance` argument). `rng` is drawn only when the three masteries tie.
 */
function pickStance(d: DuellistStats, stance: number, light: number, balanced: number, heavy: number, rng: Rng): number {
  if (stance !== OG_NO_STANCE) return stance;
  if (getMastery(d.skills, OG_STANCE_SKILL.reversed) > ZERO) return OG_STANCE.reversed;
  if (getMastery(d.skills, OG_STANCE_SKILL.dual) > ZERO) return OG_STANCE.dual;
  if (light === balanced && balanced === heavy) return (rng() * OG_RANDOM_STANCE_COUNT) | ZERO;
  let selected: number = OG_STANCE.balanced;
  if (light > balanced && light >= heavy) selected = OG_STANCE.light;
  if (heavy > balanced && heavy >= light) selected = OG_STANCE.heavy;
  return selected;
}

/** The web level scaling (`reference/decompiled/shs3_payload/scripts/§1t122s0§.as:812-822`): the multiplier, or 1. */
function levelScale(level: number): number {
  const s = OG_DUELLIST_LEVEL_SCALE;
  if (level > s.strong.above && level < s.strong.below) return s.strongMult;
  if (level < s.weakBelow) return s.weakMult;
  return ONE;
}

/**
 * `EnemyPlayer.init` on `initDuelist`'s record. `level` is `initDuelist`'s `playerLevel`;
 * `stance` is the web build's argument (`OG_NO_STANCE` for none); `rng` stands in for
 * `Math.random()`.
 */
export function initDuellistBody(d: DuellistStats, level: number, stance: number, rng: Rng): DuellistBody {
  const sp = OG_DUELLIST_SPEED;
  const light = getMastery(d.skills, OG_STANCE_SKILL.light);
  const balanced = getMastery(d.skills, OG_STANCE_SKILL.balanced);
  const heavy = getMastery(d.skills, OG_STANCE_SKILL.heavy);
  // `setHP(currenthp)` in initPlayer, then `if(controlledBy == 1) setHP(xml.hp)`: the AI
  // starts at full HP. The scaling below sets it to the scaled max. Chi is never refilled.
  const scale = levelScale(level);
  const maxHp = (d.hp * scale) | ZERO;

  return {
    hp: maxHp,
    maxHp,
    chi: d.currentChi,
    maxChi: d.chi,
    defense: d.defense,
    baseReload: (sp.reload.base + d.speed * sp.reload.perSpeed) | ZERO,
    minDamage: (d.minDamage * scale) | ZERO,
    damageRange: d.damageRange,
    // `| ZERO` is the int store: speed -20 divides by zero, and ToInt32(-Infinity) is 0.
    baseSlashLength:
      (sp.slashLength.base + Math.floor((sp.slashLength.maxIncrement * d.speed) / (sp.slashLength.halfSpeed + d.speed))) | ZERO,
    slashUsage: d.slashUsage,
    lightMastery: light,
    balancedMastery: balanced,
    heavyMastery: heavy,
    level,
    walkSpeed: OG_BODY_INIT.walkSpeed,
    reload: ZERO,
    maxReload: OG_BODY_INIT.maxReloadSec * OG_FPS,
    statAtk: d.attack,
    fireAtk: d.fireAtk,
    windAtk: d.windAtk,
    waterAtk: d.waterAtk,
    earthAtk: d.earthAtk,
    criticalDmg: ZERO,
    piercingDmg: ZERO,
    fireDef: d.fireDef,
    windDef: d.windDef,
    waterDef: d.waterDef,
    earthDef: d.earthDef,
    xp: (level * OG_DUELLIST_XP.perLevel + OG_DUELLIST_XP.base) | ZERO,
    stance: pickStance(d, stance, light, balanced, heavy, rng),
  };
}
