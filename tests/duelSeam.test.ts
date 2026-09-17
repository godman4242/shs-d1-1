/**
 * THE SEAM SPIKE — DOES A PORTED ACTOR ACTUALLY FIGHT IN THE DUEL?
 *
 * 21 enemy classes were ported and none of them were in the game, because two
 * of the five constructor arguments (`AnimLibrary`, `HitGeometry`) had no
 * implementation outside a test stub. `src/core/npc/duelSeam.ts` is those two
 * plus the duel's `NpcWorld`; this file is the measurement that turns "it is
 * wired" into an answer.
 *
 * The probe suite at the bottom drives the REAL `Sim` through the REAL
 * `duelSetup` — not a synthetic spawn — so what it reports is what the shipped
 * duel does, and each finding it pins is a numbered row in `docs/DIVERGENCES.md`.
 */
import { describe, expect, it } from 'vitest';
import { AI_MELEE_RANGE } from '../src/config/ai';
import { DUEL_SPAWNS } from '../src/config/duel';
import { OG_ANIM } from '../src/config/ogActor';
import { OG_ANIMS } from '../src/config/ogAnims';
import { OG_ANIM_CLIPS } from '../src/config/ogAnimClips';
import { OG_KATANA } from '../src/config/ogEnemyKatana';
import { OG_STATE } from '../src/config/ogActor';
import { duelSetup } from '../src/core/duelSetup';
import { mulberry32 } from '../src/core/rng';
import { Sim } from '../src/core/Sim';
import { DrawnStroke } from '../src/core/DrawnStroke';
import {
  createDuelKatana,
  createDuelWorld,
  DuelHitGeometry,
  OgAnimLibrary,
} from '../src/core/npc/duelSeam';

describe('OgAnimLibrary — the AnimLibrary the actor family never had', () => {
  const anims = new OgAnimLibrary();

  it('serves the two clips the duel actually needs, with the payload\'s own facts', () => {
    expect(anims.clip(OG_ANIM.KATANAWALK)).toEqual({ durationFrames: 20, loop: true });
    expect(anims.clip(OG_ANIM.KATANAATTACK)).toEqual({ durationFrames: 10, loop: false });
  });

  it('returns null for a name the payload does not define — the source\'s own miss', () => {
    // `fly_end` is in the AS3 `OG_ANIM` table but not in this payload; the
    // source traces "missing animation" and startAnim no-ops. Faithful, not a gap.
    expect(OG_ANIM.FLY_END in OG_ANIM_CLIPS).toBe(false);
    expect(anims.clip(OG_ANIM.FLY_END)).toBeNull();
  });

  it('agrees with OG_ANIMS on every clip the two tables share', () => {
    // Two transcriptions of one payload must never drift (the repo's
    // state-schema-drift killer). Import one from the other is impossible —
    // they carry different fields — so this pins them instead.
    for (const [name, anim] of Object.entries(OG_ANIMS)) {
      const clip = OG_ANIM_CLIPS[name];
      expect(clip, `${name} missing from OG_ANIM_CLIPS`).toBeDefined();
      expect(clip?.durationFrames, `${name} duration`).toBe(anim.durationFrames);
      expect(clip?.loop, `${name} loop`).toBe(anim.loop);
    }
  });
});

describe('createDuelWorld — seventeen members, each fixed for a stated reason', () => {
  const world = createDuelWorld();

  it('carries every member the NpcWorld port declares', () => {
    // ⚠️ SEVENTEEN, not the ten the spike kickoff claimed. Counted from the
    // interface; a member added upstream must fail here rather than arrive
    // as `undefined` in a live fight.
    expect(Object.keys(world).sort()).toEqual(
      [
        'adventureMode', 'censored', 'cutsceneShowing', 'duelMode', 'externalRedFreezeCheck',
        'groundY', 'nearestEnemy', 'noAggro', 'npcBlocked', 'peaceful', 'playback',
        'playerLevel', 'playerStats', 'redFreeze', 'stagePosition', 'stageWidth', 'transitioning',
      ].sort(),
    );
  });

  it('is a duel: duelMode on, adventure/peaceful/cutscene off, ground on the spawn band', () => {
    expect(world.duelMode).toBe(true);
    expect(world.adventureMode).toBe(false);
    expect(world.peaceful).toBe(false);
    expect(world.cutsceneShowing).toBe(false);
    expect(world.groundY).toBe(DUEL_SPAWNS.enemy.pos.y);
  });
});

describe('createDuelKatana — the wiring trap the obvious version falls into', () => {
  it('points nearestEnemy at the controller\'s own proxy', () => {
    const { actor, world } = createDuelKatana(mulberry32(1));
    expect(actor.target).not.toBeNull();
    expect(world.nearestEnemy(actor.getMapPosition(), true)).toBe(actor.target);
  });

  it('keeps its target across the one-second re-target that a null world would eat', () => {
    // `NPC.checkAITrigger` fires every 24 actor steps and reassigns
    // `target = world.nearestEnemy(...)` unconditionally. A world answering
    // null — the first thing anyone writes — freezes the actor after one
    // second. Stepping past 24 is what proves this wiring survives it.
    const { actor, controller } = createDuelKatana(mulberry32(1));
    const view = {
      playerPos: { x: DUEL_SPAWNS.player.pos.x, y: DUEL_SPAWNS.player.pos.y },
      enemyPos: { x: DUEL_SPAWNS.enemy.pos.x, y: DUEL_SPAWNS.enemy.pos.y },
      playerStance: 'balanced' as const,
      enemyStance: 'balanced' as const,
      enemyFocus: 0,
      playerJumping: false,
    };
    // 90 sim ticks = 36 actor steps: past the 24-step trigger, twice over.
    for (let i = 0; i < 90; i++) controller.next(i, view);
    expect(actor.target).not.toBeNull();
  });
});

describe('DuelHitGeometry — degenerate, and it counts every question asked', () => {
  it('answers no part to everything and records that it was asked', () => {
    const g = new DuelHitGeometry();
    expect(g.consulted).toBe(0);
    expect(g.partAtPoint(1, 2)).toBeNull();
    expect(g.partHitBy({ kind: 'part', part: null, owner: null })).toBeNull();
    expect(g.partX(0)).toBe(0);
    expect(g.consulted).toBe(3);
  });
});

/**
 * ─────────────────────── THE SPIKE PROBE ───────────────────────
 * One `EnemyKatana`, the real `duelSetup`, the real `Sim`. Everything below is
 * a MEASUREMENT of the shipped duel, and every `expect` is a finding.
 */
describe('SPIKE: an EnemyKatana in the real duel', () => {
  /** Run the real duel to a decision, recording what the seam carried. */
  const runDuel = (seed: number, maxTicks = 20000) => {
    const rng = mulberry32(seed);
    const npc = createDuelKatana(rng);
    const sim = new Sim(rng, duelSetup(npc.controller));
    sim.beginCombat();
    const startX = sim.enemy.pos.x;
    let telegraphs = 0;
    let firstTelegraphMs: number | null = null;
    let playerDamageEvents = 0;
    let firstStrikeGapX: number | null = null;
    let closestGapX = Infinity;
    const states = new Set<number>();
    let ticks = 0;
    for (; ticks < maxTicks && sim.phase === 'fighting'; ticks++) {
      const gap = Math.abs(sim.enemy.pos.x - sim.player.pos.x);
      if (gap < closestGapX) closestGapX = gap;
      sim.tick();
      states.add(npc.actor.actionState);
      for (const ev of sim.drainEvents()) {
        if (ev.type === 'enemyTelegraph') {
          telegraphs += 1;
          firstTelegraphMs ??= ev.durationMs;
        }
        if (ev.type === 'damage' && ev.target === 'player') {
          playerDamageEvents += 1;
          firstStrikeGapX ??= gap;
        }
      }
    }
    return {
      sim, npc, ticks, telegraphs, firstTelegraphMs, playerDamageEvents,
      firstStrikeGapX, closestGapX, states,
      movedX: sim.enemy.pos.x - startX,
    };
  };

  it('APPROACHES: the actor walks itself at the player, through the Sim', () => {
    const r = runDuel(7);
    // The enemy spawns right of the player, so closing is a NEGATIVE dx.
    expect(r.movedX).toBeLessThan(0);
    expect(r.closestGapX).toBeLessThan(DUEL_SPAWNS.enemy.pos.x - DUEL_SPAWNS.player.pos.x);
  });

  it('TELEGRAPHS: entering ATTACK_STATE becomes a windup the scene can draw', () => {
    const r = runDuel(7);
    expect(r.telegraphs).toBeGreaterThan(0);
    expect(r.states.has(OG_STATE.ATTACK)).toBe(true);
    expect(r.states.has(OG_STATE.WALK)).toBe(true);
    // ⚠️ AND ITS LENGTH IS THE PAYLOAD'S, not a number anyone chose: the
    // `katanaattack` clip is 10 frames at the original's 24 fps. Without this,
    // an AnimLibrary that answers `null` to everything still passes every other
    // probe here — the duel leans on the clip TABLE for exactly this one value.
    expect(r.firstTelegraphMs).toBeCloseTo((10 * 1000) / 24, 5);
  });

  it('SWINGS: the actor\'s own checkHitObject lands real damage on the player', () => {
    const r = runDuel(7);
    expect(r.playerDamageEvents).toBeGreaterThan(0);
    expect(r.sim.player.hp).toBeLessThan(r.sim.player.maxHp);
  });

  it('never asks a geometric question — the degenerate geometry is correct HERE', () => {
    const r = runDuel(7);
    expect(r.npc.geometry.consulted).toBe(0);
  });

  /**
   * FINDING 15 — the actor commits at ITS OWN 100, in the Sim's WORLD px.
   * `OG_KATANA.melee.x` is 100 OG SCREEN px (~83 world px at the repo's ×1.2),
   * and the Sim range-gates nothing: `executeStrike` trusts the intent. So the
   * katana lands hits from 2× the Sim's own 50-px melee gate — exactly the
   * `AI_STRIKE_RANGE` regression SESSION13 D8 removed for killing emergent
   * turn-taking.
   */
  it('FINDING 15 — commits at its OG-pixel range, not the Sim\'s world-px gate', () => {
    const r = runDuel(7);
    expect(r.firstStrikeGapX).not.toBeNull();
    const gap = r.firstStrikeGapX ?? 0;
    expect(gap).toBeGreaterThan(AI_MELEE_RANGE.x);
    expect(gap).toBeLessThanOrEqual(OG_KATANA.melee.x);
  });

  /**
   * FINDING 18 — THE WINDUP IS DRAWN ONCE, THEN NEVER AGAIN.
   *
   * `NpcController` derives `telegraph` by edge-detecting ATTACK_STATE across a
   * whole `update()`. But the actor's re-attack cycle completes INSIDE one
   * `update()`: `stepAnimation` finishes `katanaattack` -> `startAction(WALK)`
   * -> `doAction()` sees the target still in range -> `startAction(ATTACK)`.
   * Before and after are both ATTACK, so there is no edge to detect. Measured:
   * ONE telegraph for TWENTY-FOUR landed swings.
   *
   * This is the readability of the fight. `AI_TELEGRAPH_MS` is CONTRACT
   * precisely because the windup is how a player reads an attack; twenty-three
   * unannounced swings is not the game in the videos.
   */
  it('FINDING 18 — one telegraph for every swing but the first', () => {
    const r = runDuel(7);
    expect(r.playerDamageEvents).toBeGreaterThan(10);
    expect(r.telegraphs).toBe(1);
  });

  /**
   * FINDING 16 — the seam is ONE-WAY. `OpponentView` carries position, stance,
   * focus and playerJumping; it carries no enemy HP and no "you were hit".
   * So the Sim's enemy takes the damage and the ACTOR never learns of it: it
   * plays no hit reaction, and `gotHit` — with all its defence, behead,
   * launch and flinch logic — is dead code in a duel.
   */
  it('FINDING 16 — the actor never learns it was hit: no reaction, no HP change', () => {
    const rng = mulberry32(7);
    const npc = createDuelKatana(rng);
    const sim = new Sim(rng, duelSetup(npc.controller));
    sim.beginCombat();
    const actorHpBefore = npc.actor.getHP();
    // Land real player slashes straight through the enemy's body.
    for (let i = 0; i < 12 && sim.phase === 'fighting'; i++) {
      const p = sim.enemy.pos;
      sim.applyStroke(new DrawnStroke([{ x: p.x - 60, y: p.y }, { x: p.x + 60, y: p.y }]));
      sim.tick();
    }
    expect(sim.enemy.hp).toBeLessThan(sim.enemy.maxHp); // the SIM's enemy is hurt
    expect(npc.actor.getHP()).toBe(actorHpBefore); // the ACTOR has no idea
    expect(npc.actor.gotHitCounter).toBe(0);
    expect(npc.actor.gotHitFlag).toBe(false);
  });

  /**
   * FINDING 17 — and it never dies either. When `enemy.hp` hits 0 the Sim just
   * stops polling the controller (`if (enemy.hp <= ZERO) continue`). `NPC.die()`
   * — the death clip, the loot roll, the XP award, the four-second fade — is
   * unreachable from a duel. The corpse on screen is the Sim's `corpseAlpha`,
   * not the actor's death animation.
   */
  it('FINDING 17 — the Sim\'s enemy dies while the actor stays alive and idle', () => {
    const rng = mulberry32(7);
    const npc = createDuelKatana(rng);
    const sim = new Sim(rng, duelSetup(npc.controller));
    sim.beginCombat();
    for (let i = 0; i < 200 && sim.phase === 'fighting'; i++) {
      const p = sim.enemy.pos;
      sim.applyStroke(new DrawnStroke([{ x: p.x - 60, y: p.y }, { x: p.x + 60, y: p.y }]));
      sim.tick();
    }
    expect(sim.enemy.hp).toBe(0);
    expect(sim.phase).toBe('ended');
    // The actor: alive, undead, never dying, never played a death clip.
    expect(npc.actor.isDead()).toBe(false);
    expect(npc.actor.dead).toBe(false);
    expect(npc.actor.actionState).not.toBe(OG_STATE.DYING);
    expect(npc.actor.events.filter((ev) => ev.type === 'death')).toEqual([]);
  });
});
