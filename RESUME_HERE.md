# RESUME HERE

## 📋 NEXT-SESSION KICKOFF (paste-ready)

**Activate first** — turn these on BEFORE pasting; a fresh session won't do it for you:

| | setting | why |
|---|---|---|
| **Surface** | **Claude Code CLI** | terminal + git + build-heavy; the browser gate needs the Chrome extension |
| **Model** | **Fable 5** at **`high`** | long-horizon, gate-driven; `high` is Fable's own default — never carry Opus's `xhigh` over. (Working closely interactive instead? Opus 5 `high` is the routing rule's alternative.) |
| **Context** | **fresh session** | the kickoff is self-contained |
| **MCP** | **Claude in Chrome** — on | the 55/55 fidelity gate + the duel-scene look |
| **Ultracode** | ON helps A11.3 | the animation transcription fans out per-animation cleanly; A11.1/A11.2 are serial-surgical |

Copy everything **between** the `'''` lines (the markers themselves are not part of the prompt):

```
'''
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

READ FIRST, then tell me what they say before writing anything:
- RESUME_HERE.md
- docs/sessions/SESSION23_KICKOFF.md   <- the only kickoff to plan from, self-contained

THE JOB: §4 A11.1 onward — the gap triage is DONE and in the kickoff §0.
Highest-leverage first: make DuelScene draw the composed OG fighter (it still
calls drawSamurai), both combatants mirrored, then transcribe walk + one attack
from the bindata and make the fighter MOVE at the measured 15 fps latch.

WHAT NOT TO BREAK:
- Floors: tracing >= 0.9005, held-out >= 0.8490 (re-based ONCE by my ruling,
  spent - from here UP only), height <= 140.5.
- duel-baseline green AND unedited - behaviour cannot move because art changed.
- src/core/ zero numeric literals; scenes render-only; red-first; chaos-plant.
- Animations are TRANSCRIBED and byte-checked, never hand-keyed (§1 D4).
- "A green gate is not a good picture" - LOOK at the moving duel, both fighters.

PROVE IT: every §2 gate has a runnable measure. Paste the output, never assert.
NO research this session - audio and combat numbers are SCHEDULED (§0 P3/P4).

FIRST, DO THIS: confirm the baseline (git log -1 + npm test -> 52 files / 855
tests), then propose the exact A11.1 step. Don't start until I ok it.
'''
```

**Bar verdict: ✅ this kickoff meets the "cannot be improved further" bar** — the
owner's gap-triage ask is executed (not deferred), every goal has a measure that
can fail, research is scheduled-not-started, and the spent floor ruling is
carried as a closed door. The next change would be churn.

---

> ## ▶ SESSION 23 IN FLIGHT — A11.1–A11.3 LANDED: COMPOSED, MIRRORED, AND THE FIRST FOUR ANIMATIONS ARE CONTRACT.
> **55 files / 880 tests green** · fidelity 55/55 autonomous ·
> - **A11-D (GATE):** `walk` (20f, loop) + `balancedhorizontalslash` a/b/c
>   (4/9/7f — the balanced-stance basic attack) transcribed VERBATIM from the
>   bindata by `scripts/anim/transcribeAnims.py` → `src/config/ogAnims.ts`
>   (710 nodes, all integers, GENERATED header). Byte-checked by
>   `tests/a11AnimData.test.ts` (12 tests: 8 structural run-everywhere + 4
>   skipIf byte-suites); chaos-proven — a ONE-DEGREE typo in one node of 710
>   goes red. Grammar finds for A11.4: slash frames carry Flash MATRIX nodes
>   (`a..d` fixed-point ×100, notably weapon slot 3 mid-swing); part-c frames
>   are SPARSE (changed nodes only — carry-forward is the stepper's job);
>   parts chain a→b(loop)→c.
> - **NEXT: A11.4** — the pure `core/` stepper (15 fps latch, sparse
>   carry-forward, matrix-node planning) + DuelScene playback; then A11.5
>   re-grade + SESSION 24 kickoff (P3 audio scheduled).

> ## ▶ A11.2 LANDED: BOTH COMBATANTS COMPOSED, FACING EACH OTHER.
> **54 files / 868 tests green** · tsc ×2 → 0 · eslint → 0 · fidelity **55/55
> PASS ×2 consecutive, autonomous** · `Sim.ts` + duel-baseline byte-untouched.
> - **A11-B (GATE):** mirroring is a COMPOSE-TIME transform (kickoff D3) — a
>   `mirror` flag on `composePose` (tag) + ONE math site in `planPose`
>   (reflect rotated shape-locals AND the node x). `tests/a11Mirror.test.ts`
>   (4 tests, red-first, chaos-planted with the P4 half-flip) pins the WHOLE
>   mirrored plan as the exact x-reflection of the unmirrored plan — the
>   branch cannot be wrong in either facing if the reflection is exact.
>   DuelScene picks per fighter per frame from sim truth (fighters can cross).
>   LOOK verified: enemy faces the player, branch behind the correct hip.
> - **Fidelity flake ROOT-CAUSED (not tuned away):** the harness's
>   `devHoldAt` races the restarted intro's `create()` — the stale scene
>   object still says `step:'done'`, the hold no-ops, `create()` nulled it,
>   and the FIGHT!-glyph probes sampled the free-running VS beat's black
>   stroke gaps. Fix: `DuelIntro.create()` now RE-APPLIES a pre-recorded hold.
>   The 8 s settle "fix" was coincidence and is reverted (1 s, comment tells
>   the story). Post-fix: 55/55 ×2 under multi-window GPU load.
>
> *(A11.1 record below.)*

> ## ▶ A11.1 LANDED: THE DUEL DRAWS THE COMPOSED OG FIGHTER.
> **53 files / 864 tests green** (was 52/855) · tsc ×2 → 0 · eslint → 0 ·
> fidelity **55/55 PASS — now AUTONOMOUS** (`?fidelity=auto` + a self-opened
> browser window + a localStorage verdict; no human window-holding) ·
> duel-baseline green AND unedited · `src/core/` untouched · fighter height
> 140.484 (≤ 140.5) on the duel ground line (`OG_DUEL_STAGE.groundOffsetY`).
> - **A11-A:** `drawSamurai` count in `DuelScene.ts` → **0**, pinned by
>   `tests/a11DuelFighter.test.ts` (9 tests, watched red first, chaos-planted).
>   Both combatants draw the composed DRESSED fighter via
>   `composePose → planPose → drawPlan` (drawPlan grew an alpha param for the
>   spawn-invuln blink; `OgArtScene`/`IdleFighterScene` unaffected).
> - **Owner LOOK (2026-07-28):** fighters confirmed on screen, correct scale +
>   ground line — and STATIC, as staged (frame-0 idle; motion is A11.3/A11.4).
>   Both face the same way: the A11.2 mirror is visibly needed.
> - **Environment finds (permanent):** the Claude browser extension lives in
>   **BRAVE, not Google Chrome** — surface windows with
>   `open -na "Brave Browser" --args --new-window <url>`; a hidden tab freezes
>   rAF (and the game), which is WHY `?fidelity=auto` exists; its 8 s settle is
>   deliberate (at 1 s the two FIGHT!-glyph probes race boot warm-up and read
>   black — measured, not guessed).
> - **Process confession (ledgered):** a chaos-plant restore via `git checkout`
>   briefly wiped the uncommitted swap; re-applied and re-verified from scratch.
>   Rule: surgically remove the plant, never checkout a dirty file.
> - **NEXT: A11.2** (second combatant mirrored, compose-time transform, P4
>   equipment-override interaction — compose test FIRST), then A11.3
>   (transcriber: walk + one attack, byte-checked), A11.4 (15 fps stepper),
>   A11.5 (re-grade + SESSION 24 kickoff, P3 audio scheduled).

---

> ## ▶ SESSION 22 CLOSED IN FULL — ALL SEVEN GARMENTS IN THE OG GRAMMAR, GI LANDED BY OWNER RULING.
> **52 files / 855 tests green** (was 49/827) · tsc ×2 → 0 · eslint → 0 ·
> fidelity **55/55** · clean clone green · 0 app console errors ·
> **tracing 0.900547 (floor 0.9005) · held-out 0.849033 (floor RE-BASED 0.8618 → 0.8490
> by the owner's ruling 2026-07-28, cited in tests/a6Score.test.ts — the one
> sanctioned down-move, spent; UP only from here) · height 140.48 (≤140.5).**
> **A9.4 by ruling** ("not perfect, but i will accept it for now"): balloon cut,
> GATE A9-E green red-first (hem-overhang 3.50 → 0.40 local px), LEGACY and the
> A8 ratchet table now EMPTY — every exit by re-authoring or ruling, never by a
> raised number. Commit `ed25c20`.
>
> **Commits:** `f7e3801` targets → `354891a` A9.1 grammar gate → `dc9bea6` A9.2
> collar+sleeve → `bd994ba` A9.3+A9.5 kasa/hakama/obi (fan-out) → `2112b84`
> A9.6 branch. Ledger: `docs/DIVERGENCES.md` "SESSION 22 — …" (five entries).
>
> - **GATE A9-A/B/C/D:** six of seven garments re-authored in the OG grammar —
>   every ink share ≤ 61.4 % (the OG's own worst; was 75.9/70.6 on the owner's
>   two), every tone within 12 of its committed p25/p75 target (five byte-exact
>   0), collar base = the SWF's own `#dcd9d4`, hakama MEASURED_FLAT `#dcd9d4`.
> - **GATE A9-F:** the branch is on screen at rotation 38 — the measured mirror
>   of the recorded 142 (`142 = 180 − 38` CONFIRMED, source axis +39.9°±2,
>   residual 0.6°). ⭐ The mirror flips the POSITION too (x sign) — found by
>   LOOKING, fixed by bbox-fraction measurement + floor-bounded sweep.
> - ✅ **The gi ruling** — RESOLVED (see header above); the cause story stays
>   in the A9.3+A9.5 and A9.4 ledger entries.
> - **Still open (owner):** the kasa height trade (SESSION 21 §P6, unchanged).
> - **Tools built:** `reauthorGarment.py` (grammar re-authoring, D4 SWF
>   preference, measured shadows) · `grammar.ts`/`inkShareLib.ts` (the paint
>   ruler in the suite) · `OG_EQUIPMENT`/`OG_DRESSED_NODES` (equipment facings
>   without touching the byte-checked pose) · traceGarment clobber guard.
> - **Process finds (ledgered):** the no-game-imports guard improved A9.1's
>   design; a coordinate-space misread nearly condemned a valid gate (control-
>   frame check caught it); parallel agents' whole-figure scores are
>   contaminated by siblings mid-flight — per-shape measures are not.

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
1. ✅ ~~THE GI RULING~~ — RESOLVED 2026-07-28: owner accepted ("not perfect,
   but i will accept it for now, will change later, in another session");
   landed as `ed25c20`. Any later gi change is a fresh owner ask.
2. **The kasa height trade** (SESSION 21 §P6) — measured, open, unchanged.
3. **Look at the moving duel next session** (§5 item 9 of the S23 kickoff) —
   band_B also changed when the gi landed; a fresh look is queued there.

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
