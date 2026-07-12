/**
 * Stage-2 Sim — the single owner of gameplay state (scenes render only).
 * Two fighters (player + enemy), damage resolution with defense and the
 * heavy-stance penalty (defense-side ONLY — the landmine), Focus + Critical
 * meters, phase model (intro → fighting → ended), stance switching (free
 * out of combat, Focus-gated in combat), SimEvent[] drain, and the
 * fixed-step advance(deltaMs) accumulator from M1.
 */
import { describe, expect, it } from 'vitest';
import {
  CRITICAL_MAX,
  FOCUS_START,
} from '../src/config/combat';
import { MAX_FRAME_MS } from '../src/config/combat-sim';
import { JUMP_DURATION_FRAMES } from '../src/config/duel';
import { FIXED_HZ } from '../src/config/timing';
import { DrawnStroke } from '../src/core/DrawnStroke';
import type { OpponentController } from '../src/core/OpponentController';
import { Sim, type FighterSpawn, type Rng, type SimEvent } from '../src/core/Sim';
import type { Vec } from '../src/core/vec';

const v = (x: number, y: number): Vec => ({ x, y });
const rng: Rng = () => 0.5;
const opponent: OpponentController = { next: () => ({}) };

/** Player at x=100, enemy at x=400 — far enough apart that strokes aimed at
 * one never graze the other (hitboxes 80..120 and 380..420). */
const playerSpawn = (over: Partial<FighterSpawn> = {}): FighterSpawn => ({
  pos: v(100, 200),
  hp: 100,
  atkPlusWeapon: 10,
  defense: 5,
  stance: 'balanced',
  deflectLearned: true,
  halfW: 20,
  halfH: 40,
  ...over,
});
const enemySpawn = (over: Partial<FighterSpawn> = {}): FighterSpawn => ({
  pos: v(400, 200),
  hp: 150,
  atkPlusWeapon: 7,
  defense: 5,
  stance: 'heavy',
  deflectLearned: false,
  halfW: 20,
  halfH: 40,
  ...over,
});

/** Sim already in the 'fighting' phase (the common case for combat tests). */
const makeSim = (
  p: Partial<FighterSpawn> = {},
  e: Partial<FighterSpawn> = {},
  opp: OpponentController = opponent,
): Sim => {
  const sim = new Sim(rng, opp, { player: playerSpawn(p), enemy: enemySpawn(e) });
  sim.beginCombat();
  sim.drainEvents(); // discard fightStarted — combat tests assert their own events
  return sim;
};
/** Sim still in the 'intro' phase (pre-FIGHT!). */
const introSim = (): Sim =>
  new Sim(rng, opponent, { player: playerSpawn(), enemy: enemySpawn() });

/** Horizontal stroke straight through the ENEMY only (y=200, x 300→500). */
const slashStroke = (): DrawnStroke => new DrawnStroke([v(300, 200), v(500, 200)]);
/** Up-stroke near the player — a jump gesture that grazes nobody. */
const jumpStroke = (fromX = 150, toX = 170): DrawnStroke =>
  new DrawnStroke([v(fromX, 300), v(toX, 100)]);
const tickN = (sim: Sim, n: number): void => {
  for (let i = 0; i < n; i++) sim.tick();
};

describe('Sim — construction, state exposure, hitboxes', () => {
  it('exposes both fighters from their spawns', () => {
    const sim = introSim();
    expect(sim.player.pos).toEqual({ x: 100, y: 200 });
    expect(sim.player.hp).toBe(100);
    expect(sim.player.maxHp).toBe(100);
    expect(sim.player.stance).toBe('balanced');
    expect(sim.enemy.pos).toEqual({ x: 400, y: 200 });
    expect(sim.enemy.hp).toBe(150);
    expect(sim.enemy.maxHp).toBe(150);
    expect(sim.enemy.stance).toBe('heavy');
  });
  it('meters start at FOCUS_START and zero Critical, both fighters', () => {
    const sim = introSim();
    expect(sim.player.focus).toBe(FOCUS_START);
    expect(sim.player.critical).toBe(0);
    expect(sim.enemy.focus).toBe(FOCUS_START);
    expect(sim.enemy.critical).toBe(0);
  });
  it('hitbox(side) is the axis-aligned rect around that fighter', () => {
    const sim = introSim();
    expect(sim.hitbox('enemy')).toEqual([v(380, 160), v(420, 160), v(420, 240), v(380, 240)]);
    expect(sim.hitbox('player')).toEqual([v(80, 160), v(120, 160), v(120, 240), v(80, 240)]);
  });
});

describe('Sim — phase model (intro → fighting → ended)', () => {
  it('starts in intro; beginCombat moves to fighting and emits fightStarted once', () => {
    const sim = introSim();
    expect(sim.phase).toBe('intro');
    sim.beginCombat();
    expect(sim.phase).toBe('fighting');
    const events = sim.drainEvents();
    expect(events).toEqual([{ type: 'fightStarted' }]);
    sim.beginCombat(); // idempotent
    expect(sim.drainEvents()).toEqual([]);
  });
  it('discards strokes before FIGHT! (gate: pre-FIGHT strokes discarded)', () => {
    const sim = introSim();
    const outcome = sim.applyStroke(slashStroke());
    expect(outcome.slash).toBeNull();
    expect(sim.enemy.hp).toBe(150);
    const jump = sim.applyStroke(jumpStroke());
    expect(jump.slash).toBeNull();
    expect(sim.playerJumping).toBe(false);
  });
  it('killing the enemy ends the fight and emits fightEnded exactly once', () => {
    const sim = makeSim();
    for (let i = 0; i < 19; i++) sim.applyStroke(slashStroke()); // 19 × 8 = 152 ≥ 150
    expect(sim.enemy.hp).toBe(0);
    expect(sim.phase).toBe('ended');
    const ended = sim.drainEvents().filter((ev) => ev.type === 'fightEnded');
    expect(ended).toEqual([{ type: 'fightEnded', winner: 'player' }]);
    sim.applyStroke(slashStroke()); // post-fight strokes are discarded
    expect(sim.drainEvents()).toEqual([]);
  });
});

describe('Sim — damage resolution (defense, floor, heavy penalty, counter)', () => {
  it('balanced 10-atk vs heavy 5-def: 10×1.2 − 5×0.8 = 8 exactly (single-form heavy penalty)', () => {
    // The exact 8 pins BOTH the defense-side ×(1−HEAVY_DEF_PENALTY) form AND
    // that STANCE_TABLE.heavy.damageTakenMult (1.25) is NOT also applied:
    // double-application would read 10 or 11, defense-without-penalty 7.
    const sim = makeSim();
    const outcome = sim.applyStroke(slashStroke());
    expect(outcome.slash?.hit).toBe(true);
    expect(outcome.slash?.damage).toBe(8);
    expect(sim.enemy.hp).toBe(142);
  });
  it('non-heavy defender takes full defense: balanced 10-atk vs balanced 5-def → 12 − 5 = 7', () => {
    const sim = makeSim({}, { stance: 'balanced' });
    expect(sim.applyStroke(slashStroke()).slash?.damage).toBe(7);
  });
  it('counter bonus: light beats heavy → 10×0.9×1.25 − 4 = 7.25', () => {
    const sim = makeSim({ stance: 'light' });
    expect(sim.applyStroke(slashStroke()).slash?.damage).toBe(7.25);
  });
  it('counter bonus: balanced beats light → 10×1.2×1.25 − 5 = 10', () => {
    const sim = makeSim({}, { stance: 'light' });
    expect(sim.applyStroke(slashStroke()).slash?.damage).toBe(10);
  });
  it('DAMAGE_FLOOR: overwhelming defense still bleeds 1', () => {
    const sim = makeSim({}, { defense: 100 });
    expect(sim.applyStroke(slashStroke()).slash?.damage).toBe(1);
  });
  it('a missing stroke leaves HP untouched', () => {
    const sim = makeSim();
    const outcome = sim.applyStroke(new DrawnStroke([v(300, 500), v(500, 500)]));
    expect(outcome.slash?.hit).toBe(false);
    expect(sim.enemy.hp).toBe(150);
  });
  it('emits comboChanged + damage per landed hit, and drain clears the queue', () => {
    const sim = makeSim();
    sim.applyStroke(slashStroke());
    expect(sim.drainEvents()).toEqual([
      { type: 'comboChanged', value: 1 },
      { type: 'damage', target: 'enemy', amount: 8, crit: false, severed: [] },
    ]);
    expect(sim.drainEvents()).toEqual([]);
  });
});

describe('Sim — Critical meter (fills in combat, full → next hit crits ×CRIT_MULT)', () => {
  // Fill is multiply-first exact: frames × CRITICAL_FILL_PER_S / FIXED_HZ.
  const framesToFull = (CRITICAL_MAX * FIXED_HZ) / 8; // 8 = CRITICAL_FILL_PER_S (pinned)
  it('fills at CRITICAL_FILL_PER_S while fighting: one second → 8', () => {
    const sim = makeSim();
    tickN(sim, FIXED_HZ);
    expect(sim.player.critical).toBe(8);
  });
  it('does NOT fill during the intro phase', () => {
    const sim = introSim();
    tickN(sim, FIXED_HZ);
    expect(sim.player.critical).toBe(0);
  });
  it('caps at CRITICAL_MAX', () => {
    const sim = makeSim();
    tickN(sim, framesToFull + FIXED_HZ);
    expect(sim.player.critical).toBe(CRITICAL_MAX);
  });
  it('full meter → next landed hit crits ×CRIT_MULT and the meter resets (A/B)', () => {
    const noCrit = makeSim();
    const normal = noCrit.applyStroke(slashStroke()).slash;
    expect(normal?.damage).toBe(8); // A: 10×1.2 − 4

    const sim = makeSim();
    tickN(sim, framesToFull);
    expect(sim.player.critical).toBe(CRITICAL_MAX);
    const crit = sim.applyStroke(slashStroke()).slash;
    expect(crit?.crit).toBe(true);
    expect(crit?.damage).toBeCloseTo(11.6, 10); // B: 10×1.2×1.3 − 4 — attack term ×CRIT_MULT
    expect(sim.player.critical).toBe(0);
    const dmgEvents = sim.drainEvents().filter((ev) => ev.type === 'damage');
    expect(dmgEvents).toEqual([
      { type: 'damage', target: 'enemy', amount: crit?.damage, crit: true, severed: [] },
    ]);
  });
  it('a MISSED stroke does not consume a full meter', () => {
    const sim = makeSim();
    tickN(sim, framesToFull);
    sim.applyStroke(new DrawnStroke([v(300, 500), v(500, 500)]));
    expect(sim.player.critical).toBe(CRITICAL_MAX);
  });
});

describe('Sim — Focus meter + stance switching', () => {
  it('fills at FOCUS_FILL_PER_S while fighting, capped at FOCUS_MAX', () => {
    const sim = makeSim();
    tickN(sim, FIXED_HZ);
    expect(sim.player.focus).toBe(54); // 50 + 4, multiply-first exact
    tickN(sim, FIXED_HZ * 1000);
    expect(sim.player.focus).toBe(100);
  });
  it('out of combat (intro): switch is instant, free, and emitted', () => {
    const sim = introSim();
    expect(sim.requestStanceSwitch('player', 'heavy')).toBe(true);
    expect(sim.player.stance).toBe('heavy');
    expect(sim.player.focus).toBe(FOCUS_START);
    expect(sim.drainEvents()).toEqual([
      { type: 'stanceSwitched', who: 'player', from: 'balanced', to: 'heavy', focusCost: 0 },
    ]);
  });
  it('in combat: denied when focus < FOCUS_SWITCH_COST × WEAPON_WEIGHT[current stance]', () => {
    // balanced → cost 34 × 1.5 = 51 > FOCUS_START 50 → denied at spawn
    const sim = makeSim();
    expect(sim.requestStanceSwitch('player', 'heavy')).toBe(false);
    expect(sim.player.stance).toBe('balanced');
    expect(sim.player.focus).toBe(FOCUS_START);
    expect(sim.drainEvents()).toEqual([
      { type: 'stanceSwitchDenied', who: 'player', needed: 51, focus: 50 },
    ]);
  });
  it('in combat: allowed once filled — drains the weight-scaled cost', () => {
    const sim = makeSim();
    tickN(sim, FIXED_HZ); // focus 54
    expect(sim.requestStanceSwitch('player', 'heavy')).toBe(true);
    expect(sim.player.stance).toBe('heavy');
    expect(sim.player.focus).toBe(3); // 54 − 51, multiply-first exact
    expect(sim.drainEvents()).toEqual([
      { type: 'stanceSwitched', who: 'player', from: 'balanced', to: 'heavy', focusCost: 51 },
    ]);
  });
  it('in combat: light is the cheapest stance to leave (34 × 1.0)', () => {
    const sim = makeSim({ stance: 'light' });
    expect(sim.requestStanceSwitch('player', 'balanced')).toBe(true); // 50 ≥ 34
    expect(sim.player.focus).toBe(16);
  });
  it('switching to the SAME stance is a no-op (no drain, no event)', () => {
    const sim = makeSim({ stance: 'light' });
    expect(sim.requestStanceSwitch('player', 'light')).toBe(false);
    expect(sim.player.focus).toBe(FOCUS_START);
    expect(sim.drainEvents()).toEqual([]);
  });
  it('the enemy pays the same costs (symmetric seam for the Stage-2 AI)', () => {
    const sim = makeSim(); // enemy heavy: cost 34 × 2.5 = 85 > 50 → denied
    expect(sim.requestStanceSwitch('enemy', 'light')).toBe(false);
    expect(sim.enemy.stance).toBe('heavy');
  });
});

describe('Sim — up strokes make the PLAYER jump (start.x → end.x, arc)', () => {
  it('starts the jump at the stroke start x on the player ground line', () => {
    const sim = makeSim();
    const outcome = sim.applyStroke(jumpStroke(300, 320));
    expect(outcome.gesture).toBe('jump');
    expect(sim.playerJumping).toBe(true);
    expect(sim.player.pos).toEqual({ x: 300, y: 200 });
  });
  it('is airborne mid-jump, lands exactly at end x on the ground line', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(300, 320));
    tickN(sim, JUMP_DURATION_FRAMES / 2);
    expect(sim.player.pos.y).toBeLessThan(200);
    tickN(sim, JUMP_DURATION_FRAMES / 2);
    expect(sim.player.pos).toEqual({ x: 320, y: 200 });
    expect(sim.playerJumping).toBe(false);
  });
  it('the enemy never moves on player strokes', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(300, 320));
    tickN(sim, JUMP_DURATION_FRAMES);
    expect(sim.enemy.pos).toEqual({ x: 400, y: 200 });
  });
  it('a jump gesture while airborne is ignored (no mid-air ground capture)', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(300, 320));
    tickN(sim, JUMP_DURATION_FRAMES / 2);
    const midAir = { ...sim.player.pos };
    sim.applyStroke(jumpStroke(500, 520));
    expect(sim.player.pos).toEqual(midAir);
    tickN(sim, JUMP_DURATION_FRAMES);
    expect(sim.player.pos).toEqual({ x: 320, y: 200 });
  });
  it('sequential jumps always land back on the spawn ground line', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(300, 320));
    tickN(sim, JUMP_DURATION_FRAMES);
    sim.applyStroke(jumpStroke(320, 260));
    tickN(sim, JUMP_DURATION_FRAMES);
    expect(sim.player.pos).toEqual({ x: 260, y: 200 });
  });
});

describe('Sim — degenerate strokes are inert at the core seam (audit finding)', () => {
  it('a single-point tap inside the enemy neither hits nor damages', () => {
    const sim = makeSim();
    const outcome = sim.applyStroke(new DrawnStroke([v(400, 200)]));
    expect(outcome.slash).toBeNull();
    expect(sim.enemy.hp).toBe(150);
    expect(sim.playerJumping).toBe(false);
  });
});

describe('Sim — launch and stab classify but do not act yet (M3)', () => {
  it('classifies without damage', () => {
    const sim = makeSim();
    const stab = sim.applyStroke(new DrawnStroke([v(400, 0), v(400, 300)]));
    expect(stab.gesture).toBe('stab');
    expect(stab.slash).toBeNull();
    expect(sim.enemy.hp).toBe(150);
  });
});

describe('Sim — opponent seam is consulted once per fighting tick', () => {
  it('never during intro; once per tick with the current frame while fighting', () => {
    const frames: number[] = [];
    const counting: OpponentController = {
      next: (frame: number) => {
        frames.push(frame);
        return {};
      },
    };
    const sim = new Sim(rng, counting, { player: playerSpawn(), enemy: enemySpawn() });
    tickN(sim, 5);
    expect(frames).toEqual([]); // intro: AI must not act
    sim.beginCombat();
    tickN(sim, 5);
    expect(frames).toEqual([6, 7, 8, 9, 10]);
  });
});

describe('Sim.advance — fixed-step accumulator owned by the Sim (M1)', () => {
  const stepMs = 1000 / FIXED_HZ;
  it('runs one fixed tick per full step of accumulated time', () => {
    const sim = makeSim();
    sim.advance(stepMs);
    expect(sim.frame).toBe(1);
  });
  it('carries fractional remainders across calls', () => {
    const sim = makeSim();
    sim.advance(stepMs * 0.6);
    expect(sim.frame).toBe(0);
    sim.advance(stepMs * 0.6);
    expect(sim.frame).toBe(1);
  });
  it('clamps a single oversized delta to MAX_FRAME_MS', () => {
    const clamped = makeSim();
    clamped.advance(MAX_FRAME_MS);
    const huge = makeSim();
    huge.advance(1e9);
    expect(huge.frame).toBe(clamped.frame);
    expect(clamped.frame).toBeGreaterThanOrEqual(14);
  });
  it('clamps Infinity like any oversized delta (chaos: ∞)', () => {
    const clamped = makeSim();
    clamped.advance(MAX_FRAME_MS);
    const inf = makeSim();
    inf.advance(Number.POSITIVE_INFINITY);
    expect(inf.frame).toBe(clamped.frame);
  });
  it('ignores NaN without poisoning the accumulator (chaos: NaN)', () => {
    const sim = makeSim();
    sim.advance(Number.NaN);
    expect(sim.frame).toBe(0);
    sim.advance(stepMs);
    expect(sim.frame).toBe(1);
  });
  it('ignores negative deltas without rewinding accumulated time (chaos: negative)', () => {
    const sim = makeSim();
    sim.advance(stepMs * 0.9);
    sim.advance(-1000);
    expect(sim.frame).toBe(0);
    sim.advance(stepMs * 0.2);
    expect(sim.frame).toBe(1);
  });
  it('drives gameplay identically to N direct tick() calls (jump arc)', () => {
    const byTicks = makeSim();
    byTicks.applyStroke(jumpStroke(300, 320));
    tickN(byTicks, 3);
    const byAdvance = makeSim();
    byAdvance.applyStroke(jumpStroke(300, 320));
    byAdvance.advance(stepMs * 3);
    expect(byAdvance.player.pos).toEqual(byTicks.player.pos);
  });
});

describe('Sim — enemy strikes via the OpponentIntent seam (M3)', () => {
  /** Opponent that strikes on exactly the given frames. */
  const strikerOn = (strikeFrames: number[]): OpponentController => ({
    next: (frame: number) => (strikeFrames.includes(frame) ? { strike: true } : {}),
  });

  it('a strike damages the player — heavy BEATS balanced: 7×1.4×1.25 − 5 = 7.25', () => {
    const sim = makeSim({}, {}, strikerOn([1]));
    sim.tick();
    expect(sim.player.hp).toBeCloseTo(92.75, 10);
    const dmg = sim.drainEvents().filter((ev) => ev.type === 'damage');
    expect(dmg).toEqual([
      { type: 'damage', target: 'player', amount: expect.closeTo(7.25, 10) as number, crit: false, severed: [] },
    ]);
  });
  it('no counter bonus off the triangle: heavy enemy vs LIGHT player → 7×1.4 − 5 = 4.8', () => {
    const sim = makeSim({ stance: 'light' }, {}, strikerOn([1]));
    sim.tick();
    expect(sim.player.hp).toBeCloseTo(95.2, 10);
  });
  it('an airborne player evades strikes (jump dodge)', () => {
    const sim = makeSim({}, {}, strikerOn([2]));
    sim.applyStroke(jumpStroke(300, 320));
    sim.tick();
    sim.tick(); // strike frame — player mid-jump
    expect(sim.player.hp).toBe(100);
    const evaded = sim.drainEvents().filter((ev) => ev.type === 'strikeEvaded');
    expect(evaded).toEqual([{ type: 'strikeEvaded', by: 'player' }]);
  });
  it('a dead player ends the fight: enemy wins, fightEnded exactly once', () => {
    const frames = Array.from({ length: 60 }, (_, i) => i + 1);
    const sim = makeSim({ hp: 9 }, {}, strikerOn(frames)); // 2 × 7.25 kills
    tickN(sim, 10);
    expect(sim.player.hp).toBe(0);
    expect(sim.phase).toBe('ended');
    const ended = sim.drainEvents().filter((ev) => ev.type === 'fightEnded');
    expect(ended).toEqual([{ type: 'fightEnded', winner: 'enemy' }]);
  });
});

describe('Sim — HIT COMBO counter (M3: player hits chain; damage taken breaks)', () => {
  it('escalates per landed slash and emits comboChanged', () => {
    const sim = makeSim();
    sim.applyStroke(slashStroke());
    sim.applyStroke(slashStroke());
    expect(sim.combo).toBe(2);
    const combos = sim.drainEvents().filter((ev) => ev.type === 'comboChanged');
    expect(combos).toEqual([
      { type: 'comboChanged', value: 1 },
      { type: 'comboChanged', value: 2 },
    ]);
  });
  it('a missed slash does not advance the combo', () => {
    const sim = makeSim();
    sim.applyStroke(new DrawnStroke([v(300, 500), v(500, 500)]));
    expect(sim.combo).toBe(0);
  });
  it('taking a strike breaks the combo to 0', () => {
    const striker: OpponentController = {
      next: (frame: number) => (frame === 1 ? { strike: true } : {}),
    };
    const sim = makeSim({}, {}, striker);
    sim.applyStroke(slashStroke());
    expect(sim.combo).toBe(1);
    sim.tick(); // enemy strike lands
    expect(sim.combo).toBe(0);
  });
  it('a chain gap restarts the chain at 1', () => {
    const sim = makeSim();
    sim.applyStroke(slashStroke());
    sim.applyStroke(slashStroke());
    tickN(sim, 3 * FIXED_HZ + 1); // COMBO_CHAIN_GAP_S = 3
    sim.applyStroke(slashStroke());
    expect(sim.combo).toBe(1);
  });
  it('the killing blow resets the combo to exactly 1 (CONTRACT: reset-to-1, not 0)', () => {
    const sim = makeSim();
    for (let i = 0; i < 19; i++) sim.applyStroke(slashStroke());
    expect(sim.phase).toBe('ended');
    expect(sim.combo).toBe(1);
  });
});

describe('Sim — event queue types are exhaustive for M2', () => {
  it('drainEvents returns SimEvent[] (compile-time shape check)', () => {
    const sim = makeSim();
    sim.applyStroke(slashStroke());
    const events: SimEvent[] = sim.drainEvents();
    expect(events.length).toBeGreaterThan(0);
  });
});
