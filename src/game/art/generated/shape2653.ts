/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE
 *   source characterId : 2653   (DefineShape in the OG payload)
 *   source file        : reference/extracted/shapes/2653.svg  (gitignored)
 *   extracted by       : FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -export shape \
 *                          reference/extracted/shapes reference/decrypted/shs3_payload_decoded.swf
 *   converted by       : npx vite-node scripts/art/generate.ts -- 2653
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * CONTENT
 *   5 paint op(s) in SWF paint order: 2 solid fill(s), 3 stroke pass(es).
 *   3 ring(s) (0 hole(s)), 84 vertices.
 *   palette            : fills 0x9e9a97 · 0xdcd9d4  |  strokes 0x000000@2 · 0x000000@2 · 0x000000@1
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

export const SHAPE_2653: ArtShape = {
  id: 2653,
  paints: [
    {
      kind: 'fill',
      color: 0x9e9a97,
      rings: [
        { points: [-6.6,-10.65,-6.6,-10.7,6.7,-9.8,7.05,-9.25,1.05,-9.05,-0.4,-8.35,-2.55,-7.15,-2.772,-6.928,-2.837,-6.713,-2.747,-6.503,-2.5,-6.3,-2.322,-6.191,-2.038,-6.063,-1.647,-5.916,-1.15,-5.75,2.4,-5.4,7.9,-4.9,7.9,-3.35,7.7,-2.25,7.453,-2.044,7.162,-1.875,6.828,-1.744,6.45,-1.65,3,-1.9,6.45,-1.65,7.05,-0.8,6.4,0.85,6.329,1.184,6.266,1.584,6.21,2.052,6.162,2.587,6.123,3.19,6.091,3.859,6.066,4.596,6.05,5.4,5.55,4.25,4.75,-0.45,3,-1.9,2.95,-1.9,-7.9,-2.75,-7.95,-2.8,-8.6,-6.4,-9.25,-8.4,-6.9,-10.4,-9.25,-8.4,-8.6,-6.4,-7.95,-2.8,-10.7,-0.75,-12.2,-1.75,-10.75,-5.4,-12.5,-6.75,-9.95,-10.3,-8.45,-10.2,-6.9,-10.4], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0xdcd9d4,
      rings: [
        { points: [7.9,-4.9,2.4,-5.4,-1.15,-5.75,-1.647,-5.916,-2.038,-6.063,-2.322,-6.191,-2.5,-6.3,-2.747,-6.503,-2.837,-6.713,-2.772,-6.928,-2.55,-7.15,-0.4,-8.35,1.05,-9.05,7.05,-9.25,7.422,-8.191,7.688,-7.112,7.847,-6.016], hole: false },
        { points: [6.05,5.4,6.066,4.596,6.091,3.859,6.123,3.19,6.162,2.587,6.21,2.052,6.266,1.584,6.329,1.184,6.4,0.85,7.05,-0.8,7.95,0.55,7.85,4.85,6.45,6.45], hole: false },
      ],
    },
    {
      kind: 'stroke',
      color: 0x000000,
      width: 2,
      polylines: [
        [7.05,-9.25,6.7,-9.8,-6.6,-10.7,-6.6,-10.65],
        [-7.95,-2.8,-7.9,-2.75,2.95,-1.9,3,-1.9,6.45,-1.65,6.828,-1.744,7.162,-1.875,7.453,-2.044,7.7,-2.25,7.9,-3.35,7.9,-4.9,7.847,-6.016,7.688,-7.112,7.422,-8.191,7.05,-9.25],
        [5.55,4.25,6.05,5.4,6.45,6.45,7.85,4.85,7.95,0.55,7.05,-0.8,6.45,-1.65],
        [-10.75,-5.4,-12.2,-1.75,-10.7,-0.75,-7.95,-2.8],
        [-6.9,-10.4,-8.45,-10.2,-9.95,-10.3,-12.5,-6.75,-10.75,-5.4],
      ],
    },
    {
      kind: 'stroke',
      color: 0x000000,
      width: 2,
      polylines: [
        [3,-1.9,4.75,-0.45,5.55,4.25],
      ],
    },
    {
      kind: 'stroke',
      color: 0x000000,
      width: 1,
      polylines: [
        [-6.6,-10.65,-6.9,-10.4,-9.25,-8.4,-8.6,-6.4,-7.95,-2.8],
        [-10.75,-5.4,-8.6,-6.4],
      ],
    },
  ],
};
