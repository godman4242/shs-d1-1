/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE
 *   source characterId : 2655   (DefineShape in the OG payload)
 *   source file        : reference/extracted/shapes/2655.svg  (gitignored)
 *   extracted by       : FFDEC_MEMORY=12g reference/tools/ffdec/ffdec.sh -export shape \
 *                          reference/extracted/shapes reference/decrypted/shs3_payload_decoded.swf
 *   converted by       : npx vite-node scripts/art/generate.ts -- 2655
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * CONTENT
 *   2 paint op(s) in SWF paint order: 1 solid fill(s), 1 stroke pass(es).
 *   1 ring(s) (0 hole(s)), 6 vertices.
 *   palette            : fills 0xffcc99  |  strokes 0x000000@1.5
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

export const SHAPE_2655: ArtShape = {
  id: 2655,
  paints: [
    {
      kind: 'fill',
      color: 0xffcc99,
      rings: [
        { points: [6.35,3.7,4.2,4.35,-3,1.05,-4,-1.2,-0.15,-11.7,4.55,-10.8], hole: false },
      ],
    },
    {
      kind: 'stroke',
      color: 0x000000,
      width: 1.5,
      polylines: [
        [6.35,3.7,4.55,-10.8,-0.15,-11.7,-4,-1.2,-3,1.05,4.2,4.35,6.35,3.7],
      ],
    },
  ],
};
