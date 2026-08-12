# RESUME HERE

## 📋 NEXT-SESSION KICKOFF (paste-ready)

**Activate first** — turn these on BEFORE pasting; a fresh session won't do it for you:

| | setting | why |
|---|---|---|
| **Surface** | **Claude Code CLI** | terminal + git + build-heavy; the fidelity gate needs the browser extension |
| **Model** | **Fable 5** at **`high`** | long-horizon, gate-driven; `high` is Fable's own default — never carry Opus's `xhigh` over |
| **Context** | **fresh session** | the kickoff is self-contained |
| **MCP** | **Claude in Chrome** — on (the extension lives in **BRAVE**) | `?fidelity=auto` + the duel LOOK |
| **Ultracode** | ON helps A12.1 + A12.3 | frame-counting fans out per-sequence; transcription per-animation |

Copy everything **between** the `'''` lines (the markers themselves are not part of the prompt):

```
'''
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

READ FIRST, then tell me what they say before writing anything:
- RESUME_HERE.md
- docs/sessions/SESSION24_KICKOFF.md   <- the only kickoff to plan from, self-contained

THE JOB: §4 A12.2 onward — my three verdicts on the moving duel ARE the session.
The A12.1 measurements are ALREADY BANKED AND VERIFIED (ledger §S24 + the
§S24-H "Verify-pass corrections" block, 2026-08-12 — do NOT re-measure):
implement the stroke cap + slash-vs-move rule in the Sim behind the
duel-baseline's own atomic re-record protocol, then transcribe run_sheathed +
death + the hit answer and make the gait and impacts real.

WHAT NOT TO BREAK:
- Floors: tracing >= 0.9005, held-out >= 0.8490 (spent - UP only), height <= 140.5.
- duel-baseline moves ONCE, deliberately: DIVERGENCES entry -> sim change ->
  re-record, ONE atomic commit (its own header's protocol). Twice = re-measure.
- src/core/ zero numeric literals; scenes render-only; red-first; chaos-plant.
- Animations TRANSCRIBED and byte-checked, never hand-keyed; the anim-key pins
  extend in the same commit, deliberately.
- "A green gate is not a good picture" - I look at the moving duel before close.

PROVE IT: every §2 gate has a runnable measure. Paste the output, never assert.
NO audio work - SESSION 25 owns it (scheduled in the kickoff).

FIRST, DO THIS: confirm the baseline (git log -1 + npm test -> 56 files / 894),
read ledger §S24 + its verify-corrections block, then propose the exact A12.2
implementation plan (stroke cap + classification). Don't start until I ok it.
'''
```

**Bar verdict: ✅ this kickoff meets the "cannot be improved further" bar** — the
owner's three LOOK verdicts are the session by name, each with a measurable gate;
gameplay moves only behind measured values and the baseline's own atomic
protocol; audio is scheduled (SESSION 25), not dropped. The next change would be churn.

**⚠ 2026-08-12 update — A12.1 is BANKED, session starts at A12.2:** the
measurement half ran 2026-07-29 (`COMBAT_MEASUREMENTS.md` §S24) and its
3-skeptic adversarial verify — killed that day by credit exhaustion — was
re-run from the preserved script and landed 2026-08-12: all three verdicts
**WEAKENED-with-corrections** (reach band HEAVY top ~275, point-blank damage
resolves ON DRAW at 17, the 27/55 "stride" is capture aliasing of a constant
~616 px/s mover — full list in §S24-H "Verify-pass corrections", which WINS
over the raw §S24 rows). The kickoff above and `SESSION24_KICKOFF.md` §4
carry the same note. Also corrected: the true suite count is **56 files /
894** (the S23 wrap banner's "57" was a miscount, re-measured 2026-08-12).

---

## 🔁 THE GAUNTLET — the standing engine (adopted 2026-08-13)

**`docs/GAUNTLET.md`** is now the method every session runs: a self-re-arming
gauntlet-loop over **all 12 systems**, one **lane** per run, each lane binary-gated
and crash-survivable. Session kickoffs still own *current state*; the gauntlet owns
*how the work is done*. Its §5 is the paste-ready prompt.

**Two things from it that change what the next session should do:**

1. **§0 — every critic is an ARTIFACT critic.** This game is dead (P0, definitive):
   no agent has ever seen it run, so "compare it to the real game" MUST mean a frame
   under `reference/frames/`, a row under `reference/extracted/`, a byte-check, a
   ledger number carrying its own frame cite, or Kheshav's logged LOOK. A verdict
   citing memory is VOID. This is the SESSION 18 A4-D failure, made structural.
2. **§1 — the payload holds what the ledger calls unrecoverable.** `reference/extracted/`
   has the **complete campaign** — 61 quests, **Prologue→Ep12→Epilogue→Season 2**,
   **3,307 verbatim dialogue lines**, 471 choices, cutscene direction — plus **75
   skills × 182 rows with exact chi + cooldown**, **495 NPCs**, **982 items**.
   `grep` finds ZERO references to any of it in `src/`/`tests/`/`scripts/`, while
   `src/config/skills.ts` ships 3 skills with 2 of 3 cooldowns hand-INFERRED.
   **Lane L0 (re-survey) runs before any other lane.**
3. **§2.1 — the string-table blocker.** Character dialogue is plain verbatim text
   (owner-confirmed for `src/`, R1). But item/skill **names and descriptions are
   numeric IDs** (`<name>4058</name>`) indexing a table nobody has located —
   `ui_strings.txt` is NOT it. **L1b hunts it; L2/L3 can port every number and no
   name until it lands.** Free win from the same pass: `ui_strings.txt` embeds
   `<font face="Edo SZ">` — that closes the "font unidentified" art-anim blocker.

**Model for the next session: Opus 5 @ `xhigh`** (ruling R6 — L0 is judgement-dense
and small; Fable's turn comes at L7/L9/L11). **Scale: Opus unlimited, Fable bounded
12–16** (R5) — but read §2's *"a script beats a swarm"* rule first: the row-ports
(982 items, 495 NPCs, 75 skills) are generator scripts, **not** fan-outs.

---

> ## ▶ SESSION 23 CLOSED IN FULL — THE REAL FIGHTER IS IN THE DUEL, MIRRORED, AND MOVING.
> **57 files / 894 tests green** · tsc ×2 → 0 · eslint → 0 · fidelity **55/55,
> now AUTONOMOUS** (`?fidelity=auto` + a self-opened BRAVE window +
> localStorage verdict) · clean clone green (879 pass / 15 skipIf without
> `reference/`) · floors tracing ≥ 0.9005 · held-out ≥ 0.8490 (spent, UP only) ·
> height ≤ 140.5 · `Sim.ts` + duel-baseline **byte-untouched all session**.
>
> **Commits:** `3bd5814` A11.1 drawSamurai out → `68cef9c` A11.2 compose-time
> mirror → `741fd31` A11.3 transcription (710 nodes CONTRACT) → `7ee71d1`
> A11.4 stepper → `0719673` distance-driven stride (owner-LOOK fix) →
> `4601761` wrap. Full milestone detail: `docs/sessions/-SESSION-LOG.md`
> "Session 23".
>
> - **A11-A..E all green, red-first, chaos-planted.** DuelScene renders both
>   combatants via `composePose → planPose → drawPlan`; mirroring is a
>   compose-time flag with ONE math site; walk + the balanced slash chain are
>   byte-checked transcriptions played by the pure `core/ogAnimPlayer.ts`
>   (15 fps latch, carry-forward, Flash matrix nodes ÷100 = `OG_MATRIX_UNITS`).
> - **OWNER LOOK verdicts (logged verbatim, 04:30):** foot-skating — FIXED
>   same-turn (distance-driven `strideMs`, measured `WALK.stridePx`, zero new
>   numbers); point-blank stroke runs instead of slashing + uncapped stroke
>   length — BOTH scheduled by name into SESSION 24 (gameplay: measured
>   numbers + the baseline's atomic re-record protocol).
> - **Tooling permanent:** `?fidelity=auto` (DEV-only) — the gate runs itself
>   in a fresh visible window; the intro devHold race was ROOT-CAUSED and
>   fixed in `DuelIntro.create()` (re-applies a pre-recorded hold).
> - **Still open (owner):** kasa height trade · gi revisit · partb loop hold
>   during the strike (measured duration lands in A12.1).

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
> **Improvements research (full sweep, adversarially verified 2026-08-13):**
> `docs/research/IMPROVEMENTS_RESEARCH.md` — 92 items, each adjudicated
> against the ledger + invariants and attacked by an independent verifier
> (49 confirmed / 40 corrected / 3 killed); supersedes the 2026-08-05 batch
> (archived at `7b4a743`). Headline: a LIVE r="1" z-order defect for A12.3.
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
- ~~DuelScene fixed-step accumulator / inline 250~~ DONE IN FULL — verified
  2026-08-13: `MAX_FRAME_MS = 250` lives in `src/config/combat-sim.ts` and
  `Sim.advance` clamps with it; no inline 250 remains anywhere.
- Phaser bundle 1.2 MB → code-split at Stage 6 (vite@8 Rolldown API verified
  + working snippet: `IMPROVEMENTS_RESEARCH.md` §vite-build; optional now-fix
  for the cosmetic warning: `chunkSizeWarningLimit: 1500`).
- `@types/node` 26 vs Node 25 — harmless; align when LTS catches up.
- Vite dev server may still be running in background task b1jaqmhl1.
