/**
 * NpcController — an `Npc` behind the EXISTING `OpponentController` seam
 * (lane L4b, slice 0). The seam is not moved and `Sim.ts` is not touched: this
 * class is the 35th `OpponentController`, beside `AISeamController`.
 *
 * THE CLOCK. The original runs at `OG_FPS` = 24 and the Sim at `FIXED_HZ` = 60.
 * The actor is not rescaled to 60 Hz — every `NPC.as` constant stays verbatim —
 * it is STEPPED: an integer accumulator adds 24 per tick and spends 60 per
 * `update()`, so exactly 24 steps land in every 60 ticks (pattern 2,3,2,3 …) and
 * a step never doubles up inside one tick.
 *
 * WHO OWNS WHAT. The Sim owns the enemy's x and moves it at `ENEMY_SPEED` on
 * every tick with a non-zero `moveX`; the actor's own `movePositionX` is a
 * DECISION, not a move. So each tick the actor's x is re-synced from the view,
 * and the intent's `moveX` is the sign of the displacement the actor asked for
 * on its last step, HELD across the ticks between steps. The actor's y is its
 * own — the Sim never moves an enemy's y — and so are its state, hp and
 * reactions, which the Sim cannot see (a FINDING for L5, in DIVERGENCES).
 *
 * THE SWING. A descendant attacks by calling `target.checkHitObject(part, dmg)`
 * (`EnemyKatana.as:196`). The target the controller hands the actor is a PROXY
 * of the player: it mirrors the view's position and turns that call into a
 * `strike` intent for the Sim to resolve with its own damage model. Every attack
 * the actor STARTS becomes a `telegraph` whose length is the attack clip's, at
 * the original frame rate.
 *
 * THE WINDUP (finding 18, closed 2026-09-23). A telegraph is the actor's own
 * DECISION to attack — a call to `startAction(ATTACK)` — never the ATTACK_STATE
 * edge. The katana re-attacks INSIDE one `update()` (clip finishes → WALK → still
 * in range → ATTACK), so the state is ATTACK before and after and an edge
 * detector drew 1 windup for 35 swings. Nor can the clip carry it: 10 of the 13
 * attacking classes name an attack clip the payload does not define (so
 * `startAnim` no-ops and nothing restarts), and the spear's swing is two clips.
 * `startAction(ATTACK)` is the one call all 13 funnel through — pinned in
 * `tests/npcController.test.ts` — and a looping walk's wrap never makes it.
 */
import { OG_STATE, type OgState } from '../../config/ogActor';
import { OG_NPC_HIT_IFRAMES } from '../../config/ogNpcBase';
import { ONE, ZERO } from '../../config/nums';
import { FIXED_HZ, MS_PER_S, OG_FPS } from '../../config/timing';
import type { Npc } from './Npc';
import type { NpcDamage } from './NpcDamage';
import type { OpponentController, OpponentIntent, OpponentView } from '../OpponentController';
import type { HitShape, NpcTarget } from './types';

/**
 * The player, as the actor sees it: a position that can be swung at.
 *
 * It carries the PLAYER's own reception guard: `NPC.gotHit` refuses a hit while
 * `gotHitCounter > 0` (`NPC.as:387`, twelve frames, `:462`). `EnemyKatana`
 * calls `checkHitObject` on EVERY attack frame (`EnemyKatana.as:196`) and the
 * source rate-limits that on the receiver, so the proxy does the same — one
 * strike per twelve steps — rather than flooding the Sim.
 */
class PlayerProxy implements NpcTarget {
  x = ZERO;
  y = ZERO;
  private struck = false;
  private hitCounter = ZERO;
  getMapPosition(): number {
    return this.x;
  }
  /**
   * The seam carries no facing for the player, and no ported mob reads it: only the duellist's
   * stroke makers do, and L5-OPP slice 8 wires them. Loud until then, never a guessed value.
   */
  isFacingRight(): boolean {
    throw new Error('unported: the seam carries no player facing (L5-OPP slice 8)');
  }
  /** The Sim decides when the fight is over; the actor never sees a dead player. */
  isDead(): boolean {
    return false;
  }
  /** The seam has no downed state for the player (DIVERGENCES, L4b finding 2). */
  isDowned(): boolean {
    return false;
  }
  /** `OpponentView.playerJumping` — the one reaction state the seam does carry. */
  airborne = false;
  isAirborne(): boolean {
    return this.airborne;
  }
  /** The Sim's player has no stealth, so the duellist's AI always sees it (`EnemyPlayer.as:1042`). */
  readonly alpha = ONE;
  readonly visible = true;
  checkHitObject(thing: HitShape, damage: NpcDamage): boolean {
    void thing;
    void damage;
    if (this.hitCounter > ZERO) return false;
    this.hitCounter = OG_NPC_HIT_IFRAMES;
    this.struck = true;
    return true;
  }
  /** One actor step passed: count the guard down (`EnemyKatana.as:110-113` on the receiver). */
  step(): void {
    if (this.hitCounter > ZERO) this.hitCounter -= ONE;
  }
  /** Did the actor land a swing since the last take? Clears the flag. */
  takeStrike(): boolean {
    const s = this.struck;
    this.struck = false;
    return s;
  }
}

export class NpcController implements OpponentController {
  private readonly proxy = new PlayerProxy();
  private clock = ZERO;
  private heldMoveX = ZERO;
  /** How many times the actor has called `startAction(ATTACK)`. */
  private attacksStarted = ZERO;

  constructor(private readonly npc: Npc) {
    npc.changeTarget(this.proxy);
    // Listen on the actor's own attack decision (see THE WINDUP above). The
    // ported class is untouched; this instance's calls pass straight through.
    const startAction = npc.startAction.bind(npc);
    npc.startAction = (actionState: OgState): void => {
      if (actionState === OG_STATE.ATTACK) this.attacksStarted += ONE;
      startAction(actionState);
    };
  }

  next(frame: number, view: OpponentView): OpponentIntent {
    void frame;
    const npc = this.npc;
    // The Sim owns x: take it. y is the actor's.
    npc.setPosition(view.enemyPos.x, npc.y);
    this.proxy.x = view.playerPos.x;
    this.proxy.y = view.playerPos.y;
    this.proxy.airborne = view.playerJumping;

    let struck = false;
    let telegraphMs: number | null = null;
    let stepped = false;
    let moved = ZERO;
    this.clock += OG_FPS;
    while (this.clock >= FIXED_HZ) {
      this.clock -= FIXED_HZ;
      stepped = true;
      const before = npc.posX;
      const attacksBefore = this.attacksStarted;
      this.proxy.step();
      npc.update();
      moved += npc.posX - before;
      if (this.proxy.takeStrike()) struck = true;
      if (this.attacksStarted !== attacksBefore) {
        const clip = npc.animation === '' ? null : npc.clipOf(npc.animation);
        telegraphMs = clip === null ? ZERO : (clip.durationFrames * MS_PER_S) / OG_FPS;
      }
    }
    if (stepped) this.heldMoveX = Math.sign(moved);

    const intent: OpponentIntent = {};
    if (this.heldMoveX !== ZERO) intent.moveX = this.heldMoveX > ZERO ? ONE : -ONE;
    if (struck) intent.strike = true;
    if (telegraphMs !== null) intent.telegraph = { kind: 'strike', durationMs: telegraphMs };
    return intent;
  }
}
