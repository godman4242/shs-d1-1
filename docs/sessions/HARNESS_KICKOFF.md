# HARNESS KICKOFF — THE FRAMEWORK THAT CLOSES THE MODEL GAP

> **Written 2026-09-12 at `e3bf924`, immediately after L4b slice 3 closed (21 of 34
> ported, 1438 tests).** Every number below was MEASURED in that session, not
> estimated. Model for the harness session: **Opus 5 @ `xhigh`** — the point of the
> session is to stop needing a bigger model, so it is done on the smaller one.

---

## THE THESIS, AND WHY IT IS TESTABLE

Kheshav's ask: *"it would be good if we had a framework so good to the point you
could have Fable-level capability while being on Opus 5, thus the output quality
won't make a difference much."*

That is a real, falsifiable engineering goal, because the capability gap on THIS
repo's work has a specific shape. Porting AS3 to TypeScript is not hard reasoning —
it is **hard noticing**. Every defect this lane has ever shipped came from the same
place: a claim that looked true, was never checked against the source, and nothing
in the toolchain could tell. A bigger model closes that gap by noticing more. **A
harness closes it by making the un-noticed thing fail a gate.**

So the deliverable is not "better prompts". It is: **for each class of mistake this
repo has actually made, a gate that goes red.**

---

## THE EVIDENCE — session 35, measured

**What the harness already does well, and should be productised:**

| Lever | Measured result | Why it mattered |
|---|---|---|
| Fan-out measure + adversarial verify (read-only), one loop for every WRITE | **20/20 agents over two workflows, 0 errors, 14/14 verdicts, 4 FATAL — and all four refuted a MEASUREMENT, none refuted a port** | Surfaced **2 real test gaps** my own tests missed and **1 wrong doc claim I had already committed** (the boar's `canGotFly` framing). The alpha's override lens returned the session's only CLEAN |
| Chaos plants | **40 plants, 38 red on the first pass, 2 stayed GREEN** | Those 2 green plants WERE 2 missing tests. Nothing else in the toolchain would have found them |
| `tests/npcTree.test.ts` reading the `.as` itself | caught nothing this session — because it already binds | The only gate that compares the PORT to the SOURCE rather than to itself |

**What cost time, and has no gate:**

| Failure | Count this session | Root cause |
|---|---|---|
| First-run test failures that were **TEST bugs, not port bugs** | **3 of 3** (cooldown tick-order; an actor parked in FALL on the ground landing on frame 1; an rng of 0.9 failing the walk roll it needed to pass) | A test can set up a state the actor leaves immediately, and nothing says so |
| **A kickoff trap that could never fire** | **1 of 7** (`mcs.scaleX == 1` has no target anywhere — not in `EnemyWolfAlpha.as`, `NPC.as` or `MCSCharacter.as`) | A kickoff's claims are prose. Nothing resolves them against the source — and this one survived a pass explicitly labelled "TESTED against the AS3" |
| Config **twins** with no rule | 3 judgement calls (wolf twins → test-pin; stag idle → import; alpha floor chain → test-pin) | No written rule, so each is re-litigated |
| **State-schema drift that actually shipped** | 1 (`EnemySpearElite.ts:92-95` duplicates `scaleTo`/`xp`; the source does neither) | Benign, but nothing detected it for two slices |

**The pattern:** the PORTS have been right. The **tests, the kickoffs and the config
bookkeeping** are where the defects live — and those are exactly the three things
with no gate.

---

## THE TASK — five tools, each with a binary done-criterion

Build them in this order; each is independently shippable and independently gated.
**Do not start T2 until T1 is green**, and so on — the same stage discipline the
lanes use.

### T1 — `scripts/gates/chaos.ts`: the plant harness, committed

Today the chaos harness is a throwaway Python script rewritten per slice in the
scratchpad (`chaos3a.py`, `chaos3b.py`). It is the highest-yield gate this repo has
and it is not in the repo.

Make plants **declarative and co-located**: `tests/npcSlice3a.plants.ts` exports a
list of `{ name, file, find, replace, expect: 'red', tests }`. The runner applies
each, runs the named tests, requires a failure, restores from a backup, and
`cmp`-verifies the restore.

- **DONE =** slice 3's **40 plants** are expressed declaratively and the runner
  reproduces **40/40 red, 40/40 restores byte-identical**, in one command.
- **DONE =** a plant whose anchor no longer matches is a LOUD failure, never a skip
  (fail-closed: a plant that cannot be applied must not look like a plant that passed).
- **DONE =** `npm run chaos` exists and is documented in `CLAUDE.md`.
- ⚠️ Do NOT wire it into pre-commit — it rewrites source files, and a crashed run
  mid-plant must never be able to leave the tree dirty. It is a slice-gate command.

### T2 — `scripts/gates/claimcheck.ts`: every cite resolved against the source

Every config value and class header in this repo carries `<File>.as:<line>`. **None
of them is checked.** A cite that drifts by one line is invisible forever, and the
slice 3 kickoff's `scaleX` trap was dead in exactly this way.

Parse every `` `Something.as:123` `` (and `:123-456`) out of `src/config/**` and
`src/core/npc/**`, open the file, and assert the cited line exists. Then the harder
half: for cites attached to a numeric config value, assert the **literal appears on
or within ±2 lines of the cited line**.

- **DONE =** it runs over the whole repo and reports **0 unresolvable cites**, with
  every genuine miss either fixed or explicitly allow-listed with a reason.
- **DONE =** it is in the pre-commit gate (it is read-only and fast).
- **DONE =** chaos-proof it: shift one cite by 3 lines → red; restore → green.

### T3 — `.claude/workflows/measure-verify.js`: the fan-out, saved and parameterised

The measure → adversarial-verify workflow was hand-written twice this session with
the same shape and different lens text. Save it once, take the class list and the
lens set as `args`.

- **DONE =** re-running slice 3a's measurement from the saved workflow reproduces
  **8/8 verdicts** and re-raises the same single FATAL.
- **DONE =** it keeps the fail-closed accounting already proven here: zero live
  verifiers ⇒ `UNVERIFIED`, never `CLEAN`; a dead measure agent ⇒ `UNMEASURED`.
- **DONE =** `docs/research/HARNESS.md` states the rule the session validated:
  **fan out READS, never WRITES** — the classes in a slice share a config file, the
  `SHIPPED` map and one test-count contract, so parallel writes are the documented
  parallel-overwrite failure.

### T4 — the twin rule, written once and enforced

Three times this session I chose between *import the shared constant* and *pin
equality by test*, with no rule. Write the rule, then enforce it:

> **Import** when the value is shared by classes shipping in the SAME slice (new
> files, zero blast radius — e.g. `OG_STAG.idle` is `OG_HORSE.idle`).
> **Test-pin** when one side already SHIPPED (never churn a green file — e.g.
> `OG_ANIMAL.xp` vs `OG_WOLF.xp`, `OG_ALPHA.setLevel.floor` vs the spear boss's).

- **DONE =** the rule is in `src/config/CLAUDE.md`.
- **DONE =** a test enumerates every declared twin pair in the repo and asserts
  equality, so a future edit to either side goes red. Seed it with the pairs slice 3
  already pins.
- **DONE =** `EnemySpearElite.ts:92-95`'s duplicated `scaleTo`/`xp` is removed **in
  its own commit with its own gate** — it is flagged in DIVERGENCES and is the one
  piece of known drift already in the tree. Removing it is a behavioural no-op; prove
  that by running slice 2b's tests before and after.

### T5 — the test-harness preflight

All 3 first-run failures this session shared one root: **the test parked an actor in
a state whose own `doAction` left it before the assertion ran.**

Add to the shared test helpers:
- `parked(npc, state)` — asserts the actor is STILL in `state` after setup, with a
  message naming what moved it.
- `rollsFor(npc, fn)` — returns the exact rng call count a body makes, so a test can
  assert its `seq` length instead of guessing (this is already a documented harness
  rule; make it executable).

- **DONE =** all three of session 35's failures are reproducible as one-line
  preflight failures with a readable message, demonstrated in the commit.
- **DONE =** the helpers are used by at least the slice 3a/3b suites.

---

## THE RED-TEAM — steelman what this is NOT

**Steelman the rejected option:** the honest alternative is *"just run Fable on the
hard slices and stop building tooling."* It is cheaper today — no T1–T5 to write —
and Fable genuinely would notice more. **Where my pick breaks:** if the remaining 13
classes are mostly like the wanderers (mechanical, low-trap), the harness pays for
itself slowly and the tooling time was better spent porting. **What it secretly
depends on:** that the defect profile stays *bookkeeping-shaped* (tests, cites,
twins) rather than *reasoning-shaped*. If slice 4's bosses turn out to need real
reasoning about intent rather than careful transcription, T1–T5 will not help and a
bigger model will.

**Is my pick downstream of what I deprioritised?** Partly, and it should be said: I
am the incumbent model, so "build a harness so the model matters less" is a
self-flattering conclusion. The honest tiebreak is the measurement, not the
preference — **3 of 3 first-run failures this session were test bugs, and a kickoff
trap that could never fire survived a pass labelled "TESTED against the AS3"** —
neither is a model-capability problem. A bigger model reading the same unverified
kickoff would have inherited the same dead trap.

**Veto path:** if Kheshav would rather spend the session porting slice 4, say so and
this file keeps until the port work hits a defect the harness would have caught.

---

## SCOPE CUTS — do not do these in the harness session

- **No lane work.** Slice 4 is not started here; `src/core/npc/` gains no new class.
  The ONLY source edit permitted is T4's removal of the duplicated `scaleTo`/`xp`,
  in its own commit.
- **`src/core/Sim.ts`, `OpponentController.ts` and the seam are not touched.**
  Gate L4b-A (`git diff 42a62e2 … | wc -c` → 0) must still hold at the end.
- **`src/config/ogActor.ts` stays CLOSED evidence** — the transcriber owns it.
- No new runtime dependency. The stack is fixed (Phaser 3 / TS 5 / Vite / Vitest).

---

## THE BASELINE TO CONFIRM FIRST

```bash
git log -1 --oneline          # e3bf924 or later — say what landed since
npx vitest run                # Test Files 79 passed (79) · Tests 1438 passed (1438)
npm run -s typecheck && npm run -s lint                     # both exit 0
git diff 42a62e2 -- src/core/Sim.ts tests/duel-baseline.test.ts src/core/OpponentController.ts | wc -c   # 0
```

**The test count binds.** T1–T5 add tests; none of them may REMOVE one, and the
count must be stated against **1438** at every gate.

---

## THE PASTE-READY PROMPT

```text
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

THE HARNESS SESSION — build the gates that make the model matter less.
Opus 5 @ xhigh. Plan first, then go.

READ FIRST:
  1. docs/sessions/HARNESS_KICKOFF.md   — the thesis, the measured evidence, T1-T5.
  2. RESUME_HERE.md top block           — what slice 3 left and must not be "fixed".
  3. docs/DIVERGENCES.md "L4b (slice 3a)" and "(slice 3b)" — findings 12-14, and the
     flagged-not-fixed EnemySpearElite.ts:92-95 duplication that T4 removes.

CONFIRM THE BASELINE with a real run:
  git log -1 --oneline   ->  e3bf924
  npx vitest run         ->  79 files / 1438 tests
  npm run -s typecheck && npm run -s lint   ->  both 0
If HEAD has moved, say what landed since. The test count binds.

THE TASK. Five tools, in order, each independently gated and committed:
  T1 scripts/gates/chaos.ts    — the plant harness, declarative and committed.
     DONE = slice 3's 40 plants reproduce 40/40 red, 40/40 restores byte-identical,
     via `npm run chaos`; an unmatchable anchor is a LOUD failure, never a skip.
  T2 scripts/gates/claimcheck.ts — every `<File>.as:<line>` in src/config and
     src/core/npc resolved against the real file; numeric cites checked within +/-2
     lines. DONE = 0 unresolvable cites, wired into pre-commit, chaos-proofed.
  T3 .claude/workflows/measure-verify.js — the fan-out, saved and parameterised.
     DONE = re-running slice 3a reproduces 8/8 verdicts and the same single FATAL;
     fail-closed accounting preserved (no live verifier => UNVERIFIED, never CLEAN).
  T4 the twin rule in src/config/CLAUDE.md + a test enumerating every twin pair.
     DONE = rule written, pairs pinned, and EnemySpearElite.ts:92-95's duplicated
     scaleTo/xp removed in ITS OWN commit with slice 2b's tests green either side.
  T5 test-harness preflight: parked(npc, state) and rollsFor(npc, fn).
     DONE = all three of session 35's first-run failures reproduce as one-line
     preflight failures with readable messages, demonstrated in the commit.

SCOPE CUTS: no lane work — slice 4 is NOT started and src/core/npc/ gains no new
class. The seam and Sim.ts are not touched (gate L4b-A must still read 0 bytes).
ogActor.ts stays CLOSED evidence. No new runtime dependency.

THE EVIDENCE THIS IS BUILT ON, so you do not re-derive it:
  - 3 of 3 first-run test failures in session 35 were TEST bugs, not port bugs; all
    three shared one root — an actor parked in a state its own doAction left at once.
  - 1 of the slice 3 kickoff's 7 traps could never fire (`scaleX == 1` has no target
    anywhere), and it survived a pass labelled "TESTED against the AS3". Its setLevel
    warning ("diff it, do not assume it is a copy") was CORRECT and paid off.
  - the adversarial pass caught a WRONG CLAIM IN A COMMITTED DOC that every test was
    green around: the boar's `canGotFly = true` restates the base default
    (`NPC.as:70-78` declares all five true) rather than diverging from it. No gate
    could have caught it, because no gate reads prose — which is T2's whole point.
  - 40 chaos plants ran; 2 stayed GREEN and those 2 were real missing tests.
  - EnemySpearElite.ts:92-95 duplicates scaleTo/xp; the source does neither.

DONE = each T green with PASTED output, test count stated against 1438, RESUME_HERE
rewritten (never appended) in the SAME commit, and the scope cuts restated.
Never soften a gate to fit a result — re-author, or come to me for a ruling.

Tell me your plan for T1 before you write code, then go.
```

---

## THE START COMMAND

```bash
cd "/Users/kheshav/kheshav-code/SSHD 1-1" && claude
# then: /model -> Opus 5 (1M context) · /effort -> xhigh
# then paste the `text` block above.
```
