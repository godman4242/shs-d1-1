#!/bin/sh
# The git-side guard for the study-only corpus. Owner ruling 2026-09-29
# (docs/OWNER_PERMISSION_RULING.md, "Cloud sessions"): reference/ may ride to a Claude Code
# cloud session inside a LOCAL bundle, but never reaches GitHub. Pinned by tests/cloudGuard.test.ts.
#
#   guard-reference.sh staged   pre-commit: refuse any staged path under reference/
#   guard-reference.sh push     pre-push: reads git's "<lref> <loid> <rref> <roid>" lines; refuse
#                               a pushed commit that touches reference/, and — in a cloud session —
#                               any push but cloud-lane or claude/… (an ALLOW-list: the trunk is
#                               master; the parent session re-gates there, then promotes it).
# Fails CLOSED: a range git cannot walk is refused, never waved on. Paths are matched as
# '^"?reference/' because git QUOTES a name with a byte like the decompiled files' § — a bare
# '^reference/' passed a commit holding only such names (caught 2026-09-29, before any cloud run).

case "$1" in
  staged)
    bad=$(git diff --cached --name-only | grep -E '^"?reference/' | head -5)
    [ -z "$bad" ] && exit 0
    printf '\n❌ reference/ is study-only and is never committed (docs/OWNER_PERMISSION_RULING.md):\n%s\n\n' "$bad" >&2
    exit 1 ;;
  push)
    zero=0000000000000000000000000000000000000000
    while read -r lref loid rref roid; do
      [ "$loid" = "$zero" ] && continue  # a delete sends no commits
      if [ "${CLAUDE_CODE_REMOTE:-}" = true ]; then
        case "$rref" in
          refs/heads/cloud-lane|refs/heads/claude/*) ;;
          *) printf '\n❌ a cloud session pushes only cloud-lane, not %s: git push origin HEAD:refs/heads/cloud-lane\n\n' "$rref" >&2
             exit 1 ;;
        esac
      fi
      if [ "$roid" = "$zero" ]; then
        commits=$(git rev-list "$loid" --not --remotes) || { echo "❌ cannot walk $lref: push refused" >&2; exit 1; }
      else
        commits=$(git rev-list "$roid..$loid" 2>/dev/null) || { echo "❌ cannot walk $roid..$loid: push refused (fetch first)" >&2; exit 1; }
      fi
      for c in $commits; do
        if git diff-tree --root --no-commit-id --name-only -r "$c" | grep -qE '^"?reference/'; then
          printf '\n❌ commit %s touches reference/ (study-only, never pushed): push refused\n\n' "$c" >&2
          exit 1
        fi
      done
    done
    exit 0 ;;
esac
echo "usage: guard-reference.sh staged|push" >&2
exit 2
