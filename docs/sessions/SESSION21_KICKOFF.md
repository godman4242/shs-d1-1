# SESSION 21 KICKOFF — PUT THE OG FIGHTER IN THE GAME

> **Entry route:** `RESUME_HERE.md` → this file. **This is the only kickoff you
> need.** Self-contained; assumes no memory of SESSION 20.
>
> **INTENT, in one sentence:** the game still draws a procedural stick samurai
> while a measured, source-graded OG fighter sits on a debug route — this session
> puts the real fighter into `DuelScene`, facing both ways, for both combatants.
>
> **⛔ THE STANDING INVARIANT:** **THE TWO GAMEPLAY VIDEOS ARE THE PRIMARY 1:1
> REFERENCE** (`reference/videos/`). Copy what is in them. **Open a frame and
> look** before grading any visual claim; when a measurement doc and a frame
> disagree, **the frame wins.**
>
> **⭐ AND THE ONE SESSION 20 ADDED, PAID FOR TWICE:** **a green gate is not a
> good picture.** Two changes last session scored better and rendered worse — one
> would have shipped a nearly-bare torso, one trousers round the knees. **LOOK at
> `renders/dressed.png` before believing any number.**
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

**Two sessions have gone into a fighter the game does not draw.**

```
src/game/DuelScene.ts:35   import { drawSamurai, ENEMY_LOOK, PLAYER_LOOK } from './samurai';
src/game/DuelScene.ts:691  drawSamurai(g, ps.x, ps.y + 60, playerFacing, PLAYER_LOOK, …)
src/game/DuelScene.ts:695  drawSamurai(g, es.x, es.y + 60, enemyFacing, ENEMY_LOOK, …)

grep -rln "fighterShapes|composePose" src/game/   ->   src/game/IdleFighterScene.ts
```
**Exactly one file composes the OG fighter, and it is a debug route.** The game
the owner actually plays still shows the Stage-1 procedural samurai.

Meanwhile the OG fighter is the best-evidenced asset in the repo: 21 imported
shapes at their recorded transforms, 7 traced garments, a headless renderer, a
per-slot comparator against the source video, and a committed score floor.

⇒ **This session connects them.** No new art, no new tracing. Wiring, facing,
and the gates that stop it regressing.

```
A7.1  the fighter becomes drawable at an arbitrary place + facing   ⬅ START HERE
A7.2  DuelScene draws it behind ?fighter=og, player only
A7.3  both combatants, with their per-fighter colours
A7.4  make it the default; retire drawSamurai behind a flag
A7.5  gates: fidelity 55/55, A6 score floors, performance, no regressions
```

---

## §P PREREQUISITES — ✅ ALL RESOLVED, NOTHING TO GO AND FIND

**P1 — ✅ SESSION 20 IS COMMITTED AND GREEN.**
```
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

**P2 — ✅ THE TOOLING SESSION 20 BUILT, AND WHAT EACH IS FOR.**
```
scripts/art/rasterise.ts      DrawOp[] -> pixels -> PNG, pure, zero deps
scripts/art/poseScene.ts      compose -> plan -> crop -> rasterise (shape map INJECTED)
scripts/art/poseRaster.ts     hands it FIGHTER_SHAPES; the CLI's output
scripts/art/renderPose.ts     the CLI
scripts/art/silhouette.ts     widthProfile + profileAgreement (the SEALED score)
scripts/art/sourceProfile.ts  the source's 19 measurements per frame, COMMITTED
scripts/art/scorePose.ts      the sealed score as JSON, on demand
scripts/art/tuneAnchors.py    the loop: retrace -> regenerate -> render -> score
scripts/art/compareToSource.py the DIAGNOSTIC score: per slot, plus an overlay
```
▶ **Run it:**
```
npx vite-node scripts/art/renderPose.ts -- dressed --out renders/d.png --json renders/d.json --slots
npx vite-node scripts/art/scorePose.ts
python3 scripts/art/compareToSource.py renders/d.json     # needs reference/
```

**P3 — ✅ WHERE THE FIGHTER STANDS TODAY, MEASURED.**
```
                    tracing   held-out    gap    height (stage px)
  session start      0.8597    0.8197   0.0400   140.5
  after A6.5 + A6.4  0.9006    0.8619   0.0387   140.5   <- the committed floors
  the BARE fighter   0.6993    0.7479      —     128.2
  frame-to-frame ceiling      0.8808
```
⚠️ **TWO SCORES EXIST AND THEY ARE NOT THE SAME NUMBER.** The SEALED score
(above, in the suite, portable) uses our exact coverage mask and committed source
numbers. The DIAGNOSTIC score (`compareToSource.py`, needs `reference/`) segments
a rendered PNG with an image heuristic. **Never quote one as the other.**

**P4 — ⭐ THE HEIGHT DIAGNOSIS FROM SESSION 19 IS WRONG, AND HERE IS THE PROOF.**
`RESUME_HERE` has carried *"the dressed figure is 11 % too tall — suspect the
SKELETON"* since SESSION 19. Measured:
```
                       stage px   video px    vs the source
our BARE fighter (no hat)  128.2      240.3      +1.5%
our DRESSED fighter        140.5      263.4     +11.3%
the SOURCE, hat included   126.2      236.7
the kasa adds 12.3 stage px = 23.1 video px
```
**Our bare skeleton is within 1.5 % of the source's FULLY EQUIPPED fighter.** The
skeleton is not the problem — **the entire overshoot is the kasa's height.**
⚠️ The scale is not in doubt: `src/config/fidelity.ts` states the study frames
are full-bleed 16:9 mapping 1:1 to our 1024×576 stage (1920/1024 = 1.875), and
**55/55 fidelity probes pin HUD positions through that mapping.**
⚠️ The trade is open and measured: pushing the brim deeper (0.65, 0.70) shortens
the figure **and costs held-out agreement** — 0.8619 → 0.8375 → 0.8247. Left for
an owner ruling; NOT tuned away.

**P5 — ✅ THE ANIMATION DATA IS ALREADY IN THE REPO, AND ONLY ONE FRAME IS USED.**
`reference/extracted/bindata/108_1t4635s0.bin` is the DefineBinaryData holding
**all 158 human animations**. SESSION 18 transcribed **one frame of one of them**
— `<anim i="idle" d="1">` frame 0, the 19 nodes now in `src/config/ogPose.ts`,
verified byte-identical against the payload by a `skipIf`-gated test.
⇒ **Facing and position are this session's job; more animation frames are the
next one's.** A7 draws the idle pose at arbitrary places, both ways.

**P6 — ✅ WHAT `drawSamurai` CURRENTLY GIVES DUELSCENE, and must keep giving.**
`src/game/samurai.ts` — `drawSamurai(g, x, y, facing, look, pose, alpha, opts)`.
Two `look`s (`PLAYER_LOOK`, `ENEMY_LOOK`), a `pose`, an alpha for the spawn
blink, and a facing. **Any replacement has to satisfy the same call sites**
(`DuelScene.ts` lines ~691 and ~695) or the scene stops compiling.

**P7 — ⚠️ THE TRAPS SESSION 20 PAID FOR. Do not re-learn these.**
1. ⛔ **A GREEN GATE IS NOT A GOOD PICTURE.** Carving the sleeve out of the gi
   scored plausibly and rendered a nearly-bare torso. Lowering the hakama 15
   world px scored **best of the whole sweep** and rendered trousers round the
   knees. Both were caught by looking.
2. ⛔ **THE PROFILE SCORE IS SCALE-FREE — a taller fighter costs it NOTHING.**
   `GATE A6-C companion` now caps the height for exactly that reason.
3. ⛔ **RANK ON THE HELD-OUT FRAME, NEVER A MEAN.** A mean will buy an overfit.
4. ⛔ **NEVER GATE ON A PNG's BYTES.** `deflateSync` output depends on the zlib
   Node was built with, and CI runs a different Node from the dev Mac. Gate on
   `rasterDigest` — the PIXELS.
5. ⛔ **`poseRaster.ts` is the ONLY file a test cannot reach** (it imports
   `src/game/**`). Everything else takes the shape map as an argument so the
   suite can drive it. Keep it that way — a mutant that swapped the dressed/bare
   slot map, deleted the backdrop guard AND moved the crop by a pixel once passed
   all 46 test files at once.
6. ⚠️ **The canvas is TRANSPARENT on `?art=` routes.** Put a backdrop behind it
   before judging. The headless renderer composites magenta and states so.

---

## §1 WHAT I DECIDED FOR YOU, AND WHY

### D1 — ⛔ NO NEW ART, NO RE-TRACING, NO NEW GARMENTS
This session is wiring. The fighter's appearance is under a committed score floor
and a pixel digest; **if either moves, this session did something it should not
have.** The one legitimate reason for them to move is a deliberate art change,
and there is none planned.
> **Veto:** none. Mixing art changes into a wiring session makes both unreviewable.

### D2 — FACING IS A TRANSFORM, NOT A SECOND SET OF SHAPES
The OG composes one fighter and flips it. Mirroring belongs in the planner
(negate x after rotation), not in 21 mirrored shape files.
> **Veto:** if a frame shows the OG's art differing between facings — say so and
> stop; that would be real evidence and it changes the design.

### D3 — BEHIND A FLAG FIRST, DEFAULT LAST
`?fighter=og` before it replaces `drawSamurai`, so the fidelity gate and the
duel-baseline can be run against BOTH renders and compared.
> **Veto:** go straight to default — *recommended against*, it makes a
> regression indistinguishable from a redesign.

### D4 — THE OG FIGHTER MUST NOT OWN GAMEPLAY STATE
`src/game/CLAUDE.md`: scenes are render-only. The fighter renders from `Sim`
state exactly as `drawSamurai` does today.
> **Veto:** none. This is a repo invariant.

---

## §2 THE BAR — binary, fixed before any code exists

| | Test | **THE NUMBER** |
|---|---|---|
| **A7-A** | Placeable | **the composed OG fighter draws at an arbitrary (x, y), proven by a headless render at two different origins whose ink boxes differ by exactly the offset** |
| **A7-B** | Facing | **mirrored draw is pixel-identical to the unmirrored render reflected — verified on the raster, not by eye** |
| **A7-C** | In the game | **`?fighter=og` shows the OG fighter for the player in `DuelScene`, 0 console errors** |
| **A7-D** | Both combatants | **player AND enemy, each in its own colours, at their sim positions** |
| **A7-E** | Default | **`drawSamurai` no longer on the default path; the old render still reachable behind a flag** |
| **A7-F** | Nothing regressed | **fidelity 55/55 · suite ≥822 green · bare clone green · `duel-baseline` green AND unedited · A6 score floors AND `GOLDEN_DRESSED` digest UNCHANGED · ratchet not widened** |

⚠️ **A7-F's "digest unchanged" is the load-bearing one.** This session must not
alter the fighter's appearance. If the digest moves, find out why before
refreshing it.

---

## §3 WHAT WILL FIGHT YOU

1. ⛔ **PERFORMANCE.** `drawSamurai` is a handful of primitives; the OG fighter is
   **90 draw ops (bare) / 55 (dressed) per fighter per frame**, with Earcut on
   the holed fills. Two fighters at 60 Hz is ~10 800 ops/s. **Measure it before
   and after; if it costs frames, cache the plan — the pose only changes when the
   pose changes.**
2. ⛔ **`planPose` cannot mirror today.** It rotates about the joint pivot,
   offsets, scales, anchors (`src/core/planPose.ts`). Mirroring has to compose
   with rotation correctly — **a sign error mirrors the pose joint by joint and
   still reads as a fighter** (SESSION 18 hit exactly this class of bug with
   Flash's y-down rotation).
3. **The OG fighter is one static pose.** The game animates. Expect it to look
   stiff — that is honest and it is A8's problem, not a defect of this session.
4. **`tests/no-game-imports.test.ts`** forbids a test from reaching `src/game/**`.
   Put every piece of arithmetic in `core/` or `scripts/` where a test can drive it.
5. **The `game/` ratchet fires on new numeric literals.** Numbers go to `src/config/`.
6. **`reference/` is gitignored** — a runtime read of it is the bug. The clean
   clone run is what proves it.

---

## §4 BUILD SEQUENCE

Every step: **write the failing test names FIRST, watch them red, then code.**

### A7.0 — Confirm the baseline (1 minute)
`git log --oneline -1` → `57dd541` · `npm test` → 48 files / 822 tests.

### A7.1 — Placeable + mirrorable ⬅ THE FIRST REAL WORK
`src/core/planPose.ts` grows a facing. Prove with the headless renderer at two
origins and both facings. **Gates: A7-A, A7-B.**

### A7.2 — `?fighter=og` in DuelScene, player only
Reuse `drawPlan`; render from sim state. **Gate: A7-C.**

### A7.3 — Both combatants, per-fighter colour
**Gate: A7-D.** ⚠️ Colour is a TINT decision — the OG art carries its own fills.
Decide and flag how player/enemy differ, and say whether a frame supports it.

### A7.4 — Default, with the old render behind a flag
**Gate: A7-E.** Re-run fidelity and duel-baseline against BOTH.

### A7.5 — The regression surface
**Gate: A7-F**, including the performance number from §3.1, measured.

### A7.6 handoff
`RESUME_HERE.md` and `docs/DIVERGENCES.md` in the SAME commit as the change each
describes. **Write the SESSION 22 kickoff.**

---

## §5 GATE (binary — do not advance on a partial)

| # | Item | Verify |
|---|---|---|
| 1 | Baseline `57dd541` / 822 green | `git log -1` + `npm test` |
| 2 | Draws at an arbitrary origin | two headless renders, ink boxes differ by the offset |
| 3 | Mirrored == reflected, on the raster | pasted digest comparison |
| 4 | `?fighter=og` draws the player, 0 console errors | screenshot on a backdrop + console |
| 5 | Both combatants, own colours, at sim positions | screenshot |
| 6 | Default path uses the OG fighter | `git grep drawSamurai` in the default path |
| 7 | Frame cost measured before AND after | pasted numbers |
| 8 | Fidelity 55/55 · suite green · bare clone green | pasted |
| 9 | **A6 floors AND `GOLDEN_DRESSED` digest UNCHANGED** | `git diff tests/` is empty for those lines |
| 10 | `duel-baseline` green AND unedited; ratchet not widened | `git diff` |
| 11 | Nothing in the render path reads `reference/` | grep + clean clone |
| 12 | Ledgers + `RESUME_HERE` in the same commit as their change | `git show --stat` |
| 13 | SESSION 22 kickoff written, committed, graded | the file + its bar self-report |

---

## §6 THE TWO REAL RISKS

**Risk 1 — the OG fighter looks WORSE in motion than the stick figure.** It is one
frozen pose; the procedural samurai at least leans and swings. **Mitigation: land
it behind `?fighter=og` and compare side by side before making it default. If it
reads worse, say so** — the honest outcome may be "keep both until A8 animates it".

**Risk 2 — a mirroring sign error that still reads as a fighter.** SESSION 18 hit
this exact class with Flash's y-down rotation and only caught it because the
transform was pinned in a test with all three wrong versions as negatives.
**Mitigation: A7-B compares the mirrored RASTER against the reflected raster.
Pixels, not eyes.**

---

## §7 QUEUED — deliberately NOT in this session

- **The other 157 animations.** `108_1t4635s0.bin` holds them; one frame of one
  is transcribed. That is A8, and it is what makes the fighter move.
- **The kasa height trade** (§P4) — measured, open, owner ruling.
- **The far forearm** is bare where the source shows cloth; the far leg reuses
  the near leg's shape (which is what the OG itself does).
- **Other outfits** — the navy duel outfit from `Nr4fQstqHDM`.
- **SESSION 14 A5 + A6** — mob AI cadence, hitbox blocking, turn-taking.
- **All audio.** Still completely silent, and still the research session most
  worth running.

---

## §8 BAR SELF-REPORT

**Does this kickoff reach the bar? Yes.**

- **There is no research step, and it is checkable.** Every number in §P came
  from a command run during SESSION 20 and is quoted with its output — the score
  table, the height arithmetic, the two `grep`s that prove the game does not draw
  the OG fighter.
- ⭐ **It opens with a two-line grep that indicts two whole sessions.** One file
  composes the OG fighter and it is a debug route. That is the argument for the
  session, and it is verifiable in five seconds.
- ⭐ **It corrects a diagnosis the handoff has carried since SESSION 19.** "The
  figure is 11 % too tall — suspect the skeleton" is **wrong**: the bare skeleton
  is within 1.5 % of the source's fully-equipped fighter, and the whole overshoot
  is the kasa. §P4 shows the arithmetic and names why the scale is not in doubt.
- ⭐ **Its §P7 is a list of traps that were each paid for once**, with the wrong
  answer each one produced — including two changes that scored better and
  rendered worse, which is the finding SESSION 20 exists to hand forward.
- **The bar can FAIL, and §6 Risk 1 says what to do if it does**: if the OG
  fighter reads worse in motion, keep both and say so rather than force A7-E.
- **A7-F pins the fighter's appearance as UNCHANGED**, so a wiring session cannot
  quietly become an art session.

**What it deliberately does not promise:** that the fighter will animate. It will
stand in the game, in one pose, facing correctly — and every later animation
frame inherits the wiring and the gates this session lands.
