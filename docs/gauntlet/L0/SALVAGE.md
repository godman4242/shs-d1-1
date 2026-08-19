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

**FINAL STATE — after 4 runs (last: 59/79 agents, 2026-08-15).**

**1,087 claims · 1,767 verdicts · 0 VOID · 349 refuted · 483 claimed ledger overturns.**
`INTEGRITY: INCOMPLETE — converged=false` (correct, and loud).

| Unit | Claims | Judged | Overturns | |
|---|---:|---:|---:|---|
| **all 12 systems** | **232** | **232** | 140 | ✅ **COMPLETE — 3-4 blind critics each; these may enter the ledger** |
| `skilldata` source sweep | 42 | 1 | 27 | ⚠️ partial |
| `actionscript` `bindata` `itemdata` `npcdata` `questdata` sweeps | 168 | 0 | 106 | ❌ leads — surveys done, critics never ran |
| critic `new_findings` | 645 | 0 | 210 | ❌ leads — uncritiqued by construction |

**232 claims are judged and may be written into the ledger. The other 855 are leads.**

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
