#!/usr/bin/env python3
"""Build docs/research/JCLAW_LESSONS.md from the eight study files.

The accounting IS the gate: every candidate id must land in exactly one cluster
or in SKIPPED, and the script raises rather than emitting a partial ledger.
"""
import json, glob, sys, pathlib

RUN = pathlib.Path('docs/research/runs/jclaw-2026-09-14')
OUT = pathlib.Path('docs/research/JCLAW_LESSONS.md')

CLUSTERS = [
 ("C1", "A zero nobody proved could be non-zero",
  "Has bitten us TWICE: claimcheck's first version reported `0 failures` over four verified wrong cites (closing it raised 82), and the Node 26 spec reporter hid 3 chaos results from a probe whose grep no longer matched (memory `feedback-probe-parser-must-match`).",
  ["agent-instructions-4","hooks-ci-sandbox-4","harness-evolution-2","architecture-rules-2","evals-ruler-5","gate-guards-4","gate-guards-2"]),
 ("C2", "A written claim that quietly stopped being true",
  "Live in the tree right now: `CLAUDE.md:67` has named `.claude/ship-bar.md` since commit 995bb52 deleted that file on 2026-09-08. JClaw hit the same class harder — 0dfcd451 corrected six contradicted AGENTS.md claims at once.",
  ["agent-instructions-1","agent-instructions-2","architecture-rules-6","harness-evolution-1"]),
 ("C3", "The guard on the guard can be switched off or fooled",
  "Live hole: `tests/chaosGate.test.ts:73` reads the runner's plant count with an unanchored regex a comment satisfies. JClaw shipped the same bug and closed it in 88b142ee.",
  ["architecture-rules-3","gate-guards-1","gate-guards-3","gate-guards-5","gate-guards-7","harness-evolution-3","hooks-ci-sandbox-5"]),
 ("C4", "A fan-out that cannot tell dead from empty, or stop",
  "The most expensive class we have: round 1 spawned 28 agents, lost 25 to a wall, burned 1,369,556 tokens and verified 0 lessons. Memory `feedback-fail-closed-agent-accounting` and `feedback-cap-foreign-repo-fanout` are both scars from it.",
  ["resilience-gates-1","resilience-gates-2","resilience-gates-3","subagent-lifecycle-1","subagent-lifecycle-2","subagent-lifecycle-3","subagent-lifecycle-4"]),
 ("C5", "The gate measures a different artifact than the one that ships",
  "Unmeasured here. `.githooks/pre-commit` runs typecheck/vitest/lint against the WORKING TREE while committing the INDEX; no partial-commit defect is on record.",
  ["gate-guards-6","hooks-ci-sandbox-1"]),
 ("C6", "The ruler's own content is unpinned",
  "Adjacent to a fixed bug: our fan-out accounting was fail-open twice. The ruler here is `measure-refute.js` / `measure-verify.js`, whose lens set and schema nothing fingerprints.",
  ["evals-ruler-2","evals-ruler-4","evals-ruler-6","evals-ruler-7","resilience-gates-4"]),
 ("C7", "Seams: one clock, one RNG, one copy of a rule",
  "Largely already ours — `src/core/` is RNG-seamed by contract and `tests/config-purity.test.ts` enforces zero numeric literals. Kept as a cluster so the claims are checkable, not because a gap is assumed.",
  ["architecture-rules-1","architecture-rules-4","architecture-rules-5"]),
 ("C8", "An action gate sitting between the model and the tool",
  "Already ours in one form: the global `PreToolUse` hook `~/.claude/hooks/launch-gate-guard.py` denies a deploy while the launch gate is red.",
  ["resilience-gates-5"]),
]

SKIPPED = {
 "agent-instructions-3": "We already hold the settled verdicts (OWNER_PERMISSION_RULING, REBUILD_READINESS, the CLAUDE.md invariants block); a `docs/spikes/` folder would be a third home for the same facts — state-schema drift for no gain.",
 "agent-instructions-5": "The comment delete test is a judgement rule no gate can check, priced in per-turn tokens forever, and our actual comment problem is the opposite: the gate scripts' comments carry load-bearing defect history.",
 "architecture-rules-7": "Structured-concurrency scope semantics — we have no concurrency in `src/core/` (fixed 60 Hz single-threaded Sim) and no threads to cancel.",
 "evals-ruler-1": "ERRORED-is-not-FAILED is already implemented in `measure-refute.js`'s fail-closed accounting (a dead run returns `fatalCount: null`, never 0).",
 "evals-ruler-3": "Baseline regression compare — `tests/duel-baseline.test.ts` already pins the behavioural baseline, and a second compare layer over research runs has no consumer.",
 "evals-ruler-8": "Per-case model-call budgets assume a runtime we do not have; our budget control is the session limit and the breadth cap (C4).",
 "harness-evolution-4": "Classify-before-naming-a-cause: our `run_step` names only the failing step and prints the tool's own output, so it cannot assert a wrong cause.",
 "harness-evolution-5": "Ship the measurement in the commit body — already a standing rule (ship-bar rule 3) that this repo's history follows.",
 "hooks-ci-sandbox-2": "The `grep -q` + `pipefail` SIGPIPE trap: our hook is `#!/bin/sh` with neither setting, and the one script that does carry `set -euo pipefail` uses no `grep -q`. Nothing to make red.",
 "hooks-ci-sandbox-3": "Duplicate of harness-evolution-4.",
 "hooks-ci-sandbox-6": "We spawn no harness subprocess of our own, so there is no argv to wrap in `sandbox-exec`.",
 "resilience-gates-6": "Model/provider failover assumes we own the LLM call; we do not.",
 "resilience-gates-7": "Compaction and tool-result stubbing are the harness's job, not ours, and Claude Code already does both.",
 "subagent-lifecycle-5": "A cooperative stop flag the child carries needs a child process we control; our subagents are the harness's.",
 "subagent-lifecycle-6": "Single-settle terminal state — `measure-refute.js` already writes each verdict once, to disk, before returning.",
 "subagent-lifecycle-7": "Surfacing a timed-out child's partial output is exactly the salvage rule we already run (agents write JSON to disk before returning; 5 of 8 round-1 studies survived because of it).",
}

def main() -> int:
    studies = {}
    for f in sorted(glob.glob(str(RUN / 'study-*.json'))):
        d = json.load(open(f))
        studies[d['unit']] = d
    cands = {c['id']: (d['unit'], c) for d in studies.values() for c in d['candidates']}

    assigned = {}
    for key, _t, _w, ids in CLUSTERS:
        for i in ids:
            if i in assigned:
                raise SystemExit(f"FAIL: {i} assigned twice ({assigned[i]} and {key})")
            assigned[i] = key
    for i in SKIPPED:
        if i in assigned:
            raise SystemExit(f"FAIL: {i} both clustered ({assigned[i]}) and skipped")
        assigned[i] = "SKIPPED"

    missing = sorted(set(cands) - set(assigned))
    unknown = sorted(set(assigned) - set(cands))
    if missing or unknown:
        raise SystemExit(f"FAIL: unaccounted={missing} unknown={unknown}")

    L = []
    L.append("# JCLAW_LESSONS — the merged ledger\n")
    L.append(f"**Generated by `scripts/research/mergeLessons.py` from the {len(studies)} study files in "
             f"`docs/research/runs/jclaw-2026-09-14/`. Do not hand-edit — edit the studies or the cluster map and re-run.**\n")
    L.append(f"{len(cands)} candidates in, {len(cands)} out: {len(cands)-len(SKIPPED)} in "
             f"{len(CLUSTERS)} clusters, {len(SKIPPED)} skipped with a reason. The script raises rather than "
             "emitting a ledger with a dropped id.\n")
    L.append("Ranking rule, from the kickoff: *this defect class has already bitten us* > *could* > speculative, "
             "then cheapness. Clusters are listed in that order.\n")

    L.append("## Clusters\n")
    for key, title, why, ids in CLUSTERS:
        rows = [(i, *cands[i]) for i in ids]
        adopt = sum(1 for _i, _u, c in rows if c['verdict'] == 'ADOPT')
        L.append(f"### {key} — {title}\n")
        L.append(f"*Has it bitten us?* {why}\n")
        L.append(f"**{len(ids)} candidates · {adopt} ADOPT**\n")
        L.append("| id | our state | verdict | pattern |")
        L.append("|---|---|---|---|")
        for i, _u, c in rows:
            pat = c['pattern'].replace('|', '\\|')
            L.append(f"| `{i}` | {c['ourState']} | **{c['verdict']}** | {pat} |")
        L.append("")

    L.append("## Skipped — every id, with the reason it is not worth building\n")
    L.append("| id | our state | reason |")
    L.append("|---|---|---|")
    for i in sorted(SKIPPED):
        _u, c = cands[i]
        L.append(f"| `{i}` | {c['ourState']} | {SKIPPED[i]} |")
    L.append("")
    OUT.write_text("\n".join(L))
    print(f"OK: {len(cands)} candidates, {len(CLUSTERS)} clusters, {len(SKIPPED)} skipped -> {OUT}")
    return 0

if __name__ == '__main__':
    sys.exit(main())
