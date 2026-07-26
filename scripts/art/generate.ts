/**
 * SESSION 15 A2 — emit committed TypeScript art from an FFDec shape SVG.
 *
 *   npx vite-node scripts/art/generate.ts -- <shapeId> [<shapeId> …]
 *
 * (vite-node ships with vitest, so this needs no new dependency. Plain
 * `node --experimental-strip-types` cannot run it: type-stripping requires
 * explicit `.ts` import specifiers, which the rest of the repo does not use.)
 *
 * Reads `reference/extracted/shapes/<id>.svg` (gitignored, local-only) and
 * writes `src/game/art/generated/shape<id>.ts`. Every emitted file carries a
 * provenance header naming its characterId and the exact command that
 * extracted it — SESSION15 D7 makes a missing header a gate failure.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { convertShapeSvg, type ShapeArt } from './svgShape';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const SHAPE_DIR = path.join(ROOT, 'reference', 'extracted', 'shapes');
const OUT_DIR = path.join(ROOT, 'src', 'game', 'art', 'generated');

/**
 * Curve flattening tolerance, in shape-local pixels. The parts are 9–37 px
 * tall, so 0.02 px is ~0.1 % of a limb — far below anything §2 bar A's ≥90 %
 * silhouette IoU can see, and it survives zooming.
 */
export const TOLERANCE = 0.02;
/** Sub-milli-pixel. Keeps the emitted file small and byte-deterministic. */
const DECIMALS = 3;

const round = (n: number): number => Number(n.toFixed(DECIMALS));

function emit(art: ShapeArt): string {
  const hex = (c: number): string => `0x${c.toString(16).padStart(6, '0')}`;
  const fills = art.fills
    .map((f) => {
      const rings = f.rings
        .map((r) => `        { points: [${r.points.map(round).join(',')}], hole: ${String(r.hole)} },`)
        .join('\n');
      return `    {\n      color: ${hex(f.color)},\n      rings: [\n${rings}\n      ],\n    },`;
    })
    .join('\n');
  const strokes = art.strokes
    .map((s) => {
      const lines = s.polylines.map((p) => `        [${p.map(round).join(',')}],`).join('\n');
      return `    {\n      color: ${hex(s.color)},\n      width: ${String(s.width)},\n      polylines: [\n${lines}\n      ],\n    },`;
    })
    .join('\n');

  const nRings = art.fills.reduce((n, f) => n + f.rings.length, 0);
  const nHoles = art.fills.reduce((n, f) => n + f.rings.filter((r) => r.hole).length, 0);
  const nVerts = art.fills.reduce((n, f) => n + f.rings.reduce((m, r) => m + r.points.length / 2, 0), 0);

  return `/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE
 *   source characterId : ${String(art.id)}   (DefineShape in the OG payload)
 *   source file        : reference/extracted/shapes/${String(art.id)}.svg  (gitignored)
 *   extracted by       : FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -export shape \\
 *                          reference/extracted/shapes reference/decrypted/shs3_payload_decoded.swf
 *   converted by       : npx vite-node scripts/art/generate.ts -- ${String(art.id)}
 *   flatten tolerance  : ${String(TOLERANCE)} px   ·   coordinates rounded to ${String(DECIMALS)} dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * CONTENT
 *   ${String(art.fills.length)} solid fill(s), ${String(nRings)} ring(s) (${String(nHoles)} hole(s)), ${String(nVerts)} vertices,
 *   ${String(art.strokes.length)} stroke pass(es).
 *   Colours are BYTE-EXACT to the SWF's recorded RGB (SESSION15 §2 bar B).
 *   APPROXIMATED FILLS: none — this shape is 100 % flat solid colour, so
 *   SESSION15 D3 (mean-colour gradients) and D4 (bitmap fills) do not apply.
 *
 * Coordinates are shape-local px; (0,0) is the part's joint pivot.
 */
import type { ArtShape } from '../types';

export const SHAPE_${String(art.id)}: ArtShape = {
  id: ${String(art.id)},
  fills: [
${fills}
  ],
  strokes: [
${strokes}
  ],
};
`;
}

function main(): void {
  const ids = process.argv.slice(2).map(Number);
  if (ids.length === 0 || ids.some(Number.isNaN)) {
    throw new Error('usage: generate.ts <shapeId> [<shapeId> …]');
  }
  mkdirSync(OUT_DIR, { recursive: true });
  for (const id of ids) {
    const svg = readFileSync(path.join(SHAPE_DIR, `${String(id)}.svg`), 'utf8');
    const art = convertShapeSvg(svg, id, TOLERANCE);
    const out = path.join(OUT_DIR, `shape${String(id)}.ts`);
    writeFileSync(out, emit(art));
    const verts = art.fills.reduce((n, f) => n + f.rings.reduce((m, r) => m + r.points.length / 2, 0), 0);
     
    console.log(`shape ${String(id)}: ${String(art.fills.length)} fills, ${String(verts)} verts → ${path.relative(ROOT, out)}`);
  }
}

main();
