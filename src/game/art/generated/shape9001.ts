/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE — TRACED FROM VIDEO, **NOT** EXTRACTED FROM THE PAYLOAD
 *   source characterId : 9001   (NOT an OG id — traced art is numbered >= 9000)
 *   garment / slot     : gi sleeve, far arm → slot 1
 *   source frame       : reference/frames/s19_trace/zFt_0061.png  (gitignored)
 *   source video       : zFtCaTO0_1M @ t = 590.0 s
 *   crop               : (856,724)-(886,770) video px; silhouette 27 x 44 video px
 *   traced by          : python3 scripts/art/traceGarment.py   (potrace 1.16, polygon mode `-a 0`)
 *   source file        : reference/traced/9001.svg  (gitignored)
 *   converted by       : npx vite-node scripts/art/generate.ts -- 9001
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * ⚠️ INFERRED: PLACEMENT, and EXTENT. Only the far sleeve's outer lobe clears the body
 *   in this frame, so the traced shape is the visible part, not the whole
 *   sleeve. It draws BEHIND everything on the far side, so the shortfall is
 *   covered by the torso.
 *
 * CONTENT
 *   2 paint op(s) in SWF paint order: 2 solid fill(s), 0 stroke pass(es).
 *   2 ring(s) (0 hole(s)), 98 vertices.
 *   palette            : fills 0x000000 · 0x666367  |  strokes none
 *   Colours are SAMPLED FROM LOSSY VIDEO, not read from the SWF — INFERRED
 *   targets, never CONTRACT (SESSION19 §P7).
 *   APPROXIMATED FILLS: ONE flat fill at the interior mean; the sleeve is a single grey panel.
 *
 * ⚠️ PAINT ORDER IS LOAD-BEARING. `paints` is in the source SWF's own style-group
 * order, back to front, and a renderer MUST draw it in exactly that order. The
 * OG puts a 2.5 px black stroke UNDERNEATH the eight face fills of shape 2662,
 * so drawing all fills and then all strokes turns 26 % of that shape's ink black.
 *
 * Coordinates are shape-local px; (0,0) is the part's joint pivot.
 */
import type { ArtShape } from '../types';

export const SHAPE_9001: ArtShape = {
  id: 9001,
  paints: [
    {
      kind: 'fill',
      color: 0x000000,
      rings: [
        { points: [-6.072,-5.589,-6.072,-0.922,-5.628,-0.7,-5.628,0.411,-5.183,0.633,-5.183,1.3,-4.739,1.522,-4.739,2.633,-4.295,2.856,-4.295,3.522,-3.85,3.744,-3.85,4.856,-3.406,5.078,-3.406,6.189,-2.961,6.411,-2.961,7.522,-2.517,7.744,-2.517,9.744,-2.072,9.967,-2.072,10.633,-1.628,10.856,-1.628,11.967,-1.183,12.189,-1.183,12.967,-1.072,13.744,0.928,13.856,3.039,13.856,4.594,12.3,4.594,11.744,5.039,11.522,5.039,10.856,5.483,10.633,5.483,9.967,5.928,9.744,5.928,5.967,5.483,5.744,5.483,5.078,5.039,4.856,5.039,3.856,3.705,2.522,3.705,1.967,3.261,1.744,3.261,1.189,1.039,-1.033,1.039,-1.589,0.594,-1.811,0.594,-2.478,-0.295,-3.256,-0.295,-3.811,-1.183,-4.589,-1.183,-5.033,-1.85,-5.7,-5.961,-5.7,-5.961,-5.589], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0x666367,
      rings: [
        { points: [-3.406,-2.922,-3.406,-1.367,-2.961,-1.144,-2.961,-0.478,-2.517,-0.256,-2.517,1.3,-2.072,1.522,-2.072,2.189,-1.628,2.411,-1.628,3.078,-1.183,3.3,-1.183,4.411,-0.739,4.633,-0.739,5.3,-0.295,5.522,-0.295,7.078,0.15,7.3,0.15,9.3,0.594,9.522,0.594,10.967,1.261,11.633,2.15,11.633,2.817,10.967,2.817,10.411,3.261,10.189,3.261,9.078,3.705,8.856,3.705,6.411,3.261,6.189,3.261,5.522,2.817,5.3,2.817,4.3,1.483,2.967,1.483,2.411,0.594,1.633,0.594,1.189,-0.739,-0.144,-0.739,-0.7,-1.183,-0.922,-1.183,-1.478,-2.072,-2.367,-2.072,-3.033,-3.295,-3.033,-3.295,-2.922], hole: false },
      ],
    },
  ],
};
