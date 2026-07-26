/**
 * TRASH MOBS — SESSION14 A2 (D4, D10, D11 / P1, P6, P8).
 *
 * "ORDINARY MOBS DIE IN ONE HIT" is the single best-evidenced measurement in the
 * whole corpus (>15 bar-disappearance events across 3 encounters; no non-named
 * enemy's HP bar was ever seen at anything other than 100 % on the last frame it
 * existed) — and `COMBAT_MEASUREMENTS.md` e-2 calls it *"the single largest gap
 * between the OG and our build"*.
 *
 * ⚠️ THE POINT OF THIS FILE IS THAT WE AUTHOR ALMOST NONE OF IT.
 * A mob's damage and defence are **1** because the source's own
 * `if (level <= 8) { minDamage = 1; defense = 1; }` override fires — the same
 * override Phase B implemented from source while it was DORMANT (both duellists
 * sit at level 9), and which the study pass then independently measured as
 * exactly 1 damage per hit against a 20-HP player. Two facts established
 * separately, in agreement. So the tests below assert the override is *reached*,
 * not that somebody typed a 1.
 *
 * ⚠️ Mobs must NOT run through `deriveEnemy` (P1). That derivation belongs to the
 * NAMED DUELLIST class, whose HP is recomputed from the player's stats so a
 * fight lasts K hits. A mob is a different AI class whose HP is an authored 1 —
 * routing mobs through it is the "wrong class" trap `SOURCE_CONSTANTS.md` §3.8
 * fell into.
 */
import { describe, expect, it } from 'vitest';
import {
  CORPSE_FADE_FRAMES,
  CORPSE_LINGER_FRAMES,
  ENCOUNTER_SIZE,
  MOB_BASE,
  MOB_HP,
  MOB_LEVEL,
} from '../src/config/mobs';
import { DAMAGE_FLOOR } from '../src/config/combat';
import { LOW_LEVEL_OVERRIDE } from '../src/config/duel';
import { WORLD_WIDTH } from '../src/config/display';
import { PLAYER_STATS } from '../src/config/stats';
import { DrawnStroke } from '../src/core/DrawnStroke';
import { deriveMob } from '../src/core/mobModel';
import { duelEnemyDerived } from '../src/core/duelSetup';
import { encounterSetup } from '../src/core/encounterSetup';
import type { OpponentController, OpponentIntent } from '../src/core/OpponentController';
import { Sim, type Rng, type SimEvent } from '../src/core/Sim';

const rng: Rng = () => 0.5;
const idle: OpponentController = { next: (): OpponentIntent => ({}) };
const idleFor = (): OpponentController => ({ next: (): OpponentIntent => ({}) });

/** A fighting encounter with its own controller per mob, fightStarted drained. */
const makeEncounter = (): Sim => {
  const sim = new Sim(rng, encounterSetup(idleFor));
  sim.beginCombat();
  sim.drainEvents();
  return sim;
};

/** A stroke from the player, long enough that reach truncation decides the end. */
const strokeAt = (sim: Sim, targetX: number): DrawnStroke => {
  const p = sim.player.pos;
  const dir = Math.sign(targetX - p.x) || 1;
  return new DrawnStroke([{ ...p }, { x: p.x + dir * WORLD_WIDTH, y: p.y }]);
};

describe('mobs — HP is an authored 1, NOT the duellist derivation (D4 / P1)', () => {
  it('a mob has 1 HP', () => {
    expect(MOB_HP).toBe(1);
    expect(deriveMob(MOB_BASE).hp).toBe(1);
  });

  it('and that 1 is NOT what deriveEnemy would produce — different class, different rule', () => {
    // The named duellist's HP is `effPlayerDmg × K` = 50. If a mob ever reads
    // that number, somebody routed it through the wrong derivation (P1).
    expect(duelEnemyDerived().hp).toBe(50);
    expect(deriveMob(MOB_BASE).hp).not.toBe(duelEnemyDerived().hp);
  });

  it('mob damage and defence are 1 — and they come from the source\'s own level override', () => {
    const mob = deriveMob(MOB_BASE);
    expect(MOB_LEVEL).toBeLessThanOrEqual(LOW_LEVEL_OVERRIDE.maxLevel);
    expect(mob.minDamage).toBe(DAMAGE_FLOOR);
    expect(mob.defense).toBe(DAMAGE_FLOOR);
  });

  it('⚠️ raise the mob past level 8 and BOTH stop being 1 — proving the override is what did it', () => {
    // This is the kickoff's named chaos check, as a permanent test: if damage and
    // defence were authored constants rather than the override's output, this
    // would not move.
    const escaped = deriveMob({ ...MOB_BASE, level: LOW_LEVEL_OVERRIDE.maxLevel + 1 });
    expect(escaped.minDamage).toBe(MOB_BASE.baseMinDamage);
    expect(escaped.defense).toBe(MOB_BASE.baseDefense);
    expect(escaped.minDamage).not.toBe(DAMAGE_FLOOR);
    expect(escaped.defense).not.toBe(DAMAGE_FLOOR);
  });
});

describe('mobs — ONE HIT, ONE KILL (gate item 5, the largest measured gap)', () => {
  it('a single landed slash kills a mob outright', () => {
    const sim = makeEncounter();
    const before = sim.enemies.filter((e) => e.hp > 0).length;
    expect(before).toBe(ENCOUNTER_SIZE);
    // Walk the player onto the nearest mob's line and swing once.
    const nearest = sim.enemies[0];
    expect(nearest).toBeDefined();
    sim.applyStroke(strokeAt(sim, nearest?.pos.x ?? 0));
    const dmg = sim.drainEvents().filter((e) => e.type === 'damage');
    expect(dmg).toHaveLength(1);
    expect(sim.enemies.filter((e) => e.hp > 0)).toHaveLength(ENCOUNTER_SIZE - 1);
  });

  it('the encounter does NOT end on the first kill — seven mobs are still standing', () => {
    const sim = makeEncounter();
    const nearest = sim.enemies[0];
    sim.applyStroke(strokeAt(sim, nearest?.pos.x ?? 0));
    expect(sim.phase).toBe('fighting');
  });

  it('a mob deals exactly 1 damage — the number the study pass filmed', () => {
    const striker: OpponentController = { next: (): OpponentIntent => ({ strike: true }) };
    const sim = new Sim(rng, encounterSetup(() => striker));
    sim.beginCombat();
    // Any slash ends spawn invuln (an offensive act); out-and-back moves nobody.
    const p = sim.player.pos;
    sim.applyStroke(new DrawnStroke([{ ...p }, { x: p.x + 30, y: p.y }, { ...p }]));
    sim.drainEvents();
    const hpBefore = sim.player.hp;
    sim.tick();
    const hits = sim
      .drainEvents()
      .filter((e): e is Extract<SimEvent, { type: 'damage' }> => e.type === 'damage')
      .filter((e) => e.target === 'player');
    expect(hits.length).toBeGreaterThan(0);
    // Every individual hit is the floor, whatever the crowd does collectively.
    for (const h of hits) expect(h.amount).toBe(DAMAGE_FLOOR);
    expect(sim.player.hp).toBe(hpBefore - hits.length * DAMAGE_FLOOR);
  });
});

describe('mobs — the encounter layout (D10: 8 is FILMED, the geometry is INFERRED)', () => {
  it('spawns ENCOUNTER_SIZE mobs — eight, the size actually observed on film (P8)', () => {
    expect(ENCOUNTER_SIZE).toBe(8);
    expect(makeEncounter().enemies).toHaveLength(8);
  });

  it('spreads them across the world at a single ground line, each inside the arena', () => {
    const sim = makeEncounter();
    const xs = sim.enemies.map((e) => e.pos.x);
    const ys = sim.enemies.map((e) => e.pos.y);
    expect(new Set(ys).size).toBe(1); // one ground line
    for (const x of xs) {
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(WORLD_WIDTH);
    }
    // Strictly increasing, and actually spread rather than stacked on one spot.
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(WORLD_WIDTH / 4);
  });

  it('gives every mob its OWN controller instance (never one shared machine)', () => {
    // ⚠️ Both halves matter, and an earlier version of this test had only the
    // first — which left it blind to a factory called once and reused.
    //   (a) the factory is invoked ONCE PER MOB, with each mob's own index, and
    //   (b) the Sim ends up holding N DISTINCT controllers.
    // Controllers carry telegraph/mode state; one shared instance would
    // interleave eight fighters into a single decision machine.
    const indices: number[] = [];
    const made: OpponentController[] = [];
    const factory = (i: number): OpponentController => {
      indices.push(i);
      const c: OpponentController = { next: (): OpponentIntent => ({}) };
      made.push(c);
      return c;
    };
    const setup = encounterSetup(factory);
    expect(indices).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(made).toHaveLength(ENCOUNTER_SIZE);
    // The identities that actually reached the Sim — not just what we handed out.
    const installed = setup.enemies.map((e) => e.controller);
    expect(new Set(installed).size).toBe(ENCOUNTER_SIZE);
  });
});

describe('mobs — corpses linger 96 frames, fading over the last 12 (D11 / P6)', () => {
  it('a LIVING fighter is fully opaque', () => {
    const sim = makeEncounter();
    expect(sim.player.corpseAlpha).toBe(1);
    expect(sim.enemies[0]?.corpseAlpha).toBe(1);
  });

  it('a fresh corpse stays fully opaque until the fade begins', () => {
    const sim = makeEncounter();
    sim.applyStroke(strokeAt(sim, sim.enemies[0]?.pos.x ?? 0));
    expect(sim.enemies[0]?.hp).toBe(0);
    expect(sim.enemies[0]?.corpseAlpha).toBe(1);
    for (let i = 0; i < CORPSE_LINGER_FRAMES - CORPSE_FADE_FRAMES; i++) sim.tick();
    expect(sim.enemies[0]?.corpseAlpha).toBe(1);
  });

  it('…then ramps to 0 across exactly CORPSE_FADE_FRAMES, and stays 0 after', () => {
    const sim = makeEncounter();
    sim.applyStroke(strokeAt(sim, sim.enemies[0]?.pos.x ?? 0));
    const fadeStart = CORPSE_LINGER_FRAMES - CORPSE_FADE_FRAMES;
    for (let i = 0; i < fadeStart; i++) sim.tick();
    const seen: number[] = [];
    for (let i = 0; i < CORPSE_FADE_FRAMES; i++) {
      sim.tick();
      seen.push(sim.enemies[0]?.corpseAlpha ?? -1);
    }
    // Strictly decreasing, landing exactly on 0 at frame CORPSE_LINGER_FRAMES.
    expect(seen.at(-1)).toBe(0);
    for (let i = 1; i < seen.length; i++) {
      expect(seen[i] ?? 1).toBeLessThan(seen[i - 1] ?? 0);
    }
    sim.tick();
    expect(sim.enemies[0]?.corpseAlpha).toBe(0);
  });

  it('the corpse window is the measured 96 frames = 4.0 s', () => {
    expect(CORPSE_LINGER_FRAMES).toBe(96);
    expect(CORPSE_FADE_FRAMES).toBe(12);
  });
});

describe('mobs — HP obfuscation is NOT reproduced (gate item 18 / P10)', () => {
  it('a mob\'s stored HP is its real HP — no random 2..6 multiplier anywhere', () => {
    // The original multiplies stored HP by a random 2..6 per session to defeat
    // memory scanners. That is ANTI-CHEAT, not gameplay: reproducing it would be
    // a fidelity error, and it would make every HP read non-deterministic.
    // Recorded as a test so a future session cannot "discover" it and
    // faithfully implement a bug-generator.
    for (const seed of [() => 0, () => 0.5, () => 0.999]) {
      const sim = new Sim(seed, encounterSetup(idleFor));
      for (const e of sim.enemies) expect(e.hp).toBe(MOB_HP);
      for (const e of sim.enemies) expect(e.maxHp).toBe(MOB_HP);
    }
  });
});

void idle;
void PLAYER_STATS;
