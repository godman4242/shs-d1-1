---
description: Snapshot in-flight session state so the next session resumes at zero restart cost. Use when usage runs low, before a long break, or the moment a workflow dies.
---

# /handoff — resume snapshot

The user typed `/handoff $ARGUMENTS`. The argument is an optional slug for what's
in flight (`l3-items`, `wf4-dry-loop`). Adapted from the IGCSE Malay repo's
`/handoff`, with this repo's two hard-won additions: **measure, never infer** (D7)
and **salvage before you write** (eleven walls, zero data lost).

## Why this exists

Usage limits hit mid-task. Conversation context dies; the file system survives.
A clean snapshot + a self-contained next-session prompt = no restart cost.

## Do this, in order

### 1. SALVAGE FIRST if a workflow is or was in flight

Nothing else matters if agent output is still only in a transcript. Before any
writing:

```bash
bash scripts/gauntlet/checkpointL0.sh <run> <tag> <transcript-dir>   # banks a landed wave
```

Agents write their JSON to disk *before* returning, so a run that died still has
results. Check `docs/gauntlet/*/critics/*.json` even when the workflow reported
agents dead — two "lost" 48/48 batches were recovered exactly this way. **Never
re-judge a batch that already wrote its JSON.**

### 2. Capture state — run these together, one call

```bash
git status --short
git log --oneline -5
npm run -s typecheck; echo "typecheck=$?"
npm run -s lint; echo "lint=$?"
npx vitest run 2>&1 | tail -4
date "+%Y-%m-%d %H:%M"
```

⚠️ **PASTE the suite numbers from that output. Never add up test counts from
memory** — commits `3adac1b` and `8f332e9` asserted 1002/1003 when the real number
was 1001, corrected by hand in `c38b660`. The pre-commit hook now prints the
measured totals on success; use those.

### 3. Rewrite `RESUME_HERE.md`'s top block

**Rewritten, never appended to** (root `CLAUDE.md`) — delete the block you
supersede. "Refreshed" is how that file grew a duplicated stale section and an
orphan code fence. The top block must answer, in this order:

1. What is DONE, with pasted gate output.
2. What is LEFT, in order, with the exact commands.
3. What a future session must **not** "fix" — decisions that look like bugs.
4. Which lane is next and why (`GAUNTLET.md` §2 ordering + R7's ratio ruling).

### 4. Write the next-session kickoff

Path: `docs/sessions/{SLUG}_KICKOFF.md`. Follow the lean shape:

- Framing paragraph **outside** the paste block — what this builds on, with hashes.
- One `text`-fenced block that is the whole prompt: working agreement → GOAL →
  **DESIGN FIRST** (forks to decide before any code) → READ FIRST → DON'T BREAK →
  DONE (measurable) → "tell me X before you write code".
- Smaller alternatives, if the user would rather a quick win.
- The copy-paste start command.

**Keep the paste block under ~1,000 words.** The 2026-08-24 architecture review
measured 66,496 words across 27 kickoffs and ruled the ratio 10/90 (`GAUNTLET.md`
R7). A long kickoff is axe-sharpening.

### 5. Commit, in the SAME commit as the work it describes

`RESUME_HERE.md` + `docs/sessions/-SESSION-LOG.md` + `DIVERGENCES.md` ship with
the change (§3.7). Then push — the repo sat 58 commits unpushed for 27 days.

## Report back

State plainly whether the handoff is complete, paste the gate numbers, and give
the user numbered next steps. If anything is unsalvageable, say so — a dead agent
and an agent that found nothing must never look the same.
