# CITE-LENS REVIEW — unit: world-exploration

Reviewer: blind critic (LENS 1, over-claiming / mis-citation).
Method: every cite below was opened by me, first-hand, in this session. Frames were
cropped and upscaled before grading. Nothing here is taken from the surveyor's word.

**Headline: 22/22 claims survive.** This is the cleanest citation record I have audited
in this lane. Every line number I spot-checked resolved, every verbatim quote appeared
at the stated location, and every measured count I re-derived independently reproduced
the surveyor's number *exactly* (735 land pixels, 44 nodes / 98 rooms / 94 widths,
level histogram 1·2·4·5·7·8·10·9·10·14, 73 enum cases, 30 bg ids, 186/343 signposts).
Six defects found, all **minor** — index/line slips and one enumeration undercount.
No claim is refuted.

**Frame-vs-doc invariant: no conflict arose.** Every frame I opened AGREES with the
payload. I state this explicitly because the invariant requires it be said out loud
when it happens, and it did not happen here.

---

## Verified verbatim (spot-check log)

| cite | verdict |
|---|---|
| `QuestEngine.as:1206` `return mapBitmapData.getPixel(x + WarSelectUI.TERRSHIFTX - 341 - WarSelectUI.WARMARKERSHIFTX,y + WarSelectUI.TERRSHIFTY - 341) != 0;` | exact, line-for-line |
| `md5 bindata/92_1t4648s0.bin` = `13068dfa1a5cc5628720a25782f93fed` = `android/110_Mobile_MapBitmapData.bin`; `cmp` silent | exact |
| GIF decode: 63×72, two colours only, **735** white / 3801 black, bbox x∈[1,61] y∈[1,70] | exact |
| `NodeGenerator.as:298-302` getTerritory · `:333` `nodex << 12 \| nodey` · `WarSelectUI.as:15,17,19` = 8/21/51 | exact |
| `StatsManager.as:713` `setPlayerStats(STAT_LOCATION,8382465);` | exact |
| `NodeGenerator.as:385-390` level formula · `:144` `LEVELSTART:int = 3` | exact |
| `StatsManager.as:158` `APINTERVAL:int = 60` · `:1100-1103` `diff *= 2` under BUFF_AP · `:707-708` AP/MAXAP 30 · `InventoryUI.as:2409` `< 20 + (charlevel + 10)` | all four exact |
| `NodeUI.as:361,384,395,414,427,460,535` — enter 1 / travel 5 / rest 1 / camp 5 / hunt 3 / fish 3 / search 2 | all seven exact |
| `InteractUI.as:1723` `var cost:int = ...getNodeLevel(...) * 2;` · `:1736` `checkAP(5)` | exact |
| `Obj_DirectionSign.as:20` `apuse:int = 1` · `:106-108` free-AP branch | exact |
| `Obj_Bush.as:47` `int(Math.random() * 10) <= getStat(1021)` · `Obj_OreDeposit.as:70` `oreType != 2 && int(Math.random() * 2) != 0` | exact |
| `Obj_VegePatch.as:80-140` 900/3600/21600/43200 + `gracePeriod = 15 * 60` | exact |
| `InteractUI_crops.as:457-481` patch ladder 10/20/30/40/50 · `:595-646` ambush wave + `initBattleMode(-1,8,43,800,0,wavelist,150)` | exact |
| `StatsManager.as:1184` 24h quest-repeat · `QueryManagerBase.as:105` · `InteractUI.as:1153` | all three exact |
| `112_Mobile_NodeData.bin:8-18` roomdata block | exact, byte-for-byte incl. tabs |
| `GameStage.as:683-920` = 73 cases, ids 0…72 with no gaps; `:928` `case 100:` recurses into `createRoomObjects` | exact |
| `QuestEngine.as:1123` `generateNode(nodeID >> 12 & 0x0FFF,nodeID & 0x0FFF)` | exact |
| `TerritoryData.as:782-804` prosperity 0/500/1000/2000/4000; `:807` getProsperityStr; pinned-id lists at `NodeGenerator.as:395,407-421` | exact |
| `QueryManagerPIO.as:1047-1187` — 23 `saveUpdate(` calls, slots 0-12,14-19,103,100,101,102 | exact |
| `WorldMapUI.as:230` `this.playermarker.x = (terrx + TERRSHIFTX) * 10 + 5;` | exact |
| `ls src/config/` | matches the quoted listing character-for-character |
| five `Mobile_*Resource.bin` first 3 bytes = `43 57 53` = "CWS"; `124` = 1,734,935 B | exact |
| `119_Mobile_MapData.bin` = 65 B, `<mapdata>` with zero children | exact |
| `grep -r searchList` → 2 hits, both `XMLWorldNode.as` (decl `:30`, assign `:96`); zero consumers | exact |
| `grep -cE "getNodeLevel\|APINTERVAL\|TERRSHIFTX\|getOreType" payload.xml` → **0** | exact |

### The strongest single result: I reproduced "Kakuchi" myself

Independently re-implementing `RNG.rnd()` (`seed=(seed*9301+49297)%233280`, ctor
advances once) over `NameGenerator.as:40/42`:

- territory (344,342) → id 1409366 → `new RNG(2818732)` → `namestarting[74]="Ka"` +
  `nameending[19]="kuchi"` → **"Kakuchi"**
- start territory (341,341) → id 1397077 → **"Kasuta"**

and `strings.json` gives 401="W", 1015="Mountain Path", so the generated string is
**"W Kakuchi Mountain Path"** — which is exactly what `frame_0020.jpg`'s title bar
reads. The surveyor's claim is not merely cited, it is *executable*, and it executes.

**Bonus corroboration the surveyor did not bank:** the authored start node in
`112_Mobile_NodeData.bin:6` is `<name>1037</name>`, and `strings.json` 1037 =
**"W Kasuta Forest"** — the hand-authored name matches the procedurally derived one,
including the direction prefix. That is an independent second proof of both the name
law and the `terrSector.x<=1 → string 401` prefix law.

### Frames I opened

- `Nr4fQstqHDM/map/frames/frame_0020.jpg` (512×288). Crop (395,40)-(490,135), Lanczos
  ×10 with a red 10-px coordinate grid overlaid. Reads: 6×6 minimap, columns labelled
  0-5 across the top, rows 0-5 down the left, N top / E right / W left / S bottom,
  white player triangle at **col 1 row 3**, gold up-arrow at (3,0), gold gate glyphs at
  (5,0), (0,5), (5,5), gold X at **(3,2)**, dashed white route. Full-frame crop confirms
  title "W KAKUCHI MOUNTAIN PATH", HUD "TERRITORY (24,52)" / "SECTOR (1,3)", level-8
  badge, and a signpost captioned "KAKUCHI MOUNTAIN PATH (E)".
- `frame_0040.jpg` crop (400,125)-(512,170) ×8 → "TERRITORY (24,52)" / "INSIDE SECTOR (3,0)".
- `frame_0080.jpg` same crop → "TERRITORY (24,52)" / "SECTOR (3,2)"; title crop
  (0,20)-(300,70) ×5 → "KAKUCHI DOJO GATES" (no direction prefix, as the law predicts
  for sector x=3).

---

## Defects found (all minor, none refuting)

1. **`frame-confirms-6x6-grid`** — the crop description places the gold X at "~(2,2)".
   It is at **(3,2)**: its centroid (x≈449) sits under the column-3 label and in the
   same column as the up-arrow the same sentence correctly calls (3,0). Load-bearing
   content (grid shape, player at col 1 row 3, HUD agreement) is unaffected.
2. **`place-name-reproduced-from-payload`** — index off by one: `namestarting[73]` is
   `"Iwa"`; `"Ka"` is `namestarting[74]`. Also `RNG.as:64-66` points at `}`, blank,
   and the `rnd()` signature; the LCG line itself is **`RNG.as:68`**. The derived
   output is nevertheless correct, as re-derived above.
3. **`day-length-is-three-clocks`** — substance holds, **count is wrong**. There are at
   least **five** independent real-time intervals, not three. Missing from the claim:
   `StatsManager.as:160` `DTINTERVAL:int = 2 * 60` (duel-token regen, 120 s) and
   `StatsManager.as:162` `WARMOVEINTERVAL:int = 60 * 60` (war move, 3600 s, consumed at
   `:820` `nextWarTurn = getServerTime() + WARMOVEINTERVAL`). See NEW-3 — the war number
   is a *stronger* ledger overturn than the one the surveyor banked.
4. **`save-schema-recovered`** — "**four** timer slots" is wrong; there are **three**
   (100 nextAPUpdate, 101 nextDTUpdate, 102 nextWarTurn). Slot **103 is battlestats**,
   written at `:1057` right beside slot 1 — the claim's own slot list says so. The
   "20 data slots" half is *better* grounded than the claim admits:
   `QueryManagerBase.as:15` declares `internal static var DATASLOTS:int = 20;`.
5. **`farming-tables`** — "15-minute harvest grace before ROT" is true for plantTypes
   1-3 only. `Obj_VegePatch.as` / `InteractUI_crops.as:160-169` case 4 (12 h) has **no
   ROT branch at all**: past `timePeriod` it stays `READYFORHARVEST` forever.
6. **Small slips** — `search-chance-semantics` says "559-class decompile"; the tree
   holds 553 `.as` at `scripts/` top level, 970 including subdirs (the conclusion is
   unaffected: I re-grepped the whole tree). `world-is-procedural` cites
   `TerritoryData.as:74`, which is `super();` — the ctor opens at `:72` and the
   `generateSectors()` call is at `:76`. `gather-yield-whiff-tables` calls items
   2112/2113/2114 "small game / some game / big game"; those are the *dialog* strings
   (171/129/172) — the item names are "Small Meat" / "Meat" / "Large Meat".

One risk I specifically hunted and cleared: the hunt/fish table depends on
`dice = Math.random() * 10` truncating. If `dice` were a `Number`, `dice == 3` would
essentially never fire and the whole 30/20/10 split would collapse to a 100 % whiff.
`NodeUI.as:350` declares `var dice:int = 0;` — AS3 coerces on assignment. The claim
holds for the right reason.

---

## NEW FINDINGS the surveyor missed

### NEW-1 — the world constants ARE in the web v0.717 payload (partially overturns the surveyor's own STILL_UNHELD)

`world-exploration/cross-build-numeric-parity` says "only the land mask is byte-proven
identical across v0.717 and v0.682". That understates what is recoverable. The web
`reference/extracted/payload.xml` int constant pool contains, in one contiguous run:

```
104820:            <item>49297</item>
104821:            <item>233280</item>
104823-104834:     1466699 1503572 1368424 1540387 1397077 1397078
                   1401173 1405270 1413461 1409366 1401176 1397081
```

That is the **LCG modulus and increment**, followed by **all twelve pinned-territory
ids** from Android `NodeGenerator.isNoChangeTown` / `getNoChangeTownLevel`, in the same
clustered order. `8382465` (the start node) is also present. This is constant-pool
evidence, not byte-proof — but it is *exactly* the evidence class the surveyor already
accepted for the procedural room builder, so the same standard should extend the
verdict. Cross-build parity for the world is materially stronger than "land mask only":
the LCG, the pinned-town table and the spawn node all ship in v0.717.

### NEW-2 — the name-generator vocabulary also ships in v0.717

`payload.xml:119152-119260` holds `Cho Dai Ryo Shin Ryu Mata Kin To Hei Kitsu … Iwa Ka
Kasu Ko` then `ta yama kawa moto mura saka saki sawa shima hashi tani o ya su oka ki
harah kuchi da wara washi zaka zaki zawa gawa guchi jo ryu gori nan miya kura riya maki
bara` — the Android `namestarting`/`nameending` arrays in order, minus the entries the
string pool deduplicates (`Kiyo`, `i`, `no`). So the place-name derivation is
corroborated across builds at the vocabulary level, not Android-only.

### NEW-3 — the ledger's "War-Room 24h tick" is flat wrong: it is ONE HOUR

`REBUILD_READINESS.md:116` reads "The real-world 'day' length governing quest expiry,
farming, AP regen, and the **War-Room 24h tick**."
`StatsManager.as:162`: `internal static var WARMOVEINTERVAL:int = 60 * 60;`
`StatsManager.as:820`: `nextWarTurn = QueryManager.instance.getServerTime() + WARMOVEINTERVAL;`
The war move interval is **3600 s**. The surveyor asserted the single-clock premise was
false but never produced this number; with it, §1 line 116 is not merely mis-framed, one
of its four named consumers is numerically wrong. Also touches L11 meta-social.

### NEW-4 — a fifth clock: duel tokens at 120 s

`StatsManager.as:160` `DTINTERVAL:int = 2 * 60`, consumed at `:1133` / `:1148`
(`Math.floor(timeDiff / DTINTERVAL) + 1`), persisted as save slot 101. Absent from the
surveyor's "three independent real-time clocks".

### NEW-5 — minimap X marker is at (3,2)

See defect 1. Cited here separately because it is a frame correction, not a text slip.

### NEW-6 — the 12-hour crop never rots

See defect 5. Relevant to any port: types 1-3 need a rot timer, type 4 must not have one.

---

## Verdict

Score 85 is defensible and, if anything, conservative on one axis: the surveyor's own
fourth honest negative (cross-build numeric parity) is stronger than it claims — the
LCG, the pinned-town table and the start node are all demonstrably in the v0.717
constant pool (NEW-1/NEW-2). The remaining three negatives (encrypted map art, empty
`119_Mobile_MapData.bin`, orphan `<search><chance>`) I re-tested and all three are
correctly, honestly held back.

Zero fabricated cites. Zero name-as-held-when-only-an-ID violations. Zero §2.1
string-table repeats.
