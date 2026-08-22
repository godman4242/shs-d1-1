#!/usr/bin/env bash
# checkpointL0.sh — bank a landed L0 stage, in one command, in the right order.
#
# This lane has hit the usage limit EIGHT times and the rule that saved it every time is
# "extract and commit the moment a stage lands". Doing that by hand is six commands whose
# ORDER matters — lint before worklist, worklist before evidence, evidence before gate —
# and a step skipped at 2am reads exactly like a step that ran.
#
# It carries no logic of its own: every step is a script with its own red-first test
# suite (citeLint.test.ts, ledgerEvidence.test.ts, gauntletL0Gate.test.ts,
# salvageCriticJson.test.ts). This is the running order, not new behaviour.
#
# Usage:
#   scripts/gauntlet/checkpointL0.sh <runN> <tag> <transcript-dir>
#
#   runN             the run directory to write, e.g. run8
#   tag              the run-unique tag passed to the workflow, e.g. s26a
#   transcript-dir   the workflow's transcript dir (holds journal.jsonl)
#   --skip-worklist  MANDATORY while any other judging run is still in flight.
#
# ⛔ WHY --skip-worklist EXISTS. buildWorklist RENUMBERS the packets on every build:
# judged findings drop out and new ones arrive, so `t1-overturns-01.json` names a
# different claim set each time. A live run's agents read their packet when they START,
# and the ones still queued behind the concurrency cap have not read theirs yet. Rebuild
# mid-flight and those agents judge a packet nobody assigned them, while the findings
# they were meant to judge stay UNJUDGED — which under §0 kills them. Bank the run,
# skip the worklist, and rebuild once the last run lands.
#
# Both salvage inputs are used: the harness journal AND the JSON side-files the agents
# wrote themselves. After a partial wall only one of the two exists, and which one is
# not knowable in advance.

set -euo pipefail

RUN="${1:?usage: checkpointL0.sh <runN> <tag> <transcript-dir>}"
TAG="${2:?usage: checkpointL0.sh <runN> <tag> <transcript-dir>}"
TDIR="${3:?usage: checkpointL0.sh <runN> <tag> <transcript-dir>}"
SKIP_WORKLIST="${4:-}"

ROOT="docs/gauntlet/L0"
JOURNAL="$ROOT/wf-journal-$TAG.jsonl"

echo "=== 1. copy the journal into the repo (the harness dir is not durable) ==="
if [ -f "$TDIR/journal.jsonl" ]; then
  cp "$TDIR/journal.jsonl" "$JOURNAL"
  echo "  $JOURNAL  ($(wc -l < "$JOURNAL" | tr -d ' ') lines)"
else
  echo "  ⚠ no journal at $TDIR/journal.jsonl — side-files only"
  JOURNAL=""
fi

echo "=== 2. salvage: journal + the agents' own JSON side-files, deduped ==="
python3 scripts/gauntlet/salvageJournal.py ${JOURNAL:+"$JOURNAL"} \
  --critic-json "$ROOT/critics/*.$TAG.json" \
  --out "$ROOT/$RUN"

echo "=== 3. machine cite audit for the new claims (gate L0-A reads every citelint*.json) ==="
python3 scripts/gauntlet/citeLint.py "$ROOT/$RUN/claims.json" --out "$ROOT/citelint-$RUN.json"

if [ "$SKIP_WORKLIST" = "--skip-worklist" ]; then
  echo "=== 4. worklist rebuild SKIPPED — another judging run is in flight ==="
  echo "  The packets on disk still belong to that run. Rebuild AFTER it lands, or its"
  echo "  queued agents will judge a packet nobody assigned them."
else
  echo "=== 4. rebuild the worklist (renumbers batches — read MANIFEST fresh before relaunching) ==="
  python3 scripts/gauntlet/buildWorklist.py --root "$ROOT"
fi

echo "=== 5. rebuild the ledger evidence (the rewrite's only admissible input) ==="
python3 scripts/gauntlet/buildLedgerEvidence.py --root "$ROOT"

echo "=== 6. the binary gate ==="
python3 scripts/gauntlet/gateL0.py --root "$ROOT" \
  --ledger docs/research/REBUILD_READINESS.md --out "$ROOT/gate.json" || true

echo
echo "Checkpoint $RUN ($TAG) banked. COMMIT NOW — the next wall is free if you do."
