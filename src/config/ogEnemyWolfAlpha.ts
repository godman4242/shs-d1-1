/**
 * OG_ALPHA — `EnemyWolfAlpha.as` (584 lines), ai 11 in the main switch and ai 11
 * OR 16 in the ROOM dispatch. No children. Lane L4b, slice 3b. All CONTRACT.
 *
 * A wolf at double scale that HOWLS FOR REINFORCEMENTS. It is not a delta over
 * `EnemyWolf` — it re-states the wolf's whole shape at bigger numbers and changes
 * three things that matter: its bands are wider, its `gotHit` subtracts defence
 * INSIDE the alive check with no `!isDowned()` guard on the launch, and POSE
 * spawns a real wolf through `NPCManager.createEnemy`.
 *
 * ⚠️ **`setLevel` is NOT the spear boss's copy** (`EnemySpearElite.as:79-123`).
 * Diffed 2026-09-12, and it differs in two numbers and in structure:
 *   - `hitsToKillPlayer = 15 - lvldiff` here (`:87`), **18** for the boss;
 *   - the boss floors `hitsToKillBoss` at `<= 3 → 3`, the alpha at `<= 0 → 1` (`:88-91`);
 *   - the alpha's `lvl <= 5` block is the `if` and the whole balance is the `else`
 *     (`:74-120`), so a level-5 alpha is NEVER balanced; the boss runs the balance
 *     first and stomps damage/defense to 1 afterwards.
 * The four-tier floor chain itself IS the boss's, verbatim, and it FALLS THROUGH —
 * `max(hit, ladder)` is wrong, and `tests/npcSlice3b.test.ts` pins it equal to the
 * boss's block so the two copies cannot drift.
 *
 * ⚠️ The kickoff warns that `mcs.scaleX == 1` reads FALSE under `changeScale(2,2)`.
 * Measured 2026-09-12: **there is no such comparison anywhere** — in this class, in
 * `NPC.as` or in `MCSCharacter.as`. Every `scaleX` use is sign-based (`> 0`, the
 * facing test) or an assignment, so the doubled scale breaks nothing. The port keeps
 * facing and scale apart anyway, as the wolf's does.
 */
import { OG_NPC_FLOATING_TEXT } from './ogNpcBase';

export const OG_ALPHA = {
  /** `:34` — `mcs.changeScale(2, 2)`: twice the paperdoll, where the wolf is 1.2. */
  scale: 2,

  /** `:39` and `:73` — the animal curve, and `setLevel` KEEPS it (the stag's overwrites it). */
  xp: { perLevel: 5, base: 45 },

  /**
   * `:216` — entering IDLE in a ROOM has a one-in-three chance of howling instead
   * (`POSE_STATE`) and RETURNING, so no snarl and no timer. In the overworld it
   * never howls. ⚠️ The constructor calls `startAction(IDLE_STATE)` (`:23`), so an
   * alpha can spawn a wolf BEFORE `init()` has run.
   */
  howlDice: 3,

  /** `:223` — a second of snarling; `:311` — then a half-second re-roll; `:313` — `int(rnd*3) < 2` walks. */
  idle: { snarlFrames: 24, retryFrames: 12, walkDice: 3, walkBelow: 2 },

  /**
   * `:230`/`:234` — `random() * 4 + 8`, signed toward `destX`; an int, so 8–11.
   * The wolf's is `* 2 + 4` (4–5).
   */
  walk: { range: 4, base: 8 },
  /** `:239` — walking AWAY halves it (int division), same as the wolf. */
  walkBackwardsDiv: 2,

  /**
   * `:251`/`:256` — RUN is a flat 15 both ways. The wolf splits 15 in a room / 12
   * in the overworld; the alpha has NO such split. ⚠️ It also RE-ROLLS `destX`
   * inside `startAction(RUN)` (`:248`), which the wolf does not.
   */
  runSpeed: 15,

  /** `:321`/`:354` — arrived when within 10 px of `destX`. Twin of `OG_WOLF.arriveX`. */
  arriveX: 10,

  /**
   * `:323`/`:356` — on arrival a d4, where the wolf rolls a d3: 0 idles, 1 walks,
   * 2 HOWLS, else a fresh destX and RUN.
   */
  arriveDice: 4,
  /** `:332`/`:365` — **2 HOWLS**; the wolf has no such outcome. */
  poseOn: 2,

  /** `:343`/`:376` — bite when `100 < dist < 150`. The wolf's band is `50 < dist < 100`. */
  bite: { minX: 100, maxX: 150 },

  /** `:347`/`:380` — pounce when `150 <= dist < 300` and a d3 rolls 0. The wolf's is `100..250`. */
  pounce: { minX: 150, maxX: 300, dice: 3 },

  /** `:182` — POUNCE_START ends into a coin: 0 → MIDHIGH, 1 → MID. Twin of `OG_WOLF.pounceHighDice`. */
  pounceHighDice: 2,

  /** `:396`/`:400` — the pounce carries the body 15 px per airborne frame. Twin of `OG_WOLF.pounceStep`. */
  pounceStep: 15,

  /**
   * `:275` — 48 frames on the floor. ⚠️ KNOCKDOWNED FALLS THROUGH into this case
   * (`:271-276`, no `break`), so a knocked-down alpha gets the SAME 48 frames; the
   * wolf gives knock-down only 6 (`OG_WOLF.downed.knockdownFrames`).
   */
  downedFrames: 48,

  /**
   * `:289-296` — the howl calls a wolf. `createEnemy(65, x, groundY, true)`: roster
   * id 65, a coin picks which edge, and the spawn lands 50 px OUTSIDE it — `-50` or
   * `stageWidth + 50`. Room only (`!isAdventureMode()`); the `true` is `fatal`.
   */
  spawn: { npcId: 65, edgeOffset: 50, sideDice: 2 },

  /** `:471` — a head, neck OR weapon hit does double and beheads. Twin of `OG_WOLF.partMult`. */
  partMult: 2,

  /**
   * `:52-127` — the boss balance. Structure and the four-tier floor chain are
   * `EnemySpearElite.as`'s; `hitsToKillPlayerBase` and the `hitsToKillBoss` floor
   * are NOT. See this file's header for the full diff.
   */
  setLevel: {
    /** `:74` — at or below this the alpha is never balanced at all… */
    trivialLevel: 5,
    /** `:76`/`:77` — …just damage and defense forced to this. maxhp is NOT touched. */
    trivialStat: 1,
    /** `:83` — `getMinDamage() + getDamageRange() / 2`. */
    damageRangeDiv: 2,
    /** `:86` — hp enough for `10 + lvldiff` player hits… */
    hitsToKillBossBase: 10,
    /** `:87` — …and damage to kill the player in `15 − lvldiff`. The boss's is 18. */
    hitsToKillPlayerBase: 15,
    /** `:88-91` — floored at `<= 0 → 1`. The boss floors at `<= 3 → 3`. */
    hitsToKillBossMin: 1,
    /** `:92-95` — `<= 0 → 1`, same as the boss. */
    hitsToKillPlayerMin: 1,
    /**
     * `:97-112` — the floor under one player hit, by the PLAYER's level. It FALLS
     * THROUGH: when a tier's level test matches but its value test does not, the
     * next tier's DIVISOR applies. `max(hit, ladder)` is wrong and a plant proves it.
     */
    floor: {
      /** `:97` */ tier1Level: 10,
      /** `:99` */ tier1Min: 1,
      /** `:101` */ tier2Level: 20,
      /** `:103` */ tier2Div: 8,
      /** `:105` */ tier3Level: 30,
      /** `:107` */ tier3Div: 6,
      /** `:109` */ tier4Div: 4,
    },
  },

  /**
   * `:498-517` — the five floating-text colours and the −100 y offset are the
   * base's, verbatim (`NPC.as:497-513`). Named here, reused from there.
   */
  floatingText: OG_NPC_FLOATING_TEXT,
} as const;
