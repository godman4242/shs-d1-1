# HARNESS FINISH KICKOFF — close T2's holes, close T3 and T5, adjudicate the run, roll it out

> **Written 2026-09-14 at the commit after `a790c82`**, at the end of session 36 (the
> harness session), on the owner's call to finish in a fresh session. Every number below
> was MEASURED in session 36 and pasted at its commit. Where a claim was checked against
> the source by hand before being written here, it says **VERIFIED**; where it comes from an
> agent and has NOT been checked yet, it says **AGENT CLAIM — verify first**.
>
> Model: **Opus 5 @ `xhigh`** — this is surgical gate and test work, not long-horizon
> reasoning.

---

## WHERE SESSION 36 LEFT IT

```
$ git log --oneline -7
  <this kickoff's commit>   docs: the harness finish kickoff
  a790c82  checkpoint: T3 + T5 committed as they stand, the dead run salvaged — NOT closed
  3f41c9d  T4 harness: the twin rule, and the table that enforces it
  38fe93c  T2 harness: claimcheck — 1,703 cites resolved, and three of them were wrong
  b4e361b  fix: the horse plant's name claimed more than the plant breaks
  cdb2519  T1 harness: the chaos plant harness, committed — 40/40 red
$ npx vitest run        ->  Test Files 83 passed (83) · Tests 1619 passed (1619)
$ npm run chaos         ->  40/40 RED, 40/40 restored byte-identical   (at T1)
$ npm run claimcheck    ->  1703 cites · 401 values (±1) · 0 failures  ← ⚠️ FALSE-PASSES, see F1
```

| | tool | state |
|---|---|---|
| T1 | `npm run chaos` + `tests/*.plants.ts` | ✅ closed |
| T2 | `npm run claimcheck` | ⚠️ **RE-OPENED** — three measured false-pass holes (F1) |
| T3 | `.claude/workflows/measure-verify.js` | 🟡 evidence in; one flaw open (F2) |
| T4 | twin rule + `tests/configTwins.test.ts` | ✅ closed |
| T5 | `tests/utils/npcHarness.ts` — `parked` / `readsWhatYouWrote` / `rollsFor` | 🟡 not yet adopted by the slice suites (F4) |

**The T3 evidence run** (`wf_99c74d25-624`): first launch **died** — 4/4 measure agents
returned, **8/8 verify agents killed by the account session limit**, and the fail-closed
accounting correctly reported `0/8 live verdicts … not clean`. Resumed with the script
byte-unchanged (the 4 measurements replayed from cache): **12/12 agents, 0 errors, 8/8 live
verdicts, 1 FATAL, 7 CORRECTED, 0 CLEAN.** Both journals are committed under
`docs/research/runs/`. Its findings are the input to F1 and F3.

---

## THE TASK — in this order. Each item is independently committed.

### F1 — CLOSE T2'S THREE FALSE-PASS HOLES. First, because a gate that says "0 failures" over wrong cites is worse than no gate.

**VERIFIED by hand in session 36:**

| cite as committed | what the line actually is | the right line | where cited |
|---|---|---|---|
| `EnemyKatana.as:213` | `break;` | **`:205`** `velY += 3;` | `ogNpcAnimal.ts:82`, `ogEnemyWolf.ts:49`, `ogNpcHumanoid.ts:32` |
| `EnemyDeer.as:224` | `}` | **`:223`** `this.destX = …+ 100;` | `ogNpcAnimal.ts:97-98` |
| `EnemyHorse.as:242` | `this.startAction(POSE_STATE);` | **`:241`** | `ogNpcAnimal.ts:97-98` |
| `EnemyStag.as:302` | `this.startAction(POSE_STATE);` | **`:301`** | `ogNpcAnimal.ts:97-98` |

⚠️ **One of these is session 36's own defect.** T2 rewrote `ogNpcHumanoid.ts:32` to read
"`EnemyKatana.as:213` — FALL_STATE gravity per frame, `velY += 3`", verified the nine TWIN
cites under it, and carried the base cite forward unchecked. Correct it and say so in the
commit.

**The three mechanisms that let them through — the first two VERIFIED by probing the real
lib in session 36:**
1. **A bare `export const NAME = 3` is not a numeric field.** `numericFields` matches only
   `key: value`. Probe: `numericFields(prepare(ogNpcHumanoid.ts))` holds **0** fields named
   `*GRAVITY*`, so `OG_HUMANOID_FALL_GRAVITY = 3` (`ogNpcHumanoid.ts:38`) was never
   literal-checked at all.
2. **The union of cites lets good cites cover a bad sibling.** Probe:
   `scopeFor` for `fallGravity: 3` in `ogNpcAnimal.ts` returns **six** cites —
   `EnemyBear.as:222`, `EnemyDeer.as:200`, `EnemyHorse.as:216`, `EnemyStag.as:280`,
   `EnemyWolf.as:329`, `EnemyKatana.as:213` — and passes if ANY holds a `3`, so the wrong
   sixth is never judged on its own.
3. **±1 hides off-by-one drift by construction.** The three `+ 100` cites are each one line
   off, exactly the window — and the gate reported 0 failures over them.

**DONE =**
- each mechanism is a hermetic unit test that goes RED against the current lib first;
- the gate is changed so that **all four verified cites above go RED on the current tree**
  (paste the run) — and only then are the cites fixed and the run pasted GREEN;
- ±0 is MEASURED over the whole corpus for single-line cites and adopted if every new
  failure it raises is a real drift; any failure that is not real gets an allow-list entry
  with a reason, never a wider window;
- chaos-proofed: re-plant one of the four → red → restore → green;
- the count of newly caught cites is stated, and `CLAUDE.md`'s claimcheck line stops
  saying the gate "found three" as if that were the whole story.

### F2 — CLOSE T3

- **The flaw the dead run exposed:** the result carries `fatalCount: 0` beside `0/8 live
  verdicts`, so a consumer checking `fatalCount === 0` reads a dead run as clean. Make it
  `null` (and add a top-level `status: 'UNVERIFIED'`) whenever live < expected; pin it in
  `tests/workflowScripts.test.ts` on `wfcheck`'s DEAD branch, red first.
- **A stale line:** `docs/research/HARNESS.md` says `Workflow({ name: 'measure-verify' })`
  did not resolve. After a reload the registry listed it. Re-test from this session, paste
  the result, correct the line.
- Record the evidence run in `HARNESS.md`: dead run `0/8 → UNVERIFIED` (accounting held),
  resumed `8/8, 1 FATAL`, and that it was a DIFFERENT FATAL from session 35's — the
  annotation already in `HARNESS_KICKOFF.md` predicted exactly that.
- **DONE =** the test red-then-green, the two doc lines corrected, committed with T3 marked
  closed in RESUME_HERE.

### F3 — ADJUDICATE THE RUN'S FINDINGS. Verify every one before acting on it.

Read both journals (`docs/research/runs/wf-journal-measure-verify-3a-RESUMED-*.jsonl` holds
all 12 results). The run refuted MEASUREMENT claims, but several of its corrections land on
**committed repo text**. Each is an **AGENT CLAIM — verify first**, against the `.as`, with a
real command:

- **Committed uniqueness claims that are false:** the deer is described as the ONLY wanderer
  that never re-targets and never re-checks while RUNNING — the horse also never re-targets,
  and all four skip `checkPlayer` while running. Named sites: `src/core/npc/EnemyDeer.ts:5-7`,
  `src/config/ogEnemyDeer.ts:6-7`, and test titles in `tests/npcSlice3a.test.ts`.
- **Test gaps:** `EnemyHorse.die()` is called by no test; the bear's five `canGot*` flags and
  its no-op reaction to launch/knockdown hits are asserted nowhere (deleting one is not
  planted); a hit decided by the bear's JAW (kept in `PART_weapon`) runs the base parry.
- **More drifted cites** the gate could not see: `ogEnemyBear.ts:43` `:41-44` → `:42-45`
  (and `EnemyBear.ts:19`); `EnemyStag.ts:11` `:9` → `:10`; horse `:154` → `:153` in test titles
  `npcSlice3a.test.ts:677` and `:937`; drifted cites inside DIVERGENCES' 3a section.
- **Mis-labels:** several die()/elemental items called "source bugs" are ported-as-they-read
  deltas; the only source bug in 3a is the stag constructor dropping `doChase`.

**DONE =**
- a ledger in `docs/research/HARNESS.md` (or DIVERGENCES) listing EVERY refutation of the 8
  verdicts as `CONFIRMED` / `REFUTED`, each with the command and its output;
- every CONFIRMED test gap pinned red-first and chaos-planted, with `EXPECTED_TOTAL` raised
  in BOTH `scripts/gates/chaos.ts` and `tests/chaosGate.test.ts`, and `npm run chaos` pasted
  N/N;
- every CONFIRMED committed claim corrected in the same commit as its evidence;
- nothing acted on that was not verified.

### F4 — CLOSE T5

- `tests/npcSlice3a.test.ts` and `tests/npcSlice3b.test.ts` import `seq` / `counting` from
  `tests/utils/npcHarness.ts` and delete their local copies;
- each of the three historical trap sites calls its preflight
  (`readsWhatYouWrote` at the bear cooldown test, `parked` at the alpha pounce-mid test,
  `rollsFor` at the alpha cutscene test).

**DONE =** `grep -c "^const seq = " tests/npcSlice3a.test.ts tests/npcSlice3b.test.ts` → 0 / 0;
both suites' test counts equal or higher than before; `tests/chaosGate.test.ts` still
resolves all anchors; full suite pasted.

### F5 — THE GLOBAL ROLLOUT (the owner's ask: every project, present and future)

Sharpened from "apply this universally" into measurable pieces. **Measure before writing,
back up before editing, and do not write into another repo without reading its CLAUDE.md.**

1. **Scout first, write nothing:** read `~/.claude/CLAUDE.md` (it already carries
   "Architecture routing — graph engineering", which covers fail-open accounting and
   parallel overwrite — do not duplicate), `~/.claude/new-project.sh`, `~/.claude/skills/`,
   and the two repos that look like the natural home: `~/kheshav-code/claude-shipping-kit`
   and `~/kheshav-code/agent-work-ethic`.
2. **Measure whether a user-level `~/.claude/workflows/` directory is registered** (it does
   not exist today). If it is: a project-agnostic `measure-verify.js` lives there. If it is
   not: it lives in the shipping kit and `new-project.sh` copies it into `.claude/workflows/`.
3. **`~/.claude/CLAUDE.md` gains a compact "Harness engineering" section** — only the rules
   not already there: a script beats a swarm; chaos plants are declarative, committed,
   count-pinned, green-baselined and require a FAILED TEST; claims about a source are
   resolved by a gate, not by reading; two copies of one value are imported or pinned, and
   coincidences are deny-listed. Back up the file first (the `.bak-YYYYMMDD` convention is
   already in `~/.claude`). State its measured per-turn token cost against the existing
   overhead recorded in memory.
4. **Existing repos:** report which of the 7 under `~/kheshav-code/` got what, and why;
   stack-specific tooling (the chaos runner, claimcheck) is NOT copied into a repo whose
   stack does not fit.

**DONE =** backups exist; the section is in and its token cost is pasted; a throwaway project
made by `new-project.sh` shows the workflow present (then deleted); the per-repo table is in
the reply.

### F6 — WRAP

`RESUME_HERE.md` rewritten (never appended) in the same commit as the last change;
`docs/sessions/-SESSION-LOG.md` updated **per milestone, not at the end** (session 36 missed
this and caught up only at its checkpoint); durable cross-project lessons saved to memory
under `~/.claude/` (never in a repo).

---

## SCOPE CUTS

- **No lane work.** Slice 4 is not started; `src/core/npc/` gains no new class. F3's edits
  to `src/core/npc/*.ts` are COMMENTS and their tests only — no behaviour change.
- `src/core/Sim.ts`, `OpponentController.ts` and the seam are not touched; gate L4b-A
  (`git diff 42a62e2 -- src/core/Sim.ts tests/duel-baseline.test.ts src/core/OpponentController.ts | wc -c`) stays **0**.
- `src/config/ogActor.ts` stays CLOSED evidence (re-run the transcriber, never hand-edit).
- No new runtime dependency.
- **One workflow in flight at a time**, and never while this loop is writing the files the
  agents read. This machine's workflow concurrency cap measured **6**.

---

## RED-TEAM

**Steelman the rejected order** (F5 first, since it is the owner's newest ask): the global
rollout is what reaches every project, and T2's holes only matter in this repo. **Why F1
still goes first:** the rollout propagates the harness's *claims* ("a gate resolves every
cite"), and F1 is measured proof that one of those claims is currently false. Rolling out a
gate whose "0 failures" is wrong spreads the defect. **Where the pick breaks:** if F1's ±0
measurement turns out to raise dozens of non-real failures, F1 could swallow the session; the
stop rule is **two failed designs → stop and report**, then move to F2. **What it secretly
depends on:** that the four verified cites are representative — F3's unverified list suggests
there are more, which is an argument for F1, not against it.

---

## THE BASELINE TO CONFIRM FIRST

```bash
git log -1 --oneline                    # the kickoff commit, one after a790c82 — say what landed if not
npx vitest run                          # Test Files 83 passed (83) · Tests 1619 passed (1619)
npm run -s typecheck && npm run -s lint # both exit 0
npm run claimcheck                      # 1703 · 401 · 0 failures  (the number F1 must break)
git diff 42a62e2 -- src/core/Sim.ts tests/duel-baseline.test.ts src/core/OpponentController.ts | wc -c   # 0
```

---

## THE PASTE-READY PROMPT

```text
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

THE HARNESS FINISH SESSION. Opus 5 @ xhigh. Plan first, then go.

READ FIRST:
  1. docs/sessions/HARNESS_FINISH_KICKOFF.md — the state, the verified defects, F1-F6.
  2. RESUME_HERE.md top block — session 36's harness work and what is open.
  3. docs/research/HARNESS.md — the rules the fan-out earned.

CONFIRM THE BASELINE with a real run (commands are in the kickoff). The test count binds:
83 files / 1619 tests. claimcheck currently reports 0 failures, and that number is WRONG.

THE TASK, in order, each committed on its own:
  F1 Close claimcheck's three false-pass holes. VERIFIED: EnemyKatana.as:213 is `break;`
     (gravity is :205) in 3 config files; three `+ 100` cites are one line off. DONE = all
     four go RED under the fixed gate on the current tree BEFORE they are fixed, each hole
     is a unit test red first, ±0 measured, chaos-proofed.
  F2 Close T3: `fatalCount: null` + top-level UNVERIFIED when live < expected (test on
     wfcheck's dead branch, red first); re-test and correct HARNESS.md's name-resolution line.
  F3 Adjudicate the 8 verdicts of wf_99c74d25-624 (journals in docs/research/runs/). VERIFY
     EACH against the .as before acting. DONE = a CONFIRMED/REFUTED ledger with commands;
     confirmed test gaps pinned red-first and chaos-planted (EXPECTED_TOTAL raised in both
     places); confirmed committed claims corrected.
  F4 Close T5: slice 3a/3b import seq/counting from tests/utils/npcHarness.ts and call the
     three preflights at their historical trap sites. DONE = 0 local seq copies in those
     two files, test counts not lower, chaos anchors still resolve.
  F5 Global rollout: scout ~/.claude and the shipping-kit repos first; measure whether
     ~/.claude/workflows registers; back up before editing ~/.claude/CLAUDE.md; add only the
     harness rules not already there, with token cost pasted; prove a new-project.sh project
     gets the workflow; report per-repo what was installed and why.
  F6 RESUME_HERE rewritten in the same commit as the last change; session log PER MILESTONE;
     durable lessons to memory under ~/.claude (never a repo).

SCOPE CUTS: no lane work, no new class in src/core/npc/, F3 touches comments + tests only;
seam and Sim.ts untouched (gate L4b-A 0 bytes); ogActor.ts closed; no new runtime dep; one
workflow at a time, never while writing files agents read.

DONE = each F green with PASTED output, test count stated against 1619, and the scope cuts
restated. Never soften a gate to fit a result — re-author, or come to me for a ruling.
Two failed designs on the same problem → stop and report.
```

---

## THE START COMMAND

```bash
cd "/Users/kheshav/kheshav-code/SSHD 1-1" && claude
# then: /model -> Opus 5 (1M context) · /effort -> xhigh
# then paste the `text` block above.
```
