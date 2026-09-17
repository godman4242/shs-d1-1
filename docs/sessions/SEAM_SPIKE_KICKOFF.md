# SEAM SPIKE KICKOFF — PUT ONE PORTED ENEMY IN THE DUEL

**Written 2026-09-17 at `1febe4d`. Model: Opus 5 @ `xhigh`, ultracode OFF, ≤2 agents.**
**Estimate: 60–90 min. This is a SPIKE: its deliverable is an ANSWER, not a feature.**

## WHY THIS EXISTS — read before the plan

**21 enemy classes are ported and 0 of them are in the game.** Measured at `1febe4d`:

```
$ ls src/core/npc/ | grep -cE '^(Enemy|Friendly|Room)'      ->  21
$ grep -rn "core/npc" src/game src/core/Sim.ts src/core/OpponentController.ts
(empty)
```

The live duel still fights the hand-authored stand-in — `src/game/DuelScene.ts:195`,
`const opponent = new AISeamController(rng, AI_TIERS.normal);`.

Slices 4–6 would add 13 more classes to a library nothing consumes. Before paying for
that, answer ONE question: **does the seam actually carry a ported actor into a playable
duel?** If yes, slices 4–6 are safe to batch. If no, we learn it after 21 classes instead
of 34.

⚠️ **There is already evidence the seam may not be enough.** Four separate findings in
`docs/DIVERGENCES.md` say so in as many words: **5** "Presentation events have no seam
channel", **10** "The arrow has no seam channel", **13** "`doChase` has no source on the
seam side", **14** the seam cannot add an actor mid-fight. This spike is how we find out
whether those are edge cases or the shape of the problem.

## WHAT IS ALREADY BUILT — do not rebuild it

Slice 0 did more than the lane board implies. **The adapter exists:**

- `src/core/npc/NpcController.ts:86` — `export class NpcController implements OpponentController`.
  It is "the 35th `OpponentController`, beside `AISeamController`", it does NOT move the
  seam and does NOT touch `Sim.ts`. It already solves the two hard problems: the 24 Hz→60 Hz
  integer-accumulator step (24 steps per 60 ticks, pattern 2,3,2,3), and a `PlayerProxy`
  that turns the actor's `checkHitObject` into a `strike` intent, rate-limited to one strike
  per twelve steps because `NPC.gotHit` refuses a hit while `gotHitCounter > 0`.

So this spike is NOT "write an adapter". It is "supply the adapter's inputs from the real game".

## WHAT IS MEASURED TO BE MISSING — this is the whole spike

An actor is constructed as (`tests/npcSlice1.test.ts:103`):

```ts
new EnemyKatana(world, anims, geometry, rng, target)
```

Of those five, **two have no real implementation anywhere in `src/`**:

| input | state at `1febe4d` |
|---|---|
| `world: NpcWorld` | 10 concrete fields (`src/core/npc/types.ts:38`). All trivially derivable in a duel — no scroll, no cutscene, no overworld. **Cheap.** |
| `rng: Rng` | `mulberry32`, already at `DuelScene.ts:194`. **Free.** |
| `target: NpcTarget` | `NpcController` supplies its own `PlayerProxy` via `changeTarget`. **Free.** |
| **`anims: AnimLibrary`** | ⛔ **NO IMPLEMENTATION EXISTS.** `grep -rn "AnimLibrary" src/` returns only `import type` lines and constructor signatures. The only implementation in the repo is a TEST STUB — `tests/npcSlice1.test.ts:48`, `{ clip: () => ({ durationFrames: CLIP, loop: false }) }`. |
| **`geometry: HitGeometry`** | ⛔ **NO IMPLEMENTATION EXISTS.** Same story; the stub is `tests/npcSlice1.test.ts:49`, `{ partAtPoint: () => null, partHitBy: () => null, partX: () => 0 }`. |

The DATA for the first one is already in the repo: `src/config/ogAnims.ts` (854 lines,
`OG_ANIMS`). Nothing connects it to `AnimLibrary`. That connector is the spike's real work.

`HitGeometry` is three methods (`src/core/npc/types.ts:102`): `partAtPoint`, `partHitBy`,
`partX`. **Decide deliberately whether the duel needs real geometry at all** — the Sim
already owns damage resolution, so a degenerate-but-honest implementation may be correct
here rather than lazy. Whatever is chosen, write down WHY, and if it is degenerate say so
loudly so nobody later reads it as finished.

## THE TASK

Use **`EnemyKatana`** and nothing else. It is the cheapest real fighter: slice 1's
pattern-setter, 220 AS3 lines, **3 overrides** (verified: `grep -c 'override ' src/core/npc/EnemyKatana.ts` → 3), no children, and **no own constructor** — so it takes the
base's five arguments and NO `doChase` (unlike `RoomGoblin`/`RoomOgre`, which do). No spawn,
no projectile — so it exercises the seam without dragging in findings 10, 13 or 14.

1. **Build the two missing adapters** where the seam's other implementations live
   (`src/core/`), NOT in `tests/`. An `AnimLibrary` over `OG_ANIMS`, and a `HitGeometry`.
2. **Build the duel's `NpcWorld`** — 10 fields, each with a one-line comment saying where
   the value comes from and which are constant *because it is a duel* (`adventureMode:
   false`, `cutsceneShowing: false`, …). A field that is fixed for the wrong reason is a
   defect; a field that is fixed for a stated reason is a decision.
3. **Swap it in behind a flag**, the way the repo already gates scenes. `src/main.ts:18`
   is `const params = new URLSearchParams(window.location.search);` and `:36` reads
   `params.get('art') === 'idle'` — follow that exact shape and add `?npc=katana`.
   **`AISeamController` stays the default** (`:66` keeps `DuelScene` first). A spike must
   never silently become the shipped behaviour.
4. **Play it.** Then write down what actually happened.

## THE GATE — binary, and it is an ANSWER not a green tick

The spike SUCCEEDS if it produces a written verdict of exactly one of:

- **SEAM HOLDS** — a `EnemyKatana` fights in the duel; it approaches, telegraphs, swings,
  takes damage, dies. Slices 4–6 are cleared to proceed.
- **SEAM NEEDS WORK** — with the specific missing channel NAMED, added to `DIVERGENCES.md`
  as a numbered finding (next is **15**), and its cost estimated.

**A third outcome is failure of the spike itself:** "it sort of works". If the answer is
mushy, the spike was not specific enough — say that plainly rather than reporting a verdict
the evidence does not carry.

⛔ **DO NOT** move `Sim.ts`, `OpponentController.ts` or the seam (`CLAUDE.md` no-touch list).
⛔ **DO NOT** rewire `AI_TIERS` — that is L5's and it moves `Sim.ts`.
⛔ **DO NOT** start slice 4. Its kickoff gets written AFTER this answer, because this answer
changes what it must say.
⛔ **DO NOT** let the flag default to on.

## THE BASELINE TO CONFIRM FIRST — paste the output, do not assume it

```bash
npx vitest run && npm run -s typecheck && npm run -s lint \
  && npm run claimcheck && npm run instructionpaths
# expect: 84 files / 1643 tests · exit 0 · exit 0 · 1716 cites · 38 tokens
```

## THE GATE AT THE END — every item pasted

```bash
npx vitest run                 # no test lost; new tests for the two adapters, red-proofed
npm run -s typecheck           # exit 0
npm run -s lint                # exit 0
npm run claimcheck             # every cite still resolves
npm run instructionpaths       # every path an instruction file names still exists
npm run chaos                  # 43/43 RED, 43/43 restored byte-identical (slice gate)
```
Plus: `RESUME_HERE.md` rewritten in the same commit, and the verdict written into
`docs/DIVERGENCES.md` if it is SEAM NEEDS WORK.

## WHAT KHESHAV DOES — and it is one look

Everything above is mine. His step is the one no gate can do: **watch the duel and say
whether that enemy fights like the videos.** A model cannot grade fight feel; that is the
standing rule for every LOOK in this project.

```bash
npm run dev
# then open the URL with ?npc=katana
```

## THE PASTE-READY PROMPT

```
Read docs/sessions/SEAM_SPIKE_KICKOFF.md and run it end to end.
Opus 5 xhigh, ultracode off, ≤2 agents. Confirm the baseline first and paste it.
Stop at the verdict — SEAM HOLDS or SEAM NEEDS WORK — and do not start slice 4.
```
