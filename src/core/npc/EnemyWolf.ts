/**
 * `EnemyWolf.as` (489 lines), ported — ai 8, and the parent of `EnemyWolf2` and
 * `EnemyFox`. Lane L4b, slice 2a.
 *
 * A four-legged wanderer: pick a random x, walk (or run) there, bite inside 100 px,
 * pounce from 100–250. The FIRST actor to override the RECEPTION side — `gotHit`,
 * `doLaunched`, `die`, `redFreeze` — and each of those is its OWN body, not a
 * delta over `Npc`'s: the weapon part doubles damage instead of deflecting, elements
 * are never defended, the launch arc has no peak clip and no landing guard, death
 * pays loot and XP even in playback, and CHARGING keeps moving under a red freeze.
 *
 * The display class is `MCSWolf` (`:15`); the paperdoll stays the roster's and the
 * clips are `OG_ANIM.WOLF_*`. `mcs.changeScale(1.2, 1.2)` (`:27`) is `setScale`:
 * the port keeps facing and scale apart, so the sign the source preserves is moot.
 *
 * ⚠️ DEAD CODE DROPPED (DIVERGENCES, L4b slice 2): the finished-clip switch lists
 * `WOLF_LAUNCHEDEND` twice (`:67`, `:114`) and `WOLF_DOWNEDTOIDLE` twice in one case
 * group (`:91`, `:94`); the first match wins, the repeats are unreachable.
 *
 * Numbers: `config/ogEnemyWolf.ts`; the floating-text and i-frame twins are the
 * base's (`config/ogNpcBase.ts`), named in that file's header.
 */
import { OG_ANIM, OG_PART, OG_STATE, type OgPart, type OgState } from '../../config/ogActor';
import { OG_WOLF } from '../../config/ogEnemyWolf';
import { OG_NPC_FLOATING_TEXT, OG_NPC_HIT_IFRAMES } from '../../config/ogNpcBase';
import type { OgNpc } from '../../config/ogNpcs';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { asInt } from './MCSActor';
import { NO_DICE, Npc } from './Npc';
import { NpcDamage } from './NpcDamage';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class EnemyWolf extends Npc {
  /** `EnemyWolf.as:8` — where the current wander is heading. */
  destX = ZERO;
  /** `EnemyWolf.as:10` — frames left in IDLE, or on the floor. */
  idleCounter = ZERO;

  /** `EnemyWolf.as:12` */
  constructor(world: NpcWorld, anims: AnimLibrary, geometry: HitGeometry, rng: Rng, target: NpcTarget | null = null) {
    super(world, anims, geometry, rng, target);
    this.startAction(OG_STATE.IDLE);
    this.canGotLaunched = true;
    this.canGotKnockDown = true;
    this.canGotFly = false;
    this.canGotKneeGroin = false;
    this.canGotStun = false;
  }

  /** `EnemyWolf.as:24` — the base's `init` at 1.2 scale, its own xp curve, no elements. */
  override init(xml: OgNpc): void {
    this.initMCSFromXML(xml.mcs);
    this.setScale(OG_WOLF.scale);
    this.damage = xml.attack ?? ZERO;
    this.defense = xml.defense ?? ZERO;
    this.maxhp = xml.hp ?? ZERO;
    this.level = xml.lvl ?? ZERO;
    this.xp = this.level * OG_WOLF.xp.perLevel + OG_WOLF.xp.base;
    this.reset();
    if (this.y === this.world.groundY) this.startAction(OG_STATE.WALK);
    else this.startAction(OG_STATE.FALL);
    this.reward = xml.loot ?? [];
  }

  /** `EnemyWolf.as:45` */
  override update(): void {
    if (this.disposed || this.animFrozen) return;
    if (this.target === null || this.target.isDead()) {
      this.target = this.world.nearestEnemy(this.getMapPosition(), true);
      if (this.target === null) return;
    }
    const finishedAnimation = this.stepAnimation();
    if (finishedAnimation !== '') {
      switch (finishedAnimation) {
        case OG_ANIM.WOLF_DEATH:
          this.deathAnimEnd();
          break;
        case OG_ANIM.WOLF_LAUNCHEDEND:
          if (this.dead) {
            this.deathAnimEnd();
          } else {
            if (this.getHP() > ZERO) this.showHealthBar();
            this.startAnim(OG_ANIM.WOLF_DOWNED);
          }
          break;
        case OG_ANIM.WOLF_POUNCE_END:
          if (this.getHP() <= ZERO) this.die();
          else this.startAction(OG_STATE.WALK);
          break;
        case OG_ANIM.WOLF_DOWNEDTOIDLE:
        case OG_ANIM.WOLF_BITE:
        case OG_ANIM.WOLF_HOWL:
          this.startAction(OG_STATE.WALK);
          break;
        case OG_ANIM.WOLF_POUNCE_START:
          if (asInt(this.rng() * OG_WOLF.pounceHighDice) === ZERO) this.startAnim(OG_ANIM.WOLF_POUNCE_MIDHIGH);
          else this.startAnim(OG_ANIM.WOLF_POUNCE_MID);
          break;
        case OG_ANIM.WOLF_POUNCE_MID:
        case OG_ANIM.WOLF_POUNCE_MIDHIGH:
          if (this.actionState !== OG_STATE.FALL) this.startAnim(OG_ANIM.WOLF_POUNCE_END);
          break;
        default:
          break;
      }
    }
    this.doAction();
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
    if (this.checkAITrigger()) this.target = this.world.nearestEnemy(this.getMapPosition(), true);
  }

  /** `EnemyWolf.as:129` */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE:
        this.faceTarget();
        this.startAnim(OG_ANIM.WOLF_SNARL);
        this.idleCounter = OG_WOLF.idle.snarlFrames;
        break;
      case OG_STATE.WALK:
        this.destX = asInt(this.rng() * this.world.stageWidth);
        this.faceTarget();
        if (this.destX < this.posX) this.walkSpeed = asInt(-this.rng() * OG_WOLF.walk.range - OG_WOLF.walk.base);
        else this.walkSpeed = asInt(this.rng() * OG_WOLF.walk.range + OG_WOLF.walk.base);
        if (this.target !== null && (this.target.x - this.x) * this.walkSpeed < ZERO) {
          this.startAnim(OG_ANIM.WOLF_WALKBACKWARDS);
          this.walkSpeed = asInt(this.walkSpeed / OG_WOLF.walkBackwardsDiv);
        } else {
          this.startAnim(OG_ANIM.WOLF_WALK);
        }
        break;
      case OG_STATE.RUN:
        this.startAnim(OG_ANIM.WOLF_RUN);
        if (this.destX < this.posX) {
          this.walkSpeed = this.world.adventureMode ? -OG_WOLF.run.adventure : -OG_WOLF.run.room;
          this.faceLeft();
        } else {
          this.walkSpeed = this.world.adventureMode ? OG_WOLF.run.adventure : OG_WOLF.run.room;
          this.faceRight();
        }
        break;
      case OG_STATE.ATTACK:
        this.faceTarget();
        this.startAnim(OG_ANIM.WOLF_BITE);
        break;
      case OG_STATE.CHARGING:
        this.faceTarget();
        this.startAnim(OG_ANIM.WOLF_POUNCE_START);
        break;
      case OG_STATE.GOTLAUNCHED:
        this.startAnim(OG_ANIM.WOLF_LAUNCHED);
        break;
      case OG_STATE.KNOCKDOWNED:
        this.actionState = OG_STATE.DOWNED;
        this.startAnim(OG_ANIM.WOLF_LAUNCHEDEND);
        this.idleCounter = OG_WOLF.downed.knockdownFrames;
        break;
      case OG_STATE.DOWNED:
        this.startAnim(OG_ANIM.WOLF_LAUNCHEDEND);
        this.idleCounter = OG_WOLF.downed.launchedFrames;
        break;
      case OG_STATE.FALL:
        this.startAnim(OG_ANIM.WOLF_POUNCE_MIDHIGH);
        break;
      case OG_STATE.LAND:
        this.startAnim(OG_ANIM.WOLF_POUNCE_END);
        break;
      case OG_STATE.DYING:
        break;
      default:
        break;
    }
  }

  /** `EnemyWolf.as:237-262` (and again, verbatim, `:266-291`) — the arrival roll, then the bite / pounce bands. */
  private arriveAndHunt(target: NpcTarget): void {
    if (Math.abs(this.destX - this.posX) < OG_WOLF.arriveX) {
      const dice = asInt(this.rng() * OG_WOLF.arriveDice);
      if (dice === ZERO) {
        this.startAction(OG_STATE.IDLE);
      } else if (dice === ONE) {
        this.startAction(OG_STATE.WALK);
      } else {
        this.destX = asInt(this.rng() * this.world.stageWidth);
        this.startAction(OG_STATE.RUN);
      }
    }
    const dist = asInt(Math.abs(this.x - target.x));
    if (dist < OG_WOLF.bite.maxX && dist > OG_WOLF.bite.minX) {
      this.startAction(OG_STATE.ATTACK);
    } else if (
      dist >= OG_WOLF.pounce.minX &&
      dist < OG_WOLF.pounce.maxX &&
      asInt(this.rng() * OG_WOLF.pounce.dice) === ZERO
    ) {
      this.startAction(OG_STATE.CHARGING);
    }
  }

  /** `EnemyWolf.as:217` */
  override doAction(): void {
    const target = this.target;
    if (target === null) return;
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) {
          this.idleCounter = OG_WOLF.idle.retryFrames;
          this.faceTarget();
          if (asInt(this.rng() * OG_WOLF.idle.walkDice) < OG_WOLF.idle.walkBelow) this.startAction(OG_STATE.WALK);
        }
        break;
      case OG_STATE.WALK:
        this.movePositionX(this.walkSpeed);
        this.arriveAndHunt(target);
        break;
      case OG_STATE.RUN:
        this.movePositionX(this.walkSpeed);
        this.arriveAndHunt(target);
        break;
      case OG_STATE.ATTACK:
        if (!this.world.adventureMode) {
          target.checkHitObject({ kind: 'part', part: OG_PART.weapon, owner: this }, new NpcDamage(this.damage, this.level));
        }
        break;
      case OG_STATE.CHARGING:
        if (this.animation === OG_ANIM.WOLF_POUNCE_MID || this.animation === OG_ANIM.WOLF_POUNCE_MIDHIGH) {
          if (this.isFacingRight()) this.movePositionX(OG_WOLF.pounceStep);
          else this.movePositionX(-OG_WOLF.pounceStep);
          if (!this.world.adventureMode) {
            target.checkHitObject({ kind: 'part', part: OG_PART.head, owner: this }, new NpcDamage(this.damage, this.level));
            target.checkHitObject({ kind: 'part', part: OG_PART.r_hand, owner: this }, new NpcDamage(this.damage, this.level));
          }
        }
        break;
      case OG_STATE.GOTLAUNCHED:
        this.doLaunched();
        break;
      case OG_STATE.DOWNED:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) this.startAnim(OG_ANIM.WOLF_DOWNEDTOIDLE);
        break;
      case OG_STATE.FALL:
        this.y += this.velY;
        this.velY += OG_WOLF.fallGravity;
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
   * `EnemyWolf.as:343` — its own reception, not the base's: elements are clamped at
   * zero and never defended; head, neck AND WEAPON double and behead; defence and the
   * floor apply before the alive check; only launch and knock-down react; `behead`
   * and `stunCounter` are left alone; no death-touch.
   */
  override gotHit(target: OgPart, damageObj: NpcDamage): boolean {
    if (this.gotHitCounter > ZERO) return false;
    let damage = damageObj.damage;
    const fireDamage = Math.max(damageObj.fireDamage, ZERO);
    const waterDamage = Math.max(damageObj.waterDamage, ZERO);
    const windDamage = Math.max(damageObj.windDamage, ZERO);
    const earthDamage = Math.max(damageObj.earthDamage, ZERO);
    switch (target) {
      case OG_PART.head:
      case OG_PART.neck:
      case OG_PART.weapon:
        damage *= OG_WOLF.partMult;
        this.behead = true;
        this.gotHitFlag = true;
        break;
      default:
        this.gotHitFlag = true;
    }
    damage -= this.defense;
    if (damage < damageObj.getMinDamage()) damage = damageObj.getMinDamage();
    if (this.getHP() > ZERO) {
      this.setHP(this.getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
      this.updateHealthBar();
      this.gotHitCounter = OG_NPC_HIT_IFRAMES;
      if (this.getHP() > ZERO) {
        const s = this.actionState;
        if (
          (damageObj.isLaunchAir() || s === OG_STATE.GOTLAUNCHED || s === OG_STATE.FALL || s === OG_STATE.JUMP) &&
          !this.isDowned()
        ) {
          this.gotLaunched();
        } else if (damageObj.isKnockDown()) {
          this.gotKnockDown();
        }
        const text = (amount: number, colour: number): void => {
          if (amount > ZERO) {
            this.emit({
              type: 'floatingText',
              x: this.x,
              y: this.y + OG_NPC_FLOATING_TEXT.yOffset,
              text: String(amount),
              colour,
            });
          }
        };
        text(damage, OG_NPC_FLOATING_TEXT.colour.physical);
        text(fireDamage, OG_NPC_FLOATING_TEXT.colour.fire);
        text(windDamage, OG_NPC_FLOATING_TEXT.colour.wind);
        text(waterDamage, OG_NPC_FLOATING_TEXT.colour.water);
        text(earthDamage, OG_NPC_FLOATING_TEXT.colour.earth);
      }
      this.emit({ type: 'sound', name: 'hit' });
    }
    return true;
  }

  /** `EnemyWolf.as:429` — the arc without a peak clip; touching the ground is DOWNED, bar untouched. */
  override doLaunched(): void {
    this.y += this.velY;
    this.movePositionX(this.velX);
    this.velY += OG_WOLF.launched.gravity;
    const groundY = this.world.groundY;
    if (this.y >= groundY) {
      this.y = groundY;
      this.startAction(OG_STATE.DOWNED);
    } else if (
      (this.velX < ZERO && this.getMapPosition() < OG_WOLF.launched.edgeMargin) ||
      (this.velX > ZERO && this.getMapPosition() > this.world.stageWidth - OG_WOLF.launched.edgeMargin)
    ) {
      this.gotLaunched();
      this.velX = asInt(this.velX * OG_WOLF.launched.edgeBounceMult);
    }
  }

  /** `EnemyWolf.as:447` — one death clip, no dice, no playback / loot guard. */
  override die(): void {
    this.emit({ type: 'sound', name: 'die' });
    this.createLoot();
    this.rewardXP();
    if (this.actionState === OG_STATE.GOTLAUNCHED) {
      this.dead = true;
      return;
    }
    if (this.isDowned()) {
      this.actionState = OG_STATE.DYING;
      this.startAnim(OG_ANIM.WOLF_DEATH);
      this.emitDeath(NO_DICE, true);
      this.dead = true;
      return;
    }
    this.y = this.world.groundY;
    this.actionState = OG_STATE.DYING;
    this.startAnim(OG_ANIM.WOLF_DEATH);
    this.emitDeath(NO_DICE, false);
    this.dead = true;
    this.hideHealthBar();
  }

  /** `EnemyWolf.as:471` — as the base's, but CHARGING keeps moving and FLY does not. */
  override redFreeze(): void {
    this.hideHealthBar();
    if (this.alpha < ONE) this.visible = false;
    else this.filter = 'dark';
    const s = this.actionState;
    if (s !== OG_STATE.GOTLAUNCHED && s !== OG_STATE.DYING && s !== OG_STATE.CHARGING) this.animFrozen = true;
  }
}
