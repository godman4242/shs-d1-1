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
 *   2 ring(s) (0 hole(s)), 121 vertices.
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
        { points: [5.31,-26.804,5.31,-26.36,3.977,-26.36,3.088,-26.804,2.643,-25.916,2.643,-25.471,1.755,-25.471,1.31,-25.471,-0.912,-24.138,-2.69,-23.249,-3.579,-23.249,-4.023,-23.693,-4.468,-22.804,-4.468,-21.916,-6.245,-21.027,-7.579,-20.138,-10.69,-18.36,-13.357,-17.027,-13.801,-16.582,-16.912,-14.804,-20.023,-13.471,-20.468,-12.138,-20.912,-11.249,-20.468,-10.36,-20.023,-9.027,-18.69,-8.138,-17.357,-7.693,-16.912,-7.249,-16.023,-6.804,-14.69,-6.804,-12.912,-7.249,-12.023,-7.693,-11.134,-8.138,-10.245,-8.582,-8.912,-9.027,-7.579,-9.027,-5.801,-9.027,-5.801,-8.138,-5.357,-7.249,-4.468,-7.249,-3.579,-7.249,-3.579,-6.804,-3.579,-6.36,-3.134,-6.36,-2.245,-6.36,-2.69,-7.693,-2.69,-9.027,-2.245,-9.027,-1.357,-9.027,-0.912,-8.138,-0.468,-7.693,-0.023,-7.693,0.421,-7.693,0.421,-8.582,0.421,-9.027,1.31,-9.027,2.199,-8.582,2.199,-7.249,2.199,-5.916,5.755,-5.916,9.31,-6.36,10.643,-6.804,12.421,-6.804,12.421,-7.249,12.421,-7.693,13.755,-7.693,15.088,-7.693,15.532,-7.249,15.977,-6.804,16.866,-7.249,17.755,-8.138,19.532,-8.138,21.31,-8.138,22.643,-7.249,23.532,-6.36,24.421,-6.804,25.31,-7.249,25.755,-7.249,26.643,-7.693,26.643,-9.027,26.643,-10.36,22.643,-13.916,19.088,-17.027,12.866,-21.471,7.088,-26.36,6.199,-26.804,5.31,-27.249], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0x8e6f38,
      rings: [
        { points: [1.755,-22.804,-0.468,-21.471,-4.912,-19.249,-8.912,-17.027,-11.134,-16.138,-13.357,-14.804,-16.023,-13.471,-18.245,-12.138,-18.245,-11.249,-18.245,-10.804,-14.69,-10.36,-11.134,-10.36,-4.023,-10.36,3.088,-9.916,3.532,-9.916,3.977,-9.471,5.755,-9.916,7.532,-10.36,9.31,-10.36,11.088,-10.36,16.866,-9.916,23.088,-9.916,23.088,-10.36,23.088,-11.249,20.421,-13.027,18.199,-15.249,16.421,-16.138,15.088,-17.471,12.866,-19.249,10.643,-21.027,8.421,-22.36,6.199,-24.138,4.866,-24.138,3.977,-24.138], hole: false },
      ],
    },
  ],
};
