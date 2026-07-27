# SESSION 18 KICKOFF — COMPOSE THE WHOLE FIGHTER, AT ITS RECORDED TRANSFORMS

> **Entry route:** `RESUME_HERE.md` → this file. **This is the only kickoff you
> need.** Self-contained; assumes no memory of SESSION 17.
>
> **INTENT, in one sentence:** draw the OG's *idle* fighter — 14 imported shapes
> placed at the 19 node transforms recorded in the payload's own animation XML —
> and prove by measurement that its proportions match the original, having broken
> nothing.
>
> **Standing rulings (unchanged):** RECREATE-NEVER-RIP for dialogue and names ·
> **Duels-not-SHS** · single-player-first · `core/` zero numeric literals, zero
> `Math.random` · **render-only scenes** · **red-first TDD** · chaos-plant every
> guard · **binary gates, never softened to fit a result**.
>
> ⚡ **THERE IS NO RESEARCH STEP.** Every number in §P came from a command run on
> 2026-07-27, quoted with its output — including the idle pose itself, printed
> verbatim in §P2. The four questions that could have sunk this session —
> *"what are the transforms?"*, *"which shapes need holes?"*, *"does the
> triangulator exist?"* and *"what do we grade against?"* — are **all answered in
> §P before this file's first decision.**
>
> ⛔ **THIS SUPERSEDES `SESSION15_KICKOFF.md` §4 A4's grading bar.** That file
> asks for **≥ 90 % silhouette IoU**. §P8 shows that target **does not exist and
> cannot be produced**: FFDec cannot render a pose the AS3 composes at runtime,
> and the only OG images are video frames of an *equipped* fighter — so an IoU
> would grade our bald, unarmed doll against a kasa and a sword. §2 replaces it
> with a proportion gate against measured stage-px values.
> ⛔ **`SESSION14_KICKOFF.md` STAYS LIVE for A5 + A6.** Not closed here.

---

## §0 THE ONE IDEA THAT GOVERNS THIS SESSION

**SESSION 17 proved one shape lands at the right size. It could not prove the
composition rules, and it said so.** The head, `SHAPE_2664`, was drawn at a
hand-picked position with no joint, no parent, no z-order and no sibling. Every
remaining risk in the imported art lives in the *composition*: which slot gets
which transform, which slots are aliased, what order they stack in, and whether
a pivot means what we think it means.

This session draws all of it, and grades it against numbers measured off the
original's own video frames.

```
A4.1  extend the planner: hole rings become triangulation input   ⬅ START HERE
A4.2  generate + commit the other 13 shapes (2664 already in)
A4.3  the composer: 19 nodes + 2 aliases → an ordered draw list (PURE, tested)
A4.4  render it behind ?art=idle and MEASURE the proportions
A4.5  re-prove the regression surface — 55/55, suite, duel-baseline unedited
```

---

## §P PREREQUISITES — ✅ ALL RESOLVED. NOTHING LEFT OPEN.

**P1 — ✅ SESSION 17 IS COMMITTED AND GREEN. THE BASELINE IS `a9592d7`.**
```
a9592d7 SESSION17 A3.2-A3.4: the OG art is on screen, and measured
27a5ff3 SESSION17 A3.1: a pure art planner, red-first, with paint order provable

Test Files  42 passed (42)      tsc ×2 → exit 0      eslint → exit 0
     Tests  690 passed (690)    npm run build → clean
in-browser fidelity gate: 55/55 (41 probes + 14 scans, pass: true)
```
⚠️ **`.github/dependabot.yml` (modified) and `.github/workflows/` (untracked) are
the OWNER's own uncommitted changes.** Do NOT commit them. Stage explicitly,
never `git add -A`.

**P2 — ✅ THE IDLE POSE, VERBATIM.** Extracted 2026-07-27 from
`reference/extracted/bindata/108_1t4635s0.bin` (the 158 human animations):
```xml
<anim i="idle" d="1">
<f i="0">
<n i="20" x="-10" y="-64" r="-9"></n>   <n i="19" x="-5"  y="-80" r="11"></n>
<n i="18" x="-5"  y="-47" r="-14"></n>  <n i="14" x="-1"  y="-54" r="-1"></n>
<n i="16" x="-4"  y="-92" r="-3"></n>   <n i="15" x="-2"  y="-68" r="-1"></n>
<n i="13" x="-2"  y="-57" r="-2"></n>   <n i="12" x="-3"  y="-85" r="-11"></n>
<n i="11" x="4"   y="-29" r="-3"></n>   <n i="10" x="-2"  y="-55" r="-12"></n>
<n i="9"  x="5"   y="-4"  r="-2"></n>   <n i="7"  x="-11" y="-27" r="23"></n>
<n i="6"  x="-4"  y="-53" r="15"></n>   <n i="5"  x="-21" y="-4"  r="-1"></n>
<n i="4"  x="2"   y="-54" r="-38"></n>  <n i="3"  x="12"  y="-61" r="142"></n>
<n i="2"  x="-15" y="-65" r="-54"></n>  <n i="1"  x="-7"  y="-80" r="25"></n>
<n i="0"  x="0"   y="-56" r="-54"></n>
</f>
</anim>
```
`x`/`y` are **plain pixels**, `r` is **degrees** — `§1t1360s0§.setPosition`
assigns `.x`, `.y`, `.rotation` directly (the `a`/`b`/`c`/`d` ÷100 branch runs
only when `r` is ABSENT, and it is present on every node above).
⭐ **THE ALIASING RULE IS CONFIRMED BY THIS DATA, not just by the code comment.**
Nodes are present for 0–7 and 9–16 and 18–20. **Slots 8 and 17 are the only ones
missing** — exactly the two the code aliases. Apply **8 ← 14** (crotch takes
pelvic's transform) and **17 ← 16** (hat takes head's). Compose without this and
the crotch is stranded at the origin as a tan blob at the fighter's feet.
⭐ **Z-ORDER IS CREATION ORDER.** `reorderLayers` uses node-list order only when
the frame carries `r="1"`; **`<f i="0">` above carries no `r`**, so slot 0 draws
at the BACK and slot 20 at the front.

**P3 — ✅ THE SLOT → SHAPE MAP.** From `docs/research/fidelity/FIGHTER_ART_IDS.md`
§2, which cites the naming line for every entry:
```
0  hand(far)  2667    7  calf(far)  2678 + foottop(far)  2672   14 pelvic 2653
1  uparm(far) 2644    8  crotch     2676  (aliased ← 14)         15 torso  2646
2  lowarm(far)2658    9  foot(near) 2674                         16 head   2664 + hair 2670
3  weapon     EMPTY  10  thigh(near)2648                         17 hat    EMPTY (aliased ← 16)
4  prop       EMPTY  11  calf(near) 2678 + foottop(near) 2672    18 hand(near)  2667
5  foot(far)  2674   12  neck       2655                         19 uparm(near) 2644
6  thigh(far) 2648   13  stomach    2650                         20 lowarm(near)2658
```
⚠️ **THREE SLOTS CARRY TWO PARTS EACH** — 7, 11 and 16. A one-shape-per-slot
composer silently drops foottop ×2 and the hair.
⚠️ **Slots 3, 4 and 17 are EMPTY BY DESIGN** — they are the game's own "none"
placeholders (`7000 == no hat`, `weapon13000` == unarmed), not missing art. The
idle fighter is correctly **bald and unarmed**. §P8 depends on this.
**14 distinct shapes are needed. `2641` (training branch) and `2662` (alt head)
are NOT in the fighter.**

**P4 — ✅ HOLES: EXACTLY TWO SHAPES NEED THEM, AND BOTH ARE IN THE FIGHTER.**
Census re-run over all 16 on 2026-07-27 (`grep` over the emitted files):
```
shape rings holes order      shape rings holes order
2641    12    1  FFFSS       2662    39   11  SFFFFFFFFS   ← neither is in the fighter
2646     7    2  FFS         2648     4    1  FFS          ← BOTH are (torso, thigh)
all others: 0 holes          TOTAL rings=86 holes=15
```
⇒ **A4 needs Earcut for `2646` (torso, 2 holes) and `2648` (thigh, 1 hole, drawn
TWICE — slots 6 and 10).** Four hole instances in the composed pose.
**Recipe:** concatenate the non-hole ring, then each `hole: true` ring, into one
flat array; pass the CUMULATIVE VERTEX COUNTS as `holeIndices`; `fillTriangle`
the returned index triples.

**P5 — ✅ THE TRIANGULATOR IS PRESENT IN THE PINNED BUILD.** Confirmed in the
browser console on 2026-07-27, not from docs:
```
typeof Phaser.Geom.Polygon.Earcut            → "function"
typeof Phaser.Geom.Polygon.Earcut.deviation  → "function"
Phaser.VERSION                               → "3.90.0"
Earcut(flatXY, holeIndices?, dimensions?) → number[] triangle vertex indices
Earcut.deviation(verts, holes, dims, tris) → 0 when the triangulation is CORRECT
```
⭐ **`deviation` is a numeric, binary correctness check on hole rendering** — use
it, do not eyeball the holes.

**P6 — ✅ THE TOOLING SESSION 17 LEFT YOU. Read it before writing anything.**
- `src/core/artPlan.ts` — `planShape(shape, origin: Vec, view: ViewTransform)` →
  ordered `DrawOp[]` in stage px; `inkedBounds(ops)` → the box a screenshot
  shows. **Hole rings are currently SKIPPED** — that is A4.1's job to replace.
- `src/core/inkBox.ts` — SESSION17 §P2's measurement rule as tested code: the
  box of pixels at ≥ 50 % alpha, `clipped` flag, throws on "no ink". Returns
  **`span` AND `covered`** (pixel-centre distance vs lit-row count) because the
  ±1 px gap between them is the method's real noise floor. **Re-run it; do not
  re-derive the rule.**
- `src/game/OgArtScene.ts` — `drawPlan(g, plan)` executes a plan **in order**,
  setting each op's own style immediately before drawing. Reuse it.
- `?art=og` already routes, and sets `transparent: true` **on that route only**
  (§P9). Add `?art=idle` the same way.

**P7 — ✅ THE CONVERTER IS DETERMINISTIC AND RUNS 16/16.** Re-run 2026-07-27:
all 16 converted; **regenerating `shape2664.ts` produced a byte-identical file
to the committed one** (`git diff --quiet` → clean). `reference/` is present on
this machine (1822 extracted SVGs) and is **gitignored** — the emitted `.ts` is
the artifact, and nothing at runtime may read `reference/`.
```
npx vite-node scripts/art/generate.ts -- 2644 2646 2648 2650 2653 2655 2658 \
                                         2667 2670 2672 2674 2676 2678
```
⚠️ **`tests/svgShape.test.ts`'s re-derivation suite is `describe.skipIf`-gated on
`reference/` existing** (8 tests skip in a clean clone). That is deliberate —
SESSION16 finding 4 was an ungated `reference/` read that broke every clone.
**Do not add an ungated read.**

**P8 — ⚠️ THE GRADING TARGET SESSION 15 ASKED FOR DOES NOT EXIST. READ THIS
BEFORE PLANNING A4.4.** SESSION15 §4 A4 says "graded ≥ 90 % silhouette IoU".
Checked on 2026-07-27:
- **FFDec cannot render it.** The pose is composed at RUNTIME by AS3
  (`setPosition` per node). There is no DefineSprite of an assembled idle
  fighter to export — only the 16 leaf shapes, which we already have.
- **The only OG images are video frames** (`reference/frames/`, from
  `Nr4fQstqHDM` / `zFtCaTO0_1M`), and they show an **equipped** fighter — kasa
  and sword. Our doll is bald and unarmed **by design** (§P3: slots 3/4/17 are
  the game's own "none" placeholders). An IoU against those frames would score
  our correct output against a hat and a blade it must not have.
⇒ **A silhouette IoU here would be either circular (graded against our own
composition) or wrong by construction.** §2 grades measured PROPORTIONS instead.

**P9 — ✅ WHAT WE *CAN* GRADE AGAINST, AND IT IS REAL.**
`reference/combat_idle_measurements.md` (2026-07-17) measured the idle fighter
from three 1080p frames and **already converted to stage px (÷1.875)**:
```
                     Src1  Src2  Src3   Avg    STAGE px   3-source spread
Head diameter          55    55    50    53.3     28.4       ±5 %   ✅ usable
Shoulder width         88    74    78    80.0     42.7       ±9 %   ✅ usable
Torso length         120   108   109   112.3     59.9       ±6 %   ✅ usable
Mid-torso width        72    72    60    68.0     36.3      ±10 %   ✅ usable
Pelvis width           69    73    70    70.7     37.7       ±3 %   ✅ usable
Leg length           110    97   143   116.7     62.2      ±20 %   ❌ too noisy
Kasa width           168   169    80   139.0     74.1      ±39 %   ❌ + we have no kasa
Total height (w/kasa) 266  267   274   269.0    143.5        —      ❌ includes kasa
```
⭐ **A FREE CROSS-CHECK NOBODY HAD LINED UP.** SESSION17 §6 Risk 2 carried a
composed-fighter estimate of **128.9 stage px** (no kasa). The video's
kasa-inclusive height is **143.5**, and its measured kasa height is **11.7** →
**131.8 stage px without the kasa**. Two independent derivations, **2.2 % apart**.
That is the strongest scale evidence in the repo — and it is still *evidence*,
not proof, so §2 gates it at a tolerance that respects the source spread.

**P10 — ✅ THE REGRESSION SURFACE, UNCHANGED AND SMALL.**
- In-browser fidelity gate: `npm run dev` → console → **55/55**. Protocol:
  `docs/research/fidelity/FIDELITY_GATE.md`. **Cannot run in vitest.**
  ⏱️ **It takes ~45 s and will trip a 45 s CDP timeout if you `await` it
  directly.** Kick it off detached onto `window` and poll.
- `tests/duel-baseline.test.ts` must stay green **and unedited**.
- The `src/game/` ratchet is live; only `src/game/art/generated/` is exempt, and
  that exemption is PAID FOR by the provenance + data-verification gates in
  `tests/game-purity-ratchet.test.ts`. New hand-written `game/` code is fully
  ratcheted: **put numbers in `src/config/art.ts`, never refresh to quiet it.**
  (SESSION17's whole new scene baselined as `{}` — an empty multiset. Match that.)

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

### D1 — The triangulation SPLITS: pure prep in `core/`, Earcut in the scene ⭐
`Earcut` is Phaser, and `core/` may import no packages — but the part worth
testing is the *hole packing* (which ring goes where, what the cumulative
`holeIndices` are), not the triangulation itself. So `artPlan.ts` emits a new op
carrying `{ flatXY, holeIndices }` and the scene calls `Earcut` + `fillTriangle`.
Same split that made SESSION 17's paint order provable.
> **Veto:** call Earcut from a scene with the packing inline — then the one part
> that can silently mis-pair a hole with the wrong outer ring is untestable.
> *Recommended against.*

### D2 — Grade PROPORTIONS and RATIOS, not a silhouette IoU (see §P8)
Ratios are immune to the overall-scale question, which §6 Risk 1 keeps separate
on purpose. Absolute stage-px sizes are graded too, but at a tolerance derived
from the three sources' own spread rather than a round number.
> **Veto:** keep the ≥ 90 % IoU. *Recommended against* — §P8 shows there is
> nothing to compute it against that is not circular or wrong by construction.

### D3 — Commit all 13 remaining shapes in ONE commit, before the composer
They are generated, provenanced and verified by existing gates. Landing them
separately means the composer's diff is the composer.
> **Veto:** none.

### D4 — `?art=idle` is a NEW route beside `?art=og`; A3's scene stays
SESSION 17's route is the only evidence that one shape measures correctly. Keep
it runnable.
> **Veto:** replace it. *Recommended against* — you lose the A3-A regression.

### D5 — The composer is PURE and takes the node list as DATA
`composePose(nodes, slotMap, shapes)` → an ordered list of (shape, transform).
No Phaser, no scene. Rotation is degrees in, radians out at the boundary.
> **Veto:** none. This is D2 of SESSION 17, applied again.

### D6 — Do NOT add alpha, gradients or bitmap fills
All 16 shapes are **100 % flat solid colour** (`FIGHTER_ART_IDS.md` §2: 36 fill
styles, 36 solid, 0 gradient, 0 bitmap). The converter throws on opacity ≠ 1.
> **Veto:** none — there is nothing to approximate.

---

## §2 THE BAR — binary, fixed before any code exists

| | Test | **THE NUMBER** |
|---|---|---|
| **A4-A** | Holes render as holes | **`Earcut.deviation(...)` === 0 for all 4 hole instances (2646 ×2, 2648 ×1 drawn twice)** |
| **A4-B** | Every part is placed | **19 nodes + 2 aliases → 17 drawn parts (3/4/17 are empty by design); slots 7, 11, 16 each draw TWO** |
| **A4-C** | Z-order is creation order | **slot 0 at the back … slot 20 at the front; a node-list-order composer turns the test RED** |
| **A4-D** | Proportions match the OG | **head Ø 28.4 · shoulder 42.7 · torso 59.9 · mid-torso 36.3 · pelvis 37.7 stage px, each ±15 %** |
| **A4-E** | Ratios match the OG | **torso/leg ≈ 1.10 and stance/shoulder ≈ 0.86, each ±0.15** |
| **A4-F** | Height cross-check | **composed height (no kasa) within ±5 % of 131.8 stage px (§P9)** |
| **A4-G** | Nothing regressed | **fidelity 55/55 · suite ≥690 green · `duel-baseline` green AND unedited · 0 console errors** |

⚠️ **THE TOLERANCES DO NOT MOVE INSIDE THIS SESSION.** ±15 % is already wider
than every usable source's own spread (max ±10 %, §P9) — it is generous, and
that is the point: a miss is then a real miss. If A4-D or A4-F misses, exactly
four diagnoses are permitted:
  **(a)** the 8←14 / 17←16 aliasing not applied (§P2) — a tan blob at the feet;
  **(b)** a two-part slot (7, 11, 16) drawing only one part (§P3);
  **(c)** rotation in degrees where radians were owed, or the pivot not at (0,0);
  **(d)** z-order reversed — `§1t59s0§`'s constructor pushes nodes in **reverse**
  document order, so "iterate the XML" and "creation order" are NOT the same.
**If none explains it, STOP and escalate.** Do not adjust the expected numbers to
match what appeared — the rule SESSION 13 D10 through SESSION 17 §2 all held to.

---

## §3 WHAT WILL FIGHT YOU

1. ⚠️ **THE PAINT-ORDER DEFECT IS INVISIBLE TO A4 TOO — THIS IS NEW AND IT
   MATTERS.** SESSION 17 §6 Risk 1 warned that `SHAPE_2664` (`F S S`) renders
   identically under the fills-then-strokes bug. §P4's census now shows
   **`2662` is the ONLY one of the 16 shapes with a stroke before a fill — and
   `2662` is not in the fighter.** So **not one of A4's 14 shapes can reveal the
   defect either.** `tests/artPlan.test.ts`'s synthetic `S,F` and `F,S,F,S`
   fixtures remain the ONLY defence in the entire repo. Do not delete them, and
   do not read a green A4 as a paint-order proof.
2. **Two slots carry no node and two slots carry two parts.** §P2 and §P3. Both
   fail silently and both look like an art bug rather than a wiring bug.
3. **Degrees vs radians.** `r` is degrees. Phaser wants radians.
4. **`core/` rejects the literal `2`.** Name it in `src/config/`.
5. **The ratchet fires on new `game/` files.** Expected. Numbers to config.
6. **The fidelity gate is a browser gate and takes ~45 s.** §P10.
7. **`reference/` is gitignored.** The committed `.ts` is the art. A runtime read
   of `reference/` is the bug (SESSION16 finding 4: 639 → 595 in a clean clone).
8. **A green suite is necessary and not sufficient.** SESSION 15 shipped 639
   green with a notch in the head's crown; SESSION 16 found eight more defects
   behind 639 green; SESSION 17's own render was only trustworthy because the
   pixel indices were checked, not the deltas. **Look at the pixels.**

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them go red, then code,
then green.** Chaos-plant every new guard.

### A4.0 — Confirm the baseline (30 seconds)
```
git log --oneline -1     # expect a9592d7 SESSION17 A3.2-A3.4 …
npm test                 # expect 42 files / 690 tests green
```
**Gate:** both match §P1. If not, STOP — every number below is measured against
`a9592d7`.

### A4.1 — Holes become triangulation input, red-first ⬅ THE FIRST REAL WORK
Replace `artPlan.ts`'s hole SKIP with a packed op: the non-hole ring followed by
each hole ring in one flat array, plus cumulative `holeIndices`. **First test:
a fill with one outer ring and two holes packs to the right `holeIndices`, and a
shape with NO holes still emits a plain fill op.** **Gate: A4-A (packing half).**

### A4.2 — Generate and commit the other 13 shapes
`npx vite-node scripts/art/generate.ts -- <the 13 ids from §P3>`. Provenance and
data-verification gates already cover them. **Gate: suite green, ratchet quiet
(generated art is exempt — §P10).**

### A4.3 — `src/core/composePose.ts`, red-first
`composePose(nodes, slotMap)` → ordered `(shapeId, x, y, rotationRad)[]`.
**First tests: the 8←14 and 17←16 aliases are emitted even though no node
carries them; slots 7/11/16 emit TWO entries; the order is slot 0 → 20.**
**Gate: A4-B + A4-C.**

### A4.4 — Render behind `?art=idle` and MEASURE
Reuse `drawPlan`; add the Earcut path for packed ops. Measure with
`src/core/inkBox.ts` — **the same function SESSION 17 used, not a new rule.**
**Gate: A4-A (deviation === 0) + A4-D + A4-E + A4-F. Screenshot it and READ THE
PIXELS.**

### A4.5 — Re-prove the regression surface
Fidelity **55/55** (kick off detached, poll — §P10). Full suite.
`duel-baseline` green **and unedited**. **Gate: A4-G, output pasted.**

### A5 handoff — write it down and stop
Update `RESUME_HERE.md` and `docs/DIVERGENCES.md` in the **same commit** as the
change each describes. **Write the SESSION 19 kickoff.** SESSION 14's A5 + A6
(mob AI cadence, hitbox blocking, turn-taking) stay where they are.

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Baseline `a9592d7` / 690 green; owner's `.github/` untouched | `git log -1` + `git status` |
| 2 | `Earcut.deviation` === 0 for all 4 hole instances | pasted console output |
| 3 | 17 parts drawn; slots 7/11/16 draw two each; 3/4/17 draw none | test names + pasted |
| 4 | Z-order = creation order, pinned by a test a reversed composer turns RED | plant it, paste the red |
| 5 | Aliases 8←14 and 17←16 pinned by a test | plant it, paste the red |
| 6 | 5 proportions within ±15 % of §P9 | measured from canvas, pasted |
| 7 | 2 ratios within ±0.15; height within ±5 % of 131.8 | pasted |
| 8 | Composer + hole packing are PURE and unit-tested; `core/` purity green | gate output |
| 9 | Nothing in the render path reads `reference/` | grep the art path |
| 10 | Ratchet **not** widened; new numbers in `src/config/` | the diff |
| 11 | Fidelity **55/55**; suite green; `duel-baseline` green **and unedited** | pasted + `git diff --stat` |
| 12 | 0 console errors on a fresh load | pasted |
| 13 | 13 new shapes committed WITH provenance headers | `git show --stat` |
| 14 | Ledgers + `RESUME_HERE` in the same commit as their change | `git show --stat` |
| 15 | Nothing from `reference/` committed | `git status` + history check |
| 16 | SESSION 19 kickoff written, committed, graded | the file + its bar self-report |

---

## §6 THE TWO REAL RISKS

**Risk 1 — A4 passes on proportions and is still at the wrong absolute scale.**
The five graded proportions and both ratios are internal to the fighter; A4-F is
the only gate that ties it to the world, and it rests on a **2.2 %** agreement
between two derivations (§P9) that share no method but do share an assumption —
that the fighter clip is scale ≈ 1. **This session does not prove that
assumption; it tests consistency with it.** Say so in the handoff rather than
letting "A4 green" read as "scale solved".

**Risk 2 — the composition looks right and one part is silently wrong.** With 17
parts overlapping, a single mis-slotted or mis-rotated limb is easy to miss at
20 stage px and invisible in a proportion measurement that only reads the
silhouette's outer box. **Mitigation, and it is cheap:** render each part in a
distinct debug colour behind a flag and check the layer stack once by eye — then
turn it off. A silhouette gate cannot see an *interior* error, by definition.

---

## §7 QUEUED — deliberately NOT in this session

- **SESSION 14 A5 + A6** — mob AI cadence, hitbox blocking, turn-taking, `[3,10] s`.
- **The other 481 poses.** 482 extracted; this session draws ONE.
- **Animation / interpolation between frames.** Every duel pose is 1-frame.
- **The 2 shapes outside the fighter** — `2641` (training branch), `2662` (alt
  head). `2662` is the repo's only stroke-before-fill shape and would make the
  paint-order defect visible; it is worth drawing SOMEDAY for exactly that
  reason (§3.1), but it is not the idle fighter.
- **All audio.** Still completely silent — no `AudioContext` in `src/`.
- **The 5 overlapping ring pairs** (SESSION16 P8) and **alpha support** — both
  recorded, both blocking nothing.
- **Equipment art.** Unrecoverable; the CDN is dead (`FIGHTER_ART_IDS.md` §5).
  This is why the doll is bald and unarmed, and why §P8 rejects the IoU.
- Gradient fills, bitmap fills, real popup digits, the 982-item / 75-skill /
  61-quest tables, the 39 AI classes.

---

## §8 BAR SELF-REPORT

**Does this kickoff reach the bar? Yes — and like its predecessor it carries no
open prerequisite at all.**

- **There is no research step, and it is checkable.** The idle pose is printed
  verbatim from the payload's own bindata; the ring/hole census was re-run over
  all 16 shapes; `Earcut` and `Earcut.deviation` were confirmed in the pinned
  3.90.0 build in a live console; the converter was re-run and shown
  **deterministic** (`shape2664.ts` regenerated byte-identical). Every §P number
  carries the command that produced it.
- ⭐ **It KILLS its predecessor's grading bar rather than inheriting it.**
  SESSION15 A4's "≥ 90 % silhouette IoU" is not achievable-but-hard, it is
  **undefined**: FFDec cannot render a runtime-composed pose, and the only OG
  images show an equipped fighter our doll must not resemble. §P8 shows the work;
  §2 replaces it with proportions measured off the original's own frames and
  already converted to stage px.
- ⭐ **It confirms the aliasing rule from DATA, not from a code comment.** Nodes
  8 and 17 are the only two missing from the idle frame — precisely the two the
  AS3 aliases. The same block also settles z-order (`<f>` carries no `r="1"`, so
  creation order wins), which was previously a rule with no worked example.
- ⭐ **It finds a NEW limit that changes how the next session must think.** The
  census shows `2662` is the only one of the 16 shapes with a stroke before a
  fill — and it is not in the fighter. So **A4's pixels cannot detect the
  paint-order defect either**, and the synthetic unit fixtures are the only
  defence in the repo. SESSION 17 could only say this about A3; §3.1 now says it
  about A4, with the census to prove it.
- **It names the exact scope of the hole work instead of hand-waving it:** two
  shapes, four hole instances, with the packing recipe and a numeric
  0-means-correct check.
- **The bar can FAIL.** Seven binary gates, sixteen gate rows, tolerances derived
  from the sources' own spread rather than chosen for comfort, four enumerated
  diagnoses, and a hard stop.
- **It admits what it cannot prove.** §6 Risk 1: the absolute-scale gate rests on
  two derivations that agree to 2.2 % but share an assumption, so A4 tests
  consistency with that assumption rather than establishing it. §6 Risk 2: a
  silhouette gate is blind to interior errors by definition, so a one-off
  debug-colour pass is prescribed rather than assumed.
- **It closes nothing it has not earned.** SESSION 14 stays live for A5 + A6,
  named in the banner and §7 with what remains.

**What it deliberately does not promise:** that the fighter will be *right*, only
that it will be *measured against the original's own frames* — and it states
plainly, twice, that a green A4 is not a paint-order proof and not a scale proof.
