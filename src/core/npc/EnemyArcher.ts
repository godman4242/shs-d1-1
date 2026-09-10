/**
 * `EnemyArcher.as` (311 lines), ported — ai 2, and the parent of `FriendlyArcher`.
 * Lane L4b, slice 2b. Overrides exactly `update` / `startAction` / `doAction` / `die`;
 * `fireArrow` is its own.
 *
 * Walk to a random spot, stop, reload, pull back, AIM — and on each one-second
 * trigger either loose (a coin for an enemy, always for a friendly) or, inside
 * 100 px, draw the knife. The knife lands ONCE, on the frame its clip ends
 * (`:119-121`). `update()` has no re-target trigger of its own: only AIM re-targets.
 *
 * THE ARROW is `ProjectileManager.createArrow(x, y, vx, vy, damage, canLaunch, this)`
 * (`:300`), an `arrow` event here with the ints the call takes. The seam has no
 * channel for it — DIVERGENCES finding 10. `fireArrow` solves a 30° shot at the
 * target 60 px above its feet; a target straight above gives 0/0 = NaN, which
 * `int()` reads as 0: the arrow leaves with no velocity. Ported as it reads.
 *
 * `mcs.setProp(13000)` on death (`:307`) is a `setProp` event: the bow is dropped.
 * Numbers: `config/ogEnemyArcher.ts`; the humanoid twins `ogNpcHumanoid.ts`.
 */
import { OG_ANIM, OG_PART, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_ARCHER } from '../../config/ogEnemyArcher';
import {
  OG_HUMANOID_BAR_X_RESET,
  OG_HUMANOID_DOWNED_BAR_X,
  OG_HUMANOID_DOWNEDUP_STEP,
  OG_HUMANOID_FALL_GRAVITY,
  OG_HUMANOID_GETUP_STEP,
} from '../../config/ogNpcHumanoid';
import { ONE, ZERO } from '../../config/nums';
import { asInt } from './MCSActor';
import { Npc } from './Npc';
import { NpcDamage } from './NpcDamage';

export class EnemyArcher extends Npc {
  /** `EnemyArcher.as:6` — where the current walk is heading. */
  destX = ZERO;

  /** `EnemyArcher.as:21` */
  override update(): void {
    if (this.disposed || this.animFrozen) return;
    if (this.target === null || this.target.isDead()) {
      this.target = this.world.nearestEnemy(this.getMapPosition(), !this.isFriendly);
      if (this.target === null) return;
    }
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
          this.destX = asInt(this.rng() * this.world.stageWidth);
          this.startAction(OG_STATE.WALK);
          break;
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
        case OG_ANIM.ARROWRELOAD:
          this.startAnim(OG_ANIM.ARROWPULLBACK);
          break;
        case OG_ANIM.ARROWPULLBACK:
          this.startAction(OG_STATE.AIM);
          break;
        case OG_ANIM.ARROWFIRE:
          this.startAction(OG_STATE.RELOAD);
          break;
        case OG_ANIM.KNIFEATTACK:
          this.target.checkHitObject(
            { kind: 'part', part: OG_PART.weapon, owner: this },
            new NpcDamage(this.damage, this.level),
          );
          this.startAction(OG_STATE.WALK);
          break;
        default:
          break;
      }
    }
    this.doAction();
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
  }

  /** `EnemyArcher.as:131` */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE:
        this.startAnim(OG_ANIM.BOWIDLE);
        break;
      case OG_STATE.WALK:
        this.destX = asInt(OG_ARCHER.inset + this.rng() * (this.world.stageWidth - OG_ARCHER.insetBoth));
        this.walkSpeed = asInt(this.rng() * OG_ARCHER.walk.range + OG_ARCHER.walk.base);
        this.startAnim(OG_ANIM.KNIFEWALK);
        break;
      case OG_STATE.AIM:
        this.startAnim(OG_ANIM.ARROWPULLBACK);
        break;
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
      case OG_STATE.RELOAD:
        if (this.target !== null) {
          if (this.target.x < this.x) this.faceLeft();
          else this.faceRight();
        }
        this.startAnim(OG_ANIM.ARROWRELOAD);
        break;
      case OG_STATE.ATTACK:
        this.startAnim(OG_ANIM.KNIFEATTACK);
        break;
      default:
        break;
    }
  }

  /** `EnemyArcher.as:178` — `var playerX = target.mcs.x` on its first line: no target, no action. */
  override doAction(): void {
    const target = this.target;
    if (target === null) return;
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.startAction(OG_STATE.WALK);
        break;
      case OG_STATE.WALK:
        if (Math.abs(this.destX - this.posX) < OG_ARCHER.arriveX) {
          this.startAction(OG_STATE.RELOAD);
          return;
        }
        if (this.destX > this.posX) {
          this.faceRight();
          this.movePositionX(this.walkSpeed);
        } else {
          this.faceLeft();
          this.movePositionX(-this.walkSpeed);
        }
        if (Math.abs(target.x - this.x) < OG_ARCHER.meleeX) {
          this.startAction(OG_STATE.ATTACK);
        } else if (
          this.posX > OG_ARCHER.inset &&
          this.posX < this.world.stageWidth - OG_ARCHER.inset &&
          asInt(this.rng() * OG_ARCHER.reloadDice) === ZERO
        ) {
          this.startAction(OG_STATE.RELOAD);
        }
        break;
      case OG_STATE.AIM:
        if (this.checkAITrigger()) {
          this.target = this.world.nearestEnemy(this.getMapPosition(), !this.isFriendly);
          if (this.target === null) return;
          if (Math.abs(this.target.x - this.x) < OG_ARCHER.meleeX) {
            this.startAction(OG_STATE.ATTACK);
          } else {
            if (this.x < this.target.x) this.faceRight();
            else this.faceLeft();
            if (this.isFriendly) this.fireArrow();
            else if (asInt(this.rng() * OG_ARCHER.fireDice) === ZERO) this.fireArrow();
          }
        }
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

  /** `EnemyArcher.as:271` — solve the 30° shot, jitter it, roll the launch by level, loose. */
  fireArrow(): void {
    const target = this.target;
    if (target === null) return;
    const A = OG_ARCHER.arrow;
    const fireX = asInt(this.x);
    const fireY = asInt(this.y + A.yOffset);
    const targetX = asInt(target.x);
    const targetY = asInt(target.y + A.yOffset);
    let velA = (A.gravity * Math.abs(targetX - fireX)) / A.cos30;
    velA = Math.sqrt(velA);
    let velXa = velA * A.cos30;
    const t = Math.abs(targetX - fireX) / velXa;
    let velYa = (targetY - fireY - A.half * A.gravity * t * t) / t;
    if (fireX > targetX) velXa = -velXa;
    velYa += this.rng() * A.jitter.range - A.jitter.offset;
    let doLaunch = false;
    if (this.level > A.launch.highLevel) {
      doLaunch = asInt(this.rng() * A.launch.highDice) > ZERO;
    } else if (this.level > A.launch.midLevel) {
      doLaunch = asInt(this.rng() * A.launch.midDice) === ZERO;
    } else if (this.level > A.launch.lowLevel) {
      doLaunch = asInt(this.rng() * A.launch.lowDice) === ZERO;
    }
    this.emit({
      type: 'arrow',
      x: fireX,
      y: fireY,
      velX: asInt(velXa),
      velY: asInt(velYa),
      damage: this.damage,
      canLaunch: doLaunch,
    });
    this.startAnim(OG_ANIM.ARROWFIRE);
  }

  /** `EnemyArcher.as:304` — the base's death, then the bow is dropped. */
  override die(): void {
    super.die();
    this.emit({ type: 'setProp', itemId: OG_ARCHER.deathProp });
  }
}
