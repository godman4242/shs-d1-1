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
 * `strike` intent for the Sim to resolve with its own damage model. Entering
 * `ATTACK_STATE` becomes a `telegraph` whose length is the attack clip's, at
 * the original frame rate.
 */
import { OG_STATE } from '../../config/ogActor';
import { ONE, ZERO } from '../../config/nums';
import { FIXED_HZ, MS_PER_S, OG_FPS } from '../../config/timing';
import type { Npc } from './Npc';
import type { NpcDamage } from './NpcDamage';
import type { OpponentController, OpponentIntent, OpponentView } from '../OpponentController';
import type { HitShape, NpcTarget } from './types';

/** The player, as the actor sees it: a position that can be swung at. */
class PlayerProxy implements NpcTarget {
  x = ZERO;
  y = ZERO;
  struck = false;
  getMapPosition(): number {
    return this.x;
  }
  /** The Sim decides when the fight is over; the actor never sees a dead player. */
  isDead(): boolean {
    return false;
  }
  checkHitObject(thing: HitShape, damage: NpcDamage): boolean {
    void thing;
    void damage;
    this.struck = true;
    return true;
  }
  /** Did the actor swing since the last take? Clears the flag. */
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

  constructor(private readonly npc: Npc) {
    npc.changeTarget(this.proxy);
  }

  next(frame: number, view: OpponentView): OpponentIntent {
    void frame;
    const npc = this.npc;
    // The Sim owns x: take it. y is the actor's.
    npc.setPosition(view.enemyPos.x, npc.y);
    this.proxy.x = view.playerPos.x;
    this.proxy.y = view.playerPos.y;

    let struck = false;
    let telegraphMs: number | null = null;
    let stepped = false;
    let moved = ZERO;
    this.clock += OG_FPS;
    while (this.clock >= FIXED_HZ) {
      this.clock -= FIXED_HZ;
      stepped = true;
      const before = npc.posX;
      const stateBefore = npc.actionState;
      npc.update();
      moved += npc.posX - before;
      if (this.proxy.takeStrike()) struck = true;
      if (npc.actionState === OG_STATE.ATTACK && stateBefore !== OG_STATE.ATTACK) {
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
