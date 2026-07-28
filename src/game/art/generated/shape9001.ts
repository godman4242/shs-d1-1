/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE — TRACED FROM VIDEO, **NOT** EXTRACTED FROM THE PAYLOAD
 *   source characterId : 9001   (NOT an OG id — traced art is numbered >= 9000)
 *   garment / slot     : gi sleeve, far arm → slot 1
 *   source frame       : reference/frames/s19_trace/zFt_0061.png  (gitignored)
 *   source video       : zFtCaTO0_1M @ t = 590.0 s
 *   crop               : (856,724)-(886,770) video px; silhouette 27 x 44 video px
 *   outline traced by  : python3 scripts/art/traceGarment.py   (potrace 1.16, polygon mode `-a 0`)
 *   authored by        : python3 scripts/art/reauthorGarment.py   (SESSION22 A9.2 — OG grammar over the SESSION19 trace outline)
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
 *   3 paint op(s) in SWF paint order: 2 solid fill(s), 1 stroke pass(es).
 *   2 ring(s) (0 hole(s)), 73 vertices.
 *   palette            : fills 0x696668 · 0x676466  |  strokes 0x000000@1
 *   Tones are the COMMITTED MEASURED TARGETS (sourceColour.ts p25 shadow /
 *   p75 base); kickoff D4 substitutes the SWF's own byte-exact colour where a
 *   target sits within 12 levels of one. INFERRED, never CONTRACT.
 *   APPROXIMATED FILLS: (authored) base fill = measured p75 (105,102,104); shadow fill = measured p25
 *   (103,100,102) - 2 levels apart, which IS the video's own spread (iqr
 *   2,2,2; the gi is near-flat in the source); ink contour = ONE stroke,
 *   width 1. Was a traced blob at 70.6 % ink (kickoff P2).
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
      color: 0x696668,
      rings: [
        { points: [-6.072,-5.589,-6.072,-0.922,-5.628,-0.7,-5.628,0.411,-5.183,0.633,-5.183,1.3,-4.739,1.522,-4.739,2.633,-4.295,2.856,-4.295,3.522,-3.85,3.744,-3.85,4.856,-3.406,5.078,-3.406,6.189,-2.961,6.411,-2.961,7.522,-2.517,7.744,-2.517,9.744,-2.072,9.967,-2.072,10.633,-1.628,10.856,-1.628,11.967,-1.183,12.189,-1.183,12.967,-1.072,13.744,0.928,13.856,3.039,13.856,4.594,12.3,4.594,11.744,5.039,11.522,5.039,10.856,5.483,10.633,5.483,9.967,5.928,9.744,5.928,5.967,5.483,5.744,5.483,5.078,5.039,4.856,5.039,3.856,3.705,2.522,3.705,1.967,3.261,1.744,3.261,1.189,1.039,-1.033,1.039,-1.589,0.594,-1.811,0.594,-2.478,-0.295,-3.256,-0.295,-3.811,-1.183,-4.589,-1.183,-5.033,-1.85,-5.7,-5.961,-5.7,-5.961,-5.589], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0x676466,
      rings: [
        { points: [0.15,4.633,0.15,6.633,0.594,6.856,0.594,8.856,1.039,9.078,1.039,9.856,1.15,10.633,2.372,10.633,2.372,9.967,2.817,9.744,2.817,8.633,3.261,8.411,3.261,6.744,2.817,6.744,2.483,6.633,2.372,5.633,2.372,4.522,0.261,4.522,0.261,4.633], hole: false },
      ],
    },
    {
      kind: 'stroke',
      color: 0x000000,
      width: 1,
      polylines: [
        [-6.072,-5.589,-6.072,-0.922,-5.628,-0.7,-5.628,0.411,-5.183,0.633,-5.183,1.3,-4.739,1.522,-4.739,2.633,-4.295,2.856,-4.295,3.522,-3.85,3.744,-3.85,4.856,-3.406,5.078,-3.406,6.189,-2.961,6.411,-2.961,7.522,-2.517,7.744,-2.517,9.744,-2.072,9.967,-2.072,10.633,-1.628,10.856,-1.628,11.967,-1.183,12.189,-1.183,12.967,-1.072,13.744,0.928,13.856,3.039,13.856,4.594,12.3,4.594,11.744,5.039,11.522,5.039,10.856,5.483,10.633,5.483,9.967,5.928,9.744,5.928,5.967,5.483,5.744,5.483,5.078,5.039,4.856,5.039,3.856,3.705,2.522,3.705,1.967,3.261,1.744,3.261,1.189,1.039,-1.033,1.039,-1.589,0.594,-1.811,0.594,-2.478,-0.295,-3.256,-0.295,-3.811,-1.183,-4.589,-1.183,-5.033,-1.85,-5.7,-5.961,-5.7,-5.961,-5.589,-6.072,-5.589],
      ],
    },
  ],
};
