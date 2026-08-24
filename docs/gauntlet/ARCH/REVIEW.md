# ARCHITECTURE REVIEW — the verdict

> **2026-08-24. 17 agents, `INTEGRITY: CLEAN`, 0 deaths, 102 findings, all 102 cited.**
> 4 blind history miners · 9 blind lenses · 2 adversaries · 2 verifiers. Raw evidence is
> one JSON per agent under `history/`, `lenses/`, `adversary/`, `verify/`.

## The finding that reframed the review — and it killed my own diagnosis

I opened with *"the rules are too heavy — delete rules."* **That was wrong**, and the
do-nothing adversary proved it.

Six workflow scripts carry, verbatim:

```
DO NOT MODIFY ANY FILE outside your assigned journal path. This lane touches no source code.
  l0-resurvey.workflow.js:43   l0-finish-wf1.workflow.js:47   l0-finish-wf2.workflow.js:45
  l0-finish-wf3.workflow.js:104  l0-rewrite.workflow.js:73  l0-finish-source-critics.workflow.js:45
```

That is **correct for a survey lane** and **strictly wider** than §4's no-touch list, which
names two files. Combine it with R2 (*"L0 runs before any other lane"*) and the fact that
**L0 is the only lane of twelve whose gate is markdown-document integrity**, and one lane
that *definitionally cannot ship code* held the only slot for 12 days.

**No rule edit unblocks this. Arming a different lane does, and needs zero edits.** The
constraint was never written where anyone was auditing — the same gap that left ~1,100 lines
of workflow script untested until 2026-08-23.

## The ratio ruling (ARCH-D)

| Measured | |
|---|---|
| Last commit a player could see | `0719673`, **2026-07-28** — 27 days |
| Since then | **58 commits · +326,094 doc lines · 0 lines of `src/`** |
| Ratio | **~100/0** against the note's 60/40 early, **10/90 late** |
| Lane board rows changed since it was written | **0** (`git diff 7476add^ HEAD -- docs/GAUNTLET.md \| grep -cE '^[-+]\| \*\*L[0-9]'`) |

**The analogy was being misapplied.** The Axe-Sharpening note's ROI argument is that
sharpening compounds *across every future subject*. Process docs for one dead-game
recreation compound across nothing. By the note's own math they are **bounded-ROI** — they
are content wearing the axe's clothes. **Ruled: 10/90, effective now.**

**Next chop: L2 — skills.** `skilldata.xml` holds 75 skills × 182 rows with exact
`<chi>`/`<cooldown>`, unread for 30 days, while `src/config/skills.ts` ships **three** skills
with **two cooldowns hand-guessed**. Deterministic transform, byte-check gate, no judgement
call, no owner LOOK, no legal gate — and `741fd31` already proved the shape (710 nodes to
CONTRACT in one commit, 159-line script + byte-pin test).

**Not L1**, which the refuter correctly called the worst first chop on the board: its gate is
the whole campaign playable plus four from-scratch runtimes, and R1 gates its text.

## What the adversary killed — including 4 of my own 7

| Mine | Verdict | Landed instead |
|---|---|---|
| L1 delete the bar self-report everywhere | **KILL** — deletes an owner rule re-confirmed 3× on an agent's authority | Deleted §7 from `GAUNTLET.md` **only** (not a kickoff, so no owner rule touched). The 9-pass/0-fail statistic is **routed to Kheshav**, not acted on |
| L2 delete §2.1 | **SUGGESTION** — would silently launder the android-v0.682 caveat | Deleted **and carried the caveat forward** onto the replacement |
| L3 delete §3.8's first reason | **KILL** — a pure rationale deletion destroys what made the defect knowable | **Replaced** with "Serial is NOT safe", preserving the audit trail |
| L4 delete the stale `RESUME_HERE` block | **KILL** — instance, not class; no incident | Fixed the **class**: `CLAUDE.md` "refreshed" → "rewritten, never appended to" |
| L5 hook fix + fast-path | **SUGGESTION** — two unrelated edits under one id | Took the **print half only**; fast-path queued separately |
| L6 add a 6th artifact tier for `src/config/` | **KILL — HARD** | **Dropped entirely.** It amends §0, a §1-PROVEN rule, which §6 forbids absent new incident evidence. The defect (K2) is real; my fix was not |
| L7 ratio ruling | cite defect | **Corrected**: "zero references in `src/` or `tests/`" is false for `tests/` — `tests/gauntletL0Gate.test.ts` references them. True statement: zero in `src/`; the only `tests/` hit is the gauntlet's own gate test |

One lens over-claimed and I checked rather than applied: **VN-1 proposed renumbering
§3.6–§3.8**, which would break **245 `§3.N` cross-references** across the repo. Kept the slot,
replaced its content.

## Applied diffs

| File | Change | Δ words |
|---|---|---|
| `GAUNTLET.md` §7 | **DELETED** — bar self-report; 9 verdicts, 9 passes, 0 fails | −226 |
| `GAUNTLET.md` §5 | **DELETED** — duplicate paste-ready prompt, stale since 2026-08-20 (told the next lead to confirm 56 files / 894) | −512 |
| `GAUNTLET.md` §2.1 + lane L1b | **DELETED** — blocker died at `6ff47f1` (2026-08-14), whose own body says *"§2.1 needs rewriting"*; still said "needs L1b" in 4 places 10 days later. Android-v0.682 caveat carried forward | −265 |
| `GAUNTLET.md` §3.5 | `LOOP UNTIL DRY` → **DECLARE A TERMINATION ARGUMENT** (t1 is a fixed point: 1.00 then 1.14) | −19 |
| `GAUNTLET.md` §3.8 | "concurrency CAUSES the wall" → **"Serial is NOT safe"** (`0d8aa6d`) | −44 |
| `GAUNTLET.md` R2 | **AMENDED** — L0 no longer gates L2/L3/L4; they read the XML directly | +50 |
| `GAUNTLET.md` R7 | **NEW** — the ratio ruling + next chop | +180 |
| `CLAUDE.md` | "refreshed" → "rewritten, never appended to" | +14 |
| `src/config/CLAUDE.md` | **"test-enforced" was FALSE** — `grep -c 'CONTRACT\|INFERRED' tests/config-purity.test.ts` → 0, every `config-values` hit is a comment. Also struck the palette policy root `CLAUDE.md` calls superseded | +42 |
| `.githooks/pre-commit` | `run_step` prints **measured** suite totals on success (`3adac1b`/`8f332e9` asserted 1002/1003 while the hook had measured 1001 and printed a tick) | code |
| `RESUME_HERE.md` | "No wall hit this session" → wall #11 landed (`0d8aa6d`) | state |

**ARCH-E: 5,405 → 5,000 words. −405. GREEN.**

## Queued for Kheshav — NOT acted on

1. **The bar self-report is 9-for-9.** Fourteen files, nine verdicts, zero fails. Deleting
   your standing rule is your call, not an agent's. My recommendation: keep the polish pass,
   drop the self-grade, because a bar that has never failed anything is a signature line.
2. **26 superseded kickoff docs, 64,329 words**, are grep-reachable rule sources stating
   **reversed** rulings (`SESSION4_KICKOFF.md` still asserts the no-tracing policy the
   2026-07-24 permission ruling overturned). `git rm` is destructive and it's your history —
   your call. They are outside ARCH-E's baseline either way.
3. **`citeLint` false negative** — still queued, still failing safe.
4. **The label test** — nothing enforces CONTRACT/INFERRED. Building it will go red on
   `ai.ts`'s unlabeled `AI_TIERS`; that is a real lane, not a one-liner.
