# CRITIC — world-exploration — LENS 2 (HUNTER)

Blind review. I did not see the surveyor's reasoning. Every verdict below cites an
artifact **I** opened. Two claims are REFUTED, both of them honest-negative
under-claims — which is exactly what this lens exists to catch.

---

## HEADLINE: two "we don't have it" answers are wrong

### H1 — `map-art-unheld` is REFUTED. The drawn world map is HELD, and it is Japan.

The claim says the rendered world-map art "lives in an encrypted nested-SWF resource
blob" (`124_Mobile_ImageResource.bin`). That is the **Android** story. On the **web
v0.717** side the art is already extracted and sitting in this repo.

`reference/extracted/payload.xml` line 395760 onward, inside
`<item type="DefineSpriteTag" ... spriteId="262">`:

```
<item type="PlaceObject3Tag" characterId="189" ... name="shadowmap" ...
<item type="PlaceObject2Tag" characterId="227" depth="39" ... name="map_1_6" ...
  <matrix ... translateX="1598" translateY="9600"/>
```

36 tiles, `map_0_7` … `map_8_1`, characterIds 191–261, each placed at
`translateX = i*80*20` twips, `translateY = j*80*20` twips. Every one of the 36 is
**already exported** as `reference/extracted/sprites/DefineSprite_<id>/1.png`
(tile sizes 4×5 to 80×80 px).

I composited all 36 at their own twip translations:
`/private/tmp/.../scratchpad/worldmap_assembled.png` — it renders as the Japanese
archipelago: Hokkaido, Honshu, Shikoku, Kyushu, Sado, Awaji, the Inland Sea.

Then I overlaid the 735-cell land mask at the projection the journal itself derives
(mask cell `(i,j)` → map px `(10i+80, 10j)`, from `WorldMapUI.as:208/230`):
**652 of 735 land cells land on drawn land, 83 on sea = 88.7 % cell-centre
agreement**, and visually the red overlay traces the coastline exactly. The 83 are
coastline cells sampled at cell centre on a 10 px grid plus my own tile-assembly
seams.

So this is a **double win**: the map art is recovered, *and* the mask→screen
projection in `is-a-wxh-grid` now has an independent visual proof rather than two
lines of code.

What survives of the original claim: the *Android* `124_Mobile_ImageResource.bin` is
still encrypted and unopened, and the mask GIF is indeed 1-bit. Neither of those
makes the art unheld.

### H2 — `cross-build-numeric-parity` is REFUTED, and its stated reason is false.

The claim's reason reads: *"there is no web-side decompile of NodeGenerator/
StatsManager — `reference/decompiled/shs3_payload/scripts/` holds only display
symbols."*

`shs3_payload` is the **full web v0.717 decompile**, complete game logic, under
obfuscated class names (`§1tNNNsN§.as`). Proof of build:

```
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36
      public static var §1t9323s0§:Number = 0.717;
```
(vs `reference/decompiled/shs3_android/scripts/StatsManager.as:30  clientVersion:Number = 0.682`)

Grepping for symbol names fails; grepping for **constants** works. Web ≡ Android,
verified line by line by me:

| constant | web v0.717 | android v0.682 |
|---|---|---|
| `APINTERVAL` = 60 | `§1t1523s0§.as:192` | `StatsManager.as:158` |
| `DTINTERVAL` = 2*60 | `§1t1523s0§.as:194` | `StatsManager.as:160` |
| `WARMOVEINTERVAL` = 60*60 | `§1t1523s0§.as:196` | `StatsManager.as:162` |
| start AP 30 / MAXAP 30 | `§1t1523s0§.as:1025,1026` | `StatsManager.as:707,708` |
| `STAT_LOCATION` 8382465 | `§1t1523s0§.as:1031` | `StatsManager.as:713` |
| quest re-eligibility `24*60*60` | `§1t1523s0§.as:1549` | `StatsManager.as:1184` |
| level `abs(x-341)+abs(y-341)+LEVELSTART`, cap 200 | `§1t70s0§.as:399-404` | `NodeGenerator.as:385-390` |
| `LEVELSTART` = 3 | `§1t70s0§.as:146` | `NodeGenerator.as:144` |
| second cap variant = 100 | `§1t70s0§.as:491-496` | `NodeGenerator.as:477-482` |
| `territory = floor(sector/6)` | `§1t70s0§.as:314,315` | `NodeGenerator.as:300,301` |
| TERRSHIFTX 21 / TERRSHIFTY 51 / WARMARKERSHIFTX 8 | `§1t6481s0§.as:17,19,21` | `WorldMapUI.as:15,17,19` |
| projection `*10+5` / `*10+8.5` | `§1t6481s0§.as:285,286` | `WorldMapUI.as:230,231` |
| LCG `(s*9301+49297)%233280` | `§1t58s0§.as` (rnd) | `RNG.as:64-66` |
| crop timers 15*60 / 60*60 / 6*60*60 / 12*60*60 + 15*60 grace | `§1t8621s0§.as:82,93,108,123,138` | `Obj_VegePatch.as:80,93,108,123,138` |
| name tables | `§1t136s0§.as:40,42` | `NameGenerator.as:39,41` |

The two name arrays are **element-for-element identical** across builds
(78 `namestarting`, 37 `nameending`; diffed in Python, both `IDENTICAL`).

Only real web/android divergence I found in this lane: `XMLWorldNode` stores the
search block as `XMLList(param1.search).copy()` on web (`§1t72s0§.as:98`) vs
`xml.search` on android (`XMLWorldNode.as:96`). Cosmetic.

**Consequence for the lane:** the "label every ported number Android v0.682" caveat
should be dropped for every constant in the table above. The correct standing rule
is now: *check `shs3_payload` by constant, not by name, before declaring a parity
gap.* This also affects every other L0 unit that inherited the Stage-0b caveat.

---

## Verified HELD (I opened the artifact myself)

**Land mask.** `md5 reference/extracted/bindata/92_1t4648s0.bin` =
`md5 reference/extracted/android/110_Mobile_MapBitmapData.bin` =
`13068dfa1a5cc5628720a25782f93fed`; `cmp` clean; both `GIF image data, version 89a,
63 x 72`, 272 bytes. Decoded with PIL: exactly two colours
`{(0,0,0): 3801, (255,255,255): 735}`, bbox i∈[1,61] j∈[1,70]. 735 confirmed
first-hand. `QuestEngine.as:1206` quoted verbatim — exact.

**Level gradient.** Formula + `LEVELSTART=3` verbatim. I recomputed the histogram
over the mask: **min 3, max 93**; L3×1 L4×2 L5×4 L6×5 L7×7 L8×8 L9×10 L10×9 L11×10
L12×14 — every figure in the journal reproduced exactly.

**Coordinate law / start coords.** `NodeGenerator.getTerritory / getTerritoryId /
getTerritorySector / getSector` read verbatim. `StatsManager.as:713
setPlayerStats(STAT_LOCATION,8382465)` verbatim. Decoded by hand: 8382465 → sector
(2046,2049) → territory (341,341) → display TERRITORY (21,51) = (TERRSHIFTX,
TERRSHIFTY), SECTOR (0,3). Correct.

**Frames.** Source frames are **512×288**, not 1080p — the surveyor's crop boxes and
×8 factor are consistent with that, so no §0 violation.
- `frame_0020.jpg` crop (355,110)-(512,180) ×7 Lanczos: **"TERRITORY (24,52)" /
  "SECTOR (1,3)"** legible. crop (0,0)-(300,80) ×5: **"W KAKUCHI MOUNTAIN PATH"**.
  crop (395,38)-(505,148) ×9: 6-column × 6-row minimap, axis labels 0–5 both ways,
  N/E/S/W glyphs, dashed route, white player triangle at col 1 / row 3.
- `frame_0040.jpg`: **"INSIDE SECTOR (3,0)"**.
- `frame_0080.jpg`: **"KAKUCHI DOJO GATES" / "SECTOR (3,2)"**, no compass prefix.

Frame and payload agree; no frame-vs-doc conflict to adjudicate in this unit.

**Place-name regeneration.** I re-ran it independently in Python from
`NameGenerator.as:145-166` + `RNG.as:11-18,64-66`:
`(24,52) → (344,342) → tid 1409366 → namex 70 ≥ 26 → getTownName2 → RNG(2818732) →
rand(78)=74, rand(37)=19 → "Ka"+"kuchi" = **Kakuchi**`. Character-for-character
match with the frame. Start territory 1397077 → **Kasuta**. Compass prefix confirmed
from `getNodeCompassDir` (`NodeGenerator.as:485-511`) + `strings.json`: 398=N,
399=S, 400=E, 401=W; sector x=1 ≤1 → "W ", sector (3,2) → "". Both frames match.

**AP.** `APINTERVAL=60`; regen block `StatsManager.as:1097-1110` (`diff =
floor(timeDiff/APINTERVAL)+1`, `×2` under `BUFF_AP`); start 30/30; cap gate
`InventoryUI.as:2409  < 20 + (charlevel + 10)`. `strings.json` id 100 =
`"You are out of AP.\nWould you like to get 10 more AP for 1 Gold?"` — the 10-AP /
1-Gold faucet is real.

**AP cost table.** Read `NodeUI.as:352-495`: ACTION_ENTER `checkAP(1)`, ACTION_TRAVEL
`checkAP(5)`, ACTION_REST `checkAP(1)` + `increaseHP(100)/increaseChi(100)`,
ACTION_CAMP `checkAP(5)` + `increaseHP(50)/increaseChi(50)`, HUNT 3, FISH 3, :535 = 2,
:619 = `data.ap`. Stable fare `InteractUI.as:1723` quoted verbatim, `:1736
checkAP(5)`, `:1743 changeGold(-cost)`. Note `changeGold` is the **coin** stat
(`STAT_GOLD`=100 at creation; `STAT_HGOLD` is the premium "GOLD" shown in-frame) —
the journal calls it coins, correctly. `Obj_DirectionSign.as:20 apuse=1` and the
`:106-108` town/dojo zero-cost exception both verbatim.

**Gather / mine / search.** `NodeUI.as:426-490` hunt+fish verbatim: `dice =
Math.random() * 10` into an `int`; 3/4/5 → 2112, 1/2 → 2113, 0 → 2114, else 6-9 →
whiff = 40 %. `Obj_Bush.as:47  int(Math.random()*10) <= getStat(1021)` — 10 % at
skill 0, +10 pp/point. `Obj_OreDeposit.as:70` quoted verbatim, and the skill gates
`8≥5, 7≥4, 6≥3, 5≥2, 3≥1` at `:58` verbatim. Ore names 652–659 in `strings.json`
match the ladder exactly.

**Farming.** `Obj_VegePatch.as:80-140` and the ambush
(`InteractUI_crops.as:596  wave.init(new XMLList(<enemy><id>64</id><qty>1</qty><x>400</x></enemy>))`,
`:605 GameEngine.initBattleMode(-1,8,43,800,0,wavelist,150)`) verbatim.

**Node/room data.** My own counts on `112_Mobile_NodeData.bin`: `<node>` 44,
`<room>` 98, `<width>` 94, `<obj>` 343 — identical to the journal. The quoted
`roomdata` block is lines 8-17 verbatim; the signpost property
`0,50,8386561,1,2,2,1` is at line 16.

**Room-object enum.** `awk` over `GameStage.as:683-925` → **73** `case N:` labels,
last five 68–72. Confirmed.

**Procedural world.** `QuestEngine.as:1123` verbatim.

**Prosperity.** `TerritoryData.getTownLevel` (0 / <500 / <1000 / <2000 / <4000 / else)
verbatim; `NodeGenerator.getNoChangeTownLevel` :407-421 pins exactly the 12 territory
ids listed, to exactly the levels listed.

**Save schema.** All 23 `saveUpdate(...)` call sites read; slot 10 =
`StatsManager.getLocationString()` at `QueryManagerPIO.as:1114`. Slot list matches.

**Config empty.** `ls src/config/` reproduces the journal's list character for
character; no `world.ts` / `ap.ts` / `farming.ts` / `nodes.ts`.

---

## Honest STILL_UNHELDs I could NOT break (correct answers — do not penalise)

**`search-chance-semantics`** — I hunted it in the *other* build too. Web
`§1t72s0§.as:32` declares `searchList`, `:98` assigns it, and `grep -rn searchList
reference/decompiled/shs3_payload/` returns **only those two lines**. Dead field in
**both** builds, 559 android + 652 web class files. The STILL_UNHELD is now stronger
than the surveyor stated it.

**`mapdata-blob-empty`** — I confirmed the stub (65 bytes,
`<mapdata>\r\n\r\n</mapdata>`). Could not explain it, but two leads worth logging:
(a) the web `bindata/` set contains **no mapdata blob at all** — its 27 files are
19 `<animdata>`, `<survivalmodedata>`, the map GIF, the room-object defs and 5 name
tables; (b) of the five data filenames only `traproomdata.xml` appears as a literal
in the web scripts. Consistent with mapdata being a server-fed / vestigial file.
Still a lead, not a finding.

---

## Corrections (real, but minor — none of these flip a verdict)

1. **`place-name-reproduced`** cites `namestarting[73]="Ka"`. The index is **74**;
   `namestarting[73]` is `"Iwa"`. `nameending[19]="kuchi"` is right. The generated
   name is right; only the index is off by one.
2. **`frame-confirms-6x6-grid`** places the gold X at "~(2,2)". Measured against the
   axis labels in a ×9 crop, the X is at **(3,2)** — which is exactly the sector the
   player is standing in at `frame_0080` (`SECTOR (3,2)`, "KAKUCHI DOJO GATES",
   quest line "SIDE QUEST: DEFEAT HATTORI"). The X is the quest-target marker, and
   the corrected reading turns two frames into a matched pair. The crop also shows a
   sixth icon at (5,5) that the quote omits.
3. **`farming-tables`** says all four crops get a 15-minute grace "before ROT".
   `Obj_VegePatch.as:133-140`, case 4 (the 12 h crop), has **no grace and no ROTTED
   branch** — it falls straight to `READYFORHARVEST` and never rots. True for cases
   1-3 only.
4. **`save-schema-recovered`** says "20 numbered data slots plus four timer slots"
   / "24-slot". There are **23** `saveUpdate` call sites: 20 data (0-12, 14-19, 103)
   and **3** timers (100 nextAPUpdate, 101 nextDTUpdate, 102 nextWarTurn). The 24th
   `saveUpdate` hit in the tree is the function *definition* at
   `NetworkManager.as:1870`.
5. **`ap-regen-and-cap`** — `20 + (charlevel + 10)` at `InventoryUI.as:2409` is the
   visibility gate on the stat-panel "+" button, i.e. a spend cap, not a runtime
   clamp. The journal's own wording ("cap gate") is honest; the claim sentence
   ("max-AP is capped at character level + 30") is a shade stronger than the code.

## Score note

The rationale holds back 90+ on four negatives. Two of them are now dead (map art,
cross-build parity). On my evidence this unit is **90-92**, not 85.
