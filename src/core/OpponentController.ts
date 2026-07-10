/**
 * Seam between the deterministic Sim and whatever drives the opponent —
 * AI tiers (Stage 2 AISeamController), scripted replays, or test doubles.
 *
 * Stage 2 gives OpponentIntent its real shape (movement, telegraphed
 * strikes, stance switches, kunai). Until then it is deliberately empty:
 * the seam exists so Sim never grows a hard AI dependency.
 */
export interface OpponentIntent {}

export interface OpponentController {
  /** Called once per fixed tick; returns the opponent's intent for that tick. */
  next(frame: number): OpponentIntent;
}
