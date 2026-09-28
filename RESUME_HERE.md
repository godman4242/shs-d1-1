# RESUME HERE

## 📋 NEXT-SESSION KICKOFF (paste-ready) — L5-OPP slice 5a, THE GROUND STROKE

**Activate first:**

| | setting | status |
|---|---|---|
| surface | Claude Code CLI in this repo (it runs the gates; the web app cannot) | already on |
| model / effort | **Opus 5.5 at `high`**: a surgical port of ~495 mapped source lines | set with `/model` |
| `/fast` | ON if you watch it; OFF for the unattended build loop (2× price) | your call |
| context | a **fresh** session (`/clear`); the kickoff is self-contained | turn this on |
| MCP / skills | nothing extra | already on |

⚠️ Your Claude subscription ends **2026-10-09**. 5a and 5b fit well before then.

Copy everything BETWEEN the `'''` lines:

```
'''
Read RESUME_HERE.md, then docs/sessions/L5_OPPONENT_KICKOFF.md (ERRATUM 12 first, then its §3 harness rule and §4 gate), then docs/DIVERGENCES.md "L5-OPP SLICE 5 — THE MAP", and port slice 5a under the §4 gate.
Before any code: confirm the baseline at HEAD (92 files / 2081 tests, typecheck 0, lint 0, claimcheck 2135 cites / 600 values / 0 failures, chaos 211 pinned).
5a = the map's "THE CUT" row 5a, 472 Android / 495 web lines, web structure where the builds differ: MCSPlayer.update in full (web §1t99s0§.as:1179-1257); the web clip-end helper (§1t99s0§.as:305-1177) with ONLY the bands sheathe, ground _START, ground _END and pose -> sheathe ported, every other of its 146 labels going through ONE unported site that names the clip, and default returning false; startAction's wrapper + IDLE, RUN, WALK, SLASH, POSE; doAction's wrapper + IDLE, RUN, WALK, SLASH, POSE (web: POSE ends in a break, no fall-through). Every other state goes through one unported site per switch that names it.
Done = (a) all of that ported, every new number CONTRACT/INFERRED with both builds cited, red first for the stated reason; (b) the unported sites pinned at the new list (expected: clearInteractTarget, checkPlayerHit, EnemyPlayer.AI, cancelLogSub, the target's checkHitObject, and the three catch-alls; measure it, and write why the count rises for a dispatcher); the old 'MCSPlayer.startAction' pins in tests/mcsPlayer.test.ts moved to the sites the tests now reach; (c) the first end-to-end stroke through the real update, with checkPlayerHit AND the AI site spied (ERRATUM 12 item 3; the AI spy's call frames asserted, 1, 13, ...): for 3a's two fixture bodies, slashTarget's stroke from gotInput through SLASH, POSE and SHEATHESWORD to IDLE, the state, clip, position, facing and reload at every frame reproducing the source at ±0; (d) plants declared and the pin moved in scripts/gates/chaos.ts AND tests/chaosGate.test.ts; (e) RESUME_HERE rewritten and DIVERGENCES "L5-OPP SLICE 5a" written in the same commit, with 5b's kickoff at the top.
'''
```

**VERIFY (plain English):** before it writes any code, the session prints the baseline numbers
above; at the end, one test runs a whole enemy stroke frame by frame and it is green.

**Measured starting points (2026-09-29), so the session does not rediscover them:**
1. **The clip chain of one ground stroke** (the source): SLASH starts `X_START` → its end starts
   `X_MID` → `endSlash` → `startAction(POSE)` starts `X_END` → its end starts `X_POSE` → its end
   starts `SHEATHESWORD` (still POSE) → its end calls `startAction(IDLE)`. All inside 5a.
2. **The ground stroke never falls:** 4c's `slashTarget` strokes end 48–50 px up, under the 100
   threshold, so FALL (5b) is never reached. A `JUMP`/`UP`/`DROP` stroke would reach 5b's
   clip ends and throw through the catch-all.
3. **`chargingFx` stays `null` in 5a** (only the DASH / BULLCHARGE / CHICHARGE / CHARGING paths
   write it), and `speechCounter` starts at −1 (`MCSPlayer.as:103`), so neither the FX removal
   nor the speech clear runs on this path.
4. **The AI fires on frame 1** (`aiCounterMax` 12, `EnemyPlayer.as:52`; `aiCounter` 0).

**Bar self-report:** reached for the entry. Every span and count above was measured this cycle
by script, with the decode check probed red. The one open number is the final unported count,
and the kickoff tells the session to measure it rather than trust the expected list.

---

## ✅ LAST CYCLE (2026-09-29, build loop) — L5-OPP slice 5, THE MAP (no code)

| | verdict | measured |
|---|---|---|
| **the map** | ✅ all three switches, both builds | `update` 931 → web 79 + ONE helper, `§1t4448s0§` (the 853-line clip-end switch, 873 web); `startAction` 34 labels / 33 groups; `doAction` 27 / 23; the clip-end switch 146 / 97. Every group paired, line-spanned in both builds, shape-compared. |
| **the decode** | ✅ 571 line pairs | every static constant decoded by value in its own build: 7 mismatches, all in `JUTSU_GROUND_PARTA` (out of 5a/5b); **0 of 264 inside 5a/5b**. Probed: an off-by-one pairing gives 16/16 mismatches, so the check can go red. |
| **the kickoff's 5a** | ❌ over the cap, so **stopped after (a)**, as its rule says | 651 Android / 677 web > 500. |
| **the re-cut** | ✅ ERRATUM 12 | **5a the ground stroke 472 / 495** · **5b the air and the downstab 179 / 182**. |
| **found** | ⚠️ 3 | ERRATUM 11 missed the big helper; the AI runs inside `update` (frame 1, then every 12th), so (c) needs the AI spied too; Android's `doAction` POSE falls through into BULLCHARGE, the web's has a `break` (web wins). |
| **review** | ✅ my own hostile pass (docs only) | re-read every span against the source: two of mine were wrong and fixed (15 length-differing groups, not 16; the web POSE attacker is `:2184`, not `:2185`). |

### THE GATES, AS THEY STAND — measured at this commit

```
$ npx vitest run            ->  Test Files 92 passed (92) · Tests 2081 passed (2081)   (unchanged: no code)
$ npm run -s typecheck      ->  exit 0          $ npm run -s lint  ->  exit 0
$ npm run claimcheck        ->  2135 cites · 600 values at ±0 · 44 context · 0 failures
$ npm run instructionpaths  ->  every path resolves
$ npm run chaos             ->  211 plants pinned, unchanged (no new guard; the full run is the shell's post-ship step)
```
(The `SYNTAX FAIL` / `RUN FAIL` lines in the vitest output are `tests/workflowScripts.test.ts`
feeding broken scripts to `wfcheck.mjs` on purpose. They print on the baseline too.)

### WHAT CHANGED

- `docs/sessions/L5_OPPONENT_KICKOFF.md`: ERRATUM 12; §3's slice-5 row.
- `docs/DIVERGENCES.md`: "L5-OPP SLICE 5 — THE MAP" (the `update` block map, the clip-end bands,
  both state tables, every `controlledBy` branch, the cut).
- No source, test or config change.

### ⚠️ STILL OPEN — Awaiting human/browser verification, and queued

- **Your LOOK at `?npc=katana`** (the windup aura, in "THE UNITS AND THE WINDUP" below) is still
  unanswered.
- **Your ruling, when you want it: the Sim player's heavy launch.** The source's duellist launches
  in heavy at mastery 3; the Sim's player unlocks it at 5 (INFERRED). Keep 5, or move to 3?
  Evidence: DIVERGENCES "L5-OPP SLICE 3a", "ERRATUM 2 ITEM 4".
- **Your ruling, when you want it: does R6 (web wins) reach the L4b mobs?** The web
  `NPC.isAirborne` also counts the FALL state (`§1t68s0§.as:793-796`); the ported `Npc` (base of
  all 20 mobs) has Android's height-only test. **The duellist is decided** (4b: an `MCSPlayer`
  override, web). "Yes" moves the override into `Npc` and deletes it from `MCSPlayer`.
  Evidence: DIVERGENCES "L5-OPP SLICE 3b", "4b".
- **The `UNMEASURED` merge** from 1b-i (DIVERGENCES "L5-OPP SLICE 1b-i"). Closing it needs a 5-line
  SWF run in Ruffle, or a forum report of an item's HP jumping to hundreds.
- **QUEUED (the body): `MCSActor.setPosition` / `movePositionX` never truncate,** where AS3's
  take `int` parameters, so `posX` can go fractional. 4a truncates at its own read
  (`getMapPosition()` is `:int`); a fix at the actor would touch all 20 mobs. Its own milestone.
- **QUEUED (slice 6): the duellist's HP.** The `MCSPlayer` constructor never calls `setHP`, so the
  body sits at the actor default 1, not the profile's HP. Nothing reads it before reception.
- **QUEUED (slice 6): the attacker on the mobs' packets.** The web self-hit guard
  (`§1t99s0§.as:3357`) reads `damage.attacker`; the ported mobs never set it (`null`).
- **QUEUED (slice 8): the seam** must carry the player's facing (`PlayerProxy.isFacingRight`
  throws until then), implement `checkPlayerHit(slashArray, offset, damage)`, and draw the `smoke`
  and `enemyLine` events.
- **QUEUED (harness): claimcheck reads no bare array.** Five arrays in `ogDuellistProfile.ts`
  (`[14, 18]`, `[2213, 2214]`, `[11]`, `[0, 3]`, `[103, 106]`) and any in other config files are
  unchecked. Fix = teach `numericFields` (`scripts/gates/claimcheckLib.ts`) to read array elements,
  then triage whatever it raises. Its own milestone.
- **QUEUED (harness): claimcheck cannot check a function-start cite** (a cite whose line holds
  no value). It bit again in 4b (a range cite 2 lines early). A cheap gate: a cite in a doc
  comment directly above a TS method must land on a line holding `function`. Its own milestone.
- **QUEUED (the body, harmless today): `asInt` returns −0** for a small negative (`Math.trunc(-0.3)`);
  an AS3 `int` has no −0. Nothing divides by or `atan2`s a velocity yet, but a test's `toEqual(0)`
  fails on it. Fix = `Math.trunc(n) || 0` in `asInt`, which touches every mob: its own milestone.
- **For slice 8 (R1's veto):** a video-measured duellist (level + gear off a Duel Mode frame) may
  beat the new character for OPP-G. Look before slice 8 ships.
- L4b's 13 remaining mobs are unblocked but not ported: L5-OPP first, by decision.

---

## PREVIOUS CYCLE (2026-09-29) — L5-OPP slice 4c, THE SLASH END (slice 4 closed)

`doSlash`, `endSlash`, `endDownStab`, `deductReloadBar`; one function differs between the builds
(`endSlash`: the web's attacker on `NpcDamage`, ported, and a timer block, ruled out). Full record:
`docs/DIVERGENCES.md`, "L5-OPP SLICE 4c".

---

## PREVIOUS CYCLE (2026-09-29) — L5-OPP slice 4b, THE SLASH START

`initSlash`, `checkNextSlash`, `startSlash`, `cancelStealth` (a `smoke` event) and a web
`isAirborne` override on the duellist only; one difference between the builds (the downstab's
side test: web `posX`, Android `mcs.x`). Full record: `docs/DIVERGENCES.md`, "L5-OPP SLICE 4b".

---

## PREVIOUS CYCLE (2026-09-29) — L5-OPP slice 4a, THE STROKE MAKERS

`EnemyPlayer.gotInput` (the routing), `getTargetPosition`, `lineArrayDeepCopy`, the six makers and
`makeSlash`, identical in both builds. `NpcTarget` gained `isFacingRight()` (the seam's proxy
throws it until slice 8). Full record: `docs/DIVERGENCES.md`, "L5-OPP SLICE 4a".

---

## PREVIOUS CYCLE (2026-09-29) — L5-OPP slice 3b, THE MOVEMENT

`initMove` / `movement` / `movePlayer` / `moveTo` on 3a's class; web won `initMove` (measure
`int(posX - dest.x)`, then set `destX`). Found the opponent's `gotInput` is `EnemyPlayer`'s and
split slice 4 into 4a / 4b / 4c (ERRATUM 8). Full record: `docs/DIVERGENCES.md`, "L5-OPP SLICE 3b".

---

## PREVIOUS CYCLE (2026-09-29) — L5-OPP slice 3a, THE STANCE

`src/core/npc/MCSPlayer.ts` **new**: `class MCSPlayer extends Npc` with `canChangeStance`,
`setStance`, `getStance`, `initSpecialSkills` (AI branch), `stopMoving`, `getDamage`,
`getBaseDamage`; web won five rulings; `nextStance`, `walkTo`, `faceScreenCenter` ruled out of
the lane by caller. Closed claimcheck's fourth false-pass hole (the digits inside `§…§` web
names). Full record: `docs/DIVERGENCES.md`, "L5-OPP SLICE 3a".

---

## PREVIOUS CYCLE (2026-09-29) — L5-OPP slice 2, THE PROFILE SOURCE (R1)

`src/core/npc/duellistWriter.ts`: the three profile writers + `Item.toStringNoQty` (web: 18-field
battle string, `^` checksum, the creator comma) and `newPlayerState()` = `initNewPlayer`. R1
ruled: the Sim's duellist is the new character until the human carries `StatsManager`'s fields,
then the mirror. Found claimcheck's bare-array blind spot. Full record: `docs/DIVERGENCES.md`,
"L5-OPP SLICE 2".

---

## PREVIOUS CYCLE (2026-09-29) — L5-OPP slice 1b-ii, THE BODY'S STATS

`src/core/npc/duellistBody.ts`: `initDuellistBody` = `EnemyPlayer.init` + `MCSPlayer.initPlayer/
initAttackStats/initElementDefenseStats` on 1b-i's record, AI path only. OPP-B holds for three
fixtures; the skill cooldown table went to slice 7. Web won three (the level scaling, `maxreload`
8 s, the `stance` argument). Full record: `docs/DIVERGENCES.md`, "L5-OPP SLICE 1b-ii".

---

## PREVIOUS CYCLE (2026-09-28) — L5-OPP slice 1b-i, THE DERIVED STATS

`src/core/npc/duellistStats.ts`: `deriveDuellist` = `initDuelist`'s fight numbers,
`findBonusStat` = `findBonusStatFrom` with the web `Item.getModifiers` (the HP pool). Three
rulings (the web sum, the web buffs with an injected clock, the halving test not ported); one path
refused as `UNMEASURED`. Full record: `docs/DIVERGENCES.md`, "L5-OPP SLICE 1b-i".

---

## PREVIOUS CYCLE (2026-09-28) — L5-OPP slice 1a, THE PROFILE STRINGS

`src/core/npc/duellistProfile.ts` parses a duellist's `stats` / `eq` / `skills` strings as
`XMLNpc` and `Item.parseNoQty` do; four web-only behaviours shipped under R6 (the battle-string
guard, no modifier clamp, the skill-id floor, the `^` cut). Claimcheck checks a full-path web
cite at ±0 unchanged. Full record: `docs/DIVERGENCES.md`, "L5-OPP SLICE 1a".

---

## PREVIOUS SESSION (2026-09-23) — L5-OPP survey, kickoff and slice 0 (the animList)

Duel Mode's opponent is `EnemyPlayer` on every path (never a roster row); the kickoff is
`docs/sessions/L5_OPPONENT_KICKOFF.md` (9 slices, rulings R1–R6). Slice 0 closed finding 19:
the source loads 18 animation files into one `animList` and the transcriber read 1
(158 → 466 clips, the `AnimData` holds included; the katana's attack is 750 ms, not 417). A
4-reviewer gauntlet found the holds, the "ten, not seven" frozen classes, and the web/Android
number split that became R6. Full record: `docs/DIVERGENCES.md`, "L5-OPP SLICE 0 — THE
ANIMLIST" and "THE GAUNTLET REVIEW".

---

## PREVIOUS SESSION (2026-09-23) — THE UNITS AND THE WINDUP (`UNITS_AND_WINDUP_KICKOFF.md`, now carrying an ERRATUM)

| | verdict | measured |
|---|---|---|
| **15** units | ⛔ **FALSIFIED — not a defect** | the original scales its whole `GameStage` and parents every NPC inside it (`GameStage.as:1246`, `NPCManager.as:95`, `MCSActor.as:1029`), so the actor's `100` is logical px = **world px**. Commit gap **95.41 px before and after** — correct. The kickoff's "convert at the seam" would have moved it to ~83. |
| **18** windup | ✅ **CLOSED** | **1 → 35 telegraphs for 35 swings**, each 416.67 ms. `NpcController` listens on `startAction(ATTACK)` — NOT the kickoff's "clip restart", which cannot see 10 of 13 classes and fires on a looping walk. |
| the statue | **not a defect** | the source's own behaviour against a still player: backed off to 101.66 px, the katana walks 4.7 px, re-closes to 96.94 and swings again. |
| **19** | 🆕 **added** | see above. |

Every number, the source evidence and the gates: `docs/DIVERGENCES.md`, "THE UNITS AND THE WINDUP".
Still open and NOT slice 4: **16** (the actor never learns it was hit) and **17** (it never dies) —
both move `OpponentView`, so both are L5's call.

### THE GATES, AS THEY STAND — measured at this commit

```
$ npx vitest run            ->  Test Files 86 passed (86) · Tests 1673 passed (1673)   (1664 + 9)
$ npm run -s typecheck      ->  exit 0          $ npm run -s lint  ->  exit 0
$ npm run claimcheck        ->  1716 cites · 421 values at ±0 · 44 context · 0 failures
$ npm run instructionpaths  ->  38 path tokens, all resolve
$ npm run chaos             ->  49/49 plants RED · 49/49 restored byte-identical · exit 0 · ~35 s   (slice gate, NOT pre-commit)
```
(The `SYNTAX FAIL` / `RUN FAIL` lines in the vitest output are `tests/workflowScripts.test.ts`
feeding broken scripts to `wfcheck.mjs` on purpose — they print on the baseline too.)

### WHAT CHANGED

- `src/core/npc/NpcController.ts` — the telegraph is the actor's decision to attack. The ONLY
  source change; `Sim.ts`, `OpponentController.ts` and every `src/config/og*.ts` value untouched.
- `tests/duelSeam.test.ts` — 15 rewritten as a units band, 18 as telegraphs = swings, plus the
  loop-wrap test and the statue test. `tests/npcController.test.ts` — the bypass scan.
- `tests/duelSeam.plants.ts` — **6 new chaos plants** (43 → 49, pinned in `scripts/gates/chaos.ts`
  AND `tests/chaosGate.test.ts`); two are the kickoff's own two wrong fixes.
- `duelSeam.ts` and `config/duel.ts` comments — a units warning where the wrong fix would go, and a
  header that still said the spawns were canvas px (stale since SESSION13 D1).

`?npc=katana` still defaults **OFF**; `AISeamController` remains the shipped opponent.

### ⚠️ THE ONE THING ONLY KHESHAV CAN DO

`npm run dev`, then open **`http://localhost:5173/?npc=katana`**. **Expect:** the red windup
aura now stays on **continuously** while it swings in place — measured (re-measured with the
holds), a telegraph every 750 ms and each aura lasts 750 ms, so there is no gap (before: one
flash, then nothing). While you
stand still it stands and swings (the original's behaviour); walk away and it follows. **Your
call:** is a steady glow acceptable, or do you want a visible beat per swing? (Cheapest beat:
phase the aura's pulse from each telegraph — `docs/DIVERGENCES.md`, "WHAT 18'S FIX LOOKS LIKE".)

---

## PREVIOUS SESSION (38) — the JClaw lane, closed

### THE FOUR DEFECTS THAT WERE ACTUALLY IN OUR TREE

1. **CI had been red for 24 days and nobody knew** — six consecutive push failures since
   2026-08-24. Cause: `describe.skipIf(cond)` skips the TESTS but still EXECUTES the block
   body, so six `og*` suites read gitignored `reference/` at collection time and threw ENOENT
   on every fresh checkout. **A gate that is always red carries no information** — a real
   regression would have been the seventh red and indistinguishable. Fixed (commit 5367599).
   Verified against a faithful stand-in — `git clone --no-hardlinks .`, NOT `git archive`, which
   has no `.git` and reports phantom failures for any test that shells out to git:
   **`1588 passed | 55 skipped (1643)`, 0 failed.**
2. **`CLAUDE.md:67` named `.claude/ship-bar.md`**, deleted by 995bb52 on 2026-09-08 — false for
   nine days in the file every session loads. Now gated by `npm run instructionpaths`.
3. **`tests/chaosGate.test.ts` read the chaos runner's plant count out of a COMMENT.** Proved on
   the real file: the old unanchored regex returns 43 from a stale `//` line above a computed
   live value, and passes.
4. **`.githooks/pre-commit` could print no test totals and still commit.** Now asserts them.

### WHAT THE REFUTERS CHANGED — read this before trusting any future "we lack X"

Every JClaw quote checked out. **All the errors were on our side**, and three were in proposals
already written and about to ship broken: a `$HOME` fallback that would have made the new gate
GREEN over its own founding defect; an extractor that silently dropped `.githooks/pre-commit`;
and a `reference/` scan that would have been RED BY CONSTRUCTION on CI. The fit lens then cut
the gate from 6 files to 4 and from ten exemptions to **zero**. A lead I wrote as a gap —
"claimcheck's CONTEXT list is unpinned" — was refuted by reading the source: it is pinned
harder than JClaw's frozen store.

### THE A/B RULING — ONE LOOP READS THE REPO, THE FAN-OUT JUDGES SMALL INPUTS

| | round 1 · Fable fan-out | round 2 · Opus 5 `xhigh` loop |
|---|---|---|
| agents spawned / returned | 28 / 3 (**11%**) | **10 / 10 (100%)** |
| subagent tokens | 1,369,556 | **1,079,721** |
| wall time | 10.3 min, to the session limit | 23.1 min of fan-out, no wall |
| areas measured | 5 of 8 | **3 of 3 remaining** |
| lessons VERIFIED | **0** | **10 live verdicts** |
| tokens per verified lesson | **undefined — no denominator** | **107,972** |

**Ruled:** the loop wins, but not because fan-out is wrong — round 2 used a fan-out too. What
changed is WHAT the agents were given. Round 1 sent 8 agents to read a 250k-line foreign repo
and they re-read overlapping context until the session died. Round 2 had the loop do the repo
reading and handed each agent a small JSON brief plus an explicit file list. Per agent that
cost **2.2× more** (107,972 vs 48,913) — each one ran real experiments instead of dying — and
every one came back. **Standing rule, already in `~/.claude/CLAUDE.md`: a fan-out over a repo we
do not already know gets ≤6 agents with explicit file lists.** No code cap was added, on purpose:
the incident was 28 agents and any plausible constant sits above 28.

### WHAT IS STILL OPEN

- ~~**`master` is 3 commits ahead of `origin/master`.** Nothing is pushed.~~ Pushed since; CI green on every push through 2026-09-23. CI will run on push and
  should now be GREEN for the first time since 2026-08-24 — that is the verification.
- Slice 4 (`docs/sessions/L4B_KICKOFF.md`) — parked, by standing decision.
- Port `instructionPaths` to `~/kheshav-code/agent-harness` so all 7 sibling repos get it. Its
  scoped shape is exactly what ports; the file list is the only project-specific part.

## ▶ SESSION 37 (2026-09-14) — **THE HARNESS IS FINISHED: T1–T5 ALL CLOSED · ROLLED OUT GLOBALLY · NO LANE WORK · NEXT: write the slice 4 kickoff**

Sessions 36–37's thesis (`docs/sessions/HARNESS_KICKOFF.md`, `HARNESS_FINISH_KICKOFF.md`): every
defect this lane shipped came from **hard noticing, not hard reasoning** — a claim that looked
true and that nothing in the toolchain could check. A harness makes the un-noticed thing fail a
gate. The rules it earned, with evidence, are in **`docs/research/HARNESS.md`**.

**SCOPE CUTS, restated and held:** no lane work — slice 4 NOT started, `src/core/npc/` gained no
class, and F3's `src/core/npc` diff has **zero non-comment lines** · `Sim.ts`,
`OpponentController.ts` and the seam untouched — gate L4b-A **0 bytes** · `src/config/ogActor.ts`
CLOSED (transcriber re-run, no diff) · no new runtime dependency · ONE workflow in flight at a
time, never while this loop wrote files the agents read.

### THE GATES, AS THEY STAND — run these first

```
$ npx vitest run            ->  Test Files 83 passed (83) · Tests 1631 passed (1631)   (1629 at F6 + 2 chaosLib pins)
$ npm run -s typecheck      ->  exit 0          $ npm run -s lint  ->  exit 0
$ npm run claimcheck        ->  1716 cites · 421 values at ±0 · 44 context · 0 failures · ~0.2 s
$ npm run chaos             ->  43/43 plants RED · 43/43 restored byte-identical · ~32 s   (slice gate, NOT pre-commit)
$ git diff 42a62e2 -- src/core/Sim.ts tests/duel-baseline.test.ts src/core/OpponentController.ts | wc -c   ->  0
```

### THE FIVE TOOLS — all closed

| | tool | state |
|---|---|---|
| **T1** | `npm run chaos` + `tests/*.plants.ts` | ✅ 43 plants (40 → 43 this session; `EXPECTED_TOTAL` pinned in `scripts/gates/chaos.ts` AND `tests/chaosGate.test.ts`) |
| **T2** | `npm run claimcheck` | ✅ **RE-CLOSED** — it had false-passed; now per-cite at ±0 + bare consts (F1) |
| **T3** | `.claude/workflows/measure-verify.js` | ✅ a dead run returns `status: 'UNVERIFIED'`, `fatalCount: null` (F2) |
| **T4** | twin rule + `tests/configTwins.test.ts` | ✅ (session 36) |
| **T5** | `tests/utils/npcHarness.ts` — `seq` · `counting` · `parked` · `rollsFor` · `readsWhatYouWrote` | ✅ adopted by slice 3a/3b at the three historical trap sites (F4) |

### WHAT SESSION 37 DID — one line each; the story is in `docs/sessions/-SESSION-LOG.md`

| F | commit | outcome |
|---|---|---|
| F1 | `d733f88` | claimcheck's three false-pass holes closed (a bare `export const` was never a field · a value passed if ANY cite held it · ±1 passed off-by-ones). The fixed gate on the old tree raised **82**: 10 wrong line, 41 wrong file (prose), 5 wrong value, 26 context. **`EnemyKatana.as:213` was session 36's own defect.** |
| F1+ | `1637466` | a 12-agent read-only pass over the 172 WEAK (multi-value) cites: 2 right-literal-wrong-BRANCH cites (`EnemyBear.as:248`, `EnemyStag.as:307` are the chase, not the flee), 12 coincidences → CONTEXT, and `OG_BEAR.idle.walkOn` turned out unsupported |
| F2 | `a84d0d9` | T3 closed; `Workflow({ name: 'measure-verify' })` resolves from a fresh session (probed with a bogus name — launches nothing) |
| F3 | `f4e4ec2` · `2d9f705` | 68 refutations adjudicated; 534 cited commands re-executed under `sandbox-exec`, all MATCH; 74 committed sites corrected **from the source** (the deer is not the only non-re-targeter; `EnemyBear.ts` had its tick guard backwards; ANY levelled animal pays less XP); +2 tests, +3 plants. Ledger: `docs/research/runs/wf_99c74d25-624-LEDGER.md` |
| F4 | `efcdc27` | T5 closed; each preflight red-proven by re-planting session 35's broken setup |
| F5 | outside this repo | see below |
| F5+ | this commit | two latent `chaosLib.ts` holes found while porting it: a plant's `replace` was a String.replace pattern (`$&` inserted the anchor) and overlapping anchors counted once (`}\n}` in `}\n}\n}` read as unique). Both red-first; all 43 anchors still resolve exactly once |

### ⚠️ WHAT CLAIMCHECK STILL CANNOT SEE — measured, not hoped away (`docs/research/HARNESS.md`)

A literal gate cannot tell a coincidental literal from a real one: an UNLISTED context cite can
still vouch for a value, and a right-number-wrong-branch cite passes. The adversarial pass measured
that residual on this corpus at **14 of 172** multi-value cites, all now fixed or listed. A numeric
field on the line after a cited field, with no enclosing cite, is out of scope (uncited, not
passed). `src/core/npc/**` cites get the existence + range half only.

### 🌐 F5 — THE HARNESS, EVERYWHERE (outside this repo; all measured)

- **`~/.claude/CLAUDE.md` gained "Harness engineering"** — only rules not already in its graph
  section. Backup `~/.claude/CLAUDE.md.bak-20260914`. Cost **+2,052 b ≈ 513 tok/turn** (bytes ÷ 4,
  the method memory used), +7.7% on SSHD's recorded 6,700-token overhead. The memory index grew
  +980 b ≈ 245 tok (four new lessons, one corrected entry).
- **Global workflow `measure-refute`** — project-agnostic measure → adversarial refute, fail-closed.
  Canonical in the PUBLIC repo **`~/kheshav-code/agent-harness`** (github.com/godman4242/agent-harness —
  `agent-work-ethic` renamed; the old URL 301-redirects), `harness/workflows/`, symlinked as
  `~/.claude/workflows/measure-refute.js`. It moved there from the shipping kit (`3ae94c5` removes the
  kit copy) beside a vendorable, zero-dependency port of this repo's chaos runner as Level 6. A
  3-reviewer adversarial pass found 41 findings (11 major) BEFORE it went public — e.g. plain-string
  `units` returned VERIFIED with `fatalCount: 0`; all reproduced, pinned red-first, fixed;
  33 committed self-plants, 33/33 RED; 43 tests on Node 22/24/26. MEASURED from
  fresh headless sessions: user-level workflows register in every project, symlinks register AND
  execute, the registry is read at session start. Named `measure-refute`, not `measure-verify`,
  because same-name precedence between user and project levels is undocumented.
- **A `new-project.sh` throwaway project listed `measure-refute`** (then deleted) — no copy needed.
- **Per repo:** SSHD is the harness's origin (nothing new) · agent-harness holds the canonical
  workflow · the other five get the global section + workflow and NOTHING in-repo: none has a
  single `.as:N` cite for claimcheck, and a chaos runner with zero plants is an empty gate.
- ✅ **Ship-bar finding — FIXED, and my first report of it was WRONG.** `~/.claude/new-project.sh` now
  skips the project ship-bar when the global hook exists (`FORCE_PROJECT_SHIPBAR=1` adds one; backup
  `.bak-20260914`; 6-case matrix, exactly 1 injection each). Measuring it showed the project
  `settings.json` it used to write was **invalid JSON**, so those projects never loaded the hook and
  never double-injected — the claim was inferred from reading the script. Only the shipping kit
  double-injects, by design (its `.claude/` is the template for machines without the global hook).
- ⚠️ **This repo's chaos runner shares holes the agent-harness port closed** (measured by reading
  `scripts/gates/chaos.ts`): `execFileSync` blocks signals (Ctrl-C mid-run scores INCONCLUSIVE and
  carries on), no lock against overlapping runs, unknown flags ignored, only target files checked
  for drift. Low risk here — `npm run chaos` is manual and pre-commit only runs `chaosGate.test.ts` —
  so NOT ported this session. The overlapping-anchor count WAS fixed (see the table). Port the rest
  from `~/kheshav-code/agent-harness/harness/chaos/chaos.mjs` in the next harness session.

### THE LANE STATE — unchanged since session 35 (`abb484e`), and still in force

Slice 3 closed at **21 ported NPC classes / 23 `SHIPPED` entries**, 13 of 34 to go. The full
narrative is in `docs/DIVERGENCES.md` "L4b (slice 3a)" and "(slice 3b)" (findings 12–14) and
`docs/sessions/-SESSION-LOG.md` (2026-09-12).

### ⛔ WHAT A FUTURE SESSION MUST NOT "FIX"

- **The stag's constructor drops `doChase`**; **the boar red-freezes with a DEER clip**;
  **the alpha has no `!isDowned()` guard** and **no cutscene read at all**.
- **The bear's ATTACK faces with its own comparison**, not `faceTarget()` (they disagree at
  exactly equal x). **Only the bear ticks `idleCounter` outside IDLE** — and it is the bear's
  tick that is guarded `> 0`; the other three re-arm theirs at 24 on reaching `<= 0`.
- **The deer AND the horse never re-target** (no dead-target block, no `checkAITrigger`);
  the bear and the stag do both. (Corrected in F3 — it used to say "only the deer".)
- **Every levelled animal pays less XP than an unlevelled one** — the base `setLevel`
  (`NPC.as:252`) for the bear, deer and horse, the stag's hand copy for the stag.
- **All four animal `die()` bodies pay out in playback and under `dontGiveLoot`, play no sound,
  and roll nothing beyond `createLoot`** — pinned for all four in F3.
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
- **claimcheck's CONTEXT list (44)** — every entry was read against its cited line. Do not
  widen `DEFAULT_WINDOW` to make a run pass; a new correct contrast cite gets an entry with
  its reason.

### 📋 WHAT IS NEXT — slices 4–6, 13 descendants

`docs/sessions/L4B_KICKOFF.md`'s order: the goblins and ogre, ninja / shield / zombies, the
props (**`EnemyVegePatch` — TEN overrides and NEITHER `startAction` NOR `doAction`**,
already pinned in `tests/npcTree.test.ts`), then the bosses. **There is no slice 4 kickoff
yet** — write one the way `L4B_SLICE3_KICKOFF.md` was written (measure per file, never
carry a number forward) before starting.

**How a class ships (the harness is now part of it):** `src/core/npc/<Name>.ts` with `override`
on EXACTLY the AS3's set → numbers in `src/config/og<Name>.ts`, CONTRACT, line-cited, twins named
(and pinned or imported — `src/config/CLAUDE.md`) → add to `SHIPPED` in `tests/npcTree.test.ts` →
test FROM the AS3, red first, with `seq` / `counting` / the preflights from `tests/utils/npcHarness.ts`
→ declare a plant for EVERY guard in `tests/<slice>.plants.ts` and raise `EXPECTED_TOTAL` in both
places → `npm run claimcheck` and `npm run chaos` green → `Workflow({ name: 'measure-verify', args })`
over the slice, its findings adjudicated the F3 way (re-execute the commands, read the source) →
DIVERGENCES for anything the seam cannot express (number from **15**).

**Harness rules slice 3 added:** `init` enters IDLE TWICE (`reset()` then its own line), so
count TWO rng rolls before choosing a `seq`; a fresh wanderer has NO animation and
`idleCounter == 0`, but the ALPHA and the wolf are already snarling from their
constructors; `world({...})` spreads a COPY, so mutate `npc.world` to flip `adventureMode`
mid-test; a guard reading a value the SOURCE writes twice (per-direction speed) needs BOTH
branches driven or a plant sails through it; a roll that is gated by `isAdventureMode()`
changes the rng CALL COUNT per frame, so a room test and an overworld test need different
`seq`s; an actor parked in FALL on the ground LANDS on the first frame, masking whatever clip
you were testing; and **count the rolls with `rollsFor` rather than reasoning about them** —
the alpha's passing cutscene path draws FOUR (howl, walk, WALK's destX and speed), not two.

```bash
npx vitest run && npm run -s typecheck && npm run -s lint && npm run claimcheck
python3 scripts/payload/transcribeActorConsts.py && git diff --stat src/config/ogActor.ts   # must be EMPTY
```

### ⛔ NOT DONE, and said here rather than at a gate

Slices 4–6 (13 descendants). `EnemyPlayer` + `EnemyElite` + `EnemyPlayerGiant` +
`FriendlyElite` (they extend `MCSPlayer` — **L5**). `CutsceneActor` (**L1**). Rewiring
`AI_TIERS` (moves `Sim.ts` — **L5**). **No adapter builds an `NpcWorld`** — `playerStats`,
`adventureMode`, `peaceful`, `duelMode`, the kill-cam callback, `doChase` (finding 13) and
the `spawn` sink (finding 14) are all L5's to wire. The fight-feel grade (A1 cites + the
owner's LOOK). None attempted,
none claimed.



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
