# L0 system survey — **meta-social** (ledger score 31/100)

Surveyor run, 2026-08-13. Document under audit: `docs/research/REBUILD_READINESS.md`
(2026-07-20), §2 table row `meta-social | 31`, §4 block `### meta-social — 31`, and the
§6 "structurally UNRECOVERABLE" list.

**Headline: 31/100 is badly stale. Three of the four §4 blockers are DEAD, one §6 line is
over-claimed, and the survey turned up the string table the whole gauntlet is blocked on.**

The decisive discovery is not a number — it is a **source**. `reference/decompiled/shs3_android/`
is a **fully de-obfuscated decompile of the same codebase** as the obfuscated desktop payload:
553 AS3 classes with real names (`WarHex`, `WarRules`, `StatsManager`, `AchievementUI`, …).
Every meta-social number below was read out of readable source, then **cross-checked against the
obfuscated desktop v0.717 payload** to prove it is not mobile-only.

---

## ⚑ S-META-0 — THE STRING TABLE IS LOCATED (breaks GAUNTLET.md §2.1's standing blocker)

GAUNTLET.md §2.1 / this run's brief: *"item/skill/npc `<name>`, `<desc>`, `<displayname>` and
cutscene `<param>` are NUMERIC IDS indexing a string table NOT YET LOCATED. ui_strings.txt is NOT
it. bindata/ is now EXHAUSTED as a candidate. So numbers are portable today; NAMES ARE NOT."*

**It is not in `bindata/`. It is a `DefineBinaryData` tag inside the Android payload SWF we already
hold** — the search had only ever looked at the desktop payload's bindata folder.

**A2 cite (the pointer):** `reference/decompiled/shs3_android/scripts/Mobile_Lang_EN.as:5`
```as3
[Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]
```
**A2 cite (why it was never fetched at runtime on desktop):**
`reference/decompiled/shs3_android/scripts/LangManager.as:56`
```as3
Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");
```
— on desktop the table is downloaded from the (now dead) server; the Android build **embeds a
cached copy**. That is why it was missing from every desktop-payload sweep.

**A3 — extraction, reproducible:** `reference/decrypted/shs3_android_payload_decoded.swf`,
`DefineBinaryData` (tag 87) **characterId 118, 500,024 bytes**, UTF-16LE XLIFF. Decoded it is a
250,011-char `<xliff version="1.0" xml:lang="en">` with **2,555 `<trans-unit>` entries** —
**1,906 numeric ids (0…9010)** plus **649 `IDS_Q…` quest-string keys**.

```xml
<trans-unit id="0" resname="0">
<source>No</source>
</trans-unit>
```

**Coverage measured against the payload XML we already hold — 100% on every numeric name field:**

| file | field | distinct ids | resolved | max id |
|---|---|---:|---:|---:|
| itemdata.xml | `<name>` | 390 | **390 (100%)** | 4427 |
| itemdata.xml | `<desc>` | 38 | **38 (100%)** | 4405 |
| skilldata.xml | `<displayname>` | 71 | **71 (100%)** | 6141 |
| skilldata.xml | `<desc>` | 148 | **148 (100%)** | 7095 |
| npcdata.xml | `<name>` | 110 | **110 (100%)** | 5122 |

Spot resolutions: `itemdata.xml` id 2100 `<name>4000</name>` → **"Small Soldier Pill"**;
`<desc>4172</desc>` → **"Replenish your AP without waiting!"**; `skilldata.xml` id 1000
`<displayname>6000</displayname>` → **"Light Stance Mastery"**, `<desc>6001</desc>` →
*"Swift but light stance. Slash range is longer but damage inflicted is lower.\nEffective against
Heavy Stance."*

**⚠ HONEST LIMIT — the table is a strict SUBSET of v0.717's.** See S-META-1: the desktop build
references string id **11016/11017**, above this table's ceiling of 9010. Anything the desktop
code asks for at id ≥ 9011 is **STILL_UNHELD**. Every id ≤ 9010 that I tested resolved.

**Recommended follow-up (not done — outside a surveyor's write scope):** extract binaryData 118
to `reference/extracted/strings/shs3_en.xml` and add a test that every `<name>`/`<desc>`/
`<displayname>` id in the four payload XMLs resolves.

---

## ⚑ S-META-1 — THE FRAME BEATS THE ANDROID BUILD: 7 war-rules pages, not 6

**THE FRAME WINS, and I am saying so out loud.**

**A1 cite:** `reference/videos/Nr4fQstqHDM.mp4` @ **t=3300s**, 1920×1080, cropped `(200,80)-(1000,300)`
and upscaled ×2 (also visible at low res in `reference/frames/Nr4fQstqHDM/map/frames/frame_0084.jpg`).
The header reads, unambiguously:

> **WAR ROOM RULES 1/7   (JOINING A BATTLE)**

**A2 cite (Android says 6):** `reference/decompiled/shs3_android/scripts/WarRules.as:23`
```as3
internal var max:int = 6;
```
and string 369 = `"War room rules 1/6  (joining a battle)"`.

**A2 cite (desktop v0.717 says 7):** `reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:23`
```as3
internal var max:int = 7;
```
…:121–123
```as3
case 7:
   this.warrulestitle.text = §1t1521s0§.getString(11016);
   this.warruleswords.text = §1t1521s0§.getString(11017);
```

The desktop class is byte-identical to `WarRules.as` for pages 1–6 (**same string ids 369–380**),
then adds a 7th page at ids 11016/11017. **This is the calibration for the whole Android-decompile
method: the shared id space is trustworthy; the desktop table extends past 9010.** Page 7's content
is STILL_UNHELD.

---

## §4 blocker-by-blocker audit

### Blocker ② — "War-Room **map topology** (board/adjacency)" → **OVERTURNED. HELD.**

The board is a **6×6 hex grid, deterministically generated client-side from the territory id.**

**A2:** `reference/decompiled/shs3_android/scripts/TerritoryData.as:1066-1080`
```as3
var rng:RNG = new RNG(this.territoryID);
var territoryx:int = this.territoryID >> 12 & 0x0FFF;
var territoryy:int = this.territoryID & 0x0FFF;
for(var i:int = 0; i < 6; i++)
{
   sectorBuildArray[i] = new Array();
   for(j = 0; j < 6; j++)
   {
      sectorBuild = new SectorBuild(i,j,territoryx * 6 + i << 12 | territoryy * 6 + j);
```

**A2 (bounds):** `WarHexUI.as:2311-2316`
```as3
if(x < 0 || y < 0 || x > 5 || y > 5)
{
   return 0;
}
return this.terrainArray[x][y].getTerrainValue();
```

**A2 (adjacency is an explicit per-sector exit array):** `WarHex.as:218-222`
```as3
exitArray = OverworldHUD.instance.warUI.warHexUI.terrainArray[this.xpos][this.ypos].getExitArray();
this.narrow.visible = exitArray[0] == 0 && this.ypos != 0;
this.sarrow.visible = exitArray[1] == 0 && this.ypos != 5;
this.earrow.visible = exitArray[2] == 0 && this.xpos != 5;
this.warrow.visible = exitArray[3] == 0 && this.xpos != 0;
```
→ exit order is **[N, S, E, W]**, and the `!= 0 / != 5` guards re-confirm the 0…5 index range.

**A1 CORROBORATION — the frame agrees with the payload.** `reference/videos/Nr4fQstqHDM.mp4`
@ **t=3380s**, full 1920×1080, HUD minimap block right of centre reads:

> **TERRITORY (23,52)** / **INSIDE SECTOR (3,5)**

Sector coordinates in 0…5, exactly as the code bounds them; territory id = `23<<12 | 52`.

**14 hex types are enumerated** — `WarHex.as:11-37`: `HEX_NOTHING 0, HEX_SPAWNPOINT 1,
HEX_FORWARDBASE 2, HEX_CONTROLPOINT 3, HEX_TOWN 4, HEX_POTENTIALSPAWNPOINT 5,
HEX_UPCOMINGSPAWNPOINT 6, HEX_LADDER 7, HEX_DEFENSE 8, HEX_VILLAGE 9, HEX_CITY 11,
HEX_CASTLE 12, HEX_DISABLEDSPAWNPOINT 13, HEX_DEMOLISHEDSPAWNPOINT 15`.
**3 terrain types** — `WarTerrain.as:9-13`: `TERRAIN_FIELD 0, TERRAIN_FOREST 1, TERRAIN_MOUNTAIN 2`.

---

### Blocker ③ — "achievements list, daily-reward table, token numbers — *one Ruffle session closes all*" → **OVERTURNED, ALL THREE, WITHOUT RUFFLE.**

#### ③a Achievements — **61 achievements, complete, with names, descriptions, stat ids and thresholds**

**A2 (the data file):** `reference/decrypted/shs3_android_payload_decoded.swf` binaryData **id 114**
(9,080 bytes) = `<achievementdata>`; pointer class
`reference/decompiled/shs3_android/scripts/Mobile_AchievementData.as`.
Verbatim first row:
```xml
<achievement>
    <id>0</id>
    <img>1</img>
    <name>8000</name>
    <desc>8080</desc>
    <stat>60000</stat>
    <val>1</val>
</achievement>
```
Resolved through the string table (S-META-0), 61 rows, e.g.:

| id | stat | val | name → desc |
|---:|---:|---:|---|
| 0–2 | 60000 | 1 / 50 / 200 | Duelist I–III — Win *n* online duels |
| 3–5 | 60017 | 100 / 1000 / 10000 | Killer I–III — Defeat *n* enemies |
| 6–8 | 60016 | 100 / 500 / 1000 | Eye of the Beheader I–III — Behead *n* enemies |
| 20–22 | 60006 | 1000 / 10000 / 100000 | Big Spender I–III — Spend *n* coins on items |
| 42–44 | 1000/1001/1002 | 10 | Light / Balanced / Heavy Stance Master — Mastery Level 10 |
| 45 | 60022 | 10 | Chi Master — Learn all Chi Skills |
| 46 | 60023 | 9 | Ninja Master — Learn all Ninja Skills |
| 48–51 | 25 | 1 / 2 / 5 / 9 | Rebirth / Renshi / Kyoshi / Ultimate Warrior — Reach Dan 2 / 3 / 6 / 10 |
| 52 | — | 1 | Recruit — Join a clan |
| 53–55 | 60001 | 5 / 9 / 10 | Officer / General / War Hero — Reach *rank* |
| 56–58 | 60018 | 100 / 200 / 340 | Warrior I–III — Defeat *n* in a war room attack |
| 60 | 60025 | 1 | Be Awesome — Completed Season 1 |

(#45/#46 also pin the skill-tree shape: **10 Chi skills, 9 Ninja skills** — a skills-meters datum
that fell out of a meta-social file.)

#### ③b Daily-reward table — **complete, all three tiers**

**A2:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1139-1375`, `case "dailyprize":`
- Streak bookkeeping: `StatsManager.setStat(30018, serverTime + 24 * 60 * 60)`, streak counter
  `30019`, streak breaks if the claim is more than `-172800` s (48 h) late.
- **Base roll: `dice = Math.random() * 36`** — 36 outcomes: `dice <= 4` → 100 coins; 5 → 200 coins;
  6 → 300 coins; 7 → random level-scaled item; 8–35 → fixed item ids
  2115,2116,2117,2118,2140,2141,2119,2120,2100,2125,2103,2104,2105,2106,2107,2108,2109,2110,2111,
  2112,2113,2114,2128,20054,20055,20056,20057,2216.
- **Every 10th consecutive day** (`(streak - 1) % 10 == 0`): `dice = Math.random() * 6` →
  1000 coins / item 2101 / 2105 / 2126 / 2127 / `addRandomLootItem(level,true,true,true)`.
- **Every 30th** (`(streak - 1) % 30 == 0`): `dice = Math.random() * 10` → items
  2130,2131,2132,2133,2135,2136,2137,2138,2139,2146, plus `reportAchievementStat(60015,1)` and a
  **global announcement** (string 862).

String-table corroboration: id 843 `"Every 10 consecutive days: bonus prize!"`,
id 844 `"Every 30 consecutive days: super bonus prize!!!"`.

#### ③c Token numbers — **held**

**A2:** `reference/decompiled/shs3_android/scripts/StatsManager.as:160,166`
```as3
internal static var DTINTERVAL:int = 2 * 60;
internal static var MAXDUELTOKENS:int = 30;
```
…:709-710 `setPlayerStats(STAT_DUELTOKENS,20); setPlayerStats(STAT_MAXDUELTOKENS,20);`
→ **Duel Tokens regenerate 1 per 120 s, start cap 20, hard cap 30**; a 200 % regen buff exists
(string: *"Eat this potato to get the 200% Duel Token Regeneration buff."*).
The premium currency's prices are already on disk: **304 `<heavenlyprice>` rows in
`reference/extracted/itemdata.xml`**, and the shop's premium catalogue is binaryData **id 121**
`<premiumdata>` (`Mobile_PremiumData.as`).

---

### Blocker ① — "**server-authoritative simulation** … **unrecoverable at 1:1**" → **PARTIAL. Over-stated.**

The *live population* is genuinely gone. The **simulation rules are not** — they are client-side and
now fully readable:

- **Deploy** = `deployvalue = 100 * this.getTerrainModifier();` — `WarHexUI.as:1052`.
- **Blocked-adjacent arrow fire** = `num = 80 + Math.random() * 40 * this.getTerrainModifier();`
  — `WarHexUI.as:1104`.
- **Terrain modifier table** — `WarHexUI.as:2286-2306`, keyed on `fromTerrainValue - toTerrainValue`
  (`+2 → 1.5`, `+1 → 1.2`, `0 → 1`, `-1 → 0.75`, `-2 → 0.6`, `-3 → 0.5`, `-4 → 0.25`), with
  `HEX_DEFENSE`(built) / `HEX_CITY` / `HEX_CASTLE` adding **+2 to the defender's value**.
- **Structure costs** — `WarHexUIBuildMenu.as:190-213`: Forward Base **10000**, Tunnels **5000**,
  Barricades **10000**, Town **10000**, Command HQ **free**; build progress =
  `(maxcost - cost) / maxcost * 100` with `maxcost = 10000` (5000 for Tunnels) — `WarHex.as:425,521`.
- **Castle gate window** = `3 * 60 * 60` s — `WarHex.as:499,507,513`.
- **6 actions** — `WarHexUI.as:613-617`: `deploy, attack, move, spy, build` + the implicit
  arrow-fire branch of deploy; each costs `useWarMove(1)`.
- **24 h resolution** — string 376: *"Troops will advance on enemy sectors every 24 hours."*
  This **confirms** the ledger's "24h resolution".
- **Clan side colours** — `WarHexUI.as:1656-1675` (`16711680 / 39168 / 26367 / 16776960 / 16777215`):
  side 1 = `0xFF0000`, 2 = `0x009900`,
  3 = `0x0066FF`, 4 = `0xFFFF00`, neutral = `0xFFFFFF`; custom clans use `getCustomClanColor()`.

What is truly lost is the **hosted state**, not the topology or the rules. Honest scoping: the
ledger's "must be scoped out or rebuilt as a *new* offline AI sim (labeled)" is still the right
call — but "unrecoverable at 1:1" is wrong about the **mechanics**, which are 1:1 available.

### Blocker ④ — "offline gold faucet rate (primary source was dead IAP)" → **CONFIRMED. The ledger is RIGHT.**

I looked for an earn path and there is none in the client. The only `addLootGold` call sites are
`PayUI.as:672` (IAP), `ProviderSelectDialog.as:177` (payment provider) and `StatsManager.as:4734`
(server-pushed gift notification); `reference/extracted/questdata.xml` contains **zero `<gold>`
tags** — quests never award premium Gold. The coin faucet is separately visible (war rules string
372: *"the clan will pay the player 5 coins per move made."*). **Blocker ④ stands as written.**

---

## §4 "Ready" bullets — verification, and one number that needs re-reading

### Rank ladder — **HELD, exactly, and the ledger's own surface note is CONFIRMED**

**A2:** `StatsManager.as:824-867`
```as3
var num:int = getStat(STAT_WARMOVESMADE) + int(getStat(STAT_WARCOINSDONATED) / 1000);
if(num < 12 * 3)
{
   return 0;
}
```
Cumulative thresholds: **36, 84, 180, 324, 516, 816, 1176, 1596, 2076, 5000** (`getWarMovesToNextRank`,
:870-914). Names (`getWarRankName`, :916-964) → string ids 330–339 + 403:
**recruit, private, corporal, sergeant, sergeant major, lieutenant, captain, major, colonel, general,
War Hero** = **11 ranks**, matching the ledger.
Moves per turn (`getMaxWarMoves`, :966-1014): **3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6**.
Turn length: `internal static var WARMOVEINTERVAL:int = 60 * 60;` (:162) → **one turn = one hour**.

→ The §4 surface bullet *"'moves per turn' reconciles as 'per hour' (36 = Private's rank threshold,
not a turn cap)"* is **CORRECT** and is now A2-grounded rather than inferred. Both readings are true
at once: moves refresh hourly (`WARMOVEINTERVAL`) **and** the UI calls them "a turn" (string 329 =
`" moves a turn"`).

**Desktop parity proven:** the identical function, with identical literals, exists obfuscated at
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:1186-1228`.

### "kill cap 350" and "flag +120%" → **STILL_UNHELD as stated; probable mis-transcriptions**

I could not find either number anywhere in the war-room code. What I did find nearby:
- the **war-kill achievement ceiling is 340**, not 350 (`achievementdata` id 58, stat 60018, val 340);
- **1.2** exists as the **terrain** modifier for a one-step elevation advantage
  (`WarHexUI.as:2293-2294`, `case 1: return 1.2;`), not as a flag bonus.

I am not calling the ledger wrong — I am calling these **ungrounded in the payload**. If they came
from wiki text they need a version check; if from a frame, produce the frame.

---

## Surface gaps — meta-social systems the ledger block does not mention AT ALL

### S-META-2 — the war-room **battle content** is on disk, and `bindata/119` was mis-scoped

Stage-0 finding S0-1 called `bindata/119` `<survivalmodedata>` *"an ENTIRE GAME MODE absent from all
12 ledger systems."* **Sharpening it: that file is also the war-room battle wave table**, which puts
it squarely in meta-social.

**A2:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:13`
```as3
internal static const SurvivalModeData:Class = WarHexUI_SurvivalModeData;
```
…:1711-1719
```as3
internal function createWarRoomWaveList(targetside:int) : Vector.<XMLQuestWave>
{
   ...
   var xml:XML = XML(new SurvivalModeData());
```
…:1731-1752 — enemy ids in `[200,600)` are remapped by **clan side**:
`side 1 → base+200, side 2 → base+400, side 3 → base+300, side 4 → base+500,
side 0 / 5 / custom clan → base+600`.

`reference/extracted/bindata/119_1t4646s0.bin` holds **39 `<wave>` blocks / 87 `<enemy>` groups**,
base ids 400–456 plus bosses 700/701/702. So the war-room's *actual fights* — the part a player
touches — are fully specified, and the 4-clan → NPC-id block mapping is recovered too.

Reward rule: `GameEngine.as:1119-1121` — a war-room battle uses `setSurvivalModeLoot()`, i.e.
`LootDialog.as:687-690` **half XP + one random level-scaled item**, and reports
`updateGlobalVar(50006, NPCManager.getTotalKilled())`.

### S-META-3 — an entire online-duel / leaderboard / social layer is missing from the ledger block

The §4 meta-social block names clans, the War Room, Ninja Services, daily login and tokens. It never
mentions the systems the game is *titled after*. Present as named classes in
`reference/decompiled/shs3_android/scripts/`:
`DuelModeUI.as`, `DuelRequestDialog.as`, `DuelSlot.as`, `DuelLeaderboardUI.as`,
`DuelLeaderboardField.as`, `LeaderboardUI.as`, `LeaderboardField.as`, `DuelIntroBar.as`,
`FriendPanel.as` / `FriendItem.as` / `FriendBox.as`, `GiveCoinsDialog.as`, `GiftIcon.as`,
`GotGiftDialog.as`, `CreateClanDialog.as`, `ClanSymbol.as`, `BankUI.as`, `MOTDDialogBox.as`,
`ChangeNameDialog.as`, `HumanCheckDialog.as`, `Tracker.as`, `Kongregate.as`, `EpicAds.as`.

Two of these carry content the ledger's "4 clans" line does not cover:
- **Player-created custom clans exist** — `WarHex.as:117-120` (`StatsManager.isCustomClan(num)` →
  `ownerbg = 7`) and `WarHex.as:174-187`, which recolours the hex, flag and logo from a
  `DatabaseObject` with `color`, `logo`, `logocolor` fields. String 4031:
  *"Form your own clan.\nWar Hero rank required.\n\nIncludes:\n1 Clan General Invitations\n3 Clan Invitations"*.
  So the clan roster is **4 canonical clans + an open-ended custom-clan slot (side 7)**.
- **Achievement 23 "Philanthropist — Give 10000 coins to friends"** proves a live coin-gifting economy.

I am not scoring these; I am flagging that **the 31/100 was computed over a smaller system than the
one that exists.**

### S-META-4 — the original **RNG** is recovered (load-bearing for reproducing any board)

Because the war-room board is `new RNG(territoryID)`, reproducing it 1:1 requires the *original*
generator, not a substitute.

**A2:** `reference/decompiled/shs3_android/scripts/RNG.as:64-67`
```as3
this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
return this.randomSeed / 233280;
```
**Desktop parity:** the identical line at
`reference/decompiled/shs3_payload/scripts/§1t58s0§.as:84`.

Note for whoever owns determinism: `src/core` is currently specified as **mulberry32** (CLAUDE.md).
That is a *different* stream. Any system seeded from a content id (territory boards, procedural
towns, name generation) will **not** match the original unless this LCG is used. Flagging, not ruling.

---

## §6 audit — "structurally UNRECOVERABLE"

| §6 line | verdict |
|---|---|
| *"**The live clan-war** — warring alongside thousands of real players is impossible offline; scope out or build a *new* AI-driven sim."* | **HOLDS as written** — the live population is gone. But it must not be read as "the clan-war mechanics are gone": deploy math, terrain table, structure costs, rank curve, 24 h tick, board generator and 39 battle waves are all recovered above. |
| *"**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."* | **OVER-CLAIMED → PARTIAL.** "Nothing to copy" is false. The persistence layer is enumerable from `reference/decompiled/shs3_android/scripts/QueryManagerPIO.as`: PlayerIO BigDB tables **`PlayerObjects`** (`client.bigDB.loadMyPlayerObject`, :421), **`GeneralData`** with keys `"motd"` (:815), `"TownState"` (:1284), `"WarRoomState"` (:2149, :2321), **`TerritoryData`** keyed by territory id (:1914, :2353), **`TerritoryExtraData`** (:2004), **`WarSentryData`** keyed by `StatsManager.charname` (:2180), plus a per-battle `battleData` object (:1267). The *topology* is copyable; only the hosted rows are gone. |
| *"**The dead IAP economy** — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this."* | **HOLDS** — corroborated independently at Blocker ④ above. |

---

## Explicitly STILL_UNHELD (I looked and did not find it)

1. **War-rules page 7** (desktop string ids **11016 / 11017**) — above the Android table's 9010 ceiling.
2. **Any string id ≥ 9011** generally, including whatever else v0.717 added after the mobile fork.
3. **The 4 canonical clans' identities in the war room** — the code speaks only in side **numbers**
   1–5 and colours; I found no payload row binding side 1 to a named clan. The ledger's
   "heraldry/masks/daimyo/capitals" is not something I could ground here.
4. **"Kill cap 350"** and **"flag +120%"** — not present in the war-room code (see above).
5. **Live matchmaking / population / actual historical map state** — genuinely gone.
6. **A frame of the war-room hex board itself.** I checked the 100-frame `map` segment of
   `Nr4fQstqHDM` (contact sheet + full-res pulls at t=3300 and t=3380). The longplay opens the
   **War Room rules dialog** but I never found a frame showing the board. The 6×6 grid claim rests
   on A2 (code) + the A1 `INSIDE SECTOR (3,5)` HUD readout, **not** on a picture of the board.

---

## Score

**31 → 72.** Of the four §4 blockers, ②/③ are fully closed from artifacts, ① is closed on mechanics
and open only on hosted state, ④ is confirmed unclosable-by-design. The remaining deductions are
real: no named-clan binding, no board frame, page 7 of the rules missing, and an entire duel /
leaderboard / friends / custom-clan surface that was never surveyed and therefore was never scored.

*Method note: every Android-build reading above was cross-checked against the obfuscated desktop
v0.717 payload before being reported (rank curve → `§1t1523s0§.as`; RNG → `§1t58s0§.as`;
WarRules → `§1t7924s0§.as`). Where they differ — the rules page count — **the frame decided it, and
the frame won.***

---
---

# SECOND SURVEY PASS — 2026-08-15

**Scope.** Independent re-audit of the same ledger block, run against the same evidence index.
Everything above is preserved as received. This pass **confirms** most of it, **closes three of its
own STILL_UNHELD items**, and **overturns one of its verdicts** (blocker ④). Where I reproduce a
prior finding from a different artifact I say so; where I contradict, I paste the artifact.

**Headline of this pass:** the ledger's two "Ready" numbers that the first pass could not ground —
**"kill cap 350"** and **"flag +120%"** — are now *positively identified*. One is off by one
(it is **351 = 340 + 11**), the other is a **mis-labelled row of the terrain table**. And the
**world-level war map board is on disk as a 63×72 image that is byte-identical in the web and
Android payloads**, which is the half of blocker ② the first pass did not reach.

---

## M2-1 — "kill cap 350" → **MEASURED: 351 = 340 troops + 11 samurai.** Ledger off by one.

The first pass marked this STILL_UNHELD. It is held — the number is a **sum over the war-room wave
table**, not a constant, which is why grepping for `350` found nothing.

**A2 (the table is the war-room battle content):**
`reference/decompiled/shs3_android/scripts/WarHexUI.as:1711-1720`
```as3
internal function createWarRoomWaveList(targetside:int) : Vector.<XMLQuestWave>
{
   var xml:XML = XML(new SurvivalModeData());
```

**A2 (measured over the WEB v0.717 payload, not the Android one):**
`reference/extracted/bindata/119_1t4646s0.bin` — `<survivalmodedata>`, first `<wave>` at line 3,
556 lines, **39 `<wave>` blocks**. Summing every `<qty>`:

```
$ python3 - (over reference/extracted/bindata/119_1t4646s0.bin)
WEB v0.717 qty by id-block: {400: 340, 700: 11} total 351
```
The Android copy (`reference/extracted/android/109_WarHexUI_SurvivalModeData.bin`) differs in bytes
(11,553 vs 11,721) but yields the **identical** `{400: 340, 700: 11} total 351`. Verbatim head:
```xml
<wave>
  <enemy>
    <id>400|401|402|403|404</id>
    <qty>4</qty>
    <x>-50</x>
  </enemy>
```
The `400` block is the rank-and-file (base ids 400–456, side-remapped per `WarHexUI.as:1731-1752`);
the `700` block is **11 distinct named ids 700–710, qty 1 each** — the "samurai".

**The ledger sentence under audit** (`docs/research/SHSD_MASTER_REFERENCE.md:170`, which
`REBUILD_READINESS.md:244` compresses to "kill cap 350"):
> `| Kill cap (troops) | 350 (= 340 troops + 10 samurai) |`

**340 is exactly right. The samurai count is 11, not 10, so the total is 351, not 350.**
Independently corroborated by achievement 58 — *"Warrior III — Defeat 340 in a war room attack"*
(`reference/extracted/android/114_Mobile_AchievementData.bin`, stat `60018`, `<val>340</val>`),
which caps at the troop-only figure.

---

## M2-2 — "flag +120%" → **POSITIVELY IDENTIFIED AS A MIS-LABEL.** There is no flag bonus.

The first pass said "1.2 exists as the terrain modifier… I am not calling the ledger wrong." I will
call it wrong, because the *rest of the same ledger table* proves where the number came from.

**A2:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:2281-2307`
```as3
internal function getTerrainModifier() : Number
{
   var fromValue:int = this.getTerrainValue(this.selfSentryX,this.selfSentryY);
   var toValue:int = this.getTerrainValue(this.selectedHex.xpos,this.selectedHex.ypos);
   if(this.selectedHex.hextype == WarHex.HEX_DEFENSE && this.selectedHex.cost == 0 || this.selectedHex.hextype == WarHex.HEX_CITY || this.selectedHex.hextype == WarHex.HEX_CASTLE)
   {
      toValue += 2;
   }
   switch(fromValue - toValue)
   {
      case 2:  return 1.5;
      case 1:  return 1.2;
      case 0:  return 1;
      case -1: return 0.75;
      case -2: return 0.6;
      case -3: return 0.5;
      case -4: return 0.25;
      default: return 1;
   }
}
```
with `deployvalue = 100 * this.getTerrainModifier();` (`WarHexUI.as:1052`).

Now read the ledger table it came from (`docs/research/SHSD_MASTER_REFERENCE.md:170-175`):

| ledger row | payload arithmetic | verdict |
|---|---|---|
| `Deploy: field→mountain \| +60 troops` | field(0) − mountain(2) = −2 → 0.6 → **60** | ✅ exact |
| `Deploy: mountain→mountain \| +100 troops` | 2 − 2 = 0 → 1.0 → **100** | ✅ exact |
| `Deploy: field→forest \| +75 troops` | 0 − 1 = −1 → 0.75 → **75** | ✅ exact |
| `Control-point flag bonus \| ×1.20 (120% troop-deploy boost)` | 1.2 is `case 1:` — **one step of terrain advantage** (e.g. forest→field, mountain→forest) | ❌ **mis-labelled** |

Three of four rows are the terrain table. The fourth is the terrain table's `case 1` row wearing the
wrong name. `HEX_CONTROLPOINT` appears nowhere in `getTerrainModifier`; the **only** structure-based
modifier is `toValue += 2` for a *completed* Barricade, a City or a Castle — a **defender** bonus
that pushes the attacker as low as **0.25×**, which is a far more load-bearing number than the
phantom flag bonus and is absent from the ledger entirely.

---

## M2-3 — blocker ②'s other half: the **world** war board is a 63×72 image, byte-identical across builds

The first pass closed the *tactical* board (6×6 sectors). The *strategic* board — which territories
exist at all — is also on disk.

**A2:** `reference/decompiled/shs3_android/scripts/WarSelectUI.as:83-85`
```as3
internal var mapWidth:int = 63;
internal var mapHeight:int = 72;
```
…:153 `this.mapBitmapData = QuestEngine.getMapBitmapData();`
…:173 `return this.mapBitmapData.getPixel(territoryx + TERRSHIFTX - WARMARKERSHIFTX,territoryy + TERRSHIFTY) != 0;`
(`TERRSHIFTX = 21`, `TERRSHIFTY = 51`, `WARMARKERSHIFTX = 8` — :15-19.)
→ **a territory exists iff its pixel is non-zero.** The mask *is* the board.

**A3 — byte-check, pasted output.** Stage-0 finding S0-1 logged web `bindata/92` as "GIF89a 63x72
raster" without identifying it. It is this map:
```
web   b'GIF89a' 63 72 272 bytes  sha256 b9d152c046b66b59…   (reference/extracted/bindata/92_1t4648s0.bin)
andr  b'GIF89a' 63 72 272 bytes  sha256 b9d152c046b66b59…   (reference/extracted/android/110_Mobile_MapBitmapData.bin)
identical: True
```
Decoded: 2-colour palette, **735 non-black pixels of 4,536** → **735 land territories**.

**This retires the Android caveat for the map claim entirely** — the web v0.717 payload ships the
same 272 bytes. Combined with the first pass's 6×6 sector generator, the full topology is:
**735 territories on a 63×72 mask → each a 6×6 sector board → 4-way [N,S,E,W] exits.**

**The ledger sentence this overturns** (`REBUILD_READINESS.md:135`, §2 table, meta-social "missing"
column): *"server-sim topology; **map board**; achievements/daily/token numbers; offline gold faucet"*.

---

## M2-4 — A1: the frame prints the coordinate system

**A1 cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0090.jpg` (512×288 source),
crop `(255,140)-(400,165)`, upscaled ×12 LANCZOS. Visibly, in the quest-detail panel:

> **KAKUCHI CASTLE TOWN, MAIN STREET**
> **TERRITORY (24,52)  SECTOR (3,0)**

Territory x=24 ≤ 62 and y=52 ≤ 71 sit inside the 63×72 mask; sector (3,0) sits inside 0…5.
The same frame also prints a reward line **"TOWN PROSPERITY: +10"** — the town-conversion currency
behind string 626 *"Influence to convert town: "* and string 812 *"Clan influence on town"*, a
meta-social mechanic the §4 block never mentions.

---

## M2-5 — A1: the frame proves the Android string table is v0.717's copy, typo and all

**A1 cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0084.jpg`, crop `(100,50)-(420,250)`
upscaled ×5, and title strip `(100,30)-(420,70)` upscaled ×6. Visible on screen:

> **…ES 1/7  (JOINING A BATTLE)**
> **…IS A CLAN-BASED STRATEGY GAME WITHIN STRAW HAT SAMURAI: DUELS.**
> **…A CLAN, YOU CAN MAY SELECT AN ON-GOING BATTLE TO TAKE PART IN.**
> **…TTLES WILL BE MARKED ON THE WAR ROOM MAP WITH YOUR CLAN'S FLAG.**
> **…TLE IS SELECTED, SELECT THE SECTOR WITH YOUR CLAN'S COMMAND HQ AND SELE…**
> **…ON TO ENTER THE BATTLEFIELD.**

Android string **370** reads, verbatim:
> *"- The war room is a clan-based strategy game within Straw Hat Samurai: Duels.\n\n- After joining a clan, you can may select an on-going battle to take part in.\n\n- On-going battles will be marked on the war room map with your clan's flag.\n\n- Once the battle is selected, select the sector with your clan's command HQ and select the "MOVE" action to enter the battlefield."*

Word for word, **including the original's grammatical error "you can may select"**. A typo is a
fingerprint: this is not a paraphrase, it is the same string. **This is the calibration artifact for
every Android-sourced string in this file.**

I independently reproduce the first pass's page-count finding from the frame file (not a video
timecode): the header reads **1/7** while `WarRules.as:23` says `internal var max:int = 6;`.
**THE FRAME AND THE ANDROID SOURCE DISAGREE, AND THE FRAME WINS — v0.717 has seven pages.**

---

## M2-6 — first pass's STILL_UNHELD #3 is **DEAD**: the four clans are named, led and located

The first pass wrote: *"The 4 canonical clans' identities in the war room — the code speaks only in
side numbers 1–5 and colours; I found no payload row binding side 1 to a named clan."*

The binding is in the string table, and the colours close the loop.

**A2 (names, in side order):** `docs/gauntlet/L0/index/strings.json`, ids **275–278** —
`"Clan Aka Ryu"`, `"Clan Midori Ken"`, `"Clan Aoi Hoiru"`, `"Clan Ki Sensu"`; the parallel
sell-menu run at ids **271–274** repeats the same order.

**A2 (daimyo + domain), ids 324–327, verbatim:**
> 324: *"Clan Aka Ryu is led by Lord Tsuyoshi. … Clan Aka Ryu rules the domain in the North-East."*
> 325: *"Clan Midori Ken is led by Lord Daichi. As the right-hand man to the late Shogun, Lord Daichi has proclaimed himself the rightful Shogun… Clan Midori Ken rules the domain in the South-East."*
> 326: *"Clan Aoi Hoiru is led by Lord Yoshio. … Clan Aoi Hoiru rules the domain in the South-West."*
> 327: *"Clan Ki Sensu is led by Lady Tsubasa. … Clan Ki Sensu rules the domain in the North-East."*

**A2 (side number → colour):** `WarHexUI.as:1077-1089` — side 1 `16711680` = `0xFF0000` **red**,
side 2 `39168` = `0x009900` **green**, side 3 `26367` = `0x0066FF` **blue**, side 4 `16776960` =
`0xFFFF00` **yellow**. Those are the clan names translated: **Aka Ryu = red dragon, Midori Ken =
green sword, Aoi Hoiru = blue wheel, Ki Sensu = yellow fan.** Side order and colour order agree, so
side *n* ↔ clan *n* is fixed. The ledger's "4 clans (heraldry/… /daimyo/capitals)" **Ready** bullet
is now A2-grounded.

**Shira Tancho, story-only — confirmed from the WEB payload**, `reference/extracted/questdata.xml:560`:
> `<text>These crane feathers are symbols of clan Shira Tancho; they'll prove you're speaking on my behalf.…</text>`
(also :514, :550, :630, :658). It never appears as a war side.

### M2-6b — an original-data BUG a 1:1 recreation must decide about
String **327** puts **Ki Sensu in the North-East** — the *same* quadrant string 324 gives **Aka Ryu**.
With Midori Ken South-East and Aoi Hoiru South-West, the vacant quadrant is North-West. This is a
typo **in the shipped game data**, not in our transcription. Reproduce it or knowingly fix it; log
the choice.

---

## M2-7 — blocker ④ **OVERTURNS THE FIRST PASS**: there *is* an offline gold faucet, and it is exact

The first pass concluded: *"I looked for an earn path and there is none in the client… **Blocker ④
stands as written.**"* That is wrong. It searched `addLootGold` (the *dialog* helper) and missed
`changeStat(STAT_HGOLD, …)`.

**A2:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2195-2208`
```as3
public static function doRebirth() : *
{
   ...
   if(getPlayerStats(STAT_DAN) == 8)
   {
      changeStat(STAT_HGOLD,20);
   }
   else
   {
      changeStat(STAT_HGOLD,5);
   }
```
→ **every rebirth grants 5 premium Gold; the Dan 8→9 rebirth grants 20.** Over the nine rebirths
from Dan 0 to Dan 9 that is **8×5 + 20 = 60 Gold, free, offline, for life**.

**Independent corroboration that 60 is the intended free ceiling** —
`reference/decompiled/shs3_android/scripts/OverworldHUD.as:1333`:
```as3
if(StatsManager.getStat(StatsManager.STAT_HGOLD) > 60 && StatsManager.getStat(StatsManager.STAT_DAN) < 9)
```
The client itself uses **>60 with Dan<9** as its "this player paid" test. The number is load-bearing.

This also **contradicts the harvested forum claim** recorded at
`docs/research/KONGREGATE_FORUM_FINDINGS.md:399` (*"Rebirthing = 25 FREE Gold"*): the payload says
5, or 20 on the last rebirth. **Payload over forum memory.**

**Revised verdict on blocker ④:** *PARTIAL, not confirmed.* The **rate is recovered** (5/rebirth,
20 at Dan 8, 60 lifetime). What remains open is only whether a *recreation* wants a faucet at all
given `HAS_CASH_PURCHASE=false`. The ledger's *"offline gold faucet rate"* is no longer unknown.

---

## M2-8 — "Ninja-Services prices" upgraded from a bullet to a priced catalogue (WEB build)

The premium catalogue is `reference/extracted/android/121_Mobile_PremiumData.bin` `<premiumdata>`
(16 `<default>` SKUs + 23 `<rotation>` outfit `<set>`s, with the authors' own comments left in:
`<!-- Assassin outfit -->`, `<!-- Santa outfit -->`, …). Every price is a `<heavenlyprice>` row in
the **WEB v0.717** `reference/extracted/itemdata.xml`:

| item id | itemdata.xml line | Gold | name — desc |
|---:|---:|---:|---|
| 2100 / 2101 / 2102 | 27 / 41 / 55 | 1 / 2 / 3 | Small / Medium / Large Soldier Pill — *"Replenish your AP without waiting!"* |
| 2125 / 2126 / 2127 | 374 / 388 / 402 | 1 / 2 / 3 | 10 / 25 / 40 Duel Tokens — *"Replenish your Duel Tokens without waiting!"* |
| 2128 | 416 | 1 | Present — *"Contains a random rare item."* |
| 2129 | 430 | 1 | Recall Stone |
| 2200 | 2267 | 5 | Amnesia Scroll — *"Use this to unassign your stat and skill points."* |
| 2203 | 2327 | 5 | Writ of Release — *"Use this item to leave your Clan."* |
| 2207 | 2379 | 5 | Name Change Scroll |
| 2208 | 2393 | 1 | 1000 coins — *"Buy 1000 coins."* |
| 2209 | 2402 | 1 | Full HP and Chi |
| 2212 | 2445 | 5 | Clan Deed — *"Form your own clan. War Hero rank required. Includes: 1 Clan General Invitations, 3 Clan Invitations"* |
| 2213 | 2461 | 1 | Clan Invitation |
| 2215 | 2479 | 1 | Edit Clan — *"Edit your Clan's name, acronym, color and banner"* |

Two conversion rates fall straight out: **1 Gold = 1000 coins** (item 2208, and string 609
*"Buy 1000 coins for 1 gold?"*) and **1 Gold = 10 AP** (string 100).

---

## M2-9 — "two token types" quantified: both pools, both regen rates, both buffs

The first pass did Duel Tokens. The second pool is **AP**, and the ledger's bullet needs both.

**A2:** `reference/decompiled/shs3_android/scripts/StatsManager.as`
```as3
:158   internal static var APINTERVAL:int = 60;
:160   internal static var DTINTERVAL:int = 2 * 60;
:166   internal static var MAXDUELTOKENS:int = 30;
:707   setPlayerStats(STAT_AP,30);
:709   setPlayerStats(STAT_DUELTOKENS,20);
:710   setPlayerStats(STAT_MAXDUELTOKENS,20);
```
and the doubling buffs at `:1101` / `:1134` (`if(hasBuff(BUFF_AP)) diff *= 2;`).

| pool | start | cap | regen | ×2 buff |
|---|---:|---:|---|---|
| **AP** (Action Points, string 65) | 30 | 30 (`STAT_MAXAP`) | 1 / **60 s** | `BUFF_AP` (4) |
| **Duel Tokens** (string 59) | 20 | **30** hard (`MAXDUELTOKENS`) | 1 / **120 s** | `BUFF_DUELTOKENS` (5), string 4230 *"200% Duel Token Regeneration buff"* |

Currency naming trap for implementers: `STAT_GOLD = 11` is the **coin** stat (string 63 = "Coins");
the premium currency is `STAT_HGOLD = 12` behind `getHeavenlyGold()` and `<heavenlyprice>`.

---

## M2-10 — an unmentioned meta-social system: the **Chikako affinity meter**

Not in the §4 block, not in the first pass. It is the game's loyalty loop and it converts spend +
achievements into refunded Gold.

**A2:** `reference/decompiled/shs3_android/scripts/InteractUI_chikako.as:24-26`
```as3
internal var expArray:Array = [0,10,30,60,100,150];
internal var maxLevel:int = 5;
```
…:40 `return StatsManager.getPlayerStats(StatsManager.STAT_CHIKAKOLOVE) + QuestEngine.getAchievementScore();`

**A2 (what feeds it):** `StatsManager.as:2719-2724`
```as3
if(getHeavenlyGold() >= num)
{
   changeHeavenlyGold(-num,callbackSuccess,callbackError);
   changeStat(STAT_CHIKAKOLOVE,num);
```
→ **1 love point per Gold spent**, plus achievement score, over a 5-level ladder
`[0,10,30,60,100,150]`, with a 6-portrait swap (`setPortrait(charlevel)`).

Payoff: `NetworkManager.as:2306-2315` `else if(m.type == "refunded") … showChikakoRefund();`
and string 723: *"Tip: Use Ninja Services or unlock achievements to impress Chikako and increase
your chances for a \"Chikako Refund\"!"*. **This is the one place achievements have a mechanical
payout** — worth knowing before scoping achievements as cosmetic.

---

## M2-11 — "War-Room 6 actions" is the *rulebook's* count; the client spends moves on **ten**

**A2 (rulebook, string 372):** *"Moves can be used to deploy troops, attack enemy troops, move to a
different sector, spy on the enemy or build structures."* — 5, plus arrow-fire on blocked
neighbours (string 372's next bullet) = the ledger's 6.

**A2 (client):** `reference/decompiled/shs3_android/scripts/WarHexUI.as` calls
`OverworldHUD.instance.warUI.useWarMove(1)` at lines **1049, 1177, 1210, 1279, 1304, 1386, 1654,
1771, 2420, 2471** — ten move-consuming operations, adding **build Command HQ**, **demolish
Command HQ**, **castle assault** and the resolved-battle kill report to the six the rulebook names.

Verdict **PARTIAL**: the ledger's "6 actions" is right as *player-facing rules*, wrong as a
*budget model*. Anyone implementing the move economy needs ten.

---

## M2-12 — structure costs confirmed; "500 coins/turn" is **per build move**, not per turn

**A2:** `WarHexUIBuildMenu.as:185-213` (`getDesc`, each row = `"Total Cost: " + N + " Coins"`):
Forward Base **10000**, Tunnels **5000**, Barricades **10000**, Village→Town **10000**;
Command HQ carries **no cost line**. Mirrored by the progress maths in `WarHex.as:424,477,521,540`
(`maxcost = 10000`, `5000` for Tunnels).

**A2 (the contribution):** `WarHexUI.as:1291` and `:1332` — `buildcost = 500;`, gated on
`StatsManager.getStat(StatsManager.STAT_WARMOVES) > 0 && StatsManager.getStat(StatsManager.STAT_GOLD) >= buildcost`,
i.e. **one move + 500 coins per contribution**. `SHSD_MASTER_REFERENCE.md:171` calls this
*"Build donation cap | 500 coins/turn"* — but a turn grants 3–6 moves, so a War Hero can contribute
**3,000 coins per turn**. Corrected reading: **500 coins per build move.**

Also newly pinned: **castle gate window = `3 * 60 * 60` s** (`WarHex.as:499,507,513`) and
**rank credit for donations = 1 point per 1,000 coins** (`StatsManager.as:826`,
`getStat(STAT_WARMOVESMADE) + int(getStat(STAT_WARCOINSDONATED) / 1000)`).

---

## M2-13 — §6 cross-lane: *"L11–80 XP curve — no table published… likely unrecoverable"* is **DEAD**

Not my unit, but §6 is the document's highest-value target and the artifact is one line long.

**A2:** `reference/decompiled/shs3_android/scripts/StatsManager.as:78`
```as3
public static var expArray:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,…,25395800,29395800];
```
**99 entries.** `expArray[9] = 25900`, `expArray[10] = 31400` (the "L11+ cliff" the ledger called
unrecoverable), `expArray[79] = 4025800` — and **level 80 is exactly the rebirth gate**
(string 4155: *"New Game +\nProgress on to the next Dan Rank and specialize in an element.\nLevel 80
required."*). The entire L1–L99 curve is on disk.

**Ledger sentences overturned:** `REBUILD_READINESS.md:127` *"L11–80 curve (likely unrecoverable)"*
and §6 *"**L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the
extrapolation labeled INFERRED."*

---

## Second-pass verdict table

| ledger item | first pass | this pass |
|---|---|---|
| §4 blocker ① server-authoritative sim | PARTIAL (rules recovered) | **agree**, and add: 10-action move budget, castle 3 h window, 63×72 world mask |
| §4 blocker ② map topology | OVERTURNED (6×6 sectors) | **agree + extend**: world board = 63×72 GIF, 735 territories, **byte-identical web↔Android** |
| §4 blocker ③ achievements / daily / tokens | OVERTURNED | **agree + extend**: AP pool quantified; achievements have a payout (Chikako) |
| §4 blocker ④ offline gold faucet | "stands as written" | **OVERTURNED → PARTIAL**: 5/rebirth, 20 at Dan 8, 60 lifetime; forum's "25" is wrong |
| Ready: "kill cap 350" | STILL_UNHELD | **HELD, corrected to 351 (340 + 11)** |
| Ready: "flag +120%" | STILL_UNHELD | **HELD as an error**: it is the terrain table's `case 1` row |
| Ready: "structure costs" | HELD | **agree**, and "500/turn" corrected to 500 **per build move** |
| Ready: "4 clans (heraldry/daimyo/capitals)" | STILL_UNHELD | **HELD** (strings 271–278, 324–327 + side→colour) |
| Ready: "Ninja-Services prices" | partially (304 rows exist) | **HELD as a 12-row priced catalogue** with WEB line numbers |
| §6 "L11–80 XP curve unrecoverable" | not audited | **DEAD** — 99-entry `expArray` |

## Still unheld after this pass

1. **War-rules page 7 content** (desktop string ids 11016/11017) — above the Android table's ceiling.
   Unchanged from the first pass.
2. **A frame of the war-room 6×6 board itself.** I re-checked the whole 100-frame `map` contact
   sheet of `Nr4fQstqHDM`; the longplay opens the rules dialog and the quest panel, never the board.
   Every board claim here rests on A2 code + the A1 coordinate readout, not on a picture.
3. **Rival-clan AI** ("Greedy strategy — reinforce weakest border…", `SHSD_MASTER_REFERENCE.md:177`).
   No war AI exists in the client — the server ran it. That line is **recreation-authored design**
   and must be labelled as such, not cited as original fidelity.
4. **Live matchmaking, population, historical map state** — genuinely gone. §6 holds here.

**Score, second pass: 31 → 78.** Above the first pass's 72 because blocker ④ turns out to be
closable, both disputed "Ready" numbers resolved, and the world board proved build-agnostic by
byte-check. Held back from higher by the missing board frame, page 7, and the un-surveyed
duel/leaderboard/friends surface the first pass flagged.
