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

**Run 1 (dead, usage limit 2026-08-13):** `wf_97ec93a2-3b5` — 20/68 agents done.
Its 12 surveys are preserved in `systems/` and its 8 critic reviews in `critics/`.
**Run 2 (2026-08-14/15):** `wf_7e275b35-488` — relaunched fresh after Stage 0b found
the string table (S0-3), which invalidated run 1's central premise. **Also checkpointed
on a usage limit.** Banked: **all 12 systems re-surveyed** with the string table in
hand (`systems/*.md`, rewritten in place), **336 claims / 256 verdicts / 0 VOID /
56 refuted / 175 ledger overturns**, extracted to `run2/`.

**JUDGED vs LEADS — run 2 (this is the line that matters):**

| Status | Systems | Claims |
|---|---|---|
| ✅ **JUDGED** — every claim seen by 3-4 blind artifact-citing critics | `items-equipment`, `rebirth-elements`, `combat-core`, `progression` | **79** |
| ⚠️ **LEADS ONLY** — surveyed, no critic ran | `skills-meters`, `economy`, `enemies-ai`, `quests-story`, `world-exploration`, `art-anim-audio-feel`, `ui-hud`, `meta-social` | 153 |
| ⚠️ **LEADS ONLY** — critic `new_findings`, uncritiqued by construction | (cross-system) | 104 |

Only the **79 judged** claims may be written into `REBUILD_READINESS.md`. The other
257 are leads. Sweep-B (10 source surveys incl. the never-surveyed `android-blobs`
and `string-table`), the dry-loop and the completeness critic **never started**.

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

## ⚠️ Still outstanding after run 2

- **~29 of 41 Sweep-A critics** — the 8 systems in the LEADS-ONLY row above.
- **All 10 Sweep-B source surveys + their 20 critics** — never started in either run.
  Two of those sources have never been surveyed by anything: `android-blobs` (the 42
  named blobs) and `string-table` (2,533 strings nobody has read for mechanics).
- **Dry-loop** rounds · **completeness** critic.
- **Gates L0-A…F**, the `REBUILD_READINESS.md` rewrite, and the §3.7 re-arm commit.
- **`GAUNTLET.md` itself needs correcting** — §2.1's string-table blocker is dead
  (S0-3), the L1b lane row is obsolete, and §2's L6 "~150 animations" is ~450 (S0-4).

## How to resume

**Resume run 2 — do NOT edit the script first** (an edit invalidates the cache from
the first changed `agent()` call onward, and the 12 surveys are the expensive part):

```
Workflow({
  scriptPath: "/Users/kheshav/kheshav-code/SSHD 1-1/scripts/gauntlet/l0-resurvey.workflow.js",
  resumeFromRunId: "wf_7e275b35-488"
})
```

The 12 surveys and 13 critics replay instantly from cache; only the ~29 missing
critics, all of Sweep-B, the dry-loop and the completeness critic fan out live.

**If the cache misses** (script edited, or the run is too old), the surveys are still
on disk — re-run only the missing stages by pointing new agents at
`docs/gauntlet/L0/systems/*.md` as input instead of re-surveying. Per the validated
salvage pattern, re-run dead agents in batches on a cheaper model; the critics are
judgement work and stay on Opus.

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
