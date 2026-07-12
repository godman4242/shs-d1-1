/**
 * Seam between the deterministic Sim and whatever drives the opponent —
 * AI tiers (AISeamController), scripted replays, or test doubles.
 *
 * The Sim EXECUTES intents blindly (respecting invuln/i-frames/evasion and
 * the Focus cost on stance switches); all decision-making (telegraph-then-
 * commit timing, ranges, stance picks) lives on the controller side.
 */
import type { StanceId } from '../config/stances';
import type { Vec } from './vec';

/** Read-only snapshot the Sim hands the controller every fighting tick. */
export interface OpponentView {
  playerPos: Readonly<Vec>;
  enemyPos: Readonly<Vec>;
  playerStance: StanceId;
  enemyStance: StanceId;
  enemyFocus: number;
  playerJumping: boolean;
}

export interface OpponentIntent {
  /** Land a strike on the player this tick. */
  strike?: boolean;
  /** Throw a kunai at the player's current position this tick. */
  throwKunai?: boolean;
  /** Move horizontally (-1 | 0 | 1) at ENEMY_SPEED. */
  moveX?: number;
  /** Execute a stance switch (Focus-gated by the Sim like the player's). */
  switchStance?: StanceId;
  /** Windup flash for the scene (strike windup / pending stance switch). */
  telegraph?: { kind: 'strike' | 'stance'; durationMs: number };
}

export interface OpponentController {
  /** Called once per fixed FIGHTING tick; returns the intent for that tick. */
  next(frame: number, view: OpponentView): OpponentIntent;
  /**
   * Optional reaction seam: consulted when a player slash WOULD land.
   * Return 'block' (clang, no damage) or 'dodge' (evade, no damage).
   */
  react?(frame: number, view: OpponentView): 'block' | 'dodge' | null;
}
