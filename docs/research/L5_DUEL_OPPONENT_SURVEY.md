# L5 — THE REAL DUEL OPPONENT: SURVEY (read-only, 2026-09-23)

> Phase 1 of the double session in `RESUME_HERE.md`. Every number below was measured
> this session against `reference/decompiled/shs3_android_payload/scripts/` (the
> claimcheck corpus) and `reference/extracted/`; the scripts that measured them are
> described inline so the next reader can re-run them. No source was changed.

> **⛔ CORRECTIONS — the gauntlet review, 2026-09-23.** Four read-only reviewers checked this
> survey against the source (every AS3 fact below held; eight statements did not). The
> corrections live in ONE place, `docs/sessions/L5_OPPONENT_KICKOFF.md` ERRATUM 2, so they
> cannot drift. In this file these are wrong as written:
> §1 "never a roster row" is Duel-Mode-MENU only (item 2) · §2 fact 1's cite is the function
> header; the two `if`s are `EnemyPlayer.as:1389` / `:1393`, and 5 skills are unreachable (item
> 6) · §2 fact 2: D8 DID cover dodges, and `makeSlash` is not a counter (item 3) · §2 fact 3: a
> boss's skills are re-rolled by `setLevel` (item 6) · §2 "109 lines … network-only": 73 are the
> local human (item 5) · §4: clip durations include `AnimData`'s holds (item 1), and the
> web/Android clip diff is larger (`DIVERGENCES.md`, slice 0) · §5: the Sim DOES have a
> `slashLength` twin (item 7). **And the
> survey missed that the two builds differ in combat NUMBERS** (reach, damage, crit, scaling),
> which is ruling R6 (item 8).

## 1. THE QUESTION THE SESSION HAD TO SETTLE FIRST — does single-player Duels use `EnemyPlayer`?

**YES, on every duel path. Measured.**

| path | trace | class |
|---|---|---|
| **Duel Mode (the menu)** | `DuelModeUI.startDuel` → server `getOpponentData` → `gotOpponentData`: the opponent is offline, or a live challenge times out (`update`, `duelCounter` reaches 0) → `proceedWithAI()` sets `controlledBy = 1` → `proceedWithDuel` → `XMLNpc.initDuelist` sets **`this.ai = 0`** (`XMLNpc.as:315`) → `NPCManager.createNPC` `case 0` | **`new EnemyPlayer(mcs, isDuelist=true, isBoss=false)`** (`NPCManager.as:519`) |
| overworld / quest duels (`Obj_NPCAggro` action 6, questID −2; `Obj_NPCCivilian`, `Obj_NPCProcGen`) | `QuestEngine.putInDuelistHolder(npcid, …)` clones a ROSTER row and keeps its `ai` | row 18 "Bandit Leader" is `ai 14` → `EnemyPlayer(…, false, true)` (a boss) |

**⚠️ A correction to the premise that sent us here.** RESUME_HERE justified the lane
with "`ai` 9 → 73 rows and `ai` 14 → 15 rows, 88 of 495". That count does not bear on
Duel Mode: **the Duel Mode opponent is never a roster row.** It is another player's
saved profile (`stats` / `equipment` / `skills` strings, `XMLNpc.initDuelist`)
fetched from the Player.IO server, which is dead. The conclusion stands, and on
stronger ground (the opponent is `EnemyPlayer` on 100% of Duel Mode fights, not
18% of the roster). But it creates an input problem L5 must rule on: **offline,
where does a duellist's profile come from?** (§6, R1.)

The roster's `EnemyPlayer` family, for the overworld: `ai` 9 (73 rows) · 14 (15) ·
29 `EnemyElite` (10) · 30 `FriendlyElite` (8) = **106 of 495**; `ai` 15
`EnemyPlayerGiant` has 0 rows. (`EnemySpearElite` extends `NPC`, not `EnemyPlayer`.)

## 2. WHAT THE CLASSES ARE

`EnemyPlayer extends MCSPlayer extends NPC extends MCSActor`. **`MCSPlayer` is the
human player's own class** (`StatsManager.getPlayer()` returns one): the duel opponent
is a full player body with an AI on top.

| file | functions | overrides | lines in functions | biggest |
|---|---|---|---|---|
| `MCSPlayer.as` (4,775) | **90** | 20 of `NPC`'s | 4,623 | `update` 931 · `startAction` 671 · `doAction` 360 · `checkHitObject` 305 · `gotHit` 258 · `startSlash` 192 · `gotNetworkDamage` 157 · `AI` 139 · `setStance` 103 · `initSlash` 100 · `endSlash` 95 |
| `EnemyPlayer.as` (1,647) | **25** | 14 (9 of `MCSPlayer`'s, 5 of `NPC`'s) | 1,608 | `generateSkillList` 583 · `AI` 204 · `gotNetworkDamage` 166 · `init` 131 · `setLevel` 100 · `doEvade` 56 |

(Inventory: a function-header regex over both files, lengths to the next header.)
`MCSPlayer` has **109 lines** touching `NetworkManager` / `isP2P` / `controlledBy == 0|2`,
which are network-only paths: droppable, but each drop gets a named test.

### How the AI drives the body — the OG's own seam

`EnemyPlayer.AI()` (`EnemyPlayer.as:990`) never deals damage itself. It calls the
**same stroke machinery the player's mouse feeds**: `slashTarget`, `launchTarget`,
`slashDownedTarget`, `stabTarget`, `makeSlash` (all `MCSPlayer`), `moveTo`, and
`doSkill` → `SkillManager.startSkill`. `gotInput(lineArray, isLine)`
(`EnemyPlayer.as:958`) is the network twin of the same entry. So in the original,
**one body implementation serves both fighters**, and the opponent differs only in
where its strokes come from.

### Four source facts the port must keep (each will be a pinned test)

1. **`getUsableSkills` never returns the very-close list.** `if (distsq < 40000) list =
   veryClose; if (distsq < 90000) list = close;`: the missing `else` means the second
   `if` always overwrites the first (`EnemyPlayer.as:1384`). Port it as it reads.
2. **`doEvade` exists and contradicts nothing measured.** When the player's slash is on
   screen and under the AI's body (`isUnderSlash`, level > 3, `rand(3) <= 1`), it tries
   roll → jump → dash L/R → smokebomb (only the skills it HAS), else a counter
   `makeSlash`. SESSION13 D8 deleted `react()` on "zero BLOCKING in the corpus": evasion
   is not blocking, but the ruling was made without this function in view. **R3.**
3. **The duellist's skills come from its profile** (`init`: `skillList = xml.skillList`),
   not `generateSkillList`, which is the roster NPC's random roll seeded by overworld
   node × server date (`EnemyPlayer.as:157`). A boss gets NO skills (`init`, `isBoss`
   branch).
4. **Level scaling at `init`, AI-controlled only** (`controlledBy == 1`): boss >70 ×1.25,
   boss >50 ×1.2, >30 ×1.1, <10 ×0.8 on `minDamage` and `maxhp`. `baseReload = 48 +
   speed·6`; `baseSlashLength = 120 + floor(90·speed/(20+speed))`.

## 3. WHAT ALREADY EXISTS, AND WHAT DOES NOT

| needed by the opponent | in the repo? |
|---|---|
| `NPC` / `MCSActor` base | ✅ `src/core/npc/Npc.ts`, `MCSActor.ts` (L4b slice 0) |
| skill DATA (`XMLSkill`, cooldowns) | ✅ `OG_SKILLS` (`src/config/ogSkills.ts`, L2) |
| item DATA (`findBonusStatFrom` reads it) | ✅ `OG_ITEMS` (`src/config/ogItems.ts`, L3) |
| roster | ✅ `OG_NPCS` (`src/config/ogNpcs.ts`, L4a), not needed for Duel Mode (§1) |
| the duel placement (650/150, `BOW2`) | ✅ `OG_AI_DUEL_PLACEMENT` (L4a) |
| **animation clip table** | ⚠️ **158 of the 466 the source loads** (§4) |
| `SkillManager.startSkill` (710-line file) | ❌ 0 references in `src/` |
| `MCSPlayer` (the body) | ❌ ported nowhere; the Sim's player is hand-built (§5) |
| the profile parse (`initDuelist`, `parse*String`, `getMastery`) | ❌ |
| a profile SOURCE | ❌ the server is dead (§6 R1) |

## 4. CLIP COVERAGE — AND FINDING 19 IS NOT WHAT IT SAID

**Finding 19 ("10 of 13 attackers name an attack clip `OG_ANIM_CLIPS` does not
define") is FALSIFIED as "absent art". It is a transcription gap.**

- The source loads **18 animation files into ONE global `animList`**, keyed by clip
  name, in a fixed order (`MCSCharacter.initAnimationData`, `MCSCharacter.as:178-219`).
- `scripts/anim/transcribeAnimClips.py` reads **one** of them (`bindata/108_1t4635s0.bin`
  = Android `99_MCSCharacter_HumanAnimationData.bin`, 158 clips) and its header calls
  that "all 158 clips the payload defines".
- The 18 Android files, in load order: **471 `<anim>` blocks, 466 distinct names**,
  every one with `d=` equal to its frame count. 5 names appear in two files (`mining`,
  `walkwithspear`, `spearbowjump`, `spearbowdropdown`, `chargewithspear`), all with
  identical `d`/`loop`, so the last-file-wins rule changes no value.
- **428 of `OG_ANIM`'s 429 names are defined.** The one genuine source-side gap is
  `FLURRY_PARTE = 'flurry_parte'`.
- Per class, names used in an animation context vs defined anywhere: `MCSPlayer` 166/166
  (**127 missing from today's table**, including every stance idle and every slash
  part), `EnemyPlayer` 4/4, and **all 13 remaining L4b mobs 0 missing**. The katana's
  "3 undefined reaction clips" (`fly_end`, `getup_front`, `kneegroin_victim`) are also
  defined.
- The WEB payload has 19 files: the same 18 plus a web-only **spider** file (`114`,
  10 clips) the Android load list does not name. Web and Android differ on Ogre (6
  clips), Guardian (1) and HumanSpear (+3 web-only). Today's 158 match Android Human
  exactly, so switching the transcriber to the Android files changes none of them.

**So finding 19 blocks the duel opponent after all**, contrary to RESUME_HERE's "it does
not block the duel opponent": `MCSPlayer.update` and `startAction` switch on which
clip finished, and 127 of its 166 clips are no-ops today.

## 5. OVERLAP WITH WHAT THE SIM ALREADY DOES FOR THE PLAYER

The Sim (`src/core/Sim.ts`, 1,236 lines) is a hand-built player body: `applyStroke`
(`DrawnStroke` → slash), stances + Focus, jump, Shunpo, Chi, kunai, i-frames,
`core/damage.ts`. The opponent gets `executeStrike` (a direct hit on an intent, no
stroke) through `OpponentController`, whose intents are `moveX`, `strike`,
`throwKunai`, `switchStance`, `telegraph`. `synthesizeStrokePoints` already builds a
stroke for the player's auto-slash.

**The architectural fork (R2).** The original has ONE body for both fighters. Porting
`MCSPlayer` for the opponent only, behind `NpcController`, gives this repo **two player
bodies**, the Sim's hand-built one and the port, which is the "two copies of one rule"
failure this account has been bitten by. The alternative is to let the opponent's AI
emit STROKES that the Sim's existing pipeline resolves for the enemy fighter, which
mirrors the OG's structure but keeps the hand-built body's divergences on both sides.

## 6. RULINGS THE KICKOFF MUST MAKE (decide-and-flag; recorded there)

- **R1 — profile source.** No server. Candidate: a committed, generated table of
  duellist profiles built from the payload's own string formats (the `DEFAULT_EQSTRING`
  fallback, `NameGenerator.getSentryBotName`'s bots).
- **R2 — one body or two** (§5).
- **R3 — `doEvade` vs SESSION13 D8** (§2 fact 2).
- **R4 — the L5 bar.** GAUNTLET's L5 row points at SESSION24 §2 (A12-A…F: reach cap,
  slash-vs-move, gait, impacts). That is the PLAYER's combat feel, not the opponent;
  RESUME_HERE's "the L5 bar in SESSION24 §2" was a mis-pointer. The opponent needs its
  own bar; A12-F's regression items carry over.

## 7. WHAT THIS SURVEY DID NOT DO

It did not read `MCSPlayer.update` / `startAction` line by line (1,602 lines together),
`SkillManager.as`, or the `XMLNpc` parsers beyond their headers. It did not open a video
frame: nothing here is a visual claim. The per-class clip check reads names in lines
containing `startAnim` / `.animation`; a clip named only through a variable would be
missed, so its "0 missing" is a lower bound on what is named, not a proof that all are.
