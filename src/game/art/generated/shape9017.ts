/**
 * GENERATED — DO NOT EDIT. Regenerate with the command below.
 *
 * PROVENANCE — TRACED FROM VIDEO, **NOT** EXTRACTED FROM THE PAYLOAD
 *   source characterId : 9017   (NOT an OG id — traced art is numbered >= 9000)
 *   garment / slot     : kasa (conical straw hat) → slot 17
 *   source frame       : reference/frames/s19_trace/zFt_0061.png  (gitignored)
 *   source video       : zFtCaTO0_1M @ t = 590.0 s
 *   crop               : (762,638)-(900,702) video px; silhouette 107 x 48 video px
 *   traced by          : python3 scripts/art/traceGarment.py   (potrace 1.16, polygon mode `-a 0`)
 *   source file        : reference/traced/9017.svg  (gitignored)
 *   converted by       : npx vite-node scripts/art/generate.ts -- 9017
 *   flatten tolerance  : 0.02 px   ·   coordinates rounded to 3 dp
 *   licence            : owner-attested Lut Games grant — docs/OWNER_PERMISSION_RULING.md
 *
 * ⚠️ INFERRED: PLACEMENT ONLY. The traced OUTLINE is measured; where it sits on the
 *   head is not. Slot 17 is aliased to slot 16, so (0,0) must be the head
 *   joint pivot — and the frame cannot register it, because that fighter
 *   wears different head art (its hair mass measures 20.4x24.0 world px
 *   against our shape 2670 at 14.2x15.0) and stands in a different pose. So
 *   the kasa is centred on OUR head+hair union and its brim set 40 % down
 *   that head, the one ratio the frame does give. Veto = any evidence of the
 *   OG's own hat pivot.
 *
 * CONTENT
 *   2 paint op(s) in SWF paint order: 2 solid fill(s), 0 stroke pass(es).
 *   2 ring(s) (0 hole(s)), 224 vertices.
 *   palette            : fills 0x000000 · 0x8e6f38  |  strokes none
 *   Colours are SAMPLED FROM LOSSY VIDEO, not read from the SWF — INFERRED
 *   targets, never CONTRACT (SESSION19 §P7).
 *   APPROXIMATED FILLS: the straw interior is emitted as ONE flat fill at the interior MEAN.
 *   After a 5x5 median the modal colour still holds only 1.3 % of the
 *   interior, so at this resolution the hat is NOT one flat colour —
 *   two-tone shading and the woven texture streaks are flattened away.
 *
 * ⚠️ PAINT ORDER IS LOAD-BEARING. `paints` is in the source SWF's own style-group
 * order, back to front, and a renderer MUST draw it in exactly that order. The
 * OG puts a 2.5 px black stroke UNDERNEATH the eight face fills of shape 2662,
 * so drawing all fills and then all strokes turns 26 % of that shape's ink black.
 *
 * Coordinates are shape-local px; (0,0) is the part's joint pivot.
 */
import type { ArtShape } from '../types';

export const SHAPE_9017: ArtShape = {
  id: 9017,
  paints: [
    {
      kind: 'fill',
      color: 0x000000,
      rings: [
        { points: [-20.912,-8.346,-20.912,-6.901,-20.468,-6.679,-20.468,-5.679,-19.801,-5.012,-19.245,-5.012,-18.468,-4.123,-17.023,-4.123,-16.245,-3.234,-14.801,-3.234,-14.579,-3.679,-12.579,-3.679,-11.801,-4.568,-10.357,-4.568,-10.134,-5.012,-9.468,-5.012,-9.245,-5.457,-5.801,-5.457,-5.801,-4.346,-5.134,-3.679,-3.579,-3.679,-3.579,-3.234,-3.468,-2.901,-2.245,-2.901,-2.245,-3.568,-2.69,-3.79,-2.69,-4.568,-2.579,-5.457,-1.579,-5.457,-0.245,-4.123,0.088,-4.123,0.421,-4.234,0.421,-4.79,0.532,-5.457,1.532,-5.457,2.199,-4.79,2.199,-3.568,2.31,-2.457,5.31,-2.346,8.31,-2.346,8.532,-2.79,9.643,-2.79,9.866,-3.234,11.088,-3.234,12.421,-3.346,12.421,-3.679,12.532,-4.123,14.866,-4.123,15.755,-3.234,16.199,-3.234,17.532,-4.568,21.532,-4.568,23.31,-2.79,23.866,-2.79,24.643,-3.679,25.977,-3.679,26.643,-4.346,26.643,-6.568,23.31,-9.901,22.866,-9.901,20.643,-12.123,20.199,-12.123,17.977,-14.346,17.532,-14.346,16.199,-15.679,15.755,-15.679,13.977,-17.457,13.532,-17.457,12.199,-18.79,11.755,-18.79,10.977,-19.679,10.421,-19.679,8.643,-21.457,8.199,-21.457,6.421,-23.234,5.866,-23.234,5.643,-23.679,5.421,-23.679,5.421,-23.568,5.31,-23.457,5.31,-22.901,4.532,-22.79,3.755,-22.79,3.31,-23.234,2.643,-22.568,2.643,-22.012,1.755,-21.901,0.977,-21.901,0.755,-21.457,0.199,-21.457,-0.579,-20.568,-1.245,-20.568,-1.468,-20.123,-2.134,-20.123,-2.357,-19.679,-3.468,-19.679,-3.579,-19.901,-3.801,-20.123,-3.912,-20.123,-4.023,-20.012,-4.023,-19.346,-4.468,-19.123,-4.468,-18.012,-5.134,-17.901,-5.69,-17.901,-5.912,-17.457,-6.579,-17.457,-6.801,-17.012,-7.357,-17.012,-8.134,-16.123,-8.69,-16.123,-9.468,-15.234,-10.468,-15.234,-11.245,-14.346,-11.912,-14.346,-12.134,-13.901,-12.801,-13.901,-13.023,-13.457,-13.69,-13.457,-13.801,-13.012,-13.801,-12.679,-14.468,-12.568,-15.023,-12.568,-15.245,-12.123,-15.912,-12.123,-16.134,-11.679,-16.69,-11.679,-17.468,-10.79,-18.468,-10.79,-19.357,-9.901,-19.912,-9.901,-20.023,-9.568,-20.023,-9.234], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0x8e6f38,
      rings: [
        { points: [-18.134,-8.568,-18.134,-7.346,-16.468,-7.234,-14.801,-7.234,-14.579,-6.79,-11.69,-6.79,-11.468,-6.346,-9.912,-6.346,-9.69,-6.79,-4.579,-6.79,-4.357,-6.346,-3.245,-6.346,-3.023,-6.79,-1.468,-6.79,-1.245,-6.346,0.31,-6.346,0.643,-6.901,0.977,-6.346,3.421,-6.346,3.643,-5.901,4.755,-5.901,4.977,-6.346,6.088,-6.346,6.31,-6.79,6.977,-6.79,7.31,-7.346,7.643,-6.79,16.755,-6.79,16.977,-6.346,19.977,-6.346,23.088,-6.457,23.088,-7.457,21.532,-9.012,21.088,-9.012,20.31,-9.901,19.755,-9.901,17.532,-12.123,16.977,-12.123,16.755,-12.568,16.199,-12.568,13.532,-15.234,13.088,-15.234,12.31,-16.123,11.755,-16.123,10.421,-17.457,9.977,-17.457,9.199,-18.346,8.643,-18.346,6.866,-20.123,6.31,-20.123,6.088,-20.568,3.643,-20.568,3.421,-20.123,2.755,-20.123,2.532,-19.679,1.977,-19.679,1.199,-18.79,0.199,-18.79,-0.579,-17.901,-1.245,-17.901,-1.468,-17.457,-2.134,-17.457,-2.357,-17.012,-3.023,-17.012,-3.245,-16.568,-3.912,-16.568,-4.134,-16.123,-4.801,-16.123,-5.023,-15.679,-5.69,-15.679,-5.912,-15.234,-6.468,-15.234,-7.245,-14.346,-7.912,-14.346,-8.134,-13.901,-8.801,-13.901,-9.023,-13.457,-9.579,-13.457,-10.357,-12.568,-11.357,-12.568,-12.134,-11.679,-12.801,-11.679,-13.023,-11.234,-13.69,-11.234,-13.912,-10.79,-14.579,-10.79,-14.801,-10.346,-15.357,-10.346,-16.134,-9.457,-16.69,-9.457,-17.579,-8.568], hole: false },
      ],
    },
  ],
};
