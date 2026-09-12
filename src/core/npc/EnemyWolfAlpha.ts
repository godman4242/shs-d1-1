/**
 * `EnemyWolfAlpha.as` (584 lines), ported — ai 11, and ai 16 ONLY in the room
 * dispatch. No children. Lane L4b, slice 3b.
 *
 * A wolf at DOUBLE scale that howls for reinforcements. It is NOT a delta over
 * `EnemyWolf`: it re-states the wolf's whole shape at bigger numbers, and three
 * things differ that decide fights.
 *
 * ⚠️ **1. Its `gotHit` is not the wolf's** (`:438`), in two ways:
 *   - defence and the minimum-damage floor are subtracted **INSIDE** the
 *     `getHP() > 0` block (`:478-483`); the wolf subtracts them BEFORE it
 *     (`EnemyWolf.as:383-387`). Invisible in play, kept in the source's order.
 *   - **the launch branch has NO `!isDowned()` guard** (`:489`); the wolf's has one.
 *     A DOWNED alpha hit with launch-air launches AGAIN, off the floor.
 *
 * ⚠️ **2. `POSE_STATE` SPAWNS A WOLF** (`:289-296`): a coin picks an edge and
 * `NPCManager.createEnemy(65, ±50 outside it, groundY, true)` calls a real actor
 * into the fight. Room only. Nothing can drain that through the seam yet —
 * DIVERGENCES "L4b (slice 3b)", finding 14. And because the CONSTRUCTOR calls
 * `startAction(IDLE_STATE)` (`:23`), whose IDLE case has a one-in-three howl escape
 * (`:216`), **an alpha can emit a spawn before `init()` has ever run.**
 *
 * ⚠️ **3. `KNOCKDOWNED` falls through into `DOWNED`** (`:271-276`, no `break`), so a
 * knocked-down alpha lies there for 48 frames — EIGHT TIMES the wolf's 6
 * (`EnemyWolf.as:198-202`, which does have a `break` and its own counter).
 *
 * Smaller differences, all pinned in `tests/npcSlice3b.test.ts`: the arrival roll is
 * a d4 with HOWL as outcome 2 (the wolf's is a d3 with no howl); RUN re-rolls `destX`
 * and is a flat 15 with no overworld step-down; FALL plays `WOLF_LAUNCHED` and LAND
 * plays `WOLF_LAUNCHEDEND` where the wolf plays the pounce clips; the pounce ending
 * has NO `actionState !== FALL` guard; and the pounce hits THREE parts — head, right
 * hand AND **torso** (`:400-404`) — where the wolf hits two.
 *
 * `doLaunched` (`:524`), `die` (`:542`) and `redFreeze` (`:566`) are byte-equivalent
 * to the wolf's; written out because the source has the overrides.
 *
 * ⚠️ DEAD CODE DROPPED: the finished-clip switch lists `WOLF_DOWNEDTOIDLE` twice in
 * one case group (`:176`, `:179`) and `WOLF_LAUNCHEDEND` twice (`:152`, `:194`); the
 * first match wins, the repeats are unreachable — the same pattern the wolf has.
 * `gotHit` also assigns `var launch:Boolean = damageObj.isLaunchAir()` (`:447`) and
 * never reads it; the branch re-calls `isLaunchAir()`.
 *
 * Numbers: `config/ogEnemyWolfAlpha.ts`; the launch arc and the floating text are
 * the base's (`OG_NPC_LAUNCH`, `OG_NPC_FLOATING_TEXT`), named there.
 */
import { OG_ANIM, OG_PART, OG_STATE, type OgPart, type OgState } from '../../config/ogActor';
import { OG_ALPHA } from '../../config/ogEnemyWolfAlpha';
import { OG_NPC_FLOATING_TEXT, OG_NPC_HIT_IFRAMES, OG_NPC_LAUNCH } from '../../config/ogNpcBase';
import type { OgNpc } from '../../config/ogNpcs';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { asInt } from './MCSActor';
import { NO_DICE, Npc } from './Npc';
import { NpcDamage } from './NpcDamage';
import type { AnimLibrary, HitGeometry, NpcTarget, NpcWorld } from './types';

export class EnemyWolfAlpha extends Npc {
  /** `EnemyWolfAlpha.as:7` */
  destX = ZERO;
  /** `EnemyWolfAlpha.as:9` */
  idleCounter = ZERO;

  /**
   * `EnemyWolfAlpha.as:11` — ONE argument in the source; no chase flag exists.
   * ⚠️ It calls `startAction(IDLE_STATE)` (`:23`) like the wolf's, and that can
   * route straight into the howl, so a fresh alpha may already have emitted a spawn.
   */
  constructor(
    world: NpcWorld,
    anims: AnimLibrary,
    geometry: HitGeometry,
    rng: Rng,
    target: NpcTarget | null = null,
  ) {
    super(world, anims, geometry, rng, target);
    this.startAction(OG_STATE.IDLE);
    this.canGotLaunched = false;
    this.canGotKnockDown = false;
    this.canGotFly = false;
    this.canGotKneeGroin = false;
    this.canGotStun = false;
  }

  /** `EnemyWolfAlpha.as:31` — the wolf's `init` at DOUBLE scale; no ground snap. */
  override init(xml: OgNpc): void {
    this.initMCSFromXML(xml.mcs);
    this.setScale(OG_ALPHA.scale);
    this.damage = xml.attack ?? ZERO;
    this.defense = xml.defense ?? ZERO;
    this.maxhp = xml.hp ?? ZERO;
    this.level = xml.lvl ?? ZERO;
    this.xp = this.level * OG_ALPHA.xp.perLevel + OG_ALPHA.xp.base;
    this.reset();
    if (this.y === this.world.groundY) this.startAction(OG_STATE.WALK);
    else this.startAction(OG_STATE.FALL);
    this.reward = xml.loot ?? [];
  }

  /**
   * `EnemyWolfAlpha.as:52` — the spear boss's balance, at two different numbers and
   * inverted in structure: a level at or below `trivialLevel` is NEVER balanced,
   * where the boss balances first and stomps afterwards.
   */
  override setLevel(lvl: number): void {
    const S = OG_ALPHA.setLevel;
    const factor = lvl / this.level;
    this.level = lvl;
    this.damage = asInt(this.damage * factor);
    this.defense = asInt(this.defense * factor);
    this.maxhp = asInt(this.maxhp * factor);
    this.setHP(this.maxhp);
    this.updateHealthBar();
    this.xp = lvl * OG_ALPHA.xp.perLevel + OG_ALPHA.xp.base;
    if (lvl <= S.trivialLevel) {
      this.damage = S.trivialStat;
      this.defense = S.trivialStat;
      return;
    }
    const P = this.world.playerStats;
    const playerHP = P.maxHp;
    const playerDEF = P.defense;
    const playerATK = asInt(P.minDamage + P.damageRange / S.damageRangeDiv);
    const playerLVL = this.world.playerLevel;
    const lvldiff = lvl - playerLVL;
    let hitsToKillBoss = S.hitsToKillBossBase + lvldiff;
    let hitsToKillPlayer = S.hitsToKillPlayerBase - lvldiff;
    if (hitsToKillBoss <= ZERO) hitsToKillBoss = S.hitsToKillBossMin;
    if (hitsToKillPlayer <= ZERO) hitsToKillPlayer = S.hitsToKillPlayerMin;
    let playerhit = playerATK - this.defense;
    const F = S.floor;
    // `:97-112` — FALLS THROUGH: a matching level tier whose value test fails hands
    // the next tier's divisor. `max(hit, ladder)` is wrong.
    if (playerLVL <= F.tier1Level && playerhit < F.tier1Min) {
      playerhit = F.tier1Min;
    } else if (playerLVL <= F.tier2Level && playerhit < asInt(playerLVL / F.tier2Div)) {
      playerhit = asInt(playerLVL / F.tier2Div);
    } else if (playerLVL <= F.tier3Level && playerhit < asInt(playerLVL / F.tier3Div)) {
      playerhit = asInt(playerLVL / F.tier3Div);
    } else if (playerhit < asInt(playerLVL / F.tier4Div)) {
      playerhit = asInt(playerLVL / F.tier4Div);
    }
    const bossHP = playerhit * hitsToKillBoss;
    if (bossHP > this.maxhp) {
      this.maxhp = bossHP;
      this.setHP(this.maxhp);
      this.updateHealthBar();
    }
    const bosshit = asInt(playerHP / hitsToKillPlayer);
    const bossATK = bosshit + playerDEF;
    if (bossATK > this.damage) this.damage = bossATK;
  }

  /** `EnemyWolfAlpha.as:129` — the pounce ending has NO `actionState !== FALL` guard. */
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
          if (asInt(this.rng() * OG_ALPHA.pounceHighDice) === ZERO) this.startAnim(OG_ANIM.WOLF_POUNCE_MIDHIGH);
          else this.startAnim(OG_ANIM.WOLF_POUNCE_MID);
          break;
        case OG_ANIM.WOLF_POUNCE_MID:
        case OG_ANIM.WOLF_POUNCE_MIDHIGH:
          this.startAnim(OG_ANIM.WOLF_POUNCE_END);
          break;
        default:
          break;
      }
    }
    this.doAction();
    if (this.gotHitCounter > ZERO) this.gotHitCounter -= ONE;
    if (this.checkAITrigger()) this.target = this.world.nearestEnemy(this.getMapPosition(), true);
  }

  /** `EnemyWolfAlpha.as:210` — IDLE can escape into the howl before it ever snarls. */
  override startAction(actionState: OgState): void {
    this.actionState = actionState;
    switch (actionState) {
      case OG_STATE.IDLE:
        if (!this.world.adventureMode && asInt(this.rng() * OG_ALPHA.howlDice) === ZERO) {
          this.startAction(OG_STATE.POSE);
          return;
        }
        this.faceTarget();
        this.startAnim(OG_ANIM.WOLF_SNARL);
        this.idleCounter = OG_ALPHA.idle.snarlFrames;
        break;
      case OG_STATE.WALK:
        this.destX = asInt(this.rng() * this.world.stageWidth);
        this.faceTarget();
        if (this.destX < this.posX) {
          this.walkSpeed = asInt(-this.rng() * OG_ALPHA.walk.range - OG_ALPHA.walk.base);
        } else {
          this.walkSpeed = asInt(this.rng() * OG_ALPHA.walk.range + OG_ALPHA.walk.base);
        }
        if (this.target !== null && (this.target.x - this.x) * this.walkSpeed < ZERO) {
          this.startAnim(OG_ANIM.WOLF_WALKBACKWARDS);
          this.walkSpeed = asInt(this.walkSpeed / OG_ALPHA.walkBackwardsDiv);
        } else {
          this.startAnim(OG_ANIM.WOLF_WALK);
        }
        break;
      case OG_STATE.RUN:
        this.startAnim(OG_ANIM.WOLF_RUN);
        // `:248` — the alpha RE-ROLLS destX here; the wolf keeps the one it had.
        this.destX = asInt(this.rng() * this.world.stageWidth);
        if (this.destX < this.posX) {
          this.walkSpeed = -OG_ALPHA.runSpeed;
          this.faceLeft();
        } else {
          this.walkSpeed = OG_ALPHA.runSpeed;
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
      // `:271-276` — KNOCKDOWNED has NO `break` in the source: it falls into DOWNED's
      // body and takes DOWNED's 48 frames. The wolf's has a break and its own 6.
      case OG_STATE.KNOCKDOWNED:
      case OG_STATE.DOWNED:
        this.actionState = OG_STATE.DOWNED;
        this.startAnim(OG_ANIM.WOLF_LAUNCHEDEND);
        this.idleCounter = OG_ALPHA.downedFrames;
        break;
      case OG_STATE.FALL:
        this.startAnim(OG_ANIM.WOLF_LAUNCHED);
        break;
      case OG_STATE.LAND:
        this.startAnim(OG_ANIM.WOLF_LAUNCHEDEND);
        break;
      case OG_STATE.DYING:
        break;
      case OG_STATE.POSE:
        this.startAnim(OG_ANIM.WOLF_HOWL);
        if (!this.world.adventureMode) {
          const groundY = this.world.groundY;
          if (asInt(this.rng() * OG_ALPHA.spawn.sideDice) === ZERO) {
            this.emit({
              type: 'spawn',
              npcId: OG_ALPHA.spawn.npcId,
              x: -OG_ALPHA.spawn.edgeOffset,
              y: groundY,
              fatal: true,
            });
          } else {
            this.emit({
              type: 'spawn',
              npcId: OG_ALPHA.spawn.npcId,
              x: this.world.stageWidth + OG_ALPHA.spawn.edgeOffset,
              y: groundY,
              fatal: true,
            });
          }
        }
        break;
      default:
        break;
    }
  }

  /** `EnemyWolfAlpha.as:321-352` / `:354-385` — WALK and RUN share one body, verbatim. */
  private arriveAndHunt(target: NpcTarget): void {
    if (Math.abs(this.destX - this.posX) < OG_ALPHA.arriveX) {
      const dice = asInt(this.rng() * OG_ALPHA.arriveDice);
      if (dice === ZERO) {
        this.startAction(OG_STATE.IDLE);
      } else if (dice === ONE) {
        this.startAction(OG_STATE.WALK);
      } else if (dice === OG_ALPHA.poseOn) {
        // `:332`/`:365` — the wolf's d3 has no such outcome.
        this.startAction(OG_STATE.POSE);
      } else {
        this.destX = asInt(this.rng() * this.world.stageWidth);
        this.startAction(OG_STATE.RUN);
      }
    }
    const dist = asInt(Math.abs(this.x - target.x));
    if (dist < OG_ALPHA.bite.maxX && dist > OG_ALPHA.bite.minX) {
      this.startAction(OG_STATE.ATTACK);
    } else if (
      dist >= OG_ALPHA.pounce.minX &&
      dist < OG_ALPHA.pounce.maxX &&
      asInt(this.rng() * OG_ALPHA.pounce.dice) === ZERO
    ) {
      this.startAction(OG_STATE.CHARGING);
    }
  }

  /** `EnemyWolfAlpha.as:301` — the pounce hits THREE parts, not the wolf's two. */
  override doAction(): void {
    const target = this.target;
    switch (this.actionState) {
      case OG_STATE.IDLE:
        this.idleCounter -= ONE;
        if (this.idleCounter <= ZERO) {
          this.idleCounter = OG_ALPHA.idle.retryFrames;
          this.faceTarget();
          if (asInt(this.rng() * OG_ALPHA.idle.walkDice) < OG_ALPHA.idle.walkBelow) this.startAction(OG_STATE.WALK);
        }
        break;
      case OG_STATE.WALK:
        this.movePositionX(this.walkSpeed);
        if (target !== null) this.arriveAndHunt(target);
        break;
      case OG_STATE.RUN:
        this.movePositionX(this.walkSpeed);
        if (target !== null) this.arriveAndHunt(target);
        break;
      case OG_STATE.ATTACK:
        if (!this.world.adventureMode && target !== null) {
          target.checkHitObject({ kind: 'part', part: OG_PART.weapon, owner: this }, new NpcDamage(this.damage, this.level));
        }
        break;
      case OG_STATE.CHARGING:
        if (this.animation === OG_ANIM.WOLF_POUNCE_MID || this.animation === OG_ANIM.WOLF_POUNCE_MIDHIGH) {
          if (this.isFacingRight()) this.movePositionX(OG_ALPHA.pounceStep);
          else this.movePositionX(-OG_ALPHA.pounceStep);
          if (!this.world.adventureMode && target !== null) {
            target.checkHitObject({ kind: 'part', part: OG_PART.head, owner: this }, new NpcDamage(this.damage, this.level));
            target.checkHitObject({ kind: 'part', part: OG_PART.r_hand, owner: this }, new NpcDamage(this.damage, this.level));
            target.checkHitObject({ kind: 'part', part: OG_PART.torso, owner: this }, new NpcDamage(this.damage, this.level));
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
        this.velY += OG_NPC_LAUNCH.gravity;
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
      case OG_STATE.POSE:
        break;
      default:
        break;
    }
  }

  /**
   * `EnemyWolfAlpha.as:438` — defence and the floor apply INSIDE the alive check,
   * and the launch branch has NO `!isDowned()` guard.
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
        damage *= OG_ALPHA.partMult;
        this.behead = true;
        this.gotHitFlag = true;
        break;
      default:
        this.gotHitFlag = true;
    }
    if (this.getHP() > ZERO) {
      // `:480-484` — INSIDE, where the wolf does this before the check.
      damage -= this.defense;
      if (damage < damageObj.getMinDamage()) damage = damageObj.getMinDamage();
      this.setHP(this.getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
      this.updateHealthBar();
      this.gotHitCounter = OG_NPC_HIT_IFRAMES;
      if (this.getHP() > ZERO) {
        const s = this.actionState;
        // `:489` — NO `!isDowned()` guard: a downed alpha launches again.
        if (damageObj.isLaunchAir() || s === OG_STATE.GOTLAUNCHED || s === OG_STATE.FALL || s === OG_STATE.JUMP) {
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

  /** `EnemyWolfAlpha.as:524` — byte-equivalent to the wolf's arc. */
  override doLaunched(): void {
    this.y += this.velY;
    this.movePositionX(this.velX);
    this.velY += OG_NPC_LAUNCH.gravity;
    const groundY = this.world.groundY;
    if (this.y >= groundY) {
      this.y = groundY;
      this.startAction(OG_STATE.DOWNED);
    } else if (
      (this.velX < ZERO && this.getMapPosition() < OG_NPC_LAUNCH.edgeMargin) ||
      (this.velX > ZERO && this.getMapPosition() > this.world.stageWidth - OG_NPC_LAUNCH.edgeMargin)
    ) {
      this.gotLaunched();
      this.velX = asInt(this.velX * OG_NPC_LAUNCH.edgeBounceMult);
    }
  }

  /** `EnemyWolfAlpha.as:542` — byte-equivalent to the wolf's death. */
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

  /** `EnemyWolfAlpha.as:566` — byte-equivalent to the wolf's: CHARGING keeps moving. */
  override redFreeze(): void {
    this.hideHealthBar();
    if (this.alpha < ONE) this.visible = false;
    else this.filter = 'dark';
    const s = this.actionState;
    if (s !== OG_STATE.GOTLAUNCHED && s !== OG_STATE.DYING && s !== OG_STATE.CHARGING) this.animFrozen = true;
  }
}
