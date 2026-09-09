/**
 * THE PORTS OF THE NPC FAMILY (lane L4b, slice 0).
 *
 * `NPC.as` reaches into eight Flash singletons — `StageManager`, `StatsManager`,
 * `NPCManager`, `ProjectileManager`, `ParticleSystemManager`, `SoundManager`,
 * `OverworldHUD`, `GameEngine` — and into its `MCSCharacter` display object for
 * per-part hit tests. `src/core/` is framework-free and owns no display list, so
 * every one of those reaches becomes exactly one of the things below:
 *
 *   - a READ of the world  → `NpcWorld`      (ground Y, stage width, red-freeze…)
 *   - a QUESTION about geometry → `HitGeometry` (which paperdoll part is at x,y)
 *   - a QUESTION about the target → `NpcTarget`
 *   - a SIDE EFFECT on the presentation → `NpcEvent`, appended to the actor's
 *     event list for the render layer to drain (floating text, loot, sounds…)
 *
 * Nothing here is a number. The core's numeric literal count stays zero.
 */
import type { OgPart } from '../../config/ogActor';
import type { MCSActor } from './MCSActor';
import type { NpcDamage } from './NpcDamage';

/** One clip's playback facts — what `MCSCharacter.startAnim` reads from `animList`. */
export interface AnimClip {
  readonly durationFrames: number;
  readonly loop: boolean;
}

/** `MCSCharacter.animList` — `null` is the source's `trace("missing animation")` case. */
export interface AnimLibrary {
  clip(name: string): AnimClip | null;
}

/**
 * The world facts `NPC.as` reads from static managers, injected so a test or the
 * Sim adapter can set them. Mutable on purpose: the original re-reads them every
 * call, so the holder may change them between frames.
 */
export interface NpcWorld {
  /** `StageManager.getGroundY()` */
  groundY: number;
  /** `StageManager.getGameStageWidth()` */
  stageWidth: number;
  /** `StageManager.getStagePosition()` — scroll offset; screen x = map x − this. */
  stagePosition: number;
  /** `StageManager.isRedFreeze()` — the kill-cam freeze. */
  redFreeze: boolean;
  /** `StatsManager.getLevel()` — the PLAYER's level, which XP maths key off. */
  playerLevel: number;
  /** `StatsManager.censored` — no blood, no dismemberment deaths. */
  censored: boolean;
  /** `GameEngine.isPlayback()` — replays pay no loot or XP. */
  playback: boolean;
  /** `NPCManager.getNearestEnemy(x, isEnemy)` — who to fight next. */
  nearestEnemy(fromMapX: number, isEnemy: boolean): NpcTarget | null;
  /** `CutsceneManager.isShowing()` — room actors do not wander or aggro under a cutscene. */
  cutsceneShowing: boolean;
  /** `OverworldHUD.screenTransition.isTransitioning()` — no aggro mid-fade. */
  transitioning: boolean;
  /** `OverworldHUD.duelmodeUI.noAggro` — the room's aggro switch. */
  noAggro: boolean;
  /** `GameStage.isNPCBlocked(x, facingRight)` — room furniture within 50 px in the walk direction. */
  npcBlocked(screenX: number, facingRight: boolean): boolean;
}

/**
 * A thing that may be touching this actor — an attacker's paperdoll part
 * (`mcs.partList[PART_weapon]`), a trap clip, a projectile. The core never
 * inspects it; the geometry port resolves it.
 */
export interface HitShape {
  readonly kind: 'part' | 'other';
  readonly part: OgPart | null;
  readonly owner: MCSActor | null;
}

/**
 * `mcs.partList[i].hitTestPoint / hitTestObject`, asked top-down (the source scans
 * `partList` from the LAST index). The port answers with the first part hit, or
 * `null` for a miss. `partX` is the hit part's own x — `gotFlyAway` reads it.
 */
export interface HitGeometry {
  partAtPoint(x: number, y: number): OgPart | null;
  partHitBy(thing: HitShape): OgPart | null;
  partX(part: OgPart): number;
}

/** What an actor needs from whatever it is fighting. `Npc` satisfies it itself. */
export interface NpcTarget {
  /** Screen position (`target.mcs.x` / `.y`). */
  readonly x: number;
  readonly y: number;
  getMapPosition(): number;
  isDead(): boolean;
  /** `NPC.isDowned()` — knife, spear, goblin and ogre stab a downed target for double. */
  isDowned(): boolean;
  /** The attacker asks its target to test one of the ATTACKER's parts against the target's body. */
  checkHitObject(thing: HitShape, damage: NpcDamage, checkByAttacker?: boolean): boolean;
}

/** A presentation side effect the actor asks for. Drained by the render layer. */
export type NpcEvent =
  | { readonly type: 'sound'; readonly name: 'hit' | 'die' }
  | {
      readonly type: 'floatingText';
      readonly x: number;
      readonly y: number;
      readonly text: string;
      readonly colour: number;
    }
  | {
      readonly type: 'lootProjectile';
      readonly x: number;
      readonly y: number;
      readonly velX: number;
      readonly velY: number;
      readonly rot: number;
      readonly lootType: number;
    }
  | {
      readonly type: 'loot';
      readonly kind: 'coins' | 'questItem' | 'randomItem' | 'itemBasic';
      readonly amount: number;
      readonly itemId: number | null;
      readonly level: number;
    }
  | { readonly type: 'xp'; readonly amount: number }
  | {
      /** `die()` chose a death. `dice` is the roll that chose `anim` (−1 when no roll). */
      readonly type: 'death';
      readonly anim: string;
      readonly behead: boolean;
      readonly downed: boolean;
      readonly dice: number;
    }
  | { readonly type: 'flyingWeapon' }
  | { readonly type: 'flyingHat' }
  | { readonly type: 'dispose' };
