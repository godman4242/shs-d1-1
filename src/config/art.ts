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
