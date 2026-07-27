/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE — TRACED FROM VIDEO, **NOT** EXTRACTED FROM THE PAYLOAD
 *   source characterId : 9011   (NOT an OG id — traced art is numbered >= 9000)
 *   garment / slot     : hakama leg (drawn at slots 11 AND 7) → slot 11
 *   source frame       : reference/frames/s19_trace/zFt_0061.png  (gitignored)
 *   source video       : zFtCaTO0_1M @ t = 590.0 s
 *   crop               : (789,778)-(860,894) video px; silhouette 63 x 113 video px
 *   traced by          : python3 scripts/art/traceGarment.py   (potrace 1.16, polygon mode `-a 0`)
 *   source file        : reference/traced/9011.svg  (gitignored)
 *   converted by       : npx vite-node scripts/art/generate.ts -- 9011
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * ⚠️ INFERRED: PLACEMENT, and it is DRAWN TWICE. Only the NEAR leg could be traced: the
 *   far leg is not bounded by ink on its right, because the outline there IS
 *   the scabbard, so the region leaks into the background. This shape is
 *   therefore drawn at slot 7 as well - which is what the OG does, drawing
 *   2678 at slots 7 and 11 and 2648 at 6 and 10. It covers the whole leg and
 *   sits on the CALF, not the thigh, because the calf draws in front of the
 *   thigh and the foot.
 *
 * CONTENT
 *   2 paint op(s) in SWF paint order: 2 solid fill(s), 0 stroke pass(es).
 *   2 ring(s) (0 hole(s)), 237 vertices.
 *   palette            : fills 0x000000 · 0xc8c3c5  |  strokes none
 *   Colours are SAMPLED FROM LOSSY VIDEO, not read from the SWF — INFERRED
 *   targets, never CONTRACT (SESSION19 §P7).
 *   APPROXIMATED FILLS: ONE flat fill at the interior mean. The hem dissolves into GRASS in the
 *   source (A5.1 crop 7), so the bottom few px of the outline follow the
 *   grass rather than the cloth.
 *
 * ⚠️ PAINT ORDER IS LOAD-BEARING. `paints` is in the source SWF's own style-group
 * order, back to front, and a renderer MUST draw it in exactly that order. The
 * OG puts a 2.5 px black stroke UNDERNEATH the eight face fills of shape 2662,
 * so drawing all fills and then all strokes turns 26 % of that shape's ink black.
 *
 * Coordinates are shape-local px; (0,0) is the part's joint pivot.
 */
import type { ArtShape } from '../types';

export const SHAPE_9011: ArtShape = {
  id: 9011,
  paints: [
    {
      kind: 'fill',
      color: 0x000000,
      rings: [
        { points: [-15.313,5.583,-15.313,20.806,-14.646,21.472,-12.202,21.472,-12.202,22.25,-11.757,22.472,-11.757,22.806,-11.646,23.139,-11.424,23.25,-11.091,23.25,-10.202,24.139,-3.313,24.139,-3.313,24.583,-3.202,24.917,-2.868,25.028,-2.535,25.028,-2.313,25.472,7.243,25.472,7.465,25.028,7.798,25.028,8.243,24.917,8.243,23.694,8.354,22.361,11.132,22.361,12.243,21.25,12.243,20.694,12.687,20.472,12.687,18.028,12.576,17.917,12.465,17.917,12.021,18.361,11.465,18.361,11.021,18.25,10.909,17.25,10.909,16.25,11.354,16.028,11.354,13.583,11.798,13.361,11.798,10.472,12.243,10.25,12.243,9.139,12.687,8.917,12.687,4.694,12.243,4.472,12.243,-11.861,10.132,-11.861,10.021,-11.306,10.021,-10.75,8.909,-9.639,7.465,-9.639,7.354,-8.75,7.354,-7.972,4.798,-7.972,4.687,-9.194,4.687,-10.528,2.576,-10.528,2.465,-10.083,2.465,-9.75,2.132,-9.75,2.021,-13.75,2.021,-17.861,0.687,-19.194,0.687,-19.972,0.798,-20.75,1.576,-20.75,2.465,-20.861,2.465,-22.528,-5.313,-22.528,-5.979,-23.194,-5.979,-24.194,-5.535,-24.528,-5.535,-24.639,-5.646,-24.75,-8.868,-24.75,-9.535,-24.083,-9.535,-23.083,-9.979,-22.861,-9.979,-21.306,-10.424,-21.083,-10.424,-19.861,-10.313,-18.639,-9.979,-18.528,-9.535,-18.528,-9.535,-17.306,-9.091,-17.083,-9.091,-16.083,-8.424,-15.417,-7.424,-15.417,-7.091,-15.972,-6.868,-15.639,-6.868,-15.083,-7.979,-14.972,-8.979,-14.972,-9.091,-14.306,-9.091,-13.75,-9.535,-13.528,-9.535,-11.083,-9.979,-10.861,-9.979,-9.75,-10.424,-9.528,-10.424,-8.861,-10.868,-8.639,-10.868,-7.528,-11.313,-7.306,-11.313,-3.528,-11.757,-3.306,-11.757,-1.75,-12.202,-1.528,-12.202,0.028,-12.646,0.25,-12.646,2.25,-12.202,2.472,-12.202,3.139,-12.646,3.361,-12.646,4.917,-12.979,4.917,-13.091,2.361,-13.091,-0.194,-12.646,-0.417,-12.646,-1.639,-14.313,-1.639,-14.424,0.139,-14.424,1.806,-14.868,2.028,-14.868,5.361], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0xc8c3c5,
      rings: [
        { points: [-11.757,9.139,-11.757,17.25,-11.091,17.917,-10.535,17.917,-9.979,17.806,-9.979,16.139,-9.868,14.361,-8.646,14.361,-8.646,18.694,-8.202,18.917,-8.202,19.25,-8.091,19.583,-7.868,19.694,-7.535,19.694,-6.646,20.583,-5.646,20.583,-4.646,20.472,-4.646,19.917,-3.979,19.25,-2.979,19.25,-2.757,18.806,-0.757,18.806,-0.535,18.361,0.243,18.361,0.243,19.917,0.354,21.361,0.687,21.472,1.021,21.472,1.243,21.917,3.687,21.917,3.909,21.472,4.243,21.472,4.687,21.361,4.687,18.139,4.909,17.917,5.798,18.806,7.576,18.806,8.687,17.694,8.687,17.139,9.132,16.917,9.132,14.917,9.576,14.694,9.576,14.028,10.021,13.806,10.021,11.361,10.465,11.139,10.465,9.139,10.909,8.917,10.909,7.806,11.354,7.583,11.354,5.583,10.909,5.361,10.909,2.028,10.021,1.25,10.021,0.694,10.465,0.472,10.465,-7.639,9.798,-8.306,7.465,-8.306,7.243,-7.861,6.021,-7.861,4.798,-7.972,4.687,-8.306,4.687,-8.75,3.909,-8.75,3.687,-9.194,3.021,-9.194,2.798,-9.639,2.243,-9.639,0.687,-11.194,0.687,-13.528,1.132,-13.75,1.132,-14.417,1.576,-14.639,1.576,-15.306,2.021,-15.528,2.021,-17.194,1.243,-17.194,1.021,-17.639,0.465,-17.639,-0.313,-18.528,-0.868,-18.528,-1.535,-19.194,-1.535,-19.639,-3.091,-21.194,-5.313,-21.194,-5.979,-20.528,-5.979,-19.528,-6.424,-19.306,-6.424,-17.75,-6.868,-17.528,-6.868,-15.083,-7.313,-14.861,-7.313,-13.75,-7.757,-13.528,-7.757,-11.528,-8.202,-11.306,-8.202,-8.861,-8.646,-8.639,-8.646,-7.528,-9.091,-7.306,-9.091,-5.75,-9.535,-5.528,-9.535,-3.083,-9.979,-2.861,-9.979,-1.75,-10.424,-1.528,-10.424,0.917,-10.868,1.139,-10.868,5.361,-11.313,5.583,-11.313,8.917], hole: false },
      ],
    },
  ],
};
