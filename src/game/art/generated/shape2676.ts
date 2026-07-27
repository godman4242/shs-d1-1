/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE
 *   source characterId : 2676   (DefineShape in the OG payload)
 *   source file        : reference/extracted/shapes/2676.svg  (gitignored)
 *   extracted by       : FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -export shape \
 *                          reference/extracted/shapes reference/decrypted/shs3_payload_decoded.swf
 *   converted by       : npx vite-node scripts/art/generate.ts -- 2676
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * CONTENT
 *   2 paint op(s) in SWF paint order: 1 solid fill(s), 1 stroke pass(es).
 *   1 ring(s) (0 hole(s)), 49 vertices.
 *   palette            : fills 0xb78f6c  |  strokes 0x000000@2
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

export const SHAPE_2676: ArtShape = {
  id: 2676,
  paints: [
    {
      kind: 'fill',
      color: 0xb78f6c,
      rings: [
        { points: [2.95,-5,3,-5,4.5,-3.75,4.853,-3.315,5.162,-2.859,5.428,-2.384,5.65,-1.887,5.828,-1.371,5.962,-0.834,6.053,-0.277,6.1,0.3,6.128,1.431,6.063,2.475,5.903,3.431,5.65,4.3,5.05,5.45,4.605,5.923,4.094,6.341,3.517,6.704,2.875,7.013,2.167,7.266,1.394,7.466,0.555,7.61,-0.35,7.7,-1.273,7.741,-2.141,7.741,-2.954,7.698,-3.713,7.613,-4.416,7.485,-5.066,7.316,-5.66,7.104,-6.2,6.85,-6.693,6.548,-7.147,6.194,-7.562,5.786,-7.938,5.325,-8.274,4.811,-8.572,4.244,-8.83,3.623,-9.05,2.95,-9.264,2.113,-9.406,1.3,-9.477,0.512,-9.475,-0.25,-9.402,-0.988,-9.256,-1.7,-9.039,-2.387,-8.75,-3.05,-7.75,-5.8], hole: false },
      ],
    },
    {
      kind: 'stroke',
      color: 0x000000,
      width: 2,
      polylines: [
        [2.95,-5,-7.75,-5.8,-8.75,-3.05,-9.039,-2.387,-9.256,-1.7,-9.402,-0.988,-9.475,-0.25,-9.477,0.512,-9.406,1.3,-9.264,2.113,-9.05,2.95,-8.83,3.623,-8.572,4.244,-8.274,4.811,-7.938,5.325,-7.562,5.786,-7.147,6.194,-6.693,6.548,-6.2,6.85,-5.66,7.104,-5.066,7.316,-4.416,7.485,-3.713,7.613,-2.954,7.698,-2.141,7.741,-1.273,7.741,-0.35,7.7,0.555,7.61,1.394,7.466,2.167,7.266,2.875,7.013,3.517,6.704,4.094,6.341,4.605,5.923,5.05,5.45,5.65,4.3,5.903,3.431,6.063,2.475,6.128,1.431,6.1,0.3,6.053,-0.277,5.962,-0.834,5.828,-1.371,5.65,-1.887,5.428,-2.384,5.162,-2.859,4.853,-3.315,4.5,-3.75,3,-5],
      ],
    },
  ],
};
