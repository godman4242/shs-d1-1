/**
 * `RoomOgre.as` (336 lines), ported — what `createRoomNPC` builds for ai 23
 * instead of `EnemyOgre`. Lane L4b, slice 1. Overrides exactly
 * `update` / `startAction` / `doAction`; `spotPlayer` is its own.
 *
 * The goblin's twin, line for line, except: it sees the player only within
 * 200 px (`:315`), its charge clip is its walk clip (`:137`), its bar sits 200 px
 * up (`:26`), and when the idle timer runs out and the walk roll fails it NAPS
 * (`:186-189`) — five to fifteen seconds under one of two nap clips, whose
 * ends lead back to WALK. Same gaps as the goblin: no re-target, no FLY/STUN
 * in `doAction`, no knock-down branch. The repeated destination/bounce blocks
 * are helpers within this class, as in `RoomGoblin.ts`.
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

export class RoomOgre extends Npc {
  /** `RoomOgre.as:6` */
  destX = ZERO;
  /** `RoomOgre.as:8` — frames left in IDLE, and then in NAP. */
  idleCounter = ZERO;
  /** `RoomOgre.as:10` */
  doChase: boolean;
  /** `RoomOgre.as:12` */
  onAlert = false;

  /** `RoomOgre.as:14` */
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
    this.healthBarY = OG_ROOM.ogreBarY;
  }

  /** `RoomOgre.as:125-134` (and `:210-219`, `:259-268`). */
  private headForDest(): void {
    if (this.destX < this.posX) {
      this.walkSpeed = asInt(-this.rng() * OG_ROOM.walk.range - OG_ROOM.walk.base);
      this.faceLeft();
    } else {
      this.walkSpeed = asInt(this.rng() * OG_ROOM.walk.range + OG_ROOM.walk.base);
      this.faceRight();
    }
  }

  /** `RoomOgre.as:199-220` / `:248-269`. */
  private bounceIfBlocked(): void {
    const facingRight = this.isFacingRight();
    if (this.world.npcBlocked(this.x, facingRight)) {
      this.movePositionX(-this.walkSpeed);
      if (!facingRight) this.destX = asInt(this.posX + this.rng() * (this.world.stageWidth - this.posX));
      else this.destX = asInt(this.rng() * this.posX);
      this.headForDest();
    }
  }

  /** `RoomOgre.as:30` */
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
        case OG_ANIM.OGRE_SWINGDOWN:
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
        case OG_ANIM.OGRE_FIDGET:
          this.startAnim(OG_ANIM.OGRE_IDLE);
          break;
        case OG_ANIM.OGRE_NAP1_END:
        case OG_ANIM.OGRE_NAP2_END:
          this.startAction(OG_STATE.WALK);
          break;
        case OG_ANIM.OGRE_NAP1_START:
          this.startAnim(OG_ANIM.OGRE_NAP1_MID);
          break;
        default:
          break;
      }
    }
    this.doAction();
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
  }

  /** `RoomOgre.as:113` */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE:
        this.startAnim(OG_ANIM.OGRE_IDLE);
        this.idleCounter = OG_ROOM.idleFrames;
        break;
      case OG_STATE.WALK:
        this.startAnim(OG_ANIM.OGRE_WALK);
        this.destX = asInt(this.rng() * this.world.stageWidth);
        this.headForDest();
        break;
      case OG_STATE.RUN:
        this.startAnim(OG_ANIM.OGRE_WALK);
        break;
      case OG_STATE.ATTACK:
        this.startAnim(OG_ANIM.OGRE_SWINGDOWN);
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
      case OG_STATE.NAP:
        if (asInt(this.rng() * OG_ROOM.napDice) === ZERO) this.startAnim(OG_ANIM.OGRE_NAP1_START);
        else this.startAnim(OG_ANIM.OGRE_NAP2_START);
        this.idleCounter = asInt((OG_ROOM.nap.baseSec + this.rng() * OG_ROOM.nap.rangeSec) * OG_ROOM.nap.fps);
        break;
      default:
        break;
    }
  }

  /** `RoomOgre.as:172` */
  override doAction(): void {
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) {
          this.idleCounter = OG_ROOM.idleFrames;
          if (!this.world.cutsceneShowing && asInt(this.rng() * OG_ROOM.walkDice) === OG_ROOM.walkOn) {
            this.startAction(OG_STATE.WALK);
          } else {
            this.startAction(OG_STATE.NAP);
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
      case OG_STATE.NAP:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) {
          if (this.getAnim() === OG_ANIM.OGRE_NAP2_START) this.startAnim(OG_ANIM.OGRE_NAP2_END);
          else if (this.getAnim() === OG_ANIM.OGRE_NAP1_MID) this.startAnim(OG_ANIM.OGRE_NAP1_END);
        }
        break;
      default:
        break;
    }
  }

  /** `RoomOgre.as:306` — the goblin's, at 200 px and without the in-branch RUN. */
  spotPlayer(): void {
    if (this.world.transitioning || this.world.noAggro || this.world.cutsceneShowing) return;
    const target = this.target;
    if (target === null) return;
    const facingRight = this.isFacingRight();
    const posdiff = target.x - this.x;
    if (facingRight && posdiff > ZERO && posdiff < OG_ROOM.ogreSightX) {
      this.walkSpeed = asInt(this.rng() * OG_ROOM.chase.range + OG_ROOM.chase.base);
      this.onAlert = true;
    } else if (!facingRight && posdiff < ZERO && posdiff > -OG_ROOM.ogreSightX) {
      this.walkSpeed = asInt(-(this.rng() * OG_ROOM.chase.range + OG_ROOM.chase.base));
      this.onAlert = true;
    }
    // The source re-checks `isTransitioning()` here; the guard above already returned on it.
    if (this.onAlert) this.startAction(OG_STATE.RUN);
  }
}
