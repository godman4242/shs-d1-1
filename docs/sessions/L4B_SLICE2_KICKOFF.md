# L4b SLICE 2 KICKOFF — PARENTS WITH THEIR CHILDREN

**Written 2026-09-09 at `923c445` (slices 0 and 1 closed). Model: Fable 5 @ `high`.
One agent loop, one slice, plan first.** The lane doc is still
`docs/sessions/L4B_KICKOFF.md`; this file is only what a fresh session needs to run
slice 2 without re-reading two sessions of history. Paste the `text` block at the
bottom as the first message.

---

## Why slice 2 is not the kickoff's slice 2

The lane's cheapest-first order listed slice 2 as the six cheap **children**
(`EnemyWolf2`, `EnemyFox`, `EnemyCivilianFemale`, `EnemyCivilianOld`, `FriendlyArcher`,
`FriendlySpearElite`). Measured 2026-09-09: **every one of them extends a parent from
slice 3 or 4.** A child cannot ship before its parent, so slice 2 is regrouped as
**parent + children**, and it is bigger than the lane doc said:

| Sub-slice | Classes (lines) | Total | Overrides that are NEW to the lane |
|---|---|---|---|
| **2a** | `EnemyWolf` (489) → `EnemyWolf2` (103), `EnemyFox` (240); `EnemyCivilian` (355) → `EnemyCivilianFemale` (200), `EnemyCivilianOld` (258) | 6 classes, 1,645 lines | wolf: `init` `gotHit` `doLaunched` `die` `redFreeze` — the FIRST reception-side overrides |
| **2b** | `EnemyArcher` (311) → `FriendlyArcher` (86); `EnemySpearElite` (584) → `FriendlySpearElite` (60) | 4 classes, 1,041 lines | archer: `die`; friendlies: `setLevel` `init` `checkHitObject`; spear elite: `setLevel` `checkHitObject` |

Ship 2a to green and commit, then 2b. Two commits, one session if it holds.

The exact override set of each (measured, and what `tests/npcTree.test.ts` will demand):

```
EnemyWolf            init update startAction doAction gotHit doLaunched die redFreeze
EnemyWolf2           doAction                                   (extends EnemyWolf)
EnemyFox             init doAction                              (extends EnemyWolf)
EnemyCivilian        init update startAction doAction
EnemyCivilianFemale  startAction doAction                       (extends EnemyCivilian)
EnemyCivilianOld     update startAction doAction                (extends EnemyCivilian)
EnemyArcher          update startAction doAction die
FriendlyArcher       setLevel init checkHitObject               (extends EnemyArcher)
EnemySpearElite      setLevel update startAction doAction checkHitObject
FriendlySpearElite   setLevel init                              (extends EnemySpearElite)
```

---

## THE PORTS THESE TEN WILL NEED THAT SLICES 0–1 DID NOT — measured, so plan them first

Grep of the ten files for manager calls, 2026-09-09. Each becomes a field on `NpcWorld`
(`src/core/npc/types.ts`) or an `NpcEvent`; **never a seam change**.

| Source call | Uses | What it is | Port it as |
|---|---|---|---|
| `StatsManager.getPlayerStats(STAT_MAXHP / STAT_DEFENSE) + findBonusStat(...)`, `getMinDamage()`, `getDamageRange()` | 6 / 6 / 3 / 3 | the PLAYER's live stats — `FriendlyArcher.setLevel` sets `damage / defense / maxhp` to **0.75 ×** the player's (`FriendlyArcher.as:21-34`); `xp = 0` | `NpcWorld.playerStats: { maxHp, defense, minDamage, damageRange }` (bonus already summed) |
| `GameEngine.isAdventureMode()` | 10 (wolf 4, fox 6) | overworld-adventure vs room | `NpcWorld.adventureMode: boolean` |
| `NPCManager.externalRedFreezeCheck()` | 9 | after an actor lands a hit, the manager checks whether the kill-cam should fire and whether anything died (`NPCManager.as:1651`) | `NpcWorld.externalRedFreezeCheck(): void` — a callback; the Sim/scene decides |
| `StageManager.isPeaceful()` | 1 | the stage's peaceful flag | `NpcWorld.peaceful: boolean` |
| `ProjectileManager.createArrow(x, y, vx, vy, damage, canLaunch, owner)` | 1 (`EnemyArcher.as:300`) | the archer's shot | an `NpcEvent { type: 'arrow', … }` **and a DIVERGENCES finding**: the seam has only `throwKunai`, so an arrow cannot reach the Sim as itself |
| `LangManager.getString(id)` | 5 | civilian speech text ids | an `NpcEvent { type: 'speech', stringId }` — never the string |
| `new MCSWolf()` | 3 | a different display class (four legs) | `paperdoll` stays the roster's; the anim keys are `WOLF_*` in `OG_ANIM` already |
| `ColorCode.makeDark`, `SoundManager`, `createFloatingText`, `CutsceneManager.isShowing`, `getNearestEnemy`, `getGroundY`, `getGameStageWidth`, `isRedFreeze`, `getLevel` | many | already ported in slices 0–1 | reuse `filter`, `events`, `world.*` |

**`EnemyWolf` overrides `gotHit`, `doLaunched`, `die`, `redFreeze`.** The base versions are in
`Npc.ts` under their `NPC.as` cites; read the base method FIRST, then the wolf's, and port
the wolf's as a full override (not a delta) — the tree test only checks the name set, the
behaviour test must check the body.

---

## THE PATTERN SLICES 0–1 FIXED — follow it, do not re-derive it

1. **Read the parent and every child in full before writing anything.** Diff each child's
   overridden method against the parent's (`difflib`, the way slice 1 did). The diff IS the
   child's file.
2. **Numbers → `src/config/og<Name>.ts`**, CONTRACT, `<File>.as:<line>` on every value.
   Repeats across classes → `ogNpcHumanoid.ts` (or a new `ogNpcAnimal.ts` for the wolves)
   with every twin line named. `src/core/` has ZERO numeric literals; the purity test bites.
3. **Test file per sub-slice, written FROM the AS3, watched RED first.** Harness rules that
   cost slice 1 seven fixes:
   - `world.nearestEnemy` must answer with the target. The source ASSIGNS what it gets,
     null included, and the next frame skips.
   - The clip-end switch runs BEFORE `doAction`: a finished attack clip re-enters ATTACK
     in the same frame; a 3-frame clip swings on 2 frames; IDLE after a get-up lasts
     zero frames. Expect what the source does, not what reads cleanly.
   - **Pin every range at its exact boundary** (99 attacks / 100 walks). The katana's
     100→90 plant stayed GREEN until that pin existed. A plant that stays green is a
     missing test, not a passing guard.
4. **`override` on EXACTLY the AS3's set** (`noImplicitOverride` makes the keyword the
   signal). Add each class to `SHIPPED` in `tests/npcTree.test.ts`. Within-class helpers
   for blocks the source repeats inside ONE class are fine (`RoomGoblin.headForDest`);
   sharing across classes is not.
5. **Name mapping:** `mcs.updateAnimation()` → `stepAnimation()` · `mcs.x/y` → `x/y` ·
   `mcs.scaleX == 1` → `facingRight && scale === ONE` · `mcs == null` → `disposed` ·
   `target.mcs.x` / `target.getMCS().y` → `target.x` / `target.y` · `int(...)` → `asInt(...)`
   (AS3 int coercion, truncates; `NaN`/`Infinity` → 0).
6. **Chaos-plant every guard**, restore from a scratchpad copy, verify with `cmp`.
7. **Anything the seam cannot express → DIVERGENCES**, under a new "L4b (slice 2)"
   heading. Eight findings exist; number from 9.

---

## THE GATE — slice level, every item pasted

- **A** `git diff 42a62e2 -- src/core/Sim.ts tests/duel-baseline.test.ts src/core/OpponentController.ts | wc -c` → **0**
- **C/D** `tests/npcTree.test.ts` green with the ten classes in `SHIPPED`
- **E** `tests/config-purity.test.ts` green; every number cited
- **G** `npx vitest run` green with the count stated against **1243**; typecheck 0; lint 0
- **H** `RESUME_HERE.md` rewritten (top block, never appended), `docs/sessions/-SESSION-LOG.md`,
  `docs/DIVERGENCES.md`, and `GAUNTLET.md` §2's L4 row, in the SAME commit
- **I** the out-of-scope list restated: `EnemyPlayer`'s branch, `CutsceneActor`, the
  `AI_TIERS` rewire, the fight-feel grade

---

## THE BASELINE TO CONFIRM FIRST

```bash
git log -1 --oneline          # 923c445 (or later — say what landed since)
npx vitest run                # Test Files 75 passed (75) · Tests 1243 passed (1243)
npm run -s typecheck && npm run -s lint      # both exit 0
```

---

## THE PASTE-READY PROMPT

```text
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

LANE L4b, SLICE 2 — PARENTS WITH THEIR CHILDREN. Fable 5 @ high. ONE agent loop,
no fan-out. Plan first, then go.

READ FIRST, in this order:
  1. docs/sessions/L4B_SLICE2_KICKOFF.md  — this slice: the regrouping, the ports the
     ten classes need (measured), the pattern, the gate.
  2. RESUME_HERE.md top block              — what slices 0-1 left and must not be "fixed".
  3. src/core/npc/Npc.ts + EnemyKatana.ts  — the base and the pattern-setter. Do not
     re-derive either.
  4. DIVERGENCES.md "L4b (slice 0)" and "(slice 1)" — the 8 seam findings; number from 9.

CONFIRM THE BASELINE with a real run:
  git log -1 --oneline   ->  923c445
  npx vitest run         ->  75 files / 1243 tests
If HEAD has moved, say what landed since. The test count binds.

THE TASK. Sub-slice 2a: EnemyWolf -> EnemyWolf2, EnemyFox; EnemyCivilian ->
EnemyCivilianFemale, EnemyCivilianOld (6 classes, 1,645 lines). Gate it, commit it.
Then sub-slice 2b: EnemyArcher -> FriendlyArcher; EnemySpearElite ->
FriendlySpearElite (4 classes, 1,041 lines). Gate it, commit it. Each class:
src/core/npc/<Name>.ts, `override` on EXACTLY the AS3's set, numbers in
src/config/og<Name>.ts as CONTRACT with <File>.as:<line>, a test written FROM the
AS3 and watched red first, chaos-plant the guards, register in SHIPPED.

TWO SCOPE CUTS, restated: EnemyPlayer's branch (extends MCSPlayer) is L5's; the seam
is not moved and Sim.ts is not touched. A behaviour the seam cannot express is a
DIVERGENCES finding, numbered from 9. The archer's arrow WILL be one.

THE TRAPS THIS SLICE, measured:
  - EnemyWolf overrides gotHit/doLaunched/die/redFreeze — the first reception-side
    overrides. Read the base method in Npc.ts first, port the wolf's as a full body.
  - FriendlyArcher.setLevel scales damage/defense/maxhp to 0.75 x the PLAYER's live
    stats (FriendlyArcher.as:21-34) — a new NpcWorld.playerStats port, not a number.
  - Ten uses of GameEngine.isAdventureMode() in wolf/fox; nine of
    NPCManager.externalRedFreezeCheck() — both new ports, listed in the kickoff.
  - Harness: world.nearestEnemy must answer with the target; the source assigns null.
  - Pin every range at its exact boundary. A plant that stays green is a missing test.

DONE = the slice gate in the kickoff, every item green with PASTED output, test count
stated against 1243, handoff docs in the same commit, out-of-scope list restated.
Never soften a gate to fit a result — re-author, or come to me for a ruling.

Tell me your plan for 2a before you write code, then go.
```
