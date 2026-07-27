/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE
 *   source characterId : 2674   (DefineShape in the OG payload)
 *   source file        : reference/extracted/shapes/2674.svg  (gitignored)
 *   extracted by       : FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -export shape \
 *                          reference/extracted/shapes reference/decrypted/shs3_payload_decoded.swf
 *   converted by       : npx vite-node scripts/art/generate.ts -- 2674
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * CONTENT
 *   2 paint op(s) in SWF paint order: 1 solid fill(s), 1 stroke pass(es).
 *   1 ring(s) (0 hole(s)), 29 vertices.
 *   palette            : fills 0xfeca98  |  strokes 0x000000@2
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

export const SHAPE_2674: ArtShape = {
  id: 2674,
  paints: [
    {
      kind: 'fill',
      color: 0xfeca98,
      rings: [
        { points: [3.15,-1.9,5.15,-0.75,11.55,1.5,10.65,4.2,-3.75,4,-3.943,3.764,-4.097,3.481,-4.212,3.152,-4.287,2.775,-4.324,2.352,-4.322,1.881,-4.28,1.364,-4.2,0.8,-4.102,0.408,-3.956,0.031,-3.764,-0.33,-3.525,-0.675,-3.239,-1.005,-2.906,-1.319,-2.527,-1.617,-2.1,-1.9,-0.35,-2.65,-0.033,-2.715,0.319,-2.734,0.705,-2.709,1.125,-2.638,1.58,-2.521,2.069,-2.359,2.592,-2.152], hole: false },
      ],
    },
    {
      kind: 'stroke',
      color: 0x000000,
      width: 2,
      polylines: [
        [3.15,-1.9,2.592,-2.152,2.069,-2.359,1.58,-2.521,1.125,-2.638,0.705,-2.709,0.319,-2.734,-0.033,-2.715,-0.35,-2.65,-2.1,-1.9,-2.527,-1.617,-2.906,-1.319,-3.239,-1.005,-3.525,-0.675,-3.764,-0.33,-3.956,0.031,-4.102,0.408,-4.2,0.8,-4.28,1.364,-4.322,1.881,-4.324,2.352,-4.287,2.775,-4.212,3.152,-4.097,3.481,-3.943,3.764,-3.75,4,10.65,4.2,11.55,1.5,5.15,-0.75,3.15,-1.9],
      ],
    },
  ],
};
