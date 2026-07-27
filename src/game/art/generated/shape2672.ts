/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE
 *   source characterId : 2672   (DefineShape in the OG payload)
 *   source file        : reference/extracted/shapes/2672.svg  (gitignored)
 *   extracted by       : FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -export shape \
 *                          reference/extracted/shapes reference/decrypted/shs3_payload_decoded.swf
 *   converted by       : npx vite-node scripts/art/generate.ts -- 2672
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * CONTENT
 *   3 paint op(s) in SWF paint order: 3 solid fill(s), 0 stroke pass(es).
 *   5 ring(s) (0 hole(s)), 88 vertices.
 *   palette            : fills 0x000000 · 0xb78f6c · 0xfeca98  |  strokes none
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

export const SHAPE_2672: ArtShape = {
  id: 2672,
  paints: [
    {
      kind: 'fill',
      color: 0x000000,
      rings: [
        { points: [0.7,15.95,0.85,15.4,1.075,15.2,1.35,15.1,1.584,15.072,1.788,15.088,1.959,15.147,2.1,15.25,2.4,15.75,3.2,21.9,3.3,22.75,3.25,23.15,2.75,24.25,2,23.8,1.841,23.631,1.712,23.425,1.616,23.181,1.55,22.9,1.55,22.85], hole: false },
        { points: [-3.5,25.75,-3.854,25.467,-4.166,25.169,-4.435,24.855,-4.662,24.525,-4.848,24.18,-4.991,23.819,-5.091,23.442,-5.15,23.05,-5.6,16.55,-5.4,16,-5.319,15.906,-5.175,15.825,-4.969,15.756,-4.7,15.7,-4.413,15.725,-4.15,15.9,-3.9,16.4,-3.25,22.85,-3.45,25.45], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0xb78f6c,
      rings: [
        { points: [1.55,22.9,1.616,23.181,1.712,23.425,1.841,23.631,2,23.8,2.75,24.25,2.75,24.3,-0.05,23.9,-1.15,23.45,-3.45,25.45,-3.25,22.85,-3.9,16.4,-2.15,16.25,-2.15,17.05,-2.063,18.047,-1.85,18.988,-1.513,19.872,-1.05,20.7,-0.684,21.241,-0.287,21.712,0.141,22.116,0.6,22.45], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0xfeca98,
      rings: [
        { points: [0.7,15.95,1.55,22.85,1.55,22.9,0.6,22.45,0.141,22.116,-0.287,21.712,-0.684,21.241,-1.05,20.7,-1.513,19.872,-1.85,18.988,-2.063,18.047,-2.15,17.05,-2.15,16.25], hole: false },
        { points: [2.75,24.3,2.489,24.741,2.206,25.138,1.902,25.491,1.575,25.8,1.227,26.066,0.856,26.288,0.464,26.466,0.05,26.6,-2.2,26.3,-3.5,25.75,-3.45,25.45,-1.15,23.45,-0.05,23.9], hole: false },
      ],
    },
  ],
};
