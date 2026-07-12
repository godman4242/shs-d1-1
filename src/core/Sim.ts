import {
  CHI_PUNCH_DMG_L1,
  FOCUS_MAX,
  FOCUS_START,
  FOCUS_SWITCH_COST,
  SPAWN_INVULN_S,
  WEAPON_WEIGHT,
} from '../config/combat';
import {
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
import { GAME_WIDTH } from '../config/display';
import { SKILL_COOLDOWN_MS } from '../config/skills';
import { JUMP_APEX_PX, JUMP_DURATION_FRAMES } from '../config/duel';
import { ONE, TWO, ZERO } from '../config/nums';
import type { StanceId } from '../config/stances';
import { FIXED_HZ, FRAME_QUANT_EPS, MS_PER_S } from '../config/timing';
import { Combo } from './combo';
import { criticalReady, focusToUnits, unitsToCritical, unitsToFocus } from './critical';
import { physicalDamage } from './damage';
import type { DrawnStroke } from './DrawnStroke';
import type { Gesture } from './gesture';
import { ENEMY_SPEED } from '../config/ai';
import type { OpponentController, OpponentIntent, OpponentView } from './OpponentController';
import { isOffArena, projectileHits, spawnProjectile, stepProjectile, type Projectile } from './projectile';
import { resolveSlash, type SlashResult } from './slash';
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
  | { type: 'invulnBlocked'; target: FighterSide }
  | { type: 'kunaiThrown' }
  | { type: 'kunaiDeflected' }
  | { type: 'shunpoStarted' }
  | { type: 'shunpoEnded' }
  | { type: 'enemyTelegraph'; kind: 'strike' | 'stance'; durationMs: number }
  | { type: 'strikeBlocked'; by: FighterSide };

/**
 * Per-tick held-state input from the scene (edge-triggered skill presses go
 * through queueSkill instead). moveX is -1 | 0 | 1; setPlayerIntent clamps
 * and NaN-guards it (scene input is an untrusted Sim boundary).
 */
export interface PlayerIntent {
  moveX: number;
  shunpoHeld: boolean;
}

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

function spawnFighter(spawn: FighterSpawn): FighterState {
  return {
    pos: { ...spawn.pos },
    hp: spawn.hp,
    stance: spawn.stance,
    focusUnits: focusToUnits(FOCUS_START),
    criticalUnits: ZERO,
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
  private playerIntent: PlayerIntent = { moveX: ZERO, shunpoHeld: false };
  private queuedSkill: SkillVerb | null = null;
  private readonly cooldownUntil: Record<SkillVerb, number> = {
    chiPunch: ZERO,
    smokeBomb: ZERO,
    stab: ZERO,
  };
  /** Frame the player's stab deflect window closes (0 = closed). */
  private deflectEndFrame = ZERO;
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
    this.playerIntent = { moveX, shunpoHeld: intent.shunpoHeld };
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
  applyStroke(stroke: DrawnStroke): StrokeOutcome {
    const gesture = stroke.gesture;
    if (this.phaseState !== 'fighting') return { gesture, slash: null };
    // Degenerate strokes (taps) classify as 'slash' by default — gate here at
    // the core seam so no caller can land a full-damage tap (audit finding).
    if (stroke.points.length < TWO) return { gesture, slash: null };
    const player = this.fighters.player;
    const enemy = this.fighters.enemy;
    if (gesture === 'slash') {
      // Any slash — hit or miss — is an offensive act: it ends spawn invuln.
      player.invulnEndFrame = ZERO;
      const critReady = criticalReady(player.criticalUnits);
      const result = resolveSlash(
        stroke,
        { polygon: this.hitbox('enemy'), stance: enemy.stance, hp: enemy.hp, defense: enemy.defense },
        { atkPlusWeapon: player.atkPlusWeapon, stance: player.stance, crit: critReady },
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
        // Arena-clamped like walking — an off-canvas stroke must not land
        // the fighter outside the stage (audit).
        const clampX = (v: number): number =>
          Math.max(player.halfW, Math.min(GAME_WIDTH - player.halfW, v));
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

  private tryCastSkill(verb: SkillVerb): void {
    if (this.frameCount < this.cooldownUntil[verb]) return;
    const player = this.fighters.player;
    const enemy = this.fighters.enemy;
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
          Math.min(GAME_WIDTH - player.halfW, player.pos.x + away * SMOKE_BOMB_DISTANCE),
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
      }
      this.updateShunpo();
      // Player movement (A/D). The jump arc owns the position while airborne.
      const player = this.fighters.player;
      if (player.jump === null && this.playerIntent.moveX !== ZERO) {
        const stepMs = MS_PER_S / FIXED_HZ;
        const x = player.pos.x + this.playerIntent.moveX * PLAYER_MOVE_SPEED * stepMs;
        player.pos = {
          x: Math.max(player.halfW, Math.min(GAME_WIDTH - player.halfW, x)),
          y: player.pos.y,
        };
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
          x: Math.max(enemy.halfW, Math.min(GAME_WIDTH - enemy.halfW, x)),
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
