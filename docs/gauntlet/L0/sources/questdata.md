# L0 SOURCE SURVEY — `questdata` (orthogonal sweep)

**Unit:** `reference/extracted/questdata.xml` (796,383 B · 27,734 lines · 61 quests)
**Document under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20, avg ~42)
**Run:** 2026-08-15 · surveyor read the file exhaustively, then decoded its grammar against
the decompiled quest engine and cross-checked two claims against 1080p video frames.

**Rule applied throughout:** when the payload and a frame disagree, **THE FRAME WINS**, and it
is said out loud (see Q-02, the headline finding).

---

## 0. Method note — why the AS3 cites belong to this lane

`questdata.xml` is a **script for an interpreter**. Half its columns (`<action>`, `<outcome><id>`,
`<x>`, `<time>`, pipe-delimited ids, `<comp>`) are meaningless numbers until the interpreter is
read. Every AS3 cite below is used **only** to decode a questdata column, and every decode is
verified to exist in the **web v0.717 payload** as well as the Android bundle where it matters.
Decompiled bundles used: `reference/decompiled/shs3_android_payload/scripts/` (class-named) and
`reference/decompiled/shs3_payload/scripts/` (obfuscated, web v0.717).

---

## Q-01 — §6's "verbatim dialogue is gone" is DEAD. 40,119 words of literal script are on disk.

**Ledger (§6):** *"**Verbatim dialogue** — if the story is server-fetched and the server is dead,
the actual script is gone; author original lines to the summaries."*
**Ledger (§4 quests-story blocker ①):** *"**verbatim dialogue — captured NOWHERE** (study policy
+ no wiki transcripts)"*

**Evidence (A2).** `reference/extracted/questdata.xml:128`:

```
        <text>Ah! A new face in this territory! My, it isn't often we see people walk this road alone, what with all the bandits infesting it...</text>
```

Measured over the whole file:

| metric | value |
|---|---|
| `<text>` nodes | **3,307** |
| `<dialogue>` blocks | **2,771** |
| `<choice>` blocks | **471** |
| words of prose | **40,119** |
| characters of prose | **214,043** |

And it is **literal**, not a pointer table:

* `grep -c '%' questdata.xml` → **0** — no `insertStatToString` runtime substitution
  (`LangManager.as:110-125` splits on `%` and injects `getStat(n)`; questdata uses none).
* `grep -c '<text>ID' questdata.xml` → **0** — `LangManager.getQuestString()` returns the
  argument unchanged unless it starts with the two chars `I`,`D` (`LangManager.as:95-100`),
  so every one of the 3,307 nodes is already final English.

**Verdict: HELD. §6's highest-value "unrecoverable" line is overturned.**

---

## Q-02 — ⚠️ BUT the held script is a DIFFERENT REVISION from the shipped v0.717. THE FRAME WINS.

This is the most important thing in this survey and nobody has said it yet.

**Frame (A1):** `reference/frames/zFtCaTO0_1M/seg-01/frames/frame_0016.jpg`
(1024×576 JPEG, read full-frame — the dialogue box occupies the bottom third at native size,
no crop needed to read the type; portrait is Hiroshi, naginata over shoulder, in the hut interior).
Visible dialogue, one node, nameplate **HIROSHI**:

> "YOUR SENSEI AND I SERVED TOGETHER UNDER SHOGUN MASAHIRO FOR MANY YEARS, AND I ASKED HIM TO
> SEND YOU HERE BECAUSE I NEED... NO, SHOGUN MASAHIRO NEEDS YOUR HELP."

**Payload (A2):** the *same beat, same speaker (npc 144 = Hiroshi), same portrait, same scene* is
`questdata.xml:483` and `:488` — **two** nodes, **differently worded**:

```
483:        <text>Your sensei and I have been friends for many years now, ever since serving together in shogun Masahiro’s bodyguard.</text>
488:        <text>I asked for you to come here because I need... no, Masahiro needs... your help.</text>
```

Two further v0.717 lines from the same conversation are **absent from every artifact we hold**:

* `frame_0020.jpg` — "THE TASK I HAVE IN MIND IS A SIMPLE ONE THOUGH, AND I'M SURE YOU WILL BE
  MORE THAN EQUAL TO THE CHALLENGE."
* `frame_0024.jpg` — GUEST: "I HAVE SOME QUESTIONS ABOUT MY MISSION."

Searched case-insensitively and found **zero** hits in: `questdata.xml`,
`reference/extracted/android/118_Mobile_Lang_EN.bin` (UTF-16LE decode), and every file under
`reference/decrypted/` (`*.swf`, `*.bin`, both UTF-8 and UTF-16LE decodes).

**Why:** consistent with REBUILD_READINESS §5's own P0 note — the Player.IO CDN payload is
2016-dated and its tinyloader "reports `version=0.706`", while the longplay title screen
(`reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0001.jpg`, bottom-right) reads **v0.717**.

**Verdict: HELD (the divergence is proven).** Consequence for the board: the correct claim is
**"the campaign script is HELD at a near-final revision"**, *not* "verbatim v0.717 dialogue is
held". Anyone porting lines must label them **v0.706-era** and expect line-level rewrites.
**The frame wins.**

---

## Q-03 — §3.8 "Ep4–12 were likely never shipped" is DISPROVEN, and the real scope edge is named.

**Ledger (§3.8):** *"Season 1 is Prologue + 12 episodes + epilogue = 14 chapters, not 4. Only
Prologue–Ep3 are documented/reachable; **Ep4–12 were likely never shipped.** **Scope decision:**
faithful campaign = Prologue–Ep3, with Ep4–12 labeled canonical-but-unshipped."*

**Evidence (A2).** Every episode is present with full dialogue, waves and rewards:

| quest id | line | title |
|---:|---:|---|
| 0 | 5 | Prologue |
| 12 | 3472 | Episode 1 |
| 25 | 8521 | Episode 4 |
| 44 | 20805 | Episode 10 |
| 54 | 24869 | Episode 12 |
| 59 | 27347 | Epilogue |
| 60 | 27697 | Season 2 |

The scope edge is **explicit in the data** — `questdata.xml:27710` and `:27725`:

```
    <title>(Unreleased) The adventure continues...</title>
      <text>This episode is not yet released. Return here when the episode is released to continue the story!</text>
```

Ep12 alone spans lines 24869–27024 (~2,155 lines). Ep7 spans 12796–15164 (~2,368 lines).
These are not stubs.

**Verdict: HELD. Ledger overturned — the scope decision it recommends is wrong and would cut
~9 shipped episodes.** The genuine unshipped boundary is **Season 2**, not Ep4.

---

## Q-04 — Screen shake: the ledger calls it "never catalogued". It is fully specified, with call sites.

**Ledger (§2 art-anim-audio-feel blocker ④):** *"**screen-shake** + **hitstop-on-landed-hit**
(never catalogued)"* — repeated in §1 UNKNOWN-UNKNOWNS.

**Evidence (A2).** questdata fires it four times, e.g. via `<outcome><id>126</id><set>24</set>`
and `<set>48</set>` (values 24 ×2, 48 ×2). Stat 126 is dispatched in
`shs3_android_payload/scripts/StatsManager.as:3532`:

```
               if(id == 126)
               {
                  StageManager.startShake(val);
                  return;
               }
```

and the algorithm is `StageManager.as:1200-1227`:

```
      public static function startShake(shakeDuration:int, shakeAmt:int = 30) : *
...
            shakeAmount = Math.min(screenShakeAmt,screenShakeCounter);
            gameStage.x = screenShakeStartPos.x + (-shakeAmount / 2 + Math.random() * shakeAmount);
            gameStage.y = screenShakeStartPos.y + (-shakeAmount / 2 + Math.random() * shakeAmount);
```

**Verified present in the WEB v0.717 build**, obfuscated:
`shs3_payload/scripts/§1t1525s0§.as:1329` — `public static function §1t9960s0§(param1:int, param2:int = 30)`
(the web version additionally guards re-entry: `if(§1t9956s0§ && §1t9958s0§ > param2) return;`).
The web build also carries an `Obj_Shake` room object,
`shs3_payload/scripts/§1t8566s0§.as:9-11` — `shakeDuration:int = 24; shakeAmt:int = 30;`
triggered at `abs(x - target.x) < 50`.

**Full spec:** uniform-random 2D offset, amplitude `min(amt, framesRemaining)` px peak-to-peak
on **both** axes, default `amt = 30`, default duration **24 frames**, story beats use **24 and 48**,
stage position restored exactly on the last frame.

**Verdict: HELD. Ledger overturned.** Screen-shake is no longer a gap; it is a 4-line port.

---

## Q-05 — "ALL AUDIO is INFERRED" is over-stated: the music cue map and the SFX event vocabulary are held.

**Ledger (§2 art-anim-audio-feel):** *"**all audio** (SFX + music params)"* is *the* blocker;
§4 blocker ① *"**ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced."*

**Evidence (A2).** questdata drives audio through two stat channels:

* `<outcome><id>111</id><set>N</set>` — **47 music cue events**, 7 distinct tracks:
  `{2, 5, 7, 12, 14, 15, 16}`.
* `<outcome><id>112</id><set>0</set>` — 4 SFX stings; plus **23 in-cutscene `<action>sound</action>`
  events** with `<param>` ∈ {1,2,3} and an exact `<time>`.

Dispatch, `StatsManager.as:3416` and `:3423`:

```
               if(id == 111)
               {
                  SoundManager.instance.playMusic(val);
...
               if(id == 112)
               {
                  if(val == 0) { SoundManager.instance.playGoodKoto(); }
                  else if(val == 1) { SoundManager.instance.playDie(); }
                  else if(val == 2) { SoundManager.instance.playHit(); }
                  else if(val == 3) { SoundManager.instance.playDeflect(); }
```

Track names, `MusicManager.as:12-46` — **18 named presets**:
`NONE 0 · EXPLOREBATTLE 1 · TOUGHBATTLE 2 · QUIET 3 · EXPLORESAFE 4 · EXPLOREDANGER 5 ·
EXPLORETOWN 6 · DUNGEONBATTLE 7 · PVP 8 · DUNGEON 9 · DUNGEONCREEPY 11 · DUNGEONCREEPYDANGER 12 ·
DOJO 14 · BATTLEDRUMS 15 · DUNGEONDANGER 16 · GANGNAM 100 · LEVELUP 101 · LOSE 102`.

So the campaign's 7 cues decode to **TOUGHBATTLE, EXPLOREDANGER, DUNGEONBATTLE,
DUNGEONCREEPYDANGER, DOJO, BATTLEDRUMS, DUNGEONDANGER**.

SFX manifest, `SoundManager.as` (11 emitters):
`playMusic · playSlash · playDie · playHit · playHurt · playHitMetal · playDeflect · playFart ·
playGoodKoto · playSumo · playRefund`.

Automatic music selection is also specified — `SoundManager.pickMusic(bg, isHostile, isPvP)`
switches on `GameStage.BG_DUNGEON / BG_CAVE / BG_CAVELAKE / BG_CAVELAVA / BG_MINE /
BG_JINMAKU_NIGHT / BG_ANCIENTRUINS`.

**Verdict: PARTIAL — and the ledger is materially wrong.** The **cue sheet, the track taxonomy,
the SFX event vocabulary and the automatic-selection rule are HELD**. What remains unheld is only
the *waveforms*, which are held-but-encrypted (Stage-0 S0-5: `113_Mobile_MusicResource`,
`122_Mobile_SoundResource` are nested `CWS` blobs). "All audio is INFERRED" should be replaced by
"all audio **rendering** is inferred; all audio **triggering** is measured."

---

## Q-06 — quests-story blocker ③ ("trigger types + coords, sampled not tabled") is fully tabled.

**Ledger (§4 quests-story blocker ③):** *"per-quest trigger types + coords + rewards (sampled,
not tabled)."*

**Evidence (A2).** The step-level `<action>` int is **`GameEngine`'s mode enum**, passed straight
through by `QuestEngine.startBattleMode` → `GameEngine.initBattleMode(quest, questStepData.action, ...)`
(`QuestEngine.as:1216`). Enum, `GameEngine.as:81-109`:

```
      internal static var ACTION_NOTHING:int = 0;   ACTION_FIGHT = 1;   ACTION_ASSASSINATE = 2;
      ACTION_ESCORT = 3;  ACTION_SURVIVE = 4;  ACTION_REACHMARKER = 5;  ACTION_DUEL = 6;
      ACTION_ADVENTURE = 7; ACTION_HARVEST = 8; ACTION_SURVIVALMODE = 9; ACTION_WARROOMBATTLE = 10;
      ACTION_PLAYBACK = 11; ACTION_PVPROOM = 12; ACTION_CUTSCENE = 13; ACTION_SURVIVECLEANUP = 14;
```

questdata's 215 step actions therefore decode exactly:
**169 × NOTHING · 37 × FIGHT · 5 × DUEL · 3 × SURVIVECLEANUP · 1 × SURVIVE.**

Coords are equally tabled: 225 `<roomobj>` rows (29 distinct `<room>` ids, 15 distinct object ids,
407 nested `<obj>` with `<x>`), 51 distinct `<node>` ids, 14 `<teleportnode>` + 14 `<teleportposx>`,
and 77 `<reward>` blocks (69 `<exp>`, 19 `<loot>`).

**Verdict: HELD. Ledger overturned.**

---

## Q-07 — Combat stage geometry: default width 1000, spawn x=400, duel 150 vs 650.

**Evidence (A2).** `XMLQuestStep.as:126-134` — `stagewidth` defaults to **1000** when the tag is
absent; `grep -c '<stagewidth>' questdata.xml` → **0**, so *every* story fight in the campaign
runs on the **1000 px default stage**. Same class: `teleportPosX` defaults **150**; `ap` defaults
**0** (`grep -c '<ap>'` → 0 ⇒ **story quest steps cost no AP**); `stagedesign` defaults 0;
`failtext` unused.

`QuestEngine.as:1214-1219`:

```
         var startingPosX:int = 400;
         if(questStepData.action == 6)
         {
            startingPosX = 150;
         }
```

and `DuelModeUI.as:417-423` — `startingPosX = 150`, else `650`, with
`GameEngine.initBattleMode(-1, 6, bg, 1000, 0, wavelist, startingPosX)`.
`XMLQuestWave.initRecordedDuel()` hardcodes `<enemy><id>700</id><x>150</x>` and
`<id>701</id><x>650</x>`.

**Duel start separation is exactly 500 px on a 1000 px stage; PvE fights start the player at x=400.**

Adventure rooms are wider: authored `<obj><x>` in questdata range **−1000 … 5000**
(max values 2100, 3000, 5000), and room width comes from node data, not `<stagewidth>`
(`QuestEngine.as:1249` — `roomData[roomid].getWidth()`).

**Verdict: HELD.** Lands on combat-core's "reach cap in px" problem as the missing *scale*:
reach is now expressible as a fraction of a known 1000 px stage.

---

## Q-08 — Enemy spawn geometry: ±40 px compounding jitter + uniform-random id pools.

**Ledger (§4 enemies-ai blocker ④):** *"aggro/leash/spawn geometry."*

**Evidence (A2).** `NPCManager.as:110-128`:

```
               qty = int(wave[i].enemy[j].qty);
...
                  npcIdStrArray = wave[i].enemy[j].id.split("|");
                  if(npcIdStrArray.length == 1) { id = int(npcIdStrArray[0]); }
                  else { id = int(npcIdStrArray[int(Math.random() * npcIdStrArray.length)]); }
                  cacheNPCData(id);
                  if(xpos != "")
                  {
                     xpos = int(int(xpos) + Math.random() * 80 - 40).toString();
                  }
                  enemyWave[i].push(new NPCHolder(id,fatal,xpos,lvl));
```

Two mechanics fall out, both invisible without reading questdata *and* the spawner:

1. **Pipe-delimited id = uniform random pick per unit.** questdata uses this heavily — e.g.
   `questdata.xml` wave rows carrying `<id>19|20|21|22|23|24</id>` appear **74 times**
   (Soldier pool), `40|41|42|43|44|45` 12× (Cultist pool), `11|12|13|14|15|16` 10× (Bandit pool),
   `89|86` 5× (Undead pool). Mobs are drawn **per spawned unit**, not per row.
2. **The jitter compounds.** `xpos` is *reassigned* inside the `qty` loop, so a `qty=8` row is a
   **random walk** of 8 steps in `[-40, +40)` from the authored `<x>` — not 8 independent
   ±40 offsets. A crowd therefore smears outward with distance from the anchor.
   `<friend>` and `<neutral>` rows get **no jitter at all** (same file, lines 137-176) — allied
   NPCs stand exactly where authored.

**Verdict: HELD.**

---

## Q-09 — The campaign difficulty curve, per episode, exact.

**Evidence (A2).** Derived by walking `<quest>` → `<wave><enemy><lvl>`, ids resolved through
`docs/gauntlet/L0/index/resolved_names.json`:

| episode | enemy levels | notable |
|---|---|---|
| Prologue | (unset) / 3 / 4 | Ruffian, Thug, Jinbei |
| Ep1 | 6 | Bandit pool ×4, ×8; **Inokichi** |
| Ep2 | 7–8 | Bounty Hunter 1+2 (lvl 7); **Tadao** |
| Ep3 | 11 | **Chikako** |
| Ep4 | 15 | **Aboshi** |
| Ep5 | 15 | Cultist pool ×4/×5/×8/×10 |
| Ep6 | 17–20 | Undead ×10; **Aboshi lvl 20** |
| Ep7 | 20–22 | **Mad Cultist lvl 22** |
| Ep8 | 23–25 | **Guardian lvl 25** |
| Ep9 | 25 | **Magoichi lvl 27** |
| Ep10 | 27 | **Yohei lvl 29** |
| Ep11 | 29–30 | **Magoichi lvl 35** |
| Ep12 | 25–30 | **Amaya lvl 30**, **Gojo Takamori lvl 35** |

151 `<enemy>` rows, 36 distinct id-expressions, `<qty>` ∈ {1,2,3,4,5,6,8,10}.

This is the whole PvE encounter design — the ledger scores enemies-ai **34** and calls
"per-enemy HP" and "enemy level→stat formula" the blockers; the *encounter* half of that
system is now fully specified, and the campaign is shown to run to **~L35**.

**Verdict: HELD.** Bears directly on §6's *"L11–80 XP curve — no table published; a solo build
likely can't reach L11+"* — the shipped campaign demonstrably requires the L11–35 band, so the
curve is a real, load-bearing gap, not a theoretical one. (The curve itself remains unheld here.)

---

## Q-10 — Four combat factions and a non-lethal flag.

**Evidence (A2).** `XMLQuestWave.as:8-14` declares **four** rosters: `enemy`, `friend`,
`neutral`, `objective`. questdata uses three: 151 `<enemy>`, 70 `<friend>`, 2 `<neutral>`
(`<id>118</id>` = Training Dummy). `<objective>` is engine-supported but **unused** in the
campaign (`grep -c '<objective>'` → 0).

`<fatal>` appears on 16 enemy rows and **59 friend rows**, always `0`
(`questdata.xml:87` — `<fatal>0</fatal>`), passed straight into `new NPCHolder(id,fatal,xpos,lvl)`.
Escort companions are therefore explicitly **flagged unkillable** rather than merely tough.

**Verdict: HELD.** Neither the four-faction model nor the non-lethal flag appears anywhere in the ledger.

---

## Q-11 — Survive-the-timer boss mode: `action` 4/14 + `<endless>1</endless>` + 30/120 s.

**Evidence (A2).** Exactly 4 step-level `<time>` values exist — **120, 120, 120, 30** — and each
sits on a step whose wave carries `<endless>1</endless>` and whose `<action>` is **4 (SURVIVE)**
or **14 (SURVIVECLEANUP)**:

| line | action | time | step title |
|---:|---:|---:|---|
| 11675 | 14 | 120 | Defeat Gojo Takamori |
| 18086 | 14 | 120 | Head to the Western perimeter of the camp |
| 25315 | 14 | 30 | Stop Takamori |
| 26086 | 4 | 120 | Stop the ritual |

`time` is forwarded as the battle timer: `GameEngine.initBattleMode(quest, action, bg,
stagewidth, questStepData.time, wave, startingPosX)` (`QuestEngine.as:1220`).

**Verdict: HELD.** A whole encounter archetype (timed endless-wave survival, with a distinct
"cleanup" variant) absent from the ledger's quest archetype taxonomy.

---

## Q-12 — Reward/loot semantics, incl. the wiring behind items-equipment blocker ①.

**Evidence (A2).** `Overworld.endQuestStep()` (`Overworld.as:317-368`):

```
                  lootLevel = StageManager.getCurrentNodeLevel();
...
                  if(loot.id.indexOf(",") == -1) { item = null; lootType = int(loot.id); }
                  else { item = Item.parseNoQty(loot.id); item.setQuantity(qty); }
                  if(chance == 100 || Math.random() * 100 < chance)
...
                     else if(lootType == 0 || lootType == 11) { overworldHUD.lootDialog.addLootCoins(qty); }
                     else if(lootType == 1) { overworldHUD.lootDialog.addLootCoins(5 * qty); }
                     else if(lootType == 50007) { StatsManager.changeStat(50007,qty); }
                     else if(qty > 0) { overworldHUD.lootDialog.addLootItem(lootType,lootLevel,qty); }
                     else if(qty < 0) { StatsManager.changeStat(lootType,qty); }
```

Decoded rules:

* `<id>0</id>` and `<id>11</id>` = **coins**; `<id>1</id>` = **coins × 5**.
* `<qty>-1</qty>` = **remove from inventory** — this is how quest items are consumed
  (`questdata.xml:762` `<id>20108</id><qty>-1</qty>` returns a Crane Feather).
* A comma in the id makes it an **item-instance string**, not an id.
  Sole occurrence in questdata, `:2603`: `<id>13022,82@1#</id>` → item 13022 = **Pickaxe**,
  parsed by `Item.parseNoQty` — the item **serialization format** ledger §6 says has "nothing to copy".
* **`addLootItem(lootType, lootLevel, qty)` where `lootLevel = getCurrentNodeLevel()`** — quest
  item rewards are rolled at the **current node's level**. That is the missing *wiring* for
  items-equipment blocker ① ("item stat-magnitude **vs level** curve"): level comes from the
  world node, not the player.
* `<chance>` is a probability in 0..1 (`chance = loot.chance * 100`); all 19 questdata loot rows
  use `1` (guaranteed).

**Verdict: HELD.**

---

## Q-13 — Economy: the bounty poster promises 100 coins; the payload pays 30.

**Evidence (A2).** `questdata.xml:3896-3902` (the Bounty Board poster copy the player reads):

```
        Wanted dead for multiple counts of robbery and murder
        <br/>
        Reward: 100 coins
```

`questdata.xml:4161-4179` (the turn-in step, "Turn in Inokichi's Club at the Bounty Board"):

```
    <reward>
      <exp>750</exp>
      <loot>
        <id>0</id>
        <qty>30</qty>
```

`<id>0</id>` = coins (Q-12). **The shipped payout is 30 coins + 750 XP against poster copy of 100.**

Relevant to economy blocker ① *"coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**)"*:
this is a first hard coin figure for a *quest* faucet, and a warning that in-game copy is not a
reliable numeric source in this title.

**Verdict: HELD.**

---

## Q-14 — Progression: the full quest-XP income table (69 rows, 79,890 XP).

**Ledger (§4 progression blocker ④):** *"full XP-income model (quest/gather/dungeon, not just kills)."*

**Evidence (A2).** 69 `<exp>` rows, distribution:

| XP | rows |
|---:|---:|
| 1000 | 27 |
| 2000 | 19 |
| 600 | 8 |
| 500 | 3 |
| 250 | 3 |
| 200 | 3 |
| 3000 | 2 |
| 100 | 2 |
| 750 | 1 |
| 290 | 1 |

**Total campaign quest XP = 79,890.** (Example row: `questdata.xml:215` `<exp>290</exp>`.)
Against the ledger's known L1–L10 caps (550 … 31,400), the story alone supplies ~2.5× the
L1–L10 budget — consistent with Q-09's requirement that the player reach ~L35.

**Verdict: HELD.** The quest branch of the XP-income model is closed; gather/dungeon branches remain open.

---

## Q-15 — quests-story blocker ④ answered: choices are almost never consequential.

**Ledger (§4 quests-story blocker ④):** *"are player choices consequential?"*

**Evidence (A2).** Of **469** `<choice>` nodes:

* **462** have only a `<goto>` — pure dialogue branching that reconverges on a `<label>`.
* **7** carry a `<condition>` (they *gate visibility*, they do not create consequence), e.g.
  `questdata.xml:2179-2183`:

  ```
          <text>(Fighting Tutorial) I may be able to learn something here.</text>
          <goto>10</goto>
          <condition>
            <completedquest>!4</completedquest>
  ```
* The only persistent-stat write reachable from a branch is `STAT_CHIKAKOLOVE`
  (`StatsManager.as:246` — `internal static var STAT_CHIKAKOLOVE:int = 42;`), and questdata writes
  it **three** times — once per branch of the *same* option — **all `<modify>1</modify>**
  (`questdata.xml:8776-8798`). Being rude to Chikako and thanking her both give **+1**.

**Verdict: HELD. The answer is "no".** Branching is cosmetic; a recreation can implement the
dialogue tree as pure presentation and lose nothing. (One real romance stat exists and is
incremented by the scene, but not *by the choice*.)

---

## Q-16 — The condition grammar, in full (7 comparators, quest-step pairs, `!` negation, skill-slot check).

**Evidence (A2).** `StatsManager.checkCondition(id, val, comparison)` (`StatsManager.as:4214-4290`):

```
         if(comparison == "rand") { return Math.random() * id <= val; }
...
            if(id == 63)   // is skill `val` in a skill slot?
...
            if(id == 64)   // playerPanelDisplay.isFriend
            if(id == 65)   // playerPanelDisplay.facetoface
...
            case "eq": ... case "gte": ... case "gt": ... case "lt": ... case "lte": ... case "not":
```

and `StatsManager.as:4184-4212` for quest predicates — `<completedquest>` accepts a leading `!`
for negation, `<activequest>` is **OR**-combined while `<completedquest>`/`<has>` are **AND**-combined.

questdata's usage: `<comp>` ∈ {eq ×5, gte ×2, gt ×1, not ×1}; 97 `<activequest>` (values are
`quest,step` pairs — e.g. `44,10`, 4×); 17 `<completedquest>` incl. `!4`, `!5`.

Two decoded reads that matter:

* `questdata.xml:2415-2419` — `<has><id>63</id><qty>1042</qty><comp>eq</comp></has>` is **not** an
  inventory check; id 63 means *"skill 1042 is equipped in a slot"*. Skill 1042 =
  **Chi Punch** (`resolved_names.json`, `skilldata.xml:1283-1285`) — matching the adjacent line
  `questdata.xml:2435` "Now use the Chi Punch Skill on this training dummy."
* `questdata.xml:829-831` — `<has><id>25</id><qty>0</qty><comp>gt</comp></has>` = **STAT_DAN > 0**
  (`StatsManager.as:220`): a dialogue branch gated on having **rebirthed at least once**.

Also `<option><text>auto</text>` (2 occurrences, `questdata.xml:2411`, `:2647`) is an
**auto-branch** — the engine picks the first condition-satisfying `<choice>` with no player input.

**Verdict: HELD.**

---

## Q-17 — §6's "save format — nothing to copy" is half wrong: the persistence field set is enumerated.

**Ledger (§6):** *"**Server-sim topology & save format** — nothing to copy; design a
single-player persistence schema from the observed field set."*

**Evidence (A2).** The field set is not "observed", it is **declared**, with stable ids that
questdata writes to by number. `StatsManager.as:170-260` (excerpt):

```
      internal static var STAT_HP:int = 0;      STAT_MAXHP = 1;   STAT_HPREGEN = 2;
      STAT_CHI = 3;  STAT_MAXCHI = 4;  STAT_CHIREGEN = 5;  STAT_ATTACK = 6;  STAT_DEFENSE = 7;
      STAT_SPEED = 8;  STAT_XP = 9;  STAT_LEVEL = 10;  STAT_GOLD = 11;  STAT_HGOLD = 12;
      STAT_AP = 13;  STAT_MAXAP = 14;  STAT_DUELTOKENS = 15;  STAT_MAXDUELTOKENS = 16;
      STAT_SKILLPOINTS = 17;  STAT_STATPOINTS = 18;  STAT_LOCATION = 19;  STAT_WINS = 20;
      STAT_SIDE = 21;  STAT_WARMOVES = 22;  STAT_WARMOVESMADE = 23;  STAT_WARCOINSDONATED = 24;
      STAT_DAN = 25;  STAT_MARKEDNODE = 26;  STAT_DRAW = 27;
      STAT_FIREATK = 28; STAT_WINDATK = 29; STAT_WATERATK = 30; STAT_EARTHATK = 31;
      STAT_COINSINBANK = 36;  STAT_ISFEMALE = 37;  STAT_BUFFTYPE = 38;  STAT_BUFFEXPIRY = 39;
      STAT_BUFF2EXPIRY = 40;  STAT_PAIDSTORAGE = 41;  STAT_CHIKAKOLOVE = 42;  STAT_LOCATION_ROOM = 43;
      STAT_FIREDEF = 200; STAT_WINDDEF = 201; STAT_WATERDEF = 202; STAT_EARTHDEF = 203;
      STAT_CRITICALDMG = 204; STAT_PIERCINGDMG = 205;
```

questdata writes ids 42 and 43 directly (`<outcome><id>42</id>` ×3, `<id>43</id>` ×5 with
`<set>` ∈ {23,26,27,28} = room ids). Note **STAT_AP = 13 / STAT_MAXAP = 14** confirms §3.6's
AP-as-third-resource correction, and **204 CRITICALDMG / 205 PIERCINGDMG** are two damage stats
the combat ledger does not list.

**Verdict: PARTIAL.** The **field set + id namespace is HELD** (design work the ledger assumed
had to be invented); the **wire/serialization format** genuinely remains unheld (it lived in
Player.IO BigDB). §6's bullet should be split accordingly.

---

## Q-18 — The cutscene DSL: 15 verbs on a 10 Hz clock, identical in the web v0.717 build.

**Evidence (A2).** 55 `<cutscene>` blocks / 399 `<data>` rows. Verb histogram:
`anim 107 · walk 76 · create 75 · end 33 · sound 23 · say 16 · createprojectile 16 · face 13 ·
remove 10 · removeemitter 7 · addemitter 7 · pose 6 · darkblur 6 · setposition 3 · createobject 1`.

Clock — `XMLQuestCutscene.as:27` + `:42`:

```
         this.timer = new Timer(100);
...
         while(this.nextRun <= this.timer.currentCount / 10)
```

⇒ `<time>` is **seconds at 0.1 s resolution**; questdata uses 35 distinct values, 0 … 8.
**Confirmed byte-for-byte in the web v0.717 payload**: `shs3_payload/scripts/§1t3646s0§.as:27`
`this.timer = new Timer(100);` and `:42` `this.§1t3649s0§ <= this.timer.currentCount / 10`.

Verb parameter grammar, `CutsceneActor.as:182-281`:
`walk` = `destX, walkSpeed, anim, endPose, endPoseFrame` — so `questdata.xml:114`
`<param>350,-4,walk,shoulderweapon</param>` reads *walk to x=350 at −4 px/frame playing "walk",
settle into pose "shoulderweapon"*. `pose` = `poseName, frame`. `addemitter` =
`bodyPartIndex, emitterType, angleVariance` (the **blood emitter**, `bloodEmitter` in that file).
`darkblur` = `ColorCode.makeDark_blur(mcs, -200, 4)` — an exact two-parameter FX call, relevant to
the ledger's "FX **blend modes**" blocker.
`say` param is a `LangManager.getString(int(param))` id — and it **resolves**:
`questdata.xml:102` `<param>9006</param>` → `docs/gauntlet/L0/index/strings.json["9006"]` =
*"Psst! Boys, it's time to look lively! We've got ourselves another one!"*
(caveat: `9000` does **not** resolve — the string table is not 100% complete for cutscene speech).

**Verdict: HELD.**

---

## Q-19 — The art asset manifests nobody has: 68 dialogue portraits, 16 story cards.

**Evidence (A2).** 1,892 `<img>` references on `<dialogue>` resolve to **68 distinct portrait
assets**, with named emotional variants — top of the list:
`kojuro 213 · yuudai 210 · satoshi_serious 209 · fumio 177 · satoshi 176 · chikako_mask 77 ·
hiroshi 65 · hachimaru 65 · mitsuo 52 · fumio_happy 52 · chikako 47 · yasuka 41 …`
plus `mitsuo_dying`, `chikako_blush`, `chikako_angry`, `satoshi_drunk`, `takamori_undead`,
`ladyoiwa_snake`, `magoichi_masked`, `yuudai_before`, `yasuka_hurt`, and the sentinel `noportrait`.

Separately, 16 **full-screen story cards** via step-level `<img>`:
`_exposition`, `_episode0` … `_episode12` (13 cards), `_epilogue`, `_exposition_epilogue`.

One byte-exact UI colour also falls out — `questdata.xml:3908`:

```
          <font color="#b048f8">Inokichi's club</font>
```

**`#b048f8` is the quest-item highlight colour inside dialogue body text.**

**Verdict: HELD.**

---

## Q-20 — S0-3's parity caveat is NARROWED: questdata is byte-identical web ↔ Android.

**Stage-0 caveat (S0-3):** *"this is the ANDROID build, clientVersion 0.682 … vs the web build's
v0.717. Data-XML row counts match exactly; UI copy and combat tuning parity is NOT established."*

**Evidence (A3).**

```
$ cmp reference/extracted/questdata.xml reference/extracted/android/116_Mobile_QuestData.bin
cmp: EOF on reference/extracted/questdata.xml
$ md5 -q reference/extracted/questdata.xml
856a045c7766bf365303260ba69cfe5b
$ head -c 796383 reference/extracted/android/116_Mobile_QuestData.bin | md5 -q
856a045c7766bf365303260ba69cfe5b
$ tail -c 3 reference/extracted/android/116_Mobile_QuestData.bin | xxd
00000000: 613e 0a                                  a>.
```

The Android blob is the web file **plus one trailing `0x0A`**. Row counts don't merely "match" —
the bytes are the same.

**Verdict: HELD.** For the **quest domain specifically**, anything resolved through the Android
bundle (node ids, string ids, item/npc/skill ids) is directly valid against the web payload.
This is the bridge that makes `112_Mobile_NodeData` usable against web quest steps — e.g. quest 0
step 1 targets `<node>8382465</node>` `<room>0</room>` `<bg>4</bg>`, and
`reference/extracted/android/112_Mobile_NodeData.bin` opens with
`<node><id>8382465</id>…<room><id>0</id><bg>4</bg><width>800</width>` — matching bg, and giving
that room a measured **width of 800 px**. (Does **not** extend to UI copy — see Q-02.)

---

## Q-21 — A second quest corpus exists, 640 lines, absent from questdata.xml.

**Evidence (A2).** `reference/extracted/android/118_Mobile_Lang_EN.bin` (UTF-16LE XLIFF) holds
**640 `IDS_Q<q>S<s>NODE<n>` entries spanning 52 quests (Q0–Q51)** whose text appears nowhere in
`questdata.xml`. Raw rows:

```
<trans-unit id="2017" resname="IDS_Q9S0TITLE">
<source>Talk to merc captain</source>
</trans-unit>
<trans-unit id="2018" resname="IDS_Q9S0NODE0">
<source>Mission: Raid on Aka Ryu Granary</source>
</trans-unit>
```

```
<trans-unit id="2498" resname="IDS_Q49S0NODE0">
<source>Try to survive and defeat as many soldiers as you can !</source>
</trans-unit>
```

Content breakdown: **Q9–Q48 = 40 clan-war raid missions, 10 per clan**
(Aka Ryu, Aoi Hoiru, Midori Ken, Ki Sensu); **Q49** is the Survival-Mode brief (ties to Stage-0
S0-1's `bindata 119 <survivalmodedata>`); Q0–Q8, Q50, Q51 are tutorial / dojo-challenge /
duel-solicitation / rescue dialogue ("I found you unconscious in the forest", "Give me your money
or die!").

These reach the same engine: `LangManager.getQuestString()` (`LangManager.as:95-107`) resolves any
value beginning `ID` through `Locale.loadStringEx`, so a localized questdata would carry
`<text>IDS_Q9S0NODE0</text>` where ours carries English.

**Verdict: HELD.** Directly feeds meta-social blocker ③ *"achievements list, daily-reward table,
token costs"* and its 31/100 score: the **clan-mission content** is held. Caveat: this family is
Android-sourced and its *presence in the v0.717 web build is not established* (unlike questdata itself, Q-20).

---

## Q-22 — Rebirth: the ledger's Dragon Dance mechanism is wrong.

**Ledger (§4 rebirth-elements, Surface):** *"Dragon Dance unlocks at 3×/6× same-element rebirths
— explains why point-stacking matters."* Blocker ④: *"Dragon Dance **input** + Kanji-statue bonus."*

**Evidence (A2).** In the shipped campaign, Dragon Dance **steps** are learned from a
**three-statue treasure hunt**, not from rebirth counts. `questdata.xml:15769-15788`:

```
    <roomobj>
      <room>0</room>
      <id>57</id>
      <name>statue</name>
      <x>550</x>
      <property>5</property>
    </roomobj>
    <action>0</action>
    <title>Examine the statue</title>
    <reward>
      <exp>1000</exp>
    </reward>
    <intro>
      <text>You learnt a new dragon dance step!</text>
```

repeated at `:15797-15808` (`<x>900</x>`, `<property>7</property>`, *"That's all of them, then."*).
The quest-giver spells out the count — `questdata.xml:15729`: *"Yup! There are three of 'em in
all, scattered around the countryside."* A **Dragon Dance Scroll** (item **2211**, desc *"A strange
scroll from Kojuro"*) is separately a quest reward at `questdata.xml:14580-14584`.

**Verdict: PARTIAL — ledger corrected.** The acquisition path is HELD (Kanji-statue quest chain
+ Kojuro's scroll, 3 statues, roomobj id 57). The **input** (the gesture that performs the dance)
is still unheld, and the rebirth-count theory is unsupported by any artifact I found.

---

## Q-23 — STILL_UNHELD: the `<node>` integer → world-coordinate encoding.

51 distinct `<node>` values, range **8,382,465 … 8,910,829**. These are clearly packed
(8382465 = 0x7FE001), and the frame
`reference/frames/zFtCaTO0_1M/seg-01/frames/frame_0010.jpg` displays the game's own coordinate
readout — **"TERRITORY (21,51) / INSIDE SECTOR (2,3)"** — so a mapping exists. I could not find
the pack/unpack function: `grep -rn "4096" reference/decompiled/shs3_android_payload/scripts/*.as`
returns nothing, and `MapNode.as` / `NodeGenerator.as` / `OverworldMap.as` carry no shift or
modulo arithmetic on node ids.

**Verdict: STILL_UNHELD.** world-exploration blocker ① ("world bounds + geography") therefore
survives this survey. Recommended next probe: `112_Mobile_NodeData.bin` has 535 ids and 372 `<x>` —
regress node id against known territory/sector pairs there, not in questdata.

---

## Scoreboard impact (questdata lane only)

| Ledger claim | Status after this survey |
|---|---|
| §6 "Verbatim dialogue … the actual script is gone" | **OVERTURNED** (Q-01) — with a hard caveat (Q-02) |
| §6 "Server-sim topology & save format — nothing to copy" | **HALF-OVERTURNED** (Q-17) |
| §3.8 / §4 "Ep4–12 likely never shipped; scope = Prologue–Ep3" | **OVERTURNED** (Q-03) |
| §2/§4 art-anim "screen-shake … never catalogued" | **OVERTURNED** (Q-04) |
| §2/§4 art-anim "**ALL AUDIO** … INFERRED" | **MATERIALLY WRONG** (Q-05) — triggering is measured |
| §4 quests-story ③ "trigger types + coords, sampled not tabled" | **OVERTURNED** (Q-06) |
| §4 quests-story ④ "are player choices consequential?" | **ANSWERED: no** (Q-15) |
| §4 enemies-ai ④ "aggro/spawn geometry" | **CLOSED for spawn** (Q-08, Q-09) |
| §4 progression ④ "full XP-income model" | **quest branch closed** (Q-14) |
| §4 rebirth-elements Surface "Dragon Dance = 3×/6× rebirths" | **CORRECTED** (Q-22) |
| §4 world-exploration ① "world bounds + geography" | **STILL_UNHELD** (Q-23) |
| S0-3 caveat "parity NOT established" | **narrowed for questdata** (Q-20) |
