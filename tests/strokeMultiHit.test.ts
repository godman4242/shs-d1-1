/**
 * ONE STROKE, EVERY ENEMY IT CROSSES — SESSION14 A3 (D5).
 *
 * A1 generalised `Sim` to N enemies but deliberately left the swing resolving
 * against the NEAREST living enemy only, so this file could be written red-first.
 * This is the step that makes a crowd fight read like the original's: the filmed
 * 11-hit combos require one stroke to fell several mobs.
 *
 * ⚠️ THE BUDGET BELONGS TO THE SWING, NOT TO EACH VICTIM (D5).
 * Reach is an ARC-LENGTH BUDGET spent along the drawn stroke (SESSION13 B3), and
 * it is spent EXACTLY ONCE, before any enemy is considered. The failure this
 * guards against is subtle and silent: if the budget were re-derived per enemy,
 * a swing's reach would grow with the size of the crowd — a stroke that fells
 * two mobs in an empty room would suddenly fell four in a busy one. So the
 * assertions below deliberately pin the NEGATIVE: **who a stroke can reach must
 * not depend on how many enemies exist.**
 *
 * ⚠️ Bodies are 44 world px wide and are spaced 50 apart here, so no two mobs
 * overlap. A test that only passes because its fixtures stand inside each other
 * is not evidence about a crowd.
 */
import { describe, expect, it } from 'vitest';
import { FOCUS_MAX, FOCUS_SPEND } from '../src/config/combat';
import { MOB_BASE, MOB_STATS } from '../src/config/mobs';
import { PLAYER_BASE } from '../src/config/combat-sim';
import { SLASH_FRAMES } from '../src/config/timing';
import { reachFor } from '../src/core/mastery';
import { DrawnStroke } from '../src/core/DrawnStroke';
import { deriveMob } from '../src/core/mobModel';
import { Sim, type ActorId, type EnemySlot, type FighterSpawn, type Rng } from '../src/core/Sim';

const rng: Rng = () => 0.5;

const PLAYER_X = 190;
const GROUND_Y = 358;
const HALF_W = 22;
const HALF_H = 50;
/** 50 > 2 × HALF_W, so consecutive mobs never overlap. */
const SPACING = 50;

/** The player's actual reach budget — imported, never hard-coded. */
const REACH = reachFor('balanced', PLAYER_BASE.stats);

/** `hp` defaults to the mob's real 1; a survivor variant isolates the kill bonus. */
const mobAt = (x: number, hp?: number): FighterSpawn => {
  const d = deriveMob(MOB_BASE);
  return {
    pos: { x, y: GROUND_Y },
    hp: hp ?? d.hp,
    minDamage: d.minDamage,
    damageRange: 0,
    defense: d.defense,
    stance: 'balanced',
    deflectLearned: false,
    stats: MOB_STATS,
    halfW: HALF_W,
    halfH: HALF_H,
  };
};

const slot = (x: number, hp?: number): EnemySlot => ({
  spawn: mobAt(x, hp),
  controller: { next: () => ({}) },
});

const makeSim = (enemies: EnemySlot[]): Sim => {
  const sim = new Sim(rng, {
    player: { ...PLAYER_BASE, pos: { x: PLAYER_X, y: GROUND_Y }, halfW: HALF_W, halfH: HALF_H },
    enemies,
  });
  sim.beginCombat();
  sim.drainEvents();
  return sim;
};

const simWithMobsAt = (...xs: number[]): Sim => makeSim(xs.map((x) => slot(x)));

/** One long rightward stroke from the player — reach decides where it stops. */
const swing = (sim: Sim): DrawnStroke => {
  const p = sim.player.pos;
  return new DrawnStroke([{ ...p }, { x: p.x + REACH * 4, y: p.y }]);
};

const damageTargets = (sim: Sim): ActorId[] =>
  sim
    .drainEvents()
    .filter((e) => e.type === 'damage')
    .map((e) => e.target);

/**
 * A stroke from the player covers arc-length REACH, and a body is crossed when
 * the segment touches its box — so the crossable window is
 * `(PLAYER_X − HALF_W, PLAYER_X + REACH + HALF_W)`. These three sit inside it
 * with room to spare; OUT sits well beyond it.
 */
const IN_1 = PLAYER_X + SPACING * 0.2;
const IN_2 = PLAYER_X + SPACING * 1.2;
const IN_3 = PLAYER_X + SPACING * 2.2;
const OUT = PLAYER_X + REACH * 2;

describe('A3 — one stroke fells EVERY enemy it crosses (D5)', () => {
  it('a stroke crossing three mobs kills three, in spawn order', () => {
    const sim = simWithMobsAt(IN_1, IN_2, IN_3);
    sim.applyStroke(swing(sim));
    expect(damageTargets(sim)).toEqual(['enemy0', 'enemy1', 'enemy2']);
    expect(sim.enemies.map((e) => e.hp)).toEqual([0, 0, 0]);
  });

  it('…and it ends the encounter, because that was every enemy', () => {
    const sim = simWithMobsAt(IN_1, IN_2, IN_3);
    sim.applyStroke(swing(sim));
    expect(sim.phase).toBe('ended');
  });

  it('a mob beyond the reach budget survives the same stroke', () => {
    const sim = simWithMobsAt(IN_1, IN_2, IN_3, OUT);
    sim.applyStroke(swing(sim));
    expect(sim.enemies.map((e) => e.hp)).toEqual([0, 0, 0, 1]);
    expect(sim.phase).toBe('fighting'); // one still standing
  });
});

describe('A3 — the reach budget is spent ONCE, by the swing (D5)', () => {
  it('⚠️ who a stroke reaches does NOT depend on how many enemies exist', () => {
    // THE CORE ANTI-REGRESSION. The far mob stands at the same distance in every
    // case; only the size of the crowd in front of it changes. If the budget
    // were re-derived per enemy, reach would scale with crowd size and the far
    // mob would start dying in the busier arrangements.
    const alone = simWithMobsAt(OUT);
    alone.applyStroke(swing(alone));
    expect(alone.enemies[0]?.hp).toBe(1);

    const crowded = simWithMobsAt(IN_1, IN_2, IN_3, OUT);
    crowded.applyStroke(swing(crowded));
    expect(crowded.enemies.at(-1)?.hp).toBe(1);

    const veryCrowded = simWithMobsAt(
      ...Array.from({ length: 6 }, (_, i) => IN_1 + i * SPACING),
      OUT,
    );
    veryCrowded.applyStroke(swing(veryCrowded));
    expect(veryCrowded.enemies.at(-1)?.hp).toBe(1);
  });

  it('the cut polyline handed back is the SAME one whatever the crowd size', () => {
    // `cutPoints` is what the scene draws and what the dash follows, so a leaked
    // budget would show up here before anyone died differently.
    const alone = simWithMobsAt(OUT);
    const crowded = simWithMobsAt(IN_1, IN_2, IN_3, OUT);
    expect(crowded.applyStroke(swing(crowded)).cutPoints).toEqual(
      alone.applyStroke(swing(alone)).cutPoints,
    );
  });

  it('the swing costs its Focus ONCE, not once per victim', () => {
    // Focus is spent by the ACT of swinging (SESSION13 P3); charging it per
    // enemy would make crowds punish the player for the game's own core verb.
    //
    // ⚠️ TWO WAYS THIS TEST CAN GO VACUOUS, AND IT HAS GONE VACUOUS BOTH WAYS:
    //  (a) real mobs die in one hit and each KILL pays FOCUS_KILL_BONUS, which
    //      swamps the spend — so these are SURVIVORS, with HP far above the
    //      player's damage;
    //  (b) `focusSpend` clamps at zero, so if the meter holds less than one
    //      spend, one spend and three spends BOTH land on 0 and the test proves
    //      nothing. An earlier version banked 24 against a 48 cost and passed
    //      happily while Focus was charged per victim.
    // Hence the explicit headroom guard below: bank more than THREE spends, and
    // stay under FOCUS_MAX so the crit reset does not fire instead.
    const build = (n: number): Sim =>
      makeSim(Array.from({ length: n }, (_, i) => slot(IN_1 + i * SPACING, 500)));
    const one = build(1);
    const three = build(3);
    for (const s of [one, three]) for (let i = 0; i < 400; i++) s.tick();
    const banked = one.player.focus;
    expect(banked).toBeGreaterThan(3 * FOCUS_SPEND.balanced); // headroom for 3 spends
    expect(banked).toBeLessThan(FOCUS_MAX); // …but not enough to trigger a crit

    one.applyStroke(swing(one));
    three.applyStroke(swing(three));
    expect(three.enemies.every((e) => e.hp > 0)).toBe(true); // nobody died: no bonus
    expect(three.enemies).toHaveLength(3); // …and all three were genuinely hit
    // Exact values, not just equality — equality alone is what let (b) through.
    expect(one.player.focus).toBe(banked - FOCUS_SPEND.balanced);
    expect(three.player.focus).toBe(banked - FOCUS_SPEND.balanced);
  });
});

describe('A3 — the combo chain a crowd makes possible (§3 point 3)', () => {
  /** Swing, then let the dash and the swing cycle finish, until nothing stands. */
  const clear = (sim: Sim, maxSwings = 20): number => {
    const cycle = SLASH_FRAMES.balanced;
    const settle = cycle.windup + cycle.active + cycle.recovery + 10;
    // Read through a call, not a property: the compiler narrows `sim.phase`
    // across the loop guard and would call the re-check dead code.
    const fighting = (): boolean => sim.phase === 'fighting';
    for (let s = 0; s < maxSwings; s++) {
      if (!fighting()) break;
      sim.applyStroke(swing(sim));
      // Ticking past the end is harmless — tick() no-ops once the fight is over.
      for (let f = 0; f < settle; f++) sim.tick();
    }
    return sim.combo;
  };

  it('an 8-mob encounter yields a combo chain of 8 (gate item 15)', () => {
    // The combo breaks only on PLAYER damage (SESSION13 A2), and these mobs
    // never attack — so eight kills chain into eight, across as many swings as
    // the player needs to walk the line.
    const sim = simWithMobsAt(...Array.from({ length: 8 }, (_, i) => IN_1 + i * SPACING));
    expect(clear(sim)).toBe(8);
    expect(sim.enemies.every((e) => e.hp === 0)).toBe(true);
  });

  it('⚠️ 11-chains become reachable for the first time — the filmed number', () => {
    // The study corpus films 11-hit combos. With one-hit-kill mobs and a
    // one-enemy-per-swing sim they were unreachable; a crowd makes them ordinary.
    const sim = simWithMobsAt(...Array.from({ length: 11 }, (_, i) => IN_1 + i * SPACING));
    expect(clear(sim)).toBeGreaterThanOrEqual(11);
  });

  it('a stroke that crosses nobody advances nothing', () => {
    const sim = simWithMobsAt(OUT);
    sim.applyStroke(swing(sim));
    expect(damageTargets(sim)).toEqual([]);
    expect(sim.combo).toBe(0);
  });
});
