# RESUME HERE

## ⏸ L0 IS MID-FLIGHT — FINISH IT, DO NOT RESTART IT (2026-08-15)

**Four runs, all four checkpointed on usage limits. Every completed agent's work is
committed. Nothing needs redoing.** 👉 **Read `docs/gauntlet/L0/SALVAGE.md` first.**

### ⚑ THE HEADLINE: the string table is FOUND. `GAUNTLET.md` §2.1's blocker is DEAD.

`reference/decrypted/shs3_android_payload_decoded.swf` holds **42 class-named blobs**
(the web payload's 27 are anonymous). `118_Mobile_Lang_EN.bin` is a UTF-16LE XLIFF
string table, 2,533 entries. **Measured: 804 item names+descs / 0 unresolved · 73
skill / 0 · 484 NPC / 6.** Verified first-hand. `4050`→*Iron Sword*, `6000`→*Light
Stance Mastery*, `5009`→*Ruffian*, `175`→*Critical Hit*.
**→ L2 and L3 are UNBLOCKED. L1b is CLOSED before it ran.**
⚠️ Android build `0.682` vs web `0.717`; data-XML rows match exactly, UI copy and
combat tuning parity NOT established. Label ported strings with their build.

### State: 1,087 claims · 1,767 verdicts · **0 VOID** · 349 refuted

- ✅ **ALL 12 SYSTEMS JUDGED — 232/232 claims**, each through 3–4 blind
  artifact-citing critics, 140 ledger overturns. **These may enter the ledger.**
- ⚠️ **855 claims are LEADS** — 6 source sweeps whose critics never ran (210 claims)
  and 645 critic `new_findings` (210 claimed overturns) unjudged by construction.
  Under §0 an unjudged claim is a lead. **`REBUILD_READINESS.md` is UNTOUCHED and
  must stay so until they are judged.**

### ⛔ DO NOT try to resume the old workflow

`resumeFromRunId` is **same-session only** — run `wf_7e275b35-488` cannot be resumed
from a new session, and re-running `l0-resurvey.workflow.js` unmodified would
re-execute 59 completed agents for nothing. **The cache is not load-bearing:** every
result is already extracted to `docs/gauntlet/L0/run2/` and committed. Write a fresh,
smaller **finish-L0 workflow** (~40 agents) — `SALVAGE.md` has the exact stage table.

### Remaining work, in order

1. **4 source surveys never run** — `android-blobs` and `string-table` have never been
   opened by any agent in four runs; plus `frames`, `uistrings-payload`.
2. **~12 source critics** · **judge the 645 `new_findings`** · dry-loop · completeness.
3. **Rewrite `REBUILD_READINESS.md`** from the judged claims · **gates L0-A…F**.
4. **Correct `docs/GAUNTLET.md`** — §2.1 blocker dead, L1b row obsolete, L6 is ~450
   animations not ~150 — in the §3.7 re-arm commit.

**Model: Opus 5 @ `xhigh`** (§2 routing for L0 is unchanged).

---

## 📋 NEXT-SESSION KICKOFF (paste-ready) — FINISH LANE L0

**Activate first** — a fresh session will not do this for you:

| | setting | why |
|---|---|---|
| **Surface** | **Claude Code CLI** | terminal + git + build-heavy |
| **Model** | **Opus 5** at **`xhigh`** | §2 routes L0 to Opus (R6); judgement-dense. **NOT Fable** — that is L7/L9/L11 |
| **Context** | **fresh session** | the previous one closed at 4 usage walls |
| **Ultracode** | **ON** | the finish-sweep is a ~40-agent fan-out |

> ⚠️ The old A12.2 / SESSION 24 kickoff that used to sit here has been **retired for
> now**. That is lane **L5** and it stays queued: §2's ordering rule is L0 first, and
> L0's re-score is what routes L5 anyway. `docs/sessions/SESSION24_KICKOFF.md` is
> still on disk, unchanged, for when L5 comes up.

Copy everything **between** the `'''` lines (the markers are not part of the prompt):

```
'''
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

READ FIRST, then tell me the state and your plan before you spawn anything:
- RESUME_HERE.md
- docs/gauntlet/L0/SALVAGE.md   <- the resume card; it has the exact stage table
- docs/GAUNTLET.md              <- the standing engine; §2 is the lane board, §0 is the law

THE TASK: FINISH lane L0 to its binary gate. It is 4 runs deep and mid-flight.
DO NOT restart it and DO NOT try to resume the old workflow - resumeFromRunId is
SAME-SESSION ONLY, so wf_7e275b35-488 is dead to you. The cache is not load-bearing:
every completed agent result is already extracted to docs/gauntlet/L0/run2/ and
committed. Write a FRESH, SMALLER finish-L0 workflow (~40 agents) against the
on-disk state. SALVAGE.md gives you the stages.

ALREADY BANKED - do NOT re-derive any of this:
- The string table is FOUND (S0-3). 804 item / 73 skill / 484 NPC names resolve.
  docs/gauntlet/L0/index/strings.json + resolved_names.json. §2.1 is DEAD, L1b is
  CLOSED. Caveat: Android build 0.682 vs web 0.717 - label which build a string
  came from; data-XML rows match, UI copy and combat tuning parity do NOT.
- ALL 12 SYSTEMS ARE JUDGED: 232/232 claims through 3-4 blind critics each.
- 1,087 claims / 1,767 verdicts / 0 VOID are in docs/gauntlet/L0/run2/.

WHAT IS LEFT, in order:
1. The 4 source surveys that never ran: android-blobs, string-table, frames,
   uistrings-payload. The first two have NEVER been opened by any agent in four
   runs - that is where the remaining value is concentrated.
2. ~12 source critics (cite + hunter) over the 6 completed sweeps in sources/*.md -
   feed those files in as input, do NOT re-survey.
3. JUDGE the 645 critic new_findings (210 claimed ledger overturns, currently
   unusable because nothing judged them). Batch them; never one agent per finding.
4. Dry-loop until TWO rounds THAT ACTUALLY RAN find nothing new, then completeness.
5. Rewrite docs/research/REBUILD_READINESS.md from the JUDGED claims only.
6. Drive gates L0-A..F green with PASTED output. Build scripts/gauntlet/citeLint.py
   red-first and chaos-plant it.
7. Correct docs/GAUNTLET.md itself - §2.1 blocker dead, the L1b lane row obsolete,
   §2's L6 "~150 animations" is really ~450 - and re-arm per §3.7 in the SAME commit.

THE BAR - §0 is absolute: EVERY CRITIC IS AN ARTIFACT CRITIC. This game is DEAD; no
agent has ever seen it run, so a verdict must cite a frame under reference/frames/, a
row under reference/extracted/ or reference/decompiled/, a byte-check in the suite, a
ledger number carrying its own frame cite, or my own logged LOOK. A verdict citing
memory, another agent's summary, or "it looks right" is VOID. Crop and upscale before
grading any frame. When a measurement doc and a frame disagree, THE FRAME WINS - say
so out loud. An UNJUDGED claim is a LEAD, not a finding: it may NOT enter the ledger.

FAIL CLOSED (two bugs I already fixed - do not reintroduce them): zero live critics
means UNJUDGED, never confirmed; and a round where agents DIED is not a round that
found nothing, so it may not count toward convergence. Return a loud INTEGRITY string.

SURVIVE THE WALL: this lane has hit the usage limit four times. Agents write their
output to disk BEFORE returning; copy the journal into the repo and extract it the
moment a stage lands (scripts/gauntlet/salvageJournal.py); COMMIT at every
checkpoint; keep SALVAGE.md current. Never edit a live workflow script mid-run.

WHAT NOT TO BREAK: §4's no-touch list. Sim.ts and the duel-baseline move only in L5.
Floors go UP or stay. core/ keeps zero numeric literals. Scenes stay render-only.

FIRST, DO THIS: confirm the baseline (git log -1 + npm test -> 56 files / 894),
report the judged-vs-leads split from run2/claims.json, and show me the finish-L0
fan-out shape. Don't spawn until I ok it.
'''
```

**Start command** (from the repo root):

```bash
cd "/Users/kheshav/kheshav-code/SSHD 1-1" && git log --oneline -1 && npm test 2>&1 | tail -5
```

**Bar verdict: ✅ meets the "cannot be improved further" bar** — it names the lane, the
model, and the exact remaining stages; it front-loads everything already banked so no
agent re-derives the string table; it carries §0's law, the two fail-closed rules that
make this lane's numbers trustworthy, and the wall-survival discipline that has now
saved the run four times; and it blocks the one mistake that would cost real money
(trying to resume a dead run ID). The next change would be churn.

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
