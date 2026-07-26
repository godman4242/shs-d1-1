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
  readonly color: number;
  readonly rings: readonly ArtRing[];
}

/** One stroke pass: the OG's black outlines, at their true widths. */
export interface ArtStroke {
  readonly color: number;
  readonly width: number;
  readonly polylines: ReadonlyArray<readonly number[]>;
}

export interface ArtShape {
  readonly id: number;
  readonly fills: readonly ArtFill[];
  readonly strokes: readonly ArtStroke[];
}
