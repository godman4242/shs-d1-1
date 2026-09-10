/**
 * `EnemyCivilian.as` (355 lines), ported — ai 7, and the fallback every room
 * dispatch builds when no case matches (`NPCManager.as:734`, `:766`). Parent of
 * `EnemyCivilianFemale` and `EnemyCivilianOld`. Lane L4b, slice 2a. Overrides
 * exactly `init` / `update` / `startAction` / `doAction`; `spotPlayer` is its own.
 *
 * A bystander: level 1 whatever the roster says, wanders between random x's,
 * steps back from furniture, and — with `doChase` — bolts when the player comes
 * within 300 px in front, shouting one of five `LangManager` lines (ids 410–414,
 * carried as a `speech` event by id). It never looks for a target: `update()` has
 * no `getNearestEnemy` and no re-target trigger, so `target` stays whatever the
 * constructor was given. ENEMYLAND ends into DOWNED, not WALK (`:61-63`).
 *
 * Unlike `RoomGoblin.spotPlayer`, the transition check comes AFTER `onAlert` is
 * set (`:322-327`): the alert sticks, the run and the line wait for the fade.
 * There is no `noAggro` or cutscene guard here.
 *
 * Numbers: `config/ogEnemyCivilian.ts`; the get-up / bar / fall twins are
 * `ogNpcHumanoid.ts`'s, each civilian line named there.
 */
import { OG_ANIM, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_CIVILIAN } from '../../config/ogEnemyCivilian';
import {
  OG_HUMANOID_BAR_X_RESET,
  OG_HUMANOID_DOWNED_BAR_X,
  OG_HUMANOID_DOWNEDUP_STEP,
  OG_HUMANOID_FALL_GRAVITY,
  OG_HUMANOID_GETUP_STEP,
} from '../../config/ogNpcHumanoid';
import type { OgNpc } from '../../config/ogNpcs';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { asInt } from './MCSActor';
import { Npc } from './Npc';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class EnemyCivilian extends Npc {
  /** `EnemyCivilian.as:6` — where the current wander is heading. */
  destX = ZERO;
  /** `EnemyCivilian.as:8` — frames left in IDLE. */
  idleCounter = ZERO;
  /** `EnemyCivilian.as:10` — the dispatch's `doChase` argument. */
  doChase: boolean;
  /** `EnemyCivilian.as:12` — set once the player has been spotted; never cleared. */
  onAlert = false;

  /** `EnemyCivilian.as:14` */
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

  /** `EnemyCivilian.as:28` — level 1, its own xp curve, straight into WALK. */
  override init(xml: OgNpc): void {
    this.initMCSFromXML(xml.mcs);
    this.damage = xml.attack ?? ZERO;
    this.defense = xml.defense ?? ZERO;
    this.maxhp = xml.hp ?? ZERO;
    this.level = OG_CIVILIAN.level;
    this.xp = this.level * OG_CIVILIAN.xp.perLevel + OG_CIVILIAN.xp.base;
    this.reset();
    this.startAction(OG_STATE.WALK);
    this.reward = xml.loot ?? [];
  }

  /** `EnemyCivilian.as:41` */
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

  /** `EnemyCivilian.as:140-149` (and again `:243-252`) — sign the speed toward `destX` and face it. */
  private headForDest(): void {
    if (this.destX < this.posX) {
      this.walkSpeed = asInt(-this.rng() * OG_CIVILIAN.walk.range - OG_CIVILIAN.walk.base);
      this.faceLeft();
    } else {
      this.walkSpeed = asInt(this.rng() * OG_CIVILIAN.walk.range + OG_CIVILIAN.walk.base);
      this.faceRight();
    }
  }

  /** `EnemyCivilian.as:127` */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE:
        this.startAnim(OG_ANIM.IDLE2);
        this.idleCounter = OG_CIVILIAN.idle.frames;
        break;
      case OG_STATE.WALK:
        this.startAnim(OG_ANIM.WALK_SHEATHED);
        this.destX = asInt(this.rng() * this.world.stageWidth);
        this.headForDest();
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

  /** `EnemyCivilian.as:209` */
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
          this.headForDest();
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

  /** `EnemyCivilian.as:306` — the player within 300 px IN FRONT: bolt, and shout a line by id. */
  spotPlayer(): void {
    const target = this.target;
    if (target === null) return;
    const facingRight = this.isFacingRight();
    const posdiff = asInt(target.x - this.x);
    if (facingRight && posdiff > ZERO && posdiff < OG_CIVILIAN.sightX) {
      this.walkSpeed = asInt(this.rng() * OG_CIVILIAN.chase.range + OG_CIVILIAN.chase.base);
      this.onAlert = true;
    } else if (!facingRight && posdiff < ZERO && posdiff > -OG_CIVILIAN.sightX) {
      this.walkSpeed = asInt(-(this.rng() * OG_CIVILIAN.chase.range + OG_CIVILIAN.chase.base));
      this.onAlert = true;
    }
    if (this.onAlert) {
      if (this.world.transitioning) return;
      this.startAction(OG_STATE.RUN);
      const dice = asInt(this.rng() * OG_CIVILIAN.alert.dice);
      this.emit({ type: 'speech', table: 'lang', id: OG_CIVILIAN.alert.firstStringId + dice });
    }
  }
}
