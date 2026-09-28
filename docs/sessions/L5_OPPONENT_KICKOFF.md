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

> **⛔ ERRATUM (slice 0, 2026-09-23 — the source wins, said here, not buried).** §3's
> slice-0 table said "4 frozen in ATTACK, 6 never attack". **Measured correctly, 7 froze**
> (bear, boar, stag, wolf, alpha, fox, spear elite: 1 swing, then no state change for 30 s)
> and **3 never attack on either table** (spear, goblin, ogre), which is their own behaviour,
> not a clip. The kickoff's probe called `init` before `setPosition`, the reverse of
> `NPCManager.as:636-637`, and spawned three animals mid-air. Numbers and the source trait
> this exposed: `docs/DIVERGENCES.md`, "L5-OPP SLICE 0 — THE ANIMLIST".
> **⛔ Second correction, from the gauntlet review below:** it was **10**, not 7. The spear,
> goblin and ogre froze too, once built as the variants that fight (a stabber spear, a chasing
> goblin and ogre).

> **⛔ ERRATUM 2 — THE GAUNTLET REVIEW (2026-09-23, four read-only reviewers vs the source;
> reports verified in the parent loop). Where this block and the text below disagree, THIS
> BLOCK WINS.**
> 1. **Clip durations include `AnimData`'s holds** (`AnimData.as:12-135`: +2 to +50 on 58
>    names). The katana's attack is 18 frames = 750 ms, not 10. Fixed in slice 0's table.
> 2. **§1 "never a roster row" is true for the Duel Mode MENU only.** Overworld and quest
>    duels (`Obj_NPCAggro.as:191`, quest steps with action 6) clone a roster row and keep its
>    `ai`, and the source expects it (`NPCManager.as:643` tests `isDuelMode() && xml.ai == 0`).
>    `proceedWithAI` also runs when `!useCirrus`, `lastPing >= 300`, the local player is level
>    ≤ 1 or `stratusID` is empty (`DuelModeUI.as:332-349`), not only on offline or timeout.
> 3. **R3 misquoted D8.** D8's measured negative is "zero blocks, parries **or dodges**"
>    (`DIVERGENCES.md:492`, `COMBAT_MEASUREMENTS.md:157`), and two tests pin it:
>    `tests/AISeamController.test.ts` ("the enemy never blocks or dodges in the original") and
>    `tests/Sim.test.ts` ("A PLANTED BLOCK/DODGE CHANGES NOTHING"). The distinction that holds:
>    D8's corpus was ~30 MOBS, and mobs have no `doEvade`. Slice 7 must re-scope both tests to
>    mobs before porting it. And `doEvade`'s fallback `makeSlash` is not a counter: it starts
>    at its own body, a random 60° up-diagonal or horizontal AWAY from the target
>    (`EnemyPlayer.as:1250-1278`).
> 4. **Slice 3 is missing `MCSPlayer.initSpecialSkills`** (71 lines, `MCSPlayer.as:3127`,
>    called by `setStance` at `:3115`). It sets `canLaunch` / `canAirCombo` / `canStab`, so
>    without it slice 3 throws `unported()` on the duellist's first `setStance`. Also
>    unslotted: `lineArrayDeepCopy` (slice 4), `useChi`, `setChi`/`getChi`, `cancelStealth`,
>    `cancelLogSub`, `setAutoSlash`, `cleanUpPlayer`, `redFreeze`, `setIsFriendly`,
>    `disposeMCS`. And the Sim's INFERRED `LAUNCH_UNLOCK_LEVEL.heavy = 5` contradicts the
>    source's AI branch, heavy launch at **3** (`MCSPlayer.as:3182`).
> 5. **"Out of the lane: the 109 network lines" is the wrong cut.** 73 of the 109 are
>    `controlledBy == 0`, the LOCAL HUMAN (not network), and some the AI itself runs (its own
>    dispatch at `MCSPlayer.as:1149-1151`, `:1230`, `:3129`). Out of the lane are the
>    BRANCHES the opponent never enters, not the lines a regex matches.
> 6. **OPP-D "boss has no skills" is half true:** `init` empties them, `setLevel` re-rolls
>    them through `generateSkillList` with no boss guard whenever the wave carries a `<lvl>`
>    (e.g. npc 46 at lvl 15). Duel Mode is unaffected. Pin both halves. Also pin: the
>    duellist's ChiPunch/ChiKick projectile reads the HUMAN's skill level
>    (`MCSPlayer.as:1783`, `:1795`), and 5 skills can never be picked through
>    `getUsableSkills` (BACKTHROW, CHIKICK, CHIPUNCH, DEATHTOUCH, SPIRITTHIEF).
> 7. **R2 overstated its evidence by one field:** the Sim DOES have a `slashLength` twin
>    (`reachFor`, `src/core/mastery.ts`; `synthesizeStrokePoints` reproduces `makeSlash`'s
>    `slashLength / 20`). The other nine fields have none, so R2 stands.
> 8. **NEW RULING R6 (it replaces R5's premise): the ANDROID code is the structure; the WEB
>    build's numbers win.** R5 assumed the builds differ only in clips. They also differ in
>    the combat numbers slices 1, 3, 4 and 7 port: reach (Android ×1.5 / 0.005m / 0.005m vs
>    web ×1.4 / 0.02m / 0.04m), damage and crit (Android heavy ×1.5, crit ×1.2/×1.5 vs web ×1.4,
>    crit ×1.3 flat), the duellist's low-level scaling (×0.8 vs ×0.9), the AI's wander margins
>    (50 vs 100). **The Sim already runs on the web numbers** (`src/config/reach.ts`,
>    `CRIT_MULT = 1.3`) and the videos ARE the web build. So: port the Android code (readable,
>    the claimcheck corpus) for STRUCTURE and names; diff every numeric literal of each
>    ported function against its web twin (web `MCSPlayer` = `§1t99s0§.as`, web
>    `EnemyPlayer` = `§1t122s0§.as`, in `reference/decompiled/shs3_payload/scripts/`); on a
>    mismatch the WEB value ships, as one DIVERGENCES row with both cites; a branch that
>    exists in only one build is flagged and ruled per case, never merged silently. Clips
>    stay Android (they must match the code that names them). **Slice 1's first job:**
>    measure whether claimcheck can check a web cite (it honours a cite carrying its own
>    `reference/…` path, but the obfuscated `§…§` names are untested); if not, extend it
>    before the first web number lands. *Red-team:* the steelman for Android-only is one
>    internally consistent build that claimcheck already guards; mixing risks shipping a
>    combination neither build had. Mitigation: structure is never mixed, only literals, each
>    one recorded. **Veto:** Android numbers throughout, every web difference a DIVERGENCES row.

> **⛔ ERRATUM 3 — SLICE 1a (2026-09-28, a build-loop cycle; measured against both builds).
> Where this block and the text below disagree, THIS BLOCK WINS.**
> 1. **R6's "structure is never mixed, only literals" fails at slice 1.** The parse functions
>    agree or differ by a web-only branch, but the DERIVED stats differ in STRUCTURE:
>    web `findBonusStatFrom` also skips the hair slot and never adds the item table's
>    modifiers; web `initDuelist` adds a `stance` argument, ×1.5 buff branches and a two-mode
>    halving test. Each changes a number the fight uses, so slice 1 is split: **1a (the parse)
>    landed; 1b (the derived stats) rules those branches first.** Evidence:
>    `docs/DIVERGENCES.md`, "L5-OPP SLICE 1a".
> 2. **"Extend claimcheck before the first web number lands" is not needed.** Measured: a
>    full-path web cite (`reference/decompiled/shs3_payload/scripts/§…§.as:<line>`) is checked
>    at ±0 as it stands, and went red on a real miss the first time it ran.
> 3. **§3's slice-1 source list was short:** the parse also reaches `Item.parseNoQty`
>    (`Item.as:106-163`, with `isClanInvitation` and `setCreator`) and `IntStat.parse`, and the
>    Android parse reaches `ItemGenerator.getModMax` (its modifier cap), which the web build
>    does not have.

> **⛔ ERRATUM 4 — SLICE 1b-i (2026-09-28, a build-loop cycle; measured against both builds).
> Where this block and the text below disagree, THIS BLOCK WINS.**
> 1. **ERRATUM 3's "web `findBonusStatFrom` never adds the table's modifiers" is wrong.** It
>    reads them through the web `Item.getModifiers` (`§1t17s0§.as:1643-1731`), which appends
>    the row's `modifierXML`. The web-only rule is inside that getter: an own attack on armour or
>    a hat, or an own defense on a ring, becomes max-HP (merged into the last own HP modifier and
>    capped at 173, or pushed uncapped; a pool at or below zero is dropped). Ruled web.
> 2. **The halving test is not ported:** the Sim has no PvP room and no war room. (In the original,
>    `initDuelist` runs before action 6 is set, so a Duel Mode fight started from inside a PvP room
>    is halved.)
> 3. **One path is refused, not guessed:** a table modifier merging into an own modifier of the
>    same id (`§1t17s0§.as:1717`) adds an XMLList to an int with no `int()`, which AVM2
>    concatenates. The port throws `UNMEASURED` there.
> 4. **Slice 1b is split:** 1b-i (the rulings + `initDuelist`'s record + `findBonusStatFrom`)
>    landed; **1b-ii** is `EnemyPlayer.init` + `MCSPlayer.initPlayer/initAttackStats/initElementDefenseStats`
>    on top of it, plus the web-only `stance` argument. OPP-B closes at 1b-ii.
> Evidence and red-teams: `docs/DIVERGENCES.md`, "L5-OPP SLICE 1b-i".

> **⛔ ERRATUM 5 — SLICE 1b-ii (2026-09-29, a build-loop cycle; measured against both builds).
> Where this block and the text below disagree, THIS BLOCK WINS.**
> 1. **1b-ii landed; OPP-B holds** for three fixture profiles (`tests/duellistBody.test.ts`), with
>    ONE deferral: `init`'s skill cooldown table goes to **slice 7**. `getCooldown` scales by the
>    LOCAL player's speed (`StatsManager.getSkillCooldownModifier`), and the builds cap that speed
>    at 300 (Android) vs 600 (web). Only the AI reads the table.
> 2. **The starting points held:** critical and piercing are dropped (and `XMLNpc`'s copies are
>    read by nothing, in both trees); `§1t3489s0§` is `setStance`; the masteries are 1000–1002 and
>    1500 / 1501 pick reversed / dual.
> 3. **Two more web numbers won:** `maxreload` 8 s (Android 5 s), and the level scaling (web: ×1.1
>    only for levels 31–79, ×0.9 below 10; Android: ×1.1 above 30, ×0.8 below 10).
> 4. **Measured for slice 2 (R1):** the payload holds NO saved duellist profile. Every
>    `initDuelist` caller takes its strings from Player.IO objects or from the local player
>    (`DuelModeUI.as:410`, `WarHexUI.as:1412`, `:1522`, `QueryManagerPIO.as:2458` for the `bot_`
>    names). The source DOES contain the writer of the exact three formats:
>    `StatsManager.getBattleStatsString` / `getEquipmentString` / `getSkillStatsString`
>    (`StatsManager.as:4396`, `:4417`, `:4447`), which is what the local player saves and another
>    player's duel reads. So R1's "a real saved profile could be dropped in unchanged" holds by
>    construction; what slice 2 must decide is what STATE feeds those writers.
> Evidence: `docs/DIVERGENCES.md`, "L5-OPP SLICE 1b-ii".

> **⛔ ERRATUM 6 — SLICE 2 (2026-09-29, a build-loop cycle; measured against both builds).
> Where this block and the text below disagree, THIS BLOCK WINS.**
> 1. **Slice 2 landed:** `core/npc/duellistWriter.ts` ports the three writers and
>    `Item.toStringNoQty`, web structure where it differs: the battle string is **18 fields**
>    (the web writer appends the weapon row's damage and slash cost and the total defense), the
>    eq and skill strings end in `^` + a checksum, and a creator-only item keeps its comma
>    (Android's parses back as item 0). For three states the round trip reaches the body at ±0.
> 2. **R1 is ruled:** the Sim's duellist state is `StatsManager.initNewPlayer`'s
>    (`newPlayerState()`, CONTRACT, the same in both builds on every carried field) until the
>    human carries `StatsManager`'s fields; then the MIRROR. Anything else is INFERRED per value.
>    Measured behind it: the original's opponents are other players' saves from the player's own
>    level up (`QueryManagerPIO.as:1498-1531`), and offline there is NO duellist (`:1503-1506`).
>    Veto on record: a video-measured profile (level + gear off frames) for slice 8.
> 3. **Slices 3–7 have a CONTRACT fixture now:** `newPlayerState()` through the writers is a real
>    level-1 profile. Use it before hand-typing strings.
> 4. **A gate blind spot:** claimcheck never reads a number inside a bare array literal. Five
>    arrays in `ogDuellistProfile.ts` are unchecked (DIVERGENCES "L5-OPP SLICE 2"). Write new
>    config numbers as `key: value`.
> Evidence and red-teams: `docs/DIVERGENCES.md`, "L5-OPP SLICE 2".

> **⛔ ERRATUM 7 — SLICE 3a (2026-09-29, a build-loop cycle; measured against both builds).
> Where this block and the text below disagree, THIS BLOCK WINS.**
> 1. **Slice 3 is split: 3a (the stance) landed; 3b is the movement.** Not for size (~410 lines),
>    but because every function differs between the builds in structure, and four of §3's
>    names are never reached by the opponent.
> 2. **Out of the lane, by caller:** `nextStance` (only the human's UI calls it: `BattleUI.as:364`,
>    `InputManager.as:601`), the web-only `canChangeStance && reload >= 48`, `walkTo` (network
>    players and the human only: `NPCManager.as:1025`, `StageManager.as:593`) and
>    `faceScreenCenter` (the human only: `GameEngine.as:1049`). Done criterion (b)'s "nextStance"
>    is void.
> 3. **3b's real list:** `initMove` (`EnemyPlayer.gotInput`, `:985`), `movement` (`update`),
>    `movePlayer` (whose AI branch is one `movePositionX`), `moveTo` (the AI's six calls; it
>    calls `gotInput`, slice 4, so it goes through `unported`).
> 4. **`StageManager.isBattle()` is NOT always true in a duel:** `initDuel` sets `STATE_PEACEFUL`
>    (`StageManager.as:231`) and only the third second, with a latency, flips it
>    (`:865-873`). The body reads it through `PlayerWorld.battle`.
> 5. **Claimcheck had a fourth false-pass hole:** the digits inside an obfuscated web name
>    (`§1t4414s0§`) vouched for any value of 0 or 1. Closed; 0 new failures when closed.
> Evidence and red-teams: `docs/DIVERGENCES.md`, "L5-OPP SLICE 3a".

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

**R5 — animation clips come from the ANDROID files, in the source's load order.** (⚠️ Its
premise that the builds differ only in clips is wrong: see ERRATUM 2 item 8, ruling R6.) The
code we port is the Android decompile (`shs3_android_payload`, the claimcheck corpus). It
loads 18 files (`MCSCharacter.as:190-207`). The web payload has the same 18 plus a
web-only spider file, and differs on Ogre (6 clips), Guardian (1) and HumanSpear (+3).
*Red-team:* the web build is v0.717, the Android one v0.682, and the videos are web. But
a clip the ported code never names cannot matter, and a clip whose web duration differs
is a version question for the day a frame shows it. **Veto:** transcribe the web files.

## §3 THE SLICES — cheapest-first, each its own commit, each gated by §4

| # | slice | source in scope (lines) | touches Sim? |
|---|---|---|---|
| **0** | **THE ANIMLIST** — `OG_ANIM_CLIPS` from 1 file to the 18 the source loads · ✅ **LANDED 2026-09-23** (DIVERGENCES "L5-OPP SLICE 0") | `MCSCharacter.initAnimationData` (42) + 18 data files | no |
| **1a** | **THE PROFILE STRINGS** — the parse · ✅ **LANDED 2026-09-28** (DIVERGENCES "L5-OPP SLICE 1a") | `XMLNpc` parsers + `getMastery`, `Item.parseNoQty`, `IntStat.parse` | no |
| **1b-i** | THE DERIVED STATS i — the rulings, `initDuelist`'s record, `findBonusStatFrom` · ✅ **LANDED 2026-09-28** (DIVERGENCES "L5-OPP SLICE 1b-i") | `initDuelist`'s arithmetic (`XMLNpc.as:290-401`); `StatsManager.findBonusStatFrom` (41); web `Item.getModifiers` (89) | no |
| **1b-ii** | THE DERIVED STATS ii — the body on the record · ✅ **LANDED 2026-09-29** (DIVERGENCES "L5-OPP SLICE 1b-ii"; the cooldown table deferred to slice 7) | `EnemyPlayer.init` (131); `MCSPlayer.initPlayer/initAttackStats/initElementDefenseStats` (86) | no |
| **2** | **THE PROFILE SOURCE (R1)** — the writers + the ruling · ✅ **LANDED 2026-09-29** (DIVERGENCES "L5-OPP SLICE 2") | `StatsManager.getBattleStatsString/getEquipmentString/getSkillStatsString`, `Item.toStringNoQty`, `initNewPlayer` | no |
| **3a** | **BODY i — THE STANCE** · ✅ **LANDED 2026-09-29** (DIVERGENCES "L5-OPP SLICE 3a"; `nextStance`, `walkTo`, `faceScreenCenter` ruled out of the lane, ERRATUM 7) | `setStance` 103, `initSpecialSkills` 71 (AI branch), `canChangeStance`, `stopMoving` 25, `getDamage` 28, `getBaseDamage` | no |
| 3b | BODY i — the movement | `initMove` 29, `movement` 21, `movePlayer` 44 (AI branch), `moveTo` 7 | no |
| 4 | BODY ii — the stroke | `gotInput` 70, `initSlash` 100, `checkNextSlash`, `startSlash` 192, `doSlash` 59, `endSlash` 95, `endDownStab`, `makeSlash`, the six `*Target`/`slashDiagonal*` (≈700) | no |
| 5 | BODY iii — the state machine (sub-sliced by state) | `update` 931, `startAction` 671, `doAction` 360 | no |
| 6 | BODY iv — reception | `checkHitObject` 305, `gotHit` 258, the ten reaction overrides (`doLaunched`, `gotLaunched`, `gotKnockDown`, `gotKneeGroin`, `gotBackThrow`, `gotFly`, `gotFlyAway`, `doFly`, `doFlinch`, `endFlinch`), `gotDeathTouch`, `doSubstitutionLog`, `die`, `doPose` (≈820) | no |
| 7 | THE AI | `EnemyPlayer.AI` 204, `doEvade` 56, `isUnderSlash`, `getUsableSkills` 32, `doSkill`, `canUseSkill`, `hasSkill`, `getSkillLevel`, `update`'s cooldown tick, `init`'s cooldown table (deferred from 1b-ii, ERRATUM 5); the `SkillManager.startSkill` arms the AI can reach | no |
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

### Slice 1b in detail — THE DERIVED STATS (measured 2026-09-28; steps 1–2 LANDED as 1b-i, step 3 is 1b-ii)

**Already landed (1a):** `core/npc/duellistProfile.ts` turns the three strings into a stats
vector, an equipment vector and a skill list; `config/ogDuellistProfile.ts` holds the stat and
modifier ids with Android AND web cites, both checked by claimcheck at ±0.

**The work, in order:**
1. **Rule the structural branches first**, each as one DIVERGENCES row with both cites, a
   red-team and a veto, before any code:
   - `findBonusStatFrom`: Android `StatsManager.as:2029-2070` vs web
     `§1t1523s0§.as:2464-2506`. The web also skips hair (slot 2) and never adds
     `itemXML.modifierXML`. **Default: web**, because the result is a number the fight uses.
     Measure first how many of the 93 items that carry table modifiers can sit in a slot the
     sum reads (the `type` field in `ogItems.ts`): if none can, the difference is moot, and
     the ruling should say so.
   - `initDuelist`'s buff branches (web `§1t76s0§.as:340` on): attack or defense ×1.5 while
     `buffExpiry` is past the server clock. **Default: port them with the clock injected** as
     an argument (core has no `Date.now()`), and a fixture with no live buff.
   - The halving test: Android `GameEngine.isPvPRoomMode()`, web two modes OR'd. Measure
     whether Duel Mode is either mode before porting; if not, record it as not reached.
2. **Port `initDuelist`'s arithmetic** into a pure record: hp, chi, attack, defense, speed
   with their equipment bonuses; the elemental attacks; **the elemental DEFENCES, each read
   from ANOTHER element's attack in both builds** (`FIREDEF = stats[WATERATK]`,
   `WINDDEF = stats[EARTHATK]`, `WATERDEF = stats[WINDATK]`, `EARTHDEF = stats[FIREATK]`,
   `XMLNpc.as:334-337`). The roster constructor pairs them the same way (`:197`, `:207`), so
   it reads as the elemental-counter design, not a typo: pin it, never "fix" it. Crit and
   piercing come from equipment only; the weapon's `minDamage`, `damageRange` and
   `slashUsage` with its floor of 48 (`:341-364`), resolved through
   `ogItems.ts`; the defaults (`DEFAULT_EQSTRING`, the all-zero stats string, item 13001 for
   an empty weapon slot).
3. **Port `EnemyPlayer.init` and `MCSPlayer.initPlayer/initAttackStats/initElementDefenseStats`**
   on top of the record, each diffed against its web twin (`§1t122s0§.as`, `§1t99s0§.as`),
   literals cited in both builds like 1a.
4. **Gate:** OPP-B holds when every fixture profile's derived record matches the source at ±0.
   Write at least three fixtures: the defaults, a mid-level profile wearing items with
   modifiers, and one that exercises every web-only branch you ported.

**Out of 1b:** the `bot_` name generator (a display name, no stat), the paperdoll's colour tags
(render-side), and the network fields (`nid`, `controlledBy`).

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
| **OPP-D** | the AI port's source quirks pinned (the dead very-close list and its 5 unreachable skills; a boss's skills emptied by `init` and re-rolled by `setLevel`; the level-≤3 skip-1-in-5; ChiPunch/ChiKick reading the human's level) | slice 7 |
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

## §7 THE BASELINE TO CONFIRM FIRST (at `36314d9`, before slice 0)

> ⚠️ Each landed slice moves these numbers; the CURRENT baseline is the "THE GATES, AS THEY
> STAND" block in `RESUME_HERE.md`. After slice 0 and its review: 87 files / 1683 tests, chaos 53/53.

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
