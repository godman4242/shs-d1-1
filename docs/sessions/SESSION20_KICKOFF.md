# SESSION 20 KICKOFF — BUILD THE LOOP THAT GRADES THE FIGHTER, THEN LET IT FIX HIM

> **Entry route:** `RESUME_HERE.md` → this file. **This is the only kickoff you
> need.** Self-contained; assumes no memory of SESSION 19.
>
> **INTENT, in one sentence:** build a closed render→compare→score loop against
> the source frames, put its score under a committed gate, and use it to correct
> the traced outfit's PLACEMENT until the number stops improving.
>
> **⛔ THE STANDING INVARIANT:** **THE TWO GAMEPLAY VIDEOS ARE THE PRIMARY 1:1
> REFERENCE** (`reference/videos/`). Copy what is in them. **Open a frame and
> look** before grading any visual claim; when a measurement doc and a frame
> disagree, **the frame wins** — SESSION 19 proved that twice over.
>
> **⭐ THE OWNER ASKED FOR THIS SESSION, IN THESE WORDS (2026-07-27):**
> *"i feel if you follow the source material and automatically compare and
> iterate yourself in a loop until it looks like the source material you will be
> fine."* He is right, and SESSION 19's own error log is the evidence.
>
> **Other standing rulings:** RECREATE-NEVER-RIP for dialogue and names ·
> **Duels-not-SHS** · single-player-first · `core/` zero numeric literals ·
> **render-only scenes** · **red-first TDD** · chaos-plant every guard ·
> **binary gates, never softened to fit a result**.
>
> ⚡ **THERE IS NO RESEARCH STEP.** Every number below was produced by a command
> run during SESSION 19 and is quoted with its output.

---

## §0 THE ONE IDEA THAT GOVERNS THIS SESSION

**SESSION 19 dressed the fighter, and every single defect in that outfit was
found by a human eye — never by a gate.**

| defect | who found it | how long it survived |
|---|---|---|
| the hakama hung 18 world px too low | the assistant, on first render | one step |
| **the SLEEVE was assigned to the TORSO slot** | **the owner** | a whole step, and it shipped |
| the kasa sat too high (brim 0.40 → 0.60) | a height measurement, after the fact | two steps |
| **the gi is 1.76× oversized and rises into the neck** | **the owner** | shipped, still open |

The suite was **750 green** through all of it. Typecheck 0, eslint 0, fidelity
55/55. **None of those gates can see a garment in the wrong place**, because
nothing in the repo compares the rendered fighter to the source.

⇒ **This session builds that comparison and puts it under a gate.** The outfit
fixes are the *demonstration* that the loop works, not the point.

```
A6.1  headless render — planPose's DrawOps → a PNG, no browser   ⬅ START HERE
A6.2  the comparator — per-part score against the source frame
A6.3  the gate — the score becomes a committed number the suite holds
A6.4  run the loop — correct PLACEMENT until the score stops improving
A6.5  the three open defects, re-graded by the loop, not by eye
```

---

## §P PREREQUISITES — ✅ ALL RESOLVED, NOTHING TO GO AND FIND

**P1 — ✅ SESSION 19 IS COMMITTED AND GREEN.**
```
4526131 A5.5: measured against pre-committed targets — A5-C 3/4, A5-E strong
00c6628 A5.5 step 1: the A5-C target set, committed BEFORE measuring ours
290ebec A5.4: the sleeves — and A5.3 had put a sleeve on the torso slot
08537df A5.3: the rest of the outfit — GATE A5-A MET, 5 traced garments

Test Files 44 passed (44)   Tests 750 passed (750)   tsc ×2 → 0   eslint → 0
bare clone (no reference/): 739 passed | 11 skipped, exit 0
in-browser fidelity: 41/41 probes + 14/14 scans = 55/55, pass: true
```
▶ **See it:** `npm run dev` → `?art=dressed` (outfit) · `?art=idle` (bare).
⚠️ **The canvas is TRANSPARENT on those routes.** A black outline over a black
page is invisible — SESSION 19 spent a round "fixing" an outline that was
already correct. **Put a backdrop behind it before judging anything.**

**P2 — ✅ THE OUTFIT EXISTS: 7 TRACED GARMENTS, ALL GATED.**
`src/game/art/generated/shape90NN.ts`, ids **≥ 9000 are traced and nothing else
is**. Each header names its source frame, timestamp, crop, approximations and
inferences, and the provenance gate **checks both directions** — traced art
claiming an FFDec export fails, and payload art claiming to be traced fails too.
```
9017 kasa   →17     9012 collar →12     9015 gi body →15
9019 sleeve →19      9001 sleeve →1     9014 obi    →14     9011 hakama →11 AND 7
```
Slot map: `OG_DRESSED_SLOT_SHAPES` in `src/config/ogPose.ts` — a **per-slot
override table** over the bare map, never an edited copy of it.

**P3 — ✅ THE TRACING PIPELINE WORKS AND NEEDS NO CONVERTER CHANGES.**
`scripts/art/traceGarment.py`: frame → ink-bounded mask → potrace polygon → SVG →
`scripts/art/svgShape.ts` (untouched) → committed TypeScript. Retracing after a
parameter change is **one command**.
⭐ **Its settings were chosen by measurement, not by eye** — four known OG shapes
shrunk to video scale, degraded, traced back, scored against the truth:
```
  base (threshold at 1x)          0.9735
  up4  (bicubic 4x then threshold) 0.9825
  up8                              0.9822   plateaus, 2x the vertices
  up4 + Douglas-Peucker 0.10       0.9831   BEST, vertex count ≈ base
```

**P4 — ✅ THE SOURCE, AND THE ONE FRAME THAT MATTERS.**
**Trace/compare against `reference/frames/s19_trace/zFt_0061.png`** — t = 590.0 s
of `zFtCaTO0_1M`, the **watermark-free** video. Lone fighter, clean side profile
(the rig's own view), every garment unoccluded. **Held-out frame for grading:
`zFt_0071.png`** (t = 595.0 s). Regenerate the whole burst with:
```
ffmpeg -hide_banner -loglevel error -ss 560 -i reference/videos/zFtCaTO0_1M.mp4 \
       -t 62 -vf fps=2 -q:v 1 reference/frames/s19_trace/zFt_%04d.png -y
```
⭐ **Proven byte-exact:** re-pulling t = 598.383 s and differencing it against the
committed `session11/…/t598.383.png` gives **mean absolute difference 0.00**.

**P5 — ✅ THE MEASURING TOOLS ALREADY EXIST.**
- `scripts/art/proportions.py` — one segmentation rule applied to BOTH the source
  frames and our own render, so comparisons are like-for-like. Emits a
  height-normalised width profile plus four landmarks.
- `scripts/art/outfitFrames.py` — `scan` / `measure` / `clusters`, each rendering
  an overlay image. **Look at the overlay; do not read the numbers alone.**
- **The A5-C target set is COMMITTED** (13 lone standing frames, HUD suppressed),
  as fractions of the figure's own height — scale-free:
```
  head 0.1797 sd 0.0347 | shoulder 0.3279 sd 0.0559
  midTorso 0.3416 sd 0.0283 | pelvis 0.3332 sd 0.0553
  height 236.7 video px, range 227..250
```

**P6 — ✅ WHERE EVERY DRESSED PART CURRENTLY LANDS.** Stage px, from the real
planner (`composePose` → `planPose` → `inkedBounds`), run 2026-07-27:
```
slot part          x0..x1            y0..y1            w x h
  17 KASA          481.6..538.9      290.9..316.7      57.2 x 25.9
  16 head+hair     501.5..519.8      303.2..325.3      17.7 x 19.7
  12 COLLAR        499.0..521.2      307.9..339.5      22.2 x 31.6
  15 GI BODY       489.4..530.4      311.9..362.3      41.1 x 50.4   ⛔ see §0
  19 SLEEVE near   486.3..514.1      326.5..374.0      27.8 x 47.5
   1 SLEEVE far    495.5..507.1      324.8..350.6      11.7 x 25.8
  20 lowarm near   494.2..509.5      352.3..375.7      15.3 x 23.4   bare, correct
  14 OBI           501.3..515.3      356.4..369.5      14.1 x 13.0
  11 HAKAMA near   498.4..532.9      358.7..418.7      34.5 x 60.0
   7 HAKAMA far    474.9..520.7      359.5..422.5      45.8 x 63.0
   9 foot near     511.7..533.1      420.7..431.4      21.4 x 10.6   ⛔ below the hem
```

**P7 — ✅ THE THREE OPEN DEFECTS, ALREADY DIAGNOSED. DO NOT RE-DERIVE THEM.**
1. ⛔ **THE GI IS 1.76× OVERSIZED AND RISES INTO THE NECK.** `9015` is the gi's
   **outer silhouette** — deliberately, because the near sleeve hides the body
   panel — but the sleeve is then drawn *again* on slot 19, so the sleeve lobe is
   counted twice. Measured: gi **41.1 × 50.4** replacing a torso of
   **23.3 × 28.4**; its top **y 311.9** sits **13 px above the head's bottom
   (325.3)**. **Fix: slot 15 wears a TORSO-SIZED panel; the sleeve carries the rest.**
2. ⛔ **THE DRESSED FIGURE IS 11 % TOO TALL.** `140.484` stage px = **263.4 video
   px** against the frames' **236.7 (227–250)**. And the cause is uncomfortable:
   **our BARE fighter is 240.3 video px with NO hat, while the source's fighters
   measure 236.7 WITH one.** The skeleton is already at the top of the source's
   range, so any hat overshoots. **This is the session's hardest question and it
   may be a skeleton problem, not a garment one.**
3. ⚠️ **BLANK SPOTS.** The feet (y 420.7–431.4) sit **below** the near hakama's
   hem (418.7), and the far forearm is bare where the source shows cloth.

**P8 — ✅ WHAT THE FIGHTER CURRENTLY SCORES.** Height-normalised width-profile
agreement, 19 sample heights, 1.000 = identical:
```
  ours vs the TRACING frame  zFt_0061 : 0.8742
  ours vs the HELD-OUT frame zFt_0071 : 0.8294
  the two FRAMES against each other   : 0.8808   ← THE CEILING
```
⭐ **0.8294 is 94 % of the achievable ceiling, and we are barely better on the
frame we traced from** — so the outfit is NOT overfitted. That is the number
A6.3 puts under a gate, and the number A6.4 must improve.

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

### D1 — ⛔ THE LOOP MAY TUNE **PLACEMENT** ONLY. NEVER A TRACED OUTLINE. ⭐
This is the load-bearing rule. Traced outlines are *measured from the source* and
are the most strongly-sourced data in the repo. Placement anchors are labelled
**INFERRED** in every shape's own header — they were always estimates. So the
loop is allowed to fit anchors to the source and **forbidden** to move a vertex.
> **Veto:** none. Fitting an outline to a score is how a measurement stops being
> a test and becomes a mirror — SESSION 19's D1, and it survived four steps.
> **The owner explicitly authorised the loop** (§0), and this is its scope.

### D2 — SCORE PER PART, NOT PER FIGURE
A whole-figure silhouette score cannot tell "the gi is too big" from "the hakama
is too low" — it hid both for two steps. The comparator must attribute error to a
SLOT, in world px, with a sign.
> **Veto:** whole-figure only — *recommended against*, it is what already failed.

### D3 — HEADLESS RENDER, NOT A BROWSER SCREENSHOT
Every SESSION 19 comparison went through a manual browser capture at an unknown
scale, on a JPEG, over a backdrop that had to be injected by hand. A loop cannot
run on that. Rasterise `planPose`'s own `DrawOp[]` to a PNG from Node.
> ⚠️ **State the limit in the file:** this draws the PLANNER's real output, so it
> tests placement, not Phaser's renderer. It is a comparator, not a second game.
> **Veto:** drive a headless browser instead — heavier, slower, same answer.

### D4 — THE SCORE BECOMES A COMMITTED NUMBER, WITH A FLOOR
A score nobody gates is a score that rots. Commit the current value and fail the
suite if it drops. **A ratchet, not a target** — it may only improve.
> **Veto:** none. This is the whole point of the session.

---

## §2 THE BAR — binary, fixed before any code exists

| | Test | **THE NUMBER** |
|---|---|---|
| **A6-A** | Headless render exists | **`planPose` DrawOps → PNG from Node, no browser, byte-deterministic across two runs** |
| **A6-B** | Per-part comparison | **every dressed slot gets a signed size + offset error in WORLD px against the source** |
| **A6-C** | The gate | **the profile agreement is a committed number the suite enforces as a FLOOR** |
| **A6-D** | The loop improved it | **held-out agreement > 0.8294, and the ceiling (0.8808) is stated beside it** |
| **A6-E** | The gi is fixed | **slot 15 ≤ 1.25× the torso it replaces, and its top is BELOW the head's bottom (y 325.3)** |
| **A6-F** | Nothing regressed | **fidelity 55/55 · suite ≥750 green · bare clone green · `duel-baseline` green AND unedited · ratchet not widened** |

⚠️ **A6-D IS ALLOWED TO FAIL.** If the loop cannot beat 0.8294 by tuning
placement alone, that is a real finding: it means the remaining error is in the
traced outlines or in the skeleton, and **the honest response is to say so, not
to widen D1's scope.** §P7 item 2 already suspects the skeleton.

---

## §3 WHAT WILL FIGHT YOU

1. ⛔ **THE CANVAS IS TRANSPARENT.** A black outline on a black page is
   invisible. SESSION 19 lost a round to this. Composite onto a known backdrop
   inside the headless renderer, and record the backdrop colour.
2. ⛔ **REGISTRATION IS THE HARD PART, AND IT HAS ALREADY FAILED THREE TIMES.**
   The source fighter **wears different head art** — its hair mass measures
   **20.4 × 24.0 world px** against our shape 2670's **14.2 × 15.0** — and stands
   in a different pose. Do not try to register on the head. Register on the
   **ground line and the figure's height**, which are the reliable axes, and say
   so.
3. **The source's own frames only agree with each other at 0.8808.** That is the
   ceiling. A loop chasing 1.000 is chasing noise.
4. **`reference/` is gitignored.** A runtime read of it is the bug (SESSION16
   finding 4). Comparators live in `scripts/`, and the clean-clone run is what
   proves it — `git clone --local`, symlink `node_modules`, run the suite.
5. **The ratchet fires on new `game/` files.** Numbers go to `src/config/`.
6. **A green suite is necessary and not sufficient** — that is this session's
   entire thesis. **Look at the pixels, and then make the loop look for you.**

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them red, then code.**

### A6.0 — Confirm the baseline (1 minute)
`git log --oneline -1` → `4526131` · `npm test` → 44 files / 750 tests.

### A6.1 — Headless render ⬅ THE FIRST REAL WORK
`scripts/art/renderPose.ts` — compose → plan → rasterise `DrawOp[]` to a PNG on a
stated backdrop. **Gate: A6-A**, including byte-identical output across two runs.

### A6.2 — The comparator
`scripts/art/compareToSource.py` — register by ground line + height, segment both
with `proportions.py`'s existing rule, attribute error per slot using §P6's
footprints. **Gate: A6-B.** Render an overlay image every run and LOOK at it.

### A6.3 — The gate
Commit the score; the suite enforces it as a floor. **Chaos-plant it:** move one
garment 5 world px and watch it go red. **Gate: A6-C.**

### A6.4 — Run the loop
Tune ONLY the anchor rules in `traceGarment.py` (`BRIM_DOWN_HEAD`,
`HAKAMA_TOP`, the sleeve and centre anchors). Retrace, regenerate, re-score,
repeat until it stops improving. **Record every iteration's score.** **Gate: A6-D.**

### A6.5 — The three open defects, re-graded by the loop
§P7's gi oversize, the 11 % height overshoot, the blank spots. **Gate: A6-E**, and
an honest verdict on the height — including "the skeleton is too tall" if that is
what the numbers say.

### A6.6 handoff
`RESUME_HERE.md` and `docs/DIVERGENCES.md` in the SAME commit as the change each
describes. **Write the SESSION 21 kickoff.**

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Baseline `4526131` / 750 green | `git log -1` + `npm test` |
| 2 | Headless render, byte-identical twice | run it twice, `cmp` |
| 3 | Per-slot signed error in world px | pasted table |
| 4 | Score gated as a FLOOR, chaos-planted | red on a 5 px nudge, then green |
| 5 | Held-out agreement > 0.8294, ceiling stated | pasted |
| 6 | Slot 15 ≤ 1.25× its torso; top below y 325.3 | pasted |
| 7 | `?art=idle` still draws the BARE fighter | screenshot on a backdrop |
| 8 | Fidelity 55/55 · suite green · bare clone green | pasted |
| 9 | `duel-baseline` green AND unedited; ratchet not widened | `git diff` |
| 10 | Nothing in the render path reads `reference/` | grep + clean clone |
| 11 | Nothing from `reference/` committed | `git status` + history |
| 12 | Ledgers + `RESUME_HERE` in the same commit as their change | `git show --stat` |
| 13 | SESSION 21 kickoff written, committed, graded | the file + its bar self-report |

---

## §6 THE TWO REAL RISKS

**Risk 1 — the loop optimises the score and not the look.** A silhouette score is
blind to colour, to paint order, and to a garment on the wrong slot — SESSION
19's sleeve-on-the-torso would have scored *fine*. **Mitigation: the comparator
renders a side-by-side overlay every run, and A6.5 requires a human look before
the gate is believed.** The loop is a net, not a judge.

**Risk 2 — placement tuning cannot reach the ceiling, and D1 starts to look
negotiable.** §P7 item 2 already suspects the bare skeleton is too tall, which no
amount of garment placement can fix. **If A6-D fails, say the skeleton is the
suspect and stop** — widening D1 to let the loop move traced vertices would
destroy the one thing that makes this art trustworthy.

---

## §7 QUEUED — deliberately NOT in this session

- **The other 481 poses.** This session still dresses ONE pose.
- **A frame where the FAR leg and the SLEEVE are separately outlined.** Both are
  currently worked around: the far leg reuses the near leg's shape (which is what
  the OG does), and the far sleeve is only its visible lobe.
- **The equip/unequip menu.** The owner confirmed (2026-07-27) that clothes are
  equipped and removed per item at any time, and that unequipped is the naked
  fighter — which the per-slot override table already models.
- **Other outfits** — the navy duel outfit from `Nr4fQstqHDM` is the same work.
- **SESSION 14 A5 + A6** — mob AI cadence, hitbox blocking, turn-taking.
- **All audio.** Still completely silent, and it is the next research session
  worth running.

---

## §8 BAR SELF-REPORT

**Does this kickoff reach the bar? Yes.**

- **There is no research step, and it is checkable.** Every number in §P was
  produced by a command during SESSION 19 and is quoted with its output — the
  per-part footprint table from the real planner, the tracing-method calibration,
  the profile agreements, the committed target set.
- ⭐ **It opens by indicting its own predecessor with a table.** Four defects,
  who found each, how long each survived — and the fact that the suite was 750
  green throughout. That table is the argument for the whole session.
- ⭐ **It names the tool that was missing rather than the mistakes that followed
  from it.** SESSION 19's errors were all one error: nothing compared the render
  to the source, so a human eye was the only gate.
- ⭐ **It states the CEILING.** 0.8808 is what the source's own two frames score
  against each other, so a loop chasing 1.000 is chasing compression noise. A
  target without a ceiling would have produced exactly that waste.
- ⭐ **Its load-bearing rule protects the data from the loop.** D1 lets the loop
  fit PLACEMENT — which was always INFERRED and is labelled so in every shape's
  header — and forbids it from touching a traced vertex.
- **The bar can FAIL, and A6-D is explicitly allowed to**, with the honest
  response written down in advance: the skeleton becomes the suspect, and D1 is
  not widened to rescue the number.
- **It admits what the score cannot see** (§6 Risk 1): colour, paint order, and a
  garment on the wrong slot — the exact defect that shipped last session.

**What it deliberately does not promise:** that the fighter will match the source.
Only that a mismatch will be **caught by a gate instead of by the owner's eye**.
