/**
 * AISeamController (Stage 2 spec item 2) — produces OpponentIntent from a
 * per-tick view of the fight. The Sim executes; this decides.
 *
 * Contracts:
 * - TELEGRAPH-THEN-COMMIT: a strike intent is only ever issued ≥ telegraphMs
 *   after its telegraph intent (gate item: visible windup ≥ 520 ms Normal).
 * - Stance switches queue AI_PENDING_STANCE_MS behind a 'stance' telegraph,
 *   and are only attempted when the enemy's Focus can afford the cost
 *   (mirrors Sim's FOCUS_SWITCH_COST × WEAPON_WEIGHT[current] rule).
 * - Kunai only inside AI_KUNAI_RANGE; the tier's kunaiChance gates the roll
 *   (easy = 0 → never).
 * - react(): at most one block/dodge roll per reactMs — the attention
 *   window is spent whether or not the roll passes (INFERRED reading:
 *   player slashes resolve instantly at PLAYER_WINDUP_MS=0, so reactMs
 *   models attention cadence, not swing-reaction latency; veto = drop
 *   reactions entirely).
 * - Injected rng ONLY (mulberry32) — deterministic given (rng, view seq).
 *
 * Decision priority when idle+engaged: kunai band roll → counter-stance
 * pick → aggression strike roll → wait one reactMs beat.
 */
import { AI_APPROACH_RANGE, AI_KUNAI_RANGE, AI_PENDING_STANCE_MS, AI_RECOVER_JITTER_FRAC, AI_STRIKE_RANGE, type AITierParams } from '../config/ai';
import { FOCUS_SWITCH_COST, WEAPON_WEIGHT } from '../config/combat';
import { ONE, TWO, ZERO } from '../config/nums';
import { STANCE_BEATS, type StanceId } from '../config/stances';
import { beats } from './stance';
import type { OpponentController, OpponentIntent, OpponentView } from './OpponentController';
import type { Rng } from './Sim';
import { msToFrames } from './time';

type AiMode = 'idle' | 'telegraph' | 'attack' | 'recover' | 'stancePending';

/** The stance that BEATS `target` (reverse lookup of the counter triangle). */
function counterOf(target: StanceId): StanceId {
  for (const [attacker, beaten] of Object.entries(STANCE_BEATS) as Array<[StanceId, StanceId]>) {
    if (beaten === target) return attacker;
  }
  return target; // unreachable — the triangle is total
}

export class AISeamController implements OpponentController {
  private mode: AiMode = 'idle';
  private modeUntilFrame = ZERO;
  private decisionHoldUntil = ZERO;
  private pendingStance: StanceId | null = null;
  private reactHoldUntil = ZERO;

  constructor(
    private readonly rng: Rng,
    private readonly tier: AITierParams,
  ) {}

  next(frame: number, view: OpponentView): OpponentIntent {
    const dist = Math.abs(view.playerPos.x - view.enemyPos.x);

    if (this.mode === 'telegraph') {
      if (frame < this.modeUntilFrame) return {};
      // Windup complete — commit the strike, then swing for attackMs.
      this.mode = 'attack';
      this.modeUntilFrame = frame + msToFrames(this.tier.attackMs);
      return { strike: true };
    }
    if (this.mode === 'attack') {
      if (frame < this.modeUntilFrame) return {};
      this.mode = 'recover';
      const jitter = ONE + (this.rng() * TWO - ONE) * AI_RECOVER_JITTER_FRAC;
      this.modeUntilFrame = frame + Math.round(msToFrames(this.tier.recoverMs) * jitter);
      return {};
    }
    if (this.mode === 'recover') {
      if (frame < this.modeUntilFrame) return {};
      this.mode = 'idle';
      return {};
    }
    if (this.mode === 'stancePending') {
      if (frame < this.modeUntilFrame) return {};
      this.mode = 'idle';
      const to = this.pendingStance;
      this.pendingStance = null;
      return to === null ? {} : { switchStance: to };
    }

    // idle — engage only inside AI_APPROACH_RANGE.
    if (dist > AI_APPROACH_RANGE) return {};
    // DECISION CADENCE (browser-verify finding): chance rolls happen once
    // per reactMs beat, never per tick — per-tick rolling turns a 0.25
    // kunaiChance into a near-certainty within a second and stalls the
    // approach. Between beats the AI just closes distance.
    if (frame < this.decisionHoldUntil) {
      return dist > AI_STRIKE_RANGE ? { moveX: this.toward(view) } : {};
    }
    this.decisionHoldUntil = frame + msToFrames(this.tier.reactMs);
    // Kunai band roll (easy's kunaiChance 0 never passes: rng() < 0 is false).
    if (dist >= AI_KUNAI_RANGE.min && dist <= AI_KUNAI_RANGE.max && this.rng() < this.tier.kunaiChance) {
      this.mode = 'recover';
      const jitter = ONE + (this.rng() * TWO - ONE) * AI_RECOVER_JITTER_FRAC;
      this.modeUntilFrame = frame + Math.round(msToFrames(this.tier.recoverMs) * jitter);
      return { throwKunai: true };
    }
    if (dist > AI_STRIKE_RANGE) return { moveX: this.toward(view) };

    // In strike range: counter-stance pick (if not already countering and
    // Focus affords it — mirrors the Sim's switch cost), else strike roll.
    if (!beats(view.enemyStance, view.playerStance)) {
      const cost = FOCUS_SWITCH_COST * WEAPON_WEIGHT[view.enemyStance];
      if (view.enemyFocus >= cost && this.rng() < this.tier.counterStancePickChance) {
        this.mode = 'stancePending';
        this.modeUntilFrame = frame + msToFrames(AI_PENDING_STANCE_MS);
        this.pendingStance = counterOf(view.playerStance);
        return { telegraph: { kind: 'stance', durationMs: AI_PENDING_STANCE_MS } };
      }
    }
    if (this.rng() < this.tier.aggression) {
      this.mode = 'telegraph';
      this.modeUntilFrame = frame + msToFrames(this.tier.telegraphMs);
      return { telegraph: { kind: 'strike', durationMs: this.tier.telegraphMs } };
    }
    return {};
  }

  /**
   * Block/dodge roll against a player slash that would land. At most one
   * roll per reactMs — the attention window is consumed either way.
   */
  react(frame: number): 'block' | 'dodge' | null {
    if (frame < this.reactHoldUntil) return null;
    this.reactHoldUntil = frame + msToFrames(this.tier.reactMs);
    if (this.rng() < this.tier.reactBlockChance) return 'block';
    if (this.rng() < this.tier.reactDodgeChance) return 'dodge';
    return null;
  }

  private toward(view: OpponentView): number {
    return view.playerPos.x < view.enemyPos.x ? -ONE : ONE;
  }
}
