/**
 * THE HEADLESS RASTERISER (SESSION20 A6.1) — `DrawOp[]` → pixels → PNG, in Node.
 *
 * ⚠️ WHAT THIS CAN AND CANNOT PROVE. `scripts/art/rasterise.ts` draws the
 * PLANNER's own output, so it tests PLACEMENT — where each part lands, in which
 * order, at what size. It is NOT a second copy of Phaser: Phaser strokes with
 * miter joins and butt caps and triangulates fills through Earcut, while this
 * scanline-fills even-odd and strokes with round caps. Those differ by fractions
 * of a pixel at 0.6–2.4 stage px stroke widths, and the divergence is stated in
 * the module header rather than hidden.
 *
 * ⚠️ WHAT IS AND IS NOT COVERED HERE, STATED PLAINLY.
 * `tests/no-game-imports.test.ts` forbids a test from reaching `src/game/**`,
 * and `scripts/art/poseRaster.ts` must import `src/game/art/fighterShapes.ts` —
 * the one registry that keeps the shape lookup from drifting. So:
 *   - the ENGINE (`rasterise.ts`) is covered here, and it is where every
 *     rasterisation risk lives;
 *   - the ARGUMENTS are covered by `tests/renderPoseArgs.test.ts`, which is why
 *     that parsing was split into its own file;
 *   - `poseRaster.ts` itself has **NO suite coverage, by construction.** Its
 *     guards (backdrop-vs-art, ink-fits-region) are chaos-proven by running the
 *     CLI against a planted defect, and the record of that is the commit message
 *     and `docs/DIVERGENCES.md` — not a green test. Do not read a green suite as
 *     covering it.
 *
 * DETERMINISM is asserted three ways, and they are different strengths: the
 * raster is byte-identical in-process (below), `rasterDigest` pins the PIXELS
 * portably (below), and cross-PROCESS identity is evidence from running the CLI
 * twice and `cmp`-ing, recorded in the commit — not a test in this file.
 */
import { describe, expect, it } from 'vitest';
import { inflateSync } from 'node:zlib';
import { encodePng, rasterDigest, rasterise, type RasterOptions } from '../scripts/art/rasterise';
import type { DrawOp, FillOp, HoledFillOp, StrokeOp } from '../src/core/artPlan';
import type { Vec } from '../src/core/vec';

/** Pinned in the same commit as the code it describes — see the GOLDEN test. */
const GOLDEN_SCENE_DIGEST = 'a46f028cdf3983b956f37af76f693b2f9bd094f17afa938345b98876f49f21c6';

const BACKDROP = 0x202020;
const BACK_RGB: readonly [number, number, number] = [0x20, 0x20, 0x20];
const RED: readonly [number, number, number] = [0xff, 0x00, 0x00];
const BLUE: readonly [number, number, number] = [0x00, 0x00, 0xff];

const opts = (over: Partial<RasterOptions> = {}): RasterOptions => ({
  region: { x: 0, y: 0, width: 20, height: 20 },
  backdrop: BACKDROP,
  supersample: 4,
  ...over,
});

/** An axis-aligned rectangle fill, in stage px. */
function rect(x0: number, y0: number, x1: number, y1: number, color: number): FillOp {
  const points: Vec[] = [
    { x: x0, y: y0 },
    { x: x1, y: y0 },
    { x: x1, y: y1 },
    { x: x0, y: y1 },
  ];
  return { kind: 'fill', color, points };
}

/** A rectangle with a rectangular hole, packed exactly as `planShape` packs one. */
function holedRect(outer: readonly number[], hole: readonly number[], color: number): HoledFillOp {
  const flatXY = [...outer, ...hole];
  return { kind: 'holedFill', color, flatXY, holeIndices: [outer.length / 2] };
}

function stroke(points: readonly Vec[], widthStage: number, color: number): StrokeOp {
  return { kind: 'stroke', color, widthStage, points };
}

/** Bounds-checked pixel read — `noUncheckedIndexedAccess` makes it explicit. */
function at(bytes: Uint8Array, i: number): number {
  const v = bytes[i];
  if (v === undefined) throw new Error(`test: byte ${String(i)} out of range`);
  return v;
}

function px(r: { rgb: Uint8Array; width: number }, x: number, y: number): [number, number, number] {
  const i = (y * r.width + x) * 3;
  return [at(r.rgb, i), at(r.rgb, i + 1), at(r.rgb, i + 2)];
}

function cov(r: { coverage: Uint8Array; width: number }, x: number, y: number): number {
  return at(r.coverage, y * r.width + x);
}

/**
 * The box of every pixel carrying ANY ink — the measurement `inkedBounds` models.
 *
 * ⚠️ THIS EXISTS BECAUSE A PROBE-POINT ASSERTION CAN BE DEAD. An adversarial
 * review found that the round-cap test's negative probe (`cov(…, 18, 10) === 0`)
 * sat OUTSIDE the stroke's own scan box, so it passed whatever the cap clamp
 * did. Asserting the whole extent cannot be satisfied by accident.
 */
function inkExtent(r: { coverage: Uint8Array; width: number; height: number }): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let y = 0; y < r.height; y += 1) {
    for (let x = 0; x < r.width; x += 1) {
      if (cov(r, x, y) === 0) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  return { minX, minY, maxX, maxY };
}

describe('rasterise — fills', () => {
  it('fills a rectangle at its STAGE coordinates, over the stated backdrop', () => {
    const r = rasterise([rect(4, 4, 12, 12, 0xff0000)], opts());
    expect(px(r, 8, 8)).toEqual([...RED]);
    expect(cov(r, 8, 8)).toBe(255);
    expect(px(r, 1, 1)).toEqual([...BACK_RGB]);
    expect(cov(r, 1, 1)).toBe(0);
  });

  it('places geometry relative to the REGION origin, not the canvas origin', () => {
    // The same 8x8 square, drawn at stage (104,204) into a region that starts
    // there, must land on exactly the same pixels. Dropping the region offset is
    // the whole-figure-shifted bug, and a whole-figure score cannot see it.
    const r = rasterise([rect(104, 204, 112, 212, 0xff0000)], opts({ region: { x: 100, y: 200, width: 20, height: 20 } }));
    expect(px(r, 8, 8)).toEqual([...RED]);
    expect(px(r, 1, 1)).toEqual([...BACK_RGB]);
  });

  it('punches an even-odd hole through a holedFill, and leaves the ring around it SOLID', () => {
    const outer = [2, 2, 18, 2, 18, 18, 2, 18];
    const hole = [8, 8, 12, 8, 12, 12, 8, 12];
    const r = rasterise([holedRect(outer, hole, 0xff0000)], opts());
    expect(px(r, 10, 10)).toEqual([...BACK_RGB]);
    expect(cov(r, 10, 10)).toBe(0);
    // ⚠️ THE CORNER PROBES ALONE ARE NOT ENOUGH, and a chaos plant proved it:
    // reading the packed array as ONE ring (the SESSION18 A4.1 mis-pack) still
    // leaves the corners red and the centre clear — it cuts a WEDGE out of the
    // sides instead. All four flanks have to be checked.
    for (const [x, y] of [[4, 10], [15, 10], [10, 4], [10, 15]] as const) {
      expect({ x, y, rgb: px(r, x, y) }).toEqual({ x, y, rgb: [...RED] });
    }
  });

  it('PRESERVES PAINT ORDER — a later op paints over an earlier one', () => {
    const r = rasterise([rect(2, 2, 18, 18, 0xff0000), rect(6, 6, 14, 14, 0x0000ff)], opts());
    expect(px(r, 10, 10)).toEqual([...BLUE]);
    expect(px(r, 4, 4)).toEqual([...RED]);
  });

  it('preserves paint order ACROSS OP KINDS — a fill after a stroke buries it', () => {
    // ⛔ THE ORDER THIS MODULE EXISTS TO PRESERVE IS STROKE-vs-FILL, not
    // fill-vs-fill: SESSION16 R2 finding 1 is that the SWF's own style-group
    // order can put a stroke UNDER a fill, which `fills[] then strokes[]`
    // cannot express. Two fills cannot detect that bug at all.
    const line = stroke([{ x: 2, y: 10 }, { x: 18, y: 10 }], 4, 0x000000);
    const over = rect(6, 6, 14, 14, 0x0000ff);
    expect(px(rasterise([line, over], opts()), 10, 10)).toEqual([...BLUE]);
    expect(px(rasterise([over, line], opts()), 10, 10)).toEqual([0, 0, 0]);
  });

  it('registers COVERAGE even where the paint exactly matches the backdrop', () => {
    // This is the whole reason `coverage` exists rather than segmenting on
    // "not the backdrop": a garment painted the backdrop's colour must still
    // read as ink, or a comparator silently deletes it.
    const r = rasterise([rect(4, 4, 12, 12, BACKDROP)], opts());
    expect(px(r, 8, 8)).toEqual([...BACK_RGB]);
    expect(cov(r, 8, 8)).toBe(255);
  });

  it('CLIPS geometry outside the region instead of wrapping it', () => {
    const r = rasterise([rect(-50, -50, -30, -30, 0xff0000), rect(100, 100, 120, 120, 0x0000ff)], opts());
    expect([...r.coverage].every((c) => c === 0)).toBe(true);
  });

  it('clips a shape that straddles an edge, keeping only the part inside', () => {
    const r = rasterise([rect(-5, 4, 5, 12, 0xff0000)], opts());
    expect(px(r, 0, 8)).toEqual([...RED]);
    expect(px(r, 4, 8)).toEqual([...RED]);
    expect(cov(r, 19, 8)).toBe(0);
  });
});

describe('rasterise — strokes', () => {
  it('draws a stroke widthStage wide, CENTRED on its path, IN ITS OWN COLOUR', () => {
    // Centre y = 10, width 4 -> ink spans y 8..12, i.e. pixel rows 8,9,10,11.
    const r = rasterise([stroke([{ x: 2, y: 10 }, { x: 18, y: 10 }], 4, 0xff0000)], opts());
    expect(cov(r, 10, 8)).toBe(255);
    expect(cov(r, 10, 11)).toBe(255);
    expect(cov(r, 10, 7)).toBe(0);
    expect(cov(r, 10, 12)).toBe(0);
    // ⚠️ Coverage alone cannot see a stroke drawn in the WRONG COLOUR, and every
    // stroke assertion here read coverage only until a review said so.
    expect(px(r, 10, 9)).toEqual([...RED]);
  });

  it('round-caps a stroke — the WHOLE ink extent is the path grown by half the width', () => {
    // ⛔ THE PROBE-POINT VERSION OF THIS TEST WAS DEAD. It asserted
    // `cov(…, 18, 10) === 0` for a stroke ending at x = 16 with radius 2 — but
    // column 18 lies outside that segment's own scan box, so the assertion held
    // whatever the cap clamp did. Asserting the extent cannot pass by accident.
    // Path (4,10)..(16,10), width 4 -> ink covers x 2..18, y 8..12, so the lit
    // pixel columns are 2..17 and the lit rows are 8..11.
    const r = rasterise([stroke([{ x: 4, y: 10 }, { x: 16, y: 10 }], 4, 0xff0000)], opts());
    expect(inkExtent(r)).toEqual({ minX: 2, minY: 8, maxX: 17, maxY: 11 });
  });

  it('round-caps a MULTI-SEGMENT stroke too — the real plan has 9..67 points per polyline', () => {
    // An L: (5,5) -> (15,5) -> (15,15), width 2 -> radius 1 in every direction.
    const r = rasterise([stroke([{ x: 5, y: 5 }, { x: 15, y: 5 }, { x: 15, y: 15 }], 2, 0xff0000)], opts());
    expect(inkExtent(r)).toEqual({ minX: 4, minY: 4, maxX: 15, maxY: 15 });
    expect(px(r, 10, 5)).toEqual([...RED]); // along the first segment
    expect(px(r, 15, 10)).toEqual([...RED]); // along the second
    expect(cov(r, 6, 12)).toBe(0); // inside the L's elbow — untouched
  });

  it('CLIPS a stroke that runs off the region instead of wrapping it', () => {
    // Strokes clip through a different code path from fills, and only the fill
    // path was gated until a review pointed it out.
    const r = rasterise([stroke([{ x: -40, y: -40 }, { x: -20, y: -20 }], 4, 0xff0000)], opts());
    expect([...r.coverage].every((c) => c === 0)).toBe(true);
    const edge = rasterise([stroke([{ x: -10, y: 10 }, { x: 5, y: 10 }], 4, 0xff0000)], opts());
    expect(inkExtent(edge).minX).toBe(0);
    expect(inkExtent(edge).maxX).toBe(6);
    expect(cov(edge, 19, 10)).toBe(0);
  });

  it('draws EVERY segment of a polyline, not just the first', () => {
    const r = rasterise(
      [stroke([{ x: 4, y: 4 }, { x: 4, y: 16 }, { x: 16, y: 16 }], 2, 0xff0000)],
      opts(),
    );
    expect(cov(r, 4, 10)).toBeGreaterThan(0);
    expect(cov(r, 10, 16)).toBeGreaterThan(0);
  });

  it('does NOT close the polyline — a closed outline already repeats its first point', () => {
    // ⚠️ PROBE THE CLOSING EDGE ITSELF. A chaos plant showed that testing the
    // "missing side" of a three-corner square proves nothing: the closing edge
    // an L-shaped polyline would add is the DIAGONAL back to the start, so the
    // only pixel that can tell the two apart is one on that diagonal.
    const r = rasterise(
      [stroke([{ x: 4, y: 4 }, { x: 16, y: 4 }, { x: 16, y: 16 }], 2, 0xff0000)],
      opts(),
    );
    expect(cov(r, 10, 4)).toBeGreaterThan(0); // segment 1, drawn
    expect(cov(r, 16, 10)).toBeGreaterThan(0); // segment 2, drawn
    expect(cov(r, 10, 10)).toBe(0); // the closing diagonal, NOT drawn
    expect(cov(r, 7, 7)).toBe(0);
  });
});

describe('rasterise — antialiasing and determinism', () => {
  it('box-downsamples supersample^2 sub-pixels: a half-covered pixel reads half coverage', () => {
    const r = rasterise([rect(4, 4, 12, 12.5, 0xff0000)], opts());
    expect(cov(r, 8, 12)).toBe(128);
    // ⚠️ ASSERT THE VALUE, not just the bracket: 8 of 16 sub-pixels are red, so
    // a LINEAR mean gives round((8*255 + 8*0x20)/16) = 144 on red and
    // round((8*0 + 8*0x20)/16) = 16 on green and blue. A gamma-space blend lands
    // elsewhere and passes a "between backdrop and colour" check.
    expect(px(r, 8, 12)).toEqual([144, 16, 16]);
  });

  it('samples sub-pixel CENTRES, half-open — an edge exactly on a pixel boundary does not bleed', () => {
    // The convention was unpinned: shifting every sample by half a sub-pixel
    // moves every antialiased edge while the suite stays green.
    const r = rasterise([rect(4, 4, 12, 12, 0xff0000)], opts());
    expect(cov(r, 11, 8)).toBe(255); // last fully-covered column
    expect(cov(r, 12, 8)).toBe(0); // the boundary column itself: NOT lit
    expect(cov(r, 3, 8)).toBe(0);
    expect(inkExtent(r)).toEqual({ minX: 4, minY: 4, maxX: 11, maxY: 11 });
  });

  it('quantises coverage to exactly supersample^2 + 1 levels', () => {
    const ss = 2;
    const r = rasterise([rect(4.3, 4.7, 12.1, 12.9, 0xff0000)], opts({ supersample: ss }));
    const levels = new Set<number>();
    for (let k = 0; k <= ss * ss; k += 1) levels.add(Math.round((255 * k) / (ss * ss)));
    for (const c of r.coverage) expect(levels.has(c)).toBe(true);
  });

  it('is byte-identical across two runs with the same input', () => {
    const ops: DrawOp[] = [
      rect(2, 2, 18, 18, 0xff0000),
      stroke([{ x: 3, y: 3 }, { x: 17, y: 17 }], 1.5, 0x000000),
    ];
    const a = rasterise(ops, opts());
    const b = rasterise(ops, opts());
    expect(Buffer.from(a.rgb).equals(Buffer.from(b.rgb))).toBe(true);
    expect(Buffer.from(a.coverage).equals(Buffer.from(b.coverage))).toBe(true);
  });

  it('records the backdrop and supersample it was given — the render is self-describing', () => {
    const r = rasterise([rect(4, 4, 12, 12, 0xff0000)], opts({ supersample: 3 }));
    expect(r.backdrop).toBe(BACKDROP);
    expect(r.supersample).toBe(3);
  });
});

describe('rasterise — fails closed', () => {
  it('rejects a supersample that is not a positive integer', () => {
    expect(() => rasterise([rect(4, 4, 8, 8, 0)], opts({ supersample: 0 }))).toThrow(/supersample/);
    expect(() => rasterise([rect(4, 4, 8, 8, 0)], opts({ supersample: 2.5 }))).toThrow(/supersample/);
  });

  it('rejects a region with no pixels in it — BOTH arms of the guard', () => {
    const bad = (region: RasterOptions['region']): (() => unknown) => () => rasterise([rect(4, 4, 8, 8, 0)], opts({ region }));
    expect(bad({ x: 0, y: 0, width: 0, height: 20 })).toThrow(/region/);
    expect(bad({ x: 0, y: 0, width: 20, height: 0 })).toThrow(/region/); // the arm a review found untested
    expect(bad({ x: 0, y: 0, width: 20.5, height: 20 })).toThrow(/region/);
  });

  it('rejects an empty op list rather than emitting a blank image', () => {
    expect(() => rasterise([], opts())).toThrow(/no draw ops/);
  });

  it('REJECTS a backdrop that is not a 24-bit colour — on the API path, not just the CLI', () => {
    // ⚠️ The CLI validates its own flags, but `renderPose()` is documented for
    // the A6.2 comparator and the A6.4 loop to call DIRECTLY. `fill(NaN)` on a
    // Uint32Array coerces to 0 — pure black, the fighter's own outline colour —
    // so an unvalidated backdrop here reproduces the exact CLI defect a review
    // found, on the path that skips the CLI entirely.
    expect(() => rasterise([rect(4, 4, 8, 8, 0xffffff)], opts({ backdrop: NaN }))).toThrow(/backdrop/);
    expect(() => rasterise([rect(4, 4, 8, 8, 0xffffff)], opts({ backdrop: -1 }))).toThrow(/backdrop/);
    expect(() => rasterise([rect(4, 4, 8, 8, 0xffffff)], opts({ backdrop: 0x1000000 }))).toThrow(/backdrop/);
    expect(() => rasterise([rect(4, 4, 8, 8, 0xffffff)], opts({ backdrop: 1.5 }))).toThrow(/backdrop/);
  });
});

describe('encodePng', () => {
  /** Split a PNG into `[type, data]` chunks — enough to check the file is real. */
  function chunks(png: Uint8Array): Array<{ type: string; data: Buffer }> {
    const buf = Buffer.from(png);
    const out: Array<{ type: string; data: Buffer }> = [];
    let i = 8;
    while (i < buf.length) {
      const len = buf.readUInt32BE(i);
      const type = buf.toString('ascii', i + 4, i + 8);
      out.push({ type, data: buf.subarray(i + 8, i + 8 + len) });
      i += 12 + len;
    }
    return out;
  }

  it('emits the PNG signature, an IHDR of the right size, and IEND last', () => {
    const png = encodePng(new Uint8Array(4 * 3 * 3), 4, 3, 3);
    expect([...png.slice(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const cs = chunks(png);
    const ihdr = cs[0];
    if (ihdr === undefined) throw new Error('test: no IHDR');
    expect(ihdr.type).toBe('IHDR');
    expect(ihdr.data.readUInt32BE(0)).toBe(4);
    expect(ihdr.data.readUInt32BE(4)).toBe(3);
    expect(ihdr.data.readUInt8(8)).toBe(8); // bit depth
    expect(ihdr.data.readUInt8(9)).toBe(2); // colour type 2 = RGB
    // Bytes 10-12 were unasserted until a review noted that an interlace flag
    // makes some decoders garble the image while every structural check passes.
    expect(ihdr.data.readUInt8(10)).toBe(0); // compression: deflate
    expect(ihdr.data.readUInt8(11)).toBe(0); // filter method
    expect(ihdr.data.readUInt8(12)).toBe(0); // interlace: none
    expect(cs.at(-1)?.type).toBe('IEND');
  });

  it('encodes an 8-bit GREYSCALE image when given one channel', () => {
    const png = encodePng(new Uint8Array([0, 128, 255, 7]), 2, 2, 1);
    const ihdr = chunks(png)[0];
    expect(ihdr?.data.readUInt8(9)).toBe(0); // colour type 0 = greyscale
  });

  it('IDAT inflates back to the EXACT pixel rows, each behind a filter-0 byte', () => {
    const pixels = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]); // 2x2 RGB
    const idat = chunks(encodePng(pixels, 2, 2, 3)).find((c) => c.type === 'IDAT');
    if (idat === undefined) throw new Error('test: no IDAT');
    expect([...inflateSync(idat.data)]).toEqual([0, 1, 2, 3, 4, 5, 6, 0, 7, 8, 9, 10, 11, 12]);
  });

  it('writes a CRC after every chunk that matches the chunk it follows', () => {
    // A wrong CRC makes a file every decoder rejects and every eye accepts.
    const png = Buffer.from(encodePng(new Uint8Array(3), 1, 1, 3));
    let i = 8;
    let checked = 0;
    while (i < png.length) {
      const len = png.readUInt32BE(i);
      const body = png.subarray(i + 4, i + 8 + len);
      const stored = png.readUInt32BE(i + 8 + len);
      let crc = 0xffffffff;
      for (const b of body) {
        crc ^= b;
        for (let k = 0; k < 8; k += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
      }
      expect(stored).toBe((crc ^ 0xffffffff) >>> 0);
      checked += 1;
      i += 12 + len;
    }
    expect(checked).toBe(3);
  });

  it('is byte-identical for the same pixels — the PNG, not just the raster, is deterministic', () => {
    const pixels = new Uint8Array(64 * 64 * 3).map((_, i) => (i * 37) % 256);
    expect(Buffer.from(encodePng(pixels, 64, 64, 3)).equals(Buffer.from(encodePng(pixels, 64, 64, 3)))).toBe(true);
  });

  it('rejects a pixel buffer that is not width x height x channels', () => {
    expect(() => encodePng(new Uint8Array(5), 2, 2, 3)).toThrow(/pixel buffer/);
  });

  it('REJECTS a zero or fractional dimension instead of emitting an undecodable file', () => {
    // The length guard alone passes for an empty buffer at 0x0, and the result
    // is a structurally valid 65-byte PNG with an IHDR the spec forbids — every
    // decoder rejects it, while the caller sees a byte count and a hash. Found
    // by an adversarial review of A6.1.
    expect(() => encodePng(new Uint8Array(0), 0, 0, 3)).toThrow(/dimension/);
    expect(() => encodePng(new Uint8Array(0), 4, 0, 3)).toThrow(/dimension/);
    expect(() => encodePng(new Uint8Array(0), 0, 4, 1)).toThrow(/dimension/);
    expect(() => encodePng(new Uint8Array(36), 1.5, 2, 3)).toThrow(/dimension/);
  });
});

describe('rasterDigest — the render\'s identity is its PIXELS, not its file', () => {
  const scene: DrawOp[] = [
    rect(2, 2, 18, 18, 0xff0000),
    holedRect([3, 3, 17, 3, 17, 17, 3, 17], [7, 7, 13, 7, 13, 13, 7, 13], 0x00ff00),
    stroke([{ x: 3, y: 16 }, { x: 17, y: 4 }, { x: 9, y: 9 }], 1.5, 0x000000),
    rect(5.25, 5.75, 11.5, 14.125, 0x0000ff),
  ];

  it('is identical for two rasters of the same input', () => {
    expect(rasterDigest(rasterise(scene, opts()))).toBe(rasterDigest(rasterise(scene, opts())));
  });

  it('changes when ANY pixel changes', () => {
    const moved: DrawOp[] = [...scene.slice(0, 3), rect(5.25, 5.75, 11.5, 14.25, 0x0000ff)];
    expect(rasterDigest(rasterise(moved, opts()))).not.toBe(rasterDigest(rasterise(scene, opts())));
  });

  it('covers the backdrop and supersample, not just the colour bytes', () => {
    const base = rasterDigest(rasterise(scene, opts()));
    expect(rasterDigest(rasterise(scene, opts({ supersample: 2 })))).not.toBe(base);
    expect(rasterDigest(rasterise(scene, opts({ backdrop: 0x00ffff })))).not.toBe(base);
  });

  it('GOLDEN: this exact scene still rasterises to the same pixels', () => {
    // ⚠️ A REGRESSION gate, not a correctness one — the value was taken from the
    // implementation the other tests in this file prove correct. What it buys:
    // any unintended change to the fill rule, the stroke geometry or the
    // downsample moves it, including changes no hand-written probe thought to
    // look at. It is PORTABLE, unlike a hash of the PNG: `rasterise` uses only
    // exactly-specified arithmetic (no Math.cos/sin, no transcendentals), while
    // `deflateSync` output depends on the zlib Node was built against.
    expect(rasterDigest(rasterise(scene, opts()))).toBe(GOLDEN_SCENE_DIGEST);
  });
});
