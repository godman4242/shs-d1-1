# L0 SYSTEM SURVEY — **quests-story**

**Ledger under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20), §2 score **42/100**,
§4 block `### quests-story — 42`, plus §6 "structurally UNRECOVERABLE".
**Surveyed:** 2026-08-13. **Verdict: 42 → 85.** The single largest under-claim in the entire
document lives in this system.

Every claim below cites exactly one artifact class (A1 frame / A2 payload row / A3 test /
A4 ledger-with-own-cite / A5 owner LOOK). Nothing is asserted from memory or plausibility.

---

## 0. What this system actually is, now that the payload is open

`reference/extracted/questdata.xml` is **796,383 bytes / 27,734 lines** and is not a
summary — it is the **shooting script and the state machine of the entire campaign**.

| Measure | Value | How derived |
|---|---|---|
| `<quest>` | 61 | index `questdata.json` + first-hand parse |
| named chapters | 17 (Prologue, 2 tutorials, Ep1–Ep12, Epilogue, Season-2 stub) | parse of quest-level `<title>` |
| `<step>` | 225 (181 in the 17 chapters) | index + parse |
| `<dialogue>` | 2,771 | parse |
| `<text>` (all kinds) | 3,307 | parse |
| **words of dialogue** | **36,828** | parse |
| **words across all `<text>`** | **40,013** | parse |
| `<choice>` | 471 in 196 `<option>` blocks | parse |
| `<cutscene>` | 55, containing 399 `<data>` beats across **15 distinct director verbs** | parse |
| distinct speakers | 59 NPC ids + the player | parse |
| portrait tokens | 68 (24 characters with emotion variants + 14 splash cards) | parse |

Supporting AS3 (all under `reference/decompiled/shs3_android/scripts/`): `QuestEngine.as`
(1,278 lines), `QuestGenerator.as` (**3,766 lines**), `QuestType.as`, `QuestItem.as`,
`XMLQuest*.as` (13 files), `QuestLogUI.as`, `QuestDialogueUI.as`, `CutsceneManager.as`,
`LangManager.as`.

---

## 1. OVERTURNS — §6 "structurally UNRECOVERABLE"

### QS-01 — the §6 line is false. **A2.**

> **Ledger §6, line 1:** *"**Verbatim dialogue** — if the story is server-fetched and the
> server is dead, the actual script is gone; author original lines to the summaries
> (RECREATE-NEVER-RIP already requires original dialogue anyway)."*

Wrong. The script is on disk, in full, in plain English.

`reference/extracted/questdata.xml:128`
```xml
        <text>Ah! A new face in this territory! My, it isn't often we see people walk this road alone, what with all the bandits infesting it...</text>
```
`reference/extracted/questdata.xml:169`
```xml
        <text>WHAT–?! You dare defy Jinbei the Bandit King, the greatest highwayman that ever lived?!</text>
```

**36,828 words of dialogue** across 2,771 blocks. This is not "recoverable in principle" —
it is byte-present today.

### QS-02 — proof the `<text>` values are FINAL strings, not string-table keys. **A2.**

The obvious objection is that the plain text might still be indirected. It is not, and the
game's own loader settles it. `reference/decompiled/shs3_android/scripts/LangManager.as:93`
```actionscript
      public static function getQuestString(id:String) : String
      {
         if(id.charAt(0) != "I" || id.charAt(1) != "D")
         {
            return id;
         }
```
`XMLQuestDialogue.as` and `XMLQuestChoice.as` both route their `<text>` through exactly this
function. So any `<text>` **not** beginning `ID` is returned verbatim.

Measured across all 3,307 `<text>` values in `questdata.xml`:
- starting with `ID`: **0**
- purely numeric: **0**
- empty: **0**
- mean length: 64.8 characters

**Every one of the 3,307 lines is a final, verbatim, displayable English string.**
This also confirms `GAUNTLET.md` §2.1's ✅ bullet with a mechanism, not just an eyeball.

### QS-03 — §6 line 4, cross-lane: the L11–80 XP curve is NOT unrecoverable. **A2.**

> **Ledger §6, line 4:** *"**L11–80 XP curve** — no table published; a solo build likely
> can't reach L11+; keep the extrapolation labeled INFERRED."*

Found while chasing this system's reward formula.
`reference/decompiled/shs3_android/scripts/StatsManager.as:78`
```actionscript
      public static var expArray:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,43500,49850,56550,63900,71900,80300,89100,98300,108000,118300,129300,141100,154100,168100,183100,199100,216100,234100,253100,273100,294100,316100,339300,363300,389300,416800,445800,475800,507300,540300,574300,610300,647800,685800,725800,767800,812300,859300,908300,959300,1012300,1067300,1124300,1183300,1244800,1307800,1372800,1439800,1508800,1578800,1651800,1728800,1808800,1892800,1980800,2071800,2166800,2276800,2404800,2544800,2699800,2862800,3032800,3212800,3400800,3595800,3795800,4025800,4285800,4585800,4935800,5335800,5815800,6365800,6965800,7645800,8395800,9295800,10295800,11495800,12995800,14795800,16895800,19295800,22095800,25395800,29395800];
```
99 entries. The whole curve. **Hand to L10 — delete this §6 bullet.**

---

## 2. OVERTURNS — §4 blockers ① ② ③ ④

### QS-04 — blocker ② "Ep4–12 + epilogue (10 undocumented chapters)". **A2. Overturned.**

> **Ledger §3 item 8:** *"Only Prologue–Ep3 are documented/reachable; Ep4–12 were likely
> never shipped. **Scope decision:** faithful campaign = Prologue–Ep3, with Ep4–12 labeled
> canonical-but-unshipped."*

Not merely shipped — **Ep4–12 are the bulk of the game.**

| quest id | line | steps | dialogue | choices | cutscenes | title |
|---|---|---|---|---|---|---|
| 0 | 2 | 15 | 207 | 52 | 4 | Prologue |
| 4 | 2263 | 7 | 12 | 2 | 0 | Fighting Tutorial |
| 5 | 2576 | 2 | 10 | 2 | 0 | Mining Tutorial |
| 12 | 3469 | 9 | 137 | 45 | 1 | Episode 1 |
| 15 | 5121 | 9 | 179 | 36 | 1 | Episode 2 |
| 20 | 6865 | 13 | 179 | 36 | 0 | Episode 3 |
| **25** | **8518** | 7 | 99 | 26 | 0 | **Episode 4** |
| **26** | **9332** | 11 | 180 | 21 | 0 | **Episode 5** |
| **30** | **10810** | 14 | 186 | 25 | 3 | **Episode 6** |
| **31** | **12795** | 18 | 322 | 49 | 0 | **Episode 7** |
| **35** | **15424** | 16 | 195 | 26 | 0 | **Episode 8** |
| **40** | **17277** | 14 | 217 | 17 | 17 | **Episode 9** |
| **44** | **20802** | 18 | 240 | 29 | 5 | **Episode 10** |
| **50** | **23077** | 10 | 132 | 12 | 7 | **Episode 11** |
| **54** | **24867** | 14 | 218 | 26 | 13 | **Episode 12** |
| **59** | **27345** | 3 | 19 | 0 | 4 | **Epilogue** |
| 60 | 27695 | 1 | 0 | 0 | 0 | Season 2 |

`reference/extracted/questdata.xml:24867`
```xml
  <title>Episode 12</title>
```
Ep4–Ep12 + Epilogue carry **1,788 dialogue lines**; Ep1–Ep3 carry 495. The chapters the
ledger proposed to cut as "canonical-but-unshipped" are **3.6× the content it proposed to
build.** The `<img>` splash tokens `_episode0 … _episode12`, `_epilogue`,
`_exposition_epilogue` are all referenced, one per chapter.

### QS-05 — Season 2 is a HOOK, not content. **A2. Honest counterweight.**

Do not let QS-04 become an over-claim in the other direction. Quest id 60's only text is
`reference/extracted/questdata.xml:27726`
```xml
      <text>This episode is not yet released. Return here when the episode is released to continue the story!</text>
```
"Season 2" is a one-step teaser stub. The campaign ends at the Epilogue. **14 chapters, not 15.**

### QS-06 — blocker ③, part 1: per-step **trigger types** are exact. **A2. Closed.**

215 of 225 steps carry `<action>`. Decoded against
`reference/decompiled/shs3_android/scripts/GameEngine.as:81-109`
```actionscript
      internal static var ACTION_NOTHING:int = 0;
      internal static var ACTION_FIGHT:int = 1;
      ...
      internal static var ACTION_DUEL:int = 6;
      ...
      internal static var ACTION_SURVIVECLEANUP:int = 14;
```

| value | constant | steps |
|---|---|---|
| 0 | `ACTION_NOTHING` (talk / reach / scripted) | 169 |
| 1 | `ACTION_FIGHT` | 37 |
| 6 | `ACTION_DUEL` | 5 |
| 14 | `ACTION_SURVIVECLEANUP` | 3 |
| 4 | `ACTION_SURVIVE` | 1 |

The full 15-value enum is held even though the campaign only uses 5 of them.

### QS-07 — blocker ③, part 2: **coords** are exact, on every step. **A2. Closed.**

All 225 steps carry both `<node>` (world node id) and `<roomobj><room>` — **51 distinct node
ids, 29 distinct rooms**, plus 14 `<teleportnode>`/`<teleportposx>` pairs. Actor placement is
per-object: 348 `<obj><x>` values spanning −1000…5000, and enemy/friend/neutral spawn x's.
`reference/extracted/questdata.xml:14-20`
```xml
  <step>
    <node>8382465</node>
    <roomobj>
      <room>0</room>
      <id>39</id>
      <name>_storystart</name>
    </roomobj>
```
"sampled, not tabled" is obsolete: it is tabled, for every step, with no gaps.

### QS-08 — blocker ③, part 3: **rewards** are exact, per chapter. **A2. Closed.**

69 `<exp>` rows (10 distinct values 100…3000) + 19 `<loot>` rows. Campaign totals:

| quest | XP | loot (`id`×`qty`) |
|---|---|---|
| Prologue | 2,940 | 13100×1, 2103×5, 20108×3, 20108×−1 ×3, 20054×5 |
| Fighting Tutorial | 400 | 2204×1 |
| Mining Tutorial | 0 | `13022,82@1#`×1 |
| Episode 1 | 3,750 | 20109×1, 20110×1, 0×30 (coins), 20109×−1, 20110×−1 |
| Episode 2 | 5,000 | — |
| Episode 3 | 3,800 | — |
| Episode 4 | 5,000 | — |
| Episode 5 | 8,000 | — |
| Episode 6 | 9,000 | — |
| Episode 7 | 7,000 | 2105×5, 2108×2, 2211×1 |
| Episode 8 | 5,000 | 20030×1 |
| Episode 9 | 8,000 | — |
| Episode 10 | 8,000 | — |
| Episode 11 | 6,000 | — |
| Episode 12 | 8,000 | — |
| **total** | **79,890** | |

(`qty` −1 is a *take-back* — the quest item is consumed on turn-in.) 79,890 XP against
`expArray` (QS-03) lands the campaign near **level 39**; hand that to L10 as a hard
constraint on the XP-income model.

### QS-09 — blocker ④ "are player choices consequential?" — **now answerable; PARTIAL.**

The mechanism exists and is used. **471 choices, every one carrying `<goto>`; all 196
`<option>` blocks branch to ≥2 distinct targets.** 7 choices are *gated* on persistent state:
`reference/extracted/questdata.xml:2178-2184`
```xml
        <choice>
          <text>(Fighting Tutorial) I may be able to learn something here.</text>
          <goto>10</goto>
          <condition>
            <completedquest>!4</completedquest>
          </condition>
        </choice>
```
and outcomes write real state — `XMLQuestOutcome.as:applyOutcome` dispatches to
`OverworldHUD.instance.lootDialog.addLootCoins`, `addLootItemBasic`, `addLootXP`, or
`StatsManager.changeStat` / `StatsManager.setStat`. Simulating every option block (walking
each `<goto>` index forward through the intro child list until `end != 0`, honouring `<label>`
jumps), **122 of 195 blocks reach a different outcome set per branch.**

**But the honest half:** the headline Prologue toll choice is *cosmetic*. Both branches
converge on `label2` and fire the identical outcome — `questdata.xml:146-185`:
```xml
      <option>
        <id>-2</id>
        <choice>
          <text>I'll stand my ground and ask them to leave me alone.</text>
          <goto>9</goto>
        </choice>
        <choice>
          <text>They'll get nothing from me!</text>
          <goto>15</goto>
        </choice>
      </option>
      ...
      <label>label2</label>
      <outcome>
        <id>111</id>
        <set>5</set>
        <end>0</end>
      </outcome>
```
choice B's branch ends `<goto>label2</goto>` — straight back into choice A's path.

**Verdict: PARTIAL.** Blocker ④ is no longer a *blocker* (an unanswerable research question);
it is a *query over data we hold*. The answer is "sometimes" — flavour-only in the sampled
Prologue case, state-writing in 122 blocks. L1 must implement the branch graph faithfully
rather than assume either extreme.

---

## 3. CORRECTIONS to the §4 "Ready" and "Surface" bullets

### QS-10 — the archetype taxonomy is the wrong SHAPE. **A2.**

> **Ledger §4 Ready:** *"archetype taxonomy (story/normal/trade + bounty/escort/gather/timed)"*

Two errors. First, the real enum is named and has 9 members —
`reference/decompiled/shs3_android/scripts/QuestType.as:5-21`
```actionscript
      public static var NormalSideQuest:int = 0;
      public static var RepeatableSideQuest:int = 1;
      public static var StoryQuest:int = 2;
      public static var DailySideQuest:int = 3;
      public static var Dialogue:int = 4;
      public static var ClanQuest:int = 5;
      public static var OngoingQuest:int = 6;
      public static var HighLvlQuest:int = 7;
      public static var LowLvlQuest:int = 8;
```
`questdata.xml` uses only **3**: StoryQuest ×37, Dialogue ×22, NormalSideQuest ×2.

Second and structurally more important: **bounty / escort / gather / trade side quests are
not authored data at all — they are generated at runtime.** `QuestGenerator.as` is 3,766
lines and composes quest XML as strings, from 17 templates × 20 motives
(`QuestItem.as:26-58` `QUEST_KILLWILDLIFE=0 … QUEST_GIVECROPS=16`; `:60-98`
`REASON_EATINGCROPS_PREEMPTIVE=0 … REASON_MERC=19`). Its literals are on disk:
`reference/decompiled/shs3_android/scripts/QuestGenerator.as:925,933,935-938`
```actionscript
         questStep1Data.title = "Get " + questItem.getPlainName() + " for " + questGiverName;
         questStep2Data.title = "Give " + questItem.getPlainName() + " to " + questGiverName;
         introStr += "<option><id>" + XMLNpc.INDEX_SELF + "</id><text>Quest: Find " + questItem.getNameBlackBG() + "</text>";
         introStr += "<choice><text>Give " + questItem.getPlainName() + "</text><goto>3</goto><condition><has><id>91</id><qty>1</qty><comp>gte</comp></has></condition></choice>";
         introStr += "<choice><text>Maybe later</text><goto>5</goto></choice></option>";
         introStr += "<dialogue><id>" + XMLNpc.INDEX_NPCHOLDER + "</id><text>Ah yes! I have been looking for this.</text></dialogue>";
```
L1 must build a **generator**, not a table. This is a scope change the ledger does not anticipate.

### QS-11 — "9 reward tuples" is a floor; the side-quest reward FORMULA is held. **A2.**

`reference/decompiled/shs3_android/scripts/QuestGenerator.as:2105,2110` (repeated verbatim at
2266/2271, 2417/2422, 2587/2592, 2790/2795, 2986/2991, 3238/3243, 3402/…)
```actionscript
         questReward = (StatsManager.getXPLevelThreshhold(nodelvl + 1) - StatsManager.getXPLevelThreshhold(nodelvl)) / ((nodelvl + 1) * 1.2);
         questCoinReward = nodelvl * 5;
```
plus a prosperity payout `reference/decompiled/shs3_android/scripts/QuestGenerator.as:850,921`
```actionscript
            prosperityReward = 5;
...
            rewardStr += "<loot><id>50007</id><qty>" + prosperityReward + "</qty></loot>";
```
The side-quest economy is a closed-form function of node level, not an inference.

### QS-12 — `QUEST_LOG_CAP = 7` confirmed; the "(1 story + 6 side)" gloss is WRONG. **A2.**

> **Ledger §4 Surface:** *"QUEST_LOG_CAP = 7 (1 story + 6 side)."*

The 7 is right — `reference/decompiled/shs3_android/scripts/StatsManager.as:164`
```actionscript
      internal static var MAXQUESTS:int = 7;
```
The split is not. There is **one pooled cap and no reserved story slot**;
`StatsManager.as:1262`
```actionscript
         if(activeQuestList.length < MAXQUESTS || forceAdd)
```
is the only gate on `addActiveQuests`, and story progression goes through `setActiveQuest`
(`StatsManager.as:1276-1301`), which **pushes unconditionally and bypasses `MAXQUESTS`
entirely.** Also supersedes `docs/research/video-study/SYNTHESIS.md:612` `QUEST_LOG_CAP | ≥7
(exact unknown) | INFERRED`.

### QS-13 — the "player named Satoshi" contradiction is resolved: the player is NOT Satoshi. **A2.**

`<id>-2</id>` on a dialogue block means *the player character*, rendered with the player's own
name and paperdoll — `reference/decompiled/shs3_android/scripts/QuestDialogueUI.as:46-52`
```actionscript
         if(ID == -2)
         {
            this.npcName.text = StatsManager.charname;
            if(portrait == "")
            {
               this.bust.initMCSFromPlayer();
            }
         }
```
**556 of the 2,771 dialogue lines are the player's own.** Satoshi is a separate NPC with his
own speaker id and 385 portrait-tagged lines (`satoshi` 176, `satoshi_serious` 209, plus
`satoshi_happy`, `satoshi_drunk`). Corroborated by A1: the nameplate over the player in
`reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0016.jpg` reads **GUEST**, the default
`charname` for an unregistered session.

---

## 4. OVER-CLAIMS — where the ledger says we have something we do not

### QS-14 — "character roster + roles" ready ⇒ we hold the ROSTER, not the ART. **A2.**

`questdata.xml` names 68 portrait tokens (24 characters with emotional states —
`satoshi_serious`, `chikako_mask`, `mitsuo_dying`, `takamori_undead`, `ladyoiwa_snake`,
`magoichi_masked` … — plus 14 chapter splash cards). But the art is in a **different,
external SWF**. `reference/decompiled/shs3_android/scripts/ResourceManager.as:286-294`
```actionscript
      public static function getPortrait(id:String) : MovieClip
      {
         ...
         var applicationDomain:ApplicationDomain = applicationDomainArray[RESOURCE_IMAGE];
         var mcname:String = "portrait_" + id;
```
`ResourceManager.as:41`
```actionscript
      internal static var resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"];
```
`grep -c "portrait_" reference/extracted/payload.xml` → **6 hits, and only one real portrait
symbol (`portrait_kojuro`, payload.xml:111136).** The other 67 portraits and all 14 splash
cards are **not in the payload we hold.** Story art is an open blocker the ledger does not list.

**Free win for other lanes:** the same array names `musicresource.swf` and
`soundresource.swf` — §6's *"Exact original SFX & music synthesis params"* bullet now has a
named target file rather than "the exact waveforms are not [study-able]". Flagged to L7; I do
not claim the files are obtainable, only that they are named.

### QS-15 — "+ haikus" is held ONLY in the frames, never in the payload. **A1 beats the doc.**

The ledger's Ready bullet reads *"full Season-1 (Prologue–Ep3) step chains + haikus."* The
step chains are in the payload (QS-04). The haikus are **not** — the chapter cards are the
`<img>_episodeN</img>` art symbols, and their text is baked into the artwork, which lives in
the external `imageresource.swf`. `questdata.xml:30-32`
```xml
    <intro>
      <img>_exposition</img>
      <img>_episode0</img>
```
carries no text node at all.

**The frame is the only holder, and per the standing invariant the frame wins.**
`reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0006.jpg` (1920×1080 → whole frame
downscaled to 900 px wide; text is full-screen so no crop needed) renders the `_exposition`
card verbatim: *"THE DAIMYO OF THE SHIRA TANCHO, LORD MASAHIRO, HAS RULED AS SHOGUN FOR FIVE
YEARS, BRINGING STABILITY TO A LAND ONCE WRACKED BY CONFLICT. HOWEVER DARK CLOUDS GATHER AT
THE EDGE OF THE EMPIRE, THREATENING AN END TO THIS HARD-WON PEACE. SETTING OFF ON YOUR
WARRIOR'S PILGRIMAGE, YOU ARE TRAVELING EAST IN ACCORDANCE WITH YOUR SENSEI'S INSTRUCTIONS TO
FIND A MAN NAMED HIROSHI…"* — in the Edo SZ face identified by Stage-0 finding S0-2.
**14 splash cards ⇒ 14 frame-transcription jobs for L1, not a payload port.**

---

## 5. THE STRING TABLE — located by name; the blocker narrows and changes shape

### QS-16 — `GAUNTLET.md` §2.1's *"a string table that has not been located"* is overturned. **A2.**

`reference/decompiled/shs3_android/scripts/LangManager.as:55-57`
```actionscript
            Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");
            Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");
            Locale.loadLanguageXML(id,onLanguageLoad);
```
`server` is `QueryManagerPIO.instance.getStringsDir()` —
`reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:109-116`
```actionscript
      public function getStringsDir() : String
      {
         if(StatsManager.useTestData)
         {
            return PlayerIO.gameFS(this.gameid).getUrl("/testlang/");
         }
         return PlayerIO.gameFS(this.gameid).getUrl("/lang/");
      }
```
with the game id literal at `QueryManagerPIO.as:41`
```actionscript
      public var gameid:String = "straw-hat-samurai-duels-5nsekxalfuoiuqdxrmtxw";
```
(and a second, `…-no1ygg8lk6xmk5txblnwa`, at `:96`). The desktop build's filename set is
corroborated in the payload's own constant pool — `reference/extracted/payload.xml:118534-118537`
```xml
            <item>strings/</item>
            <item>shs3_en.xml</item>
            <item>shs3_fr.xml</item>
            <item>shs3_es.xml</item>
```

**The table is `shs3_en.xml` (plus `_fr`, `_es`, `_zh-CN`), served from PlayerIO gameFS
`/lang/`.** It is *external to the payload by design* — which is why bindata/ and
`ui_strings.txt` were always going to come up empty. **L1b's job changes from "search the
payload" to "fetch one named file from the CDN that Stage-0 already proved still serves
`shs3_payload.swf`."** I claim only the name and the URL construction; I did not fetch it.

### QS-17 — what is STILL blocked in this system, precisely. **A2 + STILL_UNHELD.**

Nameplates. `reference/decompiled/shs3_android/scripts/XMLNpc.as:127-133`
```actionscript
         if(xml.name.toString() != "")
         {
            this.name = LangManager.getString(xml.name);
```
i.e. the numeric route, not the pass-through route. All 59 distinct story speakers resolve
through it — e.g. Jinbei is npc 151 (`questdata.xml:65` `<property>151,shoulderweapon,1</property>`,
matching `<dialogue><id>151</id><img>jinbei</img>`), and `reference/extracted/npcdata.xml`
gives npc 151 `<name>5078</name>`.

So the campaign renders today with **every line of dialogue correct and every nameplate
reading `?`** (`QuestEngine.as:1056` returns `"?"` on a miss). Two further small gaps:
- **16 cutscene `say` bubbles** use numeric params — ids 9000–9009, only ~9 distinct strings
  (9000 recurs 6× and is almost certainly the clear-bubble). `questdata.xml:100-102`
  ```xml
          <id>jinbei</id>
          <action>say</action>
          <param>9006</param>
  ```
- **67 portraits + 14 splash cards** (QS-14/QS-15).

That is the complete residual gap list for quests-story. Three external files close all of it:
`shs3_en.xml`, `imageresource.swf`, and (for chapter cards, as a fallback) the two longplays.

---

## 6. FRAME CORROBORATION — the payload and the video agree

### QS-18 — a Prologue step, frame-verified. **A1.**

`reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0016.jpg` — source 1024×576; two crops taken,
both LANCZOS-upscaled:
- objective ticker, crop `(20,74)–(368,190)` upscaled ×3 → reads
  **"W KASUTA FOREST"** banner and **"STORY QUEST: LOOK FOR A MAN NAMED HIROSHI"**
- right third, crop `(614,299)–(819,472)` upscaled ×4 → a **spotted sika deer**, idle,
  facing left, behind a bamboo culm

Against `reference/extracted/questdata.xml:74`
```xml
    <title>Look for a man named Hiroshi</title>
```
— the HUD ticker is the step `<title>` rendered uppercase, prefixed `STORY QUEST:` because
`<type>2</type>` is `QuestType.StoryQuest`. And `questdata.xml:89-94`
```xml
      <neutral>
        <id>118</id>
        <qty>1</qty>
        <x>2000</x>
        <lvl>1</lvl>
      </neutral>
```
— a single level-1 *neutral* spawned far to the right of the player's start. The frame shows
exactly one animal, far right, non-hostile. `reference/extracted/npcdata.xml:2706-2725` gives
npc 118 `<lvl>1</lvl> <hp>1</hp> <ai>13</ai>` and an animal paperdoll. Frame and payload
agree; no conflict to adjudicate. (I do **not** claim npc 118 is *named* "deer" — its
`<name>5033</name>` is string-table-gated per QS-17.)

---

## 7. RE-SCORE

**quests-story: 42 → 85.**

| | |
|---|---|
| **Held (A2, byte-present)** | the entire 40,013-word script; 14-chapter structure; 225 steps with node+room coords; the 15-verb cutscene director and its 399 beats; the 471-choice branch graph with conditions and outcomes; per-chapter XP and loot; the quest state machine, quest-log UI, dialogue UI and procedural quest generator as decompiled AS3; `MAXQUESTS=7`; the player-vs-Satoshi identity |
| **Held (A1 only)** | the 14 chapter-card haikus / exposition text — transcribe from the longplays |
| **Still unheld** | 59 NPC nameplate strings and 9 cutscene bubble strings (⇒ `shs3_en.xml`, `/lang/`, gameid known); 67 portraits + 14 splash arts (⇒ `imageresource.swf`, `/res/`) |
| **Genuinely lost** | nothing in this system |

Not 100 because three named external files are still unfetched and one of them (portrait art)
has no A1 substitute at usable fidelity. But **§6 must lose its "Verbatim dialogue" bullet
outright**, §4's blockers ① ② ③ are closed, ④ is downgraded from blocker to query, and the
§3 scope decision to ship "Prologue–Ep3 only" should be reversed — it would discard 78% of the
campaign that is sitting on disk in plain English.

---

*Surveyor: L0 quests-story lane, 2026-08-13. No file outside this path was modified.*
