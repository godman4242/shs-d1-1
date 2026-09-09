/**
 * `MCSActor.as` (1,118 lines), ported — the parent of `NPC`, and through it of
 * every enemy actor AND of the player (`class MCSPlayer extends NPC`,
 * `MCSPlayer.as:3` — measured 2026-09-09; the L4b kickoff drew MCSPlayer as a
 * sibling root, and the source says otherwise).
 *
 * 1,118 lines is mostly TABLE: 429 animation keys and 64 state ids, which now
 * live in `config/ogActor.ts`. What is left is eight fields and sixteen small
 * methods, all here under their source line.
 *
 * FOLDED IN, deliberately: the slice of `MCSCharacter` (`mcs.*`, the 1,500-line
 * display object) that the actor family reads and writes — position, facing,
 * alpha, health bar, and the ANIMATION CLOCK (`startAnim` / `updateAnimation` /
 * `setPose`, `MCSCharacter.as:1280-1345`). Every subclass's `update()` switches
 * on the clip name that clock returns when a clip finishes, so it is gameplay,
 * not rendering. The paperdoll itself, the part clips and their hit geometry are
 * NOT here: they arrive through the `HitGeometry` port (`types.ts`).
 *
 * Naming: the source's `mcs.updateAnimation()` is `stepAnimation()` here, because
 * `NPC.as:272` declares its own public `updateAnimation()` wrapper over it and
 * the two cannot share a name in one class.
 *
 * NOT MODELLED: `StatsManager.multiplier` (`MCSActor.as:1060/:1065` — hp is
 * stored multiplied by a random 2..6 and divided on read; an anti-memory-editor
 * obfuscation with no gameplay effect), `setDisplayName` and the ColorCode
 * filters' pixel maths (a `filter` field records which one is applied).
 */
import { OG_STATE, type OgState } from '../../config/ogActor';
import { OG_ACTOR_HP_DEFAULT } from '../../config/ogNpcBase';
import type { OgNpcMcs } from '../../config/ogNpcs';
import { ONE, ZERO } from '../../config/nums';
import type { AnimClip, AnimLibrary, HitGeometry, NpcEvent, NpcWorld } from './types';

/** AS3 `int` coercion: truncate toward zero; NaN and ±Infinity become 0. */
export function asInt(n: number): number {
  return Number.isFinite(n) ? Math.trunc(n) : ZERO;
}

/** Which `ColorCode` filter the display object currently wears. */
export type ActorFilter = 'none' | 'black' | 'dark';

export class MCSActor {
  // ---- `mcs.*` — the MCSCharacter display state the actor family touches ----
  /** `mcs.x` — SCREEN x (map x minus the stage scroll). */
  x = ZERO;
  /** `mcs.y` — screen y; the ground is `world.groundY`. */
  y = ZERO;
  /** `mcs.scaleX > 0` (`MCSCharacter.as:1460`). */
  facingRight = true;
  /** `setScale` — uniform, both axes. */
  scale = ONE;
  visible = true;
  alpha = ONE;
  filter: ActorFilter = 'none';
  healthBarVisible = false;
  healthBarFraction = ONE;
  healthBarX = ZERO;
  /** `mcs.healthBar.y` — room actors raise it (`RoomGoblin.as:26`, `RoomOgre.as:26`). */
  healthBarY = ZERO;
  /** `mcs.progressBar` — the skill-charge bar; a subclass fills it. */
  readonly progressBar = { visible: false, fraction: ZERO };
  /** `MCSCharacter.as:126` — the current clip's KEY (an `OG_ANIM` value). */
  animation = '';
  /** `MCSCharacter.as:128` */
  frameCounter = ZERO;
  private clip: AnimClip | null = null;
  /** `MCSCharacter.as:122` — `MCSPlayer` flips it; `die()` reads it. */
  readonly isPlayer: boolean = false;
  /** `mcs == null` — `disposeMCS()` ran. Subclass `update()`s return early on it. */
  disposed = false;
  /** The roster's `<mcs>` paperdoll, kept for the render layer (`initMCSFromXML`). */
  paperdoll: OgNpcMcs | null = null;
  /** Whether `addToCanvas` has run and `removeFromCanvas` has not. */
  onCanvas = false;

  // ---- `MCSActor.as:996-1010` ----
  /** `:996` — MAP x. `setPosition`/`movePositionX` keep it and `x` in step. */
  posX = ZERO;
  /** `:998` */
  gotHitFlag = false;
  /** `:1000` */
  private hp: number = OG_ACTOR_HP_DEFAULT;
  /** `:1002` */
  maxhp: number = OG_ACTOR_HP_DEFAULT;
  /** `:1004` */
  dead = false;
  /** `:1006` */
  behead = false;
  /** `:1008` */
  actionState: OgState = OG_STATE.IDLE;
  /** `:1010` */
  animFrozen = false;

  /** Presentation side effects, appended in order; the render layer drains them. */
  readonly events: NpcEvent[] = [];

  constructor(
    readonly world: NpcWorld,
    protected readonly anims: AnimLibrary,
    protected readonly geometry: HitGeometry,
  ) {}

  protected emit(e: NpcEvent): void {
    this.events.push(e);
  }

  /** `MCSActor.as:1017` — item-by-item paperdoll. Render-only; recorded, not drawn. */
  initMCS(paperdoll: OgNpcMcs): void {
    this.paperdoll = paperdoll;
  }

  /** `MCSActor.as:1022` */
  initMCSFromXML(paperdoll: OgNpcMcs): void {
    this.paperdoll = paperdoll;
  }

  /** `MCSActor.as:1027` */
  addToCanvas(): void {
    this.onCanvas = true;
  }

  /** `MCSActor.as:1032` — guarded on `mcs != null` in the source. */
  removeFromCanvas(): void {
    if (!this.disposed) this.onCanvas = false;
  }

  /** `MCSActor.as:1040` — `x` is a MAP x; the screen x subtracts the scroll. */
  setPosition(x: number, y: number): void {
    this.x = x - this.world.stagePosition;
    this.y = y;
    this.posX = x;
  }

  /** `MCSActor.as:1047` */
  movePositionX(dx: number): void {
    this.x += dx;
    this.posX += dx;
  }

  /** `MCSActor.as:1053` */
  getMapPosition(): number {
    return this.posX;
  }

  /** `MCSActor.as:1058` */
  setHP(val: number): void {
    this.hp = val;
  }

  /** `MCSActor.as:1063` */
  getHP(): number {
    return this.hp;
  }

  /**
   * `MCSActor.as:1068` → `MCSCharacter.as:1280-1299`. Same clip again is a no-op;
   * an unknown clip is the source's `trace("missing animation")` and a no-op.
   */
  startAnim(animName: string): void {
    if (this.animation === animName) return;
    const clip = this.anims.clip(animName);
    if (clip === null) return;
    this.animation = animName;
    this.clip = clip;
    this.frameCounter = ZERO;
  }

  /** `MCSActor.as:1073` → `MCSCharacter.as:1275`. */
  getAnim(): string {
    return this.animation;
  }

  /** `MCSCharacter.animList[name]` — the clip's facts, for whoever needs a duration. */
  clipOf(animName: string): AnimClip | null {
    return this.anims.clip(animName);
  }

  /**
   * `MCSCharacter.as:1309-1329`, verbatim — advance the clock one frame and
   * return the clip's key on the frame it FINISHES (non-looping only), else "".
   */
  stepAnimation(): string {
    const clip = this.clip;
    if (clip === null || (!clip.loop && this.frameCounter >= clip.durationFrames)) return '';
    this.frameCounter += ONE;
    if (this.frameCounter < clip.durationFrames) return '';
    if (!(clip.loop && this.frameCounter >= clip.durationFrames)) return this.animation;
    this.frameCounter = ZERO;
    return '';
  }

  /**
   * `MCSCharacter.as:1340` — show one frame of a clip and STOP the clock
   * (`currentAnimation = null`). The source leaves `animation` untouched, and so
   * does this: a following `startAnim` of the same key is still the no-op the
   * source makes it.
   */
  setPose(animName: string, frameNum: number): void {
    void animName;
    this.clip = null;
    this.frameCounter = frameNum;
  }

  /** `MCSCharacter.as:1460` */
  isFacingRight(): boolean {
    return this.facingRight;
  }

  /** `MCSCharacter.as:1465` */
  faceLeft(): void {
    this.facingRight = false;
  }

  /** `MCSCharacter.as:1479` */
  faceRight(): void {
    this.facingRight = true;
  }

  /** `MCSCharacter.as:1419` */
  showHealthBar(): void {
    this.healthBarVisible = true;
  }

  /** `MCSCharacter.as:1433` */
  hideHealthBar(): void {
    this.healthBarVisible = false;
  }

  /** `MCSCharacter.as:1439` — the bar's width is `fraction × 60`, capped at 1. */
  setHealthBarFraction(fraction: number): void {
    this.healthBarFraction = Math.min(fraction, ONE);
  }

  /** `MCSCharacter.as:1448` */
  moveHealthBarX(posx: number): void {
    this.healthBarX = posx;
  }

  /** `MCSActor.as:1078` */
  isDead(): boolean {
    return this.dead;
  }

  /** `MCSActor.as:1083` — `NPC.as:898` overrides this with the whole death. */
  die(): void {
    this.actionState = OG_STATE.DYING;
  }

  /** `MCSActor.as:1088` — empty; `NPC.as:1119` overrides it with the fade. */
  deathAnimEnd(): void {
    // intentionally empty in the source
  }

  /** `MCSActor.as:1092` — kill-cam freeze: black silhouette, clock stopped. */
  redFreeze(): void {
    this.filter = 'black';
    this.animFrozen = true;
  }

  /** `MCSActor.as:1099` */
  unRedFreeze(): void {
    this.animFrozen = false;
  }

  /** `MCSActor.as:1104` — guarded on `mcs != null`. */
  clearFilter(): void {
    if (!this.disposed) this.filter = 'none';
  }

  /** `MCSCharacter.disposeMCS()` — the display object is gone; `mcs = null` follows in callers. */
  protected disposeBody(): void {
    this.disposed = true;
    this.visible = false;
    this.clip = null;
    this.emit({ type: 'dispose' });
  }
}
