/**
 * OG_FOX — `EnemyFox.as` (240 lines), ai 24, `extends EnemyWolf`. Lane L4b, slice 2a.
 * All CONTRACT. Only what the fox ADDS to the wolf is here; the rest are twins of
 * `OG_WOLF` (`EnemyFox.as:50` ↔ `EnemyWolf.as:227`, `:52` ↔ `:229`, `:103` ↔ `:237`,
 * `:119` ↔ `:255`, `:123` ↔ `:259`, `:133` ↔ `:268`, `:177/:181` ↔ `:304/:308`,
 * `:202` ↔ `:329`).
 */
export const OG_FOX = {
  /** `EnemyFox.as:57` — in the overworld, a d5 of 0 on each idle re-roll says something… */
  speechDice: 5,
  /**
   * `EnemyFox.as:59-95` — …one of nine lines, by d9. The lines are quoted lyrics from a
   * third-party song; only the INDEX leaves core (`NpcEvent` `speech`, table `fox`).
   */
  lines: 9,
  /** `EnemyFox.as:105` — arrival in WALK is a coin: 0 idles, 1 walks again (the wolf rolls a d3). */
  arriveDice: 2,
  /** `EnemyFox.as:147` — 50 px past either stage edge in the overworld: park in REDFREEZE_STATE. */
  offstageMargin: 50,
  /** `EnemyFox.as:221` / `:230` — flee when the player is within 200 px IN FRONT… */
  fleeSightX: 200,
  /** `EnemyFox.as:223` / `:232` — …to a `destX` 100 px past the far edge. */
  fleeBeyondEdge: 100,
} as const;
