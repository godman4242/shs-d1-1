/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE — TRACED FROM VIDEO, **NOT** EXTRACTED FROM THE PAYLOAD
 *   source characterId : 9012   (NOT an OG id — traced art is numbered >= 9000)
 *   garment / slot     : collar / juban (the gi under-collar) → slot 12
 *   source frame       : reference/frames/s19_trace/zFt_0061.png  (gitignored)
 *   source video       : zFtCaTO0_1M @ t = 590.0 s
 *   crop               : (806,688)-(858,742) video px; silhouette 48 x 52 video px
 *   traced by          : python3 scripts/art/traceGarment.py   (potrace 1.16, polygon mode `-a 0`)
 *   source file        : reference/traced/9012.svg  (gitignored)
 *   converted by       : npx vite-node scripts/art/generate.ts -- 9012
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * ⚠️ INFERRED: PLACEMENT, and the EXTENT. The region enclosed by ink here holds the
 *   white collar AND the dark hair beside it, which share a boundary, so the
 *   traced silhouette is wider than the collar alone. It replaces slot 12
 *   (neck), which every other part draws in front of, so the surplus is
 *   covered. Veto = a frame where collar and hair are separately outlined.
 *
 * CONTENT
 *   2 paint op(s) in SWF paint order: 2 solid fill(s), 0 stroke pass(es).
 *   2 ring(s) (0 hole(s)), 149 vertices.
 *   palette            : fills 0x000000 · 0xb6b4b6  |  strokes none
 *   Colours are SAMPLED FROM LOSSY VIDEO, not read from the SWF — INFERRED
 *   targets, never CONTRACT (SESSION19 §P7).
 *   APPROXIMATED FILLS: ONE flat fill at the interior mean. The collar reads as a single light
 *   panel at this resolution.
 *
 * ⚠️ PAINT ORDER IS LOAD-BEARING. `paints` is in the source SWF's own style-group
 * order, back to front, and a renderer MUST draw it in exactly that order. The
 * OG puts a 2.5 px black stroke UNDERNEATH the eight face fills of shape 2662,
 * so drawing all fills and then all strokes turns 26 % of that shape's ink black.
 *
 * Coordinates are shape-local px; (0,0) is the part's joint pivot.
 */
import type { ArtShape } from '../types';

export const SHAPE_9012: ArtShape = {
  id: 9012,
  paints: [
    {
      kind: 'fill',
      color: 0x000000,
      rings: [
        { points: [-9.269,6.436,-9.269,7.214,-9.158,7.992,-8.492,8.103,-7.714,8.103,-7.047,7.436,-7.047,6.992,-5.936,5.881,-5.603,5.881,-5.269,5.769,-5.269,5.214,-3.047,2.992,-3.047,2.658,-2.936,2.325,-1.714,2.325,-1.714,3.436,-1.603,4.436,0.953,4.436,0.953,3.881,1.842,2.992,1.842,2.325,1.397,2.325,1.064,2.214,0.953,0.214,0.953,-1.897,1.842,-2.786,1.842,-3.342,1.953,-3.897,2.508,-3.897,3.397,-4.786,8.397,-4.786,9.175,-3.897,9.619,-3.897,10.731,-5.008,10.731,-5.564,10.842,-6.119,11.397,-6.119,12.064,-6.231,12.064,-8.231,11.619,-8.453,11.619,-9.119,11.175,-9.342,11.175,-10.008,10.731,-10.231,10.731,-11.342,9.842,-12.119,9.842,-12.675,9.397,-12.897,9.397,-13.453,9.508,-14.119,10.064,-14.119,10.731,-14.231,10.731,-15.008,2.064,-15.008,1.286,-14.119,0.731,-14.119,-0.381,-13.008,-0.381,-12.453,-0.269,-12.008,0.064,-11.897,0.508,-11.897,0.508,-10.786,-1.714,-8.564,-1.714,-8.119,-2.603,-7.231,-2.603,-6.675,-3.825,-6.675,-3.936,-7.231,-3.936,-7.897,-5.158,-7.897,-5.269,-7.342,-5.269,-6.786,-6.158,-5.897,-6.158,-5.342,-6.603,-5.008,-6.158,-4.675,-6.158,-3.119,-6.603,-2.897,-6.603,-2.231,-7.047,-2.008,-7.047,-0.897,-7.492,-0.675,-7.492,0.436,-7.936,0.658,-7.936,2.214,-8.381,2.436,-8.381,3.992,-8.825,4.214,-8.825,6.214], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0xb6b4b6,
      rings: [
        { points: [-6.603,2.436,-6.603,3.436,-6.492,4.436,-6.047,4.547,-5.492,4.547,-4.381,3.436,-4.381,2.992,-3.047,1.658,-3.047,1.103,-2.603,0.881,-2.603,0.214,-1.714,-0.564,-1.714,-1.564,-1.269,-1.786,-1.269,-2.453,-0.825,-2.675,-0.825,-3.453,-0.714,-4.342,-0.381,-4.342,0.064,-4.453,0.064,-5.008,1.175,-6.119,1.731,-6.119,2.508,-7.008,4.397,-7.008,4.619,-7.453,6.175,-7.453,6.953,-8.342,7.842,-8.342,8.508,-9.008,8.508,-10.119,7.842,-10.119,7.286,-10.231,7.175,-11.008,7.175,-11.897,6.064,-11.897,4.842,-10.564,4.286,-10.564,2.953,-9.231,2.508,-9.231,1.731,-8.342,1.175,-8.342,-1.269,-5.897,-1.269,-4.453,-1.936,-4.342,-2.492,-4.342,-2.714,-3.897,-3.381,-3.897,-3.492,-3.119,-3.492,-2.342,-3.047,-1.897,-3.047,-1.786,-3.158,-1.675,-4.603,-1.675,-5.269,-1.008,-5.269,-0.453,-5.714,-0.231,-5.714,0.436,-6.158,0.658,-6.158,2.214], hole: false },
      ],
    },
  ],
};
