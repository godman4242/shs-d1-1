/**
 * `EnemyBear.as` (279 lines), ported — ai 17, no children. Lane L4b, slice 3a.
 *
 * The only FIGHTER of slice 3a's four wanderers: it wanders on a d3 idle, and a
 * chasing bear that gets within 100 px of its target mid-gallop mauls with its
 * right hand, then sits on a five-second cooldown.
 *
 * FOUR things a porter copying the deer / horse / stag onto it would get wrong,
 * each pinned in `tests/npcSlice3a.test.ts`:
 *   - **`idleCounter` ticks at the TOP of `doAction`, in EVERY state** (`:163-166`),
 *     because the attack cooldown has to run down while the bear is GALLOPING.
 *     The other three tick it only inside IDLE, unguarded, and re-arm it at 24 on
 *     reaching `<= 0`; the bear's own `> 0` guard is what parks ITS counter at zero.
 *   - **ATTACK faces with its OWN comparison** (`:148-155`), not the base's
 *     `faceTarget()` (`NPC.as:1205`): the two disagree at exactly equal x —
 *     `faceTarget` faces RIGHT there, the bear faces LEFT.
 *   - **the swing has NO `isAdventureMode()` guard** (`:212-214`) where the wolf's
 *     bite (`EnemyWolf.as:294`) and pounce (`EnemyWolf.as:310`) each have one. A bear mauls in the overworld.
 *   - **`init` flips `doChase` on outside the overworld** (`:42-45`), so the
 *     constructor's argument only decides an OVERWORLD bear's behaviour.
 *
 * `int(random() * 3) == 1` walks (ONE in three, `:173`) where the wolf's twin
 * band is `< 2` (two in three). Numbers: `config/ogEnemyBear.ts` + the shared
 * `config/ogNpcAnimal.ts`.
 *
 * The source dereferences `target` with no null check (`:147`, `:197`, `:213`, `:238`); update()
 * guarantees it, and the port passes the narrowed target where the source reads it.
 */
import { OG_ANIM, OG_PART, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_BEAR } from '../../config/ogEnemyBear';
import { OG_ANIMAL } from '../../config/ogNpcAnimal';
import type { OgNpc } from '../../config/ogNpcs';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { asInt } from './MCSActor';
import { NO_DICE, Npc } from './Npc';
import { NpcDamage } from './NpcDamage';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class EnemyBear extends Npc {
  /** `EnemyBear.as:6` — where the current wander is heading. */
  destX = ZERO;
  /** `EnemyBear.as:8` — frames of idle left, AND the attack cooldown (`:200`). */
  idleCounter = ZERO;
  /** `EnemyBear.as:10` — set by the room dispatch, and by `init` outside the overworld. */
  doChase = false;

  /** `EnemyBear.as:12` — NO `startAction` here; `init` opens in IDLE (`:39`). */
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

  /** `EnemyBear.as:31` — the animal xp curve, IDLE, then chase outside the overworld. */
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
    if (!this.world.adventureMode) this.doChase = true;
    this.y = this.world.groundY;
  }

  /** `EnemyBear.as:49` — re-acquires a dead target and re-targets on the AI clock. */
  override update(): void {
    if (this.disposed || this.animFrozen) return;
    if (this.target === null || this.target.isDead()) {
      this.target = this.world.nearestEnemy(this.getMapPosition(), true);
      if (this.target === null) return;
    }
    const finishedAnimation = this.stepAnimation();
    if (finishedAnimation !== '') {
      switch (finishedAnimation) {
        case OG_ANIM.BEAR_DEATH:
          this.deathAnimEnd();
          break;
        case OG_ANIM.BEAR_FIDGET:
          this.startAction(OG_STATE.IDLE);
          break;
        case OG_ANIM.BEAR_ATTACK:
          this.destX = asInt(this.rng() * this.world.stageWidth);
          this.startAction(OG_STATE.RUN);
          break;
        default:
          break;
      }
    }
    this.doAction();
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
    if (this.checkAITrigger()) this.target = this.world.nearestEnemy(this.getMapPosition(), true);
  }

  /** `EnemyBear.as:90` — ONE idle roll, read twice: the clip (`:98`) and the duration (`:110`). */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE: {
        const dice = asInt(this.rng() * OG_BEAR.idle.dice);
        if (dice === ZERO) this.startAnim(OG_ANIM.BEAR_IDLE);
        else if (dice === ONE) this.startAnim(OG_ANIM.BEAR_SIT);
        else this.startAnim(OG_ANIM.BEAR_FIDGET);
        if (dice === ONE) this.idleCounter = OG_BEAR.idle.sitFrames;
        else this.idleCounter = OG_ANIMAL.idleFrames;
        break;
      }
      case OG_STATE.WALK:
        this.startAnim(OG_ANIM.BEAR_WALK);
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
        this.startAnim(OG_ANIM.BEAR_RUN);
        if (this.destX < this.posX) {
          this.walkSpeed = -OG_ANIMAL.runSpeed;
          this.faceLeft();
        } else {
          this.walkSpeed = OG_ANIMAL.runSpeed;
          this.faceRight();
        }
        break;
      case OG_STATE.ATTACK:
        // `:148-155` — its OWN comparison, not `faceTarget()`: at equal x this
        // faces LEFT where the base's faces RIGHT.
        if (this.target !== null && this.x < this.target.x) this.faceRight();
        else this.faceLeft();
        this.startAnim(OG_ANIM.BEAR_ATTACK);
        break;
      case OG_STATE.DYING:
        break;
      default:
        break;
    }
  }

  /** `EnemyBear.as:161` — the counter ticks HERE, before the switch, in every state. */
  override doAction(): void {
    if (this.idleCounter > ZERO) this.idleCounter -= ONE;
    const target = this.target;
    switch (this.actionState) {
      case OG_STATE.IDLE:
        if (this.idleCounter <= ZERO) {
          this.idleCounter = OG_ANIMAL.idleRetryFrames;
          if (!this.world.cutsceneShowing && asInt(this.rng() * OG_BEAR.idle.walkDice) === OG_BEAR.idle.walkOn) {
            this.startAction(OG_STATE.WALK);
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
        if (this.idleCounter <= ZERO && target !== null && Math.abs(this.x - target.x) < OG_BEAR.attack.rangeX) {
          this.startAction(OG_STATE.ATTACK);
          this.idleCounter = OG_BEAR.attack.cooldownFrames;
        } else if (Math.abs(this.destX - this.posX) < OG_ANIMAL.arriveX) {
          this.startAction(OG_STATE.WALK);
          if (
            this.world.adventureMode &&
            (this.posX <= -OG_ANIMAL.offStage.margin || this.posX > this.world.stageWidth + OG_ANIMAL.offStage.margin)
          ) {
            this.startAction(OG_STATE.REDFREEZE);
            this.startAnim(OG_ANIM.BEAR_IDLE);
          }
        }
        break;
      case OG_STATE.ATTACK:
        // `:212-214` — no `isAdventureMode()` fence; the wolf's bite has one.
        if (target !== null) {
          target.checkHitObject({ kind: 'part', part: OG_PART.r_hand, owner: this }, new NpcDamage(this.damage, this.level));
        }
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
   * `EnemyBear.as:236` — only reacts to a player it is FACING. A non-chasing bear
   * bolts the other way at 200 px; a chasing one charges AT the player from 400.
   */
  private checkPlayer(target: NpcTarget): void {
    const playerX = asInt(target.x);
    if (playerX < this.x && !this.isFacingRight()) {
      if (!this.doChase && this.x - playerX < OG_ANIMAL.fleeDist) {
        this.destX = this.world.stageWidth + OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.RUN);
      } else if (this.doChase && this.x - playerX < OG_BEAR.chaseDist) {
        this.destX = -OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.RUN);
      }
    } else if (playerX > this.x && this.isFacingRight()) {
      if (!this.doChase && playerX - this.x < OG_ANIMAL.fleeDist) {
        this.destX = -OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.RUN);
      } else if (this.doChase && playerX - this.x < OG_BEAR.chaseDist) {
        this.destX = this.world.stageWidth + OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.RUN);
      }
    }
  }

  /** `EnemyBear.as:267` — no death SOUND, no playback guard, no launch or downed branch. */
  override die(): void {
    this.createLoot();
    this.rewardXP();
    this.y = this.world.groundY;
    this.actionState = OG_STATE.DYING;
    this.startAnim(OG_ANIM.BEAR_DEATH);
    this.emitDeath(NO_DICE, false);
    this.dead = true;
    this.hideHealthBar();
  }
}
