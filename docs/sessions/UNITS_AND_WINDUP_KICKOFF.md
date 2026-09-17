# KICKOFF — THE UNITS AND THE WINDUP: CLOSE FINDINGS 15 AND 18 BEFORE PORTING 13 MORE

**Written 2026-09-17 at `a81e4c3`. Model: Opus 5 @ `xhigh`, ultracode OFF, ≤2 agents.**
**Estimate: 60–90 min. Deliverable: two findings closed, each proven by a red-proofed gate.**

## WHY THIS AND NOT SLICE 4

The seam spike answered **SEAM NEEDS WORK** with four findings (`docs/DIVERGENCES.md`,
last section). Two of them are cheap and two are not:

| finding | cost | why now |
|---|---|---|
| **15** units | small | **all 21** ported actors read a world-space field; every one is wrong |
| **18** windup | small, inside `NpcController` | **13 of 21** classes can re-enter ATTACK and inherit it |
| 16 damage-in | moves `OpponentView` | L5 decision, not this session |
| 17 death-out | same channel as 16 | L5 decision, not this session |

Slice 4 adds 13 more classes. Every one of them would inherit 15 and 18 the moment it
is wired. Closing them first costs one session; closing them after costs the same
session **plus** re-verifying 13 classes. That is the whole argument.

⛔ **DO NOT start slice 4.** Its kickoff is still unwritten, deliberately.

## THE MEASUREMENTS THIS KICKOFF RESTS ON — all re-derived at `a81e4c3`

Every number below was computed from source for this kickoff, not copied. The spike's
own kickoff shipped three wrong numbers; that is why this block exists.

```bash
# 21 ported actor classes, and ALL 21 read a world-space field
ls src/core/npc/*.ts | grep -cE '(Enemy|Friendly|Room)'                  -> 21
for f in src/core/npc/*.ts; do grep -c 'world\.groundY\|world\.stageWidth\|world\.npcBlocked\|world\.stagePosition' $f; done
  -> 23 files non-zero = 21 actors + Npc.ts + MCSActor.ts

# 13 of 21 can re-enter ATTACK — finding 18's blast radius
grep -l 'startAction(OG_STATE.ATTACK)' src/core/npc/*.ts | wc -l          -> 13

# 329 numeric fields across the 21 actor config modules,
# and ZERO of them are labelled INFERRED
grep -c INFERRED src/config/ogEnemy*.ts src/config/ogNpc*.ts src/config/ogRoomNpc.ts -> 0
```

⚠️ **329, not 314.** Counting only `key: 5` misses the 15 fields written as bare
`export const X = 5` (all in `ogNpcBase` and `ogNpcHumanoid`) — the exact blind spot
that made claimcheck's first version report "0 failures" over four wrong cites. If you
recount, count both forms.

## FINDING 15 — AND THE FIX IS **ONE CONVERSION**, NOT 329 EDITS

`OG_KATANA.melee.x` is `100` (`EnemyKatana.as:167`). The seam hands the actor
`view.enemyPos.x` in WORLD px. The repo's own transform is
`stage = (32 + 1.2·worldX, 1.2·worldY)` (`src/core/viewport.ts:14-15`), so 100 OG px
is ~83 world px — and `Sim.executeStrike` range-gates **nothing**, it trusts the intent.

Measured in the spike: the katana strikes at a **95.4 px** gap; the shipped
`AISeamController` closes to **48.2 px** on the same duel.

**Because zero of the 329 actor constants are INFERRED, they are all verbatim AS3
values, i.e. all in OG space by construction.** So nothing in `src/config/` needs to
change. Put the ACTOR in OG stage space and convert at the seam:

- `src/core/viewport.ts` already exports `worldToStage`, `stageToWorld`,
  `worldToStageLength`, `stageToWorldLength`, and `src/core/` may import `src/core/`.
- The conversion points are few and all in code the spike already owns:
  `createDuelWorld()` (`groundY`, `stageWidth`, `stagePosition`) and
  `NpcController.next()` (the actor's x in, the displacement out, the proxy's x/y in).

⚠️ **THE OFFSET IS NOT THE SCALE.** `x_stage = 32 + 1.2·x_world`. For a DISTANCE the
32 cancels and the factor is 1.2 alone; for a POSITION it does not. `groundY` is
compared against the actor's own `y` (`EnemyKatana.as:206`), so both must be in the
same space — use the length helpers for lengths and the point helpers for points, and
do not hand-roll either.

### ⛔ DO NOT MAKE THE KATANA MATCH 48.2 — THEY ARE NOT THE SAME FIGHTER

This is the trap in this finding, and it is measured, not guessed:

```
MCSPlayer extends NPC          4775 lines   NOT ported
EnemyPlayer extends MCSPlayer  1647 lines   NOT ported
EnemyPlayer is obtained via NPCManager.getNetworkEnemyPlayer()  (ConnectionPIO.as:551)
```

The original's duel opponent is **another player's loadout, fetched over the dead
Player.IO backend** — not an `EnemyKatana`. `AI_MELEE_RANGE` (50 world px) is OUR
single-player duel's own measured number; `OG_KATANA.melee.x` (100 OG px) is an
overworld mob's. **Neither is wrong and they are not required to agree.** After the
conversion the katana should commit at ~83 world px — that is the CORRECT answer for a
katana mob, and it is not a bug that it differs from 48.2.

The spike used `EnemyKatana` because it was the cheapest way to exercise the seam.
That was right for a spike. It does **not** make the katana the duel's opponent, and
nothing in slice 4 should assume it does.

## FINDING 18 — DETECT THE CLIP RESTART, NOT THE STATE EDGE

`NpcController.next()` emits `telegraph` when `actionState` goes non-ATTACK → ATTACK
across a whole `update()`. The re-attack cycle completes INSIDE one `update()`:
`stepAnimation` finishes `katanaattack` → `startAction(WALK)` → `doAction()` sees the
target still in range → `startAction(ATTACK)`. Before and after are both ATTACK.

Measured in the spike: **1 telegraph for 24 landed swings**, with `actionState` reading
ATTACK on every step while `frameCounter` cycled 0→9→0.

The observable already exists and is public — `MCSActor.animation` (`:63`) and
`MCSActor.frameCounter` (`:65`). A restart is the same clip with the counter going
backwards. Whatever you choose, it must hold for all **13** attacking classes, not just
the katana, and it must not fire on a LOOPING clip's natural wrap (`walkwithkatana`
loops at 20 frames — a loop wrap is not a new swing).

## THE THIRD THING — RE-MEASURE THE STATUE

The katana closes once, stops at **95.4 px** and never moves again (traced live, 900
frames, gap 95.4 at every sample). `doAction()`'s ATTACK branch legitimately does not
move, and the original re-attacks in range too — so this may be finding 15 wearing a
costume, or it may be its own defect.

**Re-measure it after the conversion lands.** If it still stands still, it is a new
finding (**19**) with its own cost. If it now advances, say so and delete the concern.
Do not leave it unstated either way.

## THE TASK

1. **Convert at the seam.** Actor in OG stage space; `createDuelWorld()` and
   `NpcController` convert in and out via `viewport.ts`. No `src/config/` value changes.
2. **Fix the windup** in `NpcController` — clip restart, not state edge, and correct
   for all 13 attacking classes.
3. **Re-measure the statue** and record the answer.
4. **Gate both** so a revert goes red, not quiet:
   - the commit gap in world px equals `OG_KATANA.melee.x / 1.2` within the Sim's own
     step granularity — it is the one number that moves if anyone un-converts;
   - telegraphs equal swings across a whole fight;
   - a loop wrap emits NO telegraph (the false-positive half — a gate that only proves
     "more telegraphs" passes a controller that fires every frame).
5. **Update `docs/DIVERGENCES.md`**: mark 15 and 18 CLOSED with the measured
   before/after, and add 19 if the statue survives.

⛔ **DO NOT** move `Sim.ts` or `OpponentController.ts` — findings 16 and 17 need them
and they are L5's call, not this session's.
⛔ **DO NOT** edit any `src/config/og*.ts` value. 329 verbatim constants are the thing
the seam conversion exists to protect.
⛔ **DO NOT** let `?npc=katana` become the default.

## THE BASELINE TO CONFIRM FIRST — paste the output, do not assume it

```bash
npx vitest run && npm run -s typecheck && npm run -s lint \
  && npm run claimcheck && npm run instructionpaths
# expect: 86 files / 1664 tests · exit 0 · exit 0 · 1716 cites · 38 tokens
```

## THE GATE AT THE END — every item pasted

```bash
npx vitest run                 # no test lost; new tests red-proofed
npm run -s typecheck           # exit 0
npm run -s lint                # exit 0
npm run claimcheck             # every cite still resolves
npm run instructionpaths       # every path an instruction file names still exists
npm run chaos                  # 43/43 RED, 43/43 restored byte-identical (slice gate)
```
Plus: `RESUME_HERE.md` rewritten in the SAME commit, and 15/18 marked closed in
`docs/DIVERGENCES.md` with the measured before/after.

## WHAT KHESHAV DOES — one look, and it is the same look as last time

```bash
npm run dev
# then open http://localhost:5173/?npc=katana
```

**Does it now telegraph every swing, and does it close properly?** A model cannot grade
fight feel. Last time the answer was: it closes, then stands at ~2 sword-lengths and
swings with no windup after the first. If that has not visibly changed, the session
failed regardless of what the gates say.

## THE PASTE-READY PROMPT

```
Read docs/sessions/UNITS_AND_WINDUP_KICKOFF.md and run it end to end.
Opus 5 xhigh, ultracode off, ≤2 agents. Confirm the baseline first and paste it.
Close findings 15 and 18, re-measure the statue, and do not start slice 4.
VERIFY: it pastes a baseline of 86 files / 1664 tests before touching anything.
```
