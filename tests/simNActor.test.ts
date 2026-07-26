/**
 * N-ACTOR SIM — SESSION14 A1 (D1).
 *
 * `Sim` was hard-wired to exactly two fighters: `Record<'player' | 'enemy', …>`.
 * A1 generalises it to **a player plus an array of enemies**, with the 1v1 duel
 * preserved as the array-of-one case.
 *
 * This file pins the GENERALISATION. Its companion is `tests/duel-baseline.test.ts`,
 * which pins that the generalisation changed NOTHING at N=1 — the two together
 * are the whole claim: "new capability, identical old behaviour".
 *
 * ⚠️ Read together with the kickoff's §3.5 inventory. Every assertion below maps
 * to one of its lettered groups:
 *   A  actor ids replace the 'player' | 'enemy' union
 *   B  storage: player + enemies[], with the duel accessor kept as the exception
 *   D  one AI view per enemy
 *   E  one controller instance per enemy, consulted in FIXED spawn order
 *   F  the fight ends when ALL enemies are dead — NOT on the first kill
 *   G  skills target the nearest living enemy
 *   H  per-enemy projectile thrower
 *
 * ⚠️ NOT pinned here, deliberately: "one stroke fells every enemy it crosses".
 * That is **A3** and must be written red-first there. A1 resolves a slash
 * against the nearest living enemy only — structurally generalised (no
 * `fighters.enemy` anywhere), behaviourally still one target per swing.
 */
import { describe, expect, it } from 'vitest';
import { PLAYER_STATS, ENEMY_STATS } from '../src/config/stats';
import { FIXED_HZ } from '../src/config/timing';
import { DrawnStroke } from '../src/core/DrawnStroke';
import type { OpponentController, OpponentIntent, OpponentView } from '../src/core/OpponentController';
import { spawnProjectile, stepProjectile } from '../src/core/projectile';
import { Sim, type ActorId, type EnemySlot, type FighterSpawn, type Rng } from '../src/core/Sim';
import type { Vec } from '../src/core/vec';

const v = (x: number, y: number): Vec => ({ x, y });
const rng: Rng = () => 0.5;

const idle: OpponentController = { next: (): OpponentIntent => ({}) };
const striker: OpponentController = { next: (): OpponentIntent => ({ strike: true }) };

const playerSpawn = (over: Partial<FighterSpawn> = {}): FighterSpawn => ({
  pos: v(100, 200),
  hp: 100,
  minDamage: 10,
  damageRange: 0,
  stats: PLAYER_STATS,
  defense: 5,
  stance: 'balanced',
  deflectLearned: true,
  halfW: 20,
  halfH: 40,
  ...over,
});
const mobSpawn = (over: Partial<FighterSpawn> = {}): FighterSpawn => ({
  pos: v(400, 200),
  hp: 150,
  minDamage: 7,
  damageRange: 0,
  stats: ENEMY_STATS,
  defense: 5,
  stance: 'heavy',
  deflectLearned: false,
  halfW: 20,
  halfH: 40,
  ...over,
});

/** An enemy slot: its spawn plus the controller that drives IT (never shared). */
const slot = (spawn: FighterSpawn, controller: OpponentController = idle): EnemySlot => ({
  spawn,
  controller,
});

/** A fighting Sim with N enemies, fightStarted already drained. */
const makeSim = (enemies: EnemySlot[], p: Partial<FighterSpawn> = {}): Sim => {
  const sim = new Sim(rng, { player: playerSpawn(p), enemies });
  sim.beginCombat();
  sim.drainEvents();
  return sim;
};

/**
 * End the player's spawn invuln without touching anybody: an out-and-back
 * stroke from the player's own position. Any slash — hit or miss — is an
 * offensive act, and this one nets zero displacement so nothing else moves.
 */
const endInvuln = (sim: Sim): void => {
  const p = sim.player.pos;
  sim.applyStroke(new DrawnStroke([{ ...p }, { x: p.x + 30, y: p.y }, { ...p }]));
  sim.drainEvents();
};

/** A stroke from the player straight through whatever stands to its right. */
const rightStroke = (sim: Sim): DrawnStroke => {
  const p = sim.player.pos;
  return new DrawnStroke([{ ...p }, { x: p.x + 300, y: p.y }]);
};

const tickN = (sim: Sim, n: number): void => {
  for (let i = 0; i < n; i++) sim.tick();
};

describe('N-actor Sim — storage and identity (§3.5 A + B)', () => {
  it('carries N enemies, exposed in SPAWN ORDER', () => {
    const sim = makeSim([slot(mobSpawn({ pos: v(200, 200) })), slot(mobSpawn({ pos: v(400, 200) }))]);
    expect(sim.enemies).toHaveLength(2);
    expect(sim.enemies[0]?.pos).toEqual(v(200, 200));
    expect(sim.enemies[1]?.pos).toEqual(v(400, 200));
  });

  it('gives every actor a stable id: the player plus enemy0, enemy1, … by spawn index', () => {
    const sim = makeSim([slot(mobSpawn()), slot(mobSpawn()), slot(mobSpawn())]);
    const ids: ActorId[] = sim.enemyIds.slice();
    expect(ids).toEqual(['enemy0', 'enemy1', 'enemy2']);
  });

  it('hitbox(id) resolves ANY actor id, not just two hard-wired sides', () => {
    const sim = makeSim([slot(mobSpawn({ pos: v(200, 200) })), slot(mobSpawn({ pos: v(400, 200) }))]);
    const rect = (cx: number, cy: number, hw: number, hh: number): Vec[] => [
      { x: cx - hw, y: cy - hh },
      { x: cx + hw, y: cy - hh },
      { x: cx + hw, y: cy + hh },
      { x: cx - hw, y: cy + hh },
    ];
    expect(sim.hitbox('player')).toEqual(rect(100, 200, 20, 40));
    expect(sim.hitbox('enemy0')).toEqual(rect(200, 200, 20, 40));
    expect(sim.hitbox('enemy1')).toEqual(rect(400, 200, 20, 40));
  });

  it('an unknown actor id THROWS rather than silently resolving to somebody', () => {
    const sim = makeSim([slot(mobSpawn())]);
    expect(() => sim.hitbox('enemy7')).toThrow();
  });

  it('`sim.enemy` / `sim.enemyId` are the DUEL accessor — the first enemy only', () => {
    const sim = makeSim([slot(mobSpawn({ pos: v(200, 200) })), slot(mobSpawn({ pos: v(400, 200) }))]);
    expect(sim.enemyId).toBe('enemy0');
    expect(sim.enemy.pos).toEqual(v(200, 200));
  });
});

describe('N-actor Sim — the fight ends when ALL enemies are dead (§3.5 F)', () => {
  it('killing ONE of two enemies does NOT end the fight', () => {
    const sim = makeSim([
      slot(mobSpawn({ pos: v(200, 200), hp: 1 })),
      slot(mobSpawn({ pos: v(230, 200), hp: 1 })),
    ]);
    sim.applyStroke(rightStroke(sim));
    const evs = sim.drainEvents();
    expect(evs.filter((e) => e.type === 'damage').map((e) => e.target)).toEqual(['enemy0']);
    expect(evs.filter((e) => e.type === 'fightEnded')).toHaveLength(0);
    expect(sim.phase).toBe('fighting');
    expect(sim.enemies[0]?.hp).toBe(0);
    expect(sim.enemies[1]?.hp).toBe(1);
  });

  it('…and killing the LAST one does, with the player as winner', () => {
    const sim = makeSim([
      slot(mobSpawn({ pos: v(200, 200), hp: 1 })),
      slot(mobSpawn({ pos: v(230, 200), hp: 1 })),
    ]);
    sim.applyStroke(rightStroke(sim));
    sim.drainEvents();
    sim.applyStroke(rightStroke(sim)); // nearest LIVING is now enemy1
    const evs = sim.drainEvents();
    expect(evs.filter((e) => e.type === 'damage').map((e) => e.target)).toEqual(['enemy1']);
    expect(evs.filter((e) => e.type === 'fightEnded')).toEqual([{ type: 'fightEnded', winner: 'player' }]);
    expect(sim.phase).toBe('ended');
  });

  it('the player dying ends it, and the WINNER is the enemy that landed the blow', () => {
    const sim = makeSim(
      [slot(mobSpawn({ pos: v(600, 200) })), slot(mobSpawn({ pos: v(700, 200), minDamage: 500 }), striker)],
      { hp: 1 },
    );
    endInvuln(sim);
    sim.tick();
    const ended = sim.drainEvents().filter((e) => e.type === 'fightEnded');
    expect(ended).toEqual([{ type: 'fightEnded', winner: 'enemy1' }]);
  });
});

describe('N-actor Sim — one controller per enemy, fixed order (§3.5 D + E)', () => {
  it('consults EVERY enemy controller once per tick, in spawn order, with its OWN view', () => {
    const log: string[] = [];
    const spy = (name: string): OpponentController => ({
      next: (frame: number, view: OpponentView): OpponentIntent => {
        log.push(`${name}@${String(frame)}:${String(Math.round(view.enemyPos.x))}`);
        return {};
      },
    });
    const sim = makeSim([
      slot(mobSpawn({ pos: v(200, 200) }), spy('a')),
      slot(mobSpawn({ pos: v(400, 200) }), spy('b')),
    ]);
    tickN(sim, 2);
    expect(log).toEqual(['a@1:200', 'b@1:400', 'a@2:200', 'b@2:400']);
  });

  it('enemies do NOT take turns: two can commit a strike on the SAME frame (P5)', () => {
    const sim = makeSim(
      [slot(mobSpawn({ pos: v(600, 200) }), striker), slot(mobSpawn({ pos: v(700, 200) }), striker)],
      { hp: 100 },
    );
    endInvuln(sim);
    sim.tick();
    const hits = sim.drainEvents().filter((e) => e.type === 'damage' && e.target === 'player');
    expect(hits).toHaveLength(2);
  });

  it('a DEAD enemy is never consulted again', () => {
    let calls = 0;
    const counting: OpponentController = {
      next: (): OpponentIntent => {
        calls += 1;
        return {};
      },
    };
    const sim = makeSim([
      slot(mobSpawn({ pos: v(200, 200), hp: 1 }), counting),
      slot(mobSpawn({ pos: v(700, 200) })),
    ]);
    sim.applyStroke(rightStroke(sim));
    sim.drainEvents();
    expect(sim.enemies[0]?.hp).toBe(0);
    tickN(sim, 10);
    expect(calls).toBe(0);
  });
});

describe('N-actor Sim — targeting and per-enemy verbs (§3.5 G + H)', () => {
  it('Chi Punch hits the NEAREST living enemy by |Δx|, not the first spawned (P4)', () => {
    const sim = makeSim([
      slot(mobSpawn({ pos: v(400, 200) })), // enemy0 — spawned first, but FAR
      slot(mobSpawn({ pos: v(200, 200) })), // enemy1 — nearer
    ]);
    sim.queueSkill('chiPunch');
    sim.tick();
    const dmg = sim.drainEvents().filter((e) => e.type === 'damage');
    expect(dmg.map((e) => e.target)).toEqual(['enemy1']);
  });

  it('a kunai is thrown from ITS OWN thrower, not from a hard-wired "the enemy"', () => {
    const thrower: OpponentController = { next: (): OpponentIntent => ({ throwKunai: true }) };
    const sim = makeSim([slot(mobSpawn({ pos: v(300, 200) })), slot(mobSpawn({ pos: v(700, 240) }), thrower)]);
    sim.tick();
    expect(sim.projectiles).toHaveLength(1);
    // The same tick also steps it one frame, so compare against the real spawn
    // maths from ENEMY1's position — which is what pins the thrower. Spawning
    // it from enemy0 (300, 200) would put it nowhere near this point.
    const expected = stepProjectile(spawnProjectile(v(700, 240), v(100, 200))).pos;
    expect(sim.projectiles[0]?.pos.x).toBeCloseTo(expected.x, 9);
    expect(sim.projectiles[0]?.pos.y).toBeCloseTo(expected.y, 9);
    expect(sim.projectiles[0]?.pos.y).toBeGreaterThan(200); // never enemy0's line
  });

  it('stance switches are addressed by actor id', () => {
    const sim = makeSim([slot(mobSpawn()), slot(mobSpawn())]);
    tickN(sim, FIXED_HZ * 4); // fill Focus enough to afford a switch
    expect(sim.requestStanceSwitch('enemy1', 'light')).toBe(true);
    expect(sim.enemies[1]?.stance).toBe('light');
    expect(sim.enemies[0]?.stance).toBe('heavy');
  });
});

describe('N-actor Sim — determinism (§3 risk 2)', () => {
  it('the Sim itself draws NOTHING from the rng stream, at any crowd size', () => {
    // Crowd-size-dependent rng consumption is the quiet way an N-actor refactor
    // shifts the shared stream and moves the seed-7 baseline checksum. The Sim
    // has never drawn from it — every draw belongs to a controller — and this
    // pins that so a future "roll per enemy" cannot slip in unnoticed.
    let draws = 0;
    const counting: Rng = () => {
      draws += 1;
      return 0.5;
    };
    const sim = new Sim(counting, {
      player: playerSpawn(),
      enemies: [slot(mobSpawn()), slot(mobSpawn({ pos: v(500, 200) })), slot(mobSpawn({ pos: v(700, 200) }))],
    });
    sim.beginCombat();
    tickN(sim, 120);
    sim.applyStroke(rightStroke(sim));
    expect(draws).toBe(0);
  });
});
