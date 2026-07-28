# RESUME HERE

## 📋 NEXT-SESSION KICKOFF (paste-ready)

**Activate first** — turn these on BEFORE pasting; a fresh session won't do it for you:

| | setting | why |
|---|---|---|
| **Surface** | **Claude Code CLI** *(already)* | terminal + git + build-heavy; the browser gate needs the Chrome extension too |
| **Model** | **Fable 5** — **switch to it** | hard, long-horizon, five independent garments + a fan-out. It is markedly more dependable at sustaining parallel subagents than Opus |
| **Effort** | **`high`** — **not `xhigh`** | `high` is Fable's OWN default; `xhigh` is for a capability-bound sub-task. Carrying Opus's `xhigh` over is the common mistake |
| **`/fast`** | ⛔ **n/a on Fable** | fast mode is Opus-only. (On Opus it also costs 2× — worth ON interactive, OFF autonomous) |
| **Context** | **fresh session** — **start a new one** | the kickoff is self-contained; a compacted context re-derives for nothing |
| **MCP** | **Claude in Chrome** — turn on | gate item 9 runs the in-browser fidelity check (55/55) |
| **Skills / plugins** | **nothing to add** | honest: no library questions, no new tooling needed |
| **Ultracode** | **ON** *(already)* | A9.2–A9.5 are five independent garments — a genuine fan-out, and Fable is the right model for it |

⚠️ **Expect single turns to run many minutes on Fable, and don't add step-by-step
behavioural scaffolding to the prompt** — it front-loads the whole spec on purpose;
over-prescription degrades Fable's output rather than steering it.

Copy everything **between** the `'''` lines (the markers themselves are not part of the prompt):

```
'''
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

READ FIRST, then tell me what they say before writing anything:
- RESUME_HERE.md
- docs/sessions/SESSION22_KICKOFF.md   <- the only kickoff to plan from, self-contained

THE JOB: §4 A9.1 onward — re-author the seven traced garments in the ORIGINAL's own
art grammar (flat base tone + one hard-edged shadow tone + a stroked contour + thin
detail lines), because the gap is structural and no colour tuning can close it.

WHAT NOT TO BREAK:
- The silhouette floors may only move UP. Held-out >= 0.8618, height <= 140.5.
  If better art costs agreement, show BOTH numbers and ask — never lower a floor.
- src/core/ stays at zero numeric literals; scenes stay render-only.
- Anti-pattern to avoid by name: "a green gate is not a good picture." SESSION 20
  shipped a bare torso and trousers round the knees, both scoring well.
- Do NOT close the kasa by darkening it to hit the colour gate — §P4 explains why.

PROVE IT: every gate in §2 has a runnable measure. Paste the output, never assert it.
Red-first on every new test; chaos-plant every guard and watch it fail before it passes.

FIRST, DO THIS: confirm the baseline (git log -1 -> 20310b9, npm test -> 49 files /
827 tests), run `npx vite-node scripts/art/inkShare.ts` and paste it, then propose
the exact A9.1 step. Don't start until I ok it.
'''
```

**Bar verdict: ✅ this kickoff meets the "cannot be improved further" bar** — every
goal has a measure that can fail, it carries an explicit NOT-DONE cut line, and it
forbids in advance the two ways this session could score green and look worse. The
next change would be churn.

---

> ## ▶ SESSION 22 IN PROGRESS — A9.2 DONE: THE TWO OVER-INKED GARMENTS ARE RE-AUTHORED
> **50 files / 848 tests green** · tsc ×2 → 0 · eslint → 0 · **GATE A9-B MET on
> all seven** — the owner's "one or 2 of them": 9012 **75.9→32.6 %**, 9001
> **70.6→30.6 %**, bar 61.4 % (the OG's own worst).
>
> - **New tool `scripts/art/reauthorGarment.py <id>`** — base fill on the EXACT
>   traced silhouette ring, ONE measured hard-edged shadow, an ink stroke of
>   OG-quantised width; tones from committed p25/p75 with D4's SWF preference
>   (**the collar's base is the SWF's own `#dcd9d4`, byte-exact**). Then
>   `generate.ts` commits it; byte re-derivation still covers it.
> - **Floors moved UP, not down:** held-out **0.8619 → 0.8662**, tracing
>   0.9050, height 140.48. Committed floors stay 0.8618/140.5 until one A9.7
>   ratchet commit (D-A9.2b).
> - **A8 → A9 handover done as pre-decided:** a8Colour grades LEGACY only
>   (shared roster `tests/utils/a9Roster.ts`); failing pin shrank to
>   [9011, 9017]. `colourRuler.py` grades base-vs-p75 / shadow-vs-p25.
> - **New guard, chaos-proven:** `traceGarment.py` REFUSES to clobber an
>   AUTHORED SVG (full tracer run: both refused, five legacy re-traced
>   byte-identical, svgShape green).
> - **Looked at:** collar is a white band with a fine contour now; the sleeve's
>   black slab is gone. Still open and named: kasa (A9.3) · gi bulge + lapel
>   (A9.4) · hakama (A9.5) · branch (A9.6).
> - **Next: A9.3** — the kasa: two tones (base p75 (154,119,57), shadow p25
>   (116,84,33) — do NOT darken to the median), straw ribs, brim fringe.
>
> ## ▶ SESSION 22 — A9.1 DONE: THE PAINT-GRAMMAR GATE EXISTS
> **50 files / 847 tests green** (was 49/827) · tsc ×2 → 0 · eslint → 0 · **no
> shape file changed — the render is untouched; this step built the ruler.**
>
> - **A9.1a (`f7e3801`):** `sourceColour.ts` now carries **p25/p75 per garment**
>   — GATE A9-D's shadow/base targets, committed BEFORE any re-authored art
>   exists. Pure additions; every median/iqr byte-identical.
> - **A9.1b:** `tests/a9Grammar.test.ts` (20 tests) + `scripts/art/grammar.ts`.
>   Every traced garment is either in the **`REAUTHORED` roster** (must have an
>   ink stroke w ∈ [0.5, 2.5], ZERO all-ink fill rings, ≥2 tones, ink ≤ the
>   OG's own worst 61.4%, tones within 12 of p25/p75) or in **`LEGACY`, pinned
>   exactly** — editing a blob in place goes red with instructions to re-author.
>   Red-proofed on all seven; **3 chaos plants watched RED then reverted.**
> - ⭐ **The `no-game-imports` guard rejected the first design** (a test reaching
>   `fighterShapes.ts`) and forced a better one: 22 static pure-data imports +
>   a directory cross-check, roster in the CLI. The guard worked; keep it.
> - ⚠️ **Handover decided in advance** (ledger "SESSION 22 — A9.1"): the first
>   re-authoring commit scopes `a8Colour`'s one-fill/ratchet tests to LEGACY
>   shapes (A9-D's 12 is tighter than the 22/22/23 ratchets) and teaches
>   `colourRuler.our_fill` about multi-tone shapes.
> - **Next: A9.2** — re-author 9012 (collar, 75.9% ink) + 9001 (far sleeve,
>   70.6%), the owner's "one or 2 of them", to ≤ 61.4% (GATE A9-B).
>
> ## ⛔ A8.2 FOUND THE WEAPON IN THE REPO — AND THE ART IS NOT 1:1 FOR A STRUCTURAL REASON
> **49 files / 827 tests green** · tsc ×2 → 0 · eslint → 0 · **the render is
> UNCHANGED** (slot 3 deliberately unwired — see the floor trade below).
>
> ### ⭐ THE STARTING WEAPON IS `DefineShape 2641` — ORIGINAL VECTOR ART
> **A8.2 must NOT trace anything.** The kickoff's *"trace the saya + tsuka onto
> slots 3/4"* is built on a premise nobody checked: **nothing had ever rendered
> the 1822 shapes in `reference/extracted/shapes/`.** New tool
> `scripts/art/shapeAtlas.ts` renders them all through the repo's own pipeline:
> ```
> npx vite-node scripts/art/shapeAtlas.ts        -> renders/atlas/sheet_00..09.png
> npx vite-node scripts/art/shapeAtlas.ts -- --ids 2641   -> one, big
> ```
> Sheet 06 holds a **knobbly brown tree branch with a green leaf** — the item icon
> from the PLAYER screen, exactly. `BRANCH · DMG 1-2 · WEIGHT 1 · LEVEL 1`.
> ⚠️ **SESSION 18 already had it and skipped it on purpose** ("2641 … not in the
> fighter") — true of the BARE doll, wrong for the dressed one.
> ⭐ **All ten sheets were read.** The payload holds the body, the branch, a
> detailed alt head (2662), items, VFX, scenery and the equipment-SLOT ICONS —
> but **no wearable kasa, gi or hakama anywhere.** Equipment art is fetched by
> name at runtime (dead CDN); the STARTING weapon ships in the payload because a
> new character already holds it. ⇒ **Tracing the garments stays correct; tracing
> the weapon never was.**
>
> ### ⛔ WHY THE ART IS NOT 1:1 — IT IS STRUCTURAL, NOT COLOUR
> ```
>                  OG's own art (2644-2678)      our traced garments (9001-9019)
>   fills/part     2 - base + HARD-EDGED shadow  1 flat tone
>   outline        a real STROKE, w 2 / 1.5 / 1  a black FILLED BLOB, random width
>   detail         thin strokes, w 0.5-1         none
>   contour        smooth Bezier                 potraced raster, ragged
> ```
> The OG is **cel-shaded Flash vector art**: flat fills, one hard shadow shape, a
> stroked contour, thin interior detail lines, paint order significant. Ours is a
> silhouette with a hole punched in it. ⇒ **No colour tuning in A8.4 can close
> this.** The garments must be RE-AUTHORED in that grammar, using the video as an
> outline guide the way a Flash artist uses a reference.
> ⭐ **And the OG's own cloth colours are byte-exact:** shape 2653 carries
> `#dcd9d4` and `#9e9a97` straight from the SWF, and our video-measured hakama
> median `(220,213,219)` is **within 7 levels** of `#dcd9d4` — the lossy sample is
> confirming a value we already hold exactly.
>
> ### ⛔ THE BULGE IN THE SHIRT IS `9015`'s TRACED OUTLINE (owner, 2026-07-28)
> Emptying slot 19 leaves the ink bounds **byte-identical** ⇒ the doubled-sleeve
> theory carried since SESSION 19 §P7 is **REFUTED**; the sleeve is entirely
> inside the silhouette. Rendered alone, **9015 has a rounded lobe jutting off its
> back edge**: `outer_silhouette`'s flood fill leaks across the jacket's back into
> the far-sleeve region and merges them into a balloon. Same family as the ragged
> hem — a trace defect, fixed by re-authoring, not by moving an anchor.
> ```
> npx vite-node scripts/art/shapeAtlas.ts -- --ids 2646   # the OG's torso, for contrast
> ```
>
> ### ⚠️ WIRING THE BRANCH COSTS THE SEALED FLOOR — AND THE FLOOR STAYED UP
> ```
>                    held-out    tracing    height
>   without branch    0.8619     0.9185     140.5   <- committed floor
>   with branch       0.8526     (held)     140.5
> ```
> ⛔ **Floor NOT lowered** (kickoff §2 A8-E wrote the response in advance).
> ⚠️ **The drop is probably OUR fault:** the source's stick runs **upper-left →
> lower-right**, ours runs **upper-right → lower-left** — mirrored. **The lead:**
> node 3 is `rotationDeg: 142`, the source needs ≈ **+38**, and `142 = 180 − 38`
> (a horizontal-mirror signature); node 4 carries exactly `−38`. **Fix the facing
> before ruling on the trade** — a correctly angled branch may score ABOVE the floor.
>
> ### ⚠️ WHAT A KASA IS — the art depends on the word
> A **kasa** (笠) is a conical hat **WOVEN** from straw/sedge/bamboo. Because it is
> woven, the original shows **radial ribs fanning from the apex** and **a fringe of
> cut straw ends round the rim**. Ours is a flat solid cone with neither.
>
> ---
>
> ## ▶ A8.1 DONE, GATE A8-A MET
> **49 files / 827 tests green** (was 48 / 822) · tsc ×2 → 0 · eslint → 0 ·
> **no colour was changed — this step only measured.**
> ```
> scripts/art/colourRuler.py    source median inside each garment's OWN traced mask
> scripts/art/sourceColour.ts   the 7 medians, COMMITTED (portable, no reference/)
> tests/a8Colour.test.ts        the per-garment ratchet — may only move DOWN
> traceGarment.garment_masks    extracted, so ruler + tracer share ONE mask rule
> ```
> ⭐ **Proof the extraction changed nothing: all 7 traced shapes regenerate
> BYTE-IDENTICAL.**
> ```
>    id garment          SOURCE median   OURS            delta      worst  spread
>  9017 kasa straw       (122, 88, 38)   (142,111, 56)   +20+23+18   23 ⛔  38,35,24
>  9012 collar / juban   (204,201,203)   (182,180,182)   -22-21-21   22 ⛔  16,17,14
>  9011 hakama           (220,213,219)   (200,195,197)   -20-18-22   22 ⛔   3, 2, 5
>  9015 gi body          (104,100,103)   (110,107,109)    +6 +7 +6    7      2, 1, 1
>  9019 gi sleeve near   (104,100,103)   (106,102,105)    +2 +2 +2    2      2, 1, 1
>  9014 obi              (204,201,201)   (205,202,203)    +1 +1 +2    2      6, 6, 8
>  9001 gi sleeve far    (103,100,103)   (102, 99,103)    -1 -1 +0    1      2, 2, 2
> ```
>
> ### ⛔ TWO THINGS IN THE SESSION 21 KICKOFF ARE NOW WRONG — do not follow them
> 1. ⛔ **THE STARTING WEAPON IS A BRANCH, NOT A SWORD (owner, confirmed on the
>    frame).** A8.2 says "trace the saya + tsuka onto slots 3/4". **There is no
>    saya and no tsuka.** The PLAYER screen of video A reads, verbatim:
>    ```
>    t=708.0s  BRANCH   DMG: 1 - 2  (EQ: 1 - 3)   WEIGHT: 1   LEVEL 1
>    t=656.0s  PICKAXE  DMG: 1 - 3  (EQ: 1 - 2)   CONDITION: WELL-MAINTAINED
>    ```
>    ⭐ **That pair also settles a flagged-INFERRED item:** `EQ` is the currently
>    **EQUIPPED** weapon's range, shown for comparison, and the selected item's
>    number is **green when better, red when worse** (`3` green on the pickaxe,
>    `2` red on the branch). No "bonus range" reading fits both frames.
>    ⇒ **A8.2 traces ONE stick onto slot 3.** `reject_occluder`'s docstring calls
>    it "THE SAYA" — the NAME is wrong, the mechanism is right.
> 2. ⛔ **§P4.12's kasa number has the SIGN BACKWARDS — and the kasa must NOT be
>    "fixed" to the median.** It read the straw as `(167,126,61)` and called ours
>    25 too DARK. The mask median is `(122,88,38)` and **ours is +23 too LIGHT**.
>    ⚠️ **This step's own first explanation was wrong and was overturned by
>    checking it.** `(167,126,61)` is NOT off-garment — it is at ~**p85 of the
>    straw's own distribution** (11.3 % of kasa mask pixels sit within 12/channel
>    of it; 14.3 % sit within 12 of our own fill):
>    ```
>    p25 (116, 84,33)   p50 (122, 88,38)   p75 (154,119,57)   p90 (173,138,74)
>    ```
>    ⇒ **The kasa is genuinely two-tone** — which its `iqr` of **38,35,24** was
>    already saying — and a single fill cannot represent it. Our `(142,111,56)`
>    sits BETWEEN the two modes, the least-wrong flat value available.
>    ⛔ **A8.4 MUST NOT DARKEN THE KASA TO PASS A8-D.** That moves it onto the
>    dark mode, makes the hat visibly darker than the source reads, and scores
>    better doing it — SESSION 20's "green gate, worse picture" trap exactly.
>    **Its defect is missing straw texture (§P4.9 → A8.6), not hue.**
>    ✅ Its hakama number (`220,213,219`, ours ~20 dark) is **exactly right**, and
>    its "the gi is fine" holds (worst channel 7).
>
> ### ⭐ THE CAUSE OF THE COLOUR ERROR IS PROVEN, NOT SUSPECTED
> `trace_one`'s recipe (5×5 median filter → mean over a once-eroded core)
> **reproduces our committed fill exactly for all seven garments**, so the whole
> error lives there. ⚠️ **It is NOT a global darkening:** the kasa goes +20
> lighter, the hakama and collar ~20 darker. Every garment is dragged **toward
> whatever surrounds it** — boundary bleed, not gamma. ⚠️ Two causes are still
> confounded (the filter+mean, and erosion depth 1 vs 6); **A8.4 must separate
> them before claiming which.**
>
> ### ⚠️ WHAT A8-A CANNOT SEE — read `iqr` before believing a delta
> It grades ONE flat fill against ONE median. The kasa's spread is **38,35,24**:
> it is not one colour in the source, so matching its median will not make it
> look right — its real defect is missing straw texture (§P4.9). The hakama's
> spread is **3,2,5**, so there the median IS the whole answer.
> The source's **outline is not black** either (`#180e06` kasa, `#140e0e` collar,
> `#0d080c` obi) and we paint `0x000000` — measured, reported, deliberately NOT
> gated (an anti-aliased edge has no single true colour).
>
> ---
>
> ## ▶ THE KICKOFF — **`docs/sessions/SESSION21_KICKOFF.md`**
> **MAKE THE FIGHTER LOOK LIKE THE PICTURE.** Self-contained, the only kickoff to
> plan from, **no open prerequisites.**
>
> ⭐ **THE OWNER LOOKED AND RULED (2026-07-28):** *"it still is not perfect and
> needs to be improved… where you need to check your work and compare it to the
> og picture."*
>
> ⛔ **THE SILHOUETTE RULER HAS RUN OUT OF ROAD.**
> ```
> sealed  tracing 0.9006  held-out 0.8619        the source's own two
> diagnostic tracing 0.9185   IoU 0.7499         frames agree at 0.8808
> ```
> **We score HIGHER against a source frame than the source's own two frames score
> against each other — and the fighter still does not look like it.** A width
> profile is blind to colour, to interior detail, and to the first thing an eye
> lands on: **he is not carrying his sword.**
>
> ▶ **See it yourself — one command:**
> ```
> npx vite-node scripts/art/renderPose.ts -- dressed --out renders/d.png --json renders/d.json
> python3 scripts/art/compareToSource.py renders/d.json && open renders/side_by_side.png
> ```
>
> ### ⛔ ELEVEN DIFFERENCES, BAND BY BAND — do not re-derive them
> ⚠️ **HOW THE LIST GREW IS THE LESSON.** One whole-figure look produced FIVE.
> **The owner looked and immediately named two more** — *"the shirt is too big,
> pants not fully loaded"* — and looking band by band found four beyond that.
> `compareToSource.py` now emits three band crops; **look at all three.**
> ```
> renders/band_A.png  hat/head/collar   band_B.png  torso/jacket/sword
> renders/band_C.png  hakama/hem/feet   side_by_side.png  the whole figure
> ```
> **TORSO (the worst band):** 1. **NO SWORD** — hilt forward at chest height,
> scabbard past the knee; owns a third of the source's band · 2. **the jacket has
> NO internal structure** (source: lighter front panel, darker back, white collar
> edge; ours: one flat tone) — the owner's *"shirt is too big"*, recorded as an
> observation because crude area measurement could not isolate it · 3. **our
> forearm is BARE where the source's is SLEEVED** (skin 1.20× their share) ·
> 4. no emblem/mon · 5. the back bulge is lumpy with ragged shoulder artefacts.
> **LOWER BODY:** 6. **the hem is RAGGED — the owner's *"pants not fully
> loaded"*, and it is a TRACE defect: the source's hem sits IN GRASS and the
> flood fill follows the grass, not the garment** · 7. it reads as **two trouser
> legs with a deep V**; the source is one closed column · 8. at 97 % height we
> are **5.59× wider** than the source (our sandals vs their grass-hidden feet).
> **HEAD:** 9. **the kasa has no straw texture and no BRIM FRINGE** · 10. the
> **juban collar does not read** · 11. face/hair, maybe not fixable (source hair
> 20.4×24.0 world px vs our 2670's 14.2×15.0).
> **GLOBAL, measured:** 12. **fills are DARK** — robe (220,213,219) vs our
> `0xc8c3c5`, kasa (167,126,61) vs our `0x8e6f38`; the gi is within 6, so not a
> gamma issue · 13. **we are too INKY** — black is **35.9 %** of our figure vs the
> source's **28.8 %**.
> ⭐ **And why the score missed it all:** we are **25-28 % too NARROW** through the
> mid-body (45-60 %, the missing sword and the bare arm) and **5.59× too wide** at
> the ankles. **The two errors partly cancel in a whole-figure score** — which is
> how 0.9006 was reached with the picture still visibly wrong.
>
> ⚠️ **SESSION 22 IS "PUT THE OG FIGHTER IN THE GAME"** — `DuelScene.ts:691` still
> calls `drawSamurai`, and only `IdleFighterScene.ts` composes the OG fighter.
> That was SESSION 21's plan until the owner looked; its gates are already
> drafted in SESSION21_KICKOFF §7.
>
> ### ✅ SESSION 20 CLOSED — A6.1–A6.5. Gates A6-A, A6-B, A6-C MET.
> **The loop that grades the fighter exists, and it works.** 48 files / **822
> tests green** (was 44/750), tsc ×2 → 0, eslint → 0, fidelity **55/55**, clean
> clone green, 0 console errors.
> ```
> scripts/art/renderPose.ts     headless render -> PNG, byte-deterministic
> scripts/art/compareToSource.py per-slot error vs the source + an OVERLAY
> scripts/art/scorePose.ts       the sealed score, on demand
> scripts/art/tuneAnchors.py     the loop: retrace -> render -> score -> rank
> tests/a6Score.test.ts          the score as a committed FLOOR + a height CEILING
> tests/poseRender.test.ts       the real render's pixels, pinned
> ```
> ```
>                     tracing   held-out    gap    height
>   session start      0.8597    0.8197   0.0400   140.5
>   after A6.5 + A6.4  0.9006    0.8619   0.0387   140.5   <- committed floors
>   the BARE fighter   0.6993    0.7479      —     128.2
>   frame-to-frame ceiling      0.8808
> ```
> ⭐ **Held-out +0.0422 across the session**, on a frame the outfit was never
> traced from. **The gi no longer swallows the head; the feet emerge from under
> the hem instead of floating below it.**
>
> ### ⛔ THE THREE FINDINGS THAT COST THE MOST — do not re-derive them
> 1. **A GREEN GATE IS NOT A GOOD PICTURE, and it bit twice.** Carving the sleeve
>    out of the gi (which the SESSION 20 kickoff itself prescribed) scored
>    plausibly and rendered a **nearly-bare torso**. Lowering the hakama 15 world
>    px scored **best of the entire sweep** — held-out 0.8781, the two frames
>    within 0.0067 — and rendered **trousers round the knees with the feet
>    swallowed**. Both caught only by looking. **LOOK at `renders/dressed.png`.**
> 2. **THE PROFILE SCORE IS SCALE-FREE, so a taller fighter costs it nothing.**
>    That is the hole the hakama variant walked through. `GATE A6-C companion`
>    now caps the height. **A scale-free score needs a scale gate beside it.**
> 3. ⭐ **"THE FIGURE IS 11 % TOO TALL — SUSPECT THE SKELETON" IS WRONG.**
>    Measured: our **BARE** fighter is 240.3 video px against the source's
>    **fully equipped** 236.7 — **+1.5 %**. The skeleton is right; **the whole
>    overshoot is the kasa**, which adds 23.1 video px where the source's adds
>    none. Pushing the brim deeper fixes height and COSTS held-out agreement
>    (0.8619 → 0.8375 → 0.8247). **Open, measured, for an owner ruling.**
>
> ### ⚠️ TWO SCORES EXIST AND THEY ARE NOT THE SAME NUMBER
> **SEALED** (`tests/a6Score.test.ts`, portable, in CI): our exact coverage mask
> vs committed source numbers. **DIAGNOSTIC** (`compareToSource.py`, needs
> `reference/`): both sides through an image heuristic; richer — per slot, plus
> an overlay. **Never quote one as the other.**
>
> ### ⛔ A6-E WAS OVERTURNED, NOT MET — and the gate was NOT rewritten to fit
> It wanted slot 15's top BELOW the head's bottom (y 325.3). **The bare torso it
> replaces has its own top at 321.4** — already above that line. No garment
> covering the torso can satisfy it. Recorded for a ruling; the honest bar ("at
> or below the top of the part it replaces") we pass at 322.5.
>
> ---
>
> ## ▶ THE KICKOFF — **`docs/sessions/SESSION20_KICKOFF.md`**
> **BUILD THE LOOP THAT GRADES THE FIGHTER, THEN LET IT FIX HIM.** Self-contained,
> the only kickoff to plan from, **no open prerequisites.**
>
> ⭐ **THE OWNER ASKED FOR IT, IN THESE WORDS (2026-07-27):** *"if you follow the
> source material and automatically compare and iterate yourself in a loop until
> it looks like the source material you will be fine."* He is right, and
> SESSION 19's own error log is the evidence.
>
> ⛔ **EVERY DEFECT IN SESSION 19's OUTFIT WAS FOUND BY A HUMAN EYE, NEVER BY A
> GATE — while the suite sat at 750 green, fidelity 55/55, typecheck 0, lint 0:**
> | defect | found by | survived |
> |---|---|---|
> | hakama 18 world px too low | assistant, on first render | one step |
> | **SLEEVE assigned to the TORSO slot** | **the owner** | a step, and it shipped |
> | kasa too high (brim 0.40 → 0.60) | a height measurement, after the fact | two steps |
> | **gi 1.76× oversized, rising into the neck** | **the owner** | shipped, still open |
> **Nothing in the repo compares the rendered fighter to the source.** SESSION 20
> builds that comparison and puts its score under a committed floor.
>
> ### ✅ SESSION 19 A5.1–A5.5 CLOSED — 7 traced garments on screen, and measured
> `?art=dressed` → **20 parts**, `?art=idle` → the bare 21, unchanged. **750 green ·
> fidelity 55/55 · bare clone green · 0 console errors.**
> **A5-C 3 of 4 PASS** (head 0.990 · shoulder 0.879 · pelvis 1.017 · mid-torso
> 0.769 MISS) against A4-D's **four**-of-four miss — the session's thesis
> confirmed. ⭐ **The targets were committed in a SEPARATE EARLIER commit
> (`00c6628`)** so nothing could be fitted to the answer.
> **A5-E: held-out agreement 0.8294**, tracing-frame 0.8742, and the source's own
> two frames agree at **0.8808** — so we reach **94 % of the ceiling** and are
> barely better on our own source. **Not overfitted.**
>
> ### ⛔ THREE DEFECTS CARRIED FORWARD, ALREADY DIAGNOSED — do not re-derive them
> 1. **The gi is 1.76× oversized and rises 13 px into the head.** `9015` is the
>    gi's OUTER silhouette (the sleeve hides the body panel), but the sleeve is
>    then drawn AGAIN on slot 19 — the lobe is counted twice. Measured: gi
>    **41.1 × 50.4** replacing a torso of **23.3 × 28.4**; gi top **y 311.9** vs
>    head bottom **y 325.3**. Fix: slot 15 wears a TORSO-SIZED panel.
> 2. **The dressed figure is 11 % too tall** — 263.4 video px vs the frames'
>    236.7 (227–250). ⚠️ **Our BARE fighter is 240.3 video px with NO hat while
>    the source's are 236.7 WITH one**, so the skeleton is already at the top of
>    the range and any hat overshoots. **Suspect the skeleton, not the garment.**
> 3. **Blank spots:** the feet (y 420.7–431.4) sit BELOW the near hakama's hem
>    (418.7); the far forearm is bare where the source shows cloth.
>
> ⚠️ **THE CANVAS IS TRANSPARENT on `?art=idle` and `?art=dressed`.** A black
> outline over a black page is invisible — a whole round went to "fixing" an
> outline that was already correct. **Put a backdrop behind it before judging.**
>
> ⭐ **OWNER DESIGN CONFIRMATION (2026-07-27):** clothes are equipped/unequipped
> **per item, at any time**, and unequipped is the naked fighter. The per-slot
> override table (`TRACED` in `src/config/ogPose.ts`) already models exactly that,
> so **the bare fighter is the real unequipped state**, not scaffolding — which is
> why `?art=idle` must keep working and `OG_SLOT_SHAPES` is never edited in place.
>
> ---
>
> ## ▶ SESSION 19 — the kickoff
> **GIVE THE FIGHTER ITS CLOTHES, TRACED FROM THE VIDEOS.** Self-contained, the
> only kickoff to plan from, **no open prerequisites.**
>
> ### ✅ A5.1 DONE — the tracing frames are chosen, by looking. Ledger: **`docs/sessions/SESSION19_A5-1_TRACING_FRAMES.md`**
> **Trace from** `reference/frames/s19_trace/zFt_0061.png` (**t=590.0 s,
> `zFtCaTO0_1M`**) · **hold out** `zFt_0071.png` (t=595.0 s) for D5. Seven
> per-garment crops recorded with slot targets; five fully unoccluded, and the
> obi and the hem carry a **stated** defect rather than a claim of perfection.
> Baseline for the step: **`8257518`**, suite **44 files / 742 tests green** —
> note the kickoff's §4 A5.0 / §5 item 1 still say `24c56ef`, which is one commit
> stale (the kickoff-writing commit landed on top of it).
>
> ⛔ **A5.1 OVERTURNED FOUR THINGS, ALL BY OPENING A FRAME.**
> 1. ⭐ **THE WIDTH TARGETS ARE HUD-CONTAMINATED — A5-C CANNOT GRADE UNTIL THEY
>    ARE RE-MEASURED.** On `combat_idle_measurements.md`'s own primary frame, the
>    green health bar is rows **626–634** and the watermark **617–699**, while the
>    fighter's topmost pixel is **y 641**. The doc's landmark table calls rows
>    **616–638 "Kasa (hat)"** — so its "head, ~55 px" is the kasa *brim* and its
>    "shoulders ~80 px at row 683" is still hat. With the HUD suppressed, five
>    frames agree on **233–243 video px (mean 127.4 stage px)** where the doc says
>    266–274. **Our bare fighter is 128.164 — within 0.6 % of that mean**, not the
>    2.8 % low A4-F reported against the inflated 131.8.
>    ⚠️ This does **not** dissolve A4-D: against the clothed frame the shoulder
>    gap closes to 0.95 but the pelvis stays 0.68, which is what a flaring hakama
>    would do. **SESSION 18's clothing diagnosis survives for the lower body; the
>    upper-body miss was substantially a measuring error.**
>    ⚠️ The re-measurement is ONE frame, ONE outfit — a first pass, not a
>    contract. **A5.5 owes A5-C a fresh multi-frame, per-outfit target set,
>    produced BEFORE any traced garment is graded (D1 must not invert).**
> 2. **D2's outfit is replaced.** `Nr4fQstqHDM` has a burned-in **"SOUND360TM"**
>    watermark, a weapon across the body in every frame, and only 3/4-back views.
>    `zFtCaTO0_1M` has **no watermark**, a lone fighter, and a **clean side
>    profile — the rig's own view**. §P7's `#666666` "grey shoulder armour" was a
>    second fighter inside the same crop; **the player has no shoulder armour.**
> 3. **§P3's "the overworld is unusable at ANY resolution" is over-general** — true
>    at t=350 s, false at t=590 s, where the lone fighter is **233 px** and is the
>    only place the whole outfit is unoccluded. The primary tracing frame is an
>    overworld frame.
> 4. **The tracing unit is the SLOT, not the garment** (§P5's own rule, undrawn by
>    §4): one grey gi spans slots 15+13+19/20, one hakama spans 6/10+7/11 — so
>    A5.2/A5.3 must decide **where to cut a continuous garment into parts**.
>    And **colour alone will not cut it**: gi body and sleeve are one grey
>    (`#676467`), separated only by the outline.
>
> ⭐ **`ffmpeg` pulls are proven byte-exact:** re-pulling t=598.383 s from
> `zFtCaTO0_1M.mp4` differs from the committed `session11/…/t598.383.png` by
> **mean abs 0.00** — which also identifies the whole `session11/` tree (328 of
> the index's 448 full-res frames) as coming from the watermark-free video.
> New tool: **`scripts/art/outfitFrames.py`** (`scan` / `measure` / `clusters`) —
> build-time only, renders an overlay for every answer. **The three wrong answers
> this step produced — a 500-row "fighter", a 269 px height, and three garment
> colours that were the background — were each caught by looking at the mask,
> never by reading the numbers.**
>
> ⛔ **NEW STANDING INVARIANT (owner, 2026-07-27, now in `CLAUDE.md`): THE TWO
> GAMEPLAY VIDEOS ARE THE PRIMARY 1:1 REFERENCE.** Copy what is in them,
> directly. Open a frame and LOOK before grading any visual claim; when a
> measurement doc and a frame disagree, **the frame wins**. SESSION 18 A4.1–A4.4
> were built from extracted data and a measurement doc without opening a frame —
> which is exactly how A4-D came to grade a bare doll against a clothed fighter.
>
> ⭐ **A4-D IS RULED ON: the width gate MOVES to the clothed fighter, it is not
> deleted.** Head Ø 28.4 · shoulder 42.7 · mid-torso 36.3 · pelvis 37.7 stage px
> become SESSION 19's **A5-C**, applied to a fighter wearing traced clothing —
> which is what they were measured from. The bare fighter keeps the two
> clothing-independent measures, and passes both.
> ⚠️ **The rule that keeps A5-C honest: TRACE, THEN MEASURE — NEVER MEASURE, THEN
> ADJUST.** The clothes come from the same footage the targets do.
>
> ⭐ **The kickoff kills two thirds of its own source material on page one:** only
> **117 of ~700** stills are full 1920×1080, and **the overworld is unusable at
> ANY resolution** — pulled at a true 1080p, the fighter is ~35 px tall and
> compression-blurred. Combat frames give ~270 px, crisp. ffmpeg full-res
> extraction is proven; a real palette sample is in its §P7.
>
> ---
>
> ## ▶ SESSION 18 — **A4 CLOSED. THE WHOLE FIGHTER IS ON SCREEN AND MEASURED.**
> Kickoff: **`docs/sessions/SESSION18_KICKOFF.md`** (read it, not this summary).
> Baseline is **`c46adbc`**, not the kickoff's `a9592d7`: three owner commits
> (CI + dependabot) landed on top, and `git diff a9592d7..HEAD -- src tests` is
> **EMPTY** — only `package.json`/lock moved. §P1's 690-test figure re-confirmed
> on `c46adbc` before any work started.
>
> ### ✅ A4.1 DONE — hole rings are packed, not skipped. **701 tests green** (was 690).
> `planShape` emits a third op kind, `holedFill { flatXY, holeIndices }` — Earcut's
> own argument shape — and `drawPlan` calls `Phaser.Geom.Polygon.Earcut` +
> `trianglesOf` + `fillTriangle`. **7 chaos plants, all watched RED then reverted.**
>
> ⛔ **THE KICKOFF'S §P4 RECIPE IS WRONG FOR THE FIGHTER'S OWN TORSO — this is the
> finding of the step.** §P4 says "concatenate **the** non-hole ring, then each
> hole ring" (singular). Shape **2646 (torso, slot 15)** has a fill paint with
> **TWO outer rings and TWO holes, one hole inside each**:
> ```
> ring0 out  area 153.77  bbox [-9.60,-21.55 ..  9.82, -6.55]
> ring1 out  area  58.02  bbox [-1.50, -9.05 ..  8.85,  2.15]
> ring2 HOLE area  -4.46  → inside ring0        ring3 HOLE area -3.34 → inside ring1
> ```
> The singular recipe packs ring0+ring2+ring3 and **drops ring1 entirely**.
> Earcut does not error on a hole outside its outer ring — it returns a plausible
> mesh. **D-A4.1: holes pair with their CONTAINING outer, by geometry.** Planting
> the kickoff's own recipe turns 4 tests red, headed by `pairs each hole with the
> outer ring that CONTAINS it — the real shape 2646 topology`.
>
> ⭐ **Corrected hole scope, measured over all 16 shapes:** the 14 fighter shapes
> need **3 packed ops / 3 hole rings** (2646 → 2 ops, 2648 → 1) — the kickoff's
> "4 hole instances" once 2648 is drawn twice, at slots 6 and 10. All 16 real
> shapes plan **without a single throw**.
>
> ⭐ **ONE containment implementation, not two** — `src/core/ringGeometry.ts`.
> `pointInRing`/`boundaryProbes`/`distToRing`/`ringContains` moved verbatim out of
> `scripts/art/svgShape.ts`, which now imports and re-exports them. The converter
> asks "how many rings contain this one?" (→ `ring.hole`); the planner asks
> "*which* ring contains this hole?" (→ `holeIndices`). A drifting second copy is
> how those two answers silently disagree — and that rule already produced **24
> wrong verdicts across 19 shapes** once (SESSION16 R2 finding 3).
> **Proof the extract changed nothing: `shape2664.ts` regenerates BYTE-IDENTICAL.**
>
> ⚠️ **Both pairing ambiguities THROW rather than guess:** a hole inside no outer,
> and a hole inside more than one (innermost-wins is deliberately not implemented
> — nothing in the 16 needs it; veto = implement it when a real shape does).
> ⚠️ **A4-A is only HALF proven.** This is the packing. `Earcut.deviation(…) === 0`
> is a browser check and belongs to **A4.4** — nothing about holes has been
> *rendered* yet.
> ⚠️ **The `game/` ratchet fired and was NOT refreshed** — `TRIANGLE_VERTS` moved
> to `src/config/art.ts` and `OgArtScene.ts` is back to an empty multiset.
> ⚠️ **PROCESS: the first plant run reported all 7 GREEN and it was the HARNESS.**
> `vitest --reporter=basic` does not exist in vitest 4 — it threw `ERR_LOAD_URL`
> before running a single test, and "no failures printed" read as a pass. Check
> the exit code, not the absence of output.
>
> **Gates:** suite **701/701 (42 files)** · tsc ×2 exit 0 · eslint exit 0 ·
> ratchet not widened · full record in `docs/DIVERGENCES.md` "SESSION 18 — A4.1".
>
> ### ✅ A4.2 DONE — all 14 fighter shapes are compiled into the build. **708 green.**
> The 13 remaining shapes generated with §P7's own command; **regenerating them a
> second time is byte-identical.** `2641` (training branch) and `2662` (alt head)
> are deliberately NOT committed — neither is in the fighter.
>
> ⛔ **THE KICKOFF'S "gates already cover them" WAS TWO-THIRDS TRUE, AND THE
> MISSING THIRD MATTERED.** The ratchet's provenance gates *do* enumerate the
> directory, so all 13 were covered the moment they landed (which is why the test
> count didn't move). But **the byte-for-byte re-derivation test was hard-coded to
> `2664`** — and by its own docstring it is "the ONLY assertion in the repo that
> can catch the converter drifting away from the art the game actually draws".
> Committing 13 more would have left thirteen artifacts **no gate could hold the
> converter to**. It is now directory-driven; a shape added later is covered the
> moment it lands.
>
> ⭐ **The committed art now meets the packer IN THE SUITE** (reads the committed
> `.ts`, never `reference/`, so it runs in CI): **3 packed ops / 3 hole rings
> across the 14** — 2646 → two ops, one hole each · 2648 → one op, one hole · the
> other twelve hole-free. That is the kickoff's "4 hole instances" once 2648 is
> drawn twice, at slots 6 and 10.
>
> **2 more chaos plants, both RED then reverted:** a coordinate nudged
> `0.4 → 0.41` in `shape2670.ts` (**a new file**) → caught by name, while the old
> 2664-only test stayed green · a forged `characterId 9999` in `shape2653.ts` →
> both provenance gates red.
>
> ⚠️ **NOTHING IS DRAWN YET.** The 13 are compiled in and planned in tests; the
> composer is A4.3 and the first render is A4.4. A green A4.2 says the DATA is
> sound, not that anything appeared on screen.
> ⚠️ **Ratchet baseline NOT refreshed** — `tests/game-purity-baseline.json` is
> unmodified.
>
> ### ✅ A4.3 DONE — the composer. **726 green** (was 708). Gates A4-B + A4-C.
> `src/core/composePose.ts` — 19 nodes + 2 aliases + a slot→shape map → one
> ordered draw list, back to front. Pure, red-first, 18 tests, **7 chaos plants
> all watched RED** (aliases dropped → **15 red**).
>
> ⛔ **THE KICKOFF'S GATE A4-B SAYS "17 drawn parts". THE CORRECT NUMBER IS 21.**
> Its own §P3 table gives: 21 slots − 3 empty by design (3 weapon · 4 prop ·
> 17 hat) = **18 occupied**, +3 second parts (slot 7 foottop · 11 foottop ·
> 16 hair) = **21 drawn parts**. An arithmetic slip, not a tolerance, so §2's
> "tolerances do not move" doesn't apply — but the correction is **derived, not
> transcribed**: the test computes both numbers from `OG_SLOT_SHAPES` itself, so
> the suite owns them and cannot inherit the slip. **A4.4 must expect 21.**
>
> ⭐ **THE TRANSCRIPTION IS CHECKED AGAINST THE PAYLOAD'S OWN BYTES.**
> `OG_IDLE_NODES` is 19 rows × 4 numbers typed by hand from a kickoff, and every
> behavioural test would pass just as happily against a typo. A `skipIf`-gated
> suite re-parses `reference/extracted/bindata/108_1t4635s0.bin` and compares node
> for node: **19/19 byte-identical.** Planting one digit transposition (torso
> `y −68 → −86`) turns it red. The same suite **confirms the aliasing rule from
> DATA**: the source frame omits slots 8 and 17 and only those.
>
> ⭐ **The node list is stored in the XML's DOCUMENT order on purpose** — z-order
> is CREATION order, and the AS3 pushes nodes in *reverse* document order, so
> "iterate the XML" and "creation order" are different sequences (§2 diagnosis
> (d)). Storing document order makes a node-list-order composer provably wrong.
>
> ⚠️ **INFERRED, and the only inferred thing in `ogPose.ts`:** the order WITHIN a
> two-part slot (calf before foottop, head before hair). Veto = a frame showing
> hair behind the head.
> ⚠️ **NOTHING IS RENDERED YET.** A4.3 is a pure function. A green A4.3 says the
> WIRING is right, not that it looks right.
>
> ### ✅ A4.4 DONE — **THE WHOLE FIGHTER IS ON SCREEN.** `?art=idle` · **742 green**
> 21 parts · 90 draw ops · at the recorded transforms. **First composed frame of
> imported OG art in this repo.** 6 chaos plants, all RED then reverted.
>
> ⚠️ **A STEP THE KICKOFF DOES NOT MENTION: `planShape` CANNOT ROTATE.** "Reuse
> `drawPlan`" covers the drawing, not the transform. New `src/core/planPose.ts`
> rotates each part about its own joint pivot — **rotate → offset → scale →
> anchor** — with all three ways of getting it wrong pinned as negatives.
>
> **GATE A4-A ✅** — exactly the 4 predicted hole instances (2646 ×2 · 2648 ×1
> drawn twice at slots 6 and 10), `Earcut.deviation` = 4.9e-15 · 1.1e-15 ·
> 1.7e-15 · 8.8e-15. ⚠️ **Read honestly: ~1e-15, not literal 0** — on stage
> coordinates of magnitude ~500 that is zero to double precision.
> **GATE A4-C ✅** · **GATE A4-F ✅** — **128.164** vs §P9's kasa-less **131.8**,
> **2.8 % low**, inside ±5 %. Derived by the suite, then confirmed on canvas:
> ```
> plan   52.661 x 128.164      canvas  span 52x127  covered 53x128  clipped=false
> deltaCovered (+0.34, -0.16)  — both inside ±1, dpr 1
> ```
>
> ## ⛔ GATE A4-D IS ESCALATED — IT INHERITS THE FLAW §P8 REMOVED FROM THE IoU
> | measure | ours | target | ratio | |
> |---|---:|---:|---:|---|
> | torso length (neck→pelvis) | 60.67 | 59.9 | **1.013** | ✅ |
> | total height (A4-F) | 128.16 | 131.8 | **0.972** | ✅ |
> | head Ø | 18.37 | 28.4 | 0.647 | ❌ |
> | shoulder width | 34.43 | 42.7 | 0.806 | ❌ |
> | mid-torso width | 25.84 | 36.3 | 0.712 | ❌ |
> | pelvis width | 27.09 | 37.7 | 0.719 | ❌ |
>
> **Every HEIGHT passes. Every WIDTH misses (0.65–0.81).** None of §2's four
> permitted diagnoses explains it and each was CHECKED, not assumed — (a) the
> alias is applied, (b) 21 parts drawn, (c) rotation/pivot pinned, (d) z-order
> confirmed by eye. §2 then says STOP AND ESCALATE, so **no tolerance was moved.**
>
> **The diagnosis, offered as a FIFTH cause:** §P8 killed the IoU because the only
> OG images are frames of an **equipped** fighter. **§P9's proportions were
> measured from those same frames.** Clothing adds WIDTH and barely changes
> skeletal HEIGHT — exactly the split observed. The misses are not a common factor
> (0.65/0.71/0.72/0.81), so it is not a scale error, and A4-F proves the overall
> scale right to 2.8 %.
> ⇒ **A4-D and A4-E are not gradeable against a bald, unarmed doll. OWNER RULING
> NEEDED.** Honest replacement if wanted: grade the two equipment-independent
> measures that already pass (height, neck→pelvis torso), and note that §P9's five
> proportions become gradeable only if equipment art is ever recovered.
>
> ⭐ **§6 Risk 2's debug pass was RUN, not assumed** — `?art=idle&debug=1` paints
> all 21 parts distinctly. Checked by eye once: every part placed, far limbs
> behind, near limbs in front, crotch placed (not stranded), nothing missing.
>
> **Regression:** in-browser fidelity **41/41 probes + 14/14 scans = 55/55**,
> `pass: true`, 0 failures · **0 console errors** on `?art=idle` ·
> `duel-baseline` green AND unedited · ratchet **not widened** (both new `game/`
> files baselined as `{}` — zero numeric literals each).
>
> ### ✅ A4.5 DONE — the regression surface, re-proven on the final state
> ```
> Test Files  44 passed (44)     tsc x2 -> 0    eslint -> 0    build ok 446ms
>      Tests  742 passed (742)
> bare clone, no reference/:  731 passed | 11 skipped, exit 0   <- RUN, not assumed
> fidelity:  41/41 probes + 14/14 scans = 55/55, pass: true, 0 failures
> 0 console errors on ?art=idle · duel-baseline empty diff vs a9592d7
> ```
> ⭐ **The clean-clone run is real.** `git clone --local` to a scratchpad (which
> excludes gitignored `reference/`), `node_modules` symlinked, full suite run:
> exit 0, 11 skipped, **no collection failure**. This repo broke exactly that way
> once (639 → 595 in a fresh checkout, SESSION16 finding 4), so it is checked by
> running it, not by grepping for `skipIf`.
>
> ---
>
> ## ▶ THE KICKOFF — **`docs/sessions/SESSION18_KICKOFF.md`**
> **COMPOSE THE WHOLE FIGHTER, AT ITS RECORDED TRANSFORMS.** Self-contained, the
> only kickoff to plan from, **no open prerequisites.**
>
> ⭐ **The idle pose is IN the kickoff, verbatim** — all 19 node transforms
> extracted from the payload's own bindata, with the slot→shape map for the 14
> shapes the fighter needs.
> ⛔ **IT SUPERSEDES `SESSION15_KICKOFF.md` §4 A4's grading bar.** That bar asks
> for **≥ 90 % silhouette IoU**, and §P8 shows **that target does not exist**:
> FFDec cannot render a pose the AS3 composes at runtime, and the only OG images
> are video frames of an *equipped* fighter — so an IoU would grade our
> deliberately bald, unarmed doll against a kasa and a sword. It is replaced by a
> proportion gate against values measured off the original's own frames and
> already converted to stage px (`reference/combat_idle_measurements.md`).
> ⭐ **Holes are scoped exactly:** only `2646` (torso, 2) and `2648` (thigh, 1,
> drawn twice) need Earcut — 4 hole instances — and `Earcut.deviation()` gives a
> numeric 0-means-correct check.
> ⚠️ **NEW LIMIT FOUND WHILE WRITING IT:** `2662` is the ONLY one of the 16
> shapes with a stroke before a fill, and **it is not in the fighter** — so
> **A4's pixels cannot detect the paint-order defect either.** The synthetic
> fixtures in `tests/artPlan.test.ts` are the only defence in the repo.
>
> ---
>
> ## ▶ EARLIER SESSIONS — **archived, not deleted**
> SESSION 17 and everything before it moved to **`docs/sessions/-SESSION-LOG.md`**
> on 2026-07-27, verbatim. This file was 1,392 lines and cost ~23k tokens to read
> before any work could start; with `docs/DIVERGENCES.md` that was ~55k tokens of
> orientation per session. **Nothing was summarised away** — the archive holds the
> full text, and `docs/DIVERGENCES.md` remains the permanent decision record.
> **This file now holds only the NEXT session and the one just finished.**

> ⚠️ Keep it that way: when a session closes, move the previous one down to the
> log in the same commit. A handoff nobody can afford to read is not a handoff.

---

> **Fresh session and Kheshav said only "continue"?** Read this file top to
> bottom, then `docs/sessions/SESSION4_KICKOFF.md` (standing mandates), then
> `git log --oneline -10`. Trust those three over any older doc.
> Fidelity ledgers: `docs/TELLS_CHECKLIST.md` · `docs/CALIBRATION.md` ·
> `docs/DIVERGENCES.md` (adopted from iaido-duel mining, 2026-07-12).
> Navigable digest of ALL research: `docs/research/SHSD_MASTER_REFERENCE.md`
> (adopted 2026-07-17 — its header pins precedence: ledgers/config win).
> Orientation map for a FRESH session/model: `docs/BUILD_PLAN.md`
> (adopted 2026-07-17 — snapshot, this file wins on state; its §2
> model-fallback advice is NOT policy).
> **Fidelity GATE (2026-07-16): `docs/research/fidelity/FIDELITY_GATE.md`**
> — measured OG assertions vs live canvas: `npm run dev` → console →
> `await __fidelity.run()` → must stay **55/55** PASS (v2 gate — 41 points
> + 14 edge scans; v1 was 17/17). HUD changes re-run it.

## Awaiting human/browser verification
- Nothing queued. (The Stage-3 browser gate item was CLOSED 2026-07-13 —
  evidence in the gate table below.)

## Historical record — moved out on 2026-07-27

The **Current focus**, **State**, **Next concrete step** and **Stage-2 milestone
history** blocks were moved VERBATIM to `docs/sessions/-SESSION-LOG.md`. All four
were past-tense records of closed work (the source dive, Stage 2/3 milestones, the
SESSION 11 study pass) already held permanently in `docs/DIVERGENCES.md`.

**Nothing live was moved.** The sections below — open decisions, what not to break,
stage landmines, backlog — are still current and stay here.

## Open decisions awaiting Kheshav (each with proposed default)
1. **CRIT_MULT 1.3** (was spec 3) — default keep; Stage 2 "crit 3×" gate items
   read "crit ×CRIT_MULT". Veto = revert combat.ts + config-values.test.ts.
2. **MAX_DAN_RANK 10** (Stage 3) — default 10. LANDED M1 as the rebirth
   ceiling (`progression.ts`); still owner-vetoable → revert to 5 = edit
   economy.ts + config-values.test.ts + the DIVERGENCES entry.
3. **Rebirth = elemental +10, stacking** (Stage 3) — default elemental.
   LANDED M1 (field renamed `elementalPointsPerRebirth`; flat +10, NOT the
   research 10th-rebirth +20 nuance). Veto = restore attack semantics / add
   `tenthElemental` (see DIVERGENCES).
4. ~~ESLint~~ DONE (Stage 1). Veto = delete eslint.config.mjs, empty LINT_CMD.
5. **new-project.sh invalid JSON** — installer fix still outside this repo.
6. **Phaser 4 exists** — stay pinned 3.90.0 permanently (default).
7. **Branch `master`** — default keep.
8. **Dev-only `window.__game` seam** (main.ts, DEV-guarded, stripped from prod)
   — default keep for automated verification. Veto = delete the if-block.
9. **Gesture thresholds INFERRED** (`GESTURE_DIAG_DEG=45`,
   `LAUNCH_FLICK_MAX_LEN=90`; length proxies flick speed — no per-point
   timestamps). Default: keep, revisit at Stage 2 feel pass.

## What not to break
- Root `CLAUDE.md` invariants: RECREATE-NEVER-RIP (drawings/dialogue always
  original; palette now near-OG per owner veto 2026-07-12) · core/
  zero-literals · dependency direction · render-only scenes · binary stage
  gates. Folder rules: `src/{core,config,game}/CLAUDE.md`.
- `tests/fixtures/scan-probe/` is load-bearing (scanner regression fixtures).
- The game-import guard + purity gate are chaos-proven — keep them fail-closed.

## Stage landmines from research (apply at the noted stage)
- **Stage 2**: `HEAVY_DEF_PENALTY` (defense ×0.8) vs `damageTakenMult 1.25` —
  apply ONE, never both. Stance is HARD-LOCKED in combat in v0.717 PvE
  (SYNTHESIS §6.1) — implement out-of-combat switch as CONTRACT + Focus-gated
  in-combat variant as INFERRED. Spawn invuln has a confirmed blink indicator.
  `critical.ts`: two meters (Focus = stance switch, Critical = crits). PvE
  trash resolves 3–10 s — DUEL_TARGET_SECONDS {20,60} is a boss/PvP number.
  Combo counter resets to 1 (not 0) per kill; breaks on damage taken/chain gap.
  NaN-guard Sim.advance inputs (audit refuted Stage-1 scope, binds Stage 2).
- **Stage 4/5**: four joinable Great Clans (+ Aoi Hoiru, Ki Sensu); Shira
  Tancho story-only. War Room: 75 deploy, 500 per-structure donation,
  flag 120%. HAS_CASH_PURCHASE=false is a deliberate deviation.

## Spark / backlog (noticed, not acted on — why later)
- game/ config-purity ratchet baseline (per-file value multiset) — Stage 2
  item 15; DuelScene literals are tolerated until then.
- DuelScene fixed-step accumulator DONE (Stage-1 browser bug); Sim.advance
  (deltaMs, MAX_FRAME_MS=250 in config) replaces the inline 250 at Stage 2.
- Phaser bundle 1.2 MB → code-split at Stage 6.
- `@types/node` 26 vs Node 25 — harmless; align when LTS catches up.
- Vite dev server may still be running in background task b1jaqmhl1.
