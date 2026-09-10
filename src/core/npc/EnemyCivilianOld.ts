/**
 * `EnemyCivilianOld.as` (258 lines), ported — ai 32, `extends EnemyCivilian`. Lane
 * L4b, slice 2a. Overrides exactly `update` / `startAction` / `doAction`.
 *
 * The old man: the old-man clips, a FIXED 1 px per frame (`:120` / `:125` / `:196`
 * / `:201`), and a RUN that is the same walk at the same 1 with no dice (`:129-139`).
 * `doChase` is forced off in the constructor (`:17`), so `spotPlayer` — still called
 * from the parent's shape — never fires.
 *
 * ⚠️ `update()` (`:20-104`) is BYTE-IDENTICAL to the parent's (`EnemyCivilian.as:41-125`):
 * an override that changes nothing. Written out because the source has it and the
 * tree test demands the override set (DIVERGENCES, L4b slice 2).
 *
 * Numbers: `config/ogEnemyCivilianOld.ts` for the 1, `ogEnemyCivilian.ts` and
 * `ogNpcHumanoid.ts` for the twins (each line named there).
 */
import { OG_ANIM, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_CIVILIAN } from '../../config/ogEnemyCivilian';
import { OG_CIVILIAN_OLD } from '../../config/ogEnemyCivilianOld';
import {
  OG_HUMANOID_BAR_X_RESET,
  OG_HUMANOID_DOWNED_BAR_X,
  OG_HUMANOID_DOWNEDUP_STEP,
  OG_HUMANOID_FALL_GRAVITY,
  OG_HUMANOID_GETUP_STEP,
} from '../../config/ogNpcHumanoid';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { EnemyCivilian } from './EnemyCivilian';
import { asInt } from './MCSActor';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class EnemyCivilianOld extends EnemyCivilian {
  /** `EnemyCivilianOld.as:6` — no `doChase` argument: it is always false. */
  constructor(world: NpcWorld, anims: AnimLibrary, geometry: HitGeometry, rng: Rng, target: NpcTarget | null = null) {
    super(world, anims, geometry, rng, target);
    this.doChase = false;
  }

  /** `EnemyCivilianOld.as:20` — see the header: identical to the parent's. */
  override update(): void {
    if (this.disposed || this.animFrozen) return;
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
        default:
          break;
      }
    }
    this.doAction();
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
  }

  /** `EnemyCivilianOld.as:118-127` (and again `:194-203`) — a fixed 1, signed toward `destX`. */
  private headForDestAt1(): void {
    if (this.destX < this.posX) {
      this.walkSpeed = -OG_CIVILIAN_OLD.walkSpeed;
      this.faceLeft();
    } else {
      this.walkSpeed = OG_CIVILIAN_OLD.walkSpeed;
      this.faceRight();
    }
  }

  /** `EnemyCivilianOld.as:106` */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE:
        this.startAnim(OG_ANIM.OLDMAN_IDLE);
        this.idleCounter = OG_CIVILIAN.idle.frames;
        break;
      case OG_STATE.WALK:
        this.startAnim(OG_ANIM.OLDMAN_WALK);
        this.destX = asInt(this.rng() * this.world.stageWidth);
        this.headForDestAt1();
        break;
      case OG_STATE.RUN:
        this.startAnim(OG_ANIM.OLDMAN_WALK);
        this.walkSpeed = this.walkSpeed < ZERO ? -OG_CIVILIAN_OLD.walkSpeed : OG_CIVILIAN_OLD.walkSpeed;
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
      case OG_STATE.REDFREEZE:
        this.animFrozen = true;
        break;
      default:
        break;
    }
  }

  /** `EnemyCivilianOld.as:160` */
  override doAction(): void {
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) {
          this.idleCounter = OG_CIVILIAN.idle.retryFrames;
          if (!this.world.cutsceneShowing && asInt(this.rng() * OG_CIVILIAN.idle.walkDice) === OG_CIVILIAN.idle.walkOn) {
            this.startAction(OG_STATE.WALK);
          }
        }
        if (!this.onAlert && this.doChase) this.spotPlayer();
        break;
      case OG_STATE.WALK: {
        this.movePositionX(this.walkSpeed);
        const facingRight = this.isFacingRight();
        if (this.world.npcBlocked(this.x, facingRight)) {
          this.movePositionX(-this.walkSpeed);
          if (!facingRight) this.destX = asInt(this.posX + this.rng() * (this.world.stageWidth - this.posX));
          else this.destX = asInt(this.rng() * this.posX);
          this.headForDestAt1();
        }
        if (Math.abs(this.destX - this.posX) < OG_CIVILIAN.arriveX) {
          if (asInt(this.rng() * OG_CIVILIAN.arriveDice) === ZERO) this.startAction(OG_STATE.IDLE);
          else this.startAction(OG_STATE.WALK);
        }
        if (this.doChase) this.spotPlayer();
        break;
      }
      case OG_STATE.RUN:
        this.movePositionX(this.walkSpeed);
        if (this.posX < ZERO || this.posX > this.world.stageWidth) this.startAction(OG_STATE.IDLE);
        break;
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
