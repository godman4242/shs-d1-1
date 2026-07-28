/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE — TRACED FROM VIDEO, **NOT** EXTRACTED FROM THE PAYLOAD
 *   source characterId : 9014   (NOT an OG id — traced art is numbered >= 9000)
 *   garment / slot     : obi (waist sash) → slot 14
 *   source frame       : reference/frames/s19_trace/zFt_0061.png  (gitignored)
 *   source video       : zFtCaTO0_1M @ t = 590.0 s
 *   crop               : (808,764)-(836,790) video px; silhouette 26 x 24 video px
 *   outline traced by  : python3 scripts/art/traceGarment.py   (potrace 1.16, polygon mode `-a 0`)
 *   authored by        : python3 scripts/art/reauthorGarment.py   (SESSION22 A9.5 — OG grammar over the SESSION19 trace outline)
 *   source file        : reference/traced/9014.svg  (gitignored)
 *   converted by       : npx vite-node scripts/art/generate.ts -- 9014
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * ⚠️ INFERRED: PLACEMENT. The smallest garment traced, at 26 x 24 video px it is well
 *   inside SESSION19 P9's trustworthy band (>= 20 px), but only just, and
 *   its REAR extent is behind the gi skirt in every standing frame found.
 *
 * CONTENT
 *   3 paint op(s) in SWF paint order: 2 solid fill(s), 1 stroke pass(es).
 *   2 ring(s) (0 hole(s)), 32 vertices.
 *   palette            : fills 0xd0cdce · 0xcac7c6  |  strokes 0x000000@1
 *   Tones are the COMMITTED MEASURED TARGETS (sourceColour.ts p25 shadow /
 *   p75 base); kickoff D4 substitutes the SWF's own byte-exact colour where a
 *   target sits within 12 levels of one. INFERRED, never CONTRACT.
 *   APPROXIMATED FILLS: (authored) base fill = measured p75 (208,205,206) — D4's #dcd9d4 mapping is
 *   BORDERLINE at deltas (12,12,6) and was declined: the source shows a
 *   clear obi-vs-hakama step (medians 204 vs 220) and SWF-white would erase
 *   it; shadow fill = measured p25 (202,199,198) over the measured dark
 *   region (44.8 % of interior); ink contour = ONE stroke, width 1, on-ring
 *   (the obi is fully occluded by the gi body in the idle pose).
 *
 * ⚠️ PAINT ORDER IS LOAD-BEARING. `paints` is in the source SWF's own style-group
 * order, back to front, and a renderer MUST draw it in exactly that order. The
 * OG puts a 2.5 px black stroke UNDERNEATH the eight face fills of shape 2662,
 * so drawing all fills and then all strokes turns 26 % of that shape's ink black.
 *
 * Coordinates are shape-local px; (0,0) is the part's joint pivot.
 */
import type { ArtShape } from '../types';

export const SHAPE_9014: ArtShape = {
  id: 9014,
  paints: [
    {
      kind: 'fill',
      color: 0xd0cdce,
      rings: [
        { points: [-7.831,-7.125,-7.831,-1.792,-7.719,3.319,-6.942,3.431,-6.164,3.431,-5.942,2.986,-3.497,2.986,-3.275,3.431,2.281,3.431,2.503,2.986,3.058,2.986,3.725,2.875,3.725,-7.236,-4.164,-7.236,-4.386,-6.792,-5.942,-6.792,-6.164,-7.236,-7.719,-7.236], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0xcac7c6,
      rings: [
        { points: [-5.164,-3.125,-5.164,-2.347,-5.053,-1.569,-3.386,-1.458,-1.719,-1.458,-1.497,-1.014,0.058,-1.014,0.281,-0.569,0.836,-0.569,1.503,-0.681,1.503,-5.014,-4.053,-5.014,-4.719,-4.347,-4.719,-3.347], hole: false },
      ],
    },
    {
      kind: 'stroke',
      color: 0x000000,
      width: 1,
      polylines: [
        [-7.831,-7.125,-7.831,-1.792,-7.719,3.319,-6.942,3.431,-6.164,3.431,-5.942,2.986,-3.497,2.986,-3.275,3.431,2.281,3.431,2.503,2.986,3.058,2.986,3.725,2.875,3.725,-7.236,-4.164,-7.236,-4.386,-6.792,-5.942,-6.792,-6.164,-7.236,-7.719,-7.236,-7.831,-7.125],
      ],
    },
  ],
};
