/**
 * `Damage.as` (246 lines), ported — the packet an attacker hands `gotHit()`.
 *
 * Kept as a class with the source's own setters because 34 subclasses build one
 * per swing (`new Damage(damage, level)`) and the launch types drive `gotHit`'s
 * reaction dispatch. `flyVelX`/`flyVelY` are OVERLOADED in the source — a fly
 * velocity, a fly-away point, a stun duration + position, or a knee-groin
 * position, depending on `launchType` — and that overload is kept, not tidied:
 * `NPC.as` reads them back the same way.
 *
 * ⚠️ `getMinDamage()`'s ladder (≤10 → 1, ≤20 → lvl/8, ≤30 → lvl/6, else lvl/4)
 * is the SAME ladder `core/damage.ts` already holds as `minDamageForLevel`. It
 * is reused, not retyped; the AS3 return type is `int`, so the quotient is
 * truncated here as the source truncates it.
 */
import { OG_LAUNCH, type OgLaunch } from '../../config/ogActor';
import { OG_DAMAGE } from '../../config/ogNpcBase';
import { ZERO } from '../../config/nums';
import { minDamageForLevel } from '../damage';
import { asInt } from './MCSActor';
import type { Npc } from './Npc';

export class NpcDamage {
  damage: number;
  stance: number;
  launchType: number;
  attackerlvl: number;
  /** `Damage.as:32` */
  piercingDamage = ZERO;
  fireDamage: number;
  waterDamage: number;
  windDamage: number;
  earthDamage: number;
  /** `Damage.as:44` — overloaded: velocity, position, or stun duration. */
  flyVelX = ZERO;
  /** `Damage.as:46` — overloaded: velocity, position, or stun position. */
  flyVelY = ZERO;
  /** `Damage.as:48` */
  victimPosX: number = OG_DAMAGE.victimPosNone;
  /**
   * WEB only (`reference/decompiled/shs3_payload/scripts/§1t67s0§.as:50`): who struck. The duellist's `endSlash` sets it
   * (`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2861`); the ported mobs are Android-structured and never do.
   */
  attacker: Npc | null = null;

  /** `Damage.as:50` */
  constructor(
    damage = ZERO,
    attackerlvl = ZERO,
    launchType: number = OG_LAUNCH.LAUNCH_NONE,
    stance: number = OG_DAMAGE.stanceNone,
    fireDamage = ZERO,
    waterDamage = ZERO,
    windDamage = ZERO,
    earthDamage = ZERO,
  ) {
    this.damage = damage;
    this.launchType = launchType;
    this.attackerlvl = attackerlvl;
    this.stance = stance;
    this.fireDamage = fireDamage;
    this.waterDamage = waterDamage;
    this.windDamage = windDamage;
    this.earthDamage = earthDamage;
  }

  /** `Damage.as:63` */
  setPiercingDamage(num: number): void {
    this.piercingDamage = num;
  }

  /** WEB `reference/decompiled/shs3_payload/scripts/§1t67s0§.as:212`. */
  setAttacker(attacker: Npc): void {
    this.attacker = attacker;
  }

  /** `Damage.as:68` */
  isLaunchAir(): boolean {
    return this.launchType === OG_LAUNCH.LAUNCH_AIR;
  }

  /** `Damage.as:73` */
  isKnockDown(): boolean {
    return this.launchType === OG_LAUNCH.LAUNCH_KNOCKDOWN;
  }

  /** `Damage.as:78` */
  isFly(): boolean {
    return this.launchType === OG_LAUNCH.LAUNCH_FLY;
  }

  /** `Damage.as:83` */
  isFlyAway(): boolean {
    return this.launchType === OG_LAUNCH.LAUNCH_FLYAWAY;
  }

  /** `Damage.as:88` */
  isKneeGroin(): boolean {
    return this.launchType === OG_LAUNCH.KNEEGROIN;
  }

  /** `Damage.as:93` */
  isBackThrow(): boolean {
    return this.launchType === OG_LAUNCH.BACKTHROW;
  }

  /** `Damage.as:98` */
  isStun(): boolean {
    return this.launchType === OG_LAUNCH.STUN;
  }

  /** `Damage.as:103` */
  isDeathTouch(): boolean {
    return this.launchType === OG_LAUNCH.DEATHTOUCH;
  }

  /** `Damage.as:108` */
  isSubstitutionLog(): boolean {
    return this.launchType === OG_LAUNCH.SUBSTITUTIONLOG;
  }

  /** `Damage.as:113` — encodes the direction INTO `flyVelX` (1 = right, 0 = left). */
  setLaunchDir(facingRight: boolean): void {
    this.flyVelX = facingRight ? OG_DAMAGE.launchDirRight : OG_DAMAGE.launchDirLeft;
  }

  /** `Damage.as:125` */
  setFlyVel(velx: number, vely: number): void {
    this.flyVelX = velx;
    this.flyVelY = vely;
  }

  /** `Damage.as:131` — the fly-away POINT rides in the velocity slots. */
  setFlyAwayPos(posx: number, posy: number): void {
    this.flyVelX = posx;
    this.flyVelY = posy;
  }

  /** `Damage.as:137` — stun DURATION in `flyVelX`, forced x in `flyVelY`. */
  setStunTime(num: number, stunPosX = ZERO): void {
    this.flyVelX = num;
    this.flyVelY = stunPosX;
  }

  /** `Damage.as:143` */
  setSubstitutionLog(): void {
    this.damage = ZERO;
    this.attackerlvl = ZERO;
    this.launchType = OG_LAUNCH.SUBSTITUTIONLOG;
  }

  /**
   * `Damage.as:150-173` — the least a hit can do, by the ATTACKER's level.
   * `damage == 0 → 0`; `attackerlvl == 0 → damage` (an unlevelled source such as
   * a trap hits for exactly what it says); else the shared ladder + piercing.
   */
  getMinDamage(): number {
    if (this.damage === ZERO) return ZERO;
    if (this.attackerlvl === ZERO) return this.damage;
    return asInt(minDamageForLevel(this.attackerlvl)) + this.piercingDamage;
  }

  /** `Damage.as:175` */
  setDamage(num: number): void {
    this.damage = num;
  }

  /** `Damage.as:180` */
  setAttackerLvl(num: number): void {
    this.attackerlvl = num;
  }

  /** `Damage.as:185` */
  setLaunchType(num: OgLaunch): void {
    this.launchType = num;
  }

  /** `Damage.as:190` */
  setFireDamage(num: number): void {
    this.fireDamage = num;
  }

  /** `Damage.as:195` */
  setWaterDamage(num: number): void {
    this.waterDamage = num;
  }

  /** `Damage.as:200` */
  setWindDamage(num: number): void {
    this.windDamage = num;
  }

  /** `Damage.as:205` */
  setEarthDamage(num: number): void {
    this.earthDamage = num;
  }

  /** `Damage.as:210` */
  setVictimPosX(num: number): void {
    this.victimPosX = num;
  }

  /** `Damage.as:215-243` — the network wire form. Kept verbatim; L5's clone actor reads it. */
  getLaunchedString(): string {
    let str: string;
    const t = this.launchType;
    if (t === OG_LAUNCH.LAUNCH_AIR || t === OG_LAUNCH.LAUNCH_KNOCKDOWN) {
      str = `${t},${this.flyVelX}`;
    } else if (
      t === OG_LAUNCH.LAUNCH_FLY ||
      t === OG_LAUNCH.LAUNCH_FLYAWAY ||
      t === OG_LAUNCH.STUN ||
      t === OG_LAUNCH.DEATHTOUCH
    ) {
      str = `${t},${this.flyVelX},${this.flyVelY}`;
    } else if (t === OG_LAUNCH.KNEEGROIN) {
      str = `${t},${this.flyVelX},${this.flyVelY},${this.attackerlvl}`;
    } else if (t === OG_LAUNCH.BACKTHROW) {
      str = `${t},${this.flyVelX},${this.flyVelY}`;
    } else {
      str = String(t);
    }
    if (this.victimPosX !== OG_DAMAGE.victimPosNone) str += `,${this.victimPosX}`;
    return str;
  }
}
