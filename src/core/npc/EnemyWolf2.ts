/**
 * `EnemyWolf2.as` (103 lines), ported — ai 10 (a value no roster row uses; pinned in
 * `tests/npcTree.test.ts`), `extends EnemyWolf`. Lane L4b, slice 2a.
 *
 * The runner: it overrides exactly ONE method, `doAction`, and there it never WALKs
 * (WALK becomes a RUN in the same frame), never bites (no bite band — only the
 * pounce band), and hits in the overworld too (no `isAdventureMode` guard). The
 * constructor picks a `destX` and RUNs at once (`:10-11`).
 *
 * Every number it uses is a twin of the wolf's — `config/ogEnemyWolf.ts`'s header
 * names the lines — so it has no config file of its own.
 */
import { OG_ANIM, OG_PART, OG_STATE } from '../../config/ogActor';
import { OG_WOLF } from '../../config/ogEnemyWolf';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { EnemyWolf } from './EnemyWolf';
import { asInt } from './MCSActor';
import { NpcDamage } from './NpcDamage';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class EnemyWolf2 extends EnemyWolf {
  /** `EnemyWolf2.as:6` */
  constructor(world: NpcWorld, anims: AnimLibrary, geometry: HitGeometry, rng: Rng, target: NpcTarget | null = null) {
    super(world, anims, geometry, rng, target);
    this.destX = asInt(this.rng() * this.world.stageWidth);
    this.startAction(OG_STATE.RUN);
  }

  /** `EnemyWolf2.as:14` */
  override doAction(): void {
    const target = this.target;
    if (target === null) return;
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) {
          this.idleCounter = OG_WOLF.idle.retryFrames;
          this.faceTarget();
          if (!this.world.cutsceneShowing && asInt(this.rng() * OG_WOLF.idle.walkDice) < OG_WOLF.idle.walkBelow) {
            this.destX = asInt(this.rng() * this.world.stageWidth);
            this.startAction(OG_STATE.RUN);
          }
        }
        break;
      case OG_STATE.WALK:
        this.destX = asInt(this.rng() * this.world.stageWidth);
        this.startAction(OG_STATE.RUN);
        break;
      case OG_STATE.RUN: {
        this.movePositionX(this.walkSpeed);
        if (Math.abs(this.destX - this.posX) < OG_WOLF.arriveX) {
          const dice = asInt(this.rng() * OG_WOLF.arriveDice);
          if (dice === ZERO) {
            this.startAction(OG_STATE.IDLE);
          } else {
            this.destX = asInt(this.rng() * this.world.stageWidth);
            this.startAction(OG_STATE.RUN);
          }
        }
        const dist = asInt(Math.abs(this.x - target.x));
        if (dist >= OG_WOLF.pounce.minX && dist < OG_WOLF.pounce.maxX && asInt(this.rng() * OG_WOLF.pounce.dice) === ZERO) {
          this.startAction(OG_STATE.CHARGING);
        }
        break;
      }
      case OG_STATE.ATTACK:
        target.checkHitObject({ kind: 'part', part: OG_PART.weapon, owner: this }, new NpcDamage(this.damage, this.level));
        break;
      case OG_STATE.CHARGING:
        if (this.animation === OG_ANIM.WOLF_POUNCE_MID || this.animation === OG_ANIM.WOLF_POUNCE_MIDHIGH) {
          if (this.isFacingRight()) this.movePositionX(OG_WOLF.pounceStep);
          else this.movePositionX(-OG_WOLF.pounceStep);
          target.checkHitObject({ kind: 'part', part: OG_PART.head, owner: this }, new NpcDamage(this.damage, this.level));
          target.checkHitObject({ kind: 'part', part: OG_PART.r_hand, owner: this }, new NpcDamage(this.damage, this.level));
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
}
