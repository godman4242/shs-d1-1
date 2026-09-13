/**
 * OG_FOX — `EnemyFox.as` (240 lines), ai 24, `extends EnemyWolf`. Lane L4b, slice 2a.
 * All CONTRACT. Only what the fox ADDS to the wolf is here; the rest are twins of
 * `OG_WOLF`. Both sides of every ↔ name their file: a bare cite cannot say which side of
 * an arrow it sits on, and `scripts/gates/claimcheck.ts` resolved the right-hand ones
 * against `EnemyFox.as` (241 lines) and reported six as out of range.
 * (`EnemyFox.as:50` ↔ `EnemyWolf.as:227`, `EnemyFox.as:52` ↔ `EnemyWolf.as:229`,
 * `EnemyFox.as:103` ↔ `EnemyWolf.as:237`, `EnemyFox.as:119` ↔ `EnemyWolf.as:255`,
 * `EnemyFox.as:123` ↔ `EnemyWolf.as:259`, `EnemyFox.as:133` ↔ `EnemyWolf.as:268`,
 * `EnemyFox.as:177/181` ↔ `EnemyWolf.as:304/308`, `EnemyFox.as:202` ↔ `EnemyWolf.as:329`).
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
