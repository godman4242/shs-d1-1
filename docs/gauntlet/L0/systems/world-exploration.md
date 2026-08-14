# GAUNTLET L0 — system survey: **world-exploration** (ledger score 35/100)

Auditor: system-surveyor agent, 2026-08-14.
Document under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20), §2 table row 132,
§4 block lines 223–226, plus §1 lines 115–116 and §6 line 351.

**Headline: the ledger's world-exploration block is the most under-claimed block in the
document. All five of its blockers are dead.** The Android payload carries the world's
coordinate law, its byte-exact land mask, its level gradient, its AP economy, its
gather/mine/farm yield-and-whiff tables and its room graph. The only bullet that survives
audit unchanged is the Surface bullet ("ZERO world numbers in config") — still true.

Proposed re-score: **35 → 85**.

---

## A note on the S0-3 Android caveat, discharged for this unit

Stage-0b warned that everything ported from `reference/extracted/android/` is
clientVersion **0.682**, not the web build's **0.717**, and that parity is not established.
For world-exploration that caveat is **partly discharged by byte-check** (claim WX-02) and
**partly by string-pool evidence**: the WEB payload's own constant pool contains the exact
XML fragment templates that `NodeGenerator` concatenates to build procedural rooms —

```
reference/extracted/payload.xml:118249  <item>&lt;obj&gt;&lt;id&gt;31&lt;/id&gt;&lt;x&gt;</item>
reference/extracted/payload.xml:118250  <item>&lt;obj&gt;&lt;id&gt;74&lt;/id&gt;&lt;x&gt;</item>
reference/extracted/payload.xml:118256  <item>&lt;/x&gt;&lt;property&gt;0,1&lt;/property&gt;&lt;name&gt;procgenronin&lt;/name&gt;&lt;/obj&gt;</item>
reference/extracted/payload.xml:118262  <item>&lt;/x&gt;&lt;property&gt;142&lt;/property&gt;&lt;name&gt;merccaptain&lt;/name&gt;&lt;/obj&gt;</item>
reference/extracted/payload.xml:118266  <item>roomdata</item>
```

matching

```
reference/decompiled/shs3_android/scripts/NodeGenerator.as:740
   objList += "<obj><id>0</id><x>" + xpos + "</x><property>0,50," + destS + ",1," + EXIT_S + "," + signdir + "</property></obj>";
```

So the v0.717 web build ships the same procedural room/node builder. Numeric constants
(`APINTERVAL`, `LEVELSTART`, crop timers) are **not** individually byte-proven across
builds — label ported numbers "measured on Android v0.682".

---

## Claims

### WX-01 — Blocker ① "world bounds + geography" is DEAD. The world is a 63×72 territory grid with a 1-bit land mask, and the mask is on disk. `[A2] [OVERTURNS §4:225]`

Ledger, line 225: *"① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.*"*

The boundary test is a single pixel lookup into an embedded GIF:

```
reference/decompiled/shs3_android/scripts/QuestEngine.as:1206
   return mapBitmapData.getPixel(x + WarSelectUI.TERRSHIFTX - 341 - WarSelectUI.WARMARKERSHIFTX,y + WarSelectUI.TERRSHIFTY - 341) != 0;
```

and the GIF is `reference/extracted/android/110_Mobile_MapBitmapData.bin`:

```
$ file reference/extracted/android/110_Mobile_MapBitmapData.bin
reference/extracted/android/110_Mobile_MapBitmapData.bin: GIF image data, version 89a, 63 x 72
```

Decoded (PIL, RGB): exactly **two colours** — `(0,0,0)` sea and `(255,255,255)` land —
and **735 land pixels of 4536**. Land bbox i∈[1,61], j∈[1,70]. Pixel→internal-territory
map (from the line above): `i = x − 328`, `j = y − 290`.

Rendered (`#` = land):

```
 0 ...............................................................
 1 ................................................#..............
 2 ...............................................###.............
 3 ...............................................###.............
 4 ...............................................####............
 5 ...............................................#####...........
 6 ...............................................######..........
 7 ...............................................#######.........
 8 ...............................................##########...#..
 9 ...............................................##############..
10 ..............................................##############...
11 ..............................................###############..
12 ..........................................#...###############..
13 ..........................................####################.
14 ..........................................#################....
15 .........................................##############........
16 ........................................##############.........
17 ........................................##..#....#####.........
18 ........................................###.......####.........
19 .........................................###........##.........
20 .........................................####..................
21 .........................................##.#..................
22 ............................................##.................
23 ..........................................#.##.................
24 ..........................................#..#.................
25 ..........................................####.................
26 ........................................######.................
27 ........................................#######................
28 .........................................#######...............
29 ........................................########...............
30 .........................................#######...............
31 .........................................#######...............
32 .........................................#######...............
33 ........................................########...............
34 ........................................#######................
35 ........................................#######................
36 .......................................########................
37 .......................................######..................
38 ......................................#######..................
39 .....................................#######...................
40 ....................................#########..................
41 ..............................#.....#########..................
42 ............................###....##########..................
43 ............................##...############..................
44 ............................##.#############...................
45 ............................################...................
46 ...........................################....................
47 ..........................#################....................
48 ..........................#################....................
49 ..........................##################...................
50 ...................####..###############.###...................
51 .............###########################.##....................
52 ............##########################..###....................
53 ...........#################.######.##..#......................
54 ..........##################..####..#..........................
55 ........##########...#.######..................................
56 ......#########..##.#########..................................
57 ......#####..#..#####.#####....................................
58 .....##...#..########.####.....................................
59 ....###.#...########...###.....................................
60 ..#######.######.##............................................
61 .##########.###................................................
62 .#########..###................................................
63 ..##.#####...#.................................................
64 .....#####.....................................................
65 ....#####......................................................
66 ...######......................................................
67 ...######......................................................
68 ....#.##.......................................................
69 ....#.##.......................................................
70 ......#........................................................
71 ...............................................................
```

That is the Japanese archipelago — Kyushu bottom-left, Honshu curving up, Hokkaido
top-right. **Nothing needs to be mined from Fandom and nothing needs to be traced.**
The world-map UI even states its own projection scale:

```
reference/decompiled/shs3_android/scripts/WorldMapUI.as:230
   this.playermarker.x = (terrx + TERRSHIFTX) * 10 + 5;
```

→ **10 px per territory**, so the world map is a 630 × 720 px canvas.

### WX-02 — The world land mask is BYTE-IDENTICAL between the web v0.717 payload and the Android v0.682 build. `[A3]`

```
$ md5 reference/extracted/bindata/92_1t4648s0.bin reference/extracted/android/110_Mobile_MapBitmapData.bin
MD5 (reference/extracted/bindata/92_1t4648s0.bin) = 13068dfa1a5cc5628720a25782f93fed
MD5 (reference/extracted/android/110_Mobile_MapBitmapData.bin) = 13068dfa1a5cc5628720a25782f93fed
$ cmp reference/extracted/bindata/92_1t4648s0.bin reference/extracted/android/110_Mobile_MapBitmapData.bin && echo "BYTE-IDENTICAL"
BYTE-IDENTICAL
```

Stage-0 finding S0-1 catalogued web bindata `92` merely as "GIF89a 63x72". It is the
world. This is the only world-exploration artifact whose cross-build parity is *proven*
rather than inferred.

### WX-03 — The coordinate law is fully specified: `nodeid = sectorX<<12 | sectorY`, `territory = floor(sector/6)`, `territorySector = sector mod 6`. `[A2]`

```
reference/decompiled/shs3_android/scripts/NodeGenerator.as:298-302
   var sectorx:int = nodeid >> 12 & 0x0FFF;
   var sectory:int = nodeid & 0x0FFF;
   var territoryx:int = Math.floor(sectorx / 6);
   var territoryy:int = Math.floor(sectory / 6);
   return new Point(territoryx,territoryy);
```
```
reference/decompiled/shs3_android/scripts/NodeGenerator.as:333
   var nodeid:int = nodex << 12 | nodey;
```

A **territory is exactly 6 × 6 = 36 sectors**; a sector is one explorable node.
735 land territories × 36 = **26,460 explorable nodes**. Displayed coordinates are
offset by two constants:

```
reference/decompiled/shs3_android/scripts/WarSelectUI.as:15-19
   public static var WARMARKERSHIFTX:int = 8;
   public static var TERRSHIFTX:int = 21;
   public static var TERRSHIFTY:int = 51;
```

### WX-04 — The ledger's "(start 21,51 / 0,3)" is CONFIRMED and now fully derived from a payload constant. `[A2]`

Ledger, line 224 (Ready): *"territory/sector coord system (start 21,51 / 0,3)"*.

The starting node id is a literal in character creation:

```
reference/decompiled/shs3_android/scripts/StatsManager.as:713
   setPlayerStats(STAT_LOCATION,8382465);
```

Decode `8382465` with WX-03: sector (2046, 2049) → territory (341, 341), territory-sector
(0, 3) → displayed territory (341−341+21, 341−341+51) = **(21, 51)**, displayed sector
**(0, 3)**. Exactly the ledger's pair. The Ready bullet was right; it just never knew
*why*, or that "21,51" is `TERRSHIFTX/TERRSHIFTY` — i.e. the world's level-3 origin sits
at displayed-coordinate (21,51) by construction. `8382465` is also the very first node in
`reference/extracted/android/112_Mobile_NodeData.bin:5` (`<id>8382465</id>`).

### WX-05 — FRAME EVIDENCE: the 6×6 territory grid and the sector coordinate are on screen, and they match the code exactly. `[A1]`

Crop used: `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg` (512×288),
crop box (360, 10)–(512, 120), Lanczos-upscaled ×8 → 1216×880.

Visibly in that crop: a **6-column × 6-row minimap grid, columns labelled `0 1 2 3 4 5`
across the top and rows labelled `0 1 2 3 4 5` down the left**, compass letters N/E/S/W on
the frame edges, a white player triangle at **column 1, row 3**, a gold up-arrow exit icon
at (3,0), gold gate icons at (5,0) and (0,5), a gold `X` marker at ~(2,2), and a dashed
white route outline. Immediately below the minimap the HUD prints
**`TERRITORY (24,52)` / `SECTOR (1,3)`** — the player triangle's grid cell.

The frame independently confirms `Math.floor(sectorx / 6)` / `sectorx % 6`: a territory
really is a 6×6 board and the sector pair really is the within-territory index.
**Frame and payload agree; no conflict to adjudicate.**

Two further frames in the same directory, cropped (415,132)–(500,162) and upscaled ×4,
read `TERRITORY (24,52) / INSIDE SECTOR (3,0)` (`frame_0040.jpg`) and
`TERRITORY (24,52) / SECTOR (3,2)` (`frame_0080.jpg`) — the two label variants are two
different widgets:

```
reference/decompiled/shs3_android/scripts/Minimap.as:103
   this.sectorlabel.text = LangManager.getString(557) + "(" + ... + ")\nInside " + LangManager.getString(319) + "(" + sector.x + "," + sector.y + ")";
reference/decompiled/shs3_android/scripts/Territorymap.as:113
   this.sectorlabel.text = LangManager.getString(557) + "(" + ... + ")\n" + LangManager.getString(319) + "(" + sector.x + "," + sector.y + ")";
```
(string 557 = `Territory`, 319 = `Sector`, per `docs/gauntlet/L0/index/strings.json`.)

### WX-06 — FRAME EVIDENCE: the location name burned into the video is REPRODUCIBLE from the payload, character for character. `[A1]`

Same directory, `frame_0020.jpg` and `frame_0080.jpg`, HUD title bar — crop box
(20, 40)–(180, 64), Lanczos-upscaled ×5: **"W KAKUCHI MOUNTAIN PATH"** and
**"KAKUCHI DOJO GATES"**, both at `TERRITORY (24,52)`. (`frame_0040.jpg`, same crop, reads
**"CASTLE INNER WALLS"** — an authored room name, not a generated one.)

The `W` prefix is itself generated: `frame_0020`'s sector is (1,3), and `terrSector.x = 1
≤ 1` is exactly the condition that emits `LangManager.getString(401)` = "W", while
`terrSector.y = 3` is neither `≤1` nor `≥4` so no N/S prefix is emitted. `frame_0080`'s
sector (3,2) triggers neither branch — and its title carries no direction prefix.

The name generator is:

```
reference/decompiled/shs3_android/scripts/NodeGenerator.as:1637-1695  (getNodeName)
   ... if(terrSector.x <= 1) { dir2 = LangManager.getString(401); }   // "W"
   ... var territoryName:String = NameGenerator.getInstance().getPlaceName(this.getTerritoryId(nodeid));
   ... return dir + territoryName + " " + bgString;
```
```
reference/decompiled/shs3_android/scripts/NameGenerator.as:145-153
   var territoryx:int = territoryID >> 12 & 0x0FFF;
   var territoryy:int = territoryID & 0x0FFF;
   var namex:int = territoryx % 137;
   ...
   return this.getTownName2(territoryID);
reference/decompiled/shs3_android/scripts/NameGenerator.as:162-166
   var rng:RNG = new RNG(territoryID * 2);
   return this.namestarting[rng.rand(this.namestarting.length)] + this.nameending[rng.rand(this.nameending.length)];
```
```
reference/decompiled/shs3_android/scripts/RNG.as:64-66
   this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
   return this.randomSeed / 233280;
```

Re-implementing that LCG in Python and feeding it the frame's own coordinate —
displayed (24,52) → internal territory (344,342) → `territoryID = 344<<12|342 = 1409366` —
returns **`Kakuchi`** (`namestarting[73]="Ka"` + `nameending[19]="kuchi"`). Verbatim match
with the frame. The same routine names the start territory (341,341 → id 1397077)
**`Kasuta`**.

Consequence: **every place name in a 26,460-node world is deterministically regenerable**
from `nodeid` alone. The hand-authored `89_NameGenerator_PlaceNames.bin` supplies the
real-Japanese-city table used when `territoryX % 137 < 26` (`Anjo, Chiryu, Chita,
Gamagori, Handa, ... Nagoya, Okazaki, Toyota, ...`, `reference/extracted/android/89_NameGenerator_PlaceNames.bin:1-32`, then `:33 Akita`
onward — one 26-name block per `namey` row, indexed `namex * 26 + namey`).

### WX-07 — The enemy/content level gradient is a Manhattan distance from territory (341,341), capped at 200. `[A2]`

```
reference/decompiled/shs3_android/scripts/NodeGenerator.as:385-390
   var lvl:int = Math.abs(territory.x - 341) + Math.abs(territory.y - 341) + this.LEVELSTART;
   if(lvl > 200) { lvl = 200; }
```
```
reference/decompiled/shs3_android/scripts/NodeGenerator.as:144
   internal var LEVELSTART:int = 3;
```

Evaluated over the 735 land territories of WX-01 the world's actual level range is
**3 … 93** (the 200 cap is unreachable — the archipelago is not wide enough). Territory
counts by level: L3 ×1, L4 ×2, L5 ×4, L6 ×5, L7 ×7, L8 ×8, L9 ×10, L10 ×9, L11 ×10, L12 ×14.
Cross-check against WX-05: the frame's territory (24,52) → internal (344,342) →
lvl = 3 + 1 + 3 = **7**, and the same frame's HUD shows a level-**8** player. Consistent.

This single formula is the whole difficulty geography, and it is *not* in the ledger at all.

### WX-08 — Blocker ④ "AP regen rate + cap" is DEAD. `[A2] [OVERTURNS §4:225]`

Ledger, line 225: *"④ AP regen rate + cap."*

```
reference/decompiled/shs3_android/scripts/StatsManager.as:158
   internal static var APINTERVAL:int = 60;
reference/decompiled/shs3_android/scripts/StatsManager.as:1100
   diff = Math.floor(timeDiff / APINTERVAL) + 1;
reference/decompiled/shs3_android/scripts/StatsManager.as:1101-1103
   if(StatsManager.hasBuff(StatsManager.BUFF_AP)) { diff *= 2; }
```

**1 AP per 60 real seconds**, doubled under `BUFF_AP`. Regen is time-stamp based
(`nextAPUpdate`), so it accrues while logged out.

Start and cap:
```
reference/decompiled/shs3_android/scripts/StatsManager.as:707-708
   setPlayerStats(STAT_AP,30);
   setPlayerStats(STAT_MAXAP,30);
reference/decompiled/shs3_android/scripts/InventoryUI.as:2409
   this.statsPanel.APadd.visible = StatsManager.getStat(StatsManager.STAT_MAXAP) < 20 + (charlevel + 10);
```
→ start 30 AP, and max-AP may be raised by stat points only while
`maxAP < charLevel + 30`. Gold faucet: `strings.json["100"]` =
`"You are out of AP.\nWould you like to get 10 more AP for 1 Gold?"`, paid out at
`GetGoldPromptDialog.as:204  StatsManager.changeStat(StatsManager.STAT_AP,10);`.

Death-on-empty rule (feel-relevant, uncatalogued anywhere in the project):
```
reference/decompiled/shs3_android/scripts/MCSPlayer.as:1230
   ... GameEngine.isAdventureMode() && this.controlledBy == 0 && StatsManager.getStat(StatsManager.STAT_AP) == 0
```

### WX-09 — The real AP cost table is bigger and different from the ledger's. `[A2] [CORRECTS §4:224]`

Ledger, line 224 (Ready): *"AP cost table (pick 1 / search+mine 2 / stable 5)"*.

Measured, every `StatsManager.checkAP(n)` call site:

| Action | AP | Cite |
|---|---:|---|
| Enter node (overworld → adventure) | **1** | `NodeUI.as:361` |
| Travel to adjacent node (world map) | **5** | `NodeUI.as:384` |
| Rest at inn (+100 HP, +100 Chi) | **1** | `NodeUI.as:395` |
| Camp (+50 HP, +50 Chi) | **5** | `NodeUI.as:414` |
| Hunt | **3** | `NodeUI.as:427` |
| Fish | **3** | `NodeUI.as:460` |
| Search a bush | **2** | `NodeUI.as:535` (`runSearch`) |
| Mine an ore deposit | **2** | `Obj_OreDeposit.as:getAPUse → return 2` |
| Pick up a pickable | **1** | `Obj_PickableItem.as:27`, `Obj_PickableItemProcGen.as:77` |
| Walk through a signpost | **1**, or **0** in town/dojo | `Obj_DirectionSign.as:20,108,164` |
| Stables fast-travel | **5** + coins | `InteractUI.as:1723,1736` |
| Quest step | per-step `<ap>` field | `NodeUI.as:619` |

Two corrections to the ledger bullet: **"pick 1" is right, "search+mine 2" is right,
"stable 5" is right but incomplete** — stables also charge gold:

```
reference/decompiled/shs3_android/scripts/InteractUI.as:1723
   var cost:int = NodeGenerator.instance.getNodeLevel(StageManager.getCurrentNode()) * 2;
```
→ **stable fare = (node level × 2) coins + 5 AP**, and the only destinations are the
towns of the four orthogonally adjacent territories, each gated on
`territoryData.hasTown() && territoryData.isInBoundary()` (`InteractUI.as:1685-1691`).
The signpost's *free-in-town* rule is also new: `apuse = 0` when the current room is a
town interior (`roomid < 14 || roomid >= 100`) or a dojo (`Obj_DirectionSign.as:106-108`).

The ledger's "4 travel methods" resolves to: signpost walk (1 AP) · world-map travel
(5 AP) · stables (5 AP + level×2 coins) · consumable teleport items
(`InventoryUI.as:980,1045` teleport to an arbitrary node id; `:960,1067` recall to the
start node `8382465`).

### WX-10 — Blocker ② "gather/mine/farm yield + whiff tables" is DEAD. `[A2] [OVERTURNS §4:225]`

Ledger, line 225: *"② gather/mine/farm **yield + whiff + respawn** tables."*

**Hunt** (3 AP), `NodeUI.as:424-455` — `dice = Math.random() * 10`:
| dice | p | result |
|---|---:|---|
| 3,4,5 | 30% | item **2112** ×1, "You caught small game." |
| 1,2 | 20% | item **2113** ×1, "You caught some game!" |
| 0 | 10% | item **2114** ×1, "You caught big game!" |
| 6,7,8,9 | **40% whiff** | "You did not catch anything." |

**Fish** (3 AP), `NodeUI.as:456-490` — identical dice shape:
30% item **2109** ("You caught a small fish."), 20% item **2110** ("You caught a fish!"),
10% item **2111** ("You caught a big fish!"), **40% whiff**.
(String texts from `docs/gauntlet/L0/index/strings.json` ids 129/130/131/169/170/171/172.)

**Search a bush** (2 AP, 24-frame progress bar `NodeUI.as:539`):
```
reference/decompiled/shs3_android/scripts/Obj_Bush.as:47
   if(int(Math.random() * 10) <= StatsManager.getStat(1021))
```
→ success = `(searchSkill + 1) / 10`; at skill 0 that is **10% success / 90% whiff**,
+10 pp per point of skill **1021**. On success: `addRandomLootItem(this.lvl, false, true)`
plus a physical loot-pop (`ProjectileManager.createLootProjectile`, `movtx` ∈ [−8,8],
`movty` ∈ [−35,−25], `rot` ±20 — `Obj_Bush.as:52-67`).

**Mine** (2 AP, 24-frame progress bar `NodeUI.as:556`):
```
reference/decompiled/shs3_android/scripts/Obj_OreDeposit.as:70
   if(oreType != 2 && int(Math.random() * 2) != 0)
      OverworldHUD.getInstance().getNodeUI().runMine(1,this);
```
→ **50% of swings on any non-Coal deposit downgrade to ore type 1 (plain Rock)**. Gates:
must have a pickaxe equipped (`getStat(59) != 13022` → "You need to equip a pickaxe."),
weapon must not be broken, and skill **1022** gates the tiers —
`type 8 needs ≥5, 7 needs ≥4, 6 needs ≥3, 5 needs ≥2, 3 needs ≥1` (`Obj_OreDeposit.as:58`).

**Respawn** is not a timer — it is one-shot-per-node: any successful non-Rock mine calls
`clearOre()`, which does `StageManager.addToDeadList(objectName)`
(`Obj_OreDeposit.as:78-85`). Ore reappears when the room is regenerated.

**The ore ladder, fully named** (`doMine`, `NodeUI.as:566-597`, ids resolved from
`strings.json` 652–659):

| type | item id | name |
|---:|---:|---|
| 1 | 20059 | Rock |
| 2 | 20060 | Coal Deposit |
| 3 | 20061 | Iron Deposit |
| 4 | 20062 | Tin Deposit |
| 5 | 20063 | Copper Deposit |
| 6 | 20064 | Silver Deposit |
| 7 | 20065 | Titanium Deposit |
| 8 | 20066 | Diamond Deposit |

Which type a node spawns is deterministic in the node id (`NodeGenerator.as:1798-1852`):
non-premium rolls `rng.rand(4/5/6)` widening at node level >30 and >60; the premium
(gem-node) branch returns **6 below lvl 30, 7 below lvl 60, 8 above**. *(Decompiler note:
ffdec hoists `var lvl:int = 0;` above the `if(!premium)` branch and re-assigns it at
`:1843`; the source plainly computed `lvl` first — read the tiers, not the ordering.)*

### WX-11 — Farming: full timer, soil-grade and yield tables, plus an ambush rule nobody has recorded. `[A2] [OVERTURNS §4:225]`

Crop timers, `reference/decompiled/shs3_android/scripts/Obj_VegePatch.as:80-140` and
`InteractUI_crops.as:116-161`:

| plantType | grow time | then |
|---:|---|---|
| 1 | `15 * 60` = 15 min | READYFORHARVEST |
| 2 | `60 * 60` = 1 h | READYFORHARVEST |
| 3 | `6 * 60 * 60` = 6 h | READYFORHARVEST |
| 4 | `12 * 60 * 60` = 12 h | READYFORHARVEST |

```
reference/decompiled/shs3_android/scripts/Obj_VegePatch.as:80
   var gracePeriod:int = 15 * 60;
```
→ **15 minutes of harvest window, then the crop ROTS.** All measured against
`QueryManager.instance.getServerTime()`, i.e. real wall-clock seconds.

Soil grade ("Soil Grade", string 285; "Harvested", string 287) —
`InteractUI_crops.as:457-481`: patch level **1** <10 harvests, **2** <20, **3** <30,
**4** <40, **5** <50, **6** at 50 (the counter clamps at 50, `:105-107`).

Harvest roll, `InteractUI_crops.as:607-646`:
```
if(StatsManager.getStat(this.startingIndex + 2) == 1 || int(Math.random() * (10 - StatsManager.getStat(1020))) == 0)
```
→ the first-ever harvest is guaranteed; after that the chance is `1 / (10 − farmSkill)`
(skill stat **1020**), i.e. **10% at skill 0**. On success `dice = Math.random() * patchlevel`
picks the crop: 0→item 2115, 1→2116, 2→2117, 3→2118, 4→2140, 5→2141 — so a higher soil
grade *widens* the table rather than improving it.

**Uncatalogued anywhere in the project:** harvesting spawns a fight.
```
reference/decompiled/shs3_android/scripts/InteractUI_crops.as:595-604
   wave.init(new XMLList(<enemy><id>64</id><qty>1</qty><x>400</x></enemy>));
   ...
   GameEngine.initBattleMode(-1,8,43,800,0,wavelist,150);
```
One enemy id 64 at x=400, on an **800-px** stage, player entering at x=150, bg 43 —
except at node **8402947**, where bg 19 is used instead.

### WX-12 — Blocker ③ "'day' length" is mis-framed. There is no in-game day; there are three independent real-time clocks. `[A2] [OVERTURNS §4:225 and §1:116]`

Ledger, line 225: *"③ real-world **"day" length** (governs expiry, farming, AP regen, war tick)."*
Ledger, line 116: *"**The real-world "day" length** governing quest expiry, farming, AP regen, and the War-Room 24h tick."*

Both sentences assume one shared clock. The payload has three, all in raw seconds off
`QueryManager.instance.getServerTime()`:

1. **AP** — `APINTERVAL = 60` (WX-08). Not a day.
2. **Farming** — 900 / 3600 / 21600 / 43200 s + 900 s grace (WX-11). Not a day.
3. **A literal 24 h**, used for quest repeat-eligibility and buff expiry only:
```
reference/decompiled/shs3_android/scripts/StatsManager.as:1184
   if(completedQuest.completedTime == 0 || completedQuest.completedTime < serverTimeVariable - 24 * 60 * 60)
reference/decompiled/shs3_android/scripts/InteractUI.as:1153
   StatsManager.setStat(30018,QueryManager.instance.getServerTime() + 24 * 60 * 60);
reference/decompiled/shs3_android/scripts/QueryManagerBase.as:105
   this.serverDateYesterday = new Date(this.serverTime * 1000 - 24 * 60 * 60 * 1000).getDate();
```

So "day" = **86,400 real seconds anchored to the server clock**, and it governs *only*
quest expiry / daily-prize rollover — **not** farming and **not** AP regen. The blocker
should be rewritten, not closed as stated.

### WX-13 — Blocker ⑤ "sector↔room mapping rule" is DEAD, and the answer is neither of the two options the ledger offered. `[A2] [OVERTURNS §4:225]`

Ledger, line 225: *"⑤ sector↔room mapping rule (town=fixed sector vs wilderness=one-screen-per-sector)."*

Every node owns a `<roomdata>` list of side-scrolling rooms; the player's saved position is
a `(node, room)` pair:

```
reference/extracted/android/112_Mobile_NodeData.bin:8-18
	<roomdata>
		<room>
			<id>0</id>
			<bg>4</bg>
			<width>800</width>
			<obj>
				<id>0</id>
				<x>750</x>
				<property>0,50,8386561,1,2,2,1</property>
			</obj>
		</room>
```
```
reference/decompiled/shs3_android/scripts/QuestEngine.as:1234-1240
   var roomid:int = StatsManager.getStat(StatsManager.STAT_LOCATION_ROOM);
   var currentNode:XMLWorldNode = getNodeData(currentID);
   ... roomData = currentNode.getRoomData();
       roomPrivate = int(roomData[roomid].isPrivate);
```

Measured over the whole authored file: **44 nodes, 98 rooms, 94 with an explicit
`<width>`, min 800 px, max 4000 px** (modes: 800 ×22, 1000 ×21, 1400 ×7, 1600 ×7).
Against the 800 × 480 native canvas that is **1 to 5 screens of horizontal scroll per
room**. Rooms also carry `<bg>` (30 distinct background ids used), an optional
`<roomname>` and an optional `<enterx>` spawn abscissa (values seen: 200, 200, 200, 400).

So the rule is: **sector = node; node = an ordered list of rooms; room = one
side-scrolling stage of declared pixel width.** Neither "town = fixed sector" nor
"wilderness = one screen per sector" — both town and wilderness nodes carry multi-room
lists.

Room contents are typed by a 73-entry object enum, fully recovered at
`reference/decompiled/shs3_android/scripts/GameStage.as:683-920` — `0 Obj_DirectionSign,
1 Obj_TextSign, 2 Obj_Bush, 3 Obj_NPC, 4 Obj_NPCCivilian, … 30 Obj_OreDeposit,
31 Obj_Hut, … 43 Trap_SawBladesAuto, … 69 Marker_RumbleTrigger, 70 Obj_GourdVoid,
71 Obj_TownSign, 72 Obj_MountainEntrance, 100 = nested obj list`. Object id 0
(signpost) accounts for 186 of the file's 343 `<obj>` entries — **the signposts *are*
the node graph.**

Signpost property format, decoded from `Obj_DirectionSign.as:37-90`:
`destRoom, entryX, destNodeId, visible, compassDir(0=N,1=S,2=E,3=W), spriteFrame, arrowLabelId`.
Worked example, `112_Mobile_NodeData.bin:16` `<property>0,50,8386561,1,2,2,1</property>`
= "walk East to node 8386561, land in its room 0 at x=50".

### WX-14 — The world is 99.8% procedural, and the generator is on disk. `[A2]`

Only 44 nodes are hand-authored. Everything else is generated deterministically from the
node id:

```
reference/decompiled/shs3_android/scripts/QuestEngine.as:1123
   return NodeGenerator.getInstance().generateNode(nodeID >> 12 & 0x0FFF,nodeID & 0x0FFF);
```

Territory layout itself is seeded generation — `TerritoryData(id)` calls
`this.nodeExits = this.generateSectors();` at `TerritoryData.as:74`, a 430-line
road-and-route builder (`generateSectors` :1054, `linkToRoad` :1488,
`connectSurroundingEmpty` :1550, `getValidMove` :1597, `createRoute` :1671) driven by
`new RNG(seed)`. Territory exits are likewise pure functions of the id:

```
reference/decompiled/shs3_android/scripts/TerritoryData.as:86-99
   var rng:RNG = new RNG(territoryId);
   var dice:int = rng.rand(3);
   var count:int = 1;
   if(dice == 3) { count = 2; }
   ... output.push(rng.rand(4) + 1);
```

With the RNG of WX-06 (`seed = seed*9301+49297 mod 233280`) this whole world is
**bit-reproducible offline**. The ledger's framing — that geography must be scraped from a
wiki — had the problem exactly backwards: geography is *code*, and we have the code.

Per-territory fixed features are enumerated as node-id lists on `TerritoryData`
(`dungeonList, controlPointList, pickableList, exitsList, hutList, animalSpawnList,
dojoNode, templeNode, oniDenNode, graveyardNode, mercCampNode, townNode`,
`TerritoryData.as:9-49`), and the minimap icon enum is 24 values
(`NodeGenerator.as:34-82`: `ICON_NOTHING 0 … ICON_BEACH 23, ICON_OVERWRITENODE 100`).

### WX-15 — Town prosperity thresholds are exact numbers, not a qualitative "ladder". `[A2] [CORRECTS §4:224]`

Ledger, line 224 (Ready): *"prosperity ladder"* — listed as known but never numeric.

```
reference/decompiled/shs3_android/scripts/TerritoryData.as:782-804  (getTownLevel)
   if(this.townProsperity == 0)    { return 0; }
   if(this.townProsperity < 500)   { return 1; }
   if(this.townProsperity < 1000)  { return 2; }
   if(this.townProsperity < 2000)  { return 3; }
   if(this.townProsperity < 4000)  { return 4; }
   return 5;
```

Six town tiers at **0 / 500 / 1000 / 2000 / 4000** prosperity, with the progress string
rendered as `current/next` (`getProsperityStr`, :807-830). Certain territories are pinned
to a fixed level and never change (`NodeGenerator.as:393-447`, `isNoChangeTown` / `getNoChangeTownLevel`: ids
1466699, 1503572, 1368424, 1540387, 1413461, 1409366, 1401176, 1397081 → level 5;
1405270 → 4; 1401173 → 3; 1397077, 1397078 → 0). Note **1409366 = the frame's Kakuchi**,
and **1397077 = the start territory**, pinned to level 0 (no town at spawn).

### WX-16 — §6 "save format — nothing to copy" is WRONG. The complete save schema is 24 named slots. `[A2] [OVERTURNS §6:351]`

Ledger, line 351: *"**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."*

The topology half stands (Player.IO BigDB is dead). The **save format half is false** —
the serializer is fully enumerated:

```
reference/decompiled/shs3_android/scripts/QueryManagerBase.as:15
   internal static var DATASLOTS:int = 20;
```
```
reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:1047-1187
   saveUpdate(0, StatsManager.getPlayerLevelString());
   saveUpdate(1, StatsManager.getPlayerStatsString());     saveUpdate(103, getBattleStatsString());
   saveUpdate(2, getEquipmentString());     saveUpdate(3, getSkillStatsString());
   saveUpdate(4, getInventoryString());     saveUpdate(5, getQuestItemsString());
   saveUpdate(6, getIntStatsString());      saveUpdate(7, getBooleanStatsString());
   saveUpdate(8, getActiveQuestString());   saveUpdate(9, getCompletedQuestString());
   saveUpdate(10, getLocationString());     saveUpdate(11, getTaunt());
   saveUpdate(12, getFriendListString());   saveUpdate(14, getSkillSlotsString());
   saveUpdate(15, getSide().toString());    saveUpdate(16, getPlayerDanString());
   saveUpdate(17, getStashString());        saveUpdate(18, getOptionsString());
   saveUpdate(19, getAchievementStatsString());
   saveUpdate(100, StatsManager.nextAPUpdate.toString());
   saveUpdate(101, StatsManager.nextDTUpdate.toString());
   saveUpdate(102, StatsManager.nextWarTurn.toString());
```

Slot **10** is the world position: `STAT_LOCATION = 19` holds the packed node id,
`STAT_LOCATION_ROOM = 43` the room index (`StatsManager.as:208,248,5073-5080`). Every
`get*String()` body is in the same file. There is also a real
`offlineMode` branch (`QueryManagerPIO.as:1025-1029`) and a
`saveCharCookieData()` local-persistence path (`:1024`). A single-player schema does
not need designing from scratch — it needs transcribing.

### WX-17 — §1's "not a grid you can generate from W×H" is wrong. `[A2] [OVERTURNS §1:115]`

Ledger, line 115: *"**World-map topology/projection** (sparse geographic Japan outline, not a grid you can generate from W×H)."*

It **is** a W×H grid — 63 × 72 — carrying a 1-bit land mask (WX-01), rendered at 10 px per
cell (WX-03). Two lines of code and one 272-byte GIF reproduce the entire projection. The
"sparse geographic outline" intuition was right about the *shape* and wrong about the
*representation*, which is what made it look unrecoverable.

### WX-18 — Surface bullet CONFIRMED: still zero world numbers in config. `[A3]`

Ledger, line 226: *"**Surface:** ZERO world numbers in config yet — needs new `world.ts`/`ap.ts`/`farming.ts` modules."*

```
$ ls src/config/
CLAUDE.md   ai.ts   anim.ts   art.ts   chi.ts   combat-sim.ts   combat.ts
display.ts  duel.ts economy.ts fidelity.ts fx.ts gesture.ts mobs.ts nums.ts
ogAnims.ts  ogPose.ts palette.ts popups.ts poses.ts profile.ts reach.ts
rng.ts      skills.ts stances.ts stats.ts timing.ts xp.ts
```

No `world.ts`, no `ap.ts`, no `farming.ts`, no `nodes.ts`. This is now the *only* thing
between the ledger's 35 and a build: the numbers exist, they are just un-ported. After
this audit the bullet should read "…and here is the exact list", not "needs measuring".

---

## Honest negatives — things I could NOT ground

### WX-N1 — The rendered world-map ART is STILL_UNHELD. `[STILL_UNHELD]`

`110_Mobile_MapBitmapData.bin` is a 1-bit land/sea **mask**, not the parchment map the
player looks at. The drawn map, its coastline art, terrain and markers live in
`MapBG`/`WorldMapUI` display assets sourced from `assets.swf`, and the mobile art bundle
`124_Mobile_ImageResource.bin` (1.73 MB) is one of the five `CWS` nested-SWF blobs that
Stage-0b finding S0-5 marks **held-but-encrypted, not opened**. I may not claim the map
art is recovered. The *topology* is recovered; the *picture* is not.

### WX-N2 — `119_Mobile_MapData.bin` is EMPTY, and I cannot say why. `[STILL_UNHELD]`

```
$ xxd reference/extracted/android/119_Mobile_MapData.bin
00000000: 3c3f 786d 6c20 7665 7273 696f 6e3d 2231  <?xml version="1
00000010: 2e30 2220 656e 636f 6469 6e67 3d22 7574  .0" encoding="ut
00000020: 662d 3822 3f3e 0d0a 3c6d 6170 6461 7461  f-8"?>..<mapdata
00000030: 3e0d 0a0d 0a3c 2f6d 6170 6461 7461 3e0d  >....</mapdata>.
00000040: 0a                                       .
```

65 bytes, `<mapdata></mapdata>`, zero children — the class `Mobile_MapData.as` and
`QuestEngine.getMapSquareID` / `XMLWorldMap` exist and expect content. Whether v0.717 web
shipped a populated `mapdata` (making this an Android-only stripping) is **not
established**. Flagged as a lead, not a finding.

### WX-N3 — The node-level `<search>` block's semantics are STILL_UNHELD. `[STILL_UNHELD]`

The whole authored node file contains exactly one:
`reference/extracted/android/112_Mobile_NodeData.bin:33-36`
`<search><id>20000</id><chance>5</chance></search>`.
`XMLWorldNode.as:94-96` stores it in `searchList` and **no consumer of `searchList` exists
anywhere in the 559-class decompile.** `chance` in `XMLLoot` is a 0..1 fraction
(`Overworld.as:324  chance = loot.chance * 100`), which would make `5` meaningless here.
Dead field, alternate scale, or a consumer I did not find — I do not know. Not claimed.

### WX-N4 — Cross-build numeric parity for the world constants is STILL_UNHELD. `[STILL_UNHELD]`

Only the land mask is byte-proven identical across v0.717 and v0.682 (WX-02). The web
payload's string pool proves the *same procedural room builder* ships in v0.717
(templates + `roomdata` + `procgenronin`/`aggrobandits`/`merccaptain`), but I found **no
web-side decompile of `NodeGenerator`/`StatsManager`** — `reference/decompiled/shs3_payload/scripts/`
holds only display symbols, and `grep` for `getNodeLevel|APINTERVAL|TERRSHIFTX|getOreType`
across the 329 MB `payload.xml` returns nothing. So `APINTERVAL=60`, `LEVELSTART=3`, the
crop timers and the AP costs are **Android v0.682 measurements**. Label them as such.
Both android bundles report `clientVersion:Number = 0.682`
(`shs3_android/scripts/StatsManager.as:30`, `shs3_android_payload/scripts/StatsManager.as:30`).

---

## Recommended rewrite of §4's world-exploration block

```
### world-exploration — 85
- Ready: coord law (nodeid = x<<12|y, territory = sector/6, 6x6 sectors/territory, display
  shift +21/+51, start node 8382465 = displayed T(21,51) S(0,3)); byte-exact 63x72 land
  mask (735 land territories, byte-identical web<->android); level gradient
  lvl = |tx-341|+|ty-341|+3 cap 200 (real range 3..93); full AP cost table + 1 AP/60 s
  regen + cap level+30; hunt/fish/search/mine/farm yield & whiff tables; ore ladder
  Rock..Diamond with skill gates; crop timers 15m/1h/6h/12h + 15m rot grace; soil grade
  1-6 at 10/20/30/40/50 harvests; prosperity tiers 0/500/1000/2000/4000; 73-entry room
  object enum; signpost property format; node->room->px-width model (98 rooms, 800-4000 px);
  deterministic RNG (seed*9301+49297 mod 233280) + place-name generator (frame-verified
  "Kakuchi"); 24-slot save schema.
- Blockers: (1) rendered world-map ART (inside the encrypted 124_Mobile_ImageResource).
  (2) numeric parity of the world constants vs web v0.717 (only the land mask is proven).
  (3) 119_Mobile_MapData is empty - unexplained. (4) node <search><chance> semantics.
- Surface: STILL zero world numbers in src/config - port world.ts / ap.ts / farming.ts
  straight from this journal; nothing left to measure.
```
