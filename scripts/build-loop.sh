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

CYCLE_PROMPT='Read docs/loop/GOAL.md FIRST, then docs/loop/CYCLE.md, and do EXACTLY ONE cycle of its
steps. Then STOP and exit: do NOT loop and do NOT schedule any wakeup. This shell loops, and it runs
the chaos gate after you ship. If no gap clears the bar, make NO commit, print "no gap above bar"
with the reason, and exit. Never advance past an unmet stage gate. A no-op beats a rushed commit.'

# After every ship, a script re-proves the tests still catch every planted break (41 s, 53/53 on
# 2026-09-28). A plant that stays green is a missing test → the loop STOPs for a human.
loop_verify_ship() { npm run -s chaos; }

source "${LOOP_ENGINE:-$HOME/kheshav-code/agent-harness/harness/loop/build-loop.sh}"
