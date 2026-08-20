# CITE-LENS REVIEW — unit `src-android-blobs`

Blind critic. I did not see the surveyor's reasoning. Every verdict below rests on an
artifact I opened myself; every number below I re-derived from the file, not from the
survey. 15 claims judged, 0 skipped.

**Headline: this is the most cite-accurate unit I have audited in this lane.** Twelve of
fifteen claims reproduce *exactly* — line numbers, byte counts, tag histograms, symbol
manifests and residual id lists all land on the number. One claim (`foreground-layer-
occludes-the-fighters`) is REFUTED: the frame shows the occlusion but does not show the
*plane*, and the outline description is wrong at 3x. Two claims carry a material internal
falsehood that does not change their result (`item-and-skill-icon-art-is-held`) or their
generality (`blobs-are-utf8-not-utf16`).

---

## 1. What reproduced exactly

| claim | what I re-ran | result |
|---|---|---|
| `web-payload-holds-zero-data-roots` | zlib-inflated both payloads, counted all 13 root tags | inflated 11,892,053 / 21,688,584 B; 0/1 for all ten roots; survivalmodedata 1/1; traproomdata 1/1; animdata **19/18** — every figure exact |
| `data-xml-parity-proofs-are-circular` | `diff` all four pairs | zero content lines changed in all four; questdata differs by one trailing `\n` only |
| `spider-is-web-only-enemy` | opened `114_1t4641s0.bin` at all ten cited lines; opened `§1t1544s0§.as:480–498` | all ten `<anim i="spider_*">` lines land exactly; AS3 480 = `spider_idle`, 498 = `spider_dig`; android npcdata/strings.json/scripts/blobs all 0 hits |
| `web-is-an-animation-superset` | `<anim ` census + full name diff | WEB 487 (per-blob list matches all 19 values), ANDROID 471, **16 web-only, 0 android-only**, itemisation identical |
| `boss-timings-recut-across-builds` | parsed every `<anim i=… d=…>` in all 19 web + 18 android blobs, paired by name overlap | **exactly 7 duration divergences in the whole corpus**, all in Ogre + Guardian, values as quoted; skills blob (51) and spear blob = zero divergence |
| `parallax-and-dof-contract` | `XMLBG.as:10–58` | every declaration verbatim; `groundY=400` is line 10, `foregroundLayerScroll=2` is line 58 |
| `portraits-decrypted-and-one-dead-reference` | decrypted `124_…ImageResource` myself (key `'m'`=109 → CWS v17, declared 1,908,237, inflates 1,908,229, 85 symbols) and cross-checked against questdata `<img>` | 66 `portrait_*`; **51/52 present; the one absent is `chikako_maked`**; **15** unreferenced, **12** of them the {blue,green,red,yellow}×{sergeant,captain,general} grid + `ladyoiwa_snake2`, `takamori_masked`, `takamori_standmask` — set-identical |
| `all-thirteen-episode-cards-shipped` | same decrypt | all 16 story-card symbols present, names as listed |
| `mapdata-has-no-web-counterpart` | `xxd` the whole 65-byte file | byte-exact; web census `<mapdata>` = 0 |
| `comp-rand-is-the-encounter-roll` | `112_…NodeData.bin:117–118`, `StatsManager.as:4171–4177, 4216–4225` | lines land exactly; `checkCondition(id,val,comp)` ⇒ `Math.random()*100 <= 50`; and **it is the only `<comp>rand</comp>` in all 42 blobs** (full comparator census: eq 5, gte 3, not 3, gt 1, lt 1, rand 1) |
| `nothing-was-rendered` | re-parsed the SWF tag stream of all five decrypted resources | 3,756 / 1,949 / 1,594 / 127 / 4 · 1,124 / 552 / 370 · 330 · 22 · 22 — every figure exact |

The five-blob decryption is real and I reproduced it independently from
`ResourceManager.as:200–216` + `Mobile.as:352`: SHS3Resource key `'h'`=104 → CWS v17,
declared 1,040,857, inflates to 1,040,849, **1,912 exported symbols**.

---

## 2. REFUTED — `android-blobs/foreground-layer-occludes-the-fighters`

I opened `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (1920×1080) and made both
cited crops at ×3 NEAREST, plus a third at (940,850)–(1120,960) ×8 on the occlusion line
itself.

**What the frame does show, and I confirm:** a green scenery band crosses the lower third
and is painted **over** both fighters — the blue-clad fighter's shin and the tan-clad
fighter's foot both terminate into it. The rock forms behind are unmistakably soft-edged.
That much is a sound A1 observation.

**Two things the frame does not support:**

1. **The plane attribution is an inference, not an observation.** `XMLBG.as` gives
   `groundLayerScroll = 1` and `foregroundLayerScroll = 2`; *both* planes can be
   composited in front of a character, and a single static frame carries no scroll rate.
   Worse, `BG_Loader.as:180,203,223,243,255` does not composite anything — it looks the
   layers up by name (`ff_i`, `f_i`, `pp_i`, `ground_i`, `fg_i`) **inside one authored
   `stageContent` MovieClip**, so the z-order is baked into the BGResource symbol and is
   invisible to any frame. This claim's own headline ("A frame confirms the foreground
   parallax plane is real") cannot be settled by the artifact class it cites.
2. **The outline description is wrong at magnification.** The claim says the grass is
   "hard-black-outlined" and "carries the same outline weight as the fighters". At ×3 and
   ×8 the blades are *lighter-green strokes on a dark-green mass with no black stroke at
   all*, and the band's top edge against the fighter's leg is soft. The fighters' black
   outline is unmistakable and the grass has none. **Frame over doc, as always.**

**What would close it:** two consecutive frames during a camera pan. Measure the band's
pixel displacement against the fighter's; `gscroll = 1` moves with the fighter,
`fgscroll = 2` moves at twice his rate. Alternatively decode the `BG_DenseForest` symbol
in the decrypted BGResource and read whether the grass child is named `ground_i` or
`fg_i`. Either settles it in minutes. A rewritten claim — *"a sharp scenery layer is
composited in front of the fighters and occludes their lower legs"* — holds today.

---

## 3. MATERIAL defects inside surviving claims

### `item-and-skill-icon-art-is-held` — the stated method is false, the result is right
The quote says *"(itemdata has no `<art>` tag anywhere, so art id = item id)"*.
**`111_Mobile_ItemData.bin` contains 146 `<art>` tags** — first at line 327
(`<art>20041</art>`), then :485, :523, :569 … (`<art>2130</art>`).

This matters because the stated method gives the *wrong* answer. Resolving art = id
blindly yields **50/99, 8/9, 58/79**. Resolving art = `<art>` when present, else id — the
`XMLItem` rule — yields **94/99, 8/9, 67/79 with residuals {2000, 2001, 2500, 2502, 2503},
{3007}, {20005, 20009–20012, 20017, 20023, 20054–20058}**, i.e. exactly the survey's
numbers. So the survey computed it correctly and then described the computation wrongly.
Strike the parenthetical; keep every number.

Also: `stomach` is **150** strict symbols, not 151 (the other four paperdoll families are
151). Off by one.

### `blobs-are-utf8-not-utf16` — the correction is right, the "41 of 42" is not
Six of the 42 blobs are not text at all: `113/115/120/122/124_*Resource.bin` start `CWS`
and `110_Mobile_MapBitmapData.bin` starts `GIF89a`. Of the 36 text blobs, **18 carry a
UTF-8 BOM (`efbbbf`)** — which shifts byte offset 0 and will bite anyone byte-slicing.
Precise census: **35 UTF-8 (18 BOM'd) + 1 UTF-16LE + 5 CWS + 1 GIF = 42.** The operative
correction — the XML data blobs are UTF-8 and grep line numbers are trustworthy — holds.

### `bgdata-is-a-parallax-spec` — two override counts are wrong
The 874 total, the five plane sums (147/211/311/92/113), the 49 records, ids 0–54 with
{4,19,23,24,25,43} unused, `contentwidth` 17 rows / widest `BG_NinjaVillage` 5000, and
`wrap` 17 rows all 0 — **all exact**. But:
- `ffwrap` is **8 rows, not 6** (lines 12, 23, 259, 330, 356, 370, 514, 530 — four of them
  `2000`, not two).
- `ffscroll` is 14 rows but its range is **0.05–1.0, not 0.05–0.27** (lines 411 and 428 are
  both `1`).
- Three override families are missing from the census entirely: `ppscroll` (6 rows),
  `gscroll` (2), `fgscroll` (3, all `1.2`).

I independently confirmed the claim's strongest cross-check: the decrypted
`120_Mobile_BGResource` exports **exactly 49 `BG_*` symbols, set-equal to bgdata's 49
names** (plus 18 non-BG symbols).

### `data-xml-parity-proofs-are-circular` — one word wrong, thesis intact
"Sizes differ by exactly the 40-byte prolog + 2-byte CRLF" is true for skill/item/npc
(42 B each) but **not for questdata, which differs by 1 byte** — the surveyor's own listed
pair `796,383/796,384` shows it. `reference/extracted/questdata.xml` already carries the
prolog. The thesis is unharmed and, in my judgement, is the most consequential claim in
this unit: three banked claims (`skilldata/android-web-byte-identical`,
`skilldata/android-web-parity`, `quests-story/android-caveat-retired`) discharge the S0-3
caveat by comparing a file to itself, while a fourth banked claim
(`quests-story/payload-provenance-is-android`) already proved those files are Android.
**The S0-3 caveat is undischarged for questdata, itemdata, skilldata and npcdata.**

### `all-thirteen-episode-cards-shipped` — `overturns_ledger` is weakly true
`REBUILD_READINESS.md:30` is a staleness-banner row that already overturns §3.8, and the
banked `questdata/portrait-count-correction` already enumerated the same 16 `_episode*`
tokens. What is genuinely new is that the **art symbols** exist in the binary. I confirmed
both halves: questdata references `_episode0`…`_episode12` as `<img>`, and ImageResource
exports `image_episode0`…`image_episode12`. Keep the claim, downgrade the overturn.

---

## 4. New findings (details in the structured return)

1. **146 `<art>` overrides / 68 distinct targets / art `2130` shared by 39 rows** — item
   icon art is *shared*, not 1:1 with item id. Directly overturns the false parenthetical
   above and is a real L3 compositing contract.
2. **`chikako_maked` does not degrade — it throws.** `ResourceManager.as:294–297` returns
   `null`; `QuestDialogueUI.as:71` calls `addChild(null)` ⇒ AS3 `ArgumentError #2007`. The
   survey's guidance ("reproduce the fallback") is wrong: there is no fallback path on the
   `portrait != ""` branch. `questdata:12460`.
3. **`groundLayerBlur` is applied to ground layers 1–2 only** (`BG_Loader.as:248`), unlike
   every other plane which blurs all layers. A recreation that blurs all ground layers at
   4 is wrong.
4. **Parallax z-order is authored, not code.** `BG_Loader.as:182,205,225,245,257` fetches
   named children of one `stageContent` clip. This is why no frame can settle claim 8.
5. **Four shipped BG id collisions.** `GameStage.as:122,124,126,128` re-declare
   `BG_MINE2=46`, `BG_RIVERBANK=47`, `BG_DOJO4=49`, `BG_DOJO5=50`, colliding with
   `BG_JINMAKU_OUTSIDE`, `BG_JINMAKU_NIGHT_OUTSIDE`, `BG_TEMPLERUINS_FOG`,
   `BG_TEMPLEINTERIOR2` at :102,:104,:108,:110. Four named backgrounds resolve to someone
   else's scene.

## 5. What I did not check
I did not decode a single `DefineShape` either — the survey's `nothing-was-rendered` is
honest and I sustain it. I did not search the 7,381-frame corpus for a spider sighting;
that lead is still open and still tractable. I did not verify the web build's `stageContent`
symbol names (the web BG resource was never in the client payload).
