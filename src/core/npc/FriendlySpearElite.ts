/**
 * `FriendlySpearElite.as` (60 lines), ported — ai 31, `extends EnemySpearElite`.
 * Lane L4b, slice 2b. Overrides exactly `setLevel` / `init`, and both are
 * byte-identical to `FriendlyArcher.as:21-59` — written out again because the
 * source does. Never a boss (`isBoss = false`, `:8`).
 *
 * `mcs.setDisplayName(name, 0xFFCC00)` (`:55`) is render-side and not modelled.
 * Numbers: `config/ogNpcFriendly.ts`.
 */
import { OG_STATE } from '../../config/ogActor';
import { OG_FRIENDLY } from '../../config/ogNpcFriendly';
import type { OgNpc } from '../../config/ogNpcs';
import { ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { EnemySpearElite } from './EnemySpearElite';
import { asInt } from './MCSActor';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class FriendlySpearElite extends EnemySpearElite {
  /** `FriendlySpearElite.as:6` */
  constructor(world: NpcWorld, anims: AnimLibrary, geometry: HitGeometry, rng: Rng, target: NpcTarget | null = null) {
    super(world, anims, geometry, rng, target, false);
  }

  /** `FriendlySpearElite.as:19` — 0.75 × the PLAYER's live stats; every stat is an int. */
  override setLevel(lvl: number): void {
    const P = this.world.playerStats;
    const playerHP = P.maxHp;
    const playerDEF = P.defense;
    const playerATK = asInt(P.minDamage + P.damageRange / OG_FRIENDLY.damageRangeDiv);
    this.damage = asInt(playerATK * OG_FRIENDLY.statScale);
    this.defense = asInt(playerDEF * OG_FRIENDLY.statScale);
    this.maxhp = asInt(playerHP * OG_FRIENDLY.statScale);
    this.setHP(this.maxhp);
    this.updateHealthBar();
    this.xp = OG_FRIENDLY.xp;
    this.level = lvl;
  }

  /** `FriendlySpearElite.as:34` — paperdoll, elements and loot from the row; the stats from the player. */
  override init(xml: OgNpc): void {
    this.initMCSFromXML(xml.mcs);
    this.reset();
    if (this.y === this.world.groundY) this.startAction(OG_STATE.WALK);
    else this.startAction(OG_STATE.FALL);
    const fire = xml.fire ?? ZERO;
    const earth = xml.earth ?? ZERO;
    this.STAT_FIREATK = fire;
    this.STAT_WINDATK = ZERO;
    this.STAT_WATERATK = ZERO;
    this.STAT_EARTHATK = earth;
    this.STAT_FIREDEF = ZERO;
    this.STAT_WINDDEF = earth;
    this.STAT_WATERDEF = ZERO;
    this.STAT_EARTHDEF = fire;
    this.reward = xml.loot ?? [];
    this.setLevel(this.world.playerLevel);
  }
}
