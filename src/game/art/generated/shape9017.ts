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
        { points: [-20.912,-11.916,-20.912,-10.471,-20.468,-10.249,-20.468,-9.249,-19.801,-8.582,-19.245,-8.582,-18.468,-7.693,-17.023,-7.693,-16.245,-6.804,-14.801,-6.804,-14.579,-7.249,-12.579,-7.249,-11.801,-8.138,-10.357,-8.138,-10.134,-8.582,-9.468,-8.582,-9.245,-9.027,-5.801,-9.027,-5.801,-7.916,-5.134,-7.249,-3.579,-7.249,-3.579,-6.804,-3.468,-6.471,-2.245,-6.471,-2.245,-7.138,-2.69,-7.36,-2.69,-8.138,-2.579,-9.027,-1.579,-9.027,-0.245,-7.693,0.088,-7.693,0.421,-7.804,0.421,-8.36,0.532,-9.027,1.532,-9.027,2.199,-8.36,2.199,-7.138,2.31,-6.027,5.31,-5.916,8.31,-5.916,8.532,-6.36,9.643,-6.36,9.866,-6.804,11.088,-6.804,12.421,-6.916,12.421,-7.249,12.532,-7.693,14.866,-7.693,15.755,-6.804,16.199,-6.804,17.532,-8.138,21.532,-8.138,23.31,-6.36,23.866,-6.36,24.643,-7.249,25.977,-7.249,26.643,-7.916,26.643,-10.138,23.31,-13.471,22.866,-13.471,20.643,-15.693,20.199,-15.693,17.977,-17.916,17.532,-17.916,16.199,-19.249,15.755,-19.249,13.977,-21.027,13.532,-21.027,12.199,-22.36,11.755,-22.36,10.977,-23.249,10.421,-23.249,8.643,-25.027,8.199,-25.027,6.421,-26.804,5.866,-26.804,5.643,-27.249,5.421,-27.249,5.421,-27.138,5.31,-27.027,5.31,-26.471,4.532,-26.36,3.755,-26.36,3.31,-26.804,2.643,-26.138,2.643,-25.582,1.755,-25.471,0.977,-25.471,0.755,-25.027,0.199,-25.027,-0.579,-24.138,-1.245,-24.138,-1.468,-23.693,-2.134,-23.693,-2.357,-23.249,-3.468,-23.249,-3.579,-23.471,-3.801,-23.693,-3.912,-23.693,-4.023,-23.582,-4.023,-22.916,-4.468,-22.693,-4.468,-21.582,-5.134,-21.471,-5.69,-21.471,-5.912,-21.027,-6.579,-21.027,-6.801,-20.582,-7.357,-20.582,-8.134,-19.693,-8.69,-19.693,-9.468,-18.804,-10.468,-18.804,-11.245,-17.916,-11.912,-17.916,-12.134,-17.471,-12.801,-17.471,-13.023,-17.027,-13.69,-17.027,-13.801,-16.582,-13.801,-16.249,-14.468,-16.138,-15.023,-16.138,-15.245,-15.693,-15.912,-15.693,-16.134,-15.249,-16.69,-15.249,-17.468,-14.36,-18.468,-14.36,-19.357,-13.471,-19.912,-13.471,-20.023,-13.138,-20.023,-12.804], hole: false },
      ],
    },
    {
      kind: 'fill',
      color: 0x8e6f38,
      rings: [
        { points: [-18.134,-12.138,-18.134,-10.916,-16.468,-10.804,-14.801,-10.804,-14.579,-10.36,-11.69,-10.36,-11.468,-9.916,-9.912,-9.916,-9.69,-10.36,-4.579,-10.36,-4.357,-9.916,-3.245,-9.916,-3.023,-10.36,-1.468,-10.36,-1.245,-9.916,0.31,-9.916,0.643,-10.471,0.977,-9.916,3.421,-9.916,3.643,-9.471,4.755,-9.471,4.977,-9.916,6.088,-9.916,6.31,-10.36,6.977,-10.36,7.31,-10.916,7.643,-10.36,16.755,-10.36,16.977,-9.916,19.977,-9.916,23.088,-10.027,23.088,-11.027,21.532,-12.582,21.088,-12.582,20.31,-13.471,19.755,-13.471,17.532,-15.693,16.977,-15.693,16.755,-16.138,16.199,-16.138,13.532,-18.804,13.088,-18.804,12.31,-19.693,11.755,-19.693,10.421,-21.027,9.977,-21.027,9.199,-21.916,8.643,-21.916,6.866,-23.693,6.31,-23.693,6.088,-24.138,3.643,-24.138,3.421,-23.693,2.755,-23.693,2.532,-23.249,1.977,-23.249,1.199,-22.36,0.199,-22.36,-0.579,-21.471,-1.245,-21.471,-1.468,-21.027,-2.134,-21.027,-2.357,-20.582,-3.023,-20.582,-3.245,-20.138,-3.912,-20.138,-4.134,-19.693,-4.801,-19.693,-5.023,-19.249,-5.69,-19.249,-5.912,-18.804,-6.468,-18.804,-7.245,-17.916,-7.912,-17.916,-8.134,-17.471,-8.801,-17.471,-9.023,-17.027,-9.579,-17.027,-10.357,-16.138,-11.357,-16.138,-12.134,-15.249,-12.801,-15.249,-13.023,-14.804,-13.69,-14.804,-13.912,-14.36,-14.579,-14.36,-14.801,-13.916,-15.357,-13.916,-16.134,-13.027,-16.69,-13.027,-17.579,-12.138], hole: false },
      ],
    },
  ],
};
