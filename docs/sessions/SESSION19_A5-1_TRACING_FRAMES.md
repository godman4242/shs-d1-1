# SESSION 19 — A5.1: THE TRACING FRAMES, CHOSEN BY LOOKING

> **Gate (kickoff §4 A5.1):** *one crop per garment, each showing that garment
> unoccluded; record the frame path and timestamp for every garment.*
> **Status: MET**, with two crops carrying a stated defect (obi, hem) rather
> than a claim of perfection.
>
> ⛔ **This step overturned three of the kickoff's own prerequisites and one of
> SESSION 18's conclusions.** Every reversal below was found by opening a frame
> and looking, then re-derived with a command whose output is quoted. That is the
> standing invariant working as intended: **when a measurement doc and a frame
> disagree, the frame wins.**

Tool: `scripts/art/outfitFrames.py` (build-time only; reads gitignored
`reference/`, imported by nothing in `src/`). Video px → stage px is **÷ 1.875**.

---

## 1. THE DECISION — which fighter, which frames

### D-A5.1a — ⭐ TRACE THE **GREY** OUTFIT FROM `zFtCaTO0_1M`, NOT THE NAVY ONE FROM `Nr4fQstqHDM`

This **replaces kickoff D2** ("the player's duel outfit — navy haori + grey
shoulder + white hakama + straw kasa"). D2 was written from a palette sample that
had accidentally straddled two different fighters (§2 F2). The evidence:

| | navy outfit (`Nr4fQstqHDM`) | grey outfit (`zFtCaTO0_1M`) |
|---|---|---|
| watermark burned into the video | ⛔ **"SOUND360TM", every frame** | ✅ none |
| fighter alone in frame | never — always mid-duel | ✅ yes, for seconds at a time |
| weapon across the body | ⛔ a large blue blade, every frame | ✅ scabbard only, mostly behind |
| view | 3/4 back | ✅ **clean side profile — the rig's own view** |
| all garments unoccluded in ONE frame | no | ✅ yes |
| held-out frame available (D5) | poor | ✅ same pose, 5 s later |

> **Veto:** trace the navy outfit anyway. *Recommended against* — it is the same
> work with a watermark, an occluding weapon and no clean held-out frame. The
> navy outfit is richer (red trim, patterned obi) and is the obvious **second**
> outfit once the pipeline is proven; nothing here is wasted on it.

### The frames

| role | path | timestamp | provenance |
|---|---|---|---|
| **PRIMARY (trace from this)** | `reference/frames/s19_trace/zFt_0061.png` | **t = 590.0 s**, `zFtCaTO0_1M` | pulled this session, command below |
| **HELD-OUT (grade on this, D5)** | `reference/frames/s19_trace/zFt_0071.png` | **t = 595.0 s**, `zFtCaTO0_1M` | same burst |
| alternates, same stand | `zFt_0059.png`, `zFt_0060.png` | t = 589.0 / 589.5 s | same burst |
| pre-existing equivalent | `reference/frames/zFt_combat/zFtCaTO0_1M_t0595s.png` | t = 595 s | already in repo |

```
ffmpeg -hide_banner -loglevel error -ss 560 -i reference/videos/zFtCaTO0_1M.mp4 \
       -t 62 -vf fps=2 -q:v 1 reference/frames/s19_trace/zFt_%04d.png -y
     -> 124 frames, all 1920x1080     (frame N  =>  t = 560 + (N-1)/2 seconds)
```

⭐ **The ffmpeg recipe is proven to reproduce the repo's own frames byte-for-byte.**
Pulling t = 598.383 s from `zFtCaTO0_1M.mp4` and differencing it against the
committed `session11/movement-gesture/t598.383.png` gives **mean absolute
difference 0.00**; the same pull from `Nr4fQstqHDM.mp4` gives 55.63. That both
confirms §P4 and identifies the whole `session11/` tree (328 of the index's 448
full-res frames) as coming from the **watermark-free** video.

`zFt_0061` was chosen by scoring all 124 frames for *lone + still + unoccluded*
and then looking at the top twelve. It is the stillest frame in the burst
(inter-frame difference **1.07**, against 7–67 for the rest), the fighter is
alone, and no scenery crosses it.

---

## 2. WHAT THE FRAMES OVERTURNED

### ⛔ F1 — THE WIDTH TARGETS ARE HUD-CONTAMINATED. **A5-C CANNOT GRADE ANYTHING UNTIL THEY ARE RE-MEASURED.**

`reference/combat_idle_measurements.md` is the source of every number in kickoff
§P8 and therefore of gate **A5-C** and of SESSION 18's escalated **A4-D**. Its
landmark table opens:

```
- Kasa (hat): rows 616-638 (22px tall), conical straw hat
- Neck gap:   rows 640-648 (no body pixels — hat brim shadow)
- Head:       rows 650-680 (narrow, ~55px diameter)
- Shoulders:  rows 683 (widest upper body, ~80px)
```

Measured on that document's **own primary frame**,
`duel_frames/Nr4fQstqHDM_t426.8s.png`:

```
GREEN health-bar rows in x860..1080 :  y 626 .. 634
YELLOW watermark rows in same band  :  y 617 .. 699
measured fighter topmost pixel      :  y 641
```

**Rows 616–638 are the health bar and the watermark. The fighter is not there.**
What the doc calls the "neck gap, no body pixels" (640–648) is the real gap
between HUD and hat, and what it calls the "head, ~55 px diameter" (650–680) is
the **kasa brim**. Every landmark below inherits the shift, so
"shoulders ≈ 80 px at row 683" is still measuring hat.

The same error inflates the height. Segmenting five frames with the HUD
suppressed — and checking each mask by eye — gives a consistent figure where the
doc gives 266/267/274:

| frame | outfit | height (video px) | stage px |
|---|---|---:|---:|
| `s19_trace/zFt_0061` t590.0 | grey | 233 | 124.3 |
| `zFt_combat/…t0330s` | grey | 234 | 124.8 |
| `s19_trace/zFt_0071` t595.0 | grey | 242 | 129.1 |
| `duel_frames/…t426.8s` | navy | 242 | 129.1 |
| `duel_dense/…432.3` | navy | 243 | 129.6 |
| **mean** | | **239** | **127.4** |

The suppression was itself checked, because a mask that eats the hat would fake
this result. In `zFt_0061`, column band x820–860: rows **636–643** hold the
nameplate's black drop-shadow, rows **644–648** are clean background (0 dark px),
and the kasa's own outline starts at **y649–650**. The measured top of y650 is
the hat, not a casualty of the filter.

⇒ **Our composed bare fighter is 128.164 stage px — within 0.6 % of that mean,
and inside the range of all five frames.** A4-F graded it "2.8 % low" against an
inflated 131.8; corrected, the sign flips and the error shrinks.

### ⚠️ F1b — WHAT THIS DOES **NOT** SAY

It does not say A4-D's width miss is explained away. Read off the ruler for
`zFt_0061` (a **clothed** fighter) against our **bare** doll:

| measure | bare doll | doc target | this frame | doll ÷ frame |
|---|---:|---:|---:|---:|
| total height | 128.16 | 131.8 | 124.3 | 1.031 |
| head Ø | 18.37 | 28.4 | ~21 | 0.87 |
| shoulder | 34.43 | 42.7 | 36.3 | 0.95 |
| mid-torso | 25.84 | 36.3 | ~33 | 0.78 |
| pelvis | 27.09 | 37.7 | ~40 | 0.68 |

The gap **shrinks a lot** (shoulder goes 0.81 → 0.95) but does not close, and the
lower body stays short — which is exactly what a hakama that flares to 99 video
px would do. **So SESSION 18's clothing diagnosis survives for the lower body,
and the upper-body miss was substantially a measuring error.**

⚠️ **These are one fighter, one frame, one outfit — a first re-measurement, not a
new contract.** They must not be pasted into a gate. **A5.5 owes A5-C a fresh
target set measured across several frames with the HUD suppressed**, and it must
be produced BEFORE any traced garment is measured against it (kickoff D1).

### ⛔ F2 — §P7's PALETTE STRADDLED TWO FIGHTERS

§P7 sampled `duel_frames/Nr4fQstqHDM_t426.8s.png` crop (820,620)-(1020,900) and
reported `#373a4e` navy haori, `#998a5e` straw kasa, `#666666` **grey shoulder
armour**. That crop contains **two fighters**: a grey-clad enemy on the left and
the navy player on the right. `#666666` is the **enemy's entire haori**, not the
player's shoulder armour. **The player has no shoulder armour** — confirmed by
looking at the navy fighter unoccluded at `duel_dense/Nr4fQstqHDM_432.3.png`.
⇒ kickoff §4 A5.3's garment list ("haori, shoulder armour, sleeves, obi, hakama")
loses one item and should not have a shape traced for it.

### ⛔ F3 — "THE OVERWORLD IS UNUSABLE AT ANY RESOLUTION" IS OVER-GENERAL

§P3 ruled out the overworld after pulling t = 350 s and finding a ~35 px fighter.
That observation is correct **for that moment**. It is not true of the mode: at
t = 590 s in the same video the lone fighter is **233 px tall**, crisp, with
readable flat panels — and it is the *only* place the whole outfit appears
unoccluded. The overworld camera distance varies; **the primary tracing frame in
this session is an overworld frame.** What survives of §P3 is the real rule:
check the fighter's pixel height in the frame you actually intend to use.

### ⛔ F4 — THE TWO VIDEOS SHOW TWO DIFFERENT OUTFITS, AND ONE HAS A WATERMARK

`Nr4fQstqHDM` carries a burned-in **"SOUND360TM"** watermark and its player wears
the navy duel outfit. `zFtCaTO0_1M` has **no watermark** and its player ("GUEST")
wears the grey starter outfit. `combat_idle_measurements.md` averages its three
sources across both — i.e. **across two different sets of clothes**. Another
reason F1's re-measurement must be per-outfit.

### ⛔ F5 — THE TRACING UNIT IS THE **SLOT**, NOT THE GARMENT

§P5 already says equipment *replaces a part by id*. The consequence the kickoff's
§4 does not draw: a "haori" is not one shape. `OG_SLOT_SHAPES` splits that grey
gi across **slot 15 torso, 13 stomach, 19/1 uparm and 20/2 lowarm**, and the
hakama across **6/10 thigh and 7/11 calf**. So A5.2/A5.3 must decide *where to
cut a continuous garment into parts* — which is the real difficulty, and it is
not the same problem as tracing an outline.

### ⚠️ F6 — COLOUR ALONE WILL NOT SEPARATE THE GI FROM ITS SLEEVE

Clusters derived from the mask interior of `zFt_0061` (not from hand-picked
sample windows — those returned the background three times out of eleven):

| cluster | share | what it is | slot |
|---|---:|---|---|
| `#dcd5db` | 19.9 % | hakama, both legs | 6/7/10/11 |
| `#676467` | 12.6 % | **gi body AND near sleeve — one colour** | 15 + 19/20 |
| `#000000` | 8.9 % | outlines (continuous, closed per part) | — |
| `#c7c0c6` | 3.7 % | collar / juban + obi band | 12, 14 |
| `#9a979b` | 2.4 % | far sleeve / collar edge | 1/2 |
| `#725422` | 2.3 % | kasa straw (upper) | 17 |

⇒ **D4's "isolate by colour → 1-bit mask → potrace" is not sufficient on its
own.** Torso and sleeve share one grey; only the black outline divides them, and
the good news is that the outline reads as a **closed** boundary per part. The
per-part cut must come from the outline, not the fill.
⚠️ The clusters are speckled along every edge by video compression. A raw colour
threshold hands potrace the speckle. **Morphological cleanup before tracing is
mandatory, and its parameters belong in the provenance header.**

### ⚠️ F7 — THE OBI IS ~44 px, NOT ~15 px; AND THE BLUE "VFX" IS A WEAPON

Kickoff §4 A5.2 warns "the obi is ≈15 px and is the one at risk". Measured, the
obi band is **~44 px tall × ~55 px wide** — comfortably inside §P9's trustworthy
band. The genuinely at-risk item is not size but occlusion (§3 below).
Separately, the large blue diagonal shape crossing the navy fighter in every
`duel_dense` frame is **the player's weapon**, not a slash trail — it is drawn in
slot 3, which our art leaves empty by design.

### ⛔ F8 — THE DOJO IS REJECTED AS A TRACING SOURCE

Tried, because its wooden floor would have solved the grass-over-hem problem
(§3). It fails for a structural reason: the dojo's shoji screens are a **sharp,
cream-coloured lattice**, so the sharpness route locks onto the screen grid
instead of the fighter, and the white hakama sits against cream at almost no
contrast. Two attempts, one cause, so no third. Burst kept at
`reference/frames/s19_dojo/` (t = 560–586 s) so the rejection stays checkable.

---

## 3. THE CROPS — one per garment, from `zFt_0061` (t = 590.0 s, `zFtCaTO0_1M`)

Boxes are in **video px** on the full 1920×1080 frame. Fighter bbox: **x 777–900,
y 650–882** (233 px tall).

| # | garment | target slot(s) | crop (x0,y0)-(x1,y1) | size | unoccluded? |
|---|---|---|---|---|---|
| 1 | **kasa** | **17 (hat — EMPTY today)** | (770,643)-(908,699) | 138×56 | ✅ fully — clean outline all round, brim fringe readable |
| 2 | collar / juban | 12 neck | (792,686)-(862,752) | 70×66 | ✅ own outline; meets hair at the nape only |
| 3 | gi torso | 15 torso + 13 stomach | (796,700)-(908,800) | 112×100 | ✅ body panel clear; far sleeve visible behind it |
| 4 | gi sleeve | 19+20 near / 1+2 far | (836,720)-(912,802) | 76×82 | ✅ distinct outline, own mon |
| 5 | **obi** | 14 pelvic (+8 crotch) | (786,758)-(884,802) | 98×44 | ⚠️ **partial** — near sleeve covers its right end; sageo cord crosses it |
| 6 | hakama upper | 6 + 10 thigh | (776,788)-(892,842) | 116×54 | ✅ both side outlines clear; hand overlaps front-centre |
| 7 | hakama lower | 7 + 11 calf/foottop | (766,832)-(908,890) | 142×58 | ⚠️ **hem lost in grass** (last ~6 px); saya crosses at far right |

**The two defects are stated, not hidden.** Neither is fatal — every garment
clears §P9's 20 px trustworthy floor by a wide margin — but both belong in the
provenance header of whatever they produce:
- **obi:** its rear extent is behind the gi skirt in *every* standing frame
  found. Trace what is visible; label the rear INFERRED.
- **hem:** the hakama's bottom ~6 px dissolve into grass. The dojo would have
  fixed it and does not (F8). Trace the hem from the outline where it survives
  and label it INFERRED, or accept a hem 6 px short and say so.

---

## 4. WHAT A5.2 INHERITS

1. **Frame + crop 1** above: the kasa, slot 17, the emptiest slot and the
   cleanest garment. Unchanged as the kickoff's choice of first garment.
2. **F5's real problem:** decide the part cut. The kasa is deliberately the one
   garment where this does not arise — it is one part.
3. **F6's pipeline correction:** outline-driven separation + morphological
   cleanup, not a bare colour threshold.
4. **The pivot (§3 item 1 of the kickoff) is still the thing most likely to bite**
   and nothing here has touched it.
5. **F1's debt:** A5-C's targets must be re-measured from frames, HUD suppressed,
   several frames, per outfit — and **before** any traced garment is graded, so
   the ordering rule (D1: trace, then measure) is not quietly inverted.

## 5. REPRODUCE

```
python3 scripts/art/outfitFrames.py measure  reference/frames/s19_trace/zFt_0061.png 755 610 925 900 /tmp/m.png
python3 scripts/art/outfitFrames.py clusters reference/frames/s19_trace/zFt_0061.png 755 640 925 895 /tmp/c.png
python3 scripts/art/outfitFrames.py scan     reference/frames
```
Both `measure` and `clusters` write an overlay image. **Look at it.** The three
wrong answers this step produced on the way here — a 500-row "fighter", a
269 px height, and three garment colours that were the background — were each
caught by rendering the mask, never by reading the numbers.
