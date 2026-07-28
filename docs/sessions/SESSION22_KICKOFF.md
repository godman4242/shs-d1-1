# SESSION 22 KICKOFF — RE-AUTHOR THE GARMENTS IN THE ORIGINAL'S OWN ART GRAMMAR

> **Entry route:** `RESUME_HERE.md` → this file. **Self-contained; assumes no
> memory of SESSION 21.**
>
> **INTENT, in one sentence:** stop improving a tracing of the art and rebuild the
> seven garments the way the original was actually drawn — flat base tone, one
> hard-edged shadow tone, a stroked contour, thin detail lines — because the gap
> is structural and no amount of colour tuning can close it.
>
> **⭐ THE OWNER ASKED FOR THIS, IN THESE WORDS (2026-07-28):** *"do you have an
> idea of how the game's original art was made because you are not replicating it
> correctly, try to do it, and tell me once you have a 1-1 copy of the art, as of
> right now it is not 1-1."* And, separately: *"the garments made have too much
> black outline to the point it bleeds into the actual garment image for one or 2
> of them."* **Both are measured below. He named the count exactly: it is two.**
>
> **⛔ THE STANDING INVARIANT:** the two gameplay videos are the primary 1:1
> reference (`reference/videos/`). **Open a frame and look** before grading any
> visual claim; when a measurement doc and a frame disagree, **the frame wins.**
>
> **⭐ AND THE ONE SESSION 21 ADDED:** **check the payload before recreating
> anything.** A8.2 was going to trace a sword; the weapon was already in the repo
> as original vector art. **`scripts/art/shapeAtlas.ts` now renders all 1822
> extracted shapes — look there first, always.**
>
> **Other standing rulings:** RECREATE-NEVER-RIP for dialogue and names ·
> Duels-not-SHS · single-player-first · `core/` zero numeric literals ·
> render-only scenes · red-first TDD · chaos-plant every guard ·
> **binary gates, never softened to fit a result**.
>
> ⚡ **THERE IS NO RESEARCH STEP.** Every number below was produced by a committed
> script during SESSION 21 and is quoted with the command that reproduces it.

---

## §0 THE ONE IDEA THAT GOVERNS THIS SESSION

**We have been drawing a silhouette with a hole punched in it. The original draws
a shaded figure with a stroked outline.**

```
                 OG's own art (2644-2678)        our traced garments (9001-9019)
  fills/part     2 — base + a HARD-EDGED shadow  1 flat tone
  outline        a real STROKE, width 2/1.5/1    a black FILLED BLOB, random width
  detail         thin strokes, width 0.5-1       none
  contour        smooth Bezier                   potraced raster, ragged
  palette        2 skin tones reused globally     one video sample per garment
                 (#feca98, #b78f6c) + #9e9a97 /
                 #dcd9d4 cloth, byte-exact
```

▶ **Look at it. One command, and it is the whole argument for this session:**
```
npx vite-node scripts/art/shapeAtlas.ts -- --ids 2646
open renders/atlas/picked.png          # the OG's torso: shaded, stroked, smooth
open renders/garments_alone.png        # our four garments: flat, blobby, ragged
```

⇒ **A colour gate cannot see this.** A8-D grades one flat fill against one median;
a garment can pass it and still read wrong because it has no interior structure
and no stroke. That is what §P2 below measures.

```
A9.1  the OG grammar, as a committed gate                    ⬅ START HERE
A9.2  the two over-inked garments — 9012 and 9001
A9.3  the kasa: two tones, straw ribs, brim fringe
A9.4  the gi: the bulge, the front panel, the sleeve
A9.5  the hakama: one column, a clean hem
A9.6  the branch onto slot 3, at the right facing
A9.7  re-grade every band; gates; handoff
```

---

## §P PREREQUISITES — ✅ ALL RESOLVED, NOTHING TO GO AND FIND

**P1 — ✅ SESSION 21 IS COMMITTED AND GREEN.**
```
20310b9 A8.2: the weapon was in the repo - a branch, not a sword, id 2641
2540188 A8.1 correction: the kasa sample was not off-garment - it was bright
0e749a4 A8.1: the colour ruler - GATE A8-A MET, measured before anything moved

Test Files 49 passed (49)   Tests 827 passed (827)   tsc x2 -> 0   eslint -> 0
clean clone (no reference/): 816 passed | 11 skipped, exit 0
```

**P2 — ⛔ THE INK, MEASURED AGAINST THE ORIGINAL'S OWN RANGE.**
`npx vite-node scripts/art/inkShare.ts` — rasterises every shape alone at a fixed
box (scale-invariant, because stroke widths are shape-local) and counts black
against inked.
```
  OG reference (14 shapes, the solid-black HAIR excluded): mean 41.4%, worst 61.4%

  9012  collar / juban   75.9%   ⛔ OVER the OG's own worst
  9001  gi sleeve, far   70.6%   ⛔ OVER the OG's own worst
  9014  obi             53.7%
  9019  gi sleeve, near  46.0%
  9017  kasa            40.1%
  9011  hakama          32.2%
  9015  gi body         12.4%
```
⭐ **The owner said "one or 2 of them" and it is exactly two.** A second,
independent measurement on the SOURCE FRAME's own masks agrees within 1.1 points
(9012 77.0 %, 9001 71.1 % ink) — two different instruments, same answer.
⚠️ **The cause is scale, not taste.** Both are the smallest garments (9001 is
12.0 × 19.6 world px, 9012 21.3 × 23.1). `traceGarment.py` bounds a garment with a
fixed ink threshold plus a 3×3 closing, so the blurrier the outline is relative to
the shape, the more of the shape it eats. **A stroke of a stated width cannot do
this; a thresholded blob always will.**

**P3 — ✅ THE COLOUR TARGETS ARE COMMITTED.** `scripts/art/sourceColour.ts`, from
`python3 scripts/art/colourRuler.py`. Medians inside each garment's own traced
mask, with the interquartile spread beside them:
```
 9017 kasa        (122, 88, 38)  iqr 38,35,24   <- NOT one colour; see P4
 9012 collar      (204,201,203)  iqr 16,17,14   ours 22 DARK
 9011 hakama      (220,213,219)  iqr  3, 2, 5   ours 22 DARK
 9015 gi body     (104,100,103)  iqr  2, 1, 1   ours  7 light  ✅
 9019 gi sleeve   (104,100,103)  iqr  2, 1, 1   ✅      9001 (103,100,103) ✅
 9014 obi         (204,201,201)  iqr  6, 6, 8   ✅
```

**P4 — ⭐ THE KASA IS TWO-TONE, AND THAT IS WHY A ONE-FILL GATE COULD NOT GRADE IT.**
```
 kasa mask percentiles:  p25 (116, 84,33)   p50 (122, 88,38)
                         p75 (154,119,57)   p90 (173,138,74)
```
⛔ **DO NOT close the kasa by darkening it.** Its median sits in the dark band;
matching it makes the hat visibly darker than the source reads and turns a gate
green doing it. **The two-tone grammar is the actual fix:** base ≈ p75, shadow ≈
p25, which is what the original does everywhere else.

**P5 — ⭐ THE CLOTH COLOURS EXIST BYTE-EXACT IN THE PAYLOAD.** Shape 2653 (pelvic)
carries `#dcd9d4` and `#9e9a97` straight from the SWF. Our video-measured hakama
median `(220,213,219)` vs `#dcd9d4` = `(220,217,212)` — **within 7 levels on every
channel.** ⇒ **Prefer the SWF value over the video sample wherever a garment's
tone matches one.** A lossy sample confirming an exact value we already hold is
not a reason to keep using the lossy one.

**P6 — ⛔ THE BULGE IS `9015`'s OWN OUTLINE, AND THE OLD DIAGNOSIS IS REFUTED.**
Rendering the pose with slot 19 emptied leaves the ink bounds **byte-identical**,
so the "doubled sleeve" theory carried since SESSION 19 §P7 is dead — the sleeve
is entirely inside the silhouette. Rendered alone, 9015 has a rounded lobe jutting
off its back edge: `outer_silhouette` flood-fills *(garment-grey OR ink)* from a
seed and **leaks across the jacket's back into the far-sleeve region**, merging
them into a balloon. The source's back is one smooth curve, shoulder to hip.

**P7 — ✅ THE BRANCH IS COMMITTED AND UNWIRED, AND WE KNOW WHY.**
`shape2641.ts` is the training branch — original vector art, `BRANCH · DMG 1-2 ·
WEIGHT 1 · LEVEL 1`, read off the PLAYER screen at t=708.0 s of video A.
```
                    held-out    tracing    height
  without branch     0.8619     0.9185     140.5   <- the committed floor
  with branch        0.8526     (held)     140.5
```
⛔ **The floor was NOT lowered.** ⚠️ **And the drop is probably ours:** the
source's stick runs **upper-left → lower-right**; ours runs the other way. Node 3
is `rotationDeg: 142`, the source needs ≈ **+38**, and `142 = 180 − 38` — a
horizontal-mirror signature; node 4 carries exactly `−38`.

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

### D1 — RE-AUTHOR, DO NOT RE-TRACE
The trace stays as the *outline guide*; the shipped art is authored in the OG's
grammar on top of it — exactly how a Flash artist uses a reference.
> **Veto:** keep tuning the trace — *recommended against*. Three sessions of
> tuning produced a bulge, a ragged hem and two garments the outline ate.

### D2 — THE OUTLINE BECOMES A STROKE, NOT A FILLED RING
Every garment gets a black `stroke` paint of stated width in the OG's own range
(0.5–2.5), and its all-black *fill* rings are deleted.
> **Veto:** none. A stated width is the only thing that makes P2's number
> controllable instead of emergent.

### D3 — TWO TONES MINIMUM, EVERY GARMENT
Base + one hard-edged shadow, per the OG's own 14 shapes.
> **Veto:** one tone for the obi if its `iqr` (6,6,8) really is flat — decide by
> measurement, and say so.

### D4 — THE SWF's OWN COLOURS WIN OVER A VIDEO SAMPLE WHEN THEY MATCH
Within 12 levels, use `#dcd9d4` / `#9e9a97` / `#feca98` / `#b78f6c`.
> **Veto:** none. One is exact and one is JPEG.

---

## §2 THE BAR — binary, measurable, fixed before any code exists

| | Test | **THE NUMBER** | Measure |
|---|---|---|---|
| **A9-A** | authored in the OG's grammar | every traced shape has **≥1 black stroke, width ∈ [0.5, 2.5]**, and **ZERO all-black fill rings** | a new test over the committed shapes |
| **A9-B** | the outline stops eating the garment | **every traced garment ≤ 61.4 %** black share — the OG's own worst non-hair part | `npx vite-node scripts/art/inkShare.ts` |
| **A9-C** | two tones | **≥2 distinct non-black fills** per garment (obi exempt only if measured flat) | the same test |
| **A9-D** | colour | **every tone within 12 levels/channel** of its own measured target (base ≈ p75, shadow ≈ p25) | `colourRuler.py`, extended to emit p25/p75 |
| **A9-E** | the bulge is gone | slot 15's back edge has **no secondary local maximum > 2 stage px** over the torso band | a new probe, committed |
| **A9-F** | the branch is on screen, facing right | slot 3 wired; branch principal axis within **10°** of the source's measured angle | measured from a frame, ledgered |
| **A9-G** | nothing regressed | held-out **≥ 0.8618** · height **≤ 140.5** · fidelity **55/55** · suite **≥ 827** green · clean clone green · ratchet not widened | the existing gates |

⚠️ **A9-G MAY BIND AGAINST THIS SESSION'S OWN GOAL.** If better-looking art costs
silhouette agreement, **show both numbers and ask. Never lower a floor.**

### ⛔ NOT-DONE — the cut line, so "finished" is unambiguous
Out of scope, deliberately: putting the fighter in `DuelScene` (still queued, and
`DuelScene.ts` still calls `drawSamurai`) · the other 157 animations · all audio ·
the kasa height trade (§P6 of the SESSION 21 kickoff, open for an owner ruling) ·
any second outfit. **A session that ships those instead of §2 has not done §2.**

---

## §3 WHAT WILL FIGHT YOU

1. ⛔ **THE HUE MASK CANNOT FIND THE STICK — THREE ATTEMPTS FAILED.** SESSION 21
   tried `reject_occluder`'s warm rule, a tightened warm rule, and a direct pixel
   sample; all returned scenery or skin. **Do not repeat it.** Read the two
   endpoints by eye off a zoomed crop and record the pixel coordinates in the
   ledger — looking is the primary instrument here, and the angle is all A9-F needs.
2. ⛔ **A GREEN GATE IS NOT A GOOD PICTURE.** SESSION 20 shipped a nearly-bare
   torso and trousers round the knees, both scoring well. **LOOK at all three band
   crops before believing any number.**
3. **`poseRaster.ts` is the only file a test cannot reach** (it imports
   `src/game/**`). Everything else takes the shape map as an argument. Keep it so.
4. **`reference/` is gitignored** — comparators live in `scripts/`, and the
   clean-clone run is what proves nothing reads it at runtime.
5. **Traced ids are ≥ 9000 and nothing else is.** OG equipment goes in
   `OG_EQUIPMENT` (`src/config/ogPose.ts`), which is why 2641 is not in `TRACED`.
6. **Every change here moves the golden digest** — expected; update it in the SAME
   commit and say why. **The score floors are different: they may only move UP.**

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them red, then code.**

- **A9.0** — baseline: `git log --oneline -1` → `20310b9`; `npm test` → 49/827.
- **A9.1** — the grammar gate (**A9-A, A9-C**). Red-first, before any art moves.
- **A9.2** — re-author **9012** and **9001**, the two over-inked garments (**A9-B**).
- **A9.3** — the kasa: two tones, straw ribs, brim fringe (**A9-C, A9-D**).
- **A9.4** — the gi: kill the bulge, add the front panel and the sleeve (**A9-E**).
- **A9.5** — the hakama: one closed column, a clean hem.
- **A9.6** — the branch onto slot 3 at the measured facing (**A9-F**).
- **A9.7** — re-grade every band, gates, handoff, and the SESSION 23 kickoff.

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Baseline `20310b9` / 827 green | `git log -1` + `npm test` |
| 2 | Every garment has a stroke, no black fill rings | the A9-A test |
| 3 | Every garment ≤ 61.4 % ink | `inkShare.ts` output pasted |
| 4 | Two tones per garment | the A9-C test |
| 5 | Every tone within 12 levels | `colourRuler.py` table pasted |
| 6 | No secondary lobe on slot 15's back edge | the A9-E probe |
| 7 | Branch on screen, facing within 10° | `side_by_side.png` + the ledgered angle |
| 8 | Held-out ≥ 0.8618, height ≤ 140.5 — floors NOT lowered | `git diff tests/a6Score.test.ts` |
| 9 | Fidelity 55/55 · suite green · clean clone green | pasted |
| 10 | `duel-baseline` green AND unedited; ratchet not widened | `git diff` |
| 11 | Nothing from `reference/` committed | `git status` + history |
| 12 | Ledgers + `RESUME_HERE` in the same commit as their change | `git show --stat` |
| 13 | **A human looked at ALL THREE band crops and said what closed** | the verdict, in the commit |
| 14 | SESSION 23 kickoff written, committed, graded | the file + its bar self-report |

---

## §6 THE TWO REAL RISKS

**Risk 1 — re-authored art scores WORSE on the silhouette than the trace did.**
A stroke of stated width will not follow the video's blur, so the outline moves by
a pixel or two everywhere. **Mitigation: A9-G forbids lowering the floor. If the
trade is real, both numbers go in the commit and the owner rules.**

**Risk 2 — "re-authoring" quietly becomes "drawing from imagination".** The line
is: **the outline comes from the trace, the GRAMMAR comes from the OG's own
shapes, and the tones come from measurement.** Anything invented beyond that gets
labelled INFERRED in the shape's header, or it does not ship.

---

## §7 BAR SELF-REPORT

**Does this kickoff reach the bar? ✅ Yes — the next change would be churn.**

- **Every goal has a runnable measure that can fail**, and the two new ones are
  already committed scripts (`inkShare.ts`, `colourRuler.py`), not promises.
- **It has an explicit NOT-DONE cut line**, so "finished" is unambiguous.
- ⭐ **It opens by retiring its predecessor's whole approach** — the gap is
  structural, and the evidence is a one-command side-by-side anyone can run.
- ⭐ **It carries the owner's two observations as measured facts**, including that
  he named the count exactly, with two independent instruments agreeing.
- ⭐ **It names a method that FAILED THREE TIMES** (the hue mask for the stick) and
  forbids repeating it — the cheapest thing a kickoff can hand forward.
- **It pre-empts its own worst failure mode**: closing the kasa by darkening it
  would turn a gate green and make the picture worse, and §P4 forbids it in advance.

**What it deliberately does not promise:** that the fighter becomes pixel-identical.
The kasa, gi and hakama do **not** exist in the payload — all 1822 shapes were
rendered and read — so their outlines will always be a measured recreation. It
promises the ART GRAMMAR becomes the original's, which is what "1:1" can honestly
mean for a garment whose vector data died with the CDN.
