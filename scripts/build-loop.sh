#!/usr/bin/env bash
# scripts/build-loop.sh — SSHD 1:1's settings for the shared build loop.
# The engine (time box, watchdog, pause switches, lock, log) is shared by every project:
#   ~/kheshav-code/agent-harness/harness/loop/build-loop.sh — its header documents every switch.
#
# Start:   caffeinate -dimsu bash scripts/build-loop.sh     # stops by itself at the next 08:00
#          CUTOFF=202610011800 caffeinate -dimsu bash scripts/build-loop.sh   # other stop time
# Change the stop time while it runs:  echo 202610010700 > docs/loop/CUTOFF
# Pause:   touch docs/loop/PAUSE (soft, dead-man below) · touch docs/loop/STOP (hard) · Ctrl-C
# Dry run: CLAUDE_BIN=true MAX_CYCLES=1 SLEEP=1 bash scripts/build-loop.sh   # no model, no usage
# Log:     docs/loop/logs/loop-<date>.log
#
# SINGLE-WRITER RULE: never run it while an interactive session works this repo.
# DEAD-MAN TAKEOVER: interactive sessions hold docs/loop/PAUSE (their kickoff creates it; the
# pre-commit hook re-touches it on every commit). A PAUSE older than 2 h on a tree quiet for 1 h
# means the session died (usage cut, crash, closed laptop): the loop removes PAUSE and takes over.
# Returning to interactive work: touch docs/loop/PAUSE, then wait for docs/loop/CYCLE_RUNNING to go.

DEADMAN="${DEADMAN:-1}"
# Owner ruling 2026-09-28: xhigh, "I want less mistakes" (the engine's default is high). xhigh
# cycles run longer, and a watchdog kill leaves RESUME_HERE unchanged, so the next cycle retries
# the same milestone: 2 h (engine default 90 min) so one long milestone isn't killed all night.
EFFORT="${EFFORT:-xhigh}"
CYCLE_TIMEOUT="${CYCLE_TIMEOUT:-7200}"

CYCLE_PROMPT='Read docs/loop/GOAL.md FIRST, then docs/loop/CYCLE.md, and do EXACTLY ONE cycle of its
steps. Then STOP and exit: do NOT loop and do NOT schedule any wakeup. This shell loops, and it runs
the chaos gate after you ship. If no gap clears the bar, make NO commit, print "no gap above bar"
with the reason, and exit. Never advance past an unmet stage gate. A no-op beats a rushed commit.'

# After every ship, a script re-proves the tests still catch every planted break (41 s, 53/53 on
# 2026-09-28). A plant that stays green is a missing test → the loop STOPs for a human and the
# commit stays local. Green → push, so GitHub stays in sync (owner ruling 2026-09-28: the repo is
# private, push like normal). A failed push is logged, never fatal: the next ship's push carries
# this commit too. GIT_TERMINAL_PROMPT=0 so a credential problem fails fast instead of hanging.
loop_verify_ship() {
  npm run -s chaos || return 1
  if GIT_TERMINAL_PROMPT=0 git push -q origin HEAD; then echo "──── ↑ pushed $1 ────"
  else echo "──── ⚠ push failed: $1 stays local; the next ship's push carries it ────"; fi
}

source "${LOOP_ENGINE:-$HOME/kheshav-code/agent-harness/harness/loop/build-loop.sh}"
