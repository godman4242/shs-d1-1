#!/bin/sh
# Autonomous build loop for SSHD 1:1 — CRASH INSURANCE, not the primary mode.
#
#   Usage:  caffeinate -dimsu bash scripts/build-loop.sh
#   Pause:  touch docs/loop/PAUSE   (soft — see DEAD-MAN TAKEOVER below)
#   Resume: rm docs/loop/PAUSE
#   Hard stop file: touch docs/loop/STOP   (never auto-removed; loop idles
#                   until you rm it — use for deliberate long pauses)
#   Stop:   Ctrl-C
#
# SINGLE-WRITER RULE: never run this while an interactive Claude Code session
# is working this repo — two writers on one working tree corrupt each other.
#
# DEAD-MAN TAKEOVER (macOS-specific: BSD stat/date) — lets an interactive
# session and the loop coexist WITHOUT a human handoff:
#   - Interactive sessions hold `docs/loop/PAUSE` (their kickoff creates it;
#     the pre-commit hook re-touches it on every milestone commit).
#   - While PAUSE is FRESH the loop idles. If PAUSE goes STALE
#     (mtime older than LOOP_PAUSE_STALE_MIN, default 120) AND the working
#     tree has been QUIET (no file modified in LOOP_QUIET_MIN, default 60,
#     ignoring .git/node_modules/docs/loop/dist), the session is presumed
#     dead (usage-limit cut, crash, closed laptop): the loop removes PAUSE
#     and takes over. Cycles that fail on an exhausted quota back off
#     geometrically and retry — so work resumes BY ITSELF after the reset.
#   - Returning to interactive work: touch docs/loop/PAUSE, then wait for
#     docs/loop/CYCLE_RUNNING to disappear before editing.
#
# Each cycle spawns a FRESH `claude -p` process (no context accumulation),
# which reads docs/loop/GOAL.md + RESUME_HERE.md, ships ONE green milestone
# through the pre-commit gate (typecheck -> tests -> lint), or no-ops.
# Productive cycle -> sleep 10s; idle/error -> geometric backoff to 30 min.
#
# Env overrides:
#   LOOP_MODEL      model id for cycles (default: your CLI default model —
#                   deliberate: model routing changes over time, re-check access)
#   LOOP_UNTIL      epoch seconds cutoff (default: none, runs until stopped)
#   LOOP_MAX_TURNS  optional --max-turns per cycle (hung-cycle insurance)
#
# Every cycle's output is appended to docs/loop/loop.log (gitignored) with a
# timestamped header — an overnight run leaves a postmortem trail even if the
# terminal scrollback is gone.

set -u
cd "$(dirname "$0")/.." || exit 1

SLEEP_MIN=10
SLEEP_MAX=1800
SLEEP=$SLEEP_MIN
PAUSE_STALE_MIN=${LOOP_PAUSE_STALE_MIN:-120}
QUIET_MIN=${LOOP_QUIET_MIN:-60}
trap 'rm -f docs/loop/CYCLE_RUNNING' EXIT INT TERM

# True when any working-tree file changed in the last QUIET_MIN minutes
# (ignoring .git, node_modules, docs/loop, dist). Uses a touch(1) reference
# file because BSD find has no portable "-newer than N minutes" spelling.
tree_active() {
  ref=/tmp/sshd-loop-quiet-ref
  touch -t "$(date -v-"${QUIET_MIN}"M +%Y%m%d%H%M.%S)" "$ref" || return 0
  [ -n "$(find . \( -path ./.git -o -path ./node_modules -o -path ./docs/loop -o -path ./dist \) -prune \
      -o -type f -newer "$ref" -print -quit)" ]
}

# True when PAUSE's last heartbeat is older than PAUSE_STALE_MIN minutes.
pause_stale() {
  now=$(date +%s)
  mt=$(stat -f %m docs/loop/PAUSE 2>/dev/null) || return 1
  [ $(( now - mt )) -gt $(( PAUSE_STALE_MIN * 60 )) ]
}

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
  if [ -f docs/loop/STOP ]; then
    echo "[loop] STOP present (hard pause) — re-checking in 60s."
    sleep 60
    continue
  fi
  if [ -f docs/loop/PAUSE ]; then
    if pause_stale && ! tree_active; then
      echo "[loop] PAUSE stale >${PAUSE_STALE_MIN}m + tree quiet >${QUIET_MIN}m — session presumed dead. TAKING OVER."
      printf '===== takeover %s (stale PAUSE, quiet tree) =====\n' "$(date '+%F %H:%M:%S')" >> docs/loop/loop.log
      rm -f docs/loop/PAUSE
    else
      # Short sleep so `rm docs/loop/PAUSE` resumes within a minute, not 30.
      echo "[loop] PAUSE fresh (interactive session active) — re-checking in 60s."
      sleep 60
      continue
    fi
  fi

  BEFORE=$(git rev-parse HEAD)
  echo "[loop] cycle start $(date '+%H:%M:%S') at ${BEFORE%????????????????????????????????}"
  printf '\n===== cycle %s at %s =====\n' "$(date '+%F %H:%M:%S')" "$BEFORE" >> docs/loop/loop.log
  touch docs/loop/CYCLE_RUNNING
  # The inner echo stamps claude's REAL exit status into the log (POSIX sh
  # has no PIPESTATUS) — a bare cycle header with zero output was
  # undiagnosable (quota death? auth prompt? crash?) in the 07-12 log.
  # shellcheck disable=SC2086
  { claude -p "$PROMPT" ${LOOP_MODEL:+--model "$LOOP_MODEL"} \
      ${LOOP_MAX_TURNS:+--max-turns "$LOOP_MAX_TURNS"} \
      --permission-mode bypassPermissions 2>&1
    echo "[loop] claude exit=$?"
  } | tee -a docs/loop/loop.log
  rm -f docs/loop/CYCLE_RUNNING
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
