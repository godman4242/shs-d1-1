import {
  CRITICAL_FILL_PER_S,
  CRITICAL_MAX,
  FOCUS_FILL_PER_S,
  FOCUS_MAX,
  FOCUS_START,
  FOCUS_SWITCH_COST,
  WEAPON_WEIGHT,
} from '../config/combat';
import { MAX_FRAME_MS, type FighterBase } from '../config/combat-sim';
import { JUMP_APEX_PX, JUMP_DURATION_FRAMES } from '../config/duel';
import { ONE, TWO, ZERO } from '../config/nums';
import type { StanceId } from '../config/stances';
import { FIXED_HZ, FRAME_QUANT_EPS, MS_PER_S } from '../config/timing';
import { Combo } from './combo';
import { physicalDamage } from './damage';
import type { DrawnStroke } from './DrawnStroke';
import type { Gesture } from './gesture';
import type { OpponentController, OpponentIntent } from './OpponentController';
import { resolveSlash, type SlashResult } from './slash';
import { jumpArcPoint } from './trajectory';
import type { Vec } from './vec';

/**
 * Deterministic random source in [0, 1). Seeded mulberry32 is injected at
 * the boundary (core/rng.ts, constants in src/config/rng.ts) — Math.random
 * is banned everywhere in core/.
 */
export type Rng = () => number;

export type FighterSide = 'player' | 'enemy';

export type SimPhase = 'intro' | 'fighting' | 'ended';

/** Everything a fighter needs to exist in the arena: stats + placement. */
export interface FighterSpawn extends FighterBase {
  pos: Vec;
  halfW: number;
  halfH: number;
}

/** Typed events drained by the scene each frame and turned into FX/SFX. */
export type SimEvent =
  | { type: 'fightStarted' }
  | { type: 'fightEnded'; winner: FighterSide }
  | { type: 'damage'; target: FighterSide; amount: number; crit: boolean; severed: string[] }
  | { type: 'stanceSwitched'; who: FighterSide; from: StanceId; to: StanceId; focusCost: number }
  | { type: 'stanceSwitchDenied'; who: FighterSide; needed: number; focus: number }
  | { type: 'strikeEvaded'; by: FighterSide }
  | { type: 'comboChanged'; value: number };

export interface StrokeOutcome {
  gesture: Gesture;
  /** Slash resolution when the stroke acted as a slash; null otherwise. */
  slash: SlashResult | null;
}

/** Public read view of a fighter (fresh object per read — never a live ref). */
export interface FighterView {
  pos: Readonly<Vec>;
  hp: number;
  maxHp: number;
  stance: StanceId;
  focus: number;
  critical: number;
}

interface JumpState {
  from: Vec;
  to: Vec;
  frame: number;
}

/**
 * Meters are stored in integer FRAME UNITS and converted multiply-first
 * (units × ratePerS / FIXED_HZ) so meter reads are exact — the same
 * drift-free pattern as advance()'s owed-frames accumulator. One unit is
 * one fixed frame of fill.
 */
interface FighterState {
  pos: Vec;
  hp: number;
  stance: StanceId;
  focusUnits: number;
  criticalUnits: number;
  jump: JumpState | null;
  readonly maxHp: number;
  readonly atkPlusWeapon: number;
  readonly defense: number;
  readonly deflectLearned: boolean;
  readonly halfW: number;
  readonly halfH: number;
  /** The spawn ground line — jumps always launch from and land on it
   * (capturing pos.y mid-air left the fighter floating; Stage-1 bug). */
  readonly groundY: number;
}

const focusToUnits = (focus: number): number => (focus * FIXED_HZ) / FOCUS_FILL_PER_S;
const unitsToFocus = (units: number): number => (units * FOCUS_FILL_PER_S) / FIXED_HZ;
const unitsToCritical = (units: number): number =>
  Math.min(CRITICAL_MAX, (units * CRITICAL_FILL_PER_S) / FIXED_HZ);

function spawnFighter(spawn: FighterSpawn): FighterState {
  return {
    pos: { ...spawn.pos },
    hp: spawn.hp,
    stance: spawn.stance,
    focusUnits: focusToUnits(FOCUS_START),
    criticalUnits: ZERO,
    jump: null,
    maxHp: spawn.hp,
    atkPlusWeapon: spawn.atkPlusWeapon,
    defense: spawn.defense,
    deflectLearned: spawn.deflectLearned,
    halfW: spawn.halfW,
    halfH: spawn.halfH,
    groundY: spawn.pos.y,
  };
}

/**
 * Fixed-timestep combat simulation — the SINGLE owner of gameplay state.
 * Pure and framework-free: no Phaser, no DOM, no wall clock, zero numeric
 * literals (tests/config-purity.test.ts enforces all of it). Scenes render
 * what Sim computes and never own gameplay state.
 *
 * Stage-2 M2 surface: two fighters (player + enemy), phase model
 * (intro → fighting → ended; pre-FIGHT strokes discarded per the gate),
 * damage resolution with defense (heavy penalty applied in slash.ts — ONE
 * form only), Focus + Critical meters, stance switching (free out of
 * combat, Focus-gated in combat), SimEvent queue, fixed-step advance().
 * M3 adds: skills, projectiles, invuln, Shunpo, kill-beat mechanics.
 */
export class Sim {
  private readonly fighters: Record<FighterSide, FighterState>;
  private phaseState: SimPhase = 'intro';
  private events: SimEvent[] = [];
  /** HIT COMBO — player-only HUD counter (the original shows no enemy combo). */
  private readonly comboCounter = new Combo();
  /** Total clamped wall-clock ms fed to advance() since spawn. */
  private elapsedMs = ZERO;
  private frameCount = ZERO;

  constructor(
    readonly rng: Rng,
    readonly opponent: OpponentController,
    spawns: { player: FighterSpawn; enemy: FighterSpawn },
  ) {
    this.fighters = {
      player: spawnFighter(spawns.player),
      enemy: spawnFighter(spawns.enemy),
    };
  }

  get phase(): SimPhase {
    return this.phaseState;
  }

  get player(): FighterView {
    return this.view('player');
  }

  get enemy(): FighterView {
    return this.view('enemy');
  }

  get playerJumping(): boolean {
    return this.fighters.player.jump !== null;
  }

  /** Fixed frames elapsed since spawn — the Sim's own clock. */
  get frame(): number {
    return this.frameCount;
  }

  /** Current HIT COMBO value (0 = no chain). */
  get combo(): number {
    return this.comboCounter.value;
  }

  private view(side: FighterSide): FighterView {
    const f = this.fighters[side];
    return {
      pos: { ...f.pos },
      hp: f.hp,
      maxHp: f.maxHp,
      stance: f.stance,
      focus: unitsToFocus(f.focusUnits),
      critical: unitsToCritical(f.criticalUnits),
    };
  }

  /** Axis-aligned hitbox rectangle around a fighter's current position. */
  hitbox(side: FighterSide): Vec[] {
    const f = this.fighters[side];
    return [
      { x: f.pos.x - f.halfW, y: f.pos.y - f.halfH },
      { x: f.pos.x + f.halfW, y: f.pos.y - f.halfH },
      { x: f.pos.x + f.halfW, y: f.pos.y + f.halfH },
      { x: f.pos.x - f.halfW, y: f.pos.y + f.halfH },
    ];
  }

  /** Drain queued events (returns and clears — scenes call once per frame). */
  drainEvents(): SimEvent[] {
    const drained = this.events;
    this.events = [];
    return drained;
  }

  /** FIGHT! — idempotent; strokes and AI are live only from here. */
  beginCombat(): void {
    if (this.phaseState !== 'intro') return;
    this.phaseState = 'fighting';
    this.events.push({ type: 'fightStarted' });
  }

  /**
   * Stance switching (SYNTHESIS §6.1 decision): out of combat the toggle is
   * instant and free (CONTRACT — "CANNOT CHANGE STANCE" only during fights);
   * in combat it costs FOCUS_SWITCH_COST × WEAPON_WEIGHT[current stance]
   * (INFERRED — the stance being LEFT proxies how heavily the weapon is
   * committed; veto = key on the target stance instead). Denied switches
   * emit an event so the HUD can flash the Focus bar.
   */
  requestStanceSwitch(side: FighterSide, to: StanceId): boolean {
    const f = this.fighters[side];
    if (to === f.stance) return false;
    if (this.phaseState !== 'fighting') {
      const from = f.stance;
      f.stance = to;
      this.events.push({ type: 'stanceSwitched', who: side, from, to, focusCost: ZERO });
      return true;
    }
    const cost = FOCUS_SWITCH_COST * WEAPON_WEIGHT[f.stance];
    const costUnits = focusToUnits(cost);
    if (f.focusUnits < costUnits) {
      this.events.push({
        type: 'stanceSwitchDenied',
        who: side,
        needed: cost,
        focus: unitsToFocus(f.focusUnits),
      });
      return false;
    }
    const from = f.stance;
    f.focusUnits -= costUnits;
    f.stance = to;
    this.events.push({ type: 'stanceSwitched', who: side, from, to, focusCost: cost });
    return true;
  }

  /**
   * Resolve a finished player stroke: slash → damage on the enemy; up-stroke
   * → player jump (start.x → end.x arc). Outside 'fighting' every stroke is
   * DISCARDED (gate: pre-FIGHT strokes discarded). The crit decision is
   * internal: a full Critical meter makes the next LANDED slash crit and
   * resets the meter.
   */
  applyStroke(stroke: DrawnStroke): StrokeOutcome {
    const gesture = stroke.gesture;
    if (this.phaseState !== 'fighting') return { gesture, slash: null };
    // Degenerate strokes (taps) classify as 'slash' by default — gate here at
    // the core seam so no caller can land a full-damage tap (audit finding).
    if (stroke.points.length < TWO) return { gesture, slash: null };
    const player = this.fighters.player;
    const enemy = this.fighters.enemy;
    if (gesture === 'slash') {
      const critReady = unitsToCritical(player.criticalUnits) >= CRITICAL_MAX;
      const result = resolveSlash(
        stroke,
        { polygon: this.hitbox('enemy'), stance: enemy.stance, hp: enemy.hp, defense: enemy.defense },
        { atkPlusWeapon: player.atkPlusWeapon, stance: player.stance, crit: critReady },
      );
      if (result.hit) {
        if (critReady) player.criticalUnits = ZERO; // consumed only on a landed hit
        this.emitCombo(this.comboCounter.hit(this.frameCount));
        this.dealDamage('enemy', result.damage, result.crit, result.severed);
      }
      return { gesture, slash: result };
    }
    if (gesture === 'jump') {
      const first = stroke.points.at(ZERO);
      const last = stroke.points.at(-ONE);
      // One jump at a time: a jump gesture while airborne is ignored.
      if (player.jump === null && first !== undefined && last !== undefined) {
        player.jump = {
          from: { x: first.x, y: player.groundY },
          to: { x: last.x, y: player.groundY },
          frame: ZERO,
        };
        player.pos = { x: first.x, y: player.groundY };
      }
      return { gesture, slash: null };
    }
    // launch / stab: recognized; stab swats kunai from M3.
    return { gesture, slash: null };
  }

  private emitCombo(value: number): void {
    this.events.push({ type: 'comboChanged', value });
  }

  /** Enemy strike: telegraph timing/range are the CONTROLLER's job — the
   * Sim only executes, honoring the player's evasion states. An airborne
   * player evades ground strikes (jump dodge — the original's core defense
   * verb alongside stances). */
  private executeStrike(): void {
    const player = this.fighters.player;
    const enemy = this.fighters.enemy;
    if (player.jump !== null) {
      this.events.push({ type: 'strikeEvaded', by: 'player' });
      return;
    }
    const critReady = unitsToCritical(enemy.criticalUnits) >= CRITICAL_MAX;
    if (critReady) enemy.criticalUnits = ZERO;
    const damage = physicalDamage(
      { atkPlusWeapon: enemy.atkPlusWeapon, stance: enemy.stance, crit: critReady },
      { stance: player.stance, defense: player.defense },
    );
    this.dealDamage('player', damage, critReady, []);
  }

  private dealDamage(target: FighterSide, amount: number, crit: boolean, severed: string[]): void {
    const f = this.fighters[target];
    f.hp = Math.max(ZERO, f.hp - amount);
    this.events.push({ type: 'damage', target, amount, crit, severed });
    if (target === 'player') {
      this.comboCounter.damaged();
      this.emitCombo(this.comboCounter.value);
    }
    if (f.hp === ZERO) {
      this.phaseState = 'ended';
      const winner: FighterSide = target === 'enemy' ? 'player' : 'enemy';
      if (winner === 'player') {
        this.comboCounter.kill(this.frameCount);
        this.emitCombo(this.comboCounter.value);
      }
      this.events.push({ type: 'fightEnded', winner });
    }
  }

  /**
   * Advance the sim by a wall-clock delta (Stage 2 spec item 1). Owns the
   * fixed-step accumulator: clamps any single delta to MAX_FRAME_MS (a
   * throttled/backgrounded tab must not fast-forward the fight), ignores
   * NaN (would poison the accumulator forever) and negatives (would rewind
   * it). Scenes call ONLY this — never tick() — so sim time follows the
   * wall clock at FIXED_HZ regardless of render fps.
   */
  advance(deltaMs: number): void {
    if (Number.isNaN(deltaMs) || deltaMs < ZERO) return;
    this.elapsedMs += Math.min(deltaMs, MAX_FRAME_MS);
    // Owed frames from TOTAL elapsed time (multiplicative — no cumulative
    // drift, unlike a repeated-subtraction remainder). FRAME_QUANT_EPS
    // absorbs the 1-ulp float noise either side of exact step boundaries.
    const owed = Math.floor((this.elapsedMs * FIXED_HZ) / MS_PER_S + FRAME_QUANT_EPS);
    while (this.frameCount < owed) this.tick();
  }

  /** Advance one fixed frame (advance() consumes the accumulator into these). */
  tick(): void {
    this.frameCount += ONE;
    if (this.phaseState === 'fighting') {
      // Meters fill only during live combat (not intro, not post-kill).
      for (const f of Object.values(this.fighters)) {
        f.focusUnits = Math.min(f.focusUnits + ONE, focusToUnits(FOCUS_MAX));
        f.criticalUnits += ONE; // value view clamps at CRITICAL_MAX
      }
      // AI seam: consulted once per fighting tick; the Sim executes the
      // returned intent blindly (M4's AISeamController decides timing).
      const intent: OpponentIntent = this.opponent.next(this.frameCount);
      if (intent.strike === true) this.executeStrike();
    }
    const player = this.fighters.player;
    if (player.jump === null) return;
    player.jump.frame += ONE;
    const t = player.jump.frame / JUMP_DURATION_FRAMES;
    player.pos = jumpArcPoint(t, player.jump.from, player.jump.to, JUMP_APEX_PX);
    if (t >= ONE) player.jump = null;
  }
}
