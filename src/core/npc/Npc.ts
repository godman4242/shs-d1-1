/**
 * `NPC.as` (1,238 lines, 51 functions), ported — THE BASE of the 34 enemy actors
 * and, through `MCSPlayer extends NPC`, of the player. Lane L4b, slice 0.
 *
 * The three spine methods a descendant fills — `update()`, `startAction()`,
 * `doAction()` — are EMPTY here, exactly as in the source (`NPC.as:268-283`).
 * `startAction` does not even record the state; every descendant's first line is
 * `this.actionState = actionState`. What the base owns is everything a fighter
 * shares: stats and XP maths, the one-second re-target trigger, hit reception
 * with its defence/floor/behead/element rules, the seven reaction states and
 * their per-frame physics, death with loot and XP, and the four-second fade.
 *
 * Every method sits under its `NPC.as:<line>` cite, in SOURCE ORDER, with the
 * source's own name (AS3 `internal` is package-visible; nothing is hidden here
 * that a descendant or a test needs). Numbers come from `config/ogNpcBase.ts`
 * and symbols from `config/ogActor.ts`; this file has none of its own.
 *
 * WHAT CROSSES THE PORTS (see `types.ts`): Flash singletons become `world`
 * reads, per-part hit tests become `geometry` questions, and every HUD/particle/
 * sound side effect becomes an `NpcEvent`. `Math.random()` — the source uses it
 * in `createLoot` and `die` — becomes the injected `rng`.
 *
 * ⚠️ THREE THINGS PORTED AS THEY BEHAVE, NOT AS THEY READ (DIVERGENCES, L4b-0):
 *   - `gotLaunched()` (`:538`): `this.isDowned() && !actionState == FLY_STATE`
 *     parses as `(!actionState) == 32`, always false. A downed body CAN be
 *     re-launched by this path. Ported as it behaves.
 *   - `gotFlyAway(target.x, …)` (`:482`): `target` is the hit PART clip, whose
 *     `x` is LOCAL to the body, compared against the body's SCREEN x. Ported
 *     through `geometry.partX`, so the answer stays the port's to give.
 *   - blood-emitter placement dice (`:941`, `:983`, `:1032`, `:1054`) are NOT
 *     rolled: they only place particles. The `death` event carries the roll
 *     that chose the clip; the render side owns the blood.
 */
import { OG_ANIM, OG_LAUNCH, OG_PART, OG_STATE, type OgPart, type OgState } from '../../config/ogActor';
import {
  OG_NPC_AIRBORNE_ABOVE_GROUND,
  OG_NPC_BEHEAD_MULT,
  OG_NPC_CALC_XP,
  OG_NPC_COLOUR_XP,
  OG_NPC_DEATH,
  OG_NPC_DEATHTOUCH_DAMAGE,
  OG_NPC_DEFAULTS,
  OG_NPC_ELEMENT_FLOOR,
  OG_NPC_FADE_FRAMES,
  OG_NPC_FLOATING_TEXT,
  OG_NPC_FLY,
  OG_NPC_FLYAWAY,
  OG_NPC_GREY_LEVEL,
  OG_NPC_HIT_IFRAMES,
  OG_NPC_LAUNCH,
  OG_NPC_LOOT,
  OG_NPC_SET_LEVEL,
  OG_NPC_XP,
  OG_NPC_ZERO_DIFFERENCE,
  OG_NPC_ZERO_DIFFERENCE_CAP,
} from '../../config/ogNpcBase';
import type { OgNpc, OgNpcLoot } from '../../config/ogNpcs';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import { MCSActor, asInt } from './MCSActor';
import type { NpcDamage } from './NpcDamage';
import type { AnimLibrary, HitGeometry, HitShape, NpcTarget, NpcWorld } from './types';

/** "No dice were rolled" in a `death` event. Descendants that own their death (`EnemyWolf`) reuse it. */
export const NO_DICE = -ONE;

export class Npc extends MCSActor implements NpcTarget {
  /** `NPC.as:8` */
  velY = ZERO;
  /** `NPC.as:10` */
  velX = ZERO;
  /** `NPC.as:12` — set by each descendant's `startAction(WALK_STATE)`. */
  walkSpeed = ZERO;
  /** `NPC.as:14` */
  damage: number = OG_NPC_DEFAULTS.damage;
  /** `NPC.as:16` */
  defense: number = OG_NPC_DEFAULTS.defense;
  /** `NPC.as:18` */
  level = ZERO;
  /** `NPC.as:20` */
  xp = ZERO;
  /** `NPC.as:22` */
  aiCounterMax: number = OG_NPC_DEFAULTS.aiCounterMax;
  /** `NPC.as:24` */
  aiCounter = ZERO;
  /** `NPC.as:26` */
  gotHitCounter = ZERO;
  /** `NPC.as:28` */
  TTLMAX: number = OG_NPC_DEFAULTS.ttlMax;
  /** `NPC.as:30` */
  ttl: number = this.TTLMAX;
  /** `NPC.as:32` — `StatsManager.getPlayer()` in the constructor; injected here. */
  target: NpcTarget | null;
  /** `NPC.as:34` — the roster row's `<reward>` loot list. */
  reward: readonly OgNpcLoot[] = [];
  /** `NPC.as:40` — a non-fatal actor dies without dismemberment. */
  fatal = true;
  /** `NPC.as:42` */
  dontGiveLoot = false;
  /** `NPC.as:44-48` — what `doFlinch` saves and `endFlinch` restores. */
  prevActionState: OgState = OG_STATE.IDLE;
  prevAnim = '';
  prevFrameCounter = ZERO;
  /** `NPC.as:50` */
  stunCounter = ZERO;
  /** `NPC.as:52` */
  isFriendly = false;
  /** `NPC.as:54-68` — elemental attack/defence, from the roster (`XMLNpc.as:196-212`). */
  STAT_FIREATK = ZERO;
  STAT_WINDATK = ZERO;
  STAT_WATERATK = ZERO;
  STAT_EARTHATK = ZERO;
  STAT_FIREDEF = ZERO;
  STAT_WINDDEF = ZERO;
  STAT_WATERDEF = ZERO;
  STAT_EARTHDEF = ZERO;
  /** `NPC.as:70-78` — which reactions this actor accepts; animals and bosses flip them. */
  canGotLaunched = true;
  canGotKnockDown = true;
  canGotFly = true;
  canGotKneeGroin = true;
  canGotStun = true;

  /** `NPC.as:80` */
  constructor(
    world: NpcWorld,
    anims: AnimLibrary,
    geometry: HitGeometry,
    protected readonly rng: Rng,
    target: NpcTarget | null = null,
  ) {
    super(world, anims, geometry);
    this.target = target;
  }

  /** `NPC.as:94` — the mob level at or below which a kill pays nothing. */
  static getGreyLevel(playerLevel: number): number {
    const g = OG_NPC_GREY_LEVEL;
    if (playerLevel < g.zeroBelow) return ZERO;
    if (playerLevel < g.midBelow) return playerLevel - Math.floor(playerLevel / g.midDiv) - g.midSub;
    if (playerLevel < g.highBelow) return playerLevel - Math.floor(playerLevel / g.highDiv) - g.highSub;
    return playerLevel - g.topSub;
  }

  /** `NPC.as:112` — how many levels below the player a mob's XP reaches zero. */
  static getZeroDifference(playerLevel: number): number {
    for (const [below, value] of OG_NPC_ZERO_DIFFERENCE) {
      if (playerLevel < below) return value;
    }
    return OG_NPC_ZERO_DIFFERENCE_CAP;
  }

  /** `NPC.as:166` — returns an AS3 `int`: every step truncates. */
  static calcXP(playerLevel: number, mobLevel: number, xp: number, elite: boolean): number {
    if (mobLevel <= Npc.getGreyLevel(playerLevel)) return ZERO;
    if (mobLevel - playerLevel > OG_NPC_CALC_XP.maxLevelsAbove) return ZERO;
    let finalXP = xp;
    if (playerLevel < mobLevel) {
      finalXP = asInt(xp * (ONE + OG_NPC_CALC_XP.bonusPerLevelAbove * (mobLevel - playerLevel)));
    } else if (playerLevel > mobLevel) {
      finalXP = asInt(xp * (ONE - (playerLevel - mobLevel) / Npc.getZeroDifference(playerLevel)));
    }
    if (elite) finalXP *= OG_NPC_CALC_XP.eliteMult;
    return finalXP;
  }

  /** `NPC.as:192` */
  reset(): void {
    this.visible = true;
    this.alpha = ONE;
    this.dead = false;
    this.behead = false;
    this.gotHitFlag = false;
    this.dontGiveLoot = false;
    this.setHP(this.maxhp);
    this.velX = ZERO;
    this.velY = ZERO;
    this.aiCounter = ZERO;
    this.startAction(OG_STATE.IDLE);
    this.showHealthBar();
    this.updateHealthBar();
    this.faceRight();
    this.ttl = this.TTLMAX;
  }

  /**
   * `NPC.as:211` — from a roster row. `<hp>`/`<attack>`/`<defense>`/`<lvl>` are
   * `int` fields on `XMLNpc` (`:54-68`) and read 0 when the tag is absent; the
   * elemental pairs are `XMLNpc.as:196-212` (`<fire>` → FIREATK + EARTHDEF,
   * `<earth>` → EARTHATK + WINDDEF; the roster carries no `<wind>`/`<water>`).
   */
  init(xml: OgNpc): void {
    this.initMCSFromXML(xml.mcs);
    this.damage = xml.attack ?? ZERO;
    this.defense = xml.defense ?? ZERO;
    this.maxhp = xml.hp ?? ZERO;
    this.level = xml.lvl ?? ZERO;
    this.xp = this.level * OG_NPC_XP.perLevel + OG_NPC_XP.base;
    this.reset();
    if (this.y === this.world.groundY) this.startAction(OG_STATE.WALK);
    else this.startAction(OG_STATE.FALL);
    this.reward = xml.loot ?? [];
    const fire = xml.fire ?? ZERO;
    const earth = xml.earth ?? ZERO;
    this.STAT_FIREATK = fire;
    this.STAT_EARTHDEF = fire;
    this.STAT_EARTHATK = earth;
    this.STAT_WINDDEF = earth;
    this.STAT_WINDATK = ZERO;
    this.STAT_WATERATK = ZERO;
    this.STAT_FIREDEF = ZERO;
    this.STAT_WATERDEF = ZERO;
  }

  /** `NPC.as:239` — the int fields truncate on every `*=`. */
  setLevel(lvl: number): void {
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

  /** `NPC.as:262` — a friendly hunts the nearest ENEMY (`isEnemy = !isFriendly`). */
  setIsFriendly(): void {
    this.isFriendly = true;
    this.target = this.world.nearestEnemy(this.getMapPosition(), !this.isFriendly);
  }

  /** `NPC.as:268` — empty; the descendant's per-frame loop. */
  update(): void {
    // intentionally empty in the source
  }

  /** `NPC.as:272` — wraps the body's clock and DISCARDS the finished key. */
  updateAnimation(): void {
    this.stepAnimation();
  }

  /** `NPC.as:277` — empty; does not even record the state. */
  startAction(actionState: OgState): void {
    void actionState;
  }

  /** `NPC.as:281` — empty. */
  doAction(): void {
    // intentionally empty in the source
  }

  /** `NPC.as:285` — true once every `aiCounterMax` calls (and on the very first). */
  checkAITrigger(): boolean {
    this.aiCounter -= ONE;
    if (this.aiCounter <= ZERO) {
      this.aiCounter = this.aiCounterMax;
      return true;
    }
    return false;
  }

  /** `NPC.as:296` */
  canHit(): boolean {
    return this.gotHitCounter === ZERO;
  }

  /** `NPC.as:301` — scans the parts top-down while `!gotHitFlag`; the first part hit decides. */
  checkHit(hitX: number, hitY: number, damage: NpcDamage): boolean {
    if (this.gotHitFlag) return false;
    const part = this.geometry.partAtPoint(hitX, hitY);
    if (part === null) return false;
    return this.gotHit(part, damage);
  }

  /** `NPC.as:323` — no flag guard on the scan; a miss clears the flag. */
  checkHitObject(thing: HitShape, damage: NpcDamage, checkByAttacker = false): boolean {
    void checkByAttacker;
    const part = this.geometry.partHitBy(thing);
    if (part !== null) return this.gotHit(part, damage);
    this.gotHitFlag = false;
    return false;
  }

  /** `NPC.as:344` — like `checkHit`, but a landed trap hit clears the flag again. */
  checkHitTrap(thing: HitShape, damage: NpcDamage): boolean {
    if (!this.gotHitFlag) {
      const part = this.geometry.partHitBy(thing);
      if (part !== null) {
        if (this.gotHit(part, damage)) {
          this.gotHitFlag = false;
          return true;
        }
        return false;
      }
    }
    this.gotHitFlag = false;
    return false;
  }

  /** `NPC.as:368` — overlap only, no damage. */
  testHit(thing: HitShape): boolean {
    if (this.gotHitFlag) return false;
    return this.geometry.partHitBy(thing) !== null;
  }

  /** `NPC.as:392-420` — `raw − def`, floored at 1 if raw was positive, else at 0. */
  private static elemental(raw: number, def: number): number {
    const after = raw - def;
    if (raw > ZERO && after < OG_NPC_ELEMENT_FLOOR) return OG_NPC_ELEMENT_FLOOR;
    if (after < ZERO) return ZERO;
    return after;
  }

  /** `NPC.as:386` — `target` was the part CLIP; it is the part ID here. */
  gotHit(target: OgPart, damageObj: NpcDamage): boolean {
    if (this.gotHitCounter > ZERO) return false;
    let damage = damageObj.damage;
    const fireDamage = Npc.elemental(damageObj.fireDamage, this.STAT_FIREDEF);
    const waterDamage = Npc.elemental(damageObj.waterDamage, this.STAT_WATERDEF);
    const windDamage = Npc.elemental(damageObj.windDamage, this.STAT_WINDDEF);
    const earthDamage = Npc.elemental(damageObj.earthDamage, this.STAT_EARTHDEF);
    switch (target) {
      case OG_PART.hat:
      case OG_PART.head:
      case OG_PART.neck:
        this.behead = true;
        this.gotHitFlag = true;
        break;
      case OG_PART.weapon:
        this.gotHitFlag = false;
        return false;
      default:
        this.gotHitFlag = true;
    }
    if (this.getHP() > ZERO) {
      damage -= this.defense;
      const min = damageObj.getMinDamage();
      if (damage < min) damage = min;
      if (this.behead) damage = asInt(damage * OG_NPC_BEHEAD_MULT);
      if (damageObj.isDeathTouch()) {
        damage = OG_NPC_DEATHTOUCH_DAMAGE;
        damageObj.launchType = OG_LAUNCH.LAUNCH_FLY;
      }
      this.setHP(this.getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
      this.updateHealthBar();
      this.gotHitCounter = OG_NPC_HIT_IFRAMES;
      this.stunCounter = ZERO;
      if (this.getHP() > ZERO) {
        this.behead = false;
        const s = this.actionState;
        if (damageObj.isKneeGroin()) {
          this.gotKneeGroin(damageObj.flyVelX, damageObj.flyVelY, damageObj.attackerlvl);
        } else if (damageObj.isBackThrow()) {
          this.gotBackThrow(damageObj.flyVelX, damageObj.flyVelY);
        } else if (
          (damageObj.isLaunchAir() || s === OG_STATE.GOTLAUNCHED || s === OG_STATE.FALL || s === OG_STATE.JUMP) &&
          !this.isDowned()
        ) {
          this.gotLaunched();
        } else if (damageObj.isKnockDown()) {
          this.gotKnockDown();
        } else if (damageObj.isFly()) {
          this.gotFly(damageObj.flyVelX, damageObj.flyVelY);
        } else if (damageObj.isFlyAway()) {
          this.gotFlyAway(this.geometry.partX(target), this.y);
        } else if (damageObj.isStun()) {
          this.gotStun(damageObj.flyVelX, damageObj.flyVelY);
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

  /** `NPC.as:521` */
  checkDie(): boolean {
    if (this.getHP() <= ZERO) {
      this.die();
      return true;
    }
    return false;
  }

  /** `NPC.as:531` */
  isGoingToDie(): boolean {
    return this.getHP() <= ZERO;
  }

  /**
   * `NPC.as:536`. ⚠️ The source's guard is
   * `!canGotLaunched || isDowned() && !actionState == FLY_STATE || actionState == DYING_STATE`;
   * `!actionState == FLY_STATE` is always false, so the downed clause is dead
   * code. Ported as it behaves (see the file header).
   */
  gotLaunched(): void {
    if (!this.canGotLaunched || this.actionState === OG_STATE.DYING) return;
    const s = this.actionState;
    if (s === OG_STATE.GOTLAUNCHED || s === OG_STATE.FALL || s === OG_STATE.JUMP || s === OG_STATE.FLY) {
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

  /** `NPC.as:570` — only from the ground. */
  gotKnockDown(): void {
    if (!this.canGotKnockDown || this.isDowned() || this.actionState === OG_STATE.DYING) return;
    const groundY = this.world.groundY;
    if (this.y >= groundY) {
      this.y = groundY;
      this.startAction(OG_STATE.KNOCKDOWNED);
      this.hideHealthBar();
    }
  }

  /** `NPC.as:585` — faces AGAINST the horizontal velocity. */
  gotFly(flyVelX: number, flyVelY: number): void {
    if (!this.canGotFly || this.isDowned() || this.actionState === OG_STATE.DYING) return;
    if (this.getHP() <= ZERO) {
      this.die();
      return;
    }
    this.startAction(OG_STATE.FLY);
    this.startAnim(OG_ANIM.FLY_START);
    if (flyVelX > ZERO) this.faceLeft();
    else this.faceRight();
    this.velX = flyVelX;
    this.velY = flyVelY;
    this.hideHealthBar();
  }

  /** `NPC.as:611` — thrown AWAY from a point; `ypos` is unused in the source. */
  gotFlyAway(xpos: number, ypos: number): void {
    void ypos;
    if (!this.canGotFly || this.isDowned() || this.actionState === OG_STATE.DYING) return;
    if (this.getHP() <= ZERO) {
      this.die();
      return;
    }
    this.startAction(OG_STATE.FLY);
    this.startAnim(OG_ANIM.FLY_START);
    if (xpos > this.x) {
      this.faceRight();
      this.velX = -OG_NPC_FLYAWAY.velXAbs;
    } else {
      this.faceLeft();
      this.velX = OG_NPC_FLYAWAY.velXAbs;
    }
    this.velY = OG_NPC_FLYAWAY.velY;
    this.hideHealthBar();
  }

  /** `NPC.as:639` — `chiDamage` is unused in the source; the position is the attacker's. */
  gotKneeGroin(posx: number, posy: number, chiDamage: number): void {
    void chiDamage;
    if (!this.canGotKneeGroin || this.isDowned() || this.actionState === OG_STATE.DYING) return;
    if (posx > this.getMapPosition()) this.faceRight();
    else this.faceLeft();
    this.actionState = OG_STATE.VICTIM;
    this.startAnim(OG_ANIM.KNEEGROIN_VICTIM);
    this.setPosition(posx, posy);
  }

  /** `NPC.as:658` — shares `canGotKneeGroin`. */
  gotBackThrow(posx: number, posy: number): void {
    if (!this.canGotKneeGroin || this.isDowned() || this.actionState === OG_STATE.DYING) return;
    if (posx > this.getMapPosition()) this.faceRight();
    else this.faceLeft();
    this.actionState = OG_STATE.VICTIM;
    this.startAnim(OG_ANIM.BACKTHROW_VICTIM);
    this.setPosition(posx, posy);
    this.hideHealthBar();
  }

  /** `NPC.as:678` — `posx` 0 means "stay put". */
  gotStun(duration: number, posx = ZERO): void {
    if (!this.canGotStun || this.isDowned() || this.actionState === OG_STATE.DYING) return;
    this.stunCounter = duration;
    this.actionState = OG_STATE.STUN;
    this.startAnim(OG_ANIM.ZOM_IDLE);
    if (posx !== ZERO) this.setPosition(posx, this.y);
  }

  /** `NPC.as:693` */
  doStun(): void {
    this.stunCounter -= ONE;
    if (this.stunCounter <= ZERO) this.startAction(OG_STATE.IDLE);
  }

  /** `NPC.as:702` — one frame of the launch arc. */
  doLaunched(): void {
    this.y += this.velY;
    this.movePositionX(this.velX);
    this.velY += OG_NPC_LAUNCH.gravity;
    if (this.velY < ZERO && this.velY > OG_NPC_LAUNCH.peakBandTop) this.startAnim(OG_ANIM.GOTLAUNCHED_PEAK);
    const groundY = this.world.groundY;
    if (this.velY > ZERO && this.y >= groundY) {
      this.y = groundY;
      this.startAction(OG_STATE.DOWNED);
      this.hideHealthBar();
    } else if (this.atEdge(OG_NPC_LAUNCH.edgeMargin)) {
      this.gotLaunched();
      this.velX *= OG_NPC_LAUNCH.edgeBounceMult;
    }
  }

  /** `NPC.as:718` / `:740` — heading off either end of the stage. */
  private atEdge(margin: number): boolean {
    const pos = this.getMapPosition();
    return (this.velX < ZERO && pos < margin) || (this.velX > ZERO && pos > this.world.stageWidth - margin);
  }

  /** `NPC.as:725` — one frame of the fly arc; `FLY_END` is a full stop. */
  doFly(): void {
    if (this.animation === OG_ANIM.FLY_END) return;
    this.y += this.velY;
    this.movePositionX(this.velX);
    this.velY += OG_NPC_FLY.gravity;
    const groundY = this.world.groundY;
    if (this.velY > ZERO && this.y >= groundY - OG_NPC_FLY.landAboveGround) {
      this.y = groundY;
      this.startAnim(OG_ANIM.FLY_END);
    } else if (this.atEdge(OG_NPC_FLY.edgeMargin)) {
      this.gotLaunched();
      this.velX *= OG_NPC_FLY.edgeBounceMult;
    }
  }

  /** `NPC.as:747` — interrupt anything but a flinch or a slash. */
  doFlinch(): void {
    if (this.actionState === OG_STATE.FLINCH || this.actionState === OG_STATE.SLASH) return;
    this.prevActionState = this.actionState;
    this.prevAnim = this.animation;
    this.prevFrameCounter = this.frameCounter;
    this.actionState = OG_STATE.FLINCH;
    this.startAnim(OG_ANIM.FLINCH_WEAPON);
  }

  /** `NPC.as:760` */
  endFlinch(): void {
    this.actionState = this.prevActionState;
    this.startAnim(this.prevAnim);
    this.frameCounter = this.prevFrameCounter;
  }

  /** `NPC.as:767` */
  isDowned(): boolean {
    const s = this.actionState;
    return s === OG_STATE.DOWNED || s === OG_STATE.KNOCKDOWNED || s === OG_STATE.FLY || s === OG_STATE.VICTIM;
  }

  /** `NPC.as:772` */
  isAirborne(): boolean {
    return this.y < this.world.groundY - OG_NPC_AIRBORNE_ABOVE_GROUND;
  }

  /** `NPC.as:777` — roll each loot row, spill projectiles unless red-frozen, then pay the dialog. */
  createLoot(): void {
    const L = OG_NPC_LOOT;
    let positionX = this.x;
    if (this.isDowned()) {
      if (this.facingRight) positionX -= L.downedOffsetX;
      else positionX += L.downedOffsetX;
    }
    for (const loot of this.reward) {
      const lootType = asInt(loot.id);
      const qty = loot.qty;
      const chance = asInt(loot.chance * L.chancePercent);
      if (chance === L.chancePercent || this.rng() * L.chancePercent < chance) {
        if (!this.world.redFreeze) {
          for (let j = ZERO; j < qty; j++) {
            let movtx = asInt(this.rng() * L.spreadXRange + L.spreadXOffset);
            if (this.posX < L.edgeMargin && movtx < ZERO) movtx *= -ONE;
            else if (this.posX > this.world.stageWidth - L.edgeMargin && movtx > ZERO) movtx *= -ONE;
            const rot = movtx < ZERO ? -L.rotAbs : L.rotAbs;
            const movty =
              lootType === L.type.coin
                ? asInt(-this.rng() * L.coinLiftRange + L.coinLiftBase)
                : asInt(-this.rng() * L.itemLiftRange + L.itemLiftBase);
            this.emit({
              type: 'lootProjectile',
              x: positionX,
              y: this.y - L.spawnAboveY,
              velX: movtx,
              velY: movty,
              rot,
              lootType,
            });
          }
        }
        if (lootType === L.type.coin) {
          this.emit({ type: 'loot', kind: 'coins', amount: L.coinValue * qty, itemId: null, level: this.level });
        } else if (lootType === L.type.bigCoin) {
          this.emit({ type: 'loot', kind: 'coins', amount: L.bigCoinValue * qty, itemId: null, level: this.level });
        } else if (lootType === L.type.questItem) {
          this.emit({ type: 'loot', kind: 'questItem', amount: qty, itemId: null, level: this.level });
        } else if (lootType === L.type.randomItem) {
          this.emit({ type: 'loot', kind: 'randomItem', amount: qty, itemId: null, level: this.level });
        } else {
          this.emit({ type: 'loot', kind: 'itemBasic', amount: qty, itemId: lootType, level: this.level });
        }
      }
    }
  }

  /** `NPC.as:861` */
  rewardXP(): void {
    this.emit({ type: 'xp', amount: Npc.calcXP(this.world.playerLevel, this.level, this.xp, false) });
  }

  /** `NPC.as:866` */
  getLevel(): number {
    return this.level;
  }

  /** `NPC.as:871` — the nameplate colour band. */
  getColorXP(): number {
    const c = OG_NPC_COLOUR_XP;
    const playerLevel = this.world.playerLevel;
    if (this.level >= playerLevel + c.redAbove) return c.bands.red;
    if (this.level >= playerLevel + c.orangeAbove) return c.bands.orange;
    if (this.level >= playerLevel - c.yellowBelow) return c.bands.yellow;
    if (this.level > Npc.getGreyLevel(playerLevel)) return c.bands.green;
    return c.bands.grey;
  }

  /** `NPC.as:893` */
  setFatal(flag: boolean): void {
    this.fatal = flag;
  }

  /** The `death` event, shared with descendants that own their death (`EnemyWolf.as:447`). */
  protected emitDeath(dice: number, downed: boolean): void {
    this.emit({ type: 'death', anim: this.animation, behead: this.behead, downed, dice });
  }

  /** `NPC.as:898` — see the file header for the two dice rolls that are NOT made. */
  override die(): void {
    const D = OG_NPC_DEATH;
    this.emit({ type: 'sound', name: 'die' });
    if (!this.world.playback && !this.dontGiveLoot) {
      this.createLoot();
      this.rewardXP();
    }
    if (this.actionState === OG_STATE.GOTLAUNCHED) {
      this.dead = true;
      return;
    }
    if (this.isDowned()) {
      this.actionState = OG_STATE.DYING;
      this.startAnim(OG_ANIM.DEATHDOWNED);
      this.emitDeath(NO_DICE, true);
      this.dead = true;
      return;
    }
    if (this.animation === OG_ANIM.SEPPUKU_START) {
      this.actionState = OG_STATE.DYING;
      if (!this.behead || this.world.censored) this.startAnim(OG_ANIM.SEPPUKU_MID);
      else this.startAnim(OG_ANIM.SEPPUKU_NOHEAD);
      this.emitDeath(NO_DICE, false);
      this.dead = true;
      return;
    }
    this.y = this.world.groundY;
    this.actionState = OG_STATE.DYING;
    if (this.rng() * D.flipFaceDice < ONE) {
      if (this.isFacingRight()) this.faceLeft();
      else this.faceRight();
    }
    let dice = NO_DICE;
    if (!this.world.censored && this.fatal) {
      if (this.behead) {
        this.startAnim(OG_ANIM.ENEMYDEATHNOHEAD);
      } else {
        dice = Math.floor(this.rng() * D.fatalDice);
        if (dice <= D.plainBelow) {
          this.startAnim(OG_ANIM.ENEMYDEATH);
        } else if (dice === D.forwardAt) {
          this.startAnim(OG_ANIM.DEATH_FORWARD);
        } else if (dice === D.defeatedAt && !this.world.redFreeze) {
          this.startAnim(OG_ANIM.DEFEATED2);
        } else if (dice === D.noHandAt) {
          this.startAnim(OG_ANIM.ENEMYDEATHNOHAND);
        } else if (dice === D.inHalfAt) {
          this.startAnim(OG_ANIM.DEATHINHALF);
        } else {
          this.startAnim(OG_ANIM.ENEMYDEATH);
          if (!this.isPlayer) {
            this.emit({ type: 'flyingWeapon' });
            this.emit({ type: 'flyingHat' });
          }
        }
      }
    } else if (this.behead) {
      this.startAnim(OG_ANIM.ENEMYDEATH);
      if (!this.isPlayer) this.emit({ type: 'flyingHat' });
    } else {
      dice = Math.floor(this.rng() * D.gentleDice);
      if (dice <= D.plainBelow) {
        this.startAnim(OG_ANIM.ENEMYDEATH);
      } else if (dice === D.forwardAt) {
        this.startAnim(OG_ANIM.DEATH_FORWARD);
      } else if (dice === D.defeatedAt && !this.world.redFreeze) {
        this.startAnim(OG_ANIM.DEFEATED2);
      } else {
        this.startAnim(OG_ANIM.ENEMYDEATH);
        this.emit({ type: 'flyingWeapon' });
      }
    }
    this.emitDeath(dice, false);
    this.dead = true;
    this.hideHealthBar();
  }

  /** `NPC.as:1119` — the emitters it destroys are render-side; the countdown is here. */
  override deathAnimEnd(): void {
    this.doDying();
  }

  /** `NPC.as:1146` — 96 frames, fading over the last 12, then gone. Paused by red-freeze. */
  doDying(): void {
    if (this.world.redFreeze) return;
    this.ttl -= ONE;
    if (this.ttl < OG_NPC_FADE_FRAMES) this.alpha = this.ttl / OG_NPC_FADE_FRAMES;
    if (this.ttl <= ZERO) {
      this.visible = false;
      this.disposeMCS();
    }
  }

  /** `NPC.as:1165` — a live body goes dark, a fading one vanishes; airborne and dying keep moving. */
  override redFreeze(): void {
    this.hideHealthBar();
    if (this.alpha < ONE) this.visible = false;
    else this.filter = 'dark';
    const s = this.actionState;
    if (s !== OG_STATE.GOTLAUNCHED && s !== OG_STATE.DYING && s !== OG_STATE.FLY) this.animFrozen = true;
  }

  /** `NPC.as:1182` */
  updateHealthBar(): void {
    if (this.getHP() <= ZERO) this.hideHealthBar();
    else this.showHealthBar();
    this.setHealthBarFraction(this.getHP() / this.maxhp);
  }

  /** `NPC.as:1195` */
  getProgressBar(): { visible: boolean; fraction: number } {
    return this.progressBar;
  }

  /** `NPC.as:1200` */
  changeTarget(npc: NpcTarget): void {
    this.target = npc;
  }

  /** `NPC.as:1205` */
  faceTarget(): void {
    if (this.target === null) return;
    if (this.target.x < this.x) this.faceLeft();
    else this.faceRight();
  }

  /** `NPC.as:1217` — idempotent. */
  disposeMCS(): void {
    if (!this.disposed) this.disposeBody();
  }

  /** `NPC.as:1226` — a local actor has no network identity; `EnemyPlayer` overrides it. */
  getNetworkPlayer(): string {
    return '';
  }

  /** `NPC.as:1231` */
  setScale(num: number): void {
    this.scale = num;
  }
}
