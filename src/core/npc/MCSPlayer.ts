/**
 * `MCSPlayer.as` (4,775 lines), the body the Duel Mode opponent fights with: `EnemyPlayer`
 * extends it, and the AI drives it with the same calls the human's mouse feeds (L5-OPP,
 * ruling R2: one body). Ported slice by slice, on the fields 1b-ii's `DuellistBody` carries:
 * slice 3a, THE STANCE (`canChangeStance`, `setStance`, `getStance`, `initSpecialSkills`,
 * `stopMoving`, `getDamage`, `getBaseDamage`), slice 3b, THE MOVEMENT (`initMove`,
 * `movement`, `movePlayer`, `moveTo`), slice 4a, THE STROKE MAKERS, and slice 4b, THE SLASH
 * START (`initSlash`, `checkNextSlash`, `startSlash`, `cancelStealth`).
 *
 * Android structure, web numbers (ruling R6). Where the builds differ in STRUCTURE the web
 * side is ported, and `docs/DIVERGENCES.md` "L5-OPP SLICE 3a" rules each:
 *   - a stance change in battle costs a flat 48 frames of reload (Android: to a third
 *     above half of `maxreload`, else a sixth off);
 *   - `stopMoving` returns early for a body that cannot change stance (Android stops it);
 *   - `getDamage`'s full-reload bonus is ×1.3 in every stance (Android ×1.5 light, ×1.2 else).
 *   - `initMove` measures before it sets `destX`, from the untruncated point (DIVERGENCES
 *     "L5-OPP SLICE 3b"; the other three movement functions are the same in both builds).
 *   - `initSlash` puts a downstab on the body's side by `posX` (Android: `mcs.x`, the screen
 *     x), and the web `isAirborne` counts FALL (DIVERGENCES "L5-OPP SLICE 4b").
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
  OG_SLASH,
  OG_SLASH_TYPE,
  OG_SPECIAL_SKILL_MASTERY,
  OG_STANCE_CHANGE_RELOAD,
  OG_STANCE_DAMAGE,
  OG_STANCE_REACH,
  OG_STROKE,
} from '../../config/ogMcsPlayer';
import { ONE, ZERO } from '../../config/nums';
import type { Rng } from '../Sim';
import type { DuellistBody } from './duellistBody';
import { asInt } from './MCSActor';
import { Npc } from './Npc';
import type { AnimLibrary, HitGeometry, NpcTarget, PlayerWorld } from './types';

/** A call into an `MCSPlayer` group not ported yet: throws, naming the AS3 function. */
export function unported(fn: string): never {
  throw new Error(`unported: ${fn}`);
}

/** A `flash.geom.Point`: one point of a stroke or a move. */
export interface MovePoint {
  readonly x: number;
  readonly y: number;
}

/** `lineArray[0]`: an AS3 `Vector` read past its end throws a RangeError, so this does too. */
function firstPoint(points: readonly MovePoint[]): MovePoint {
  const p = points[ZERO];
  if (p === undefined) throw new RangeError('gotInput: an empty stroke');
  return p;
}

/** `setStance`'s idle clip per stance (`MCSPlayer.as:3033-3085`). */
const STANCE_IDLE: Readonly<Record<number, string>> = {
  [OG_STANCE.light]: OG_ANIM.IDLE_LIGHT,
  [OG_STANCE.balanced]: OG_ANIM.IDLE_BALANCED,
  [OG_STANCE.heavy]: OG_ANIM.IDLE_HEAVY,
  [OG_STANCE.reversed]: OG_ANIM.IDLE_REVERSED,
  [OG_STANCE.dual]: OG_ANIM.IDLE_DUAL,
};

const T = OG_SLASH_TYPE;

/**
 * `startSlash`'s clip per stance and slash type (`MCSPlayer.as:2540-2675`, web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2612-2747`). A type a stance
 * has no clip for (AIR outside light) leaves the clip as it was, as the source's if-chain does.
 */
const SLASH_CLIP: Readonly<Record<number, Readonly<Record<number, string>>>> = {
  [OG_STANCE.light]: {
    [T.hor]: OG_ANIM.LIGHTSLASH_START, [T.horDown]: OG_ANIM.LIGHTSLASHDOWN_START,
    [T.horUp]: OG_ANIM.LIGHTSLASHUP_START, [T.jump]: OG_ANIM.LIGHTJUMPSLASH_START,
    [T.drop]: OG_ANIM.LIGHTFALLSLASH_START, [T.up]: OG_ANIM.LIGHTJUMPSLASH_START,
    [T.air]: OG_ANIM.LIGHTJUMPSLASH_RISE,
  },
  [OG_STANCE.balanced]: {
    [T.hor]: OG_ANIM.BALANCEDSLASH_START, [T.horDown]: OG_ANIM.BALANCEDSLASHDOWN_START,
    [T.horUp]: OG_ANIM.BALANCEDSLASHUP_START, [T.jump]: OG_ANIM.BALANCEDJUMPSLASH_START,
    [T.drop]: OG_ANIM.BALANCEDFALLSLASH_START, [T.up]: OG_ANIM.BALANCEDJUMPSLASH_START,
  },
  [OG_STANCE.heavy]: {
    [T.hor]: OG_ANIM.HEAVYSLASH_START, [T.horDown]: OG_ANIM.HEAVYSLASHDOWN_START,
    [T.horUp]: OG_ANIM.HEAVYSLASHUP_START, [T.jump]: OG_ANIM.HEAVYJUMPSLASH_START,
    [T.drop]: OG_ANIM.HEAVYFALLSLASH_START, [T.up]: OG_ANIM.HEAVYJUMPSLASH_START,
  },
  [OG_STANCE.dual]: {
    [T.hor]: OG_ANIM.DUALSLASH_START, [T.horDown]: OG_ANIM.DUALSLASHDOWN_START,
    [T.horUp]: OG_ANIM.DUALSLASHUP_START, [T.jump]: OG_ANIM.DUALJUMPSLASH_START,
    [T.drop]: OG_ANIM.DUALFALLSLASH_START, [T.up]: OG_ANIM.DUALJUMPSLASH_START,
  },
  [OG_STANCE.reversed]: {
    [T.hor]: OG_ANIM.REVERSEDSLASH_START, [T.horDown]: OG_ANIM.REVERSEDSLASH_START,
    [T.horUp]: OG_ANIM.REVERSEDSLASH_START, [T.jump]: OG_ANIM.REVERSEDJUMPSLASH_START,
    [T.drop]: OG_ANIM.REVERSEDFALLSLASH_START, [T.up]: OG_ANIM.REVERSEDJUMPSLASH_START,
  },
};

/** `startSlash`'s speed per stance: dual takes heavy's, reversed balanced's. No stance, no speed. */
const SLASH_SPEED: Readonly<Record<number, number>> = {
  [OG_STANCE.light]: OG_SLASH.lightSpeed,
  [OG_STANCE.balanced]: OG_SLASH.balancedSpeed,
  [OG_STANCE.heavy]: OG_SLASH.heavySpeed,
  [OG_STANCE.dual]: OG_SLASH.heavySpeed,
  [OG_STANCE.reversed]: OG_SLASH.balancedSpeed,
};

export class MCSPlayer extends Npc {
  declare readonly world: PlayerWorld;

  /** `MCSPlayer.as:59` */
  slashCommitted = false;
  /** `MCSPlayer.as:75-77` — what `startSlash` rolled, and the shunpo skill's flag (never set before slice 7). */
  slashDamage = ZERO;
  doShunpo = false;
  /** `MCSPlayer.as:85` — an `OG_SLASH_TYPE`. */
  slashType: number = OG_SLASH_TYPE.hor;
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
  slashArray: MovePoint[] = [];
  slashArrayBuffer: MovePoint[] = [];

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

  /** `MCSPlayer.as:2237` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2311`, the same. The opponent passes no offset. */
  lineArrayDeepCopy(lineArray: readonly MovePoint[], offset = ZERO): MovePoint[] {
    return lineArray.map((pt) => ({ x: pt.x + offset, y: pt.y }));
  }

  /**
   * `EnemyPlayer.gotInput` (`EnemyPlayer.as:958`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1008`), the
   * same in both builds and with no `super`: `MCSPlayer`'s own is the human's (`InputManager.as:280`),
   * out of the lane. A stroke while the body is busy is buffered; otherwise it slashes, and a move
   * moves. The source's `mcs == null` clause never holds here (the actor is its own clip), and the
   * unused `posX` parameter is not carried. The move branch also tests GOTLAUNCHED, DOWNED, JUMP
   * and FORWARDROLL (`EnemyPlayer.as:983`); all four already went to the buffer (DOWNED through
   * `isDowned()`), so only FALL (in light stance) is live there. TypeScript refuses three of them;
   * the DOWNED one it accepts, and it is dropped as dead with them.
   */
  gotInput(lineArray: readonly MovePoint[], isLine: boolean): void {
    if (this.getHP() <= ZERO || this.dead) return;
    let line = isLine;
    if (this.world.peaceful) line = false;
    const S = OG_STATE;
    const s = this.actionState;
    if (
      this.slashCommitted || (s === S.FALL && this.stance !== OG_STANCE.light) || s === S.GOTLAUNCHED ||
      this.isDowned() || s === S.JUMP || s === S.FORWARDROLL
    ) {
      if (line) {
        this.slashArrayBuffer = this.lineArrayDeepCopy(lineArray);
        this.hasSlashBuffer = true;
      }
    } else {
      // The source's `else if(!slashCommitted)`: always true here, the first test took it.
      if (line) {
        this.slashArray = this.lineArrayDeepCopy(lineArray);
        this.initSlash(firstPoint(this.slashArray));
      } else if (s !== S.FALL) {
        this.initMove(firstPoint(lineArray));
      }
    }
  }

  /**
   * The WEB `NPC.isAirborne` (`reference/decompiled/shs3_payload/scripts/§1t68s0§.as:793`): FALL counts, on the ground
   * too. Android's (`NPC.as:772`) is height only, as the ported `Npc` is. Neither build's
   * `MCSPlayer` overrides it; the override is here so R6 reaches the duellist without touching
   * the mobs, which wait for the owner's ruling (DIVERGENCES "L5-OPP SLICE 4b").
   */
  override isAirborne(): boolean {
    return this.actionState === OG_STATE.FALL || super.isAirborne();
  }

  /** `MCSPlayer.as:4359` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4728`, the same. */
  cancelStealth(): void {
    if (!this.visible || this.alpha < ONE) {
      this.emit({ type: 'smoke', x: asInt(this.getMapPosition()), y: asInt(this.y) });
    }
    this.visible = true;
    this.alpha = ONE;
  }

  /**
   * WEB `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2475` (Android `MCSPlayer.as:2403`): read the stroke's type
   * from its ends, then slash where it stands or run to it. The one difference: the web puts a
   * downstab on the body's side by `posX`, Android by `mcs.x` (the SCREEN x).
   */
  initSlash(firstPt: MovePoint): void {
    const k = OG_SLASH;
    const S = OG_STATE;
    this.cancelStealth();
    this.destX = this.clampToStage(asInt(firstPt.x));
    this.destY = asInt(firstPt.y);
    this.hasSlash = true;
    this.hasSlashBuffer = false;
    this.slashType = T.hor;
    const lastPt = this.slashArray[this.slashArray.length - ONE];
    if (lastPt === undefined) throw new RangeError('initSlash: an empty slashArray');
    if (this.stance === OG_STANCE.light && this.actionState === S.FALL) {
      this.slashType = this.destY - this.y > k.dropBelow ? T.drop : T.air;
    } else if (this.y - this.destY > k.jumpThreshhold) {
      this.slashType = T.jump;
    } else if (this.canStab && this.destY < lastPt.y && Math.abs(this.destX - lastPt.x) < k.stabSpanX) {
      this.slashType = T.downstab;
    } else if (this.destY - lastPt.y > k.jumpThreshhold && !this.isAirborne()) {
      this.slashType = T.up;
    } else {
      const diff = asInt(this.destY - lastPt.y);
      if (diff > k.tilt) this.slashType = T.horUp;
      else if (diff < -k.tilt) this.slashType = T.horDown;
    }
    if (this.slashType === T.downstab) {
      this.destX = this.clampToStage(this.posX < this.destX ? this.destX - k.downstabShort : this.destX + k.downstabShort);
    }
    if (this.actionState !== S.GOTLAUNCHED && Math.abs(this.destX - this.posX) < k.standingRange) {
      const index = Math.max(ZERO, Math.min(k.lengthThreshhold - ONE, this.slashArray.length - ONE));
      const aim = this.slashArray[index];
      if (aim !== undefined && this.posX < aim.x) this.faceRight();
      else this.faceLeft();
      this.startAction(S.SLASH);
    } else if (this.actionState !== S.FALL) {
      this.startAction(S.RUN);
    }
  }

  /** `destX`'s clamp to the stage, written three times in the source. */
  private clampToStage(x: number): number {
    if (x < ZERO) return ZERO;
    if (x > this.world.stageWidth) return this.world.stageWidth;
    return x;
  }

  /** `MCSPlayer.as:2503` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2575`, the same. The buffer BECOMES `slashArray`, uncopied. */
  checkNextSlash(): void {
    if (this.hasSlash) {
      this.initSlash(firstPoint(this.slashArray));
    } else if (this.hasSlashBuffer) {
      this.slashArray = this.slashArrayBuffer;
      this.initSlash(firstPoint(this.slashArray));
    }
  }

  /**
   * `MCSPlayer.as:2516` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2588`, the same: commit, pick the
   * clip, aim at the stroke's end and set the velocity that reaches it at the stance's speed.
   * A downstab keeps its facing and takes no speed, so `dist / 0` sends its velocity to 0. The
   * `controlledBy == 0` `InputManager.clearCanvas` is the human's.
   */
  startSlash(): void {
    const k = OG_SLASH;
    let slashSpeed = ZERO;
    this.slashCommitted = true;
    const first = firstPoint(this.slashArray);
    const last = this.slashArray[this.slashArray.length - ONE] ?? first;
    if (this.slashType === T.downstab) {
      this.y = this.world.groundY;
      this.startAnim(OG_ANIM.DOWNSTAB);
    } else {
      if (first.x < last.x) this.faceRight();
      else this.faceLeft();
      const clip = SLASH_CLIP[this.stance]?.[this.slashType];
      if (clip !== undefined) this.startAnim(clip);
      slashSpeed = SLASH_SPEED[this.stance] ?? ZERO;
    }
    this.destX = this.clampToStage(asInt(last.x));
    this.destY = last.y > this.world.groundY - k.jumpThreshhold ? this.world.groundY : asInt(last.y);
    const xdiff = asInt(this.destX - this.posX);
    const ydiff = asInt(this.destY - first.y);
    const dist = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    const time = dist / slashSpeed;
    this.velX = asInt(xdiff / time);
    this.velY = asInt(ydiff / time);
    this.slashDamage = this.getDamage();
    if (this.doShunpo) {
      this.setPosition(this.destX, this.destY);
      this.slashDamage *= k.shunpoDamageMult;
      unported('MCSPlayer.endSlash');
    }
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

  /**
   * The target the stroke makers aim at. The source reads `target.…` unguarded (only
   * `slashTarget` checks), so a null target is a TypeError there (#1009), and here.
   */
  private aim(): NpcTarget {
    if (this.target === null) throw new TypeError('the stroke makers read a null target');
    return this.target;
  }

  /**
   * `EnemyPlayer.getTargetPosition` (`EnemyPlayer.as:1194`, web `reference/decompiled/shs3_payload/scripts/§1t122s0§.as:1244`):
   * the target's MAP position. `MCSPlayer`'s own (`MCSPlayer.as:4572`) subtracts the stage
   * position; the opponent never reaches it.
   */
  getTargetPosition(): number {
    return asInt(this.aim().getMapPosition());
  }

  /** `MCSPlayer.as:4577` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4946`, the same: straight up from the target's feet. */
  launchTarget(): void {
    const k = OG_STROKE.launch;
    this.makeSlash(this.getTargetPosition(), asInt(this.aim().y), k.changeX, k.changeY);
  }

  /**
   * The two diagonals' angle: to the target, less 10°. NaN when the two stand on one point.
   * `getMapPosition()` is `:int` in the source (`MCSActor.as:1053`), so it truncates here too.
   */
  private diagonalAngle(): number {
    const t = this.aim();
    return Math.atan(Math.abs(this.y - t.y) / Math.abs(asInt(this.getMapPosition()) - this.getTargetPosition())) -
      OG_STROKE.diagonal.angleOffset;
  }

  /**
   * `MCSPlayer.as:4590` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4959`, the same. The source's x step is
   * `-20 * Math.sin` too, not `cos`: both steps come out equal. Its unused `slashDiag` local is
   * not carried.
   */
  slashDiagonalLeft(): void {
    const k = OG_STROKE.diagonal;
    const angle = this.diagonalAngle();
    this.makeSlash(
      asInt(this.getMapPosition()), asInt(this.y - k.rise),
      asInt(k.leftChangeX * Math.sin(angle)), asInt(k.changeY * Math.sin(angle)),
    );
  }

  /** `MCSPlayer.as:4606` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4975`, the same. */
  slashDiagonalRight(): void {
    const k = OG_STROKE.diagonal;
    const angle = this.diagonalAngle();
    this.makeSlash(
      asInt(this.getMapPosition()), asInt(this.y - k.rise),
      asInt(k.rightChangeX * Math.cos(angle)), asInt(k.changeY * Math.sin(angle)),
    );
  }

  /** `MCSPlayer.as:4622` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:4991`, the same: down, from behind the target. */
  stabTarget(): void {
    const k = OG_STROKE.stab;
    const t = this.aim();
    const startX = t.isFacingRight() ? this.getTargetPosition() - k.behind : this.getTargetPosition() + k.behind;
    const endY = asInt(t.y + k.below);
    this.makeSlash(startX, asInt(endY - this.slashLength / k.lengthDiv), k.changeX, k.changeY);
  }

  /** `MCSPlayer.as:4644` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5013`, the same. */
  slashTarget(): void {
    const t = this.target;
    if (t === null) return;
    const k = OG_STROKE.slash;
    const far = (this.slashLength * k.far.num) / k.far.den;
    const near = this.slashLength / k.nearDiv;
    const startY = asInt(t.y - k.rise);
    if (t.x < this.x) {
      const startX = asInt(this.getTargetPosition() + (t.isFacingRight() ? far : near));
      this.makeSlash(startX, startY, -k.changeX, k.changeY);
    } else {
      const startX = asInt(this.getTargetPosition() - (t.isFacingRight() ? near : far));
      this.makeSlash(startX, startY, k.changeX, k.changeY);
    }
  }

  /** `MCSPlayer.as:4687` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5056`, the same: flat, through the point behind the target. */
  slashDownedTarget(): void {
    const k = OG_STROKE.downed;
    const t = this.aim();
    const targetX = t.isFacingRight() ? this.getTargetPosition() - k.behind : this.getTargetPosition() + k.behind;
    const startY = asInt(t.y - k.rise);
    const half = this.slashLength / k.lengthDiv;
    if (targetX < this.posX) this.makeSlash(asInt(targetX + half), startY, -k.changeX, k.changeY);
    else this.makeSlash(asInt(targetX - half), startY, k.changeX, k.changeY);
  }

  /**
   * `MCSPlayer.as:4719` · web `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:5088`, the same: `int(slashLength / 20)`
   * points (the first always), handed to `gotInput` as a stroke. The `controlledBy == 0`
   * `drawLine` is the human's.
   */
  makeSlash(startX: number, startY: number, changeX: number, changeY: number): void {
    this.inputArray.length = ZERO;
    const pointsmax = asInt(this.slashLength / OG_STROKE.pointGap);
    this.inputArray.push({ x: startX, y: startY });
    for (let i = ONE; i < pointsmax; i += ONE) {
      this.inputArray.push({ x: startX + i * changeX, y: startY + i * changeY });
    }
    this.gotInput(this.inputArray, true);
  }
}
