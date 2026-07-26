/**
 * SESSION 15 A2 / SESSION 16 R2 — the pure emitter: `ShapeArt` → committed
 * TypeScript source text. BUILD-TIME ONLY; this file never ships.
 *
 * Split out of `generate.ts` by SESSION16 R2 (finding 5). `generate.ts` calls
 * `main()` at module scope, so importing it from a test would run the CLI and
 * throw on argv — which is why nothing had ever referenced `TOLERANCE` or the
 * emitted text from a test, and why a converter that drifted away from the
 * committed artifact had nothing to fail against. Keeping the emitter pure makes
 * the re-derivation check possible: `emit(convertShapeSvg(svg, id, TOLERANCE))`
 * must reproduce the committed file byte for byte.
 */
import type { ShapeArt } from './svgShape';

/**
 * Curve flattening tolerance, in shape-local pixels. The parts are 9–37 px
 * tall, so 0.02 px is ~0.1 % of a limb — far below anything §2 bar A's ≥90 %
 * silhouette IoU can see, and it survives zooming.
 */
export const TOLERANCE = 0.02;
/** Sub-milli-pixel. Keeps the emitted file small and byte-deterministic. */
export const DECIMALS = 3;

const round = (n: number): number => Number(n.toFixed(DECIMALS));
const hex = (c: number): string => `0x${c.toString(16).padStart(6, '0')}`;

/**
 * One paint operation as emitted source. SESSION16 R2 finding 1: paints are ONE
 * ordered array, because the SWF's own style-group order can put a stroke UNDER
 * a fill and `fills[] then strokes[]` cannot express that.
 */
function emitPaint(p: ShapeArt['paints'][number]): string {
  if (p.kind === 'fill') {
    const rings = p.rings
      .map((r) => `        { points: [${r.points.map(round).join(',')}], hole: ${String(r.hole)} },`)
      .join('\n');
    return `    {\n      kind: 'fill',\n      color: ${hex(p.color)},\n      rings: [\n${rings}\n      ],\n    },`;
  }
  const lines = p.polylines.map((q) => `        [${q.map(round).join(',')}],`).join('\n');
  return `    {\n      kind: 'stroke',\n      color: ${hex(p.color)},\n      width: ${String(p.width)},\n      polylines: [\n${lines}\n      ],\n    },`;
}

export function emit(art: ShapeArt): string {
  const paints = art.paints.map(emitPaint).join('\n');

  const fills = art.paints.filter((p) => p.kind === 'fill');
  const strokes = art.paints.filter((p) => p.kind === 'stroke');
  const rings = fills.flatMap((f) => f.rings);
  const nHoles = rings.filter((r) => r.hole).length;
  const nVerts = rings.reduce((m, r) => m + r.points.length / 2, 0);
  /**
   * The palette, written out so the header's loudest claim — "colours are
   * BYTE-EXACT" — is a checkable statement rather than an assertion
   * (SESSION16 R2 finding 5: counts alone accept a recoloured outline).
   */
  const palette = [
    `fills ${fills.length === 0 ? 'none' : fills.map((f) => hex(f.color)).join(' · ')}`,
    `strokes ${strokes.length === 0 ? 'none' : strokes.map((s) => `${hex(s.color)}@${String(s.width)}`).join(' · ')}`,
    // `|` separates the two groups and ` · ` separates members within a group,
    // so the line parses unambiguously — the ratchet gate reads it back.
  ].join('  |  ');

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
 *   ${String(art.paints.length)} paint op(s) in SWF paint order: ${String(fills.length)} solid fill(s), ${String(strokes.length)} stroke pass(es).
 *   ${String(rings.length)} ring(s) (${String(nHoles)} hole(s)), ${String(nVerts)} vertices.
 *   palette            : ${palette}
 *   Colours are BYTE-EXACT to the SWF's recorded RGB (SESSION15 §2 bar B).
 *   APPROXIMATED FILLS: none — this shape is 100 % flat solid colour, so
 *   SESSION15 D3 (mean-colour gradients) and D4 (bitmap fills) do not apply.
 *
 * ⚠️ PAINT ORDER IS LOAD-BEARING. \`paints\` is in the source SWF's own style-group
 * order, back to front, and a renderer MUST draw it in exactly that order. The
 * OG puts a 2.5 px black stroke UNDERNEATH the eight face fills of shape 2662,
 * so drawing all fills and then all strokes turns 26 % of that shape's ink black.
 *
 * Coordinates are shape-local px; (0,0) is the part's joint pivot.
 */
import type { ArtShape } from '../types';

export const SHAPE_${String(art.id)}: ArtShape = {
  id: ${String(art.id)},
  paints: [
${paints}
  ],
};
`;
}
