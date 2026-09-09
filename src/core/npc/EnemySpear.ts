/**
 * `EnemySpear.as` (276 lines), ported — ai 4. Lane L4b, slice 1. Overrides
 * exactly `update` / `startAction` / `doAction`.
 *
 * Two enemies in one file: a coin at construction (`:19`) makes it a STABBER
 * or not. Both walk, then on a 1-in-4 roll inside 400 px break into a charge
 * (RUN, 8 px per frame). A stabber that arrives level with you does a real
 * SPEARSTABSTART attack (hit on the clip's end, then SPEARSTABEND); a
 * non-stabber just runs its weapon into you, testing the hit on every frame
 * of the charge (`:239`). Either stabs a downed target inside 50 px.
 * Numbers: `config/ogEnemySpear.ts` and `config/ogNpcHumanoid.ts`.
 */
import { OG_ANIM, OG_PART, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_SPEAR } from '../../config/ogEnemySpear';
import {
  OG_HUMANOID_BAR_X_RESET,
  OG_HUMANOID_DOWNED_BAR_X,
  OG_HUMANOID_DOWNEDUP_STEP,
  OG_HUMANOID_DOWNSTAB_MULT,
  OG_HUMANOID_FALL_GRAVITY,
  OG_HUMANOID_GETUP_STEP,
} from '../../config/ogNpcHumanoid';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { asInt } from './MCSActor';
import { Npc } from './Npc';
import { NpcDamage } from './NpcDamage';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class EnemySpear extends Npc {
  /** `EnemySpear.as:6` / `:19` — decided by the rng at construction. */
  isStabber: boolean;

  /** `EnemySpear.as:8` */
  constructor(world: NpcWorld, anims: AnimLibrary, geometry: HitGeometry, rng: Rng, target: NpcTarget | null = null) {
    super(world, anims, geometry, rng, target);
    this.isStabber = asInt(this.rng() * OG_SPEAR.stabberDice) === ONE;
  }

  private swing(mult = ONE): void {
    this.target?.checkHitObject(
      { kind: 'part', part: OG_PART.weapon, owner: this },
      new NpcDamage(this.damage * mult, this.level),
    );
  }

  /** `EnemySpear.as:22` */
  override update(): void {
    if (this.disposed || this.animFrozen) return;
    if (this.target === null || this.target.isDead()) {
      this.target = this.world.nearestEnemy(this.getMapPosition(), true);
      if (this.target === null) return;
    }
    const target = this.target;
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
        case OG_ANIM.ENEMYLAND:
        case OG_ANIM.SPEARSTABEND:
        case OG_ANIM.DOWNSTAB_UP:
          this.startAction(OG_STATE.WALK);
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
            if (this.getHP() > ZERO) this.showHealthBar();
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
          this.swing();
          this.startAnim(OG_ANIM.SPEARSTABEND);
          break;
        case OG_ANIM.DOWNSTAB:
          if (target.isDowned()) this.swing(OG_HUMANOID_DOWNSTAB_MULT);
          this.startAnim(OG_ANIM.DOWNSTAB_UP);
          break;
        default:
          break;
      }
    }
    this.doAction();
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
    if (this.checkAITrigger()) this.target = this.world.nearestEnemy(this.getMapPosition(), true);
  }

  /** `EnemySpear.as:135` */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE:
        this.startAnim(OG_ANIM.SPEARIDLE);
        break;
      case OG_STATE.WALK:
        this.walkSpeed = asInt(this.rng() * OG_SPEAR.walk.range + OG_SPEAR.walk.base);
        this.startAnim(OG_ANIM.SPEARWALK);
        break;
      case OG_STATE.ATTACK:
        this.faceTarget();
        this.startAnim(OG_ANIM.SPEARSTABSTART);
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

  /** `EnemySpear.as:175` */
  override doAction(): void {
    const target = this.target;
    if (target === null) return;
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.startAction(OG_STATE.WALK);
        break;
      case OG_STATE.WALK: {
        const playerX = target.x;
        const playerY = target.y;
        if (playerX < this.x) {
          this.faceLeft();
          if (
            this.x - playerX < OG_SPEAR.charge.x &&
            this.y - playerY < OG_SPEAR.charge.dyLeft &&
            asInt(this.rng() * OG_SPEAR.charge.dice) === ZERO
          ) {
            this.startAction(OG_STATE.RUN);
          } else {
            this.movePositionX(-this.walkSpeed);
          }
        } else {
          this.faceRight();
          if (
            playerX - this.x < OG_SPEAR.charge.x &&
            this.y - playerY < OG_SPEAR.charge.dyRight &&
            asInt(this.rng() * OG_SPEAR.charge.dice) === ZERO
          ) {
            this.startAction(OG_STATE.RUN);
          } else {
            this.movePositionX(this.walkSpeed);
          }
        }
        break;
      }
      case OG_STATE.RUN: {
        // `mcs.scaleX == 1`
        if (this.facingRight && this.scale === ONE) this.movePositionX(OG_SPEAR.run.speed);
        else this.movePositionX(-OG_SPEAR.run.speed);
        const distanceAway = this.x - target.x;
        const absDistanceAway = Math.abs(distanceAway);
        if (absDistanceAway < OG_SPEAR.run.engageX) {
          if (absDistanceAway < OG_SPEAR.run.stabX && target.isDowned()) {
            this.startAction(OG_STATE.STAB);
          } else if (
            (this.isFacingRight() && distanceAway <= ZERO) ||
            (!this.isFacingRight() && distanceAway >= ZERO)
          ) {
            if (this.isStabber && this.y - target.y < OG_SPEAR.run.attackDy) this.startAction(OG_STATE.ATTACK);
            else this.swing();
          }
        } else if (absDistanceAway > OG_SPEAR.run.giveUpX) {
          this.startAction(OG_STATE.WALK);
        }
        break;
      }
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
      default:
        break;
    }
  }
}
