# KICKOFF — JCLAW LESSONS, ROUND 2 (and the routing experiment)

**Written 2026-09-16 · for a fresh session · Opus 5 at `xhigh`, ultracode OFF.**

## WHY THIS SESSION EXISTS — read this before the plan

**To make OUR architecture stronger and OUR outputs more correct.** JClaw is a means, not the
subject: nobody needs a catalogue of what another project does. A finding earns its place only
by killing a defect class that can reach our work — wrong claims, a gate that can be switched
off, an agent that dies and reads as clean, a number nothing pins.

So: **lead every item with the defect it kills, not the source it came from**, rank by *has this
already bitten us* before *is this interesting*, drop the rest loudly, and close the session on
**defects the new gates would have caught** — not on lessons enumerated, agents run, or tokens
spent.

## THE GOAL, in one line

Turn the surviving JClaw findings into gates that catch real defects in this repo, and settle
*"ultracode fan-out or one `xhigh` loop?"* with a measured number instead of a feeling.

## DONE-CRITERIA — all five, or the session is not closed

1. **The 3 unmeasured areas are measured** (`agent-instructions`, `hooks-ci-sandbox`,
   `harness-evolution`) — each ≥1 candidate carrying `path:line` + an exact quote + proof the
   thing is *built and exercised* in JClaw (a test that runs it / the commit that wired it),
   written to `docs/research/runs/jclaw-2026-09-14/study-<area>.json` in the round-1 schema.
2. **Every candidate is accounted for.** All 36 salvaged + the new ones land in exactly one
   merged cluster or in a `skipped` list with a reason. A dropped id is a bug, not a tidy-up.
3. **The top 5 clusters are adversarially refuted**, 2 lenses each → 10 live verdicts, or the
   run reports `UNVERIFIED` and says which died. **Expect ≥1 REFUTED**: zero refuted means the
   refuters were too soft, not that the leads were perfect (SSHD's cite gate once read
   "0 failures" over 4 wrong cites).
4. **The confirmed ADOPT set ships as code**, red-first: plant the failure, watch the new test
   go RED, fix, watch GREEN; a chaos plant for every new guard; `npx vitest run` ·
   `npm run -s typecheck` · `npm run -s lint` · `npm run claimcheck` · `npm run chaos` all
   green with the output **pasted**, and `RESUME_HERE.md` rewritten in the same commit.
   **Each new gate is shown going RED on a defect we actually had** — one of claimcheck's 82,
   a session-log defect, a DIVERGENCES entry — or on a plant that reproduces one. A gate nobody
   has seen go red on a real defect is ceremony: say so and drop it.
5. **Two numbers are recorded** and written into `docs/research/HARNESS.md` + memory: the
   **defects-caught** count from criterion 4 (the one that says whether the architecture got
   stronger), and the A/B routing number below — including the case where the loop LOSES.

**Estimate:** P0–P3 ≈ 75 min. P4 depends on how many lessons survive (budget ~30 min per
adopted gate). Nothing here needs Kheshav except the LOOK at the end.

---

## THE ROUTING DECISION THIS SESSION TESTS

Round 1 ran as an ultracode fan-out: **28 agents, Fable `high`, 1,369,556 tokens, and the
session limit hit after 10.3 minutes** with 25 agents killed and **0 lessons verified**.
The wall was a *volume* problem, not an intelligence one — the surviving Fable studies are
excellent. Eight agents each reading a foreign repo (~250k lines across its main source directories,
measured) re-read overlapping context, and the session budget is shared across the main loop
and every subagent.

**So: Opus 5 `xhigh` in ONE loop for round 2**, with a fan-out used only where it is cheap and
bounded (the refute stage, whose inputs are small JSON objects, not a repo).

**Bounds that are part of the design, not advice:**
- **≤10 agents in the whole session**, ≤6 concurrent (8 CPUs ⇒ the runtime caps at 6 anyway).
- **No agent reads a directory.** Every agent gets an explicit file list; the loop greps first
  and hands over line ranges. `jclaw.sh` alone is ~6,000 lines — read the two subcommands.
- **Phase order so a wall truncates the tail**, and **every agent writes its JSON to disk
  before returning** (that rule is why 5 of 8 studies survived, not 2).
- Optional hard ceiling: start the session prompt with `+400k` — the script then reads
  `budget.total` and can stop spawning before the limit does it for you.
- ⛔ ONE workflow in flight. ⛔ No fan-out while the loop writes files the agents read.
- ⛔ `/fast` OFF (2× price on a long autonomous run; Fable has no fast mode anyway).

### The A/B table — fill the right column, then rule

| | round 1 — Fable fan-out (ultracode) | round 2 — Opus 5 `xhigh` loop |
|---|---|---|
| areas measured | 5 of 8 | 3 of 3 (target) |
| agents spawned / returned | 28 / 3 | ≤10 / measure |
| tokens | 1,369,556 | measure |
| wall time | 10.3 min (to the limit) | measure |
| usable candidates | 36 | measure |
| **tokens per usable candidate** | **≈38.0k** | measure |
| **lessons VERIFIED** | **0** | measure |

**Decision rule, written before the data:** compare **tokens per *verified* lesson**. If the
loop wins or ties, amend `~/.claude/CLAUDE.md` (harness section) with a hard cap: *a fan-out
over a repo we do not already know gets ≤6 agents with explicit file lists; ultracode's
"a workflow for every substantive task" does not apply to foreign codebases.* If the fan-out
wins, say so plainly and keep it — with the disk-write rule made mandatory.

---

## WHAT ALREADY EXISTS — DO NOT REDO IT

`docs/research/runs/jclaw-2026-09-14/` (read `SALVAGE.md` first): 5 study files, the coverage
critic, the journal, the round-1 script. **36 candidates: 9 ADOPT · 17 ADAPT · 10 SKIP.**
None is adversarially checked; all are leads.

The strongest leads, as the studies rank them (their words, our verdict still open):

- **gate-guards-3/4/5** — a test that reads the *gate's own wiring* (hook, config, flags) and
  fails when the gate is switched off, left behind by a new file, or collects zero tests.
  JClaw's `TestDiscoveryConformanceTest` found two live test methods that had never run.
- **gate-guards-1/6** — fail on a focused test (`it.only`) everywhere, not just in CI; gate the
  *staged* tree, not the working tree, so a partial commit cannot pass on untested content.
- **architecture-rules-1/3** — a frozen violation store whose **listed exception fails when it
  stops matching** (our `claimcheck` CONTEXT list looks like the same shape, unpinned — unverified, that is P3's job).
- **evals-ruler-2/5/6** — a computed fingerprint of the measuring stick; validate a harness
  against a known-zero **and a known-one** before believing a zero; a loader that **rejects**
  what the scorer does not implement.
- **resilience-gates-1** — stop spawning after N consecutive agent deaths and report the
  unspawned work as `NOT_SPAWNED`. Round 1 spawned 18 refuters into a wall that had already
  killed six studies; a streak breaker would have stopped after the third consecutive death.
- **subagent-lifecycle-1/3** — orphan sweep by command-line signature (memory says ~12 orphaned
  dev servers as of 2026-09-10 — re-run `ps` before citing that), and a breadth cap enforced *before* anything is spawned.

`critic.json` names **15 JClaw areas nobody read**. Two are worth a cheap look in P1 because
they answer questions we already asked: **#4** frozen allowlists with a live-count floor (the
missing half of our CONTEXT list) and **#11** the one place JClaw deliberately fails *open*,
with its reason written down — a real counter-example to our fail-closed doctrine.

---

## THE PLAN

**P0 · 5 min — set up.** Re-clone the pinned tree (the round-1 clone lived in a session
scratchpad and is gone):
```bash
git clone https://github.com/tsukhani/jclaw.git /tmp/jclaw && \
git -C /tmp/jclaw checkout -q 366459cd && git -C /tmp/jclaw log -1 --format='%h %s'
# expect: 366459cd Release v0.18.60   ⛔ never touch the LIVE install at ~/JClaw or ~/.jclaw
```

**P1 · ~35 min — measure the 3 dead areas in the loop** (grep first, then read only what the
grep named). Write each `study-<area>.json` in the round-1 schema. Then the two critic items.
**Gate:** 3 files exist, each with ≥1 candidate whose JClaw quote you re-grepped yourself.

**P2 · ~20 min — merge and rank, in the loop, no agent.** Every id in one cluster or in
`skipped` with a reason. Rank by: *this defect class has already bitten us* (cite the session
log / memory) > *could* > speculative; then cheapness. Commit the ledger as
`docs/research/JCLAW_LESSONS.md`. **Gate:** `36 + new` ids in, same count out.

**P3 · ~20 min — refute the top 5, 2 lenses, ≤10 agents.** Lens A *facts*: verify the JClaw
quote verbatim **and** hunt our existing equivalent — "we lack X" is the claim most likely to
be wrong. Lens B *fit*: steelman SKIP — name the defect class and find evidence it bit **us**,
price the standing cost (tokens/turn, pre-commit seconds, maintenance), propose the simpler
version. Fail-closed: a dead lens is `UNVERIFIED`, never `STANDS`.
**Gate:** 10/10 live verdicts, or the report names the dead ones.

**P4 — ship the survivors**, one commit each, red-first, with a chaos plant per guard and
`EXPECTED_TOTAL` raised in **both** places (`scripts/gates/chaos.ts` and
`tests/chaosGate.test.ts`). Generic versions go to `~/kheshav-code/agent-harness` (PUBLIC —
no project names, no personal names); SSHD-specific ones stay here.

**P5 — rule on the A/B**, write it into `docs/research/HARNESS.md`, the memory file, and
`RESUME_HERE.md`.

## ⛔ DO NOT

- Re-study the 5 salvaged areas, or re-clone into a session scratchpad that dies with the session.
- Put `npm run chaos` in pre-commit (it rewrites shipped source).
- Widen `claimcheck`'s window, or add a CONTEXT entry without reading its cited line.
- Start slice 4 (`docs/sessions/L4B_KICKOFF.md`) — the lane is parked and stays parked.
- Trust a "0 failures" from anything new until it has been shown to fail on a planted defect.

## START COMMAND

```
Read docs/sessions/JCLAW_LESSONS_KICKOFF.md and docs/research/runs/jclaw-2026-09-14/SALVAGE.md,
then run it end to end. Opus 5 xhigh, ultracode off, ≤10 agents total.
```
