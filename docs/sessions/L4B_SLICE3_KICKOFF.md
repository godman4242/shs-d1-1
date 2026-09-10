# L4b SLICE 3 KICKOFF — THE ANIMALS

**Written 2026-09-10 at `b09b211` (slice 2 closed, 15 of 34 ported). Model: Fable 5 @
`high`. One agent loop, one slice, plan first.** The lane doc is still
`docs/sessions/L4B_KICKOFF.md`; this file is only what a fresh session needs to run
slice 3 without re-reading three sessions of history. Paste the `text` block at the
bottom as the first message.

---

## What slice 3 is, measured per file 2026-09-10

The lane doc's slice 3 is seven animals; `EnemyWolf` shipped in slice 2a as a parent, so
**six remain, all `extends NPC`, none with children** — no regrouping this time. Split by
what is NEW to the lane, not by size:

| Sub-slice | Classes (lines) | Total | What is new to the lane |
|---|---|---|---|
| **3a** | `EnemyBear` (279), `EnemyDeer` (261), `EnemyHorse` (269), `EnemyStag` (339) | 4 classes, 1,148 lines | nothing structural: the wolf's shape (`init` / `update` / `startAction` / `doAction` / `die`) on four other paperdolls; the stag adds a `setLevel` (its own soft-cap copy of `NPC.as:239`) |
| **3b** | `EnemyBoar` (364), `EnemyWolfAlpha` (584) | 2 classes, 948 lines | boar: `gotLaunched` `gotKnockDown` `gotFly` — the first REACTION overrides (knock-down and fly are both turned into a launch); alpha: SPAWNS wolves (`NPCManager.createEnemy`, a new event + a seam finding), scales 2×, balances against the player like the spear boss |

Ship 3a to green and commit, then 3b. Two commits, one session if it holds.

The exact override set of each (measured, and what `tests/npcTree.test.ts` will demand):

```
EnemyBear        init update startAction doAction die
EnemyDeer        init update startAction doAction die
EnemyHorse       init update startAction doAction die
EnemyStag        init setLevel update startAction doAction die
EnemyBoar        init update startAction doAction die gotLaunched doLaunched gotKnockDown gotFly
EnemyWolfAlpha   init setLevel update startAction doAction gotHit doLaunched die redFreeze
```

Dispatch (`config/ogAi.ts`): bear 17, boar 18, deer 19, horse 12, stag 21, alpha 11 AND 16
(the room dispatch merges them). The room dispatch passes `(null, doChase)` to horse, bear
and boar — their constructors take `(mcs, doChase)` like the civilian's.

---

## THE PORTS THESE SIX WILL NEED — grepped per file, so plan them first

| Source call | Where | Port it as |
|---|---|---|
| `GameEngine.isAdventureMode()` | all six (2 / 4 / 3 / 3 / 4 / 4) | `NpcWorld.adventureMode` — EXISTS (slice 2a) |
| `CutsceneManager.getInstance().isShowing()` | all six, 1 each | `NpcWorld.cutsceneShowing` — EXISTS (slice 1) |
| `NPCManager.getNearestEnemy` | bear, boar, stag, alpha | `NpcWorld.nearestEnemy` — EXISTS |
| `StatsManager.getPlayerStats / findBonusStat / getMinDamage / getDamageRange / getLevel` | alpha `setLevel` (76 lines) | `NpcWorld.playerStats` + `playerLevel` — EXIST (slice 2b); the alpha's balance block is the spear boss's shape, re-read it against `EnemySpearElite.as:79-123` and DIFF, do not assume it is a copy |
| **`NPCManager.createEnemy(65, x, groundY, true)`** | alpha `startAction(POSE_STATE)` `:291` / `:295` — the howl calls a wolf (roster id 65) 50 px off either edge, a coin picks the side, room only | **NEW: `NpcEvent { type: 'spawn', npcId, x, y, fatal }`** — and **DIVERGENCES finding 12**: the seam has no way to add an actor mid-fight |
| `mcs.changeScale(2, 2)` | alpha `:34` | `setScale(2)` — the wolf did 1.2 the same way |
| `new MCSBear / MCSBoar / MCSDeer / MCSHorse / MCSWolf` | all six (the stag rides `MCSHorse`) | `paperdoll` stays the roster's; the clips are `BEAR_*` (7 keys), `BOAR_*` (8), `DEER_*` (8), `HORSE_*` (7) + `STAG_CHARGE` in `OG_ANIM` — all present, checked 2026-09-10 |
| `SoundManager.instance.playHit / playDie`, `createFloatingText` | alpha `gotHit` / `die` | `sound` / `floatingText` events — EXIST |

**None of `externalRedFreezeCheck`, `isPeaceful`, `isDuelMode`, `LangManager`,
`setSpeechText` appears in these six.** Grepped per file; the slice-2 kickoff's aggregate
count hid a sub-slice split once already.

---

## THE TRAPS THIS SLICE, measured

- **The alpha's `gotHit` is NOT the wolf's.** Diffed 2026-09-10: defence and the floor are
  subtracted INSIDE the `getHP() > 0` block (the wolf does it before), and the launch
  branch has NO `!isDowned()` guard — a downed alpha hit with launch-air launches again.
  Port it as its own full body from `EnemyWolfAlpha.as`, and pin both differences
  against the wolf.
- **The boar's reactions collapse to one.** `gotKnockDown()` and `gotFly()` both call
  `gotLaunched()` (`:353-361`); its `gotLaunched` has its own guard (`DOWNED || DYING`
  return, `:295`) — read `NPC.as:536` first, then the boar's, port as a full body. Its
  `canGotFly = true` (unlike the wolf) so `gotHit`'s fly branch reaches it.
- **The stag's `setLevel` is a hand copy of the base's** (`:48-`): `factor *= 0.9` at
  `lvl <= 20`, same int products. Diff it against `NPC.as:239-260` before deciding whether
  it differs at all; if it is byte-equivalent, say so in DIVERGENCES (like
  `EnemyCivilianOld.update`) and still write it out.
- **Doubled-scale bodies and `mcs.scaleX == 1`.** The alpha is `changeScale(2, 2)`; any
  `scaleX == 1` test in its switch (DOWNEDUP-style) reads FALSE for it. Check each
  `update()` switch for that comparison before assuming the wolf's behaviour.
- **Harness rules that cost slice 2 fourteen fixes:** `world({...})` spreads a COPY
  (mutate `npc.world`); a fresh actor's `idleCounter` is 0 (park it in VICTIM / DOWNED
  before a clip-end test); count the rng calls a `startAction` makes before choosing a
  `seq`; the wolf family's `checkPlayer`-before-bite ordering; a cooldown armed in
  `doAction` is ticked by the same `update`.
- **Pin every range at its exact boundary.** A plant that stays green is a missing test.

---

## THE PATTERN — unchanged from slices 1–2, do not re-derive it

1. Read each `.as` in full; diff each `update()` / `gotHit` / `doLaunched` against the
   wolf's (`difflib`). The diff IS the class.
2. Numbers → `src/config/og<Name>.ts`, CONTRACT, `<File>.as:<line>`; repeats across the
   animals → a new `ogNpcAnimal.ts` with every twin line named (the wolf's `arriveX` 10,
   `fallGravity` 3, `xp 5/45` and the launch arc are the likely twins).
3. Test file per sub-slice (`tests/npcSlice3a.test.ts`, `npcSlice3b.test.ts`), written
   FROM the AS3, watched RED first.
4. `override` on EXACTLY the AS3's set; add each class to `SHIPPED` in
   `tests/npcTree.test.ts` (gate C reads the AS3 itself).
5. Chaos-plant every guard; restore from a scratchpad copy; verify with `cmp`.
6. Anything the seam cannot express → DIVERGENCES "L4b (slice 3a)" / "(slice 3b)",
   numbered from **12**.

---

## THE GATE — slice level, every item pasted

- **A** `git diff 42a62e2 -- src/core/Sim.ts tests/duel-baseline.test.ts src/core/OpponentController.ts | wc -c` → **0**
- **C/D** `tests/npcTree.test.ts` green with the six classes in `SHIPPED` (21 total)
- **E** `tests/config-purity.test.ts` green; every number cited
- **G** `npx vitest run` green with the count stated against **1339**; typecheck 0; lint 0
- **H** `RESUME_HERE.md` rewritten (top block, never appended), `docs/sessions/-SESSION-LOG.md`,
  `docs/DIVERGENCES.md`, and `docs/GAUNTLET.md` §2's L4 row, in the SAME commit
- **I** the out-of-scope list restated: `EnemyPlayer`'s branch, `CutsceneActor`, the
  `AI_TIERS` rewire, the fight-feel grade, and no adapter yet builds an `NpcWorld`

---

## THE BASELINE TO CONFIRM FIRST

```bash
git log -1 --oneline          # b09b211 or later — say what landed since
npx vitest run                # Test Files 77 passed (77) · Tests 1339 passed (1339)
npm run -s typecheck && npm run -s lint      # both exit 0
```

---

## THE PASTE-READY PROMPT

```text
You're the lead engineer on SSHD 1:1. Follow the repo's CLAUDE.md and my ship-bar.

LANE L4b, SLICE 3 — THE ANIMALS. Fable 5 @ high. ONE agent loop, no fan-out.
Plan first, then go.

READ FIRST, in this order:
  1. docs/sessions/L4B_SLICE3_KICKOFF.md  — this slice: six animals, the split, the
     ports (measured per file), the traps, the gate.
  2. RESUME_HERE.md top block              — what slices 0-2 left and must not be "fixed".
  3. src/core/npc/Npc.ts + EnemyWolf.ts    — the base and the animal pattern-setter
     (its gotHit / doLaunched / die / redFreeze are full bodies). Do not re-derive.
  4. DIVERGENCES.md "L4b (slice 2a)" and "(slice 2b)" — findings 9-11; number from 12.

CONFIRM THE BASELINE with a real run:
  git log -1 --oneline   ->  b09b211
  npx vitest run         ->  77 files / 1339 tests
If HEAD has moved, say what landed since. The test count binds.

THE TASK. Sub-slice 3a: EnemyBear, EnemyDeer, EnemyHorse, EnemyStag (4 classes,
1,148 lines). Gate it, commit it. Then sub-slice 3b: EnemyBoar, EnemyWolfAlpha
(2 classes, 948 lines). Gate it, commit it. Each class: src/core/npc/<Name>.ts,
`override` on EXACTLY the AS3's set, numbers in src/config/og<Name>.ts as CONTRACT
with <File>.as:<line> (animal repeats -> ogNpcAnimal.ts, twins named), a test
written FROM the AS3 and watched red first, chaos-plant the guards, register in
SHIPPED.

SCOPE CUTS, restated: EnemyPlayer's branch is L5's; the seam is not moved and Sim.ts
is not touched; no adapter builds an NpcWorld yet. A behaviour the seam cannot
express is a DIVERGENCES finding, numbered from 12. The alpha's wolf-spawn WILL be one.

THE TRAPS, measured:
  - The alpha's gotHit is NOT the wolf's: defence inside the alive check, no
    !isDowned() guard on the launch. Full body, both differences pinned.
  - The boar's gotKnockDown and gotFly both call its own gotLaunched. Read NPC.as:536
    first, then EnemyBoar.as:293, port as full bodies.
  - The stag's setLevel is a hand copy of NPC.as:239 — diff it before deciding.
  - The alpha is changeScale(2,2): any `mcs.scaleX == 1` test in its switch is FALSE.
  - Harness: world({...}) is a COPY; idleCounter starts at 0; count startAction's
    rng calls; a cooldown armed in doAction ticks in the same update.
  - Pin every range at its exact boundary. A plant that stays green is a missing test.

DONE = the slice gate in the kickoff, every item green with PASTED output, test count
stated against 1339, handoff docs in the same commit, out-of-scope list restated.
Never soften a gate to fit a result — re-author, or come to me for a ruling.

Tell me your plan for 3a before you write code, then go.
```
