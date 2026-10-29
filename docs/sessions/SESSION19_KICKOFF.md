# SESSION 19 KICKOFF — GIVE THE FIGHTER ITS CLOTHES, TRACED FROM THE VIDEOS

> **Entry route:** `RESUME_HERE.md` → this file. **This is the only kickoff you
> need.** Self-contained; assumes no memory of SESSION 18.
>
> **INTENT, in one sentence:** trace one complete outfit — kasa, haori, sleeves,
> obi, hakama — from the original game's own footage, drop it into the slot
> system that already exists, and prove by measurement that the clothed fighter
> matches the widths the bare doll could never match.
>
> **⛔ THE STANDING INVARIANT THIS SESSION EXISTS TO HONOUR (owner, 2026-07-27):**
> **THE TWO GAMEPLAY VIDEOS ARE THE PRIMARY 1:1 REFERENCE.** Copy what is in
> them, directly. The extracted payload is the skeleton; clothing, armour, VFX
> and feel survive ONLY in the videos. **Open a frame and look** before grading
> any visual claim. When a measurement doc and a frame disagree, **the frame
> wins.**
>
> **Other standing rulings (unchanged):** RECREATE-NEVER-RIP for dialogue and
> names · **Duels-not-SHS** · single-player-first · `core/` zero numeric
> literals · **render-only scenes** · **red-first TDD** · chaos-plant every guard
> · **binary gates, never softened to fit a result**.
>
> ⚡ **THERE IS NO RESEARCH STEP.** Every number in §P came from a command run on
> 2026-07-27, quoted with its output — including the frame inventory, the
> resolution census that rules out two thirds of it, the proof that ffmpeg can
> pull any moment at full resolution, and a real palette sample.

---

## §0 THE ONE IDEA THAT GOVERNS THIS SESSION

**SESSION 18 built a fighter that is provably the right HEIGHT and provably too
NARROW, and proved the narrowness is not a bug.** Every height measurement passed
(torso 1.013, total height 0.972); every width missed (0.65–0.81). The cause is
not scale and not composition — it is that **our doll is naked and the fighter in
the videos is dressed.** Clothing adds width and barely changes skeletal height.

Equipment art died with the CDN and is unrecoverable. **So the clothes have to be
traced from the only place they still exist: the videos.** That is permitted —
`docs/MASTER_SPEC.md` covers tracing Lut's art — and it is the
opposite of inventing art to close a gap, which this project reverts on sight.

```
A5.1  pick and crop the tracing frames, per garment          ⬅ START HERE
A5.2  trace ONE garment end to end, prove the pipeline
A5.3  trace the remaining garments
A5.4  wire them into the slot map behind ?art=dressed
A5.5  measure, and re-prove the regression surface
```

---

## §P PREREQUISITES — ✅ ALL RESOLVED

**P1 — ✅ SESSION 18 IS COMMITTED AND GREEN.**
```
24c56ef SESSION18 A4.4: the whole fighter is on screen — and A4-D is escalated
19f7ea2 SESSION18 A4.3: the composer, red-first
c3a9352 SESSION18 A4.2: the other 13 fighter shapes, and the gate that was missing
fd1906a SESSION18 A4.1: hole rings become triangulation input, red-first

Test Files 44 passed (44)   Tests 742 passed (742)   tsc ×2 → 0   eslint → 0
bare clone (no reference/): 731 passed | 11 skipped, exit 0
in-browser fidelity: 41/41 probes + 14/14 scans = 55/55, pass: true
```
▶ **See the fighter:** `npm run dev` → `http://localhost:5173/?art=idle`
(add `&debug=1` for the 21-colour layer check).

**P2 — ✅ THE MATERIAL, INVENTORIED.** Both source videos are local and full HD:
```
reference/videos/Nr4fQstqHDM.mp4   1.0G
reference/videos/zFtCaTO0_1M.mp4   766M
```
Extracted stills, **with their real resolutions** (census run 2026-07-27):
```
duel_dense        42 files  1920x1080     broad_survey   240 files   480x270
duel_seq          18 files  1920x1080     wide_survey    100 files   480x270
duel_frames       16 files  1920x1080     survey          60 files   320x180
combat_frames     16 files  1920x1080     duel_candidates 45 files  1024x576
zFt_combat        14 files  1920x1080     map_analysis    20 files   512x288
combat_analysis   5 + 6     1920x1080
                 ───────────────────
                 117 in the sets above — but §P10's index found 448 full-res
                 frames in total, including a session11/ tree this manual
                 census missed. USE THE INDEX, not this table.
```

**P3 — ⚠️ TWO THIRDS OF THE FRAMES ARE UNUSABLE, AND SO IS THE OVERWORLD.**
Checked by cropping, not assumed:
- **The survey sets are 480×270 and 320×180.** They are for FINDING a moment
  (named in whole seconds — `Nr4fQstqHDM_0350.jpg` is t=350 s), never for tracing.
- ⛔ **THE OVERWORLD CAMERA IS ZOOMED OUT AND THE FIGHTER IS ~35 px TALL** even
  at full 1080p — a compressed brown smudge with no readable garment edges.
  Verified by pulling t=350 s from `zFtCaTO0_1M.mp4` at 1920×1080 and cropping.
  **Do not try to trace from an overworld frame.**
- ✅ **COMBAT frames put the fighter at ~270 px tall and crisp**, with flat colour
  panels and clean black outlines. **That is the tracing source.**

**P4 — ✅ ANY MOMENT CAN BE PULLED AT FULL RESOLUTION. Proven, not assumed.**
```
ffmpeg -hide_banner -loglevel error -ss <seconds> -i reference/videos/<id>.mp4 \
       -frames:v 1 -q:v 1 out.png -y     →  1920x1080
```
`/opt/homebrew/bin/ffmpeg` is installed. **Workflow: the low-res survey finds the
second, ffmpeg gets the quality.** Pillow is available for cropping and upscaling
(`Image.NEAREST` — keeps flat-colour edges honest; bilinear invents gradients
that are not in the source).

**P5 — ✅ THE ARCHITECTURE NEEDS ZERO CHANGES. This is the cheap part.**
The original composes a fighter by name — `getDefinitionByName(partType + art)`,
e.g. `torso` + `4001` (`FIGHTER_ART_IDS.md` §5). **Equipment REPLACES a part's
shape; it does not layer over it.** Our side already models exactly that:
- `src/config/ogPose.ts` → `OG_SLOT_SHAPES` is a plain array indexed by slot. A
  dressed fighter is **a second array**, not new code.
- **Slot 17 (hat) is already there and already EMPTY** — the kasa drops straight
  in, and `composePose` already applies the 17←16 alias so it will follow the
  head node. That alias is currently pinned only by a synthetic fixture
  (`tests/composePose.test.ts`); this session makes it real.
- `src/game/art/fighterShapes.ts` is the registry; add ids, nothing else.

**P6 — ✅ THE CONVERTER PIPELINE ALREADY EXISTS.**
`scripts/art/svgShape.ts` + `scripts/art/generate.ts` turn an SVG into committed
TypeScript with a provenance header. Its contract, which a traced SVG must meet:
- path commands **exactly `M L Q Z`** — quadratic only, no cubics, no arcs; it
  THROWS on anything else (fail-closed, deliberately);
- **flat solid fills only** — it THROWS on `fill-opacity` ≠ 1;
- **coordinates are shape-local with the joint pivot at (0,0)** — this is the one
  that will bite, see §3.2;
- strokes convert too, and `ffdec:original-stroke-width` beats `stroke-width`.
⚠️ **Regenerating must stay byte-identical** and the directory-wide re-derivation
test (`tests/svgShape.test.ts`) will check every committed shape — including the
new ones — the moment they land.

**P7 — ✅ A REAL PALETTE SAMPLE, from the frame this session should start with.**
`reference/frames/duel_frames/Nr4fQstqHDM_t426.8s.png`, crop (820,620)-(1020,900),
top colours by pixel count:
```
#373a4e  navy haori        #998a5e  straw kasa       #000000  outlines
#d9d8db  white hakama      #666666  grey shoulder armour
(#243012 / #253015 are the grass background — not the fighter)
```
⚠️ **These are VIDEO colours: lossy-compressed and possibly tinted by the scene.**
The OG art is 100 % flat solid colour, so each garment's true value is the modal
colour of its flattest interior region. **Sample per garment, take the mode, and
record the spread** — treat them as INFERRED targets, never as CONTRACT.

**P9 — ✅ HOW FAITHFUL CAN A TRACE BE? MEASURED AGAINST GROUND TRUTH.**
A traced *garment* cannot be checked — the original is gone. A traced *body part*
can, because we hold its exact vector data. `scripts/art/traceCalibration.py`
shrinks a real OG shape to video scale, puts it through the same lossy squeeze,
traces it back, and scores it against the truth. Run 2026-07-27:
```
 shape   world px  video px  jpeg           method     IoU  verts
  2664  12.8x15.3     32x39    95  potrace polygon   0.964     27
  2664  12.8x15.3     32x39    95   potrace curves   0.973     59
  2653  20.4x17.1     52x43    70  potrace polygon   0.947     39
  2646  19.4x23.7     49x60    70  potrace polygon   0.970     53
  2670  14.2x15.0     36x38    70  potrace polygon   0.931     47
```
⭐ **JPEG QUALITY BARELY MATTERS** — q95 and q70 agree to three decimals.
Compression is not the limit; **on-screen SIZE is** (`traceSizeSweep.py`):
```
  >= 20 px tall  →  0.93 – 0.99   trustworthy
  ~  12 px tall  →  0.80 – 0.84   marginal — label INFERRED, do not pretend
```
⚠️ **96 % IS THE CEILING, NOT THE FORECAST.** The harness degrades a CLEAN
render; a real frame adds background clutter, overlapping fighters and motion
blur, and the garment must be colour-separated first.
⚠️ **Two silent bugs this harness hit, both worth knowing before you write one:**
potrace traces **BLACK on WHITE** (feeding it white-on-black traces the
*background*, scoring 0.07–0.37 with no error), and it emits **y UP** from the
bottom-left while PIL is y-down (without the flip, scores were 0.15–0.75 and
varied with how y-symmetric the shape happened to be — a plausible wrong answer).

**P10 — ✅ THE FRAMES ARE INDEXED.** `scripts/art/frameIndex.py` →
`reference/frames/INDEX.json`, **448 full-res frames** (including a `session11/`
tree an earlier manual census missed entirely). It ranks candidates by figure
height and by the gap between two figures.
⚠️ **It is a SHORTLIST GENERATOR, not a locator** — verified by cropping what it
reports: on the frame checked, one box was a fence post and the other landed on
the fighters but merged both into one. **Trust the ranking, crop, then LOOK.**
⭐ **START HERE — the best tracing frame found:**
`reference/frames/combat_analysis2/Nr4fQstqHDM_t431.5.png`, crop
**(951,612)-(1278,898)**. The player's whole outfit is unoccluded and readable:
straw kasa, navy haori with red trim, patterned cream obi, white hakama.

**P8 — ✅ WHAT THE BARE FIGHTER MEASURES TODAY** (`tests/planPose.test.ts` owns
these; they are derived from the committed art, not transcribed):
```
composed silhouette   52.661 x 128.164 stage px      canvas: covered 53 x 128
head Ø 18.37 · shoulder 34.43 · mid-torso 25.84 · pelvis 27.09 · torso len 60.67
```
And the video-derived targets they are graded against (`reference/combat_idle_measurements.md`):
```
head Ø 28.4 · shoulder 42.7 · mid-torso 36.3 · pelvis 37.7 · torso len 59.9
total height (no kasa) 131.8            [3-source spread: ±3 % to ±10 %]
```

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

### D1 — ⛔ TRACE, THEN MEASURE. NEVER MEASURE, THEN ADJUST. ⭐
This is the load-bearing rule of the whole session. The clothes are traced from
the same footage the width targets were measured from, so **if anyone widens a
hakama because the pelvis number is coming up short, the measurement stops being
a test and becomes a mirror.** Trace what the outline shows. Then measure. If the
widths land in range unaided, that is real evidence the tracing is faithful; if
they do not, that is a real finding and it gets reported, not tuned away.
> **Veto:** none. This is the same discipline that made §P8's escalation possible
> instead of a quietly-passing gate.

### D2 — ONE outfit, end to end, before any second outfit
The player's duel outfit (navy haori + grey shoulder + white hakama + straw kasa),
because it is the one the tracing frame shows most clearly and the one a player
sees most. Every other outfit is the same work again with no new unknowns.
> **Veto:** pick the enemy's blue/white outfit instead — costs the same.

### D3 — A DRESSED fighter is a SECOND slot map, not a modified one
`OG_SLOT_SHAPES` stays exactly as it is and is still exercised by `?art=idle`.
The dressed fighter gets `OG_DRESSED_SLOT_SHAPES` and `?art=dressed`. Keeping the
bare route runnable is what preserves SESSION 18's evidence.
> **Veto:** none. This is SESSION 17 D4 applied again, and it cost nothing then.

### D4 — ⭐ TRACE WITH `potrace` IN POLYGON MODE, NOT BY HAND. MEASURED, NOT ASSUMED.
**This replaces the original plan of hand-tracing in a vector editor**, which was
written before anyone checked what a machine could do. §P9 measures it: potrace
recovers a **known** OG shape to **93–97 %** area agreement at video scale, and
polygon mode (`-a 0`) scores within 1 % of curve mode using **half the vertices**
— while emitting `M L L Z`, which is exactly what `scripts/art/svgShape.ts`
accepts. Curve mode emits cubic `C`, which that converter THROWS on.
A hand trace cannot beat 96 % and cannot be re-run when a setting changes.
Per garment: isolate by colour → 1-bit mask → potrace → SVG → existing converter.
> **Veto:** hand-trace anyway. *Recommended against* — slower, not more faithful,
> and not reproducible. Retracing after a parameter change costs one command.

### D5 — Grade against a HELD-OUT frame, not the tracing frame
Trace from one frame; overlay-check against a different frame at a different
moment. A tracing graded on its own source proves only that the tracer can copy.
> **Veto:** none.

---

## §2 THE BAR — binary, fixed before any code exists

| | Test | **THE NUMBER** |
|---|---|---|
| **A5-A** | The outfit exists as committed art | **≥ 5 new shapes, each with a provenance header, each regenerating BYTE-IDENTICAL** |
| **A5-B** | It composes | **`?art=dressed` draws the bare 21 parts + the outfit, 0 console errors, slot 17 non-empty for the first time** |
| **A5-C** | Widths become gradeable | **head Ø 28.4 · shoulder 42.7 · mid-torso 36.3 · pelvis 37.7 stage px, each ±15 %** |
| **A5-D** | Heights did NOT move | **total height still within ±5 % of 131.8; torso length still within ±15 % of 59.9** |
| **A5-E** | Held-out overlay | **traced from one frame, overlaid on a DIFFERENT frame, silhouette agreement stated as a number** |
| **A5-F** | Nothing regressed | **fidelity 55/55 · suite ≥742 green · bare clone green · `duel-baseline` green AND unedited** |

⚠️ **A5-C IS THE POINT OF THE SESSION AND IT IS ALLOWED TO FAIL.** If the traced
outfit still measures narrow, the permitted diagnoses are: **(a)** the garment was
traced at the wrong scale (check against a known landmark in the same frame);
**(b)** a garment is missing entirely (compare part count against the frame);
**(c)** the width target itself is wrong — in which case **re-measure it from the
frame and say so**, because §P7's own note says video colour and geometry carry
compression noise. **Adjusting a traced shape to hit a number is not on the list.**

---

## §3 WHAT WILL FIGHT YOU

1. ⛔ **THE PIVOT.** The converter expects shape-local coordinates with the joint
   pivot at (0,0), and IGNORES the wrapper `<g>` translate (it throws if that
   `<g>` is ever not a pure translation). A traced garment must be exported with
   its **own joint** at the origin — the hakama's pivot is the pelvic joint, not
   the top-left of the artboard. Get this wrong and every garment orbits the
   fighter's feet. **Trace one garment first (A5.2) precisely so this surfaces
   on one shape instead of six.**
2. **Curves.** The converter takes `M L Q Z` only. Most vector editors export
   cubic `C` by default. Convert to quadratic on export or the converter throws.
3. **The fighter is at 1.2× on our stage.** Traced pixels are VIDEO pixels at
   1080p; the OG stage is 1024×576, so video px ÷ 1.875 = stage px, and the art
   itself is authored in world px (stage ÷ 1.2). Two divisions, in that order.
4. **A garment REPLACES a part, it does not overlay it** (§P5). A dressed torso
   is a torso-shaped shape with clothing on it, not a shirt floating over a bare
   chest — unless the frame clearly shows otherwise, in which case say so.
5. **`reference/` is gitignored.** Traced SVGs live there; the committed `.ts` is
   the art. A runtime read of `reference/` is the bug (SESSION16 finding 4).
6. **The ratchet fires on new `game/` files.** Numbers to `src/config/`.
7. **A green suite is necessary and not sufficient.** SESSION 15 shipped 639
   green with a notch in the head's crown. **Look at the pixels.**

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them red, then code.**

### A5.0 — Confirm the baseline (1 minute)
`git log --oneline -1` → `24c56ef` · `npm test` → 44 files / 742 tests.

### A5.1 — Choose and crop the tracing frames ⬅ THE FIRST REAL WORK
Start from `duel_frames/Nr4fQstqHDM_t426.8s.png` (§P7). Find frames where the two
fighters are SEPARATED — several exist in `duel_dense`. Pull extras with ffmpeg
(§P4) if needed. **Record the frame path and timestamp for every garment**, the
way commands-with-output are recorded elsewhere. **Gate: one crop per garment,
each showing that garment unoccluded.**

### A5.2 — Trace ONE garment end to end
The **kasa**, because it is the largest (≈140 video px wide — comfortably inside
§P9's trustworthy band), the least occluded, and it drops into the already-empty
slot 17 — so it exercises the whole path (colour-isolate → potrace → SVG →
converter → registry → slot map → screen) on the simplest possible subject.
**Gate: A5-A for one shape, and it appears on screen at the head node.**
💡 Expected garment sizes on screen, from §P9's band: kasa ≈140 px and hakama
≈83 px are safe; the **obi is ≈15 px and is the one at risk** — if it lands under
0.90, label it INFERRED rather than pretending (§6 Risk 2).

### A5.3 — Trace the rest
Haori, shoulder armour, sleeves, obi, hakama. **Gate: A5-A for all.**

### A5.4 — `?art=dressed`
`OG_DRESSED_SLOT_SHAPES` beside the bare one; the existing scene takes the map as
a parameter. **Gate: A5-B.**

### A5.5 — Measure and re-prove
**Gate: A5-C + A5-D + A5-E + A5-F. Screenshot it and READ THE PIXELS.**

### A6 handoff
`RESUME_HERE.md` and `docs/DIVERGENCES.md` in the SAME commit as the change each
describes. **Write the SESSION 20 kickoff.**

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Baseline `24c56ef` / 742 green | `git log -1` + `npm test` |
| 2 | ≥5 new shapes, provenance headers, byte-identical regeneration | `git show --stat` + re-run generate |
| 3 | Every garment cites its frame path + timestamp | the ledger entry |
| 4 | `?art=dressed` draws; slot 17 non-empty; 0 console errors | pasted |
| 5 | `?art=idle` still draws the BARE fighter, unchanged | screenshot both |
| 6 | 4 widths within ±15 % — **or a stated, diagnosed miss** | measured, pasted |
| 7 | Heights unmoved (±5 % height, ±15 % torso length) | measured, pasted |
| 8 | Held-out overlay agreement stated as a number | pasted |
| 9 | Nothing in the render path reads `reference/` | grep |
| 10 | Ratchet not widened; numbers in `src/config/` | the diff |
| 11 | Fidelity 55/55 · suite green · bare clone green · `duel-baseline` unedited | pasted |
| 12 | Nothing from `reference/` committed | `git status` + history |
| 13 | Ledgers + `RESUME_HERE` in the same commit as their change | `git show --stat` |
| 14 | SESSION 20 kickoff written, committed, graded | the file + its bar self-report |

---

## §6 THE TWO REAL RISKS

**Risk 1 — the tracing is graded against its own source.** D1 and D5 exist for
this, and neither is self-enforcing: a person can always nudge a curve. The
mitigation that IS mechanical is A5-E's held-out frame — a tuned-to-fit garment
gets no easier to overlay on a moment it was not traced from. **If A5-C passes and
A5-E does not, believe A5-E.**

**Risk 2 — video compression is not a fine enough ruler for small garments.** The
fighter is ~270 px tall, so the obi is perhaps 12 px of it, blurred across two or
three. Large garments (kasa, hakama, haori) will trace cleanly; small ones may
not, and the honest outcome for those is a labelled INFERRED shape, not a
confident one. **Say which is which in the provenance header.**

---

## §7 QUEUED — deliberately NOT in this session

- **The other 481 poses.** This session dresses ONE pose.
- **Other outfits, armour tiers, real weapons** — same work, no new unknowns.
- **SESSION 14 A5 + A6** — mob AI cadence, hitbox blocking, turn-taking.
- **All audio.** Still completely silent. The audio study pass is the next
  research session worth running, and `REBUILD_READINESS.md` §5 Tier 1 item 3
  says it is closable from the videos we already hold.
- The 5 overlapping ring pairs, alpha support, gradient/bitmap fills.

---

## §8 BAR SELF-REPORT

**Does this kickoff reach the bar? Yes.**

- **There is no research step, and it is checkable.** The frame inventory is a
  census with resolutions; the overworld was RULED OUT by pulling a real frame
  and cropping it, not by assuming; ffmpeg full-res extraction was executed and
  its output size quoted; the palette is a real pixel-count sample from a named
  crop of a named frame.
- ⭐ **It kills two thirds of its own source material on the first page.** 240
  broad-survey frames, 100 wide-survey, 60 survey and 45 duel-candidates are all
  too small to trace from, and the overworld camera is unusable at ANY resolution.
  Saying so in §P3 is worth more than the frames were.
- ⭐ **It names the architectural fact that makes the work cheap:** equipment
  replaces a part by id, slot 17 is already empty and already aliased, and the
  slot map is data — so a dressed fighter is a second array, not new code.
- ⭐ **It replaced its own plan when a measurement contradicted it.** D4 said
  "trace in a vector editor" until §P9's calibration showed a machine recovers a
  known OG shape to 93–97 % — better than a hand can, reproducible, and in the
  one output format the existing converter accepts. The kickoff carries the
  measurement, the two silent bugs it hit, and the ceiling caveat.
- ⭐ **Its load-bearing rule is a discipline, not a number.** D1 — trace, then
  measure, never measure then adjust — is the only thing separating this session
  from marking its own homework, and §6 Risk 1 admits it is not self-enforcing
  and names the one mechanical check that is.
- **The bar can FAIL, and A5-C is explicitly allowed to.** Three diagnoses are
  permitted and "adjust the shape until it passes" is explicitly not one of them.
- **It admits what it cannot do:** §6 Risk 2 concedes small garments may be below
  the resolution of the source, and prescribes labelling them INFERRED rather
  than pretending.

**What it deliberately does not promise:** that the traced outfit will make the
widths pass — only that it will make them *gradeable*, which is the thing SESSION
18 proved they were not.
