/**
 * THE OG FIGHTER'S OWN POSE DATA (SESSION18 A4.3) — CONTRACT, transcribed from
 * the payload's own bytes, not measured and not inferred.
 *
 * Source: `reference/extracted/bindata/108_1t4635s0.bin`, the DefineBinaryData
 * holding all 158 human animations, extracted 2026-07-27. `x`/`y` are PLAIN
 * PIXELS and `r` is DEGREES — `§1t1360s0§.setPosition` assigns `.x`, `.y` and
 * `.rotation` directly; the matrix `a`/`b`/`c`/`d` ÷100 branch runs only when
 * `r` is ABSENT, and it is present on every node here.
 *
 * ⚠️ THE NODES ARE STORED IN THE XML'S OWN DOCUMENT ORDER, ON PURPOSE, AND THAT
 * IS *NOT* THE DRAW ORDER. `reorderLayers` uses the node-list order only when a
 * frame carries `r="1"`; the idle frame is `<f i="0">` with no `r`, so z-order
 * is CREATION order — slot 0 at the back, slot 20 at the front. The AS3
 * constructor also pushes nodes in reverse document order, so "iterate the XML"
 * and "creation order" are two different sequences (SESSION18 §2 diagnosis (d)).
 * Keeping document order here means a composer that iterates this array instead
 * of sorting by slot is WRONG and a test can see it.
 */

/** One animation node: which slot it drives, and where it puts it. */
export interface OgPoseNode {
  readonly slot: number;
  readonly x: number;
  readonly y: number;
  readonly rotationDeg: number;
}

/**
 * `<anim i="idle" d="1">`, frame 0 — all 19 nodes, verbatim, in document order.
 *
 * Nodes exist for slots 0–7, 9–16 and 18–20. **Slots 8 and 17 are the only two
 * missing** — exactly the two the AS3 aliases (see `OG_SLOT_ALIASES`). That the
 * data and the code agree on precisely those two is the confirmation that the
 * aliasing rule is real rather than a reading of a comment.
 *
 * Nodes 3 and 4 (weapon, prop) DO carry transforms even though their slots hold
 * no art — they are the game's own "none" placeholders, not missing data.
 */
export const OG_IDLE_NODES: readonly OgPoseNode[] = [
  { slot: 20, x: -10, y: -64, rotationDeg: -9 },
  { slot: 19, x: -5, y: -80, rotationDeg: 11 },
  { slot: 18, x: -5, y: -47, rotationDeg: -14 },
  { slot: 14, x: -1, y: -54, rotationDeg: -1 },
  { slot: 16, x: -4, y: -92, rotationDeg: -3 },
  { slot: 15, x: -2, y: -68, rotationDeg: -1 },
  { slot: 13, x: -2, y: -57, rotationDeg: -2 },
  { slot: 12, x: -3, y: -85, rotationDeg: -11 },
  { slot: 11, x: 4, y: -29, rotationDeg: -3 },
  { slot: 10, x: -2, y: -55, rotationDeg: -12 },
  { slot: 9, x: 5, y: -4, rotationDeg: -2 },
  { slot: 7, x: -11, y: -27, rotationDeg: 23 },
  { slot: 6, x: -4, y: -53, rotationDeg: 15 },
  { slot: 5, x: -21, y: -4, rotationDeg: -1 },
  { slot: 4, x: 2, y: -54, rotationDeg: -38 },
  { slot: 3, x: 12, y: -61, rotationDeg: 142 },
  { slot: 2, x: -15, y: -65, rotationDeg: -54 },
  { slot: 1, x: -7, y: -80, rotationDeg: 25 },
  { slot: 0, x: 0, y: -56, rotationDeg: -54 },
];

/**
 * Slot index → the shape ids drawn in it. CONTRACT: every row is cited to the
 * decompiled line that names it in `docs/research/fidelity/FIGHTER_ART_IDS.md`
 * §2. The ARRAY INDEX IS THE SLOT, so this doubles as the creation order.
 *
 * ⚠️ THREE SLOTS CARRY TWO PARTS EACH — 7, 11 and 16. A one-shape-per-slot
 * composer silently drops both foottops and the hair.
 * ⚠️ SLOTS 3, 4 AND 17 ARE EMPTY BY DESIGN — `weapon13000`, `prop13000` and
 * `hat7000` are the game's own "none" placeholders and contain zero shapes. The
 * idle fighter is correctly bald and unarmed; equipment art died with the CDN.
 *
 * ⚠️ INFERRED, and the only inferred thing in this file: the ORDER WITHIN a
 * two-part slot (calf before foottop, head before hair). It follows the order
 * the parts are constructed in §2's table, which is the best evidence we have,
 * but no frame proves it. Veto = a frame showing hair behind the head.
 */
export const OG_SLOT_SHAPES: ReadonlyArray<readonly number[]> = [
  [2667], //  0 hand (far)
  [2644], //  1 uparm (far)
  [2658], //  2 lowarm (far)
  [], //  3 weapon — EMPTY BY DESIGN
  [], //  4 prop — EMPTY BY DESIGN
  [2674], //  5 foot (far)
  [2648], //  6 thigh (far)
  [2678, 2672], //  7 calf (far) + foottop (far)
  [2676], //  8 crotch — no node of its own; aliased from 14
  [2674], //  9 foot (near)
  [2648], // 10 thigh (near)
  [2678, 2672], // 11 calf (near) + foottop (near)
  [2655], // 12 neck
  [2650], // 13 stomach
  [2653], // 14 pelvic
  [2646], // 15 torso
  [2664, 2670], // 16 head + hair
  [], // 17 hat — EMPTY BY DESIGN; aliased from 16 for the day hat art exists
  [2667], // 18 hand (near)
  [2644], // 19 uparm (near)
  [2658], // 20 lowarm (near)
];

/**
 * `[slot, followsSlot]` — the two slots the AS3 drives from another slot's node,
 * which is why no animation frame ever carries a node for them
 * (`§1t59s0§.setPosition`, cited in FIGHTER_ART_IDS.md §2).
 *
 * **8 ← 14** (crotch follows pelvic) and **17 ← 16** (hat follows head). Compose
 * without the first and the crotch is stranded at the origin as a tan blob at
 * the fighter's feet — which is how the rule was found in the first place.
 */
/**
 * The traced outfit, slot by slot. Every id's own header names the frame it came
 * from and what about it is INFERRED (`src/game/art/generated/shape90NN.ts`).
 *
 * ⚠️ THE SLOT IS CHOSEN BY Z-ORDER, NOT ANATOMY. z-order is CREATION order, so a
 * higher slot draws IN FRONT. The hakama covers the whole leg, so it sits on the
 * CALF (7 and 11) — which draws in front of the thigh (6, 10) and the foot
 * (5, 9) — and not on the thigh, where the bare calf would paint over it.
 *
 * ⚠️ 9011 IS DRAWN TWICE, at slots 11 and 7, because only the NEAR leg could be
 * traced: the far leg is not bounded by ink on its right (the outline there is
 * the scabbard), so its region leaks into the background. Drawing one leg shape
 * at both slots is what the OG itself does — 2678 at 7 and 11, 2648 at 6 and 10.
 */
const TRACED: Readonly<Record<number, readonly number[]>> = {
  12: [9012], // collar / juban
  14: [9014], // obi
  15: [9015], // gi body
  7: [9011], //  hakama, far leg — the SAME shape as 11, see above
  11: [9011], // hakama, near leg
  17: [9017], // kasa
};

export const OG_SLOT_ALIASES: ReadonlyArray<readonly [number, number]> = [
  [8, 14],
  [17, 16],
];

/**
 * THE DRESSED FIGHTER (SESSION19 A5.2) — the SAME slots, with traced garment art
 * replacing a part's shape.
 *
 * ⚠️ A SECOND ARRAY, NEVER A MODIFIED ONE (kickoff D3). `OG_SLOT_SHAPES` above
 * stays exactly as it is and `?art=idle` keeps drawing the bare doll, which is
 * what preserves SESSION 18's evidence — every height measurement it passed was
 * taken against that fighter, and editing it in place would silently retire the
 * comparison.
 *
 * ⚠️ EQUIPMENT REPLACES A PART, IT DOES NOT LAYER OVER ONE. The OG composes a
 * fighter by name — `getDefinitionByName(partType + art)` — so a dressed torso
 * is a torso-shaped shape WITH clothing on it, not a shirt floating over a bare
 * chest (FIGHTER_ART_IDS.md §5). That is why this is a slot map and not a list
 * of extra parts.
 *
 * ⚠️ TRACED IDS ARE >= 9000 AND OG IDS ARE NOT. `9017` is the kasa traced for
 * slot 17; its provenance header names the frame and timestamp it came from and
 * what about it is INFERRED (`src/game/art/generated/shape9017.ts`).
 *
 * ⚠️ SLOTS 19/20 AND 1/2 (THE ARMS) ARE NOT DRESSED, AND THEY DRAW IN FRONT OF
 * THE GI. The gi body and the near sleeve are the same grey and are not divided
 * by a closed outline everywhere (A5.1 F6), so no sleeve could be cut out of
 * this frame — a bare near arm still paints over the traced gi. A test pins the
 * exact set of dressed slots, so adding one is a deliberate act, not a drift.
 */
export const OG_DRESSED_SLOT_SHAPES: ReadonlyArray<readonly number[]> = OG_SLOT_SHAPES.map(
  (shapes, slot) => TRACED[slot] ?? shapes,
);
