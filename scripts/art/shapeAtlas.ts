/**
 * THE SHAPE ATLAS (SESSION21 A8.2) — render ALL 1822 extracted OG shapes as
 * contact sheets, so the payload's own art can be LOOKED AT instead of reasoned
 * about. BUILD-TIME ONLY; reads gitignored `reference/`, writes to `renders/`.
 *
 * ⛔ WHY. Three sessions traced garments out of a 233-px-tall, JPEG-compressed
 * video figure on the stated premise that "the equipment art died with the CDN".
 * That premise was never CHECKED against the 1822 shapes actually sitting in
 * `reference/extracted/shapes/` — nothing in the repo has ever rendered more
 * than the 16 the fighter uses. If a kasa, a branch or a garment is in there as
 * ORIGINAL VECTOR ART, then tracing a blurry raster of it is not a 1:1
 * recreation, it is a worse copy of something we already hold exactly.
 *
 * ⭐ IT RENDERS THROUGH THE REPO'S OWN PIPELINE — `convertShapeSvg` → `planShape`
 * → `rasterise` — so a shape that looks right here is a shape the game can draw.
 * A separate quick-and-dirty SVG renderer would answer a different question.
 *
 * Run:  npx vite-node scripts/art/shapeAtlas.ts
 *       npx vite-node scripts/art/shapeAtlas.ts -- --ids 2644,2646   (a few, big)
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DrawOp, ShapeInput } from '../../src/core/artPlan';
import { planShape } from '../../src/core/artPlan';
import { encodePng, rasterise } from './rasterise';
import { convertShapeSvg } from './svgShape';
import { TOLERANCE } from './emit';

const ROOT = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const SRC = path.join(ROOT, 'reference', 'extracted', 'shapes');
const OUT = path.join(ROOT, 'renders', 'atlas');

/** One cell's pixel box. Big enough that a hat brim or a leaf is legible. */
const THUMB = 76;
const PAD = 4;
const COLS = 14;
const ROWS = 10;
const BACKDROP = 0x202024;

interface Cell {
  readonly id: number;
  readonly rgb: Uint8Array;
  readonly ink: number;
}

/** Every point the shape paints, so the thumbnail can frame it. */
function bboxOf(shape: ShapeInput): [number, number, number, number] | null {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  const eat = (pts: readonly number[]): void => {
    for (let i = 0; i + 1 < pts.length; i += 2) {
      const x = pts[i] ?? 0;
      const y = pts[i + 1] ?? 0;
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x > x1) x1 = x;
      if (y > y1) y1 = y;
    }
  };
  for (const p of shape.paints) {
    if (p.kind === 'fill') for (const r of p.rings) eat(r.points);
    else for (const l of p.polylines) eat(l);
  }
  return Number.isFinite(x0) && x1 > x0 && y1 > y0 ? [x0, y0, x1, y1] : null;
}

function renderOne(id: number, box: number): Cell | null {
  let shape: ShapeInput;
  try {
    const svg = readFileSync(path.join(SRC, `${String(id)}.svg`), 'utf8');
    shape = convertShapeSvg(svg, id, TOLERANCE);
  } catch {
    return null;
  }
  const bb = bboxOf(shape);
  if (bb === null) return null;
  const [x0, y0, x1, y1] = bb;
  const inner = box - PAD * 2;
  const scale = Math.min(inner / (x1 - x0), inner / (y1 - y0));
  // Centre the shape's own bbox in the cell. `planShape` anchors the shape's
  // local origin at `origin`, so the offset carries the bbox back to zero.
  const view = { scale, offsetX: 0, offsetY: 0 };
  const origin = {
    x: PAD + (inner - (x1 - x0) * scale) / 2 - x0 * scale,
    y: PAD + (inner - (y1 - y0) * scale) / 2 - y0 * scale,
  };
  let ops: DrawOp[];
  try {
    ops = planShape(shape, origin, view);
  } catch {
    return null;
  }
  const r = rasterise(ops, {
    region: { x: 0, y: 0, width: box, height: box },
    backdrop: BACKDROP,
    supersample: 2,
  });
  let ink = 0;
  for (const c of r.coverage) if (c > 0) ink += 1;
  return { id, rgb: r.rgb, ink };
}

function sheet(cells: readonly Cell[], box: number, cols: number, rows: number): Uint8Array {
  const w = cols * box;
  const h = rows * box;
  const out = new Uint8Array(w * h * 3);
  for (let i = 0; i < out.length; i += 3) {
    out[i] = (BACKDROP >> 16) & 0xff;
    out[i + 1] = (BACKDROP >> 8) & 0xff;
    out[i + 2] = BACKDROP & 0xff;
  }
  cells.forEach((cell, i) => {
    const cx = (i % cols) * box;
    const cy = Math.floor(i / cols) * box;
    for (let y = 0; y < box; y += 1) {
      const src = y * box * 3;
      const dst = ((cy + y) * w + cx) * 3;
      out.set(cell.rgb.subarray(src, src + box * 3), dst);
    }
  });
  return out;
}

function main(): void {
  const argv = process.argv.slice(2);
  const idsArg = argv.indexOf('--ids');
  mkdirSync(OUT, { recursive: true });

  if (idsArg >= 0) {
    const ids = (argv[idsArg + 1] ?? '').split(',').map(Number);
    const box = 320;
    const cells = ids.map((id) => renderOne(id, box)).filter((c): c is Cell => c !== null);
    const png = encodePng(sheet(cells, box, cells.length, 1), box * cells.length, box, 3);
    const p = path.join(OUT, `picked.png`);
    writeFileSync(p, png);
    console.log(`${path.relative(ROOT, p)}  ${cells.map((c) => c.id).join(', ')}`);
    return;
  }

  const ids = readdirSync(SRC)
    .filter((f) => f.endsWith('.svg'))
    .map((f) => Number(f.slice(0, -4)))
    .sort((a, b) => a - b);

  const cells: Cell[] = [];
  let failed = 0;
  let blank = 0;
  for (const id of ids) {
    const c = renderOne(id, THUMB);
    if (c === null) {
      failed += 1;
      continue;
    }
    // A cell with no ink says nothing and costs a slot on a sheet a human has
    // to read. Counted, never silently dropped.
    if (c.ink === 0) {
      blank += 1;
      continue;
    }
    cells.push(c);
  }

  const per = COLS * ROWS;
  const sheets = Math.ceil(cells.length / per);
  const manifest: string[] = [];
  for (let s = 0; s < sheets; s += 1) {
    const slice = cells.slice(s * per, (s + 1) * per);
    const png = encodePng(sheet(slice, THUMB, COLS, ROWS), COLS * THUMB, ROWS * THUMB, 3);
    writeFileSync(path.join(OUT, `sheet_${String(s).padStart(2, '0')}.png`), png);
    slice.forEach((c, i) => {
      if (i % COLS === 0) manifest.push(`sheet ${s} row ${Math.floor(i / COLS)}: `);
      const last = manifest.length - 1;
      manifest[last] = `${manifest[last] ?? ''}${String(c.id)} `;
    });
  }
  writeFileSync(path.join(OUT, 'manifest.txt'), manifest.join('\n'));
  console.log(
    `${String(cells.length)} shapes over ${String(sheets)} sheets in ${path.relative(ROOT, OUT)}\n` +
      `  ${String(failed)} unconvertible, ${String(blank)} rendered empty (both counted, not hidden)`,
  );
}

main();
