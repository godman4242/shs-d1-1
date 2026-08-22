# RESUME HERE

## ⏸ L0 IS MID-FLIGHT — FINISH IT, DO NOT RESTART IT (updated 2026-08-22)

**Eight usage walls, seven landed runs, zero data lost.** Everything is extracted and
committed. 👉 **Read `docs/gauntlet/L0/SALVAGE.md` first** — it has the exact stage table.

### State: judged **232 → 814** · gate **L0-D GREEN** · **419 fresh claims, 0 BROKEN cites**

```
$ python3 scripts/gauntlet/gateL0.py --root docs/gauntlet/L0 \
      --ledger docs/research/REBUILD_READINESS.md --out docs/gauntlet/L0/gate.json
GATE L0 — 1506 claims pooled · 814 judged ids · 0 ledger references
   RED   L0-A  CITE INTEGRITY        the ledger cites no claim at all
   RED   L0-B  NOTHING UNJUDGED      same
   RED   L0-C  CONVERGENCE IS REAL   no convergence receipt — the dry-loop has not run
  GREEN  L0-D  EVERY SOURCE OPENED   all 10 sources surveyed with >= 2 critics each ✅
   RED   L0-E  §6 PROVABLY MINIMAL   6 entries kept with no pasted negative search
   RED   L0-F  SCORECARD EVIDENCE    12 scores carry neither a [[claim]] nor a STILL_UNHELD
LANE L0: ⛔ OPEN — at least one gate item is RED
```

### ⚑ THE HEADLINE: all six of §6's "structurally UNRECOVERABLE" entries are overturned

| §6 entry | surviving, judged overturns |
|---|---:|
| L11–80 XP curve | **16** — the 99-entry `expArray` is verbatim in the **web** build AND identical to Android |
| Verbatim dialogue | 8 |
| Server-sim topology & save format | 7 |
| Exact original SFX & music synthesis params | 4 — **the audio is RECOVERED, not encrypted** |
| The live clan-war | 4 |
| The dead IAP economy | 3 |

Gate L0-E permits an **empty** §6 (*a provably minimal list may be empty*, with a test
pinning it). Anything that survives must carry a **pasted negative search**.

### ⚑ The overturn check is the most valuable thing this lane built

A finding can be perfectly TRUE and still not falsify the sentence it points at, so
`overturn_upheld` is a separate boolean from `refuted`. Result so far:

**580 overturn rulings — 352 UPHELD · 210 REJECTED. 36% of claimed overturns are wrong
about their own target.** Without that check they would have rewritten the ledger.

### ⚑ Three Stage-0 facts this lane OVERTURNED — carry them, do not re-derive

- **C1** — *"the Android blobs are UTF-16LE"* is **wrong**. 36 of 42 are plain text; **one**
  is UTF-16LE (`118_Mobile_Lang_EN.bin`); **five** are XOR'd zlib SWFs (`113 115 120 122
  124`, key `'m'`=109 then inflate); one is a GIF. Grepping those six returns 0 hits for
  content that IS there.
- **C2** — **the build-parity caveat is UNDISCHARGED, and the old "byte-identical" proof was
  CIRCULAR.** The web payload carries **zero** `<questdata>/<skilldata>/<npcdata>/<itemdata>`
  roots, so those four XMLs came from the **Android** build and diffing them against the
  Android blobs compares a file with itself. Every row ported from them is **v0.682** until
  a web-side artifact says otherwise. **This raises risk for L1–L4.**
- **C3** — **S0-5 is DEAD: the audio is RECOVERED.** `122_Mobile_SoundResource.bin` decodes at
  XOR key 111 into a valid SWF with 13 `DefineSound` tags. Held: 13 named music stems (six
  overworld at exactly 79.872 s, four dungeon at 45.760 s), the adaptive-music engine (17
  presets, ±0.05/tick crossfade), and the SFX playback contract. Survived 8 critics.

### What is left, in order

1. **Judge the last 653 findings** — 67 overturn-claimers (3 batches × cite+hunter) and 586
   corroborating (13 batches × cite). Both died at wall #8 with **0 agents done**.
2. **WF-4** — dry-loop until two rounds **that actually ran** find nothing, then completeness.
3. **Rewrite `REBUILD_READINESS.md`** from `LEDGER_EVIDENCE.md` only, citing `[[claim-id]]`.
4. **Drive gates L0-A…F green** with pasted output.
5. **Correct `docs/GAUNTLET.md`** — §2.1 blocker dead · L1b row obsolete · §2's L6
   "~150 animations" is **471** measured — and re-arm per §3.7 in the SAME commit.

### ⛔ Two rules that cost real work when broken

- **`resumeFromRunId` is SAME-SESSION ONLY.** The cache is not load-bearing — every result
  is extracted to `run2/`…`run7/` and committed.
- **Always pass a run-unique `tag`** to `l0-finish-wf3` / `l0-finish-wf4`. `buildWorklist`
  renumbers batches every build, so `<batch>.<lens>.md` collides across runs. At wall #8 a
  later run's partial work overwrote an earlier run's committed reviews; git had them, but
  that was luck. Fixed — but only if you pass the tag.

**Model: Opus 5 @ `xhigh`** (§2 routing for L0 is unchanged).

---

## 📋 NEXT-SESSION KICKOFF (paste-ready) — FINISH LANE L0

**Activate first** — a fresh session will not do this for you:

| | setting | why |
|---|---|---|
| **Surface** | **Claude Code CLI** | terminal + git + build-heavy |
| **Model** | **Opus 5** at **`xhigh`** | §2 routes L0 to Opus (R6); judgement-dense. **NOT Fable** — that is L7/L9/L11 |
| **Context** | **fresh session** | the previous one closed at eight usage walls |
| **Ultracode** | **ON** | ~36 judging agents + a dry-loop remain |

Copy everything **between** the `'''` lines (the markers are not part of the prompt):

```
'''
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

READ FIRST, then tell me the state and your plan before you spawn anything:
- RESUME_HERE.md
- docs/gauntlet/L0/SALVAGE.md   <- the resume card; exact stage table + what is banked
- docs/GAUNTLET.md              <- the standing engine; §2 is the lane board, §0 is the law

THE TASK: FINISH lane L0 to its binary gate. It is 8 usage walls deep and mid-flight.
DO NOT restart it. DO NOT try to resume a dead run - resumeFromRunId is SAME-SESSION
ONLY. The cache is not load-bearing: every completed agent result is extracted to
docs/gauntlet/L0/run2..run7 and committed.

ALREADY BANKED - do NOT re-derive any of this:
- 814 of 1,467 claims are JUDGED. 1,506 claim rows / 2,896 verdict rows / 0 VOID.
- ALL 12 systems and ALL 10 source sweeps are judged. Gate L0-D is GREEN.
- The tooling exists and is tested: citeLint.py (gate L0-A), buildWorklist.py,
  buildLedgerEvidence.py, gateL0.py. 59 files / 942 tests green.
- ALL SIX of §6's "structurally unrecoverable" entries are overturned by judged claims.
- Three Stage-0 facts were OVERTURNED - RESUME_HERE.md calls them C1/C2/C3. Carry them:
  the blobs are NOT all UTF-16LE; the build-parity proof was CIRCULAR and the caveat is
  UNDISCHARGED; and S0-5 is dead because the audio IS recovered.

WHAT IS LEFT, in order:
1. Judge the last 653 findings. Read the CURRENT batch counts from
   docs/gauntlet/L0/worklist/MANIFEST.json - they renumber every build:
     l0-finish-wf3.workflow.js  args {tier:'t1', batches:N, tag:'<unique>'}
     l0-finish-wf3.workflow.js  args {tier:'t2', batches:M, tag:'<unique>'}
   ALWAYS PASS A UNIQUE tag. Without it the review filenames collide across runs and a
   later run silently overwrites an earlier run's committed prose - it already happened.
2. WF-4: dry-loop until TWO rounds THAT ACTUALLY RAN find nothing, then completeness.
   Write docs/gauntlet/L0/convergence.json - gate L0-C reads it.
3. Rewrite docs/research/REBUILD_READINESS.md from docs/gauntlet/L0/LEDGER_EVIDENCE.md
   ONLY. Cite every claim inline as [[unit/claim-slug]] - gate L0-B resolves every one
   against the pooled verdicts and goes RED on anything unjudged, refuted, or unknown.
4. Drive gates L0-A..F green with PASTED output from gateL0.py.
5. Correct docs/GAUNTLET.md itself - §2.1's string-table blocker is dead, the L1b lane row
   is obsolete, §2's L6 "~150 animations" is 471 measured - and re-arm per §3.7 in the
   SAME commit.

THE BAR - §0 is absolute: EVERY CRITIC IS AN ARTIFACT CRITIC. This game is DEAD; no agent
has ever seen it run, so a verdict must cite a frame under reference/frames/, a row under
reference/extracted/ or reference/decompiled/, a byte-check in the suite, a ledger number
carrying its own frame cite, or my own logged LOOK. A verdict citing memory, another
agent's summary, or "it looks right" is VOID. Crop and upscale before grading any frame.
When a measurement doc and a frame disagree, THE FRAME WINS - say so out loud. An
UNJUDGED claim is a LEAD, not a finding: it may NOT enter the ledger.

AND THE ONE THIS LANE ADDED: a finding can be perfectly TRUE and still not overturn the
sentence it names. 36% of claimed overturns were rejected on exactly that. Keep
overturn_upheld separate from refuted, and never let a true-but-wrong-target finding
delete a ledger line.

FAIL CLOSED (bugs already fixed - do not reintroduce): zero live critics means UNJUDGED,
never confirmed; a VOID verdict is not judgement; and a round where agents DIED is not a
round that found nothing, so it may not count toward convergence. Return a loud INTEGRITY
string naming every dead agent.

SURVIVE THE WALL: this lane has hit the usage limit EIGHT times. Agents write their output
to disk BEFORE returning - that has now saved work at five separate walls; copy the
journal into the repo and extract it the moment a stage lands
(scripts/gauntlet/salvageJournal.py); COMMIT at every checkpoint; keep SALVAGE.md current.
Never edit a live workflow script mid-run.

WHAT NOT TO BREAK: §4's no-touch list. Sim.ts and the duel-baseline move only in L5.
Floors go UP or stay. core/ keeps zero numeric literals. Scenes stay render-only. The
"web SWF is 24 fps" finding is a LEDGER correction only - it does not license touching
OG_ANIMS' 15 fps latch, which is L6.

FIRST, DO THIS: confirm the baseline (git log -1 + npm test -> 59 files / 942), paste the
current gateL0.py output, report the judged-vs-leads split from
docs/gauntlet/L0/LEDGER_EVIDENCE.json, and show me the fan-out shape. Don't spawn until
I ok it.
'''
```

**Start command** (from the repo root):

```bash
cd "/Users/kheshav/kheshav-code/SSHD 1-1" && git log --oneline -1 && npm test 2>&1 | tail -5 \
  && python3 scripts/gauntlet/gateL0.py --root docs/gauntlet/L0 \
       --ledger docs/research/REBUILD_READINESS.md --out /tmp/gate.json
```

**Bar verdict: ✅ meets the "cannot be improved further" bar.** It front-loads everything
banked so nothing is re-derived; it carries §0's law, the *new* overturn rule this lane
discovered, and the three fail-closed accounting rules that make the numbers trustworthy;
it names the exact scripts and args including the `tag` whose absence has already cost
work; it blocks the two mistakes that cost real money (resuming a dead run, re-deriving
the string table); and it ends with a concrete, checkable first action. The next change
would be churn.

### Two owner decisions queued (neither blocks the next session)

1. **L7 / audio.** CLAUDE.md fixes the stack as *"WebAudio-synthesized SFX only"*. We now
   hold the real 13 stems and every SFX. That does not change what ships — but it changes
   whether L7 means *synthesize to a written spec* or *synthesize to match a file you can
   A/B against*. **Recommendation: the second.**
2. **§3.8 campaign scope.** *"Ep4–12 were likely never shipped; faithful campaign =
   Prologue–Ep3."* Bespoke splash art for all 13 episodes IS in the binary, and the 16
   `image_*` symbols map one-for-one onto shipped quest rows. **Recommendation: withdraw
   the cut.** It widens L1.

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
