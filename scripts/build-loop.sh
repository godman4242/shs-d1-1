#!/bin/sh
# Autonomous build loop for SSHD 1:1 — CRASH INSURANCE, not the primary mode.
#
#   Usage:  caffeinate -dimsu bash scripts/build-loop.sh
#   Pause:  touch docs/loop/PAUSE      (safe window to edit by hand)
#   Resume: rm docs/loop/PAUSE
#   Stop:   Ctrl-C
#
# SINGLE-WRITER RULE: never run this while an interactive Claude Code session
# is working this repo — two writers on one working tree corrupt each other.
#
# Each cycle spawns a FRESH `claude -p` process (no context accumulation),
# which reads docs/loop/GOAL.md + RESUME_HERE.md, ships ONE green milestone
# through the pre-commit gate (typecheck -> tests -> lint), or no-ops.
# Productive cycle -> sleep 10s; idle/error -> geometric backoff to 30 min.
#
# Env overrides:
#   LOOP_MODEL  model id for cycles (default: your CLI default model —
#               deliberate: model routing changes over time, re-check access)
#   LOOP_UNTIL  epoch seconds cutoff (default: none, runs until stopped)

set -u
cd "$(dirname "$0")/.." || exit 1

SLEEP_MIN=10
SLEEP_MAX=1800
SLEEP=$SLEEP_MIN

PROMPT='Read docs/loop/GOAL.md and obey it exactly. Then read RESUME_HERE.md
and the current stage of docs/MASTER_SPEC.md (+ its kickoff in
docs/sessions/). Ship the SINGLE most valuable milestone toward the current
stage gate: TDD (watch the test fail first), all repo invariants, pre-commit
gate green, RESUME_HERE.md + docs/sessions/-SESSION-LOG.md updated in the
SAME commit. Gate items needing a real browser or human judgment: leave
unchecked and queue them in RESUME_HERE.md. If no gap clears the bar, make
NO commit and print exactly why. Never advance past an unmet stage gate.'

while :; do
  if [ -n "${LOOP_UNTIL:-}" ] && [ "$(date +%s)" -ge "$LOOP_UNTIL" ]; then
    echo "[loop] cutoff reached — stopping."
    break
  fi
  if [ -f docs/loop/PAUSE ]; then
    echo "[loop] PAUSE present — sleeping ${SLEEP_MAX}s."
    sleep "$SLEEP_MAX"
    continue
  fi

  BEFORE=$(git rev-parse HEAD)
  echo "[loop] cycle start $(date '+%H:%M:%S') at ${BEFORE%????????????????????????????????}"
  # shellcheck disable=SC2086
  claude -p "$PROMPT" ${LOOP_MODEL:+--model "$LOOP_MODEL"} \
    --permission-mode bypassPermissions
  AFTER=$(git rev-parse HEAD)

  if [ "$BEFORE" != "$AFTER" ]; then
    echo "[loop] shipped $(git log --oneline -1)"
    SLEEP=$SLEEP_MIN
  else
    SLEEP=$((SLEEP * 2))
    [ "$SLEEP" -gt "$SLEEP_MAX" ] && SLEEP=$SLEEP_MAX
    echo "[loop] no-op — backing off ${SLEEP}s."
  fi
  sleep "$SLEEP"
done
