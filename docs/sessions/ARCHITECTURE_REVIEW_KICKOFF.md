# 🪓 ARCHITECTURE REVIEW — the axe-sharpening session, applied to the axe itself

> **Written 2026-08-24, at the end of SESSION 27 (lane L0, wall #11).** Kheshav asked
> whether his standing rules and architecture are as good as they can be, using his own
> Obsidian mental models (`~/learning/`) as the lenses, and explicitly asked for foresight
> and no yes-manning. This is the kickoff for a session dedicated to that.

## Why this gets its own session

Reviewing an architecture **while operating it** produces a review that ratifies whatever
you just did. The session that spent five hours inside these rules is the best available
*witness* and the worst available *judge*. Those are different jobs and they need different
contexts.

## ⚠ THE TRAP THIS SESSION MUST NOT FALL INTO

This is a meta-session about a process that may already be too meta. Kheshav's own
**Axe-Sharpening Philosophy** gives explicit ratios — 60/40 early, 30/70 middle, **10/90
late** — and the honest reading is that this project is currently running near **100%
axe-sharpening**. Measured, not felt:

```
$ git log --oneline --since=2026-08-13 -- src/ | wc -l
0
$ git log -1 --format='%h %ad %s' --date=short -- src/
0719673 2026-07-28 SESSION23 A11.4 fix: distance-driven stride - the feet match the travel
```

**Zero commits have touched `src/` since the gauntlet was adopted, and the last change to
what a player would see was 2026-07-28 — twenty-seven days ago.** In that window: eleven
usage walls, ~1,700 claims judged, a 12-system survey, a 10-source sweep, and a document
rewrite that has not yet been written. Every one of those is defensible on its own. The
ratio is the question.

So the review carries its own binary gate and its own hard budget, and one of its required
outputs is a **ratio ruling**: how much more meta-work before the axe is sharp enough and
we chop. A review that ends with "add more process" has almost certainly failed.

---

## §1 WHAT IS ALREADY PROVEN — do NOT churn these

Rules that have **earned their keep with incident evidence**. The review may strengthen
them; it must not relitigate them without new evidence, because churn in a rule system is
itself a cost.

| Rule | Evidence it works |
|---|---|
| **Agents write structured JSON to disk BEFORE prose and before returning** | Paid **three times in one session**: 96 verdicts at wall #9, 50 during a mid-flight salvage on a usage warning, 10 at wall #11 — including a batch the workflow declared had *"NO live critic"* that was in fact fully judged |
| **Commit at every checkpoint** | Eleven walls, **zero data lost** |
| **§0 — every critic is an ARTIFACT critic** | Critics refuted real claims by opening real frames; a verdict citing memory has never entered the ledger |
| **"When a doc and a frame disagree, THE FRAME WINS"** | Fired twice this session **unprompted** — a critic upheld a finding's mechanism, then opened the frame its parenthetical relied on and wrote *"THE FRAME WINS OVER THE MEASUREMENT PROSE"* |
| **`overturn_upheld` kept separate from `refuted`** | 66 findings were TRUE but did not overturn the sentence they named. Without this split, 66 correct ledger lines get deleted by correct findings |
| **Red-first + chaos-plant every guard** | Caught a temporal-dead-zone bug the lead wrote into a live workflow the same day |
| **Fail-closed accounting** (zero live critics = UNJUDGED; a round where agents died is not a round that found nothing) | Wall #11 reported itself correctly and the worklist reconciled it against disk |

**These are genuinely excellent and unusual. Say so, and move on.**

---

## §2 THE DEFECTS THIS SESSION ACTUALLY OBSERVED — start here, they are not hypothetical

Each carries a real incident. The review's job is to decide whether each is a **local bug**
(fix the instance) or an **architectural flaw** (fix the class).

### D1 — Policy lives in prose; behaviour lives in code; nothing binds them
`GAUNTLET.md` §3.8 says *"a stage may fan out to as many agents as the lane needs"* and §2
routes L0 to **unlimited** agents. Meanwhile `buildWorklist.py` hard-coded `BATCH_SIZE = 24`
and one lens for t2 — the **bounded-lane** configuration. The doc and the code disagreed for
weeks and nothing noticed. The lead then read the code's number, not the doc's rule, and
under-fanned a wave to a single agent.
*Patched locally* (a test now parses both files and fails on drift; `BATCH_SIZE` became a
default rather than a flag). **The class is unfixed:** how many other prose rules have no
executable counterpart?

### D2 — The scripts that drive the swarm had zero tests
§2 says *"a script beats a swarm."* Yet ~1,100 lines of workflow script spawning 40+ agents
each had **no test, lint or typecheck** — they are `.js`, outside `src/`, and `node --check`
**rejects every one of them** (top-level `return`). The only way a broken script was ever
discovered was by launching it. Closed this session (`wfcheck.mjs` + 18 chaos-planted tests).
**Ask:** what else is load-bearing and unchecked because it fell between two categories?

### D3 — "Loop until dry" is a termination assumption with no proof
§3.5 mandates looping *"until two consecutive rounds surface nothing new."* Measured this
session, split by tier: t2 decays (0.13, 0.37) but **t1 is a fixed point** — every
overturn-claimer judged spawns ~1.0–1.14 more. It never goes dry **at any budget**. The
engine had no concept of *"this process may not terminate; here is the stopping rule,"* so
it took an owner ruling to stop. The dry-loop in WF-4 carries the identical risk against a
7,381-frame corpus and is flagged but unproven.
**Ask:** should every loop in the engine be required to declare a termination argument, or a
budget, or both?

### D4 — The same fact lives in many docs with nothing forcing reconciliation
C4 (this session) proves *"stance is hard-locked in combat"* is false. That fact now lives in
`RESUME_HERE.md`, `SALVAGE.md` and a commit message — while **contradicting** `SHSD_MASTER_REFERENCE.md:388`, verified verbatim:

```
| **In combat** | **Hard lock** — "CANNOT CHANGE STANCE" appears the instant a fight starts | [CONTRACT] |
```

That line is graded **`[CONTRACT]`** — the project's highest confidence tier — and it is
false. `:2099` and `REBUILD_READINESS.md:158` carry the same claim. Nothing makes them agree. Rule sources are similarly spread
across global `CLAUDE.md`, project `CLAUDE.md`, three folder `CLAUDE.md`s, `GAUNTLET.md`,
`RESUME_HERE.md`, `SALVAGE.md`, `.claude/ship-bar.md`, the memory directory and
`-SESSION-LOG.md` — **nine places**, no single source of truth.
**Ask:** what is the cheapest mechanism that makes a contradiction *fail a test* rather than
wait to be noticed?

### D5 — A gate input has a known defect
`citeLint` flagged a byte-exact quote as `QUOTE_UNVERIFIED`. It fails **safe** and no gate
reads that status, so it was correctly left alone mid-drive — but a gate whose inputs carry
known false signals erodes trust in the gate, which is the one thing a binary gate cannot
afford.

### D6 — §3.8's first justification may be folk wisdom
The one-workflow rule has two reasons. The second (**you cannot rebuild a shared index while
a run is live**) is airtight and sufficient on its own. The first (**concurrency is what
causes the wall**) is weaker: this session ran **strictly serially** and still hit wall #11.
Usage is consumed by total tokens; serialising spreads the same spend over more wall-clock.
**Ask:** is the rule right for the wrong reason — and does the stated-but-wrong reason cause
bad decisions elsewhere? *(Keep the rule; the correctness argument stands alone.)*

### D7 — A ship-bar item with no verification hook is a weak rule
Ship-bar item 3 says *paste the output, never assert it.* The lead **violated it twice in one
session**, writing inferred suite totals (1,002 / 1,003) into permanent commit messages; the
real number was 1,001. Caught only by a later manual check.
**Ask:** the failure was the operator's, but a rule that can be violated silently and lands in
the permanent record is under-engineered. What is the hook — a commit-msg hook that greps
for test-count claims and verifies them?

---

## §3 THE LENSES — one agent per mental model, from `~/learning/Notes/`

Do not summarise the notes. **Apply** them, each to the architecture, each producing a
concrete finding or an explicit "nothing here."

| Lens | The question it must answer about THIS architecture |
|---|---|
| **Second-Order Thinking** | For each standing rule: *and then what?* Name a rule whose 2nd-order effect **reverses** its 1st-order intent. (Candidate: "chaos-plant every guard" → more guards → slower iteration → fewer experiments run.) |
| **Via Negativa** | What should be **deleted**? Which rule, doc, lane or gate would improve the system by its absence? Subtraction has higher certainty than addition — this lens is the most likely to produce the highest-value finding, and the review is failing if it returns nothing. |
| **Inversion** | Instead of "how do we make this better?" ask **"what would guarantee this project never ships?"** Then check how many of those things are already present. |
| **Premortem** | It is 2027 and SSHD 1:1 was abandoned. Write the post-mortem. What killed it? Be specific and unkind. |
| **Leverage Points** | Of everything changeable, which single change moves the most? Rank by leverage, not by ease. |
| **Margin of Safety** | Where is the system running with none? (Confirmed candidate: `.gitignore:9` excludes `reference/` — the two 1080p longplays, 7,381 frames and the whole extracted payload are **git-invisible and on one machine**. Is that corpus backed up *anywhere*? If the disk dies, the project's PRIMARY 1:1 reference dies with it, and the game is dead so it cannot be re-captured.) |
| **The Map Is Not the Territory** | `REBUILD_READINESS.md` is a map. The game is the territory. How much of this project is improving the map? |
| **Circle of Competence** | Which decisions are being made confidently **outside** what the evidence can support? |
| **Opportunity Cost / Compounding** | Eleven walls bought a rewritten document. What else could those walls have bought — and does the axe-sharpening ratio say to switch to chopping? |

---

## §4 HOW TO RUN IT — evidence first, adversary second, diffs third

**Phase 1 — MINE THE HISTORY (evidence, not opinion).** ~28 sessions of git log, the session
log, `DIVERGENCES.md`, eleven walls. Produce a **defect ledger**: every instance where a rule
was violated, misread, or produced a bad outcome — each with a **commit cite**. Rules are
judged on their incident record, not their prose. Findings without a cite are opinions and
are dropped.

**Phase 2 — THE LENS SWEEP.** One agent per §3 lens, run in parallel, each blind to the
others so they cannot converge on a house view. Each returns concrete findings or an explicit
"nothing here" — padding a lens is worse than an empty one.

**Phase 3 — THE ADVERSARY, and it must be real.** For every proposed change, one agent argues
it is **wrong**, and one agent argues for **doing nothing at all**. A rule system's default
must be no-change: churn costs more than it looks like, because every rule already has
downstream artefacts written against it. **A proposed change survives only if it carries:**
1. a **real incident** it would have prevented, with the commit cite,
2. a named **second-order consequence**, honestly stated,
3. a one-line **rollback**.

Anything without all three is a suggestion, not a change.

**Phase 4 — SYNTHESIS INTO DIFFS, NOT PROSE.** The deliverable is a set of **concrete edits**
to `CLAUDE.md` / `GAUNTLET.md` / `.claude/ship-bar.md` / the memory files, plus the **ratio
ruling** (§ the trap, above). A report nobody applies is the most expensive possible output.

---

## §5 THE BINARY GATE — this review has one too

- **ARCH-A** Every finding cites a real incident by commit hash, or it is cut.
- **ARCH-B** Every proposed change carries incident + 2nd-order consequence + rollback.
- **ARCH-C** At least one recommendation is a **DELETION** (Via Negativa). A review that only
  adds has not looked hard enough.
- **ARCH-D** The **ratio ruling** is stated explicitly, in numbers, with the next chop named.
- **ARCH-E** Total net change to standing-rule word count is **≤ 0**. The rules may be
  sharper; they may not be longer. *(This is the anti-bloat gate. It is deliberately harsh.)*
- **ARCH-F** The review ships as applied diffs in the same commit as the rationale, per §3.7.

**Budget: ≤ 20 agents, one session.** If it needs more than that to review a process, the
process is the problem.

---

## §6 WHAT NOT TO TOUCH

- **§1's proven rules**, absent new incident evidence.
- **Lane L0's banked evidence.** 1,696 judged claims, 556 overturns, `run2`…`run16` — the
  review may re-plan the lane; it may not invalidate its data.
- **`src/`.** This is a review of process, not a refactor. No game code moves.
- **The `reference/` corpus.** Study-only, local-only, gitignored, irreplaceable.
