# IMPROVEMENTS RESEARCH — full 16-area sweep, adversarially verified

> **Landed 2026-08-13.** Supersedes `2026-08-05-improvements-research.md`
> (batch 1, 8 generic areas, never adjudicated against this repo — archived
> verbatim at commit `7b4a743`, deleted in the commit that lands this file).

**Method.** 16 research agents (Fable 5, effort high), one per area: each
web-grounded its claims against live sources (≥4 per area, ≥1 practitioner,
graded A/B/C) **and read the actual repo + measurement ledger before
adjudicating** — the discipline batch 1 skipped. Then 16 independent
adversarial verifiers (6 on Fable 5; 10 re-run on Opus 5 after a session-limit
interruption killed the originals) attacked every item: spot-fetching cited
URLs, re-reading the repo files themselves, and re-checking every cited ledger
row. Workflows: `wf_2de2a61a-4ec` (research + 6 verifies, 2026-08-12),
`wf_dec98e25-851` + `wf_ce178469-0f0` (verify remainder in two batches,
2026-08-13). Dating note: the research and the six 2026-08-12 verifies ran
BEFORE the ledger's §S24-H verify-corrections block landed (commit `a35af8d`)
— where their text calls §S24's skeptic verdicts "[VERDICT PENDING]", that
debt has since been paid; the ten 2026-08-13 verifiers were instructed to
honor §S24-H and flag conflicts with it. Raw agent returns: `improvements-raw/` (34 JSON files, one per
agent — every claim below traces to one of them).

**Scoreboard: 92 items — 49 CONFIRMED · 40 WEAKENED · 3 REFUTED · 0 unverified.**
WEAKENED = the core call survives but the verifier supplied a correction;
**the correction WINS over the claim text above it.** REFUTED items are kept,
marked **KILLED**, with the verifier's kill quoted — same traceability rule as
the measurement ledger's §00b.

**Precedence (do not reorder):** decompiled source constants (CONTRACT-SRC) >
measured OG behavior (`fidelity/COMBAT_MEASUREMENTS.md`, including its §S24-H
verify-corrections block) > repo invariants (`CLAUDE.md`, folder rules) >
anything in this document. An ADOPT here never overrides a ledger row. The
prime directive stands: generic best practice that diverges from what the OG
measurably does is a **defect**, not an improvement.

**Adjudication legend:** ✅ ADOPT (compatible as-is) · 🔧 ADAPT (survives but
re-parameterized to OG-measured values / repo idiom) · ⛔ REJECT (violates an
invariant, contradicts a measurement, or is churn) · ✔️ ALREADY DONE (repo has
it — file cited) · 📐 MEASURE FIRST (worthwhile only after measuring the OG).

---

## Headline findings — the ones that change what happens next

1. **A live rendering defect, found and pinned (→ fix inside A12.3):** payload
   frames carrying `r="1"` switch z-order from slot order to node-list order —
   semantics the repo itself already documents (`FIGHTER_ART_IDS.md` §3) — but
   `transcribeAnims.py` silently drops the flag and the byte-check can't see
   it. `balancedhorizontalslash_partc` frame 5 renders mis-layered in the
   committed build **today**. (§flash-anim.1)
2. **A12.3 is de-risked empirically:** a verifier ran the transcriber against
   the real bindata with `run_sheathed` + `death` appended — zero FATALs; a
   payload-wide census found **no color transforms, labels, scripts or motion
   guides anywhere**; `deathbyarrow` carries slot 21 (the only anim beyond the
   0–20 map) so a slot-range fail-loud must land first; and **no hit-reaction
   clip exists** — map §S24-F's measured reactions to the
   `gotlaunched*/downed*/brake` clip family from video. (§flash-anim.3–5)
3. **The render gap is the OPPOSITE of canon:** our fighters' positions glide
   60Hz-smooth between 15 fps latched poses; the OG steps positions on the
   same content tick as the pose. Latch render positions to `poseStepMs`
   (render-only) and pair with the A12.2 dash retune (constant ~616 px/s
   line-follow + terminal snap, per ledger §S24-H). Render interpolation
   stays REJECTED — smoothing diverges from the footage we copy. (§game-loop)
4. **The OG has a camera dead-band after all:** the sweep's own "never use
   setDeadzone" claim was KILLED by the repo's `SOURCE_CONSTANTS.md` §3.4
   (`camera dead-band | screen x 350–450`, CONTRACT-SRC, decompiled v0.717) —
   and the video-measured 56 % pin is that window's edge, to the pixel.
   Phaser's `setDeadzone` is the correct semantic match. (§camera-2d.4)
5. **Juice = measured juice only:** ADAPT the victim-hit whole-world 3-tick
   freeze, the per-hit red wash, and the hard-cut kill-cam timeline — all with
   ledger numbers; REJECT screen shake and controller rumble (absent from OG
   footage); MEASURE FIRST attacker-hit hitstop (unobserved). (§game-feel)
6. **The OG's own input buffer, not a generic one:** REJECT the canon fixed
   80–250 ms buffer; the measured semantics are busy-state gating — strokes
   drawn in hit-recovery are rejected; strokes drawn while busy defer in a
   single slot, blinking, and execute on recovery. Boundary details are
   MEASURE FIRST. (§combat-pacing)
7. **Phaser perf advice mostly evaporates on contact with this repo:** the
   batch-1 `roundPixels` claim is KILLED (v3.85.1 reverted the default; the
   pinned v3.90 already renders sub-pixel); pooling is ALREADY DONE by design
   (plain-object FX, zero per-frame GameObjects); atlases and Arcade physics
   are structurally N/A. The one real hotspot: per-segment stroke drawing fed
   by unthinned pointermove points. The arena `generateTexture` bake needs an
   owner ruling on the invariant's "all art is Graphics" clause first.
   (§phaser-perf)
8. **Determinism:** IEEE-754 `+−*/` is bit-portable; `Math` transcendentals
   are not. The only transcendentals on gameplay-state paths are
   `Math.hypot`/`atan2` (replaceable with sqrt/comparison forms); every
   `sin`/`cos` is render-side; mulberry32's known bias is irrelevant at
   gameplay scale; future replay = seed + input tape at the Sim boundary.
   (§determinism)
9. **Vite 8 (Rolldown):** the correct chunk API for the pinned `vite@8.1` is
   `build.rolldownOptions.output.codeSplitting` — batch-1's `manualChunks`
   guess (and the plausible `advancedChunks` alternative) are both wrong for
   rolldown-vite. Now-fix: `chunkSizeWarningLimit: 1500` silences the cosmetic
   PROBLEMS.md warning; the Phaser vendor chunk stays a Stage-6 item.
   (§vite-build)
10. **SESSION 25 audio architecture is settled:** reuse Phaser's own WebAudio
    context and unlock handling (no custom layer), master bus
    `sfxGain → DynamicsCompressor → sound.destination`, no AudioWorklet,
    envelope-anchored scheduling, all synthesis recipes parameterized for
    config CONTRACT/INFERRED tagging — and MEASURE FIRST: spectrogram the OG
    videos' audio; the ledger has **zero** audio rows today.
    (§webaudio-core, §sfx-synthesis)
11. **Gate hardening, one metric:** masked full-frame pixelmatch over the five
    canonical gate states is the single orthogonal addition worth having;
    pHash and SSIM are REJECTED as redundant-or-blind here. CI = run the
    existing `?fidelity=auto` gate headless (Playwright) with PNG failure
    artifacts. (§fidelity-gating, §testing-vr)
12. **Architecture:** ECS stays REJECTED (churn against a pure-`Sim` design
    with 894 green tests and ~4 entities). What survives instead: branded unit
    types for the three pixel systems (px@1080 / stage / world — a real bug
    class in this codebase), CONTRACT/INFERRED type tagging, and
    `satisfies never` exhaustiveness on the SimEvent drain. (§ts-architecture)

---

## Action queue — every surviving ADOPT / ADAPT / MEASURE-FIRST, ordered by when

| when | ref | improvement | call | verify | effort | impact |
|---|---|---|---|---|---|---|
| now (it fixes an owner-reported misclassification class) | [gesture-input.1](#gesture-input) | Replace the event-count drag/hold discriminator with a distance slop; under §S24-C the ONL | ADAPT | WEAKENED | Low | High |
| now (SESSION 24 candidate) | [testing-vr.1](#testing-vr) | Run the existing ?fidelity=auto gate headlessly in CI via a Playwright script | ADOPT | WEAKENED | Medium | High |
| now | [ts-architecture.3](#ts-architecture) | Branded/template-literal tagging for CONTRACT vs INFERRED config values | ADAPT | CONFIRMED | Low | Medium |
| now / SESSION 24 | [ts-architecture.4](#ts-architecture) | Exhaustiveness checking via `satisfies never` on the SimEvent drain | ADOPT | WEAKENED | Low | Medium |
| now (as recorded knowledge); applied at Stage 6 | [vite-build.1](#vite-build) | Correct chunk-control API for vite@8.1 is build.rolldownOptions.output.codeSplitting — not | ADOPT | CONFIRMED | Low | Medium |
| now | [vite-build.2](#vite-build) | Now-fix: add a build section with chunkSizeWarningLimit ~1500 to silence the cosmetic 1360 | ADOPT | CONFIRMED | Low | Medium |
| SESSION 24/25 (before any multi-mob encounter polish) | [brawler-ai.1](#brawler-ai) | Attack token / combat-director pattern (DOOM token pool, slot systems) | ADAPT | WEAKENED | Medium | High |
| SESSION 24/25 (A12 gait work is live — §S24-D is its input) | [brawler-ai.4](#brawler-ai) | Gait split + speed retune: trash walks ~128 stage px/s, bosses ONLY run — single ENEMY_SPE | ADAPT | WEAKENED | Low | High |
| SESSION 24/25 (it is already tagged as A12.2 input in §S24-E) | [brawler-ai.5](#brawler-ai) | Enemy attack = dash-THROUGH (commit ~194 stage px, resolve ~96 px PAST), not a stationary  | ADAPT | WEAKENED | High | High |
| SESSION 24/25 | [canvas-vector-perf.2](#canvas-vector-perf) | Exact profiling protocol before any rendering change | ADOPT | WEAKENED | Low | Medium |
| SESSION 24/25 (A12.2) | [combat-pacing.2](#combat-pacing) | OG-faithful spec: busy-state gating + single-slot deferred-stroke queue in Sim, blink rend | ADOPT | WEAKENED | Medium | High |
| SESSION 24/25 (with item 2) | [combat-pacing.3](#combat-pacing) | Song's 'After Attack Delay' (Game Developer, 2005) — the canon rationale for DEFER-not-dro | ADAPT | WEAKENED | Low | Medium |
| SESSION 24/25 (alongside item 2), item (2) only after Stage-25 measurement | [combat-pacing.5](#combat-pacing) | Residual use of generic-canon numbers: INFERRED seeds and latency sanity bands only | ADAPT | CONFIRMED | Low | Low |
| SESSION 24/25 (next fidelity slice) | [fidelity-gating.1](#fidelity-gating) | Masked full-frame pixelmatch diff over the 5 canonical states — the ONE orthogonal metric | ADAPT | WEAKENED | Medium | High |
| SESSION 24 A12.3, before transcribing new anims | [flash-anim.1](#flash-anim) | Frame-level r="1" flag exists in the payload and the transcriber silently drops it — inclu | ADAPT | WEAKENED | Low | High |
| SESSION 24 A12.3 | [flash-anim.3](#flash-anim) | A12.3 targets probed byte-level: run_sheathed and death parse cleanly under the existing g | ADOPT | CONFIRMED | Low | High |
| SESSION 24 A12.3 (mapping pass before wiring) | [flash-anim.4](#flash-anim) | No dedicated 'hit reaction' clip exists in the payload — map §S24-F's three measured react | MEASURE_FIRST | WEAKENED | Medium | High |
| SESSION 24/25 (hardening, before enemy death variants) | [flash-anim.5](#flash-anim) | deathbyarrow introduces slot 21 — the only anim beyond the 0-20 slot map; add a slot-range | ADAPT | CONFIRMED | Low | Medium |
| A12-E (impacts work item, §S24-F header) | [game-feel.1](#game-feel) | Victim-hit hitstop: whole-world 3-tick (~200ms) freeze + red edge vignette | ADAPT | WEAKENED | Medium | High |
| SESSION 24/25 measurement pass | [game-feel.2](#game-feel) | Attacker-hit hitstop (player LANDS a hit): unobserved — measure before adding | MEASURE_FIRST | CONFIRMED | Low | Medium |
| A12-E | [game-feel.4](#game-feel) | Per-hit full-screen red wash / hurt vignette on damage taken (3–5 ticks) | ADAPT | CONFIRMED | Low | High |
| SESSION 24/25 measurement pass | [game-feel.5](#game-feel) | Existing persistent low-HP vignette is INFERRED and possibly a divergence | MEASURE_FIRST | CONFIRMED | Low | Medium |
| A12-E / Stage 2 kill beat | [game-feel.6](#game-feel) | Kill beat: replace INFERRED slow-mo FINISHER_FLASH with the measured hard-cut kill-cam tim | ADAPT | CONFIRMED | High | High |
| A12-E | [game-feel.7](#game-feel) | Measured hit-reaction displacements: launcher, knockdown, knockback (Sim-owned, not render | ADAPT | WEAKENED | High | High |
| SESSION 24/25 (A12.2 movement retune) | [game-loop.3](#game-loop) | The real gap is the OPPOSITE of canon: fighter render POSITION is still 60Hz-smooth while  | ADAPT | CONFIRMED | Medium | High |
| SESSION 24/25 — pairs naturally with the §S24 stroke-lifecycle work already in flight | [phaser-perf.7](#phaser-perf) | The one real per-frame hotspot in THIS scene is stroke segment count, not entity count — t | ADAPT | WEAKENED | Low | Medium |
| SESSION 24/25, after item 1 is green | [testing-vr.2](#testing-vr) | Full-canvas pixelmatch baselines per canonical gate state — the regression net between the | ADAPT | WEAKENED | Medium | High |
| SESSION 24/25 | [ts-architecture.2](#ts-architecture) | Branded unit types for the three pixel systems (px@1080 / stage px / world px) | ADAPT | CONFIRMED | Medium | High |
| SESSION 25 / Stage 3 (after dash-through geometry lands) | [brawler-ai.6](#brawler-ai) | Per-enemy attack cadence: validate against the measured 0.467-1.933 s landed-hit band, not | ADAPT | CONFIRMED | Medium | Medium |
| SESSION 25 measurement pass | [combat-pacing.4](#combat-pacing) | Reject/defer boundary, pending-slot replacement policy, and deferral timeout are underdete | MEASURE_FIRST | WEAKENED | Medium | Medium |
| SESSION 25+ (after a §S25 timing-extraction pass) | [fidelity-gating.6](#fidelity-gating) | Temporal/animation fidelity metric (per-beat pose comparison) | MEASURE_FIRST | WEAKENED | High | High |
| SESSION 25 / Stage 6 | [sfx-synthesis.1](#sfx-synthesis) | Sword whoosh = two filtered-noise layers with swept bandpass; heavy-vs-light falls out of  | ADAPT | CONFIRMED | Medium | High |
| SESSION 25 / Stage 6 | [sfx-synthesis.2](#sfx-synthesis) | Metal clang (armor/parry) = inharmonic square-bank OR fast-decay inharmonic FM; both are p | ADAPT | CONFIRMED | Medium | High |
| SESSION 25 / Stage 6 | [sfx-synthesis.3](#sfx-synthesis) | Flesh/body thud = 3-layer percussion recipe: pitch-dropping low tone + short mid attack to | ADAPT | CONFIRMED | Low | High |
| SESSION 25 / Stage 6 | [sfx-synthesis.4](#sfx-synthesis) | Anti-repetition: per-play pitch jitter around +-20% plus slight gain jitter, applied at th | ADOPT | WEAKENED | Low | Medium |
| SESSION 25, first task before any synthesis code | [sfx-synthesis.5](#sfx-synthesis) | Before seeding any INFERRED SFX constant: extract and spectrogram the OG audio from the tw | MEASURE_FIRST | CONFIRMED | Low | High |
| SESSION 25 | [webaudio-core.1](#webaudio-core) | Do not build a custom unlock layer — reuse Phaser's WebAudioSoundManager context, locked f | ADOPT | CONFIRMED | Low | High |
| SESSION 25 | [webaudio-core.2](#webaudio-core) | Master-bus graph: synth voices → sfx GainNode → DynamicsCompressorNode → this.sound.destin | ADAPT | CONFIRMED | Low | High |
| SESSION 25 | [webaudio-core.4](#webaudio-core) | Scheduling: anchor every envelope to ctx.currentTime; the 25ms/100ms lookahead scheduler i | ADAPT | CONFIRMED | Low | Medium |
| SESSION 25 | [webaudio-core.5](#webaudio-core) | AudioWorklet is NOT needed for one-shot synthesized SFX — native node graph only | ADOPT | CONFIRMED | Low | Medium |
| SESSION 25 (before any src/config/audio.ts values are tagged CONTRACT) | [webaudio-core.6](#webaudio-core) | OG SFX parameter values must come from the videos' audio tracks — the ledger has zero audi | MEASURE_FIRST | CONFIRMED | Medium | High |
| Future zone-traversal stage | [camera-2d.2](#camera-2d) | Exact Phaser 3 mapping exists — startFollow(player, false, 1, 1) + followOffset.x = +(0.56 | ADAPT | WEAKENED | Medium | High |
| Before the zone-traversal stage's camera work | [camera-2d.5](#camera-2d) | Left-travel camera anchor is UNMEASURED — measure before implementing bidirectional scroll | MEASURE_FIRST | WEAKENED | Low | Medium |
| Future zone-traversal stage (with zone art) | [camera-2d.6](#camera-2d) | Parallax layers ride the camera: boulder layer at 0.73×, plus a fixed screen overlay — imp | ADAPT | CONFIRMED | Medium | Medium |
| Stage 2+ only if profiled red | [canvas-vector-perf.1](#canvas-vector-perf) | Pre-rendering the ~40 transcribed animation frames to textures | MEASURE_FIRST | CONFIRMED | Medium | Low |
| Stage 2, only after profiling | [canvas-vector-perf.3](#canvas-vector-perf) | Plan cache keyed by (anim, frameIndex, mirrored) - remove the 60Hz recompute of a 15fps po | ADAPT | WEAKENED | Medium | Medium |
| Stage 5-6 (PvP/replay stage) | [determinism.2](#determinism) | The ONLY transcendentals on gameplay-state paths are Math.hypot and Math.atan2 — replaceab | ADAPT | WEAKENED | Low | High |
| Stage 5-6 (PvP/replay stage) | [determinism.5](#determinism) | Replay for PvP = seed + input tape recorded at the Sim boundary in sim-frame indices, with | ADOPT | WEAKENED | Medium | High |
| Stage 2-3 (when the queued lossless refinement runs) | [fidelity-gating.5](#fidelity-gating) | CIEDE2000-derived tolerances for the lossless-PNG refinement pass, with chroma-aware headr | ADAPT | WEAKENED | Low | Medium |
| Before Stage-3 scrolling/overworld work | [game-loop.6](#game-loop) | Interpolation's only possibly-legitimate scope — camera parallax and HUD meter fills — nee | MEASURE_FIRST | CONFIRMED | Low | Medium |
| Stage 2 feel pass (per decision #9's own default) | [gesture-input.5](#gesture-input) | LAUNCH_FLICK length-as-speed proxy: real per-point timestamps are now cheap, but measure t | MEASURE_FIRST | CONFIRMED | Medium | Medium |
| Stage 6 | [vite-build.3](#vite-build) | Phaser vendor chunk via codeSplitting.groups — snippet verified working, but KEEP it at St | ADAPT | WEAKENED | Low | Medium |
| rider on any future texture work | [canvas-vector-perf.4](#canvas-vector-perf) | Texture baking is a pixel-fidelity hazard on this stack (WebGL1 no-AA framebuffers, DPR bl | ADAPT | WEAKENED | Low | High |
| later — only on a measured frame-time problem (EncounterScene crowd growth is the likely trigger) | [phaser-perf.2](#phaser-perf) | Bake the static arena Graphics into a runtime-generated texture (generateTexture) — the on | ADAPT | WEAKENED | Low | Low |
| with item 1 | [testing-vr.4](#testing-vr) | Failure artifacts: dump per-state canvas PNGs (+ diff images) when the CI gate goes red | ADOPT | CONFIRMED | Low | Medium |

---

## Game loop & timestep  <a name="game-loop"></a>

> **Verifier's overall note:** The research output survives adversarial review almost intact: 5 CONFIRMED, 1 WEAKENED, 0 REFUTED. All five fetched sources are live and support their attributed claims, with two nits: (1) simplified.media's 'nearly always necessary' is a fabricated quote — the phrase describes the accumulator remainder, though the page does recommend interpolation universally, so item 2's REJECT stands on the ledger + anim.ts veto comment as it says it does; (2) item 4's smoothStep-default-true fact lives on the TimeStep API doc page, not the cited 3.60 changelog. Repo checks all pass: Sim.advance (clamp/NaN/negative/multiplicative owed frames + FRAME_QUANT_EPS), MAX_FRAME_MS=250 Spec-fixed in src/config/combat-sim.ts, no inline 250 or scene accumulator left (backlog row genuinely stale), drawFighters position-per-rAF vs pose-latched asymmetry real, DuelIntro re-anchor comment real. Ledger checks pass: §S24-E partb quotes verbatim, untouched by §00b/§S24-H corrections. One standing caveat for the ADAPT item: §S24-H records the adversarial verify of the §S24-D/E numbers as '[VERDICT PENDING]', so the 27/55-px stride and 18–22 px/tick figures driving A12.2 are first-pass measurements — worth closing that verdict before hard-coding them.

### game-loop.1 Fiedler accumulator core (clamp, NaN/negative guards, drift-free stepping) — in place; the RESUME_HERE '250 inline' backlog row is stale

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Medium · when: now

Canon fixed-timestep loop = accumulator that consumes wall-clock time in fixed dt steps, with a max-delta clamp (~250ms is the commonly recommended cap) to prevent the spiral of death and tab-switch fast-forward. Modern guides add: guard the accumulator against bad deltas, and derive owed steps without cumulative float drift.

**Why this call for THIS repo:** Sim.advance (src/core/Sim.ts) owns the accumulator: clamps each delta to MAX_FRAME_MS, rejects NaN/negatives, and computes owed frames multiplicatively from total elapsedMs with FRAME_QUANT_EPS (src/config/timing.ts) — drift-free, stricter than canon's repeated-subtraction remainder. MAX_FRAME_MS = 250 already lives in src/config/combat-sim.ts (Spec-fixed) and Sim imports it, so the RESUME_HERE 'Spark/backlog' row about replacing an inline 250 is DONE and can be crossed off.

**Implementation note:** Only action: delete/mark-done the stale backlog line in RESUME_HERE.md ('MAX_FRAME_MS=250 in config replaces the inline 250 at Stage 2').

<details><summary>Sources (3)</summary>

- [A] Fix Your Timestep! — Glenn Fiedler (Gaffer on Games) — https://gafferongames.com/post/fix_your_timestep/
- [C] Fixed Timestep Game Loops in the Browser — Simplified Media — https://simplified.media/guides/fixed-timestep-loops
- [B] JavaScript Game Foundations: The Game Loop — Jake Gordon — https://jakesgordon.com/writing/javascript-game-foundations-the-game-loop/

</details>

### game-loop.2 Render interpolation of fighter motion: canon says always, the OG measurably says NEVER — a fidelity DIVERGENCE here

**⛔ REJECT** · verify: **WEAKENED — corrections below** · effort Low · impact High · when: now

Fiedler canon and 2024-era browser guides treat previous/current state lerp by the accumulator remainder as 'nearly always necessary' to hide fixed-step stutter. But the OG is a measured pure 15fps stepper with ZERO interpolation and a terminal contact snap that lands wholly between two adjacent 1/60s frames — smoothing fighter motion would erase exactly the chunky stepping the project exists to copy.

**Why this call for THIS repo:** Ledger §S24-E partb: '60 fps burst proves the snap lands wholly between two ADJACENT 1/60 s frames (pure 15 fps stepper, zero interpolation)'. The repo already encodes the correct behavior: OG_ANIM.poseStepMs = 1000/15 in src/config/anim.ts latches drawn poses, with '0 = smooth' explicitly marked veto. Generic best practice is a DEFECT here per the prime directive.

**Implementation note:** Do nothing — and treat any future 'add lerp for smoothness' suggestion as a fidelity regression to be blocked, citing §S24-E.

**⚠ Verifier correction (WINS over the claim above):** Replace the simplified.media source annotation "claims interpolation 'nearly always necessary'" with: "recommends interpolation universally ('The remedy is interpolation'; names no case where it should be omitted) — its 'almost always' phrase describes the accumulator remainder, not the technique." The REJECT adjudication and §S24-E citation are unchanged.

<details><summary>Sources (2)</summary>

- [A] Fix Your Timestep! — Glenn Fiedler (interpolation section) — https://gafferongames.com/post/fix_your_timestep/
- [C] Fixed Timestep Game Loops in the Browser — Simplified Media (claims interpolation 'nearly always necessary') — https://simplified.media/guides/fixed-timestep-loops

</details>

### game-loop.3 The real gap is the OPPOSITE of canon: fighter render POSITION is still 60Hz-smooth while the pose latches at 15fps

**🔧 ADAPT** · verify: **CONFIRMED** · effort Medium · impact High · when: SESSION 24/25 (A12.2 movement retune)

The OG steps fighter positions on the same 15fps content tick as poses: constant-speed line-follow at ~18–22 world px per 15fps tick with a genuine alternating ~27/55 px two-tick stride ('recreate it, don't average it') plus the terminal contact snap. Our sim moves positions every 60Hz tick and DuelScene reads them fresh every rAF, so our fighters glide smoother than the original between the latched poses.

**Why this call for THIS repo:** Ledger §S24-E partb measures per-15fps-tick position steps and the two-tick stride rhythm; drawFighters in src/game/DuelScene.ts converts sim.player.pos via worldToStage every rAF with no latch, while the pose is latched at OG_ANIM.poseStepMs. §S24-E also flags that DASH_SPEED_PX_PER_FRAME mismatches the measured ~276–330 world px/s line-follow + snap (named A12.2 input).

**Implementation note:** Render-side only: sample fighter stage positions on the same poseStepMs latch the OgAnimPlayer uses (Sim stays 60Hz for hit resolution — hitboxes/damage untouched). Bonus: the A11.4 dx-driven stride then sees the OG's true per-tick dx, reproducing the 27/55 alternation instead of averaging it. Pair with the A12.2 dash retune (line-follow speed + terminal snap) so the latched steps carry the measured distances.

<details><summary>Sources (2)</summary>

- [A] Fix Your Timestep! — Fiedler (render state sampling is a deliberate choice, decoupled from sim rate) — https://gafferongames.com/post/fix_your_timestep/
- [A] Phaser TimeStep API documentation (render cadence vs update cadence) — https://docs.phaser.io/api-documentation/class/core-timestep

</details>

### game-loop.4 visibilitychange / backgrounded-tab handling — covered by three cooperating layers; no missing canon

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Low · when: now

Canon: rAF pauses in hidden tabs (browser-enforced, MDN), so on resume you must prevent a giant delta from fast-forwarding the sim — via a delta clamp and/or timestamp re-anchor on visibilitychange. Phaser 3 additionally ships a VisibilityHandler that pauses the loop on hidden and delta smoothing (fps.smoothStep, default true) that settles post-resume spikes.

**Why this call for THIS repo:** Layer 1: browser pauses rAF. Layer 2: Phaser's VisibilityHandler + default smoothStep. Layer 3: Sim.advance's MAX_FRAME_MS clamp caps any leak-through at 250ms of sim time — which also matches the OG platform's behavior ('the Flash game simply paused when hidden', comment in src/game/DuelIntro.ts, which already re-anchors its own step timer for the occluded-tab clock jump). A fight cannot fast-forward while hidden.

**Implementation note:** Nothing to build. If ever chaos-testing it: hide the tab mid-fight, resume, assert sim.frame advanced ≤ 15 frames (250ms) across the gap.

<details><summary>Sources (3)</summary>

- [A] MDN: Window.requestAnimationFrame() — paused in background tabs — https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
- [A] Phaser 3.60 TimeStep changelog (smoothDelta, spike handling) — https://github.com/phaserjs/phaser/blob/v3.60.0/changelog/3.60/Timestep.md
- [B] JavaScript Game Foundations: The Game Loop — Jake Gordon (clamp delta after focus loss) — https://jakesgordon.com/writing/javascript-game-foundations-the-game-loop/

</details>

### game-loop.5 144Hz / high-refresh displays — correct by construction; the canon 'fix' (interpolation) is moot below the 66.7ms content quantum

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Low · when: now

rAF fires at display refresh (75/120/144Hz are all common per MDN), so per-frame stepping runs 2.4x fast on 144Hz; the fix is time-based accumulation (some rAF frames run 0 sim ticks). Canon then prescribes interpolation to hide the resulting 60Hz-vs-144Hz temporal aliasing (uneven 2-3-2 tick cadence).

**Why this call for THIS repo:** Sim.advance derives owed 60Hz frames from cumulative wall-clock elapsedMs (src/core/Sim.ts), so sim speed is refresh-rate independent by construction; a 144Hz rAF just runs 0-or-1-tick frames. The aliasing canon smooths away is invisible here because the game's own content quantum is the 15fps latch (OG_ANIM.poseStepMs, src/config/anim.ts) — 66.7ms, far coarser than any 60/144Hz beat pattern.

**Implementation note:** Optional one-time VERIFY: eyeball the duel on a 120/144Hz display once and confirm the 15fps pose cadence reads as steady chunk-stepping, not shimmer. No code expected.

<details><summary>Sources (2)</summary>

- [A] MDN: Window.requestAnimationFrame() — callback rate matches refresh rate; use elapsed time or animation runs fast on high-refresh screens — https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
- [C] Fixed Timestep Game Loops in the Browser — Simplified Media (high-refresh section) — https://simplified.media/guides/fixed-timestep-loops

</details>

### game-loop.6 Interpolation's only possibly-legitimate scope — camera parallax and HUD meter fills — needs a frame-diff measurement before any smooth tween is added

**📐 MEASURE FIRST** · verify: **CONFIRMED** · effort Low · impact Medium · when: Before Stage-3 scrolling/overworld work

If interpolation has any home in this project it is non-fighter motion: camera scroll in scrolling arenas and HUD bar fills. But the §S24-E 60fps burst analysis found exact 4-duplicate-frame CONTENT blocks — whole-frame — suggesting the OG's entire render (HUD and camera included) stepped at 15Hz, in which case even camera/HUD smoothing beyond 15Hz is a divergence. §00 leaves room for doubt ('property of the archival capture… the Flash game likely ran 24–30 fps'), so this is measurable, not decidable from the ledger as-is.

**Why this call for THIS repo:** Ledger §00 (sampling floor: 15fps unique content, 'not necessarily of the Flash game') vs §S24-E ('exact 4-duplicate-frame content blocks' → pure 15fps stepper) leave one open question: do duplicate-frame runs hold during a camera pan and an HP-bar fill window? §S24-G note 9 already identifies parallax layers (boulder layer 0.73×) as measurable anchors. Until measured, keep the existing idiom: fx clock tweens for beats (advanceFxClock in src/game/DuelScene.ts) and no smooth camera.

**Implementation note:** Reuse the existing pixel-diff tooling on a scrolling window (A28 forest per §S24-G) and one HP-drop window: if pans/bars also show strict 4-frame duplicate runs, the 15Hz step is global — latch camera and HUD fills to poseStepMs too, and REJECT smooth tweens for them.

<details><summary>Sources (2)</summary>

- [A] Fix Your Timestep! — Fiedler (interpolation as a render-layer choice per-object, not a sim requirement) — https://gafferongames.com/post/fix_your_timestep/
- [C] Fixed Timestep Game Loops in the Browser — Simplified Media — https://simplified.media/guides/fixed-timestep-loops

</details>

**Dead ends this area:** aleksandrhovhannisyan.com/blog/javascript-game-loop/ returned HTTP 403 (could not be used as the practitioner source; Jake Gordon substituted). No web source was found that endorses skipping render interpolation for low-fps-aesthetic games — the REJECT rests entirely on the repo's own measurement (§S24-E), with every fetched guide recommending interpolation unconditionally; simplified.media explicitly found no cases where it should be omitted. Also searched for any claim that Phaser 3.90 requires its own fps.forceSetTimeOut/fixed-step config for external accumulators — nothing found; bypassing TimeStep's step logic by feeding raw delta into a self-owned accumulator (the repo's pattern) is uncontroversial.


---

## Impact feel: hitstop, screen shake, vibration  <a name="game-feel"></a>

> **Verifier's overall note:** The research output survives adversarial review almost intact: 5/7 CONFIRMED, 2 WEAKENED (both on tag/scope precision, not substance), 0 REFUTED. All four fetchable sources spot-checked live and say what is attributed to them (Sakurai pair-freeze + damage scaling; SmashWiki d*0.65+6 cap-30 pair-only formula; Song's shake/rumble/flash/slow-mo/damage-reaction canon; the Weidar summary's 0.2s sleep). Every cited ledger row was re-read at the pixels of the file and matches, and none falls under the §00b or §S24-H corrections (which overturn f-8/f-9/e-7/a-6 and a-2/a-5/gap-G/gap-H — untouched by these items). Repo state confirmed independently: no hitstop, no wash, no shake code, no Sim displacement on damage; the INFERRED FINISHER_FLASH slow-mo and 50%/0.4 low-HP vignette exist exactly as described. The two corrections to apply: (1) don't promote the single-window 3-tick freeze to 'fixed length, not damage-scaled' as measured fact; (2) KB-RULE direction is ledger-tagged medium confidence, so it must not be flat-tagged MEASURED in config.

### game-feel.1 Victim-hit hitstop: whole-world 3-tick (~200ms) freeze + red edge vignette

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Medium · impact High · when: A12-E (impacts work item, §S24-F header)

Canon hitstop (Sakurai/Smash) freezes ONLY the attacker+victim pair, scales duration with damage (Ultimate: d*0.65+6 frames, capped 30), and lets the rest of the world keep running. The OG measurably does something DIFFERENT: when the player takes a hit, the ENTIRE world (strokes, background, HUD bars) freezes pixel-identical for 3 content ticks (~200ms) under a red edge vignette — fixed length, not damage-scaled, global scope. Coincidentally this equals Vlambeer's recommended 0.2s 'sleep', but the OG's global scope is the spec, not the canon's pair-only scope.

**Why this call for THIS repo:** Ledger §S24-F 'Global hit-stop' row: 'the ENTIRE world froze 3 content ticks (~200 ms) under a red edge vignette ... a real engine beat, chaos-testable.' Repo has NO hitstop today — DuelScene's damage-to-player branch only calls spawnBlood + startOgSlash('enemy'). Use the measured params (global, fixed 3 ticks = 12 sim steps at 60Hz), never Sakurai's damage-scaled pair-only model.

**Implementation note:** Freeze is gameplay-visible, so it belongs in Sim (src/core) as a hold counter armed by the damage-to-player event, with the tick count in src/config tagged MEASURED (§S24-F); DuelScene renders the red edge vignette during the hold. Chaos-test per the ledger's own note: plant a moving stroke, assert pixel-static world during the 12 steps.

**⚠ Verifier correction (WINS over the claim above):** Treat 3 ticks (12 sim steps @60Hz) as the MEASURED value from the A28 window, but do not assert 'fixed length, not damage-scaled' as measured fact — the corpus contains too few freeze instances to rule out damage scaling. Tag the tick count MEASURED (§S24-F, single-window) and note that a future pass with freezes at different damage sizes should confirm invariance.

<details><summary>Sources (3)</summary>

- [A] "Thinking About Hitstop" — Sakurai's Famitsu Column Vol. 490-1 (Source Gaming translation) — https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/
- [B] Hitlag — SmashWiki (per-game formulas, pair-only scope) — https://www.ssbwiki.com/Hitlag
- [B] Jan Willem Nijman (Vlambeer) — The Art of Screenshake (INDIGO 2013) — https://www.youtube.com/watch?v=AJdEqssNZ-U

</details>

### game-feel.2 Attacker-hit hitstop (player LANDS a hit): unobserved — measure before adding

**📐 MEASURE FIRST** · verify: **CONFIRMED** · effort Low · impact Medium · when: SESSION 24/25 measurement pass

Sakurai's rule is that hitstop fires on EVERY connect, freezing both parties equally — canon says player-dealt hits should also stop time. But the ledger only ever measured the freeze when the PLAYER TOOK a hit; whether the world freezes when the player's slash lands on an enemy was never checked. §S24-E's landing holds (mid-combo hit = 4–5 ticks attacker recovery, E1/E11) are pose holds on the attacker animation, NOT a verified world freeze — background/bars were not asserted pixel-static in those windows.

**Why this call for THIS repo:** Ledger §S24-F records the freeze ONLY for 'when the A28 player took a hit'; §S24-E partb 'Landing holds' rows (E1: 4 ticks; E11: 4–5 with +47 px recoil drift) describe attacker pose recovery, not a background-verified world freeze. Adopting Sakurai's every-connect rule unmeasured would be fidelity divergence.

**Implementation note:** Cheap measurement: take an existing player-dealt hit tick (e.g. §S24-E E1 flash window), diff background/HUD pixels across the 4–5 hold ticks exactly as §S24-F did for the victim case. If frozen → extend item 1's hold to both directions; if moving → attacker 'hitstop' is animation-hold only, already covered by §S24-E landing holds.

<details><summary>Sources (2)</summary>

- [A] "Thinking About Hitstop" — Sakurai's Famitsu Column Vol. 490-1 (Source Gaming translation) — https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/
- [B] Hitlag — SmashWiki — https://www.ssbwiki.com/Hitlag

</details>

### game-feel.3 Screen shake and controller vibration: canon staples the OG does not have

**⛔ REJECT** · verify: **CONFIRMED** · effort Low · impact Medium · when: now (standing ruling)

Vlambeer's talk makes screenshake the signature juice trick, and Jiesang Song recommends camera shake plus controller rumble as first-line impact fixes. The OG shows NEITHER: zero shake observations across the entire measurement corpus despite §S24-G's traps documenting exact camera/parallax anchoring analysis (fixed screen overlays at dx=0, 0.73× parallax layers) that would have caught any camera displacement; and it is a mouse-driven Flash browser game with no haptics channel at all. Adding either is a fidelity DEFECT under the prime directive.

**Why this call for THIS repo:** grep of COMBAT_MEASUREMENTS.md returns zero 'shake' rows while §S24-G traps #9 prove the corpus tracked camera anchoring precisely (the mushroom-cluster dx=0 fixed overlay, 0.73× boulder parallax) — shake would have registered; src/ also has no shake code to remove (grep clean). No vibration row exists; input model is mouse strokes per §S24-C ('any drawn stroke = slash').

**Implementation note:** Nothing to build — this item exists to block future 'juice it up' churn. If a later video pass ever finds a shake instance, reopen as MEASURE_FIRST.

<details><summary>Sources (3)</summary>

- [B] Jan Willem Nijman (Vlambeer) — The Art of Screenshake (INDIGO 2013) — https://www.youtube.com/watch?v=AJdEqssNZ-U
- [C] The Art of Screenshake — talk summary with the 0.2s sleep + shake tricks — https://victorweidar.wordpress.com/2016/10/06/the-art-of-screenshake/
- [B] Jiesang Song — Improving the Combat 'Impact' of Action Games (Game Developer/Gamasutra) — https://www.gamedeveloper.com/audio/improving-the-combat-impact-of-action-games

</details>

### game-feel.4 Per-hit full-screen red wash / hurt vignette on damage taken (3–5 ticks)

**🔧 ADAPT** · verify: **CONFIRMED** · effort Low · impact High · when: A12-E

Song's canon endorses screen flash and hit lighting as impact feedback; the OG has its own measured version: a full-screen red WASH (scene visible through it) fires per player-HP drop for 3–5 content ticks per burst — 7 bursts tracked against HP drops, and 2 kills produced NO wash (kills get blood/hat/jug VFX instead). e-5.2 pins the same phenomenon as the ~0.20s player-hurt vignette (red tint, scene still in colour), distinct from the kill-cam's red+black-silhouette screen. It co-occurs with the 3-tick freeze of item 1.

**Why this call for THIS repo:** Ledger §S24-F 'Full-screen red WASH = player-took-damage feedback (3–5 ticks/burst ... 2 kills with NO wash) — reconfirms e-5.2'. Repo has NO per-hit wash: DuelScene's damage-to-player branch spawns blood only. Wire it to the existing `ev.type === 'damage' && ev.target === 'player'` drain branch; render like the killBeat fillRect overlay; constants MEASURED-tagged in src/config/fx.ts (per src/config/CLAUDE.md labeling rule).

**Implementation note:** One overlay, two zones per the ledger: full-screen tint at wash alpha + stronger edges (the 'red edge vignette' under the freeze). Duration 3–5 content ticks (~200–333ms) on the fx clock. Explicitly suppress it on the kill event — 2 measured kills had no wash; the kill-cam owns that beat.

<details><summary>Sources (2)</summary>

- [B] Jiesang Song — Improving the Combat 'Impact' of Action Games (screen flash, hit lighting) — https://www.gamedeveloper.com/audio/improving-the-combat-impact-of-action-games
- [C] The Art of Screenshake — talk summary (impact feedback layering) — https://victorweidar.wordpress.com/2016/10/06/the-art-of-screenshake/

</details>

### game-feel.5 Existing persistent low-HP vignette is INFERRED and possibly a divergence

**📐 MEASURE FIRST** · verify: **CONFIRMED** · effort Low · impact Medium · when: SESSION 24/25 measurement pass

DuelScene currently draws a permanent red edge vignette that ramps in below 50% HP (SYNTHESIS §4 seed). The measurement corpus never records a persistent low-HP tint — every measured red overlay is EVENT-driven (per-hit vignette/wash ~0.20s, kill-cam). If the OG has no standing low-HP vignette, the current one is generic-canon juice masquerading as fidelity; if it does, its threshold and alpha need measuring. Cannot adjudicate the render without a frame check at low player HP with no recent hit.

**Why this call for THIS repo:** DuelScene.drawHud comment 'Low-HP red vignette: ramps from 50% HP (SYNTHESIS §4)' has no MEASURED backing; ledger e-5.2 and §S24-F describe only transient per-hit vignettes/washes. The e-4/e-5.1 beach-duel window (player at 4/20 HP, t≈1963) is an already-catalogued frame range to check for a standing tint between hits.

**Implementation note:** Pull 2–3 stills from the beach duel at 4/20 HP several ticks after the last wash burst; diff screen edges against a full-HP frame. Absent → delete the drawHud vignette block (simplest change wins); present → replace the INFERRED 50%/0.4-alpha ramp with measured values.

<details><summary>Sources (1)</summary>

- [B] Jiesang Song — Improving the Combat 'Impact' of Action Games (hit lighting is momentary, not persistent) — https://www.gamedeveloper.com/audio/improving-the-combat-impact-of-action-games

</details>

### game-feel.6 Kill beat: replace INFERRED slow-mo FINISHER_FLASH with the measured hard-cut kill-cam timeline

**🔧 ADAPT** · verify: **CONFIRMED** · effort High · impact High · when: A12-E / Stage 2 kill beat

Song's canon recommends slow motion before climactic attacks — and the OG demonstrably does NOT use it. The measured kill-cam (B05 archer kill) is all hard cuts: fatal contact (cyan Chi burst at contact point) → +2 ticks HARD CUT (no fade) to a red screen with BLACK SILHOUETTES → loser's death replayed in silhouette settling in 16 ticks → YOU WIN text +17 ticks after onset → ~74 ticks (~4.9s) total → hard cut to loot. The repo's current kill beat (420ms red flash + 0.35× slow-mo ramp + 900ms hold, then result scene) is an invented canon-flavored beat that contradicts every measured element.

**Why this call for THIS repo:** src/config/fx.ts FINISHER_FLASH is explicitly INFERRED (slowMoScale 0.35, slowMoRampMs 90) and DuelScene's killBeat path applies it plus a 900ms hold — all contradicted by ledger §S24-F 'Kill-cam timeline (B05)': hard cut at +2 ticks, red+black silhouettes, YOU WIN +17 ticks, ~74 ticks total, no slow-mo, no fade. e-5.2 already corrected the related kill-flash/hurt-vignette conflation.

**Implementation note:** Re-parameterize FINISHER_FLASH to the measured tick timeline (MEASURED tags, dual-entry in tests/config-values.test.ts per the ratchet); drop the slow-mo scale entirely — remember src/game/CLAUDE.md's stuck-timescale landmine when removing it. Silhouette render = existing fighter pose drawn in solid black over the red field; loser collapse replay is P5-adjacent (death anim is 38 recorded frames per DuelScene comment) so the timeline skeleton can ship first with the held final pose.

<details><summary>Sources (2)</summary>

- [B] Jiesang Song — Improving the Combat 'Impact' of Action Games (slow-motion as canon; OG diverges) — https://www.gamedeveloper.com/audio/improving-the-combat-impact-of-action-games
- [A] "Thinking About Hitstop" — Sakurai's Famitsu Column (impact emphasis via freeze, not slow-mo) — https://sourcegaming.info/2015/11/11/thoughts-on-hitstop-sakurais-famitsu-column-vol-490-1/

</details>

### game-feel.7 Measured hit-reaction displacements: launcher, knockdown, knockback (Sim-owned, not render juice)

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort High · impact High · when: A12-E

Song's first principle — every attack must produce a visible damage reaction — is the one canon item the OG fully embodies, with exact numbers: small hits (−7/−12 HP) displace ~0; big hits (−17..−19) displace 40–270px; knock-up LAUNCHER ~270px vertical (x static, lands in 7 ticks); KNOCKDOWN prone tumble +136–186px (stands by ~6 ticks); knockback slide −188px + skid settle; victims displace toward the attacker's ORIGIN side as the attacker passes through (KB-RULE). These are gameplay-state displacements, not camera tricks — they belong in the Sim.

**Why this call for THIS repo:** Ledger §S24-F 'Hit reactions on the player (Honda window)' + §S24-C P-LEGS catalogue (knock-up ~270px vertical; knockdown +136–186px; knockbacks −188/+40px; ≤42px settles) — while DuelScene's both damage branches read 'No transcribed hit-stagger yet (P5)' and the Sim applies no hit displacement. Positions are sim state, so per src/game/CLAUDE.md this cannot live in the scene.

**Implementation note:** Constants in src/config tagged MEASURED (per-reaction displacement, tick counts, KB-RULE direction = toward attacker origin side); selection rule (small hit → 0, big hit → reaction class) is only medium-confidence, so tag the threshold INFERRED. Core logic in Sim with injected RNG only; DuelScene just renders the resulting positions plus the P5 poses later.

**⚠ Verifier correction (WINS over the claim above):** Tag the per-reaction displacements and tick counts MEASURED (§S24-F/§S24-C), but carry KB-RULE's ledger confidence: label the displacement-direction rule MEASURED-medium (or INFERRED with the §S24-F citation), alongside the already-flagged INFERRED small/big-hit threshold.

<details><summary>Sources (2)</summary>

- [B] Jiesang Song — Improving the Combat 'Impact' of Action Games (damage-motion principle) — https://www.gamedeveloper.com/audio/improving-the-combat-impact-of-action-games
- [B] Hitlag — SmashWiki (knockback as sim-state, distinct from hitlag) — https://www.ssbwiki.com/Hitlag

</details>

**Dead ends this area:** No developer postmortem, GDC talk, or technical writeup specific to Straw Hat Samurai: Duels' impact effects exists anywhere findable — all OG juice parameters come exclusively from the project's own frame measurements (§S24-F), which is why every ADAPT re-parameterizes canon to ledger values. Sakurai's translated column itself contains no concrete frame numbers (only the pair-freeze/damage-scaling/cap principles); the numeric formulas had to come from SmashWiki, which documents Smash, not SHSD — cited only to show how far the OG's global fixed-length freeze diverges from genre canon. 'Screen shake' produced zero hits in the measurement ledger, MASTER_SPEC grep, and src/ grep — its absence is an inference from a corpus that demonstrably tracked camera anchoring (§S24-G trap #9), not a positive measurement; flagged as such in item 3. The Gamasutra original URL (gamasutra.com/view/feature/130703) redirects; the Game Developer mirror was fetched instead.


---

## Input buffering vs the OG’s measured semantics  <a name="combat-pacing"></a>

> **Verifier's overall note:** Attack summary: 5 of the cited URLs were fetched live and all 5 support the claims attributed to them (SmashWiki Buffer, gamedeveloper.com Song 2005, salivity, threadreaderapp Thorson, Yosi Spring). No fabricated or dead source. The Dustloop GBVSR URL returns HTTP 403 to WebFetch but is a live indexed page whose content — \"the input buffer ... is extended to 6 frames, for a total window of 7 frames\" after wake-up/air recovery — matches the citation, so it is NOT a dead-link kill. Repo re-check: every ALREADY_DONE/REJECT-supporting repo fact is real — applyStroke ignores playerBusyUntilFrame for manual strokes (it only writes it; the sole read is the auto-slash guard), \"Stun is NOT modelled in this Sim (flagged)\", queueSkill's 1-frame edge trigger, the SimEvent union with its `autoStroke` precedent, dealDamage as the single damage funnel, public `get frame()`, and zero *_BUFFER constants in src/config/. Ledger re-check: §S24-A.6, §S24-C's build-consequence sentence, §S24-E's landing holds, §S24-F's 3-tick hit-stop and ~6-tick knockdown all say what is claimed; §00b overturns nothing in this area. Nothing was REFUTED — the area's central adjudication (reject a generic fixed-window buffer; build state-conditional reject/defer) survives intact. Three defects worth the parent agent's attention before A12.2 is specced: (1) the 4–5-tick hit-recovery seed is taken from §S24-E's STRIKER-side landing holds and must come from §S24-F's victim-side rows instead; (2) SLASH_FRAMES totals only 12/16/20 sim frames (0.20–0.33 s), so a DEFER gate keyed on playerBusyUntilFrame cannot reproduce the measured ~1.4 s hang — §S24-A.2's wait-for-arrival (2–22 ticks) is the real release condition; (3) the K1 anchor moved in the 2026-08-12 verify block (now ~30–60 px AHEAD of centre, contrast ~+50 px), and the PENDING/blink row was never re-derived, so nothing about the blink may be tagged CONTRACT.

### combat-pacing.1 Generic fixed-window input buffer (5–15 frames / 80–250 ms) as the stroke mechanism

**⛔ REJECT** · verify: **WEAKENED — corrections below** · effort Low · impact High · when: now (constrains SESSION 24/25 A12.2 design)

Canon practice (fighting games and action games alike) stores an input pressed during recovery in a short fixed window — typically 5–15 frames (~80–250 ms); Smash Bros uses 9–10 frames, SFV 3, GBVSR extends to 6–7 on wake-up — executes it on the first actionable frame, and silently discards it if the window expires. Applying this to SSHD strokes (e.g. 'a 120ms buffer') would be a fidelity DEFECT twice over: the OG outright REJECTS a stroke drawn during hit-recovery (it vanishes after 1 content tick, no dash, no damage — never buffered), and it DEFERS a busy-state stroke for up to ~1.4 s (~21 content ticks ≈ 84 sim frames), an order of magnitude past any canon window, keeping it visibly rendered the whole time.

**Why this call for THIS repo:** Contradicts ledger §S24-A.6 row K1 (hit-recovery stroke vanishes after 1 tick — a buffer would execute it) and the PENDING row Honda f0116–f0138 (~1.4 s deferral — a 120–250 ms window would expire it). Sim.applyStroke today has NEITHER behavior: it executes every manual stroke immediately regardless of playerBusyUntilFrame, so the fix is the OG spec in the next item, not a canon buffer.

**Implementation note:** Guidance for A12.2: do not add any *_BUFFER_MS constant to src/config/. The OG's semantics are state-conditional (reject vs defer), not time-window.

**⚠ Verifier correction (WINS over the claim above):** Delete the "SFV 3" datum — it is unsupported by any of the three cited sources (salivity names no specific game; SmashWiki and Dustloop cover Smash and GBVSR only). Cite the canon band as "salivity 5–15 frames / 80–250 ms; Smash Brawl 10 → Ultimate 9; GBVSR 6-frame extension = 7-frame total window on wake-up". Also weaken the second leg: the ~1.4 s deferral rests on ONE unverified instance (Honda f0116–f0138) that the 2026-08-12 §S24-H verify re-run did not re-derive; the REJECT adjudication stands on the CONFIRMED K1 row alone.

<details><summary>Sources (3)</summary>

- [B] Buffer — SmashWiki — https://www.ssbwiki.com/Buffer
- [B] GBVSR/Universal Strategy — Dustloop Wiki — https://www.dustloop.com/w/GBVSR/Universal_Strategy
- [C] Input Buffering for Better Combat Responsiveness — https://salivity.github.io/game-development/article/input-buffering-for-better-combat-responsiveness

</details>

### combat-pacing.2 OG-faithful spec: busy-state gating + single-slot deferred-stroke queue in Sim, blink rendered by the scene

**✅ ADOPT** · verify: **WEAKENED — corrections below** · effort Medium · impact High · when: SESSION 24/25 (A12.2)

The one piece of canon that DOES match the OG is 'buffered input executes on the first actionable frame after recovery' (SmashWiki; salivity). Spec: (1) add a hit-recovery state to FighterState — hitRecoveryUntilFrame set in dealDamage when the player is the target, seeded from §S24-E/F measurements (mid-combo hit hold 4–5 content ticks = 16–20 sim frames; knockdown ~6 ticks; global hit-stop 3 ticks), since Sim currently flags 'Stun is NOT modelled'. (2) In applyStroke (manual source): if frameCount < hitRecoveryUntilFrame → REJECT: no dash, no damage, emit a strokeRejected event so DuelScene draws the 1-tick vanish (K1). (3) Else if frameCount < playerBusyUntilFrame (already computed from SLASH_FRAMES windup+active+recovery, today gating only AUTO SLASH) → DEFER: store the DrawnStroke in a single pendingStroke slot, emit strokePending; in tick(), on the first frame past busy, run it through the same applyStroke slash path. (4) No expiry timer — the OG's ~1.4 s is 'until recovery', not a window; clear on fight end. (5) Render: scene draws the pending polyline blinking 3-on/1–2-off content ticks (4 sim frames per content tick), phase derived from Sim.frame via the pending events — scene stays render-only.

**Why this call for THIS repo:** Directly implements ledger §S24-C's build consequence ('K1-rejection + PENDING-blink rows give the busy-state gating') on existing seams: Sim.playerBusyUntilFrame and SLASH_FRAMES already exist, applyStroke is the single entry point both manual and auto strokes take (D7), and SimEvent is the established scene channel — no new architecture needed.

**Implementation note:** Constants to add in src/config/: HIT_RECOVERY_FRAMES (CONTRACT — §S24-E 4–5 ticks), STROKE_REJECT_VANISH_TICKS=1 (CONTRACT — K1), PENDING_BLINK_ON/OFF ticks (CONTRACT — §S24-A.6). Chaos-test both gates: plant a stroke inside hit-recovery (must reject), inside own-swing (must defer then execute), and verify the pre-A12.2 behavior (immediate execution) goes red.

**⚠ Verifier correction (WINS over the claim above):** Three fixes to the spec. (a) Seed hitRecoveryUntilFrame from §S24-F (victim-side: global hit-stop 3 ticks; knockdown stands up by ~6 ticks; knock-up lands 7 ticks), NOT from §S24-E's 4–5-tick figure — that is the STRIKER's landing hold (§S24-E "Landing holds", same list as "chained strike = 0–1 tick" and "kill/final pose holds"), and belongs to the DEFER window instead. (b) The DEFER release cannot be `frameCount >= playerBusyUntilFrame`: SLASH_FRAMES totals only 12/16/20 sim frames (0.20–0.33 s) against the measured ~1.4 s pending hang, and §S24-A.2 gives the actual gate — the stroke hangs 2–22 ticks because "execution waits for the fighter to arrive". Release on arrival-or-recovery, whichever is later, and record the mismatch as an open A12.2 question. (c) Tag PENDING_BLINK_ON/OFF INFERRED, not CONTRACT — §S24-A.6's "1–2-off at the sampling floor" is unresolvable at the ±1-content-tick floor and was not re-derived by the 2026-08-12 verify pass.

<details><summary>Sources (3)</summary>

- [B] Buffer — SmashWiki (first-actionable-frame execution) — https://www.ssbwiki.com/Buffer
- [C] Input Buffering for Better Combat Responsiveness — https://salivity.github.io/game-development/article/input-buffering-for-better-combat-responsiveness
- [C] The Art of Input Buffering — Wayline — https://www.wayline.io/blog/art-of-input-buffering

</details>

### combat-pacing.3 Song's 'After Attack Delay' (Game Developer, 2005) — the canon rationale for DEFER-not-drop during own-swing recovery

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Low · impact Medium · when: SESSION 24/25 (with item 2)

Jiesang Song (main game programmer, Kingdom Under Fire: The Crusaders) documents the technique the orchestrator asked about: after an attack, the character animation lingers so the player's next attack input is accepted even when the button press missed the precise timing — Devil May Cry, PoP: Warrior Within, and Ninja Gaiden all do it, purely as an input-responsiveness device. This is exactly the design intent behind the OG's PENDING behavior (a busy-state stroke waits and then chains), and §S24-E's 'chained strike = 0–1 tick' landing hold confirms the chain comes out essentially on the first free tick.

**Why this call for THIS repo:** The principle (accept the late input, execute at recovery end) survives verbatim, but the parameterization must come from the ledger, not Song: acceptance window = the whole playerBusyUntilFrame period (§S24-A.6 PENDING shows ~1.4 s, not a lingering-animation fudge), execution beat from SLASH_FRAMES (src/config/timing.ts) + §S24-E landing holds, and — unlike every canon implementation — the deferred stroke stays VISIBLE, blinking. Fully subsumed by the item-2 spec; listed separately because it is the requested canon anchor.

**Implementation note:** Already excerpted in docs/research/2026-08-05-improvements-research.md (rows 129/364/573) — cross-link the A12.2 commit to it.

**⚠ Verifier correction (WINS over the claim above):** Strike the equation "acceptance window = the whole playerBusyUntilFrame period (~1.4 s)". In this repo playerBusyUntilFrame is SLASH_FRAMES-derived and lasts 12/16/20 sim frames (0.20/0.27/0.33 s); the measured ~1.4 s hang is §S24-A.2's wait-for-arrival, a different clock. State it as: acceptance lasts until the fighter is actionable AND has arrived (§S24-A.2, 2–22 ticks), of which the swing-recovery window is only the first 0.2–0.33 s.

<details><summary>Sources (1)</summary>

- [B] Improving the Combat 'Impact' Of Action Games — Jiesang Song, Game Developer 2005 — https://www.gamedeveloper.com/audio/improving-the-combat-impact-of-action-games

</details>

### combat-pacing.4 Reject/defer boundary, pending-slot replacement policy, and deferral timeout are underdetermined — measure before pinning CONTRACT

**📐 MEASURE FIRST** · verify: **WEAKENED — corrections below** · effort Medium · impact Medium · when: SESSION 25 measurement pass

The ledger has exactly two data points: K1 (rejected — drawn 1 tick after a hit flash, mid-slide, left end 29 px behind center) and PENDING (deferred ~1.4 s). Three unknowns a wrong guess would fossilize: (a) is the boundary hit-recovery-vs-own-swing, or early-vs-late recovery (canon precedent for the latter: GBVSR widens the buffer specifically on wake-up; Brawl forbids buffering out of tumble hitstun entirely — state-dependent rules are normal)? (b) if a second stroke is drawn while one is pending, does it replace the slot (canon: newer input wins — Yosi Spring; Smash's priority hierarchy) or get ignored? (c) does deferral ever time out, or only resolve at recovery/fight-end? Scan both longplays for double-stroke-while-busy and late-recovery-stroke instances before tagging these CONTRACT.

**Why this call for THIS repo:** Ledger §S24-A.6 itself flags the thinness (K1 vs K2 differ by 2 ticks AND 69 px of placement — position vs timing is confounded), and §S24-H's adversarial verify pass is still [VERDICT PENDING] on adjacent claims. Ship item 2 with these three tagged INFERRED (single slot, latest-wins, no timeout) and a TODO row in COMBAT_MEASUREMENTS.md.

**Implementation note:** Cheapest instrument: the existing 15 fps extraction + red-mask stroke scan over hit-reaction windows in both videos; the Honda window (B t=3770–3782) already has per-tick crops in reference/frames/session24/.

**⚠ Verifier correction (WINS over the claim above):** Update the K1 datum to the §S24-H verify-pass correction (which WINS over §S24-A.6): K1 starts ~30–60 px AHEAD of the body centre, not 29 px behind, and the surviving K1-vs-K2 placement contrast is ~+50 px, not 69 px — the position/timing confound stands at "2 ticks AND ~50 px". Also drop "§S24-H's adversarial verify pass is still [VERDICT PENDING]": the re-run (wf_56ff205f-341, 3 skeptics) landed 2026-08-12 with three WEAKENED-with-corrections verdicts. It reinforces the item's premise — the PENDING/blink row was NOT among the claims re-derived, so it remains the thinnest evidence in the area.

<details><summary>Sources (3)</summary>

- [B] Buffer — SmashWiki (hitstun/tumble buffering rules, priority hierarchy) — https://www.ssbwiki.com/Buffer
- [B] GBVSR/Universal Strategy — Dustloop (state-widened wake-up buffer) — https://www.dustloop.com/w/GBVSR/Universal_Strategy
- [C] Input Buffering, Action Canceling, and also Forbidden Knowledge — Yosi Spring — https://medium.com/@yosispring/input-buffering-action-canceling-and-also-forbidden-knowledge-47a3f8a95151

</details>

### combat-pacing.5 Residual use of generic-canon numbers: INFERRED seeds and latency sanity bands only

**🔧 ADAPT** · verify: **CONFIRMED** · effort Low · impact Low · when: SESSION 24/25 (alongside item 2), item (2) only after Stage-25 measurement

Canon buffer numbers keep three narrow jobs here: (1) the 80–250 ms canon band and Celeste's few-frame jump buffer (Thorson: press-before-landing executes on the landing frame) bracket the OG's own 66.7 ms content-tick quantization — a sanity bound that scene pointer-up → applyStroke commit latency must stay within ~1 content tick, or K1-vs-K2-class distinctions (2 ticks apart) become irreproducible; (2) if the SESSION 25 measurement finds late-hit-recovery strokes deferring rather than rejecting, GBVSR's 6–7-frame wake-up buffer is the right INFERRED seed for that sliver; (3) Yosi Spring's consumed-input clearing (clear the slot on execution so one stroke can never double-fire) is a correctness pattern for the pendingStroke slot regardless of parameters. Everything else about canon buffers has no purchase on this game.

**Why this call for THIS repo:** Any such value entering src/config/ must carry the INFERRED tag per src/config/CLAUDE.md's labeling rule — none of these are OG measurements. Note Sim.queueSkill already implements a 1-frame edge-trigger buffer for skills (press consumed next tick, discarded outside 'fighting'), so no canon skill-buffer work is needed there.

**Implementation note:** The latency bound (1) is a test, not a constant: assert in a DuelScene input test that pointerup dispatches applyStroke within the same render frame.

<details><summary>Sources (3)</summary>

- [B] Maddy Thorson — Celeste game-feel thread (jump buffering) — https://threadreaderapp.com/thread/1238338574220546049.html
- [B] GBVSR/Universal Strategy — Dustloop — https://www.dustloop.com/w/GBVSR/Universal_Strategy
- [C] Input Buffering, Action Canceling, and also Forbidden Knowledge — Yosi Spring — https://medium.com/@yosispring/input-buffering-action-canceling-and-also-forbidden-knowledge-47a3f8a95151

</details>

**Dead ends this area:** "Song's after-attack delay" was ungoogleable as a fighting-game or CHI term (searches for Song + after-attack delay + input study returned only music/adaptive-audio papers); it resolved via repo grep to Jiesang Song's 2005 Game Developer article, already excerpted in docs/research/2026-08-05-improvements-research.md, and the live URL was then confirmed by fetch. grokipedia.com/page/Input_buffer_fighting_games returned HTTP 403; glossary.infil.net is JS-rendered and returned no content via fetch (its 'Delay Tech' entry URL from search results was therefore not used as a source). No canon source anywhere discusses VISUAL feedback for a buffered/pending input — the OG's blinking pending stroke has no canon analogue, so its render spec rests entirely on ledger §S24-A.6.


---

## Pointer capture & gesture classification  <a name="gesture-input"></a>

> **Verifier's overall note:** Three of six items take real damage, and two share one root cause the research never checked: Phaser 3.90 does not use PointerEvents at all (MouseManager binds mousemove/mousedown/mouseup; Pointer.event is documented TouchEvent|MouseEvent|WheelEvent). That REFUTES the getCoalescedEvents-via-Pointer.event item outright (silent no-op, always falls back) and breaks the pointerType note in the touch item. Item 1's headline (distance slop over event count, ANY stroke = slash at any range) survives and is repo- and ledger-verified, but its stated failure mechanism is wrong: the move order is latched on the null→value EDGE at pointerdown (before any dragPoints exist) and nulling moveTargetX never cancels it — so the proposed one-line displacement swap would not fix the reported bug without deferring the command past the slop and/or cancelling the latched playerMove. Item 3's REJECT survives but must stop citing §S24-E's '60 fps burst / pure 15 fps stepper' — the §S24-H 2026-08-12 verify block voids that defence (post-dates the research, not the agent's fault). A cross-cutting sourcing correction: 'the video-confirmed 4-sector gesture map' overstates SYNTHESIS.md, which records slash confirmed everywhere, jump seen once, and launch/stab NOT isolable at 0.4 fps. Sources spot-checked live: MS DragDetect (supports), MDN getCoalescedEvents (supports), MDN pointerrawupdate (supports), UW $P page (supports point-cloud/direction-ignoring, does NOT contain the cw/ccw caveat), Phaser Pointer API docs + phaser v3.90.0 MouseManager source (contradict the item-2 mechanism). No dead or fabricated URLs found.

### gesture-input.1 Replace the event-count drag/hold discriminator with a distance slop; under §S24-C the ONLY threshold the slash-vs-move classifier needs is a tiny hold slop

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Low · impact High · when: now (it fixes an owner-reported misclassification class)

Universal practice discriminates drag-from-click by DISTANCE from the down point, not by event count: Windows starts a drag only past SM_CXDRAG/SM_CYDRAG (default 4 px, DragDetect rectangle); inside the slop 'nothing happens'. pointermove dispatch is rAF-aligned (~60 Hz typical) and coalescing varies per device/browser, so a count of pointermove events measures event rate, not motion. The repo's `mouseMoving = this.mouseHoldActive && this.dragPoints.length < 4` (DuelScene.update) is exactly the fragile form: a jittery hold cancels run after 4 events regardless of distance, and the first ≤3 move events of EVERY real stroke feed `moveTargetX` — the fighter starts moving at stroke onset, which is the owner-reported 'short drags stolen for movement' bug direction. The §S24-C-consistent classifier: while held and cumulative displacement ≤ slop → movement verb (hold-run/click-destination per ledger b-1); once displacement > slop → the gesture IS a stroke, movement intent nulls for its remainder; on release, any beyond-slop stroke = slash at ANY range (PB-1/Beach S6: point-blank strokes attack). No minimum-slash-length and no range gate exist or may be added.

**Why this call for THIS repo:** DuelScene.update's `dragPoints.length < 4` heuristic contradicts ledger §S24-C A12.2 ('classification cannot steal short/point-blank drags for movement'); core/gesture.ts classifyGesture already never returns a move verb, so the fix is scene-side only.

**Implementation note:** Add one INFERRED constant to src/config/gesture.ts (e.g. STROKE_SLOP_WORLD_PX ≈ 4–8 world px, seeded from the OS 4-px convention scaled to world space) and key `mouseMoving` on cumulative displacement from the pointerdown point instead of dragPoints.length; once exceeded, latch 'this gesture is a stroke' until pointerup. finishStroke stays as-is (2-point gate + classifyGesture's degenerate→slash default already satisfy ANY-stroke=slash).

**⚠ Verifier correction (WINS over the claim above):** (a) `mouseMoving` does not gate the move COMMAND. Sim.setPlayerIntent issues an order only on the null→value EDGE (`if (moveTargetX != null && previous == null) this.issueMoveOrder(moveTargetX)`), and that edge fires on the FIRST update tick after pointerdown, when dragPoints.length === 1. So every drag whose down-point is farther than MOVE_DEADZONE_PX (25 world px, src/config/combat-sim.ts) from the player latches a full move order at stroke ONSET — the bug is broader than 'the first ≤3 move events feed moveTargetX'; conversely a genuinely point-blank drag is inside the 25 px deadzone and is never stolen. (b) A jittery hold does NOT 'cancel run after 4 events': dropping moveTargetX back to null does not clear the latched order — `playerMove` is cleared only on arrival or in applyStroke's slash branch (`this.playerMove = null; // a swing overrides a walk order`), so the run continues to the latched target for the whole drag. Therefore keying `mouseMoving` on cumulative displacement is NOT sufficient: the move command must be DEFERRED past the slop (never pass a non-null moveTargetX until the hold has proven sub-slop, or issue it only on a sub-slop pointerup) and/or the latched playerMove must be explicitly cancelled the moment displacement crosses the slop.

<details><summary>Sources (3)</summary>

- [A] DragDetect function (winuser.h) — Microsoft Learn — https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-dragdetect
- [B] What happens if I drag the mouse by exactly SM_CXDRAG? — Raymond Chen, The Old New Thing — https://devblogs.microsoft.com/oldnewthing/20100304-00/?p=14733
- [B] react-beautiful-dnd mouse sensor docs (sloppy-click threshold) — https://github.com/dudestein/react-beautiful-dnd-pt/blob/master/docs/sensors/mouse.md

</details>

### gesture-input.2 Capture coalesced pointer samples via Phaser's exposed native event — getCoalescedEvents through Pointer.event — **KILLED**

**✅ ADOPT** · verify: **❌ REFUTED by the verify pass** · effort Low · impact Medium · when: SESSION 24/25 (pairs with the A12.2 input rework)

Browsers coalesce device input (mice/pens sample 120–1000 Hz) into rAF-aligned pointermove (~60 Hz); fast flicks therefore reach the app as sparse polylines unless getCoalescedEvents() is read on each pointermove — the W3C/MDN-recommended pattern for stroke capture, adopted by shipped ink SDKs (Nutrient). Phaser 3 does not surface coalesced events itself (no mention anywhere in its Pointer API), but `Pointer.event` exposes 'the most recent native DOM Event', so the scene handler can call `p.event.getCoalescedEvents?.()` and push every coalesced position. Support is 'Limited availability' (not Baseline) per MDN, so the optional-chaining fallback to the single point is mandatory. Payoff here: truer red-stroke rendering of fast flicks against the OG trail, and a truer polylineLength for the flick proxy; blade-path HIT detection is less affected because polyline segments already span the gaps.

**Why this call for THIS repo:** DuelScene's pointermove handler currently pushes one world point per Phaser event into dragPoints (cap 2048) — coalesced points slot into the same array with no core/ change; core/gesture.ts and DrawnStroke are point-count agnostic.

**Implementation note:** In the pointermove handler: `for (const ce of (p.event as PointerEvent).getCoalescedEvents?.() ?? [p.event]) push(stageToWorld(...))` — note coalesced clientX/Y need the same stage-px conversion Phaser applies, so scale via the canvas bounds or reuse Phaser's transform helper; keep the 2048 cap. Apply identically in EncounterScene.

**❌ Verifier kill:** The escape-hatch does not exist in this repo's engine. Phaser v3.90.0 MouseManager binds 'mousemove'/'mousedown'/'mouseup'/'mouseover'/'mouseout'/'wheel' (verified against phaserjs/phaser v3.90.0 src/input/mouse/MouseManager.js — no PointerEvent API, no getCoalescedEvents anywhere), and the cited Phaser Pointer docs declare `event` as the union `TouchEvent, MouseEvent, WheelEvent` — PointerEvent is not in it. So `(p.event as PointerEvent).getCoalescedEvents?.()` is ALWAYS undefined on desktop; the mandatory optional-chaining fallback fires 100% of the time and the change is a silent no-op that buys zero extra stroke samples. The MDN facts quoted are accurate (returns a sequence of PointerEvents, pointermove/pointerrawupdate only, 'Limited availability... not Baseline', secure-context only), but they cannot be reached through Phaser 3's pointer abstraction.

<details><summary>Sources (3)</summary>

- [A] PointerEvent.getCoalescedEvents() — MDN — https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/getCoalescedEvents
- [B] Smoother Interactions on the Web: getCoalescedEvents() — Nutrient (ink SDK vendor) — https://www.nutrient.io/blog/using-getcoalescedevents/
- [A] Phaser Pointer API (event property; 'DOM pointer events can fire faster than the main browser loop') — https://docs.phaser.io/api-documentation/class/input-pointer

</details>

### gesture-input.3 pointerrawupdate — skip it

**⛔ REJECT** · verify: **WEAKENED — corrections below** · effort Low · impact Low

pointerrawupdate dispatches un-coalesced events as fast as JS can handle them, trading main-thread cost for sub-frame latency; MDN and the spec editor's own comparison say to use it only when coalesced pointermove is insufficient, and warn listeners 'can affect performance'. This repo consumes strokes only at pointerup into a fixed-60 Hz Sim, and the OG being recreated is itself a pure 15 fps stepper with zero interpolation (§S24-E 60 fps burst proof) — sub-frame input latency buys nothing measurable toward 1:1 feel, and Phaser's InputManager doesn't listen to the event anyway.

**Why this call for THIS repo:** Ledger §S24-E ('pure 15fps stepper, zero interpolation') plus Sim's fixed-Hz accumulator (src/core/Sim.ts, Spec-fixed FIXED_HZ) mean sub-rAF input latency is below the game's own perceptual floor; coalesced pointermove (item above) already recovers full path completeness.

**⚠ Verifier correction (WINS over the claim above):** Drop the '§S24-E 60 fps burst proof: pure 15 fps stepper with zero interpolation' justification. The §S24-H 'Verify-pass corrections (2026-08-12)' block states 'The 60 fps "4-frame content block" defence is VOID — that is a property of the capture (§00), not of the game', and correction #4 directs: 'model the dash as a constant-speed line-follow ~616 px/s @1080 (~274 world px/s)... build the Sim mover constant-speed at 60 Hz... Do NOT hand-author a 27/55 stepper into core.' The OG is no longer established as a zero-interpolation 15 fps stepper. REJECT still stands on the surviving grounds: pointerup-only consumption, fixed-Hz Sim, MDN's own performance advice, and the fact that Phaser 3.90 binds no pointer events at all (so pointerrawupdate would additionally require a bespoke DOM listener).

<details><summary>Sources (3)</summary>

- [A] Element: pointerrawupdate event — MDN — https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerrawupdate_event
- [B] pointermove vs pointerrawupdate — Navid Zolghadr (Pointer Events spec editor) demo/explainer — https://navidz.github.io/pointerrawupdate.html
- [A] Pointer Events Level 3 — W3C TR — https://www.w3.org/TR/pointerevents3/

</details>

### gesture-input.4 $1/$P gesture recognizers do not apply — the net-displacement sector classifier is the correct shape

**⛔ REJECT** · verify: **WEAKENED — corrections below** · effort Medium · impact Low

The $-family are instance-based template matchers for symbol vocabularies: $1 resamples a stroke to N points and nearest-neighbor-matches against stored templates; $P treats gestures as unordered point clouds and is explicitly DIRECTION-INVARIANT (its own authors note clockwise vs counterclockwise circles can't be discriminated). The OG's gesture map is four direction sectors where direction IS the meaning (horizontal=slash, up=jump/launch, down=stab — video-confirmed SYNTHESIS §5), so $P is disqualified outright and $1 would add template storage, resampling, and rotation-invariance machinery to answer a question `atan2` already answers. Practitioner consensus matches: $-recognizers are for letter/shape vocabularies, simple angle thresholds for directional swipes.

**Why this call for THIS repo:** src/core/gesture.ts classifyGesture (net-displacement angle vs GESTURE_DIAG_DEG sector) already implements the video-confirmed 4-sector map; a template matcher would be churn violating 'simplest change wins' and would import no OG-measured behavior.

**⚠ Verifier correction (WINS over the claim above):** (1) 'video-confirmed SYNTHESIS §5' overstates the source: SYNTHESIS.md's own confirmation row reads 'Gestures (slash/jump/launch/stab) | draw-line slash confirmed everywhere; jump seen in Trap Challenge; launch/stab NOT isolable at 0.4 fps | ✅ PARTIAL visual confirmation'. Only slash is confirmed everywhere; the down=stab and up-flick=launch sectors are unconfirmed on film. (2) The cited pdollar.html page does not contain the clockwise-vs-counterclockwise caveat — it presents direction-invariance as a design property, not a stated limitation; cite the ICMI paper or drop the attribution.

<details><summary>Sources (3)</summary>

- [A] $1 Unistroke Recognizer — Wobbrock et al., UW ACE Lab (primary) — http://depts.washington.edu/acelab/proj/dollar/
- [A] Gestures as Point Clouds: A $P Recognizer — ICMI 2012 paper — https://faculty.washington.edu/wobbrock/pubs/icmi-12.pdf
- [A] $P recognizer page (direction-invariance caveat) — https://depts.washington.edu/acelab/proj/dollar/pdollar.html

</details>

### gesture-input.5 LAUNCH_FLICK length-as-speed proxy: real per-point timestamps are now cheap, but measure the OG's launch discrimination first

**📐 MEASURE FIRST** · verify: **CONFIRMED** · effort Medium · impact Medium · when: Stage 2 feel pass (per decision #9's own default)

The config comment's premise ('raw pointer points carry no per-point timestamps in our pipeline') is a pipeline choice, not a platform limit: every PointerEvent — including each coalesced event — carries its own timeStamp, so carrying {x,y,t} instead of {x,y} enables true velocity-based flick detection, the standard in ink/gesture systems. However the OG's actual launch-vs-jump rule (speed? length? both?) has never been measured from the videos, and RESUME_HERE decision #9's own default is 'keep, revisit at Stage 2 feel pass'. Also flag: decision #9's text still says LAUNCH_FLICK_MAX_LEN=90 but src/config/gesture.ts is 75 (world-space conversion, SESSION13 A0) — the RESUME_HERE row is stale.

**Why this call for THIS repo:** src/config/gesture.ts labels LAUNCH_FLICK_MAX_LEN INFERRED with 'length proxies flick speed'; replacing the proxy before the OG's up-flick behavior is measured from reference/videos/ frames would swap one guess for another — measure launch strokes in the videos (they may not even be distinguishable at 15 fps), then decide.

**Implementation note:** If measurement supports a speed rule: extend dragPoints to {x,y,t} using event.timeStamp (works with and without coalesced events) and compute px/ms over the stroke; GESTURE_DIAG_DEG=45 itself stays — no web evidence exists for a 'better' sector half-angle, and the sector MAP (not the boundary) is what's video-confirmed.

<details><summary>Sources (3)</summary>

- [A] PointerEvent.getCoalescedEvents() — MDN (coalesced events carry their own properties) — https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/getCoalescedEvents
- [A] Pointer Events Level 3 — W3C TR (coalesced events list semantics) — https://www.w3.org/TR/pointerevents3/
- [C] I Made a Stroke Stabilization Library for Web Drawing Apps — dev.to practitioner writeup — https://dev.to/usapopopooon/i-built-a-library-to-reduce-hand-tremor-in-drawing-apps-33ng

</details>

### gesture-input.6 Touch-vs-mouse unification: Phaser's pointer abstraction already covers it; only the slop constant would branch if touch becomes a target

**✔️ ALREADY DONE** · verify: **WEAKENED — corrections below** · effort Low · impact Low

Phaser 3 unifies mouse and touch into one Pointer API ('you don't have to worry about whether the user is on a desktop with a mouse, or a mobile device with touch'), dispatching the same pointerdown/pointermove/pointerup stream the scenes already consume, and the repo already handles the classic unification trap of off-target releases via pointerupoutside. The one practice delta that would matter later: touch drag thresholds in shipped systems are substantially larger than mouse ones (Windows mouse 4 px vs Android's touch slop of 8dp ≈ 24–32 physical px) because fingers wobble — so IF a touch build ever becomes a goal, the hold slop from the first item should branch on pointerType (available on the native event). For the current desktop Flash-recreation target, one mouse-scale constant is correct.

**Why this call for THIS repo:** DuelScene.create and EncounterScene both listen on Phaser's unified pointerdown/pointermove/pointerup AND pointerupoutside (the Stage-1 audit's swallowed-stroke fix) — no touch-specific code is missing for the current desktop target; the pointerType slop branch is a noted future adaptation, not present work.

**⚠ Verifier correction (WINS over the claim above):** 'branch on pointerType (available on the native event)' does not work in Phaser 3.90: MouseManager binds mousemove/mousedown/mouseup and Pointer.event is documented as `TouchEvent, MouseEvent, WheelEvent` — a MouseEvent has no pointerType. If a touch build ever happens, branch on Phaser's own Pointer flags (`p.wasTouch` / `p.pointerType` on the Phaser Pointer, not on `p.event`).

<details><summary>Sources (3)</summary>

- [A] Phaser Input concepts — official docs (unified mouse/touch pointer system) — https://docs.phaser.io/phaser/concepts/input
- [A] Phaser Pointer API — official docs — https://docs.phaser.io/api-documentation/class/input-pointer
- [A] DragDetect / SM_CXDRAG — Microsoft Learn (mouse-scale threshold baseline) — https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-dragdetect

</details>

**Dead ends this area:** No Phaser GitHub issue or PR adding native getCoalescedEvents support was found (searches surfaced only W3C spec-repo issues and the unrelated phaserjs/phaser#6697 about overlapping HTML elements) — hence the Pointer.event escape-hatch route. No research grounding exists for an 'optimal' diagonal sector half-angle (45° is convention, nobody has published a better number), so GESTURE_DIAG_DEG=45 stays INFERRED on feel alone. The MDN fetch returned 'Limited availability / not Baseline' for getCoalescedEvents but not exact current Safari version numbers, so no per-version support claim is made beyond the Nutrient article's older Chrome 74+/Firefox 67+ figures. The ledger's §S24-H adversarial verify row for §S24-C is still [VERDICT PENDING] — the ANY-stroke=slash rule adjudicated against here is the ledger's current leading reading, not yet skeptic-confirmed.


---

## Enemy AI: attack tokens, cadence, telegraphs  <a name="brawler-ai"></a>

> **Verifier's overall note:** Attacked all six items across sources, repo, and ledger; nothing was refuted. Source integrity is good: all four spot-checked URLs resolve and three of them (Thompson/DOOM, Vossen, GDKeys) say verbatim what is attributed to them, including the exact quotes the research leaned on. The one soft spot is the grade-A GDC Vault talk — real, correctly titled and attributed to Jake Campbell/id Software, but paywalled, so the \"attacks are full-body commitments the AI cannot take back\" framing in item 5 cannot be verified from its public abstract and should not be load-bearing. Repo verification: every ALREADY_DONE is genuinely present (two-case telegraph wired through AI_POINT_BLANK_X; react() seam deleted with a planted-controller chaos test asserting strikeBlocked never fires), and every ADAPT's cited defect is real (ENEMY_SPEED above the measured walk band with no boss speed at all; executeStrike resolving in place with no travel; no test anywhere asserting simultaneous-attacker count or landed-hit inter-arrival). One piece of evidence the research MISSED strengthens item 1 rather than weakening it: src/core/Sim.ts's enemy loop already concedes \"two mobs committing on the same frame is allowed — and A6 measures that it actually happens\", which contradicts the AISeamController header's emergent-turn-taking defence from inside the repo. Ledger verification: gap-H rows for telegraph, telegraph FX, block/parry/dodge, cadence, walk speed and attack geometry all read exactly as quoted, and none appear in the §00b overturned table. Three items are WEAKENED, two of them purely by the §S24-H \"Verify-pass corrections (2026-08-12)\" block that postdates the research — boss run band narrows 255-318 to 255-304 world px/s and the bimodal empty middle is leg-averages-only (item 4), and the dash must be built as a constant-speed ~274 world px/s line-follow plus terminal contact snap with no hand-authored 27/55 stepper (item 5). Item 1's weakening is the research's own: \"nobody ships / it is always\" is an absolute no source supports — Vossen says \"most games\". Priority ordering stands: item 1's gate-first harness is the cheapest high-value next move, and item 6 must wait for item 5 as the research itself argues.

### brawler-ai.1 Attack token / combat-director pattern (DOOM token pool, slot systems)

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Medium · impact High · when: SESSION 24/25 (before any multi-mob encounter polish)

The shipped-game pattern for 'enemies take turns' is an explicit token pool: each attack type has N tokens, an enemy must acquire one before attacking and returns it after; pool size directly caps simultaneous attackers (DOOM 2016, per Kurt Loudy/Jake Campbell GDC material), with token-stealing so the nearest/most-threatening enemy stays active. Practitioner interviews (Vossen, covering DmC/GoW3/Arkham-class melee) confirm the same 'slot system' regulating who strikes when, plus near/far grouping where only the near group may attack. Nobody ships turn-taking as an emergent side effect of independent timers; it is always an explicit, testable cap.

**Why this call for THIS repo:** Ledger gap-H row 'simultaneous attackers' measures TURNS (1, occasionally 2; 8-on-screen hit rate no higher than 1v1) and itself says 'Implement an attack token' — but src/core/AISeamController.ts's header contract asserts 'NO ATTACK TOKEN... EMERGENT from independent AI_THINK_INTERVAL_MS timers plus the narrow AI_MELEE_RANGE gate'. That emergence claim has never been chaos-tested against the measured invariant, and with ENCOUNTER_SIZE=8 mobs (src/config/mobs.ts) all converging into the same 50-px AI_MELEE_RANGE band, each rolling aggression every 500 ms independently, >2 simultaneous attackers is the expected outcome, not turn-taking.

**Implementation note:** Gate first, mechanism second (repo chaos-test rule): add a deterministic 8-mob harness metric asserting (a) max simultaneous telegraph/attack-mode enemies <= 2 and (b) player hits-taken rate ~ 1v1 baseline. If the emergent mechanism fails, add a minimal Sim-owned (or EncounterDirector in core/) SINGLE token — grant to nearest in-range enemy, occasional second grant (rare, per gap-H 'occasionally 2'), release on recover-start. Do NOT copy DOOM's per-attack-type pools or difficulty-scaled pool sizes — kunai is already range+chance gated in AISeamController, and the OG's measured cap is 1(-2), not a tunable. Token lives in core/, zero literals, values in src/config/ai.ts tagged CONTRACT (gap-H).

**⚠ Verifier correction (WINS over the claim above):** Replace "Nobody ships turn-taking as an emergent side effect of independent timers; it is always an explicit, testable cap" with: "Vossen reports that MOST games use an explicit slot/token cap; no source surveyed claims universality, and none tests the emergent-timer alternative." Also loosen the attribution: the token-pool description is Tommy Thompson's Game Developer write-up, which credits Campbell's 2017 GDC talk and Loudy's 2018 talk elsewhere in the piece but does NOT source the token system to either — cite it as Thompson, not "per Loudy/Campbell GDC material". The ADAPT verdict, the gate-first plan, and the single-token design all stand unchanged, and Sim.ts's own "two mobs committing on the same frame is allowed — and A6 measures that it actually happens" comment should be quoted as supporting evidence.

<details><summary>Sources (4)</summary>

- [B] Cyber Demons: The AI of DOOM (2016) — Tommy Thompson, Game Developer — https://www.gamedeveloper.com/design/cyber-demons-the-ai-of-doom-2016-
- [A] GDC Vault — Bringing Hell to Life: AI and Full Body Animation in DOOM (Jake Campbell, id Software) — https://www.gdcvault.com/play/1024186/Bringing-Hell-to-Life-AI
- [B] Enemy design and enemy AI for melee combat systems — Bart Vossen (designer interviews), Game Developer — https://www.gamedeveloper.com/design/enemy-design-and-enemy-ai-for-melee-combat-systems
- [C] UnrealAITokenSystem — DOOM-inspired token system implementation — https://github.com/Lim-Young/UnrealAITokenSystem

</details>

### brawler-ai.2 Two-case telegraph (600 ms approach / 267 ms point-blank), no telegraph VFX

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Medium · when: now (nothing to build; protect in review)

Telegraph literature says anticipation must exceed player reaction (~0.25 s) plus ability-trigger time plus a difficulty buffer, and telegraph length should vary per attack context rather than being one global number (GDKeys 'Anatomy of an Attack'; Hornet case study uses 15-40+ frame telegraphs per move). The OG's measured pair — 0.600 s while closing, 0.267 s point-blank repeat — is exactly a per-context telegraph where the repeat sits at the raw reaction floor.

**Why this call for THIS repo:** src/config/ai.ts AI_TELEGRAPH_MS = { closing: 600, pointBlank: 267 } (CONTRACT-SRC), selected by range at commit time in AISeamController.next() via AI_POINT_BLANK_X; the old single-global >=520 ms telegraph was deleted SESSION13 D8. Ledger gap-H rows 'telegraph, approach attack' and 'telegraph, point-blank repeat' are the source.

**Implementation note:** Two guard rails: (1) gap-H 'telegraph FX: none — pose change only. Do NOT give enemies a drawn stroke line' — the generic best practice of adding warning icons/flash VFX (Arkham-style lightning) would be a fidelity DEFECT here; keep OpponentIntent.telegraph as a pose/windup cue only in the scene. (2) AI_POINT_BLANK_X = 25 is honestly labeled INFERRED — the case boundary is the one unmeasured number; a future video pass could bracket where 600 ms flips to 267 ms.

<details><summary>Sources (2)</summary>

- [B] Keys to Combat Design: Anatomy of an Attack — Nicolas Kraj, GDKeys — https://gdkeys.com/keys-to-combat-design-1-anatomy-of-an-attack/
- [B] Enemy design and enemy AI for melee combat systems — Bart Vossen, Game Developer — https://www.gamedeveloper.com/design/enemy-design-and-enemy-ai-for-melee-combat-systems

</details>

### brawler-ai.3 Blocking the OG doesn't have — the flagged AISeamController blocking is already deleted

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Low · when: now

Defensive reactions (block/parry/dodge) are a per-game design choice, not a melee-AI requirement — Vossen's interviews treat them as optional context reactions. The OG measured ZERO blocks/parries/dodges in ~70 s across ~30 enemies (gap-H clean negative), so modeling any is inventing behavior.

**Why this call for THIS repo:** The orchestrator's FLAG is STALE: the react() seam and its reactMs/reactBlockChance/reactDodgeChance tier fields were deleted in SESSION13 D8 — documented in src/core/OpponentController.ts (react() deletion comment), src/config/ai.ts header, and AISeamController.ts contract; tests/Sim.test.ts plants and asserts strikeBlocked never fires. The remaining 'strikeBlocked' SimEvent type in src/core/Sim.ts exists to power that chaos test's negative assertion.

**Implementation note:** No code change. Report upstream that the flag pre-dates SESSION13 D8. The vestigial 'strikeBlocked' handler in src/game/DuelScene.ts (line ~519) is dead render code — optional one-line cleanup, but keep the Sim event type since the chaos test filters on it.

<details><summary>Sources (2)</summary>

- [B] Enemy design and enemy AI for melee combat systems — Bart Vossen, Game Developer — https://www.gamedeveloper.com/design/enemy-design-and-enemy-ai-for-melee-combat-systems
- [C] Batman: Arkham Design Analysis (Part 1) — Stanislav Costiuc, Game Developer — https://www.gamedeveloper.com/design/batman-arkham-design-analysis-part-1-

</details>

### brawler-ai.4 Gait split + speed retune: trash walks ~128 stage px/s, bosses ONLY run — single ENEMY_SPEED is wrong on both counts

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Low · impact High · when: SESSION 24/25 (A12 gait work is live — §S24-D is its input)

Shipped melee AI differentiates approach behavior per archetype (Vossen: near/far groups, per-enemy approach roles) and full-body animation gait sells the enemy's intent (DOOM GDC animation talk). The OG measured: trash approach gait is WALK ONLY, median 128 stage px/s (105-161 band, gap-H — the earlier 22 px/tick reading was a peak and builds mobs ~25% too fast); duel bosses NEVER walk — all approach/retreat legs are deep-lean runs at 573-716 px/s @1080 = 255-318 world px/s (§S24-D boss correction); both classes dash only as the attack opener.

**Why this call for THIS repo:** src/config/ai.ts ENEMY_SPEED = 0.1417 world px/ms (= 170 stage px/s, provenance comment says 'was 0.17 stage px/ms') sits ABOVE the top of gap-H's measured trash walk band (105-161, median 128) — every mob is ~33% faster than the median — and there is no boss approach speed at all; §S24-D splits gap-H into trash-walks/bosses-run.

**Implementation note:** Split ENEMY_SPEED into MOB_WALK_SPEED ~= 106.7 world px/s (128 stage /1.2, CONTRACT per gap-H) and BOSS_RUN_SPEED in 255-318 world px/s (CONTRACT per §S24-D; note the player's MOVE_RUN_PX_S 288 already sits in-band — reusing it keys the gait picker on speed alone, as §S24-D recommends). Route the class through the AITierParams table or a mob/boss flag on the controller. Update the double-entry in tests/config-values.test.ts in the same commit (config CLAUDE.md ratchet).

**⚠ Verifier correction (WINS over the claim above):** BOSS_RUN_SPEED band: use 255-304 world px/s (573-685 px/s @1080), not 255-318 (573-716). §S24-H verify-pass correction #5 states: "§S24-D: run core quoted 573-685 px/s @1080 (endpoint sensitivity); the bimodal empty-middle claim stands as stated only for whole-leg averages — say so wherever it is cited." So (a) drop the 716 max-medium top, and (b) when justifying the gait picker keying on speed alone, note that the "no leg in 300-500 px/s" empty middle holds for leg AVERAGES only — per-tick instantaneous speeds alternate ~382-435 / ~800-860 inside every run leg, so a per-tick speed threshold would flap. MOVE_RUN_PX_S 288 world (648 @1080) remains in-band under the narrowed range; MOB_WALK_SPEED ~= 106.7 world px/s is unaffected.

<details><summary>Sources (2)</summary>

- [B] Enemy design and enemy AI for melee combat systems — Bart Vossen, Game Developer — https://www.gamedeveloper.com/design/enemy-design-and-enemy-ai-for-melee-combat-systems
- [A] GDC Vault — Bringing Hell to Life: AI and Full Body Animation in DOOM — https://www.gdcvault.com/play/1024186/Bringing-Hell-to-Life-AI

</details>

### brawler-ai.5 Enemy attack = dash-THROUGH (commit ~194 stage px, resolve ~96 px PAST), not a stationary strike inside a 50-px gate

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort High · impact High · when: SESSION 24/25 (it is already tagged as A12.2 input in §S24-E)

DOOM's GDC material frames enemy attacks as full-body animation commitments the AI cannot take back — the attack IS a movement, and readability comes from that committed travel. The OG measured exactly this shape: the enemy attack is a dash-THROUGH using the same mechanic as the player — commit at ~194 stage px, lunge at ~484 stage px/s (~3.3x walk), damage resolving at the END of the dash when the enemy is ~96 stage px PAST the player; the gap-H row states outright 'a radius check cannot reproduce this'.

**Why this call for THIS repo:** Current pipeline is exactly the radius check gap-H forbids: AISeamController only telegraphs inside AI_MELEE_RANGE (|dx|<50 && dy<50 world, CONTRACT-SRC per D8) and the Sim's enemy-strike handler (src/core/Sim.ts, 'Enemy strike: telegraph timing/range are the CONTROLLER's job') resolves in place with no enemy travel — no commit-at-range, no pass-through, no resolve-past-target. Ledger rows: gap-H 'attack geometry' + §S24-E (line-follow + terminal snap model, flagged as A12.2 input).

**Implementation note:** Reconcile the apparent conflict instead of overwriting the CONTRACT-SRC gate: model TWO attack entries mirroring the two telegraphs — (1) approach-attack: commit at ~161.7 world px (194 stage /1.2), 600 ms telegraph, then a lunge (484 stage = ~403 world px/s) THROUGH the player, damage on the terminal tick ~80 world px (96 stage) past; (2) point-blank repeat: inside the 50-px source gate, 267 ms telegraph, same pass-through resolution. Reuse the Sim's existing dash/line-follow machinery (§S24-E stepper) rather than a new mover. This also naturally explains why AI_POINT_BLANK_X exists. Chaos test: a jumping player must evade the terminal tick, not the whole travel (gap-K tension: approach-run deals zero damage, only the dash phase damages).

**⚠ Verifier correction (WINS over the claim above):** Two fixes. (1) Dash model: §S24-H verify-pass correction #4 wins — "model the dash as a constant-speed line-follow ~616 px/s @1080 (~274 world px/s), range ~40-49 px/tick + the terminal contact snap (+139-192 px, one tick) ... build the Sim mover constant-speed at 60 Hz; compare fidelity at capture level (15 fps sampling) ... Do NOT hand-author a 27/55 stepper into core." So drop "reuse the §S24-E stepper" (there is no stepper to reuse) and do NOT hard-code the flat 403 world px/s lunge: the ledger now carries three non-reconciled dash speeds — gap-H's enemy lunge 484 stage px/s (403 world), §S24-E's corrected player line-follow ~274 world px/s, and §S24-D's terminal dash-lunge cluster 1251-1860 px/s @1080 (556-827 world, 1-2 ticks only). Treat "enemy lunge == player dash" as an OPEN question to measure, not an assumption, and model the enemy attack as line-follow + terminal contact snap so the terminal-tick damage falls out of the snap. (2) Demote the DOOM GDC talk to non-load-bearing: it is paywalled and its abstract does not support the attack-commitment framing; the ledger rows alone carry this item.

<details><summary>Sources (3)</summary>

- [A] GDC Vault — Bringing Hell to Life: AI and Full Body Animation in DOOM — https://www.gdcvault.com/play/1024186/Bringing-Hell-to-Life-AI
- [B] Cyber Demons: The AI of DOOM (2016) — Tommy Thompson, Game Developer — https://www.gamedeveloper.com/design/cyber-demons-the-ai-of-doom-2016-
- [B] Keys to Combat Design: Anatomy of an Attack — Nicolas Kraj, GDKeys — https://gdkeys.com/keys-to-combat-design-1-anatomy-of-an-attack/

</details>

### brawler-ai.6 Per-enemy attack cadence: validate against the measured 0.467-1.933 s landed-hit band, not the genre's 2-3 s default

**🔧 ADAPT** · verify: **CONFIRMED** · effort Medium · impact Medium · when: SESSION 25 / Stage 3 (after dash-through geometry lands)

Practitioner guidance says melee enemies typically attack every 2-3 s to keep crowds readable (Vossen's designer interviews) — but the OG is measurably FASTER: landed-hit cadence min 0.467 s, median 0.733 s, mean 0.853 s, max 1.933 s (n=10, gap-H). Adopting the genre default would slow the game ~3x; the cadence must be derived from the measurement and pinned by a harness.

**Why this call for THIS repo:** src/config/ai.ts AITierParams attackMs/recoverMs (180/760, 180/620, 160/480) plus AI_THINK_INTERVAL_MS 500 and AI_RECOVER_JITTER_FRAC 0.35 are spec-era values never reconciled against ledger gap-H's 'cadence (landed hits)' row; the composed inter-hit distribution of the current state machine (telegraph 600/267 + attack ~180 + recover 480-760 jittered + 500 ms decision beats + aggression roll) has no test asserting it lands in 0.467-1.933 s with median ~0.733 s.

**Implementation note:** Add a seeded harness (same pattern as DUEL_TARGET_SECONDS' 24-seed band in tests/harness.test.ts) that runs a stationary-player duel and asserts landed-hit inter-arrival min/median/max inside the gap-H band; then retune recoverMs per tier until green and relabel those values CONTRACT-derived. Do this AFTER the dash-through rework (previous item) — cadence composes with attack travel time, so tuning first would be tuned twice.

<details><summary>Sources (2)</summary>

- [B] Enemy design and enemy AI for melee combat systems — Bart Vossen, Game Developer — https://www.gamedeveloper.com/design/enemy-design-and-enemy-ai-for-melee-combat-systems
- [B] Keys to Combat Design: Anatomy of an Attack — Nicolas Kraj, GDKeys — https://gdkeys.com/keys-to-combat-design-1-anatomy-of-an-attack/

</details>

**Dead ends this area:** No primary Rocksteady source for Arkham's attacker concurrency was found — searches surfaced only community guides (Steam/Fandom/GameFAQs) and Costiuc's third-party analysis; the specific claim 'Arkham enemies attack one at a time by design' could not be grounded to a developer statement, so it is not used as a load-bearing claim. God of War 2018/Ragnarok attack-token specifics: the GDC Vault talk 'Preparing AI Systems for God of War Ragnarok' exists but its indexed summary covers behavior-tree migration/awareness/vertical movement, not tokens — not cited for token claims. DOOM's exact token-grant timing/cadence numbers (from the 2018 'Embracing Push Forward Combat' talk) were not retrievable in text form — only the mechanism, not its millisecond parameters, is grounded; the repo's cadence numbers come from the ledger instead, which is the correct precedence here anyway.


---

## 2D camera: implementing the measured OG behavior  <a name="camera-2d"></a>

> **Verifier's overall note:** Sources are clean — I spot-checked four URLs and all four say what the research attributes to them (Phaser Camera API docs confirm lerp 1 = 'instantly snap' and followOffset 'subtracted from the Camera targets position' and the deadzone 'will not scroll' semantics; the Game Developer 'Scroll Back' reprint defines position-locking, camera-window, dual-forward-focus and edge-snapping; the GDC Vault entry is live and is Itay Keren, 2015, behind a membership wall; the Discourse thread's setBounds+follow clamp is confirmed by samme). The ledger rows (b-6, §S24-C, §S24-G trap 9) all say what is claimed, and neither §00b nor the new §S24-H Verify-pass corrections block (2026-08-12) touches them.\n\nThe research's real failure is a MISSED SOURCE, and it takes down its two REJECT items. Its dead_ends section asserts 'No source of any kind was found describing the original SHS: Duels Flash camera implementation (searching would have been redundant: the repo's P0 experiment already established the payload needs the dead Player.IO backend)'. That conflates 'no playable build' with 'no source'. The payload was DECRYPTED, DECOMPILED AND MINED on 2026-07-25 — docs/research/fidelity/SOURCE_CONSTANTS.md, 189 constants, 152 CONFIRMED / 37 CORRECTED / 0 REFUTED, build v0.717, the same build the videos came from — and §3.4 contains `camera dead-band | screen x 350–450`. So the OG HAS a camera window, the single technique the research spent two items forbidding. The arithmetic seals it: 450 world px through the repo's own transcribed transform (stage = 32 + 1.2·worldX, src/core/viewport.ts + SOURCE_CONSTANTS §3.10) = stage 572 = 55.86% of 1024 = 1072.5 px @1080, landing exactly on the low edge of b-6's measured 1072–1082 pin band. The video measurement and the source constant are the same fact; the research read the window edge as a hard lock. Two second-order consequences: the proposed CAMERA_ANCHOR_X = 448 is both the wrong MODEL and wrong ARITHMETIC (dropping the 32 px pillarbox gives 452, not 448), and the 'unmeasurable' left anchor falls straight out of the symmetric band at 350 world px (44.1%, ~847 px @1080).\n\nRepo checks all passed as stated: `grep -rn -i camera src/` returns exactly one hit (src/config/anim.ts:21 comment) — zero executable camera code anywhere, DuelScene.ts has no camera reference and draws via planPose(..., VIEW); src/config/display.ts holds GAME_WIDTH 1024 / GAME_HEIGHT 576 / WORLD_WIDTH 800 / WORLD_HEIGHT 480 as claimed. Files: /Users/kheshav/kheshav-code/SSHD 1-1/docs/research/fidelity/SOURCE_CONSTANTS.md (§3.4 line 233, §3.10), /Users/kheshav/kheshav-code/SSHD 1-1/docs/research/fidelity/COMBAT_MEASUREMENTS.md (b-6 §364, §S24-A, §S24-G trap 9 §969, §S24-H §1049), /Users/kheshav/kheshav-code/SSHD 1-1/src/core/viewport.ts, /Users/kheshav/kheshav-code/SSHD 1-1/src/game/DuelScene.ts. Standing lesson for the next research pass in this repo: SOURCE_CONSTANTS.md is a mandatory read before declaring any OG mechanic 'video-only ground truth'.

### camera-2d.1 Canon camera smoothing (lerp, deadzone, look-ahead) is a fidelity DEFECT here — the OG is a pure position-lock with edge-snap

**⛔ REJECT** · verify: **WEAKENED — corrections below** · effort Low · impact High · when: Future zone-traversal stage (not SESSION 24/25 duel work)

The 2D-camera canon (Keren's 'Scroll Back' GDC 2015 taxonomy) treats lerp-smoothing, camera-window/deadzone, and look-ahead as the quality techniques, with plain position-locking called 'basic'. But ledger b-6 measures the OG as exactly the basic pair: character pins at ~56% of stage width, camera scrolls at EXACTLY the character's world speed (587 px/s @1080 = 313 stage px/s, no lag observed at the 15Hz sampling floor), hard clamp at zone edges. In Keren's own vocabulary the OG is 'position-locking' + 'edge-snapping' with a shifted anchor — so any smoothing, deadzone, or look-ahead added from best practice diverges from the measured original. Note the 15Hz floor means smoothing with settle time under ~67ms would be invisible, so exact lock is both the parsimonious reading and behaviorally indistinguishable at the resolution the ground truth offers.

**Why this call for THIS repo:** Ledger row b-6 (COMBAT_MEASUREMENTS.md) measures zero smoothing/lag and a hard clamp; per the repo's prime directive, canon smoothing that diverges from the measured OG is a defect. Keren's taxonomy is adopted only as naming, never as parameters.

**Implementation note:** When the camera ships, its spec line should read: position-lock at 56% anchor, zero smoothing, hard clamp — cite b-6. Add a chaos test that plants a lerp<1 and watches the follow lag exceed 0 px/frame (red), then restores exact lock (green).

**⚠ Verifier correction (WINS over the claim above):** The OG camera is Keren's CAMERA-WINDOW + EDGE-SNAPPING, not position-locking. Correct spec line: camera window of world x [350, 450] (CONTRACT-SRC, SOURCE_CONSTANTS.md §3.4), zero smoothing, zero look-ahead, hard clamp at zone edges (b-6). What stays rejected: lerp<1 smoothing and look-ahead. What is now ADOPTED, not rejected: the deadzone/camera-window itself.

<details><summary>Sources (2)</summary>

- [B] Scroll Back: The Theory and Practice of Cameras in Side-Scrollers (Itay Keren, Game Developer) — https://www.gamedeveloper.com/design/scroll-back-the-theory-and-practice-of-cameras-in-side-scrollers
- [A] GDC Vault — Scroll Back (primary talk record) — https://www.gdcvault.com/play/1022243/Scroll-Back-The-Theory-and

</details>

### camera-2d.2 Exact Phaser 3 mapping exists — startFollow(player, false, 1, 1) + followOffset.x = +(0.56−0.5)·width + setBounds — but ADAPT to a core-owned scroll formula instead

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Medium · impact High · when: Future zone-traversal stage

Phaser 3's camera reproduces b-6 natively: startFollow defaults lerpX/lerpY to 1, which the official docs define as 'instantly snap to the target coordinates' (= scrolls at exactly the character's speed); followOffset values are 'subtracted from the Camera target's position', so followOffset.x = +(0.56−0.5)·viewWidth pins the character at 56% (for an 800-wide world view: +48 world px, i.e. scrollX = playerX − 448); setBounds(0,0,zoneWidth,worldHeight) clamps scroll at zone edges, and a forum-confirmed behavior is that the followed target then keeps moving and crosses the screen unaided — precisely b-6's clamped case. HOWEVER, this repo cannot use startFollow as-is: scenes draw at stage pixels via planPose(..., VIEW) (DuelScene.ts, EncounterScene.ts), not at Phaser world coordinates, and camera scroll must feed the screen→world input conversion (stageToWorld), so the scroll is sim state, not render state. The repo-idiomatic implementation is a pure core function: scrollX = clamp(playerX − CAMERA_ANCHOR_X, 0, zoneWidth − WORLD_WIDTH), with CAMERA_ANCHOR_X = 448 world px (CONTRACT, b-6: 1077/1920 ≈ 56.1% of 800 = 448.5) in src/config/, applied in viewport.ts's worldToStage as an extra scroll term.

**Why this call for THIS repo:** src/game/CLAUDE.md's render-only rule plus src/core/viewport.ts (the original's own transform, where screen→world conversion lives) make Sim/core the correct owner of scrollX; Phaser's startFollow would put gameplay-relevant state (input conversion depends on scroll) inside the scene. The Phaser mapping is kept as the cross-check, not the implementation.

**Implementation note:** One pure function in core (cameraScrollX), one CONTRACT constant (448 world px) + zone width per zone in config, viewport gains a scroll-aware position transform (lengths unchanged). Unit-test the three regimes: pinned at 56%, left-edge clamp, right-edge clamp with character crossing screen.

**⚠ Verifier correction (WINS over the claim above):** Replace the single-anchor formula with the source-measured window. Core: scrollX = clamp(scrollX_prev, playerX − CAM_WINDOW_RIGHT, playerX − CAM_WINDOW_LEFT) then clamp(0, zoneWidth − WORLD_WIDTH), with CAM_WINDOW_LEFT = 350 and CAM_WINDOW_RIGHT = 450 world px (CONTRACT-SRC, SOURCE_CONSTANTS.md §3.4). Phaser cross-check becomes startFollow(player, false, 1, 1) + setDeadzone(100, viewHeight) + setBounds — no followOffset. Delete the 448 figure entirely; if anyone re-derives an anchor from video it is 452 world px (stageToWorld of 1077 @1080), because the transform carries a +32 px pillarbox offset.

<details><summary>Sources (3)</summary>

- [A] Phaser 3 Camera API — official docs (startFollow, followOffset, setBounds, setLerp) — https://docs.phaser.io/api-documentation/class/cameras-scene2d-camera
- [C] Phaser Discourse — camera setBounds + follow: camera clamps at bounds while player keeps moving — https://phaser.discourse.group/t/issue-with-camera-setbounds-follow-player/8251
- [B] phaser3-rex-notes — Camera (follow, lerp, setScroll manual control) — https://rexrainbow.github.io/phaser3-rex-notes/docs/site/camera/

</details>

### camera-2d.3 Duels are fixed-camera and the repo already does exactly that — no camera work belongs in DuelScene

**✔️ ALREADY DONE** · verify: **WEAKENED — corrections below** · effort Low · impact Medium · when: now (standing rule)

b-6's scrolling camera was measured during zone running, not duels. The duel footage is explicitly fixed-camera: src/config/anim.ts cites a 'fixed-camera window t=465.0–466.3', and §S24-C's VS-duel catalogue has the player pixel-static up to 20 ticks between exchanges with all movement measured directly in screen px (no camera-subtraction step needed, unlike the b-6 method warning for zone footage). DuelScene.ts contains zero camera calls and renders through the static VIEW transform — which IS the correct 1:1 behavior for duels. The case split: fixed camera in duels (current, correct); 56%-pin scrolling camera only in zone traversal/exploration scenes (does not exist yet).

**Why this call for THIS repo:** src/game/DuelScene.ts has no camera usage (grep confirms) and draws via core/viewport.ts VIEW; ledger §S24-C + the anim.ts 'fixed-camera window' provenance show the OG duel camera is static, so the absence of camera code is the fidelity-correct state, not a gap.

**Implementation note:** Nothing to change. Guard against future 'improvement' PRs adding camera follow to DuelScene — the case split above is the rule.

**⚠ Verifier correction (WINS over the claim above):** Keep the conclusion (no camera code in DuelScene today) but restate the reason: the duel camera is UNMEASURED/CONTESTED, not 'explicitly fixed'. Evidence against a blanket fixed-camera duel rule: §S24-H (2026-08-12) 'The dojo camera is NOT locked past f0094 (~6 px pan by f0096, ~27 px by f0098)' and §S24-A 'drifts exactly with camera pans'. anim.ts's 'fixed-camera window t=465.0–466.3' is a 1.3 s hand-picked measurement window, not a scene-wide camera verdict. So: no camera work in DuelScene until the duel camera is measured, and the standing rule should read 'unproven — do not add follow, do not assert fixed either'.

<details><summary>Sources (1)</summary>

- [A] Phaser 3 Camera API — default camera needs no calls for a static viewport — https://docs.phaser.io/api-documentation/class/cameras-scene2d-camera

</details>

### camera-2d.4 Never use Phaser setDeadzone — the OG has no camera window — **KILLED**

**⛔ REJECT** · verify: **❌ REFUTED by the verify pass** · effort Low · impact Medium · when: Future zone-traversal stage

Phaser's setDeadzone creates a region where the target moves without scrolling the camera (Keren's 'camera-window' technique, the single most common canon recommendation for side-scrollers). b-6 shows the opposite: the character pins at a fixed 56% anchor while moving — screen x≈1072–1082 @1080, a 10 px band that is measurement noise, not a deadzone (a real window would show the character drifting across a wider band before scroll starts). Any deadzone is a measurable divergence at the anchor pin.

**Why this call for THIS repo:** Ledger row b-6: pin band is 1072–1082 @1080 (≤10 px), i.e. hard position-lock; a deadzone contradicts the measurement. Moot in implementation anyway if item 2's core-owned formula is used, but recorded so the Phaser affordance is never reached for.

**❌ Verifier kill:** Killed by the repo's own authoritative source file. docs/research/fidelity/SOURCE_CONSTANTS.md §3.4 (header: '§3 Duels constants (CONTRACT-SRC, v0.717 unless noted)... World space is 800 × 480') lists `camera dead-band | screen x 350–450`. The original game literally has a camera window, read out of its decompiled code, in the same build (v0.717) the video measurements came from — and CONTRACT-SRC outranks video-MEASURED per §0. The item's supporting argument is also inverted: the 1072–1082 @1080 band is not 'noise proving a hard lock', it IS the window edge — 450 world px → stage 32+1.2·450 = 572 → 55.86% of 1024 → 1072.5 px @1080, the exact low end of the measured band. Phaser's setDeadzone ('a rectangular region where, if the target is present, the camera will not scroll', docs verified) is the correct semantic match for the OG, not a forbidden affordance.

<details><summary>Sources (3)</summary>

- [A] Phaser 3 Camera API — setDeadzone semantics — https://docs.phaser.io/api-documentation/class/cameras-scene2d-camera
- [C] Phaser Discourse — working with camera.setDeadzone (practitioner usage) — https://phaser.discourse.group/t/working-with-camera-setdeadzone/10620
- [B] Scroll Back — camera-window taxonomy — https://www.gamedeveloper.com/design/scroll-back-the-theory-and-practice-of-cameras-in-side-scrollers

</details>

### camera-2d.5 Left-travel camera anchor is UNMEASURED — measure before implementing bidirectional scroll

**📐 MEASURE FIRST** · verify: **WEAKENED — corrections below** · effort Low · impact Medium · when: Before the zone-traversal stage's camera work

b-6 measured the 56% pin only 'when running right'. Keren's canon documents 'dual-forward focus' (anchor flips to the opposite side when travel direction reverses, giving look-ahead both ways) as a common side-scroller choice distinct from a single fixed anchor — so the OG running LEFT could pin at ~44% (mirrored), stay at 56%, or transition through a snap/window. These produce visibly different behavior and cannot be inferred. The videos contain leftward zone running (§S24-C notes retreat legs, e.g. beach −178/−271 px), so the measurement is available.

**Why this call for THIS repo:** Ledger b-6 explicitly scopes its anchor to rightward running; the leftward anchor is absent from every ledger row, and per b-6's own method warning the measurement must track a world-fixed feature (signpost), not frame-differencing.

**Implementation note:** One measurement pass over an extended leftward-travel window in either video: record character screen-x while a signpost-class feature scrolls. Also worth capturing in the same pass: anchor behavior at direction REVERSAL (instant vs transitional).

**⚠ Verifier correction (WINS over the claim above):** Downgrade MEASURE_FIRST → cross-check. The leftward anchor is ANSWERED by CONTRACT-SRC: dead-band world x [350, 450] is symmetric about the 400 centre ⇒ running left pins at 350 world px (stage 452 = 44.1% = ~847 px @1080), instant edge-push on reversal, no dual-forward focus. A video pass over a leftward zone-travel window is now the §5 tier-3 confirmation step (predict 847 px @1080), not a prerequisite for implementing. And drop the §S24-C beach −178/−271 cite — those are in-combat legs, not zone running.

<details><summary>Sources (2)</summary>

- [B] Scroll Back — dual-forward focus / direction-dependent anchors — https://www.gamedeveloper.com/design/scroll-back-the-theory-and-practice-of-cameras-in-side-scrollers
- [A] GDC Vault — Scroll Back (primary talk record) — https://www.gdcvault.com/play/1022243/Scroll-Back-The-Theory-and

</details>

### camera-2d.6 Parallax layers ride the camera: boulder layer at 0.73×, plus a fixed screen overlay — implement as per-layer scroll factors in config

**🔧 ADAPT** · verify: **CONFIRMED** · effort Medium · impact Medium · when: Future zone-traversal stage (with zone art)

§S24-G trap 9 is itself a camera measurement: in the A28 forest zone the boulder background layer parallaxes at 0.73× the camera scroll, while the bottom-left mushroom cluster is a screen-fixed overlay (dx=0, corr 1.00). Phaser's native equivalent is per-object scrollFactor (0.73 for the boulder plane, 0 for screen-fixed elements), but since this repo draws in stage px through its own transform (item 2), the idiomatic form is per-layer CONTRACT factors in src/config/ applied as layerScreenX = worldToStage(x) − scrollX·factor·scale at render. Trap 9's warning also carries into any future camera-verification tooling: never anchor camera-motion measurement on a layer whose factor isn't 1.0.

**Why this call for THIS repo:** Ledger §S24-G trap 9 provides the measured factors (0.73× boulder plane, 0 for the mushroom overlay); Phaser scrollFactor is the reference semantics but the repo's stage-px render path (src/core/viewport.ts + DuelScene.ts planPose calls) means the factor multiplies the core-owned scrollX at draw time instead.

**Implementation note:** 0.73 enters config as CONTRACT (trap 9); expect more per-zone layer factors to need measuring when zone art is built — one factor per layer, measured the trap-9 way (correlation against camera dx).

<details><summary>Sources (2)</summary>

- [A] Phaser 3 docs — Cameras concept (scroll and scrollFactor interaction) — https://docs.phaser.io/phaser/concepts/cameras
- [B] phaser3-rex-notes — Camera notes (manual scroll control the layer math hangs off) — https://rexrainbow.github.io/phaser3-rex-notes/docs/site/camera/

</details>

**Dead ends this area:** The official Phaser Camera docs page does not explicitly state that setBounds clamps scroll during an active follow — that claim had to be grounded via the Phaser Discourse thread (moderator confirmation) instead. Keren's article never discusses a zero-smoothing exact-lock camera beyond naming 'position-locking' as a category, so no canon source endorses the OG's exact behavior — the ledger is the only authority for it. No source of any kind was found describing the original SHS: Duels Flash camera implementation (searching would have been redundant: the repo's P0 experiment already established the payload needs the dead Player.IO backend, so the videos/ledger remain the sole ground truth). Repo grep for existing camera code found only two comment-level mentions (anim.ts 'fixed-camera window', progression.ts 'Rebirth Scroll') — zero executable camera code, confirming the duel-is-fixed-camera case empirically.


---

## Flash/AS3 animation semantics for transcription  <a name="flash-anim"></a>

> **Verifier's overall note:** Sources: all 6 distinct URLs are live (200) and the two I fetched in depth say what is attributed to them — Wahlers is a strong match (ratio field is spec'd morph-only but \"also applies to Sprite characters\" and controls playhead reset); the Adobe/airsdk Matrix pages support the a c tx / b d ty layout but never print the x'/y' formula verbatim (the cos/sin comes from the B-grade m2osw page, which labels skew0/skew1 opposite to the SWF spec). No fabricated or dead citation found. Payload-side, every byte-level number in the report reproduced exactly under independent probing (158/1638/24502; 89 r-frames across 25 anims; run_sheathed d=9, death d=38 with 6 matrices; deathbyarrow's unique slot 21), and the ADOPT was proven by actually running the transcriber with both names appended. TWO FINDINGS THE RESEARCH MISSED, both from repo primary sources it never opened: (1) docs/research/fidelity/FIGHTER_ART_IDS.md §3 already documents the r=\"1\" semantics from the decompiled AS3 `reorderLayers` — it is a Z-ORDER OVERRIDE (node-list order, reverse-document, wins over creation order), not a playhead reset; this makes the committed balancedhorizontalslash_partc frame 5 a live rendering defect since composePose always draws in slot order, and it means the flag matters MOST on dense frames, the opposite of the report's reasoning. (2) reference/extracted/payload.xml's SWF header says frameRate=\"24.0\", which refutes the \"15 fps document setting\" premise of the last item and puts src/config/anim.ts's `poseStepMs: 1000/15` (labelled MEASURED off the video cadence the 2026-08-12 verify pass voided) in question for every clip A12.3 is about to transcribe — the highest-value correction in this review. Net: 3 CONFIRMED, 3 WEAKENED, 0 REFUTED; the transcription plan (append run_sheathed + death, add a slot>20 guard, don't renormalize matrices, recreate red wash scene-side) is safe to execute once the r=\"1\" z-order rule is implemented rather than deferred.

### flash-anim.1 Frame-level r="1" flag exists in the payload and the transcriber silently drops it — including in already-committed balancedhorizontalslash_partc

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Low · impact High · when: SESSION 24 A12.3, before transcribing new anims

Probed all 158 anims in reference/extracted/bindata/108_1t4635s0.bin: <f> elements carry an undocumented r="1" attribute on 89 frames across 25 anims (heavyjumpslash_parta x6, gangnam x43, stabattack, launchopponent, ...). One of them is balancedhorizontalslash_partc frame i=5 — an anim ALREADY transcribed into src/config/ogAnims.ts with the flag silently discarded, because transcribeAnims.py's frame regex `<f i="(\d+)"[^>]*>` validates unknown attrs on <n> but swallows anything extra on <f> and <anim>. Flash-era formats have exactly this trap: the PlaceObject2 ratio field was documented as morph-only yet actually controls whether a nested Sprite's playhead resets — undocumented flags carry real playback semantics. In partc, frame 5 is a full 19-node frame so overlay-vs-reset is indistinguishable there, but a wrong guess will show in anims where the r-frame is sparse.

**Why this call for THIS repo:** transcribeAnims.py enforces fail-loud on <n> attrs (`known = set(kv) - {...}` sys.exit) but its <f> regex `<f i="(\d+)"[^>]*>` ignores frame attrs; ogAnims.ts balancedhorizontalslash_partc therefore already lost frame 5's r="1" — the D4 'verbatim, byte-true' contract in the ogAnims.ts header is currently violated.

**Implementation note:** Extend the fail-loud grammar to <f> and <anim> attribute allowlists ({i,r} and {i,d,l}), record the flag verbatim as e.g. `refresh?: boolean` on the frame, and have OgAnimPlayer treat its semantics as an open question: plausible meanings are 'reset carried map before overlay' or a keyframe marker. Grade its behavior against video only where a sparse r-frame exists. Re-run the transcriber + byte-check suite after.

**⚠ Verifier correction (WINS over the claim above):** r="1" is NOT an open question and NOT a playhead-reset/keyframe marker. docs/research/fidelity/FIGHTER_ART_IDS.md §3 already records the AS3 semantics from `§1t59s0§.reorderLayers`: "z-order is creation order (slot 0 at the back) *unless* the frame carries `r="1"`, in which case the node list order wins. Note `§1t59s0§`'s constructor pushes nodes in **reverse** document order." Two consequences the item gets backwards: (1) a dense 19-node frame is where the flag matters MOST, not where it is 'indistinguishable' — the whole layering flips; (2) composePose draws strictly in slot order (`slotShapes.forEach((shapes, slot) => ...)`), so balancedhorizontalslash_partc frame 5 is rendering with the wrong z-order in the committed build TODAY. Implement the documented rule (record the flag, then order parts by node-list order — reverse-document — on r-frames), do not 'grade its behavior against video'.

<details><summary>Sources (2)</summary>

- [B] Hacking SWF – PlaceObject and the Ratio Field (Claus Wahlers, as3swf author) — http://wahlers.com.br/claus/blog/hacking-swf-2-placeobject-and-ratio/
- [A] SWF File Format Specification v19 (open-flash mirror) — https://open-flash.github.io/mirrors/swf-spec-19.pdf

</details>

### flash-anim.2 Flash Matrix column semantics (x'=a·x+c·y+tx, y'=b·x+d·y+ty) — repo's planPose already applies the exact AS3 formula, and /100 is the right divisor

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Medium · when: now (validation)

AS3 flash.geom.Matrix is [a c tx / b d ty / 0 0 1]: x'=a·x+c·y+tx, y'=b·x+d·y+ty; pure rotation is a=cos, b=sin, c=−sin, d=cos, and the SWF-native storage of these terms is 16.16 fixed-point with scale folded in (a=Sx·cos, b=Sy·sin(rotateskew0), c=−Sx·sin(rotateskew1), d=Sy·cos). The payload's x100 integers are therefore NOT a SWF or AS3 convention — they are Lut's exporter quantizing float matrices to 2 decimals. Consequence: the 2-decimal precision loss is IN THE SOURCE, so transcribing verbatim and dividing by 100 at compose time reproduces exactly what the OG engine read back; do not 'recover' precision or renormalize the quads.

**Why this call for THIS repo:** src/core/planPose.ts Mat2 doc comment states and applies exactly 'x' = a·x + c·y, y' = b·x + d·y' with rotation as [cos, sin, −sin, cos]; src/core/composePose.ts divides all four terms by OG_MATRIX_UNITS=100 (src/config/ogPose.ts). The web-grounded AS3 formula matches the code term-for-term, including sign placement.

**Implementation note:** Nothing to change. Death's 6 matrix nodes will flow through the existing path. Keep the 'never renormalize' rule in mind if a matrix quad in death looks non-orthogonal — the OG's own quantization makes slight non-orthogonality authentic.

<details><summary>Sources (3)</summary>

- [A] flash.geom.Matrix — ActionScript 3.0 Reference (airsdk.dev) — https://airsdk.dev/reference/actionscript/3.0/flash/geom/Matrix.html
- [A] Matrix — Adobe AS3 API Reference — https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/geom/Matrix.html
- [B] SWF Appendix A — Matrix geometry (m2osw) — https://www.m2osw.com/swf_appendix_a_matrix

</details>

### flash-anim.3 A12.3 targets probed byte-level: run_sheathed and death parse cleanly under the existing grammar; the whole payload has NO color transforms, motion guides, labels, or scripts

**✅ ADOPT** · verify: **CONFIRMED** · effort Low · impact High · when: SESSION 24 A12.3

Direct probe of 108_1t4635s0.bin: the entire 158-anim / 1638-frame / 24502-node payload contains only 4 element types (animdata, anim, f, n) and <n> carries only i,x,y,r,a,b,c,d — all integer values, no color-transform attrs, no frame labels, no scripts, no guide paths. Flash motion tweens/guides/easing are authoring-time constructs; this exporter baked everything to per-frame keys, so tween semantics never reach the transcriber. run_sheathed: d=9, l="1", 9 dense 19-node frames, rotation-only, no r-flags. death: d=38, non-looping, 38 dense 19-node frames, 6 matrix nodes, no r-flags, standard slot set (0-7, 9-16, 18-20 — same as walk/idle). Both are strictly simpler than the already-shipped balancedhorizontalslash chain (no sparse frames at all).

**Why this call for THIS repo:** scripts/anim/transcribeAnims.py already handles both anims' full grammar — appending 'run_sheathed' and 'death' to its ANIMS list is sufficient (verified by parsing both with the script's own regexes over the real bindata); OgAnimPlayer's dense-frame path is the trivial case of its carry-forward contract.

**Implementation note:** Hit-flash/red-wash coloring seen in video (§S24-F) is NOT in this skeleton data — it is engine-side (AS3 ColorTransform at runtime), so recreate it in the scene layer per the ledger's measured red-wash rows, never by extending the anim grammar. Also transcribe sheathesword/sheathetoidle later for the gait chain — they DO use sparse frames (19,8,8,...) and matrices, still within grammar.

<details><summary>Sources (2)</summary>

- [A] SWF File Format Specification v19 (tags are placement/shape only; tweens are authoring-time) — https://open-flash.github.io/mirrors/swf-spec-19.pdf
- [B] Basics of movie clips — OpenFL Developer's Guide — https://books.openfl.org/openfl-developers-guide/working-with-movie-clips/basics-of-movie-clips.html

</details>

### flash-anim.4 No dedicated 'hit reaction' clip exists in the payload — map §S24-F's three measured reactions to the gotlaunched/downed/brake clip family from video before transcribing

**📐 MEASURE FIRST** · verify: **WEAKENED — corrections below** · effort Medium · impact High · when: SESSION 24 A12.3 (mapping pass before wiring)

The 158-name inventory has no 'hit', 'hurt', 'flinch', or 'react' clip. The reaction-shaped candidates are: gotlaunchedupwards_parta/b/c, gotlauncheddowned + gotlauncheddownedend, downed/downedup/downedup2/flipupfromdowned, brake, defeatedanimationv1/v2, and (attacker-side) launchopponent. The ledger's §S24-F measured exactly three distinct player hit reactions — knock-up LAUNCHER (~270 px vertical, lands 7 ticks), KNOCKDOWN (prone tumble, up by ~6 ticks), knockback slide (−188 px + skid) — which plausibly map to gotlaunchedupwards_*, gotlauncheddowned(+end/downedup), and brake respectively, but that mapping is unverified. Small hits (−7/−12 HP, ~0 displacement) may play NO skeleton reaction at all (hit-stop + red wash only, both engine-side per §S24-F).

**Why this call for THIS repo:** COMBAT_MEASUREMENTS.md §S24-F ('Impacts & the kill beat') already distinguishes the three reactions by displacement and recovery ticks but names no clips; transcribing the wrong candidate (e.g. defeatedanimationv1 for a knockdown) would ship a byte-true clip of the wrong animation — frame-vs-clip matching against reference/frames/session24/ crops is one short video pass.

**Implementation note:** Cheap protocol: play each candidate through the existing OgAnimPlayer + planPose in a scratch scene, screenshot frame silhouettes, and match against the §S24-F evidence crops (LAUNCHER window t=3770-3782 video B). Transcribing ALL candidates first is safe and cheap (grammar handles them); only the name→trigger mapping needs measurement.

**⚠ Verifier correction (WINS over the claim above):** (1) UNITS: the ledger says "small hits (−7/−12 px HP) displace ~0; big hits (−17..−19) displace 40–270 px" — those are HP-BAR PIXEL drops, not HP/damage points. Do not carry "−7/−12 HP" into any damage config. (2) The −188 px knockback figure is contested by the §S24-H Verify-pass corrections (2026-08-12), which re-measure the point-blank hit it derives from: popup reads 17 (not −19), "Honda's displacement is +309 px by plate, not 188", and the f0149–0152 flash is "most plausibly the PLAYER being hit" — i.e. both the magnitude and the actor attribution of the 188 knockback are unsettled. Use ~309 px for the point-blank knockback and treat the player-side −188 slide as unconfirmed until re-measured. (3) Minor: the candidate list omits `deathdowned`, which is also in the payload and is reaction-shaped.

<details><summary>Sources (2)</summary>

- [B] Basics of movie clips — OpenFL Developer's Guide (clip-per-state architecture) — https://books.openfl.org/openfl-developers-guide/working-with-movie-clips/basics-of-movie-clips.html
- [A] flash.display.MovieClip — Adobe AS3 API Reference — https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/flash/display/MovieClip.html

</details>

### flash-anim.5 deathbyarrow introduces slot 21 — the only anim beyond the 0-20 slot map; add a slot-range fail-loud before the death-variant anims

**🔧 ADAPT** · verify: **CONFIRMED** · effort Low · impact Medium · when: SESSION 24/25 (hardening, before enemy death variants)

Payload-wide probe: 157 of 158 anims stay within slots 0-20 with 8/17 absent everywhere (the transcriber's alias guard is validated against the FULL payload, not just the 4 shipped anims). The single exception is deathbyarrow, which adds slot 21 (the embedded arrow). The A12.3 'death' clip is unaffected (standard 19-slot set), but the transcriber has no upper-bound slot guard and composePose/OG_DRESSED_SLOT_SHAPES has no shape for 21 — transcribing deathbyarrow today would pass the transcriber and then throw (or silently drop) at compose time depending on the slot-map lookup path.

**Why this call for THIS repo:** transcribeAnims.py's only slot guard is `if kv["i"] in (8, 17)`; src/config/ogPose.ts documents 'Nodes exist for slots 0-7, 9-16 and 18-20' as an invariant that deathbyarrow's slot 21 breaks — planPose.ts already fail-louds on a missing shape ('slot N needs shape S, which was not supplied'), so the guard belongs at transcription time where the message can name the anim.

**Implementation note:** One-line addition next to the 8/17 guard: fail loudly on slot > 20 with the anim name, so the day deathwitharrow/deathbyarrow is scoped, the error says 'new slot 21 — extend OG_DRESSED_SLOT_SHAPES first' instead of a downstream compose throw. Not needed for A12.3's plain death.

<details><summary>Sources (2)</summary>

- [A] SWF File Format Specification v19 (depth/character-id model behind slot indices) — https://open-flash.github.io/mirrors/swf-spec-19.pdf
- [B] Hacking SWF – PlaceObject and the Ratio Field (depth semantics practitioner) — http://wahlers.com.br/claus/blog/hacking-swf-2-placeobject-and-ratio/

</details>

### flash-anim.6 The 15 fps latch + carry-forward player is the correct Flash playback model — validated against Flash timeline semantics, no changes warranted

**✔️ ALREADY DONE** · verify: **WEAKENED — corrections below** · effort Low · impact Medium · when: now (validation)

Flash semantics confirm all three pillars of the repo's player: (1) the document frame rate is a single global clock — every nested MovieClip advances one frame per stage frame (Flash's default was 12 fps historically, 24 in later versions; a 15 fps document setting like SHS Duels' is a deliberate authoring choice, and the §S24-E 60 fps burst proof of 4-duplicate-frame content blocks confirms zero engine-side interpolation); (2) timeline objects persist at their depth across frames unless explicitly re-placed or removed — sparse frames listing only changed depths ARE the native Flash storage model, so carry-forward is fidelity, not a workaround; (3) whether a nested clip's playhead resets on re-encounter is controlled by the PARENT (the ratio-field mechanism), matching the repo's 'the a→b→c chain policy is the scene's, not the data's' split exactly.

**Why this call for THIS repo:** src/core/ogAnimPlayer.ts implements all three: ANIM_TIMING.poseStepMs whole-step latch (matching ledger §S24-E's 'pure 15 fps stepper, zero interpolation' burst proof), the `carried` Map overlay contract documented in its header with the measured partc example, and `advanceOne`'s hold-last-frame + caller-owned chaining; DuelScene.fighterPose owns the a→b→c policy.

**Implementation note:** Nothing to change. For death (non-loop, d=38) the existing hold-last-frame behavior is also OG-correct: §S24-F shows the kill pose holds until the kill-cam cut, so the scene keeps the finished player parked rather than swapping to idle.

**⚠ Verifier correction (WINS over the claim above):** The OG's document frame rate is 24 fps, not 15. reference/extracted/payload.xml's own SWF header reads `<swf ... frameCount="6" frameRate="24.0" version="17">` — a decompiler-extracted primary source that outranks any video inference. Separately, the §S24-H Verify-pass block (2026-08-12) kills the cited proof outright: "The 60 fps '4-frame content block' defence is VOID — that is a property of the capture (§00), not of the game", and §00 itself already said the 4-frame runs are "a property of the *archival capture*, not necessarily of the Flash game (which likely ran 24–30 fps)". src/config/anim.ts labels `poseStepMs: 1000 / 15` MEASURED off exactly that voided 4-frame video cadence. So: keep the whole-step latch, the carry-forward map and the caller-owned chaining, but re-open the STEP RATE as a live question (24 fps ⇒ walk d=20 runs 0.83 s, not 1.33 s; death d=38 runs 1.58 s, not 2.53 s — a ~60% timing error across every transcribed clip). Minor source note: the kirupa page confirms "the default frame rate is set to 24" in later Flash but did not surface the item's "12 fps historically" half.

<details><summary>Sources (3)</summary>

- [C] Frame Rates in Flash (kirupa) — https://www.kirupa.com/flash/frame_rates.htm
- [B] Hacking SWF – PlaceObject and the Ratio Field (nested-clip playhead control) — http://wahlers.com.br/claus/blog/hacking-swf-2-placeobject-and-ratio/
- [A] SWF File Format Specification v19 (PlaceObject2 move semantics, display list persistence) — https://open-flash.github.io/mirrors/swf-spec-19.pdf

</details>

**Dead ends this area:** No documentation exists anywhere for Lut Games' custom animdata XML grammar (the DefineBinaryData payload is their own exporter format — the x100 quantization and the frame-level r flag are ungoogleable; grounded them by probing the bindata directly instead). Searched for Ruffle-specific docs on sparse-keyframe carry-forward — nothing direct beyond the SWF spec's PlaceObject2 move semantics. No SHS Duels technical postmortem or Explosive Barrel dev blog surfaced in any search. The moldstud/animationclub frame-rate results were content-farm grade and discarded; kirupa retained only for the Flash-default history claim it actually supports.


---

## Determinism & replay  <a name="determinism"></a>

> **Verifier's overall note:** Adversarial pass complete. Sources: 4 of 4 spot-checked URLs are live and say what is attributed (MDN warning quoted verbatim; Bugzilla 1775254 title/status/fdlibm detail confirmed; bryc discussion #21 confirms the 1/3-of-uint32 and ~16GB claims in Ettinger's own words; Rune confirms hypot+atan2 on the patch list and shipped mulberry32). The one grade-C source (conor.computer) reproduces the exact Math.tan(1e16) values claimed — no fabrication found anywhere. Ledger: correct as stated — docs/research/fidelity/COMBAT_MEASUREMENTS.md has NO RNG/determinism rows, neither §00b CORRECTIONS nor the new §S24-H 'Verify-pass corrections (2026-08-12)' block touches this area, so nothing here rests on an overturned row. Repo: every adjudication anchor exists, but three items overstate their evidence. The one finding that would cause real harm if acted on is item 5's input surface — Sim.requestStanceSwitch and Sim.setAutoSlash are player-driven mutators called from DuelScene.ts and are missing from the proposed tape, so a tape built to that spec would desync on any stance switch. Second-most consequential: item 2's claim that four call-site swaps delete the sim's whole cross-engine risk surface is false, because DrawnStroke.resample and gesture's polylineLength both sum Math.hypot distances on paths that decide where cuts land and whether a stroke is a launch or a jump — sums of square roots that squared-radius compares cannot rescue. Items 1 and 4 survive intact.

### determinism.1 IEEE-754 + - * / are bit-portable across engines; Math transcendentals are spec-level 'implementation-approximated' — so the seed-7 fingerprint is per-engine-build, not cross-browser

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Medium · when: now

ECMAScript exactly specifies +, -, *, / as IEEE 754-2019 roundTiesToEven (bit-identical across V8/JSC/SpiderMonkey), but Math.sin/cos/tan/pow/exp/hypot/atan2 (and per the spec text even sqrt/cbrt) are 'implementation-approximated' — accuracy is unspecified. MDN's official warning: different browsers give different results, and even the same engine on a different OS/arch can differ. Real 2022-2025 divergences: Math.tan(1e16) returns -1.2451734357184066 in Node(V8) vs -1.245173435718406 in Safari(JSC); Firefox bug 1775254 tracks Math.pow inaccuracy for large exponents vs Chrome. V8 and SpiderMonkey both fork fdlibm but maintain separate forks, so convergence is coincidental, not guaranteed, and can change between engine VERSIONS too.

**Why this call for THIS repo:** tests/determinism.test.ts already scopes its claim correctly: it compares two child `vitest run` Node processes plus the parent — all the SAME V8 build — and never asserts cross-engine equality. Nothing in the repo currently promises a browser-portable fingerprint, so there is no defect to fix today.

**Implementation note:** Optional 1-line hardening: add a comment in tests/determinism.test.ts stating the fingerprint is engine-build-scoped. Note the fold in tests/utils/duel-bot.ts quantizes via Math.round(x*256), which absorbs sub-1/256px float noise except exactly at .5 ties — helpful, but not ULP-proof, so don't advertise it as cross-engine armor.

<details><summary>Sources (4)</summary>

- [A] MDN Math — 'precision is implementation-dependent' note — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
- [B] uhyo — How accurate are numerical calculations in JavaScript? (spec analysis: which ops are implementation-approximated) — https://zenn.dev/uhyo/articles/javascript-math-accuracy?locale=en
- [A] Bugzilla 1775254 — Improve Math.pow accuracy for large exponents (SpiderMonkey vs V8 fdlibm forks) — https://bugzilla.mozilla.org/show_bug.cgi?id=1775254
- [C] Conor Deegan — Falcon and floating point (Math.tan(1e16) Node vs Safari divergence) — https://www.conor.computer/blog/falcon-and-floating-point

</details>

### determinism.2 The ONLY transcendentals on gameplay-state paths are Math.hypot and Math.atan2 — replaceable with spec-exact compares when cross-engine determinism is actually needed

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Low · impact High · when: Stage 5-6 (PvP/replay stage)

Math.hypot is on the implementation-approximated list (Rune's shipped non-determinism audit names it; V8/JSC/SpiderMonkey use different overflow-safe algorithms), and it sits on real sim paths: Sim.stepKunai (deflect radius), projectile.ts projectileHits (hit radius) and spawnProjectile (aim normalization), vec.len, ringGeometry. gesture.ts uses Math.atan2 for the slash/jump angle threshold — gesture classification IS gameplay. The portable fix needs no lookup tables: squared-distance comparison (dx*dx+dy*dy <= r*r) uses only exactly-rounded ops and is bit-deterministic everywhere; the atan2 threshold becomes a cross-multiplied slope compare (|dy| vs K*|dx|, K a precomputed config constant). Aim normalization can use Math.sqrt(x*x+y*y): spec text calls sqrt implementation-approximated, but IEEE 754 requires correctly-rounded sqrt and engines use the hardware instruction — the practical residual risk is far below hypot's documented divergence.

**Why this call for THIS repo:** Worthwhile ONLY at the replay/PvP stage — today the fingerprint never crosses engines (tests/determinism.test.ts is same-V8 by design), so doing it now is churn. When adapted, the new threshold constant must live in src/config/ per the zero-numeric-literal rule in src/core/CLAUDE.md, and the swap must be behavior-pinned (deflect/hit outcomes unchanged on the 24-seed harness).

**Implementation note:** Concrete diff when the stage arrives: Sim.stepKunai and projectileHits switch to squared-radius compares (add DEFLECT_RADIUS_SQ / PROJECTILE_HIT_RADIUS_SQ to config); gesture.ts replaces Math.atan2(|dy|,|dx|) >= thresh with |dy| >= SLOPE_THRESHOLD * |dx|. This deletes the entire cross-engine risk surface of the sim in ~4 call sites.

**⚠ Verifier correction (WINS over the claim above):** Strike 'ringGeometry' from the sim-path list — it is imported only by src/core/artPlan.ts (art/render). And do NOT claim the squared-compare swap 'deletes the entire cross-engine risk surface of the sim in ~4 call sites'. Two further Math.hypot paths feed gameplay state and are NOT fixable by squared comparison, because they sum square roots before comparing to a threshold: (1) DrawnStroke's `resample()` accumulates `dist(prev, cur)` against RESAMPLE_SPACING, and its output points ARE the cutPoints handed to resolveSlash — every landed hit depends on them; (2) gesture.ts's launch-vs-jump split is `polylineLength(points) < LAUNCH_FLICK_MAX_LEN`, where src/core/geometry.ts polylineLength sums `dist()` → vec.len → Math.hypot. A cross-engine-lockstep prerequisite therefore also needs an exact-op length policy for stroke resampling and polyline length (e.g. fixed-point/integer accumulation, or an exactly-rounded Math.sqrt-based dist), not just the four radius/angle swaps.

<details><summary>Sources (3)</summary>

- [B] Rune — Making JS deterministic for fun and glory (Kevin Glass; shipped deterministic JS rollback netcode; hypot/atan2 on the patch list) — https://developers.rune.ai/blog/making-js-deterministic-for-fun-and-glory
- [B] uhyo — JavaScript math accuracy (which ops are exact: + - * / roundTiesToEven; sqrt caveat) — https://zenn.dev/uhyo/articles/javascript-math-accuracy?locale=en
- [A] MDN Math — implementation-dependent precision warning — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math

</details>

### determinism.3 Lookup tables / polynomial sin-cos inside core: REJECT — every Math.sin/cos in the repo is render-side pose math that never feeds gameplay state

**⛔ REJECT** · verify: **WEAKENED — corrections below** · effort High · impact Low · when: never (re-open only if pose output ever feeds hitboxes)

The standard deterministic-JS remedy (Rune patches Math functions platform-wide) targets sims whose STATE flows through transcendentals. Here Math.sin/cos live only in anim.ts (stride/breathe oscillators), planPose.ts and composePose.ts (part rotation for drawing) — outputs are drawn by scenes, never written into FighterState, and the duel fingerprint folds only hp and pos.x (tests/utils/duel-bot.ts). Table/polynomial sin in core would add config-constant sprawl, introduce visible pose-fidelity risk (the 1:1 mandate), and buy zero determinism.

**Why this call for THIS repo:** tests/utils/duel-bot.ts's fingerprint fold covers hp/pos.x only, and grep confirms every core Math.sin/cos call site (anim.ts, planPose.ts) is pose/animation output consumed by render-only scenes — so tables/polynomials would violate 'simplest change wins' and risk the 1:1 pose fidelity for no determinism gain.

**⚠ Verifier correction (WINS over the claim above):** Two fixes to the claim text (verdict unchanged): (1) src/core/composePose.ts contains NO Math.sin/cos at all — its only Math reference is `Math.PI` in a degrees→radians conversion at the rotationRad line. The core sin/cos sites are src/core/anim.ts (walk swing/bob, breathe) and src/core/planPose.ts (`const cos = Math.cos(part.rotationRad)` / `const sin = Math.sin(...)`); render-side sin/cos also live in src/game/DuelScene.ts, src/game/banners.ts and src/game/samurai.ts. Add that anim.ts's easeOutCubic uses Math.pow — another implementation-approximated op, likewise render-only. (2) The duel-bot fold is not 'hp and pos.x' only: it folds `ev.type.length` for every drained event plus player.hp, enemy.hp, player.pos.x AND enemy.pos.x each frame — pos.y and Focus are the actual omissions.

<details><summary>Sources (2)</summary>

- [B] Rune — Making JS deterministic (why they patch Math: state flows through it — the precondition this repo does not meet) — https://developers.rune.ai/blog/making-js-deterministic-for-fun-and-glory
- [B] Gaffer On Games — Floating Point Determinism (only sim-state-affecting float paths need determinism treatment) — https://gafferongames.com/post/floating_point_determinism/

</details>

### determinism.4 mulberry32 quality: author-flagged bias (can't emit ~1/3 of uint32 values, ~16GB useful output) is irrelevant at duel scale — keep it, do not swap to sfc32/SplitMix32

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Low · when: now (no action)

Tommy Ettinger (mulberry32's author) now discourages it for serious use: the output function isn't reversible, so it is not equidistributed — about 1/3 of all uint32 values are unreachable and patterns emerge after ~16GB of output; he recommends SplitMix32, and bryc recommends sfc32/jsf32 for JS. BUT it passes gjrand/PractRand within its range, and Rune shipped mulberry32 in production JS rollback netcode. This sim draws a handful of numbers per swing/AI beat — a 2-minute duel consumes thousands of draws, ~6 orders of magnitude under the 2^32 period, and damage-roll granularity (minDamage + range) makes the missing-values bias unobservable.

**Why this call for THIS repo:** src/core/rng.ts implements the architecture-mandated algorithm ('Spec-fixed' header in src/config/rng.ts: 'injected mulberry32 RNG' — never balance the magic numbers), pinned against an independent reference copy in tests/rng.test.ts; swapping generators would invalidate every committed fingerprint and the 24-seed harness for zero gameplay-visible gain.

**Implementation note:** Only revisit if a future feature consumes randomness at statistical scale (procedural generation, loot tables across thousands of runs). Note mulberry32 is fully integer/bitwise (imul, shifts, one division by 2^32) — every op is exactly specified, so the RNG stream itself IS bit-portable across engines; the portability risk lives downstream (item on hypot/atan2), not in the RNG.

<details><summary>Sources (3)</summary>

- [A] bryc/code discussion #21 — 'Mulberry32 no longer recommended by its author' (Tommy Ettinger, primary source) — https://github.com/bryc/code/discussions/21
- [B] bryc — PRNGs.md (JS PRNG quality/benchmark survey; gjrand results) — https://github.com/bryc/code/blob/master/jshash/PRNGs.md
- [B] Rune — Making JS deterministic (shipped mulberry32 for rollback in production) — https://developers.rune.ai/blog/making-js-deterministic-for-fun-and-glory

</details>

### determinism.5 Replay for PvP = seed + input tape recorded at the Sim boundary in sim-frame indices, with periodic state checksums for desync detection

**✅ ADOPT** · verify: **WEAKENED — corrections below** · effort Medium · impact High · when: Stage 5-6 (PvP/replay stage)

Deterministic lockstep practice (Fiedler; Supreme Commander verified it across millions of installs): transmit/record only inputs plus the seed, re-simulate locally, and emit periodic state checksums so any float/engine drift is caught at the frame it happens instead of as a mystery divergence later. The Sim is already shaped for this: setPlayerIntent / queueSkill / applyStroke are the ONLY mutation entry points, advance() owns the fixed-60Hz accumulator, and duel-bot.ts's FNV-style fold is a ready-made checksum. Two gaps to close when the stage arrives: (1) scenes seed with mulberry32(Date.now()) (DuelScene.ts, EncounterScene.ts) — the seed must be captured into the tape header along with an engine/build tag, per the per-engine-fingerprint finding; (2) inputs must be keyed by sim.frame (the Sim's own clock), never wall-clock ms, or the MAX_FRAME_MS clamp and accumulator make playback timing-dependent.

**Why this call for THIS repo:** Sim.advance()'s owed-frames accumulator and the single-entry-point input surface (Sim.setPlayerIntent, Sim.queueSkill, Sim.applyStroke) mean an input tape slots in with no core rewrite; tests/utils/duel-bot.ts already demonstrates the record-and-checksum shape the tape needs.

**Implementation note:** Tape format when built: header {seed, engineTag, configHash} + ordered [{frame, intent|stroke points|skill}] + checksum every N frames (reuse the duel-bot fold, but ALSO fold focusUnits — Sim.ts's own comment records that the hp/pos-only fold missed a real Focus-spend ordering bug). If PvP must be CROSS-BROWSER lockstep rather than replay-on-same-engine, the hypot/atan2 ADAPT item becomes a prerequisite.

**⚠ Verifier correction (WINS over the claim above):** Replace 'setPlayerIntent / queueSkill / applyStroke are the ONLY mutation entry points' with the actual public mutation surface of Sim: setPlayerIntent, queueSkill, applyStroke, PLUS `requestStanceSwitch(id, to)` and `setAutoSlash(on)` — both are real player inputs wired in src/game/DuelScene.ts (requestStanceSwitch at the two stance-cycle handlers, setAutoSlash at the toggle handler) and both mutate sim state — plus `beginCombat()` as the intro→fighting transition. A tape recording only the three originally named methods cannot reproduce any duel in which the player cycled stance or toggled AUTO SLASH. Tape entries must therefore be {frame, kind: 'intent'|'stroke'|'skill'|'stance'|'autoSlash'|'beginCombat', payload}.

<details><summary>Sources (3)</summary>

- [B] Gaffer On Games — Floating Point Determinism (input tapes, checksums, lockstep; Supreme Commander shipped it) — https://gafferongames.com/post/floating_point_determinism/
- [B] Rune — Making JS deterministic (predict-rollback over seeded mulberry32 in JS, shipped) — https://developers.rune.ai/blog/making-js-deterministic-for-fun-and-glory
- [C] GameDev.net — Is JavaScript floating-point math deterministic? (lockstep-in-browser practitioner thread) — https://www.gamedev.net/forums/topic/609592-is-javascript-floating-point-math-deterministic/

</details>

**Dead ends this area:** Fetching tc39.es/ecma262 multipage directly returned only the table of contents (page too large to extract the normative 'implementation-approximated' text verbatim) — the spec-level claim is grounded via uhyo's section-by-section spec analysis plus MDN's official warning instead. Found NO evidence that V8/JSC/SpiderMonkey have converged on bit-identical Math results (the opposite: Safari-vs-Node Math.tan divergence and the separate fdlibm forks in Bugzilla 1775254 show live divergence in 2022-2025). No COMBAT_MEASUREMENTS.md ledger rows touch RNG/determinism (the OG's Flash AVM2 float behavior was never measured and cannot be, per the P0 no-offline-build finding), so all adjudication anchors are repo symbols. Note: the task's REQUIRED READING named src/core/composePose.ts for cos/sin — that file exists but the actual gameplay-relevant transcendentals turned out to be Math.hypot in Sim.ts/projectile.ts and Math.atan2 in gesture.ts, found via grep; cos/sin (anim.ts, planPose.ts, composePose.ts) are all render-side.


---

## Phaser 3.90 performance  <a name="phaser-perf"></a>

> **Verifier's overall note:** Seven items attacked: 1 REFUTED, 3 WEAKENED, 3 CONFIRMED. The headline kill is item 1, the only item flagged 'now' — its premise is a Phaser fact that expired in v3.85.1. The research agent read the 3.70 release notes correctly but never checked whether the flip survived to the pinned version; Phaser reverted `roundPixels` to false and deleted the uRoundPixels uniform in 3.85.1, and v3.90.0's src/core/Config.js confirms `GetValue(renderConfig, 'roundPixels', false, config)`. The repo already renders sub-pixel, so the one-line 'fix' plus gate re-run is wasted motion on a false diagnosis. Generalisable lesson: for a versioned dependency, a release note is evidence about the release it announces, not about the version installed — read node_modules/the pinned tag's source. Sourcing quality was otherwise good but not uniform: the Graphics concepts page and the 3.70 notes contain their attributed quotes verbatim and issue #6509 is real, while the core-config API page was cited twice for default values it does not state (values true, citation wrong). The three REJECT/ALREADY_DONE items are the most solid work here — I re-ran the greps and read the interfaces, config constants (BLOOD_COUNT = 9) and CLAUDE.md quotes myself, and all three hold exactly as written. Item 7 identifies a genuine, correctly-diagnosed hotspot but reaches for ledger rows as fidelity cover, and one of them (§00) explicitly disclaims the inference in its own closing sentence — a §00-misuse the ledger's new 2026-08-12 verify block independently calls out as VOID. Its remedy should be re-pointed at §S24-B's render-side truncation, which the ledger actually mandates and which avoids mutating the point array the Sim consumes.

### phaser-perf.1 roundPixels silently defaults TRUE since Phaser 3.70 — set it explicitly to false to match the Flash sub-pixel vector look — **KILLED**

**🔧 ADAPT** · verify: **❌ REFUTED by the verify pass** · effort Low · impact Low · when: now (one-line config + gate re-run)

Phaser 3.70+ flipped the GameConfig default to roundPixels: true (pixel-snap via a uRoundPixels shader uniform in the texture pipelines); the repo's GameConfig in src/main.ts sets no render block, so on phaser@3.90 the game is running with rounding ON without anyone having chosen it. It affects texture-based objects (all the Text nameplates/HUD labels, several positioned at fractional x like 799 + i*73.5 and repositioned per frame to track fighters), NOT Graphics paths. Community reports (GitHub #6509, discourse) document jitter from the rounding when objects track smooth positions. The OG is a Flash vector game rendered sub-pixel; snapping is a divergence from source behavior, not an optimization.

**Why this call for THIS repo:** src/main.ts GameConfig sets only type/width/height/backgroundColor/transparent/scale — no render block, so the 3.70+ roundPixels:true default is active by accident; DuelScene.drawFighters repositions texts.nameplate/playerName every frame from worldToStage output, exactly the tracking pattern the jitter reports describe, and the OG source is sub-pixel Flash vector.

**Implementation note:** Add render: { roundPixels: false } (and leave antialias at its default true — correct for the Flash vector look) to the Phaser.Game config in src/main.ts, then re-run the in-browser fidelity gate (?fidelity=auto / __fidelity.run()) since text glyph placement can shift by <1px and the gate samples real canvas pixels.

**❌ Verifier kill:** The central factual premise is stale by five minor versions. The 3.70 flip was REVERTED in Phaser v3.85.1: the official v3.85.1 release notes state verbatim 'The Game Config roundPixels property now defaults to false.' and 'The uRoundPixels uniform has been removed from the Single, Multi and Mobile vertex shaders.' I confirmed this against the version the repo actually pins (package.json: "phaser": "^3.90.0") by reading v3.90.0's own src/core/Config.js: `this.roundPixels = GetValue(renderConfig, 'roundPixels', false, config);`. So the repo is ALREADY running sub-pixel — rounding is OFF, and it is off by default, not by accident. The proposed ADAPT (add `render: { roundPixels: false }`) is a literal no-op, the stated mechanism (uRoundPixels shader uniform in the texture pipelines) no longer exists on 3.90, and the diagnosis 'the game is running with rounding ON without anyone having chosen it' is simply false. The repo-side observations are all real (src/main.ts has no render block; DuelScene createHudTexts places chi numerals at `.text(799 + i * 73.5, 497, ...)`; drawFighters repositions texts.nameplate/playerName every frame from worldToStage at DuelScene lines ~750/752) — but they support nothing, because the default they are premised on inverted in 3.85.1. Source #1 (3.70 release notes) says what is attributed to it, and issue #6509 ('Camera jitter when camera rounds pixels') is real and on-topic; they are just describing a behaviour Phaser has since removed.

<details><summary>Sources (4)</summary>

- [A] Phaser v3.70.0 release notes (roundPixels default true, GPU rounding, texture pipelines only) — https://github.com/phaserjs/phaser/releases/tag/v3.70.0
- [B] Camera jitter when camera rounds pixels — phaserjs/phaser issue #6509 — https://github.com/photonstorm/phaser/issues/6509
- [C] roundPixels causing jittering with startFollow — Phaser Discourse — https://phaser.discourse.group/t/roundpixels-is-causing-jittering-with-cameras-main-startfollow/11880
- [A] Phaser.Core.Config API (render defaults: antialias true, batchSize 4096, powerPreference 'default') — https://docs.phaser.io/api-documentation/class/core-config

</details>

### phaser-perf.2 Bake the static arena Graphics into a runtime-generated texture (generateTexture) — the one atlas-adjacent idea that fits the invariant

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Low · impact Low · when: later — only on a measured frame-time problem (EncounterScene crowd growth is the likely trigger)

Official Phaser docs: Graphics are decomposed into polygons every render under WebGL — 'expensive processes, especially with complex shapes' — and the blessed fix for Graphics that never change is generateTexture(), which bakes the command list into a GPU texture drawn as one quad. DuelScene.drawArena() emits ~60+ fills/ellipses/rects (bamboo rows, canopy, mounds, lanterns) into a persistent Graphics that Phaser re-tessellates every frame despite never changing. generateTexture is a canvas/GPU runtime texture — no image FILE is created, so the no-asset-files invariant is untouched.

**Why this call for THIS repo:** DuelScene.drawArena() is drawn once in create() into a Graphics that is re-tessellated per frame; src/game/CLAUDE.md bans image asset FILES, not runtime textures, so a generateTexture bake is invariant-compatible — but the 55/55 fidelity gate (src/game/fidelity.ts) samples real canvas pixels, and a texture round-trip can shift antialiased edges, so the bake must be gate-verified.

**Implementation note:** In drawArena(): draw to the Graphics, g.generateTexture('arena', GAME_WIDTH, GAME_HEIGHT), g.destroy(), this.add.image(0,0,'arena').setOrigin(0). Only do this if a profile (renderer.snapshot timing or DevTools GPU trace) shows draw cost at all — at 2 fighters the scene almost certainly holds 60fps already, so treat as insurance for the crowd EncounterScene, then re-run __fidelity.run() for 55/55.

**⚠ Verifier correction (WINS over the claim above):** src/game/CLAUDE.md's invariant is two clauses, not one: 'All art is procedural vector (Graphics), all audio is WebAudio-synthesized. No image/audio asset files, ever.' The item cites only the second clause ('bans image asset FILES, not runtime textures'). A generateTexture bake replaces the arena Graphics GameObject with an `add.image(...)` on the display list, which touches the FIRST clause. The art stays procedurally authored, so this is a defensible reading — but it is a rule interpretation, not a rule the item already satisfies. Treat the bake as requiring an explicit owner ruling or a one-line CLAUDE.md amendment ('runtime-generated textures from Graphics are permitted; asset files are not') BEFORE implementation, alongside the 55/55 gate re-run the item already flags.

<details><summary>Sources (3)</summary>

- [A] Phaser Graphics concepts page (official performance guidance, generateTexture) — https://docs.phaser.io/phaser/concepts/gameobjects/graphics
- [A] Graphics API — Phaser Help — https://docs.phaser.io/api-documentation/class/gameobjects-graphics
- [C] Phaser Performance Optimization Guide (pooling, atlases) — https://generalistprogrammer.com/tutorials/phaser-performance-optimization-guide

</details>

### phaser-perf.3 Texture-atlas advice: inapplicable — DuelScene has zero Sprites, and file atlases are banned anyway

**⛔ REJECT** · verify: **CONFIRMED** · effort Low · impact Low · when: n/a

Atlas advice (pack sprites into one sheet to cut texture swaps and draw calls; practitioner post cites ~300KB download savings and fewer batch flushes) presumes texture-based Sprites. This scene renders fighters as Earcut-triangulated polygon fills (drawPlan in OgArtScene.ts) plus Graphics strokes — there are no textures to atlas, so batch-flush-from-texture-swap, the problem atlases solve, cannot occur here. File-based atlases would additionally violate the procedural-art invariant; the permitted runtime-texture variant is already covered by the arena-bake item.

**Why this call for THIS repo:** src/game/CLAUDE.md: 'All art is procedural vector (Graphics)… No image/audio asset files, ever'; DuelScene contains only Graphics (fx, hud) and one-time Text objects — grep confirms zero Sprite/Image/atlas usage in src/, so there is nothing for an atlas to batch.

<details><summary>Sources (2)</summary>

- [B] How I optimized my Phaser 3 action game in 2025 — franzeus (practitioner postmortem) — https://franzeus.medium.com/how-i-optimized-my-phaser-3-action-game-in-2025-5a648753f62b
- [A] Phaser Graphics concepts page — https://docs.phaser.io/phaser/concepts/gameobjects/graphics

</details>

### phaser-perf.4 Object pooling: the expensive pattern it prevents is already absent — FX records are plain JS objects, not GameObjects

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Low · when: n/a

Pooling advice (Groups with maxSize, setActive(false) recycling; practitioner measured ~15% fps from pooling bullets/enemies) targets games creating/destroying hundreds of GameObjects per second, where each destroy tears down WebGL/display-list state and churns GC. This repo never creates GameObjects at runtime: droplets/trails/redStrokes are plain {x,y,vx,vy,bornAt} literals in arrays, all Text objects are created once in createHudTexts(), and EncounterScene deliberately draws damage-popup digits as Graphics blocks instead of Text objects. At BLOOD_COUNT-scale allocation (~a dozen small literals per hit) modern-GC pressure is negligible; adding a pool would be pure churn.

**Why this call for THIS repo:** DuelScene's Droplet/Trail interfaces are plain data (no Phaser objects), spawnBlood pushes literals and update() filters them; createHudTexts() builds every Text exactly once; EncounterScene's comment at its digit renderer ('Drawn as a scaling block per digit rather than a Text object') shows the GameObject-churn trap was already designed out.

<details><summary>Sources (3)</summary>

- [B] How I optimized my Phaser 3 action game in 2025 — franzeus (pooling gains) — https://franzeus.medium.com/how-i-optimized-my-phaser-3-action-game-in-2025-5a648753f62b
- [C] Bullet pools (Phaser 3) — Phaser Discourse — https://phaser.discourse.group/t/bullet-pools-phaser-3/7502
- [C] Phaser Performance Optimization Guide — https://generalistprogrammer.com/tutorials/phaser-performance-optimization-guide

</details>

### phaser-perf.5 powerPreference / batchSize tuning: no-op at this scene's load — leave defaults

**⛔ REJECT** · verify: **WEAKENED — corrections below** · effort Low · impact Low · when: n/a

Defaults on 3.90: powerPreference 'default', batchSize 4096 (vertex quads per flush). batchSize matters only when a single batch exceeds 4096 quads — this scene submits two tessellated fighters, ~40 droplet circles, and HUD rects, orders of magnitude below the limit, and Graphics style changes flush batches anyway so a bigger buffer buys nothing. powerPreference: 'high-performance' forces the discrete GPU on dual-GPU laptops — a battery cost with zero benefit for a scene this light; the practitioner postmortem even found WebGL→Canvas FASTER on a weak device, underlining that GPU-side tuning is not where this class of game is bound.

**Why this call for THIS repo:** src/main.ts already pins type: Phaser.WEBGL deliberately (comment: art direction relies on WebGL-only Graphics gradients — so the postmortem's Canvas switch is also off the table), and DuelScene's entire draw list (2 planPose fighters + droplets + HUD) is nowhere near a 4096-quad batch; there is no measured frame deficit anywhere in the ledger to justify either flag.

**⚠ Verifier correction (WINS over the claim above):** Do not cite https://docs.phaser.io/api-documentation/class/core-config for the default values — I fetched it and it documents roundPixels, antialias, batchSize, powerPreference and physics as options WITHOUT stating any default. Cite phaser v3.90.0 `src/core/Config.js` instead, which I verified directly and which does support every number claimed: `batchSize` default 4096, `powerPreference` default 'default', `antialias` default true (and, fatally for item 1, `roundPixels` default FALSE).

<details><summary>Sources (3)</summary>

- [A] Phaser.Core.Config API (render defaults) — https://docs.phaser.io/api-documentation/class/core-config
- [B] How I optimized my Phaser 3 action game in 2025 — franzeus — https://franzeus.medium.com/how-i-optimized-my-phaser-3-action-game-in-2025-5a648753f62b
- [C] rex notes: Phaser game config reference — https://github.com/rexrainbow/phaser3-rex-notes/blob/master/docs/docs/game.md

</details>

### phaser-perf.6 Arcade physics settings: nothing to tune — the repo intentionally has no physics engine

**⛔ REJECT** · verify: **CONFIRMED** · effort Low · impact Low · when: n/a

Standard Arcade advice (fixedStep/fps tuning, useTree spatial index off for few bodies, Group-based overlap culling, only-check-active-bodies) configures Phaser's physics world. This repo runs zero Phaser physics: collision, movement, and projectiles are owned by the pure fixed-60Hz Sim with injected RNG, and grep shows no physics key in the GameConfig and no arcade import anywhere in src/. Introducing Arcade to get its 'optimizations' would move gameplay state into the scene layer and desync from the deterministic 24-seed harness.

**Why this call for THIS repo:** Root CLAUDE.md invariant: 'Phaser scenes are render-only… Sim (fixed 60Hz, injected mulberry32 RNG) owns everything'; src/main.ts GameConfig has no physics block and DuelScene draws sim.projectiles (kunai) from Sim state — any Arcade adoption violates the render-only invariant and the duelSetup determinism seam.

<details><summary>Sources (2)</summary>

- [C] Shooting bullets in Phaser 3 using Arcade Physics Groups — CodeCaptain — https://codecaptain.io/blog/game-development/shooting-bullets-phaser-3-using-arcade-physics-groups/696
- [A] Phaser.Core.Config API (physics config surface) — https://docs.phaser.io/api-documentation/class/core-config

</details>

### phaser-perf.7 The one real per-frame hotspot in THIS scene is stroke segment count, not entity count — thin drag points at the input boundary

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Low · impact Medium · when: SESSION 24/25 — pairs naturally with the §S24 stroke-lifecycle work already in flight

Official docs flag complex Graphics paths as the expensive case under WebGL (per-frame polygon decomposition). DuelScene.strokePinched issues a separate lineStyle+beginPath+moveTo+lineTo+strokePath per segment; a long drag stores up to 2048 world points (pointermove cap), and each live frame draws the stroke TWICE (body+core), plus every fading redStroke twice more and every trail twice — worst case tens of thousands of path commands in one frame during multi-stroke fades. This is the only load in the scene that scales unboundedly with player input. Pointer events arrive at display rate (up to 120+ Hz), far above any drawing fidelity the OG could show: the ledger's 15Hz content floor and the §S24-B reach cap both bound how much stroke detail the original ever rendered, so distance-based point decimation (drop points closer than ~2-3 world px) loses nothing measurable while collapsing worst-case segment count ~5-10x.

**Why this call for THIS repo:** DuelScene pointermove already caps at dragPoints.length < 2048 but stores EVERY move event; strokePinched then draws per-segment for the live drag, redStrokes, and trails each frame — and COMBAT_MEASUREMENTS §00's '15 Hz content floor' plus §S24-B's rendered-stroke reach cap prove the OG never carried sub-pixel-dense stroke detail, so decimation cannot cost fidelity. Must be parameterized as a min-distance threshold in src/config/ (CONTRACT/INFERRED-tagged), not a magic number in the scene.

**Implementation note:** In the pointermove handler, skip the push when hypot(w - lastStored) < a new config/combat threshold (~2-3 world px, tag INFERRED, note the §S24-B reach cap as the bounding measurement). DrawnStroke and Sim.applyStroke consume the same array, so verify the 24-seed duel harness and gesture-classification tests stay green — decimation changes stroke.points fed to the Sim, which is why the threshold must be small and config-owned.

**⚠ Verifier correction (WINS over the claim above):** Strike the '15 Hz content floor' from the justification entirely. COMBAT_MEASUREMENTS §00 ends with the opposite of what is claimed: 'This is a property of the *archival capture*, not necessarily of the Flash game (which likely ran 24–30 fps). It bounds what we can ever learn from video, not what the original did.' The new §S24-H verify-pass block (2026-08-12) reinforces this against exactly this style of argument: 'The 60 fps "4-frame content block" defence is VOID — that is a property of the capture (§00), not of the game.' Second, §S24-B caps rendered stroke LENGTH (120–280 px @1080 = 53–124 world px; HEAVY band corrected 146–260 → 146–~275 by the same verify block), which says nothing about point SPACING along the stroke — it cannot license decimation. Re-ground the item on §S24-B's actual build consequence instead, which is a fidelity fix that happens to cut segment count as a side effect: 'The lie the owner saw is RENDER-side: DuelScene draws the raw drag uncapped. Render the truncated polyline bold (+ optionally the excess as the faint tail).' Truncating the DRAWN polyline to reachFor(...) is ledger-mandated, touches only the render path, and leaves stroke.points fed to Sim.applyStroke untouched — whereas the proposed min-distance decimation mutates the array the Sim consumes and therefore carries determinism risk the ledger does not authorise.

<details><summary>Sources (3)</summary>

- [A] Phaser Graphics concepts page ('expensive processes, especially with complex shapes') — https://docs.phaser.io/phaser/concepts/gameobjects/graphics
- [A] Graphics API — Phaser Help — https://docs.phaser.io/api-documentation/class/gameobjects-graphics
- [B] How I optimized my Phaser 3 action game in 2025 — franzeus (profile-then-fix method) — https://franzeus.medium.com/how-i-optimized-my-phaser-3-action-game-in-2025-5a648753f62b

</details>

**Dead ends this area:** No Phaser 3.90-specific performance changelog entries found beyond the 3.70 roundPixels default flip (3.90 searches surfaced nothing render-perf-relevant). Found no forum/postmortem thread specifically quantifying Graphics strokePath per-segment cost — that item rests on the official 'complex shapes are expensive' guidance plus repo code reading. Did not fetch GitHub issue #6874 (roundPixels image scaling) — title from search results only. Arcade physics research was cut short deliberately: grep proved no physics engine exists in src/, making deeper sourcing pointless. The franzeus postmortem's headline finding (Canvas 30% faster than WebGL on a Pixel 5) could not be adopted: src/main.ts pins Phaser.WEBGL explicitly because the art direction needs WebGL-only Graphics gradients.


---

## Procedural vector rendering performance  <a name="canvas-vector-perf"></a>

> **Verifier's overall note:** Research output is substantially honest: 5 of 6 distinct cited URLs fetched — all live, and both A-grade Phaser docs quotes are verbatim-exact, which is the load-bearing evidence for items 1, 3, 4, and 5. The one fabrication-shaped detail found is the '~60 draw calls on a Phaser 3.24 tilemap' anecdote, present in neither source cited for it (item 2 weakened, not killed). Repo readings were accurate except one: the claim that composePose recomputes at 60Hz 'when idle' — the idle pose is composed once in create(); the genuine always-on 60Hz waste is planPose + Earcut. Ledger check: no cited row is overturned — §00b corrects f-8/f-9/e-7/a-6 (none relied on here) and §S24-H corrects a-2/a-5/gap-G/gap-H (also not relied on); the 15fps latch survives as the committed repo contract (ANIM_TIMING.poseStepMs), though §00 notes 15fps is the CAPTURE's sampling floor and the original game likely ran 24-30fps — irrelevant to the cache math, which keys off our own latch. The adversarial attack on the plan-cache memo key failed: all four anims open with full 19-node frames, so (anim, frameIndex, mirrored) fully determines the pose despite the carry-forward contract.

### canvas-vector-perf.1 Pre-rendering the ~40 transcribed animation frames to textures

**📐 MEASURE FIRST** · verify: **CONFIRMED** · effort Medium · impact Low · when: Stage 2+ only if profiled red

Official Phaser docs confirm the cost model: under WebGL, Graphics geometry is 'decomposed into polygons' every render and this is 'expensive... especially with complex shapes'; the documented remedy for shapes that stop changing is baking to a texture (generateTexture / DynamicTexture), after which the object batches like any sprite. But no evidence exists that THIS scene misses frame budget: 2 fighters x ~20 shapes at 1024x576 on desktop is a small workload, and the one practitioner thread found (iOS WebGL perf collapse) traced to a Safari/WebKit bug, not Graphics tessellation - platform variance dominates, so optimizing unmeasured is churn.

**Why this call for THIS repo:** DuelScene.drawFighters runs the full composePose->planPose->drawPlan pipeline into one cleared Graphics at 60Hz with 894 tests green and zero recorded frame-time complaints; nothing in COMBAT_MEASUREMENTS or RESUME_HERE documents a perf deficit. CLAUDE.md's 'simplest change wins' bans speculative optimization; adopt textures only if the profile protocol (next item) shows the fighter path exceeding ~2ms/frame median or game.loop.actualFps < 60 on the worst target machine.

**Implementation note:** If measurement ever justifies it: bake once in create() via DynamicTexture (3.60+; RenderTexture is now a shim over it), one texture per (anim, frameIndex) - facing comes free via sprite flipX, replacing planPose mirror math at draw time only. Runtime baking from procedural vectors does NOT violate src/game/CLAUDE.md's 'no image/audio asset FILES' (nothing on disk), but see the fidelity-hazard item before touching it.

<details><summary>Sources (3)</summary>

- [A] Phaser.GameObjects.Graphics - official API docs (perf guidance quoted) — https://docs.phaser.io/api-documentation/class/gameobjects-graphics
- [B] phaser.discourse.group - WebGL optimization steps (as3mbus/Kosmoon, shipped App Store game) — https://phaser.discourse.group/t/webgl-optimization-steps-and-or-canvas-feature-limitations/11026
- [B] Phaser 3.60 DynamicTextures changelog — https://github.com/phaserjs/phaser/blob/v3.60.0/changelog/3.60/DynamicTextures.md

</details>

### canvas-vector-perf.2 Exact profiling protocol before any rendering change

**✅ ADOPT** · verify: **WEAKENED — corrections below** · effort Low · impact Medium · when: SESSION 24/25

The decision needs four instruments: (1) performance.mark/measure pairs around composePose, planPose, and drawPlan, read in the Chrome DevTools Performance panel (Main-thread flame chart shows self-time; Timings track shows the marks; GPU track shows whether the bottleneck is even CPU-side) with 4x/6x CPU throttling to simulate weak hardware; (2) Phaser's own game.loop.actualFps + game.loop.delta sampled over a scripted 30s duel; (3) Spector.js browser extension to capture one frame's WebGL command list - draw-call count and buffer-upload volume (Phaser 3 does not expose draw-call counts itself; a practitioner measured ~60 calls on a Phaser 3.24 tilemap this way); (4) if raster cost is suspected, the panel's Advanced-paint-instrumentation checkbox (equivalent tracing category: disabled-by-default-devtools.timeline plus gpu). Adopt-thresholds must be written down before capturing.

**Why this call for THIS repo:** Repo precedent already exists for exactly this pattern: src/game/fidelity.ts runs an autonomous in-page gate behind ?fidelity=auto with a localStorage verdict (reference-browser-gate-polling memory), and the build-the-tooling memory pre-authorizes building the gate when a check recurs. A ?perf=auto harness that plays a scripted duel and reports median/p95 update() ms + actualFps is a one-file addition to that seam. NOTE from that memory: hidden tabs freeze rAF - the capture tab must stay foreground or the numbers are garbage.

**Implementation note:** Marks go at the DuelScene call sites (scene layer - core/ stays pure and literal-free). Record: per-frame ms for fighterPose+planPose+drawPlan, droplet/trail stroke count, actualFps min/median. Run once idle, once mid-slash-spam (worst case: both fighters slashing + 2048-point drag stroke + trails). Decision rule: fighter path > ~2ms median or actualFps dips below 60 -> proceed to plan-cache item; GPU-bound or draw-call explosion -> texture item.

**⚠ Verifier correction (WINS over the claim above):** Drop the '~60 calls on a Phaser 3.24 tilemap' anecdote (found in no cited source) and drop/relabel the generalistprogrammer citation (page exists but never mentions Spector.js). Keep Spector.js on the strength of discourse 11026 alone. Also: the ?fidelity=auto + localStorage wiring lives in src/main.ts, not src/game/fidelity.ts (which exports the harness).

<details><summary>Sources (3)</summary>

- [A] Chrome DevTools Performance features reference — https://developer.chrome.com/docs/devtools/performance/reference
- [B] phaser.discourse.group - Spector.js recommended for Phaser draw-call investigation — https://phaser.discourse.group/t/webgl-optimization-steps-and-or-canvas-feature-limitations/11026
- [C] Phaser performance optimization guide (draw-call counting with Spector.js) — https://generalistprogrammer.com/tutorials/phaser-performance-optimization-guide

</details>

### canvas-vector-perf.3 Plan cache keyed by (anim, frameIndex, mirrored) - remove the 60Hz recompute of a 15fps pose

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Medium · impact Medium · when: Stage 2, only after profiling

The measured OG latch means the pose can only change 15 times/sec, yet the repo recomputes composePose (map rebuild + per-node validation), planPose (trig + per-point matrix transform of every contour), and Phaser.Geom.Polygon.Earcut (per holedFill op, inside drawPlan) at 60Hz - a >=4x pure-CPU redundancy, worse when idle (pose never changes, recompute still runs whenever position moves). Caching pose-LOCAL DrawOps and Earcut index buffers per (animName, frameIndex, mirrored) - roughly 45 frames x 2 facings - leaves the emitted vertices byte-identical, so the pixel fidelity gate cannot move. This is the docs' 'batch-friendly Graphics' path without the texture hazards.

**Why this call for THIS repo:** Grounded in OgAnimPlayer + ANIM_TIMING.poseStepMs (1000/15): the latch quantizes to whole 15fps frames, so (current, frameIndex, mirrored) fully determines the pose - a perfect memo key. But planPose currently bakes the stage origin into every point, so the cache must store origin-at-(0,0) plans and add the anchor at draw time (or via Graphics x/y). That is a real refactor of planPose's contract with tests behind it (a11Mirror.test.ts pins ops), hence ADAPT not ADOPT - and gated on the profiling item showing CPU-bound scripting, per 'simplest change wins'.

**Implementation note:** Cheapest first slice if profiling is only mildly red: memoize just the Earcut call in drawPlan keyed by the holedFill op's identity per cached frame - Earcut is the only per-frame package call and its inputs are pure geometry. Cache lives scene-side (core/ cannot hold state with literals anyway). Invalidation: none needed - transcribed frame tables are immutable config.

**⚠ Verifier correction (WINS over the claim above):** composePose is already cached for the idle pose (composed once in create(), both facings); the 60Hz composePose recompute happens only while walking or slashing. The always-on 60Hz redundancy is planPose + Earcut (drawPlan), which run every frame in every state. Frame count is exactly 40 transcribed frames (not ~45), so the cache is ~41 keys x 2 facings including the static dressed idle.

<details><summary>Sources (2)</summary>

- [A] Phaser.GameObjects.Graphics - 'decomposed into polygons... expensive' (the cost being cached away) — https://docs.phaser.io/api-documentation/class/gameobjects-graphics
- [A] Phaser Graphics WebGL batching behavior (official docs, grouping advice) — https://docs.phaser.io/api-documentation/class/gameobjects-graphics

</details>

### canvas-vector-perf.4 Texture baking is a pixel-fidelity hazard on this stack (WebGL1 no-AA framebuffers, DPR blur)

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Low · impact High · when: rider on any future texture work

Two documented rendering differences make baked textures NOT pixel-equivalent to the current direct-to-canvas geometry: (1) official DynamicTexture docs: 'Under WebGL1, a FrameBuffer, which is what this Dynamic Texture uses internally, cannot be anti-aliased' - Phaser 3's renderer is WebGL1-class, so baked fighter edges come out aliased while the live-drawn ones are smoothed by the main framebuffer's MSAA; (2) long-standing Phaser issue #4408: RenderTexture output is blurry whenever game resolution != 1 (devicePixelRatio handling), a known trap for vector-crisp art on retina displays. Either one shifts edge pixels.

**Why this call for THIS repo:** The repo's verification machinery is pixel-based: OgArtScene.captureArea + inkBox measure inked bounds against planned bounds to sub-pixel deltas, and the 55/55 fidelity gate (src/game/fidelity.ts) pins the render. Aliased or DPR-blurred baked frames would fail exactly those probes - or worse, pass them while looking softer than the OG videos, violating the videos-are-ground-truth invariant. If the texture route is ever taken, bake at devicePixelRatio-scaled resolution, run the full fidelity gate plus an owner LOOK on a cropped/upscaled fighter before merging.

**Implementation note:** This item is the mandatory rider on the pre-rendering item: it converts 'bake to textures' from a drop-in docs recipe into a gated experiment. The plan-cache item dodges the hazard entirely because it keeps emitting geometry to the main (antialiased) framebuffer.

**⚠ Verifier correction (WINS over the claim above):** Rest the hazard on the WebGL1 no-AA docs sentence alone. Reframe #4408 as historical evidence that framebuffer output and DPR interact badly, not a live trap: since Phaser 3.16 the resolution config is hardcoded to 1, so 'blurry whenever game resolution != 1' cannot manifest on phaser@3 today. Keep the practical advice (bake at devicePixelRatio-scaled size, rerun the 55/55 gate + owner LOOK).

<details><summary>Sources (3)</summary>

- [A] Phaser.Textures.DynamicTexture - official docs (WebGL1 aliasing limitation quoted) — https://docs.phaser.io/api-documentation/class/textures-dynamictexture
- [A] phaserjs/phaser issue #4408 - RenderTexture blurry when resolution != 1 — https://github.com/phaserjs/phaser/issues/4408
- [C] phaser.discourse.group - Texts and Graphics looking low-res/blurry/jagged — https://phaser.discourse.group/t/texts-and-graphics-game-objects-looking-low-res-blurry-or-jagged/15335

</details>

### canvas-vector-perf.5 Draw-call batching by grouping Graphics work

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Low · when: now (nothing to do)

Official guidance: under WebGL, Graphics uses its own shader that batches drawing operations; keep Graphics objects grouped and avoid interleaving other object types, since every type switch flushes the batch (Phaser 3.50+ multi-texture batching covers up to ~16 textures per draw call for sprite content).

**Why this call for THIS repo:** DuelScene already draws strokes, trails, droplets, BOTH fighters (via drawPlan), kunai, and the kill-beat flash into the single this.fx Graphics (depth 10), and all HUD chrome into the single this.hud Graphics (depth 20); Text objects sit at depths 21-22 above both, so the two Graphics passes are contiguous and batch. The arena is a third Graphics drawn once in create() and never cleared. No regrouping work exists to do.

**Implementation note:** Only watch-item: if a future change interleaves a Text or Sprite at a depth between fx ops, the batch splits - keep the depth bands (arena < fx < hud < texts) as they are.

<details><summary>Sources (2)</summary>

- [A] Phaser.GameObjects.Graphics - official API docs (batching guidance) — https://docs.phaser.io/api-documentation/class/gameobjects-graphics
- [B] Phaser CE/3 advanced rendering - multi-texture batching background — https://phaser.io/tutorials/advanced-rendering-tutorial/part2

</details>

**Dead ends this area:** No source found showing Phaser 3.90 changed Graphics tessellation or batching vs 3.60-3.80 (the 3.90 'technical preview' news is about the Phaser 4-lineage renderer, not shipped 3.90 Graphics internals) - so 3.90-specific claims could not be grounded and were omitted. No published benchmark quantifying per-frame Graphics tessellation cost in ms for ~20-shape figures was found; every source speaks qualitatively ('expensive'), which is itself the argument for MEASURE_FIRST. Phaser 3 exposes no built-in draw-call counter (searched; only third-party Spector.js / Phaser DevTools extension). The practitioner perf thread's root cause was an iOS 15 WebKit bug (230749), not Graphics - a caution that field reports of 'Graphics is slow' often misattribute platform regressions.


---

## WebAudio architecture (SESSION 25 prep)  <a name="webaudio-core"></a>

> **Verifier's overall note:** All six items survive adversarial verification: 6 of the cited URLs were fetched live and each supports the exact claim attributed to it (including the two verbatim web.dev quotes and the Phaser 3.60 interrupted-state changelog line); every repo citation (phaser ^3.90.0, src/game + src/config CLAUDE.md wording, Sim.ts comment, 894-test count, empty audio grep of ledger and src/config) was reproduced with real commands; both reference videos verifiably contain audio tracks. Two flags for SESSION 25 execution, neither invalidating a verdict: (1) src/config/CLAUDE.md's landmine \"Don't invent constants that 'feel missing'… Stage specs name every constant\" means the SESSION 25 kickoff must explicitly NAME the audio constants (compressor threshold/ratio, per-class envelope params) before src/config/audio.ts is written, or the new file trips the repo's own rule; (2) node_modules is permission-denied here, so Phaser's exact gesture-event list and lack of a latencyHint argument were verified against Phaser's published docs, not source — trivially checkable in-session before coding.

### webaudio-core.1 Do not build a custom unlock layer — reuse Phaser's WebAudioSoundManager context, locked flag, and UNLOCKED event

**✅ ADOPT** · verify: **CONFIRMED** · effort Low · impact High · when: SESSION 25

2024-2026 autoplay reality: Chrome creates AudioContext 'suspended' until a user gesture and requires resume() (or auto-resumes when a source starts post-gesture); Safari/iOS behaves the same and additionally enters an 'interrupted' state on tab-switch/headphone changes; Firefox gates via user-configurable autoplay blocking but the gesture-resume pattern covers it. Phaser 3.60+ already implements ALL of this: it listens for touchstart/touchend/mousedown/mouseup/keydown to resume, fires Phaser.Sound.Events.UNLOCKED, detects 'suspended' OR 'interrupted' in its update loop and auto-resumes (the iOS 17/18 interruption fix), and exposes the raw AudioContext as this.sound.context. Recommended init/unlock pattern for our 100%-synthesized SFX: (1) at scene create, grab ctx = (this.sound as Phaser.Sound.WebAudioSoundManager).context; (2) gate SFX with `if (this.sound.locked) this.sound.once(Phaser.Sound.Events.UNLOCKED, enable); else enable();` (3) DROP (never queue) SimEvent SFX that fire while locked — replaying stale hits after unlock sounds wrong; (4) belt-and-braces: on pointerdown, `if (ctx.state !== 'running') ctx.resume()` for iOS 'interrupted' edge cases the manager's update loop hasn't caught yet.

**Why this call for THIS repo:** Stack invariant in CLAUDE.md pins phaser@3 (3.90 > 3.60, so all listed fixes are in); src/game/CLAUDE.md already routes SFX through scenes ('drain SimEvent[] into FX/SFX'), so the sound manager the scenes already own is the natural host — a parallel hand-rolled AudioContext would duplicate Phaser's unlock/interrupted machinery and fight it.

**Implementation note:** One new src/game/ module (e.g. AudioBus) built lazily at scene create. No game-config change needed — Phaser accepts a custom context via game config audio.context, but there is no reason to supply one.

<details><summary>Sources (5)</summary>

- [A] Phaser WebAudioSoundManager API (context, locked, unlock, destination) — https://docs.phaser.io/api-documentation/class/sound-webaudiosoundmanager
- [A] Phaser 3.60 Sound changelog (suspended/interrupted auto-resume, iOS14+ unlock fix) — https://github.com/phaserjs/phaser/blob/v3.60.0/changelog/3.60/Sound.md
- [A] Chrome for Developers: Web Audio, Autoplay Policy and Games — https://developer.chrome.com/blog/web-audio-autoplay
- [B] Ourcade: Web Audio Best Practices for Games in Phaser 3 (practitioner) — https://blog.ourcade.co/posts/2020/phaser-3-web-audio-best-practices-games/
- [A] MDN Web Audio API best practices (create/resume inside a user gesture) — https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices

</details>

### webaudio-core.2 Master-bus graph: synth voices → sfx GainNode → DynamicsCompressorNode → this.sound.destination

**🔧 ADAPT** · verify: **CONFIRMED** · effort Low · impact High · when: SESSION 25

Canonical game-audio graph: each one-shot voice connects to a category/master GainNode, then a DynamicsCompressorNode, then the destination. The compressor matters specifically for STACKED SFX — a duel frame can emit multiple SimEvents at once (slash + hit + grunt), and summed synth voices easily exceed 1.0; the compressor 'lowers the volume of the loudest parts of the signal' to prevent hard digital clipping without hand-tuning a worst-case master gain (web.dev: picking a static master gain for all game states 'is more of an art than a science' — compression is the robust fix). For this repo the tail of the chain should be Phaser's this.sound.destination (which feeds its masterVolumeNode → masterMuteNode) so Phaser's global volume/mute and pauseOnBlur keep working over our synth bus.

**Why this call for THIS repo:** The generic pattern ends at ctx.destination; adapt the tail to Phaser's this.sound.destination (WebAudioSoundManager) so the scene-owned manager keeps authority. Repo idiom also forces re-parameterization: every gain/threshold/ratio number must live in a new src/config/audio.ts tagged INFERRED (src/config/CLAUDE.md CONTRACT/INFERRED rule) — none may sit inline in src/game/.

**Implementation note:** Default DynamicsCompressorNode params are fine to start (threshold -24dB, ratio 12) but write them into src/config/audio.ts explicitly as INFERRED so they are visible and tunable. Per-category sub-buses (sfx / ui) are cheap and give independent volume config.

<details><summary>Sources (3)</summary>

- [A] web.dev: Developing game audio with the Web Audio API (master gain + compressor for stacked sounds) — https://web.dev/articles/webaudio-games
- [A] MDN DynamicsCompressorNode — https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode
- [A] Phaser WebAudioSoundManager API (destination, masterVolumeNode, masterMuteNode) — https://docs.phaser.io/api-documentation/class/sound-webaudiosoundmanager

</details>

### webaudio-core.3 latencyHint 'interactive' is already the default — do not add context-construction code for it

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Low · when: SESSION 25

MDN: AudioContext latencyHint defaults to 'interactive', which optimizes for the lowest possible output latency (the games case); 'balanced' and 'playback' trade latency for power. Because Phaser constructs the context and the default is already the value we want, there is nothing to configure; the browser may not honor the hint anyway — the actual figure is readable at ctx.baseLatency if SESSION 25 wants to log it once as evidence.

**Why this call for THIS repo:** Satisfied by the platform default on the context Phaser's WebAudioSoundManager creates (this.sound.context, per stack invariant phaser@3 in CLAUDE.md) — adding a custom audio.context to game config solely to restate the default would be churn.

**Implementation note:** Optional: one console.debug of ctx.baseLatency behind the existing fidelity flag as a measurement receipt; nothing else.

<details><summary>Sources (1)</summary>

- [A] MDN AudioContext() constructor (latencyHint values and default) — https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/AudioContext

</details>

### webaudio-core.4 Scheduling: anchor every envelope to ctx.currentTime; the 25ms/100ms lookahead scheduler is NOT needed for event-driven one-shots

**🔧 ADAPT** · verify: **CONFIRMED** · effort Low · impact Medium · when: SESSION 25

The 'Tale of Two Clocks' lookahead pattern (setInterval ~25ms scheduling everything due in the next ~100ms against the audio clock) exists to keep RHYTHMIC/sequenced audio jitter-free — it decouples a musical timeline from main-thread jitter. Our SFX are fired the instant a SimEvent is drained; there is no future timeline to look ahead into, so a lookahead scheduler adds latency and machinery for nothing. What DOES carry over: (a) never use setTimeout/Date.now for any audio-rate timing; (b) schedule attack/decay/release with setValueAtTime / linearRampToValueAtTime / exponentialRampToValueAtTime and osc.start()/stop() at explicit ctx.currentTime-relative times, computed once per voice; (c) always schedule stop() so one-shot nodes free themselves.

**Why this call for THIS repo:** The SimEvent drain in src/game/CLAUDE.md ('call Sim.advance, drain SimEvent[] into FX/SFX') plus Sim's fixed 60Hz accumulator (Sim.ts, '/** Typed events drained by the scene each frame and turned into FX/SFX. */') means every SFX trigger is same-frame and immediate — adopt the audio-clock discipline, reject the lookahead loop as scope creep unless a music layer is ever measured into scope.

**Implementation note:** Voice helper signature: play(now = ctx.currentTime) { osc.start(now); gain.gain.setValueAtTime(peak, now); gain.gain.exponentialRampToValueAtTime(floor, now + decay); osc.stop(now + decay); }. All decay/peak numbers from src/config/audio.ts.

<details><summary>Sources (2)</summary>

- [A] web.dev: A tale of two clocks — scheduling Web Audio with precision — https://web.dev/articles/audio-scheduling
- [B] IRCAM webaudio-tutorials: Timing and Scheduling (currentTime granularity, lookahead numbers) — https://ircam-ismm.github.io/webaudio-tutorials/scheduling/timing-and-scheduling.html

</details>

### webaudio-core.5 AudioWorklet is NOT needed for one-shot synthesized SFX — native node graph only

**✅ ADOPT** · verify: **CONFIRMED** · effort Low · impact Medium · when: SESSION 25

AudioWorklet exists to replace ScriptProcessorNode for CUSTOM per-sample DSP (procedural streams, custom effects) by running JS on the audio rendering thread. One-shot game SFX built from OscillatorNode + GainNode envelopes + BiquadFilterNode already execute natively ON the audio thread — there is no main-thread audio work to move, so a worklet adds a module-loading async step, a second JS context, and test complexity for zero benefit. Noise-based SFX (hits, whooshes) need no worklet either: fill a short AudioBuffer from a Float32Array at runtime and play it via AudioBufferSourceNode — that is still 100% synthesized, no audio file. The only trigger to revisit: a continuous procedural stream (wind/music synthesis) that native nodes cannot express.

**Why this call for THIS repo:** Adopting the 'skip AudioWorklet' recommendation: the CLAUDE.md invariant is 'WebAudio-synthesized SFX only' — a runtime-generated noise AudioBuffer satisfies 'no audio files' (src/game/CLAUDE.md: 'No image/audio asset files, ever'), and a worklet module would also complicate the Vitest suite (894 green) with an audio-thread boundary nothing needs.

**Implementation note:** Generate each noise buffer once at bus init with the injected-RNG discipline in spirit (audio is render-side, so Math.random is legal in src/game/ — but keep it out of src/core/ per the config-purity test).

<details><summary>Sources (3)</summary>

- [A] MDN: Background audio processing using AudioWorklet (what it is for) — https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_AudioWorklet
- [A] Chrome for Developers: Audio Worklet is now available by default (design intent: replace ScriptProcessorNode) — https://developer.chrome.com/blog/audio-worklet
- [B] Soledad Penadés: Using AudioWorklets to generate audio (2025, practitioner — worklets are for generated streams, with real ergonomic costs) — https://soledadpenades.com/posts/2025/using-audioworklets-to-generate-audio/

</details>

### webaudio-core.6 OG SFX parameter values must come from the videos' audio tracks — the ledger has zero audio rows today

**📐 MEASURE FIRST** · verify: **CONFIRMED** · effort Medium · impact High · when: SESSION 25 (before any src/config/audio.ts values are tagged CONTRACT)

Every generic synth recipe (laser zap, coin blip, 'juicy hit') found in game-audio guides is a preset divergent from the OG by construction. The two 1080p longplays carry the complete OG soundscape (slash, hit, parry, UI, death). Before parameterizing src/config/audio.ts, extract the audio (ffmpeg -vn), isolate 3-5 clean instances of each SFX class, and read pitch contour / duration / noise-vs-tonal balance from a spectrogram; only then do the synth numbers earn CONTRACT instead of INFERRED. The architecture items above can land first — this gates only the VALUES.

**Why this call for THIS repo:** grep of docs/research/fidelity/COMBAT_MEASUREMENTS.md for audio/sound/sfx hits only the player name 'SOUND360TM' (leaderboard row HONDA SHIZUKA (7)) — no measured audio rows exist; the CLAUDE.md prime directive ('THE TWO GAMEPLAY VIDEOS ARE THE PRIMARY 1:1 REFERENCE') applies to the soundtrack exactly as it does to frames.

**Implementation note:** New §S25 ledger block: one row per SFX class with measured duration (ms), fundamental/center frequency, sweep direction, noise ratio. ffmpeg + a spectrogram (sox/audacity or a scripted STFT) is enough; no new tooling gate needed until values are checked by eye twice.

<details><summary>Sources (2)</summary>

- [A] web.dev: Developing game audio with the Web Audio API (sound design must be tuned to the game, not presets) — https://web.dev/articles/webaudio-games
- [B] Boris Smus, Web Audio API book ch.3 (gain staging and tuning are game-specific) — https://webaudioapi.com/book/Web_Audio_API_Boris_Smus_html/ch03.html

</details>

**Dead ends this area:** Firefox-specific 2024-2026 autoplay detail could not be firmly grounded — searches surfaced Chrome/Safari policy docs, and MDN best practices only states the cross-browser gesture rule generically; Phaser's unlock path makes the distinction moot for this repo. mattmontag.com 'unlock Web Audio in Safari' (practitioner unlock reference cited by Phaser's own docs) returned HTTP 403 on fetch, so its silent-buffer/touchend specifics were not used as claims. COMBAT_MEASUREMENTS.md contains no audio measurements at all (only the 'SOUND360TM' player name matches), confirming the MEASURE_FIRST item. No audio config file exists yet in src/config/ (28 files checked), and the only audio mentions in src/ are the SimEvent→SFX drain comments in Sim.ts and src/game/CLAUDE.md.


---

## Synthesized katana/impact SFX recipes  <a name="sfx-synthesis"></a>

> **Verifier's overall note:** Verification depth: 7 of 12 cited URLs fetched live (MDN, Tsugi, Sonoport, WAC-2016, karplus-stress-tester, bugnet, gameaudiolearning, asoundeffect — the last three specifically to attack item 4); every repo citation opened and read (MASTER_SPEC Stage 6 + tells, src/config/CLAUDE.md, src/config/fx.ts, src/game/CLAUDE.md, src/core/Sim.ts SimEvent/drainEvents, tests/config-purity.test.ts, src/game/DuelScene.ts); ledger checked including §00b and §S24-H corrections. The research output is unusually accurate — exact numeric quotes from Sonoport/MDN/WAC all reproduce — with one genuine source fabrication found: the bugnet annotation invents '±20% pitch, >=6 variations' on a page containing no numbers, which, combined with a wrong test-enforcement citation, downgrades item 4 to WEAKENED (its ADOPT verdict and architecture reasoning still stand). No item rests on an overturned ledger row; COMBAT_MEASUREMENTS.md indeed has zero audio rows. Net: 5 CONFIRMED, 1 WEAKENED, 0 REFUTED — safe to act on with item 4's two corrections applied.

### sfx-synthesis.1 Sword whoosh = two filtered-noise layers with swept bandpass; heavy-vs-light falls out of envelope length + center frequency

**🔧 ADAPT** · verify: **CONFIRMED** · effort Medium · impact High · when: SESSION 25 / Stage 6

Canonical recipe: white noise via AudioBuffer (data[i]=Math.random()*2-1) -> BiquadFilterNode type 'bandpass' whose frequency is ramped (e.g. linearRampToValueAtTime) across the swing, inside a gain envelope (fast attack, ~0.15-0.4s decay). Practitioner refinement (Tsugi, GameSynth medieval-weapons postmortem): use TWO noise layers — one low-emphasized (body of the swing) and one airy high band — and make the HEAVIER weapon's whoosh simply a LONGER envelope + lower band center. MDN's own noise+bandpass demo uses 400-1200 Hz band range (1000 Hz default) as a sane sweep window. Parameterize per-layer: bandStartHz, bandEndHz, filterQ, attackS, decayS, gainPeak — six nameable constants per layer, all INFERRED.

**Why this call for THIS repo:** docs/MASTER_SPEC.md Stage 6 items 1+4 require draw (slashStarted) and whiff (missed) SFX with a heavy-vs-light tone difference — this recipe delivers both from one parameter set. Constants must land in a new src/config/sfx.ts following the src/config/fx.ts `as const` + INFERRED-label idiom (src/config/CLAUDE.md), then be ear-tuned against reference/videos in SESSION 25.

**Implementation note:** Suggested shape: export const WHOOSH_SFX = { layers: [{bandStartHz, bandEndHz, q, attackS, decayS, gain}], heavy: {decayMul, bandHzMul} } as const. Keep the SFX player in src/game (render-only), triggered by SimEvents drained per MASTER_SPEC's GameScene contract (Sim emits SimEvent[] for FX/SFX). Pre-generate one shared noise AudioBuffer of ~1-2s and reuse it for every play.

<details><summary>Sources (3)</summary>

- [A] MDN — Web Audio API Advanced techniques (noise buffer + bandpass + envelopes) — https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques
- [B] Tsugi blog — Medieval Weapons Sound Design part 1 (sword whoosh = two noise sources, different filters/envelope durations) — https://tsugi-studio.com/blog/2022/01/27/medieval-weapons-in-gamesynth-part-1/
- [B] Sonoport — Synthesising Sounds with Web Audio API (noise/filter/envelope node graphs with numbers) — https://sonoport.github.io/synthesising-sounds-webaudio.html

</details>

### sfx-synthesis.2 Metal clang (armor/parry) = inharmonic square-bank OR fast-decay inharmonic FM; both are plain-node, fully parameterizable

**🔧 ADAPT** · verify: **CONFIRMED** · effort Medium · impact High · when: SESSION 25 / Stage 6

Two proven plain-node routes to 'metal'. (a) Additive/inharmonic bank (classic 808-cymbal topology, full numbers in the Sonoport source): 6 square oscillators at fundamental 40 Hz x ratios [2, 3, 4.16, 5.43, 6.79, 8.21] -> bandpass ~10 kHz -> highpass ~7 kHz -> exponential gain decay ~0.05s (lengthen to ~0.2-0.5s and drop the highpass cutoff for a ringing clang rather than a tick). (b) FM: carrier >1000 Hz, modulator at a NON-INTEGER ratio (e.g. 3.57, 7.12 — integer ratios go bell-harmonic, non-integer goes clangorous), modulation depth starting high (~1000+), very fast attack + quick decay; WAC-2016 tutorial states FM beats subtractive for metallic hits. Nameable constants: fundamentalHz, partialRatios[], bpHz, hpHz, decayS (route a); carrierHz, modRatio, modDepthPeak, modDepthDecayS, ampDecayS (route b).

**Why this call for THIS repo:** Directly serves docs/MASTER_SPEC.md Stage 6 item 1 'armor (blocked)' SFX and gate checkbox 28 ('Four-way slash SFX fire on measured frame'). Seed values are generic-cymbal, not OG — every number goes into src/config/sfx.ts as INFERRED per src/config/CLAUDE.md and is re-tuned by ear against the OG parry sound in reference/videos.

**Implementation note:** Prefer route (a) additive bank as the primary: it is deterministic per parameter set, trivially jitterable (scale all partial frequencies by one pitch factor), and every constant is a plain number. Keep route (b) FM as the fallback if the bank sounds too 'hi-hat' next to the OG clang.

<details><summary>Sources (3)</summary>

- [B] Sonoport — Synthesising Sounds with Web Audio API (hi-hat: 6 squares at inharmonic ratios + BP/HP + envelope, all values) — https://sonoport.github.io/synthesising-sounds-webaudio.html
- [B] WAC 2016 percussion-synthesis tutorial (irritant) — FM hi-hat/cymbal: carrier >1 kHz, non-integer mod ratio, depth ~1000+ — https://github.com/irritant/WAC-2016-Tutorial
- [C] Nail The Mix — FM synthesis for metallic tones (non-integer ratios 3.570/7.120 = inharmonic clang; fast AD envelope) — https://www.nailthemix.com/fm-synthesis

</details>

### sfx-synthesis.3 Flesh/body thud = 3-layer percussion recipe: pitch-dropping low tone + short mid attack tone + lowpassed noise burst

**🔧 ADAPT** · verify: **CONFIRMED** · effort Low · impact High · when: SESSION 25 / Stage 6

The consensus layered recipe (kick/snare topology repurposed): LAYER 1 body — sine/triangle starting ~100-120 Hz ramping down toward near-zero (Sonoport kick: 120 Hz -> 0.001 Hz and gain 1 -> 0.001 exponential over 0.5s; shorten to ~0.15-0.3s for a hit rather than a drum); LAYER 2 attack — midrange tone with a much faster, more pronounced decay; LAYER 3 texture — white-noise burst through a lowpass with LOW Q at moderately-high cutoff, decaying over the whole sound (WAC-2016 snare noise layer). Sound-design guidance for punches confirms the same decomposition: sharp slap attack + meaty thud body + subtle texture. Nameable constants: bodyStartHz, bodyEndHz, bodyDecayS, attackHz, attackDecayS, noiseLpHz, noiseLpQ, noiseDecayS, per-layer gains.

**Why this call for THIS repo:** Serves docs/MASTER_SPEC.md Stage 6 item 1 'flesh (hitLanded)'. All seed numbers are drum-generic; per src/config/CLAUDE.md they enter src/config/sfx.ts labeled INFERRED and get ear-tuned in SESSION 25 against the OG hit sound audible in reference/videos.

**Implementation note:** exponentialRampToValueAtTime cannot ramp to 0 — use 0.001 as the floor exactly as the Sonoport recipes do, then stop() the source. One shared function makeThud(cfg) covers flesh hit AND (with longer bodyDecayS) any future heavy-landing sound.

<details><summary>Sources (3)</summary>

- [B] Sonoport — Synthesising Sounds with Web Audio API (kick: 120 Hz->0.001 pitch drop + exponential gain ramp, 0.5s; snare noise layer) — https://sonoport.github.io/synthesising-sounds-webaudio.html
- [B] WAC 2016 percussion-synthesis tutorial — snare = body tone + attack tone + lowpassed low-Q noise, each with own envelope — https://github.com/irritant/WAC-2016-Tutorial
- [C] Pixflow — Punch & impact sound effects for fight scenes (attack/body/texture layer decomposition) — https://pixflow.net/blog/punch-impact-sound-effects-for-fight-scenes/

</details>

### sfx-synthesis.4 Anti-repetition: per-play pitch jitter around +-20% plus slight gain jitter, applied at the render-layer SFX player

**✅ ADOPT** · verify: **WEAKENED — corrections below** · effort Low · impact Medium · when: SESSION 25 / Stage 6

Established practice: randomize per-play pitch within roughly 80-120% (the +-20% figure is the repeatedly cited baseline for frequently-fired sounds like footsteps), add small volume variation, and never retrigger an identical instance back-to-back — immediate exact repetition is what players notice most. For synthesized SFX this is trivial: multiply every layer's frequency-type constant by one random pitchFactor and the master gain by one gainFactor per play. Nameable constants: pitchJitterPct (seed 0.10-0.20 — a synthesized clang tolerates less than a footstep sample), gainJitterPct (seed ~0.10).

**Why this call for THIS repo:** Compatible as-is with the architecture: SFX lives in src/game (render-only per src/game/CLAUDE.md), driven by drained SimEvents from src/core/Sim.ts, so jitter randomness never touches the deterministic Sim — the no-Math.random invariant (tests/config-purity.test.ts) applies to src/core only. Jitter ranges become two INFERRED constants in src/config/sfx.ts.

**Implementation note:** One caveat vs the generic advice: the OG game may have had ZERO variation (Flash-era games often fired one fixed sound per event). If the videos show identical repeated hits, per the prime directive set pitchJitterPct to 0 and keep the mechanism dormant — the constant existing costs nothing.

**⚠ Verifier correction (WINS over the claim above):** Replace the bugnet source annotation and drop the '±20% is the repeatedly cited baseline' framing: all three cited sources support pitch/volume randomization + no-immediate-repeat only QUALITATIVELY, with no numeric bound (bugnet's page has no numbers at all). Seed pitchJitterPct 0.10-0.20 as a plain INFERRED guess. Also correct the enforcement citation: the no-Math.random rule in core is a src/core/CLAUDE.md invariant (plus comments in Sim.ts/rng.test.ts), NOT enforced by tests/config-purity.test.ts — that test checks numeric literals and import resolution only. The ADOPT itself stands: src/game already uses Math.random (DuelScene blood spray) and is the correct jitter layer.

<details><summary>Sources (3)</summary>

- [B] Game Audio Learning Portal — How audio is manipulated in games (randomized pitch/volume bounds per playback) — https://www.gameaudiolearning.com/knowledgebase/how-audio-is-manipulated-in-games
- [B] A Sound Effect — How to maintain immersion + reduce repetition in game audio (practitioner roundup) — https://www.asoundeffect.com/game-audio-immersion/
- [C] Bugnet blog — How to fix sound effects sounding too repetitive (+-20% pitch, >=6 variations, no immediate repeats) — https://bugnet.io/blog/how-to-fix-sound-effects-too-repetitive

</details>

### sfx-synthesis.5 Before seeding any INFERRED SFX constant: extract and spectrogram the OG audio from the two reference videos

**📐 MEASURE FIRST** · verify: **CONFIRMED** · effort Low · impact High · when: SESSION 25, first task before any synthesis code

The professional workflow the Tsugi postmortem describes for its sword impact — 'extract resonant modes from analyzed samples', then synthesize to match — applies directly here, and this repo is uniquely positioned: the OG SFX are IN the ground-truth videos. ffmpeg-extract the audio track, cut the whoosh/clang/flesh/draw one-shots at the already-measured attack frames, and read center frequency, band width, duration, and pitch-drop shape off a spectrogram. That converts SESSION 25's 'tune by ear' into 'tune by ear from measured seeds', and lets several sfx.ts constants be tagged CONTRACT (measured) instead of INFERRED.

**Why this call for THIS repo:** CLAUDE.md invariant: 'THE TWO GAMEPLAY VIDEOS ARE THE PRIMARY 1:1 REFERENCE... Copy what is in them, directly' — and docs/research/fidelity/COMBAT_MEASUREMENTS.md establishes the measured-row pattern (its §S24 block) that audio rows should join. Generic recipe constants adopted without checking the videos' actual SFX would be exactly the second-hand-grading failure the invariant warns about.

**Implementation note:** ffmpeg -i <video> -vn -acodec pcm_s16le og-audio.wav, then cut one-shots at the ledger's known hit frames and view with sox spectrogram or ffmpeg showspectrumpic. Add the measured rows (centerHz, durationMs, pitch-drop) to COMBAT_MEASUREMENTS.md before writing src/config/sfx.ts.

<details><summary>Sources (1)</summary>

- [B] Tsugi blog — Medieval Weapons Sound Design part 1 (impact model built from resonant modes extracted from analyzed samples) — https://tsugi-studio.com/blog/2022/01/27/medieval-weapons-in-gamesynth-part-1/

</details>

### sfx-synthesis.6 Karplus-Strong / AudioWorklet string synthesis for the clang: skip it

**⛔ REJECT** · verify: **CONFIRMED** · effort High · impact Low · when: n/a (rejected)

Practitioner Web Audio KS implementations either use the deprecated ScriptProcessorNode or require AudioWorklet processors (with Wasm recommended for performance and SharedArrayBuffer messaging to avoid GC glitches, per the karplus-stress-tester benchmark and the mrahtz implementation). That is an entire extra build surface (worklet bundling under Vite, cross-origin isolation for SAB) to produce a plucked-string timbre the spec never asks for — the inharmonic-bank/FM clang (item 2) reaches 'metal' with plain OscillatorNode/BiquadFilterNode graphs. UI ticks likewise need nothing beyond a single short oscillator blip with a fast exponential decay (the Sonoport hi-hat topology shortened), and are not in the Stage 6 SFX list at all — only add one if the OG videos' menu audio demonstrably has one.

**Why this call for THIS repo:** Churn: docs/MASTER_SPEC.md Stage 6 names exactly four SFX + two music beds + two stings, and src/config/CLAUDE.md's landmine forbids inventing constants/systems that 'feel missing'. Item 2's plain-node recipes cover the only metallic requirement ('armor (blocked)'); an AudioWorklet KS pipeline serves no gate checkbox.

<details><summary>Sources (3)</summary>

- [B] Jack Schaedler — Karplus-Strong stress tester (AudioWorklet per-node overhead; Wasm+SAB needed for clean performance) — https://jackschaedler.github.io/karplus-stress-tester/
- [C] mrahtz/javascript-karplus-strong — JS/Web Audio KS guitar synthesis (asm.js-era implementation burden) — https://github.com/mrahtz/javascript-karplus-strong
- [B] WAC 2016 percussion-synthesis tutorial — 'FM does a better job of synthesizing metallic sounds than subtractive' — https://github.com/irritant/WAC-2016-Tutorial

</details>

**Dead ends this area:** The jackschaedler karplus-stress-tester page did NOT document the commonly-repeated '128-sample render-quantum minimum for DelayNode feedback loops' claim, so that specific pitch-ceiling figure is omitted as ungrounded (the REJECT stands on implementation-burden evidence alone). The FXive procedural-synthesis paper surfaced only as a ResearchGate PDF stub and was not fetched. No practitioner source publishes a verbatim 'sword parry clang in Web Audio' recipe — the clang item is synthesized from the adjacent cymbal/FM-metal recipes and flagged for by-ear/spectrogram tuning. COMBAT_MEASUREMENTS.md contains zero audio rows (the only grep hit, 'SOUND360TM', is a player name), confirming OG SFX are entirely unmeasured — hence the MEASURE_FIRST item.


---

## TS architecture: the ECS claim + type hardening  <a name="ts-architecture"></a>

> **Verifier's overall note:** The research output survives adversarial verification almost intact: 4 of 5 items CONFIRMED, 1 WEAKENED on two citation-precision errors (SimEvent is 17 variants not 18; typescript-eslint's satisfies-never mention is a caveat-section alternative, not an explicit endorsement) that do not change its ADOPT adjudication. Source spot-checks (4 URLs fetched, including both C-grade ones I suspected fabricated) all came back live and supportive — notably the HN quote is near-verbatim and Goldberg's arithmetic-stripping caveat is real (TS#59423). Repo checks all passed against the actual files: the core/ bare-import ban, the moveTargetX stage-px/world-px comment lie, the missing label-coverage gate, the if/else event drain, and the shipped ActorId template-literal type. Ledger checks passed: the ÷1.875 conversion row and the 8-mob row exist and neither is overturned by §00b or §S24-H (one trivial slip: the 8-on-screen figure is in the adjacent 'simultaneous attackers' row, not the 'waves spawn by falling in from above' row). Test count independently measured: 894 passing across 56 files. Adjudication logic (REJECT ECS, ADAPT-at-boundaries branding, scanner-not-types for labels, ADOPT satisfies-never, ALREADY_DONE ids) is sound against the repo's invariants and the fidelity prime directive.

### ts-architecture.1 Adopt ECS (bitECS or custom) for the Sim

**⛔ REJECT** · verify: **CONFIRMED** · effort High · impact Low · when: never (re-open only on a measured perf problem)

Steelman: ECS gives struct-of-arrays cache-friendly iteration, composition over inheritance, and clean system/data separation; bitECS is a TS-native, dependency-free implementation of it. But the practitioner consensus is that ECS pays off with large dynamic entity counts (hundreds to tens of thousands) or engine-building; for small fixed rosters it adds friction with no payoff — 'hardly any game needs thousands of interacting entities', and the recommended path is simple composition plus profiling before any data-layout rewrite.

**Why this call for THIS repo:** Two independent kills. (1) Hard invariant violation: bitECS is a bare package import, and tests/config-purity.test.ts checkImports() fails ANY bare specifier in src/core/ ('core/ is framework-free') — adopting it in the Sim literally cannot go green. (2) A custom ECS is pure churn at this scale: Sim.ts holds 1 player + N enemies (measured encounters top out around 8 mobs per COMBAT_MEASUREMENTS.md 'waves spawn by falling in from above' row) plus kunai capped at PROJECTILE_MAX_ACTIVE; iteration order IS a determinism contract (Sim.allActors doc: 'Spawn order is identity AND iteration order… what keeps a crowd deterministic'), which generic ECS query iteration would have to re-pin; and 894 green tests pin the current FighterState shape. Zero measured OG behavior needs it — a data-layout rewrite that moves no fidelity needle is a defect under the prime directive.

**Implementation note:** If a future stage ever spawns hundreds of simultaneous actors (nothing in the ledger suggests it), re-evaluate then with a profile in hand — the HN practitioner consensus is profile-first, and even then the SoA layout would have to live inside core/ with zero literals.

<details><summary>Sources (4)</summary>

- [A] bitECS 0.4 introduction (official docs) — https://bitecs.dev/docs/introduction
- [B] HN thread: ECS necessity debate (practitioners, fetched) — https://news.ycombinator.com/item?id=27754996
- [C] ECS Architecture for Browser Games (scaling guide) — https://simplified.media/guides/ecs-browser-games
- [C] GameDev.net forum: ECS architecture discussion — https://www.gamedev.net/forums/topic/709854-ecs-architecture/5438583/

</details>

### ts-architecture.2 Branded unit types for the three pixel systems (px@1080 / stage px / world px)

**🔧 ADAPT** · verify: **CONFIRMED** · effort Medium · impact High · when: SESSION 24/25

TS branded (nominal) types — `type WorldPx = number & { readonly __brand: 'worldPx' }` — are the standard 2024-25 pattern for units of measure: zero runtime cost, and structural typing stops silently accepting one unit where another is expected. Known caveat (Goldberg): arithmetic on branded numbers strips the brand and binary ops raise no error, so the pattern only pays at BOUNDARIES (function signatures, config declarations, conversion helpers), not on every intermediate value.

**Why this call for THIS repo:** The bug class is live in the repo TODAY: Sim.ts's PlayerIntent.moveTargetX is doc-commented '(stage px)' but DuelScene.mouseTargetX is 'stored WORLD-side' (stageToWorld applied at the pointer handler before assignment) — the comment lies across the exact scene→Sim seam, and only a comment stands between that and a real 1.28x-scale movement bug (WORLD_WIDTH=800 vs GAME_WIDTH=1024 in config/display.ts; ledger row 'Conversion: px @1080 ÷ 1.875 = stage px' adds the third system doc-side). ADAPT, not ADOPT: brand only the seams — config/display.ts exports, core/viewport stageToWorld/worldToStage signatures, PlayerIntent/FighterSpawn position fields — because brand-stripping arithmetic means whole-Sim branding degenerates into `as` casts everywhere (Goldberg's caveat). No package: hand-roll the one-line intersection type in src/config (type-only, satisfies config/'s no-logic rule); ts-brand would violate nothing in config but adds nothing either.

**Implementation note:** Declare `WorldPx`/`StagePx` brands in src/config/display.ts next to the WORLD vs STAGE doc block that already defines the two spaces in prose. Constructor = `as WorldPx` at the declaration/conversion sites only. First measurable win: retyping PlayerIntent.moveTargetX as WorldPx forces the stale 'stage px' comment fix and makes every future scene input path prove its conversion. Px@1080 stays doc-only (it never enters code).

<details><summary>Sources (4)</summary>

- [B] Branded Types — Learning TypeScript (Josh Goldberg, fetched) — https://www.learningtypescript.com/articles/branded-types
- [A] TypeScript official playground: Nominal Typing — https://www.typescriptlang.org/play/typescript/language-extensions/nominal-typing.ts.html
- [C] ts-brand: reusable type branding — https://github.com/kourge/ts-brand
- [C] Branded Types in TypeScript (Prosopo) — https://prosopo.io/articles/typescript-branding/

</details>

### ts-architecture.3 Branded/template-literal tagging for CONTRACT vs INFERRED config values

**🔧 ADAPT** · verify: **CONFIRMED** · effort Low · impact Medium · when: now

The same branding machinery could tag config values by evidence grade (`type Contract<T> = T & {__evidence:'contract'}`). But research turned up NO practitioner precedent for provenance-tagging constants via types, and the mechanism is wrong for the job: brands vanish on first arithmetic use, both tag flavors behave identically at compile time (nothing to reject), and the tag would live in the type while the evidence lives in comments — two sources of truth that can drift.

**Why this call for THIS repo:** The repo's enforcement idiom is SCANNER GATES, not types: tests/config-purity.test.ts already parses every src/config file with self-tested fixtures, and src/config/CLAUDE.md states the labeling invariant ('Every value is labeled CONTRACT / INFERRED / Spec-fixed') without any test enforcing it — that's the actual gap. ADAPT the idea into a scanner extension: fail any `export const` in src/config whose preceding doc comment lacks one of the three labels (same LiteralHit-style reporting, same self-test fixtures). This matches the standing 'build the tooling' rule and the double-entry ratchet already in tests/config-values.test.ts, and unlike a type brand it cannot be stripped or bypassed with `as`.

**Implementation note:** Add a `scanLabelCoverage()` to tests/utils/configPurity.ts + a describe block in config-purity.test.ts; chaos-test by planting one unlabeled export (red) per the repo's chaos rule. Accept CONTRACT, CONTRACT-SRC, INFERRED, Spec-fixed as the label set (CONTRACT-SRC already appears in config/combat.ts).

<details><summary>Sources (2)</summary>

- [B] Branded Types — Learning TypeScript (arithmetic-stripping caveat, fetched) — https://www.learningtypescript.com/articles/branded-types
- [C] ts-brand: reusable type branding — https://github.com/kourge/ts-brand

</details>

### ts-architecture.4 Exhaustiveness checking via `satisfies never` on the SimEvent drain

**✅ ADOPT** · verify: **WEAKENED — corrections below** · effort Low · impact Medium · when: now / SESSION 24

The TS 4.9+ idiom `default: ev satisfies never` in a switch over a discriminated union makes the compiler error the moment a new union variant is added without a handler — zero runtime code, no dependency. typescript-eslint's switch-exhaustiveness-check rule automates the same guarantee lint-side, and its docs explicitly endorse the `satisfies never` default for codebases that keep defaults.

**Why this call for THIS repo:** SimEvent in Sim.ts is an 18-variant discriminated union that has grown every session (autoStroke, strikeBlocked, enemyTelegraph are all recent), and DuelScene drains it with a plain if/else-if chain on ev.type — a new variant is silently dropped with no FX/SFX and no compile error, which is exactly a fidelity leak (an OG-measured cue that never renders). Converting the drain to a switch with `default: ev satisfies never` closes it at zero runtime cost, is compatible with the zero-literal rule (no numbers involved), and the repo already has eslint.config.mjs if the lint-rule variant is preferred. Guarded cases like `ev.type === 'damage' && ev.target === 'player'` become an inner branch under `case 'damage'`.

**Implementation note:** Apply at every SimEvent consumer (DuelScene's drain loop is the main one; grep for drainEvents callers). Chaos-proof it: add a dummy variant to SimEvent, watch typecheck go red, remove it.

**⚠ Verifier correction (WINS over the claim above):** SimEvent is a 17-variant union (count Sim.ts lines 112-130: fightStarted through autoStroke), not 18. And cite the typescript-eslint source precisely: the rule's docs mention `satisfies never` in a caveat as an alternative pattern (disable allowDefaultCaseForExhaustiveSwitch + eslint core default-case rule + `satisfies never` in kept defaults), not as a blanket endorsement. Neither error changes the ADOPT verdict — the unguarded if/else drain and the zero-runtime-cost fix are real.

<details><summary>Sources (3)</summary>

- [A] switch-exhaustiveness-check — typescript-eslint (official) — https://typescript-eslint.io/rules/switch-exhaustiveness-check/
- [B] Exhaustiveness checking — TypeScript Book (gibbok) — https://gibbok.github.io/typescript-book/book/exhaustiveness-checking/
- [C] Use satisfies for exhaustive type checks (return2) — https://return2.net/typescript-use-satisfies-for-exhaustive-type-checks/

</details>

### ts-architecture.5 Template-literal types for actor/entity identity

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Low · when: done (SESSION 14)

Template-literal types (`\`enemy${number}\``) give string ids compile-time structure so arbitrary strings can't pose as ids — the lightweight cousin of full branding, recommended for id-shaped strings.

**Why this call for THIS repo:** Sim.ts already ships it: `export type ActorId = 'player' | \`enemy${number}\`` (SESSION14 A1), with PLAYER_ID as the one fixed name, enemyIdAt() as the constructor, and Sim.actor() throwing on unknown ids so a typo'd id fails loud instead of resolving to somebody. Nothing to add — the id surface is both statically shaped and runtime-guarded.

<details><summary>Sources (2)</summary>

- [A] TypeScript official playground: Nominal Typing — https://www.typescriptlang.org/play/typescript/language-extensions/nominal-typing.ts.html
- [B] Branded Types — Learning TypeScript — https://www.learningtypescript.com/articles/branded-types

</details>

**Dead ends this area:** No practitioner postmortem of REMOVING ECS from a shipped small game was found (search hit generic pro-ECS scaling guides instead); the anti-case rests on the HN practitioner thread plus the repo's own invariants. No 2024-26 source exists for provenance-tagging constants (CONTRACT/INFERRED-style) via branded types — the pattern appears to be a non-practice, which itself supports routing that idea to the scanner instead. The suspected moveTargetX unit bug turned out NOT to be live (DuelScene converts via stageToWorld before assignment) — only the Sim-side doc comment is wrong; adjudication of item 2 was downgraded from 'fixes a live bug' to 'closes the bug class and a lying comment'.


---

## Vite 8 (Rolldown) build & bundle  <a name="vite-build"></a>

> **Verifier's overall note:** Strong batch — 2 CONFIRMED, 2 WEAKENED, 0 REFUTED, and both weakenings are peripheral (an omitted third build artifact; a wrong guess about a file sitting in the repo, plus a stale issue status). Every load-bearing technical claim reproduced under attack: I ran four real builds (baseline, chunkSizeWarningLimit-only, codeSplitting.groups, and object-form manualChunks) on the repo's actual vite@8.1.5 / rolldown 1.1.5, and every size, gzip figure and hash quoted came back exact — including a sha256 match proving the 'byte-identical bundle' claim literally true, not approximately. SOURCES: two A-grade URLs spot-checked with WebFetch (vite.dev/guide/migration, rolldown.rs/reference/OutputOptions.codeSplitting) plus the GitHub issue via gh — all live, all saying what was attributed to them; no fabricated or dead URLs. REPO: PROBLEMS.md problem 1, RESUME_HERE.md line 215 backlog row, vite.config.ts's vitest-only shape, package.json versions, and .githooks/pre-commit all match the research's description; no ALREADY_DONE items were claimed, and the single REJECT's cited invariant (the installed d.mts deprecation) is real. LEDGER: N/A by absence — this batch cites ZERO COMBAT_MEASUREMENTS.md rows, and grep for bundle/vite/chunk across the ledger returns nothing, so neither §00b nor the new 2026-08-12 'Verify-pass corrections' block in §S24-H (entirely combat geometry: HEAVY band 146–~275, point-blank 17 dmg on draw, dash constant-speed ~616 px/s, run core 573–685 px/s) touches anything here. Housekeeping: my three temporary verify configs were deleted and `git status` is back to its pre-verification state (only `?? PROBLEMS.md` untracked); test builds went to the scratchpad, repo dist/ untouched. Actionable residue for the parent: item 4's correction upgrades the batch-1 doc fix from 'tidy the API name' to 'fix a snippet that crashes the build'.

### vite-build.1 Correct chunk-control API for vite@8.1 is build.rolldownOptions.output.codeSplitting — not manualChunks, not advancedChunks

**✅ ADOPT** · verify: **CONFIRMED** · effort Low · impact Medium · when: now (as recorded knowledge); applied at Stage 6

Vite 8 renamed build.rollupOptions to build.rolldownOptions (old name kept as a deprecated alias). Under output, object-form manualChunks is REMOVED, function-form manualChunks is deprecated (and ignored if codeSplitting is present), and advancedChunks is a deprecated alias of codeSplitting (rolldown 1.1.5 types: 'type AdvancedChunksOptions = CodeSplittingOptions', '@deprecated Please use codeSplitting instead'; advancedChunks is ignored when both are set). The living option is output.codeSplitting: boolean | { groups?: [{ name: string|fn, test?: string|RegExp|fn, priority?, minSize?, maxSize?, minShareCount?, ... }], minSize?, maxSize?, minShareCount?, includeDependenciesRecursively? }. VERIFIED against the installed package itself (node_modules/rolldown/dist/shared/define-config-BhJ90aEv.d.mts under vite@8.1.5) plus a successful live `npx vite build` using it.

**Why this call for THIS repo:** PROBLEMS.md active problem 1 already names 'build.rolldownOptions.output.codeSplitting' as Vite's own suggested option, and the repo's installed rolldown 1.1.5 d.mts confirms it is the sole non-deprecated API — any future chunk config in vite.config.ts must use this form.

**Implementation note:** This is the API ruling that item-3's Stage 6 snippet is written against. Nothing to change in vite.config.ts for this item alone; it exists so the Stage 6 work (and any doc) never reaches for manualChunks/advancedChunks.

<details><summary>Sources (4)</summary>

- [A] Vite — Migration from v7 (rolldownOptions rename; manualChunks removal; codeSplitting replacement) — https://vite.dev/guide/migration
- [A] Rolldown — OutputOptions.codeSplitting reference (full option shape + groups example) — https://rolldown.rs/reference/OutputOptions.codeSplitting
- [A] vitejs/vite issue #21414 — Document rolldownOptions.output.advancedChunks deprecation (opened 2026-01-15) — https://github.com/vitejs/vite/issues/21414
- [B] byteiota — Vite 8 Rolldown migration guide (practitioner: manualChunks object form gone, codeSplitting is the replacement) — https://byteiota.com/vite-8-rolldown-migration-guide-10-30x-faster-builds/

</details>

### vite-build.2 Now-fix: add a build section with chunkSizeWarningLimit ~1500 to silence the cosmetic 1360kB warning

**✅ ADOPT** · verify: **CONFIRMED** · effort Low · impact Medium · when: now

The 1,360.08 kB warning is emit-only — the build succeeds and the pre-commit gate stays green — so the only cost is noise in PROBLEMS.md tracking. build.chunkSizeWarningLimit (number, kB, default 500) is unchanged in Vite 8. VERIFIED live: a build with only `chunkSizeWarningLimit: 1500` produced the byte-identical bundle PROBLEMS.md reports (index-DsRXxsrp.js, 1,360.08 kB / gzip 366.89) with no warning. Snippet valid for vite@8.1.5 (ran it): export default defineConfig({ test: {...}, build: { chunkSizeWarningLimit: 1500 } }). 1500 gives ~140 kB headroom for game-code growth through Stage 6 while still catching a runaway regression.

**Why this call for THIS repo:** PROBLEMS.md problem 1 itself offers 'raise build.chunkSizeWarningLimit if the single-chunk bundle is intentional' — and RESUME_HERE.md's backlog row 'Phaser bundle 1.2 MB → code-split at Stage 6' says the single chunk IS intentional until Stage 6; this is the smallest diff that closes the only active problem.

**Implementation note:** vite.config.ts currently imports defineConfig from 'vitest/config' with only a test block — add `build: { chunkSizeWarningLimit: 1500 /* Phaser ~1.2MB single-chunk intentional until Stage 6 code-split (RESUME_HERE backlog) */ }` beside it. vitest/config's defineConfig accepts full Vite build options. Clears PROBLEMS.md problem 1.

<details><summary>Sources (2)</summary>

- [A] Vite — Build Options (chunkSizeWarningLimit type number, default 500 kB) — https://vite.dev/config/build-options
- [B] byteiota — Vite 8 Rolldown migration guide (Vite 8 build behavior in practice) — https://byteiota.com/vite-8-rolldown-migration-guide-10-30x-faster-builds/

</details>

### vite-build.3 Phaser vendor chunk via codeSplitting.groups — snippet verified working, but KEEP it at Stage 6 per the backlog

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Low · impact Medium · when: Stage 6

The verified snippet — build.rolldownOptions.output.codeSplitting: { groups: [{ name: 'phaser', test: /node_modules[\\/]phaser[\\/]/, priority: 10 }] } — builds clean on vite@8.1.5 and yields phaser-[hash].js 1,198.00 kB (gzip 319.08) + index-[hash].js 161.47 kB (gzip 48.04). VERIFIED by actually running the build. But splitting now buys nothing at runtime: Phaser is a static top-level import, so both chunks load at startup; the only benefit is HTTP-cache reuse of the Phaser chunk across app-code deploys, which matters only when the game ships to users (Stage 6). Risk of doing it now: a changed chunk graph is a new failure surface (Rolldown docs warn manual splitting can reorder side-effect execution unless output.strictExecutionOrder is set, and Phaser executes side effects at import) for zero present gain. Also note: the 1,198 kB phaser chunk still exceeds the 500 kB default warn limit, so item 2's limit raise is needed WITH the split anyway, not instead of it.

**Why this call for THIS repo:** RESUME_HERE.md backlog row 'Phaser bundle 1.2 MB → code-split at Stage 6' is a deliberate deferral and nothing in PROBLEMS.md contradicts it (the warning is closable by item 2); adapt = keep the deferral but replace the backlog row's unspecified 'code-split' with this exact verified codeSplitting.groups snippet so Stage 6 doesn't rediscover the API.

**Implementation note:** At Stage 6, land the snippet inside build.rolldownOptions.output and re-run the fidelity gate + a real browser LOOK (chunk-graph changes are exactly the class of build change the 55/55 gate exists to catch). Keep chunkSizeWarningLimit at ~1250-1500 since the phaser chunk alone is 1,198 kB. Consider output.strictExecutionOrder if any import-order oddity appears.

**⚠ Verifier correction (WINS over the claim above):** The split build emits THREE assets, not two: assets/phaser-[hash].js 1,198.00 kB (gzip 319.08), assets/index-[hash].js 161.47 kB (gzip 48.04), AND assets/rolldown-runtime-[hash].js 0.56 kB (gzip 0.36) — a shared runtime chunk Rolldown injects only once splitting is on. index.html also grows 0.77 kB → 0.93 kB because it now references the extra scripts. Stage 6 should expect a 3-file chunk graph and re-check any preload/cache rules against it. Separately: the installed rolldown d.mts documents strictExecutionOrder only as 'Lets modules be executed in the order they are declared' plus a bundle-size warning — the side-effect-reordering rationale comes from the rolldown.rs docs page, not the type annotations.

<details><summary>Sources (3)</summary>

- [A] Rolldown — OutputOptions.codeSplitting reference (groups shape; side-effect/strictExecutionOrder warning; [\\/] Windows-path advice) — https://rolldown.rs/reference/OutputOptions.codeSplitting
- [A] Vite — Migration from v7 (codeSplitting is the sanctioned replacement path) — https://vite.dev/guide/migration
- [B] byteiota — Vite 8 Rolldown migration guide (practitioner vendor-split migration pattern) — https://byteiota.com/vite-8-rolldown-migration-guide-10-30x-faster-builds/

</details>

### vite-build.4 REJECT any config written against output.advancedChunks (the batch-1 doc's likely guess)

**⛔ REJECT** · verify: **WEAKENED — corrections below** · effort Low · impact Medium · when: now (doc correction only)

advancedChunks was rolldown-vite's original webpack-splitChunks-style option and many 2025-era guides teach it, but as of vite@8.1.5 / rolldown 1.1.5 it is formally deprecated: the installed types alias it to CodeSplittingOptions with '@deprecated Please use codeSplitting instead', it is silently IGNORED whenever codeSplitting is also specified, and vitejs/vite#21414 (2026-01-15) tracks documenting its deprecation pending rolldown/rolldown#7895. Writing new config with advancedChunks means shipping onto a removal track and risking a both-set config where it does nothing.

**Why this call for THIS repo:** The repo's own node_modules/rolldown/dist/shared/define-config-BhJ90aEv.d.mts marks advancedChunks @deprecated and documents that codeSplitting wins when both are present — adopting it would contradict the installed toolchain's stated direction for zero benefit over item 3's codeSplitting form.

**Implementation note:** If the batch-1 improvements doc (docs/research/2026-08-05-improvements-research.md) proposes advancedChunks or manualChunks, correct it to the item-3 codeSplitting snippet.

**⚠ Verifier correction (WINS over the claim above):** Two fixes. (1) Drop 'the batch-1 doc's likely guess' — docs/research/2026-08-05-improvements-research.md §12 proposes object-form manualChunks, and that form is not merely deprecated but FATAL on vite@8.1.5: I ran it and got `Warning: Invalid output options (1 issue found) - For the "manualChunks". Invalid type: Expected Function but received Object.` then `error during build: TypeError: manualChunks is not a function` (build failed, no dist emitted). §12's snippet must be rewritten to the item-3 codeSplitting form before anyone copies it — a build-breaking correction, not a stylistic one. While there, §12 also writes `import { defineConfig } from 'vite'`, which if pasted over the repo's vite.config.ts would silently delete the vitest `test` block. (2) vitejs/vite#21414 is CLOSED (created 2026-01-15T01:04:43Z, closed 2026-01-24T09:24:46Z; body checkbox 'Outdated', body text 'After https://github.com/rolldown/rolldown/issues/7895 is done') — describe it as a closed docs ticket confirming the deprecation, not as work still 'pending'. It is also fully readable via `gh issue view 21414 --repo vitejs/vite --json title,state,createdAt,closedAt,body`, contrary to the dead_ends note.

<details><summary>Sources (3)</summary>

- [A] vitejs/vite issue #21414 — Document rolldownOptions.output.advancedChunks deprecation — https://github.com/vitejs/vite/issues/21414
- [A] Vite — Migration from v7 (recommends codeSplitting; never mentions advancedChunks as current API) — https://vite.dev/guide/migration
- [A] v7.vite.dev — Rolldown Integration guide (historical advancedChunks-era doc, showing why stale guides still teach it) — https://v7.vite.dev/guide/rolldown

</details>

**Dead ends this area:** No Phaser-specific Vite-8 chunking postmortem exists yet (searched; all practitioner migration articles are React/generic — byteiota was the best and had no chunk-splitting gotchas from production). GitHub issue #21414's comment thread was not readable via fetch (only title/metadata rendered), so the advancedChunks-deprecation claim rests on the issue title + the installed rolldown 1.1.5 type annotations, which are primary evidence anyway. certificates.dev and nexgismo migration articles were returned by search but not fetched (byteiota covered the practitioner angle). Could not use grep/ls directly on node_modules (sandbox permission denials) — worked around via python3 file reads; conclusions unaffected.


---

## Testing & visual regression  <a name="testing-vr"></a>

> **Verifier's overall note:** Attacked all five items. Six cited URLs fetched (Chromium SwiftShader doc, chromestatus feature 5166674414927872 via page and raw API, playwright.dev/docs/test-snapshots, vitest.dev/blog/vitest-4, main.vitest.dev visual-regression guide, github.com/mapbox/pixelmatch) — all live, none fabricated, each broadly saying what is attributed to it. Two source-level errors found: the SwiftShader removal milestone is 139 (enterprise notice 131), not 130 (item 1); pixelmatch's perceptual metric is OKLab+HyAB, not YIQ (item 2). Repo side, every ADOPT/REJECT/ALREADY_DONE premise was re-derived from files: CI runs lint/test/build only, pre-commit is literally `npx vitest run`, vitest is ^4.1.10, the harness is DEV-only, gate data is committed while reference/ is gitignored, 55 = 40 config probes + 1 runtime probe + 14 scans, and all five canonical states exist in src/game/fidelity.ts. The single repo-level falsehood is item 5's claim that tests/config-purity.test.ts enforces the Math.random ban — it does not. No item cites a COMBAT_MEASUREMENTS.md row, so §00b and the §S24-H verify-pass corrections (HEAVY band 146–~275, A28 S3 cinematic-owned, 17-damage-on-draw / +309 px knockback, ASYM contested, ~616 px/s constant-speed dash) are orthogonal to this area and overturn nothing here. Net: the two ADOPTs and the REJECT stand, the ADAPT stands on stronger evidence than the research supplied (zero fighter-body probes in the fighting state), and the ALREADY_DONE stands with a corrected enforcement story.

### testing-vr.1 Run the existing ?fidelity=auto gate headlessly in CI via a Playwright script

**✅ ADOPT** · verify: **WEAKENED — corrections below** · effort Medium · impact High · when: now (SESSION 24 candidate)

The 55/55 gate is CI-runnable today with zero new assertions: gate data lives in committed src/config/fidelity.ts (the gitignored reference payload is only needed to MEASURE probes, not to RUN them), and ?fidelity=auto already writes a machine-readable verdict to localStorage.__fidelityAuto. A ~50-line Playwright (library, not @playwright/test) script can start the vite dev server, open the URL headless, poll the verdict, and exit nonzero on pass!==true. Headless caveats are all solved upstream: new headless Chromium runs a real compositor (rAF fires; the harness's manual game.loop.step() fallback covers throttling anyway), and software WebGL needs the --enable-unsafe-swiftshader launch flag because Chromium deprecated the automatic SwiftShader fallback starting Chrome 130 — without it WebGL context creation fails on GPU-less runners like ubuntu-latest.

**Why this call for THIS repo:** src/main.ts already implements the full automation seam (?fidelity=auto → localStorage.__fidelityAuto with 'running' marker then verdict, built SESSION23 for exactly this headless-driver use); .github/workflows/ci.yml runs only lint/vitest/build, so the gate currently regresses silently between manual Brave runs. FIDELITY_GATE.md's harness is DEV-only (import.meta.env.DEV) so CI must serve `vite dev`, not the prod build.

**Implementation note:** Do ONE local headless dry-run first (chromium --headless=new --enable-unsafe-swiftshader against the dev server) and record SwiftShader-vs-GPU per-channel deltas per probe; the gate's ≤32/channel tolerances on flat-fill interior points should absorb rasterizer differences, but verify before making CI red. Chromium launch flags: --headless=new --enable-unsafe-swiftshader --no-sandbox. Budget the job ~3 min (gate is 60-120s when throttled per FIDELITY_GATE.md; headless with real rAF should be faster). Skip GPU runners entirely — Promaton needed them for heavy 3D at $1.06/hr; a 1024x576 2D vector scene renders fine on SwiftShader.

**⚠ Verifier correction (WINS over the claim above):** Replace 'because Chromium deprecated the automatic SwiftShader fallback starting Chrome 130' with: 'because Chromium removed the automatic SwiftShader fallback — chromestatus feature 5166674414927872 ("Remove SwiftShader fallback") lists desktop milestone 139, enterprise notification from 131; the Chromium SwiftShader doc states the deprecation without naming a version. Any current CI Chromium is past 139, so --enable-unsafe-swiftshader is mandatory on GPU-less runners.' Also note Playwright is not yet a dependency: `npm i -D playwright` + `npx playwright install chromium` is part of the cost.

<details><summary>Sources (4)</summary>

- [A] Chromium docs — Using Chromium with SwiftShader (--enable-unsafe-swiftshader) — https://chromium.googlesource.com/chromium/src/+/refs/heads/main/docs/gpu/swiftshader.md
- [A] Chrome Platform Status — Remove SwiftShader fallback — https://chromestatus.com/feature/5166674414927872
- [B] createIT — Headless Chrome: testing WebGL using Playwright (practitioner) — https://www.createit.com/blog/headless-chrome-testing-webgl-using-playwright/
- [B] Promaton — Testing 3D applications with Playwright on GPU (practitioner postmortem) — https://blog.promaton.com/testing-3d-applications-with-playwright-on-gpu-1e9cfc8b54a9

</details>

### testing-vr.2 Full-canvas pixelmatch baselines per canonical gate state — the regression net between the 55 points

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Medium · impact High · when: SESSION 24/25, after item 1 is green

The point-gate samples 41 points + 14 edge scans; everything between them is unprotected (the SESSION-19 class of bug — a sleeve rendering on the wrong slot — is invisible to probes that don't land on it). Industry-standard fix: capture one full-frame screenshot per frozen canonical state and diff against a committed baseline with pixelmatch (default comparator in both Playwright and Vitest; threshold ~0.1 YIQ/perceptual metric, AA pixels excluded by default via includeAA=false, budget via a mismatched-pixel ratio). Critical caveat from both Playwright and Vitest docs: rendering is not deterministic ACROSS environments (OS/browser/GPU), so baselines must be generated in the exact environment that compares them — i.e. CI-generated, platform-suffixed baselines, never local macOS captures compared on ubuntu.

**Why this call for THIS repo:** Additive per FIDELITY_GATE.md: the gate's own v2 history shows misses between probes forced two render fixes only because glyph probes happened to land on the ink. But it must be re-framed to repo idiom: baselines are SELF-regression (previous accepted render), NOT OG truth — the OG 1:1 authority stays with frame-measured probes per the CLAUDE.md 'frame wins' invariant; a screenshot baseline must never be updated to silence a diff without a fidelity-gate green first.

**Implementation note:** Ride item 1's Playwright job: after the gate verdict, for each of the 5 canonical states (fighting, vs-intro via DuelIntro.devHoldAt, fight-splash, result-win, result-defeat) take page.screenshot() of the canvas element and pixelmatch against baselines committed under tests/fixtures/screens/<state>-chromium-linux.png. Determinism prerequisites already exist (item 5). Start with includeAA default (AA excluded) + small pixel budget (~0.1% mismatched ratio); tighten after a week of green. Update flow: intentional render change → regenerate in CI → review the diff image in the PR.

**⚠ Verifier correction (WINS over the claim above):** Change 'threshold ~0.1 YIQ/perceptual metric' to: 'threshold default 0.1, perceptual difference computed in OKLab with the HyAB metric (pixelmatch v7 — YIQ was the pre-v6 metric); Vitest's built-in comparator defaults to threshold 0.2 plus allowedMismatchedPixelRatio, so choose the numbers explicitly rather than inheriting them.' Also state precisely that 41 points = 40 committed FIDELITY_PROBES + 1 runtime probe (enemy-bar-green) built in src/game/fidelity.ts, and that the fighting state has no fighter-body probe at all — that is the gap this item closes.

<details><summary>Sources (4)</summary>

- [A] Playwright — Visual comparisons (toHaveScreenshot, platform-suffixed baselines) — https://playwright.dev/docs/test-snapshots
- [A] pixelmatch — options, AA detection, perceptual color metric — https://github.com/mapbox/pixelmatch
- [A] Vitest — Visual Regression Testing guide (environment-pinned references) — https://main.vitest.dev/guide/browser/visual-regression-testing
- [B] TestDino — Playwright visual testing: CI diffs & baseline setup (practitioner) — https://testdino.com/blog/playwright-visual-testing

</details>

### testing-vr.3 Vitest 4 browser mode + toMatchScreenshot as the screenshot harness

**⛔ REJECT** · verify: **CONFIRMED** · effort Medium · impact Low · when: not scheduled

Vitest 4 (repo is on ^4.1.10) stabilized browser mode and shipped first-party toMatchScreenshot visual regression with pixelmatch, stable-screenshot detection, and __screenshots__ baseline management — consolidating unit + visual tests under one runner, using Playwright as the provider underneath.

**Why this call for THIS repo:** Churn here: the repo already owns a page-level browser harness (window.__fidelity + ?fidelity=auto in src/main.ts) that drives whole-game states — vitest browser mode would be a SECOND browser boot path wrapping the same Phaser instance; and .githooks/pre-commit runs bare `npx vitest run`, so a browser-mode project would drag a 60-120s full-game boot into every commit (FIDELITY_GATE.md runtime note) unless fenced with extra projects-config machinery. Items 1+2 get the same coverage reusing the existing harness with one thin script. Revisit only if component-level (non-whole-game) render tests ever emerge.

**Implementation note:** If adopted later despite this: fence it as a separate vitest project excluded from the default `npm test` run so pre-commit stays fast.

<details><summary>Sources (3)</summary>

- [A] Vitest 4.0 release blog — browser mode stable, toMatchScreenshot — https://vitest.dev/blog/vitest-4
- [A] Vitest — Visual Regression Testing guide — https://main.vitest.dev/guide/browser/visual-regression-testing
- [C] heise online — Vitest 4.0 brings visual regression testing — https://www.heise.de/en/news/JavaScript-Testing-Framework-Vitest-4-0-Brings-Visual-Regression-Testing-10814342.html

</details>

### testing-vr.4 Failure artifacts: dump per-state canvas PNGs (+ diff images) when the CI gate goes red

**✅ ADOPT** · verify: **CONFIRMED** · effort Low · impact Medium · when: with item 1

A red visual check is only actionable if you can SEE what rendered. Playwright's screenshot APIs make per-state canvas dumps trivial, pixelmatch emits a diff image highlighting differing pixels, and GitHub Actions upload-artifact preserves them per run — standard practice in every VRT setup surveyed.

**Why this call for THIS repo:** The __fidelityAuto verdict in src/main.ts is deliberately compact — failures carry expected/actual hex and deltas but no image, which is fine for a human at a local Brave console but leaves a remote CI red undiagnosable. Low-cost extension of item 1's script: on pass!==true, page.screenshot() each canonical state and upload as workflow artifacts.

**Implementation note:** Fold into item 1's script (~15 extra lines); once item 2 lands, also attach the pixelmatch diff PNGs. No change to src/ needed — the harness already drives states from outside via __fidelity.

<details><summary>Sources (3)</summary>

- [A] pixelmatch — diff output image — https://github.com/mapbox/pixelmatch
- [A] Playwright — Visual comparisons (actual/expected/diff attachments) — https://playwright.dev/docs/test-snapshots
- [C] Testrig — visual regression with Playwright and pixelmatch (practitioner walkthrough) — https://testrig.medium.com/visual-regression-testing-with-playwright-and-pixelmatch-002770005019

</details>

### testing-vr.5 Determinism prerequisites for stable screenshots (freeze animations, seed randomness, fixed timestep)

**✔️ ALREADY DONE** · verify: **WEAKENED — corrections below** · effort Low · impact Low · when: none — prerequisite already met

Every source's #1 flakiness fix for canvas/game screenshots — freeze animation loops via test-only hooks, seed all randomness, pin the timestep, drive known states — is the hard part of game VRT and the usual reason teams give up or drown in tolerances.

**Why this call for THIS repo:** The repo satisfies every prerequisite already: Sim owns a fixed 60Hz step with injected mulberry32 (no Math.random in core — enforced by tests/config-purity.test.ts, proven by tests/determinism.test.ts and determinism-probe.test.ts), and the gate drives frozen canonical states via dev seams (DuelIntro.devHoldAt per FIDELITY_GATE.md v2 slice 2b: vs-intro/fight-splash held mid-sequence, result states launched directly). This is why items 1, 2 and 4 are cheap here — the expensive groundwork all VRT guides warn about is done. No action.

**Implementation note:** Only gap if per-frame-exact diffs ever flake: the gate's settle uses real frames with a manual loop.step() fallback — if a screenshot ever captures mid-tween, add a dev seam to step N sim ticks then capture, mirroring devHoldAt.

**⚠ Verifier correction (WINS over the claim above):** Replace 'injected mulberry32 (no Math.random in core — enforced by tests/config-purity.test.ts)' with: 'injected mulberry32 — Math.random is banned in core by src/core/CLAUDE.md and caught behaviourally by tests/determinism.test.ts (cross-process byte-identical fingerprints) and tests/rng.test.ts, but NOT statically enforced: tests/config-purity.test.ts checks numeric literals and the import graph only, and no eslint rule bans it. If screenshot baselines come to depend on it, adding a Math.random scanner to tests/utils/configPurity.ts is a ~10-line genuinely additive gate.'

<details><summary>Sources (3)</summary>

- [A] Vitest — Visual Regression Testing guide (stability/determinism section) — https://main.vitest.dev/guide/browser/visual-regression-testing
- [C] qatribe — Playwright visual regression guide 2026 (canvas determinism strategies) — https://qatribe.in/playwright-visual-regression-testing/
- [A] Playwright — Visual comparisons — https://playwright.dev/docs/test-snapshots

</details>

**Dead ends this area:** No practitioner source found specifically on Phaser-game screenshot regression testing (searches surfaced generic canvas/WebGL guidance only). The fetched Vitest visual-regression guide does not address WebGL/canvas rendering specifically. GitHub-hosted GPU runners (Dave Snider's gputests piece, surfaced but judged out-of-scope) were considered and dropped — SwiftShader software rendering suffices for a 1024x576 2D vector scene, so no GPU-runner item. Considered forcing Phaser.CANVAS in CI for determinism but rejected without an item: src/main.ts pins type: Phaser.WEBGL and the probe values were measured against the WebGL render path (Earcut-triangulated Graphics), so a CANVAS-renderer CI run would test a render path the game never ships.


---

## Perceptual diff & gate hardening  <a name="fidelity-gating"></a>

> **Verifier's overall note:** Attack summary: 4 of 7 items survive intact, 3 need corrections; none is refutable. No cited URL was dead or fabricated — all six I fetched resolved. The two ADAPT items (1 and 5) are the ones carrying real errors, and both errors are of the same kind: a number or mechanism asserted with more confidence than the evidence behind it supports. Item 1's '16-26/255 measured spreads' conflates the config's TOLERANCES with its recorded SPREADS (which are ≤9, mostly 0-6) — this matters because it was offered as the empirical basis for the proposed pixelmatch threshold, and it is not one; the threshold must be ratchet-calibrated from an actual run with no prior. Item 5's grade-B Techkon and 3dverse citations do not contain the claims hung on them (the dE00 2.0-3.5 acceptability band, and any codec/quantization content at all), and the 'chroma quantized harder than luma' mechanism is backwards for H.264 — though the recommendation survives because 4:2:0's spatial subsampling alone gets you there. Item 6 is the only one hit by the new ledger block, and per the brief that is not the research agent's fault: the 2026-08-12 verify-pass corrections in §S24-H landed after the research ran and explicitly forbid hand-authoring a 15fps/27-55 stepper into core, which is the opposite of what A11.4's commit title suggests — anyone building on item 6 must read that block first. Two incidental staleness findings in the repo, not in the research: FIDELITY_GATE.md says '55 assertions (41 points + 14 edge scans)' while src/config/fidelity.ts now holds 40 + 14 = 54, and the doc's v2 backlog still lists 'Bar gradients' as not-yet-asserted although the config now carries four hp/chi gradient probes and a BAR_GRADIENTS export. Worth a doc-refresh commit independent of this research.

### fidelity-gating.1 Masked full-frame pixelmatch diff over the 5 canonical states — the ONE orthogonal metric

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Medium · impact High · when: SESSION 24/25 (next fidelity slice)

pixelmatch (mapbox) is a zero-dependency, few-hundred-line comparator on raw typed arrays: per-pixel perceptual color distance (YIQ historically, OKLab HyAB in current releases) with a 0-1 threshold plus anti-aliasing detection that excludes sub-pixel edge jitter. Playwright's toHaveScreenshot wraps exactly this (threshold = YIQ distance, default 0.2; maxDiffPixelRatio for area budget). A full-frame diff sees everything BETWEEN probes: global color drift on unprobed regions, a stray/missing element, a deformed HUD shape whose probed points still pass.

**Why this call for THIS repo:** FIDELITY_PROBES + FIDELITY_SCANS (src/config/fidelity.ts) assert 55 places; the gate's own history (FIDELITY_GATE.md v1: 14/17 FAIL found only when probes landed; slice 2b: olive-band misread found only on re-measurement) proves whole regions go unwatched. BUT it cannot be a CI gate: reference frames are study-only/local-only per docs/MASTER_SPEC.md and reference/ is gitignored (the exact constraint that forced silhouette.ts's sealed-score design), so this must live beside scripts/art/compareToSource.py as a LOCAL diagnostic layer, run via the existing __fidelity harness states with masks over dynamic regions (fighters, bar fills, fraction labels).

**Implementation note:** Add pixelmatch as a devDependency (test tooling, not a game image asset — procedural-art rule untouched). Extract one reference PNG per canonical state from the already-measured frames (B t=3772-3776, t=3771.55, t=3773.5, t=3783.5; A t=3361-3364), downscale 1920x1080 → 1024x576, keep them in gitignored reference/. Compare renderer.snapshot readback vs frame with threshold ≈0.25-0.3 (H.264 headroom; the repo's own measured per-channel spreads of 16-26/255 land in this range) + a committed mask per state; report diff-pixel ratio per state and write the diff PNG for eyes. Calibrate the ratio floor the repo's way: run it, record the measured value, ratchet like a6Score.test.ts floors.

**⚠ Verifier correction (WINS over the claim above):** (1) The gate currently asserts 54 places, not 55: src/config/fidelity.ts holds 40 entries in FIDELITY_PROBES and 14 in FIDELITY_SCANS. FIDELITY_GATE.md's '55 assertions (41 points + 14 edge scans)' is stale relative to the config — cite the config, not the doc. (2) Strike 'the repo's own measured per-channel spreads of 16-26/255 land in this range'. The repo's recorded per-point SPREADS are ≤9 and mostly 0-6 ('zero spread', '≤1', '≤2', '≤3', '≤4', '≤6', and 'spreads ≤9' on the bar-gradient rows). 16-26 are the committed TOLERANCES (tol values in the file are 10, 16, 18, 20, 22, 24, 26). So no measured spread justifies a 0.25-0.3 pixelmatch threshold. (3) pixelmatch's threshold is a normalized perceptual (OKLab) distance, not a per-channel /255 quantity, so there is no arithmetic conversion from a tol of 26 to a threshold value — the number must be ratchet-calibrated empirically from an actual run, exactly as the item's last sentence already says. Also note pixelmatch's OWN default threshold is 0.1 (README); 0.2 is Playwright's default, correctly attributed.

<details><summary>Sources (3)</summary>

- [A] mapbox/pixelmatch (fetched: options, OKLab, AA detection, zero deps) — https://github.com/mapbox/pixelmatch
- [A] Playwright SnapshotAssertions — threshold/maxDiffPixelRatio semantics — https://playwright.dev/docs/api/class-snapshotassertions
- [C] Screenshot Diffing: Pixel-Level Comparison Techniques (dev.to) — https://dev.to/dennis-ddev/screenshot-diffing-pixel-level-comparison-techniques-18k

</details>

### fidelity-gating.2 pixelmatch/SSIM as the render-vs-render CI regression gate

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Low · when: now (no-op)

Standard practice (Playwright, Argos, most VRT stacks) is tolerance-based per-pixel or SSIM diffing of screenshots to absorb AA jitter, font hinting, and GPU nondeterminism between runs.

**Why this call for THIS repo:** tests/poseRender.test.ts's rasterDigest golden is strictly stronger for this repo: the headless rasteriser (scripts/art/rasterise.ts) is pure exactly-specified arithmetic with no GPU/font/AA nondeterminism, so an EXACT digest is achievable and already caught 1/8-pixel sub-sample shifts and a 1px crop change that a tolerance diff is designed to forgive. The flake classes these tools exist to absorb do not occur on that path; adopting one there would be a sensitivity downgrade.

**Implementation note:** No action. Keep new render gates on the headless raster path where exact digests are possible; reserve tolerance diffing for browser-canvas-vs-video comparisons only (item 1).

<details><summary>Sources (2)</summary>

- [A] Playwright SnapshotAssertions — https://playwright.dev/docs/api/class-snapshotassertions
- [C] Screenshot Comparison Algorithms: A Visual Testing Guide (Wopee.io) — https://wopee.io/blog/screenshot-comparison-algorithms-visual-testing/

</details>

### fidelity-gating.3 Perceptual hashes (pHash/dHash) for fidelity gating

**⛔ REJECT** · verify: **CONFIRMED** · effort Low · impact Low · when: never

pHash/dHash compress an image to a 64-bit fingerprint that is deliberately ROBUST to small changes — scaling, compression, brightness shifts — and are recommended for dedup/similarity candidate retrieval, with the explicit caveat that a hash match is a candidate, not identity, and subtle changes are missed by design.

**Why this call for THIS repo:** Invariance to small differences is the anti-goal here. The A6-C companion gate in tests/a6Score.test.ts pins the fighter's height overshoot inside a 0.10-0.12 band precisely because a 6% drift is a defect in this repo; a pHash cannot see the 11% overshoot it exists to watch, nor the ≤26/255 color deltas FIDELITY_PROBES assert. Wrong tool class for a 1:1 project.

<details><summary>Sources (3)</summary>

- [C] pHash vs dHash comparison (ssojet) — https://ssojet.com/compare-hashing-algorithms/phash-vs-dhash
- [C] Perceptual Hashing (pHash/dHash) — System Designer — https://www.systemdesigner.net/technology/perceptual-hashing
- [C] What Is Perceptual Hashing and How Platforms Use It (MetaGhost) — https://metaghost.io/blog/what-is-perceptual-hashing-and-how-platforms-use-it

</details>

### fidelity-gating.4 SSIM / MS-SSIM as an additional gate score

**⛔ REJECT** · verify: **CONFIRMED** · effort Medium · impact Low · when: never

SSIM compares luminance/contrast/structure in local windows and MS-SSIM adds a multi-scale pyramid; both correlate with human judgment better than MSE and are the standard 'perceptual' VRT upgrade. Practitioner guidance: scores >0.99 read 'virtually identical', <0.95 'visibly different', and it is recommended as a per-page targeted fix after containerizing rendering, not a suite-wide default.

**Why this call for THIS repo:** An aggregate windowed score with folklore thresholds contradicts the repo's probe idiom — FIDELITY_GATE.md's 'Adding probes' rule requires every assertion to be measured-first with per-point provenance, and each probe doubles as a position pin. SSIM localizes worse than pixelmatch's diff mask (item 1) while costing a real implementation (Gaussian windows, pyramid) against zero-dep pixelmatch; it buys nothing item 1 doesn't, at more maintenance. If a structural score is ever wanted, the silhouette widthProfile in scripts/art/silhouette.ts already IS the domain-specific structural metric, with ratcheted floors.

<details><summary>Sources (3)</summary>

- [B] Structural similarity index measure (Wikipedia) — https://en.wikipedia.org/wiki/Structural_similarity_index_measure
- [C] MS-SSIM: Multiscale Structural Similarity (EmergentMind) — https://www.emergentmind.com/topics/multiscale-structural-similarity-score-ms-ssim
- [C] Visual Regression Testing with TestInspector: SSIM comparison — https://www.astaqc.com/software-testing-blog/visual-regression-testing-testinspector-ssim-screenshot-comparison

</details>

### fidelity-gating.5 CIEDE2000-derived tolerances for the lossless-PNG refinement pass, with chroma-aware headroom

**🔧 ADAPT** · verify: **WEAKENED — corrections below** · effort Low · impact Medium · when: Stage 2-3 (when the queued lossless refinement runs)

CIEDE2000 (dE00) is the CIE-recommended perceptual color difference: ~1.0 is just-noticeable, 1.0-2.0 visible to a trained eye, 2.0-3.5 the usual commercial acceptability limit. Separately, H.264 4:2:0 chroma subsampling stores chroma at quarter resolution and quantizes it harder than luma, so video-derived color error is systematically larger in chroma than luma — a flat per-channel RGB tolerance conflates the two.

**Why this call for THIS repo:** FIDELITY_GATE.md's v2 backlog already queues 'Color refinement from lossless sources: re-measure the palette against the wiki PNGs and tighten tolerances' — dE00 gives that pass a principled target (tighten each probe's tol to the per-channel delta corresponding to dE00 ≈ 2) instead of ad-hoc shrinking. Do NOT change the assertion math: src/core/fidelityCompare.ts stays per-channel max-delta (zero-literals core purity; simple, diagnosable), dE00 is used offline to DERIVE the committed tol numbers, recorded in each probe's provenance note as the notes already record spreads.

**Implementation note:** During the lossless-refinement pass: for each probe with a wiki-PNG counterpart, compute dE00 between authored and video-derived color; where the source is lossless, tol can drop toward ~6-10/channel; where only video exists, keep asymmetric headroom (chroma-heavy colors keep larger tol than near-gray/luma-dominated ones). One scratch Python script, no runtime change.

**⚠ Verifier correction (WINS over the claim above):** Restate the claim as: 'CIEDE2000 (dE00) is the CIE-recommended perceptual color difference; dE00 ≈ 1.0 is the just-noticeable threshold (Techkon; corroborated by zschuessler's ≤1 not perceptible / 1-2 on close observation / 2-10 at a glance). Any tighter commercial-acceptability figure must be sourced separately — neither cited page supports 2.0-3.5. Separately, H.264 4:2:0 stores chroma at one quarter the sample count of luma (half horizontal AND half vertical), so video-derived color error is systematically larger in chroma than luma through SPATIAL AVERAGING AND BLEED, not through harsher quantization — H.264 in fact derives chroma QP from luma QP via a mapping table capped below the luma range. Cite the chroma-subsampling article for the sampling fact only; drop the 3dverse devlog, which is a color-science primer and contains no codec-parameter content.' The operational recommendation is unchanged and still stands: derive tol offline via dE00 ≈ 2, keep asymmetric headroom so chroma-heavy colors retain larger tol than near-gray ones.

<details><summary>Sources (4)</summary>

- [B] Delta E: Demystifying the CIE dE2000 Formula (Techkon) — https://techkon.datacolor.com/demystifying-the-cie-delta-e-2000-formula/
- [C] Delta E 101 (zschuessler) — http://zschuessler.github.io/DeltaE/learn/
- [B] Chroma subsampling (Wikipedia) — https://en.wikipedia.org/wiki/Chroma_subsampling
- [B] Color Science From the Purview of H.265 (3dverse devlog) — https://docs.3dverse.com/devlog/2025/08/07/video-compression-concepts-part-1

</details>

### fidelity-gating.6 Temporal/animation fidelity metric (per-beat pose comparison)

**📐 MEASURE FIRST** · verify: **WEAKENED — corrections below** · effort High · impact High · when: SESSION 25+ (after a §S25 timing-extraction pass)

All surveyed comparison metrics (pixelmatch, SSIM, hashes, dE) are single-frame; none grade motion. Temporal errors — wrong beat timing, wrong stride cadence, wrong stroke lifecycle order — are a failure class no static gate can see, and VRT practice handles animation by FREEZING it, not by grading it.

**Why this call for THIS repo:** This IS the biggest structural hole — the gate samples 5 frozen states and A6-C scores one static pose — but the ledger shows the prerequisite is OG measurement, not a metric: COMBAT_MEASUREMENTS.md §S24-A (stroke lifecycle) and the SESSION23 A11.4 15fps stepper already established that the OG's animation truth is only recoverable at the video's sampling floor. Before any temporal metric, extract per-beat OG timings (beat durations for intro VS→FIGHT!, gait cycle period, stroke phase lengths) as ledger rows; the metric then reduces to cheap scalar assertions on the sim's timeline (config-pinned, like tests/config-values.test.ts), not image diffing.

**⚠ Verifier correction (WINS over the claim above):** Replace the A11.4 justification with the ledger's own 2026-08-12 verify-pass correction #4: the 27/55 rhythm is NOT a game-side stride but 'the OG's internal update quantum (~27.4 px) beating against the 15 fps capture', and the 60fps '4-frame content block' defence is 'VOID — that is a property of the capture (§00), not of the game'. The ruling is: 'build the Sim mover constant-speed at 60 Hz; compare fidelity at capture level (15 fps sampling), where the quantization reappears on its own. Do NOT hand-author a 27/55 stepper into core.' So the 15 fps floor is a MEASUREMENT limit, not the animation model — a temporal gate must assert 60 Hz sim scalars and only DOWNSAMPLE to 15 fps for comparison. The extraction pass must also inherit the block's corrected numbers: dash modelled as constant-speed line-follow ~616 px/s @1080 (~274 world px/s), range ~40-49 px/tick, plus a terminal contact snap of +139-192 px in one tick; run core quoted 573-685 px/s @1080; HEAVY stroke band 146-~275.

<details><summary>Sources (2)</summary>

- [B] How to stabilize flaky screenshots for visual testing (Argos co-founder; fetched) — https://dev.to/jsfez/how-to-stabilize-flaky-screenshots-for-visual-testing-1529
- [C] Screenshot Comparison Algorithms (Wopee.io) — https://wopee.io/blog/screenshot-comparison-algorithms-visual-testing/

</details>

### fidelity-gating.7 Canvas screenshot flake control checklist

**✔️ ALREADY DONE** · verify: **CONFIRMED** · effort Low · impact Low · when: now (no-op)

Practitioner flake control for canvas/screenshot pipelines: wait for full resource load, freeze/remove animations, mask dynamic content, fix datasets, standardize the render environment; for WebGL canvases specifically, read pixels in the same event as the render or set preserveDrawingBuffer, since the drawing buffer is cleared on composite.

**Why this call for THIS repo:** The harness already implements the whole checklist in repo idiom: src/game/fidelity.ts settleFrames waits real frames with a manual game.loop.step() fallback for rAF throttling; snapshot() uses Phaser's renderer.snapshot (which reads at render time, sidestepping the preserveDrawingBuffer trap) after a settled frame; dynamic content is frozen by design (devHoldAt intro beats, sim-stepped FIGHTING_SETTLE_MS, localStorage backup/restore per FIDELITY_GATE.md); font flake was eliminated by making the VS/FIGHT! glyphs procedural polygons (FIDELITY_GATE.md slice 2b). Remaining known flake source (hidden-tab rAF freeze) is documented in the browser-gate-polling memory with the visible-tab rule.

**Implementation note:** No action. If item 1 ships, reuse the existing snapshot()/settleFrames path unchanged — do not add a second readback mechanism.

<details><summary>Sources (2)</summary>

- [B] How to stabilize flaky screenshots for visual testing (Argos; fetched) — https://dev.to/jsfez/how-to-stabilize-flaky-screenshots-for-visual-testing-1529
- [B] WebGL tips — Taking a screenshot of the canvas (webglfundamentals) — https://webglfundamentals.org/webgl/lessons/webgl-tips.html

</details>

**Dead ends this area:** No practitioner postmortem found for the exact problem shape "gating a procedural game render against compressed video frames of a dead game" — emulator/recreation communities appear to eyeball this; the repo's median-across-frames + per-channel-headroom practice is better documented than anything found. No 2024-2026 source gives a defensible NUMERIC per-channel RGB tolerance for H.264-sourced references (the IEEE chroma-subsampling perceptual study surfaced was paywalled and only tangential), so item 1's threshold must be ratchet-calibrated empirically, repo-style. Searches for MS-SSIM or IoU used specifically for game-silhouette regression gating returned only generic IQA literature — nothing contradicting the repo's bespoke widthProfile approach.

---

*Assembled 2026-08-13 from 32 agent returns (16 research + 16 verify). Raw returns in `improvements-raw/`. The 2026-08-12 session-limit interruption cost zero data: all results were journaled and the 10 dead verifiers were re-run in two batches on Opus 5.*
