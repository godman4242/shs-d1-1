/**
 * IMPORTED OG ART — layout and measurement constants (SESSION17 D6).
 *
 * A3 draws ONE imported shape (the samurai's head, `SHAPE_2664`) beside the
 * procedural fighter behind `?art=og`, at a fixed position, to answer exactly
 * one question: is it the right size on screen? Everything here is INFERRED
 * staging for that question — none of it is a claim about the original game,
 * and none of it feeds gameplay.
 *
 * It lives in `src/config/` rather than in the scene because `src/game/` is
 * ratcheted against a committed literal baseline: a number typed into the scene
 * fails `tests/game-purity-ratchet.test.ts`, and the correct response is to name
 * it here, never to refresh the baseline to quiet it.
 */

/** Bytes per pixel in an RGBA buffer, and the offset of the alpha channel. */
export const RGBA_STRIDE = 4;
export const RGBA_ALPHA_OFFSET = 3;

/**
 * Two points closer than this are ON each other for ring-containment purposes
 * (`src/core/ringGeometry.ts`). Spec-fixed, not tuning: FFDec emits abutting
 * regions of one even-odd path along a byte-identical shared edge, so the
 * epsilon exists to recognise "exactly coincident", not to absorb slop. Widening
 * it would start swallowing genuinely-near-but-distinct edges — the failure
 * SESSION16 R2 finding 3 fixed by probing more edges instead.
 */
export const RING_ON_EPSILON = 1e-9;

/**
 * Vertices per triangle. `Phaser.Geom.Polygon.Earcut` returns ONE flat array of
 * vertex indices, three per triangle — this is the stride that reads it back.
 */
export const TRIANGLE_VERTS = 3;

/**
 * SESSION17 §P2's measurement rule: a pixel counts as ink at 50 % of full alpha.
 * Fixed here so the threshold cannot drift between one reading and the next.
 */
export const INK_ALPHA_THRESHOLD = 128;

/**
 * A3.2 STAGING — where the `?art=og` comparison scene puts things, in STAGE px
 * on the fixed 1024 × 576 canvas. INFERRED, all of it: the position is arbitrary
 * and deliberately FIXED (SESSION17 D4) so that scale is the only variable the
 * measurement can be reading.
 *
 * The head lands well clear of both the fighter and the caption because the
 * measurement snapshots a padded region around it — anything else inside that
 * region would be counted as the head's own ink.
 */
export const OG_ART_STAGE = {
  /** Where `SHAPE_2664`'s local (0,0) — the neck joint pivot — is pinned. */
  headAnchorX: 640,
  headAnchorY: 300,
  /** The procedural fighter, drawn beside it for comparison (SESSION17 D3). */
  samuraiX: 380,
  samuraiGroundY: 430,
  samuraiFacing: 1,
  /**
   * The caption. D4 requires the position to be labelled, not just fixed.
   * Sits BELOW the fighter's ground line so it crosses neither the fighter nor
   * the measurement region around the head.
   */
  labelX: 512,
  labelY: 505,
  labelSizePx: 13,
  /**
   * Stage px of clear space kept around the planned ink in the measurement
   * snapshot. Generous on purpose: `inkBox` reports `clipped` if the ink
   * reaches a border, and a clipped read is indistinguishable from a small one.
   */
  snapshotPad: 24,
  artDepth: 1,
  labelDepth: 2,
} as const;

/**
 * A4.4 STAGING — where `?art=idle` puts the composed OG fighter, in STAGE px.
 *
 * INFERRED staging, like `OG_ART_STAGE`: the position is arbitrary and
 * deliberately FIXED so that the composition is the only variable the
 * measurement reads. The anchor is the fighter's OWN origin — the recorded node
 * offsets are all negative in y, so the origin sits at its FEET and the figure
 * builds upward from here.
 */
export const OG_IDLE_STAGE = {
  anchorX: 512,
  anchorY: 430,
  labelX: 512,
  labelY: 520,
  labelSizePx: 13,
  /** Clear space kept around the planned ink when snapshotting for measurement. */
  snapshotPad: 24,
  artDepth: 1,
  labelDepth: 2,
} as const;

/**
 * The composed OG fighter inside the DUEL itself (SESSION23 A11.1).
 *
 * INFERRED staging. `groundOffsetY` is the ground line the duel has always
 * drawn its fighters on: `drawSamurai(g, ps.x, ps.y + 60, …)` treated its
 * second coordinate as the feet band, and the composed fighter's origin is
 * also at its feet (`OG_IDLE_STAGE` doc) — so the swap keeps the exact line
 * and only names the number. `tests/a11DuelFighter.test.ts` pins it.
 */
export const OG_DUEL_STAGE = {
  groundOffsetY: 60,
} as const;

/** Coordinates per vertex in the flat array Earcut reads — x and y. */
export const EARCUT_DIMENSIONS = 2;

/**
 * §6 Risk 2's debug pass: one distinct colour per drawn part, so the layer stack
 * can be checked by eye ONCE. A silhouette gate cannot see an interior error, by
 * definition — a mis-slotted limb hides behind a correct-looking outline. Behind
 * `?art=idle&debug=1`, off by default.
 */
export const OG_DEBUG_PART_COLORS: readonly number[] = [
  0xff0000, 0xff8800, 0xffff00, 0x88ff00, 0x00ff00, 0x00ff88, 0x00ffff, 0x0088ff, 0x0000ff, 0x8800ff,
  0xff00ff, 0xff0088, 0xffffff, 0x888888, 0x884400, 0x448800, 0x004488, 0x440088, 0x880044, 0xcccc88,
  0x88cccc,
];
