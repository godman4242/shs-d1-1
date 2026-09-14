# THE HARNESS — the rules the fan-out has actually earned

> Written 2026-09-13 during the harness session (T3). Every rule below is here because a
> run measured it, and several are here because a run BROKE on the opposite rule. Nothing
> in this file is a preference.

---

## RULE 1 — FAN OUT READS, NEVER WRITES

**The rule.** A fan-out may read the source, the ports, the configs, the tests and the
docs in parallel, with as many agents as the work justifies. **Every write stays in one
loop.** The parent owns the edits.

**Why, specifically.** The classes in an L4b slice share:

- one config file (`src/config/ogNpcAnimal.ts` for slice 3a's four wanderers),
- the `SHIPPED` map in `tests/npcTree.test.ts`,
- one test-count contract (the suite total, which every gate states),
- one `RESUME_HERE.md` top block and one `docs/DIVERGENCES.md` section.

Two agents writing any of those in parallel is the documented **parallel-overwrite**
failure. This account has already paid for it, and the standing rule that came out of it —
*you cannot rebuild a shared index while a run is live* — is the same rule at a different
scale.

**What it buys.** Session 35 ran the read-only fan-out twice over slice 3, with every
write in one loop: **20/20 agents, 0 errors, 14/14 verdicts, 4 FATAL** — and all four
FATALs refuted a MEASUREMENT, none refuted a port. It surfaced two real test gaps the
author's own tests missed and one wrong claim in a doc that was already committed. The
harness session repeated the shape and it held again: **8/8 agents, 0 errors**, and one of
the four verdicts refuted a claim inside a plant that had already been committed an hour
earlier with tests green around it.

**The corollary that is easy to miss.** A read-only fan-out is still not safe while the
parent is writing the files the agents read. An agent that reads a source file mid-plant,
or a doc mid-rewrite, measures something that never existed. Sequence the phases: fan out,
collect, then write.

---

## RULE 2 — A DEAD AGENT AND AN AGENT THAT FOUND NOTHING MUST NOT LOOK THE SAME

Both return `null`. Every fan-out shipped from this account that ignored the difference
reported a clean pass over work that never ran, and **both were caught only because a run
happened to die**. So the accounting is written as plain code, never left to a prompt:

| situation | status | never |
|---|---|---|
| a measure agent dies | `UNMEASURED`, and the unit still appears with its lenses `UNVERIFIED` | silently dropped |
| zero live verifiers for a unit | `UNVERIFIED` | `CLEAN` |
| one verifier of several dies | that LENS is `UNVERIFIED`; the others still count | the unit marked verified on a partial panel |
| a unit that fell out of the run | `UNMEASURED` | absent from the result |

And the run returns a loud `integrity` string carrying live-vs-expected counts for **both**
phases, so "8/8 verdicts" is read off the result instead of assumed.

`scripts/gauntlet/wfcheck.mjs` executes a workflow script with **every agent dead** and
**every agent alive**, and `tests/workflowScripts.test.ts` asserts the dead branch can
never yield a clean verdict. That is why this accounting is testable at all: it lives in
code, not in prose.

---

## RULE 3 — A SCRIPT BEATS A SWARM

Whatever a `for` loop can decide, a `for` loop decides. Agents spend their budget on the
part a script cannot do.

Measured, this session:

| question | answered by | cost |
|---|---|---|
| does this cite resolve to a real line? | `npm run claimcheck` | 0.45 s, 1,703 cites |
| does every chaos-plant anchor still match, exactly once? | `tests/chaosGate.test.ts` | milliseconds, 40 plants |
| does this plant actually make the suite go red? | `npm run chaos` | ~2 min, 40 plants |
| does this doc's PROSE say something true about the source? | an adversarial agent | minutes, and nothing else can do it |

The last row is the whole reason the fan-out exists. The first three rows are work it
should never be asked to do — and every one of them was, before this session.

---

## THE SAVED FAN-OUT — `.claude/workflows/measure-verify.js`

Measure one unit per agent, then refute each measurement with a panel of lenses. Both
phases read-only. Parameterised by `args`: `{ slice, sourceDir, tests, units, lenses }`;
with no args it runs L4b slice 3a, the run it was measured against.

```js
// the reliable invocation
Workflow({ scriptPath: '.claude/workflows/measure-verify.js' })

// parameterised for a later slice
Workflow({ scriptPath: '.claude/workflows/measure-verify.js', args: {
  slice: 'L4b slice 4',
  units: [{ name: 'RoomGoblin', as: 'RoomGoblin.as', port: 'src/core/npc/RoomGoblin.ts', config: 'src/config/ogRoomNpc.ts' }],
  lenses: [{ key: 'override-cite', ask: '…' }, { key: 'reception', ask: '…' }],
} })
```

⚠️ **`Workflow({ name: 'measure-verify' })` did NOT resolve in the session that wrote the
file** — the registry answered `not found. Available: deep-research`. Measured, not
assumed. Use `scriptPath`, which works; try `name` again from a fresh session and if it
resolves, note it here.

**Shape, executed rather than asserted:** 4 units × (1 measure + 2 lenses) = **12 agents,
8 verdicts** — the same shape session 35 ran by hand. With every agent dead it spawns
**4**, because a unit whose measurement died is never handed to a verifier.

---

## WHAT IS NOT A BINARY GATE, AND MUST NOT BE CLAIMED AS ONE

"Re-running slice 3a re-raises the same single FATAL" is **not reproducible**, and writing
it into a done-criterion was a mistake in the harness kickoff. An adversarial pass is not
deterministic: two runs over identical inputs can surface different true findings, and a
run that surfaces a different FATAL has not failed — it has found something else.

What IS reproducible, and what the tests pin:

- the agent COUNT and the verdict COUNT for a given `units × lenses`,
- that a dead agent yields `UNMEASURED` / `UNVERIFIED` and never `CLEAN`,
- that no unit can vanish from the result.

Report the FATALs a run actually raises, and say whether they match a previous run.
Do not gate on it.
