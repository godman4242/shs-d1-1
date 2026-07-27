/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE
 *   source characterId : 2667   (DefineShape in the OG payload)
 *   source file        : reference/extracted/shapes/2667.svg  (gitignored)
 *   extracted by       : FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -export shape \
 *                          reference/extracted/shapes reference/decrypted/shs3_payload_decoded.swf
 *   converted by       : npx vite-node scripts/art/generate.ts -- 2667
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * CONTENT
 *   3 paint op(s) in SWF paint order: 2 solid fill(s), 1 stroke pass(es).
 *   2 ring(s) (0 hole(s)), 81 vertices.
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

export const SHAPE_2667: ArtShape = {
  id: 2667,
  paints: [
    {
      kind: 'fill',
      color: 0xfeca98,
      rings: [
        { points: [-3.95,1.45,-3.798,0.75,-3.644,0.125,-3.486,-0.425,-3.325,-0.9,-3.161,-1.3,-2.994,-1.625,-2.823,-1.875,-2.65,-2.05,-2.294,-2.331,-1.925,-2.525,-1.544,-2.631,-1.15,-2.65,0,-2.45,1.25,-1.9,1.581,-1.756,1.875,-1.575,2.131,-1.356,2.35,-1.1,2.503,-0.866,2.688,-0.488,2.903,0.034,3.15,0.7,3.428,1.509,3.737,2.462,4.078,3.559,4.45,4.8,4.3,5.025,4.1,5.2,3.85,5.325,3.55,5.4,2.7,5.4,2.272,5.228,1.887,4.913,1.547,4.453,1.25,3.85,0.972,3.278,0.688,2.862,0.397,2.603,0.1,2.5,-0.8,2.65,-1.75,2.85,-2.5,2.35,-2.95,1.8,-3.087,1.703,-3.3,1.613,-3.587,1.528], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0xb78f6c,
      rings: [
        { points: [4.45,4.8,4.35,5.85,4.1,7,3.922,7.162,3.587,7.35,3.097,7.563,2.45,7.8,-0.1,8.1,-2.7,7.8,-4.2,7.25,-4.7,6.5,-4.85,4.8,-4.3,2.55,-3.95,1.45,-3.587,1.528,-3.3,1.613,-3.087,1.703,-2.95,1.8,-2.5,2.35,-1.75,2.85,-0.8,2.65,0.1,2.5,0.397,2.603,0.688,2.862,0.972,3.278,1.25,3.85,1.547,4.453,1.887,4.913,2.272,5.228,2.7,5.4,3.55,5.4,3.85,5.325,4.1,5.2,4.3,5.025], hole: false },
      ],
    },
    {
      kind: 'stroke',
      color: 0x000000,
      width: 2,
      polylines: [
        [-3.95,1.45,-3.798,0.75,-3.644,0.125,-3.486,-0.425,-3.325,-0.9,-3.161,-1.3,-2.994,-1.625,-2.823,-1.875,-2.65,-2.05,-2.294,-2.331,-1.925,-2.525,-1.544,-2.631,-1.15,-2.65,0,-2.45,1.25,-1.9,1.581,-1.756,1.875,-1.575,2.131,-1.356,2.35,-1.1,2.503,-0.866,2.688,-0.488,2.903,0.034,3.15,0.7,3.428,1.509,3.737,2.462,4.078,3.559,4.45,4.8,4.35,5.85,4.1,7,3.922,7.162,3.587,7.35,3.097,7.563,2.45,7.8,-0.1,8.1,-2.7,7.8,-4.2,7.25,-4.7,6.5,-4.85,4.8,-4.3,2.55,-3.95,1.45],
      ],
    },
  ],
};
