/**
 * `EnemyCivilianFemale.as` (200 lines), ported — ai 33, `extends EnemyCivilian`.
 * Lane L4b, slice 2a. Overrides exactly `startAction` and `doAction`: the parent's
 * bodies with the female walk clip and a FIXED 3 px per frame where the parent rolls
 * 4..5 (`:35` / `:40` / `:138` / `:143`). Everything else — the RUN d6, the furniture
 * bounce, `spotPlayer` with `doChase` — is written out again because the source does.
 *
 * Numbers: `config/ogEnemyCivilianFemale.ts` for the 3, `ogEnemyCivilian.ts` for the
 * twins (each line named there).
 */
import { OG_ANIM, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_CIVILIAN } from '../../config/ogEnemyCivilian';
import { OG_CIVILIAN_FEMALE } from '../../config/ogEnemyCivilianFemale';
import { OG_HUMANOID_FALL_GRAVITY } from '../../config/ogNpcHumanoid';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { EnemyCivilian } from './EnemyCivilian';
import { asInt } from './MCSActor';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class EnemyCivilianFemale extends EnemyCivilian {
  /** `EnemyCivilianFemale.as:6` */
  constructor(
    world: NpcWorld,
    anims: AnimLibrary,
    geometry: HitGeometry,
    rng: Rng,
    target: NpcTarget | null = null,
    doChase = false,
  ) {
    super(world, anims, geometry, rng, target);
    this.doChase = doChase;
  }

  /** `EnemyCivilianFemale.as:33-42` (and again `:136-145`) — a fixed 3, signed toward `destX`. */
  private headForDestAt3(): void {
    if (this.destX < this.posX) {
      this.walkSpeed = -OG_CIVILIAN_FEMALE.walkSpeed;
      this.faceLeft();
    } else {
      this.walkSpeed = OG_CIVILIAN_FEMALE.walkSpeed;
      this.faceRight();
    }
  }

  /** `EnemyCivilianFemale.as:20` */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE:
        this.startAnim(OG_ANIM.IDLE2);
        this.idleCounter = OG_CIVILIAN.idle.frames;
        break;
      case OG_STATE.WALK:
        this.startAnim(OG_ANIM.SEXY_WALK);
        this.destX = asInt(this.rng() * this.world.stageWidth);
        this.headForDestAt3();
        break;
      case OG_STATE.RUN: {
        const dice = asInt(this.rng() * OG_CIVILIAN.run.dice);
        const clips = [
          OG_ANIM.KNIFEWALK,
          OG_ANIM.KATANAWALK,
          OG_ANIM.RUN_LIGHT,
          OG_ANIM.RUN_BALANCED,
          OG_ANIM.RUN_HEAVY,
          OG_ANIM.NINJARUN,
        ];
        const clip = clips[dice];
        if (clip !== undefined) this.startAnim(clip);
        if (dice >= OG_CIVILIAN.run.fastFrom) {
          this.walkSpeed = this.walkSpeed < ZERO ? -OG_CIVILIAN.run.speed : OG_CIVILIAN.run.speed;
        }
        break;
      }
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

  /** `EnemyCivilianFemale.as:102` */
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
          this.headForDestAt3();
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
