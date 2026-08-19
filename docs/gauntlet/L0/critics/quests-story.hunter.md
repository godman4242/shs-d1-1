# quests-story — HUNTER LENS review

Critic: blind (never saw the surveyor's reasoning). Every verdict below rests on an
artifact **I** opened. Method: re-parsed `reference/extracted/questdata.xml` with
ElementTree from scratch, read the AS3 in
`reference/decompiled/shs3_android_payload/scripts/`, re-extracted the Prologue frames
from `reference/videos/zFtCaTO0_1M.mp4` at full 1920x1080 myself, and re-ran the byte
check. No verdict here is inherited.

## Headline

**13 of 15 claims survive.** Two `STILL_UNHELD` answers are wrong — both are findable
in one grep each — and one `HELD` claim is **fatally wrong in the direction that would
ship a fidelity bug**. One more `HELD` claim carries an inference that the surveyor's
own frame evidence contradicts, and I found the mechanism that explains it.

Score 78 is roughly right but built partly on sand: two of the three "gaps" holding it
under 85 do not exist, while a new and larger caveat (live-updated data files) applies
to the whole corpus.

---

## FATAL — `quests-story/quest-log-cap-is-a-row-count` is REFUTED

The claim: *"'QUEST_LOG_CAP = 7' is a misread of a UI row count … over an **unbounded**
activeQuests list … a grep for an accept-time cap finds **only a selection-index
clamp**."* Lane impact: *"do **NOT** ship a 7-quest limit."*

The cap is real. Three artifacts:

```
StatsManager.as:164    internal static var MAXQUESTS:int = 7;

StatsManager.as:1262   if(activeQuestList.length < MAXQUESTS || forceAdd)
                       {  ... activeQuestList.push(new ActiveQuest(questID)); ... return true; }
                       return false;

StatsManager.as:1313   if(activeQuestList.length < MAXQUESTS)   // addProcGenDailyQuest
```

and the player-visible consequence:

```
Overworld.as:251  if(currentQuest != QuestGenerator.PROCGENQUEST
                  && QuestEngine.getQuestData(currentQuest).type != QuestType.Dialogue
                  && StatsManager.addActiveQuests(currentQuest) == false)
                  { OverworldHUD.instance.showDialog(LangManager.getString(195), LangManager.getString(5)); }
```

`strings.json` → **195 = "You have exceeded the maximum number of concurrent quests."**
The shipped build has a dedicated error string for hitting the cap. The surveyor's grep
missed it because they searched `QuestLogUI.as`, where the 7 genuinely *is* a row count.

Both readings are true at once and the surveyor threw away the load-bearing half. The
correct spec:

- 7 concurrent **active** quests, enforced at accept time in `StatsManager`.
- `QuestType.Dialogue` quests (22 of the 61) are **exempt** — they never enter the list.
- `forceAdd=true` bypasses the cap, reached via outcome opcode `id 110`
  (`StatsManager.as:3418 addActiveQuests(val,true)`), which is how story quests are
  granted. **That is the ledger's "1 story + 6 side" gloss, and it is substantially
  correct.**
- *Separately*, the log renders 7 rows at `x=60, y=73+55i` with scroll buttons — which
  is what makes the cap invisible in the UI.

Shipping "no 7-quest limit" on this advice would be a straight fidelity regression.

---

## MATERIAL — `quests-story/verbatim-script-held`: the corpus is held, the inference is not

The corpus half is solid; I reproduced it (2,771 `<dialogue>`, 3,307 `<text>`) and read
`LangManager.as:95` — `getQuestString` does return non-`"ID"` strings unchanged. But the
claim then asserts *"so those lines are what the game renders"*, and that does not follow.

**`questdata.xml` is a server-live-updated file and the extracted copy is version 1.**

```
StatsManager.as:479   embeddedVersionArray[FILE_QUESTDATA] = 1;

Mobile.as:216         var versionUrl:String =
   "http://r.playerio.com/r/straw-hat-samurai-duels-5nsekxalfuoiuqdxrmtxw/liveupdate/shs3_data_version.swf";
Mobile.as:244         this.versionArray[StatsManager.FILE_QUESTDATA] = versionInfo.questdata;

QuestEngine.as:281    public static function loadExternalQuestDataXML() : void
                      { ... myLoader.load(new URLRequest(
                          QueryManagerPIO.instance.getDataXML("questdata.xml"))); }
QueryManagerPIO.as:124  return PlayerIO.gameFS(this.gameid).getUrl("/data/" + str);
```

The client polls a liveupdate manifest, compares against `embeddedVersionArray` (= 1 for
questdata), and pulls a newer `questdata.xml` from PlayerIO gameFS when one exists. The
blob in `reference/extracted/` is the **baked-in v1 fallback**, not necessarily what any
played session loaded.

This is the missing mechanism behind the surveyor's own Q-06 finding, which they left
unexplained. It is also **wider than quests-story**: `xmlFileIdArray = [0..9]` means
mapdata, nodedata, itemdata, npcdata, skilldata, bgdata, premiumdata and achievementdata
are all on the same v1-embedded / live-updated footing. Every lane reading those files
inherits this caveat.

---

## Both `STILL_UNHELD` answers are REFUTED

### `<step><action>` — it is `GameEngine.ACTION_*`, a closed 15-value enum

```
QuestEngine.as:1218  GameEngine.initBattleMode(quest, questStepData.action, questStepData.bg,
                        questStepData.stagewidth, questStepData.time, questStepData.wave, startingPosX);
GameEngine.as:990    public static function initBattleMode(quest:int, actionType:int, ...)
GameEngine.as:1014        action = actionType;
GameEngine.as:81-109 ACTION_NOTHING 0 · FIGHT 1 · ASSASSINATE 2 · ESCORT 3 · SURVIVE 4
                     · REACHMARKER 5 · DUEL 6 · ADVENTURE 7 · HARVEST 8 · SURVIVALMODE 9
                     · WARROOMBATTLE 10 · PLAYBACK 11 · PVPROOM 12 · CUTSCENE 13 · SURVIVECLEANUP 14
```

The step's `<action>` **is** the battle-mode selector, verbatim. My own parse of the 215
step rows gives `{0:169, 1:37, 6:5, 14:3, 4:1}` — every value names:

| val | count | meaning |
|-----|-------|---------|
| 0 | 169 | `ACTION_NOTHING` — talk/trigger step, no battle |
| 1 | 37 | `ACTION_FIGHT` |
| 4 | 1 | `ACTION_SURVIVE` |
| 6 | 5 | `ACTION_DUEL` (also forces `startingPosX = 150`, `QuestEngine.as:1214`) |
| 14 | 3 | `ACTION_SURVIVECLEANUP` |

Dispatch gate: `Overworld.as:258 if(questStepInfo.action > 0 && questStepInfo.wave.length > 0)`
→ battle mode, else `endQuestStepIntro()`. L1's trigger dispatch is fully specified.

### `<outcome><id>` — a partitioned namespace **plus** a 22-opcode cutscene director

`getStatType` partitions the whole id space:

```
StatsManager.as:2926-2964
  id < 50      PLAYERSTAT        50-69   EQUIPMENT      70-999   PLAYERSTAT
  1000-1999    SKILL             2000-19999  ITEM       20000-29999  QUESTITEM
  30000-39999  INTSTAT           40000-49999 BOOLEANSTAT  50000-59999 GLOBALVAR
  >= 60000     ACHIEVEMENTSTAT
```

And inside `PLAYERSTAT`, `setStat` is a director opcode table
(`StatsManager.as:3352-3560`). My parse found **28 distinct outcome ids; all 28 resolve**:

| id | uses | meaning |
|----|------|---------|
| 42 | 3 (modify) | `STAT_CHIKAKOLOVE` — the romance stat |
| 43 | 5 | `STAT_LOCATION_ROOM` |
| 100 | 1 | autoSlash on/off |
| 102 | 12 | screen transition, `ACTION_TELEPORT` |
| 108 | 11 | `player.setPosition(val, groundY)` |
| 109 | 2 | pose — 0 `SIT`, 1 `IDLE_BALANCED` |
| 110 | 17 | `addActiveQuests(val, force=true)` — grants a quest past the cap |
| **111** | **47** | **`SoundManager.playMusic(val)`** |
| 112 | 4 | SFX — 0 goodKoto · 1 die · 2 hit · 3 deflect |
| 113 / 114 / 115 | 13 / 11 / 8 | teleport target / room / xPos |
| 116 | 5 | `StageManager.keepPlayerInView()` |
| 118 | 6 | spawn duelist NPC `val` + random taunt (strings 472-479) |
| 119 | 1 | `lootDialog.notifyDontRefreshAfter()` |
| 120 | 14 | `Overworld.doWhiteIn = true` |
| 121 | 10 | face — 0 left, else right |
| 126 | 4 | `StageManager.startShake(val)` |
| 127 | 2 | player MCS visibility |
| 128 | 1 | `gotoRoom(...)` + `initForCutscene(true)` |
| 129 | 1 | `payUI.show()` |
| 130 | 2 | `questDialogueUI.darkBlurBust(val)` |
| 2211 | 1 | ITEM range → grant "Dragon Dance Scroll" |
| 20030 / 20040 | 1 / 1 | QUESTITEM range → "Kanji Gourd" / "Crops" |
| 30017 | 13 | INTSTAT → `TutorialUI.instance.setState(val)` |
| 40000 / 40002 | 1 / 2 | BOOLEANSTAT → persistent story flags |

`<end>` is a separate 3-way: `-1 leaveCancel · 1 leaveOK · else nextStep`
(`XMLQuestOutcome.as:applyOutcome`).

**Note for L7 AUDIO:** id 111 fires 47 times — a 47-cue music sheet keyed to story beats,
on top of the 23 `sound` verbs already claimed inside `<cutscene>`. That was not counted.

---

## Second-order find the surveyor missed: portrait art is HELD-BUT-ENCRYPTED

The score rationale caps the unit below 90 because *"`<img>` portraits and `<bg>`
backdrops are referenced by token only — the art itself is a separate recovery problem."*
It is not separate; it is the **same** problem as audio (Stage-0 finding S0-5).

`QuestDialogueUI.show()` is a documented two-mode system:

```
QuestDialogueUI.as:46   if(ID == -2) { this.npcName.text = StatsManager.charname;
                             if(portrait == "") this.bust.initMCSFromPlayer(); }
QuestDialogueUI.as:67   if(portrait != "") { this.bust.visible = false;
                             this.npcPortrait = ResourceManager.getPortrait(portrait);
                             this.portraitCanvas.addChild(this.npcPortrait);
                             this.npcPortrait.x = 800; this.npcPortrait.y = 0; }
                        else { this.bust.visible = true; }   // paperdoll fallback
ResourceManager.as:286  mcname = "portrait_" + id;   // domain RESOURCE_IMAGE (=3)
ResourceManager.as:270  mcname = "image"    + id;   // same domain
```

`RESOURCE_IMAGE` is `124_Mobile_ImageResource` — a nested-CWS blob, i.e. **held but
encrypted**, exactly like the music. And `portrait_kojuro.as` is already decompiled in
three bundles (`shs3_payload`, `shs3_android`, `shs3_android_payload`), proving the
class shape.

The 68 tokens are also **not one manifest** — they are two, by prefix:
- **52 NPC portraits** → `portrait_<token>` (`jinbei`, `satoshi_serious`, `yasuka_hurt`, …)
- **16 full-screen cutscene splashes** → `image<token>`: `_episode0` … `_episode12`,
  `_epilogue`, `_exposition`, `_exposition_epilogue`

L6 needs two asset classes with different resolution paths and a known placement
(`x=800, y=0`), not "68 portraits".

---

## Frame work I redid myself (§0 requires it)

I did **not** trust the surveyor's sheet. Extracted at native 1920x1080 with
`ffmpeg -ss <t> -i reference/videos/zFtCaTO0_1M.mp4 -frames:v 1`, cropped
`(0,690)-(1500,1070)` and upscaled 1.5x (LANCZOS) to
`…/scratchpad/hq/crop_62.png`, `crop_68.png`.

- **t=62 s**, nameplate `JINBEI`: *"IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS.
  IT'S THE BANDITS, YOU SEE. THEY'VE DRIVEN ALL THE HONEST FOLK AWAY."*
  vs `questdata.xml:128` *"Ah! A new face in this territory! My, it isn't often we see
  people walk this road alone, what with all the bandits infesting it..."* — **different**.
- **t=68 s**, nameplate `GUEST`, two stacked choice rows:
  *"I'LL STAND MY GROUND AND ASK THEM TO LEAVE ME ALONE."* (= `:149` **exact**) and
  *"THESE BANDITS DON'T SCARE ME!"* vs `:153` *"They'll get nothing from me!"* — **different**.

**The frame wins, and I say so out loud.** The surveyor's Q-06 is confirmed on my own
eyes, not theirs — and the live-update path above is why.

I also re-opened `reference/frames/broad_survey/Nr4fQstqHDM_0090.jpg` (480x270, upscaled
4x to 1920x1080). The PLAYER sheet name field reads **SOUND360TM**, over a paperdoll in
kasa + blue-sheathed sword; COINS 425, GOLD 2, EXPERIENCE POINTS …/16350. Q-09 confirmed,
and now corroborated in code by `QuestDialogueUI.as:46` — speaker `-2` renders
`StatsManager.charname`.

## Count corrections (minor, claims still stand)

Re-measured with ElementTree, not grep:

| stated | actual | where |
|--------|--------|-------|
| 18 `<loot>` | **19** | Q-03, Q-10 |
| 151 `<wave><enemy>` | **169** rows, **773** total spawns by `<qty>` | Q-11 |
| "348+52+14+97 coordinate fields" | 348 `obj/x` · 52 `roomobj/x` · 14 `step/teleportposx` verified; the **97 does not reconcile** — my buckets are `enemy/x` 109, `friend/x` 49, `data/x` 76 | Q-03 |

Everything else reproduced exactly: 61 quests, 2,771 `<dialogue>`, 3,307 `<text>`,
471 `<choice>` (`goto` 471/471, `outcome` **0**/471, `condition` 7, `gotolabel` 0),
55 `<cutscene>`, 399 `<data>` over the same 15 verbs, 77 `<reward>`, 69 `<exp>` over
`{100,200,250,290,500,600,750,1000,2000,3000}`, 68 `<img>`, 70 `<friend>` (59 with
`<fatal>0</fatal>`), 2 `<neutral>` (both id 118 Training Dummy), 4 `<endless>`,
225 `<step>`, quest types `{2:37, 4:22, 0:2}`. Byte check reproduced:
`sha256(android[:-1]) == sha256(web) == e8ecb01f05cc47c3a331328a3278c70a986d93038838af5a27c8075a035aad2e`.

One nuance on Q-04: "not a consequence system" overstates. Choices carry no `<outcome>`
— true, 0/471 — but the quest **step** does: 386 `<outcome>` under `<intro>`/`<ending>`,
194 of them `<set>`. Persistent state exists; it is just not choice-scoped.
