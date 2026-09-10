/**
 * `EnemyFox.as` (240 lines), ported — ai 24, `extends EnemyWolf`. Lane L4b, slice 2a.
 * Overrides exactly `init` and `doAction`; `checkPlayer` is its own.
 *
 * A wolf at normal size that is prey, not predator, in the overworld: it never
 * bites or pounces there (`isAdventureMode` guards every hunt), runs 100 px past
 * the far edge when the player comes within 200 px in front (`checkPlayer`), and
 * parks itself in `REDFREEZE_STATE` once it has arrived off-stage. On each idle
 * re-roll in the overworld, a d5 of 0 makes it say one of nine lines by d9.
 *
 * ⚠️ THE LINES ARE NOT HERE. `:62-94` quote lyrics from a third-party song, which
 * the permission ruling does not cover; the `speech` event carries the INDEX and
 * the render layer owns the text (DIVERGENCES, L4b slice 2).
 *
 * Numbers: `config/ogEnemyFox.ts` for what it adds, `ogEnemyWolf.ts` for the twins.
 */
import { OG_ANIM, OG_PART, OG_STATE } from '../../config/ogActor';
import { OG_FOX } from '../../config/ogEnemyFox';
import { OG_WOLF } from '../../config/ogEnemyWolf';
import type { OgNpc } from '../../config/ogNpcs';
import { ONE, ZERO } from '../../config/nums';
import { EnemyWolf } from './EnemyWolf';
import { asInt } from './MCSActor';
import { NpcDamage } from './NpcDamage';

export class EnemyFox extends EnemyWolf {
  /** `EnemyFox.as:19` — the wolf's `init` without the 1.2 scale. */
  override init(xml: OgNpc): void {
    this.initMCSFromXML(xml.mcs);
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

  /** `EnemyFox.as:118-127` (and again `:155-164`) — the wolf's bands, only in a room. */
  private huntIfRoom(targetX: number): void {
    if (this.world.adventureMode) return;
    const dist = asInt(Math.abs(this.x - targetX));
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

  /** `EnemyFox.as:39` */
  override doAction(): void {
    const target = this.target;
    if (target === null) return;
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) {
          this.idleCounter = OG_WOLF.idle.retryFrames;
          this.faceTarget();
          if (asInt(this.rng() * OG_WOLF.idle.walkDice) < OG_WOLF.idle.walkBelow) {
            this.startAction(OG_STATE.WALK);
            this.emit({ type: 'speechClear' });
          }
          if (this.world.adventureMode && asInt(this.rng() * OG_FOX.speechDice) === ZERO) {
            const dice = asInt(this.rng() * OG_FOX.lines);
            this.emit({ type: 'speech', table: 'fox', id: dice });
          }
        }
        this.checkPlayer();
        break;
      case OG_STATE.WALK:
        this.movePositionX(this.walkSpeed);
        if (Math.abs(this.destX - this.posX) < OG_WOLF.arriveX) {
          const dice = asInt(this.rng() * OG_FOX.arriveDice);
          if (dice === ZERO) this.startAction(OG_STATE.IDLE);
          else this.startAction(OG_STATE.WALK);
        }
        this.checkPlayer();
        this.huntIfRoom(target.x);
        break;
      case OG_STATE.RUN:
        this.movePositionX(this.walkSpeed);
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
          if (
            this.world.adventureMode &&
            (this.posX <= -OG_FOX.offstageMargin || this.posX > this.world.stageWidth + OG_FOX.offstageMargin)
          ) {
            this.startAction(OG_STATE.REDFREEZE);
            this.startAnim(OG_ANIM.WOLF_IDLE);
          }
        }
        this.huntIfRoom(target.x);
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

  /** `EnemyFox.as:216` — the player within 200 px IN FRONT: run 100 px past the far edge. */
  checkPlayer(): void {
    const target = this.target;
    if (target === null) return;
    const playerX = asInt(target.x);
    if (playerX < this.x && !this.isFacingRight()) {
      if (this.x - playerX < OG_FOX.fleeSightX) {
        this.destX = this.world.stageWidth + OG_FOX.fleeBeyondEdge;
        this.startAction(OG_STATE.RUN);
        this.emit({ type: 'speechClear' });
      }
    } else if (playerX > this.x && this.isFacingRight()) {
      if (playerX - this.x < OG_FOX.fleeSightX) {
        this.destX = -OG_FOX.fleeBeyondEdge;
        this.startAction(OG_STATE.RUN);
        this.emit({ type: 'speechClear' });
      }
    }
  }
}
