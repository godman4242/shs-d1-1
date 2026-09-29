#!/bin/bash
# SessionStart hook (.claude/settings.json). Does nothing outside a Claude Code cloud session.
# In one (CLAUDE_CODE_REMOTE=true, owner ruling 2026-09-29 in docs/OWNER_PERMISSION_RULING.md):
#   1. turns the commit gate on — a fresh VM has no core.hooksPath, so commits would skip it;
#   2. unpacks the study-only corpus from the bundle's never-pushed `cloud-reference` branch,
#      then deletes every ref to it, so no push can ever name it;
#   3. installs dependencies.
# What it prints lands in the session's context: a MISSING corpus means claimcheck will check
# NOTHING, and docs/loop/CYCLE.md ("In a cloud session") makes that a hard stop.
[ "${CLAUDE_CODE_REMOTE:-}" = true ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

git config core.hooksPath .githooks

refs=$(git for-each-ref --format='%(refname)' | grep '/cloud-reference$')
ref=$(printf '%s\n' "$refs" | head -1)
if [ -n "$ref" ]; then
  git archive "$ref" reference | tar -x
  printf '%s\n' "$refs" | xargs -n1 git update-ref -d
fi

[ -d node_modules ] || npm ci --no-audit --no-fund >/dev/null 2>&1 || echo "⚠️ cloud setup: npm ci FAILED"

if [ -f reference/decompiled/shs3_android_payload/scripts/MCSCharacter.as ] \
  && [ -d reference/decompiled/shs3_payload/scripts ]; then
  echo "cloud setup: study-only corpus unpacked (never commit or push it) · commit gate on · deps installed"
else
  echo "⚠️ cloud setup: the study-only corpus is MISSING — claimcheck will check NOTHING. Do not commit; stop and say so."
fi
