# RESUME HERE

## ▶ SESSION 37 (2026-09-14) — **THE HARNESS FINISH, IN PROGRESS** (`docs/sessions/HARNESS_FINISH_KICKOFF.md`)

| F | what | state |
|---|---|---|
| **F1** | close claimcheck's three false-pass holes | ✅ **CLOSED** — per-cite at ±0 + bare consts; 82 failures raised on the old tree, all classified; 0 after (`docs/research/HARNESS.md`) |
| **F2** | close T3 (`fatalCount: null` on a dead run; the name-resolution line) | ✅ **CLOSED** — `status` + `fatalCount: null` unless every verdict is live, pinned on the executed dead branch; `name` resolves from a fresh session (probed with a bogus name) |
| F3 | adjudicate the 8 verdicts of `wf_99c74d25-624` | open — `EnemyBear.as:41-44` → `:42-45` already CONFIRMED and fixed in F1 |
| F4 | close T5 (slice 3a/3b adopt the preflight) | open |
| F5 | global rollout | open |
| F6 | wrap | open |

## ▶ SESSION 36 (2026-09-13/14) — **THE HARNESS SESSION: T1 + T4 CLOSED · T2 RE-OPENED (false-passes found) · T3 + T5 CHECKPOINTED · NEXT: `docs/sessions/HARNESS_FINISH_KICKOFF.md`. NO LANE WORK.**

Thesis (`docs/sessions/HARNESS_KICKOFF.md`): every defect this lane has shipped came from
**hard noticing, not hard reasoning** — a claim that looked true, was never checked against
the source, and nothing in the toolchain could tell. A bigger model closes that by noticing
more; a harness closes it by **making the un-noticed thing fail a gate**. Five tools, each
independently gated and committed.

**SCOPE CUTS, restated and held:** no lane work — slice 4 is NOT started and `src/core/npc/`
gains no new class · `src/core/Sim.ts`, `OpponentController.ts` and the seam are untouched
(gate L4b-A still reads **0 bytes**) · `src/config/ogActor.ts` stays CLOSED evidence
(transcriber re-run, no diff) · no new runtime dependency.

### THE FIVE TOOLS

| | tool | state |
|---|---|---|
| **T1** | `scripts/gates/chaos.ts` + `tests/*.plants.ts` — the plant harness, committed | ✅ LANDED (`cdb2519`, corrected by `b4e361b`) |
| **T2** | `scripts/gates/claimcheck.ts` — every `<File>.as:<line>` resolved against the real source | ✅ **RE-CLOSED in session 37 (F1)** — landed `38fe93c`; its "0 failures" hid 4 VERIFIED wrong cites through three holes, now closed |
| **T3** | `.claude/workflows/measure-verify.js` — the fan-out, saved and parameterised | ✅ **CLOSED in session 37 (F2)** — resumed run 8/8 live verdicts, 1 FATAL; the `fatalCount: 0`-on-a-dead-run flaw fixed and pinned |
| **T4** | the twin rule in `src/config/CLAUDE.md` + a test enumerating every twin pair | ✅ LANDED (`3f41c9d`; source half `abb484e`) |
| **T5** | test-harness preflight — `parked`, `rollsFor`, **and a third check the kickoff missed** | 🟡 **CHECKPOINTED** — helpers + proof committed; NOT yet adopted by the slice 3a/3b suites |

### ✅ T1 — `npm run chaos`

```
$ npm run chaos          ->  40/40 plants went RED
                             40/40 files restored byte-identical; git says the tree is clean
$ npx vitest run         ->  Test Files  80 passed (80)      (was 79 — +1: tests/chaosGate.test.ts)
                             Tests  1517 passed (1517)       (was 1438 — +79)
$ npm run -s typecheck   ->  exit 0
$ npm run -s lint        ->  exit 0
$ git diff 42a62e2 -- src/core/Sim.ts tests/duel-baseline.test.ts src/core/OpponentController.ts | wc -c   ->  0
$ python3 scripts/payload/transcribeActorConsts.py && git diff --stat src/config/ogActor.ts   ->  EMPTY
```

**The 40 are not all the same 40, and the file says so.** Session 35's throwaway harness
survives only in its FIRST-PASS form (15 of slice 3a's 18; all 22 of 3b), because the three
plants it added mid-session after the adversarial pass were never written back. So **37 are
transcribed byte-for-byte by an AST extractor** (`recovered:`) and **3 are re-authored here**
from the guards the session log and DIVERGENCES record (`reauthored:`). The runner prints the
provenance on every line. 37 was not rounded up to 40 and the criterion was not softened to
37/37.

**One recovered anchor had already drifted to ZERO matches** — `EnemyStag.ts` gained a
comment block between `super(...)` and `this.canGotLaunched` after the plant ran. The runner
treats that as a LOUD failure, never a skip, which is how it was found; it is re-anchored to
the same intent. `tests/chaosGate.test.ts` now resolves all 40 anchors **in pre-commit**, so
the next drift goes red on the commit that causes it.

**Two fail-open holes in the scratchpad version are closed** (both would have let a broken
plant look like a caught one): it never proved the baseline was GREEN, so a test file that was
already red handed a free pass to every plant aimed at it; and it scored **any** non-zero exit
as red, so a plant that broke the *compile* counted as caught. A plant is now RED only if
vitest reports ≥1 FAILED TEST — anything else non-zero is `INCONCLUSIVE`, which fails.

**All six process-level guards chaos-proofed, each exit 1:** unmatchable anchor →
`PLANT-FAILED` · a guard no test covers → `STAYED-GREEN ⚠️ MISSING TEST` · a plant that
breaks the parse → `INCONCLUSIVE` · a dirty target file → refuses to start · a backup
directory left by a crashed run → refuses to start · the plant count shrinking → refuses to
start. Tree verified clean after every probe.

⛔ **`npm run chaos` is NOT in pre-commit and must never be** — it rewrites shipped source.
It is a slice gate. The pre-commit half is `tests/chaosGate.test.ts`, which applies nothing.

### ✅ T2 — `npm run claimcheck`

```
$ npm run claimcheck     ->  cites resolved       1703
                             cited values checked 401   (±1)
                             ✅ every cite resolves and every cited value is where it says it is
                             real time 0.446s   (first version: 2m02s — see below)
$ npx vitest run         ->  Test Files  81 passed (81)      (was 80 — +1: tests/claimcheck.test.ts)
                             Tests  1546 passed (1546)       (was 1517 — +29)
$ npm run -s typecheck   ->  exit 0        $ npm run -s lint  ->  exit 0
```

**IT FOUND THREE REAL BUGS, and all three were IN RANGE** — an existence-only gate passes
them clean, which is the whole argument for the numeric half. In `src/config/ogEnemyKatana.ts`:
`:140` for `walkSpeed = random() * 3 + 4` should be **`:129`** (line 140 is
`startAnim(GOTLAUNCHEDDOWNED)`); `:175-176` for the left-facing melee test should be
**`:167`**; `:185` for the right-facing one should be **`:179`**. Five config values sat
under those three cites. All fixed, each verified against the source by hand.

**27 more cites were unresolvable and are now fixed in the doc, not special-cased in the
gate.** They were bare `:N` cites whose target file was set by ENGLISH PROSE — "(ogre
`:317`)", "(Female `:28`)", `` `EnemyWolf2.as:24` ↔ `:227` ``. Every one now names its file.
Three of them (`:66`, `:70`, `:88` in `ogEnemyWolf.ts`) had been silently PASSING against
the wrong file. Two `EnemySpearElite` dice cites were widened to ranges, because the branch
values live 13 and 11 lines below the cited line.

**The resolution rules are measured, and two obvious ones are FALSIFIED** — written up in
`scripts/gates/claimcheckLib.ts`'s header. "Inherit the last named cite above" mis-resolves
~30 values in `ogEnemyWolfAlpha.ts`, which names `EnemySpearElite.as` mid-file as a
CONTRAST; "the header always wins" mis-resolves bare cites that genuinely follow a
mid-clause name. The rule is: same comment line first, header default second, nothing else.

**±1, not the kickoff's ±2, and that is a TIGHTENING.** Measured both: ±2 also passes with
zero failures, so ±1 loses no coverage while roughly halving the false-PASS surface
(decompiled AS is one-statement-per-line, so a ±2 window admits four to six unrelated small
integers — `midDiv: 10` would pass against any of 40 / 10 / 5 / 60). `npm run claimcheck --
--window 2` re-measures the looser one.

**TWO FILES ARE EXEMPT FROM THE NUMERIC HALF, each with a reason and each already gated
elsewhere:** `ogAi.ts` transcribes `NPCManager.as`'s dispatch switch as DATA (its numbers
are ai ordinals, XML placement attributes and source LINE NUMBERS — a ±N window over those
is a category error; `tests/ogAiData.test.ts` byte-checks it with an INDEPENDENT parser),
and `fidelity.ts` holds values MEASURED OFF 1080p STUDY FRAMES, not transcribed from the
AS3 at all.

**It was 2m02s and is now 0.446s** (275×). The first version re-parsed the whole file for
every numeric field, and `src/config` holds ~17,000 of them. Two minutes fails the one
thing a pre-commit gate must be.

**Chaos-proofed five ways, each exit 1, tree clean after every probe:** shift a cite by 3
lines → `LITERAL-ABSENT` · name a file that does not exist → `MISSING-FILE` · cite past
end-of-file → `LINE-OOR` · corrupt a value its cite no longer supports → `LITERAL-ABSENT` ·
plant an allow-list entry that is no longer needed → `STALE-DERIVED`.

⚠️ **It needs `reference/`**, which is gitignored study-only material. Without it the run
exits 0 saying it checked NOTHING, and the corpus half of the test skips with that reason
asserted. That is the gate's one deliberate fail-open; the hermetic unit tests always run.

### ✅ T4 — the twin rule, and the table that enforces it

```
$ npx vitest run tests/configTwins.test.ts  ->  47 passed (47)
$ npx vitest run                            ->  Test Files 82 passed (82) · Tests 1601 passed (1601)
$ npm run -s typecheck / lint               ->  exit 0 / exit 0
```

The rule is in **`src/config/CLAUDE.md`**: IMPORT when both sides ship in the same slice
(zero blast radius, and an imported value cannot drift at all); TEST-PIN when one side
already SHIPPED (never churn a green file); DENY-LIST when two values hold the same number
for DIFFERENT rules. Enforced by **`tests/configTwins.test.ts`** — 36 field-level twin
pairs asserted equal, 2 import-resolved pairs asserted IDENTICAL (`toBe`, so tidying an
import into a copy goes red), and 7 deny-listed pairs that assert what makes them differ.

**13 of 31 declared twin relationships had no assertion anywhere.** The whole of slice 2a's
civilian config appeared in ZERO tests, and `chaseDist: 400` had three config homes and no
pin at all. Every one of the 36 pairs passed on the first run, so nothing had drifted yet —
which is the only time to write a pin.

**⚠️ THE DENY-LIST IS THE HARD HALF, and a generated twin-finder would have got it wrong.**
Four coincidences must never be pinned: `OG_STAG.chargeSpeed` 15 vs `OG_ANIMAL.runSpeedRoom`
15 (a charge is not a run — and the charge deliberately does not step down in the overworld
where RUN does); `OG_ALPHA.runSpeed` 15 vs the wolf's room/overworld PAIR; `OG_BEAR.idle.dice`
3 vs `OG_HORSE.idle.dice` 3 (different clip sets). And the WORD "twin" does not settle it:
`OG_SPEAR_ELITE.boss.trivialLevel` is documented as a twin of `OG_NPC_SET_LEVEL.trivialLevel`
and the numbers are **5 and 10** — a twin RULE, not a twin VALUE.

**Chaos-proofed three ways, each red then green:** drift the civilian xp from the wolf's →
red · drift the boar's `chaseDist` → red · turn the stag's `idle` IMPORT into a spread copy →
the identity assertion goes red.

### 🟡 T3 + T5 — CHECKPOINTED, NOT CLOSED (this commit). The next session finishes them.

```
$ npx vitest run         ->  Test Files  83 passed (83)      (82 at T4 — +1: tests/npcHarness.test.ts)
                             Tests  1619 passed (1619)       (1601 at T4 — +18)
$ npm run -s typecheck   ->  exit 0        $ npm run -s lint  ->  exit 0
$ git diff 42a62e2 -- src/core/Sim.ts tests/duel-baseline.test.ts src/core/OpponentController.ts | wc -c   ->  0
```

**T3 — `.claude/workflows/measure-verify.js`.** Saved, parameterised by `args`
(`units`, `lenses`, `slice`, `sourceDir`, `tests`), executed by `wfcheck.mjs` on both
branches and pinned in `tests/workflowScripts.test.ts`: 4 units × 2 lenses = **12 agents /
8 verdicts** alive, **4 agents** dead (a dead measurement is never handed to a verifier).
`docs/research/HARNESS.md` carries the three rules the fan-out earned (fan out READS never
WRITES · a dead agent must not look like a clean one · a script beats a swarm).

**Its first real run died, and the accounting HELD.** `wf_99c74d25-624`: 4/4 measure agents
returned; **8/8 verify agents died on the account session limit** ("You've hit your session
limit · resets 6:30pm"). The workflow returned `0/8 live verdicts … 8 UNVERIFIED … A unit or
lens missing from the counts DIED — it was not clean`, and every unit read `UNVERIFIED`.
That is the fail-closed design proven by a real death, not a stub. Raw journal committed:
`docs/research/runs/wf-journal-measure-verify-3a-DEAD-wf_99c74d25-624.jsonl`. **Resumed**
the same day with the script byte-unchanged, so the 4 measurements replay from cache.

⚠️ **ONE FLAW THE DEAD RUN EXPOSED, deliberately NOT fixed before the resume** (editing the
script burns the resume cache): the result carries `fatalCount: 0` beside `0/8 live
verdicts`. Anything that checks `fatalCount === 0` reads a dead run as clean. Fix =
`fatalCount: null` (and a top-level `status: 'UNVERIFIED'`) whenever live < expected, plus a
test. ⚠️ **AND A STALE LINE IN `HARNESS.md`:** it says `Workflow({ name: 'measure-verify' })`
did not resolve. That was true in the session that wrote the file; after a reload the
registry lists `measure-verify`. Re-test from the fresh session and correct the line.

**T5 — `tests/utils/npcHarness.ts` + `tests/npcHarness.test.ts`.** ⚠️ **The kickoff's premise
was WRONG**: "all 3 failures shared one root — an actor parked in a state its own
`doAction` left" is true of **1 of 3** (annotated in `HARNESS_KICKOFF.md`). The real shared
root is *the test's setup silently did not hold at the assertion* — so it ships THREE checks:

| session 35 failure | what went wrong | check |
|---|---|---|
| the bear's cooldown | test WROTE `idleCounter = 1`; `doAction` TICKED it before the branch READ it | `readsWhatYouWrote` |
| the alpha parked in FALL | first `update()` landed it; the LAND clip masked the clip under test | `parked` (placed at the ASSERTION, not the setup) |
| rng 0.9 | one clamped `seq` value served two rolls with different bands | `rollsFor` (returns the VALUES, not just the count) |

All three historical broken setups reproduce as one readable line; each check chaos-planted
(disarm it → red → restored green). Two first-draft bugs caught by the proof itself:
`readsWhatYouWrote` checked the FIRST read (always matches setup — green on the very bug)
and the demo alpha had no target (so its clip never advanced).
**NOT DONE:** the slice 3a/3b suites still carry their own `seq`/`counting` copies and do
not yet call the preflight — T5's "used by at least the slice 3a/3b suites" is OPEN.

**Also not done this session:** the global rollout Kheshav asked for (make this harness
architecture apply to every project), and `docs/sessions/-SESSION-LOG.md` entries were
missed until this checkpoint.

### ⚠️ THE RESUMED RUN LANDED — AND RE-OPENED T2

`wf_99c74d25-624`, resumed with the script byte-unchanged: **12/12 agents, 0 errors, 8/8 live
verdicts, 1 FATAL, 7 CORRECTED, 0 CLEAN** (the 4 measurements replayed from cache; only the 8
verifiers re-ran). Journal: `docs/research/runs/wf-journal-measure-verify-3a-RESUMED-wf_99c74d25-624.jsonl`.
The verdict COUNT matches session 35's (8/8, 1 FATAL); the FATAL itself is a different one —
exactly as the annotation in `HARNESS_KICKOFF.md` predicted, which is why it was never a gate.

**It found cites `npm run claimcheck` passes and should not. VERIFIED by hand:**
`EnemyKatana.as:213` is `break;` — the gravity line is `:205` — and it is cited in
`ogNpcAnimal.ts`, `ogEnemyWolf.ts` and `ogNpcHumanoid.ts` (the last one REWRITTEN by T2 itself,
with the base cite carried forward unchecked). And `EnemyDeer.as:224` / `EnemyHorse.as:242` /
`EnemyStag.as:302` are each one line past their `+ 100` line. Probed mechanisms: a bare
`export const NAME = 3` is never a numeric field; a value's union of cites passes if ANY one
holds the literal; ±1 hides off-by-one drift by construction.

The rest of its findings (false "ONLY one of the four" claims in committed deer headers and test
titles, `EnemyHorse.die()` untested, the bear's `canGot*` flags unpinned, more drifted cites)
are AGENT CLAIMS, unverified. **All of it is scoped in `docs/sessions/HARNESS_FINISH_KICKOFF.md`
(F1 claimcheck holes · F2 close T3 · F3 adjudicate · F4 close T5 · F5 global rollout · F6 wrap).**

### THE LANE STATE — unchanged since session 35 (`abb484e`), and still in force

Slice 3 closed at **21 ported NPC classes / 23 `SHIPPED` entries**, 13 of 34 to go. The full
narrative is in `docs/DIVERGENCES.md` "L4b (slice 3a)" and "(slice 3b)" (findings 12–14) and
`docs/sessions/-SESSION-LOG.md` (2026-09-12); it is not repeated here. What a future session
needs is below, verbatim.

### ⛔ WHAT A FUTURE SESSION MUST NOT "FIX"

- **The stag's constructor drops `doChase`**; **the boar red-freezes with a DEER clip**;
  **the alpha has no `!isDowned()` guard** and **no cutscene read at all**.
- **The bear's ATTACK faces with its own comparison**, not `faceTarget()` (they disagree at
  exactly equal x). **Only the bear ticks `idleCounter` outside IDLE.**
- **The boar's `gotLaunched` has no `canGotLaunched` check** and omits `FLY` from its
  airborne set; **its `doLaunched` lands into WALK.**
- **The alpha's `KNOCKDOWNED` falls through** to DOWNED's 48 frames; its RUN re-rolls
  `destX` and is flat 15; its pounce hits THREE parts.
- **The alpha's defence-order is unobservable and is NOT chaos-planted** — that is
  deliberate and recorded, not a missing test.
- **`init` enters IDLE twice** (once via `reset()`) for all four wanderers — two rng rolls.
- **`EnemySpearElite.ts`'s duplicated `scaleTo`/`xp` is GONE** (owner ruling 2026-09-12,
  its own commit). Proven a no-op by a 680-row sweep, byte-identical before and after;
  slice 2b is 40 tests either side. Do not re-introduce it.
- Everything SESSION 34 listed is still in force: in-frame re-entry, the wolf's four
  reception overrides, the boss floor chain falling through, the elite's single cooldown,
  the fox fleeing before it bites, civilians landing into DOWNED, the archer's knife on the
  clip's END, `gotLaunched()`'s guard ported as it BEHAVES, the 24 Hz integer accumulator,
  `OG_NPCS` raw into `init()`, **`src/config/ogActor.ts` is CLOSED evidence** (re-run the
  transcriber, never hand-edit), and the roster / `AI_TIERS` carry from SESSION 32.

### 📋 WHAT IS LEFT — slices 4–6, 13 descendants

`docs/sessions/L4B_KICKOFF.md`'s order: the goblins and ogre, ninja / shield / zombies, the
props (**`EnemyVegePatch` — TEN overrides and NEITHER `startAction` NOR `doAction`**,
already pinned in `tests/npcTree.test.ts`), then the bosses. **There is no slice 4 kickoff
yet** — write one the way `L4B_SLICE3_KICKOFF.md` was written (measure per file, never
carry a number forward) before starting.

**How a class ships (unchanged):** `src/core/npc/<Name>.ts` with `override` on EXACTLY the
AS3's set → numbers in `src/config/og<Name>.ts`, CONTRACT, line-cited, twins named → add to
`SHIPPED` in `tests/npcTree.test.ts` → test FROM the AS3, red first → chaos-plant EVERY
guard → DIVERGENCES for anything the seam cannot express (number from **15**).

**Harness rules slice 3 added:** `init` enters IDLE TWICE (`reset()` then its own line), so
count TWO rng rolls before choosing a `seq`; a fresh wanderer has NO animation and
`idleCounter == 0`, but the ALPHA and the wolf are already snarling from their
constructors; `world({...})` spreads a COPY, so mutate `npc.world` to flip `adventureMode`
mid-test; a guard reading a value the SOURCE writes twice (per-direction speed) needs BOTH
branches driven or a plant sails through it; a roll that is gated by `isAdventureMode()`
changes the rng CALL COUNT per frame, so a room test and an overworld test need different
`seq`s; and an actor parked in FALL on the ground LANDS on the first frame, masking
whatever clip you were testing.

```bash
npx vitest run && npm run -s typecheck && npm run -s lint
python3 scripts/payload/transcribeActorConsts.py && git diff --stat src/config/ogActor.ts   # must be EMPTY
```

### ⛔ NOT DONE, and said here rather than at a gate

Slices 4–6 (13 descendants). `EnemyPlayer` + `EnemyElite` + `EnemyPlayerGiant` +
`FriendlyElite` (they extend `MCSPlayer` — **L5**). `CutsceneActor` (**L1**). Rewiring
`AI_TIERS` (moves `Sim.ts` — **L5**). **No adapter builds an `NpcWorld`** — `playerStats`,
`adventureMode`, `peaceful`, `duelMode`, the kill-cam callback, `doChase` (finding 13) and
the `spawn` sink (finding 14) are all L5's to wire. The fight-feel grade (A1 cites + the
owner's LOOK). None attempted, none claimed.



## ⛔ SESSION 30 (2026-09-06) — **L3B: THE GATE IS BUILT AND TWO DEFECTS ARE GONE. THE ART IS STILL OPEN.**

**⭐ THE STANDING VERDICT (owner, 2026-09-05, A5) — it outranks every score below:**
> *"to be fair it ddint lok liek the video i sent, can we do it in a new session make the
> kicoff so we can continue with improvement"*

👉 **HE HAS NOT LOOKED AT THE POST-CHANGE RENDER. Nothing below claims the lane is closed.**
Rebuild the image and put it in front of him — that, and only that, closes L3B:
```bash
npx vite-node scripts/art/renderPose.ts -- dressed --out renders/L3_dressed.png \
    --json renders/L3_dressed.json --supersample 4
python3 scripts/art/rebuildZoomCompare.py      # renders/ is GITIGNORED — always rebuild
npx vite-node scripts/art/bandCompare.ts       # GATE A13-A, cell by cell
```

```
$ npx vitest run    ->  Test Files  68 passed (68)
                        Tests  1073 passed (1073)     (was 67 / 1059 at session start)
$ npm run typecheck -> exit 0        $ npm run lint -> exit 0
```

### ✅ WHAT LANDED

**1. GATE A13-A — a gate that can see colour blocking, which no aggregate could.**
`tests/a13Bands.test.ts` · `scripts/art/bandLedger.ts` · `scripts/art/sourceBands.ts` (emitted
by `scripts/art/bandRuler.py --emit`). Six bands x five paint classes; tolerance is
`max(5 pp, 2 x the source's own frame-to-frame spread)`, so **the bar is measured, not
chosen**. Red-proofed as an *executable* artifact and chaos-planted twice. Blind spots
declared in `sourceBands.ts`'s header. **A green A13-A is necessary and not sufficient.**

**2. No bare feet on a dressed fighter.** `zFt_0061.png` shows none; `setShoes` dresses those
parts with shoe art the CDN took.

**3. The branch rides higher, on the owner's LOOK** — *"the stick is supposed to be above his
waist in the front so he can pull it out"*. Checked against the frame: **he is right**, and
`ogPose.ts`'s own recorded grip height (0.426) was WRONG — the frame says **0.385**. `y` -55
-> **-59** (grip 0.444 -> 0.409), chosen on the HELD-OUT sweep, not on the traced frame:
-62 lands the grip exactly on 0.385 and costs 0.0145 of held-out.

```
                    start of L3B      now
sealed tracing      0.9005469      0.9179540    floor RAISED twice
sealed held-out     0.8490331      0.8654201    floor RAISED twice
height              140.48         138.26 px    ceiling LOWERED to 138.3
aspect w/h          0.521          0.533        (source 0.530)
A13-A worst cell    23.169         12.778 pp    ratchet at 12.78
```
⚠️ **The old floors had ZERO headroom.** The render sat at 0.9005469 against a 0.9005 bar, and
`RESUME_HERE` was quoting **0.9185** beside it — that is `compareToSource.py`'s DIAGNOSTIC
score, which its own header says must never be quoted as the sealed one.

### ⛔ THE OWNER'S OTHER TWO DEFECTS — both confirmed, both blocked

**"empty patches in the pants"** — REAL, located at y 0.64-0.67, y 0.80-0.83, y 0.97. Cause:
9011 is one panel drawn at BOTH calf slots (23 deg and -3 deg) and the instances do not meet.
**The old claim that the far leg "cannot be traced" is FALSE** — re-tested, it closes cleanly
(4430 px -> 4106 with the saya dropped, four seeds agree). It was built, wired, measured and
then REMOVED: every two-panel arrangement is an extra black contour and `hakama/ink` is
already over the source. **The real fix is ONE shape for the whole hakama**; the whole-mass
trace currently floods to the crop edges because the grass joins cloth to background. The full
table and the recipe are in `traceGarment.py`'s hakama note and DIVERGENCES.

**"the shirt looks too baggy"** — REAL. The source's jacket has a straight front edge and a
clean horizontal hem; ours bells outward. That is 9015, and 9015 is the shape that **cannot be
regenerated** without reinstating the SESSION 22 balloon (A9-E 0.44 -> 3.50 local px).

### ⛔ THE BLOCKER THAT OWNS THE REST OF THE LANE

**Three of the seven traced garments do not regenerate, though every file says they do.**
9001/9011/9012/9014 reproduce path for path. **9017** loses its 6 weave ribs + 13 fringe
ticks, **9019** loses its detail paths, and **9015 loses the SESSION 22 balloon repair AND
moves its outer ring.** `reauthorGarment.py` now REFUSES to write an SVG with fewer paths than
the one it replaces.

⇒ **The white column and the baggy shirt are both blocked on 9015.** The juban and obi ARE
painted, in the measured whites, and 9015's silhouette covers them. Both widenings were
measured and rejected (crop+window: held-out **0.8385, under its floor**; window alone: 0.8634
for +0.0015 tracing).

### ⛔ THE ART LANE IS PARKED — OWNER'S CALL, 2026-09-06

> *"nevermind the game logic is wht is imoprtant for now"*

L3B does NOT close and nothing above claims it does. It is parked with every remaining
defect named, measured and attributed. **The next lane is L4a — the enemy roster and the
AI dispatch table — and its kickoff is written and committed:**

👉 **`docs/sessions/L4A_KICKOFF.md`** — and its **§ SESSION 31 RECON** block, which banks the
measured vocabulary dump so no session re-derives it. 495 NPCs unread in `npcdata.xml` (zero
references in `src/`), against three hand-authored AI tiers in `src/config/ai.ts` while
`NPCManager.as:516` carries a 38-case `switch(xml.ai)` — one of **three** dispatches.
**Eleven traps were written down; a twelfth through twentieth were measured on 2026-09-07,
and trap 3's count was wrong.** See the SESSION 31 block at the top of this file.

### 📋 WHEN THE ART LANE RESUMES, IN ORDER

### ⛔ TWO ITEMS OF THE L3B KICKOFF'S GAP LIST ARE REFUTED — do not re-inherit them

- **"The kasa is the wrong colour" is FALSE.** Its fills are byte-exact to `sourceColour.ts`'s
  p75/p25. So are 9012's, 9014's and 9015's. **No garment has a wrong hue**; the band means
  differ because the AREAS do.
- **"The white juban/obi is missing" is an OCCLUSION bug**, not a missing garment.

### ⏮ L3's data + contract halves stay CLOSED

**982 items x 412 modifier rows byte-exact** (`652eebb`) and **the compositing CONTRACT**
(`1b9b479`) are untouched by all of this. It is **13 / 12 / 9 and all three are right**
(9 + 4 = 13) — `GAUNTLET.md` §2.2.

### ⚠️ Four things a future session must not "fix"

- **`<unique>` is 1 OR 2, not a boolean** (253 / 116). **`<art>` is an ITEM → ITEM pointer**,
  not a sprite id — all 68 targets are item ids, none has its own `art`. **`<minlvl>` is
  negative on 13 rows** (to −4). **`baseprice` on item 11037 ("Santa Pants") is a literal
  `.`** — a typo in the shipped game, preserved in `OG_ITEM_SOURCE_ANOMALIES`, never coerced
  to 0.
- **Two coincidence traps, both DISJOINT and both test-pinned.** 412 modifiers live in **93
  items** while **93 modifier rows** are id-only — different 93s. **178** items have no
  `name` while **178** carry a `desc` — different 178s, zero overlap. The unnamed rows are
  base body/armor art (151 of 178 are worn by an NPC paperdoll), not a lookup failure.
- **There is NO AP meter, and that is correct** (L2). `BattleUI.as` declares three bars and
  no AP bar; AP is a Player-sheet stat, never a duel meter. Do not add one.
- **The Focus caption HIDES between empty and full** (L2). `pct == 0` → grey
  `CANNOT CHANGE STANCE`; `0 < pct < 1` → **hidden**; `pct >= 1` → black `CRITICAL HIT`.
  A bare mid-fight bar is correct, not a missing label.

### ⛔ The compositing half — what is ALREADY known, so do not re-derive it

- **✅ RULED AND APPLIED 2026-09-05 — it is 13 / 12 / 9, and ALL THREE are right.** They
  reconcile exactly (**9 + 4 = 13**). **13** = the equipment MODEL (`StatsManager.as:262-286`,
  `EQ_ARMOR 0 … EQ_ACCESSORY2 12`). **12** = what the RENDERER takes
  (`MCSCharacter.initMCS`). **9** = the EQUIP UI boxes, the stat-granting slots (A1
  `SYNTHESIS.md` §1.3, cite A-13) — `EQ_HAIR/HEAD/NECK/SCABBARD` have no box, and the two
  rings (`EQ_ACCESSORY1/2`) are the reverse: equipped, stat-granting, **never drawn**.
  `prop1` **is the scabbard** (`XMLNpc.as:398`). §2's L3 row now names all three; §1's
  "10-slot" is corrected; `SYNTHESIS.md` is relabelled with its measurement untouched.
  Full reconciliation with cites: **GAUNTLET.md §2.2**.
- **✅ THE Z-ORDER IS SETTLED, and it did NOT come from `<mcs>`.** It is
  `MCSCharacter`'s own explicit `setChildIndex` calls, now transcribed into
  `src/config/ogCompositing.ts`. The old inference in `ogPose.ts` was **half wrong**:
  *head before hair* ✅ confirmed, *calf before foottop* ⛔ reversed (`setShoes` pins the
  foottop to index 0 = BACK). Slots 7 and 11 corrected; `GOLDEN_IDLE` re-baselined once,
  deliberately; `GOLDEN_DRESSED` unchanged, which is the proof the floors did not move.
- **⛔ THE TRAP THAT REMAINS FOR L4: `<mcs>` order is NOT the z-order.**
  It **is** meaningful — it is the EQ index order, mirroring `initMCS`'s `mcsString`
  (`armor|gloves|hair|hat|head|mask|neck|pants|shoes|weapon|prop|prop2`), and it only
  *looks* alphabetical because indices 0–9 were assigned that way. But `initMCS` calls its
  setters in a **different** sequence — `setHead → setMask → setHatHair → setHair → setHat
  → setNeck → setArmor → setShoes → setPants → setGloves → setWeapon → setProp`. **That
  sequence is the lead; neither order is proven to be draw depth.** Compositing in `<mcs>`
  order would be confidently wrong and **no test here would catch it**. Settle it with the
  FLA child depths or an A1 frame.
- **`<type>` IS the slot** (gloves→1 · hair→2 · hat→3 · head→4 · mask→5 · neck→6 · pants→7 ·
  shoes→8 · weapon/prop1/prop2→9, id bands matching one-for-one) — **except armor, whose
  items carry no `<type>` at all**. That is why 153 items are typeless (152 in the 4k band
  plus the orphan 7075).

### ⚑ What the checks caught that review would not have

- **The byte-check caught the lead's OWN error.** An item name was asserted from memory
  (`Ninja Pants`) and the test failed against the source (`Santa Pants`). A review would
  have nodded at it. **Assert nothing you have not read out of the payload.**
- **Python's `read_text()` silently translated the file's CRLFs**, so the first chaos-plant
  did not apply and reported a false "planted". `read_bytes()` is required for any mutation
  of this payload. Node's `readFileSync` does *not* translate — so the test really does see
  CRLF, and its parser is CRLF-proof by test.
- **The `src/game/` numeric-literal ratchet did NOT fire**, though the L3 kickoff predicted
  it would. It scans `src/game/` only; this lane adds to `src/config/`, which permits
  literals (only `src/core/` is zero-literal). No baseline was refreshed.

### 🅿️ Still owed

- **Synology rsync** — the NAS was never reachable (Drive Client running, 3 of 4 shares
  erroring, no Synology on `192.168.68.0/24`). GitHub holds everything irreplaceable: repo
  pushed, and the 592 MB seed at `github.com/godman4242/shs-d1-1-reference` release
  `seed-2026-08-24` (185,103,357 B, private, `zstd -t` verified). Recipe: `docs/RECOVERY.md`.
- **Two owner rulings queued:** the bar self-report (9-for-9), and the 26 superseded
  kickoff docs (64,329 words, stating reversed rulings). *(The "9-slot vs 12" ruling was
  taken and applied 2026-09-05 — GAUNTLET.md §2.2.)*
- **`150% DAMAGE`** — A1 shows it under the bars where we render `BALANCED STANCE`. Not a
  meter; belongs to **L8**. Recorded, not silently changed.

### ⏮ SESSION 28 closed L2 (2026-08-24, `6176713`)

75 skills × 182 level rows byte-exact; zero INFERRED cooldowns (`chiPunch` 4960→**5000**,
`smokeBomb` 7960→**6000**, `stab` relabelled **DIVERGENCE (authored)**); the three bars
`BattleUI.as` actually declares. `src/` moved for the first time in 27 days. The `<req>`
byte-check found a prerequisite tree that would have shipped as "present but empty" —
**all 52 of them** — which is why L3 dumped its vocabulary before writing a line.

---

## 📖 SESSION 28 — the architecture review that armed L2 and L3

**The chop is armed. Ratio ruled 10/90 (`GAUNTLET.md` R7); R2 amended so L0 no longer gates
L2/L3/L4.** 👉 `docs/gauntlet/ARCH/REVIEW.md` is the verdict; 17 agents, all evidence under
`docs/gauntlet/ARCH/`.

**What the review found, and it was not what I expected.** `src/` was frozen 27 days
(`0719673`, 2026-07-28) and **no standing rule caused it**. Six L0 workflow scripts carry
*"This lane touches no source code"* — correct for a survey lane, wider than §4's two-file
no-touch list — and R2 made L0 always-first while L0's gate is markdown integrity. **Arming
a different lane needs ZERO rule edits.**

### ✅ Backups — closed this session, was the single biggest exposure

58 commits had been unpushed since 2026-07-28 and `reference/` (8.2 GB, gitignored) had one
copy. Now: repo pushed; the irreplaceable 592 MB seed is at
`github.com/godman4242/shs-d1-1-reference` release `seed-2026-08-24` (185,103,357 B,
**private**, `zstd -t` verified). 7.6 GB is derived and regenerable — recipe in
`docs/RECOVERY.md`. The three custom crackers now have a tracked mirror in
`scripts/payload/` (copied, **not** moved — L0's banked evidence cites `reference/tools/`).
**Synology is NOT reachable** from this Mac; that rsync is still owed.

---

## ⏸ SESSION 27 (2026-08-23) — L0 STILL MID-FLIGHT. **DO NOT RESTART IT.**

**Wall #11 landed (`0d8aa6d`)** — the line that used to say "no wall hit this session" was
written before it and never corrected. Every wave still returned `INTEGRITY: CLEAN` — 22+
agents, **zero deaths, zero VOID verdicts**; two "dead" batches were recovered off disk.
👉 `docs/gauntlet/L0/SALVAGE.md` has the full wave table and both owner rulings.

### State: judged **1,693 of 1,771** · **553 overturns on 269 sentences** · gate L0-D GREEN

| | session start | now |
|---|---:|---:|
| judged | 1,555 | **1,693** |
| UPHELD | 1,248 | **1,381** |
| NOT-UPHELD (true, wrong target) | 61 | **62** |
| surviving overturns | 494 on 254 | **553 on 269** |
| suite | 62 files / 983 | **63 / 1001** |

### ⛔ DO THESE TWO THINGS FIRST, IN THIS ORDER

**1. Wave E was salvaged WHILE STILL RUNNING, so the worklist was deliberately NOT rebuilt.**
Batches 03 and 04 had not written their side-files yet. Re-salvage (safe and deduped — it
is designed to be re-run), THEN rebuild:

```bash
bash scripts/gauntlet/checkpointL0.sh run16 s27e <transcript-dir-of-wf_15548a04-494>
python3 scripts/gauntlet/buildWorklist.py --root docs/gauntlet/L0
```

If that transcript dir is gone, the side-files in `docs/gauntlet/L0/critics/*.s27e.json`
are enough on their own — `salvageJournal.py --critic-json` works with no journal at all.
**Never re-judge a batch that already wrote its JSON**: §3.2 bars a blind re-judge from
reading another agent's prose, so a lost verdict is re-earned from nothing or not at all.

**2. ⛔ OWNER RULING 2026-08-23 — JUDGING IS OVER. Do not run another `l0-finish-wf3`.**
The t1 tier is a **fixed point**, not a backlog: split by tier, t2 decays (0.13, 0.37) and
emits **zero** overturn-claimers, while every t1 wave spawns ~one new overturn-claimer per
one judged (**1.00**, then **1.14**). It never goes dry at any budget. Owner ruled: bank
wave E, stop. Unjudged stays **KILLED** — the existing fail-closed rule (§0), not a
concession. ~60 leads excluded, all still on disk under `run*/claims.json`.

### What is left, in order

1. **WF-4 dry-loop** — `l0-finish-wf4.workflow.js`, now **6 hunt targets** (13–25 agents).
   Write `docs/gauntlet/L0/convergence.json` YOURSELF from the returned object; the
   workflow does NOT write it. Gate L0-C reads it. All 16 input paths pre-flighted present.
   ⚠ Caps at 4 rounds. If it does not converge, that is a REAL result — report each round's
   count and **take a ruling. Do not soften the gate.**
2. **Rebuild packets** — `python3 scripts/gauntlet/buildLedgerPackets.py --root docs/gauntlet/L0`
3. **Rewrite the ledger** — `l0-rewrite.workflow.js`, 14 slices × (writer + **2** lensed
   verifiers) = **42 agents**. The 15th packet, `frame` (91 findings), has **no writer by
   design** — §0/§1/§5/§7 are assembled by the LEAD.
4. **Drive L0-A…F green** with pasted `gateL0.py` output.
5. **Correct `docs/GAUNTLET.md`** + re-arm per §3.7 **in the same commit** (see below).

### ⚑ WHAT THIS SESSION BUILT

- **The workflow scripts had ZERO test coverage** — ~1,100 lines spawning 40+ agents each,
  and `node --check` **rejects every one of them** (top-level `return`). A broken script was
  only ever found by launching it. `scripts/gauntlet/wfcheck.mjs` compiles them the way the
  runtime does and **executes** them against stubs on both branches (all-dead, all-alive);
  `tests/workflowScripts.test.ts` — 18 tests, every guard chaos-planted and watched RED.
- **The fan-outs were too narrow and §3.8 never said they had to be** (owner: *"my own rule
  was one workflow at a time, not one agent"*). t1 judging 2 → **9** (a third
  `contradiction` lens), wf4 → **13–25**, rewrite 28 → **42**. Each confirmed by EXECUTING
  the script. `BATCH_SIZE` 24 → **7** as a **default, not a flag** — `checkpointL0.sh`
  rebuilds with no flags, so a width living in a command line silently reverts.
- **`citeLint` has a FALSE NEGATIVE** — flagged a byte-exact quote as `QUOTE_UNVERIFIED`
  (`combat-core/crit-1.3-is-sealed-…`, verified at `§1t99s0§.as:3272,:3274`). Fails SAFE
  and no gate reads that status (L0-A fails on `BROKEN`). **Queued for after L0** — fixing
  a gate input mid-drive is what §3.6 warns against.

### ⚑ C4 — A NEW STAGE-0 CORRECTION: "STANCE IS HARD-LOCKED IN COMBAT" IS FALSE

Verified line-by-line by the lead, not taken from a critic:

```
§1t99s0§.as:3050  return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
§1t99s0§.as:3060  if(this.§1t4414s0§ < 48) { return; }   <- early-out, then a 4-branch cycler
§1t99s0§.as:3162  this.§1t4414s0§ -= 48;                 <- and it DEBITS the meter
```

A hard lock needs no cycler, no threshold and no debit. **The Stage-2 landmine below marks
the in-combat stance switch INFERRED; it is CONTRACT, at threshold 48.** The frame's grey
`CANNOT CHANGE STANCE` is the meter's low-end caption (web `§1t113s0§.as:111`,
`getString(960)`), **web-only** — android `BattleUI.as:102` has one fixed string and no
low-end branch, which is why 960 is absent from `118_Mobile_Lang_EN.bin`. Focus numerics
recovered: **max 192 · +1 per tick · switch costs 48**.
**LEDGER CORRECTION ONLY — `Sim.ts` and the duel-baseline move in L5 and nowhere else (§4).**

---


## ⏸ L0 IS MID-FLIGHT — FINISH IT, DO NOT RESTART IT (updated 2026-08-23)

**TEN usage walls, eleven landed runs, zero data lost.** Everything is extracted and
committed. 👉 **Read `docs/gauntlet/L0/SALVAGE.md` first** — it has the exact stage table.

> ⛔ **SUPERSEDED — the block below is the SESSION 26 record, kept for its C1/C2/C3
> corrections and its wall history. Its STATE NUMBERS ARE STALE: judging did not stop
> at 1,555/66, it reached 1,686 of 1,764 and was then CLOSED BY OWNER RULING. Read the
> SESSION 27 block at the top of this file for live state.**

### State (SESSION 26, stale): judged **814 → 1,555 of 1,621** · gate L0-D GREEN

```
$ python3 scripts/gauntlet/gateL0.py --root docs/gauntlet/L0 \
      --ledger docs/research/REBUILD_READINESS.md --out docs/gauntlet/L0/gate.json
GATE L0 — 1660 claims pooled · 1555 judged ids · 0 ledger references
   RED   L0-A  CITE INTEGRITY        the ledger cites no claim at all
   RED   L0-B  NOTHING UNJUDGED      same
   RED   L0-C  CONVERGENCE IS REAL   no convergence receipt — the dry-loop has not run
  GREEN  L0-D  EVERY SOURCE OPENED   all 10 sources surveyed with >= 2 critics each ✅
   RED   L0-E  §6 PROVABLY MINIMAL   6 entries kept with no pasted negative search
   RED   L0-F  SCORECARD EVIDENCE    12 scores carry neither a [[claim]] nor a STILL_UNHELD
LANE L0: ⛔ OPEN — at least one gate item is RED
```

| | session start | now |
|---|---:|---:|
| judged | 814 / 1,467 | **1,555 / 1,621** |
| UPHELD | 559 | **1,248** |
| NOT-UPHELD (true, wrong target) | 54 | **61** |
| KILLED | 854 *(653 merely unjudged)* | **312** |
| surviving overturns | 413 on 229 sentences | **494 on 254 sentences** |
| suite | 59 files / 942 | **62 files / 983** |

**The unjudged tail is converging: 653 → 379 → 66.** Each judging round emits new
findings, and each round's output is smaller than its input.

### ⚑ WHAT THIS SESSION BUILT — four live defects, all "silent staleness"

Every one was found by pre-flighting a gate against the thing it would have to judge, and
every one would have fired only at the END of the most expensive wave.

| # | Defect | Why it mattered |
|---|---|---|
| 1 | **Gate L0-A could be passed by an INVENTED string id** | key lookups (`strings.json["6143"]`) were checked for FILE existence only. Now the key itself must resolve. Pooled BROKEN **2 → 0** |
| 2 | **Gate L0-F read the WRONG scorecard row** | it matched the system name anywhere on a line; `progression`'s blocker says *"post-rebirth SP economy"*, so the check for **economy** read **progression**'s cite. 11 of 12 correct → **12 of 12** |
| 3 | **`buildWorklist` hardcoded its run list at run7** | after run8/9 it offered **653 already-judged findings** for re-judging while the gate saw the true 1,169. Now globs, like the other two tools |
| 4 | **My own wall-insurance wrote prose BEFORE the JSON** | the JSON is the work; §3.2 bars re-reading prose. Order reversed, one canonical `writeBack()` |

### ⚑ THE INSURANCE PAID, IN NUMBERS (wall #9)

Nine of thirteen agents died on a session limit. The workflow reported fail-closed and
correctly: *4/13 critics, nine batches with NO live critic*. **But six batches were on
disk** — two had written their JSON and then died before returning:

```
salvage: critics=10 (4 journal + 6 disk) · verdicts=288 (deduped 192 rows)
```

**96 verdicts — two complete 48/48 batches — recovered that the run itself reported lost.**

### ⚑ C1 IS CORRECTED AGAIN — the blob XOR key is PER-FILE, not 109

`ResourceManager.as:186` keys each blob on **the second character of its own filename**
(`decryptByteArray(ba, resourceFileNameArray[num].charCodeAt(1))`). A critic ran it:

| blob | key | inflated |
|---|---|---:|
| `115_SHS3Resource` | `'h'` 104 | 1,040,849 |
| `113_MusicResource` | `'u'` 117 | 1,402,677 |
| `122_SoundResource` | `'o'` 111 | 29,623 |
| `124_ImageResource` | `'m'` 109 | 1,908,229 |
| `120_BGResource` | `'g'` 103 | 4,412,340 |

**109 is the IMAGE key only.** C3's audio recovery at 111 was right for a reason C1 could
not explain. Repeating universal-109 makes four of five blobs read as noise. Same critic
counted **1,912 exported equipment symbols** in `115` — the sprite-compositing manifest
§4 ⑤ still calls a blocker.

### Carry these, do not re-derive

- **C1 (corrected twice)** — the blobs are NOT all UTF-16LE (36 of 42 are plain text, ONE
  is UTF-16LE, five are XOR'd zlib SWFs, one a GIF) **and the XOR key is PER-FILE**.
- **C2** — the build-parity caveat is **UNDISCHARGED**; the old "byte-identical" proof was
  **CIRCULAR**. The web payload carries ZERO `<questdata>/<skilldata>/<npcdata>/<itemdata>`
  roots, so those four XMLs are the **Android** build. Every row ported from them is
  **v0.682** until a web-side artifact says otherwise. Raises risk for L1–L4.
- **C3** — S0-5 is DEAD: the audio is **RECOVERED**, 13 `DefineSound` tags, 13 named stems.
- **All six §6 "unrecoverable" entries are overturned** by judged claims.

### What is left, in order

1. **Judge the last 66** — read counts fresh from `worklist/MANIFEST.json`:
   `{tier:'t2', batches:1, tag:'<uniq>'}` (45 corroborating, 1 agent) **then**
   `{tier:'t1', batches:1, tag:'<uniq>'}` (21 overturn-claimers, 2 agents).
   ⛔ **ONE WORKFLOW AT A TIME** — owner rule, `GAUNTLET.md` §3 item 8.
2. **WF-4** — `l0-finish-wf4.workflow.js`, dry-loop until TWO rounds **that actually ran**
   find nothing, then completeness. Write `docs/gauntlet/L0/convergence.json` from the
   returned object — the workflow does NOT write it. Gate L0-C reads it.
   ⚠ **Known risk:** the loop caps at 4 rounds and one hunt target is the 7,381-frame
   corpus, which may never go dry. If it does not converge, that is a REAL result — report
   it with each round's count and take a ruling. **Do not soften the gate.**
3. **Rewrite `REBUILD_READINESS.md`** — `l0-rewrite.workflow.js`, 14 slices ×
   (writer + blind verifier) = 28 agents. **Packets are already built and CONSERVED.**
4. **Drive L0-A…F green** with pasted `gateL0.py` output.
5. **Correct `docs/GAUNTLET.md`** and re-arm per §3.7 in the SAME commit — see below.

### The tooling, all red-first and chaos-planted

| Script | Test | Decides |
|---|---|---|
| `citeLint.py` | `citeLint.test.ts` (32) | does a cite resolve — path, line, quote, **JSON key**. Gate L0-A |
| `buildWorklist.py` | `buildWorklist.test.ts` (4) | what still needs judging. **Globs `run*`** |
| `buildLedgerEvidence.py` | `ledgerEvidence.test.ts` (11) | which claims may rewrite the ledger |
| `buildLedgerPackets.py` | `ledgerPackets.test.ts` (16) | one packet per ledger slice; **conservation asserted** |
| `gateL0.py` | `gauntletL0Gate.test.ts` (15) | all six gate items, binary, exit-code |
| `salvageJournal.py` | `salvageCriticJson.test.ts` (11) | journal **+ agent side-files**, deduped |
| `checkpointL0.sh` | — | the six banking steps in the order that matters |

**One command banks a landed wave:**

```bash
bash scripts/gauntlet/checkpointL0.sh run12 <tag> <transcript-dir>
#   add --skip-worklist ONLY if another run is still in flight
```

### ⛔ Three rules that cost real work when broken

- **ONE WORKFLOW IN FLIGHT** (§3 item 8). Concurrency is what *causes* the wall, and you
  cannot rebuild a shared index while a run is live — `buildWorklist` renumbers packets
  a live run's queued agents have not read yet.
- **`resumeFromRunId` is SAME-SESSION ONLY.** The cache is not load-bearing: every result
  is extracted to `run2/`…`run11/` and committed.
- **Always pass a run-unique `tag`.** Review filenames collide across runs otherwise.

**Model: Opus 5 @ `xhigh`** (§2 routing for L0 is unchanged). **Ultracode ON.**

---

## 🅿️ PARKED — the L0 close-out kickoff (was "next"; R2 amended 2026-08-24)

> **No longer the next session.** R7 rules the ratio **10/90** and names **L2 — skills**
> as the chop; R2 no longer lets L0 gate L2/L3/L4. L0's remaining work (WF-4, the ledger
> rewrite) is real and still accurate below — it is now **parallel, not prior**. Run it
> after a lane a player can see has landed.

**Activate first** — a fresh session will not do this for you:

| | setting | why |
|---|---|---|
| **Surface** | **Claude Code CLI** | terminal + git + build-heavy |
| **Model** | **Opus 5** at **`xhigh`** | §2 routes L0 to Opus (R6). **NOT Fable** — that is L7/L9/L11 |
| **Context** | **fresh session** | the previous one salvaged out on a usage warning |
| **Ultracode** | **ON** | a dry-loop and a 42-agent rewrite remain |

Copy everything **between** the `'''` lines (the markers are not part of the prompt):

```
'''
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

READ FIRST, then tell me the state and your plan before you spawn anything:
- RESUME_HERE.md              <- its top block is SESSION 27; the two "do first" items are real
- docs/gauntlet/L0/SALVAGE.md <- wave table + BOTH owner rulings
- docs/GAUNTLET.md            <- §2 lane board, §0 the law, §3.8 one-workflow

THE TASK: CLOSE lane L0 to its binary gate. JUDGING IS FINISHED - do not restart it and do
not run l0-finish-wf3 again. resumeFromRunId is SAME-SESSION ONLY; the cache is not
load-bearing, every result is extracted to docs/gauntlet/L0/run2..run16 and committed.

DO THESE TWO FIRST, IN THIS ORDER:
1. Wave E was salvaged WHILE STILL RUNNING, so the worklist was deliberately NOT rebuilt
   (--skip-worklist). Re-salvage (safe, deduped, designed to be re-run), THEN rebuild:
     bash scripts/gauntlet/checkpointL0.sh run16 s27e <transcript-dir>
     python3 scripts/gauntlet/buildWorklist.py --root docs/gauntlet/L0
   If the transcript dir is gone, docs/gauntlet/L0/critics/*.s27e.json is enough on its
   own. NEVER re-judge a batch that already wrote its JSON - §3.2 bars a blind re-judge
   from reading another agent's prose, so a lost verdict is re-earned from nothing.
2. OWNER RULING 2026-08-23: judging STOPS. The t1 tier is a FIXED POINT (t1->t1 1.00 then
   1.14; t2->t2 0.13 then 0.37, emitting zero overturn-claimers), so it never goes dry at
   any budget. Unjudged stays KILLED - the existing §0 rule, not a concession.

ALREADY BANKED - do NOT re-derive:
- 1,693 of 1,771 claims JUDGED. 1,381 UPHELD, 62 NOT-UPHELD, rest KILLED, 0 VOID.
- 553 surviving overturns on 269 distinct ledger sentences.
- ALL 12 systems and ALL 10 source sweeps judged. Gate L0-D is GREEN.
- Packets built and CONSERVED under docs/gauntlet/L0/packets/, 0 quarantined. Rebuild
  after step 1 with buildLedgerPackets.py, but the shape is proven.
- Suite 63 files / 1001 green. Tooling all red-first + chaos-planted: citeLint.py,
  buildWorklist.py, buildLedgerEvidence.py, buildLedgerPackets.py, gateL0.py,
  salvageJournal.py, checkpointL0.sh, and NEW wfcheck.mjs (+ workflowScripts.test.ts, 18).
- FOUR Stage-0 corrections C1/C2/C3/C4. C1 twice-corrected: blobs are NOT all UTF-16LE,
  and the XOR key is PER-FILE (2nd char of the filename); 109 is the IMAGE key only.
  C4 is new this session - see the C4 block in RESUME_HERE.md.

WHAT IS LEFT, in order:
1. WF-4: l0-finish-wf4.workflow.js - dry-loop until TWO rounds THAT ACTUALLY RAN find
   nothing, then completeness. NOW 6 HUNT TARGETS (13-25 agents) because the 7,381-frame
   corpus was one hunter's job and could never go dry; it is split by measured counts
   (session24 3,525 | the two longplays 2,689 | curated sets 1,167). Write
   docs/gauntlet/L0/convergence.json YOURSELF from the returned object - the workflow does
   NOT write it. Gate L0-C reads it. All 16 input paths verified present.
   ⚠ Caps at 4 rounds. If it does not converge, that is a REAL result: report each round's
   count and come to me for a ruling. DO NOT soften the gate.
2. python3 scripts/gauntlet/buildLedgerPackets.py --root docs/gauntlet/L0
3. Rewrite docs/research/REBUILD_READINESS.md via l0-rewrite.workflow.js - 14 slices x
   (writer + TWO lensed blind verifiers) = 42 agents. Approval is UNANIMOUS; a slice only
   one lens read is NOT verified. Each writer may cite ONLY its own packet, inline as
   [[unit/claim-slug]]; gate L0-B resolves every one and goes RED on anything unjudged,
   refuted or invented. ⚠ The 15th packet, `frame` (91 findings), has NO WRITER BY DESIGN
   - §0/§1/§5/§7 are assembled by YOU, and your cites are machine-checked the same way.
4. Drive gates L0-A..F green with PASTED gateL0.py output.
5. Correct docs/GAUNTLET.md - §2.1's string-table blocker is DEAD (VERIFIED first-hand:
   resolved_names.json gives itemdata 804/0 misses, npcdata 484/6, skilldata 73/0), the
   L1b lane row is obsolete, and §2's L6 "~150 animations" is 471 (VERIFIED: 18
   MCSCharacter_* blobs by tags.anim, 99_HumanAnimationData alone = 158) - and re-arm per
   §3.7 in the SAME commit.

⛔ ONE WORKFLOW IN FLIGHT AT A TIME (§3.8) - but that rule is about WORKFLOWS, NOT AGENTS.
It says in as many words: "a stage may fan out to as many agents as the lane needs." §2
routes L0 to Opus at UNLIMITED agents and §3.3 gives a heavy lane 3-5 lenses. Last session
under-fanned by reading a batch count out of a MANIFEST instead of judging it. The fan-outs
above are already widened and committed - DO NOT narrow them back.

THE BAR - §0 is absolute: EVERY CRITIC IS AN ARTIFACT CRITIC. This game is DEAD; no agent
has ever seen it run, so a verdict must cite a frame under reference/frames/, a row under
reference/extracted/ or reference/decompiled/, a byte-check in the suite, a ledger number
carrying its own frame cite, or my own logged LOOK. A verdict citing memory, another
agent's summary, or "it looks right" is VOID. Crop and upscale before grading any frame.
When a measurement doc and a frame disagree, THE FRAME WINS - say so out loud. An UNJUDGED
claim is a LEAD, not a finding: it may NOT enter the ledger.

AND THE ONE THIS LANE ADDED: a finding can be perfectly TRUE and still not overturn the
sentence it names. 66 claimed overturns have been rejected on exactly that. Keep
overturn_upheld separate from refuted, and never let a true-but-wrong-target finding
delete a ledger line.

FAIL CLOSED (bugs already fixed - do not reintroduce): zero live critics means UNJUDGED,
never confirmed; a VOID verdict is not judgement; a round where agents DIED is not a round
that found nothing, so it may not count toward convergence; and a slice only ONE verifier
read is not a verified slice. Return a loud INTEGRITY string naming every dead agent.

SURVIVE THE WALL: eleven walls, zero data lost. Agents write STRUCTURED JSON to disk
BEFORE their prose and before returning - last session that recovered 11 critics and 50
verdicts from a run that was still in flight when I called time. Copy the journal into the
repo and extract the moment a stage lands (checkpointL0.sh does all six steps in order);
COMMIT at every checkpoint; keep SALVAGE.md current. Never edit a live workflow script
mid-run - and before launching ANY workflow script you edited, run
  node scripts/gauntlet/wfcheck.mjs <script> run
which compiles it the way the runtime does AND executes it against stubs on both branches.
`node --check` REJECTS every workflow script in this repo and is not a usable signal.

WHAT NOT TO BREAK: §4's no-touch list. Sim.ts and the duel-baseline move only in L5 - C4
is a LEDGER correction and does not license touching them. Floors go UP or stay. core/
keeps zero numeric literals. Scenes stay render-only. The "web SWF is 24 fps" finding does
not license touching OG_ANIMS' 15 fps latch, which is L6.

KNOWN DEFECT, deliberately unfixed: citeLint has a FALSE NEGATIVE (it flagged a byte-exact
quote as QUOTE_UNVERIFIED). It fails SAFE and no gate reads that status - L0-A fails on
BROKEN. Fix it AFTER L0 closes; changing a gate input mid-drive is what §3.6 warns against.

FIRST, DO THIS: confirm the baseline (git log -1 + npm test -> 63 files / 1001), do the two
"do first" items above, paste the current gateL0.py output, report the judged-vs-leads
split from docs/gauntlet/L0/LEDGER_EVIDENCE.json, and show me the fan-out shape. Don't
spawn until I ok it.
'''
```

**Start command** (from the repo root):

```bash
cd "/Users/kheshav/kheshav-code/SSHD 1-1" && git log --oneline -1 && npm test 2>&1 | tail -5 \
  && python3 scripts/gauntlet/gateL0.py --root docs/gauntlet/L0 \
       --ledger docs/research/REBUILD_READINESS.md --out /tmp/gate.json
```

**Bar verdict: ✅ meets the "cannot be improved further" bar.** It leads with the two things
that are easy to get wrong and expensive to get wrong (re-salvage before rebuilding the
index; judging is over by ruling) rather than burying them in a task list. It front-loads
every banked number so nothing is re-derived. It carries §0's law, the overturn rule, four
fail-closed accounting rules including the new two-verifier one, and — new this session —
the correction to how §3.8 was being read, with the explicit instruction not to narrow the
fan-outs back. It names the exact scripts, args and the `wfcheck` pre-flight whose absence
already shipped a bug into a live wave. It states the dry-loop convergence risk before it
is hit, with "take a ruling" rather than "soften the gate". It marks the two GAUNTLET.md
corrections VERIFIED first-hand rather than inherited, and it discloses a known tooling
defect instead of leaving it to be rediscovered. The next change would be churn.

### Two owner decisions queued (neither blocks the next session)

1. **L7 / audio.** CLAUDE.md fixes the stack as *"WebAudio-synthesized SFX only"*. We now
   hold the real 13 stems and every SFX. That does not change what ships — but it changes
   whether L7 means *synthesize to a written spec* or *synthesize to match a file you can
   A/B against*. **Recommendation: the second.**
2. **§3.8 campaign scope.** *"Ep4–12 were likely never shipped; faithful campaign =
   Prologue–Ep3."* Bespoke splash art for all 13 episodes IS in the binary, and the 16
   `image_*` symbols map one-for-one onto shipped quest rows. **Recommendation: withdraw
   the cut.** It widens L1.


## 🔁 THE GAUNTLET — the standing engine (adopted 2026-08-13)

**`docs/GAUNTLET.md`** is now the method every session runs: a self-re-arming
gauntlet-loop over **all 12 systems**, one **lane** per run, each lane binary-gated
and crash-survivable. Session kickoffs still own *current state*; the gauntlet owns
*how the work is done*. Its §5 is the paste-ready prompt.

**Two things from it that change what the next session should do:**

1. **§0 — every critic is an ARTIFACT critic.** This game is dead (P0, definitive):
   no agent has ever seen it run, so "compare it to the real game" MUST mean a frame
   under `reference/frames/`, a row under `reference/extracted/`, a byte-check, a
   ledger number carrying its own frame cite, or Kheshav's logged LOOK. A verdict
   citing memory is VOID. This is the SESSION 18 A4-D failure, made structural.
2. **§1 — the payload holds what the ledger calls unrecoverable.** `reference/extracted/`
   has the **complete campaign** — 61 quests, **Prologue→Ep12→Epilogue→Season 2**,
   **3,307 verbatim dialogue lines**, 471 choices, cutscene direction — plus **75
   skills × 182 rows with exact chi + cooldown**, **495 NPCs**, **982 items**.
   `grep` finds ZERO references to any of it in `src/`/`tests/`/`scripts/`, while
   `src/config/skills.ts` ships 3 skills with 2 of 3 cooldowns hand-INFERRED.
   **Lane L0 (re-survey) runs before any other lane.**
3. **§2.1 — the string-table blocker.** Character dialogue is plain verbatim text
   (owner-confirmed for `src/`, R1). But item/skill **names and descriptions are
   numeric IDs** (`<name>4058</name>`) indexing a table nobody has located —
   `ui_strings.txt` is NOT it. **L1b hunts it; L2/L3 can port every number and no
   name until it lands.** Free win from the same pass: `ui_strings.txt` embeds
   `<font face="Edo SZ">` — that closes the "font unidentified" art-anim blocker.

**Model for the next session: Opus 5 @ `xhigh`** (ruling R6 — L0 is judgement-dense
and small; Fable's turn comes at L7/L9/L11). **Scale: Opus unlimited, Fable bounded
12–16** (R5) — but read §2's *"a script beats a swarm"* rule first: the row-ports
(982 items, 495 NPCs, 75 skills) are generator scripts, **not** fan-outs.

---

> ## ▶ SESSION 23 CLOSED IN FULL — THE REAL FIGHTER IS IN THE DUEL, MIRRORED, AND MOVING.
> **57 files / 894 tests green** · tsc ×2 → 0 · eslint → 0 · fidelity **55/55,
> now AUTONOMOUS** (`?fidelity=auto` + a self-opened BRAVE window +
> localStorage verdict) · clean clone green (879 pass / 15 skipIf without
> `reference/`) · floors tracing ≥ 0.9005 · held-out ≥ 0.8490 (spent, UP only) ·
> height ≤ 140.5 · `Sim.ts` + duel-baseline **byte-untouched all session**.
>
> **Commits:** `3bd5814` A11.1 drawSamurai out → `68cef9c` A11.2 compose-time
> mirror → `741fd31` A11.3 transcription (710 nodes CONTRACT) → `7ee71d1`
> A11.4 stepper → `0719673` distance-driven stride (owner-LOOK fix) →
> `4601761` wrap. Full milestone detail: `docs/sessions/-SESSION-LOG.md`
> "Session 23".
>
> - **A11-A..E all green, red-first, chaos-planted.** DuelScene renders both
>   combatants via `composePose → planPose → drawPlan`; mirroring is a
>   compose-time flag with ONE math site; walk + the balanced slash chain are
>   byte-checked transcriptions played by the pure `core/ogAnimPlayer.ts`
>   (15 fps latch, carry-forward, Flash matrix nodes ÷100 = `OG_MATRIX_UNITS`).
> - **OWNER LOOK verdicts (logged verbatim, 04:30):** foot-skating — FIXED
>   same-turn (distance-driven `strideMs`, measured `WALK.stridePx`, zero new
>   numbers); point-blank stroke runs instead of slashing + uncapped stroke
>   length — BOTH scheduled by name into SESSION 24 (gameplay: measured
>   numbers + the baseline's atomic re-record protocol).
> - **Tooling permanent:** `?fidelity=auto` (DEV-only) — the gate runs itself
>   in a fresh visible window; the intro devHold race was ROOT-CAUSED and
>   fixed in `DuelIntro.create()` (re-applies a pre-recorded hold).
> - **Still open (owner):** kasa height trade · gi revisit · partb loop hold
>   during the strike (measured duration lands in A12.1).

---

> ## ▶ SESSION 22 CLOSED IN FULL — ALL SEVEN GARMENTS IN THE OG GRAMMAR, GI LANDED BY OWNER RULING.
> **52 files / 855 tests green** (was 49/827) · tsc ×2 → 0 · eslint → 0 ·
> fidelity **55/55** · clean clone green · 0 app console errors ·
> **tracing 0.900547 (floor 0.9005) · held-out 0.849033 (floor RE-BASED 0.8618 → 0.8490
> by the owner's ruling 2026-07-28, cited in tests/a6Score.test.ts — the one
> sanctioned down-move, spent; UP only from here) · height 140.48 (≤140.5).**
> **A9.4 by ruling** ("not perfect, but i will accept it for now"): balloon cut,
> GATE A9-E green red-first (hem-overhang 3.50 → 0.40 local px), LEGACY and the
> A8 ratchet table now EMPTY — every exit by re-authoring or ruling, never by a
> raised number. Commit `ed25c20`.
>
> **Commits:** `f7e3801` targets → `354891a` A9.1 grammar gate → `dc9bea6` A9.2
> collar+sleeve → `bd994ba` A9.3+A9.5 kasa/hakama/obi (fan-out) → `2112b84`
> A9.6 branch. Ledger: `docs/DIVERGENCES.md` "SESSION 22 — …" (five entries).
>
> - **GATE A9-A/B/C/D:** six of seven garments re-authored in the OG grammar —
>   every ink share ≤ 61.4 % (the OG's own worst; was 75.9/70.6 on the owner's
>   two), every tone within 12 of its committed p25/p75 target (five byte-exact
>   0), collar base = the SWF's own `#dcd9d4`, hakama MEASURED_FLAT `#dcd9d4`.
> - **GATE A9-F:** the branch is on screen at rotation 38 — the measured mirror
>   of the recorded 142 (`142 = 180 − 38` CONFIRMED, source axis +39.9°±2,
>   residual 0.6°). ⭐ The mirror flips the POSITION too (x sign) — found by
>   LOOKING, fixed by bbox-fraction measurement + floor-bounded sweep.
> - ✅ **The gi ruling** — RESOLVED (see header above); the cause story stays
>   in the A9.3+A9.5 and A9.4 ledger entries.
> - **Still open (owner):** the kasa height trade (SESSION 21 §P6, unchanged).
> - **Tools built:** `reauthorGarment.py` (grammar re-authoring, D4 SWF
>   preference, measured shadows) · `grammar.ts`/`inkShareLib.ts` (the paint
>   ruler in the suite) · `OG_EQUIPMENT`/`OG_DRESSED_NODES` (equipment facings
>   without touching the byte-checked pose) · traceGarment clobber guard.
> - **Process finds (ledgered):** the no-game-imports guard improved A9.1's
>   design; a coordinate-space misread nearly condemned a valid gate (control-
>   frame check caught it); parallel agents' whole-figure scores are
>   contaminated by siblings mid-flight — per-shape measures are not.

---

> **Fresh session and Kheshav said only "continue"?** Read this file top to
> bottom, then `docs/sessions/SESSION4_KICKOFF.md` (standing mandates), then
> `git log --oneline -10`. Trust those three over any older doc.
> Fidelity ledgers: `docs/TELLS_CHECKLIST.md` · `docs/CALIBRATION.md` ·
> `docs/DIVERGENCES.md` (adopted from iaido-duel mining, 2026-07-12).
> Navigable digest of ALL research: `docs/research/SHSD_MASTER_REFERENCE.md`
> (adopted 2026-07-17 — its header pins precedence: ledgers/config win).
> **Improvements research (full sweep, adversarially verified 2026-08-13):**
> `docs/research/IMPROVEMENTS_RESEARCH.md` — 92 items, each adjudicated
> against the ledger + invariants and attacked by an independent verifier
> (49 confirmed / 40 corrected / 3 killed); supersedes the 2026-08-05 batch
> (archived at `7b4a743`). Headline: a LIVE r="1" z-order defect for A12.3.
> Orientation map for a FRESH session/model: `docs/BUILD_PLAN.md`
> (adopted 2026-07-17 — snapshot, this file wins on state; its §2
> model-fallback advice is NOT policy).
> **Fidelity GATE (2026-07-16): `docs/research/fidelity/FIDELITY_GATE.md`**
> — measured OG assertions vs live canvas: `npm run dev` → console →
> `await __fidelity.run()` → must stay **55/55** PASS (v2 gate — 41 points
> + 14 edge scans; v1 was 17/17). HUD changes re-run it.

## Awaiting human/browser verification
1. ✅ ~~THE GI RULING~~ — RESOLVED 2026-07-28: owner accepted ("not perfect,
   but i will accept it for now, will change later, in another session");
   landed as `ed25c20`. Any later gi change is a fresh owner ask.
2. **The kasa height trade** (SESSION 21 §P6) — measured, open, unchanged.
3. **Look at the moving duel next session** (§5 item 9 of the S23 kickoff) —
   band_B also changed when the gi landed; a fresh look is queued there.

## Historical record — moved out on 2026-07-27

The **Current focus**, **State**, **Next concrete step** and **Stage-2 milestone
history** blocks were moved VERBATIM to `docs/sessions/-SESSION-LOG.md`. All four
were past-tense records of closed work (the source dive, Stage 2/3 milestones, the
SESSION 11 study pass) already held permanently in `docs/DIVERGENCES.md`.

**Nothing live was moved.** The sections below — open decisions, what not to break,
stage landmines, backlog — are still current and stay here.

## Open decisions awaiting Kheshav (each with proposed default)
1. **CRIT_MULT 1.3** (was spec 3) — default keep; Stage 2 "crit 3×" gate items
   read "crit ×CRIT_MULT". Veto = revert combat.ts + config-values.test.ts.
2. **MAX_DAN_RANK 10** (Stage 3) — default 10. LANDED M1 as the rebirth
   ceiling (`progression.ts`); still owner-vetoable → revert to 5 = edit
   economy.ts + config-values.test.ts + the DIVERGENCES entry.
3. **Rebirth = elemental +10, stacking** (Stage 3) — default elemental.
   LANDED M1 (field renamed `elementalPointsPerRebirth`; flat +10, NOT the
   research 10th-rebirth +20 nuance). Veto = restore attack semantics / add
   `tenthElemental` (see DIVERGENCES).
4. ~~ESLint~~ DONE (Stage 1). Veto = delete eslint.config.mjs, empty LINT_CMD.
5. **new-project.sh invalid JSON** — installer fix still outside this repo.
6. **Phaser 4 exists** — stay pinned 3.90.0 permanently (default).
7. **Branch `master`** — default keep.
8. **Dev-only `window.__game` seam** (main.ts, DEV-guarded, stripped from prod)
   — default keep for automated verification. Veto = delete the if-block.
9. **Gesture thresholds INFERRED** (`GESTURE_DIAG_DEG=45`,
   `LAUNCH_FLICK_MAX_LEN=90`; length proxies flick speed — no per-point
   timestamps). Default: keep, revisit at Stage 2 feel pass.

## What not to break
- Root `CLAUDE.md` invariants: RECREATE-NEVER-RIP (drawings/dialogue always
  original; palette now near-OG per owner veto 2026-07-12) · core/
  zero-literals · dependency direction · render-only scenes · binary stage
  gates. Folder rules: `src/{core,config,game}/CLAUDE.md`.
- `tests/fixtures/scan-probe/` is load-bearing (scanner regression fixtures).
- The game-import guard + purity gate are chaos-proven — keep them fail-closed.

## Stage landmines from research (apply at the noted stage)
- **Stage 2**: `HEAVY_DEF_PENALTY` (defense ×0.8) vs `damageTakenMult 1.25` —
  apply ONE, never both. Stance is HARD-LOCKED in combat in v0.717 PvE
  (SYNTHESIS §6.1) — implement out-of-combat switch as CONTRACT + Focus-gated
  in-combat variant as INFERRED. Spawn invuln has a confirmed blink indicator.
  `critical.ts`: two meters (Focus = stance switch, Critical = crits). PvE
  trash resolves 3–10 s — DUEL_TARGET_SECONDS {20,60} is a boss/PvP number.
  Combo counter resets to 1 (not 0) per kill; breaks on damage taken/chain gap.
  NaN-guard Sim.advance inputs (audit refuted Stage-1 scope, binds Stage 2).
- **Stage 4/5**: four joinable Great Clans (+ Aoi Hoiru, Ki Sensu); Shira
  Tancho story-only. War Room: 75 deploy, 500 per-structure donation,
  flag 120%. HAS_CASH_PURCHASE=false is a deliberate deviation.

## Spark / backlog (noticed, not acted on — why later)
- game/ config-purity ratchet baseline (per-file value multiset) — Stage 2
  item 15; DuelScene literals are tolerated until then.
- ~~DuelScene fixed-step accumulator / inline 250~~ DONE IN FULL — verified
  2026-08-13: `MAX_FRAME_MS = 250` lives in `src/config/combat-sim.ts` and
  `Sim.advance` clamps with it; no inline 250 remains anywhere.
- Phaser bundle 1.2 MB → code-split at Stage 6 (vite@8 Rolldown API verified
  + working snippet: `IMPROVEMENTS_RESEARCH.md` §vite-build; optional now-fix
  for the cosmetic warning: `chunkSizeWarningLimit: 1500`).
- `@types/node` 26 vs Node 25 — harmless; align when LTS catches up.
- Vite dev server may still be running in background task b1jaqmhl1.
