/**
 * OG_WOLF — `EnemyWolf.as` (489 lines), ai 8, and the parent of `EnemyWolf2` (ai 10)
 * and `EnemyFox` (ai 24). Lane L4b, slice 2a. All CONTRACT.
 *
 * The wolf is the first actor that overrides the RECEPTION side (`gotHit`,
 * `doLaunched`, `die`, `redFreeze`). Where its bodies repeat a base number verbatim
 * the base constant is reused and the wolf's twin line is named here:
 *   - `gotHitCounter = 12`      `EnemyWolf.as:392`  → `OG_NPC_HIT_IFRAMES` (`NPC.as:462`)
 *   - floating text y −100 and the five colours  `:405-421` → `OG_NPC_FLOATING_TEXT` (`NPC.as:497-513`)
 *
 * `EnemyWolf2` has no number of its own: every value it uses is a twin of one below
 * (`EnemyWolf2.as:24` ↔ `EnemyWolf.as:227`, `EnemyWolf2.as:39` ↔ `EnemyWolf.as:237`,
 * `EnemyWolf2.as:41` ↔ `EnemyWolf.as:239`, `EnemyWolf2.as:53` ↔ `EnemyWolf.as:259`,
 * `EnemyWolf2.as:66/70` ↔ `EnemyWolf.as:304/308`, `EnemyWolf2.as:88` ↔ `EnemyWolf.as:329`),
 * so it imports this file. Both sides named: the bare right-hand cites resolved against
 * `EnemyWolf2.as` (103 lines) and four were out of range, while the three at lines 66,
 * 70 and 88 silently PASSED against the wrong file.
 */
export const OG_WOLF = {
  /** `EnemyWolf.as:27` — `mcs.changeScale(1.2, 1.2)`: a fifth bigger than the paperdoll. */
  scale: 1.2,
  /** `EnemyWolf.as:32` (twins: `EnemyFox.as:26`, `EnemyCivilian.as:35`) — `xp = level * 5 + 45`, NOT the base's `* 2 + 20`. */
  xp: { perLevel: 5, base: 45 },
  /**
   * `EnemyWolf.as:137` — a second of snarling on entering IDLE; `:227` — then a
   * half-second re-roll; `:229` — `int(random() * 3) < 2` walks (two in three).
   */
  idle: { snarlFrames: 24, retryFrames: 12, walkDice: 3, walkBelow: 2 },
  /** `EnemyWolf.as:144` / `:148` — `random() * 2 + 4`, signed toward `destX`; an int, so 4 or 5. */
  walk: { range: 2, base: 4 },
  /** `EnemyWolf.as:153` — walking AWAY from the target plays the backwards clip at half speed (int division). */
  walkBackwardsDiv: 2,
  /** `EnemyWolf.as:166-182` — RUN: 15 px per frame in a room, 12 in the overworld. */
  run: { room: 15, adventure: 12 },
  /** `EnemyWolf.as:237` / `:266` — arrived when within 10 px of `destX`. */
  arriveX: 10,
  /** `EnemyWolf.as:239` / `:268` — on arrival a d3: 0 idles, 1 walks again, 2 runs somewhere new. */
  arriveDice: 3,
  /** `EnemyWolf.as:255` / `:284` — bite when `50 < dist < 100`… */
  bite: { minX: 50, maxX: 100 },
  /** `EnemyWolf.as:259` / `:288` — …pounce when `100 <= dist < 250` and a d3 rolls 0. */
  pounce: { minX: 100, maxX: 250, dice: 3 },
  /** `EnemyWolf.as:98` — POUNCE_START ends into a coin: 0 → MIDHIGH, 1 → MID. */
  pounceHighDice: 2,
  /** `EnemyWolf.as:304` / `:308` — the pounce carries the body 15 px per airborne frame. */
  pounceStep: 15,
  /** `EnemyWolf.as:201` — knocked down: 6 frames on the ground; `:205` — launched: 48. */
  downed: { knockdownFrames: 6, launchedFrames: 48 },
  /** `EnemyWolf.as:329` — FALL gravity per frame (twin of `EnemyKatana.as:205`). */
  fallGravity: 3,
  /**
   * `EnemyWolf.as:376` — a head, neck OR WEAPON hit does double and beheads. The
   * base DEFLECTS a weapon hit (`NPC.as:437-440`); the wolf has no weapon to parry with.
   */
  partMult: 2,
  /**
   * `EnemyWolf.as:433` / `:440` / `:443` — the launch arc: gravity 3, edge 20 px,
   * bounce ×2 (twins of `NPC.as:706` / `:718` / `:721`). Kept here because the
   * wolf's arc is its OWN body: no peak clip, no `velY > 0` landing guard.
   */
  launched: { gravity: 3, edgeMargin: 20, edgeBounceMult: 2 },
} as const;
