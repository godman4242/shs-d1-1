# L0 — SALVAGE / RESUME CARD

> **Read this first if the L0 run died.** Written 2026-08-13 mid-flight, on notice
> that usage was about to run out. Everything below is on disk and committed.
> **No completed research needs to be redone.**

## What is banked (verified on disk, not asserted)

| Artifact | Where | State |
|---|---|---|
| Evidence index (Stage 0) | `docs/gauntlet/L0/index/*.json` (9 files) | ✅ complete, incl. 329 MB `payload.xml` histogram |
| 12 system surveys, full prose | `docs/gauntlet/L0/systems/*.md` (~363 KB) | ✅ **all 12 complete** |
| Structured claim set | `docs/gauntlet/L0/claims.json` · `CLAIMS.md` | ✅ 258 claims |
| Critic verdicts | `docs/gauntlet/L0/verdicts.json` · `critics/*.md` | ⚠️ **partial** — see below |
| Raw workflow journal | `docs/gauntlet/L0/wf-journal.jsonl` | ✅ copied into the repo |
| The workflow script | `scripts/gauntlet/l0-resurvey.workflow.js` | ✅ re-runnable / resumable |
| Stage-0 findings S0-1, S0-2 | `docs/gauntlet/L0/journal.md` | ✅ |

**Run ID:** `wf_97ec93a2-3b5`
**Transcript dir:** `~/.claude/projects/-Users-kheshav-kheshav-code-SSHD-1-1/70279977-fb70-4a26-ba27-9b32a10d27dc/subagents/workflows/wf_97ec93a2-3b5/`

## ⚠️ What is NOT done — do not mistake raw output for a result

The 12 surveys re-score the board dramatically (avg ~42 → ~83, 156 claimed ledger
overturns). **Those numbers are UNVERIFIED surveyor self-reports.** Under §0 a claim
is only confirmed once blind artifact-citing critics have judged it, and only
**4 of ~41 system critics** had returned when the run was checkpointed.

**Nothing from this run may be written into `REBUILD_READINESS.md` until the critics
have run.** Treat `CLAIMS.md` as a lead list, not as findings.

Still outstanding:
- ~37 of 41 Sweep-A critics (cite / hunter / precedence, + frame lens on the 5 visual systems)
- **All 8 Sweep-B source surveys + their 16 critics** (the orthogonal sweep — never started)
- Dry-loop rounds · completeness critic
- Gates L0-A…F, the `REBUILD_READINESS.md` rewrite, and the §3.7 re-arm commit

## How to resume (cheapest path first)

The workflow caches completed agents by call signature. **Do not edit the script
before resuming** — an edit invalidates the cache from that call onward.

```
Workflow({
  scriptPath: "/Users/kheshav/kheshav-code/SSHD 1-1/scripts/gauntlet/l0-resurvey.workflow.js",
  resumeFromRunId: "wf_97ec93a2-3b5"
})
```

The 12 surveys return instantly from cache; only the unfinished critics and the
whole Sweep-B fan out live.

**If the cache misses** (script edited, or a new session), the surveys are still on
disk — re-run only the missing stages by pointing new agents at
`docs/gauntlet/L0/systems/*.md` as their input instead of re-surveying. Per the
validated salvage pattern, re-run dead agents in batches on a cheaper model; the
critics are judgement work and should stay on Opus.

## Re-extract the journal at any time

```
python3 scripts/gauntlet/salvageJournal.py docs/gauntlet/L0/wf-journal.jsonl --out docs/gauntlet/L0
```
