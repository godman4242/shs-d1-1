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
  /** `GameEngine.isAdventureMode()` — the overworld: animals wander and do not bite (`EnemyWolf.as:294`). */
  adventureMode: boolean;
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
  /**
   * The PLAYER's live stats, bonuses already summed — `StatsManager.getPlayerStats(STAT_MAXHP)
   * + findBonusStat(STAT_MAXHP)`, the same for `STAT_DEFENSE`, `getMinDamage()`,
   * `getDamageRange()`. The friendlies scale themselves to 0.75 of these
   * (`FriendlyArcher.as:24-29`); the spear boss balances against them (`EnemySpearElite.as:79-123`).
   */
  playerStats: { maxHp: number; defense: number; minDamage: number; damageRange: number };
  /** `StageManager.isPeaceful()` — no fighting; the spear elite bows instead (`EnemySpearElite.as:509`). */
  peaceful: boolean;
  /** `GameEngine.isDuelMode()` — the bow is a duel courtesy (`EnemySpearElite.as:511`). */
  duelMode: boolean;
  /**
   * `NPCManager.externalRedFreezeCheck()` (`NPCManager.as:1651`) — after a FRIENDLY lands a
   * hit, or an elite takes a killing one: the manager decides whether the kill-cam fires
   * and who died. A callback; the Sim or scene decides.
   */
  externalRedFreezeCheck(): void;
}

/** What `MCSPlayer` reads from the static managers beyond `NpcWorld` (L5-OPP slice 3 on). */
export interface PlayerWorld extends NpcWorld {
  /**
   * `StageManager.isBattle()` — false through a duel's intro: `initDuel` sets
   * `STATE_PEACEFUL` (`StageManager.as:231`) and only the third second of the clock, with a
   * latency, flips it to `STATE_BATTLE` (`StageManager.as:865-873`).
   */
  battle: boolean;
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
  /** `Projectile.canBreak()` — a projectile the spear elite's weapon can snap (`EnemySpearElite.as:467-474`). */
  readonly breakable?: boolean;
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
  /** `target.getMCS().isFacingRight()` — the duellist's stroke makers aim behind it (`MCSPlayer.as:4629`). */
  isFacingRight(): boolean;
  isDead(): boolean;
  /** `NPC.isDowned()` — knife, spear, goblin and ogre stab a downed target for double. */
  isDowned(): boolean;
  /** `NPC.isAirborne()` — the spear elite waits out a jumping target (`EnemySpearElite.as:338`). */
  isAirborne(): boolean;
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
  | {
      /**
       * `mcs.setSpeechText(str)` — a speech bubble. `lang` is a `LangManager.getString(id)`
       * id (`EnemyCivilian.as:332-348`); `fox` is the index of one of `EnemyFox.as:59-95`'s
       * nine literal lines, which are third-party lyrics and stay OUT of core — the render
       * layer owns the text (DIVERGENCES, L4b slice 2).
       */
      readonly type: 'speech';
      readonly table: 'lang' | 'fox';
      readonly id: number;
    }
  /** `mcs.setSpeechText("")` — the bubble goes away. */
  | { readonly type: 'speechClear' }
  | {
      /** `ProjectileManager.createArrow(x, y, vx, vy, damage, canLaunch, owner)` — the archer's shot (`EnemyArcher.as:300`). Ints, as the call takes them. */
      readonly type: 'arrow';
      readonly x: number;
      readonly y: number;
      readonly velX: number;
      readonly velY: number;
      readonly damage: number;
      readonly canLaunch: boolean;
    }
  /** `mcs.setProp(itemId)` — the paperdoll's prop slot changes (`EnemyArcher.as:307`: the bow is dropped on death). */
  | { readonly type: 'setProp'; readonly itemId: number }
  /** `Projectile.doBreak()` — the thing that just hit this actor's weapon snaps (`EnemySpearElite.as:472`). */
  | { readonly type: 'breakProjectile' }
  /** `ProjectileManager.createSmoke3(x, y)` — a hidden body shows itself (`MCSPlayer.cancelStealth`, `MCSPlayer.as:4363`). Ints, as the call takes them. */
  | { readonly type: 'smoke'; readonly x: number; readonly y: number }
  | {
      /**
       * `NPCManager.createEnemy(npcID, x, y, fatal)` (`NPCManager.as:869`) — the alpha's
       * howl calls a WOLF (roster id 65) 50 px outside one edge, a coin picking the side
       * (`EnemyWolfAlpha.as:291`/`:295`). The fifth parameter `lvl` defaults to 0 and the
       * alpha does not pass it, so the spawned wolf is never `setLevel`'d.
       *
       * ⚠️ Nothing drains this yet and no adapter can: the seam has no way to ADD an
       * actor mid-fight. DIVERGENCES "L4b (slice 3b)", finding 14.
       */
      readonly type: 'spawn';
      readonly npcId: number;
      readonly x: number;
      readonly y: number;
      readonly fatal: boolean;
    }
  | { readonly type: 'flyingWeapon' }
  | { readonly type: 'flyingHat' }
  | { readonly type: 'dispose' };
