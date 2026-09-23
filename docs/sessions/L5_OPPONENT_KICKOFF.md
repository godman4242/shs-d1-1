# L5-OPP KICKOFF — THE REAL DUEL OPPONENT: `EnemyPlayer` ON A PORTED `MCSPlayer` BODY

> **Entry route:** `RESUME_HERE.md` → this file. **Self-contained; assumes no memory of
> the session that wrote it.** Evidence: `docs/research/L5_DUEL_OPPONENT_SURVEY.md`
> (every number below was measured there or in §3, 2026-09-23).
>
> **INTENT, in one sentence:** replace the hand-authored `AISeamController` with the
> opponent the original's Duel Mode actually fights — `EnemyPlayer`, a full player body
> (`MCSPlayer`) driven by its own AI — ported slice by slice from the source, each slice
> red-first, chaos-planted and claimchecked, and put into the duel only at the end,
> behind a flag, by the baseline's own atomic protocol.
>
> **Standing rulings (unchanged):** the two gameplay videos are the primary 1:1
> reference — open a frame before grading any visual claim · `src/core/` zero numeric
> literals · render-only scenes · red-first TDD · chaos-plant every guard · generated
> data is never hand-keyed · binary gates, never softened to fit a result.

---

## §1 WHY THIS LANE — measured, not assumed

- **Duel Mode's opponent is `EnemyPlayer` on 100% of fights.** `DuelModeUI.proceedWithAI`
  → `XMLNpc.initDuelist` sets `ai = 0` (`XMLNpc.as:315`) → `NPCManager.createNPC` case 0 →
  `new EnemyPlayer(mcs, isDuelist=true, isBoss=false)` (`NPCManager.as:519`). A timed-out
  live challenge falls through to the same `proceedWithAI`.
- **It is never a roster row.** Its stats / equipment / skills are another player's
  saved strings from the Player.IO server, which is dead (ruling R1).
- **`MCSPlayer` is the human player's own class.** `EnemyPlayer.AI()` (`EnemyPlayer.as:990`)
  drives it with the same stroke calls the mouse feeds (`slashTarget`, `launchTarget`,
  `makeSlash`, `moveTo`, `doSkill`). One body, two drivers.
- **Scope, per file:** `MCSPlayer.as` 4,775 lines, 90 functions (20 override `NPC`);
  `EnemyPlayer.as` 1,647 lines, 25 functions (14 overrides); `SkillManager.as` 710;
  `XMLNpc.as` 763 (the profile parsers). None is ported; `SkillManager` has 0
  references in `src/`.

## §2 THE RULINGS — decide-and-flag, each with its red-team and a one-line veto

**R1 — the profile source: a generated table in the source's own string format.**
Slice 1 ports the PARSE (`initDuelist`, `parsePlayerStatsString`, `parseEquipmentString`,
`parseSkillStatsString`, `getMastery`) against fixture strings; slice 2 decides what
fills it, after measuring the formats. Direction on record: profiles in the exact
`stats` / `eq` / `skills` string formats, so a real saved profile could be dropped in
unchanged. *Red-team:* the steelman for hand-authoring a fixed ladder of duellists is
that it is the cheapest path to a fight. But it is the `AI_TIERS` mistake again (numbers
that map to no OG value). My pick breaks if the formats turn out to need server-side
fields no payload file carries. Slice 2 measures that first. **Veto:** a hand-authored
duellist ladder, labelled INFERRED.

**R2 — ONE body: port `MCSPlayer` faithfully as a core class; the opponent uses it first,
and the player migrates onto it later (not in this lane).** The alternative (feed the AI's
strokes into the Sim's hand-built player pipeline) keeps one body but the wrong one:
`EnemyPlayer.AI` reads `MCSPlayer` fields the Sim's fighter does not have (`reload`,
`doReload`, `maxreload`, `slashLength`, `canLaunch`, `canAirCombo`, `canStab`,
`hasSlash`, `inputArray`, `slashCommitted`). *Red-team:* the steelman for the Sim's
pipeline is that it avoids two bodies. With my pick, the duel runs two rulebooks (the
Sim's player, the ported opponent) until the player migrates, and that asymmetry is
visible as unfairness. It also depends on the seam growing a damage-in channel (finding
16) and a death-out channel (17) before the port can be shown in a fight. Mitigation:
the port ships behind a flag (default OFF) until slice 8, and slice 8 writes a
divergence ledger listing every rule the two bodies disagree on. **Veto:** no
`MCSPlayer` port; re-author the AI against the Sim's fighter.

**R3 — `doEvade` is ported as it reads.** When the player's slash is under the AI's body
(`isUnderSlash`, level > 3, `rand(3) <= 1`) it tries roll → jump → dash L/R → smokebomb,
only if it HAS those skills, else counter-slashes (`makeSlash`). SESSION13 D8 deleted
`react()` on "zero BLOCKING in the video corpus". Evasion is not blocking, but D8 was
ruled without this function in view. Slice 7 opens a frame sequence of the player
slashing a duellist before shipping it. **Veto:** omit `doEvade` and keep D8.

**R4 — this lane's bar is §5, not SESSION24 §2.** GAUNTLET's L5 row points at A12-A…F,
the PLAYER's combat feel (reach cap, slash-vs-move, gait, impacts). It does not describe
an opponent. A12-F's regression items carry over as OPP-F. **Veto:** grade this lane
against A12.

**R5 — animation clips come from the ANDROID files, in the source's load order.** The
code we port is the Android decompile (`shs3_android_payload`, the claimcheck corpus). It
loads 18 files (`MCSCharacter.as:190-207`). The web payload has the same 18 plus a
web-only spider file, and differs on Ogre (6 clips), Guardian (1) and HumanSpear (+3).
*Red-team:* the web build is v0.717, the Android one v0.682, and the videos are web. But
a clip the ported code never names cannot matter, and a clip whose web duration differs
is a version question for the day a frame shows it. **Veto:** transcribe the web files.

## §3 THE SLICES — cheapest-first, each its own commit, each gated by §4

| # | slice | source in scope (lines) | touches Sim? |
|---|---|---|---|
| **0** | **THE ANIMLIST** — `OG_ANIM_CLIPS` from 1 file to the 18 the source loads | `MCSCharacter.initAnimationData` (42) + 18 data files | no |
| 1 | THE DUELLIST PROFILE — parse + derived stats as a pure record | `XMLNpc` parsers + `initDuelist`; `EnemyPlayer.init` (131); `MCSPlayer.initPlayer/initAttackStats/initElementDefenseStats` (86); `StatsManager.findBonusStatFrom` | no |
| 2 | THE PROFILE SOURCE (R1) | measured at the slice | no |
| 3 | BODY i — stance + movement | `setStance` 103, `nextStance` 44, `canChangeStance`, `initMove` 29, `walkTo`, `stopMoving` 25, `movePlayer` 44, `movement` 21, `moveTo`, `faceScreenCenter`, the reload/damage getters (≈400) | no |
| 4 | BODY ii — the stroke | `gotInput` 70, `initSlash` 100, `checkNextSlash`, `startSlash` 192, `doSlash` 59, `endSlash` 95, `endDownStab`, `makeSlash`, the six `*Target`/`slashDiagonal*` (≈700) | no |
| 5 | BODY iii — the state machine (sub-sliced by state) | `update` 931, `startAction` 671, `doAction` 360 | no |
| 6 | BODY iv — reception | `checkHitObject` 305, `gotHit` 258, the ten reaction overrides (`doLaunched`, `gotLaunched`, `gotKnockDown`, `gotKneeGroin`, `gotBackThrow`, `gotFly`, `gotFlyAway`, `doFly`, `doFlinch`, `endFlinch`), `gotDeathTouch`, `doSubstitutionLog`, `die`, `doPose` (≈820) | no |
| 7 | THE AI | `EnemyPlayer.AI` 204, `doEvade` 56, `isUnderSlash`, `getUsableSkills` 32, `doSkill`, `canUseSkill`, `hasSkill`, `getSkillLevel`, `update`'s cooldown tick; the `SkillManager.startSkill` arms the AI can reach | no |
| 8 | THE SEAM — into the duel behind `?npc=duellist` | findings 16 + 17, a stroke channel; `Sim.ts` + `duel-baseline` by the atomic protocol | **YES** |

**Out of the lane, named so nobody ports them by accident:** `generateSkillList` (583,
the roster NPC's roll: overworld only) · every `controlledBy == 0|2` / `NetworkManager`
path (109 lines in `MCSPlayer`) · `gotNetworkDamage`, `initNetworkPlayer` · `MCSPlayer.AI`
(which `EnemyPlayer` overrides) and `playbackAI` · `performCutsceneAction` · the children
(`EnemyElite`, `FriendlyElite`, `EnemyClone`, `EnemyPlayerGiant`).

**Harness rule for slices 3–6:** functions call across groups. A slice ports its
functions in FULL (no flattening, L4b's rule), and every call into a not-yet-ported group
goes through one named `unported('<AS function>')` that THROWS. A test that reaches
unported code then fails loudly, never silently no-ops. The count of `unported` sites
is pinned and only goes down.

### Slice 0 in detail — THE ANIMLIST (measured 2026-09-23)

**The defect.** `scripts/anim/transcribeAnimClips.py` reads ONE file
(`bindata/108_1t4635s0.bin` = Android `99_MCSCharacter_HumanAnimationData.bin`) and its
header calls it "all 158 clips the payload defines". The source loads **18 files into one
`animList`**, last file wins (`MCSCharacter.as:178-219`): **471 blocks, 466 distinct
clips**, `d=` equal to the frame count in every one. 5 names appear in two files
(`mining`, `walkwithspear`, `spearbowjump`, `spearbowdropdown`, `chargewithspear`), all
with identical `d`/`loop`. **428 of `OG_ANIM`'s 429 names are defined**, and the one
true gap is `flurry_parte`.

**What it costs today — measured.** Each attacker was built on the real `OgAnimLibrary` +
`createDuelWorld()` + `NpcController`, against a still player at 20 / 60 / 90 px, for
1,800 ticks (30 s at 60 Hz). Counts are `startAction` calls:

| class | `startAction(ATTACK)` | calls after the first ATTACK | reading |
|---|---|---|---|
| `EnemyKatana` / `EnemyKnife` / `EnemyArcher` | 72 / 52 / 42 | 142 / 102 / 88 | cycles |
| `EnemyBear` / `EnemyBoar` / `EnemyStag` / `EnemySpearElite` | **1** | **0** | **frozen in ATTACK** |
| `EnemySpear` / `EnemyWolf` / `EnemyWolfAlpha` / `EnemyFox` / `RoomGoblin` / `RoomOgre` | **0** | — | **never attacks** |

Identical at all three distances. So finding 19's INFERRED "may never leave ATTACK" is
CONFIRMED for 4 classes and understated for 6.

**The work.**
1. The transcriber derives the load order FROM `MCSCharacter.as` (the `xmlArray.push(XML(new
   <X>AnimationData()))` lines), reads each `reference/extracted/android/*_MCSCharacter_<X>AnimationData.bin`,
   applies last-write-wins, and FAILS on: a listed file missing, an `*AnimationData.bin`
   on disk that the list does not name, a duplicate whose `d`/`loop` disagree, `d` ≠ frame
   count. Regenerates `src/config/ogAnimClips.ts` (158 → 466).
2. `tests/ogAnimClips.test.ts` byte-checks both directions over the 18 files with its own
   independent parser, which ALSO reads the order from `MCSCharacter.as`, so the order has
   one source (the source) and no second copy.
3. The three "does NOT claim" pins invert: `fly_end`, `getup_front`, `kneegroin_victim`
   are defined. `flurry_parte` becomes the pinned genuine gap, in `tests/ogAnimClips.test.ts`
   and in the `OgAnimLibrary` null test in `tests/duelSeam.test.ts`.
4. A behavioural test from the table above, red today: every one of the 13 attackers
   leaves its first attack state. Its exact assertion is written from the source's own
   `update()` exits for each class, not from whatever the fixed code happens to do.
5. The comments that repeat "158": `duelSeam.ts` (`OgAnimLibrary`), the generated header,
   `tests/ogAnimClips.test.ts`. DIVERGENCES finding 19 closed with the measurement.

## §4 THE SLICE GATE — every slice, binary, output PASTED

1. **Red first:** each new test is shown failing before the change (output pasted).
2. `npx vitest run` green, count ≥ the baseline + the slice's new tests.
3. `npm run -s typecheck` exit 0 · `npm run -s lint` exit 0.
4. `npm run claimcheck`: 0 failures, cites count ≥ baseline (new config values cited).
5. `npm run chaos`: every declared plant RED and restored byte-identical; the pinned
   count moved in BOTH `scripts/gates/chaos.ts` and `tests/chaosGate.test.ts`. A plant
   that stays green is a missing test, never argued away.
6. `npm run instructionpaths` resolves.
7. `RESUME_HERE.md` rewritten and `docs/DIVERGENCES.md` updated **in the same commit**.

**Stop rules.** A gate that cannot go green ends the slice at the last green commit. Two
failed attempts at one problem → stop and escalate with the evidence. A kickoff number the
source contradicts → the source wins, and this file gets an ERRATUM (the last two kickoffs
each lost one).

## §5 THE LANE BAR — L5-OPP is closed only when all seven hold

| | the number | measure |
|---|---|---|
| **OPP-A** | every clip `MCSPlayer` + `EnemyPlayer` name resolves (166/166, 4/4) | slice 0's pin |
| **OPP-B** | the profile parse reproduces the source's derived stats for every fixture, at ±0 | slice 1 byte-style suite |
| **OPP-C** | every in-scope AS3 function has a TS twin named in a tree test; `unported` count = 0 | tree test |
| **OPP-D** | the AI port's source quirks pinned (the dead very-close list; boss has no skills; the level-≤3 skip-1-in-5) | slice 7 |
| **OPP-E** | behind `?npc=duellist`: the duellist strikes by STROKES, takes hits (16), dies (17); `duel-baseline` untouched while the flag defaults OFF | slice 8 probe |
| **OPP-F** | nothing regressed: suite ≥ baseline · claimcheck 0 · chaos all red/restored · typecheck/lint 0 · floors untouched | the existing gates |
| **OPP-G** | a LOOK: Kheshav plays `?npc=duellist` beside a video frame of a Duel Mode fight | owner |

**⛔ NOT-DONE — the cut line.** The player migrating onto the ported body · the 13
remaining L4b mobs (slice 0 unblocks them; it does not port them) · the overworld ·
`AI_TIERS`' deletion (only after OPP-G).

## §6 WHAT WILL FIGHT YOU — my own suspects

- **`MCSPlayer.update` is 931 lines and `startAction` 671.** Slice 5 will need
  sub-slicing by state, and the first cut is a guess until someone reads them line by line.
- **29 `StatsManager.` references in `MCSPlayer`** (the player's globals). For an
  opponent each must come from the profile instead. Expect a `PlayerWorld` the size of
  `NpcWorld` (17 members) or bigger.
- **`Math.random()` is everywhere in `EnemyPlayer.AI`.** Inject `rng` as L4b did; the
  sequence is not the source's to preserve (it was never seeded).
- **The survey's per-class clip check reads names only on lines containing `startAnim` /
  `.animation`.** A clip reached through a variable would be missed, so "0 missing" is a
  lower bound on what is named.
- **R5 could be wrong for the videos.** If a frame ever shows a web-only clip (the spider,
  `spear_flourish`), R5 is revisited, not patched.

## §7 THE BASELINE TO CONFIRM FIRST (at `36314d9`)

```
$ npx vitest run            ->  Test Files 86 passed (86) · Tests 1673 passed (1673)
$ npm run -s typecheck      ->  exit 0          $ npm run -s lint  ->  exit 0
$ npm run claimcheck        ->  1716 cites · 421 values at ±0 · 44 context · 0 failures
$ npm run instructionpaths  ->  38 path tokens, all resolve
$ npm run chaos             ->  49/49 plants RED · 49/49 restored byte-identical · exit 0
```

## §8 BAR SELF-REPORT (the session that wrote it)

**Bar: reached for slice 0; NOT reached for slices 2–8, and that is honest, not a gap.**
Every number in §1–§3 is a command run on 2026-09-23 with its output quoted, and slice 0
has an exact defect, an exact measured cost, an exact work list and a binary gate. Slices
1–8 carry measured SCOPE (functions and line counts per file), but their tests cannot be
written until each slice reads its functions line by line. §3's line counts are the
promise; the per-slice gates are §4's generic ones. What this kickoff does NOT promise:
that R2's two-rulebook transition is short, that slice 5's sub-slicing is right, or that
R1 has an answer the payload can supply.
