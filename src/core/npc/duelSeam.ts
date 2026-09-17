/**
 * THE DUEL'S INPUTS TO A PORTED ACTOR (seam spike, 2026-09-17).
 *
 * `NpcController` (slice 0) is the adapter that puts an `Npc` behind the
 * existing `OpponentController` seam. It was never runnable in the real game,
 * because an actor is constructed as
 * `new EnemyKatana(world, anims, geometry, rng, target)` and TWO of those five
 * had no implementation anywhere outside a test stub. This file is those two,
 * plus the duel's `NpcWorld`, plus the one factory that assembles them.
 *
 * ⛔ IT MOVES NOTHING. `Sim.ts`, `OpponentController.ts` and `NpcController.ts`
 * are untouched; this only supplies inputs. What it also does is MEASURE — see
 * `DuelHitGeometry`, whose whole point is to prove a claim rather than assert it.
 */
import { DUEL_ENEMY, DUEL_SPAWNS } from '../../config/duel';
import { WORLD_WIDTH } from '../../config/display';
import { ONE, ZERO } from '../../config/nums';
import { OG_ANIM_CLIPS } from '../../config/ogAnimClips';
import { PLAYER_BASE } from '../../config/combat-sim';
import type { OgPart } from '../../config/ogActor';
import { EnemyKatana } from './EnemyKatana';
import { NpcController } from './NpcController';
import type { AnimClip, AnimLibrary, HitGeometry, HitShape, NpcTarget, NpcWorld } from './types';

/**
 * `MCSCharacter.animList`, served from the payload's own clip table.
 *
 * `AnimLibrary` wants exactly `{durationFrames, loop}`, which is exactly what
 * `OG_ANIM_CLIPS` transcribes for all 158 clips the payload defines. A name the
 * payload does not define returns `null`, which is NOT a hole in this adapter:
 * it is the source's own `trace("missing animation")` case, and `startAnim`
 * no-ops on it (`MCSActor.startAnim`). Of the 20 clips `EnemyKatana` names, 17
 * are defined; the 3 that are not (`fly_end`, `getup_front`, `kneegroin_victim`)
 * are reaction clips no duel path reaches.
 */
export class OgAnimLibrary implements AnimLibrary {
  clip(name: string): AnimClip | null {
    return OG_ANIM_CLIPS[name] ?? null;
  }
}

/**
 * THE DUEL'S HIT GEOMETRY — DEGENERATE ON PURPOSE, AND IT SAYS SO.
 *
 * ⚠️ READ THIS BEFORE REUSING IT. It answers "no part" to every question. That
 * is a DECISION, not a stub left unfinished:
 *
 *   - The three methods exist to serve the actor's own hit RECEPTION
 *     (`Npc.checkHit`, `checkHitObject`, `checkHitTrap`, `testHit`) and the one
 *     `gotFlyAway` call that reads `partX`.
 *   - In a duel, none of those run. `Sim.executeStrike` resolves the player's
 *     damage against its OWN `FighterState` and never calls into the actor, so
 *     no per-part question is ever asked. (That the actor therefore never
 *     learns it was hit is the spike's finding, not this class's bug.)
 *
 * So it is correct HERE and wrong everywhere a body can be struck part-by-part.
 * `consulted` is how that stops being a claim: the spike asserts it stays ZERO
 * across a whole fight, so the day a duel path does ask a geometric question,
 * the test that pins it goes red instead of silently getting `null`.
 */
export class DuelHitGeometry implements HitGeometry {
  /** How many geometric questions the duel actually asked. Expected: none. */
  consulted = ZERO;

  partAtPoint(x: number, y: number): OgPart | null {
    void x;
    void y;
    this.consulted += ONE;
    return null;
  }

  partHitBy(thing: HitShape): OgPart | null {
    void thing;
    this.consulted += ONE;
    return null;
  }

  partX(part: OgPart): number {
    void part;
    this.consulted += ONE;
    return ZERO;
  }
}

/**
 * THE DUEL'S `NpcWorld` — all seventeen members, each with the reason it holds
 * the value it holds. (The spike kickoff said ten; the interface has seventeen.)
 *
 * A field fixed for a stated reason is a decision; a field fixed for no reason
 * is a defect. Three kinds appear below:
 *   REAL      — read from the duel's own config, and would change if it changed.
 *   BY DUEL   — constant BECAUSE this is a one-screen 1v1 with no overworld,
 *               no scroll, no room furniture and no replay. A different mode
 *               must supply its own world rather than widen this one.
 *   NOT MODELLED — the subsystem does not exist in this build at all.
 *
 * `nearestEnemy` is left for the factory to fill, because the only opponent in
 * a duel is the controller's `PlayerProxy`, which does not exist yet here.
 */
export function createDuelWorld(): NpcWorld {
  return {
    /** REAL — the duel's single ground band; both fighters spawn on it. */
    groundY: DUEL_SPAWNS.enemy.pos.y,
    /** REAL — the arena is exactly one world-width wide. */
    stageWidth: WORLD_WIDTH,
    /** BY DUEL — the duel arena does not scroll, so map x and screen x are one number. */
    stagePosition: ZERO,
    /** BY DUEL — the kill-cam freeze is the Sim's and the scene's; no actor drives one. */
    redFreeze: false,
    /** REAL — the player's own level, which every XP sum keys off. */
    playerLevel: PLAYER_BASE.stats.level,
    /** NOT MODELLED — this build has no censor toggle. */
    censored: false,
    /** BY DUEL — there is no replay system, so no fight is ever a playback. */
    playback: false,
    /** BY DUEL — the overworld does not exist; animals would wander instead of bite. */
    adventureMode: false,
    /** Filled by `createDuelKatana`: in a duel the only enemy is the player proxy. */
    nearestEnemy: () => null,
    /**
     * BY DUEL — and note WHY it is not merely "no cutscenes": the duel's intro
     * IS an overlay, but the Sim gates it by PHASE (`beginCombat` on
     * `intro-done`) and never polls a controller before FIGHT!, so no actor can
     * act during it. This flag would be a second, redundant gate.
     */
    cutsceneShowing: false,
    /** BY DUEL — no overworld screen fade exists to transition through. */
    transitioning: false,
    /** BY DUEL — the room's aggro switch; a duel is aggro from FIGHT! onward. */
    noAggro: false,
    /** BY DUEL — the arena is empty: there is no room furniture to walk into. */
    npcBlocked: () => false,
    /** REAL — the player's live stats, the numbers friendlies and bosses scale against. */
    playerStats: {
      maxHp: PLAYER_BASE.hp,
      defense: PLAYER_BASE.defense,
      minDamage: PLAYER_BASE.minDamage,
      damageRange: PLAYER_BASE.damageRange,
    },
    /** BY DUEL — a duel is a fight by definition; nobody bows instead of swinging. */
    peaceful: false,
    /** REAL — this is literally duel mode. `EnemySpearElite` is the only reader. */
    duelMode: true,
    /** BY DUEL — the kill-cam belongs to the Sim; an actor never asks for one here. */
    externalRedFreezeCheck: () => undefined,
  };
}

/** Everything the duel needs to drive one ported actor, kept together for the probe. */
export interface DuelNpc {
  readonly actor: EnemyKatana;
  readonly controller: NpcController;
  readonly world: NpcWorld;
  readonly geometry: DuelHitGeometry;
}

/**
 * Assemble ONE `EnemyKatana` behind the `OpponentController` seam.
 *
 * ⚠️ `nearestEnemy` MUST return the controller's proxy. `NPC.as`'s one-second
 * re-target trigger (`checkAITrigger`, every 24 actor steps) reassigns
 * `this.target = world.nearestEnemy(...)` unconditionally, so a world that
 * answers `null` — the obvious first wiring — makes the actor drop its target
 * after one second and freeze for the rest of the fight. The proxy is read back
 * off the actor, which `NpcController`'s constructor has just installed via
 * `changeTarget`; nothing in `NpcController` needs to change for this.
 *
 * The actor's `level` is the duel's. Its `damage` and `hp` are deliberately NOT
 * set: the Sim owns both for its own `FighterState`, and giving the actor a
 * second, unused copy would be exactly the state-schema drift this repo keeps
 * finding. That the actor consequently has no idea how hurt it is IS the
 * finding — see `DIVERGENCES.md`.
 */
export function createDuelKatana(rng: () => number): DuelNpc {
  const world = createDuelWorld();
  const geometry = new DuelHitGeometry();
  const actor = new EnemyKatana(world, new OgAnimLibrary(), geometry, rng, null);
  actor.level = DUEL_ENEMY.level;
  actor.setPosition(DUEL_SPAWNS.enemy.pos.x, DUEL_SPAWNS.enemy.pos.y);
  const controller = new NpcController(actor);
  const proxy: NpcTarget | null = actor.target;
  if (proxy === null) throw new Error('NpcController did not install a target — the seam moved');
  world.nearestEnemy = (): NpcTarget => proxy;
  return { actor, controller, world, geometry };
}
