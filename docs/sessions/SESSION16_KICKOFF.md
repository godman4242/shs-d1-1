# SESSION 16 KICKOFF — HARDEN THE CONVERTER, THEN PUT IT ON SCREEN

> **Entry route:** `RESUME_HERE.md` → this file. **This is the only kickoff you
> need.** Self-contained.
>
> **Standing rulings (unchanged):** RECREATE-NEVER-RIP for dialogue and names ·
> **Duels-not-SHS** · single-player-first · `core/` zero numeric literals, zero
> `Math.random` · render-only scenes · **red-first TDD** · chaos-plant every
> guard · **binary gates, never softened to fit a change**.
>
> ⚡ **THERE IS NO RESEARCH STEP.** Every number in §P was produced by a command
> that ran on 2026-07-26, quoted with its output. The two questions that could
> have sunk this session — *"what size should the imported art be on screen?"*
> and *"do any of these shapes have holes?"* — are **answered in §P before this
> file's first decision.**
>
> ⛔ **SESSION 15 IS NOT FINISHED, AND NEITHER IS SESSION 14.**
> `SESSION15_KICKOFF.md` stays live for **A4** (the full idle pose, graded) and
> **A5** (write-up). `SESSION14_KICKOFF.md` stays live for **A5/A6** (mob AI
> cadence, turn-taking, the `[3,10] s` band). This session does **A2's review**
> and **SESSION15 §4 A3**, and closes neither of those kickoffs.

---

## §0 THE ONE IDEA THAT GOVERNS THIS SESSION

**A2's converter has never been challenged by anyone who didn't write it, and
its output has never been drawn by Phaser. Both facts change here, in that
order.**

A2 ended with 639 tests green, 17 chaos plants biting, and byte-exact colours.
It also ended with **two defects that no test caught** — a notch in the crown of
the head (found by *looking at the render*) and a fail-open that would have
silently returned an empty shape (found while *writing this file*). Both were
fixed. Neither was found by the suite.

That is the whole argument for this session's order:

```
R — an adversarial review, by agents that did NOT write the converter
A3 — draw it in Phaser, where wrong scale and wrong pivot become visible
```

**A3 is also R's verification.** If the hardened converter still draws the head
at the right size in the right colours, R's fixes did not break it. Splitting
these into two sessions would end one session with a hardened-but-unrendered
converter, and start the next by re-reading everything.

---

## §P PREREQUISITES — ✅ ALL RESOLVED BUT ONE, AND THAT ONE IS A 10-SECOND CHECK

**P1 — ✅ A2's exact state.** Three commits: `1d78fa2` (converter), `7bdb8ed`
(crown-notch fix), `7c22499` (fail-open fix).
```
tsc ×2 exit 0 · eslint exit 0 · suite 639/639 (40 files)
17 chaos plants planted, 17 watched RED, all reverted
```
Files under review: `scripts/art/svgShape.ts` (the converter, **423 lines**) ·
`scripts/art/generate.ts` (the emitter, 108) · `src/game/art/types.ts` (36) ·
`src/game/art/generated/shape2664.ts` (the committed head, 50) ·
`tests/svgShape.test.ts` (**335 lines, 44 tests**).

**P2 — ✅ THE SCALE NUMBERS A3 MUST HIT. This is §3.4's gate, pre-computed.**
The world→stage transform is the original's own resize routine,
`stage = (32 + 1.2·worldX, 1.2·worldY)`, implemented in `src/core/viewport.ts`
(`worldToStage`, `worldToStageLength`) and pinned by `tests/viewport.test.ts`.
Shape coordinates are **world px** (SWF twips ÷ 20 on its own 800×480 logical
stage), so:

| | world px | **stage px (×1.2)** |
|---|---|---|
| **head 2664 — A3's target** | 14.30 × 16.95 | **17.16 × 20.34** |
| its outer stroke width | 1.5 | **1.8** |
| its crease stroke width | 0.5 | **0.6** |
| *(a 20× twips mistake would draw it)* | — | *343 × 407* |

**343 × 407 on a 1024 × 576 canvas is a third of the screen.** You will not miss
it. ⚠️ **The SUBTLER failure is drawing world px straight into stage space** —
that is 17 % too small and looks merely "a bit off", so check the number, do not
eyeball it.

**P3 — ✅ A SIZE CROSS-CHECK THAT COSTS NOTHING.** Composing the full fighter at
its recorded `idle` node transforms gives a bounding box of **64.9 × 107.4 world
px → 77.9 × 128.9 stage px**. The existing procedural samurai, whose proportions
were measured from study frames in earlier sessions, stands about
`hat.y 66 + PELVIS_ABOVE_GROUND 52` ≈ **118 stage px**. **Two independent
derivations — traced OG geometry and frame measurement — land within ~8 %.**
That is strong evidence the fighter clip is used at scale ≈ 1, and it is the
number A4 will need. It is **evidence, not proof**: the residual is real and A4
must confirm it (see §6 Risk 2).

**P4 — ✅ HOLES ARE REAL, BUT NOT IN A3's TARGET.** Running the committed
converter over all 16 fighter shapes:
```
shape 2641: 1 hole of 12 rings      shape 2648: 1 hole of 4 rings
shape 2646: 2 holes of 7 rings      shape 2662: 11 holes of 39 rings
TOTAL across all 16: 86 rings, 15 HOLES
```
⇒ **A4 must render holes. A3 need not: shape 2664 has 0 holes of 1 ring.**
Clean staging, by luck rather than design — say so rather than claiming credit.

**P5 — ✅ HOW THE EXISTING FIGHTER IS DRAWN, so A3 lands beside it correctly.**
`drawSamurai(g, x, groundY, facing, look, pose, alpha, scarfMotion?)` in
`src/game/samurai.ts` takes **STAGE coordinates** — `DuelScene` calls
`worldToStage` on every sim position first, then `drawSamurai(g, ps.x, ps.y + 60, …)`.
Drawing style throughout is `g.fillStyle(...)` + `g.beginPath()` + `fillPoints`
/ `g.lineStyle(...)`, on one `Graphics` per frame. Match that.

**P6 — ✅ THE FLAG MECHANISM ALREADY EXISTS.** `src/main.ts` reads
`new URLSearchParams(window.location.search).get('scene')` for
`?scene=encounter`. A3's D6 flag follows the identical pattern. Dev-only seams
`window.__game` and `window.__fidelity` are already wired under
`import.meta.env.DEV`.

**P7 — ✅ THE REGRESSION SURFACE IS KNOWN AND SMALL.** The in-browser fidelity
gate is `npm run dev` → console → `await __fidelity.run()` → must stay
**55/55** (41 probes + 14 edge scans; protocol in
`docs/research/fidelity/FIDELITY_GATE.md`). `tests/duel-baseline.test.ts` must
stay green **and unedited**. A3 puts new pixels on screen, so **both must be
re-proven, not assumed.**

**P8 — ⚠️ THE ONE OPEN ITEM, AND IT IS DELIBERATE.** *Does Phaser 3.90 expose a
polygon triangulator for hole rendering?* Reading `node_modules` is blocked in
this environment, so this was **not** verified rather than guessed at. It is
acceptable to carry because:
- **A3 does not need it** (P4: the head has no holes), so it blocks nothing here;
- it is a **one-line console check while A3 already has the browser open** —
  §4 A3.5 makes it an explicit step;
- and there is a fallback needing no Phaser feature at all: **triangulate at
  build time in the converter** and emit triangles, which also moves work off
  the runtime. A4 decides with the answer in hand.

⚠️ **Do not let A4 discover this. A3.5 exists so it is settled by then.**

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

Each decision carries a **one-line veto**.

### D1 — Review FIRST, render SECOND, in one session. ⭐

> **Veto:** two separate sessions. *Reasonable, and the file is written to split
> cleanly at the §4 R/A3 boundary* — but it ends one session with a hardened,
> unrendered converter and starts the next by re-reading all of §P. A3 is R's
> own proof that the fixes did not break anything.

### D2 — The review is run by agents that did NOT write the code, and it is ADVERSARIAL

Every finding must be **reproduced** — a failing test, a concrete input, or a
quoted line — before it counts. This repo has run two such passes and both paid:
**Session 9's 13-agent review confirmed 6 findings, all fixed red-first**
(`RESUME_HERE.md`), and **Stage 1's 18-agent audit (`wf_925893f5-430`) confirmed
7 findings and REFUTED 11 claims with evidence.** The refutations mattered as
much as the fixes, because they stopped rework.

> **Veto:** review it inline. *Recommended against* — the author of a parser is
> the worst person to find its blind spots, and A2 proved that twice in one
> session.

### D3 — Seeded suspects are published, and finding MORE is the actual job ⭐

§2's table lists ten places the author already considers suspect. Handing those
over makes the review faster and honest. **A review that returns only the seeded
list has failed** — the seeds are calibration, not scope.

> **Veto:** withhold them so the review "proves itself". *Rejected* — that
> optimises for a satisfying narrative over finding bugs.

### D4 — A3 renders BESIDE the existing samurai, behind `?art=og`, and replaces nothing

SESSION15 D6, unchanged: `drawSamurai` is graded **A−** and feeds the 55/55
gate. The imported art lands next to it, gets looked at, and only ever replaces
it on evidence.

> **Veto:** swap it in. *Recommended against* — that puts new pixels in front of
> the fidelity gate before anyone has compared them.

### D5 — A3 draws the head at a FIXED, LABELLED stage position, not attached to a fighter

A3's whole job is answering "is the scale and colour right?". Parenting it to a
moving fighter adds pose, facing and pivot questions to a step that exists to
isolate exactly one variable.

> **Veto:** attach it to the player immediately. *Recommended against* — if it
> comes out wrong you will not know which of four things caused it.

### D6 — Stroke widths go through `worldToStageLength`, never a hand-typed number

1.5 world px is 1.8 stage px. Typing `1.8` bakes the viewport scale into a
literal that silently rots the moment the transform changes.

> **Veto:** none.

### D7 — The ratchet carve-out is NOT widened for A3's renderer

A3 adds a *renderer*, which is hand-written `game/` code and stays fully
ratcheted. Only `src/game/art/generated/` is exempt. Every layout number A3
needs goes to `src/config/`.

> ⚠️ **If the ratchet fires on A3's renderer, that is the ratchet working.**
> Move the number to config; do not refresh the baseline to make it quiet.

---

## §2 THE BAR — binary, fixed before any code exists

### Phase R — the review

| | Test | **THE NUMBER** |
|---|---|---|
| **R-A** | Every reported finding is **reproduced** — failing test, concrete input, or quoted line | **100 %; unreproduced findings are dropped, not filed** |
| **R-B** | Every confirmed finding is **fixed red-first** and **chaos-planted** | **100 %** |
| **R-C** | Refuted claims are **recorded with their evidence** | **all of them** |
| **R-D** | Suite green, plants all still bite | **17 + new, all RED when planted** |

**The seeded suspects** (D3 — finding only these is a failed review):

1. **Tokeniser fail-open on `+`.** `-?\d*\.?\d+…` does not match a leading `+`,
   so `L+5 3` silently tokenises as `5 3`. FFDec never emits it. Is it worth
   failing closed on, given every other malformed input throws?
2. **3 dp rounding happens AFTER welding.** `weld()` merges at 1e-9; the emitter
   then rounds to 3 dp. Can rounding create coincident vertices, or turn a thin
   ring zero-area, in the committed data? **86 rings land in A4.**
3. **`fill-rule` is never checked.** Even-odd is applied unconditionally. All 16
   shapes declare `evenodd`, but a `nonzero` file would be silently mis-filled.
   Same class as the fail-open already fixed — deliberately left for R.
4. **`interiorPoint`'s centroid fallback** (fewer than 2 scanline crossings) can
   return a point OUTSIDE a concave ring. It is exported public API.
5. **`boundaryProbe` picks the longest edge's midpoint.** Two rings touching at
   exactly that point give an undefined hole verdict.
6. **The stroke-closure heuristic** closes any subpath returning to its start. A
   genuinely open stroke that happens to end where it began is closed wrongly.
7. **`emitQuad` bails at depth 24.** Silent precision loss on a pathological
   curve — should it throw instead?
8. **`classifyEvenOdd` is O(rings²)** with a full ray cast each time. 39 rings
   today; is that the real ceiling?
9. **`attrs()` last-wins on duplicate attributes**, and `parseColor` rejects
   `#rgb` shorthand and named colours. Fail-closed or a latent gap?
10. **The provenance gate greps for fixed strings.** Would a reformatted header
    pass while meaning something different?

### Phase A3 — the render

| | Test | **THE NUMBER** |
|---|---|---|
| **A3-A** | Head renders at its computed stage size | **17.16 × 20.34 stage px, ±1 px** |
| **A3-B** | Colours byte-exact | **fill `0xffcc99`, strokes `0x000000` — the same bytes** |
| **A3-C** | Nothing regressed | **fidelity gate 55/55 · suite green · `duel-baseline` green AND unedited** |
| **A3-D** | Zero console errors from a fresh load | **0** |

⚠️ **THE ±1 px DOES NOT MOVE INSIDE THIS SESSION.** If the render misses it,
exactly two diagnoses are permitted:
  (a) a units error — twips vs px vs stage (§3.4), or
  (b) the shape-local origin offset being applied twice, or not at all.
**If neither explains it, STOP and escalate.** Do not adjust the expected number
to match what appeared — that is the rule SESSION 13 D10, SESSION 14 §2 and
SESSION 15 §2 all held to.

---

## §3 WHAT WILL FIGHT YOU

1. **Phaser `Graphics` has no hole fill and no even-odd.** Irrelevant for A3
   (P4) and decisive for A4. A3.5 settles which way A4 goes.
2. **Stage vs world vs shape-local — three spaces.** P2 has the conversions.
   The 20× error is loud; the missing ×1.2 is quiet and much more likely.
3. **`reference/` is gitignored.** A3 renders the **committed** `SHAPE_2664`,
   never the SVG. If anything in the render path reads `reference/`, that is the
   bug — the build must work in a fresh clone.
4. **The fidelity gate is a browser gate.** It cannot be run from the test
   suite; it needs `npm run dev` and a console. Budget for that.
5. **A2's suite is green and was still wrong twice.** Treat "tests pass" as
   necessary and not sufficient. Look at the pixels.
6. **The review will produce noise.** Unreproduced findings are dropped (R-A).
   A plausible-sounding claim with no failing test is not a finding.

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them go red, then code,
then green.** Chaos-plant every new guard.

### R1 — Adversarial review of A2 ⬅ START HERE
Fan out over `scripts/art/svgShape.ts`, `scripts/art/generate.ts`,
`src/game/art/generated/shape2664.ts` and `tests/svgShape.test.ts`. Dimensions
worth separating: **parser correctness · numeric/rounding · geometry &
topology · fail-open hunting · test vacuity · provenance/gate integrity.**
Then verify each finding adversarially — try to REFUTE it.
**Gate: every finding reproduced or dropped; refutations recorded (R-A, R-C).**

### R2 — Fix the confirmed findings, red-first
One test per finding, watched failing first, then the fix, then a chaos plant.
**Gate: R-B + R-D.**

### A3 — Render `SHAPE_2664` in the browser, beside the existing samurai
Behind `?art=og` (D4, P6). A small renderer in `src/game/` that walks
`ArtShape` → `Graphics`: `fillStyle(fill.color)` + `fillPoints(ring)` per
non-hole ring, then `lineStyle(worldToStageLength(width), stroke.color)` +
`strokePoints(polyline)`. Fixed labelled position (D5). Stroke widths through
`worldToStageLength` (D6).
**Gate: A3-A (17.16 × 20.34 ±1 px) + A3-B (byte-exact colours) + A3-D.**
Measure the size — screenshot the canvas and read the pixels; do not eyeball it.

### A3.5 — Settle P8 while the browser is open (ten seconds)
In the same console: report whether Phaser 3.90 exposes a polygon triangulator
(e.g. `Phaser.Geom.Polygon.Earcut`), and its call signature if so.
**Gate: a written answer in `RESUME_HERE.md`, so A4 does not rediscover it.**

### A3.6 — Re-prove the regression surface
`npm run dev` → console → `await __fidelity.run()` → **55/55**. Full suite.
`duel-baseline.test.ts` green **and unedited** (`git diff --stat` proves it).
**Gate: A3-C, output pasted.**

### A4 handoff — write it down and stop
Update `RESUME_HERE.md`, `docs/DIVERGENCES.md` and the fidelity ledger in the
**same commit** as the change each describes. A4 (the full graded pose) stays in
`SESSION15_KICKOFF.md`; do not start it here.

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Review covered all four A2 files across ≥6 dimensions | the dimension list + per-file coverage |
| 2 | **Every finding reproduced**; unreproduced ones dropped | a failing test / concrete input per finding |
| 3 | Refuted claims recorded **with evidence** | the refutation list |
| 4 | Each confirmed finding fixed **red-first** + chaos-planted | RED receipts pasted |
| 5 | All prior 17 plants still bite | plant run pasted |
| 6 | Head renders at **17.16 × 20.34 stage px ±1** | measured from canvas pixels, pasted |
| 7 | Fill `0xffcc99` + strokes `0x000000`, **byte-exact** | read back from the render |
| 8 | Nothing in the render path reads `reference/` | grep the art path |
| 9 | Ratchet **not** widened for the renderer; new numbers in `config/` | the diff |
| 10 | Fidelity gate **55/55**; suite green; `duel-baseline` green **and unedited** | pasted output + `git diff --stat` |
| 11 | Zero console errors on fresh load | pasted |
| 12 | P8 answered in writing | `RESUME_HERE.md` |
| 13 | Ledgers + `RESUME_HERE` in the same commit as their change | `git show --stat` |
| 14 | Nothing from `reference/` committed | `git status` + history check |

---

## §6 THE TWO REAL RISKS

**Risk 1 — the review returns a pile of plausible nothing.** Static review of a
parser generates confident-sounding claims about inputs that never occur. R-A is
the whole defence: **no reproduction, no finding.** Stage 1's audit refuted **11
of its 18 claims**, and that was the pass working correctly. If R1 returns only
the ten seeded suspects, say so plainly — that is a weak review, not a clean bill
of health.

**Risk 2 — A3 passes and hides a scale error that only A4 can see.** A3 checks
ONE shape at a FIXED position. The fighter-clip scale ≈ 1 in P3 is *evidence*,
not proof, and A4's ≥90 % IoU is where an 8 % residual would actually bite. **A3
passing is not a claim about A4's scale.** Write that down in the handoff rather
than letting A4 inherit a false sense of a solved problem.

---

## §7 QUEUED — deliberately NOT in this session

- **SESSION 15 A4 + A5** — the full idle pose composed at its recorded node
  transforms, graded at ≥90 % IoU, then the write-up. Needs A3.5's answer and
  the aliasing rule (crotch 8 ← pelvic 14, hat 17 ← head 16).
- **SESSION 14 A5 + A6** — mob AI cadence, hitbox blocking, turn-taking, the
  `[3,10] s` band.
- **The other 15 fighter shapes.** The converter handles all 16 (P4) but D2's
  one-target rule holds until A4 grades a pose.
- **Animation.** 482 poses are extracted and waiting; this session draws none.
- **All audio.** Still completely silent — no `AudioContext` in `src/`.
- **Equipment art.** Unrecoverable; the CDN is dead
  (`FIGHTER_ART_IDS.md` §5). Not a task, a fact.
- Gradient fills, bitmap fills, real popup digits, `DuelScene` popups, the
  982-item / 75-skill / 61-quest tables, the 39 AI classes.

---

## §8 BAR SELF-REPORT

**Does this kickoff reach the bar? Yes — with one prerequisite deliberately left
open, declared as such, and given its own numbered step rather than being left
to be discovered.**

- **There is no research step, and it is checkable.** §P's numbers came from
  commands run on 2026-07-26 with their output quoted: the 639/639 suite, the
  86-ring/15-hole census over all 16 shapes, the 14.30 × 16.95 → 17.16 × 20.34
  conversion, and the world→stage routine cited to the file that implements it
  and the test that pins it.
- **The session's decisive number is computed before any code exists.** A3's
  entire risk is scale, so §P2 pre-computes the target, the stage conversion,
  the stroke widths, *and* what the 20× failure would look like — plus the
  warning that the quiet 17 % failure is the likelier one.
- **A free cross-check is used rather than left on the floor.** P3 notices that
  traced OG geometry (128.9 stage px) and independent frame measurement (~118
  stage px) agree within 8 %, and then explicitly refuses to call that proof,
  handing the residual to §6 Risk 2.
- **The one unresolved item is handled honestly.** P8 says plainly that Phaser's
  triangulator was **not verified** and why (`node_modules` reads are blocked),
  establishes that it blocks nothing in A3, gives it a ten-second step at the
  moment the browser is already open, and names a fallback that needs no Phaser
  feature at all.
- **It is written against this project's own demonstrated failure modes.** A2
  shipped green twice while wrong, so §3.5 says "tests passing is necessary and
  not sufficient", and §2's seeded-suspect list exists because the author is the
  worst reviewer of their own parser.
- **The review has a bar that can FAIL.** R-A drops unreproduced findings, and
  §6 Risk 1 declares "only the ten seeds came back" to be a weak review rather
  than a pass — so the review cannot succeed by producing agreeable text.
- **It hands over its own suspects.** Ten of them, specific and file-level,
  including two (`fill-rule` unchecked, `+` tokenising) that the author found and
  chose not to pre-fix so the review has something real to confirm or refute.
  That is stated outright rather than dressed up.
- **It closes nothing it has not earned.** SESSION 15 stays live for A4/A5,
  SESSION 14 for A5/A6, both named in the banner and §7 with what remains.
- **The scope is small and the stop condition is explicit.** One shape, one
  fixed position, one review; §2's ±1 px gets two permitted diagnoses and a hard
  stop instead of an escape hatch.

**What it deliberately does not promise:** that the review will find anything at
all. It may confirm the converter is sound and refute all ten seeds — and §6
Risk 1 declares that a legitimate outcome *provided the reproductions are real*,
while refusing to let a quiet review be reported as a strong one.
