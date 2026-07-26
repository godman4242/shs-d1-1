/**
 * Runtime shape of the imported OG vector art (SESSION 15).
 *
 * Hand-written. The DATA that inhabits these types is generated into
 * `src/game/art/generated/` by `scripts/art/generate.ts` and committed —
 * SESSION15 D1: `reference/` is gitignored, so nothing can be loaded at
 * runtime and the art must be compiled in.
 *
 * Coordinates are shape-local pixels with the part's joint pivot at (0,0),
 * which is what lets the OG's own animation nodes place them (A4).
 */

/** A flat [x0,y0,x1,y1,…] contour. `hole` is the even-odd verdict. */
export interface ArtRing {
  readonly points: readonly number[];
  readonly hole: boolean;
}

/** One solid fill: 0xRRGGBB, byte-exact to the SWF's recorded RGB. */
export interface ArtFill {
  readonly kind: 'fill';
  readonly color: number;
  readonly rings: readonly ArtRing[];
}

/** One stroke pass: the OG's black outlines, at their true widths. */
export interface ArtStroke {
  readonly kind: 'stroke';
  readonly color: number;
  readonly width: number;
  readonly polylines: ReadonlyArray<readonly number[]>;
}

/** One paint operation. Order matters — see `ArtShape.paints`. */
export type ArtPaint = ArtFill | ArtStroke;

export interface ArtShape {
  readonly id: number;
  /**
   * Every paint operation in the source SWF's own order, back to front.
   *
   * ⚠️ A RENDERER MUST WALK THIS ARRAY IN ORDER. Do not draw all the fills and
   * then all the strokes: the OG authors a 2.5 px black outline UNDERNEATH the
   * eight face fills of shape 2662, and hoisting strokes to the top turns 26 %
   * of that shape's ink black (SESSION16 R2 finding 1 — measured against
   * FFDec's own render). 132 of the 1822 source shapes put a stroke before a
   * fill and 162 interleave, so the order cannot be reconstructed by sorting.
   *
   * It is one ordered array rather than a z-index on each paint precisely so
   * that the wrong drawing order is not expressible.
   *
   * ⚠️ NO ALPHA CHANNEL, deliberately. The converter THROWS on any
   * `fill-opacity`/`stroke-opacity` other than 1 rather than silently flattening
   * a translucent paint to opaque. Adding alpha means adding it here, in the
   * emitter, and in the renderer together.
   */
  readonly paints: readonly ArtPaint[];
}
