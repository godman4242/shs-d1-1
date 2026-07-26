/**
 * AUTO SLASH (SESSION13 A3 / D7) — the toggle hands the player's fighter to
 * the enemy AI decision routine and locks out manual input entirely.
 *
 * Why this matters beyond the feature (kickoff D7): it is the strongest
 * available test that the slash pipeline is correctly FACTORED. If auto-slash
 * can drive it, the player path and the AI path share one implementation —
 * exactly as the original does. So the assertions below deliberately check
 * that the synthesised stroke goes through `applyStroke`, dashes, damages and
 * advances the combo like any hand-drawn one, rather than through a shortcut.
 *
 * Contract:
 * - decision every AI_THINK_INTERVAL_MS, never while slashing or airborne
 * - nearest living target by |Δx|, unlimited range, no line-of-sight
 * - stroke = floor(reach / AUTO_SLASH_POINT_SPACING) points, spacing apart,
 *   anchored at the player and aimed at the target
 * - the generated line is emitted so the scene can DRAW it
 * - HUD/skills keep working; only drawing and move orders are locked out
 */
import { describe, expect, it } from 'vitest';
import { AI_THINK_INTERVAL_MS, AUTO_SLASH_POINT_SPACING } from '../src/config/ai';
import { MOVE_RUN_PX_S, MOVE_STANDING_RANGE_PX } from '../src/config/combat-sim';
import { reachFor } from '../src/core/mastery';

import { ENEMY_STATS, PLAYER_STATS } from '../src/config/stats';
import { FIXED_HZ, MS_PER_S, SLASH_FRAMES } from '../src/config/timing';
import { DrawnStroke } from '../src/core/DrawnStroke';
import type { OpponentController } from '../src/core/OpponentController';
import { Sim, type FighterSpawn, type SimEvent } from '../src/core/Sim';
import { VIEW } from '../src/core/viewport';
import type { Vec } from '../src/core/vec';

const sx = (stagePx: number): number => stagePx / VIEW.scale;
const v = (x: number, y: number): Vec => ({ x: sx(x), y: sx(y) });

const playerSpawn = (over: Partial<FighterSpawn> = {}): FighterSpawn => ({
  pos: v(100, 200),
  hp: 100,
  minDamage: 10,
  damageRange: 0,
  stats: PLAYER_STATS,
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
  minDamage: 7,
  damageRange: 0,
  stats: ENEMY_STATS,
  defense: 5,
  stance: 'heavy',
  deflectLearned: false,
  halfW: sx(20),
  halfH: sx(40),
  ...over,
});

const idle: OpponentController = { next: () => ({}) };
/** Always wants to swing — isolates the Sim-side gating from AI pacing. */
const striker: OpponentController = { next: () => ({ strike: true }) };
/** Always wants to close. */
const closer: OpponentController = { next: () => ({ moveX: 1 }) };

const makeSim = (
  auto: OpponentController | null,
  p: Partial<FighterSpawn> = {},
  e: Partial<FighterSpawn> = {},
): Sim => {
  const sim = new Sim(() => 0.5, idle, { player: playerSpawn(p), enemy: enemySpawn(e) }, auto);
  sim.beginCombat();
  sim.drainEvents();
  return sim;
};
const tickN = (sim: Sim, n: number): void => {
  for (let i = 0; i < n; i++) sim.tick();
};
const THINK_FRAMES = Math.round((AI_THINK_INTERVAL_MS * FIXED_HZ) / MS_PER_S);

describe('AUTO SLASH — the toggle itself', () => {
  it('is OFF by default (the plate must not lie)', () => {
    expect(makeSim(striker).autoSlash).toBe(false);
  });
  it('turning it on with NO injected controller FAILS CLOSED rather than silently doing nothing', () => {
    const sim = makeSim(null);
    expect(() => { sim.setAutoSlash(true); }).toThrow();
    expect(sim.autoSlash).toBe(false);
  });
  it('toggles on and back off', () => {
    const sim = makeSim(striker);
    sim.setAutoSlash(true);
    expect(sim.autoSlash).toBe(true);
    sim.setAutoSlash(false);
    expect(sim.autoSlash).toBe(false);
  });
});

describe('AUTO SLASH — manual input is locked out (D7), skills are not', () => {
  it('a hand-drawn slash is DISCARDED while auto-slash is on', () => {
    const sim = makeSim(idle);
    sim.setAutoSlash(true);
    const before = { ...sim.player.pos };
    const outcome = sim.applyStroke(new DrawnStroke([v(300, 200), v(500, 200)]));
    expect(outcome.slash).toBeNull();
    expect(sim.enemy.hp).toBe(150); // no damage
    expect(sim.player.pos).toEqual(before); // and no dash
  });
  it('manual move orders are ignored while auto-slash is on', () => {
    const sim = makeSim(idle);
    sim.setAutoSlash(true);
    const before = sim.player.pos.x;
    sim.setPlayerIntent({ moveX: 1, shunpoHeld: false });
    tickN(sim, 30);
    expect(sim.player.pos.x).toBe(before);
  });
  it('skills still work (HUD/skills are explicitly NOT locked out)', () => {
    const sim = makeSim(idle);
    sim.setAutoSlash(true);
    sim.queueSkill('chiPunch');
    sim.tick();
    expect(sim.enemy.hp).toBe(140); // flat 10, as ever
  });
  it('turning auto-slash back OFF restores manual control', () => {
    const sim = makeSim(idle);
    sim.setAutoSlash(true);
    sim.setAutoSlash(false);
    const outcome = sim.applyStroke(new DrawnStroke([v(300, 200), v(500, 200)]));
    expect(outcome.slash?.hit).toBe(true);
  });
});

describe('AUTO SLASH — the synthesised stroke goes through the SAME pipeline', () => {
  it('lands damage, dashes and advances the combo exactly like a drawn stroke', () => {
    // In melee range: the synthesised line is built from the attacker's PRE-dash
    // position, so a swing from across the arena correctly whiffs (the range
    // check is the AI's job — D8's `|dx| < 50` gate lands in B4).
    const sim = makeSim(striker, {}, { pos: v(240, 200) });
    sim.setAutoSlash(true);
    const beforeX = sim.player.pos.x;
    tickN(sim, 1);
    const evs = sim.drainEvents();
    expect(evs.filter((e) => e.type === 'damage' && e.target === 'enemy')).toHaveLength(1);
    expect(sim.enemy.hp).toBeLessThan(150);
    expect(sim.combo).toBe(1);
    // The dash is ARMED by the swing and travels from the following tick — the
    // same ordering a hand-drawn stroke gets, which is the point of D7.
    expect(sim.player.pos.x).toBe(beforeX);
    tickN(sim, 2);
    expect(sim.player.pos.x).toBeGreaterThan(beforeX);
  });
  it('emits the generated line so the scene can DRAW it (D7: "the line is drawn on screen")', () => {
    const sim = makeSim(striker);
    sim.setAutoSlash(true);
    tickN(sim, 1);
    const auto = sim.drainEvents().filter((e): e is Extract<SimEvent, { type: 'autoStroke' }> =>
      e.type === 'autoStroke');
    expect(auto).toHaveLength(1);
    const pts = auto[0]?.points ?? [];
    // floor(reach / spacing) points, exactly AUTO_SLASH_POINT_SPACING apart,
    // anchored AT the player and aimed at the target (§3.3: real strokes are
    // player-anchored, not target-centred).
    const reach = reachFor('balanced', PLAYER_STATS);
    expect(pts).toHaveLength(Math.floor(reach / AUTO_SLASH_POINT_SPACING));
    expect(pts[0]).toEqual({ x: sx(100), y: sx(200) });
    const a = pts[0];
    const b = pts[1];
    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect((b?.x ?? 0) - (a?.x ?? 0)).toBeCloseTo(AUTO_SLASH_POINT_SPACING, 9);
  });
  it('aims LEFT when the target is to the left', () => {
    const sim = makeSim(striker, { pos: v(500, 200) }, { pos: v(200, 200) });
    sim.setAutoSlash(true);
    tickN(sim, 1);
    const auto = sim.drainEvents().filter((e): e is Extract<SimEvent, { type: 'autoStroke' }> =>
      e.type === 'autoStroke');
    const pts = auto[0]?.points ?? [];
    expect((pts[1]?.x ?? 0) - (pts[0]?.x ?? 0)).toBeCloseTo(-AUTO_SLASH_POINT_SPACING, 9);
  });
});

describe('AUTO SLASH — decision gating', () => {
  it(`decides at most once every AI_THINK_INTERVAL_MS (${String(AI_THINK_INTERVAL_MS)} ms)`, () => {
    const sim = makeSim(striker);
    sim.setAutoSlash(true);
    tickN(sim, THINK_FRAMES - 1);
    const strokes = sim.drainEvents().filter((e) => e.type === 'autoStroke');
    expect(strokes).toHaveLength(1); // one, not THINK_FRAMES-1
    tickN(sim, 2);
    expect(sim.drainEvents().filter((e) => e.type === 'autoStroke')).toHaveLength(1);
  });
  it('never decides mid-swing — proven with the think timer WIDE OPEN', () => {
    // The swing cycle (16 frames balanced) is SHORTER than the think interval
    // (30 frames), so inside a normal auto-slash rhythm the think timer hides
    // this gate entirely — a chaos plant that deleted the gate stayed green.
    // Toggling auto-slash ON mid-swing is the case that isolates it: the think
    // timer has never fired, so it is open, and ONLY the swing cycle can block.
    const sim = makeSim(striker);
    sim.applyStroke(new DrawnStroke([v(300, 200), v(500, 200)])); // manual swing
    sim.setAutoSlash(true);
    sim.drainEvents();
    const cycle = SLASH_FRAMES.balanced;
    tickN(sim, cycle.windup + cycle.active + cycle.recovery - 1);
    expect(sim.drainEvents().filter((e) => e.type === 'autoStroke')).toHaveLength(0);
    // …and the moment the cycle ends, it swings.
    tickN(sim, 1);
    expect(sim.drainEvents().filter((e) => e.type === 'autoStroke')).toHaveLength(1);
  });
  it('never decides while airborne', () => {
    const sim = makeSim(striker);
    // Jump FIRST (manual, while auto is off), then hand over.
    sim.applyStroke(new DrawnStroke([v(150, 300), v(170, 100)]));
    expect(sim.playerJumping).toBe(true);
    sim.setAutoSlash(true);
    sim.drainEvents();
    tickN(sim, 3);
    expect(sim.drainEvents().filter((e) => e.type === 'autoStroke')).toHaveLength(0);
  });
  it('does not swing at a dead target', () => {
    const sim = makeSim(striker, {}, { hp: 1, pos: v(240, 200) });
    sim.setAutoSlash(true);
    tickN(sim, 1); // kills it
    sim.drainEvents();
    tickN(sim, THINK_FRAMES * 3);
    expect(sim.drainEvents().filter((e) => e.type === 'autoStroke')).toHaveLength(0);
  });
});

describe('AUTO SLASH — it drives MOVEMENT too, not just swings (gate item 12)', () => {
  it('closes on the target at the RUN gait, every tick (B1: gait by destination type)', () => {
    // Target parked far away so MOVE_STANDING_RANGE_PX cannot bite inside the
    // measured second (the next test covers the standing range on its own).
    const sim = makeSim(closer, {}, { pos: v(900, 200) });
    sim.setAutoSlash(true);
    const before = sim.player.pos.x;
    tickN(sim, FIXED_HZ);
    expect(sim.player.pos.x).toBeCloseTo(before + MOVE_RUN_PX_S, 6);
  });
  it('stops MOVE_STANDING_RANGE_PX short rather than walking into the target', () => {
    const sim = makeSim(closer);
    sim.setAutoSlash(true);
    tickN(sim, 5 * FIXED_HZ); // far more than enough to close
    const gap = Math.abs(sim.enemy.pos.x - sim.player.pos.x);
    expect(gap).toBeGreaterThanOrEqual(MOVE_STANDING_RANGE_PX);
  });
});
