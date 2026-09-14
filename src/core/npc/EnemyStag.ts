/**
 * `EnemyStag.as` (339 lines), ported — ai 21, no children. Lane L4b, slice 3a.
 *
 * The horse's rig (`MCSHorse`, `HORSE_*` clips) with a gore attack bolted on: a
 * CHASING stag rears at a player inside 400 px (ATTACK), and the rear clip ending
 * turns into CHARGING (`:98-108`) — a 15 px-per-frame gallop that hits with
 * `PART_head` at `LAUNCH_KNOCKDOWN` on EVERY frame until it reaches `destX`.
 *
 * ⚠️ **THE CONSTRUCTOR TAKES `doChase` AND NEVER ASSIGNS IT** (`:12-28`). The bear
 * (`EnemyBear.as:23`) and the horse (`EnemyHorse.as:23`) both do `this.doChase = doChase`;
 * the stag's line is simply absent, and `doChase` is declared with no initialiser
 * (`EnemyStag.as:10`). So a stag's chase flag can ONLY be set by `init()`'s
 * `!isAdventureMode()` branch (`:41-44`) — the dispatch's argument is dropped on the floor. Ported as it
 * reads (`_doChase`), pinned in `tests/npcSlice3a.test.ts`, recorded in DIVERGENCES.
 *
 * ⚠️ **`setLevel` (`:48-70`) is a hand copy of `NPC.as:239-260`** that differs in
 * NOTHING but decompiler artifacts — a split `var factor:Number = NaN;`
 * declaration and `this.` prefixes on fields. Written out because the tree gate
 * demands the source's override set, exactly like `EnemyCivilianOld.update()`.
 * Note what it does to reward: `init` sets the ANIMAL xp curve (`:37`, ×5 + 45)
 * and `setLevel` overwrites it with the BASE curve (`:62`, ×2 + 20), so a levelled
 * stag pays LESS than an unlevelled one — exactly as the inherited base `setLevel`
 * (`NPC.as:252`) does to the bear, deer and horse. The stag is not special.
 *
 * Two more differences from the horse, both pinned:
 *   - **its idle act-roll is NOT fenced by `doChase`** (`:213`) where the horse's
 *     is (`EnemyHorse.as:153`), and it has no `else` re-entering IDLE — an un-chased stag
 *     still wanders, an un-chased horse does not.
 *   - **its off-stage red-freeze carries an extra `!this.doChase` guard** (`:256`);
 *     the bear, deer and horse red-freeze off-stage whatever their chase flag.
 *
 * Numbers: `config/ogEnemyStag.ts` (its `idle` IS the horse's, imported) + the
 * shared `config/ogNpcAnimal.ts`; `setLevel` reuses the base's own constants.
 */
import { OG_ANIM, OG_LAUNCH, OG_PART, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_STAG } from '../../config/ogEnemyStag';
import { OG_ANIMAL } from '../../config/ogNpcAnimal';
import { OG_NPC_SET_LEVEL, OG_NPC_XP } from '../../config/ogNpcBase';
import type { OgNpc } from '../../config/ogNpcs';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { asInt } from './MCSActor';
import { NO_DICE, Npc } from './Npc';
import { NpcDamage } from './NpcDamage';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class EnemyStag extends Npc {
  /** `EnemyStag.as:6` */
  destX = ZERO;
  /** `EnemyStag.as:8` */
  idleCounter = ZERO;
  /** `EnemyStag.as:10` — no initialiser in the source, and the constructor never writes it. */
  doChase = false;

  /**
   * `EnemyStag.as:12` — `_doChase` is the source's second argument, which the
   * source ACCEPTS AND DISCARDS. Kept in the signature so a caller can still pass it —
   * the tests do, to pin that it is discarded, and a chaos plant anchors on the `void`
   * below; never assigned, because the source never assigns it. (No dispatch passes it:
   * `NPCManager.as:582` builds `new EnemyStag()` with no arguments.)
   */
  constructor(
    world: NpcWorld,
    anims: AnimLibrary,
    geometry: HitGeometry,
    rng: Rng,
    target: NpcTarget | null = null,
    _doChase = false,
  ) {
    super(world, anims, geometry, rng, target);
    // The source accepts this argument and never assigns it (`:12-28`). Discarded
    // here the way `MCSActor.setPose` discards `animName` — deliberately, not by
    // omission. Assigning it is a chaos plant that turns `tests/npcSlice3a.test.ts`
    // red ("THE CONSTRUCTOR DISCARDS doChase").
    void _doChase;
    this.canGotLaunched = false;
    this.canGotKnockDown = false;
    this.canGotFly = false;
    this.canGotKneeGroin = false;
    this.canGotStun = false;
  }

  /** `EnemyStag.as:30` — the ONLY place `doChase` is ever set true. */
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

  /**
   * `EnemyStag.as:48` — a hand copy of `NPC.as:239`, behaviourally identical to it.
   * Written out because the source has the override; it changes nothing.
   */
  override setLevel(lvl: number): void {
    let factor = lvl / this.level;
    if (lvl <= OG_NPC_SET_LEVEL.softCapLevel) factor *= OG_NPC_SET_LEVEL.softCapFactor;
    this.level = lvl;
    this.damage = asInt(this.damage * factor);
    this.defense = asInt(this.defense * factor);
    this.maxhp = asInt(this.maxhp * factor);
    this.setHP(this.maxhp);
    this.updateHealthBar();
    this.xp = lvl * OG_NPC_XP.perLevel + OG_NPC_XP.base;
    if (lvl <= OG_NPC_SET_LEVEL.trivialLevel) {
      this.damage = OG_NPC_SET_LEVEL.trivialStat;
      this.defense = OG_NPC_SET_LEVEL.trivialStat;
      this.maxhp = OG_NPC_SET_LEVEL.trivialStat;
      this.setHP(this.maxhp);
    }
  }

  /** `EnemyStag.as:72` — the rear clip ends into CHARGING from ATTACK, into RUN otherwise. */
  override update(): void {
    if (this.disposed || this.animFrozen) return;
    if (this.target === null || this.target.isDead()) {
      this.target = this.world.nearestEnemy(this.getMapPosition(), true);
      if (this.target === null) return;
    }
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
          if (this.actionState === OG_STATE.ATTACK) this.startAction(OG_STATE.CHARGING);
          else this.startAction(OG_STATE.RUN);
          break;
        default:
          break;
      }
    }
    this.doAction();
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
    if (this.checkAITrigger()) this.target = this.world.nearestEnemy(this.getMapPosition(), true);
  }

  /** `EnemyStag.as:120` — the horse's four states plus ATTACK (rear) and CHARGING (gore). */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE: {
        const dice = asInt(this.rng() * OG_STAG.idle.dice);
        if (dice === ZERO) this.startAnim(OG_ANIM.HORSE_IDLE);
        else if (dice === ONE) this.startAnim(OG_ANIM.HORSE_GRAZING);
        else if (dice === OG_STAG.idle.pawOn) this.startAnim(OG_ANIM.HORSE_PAWING);
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
      case OG_STATE.ATTACK:
        this.startAnim(OG_ANIM.HORSE_REARING);
        break;
      case OG_STATE.CHARGING:
        this.startAnim(OG_ANIM.STAG_CHARGE);
        if (this.destX < this.posX) {
          this.walkSpeed = -OG_STAG.chargeSpeed;
          this.faceLeft();
        } else {
          this.walkSpeed = OG_STAG.chargeSpeed;
          this.faceRight();
        }
        break;
      case OG_STATE.DYING:
        break;
      default:
        break;
    }
  }

  /** `EnemyStag.as:203` — the act-roll has NO `doChase` fence and no `else`. */
  override doAction(): void {
    const target = this.target;
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) {
          this.idleCounter = OG_ANIMAL.idleRetryFrames;
          if (!this.world.cutsceneShowing) {
            const dice = asInt(this.rng() * OG_STAG.idle.actDice);
            if (dice === ZERO) {
              this.startAction(OG_STATE.WALK);
            } else if (dice === OG_STAG.idle.runOn) {
              this.destX = asInt(this.rng() * this.world.stageWidth);
              this.startAction(OG_STATE.RUN);
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
            !this.doChase &&
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
      case OG_STATE.CHARGING:
        this.movePositionX(this.walkSpeed);
        if (target !== null) {
          target.checkHitObject(
            { kind: 'part', part: OG_PART.head, owner: this },
            new NpcDamage(this.damage, this.level, OG_LAUNCH.LAUNCH_KNOCKDOWN),
          );
        }
        if (Math.abs(this.destX - this.posX) < OG_ANIMAL.arriveX) this.startAction(OG_STATE.WALK);
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

  /** `EnemyStag.as:294` — flee at 200 px when not chasing, REAR TO GORE at 400 when chasing. */
  private checkPlayer(target: NpcTarget): void {
    const playerX = asInt(target.x);
    if (playerX < this.x && !this.isFacingRight()) {
      if (!this.doChase && this.x - playerX < OG_ANIMAL.fleeDist) {
        this.destX = this.world.stageWidth + OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.POSE);
        this.startAnim(OG_ANIM.HORSE_REARING);
      } else if (this.doChase && this.x - playerX < OG_STAG.chaseDist) {
        this.destX = -OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.ATTACK);
      }
    } else if (playerX > this.x && this.isFacingRight()) {
      if (!this.doChase && playerX - this.x < OG_ANIMAL.fleeDist) {
        this.destX = -OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.POSE);
        this.startAnim(OG_ANIM.HORSE_REARING);
      } else if (this.doChase && playerX - this.x < OG_STAG.chaseDist) {
        this.destX = this.world.stageWidth + OG_ANIMAL.offStage.dest;
        this.startAction(OG_STATE.ATTACK);
      }
    }
  }

  /** `EnemyStag.as:327` — no death sound, no playback guard, no launch or downed branch. */
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
