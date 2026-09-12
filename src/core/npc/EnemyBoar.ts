/**
 * `EnemyBoar.as` (364 lines), ported — ai 18, no children. Lane L4b, slice 3b.
 *
 * The FIRST actor in the lane to override the REACTION side. Its three reaction
 * overrides collapse to one body: `gotKnockDown()` (`:353-356`) and
 * `gotFly(flyVelX, flyVelY)` (`:358-361`) are ONE LINE each and both call its OWN
 * `gotLaunched()` — the fly velocities are accepted and thrown away. A boar cannot
 * be knocked down and cannot be thrown; everything becomes a launch.
 *
 * ⚠️ **`canGotFly = true`** (`:28`) — which RESTATES the base default. All five
 * `canGot*` flags are declared `true` on `NPC.as:70-78`; the divergent classes are
 * the ones that write `false`, and the wolf (`EnemyWolf.as:19`) and all four slice-3a
 * wanderers do. The boar simply never opts out, so `NPC.gotHit`'s fly branch reaches
 * `gotFly()` here and becomes a launch.
 *
 * ⚠️ **Its `gotLaunched` (`:293`) is NOT the base's** (`NPC.as:536`), and the
 * difference is an inversion, not a delta:
 *   - the base guards `!canGotLaunched || (isDowned() && !actionState == FLY_STATE)
 *     || DYING`. `!actionState == FLY_STATE` is the AS3 precedence bug — `!actionState`
 *     is a Boolean, so `== 32` is ALWAYS FALSE — which kills the whole downed clause.
 *     The base therefore has NO working downed guard (ported as it BEHAVES, slice 0).
 *   - the boar guards `actionState == DOWNED_STATE || actionState == DYING_STATE`:
 *     a REAL downed guard, and NO `canGotLaunched` check at all.
 *   - the base's airborne set includes `FLY_STATE`; the boar's does not.
 *
 * ⚠️ **Its `doLaunched` lands into WALK** (`:340`), where the wolf's and the alpha's
 * land into DOWNED. A boar is never on the floor: it bounces up and keeps going.
 *
 * ⚠️ **RUN hits on EVERY frame, unconditionally** (`:195-201`) — no range test and
 * no `isAdventureMode()` fence, unlike every other animal. Entering RUN rolls
 * `knocker` once (`:141`), and that one roll decides whether the whole charge
 * carries `LAUNCH_KNOCKDOWN`.
 *
 * ⚠️ **A source bug, ported as it reads:** the off-stage red-freeze plays
 * `DEER_IDLE` (`:219`) — a DEER clip on a boar. Recorded in DIVERGENCES.
 *
 * Numbers: `config/ogEnemyBoar.ts` + `ogNpcAnimal.ts`; the launch arc is the base's
 * (`OG_NPC_LAUNCH`), because only the guards differ, never the physics.
 */
import { OG_ANIM, OG_LAUNCH, OG_PART, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_BOAR } from '../../config/ogEnemyBoar';
import { OG_ANIMAL } from '../../config/ogNpcAnimal';
import { OG_NPC_LAUNCH } from '../../config/ogNpcBase';
import type { OgNpc } from '../../config/ogNpcs';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { asInt } from './MCSActor';
import { NO_DICE, Npc } from './Npc';
import { NpcDamage } from './NpcDamage';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class EnemyBoar extends Npc {
  /** `EnemyBoar.as:5` */
  destX = ZERO;
  /** `EnemyBoar.as:7` */
  idleCounter = ZERO;
  /** `EnemyBoar.as:9` */
  doChase = false;
  /** `EnemyBoar.as:11` — rolled ONCE on entering RUN; re-read every frame of the charge. */
  knocker = false;

  /** `EnemyBoar.as:13` — no `startAction` here; `init` opens in IDLE. */
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
    this.canGotLaunched = true;
    this.canGotKnockDown = true;
    this.canGotFly = true;
    this.canGotKneeGroin = false;
    this.canGotStun = false;
  }

  /** `EnemyBoar.as:33` — the bear's `init`, verbatim in shape. */
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

  /** `EnemyBoar.as:51` */
  override update(): void {
    if (this.disposed || this.animFrozen) return;
    if (this.target === null || this.target.isDead()) {
      this.target = this.world.nearestEnemy(this.getMapPosition(), true);
      if (this.target === null) return;
    }
    const finishedAnimation = this.stepAnimation();
    if (finishedAnimation !== '') {
      switch (finishedAnimation) {
        case OG_ANIM.BOAR_DEATH:
          this.deathAnimEnd();
          break;
        case OG_ANIM.BOAR_FIDGET:
        case OG_ANIM.BOAR_GRAZING:
          this.startAction(OG_STATE.IDLE);
          break;
        case OG_ANIM.BOAR_ATTACK:
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

  /** `EnemyBoar.as:93` — the duration lands after the branch; RUN arms `knocker`. */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE: {
        const dice = asInt(this.rng() * OG_BOAR.idle.dice);
        if (dice === ZERO) this.startAnim(OG_ANIM.BOAR_IDLE);
        else if (dice === OG_BOAR.idle.fidgetOn) this.startAnim(OG_ANIM.BOAR_FIDGET);
        else if (dice === OG_BOAR.idle.grazeOn) this.startAnim(OG_ANIM.BOAR_GRAZING);
        this.idleCounter = OG_ANIMAL.idleFrames;
        break;
      }
      case OG_STATE.WALK:
        this.startAnim(OG_ANIM.BOAR_WALK);
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
        this.startAnim(OG_ANIM.BOAR_RUN);
        if (this.destX < this.posX) {
          this.walkSpeed = -OG_BOAR.runSpeed;
          this.faceLeft();
        } else {
          this.walkSpeed = OG_BOAR.runSpeed;
          this.faceRight();
        }
        // `:141` — ONE roll, at the start of the charge, for the whole charge.
        this.knocker = asInt(this.rng() * OG_BOAR.knockerDice) === ZERO;
        break;
      case OG_STATE.ATTACK:
        // `:144-151` — its own comparison, like the bear's: at equal x this faces LEFT.
        if (this.target !== null && this.x < this.target.x) this.faceRight();
        else this.faceLeft();
        this.startAnim(OG_ANIM.BOAR_ATTACK);
        break;
      case OG_STATE.DYING:
        break;
      case OG_STATE.GOTLAUNCHED:
        this.startAnim(OG_ANIM.BOAR_ROLLING);
        break;
      default:
        break;
    }
  }

  /** `EnemyBoar.as:161` — the counter ticks inside IDLE only; RUN hits every frame. */
  override doAction(): void {
    const target = this.target;
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) {
          this.idleCounter = OG_ANIMAL.idleRetryFrames;
          if (!this.world.cutsceneShowing && asInt(this.rng() * OG_BOAR.idle.walkDice) === OG_BOAR.idle.walkOn) {
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
        // `:195-201` — EVERY frame, no range test and no overworld fence.
        if (target !== null) {
          target.checkHitObject(
            { kind: 'part', part: OG_PART.head, owner: this },
            this.knocker
              ? new NpcDamage(this.damage, this.level, OG_LAUNCH.LAUNCH_KNOCKDOWN)
              : new NpcDamage(this.damage, this.level),
          );
        }
        if (
          (this.doChase || !this.world.adventureMode) &&
          target !== null &&
          Math.abs(this.x - target.x) < OG_BOAR.attackRangeX
        ) {
          this.startAction(OG_STATE.ATTACK);
        } else if (Math.abs(this.destX - this.posX) < OG_ANIMAL.arriveX) {
          // `:208` — the coin is rolled ONLY in the overworld; in a room it always walks.
          if (this.world.adventureMode && asInt(this.rng() * OG_ANIMAL.arriveDice) === ZERO) {
            this.startAction(OG_STATE.IDLE);
          } else {
            this.startAction(OG_STATE.WALK);
          }
          if (
            this.world.adventureMode &&
            (this.posX <= -OG_ANIMAL.offStage.margin || this.posX > this.world.stageWidth + OG_ANIMAL.offStage.margin)
          ) {
            this.startAction(OG_STATE.REDFREEZE);
            // `:219` — a DEER clip on a boar. The source's; see DIVERGENCES.
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

  /** `EnemyBoar.as:245` — the bear's flee/charge bands, verbatim. */
  private checkPlayer(target: NpcTarget): void {
    const playerX = asInt(target.x);
    if (playerX < this.x && !this.isFacingRight()) {
      if (!this.doChase && this.x - playerX < OG_ANIMAL.fleeDist) {
        this.destX = this.world.stageWidth + OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.RUN);
      } else if (this.doChase && this.x - playerX < OG_BOAR.chaseDist) {
        this.destX = -OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.RUN);
      }
    } else if (playerX > this.x && this.isFacingRight()) {
      if (!this.doChase && playerX - this.x < OG_ANIMAL.fleeDist) {
        this.destX = -OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.RUN);
      } else if (this.doChase && playerX - this.x < OG_BOAR.chaseDist) {
        this.destX = this.world.stageWidth + OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.RUN);
      }
    }
  }

  /** `EnemyBoar.as:277` — the wolf's GOTLAUNCHED bail, then the animals' plain death. */
  override die(): void {
    if (this.actionState === OG_STATE.GOTLAUNCHED) {
      this.dead = true;
      return;
    }
    this.createLoot();
    this.rewardXP();
    this.y = this.world.groundY;
    this.actionState = OG_STATE.DYING;
    this.startAnim(OG_ANIM.BOAR_DEATH);
    this.emitDeath(NO_DICE, false);
    this.dead = true;
    this.hideHealthBar();
  }

  /**
   * `EnemyBoar.as:293` — a REAL downed guard where the base's is dead code, and NO
   * `canGotLaunched` check. The physics below are the base's, number for number.
   */
  override gotLaunched(): void {
    if (this.actionState === OG_STATE.DOWNED || this.actionState === OG_STATE.DYING) return;
    const s = this.actionState;
    if (s === OG_STATE.GOTLAUNCHED || s === OG_STATE.FALL || s === OG_STATE.JUMP) {
      this.velY = OG_NPC_LAUNCH.velYAirborne;
      if (this.isFacingRight()) this.faceLeft();
      else this.faceRight();
      this.startAction(OG_STATE.GOTLAUNCHED);
    } else {
      this.startAction(OG_STATE.GOTLAUNCHED);
      this.velY = OG_NPC_LAUNCH.velYGround;
    }
    this.velX = this.isFacingRight() ? -OG_NPC_LAUNCH.velXAbs : OG_NPC_LAUNCH.velXAbs;
  }

  /** `EnemyBoar.as:327` — lands into WALK (or dies), never into DOWNED. */
  override doLaunched(): void {
    this.y += this.velY;
    this.movePositionX(this.velX);
    this.velY += OG_NPC_LAUNCH.gravity;
    const groundY = this.world.groundY;
    if (this.y >= groundY) {
      this.y = groundY;
      if (this.dead) {
        this.actionState = OG_STATE.DYING;
        this.die();
      } else {
        this.startAction(OG_STATE.WALK);
      }
    } else if (
      (this.velX < ZERO && this.getMapPosition() < OG_NPC_LAUNCH.edgeMargin) ||
      (this.velX > ZERO && this.getMapPosition() > this.world.stageWidth - OG_NPC_LAUNCH.edgeMargin)
    ) {
      // Its OWN gotLaunched, not the base's.
      this.gotLaunched();
      this.velX = asInt(this.velX * OG_NPC_LAUNCH.edgeBounceMult);
    }
  }

  /** `EnemyBoar.as:353` — one line: a knock-down IS a launch. */
  override gotKnockDown(): void {
    this.gotLaunched();
  }

  /** `EnemyBoar.as:358` — one line: a fly IS a launch, and both velocities are discarded. */
  override gotFly(_flyVelX: number, _flyVelY: number): void {
    void _flyVelX;
    void _flyVelY;
    this.gotLaunched();
  }
}
