/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE
 *   source characterId : 2678   (DefineShape in the OG payload)
 *   source file        : reference/extracted/shapes/2678.svg  (gitignored)
 *   extracted by       : FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -export shape \
 *                          reference/extracted/shapes reference/decrypted/shs3_payload_decoded.swf
 *   converted by       : npx vite-node scripts/art/generate.ts -- 2678
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * CONTENT
 *   4 paint op(s) in SWF paint order: 2 solid fill(s), 2 stroke pass(es).
 *   2 ring(s) (0 hole(s)), 72 vertices.
 *   palette            : fills 0xfeca98 · 0xb78f6c  |  strokes 0x000000@1 · 0x000000@2
 *   Colours are BYTE-EXACT to the SWF's recorded RGB (SESSION15 §2 bar B).
 *   APPROXIMATED FILLS: none — this shape is 100 % flat solid colour, so
 *   SESSION15 D3 (mean-colour gradients) and D4 (bitmap fills) do not apply.
 *
 * ⚠️ PAINT ORDER IS LOAD-BEARING. `paints` is in the source SWF's own style-group
 * order, back to front, and a renderer MUST draw it in exactly that order. The
 * OG puts a 2.5 px black stroke UNDERNEATH the eight face fills of shape 2662,
 * so drawing all fills and then all strokes turns 26 % of that shape's ink black.
 *
 * Coordinates are shape-local px; (0,0) is the part's joint pivot.
 */
import type { ArtShape } from '../types';

export const SHAPE_2678: ArtShape = {
  id: 2678,
  paints: [
    {
      kind: 'fill',
      color: 0xfeca98,
      rings: [
        { points: [3.1,4.05,3.1,4.1,1.65,11.75,1.65,16.1,-2.1,16.35,-2.09,15.239,-2.084,14.256,-2.084,13.402,-2.087,12.675,-2.096,12.077,-2.109,11.606,-2.127,11.264,-2.15,11.05,-2.231,10.659,-2.375,10.288,-2.581,9.934,-2.85,9.6,-3.75,8.15,-3.791,7.859,-3.791,7.459,-3.748,6.952,-3.663,6.338,-3.535,5.615,-3.366,4.784,-3.154,3.846,-2.9,2.8,-2.15,0.05,4.05,0.05,4.08,0.533,4.069,1.006,4.017,1.47,3.925,1.925,3.792,2.37,3.619,2.806,3.405,3.233,3.15,3.65], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0xb78f6c,
      rings: [
        { points: [-2.15,0.05,-2.9,2.8,-3.154,3.846,-3.366,4.784,-3.535,5.615,-3.663,6.338,-3.748,6.952,-3.791,7.459,-3.791,7.859,-3.75,8.15,-2.85,9.6,-2.581,9.934,-2.375,10.288,-2.231,10.659,-2.15,11.05,-2.127,11.264,-2.109,11.606,-2.096,12.077,-2.087,12.675,-2.084,13.402,-2.084,14.256,-2.09,15.239,-2.1,16.35,-4.65,17,-5.45,11.85,-5.805,11.359,-6.119,10.887,-6.392,10.434,-6.625,10,-6.817,9.584,-6.969,9.188,-7.08,8.809,-7.15,8.45,-7.1,5.95,-6.45,3.35,-5.2,0.05], hole: false },
      ],
    },
    {
      kind: 'stroke',
      color: 0x000000,
      width: 1,
      polylines: [
        [3.1,4.1,3.1,4.05],
        [3.1,4.1,0.8,3.8,0.15,3.15],
      ],
    },
    {
      kind: 'stroke',
      color: 0x000000,
      width: 2,
      polylines: [
        [3.1,4.05,3.15,3.65,3.405,3.233,3.619,2.806,3.792,2.37,3.925,1.925,4.017,1.47,4.069,1.006,4.08,0.533,4.05,0.05],
        [1.65,16.1,1.65,11.75,3.1,4.1],
        [-5.2,0.05,-6.45,3.35,-7.1,5.95,-7.15,8.45,-7.08,8.809,-6.969,9.188,-6.817,9.584,-6.625,10,-6.392,10.434,-6.119,10.887,-5.805,11.359,-5.45,11.85,-4.65,17],
      ],
    },
  ],
};
