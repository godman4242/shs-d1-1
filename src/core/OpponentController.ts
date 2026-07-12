/**
 * Seam between the deterministic Sim and whatever drives the opponent —
 * AI tiers (M4 AISeamController), scripted replays, or test doubles.
 *
 * The Sim EXECUTES intents blindly (respecting invuln/i-frames/evasion);
 * all decision-making (telegraph-then-commit timing, ranges, stance picks)
 * lives on the controller side. Fields land as the Sim grows the matching
 * verbs (M3); M4's AISeamController fills them with real behavior.
 */
export interface OpponentIntent {
  /** Land a strike on the player this tick. */
  strike?: boolean;
  /** Throw a kunai at the player's current position this tick. */
  throwKunai?: boolean;
}

export interface OpponentController {
  /** Called once per fixed FIGHTING tick; returns the intent for that tick. */
  next(frame: number): OpponentIntent;
}
