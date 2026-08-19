# world-exploration — HUNTER LENS review (blind critic)

Reviewer opened every artifact listed below itself. No verdict here rests on the
surveyor's prose.

## Headline

**1 REFUTATION, and it is a REFUTED "we don't have it" — the most valuable kind.**

`world-exploration/map-art-unheld` is WRONG. The rendered world-map art is not
locked inside the encrypted `124_Mobile_ImageResource.bin`. It is already sitting,
extracted, in the **WEB v0.717** tree:

```
reference/extracted/shapes/188.svg      height="785.15px" width="663.65px"
                                        399 sub-paths, filled vector
```

Rasterised (crude path-point fill, 630×720) it is an unmistakable Japanese
archipelago — Hokkaido top-right, the Honshu diagonal, Shikoku/Kyushu bottom-left,
the Ryukyu chain trailing SW. Overlaying the 63×72 land mask at ×10 px/cell (the
projection the surveyor itself proved from `WorldMapUI.as:230`) lands the mask
cells on that landmass: the mask is a 10-px quantisation of exactly this art.

Provenance is web, not Android: `docs/research/fidelity/ART_EXTRACTION.md:18` and
`docs/sessions/SESSION15_KICKOFF.md:58` record `reference/extracted/shapes` as an
FFDec `-export shape` run against `reference/decrypted/shs3_payload_decoded.swf`.
`docs/sessions/-SESSION-LOG.md:2392` and `docs/DIVERGENCES.md:3191` explain why it
was missed: of the 1,822 shapes, **only the 16 the fighter uses had ever been
looked at**.

Consequence: the surveyor's "four honest negatives" are three. This should move the
score up, not down.

## Everything else survived

I re-derived, not re-read, the load-bearing numbers:

| what I ran | result |
|---|---|
| `md5` + `cmp` web `bindata/92_1t4648s0.bin` vs `android/110_Mobile_MapBitmapData.bin` | both `13068dfa1a5cc5628720a25782f93fed`, 272 B, BYTE-IDENTICAL |
| PIL decode of the GIF | 63×72, exactly two colours, **735** land px of 4536, bbox i∈[1,61] j∈[1,70] |
| level gradient over the mask | real range **3..93**; counts L3×1 L4×2 L5×4 L6×5 L7×7 L8×8 L9×10 L10×9 L11×10 L12×14 — matches the surveyor row for row |
| re-implemented `RNG` + `getTownName2(1409366)` | **"Kakuchi"** — exact. `getTownName2(1397077)` → **"Kasuta"** |
| `112_Mobile_NodeData.bin` parse | 44 nodes · 98 rooms · 94 `<width>` · min 800 max 4000 · modes 800×22 1000×21 1400×7 1600×7 · 343 objs · 30 distinct `<bg>` · **186** obj-id-0 signposts · exactly **1** `<search>` block |
| `GameStage.as:683-925` | exactly **73** `case N:` arms, `case 0` … `case 72` |
| `grep -E "getNodeLevel\|APINTERVAL\|TERRSHIFTX\|getOreType"` over the 329 MB `payload.xml` | **0 hits** — the surveyor's negative is real |
| `ls src/config/` | no `world.ts` / `ap.ts` / `farming.ts` / `nodes.ts` — Surface bullet confirmed |

Frame work (A1, done first-hand): `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg`
is 512×288, crop `(360,10)-(512,120)` Lanczos ×8 → a 6-column × 6-row minimap
labelled `0 1 2 3 4 5` on both axes, white player triangle at col 1 / row 3, gold
up-arrow at (3,0), gate glyphs at (5,0) and (0,5), gold X near (2–3,2), dashed
route outline. Crop `(400,120)-(512,180)` ×8 reads **`TERRITORY (24,52)` /
`SECTOR (1,3)`**. Crop `(0,30)-(300,80)` ×5 reads **`W KAKUCHI MOUNTAIN PATH`**;
the same crop on `frame_0080.jpg` reads **`KAKUCHI DOJO GATES`**. Frame and payload
AGREE — there is no frame-vs-doc conflict in this unit to adjudicate.

The two STILL_UNHELDs I attacked hardest both held:

- **`searchList` has no consumer.** I grepped BOTH Android decompiles
  (`shs3_android/scripts` and the separate `shs3_android_payload/scripts`,
  553 top-level `.as` each) plus `com/`, `fl/`, `mx/`, `playerio/`. Only hits:
  `XMLWorldNode.as:30` (declare) and `:96` (assign). Write-only field. Correct
  STILL_UNHELD.
- **`119_Mobile_MapData.bin` is a stub.** `xxd`: 65 bytes,
  `<?xml version="1.0" encoding="utf-8"?>\r\n<mapdata>\r\n\r\n</mapdata>\r\n`.
  Confirmed. (And it is not a numbering mix-up with web bindata 119, which is the
  11,721-byte `<survivalmodedata>`.)

## Corrections to log (none fatal)

1. **`namestarting[74]`, not `[73]`.** Index 73 is `"Iwa"`; `"Ka"` is 74. The
   generated string is unaffected — I reproduced `"Kakuchi"` from `(74, 19)`.
2. **12-hour crops never rot.** `Obj_VegePatch.as` `case 4` has no grace/ROTTED
   branch at all — it goes straight to `READYFORHARVEST` and stays there. The
   15-minute grace applies to the 15 min / 1 h / 6 h tiers only.
3. **`isNoChangeTown` is much broader than the id list.**
   `NodeGenerator.as:393-400` returns true for the four named ids **and for every
   territory with `getTerritoryLevel < LEVELSTART + 5` (i.e. level < 8)**. Since
   the whole world spans level 3..93, that is a large static-town core around
   spawn, not twelve pinned ids.
4. **Cross-build parity is stronger than "land mask only".** The Kakuchi match is
   itself a live web-vs-Android check: the WEB v0.717 video frame renders a name
   that only falls out of the ANDROID v0.682 code if `getTerritory`,
   `getTerritorySector`, `TERRSHIFTX=21`/`TERRSHIFTY=51`, the LCG
   `(s*9301+49297)%233280`, `getPlaceName`'s `%137` branch, the 78-entry
   `namestarting` / 37-entry `nameending` tables and `getNodeCompassDir`'s
   `<=1 / >=4` bands are ALL identical across builds. That is behavioural proof,
   not byte proof — but it is far above "string-pool inference".
