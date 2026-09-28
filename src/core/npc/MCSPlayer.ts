/**
 * `MCSPlayer.as` (4,775 lines), the body the Duel Mode opponent fights with: `EnemyPlayer`
 * extends it, and the AI drives it with the same calls the human's mouse feeds (L5-OPP,
 * ruling R2: one body). Ported slice by slice, on the fields 1b-ii's `DuellistBody` carries:
 * slice 3a, THE STANCE (`canChangeStance`, `setStance`, `getStance`, `initSpecialSkills`,
 * `stopMoving`, `getDamage`, `getBaseDamage`) and slice 3b, THE MOVEMENT (`initMove`,
 * `movement`, `movePlayer`, `moveTo`).
 *
 * Android structure, web numbers (ruling R6). Where the builds differ in STRUCTURE the web
 * side is ported, and `docs/DIVERGENCES.md` "L5-OPP SLICE 3a" rules each:
 *   - a stance change in battle costs a flat 48 frames of reload (Android: to a third
 *     above half of `maxreload`, else a sixth off);
 *   - `stopMoving` returns early for a body that cannot change stance (Android stops it);
 *   - `getDamage`'s full-reload bonus is ×1.3 in every stance (Android ×1.5 light, ×1.2 else).
 *   - `initMove` measures before it sets `destX`, from the untruncated point (DIVERGENCES
 *     "L5-OPP SLICE 3b"; the other three movement functions are the same in both builds).
 *
 * Only the opponent's path is ported: `controlledBy == 1` (`DuelModeUI.as:381`). The human's
 * branches (`controlledBy` 0 or 2: the UI calls, the network, `initSpecialSkills`' skill-id
 * branch) are out of the lane; `nextStance` is too, because only the human's UI calls it
 * (`BattleUI.as:364`, `InputManager.as:601`).
 *
 * THE HARNESS RULE (L5_OPPONENT_KICKOFF §3): a call into a group not ported yet goes through
 * `unported()`, which THROWS, so a test that reaches it fails loudly rather than no-oping.
 * The count of those sites is pinned in `tests/mcsPlayer.test.ts` and only goes down.
 *
 * AS3 stores every one of these into an `int`, so each result is truncated (`asInt`).
 */
import { OG_ANIM, OG_STATE, type OgState } from '../../config/ogActor';
import { OG_NO_STANCE, OG_STANCE } from '../../config/ogDuellistProfile';
import {
  OG_MOVE_DIST_SQ,
  OG_SPECIAL_SKILL_MASTERY,
  OG_STANCE_CHANGE_RELOAD,
  OG_STANCE_DAMAGE,
  OG_STANCE_REACH,
} from '../../config/ogMcsPlayer';
import { ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import type { DuellistBody } from './duellistBody';
import { asInt } from './MCSActor';
import { Npc } from './Npc';
import type { AnimLibrary, HitGeometry, PlayerWorld } from './types';

/** A call into an `MCSPlayer` group not ported yet: throws, naming the AS3 function. */
export function unported(fn: string): never {
  throw new Error(`unported: ${fn}`);
}

/** A `flash.geom.Point`: one point of a stroke or a move. */
export interface MovePoint {
  readonly x: number;
  readonly y: number;
}

/** `setStance`'s idle clip per stance (`MCSPlayer.as:3033-3085`). */
const STANCE_IDLE: Readonly<Record<number, string>> = {
  [OG_STANCE.light]: OG_ANIM.IDLE_LIGHT,
  [OG_STANCE.balanced]: OG_ANIM.IDLE_BALANCED,
  [OG_STANCE.heavy]: OG_ANIM.IDLE_HEAVY,
  [OG_STANCE.reversed]: OG_ANIM.IDLE_REVERSED,
  [OG_STANCE.dual]: OG_ANIM.IDLE_DUAL,
};

export class MCSPlayer extends Npc {
  declare readonly world: PlayerWorld;

  /** `MCSPlayer.as:59` */
  slashCommitted = false;
  /** `MCSPlayer.as:69-71` */
  minDamage: number;
  damageRange: number;
  /** `MCSPlayer.as:79` — the web build starts it at -1 (`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:81`); `init` sets it. */
  stance: number = OG_NO_STANCE;
  /** `MCSPlayer.as:81` — always 0 on the duellist (1b-ii). */
  STAT_CRITICALDMG: number;
  /** `MCSPlayer.as:91-93` — frames. */
  reload: number;
  maxreload: number;
  /** `MCSPlayer.as:97` — the reach `setStance` derives. */
  slashLength = ZERO;
  /** `MCSPlayer.as:107` */
  baseSlashLength: number;
  /** `MCSPlayer.as:109-113` */
  lightMastery: number;
  balancedMastery: number;
  heavyMastery: number;
  /** `MCSPlayer.as:117-127` — the special moves `initSpecialSkills` unlocks. */
  canLaunch = false;
  canStab = false;
  canFlipUp = false;
  canAirCombo = false;
  canDeflect = false;
  /** The move target and the slash buffer `stopMoving` clears (slice 3b / 4 own them). */
  destX = ZERO;
  destY = ZERO;
  hasSlash = false;
  hasSlashBuffer = false;
  inputArray: MovePoint[] = [];

  /** `EnemyPlayer.init`'s body (slice 1b-ii); `init`'s closing `setStance` is the caller's. */
  constructor(world: PlayerWorld, anims: AnimLibrary, geometry: HitGeometry, rng: Rng, body: DuellistBody) {
    super(world, anims, geometry, rng);
    this.minDamage = body.minDamage;
    this.damageRange = body.damageRange;
    this.STAT_CRITICALDMG = body.criticalDmg;
    this.reload = body.reload;
    this.maxreload = body.maxReload;
    this.baseSlashLength = body.baseSlashLength;
    this.lightMastery = body.lightMastery;
    this.balancedMastery = body.balancedMastery;
    this.heavyMastery = body.heavyMastery;
  }

  /** `MCSPlayer.startAction` (671 lines) is slice 5. */
  override startAction(actionState: OgState): void {
    void actionState;
    unported('MCSPlayer.startAction');
  }

  /** `MCSPlayer.as:2965` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3043`, the same. */
  canChangeStance(): boolean {
    const S = OG_STATE;
    const s = this.actionState;
    const p = this.prevActionState;
    return (
      s === S.IDLE || s === S.POSE || s === S.RUN || s === S.WALK || s === S.SKILL_CHICHARGE ||
      (s === S.FLINCH && (p === S.IDLE || p === S.POSE || p === S.RUN || p === S.WALK))
    );
  }

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2439` (Android `MCSPlayer.as:2363`). The web guard also returns for a
   * body that cannot change stance, and the web `destY` is the ground (Android: `mcs.y`).
   * The `informNetwork` argument only reaches `controlledBy == 0`, so it is not carried.
   */
  stopMoving(): void {
    if (this.actionState === OG_STATE.IDLE || !this.canChangeStance()) return;
    this.destX = this.posX;
    this.destY = this.world.groundY;
    this.hasSlash = false;
    this.hasSlashBuffer = false;
    this.startAction(OG_STATE.IDLE);
    unported('StageManager.clearInteractTarget');
  }

  /** WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3083` (Android `MCSPlayer.as:3019`). */
  setStance(num: number): void {
    const battle = this.world.battle;
    this.stance = num;
    if (battle) this.stopMoving();
    this.slashCommitted = false;
    const r = OG_STANCE_REACH;
    const base = this.baseSlashLength;
    switch (this.stance) {
      case OG_STANCE.light:
        this.slashLength = asInt(base * r.lightMult);
        break;
      case OG_STANCE.balanced:
        this.slashLength = asInt(base * (r.balanced.base + r.balanced.perMastery * this.balancedMastery * r.balanced.scale));
        break;
      case OG_STANCE.heavy:
        this.slashLength = asInt(base * (r.heavy.base + r.heavy.perMastery * this.heavyMastery * r.heavy.scale));
        if (this.slashLength < r.floor) this.slashLength = r.floor;
        break;
      case OG_STANCE.reversed:
        this.slashLength = asInt(base * r.reversedMult);
        break;
      case OG_STANCE.dual:
        this.slashLength = base;
        if (this.slashLength < r.floor) this.slashLength = r.floor;
        break;
    }
    const idle = STANCE_IDLE[this.stance];
    if (battle && idle !== undefined) this.startAnim(idle);
    if (battle) {
      this.reload -= OG_STANCE_CHANGE_RELOAD.cost;
      if (this.reload < OG_STANCE_CHANGE_RELOAD.floor) this.reload = OG_STANCE_CHANGE_RELOAD.floor;
    }
    this.initSpecialSkills();
  }

  /** `MCSPlayer.as:3122` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3179` */
  getStance(): number {
    return this.stance;
  }

  /** `MCSPlayer.as:3127` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3184`: the AI's branch (from `MCSPlayer.as:3164` / web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3221`). */
  initSpecialSkills(): void {
    const m = OG_SPECIAL_SKILL_MASTERY;
    if (this.stance === OG_STANCE.light) {
      this.canLaunch = this.lightMastery >= m.light.launch;
      this.canDeflect = this.lightMastery >= m.light.deflect;
      this.canAirCombo = this.lightMastery >= m.light.airCombo;
      this.canFlipUp = false;
      this.canStab = false;
    } else if (this.stance === OG_STANCE.balanced) {
      this.canFlipUp = this.balancedMastery >= m.balanced.flipUp;
      this.canDeflect = this.balancedMastery >= m.balanced.deflect;
      this.canLaunch = this.balancedMastery >= m.balanced.launch;
      this.canStab = false;
      this.canAirCombo = false;
    } else if (this.stance === OG_STANCE.heavy) {
      this.canLaunch = this.heavyMastery >= m.heavy.launch;
      this.canDeflect = this.heavyMastery >= m.heavy.deflect;
      this.canStab = this.heavyMastery >= m.heavy.stab;
      this.canFlipUp = false;
      this.canAirCombo = false;
    } else if (this.stance === OG_STANCE.reversed || this.stance === OG_STANCE.dual) {
      this.canStab = true;
      this.canDeflect = true;
      this.canLaunch = true;
      this.canFlipUp = true;
      this.canAirCombo = true;
    }
  }

  /** WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255` (Android `MCSPlayer.as:3198`); `rng` stands in for `Math.random()`. */
  getDamage(): number {
    const d = OG_STANCE_DAMAGE;
    let maxDamage = ZERO;
    // Inlined as the source does. `EnemyPlayer` overrides BOTH getters for a boss (`minDamage`):
    // `getDamage` in both builds (`EnemyPlayer.as:1199`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1249`),
    // `getBaseDamage` in the web only (`reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1258`). Slice 7 carries them.
    const baseDamage = asInt(this.minDamage + this.rng() * this.damageRange);
    switch (this.stance) {
      case OG_STANCE.light:
        maxDamage = asInt(baseDamage * (d.light.base + d.light.perMastery * this.lightMastery * d.light.scale));
        break;
      case OG_STANCE.balanced:
        maxDamage = asInt(baseDamage * (d.balanced.base + d.balanced.perMastery * this.balancedMastery * d.balanced.scale));
        break;
      case OG_STANCE.heavy:
      case OG_STANCE.dual:
      case OG_STANCE.reversed:
        maxDamage = asInt(baseDamage * d.otherMult);
        break;
    }
    if (this.reload === this.maxreload) return asInt(maxDamage * d.critMult + this.STAT_CRITICALDMG);
    return maxDamage;
  }

  /** `MCSPlayer.as:3226` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3279`, the same. */
  getBaseDamage(): number {
    return asInt(this.minDamage + this.rng() * this.damageRange);
  }

  /**
   * The opponent's `gotInput` is `EnemyPlayer`'s override (`EnemyPlayer.as:958`, web
   * `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1008`), which calls no `super`: slice 4. `MCSPlayer`'s own is the human's
   * (`InputManager.as:280`), out of the lane.
   */
  gotInput(lineArray: MovePoint[], isLine: boolean): void {
    void lineArray;
    void isLine;
    unported('EnemyPlayer.gotInput');
  }

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2394` (Android `MCSPlayer.as:2318`). The web
   * measures `int(posX - dest.x)` and only then sets `destX`; Android sets `destX` first, so a
   * move refused in adventure mode still moves it, and measures from the truncated `destX`.
   */
  initMove(dest: MovePoint): void {
    const s = this.actionState;
    const dist = asInt(this.posX - dest.x);
    if (
      this.world.adventureMode &&
      (dist * dist < OG_MOVE_DIST_SQ.adventureMin || s === OG_STATE.JUMP || s === OG_STATE.FALL ||
        this.isDowned() || this.isAirborne() || s === OG_STATE.GOTLAUNCHED)
    ) return;
    this.destX = asInt(dest.x);
    if (this.destX < ZERO) this.destX = ZERO;
    else if (this.destX > this.world.stageWidth) this.destX = this.world.stageWidth;
    this.destY = asInt(dest.y);
    this.hasSlash = false;
    this.hasSlashBuffer = false;
    this.startAction(dist * dist <= OG_MOVE_DIST_SQ.walkMax ? OG_STATE.WALK : OG_STATE.RUN);
  }

  /** `MCSPlayer.as:2890` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2968`, the same. False once it arrives. */
  movement(speed: number): boolean {
    if (this.posX - this.destX < -speed) {
      this.faceRight();
      this.velX = speed;
    } else {
      if (this.posX - this.destX <= speed) {
        this.movePlayer(this.destX - this.posX);
        return false;
      }
      this.faceLeft();
      this.velX = -speed;
    }
    this.movePlayer(this.velX);
    return true;
  }

  /**
   * `MCSPlayer.as:2921` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2999`, the same: clamp to the stage,
   * then the `controlledBy != 0` branch. The rest (the stage scroll, the minimap) is the human's.
   */
  movePlayer(dist: number): void {
    let d = dist;
    if (this.posX + d < ZERO) d -= this.posX + d;
    else if (this.posX + d > this.world.stageWidth) d -= this.posX + d - this.world.stageWidth;
    this.movePositionX(d);
  }

  /** `MCSPlayer.as:4565` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4934`, the same. The parameters are `int`s. */
  moveTo(posX: number, posY: number): void {
    this.inputArray.length = ZERO;
    this.inputArray.push({ x: asInt(posX), y: asInt(posY) });
    this.gotInput(this.inputArray, false);
  }
}
