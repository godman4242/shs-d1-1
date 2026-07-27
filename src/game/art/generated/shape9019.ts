/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE — TRACED FROM VIDEO, **NOT** EXTRACTED FROM THE PAYLOAD
 *   source characterId : 9019   (NOT an OG id — traced art is numbered >= 9000)
 *   garment / slot     : gi sleeve, near arm → slot 19
 *   source frame       : reference/frames/s19_trace/zFt_0061.png  (gitignored)
 *   source video       : zFtCaTO0_1M @ t = 590.0 s
 *   crop               : (826,704)-(878,792) video px; silhouette 50 x 86 video px
 *   traced by          : python3 scripts/art/traceGarment.py   (potrace 1.16, polygon mode `-a 0`)
 *   source file        : reference/traced/9019.svg  (gitignored)
 *   converted by       : npx vite-node scripts/art/generate.ts -- 9019
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * ⚠️ INFERRED: PLACEMENT. Anchored by its TOP to the upper arm's top rather than by
 *   centre: the sleeve hangs FROM the shoulder, and centring rides it down
 *   the forearm. A5.3 first mistook this region for the gi BODY and put it
 *   on slot 15, which is why the arm rendered bare over a vest-sized gi.
 *
 * CONTENT
 *   3 paint op(s) in SWF paint order: 3 solid fill(s), 0 stroke pass(es).
 *   3 ring(s) (0 hole(s)), 211 vertices.
 *   palette            : fills 0x000000 · 0x6a6669 · 0x6a6669  |  strokes none
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

export const SHAPE_9019: ArtShape = {
  id: 9019,
  paints: [
    {
      kind: 'fill',
      color: 0x000000,
      rings: [
        { points: [-11.183,-0.256,-11.183,7.967,-10.739,8.189,-10.739,10.189,-10.294,10.411,-10.294,11.967,-9.85,12.189,-9.85,15.967,-9.406,16.189,-9.406,17.3,-8.961,17.522,-8.961,20.411,-9.628,20.522,-10.183,20.522,-10.406,20.967,-11.072,20.967,-11.072,22.633,-10.294,22.744,-9.406,22.744,-9.406,29.744,-10.072,29.856,-10.628,29.856,-10.628,31.522,-9.85,31.633,-9.072,31.633,-8.85,31.189,-7.628,31.189,-7.628,31.856,-7.517,32.411,-5.406,32.411,-5.406,31.411,-5.295,30.3,-3.739,30.3,-3.517,30.744,-1.961,30.744,-1.739,31.189,-0.517,31.189,-0.517,31.856,-0.406,32.411,0.372,32.522,1.15,32.522,1.372,32.078,3.372,32.078,3.594,32.522,5.594,32.522,5.817,32.078,9.483,32.078,10.15,31.411,10.15,26.856,9.706,26.633,9.706,25.078,10.594,24.3,10.594,23.3,11.039,23.078,11.039,21.522,10.594,21.3,10.594,20.522,9.483,20.522,8.817,19.856,8.817,18.411,8.372,18.189,8.372,16.189,7.928,15.967,7.928,14.411,7.483,14.189,7.483,13.522,7.039,13.3,7.039,12.189,6.594,11.967,6.594,11.3,6.15,11.078,6.15,10.411,5.705,10.189,5.705,8.633,5.261,8.411,5.261,7.744,4.817,7.522,4.817,6.744,4.928,5.856,5.483,5.856,6.15,5.744,6.15,4.633,5.705,4.411,5.705,3.3,5.261,3.078,5.261,2.411,4.817,2.189,4.817,0.967,4.15,0.967,3.594,0.856,3.483,-1.478,3.483,-3.811,3.039,-4.033,3.039,-4.589,1.928,-5.7,0.483,-5.7,0.372,-5.033,0.372,-4.478,-0.183,-4.367,-0.739,-4.367,-1.406,-5.033,-1.406,-5.7,-3.517,-5.7,-3.739,-5.256,-5.295,-5.256,-5.517,-4.811,-7.406,-4.811,-8.183,-3.922,-8.739,-3.922,-9.85,-2.811,-9.85,-2.256,-10.294,-2.144,-10.628,-2.144,-10.739,-1.256,-10.739,-0.478], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0x6a6669,
      rings: [
        { points: [-8.961,0.3,-8.961,2.411,-8.85,4.411,-6.739,4.522,-4.517,4.522,-4.517,5.744,-4.072,5.967,-4.072,8.744,-4.739,9.411,-5.183,9.411,-5.85,10.078,-5.85,10.967,-6.517,11.633,-7.072,11.633,-7.183,13.522,-7.183,15.411,-6.295,16.3,-6.295,18.633,-6.739,18.856,-6.739,20.411,-7.183,20.633,-7.183,21.3,-7.628,21.522,-7.628,27.411,-6.961,28.078,-5.517,28.078,-5.295,28.522,-4.628,28.522,-4.406,28.967,-0.183,28.967,0.039,29.411,1.15,29.411,1.372,29.856,4.372,29.856,7.483,29.744,7.483,25.078,7.039,24.856,7.039,21.078,6.594,20.856,6.594,19.744,6.15,19.522,6.15,18.856,5.705,18.633,5.705,16.633,5.261,16.411,5.261,15.3,4.817,15.078,4.817,13.967,4.372,13.744,4.372,12.633,3.928,12.411,3.928,11.744,3.483,11.522,3.483,10.411,3.039,10.189,3.039,9.522,2.594,9.3,2.594,8.189,2.15,7.967,2.15,6.856,1.705,6.633,1.705,5.967,1.261,5.744,1.261,4.522,-0.406,4.522,-0.628,4.078,-1.183,4.078,-1.85,3.411,-1.85,2.856,-1.739,2.3,-0.961,2.3,-0.072,2.189,-0.072,-0.589,-0.961,-1.478,-0.961,-1.922,-1.628,-2.589,-6.517,-2.589,-7.295,-1.7,-7.961,-1.7,-8.072,-1.144,-8.072,-0.589], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0x6a6669,
      rings: [
        { points: [5.261,23.633,5.261,26.078,4.15,27.189,1.483,27.189,0.817,26.522,0.817,25.967,1.261,25.744,1.261,24.744,1.928,24.078,2.483,24.078,2.705,23.633,3.372,23.633,3.594,23.189,3.817,23.189,4.039,23.633], hole: false },
      ],
    },
  ],
};
