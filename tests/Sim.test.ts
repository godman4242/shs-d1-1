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
import { CHI_COST, CHI_FILL_PER_S, CHI_MAX } from '../src/config/chi';
import { DASH_SLASH_PX, MAX_FRAME_MS, PLAYER_MOVE_SPEED, SMOKE_BOMB_DISTANCE } from '../src/config/combat-sim';
import { WORLD_WIDTH } from '../src/config/display';
import { JUMP_DURATION_FRAMES } from '../src/config/duel';
import { FIXED_HZ, MS_PER_S, SLASH_FRAMES } from '../src/config/timing';
import { AI_STRIKE_RANGE, AI_TIERS, ENEMY_SPEED } from '../src/config/ai';
import { AISeamController } from '../src/core/AISeamController';
import { DrawnStroke } from '../src/core/DrawnStroke';
import { msToFrames } from '../src/core/time';
import type { OpponentController } from '../src/core/OpponentController';
import { Sim, type FighterSpawn, type Rng, type SimEvent } from '../src/core/Sim';
import { VIEW } from '../src/core/viewport';
import type { Vec } from '../src/core/vec';

/**
 * A0 (SESSION13): the Sim now runs in WORLD space (800×480), not stage space.
 * Every fixture coordinate in this file was authored in the OLD stage space,
 * so `sx()` converts one stage-space fixture number into world. Applying the
 * SAME 1/1.2 factor the render transform uses means every distance, margin
 * and flight time below keeps EXACTLY the relationship to reach / dash /
 * radii that it was originally written to test — a pure similarity
 * transform, not a retune. None of these are gameplay numbers; the real
 * constants all live in src/config and are imported symbolically.
 */
const sx = (stagePx: number): number => stagePx / VIEW.scale;
const v = (x: number, y: number): Vec => ({ x: sx(x), y: sx(y) });
const rng: Rng = () => 0.5;
const opponent: OpponentController = { next: () => ({}) };

/** Player at stage-x 100, enemy at stage-x 400 (world 83.3 / 333.3 — see
 * `sx`) — far enough apart that strokes aimed at one never graze the other
 * (stage-space hitboxes 80..120 and 380..420). */
const playerSpawn = (over: Partial<FighterSpawn> = {}): FighterSpawn => ({
  pos: v(100, 200),
  hp: 100,
  atkPlusWeapon: 10,
  defense: 5,
  stance: 'balanced',
  deflectLearned: true,
  halfW: sx(20),
  halfH: sx(40),
  ...over,
});
const enemySpawn = (over: Partial<FighterSpawn> = {}): FighterSpawn => ({
  pos: v(400, 200),
  hp: 150,
  atkPlusWeapon: 7,
  defense: 5,
  stance: 'heavy',
  deflectLearned: false,
  halfW: sx(20),
  halfH: sx(40),
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
/** A missed slash — ends the player's spawn invuln (offensive act), no damage.
 * Zero-net (there-and-back) so it doesn't dash-through either (Session 9). */
const endInvuln = (sim: Sim): void => {
  sim.applyStroke(new DrawnStroke([v(300, 500), v(500, 500), v(300, 500)]));
};

describe('Sim — construction, state exposure, hitboxes', () => {
  it('exposes both fighters from their spawns', () => {
    const sim = introSim();
    expect(sim.player.pos).toEqual(v(100, 200));
    expect(sim.player.hp).toBe(100);
    expect(sim.player.maxHp).toBe(100);
    expect(sim.player.stance).toBe('balanced');
    expect(sim.enemy.pos).toEqual(v(400, 200));
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
    // Built from the same terms the Sim uses (centre ± half-extent), so the
    // assertion is bit-identical rather than float-noise away from it.
    const rect = (cx: number, cy: number, hw: number, hh: number): Vec[] => [
      { x: cx - hw, y: cy - hh },
      { x: cx + hw, y: cy - hh },
      { x: cx + hw, y: cy + hh },
      { x: cx - hw, y: cy + hh },
    ];
    expect(sim.hitbox('enemy')).toEqual(rect(sx(400), sx(200), sx(20), sx(40)));
    expect(sim.hitbox('player')).toEqual(rect(sx(100), sx(200), sx(20), sx(40)));
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
    expect(sim.player.pos).toEqual(v(300, 200));
  });
  it('is airborne mid-jump, lands exactly at end x on the ground line', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(300, 320));
    tickN(sim, JUMP_DURATION_FRAMES / 2);
    expect(sim.player.pos.y).toBeLessThan(sx(200));
    tickN(sim, JUMP_DURATION_FRAMES / 2);
    expect(sim.player.pos).toEqual(v(320, 200));
    expect(sim.playerJumping).toBe(false);
  });
  it('the enemy never moves on player strokes', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(300, 320));
    tickN(sim, JUMP_DURATION_FRAMES);
    expect(sim.enemy.pos).toEqual(v(400, 200));
  });
  it('a jump gesture while airborne is ignored (no mid-air ground capture)', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(300, 320));
    tickN(sim, JUMP_DURATION_FRAMES / 2);
    const midAir = { ...sim.player.pos };
    sim.applyStroke(jumpStroke(500, 520));
    expect(sim.player.pos).toEqual(midAir);
    tickN(sim, JUMP_DURATION_FRAMES);
    expect(sim.player.pos).toEqual(v(320, 200));
  });
  it('sequential jumps always land back on the spawn ground line', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(300, 320));
    tickN(sim, JUMP_DURATION_FRAMES);
    sim.applyStroke(jumpStroke(320, 260));
    tickN(sim, JUMP_DURATION_FRAMES);
    expect(sim.player.pos).toEqual(v(260, 200));
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
    endInvuln(sim);
    sim.tick();
    expect(sim.player.hp).toBeCloseTo(92.75, 10);
    const dmg = sim.drainEvents().filter((ev) => ev.type === 'damage');
    expect(dmg).toEqual([
      { type: 'damage', target: 'player', amount: expect.closeTo(7.25, 10) as number, crit: false, severed: [] },
    ]);
  });
  it('no counter bonus off the triangle: heavy enemy vs LIGHT player → 7×1.4 − 5 = 4.8', () => {
    const sim = makeSim({ stance: 'light' }, {}, strikerOn([1]));
    endInvuln(sim);
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
    endInvuln(sim);
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
    sim.applyStroke(slashStroke()); // landed hit also ends spawn invuln
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

describe('Sim — kunai projectiles (M3: OpponentIntent.throwKunai)', () => {
  const throwerOn = (throwFrames: number[]): OpponentController => ({
    next: (frame: number) => (throwFrames.includes(frame) ? { throwKunai: true } : {}),
  });

  it('a throw spawns one kunai at the enemy moving toward the player, with an event', () => {
    const sim = makeSim({}, {}, throwerOn([1]));
    sim.tick();
    expect(sim.projectiles).toHaveLength(1);
    expect(sim.projectiles[0]?.pos.x).toBeLessThan(sx(400)); // already stepped once
    const thrown = sim.drainEvents().filter((ev) => ev.type === 'kunaiThrown');
    expect(thrown).toHaveLength(1);
  });
  it('a kunai crossing the player deals PROJECTILE_DMG and despawns (dist 300 → 30 frames)', () => {
    const sim = makeSim({}, {}, throwerOn([1]));
    endInvuln(sim);
    tickN(sim, 30);
    expect(sim.player.hp).toBe(92); // 100 − 8
    expect(sim.projectiles).toHaveLength(0);
  });
  it('active kunai are capped at PROJECTILE_MAX_ACTIVE', () => {
    const sim = makeSim({}, {}, throwerOn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
    tickN(sim, 10);
    expect(sim.projectiles.length).toBeLessThanOrEqual(8);
    const thrown = sim.drainEvents().filter((ev) => ev.type === 'kunaiThrown');
    expect(thrown).toHaveLength(8);
  });
  it('a jumping player evades kunai (arc lifts out of the hit radius)', () => {
    const sim = makeSim({}, {}, throwerOn([1]));
    tickN(sim, 20); // kunai closes in: 300 − 20×9.17 ≈ 117 px away
    sim.applyStroke(jumpStroke(100, 100)); // jump in place
    tickN(sim, 12); // apex ≈ 120 px up at t=0.5 — kunai passes underneath
    expect(sim.player.hp).toBe(100);
  });
});

describe('Sim — skills via queueSkill (M3: SKILL_VERB hotbar)', () => {
  it('chiPunch deals a flat 10 (CONTRACT: on-screen dealt damage — bypasses defense)', () => {
    const sim = makeSim();
    sim.queueSkill('chiPunch');
    sim.tick();
    expect(sim.enemy.hp).toBe(140); // 150 − 10 flat, despite defense 5
    const used = sim.drainEvents().filter((ev) => ev.type === 'skillUsed');
    expect(used).toEqual([{ type: 'skillUsed', verb: 'chiPunch' }]);
  });
  it('chiPunch respects its cooldown (4.96 s): second cast ignored until ready', () => {
    const sim = makeSim();
    sim.queueSkill('chiPunch');
    sim.tick();
    sim.queueSkill('chiPunch');
    sim.tick();
    expect(sim.enemy.hp).toBe(140); // still one hit
    tickN(sim, 298); // cooldown 4960 ms → 298 frames
    sim.queueSkill('chiPunch');
    sim.tick();
    expect(sim.enemy.hp).toBe(130);
  });
  it('cooldownRemainingS counts down for the HUD', () => {
    const sim = makeSim();
    expect(sim.cooldownRemainingS('chiPunch')).toBe(0);
    sim.queueSkill('chiPunch');
    sim.tick();
    expect(sim.cooldownRemainingS('chiPunch')).toBeGreaterThan(4.8);
    tickN(sim, 60);
    expect(sim.cooldownRemainingS('chiPunch')).toBeLessThan(4);
  });
  it('smokeBomb dashes AWAY from the enemy by SMOKE_BOMB_DISTANCE (clamped to the arena)', () => {
    const sim = makeSim({ pos: v(350, 200) });
    sim.queueSkill('smokeBomb');
    sim.tick();
    expect(sim.player.pos.x).toBe(sx(350) - SMOKE_BOMB_DISTANCE); // away from the enemy
    const clamped = makeSim(); // player at 100: 100 − 180 → clamp to halfW 20
    clamped.queueSkill('smokeBomb');
    clamped.tick();
    expect(clamped.player.pos.x).toBe(sx(20));
  });
  it('smokeBomb grants i-frames: strikes are blocked during SMOKE_BOMB_IFRAMES_MS', () => {
    const striker: OpponentController = {
      next: (frame: number) => (frame === 5 || frame === 40 ? { strike: true } : {}),
    };
    const sim = makeSim({}, {}, striker);
    endInvuln(sim); // spawn invuln out of the way — this tests SMOKE i-frames
    sim.queueSkill('smokeBomb');
    sim.tick(); // frame 1: smoke bomb; i-frames until frame 1+26=27
    tickN(sim, 10); // frame 5 strike blocked
    expect(sim.player.hp).toBe(100);
    const blocked = sim.drainEvents().filter((ev) => ev.type === 'invulnBlocked');
    expect(blocked).toEqual([{ type: 'invulnBlocked', target: 'player' }]);
    tickN(sim, 30); // frame 40 strike lands (i-frames over)
    expect(sim.player.hp).toBeCloseTo(92.75, 10);
  });
  it('smokeBomb i-frames block kunai too', () => {
    const thrower: OpponentController = {
      next: (frame: number) => (frame === 1 ? { throwKunai: true } : {}),
    };
    const sim = makeSim({}, {}, thrower);
    endInvuln(sim); // this tests SMOKE i-frames, not spawn invuln
    tickN(sim, 25); // kunai ~71 px out
    sim.queueSkill('smokeBomb'); // dash away + i-frames
    tickN(sim, 15);
    expect(sim.player.hp).toBe(100);
  });
  it('stab (key 3) swats kunai inside DEFLECT_RADIUS during the window', () => {
    const thrower: OpponentController = {
      next: (frame: number) => (frame === 1 ? { throwKunai: true } : {}),
    };
    const sim = makeSim({}, {}, thrower);
    tickN(sim, 26); // kunai at 300 − 26×9.17 ≈ 61.7 px — inside DEFLECT_RADIUS 64
    sim.queueSkill('stab');
    sim.tick();
    expect(sim.projectiles).toHaveLength(0);
    expect(sim.player.hp).toBe(100);
    const deflected = sim.drainEvents().filter((ev) => ev.type === 'kunaiDeflected');
    expect(deflected).toHaveLength(1);
  });
  it('a stab gesture (down-stroke) opens the same deflect window', () => {
    const thrower: OpponentController = {
      next: (frame: number) => (frame === 1 ? { throwKunai: true } : {}),
    };
    const sim = makeSim({}, {}, thrower);
    tickN(sim, 24); // kunai ≈ 80 px out — outside radius, inside window reach
    sim.applyStroke(new DrawnStroke([v(100, 100), v(100, 300)])); // stab gesture
    tickN(sim, 4); // kunai flies INTO the open window's radius
    expect(sim.projectiles).toHaveLength(0);
    expect(sim.player.hp).toBe(100);
  });
  it('without deflectLearned the stab does not swat (kunai lands)', () => {
    const thrower: OpponentController = {
      next: (frame: number) => (frame === 1 ? { throwKunai: true } : {}),
    };
    const sim = makeSim({ deflectLearned: false }, {}, thrower);
    endInvuln(sim);
    tickN(sim, 26);
    sim.queueSkill('stab');
    tickN(sim, 10);
    expect(sim.player.hp).toBe(92);
  });
});

describe('Sim — spawn invulnerability (M3: player-only, 5 s or first slash)', () => {
  const strikerOn = (frames: number[]): OpponentController => ({
    next: (frame: number) => (frames.includes(frame) ? { strike: true } : {}),
  });
  it('the player spawns invulnerable; strikes are blocked and flagged', () => {
    const sim = makeSim({}, {}, strikerOn([10]));
    expect(sim.player.invulnerable).toBe(true);
    expect(sim.enemy.invulnerable).toBe(false); // enemy never gets spawn invuln
    tickN(sim, 20);
    expect(sim.player.hp).toBe(100);
    const blocked = sim.drainEvents().filter((ev) => ev.type === 'invulnBlocked');
    expect(blocked).toEqual([{ type: 'invulnBlocked', target: 'player' }]);
  });
  it('expires after SPAWN_INVULN_S (300 frames): frame 299 blocked, frame 301 lands', () => {
    const sim = makeSim({}, {}, strikerOn([299, 301]));
    tickN(sim, 299);
    expect(sim.player.hp).toBe(100); // strike at 299 still blocked
    expect(sim.player.invulnerable).toBe(true); // 299 < 300
    tickN(sim, 2);
    expect(sim.player.invulnerable).toBe(false);
    expect(sim.player.hp).toBeCloseTo(92.75, 10); // strike at 301 lands
  });
  it('ends on the player’s FIRST SLASH (even a miss)', () => {
    const sim = makeSim({}, {}, strikerOn([5]));
    sim.applyStroke(new DrawnStroke([v(300, 500), v(500, 500)])); // missed slash
    expect(sim.player.invulnerable).toBe(false);
    tickN(sim, 6);
    expect(sim.player.hp).toBeCloseTo(92.75, 10);
  });
  it('a jump does NOT end spawn invuln (only offensive acts do)', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(100, 120));
    expect(sim.player.invulnerable).toBe(true);
  });
  it('the first slash still damages the enemy immediately (enemy has no invuln)', () => {
    const sim = makeSim();
    expect(sim.applyStroke(slashStroke()).slash?.damage).toBe(8);
    expect(sim.enemy.hp).toBe(142);
  });
});

describe('Sim — Shunpo slow-mo (M3: SHIFT-hold, meter in exact 1/60 units)', () => {
  it('holding SHIFT activates: timeScale 0.35, drains 34/s of sim time', () => {
    const sim = makeSim();
    expect(sim.timeScale).toBe(1);
    expect(sim.shunpo).toBe(100);
    sim.setPlayerIntent({ moveX: 0, shunpoHeld: true });
    sim.tick();
    expect(sim.timeScale).toBe(0.35);
    tickN(sim, 59);
    expect(sim.shunpo).toBe(66); // 100 − 34, integer units exact
    const started = sim.drainEvents().filter((ev) => ev.type === 'shunpoStarted');
    expect(started).toHaveLength(1);
  });
  it('release refills at 12/s toward SHUNPO_MAX', () => {
    const sim = makeSim();
    sim.setPlayerIntent({ moveX: 0, shunpoHeld: true });
    tickN(sim, 60); // meter 66
    sim.setPlayerIntent({ moveX: 0, shunpoHeld: false });
    sim.tick();
    expect(sim.timeScale).toBe(1);
    tickN(sim, 59);
    expect(sim.shunpo).toBe(78); // 66 + 12
    const ended = sim.drainEvents().filter((ev) => ev.type === 'shunpoEnded');
    expect(ended).toHaveLength(1);
  });
  it('auto-stops at 0 and restarts at SHUNPO_MIN_TO_START while held (hysteresis)', () => {
    const sim = makeSim();
    sim.setPlayerIntent({ moveX: 0, shunpoHeld: true });
    tickN(sim, 177); // 6000 units / 34 → empty inside 177 ticks
    expect(sim.shunpo).toBe(0);
    expect(sim.timeScale).toBe(1); // stopped
    tickN(sim, 50); // refill 12/s while held-but-stopped → hits 10 → restarts
    expect(sim.timeScale).toBe(0.35);
  });
  it('cannot start below SHUNPO_MIN_TO_START', () => {
    const sim = makeSim();
    sim.setPlayerIntent({ moveX: 0, shunpoHeld: true });
    tickN(sim, 177); // empty + stopped
    sim.setPlayerIntent({ moveX: 0, shunpoHeld: false });
    tickN(sim, 10); // refill to 2
    sim.setPlayerIntent({ moveX: 0, shunpoHeld: true });
    sim.tick();
    expect(sim.timeScale).toBe(1); // 2 < 10 — no start
  });
});

describe('Sim — player movement intent (M3: A/D at PLAYER_MOVE_SPEED)', () => {
  it('moveX advances 0.28 px/ms of sim time: 60 frames → 280 px', () => {
    const sim = makeSim();
    sim.setPlayerIntent({ moveX: 1, shunpoHeld: false });
    tickN(sim, 60);
    expect(sim.player.pos.x).toBeCloseTo(sx(100) + PLAYER_MOVE_SPEED * MS_PER_S, 9);
  });
  it('clamps to the arena edge', () => {
    const sim = makeSim();
    sim.setPlayerIntent({ moveX: -1, shunpoHeld: false });
    tickN(sim, 60);
    expect(sim.player.pos.x).toBe(sx(20)); // halfW
  });
  it('is ignored while jumping (the arc owns the position)', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke(100, 100)); // jump in place
    sim.setPlayerIntent({ moveX: 1, shunpoHeld: false });
    tickN(sim, JUMP_DURATION_FRAMES);
    expect(sim.player.pos.x).toBe(sx(100)); // landed where the stroke said
  });
  it('does nothing during the intro phase', () => {
    const sim = introSim();
    sim.setPlayerIntent({ moveX: 1, shunpoHeld: false });
    tickN(sim, 60);
    expect(sim.player.pos.x).toBe(sx(100));
  });
  it('rejects non-finite moveX (chaos: NaN intent must not poison the position)', () => {
    const sim = makeSim();
    sim.setPlayerIntent({ moveX: Number.NaN, shunpoHeld: false });
    tickN(sim, 10);
    expect(sim.player.pos.x).toBe(sx(100));
    expect(Number.isFinite(sim.player.pos.x)).toBe(true);
  });
});

describe('Sim + AISeamController — integrated duel loop (M4)', () => {
  it('enemy approaches, telegraphs (event ≥ telegraphMs before impact), then strikes', () => {
    const ai = new AISeamController(() => 0.99, AI_TIERS.normal); // no kunai/stance rolls pass...
    // 0.99 fails aggression too — use a two-phase rng: fail chance rolls until
    // in range, then pass everything (deterministic scripted stream is fine).
    let inRange = false;
    const scripted = new AISeamController(() => (inRange ? 0 : 0.99), AI_TIERS.normal);
    const sim = new Sim(() => 0.5, scripted, { player: playerSpawn(), enemy: enemySpawn({ pos: v(700, 200) }) });
    sim.beginCombat();
    sim.drainEvents();
    endInvuln(sim);
    const events: Array<{ frame: number; ev: SimEvent }> = [];
    let telegraphFrame = -1;
    let damageFrame = -1;
    for (let f = 0; f < 2000 && damageFrame < 0; f++) {
      const dist = Math.abs(sim.enemy.pos.x - sim.player.pos.x);
      inRange = dist <= AI_STRIKE_RANGE;
      sim.tick();
      for (const ev of sim.drainEvents()) {
        events.push({ frame: sim.frame, ev });
        if (ev.type === 'enemyTelegraph' && ev.kind === 'strike' && telegraphFrame < 0) telegraphFrame = sim.frame;
        if (ev.type === 'damage' && ev.target === 'player' && damageFrame < 0) damageFrame = sim.frame;
      }
    }
    expect(telegraphFrame).toBeGreaterThan(0); // enemy telegraphed
    expect(damageFrame).toBeGreaterThan(0); // and eventually landed
    expect(damageFrame - telegraphFrame).toBeGreaterThanOrEqual(32); // ≥ 520 ms at 60 Hz
    void ai;
  });
  it('enemy movement is executed by the Sim at ENEMY_SPEED toward the player', () => {
    const approach = new AISeamController(() => 0.99, AI_TIERS.easy);
    const sim = new Sim(() => 0.5, approach, { player: playerSpawn(), enemy: enemySpawn({ pos: v(700, 200) }) });
    sim.beginCombat();
    tickN(sim, 60);
    // 0.17 px/ms × 1000 ms = 170 px in one second of approach
    expect(sim.enemy.pos.x).toBeCloseTo(sx(700) - ENEMY_SPEED * MS_PER_S, 6);
  });
  it('enemy stance switch arrives telegraphed and Focus-gated through the same Sim rule', () => {
    const picker = new AISeamController(() => 0, AI_TIERS.normal);
    // player light + enemy light (cost 34 ≤ 50): pick balanced (beats light)
    const sim = new Sim(() => 0.5, picker, {
      player: playerSpawn({ stance: 'light' }),
      enemy: enemySpawn({ pos: v(200, 200), stance: 'light' }),
    });
    sim.beginCombat();
    sim.drainEvents();
    tickN(sim, msToFrames(600) + 2);
    const evs = sim.drainEvents();
    expect(evs.some((e) => e.type === 'enemyTelegraph' && e.kind === 'stance')).toBe(true);
    expect(evs.some((e) => e.type === 'stanceSwitched' && e.who === 'enemy' && e.to === 'balanced')).toBe(true);
    expect(sim.enemy.stance).toBe('balanced');
  });
  it('a blocking enemy negates the slash without consuming the crit meter', () => {
    const blocker: OpponentController = {
      next: () => ({}),
      react: () => 'block',
    };
    const sim = makeSim({}, {}, blocker);
    tickN(sim, 750); // fill Critical to max
    expect(sim.player.critical).toBe(100);
    const outcome = sim.applyStroke(slashStroke());
    expect(outcome.slash?.hit).toBe(false);
    expect(sim.enemy.hp).toBe(150);
    expect(sim.player.critical).toBe(100); // NOT consumed on a blocked swing
    expect(sim.combo).toBe(0); // no hit — no chain
    const blocked = sim.drainEvents().filter((e) => e.type === 'strikeBlocked');
    expect(blocked).toEqual([{ type: 'strikeBlocked', by: 'enemy' }]);
  });
});

describe('Sim — audit fixes (mid-tick kill, shunpo end, intro skills, jump clamp)', () => {
  it('a kill mid-tick stops the rest of the tick: exactly ONE fightEnded, no posthumous hits', () => {
    // chiPunch kills the enemy the same tick a kunai reaches the player.
    const thrower: OpponentController = {
      next: (frame: number) => (frame === 1 ? { throwKunai: true } : {}),
    };
    const sim = makeSim({ hp: 8 }, { hp: 10 }, thrower);
    endInvuln(sim);
    tickN(sim, 28); // kunai ~43px out — arrives within the next few ticks
    sim.queueSkill('chiPunch'); // kills the 10-hp enemy on the next tick
    tickN(sim, 5);
    const events = sim.drainEvents();
    const ended = events.filter((e) => e.type === 'fightEnded');
    expect(ended).toEqual([{ type: 'fightEnded', winner: 'player' }]);
    expect(sim.player.hp).toBe(8); // the in-flight kunai never hit a winner
    expect(sim.phase).toBe('ended');
  });
  it('ending the fight while Shunpo is active emits shunpoEnded and restores timeScale', () => {
    const sim = makeSim({}, { hp: 5 });
    sim.setPlayerIntent({ moveX: 0, shunpoHeld: true });
    sim.tick();
    expect(sim.timeScale).toBe(0.35);
    sim.applyStroke(slashStroke()); // kills the 5-hp enemy
    expect(sim.phase).toBe('ended');
    expect(sim.timeScale).toBe(1);
    const ended = sim.drainEvents().filter((e) => e.type === 'shunpoEnded');
    expect(ended).toHaveLength(1);
  });
  it('skill presses during the intro are DISCARDED like strokes (gate parity)', () => {
    const sim = introSim();
    sim.queueSkill('chiPunch');
    sim.beginCombat();
    sim.drainEvents();
    sim.tick();
    expect(sim.enemy.hp).toBe(150); // no buffered cast on the first fighting tick
    expect(sim.drainEvents().filter((e) => e.type === 'skillUsed')).toEqual([]);
  });
  it('jump strokes are clamped to the arena (no off-screen landings)', () => {
    const low = makeSim();
    low.applyStroke(new DrawnStroke([v(-300, 400), v(-280, 60)])); // steep up, off-arena left
    expect(low.playerJumping).toBe(true);
    tickN(low, JUMP_DURATION_FRAMES);
    expect(low.player.pos.x).toBe(sx(20)); // clamped to halfW
    const high = makeSim();
    high.applyStroke(new DrawnStroke([v(5000, 400), v(5010, 50)])); // off-arena right
    expect(high.playerJumping).toBe(true);
    tickN(high, JUMP_DURATION_FRAMES);
    expect(high.player.pos.x).toBe(WORLD_WIDTH - sx(20)); // WORLD_WIDTH − halfW
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

describe('Sim — Chi meter + skill costs (Stage 3 M3, the Stage-2 deferral)', () => {
  it('chi starts full and is exposed on the fighter views', () => {
    const sim = makeSim();
    expect(sim.player.chi).toBe(CHI_MAX);
    expect(sim.player.maxChi).toBe(CHI_MAX);
    expect(sim.enemy.chi).toBe(CHI_MAX); // enemy pool exists but never spends (flagged)
  });

  it('every skill charges its pinned CHI_COST on cast (fill clamps at max pre-spend)', () => {
    for (const verb of ['chiPunch', 'smokeBomb', 'stab'] as const) {
      const sim = makeSim();
      sim.queueSkill(verb);
      sim.tick();
      expect(sim.player.chi).toBe(CHI_MAX - CHI_COST[verb]);
    }
  });

  it('chi refills at CHI_FILL_PER_S during fighting (integer frame-units, exact)', () => {
    const sim = makeSim();
    sim.queueSkill('chiPunch');
    sim.tick(); // exactly CHI_MAX − cost: the cast tick's fill clamped at max
    tickN(sim, FIXED_HZ); // one full second of refill
    expect(sim.player.chi).toBe(CHI_MAX - CHI_COST.chiPunch + CHI_FILL_PER_S);
  });

  it('insufficient chi → skillDenied; no effect, no spend, cooldown NOT consumed (chaos)', () => {
    const sim = makeSim({ chi: 20 }); // below chiPunch's cost
    sim.queueSkill('chiPunch');
    sim.tick();
    expect(sim.enemy.hp).toBe(150); // no hit landed
    const evs = sim.drainEvents();
    expect(evs.filter((ev) => ev.type === 'skillUsed')).toEqual([]);
    expect(evs.filter((ev) => ev.type === 'skillDenied')).toEqual([
      { type: 'skillDenied', verb: 'chiPunch', needed: CHI_COST.chiPunch, chi: expect.any(Number) as number },
    ]);
    expect(sim.cooldownRemainingS('chiPunch')).toBe(0); // cooldown untouched
    // 150 fill ticks total put chi at EXACTLY the cost on the cast tick; a
    // consumed cooldown (298 frames) would still block here, so a landed hit
    // proves the denial spent neither chi nor cooldown.
    tickN(sim, 148);
    sim.queueSkill('chiPunch');
    sim.tick();
    expect(sim.enemy.hp).toBe(140);
    expect(sim.player.chi).toBe(0);
  });

  it('cooldown still gates independently — a CD-blocked cast is silent and spends nothing', () => {
    const sim = makeSim();
    sim.queueSkill('chiPunch');
    sim.tick();
    sim.drainEvents();
    sim.queueSkill('chiPunch');
    sim.tick(); // on cooldown → silently ignored (Stage-2 behavior, unchanged)
    expect(sim.enemy.hp).toBe(140); // one hit only
    const evs = sim.drainEvents();
    expect(evs.filter((ev) => ev.type === 'skillUsed' || ev.type === 'skillDenied')).toEqual([]);
    // chi: spent once, then refilled for exactly one post-cast tick
    expect(sim.player.chi).toBe(
      ((CHI_MAX - CHI_COST.chiPunch) * FIXED_HZ + CHI_FILL_PER_S) / FIXED_HZ,
    );
  });
});

describe('Sim — dash-through slash (Session 9: MEASURED strike-C 1-frame snap)', () => {
  // The OG attacker translates in EXACTLY ONE video frame (±235–240 px @1080
  // ≈ DASH_SLASH_PX stage px) along the attack line, passing THROUGH the
  // target; the streak renders after arrival. Sim territory: position is
  // gameplay. Direction = sign of the stroke's net x (the drawn line IS the
  // attack line); fixed distance (constant across all three measured dashes
  // ⇒ pass-through, not stop-at-target); arena-clamped like every other
  // movement verb.
  it('a rightward slash that hits dashes the player +DASH_SLASH_PX in the same call AND still damages', () => {
    const sim = makeSim();
    sim.applyStroke(slashStroke()); // 300→500 through the enemy
    expect(sim.player.pos.x).toBe(sx(100) + DASH_SLASH_PX);
    expect(sim.enemy.hp).toBe(142); // hit resolution unchanged by the dash
  });
  it('a leftward slash dashes −DASH_SLASH_PX', () => {
    const sim = makeSim({ pos: v(300, 200) });
    sim.applyStroke(new DrawnStroke([v(500, 200), v(300, 200)])); // through the enemy, leftward
    expect(sim.player.pos.x).toBe(sx(300) - DASH_SLASH_PX);
  });
  it('a missed slash still dashes (the lunge is part of the swing, hit or not)', () => {
    const sim = makeSim();
    sim.applyStroke(new DrawnStroke([v(300, 500), v(500, 500)])); // grazes nobody
    expect(sim.player.pos.x).toBe(sx(100) + DASH_SLASH_PX);
    expect(sim.enemy.hp).toBe(150);
  });
  it('a blocked slash still dashes (OG: clash freeze happens AT arrival)', () => {
    const sim = makeSim({}, {}, { next: () => ({}), react: () => 'block' });
    sim.applyStroke(slashStroke());
    expect(sim.player.pos.x).toBe(sx(100) + DASH_SLASH_PX);
    expect(sim.enemy.hp).toBe(150); // blocked — no damage
  });
  it('dash clamps at the right arena wall', () => {
    const sim = makeSim({ pos: { x: WORLD_WIDTH - sx(30), y: sx(200) } }); // max x is WORLD_WIDTH − halfW
    sim.applyStroke(new DrawnStroke([v(300, 500), v(500, 500)]));
    expect(sim.player.pos.x).toBe(WORLD_WIDTH - sx(20));
  });
  it('dash clamps at the left arena wall', () => {
    const sim = makeSim(); // x=100, −127 would land at −27
    sim.applyStroke(new DrawnStroke([v(500, 500), v(300, 500)]));
    expect(sim.player.pos.x).toBe(sx(20));
  });
  it('no dash while airborne — the jump arc owns the position', () => {
    const sim = makeSim();
    sim.applyStroke(jumpStroke());
    tickN(sim, 3); // mid-arc
    const before = sim.player.pos;
    sim.applyStroke(new DrawnStroke([v(300, 500), v(500, 500)]));
    expect(sim.player.pos).toEqual(before);
  });
  it('a zero-net (there-and-back) slash has no attack line — no dash', () => {
    const sim = makeSim();
    sim.applyStroke(new DrawnStroke([v(300, 500), v(500, 500), v(300, 500)]));
    expect(sim.player.pos.x).toBe(sx(100));
  });
  it('pre-FIGHT strokes are discarded — no dash in intro', () => {
    const sim = introSim();
    sim.applyStroke(slashStroke());
    expect(sim.player.pos.x).toBe(sx(100));
  });
  // ── Review-hardened bounds (Session 9 adversarial review, all CONFIRMED) ──
  it('dash is rate-limited to the measured strike interval (SLASH_FRAMES total per stance)', () => {
    // Review finding: unlimited dashing made scribble-spam a teleport verb
    // (8 micro-slashes crossed the arena at frame 0). The OG's measured
    // strike-to-strike interval (12/16/20f) is the swing cycle — one dash
    // per cycle.
    const sim = makeSim();
    const miss = (): void => {
      sim.applyStroke(new DrawnStroke([v(300, 500), v(500, 500)]));
    };
    miss(); // dashes
    miss(); // same tick — still inside the swing cycle, no second dash
    expect(sim.player.pos.x).toBe(sx(100) + DASH_SLASH_PX);
    const cycle = SLASH_FRAMES.balanced; // player spawns balanced
    tickN(sim, cycle.windup + cycle.active + cycle.recovery);
    miss(); // cycle complete — dash available again
    expect(sim.player.pos.x).toBe(sx(100) + 2 * DASH_SLASH_PX);
  });
  it('a slash inside the dash cooldown still resolves damage — only movement is gated', () => {
    const sim = makeSim();
    sim.applyStroke(new DrawnStroke([v(300, 500), v(500, 500)])); // consumes the dash
    const outcome = sim.applyStroke(slashStroke()); // hits the enemy, no dash left
    expect(outcome.slash?.hit).toBe(true);
    expect(sim.enemy.hp).toBe(142);
    expect(sim.player.pos.x).toBe(sx(100) + DASH_SLASH_PX); // second slash did not move us
  });
  it('a micro-slip stroke (under DASH_MIN_STROKE_PX) never dashes', () => {
    // Review finding: a ~5px mouse slip classified as a slash and teleported
    // the player 127px (and it already ends spawn invuln — pre-existing).
    const sim = makeSim();
    sim.applyStroke(new DrawnStroke([v(100, 500), v(105, 500)]));
    expect(sim.player.pos.x).toBe(sx(100));
  });
  it('an airborne slash still resolves damage — ONLY the dash is skipped', () => {
    // Mutation pin: an implementation that discards the whole mid-air slash
    // (not just its dash) must fail here. Session 11 adjudication: the reach
    // gate is real now, so the enemy must BE within reach — the default x=400
    // spawn is ~236px from the mid-arc player (152.5, 147.5), beyond balanced
    // reach 200, and correctly whiffs (CRUX behavior). Spawn the enemy at
    // x=280 (~138px away, in reach) and slash through it.
    const sim = makeSim({}, { pos: v(280, 200) });
    sim.applyStroke(jumpStroke());
    tickN(sim, 3); // mid-arc — player at (152.5, 147.5)
    const outcome = sim.applyStroke(new DrawnStroke([v(200, 200), v(350, 200)]));
    expect(outcome.slash?.hit).toBe(true);
    expect(sim.enemy.hp).toBe(142);
  });
  it('a diagonal slash dashes the FULL fixed distance (sign of net-x, not x-component scaling)', () => {
    // Mutation pin: `direction.x * DASH_SLASH_PX` (no Math.sign) would move
    // only 0.8 × 127 ≈ 102px here and must fail.
    const sim = makeSim();
    sim.applyStroke(new DrawnStroke([v(300, 380), v(460, 500)])); // net (160,120): 36.9° → slash
    expect(sim.player.pos.x).toBe(sx(100) + DASH_SLASH_PX);
  });
});
