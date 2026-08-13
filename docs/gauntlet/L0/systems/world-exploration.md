# GAUNTLET L0 — system survey: **world-exploration** (ledger score 35/100)

Auditing `docs/research/REBUILD_READINESS.md` (2026-07-20) §2 row, §4 `### world-exploration — 35`
block, and the §1/§6 lines that touch this system.

**Headline.** The ledger is not slightly wrong here, it is wrong at the root. It was written
5 days before the payload was extracted (`reference/extracted/` 2026-07-25/26,
`reference/decompiled/` 2026-07-25) and treats the world as *authored geography that must be
traced from a map image and mined from a wiki*. It is not authored. **The entire overworld is
deterministically procedurally generated** from (a) a 63×72 GIF land-mask, (b) a node id that
packs sector x/y in 12 bits each, and (c) a seeded LCG (`RNG.as`) whose seed is the node id.
All three are on disk. Every one of the five §4 blockers is closable from material already in
the repo, and four of them are *fully closed* below.

**One caveat stated up front, honestly:** the named AS3 lives in
`reference/decompiled/shs3_android_payload/` — the **Android port's** payload SWF, not the Flash
web build the videos show. I therefore corroborated every load-bearing rule against a video
frame wherever a frame exists. Three independent frame↔code matches are recorded below
(6×6 sector grid, `TERRITORY (21,51)`, soil-grade ladder, and a *generated town name*). Where a
frame and the code disagree I say so; they did not disagree anywhere I checked.

---

## W-1 — Blocker ① "world bounds + geography" is NOT a blocker. The world mask is on disk.

**Ledger (§4, overturned):**
> "① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom
> Category:Territories via API; trace the map image.*"

**Also overturned (§1 UNKNOWN-UNKNOWNS, line 115):**
> "- **World-map topology/projection** (sparse geographic Japan outline, not a grid you can
> generate from W×H)."

`reference/extracted/bindata/92_1t4648s0.bin` is a **GIF89a, 63 × 72, 2-colour**. Decoded:
**735 white pixels, 3801 black**, white spans x∈[1,61], y∈[1,70]. Upscaled ×10 it is
unmistakably the outline of **Japan** — Hokkaido top-right, Honshu diagonal, Kyushu/Shikoku
lower-left, the Ryukyu chain trailing SW. (Render written to scratchpad `map_gif_x10.png`.)

That file is `map.gif`, and the consumer is quoted verbatim:

`reference/decompiled/shs3_android_payload/scripts/QuestEngine.as:489`
```
            myLoader.load(new URLRequest("map.gif"));
```
`QuestEngine.as:1204-1207`
```
      public static function hasTerritory(x:int, y:int) : *
      {
         return mapBitmapData.getPixel(x + WarSelectUI.TERRSHIFTX - 341 - WarSelectUI.WARMARKERSHIFTX,y + WarSelectUI.TERRSHIFTY - 341) != 0;
      }
```
`QuestEngine.as:514-524`
```
         mapBitmapData = Bitmap(LoaderInfo(e.target).content).bitmapData;
         ...
               if(mapBitmapData.getPixel(i,j) != 0)
               {
                  terrX = i - WorldMapUI.TERRSHIFTX + WorldMapUI.WARMARKERSHIFTX;
                  terrY = j - WorldMapUI.TERRSHIFTY;
                  warMarkerList.push(terrX + 341 << 12 | terrY + 341);
```

So: **world bounds = exactly 735 territories**, one per white pixel, and territory existence is a
one-line pixel test. Nothing needs tracing and nothing needs mining from Fandom.

## W-2 — The territory display origin: `TERRSHIFTX=21`, `TERRSHIFTY=51`

`reference/decompiled/shs3_android_payload/scripts/WarSelectUI.as:15-19`
```
      public static var WARMARKERSHIFTX:int = 8;
      public static var TERRSHIFTX:int = 21;
      public static var TERRSHIFTY:int = 51;
```
Displayed territory coord = raw territory coord + (21, 51); internal territory coord is biased by
+341 on both axes. This is why every questdata node id sits in the 8.38M–8.91M band.

## W-3 — Node-id packing (solves the questdata `<node>` field the index flagged but did not decode)

`NodeGenerator.as:296-333`
```
      public function getTerritory(nodeid:int) : Point
      {
         var sectorx:int = nodeid >> 12 & 0x0FFF;
         var sectory:int = nodeid & 0x0FFF;
         var territoryx:int = Math.floor(sectorx / 6);
         var territoryy:int = Math.floor(sectory / 6);
```
`node = sectorX << 12 | sectorY`; `territory = floor(sector / 6)`; sub-sector = `sector % 6`.
Applied to the 51 distinct `<node>` values in `reference/extracted/questdata.xml` (225
occurrences), every one decodes to a legal sector: sectorX ∈ [2046, 2175], sectorY ∈ [2011, 2069]
→ story content spans display territories x 21–42, y 45–54.

## W-4 — Blocker ⑤ "sector↔room mapping rule" — CLOSED. **6 × 6 sectors per territory.** Frame agrees.

**Ledger (§4, overturned):**
> "⑤ sector↔room mapping rule (town=fixed sector vs wilderness=one-screen-per-sector)."

`TerritoryData.as:1071-1077`
```
         for(var i:int = 0; i < 6; i++)
         {
            sectorBuildArray[i] = new Array();
            for(j = 0; j < 6; j++)
            {
               sectorBuild = new SectorBuild(i,j,territoryx * 6 + i << 12 | territoryy * 6 + j);
```
`Territorymap.as:65-70`
```
         for(var i:int = 0; i < 6; i++)
         {
            this.minimapRoomList[i] = new Array(6);
            for(j = 0; j < 6; j++)
            {
               this.minimapRoomList[i][j] = new BigmapRoom();
```

**FRAME CORROBORATION (A1).** `reference/frames/map_analysis/zFtCaTO0_1M_map_010_t439s.jpg`,
crop `(370,40)-(512,160)` upscaled ×8 (Lanczos): the overworld HUD panel is a **6-column × 6-row
grid, column headers `0 1 2 3 4 5` and row labels `0 1 2 3 4 5`**, with connection lines drawn
between adjacent cells, three yellow arch icons, a triangle marker at column 4 / row 1, and
beneath it the text **`TERRITORY (21,51)`** / **`SECTOR (4,1)`**. The marker position matches the
printed sector exactly. Frame and code agree; nothing had to be inferred.

Note also 735 territories × 36 sectors = **26,460 sectors** in the world.

## W-5 — Ready bullet "start 21,51 / 0,3" — **HELD**, and now byte-grounded

`StatsManager.as:714`
```
         setPlayerStats(STAT_LOCATION,8382465);
```
`8382465 >> 12 & 0xFFF = 2046`, `& 0xFFF = 2049` → territory (2046/6, 2049/6) = (341,341) →
display (341-341+21, 341-341+51) = **(21,51)**; sub-sector (2046%6, 2049%6) = **(0,3)**.
The ledger's Ready bullet was correct. It is now A2 rather than hearsay.

## W-6 — Blocker ④ "AP regen rate + cap" — CLOSED. **1 AP / 60 s, base cap 30.**

**Ledger (§4, overturned):** "④ AP regen rate + cap."

`StatsManager.as:158-162`
```
      internal static var APINTERVAL:int = 60;
      internal static var DTINTERVAL:int = 2 * 60;
      internal static var WARMOVEINTERVAL:int = 60 * 60;
```
`StatsManager.as:1097-1103`
```
            timeDiff = timeVariable - nextAPUpdate;
            diff = Math.floor(timeDiff / APINTERVAL) + 1;
            if(StatsManager.hasBuff(StatsManager.BUFF_AP))
            {
               diff *= 2;
            }
```
`StatsManager.as:707-710`
```
         setPlayerStats(STAT_AP,30);
         setPlayerStats(STAT_MAXAP,30);
         setPlayerStats(STAT_DUELTOKENS,20);
         setPlayerStats(STAT_MAXDUELTOKENS,20);
```
1 AP per 60 s (×2 under `BUFF_AP`); base cap 30 (+1 per stat point, per the progression ledger);
duel tokens 1 / 120 s, cap 20; war moves 1 / 3600 s. Also `ScreenTransition.as:294-296` — on
downed-teleport, AP is floored to `MAXAP / 3`.

## W-7 — Blocker ③ "real-world day length" — CLOSED for every named consumer.

**Ledger (§4 + §1 line 116, overturned):**
> "③ real-world **"day" length** (governs expiry, farming, AP regen, war tick)."

There is no game-invented day; the game reads **server unix time** and uses literal real-second
constants. Per consumer named by the ledger:
- **AP regen** → 60 s (W-6).
- **war tick** → `WARMOVEINTERVAL = 60 * 60` (W-6) for moves; the 24 h resolution is
  `24 * 60 * 60` per `QueryManagerBase.as:105` (`serverDateYesterday`).
- **quest expiry** → `StatsManager.as:1184`
  ```
               if(completedQuest.completedTime == 0 || completedQuest.completedTime < serverTimeVariable - 24 * 60 * 60)
  ```
- **farming** → per-crop real seconds, see W-8.
- a 24 h stat gate: `InteractUI.as:1153` `StatsManager.setStat(30018,QueryManager.instance.getServerTime() + 24 * 60 * 60);`

## W-8 — Blocker ② "gather/mine/farm yield + whiff + respawn tables" — CLOSED, all four sub-tables.

**Ledger (§4, overturned):** "② gather/mine/farm **yield + whiff + respawn** tables."

**MINING** — `Obj_OreDeposit.as:56-77`
```
         var oreType:int = currentFrame;
         var miningskill:int = StatsManager.getStat(1022);
         if(oreType == 8 && miningskill < 5 || oreType == 7 && miningskill < 4 || oreType == 6 && miningskill < 3 || oreType == 5 && miningskill < 2 || oreType == 3 && miningskill < 1)
         ...
         if(oreType != 2 && int(Math.random() * 2) != 0)
         {
            OverworldHUD.getInstance().getNodeUI().runMine(1,this);
         }
```
→ mining-skill gate ladder (ore 3→skill 1, 5→2, 6→3, 7→4, 8→5); **whiff = flat 50 %** for every
ore type except type 2, and a whiff yields ore type 1. AP cost 2 (`Obj_OreDeposit.as:126-129`).
Yield table, `NodeUI.as:566-599` — oreType 1..8 → item ids **20059, 20060, 20061, 20062, 20063,
20064, 20065, 20066**, always qty 1; the deposit is consumed unless the roll whiffed
(`if(this.oreType != 1) { ... clearOre(); }`). Progress bar = 24 (`runMine`: `startProgress(24,ACTION_MINE)`).

**HUNT / FISH** — `NodeUI.as:427-500` (both 3 AP, identical distribution, `dice = Math.random() * 10`):
| roll (0–9) | p | HUNT item | FISH item |
|---|---|---|---|
| 3,4,5 | 30 % | 2112 | 2109 |
| 1,2 | 20 % | 2113 | 2110 |
| 0 | 10 % | 2114 | 2111 |
| 6,7,8,9 | **40 % whiff** | — | — |

**SEARCH (bushes / hidden paths)** — `NodeUI.as:535` `if(!StatsManager.checkAP(2))`, same
`startProgress(24, ACTION_SEARCH)`.

**FARM** — `InteractUI_crops.as:55` `internal var gracePeriod:int = 900;` and `:110-170`:
plantType 1 → `15 * 60`, 2 → `60 * 60`, 3 → `6 * 60 * 60`, 4 → `12 * 60 * 60`; after
`timePeriod` the crop is READYFORHARVEST, and after `timePeriod + 900` it is **ROTTED**
(type 4 never rots). Soil ladder `InteractUI_crops.as:457-503`: harvestedTimes <10→grade 1,
<20→2, <30→3, <40→4, <50→5, else 6; next-threshold 10/20/30/40/50/60; counter clamps at 50.

**FRAME CORROBORATION (A1).** `reference/frames/map_analysis/zFtCaTO0_1M_map_014_t607s.jpg`,
crop `(0,205)-(300,288)` upscaled ×6: reads **`VEGETABLES READY FOR HARVEST`** and
**`SOIL GRADE 1 (HARVESTED 0/10)`** — exactly `getPatchLevel(0)=1` and `getNextPatchLevel(0)=10`.
Frame and code agree.

**RESPAWN** — the rule is "on node re-entry", not a timer. `StageManager.as:621-626` pushes a
harvested object's name onto `roomDeadList`; `StageManager.as:249` and `:366` both do
`roomDeadList.length = 0;` inside `initRooms` / the node-change path. The dead list is
node-scoped and never persisted, so ore/bushes are back the next time you enter the node.

## W-9 — Ready bullet "AP cost table (pick 1 / search+mine 2 / **stable 5**)" — **PARTIAL**. "stable" is mislabelled and the price is a formula, not 14 coins.

The pick-1 / search-and-mine-2 halves are right. The complete table (all `getAPUse()` overrides):

| cost | objects / actions |
|---|---|
| 0 | `InteractiveStageObject` default |
| 1 | `Obj_PickableItem`, `Obj_PickableItemProcGen`, `Obj_Hut`, `Obj_Bell`, `Obj_DirectionSign`, `Obj_TownSign`, revealed `Obj_PathBush`; `ACTION_ENTER`, `ACTION_REST` |
| 2 | `Obj_OreDeposit`, `Obj_Bush`, `Obj_Corpse`, `Obj_DragonDanceLoot`, `Obj_DragonDanceStatue`, unrevealed `Obj_PathBush` / `Obj_HiddenTemple` / `Obj_DragonDancePath`; `ACTION_SEARCH` |
| 3 | `ACTION_HUNT`, `ACTION_FISH` |
| 5 | `ACTION_TRAVEL`, `ACTION_CAMP`, and the paid fast-travel |

There is no 5-AP "stable" object. The 5-AP paid travel is `InteractUI.as:1721-1746`:
```
      internal function travel(nodeid:int) : *
      {
         var cost:int = NodeGenerator.instance.getNodeLevel(StageManager.getCurrentNode()) * 2;
         ...
         if(!StatsManager.checkAP(5))
```
→ **fast travel costs `nodeLevel × 2` gold + 5 AP.** This also corrects the ledger's §1 economy
line 79 ("stable 14c+5AP"): 14 coins is simply what the formula returns at node level 7, i.e. a
single observation recorded as a constant. Rest = 1 AP for +100 HP/+100 Chi (`NodeUI.as:395-401`);
Camp = 5 AP for +50/+50 (`NodeUI.as:414-420`).

## W-10 — NOT IN THE LEDGER AT ALL: the world difficulty gradient is a closed-form function.

`NodeGenerator.as:144` `internal var LEVELSTART:int = 3;`
`NodeGenerator.as:382-395`
```
      public function getNodeLevel(nodeid:int) : int
      {
         var territory:Point = this.getTerritory(nodeid);
         var lvl:int = Math.abs(territory.x - 341) + Math.abs(territory.y - 341) + this.LEVELSTART;
         if(lvl > 200)
         {
            lvl = 200;
         }
```
Node level = **Manhattan distance from the start territory (341,341) + 3, capped at 200**. The
start territory is therefore level 3. This is the single number that drives enemy level, fast-travel
price and ore tier across the whole map, and the ledger does not mention it in any of its 12 systems.

## W-11 — NOT IN THE LEDGER: the world is a *seeded LCG*, so it is byte-reproducible. Frame proves it.

`RNG.as:66-75`
```
      public function rnd() : Number
      {
         this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
         return this.randomSeed / 233280;
      }
      
      public function rand(num:int) : int
      {
         return Math.floor(this.rnd() * num);
      }
```
Seeded by the node/territory id everywhere (`new RNG(this.territoryID)`, `new RNG(nodeid)`,
`RNG.getRandAfterXTimes(nodeid,3,800)`). Town names, `NodeGenerator.as:1798` ore types, exits,
room widths and object placement all fall out of it.

**Closed-loop verification (A2 → A1).** The start territory is display (21,51) → internal
(341,341) → `territoryID = 341 << 12 | 341 = 1397077`. `NameGenerator.as:135-165`:
```
         var namex:int = territoryx % 137;
         ...
         return this.namestarting[rng.rand(this.namestarting.length)] + this.nameending[rng.rand(this.nameending.length)];
```
`341 % 137 = 67 ≥ 26` → syllable branch → `RNG(1397077 * 2)` → `namestarting[75]="Kasu"` +
`nameending[0]="ta"` = **"Kasuta"**. I re-implemented the LCG and ran it; it prints `Kasuta`.
The frame `reference/frames/map_analysis/zFtCaTO0_1M_map_010_t439s.jpg` — the same frame that
reads `TERRITORY (21,51)` — has the room title **`NE KASUTA MOUNTAIN PATH`** at top-left.
The generator's output matches the video's town name exactly. The whole overworld is
regenerable, not recoverable-by-tracing.

The place-name table for the other branch is on disk too:
`reference/extracted/bindata/98_1t4653s0.bin` = **exactly 676 lines** (Anjo, Chiryu, Nagoya,
Okazaki, Kasugai …) = 26 × 26, matching `getTownName1`'s `index = namex * 26 + namey`.

## W-12 — Ready bullet "prosperity ladder" — **HELD and now exact**; also overturns a §1 KNOWN-UNKNOWN.

**Ledger §1 line 93 (overturned):** lists "prosperity thresholds + daily-sim math" as a
KNOWN-UNKNOWN. The thresholds are literal.

`TerritoryData.as:782-805`
```
      public function getTownLevel() : int
      {
         if(this.townProsperity == 0) { return 0; }
         if(this.townProsperity < 500) { return 1; }
         if(this.townProsperity < 1000) { return 2; }
         if(this.townProsperity < 2000) { return 3; }
         if(this.townProsperity < 4000) { return 4; }
         return 5;
```
(The *daily-sim math* that moves prosperity is server-side and remains unheld — see U-1.)

## W-13 — Ready bullets "minimap iconography" + "hidden-path system" — **HELD, exact**

`NodeGenerator.as:34-82` enumerates **24** map icons: `ICON_NOTHING 0, TOWN 1, DUNGEON 2, CAVE 3,
MINE 4, FORT 5, CONTROL 6, EXIT 7, PICKABLE 8, DOJO 9, TEMPLE 10, HUT 11, GRAVEYARD 12, ONIDEN 13,
MERCCAMP 14, ANIMALSPAWN 15, NINJAVILLAGE 16, DESTROYEDVILLAGE 17, JINMAKU 18, ROUTE 19,
TEMPLEDUNGEON 20, RUINS 21, NINJATRAIL 22, BEACH 23` (+ `OVERWRITENODE 100`), and `:84-124`
enumerates 22 room themes (`THEME_BANDIT 0 … THEME_CLANPURPLE_UNDEAD 21`).

Hidden paths, `Obj_PathBush.as:50-53, 63-82, 115-121`:
```
         if(StatsManager.getStat(1021) == 5)
         {
            gotoAndStop(2);
         }
...
         if(!this.revealed)
         {
            OverworldHUD.getInstance().getNodeUI().runSearch(this);
         }
...
         if(!this.revealed) { return 2; }
         return 1;
```
→ 2 AP to search-and-reveal, 1 AP to traverse thereafter, and **skill 1021 at level 5 pre-reveals
them** (the bush renders in its revealed frame with no search).

## W-14 — NOT IN THE LEDGER: an entire authored trap-room content set (69 rooms, 4 difficulty tiers)

`reference/extracted/bindata/93_1t4647s0.bin` — the index calls it "room-object defs"; its actual
root is `<traproomdata>` (line 21). Parsed:

| tier | rooms | room widths |
|---|---|---|
| `easy` (l.32) | 13 | 800 |
| `medium` (l.126) | 21 | 800, 1000, 1150, 1400 |
| `hard` (l.309) | 15 | 800, 1000, 1100, 1150, 1400 |
| `veryhard` | 20 | 800, 1000, 1400 |

Each room carries exact object placements, e.g.
`<obj><id>43</id><name>Trap_SawBladesAuto</name><x>400</x><property>0,24,24,0,1</property></obj>`,
and the file's header comment documents the property signature of all 13 trap/mechanism types
(`Trap_Kunai`: `angle, speed, kunaicount, spread, bigdamage`; `Trap_CrushingColumnAuto`:
`onDuration, offDuration, startInterval, active, floorY`; etc.). None of this appears in any of
the ledger's 12 system blocks.

## W-15 — Surface bullet "ZERO world numbers in config yet" — **still TRUE** (the only Surface claim that survives unchanged)

`ls src/config/` returns 27 files (`ai.ts anim.ts art.ts chi.ts combat-sim.ts combat.ts display.ts
duel.ts economy.ts fidelity.ts fx.ts gesture.ts mobs.ts nums.ts ogAnims.ts ogPose.ts palette.ts
popups.ts poses.ts profile.ts reach.ts rng.ts skills.ts stances.ts stats.ts timing.ts xp.ts`) —
there is no `world.ts`, `ap.ts` or `farming.ts`. The bullet's prescription is right; what has
changed is that the numbers to put in them are no longer research, they are transcription.
Room-width constants are ready to go: `NodeGenerator.as:1775-1778`
```
      public function getRoomWidth(nodeid:int) : int
      {
         return 800 + RNG.getRandAfterXTimes(nodeid,3,800);
      }
```
(wilderness 800–1599), and town rooms are 1600 at town level 1–3, 2000 at 4–5
(`NodeGenerator.as:609-632`). `ROOMGRIDSIZE = 32`; room ids pack `x << 8 | y`
(`NodeGenerator.as:1791-1795`).

## W-16 — §6 "Server-sim topology & **save format** — nothing to copy" — **PARTIAL overturn**

**Ledger §6 (partially overturned):**
> "- **Server-sim topology & save format** — nothing to copy; design a single-player persistence
> schema from the observed field set."

The *save format* half is wrong: it is not "observed", it is enumerated. `StatsManager.as` defines
**46 `STAT_*` indices** into a flat integer stat table — e.g. `STAT_AP:int = 13`,
`STAT_MAXAP:int = 14`, `STAT_LOCATION:int = 19`, `STAT_LOCATION_ROOM:int = 43` — and world state
is written through it directly (`StatsManager.saveLocation(nodeNum)` on every node change,
`StageManager.as:381`). Farm plots are a 4-field record at a base index:
`InteractUI_crops.as:102-108` reads `startingIndex + 0..3` = plantType, plantTime, harvestedTimes,
modLevel. A single-player schema can be *copied*, not designed. The *server-sim topology* half of
the sentence stands.

## W-17 — The string table is LOCATED (not yet extracted) — bears directly on every world name

The gauntlet's standing blocker says the numeric-id string table is "NOT YET LOCATED" and that
"bindata/ is now EXHAUSTED as a candidate". Correct that it is not in bindata — but it is named:
`LangManager.as:59-62`
```
            Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");
            Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");
```
and the mobile build embeds it: `Mobile_Lang_EN.as:4-5`
```
   [Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]
   public class Mobile_Lang_EN extends ByteArrayAsset
```
So the table is `data/shs3_en.xml` on the web build and asset **`118_Mobile_Lang_EN.bin`** inside
the Android SWF. `reference/decompiled/android_export.log:514` shows only the *script*
`Mobile_Lang_EN` was exported (`Exported script 511/970 Mobile_Lang_EN`) — the binary asset was
not. **Verdict PARTIAL:** located and named, not on disk. Re-exporting the Android SWF's
`_assets/` would close it, and with it every world place/ore/sign name.

---

## Honest STILL_UNHELD

**U-1 — the prosperity *daily-sim* and the town/war state that feeds it.** `TerritoryData` fields
`townProsperity`, `townSide`, `atWar`, `clanInfluence`, `battleReportList` all arrive from
Player.IO (`dataFromServer:Boolean`, `gotTerritoryData(terrX, terrY, terrData)`), and
`QuestEngine.getTownState()` indexes a server-sent `townsData` string. The *thresholds* are held
(W-12); the update rule that moves prosperity each day lives on the dead server. No artifact
supports any daily-sim formula, so I am not asserting one.

**U-2 — the "4 travel methods" Ready bullet.** I can enumerate the movement paths in code —
adjacent-node `ACTION_TRAVEL` (5 AP), paid teleport (`ScreenTransition.ACTION_TELEPORT`,
nodeLevel×2 gold + 5 AP), revealed hidden path (1 AP), signpost/town-sign (1 AP), plus
`ACTION_TELEPORTDOWNED` and `ACTION_TELEPORTCLANQUEST` — but I found no artifact that says the
game presents exactly **four**, and the count depends on how you bucket them. The bullet's number
is unverified either way; I am not scoring it HELD.
