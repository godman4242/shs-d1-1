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
// by name — resolves from a session started after the file was saved
Workflow({ name: 'measure-verify' })
// by path — always works, including in the session that wrote the file
Workflow({ scriptPath: '.claude/workflows/measure-verify.js' })

// parameterised for a later slice
Workflow({ scriptPath: '.claude/workflows/measure-verify.js', args: {
  slice: 'L4b slice 4',
  units: [{ name: 'RoomGoblin', as: 'RoomGoblin.as', port: 'src/core/npc/RoomGoblin.ts', config: 'src/config/ogRoomNpc.ts' }],
  lenses: [{ key: 'override-cite', ask: '…' }, { key: 'reception', ask: '…' }],
} })
```

**Name resolution, measured twice.** In the session that SAVED the file, `name` did not
resolve (`not found. Available: deep-research`) — the registry is read at session start. From
a fresh session (harness finish, 2026-09-14) a deliberately bogus name lists what is
registered, which probes resolution without launching anything:
`Workflow({ name: 'zz-probe-nonexistent-name' })` → `not found. Available: deep-research,
measure-verify`. So `name` works from the next session on; `scriptPath` works always.

**Shape, executed rather than asserted:** 4 units × (1 measure + 2 lenses) = **12 agents,
8 verdicts** — the same shape session 35 ran by hand. With every agent dead it spawns
**4**, because a unit whose measurement died is never handed to a verifier.

**The result carries `status`, and `fatalCount` is `null` unless every verdict is live.**
`status: 'VERIFIED'` only when live verdicts == expected; otherwise `'UNVERIFIED'`, and
`fatalCount: null` — never a `0` a consumer can read as clean. Pinned on the EXECUTED dead
branch in `tests/workflowScripts.test.ts` (red first; chaos-planted back to `fatal.length`
→ red → restored).

### ITS FIRST REAL RUN — `wf_99c74d25-624`, slice 3a (journals in `docs/research/runs/`)

| launch | agents | verdicts | what the result said |
|---|---|---|---|
| first | 4/4 measure returned; **8/8 verify KILLED** by the account session limit | 0/8 live | `0/8 live verdicts … 8 UNVERIFIED … it was not clean`, every unit `UNVERIFIED` — **the accounting HELD** — but beside it `fatalCount: 0`, the flaw fixed above |
| resumed, script byte-unchanged | 12/12, 0 errors (the 4 measures replayed from cache) | **8/8 live** | **1 FATAL, 7 CORRECTED, 0 CLEAN**, 68 refutations |

**It was a DIFFERENT FATAL from session 35's, and that is not a failure.** Session 35's
refuted the DEER measurement (its claim that the deer's empty ATTACK case was shared with
the wolf's); this one refuted the BEAR measurement, with 8 refutations — each an AGENT CLAIM
until the F3 ledger below adjudicates it. The one already VERIFIED by hand is the drifted
cites it named (`EnemyKatana.as:213`, the three `+ 100`), which re-opened claimcheck. The
verdict COUNT reproduced; the finding did not, exactly as the section below predicts.

---

## CLAIMCHECK FALSE-PASSED — AND WHAT CLOSING IT RAISED (harness finish, F1)

T2 shipped `npm run claimcheck` reading **"0 failures"**. The resumed fan-out
(`wf_99c74d25-624`) then named cites the gate passed, and four were VERIFIED wrong by hand:
`EnemyKatana.as:213` is `break;` (the gravity is `:205`), cited in three config files — one
of them rewritten by T2 itself with the base cite carried forward unchecked — and
`EnemyDeer.as:224` / `EnemyHorse.as:242` / `EnemyStag.as:302` each sit one line past their
`+ 100`. **A script beat a swarm at resolving cites; a swarm beat the script at noticing the
script was wrong.** Both halves of Rule 3 hold.

| hole | probe on the old lib | fix | hermetic test, red first |
|---|---|---|---|
| a bare `export const NAME = 3` is not a field | 0 fields named `*GRAVITY*` in `ogNpcHumanoid.ts` | read that spelling too (+16 values) | `HOLE 1` |
| a value passes if ANY of its cites holds it | `fallGravity: 3` had six cites; the sixth was never judged | every cite must hold a value it governs | `HOLE 2` |
| ±1 passes an off-by-one by construction | the three `+ 100` cites | ±0 | `HOLE 3` |

**Why per CITE, measured rather than argued:** a per-FILE rule misses `EnemyDeer.as:224`,
because the same run's `:238` holds the `100`. Only judging each cite on its own catches all
four.

**±0, measured over the whole corpus:** 0 new per-value failures; 4 new per-cite ones — the
three real drifts and one correct cross-reference (`EnemyDeer.as:79`). Ranges measured at
±0 and ±1 raised the same set.

**The fixed gate on the unfixed tree: 82 failures.** Every one classified by opening the
cited line:

| class | n | what it was | fixed by |
|---|---|---|---|
| wrong line | 10 | the 4 verified (6 sites) + `NPC.as:410` (a waterDamage `{`; the deflect is `:437-440`), `EnemyWolf.as:168` (`else`; the 15 is `:166`/`:178`), `EnemyWolfAlpha.as:392` (the `if`; the steps are `:396`/`:400`), `EnemyBear.as:41-44` (→ `:42-45`) | correcting the cite |
| wrong FILE, set by prose | 41 | "(twins: Knife `:86` …)", "(ogre `:120`)", "(F `:111`, O `:169`)" — a human reads them right, the gate resolved them to the header's file | naming the file; all 41 then held their value at ±0 |
| wrong VALUE | 5 | a docblock over two consecutive fields cites the second, which the gate cannot see (`kickStep2`, `walkBackwardsDiv`, `poseOn`, `arriveDice`) | giving the second field its own docblock (+4 values) |
| correct context | 26 | a contrast, a cross-reference, a guard, a twin map | a named `CONTEXT` entry with the reason (29 after three of the fixed cites turned out to be context too) |

After F1: **1,701 cites · 421 values at ±0 · 29 context · 0 failures · 0.21 s.** Chaos-proofed
three ways, each gate exit 1 and `tests/claimcheck.test.ts` red, restored byte-identical:
re-plant `:213` · re-plant `:224` · a stale `CONTEXT` entry.

### THEN THE SWARM CHECKED THE SCRIPT — `wf_1b4b7826-c2e`

The per-cite rule is strong for a cite that governs ONE value (476 of the 648 passing) and
weak for one that governs several: any of their literals on the line passes it. So the 172
multi-value cites went to a read-only fan-out — packets pre-built by script (docblock,
governed values, which literal matched, the cited lines ±3), 6 chunks × 2 independent
lenses (prose → line; value → line), judges writing to disk before returning.
**12/12 live, 172/172 judged by BOTH lenses, and the lenses agreed on every one:**
158 RIGHT · 12 COINCIDENCE · 2 WRONG. Every flag re-read by hand before acting.

- **2 WRONG, a class no literal gate can see — the right number on the wrong BRANCH.** The
  flee `dest` list cited `EnemyBear.as:248` and `EnemyStag.as:307`; both are
  `this.destX = -100;` under `doChase && … < 400` — the CHASE. The flee mirrors are `:256`
  and `:315`. Fixed.
- **12 COINCIDENCE → CONTEXT** (bear clip roll `:98-108`/`:110`, six more fox↔wolf twin-map
  cites, the wolf header's four reused-base-constant cites). Listing them paid immediately:
  **`OG_BEAR.idle.walkOn = 1` went LITERAL-ABSENT** — its only support had been the `1` in
  `if(dice == 1)`, the SIT index. Its real line, `:173`, sat in the docblock of the field
  above it; it now has its own cite. Probed both ways: drop that cite → red; drop the
  context entry → the coincidence passes silently again.

**The residual, measured rather than hoped away:** the gate cannot tell a coincidental
literal from a real one, so an UNLISTED context cite can still vouch for a value, and a
right-literal-wrong-branch cite passes. Both are adversarial-read work (Rule 3's last row),
and this run is the measurement of their size on this corpus: 14 of 172. A numeric field
on the line after a cited field, with no enclosing cite, is out of scope (uncited, not
passed).

---

## ADJUDICATING A RUN — the swarm proposes, a script re-executes, a human reads the source (harness finish, F3)

`wf_99c74d25-624` raised **68 refutations** across its 8 verdicts. Every one is an agent
claim, and many land on committed text, so acting on them needed three layers, each doing
only what it is good at:

1. **A read-only fan-out re-derives each claim by command** (`wf_6826589c-ae0`, 9/9 live,
   68/68 adjudicated), returning per item a status, a category (measurement-only / committed
   text / test gap / behaviour / already fixed), the command, and its verbatim output.
2. **A script re-executes EVERY cited command** — 534 of them — under `sandbox-exec` with all
   writes under `/Users` denied, and diffs the quoted output against the real one: **534
   MATCH.** Read-only is enforced by the OS, not guessed from the command text: the first
   version refused commands containing `>`, and so refused 50 harmless `awk 'NR>=…'` reads.
3. **A human re-reads the source for every line that changes.** This layer earned its place
   at once: two chunks proposed DIFFERENT fixes for the same lines, and both were partly
   wrong (the horse's `else` is `:166-169`, not `:169-172`; the flip-and-ground blocks are
   bear `:42-46` / stag `:41-45`). **Two independent proposals disagreeing is the signal to go
   to the source, not to pick one.** It also caught this loop's own draft claiming "an
   animal's death draws NO rng" — `createLoot` draws.

| status / category | n |
|---|---|
| CONFIRMED / measurement-only | 31 |
| CONFIRMED / committed text | 15 |
| CONFIRMED / already fixed (by F1) | 2 |
| CONFIRMED / test gap | 1 |
| PARTIAL / measurement-only | 9 |
| PARTIAL / committed text | 8 |
| PARTIAL / test gap | 1 |
| REFUTED (the measurement was right) | 1 |

**What changed:** 74 proposed sites, all addressed from the source — the deer's false
"only one that never re-targets" (the horse doesn't either), `EnemyBear.ts` stating the tick
guard backwards, "a levelled stag pays less" being true of every animal, the wolf's
uncited pounce fence, off-by-one field cites in all four ports, and more. **+2 tests and +3
chaos plants** for the two confirmed gaps (the bear's `canGot*` immunity; all four `die()`
bodies under playback and `dontGiveLoot` — `EnemyHorse.die()` had no test at all).
`npm run chaos`: **43/43 RED, 43/43 restored byte-identical.** Every row, with its command
and output: `docs/research/runs/wf_99c74d25-624-LEDGER.md`.

---

## WHERE THIS LIVES OUTSIDE THE REPO (harness finish, F5)

The rules above that are not SSHD-specific are in `~/.claude/CLAUDE.md` ("Harness engineering"),
so every project loads them. The fan-out generalises as the user-level workflow
**`measure-refute`** (`~/kheshav-code/agent-harness/harness/workflows/` — the public agent-harness
repo, Level 6 — symlinked into `~/.claude/workflows/`): the same fail-closed accounting as `measure-verify`, no SSHD defaults, and
zero agents without `units` + `lenses`. This repo keeps `measure-verify` — the two names differ
because precedence between a user-level and a project-level workflow of the same name is
undocumented. The chaos runner and claimcheck stay here: no other repo under `~/kheshav-code`
has a single `.as:N` cite, and a runner with zero plants is an empty gate. A generic, zero-dependency
port of the chaos runner is public in agent-harness (`harness/chaos/`) — hardened past this copy by
an adversarial review (async test runs so signals restore, a lock in `.git/`, whole-tree drift
checks); see RESUME_HERE for the port still owed back.

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

## RULE 4 — A GATE THAT IS ALWAYS RED CARRIES NO INFORMATION (session 38, 2026-09-17)

CI had failed on **every push to master for 24 days** — six consecutive runs, last green
`32707925686` on 2026-08-24 — and it was found only because a refuter was pricing an unrelated
candidate and checked whether "CI catches it anyway" was a fair fallback. It was not: CI could
not pass.

The cause is one measured vitest fact:

> `describe.skipIf(cond)` skips the TESTS in the block. It still **executes the block body**
> to collect them.

Six `og*` suites each computed `HAVE_SOURCE = existsSync(<path under reference/>)` and then read
that same path inside `describe.skipIf(!HAVE_SOURCE)`. `reference/` is gitignored by invariant,
so on a fresh checkout the read threw ENOENT at collection time and the guard written to prevent
exactly that had no effect. Probe: a `describe.skipIf(true)` block whose body reads a nonexistent
path gives `Test Files 1 failed (1) / Tests no tests` — the sibling test outside the block does
not run either.

**The rule this earns is not about vitest.** It is that the failure was invisible *because* the
signal was saturated: a real regression pushed on day 25 would have been the seventh red run and
indistinguishable from the other six. That is fail-open accounting (RULE 2) at the level of a
whole gate rather than one agent. So:

- **A gate nobody can distinguish from broken is worse than no gate**, because it is still
  believed to be watching. Check that your always-green gate is capable of red (RULE 2's
  known-positive control) — and check that your always-RED gate is capable of green.
- **Reproduce a CI failure locally before fixing it**, and use the RIGHT reproduction:

      git clone -q --no-hardlinks . <scratch> && ln -sfn "$PWD/node_modules" <scratch>/node_modules

  ⚠️ **NOT `git archive HEAD | tar -x`.** That was the first method used here and it is subtly
  wrong: it produces the tracked files but NO `.git`, so every test that shells out to git
  (`check-ignore`, `ls-files`) fails for a reason CI would never hit. It reported **4 phantom
  failures** against a tree that is in fact green — a false RED, which costs a session chasing
  nothing and trains you to distrust the harness. `actions/checkout` makes a real repository, so
  the local stand-in must too. Caught only because the run was checked rather than assumed.
  With the right method: `6 failed | 77 passed (83)` → `1588 passed | 55 skipped (1643)`.
- **A skip must be loud and counted.** The fixed suites report `1576 passed | 55 skipped (1631)`
  on a clean clone. 55 is a number an operator can challenge; a silent skip is not.

### THE COROLLARY FOR PROSE GATES — run them on the commits that are pure prose

`scripts/gates/instructionPaths.ts` (session 38) resolves every repo path the four standing
instruction files name. Measured: **87 of the last 266 commits (32.7%) were markdown-only** and
took the pre-commit docs-only fast path, and **61 of those 87 touched a `CLAUDE.md` or
`RESUME_HERE.md`** — the exact files such a gate reads. A gate on prose that the prose-only
commit skips can only ever go red on a later commit that did not cause the break, and a blocking
gate with broken attribution is how `--no-verify` gets learned. The fast path therefore runs the
prose gate (node directly, ~0.1 s, no vitest boot) and only skips build/test/lint.

### AND THE SCOPE RULE THE FIT LENS EARNED

The first version of that gate read six files including `RESUME_HERE.md`: **24 unresolved tokens,
exactly 1 of them a real defect** — 4% precision, six classes of suppression on day one, and 19
of the false reds in the one file that produced zero true ones. Scoped to the four files that
state *rules* (not the session scratchpad), it needs **zero** exemptions.

> **An exemption list is a hiding place.** Here "bare relative fragment" would have had to
> swallow `core/` and `run2/` — and a genuinely deleted `docs/loop/` is byte-identical to that
> idiom, so the gate would report 0 over a live defect. That is the claimcheck false-pass this
> repo already paid 82 corrections for. Prefer fixing the prose to widening the rule: `core/`
> became `src/core/`, which is also simply more accurate.
