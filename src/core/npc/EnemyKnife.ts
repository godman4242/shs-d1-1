/**
 * `EnemyKnife.as` (247 lines), ported — ai 1, and the value every roster row with
 * no `<ai>` gets (`XMLNpc.as:141`), so the most common enemy there is. Lane L4b,
 * slice 1. Overrides exactly `update` / `startAction` / `doAction`.
 *
 * Differs from the katana in three measured ways: a 50 px melee on both sides
 * (`:181`, `:200`); ONE hit per swing, on the frame KNIFEATTACK ends (`:51-54`)
 * rather than on every frame; and a DOWNSTAB for a downed target, at double
 * damage if it is still down when the clip ends (`:112-117`, `:183-186`).
 * Numbers: `config/ogEnemyKnife.ts` and `config/ogNpcHumanoid.ts`.
 */
import { OG_ANIM, OG_PART, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_KNIFE } from '../../config/ogEnemyKnife';
import {
  OG_HUMANOID_BAR_X_RESET,
  OG_HUMANOID_DOWNED_BAR_X,
  OG_HUMANOID_DOWNEDUP_STEP,
  OG_HUMANOID_DOWNSTAB_MULT,
  OG_HUMANOID_FALL_GRAVITY,
  OG_HUMANOID_GETUP_STEP,
} from '../../config/ogNpcHumanoid';
import { ONE, ZERO } from '../../config/nums';
import { asInt } from './MCSActor';
import { Npc } from './Npc';
import { NpcDamage } from './NpcDamage';

export class EnemyKnife extends Npc {
  /** `EnemyKnife.as:19` */
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
        case OG_ANIM.DOWNSTAB_UP:
          this.startAction(OG_STATE.WALK);
          break;
        case OG_ANIM.KNIFEATTACK:
          target.checkHitObject(
            { kind: 'part', part: OG_PART.weapon, owner: this },
            new NpcDamage(this.damage, this.level),
          );
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
        case OG_ANIM.DOWNSTAB:
          if (target.isDowned()) {
            target.checkHitObject(
              { kind: 'part', part: OG_PART.weapon, owner: this },
              new NpcDamage(this.damage * OG_HUMANOID_DOWNSTAB_MULT, this.level),
            );
          }
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

  /** `EnemyKnife.as:131` */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE:
        this.setPose(OG_ANIM.KNIFEWALK, ZERO);
        break;
      case OG_STATE.WALK:
        this.walkSpeed = asInt(this.rng() * OG_KNIFE.walk.range + OG_KNIFE.walk.base);
        this.startAnim(OG_ANIM.KNIFEWALK);
        break;
      case OG_STATE.ATTACK:
        this.startAnim(OG_ANIM.KNIFEATTACK);
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
        this.startAnim(OG_ANIM.DOWNSTAB);
        break;
      default:
        break;
    }
  }

  /** `EnemyKnife.as:166` */
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
          if (this.x - playerX < OG_KNIFE.melee.x && this.y - playerY < OG_KNIFE.melee.dy) {
            if (target.isDowned()) this.startAction(OG_STATE.STAB);
            else this.startAction(OG_STATE.ATTACK);
          } else {
            this.movePositionX(-this.walkSpeed);
          }
        } else {
          this.faceRight();
          if (playerX - this.x < OG_KNIFE.melee.x && this.y - playerY < OG_KNIFE.melee.dy) {
            if (target.isDowned()) this.startAction(OG_STATE.STAB);
            else this.startAction(OG_STATE.ATTACK);
          } else {
            this.movePositionX(this.walkSpeed);
          }
        }
        break;
      }
      case OG_STATE.ATTACK:
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
      default:
        break;
    }
  }
}
