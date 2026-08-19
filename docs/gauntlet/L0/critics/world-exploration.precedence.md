# LENS 3 — PRECEDENCE CRITIC · unit `world-exploration`

**Bottom line: this journal is essentially clean on the precedence axis.** It imports
**zero** statements from a superseded measurement doc. Every one of the 23 claims cites
either decompiled AS3 (A2), a raw payload blob (A2), a byte-check I re-ran (A3), a video
frame (A1), or an honest STILL_UNHELD. There is no repeat of the two burns this repo has
taken (COMBAT_MEASUREMENTS §S24 raw rows; REBUILD_READINESS §3's unsourced "hold-run").
There is also no case of citing a doc where a frame would settle it — the one place a
frame *does* settle it (the 6×6 sector grid, the territory name), the surveyor opened the
frame.

**0 claims refuted. 3 material corrections, 5 minor. 9 new findings, one of which
overturns the ledger further than the surveyor did.**

I re-derived, from scratch, every load-bearing number below. Nothing in this file is
taken from the surveyor's word.

---

## What I re-ran myself (own cites)

| check | command / artifact | result |
|---|---|---|
| land mask parity | `md5` + `cmp` web `bindata/92_1t4648s0.bin` vs `android/110_Mobile_MapBitmapData.bin` | both `13068dfa1a5cc5628720a25782f93fed`, **BYTE-IDENTICAL**, 272 bytes, `GIF89a 63x72` |
| land count | PIL decode of the GIF | exactly two colours `{(0,0,0):3801, (255,255,255):735}`; **735 land**; bbox i∈[1,61], j∈[1,70] |
| level gradient | recomputed `|tx−341|+|ty−341|+3` over all 735 land cells | **min 3, max 93**; L3×1 L4×2 L5×4 L6×5 L7×7 L8×8 L9×10 L10×9 L11×10 L12×14 — *identical to the surveyor's table* |
| node file | Python parse of `android/112_Mobile_NodeData.bin` | **44 nodes, 98 rooms, 94 `<width>`, min 800 max 4000**, modes 800×22 / 1000×21 / 1400×7 / 1600×7, 30 distinct `<bg>`, **343 objects, id 0 = 186**, exactly **one** `<search>` block (`chance 5`) |
| web-build negative | `grep -cE "getNodeLevel|APINTERVAL|TERRSHIFTX|getOreType" reference/extracted/payload.xml` (329 MB) | **0** — the surveyor's negative is true |
| web-build positive | `payload.xml:118249-118266` | `roomdata`, `procgenronin`, `aggrobandits`, `merccaptain`, `<obj><id>N</id><x>` templates — all present in v0.717 |
| decompile inventory | `find reference/decompiled -iname "NodeGenerator*"` | only `shs3_android/` and `shs3_android_payload/` (which `diff -rq` proves **identical**); `shs3_payload/scripts` is 652 files of `ColorPicker_*`, `torso4000.as`, `hair6000.as` — display symbols only |
| config | `ls src/config/` | 27 entries, exactly the surveyor's list; **no** `world.ts`/`ap.ts`/`farming.ts`/`nodes.ts` |
| name RNG | re-implemented `randomSeed=(s*9301+49297)%233280` and `getTownName2(id) = new RNG(id*2)` | territory **1409366 → "Kakuchi"**, territory **1397077 → "Kasuta"** — independent reproduction, exact |
| resource blobs | `head -c 3` on all five | `CWS` × 5 — S0-5 holds, audio/art stay encrypted |
| `119_Mobile_MapData.bin` | `cat`, 65 bytes | `<?xml…?>\n<mapdata>\n\n</mapdata>` — genuinely an empty stub |
| `searchList` consumers | `grep -rn searchList` across all 559 classes | only `XMLWorldNode.as:30` (decl) and `:96` (assign). **No consumer.** The STILL_UNHELD is correct |

**Frames I opened** (512×288 source, so a 3× / 8× / 10× Lanczos upscale is required to read
the HUD at all):

- `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg` — full-frame ×3, and minimap
  crop `(393,38)-(502,138)` ×10. Reads verbatim: banner **"W KAKUCHI MOUNTAIN PATH"**,
  HUD **"TERRITORY (24,52)"** / **"SECTOR (1,3)"**, level badge **8**, signpost
  **"KAKUCHI MOUNTAIN PATH (E)"**, minimap = 6 columns labelled 0–5 and 6 rows labelled
  0–5 with N/E/S/W edge letters.
- `frame_0040.jpg` ×3 — **"CASTLE INNER WALLS"**, "TERRITORY (24,52)" / **"INSIDE SECTOR (3,0)"**,
  compass-dial minimap with *no* grid numbers.
- `frame_0080.jpg` ×3 — **"KAKUCHI DOJO GATES"**, "TERRITORY (24,52)" / **"SECTOR (3,2)"**, no
  directional prefix.

---

## The single best result in this journal, independently reproduced

The surveyor claims the world's place names regenerate from the node id. I did not take
this on trust; I re-implemented the LCG and the two name tables and ran it cold.

```
RNG(seed): s = |seed|; s = (s*9301 + 49297) % 233280        # RNG.as:64-66 (constructor calls rnd() once)
rand(n)  : floor(rnd() * n)                                  # RNG.as:73-75
getTownName2(tid) = namestarting[RNG(tid*2).rand(78)] + nameending[.rand(37)]   # NameGenerator.as:163-166

territory 1409366  ->  namestarting[74]="Ka" + nameending[19]="kuchi"  =  "Kakuchi"
territory 1397077  ->  namestarting[75]="Ka" + nameending[0] ="suta"   =  "Kasuta"
```

Cross-checked against `getNodeName` (`NodeGenerator.as:1637`) and the string table:
`terrSector.x ≤ 1 → LangManager.getString(401)`, and `strings.json["401"] == "W"`;
`BG_MOUNTAIN/BG_MOUNTAINPATH → getString(1015)`, and `strings.json["1015"] == "Mountain Path"`.
Assembled: **`"W" + " " + "Kakuchi" + " " + "Mountain Path"`** → the frame's banner, character
for character. `frame_0080` (sector 3,2 → both dirs empty) correctly emits no prefix.
**Frame and payload agree; there is nothing to adjudicate.** This claim is as strong as
evidence gets in this repo.

---

## Verdicts

### Material corrections (claim stands, appended reasoning is wrong)

**① `ap-regen-and-cap` — the "AP==0 is a death/retreat condition" line is a mis-read.**
`MCSPlayer.as:1230` reads:
```as3
case IDLE_STATE:
   if(!GameEngine.isAdventureMode() && !StageManager.isRedFreeze() && getHP() <= maxhp / 4
      || GameEngine.isAdventureMode() && this.controlledBy == 0 && StatsManager.getStat(StatsManager.STAT_AP) == 0)
   {
      startAnim(TIRED);
   }
```
`startAnim(TIRED)` inside `case IDLE_STATE:` is an **idle-animation swap**, not death and
not retreat. `TIRED` appears exactly twice in the whole class (`:1232` here, `:4319` in a
sheathed-state test). Shipping this as a "death condition" would put a fabricated rule into
L1. The *real* finding is better than the claimed one and belongs to L6/L2: the fighter
visibly switches to a TIRED idle at **AP 0 in adventure mode** *or* **HP ≤ 25 % in combat**.

**② `farming-tables` — the 12-hour crop never rots.**
`Obj_VegePatch.as:133-140` and `InteractUI_crops.as:158-161`: crop types 1/2/3 each have a
three-way `PLANTED → READYFORHARVEST → ROTTED` ladder gated on `timePeriod + gracePeriod`.
Type 4 (`timePeriod = 12*60*60`) has **only two branches** — past `timePeriod` it is
`READYFORHARVEST` forever. "15-minute harvest grace before ROT" is true for 900/3600/21600 s
and **false** for 43200 s.

**③ `day-length-is-three-clocks` — there are at least FIVE clocks, and the two missing ones
overturn the ledger harder than the claim does.** `StatsManager.as:158-162`:
```as3
internal static var APINTERVAL:int = 60;
internal static var DTINTERVAL:int = 2 * 60;
internal static var WARMOVEINTERVAL:int = 60 * 60;
```
`WARMOVEINTERVAL = 3600 s`, consumed at `StatsManager.as:818-820`
(`nextWarTurn = QueryManager.instance.getServerTime() + WARMOVEINTERVAL`). **The war tick is
hourly.** REBUILD_READINESS.md §1 line 116 — "The real-world *day* length governing quest
expiry, farming, AP regen, and the **War-Room 24h tick**" — is not merely mis-framed, its
one concrete number is *wrong by 24×*. The surveyor left that on the table. `DTINTERVAL = 120 s`
(duel-token regen, `:1130-1148`) is a fifth clock also unmentioned.

### Minor corrections

**④ `frame-confirms-6x6-grid` — the gold X is at column 3, not "~(2,2)".** From my own ×10
crop of `frame_0020.jpg` at `(393,38)-(502,138)`, column label centres land at
x ≈ 195/320/450/570/690/815 and row centres at y ≈ 190/310/432/557/675/800 (crop pixels).
The gold X sits at ≈ (565,437) → **column 3, row 2**. The gold up-arrow (3,0), the gates at
(5,0) and (0,5), and the player triangle at row 3 / column 1 (matching the HUD's SECTOR (1,3))
all check out. There is also a **sixth gold icon — an arch, visually distinct from the Π gate —
at (5,5)**, which the claim's quote omits. The frame wins; the quote should be amended.

**⑤ `start-coords-derived` — "'21,51' is not an observed coordinate pair" is false.**
The derivation is right and I verified it (`8382465 >> 12 & 0xFFF = 2046`, `& 0xFFF = 2049`
→ territory `(341,341)`, sector `(0,3)`; `Territorymap.as:113` prints
`territory.x − 341 + DTERRSHIFTX` with `DTERRSHIFTX = TERRSHIFTX = 21`). But the pair *is*
displayed on the HUD — my own `frame_0020.jpg` prints "TERRITORY (24,52)" in that exact slot,
and `docs/research/video-study/segments/A-00-boot-login.md:61` records observing
**"TERRITORY (21,51)"** at guest start. It is *both* observed and derivable. Say that instead.

**⑥ `save-schema-recovered` — three timer slots, not four.** Every `saveUpdate(` in
`QueryManagerPIO.as` (23 calls, lines 1047–1187): data slots 0–12, 14–19, 103 = **20**;
timers **100, 101, 102 = 3**. Total **23**, not the "24-slot save schema" in the score
rationale.

**⑦ `ap-cost-table` — the signpost free-travel condition drops a conjunct.**
`Obj_DirectionSign.as:106` requires `StageManager.getCurrentRoom() != 0` *and*
`((isTown && !isAbandonedTown && (roomid < 14 || roomid >= 100)) || isDojo)`. The paraphrase
omits the `room != 0` guard.

**⑧ `prosperity-thresholds` — "specific territories pinned" understates it.**
`NodeGenerator.as:398-400`: `isNoChangeTown` returns true for the four listed ids **or** for
any territory with `getTerritoryLevel(id) < LEVELSTART + 5` (= 8). The entire level-3..7
starting ring is frozen too, its town level drawn from `new RNG(territoryID).rand(7)`.

**⑨ `is-a-wxh-grid` — defensible, but the ledger sentence isn't quite "wrong".**
The mask *is* a 63×72 raster and the 10 px/cell projection is real (`WorldMapUI.as:230`,
verified). But §1's phrasing was "not a grid you can **generate** from W×H" — and you still
cannot: you need the 272-byte GIF. The honest version, which the claim's own lane_impact
already concedes, is *"the projection and topology are recovered; the geography is data, not
a generator."* Grade PARTIAL rather than an outright ledger refutation.

### Model answer

`cross-build-numeric-parity` is exactly how a STILL_UNHELD should read. I verified both
halves myself — the 329 MB `payload.xml` yields **0** hits for
`getNodeLevel|APINTERVAL|TERRSHIFTX|getOreType`, and `shs3_payload/scripts` really is only
display symbols — *and* the positive half, `payload.xml:118249-118266`, really does carry
`roomdata` / `procgenronin` / `aggrobandits` / `merccaptain`. Correct scope, correct label,
no overreach. Same for `map-art-unheld`, `mapdata-blob-empty` and `search-chance-semantics`.

---

## New findings (not in the surveyor's output)

| id | finding | class | cite |
|---|---|---|---|
| `wx/war-tick-is-hourly` | War tick = **3600 s**, not 24 h. Overturns §1 line 116. | A2 | `StatsManager.as:162, :818-820` |
| `wx/duel-token-clock` | `DTINTERVAL = 120 s` — a fifth independent real-time clock. | A2 | `StatsManager.as:160, :1130-1148` |
| `wx/12h-crop-never-rots` | Crop type 4 has no ROTTED branch. | A2 | `Obj_VegePatch.as:133-140` |
| `wx/tired-idle-not-death` | AP 0 (adventure) / HP ≤ 25 % (combat) → `startAnim(TIRED)` idle swap. | A2 | `MCSPlayer.as:1230-1232` |
| `wx/ap-ceiling-plus-gear` | Effective AP ceiling = base MAXAP **+ `findBonusStat(STAT_MAXAP)`**; level+30 is only the stat-spend cap. | A2 | `StatsManager.as:1031-1035` |
| `wx/save-slot-count-23` | 20 data + 3 timer = 23 slots. | A2 | `QueryManagerPIO.as:1047-1187` |
| `wx/minimap-x-at-3-2` | Gold X at column 3 row 2; extra gold arch icon at (5,5). | A1 | `frame_0020.jpg`, crop (393,38)-(502,138) ×10 |
| `wx/compass-prefix-is-two-axis` | Prefix = `dir1+dir2`: y ≤ 1 → 398 "N", y ≥ 4 → 399 "S"; x ≤ 1 → 401 "W", x ≥ 4 → 400 "E". Corner sectors emit **"NW"/"SE"** etc. Only the single-axis "W" case was reported. | A2 + A1 | `NodeGenerator.as:1643-1660`; `strings.json` 398-401; `frame_0020.jpg` |
| `wx/start-town-is-kasuta` | Start territory 1397077 → "Kasuta"; boot banner "W KASUTA FOREST" (x=0 → "W"; BG_FOREST → string 1003 "Forest"). Second independent reproduction of the name generator. | A2 | reproduced from `NameGenerator.as:40,42,163-166` + `RNG.as:64-66` |
| `wx/dead-exit-branch` | `getNorthExits`: `rng.rand(3)` ∈ {0,1,2} but the code tests `dice == 3` to set `count = 2` — **exit count is always 1**. A latent OG bug; decide explicitly whether to preserve it. | A2 | `TerritoryData.as:86-99` + `RNG.as:73-75` |
| `wx/nochange-ring` | `isNoChangeTown` also freezes every territory of level < 8. | A2 | `NodeGenerator.as:392-400` |

---

## Score

The surveyor's **85** is defensible and I would not move it more than a point or two.
Every blocker really is closed with code-level artifacts, the four negatives are honestly
scoped, and the one claim that could have been a precedence trap (Android v0.682 vs web
v0.717) is carried as an explicit STILL_UNHELD with the negative *and* the positive both
verified. Deduct nothing for precedence. Fix the three material items above before this
journal feeds `src/config/` — ①, ② and ③ would each plant a wrong number or a wrong rule.
