/**
 * HEADLESS RASTERISER (SESSION20 A6.1) — a planned `DrawOp[]` → pixels → a PNG,
 * from Node, with no browser and no new dependency. BUILD-TIME ONLY: nothing in
 * `src/` imports this file and nothing it produces ships.
 *
 * WHY IT EXISTS (kickoff D3). Every SESSION 19 comparison went through a manual
 * browser screenshot, at an unknown scale, on a JPEG, over a backdrop that had
 * to be injected by hand — and every defect in that session's outfit was found
 * by a human eye rather than by a gate. A loop that grades the fighter against
 * the source frames cannot run on a manual screenshot. This turns the planner's
 * own output into a file, deterministically, in milliseconds.
 *
 * ⛔ WHAT IT IS NOT, AND THIS BOUNDS EVERY NUMBER TAKEN FROM IT. This draws the
 * PLANNER's output, so it tests PLACEMENT — where each part lands, in what
 * order, at what size. It is **not a second copy of Phaser**, and three things
 * are deliberately different:
 *
 *   1. FILLS are scanline-filled EVEN-ODD; Phaser triangulates through Earcut.
 *      For the simple, non-self-intersecting rings the converter emits, the two
 *      cover the same region — and even-odd punches a `holedFill`'s holes
 *      regardless of which way its hole rings wind, where Earcut needs the
 *      packing to be right. That makes this renderer BLIND to a mis-packed
 *      hole, which is exactly what `Earcut.deviation` in the live scene is for.
 *   2. STROKES get ROUND caps and joins; Phaser's Graphics uses miter joins and
 *      butt caps. At the 0.5–2 world px (0.6–2.4 stage px) widths the committed
 *      art actually carries, that is a sub-pixel difference at polyline ends.
 *      Round caps also match `inkedBounds`, which already grows every stroke by
 *      half its width on every side — so this renderer and the repo's own
 *      measurement agree by construction rather than by luck.
 *   3. ANTIALIASING is a box downsample of `supersample`² hard-edged sub-pixels,
 *      not Phaser's GPU coverage. Edge pixels will differ by a few units.
 *
 * ⚠️ THE CANVAS THE GAME DRAWS ON IS TRANSPARENT (`?art=idle` / `?art=dressed`),
 * and a black outline over a black page is invisible — SESSION 19 lost a round
 * to exactly that. So a backdrop is REQUIRED here, it is composited in, and the
 * `Raster` carries the colour it used: a render that cannot say what it was
 * drawn over cannot be graded.
 *
 * ⛔ DETERMINISM — STATED PRECISELY, BECAUSE THE OBVIOUS CLAIM IS FALSE.
 * There are three different guarantees here and they are NOT the same strength:
 *
 *   1. `rasterise()` — EXACT, on any conforming engine. No clock, no randomness,
 *      no Map/Set iteration order, and only exactly-specified arithmetic
 *      (`+ - * /`, `Math.round/ceil/min/max`). No transcendentals.
 *   2. `rasterDigest()` — therefore also exact and PORTABLE. This is a render's
 *      identity: hash the PIXELS, never the file.
 *   3. `encodePng()` — deterministic for a FIXED Node build ONLY. `deflateSync`
 *      output is a function of the zlib Node was compiled against, not of its
 *      input. Measured on this machine, same 20 000 input bytes at level 9:
 *        node v25.8.2 (shared zlib 1.2.12)  → sha 839bcfde99e8e51a
 *        node v24.14.1 (bundled zlib 1.3.1) → sha 6e713876e21a4dc5
 *      CI runs `node-version: 'lts/*'`, so it is a DIFFERENT build from the dev
 *      Mac. **Never gate on a PNG's bytes or hash — gate on `rasterDigest`.**
 *      (Found by an adversarial review of A6.1, which is also why this paragraph
 *      replaced a one-line claim that the PNG was "a pure function of the pixels".)
 *
 * ⚠️ AND ONE LEVEL UP: `planPose` rotates with `Math.cos`/`Math.sin`, which
 * ECMAScript leaves implementation-defined. So a PLAN is only guaranteed stable
 * on a fixed engine; the guarantee above is about this file, given a plan.
 */
import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import type { DrawOp } from '../../src/core/artPlan';
import type { Vec } from '../../src/core/vec';

/** The crop of the stage to draw, in stage px. One output pixel = one stage px. */
export interface RasterRegion {
  /** Stage x of the output's left edge. */
  readonly x: number;
  /** Stage y of the output's top edge. */
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface RasterOptions {
  readonly region: RasterRegion;
  /** `0xRRGGBB`, opaque. Recorded in the result — a render must state its own backdrop. */
  readonly backdrop: number;
  /** Integer ≥ 1. Each output pixel is the box mean of `supersample`² sub-pixels. */
  readonly supersample: number;
}

export interface Raster {
  readonly width: number;
  readonly height: number;
  readonly backdrop: number;
  readonly supersample: number;
  /** RGB, 3 bytes per pixel, row-major, already composited onto `backdrop`. */
  readonly rgb: Uint8Array;
  /**
   * Ink coverage, 1 byte per pixel: 0 = untouched backdrop, 255 = fully painted.
   * This is the channel a comparator should segment on — "not the backdrop"
   * misses any garment that happens to be the backdrop's colour.
   */
  readonly coverage: Uint8Array;
}

const RGB_CHANNELS = 3;
const BYTE_MAX = 255;
/** Sub-pixel centres sit at +0.5, so a span [a,b) lights columns ceil(a-0.5)…ceil(b-0.5)-1. */
const HALF = 0.5;

/** Bounds-checked read — `noUncheckedIndexedAccess` makes the absence explicit. */
function num(values: ArrayLike<number>, i: number): number {
  const v = values[i];
  if (v === undefined) throw new Error(`rasterise: index ${String(i)} out of range`);
  return v;
}

/** `Vec[]` → the flat `[x0,y0,…]` the scanline filler walks. */
function flatten(points: readonly Vec[]): number[] {
  return points.flatMap((p) => [p.x, p.y]);
}

/**
 * Every closed ring of a fill op, in STAGE px.
 *
 * A `holedFill` is already packed as "outer ring, then each of ITS hole rings"
 * with `holeIndices` giving the VERTEX each hole starts at — so the ring
 * boundaries are read back from the same indices the planner wrote, never
 * re-derived. Under even-odd, outer-minus-holes falls out for free.
 */
function ringsOf(op: DrawOp): number[][] {
  if (op.kind === 'fill') return [flatten(op.points)];
  if (op.kind === 'stroke') throw new Error('rasterise: ringsOf called on a stroke op');
  const bounds = [...op.holeIndices.map((v) => v * 2), op.flatXY.length];
  const rings: number[][] = [];
  let start = 0;
  for (const end of bounds) {
    rings.push([...op.flatXY.slice(start, end)]);
    start = end;
  }
  return rings;
}

/** Stage px → sub-pixel space: the region origin removed, then scaled up. */
function toSubSpace(flat: readonly number[], region: RasterRegion, ss: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    out.push((num(flat, i) - region.x) * ss, (num(flat, i + 1) - region.y) * ss);
  }
  return out;
}

/** One sub-pixel painted: colour replaces (painter's algorithm), ink is set. */
function paint(subColor: Uint32Array, subInk: Uint8Array, i: number, color: number): void {
  subColor[i] = color;
  subInk[i] = 1;
}

/**
 * Even-odd scanline fill of a set of closed rings, in sub-pixel space.
 *
 * ⚠️ THE IMPLICIT CLOSING EDGE (`(v + 1) % n`) IS LOAD-BEARING, NOT DEFENSIVE.
 * Measured over the committed art, 2026-07-27: **0 of 50 fill rings repeat their
 * first point** — they are all stored OPEN. Drop the wrap and every fill loses
 * its last edge, which leaks the fill across the rest of every scanline it
 * touches. (An earlier draft of this comment claimed the opposite, and an
 * adversarial review of A6.1 caught it — the claim was never measured.)
 *
 * The half-open crossing test `(y0 <= sy) !== (y1 <= sy)` then counts each vertex
 * exactly once, so a ring that DOES repeat its first point contributes a
 * zero-length edge that is ignored rather than a double crossing that would
 * invert the fill.
 */
function fillRings(
  rings: ReadonlyArray<readonly number[]>,
  color: number,
  subColor: Uint32Array,
  subInk: Uint8Array,
  subW: number,
  subH: number,
): void {
  let yMin = Infinity;
  let yMax = -Infinity;
  for (const ring of rings) {
    for (let i = 1; i < ring.length; i += 2) {
      const y = num(ring, i);
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }
  }
  if (!Number.isFinite(yMin)) return;

  const rowFrom = Math.max(0, Math.ceil(yMin - HALF));
  const rowTo = Math.min(subH - 1, Math.ceil(yMax - HALF) - 1);
  const crossings: number[] = [];

  for (let row = rowFrom; row <= rowTo; row += 1) {
    const sy = row + HALF;
    crossings.length = 0;
    for (const ring of rings) {
      const n = ring.length / 2;
      for (let v = 0; v < n; v += 1) {
        const x0 = num(ring, v * 2);
        const y0 = num(ring, v * 2 + 1);
        const w = (v + 1) % n;
        const x1 = num(ring, w * 2);
        const y1 = num(ring, w * 2 + 1);
        if (y0 <= sy === y1 <= sy) continue;
        crossings.push(x0 + ((sy - y0) * (x1 - x0)) / (y1 - y0));
      }
    }
    if (crossings.length === 0) continue;
    crossings.sort((a, b) => a - b);

    const base = row * subW;
    for (let k = 0; k + 1 < crossings.length; k += 2) {
      const from = Math.max(0, Math.ceil(num(crossings, k) - HALF));
      const to = Math.min(subW - 1, Math.ceil(num(crossings, k + 1) - HALF) - 1);
      for (let col = from; col <= to; col += 1) paint(subColor, subInk, base + col, color);
    }
  }
}

/**
 * A polyline stroked at `radius` sub-pixels, with round caps and joins.
 *
 * Every sub-pixel within `radius` of the segment is ink — the definition of a
 * round-capped stroke, and cheaper AND less error-prone than assembling join
 * geometry.
 *
 * The polyline is NOT closed, matching `drawPlan`'s `closeShape: false`. ⚠️ Note
 * the measured picture, which is narrower than that call site's comment implies:
 * of the 28 stroke polylines in the committed art, **6 repeat their first point**
 * and 22 do not — the 22 are open paths, so closing here would invent an edge.
 */
function strokePolyline(
  flat: readonly number[],
  radius: number,
  color: number,
  subColor: Uint32Array,
  subInk: Uint8Array,
  subW: number,
  subH: number,
): void {
  const n = flat.length / 2;
  if (n < 2 || radius <= 0) return;
  const r2 = radius * radius;

  for (let v = 0; v + 1 < n; v += 1) {
    const x0 = num(flat, v * 2);
    const y0 = num(flat, v * 2 + 1);
    const x1 = num(flat, v * 2 + 2);
    const y1 = num(flat, v * 2 + 3);
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len2 = dx * dx + dy * dy;

    const from = Math.max(0, Math.ceil(Math.min(y0, y1) - radius - HALF));
    const to = Math.min(subH - 1, Math.ceil(Math.max(y0, y1) + radius - HALF) - 1);
    const colFrom = Math.max(0, Math.ceil(Math.min(x0, x1) - radius - HALF));
    const colTo = Math.min(subW - 1, Math.ceil(Math.max(x0, x1) + radius - HALF) - 1);

    for (let row = from; row <= to; row += 1) {
      const py = row + HALF;
      const base = row * subW;
      for (let col = colFrom; col <= colTo; col += 1) {
        const pxx = col + HALF;
        // Nearest point on the segment, clamped to its ends — that clamp IS the
        // round cap, and at an interior vertex the two clamped discs are the join.
        const t = len2 === 0 ? 0 : Math.min(1, Math.max(0, ((pxx - x0) * dx + (py - y0) * dy) / len2));
        const ex = pxx - (x0 + t * dx);
        const ey = py - (y0 + t * dy);
        if (ex * ex + ey * ey <= r2) paint(subColor, subInk, base + col, color);
      }
    }
  }
}

/**
 * Draw `ops` in order — painter's algorithm, because PAINT ORDER IS THE ONE
 * PROPERTY A SILHOUETTE CANNOT SEE and this repo has already shipped a stroke
 * that belonged under a fill (SESSION16 R2 finding 1).
 *
 * Throws on an empty plan rather than emitting a blank image: a picture of the
 * backdrop is indistinguishable from a picture of a fighter that failed to draw.
 */
export function rasterise(ops: readonly DrawOp[], options: RasterOptions): Raster {
  const { region, backdrop, supersample: ss } = options;
  if (!Number.isInteger(ss) || ss < 1) {
    throw new Error(`rasterise: supersample must be a positive integer — got ${String(ss)}`);
  }
  if (!Number.isInteger(region.width) || !Number.isInteger(region.height) || region.width < 1 || region.height < 1) {
    throw new Error(`rasterise: region must be at least 1x1 whole pixels — got ${String(region.width)}x${String(region.height)}`);
  }
  // ⚠️ VALIDATED HERE, NOT ONLY IN THE CLI. `Uint32Array.fill(NaN)` coerces to
  // 0 — pure black, which is the fighter's own outline colour and the one value
  // `assertBackdropIsNotArt` correctly refuses when it is written out honestly.
  // The comparator and the loop are documented to call `renderPose()` directly,
  // so a guard that lives only in the argument parser guards nothing.
  if (!Number.isInteger(backdrop) || backdrop < 0 || backdrop > 0xffffff) {
    throw new Error(`rasterise: backdrop must be a 24-bit colour 0x000000..0xffffff — got ${String(backdrop)}`);
  }
  if (ops.length === 0) throw new Error('rasterise: no draw ops — a blank image is not a render');

  const subW = region.width * ss;
  const subH = region.height * ss;
  const subColor = new Uint32Array(subW * subH).fill(backdrop);
  const subInk = new Uint8Array(subW * subH);

  for (const op of ops) {
    if (op.kind === 'stroke') {
      const flat = toSubSpace(flatten(op.points), region, ss);
      strokePolyline(flat, (op.widthStage * ss) / 2, op.color, subColor, subInk, subW, subH);
      continue;
    }
    const rings = ringsOf(op).map((ring) => toSubSpace(ring, region, ss));
    fillRings(rings, op.color, subColor, subInk, subW, subH);
  }

  const rgb = new Uint8Array(region.width * region.height * RGB_CHANNELS);
  const coverage = new Uint8Array(region.width * region.height);
  const cells = ss * ss;

  for (let y = 0; y < region.height; y += 1) {
    for (let x = 0; x < region.width; x += 1) {
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let ink = 0;
      for (let r = 0; r < ss; r += 1) {
        const base = (y * ss + r) * subW + x * ss;
        for (let c = 0; c < ss; c += 1) {
          const color = num(subColor, base + c);
          sumR += (color >>> 16) & BYTE_MAX;
          sumG += (color >>> 8) & BYTE_MAX;
          sumB += color & BYTE_MAX;
          ink += num(subInk, base + c);
        }
      }
      const out = (y * region.width + x) * RGB_CHANNELS;
      rgb[out] = Math.round(sumR / cells);
      rgb[out + 1] = Math.round(sumG / cells);
      rgb[out + 2] = Math.round(sumB / cells);
      coverage[y * region.width + x] = Math.round((BYTE_MAX * ink) / cells);
    }
  }

  return { width: region.width, height: region.height, backdrop, supersample: ss, rgb, coverage };
}

/**
 * A render's IDENTITY: sha256 over the pixels and the settings that produced
 * them — never over the PNG, whose bytes move with Node's zlib (see the header).
 *
 * The backdrop and supersample are folded in because two renders that differ
 * only in those are different renders, and both are already recorded on the
 * `Raster` so that a render can say what it was drawn over.
 */
export function rasterDigest(raster: Raster): string {
  return createHash('sha256')
    .update(`${raster.width}x${raster.height}|${raster.backdrop}|${raster.supersample}|`)
    .update(raster.rgb)
    .update(raster.coverage)
    .digest('hex');
}

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
/** Pinned so the compressed bytes are a pure function of the pixels. */
const DEFLATE_LEVEL = 9;

const CRC_TABLE = ((): Uint32Array => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Buffer): number {
  let c = 0xffffffff;
  for (const b of bytes) c = num(CRC_TABLE, (c ^ b) & BYTE_MAX) ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** One PNG chunk: length, type, data, CRC of type+data. */
function chunk(type: string, data: Buffer): Buffer {
  const head = Buffer.alloc(4);
  head.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([head, body, crc]);
}

/**
 * 8-bit PNG — `channels` 3 for RGB, 1 for greyscale (the coverage mask).
 *
 * Filter type 0 (None) on every row: the point of this file is bytes that do not
 * move between runs, and an adaptive filter would trade that for a smaller file
 * nobody is short of. No `tIME` chunk is written, so nothing here carries a clock.
 */
export function encodePng(pixels: Uint8Array, width: number, height: number, channels: 1 | 3): Uint8Array {
  // ⚠️ THE LENGTH CHECK ALONE IS NOT ENOUGH. At 0x0 it passes for an empty
  // buffer and the result is a structurally perfect 65-byte PNG — right
  // signature, right CRCs — carrying an IHDR the spec forbids, which every
  // decoder rejects while the caller sees a byte count and a hash.
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    throw new Error(`encodePng: dimensions must be whole pixels >= 1 — got ${String(width)}x${String(height)}`);
  }
  const expected = width * height * channels;
  if (pixels.length !== expected) {
    throw new Error(`encodePng: pixel buffer is ${String(pixels.length)} bytes, expected ${String(expected)}`);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(channels === 1 ? 0 : 2, 9); // colour type: 0 greyscale, 2 RGB
  ihdr.writeUInt8(0, 10); // compression: deflate
  ihdr.writeUInt8(0, 11); // filter method
  ihdr.writeUInt8(0, 12); // interlace: none

  const stride = width * channels;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y += 1) {
    raw.writeUInt8(0, y * (stride + 1)); // filter type 0 = None
    Buffer.from(pixels.subarray(y * stride, (y + 1) * stride)).copy(raw, y * (stride + 1) + 1);
  }

  return new Uint8Array(
    Buffer.concat([
      PNG_SIGNATURE,
      chunk('IHDR', ihdr),
      chunk('IDAT', deflateSync(raw, { level: DEFLATE_LEVEL })),
      chunk('IEND', Buffer.alloc(0)),
    ]),
  );
}
