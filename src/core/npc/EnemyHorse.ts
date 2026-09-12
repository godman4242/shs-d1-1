/**
 * `EnemyHorse.as` (269 lines), ported — ai 12, no children. Lane L4b, slice 3a.
 *
 * A horse that is not chasing does NOTHING: its idle re-roll is fenced by
 * `!isShowing() && this.doChase` and the `else` re-enters IDLE (`:169-172`), and
 * its `checkPlayer()` returns on the first line unless `doChase` (`:232-235`).
 * It is the only one of the four with that early return.
 *
 * FOUR differences from its siblings, each pinned in `tests/npcSlice3a.test.ts`:
 *   - **`init` neither grounds the body nor flips `doChase`** (`:31-45`): the bear
 *     (`:41-46`) and the stag (`:39-44`) both do `mcs.y = getGroundY()` and
 *     `if(!isAdventureMode()) doChase = true`. A horse's chase flag is whatever
 *     the dispatch passed, in the overworld and in a room alike.
 *   - **the idle duration is set AFTER the clip branch** (`:96`), so all three
 *     clips hold the same two seconds — the bear's SIT roll changes its duration.
 *   - **RUN reads `isAdventureMode()` TWICE**, once per direction (`:118`/`:130`):
 *     15 px per frame in a room, 12 in the overworld, like the wolf's pair.
 *   - **it REARS instead of bolting** (`:241`/`:250`): the flee enters POSE with
 *     HORSE_REARING, and the rear clip ending is what starts the gallop (`:65-67`).
 *
 * ⚠️ `:33-35` is an empty `if` on `xml.mcs.prop.toString` — no call parens, so a
 * Function object compared to `""`, and the body is empty either way. Decompiled
 * dead code: not ported, recorded here and in DIVERGENCES.
 *
 * Numbers: `config/ogEnemyHorse.ts` + the shared `config/ogNpcAnimal.ts`.
 */
import { OG_ANIM, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_HORSE } from '../../config/ogEnemyHorse';
import { OG_ANIMAL } from '../../config/ogNpcAnimal';
import type { OgNpc } from '../../config/ogNpcs';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { asInt } from './MCSActor';
import { NO_DICE, Npc } from './Npc';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class EnemyHorse extends Npc {
  /** `EnemyHorse.as:5` */
  destX = ZERO;
  /** `EnemyHorse.as:7` */
  idleCounter = ZERO;
  /** `EnemyHorse.as:9` — the ONLY gate on this actor doing anything at all. */
  doChase = false;

  /** `EnemyHorse.as:12` */
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
    this.canGotLaunched = false;
    this.canGotKnockDown = false;
    this.canGotFly = false;
    this.canGotKneeGroin = false;
    this.canGotStun = false;
  }

  /** `EnemyHorse.as:31` — no grounding, no adventure chase flip. */
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
  }

  /** `EnemyHorse.as:47` — NO target re-acquire and NO `checkAITrigger()`. */
  override update(): void {
    if (this.disposed || this.animFrozen) return;
    const finishedAnimation = this.stepAnimation();
    if (finishedAnimation !== '') {
      switch (finishedAnimation) {
        case OG_ANIM.HORSE_DEATH:
          this.deathAnimEnd();
          break;
        case OG_ANIM.HORSE_GRAZING:
        case OG_ANIM.HORSE_PAWING:
          this.startAction(OG_STATE.IDLE);
          break;
        case OG_ANIM.HORSE_REARING:
          this.startAction(OG_STATE.RUN);
          break;
        default:
          break;
      }
    }
    this.doAction();
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
  }

  /** `EnemyHorse.as:76` — the duration lands after the branch, so all three clips share it. */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE: {
        const dice = asInt(this.rng() * OG_HORSE.idle.dice);
        if (dice === ZERO) this.startAnim(OG_ANIM.HORSE_IDLE);
        else if (dice === ONE) this.startAnim(OG_ANIM.HORSE_GRAZING);
        else if (dice === OG_HORSE.idle.pawOn) this.startAnim(OG_ANIM.HORSE_PAWING);
        this.idleCounter = OG_ANIMAL.idleFrames;
        break;
      }
      case OG_STATE.WALK:
        this.startAnim(OG_ANIM.HORSE_WALK);
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
        this.startAnim(OG_ANIM.HORSE_RUN);
        if (this.destX < this.posX) {
          this.walkSpeed = this.world.adventureMode ? -OG_ANIMAL.runSpeed : -OG_ANIMAL.runSpeedRoom;
          this.faceLeft();
        } else {
          this.walkSpeed = this.world.adventureMode ? OG_ANIMAL.runSpeed : OG_ANIMAL.runSpeedRoom;
          this.faceRight();
        }
        break;
      case OG_STATE.DYING:
        break;
      default:
        break;
    }
  }

  /** `EnemyHorse.as:143` — an un-chased horse re-enters IDLE forever (`:169-172`). */
  override doAction(): void {
    const target = this.target;
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) {
          this.idleCounter = OG_ANIMAL.idleRetryFrames;
          if (!this.world.cutsceneShowing && this.doChase) {
            const dice = asInt(this.rng() * OG_HORSE.idle.actDice);
            if (dice === ZERO) {
              this.startAction(OG_STATE.WALK);
            } else if (dice === OG_HORSE.idle.runOn) {
              this.destX = asInt(this.rng() * this.world.stageWidth);
              this.startAction(OG_STATE.RUN);
            }
          } else {
            this.startAction(OG_STATE.IDLE);
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
            this.startAnim(OG_ANIM.HORSE_IDLE);
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

  /** `EnemyHorse.as:230` — returns on the first line unless chasing; rears, then gallops. */
  private checkPlayer(target: NpcTarget): void {
    if (!this.doChase) return;
    const playerX = asInt(target.x);
    if (playerX < this.x && !this.isFacingRight()) {
      if (this.x - playerX < OG_ANIMAL.fleeDist) {
        this.destX = this.world.stageWidth + OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.POSE);
        this.startAnim(OG_ANIM.HORSE_REARING);
      }
    } else if (playerX > this.x && this.isFacingRight()) {
      if (playerX - this.x < OG_ANIMAL.fleeDist) {
        this.destX = -OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.POSE);
        this.startAnim(OG_ANIM.HORSE_REARING);
      }
    }
  }

  /** `EnemyHorse.as:257` — no death sound, no playback guard, no launch or downed branch. */
  override die(): void {
    this.createLoot();
    this.rewardXP();
    this.y = this.world.groundY;
    this.actionState = OG_STATE.DYING;
    this.startAnim(OG_ANIM.HORSE_DEATH);
    this.emitDeath(NO_DICE, false);
    this.dead = true;
    this.hideHealthBar();
  }
}
