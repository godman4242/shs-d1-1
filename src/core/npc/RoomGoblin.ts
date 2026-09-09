/**
 * `RoomGoblin.as` (306 lines), ported — what `createRoomNPC` builds for ai 22
 * instead of `EnemyGoblin`. Lane L4b, slice 1. Overrides exactly
 * `update` / `startAction` / `doAction`; `spotPlayer` is its own.
 *
 * A wanderer: idle two seconds, maybe pick a random x and walk to it, repeat.
 * With `doChase` (a constructor flag the dispatch passes) it also watches for
 * the player inside 300 px IN FRONT and charges. Three things it does NOT have,
 * kept as gaps because they are the source's: no re-targeting, no FLY or STUN
 * handling in `doAction`, and no knock-down branch in the get-up switch.
 *
 * ⚠️ `:168` reads `int(Math.random() * 2 == 1)` — the product is compared with
 * 1 before the int, so the fidget fires only on an exact 0.5. Ported as it reads.
 * Numbers: `config/ogRoomNpc.ts` and `config/ogNpcHumanoid.ts`.
 */
import { OG_ANIM, OG_PART, OG_STATE, type OgState } from '../../config/ogActor';
import {
  OG_HUMANOID_BAR_X_RESET,
  OG_HUMANOID_DOWNED_BAR_X,
  OG_HUMANOID_DOWNEDUP_STEP,
  OG_HUMANOID_DOWNSTAB_MULT,
  OG_HUMANOID_FALL_GRAVITY,
} from '../../config/ogNpcHumanoid';
import { OG_ROOM } from '../../config/ogRoomNpc';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { asInt } from './MCSActor';
import { Npc } from './Npc';
import { NpcDamage } from './NpcDamage';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class RoomGoblin extends Npc {
  /** `RoomGoblin.as:6` — where the current wander is heading. */
  destX = ZERO;
  /** `RoomGoblin.as:8` — frames left in IDLE. */
  idleCounter = ZERO;
  /** `RoomGoblin.as:10` — the dispatch's `doChase` argument. */
  doChase: boolean;
  /** `RoomGoblin.as:12` — set once the player has been spotted. */
  onAlert = false;

  /** `RoomGoblin.as:14` */
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
    this.healthBarY = OG_ROOM.goblinBarY;
  }

  /** `RoomGoblin.as:118-127` (and again at `:192-201`, `:241-250`) — sign the speed toward `destX`. */
  private headForDest(): void {
    if (this.destX < this.posX) {
      this.walkSpeed = asInt(-this.rng() * OG_ROOM.walk.range - OG_ROOM.walk.base);
      this.faceLeft();
    } else {
      this.walkSpeed = asInt(this.rng() * OG_ROOM.walk.range + OG_ROOM.walk.base);
      this.faceRight();
    }
  }

  /** `RoomGoblin.as:181-202` / `:230-251` — furniture in the way: step back, re-pick the far side, turn. */
  private bounceIfBlocked(): void {
    const facingRight = this.isFacingRight();
    if (this.world.npcBlocked(this.x, facingRight)) {
      this.movePositionX(-this.walkSpeed);
      if (!facingRight) this.destX = asInt(this.posX + this.rng() * (this.world.stageWidth - this.posX));
      else this.destX = asInt(this.rng() * this.posX);
      this.headForDest();
    }
  }

  /** `RoomGoblin.as:30` */
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
        case OG_ANIM.GOB_ATTACK:
        case OG_ANIM.DOWNSTAB_UP:
          this.startAction(OG_STATE.WALK);
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
            this.startAnim(OG_ANIM.GOTLAUNCHEDDOWNEDEND);
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
        case OG_ANIM.DOWNSTAB: {
          const target = this.target;
          if (target?.isDowned() === true) {
            target.checkHitObject(
              { kind: 'part', part: OG_PART.weapon, owner: this },
              new NpcDamage(this.damage * OG_HUMANOID_DOWNSTAB_MULT, this.level),
            );
          }
          this.startAnim(OG_ANIM.DOWNSTAB_UP);
          break;
        }
        case OG_ANIM.GOB_FIDGET:
          this.startAnim(OG_ANIM.GOB_IDLE);
          break;
        default:
          break;
      }
    }
    this.doAction();
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
  }

  /** `RoomGoblin.as:106` */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE:
        this.startAnim(OG_ANIM.GOB_IDLE);
        this.idleCounter = OG_ROOM.idleFrames;
        break;
      case OG_STATE.WALK:
        this.startAnim(OG_ANIM.GOB_WALK);
        this.destX = asInt(this.rng() * this.world.stageWidth);
        this.headForDest();
        break;
      case OG_STATE.RUN:
        this.startAnim(OG_ANIM.GOB_RUN);
        break;
      case OG_STATE.ATTACK:
        this.startAnim(OG_ANIM.GOB_ATTACK);
        break;
      case OG_STATE.GOTLAUNCHED:
        this.startAnim(OG_ANIM.GOTLAUNCHED_RISE);
        break;
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

  /** `RoomGoblin.as:154` */
  override doAction(): void {
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) {
          this.idleCounter = OG_ROOM.idleFrames;
          if (!this.world.cutsceneShowing && asInt(this.rng() * OG_ROOM.walkDice) === OG_ROOM.walkOn) {
            this.startAction(OG_STATE.WALK);
          } else if (this.rng() * OG_ROOM.fidgetDice === OG_ROOM.fidgetOn) {
            this.startAnim(OG_ANIM.GOB_FIDGET);
          }
        }
        if (!this.onAlert && this.doChase) this.spotPlayer();
        break;
      case OG_STATE.WALK:
        this.movePositionX(this.walkSpeed);
        this.bounceIfBlocked();
        if (Math.abs(this.destX - this.posX) < OG_ROOM.arriveX) {
          if (asInt(this.rng() * OG_ROOM.arriveDice) === ZERO) this.startAction(OG_STATE.IDLE);
          else this.startAction(OG_STATE.WALK);
        }
        if (this.doChase) this.spotPlayer();
        break;
      case OG_STATE.RUN:
        this.movePositionX(this.walkSpeed);
        if (this.posX < ZERO || this.posX > this.world.stageWidth) this.startAction(OG_STATE.IDLE);
        if (this.target !== null && Math.abs(this.x - this.target.x) < OG_ROOM.attackX) {
          this.startAction(OG_STATE.ATTACK);
        }
        this.bounceIfBlocked();
        break;
      case OG_STATE.ATTACK:
        break;
      case OG_STATE.GOTLAUNCHED:
        this.doLaunched();
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
      case OG_STATE.DYING:
        break;
      default:
        break;
    }
  }

  /** `RoomGoblin.as:274` — notice the player in front within 300 px and charge. */
  spotPlayer(): void {
    if (this.world.transitioning || this.world.noAggro || this.world.cutsceneShowing) return;
    const target = this.target;
    if (target === null) return;
    const facingRight = this.isFacingRight();
    const posdiff = target.x - this.x;
    if (facingRight && posdiff > ZERO && posdiff < OG_ROOM.goblinSightX) {
      this.walkSpeed = asInt(this.rng() * OG_ROOM.chase.range + OG_ROOM.chase.base);
      this.onAlert = true;
      this.startAction(OG_STATE.RUN);
    } else if (!facingRight && posdiff < ZERO && posdiff > -OG_ROOM.goblinSightX) {
      this.walkSpeed = asInt(-(this.rng() * OG_ROOM.chase.range + OG_ROOM.chase.base));
      this.onAlert = true;
      this.startAction(OG_STATE.RUN);
    }
    // The source re-checks `isTransitioning()` here; the guard above already returned on it.
    if (this.onAlert) this.startAction(OG_STATE.RUN);
  }
}
