# SESSION 21 KICKOFF — MAKE THE FIGHTER LOOK LIKE THE PICTURE

> **Entry route:** `RESUME_HERE.md` → this file. **This is the only kickoff you
> need.** Self-contained; assumes no memory of SESSION 20.
>
> **INTENT, in one sentence:** the silhouette gate has saturated — it now scores
> ABOVE the source's own frame-to-frame ceiling while the fighter still plainly
> does not look like the source — so this session replaces the ruler with a
> colour-aware one and closes the five differences it exposes.
>
> **⭐ THE OWNER ASKED FOR THIS SESSION, IN THESE WORDS (2026-07-28):**
> *"it still is not perfect and needs to be improved… where you need to check
> your work and compare it to the og picture."* He is right, and the
> side-by-side in §0 is the evidence.
>
> **⛔ THE STANDING INVARIANT:** **THE TWO GAMEPLAY VIDEOS ARE THE PRIMARY 1:1
> REFERENCE** (`reference/videos/`). Copy what is in them. **Open a frame and
> look** before grading any visual claim; when a measurement doc and a frame
> disagree, **the frame wins.**
>
> **⭐ AND THE ONE SESSION 20 PAID FOR TWICE:** **a green gate is not a good
> picture.** Two changes last session scored better and rendered worse — one a
> nearly-bare torso, one trousers round the knees. **LOOK before believing a number.**
>
> **Other standing rulings:** RECREATE-NEVER-RIP for dialogue and names ·
> **Duels-not-SHS** · single-player-first · `core/` zero numeric literals ·
> **render-only scenes** · **red-first TDD** · chaos-plant every guard ·
> **binary gates, never softened to fit a result**.
>
> ⚡ **THERE IS NO RESEARCH STEP.** Every number below was produced by a command
> run during SESSION 20 and is quoted with its output.

---

## §0 THE ONE IDEA THAT GOVERNS THIS SESSION

**The ruler has run out of road.**

```
sealed profile agreement   tracing 0.9006   held-out 0.8619
diagnostic agreement       tracing 0.9185   IoU 0.7499
the source's own two frames, against each other        0.8808
```
**We now score HIGHER against a source frame than the source's own two frames
score against each other** — and the fighter still does not look like it.

▶ **Look at it. One command, and it is the whole argument for this session:**
```
npx vite-node scripts/art/renderPose.ts -- dressed --out renders/d.png --json renders/d.json
python3 scripts/art/compareToSource.py renders/d.json      # writes renders/side_by_side.png
open renders/side_by_side.png
```

⇒ **A width profile cannot see what is left.** It is blind to colour, to
interior detail, and to anything that is not the outer boundary. Everything in
§P4 below is invisible to it, and one item — **the fighter is not carrying his
sword** — is invisible to it while being the first thing an eye lands on.

```
A8.1  the colour-aware comparator — the new ruler          ⬅ START HERE
A8.2  the sword: trace the saya + tsuka from the video
A8.3  the hakama reads as ONE robe, not two trouser legs
A8.4  colour: our fills are measurably dark
A8.5  the juban collar, and the head
A8.6  re-grade everything; gates; handoff
```

---

## §P PREREQUISITES — ✅ ALL RESOLVED, NOTHING TO GO AND FIND

**P1 — ✅ SESSION 20 IS COMMITTED AND GREEN.**
```
757438c SESSION20 CLOSED: the height diagnosis corrected, and the kickoff
57dd541 A6.4: the loop ran - one winner of twelve, and a hole in its own score
10f1d88 A6.5 (gi): the loop overturned its own bar, and the scores went up
9aa9cb7 A6.3: the score becomes a committed floor - GATE A6-C MET
6ec8d04 A6.2: the comparator - GATE A6-B MET, baseline committed before tuning
586e344 A6.1 part 2: the pipeline was untested, and a mutant proved it
eff0c2f A6.1: the headless render - GATE A6-A MET

Test Files 48 passed (48)   Tests 822 passed (822)   tsc x2 -> 0   eslint -> 0
clean clone (no reference/): 47 files, 799 passed | 11 skipped, exit 0
in-browser fidelity: 41/41 probes + 14/14 scans = 55/55, pass: true
```

**P2 — ✅ THE TOOLING EXISTS. Nothing in A8.1 starts from zero.**
```
scripts/art/rasterise.ts       DrawOp[] -> pixels -> PNG, pure, zero deps
scripts/art/poseScene.ts       compose -> plan -> crop -> rasterise (shape map INJECTED)
scripts/art/renderPose.ts      the CLI  (--out --mask --json --slots --full)
scripts/art/silhouette.ts      widthProfile + profileAgreement (the SEALED score)
scripts/art/sourceProfile.ts   the source's 19 measurements per frame, COMMITTED
scripts/art/scorePose.ts       the sealed score as JSON, on demand
scripts/art/tuneAnchors.py     the loop: retrace -> regenerate -> render -> score -> rank
scripts/art/compareToSource.py per-slot error, an OVERLAY, and a colour SIDE-BY-SIDE
scripts/art/traceGarment.py    frame -> mask -> potrace -> SVG -> committed .ts
```
⭐ **`compareToSource.py` already writes `renders/side_by_side.png`** — ours
beside the source at matched height, in colour. A8.1 extends that file; it does
not replace it.

**P3 — ✅ THE TRACING PIPELINE WORKS AND NEEDS NO CONVERTER CHANGES.**
`traceGarment.py`: frame → ink-bounded mask → potrace polygon → SVG →
`svgShape.ts` (untouched) → committed TypeScript. **Adding a garment is one dict
entry** in its `GARMENTS` table (crop, seed, target slot, part bbox, anchor).
Its settings were chosen by measurement, not by eye: `UPSCALE=4` +
Douglas-Peucker `0.10` scored **0.9831** mean IoU recovering four KNOWN OG shapes
from video-scale degraded copies, against 0.9735 for the naive threshold.

**P4 — ⛔ THE FIVE DIFFERENCES, FOUND BY LOOKING AT `side_by_side.png`.**
Ordered by how much of the picture they own. **Do not re-derive these.**

1. ⛔ **HE IS NOT CARRYING HIS SWORD, AND IT IS THE FIRST THING THE EYE LANDS ON.**
   The source shows the **tsuka (hilt) jutting forward-left at chest height** and
   the **saya (scabbard) running down behind past the knee**. We draw neither.
   ⚠️ Slots 3 (weapon) and 4 (prop) are EMPTY BY DESIGN — they are the OG's own
   `weapon13000`/`prop13000` "none" placeholders, and the equipment art died with
   the CDN. **But the sword is fully visible in the video and is traceable
   exactly as the seven garments were.** It also already interferes with our
   measurements: `traceGarment.py`'s `reject_occluder` exists solely to carve the
   saya OUT of the hakama, and A6.2 found the source's silhouette carries a sword
   ours cannot, which puts our achievable agreement BELOW the 0.8808 ceiling.
2. ⛔ **THE HAKAMA READS AS TWO BAGGY TROUSER LEGS; THE SOURCE IS ONE COLUMN.**
   `9011` is drawn twice, at slots 11 AND 7, so our lower body is two separate
   legs with a gap between them and scalloped hems. The source's white garment is
   a **single continuous mass** from the obi to the ankle. This is the largest
   remaining silhouette error.
   ⚠️ Drawing one leg shape at both slots is what the OG ITSELF does (2678 at 7
   and 11, 2648 at 6 and 10), so the *mechanism* is right — what is wrong is that
   our traced leg is a TROUSER and the source's is a SKIRT.
3. ⛔ **OUR FILLS ARE MEASURABLY DARK.** 7×7 medians on `zFt_0061`:
   ```
   garment          source rgb          ours                delta
   robe / hakama    (220, 213, 219)     0xc8c3c5 (200,195,197)   ~20 levels DARK
   kasa straw       (167, 126,  61)     0x8e6f38 (142,111, 56)   ~25 levels DARK
   gi jacket        (104, 101, 104)     0x6e6b6d (110,107,109)   within 6 - fine
   ```
   Suspect `trace_one`'s fill sampling: it erodes the interior and takes a median
   under a 5×5 median filter, which pulls in outline-adjacent pixels and drags
   light garments down. **The gi is fine, so it is not a global gamma issue.**
   ⚠️ Two sample points (collar, saya) landed on the wrong garment and are NOT
   reported above — re-sample properly rather than trusting hand-picked pixels.
4. ⛔ **THE JUBAN COLLAR DOES NOT READ.** The source has a **bold white collar**
   wrapping the neck and running down the chest — a major light shape against the
   grey jacket, and one of the outfit's most recognisable features. Ours (`9012`)
   is a small dark sliver.
5. ⚠️ **THE FACE AND HAIR.** The source shows a clear profile with a distinct
   black hair mass; ours is a small tan patch under a dark blob. Partly the known
   head-art difference (the source's hair measures **20.4 × 24.0** world px
   against our shape 2670's **14.2 × 15.0**), so this may not be fully fixable —
   grade it, do not assume it.

**P5 — ✅ WHAT THE CURRENT GATES PIN, AND WHY THEY WILL FIGHT YOU.**
```
tests/a6Score.test.ts     FLOOR_TRACING 0.9005 · FLOOR_HELDOUT 0.8618
                          + a HEIGHT CEILING of 140.5 stage px
tests/poseRender.test.ts  GOLDEN_DRESSED digest, op census, ink box, crop
```
⚠️ **Every change in this session moves the golden digest** — that is expected
and correct; update it in the SAME commit, saying why. **The score floors are
different: they may only move UP.** If an appearance fix costs silhouette
agreement, that is a real trade — **report it, do not lower the floor.**
⚠️ **The height ceiling is load-bearing.** The profile score is scale-free, so a
taller fighter costs it nothing; A6.4's best-scoring variant of twelve grew the
figure 5.5 % and rendered trousers round the knees.

**P6 — ⭐ THE HEIGHT DIAGNOSIS SESSION 19 CARRIED IS WRONG, AND THIS IS THE PROOF.**
```
                       stage px   video px    vs the source
our BARE fighter (no hat)  128.2      240.3      +1.5%
our DRESSED fighter        140.5      263.4     +11.3%
the SOURCE, hat included   126.2      236.7
```
**The skeleton is within 1.5 % of the source's fully-equipped fighter.** The whole
overshoot is the kasa's 23.1 video px. The scale is not in doubt:
`src/config/fidelity.ts` states the study frames are full-bleed 16:9 mapping 1:1
to our 1024×576 stage (1920/1024 = 1.875), and **55/55 fidelity probes pin HUD
positions through that mapping.** Pushing the brim deeper shortens the figure AND
costs held-out agreement (0.8619 → 0.8375 → 0.8247) — **open, measured, for an
owner ruling. Do not tune it away.**

**P7 — ⚠️ THE TRAPS SESSION 20 PAID FOR. Do not re-learn these.**
1. ⛔ **A GREEN GATE IS NOT A GOOD PICTURE.** Carving the sleeve out of the gi —
   which SESSION 20's own kickoff prescribed — scored plausibly and rendered a
   nearly-bare torso. Lowering the hakama 15 world px scored **best of the whole
   sweep** (held-out 0.8781, frames within 0.0067) and rendered trousers round
   the knees. Both caught only by looking.
2. ⛔ **RANK ON THE HELD-OUT FRAME, NEVER A MEAN.** A mean will buy an overfit.
3. ⛔ **NEVER GATE ON A PNG's BYTES.** `deflateSync` output depends on the zlib
   Node was built with, and CI runs a different Node from the dev Mac. Gate on
   `rasterDigest` — the PIXELS.
4. ⛔ **REGENERATE EVERY SHAPE WHEN SWEEPING.** `tuneAnchors.py` first
   regenerated only the ids each variant touched, so every row inherited the
   previous variant's art. Caught only because two different variants returned
   byte-identical scores.
5. ⛔ **`poseRaster.ts` is the ONLY file a test cannot reach** (it imports
   `src/game/**`). Everything else takes the shape map as an argument. Keep it
   that way: a mutant that swapped the dressed/bare slot map, deleted the
   backdrop guard AND moved the crop by a pixel once passed all 46 test files.
6. ⚠️ **The canvas is TRANSPARENT on `?art=` routes.** The headless renderer
   composites magenta and records it; a browser screenshot needs a backdrop.

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

### D1 — ⛔ THE LOOP MAY STILL TUNE **PLACEMENT** ONLY. NEVER A TRACED OUTLINE.
Unchanged from SESSION 20 and still load-bearing. Outlines are measured from the
source; anchors were always INFERRED. **A NEW TRACE is not a violation** — it is
new measurement. **Editing a vertex to improve a score is.**
> **Veto:** none. Fitting an outline to a score turns a test into a mirror.

### D2 — THE SWORD IS TRACED, NOT INVENTED
It goes on slot 3 (weapon), the OG's own slot for it, from the same frame and the
same pipeline as the seven garments.
> ⚠️ **State the limit:** the OG's `weapon13000` is empty, so this is OUR sword
> for the LOOK, not a recovery of the original asset. Say so in its header.
> **Veto:** leave slots 3/4 empty — *recommended against*; it is the single
> largest visible difference and the source shows it plainly.

### D3 — APPEARANCE GETS ITS OWN SCORE, BESIDE THE SILHOUETTE ONE, NOT INSTEAD
The silhouette floors stay and keep ratcheting. The new colour score is a second
committed number. **Two rulers, both stated** — the same discipline that keeps
the SEALED and DIAGNOSTIC scores from being quoted as each other.
> **Veto:** replace the silhouette score — *recommended against*, it is the only
> gate that survives without `reference/`.

### D4 — RE-SAMPLE COLOUR PROPERLY, DO NOT HAND-PICK PIXELS
Two of seven hand-picked samples in §P4.3 landed on the wrong garment. Sample
each garment from the traced MASK's own interior, which is exactly the region the
fill belongs to.
> **Veto:** none. Hand-picked pixels are how §P4.3 nearly shipped two wrong numbers.

---

## §2 THE BAR — binary, fixed before any code exists

| | Test | **THE NUMBER** |
|---|---|---|
| **A8-A** | A colour ruler exists | **a committed per-garment colour comparison: for each traced fill, the source's own median vs ours, in RGB, from the mask's interior — not hand-picked pixels** |
| **A8-B** | The sword is on screen | **slots 3/4 carry traced saya + tsuka; the render shows a hilt forward of the chest and a scabbard past the knee** |
| **A8-C** | The lower body reads as one garment | **the hakama's silhouette has NO interior gap between the legs above the knee, measured on the coverage mask** |
| **A8-D** | Colour is within tolerance | **every traced fill within 12 levels per channel of the source's median for that garment** |
| **A8-E** | The silhouette did not regress | **sealed held-out ≥ 0.8618 AND the height ≤ 140.5 stage px — floors NOT lowered** |
| **A8-F** | Nothing else regressed | **fidelity 55/55 · suite ≥822 green · bare clone green · `duel-baseline` green AND unedited · ratchet not widened** |

⚠️ **A8-E IS ALLOWED TO BIND.** Adding a sword makes our silhouette wider and may
COST silhouette agreement even as the picture improves. **If it does, say so,
show both numbers, and ask — do not lower the floor.** That trade is exactly the
kind of thing the owner should rule on.

---

## §3 WHAT WILL FIGHT YOU

1. ⛔ **THE SAYA IS THE REASON `reject_occluder` EXISTS.** The scabbard crosses
   the far leg and is enclosed by the same ink, so "the region inside the outline"
   swallows it. Tracing the sword means tracing the very thing the hakama trace
   is built to exclude — **expect to fight the same hue separation from the other
   side**, and expect the far leg to need re-checking afterwards.
2. ⛔ **A WIDER SILHOUETTE CAN LOWER THE SCORE.** See A8-E. The score is not the
   goal; the picture is. Report both.
3. **The source's feet are hidden in GRASS.** Ours are drawn. Any comparison at
   the hem is measuring our feet against grass — do not "fix" the feet to match
   an occlusion.
4. **`reference/` is gitignored.** Comparators live in `scripts/`, and the
   clean-clone run is what proves nothing reads it at runtime.
5. **The `game/` ratchet fires on new numeric literals.** Numbers go to `src/config/`.
6. **Traced ids are ≥ 9000 and nothing else is.** The provenance gate checks both
   directions; a new shape needs its header naming frame, timestamp, crop,
   approximations and inferences, or it fails.

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them red, then code.**

### A8.0 — Confirm the baseline (1 minute)
`git log --oneline -1` → `757438c` · `npm test` → 48 files / 822 tests.

### A8.1 — The colour ruler ⬅ THE FIRST REAL WORK
Extend `compareToSource.py`: per garment, the source's median colour taken from
that garment's own traced mask, against our committed fill. **Gate: A8-A.**
Commit the table BEFORE changing any colour (the A6.2 discipline: measure first).

### A8.2 — The sword
A new `GARMENTS` entry for the saya and one for the tsuka, onto slots 3 and 4.
**Gate: A8-B.** Look at it, then re-run the silhouette score and report the trade.

### A8.3 — The hakama as one garment
**Gate: A8-C.** ⚠️ The mechanism (one shape at both leg slots) is what the OG
does — the fix is the traced SHAPE, not the slot map.

### A8.4 — Colour
**Gate: A8-D.** Fix the fill sampling in `trace_one`, retrace, re-measure.

### A8.5 — The collar, and an honest verdict on the head
**Gate: A8-A re-run.** The head may not be fixable (different source art) — grade
it and say which.

### A8.6 — Re-grade, gates, handoff
**Gates: A8-E, A8-F.** `RESUME_HERE.md` and `docs/DIVERGENCES.md` in the SAME
commit as the change each describes. **Write the SESSION 22 kickoff.**

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Baseline `757438c` / 822 green | `git log -1` + `npm test` |
| 2 | Per-garment colour table, from masks not pixels | pasted table |
| 3 | Sword on screen, hilt forward, scabbard past the knee | `side_by_side.png` |
| 4 | No interior gap in the hakama above the knee | measured on the mask |
| 5 | Every fill within 12 levels per channel | pasted table |
| 6 | Sealed held-out ≥ 0.8618, height ≤ 140.5 — floors NOT lowered | `git diff tests/a6Score.test.ts` |
| 7 | `?art=idle` still draws the BARE fighter | screenshot on a backdrop |
| 8 | Fidelity 55/55 · suite green · bare clone green | pasted |
| 9 | `duel-baseline` green AND unedited; ratchet not widened | `git diff` |
| 10 | Nothing in the render path reads `reference/` | grep + clean clone |
| 11 | Nothing from `reference/` committed | `git status` + history |
| 12 | Ledgers + `RESUME_HERE` in the same commit as their change | `git show --stat` |
| 13 | **A human looked at `side_by_side.png` and said which of §P4's five closed** | the verdict, in the commit |
| 14 | SESSION 22 kickoff written, committed, graded | the file + its bar self-report |

---

## §6 THE TWO REAL RISKS

**Risk 1 — the score goes down while the picture goes up, and the floor gets
lowered to "fix" it.** Adding a sword widens our silhouette; the source's frames
carry one, so agreement should IMPROVE — but the saya's exact hang is inferred
and it may not. **Mitigation: A8-E forbids lowering the floor. If the trade is
real, both numbers go in the commit and the owner rules.**

**Risk 2 — chasing pixels the video cannot resolve.** The fighter is ~233 video px
tall and JPEG-compressed; SESSION 19's own calibration says a garment under ~12 px
on screen traces at 0.80–0.84 IoU and should be labelled INFERRED rather than
pretended. **Mitigation: the tsuka is small. Trace it, measure it, and if it comes
back below that bar, say INFERRED in its header and move on.**

---

## §7 QUEUED — deliberately NOT in this session

- ⛔ **PUT THE OG FIGHTER IN THE GAME.** `DuelScene.ts:691` still calls
  `drawSamurai`, and `grep -rln "composePose" src/game/` returns exactly
  `IdleFighterScene.ts` — **a debug route.** Three sessions of fighter work that
  the game does not draw. This was SESSION 21's plan until the owner looked at
  the render and said it is not good enough yet; **it is SESSION 22, and the
  gates it needs are already written** (placeable, mirrorable, both combatants,
  appearance digest UNCHANGED).
- **The other 157 animations.** `reference/extracted/bindata/108_1t4635s0.bin`
  holds them all; ONE frame of ONE is transcribed.
- **The kasa height trade** (§P6) — measured, open, owner ruling.
- **Other outfits** — the navy duel outfit from `Nr4fQstqHDM`.
- **SESSION 14 A5 + A6** — mob AI cadence, hitbox blocking, turn-taking.
- **All audio.** Still completely silent, and still the research session most
  worth running.

---

## §8 BAR SELF-REPORT

**Does this kickoff reach the bar? Yes.**

- **There is no research step, and it is checkable.** Every number in §P came
  from a command run during SESSION 20 and is quoted with its output — the score
  table, the colour medians, the height arithmetic, the commit list.
- ⭐ **It opens by retiring its own predecessor's instrument.** The silhouette
  score now reads ABOVE the source's own frame-to-frame ceiling while the fighter
  visibly does not match. A ruler that cannot fail is not measuring any more, and
  that single fact is the argument for the whole session.
- ⭐ **§P4 is five differences found by LOOKING at a picture**, ordered by how
  much of the frame they own, each with the evidence and the suspected cause —
  and the biggest of them (no sword) is one a silhouette score can never surface.
- ⭐ **It marks its own weak evidence.** Two of the seven colour samples landed on
  the wrong garment; they are excluded and D4 makes re-sampling from the mask a
  decision rather than an afterthought.
- ⭐ **A8-E can BIND against the session's own goal**, and the response is written
  in advance: adding a sword may cost silhouette agreement, and the answer is to
  report both numbers and ask — never to lower a floor.
- **It carries SESSION 20's traps forward as a list of things that each cost a
  wrong answer once**, including the two changes that scored better and rendered
  worse.

**What it deliberately does not promise:** that the fighter will be perfect. The
source is a compressed 233-px-tall figure in a video; §6 Risk 2 names the floor
below which tracing is honest guesswork. It promises that the five differences
anyone can see in `side_by_side.png` are each either closed or explained.
