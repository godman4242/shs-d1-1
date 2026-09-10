/**
 * `EnemySpearElite.as` (584 lines), ported — ai 28 (`isBoss = false`) and ai 37
 * (`isBoss = true`), and the parent of `FriendlySpearElite`. Lane L4b, slice 2b.
 * Overrides exactly `setLevel` / `update` / `startAction` / `doAction` / `checkHitObject`;
 * `AI()` is its own.
 *
 * A duellist with seven moves chosen by `AI()` on the one-second trigger: inside 100
 * px a d4 (spin / flurry / launch, each behind a five-second cooldown, else the plain
 * stab); inside 200 a d5 (lunge / swing / kick, else nothing); a DOWNED target inside
 * 50 gets the downstab. It walks straight at its target and waits out a jumping one.
 * In peace, a duel elite bows once (`BOW2`) and holds the pose until the target is
 * within 100 map px.
 *
 * THE BOSS (`:51-129`): scaled like the base, then balanced against the PLAYER's live
 * stats — enough hp to survive `10 + lvldiff` player hits (floor 3) and enough damage
 * to kill in `18 − lvldiff` (floor 1). The player's hit is floored by an if / else-if
 * chain that FALLS THROUGH to `lvl / 4` (`:95-110`); ported as it reads.
 *
 * ⚠️ PORTED AS THEY READ: `AI()` arms `spearSpinCoolDown` for all three specials
 * (`:541`, `:547`, `:553`) — the flurry and launch cooldowns are never set. The
 * dead code dropped: `namecolor` (`:63`, written, never read) and the `else` at
 * `:65-68` (unreachable inside `isBoss`). The boss's second scaling block (`:71-78`)
 * runs with `factor = lvl / level = 1` and is kept, as it costs the int products.
 *
 * A landed hit by a FRIENDLY elite, and a killing hit on any elite, call
 * `world.externalRedFreezeCheck()`. Its weapon snaps a breakable projectile
 * (`:467-474`): a `breakProjectile` event and no damage.
 *
 * Numbers: `config/ogEnemySpearElite.ts`; humanoid twins `ogNpcHumanoid.ts`.
 */
import { OG_ANIM, OG_LAUNCH, OG_PART, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_SPEAR_ELITE } from '../../config/ogEnemySpearElite';
import {
  OG_HUMANOID_BAR_X_RESET,
  OG_HUMANOID_DOWNED_BAR_X,
  OG_HUMANOID_DOWNEDUP_STEP,
  OG_HUMANOID_DOWNSTAB_MULT,
  OG_HUMANOID_FALL_GRAVITY,
  OG_HUMANOID_GETUP_STEP,
} from '../../config/ogNpcHumanoid';
import { OG_FRIENDLY } from '../../config/ogNpcFriendly';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { asInt } from './MCSActor';
import { Npc } from './Npc';
import { NpcDamage } from './NpcDamage';
import type { AnimLibrary, HitGeometry, HitShape, NpcTarget, NpcWorld } from './types';

export class EnemySpearElite extends Npc {
  /** `EnemySpearElite.as:8` — the ONLY cooldown `AI()` ever arms. */
  spearSpinCoolDown = ZERO;
  /** `EnemySpearElite.as:10` — declared, decremented, never set. */
  spearFlurryCoolDown = ZERO;
  /** `EnemySpearElite.as:12` — declared, decremented, never set. */
  spearLaunchCoolDown = ZERO;
  /** `EnemySpearElite.as:14` — the duel bow happens once. */
  hasBowed = false;
  /** `EnemySpearElite.as:16` — the dispatch's flag: ai 37 is the boss. */
  isBoss: boolean;

  /** `EnemySpearElite.as:18` */
  constructor(
    world: NpcWorld,
    anims: AnimLibrary,
    geometry: HitGeometry,
    rng: Rng,
    target: NpcTarget | null = null,
    isBoss = false,
  ) {
    super(world, anims, geometry, rng, target);
    this.isBoss = isBoss;
  }

  /** `EnemySpearElite.as:53-58` (and again `:71-77`) — the base's scale, on int fields. */
  private scaleTo(lvl: number): void {
    const factor = lvl / this.level;
    this.level = lvl;
    this.damage = asInt(this.damage * factor);
    this.defense = asInt(this.defense * factor);
    this.maxhp = asInt(this.maxhp * factor);
    this.setHP(this.maxhp);
    this.updateHealthBar();
  }

  /** `EnemySpearElite.as:32` */
  override setLevel(lvl: number): void {
    if (!this.isBoss) {
      super.setLevel(lvl);
      return;
    }
    const B = OG_SPEAR_ELITE.boss;
    this.scaleTo(lvl);
    this.xp = lvl * B.xp.perLevel + B.xp.base;
    this.scaleTo(lvl);
    this.xp = lvl * B.xp.perLevel + B.xp.base;
    const P = this.world.playerStats;
    const playerHP = P.maxHp;
    const playerDEF = P.defense;
    const playerATK = asInt(P.minDamage + P.damageRange / OG_FRIENDLY.damageRangeDiv);
    const playerLVL = this.world.playerLevel;
    const lvldiff = lvl - playerLVL;
    let hitsToKillBoss = B.hitsToKillBossBase + lvldiff;
    let hitsToKillPlayer = B.hitsToKillPlayerBase - lvldiff;
    if (hitsToKillBoss <= B.hitsToKillBossMin) hitsToKillBoss = B.hitsToKillBossMin;
    if (hitsToKillPlayer <= ZERO) hitsToKillPlayer = B.hitsToKillPlayerMin;
    let playerhit = playerATK - this.defense;
    const F = B.floor;
    if (playerLVL <= F.tier1Level && playerhit < F.tier1Min) {
      playerhit = F.tier1Min;
    } else if (playerLVL <= F.tier2Level && playerhit < asInt(playerLVL / F.tier2Div)) {
      playerhit = asInt(playerLVL / F.tier2Div);
    } else if (playerLVL <= F.tier3Level && playerhit < asInt(playerLVL / F.tier3Div)) {
      playerhit = asInt(playerLVL / F.tier3Div);
    } else if (playerhit < asInt(playerLVL / F.tier4Div)) {
      playerhit = asInt(playerLVL / F.tier4Div);
    }
    const bossHP = playerhit * hitsToKillBoss;
    if (bossHP > this.maxhp) {
      this.maxhp = bossHP;
      this.setHP(this.maxhp);
      this.updateHealthBar();
    }
    const bosshit = asInt(playerHP / hitsToKillPlayer);
    const bossATK = bosshit + playerDEF;
    if (bossATK > this.damage) this.damage = bossATK;
    if (lvl <= B.trivialLevel) {
      this.damage = B.trivialStat;
      this.defense = B.trivialStat;
    }
  }

  /** `:229-231`, `:239-241`, `:390-392`… — a swing at the target; a FRIENDLY's landed hit asks for the kill-cam check. */
  private swing(part: typeof OG_PART.weapon | typeof OG_PART.l_foot, damage: NpcDamage): void {
    const target = this.target;
    if (target === null) return;
    if (target.checkHitObject({ kind: 'part', part, owner: this }, damage) && this.isFriendly) {
      this.world.externalRedFreezeCheck();
    }
  }

  /** `EnemySpearElite.as:133` — no early return on a missing target: `AI()` looks again each frame. */
  override update(): void {
    if (this.disposed || this.animFrozen) return;
    if (!this.dead && (this.target === null || this.target.isDead())) {
      this.target = this.world.nearestEnemy(this.getMapPosition(), !this.isFriendly);
    }
    const finishedAnimation = this.stepAnimation();
    if (finishedAnimation !== '') {
      switch (finishedAnimation) {
        case OG_ANIM.ENEMYDEATH:
        case OG_ANIM.DEATH_FORWARD:
        case OG_ANIM.DEFEATED2:
        case OG_ANIM.ENEMYDEATHNOHEAD:
        case OG_ANIM.ENEMYDEATHNOHAND:
        case OG_ANIM.DEATHDOWNED:
        case OG_ANIM.DEATHINHALF:
          this.deathAnimEnd();
          break;
        case OG_ANIM.SPEARLAUNCH:
        case OG_ANIM.ENEMYLAND:
        case OG_ANIM.SPEARSTABEND:
        case OG_ANIM.DOWNSTAB_UP:
        case OG_ANIM.SPEARLUNGEEND:
        case OG_ANIM.SPEARFLURRY:
        case OG_ANIM.SPEARKICKEND:
        case OG_ANIM.SPEARSWING:
        case OG_ANIM.SPEARSPINEND:
          this.startAction(OG_STATE.WALK);
          this.AI();
          break;
        case OG_ANIM.FLY_END:
          this.startAction(OG_STATE.DOWNED);
          break;
        case OG_ANIM.KNEEGROIN_VICTIM:
          this.startAnim(OG_ANIM.GETUP_FRONT);
          break;
        case OG_ANIM.GETUP_FRONT:
          this.movePositionX(this.isFacingRight() ? -OG_HUMANOID_GETUP_STEP : OG_HUMANOID_GETUP_STEP);
          this.startAction(OG_STATE.IDLE);
          break;
        case OG_ANIM.GOTLAUNCHED_PEAK:
          this.startAnim(OG_ANIM.GOTLAUNCHED_FALL);
          break;
        case OG_ANIM.GOTLAUNCHEDDOWNED:
          if (this.dead) {
            this.deathAnimEnd();
          } else {
            if (this.getHP() > ZERO && !this.world.redFreeze) this.showHealthBar();
            this.moveHealthBarX(OG_HUMANOID_DOWNED_BAR_X);
            if (this.actionState === OG_STATE.KNOCKDOWNED) this.startAnim(OG_ANIM.DOWNEDUP);
            else this.startAnim(OG_ANIM.GOTLAUNCHEDDOWNEDEND);
          }
          break;
        case OG_ANIM.GOTLAUNCHEDDOWNEDEND:
          this.startAnim(OG_ANIM.DOWNEDUP);
          break;
        case OG_ANIM.DOWNEDUP:
          this.moveHealthBarX(OG_HUMANOID_BAR_X_RESET);
          if (this.facingRight && this.scale === ONE) this.movePositionX(-OG_HUMANOID_DOWNEDUP_STEP);
          else this.movePositionX(OG_HUMANOID_DOWNEDUP_STEP);
          this.startAction(OG_STATE.WALK);
          break;
        case OG_ANIM.SPEARSTABSTART:
          this.swing(OG_PART.weapon, new NpcDamage(this.damage, this.level));
          this.startAnim(OG_ANIM.SPEARSTABEND);
          break;
        case OG_ANIM.DOWNSTAB:
          if (this.target?.isDowned() === true) {
            this.swing(OG_PART.weapon, new NpcDamage(this.damage * OG_HUMANOID_DOWNSTAB_MULT, this.level));
          }
          this.startAnim(OG_ANIM.DOWNSTAB_UP);
          break;
        case OG_ANIM.SPEARLUNGESTART:
          this.startAnim(OG_ANIM.SPEARLUNGEMID);
          break;
        case OG_ANIM.SPEARLUNGEMID:
          this.startAnim(OG_ANIM.SPEARLUNGEEND);
          break;
        case OG_ANIM.SPEARKICKSTART:
          this.startAnim(OG_ANIM.SPEARKICKMID);
          break;
        case OG_ANIM.SPEARKICKMID:
          this.startAnim(OG_ANIM.SPEARKICKMID2);
          break;
        case OG_ANIM.SPEARKICKMID2:
          this.startAnim(OG_ANIM.SPEARKICKEND);
          break;
        case OG_ANIM.SPEARSPINSTART:
          this.startAnim(OG_ANIM.SPEARSPINMID);
          break;
        case OG_ANIM.SPEARSPINMID:
          this.startAnim(OG_ANIM.SPEARSPINEND);
          break;
        default:
          break;
      }
    }
    this.doAction();
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
    if (this.spearSpinCoolDown > ZERO) this.spearSpinCoolDown -= ONE;
    if (this.spearFlurryCoolDown > ZERO) this.spearFlurryCoolDown -= ONE;
    if (this.spearLaunchCoolDown > ZERO) this.spearLaunchCoolDown -= ONE;
  }

  /** `EnemySpearElite.as:287` — POSE has no case: `AI()` starts the bow clip itself. */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE:
        this.startAnim(OG_ANIM.SPEARIDLE);
        break;
      case OG_STATE.WALK:
        this.walkSpeed = asInt(this.rng() * OG_SPEAR_ELITE.walk.range + OG_SPEAR_ELITE.walk.base);
        this.startAnim(OG_ANIM.SPEARRELAXWALK);
        break;
      case OG_STATE.ATTACK:
      case OG_STATE.DOSKILL:
        this.faceTarget();
        break;
      case OG_STATE.RUN:
        this.startAnim(OG_ANIM.SPEARCHARGE);
        break;
      case OG_STATE.GOTLAUNCHED:
        this.startAnim(OG_ANIM.GOTLAUNCHED_RISE);
        break;
      case OG_STATE.KNOCKDOWNED:
      case OG_STATE.DOWNED:
        this.startAnim(OG_ANIM.GOTLAUNCHEDDOWNED);
        break;
      case OG_STATE.FALL:
        this.startAnim(OG_ANIM.ENEMYJUMP);
        break;
      case OG_STATE.LAND:
        this.startAnim(OG_ANIM.ENEMYLAND);
        break;
      case OG_STATE.DYING:
        break;
      case OG_STATE.STAB:
        this.faceTarget();
        this.startAnim(OG_ANIM.DOWNSTAB);
        break;
      default:
        break;
    }
  }

  /** `EnemySpearElite.as:327` */
  override doAction(): void {
    if (this.target === null || this.checkAITrigger()) this.AI();
    const target = this.target;
    switch (this.actionState) {
      case OG_STATE.IDLE:
        if (target !== null && !target.isAirborne()) this.startAction(OG_STATE.WALK);
        break;
      case OG_STATE.WALK:
        if (target === null || target.isAirborne()) {
          this.startAction(OG_STATE.IDLE);
          return;
        }
        if (target.x < this.x) {
          this.faceLeft();
          this.movePositionX(-this.walkSpeed);
        } else {
          this.faceRight();
          this.movePositionX(this.walkSpeed);
        }
        break;
      case OG_STATE.GOTLAUNCHED:
        this.doLaunched();
        break;
      case OG_STATE.FLY:
        this.doFly();
        break;
      case OG_STATE.STUN:
        this.doStun();
        break;
      case OG_STATE.DOWNED:
        break;
      case OG_STATE.FALL:
        this.y += this.velY;
        this.velY += OG_HUMANOID_FALL_GRAVITY;
        if (this.y >= this.world.groundY) {
          this.y = this.world.groundY;
          this.startAction(OG_STATE.LAND);
        }
        break;
      case OG_STATE.LAND:
        break;
      case OG_STATE.DYING:
        this.doDying();
        break;
      case OG_STATE.ATTACK:
        if (this.animation === OG_ANIM.SPEARLAUNCH) {
          this.swing(OG_PART.weapon, new NpcDamage(this.damage, this.level, OG_LAUNCH.LAUNCH_AIR));
        } else if (this.animation === OG_ANIM.SPEARSPINMID) {
          this.swing(OG_PART.weapon, new NpcDamage(this.damage, this.level, OG_LAUNCH.LAUNCH_KNOCKDOWN));
        } else if (this.animation === OG_ANIM.SPEARLUNGEMID) {
          if (this.isFacingRight()) this.movePositionX(OG_SPEAR_ELITE.lungeStep);
          else this.movePositionX(-OG_SPEAR_ELITE.lungeStep);
          this.swing(OG_PART.weapon, new NpcDamage(this.damage, this.level));
        } else if (this.animation === OG_ANIM.SPEARFLURRY || this.animation === OG_ANIM.SPEARSWING) {
          this.swing(OG_PART.weapon, new NpcDamage(this.damage, this.level));
        }
        break;
      case OG_STATE.DOSKILL:
        if (this.animation === OG_ANIM.SPEARKICKMID) {
          if (this.isFacingRight()) this.movePositionX(OG_SPEAR_ELITE.kickStep);
          else this.movePositionX(-OG_SPEAR_ELITE.kickStep);
          this.swing(OG_PART.l_foot, new NpcDamage(this.damage, this.level, OG_LAUNCH.LAUNCH_KNOCKDOWN));
        } else if (this.animation === OG_ANIM.SPEARKICKMID2) {
          if (this.isFacingRight()) this.movePositionX(OG_SPEAR_ELITE.kickStep2);
          else this.movePositionX(-OG_SPEAR_ELITE.kickStep2);
        }
        break;
      default:
        break;
    }
  }

  /**
   * `EnemySpearElite.as:455` — the scan runs only while `!gotHitFlag`; the weapon
   * snaps a breakable projectile; a killing hit asks for the kill-cam check; a
   * refused hit ends the scan (as `NPC.as:323`).
   */
  override checkHitObject(thing: HitShape, damage: NpcDamage, checkByAttacker = false): boolean {
    void checkByAttacker;
    if (!this.gotHitFlag) {
      const part = this.geometry.partHitBy(thing);
      if (part !== null) {
        if (part === OG_PART.weapon && thing.breakable === true) {
          this.emit({ type: 'breakProjectile' });
          return false;
        }
        if (this.gotHit(part, damage)) {
          if (this.isGoingToDie()) this.world.externalRedFreezeCheck();
          return true;
        }
        return false;
      }
    }
    this.gotHitFlag = false;
    return false;
  }

  /** `EnemySpearElite.as:492` — re-target, bow in peace, then choose a move by distance and dice. */
  AI(): void {
    if (this.animFrozen || this.dead || this.isDowned() || this.isAirborne() || this.actionState === OG_STATE.GOTLAUNCHED) {
      return;
    }
    const newtarget = this.world.nearestEnemy(this.getMapPosition(), !this.isFriendly);
    if (newtarget !== null) this.target = newtarget;
    const target = this.target;
    if (target === null) return;
    const E = OG_SPEAR_ELITE;
    if (this.world.peaceful) {
      if (!this.hasBowed && this.world.duelMode) {
        this.hasBowed = true;
        this.startAction(OG_STATE.POSE);
        this.startAnim(OG_ANIM.BOW2);
      }
      if (this.actionState === OG_STATE.POSE && Math.abs(target.getMapPosition() - this.getMapPosition()) < E.bowApproachX) {
        this.startAction(OG_STATE.WALK);
      }
      return;
    }
    if (this.actionState === OG_STATE.POSE) this.startAction(OG_STATE.WALK);
    if (this.actionState === OG_STATE.WALK) {
      const absDistanceAway = asInt(Math.abs(this.x - target.x));
      if (absDistanceAway < E.stabX && target.isDowned()) {
        this.startAction(OG_STATE.STAB);
      } else if (absDistanceAway < E.melee.x) {
        const dice = asInt(this.rng() * E.melee.dice);
        const cooldown = E.cooldown.sec * E.cooldown.fps;
        if (dice === E.melee.spinOn && this.spearSpinCoolDown === ZERO) {
          this.startAction(OG_STATE.ATTACK);
          this.startAnim(OG_ANIM.SPEARSPINSTART);
          this.spearSpinCoolDown = cooldown;
        } else if (dice === E.melee.flurryOn && this.spearFlurryCoolDown === ZERO) {
          this.startAction(OG_STATE.ATTACK);
          this.startAnim(OG_ANIM.SPEARFLURRY);
          this.spearSpinCoolDown = cooldown;
        } else if (dice === E.melee.launchOn && this.spearLaunchCoolDown === ZERO) {
          this.startAction(OG_STATE.ATTACK);
          this.startAnim(OG_ANIM.SPEARLAUNCH);
          this.spearSpinCoolDown = cooldown;
        } else {
          this.startAction(OG_STATE.ATTACK);
          this.startAnim(OG_ANIM.SPEARSTABSTART);
        }
      } else if (absDistanceAway < E.ranged.x) {
        const dice = asInt(this.rng() * E.ranged.dice);
        if (dice === E.ranged.lungeOn) {
          this.startAction(OG_STATE.ATTACK);
          this.startAnim(OG_ANIM.SPEARLUNGESTART);
        } else if (dice === E.ranged.swingOn) {
          this.startAction(OG_STATE.ATTACK);
          this.startAnim(OG_ANIM.SPEARSWING);
        } else if (dice === E.ranged.kickOn) {
          this.startAction(OG_STATE.DOSKILL);
          this.startAnim(OG_ANIM.SPEARKICKSTART);
        }
      }
    }
  }
}
