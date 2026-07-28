/**
 * ⭐ GATE A9-F (SESSION22 A9.6) — THE STARTING BRANCH IS ON THE DRESSED
 * FIGHTER, AT THE FACING THE VIDEOS SHOW.
 *
 * ⛔ THE FACING IS MEASURED, NOT GUESSED. Three clean stills (zFt_0059/0060/
 * 0061) put the stick's axis at +39.9° ± 2 (endpoints read by eye off gridded
 * ×10 crops; the ledger holds the coordinates). The pose's RECORDED slot-3
 * rotation is 142 — and 142 = 180 − 38 is a horizontal-mirror signature: the
 * payload's weapon art is authored for the OPPOSITE facing (node 4 carries
 * exactly −38). Shape 2641's own local axis is +1.3°, so rotation 38 renders
 * the stick at 39.3° — 0.6° from the measurement, far inside A9-F's 10° bar,
 * with the fork end lower-right as every frame shows.
 *
 * ⚠️ `OG_IDLE_NODES` IS NEVER EDITED — it is byte-checked against the
 * payload's own bindata (19/19, SESSION18 A4.3). The facing fix lives in
 * `OG_EQUIPMENT`, and `OG_DRESSED_NODES` is derived. The bare fighter keeps
 * the recorded pose untouched.
 */
import { describe, expect, it } from 'vitest';
import {
  OG_DRESSED_NODES,
  OG_DRESSED_SLOT_SHAPES,
  OG_EQUIPMENT,
  OG_IDLE_NODES,
  OG_SLOT_ALIASES,
  OG_SLOT_SHAPES,
} from '../src/config/ogPose';
import { composePose } from '../src/core/composePose';

const WEAPON_SLOT = 3;
const BRANCH = 2641;
/** The ledgered measurement (docs/DIVERGENCES.md "SESSION 22 — A9.6"). */
const SOURCE_AXIS_DEG = 39.9;
const BRANCH_LOCAL_AXIS_DEG = 1.3;
const A9F_TOLERANCE_DEG = 10;

describe('A9-F — the branch is wired at the measured facing', () => {
  it('the dressed pose carries the branch at slot 3; the bare pose stays empty-handed', () => {
    expect(OG_DRESSED_SLOT_SHAPES[WEAPON_SLOT]).toEqual([BRANCH]);
    expect(OG_SLOT_SHAPES[WEAPON_SLOT]).toEqual([]);
  });

  it('equipment rotation 38 lands the stick within 10° of the measured +39.9°', () => {
    const eq = OG_EQUIPMENT[WEAPON_SLOT];
    if (eq === undefined) throw new Error('slot 3 has no equipment entry');
    expect(eq.shapeId).toBe(BRANCH);
    const rendered = eq.rotationDeg + BRANCH_LOCAL_AXIS_DEG;
    expect(Math.abs(rendered - SOURCE_AXIS_DEG)).toBeLessThanOrEqual(A9F_TOLERANCE_DEG);
    // Tighter than the bar, pinned: the residual is 0.6°, not just "under 10".
    expect(Math.abs(rendered - SOURCE_AXIS_DEG)).toBeCloseTo(0.6, 5);
  });

  it('the recorded pose value is the horizontal MIRROR of the fix, exactly', () => {
    const eq = OG_EQUIPMENT[WEAPON_SLOT];
    if (eq === undefined) throw new Error('slot 3 has no equipment entry');
    const recorded = OG_IDLE_NODES.find((n) => n.slot === WEAPON_SLOT)?.rotationDeg;
    expect(recorded).toBe(180 - eq.rotationDeg);
  });

  it('OG_DRESSED_NODES differs from the recorded pose in slot 3\'s transform ONLY', () => {
    // The POSITION is un-mirrored along with the rotation: the recorded
    // (12, −61) belongs to the same opposite-facing authoring as the 142.
    // (−17, −55) was measured from the frame (stick endpoints as fractions of
    // the fighter bbox put the midsection BEHIND the body) and chosen inside
    // the mapping's ±2-node-px uncertainty by the committed floors — the same
    // measure-then-sweep rule as A6.4. Every OTHER node is the byte-checked
    // original, verbatim.
    expect(OG_DRESSED_NODES).toHaveLength(OG_IDLE_NODES.length);
    const eq = OG_EQUIPMENT[WEAPON_SLOT];
    if (eq === undefined) throw new Error('slot 3 has no equipment entry');
    for (const [i, node] of OG_IDLE_NODES.entries()) {
      const dressed = OG_DRESSED_NODES[i];
      if (dressed === undefined) throw new Error(`dressed node ${String(i)} missing`);
      if (node.slot === WEAPON_SLOT) {
        expect(dressed).toEqual({ slot: node.slot, x: eq.x, y: eq.y, rotationDeg: eq.rotationDeg });
        // The un-mirror is visible in the data: the x offset flips sign.
        expect(Math.sign(dressed.x)).toBe(-Math.sign(node.x));
      } else {
        expect(dressed, `slot ${String(node.slot)}`).toEqual(node);
      }
    }
  });

  it('equipment is OG art, never traced, and never collides with a garment slot', () => {
    for (const [slotText, eq] of Object.entries(OG_EQUIPMENT)) {
      expect(eq.shapeId, `slot ${slotText}`).toBeLessThan(9000);
      // A slot is either a garment override or equipment, never both — the
      // dressed map derivation would silently prefer one otherwise.
      expect(OG_SLOT_SHAPES[Number(slotText)], `slot ${slotText} must be empty by design`).toEqual([]);
    }
  });

  it('the dressed fighter composes 21 parts — the 20 dressed ones plus the branch', () => {
    const dressed = composePose(OG_DRESSED_NODES, OG_DRESSED_SLOT_SHAPES, OG_SLOT_ALIASES);
    expect(dressed).toHaveLength(21);
    expect(dressed.filter((p) => p.shapeId === BRANCH)).toHaveLength(1);
    const idle = composePose(OG_IDLE_NODES, OG_SLOT_SHAPES, OG_SLOT_ALIASES);
    expect(idle.some((p) => p.shapeId === BRANCH)).toBe(false);
  });
});
