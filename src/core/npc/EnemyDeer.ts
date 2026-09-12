/**
 * `EnemyDeer.as` (261 lines), ported — ai 19, no children. Lane L4b, slice 3a.
 *
 * Pure prey. It has no ATTACK body at all (`:191-192` is an empty case that only
 * stops the switch falling through), and it is the ONLY one of the four whose
 * `update()` (`:42-69`) neither re-acquires a dead target nor calls
 * `checkAITrigger()` — the target it is handed is the target it keeps forever.
 *
 * THREE differences from its siblings, each pinned in `tests/npcSlice3a.test.ts`:
 *   - **it takes no `doChase`** (`:10`): the constructor has one argument, and
 *     nothing in the file reads a chase flag. A deer only ever flees.
 *   - **`idleCounter` ticks UNGUARDED, inside IDLE only** (`:135`), so it runs
 *     negative where the bear's `> 0` guard floors it at zero.
 *   - **two of its four idle clips hold five seconds** (`:87`/`:96`), and rising
 *     from SIT costs a whole extra clip (`:141-144` → DEER_GETUP → `:60-62` WALK).
 *
 * Its flee band is the only one with a BEHIND-THE-BACK range: 200 px when the
 * deer is looking at the player, 50 when its back is turned (`:219`/`:234`). And
 * where a fleeing bear always aims off-stage, a deer only does so in the
 * overworld — in a room it bolts to a RANDOM x (`:227`/`:242`).
 *
 * Numbers: `config/ogEnemyDeer.ts` + the shared `config/ogNpcAnimal.ts`.
 */
import { OG_ANIM, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_DEER } from '../../config/ogEnemyDeer';
import { OG_ANIMAL } from '../../config/ogNpcAnimal';
import type { OgNpc } from '../../config/ogNpcs';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { asInt } from './MCSActor';
import { NO_DICE, Npc } from './Npc';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class EnemyDeer extends Npc {
  /** `EnemyDeer.as:5` */
  destX = ZERO;
  /** `EnemyDeer.as:7` */
  idleCounter = ZERO;

  /** `EnemyDeer.as:10` — one argument in the source; no chase flag exists. */
  constructor(
    world: NpcWorld,
    anims: AnimLibrary,
    geometry: HitGeometry,
    rng: Rng,
    target: NpcTarget | null = null,
  ) {
    super(world, anims, geometry, rng, target);
    this.canGotLaunched = false;
    this.canGotKnockDown = false;
    this.canGotFly = false;
    this.canGotKneeGroin = false;
    this.canGotStun = false;
  }

  /** `EnemyDeer.as:28` */
  override init(xml: OgNpc): void {
    this.initMCSFromXML(xml.mcs);
    this.damage = xml.attack ?? ZERO;
    this.defense = xml.defense ?? ZERO;
    this.maxhp = xml.hp ?? ZERO;
    this.level = xml.lvl ?? ZERO;
    this.xp = this.level * OG_ANIMAL.xp.perLevel + OG_ANIMAL.xp.base;
    this.reset();
    this.startAction(OG_STATE.IDLE);
    this.reward = xml.loot ?? [];
    this.y = this.world.groundY;
  }

  /** `EnemyDeer.as:42` — NO target re-acquire and NO `checkAITrigger()`. */
  override update(): void {
    if (this.disposed || this.animFrozen) return;
    const finishedAnimation = this.stepAnimation();
    if (finishedAnimation !== '') {
      switch (finishedAnimation) {
        case OG_ANIM.DEER_DEATH:
          this.deathAnimEnd();
          break;
        case OG_ANIM.DEER_GRAZING:
        case OG_ANIM.DEER_FIDGET:
          this.startAction(OG_STATE.IDLE);
          break;
        case OG_ANIM.DEER_GETUP:
          this.startAction(OG_STATE.WALK);
          break;
        default:
          break;
      }
    }
    this.doAction();
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
  }

  /** `EnemyDeer.as:71` — the duration is set BEFORE the roll (`:79`) and two rolls raise it. */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE: {
        const dice = asInt(this.rng() * OG_DEER.idle.dice);
        this.idleCounter = OG_ANIMAL.idleFrames;
        if (dice === ZERO) {
          this.startAnim(OG_ANIM.DEER_IDLE);
        } else if (dice === OG_DEER.idle.grazeOn) {
          this.startAnim(OG_ANIM.DEER_GRAZING);
          this.idleCounter = OG_DEER.idle.longFrames;
        } else if (dice === OG_DEER.idle.fidgetOn) {
          this.startAnim(OG_ANIM.DEER_FIDGET);
        } else if (dice === OG_DEER.idle.sitOn) {
          this.startAnim(OG_ANIM.DEER_SIT);
          this.idleCounter = OG_DEER.idle.longFrames;
        }
        break;
      }
      case OG_STATE.WALK:
        this.startAnim(OG_ANIM.DEER_WALK);
        this.destX = asInt(this.rng() * this.world.stageWidth);
        if (this.destX < this.posX) {
          this.walkSpeed = -OG_ANIMAL.walkSpeed;
          this.faceLeft();
        } else {
          this.walkSpeed = OG_ANIMAL.walkSpeed;
          this.faceRight();
        }
        break;
      case OG_STATE.RUN:
        this.startAnim(OG_ANIM.DEER_RUN);
        if (this.destX < this.posX) {
          this.walkSpeed = -OG_ANIMAL.runSpeed;
          this.faceLeft();
        } else {
          this.walkSpeed = OG_ANIMAL.runSpeed;
          this.faceRight();
        }
        break;
      case OG_STATE.DYING:
        break;
      default:
        break;
    }
  }

  /** `EnemyDeer.as:130` — the counter ticks only in IDLE, and is not floored at zero. */
  override doAction(): void {
    const target = this.target;
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) {
          this.idleCounter = OG_ANIMAL.idleRetryFrames;
          if (!this.world.cutsceneShowing) {
            if (this.getAnim() === OG_ANIM.DEER_SIT) {
              this.startAnim(OG_ANIM.DEER_GETUP);
            } else if (asInt(this.rng() * OG_DEER.idle.walkDice) === OG_DEER.idle.walkOn) {
              this.startAction(OG_STATE.WALK);
            } else {
              this.startAction(OG_STATE.IDLE);
            }
          }
        }
        if (target !== null) this.checkPlayer(target);
        break;
      case OG_STATE.WALK:
        this.movePositionX(this.walkSpeed);
        if (Math.abs(this.destX - this.posX) < OG_ANIMAL.arriveX) {
          if (asInt(this.rng() * OG_ANIMAL.arriveDice) === ZERO) this.startAction(OG_STATE.IDLE);
          else this.startAction(OG_STATE.WALK);
        }
        if (target !== null) this.checkPlayer(target);
        break;
      case OG_STATE.RUN:
        this.movePositionX(this.walkSpeed);
        if (Math.abs(this.destX - this.posX) < OG_ANIMAL.arriveX) {
          if (asInt(this.rng() * OG_ANIMAL.arriveDice) === ZERO) this.startAction(OG_STATE.IDLE);
          else this.startAction(OG_STATE.WALK);
          if (
            this.world.adventureMode &&
            (this.posX <= -OG_ANIMAL.offStage.margin || this.posX > this.world.stageWidth + OG_ANIMAL.offStage.margin)
          ) {
            this.startAction(OG_STATE.REDFREEZE);
            this.startAnim(OG_ANIM.DEER_IDLE);
          }
        }
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
        this.velY += OG_ANIMAL.fallGravity;
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

  /**
   * `EnemyDeer.as:214` — 200 px when it is LOOKING at the player, 50 when its back
   * is turned (`&&` binds before `||`). At exactly equal x neither branch runs.
   * Outside the overworld it bolts to a RANDOM x, not off-stage.
   */
  private checkPlayer(target: NpcTarget): void {
    const playerX = asInt(target.x);
    if (playerX < this.x) {
      if (
        (this.x - playerX < OG_ANIMAL.fleeDist && !this.isFacingRight()) ||
        (this.x - playerX < OG_DEER.behindDist && this.isFacingRight())
      ) {
        if (this.world.adventureMode) this.destX = this.world.stageWidth + OG_ANIMAL.offStage.dest;
        else this.destX = asInt(this.rng() * this.world.stageWidth);
        this.startAction(OG_STATE.RUN);
      }
    } else if (playerX > this.x) {
      if (
        (playerX - this.x < OG_ANIMAL.fleeDist && this.isFacingRight()) ||
        (playerX - this.x < OG_DEER.behindDist && !this.isFacingRight())
      ) {
        if (this.world.adventureMode) this.destX = -OG_ANIMAL.offStage.dest;
        else this.destX = asInt(this.rng() * this.world.stageWidth);
        this.startAction(OG_STATE.RUN);
      }
    }
  }

  /** `EnemyDeer.as:249` — no death sound, no playback guard, no launch or downed branch. */
  override die(): void {
    this.createLoot();
    this.rewardXP();
    this.y = this.world.groundY;
    this.actionState = OG_STATE.DYING;
    this.startAnim(OG_ANIM.DEER_DEATH);
    this.emitDeath(NO_DICE, false);
    this.dead = true;
    this.hideHealthBar();
  }
}
