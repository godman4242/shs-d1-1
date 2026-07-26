# RESUME HERE

> ## ▶ SESSION 16 — **R1 + R2 CLOSED. START AT §4 A3 (render it in the browser).**
> Kickoff: **`docs/sessions/SESSION16_KICKOFF.md`** — its §4 R1/R2 are done; **A3,
> A3.5 and A3.6 are the remaining work** and are unchanged.
>
> ### ✅ R1 CLOSED — the adversarial review found things, and the seeds were not the story
> **28 agents · 6 dimensions · 18 raw confirmations → 7 deduped findings · 3
> refuted · 75 candidate claims dropped by the finders before filing · 6 of the
> 10 seeded suspects REFUTED with executed evidence.** R-A was enforced by the
> machinery: a finding without a run reproduction could not be filed.
> **4 of the 7 are NEW**, and the two most severe are both new — so §6 Risk 1's
> "a review that returns only the ten seeds has failed" did not happen.
> ⭐ **The two big ones were verified against ground truth OUTSIDE this repo** —
> the SWF's own `DefineShape4` bitstream and FFDec's own PNG rasteriser.
>
> ### ✅ R2 CLOSED — all 8 findings fixed red-first, 24 plants watched
> **Suite 664/664 (40 files) · tsc ×2 exit 0 · eslint exit 0 · `npm run build`
> clean · without `reference/`: 656 passed | 8 skipped, exit 0.**
> - ⭐ **PAINT ORDER WAS BEING DISCARDED — the headline.** A SWF shape is a
>   sequence of style groups, and a `StateNewStyles` record can put a stroke
>   UNDERNEATH a fill. **Shape 2662 (one of the 16) is `S F F F F F F F F S`** — a
>   2.5 px black outline first, then eight face fills. Against FFDec's own 16×
>   render, source order agreed on **44513/44513** opaque pixels and
>   fills-then-strokes on **32952**: 26.2 % of the shape's ink turned black,
>   swallowing the nose, lips and jaw. **`fills[]`+`strokes[]` → ONE ordered
>   `paints[]`** (`kind: 'fill' | 'stroke'`), chosen over the smaller `z`-index
>   fix because with a `z` field a renderer that loops fills-then-strokes still
>   compiles and silently reproduces the bug. **⚠️ A3 MUST WALK `paints` IN
>   ORDER.** Nothing committed was wrong — 2664 is `F S S`, where both orders
>   coincide — it would have fired on the other 15.
> - ⭐ **ALPHA was silently flattened to opaque; now THROWS.** 130 corpus shapes
>   carry `fill-opacity`, never read, no field to hold it. None of the 16 does.
> - ⭐ **THE CONVERTER'S TESTS DID NOT EXIST OUTSIDE THIS LAPTOP.** A gitignored
>   `reference/` read in a describe BODY threw at COLLECTION: **639 → 595**, all
>   44 converter tests gone, `npm test` exit 1, and the 36 fixture tests died as
>   collateral. Committed CI runs `npm test` on a bare checkout. Now split —
>   committed artifact everywhere, re-derivation `skipIf`-gated and lazy.
> - **The hole classifier** read abutting rings as nested (order-dependently);
>   24 rings across 19 shapes were wrong, up to 345 px². **The 16 are clean**, so
>   `shape2664.ts` is byte-identical after the fix.
> - **The D7 provenance gate never read the DATA** — a recoloured, mirrored or
>   id-forged artifact passed everything. The header is now a checksum (identity
>   triple, counts, and a new `palette` line), plus a byte-for-byte re-derivation
>   test that required extracting the emitter to `scripts/art/emit.ts`.
> - **`WELD` was pinned by no test** in its whole plausible range; **the bounds
>   test asserted the opposite of its name** (all four assertions one-sided, so a
>   0.64 px speck passed — including the "subtler non-20×" error §3.4 claims is
>   pinned).
> - ⚠️ **An 8th finding came from re-planting A2's guards, not from the review:
>   the `<g>` pure-translation throw had NO TEST** — the guard the entire
>   shape-local pivot claim rests on. Two guards *I added this session* were in
>   the same state. **Fourth session running that a plant found a dead or missing
>   guard rather than a bug.**
> - ⚠️ **KNOWN LIMIT, deliberately not fixed:** ~5 ring pairs in the wider corpus
>   genuinely OVERLAP, and a per-ring `hole` boolean cannot represent that under
>   any epsilon. None is in the 16.
> - ⚠️ **THE REVIEW'S OWN CAVEAT, which bounds every pixel number above:** no
>   renderer exists yet, so four of the five "wrong pixels" figures came from
>   rasterisers the agents wrote themselves. Only paint order was scored against
>   an external render. **A3 is the first observed frame.**
> - Full record incl. all 24 plants and every refutation:
>   `docs/DIVERGENCES.md` "SESSION 16 — R1/R2".
>
> ### ⬜ A3 IS NEXT, and two things changed under it
> 1. **`ArtShape` is now `{ id, paints }`** — walk `paints` in array order,
>    `p.kind === 'fill'` → `fillPoints` per non-hole ring, `'stroke'` →
>    `lineStyle(worldToStageLength(p.width))` + `strokePoints`. Do NOT draw all
>    fills then all strokes.
> 2. Everything else in the kickoff stands: **17.16 × 20.34 stage px ±1**,
>    byte-exact `0xffcc99`/`0x000000`, behind `?art=og`, fixed labelled position,
>    stroke widths through `worldToStageLength`, then A3.5 (Phaser triangulator)
>    and A3.6 (gate 55/55 + `duel-baseline` green AND unedited).
>
> ---
>
> ## ▶ THE KICKOFF — **`docs/sessions/SESSION16_KICKOFF.md`**
> **HARDEN THE CONVERTER, THEN PUT IT ON SCREEN.** Self-contained, the only
> kickoff to plan from. Owner decision 2026-07-26: run an **adversarial review of
> A2 before rendering**, because the author of a parser is the worst reviewer of
> it — and A2 proved that twice in one session (two defects, neither caught by
> 639 green tests).
>
> **Order: R (review) → R2 (fix red-first) → A3 (render) → A3.5 → A3.6.**
> A3 is also the review's own verification: if the hardened converter still draws
> the head at the right size, the fixes did not break it.
>
> **There is no research step.** Every prerequisite is a command already run:
> - ⭐ **A3's target size is pre-computed:** head 2664 is 14.30 × 16.95 world px
>   → **17.16 × 20.34 STAGE px** (transform `stage = (32 + 1.2·worldX, 1.2·worldY)`,
>   the OG's own resize routine, in `src/core/viewport.ts`, pinned by
>   `tests/viewport.test.ts`). A 20× twips error would draw it **343 × 407** on a
>   1024 × 576 canvas. ⚠️ The QUIETER failure is drawing world px straight into
>   stage space — 17 % too small, looks merely "a bit off".
> - ⭐ **Free cross-check:** the composed OG `idle` fighter is 107.4 world px →
>   **128.9 stage px**, and our procedural samurai — proportions measured from
>   study frames in earlier sessions — is ≈ **118 stage px**. Two independent
>   derivations within ~8 %. Evidence that the fighter clip is scale ≈ 1, **not
>   proof**; the residual is A4's to confirm.
> - ⭐ **Hole census over all 16 shapes: 86 rings, 15 HOLES** (in 2641, 2646,
>   2648, 2662). **A4 must render holes; A3 need not — shape 2664 has 0.**
> - ⚠️ **ONE open prerequisite, deliberately:** whether Phaser 3.90 exposes a
>   polygon triangulator was **NOT verified** (`node_modules` reads are blocked
>   here). It blocks nothing in A3, and **A3.5 is a ten-second console check
>   while the browser is already open.** Fallback needing no Phaser feature:
>   triangulate at build time in the converter.
>
> **Ten seeded suspects are published in its §2** so the review starts calibrated
> — including two the author found and deliberately did NOT pre-fix
> (`fill-rule` never checked; a leading `+` tokenising silently). **A review that
> returns only those ten has failed.**
>
> ⛔ **`SESSION15_KICKOFF.md` STAYS LIVE for A4 + A5.**
> ⛔ **`SESSION14_KICKOFF.md` STAYS LIVE for A5 + A6.** Neither is closed here.
>
> ---
>
> ## ▶ SESSION 15 — **A1 + A2 CLOSED. A3 is now SESSION16's §4.**
> Kickoff: **`docs/sessions/SESSION15_KICKOFF.md`** (the art is an IMPORT problem).
>
> ### ✅ A2 CLOSED — the converter works, and the first OG art is committed
> **Suite 639/639 · tsc ×2 exit 0 · eslint exit 0 · 17 chaos plants all watched RED.**
> New: `scripts/art/svgShape.ts` (pure converter) · `scripts/art/generate.ts`
> (emitter) · `src/game/art/types.ts` · **`src/game/art/generated/shape2664.ts`
> — the OG samurai's head, compiled into the build.**
> - **Red-first**, on the three fixtures the kickoff names (triangle, curve,
>   hole) before the converter saw any real art. 41 tests in
>   `tests/svgShape.test.ts`.
> - **The `<g>` translate is IGNORED on purpose** — FFDec's `d` data is already
>   shape-local with the joint pivot at (0,0). Baking it in breaks every A4
>   animation node. The converter THROWS if that `<g>` is ever not a pure
>   translation. Verified 16/16 against `payload.xml`'s `<shapeBounds>`.
> - **Strokes convert too**, and `ffdec:original-stroke-width` beats FFDec's
>   legibility-bumped `stroke-width`. ⭐ Independently confirmed: payload.xml's
>   LINESTYLE2 widths for 2664 are **30 and 10 twips = 1.5 px and 0.5 px**,
>   exactly what the converter emits.
> - **Gate 5 proven:** generated fill RGB diffed against `payload.xml` →
>   byte-exact. Gate 3: no `fetch`/`import()`/`require` in the art path, pinned
>   by a test. Gate 4: `src/` holds zero image files, pinned by a test.
> - **D7 carve-out landed narrow:** only `src/game/art/generated/` is exempt
>   from the numeric ratchet (the hand-written `types.ts` beside it stays
>   ratcheted), and it is PAID FOR by four new guards — provenance header,
>   filename↔characterId agreement, an `APPROXIMATED FILLS` declaration, and a
>   no-runtime-loading scan. Baseline refresh diff was one line.
> - ⚠️ **A real bug and a vacuous guard, both worth carrying forward.** The
>   hole classifier first probed from a point INSIDE each ring, which made the
>   outer ring of a square-with-a-hole classify itself as a hole; nesting must be
>   probed from the BOUNDARY. And plant 5 came back green because the degenerate
>   fixture was rejected by a vertex-count check before the zero-area filter ever
>   ran — **third session running that a plant found a dead guard, not a bug.**
> - ⚠️ **A BUG THE TESTS COULD NOT SEE.** With the suite green, an
>   original-vs-converted overlay showed a **notch in the crown of the head**:
>   FFDec writes outlines as OPEN paths whose last point equals the first with
>   no `Z`, and welding strips that vertex. Fixed (closed if `Z` *or* it returns
>   to its start; force-closing everything instead grows a phantom edge across
>   the ear crease — both halves pinned). **Numeric tests cannot see a hole in a
>   line — render at every step.**
> - **A fail-open closed** while writing the A3 kickoff: the path matcher only
>   sees self-closing `<path/>`, so a `<path></path>` file would have returned a
>   silently EMPTY shape. Now throws if declared paths outnumber parseable ones,
>   or if a shape yields no geometry. Non-false-positive confirmed by converting
>   **all 16** fighter shapes (only 2664 committed — D2 keeps A2 to one target).
> - **Regenerating is byte-identical** (same md5 twice), so the committed art is
>   reproducible. `npx vite-node scripts/art/generate.ts -- <id>`.
> - Full record: `docs/DIVERGENCES.md` "SESSION 15 — A2".
>
> **A3 has moved into `SESSION16_KICKOFF.md`**, behind an adversarial review of
> the converter (owner decision 2026-07-26). Its scale gate is pre-computed
> there: **17.16 × 20.34 stage px ±1**.
>
> ### ✅ A1 CLOSED — the fighter is CODE-ASSEMBLED, and all of its art is recoverable
> **Deliverable: `docs/research/fidelity/FIGHTER_ART_IDS.md`** — every shape ID
> cited to the decompiled line that names it (D5 honoured; nothing eyeballed).
> - **`§1t75s0§` (characterId 2640) IS THE FIGHTER**: 23 slot containers, parts
>   instantiated by name via `getDefinitionByName(partType + art)`. P5's
>   suspicion was right — and it is the *good* case.
>   (`§1t74s0§` is only the head-and-shoulders **bust** doll. Shape **1813 is
>   the TITLE-SCREEN illustration**, not the fighter — its sibling instance is
>   literally named `titlelabel`.)
> - **16 distinct leaf shapes**, one per body part:
>   `2641 2644 2646 2648 2650 2653 2655 2658 2662 2664 2667 2670 2672 2674 2676 2678`
> - ⭐ **36 fill styles, 36 solid, 0 gradient, 0 bitmap = 100 % FLAT SOLID.**
>   ⇒ kickoff **D3 (gradient approximation) and D4 (bitmap fills) are MOOT for
>   this target**; §2 bar B (byte-exact colour) needs no approximation at all.
> - ⭐ **THE POSES ARE DATA.** New export (27 `DefineBinaryData`, exit 0, 3.5 s):
>   `FFDEC_MEMORY=12g … -export binaryData reference/extracted/bindata …`
>   → **487 `<anim>` / 482 unique** (5 dupes collapse — the loader keys a dict by
>   name, which reconciles the old 482 index exactly). Each frame is
>   `slot index + x + y + rotation`, **plain pixels and degrees**
>   (`§1t1360s0§.setPosition`). `idle`, `lightstanceidle`, `balancedstanceidle`,
>   `heavystanceidle`, `walk`, the slash chains and `death` are all present.
> - ⚠️ **TWO SLOTS ARE ALIASED IN CODE** (`§1t59s0§.setPosition`) — **crotch(8)
>   follows the pelvic node(14), hat(17) follows the head node(16)**, which is
>   why no animation ever carries a node for them. Found by composing without
>   it and seeing the crotch stranded at the origin. **A4 must apply both.**
>   Same class also gives `setVisible` (unlisted slots hidden) and
>   `reorderLayers` (z = creation order unless the frame has `r="1"`).
> - ✅ **VERIFIED BY RENDER, not just by citation:** composing the 16 shapes at
>   the recorded node transforms produced six correct, correctly-jointed poses
>   first try — `idle · balanced_stance · light_stance · heavy_stance ·
>   balancedstanceidle · walk`. Scratchpad only; **no committed source** (the
>   converter is A2).
> - ⚠️ **THE HONEST LIMIT — EQUIPMENT ART DIED WITH THE CDN.**
>   `§1t1523s0§.§1t9494s0§` defaults **true**, and then `§1t6238s0§` returns
>   `§1t1522s0§` — a `Loader`/`URLRequest` streamer. The 21 embedded classes are
>   the *offline fallback*. No part-art SWFs in `reference/preservation/`, and
>   **the 15 MB Android payload carries the same 21 defaults and no more**, so
>   the trick that recovered the 495-row enemy table does NOT work here.
>   ⇒ We have the **base body** — bare torso, bare head, **no hat, no armour,
>   no katana** (`weapon13000` is the empty unarmed placeholder; the only
>   embedded weapon is `weapon13002`, the wooden branch). The straw hat in the
>   game's own title is not in the payload.
>   **Decide-and-flag:** grade §2's ≥90 % IoU against the **base body**, and pick
>   study frames of an unequipped fighter. *Veto:* produce an archived part-art
>   SWF and this reopens.
> - **For A2:** convert 16 shapes, not 1,822 · path command set is exactly
>   `M L Q Z` (quadratic only, contours closed) · **shape-local origin = the
>   joint pivot, at `(-Xmin/20, -Ymin/20)` px inside each FFDec SVG** (verified
>   16/16 against `payload.xml`) · twips→px ÷20 is already applied in the
>   `.svg` files but NOT in `payload.xml` — do not divide twice.
>
> ---
>
> ## ▶ PREVIOUS ENTRY (2026-07-26)
> **`docs/sessions/SESSION14_KICKOFF.md` — MANY ENEMIES, ONE HIT.**
> Self-contained, the ONLY kickoff to plan from. **Twelve decisions and twelve
> prerequisites, all already resolved from `SOURCE_CONSTANTS.md` §3.9 and
> `COMBAT_MEASUREMENTS.md` e-2/e-3/e-4. There is NO research step.**
>
> ## ▶ **A0 → A4 ARE DONE. START AT §4 A5.**
>
> ▶ **See the crowd fight:** `npm run dev` → `http://localhost:5173/?scene=encounter`
> (drag across the mobs to slash; `R` restarts). The duel is still the default route.
>
> ## ⭐ SESSION 15 IS WRITTEN AND READY: **`docs/sessions/SESSION15_KICKOFF.md`**
> **THE ART IS AN IMPORT PROBLEM.** Owner decision 2026-07-26: art beats audio,
> and the extracted OG vector art *is* the art he wants in the game.
> **There is no research step** — every prerequisite is a command that has
> already been run, quoted with its output:
> - **1,822 vector shapes** exported in 8.0 s.
> - ⭐ **THE ANIMATION COMES OUT TOO** (this was the open risk, now closed):
>   `-swf2xml` → **827 sprite timelines · 7,196 placement matrices · 4,347
>   frame markers**, and only **20 bitmaps in the whole game**. Animation is
>   vector shapes at per-frame transforms — no raster step. *(Needs
>   `FFDEC_MEMORY=12g`; the default heap OOMs.)*
> - **93.1 % of all fills are FLAT SOLID COLOUR** — which `Graphics.fillPoints`
>   draws natively, so 93 % needs no new rendering capability.
> - ⚠️ `-export sprite` works but **must not be used** — it rasterises to 3,013
>   PNGs, violating the no-image-files invariant.
> - ⚠️ **`reference/` is gitignored ⇒ a runtime loader is IMPOSSIBLE.** Converted
>   paths must be emitted as **committed TypeScript**.
> - ⚠️ Still open, flagged: the fighter may be assembled in ActionScript rather
>   than authored as a timeline sprite. A1 settles it by reading the 1,079
>   decompiled `.as` files, and "it's built in code, here's the class" is
>   declared a SUCCESSFUL outcome in advance.
>
> **Scope is deliberately tiny: ONE pose, converted end to end and graded**
> (≥90 % silhouette IoU · byte-exact colours · fidelity gate still 55/55).
>
> ## ⚠️ BUT READ THIS FIRST — the art question is now answered
> **`docs/research/fidelity/ART_EXTRACTION.md` (2026-07-26).** The OG's own
> **vector** art is recoverable: FFDec exported **1,822 SVG shapes in 8 seconds**
> from the already-decrypted `shs3_payload_decoded.swf` — town art, props, and a
> full character figure, confirmed by eye. **The source dive exported
> ActionScript ONLY**, so nobody had looked. Flash art is vector and our renderer
> is vector ⇒ **1:1 art is an IMPORT problem, not an approximation problem.**
> Extracted art is gitignored; `src/` still has zero image files.
> **Not yet proven: sprite/timeline export (character ANIMATION probably lives
> there), ID→entity mapping, and any SVG→`Graphics` converter.**
> ⇒ This is a strong candidate to become **SESSION 15 instead of audio** —
> owner's call.
>
> Read the kickoff's **§3.5 first** — it is a symbol-level inventory of every
> place the codebase assumes one enemy, grouped by what the fix is, with
> per-file touchpoint counts and an explicit "already the right shape, do not
> touch" list. It exists so a fresh session does not spend an hour
> rediscovering it.
>
> **Why this next:** the duel is solved; the game is mostly not a duel. `Sim` is
> still hard-wired to exactly two fighters, while the original's moment-to-moment
> play is a crowd of mobs that **die in one hit** — which our own study pass
> calls *"the single largest gap between the OG and our build"*. Phase B did not
> touch it, so it is now unambiguously the largest one left.
>
> ⛔ **Its binding invariant: THE DUEL MUST NOT MOVE.** The N-actor refactor is a
> pure generalisation, and at N=1 it must reproduce SESSION13's numbers exactly
> (median **10.575 s**, 24 distinct, fingerprints unchanged, gate 55/55). A0
> records those numbers BEFORE the refactor can perturb them — because
> `determinism.test.ts` only proves runs agree with EACH OTHER and pins no
> absolute value, so it would stay green through a silent behaviour change.
>
> **SESSION 15 is already named in its §7:** the game is **completely silent**
> (`src/` has no `AudioContext`, no oscillator, nothing), and
> `REBUILD_READINESS` calls audio *"the deepest gap, and closable without the
> SWF"*. It needs a study pass first, so it deliberately is NOT bolted onto a
> code session.
>
> **`SESSION13_KICKOFF.md` is CLOSED** — all 17 gate items green, commit `335e615`.
>
> ### SESSION 14 PROGRESS
> | Step | State |
> |---|---|
> | **A0** record the duel baseline BEFORE refactoring | ✅ **DONE** — `tests/duel-baseline.test.ts` |
> | **A1** `Sim` → N-actor, N=1 byte-identical | ✅ **DONE** — see below |
> | **A2** mob spawns · one-hit kills · corpses | ✅ **DONE** — see below |
> | **A3** one stroke, many enemies | ✅ **DONE** — see below |
> | **A4** `EncounterScene` + damage popups | ✅ **DONE** — see below |
> | A5 mob AI (1.0 s cadence, hitbox blocking) | ⬜ **next** |
> | A6 observe turn-taking · the `[3,10] s` band | ⬜ |
>
> ### ✅ A1 CLOSED — and the duel did not move
>
> **Suite 555/555 · tsc ×2 exit 0 · eslint exit 0 · in-browser fidelity gate
> `PASS — 41 points + 14 scans` (55/55) · zero console errors.**
>
> `Sim` is now **a player plus an array of enemies**; `FighterSide` is gone,
> replaced by `ActorId = 'player' | \`enemy${number}\`` (spawn index = identity =
> iteration order). Constructor is `new Sim(rng, SimSetup, autoController)`,
> where each enemy arrives as an `EnemySlot { spawn, controller }` — bundled so
> every enemy provably gets its OWN controller instance.
> - ⛔ **The binding invariant held.** `tests/duel-baseline.test.ts` is green and
>   **UNEDITED**: 24 good-play frames, 24 no-play frames, the seed-7 checksum
>   and the **10.575 s** median byte-identical to `335e615`.
> - **The compiler walked the whole §3.5 inventory**, exactly as promised: 13
>   type errors, every one a call site on the list, zero surprises. AUTO SLASH
>   (the nominated canary) needed no change beyond its constructor call.
> - **8 chaos plants, all watched RED.** The one that matters: a single `rng()`
>   draw per enemy per tick turned **`duel-baseline.test.ts` itself RED** — §3
>   risk 2's crowd-size stream shift, caught by the seed-7 checksum.
> - **Fight-end rule generalised** (§3.5 F): ends when the player dies **or every
>   enemy is dead**, not on the first death. Invisible at N=1; at N=8 the old
>   rule would end an encounter on the first kill with every other test passing.
> - ⚠️ **Flag for A2/A6:** the Focus kill bonus now pays on EVERY kill, credited
>   to the actual killer. Identical at N=1; an 8-mob encounter will pay it eight
>   times. **Measure in A6 before tuning** — that is a model prediction, not a knob.
> - **Left undone on purpose:** a slash still resolves against the NEAREST living
>   enemy only. D5 ("one stroke, every enemy it crosses") is **A3** and must be
>   red-first there; the reach budget is already spent exactly once in
>   `truncateTo`, which is what makes that loop safe.
> - Full record: `docs/DIVERGENCES.md` "SESSION 14 — A1".
>
> ### ✅ A2 CLOSED — trash mobs die in ONE hit
>
> **Suite 570/570 · tsc ×2 exit 0 · eslint exit 0.** The largest measured gap
> between the OG and our build (`COMBAT_MEASUREMENTS.md` e-2) is closed.
> - New: `config/mobs.ts` · `core/mobModel.ts` · `core/encounterSetup.ts`.
> - **The mob's 1 damage is DERIVED, not authored.** The source's
>   `if (level <= 8) { minDamage = 1; defense = 1; }` override was extracted to
>   ONE shared site (`lowLevelOverride`), used by the duellist derivation (where
>   it stays dormant at level 9) and by mobs (where it is the whole point).
>   We implemented that rule blind in Phase B; the study pass independently
>   measured mobs dealing exactly 1. **Two facts, established separately, agree.**
> - ⚠️ **Mobs never touch `deriveEnemy`** (P1) — a mob's HP is an authored 1, not
>   the duellist's `effPlayerDmg × K` = 50. Pinned by a test.
> - **8 mobs is MEASURED** (P8, filmed). ⚠️ **The spawn layout is INFERRED** and
>   labelled so — A6's `[3,10] s` band is what will judge it (§2 diagnosis (b)).
> - Corpses are Sim-owned state: 96 frames, linear fade over the last 12.
> - **HP obfuscation deliberately NOT implemented** (P10) — anti-cheat, not
>   gameplay, and it would make every HP read non-deterministic. There is a test.
> - **6 chaos plants. Five bit; the sixth came back GREEN and the TEST was at
>   fault** — it couldn't tell a per-mob controller factory from a shared one.
>   Rewritten, both re-plants bite. *A guard never watched failing isn't a guard.*
> - ⚠️ **No mob XP reward exists.** No measured number; deriving one by analogy
>   would be arithmetic dressed as evidence. Veto = add one with a source line.
> - Full record: `docs/DIVERGENCES.md` "SESSION 14 — A2".
>
> ### ✅ A3 CLOSED — one stroke fells every enemy it crosses
>
> **Suite 579/579 · tsc ×2 exit 0 · eslint exit 0 · duel-baseline green and
> UNEDITED.** `applyStroke` resolves the SAME truncated polyline against every
> living enemy, in fixed spawn order.
> - ⚠️ **The reach budget is spent ONCE, by the swing.** The guarded failure is
>   silent: re-deriving it per victim makes reach **scale with crowd size**. The
>   tests pin the NEGATIVE — who a stroke reaches must not depend on how many
>   enemies exist — across crowds of 1, 4 and 7 with the far mob at fixed range.
> - **Resolve every victim first, spend Focus once, then apply damage** — in that
>   order, because a kill pays `FOCUS_KILL_BONUS` and spending afterwards wipes it.
> - **Combo counts HITS** ⇒ an 8-mob encounter chains to 8, and the corpus's
>   filmed **11-chain** becomes reachable. Free confirmation: the combo rule and
>   the one-hit rule were established separately and this falls out of both.
> - **6 chaos plants.** Five bit; the sixth was vacuous **for a second, different
>   reason** and had to be strengthened — see the two process notes below.
>
> ### ⚠️ TWO PROCESS FACTS WORTH CARRYING FORWARD
> 1. **The duel baseline did NOT catch a real regression.** I briefly moved the
>    Focus spend after the damage, zeroing the kill bonus; `duel-baseline` stayed
>    green because **its fingerprint folds HP and position, not Focus**.
>    `tests/Sim.test.ts` caught it. The baseline is a tripwire for the duel's
>    SHAPE — it is not a proof of correctness, and the unit suite is not
>    redundant with it.
> 2. **A guard can be vacuous in more than one regime.** The "Focus spent once,
>    not per victim" test passed while the bug was live — twice, for two
>    different reasons (kill bonus swamping the spend; then `focusSpend` clamping
>    at 0 with only 24 banked against a 48 cost). It now banks >3 spends, stays
>    under `FOCUS_MAX`, and asserts exact values.
> - Full record: `docs/DIVERGENCES.md` "SESSION 14 — A3".
>
> ### ✅ A4 CLOSED — the crowd fight is on screen, with damage numbers
>
> **Suite 592/592 · tsc ×2 exit 0 · eslint exit 0 · in-browser fidelity gate
> `PASS — 41 points + 14 scans` = 55/55.** New: `game/EncounterScene.ts` ·
> `core/damagePopup.ts` · `config/popups.ts`. **`DuelScene` was NOT touched** (D3).
> - **Live browser evidence** (real mouse drags): one stroke killed **two** mobs,
>   `2 HIT COMBO`, enemy counter 8 → 6, player HP untouched, two popups reading
>   `9` in `0x990000` above their victims — red = "an ENEMY took it" (e-3).
> - ⚠️ **A crit is indistinguishable from a normal hit, BY SIGNATURE.** f-10 found
>   no crit tell in ~845 s of play, so `popupFrame` takes only an age and
>   `popupFromDamage` ignores the event's `crit` flag. Information never passed
>   in cannot leak into the render.
> - **The `game/` ratchet fired and reviewing its diff paid for itself:** it
>   surfaced that I'd invented the popup glyph size when the corpus MEASURES it
>   (29×40 @1080 → 15.5×21.3 stage). Moved to config.
> - ⚠️ **Honest placeholder:** popup digits are BLOCKS — right size, right
>   colour, not yet numerals. Real glyphs belong with the art-import session.
> - ⚠️ **DuelScene has no popups yet** — deliberately, to keep new pixels away
>   from the 55/55 gate. Queued.
> - Full record: `docs/DIVERGENCES.md` "SESSION 14 — A4".
>
> **A0 CLOSED.** The duel's exact behaviour at `335e615` is now pinned: all 24
> good-play frame counts, all 24 no-play frame counts, the seed-7 outcome
> fingerprint (checksum included), the 10.575 s median, and the derived enemy
> (hp 50 · K 10 · D 18 · xp 90). Suite **540/540**.
> - **Why it was needed:** `determinism.test.ts` only proves runs agree with
>   EACH OTHER, so it pins no absolute value and would stay green through a
>   silent retune.
> - **Red-proofed with two plants:** player damage 10→11 → **4 RED**; dash speed
>   40→41 → **1 RED** — and that one changed **no frame count at all**, so only
>   the checksum caught it. That is precisely the drift A0 exists to catch.
> - **Coverage fact found while proofing:** `MOVE_RUN_PX_S` 288→289 changes
>   NOTHING in the harness — the bot never issues move orders, it closes purely
>   by dashing. The walk/run gaits are therefore **unexercised by the 24-seed
>   harness**; they are covered by unit tests only. Worth knowing before anyone
>   trusts the harness to catch a movement regression.
>
> ### SESSION 13 PROGRESS
> | Step | State |
> |---|---|
> | **A0** world/stage split (D1) | ✅ **DONE** — see below |
> | **A0.5** stats the formulas need | ✅ **DONE** |
> | **A2** combo correction (D8) | ✅ **DONE** |
> | **A3** AUTO SLASH (D7) | ✅ **DONE** |
> | **B0–B5** the coupled core | ✅ **DONE** — see below |
>
> ### ✅ SESSION 13 IS COMPLETE. All 17 gate items green.
>
> **Suite 534/534 · tsc ×2 exit 0 · eslint exit 0 · in-browser fidelity gate
> `pass=true | probes 41/41 | scans 14/14 | TOTAL 55/55` · zero console errors.**
>
> **PHASE B CLOSED (2026-07-26)** — landed as ONE commit, as §4 requires.
> - **B0** band `[20,60]` → **`[8,25]` s**, derived once from the source model
>   BEFORE any Phase-B code existed, with its full arithmetic and the
>   stop-and-escalate rule pinned in the harness header. **It was never touched
>   again.**
> - **B1** Focus is the source's ONE meter (192 units, residual accumulator,
>   `(x−48)/144` display, starts EMPTY); `critical.ts` → `focus.ts`, the
>   standalone Critical meter and `WEAPON_WEIGHT` deleted; stance switch a flat
>   48; walk 96 / run 288 world px/s with gait+target latched at command time.
> - **B2** damage in the source's exact 6-step order; `COUNTER_BONUS` deleted
>   (the mechanic does not exist) and replaced by the stance triangle
>   ×1.2 / **×0.9** / ×1.0; body-part crit is a POSITIONED no-op.
> - **D2a** `core/mastery.ts` — ONE mastery drives BOTH reach and damage;
>   `STANCE_TABLE.reach`/`.dmgMult` gone. At mastery 10 the curves reproduce the
>   legacy 0.9/1.2/1.4 exactly, proving that table held ceilings.
> - **B3** reach is an ARC-LENGTH BUDGET (`truncateTo`), `resolveSlash` has no
>   radius/origin params, `withinReach` deleted, `RESAMPLE_SPACING` → 20; the
>   dash runs to the stroke's last point at 50/40/30 px/frame and
>   `DASH_SLASH_PX`/`DASH_MIN_STROKE_PX` are deleted.
> - **B4** enemy HP/damage DERIVED from the player (`effPlayerDmg × K`,
>   `playerMaxHP / D`), both fighters level 9, XP **90**, `level ≤ 8` override
>   implemented and dormant; `react()` + its three tier fields deleted, melee
>   gate `|dx|<50 && Δy<50`, telegraph 600/267, no attack token.
> - **B5** harness: **24/24 · 0/24 · median 10.575 s ∈ [8,25] · 24/24 distinct.**
>
> **The headline result:** the band was computed from K and the bot's cadence
> before the model was written, and the finished model landed at **10.575 s** —
> inside the paper prediction's own 9.3–10.9 s window, with no tuning.
>
> **The one diagnosis B5 forced** (kickoff §3.3 permitted diagnosis (a)): the
> harness bot drew a TARGET-CENTRED line, so it could never miss and all 24
> seeds collapsed to 15 distinct durations. Anchoring the stroke at the player
> fixed it. **The band was not moved.**
>
> **Queued, deliberately not done** (kickoff §7): portrait ring stance-colouring,
> "150 % DAMAGE" as a timed buff, body-part crit's multiplier (hook is in),
> the dash's wind-up first leg, stagger hyperarmor, elemental resists, mastery
> as a spendable skill, multi-enemy combat, the 982-item/75-skill/61-quest tables.
>
> ⚠️ **Decide-and-flag, open to veto:** `ENEMY_BASE.hp` 150 → **1**. At 150 it
> would win the source's own `max(scaledBase, …)` and quietly keep HP an INPUT,
> defeating D3's whole derivation. Veto = supply a measured level-scaled base.
>
> Full record: `docs/DIVERGENCES.md` "SESSION 13 — PHASE B".
>
> Background if wanted: `docs/research/fidelity/SOURCE_CONSTANTS.md` §3, §5, §6.
>
> **`SESSION12_KICKOFF.md` is SUPERSEDED** (history only — it predates the source
> dive and four of its rows are now known wrong). **`SOURCE_DIVE_KICKOFF.md` is
> CLOSED — do not re-run it.**
> Everything the study pass measured is in
> `docs/research/fidelity/COMBAT_MEASUREMENTS.md` — **read its §00b corrections
> first; a later pass overturned four of its own rows.**

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

## Current focus

**SOURCE DIVE — CLOSED ✅, AND IT CRACKED (2026-07-25).** The archived client
is decrypted, decompiled and mined. Ledger:
**`docs/research/fidelity/SOURCE_CONSTANTS.md`**; decisions in DIVERGENCES
("Source dive" block). **NO GAMEPLAY CODE CHANGED — deliberately.**
Suite **464/464** · tsc ×2 exit 0 · eslint 0.
- **BUILD = v0.717 — the same build our video measured.** `clientVersion = 0.717`
  renders as the exact title-screen string. The manifest's `0.706` is dead code.
  (Android payload = **0.682**, an *earlier* build despite a newer container.)
- **The protection was three layers and none of it needed the dead server:**
  RC4 with the key being the payload's **own last 8 bytes** → SWF Defender
  (key `ZvupTBlC`) → a 5-line XOR/swap. **Only the first 64 bytes were ever
  encrypted.** Proof: decoded SWF length matches the inflated body to the byte,
  on both payloads. Reproducible via three scripts in `reference/tools/`.
- **OUR VALUES CONFIRMED EXACTLY:** `CRIT_MULT = 1.3` · `HEAVY_DEF_PENALTY` as
  `defense × 0.8` defender-side-only (the Stage-2 landmine vindicated) · damage is
  a roll · damage does **not** scale with level · the stance triangle.
- **MEASUREMENT VINDICATED:** Focus fill measured 5.97 s; source bar renders
  `(current−48)/144` = **6.000 s** visible. Mobs die in one hit — `<hp>1</hp>`
  authored **and** forced by `setLevel`. **JINBEI's 132 HP falls out of the
  formula exactly** (3 × 44, the mean of the measured 42/48/42).
- **⚠️ FOUR PROJECT BELIEFS REFUTED** (details in DIVERGENCES): `COUNTER_BONUS`
  models a mechanic **that does not exist** · `STANCE_TABLE.reach 300/200/100`
  is wrong **in kind** (reach is a stat-driven arc-length budget; `200` is a
  placeholder default, and 300/200 are the SHS1/SHS2 constants — likely lineage
  contamination) · combo resets to **0 on damage**, never on a kill, and is
  purely cosmetic · in-combat stance switching costs **48 focus**, not nothing.
- **⚠️ ARCHITECTURAL:** named-enemy HP is **not authored** — it is recomputed from
  the *player's* stats at spawn so a fight lasts K hits. SESSION12 must not tune
  enemy HP as a constant.
- **BOTH "UNRESOLVABLE" ITEMS ANSWERED:** *AUTO SLASH ON* hands your fighter to the
  enemy AI routine and locks out manual input · the **495-row enemy stat table**
  was recovered from the android build (the desktop fetches it from a dead,
  never-archived server). Also recovered: 61 quests, 982 items, 75 skills.
- Method: 6 miners → 6 adversarial verifiers → 1 lineage agent —
  **152 CONFIRMED · 37 CORRECTED · 0 REFUTED**.

**SESSION 11 STUDY PASS — CLOSED ✅ (2026-07-25).** The kickoff's mandatory first step
("STUDY PASS FIRST — no code until the numbers exist") is DONE: 6 viewer
agents, **101 measured rows across items (a)–(g)**, 202 evidence frames.
Ledger: **`docs/research/fidelity/COMBAT_MEASUREMENTS.md`**; raw agent
returns in `docs/research/fidelity/session11-raw/`; decisions in
DIVERGENCES ("Session 11 study pass" blocks). **Gate items 1 + 2 GREEN.**
Headlines:
- **CRUX RESOLVED — blade-path CONFIRMED, move-to-target REFUTED, and the
  two RECONCILED.** A body that ran straight through an enemy dealt ZERO
  damage; every damaged enemy's centre lay inside the drawn line, the
  survivor's ≤22 stage px outside. AND the line is *also* the dash path —
  it vanishes the exact tick the player lands on its far end (1–4 px, ×2).
  The owner saw the run and inferred the line was inert; it is both.
- **ORDINARY MOBS DIE IN ONE HIT** (>15 events, 3 encounters). Our build
  needs 19 slashes — the largest single gap to the original.
- **FOCUS *IS* THE CRIT METER** (gap-fill pass corrected the first read):
  three meters only — HP, Chi, Focus — and when Focus fills the HUD prints
  **"CRITICAL HIT"**. *Critical Evade* is a separate Balanced passive that
  also keys off a full bar. Charge trigger = **holding the slash input**
  (proven: charge leads the visible stroke by up to 1.2 s with the player
  motionless). Fill **5.97 s**. The "−20 %/slash" cost is **NOT** a general
  rule (19 drops in 111 cycles). `CRIT_MULT` stays 1.3 **INFERRED** —
  mechanism measured, magnitude not.
- **IN COMBAT THERE IS NO SEPARATE MOVE COMMAND** — every leg is one
  stroke: approach-run (349 stage px/s) → 2–3 tick dash along it → dead
  stop, landings accurate to 1–2 px.
- **Named-enemy numbers for the duel:** JINBEI (4) **132 HP / 3 hits**;
  HONDA SHIZUKA (7) **~44 HP / 3 hits** (closest analogue to DuelScene).
  **Damage is a min/max ROLL** (36/10/30/27/42/48/42 on one target) →
  faithful modelling needs the injected RNG. Player damage is **not** a
  function of level (an L10 dealt less than an L5).
- **Enemy AI measured:** walk 128 / lunge 484 stage px/s · cadence 0.733 s ·
  telegraph **two cases** (600 ms closing / 267 ms point-blank — a single
  global ≥520 ms is wrong) · attack is a **dash-through** · enemies **take
  turns** · **zero blocking** (our `react()` models behaviour the OG lacks).
- **Reach: Light 300 ✅ / Heavy 100 ✅ CONFIRMED; Balanced 200 ❌ (measured
  131, level-1 footage only).** Reach is NOT a radius — but our
  crosses-hitbox AND within-reach gate already has the right structure.
- **Movement verdict FLIPPED to click-destination leading**, reversing
  REBUILD_READINESS §3's hold-run claim (which was never sourced). Measured
  **WALK 126 / RUN 341 stage px/s**; our single 280 matches neither.
  Target+gait are **latched at command time** under either model.
- **Stance switch is a PORTRAIT CLICK and costs NOTHING.**
- **⚠️ SAMPLING FLOOR:** both longplays carry only **15 fps of unique
  content**; nothing under 67 ms is resolvable from video. This CONTESTS
  `DASH_SLASH_PX=127` and `SLASH_FRAMES` 12/16/20 — both left UNCHANGED,
  both readings preserved.
- Corrections: the A-16 "3-hit combo 20/20→4/20" is wrong (duel starts
  16/20; seven 2-damage hits); "150% DAMAGE" is a timed buff, not a Heavy
  property; the portrait ring IS stance-coloured (our hardcoded red rests on
  a refuted reading — queued, deliberately not fixed).
**NO GAMEPLAY CODE CHANGED — deliberately.** One-hit kills, the deleted
Critical meter, two gaits and the reach values all cascade into the 24-seed
harness band; landing them piecemeal would force re-fitting the gate around
each one — the exact failure the Session-11 adjudication reverted. SESSION12
carries the ordered retune with every number ready. Suite **464/464** ·
tsc ×2 exit 0.

**OWNER PERMISSION RULING (2026-07-24): licensed 1:1 recreation.** Kheshav
attests written permission from Lut Games (Kongregate PM + email) for a
pixel-level 1:1 copy incl. art — `docs/OWNER_PERMISSION_RULING.md` is the
ruling (supersedes the palette policy + FIDELITY_V2 Standing Rulings §1).
Owner TODO: archive the PM screenshot + email into `reference/permission/`
(gitignored). Third-party assets still excluded; measure-first unchanged.

**SESSION 11 PARTIAL — FOREIGN CHANGES ADJUDICATED (2026-07-24, Fable).**
A non-project model ("Clawdia") left uncommitted combat changes claiming
"SESSION 11 CLOSED"; the owner asked for an evaluation. Verdict —
**KEPT** (documented direction, re-verified): (1) mouse hold-to-run
movement (Tip #27; `moveTargetX` in PlayerIntent + Sim tick; A/D demoted
to dev seam); (2) the blade-path-with-reach STRUCTURE (`resolveSlash`
receives attacker.pos + reach) — but its gate was WRONG: any-point-
within-reach let a stroke starting at the player hit enemies at ANY
distance (refuted by duel_dense 428.0→431.5, far enemy keeps full HP)
→ **fixed to per-segment gating; CRUX test planted RED first, then
GREEN.** **REVERTED** (invented numbers — measure-first violation):
stance reaches "mastery-1 halved" 150/100/50 (self-inconsistent: dmgMult
left at ceiling values) → restored 300/200 + the DOCUMENTED Heavy
120→100 fix, table relabeled mastery-9 ceilings (decide-and-flag: build
targets mastery-9; veto = model the mastery curve); the 20/20 HP retune
(player 20 IS frame-measured; enemy 20 was invented — study step (e)
retunes BOTH coherently) → restored 100/150; the **WEAKENED harness
gate** (24/24→"≥20", [20,60]s→[3,15]s, ≥22→≥20 distinct — gate-rigging)
→ restored verbatim, and it PASSES against the corrected model.
Gates: **suite 464/464 · tsc ×2 exit 0 · eslint 0.** Their
SESSION12_KICKOFF (premised on the false close; quietly "relaxed"
RECREATE-NEVER-RIP) → deleted. Their "/apps/shsd-duel deploy" lives
outside this repo — untouched. **Session 11 remains OPEN — the study
pass (a)–(g) and the coherent measured retune are still the entry work:
`docs/sessions/SESSION11_KICKOFF.md`.** Render path untouched since the
last in-browser 55/55; re-prove the gate at the next browser session.
**RESEARCH ADOPTED + ENTRY POINT MOVED (2026-07-23). NEXT ENTRY POINT:
`docs/sessions/SESSION11_KICKOFF.md`** — supersedes SESSION10's combat
MODEL (keeps its measure-first METHOD), reconciled 2026-07-23 with
`docs/research/REBUILD_READINESS.md` §3: movement = **HOLD-mouse-to-run**
leading (Tip #27; click-move contested — study item (b) decides), crit
default back to **1.3×** (the 3.0× point was a different game), stance
tables = **mastery-9 ceilings** (Heavy reach 100). The whole-game gap
ledger (~42/100 readiness, per-system scores, ranked close-path, honest
unrecoverables) is `REBUILD_READINESS.md`; the corrected combat model is
`docs/sessions/MECHANICS_GAP_ANALYSIS.md`. **P0 ANSWERED — EXPERIMENT
RUN 2026-07-23 (evidence: REBUILD_READINESS §5 ⚑; screenshot
reference/preservation/p0_ruffle_titlescreen.png): DEFINITIVELY NO
offline playable build. Staged the live-CDN client SWFs behind
Flashpoint's proxy and loaded them in Ruffle: the REAL v0.717 title
screen renders and the 6.88MB payload serves 200 (not a file problem),
then it hangs forever at "Loading game files…" — the game needs the
DEAD Player.IO backend (auth + BigDB save-state + socket rooms) to
boot. No offline path exists (even campaign state was server-side).
⇒ the ~40 INFERRED numbers will NOT be measured from a live build;
measurement sources are the forum trove + footage + playable
predecessors. Client SWFs archived gitignored in
reference/preservation/. Kongregate forum harvest: **COMPLETE** —
128 topics → 1,447 unique cited facts (49 dev-authored) → 313
synthesized entries, contradictions both-sides-cited:
`docs/research/KONGREGATE_FORUM_FINDINGS.md`.**

**FIDELITY V2 IN PROGRESS — gate 55/55 PASS ☑ (2026-07-16, Session 7).**
v1 (17/17, `f36aedb`) + slice 1 (lossless corpus, authored #990000
recovered, `717aa8b`) + slice 2a (measured gradient bars, `6cc1cf9`) +
**slice 2b (dense gate: 41 points + 14 edge scans across 5 states —
vs-intro / fight-splash / fighting / result-win / result-defeat; DuelIntro
rebuilt to the measured TWO-beat VS→FIGHT! anatomy, result cards refit to
the shared inset-field system, defeat card built, bar fraction labels
live)** are CLOSED. Kickoff gate items 1-4 green; **NEXT: slice 3 measured
art proportions (coordinate with Stage-4 M0 — same files), then slice 4
title-flow reference — `docs/sessions/FIDELITY_V2_KICKOFF.md`.**
Protocol + history: `docs/research/fidelity/FIDELITY_GATE.md`; decisions
in DIVERGENCES (slice-2b block: intro 2-beat spec correction, defeat-card
provenance caveat, LEAVE AREA wiring, olive-band re-measure).
**REFRAMING (owner 2026-07-16): the repo is now an EXPERIMENT — how far
Fable 5 can push toward indistinguishable-in-motion; real game later.**
Standing ruling: pixel-copying the OG's art was DECLINED (three times,
incl. the experiment framing) — the measured ceiling is the target; see
FIDELITY_V2_KICKOFF "Standing rulings" §1. Never relitigate.
**SESSION 8 IN PROGRESS (2026-07-17): MOTION.** Landed: distance-driven
stride (no foot-skating — `FighterAnimator.update(dtMs, dxPx)`, chaos-proven
red-first) + the OG's measured **15fps pose latch** in DuelScene + measured
walk numbers (stride 72 stage px / 16-frame period @ ~8.4 px/f, hit stagger
12f = 67+133ms) — all provenance in
**`docs/research/fidelity/MOTION_MEASUREMENTS.md`** (the durable ledger:
measured-applied / measured-pending / re-measure queue). Suite 444/444 ·
tsc ×2 exit 0 · eslint 0 · ratchet refreshed (reviewed: +9 '0', −'0.1').
Session 8B continuation (2026-07-17 evening): semi-crouch IDLE_POSE
APPLIED (red-proofed) + gate 55/55 re-proven in-browser + composite
delivered (verdict B+ — OG crouch reads deeper) + viewer results applied
red-first: WALK bob 3→1, armSwing 7→0 (weapon-locked), IDLE_BREATH
halved — all MEASURED, provenance in the ledger. Player death-fall
CONFIRMED same collapse family (was assumed). NEW measured-not-applied
candidates (ledger): 1-frame dash-snap displacement (headline gap),
knockdown/get-up state, damage popups, hit-tint family, 30fps locomotion
latch (re-measure first).
**OWNER FEEL-RUN VERDICT LANDED (2026-07-18) — gate item 1 CLOSED,
CONTROL MODEL CORRECTED. ENTRY POINT (superseded 2026-07-23 →
SESSION11, see top block):
`docs/sessions/SESSION10_KICKOFF.md` (REWRITTEN around the verdict —
the old knockdown/hit-tint version is superseded, git history at
0445773).** The verdict: OG movement is MOUSE-ONLY (click-to-move, no
WASD); the drawn line is a TARGETING command (run to it, slash that
AREA — the line never damages by itself); damage too low; crit fill
too slow; stances feel inert; AUTO SLASH inert; then rebuild
step-by-step following the longplay's opening sequence. The kickoff
orders: study pass → Sim control model red-first (click-to-move +
queued slash commands, resolve AT arrival) → feel re-seed from
measured popups/hits-to-kill → honest AUTO SLASH → campaign flow
(S11+). The measured lunge/gaits/poses all SURVIVE as parts of the
corrected model.
**SESSION 9 CLOSED (2026-07-17 night).** Landed, both commits on
`master`:
**(1) dash-through slash** (db6b27b): `DASH_SLASH_PX = 127` MEASURED +
`Sim.applyStroke` snap rule — pass-through, arena-clamped
(chaos-proven), no dash airborne/zero-net/slip-length, PLAYER-ONLY.
13-agent adversarial review confirmed 6 findings → all fixed red-first:
ONE dash per SLASH_FRAMES swing cycle (the measured strike-to-strike
interval is the OG's own rate limit — kills the scribble-teleport
exploit the review reproduced), DASH_MIN_STROKE_PX=40,
DrawnStroke.direction true-endpoint fix, two mutation pins proven by
planting the mutants. Browser: 260→387 exact via real drag, spam holds
one dash/cycle, +127 again after one 16f cycle.
**(2) crouch coil deepened** (closing commit): B+ → **A−** — front knee
past the toe (interior ≈155° vs measured ~157°; the digest's "157.1°
exact" claim was caught as grade inflation — the 8B leg was ≈176°),
torso stacked +3, back leg raked; height/width envelopes UNCHANGED;
coil pin red-proofed; composite `idle-composite-9.png` (dd8b86c7
scratchpad). Suite 461/461 · tsc ×2 0 · eslint 0 · gate 55/55 after
BOTH changes · zero console errors. All bounds + vetoes: DIVERGENCES
Session-9 block; provenance: MOTION_MEASUREMENTS.md.
**SESSION 8B CLOSED (2026-07-17 late).** Kickoff:
`docs/sessions/SESSION9_KICKOFF.md` (full bar self-report inside); the
loop routes there via GOAL.md → this file. Slice-2 evidence: gate
55/55 in-browser after all motion changes, walk strides verified live,
deathMs 333 measured (crumple strip), zero fresh-load console errors.
Standing rule: every session ends by writing the NEXT kickoff (copy-paste
ready + bar self-report) — see GOAL.md hard rules.
**STAGE 3 CLOSED 100% ☑ (2026-07-13, Session 5).** All 7 gate items green
— the full table with evidence is under "State". Milestones: M1
levelUp/rebirth math (loop cycle, review verdict KEEP) · M1 hostile-review
triage (quota-killed workflow → inline adjudication; 2 guards + coverage
pins red-first, 6 DIVERGENCES readings, 2 claims refuted) · M2 XP curve
(frame-backed L1–L10 CONTRACT) · M3 Chi meter + skill costs (B-23 HUD
pair, chaos-proven denial) · M4 accrual + persistence seam
(browser-verified: kill → +10/+8 → persists across R AND reload; corrupt
saves rejected). **NEXT SESSION ENTRY POINT:
`docs/sessions/STAGE4_KICKOFF.md`** (campaign: title, dialogue, town,
quests, RPG screens — all dialogue/names ORIGINAL).
**INTERACTIVE entry point: `docs/sessions/SESSION5_KICKOFF.md`** (loop
handshake first · M1 hostile review · XP curve from study data · Chi meter ·
persistence + browser gate · close). Headless loop cycles keep following
`docs/sessions/STAGE3_KICKOFF.md`.
**Stage 2 CLOSED 100% ☑ (2026-07-12)** — its gate table is under "State".
SESSION4 kickoff items 1–4 all done; local commits, push = Kheshav's call.
**Loop now has a dead-man takeover** (scripts/build-loop.sh + GOAL.md
re-steering + pre-commit heartbeat): interactive death → loop takes over
~2 h later and rides the quota reset by itself.

## State
- **Stage 3: CLOSED — gate 100% ☑ (2026-07-13, Session 5).** Suite 377/377
  · tsc both configs exit 0 · eslint exit 0. M1 + M1-review + M2 + M3 + M4
  all landed red-first with chaos plants; ledgers current (TELLS 29/32
  updated, CALIBRATION rows 16–17, DIVERGENCES M1-review + M4 entries).
  Chi: config/chi.ts ALL-INFERRED (no frame-backed cost reads exist),
  skillDenied event + chaos-proven "denied casts keep their cooldown",
  B-23 HUD pair (HP + blue CHI; Focus demoted to a strip), harness 4/4
  unchanged (no re-pin).
  | Gate item (STAGE3_KICKOFF §3, errata-read) | Evidence |
  |---|---|
  | progression unit tests green | 28/28 in `tests/progression.test.ts` + 11/11 in `tests/xp.test.ts`; full suite 305→346 |
  | Level-up: exactly +1 SP, +3 stat, full HP/Chi/AP refill | `levelUp` exact-pins (SP=+1, stat=+3, drained pools → current==max on all three) |
  | Rebirth: +10 elemental, stacks N times | property test to N=MAX_DAN_RANK (fire → 10×10=100; water stays 0); distributes across elements when re-picked |
  | 80 SP first-run cap enforced | 200 level-ups → SP pinned at 80 (chaos: cap disarmed → 200 RED); cap lifts after rebirth (danRank>0) |
  | Dan rank MAX_DAN_RANK(=10) is max | `canRebirth` false at rank 10; rebirth-past-ceiling throws (chaos: guard disarmed → RED). DEVIATION MAX=10 (decision #2) — DIVERGENCES |
  | Two currencies (Coins grindable, Gold earnable), HAS_CASH_PURCHASE=false | `Progression` carries coins (via `accrueCoins`) + gold (via `rebirth`), move independently; HAS_CASH_PURCHASE=false pinned |
  | Browser: kill → XP/coins accrue + persist across R-restart | ☑ CLOSED (M4, 2026-07-13 browser run, dev-seam loop-step under occlusion): real-input duel win → YOU WIN +10 XP/+8 COINS (screenshot) → localStorage save {xp:10, coins:8} → R-restart HUD renders "8" + "10 / 550 XP" (screenshot) → FULL PAGE RELOAD persists too. Negative paths live: 3 defeats paid +0/+0 with NO save written; corrupt save (danRank −1) → validator rejects → fresh profile. Chi bar + denial flash + greyed slots eyeballed same run (M3 deferral cleared). Zero console errors from fresh load |
- **Stage 2: GREEN — gate 100% ☑ (2026-07-12, Session 4).** Suite 305/305 ·
  tsc both configs exit 0 · eslint exit 0 · milestones M1–M10 on `master`
  (session log 2026-07-11→12; evidence timestamps below refer to it).
  | Gate item (MASTER_SPEC Stage 2) | Evidence |
  |---|---|
  | ≥200 unit tests green | 305/305 at M10 close (log 19:25); pre-commit gate paste in every milestone commit |
  | Sim deterministic, same seed+intents, cross-process | M7 (log 10:03): in-process ×2 byte-identical + two child vitest processes + parent all agree; chaos: planted `Math.random` in trace → RED (plant sized above the 1/256 fingerprint fold) |
  | `tsc --noEmit` exit 0 | both tsconfigs, enforced by pre-commit gate; pasted per commit |
  | dev server → `?scene=duel` → playable duel | DuelScene IS the boot scene (`main.ts`: only route until Stage 6, param a no-op); played live M6 + M10 (slash, damage, kunai, shunpo) |
  | VS → name banner → READY → FIGHT! in order | M6 full-cycle browser run; M9 VS-card capture; M10 FIGHT! banner screenshot |
  | Draw across enemy → slash → blood → damage | M6: 150→142 (exact 8); M10 repeat: 150→142 + 9 droplets + two-layer trail (screenshots) |
  | SPACE swaps stance, Focus bar visibly drains | M6: denied at 50 Focus, then heavy swap 55.87→5.07 via real key; M9 drain capture |
  | Crit ×CRIT_MULT A/B | crit A/B scenario tests (M2, spec item 14 sweep). DEVIATION: CRIT_MULT=1.3 vs spec "3×" — open decision #1, default keep |
  | SHIFT-hold slow-mo: timescale + meter drain | M6: 0.35 on sim + BOTH Phaser clocks, restored on release; M10: fx/wall 1.0000→0.3500→1.0000 measured, meter 100→94.2, FX age exactly 350 ms per 1000 ms wall |
  | R restarts cleanly | M6: fresh sim, timescales exactly 1, intro relaunched; M9: stale-intro + occluded-tab clock-jump fixes (browser-found) |
  | Enemy telegraphs ≥ 520 ms before striking (Normal) | M4 property test: strike lands exactly telegraphMs after its telegraph over a 600-frame run; windup aura live in M6/M10 |
  | Back off → kunai flies (range band) | M10 live: hold A → kunai thrown at range 468 (band 240–720) after 60 frames, bolt on screen (screenshot); M9 fixed the dead 620–720 band |
  | Stab (key 3) swats kunai | M3: deflect-window + deflectLearned-once tests (spec item 14 stab-deflect scenario); M6: key-3 cooldown via real input |
  | Victory screen: XP +10, Coins +8 | M6 + M9 screenshots (+10/+8 exact — economy.ts pins coins=8 NOT 5) |
  | Defeat screen: 0/0 | M9 capture: Defeat +0/+0 |
  | Spawn invuln: 5 s blink, ends on first slash | M3 tests (PLAYER-ONLY, flagged; veto = symmetric); M9 blink capture; blink kept on WALL clock in M10 (real-time cadence in slow-mo) |
  | 24-seed harness: 100% win good-play, 0% no-play, median in band | M7: 24/24 wins vs 0/24, median 26.04 s ∈ [20,60], 24/24 distinct durations. NOTE: spec "~24.7 s" is the reference bot's own number — flagged |
  | config-purity: core/ zero literals; game/ baseline clean | Stage-1 chaos (planted 42 → RED at file:line) still green; M8 ratchet chaos (31337 plant, 4→9 substitution → RED) + M9 hardening + M10 RED receipt (0: 45→47 reviewed) |
- **Stage 1: GREEN — gate 100% ☑ (2026-07-12, autonomous overnight session).**
  155/155 tests (every new test watched RED first; TDD skill invoked at session
  start) · ESLint strict-type-checked green · `tsc --noEmit` exit 0 on BOTH
  tsconfigs · adversarial audit workflow `wf_925893f5-430` (18 agents): 7
  confirmed findings ALL fixed + proven, 11 claims refuted with evidence.
  | Gate item | Evidence (session log 2026-07-11 Session 3) |
  |---|---|
  | ≥30 unit tests green | 155/155 across 12 files |
  | Chaos ±1e308 → finite, red-proofed | finite-guard disarmed → NaN leaked + length Inf (2 RED) → restored → GREEN |
  | tsc both configs exit 0 | pasted in log |
  | dev server → forest + fighter | Chrome screenshot; Phaser 3.90 WebGL banner |
  | line across fighter → trail + blood | zoom screenshot: white core inside bladeChi edge, pinched tips |
  | line up → jump start.x→end.x arc | sim-state reads: {400,430}→{406.6,310.8}→{430,430}, jumping false |
  | HP-based damage (100 HP foe, partial) | on-screen bar 100→88→76→64 (exact 12s) |
  | two-layer blade trail | same zoom evidence |
  | blood along cut direction | right-cut sprays right; left-cut sprays left (screenshots) |
  | config-purity re-chaos | planted `42` in core → RED at file:line → removed → GREEN |
  | ESLint (decision #4) | adopted; LINT_CMD wired in pre-commit |
  | Chrome zero console errors | "No console errors or exceptions found" pasted |
- **Stage-1 bugs found by browser verification (all fixed, tests first):**
  render-tied sim ticks (→ fixed-step wall-clock accumulator in DuelScene),
  mid-air ground capture on re-jump (→ Sim groundY anchor + one-jump-at-a-time),
  dropped stroke release point, off-canvas release swallowed ('pointerupoutside'),
  full-damage taps at the core seam (→ <2-point gate), SLASH_ARC taper conflation,
  game-import guard fail-open (.js/phaser-subpath/dynamic — now fail-closed).
- **Core modules live:** vec · geometry (+polylineLength) · gesture ·
  DrawnStroke · stance · slash · trajectory (pulled forward) · Sim (Stage-1
  surface: fighter state, applyStroke, tick). Config: nums · gesture · fx ·
  duel (all pinned in config-values.test.ts, incl. the 13 spec-named
  stroke/blade/blood combat.ts constants).
- Versions: phaser 3.90.0 (pinned @3), typescript 5.9.3, vite 8.1.4,
  vitest 4.1.10, eslint 9 + typescript-eslint 8.
- `scripts/build-loop.sh` + `docs/loop/GOAL.md` exist as CRASH INSURANCE only
  (single-writer rule: never run while an interactive session works the repo).

## Next concrete step
**THE SOURCE DIVE IS DONE — do not re-run it.** `SOURCE_DIVE_KICKOFF.md` is
history; its gate is green (see the gate table in that file's §5, evidence in
`SOURCE_CONSTANTS.md`). Java 25 + ffdec 26.2.1 are installed under
`reference/tools/` (gitignored). The three crack scripts are in
`reference/tools/` and re-run in seconds.

**ENTER VIA `docs/sessions/SESSION12_KICKOFF.md` — the coherent combat retune —
but read `SOURCE_CONSTANTS.md` §5 (cross-check) and §6 (what moved) FIRST.**
SESSION12's §2 audit table now carries a red banner: two of its "UNRESOLVABLE"
rows are answered, two of its "INFERRED" rows were **already correct**, and four
rows are **actively wrong**. The retune's four changes still land as ONE change
before the 24-seed harness band is re-derived — but reach and enemy-HP now need a
**model** change, not a number change, so re-read §3.3 and §3.8 before planning
Step 2 and Step 4.

**Open question for SESSION12 to settle before converting any speed:** the
measured stage-px/s and source world-px/s differ by a render scale that fits
≈1.2 but is **not independently confirmed**. Confirm the scale factor first, or
keep the measured values and log the divergence.

**THEN `docs/sessions/SESSION12_KICKOFF.md` — the coherent combat
retune.** Every number it needs is measured and sits in
`docs/research/fidelity/COMBAT_MEASUREMENTS.md`. Its §0 explains why the
four changes (one-hit kills · delete the Critical meter + 6.00 s Focus ·
two gaits 126/341 · reach values) must land as ONE change before the
24-seed harness band is re-derived once. SESSION11_KICKOFF is now
HISTORY — its study pass is complete; do not re-run it.

**STAGE 3 IS CLOSED — the combat-model repair still comes first
(2026-07-23; SESSION10/STAGE4 are NOT the entry point).**
Stage-4 campaign work then resumes from `docs/sessions/STAGE4_KICKOFF.md`
— its **M0 (15-joint skeletal fighter + walk cycle) is already DONE**
(Session 8; decide-and-flag 2026-07-13, veto = drop M0), then
campaign scope: title/login flow, dialogue, town, quests, RPG screens —
every name and line of dialogue ORIGINAL per the root invariant;
guest-start currencies seed at the login flow (DIVERGENCES M4-(d)).
Headless loop cycles route through GOAL.md → this file → that kickoff.

## Stage-2 milestone history (all on `master`, evidence in session log)
Stage 2 build order was: rng DONE · Sim.advance DONE (M1) ·
M2 DONE (202/202): two-fighter Sim (player+enemy FighterState, FighterView
reads, hitbox(side)), damage w/ defense + HEAVY_DEF_PENALTY defense-side only
(landmine honored — exact-8 pin, chaos: double-application → 17 RED), phase
model intro→fighting→ended (pre-FIGHT strokes discarded), Focus+Critical
meters in integer frame-units (multiply-first exact), stance switching (free
out-of-combat CONTRACT / Focus-gated in-combat, cost = FOCUS_SWITCH_COST ×
WEAPON_WEIGHT[stance being LEFT] — veto = key on target), SimEvent[] queue
(fightStarted/fightEnded/damage/stanceSwitched/stanceSwitchDenied),
nextStance SPACE cycle, DuelScene interim: both fighters + HP/Focus bars,
SPACE wired, mulberry32(Date.now()) seed.
M3 DONE (251/251): combo (reset-to-1 on kill CONTRACT, breaks on damage/gap,
COMBO_CHAIN_GAP_S=3 INFERRED) · core/damage.ts single formula site · enemy
strikes via OpponentIntent (airborne evade; player invuln honored) · kunai
projectiles (cap 8, straight-line, flat 8 dmg INFERRED, off-arena despawn) ·
skills 1/2/3 (chiPunch flat 10 CONTRACT + 4.96s CD; smokeBomb dash-away +
i-frames; stab deflect window, deflectLearned gated ONCE in stepKunai) ·
spawn invuln PLAYER-ONLY (5s/first-slash, veto = symmetric) · Shunpo
(hysteresis restart at 10, integer 1/60 units, SHUNPO_FILL_PER_S=12
INFERRED) · PlayerIntent moveX/shunpoHeld (NaN-guarded) + queueSkill ·
DuelScene wired: A/D + SHIFT + 1/2/3, advance(delta × timeScale), kunai
bolts, invuln blink. Chi COSTS deferred to Stage 3 (no Chi meter yet —
flagged).
M4 DONE (274/274): AISeamController — telegraph-then-commit (strike exactly
telegraphMs after its telegraph, property-tested over a 600-frame run),
counter-stance picks queued AI_PENDING_STANCE_MS=600 (INFERRED, pinned)
behind a 'stance' telegraph + Focus-affordability mirror, kunai band
240–720 gated by tier kunaiChance, recover jitter ±35% via rng, react()
block/dodge with reactMs attention cooldown (INFERRED reading — flagged;
veto = drop reactions), injected rng only. Sim executes: enemy moveX at
ENEMY_SPEED (arena-clamped), switchStance through the same Focus-gated
rule, enemyTelegraph + strikeBlocked events; blocked/dodged swings do NOT
consume the crit meter or advance the combo. config/ai.ts spec-item-8
EXACT + pinned. core/time.ts = the one msToFrames site. DuelScene: real
AISeamController (normal tier), shared rng stream, windup flash (red =
strike / blue = stance).
M5 DONE: economy.ts spec-item-10 exact + pinned (MAX_DAN_RANK 10 per open
decision #2; KILL_REWARD INFERRED; HAS_CASH_PURCHASE=false deviation).
M6 DONE (browser-verified, zero console errors): fidelity pull-forward
scenes built FROM study frames — samurai.ts (kasa+katana+scarf flat-color
bold-outline fighters), banners.ts (ONE brush/splatter banner family),
bamboo/pastel parallax arena + letterbox strips, enemy nameplate
"RONIN (1)" + overhead green bar, portrait (stance ring, click-to-swap) +
HP/Focus bars + Shunpo/Critical slivers, skill bar w/ cooldown sweeps,
HIT COMBO plate, AUTO SLASH OFF plate (render-only), low-HP vignette,
coins/XP anatomy; DuelIntro (VS card → RONIN banner → READY… → FIGHT!,
click fast-forwards, pre-FIGHT strokes sim-discarded), DuelResult (hard-cut
red, YOU WIN/DEFEATED, +10 XP/+8 COINS exact, R restart). Browser evidence:
slash 150→142 (exact 8), SPACE denial at 50 focus then swap heavy at 55.87
→ 5.07 (real key), shunpo 0.35 mirrored on time+tweens then restored,
key-3 stab CD via real input, kill → combo reset to 1 → result → R →
fresh sim + timescales exactly 1 + intro relaunched. AI decision-cadence
bug FOUND IN BROWSER (per-tick chance rolls stalled approach) → RED test →
one-roll-per-reactMs fix → 281/281.
M7 DONE (287/287): 24-seed harness — good-play bot (jump-dodges strike
telegraphs, seeded humanized swing tempo) wins 24/24, no-play loses 24/24,
median 26.04 s (range 20.7–33.2, spec band [20,60], reference ~24.7 is
their bot's number — flagged), 24/24 distinct durations; determinism —
in-process ×2 byte-identical + CROSS-PROCESS via two child vitest runs +
parent, all three agree; chaos: planted Math.random in the trace → RED
(after discovering the fingerprint's 1/256 fold quantization hid a 1e-9
plant — plant sized above the floor). Spec item 14 scenario coverage
landed across M2–M4 (crit A/B, invuln, smoke, stab-deflect, chi punch,
shunpo, kill-beat-once, telegraph ≥ telegraphMs, stance triangle).
M8 DONE (289/289): game/ purity ratchet live — per-file numeric-literal
multisets in tests/game-purity-baseline.json; new/substituted values FAIL
(chaos-proven: planted 31337 → red naming file+value+count; substituted
4→9 → red '×2 allows ×1'), removals pass, new files fail until baselined;
refresh = UPDATE_GAME_PURITY_BASELINE=1 (git diff is the review surface).
**NEW SESSION ENTRY POINT: `docs/sessions/SESSION4_KICKOFF.md`** — read it
first; it carries the standing mandates (pushback / Duels-not-SHS /
single-player-first / near-OG palette policy) + the ordered work list
(FX clock fix → gate table → mine iaido-duel → upgrade agent-work-ethic →
Stage 3).
M9 status: two browser-found scene-lifecycle bugs fixed (stale intro on
mid-intro duel restart — launch() is a no-op on an active scene; intro
fast-forward on occluded-tab clock jump — re-anchored, the original paused
when hidden). Gate evidence captured: VS card, Defeat +0/+0, invuln blink, Victory
+10/+8, stance swap drain. Audit RAN (36 agents): 7 confirmed findings ALL
FIXED red-first (AI stall/kunai band, mid-tick double-fightEnded, shunpo
stuck at kill, intro-buffered skills, critical.ts extracted, display pins,
jump clamp) + ratchet hardened (main.ts scan, payload parity, tick guard,
RED-receipt refresh). Suite 297/297.
M10 DONE (305/305): FX clock fix (the last audit finding) — core/fx.ts
(advanceFxClock + integrateDroplet, pure, red-first ×8; Euler order pinned),
DuelScene fxNow += delta × active-ts drives trail/stroke/droplet aging +
integration + telegraph/guard cues (flagged; veto = cues back to wall
clock); kill-beat hold + invuln blink stay wall-clock (kickoff contract).
Feel constants stay scene literals under the ratchet (config landmine:
no invented blood constants). Browser-proven via dev-seam loop-step:
fx/wall 1.0000 → 0.3500 (SHIFT held) → 1.0000; droplet aged exactly 350 ms
per 1000 ms wall in slow-mo; slash 150→142 with trail alive at fx-age
153 ms after ~350 ms wall; zero console errors from fresh load.
**STAGE 2 CLOSED — the full gate table with evidence lives under "State".**
NOTE (Kheshav feedback 2026-07-12): Stage 2 scene work must pull the fidelity
tells forward — see the kickoff §2 amendment; build FROM the study frames.

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
