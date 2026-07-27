/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE — TRACED FROM VIDEO, **NOT** EXTRACTED FROM THE PAYLOAD
 *   source characterId : 9015   (NOT an OG id — traced art is numbered >= 9000)
 *   garment / slot     : gi body (grey torso panel) → slot 15
 *   source frame       : reference/frames/s19_trace/zFt_0061.png  (gitignored)
 *   source video       : zFtCaTO0_1M @ t = 590.0 s
 *   crop               : (822,702)-(880,794) video px; silhouette 53 x 89 video px
 *   traced by          : python3 scripts/art/traceGarment.py   (potrace 1.16, polygon mode `-a 0`)
 *   source file        : reference/traced/9015.svg  (gitignored)
 *   converted by       : npx vite-node scripts/art/generate.ts -- 9015
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * ⚠️ INFERRED: PLACEMENT, and THE PART CUT. The gi body and the near SLEEVE are the
 *   same grey (A5.1 F6) and are not divided by a closed outline everywhere,
 *   so this one region covers both and is assigned to slot 15 (torso). The
 *   arm slots 19/20 are NOT dressed, and they draw IN FRONT of 15, so a bare
 *   near arm still paints over this gi. Fixing that needs the sleeve cut,
 *   which this frame does not give.
 *
 * CONTENT
 *   3 paint op(s) in SWF paint order: 3 solid fill(s), 0 stroke pass(es).
 *   3 ring(s) (0 hole(s)), 226 vertices.
 *   palette            : fills 0x000000 · 0x6a6669 · 0x6a6669  |  strokes none
 *   Colours are SAMPLED FROM LOSSY VIDEO, not read from the SWF — INFERRED
 *   targets, never CONTRACT (SESSION19 §P7).
 *   APPROXIMATED FILLS: ONE flat fill at the interior mean; the gi is a single grey panel.
 *
 * ⚠️ PAINT ORDER IS LOAD-BEARING. `paints` is in the source SWF's own style-group
 * order, back to front, and a renderer MUST draw it in exactly that order. The
 * OG puts a 2.5 px black stroke UNDERNEATH the eight face fills of shape 2662,
 * so drawing all fills and then all strokes turns 26 % of that shape's ink black.
 *
 * Coordinates are shape-local px; (0,0) is the part's joint pivot.
 */
import type { ArtShape } from '../types';

export const SHAPE_9015: ArtShape = {
  id: 9015,
  paints: [
    {
      kind: 'fill',
      color: 0x000000,
      rings: [
        { points: [-11.448,-20.589,-11.448,-19.589,-11.336,-18.7,-11.003,-18.589,-10.559,-18.589,-10.559,-16.478,-10.114,-16.256,-10.114,-15.144,-9.67,-14.922,-9.67,-12.922,-9.225,-12.7,-9.225,-11.144,-8.781,-10.922,-8.781,-7.144,-8.336,-6.922,-8.336,-5.811,-7.892,-5.589,-7.892,-2.7,-8.559,-2.589,-9.114,-2.589,-9.336,-2.144,-10.003,-2.144,-10.003,-0.478,-9.225,-0.367,-8.336,-0.367,-8.336,6.633,-9.003,6.744,-9.559,6.744,-9.559,8.411,-8.781,8.522,-8.003,8.522,-7.781,8.078,-6.559,8.078,-6.559,8.744,-6.448,9.3,-4.336,9.3,-4.336,8.3,-4.225,7.189,-2.67,7.189,-2.448,7.633,-0.892,7.633,-0.67,8.078,0.552,8.078,0.552,9.189,0.664,10.189,2.33,10.189,2.33,9.633,2.441,8.967,4.552,8.967,4.552,9.633,5.219,10.3,5.997,10.3,6.775,10.189,6.775,9.633,6.886,8.967,10.552,8.967,11.219,8.3,11.219,3.744,10.775,3.522,10.775,1.967,11.664,1.189,11.664,0.189,12.108,-0.033,12.108,-1.589,11.664,-1.811,11.664,-2.589,10.552,-2.589,9.886,-3.256,9.886,-4.7,9.441,-4.922,9.441,-6.922,8.997,-7.144,8.997,-8.7,8.552,-8.922,8.552,-9.589,8.108,-9.811,8.108,-10.922,7.664,-11.144,7.664,-11.811,7.219,-12.033,7.219,-12.7,6.775,-12.922,6.775,-14.478,6.33,-14.7,6.33,-15.367,5.886,-15.589,5.886,-16.367,5.997,-17.256,6.552,-17.256,7.219,-17.367,7.219,-18.478,6.775,-18.7,6.775,-19.811,6.33,-20.033,6.33,-20.7,5.886,-20.922,5.886,-22.144,5.219,-22.144,4.664,-22.256,4.552,-24.589,4.552,-26.922,4.108,-27.144,4.108,-27.7,3.219,-28.589,3.219,-29.256,1.219,-29.256,0.997,-29.033,1.441,-28.589,1.441,-27.589,0.886,-27.478,0.33,-27.478,-0.336,-28.144,-0.336,-29.256,-1.892,-29.256,-2.67,-28.367,-4.225,-28.367,-4.448,-27.922,-6.336,-27.922,-7.114,-27.033,-7.67,-27.033,-8.781,-25.922,-8.781,-25.367,-9.225,-25.256,-9.559,-25.256,-9.67,-24.367,-9.67,-23.589,-10.114,-23.367,-10.114,-22.7,-10.559,-22.478,-10.559,-21.478], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0x6a6669,
      rings: [
        { points: [-7.892,-22.811,-7.892,-20.7,-7.781,-18.7,-5.67,-18.589,-3.448,-18.589,-3.448,-17.367,-3.003,-17.144,-3.003,-14.367,-3.67,-13.7,-4.114,-13.7,-4.781,-13.033,-4.781,-12.144,-5.448,-11.478,-6.003,-11.478,-6.114,-9.589,-6.114,-7.7,-5.225,-6.811,-5.225,-4.478,-5.67,-4.256,-5.67,-2.7,-6.114,-2.478,-6.114,-1.811,-6.559,-1.589,-6.559,4.3,-5.892,4.967,-4.448,4.967,-4.225,5.411,-3.559,5.411,-3.336,5.856,0.886,5.856,1.108,6.3,2.219,6.3,2.441,6.744,5.441,6.744,8.552,6.633,8.552,1.967,8.108,1.744,8.108,-2.033,7.664,-2.256,7.664,-3.367,7.219,-3.589,7.219,-4.256,6.775,-4.478,6.775,-6.478,6.33,-6.7,6.33,-7.811,5.886,-8.033,5.886,-9.144,5.441,-9.367,5.441,-10.478,4.997,-10.7,4.997,-11.367,4.552,-11.589,4.552,-12.7,4.108,-12.922,4.108,-13.589,3.664,-13.811,3.664,-14.922,3.219,-15.144,3.219,-16.256,2.775,-16.478,2.775,-17.144,2.33,-17.367,2.33,-18.589,0.664,-18.589,0.441,-19.033,-0.114,-19.033,-0.781,-19.7,-0.781,-20.256,-0.67,-20.811,0.108,-20.811,0.997,-20.922,0.997,-23.7,0.108,-24.589,0.108,-25.033,-0.559,-25.7,-5.448,-25.7,-6.225,-24.811,-6.892,-24.811,-7.003,-24.256,-7.003,-23.7], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0x6a6669,
      rings: [
        { points: [6.33,0.522,6.33,2.967,5.219,4.078,2.552,4.078,1.886,3.411,1.886,2.856,2.33,2.633,2.33,1.633,2.997,0.967,3.552,0.967,3.775,0.522,4.441,0.522,4.664,0.078,4.886,0.078,5.108,0.522], hole: false },
      ],
    },
  ],
};
