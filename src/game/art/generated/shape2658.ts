/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE
 *   source characterId : 2658   (DefineShape in the OG payload)
 *   source file        : reference/extracted/shapes/2658.svg  (gitignored)
 *   extracted by       : FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -export shape \
 *                          reference/extracted/shapes reference/decrypted/shs3_payload_decoded.swf
 *   converted by       : npx vite-node scripts/art/generate.ts -- 2658
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * CONTENT
 *   3 paint op(s) in SWF paint order: 2 solid fill(s), 1 stroke pass(es).
 *   2 ring(s) (0 hole(s)), 73 vertices.
 *   palette            : fills 0xfeca98 · 0xb78f6c  |  strokes 0x000000@2
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

export const SHAPE_2658: ArtShape = {
  id: 2658,
  paints: [
    {
      kind: 'fill',
      color: 0xfeca98,
      rings: [
        { points: [4.35,0.95,4.49,3.012,4.584,5.075,4.634,7.137,4.637,9.2,4.596,11.262,4.509,13.325,4.377,15.387,4.2,17.45,3.83,17.837,3.472,18.172,3.124,18.455,2.788,18.688,2.462,18.868,2.147,18.997,1.843,19.074,1.55,19.1,0.641,19.059,-0.138,18.938,-0.784,18.734,-1.3,18.45,-0.6,17.65,-0.166,16.016,0.188,14.312,0.459,12.541,0.65,10.7,0.722,9.809,0.762,9.009,0.772,8.302,0.75,7.688,0.697,7.165,0.613,6.734,0.497,6.396,0.35,6.15,0.109,5.728,-0.063,5.163,-0.166,4.453,-0.2,3.6,-0.05,1.15,-0.3,0,3.4,0,4.35,0.15], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0xb78f6c,
      rings: [
        { points: [-0.3,0,-0.05,1.15,-0.2,3.6,-0.166,4.453,-0.063,5.163,0.109,5.728,0.35,6.15,0.497,6.396,0.613,6.734,0.697,7.165,0.75,7.688,0.772,8.302,0.762,9.009,0.722,9.809,0.65,10.7,0.459,12.541,0.188,14.312,-0.166,16.016,-0.6,17.65,-1.3,18.45,-1.85,17.5,-3.2,2.85,-3.354,2.713,-3.491,2.528,-3.61,2.295,-3.713,2.013,-3.798,1.682,-3.866,1.303,-3.916,0.876,-3.95,0.4,-3.9,0], hole: false },
      ],
    },
    {
      kind: 'stroke',
      color: 0x000000,
      width: 2,
      polylines: [
        [4.2,17.45,4.377,15.387,4.509,13.325,4.596,11.262,4.637,9.2,4.634,7.137,4.584,5.075,4.49,3.012,4.35,0.95],
        [-3.9,0,-3.95,0.4,-3.916,0.876,-3.866,1.303,-3.798,1.682,-3.713,2.013,-3.61,2.295,-3.491,2.528,-3.354,2.713,-3.2,2.85,-1.85,17.5],
      ],
    },
  ],
};
