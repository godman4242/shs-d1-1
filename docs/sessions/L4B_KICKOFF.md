# LANE L4b KICKOFF — THE ENEMY ACTORS

**Written 2026-09-09 at `42a62e2`. Model: Fable 5 @ `high` (`GAUNTLET.md` §2's routing —
from-scratch subsystem construction). Scale: SEQUENCED SLICES, *not* a wide fan-out —
and that is a deliberate amendment to §2, argued below.**

Paste the `text` block at the bottom as the first message of a fresh session.

---

## ⛔ CORRECTED BY THE SOURCE — slice 0, 2026-09-09 (the frame wins; said here, not buried)

Two numbers below were measured over the wrong set. The traps they illustrate stand;
the figures do not. Both are pinned in `tests/npcTree.test.ts`.

1. **The tree drawing shows `MCSPlayer.as` as a SIBLING ROOT. It is not.**
   `class MCSPlayer extends NPC` (`MCSPlayer.as:3`). The player is a descendant of the
   base this lane builds. The scope cut is unchanged — `EnemyPlayer`'s branch is still
   L5's — but L5 inherits `src/core/npc/Npc.ts` rather than building a second base.
2. **Trap 3's "31 distinct methods across the tree" is the 39-class figure.** Over the
   34 in-scope descendants the override vocabulary is **22**; the nine extra names
   (`AI` · `createLoot` · `getDamage` · `getSkillLevel` · `getTargetPosition` ·
   `gotDeathTouch` · `gotInput` · `gotNetworkDamage` · `rewardXP`) all belong to the
   `EnemyPlayer` branch. `EnemyVegePatch` 10 and `EnemyWolf2` 1 are correct as written.

**Slice 0 is closed** (`RESUME_HERE.md`, DIVERGENCES "L4b (slice 0)"). Slices 1–6 open.

---

## Why this lane, and why now

**L4a closed on 2026-09-08 (`6d78657`) and handed this lane its inputs.** The roster is
held — 495 NPCs with base stats, paperdolls, skills and loot (`OG_NPCS`) — and so is the
map from every `<ai>` value to the actor class the original constructs for it, with its
constructor arguments and its source line (`OG_AI_*`). What the repo still has is
**three hand-authored difficulty tiers** where the original has **one actor class per `ai`
value**. `AI_TIERS` maps to no OG value at all (DIVERGENCES, "SESSION 32").

It is also the last lane before the enemy side of the fight is real.

---

## THE TASK, in one line

**Build the original's NPC actor family — the shared base state machine plus its 34
descendants — behind the `OpponentController` seam that already exists, so that an `<ai>`
value selects a real behaviour instead of a difficulty tier.**

---

## ⚠️ READ THIS BEFORE PLANNING: THE LANE IS NOT THE SHAPE THE BOARD SAYS

`GAUNTLET.md` §2's L4 row said "**Fable** builds the AI" and §2 routes Fable's lanes to a
bounded 12–16 agent fan-out. **Measured first-hand 2026-09-09, that fan-out is the wrong
scale here, and the model routing is right.** Both claims are evidenced below.

### The 39 classes are TWO TREES, not one flat 34

```
NPC.as (1,238 lines)  <- THE BASE. 51 functions. Not itself in any dispatch.
  ├─ EnemyArcher (311)        └─ FriendlyArcher (86)
  ├─ EnemyCivilian (355)      ├─ EnemyCivilianFemale (200)   └─ EnemyCivilianOld (258)
  ├─ EnemySpearElite (584)    └─ FriendlySpearElite (60)
  ├─ EnemyWolf (489)          ├─ EnemyFox (240)              └─ EnemyWolf2 (103)
  ├─ EnemyBear (279) · EnemyBoar (364) · EnemyDeer (261) · EnemyGoblin (572)
  ├─ EnemyGoblinThrower (586) · EnemyHorse (269) · EnemyJiangSi (361)
  ├─ EnemyKanjiGuardian (478) · EnemyKatana (220) · EnemyKnife (247)
  ├─ EnemyNianMonster (521) · EnemyNinja (359) · EnemyOgre (386) · EnemyShield (417)
  ├─ EnemySorcererBoss (380) · EnemySpear (276) · EnemyStag (339)
  ├─ EnemyTrainingDummy (288) · EnemyVegePatch (164) · EnemyWolfAlpha (584)
  ├─ EnemyZombie (739) · RoomGoblin (306) · RoomOgre (336) · RoomZombie (324)
  └─ CutsceneActor (314)   <- named by createCutsceneActor, NOT by an ai dispatch

MCSPlayer.as (4,775 lines)  <- THE PLAYER CLASS. A DIFFERENT SUBSYSTEM.
  └─ EnemyPlayer (1,647)
       ├─ EnemyElite (208) · EnemyPlayerGiant (53) · FriendlyElite (119)
```

**39 classes, 14,083 lines.** Every count above was read off disk on 2026-09-09, not
estimated.

### ⛔ THE FIRST SCOPE CUT: `EnemyPlayer`'s BRANCH IS NOT AN ENEMY BEHAVIOUR

`EnemyPlayer` extends **`MCSPlayer`** — the *player* class, 4,775 lines — and it overrides
**14** methods including `AI`, `getDamage`, `getSkillLevel`, `createLoot`, `rewardXP`,
`gotInput` and `gotNetworkDamage`. It is the duellist and the network/clone actor: a player
that drives itself. Its three children (`EnemyElite`, `EnemyPlayerGiant`, `FriendlyElite`)
inherit that, and together the branch is **2,027 lines on top of a 4,775-line base.**

**That branch is OUT OF SCOPE for L4b.** It is `ai` 0, 9, 14, 15, 29, 30 — and `ai` 0, 15
**never appear in `npcdata.xml`** at all, while 0 is assigned only in code
(`XMLNpc.as:315`, the duellist). Building it means building `MCSPlayer`, which is the
player, which is L5's. **L4b builds the `NPC` tree: the 1,238-line base and its 34
descendants — 1,238 + 11,742 = 12,980 lines.** Say this at the gate, not after.

### ⛔ THE SECOND SCOPE CUT: THE SEAM ALREADY EXISTS — DO NOT REBUILD IT

`src/core/OpponentController.ts` (45 lines) already defines the contract: the Sim hands a
controller an `OpponentView` each tick and executes the `OpponentIntent` it returns.
`src/core/AISeamController.ts` (154 lines) is the *only* current implementation, and it is
the 3-tier stand-in.

> **L4b fills that seam 34 times. It does not move the seam, and it does not move `Sim.ts`.**

`Sim.ts` and `tests/duel-baseline.test.ts` are `GAUNTLET.md` §4's no-touch list and belong
to **L5** alone, by its atomic protocol. If a behaviour genuinely cannot be expressed as an
`OpponentIntent`, that is a **finding to report**, not a licence to widen the seam.

### ⭐ WHY SEQUENCED SLICES BEAT A FAN-OUT HERE — the amendment to §2

§2 gives Fable a bounded 12–16 agent fan-out because its lanes are *"depth-bound, not
width-bound"*. **L4b is both**, and that is exactly the case the fan-out handles worst:

- **34 subclasses share ONE base.** Measured override vocabulary: **31 distinct methods**
  across the tree, but the spine is five — `update` · `startAction` · `doAction` · `init` ·
  `die`. Seven classes override *only* `update`/`startAction`/`doAction`.
- **Fan out before the base exists and you get 12 divergent bases.** That is
  **state-schema drift**, the first of the four killers the root `CLAUDE.md` names, and this
  account has already been bitten by it.
- **Fan out after the base exists and the base is the bottleneck anyway** — every agent
  waits on it, then every agent edits the same file to extend it.

**So: build the base ONCE, deeply, then take the descendants in slices ordered
cheapest-first** — the repo's own ordering rule. Parallelism inside a slice is fine once
the base is frozen and its tests are green.

---

## THE INPUTS L4a ALREADY HANDED YOU — do not re-derive any of them

| You need | It is already committed at | Trust it because |
|---|---|---|
| which class each `ai` selects, with constructor ARGS | `src/config/ogAi.ts` → `OG_AI_CREATE_NPC` (38) | byte-checked line-by-line vs `NPCManager.as` |
| the room variants and their `doChase` flags | `OG_AI_CREATE_ROOM_NPC` (13) · `..._PROCGEN` (2) | same |
| the 4 in-code `ai` overrides | `OG_AI_CODE_OVERRIDES` | read from `XMLNpc.as`, not retyped |
| which `ai` values are ANIMALS | `OG_AI_ANIMAL_VALUES` = 8,10,11,12,16,17,18,19,21,24 | `XMLNpc.as:645-647` |
| `ai` absent ⇒ 1 (EnemyKnife) | `OG_AI_ABSENT_DEFAULT`, and `aiEffective` on every row | `XMLNpc.as:135-141` |
| the duellist's spawn geometry | `OG_AI_DUEL_PLACEMENT` (x 650 / x 150 / `BOW2`) | `NPCManager.as:643`. ⛔ **L5's to wire, not yours** |
| every NPC's stats, skills, loot, paperdoll | `src/config/ogNpcs.ts` → `OG_NPCS` (495) | byte-checked vs `npcdata.xml` |
| how a named duellist's HP is really derived | `src/core/enemyModel.ts` — **CONTRACT, do not touch** | SESSION13 D3 |
| how a trash mob differs | `src/core/mobModel.ts` — mobs die in ONE hit | SESSION14 A2 |

**`OG_NPCS`'s `hp`/`attack`/`defense` are BASE values.** `enemyModel.ts` recomputes a named
duellist's HP at spawn from the *player's* stats. Porting the roster was not a licence to
start using raw `<hp>`, and neither is building the actors.

---

## In scope

1. **The `NPC` base**, ported from `NPC.as` (1,238 lines, 51 functions) as a controller
   family behind `OpponentController` — the shared state machine every actor overrides.
   Numbers to `src/config/`, logic to `src/core/`, **zero numeric literals in `core/`**.
2. **The 34 `NPC` descendants**, in cheapest-first slices (the measured order is below).
3. **A test per class** that pins its override surface against the AS3 — same discipline as
   `tests/ogAiData.test.ts`: an independent read of the source, not a restatement.
4. **A DIVERGENCES entry** for every behaviour that could NOT be expressed through the
   existing seam, naming what the seam would need. That list is the input to L5.

### The measured cheapest-first order

```
SLICE 0  the NPC base                                     1,238 lines, 51 functions
SLICE 1  3 overrides, spine only — the pattern-setters
         EnemyKatana(220) EnemyKnife(247) EnemySpear(276) RoomGoblin(306) RoomOgre(336)
SLICE 2  the cheap descendants of a class already built
         EnemyWolf2(103, 1 override) EnemyFox(240) EnemyCivilianFemale(200)
         EnemyCivilianOld(258) FriendlyArcher(86) FriendlySpearElite(60)
SLICE 3  the animals            EnemyWolf(489) EnemyBear(279) EnemyBoar(364)
                                EnemyDeer(261) EnemyStag(339) EnemyHorse(269)
                                EnemyWolfAlpha(584)
SLICE 4  the humanoids          EnemyArcher(311) EnemyNinja(359) EnemyShield(417)
                                EnemyCivilian(355) EnemySpearElite(584)
                                EnemyGoblin(572) EnemyGoblinThrower(586) EnemyOgre(386)
SLICE 5  the odd ones           EnemyTrainingDummy(288) EnemyVegePatch(164)
                                EnemyZombie(739) RoomZombie(324) EnemyJiangSi(361)
SLICE 6  the bosses             EnemyNianMonster(521) EnemySorcererBoss(380)
                                EnemyKanjiGuardian(478)
```

**A slice is done when its gate is green. Do not start the next slice before then.**

## ⛔ NOT in scope — say so up front rather than at the gate

- **`EnemyPlayer` and its three children** (`EnemyElite`, `EnemyPlayerGiant`,
  `FriendlyElite`) — they extend `MCSPlayer`, the player class. Building them is building
  the player. **L5's.**
- **`CutsceneActor`** — reached by `createCutsceneActor`, not by an `ai` dispatch. **L1's.**
- **Moving `Sim.ts` or `tests/duel-baseline.test.ts`** — §4's no-touch list, **L5 only**,
  and only by the baseline's atomic protocol.
- **Rewiring `AI_TIERS` out of `DuelScene`/`EncounterScene`.** L4b builds the actors beside
  it. The swap is a Sim-level change and therefore **L5's**.
- **The fight-feel grade.** It needs A1 frame cites and the owner's LOOK, and no model can
  award it.
- **Art or animation for any new actor.** L6's, and L3B's art verdict is still open.

---

## ⚠️ THE TRAPS, ALL MEASURED FIRST-HAND ON 2026-09-09

1. **`EnemyPlayer` IS NOT AN ENEMY.** 1,647 lines extending the 4,775-line *player* class,
   overriding `AI`, `getDamage`, `rewardXP`, `gotInput`, `gotNetworkDamage`. Anyone who
   reads "34 enemy behaviours" and starts at the biggest file builds the player by accident.

2. **THE TREE IS SHALLOW BUT IT IS REAL.** Five classes have children: `EnemyArcher`,
   `EnemyCivilian`, `EnemySpearElite`, `EnemyWolf`, `EnemyPlayer`. `EnemyWolf2` overrides
   **exactly one** method (`doAction`) — flattening the tree turns a 103-line class into a
   489-line copy, five times over.

3. **THE OVERRIDE VOCABULARY IS 31 METHODS, NOT 3.** The spine is
   `update`/`startAction`/`doAction`/`init`/`die`, but the tail is real and load-bearing:
   `gotHit` · `redFreeze` · `setLevel` · `doLaunched` · `gotLaunched` · `gotKnockDown` ·
   `gotFly` · `deathAnimEnd` · `isDowned` · `checkHit` · `checkHitObject` · `disposeMCS` ·
   `movePositionX` · `addToCanvas` · `removeFromCanvas` · `setPosition` · `clearFilter` ·
   `getTargetPosition` · `gotDeathTouch`. `EnemyVegePatch` (164 lines) overrides **ten**
   methods — nine of them from that tail — and while it does override `update`, it
   overrides **neither `startAction` nor `doAction`**: it has no action state machine at
   all, because it is a *prop*, not a fighter. It also overrides `addToCanvas`,
   `removeFromCanvas`, `setPosition` and `movePositionX`, i.e. its own attachment to the
   scene. A base that exposes only the spine cannot host it.

4. **`RoomGoblin` / `RoomOgre` / `RoomZombie` ARE SEPARATE CLASSES, not flags.** The
   `createRoomNPC` dispatch selects them instead of `EnemyGoblin`/`EnemyOgre`/`EnemyZombie`
   for the same `ai` values (22/23/26), and it merges `ai` **11 and 16** into one
   `EnemyWolfAlpha`. `OG_AI_CREATE_ROOM_NPC` already holds all 13 rows — read it, do not
   re-derive it.

5. **FOUR DISPATCHED `ai` VALUES NEVER APPEAR IN THE DATA — AND TWO IN-SCOPE CLASSES ARE
   THEREFORE UNREACHABLE FROM THE ROSTER.** Measured against the committed tables
   2026-09-09:

   | `ai` | `createNPC` gives | `createRoomNPC` gives | any `OG_NPCS` row? |
   |---:|---|---|---|
   | 0 | `EnemyPlayer` | not in the chain → `EnemyCivilian` | **no** |
   | 10 | `EnemyWolf2` | not in the chain → `EnemyCivilian` | **no** |
   | 15 | `EnemyPlayerGiant` | not in the chain → `EnemyCivilian` | **no** |
   | 16 | `EnemyNianMonster` | **`EnemyWolfAlpha`** | **no** |

   0 and 15 are the out-of-scope `EnemyPlayer` branch. The other two — `EnemyWolf2` (103
   lines) and `EnemyNianMonster` (521) — **are in scope and no NPC row reaches them.** Note
   `ai` 16 in a room does **not** reach `EnemyNianMonster`; it reaches `EnemyWolfAlpha`, so
   the room chain does not rescue it either.

   ⚠️ **BUILD THEM ANYWAY, and do not let a coverage test delete them.** `npcdata.xml` is
   only one of the paths into `createNPC` — quest data and `initProcGenNPC` also assign
   `ai`, and `XMLNpc.as` sets it in code at four places. "No row uses it" is not "the game
   never constructs it", and a coverage test written against `OG_NPCS` alone will say
   otherwise.

6. **⚠️ THERE IS NOW A *THIRD* 34, AND IT IS A THIRD DIFFERENT SET.** L4a already pins two
   as disjoint (`tests/ogAiData.test.ts`): **34 distinct `<ai>` values** in the data, and
   **34 `Enemy*.as` files** on disk. This lane's in-scope tree is **also 34 classes** — and
   it is neither of those. Five of it are not `Enemy*` at all (`FriendlyArcher`,
   `FriendlySpearElite`, `RoomGoblin`, `RoomOgre`, `RoomZombie`) and five `Enemy*` files are
   not in it (`EnemyClone`, `EnemyElite`, `EnemyPlayer`, `EnemyPlayerGiant`,
   `Enemy_VegePatch`). **Pin the third one disjoint from the other two**, or a future reader
   "verifies" a complete lane with a coincidence.

7. **`src/core/` HAS ZERO NUMERIC LITERALS AND THAT IS TEST-ENFORCED.** Every timing,
   range, chance and speed you read out of the AS3 goes to `src/config/`, labelled
   **CONTRACT** (it is the source's own number) — not INFERRED. `tests/config-purity.test.ts`
   fails the build otherwise, and it also bans package imports from `core/`.

8. **THE SIM IS FIXED-60Hz WITH AN INJECTED RNG.** No `Math.random` in `core/`, ever
   (mulberry32 is injected). ⚠️ The original is inconsistent here and it is recorded:
   `processString` (`MCSCharacter.as:573-578`) uses `Math.random()` while `XMLNpc.as:561`
   uses the seeded `rng.rand()`. Ours is seeded everywhere; where that changes behaviour,
   log it in DIVERGENCES rather than reaching for `Math.random`.

9. **⚠️ C2 STILL BINDS.** The decompiled scripts are the **Android** build (v0.682). Every
   behaviour ported from them carries that caveat on its generated header, exactly as
   `ogNpcs.ts` and `ogAi.ts` do.

---

## THE GATE — binary, every item green with PASTED output, or the lane is open

- **L4b-A** `Sim.ts` and `tests/duel-baseline.test.ts` are **byte-identical to `42a62e2`**
  (`git diff 42a62e2 -- src/core/Sim.ts tests/duel-baseline.test.ts` is EMPTY). This is the
  first gate item on purpose: it is the one a good session breaks by accident.
- **L4b-B** the `NPC` base exists behind `OpponentController` with **no change to
  `OpponentController.ts`'s exported types**, or a DIVERGENCES entry saying exactly why the
  seam had to widen and what L5 must re-check.
- **L4b-C** every class in the slices shipped is present, extends what the AS3 says it
  extends, and overrides **exactly** the method set the AS3 gives it — asserted against the
  source by a test that reads `reference/decompiled/`, `describe.skipIf`-guarded the way
  `tests/ogAiData.test.ts` is.
- **L4b-D** the two shape-pins that a later "cleanup" would break: `EnemyWolf2` overrides
  **exactly one** method (`doAction`), and `EnemyVegePatch` overrides **neither
  `startAction` nor `doAction`**. Plus the **third 34** asserted disjoint from L4a's two.
- **L4b-E** every gameplay number lives in `src/config/` labelled CONTRACT with its
  `<File>.as:<line>` cite; `tests/config-purity.test.ts` green.
- **L4b-F** a DIVERGENCES entry lists every behaviour the seam could **not** express, or
  states explicitly that there were none.
- **L4b-G** `npm run typecheck` 0 · `npm run lint` 0 · `npx vitest run` green, **pasted**,
  with the test count stated against the **1113** baseline this kickoff was written at.
- **L4b-H** `RESUME_HERE.md`, `docs/sessions/-SESSION-LOG.md`, `docs/DIVERGENCES.md` and
  §2's L4 row updated **in the same commit as the change**.
- **L4b-I** ⛔ the out-of-scope list is restated in the closing report — `EnemyPlayer`'s
  branch, `CutsceneActor`, the `AI_TIERS` rewire, the fight-feel grade. **Not built, and
  said out loud rather than left to look forgotten.**

**Never soften a gate to fit a result — re-author, or take a ruling.**

## DON'T BREAK

- **§4's no-touch list.** `Sim.ts` and `tests/duel-baseline.test.ts` move only in L5.
- **`src/config/ogNpcs.ts`, `ogAi.ts`, `ogItems.ts`, `ogSkills.ts`, `ogCompositing.ts` and
  their transcribers are CLOSED evidence.** Re-run a transcriber; never hand-edit output.
- **`src/core/enemyModel.ts` and `mobModel.ts` are CONTRACT.** Do not touch them.
- **The floors:** tracing ≥ 0.9179 · held-out ≥ 0.8654 · height ≤ 138.3. They go UP or they
  stay. This lane should not touch them at all.
- **GATE A13-A's ratchet** (`tests/a13Bands.test.ts`): worst cell ≤ 12.78 pp.
- `src/core/` zero numeric literals · dependency direction · render-only scenes ·
  red-first TDD · **chaos-plant every guard**.

## THE BASELINE TO CONFIRM FIRST

```bash
git log -1 --oneline          # 42a62e2 (or later — say what landed since)
npx vitest run                # Test Files 70 passed (70) · Tests 1113 passed (1113)
npm run -s typecheck && npm run -s lint      # both exit 0
```

Confirm it against a real run, not against this document. **The commit hash goes stale the
moment anything else lands; the TEST COUNT is the baseline that actually binds.**

---

## THE PASTE-READY PROMPT

```text
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

LANE L4b — THE ENEMY ACTORS. Fable 5 @ high. SEQUENCED SLICES, NOT a wide fan-out:
the 34 subclasses share one base, so fanning out before the base exists produces 34
divergent bases — the state-schema drift my CLAUDE.md names as a known killer.

READ FIRST: docs/sessions/L4B_KICKOFF.md — it is the whole lane, and every number in
it was measured off disk on 2026-09-09. Do NOT re-derive them.

CONFIRM THE BASELINE with a real run, not a prediction:
  git log -1 --oneline   ->  42a62e2
  npx vitest run         ->  70 files / 1113 tests
If HEAD has moved, say what landed since. The test count is what binds.

THE TASK. Build the original's NPC actor family — NPC.as (1,238 lines, the shared base
state machine) plus its 34 descendants — behind the OpponentController seam that ALREADY
EXISTS in src/core/. An <ai> value must select a real behaviour instead of one of the
three hand-authored AI_TIERS. L4a already handed you the map: src/config/ogAi.ts names
the class and its constructor args for all 38 cases plus both room dispatches, and
src/config/ogNpcs.ts holds all 495 NPCs byte-checked. Trust both; re-deriving them is
wasted work.

TWO SCOPE CUTS, and say them up front rather than at the gate:
  - EnemyPlayer + EnemyElite + EnemyPlayerGiant + FriendlyElite extend MCSPlayer, the
    4,775-line PLAYER class. That is not an enemy behaviour, it is the duellist. L5's.
  - The seam already exists. You fill OpponentController 34 times; you do NOT move it,
    and you do NOT touch Sim.ts or tests/duel-baseline.test.ts (GAUNTLET §4, L5 only).
    A behaviour that cannot be expressed as an OpponentIntent is a FINDING to report.

⚠️ THE TRAPS ARE MEASURED AND WRITTEN DOWN in the kickoff. The two that bite hardest:
  - the override vocabulary is 31 methods, not 3 — EnemyVegePatch overrides TEN and has
    NEITHER startAction NOR doAction, because it is a prop with no action state machine;
  - the tree is shallow but REAL — EnemyWolf2 overrides exactly ONE method, so
    flattening it turns a 103-line class into a 489-line copy, five times over.

Work the slices in the kickoff's order, cheapest-first. A slice is done when its gate is
green; do not start the next one before then. Every gameplay number goes to src/config/
labelled CONTRACT with its <File>.as:<line> cite — src/core/ has ZERO numeric literals and
it is test-enforced.

DONE = the kickoff's gate L4b-A..I, every item green with PASTED output. L4b-A is first on
purpose: Sim.ts and the duel baseline must be byte-identical to 42a62e2 when you finish.
Never soften a gate to fit a result — re-author, or come to me for a ruling.

Start with SLICE 0, the NPC base. Tell me your plan for it before you write code, then go.
```
