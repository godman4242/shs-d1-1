# ORPHANED CRITIC REVIEWS — prose recovered, verdicts LOST

These reviews were written to disk by agents that then died at **wall #8** (2026-08-21)
before returning their structured object. Their journals hold **zero** result records, so
`salvageJournal.py` can extract nothing: the prose survived, the verdicts did not.

**The claims they judged are therefore still UNJUDGED**, and under §0 an unjudged claim is
a LEAD that may not enter the ledger. `buildWorklist.py` still lists them, correctly.

⛔ **A blind critic re-judging those claims must NOT read these files.** §3.2: a critic
sees the worker's OUTPUT and the ARTIFACTS, never another agent's reasoning. These are
kept as a record of what was done and as a lead-source for a human, not as an input.

| file | run | why it is here |
|---|---|---|
| `t1-overturns-01.cite` · `t1-overturns-01.hunter` · `t1-overturns-02.cite` | `wf_9066e979-45c` | overwrote run7's committed prose before dying |
| `t2-corroborating-06.cite` | `wf_957bdce7-923` | the only t2 review that reached disk |

## The defect they exposed

`buildWorklist.py` **renumbers batches on every build** — judged findings drop out and new
ones arrive — so `t1-overturns-01` names a DIFFERENT claim set in every run. The critic
filename `<batch>.<lens>.md` therefore collides across runs, and a later run's partial work
silently overwrote an earlier run's committed review. Nothing was lost (git had it), but
only by luck.

**Fixed:** the workflow now takes a `tag` from args and writes `<batch>.<lens>.<tag>.md`.
Always pass a tag that is unique to the run.
