# t1-overturns-05 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-05.json` — **24 claims, 24 judged, 0 skipped.**
Every verdict below rests on an artifact I opened myself in this run. Line numbers were
re-derived with `awk 'NR>=a && NR<=b {printf "%d: %s\n",NR,$0}'`, never trusted from the packet.

Result: **23 survive · 1 refuted (mis-cited A1).** Six survivors carry corrections.

---

## REFUTED

### 4. `ledger/film-shows-rebirth-is-unsourced` — REFUTED (mis-cited A1)

Cite: `reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0025.jpg` and
`reference/frames/zFtCaTO0_1M/seg-20/frames/frame_0019.jpg` — "top-22% HUD strips".

**I opened both.**

* `zFtCaTO0_1M/seg-20/frames/frame_0019.jpg` (1024x576, 2x LANCZOS, whole frame) — **holds**:
  level badge **5** beside **`8093 / 8350 EXPERIENCE POINTS`**, and
  **`REGISTER / TO SAVE YOUR PROGRESS AND PLAY ONLINE!`**. `259 COINS` top-left.
* `Nr4fQstqHDM/seg-05/frames/frame_0025.jpg` (1024x576) — **does not hold.** The frame is a
  **"YOU WIN" splash**: solid crimson field, blood-splatter wordmark, two silhouetted
  fighters on a grass horizon. Its top 22% is a flat red band with **no HUD at all**.
  There is no level badge, no `20880 / 20900 EXPERIENCE POINTS`, no COINS/GOLD readout,
  no `GET GOLD` button and no Dan field anywhere in the file.

The quote's remaining items are also absent from either cited frame: `507 / 259 COINS`,
`2 GOLD`, `GET GOLD`, `EMPTY Dan field`.

So the load-bearing half of an **A1** claim describes content that is not in the artifact it
names. Under §0 that is MIS-CITED, and I refute it.

**What is nevertheless true** (carried forward as NF-1/NF-2, on my own cites):
`REBUILD_READINESS.md:165` really does say *"film shows a **flat +25 gold** every rebirth, no
10th-rebirth tier"*, and `REBUILD_READINESS.md:205` really does say
*"⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)"*. The ledger **does**
contradict itself; the "+25 from film" provenance **is** fictitious. The overturn stands — but
on the ledger's own text, not on these frames.
The COINS-vs-GOLD half is also true and is photographed — just not where the claim said:
`reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0027.jpg` shows
`480 COINS` · `2 GOLD` · `GET GOLD` · level badge **7** · `14901 / 16350 EXPERIENCE POINTS`.

---

## SURVIVES WITH CORRECTIONS

### 0. `items-equipment/repair-weapon-cost-held` — HELD, one inverted term

`reference/decompiled/shs3_android/scripts/InteractUI.as` — every line lands to the digit:
`:1057 case "repairweapon":` · `:1058 cost = StageManager.getCurrentNodeLevel() * 10;` ·
`:1065-1071` the `weapon == null || itemID == 0 || itemID == 13000` refusal ·
`:1072 StatsManager.changeGold(-cost);` · `:1073-1076 if(weapon.uses > 1) { weapon.uses = 1; }` ·
`:1082 case "reinforceweapon":` · `:1083 cost = 5000;`.

The one-way door is real: `Item.as:718 if(this.uses == 0) → getString(639)` and
`:722 else if(this.uses == 1) → getString(392)`, with
`strings.json["639"] = "Unbreakable"`, `strings.json["392"] = "Condition: Well-Maintained"`.
Repair clamps 1, never 0 — a repaired weapon can never read Unbreakable again. ✅

**I also closed the build-parity hole the packet left open.** The claim cites Android v0.682
only. The WEB v0.717 twin is `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1057-1085`
— same dispatch slot, `:1058 cost = §1t1525s0§.§1t9936s0§() * 10;`, the same
`weapon == null || §1t483s0§() == 0 || §1t483s0§() == 13000` guard at `:1068`,
`:1077-1080 if(weapon.uses > 1) { weapon.uses = 1; }`, `:1081 §1t1684s0§(60005,1)`
(= `reportAchievementStat(60005,1)`), and reinforce at `:1086-1087 cost = 5000`. Identical
numbers. No Android caveat is needed.

**CORRECTION (material).** The lane_impact says the cost is *"a gold currency (not coins)"*.
That is inverted. `StatsManager.getGold()` at `:2627-2629` returns `getPlayerStats(STAT_GOLD)`
and `STAT_GOLD:int = 11` at `:192`; `changeGold` at `:2658-2664` clamps against
`getMaxCoins()` into a local literally named `newCoins`, and `:2651-2654` is
`isCoinPurseFull()`. Stat 11 is the **coin purse**. Character creation sets stat 11 = 100 and
stat 12 = 3 (`§1t1523s0§.as:1023-1024`), which is the ledger's own "100c/3g guest start"
(`REBUILD_READINESS.md:79-80`) — so **stat 11 renders as on-screen COINS**, stat 12 (HGOLD) as
on-screen GOLD. Repair costs `nodeLevel × 10` **COINS**, not premium Gold. Encode it as coins.

Overturn of `REBUILD_READINESS.md:215 "③ Repair-Weapon cost (never captured)"` — **upheld.**

### 12. `meta-social/premium-catalogue-is-143-skus` — HELD, two numbers wrong

Reproduced from `reference/extracted/android/121_Mobile_PremiumData.bin` joined to
`reference/extracted/itemdata.xml <heavenlyprice>` and `docs/gauntlet/L0/index/strings.json`:

* **176 `<item>` rows, 143 unique ids, 0 unresolved against the WEB itemdata.xml** ✅ exact.
* 1 Gold = 20 SKUs — the 12 Hair ids (6023-6026, 6035-6037, 6039-6043) ✅ exactly 12,
  plus 2208 `1000 coins`, 2213 `Clan Invitation`, 2215 `Edit Clan` ✅ and 5 consumables.
* 3 Gold = 94 SKUs; every named range lands to the digit: armor **4063-4099**, gloves
  **5008-5020**, headgear **7034-7082**, masks **9025-9049**, pants **11035-11056**, shoes
  **12018-12041**, weapons **13014-13043** ✅.
* 5 Gold = exactly the four named: 2200 `Amnesia Scroll`, 2203 `Writ of Release`,
  2207 `Name Change Scroll`, 2212 `Clan Deed` ✅.

**CORRECTION 1 (material).** The ladder is **1 / 2 / 3 / 5 / 12**, not "1/3/5/12". A **2-Gold
tier exists** and the claim drops it: 2101 `Medium Soldier Pill` and 2126 `25 Duel Tokens`.
**CORRECTION 2 (material).** The 12-Gold tier holds **23** outfit bundles, not "30". Endpoints
2130 `Assassin Outfit` and 2171 `Swords of the Mist` are right; the count is not.
(Also: 3 Gold includes two block-2 rows the description omits — 2102 and 2127.)

Core survives: 143 SKUs, all web-resolvable, vs the lane's 12 rows. Overturn upheld.

### 16. `meta-social/warroom-board-is-on-screen` — HELD, two readouts over-read

`reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0018.jpg` (1024x576, 3x LANCZOS) is **exact**:
`SELECT HQ/TOWN TO ENTER TERRITORY` · `3 MOVE(S) LEFT` · `RYUWARA MESSAGE BOARD` ·
`SEND TO SIDE` / `SEND TO ALL` · `ASUTORARU: BUILDING BARRICADES AT SECTOR (4,3) (2 HOURS AGO)`
· the terrain board with black sector boundaries, green clan shading + green banner flags, red
enemy shading, two fist medallions with directional arrows, a barricade icon.
`frame_0019.jpg` is the same board headed `SELECT A SECTOR` with `2 MOVE(S) LEFT`.
`reference/frames/zFtCaTO0_1M/map/frames/frame_0024.jpg` crop (398,40)-(502,160) x10 is **exact**:
`0 1 2 3 4 5` across the top **and** down the left, `N`/`W`/`E`/`S` on the four edges, wall/exit
segments, gate glyphs, `!` and `X` markers, player arrow at column 2 row 4, and
`TERRITORY (22,51)` / `SECTOR (2,4)` beneath.

**CORRECTION (minor).** In `frame_0019` the capture timer reads **`16:44:07`**, not "16:44:05",
and the turn timer reads **`NEXT TURN IN 1:00:00`**, not "59:58". (`frame_0018` reads
`16:44:10`, so those two values belong to a frame ~2-3 s later, not the one cited.) The
source frames are **1024x576**, not the "512x288" the cite states. The lane_impact's
"24h capture advance" is an inference — the frame shows a 16h44m countdown, nothing 24-hour.

### 22. `meta-social/web-rebirth-grants-25-and-100-gold` — HELD, lane_impact wrong

The code claim is exact (see §21 below) and the 5× ratio is confirmed:
`shs3_android/scripts/StatsManager.as:2203 changeStat(STAT_HGOLD,20);` and
`:2207 changeStat(STAT_HGOLD,5);` — Android 5/20, web 25/100.

**CORRECTION (material).** lane_impact says *"the Android >60-Gold reportHack ceiling has no web
equivalent."* It has one. Android `OverworldHUD.as:1333`
`if(StatsManager.getStat(StatsManager.STAT_HGOLD) > 60 && StatsManager.getStat(StatsManager.STAT_DAN) < 9) { reportHack("gold"); }`
is structurally the same routine as web `§1t406s0§.as:1544`
`if(§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9413s0§) > 300 && …§1t9426s0§) < 9)`, sitting right
after the same level-cap check. The web ceiling is the **same guard scaled 5×**, plus an extra
`:1549 > 3 && DAN < 1` arm because the web build starts a character at 3 HGOLD (`:1024`).

### 23. `meta-social/web-survival-table-differs-in-composition` — HELD, diff size wrong

Both files parsed by me: **39 `<wave>`, `sum<qty> = 351`, blocks `{400: 340, 700: 11}`** —
identical in web `reference/extracted/bindata/119_1t4646s0.bin` (11,721 B) and android
`reference/extracted/android/109_WarHexUI_SurvivalModeData.bin` (11,553 B) ✅ exact, byte sizes
included. Every difference is inside `<id>` (I checked: `grep -vc "<id>"` on the diff body = 0),
and the three distinct web variants are exactly `449|454|449|454|443`, `450|455|450|455|443`,
`451|456|451|456|443` against android's `449|454`, `450|455`, `451|456` ✅.
14 changed lines = **seven waves × two enemy slots** ✅.

**CORRECTION (minor).** The unified diff is **107 lines**, not "168".

### 15. `meta-social/war-mechanics-are-in-the-web-build` — HELD, one weak side-cite

`§1t7785s0§.as` verified line-for-line: `:1108 _loc2_ = 100 * this.§1t7871s0§();` ·
`:1123 _loc3_ = 80 + Math.random() * 40 * this.§1t7871s0§();` ·
`:2119 internal function §1t7871s0§() : Number` with the ladder
`case 2: 1.5 / case 1: 1.2 / case 0: 1 / case -1: 0.75 / case -2: 0.6 / case -3: 0.5 / case -4: 0.25`
at `:2129-2142` · `:2150 if(param1 < 0 || param2 < 0 || param1 > 5 || param2 > 5)` ✅ all exact.
The 6×6 bound is web-confirmed.

**CORRECTION (minor).** "WarSelectUI's 63 also appears at `§1t1056s0§.as:136`" — `:136` is
`public static var §1t8883s0§:int = 63;`, sitting in a run 62 / 63 / 64 inside a class whose
members are consumed as `§1t1056s0§.§1t9114s0§(§1t1056s0§.§1t88xxs0§)` (string lookups). It is
a **string id**, not a board dimension. Drop that sentence; the claim does not need it.

---

## HELD CLEAN

### 1. `items-equipment/two-icon-only-art-namespaces`
`MCSItem.as:203-224 setConsumable` → `getMCSComponent("item",id)`, fallback `new item0()`;
`:226-245 setAccessory` → `getMCSComponent("acc",id)`, fallback `new AccessoryDummyIcon()` ✅.
`MCSItem.as:406-427` (and its twin `MCSCharacter.as:581-602`) shows the symbol name is literally `partType + art.toString()` at `MCSItem.as:425`, so
`item<art>` / `acc<art>` are real namespaces — and neither string appears among the paperdoll
part types (`hat/hair/head/mask/weapon/hand/foot/foottop/stomach/pelvic/torso/uparm/lowarm/thigh/calf/crotch`,
`MCSItem.as:67-392`). The DummyIcon census is **exactly 11** and the names match one-for-one.
`item0.as` is the only named item class in any bundle ✅.
Frame `reference/frames/s21_weapon/t708.0.png` (1920x1080) crop (900,590)-(1640,960) x2: seven
slots — bokken, scroll, blue feather, onigiri ×3, katana, black stone, white feather. **Five of
the seven are consumables/accessories** exactly as stated ✅.

### 2. `items-equipment/web-soul-infusion-superset`
`§1t5374s0§.as:686-724` verified: defense delta into modifier **7** for every type,
weight delta for `_loc1_ == 4 || _loc1_ == 11`, mindamage delta into modifier **6** for type 13,
and `if(_loc5_.durability != 0) { _loc3_.uses = statsItem.uses; }` where `_loc5_` is the **design**
item's data ✅. The Android side is confirmed thinner: `CraftingUI.checkCombine()` at
`shs3_android/scripts/CraftingUI.as:483-531` has **only** the `designType == 13` block
(modifier 6 + an **ungated** `combinedItem.uses = statsSlot.getItem().uses`). No defense delta,
no weight, no durability gate. The superset claim is exactly right.

### 3. `kh-web-getdamage-twin-crit-is-1.3` — the strongest claim in the packet
Web `§1t99s0§.as`: `:3255 internal function §1t4475s0§() : int` · `:3258 minDamage + Math.random() * damageRange` ·
`:3262 _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);` ·
`:3265 _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);` · `:3270 _loc2_ = _loc1_ * 1.4;` ·
`:3272-3275 if(§1t4414s0§ == §1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§; }` ·
`:3281 getBaseDamage` · `:3288 return defense * 0.8;` · `:3295-3297` reload reset ·
stance constants 0..4 at `:27-35`. **Every single line number is exact.**
Android twin `shs3_android_payload/scripts/MCSPlayer.as:3198-3224` is exact too, with
`0.5 * lightMastery * 0.01` / `0.5 * balancedMastery * 0.01` / `* 1.5` and the two-arm
1.5×-Light / 1.2×-other crit, and its stance constants also at `:27-35`.
So: **web 0.04 / 0.02 / 1.4 with a single 1.3× crit arm; android 0.005 / 0.005 / 1.5 with two
crit arms.** A genuine build divergence, and `REBUILD_READINESS.md:152` ("Keep `CRIT_MULT=1.3`")
and `:189` ("crit 1.3×, Heavy def ×0.8") are vindicated by shipped web code.

**The mastery-10 correction is independently confirmed.** `reference/extracted/skilldata.xml`
skills 1000 / 1001 / 1002 (the three stance masteries) each carry `<level><value>` 1…**10**.
At m = 10 the web expression yields Light 0.5 + 0.4 = **0.9**, Balanced 1 + 0.2 = **1.2**,
Heavy **1.4** — the ledger's `:155` table to the digit. `REBUILD_READINESS.md:155`'s label
"MASTERY-9 CEILING" is off by one; they are mastery-**10** values. Overturn upheld.

### 5. `measurement/stage-scale-is-2p25-not-1p875` — code and frames agree, and the frame wins
`§1t1540s0§.as:271-273 var _loc2_:int = 800; var _loc3_:int = 480; var _loc4_:int = 690;` ✅ exact.
`:304-305 _loc8_ = §1t9973s0§.stageHeight / _loc3_; _loc9_ = (§1t9973s0§.stageWidth - _loc2_ * _loc8_) / 2;` ✅ exact.
`:309 §1t1523s0§.§1t9358s0§ = _loc8_;` ✅ exact. `§1t1523s0§.as:104 stageWidth:int = 800` ·
`:106 stageHeight:int = 480` ✅ exact.
I walked the branch at 1920×1080: `_loc6_ = 800/690 = 1.159`, viewport aspect `1.778 > 1.159`
→ else, so `_loc3_` stays 480; then `_loc5_ = 1.667 < 1.778` → else → **scale = 1080/480 = 2.25**,
**offsetX = (1920 - 1800)/2 = 60**, offsetY = 0. Exactly as claimed.

I re-measured the pillarbox myself (first/last column with any luma > 12):
`session11/damage-ttk/t125.350.png` 54→1862 (1809 px) ·
`session11/gap-focus-trigger/t1747.000.png` 52→1867 (1816) ·
`session11/stance-reach/B_t783.400_…png` 52→1867 (1816) ·
`session11/stance-reach/A_t117.400_…png` 54→1862 (1809).
`800 × 2.25 = 1800` plus compression bleed. `/1.875` would demand **210 px** black bars on each
side; they are not there. **STANDING INVARIANT — the frame wins, and here it agrees with the
source.**
`COMBAT_MEASUREMENTS.md:9` is the doc line at issue ("Conversion: px @1080 ÷ 1.875 = stage px")
and `:394-398` is the c-2 table (Light 233-241 / max 303 · Balanced 116-131 / max 131 ·
Heavy 97-103 / max 121) ✅ quoted exactly. Every corrected band divides by 1.2 to the digit.
The Heavy "hard 100-px floor" is real: `shs3_android_payload/scripts/MCSPlayer.as:3053-3055`
`if(this.slashLength < 100) { this.slashLength = 100; }`, and `:3094 InputManager.setMaxDistance(this.slashLength)`
makes it a path-length budget, so a body-to-endpoint distance ≤ budget is the right shape.
**One nuance, not a defect:** the same doc already carries the right divisor at `:779-780`
("Conversions: ÷2.25 = **world px** (sim canvas 800×480) · ÷1.875 = stage px (legacy 1024×576
rows above)"). So the doc is not uniformly wrong — the /1.875 rows are the **legacy** ones, and
the c-2 table is one of them. The overturn of the c-2 conversion stands.

### 6. `meta-social/700-block-is-live-players`
`WarHexUI.as:1412 npcXML.initDuelist(innerStrArray[1],…,false);` · `:1413 npcXML.id = 700 + i;` ·
`:1523 npcXML.id = 700 + i;` (the PIO path) ✅ all exact — both sites build the XMLNpc from a
**network payload**, never from npcdata.
`QuestEngine.as:1041 if(npcList[i].id >= 700 && npcList[i].id <= 710 || npcList[i].id == XMLNpc.INDEX_NPCHOLDER)`
✅ exact, inside `clearPlayersInNPCData()`. (The quote labels that function `:1038`; it is at
`:1035` — a 3-line slip in the prose. The cite field's range `:1039-1043` contains the
load-bearing `:1041`, so nothing rests on the slip.)
`strings.json["374"]` = *"…if enemy players are present in the sector, you will also encounter
them during battle."* ✅ verbatim.
`reference/extracted/npcdata.xml`: **495 `<npc>`, max id 819, ids in 690-720 = none** ✅ exact.
Wave table: **340 in the 400-block + 11 in the 700-block** ✅ (parsed below). The
payload-deterministic kill count is 340.

### 7. `meta-social/achievement-58-pins-340`
Parsed `reference/extracted/android/114_Mobile_AchievementData.bin` (UTF-8, 61 `<achievement>`):
row/id **58** → `stat 60018`, `val 340`, `name 8058`, `desc 8138` →
`strings.json` → **`Warrior III`** / **`Defeat 340 in a war room attack.`** ✅ exact.
Independent of the wave-table sum. `REBUILD_READINESS.md:244 "kill cap 350"` falls.

### 8. `meta-social/achievements-in-web-payload`
`reference/extracted/payload.xml:119088 <item>Duelist I</item>` ✅ · `:119133 <item>Chi Master</item>` ✅ ·
`:119134 <item>Ninja Master</item>` ✅ · `:119148 <item>Be Awesome</item>` ✅ — all four line
numbers land to the digit in a 329 MB file. I re-ran the comparison against the android blob
resolved through `strings.json` and got **`android n= 61   web n= 61` / `EXACT MATCH: True`** ✅.
Cross-check that seals it: web index **58** in that list is `Warrior III`, and web indices
48/49/50/51 are `Rebirth`/`Renshi`/`Kyoshi`/`Ultimate Warrior` — the exact ids finding 7 and
finding 9 pulled from the Android blob. Blocker ③'s achievement third closes on a WEB cite.

### 9. `meta-social/four-dan-achievement-rows`
`114_Mobile_AchievementData.bin:436-470` is **exactly** the four `<achievement>` blocks
(436 opens id 48, 470 closes id 51) ✅ — a line-accurate cite on a `.bin`.
`id 48 stat 25 val 1 → 8041 'Rebirth' / 8121 'Reach Dan 2.'` ·
`id 49 val 2 → 8042 'Renshi' / 8122 'Reach Dan 3.'` ·
`id 50 val 5 → 8043 'Kyoshi' / 8123 'Reach Dan 6.'` ·
`id 51 val 9 → 8044 'Ultimate Warrior' / 8124 'Reach Dan 10.'` ✅ all four exact.
Display offset **+1** across four points ✅.
The shipped off-by-one is real. `InventoryUI.as:2274 switch(StatsManager.getPlayerStats(StatsManager.STAT_DAN))`:
`case 0 → danfield ""` · `case 1 → 456 "(弐段)"` … `case 3-5 → + 465 "Renshi"` ·
`case 6-7 → + 466 "Kyoshi"` · `case 8-9 → + 467 "Hanshi"` · `case 9 → 464 "(十段)"`.
So the **Renshi-named achievement fires at STAT_DAN 2 while the Renshi title starts at STAT_DAN 3**,
and **Kyoshi fires at 5 while the title starts at 6** ✅ exactly as claimed. `case 9` is the last
enumerated arm, which also pins the ladder at 10 displayed Dan.

### 10. `meta-social/frame-shows-6x6-sector-board`
`reference/frames/zFtCaTO0_1M/map/frames/frame_0020.jpg` (512x288) crop (370,45)-(505,180) x9:
gold-cornered panel, header row `0 1 2 3 4 5` with `N` between 2 and 3, left column
`0 1 2 3 4 5` with `W`, `E` on the right edge, `S` under the bottom; white wall/exit segments;
arch glyphs at (0,0) and (1,0) and a third at (1,2); an `X` at (4,2); a white player arrow with
exit chevron on row 4; and beneath the panel **`TERRITORY (21,51)`** / **`SECTOR (5,4)`** ✅.
Every element in the quote is on screen.

### 11. `meta-social/frame-shows-world-territory-board`
`reference/frames/zFtCaTO0_1M/map/frames/frame_0025.jpg` x3: **`NAGANO (26,52) LEVEL: 9`** ✅ ·
`ZOOM OUT` ✅ · vertical `WORLD MAP` side tab ✅ · rounded territory tiles with hut / larger-hut /
city / pagoda icons, several carrying rectangular red, blue and yellow flags ✅ · `X` tiles ✅ ·
legend row **`VILLAGE  TOWN  CITY  CASTLE TOWN  DESTROYED  QUEST`** ✅ ·
**`GREY TERRITORIES - LEVEL TOO LOW / RED TERRITORIES - LEVEL TOO HIGH`** ✅. Verbatim.
(Only inference: that the flags are *clan* flags — the legend does not say so.)

### 13. `meta-social/six-by-six-sector-board-is-pictured`
`reference/frames/map_analysis/zFtCaTO0_1M_map_013_t565s.jpg` — I widened the crop to
(380,15)-(512,180) x8 to see the whole panel: column headers `0 1 2 3 4 5`, row headers
`0 1 2 3 4 5`, `N`/`W`/`E`/`S`, arch glyphs, an `X`, a white triangular player arrow with a
dashed trail, white connector lines, and **`TERRITORY (21,51)` / `SECTOR (4,0)`** printed
directly beneath ✅. (The cite's tighter (395,20)-(512,125) box clips the TERRITORY line, but
it is in the file.)
The A2 corroboration in the quote is also exact, though those paths are not in the cite field:
`Territorymap.as:65-75` `for(var i:int = 0; i < 6; i++) { this.minimapRoomList[i] = new Array(6);
for(j = 0; j < 6; j++) { … x = i * 20 - 77 + 28 …` ✅, with south/east/west labels at `:60-62`;
`:501-504` the same 6×6 for the A* room list ✅; `WarHexUI.as:175-176 this.ht = 6; this.wt = 6;` ✅;
`:208-209 getShiftedNodeId(zeronodeid,i,j)` / `territoryData.getNodeExitsNum(i,j)` ✅.

### 14 / 20 / 21 / 22. the four rebirth-gold claims — all four verified on the same code
`§1t1523s0§.as:2638 public static function §1t9600s0§() : *` ✅ ·
`:2643 §1t9712s0§(§1t8755s0§,0);` (XP → 0) ✅ · `:2644 if(§1t7356s0§(§1t9426s0§) == 8)` ✅ ·
`:2646 §1t9713s0§(§1t9413s0§,100);` ✅ · `:2649 else` ✅ · `:2651 §1t9713s0§(§1t9413s0§,25);` ✅ ·
`:2653-2655 if(DAN < 9) { DAN += 1 }` ✅.
Stat ids: `:222 §1t8755s0§ = 9` (XP) · `:228 §1t9413s0§ = 12` (HGOLD) · `:254 §1t9426s0§ = 25` (DAN) ✅,
identical to android `StatsManager.as:188 STAT_XP = 9` · `:194 STAT_HGOLD = 12` · `:220 STAT_DAN = 25` ✅.
Start-of-life gold: `§1t1523s0§.as:1024 §1t7357s0§(§1t9413s0§,3);` ✅ (android `:706` sets 0).
Paid-player test: `§1t406s0§.as:1544 if(…§1t9413s0§) > 300 && …§1t9426s0§) < 9)` ✅ ·
`:1549 > 3 && … < 1` ✅ · `:1581 if((…§1t9413s0§) - 3) / 25 > _loc3_)` ✅ — the `- 3` is the
starting grant, the `/ 25` the per-rebirth grant. **8 × 25 + 100 = 300** exactly.
Android counterpart: `StatsManager.as:2203 changeStat(STAT_HGOLD,20);` / `:2207 changeStat(STAT_HGOLD,5);`
and `OverworldHUD.as:1333 … > 60 && … < 9` → **5 / 20 / 60**. Web is exactly **5×**.
`KONGREGATE_FORUM_FINDINGS.md:308` reads *"25 gold is awarded EVERY rebirth, rising to 100 gold
on the 9th"* ✅ verbatim — the forum was describing the desktop build. Blocker ④
(`REBUILD_READINESS.md:245`) closes at 25/100/300 (303 with the starting 3), not 5/20/60.

### 17. `meta-social/web-bindata-119-class-name-match`
Web `§1t7785s0§.as:13 internal static const §1t12534s0§:Class = §1t4646s0§;` ✅ exact.
Android `WarHexUI.as:13 internal static const SurvivalModeData:Class = WarHexUI_SurvivalModeData;`
✅ exact — **the same line number in both builds.** The extracted web blob is literally named
`reference/extracted/bindata/119_1t4646s0.bin`. The binding is by name, not inference.
S0-1's "119 = `<survivalmodedata>`, an entire game mode absent from all 12 ledger systems" is
overturned: 119 is the **war-room battle wave table** in the web build too.

### 18. `meta-social/web-daily-prize-rolls-differ`
`§1t401s0§.as:1216 public function §1t5891s0§() : *` · `:1218 var _loc1_:int = 37 + this.§1t5864s0§.getLevel();` ·
`:1219 var _loc2_:int = Math.random() * _loc1_;` ✅ exact, and `:1220-1222 if(_loc2_ <= 4) → …§1t5846s0§(100)`
is the 100-coin arm. `§1t5891s0§` is called at `:1625` from the **else** branch of the streak test — the base prize.
`:1527 if(_loc2_ > 1 && (_loc2_ - 1) % 30 == 0)` → `:1535 _loc4_ = Math.random() * 10;` (30-day, 10 outcomes) ✅
`:1580 else if(_loc2_ > 1 && (_loc2_ - 1) % 10 == 0)` → `:1588 _loc4_ = Math.random() * 8;` (10-day, 8 outcomes) ✅
The claim's day-mapping is right way round.
Android `InteractUI.as`: `:1154 % 30 == 0` → `:1163 dice = Math.random() * 10` (**same**);
`:1208 % 10 == 0` → `:1217 dice = Math.random() * 6` (**differs**);
base `:1244 else … :1247 dice = Math.random() * 36` with `:1248 if(dice <= 4) addLootCoins(100)` (**differs**).
So "37 + level / 8 / 10, and only the 30-day matches Android" is exactly right.

### 19. `meta-social/web-duel-token-cap-40`
`§1t1523s0§.as:200 internal static const §1t9400s0§:int = 40;` ✅ exact, and the "same slot"
argument is airtight — the two constant blocks line up term for term:
web `:192 60` / `:194 2*60` / `:196 60*60` / `:198 7` / `:200 **40**` / `:202 40`
vs android `StatsManager.as:158 APINTERVAL 60` / `:160 DTINTERVAL 2*60` / `:162 WARMOVEINTERVAL 60*60`
/ `:164 MAXQUESTS 7` / `:166 **MAXDUELTOKENS 30**` / `:168 MAJORCUSTOMCLANTHRESHHOLD 40` ✅.
`:1401 if(§1t7356s0§(§1t9416s0§) > §1t9400s0§)` · `:1405 §1t7357s0§(§1t9416s0§,§1t9400s0§);` ✅ ·
`§1t6519s0§.as:827 … §1t9416s0§) + "/" + … §1t9400s0§` ✅ (the "n/40" HUD readout).
`reference/extracted/itemdata.xml:402-403` is the `<item><id>2127</id>` block, `<name>4175</name>`
→ `strings.json["4175"] = "40 Duel Tokens"` ✅. Web cap **40**, Android **30**.

---

## NEW, UNCLAIMED

**NF-1.** The `REBUILD_READINESS.md` self-contradiction is real and is provable from the ledger
alone: `:165` "film shows a **flat +25 gold** every rebirth" vs `:205` "⑤ rebirth/element-picker
UI (**never filmed** — both longplays pre-rebirth)". The "+25" value is right — it is banked at
`:79-80` ("rebirth scroll 1000c (+25g)") and now CONFIRMED by `§1t1523s0§.as:2651` — but its
**film provenance is fictitious**. Retag it as A2/code-sourced.

**NF-2.** COINS ≠ GOLD, photographed: `reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0027.jpg`
shows `480 COINS` and `2 GOLD` with a `GET GOLD` button side by side, level badge **7**,
`14901 / 16350 EXPERIENCE POINTS`. Pairs with `§1t1523s0§.as:1023-1024` (stat 11 = 100,
stat 12 = 3) and the ledger's "100c/3g guest start" — **stat 11 = on-screen COINS,
stat 12 (HGOLD) = on-screen GOLD**.

**NF-3.** The web v0.717 twin of the repair/reinforce block is
`§1t401s0§.as:1057-1085` (repair, `nodeLevel * 10`, `uses > 1 → 1`, achievement 60005) and
`:1086-1087` (reinforce, 5000). The repair numbers are **web-build truth**, not an Android-only
datum — and they are **coins**, not premium Gold.

**NF-4.** The premium ladder has a **2-Gold tier** (2101 `Medium Soldier Pill`, 2126
`25 Duel Tokens`) and the 12-Gold outfit tier is **23 SKUs**, not 30. Full measured ladder:
1 Gold ×20 · 2 Gold ×2 · 3 Gold ×94 · 5 Gold ×4 · 12 Gold ×23 = 143.

**NF-5.** Stance mastery caps at **10**, not 9: `reference/extracted/skilldata.xml` skills
1000/1001/1002 each list `<value>` 1…10. Every "mastery-9 ceiling" label in the docs is off by
one, and the web damage curve only reaches 0.9 / 1.2 / 1.4 at mastery 10.
