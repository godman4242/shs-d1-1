/**
 * THE COMPOSER (SESSION18 A4.3) — recorded animation nodes + a slot→shape map
 * → one ordered draw list. Pure: no Phaser, no scene, no state.
 *
 * SESSION 17 proved a single shape lands at the right SIZE. Every risk left in
 * the imported art is in the COMPOSITION, and all of it fails silently:
 *
 *   - the two ALIASED slots carry no node of their own, so a composer that
 *     walks the node list strands the crotch at the origin;
 *   - three slots carry TWO parts, so a one-shape-per-slot loop drops both
 *     foottops and the hair while the silhouette barely moves;
 *   - z-order is CREATION order, not node-list order, and the node list is
 *     stored in the XML's own (different) sequence on purpose.
 *
 * None of those is visible to a silhouette measurement, which is why this is a
 * pure function in `core/` with `tests/composePose.test.ts` behind it — the same
 * split that made SESSION 17's paint order provable.
 */
import { HALF_TURN_DEG, ZERO } from '../config/nums';
import type { OgPoseNode } from '../config/ogPose';

/** One part, placed. `slot` is retained because it IS the z-order. */
export interface PosedPart {
  readonly slot: number;
  readonly shapeId: number;
  readonly x: number;
  readonly y: number;
  /** Radians. The source records degrees; the conversion happens here, once. */
  readonly rotationRad: number;
  /**
   * SESSION23 A11.2 (kickoff D3): the fighter faces the other way. A TAG only —
   * the recorded geometry above stays untouched, and every piece of mirror math
   * lives in `planPose` (one site, so a double-flip has nowhere to hide).
   * Optional so hand-built parts in older tests stay valid; absent ⇒ unmirrored.
   */
  readonly mirrored?: boolean;
}

/**
 * Place every part the slot map holds art for, back to front.
 *
 * `slotShapes` is indexed BY SLOT, so its own indices are the creation order
 * the SWF draws in — the returned list is therefore already back-to-front and a
 * renderer just walks it. Slots with an empty entry are the game's own "none"
 * placeholders (weapon, prop, hat) and are skipped; they may still carry a node.
 *
 * Throws rather than skipping in all three broken-pose cases: a part with no
 * transform, an alias pointing nowhere, and an alias that collides with a real
 * node. Each of those renders as a misplaced limb that looks like an art bug.
 */
export function composePose(
  nodes: readonly OgPoseNode[],
  slotShapes: ReadonlyArray<readonly number[]>,
  aliases: ReadonlyArray<readonly [number, number]>,
  mirror = false,
): PosedPart[] {
  const bySlot = new Map<number, OgPoseNode>();
  for (const node of nodes) bySlot.set(node.slot, node);

  for (const [slot, follows] of aliases) {
    // An aliased slot that ALSO has its own node means the rule and the data
    // disagree; picking one silently is how a limb ends up in two minds.
    if (bySlot.has(slot)) {
      throw new Error(`composePose: slot ${String(slot)} is aliased to ${String(follows)} but the pose also carries its own node`);
    }
    const source = bySlot.get(follows);
    if (source === undefined) {
      throw new Error(`composePose: slot ${String(slot)} is aliased to slot ${String(follows)}, which this pose does not carry`);
    }
    bySlot.set(slot, { ...source, slot });
  }

  const parts: PosedPart[] = [];
  slotShapes.forEach((shapes, slot) => {
    if (shapes.length === ZERO) return;
    const node = bySlot.get(slot);
    if (node === undefined) {
      throw new Error(`composePose: slot ${String(slot)} has art but no node and no alias — it would render at the origin`);
    }
    for (const shapeId of shapes) {
      parts.push({
        slot,
        shapeId,
        x: node.x,
        y: node.y,
        rotationRad: (node.rotationDeg * Math.PI) / HALF_TURN_DEG,
        mirrored: mirror,
      });
    }
  });
  return parts;
}
