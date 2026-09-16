# SALVAGE — JClaw lessons, round 1 (`wf_34d136e7-2d8`, 2026-09-14)

**The run died on the session limit; the disk kept 5 of 8 studies.** The workflow's own
accounting said `studies 2/8` — correct by its rule (only a *returned* value counts as live),
and understated: three more agents had written their JSON **before** the wall took them.
That is the standing salvage rule paying for itself, and it is also a finding about the rule:
*a fan-out's own report is a lower bound; the disk is the upper one.*

## What ran, measured

| | |
|---|---|
| agents spawned | 28 (8 study + 1 critic + 1 merge + 18 refute) |
| agents that returned | 3 (25 killed by "session limit · resets 8:50pm") |
| subagent tokens | **1,369,556** |
| wall time to the limit | **619,783 ms ≈ 10.3 min** |
| tool uses | 224 |
| usable candidates recovered | **36** (9 ADOPT · 17 ADAPT · 10 SKIP) + 24 anti-patterns + 15 unread areas |
| cost per usable candidate | ≈ **38.0k tokens** |
| lessons actually **verified** | **0** — every refuter died; nothing here is adjudicated |

Model: Fable 5, effort `high`, 8 CPUs ⇒ 6 concurrent. JClaw clone pinned at
`366459cd` (v0.18.60, 2026-09-14) — re-clone from `https://github.com/tsukhani/jclaw.git`.

## Files here

- `study-{gate-guards,architecture-rules,evals-ruler,resilience-gates,subagent-lifecycle}.json`
  — 7–8 candidates each: pattern · failure prevented · JClaw evidence (path:line + quote) ·
  built-and-exercised proof · our state HAVE/PARTIAL/GAP with our evidence · smallest
  adoption + done-criterion · cost · ADOPT/ADAPT/SKIP.
- `critic.json` — 15 harness-relevant JClaw areas **no study read**, with paths and why.
- `journal-wf_34d136e7-2d8.jsonl` — one `{"type":"result"}` line per completed agent.
- `jclaw-lessons-wf_34d136e7-2d8.workflow.js` — the script as run (its cache is session-local: a new
  session cannot `resumeFromRunId` this run, it can only re-run).

## Dead, and therefore never measured

`study:agent-instructions` · `study:hooks-ci-sandbox` · `study:harness-evolution` ·
`merge:rank` · all 18 refuters.

⚠️ **Nothing in the study files has been adversarially checked.** Every "we have a GAP" claim is
exactly the kind this project has already seen come back wrong. Treat the 36 as *leads*.

Next step: `docs/sessions/JCLAW_LESSONS_KICKOFF.md`.
