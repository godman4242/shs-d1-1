/**
 * AISeamController (Stage 2 spec item 2) — produces OpponentIntent from a
 * per-tick view of the fight. The Sim executes; this decides.
 *
 * Contracts:
 * - TELEGRAPH-THEN-COMMIT: a strike intent is only ever issued exactly the
 *   telegraph's own duration after its telegraph intent. That duration is one
 *   of TWO measured cases (AI_TELEGRAPH_MS): 600 ms when the enemy commits
 *   while still closing, 267 ms point-blank. ⚠️ The old "≥520 ms, one global
 *   number per tier" reading is WRONG and is deleted (SESSION13 D8).
 * - Stance switches queue AI_PENDING_STANCE_MS behind a 'stance' telegraph,
 *   and are only attempted when the enemy's Focus can afford the flat
 *   FOCUS_SWITCH_COST (mirrors the Sim's rule; WEAPON_WEIGHT is deleted).
 * - Kunai only inside AI_KUNAI_RANGE; the tier's kunaiChance gates the roll
 *   (easy = 0 → never).
 * - ⚠️ THERE IS NO react(). The original's enemies do **not block or dodge**
 *   (measured: zero blocking across the whole study corpus), so the reaction
 *   seam modelled behaviour the game lacks and is deleted along with its three
 *   tier fields. `reactMs` was ALSO the decision cadence, so that role moves to
 *   the explicit AI_THINK_INTERVAL_MS rather than disappearing with it.
 * - NO ATTACK TOKEN. Enemies do not take turns; the appearance of turn-taking
 *   is EMERGENT from independent AI_THINK_INTERVAL_MS timers plus the narrow
 *   AI_MELEE_RANGE gate. Adding a token would be inventing a mechanism to
 *   reproduce an effect that already emerges.
 * - Injected rng ONLY (mulberry32) — deterministic given (rng, view seq).
 *
 * Decision priority when idle+engaged: kunai band roll → counter-stance
 * pick → aggression strike roll → wait one reactMs beat.
 */
import {
  AI_APPROACH_RANGE,
  AI_KUNAI_RANGE,
  AI_MELEE_RANGE,
  AI_PENDING_STANCE_MS,
  AI_POINT_BLANK_X,
  AI_RECOVER_JITTER_FRAC,
  AI_TELEGRAPH_MS,
  AI_THINK_INTERVAL_MS,
  type AITierParams,
} from '../config/ai';
import { FOCUS_SWITCH_COST } from '../config/combat';
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

  constructor(
    private readonly rng: Rng,
    private readonly tier: AITierParams,
  ) {}

  next(frame: number, view: OpponentView): OpponentIntent {
    const dist = Math.abs(view.playerPos.x - view.enemyPos.x);
    // D8: the melee trigger is BOTH axes — `|dx| < 50 && Δy < 50` world px.
    // Losing the vertical term is how a jumping player used to stay hittable.
    const dy = Math.abs(view.playerPos.y - view.enemyPos.y);
    const inMelee = dist < AI_MELEE_RANGE.x && dy < AI_MELEE_RANGE.y;

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

    // idle. AUDIT FIX (major): the old hard-idle beyond AI_APPROACH_RANGE
    // froze the enemy forever once a faster player kited past 620 px AND
    // killed the spec's 620–720 kunai band. A duel has no out-of-aggro
    // state: beyond strike range the enemy ALWAYS closes, and the kunai
    // roll honors the full AI_KUNAI_RANGE. AI_APPROACH_RANGE is reserved
    // for Stage-4 world encounters (aggro radius) — documented, unused in
    // 1v1 (decision flagged; veto = restore hard idle above it).
    void AI_APPROACH_RANGE;
    // DECISION CADENCE (browser-verify finding): chance rolls happen once
    // per reactMs beat, never per tick — per-tick rolling turns a 0.25
    // kunaiChance into a near-certainty within a second and stalls the
    // approach. Between beats the AI just closes distance.
    if (frame < this.decisionHoldUntil) {
      return inMelee ? {} : { moveX: this.toward(view) };
    }
    this.decisionHoldUntil = frame + msToFrames(AI_THINK_INTERVAL_MS);
    // Kunai band roll (easy's kunaiChance 0 never passes: rng() < 0 is false).
    if (dist >= AI_KUNAI_RANGE.min && dist <= AI_KUNAI_RANGE.max && this.rng() < this.tier.kunaiChance) {
      this.mode = 'recover';
      const jitter = ONE + (this.rng() * TWO - ONE) * AI_RECOVER_JITTER_FRAC;
      this.modeUntilFrame = frame + Math.round(msToFrames(this.tier.recoverMs) * jitter);
      return { throwKunai: true };
    }
    if (!inMelee) return { moveX: this.toward(view) };

    // In strike range: counter-stance pick (if not already countering and
    // Focus affords it — mirrors the Sim's switch cost), else strike roll.
    if (!beats(view.enemyStance, view.playerStance)) {
      // Mirrors the Sim's flat 48-Focus gate (D9); WEAPON_WEIGHT is deleted.
      if (view.enemyFocus >= FOCUS_SWITCH_COST && this.rng() < this.tier.counterStancePickChance) {
        this.mode = 'stancePending';
        this.modeUntilFrame = frame + msToFrames(AI_PENDING_STANCE_MS);
        this.pendingStance = counterOf(view.playerStance);
        return { telegraph: { kind: 'stance', durationMs: AI_PENDING_STANCE_MS } };
      }
    }
    if (this.rng() < this.tier.aggression) {
      // Two measured windups, chosen by range at COMMIT time (D8).
      const durationMs =
        dist <= AI_POINT_BLANK_X ? AI_TELEGRAPH_MS.pointBlank : AI_TELEGRAPH_MS.closing;
      this.mode = 'telegraph';
      this.modeUntilFrame = frame + msToFrames(durationMs);
      return { telegraph: { kind: 'strike', durationMs } };
    }
    return {};
  }

  private toward(view: OpponentView): number {
    return view.playerPos.x < view.enemyPos.x ? -ONE : ONE;
  }
}
