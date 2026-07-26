# SESSION 17 KICKOFF — PUT THE OG ART ON SCREEN, AT A MEASURED SIZE

> **Entry route:** `RESUME_HERE.md` → this file. **This is the only kickoff you
> need.** Self-contained; assumes no memory of SESSION 16.
>
> **INTENT, in one sentence:** draw ONE imported OG shape — the samurai's head —
> beside the existing procedural samurai, and prove by measurement that it is the
> right size, in the right colours, in the right paint order, having broken
> nothing.
>
> **Standing rulings (unchanged):** RECREATE-NEVER-RIP for dialogue and names ·
> **Duels-not-SHS** · single-player-first · `core/` zero numeric literals, zero
> `Math.random` · **render-only scenes** · **red-first TDD** · chaos-plant every
> guard · **binary gates, never softened to fit a result**.
>
> ⚡ **THERE IS NO RESEARCH STEP.** Every number in §P came from a command run on
> 2026-07-27, quoted with its output. The three questions that could have sunk
> this session — *"what size should it be on screen?"*, *"does Phaser expose a
> triangulator?"* and *"what shape is the data now?"* — are **all answered in §P,
> before this file's first decision.**
>
> ⛔ **THIS SUPERSEDES `SESSION16_KICKOFF.md` §4 A3/A3.5/A3.6.** Do not work from
> that file: **its A3 recipe now describes a bug.** It says "`fillStyle` +
> `fillPoints` per non-hole ring, THEN `lineStyle` + `strokePoints`" — drawing all
> fills and then all strokes is exactly the defect SESSION 16 R2 removed (§P3).
> Its A3 target size is also derived from the wrong source (§P2).
> ⛔ **`SESSION15_KICKOFF.md` STAYS LIVE for A4 + A5.**
> ⛔ **`SESSION14_KICKOFF.md` STAYS LIVE for A5 + A6.** Neither is closed here.

---

## §0 THE ONE IDEA THAT GOVERNS THIS SESSION

**Everything we believe about the imported art is currently a number in a test.
Nothing has ever been drawn.** SESSION 16's review confirmed seven findings — most
of them stated in pixels — and then said this about itself, in writing:

> *"NO OBSERVED FRAME ANYWHERE. There is no renderer, so no finding could compare
> the converter's output to a real drawn pixel. Four of the five 'wrong pixels'
> claims rest on rasterisers the reviewing agents wrote themselves."*

This session produces the first observed frame. That is its whole value, and it
is why the scope is one shape at one fixed position: **the only variable worth
isolating is scale.** Get that wrong and every later fidelity number inherits it.

```
A3.1  a PURE planner: ArtShape -> ordered draw ops, unit-tested   ⬅ START HERE
A3.2  render SHAPE_2664 behind ?art=og, beside the samurai, and MEASURE it
A3.3  confirm the Earcut call signature in the same console (10 seconds)
A3.4  re-prove the regression surface — 55/55, suite, duel-baseline unedited
```

---

## §P PREREQUISITES — ✅ ALL RESOLVED. NOTHING LEFT OPEN.

**P1 — ✅ SESSION 16 IS COMMITTED AND GREEN. THE BASELINE IS `04352a9`.**
```
04352a9 SESSION16 R1+R2: adversarial review of the converter, 8 findings fixed red-first
  10 files changed, 1038 insertions(+), 134 deletions(-)

Test Files  40 passed (40)        tsc -p tsconfig.json && tsc -p tsconfig.node.json  → exit 0
     Tests  664 passed (664)      eslint .                                            → exit 0
without reference/:  656 passed | 8 skipped (664), exit 0      npm run build          → clean
```
⚠️ **`.github/dependabot.yml` (modified) and `.github/workflows/` (untracked) are
the OWNER's own uncommitted changes and were deliberately left out of `04352a9`.
Do NOT commit them.** Stage explicitly, never `git add -A`.

**P2 — ✅ THE SIZE GATE, MEASURED FROM THE DATA THE RENDERER WILL ACTUALLY DRAW.**
⭐ **This CORRECTS `SESSION16_KICKOFF.md` P2, which derived the target from the
SVG *header* rather than from the committed artifact.** Measured by walking
`SHAPE_2664.paints` and applying `worldToStageLength`:
```
geometry bbox            12.784 × 15.300 world px   (x -3.134..9.650, y -10.950..4.350)
widest stroke            1.5 world px
INKED bbox (geom + w/2)  14.284 × 16.800 world px
  → STAGE, inked         17.141 × 20.160        ⭐ THE GATE
  → STAGE, geometry only 15.341 × 18.360
  → stroke widths        1.800 and 0.600 stage px
```
The transform is the original's own resize routine — `VIEW` in
`src/core/viewport.ts` is **scale 1.2, offsetX 32, offsetY 0** on a
`1024 × 576` canvas (`GAME_WIDTH`/`GAME_HEIGHT` in `src/config/display.ts`),
pinned by `tests/viewport.test.ts`.

⚠️ **MEASURE THE INK, NOT THE FILL.** A screenshot shows the black outline's
outer edge, so the number to compare is **17.14 × 20.16**. Measure the fill
polygon instead and you get 15.34 × 18.36 — **1.80 px out on height against this
kickoff's target, and 1.98 px out against SESSION 16's** — so under either number
a *correct* render would trip §2's hard stop. Both figures are written above
precisely so a mis-measurement is diagnosable in seconds rather than being
mistaken for a units bug.

| failure mode | what you would see |
|---|---|
| forgot twips ÷ 20 | **342.8 × 403.2** — a third of the screen, unmissable |
| forgot the ×1.2 | **14.28 × 16.80** — 17 % small, looks merely "a bit off" ⚠️ |
| measured fill, not ink | 15.34 × 18.36 — looks like a scale bug, is not |

⚠️ **DEFINE THE MEASUREMENT BEFORE YOU TAKE IT — the gate is ±1 px on a ~20 px
object, and the object is ANTIALIASED.** A 0.6 px stroke cannot land on pixel
boundaries, so the inked edge is inherently fuzzy by up to a pixel and a
loosely-defined "read the pixels" will produce a number that drifts with whoever
reads it. **The rule for this session:** measure the bounding box of all canvas
pixels whose alpha ≥ 50 % of full, on a transparent-background render of the
shape alone, and report the box in CSS pixels at `devicePixelRatio` 1. Two
consequences to accept up front: (i) **±1 px is roughly the method's own noise
floor**, so a result at 1.0–1.2 px out is a *measurement* question before it is a
*code* question — re-measure with the rule above before invoking §2's diagnoses;
(ii) if the canvas is scaled by CSS or a HiDPI backing store, divide back to CSS
px first or every number is inflated by the ratio.

**P3 — ✅ THE DATA MODEL CHANGED IN SESSION 16. READ THIS BEFORE WRITING THE
RENDERER.** `ArtShape` is no longer `{ fills[], strokes[] }`. It is:
```ts
interface ArtShape { readonly id: number; readonly paints: readonly ArtPaint[] }
type ArtPaint = ArtFill | ArtStroke          // discriminated on `kind`
ArtFill   = { kind: 'fill';   color: number; rings: ArtRing[] }
ArtStroke = { kind: 'stroke'; color: number; width: number; polylines: number[][] }
```
⭐ **`paints` is in the source SWF's own order, back to front, and a renderer MUST
walk it in that order.** A SWF shape is a sequence of style groups and a
`StateNewStyles` record can put a stroke UNDERNEATH a fill: shape **2662** (one of
the 16 fighter shapes) is document order `S F F F F F F F F S` — a 2.5 px black
outline, then eight face fills. Drawing fills-then-strokes turned **26.2 %** of
that shape's ink black, scored against FFDec's own render (44513/44513 pixels
agreeing in source order vs 32952). `SHAPE_2664` is `F S S`, where both orders
coincide — **so A3 cannot detect this mistake, and A4 would inherit it.** Hence
gate **A3-C**, which is a unit test rather than a render check (§6 Risk 1).
⚠️ **There is no alpha channel, by design.** The converter throws on any
`fill-opacity`/`stroke-opacity` ≠ 1. Do not add one here.

**P4 — ✅ HOW TO LAND IT BESIDE THE EXISTING FIGHTER.** All verified by grep:
- `drawSamurai(g, x, groundY, facing, look, pose, alpha?, scarfMotion?)` in
  `src/game/samurai.ts` takes **STAGE** coordinates; `DuelScene` calls
  `worldToStage` on every sim position first (`const ps = worldToStage(player.pos)`).
- Drawing style throughout is `g.fillStyle(...)` + `g.fillPoints(...)` /
  `g.lineStyle(...)` on one `Graphics` per frame. `DuelIntro.ts` already does
  `g.fillPoints(pts.map(([x, y]) => new Phaser.Geom.Point(x, y)), true)` — copy
  that call shape.
- `src/main.ts` reads `new URLSearchParams(window.location.search).get('scene')`.
  **`art` is an unused query key** — `?art=og` collides with nothing.
- Dev seams `window.__game` and `window.__fidelity` are already wired under
  `import.meta.env.DEV`.

**P5 — ✅ THE PHASER TRIANGULATOR QUESTION IS SETTLED — FROM THE OFFICIAL API
DOCS, NOT MEMORY.** SESSION 16 left this open because `node_modules` reads are
blocked here; it was resolved instead against Phaser's published documentation.
```
Phaser.Geom.Polygon.Earcut(data, [holeIndices], [dimensions]) → number[]
  data        flat [x0,y0, x1,y1, …]
  holeIndices e.g. [4] means the hole starts at VERTEX index 4
  returns     triangle vertex indices, e.g. [3,0,4, 5,4,0, …]
Exposed as public API since Phaser 3.50 (changelog); we pin phaser ^3.90.0.
```
⭐ **BONUS THAT NOBODY HAD LOOKED FOR — A4 GETS A FREE CORRECTNESS GATE.**
`Phaser.Geom.Polygon.Earcut.deviation(vertices, holes, dimensions, triangles)`
returns the relative area difference between the triangles and the input polygon,
**0 when the triangulation is fully correct.** That is a numeric, binary check on
hole rendering, not an eyeball.
⇒ **A4 needs no build-time triangulation fallback.** §4's A3.3 is now a
ten-second *confirmation* rather than a discovery: the docs page quoted above is
the 4.0.0 API path, so confirm the symbol actually resolves in 3.90 while the
browser is already open.

**P6 — ✅ HOLES: NOT A3's PROBLEM, AND THE RECIPE FOR WHEN THEY ARE.** Running
the hardened converter over all 16 fighter shapes (2026-07-27):
```
converted 16/16 · TOTAL rings=86 holes=15
holes live in 2641 (1) · 2646 (2) · 2648 (1) · 2662 (11)
2664: 1 ring, 0 holes          2662 paint order: SFFFFFFFFS
```
⇒ **`SHAPE_2664` has no holes, so A3 needs none.** For A4: concatenate the
non-hole ring then each `hole: true` ring into one flat array and pass the
cumulative vertex counts as `holeIndices`, then `fillTriangle` the result — the
index format maps directly onto the converter's per-ring `hole` boolean.

**P7 — ✅ THE REGRESSION SURFACE, AND IT IS SMALL.**
- In-browser fidelity gate: `npm run dev` → console → `await __fidelity.run()` →
  must stay **55/55** (41 probes + 14 edge scans). Protocol:
  `docs/research/fidelity/FIDELITY_GATE.md`. **It cannot be run from the test
  suite** — budget for a browser.
- `tests/duel-baseline.test.ts` must stay green **and unedited**.
- The `src/game/` numeric ratchet is live; only `src/game/art/generated/` is
  exempt. A3 adds hand-written `game/` code, which is **fully ratcheted**.

**P8 — ⚠️ THE KNOWN LIMIT, CARRIED FORWARD HONESTLY.** ~5 ring pairs in the wider
1822-shape corpus genuinely OVERLAP, and a per-ring `hole` boolean cannot
represent a partial overlap under any epsilon. **None is in the 16**, so it blocks
nothing here or in A4. Recorded in `docs/DIVERGENCES.md` "SESSION 16 — R1/R2".

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

Each decision carries a **one-line veto**.

### D1 — SESSION 16 landed as its OWN commit, so A3's diff is only A3 ⭐
Already done (`04352a9`, P1): 664 green tests and a changed art data model are not
entangled with the new renderer. When A3 goes wrong, `git diff` shows only A3.
> **Veto:** none — this one is history, recorded so the reason survives.

### D2 — The renderer splits into a PURE PLANNER plus a dumb executor ⭐
`src/core/artPlan.ts` turns an `ArtShape` + a stage anchor into an ordered array
of draw ops; the scene loops that array and calls Phaser. **Reason: no test can
import `src/game/`** — `tests/no-game-imports.test.ts` forbids it because Phaser
crashes the Node worker. A renderer written entirely inside a scene is
**untestable by construction**, so paint order would be back to being guarded by
vigilance. There is direct precedent: `src/core/viewport.ts` is already pure
render math living in `core/`.
> **Veto:** put it all in the scene and accept that **A3-C** becomes browser-only
> — which for this shape means unprovable, since 2664 renders identically either
> way. *Recommended against* — paint order is the finding most likely to regress
> silently, and it is the one A3's pixels cannot see.

### D3 — It renders BESIDE the existing samurai, behind `?art=og`, replacing nothing
`drawSamurai` is graded **A−** and feeds the 55/55 gate. The imported art lands
next to it, gets looked at, and only ever replaces it on evidence.
> **Veto:** swap it in. *Recommended against* — that puts new pixels in front of
> the fidelity gate before anyone has compared them.

### D4 — Fixed, labelled stage position; NOT attached to a fighter
A3 exists to answer "is the scale right?". Parenting it to a moving fighter adds
pose, facing and pivot to a step designed to isolate exactly one variable.
> **Veto:** attach it to the player now. *Recommended against* — if it comes out
> wrong you will not know which of four things caused it.

### D5 — Stroke widths go through `worldToStageLength`, never a hand-typed number
1.5 world px is 1.8 stage px. Typing `1.8` bakes the viewport scale into a
literal that rots silently the moment the transform changes.
> **Veto:** none.

### D6 — A3's layout numbers go in a NEW `src/config/art.ts`
The ratchet WILL fire on a new `game/` file. That is the ratchet working.
> ⚠️ **Move the number to config; do NOT refresh the baseline to quiet it.**
> **Veto:** add them to `src/config/display.ts` instead — fine, same effect.

### D7 — `core/artPlan.ts` must survive the zero-literal purity gate
Not even `0` or `1` is allowed in `core/`. `src/config/nums.ts` already exports
`ZERO`, `ONE`, `TWO`, `FOUR`, `HALF` — a flat-array walker needs `TWO` for the
stride and nothing else new.
> **Veto:** none. Expect one purity failure and fix it by naming the number.

---

## §2 THE BAR — binary, fixed before any code exists

| | Test | **THE NUMBER** |
|---|---|---|
| **A3-A** | Head renders at its measured INKED stage size | **17.14 × 20.16 stage px, ±1 px** |
| **A3-B** | Colours byte-exact | **fill `0xffcc99`, strokes `0x000000` — the same bytes** |
| **A3-C** | Paint order honoured | **the planner emits ops in `paints` order; a fills-then-strokes planner turns the new test RED** |
| **A3-D** | Nothing regressed | **fidelity gate 55/55 · suite ≥664 green · `duel-baseline` green AND unedited (`git diff --stat` proves it)** |
| **A3-E** | Zero console errors from a fresh load | **0** |
| **A3-F** | Earcut signature written down | **the resolved symbol + its call form, in `RESUME_HERE.md`** |

⚠️ **THE ±1 px DOES NOT MOVE INSIDE THIS SESSION.** If the render misses it,
exactly three diagnoses are permitted:
  **(a)** a units error — twips vs world vs stage (§P2's table names all three);
  **(b)** the shape-local origin offset applied twice, or not at all;
  **(c)** you measured the fill polygon instead of the ink (§P2 — check this
  first, it costs ten seconds and is the most likely of the three).
**If none explains it, STOP and escalate.** Do not adjust the expected number to
match what appeared — the rule SESSION 13 D10, SESSION 14 §2, SESSION 15 §2 and
SESSION 16 §2 all held to.

---

## §3 WHAT WILL FIGHT YOU

1. **Three coordinate spaces.** Shape-local px → world px → stage px. §P2 has
   every conversion and what each mistake looks like on screen.
2. **`src/game/` is untestable from the suite.** This is why D2 exists. Do not
   discover it after writing 200 lines inside a scene.
3. **`core/` rejects the literal `2`.** The purity gate has no allowlist. Name it
   in config and move on.
4. **The ratchet fires on new `game/` files.** Expected. Move numbers to config;
   never refresh the baseline to silence it.
5. **The fidelity gate is a browser gate.** It cannot run in vitest — it needs
   `npm run dev` and a console.
6. **`reference/` is gitignored.** A3 renders the **committed** `SHAPE_2664`,
   never the SVG. If anything in the render path reads `reference/`, that is the
   bug: the build must work in a fresh clone. SESSION 16 finding 4 was exactly
   this mistake in the test suite (639 → 595 in a clean checkout).
7. **A green suite is necessary and not sufficient.** SESSION 15 shipped 639
   green with a notch in the head's crown; SESSION 16 found eight more defects
   behind 639 green. **Look at the pixels.**
8. ⚠️ **THE GATE IS NEAR ITS OWN MEASUREMENT NOISE FLOOR.** ±1 px on a 17 × 20 px
   antialiased object is tight. §P2 fixes the measurement rule (alpha ≥ 50 %,
   CSS px, `devicePixelRatio` 1) so the number is reproducible — **use it, and do
   not renegotiate the tolerance.** If the render is out by 1.0–1.2 px, suspect
   the measurement first; if it is out by 1.8 px suspect the fill-vs-ink mistake;
   if it is out by 17 % or 20× the table above names the cause outright.

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them go red, then code,
then green.** Chaos-plant every new guard.

### A3.0 — Confirm the baseline (30 seconds)
```
git log --oneline -1        # expect 04352a9 SESSION16 R1+R2 …
npm test                    # expect 40 files / 664 tests green
```
**Gate:** both match §P1. If they do not, STOP — this kickoff's numbers are
measured against `04352a9` and nothing below is trustworthy on a different base.

### A3.1 — `src/core/artPlan.ts`, red-first ⬅ THE FIRST REAL WORK
A pure function: `planShape(shape, originStageX, originStageY, scale)` → ordered
`DrawOp[]`, where a op is `{ kind: 'fill', color, points }` or
`{ kind: 'stroke', color, widthStage, points }`. Rings marked `hole: true` are
**skipped in A3** (P6 — 2664 has none; A4 does the real thing).
**The first test to write, and it must go red before the file exists:** given a
two-paint fixture in `stroke, fill` order, `planShape` returns ops in that same
order. **Gate: A3-C.**

### A3.2 — Render it behind `?art=og`
A small scene addition that executes the plan: `g.fillStyle(op.color)` +
`g.fillPoints(...)`, `g.lineStyle(op.widthStage, op.color)` + `g.strokePoints(...)`,
in plan order, at a fixed labelled position (D4). Widths via
`worldToStageLength` (D5); layout numbers in `src/config/art.ts` (D6).
**Gate: A3-A + A3-B + A3-E. Screenshot the canvas and READ THE PIXELS — measure
the ink, do not eyeball it.**

### A3.3 — Settle P5's residual while the browser is open (ten seconds)
In the same console: `typeof Phaser.Geom.Polygon.Earcut` and
`typeof Phaser.Geom.Polygon.Earcut.deviation`.
**Gate: A3-F — both written into `RESUME_HERE.md` so A4 does not re-derive them.**

### A3.4 — Re-prove the regression surface
`npm run dev` → console → `await __fidelity.run()` → **55/55**. Full suite.
`duel-baseline.test.ts` green **and unedited**.
**Gate: A3-D, output pasted.**

### A4 handoff — write it down and stop
Update `RESUME_HERE.md` and `docs/DIVERGENCES.md` in the **same commit** as the
change each describes. **Write the SESSION 18 kickoff.** A4 (the full graded
pose) stays in `SESSION15_KICKOFF.md`; do not start it here.

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Baseline is `04352a9` / 664 green; owner's `.github/` files still untouched | `git log --oneline -1` + `git status` |
| 2 | Head renders at **17.14 × 20.16 stage px ±1** | measured from canvas pixels, pasted |
| 3 | Fill `0xffcc99`, strokes `0x000000`, **byte-exact** | read back from the render |
| 4 | Paint order pinned by a test that a fills-then-strokes planner turns RED | plant it, paste the red |
| 5 | Planner is pure and unit-tested; `core/` purity gate green | test names + gate output |
| 6 | Nothing in the render path reads `reference/` | grep the art path |
| 7 | Ratchet **not** widened; new numbers in `src/config/` | the diff |
| 8 | Fidelity gate **55/55**; suite green; `duel-baseline` green **and unedited** | pasted output + `git diff --stat` |
| 9 | Zero console errors on a fresh load | pasted |
| 10 | Earcut symbol + `deviation` confirmed in 3.90, written down | `RESUME_HERE.md` |
| 11 | Ledgers + `RESUME_HERE` in the same commit as their change | `git show --stat` |
| 12 | Nothing from `reference/` committed | `git status` + history check |
| 13 | SESSION 18 kickoff written, committed, graded | the file + its bar self-report |

---

## §6 THE TWO REAL RISKS

**Risk 1 — A3 passes and hides a paint-order bug only A4 can see.** `SHAPE_2664`
is `F S S`, so fills-then-strokes and source order produce **identical pixels**
for this shape. A3 therefore cannot detect the SESSION 16 finding it most needs
to preserve. **Gate A3-C is the entire defence, and it is a unit test, not a
render check** — which is why D2 insists the planner be importable. Write that
into the handoff rather than letting A4 assume A3 proved it.

**Risk 2 — A3 passes and hides a SCALE error only A4 can see.** A3 checks ONE
shape at ONE fixed position. ⚠️ **INHERITED, NOT RE-MEASURED THIS SESSION** (from
`SESSION16_KICKOFF.md` P3 — the one figure in this file that is not a command run
on 2026-07-27, flagged rather than laundered): the composed idle fighter is
107.4 world px → 128.9 stage px against our procedural samurai's ≈118 stage px —
two independent derivations within ~8 %, which is *evidence* that the fighter clip
is scale ≈ 1, **not proof**. A4's ≥90 % IoU is where an 8 % residual actually
bites, and **A4 must re-derive it rather than trust this line.** **A3 passing is
not a claim about A4's scale.**

---

## §7 QUEUED — deliberately NOT in this session

- **SESSION 15 A4 + A5** — the full idle pose at its recorded node transforms,
  graded ≥90 % silhouette IoU, then the write-up. Needs holes (P6), the aliasing
  rule (crotch 8 ← pelvic 14, hat 17 ← head 16), and all 16 shapes generated.
- **SESSION 14 A5 + A6** — mob AI cadence, hitbox blocking, turn-taking, `[3,10] s`.
- **The other 15 shapes.** The converter handles all 16 (P6) but one target holds
  until a pose is graded.
- **Animation.** 482 poses extracted and waiting; this session draws none.
- **All audio.** Still completely silent — no `AudioContext` in `src/`.
- **The 5 overlapping ring pairs** (P8) and **alpha support** (P3) — both
  recorded, both blocking nothing.
- **Equipment art.** Unrecoverable; the CDN is dead (`FIGHTER_ART_IDS.md` §5).
- Gradient fills, bitmap fills, real popup digits, `DuelScene` popups, the
  982-item / 75-skill / 61-quest tables, the 39 AI classes.

---

## §8 BAR SELF-REPORT

**Does this kickoff reach the bar? Yes — and unlike its predecessor it carries no
open prerequisite at all.**

- **There is no research step, and it is checkable.** Every §P number came from a
  command run on 2026-07-27 with its output quoted: the 664-test suite, the
  16/16 conversion census, the bbox measured off the committed artifact, the
  `VIEW` transform cited to the file that computes it and the test that pins it,
  and the Earcut signature quoted from Phaser's published API docs. **Exactly one
  number in the file is inherited rather than re-run — the ~8 % fighter-scale
  cross-check — and §6 Risk 2 labels it as such in place rather than letting it
  pass as freshly measured.**
- ⭐ **It CORRECTS its predecessor's decisive number.** SESSION 16 derived A3's
  size gate from the SVG header (17.16 × 20.34). Measured from the data the
  renderer will actually draw, the inked extent is **17.14 × 20.16** — and the
  geometry-only figure (15.34 × 18.36) is 1.98 px from the old target, so a
  *correct* render measured the wrong way would have tripped a hard
  stop-and-escalate. Both numbers are now in the file, with a table of what each
  failure mode looks like.
- ⭐ **It closes the previous session's one open item, and finds a gate inside
  it.** P5 settles Earcut from the official docs rather than memory or blocked
  `node_modules` — and surfaces `Earcut.deviation()`, which gives A4 a numeric
  0-means-correct check on hole rendering that nobody had asked for.
- **It refuses to let the old kickoff be used.** The banner states plainly that
  `SESSION16_KICKOFF.md` §4 A3's recipe now *describes a bug*, with the exact
  sentence quoted, because a fresh session would otherwise follow it faithfully.
- **The hardest structural constraint is surfaced before any code exists.** D2
  exists because `src/game/` is unimportable from the suite, so a renderer
  written inside a scene is untestable by construction — a fact that costs 200
  wasted lines to discover at the end instead of one paragraph to read at the
  start.
- **It names the thing this session CANNOT prove, twice.** §6 Risk 1: 2664 is
  `F S S`, so A3's pixels are identical under the bug it must not reintroduce.
  That is stated as the reason gate A3-C is a unit test, not a render check.
- **The bar can FAIL.** Six binary gates, thirteen gate rows, a ±1 px tolerance
  fixed before code, three enumerated diagnoses, and a hard stop — with the
  most-likely diagnosis listed FIRST so the stop is not spent on a measurement
  mistake.
- ⭐ **It admits its own gate is near its noise floor, and fixes that instead of
  hiding it.** ±1 px on a 17 × 20 px *antialiased* object is tight enough that
  "read the pixels" is not a specification, so §P2 defines the measurement —
  alpha ≥ 50 %, transparent background, CSS px at `devicePixelRatio` 1 — and §3.8
  gives an out-by-how-much → suspect-what ladder. Without that, the most likely
  outcome of this session was an argument about the tolerance.
- **It closes nothing it has not earned.** SESSION 15 stays live for A4/A5,
  SESSION 14 for A5/A6, both named in the banner and §7 with what remains.
- **It carries its own limits forward instead of dropping them:** the 5
  overlapping ring pairs, the absent alpha channel, and the ~8 % fighter-scale
  residual are each recorded with why they block nothing here.

**What it deliberately does not promise:** that the render will be *right*, only
that it will be *measured*. And it makes one honest admission its predecessor
could not: **A3's pixels cannot validate the paint-order fix** — that needs A4,
and §6 says so rather than letting a green A3 read as a solved problem.
