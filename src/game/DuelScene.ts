import Phaser from 'phaser';
import { AI_TIERS } from '../config/ai';
import { CHI_COST } from '../config/chi';
import {
  BLADE_CORE_WIDTH,
  BLADE_EDGE_WIDTH,
  BLADE_FADE_MS,
  BLADE_MIN_TAPER,
  BLOOD_COUNT,
  BLOOD_COUNT_SEVERED,
  BLOOD_SPEED_MAX,
  BLOOD_SPEED_MIN,
  BLOOD_SPREAD_DEG,
} from '../config/combat';
import { SKILL_VERB } from '../config/combat-sim';
import { DUEL_ENEMY } from '../config/duel';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/display';
import { BAR_GRADIENTS } from '../config/fidelity';
import { FINISHER_FLASH, SLASH_ARC } from '../config/fx';
import { COL } from '../config/palette';
import { SKILL_COOLDOWN_MS } from '../config/skills';
import { AISeamController } from '../core/AISeamController';
import { DrawnStroke } from '../core/DrawnStroke';
import { advanceFxClock, integrateDroplet } from '../core/fx';
import { closestPointOnPolyline } from '../core/geometry';
import { mulberry32 } from '../core/rng';
import { nextStance } from '../core/stance';
import { duelSetup } from '../core/duelSetup';
import { Sim, type ActorId } from '../core/Sim';
import { stageToWorld, VIEW, worldToStage } from '../core/viewport';
import type { Vec } from '../core/vec';
import { OG_DUEL_STAGE } from '../config/art';
import { OG_DRESSED_NODES, OG_DRESSED_SLOT_SHAPES, OG_SLOT_ALIASES } from '../config/ogPose';
import { composePose, type PosedPart } from '../core/composePose';
import { FighterAnimator } from '../core/fighterAnimator';
import { planPose } from '../core/planPose';
import { FIGHTER_SHAPES } from './art/fighterShapes';
import { drawPlan } from './OgArtScene';

/** Render-FX record: a finished stroke's blade trail, fading out. */
interface Trail {
  points: readonly Vec[];
  bornAt: number;
}

/** Render-FX record: one blood droplet. */
interface Droplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bornAt: number;
}

/** AUTO SLASH plate box — measured (74,24)-(367,85)@1920×1080 → stage px.
 *  Named once so the drawn plate and its click target can never drift apart
 *  (D7: the plate is a real toggle now, so it needs a hit area). */
const AUTO_PLATE = { x: 39, y: 12, w: 157, h: 34 };
const BLOOD_LIFE_MS = 650;
const BLOOD_GRAVITY = 780; // px/s² — render feel only
const DEG_TO_RAD = Math.PI / 180;
// HUD geometry below is frame-MEASURED off the original (fidelity gate v1,
// 2026-07-16): normalized landmarks from the B-23 duel window × our
// 1024×576 stage, cross-checked against A-28 (deltas ≤6px @1080p).
// The gate (config/fidelity.ts + `await __fidelity.run()`) pins it.

/**
 * Stage-2 DuelScene — RENDER-ONLY (src/game/CLAUDE.md): builds PlayerIntent
 * from input, calls sim.advance(delta × sim.timeScale), drains SimEvents
 * into FX, and draws everything from sim state. Layout anatomy is built
 * FROM the study frames (A-00 combat frame + B-23 HUD; kickoff fidelity
 * pull-forward): bamboo/pastel parallax arena, letterbox strips, flat-color
 * bold-outline fighters, enemy "NAME (LEVEL)" + overhead green bar,
 * portrait/coins/XP HUD, skill bar, HIT COMBO plate, AUTO SLASH OFF plate.
 * Palette sits at near-OG hues (owner veto of the trade-dress shift, 2026-07-12).
 * Numeric literals here are render layout only — baselined by the M8 ratchet.
 *
 * TWO CLOCKS (M10 audit fix): `fxNow` advances by delta × active-timescale and
 * owns everything that must slow with the fight — trail/stroke/droplet aging,
 * droplet integration, telegraph + guard cues. The WALL clock (time.now) owns
 * the kill-beat hold (~0.9 s real) and the invuln blink. Mixing them up
 * re-opens the bug where Shunpo slowed gameplay to 0.35× but blood ran 1×.
 *
 * TWO SPACES (SESSION13 A0). The Sim lives in WORLD units (800×480); this
 * canvas is STAGE units (1024×576). The conversion happens at exactly two
 * boundaries and nowhere else:
 *   - INPUT: pointer stage px → `stageToWorld` before anything reaches the Sim
 *     (`dragPoints` and `mouseTargetX` are stored WORLD-side).
 *   - OUTPUT: every sim-owned position → `worldToStage` at draw time.
 * Chrome (arena art, HUD, blood droplets, pose-local skeleton coords) is
 * stage-native and never converted — which is what makes the 55/55 fidelity
 * gate invariant under the split.
 */
export class DuelScene extends Phaser.Scene {
  private sim!: Sim;
  private fx!: Phaser.GameObjects.Graphics;
  private hud!: Phaser.GameObjects.Graphics;
  private texts!: {
    combo: Phaser.GameObjects.Text;
    comboPlate: Phaser.GameObjects.Text;
    nameplate: Phaser.GameObjects.Text;
    playerName: Phaser.GameObjects.Text;
    hpLabel: Phaser.GameObjects.Text;
    chiLabel: Phaser.GameObjects.Text;
    stance: Phaser.GameObjects.Text;
    autoSlash: Phaser.GameObjects.Text;
    slots: Phaser.GameObjects.Text[];
  };
  private dragPoints: Vec[] = [];
  private dragging = false;
  private trails: Trail[] = [];
  private redStrokes: Trail[] = [];
  private droplets: Droplet[] = [];
  private keys?: Record<'A' | 'D' | 'SHIFT', Phaser.Input.Keyboard.Key>;
  private telegraphUntil = 0;
  /** fx-clock deadline of the chi-bar denial flash (skillDenied cue, M3). */
  private chiDeniedUntil = 0;
  private telegraphKind: 'strike' | 'stance' = 'strike';
  private enemyGuardUntil = 0;
  private killBeatAt = 0;
  private resultLaunched = false;
  private fxNow = 0;
  // Skeletal animators (Stage 4 M0) — RENDER-side pose state only (which
  // frame of a swing to draw); Sim stays the single owner of gameplay truth.
  // A11.1: nothing reads their poses yet — the event wiring stays warm for the
  // A11.4 transcribed-frame stepper, and the drawn figure is the composed idle.
  private playerAnim = new FighterAnimator();
  private enemyAnim = new FighterAnimator();
  // THE COMPOSED OG FIGHTER (SESSION23 A11.1): one parts table, composed once
  // per create() from the byte-checked pose + dressed slot map, re-planned at
  // each fighter's ground anchor every frame. Mirroring lands in A11.2.
  private fighterParts: readonly PosedPart[] = [];
  // Session 11: mouse hold-to-run — when the mouse is held but NOT dragging
  // a stroke (pointerdown with minimal movement), the player runs toward the
  // cursor position. Once a stroke is being drawn (dragPoints growing), it
  // becomes a slash gesture and movement stops.
  private mouseHoldActive = false;
  private mouseTargetX = 0;

  constructor() {
    super('duel');
  }

  create(): void {
    // Timescale discipline (known failure class: stuck timescale on
    // restart): pin BOTH clocks to 1 in create(), mirror sim.timeScale each
    // update, and restore on shutdown.
    this.time.timeScale = 1;
    this.tweens.timeScale = 1;
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.time.timeScale = 1;
      this.tweens.timeScale = 1;
    });
    this.killBeatAt = 0;
    this.resultLaunched = false;
    this.telegraphUntil = 0;
    this.chiDeniedUntil = 0;
    this.enemyGuardUntil = 0;
    this.fxNow = 0;
    this.trails = [];
    this.redStrokes = [];
    this.droplets = [];
    this.dragPoints = [];
    this.dragging = false;
    this.playerAnim = new FighterAnimator();
    this.enemyAnim = new FighterAnimator();
    this.fighterParts = composePose(OG_DRESSED_NODES, OG_DRESSED_SLOT_SHAPES, OG_SLOT_ALIASES);
    this.mouseHoldActive = false;
    this.mouseTargetX = 0;

    // (The persisted profile is no longer read here: the OG shows no
    // coins/XP chrome during fights — DuelResult owns accrual/persistence.)

    // Seeded mulberry32 at the boundary (Math.random is banned in core/).
    // Sim and AI share one stream — call order is deterministic.
    const rng = mulberry32(Date.now());
    const opponent = new AISeamController(rng, AI_TIERS.normal);
    // AUTO SLASH (D7) hands the PLAYER to the same routine — but its OWN
    // instance: the controllers carry telegraph/mode state, and one shared
    // instance would interleave the two fighters' decisions.
    const autoController = new AISeamController(rng, AI_TIERS.normal);
    // Enemy HP/damage are DERIVED from the player at spawn (D3) — shared with
    // the 24-seed harness through core/duelSetup so the two cannot drift.
    this.sim = new Sim(rng, duelSetup(opponent), autoController);

    this.drawArena();
    this.fx = this.add.graphics().setDepth(10);
    this.hud = this.add.graphics().setDepth(20);
    this.createHudTexts();

    // Intro overlay owns VS → name → READY → FIGHT!; combat goes live on
    // its signal (sim discards every pre-FIGHT stroke — gate item).
    this.events.once('intro-done', () => {
      this.sim.beginCombat();
    });
    // A duel restart can arrive while a previous intro is still on screen —
    // launch() on an active scene is a no-op, which left a STALE intro
    // driving the new duel (found live in browser verify). Stop it first.
    if (this.scene.isActive('duel-intro')) this.scene.stop('duel-intro');
    this.scene.launch('duel-intro');

    // SPACE cycles stance; clicking the portrait swaps too (gate item).
    this.input.keyboard?.on('keydown-SPACE', () => {
      this.sim.requestStanceSwitch('player', nextStance(this.sim.player.stance));
    });
    this.input.keyboard?.on('keydown-ONE', () => { this.sim.queueSkill('chiPunch'); });
    this.input.keyboard?.on('keydown-TWO', () => { this.sim.queueSkill('smokeBomb'); });
    this.input.keyboard?.on('keydown-THREE', () => { this.sim.queueSkill('stab'); });
    this.keys = this.input.keyboard?.addKeys('A,D,SHIFT') as Record<
      'A' | 'D' | 'SHIFT',
      Phaser.Input.Keyboard.Key
    > | undefined;

    const portraitZone = this.add.zone(91, 537, 90, 90).setInteractive();
    portraitZone.on(
      'pointerdown',
      (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: { stopPropagation: () => void }) => {
        ev.stopPropagation(); // a portrait click is a UI action, not a stroke
        this.sim.requestStanceSwitch('player', nextStance(this.sim.player.stance));
      },
    );

    // INPUT BOUNDARY (A0): pointer arrives in stage px and is converted to
    // WORLD once, here. Everything downstream — dragPoints, the DrawnStroke,
    // the movement target — is world-side.
    // AUTO SLASH plate — a REAL toggle now (D7). Its veto reads "the plate must
    // never lie again", so the label is driven from sim state, not a constant.
    const autoZone = this.add
      .zone(AUTO_PLATE.x + AUTO_PLATE.w / 2, AUTO_PLATE.y + AUTO_PLATE.h / 2, AUTO_PLATE.w, AUTO_PLATE.h)
      .setInteractive();
    autoZone.on(
      'pointerdown',
      (_p: Phaser.Input.Pointer, _x: number, _y: number, ev: { stopPropagation: () => void }) => {
        ev.stopPropagation(); // a plate click is a UI action, not a stroke
        this.sim.setAutoSlash(!this.sim.autoSlash);
        this.texts.autoSlash.setText(`AUTO SLASH ${this.sim.autoSlash ? 'ON' : 'OFF'}`);
      },
    );

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (this.sim.autoSlash) return; // manual input is locked out
      const w = stageToWorld({ x: p.x, y: p.y });
      this.dragging = true;
      this.dragPoints = [w];
      // Session 11: start tracking as a potential hold-to-run
      this.mouseHoldActive = true;
      this.mouseTargetX = w.x;
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      const w = stageToWorld({ x: p.x, y: p.y });
      if (this.dragging && this.dragPoints.length < 2048) this.dragPoints.push(w);
      // Update mouse target while holding (even if dragging, the target tracks)
      if (this.mouseHoldActive) this.mouseTargetX = w.x;
    });
    // Off-canvas releases emit 'pointerupoutside' — both must finish the
    // stroke or it is silently swallowed (Stage-1 audit finding).
    const finishDrag = (p: Phaser.Input.Pointer): void => {
      if (this.dragging) {
        this.dragPoints.push(stageToWorld({ x: p.x, y: p.y }));
        this.finishStroke();
      }
      this.dragging = false;
      this.mouseHoldActive = false;
    };
    this.input.on('pointerup', finishDrag);
    this.input.on('pointerupoutside', finishDrag);
  }

  /** Bamboo/pastel parallax arena (fidelity tell 19, from the A-00 combat
   * frame): pastel sky, mist mounds, dark canopy, staggered bamboo rows,
   * grass band, stone lanterns, letterbox strips. */
  private drawArena(): void {
    const g = this.add.graphics();
    g.fillGradientStyle(COL.skyTop, COL.skyTop, COL.skyLow, COL.skyLow, 1);
    g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Far mist mounds (pastel sage)
    g.fillStyle(COL.sage, 0.5);
    for (let i = 0; i < 5; i++) {
      const cx = i * 260 - 40 + ((i * 97) % 60);
      g.fillEllipse(cx, 430, 460, 190 + ((i * 53) % 60));
    }

    // Dark canopy ceiling (hangs into the frame)
    g.fillStyle(COL.forestDark, 0.92);
    g.fillRect(0, 0, GAME_WIDTH, 74);
    for (let i = 0; i < 13; i++) {
      const cx = i * 86 + ((i * 41) % 40);
      g.fillEllipse(cx, 84, 150, 60 + ((i * 29) % 30));
    }

    // Back bamboo row (thin, muted)
    for (let i = 0; i < 11; i++) {
      const bx = 30 + i * 96 + ((i * 37) % 28);
      this.drawBamboo(g, bx, 12 + ((i * 13) % 10), COL.forestShadow, 0.85);
    }
    // Mid grass mounds
    g.fillStyle(COL.forestBright, 0.9);
    for (let i = 0; i < 4; i++) {
      g.fillEllipse(140 + i * 280, 470, 340, 130);
    }
    // Front bamboo row (bold)
    for (let i = 0; i < 7; i++) {
      const bx = 70 + i * 150 + ((i * 61) % 44);
      this.drawBamboo(g, bx, 20 + ((i * 17) % 12), COL.forestMid2, 1);
    }

    // Stone lanterns on the ground band (arena dressing from the frame)
    for (const lx of [150, 560]) {
      g.fillStyle(COL.outline, 0.9);
      g.fillRect(lx - 12, 396, 24, 40);
      g.fillTriangle(lx - 20, 400, lx + 20, 400, lx, 382);
      g.fillStyle(COL.kimono2, 0.85);
      g.fillRect(lx - 8, 404, 16, 12);
    }

    // Grass band + foreground shadow
    g.fillStyle(COL.forestMid, 1);
    g.fillRect(0, 436, GAME_WIDTH, GAME_HEIGHT - 436);
    g.fillStyle(COL.forestBright, 1);
    g.fillRect(0, 436, GAME_WIDTH, 9);
    g.fillStyle(COL.forestDark, 1);
    g.fillRect(0, 516, GAME_WIDTH, GAME_HEIGHT - 516);
    // (No standing letterbox strips: the original letterboxes only during
    // the encounter-intro transition, never in live combat — fidelity gate
    // v1 finding, B-23 t=3774 full-bleed vs t=3771 banded intro.)

    // AUTO SLASH OFF plate — measured box (74,24)-(367,85)@1920×1080.
    g.fillStyle(COL.outline, 1);
    g.fillRect(AUTO_PLATE.x, AUTO_PLATE.y, AUTO_PLATE.w, AUTO_PLATE.h);
    g.fillStyle(COL.goldTrim, 1);
    g.fillRect(41, 14, 153, 30);
    g.fillStyle(COL.plateBrown, 1);
    g.fillRect(43, 16, 149, 26);
  }

  /** One bamboo stalk: segmented vertical culm with node lines + leaves. */
  private drawBamboo(g: Phaser.GameObjects.Graphics, x: number, w: number, color: number, alpha: number): void {
    g.fillStyle(COL.outline, alpha);
    g.fillRect(x - w / 2 - 2, 60, w + 4, 380);
    g.fillStyle(color, alpha);
    g.fillRect(x - w / 2, 60, w, 380);
    g.fillStyle(COL.forestShadow, alpha);
    for (let y = 100; y < 440; y += 62) g.fillRect(x - w / 2, y, w, 4);
    g.fillStyle(color, alpha * 0.9);
    g.fillEllipse(x - w, 96, 34, 10);
    g.fillEllipse(x + w, 150, 30, 9);
  }

  private createHudTexts(): void {
    const style = (size: number, color = '#efedc2'): Phaser.Types.GameObjects.Text.TextStyle => ({
      fontFamily: 'Georgia, serif',
      fontStyle: 'bold',
      fontSize: `${size}px`,
      color,
      stroke: '#040304',
      strokeThickness: 4,
    });
    this.texts = {
      // NO coins/XP counters here: the original hides ALL overworld chrome
      // (coins, XP, minimap) during fights — both wild encounters (A-28) and
      // VS-duels (B-23). Accrual still pays into the persisted profile via
      // DuelResult; the reward card is where the numbers show (as in the OG).
      // Combo numeral: authored #990000 (byte-exact in the lossless A8 shot).
      combo: this.add
        .text(GAME_WIDTH - 60, 74, '', {
          ...style(64, '#990000'),
          fontStyle: 'bold italic',
          strokeThickness: 6,
        })
        .setOrigin(1, 0)
        .setDepth(21),
      comboPlate: this.add
        .text(GAME_WIDTH - 24, 96, '', { ...style(16), backgroundColor: '#040304' })
        .setOrigin(1, 0)
        .setDepth(21),
      // VS-duel opponents read WHITE (B-23); red labels are wild-mob aggro
      // tags (A-28) — fidelity gate v1 reading.
      nameplate: this.add
        .text(0, 0, `${DUEL_ENEMY.name} (${DUEL_ENEMY.level})`, style(16, '#f5f5ef'))
        .setOrigin(0.5, 1)
        .setDepth(21),
      // Player overhead name — the original shows it in gold ("GUEST" when
      // unregistered, A-28); we are pre-login until Stage 4's title flow.
      // Gold re-measured slice 2b: VS-band name median #f4be09 (B t=3771.55-
      // 3772.55); the floating name reads (229,182,24) — same authored gold.
      playerName: this.add.text(0, 0, 'GUEST', style(16, '#f4be09')).setOrigin(0.5, 1).setDepth(21),
      // Bar fraction labels ("14/30"-style) — confirmed in BOTH builds
      // (B t=3771.55-3772.55 HP label box (344,966)-(414,988) centered on the
      // bar; white bold, black outline, cap ≈22px @1080 ≈ 12 stage px).
      hpLabel: this.add.text(202, 522, '', { ...style(15, '#fafafa'), strokeThickness: 3 })
        .setOrigin(0.5)
        .setDepth(21),
      chiLabel: this.add.text(202, 539, '', { ...style(15, '#fafafa'), strokeThickness: 3 })
        .setOrigin(0.5)
        .setDepth(21),
      stance: this.add.text(131, GAME_HEIGHT - 17, '', style(13)).setDepth(21),
      // Text sits ~62% down the plate like the OG's; the fill rows above it
      // are what the plate probes sample.
      autoSlash: this.add
        .text(117, 34, 'AUTO SLASH OFF', { ...style(12, '#cfc9b8'), strokeThickness: 3 })
        .setOrigin(0.5)
        .setDepth(21),
      slots: [1, 2, 3].map((n, i) =>
        this.add
          .text(799 + i * 73.5, 497, String(n), style(15))
          .setOrigin(0.5)
          .setDepth(22),
      ),
    };
  }

  private finishStroke(): void {
    const stroke = new DrawnStroke(this.dragPoints);
    this.dragPoints = [];
    if (this.sim.autoSlash) return; // locked out (the Sim rejects it too)
    if (stroke.points.length < 2) return;

    const now = this.fxNow;
    this.redStrokes.push({ points: stroke.points, bornAt: now });

    const outcome = this.sim.applyStroke(stroke);
    if (outcome.gesture !== 'slash') return;

    // Cosmetic follow-through: damage resolved on this tick (windup 0 —
    // signature feel); the swing arc plays out per-stance (Tell 6).
    this.playerAnim.startSlash(this.sim.player.stance);
    this.trails.push({ points: stroke.points, bornAt: now });
    if (outcome.slash?.hit === true) {
      const enemyPos = this.sim.enemy.pos;
      const impact = closestPointOnPolyline(enemyPos, stroke.points) ?? enemyPos;
      const severed = outcome.slash.severed.length > 0;
      // Droplets are stage-space render FX (BLOOD_GRAVITY et al are stage px).
      this.spawnBlood(worldToStage(impact), stroke.direction, severed, now);
    }
  }

  /** World points → stage points for drawing (A0 output boundary). */
  private toStagePts(points: readonly Vec[]): Vec[] {
    return points.map((p) => worldToStage(p));
  }

  /** Directional burst along the cut: right cut → 0°, left cut → 180°.
   * `at` is STAGE space; `direction` is a unit vector (scale-invariant). */
  private spawnBlood(at: Vec, direction: Vec, severed: boolean, now: number): void {
    const count = severed ? BLOOD_COUNT_SEVERED : BLOOD_COUNT;
    const baseAngle = Math.atan2(direction.y, direction.x);
    const spread = BLOOD_SPREAD_DEG * DEG_TO_RAD;
    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * spread;
      const speed = BLOOD_SPEED_MIN + Math.random() * (BLOOD_SPEED_MAX - BLOOD_SPEED_MIN);
      this.droplets.push({
        x: at.x,
        y: at.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        bornAt: now,
      });
    }
  }

  override update(_time: number, delta: number): void {
    // Held-state intent BEFORE advancing: A/D movement + SHIFT Shunpo.
    const moveX = (this.keys?.D.isDown === true ? 1 : 0) - (this.keys?.A.isDown === true ? 1 : 0);
    // Session 11: mouse hold-to-run takes priority over A/D. If the mouse is
    // held, we feed the cursor X as a movement target. Once a stroke is being
    // drawn (dragPoints > 4), it's a slash — movement pauses during the swing.
    const mouseMoving = this.mouseHoldActive && this.dragPoints.length < 4;
    this.sim.setPlayerIntent({
      moveX,
      shunpoHeld: this.keys?.SHIFT.isDown === true,
      moveTargetX: mouseMoving ? this.mouseTargetX : null,
    });

    // Sim owns the fixed-step accumulator; the scene forwards
    // delta × sim.timeScale (spec item 11 — Shunpo slow-mo).
    this.sim.advance(delta * this.sim.timeScale);

    // Mirror the sim timescale onto Phaser's clocks TOGETHER (tween/timer FX
    // must slow with the fight); the kill beat overrides below. The fx clock
    // advances by the SAME active timescale — time.now is unscaled and must
    // never age FX again (M10 audit fix).
    const now = this.time.now;
    const inKillBeat = this.killBeatAt > 0 && now - this.killBeatAt < FINISHER_FLASH.durationMs;
    const ts = inKillBeat ? FINISHER_FLASH.slowMoScale : this.sim.timeScale;
    this.time.timeScale = ts;
    this.tweens.timeScale = ts;
    this.fxNow = advanceFxClock(this.fxNow, delta, ts);
    const fxNow = this.fxNow;

    for (const ev of this.sim.drainEvents()) {
      if (ev.type === 'enemyTelegraph') {
        // Sim-time cue: the strike lands telegraphMs of SIM time later, so
        // the windup aura must age on the fx clock or it dies early in slow-mo.
        this.telegraphUntil = fxNow + ev.durationMs;
        this.telegraphKind = ev.kind;
      } else if (ev.type === 'autoStroke') {
        // D7: "the generated line is drawn on screen" — same two render paths
        // a hand-drawn stroke takes.
        this.redStrokes.push({ points: ev.points, bornAt: fxNow });
        this.trails.push({ points: ev.points, bornAt: fxNow });
        this.playerAnim.startSlash(this.sim.player.stance);
      } else if (ev.type === 'strikeBlocked') {
        this.enemyGuardUntil = fxNow + 260;
      } else if (ev.type === 'skillDenied') {
        this.chiDeniedUntil = fxNow + 300; // chi bar flashes "too expensive"
      } else if (ev.type === 'damage' && ev.target === 'player') {
        const p = worldToStage(this.sim.player.pos);
        this.spawnBlood({ x: p.x, y: p.y - 20 }, { x: -1, y: 0 }, false, fxNow);
        this.playerAnim.startHit();
        this.enemyAnim.startSlash(this.sim.enemy.stance);
      } else if (ev.type === 'damage' && ev.target === this.sim.enemyId) {
        // The duel has exactly ONE opponent, so its id is the whole crowd.
        this.enemyAnim.startHit();
      } else if (ev.type === 'strikeEvaded' && ev.by === 'player') {
        this.enemyAnim.startSlash(this.sim.enemy.stance); // whiffed swing still animates
      } else if (ev.type === 'invulnBlocked' && ev.target === 'player') {
        this.enemyAnim.startSlash(this.sim.enemy.stance);
      } else if (ev.type === 'fightEnded') {
        this.killBeatAt = now;
        this.pendingWinner = ev.winner;
        // The loser collapses through the kill-beat slow-mo (fx clock).
        (ev.winner === 'player' ? this.enemyAnim : this.playerAnim).startDeath();
      }
    }

    // Kill beat (SYNTHESIS §4): hard hold on the frozen frame, then the
    // result screen. FINISHER_FLASH drives the flash + slow-mo ramp.
    if (this.killBeatAt > 0 && !this.resultLaunched && now - this.killBeatAt >= 900) {
      this.resultLaunched = true;
      this.time.timeScale = 1;
      this.tweens.timeScale = 1;
      // DuelResult speaks the duel's two-sided language; the sim now speaks
      // actor ids, so the single opponent folds back to 'enemy' here.
      this.scene.launch('duel-result', {
        winner: this.pendingWinner === 'player' ? 'player' : 'enemy',
      });
    }

    const fxDt = (delta * ts) / 1000;
    const g = this.fx;
    g.clear();

    // Live drag: the red directional stroke (SLASH_ARC render path).
    // Stroke points are WORLD-side — converted here, at the draw boundary.
    if (this.dragging && this.dragPoints.length > 1) {
      const pts = this.toStagePts(this.dragPoints);
      this.strokePinched(g, pts, COL.blood, SLASH_ARC.bodyHalfWidth, 0.35, SLASH_ARC.minTaper, SLASH_ARC.taperPow);
      this.strokePinched(g, pts, COL.bloodBright, SLASH_ARC.coreHalfWidth, 0.8, SLASH_ARC.minTaper, SLASH_ARC.taperPow);
    }
    this.redStrokes = this.redStrokes.filter((s) => fxNow - s.bornAt < SLASH_ARC.hangMs + SLASH_ARC.fadeMs);
    for (const s of this.redStrokes) {
      const age = fxNow - s.bornAt;
      const alpha = age < SLASH_ARC.hangMs ? 1 : 1 - (age - SLASH_ARC.hangMs) / SLASH_ARC.fadeMs;
      const pts = this.toStagePts(s.points);
      this.strokePinched(g, pts, COL.blood, SLASH_ARC.bodyHalfWidth, 0.3 * alpha, SLASH_ARC.minTaper, SLASH_ARC.taperPow);
      this.strokePinched(g, pts, COL.bloodBright, SLASH_ARC.coreHalfWidth, 0.7 * alpha, SLASH_ARC.minTaper, SLASH_ARC.taperPow);
    }

    // Two-layer blade trail: chi-colored edge under a white core, fading
    this.trails = this.trails.filter((t) => fxNow - t.bornAt < BLADE_FADE_MS);
    for (const t of this.trails) {
      const alpha = 1 - (fxNow - t.bornAt) / BLADE_FADE_MS;
      const pts = this.toStagePts(t.points);
      this.strokePinched(g, pts, COL.bladeChi, BLADE_EDGE_WIDTH, alpha, BLADE_MIN_TAPER, 1);
      this.strokePinched(g, pts, COL.kimono, BLADE_CORE_WIDTH, alpha, BLADE_MIN_TAPER, 1);
    }

    // Blood droplets: integrate on the fx clock, then draw
    this.droplets = this.droplets.filter((d) => fxNow - d.bornAt < BLOOD_LIFE_MS);
    for (const d of this.droplets) {
      Object.assign(d, integrateDroplet(d, fxDt, BLOOD_GRAVITY));
      const alpha = 1 - (fxNow - d.bornAt) / BLOOD_LIFE_MS;
      g.fillStyle(COL.bloodBright, alpha);
      g.fillCircle(d.x, d.y, 3);
      g.fillStyle(COL.blood, alpha * 0.8);
      g.fillCircle(d.x - d.vx * 0.008, d.y - d.vy * 0.008, 2);
    }

    this.drawFighters(g, now);

    // Kunai: short dark bolts along the velocity direction. Position is
    // sim-owned (world); the bolt length is a stage-native render size and
    // the velocity is normalized first, so only the position converts.
    for (const k of this.sim.projectiles) {
      const kp = worldToStage(k.pos);
      const mag = Math.hypot(k.vel.x, k.vel.y) || 1;
      const dx = (k.vel.x / mag) * 14;
      const dy = (k.vel.y / mag) * 14;
      g.lineStyle(3, COL.outline, 1);
      g.beginPath();
      g.moveTo(kp.x - dx, kp.y - dy);
      g.lineTo(kp.x, kp.y);
      g.strokePath();
      g.fillStyle(COL.kimono, 1);
      g.fillCircle(kp.x, kp.y, 2.5);
    }

    // Kill-beat flash: hard red cut over everything, snapping in fast.
    if (this.killBeatAt > 0) {
      const age = now - this.killBeatAt;
      const a =
        age < FINISHER_FLASH.snapInMs
          ? age / FINISHER_FLASH.snapInMs
          : Math.max(0, 1 - (age - FINISHER_FLASH.snapInMs) / FINISHER_FLASH.durationMs);
      g.fillStyle(COL.bloodDark, 0.85 * a);
      g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    this.drawHud(now);
  }

  private pendingWinner: ActorId = 'player';

  private drawFighters(g: Phaser.GameObjects.Graphics, now: number): void {
    const player = this.sim.player;
    const enemy = this.sim.enemy;
    const fxNow = this.fxNow;
    // OUTPUT BOUNDARY (A0): sim positions are WORLD — convert once, here, and
    // draw everything below in stage px (every offset below is stage-native).
    const ps = worldToStage(player.pos);
    const es = worldToStage(enemy.pos);

    // Spawn-invuln / i-frame blink — WALL clock on purpose (research CONTRACT:
    // the blinking indicator keeps real-time cadence even in slow-mo).
    const blinkOff = Math.floor(now / 100) % 2 === 0;
    const playerAlpha = player.invulnerable && blinkOff ? 0.25 : 1;

    // Enemy windup flash: pulsing aura (red strike / blue pending stance).
    // Sim-time cue → fx clock, so the aura holds until the strike lands.
    if (fxNow < this.telegraphUntil) {
      const pulse = 0.3 + 0.3 * Math.abs(Math.sin(fxNow / 90));
      g.fillStyle(this.telegraphKind === 'strike' ? COL.blood : COL.focusBlue, pulse);
      g.fillEllipse(es.x, es.y + 30, 120, 40);
    }

    // Enemy guard hold mirrors the telegraph/block windows (fx clock) — kept
    // warm on the animator for A11.4, which maps it to transcribed frames.
    this.enemyAnim.setGuard(
      fxNow < this.enemyGuardUntil
        ? 'block'
        : fxNow < this.telegraphUntil && this.telegraphKind === 'strike'
          ? 'telegraph'
          : 'none',
    );

    // THE COMPOSED OG FIGHTER (SESSION23 A11.1): the byte-checked dressed
    // pose, planned at each fighter's ground anchor (feet-origin, the same
    // ground line the old doll stood on) at the same point in the paint
    // order. Facing/mirroring is A11.2; transcribed motion is A11.3/A11.4.
    drawPlan(
      g,
      planPose(this.fighterParts, FIGHTER_SHAPES, { x: ps.x, y: ps.y + OG_DUEL_STAGE.groundOffsetY }, VIEW),
      playerAlpha,
    );
    drawPlan(
      g,
      planPose(this.fighterParts, FIGHTER_SHAPES, { x: es.x, y: es.y + OG_DUEL_STAGE.groundOffsetY }, VIEW),
      1,
    );

    // Enemy overhead: green HP bar + nameplate (fidelity tell 22). Measured:
    // bar 139×15 px @1920×1080 → 74×8 here; fill green is the original's
    // brighter overhead green (#179b32), NOT the player-bar green.
    const barW = 74;
    const ex = es.x;
    const ey = es.y - 92;
    g.fillStyle(COL.outline, 0.9);
    g.fillRect(ex - barW / 2 - 1, ey - 1, barW + 2, 8);
    g.fillStyle(COL.enemyGreen, 1);
    g.fillRect(ex - barW / 2, ey, (barW * enemy.hp) / enemy.maxHp, 6);
    this.texts.nameplate.setPosition(ex, ey - 4);
    // Player overhead name (gold "GUEST" — pre-login, matching the OG).
    this.texts.playerName.setPosition(ps.x, ps.y - 96);
  }

  private drawHud(now: number): void {
    const g = this.hud;
    g.clear();
    const player = this.sim.player;

    // Low-HP red vignette: ramps from 50% HP (SYNTHESIS §4).
    const hpFrac = player.hp / player.maxHp;
    if (hpFrac < 0.5) {
      const a = ((0.5 - hpFrac) / 0.5) * 0.4;
      g.fillStyle(COL.blood, a);
      g.fillRect(0, 0, GAME_WIDTH, 60);
      g.fillRect(0, GAME_HEIGHT - 60, GAME_WIDTH, 60);
      g.fillRect(0, 0, 46, GAME_HEIGHT);
      g.fillRect(GAME_WIDTH - 46, 0, 46, GAME_HEIGHT);
    }

    // Bottom-left: portrait in ring + bars. All geometry frame-MEASURED
    // (fidelity gate v1): ring center (170,1007) r63 @1920×1080 → (91,537)
    // r34 here; bars x 246→513 → x 131 len 142. Ring reads constant RED in
    // the original (both videos, both stances) — the stance-colored ring was
    // our invention, dropped for fidelity (stance lives in the label text).
    const pcx = 91;
    const pcy = 537;
    g.fillStyle(COL.outline, 1);
    g.fillCircle(pcx, pcy, 37);
    g.fillStyle(COL.ringRed, 1);
    g.fillCircle(pcx, pcy, 35.5);
    g.fillStyle(COL.kimono2, 1);
    g.fillCircle(pcx, pcy, 27.5);
    // mini kasa on the portrait head (original art, never traced)
    g.fillStyle(COL.outline, 1);
    g.fillTriangle(pcx - 22, pcy - 6, pcx + 22, pcy - 6, pcx, pcy - 24);
    g.fillStyle(COL.hatStraw, 1);
    g.fillTriangle(pcx - 19, pcy - 7, pcx + 19, pcy - 7, pcx, pcy - 22);

    // HP (green #02990b) over CHI (blue #2e49e2) over the white Focus pill,
    // all on the measured brown backing (#321e00) — the B-23 bar stack.
    const bx = 131;
    const barLen = 142;
    g.fillStyle(COL.outline, 1);
    g.fillRect(bx - 1, 517, barLen + 2, 11);
    g.fillRect(bx - 1, 534, barLen + 2, 10);
    g.fillRect(bx - 1, 548, barLen + 2, 11);
    g.fillStyle(COL.barBrown, 1);
    g.fillRect(bx, 518, barLen, 9);
    g.fillRect(bx, 535, barLen, 8);
    g.fillRect(bx, 549, barLen, 9);
    // Fills are vertically gradient-shaded like the original's — one
    // measured color per stage row (config/fidelity BAR_GRADIENTS).
    const hpW = (barLen * player.hp) / player.maxHp;
    BAR_GRADIENTS.hp.forEach((c, i) => {
      g.fillStyle(c, 1);
      g.fillRect(bx, 518 + i, hpW, 1);
    });
    const chiW = (barLen * player.chi) / player.maxChi;
    if (this.fxNow < this.chiDeniedUntil) {
      // Chi bar flashes blood-red while a skillDenied cue is live (M3).
      g.fillStyle(COL.blood, 1);
      g.fillRect(bx, 535, chiW, 8);
    } else {
      BAR_GRADIENTS.chi.forEach((c, i) => {
        g.fillStyle(c, 1);
        g.fillRect(bx, 535 + i, chiW, 1);
      });
    }
    // Focus pill (drains on stance swaps — our INFERRED meter in the
    // original's strip position).
    // D4: the bar shows `(units − 48) / 144` — the first 48 units are INVISIBLE.
    const focusW = barLen * player.focusDisplay;
    BAR_GRADIENTS.focus.forEach((c, i) => {
      g.fillStyle(c, 1);
      g.fillRect(bx, 549 + i, focusW, 1);
    });
    // Bar fraction labels track the live sim pools (render-only reads).
    this.texts.hpLabel.setText(`${Math.round(player.hp)}/${player.maxHp}`);
    this.texts.chiLabel.setText(`${Math.round(player.chi)}/${player.maxChi}`);

    // Shunpo sliver (INFERRED placement right of the strip).
    // Shunpo sliver only — the gold "Critical" sliver is DELETED (D4): the
    // original has three meters and Focus IS the crit meter.
    g.fillStyle(COL.kimono, 0.9);
    g.fillRect(bx + barLen + 6, 549, (40 * this.sim.shunpo) / 100, 3.5);

    // Bottom-right: skill bar (measured slots: 58×60 at x 770/843.5/917,
    // y 510; near-black interiors, grey borders, numerals above).
    const verbs = [SKILL_VERB[1], SKILL_VERB[2], SKILL_VERB[3]];
    verbs.forEach((verb, i) => {
      if (verb === undefined) return;
      const sx = 770 + i * 73.5;
      const sy = 510;
      g.fillStyle(COL.slotGrey, 1);
      g.fillRoundedRect(sx, sy, 58, 60, 8);
      g.fillStyle(COL.slotDark, 1);
      g.fillRoundedRect(sx + 3, sy + 3, 52, 54, 6);
      const remaining = this.sim.cooldownRemainingS(verb);
      const total = SKILL_COOLDOWN_MS[verb] / 1000;
      if (remaining > 0) {
        g.fillStyle(COL.outline, 0.65);
        g.fillRoundedRect(sx + 3, sy + 3, 52, 54 * Math.min(1, remaining / total), 6);
      } else if (player.chi < CHI_COST[verb]) {
        // Ready but unaffordable — greyed like B-23's zeroed slot.
        g.fillStyle(COL.outline, 0.45);
        g.fillRoundedRect(sx + 3, sy + 3, 52, 54, 6);
      }
    });

    // HUD texts (values from sim state each frame — render-only scene).
    this.texts.combo.setText(this.sim.combo > 1 ? String(this.sim.combo) : '');
    this.texts.comboPlate.setText(this.sim.combo > 1 ? ' HIT COMBO ' : '');
    this.texts.stance.setText(`${player.stance.toUpperCase()} STANCE`);
    void now;
  }

  /**
   * Polyline with pinched tips: width peaks mid-stroke, floors at minTaper.
   * Each render path passes ITS OWN taper (SLASH_ARC.minTaper/taperPow for
   * the red stroke, BLADE_MIN_TAPER for the trail) — conflating them left
   * SLASH_ARC.taperPow/minTaper dead (audit finding).
   */
  private strokePinched(
    g: Phaser.GameObjects.Graphics,
    points: readonly Vec[],
    color: number,
    baseWidth: number,
    alpha: number,
    minTaper: number,
    taperPow: number,
  ): void {
    const n = points.length;
    for (let i = 1; i < n; i++) {
      const a = points[i - 1];
      const b = points[i];
      if (a === undefined || b === undefined) continue;
      const t = i / (n - 1);
      const pinch = Math.max(minTaper, Math.sin(Math.PI * t) ** taperPow);
      g.lineStyle(baseWidth * pinch, color, alpha);
      g.beginPath();
      g.moveTo(a.x, a.y);
      g.lineTo(b.x, b.y);
      g.strokePath();
    }
  }
}
