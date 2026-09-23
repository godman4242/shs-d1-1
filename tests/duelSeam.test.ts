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
import { describe, expect, it, vi } from 'vitest';
import { ENEMY_SPEED } from '../src/config/ai';
import { DUEL_SPAWNS } from '../src/config/duel';
import { OG_ANIM } from '../src/config/ogActor';
import { OG_ANIMS } from '../src/config/ogAnims';
import { OG_ANIM_CLIPS } from '../src/config/ogAnimClips';
import { OG_KATANA } from '../src/config/ogEnemyKatana';
import { OG_STATE } from '../src/config/ogActor';
import { FIXED_HZ, MS_PER_S, OG_FPS } from '../src/config/timing';
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

/**
 * Both fighters frozen at their spawns, 367 px apart — far outside the katana's
 * 100. The controller re-syncs the actor's x from this every tick, so the actor
 * walks forever and never closes: a pure walk, with no attack in it.
 */
const spawnView = {
  playerPos: { x: DUEL_SPAWNS.player.pos.x, y: DUEL_SPAWNS.player.pos.y },
  enemyPos: { x: DUEL_SPAWNS.enemy.pos.x, y: DUEL_SPAWNS.enemy.pos.y },
  playerStance: 'balanced' as const,
  enemyStance: 'balanced' as const,
  enemyFocus: 0,
  playerJumping: false,
};

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
    // 90 sim ticks = 36 actor steps: past the 24-step trigger, twice over.
    for (let i = 0; i < 90; i++) controller.next(i, spawnView);
    expect(actor.target).not.toBeNull();
  });
});

describe('the windup — a looping clip\'s wrap is NOT a swing', () => {
  /**
   * The false-positive half of finding 18's gate. A gate that only proves
   * "more telegraphs" passes a controller that fires on every frame, or on every
   * clip that restarts — and `walkwithkatana` restarts every 20 frames, because
   * it LOOPS. A walk cycle ending is not a new swing.
   */
  it('walking out of range through three walk cycles emits no telegraph at all', () => {
    const { actor, controller } = createDuelKatana(mulberry32(1));
    expect(OG_ANIM_CLIPS[OG_ANIM.KATANAWALK]?.loop).toBe(true);
    let telegraphs = 0;
    let wraps = 0;
    let lastFrame = actor.frameCounter;
    // 150 ticks = 60 actor steps = three 20-frame walk cycles.
    for (let f = 0; f < 150; f++) {
      if (controller.next(f, spawnView).telegraph !== undefined) telegraphs += 1;
      if (actor.animation === OG_ANIM.KATANAWALK && actor.frameCounter < lastFrame) wraps += 1;
      lastFrame = actor.frameCounter;
    }
    // Without these two, "no telegraph" would prove nothing: the clip really did
    // wrap, and the actor really was walking the whole time.
    expect(wraps).toBeGreaterThanOrEqual(2);
    expect(actor.actionState).toBe(OG_STATE.WALK);
    expect(telegraphs).toBe(0);
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
    // SWINGS, counted independently of the controller: every start of the
    // attack CLIP. The controller never looks at `startAnim`, so a telegraph
    // count that matches this is a match, not a tautology.
    const clipStarts = vi.spyOn(npc.actor, 'startAnim');
    const sim = new Sim(rng, duelSetup(npc.controller));
    sim.beginCombat();
    const startX = sim.enemy.pos.x;
    let telegraphs = 0;
    const telegraphMs: number[] = [];
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
          telegraphMs.push(ev.durationMs);
          firstTelegraphMs ??= ev.durationMs;
        }
        if (ev.type === 'damage' && ev.target === 'player') {
          playerDamageEvents += 1;
          firstStrikeGapX ??= gap;
        }
      }
    }
    const swings = clipStarts.mock.calls.filter(([name]) => name === OG_ANIM.KATANAATTACK).length;
    return {
      sim, npc, ticks, telegraphs, telegraphMs, swings, firstTelegraphMs, playerDamageEvents,
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
   * FINDING 15 — CLOSED 2026-09-23: NOT A DEFECT. ONE UNIT SPACE, BY THE SOURCE.
   *
   * The spike read `OG_KATANA.melee.x` (100) as OG SCREEN px and expected ~83
   * world px. The source says otherwise: `GameStage.doResize()` scales the whole
   * game stage, and every NPC is a child of that stage's canvas
   * (`NPCManager` → `StageManager.getGameStageCanvas()` → `MCSActor.addToCanvas`).
   * So an actor's `x`, and every range it compares against it, is LOGICAL
   * 800×480 px — which IS the Sim's world (`config/display.ts`). The katana
   * committing at ~95 px is the katana being itself.
   *
   * THE BAND. The Sim closes at most `ceil(60/24)` = 3 ticks of `ENEMY_SPEED`
   * between two actor decisions, so the commit gap lands in
   * `[100 − 7.09, 100)`. A conversion either way leaves it: ÷1.2 → ~83, ×1.2 → ~120.
   */
  it('FINDING 15 (closed, not a defect) — commits just inside its own 100, in world px', () => {
    const r = runDuel(7);
    const gap = r.firstStrikeGapX ?? Number.NaN;
    const maxCloseBetweenSteps = Math.ceil(FIXED_HZ / OG_FPS) * ENEMY_SPEED * (MS_PER_S / FIXED_HZ);
    expect(gap).toBeLessThan(OG_KATANA.melee.x);
    expect(gap).toBeGreaterThanOrEqual(OG_KATANA.melee.x - maxCloseBetweenSteps);
  });

  /**
   * FINDING 18 — CLOSED 2026-09-23: ONE TELEGRAPH PER SWING.
   *
   * It was: `NpcController` edge-detected ATTACK_STATE across a whole
   * `update()`, but the re-attack cycle completes INSIDE one: `stepAnimation`
   * finishes `katanaattack` -> `startAction(WALK)` -> `doAction()` sees the target
   * still in range -> `startAction(ATTACK)`. Before and after were both ATTACK,
   * so there was no edge — measured ONE telegraph for TWENTY-FOUR landed swings.
   *
   * Now the controller reports the actor's own DECISION to attack (every
   * `startAction(ATTACK)`). Swings are counted independently above, as starts of
   * the attack CLIP. Both halves of the gate live here and beside it: this one
   * fails a controller that fires too rarely or too often; the loop-wrap test
   * fails one that mistakes a walk cycle for a swing.
   */
  it('FINDING 18 (closed) — one telegraph per swing, every swing, at the payload\'s length', () => {
    const r = runDuel(7);
    expect(r.playerDamageEvents).toBeGreaterThan(10);
    expect(r.swings).toBeGreaterThan(10);
    expect(r.telegraphs).toBe(r.swings);
    const clipMs = ((OG_ANIM_CLIPS[OG_ANIM.KATANAATTACK]?.durationFrames ?? Number.NaN) * MS_PER_S) / OG_FPS;
    expect(new Set(r.telegraphMs)).toEqual(new Set([clipMs]));
  });

  /**
   * THE STATUE — MEASURED 2026-09-23: NOT A DEFECT, THE SOURCE'S OWN BEHAVIOUR.
   *
   * The spike saw the katana stop at 95.4 px and never move again, and asked
   * whether that was finding 15 in a costume. It is not (15 is not a defect).
   * `EnemyKatana.doAction`'s ATTACK branch never moves, and a finished swing
   * re-enters ATTACK while the target is in range — so against a player who
   * stands still, standing still IS the katana. What decides it is whether the
   * katana FOLLOWS when the gap opens past its 100. It does.
   */
  it('THE STATUE — stands only while the player does: it re-closes when the gap opens', () => {
    const rng = mulberry32(7);
    const npc = createDuelKatana(rng);
    const sim = new Sim(rng, duelSetup(npc.controller));
    sim.beginCombat();
    const gap = (): number => sim.enemy.pos.x - sim.player.pos.x;
    // Let it close and start swinging in place.
    for (let t = 0; t < 240 && sim.phase === 'fighting'; t++) sim.tick();
    expect(npc.actor.actionState).toBe(OG_STATE.ATTACK);
    // Back the player off until the gap is past the katana's reach.
    sim.setPlayerIntent({ moveX: -1, shunpoHeld: false });
    for (let t = 0; t < 600 && gap() < OG_KATANA.melee.x; t++) sim.tick();
    sim.setPlayerIntent({ moveX: 0, shunpoHeld: false });
    expect(gap()).toBeGreaterThanOrEqual(OG_KATANA.melee.x);
    const statesAfter = new Set<number>();
    const enemyXBefore = sim.enemy.pos.x;
    for (let t = 0; t < 300 && sim.phase === 'fighting'; t++) {
      sim.tick();
      statesAfter.add(npc.actor.actionState);
    }
    expect(statesAfter.has(OG_STATE.WALK)).toBe(true); // it walked...
    expect(sim.enemy.pos.x).toBeLessThan(enemyXBefore); // ...toward the player...
    expect(gap()).toBeLessThan(OG_KATANA.melee.x); // ...back inside its reach
    expect(npc.actor.actionState).toBe(OG_STATE.ATTACK); // ...and swings again.
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
