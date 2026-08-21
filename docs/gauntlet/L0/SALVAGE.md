# L0 — SALVAGE / RESUME CARD

> **Read this first if the L0 run died.** Written 2026-08-13 mid-flight, on notice
> that usage was about to run out. Everything below is on disk and committed.
> **No completed research needs to be redone.**

## What is banked (verified on disk, not asserted)

| Artifact | Where | State |
|---|---|---|
| Evidence index (Stage 0 + 0b) | `docs/gauntlet/L0/index/*.json` (12 files) | ✅ incl. the 329 MB `payload.xml` histogram, the **string table** (`strings.json`) and `resolved_names.json` |
| 12 system surveys, full prose | `docs/gauntlet/L0/systems/*.md` | ✅ **all 12** |
| 6 source surveys, full prose | `docs/gauntlet/L0/sources/*.md` | ✅ `questdata` `skilldata` `npcdata` `itemdata` `bindata` `actionscript` |
| Critic reviews, full prose | `docs/gauntlet/L0/critics/*.md` (41 files) | ✅ all 12 systems × 3–4 lenses |
| Structured claim set | `run2/claims.json` · `run2/verdicts.json` · `run2/CLAIMS.md` | ✅ **1,087 claims / 1,767 verdicts** |
| Raw workflow journals | `wf-journal.jsonl` · `wf-journal-run2.jsonl` | ✅ copied into the repo |
| The workflow script | `scripts/gauntlet/l0-resurvey.workflow.js` | ✅ reusable — but see the resume warning below |
| Stage-0 findings S0-1…S0-5 | `docs/gauntlet/L0/journal.md` | ✅ incl. **the string table** |

**Run 1 (dead, usage limit 2026-08-13):** `wf_97ec93a2-3b5` — 20/68 agents done.
Its 12 surveys are preserved in `systems/` and its 8 critic reviews in `critics/`.
**Run 2 (2026-08-14/15):** `wf_7e275b35-488` — relaunched fresh after Stage 0b found
the string table (S0-3), which invalidated run 1's central premise. **Also checkpointed
on a usage limit.** Banked: **all 12 systems re-surveyed** with the string table in
hand (`systems/*.md`, rewritten in place), **336 claims / 256 verdicts / 0 VOID /
56 refuted / 175 ledger overturns**, extracted to `run2/`.

## ▶ SESSION 25 (2026-08-20) — the finish-L0 run is UNDER WAY

**Step 0 landed: `scripts/gauntlet/citeLint.py` + `tests/citeLint.test.ts` (22 tests,
red-first, all six guards chaos-planted).** Suite went 56 files/894 → **57/916 green.**

Deterministic cite audit of all 1,087 claims (`docs/gauntlet/L0/citelint.json`):

```
citeLint: 1087 claims — 872 RESOLVES · 2 BROKEN · 177 QUOTE_UNVERIFIED · 36 UNCHECKABLE
  BROKEN  rebirth/elemental-skill-tooltips  LINE_OOR:.../strings.json:6143>2535; :6146>2535
  BROKEN  rebirth/dragon-dance-teachable    LINE_OOR:.../strings.json:6117>2535
```

Both BROKEN are genuine: the surveyor cited string **IDs** as **line numbers** into a
2,535-line file. Those two cites must be re-formed before either claim enters the ledger.

**`QUOTE_UNVERIFIED` is SOFT by design, and the softness is measured.** In this corpus
`quote` is a prose gloss with verbatim material embedded — *"Visible in the crop: … Code
side: public static var equipment:Vector.\<Item\>"* — so a whole-quote match failed **642
of 1,087**. Quoted-span + XML-run + 6-word-shingle matching cuts that to 177. A gate that
cries wolf 642 times gets ignored, so the script proves what it can prove and routes the
177 to the agent cite-critics as **priority targets**. Hard-fatal stays hard: MISSING_PATH,
LINE_OOR, EMPTY_CITE.

**Also corrected here:** the judged split is **233 / 854**, not 232 / 855 — one `skilldata`
claim did receive a verdict. And §2's L6 *"~150 animations"* is **471**, measured from
`index/android_blobs.json` (`<anim>` summed over the 18 `MCSCharacter_*` blobs;
`99_HumanAnimationData` alone = 158). Not "~450".

### The finish sweep — judged 232 → 582. WALL #6 took 18 of WF-3a's 24 judges.

| Run | Run ID | Agents | Result |
|---|---|---:|---|
| **WF-1** | `wf_54dcdf8e-9a3` | 12 | **4/4 surveys landed** + 4 critics · wall #5 killed 4 critics |
| **WF-2** | `wf_db13a5de-161` | 12 | 6/12 critics · wall #5 killed both lenses of `itemdata` `bindata` `actionscript` |
| **WF-2b** | `wf_b5bca0ad-f47` | 8 | ✅ **`INTEGRITY: CLEAN`** — all 8 returned, 0 died, 0 VOID |
| **WF-3a** | `wf_771ab0e4-798` | 24 | 6/24 judges · **wall #6** killed batches 04–12 outright |

```
run3 (WF-1+WF-2) surveys=4 critics=10 claims=156 verdicts=242   0 BROKEN · 0 VOID
run4 (WF-2b)     surveys=0 critics=8  claims=80  verdicts=280   0 BROKEN · 0 VOID
run5 (WF-3a)     surveys=0 critics=6  claims=37  verdicts=144   0 BROKEN · 0 VOID
```

**273 fresh claims, 0 BROKEN cites. 666 verdicts, 0 VOID.** Against 22-BROKEN-before-fixes
on the pre-citeLint corpus. The machine-check warning in each workflow's LAW block changed
how agents cite.

### ⚑ THE OVERTURN CHECK IS THE HIGHEST-VALUE THING IN THIS LANE

WF-3a's hunter lens must open the `REBUILD_READINESS.md` sentence a finding claims to
falsify, read it in context, and rule separately on whether it actually falls —
`overturn_upheld` is a different boolean from `refuted`, because a finding can be
perfectly TRUE and still not overturn what it points at.

```
overturn rulings 143 — UPHELD 77 · REJECTED 66      (46% rejected)
refuted outright  16
```

**Nearly half of all claimed ledger overturns do not overturn anything.** Without this
check, 66 false overturns would have rewritten the readiness ledger. Two live examples:

- `NF-1-crit-is-deterministic-full-focus` — REFUTED **fatal**. Its 1.5×/1.2× stance-split
  crit is ANDROID-only; the web v0.717 twin at `§1t99s0§.as:3272-3274` is a single arm,
  flat 1.3×. So the ledger's *"Keep CRIT_MULT=1.3"* is **VINDICATED by shipped web code**,
  not killed. What survives is the narrower, real finding: crit is deterministic on a full
  reload bar, plus a flat `STAT_CRITICALDMG` gear term.
- `NF-5-per-stance-damage-multipliers` — true, overturn REJECTED: the ledger's own stance
  table *"dmg 0.9/1.2/1.4"* reproduces **to the digit** from the web expression at mastery 10.

### What is left

```
buildWorklist: 1360 rows -> 1321 distinct ids (39 duplicate rows merged)
  already judged           582
  WF-2 source-sweep claims  15 across 1 packet   (android-blobs — see below)
  WF-3a critic findings    226 across 10 batches x cite+hunter = 20 agents
  WF-3b critic findings    513 across 11 batches x cite = 11 agents
```

⚑ **`buildWorklist` and gate L0-D now ask the SAME two questions.** L0-D caught what the
worklist could not: `android-blobs` had every claim judged by its surviving cite critic
while its hunter lay dead at wall #5, so it vanished from the packet list while still
failing §3.3's two-lens minimum. Judged-ness and lens-coverage are different questions.
A unit now drops out only when it has BOTH no unjudged claims AND two critic lenses on
disk — and when it is short of lenses, the packet carries its WHOLE claim set, because a
hunter that only sees the unjudged remainder cannot hunt what the surviving lens let
through.

`l0-finish-wf2b.workflow.js` is now `l0-finish-source-critics.workflow.js`, carrying all
10 units and taking `{units:[...], lenses:[...]}` from args — so a re-run after a wall
never needs another cloned script.

---

### THE BINARY GATE — `scripts/gauntlet/gateL0.py`, 6 items, all currently RED

`GAUNTLET.md` §3.6: *"Binary. Every item green with pasted output, or the lane is open.
Never soften a gate to fit a result."* A gate a human eyeballs is a gate that gets
softened, so every item is decided mechanically and the script exits non-zero if any is
red. 14 hermetic tests, watched RED at 13/13, all seven guards chaos-planted.

```
GATE L0 — 1323 claims pooled · 510 judged ids · 0 ledger references
   RED   L0-A  CITE INTEGRITY        the ledger cites no claim at all — the rewrite has not happened
   RED   L0-B  NOTHING UNJUDGED      same
   RED   L0-C  CONVERGENCE IS REAL   no convergence receipt — the dry-loop has not run
   RED   L0-D  EVERY SOURCE OPENED   android-blobs: only 1 critic review, need 2
   RED   L0-E  §6 PROVABLY MINIMAL   6 entries kept with no pasted negative search
   RED   L0-F  SCORECARD EVIDENCE    12 system scores carry neither a [[claim]] nor a STILL_UNHELD
LANE L0: ⛔ OPEN — at least one gate item is RED
```

**How the ledger will carry its evidence:** the rewrite cites claims inline as
`[[unit/claim-slug]]`, and L0-B resolves every reference against the pooled verdicts. A
claim with no verdict, whose only verdicts are VOID (no `own_cite`, §0), or that the
critics refuted turns the gate red and names itself. That is §0's *"an unjudged claim is
a LEAD"* made mechanical — the rule does not break because someone decides to break it,
it breaks when a claim quietly drifts into a rewrite nobody re-checked.

⚑ **The gate had its own fail-open and it is closed.** With an un-rewritten ledger,
"every cited claim resolves" and "every cited claim was judged" are both VACUOUSLY TRUE
over an empty set — L0-A and L0-B reported GREEN on a lane that had done none of the
work. Both now go RED when the ledger cites nothing.

⚑ **L0-D immediately caught a real gap the worklist could not.** `android-blobs` has only
its `cite` critic: the `hunter` died at wall #5, and because the surviving critic HAD
judged every claim, the unit dropped out of `buildWorklist`'s packet list. Judged-ness and
§3.3's two-lens minimum are different questions, and only the gate asks the second.
**One agent owed: `android-blobs:hunter`.**

---

---

**STATE AFTER 4 EARLIER RUNS (last: 59/79 agents, 2026-08-15).**

**1,087 claims · 1,767 verdicts · 0 VOID · 349 refuted · 483 claimed ledger overturns.**
`INTEGRITY: INCOMPLETE — converged=false` (correct, and loud).

| Unit | Claims | Judged | Overturns | |
|---|---:|---:|---:|---|
| **all 12 systems** | **232** | **232** | 140 | ✅ **COMPLETE — 3-4 blind critics each; these may enter the ledger** |
| `skilldata` (one claim) | — | **1** | — | judged; counted in the 233 total |
| `skilldata` source sweep | 42 | 1 | 27 | ⚠️ partial |
| `actionscript` `bindata` `itemdata` `npcdata` `questdata` sweeps | 168 | 0 | 106 | ❌ leads — surveys done, critics never ran |
| critic `new_findings` | 645 | 0 | 210 | ❌ leads — uncritiqued by construction |

**233 claims are judged and may be written into the ledger. The other 854 are leads.**

Transcripts: `~/.claude/projects/-Users-kheshav-kheshav-code-SSHD-1-1/70279977-fb70-4a26-ba27-9b32a10d27dc/subagents/workflows/<runId>/`

**Why run 2 is a fresh run and not a resume:** run 1's surveys were written believing
item/skill/NPC names were unresolvable (`GAUNTLET.md` §2.1). S0-3 disproved that —
804/73/484 names now resolve. Their `STILL_UNHELD` verdicts are systematically wrong
in one direction, so they are round-1 input, not results. Nothing was discarded.

**Two fail-open bugs were fixed in the orchestration before run 2** (commit `6ff47f1`):
`harvest()` used to promote claims that NO critic had judged into `confirmed`, and the
loop-until-dry used to count a round where every hunter *died* as a round that found
nothing. Run 1's headline numbers (`confirmed: 225`, `dry_rounds: 2`) were products of
both bugs and must not be quoted. Run 2 returns an `INTEGRITY` string and a separate
`unjudged` bucket so this cannot recur silently.

## ⚠️ Still outstanding

- **4 source surveys never run** — `android-blobs`, `string-table`, `frames`,
  `uistrings-payload`. The first two have **never been opened by any agent** in four
  runs, and they are where the remaining value is concentrated.
- **~12 source critics** — the 6 completed source sweeps were never judged.
- **645 critic `new_findings`** carrying **210 claimed ledger overturns** — unjudged
  by construction, therefore unusable until critics run.
- **Dry-loop** (never completed a round that actually ran) · **completeness critic**.
- **Gates L0-A…F**, the `REBUILD_READINESS.md` rewrite, and the §3.7 re-arm commit.
- **`GAUNTLET.md` itself is now wrong in three places** — §2.1's string-table blocker
  is dead (S0-3), the **L1b lane row is obsolete** (closed before it ran), and §2's
  L6 "~150 animations" is really ~450 (S0-4). Correct these in the re-arm commit.

## How to resume — ⛔ READ THIS BEFORE TOUCHING THE WORKFLOW

**`resumeFromRunId` is SAME-SESSION ONLY.** Run `wf_7e275b35-488` belonged to the
session that ended 2026-08-15. **A new session CANNOT resume it** — passing that run
ID will not restore the cache, and re-running `l0-resurvey.workflow.js` unmodified
would re-execute all 59 completed agents for nothing.

**This does not cost you anything, because the cache is no longer load-bearing:**
every completed agent's output is already extracted to `run2/claims.json`,
`run2/verdicts.json`, `run2/CLAIMS.md`, `systems/*.md`, `sources/*.md` and
`critics/*.md`, and committed.

### ✅ The correct move: write a FRESH, SMALLER "finish-L0" workflow

Do **not** re-run the 79-agent script. Author a new one that reads the on-disk state
and runs **only what never executed** (~40 agents):

| Stage | Agents | What |
|---|---:|---|
| **A** | 4 | The source surveys that never ran: `android-blobs` (the 42 named Android blobs), `string-table` (2,533 strings, never read for mechanics), `frames`, `uistrings-payload` |
| **B** | ~12 | The `cite` + `hunter` critics for all 6 completed source sweeps (`questdata` `skilldata` `npcdata` `itemdata` `bindata` `actionscript`) — their surveys are in `sources/*.md`, feed those in as input rather than re-surveying |
| **C** | ~20 | Judge the **645 uncritiqued `new_findings`** (210 claimed overturns currently unusable). Batch them; do not spawn one agent per finding |
| **D** | 3–6 | Dry-loop until two rounds that ACTUALLY RAN find nothing new |
| **E** | 1 | Completeness critic |

Reuse the prompt builders and the schemas from `l0-resurvey.workflow.js` verbatim —
`LAW`, `INDEX_BRIEF`, `CLAIM_SCHEMA`, `SURVEY_SCHEMA`, `CRITIC_SCHEMA` — and keep the
fixed `harvest()` / dry-loop accounting (see below; those two fixes are why this
lane's numbers can be trusted at all).

## Re-extract either journal at any time

```
python3 scripts/gauntlet/salvageJournal.py docs/gauntlet/L0/wf-journal-run2.jsonl --out docs/gauntlet/L0/run2
python3 scripts/gauntlet/salvageJournal.py docs/gauntlet/L0/wf-journal.jsonl      --out docs/gauntlet/L0
```

## Rebuild the Stage-0 evidence index from scratch

Both scripts are idempotent and need only `reference/` (gitignored study material):

```
python3 scripts/gauntlet/payloadIndex.py            # web payload, 9 index files
python3 scripts/gauntlet/androidIndex.py --export   # Android blobs + THE STRING TABLE
```
