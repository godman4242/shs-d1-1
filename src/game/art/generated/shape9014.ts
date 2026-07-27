/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE — TRACED FROM VIDEO, **NOT** EXTRACTED FROM THE PAYLOAD
 *   source characterId : 9014   (NOT an OG id — traced art is numbered >= 9000)
 *   garment / slot     : obi (waist sash) → slot 14
 *   source frame       : reference/frames/s19_trace/zFt_0061.png  (gitignored)
 *   source video       : zFtCaTO0_1M @ t = 590.0 s
 *   crop               : (808,764)-(836,790) video px; silhouette 26 x 24 video px
 *   traced by          : python3 scripts/art/traceGarment.py   (potrace 1.16, polygon mode `-a 0`)
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
 *   2 paint op(s) in SWF paint order: 2 solid fill(s), 0 stroke pass(es).
 *   2 ring(s) (0 hole(s)), 31 vertices.
 *   palette            : fills 0x000000 · 0xcdcacb  |  strokes none
 *   Colours are SAMPLED FROM LOSSY VIDEO, not read from the SWF — INFERRED
 *   targets, never CONTRACT (SESSION19 §P7).
 *   APPROXIMATED FILLS: ONE flat fill at the interior mean; the sash is a single light panel.
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
      color: 0x000000,
      rings: [
        { points: [-7.831,-7.125,-7.831,-1.792,-7.719,3.319,-6.942,3.431,-6.164,3.431,-5.942,2.986,-3.497,2.986,-3.275,3.431,2.281,3.431,2.503,2.986,3.058,2.986,3.725,2.875,3.725,-7.236,-4.164,-7.236,-4.386,-6.792,-5.942,-6.792,-6.164,-7.236,-7.719,-7.236], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0xcdcacb,
      rings: [
        { points: [-6.497,-0.014,-6.497,0.986,-5.831,1.653,-1.942,1.653,1.947,1.542,1.947,-5.458,-4.497,-5.458,-5.164,-4.792,-5.164,-3.792,-5.608,-3.569,-5.608,-2.458,-6.053,-2.236,-6.053,-0.236], hole: false },
      ],
    },
  ],
};
