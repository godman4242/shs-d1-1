/**
 * `FriendlyArcher.as` (86 lines), ported — ai 34, `extends EnemyArcher`. Lane L4b,
 * slice 2b. Overrides exactly `setLevel` / `init` / `checkHitObject`.
 *
 * The player's archer: built from the PLAYER's live stats at three quarters
 * (`world.playerStats`, `:21-34`), worth no XP, levelled to the player's level on
 * `init` (`:58`), and hunting ENEMIES (`isFriendly` flips the `getNearestEnemy` ask
 * — the dispatch calls `setIsFriendly()`). A landed hit that will kill it asks the
 * manager for the kill-cam check (`:73-76`).
 *
 * ⚠️ PORTED THROUGH THE SINGLE-PART GEOMETRY: the source's `checkHitObject` scan
 * CONTINUES past a part whose `gotHit` refused (`:66-80` has no `return false`),
 * where `NPC.as:323` and the spear elite stop. `HitGeometry.partHitBy` answers one
 * part, so a refused bow hit ends the scan here too (DIVERGENCES, L4b slice 2b).
 * `mcs.setDisplayName(name, 0xFFCC00)` (`:57`) is render-side and not modelled.
 *
 * Numbers: `config/ogNpcFriendly.ts`.
 */
import { OG_STATE } from '../../config/ogActor';
import { OG_FRIENDLY } from '../../config/ogNpcFriendly';
import type { OgNpc } from '../../config/ogNpcs';
import { ZERO } from '../../config/nums';
import { EnemyArcher } from './EnemyArcher';
import { asInt } from './MCSActor';
import type { NpcDamage } from './NpcDamage';
import type { HitShape } from './types';

export class FriendlyArcher extends EnemyArcher {
  /** `FriendlyArcher.as:21` — every stat is an int, so each product truncates. */
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

  /**
   * `FriendlyArcher.as:36` — paperdoll, elements and loot from the row; the stats
   * come from `setLevel(StatsManager.getLevel())`. The elemental pairs are
   * `XMLNpc.as:196-212`'s (`<fire>` → FIREATK + EARTHDEF, `<earth>` → EARTHATK + WINDDEF).
   */
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

  /** `FriendlyArcher.as:61` — a landed hit that will kill it asks for the kill-cam check. */
  override checkHitObject(thing: HitShape, damage: NpcDamage, checkByAttacker = false): boolean {
    void checkByAttacker;
    const part = this.geometry.partHitBy(thing);
    if (part !== null && this.gotHit(part, damage)) {
      if (this.isGoingToDie()) this.world.externalRedFreezeCheck();
      return true;
    }
    this.gotHitFlag = false;
    return false;
  }
}
