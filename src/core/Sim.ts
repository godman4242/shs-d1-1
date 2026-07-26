import {
  CHI_PUNCH_DMG_L1,
  FOCUS_MAX,
  FOCUS_START,
  FOCUS_SWITCH_COST,
  SPAWN_INVULN_S,
  WEAPON_WEIGHT,
} from '../config/combat';
import { CHI_COST, CHI_FILL_PER_S, CHI_MAX } from '../config/chi';
import {
  DASH_MIN_STROKE_PX,
  DASH_SLASH_PX,
  DEFLECT_RADIUS,
  DEFLECT_WINDOW_MS,
  MAX_FRAME_MS,
  PLAYER_MOVE_SPEED,
  PROJECTILE_DMG,
  PROJECTILE_MAX_ACTIVE,
  SHUNPO_DRAIN_PER_S,
  SHUNPO_FILL_PER_S,
  SHUNPO_MAX,
  SHUNPO_MIN_TO_START,
  SHUNPO_TIMESCALE,
  SMOKE_BOMB_DISTANCE,
  SMOKE_BOMB_IFRAMES_MS,
  type FighterBase,
  type SkillVerb,
} from '../config/combat-sim';
import { WORLD_WIDTH } from '../config/display';
import { SKILL_COOLDOWN_MS } from '../config/skills';
import { JUMP_APEX_PX, JUMP_DURATION_FRAMES } from '../config/duel';
import { ONE, TWO, ZERO } from '../config/nums';
import type { StanceId } from '../config/stances';
import { FIXED_HZ, FRAME_QUANT_EPS, MS_PER_S, SLASH_FRAMES } from '../config/timing';
import { Combo } from './combo';
import { criticalReady, focusToUnits, unitsToCritical, unitsToFocus } from './critical';
import { physicalDamage } from './damage';
import type { Gesture } from './gesture';
import { AI_THINK_INTERVAL_MS, AUTO_SLASH_POINT_SPACING, ENEMY_SPEED } from '../config/ai';
import type { OpponentController, OpponentIntent, OpponentView } from './OpponentController';
import { isOffArena, projectileHits, spawnProjectile, stepProjectile, type Projectile } from './projectile';
import { resolveSlash, type SlashResult } from './slash';
import { DrawnStroke } from './DrawnStroke';
import { STANCE_TABLE } from '../config/stances';
import { msToFrames } from './time';
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
  /** STARTING Chi in points (defaults full); the ceiling is always CHI_MAX. */
  chi?: number;
}

/** Typed events drained by the scene each frame and turned into FX/SFX. */
export type SimEvent =
  | { type: 'fightStarted' }
  | { type: 'fightEnded'; winner: FighterSide }
  | { type: 'damage'; target: FighterSide; amount: number; crit: boolean; severed: string[] }
  | { type: 'stanceSwitched'; who: FighterSide; from: StanceId; to: StanceId; focusCost: number }
  | { type: 'stanceSwitchDenied'; who: FighterSide; needed: number; focus: number }
  | { type: 'strikeEvaded'; by: FighterSide }
  | { type: 'comboChanged'; value: number }
  | { type: 'skillUsed'; verb: SkillVerb }
  | { type: 'skillDenied'; verb: SkillVerb; needed: number; chi: number }
  | { type: 'invulnBlocked'; target: FighterSide }
  | { type: 'kunaiThrown' }
  | { type: 'kunaiDeflected' }
  | { type: 'shunpoStarted' }
  | { type: 'shunpoEnded' }
  | { type: 'enemyTelegraph'; kind: 'strike' | 'stance'; durationMs: number }
  | { type: 'strikeBlocked'; by: FighterSide }
  /** AUTO SLASH synthesised this line — the scene DRAWS it (D7). */
  | { type: 'autoStroke'; points: readonly Vec[] };

/**
 * Per-tick held-state input from the scene (edge-triggered skill presses go
 * through queueSkill instead). moveX is -1 | 0 | 1; setPlayerIntent clamps
 * and NaN-guards it (scene input is an untrusted Sim boundary).
 */
export interface PlayerIntent {
  moveX: number;
  shunpoHeld: boolean;
  /** Session 11: mouse hold-to-run target X (stage px). null/omitted = no mouse movement. */
  moveTargetX?: number | null;
}

/**
 * Where a stroke came from. AUTO SLASH locks out MANUAL strokes but must still
 * push its own synthesised one through the *same* entry point — that shared
 * path is the point of D7 (if auto-slash can drive the pipeline, the player and
 * AI paths are one implementation, as in the original).
 */
export type StrokeSource = 'manual' | 'auto';

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
  /** Chi meter in points (0..maxChi) — skills charge it (M3). */
  chi: number;
  maxChi: number;
  /** Spawn invuln or Smoke-Bomb i-frames — the scene renders the blink. */
  invulnerable: boolean;
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
  /** Chi meter in integer frame units (M3). The enemy's pool fills but never
   * spends — AI skills don't exist yet (flagged; veto = drop the field). */
  chiUnits: number;
  jump: JumpState | null;
  /** Frame the spawn invulnerability ends (0 = none). Player-only in M3. */
  invulnEndFrame: number;
  /** Frame Smoke-Bomb i-frames end (0 = none). */
  iframesEndFrame: number;
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

/** Shunpo meter units are 1/FIXED_HZ points: integer drain/fill, exact reads. */
const SHUNPO_MAX_UNITS = SHUNPO_MAX * FIXED_HZ;
const SHUNPO_MIN_UNITS = SHUNPO_MIN_TO_START * FIXED_HZ;
/** Chi shares the integer frame-unit scheme (points × FIXED_HZ). */
const CHI_MAX_UNITS = CHI_MAX * FIXED_HZ;

function spawnFighter(spawn: FighterSpawn): FighterState {
  return {
    pos: { ...spawn.pos },
    hp: spawn.hp,
    stance: spawn.stance,
    focusUnits: focusToUnits(FOCUS_START),
    criticalUnits: ZERO,
    chiUnits: (spawn.chi ?? CHI_MAX) * FIXED_HZ,
    jump: null,
    invulnEndFrame: ZERO,
    iframesEndFrame: ZERO,
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
  private playerIntent: PlayerIntent = { moveX: ZERO, shunpoHeld: false, moveTargetX: null };
  private queuedSkill: SkillVerb | null = null;
  private readonly cooldownUntil: Record<SkillVerb, number> = {
    chiPunch: ZERO,
    smokeBomb: ZERO,
    stab: ZERO,
  };
  /** Frame the player's stab deflect window closes (0 = closed). */
  private deflectEndFrame = ZERO;
  /** Frame the next dash-through becomes available (0 = ready). One dash per
   * measured swing cycle — SLASH_FRAMES total for the stance at slash time
   * (review-hardened: unlimited dashing made scribble-spam a teleport). */
  private dashReadyFrame = ZERO;
  /** AUTO SLASH (D7): hands the player's fighter to the AI decision routine. */
  private autoSlashOn = false;
  /** Frame the auto-slash think timer reopens (AI_THINK_INTERVAL_MS apart). */
  private autoThinkUntilFrame = ZERO;
  /** Frame the player's measured swing cycle ends — auto-slash never decides
   * mid-swing (D7). Stun is NOT modelled in this Sim (flagged). */
  private playerBusyUntilFrame = ZERO;
  private kunai: Projectile[] = [];
  private shunpoUnits = SHUNPO_MAX_UNITS;
  private shunpoActive = false;
  /** Total clamped wall-clock ms fed to advance() since spawn. */
  private elapsedMs = ZERO;
  private frameCount = ZERO;

  constructor(
    readonly rng: Rng,
    readonly opponent: OpponentController,
    spawns: { player: FighterSpawn; enemy: FighterSpawn },
    /**
     * The decision routine AUTO SLASH hands the player to. It must be its OWN
     * instance, never the enemy's — the controllers carry mode state and
     * sharing one would interleave two fighters' telegraph machines.
     */
    readonly autoController: OpponentController | null = null,
  ) {
    this.fighters = {
      player: spawnFighter(spawns.player),
      enemy: spawnFighter(spawns.enemy),
    };
  }

  get phase(): SimPhase {
    return this.phaseState;
  }

  /** True while the player's fighter is driven by the AI routine (D7). */
  get autoSlash(): boolean {
    return this.autoSlashOn;
  }

  /**
   * Toggle AUTO SLASH. Turning it ON with no injected controller THROWS rather
   * than quietly doing nothing: a plate that reads "AUTO SLASH ON" over a dead
   * toggle is the exact failure D7's veto forbids ("the plate must never lie
   * again"), so this fails closed.
   */
  setAutoSlash(on: boolean): void {
    if (on && this.autoController === null) {
      throw new Error('Sim.setAutoSlash(true) requires an injected autoController');
    }
    this.autoSlashOn = on;
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

  /** Sim time scale: SHUNPO_TIMESCALE while Shunpo is held, else 1. The
   * scene multiplies its render delta by this before calling advance()
   * (spec item 11) and mirrors it onto Phaser's tween/timer scales. */
  get timeScale(): number {
    return this.shunpoActive ? SHUNPO_TIMESCALE : ONE;
  }

  /** Shunpo meter in points (0..SHUNPO_MAX) — integer-unit exact. */
  get shunpo(): number {
    return this.shunpoUnits / FIXED_HZ;
  }

  /** Live kunai (fresh copies — never live refs). */
  get projectiles(): readonly Projectile[] {
    return this.kunai.map((p) => ({ pos: { ...p.pos }, vel: { ...p.vel } }));
  }

  /** Seconds until the skill is ready (0 = ready) — drives the HUD sweep. */
  cooldownRemainingS(verb: SkillVerb): number {
    return Math.max(ZERO, this.cooldownUntil[verb] - this.frameCount) / FIXED_HZ;
  }

  /** Held-state input for the next ticks. NaN/∞ moveX is rejected and the
   * value clamped to [-1, 1] — scene input is an untrusted boundary. */
  setPlayerIntent(intent: PlayerIntent): void {
    const moveX = Number.isFinite(intent.moveX)
      ? Math.max(-ONE, Math.min(ONE, intent.moveX))
      : ZERO;
    const moveTargetX = Number.isFinite(intent.moveTargetX ?? NaN) ? intent.moveTargetX : null;
    this.playerIntent = { moveX, shunpoHeld: intent.shunpoHeld, moveTargetX };
  }

  /** Edge-triggered skill press (hotbar 1/2/3) — consumed on the next tick.
   * Discarded outside 'fighting', like strokes (audit: a press buffered
   * during the READY countdown auto-cast on the first fighting tick). */
  queueSkill(verb: SkillVerb): void {
    if (this.phaseState !== 'fighting') return;
    this.queuedSkill = verb;
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
      chi: f.chiUnits / FIXED_HZ,
      maxChi: CHI_MAX,
      invulnerable: this.frameCount < f.invulnEndFrame || this.frameCount < f.iframesEndFrame,
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

  /** FIGHT! — idempotent; strokes and AI are live only from here.
   * Spawn invulnerability is PLAYER-ONLY (research frames it as respawn
   * protection; an invulnerable enemy would block the first slash, which
   * the Stage-2 gate requires to damage). Veto = symmetric invuln. */
  beginCombat(): void {
    if (this.phaseState !== 'intro') return;
    this.phaseState = 'fighting';
    this.fighters.player.invulnEndFrame = this.frameCount + SPAWN_INVULN_S * FIXED_HZ;
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
  applyStroke(stroke: DrawnStroke, source: StrokeSource = 'manual'): StrokeOutcome {
    const gesture = stroke.gesture;
    if (this.phaseState !== 'fighting') return { gesture, slash: null };
    // AUTO SLASH (D7) locks out MANUAL input entirely — no drawing, no move
    // orders. Its own synthesised stroke arrives as source 'auto' and takes
    // the identical path from here down.
    if (this.autoSlashOn && source === 'manual') return { gesture, slash: null };
    // Degenerate strokes (taps) classify as 'slash' by default — gate here at
    // the core seam so no caller can land a full-damage tap (audit finding).
    if (stroke.points.length < TWO) return { gesture, slash: null };
    const player = this.fighters.player;
    const enemy = this.fighters.enemy;
    if (gesture === 'slash') {
      // Any slash — hit or miss — is an offensive act: it ends spawn invuln.
      player.invulnEndFrame = ZERO;
      // The measured swing cycle. AUTO SLASH must not decide inside it (D7);
      // the dash rule below re-uses the same window.
      const swing = SLASH_FRAMES[player.stance];
      this.playerBusyUntilFrame =
        this.frameCount + swing.windup + swing.active + swing.recovery;
      // Dash-through (MEASURED, Session 9): the attacker snaps DASH_SLASH_PX
      // along the attack line in ONE frame, passing THROUGH the target — the
      // lunge is part of the swing (hit, miss, or clash), so it lands before
      // resolution and before the block/dodge early-outs. Airborne slashes
      // don't dash (the jump arc owns position); a zero-net stroke has no
      // attack line. Arena-clamped like every other movement verb.
      // Review-hardened bounds (Session 9, all red-proofed): at most one dash
      // per measured swing cycle (SLASH_FRAMES total — scribble-spam was a
      // teleport verb, and sim-frame counting keeps Shunpo from amplifying
      // it), and never on a slip-length stroke (DASH_MIN_STROKE_PX). Damage
      // stays instant either way — only the movement is gated.
      const dashDir = Math.sign(stroke.direction.x);
      if (
        player.jump === null &&
        dashDir !== ZERO &&
        stroke.length >= DASH_MIN_STROKE_PX &&
        this.frameCount >= this.dashReadyFrame
      ) {
        player.pos = {
          x: Math.max(
            player.halfW,
            Math.min(WORLD_WIDTH - player.halfW, player.pos.x + dashDir * DASH_SLASH_PX),
          ),
          y: player.pos.y,
        };
        const cycle = SLASH_FRAMES[player.stance];
        this.dashReadyFrame = this.frameCount + cycle.windup + cycle.active + cycle.recovery;
      }
      const critReady = criticalReady(player.criticalUnits);
      const result = resolveSlash(
        stroke,
        { polygon: this.hitbox('enemy'), stance: enemy.stance, hp: enemy.hp, defense: enemy.defense },
        { atkPlusWeapon: player.atkPlusWeapon, stance: player.stance, crit: critReady, pos: { ...player.pos }, reach: STANCE_TABLE[player.stance].reach },
      );
      if (result.hit) {
        // Reaction seam: the controller may block or dodge a landing slash.
        // The crit meter is NOT consumed on a reacted swing (no hit landed).
        const reaction = this.opponent.react?.(this.frameCount, this.opponentView()) ?? null;
        if (reaction === 'block') {
          this.events.push({ type: 'strikeBlocked', by: 'enemy' });
          return { gesture, slash: { ...result, hit: false, damage: ZERO, severed: [] } };
        }
        if (reaction === 'dodge') {
          this.events.push({ type: 'strikeEvaded', by: 'enemy' });
          return { gesture, slash: { ...result, hit: false, damage: ZERO, severed: [] } };
        }
        if (critReady) player.criticalUnits = ZERO; // consumed only on a landed hit
        this.emitCombo(this.comboCounter.hit());
        this.dealDamage('enemy', result.damage, result.crit, result.severed);
      }
      return { gesture, slash: result };
    }
    if (gesture === 'jump') {
      const first = stroke.points.at(ZERO);
      const last = stroke.points.at(-ONE);
      // One jump at a time: a jump gesture while airborne is ignored.
      if (player.jump === null && first !== undefined && last !== undefined) {
        // Arena-clamped like walking — an off-canvas stroke must not land
        // the fighter outside the stage (audit).
        const clampX = (v: number): number =>
          Math.max(player.halfW, Math.min(WORLD_WIDTH - player.halfW, v));
        player.jump = {
          from: { x: clampX(first.x), y: player.groundY },
          to: { x: clampX(last.x), y: player.groundY },
          frame: ZERO,
        };
        player.pos = { x: clampX(first.x), y: player.groundY };
      }
      return { gesture, slash: null };
    }
    if (gesture === 'stab') {
      this.tryCastSkill('stab');
      return { gesture, slash: null };
    }
    // launch: recognized, acted on at Stage 3 (LAUNCH_UNLOCK_LEVEL).
    return { gesture, slash: null };
  }

  private emitCombo(value: number): void {
    this.events.push({ type: 'comboChanged', value });
  }

  /** Enemy strike: telegraph timing/range are the CONTROLLER's job — the
   * Sim only executes, honoring the player's evasion states. An airborne
   * player evades ground strikes (jump dodge — the original's core defense
   * verb alongside stances). */
  /** Snapshot handed to the opponent controller each fighting tick. */
  private opponentView(): OpponentView {
    const player = this.fighters.player;
    const enemy = this.fighters.enemy;
    return {
      playerPos: { ...player.pos },
      enemyPos: { ...enemy.pos },
      playerStance: player.stance,
      enemyStance: enemy.stance,
      enemyFocus: unitsToFocus(enemy.focusUnits),
      playerJumping: player.jump !== null,
    };
  }

  /** Invuln (spawn) or i-frames (Smoke Bomb) nullify incoming damage. */
  private isProtected(side: FighterSide): boolean {
    const f = this.fighters[side];
    return this.frameCount < f.invulnEndFrame || this.frameCount < f.iframesEndFrame;
  }

  private executeStrike(): void {
    const player = this.fighters.player;
    const enemy = this.fighters.enemy;
    if (player.jump !== null) {
      this.events.push({ type: 'strikeEvaded', by: 'player' });
      return;
    }
    if (this.isProtected('player')) {
      this.events.push({ type: 'invulnBlocked', target: 'player' });
      return;
    }
    const critReady = criticalReady(enemy.criticalUnits);
    if (critReady) enemy.criticalUnits = ZERO;
    const damage = physicalDamage(
      { atkPlusWeapon: enemy.atkPlusWeapon, stance: enemy.stance, crit: critReady },
      { stance: player.stance, defense: player.defense },
    );
    this.dealDamage('player', damage, critReady, []);
  }

  private dealDamage(target: FighterSide, amount: number, crit: boolean, severed: string[]): void {
    // AUDIT FIX (major): a mid-tick kill flips the phase to 'ended'; any
    // damage still in flight the same tick (kunai, second source) must not
    // land — the old path emitted a SECOND fightEnded with the opposite
    // winner ("kill beat fires exactly once" is a gate item).
    if (this.phaseState === 'ended') return;
    const f = this.fighters[target];
    f.hp = Math.max(ZERO, f.hp - amount);
    this.events.push({ type: 'damage', target, amount, crit, severed });
    if (target === 'player') {
      this.comboCounter.damaged();
      this.emitCombo(this.comboCounter.value);
    }
    if (f.hp === ZERO) {
      this.phaseState = 'ended';
      // Shunpo cannot outlive the fight: a kill landed while slow-mo was
      // active left timeScale stuck at SHUNPO_TIMESCALE with no shunpoEnded
      // ever emitted (audit; spec item 11 "restored on kill beat").
      if (this.shunpoActive) {
        this.shunpoActive = false;
        this.events.push({ type: 'shunpoEnded' });
      }
      const winner: FighterSide = target === 'enemy' ? 'player' : 'enemy';
      // D8 (SESSION13): a kill does NOT touch the combo. The Stage-2
      // "resets to 1 on kill" CONTRACT was wrong — see docs/DIVERGENCES.md.
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

  /**
   * Shunpo per tick. Order matters and is test-pinned: (1) released while
   * active → stop; (2) inactive meter refills; (3) held + refilled past
   * SHUNPO_MIN_TO_START → start (hysteresis band stops flicker at empty);
   * (4) active → drain, auto-stop at 0. Rates are per SIM second (units are
   * integer 1/FIXED_HZ points, so every read is exact).
   */
  private updateShunpo(): void {
    const held = this.playerIntent.shunpoHeld;
    if (this.shunpoActive && !held) {
      this.shunpoActive = false;
      this.events.push({ type: 'shunpoEnded' });
    }
    if (!this.shunpoActive) {
      this.shunpoUnits = Math.min(this.shunpoUnits + SHUNPO_FILL_PER_S, SHUNPO_MAX_UNITS);
    }
    if (held && !this.shunpoActive && this.shunpoUnits >= SHUNPO_MIN_UNITS) {
      this.shunpoActive = true;
      this.events.push({ type: 'shunpoStarted' });
    }
    if (this.shunpoActive) {
      this.shunpoUnits -= SHUNPO_DRAIN_PER_S;
      if (this.shunpoUnits <= ZERO) {
        this.shunpoUnits = ZERO;
        this.shunpoActive = false;
        this.events.push({ type: 'shunpoEnded' });
      }
    }
  }

  /**
   * AUTO SLASH's tick (D7). The toggle hands the player to the SAME decision
   * routine that drives the enemy; the Sim executes what it returns.
   *
   * Movement flows every tick (so the fighter actually closes), while the
   * SWING is gated: never mid-swing, never airborne, and at most one decision
   * per AI_THINK_INTERVAL_MS. Targeting is nearest living enemy by |Δx| with
   * unlimited range and no line-of-sight — trivially the one enemy, because
   * this Sim is hard-wired 1v1 (multi-enemy is queued, kickoff §7).
   */
  private updateAutoSlash(): void {
    const ctrl = this.autoController;
    if (ctrl === null) return;
    const player = this.fighters.player;
    const target = this.nearestLivingTarget();
    if (target === null) return;
    const intent = ctrl.next(this.frameCount, this.autoView());
    // Movement: every tick, at the player's own speed, arena-clamped.
    if (player.jump === null && intent.moveX !== undefined && Number.isFinite(intent.moveX)) {
      const dir = Math.max(-ONE, Math.min(ONE, intent.moveX));
      const x = player.pos.x + dir * PLAYER_MOVE_SPEED * (MS_PER_S / FIXED_HZ);
      player.pos = {
        x: Math.max(player.halfW, Math.min(WORLD_WIDTH - player.halfW, x)),
        y: player.pos.y,
      };
    }
    if (intent.strike !== true) return;
    if (player.jump !== null) return; // never airborne
    if (this.frameCount < this.playerBusyUntilFrame) return; // never mid-swing
    if (this.frameCount < this.autoThinkUntilFrame) return; // one per think beat
    this.autoThinkUntilFrame = this.frameCount + msToFrames(AI_THINK_INTERVAL_MS);
    const points = this.synthesizeStrokePoints(target.pos);
    // The scene DRAWS this line (D7) — it is emitted, not hidden.
    this.events.push({ type: 'autoStroke', points });
    this.applyStroke(new DrawnStroke(points), 'auto');
  }

  /** Nearest LIVING enemy by |Δx| — unlimited range, no line-of-sight (D7). */
  private nearestLivingTarget(): FighterState | null {
    const enemy = this.fighters.enemy;
    return enemy.hp > ZERO ? enemy : null;
  }

  /**
   * The AI's stroke: `floor(reach / AUTO_SLASH_POINT_SPACING)` points, that far
   * apart, anchored AT the attacker and aimed at the target. Player-anchored on
   * purpose — a target-CENTRED line (what our 24-seed harness bot draws) is not
   * what a real stroke looks like, and §3.3 names that as a thing to fix, not
   * to copy.
   */
  private synthesizeStrokePoints(targetPos: Vec): Vec[] {
    const player = this.fighters.player;
    const reach = STANCE_TABLE[player.stance].reach;
    const count = Math.max(TWO, Math.floor(reach / AUTO_SLASH_POINT_SPACING));
    const dir = targetPos.x < player.pos.x ? -ONE : ONE;
    const points: Vec[] = [];
    for (let i = ZERO; i < count; i += ONE) {
      points.push({ x: player.pos.x + dir * i * AUTO_SLASH_POINT_SPACING, y: player.pos.y });
    }
    return points;
  }

  /**
   * The view handed to the auto controller, with the two fighters SWAPPED so
   * the routine reads the player as "self" and the enemy as its target — the
   * literal meaning of "hands your fighter to the enemy AI routine".
   */
  private autoView(): OpponentView {
    const player = this.fighters.player;
    const enemy = this.fighters.enemy;
    return {
      playerPos: { ...enemy.pos },
      enemyPos: { ...player.pos },
      playerStance: enemy.stance,
      enemyStance: player.stance,
      enemyFocus: unitsToFocus(player.focusUnits),
      playerJumping: enemy.jump !== null,
    };
  }

  private tryCastSkill(verb: SkillVerb): void {
    if (this.frameCount < this.cooldownUntil[verb]) return;
    const player = this.fighters.player;
    const enemy = this.fighters.enemy;
    // Chi gate (M3): too expensive → denied, and the cooldown is NOT
    // consumed (chaos-pinned). A cooldown-blocked cast stays silent
    // (Stage-2 behavior); a chi-blocked one is announced for the HUD cue.
    const costUnits = CHI_COST[verb] * FIXED_HZ;
    if (player.chiUnits < costUnits) {
      this.events.push({
        type: 'skillDenied',
        verb,
        needed: CHI_COST[verb],
        chi: player.chiUnits / FIXED_HZ,
      });
      return;
    }
    player.chiUnits -= costUnits;
    if (verb === 'chiPunch') {
      // CONTRACT: on-screen 10 dealt — flat, bypasses defense. Offensive:
      // ends spawn invuln like a slash.
      player.invulnEndFrame = ZERO;
      this.dealDamage('enemy', CHI_PUNCH_DMG_L1, false, []);
    } else if (verb === 'smokeBomb') {
      // Dash AWAY from the enemy, clamped to the arena; grants i-frames.
      const away = player.pos.x < enemy.pos.x ? -ONE : ONE;
      player.pos = {
        x: Math.max(
          player.halfW,
          Math.min(WORLD_WIDTH - player.halfW, player.pos.x + away * SMOKE_BOMB_DISTANCE),
        ),
        y: player.pos.y,
      };
      player.iframesEndFrame = this.frameCount + msToFrames(SMOKE_BOMB_IFRAMES_MS);
    } else {
      // stab: opens the deflect window. Whether it can actually swat is
      // gated ONCE, in stepKunai (deflectLearned) — no redundant gate here,
      // so the mutation test has exactly one place to bite.
      this.deflectEndFrame = this.frameCount + msToFrames(DEFLECT_WINDOW_MS);
    }
    this.cooldownUntil[verb] = this.frameCount + msToFrames(SKILL_COOLDOWN_MS[verb]);
    this.events.push({ type: 'skillUsed', verb });
  }

  private throwKunai(): void {
    if (this.kunai.length >= PROJECTILE_MAX_ACTIVE) return;
    this.kunai.push(spawnProjectile(this.fighters.enemy.pos, this.fighters.player.pos));
    this.events.push({ type: 'kunaiThrown' });
  }

  /** Step every kunai one frame: deflect (stab window) beats hit; hits on a
   * protected player are blocked+absorbed; off-arena kunai despawn. */
  private stepKunai(): void {
    const player = this.fighters.player;
    const windowOpen = this.frameCount < this.deflectEndFrame;
    const survivors: Projectile[] = [];
    for (const p of this.kunai) {
      const moved = stepProjectile(p);
      const distToPlayer = Math.hypot(moved.pos.x - player.pos.x, moved.pos.y - player.pos.y);
      if (windowOpen && player.deflectLearned && distToPlayer <= DEFLECT_RADIUS) {
        this.events.push({ type: 'kunaiDeflected' });
        continue;
      }
      if (projectileHits(moved, player.pos)) {
        if (this.isProtected('player')) {
          this.events.push({ type: 'invulnBlocked', target: 'player' });
        } else {
          // INFERRED: kunai chip damage is flat (archer chip pattern) —
          // defense does not subtract from PROJECTILE_DMG.
          this.dealDamage('player', PROJECTILE_DMG, false, []);
        }
        continue;
      }
      if (isOffArena(moved)) continue;
      survivors.push(moved);
    }
    this.kunai = survivors;
  }

  /** Advance one fixed frame (advance() consumes the accumulator into these). */
  tick(): void {
    this.frameCount += ONE;
    if (this.phaseState === 'fighting') {
      // Meters fill only during live combat (not intro, not post-kill).
      for (const f of Object.values(this.fighters)) {
        f.focusUnits = Math.min(f.focusUnits + ONE, focusToUnits(FOCUS_MAX));
        f.criticalUnits += ONE; // value view clamps at CRITICAL_MAX
        // Chi fills BEFORE the queued skill resolves, so a post-cast read is
        // exactly max − cost (the cast tick's fill clamps at the ceiling).
        f.chiUnits = Math.min(f.chiUnits + CHI_FILL_PER_S, CHI_MAX_UNITS);
      }
      this.updateShunpo();
      // Player movement. Mouse hold-to-run takes priority (Session 11,
      // Tip #27: HOLD mouse to run toward cursor); A/D is a dev-seam fallback.
      // The jump arc owns the position while airborne.
      const player = this.fighters.player;
      if (this.autoSlashOn) {
        this.updateAutoSlash();
      } else if (player.jump === null) {
        const stepMs = MS_PER_S / FIXED_HZ;
        if (this.playerIntent.moveTargetX != null) {
          const target = this.playerIntent.moveTargetX;
          const dx = target - player.pos.x;
          const dist = Math.abs(dx);
          const step = PLAYER_MOVE_SPEED * stepMs;
          if (dist <= step) {
            // Arrived — snap to target
            player.pos = { x: Math.max(player.halfW, Math.min(WORLD_WIDTH - player.halfW, target)), y: player.pos.y };
          } else {
            const dir = Math.sign(dx);
            player.pos = {
              x: Math.max(player.halfW, Math.min(WORLD_WIDTH - player.halfW, player.pos.x + dir * step)),
              y: player.pos.y,
            };
          }
        } else if (this.playerIntent.moveX !== ZERO) {
          const x = player.pos.x + this.playerIntent.moveX * PLAYER_MOVE_SPEED * stepMs;
          player.pos = {
            x: Math.max(player.halfW, Math.min(WORLD_WIDTH - player.halfW, x)),
            y: player.pos.y,
          };
        }
      }
      // Edge-triggered skill press queued by the scene.
      if (this.queuedSkill !== null) {
        this.tryCastSkill(this.queuedSkill);
        this.queuedSkill = null;
      }
      // AI seam: consulted once per fighting tick; the Sim executes the
      // returned intent blindly (the controller decides timing/ranges).
      // Re-checked after the queued skill: a mid-tick kill ends the tick's
      // combat sub-steps (the dead don't strike, throw, or get hit — audit).
      // Via the getter: TS narrowing can't see tryCastSkill mutating phase.
      if (this.phase !== 'fighting') return;
      const intent: OpponentIntent = this.opponent.next(this.frameCount, this.opponentView());
      if (intent.telegraph !== undefined) {
        this.events.push({
          type: 'enemyTelegraph',
          kind: intent.telegraph.kind,
          durationMs: intent.telegraph.durationMs,
        });
      }
      if (intent.moveX !== undefined && Number.isFinite(intent.moveX)) {
        const enemy = this.fighters.enemy;
        const stepMs = MS_PER_S / FIXED_HZ;
        const dir = Math.max(-ONE, Math.min(ONE, intent.moveX));
        const x = enemy.pos.x + dir * ENEMY_SPEED * stepMs;
        enemy.pos = {
          x: Math.max(enemy.halfW, Math.min(WORLD_WIDTH - enemy.halfW, x)),
          y: enemy.pos.y,
        };
      }
      if (intent.switchStance !== undefined) {
        this.requestStanceSwitch('enemy', intent.switchStance);
      }
      if (intent.strike === true) this.executeStrike();
      if (intent.throwKunai === true) this.throwKunai();
      this.stepKunai();
    }
    const player = this.fighters.player;
    if (player.jump === null) return;
    player.jump.frame += ONE;
    const t = player.jump.frame / JUMP_DURATION_FRAMES;
    player.pos = jumpArcPoint(t, player.jump.from, player.jump.to, JUMP_APEX_PX);
    if (t >= ONE) player.jump = null;
  }
}
