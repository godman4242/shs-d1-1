# t1-overturns-05 — HUNTER LENS review (blind critic, 24/24 judged)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-05.json` (md5 `511d0959b8a73cd0df24947bc32523df`,
24 findings, all `verdict: HELD`, all `overturns_ledger: true`).
Ledger opened: `docs/research/REBUILD_READINESS.md` (378 lines).
Every verdict below rests on an artifact **I** opened. Nothing was accepted on the finding's own say-so.

**Headline: 2 findings REFUTED, 22 stand. 7 of the 24 claimed ledger overturns are INFLATED
(`overturn_upheld=false`).** Three findings do not name a REBUILD_READINESS.md sentence at all.

---

## The two refutations

### ✖ IDX 10 `ledger/film-shows-rebirth-is-unsourced` — A1 CITE FAILS. THE FRAME WINS.
The finding files an A1 and quotes "a level badge reading 8 beside `20880 / 20900 EXPERIENCE POINTS`"
from `reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0025.jpg`.
**I opened that frame (1024×576, whole frame, ×2 LANCZOS): it is a full-screen crimson
"YOU WIN" result card** — blood-splatter wordmark, black grass silhouette, a straw-hat samurai and an
archer at right. No HUD. No level badge. No XP readout.
The second frame (`zFtCaTO0_1M/seg-20/frames/frame_0019.jpg`) **does** hold up: level badge **5**,
`8093 / 8350 EXPERIENCE POINTS`, `REGISTER / TO SAVE YOUR PROGRESS AND PLAY ONLINE!`, `259 COINS`.
But **neither** frame shows the quote's `507 / 259 COINS`, `2 GOLD`, `GET GOLD` button, or a Dan field.
Roughly half the A1 quote is not in the cited artifacts. Under §0 that is fatal to the verdict.

*What survives, and where it really comes from:* the ledger genuinely does contradict itself —
`:165` says "film shows a **flat +25 gold** every rebirth" while `:205` says the rebirth screen was
"never filmed — both longplays pre-rebirth". That is an A-none argument readable off the ledger itself;
it needs no frame. And the **+25 is now A2-CONFIRMED** by web code (see IDX 20). So the only thing that
falls is the word *film* in the provenance — which the cited frames do not establish.
`overturn_upheld = false`.

### ✖ IDX 6 `items-equipment/repair-weapon-cost-held` — CURRENCY INVERTED.
The code reads exactly as quoted (`InteractUI.as:1057-1080`: `cost = StageManager.getCurrentNodeLevel() * 10`,
the `itemID == 0 || itemID == 13000` refusal, `if(weapon.uses > 1) weapon.uses = 1;`, `reinforceweapon` = 5000).
But the finding's `lane_impact` asserts, in bold, "**a gold currency (not coins)**". That is backwards:

```
StatsManager.as:192   internal static var STAT_GOLD:int = 11;
StatsManager.as:194   internal static var STAT_HGOLD:int = 12;
StatsManager.as:2627  public static function getGold():int { return getPlayerStats(STAT_GOLD); }
StatsManager.as:~2609 public static function changeGold(num:int):int {
                        var maxCoins:int = getMaxCoins();
                        var newCoins:int = changeStat(11,num); ... }
StatsManager.as:705-706  setPlayerStats(STAT_GOLD,100);  setPlayerStats(STAT_HGOLD,0);
```
`getGold()/changeGold()` are the **COIN** purse (stat 11, clamped by `getMaxCoins()`, seeded at 100 —
the ledger's own "100c/3g guest start"). The premium currency is `STAT_HGOLD`=12 (`getHeavenlyGold`),
which is what the HUD prints as **GOLD**. Three independent checks agree: `reinforceweapon` costs 5000
of the same purse and the ledger already banks "Reinforce **5000c**" at `:80`; the on-screen readout in
`zFtCaTO0_1M/seg-20/frame_0019.jpg` is `259 COINS`; and premium SKUs are priced 1–12 Gold, so a
5000-**Gold** reinforce is impossible.
**Corrected fact for the ledger: Repair = currentNodeLevel × 10 COINS; Reinforce = 5000 COINS.**
`overturn_upheld = true` anyway — `:215 ③ Repair-Weapon cost (never captured)` does fall.

---

## The seven inflated overturns (`overturn_upheld = false`)

| # | finding | why the ledger sentence survives |
|---|---|---|
| 5 | `icon-namespaces-item-and-acc` | `:210 ⑤ … + item **icon manifest**` lists the icon manifest as an **open blocker**. The finding *agrees* — "blocker 5 is only HALF dead… the icon manifest is not". It overturns a survey's closure claim, not the ledger. Its bare assertion that "the compositing contract is genuinely closed" carries no cite. |
| 7 | `two-icon-only-art-namespaces` | Same sentence, same problem — the finding says it "widens the residual art gap rather than closing it". That is corroboration of `:210 ⑤`, not an overturn. |
| 8 | `web-soul-infusion-superset` | `:209` is a bare Ready-list entry: "soul-infusion + stat-transfer rules (patch-note-sourced)". It states **no rule**. The finding contradicts the **Android `CraftingUI`** (verified below), not any ledger sentence. It is a provenance + detail upgrade, not a falsification. |
| 9 | `kh-web-getdamage-twin-crit-is-1.3` | `:155` says the tables "are MASTERY-9 CEILING values, **not base**", and `:156` says a level-1 does 0.5/1.0/1.4. The **same web code vindicates both**: at mastery 0 the expressions give exactly 0.5 / 1.0 / 1.4, and the ceiling arithmetic is the ledger's 0.9/1.2/1.4. Only the digit "9" needs to read "10" — and the cited code establishes **no mastery cap at all**, so even that is unproven. The reach half (300/200/100) is untouched. The finding's own text concedes it: "the ledger had the web numbers right all along". |
| 10 | `film-shows-rebirth-is-unsourced` | see refutation above — the cited frames do not carry it. |
| 17 | `frame-shows-world-territory-board` | This is the **WORLD MAP** (`NAGANO (26,52) LEVEL: 9`, ZOOM OUT, WORLD MAP tab, VILLAGE/TOWN/CITY/CASTLE TOWN/DESTROYED/QUEST legend, grey/red level gating) — a *different board* from the war room's 6×6 sector grid. `:245 ② War-Room map topology` survives untouched. **It does overturn `:225 ①** world bounds + geography — *trace the map image*" and `:115`'s "World-map topology/projection" unknown-unknown. Right evidence, wrong target. |
| — | *(and see the scoping notes on 14 and 21 below)* | |

---

## Verified in full (own artifacts, own commands)

**IDX 0 reload bar** — `MCSPlayer.as:239 this.maxreload = 5 * 24;` sits **inside** `initPlayer` (opened
:182–:245), unconditionally overwriting the `baseReload` param assigned nine lines earlier at :190.
Web twin `§1t99s0§.as:249 this.§1t4415s0§ = 8 * 24;`. `§1t4415s0§` is maxreload beyond doubt
(`:1203 if(reload < maxreload)`, `:3272/:3295 if(reload == maxreload)`, `:3321-3323` clamp).
`grep -rn '§1t4419s0§'` → 3 hits, all write/copy, **zero readers**. ✔
*Cite imprecision (minor):* the quote's android grep list is short — `FriendlyElite.as:49,56`,
`EnemyPlayer.as:754,761`, `EnemyElite.as:99,106` also match, all `var baseReload:int = 48 + xml.speed * 6;`
passed into `initPlayer`. They **strengthen** the "computed and passed, never used" conclusion.
Floor 24 survives: `updateReload((reload - 24) / (maxreload - 24))`.
*Note:* `ledger_text` names a sibling finding, **not** a REBUILD_READINESS.md sentence.

**IDX 1 two gold items** — `itemdata.xml:2445-2459` (id 2212, `<heavenlyprice>5</heavenlyprice>`, **no
`<baseprice>`**) and `:5217-5225` (id 7049, hp 3, no baseprice); `XMLItem.as:86-93` defaults `gvalue = 1`. ✔
My census: 303 rows with `heavenlyprice > 0` → 300 with `<baseprice>0</baseprice>`, 2 with none,
**and a third exception the finding missed**: `itemdata.xml:6902` item 11037 carries
`<baseprice>.</baseprice>`. 301 effectively-zero + 2 defaulted = 303, matching the finding's arithmetic.
*Overstatement (minor):* "purchasable for 1 coin" is an inference from the default, not a demonstrated
listing. `gvalue` reaches the UI via `XMLShopItem` (`:31`, `:124` `assignFromId`) and `ShopUI.as:257`,
which is the **sell** list — and 2212 carries `<nodrop>1</nodrop>`, so `ShopUI.as:258-263` excludes it there.
*Note:* `ledger_text` names a sibling finding, not the ledger.

**IDX 2 condition dead** — `grep -rn '§1t536s0§' shs3_payload/scripts/` returns **exactly 2 lines**:
`§1t17s0§.as:1868` (definition) and `:995` (sole call, inside the String-returning `§1t514s0§`). ✔
Identity confirmed against `Item.as:1481 getCondition()` — same `(maxDurability - uses)/maxDurability*100`,
same `-1` on `durability == 0`. **Caveat for the ledger rewrite:** a *different* wear-derived function
**is** read in the damage path — `§1t535s0§` (`isBroken`, `§1t17s0§.as:1854-1865`) is called from
`§1t1523s0§.as:2306` and `:2322`, the web `getMinDamage`/`getDamageRange` twins; android
`StatsManager.getMinDamage()` shows the effect plainly: a broken weapon contributes `ATK + 1`
instead of `itemdata.mindamage`. So wear → damage is a **binary cliff**, not a multiplier.
The blocker dissolves; it does not vanish.

**IDX 3 equipment save format** — `StatsManager.as:108 equipment:Vector.<Item> = new Vector.<Item>(13)`
(13 slots confirmed; `EQ_ARMOR`=0 … `EQ_SCABBARD`=10 at :262-282), `:4417-4432 getEquipmentString()`
`"|"`-joined `toStringNoQty()`, `:4435-4443 parseEquipmentString()`. `Item.as:229-259` is the record
(`id`, `mod@val#`, PCOLOR/SCOLOR/USES/NAME/CREATOR mod ids). `MCSCharacter.as:348` is the 12-field
appearance string (`… weaponid|propid|prop2id`) — the finding's "APPEARANCE, not persistence" is right. ✔
**Bonus the finding under-claimed:** there is a *local offline* persistence path —
`QueryManagerBase.as:2907` and `:2917 sharedObject.data.equipment = StatsManager.getEquipmentString();`
with `:2980 StatsManager.parseEquipmentString(sharedObject.data.equipment)`. §6's "nothing to copy"
is wrong twice over.

**IDX 4 defense floor** — `Damage.as:150-172` verbatim: `attackerlvl <= 10 → 1 + piercingDamage`;
`<= 20 → attackerlvl/8`; `<= 30 → attackerlvl/6`; else `attackerlvl/4`. Constructor takes `attackerlvl`
(`:50`). Applied at `MCSPlayer.as:3415-3418` and `NPC.as:446-449`; the attacker passes its own `level`
(`MCSPlayer.as:1930 new Damage(this.slashDamage,level,0,this.stance)`). ✔ The ledger's `:209`
"(EnemyLevel/4)" is **false for every level ≤ 30** — at L10 the real floor is a flat 1, not 2, and
both longplays cap at L10.

**IDX 5 / IDX 7 icon namespaces** — `MCSItem.as:203-223 setConsumable` (`getMCSComponent("item",id)`,
fallback `new item0()`) and `:225-245 setAccessory` (`getMCSComponent("acc",id)`, fallback
`new AccessoryDummyIcon()`). `ShopItem.as:134+ setItemID` dispatches into them. `ls | grep -i dummyicon`
→ **exactly 11** classes (Accessory/Achievement/Armor/Consumable/Gloves/Hat/Invalid/Mask/Pants/Shoes/Weapon);
`item0.as` is the only `item<N>`/`acc<N>` class in **any** bundle. ✔
Row census reproduces the finding **to the row**: 2000-2999 = **99**, 3000-3999 = **9**,
20000-29999 = **79**, sum **187**. ✔
I opened `reference/frames/s21_weapon/t708.0.png` (1920×1080) crop (900,590)-(1640,960) ×2:
**7 slots — a wooden stick and a katana (weapons), plus a red/yellow scroll, an onigiri ×3, a black
stone, a blue quill and a white feather (the two feathers on purple-bordered slots)**. Exactly the
"five of seven" the finding claims. ✔ Both findings are true; only their *overturn target* is wrong.

**IDX 8 soul infusion** — `§1t5374s0§.as:686-724` verbatim: defense delta into modifier **7** for every
type, weight delta for `_loc1_ == 4 || _loc1_ == 11`, mindamage delta into modifier **6** for
`_loc1_ == 13`, and `if(_loc5_.durability != 0) uses = …` (inside the weapon branch, not general —
a small scoping slip in the quote). Android twin located and read: `CraftingUI.as:513-522` transfers
**only** modifier 6 and copies `uses` **unconditionally**. The web build is a strict superset. ✔
*Integrity note:* the web UI branches on item id **2218** at 10+ sites (`:368, :385, :430, :465, :609,
:644, :664, :681, :746, :893`) and **2218 does not exist in `reference/extracted/itemdata.xml`**
(ids run 2200…2216 there). I diffed the extracted table against `android/111_Mobile_ItemData.bin`:
**identical 982-id sets, neither contains 2218.** Whoever rewrites the items ledger should resolve that.

**IDX 9 web getDamage** — `§1t99s0§.as:3255-3277` opened: `minDamage + Math.random() * damageRange`,
Light `*(0.5 + 0.4 * m * 0.1)`, Balanced `*(1 + 0.2 * m * 0.1)`, Heavy/Dual/Reversed `*1.4`, single crit
arm `return _loc2_ * 1.3 + this.§1t1243s0§;` on `reload == maxreload`. Stance consts 0..4 at :26-34.
`getDefense` twin `:3284-3290 return defense * 0.8;`. Android twin at
`shs3_android_payload/scripts/MCSPlayer.as:3198-3223`: `0.5 + 0.5*m*0.01`, `1 + 0.5*m*0.01`, `*1.5`,
**two-arm** crit `*1.5` Light / `*1.2` other. **The divergence is real and the web crit is 1.3.** ✔
The overturn is still inflated — see the table above.

**IDX 11 stage scale 2.25** — `§1t1540s0§.as:271-273` `800/480/690`; `:299-307` the two branches;
at 1920×1080 the aspect test `_loc5_(1.6667) >= _loc7_(1.7778)` is **false** → fit-height:
`scale = 1080/480 = 2.25`, `offsetX = (1920 - 1800)/2 = 60`. `§1t1523s0§.as:104,106` `stageWidth=800`,
`stageHeight=480`. ✔ **I re-measured the pillarbox myself** (first/last column with any pixel > 12):

```
damage-ttk/t125.350.png                        1920x1080  cols  54 .. 1862  (width 1809)
gap-focus-trigger/t1747.000.png                1920x1080  cols  52 .. 1867  (width 1816)
stance-reach/B_t783.400_LIGHT_…farGap436px.png 1920x1080  cols  52 .. 1867  (width 1816)
stance-reach/A_t117.400_BALANCED_…235px.png    1920x1080  cols  54 .. 1862  (width 1809)
```
800 × 2.25 = **1800** + compression bleed. `/1.875` would demand 210 px black bars that are simply not
there. **This is the highest-value survivor in the packet.** `COMBAT_MEASUREMENTS.md:9` still declares
"px @1080 ÷ 1.875 = stage px" and `:389-397`'s c-2 table (Light 233-241/303, Balanced 116-131,
Heavy 97-103/121) is built on it — so both ✅ CONFIRMED verdicts there collapse: Light max 303 → **252**
(no longer "lands on 300") and Heavy plateau 97-103 → **81-86** (no longer "sits on 100").
The doc's own §S24 already records "÷2.25 = world px (sim canvas 800×480)" at `:779-780`, so it half
knows — but the header and the c-2 verdicts have not been re-derived. `overturn_upheld = true`.

**IDX 12 the 700-block** — `WarHexUI.as:1412-1414` and `:1522-1524` both `npcXML.id = 700 + i;` after
`initDuelist(...)`; `QuestEngine.as:1035-1046 clearPlayersInNPCData()` with
`:1041 if(npcList[i].id >= 700 && npcList[i].id <= 710 || … INDEX_NPCHOLDER)`. ✔
`npcdata.xml`: 495 `<npc>`, max id 819, **zero** ids in 690-720. ✔ String `374` reads
"if enemy players are present in the sector, you will also encounter them during battle." ✔
**I summed the wave table myself, in both builds:**
```
android/109_WarHexUI_SurvivalModeData.bin  39 waves, 87 <enemy>, qty(non-700)=340, 700-710 slots=11, total 351
bindata/119_1t4646s0.bin                   39 waves, 87 <enemy>, qty(non-700)=340, 700-710 slots=11, total 351
```
The ledger's `:244` "kill cap 350" is wrong in **both** directions: 351 nominal, 340 offline-deterministic.

**IDX 13 achievement 58** — row index 58 of `114_Mobile_AchievementData.bin` (61 rows, plain UTF-8 XML):
`id 58, stat 60018, val 340` → strings `Warrior III` / `Defeat 340 in a war room attack.` ✔ A second,
unrelated table independently pins 340.

**IDX 14 achievements in the web payload** — `payload.xml:119088 <item>Duelist I</item>` …
`:119133 Chi Master`, `:119134 Ninja Master`, `:119148 Be Awesome`. I ran the element-wise comparison:
**`android n= 61   web n= 61` / `EXACT MATCH: True`** — reproducing the finding's printout exactly. ✔
*Scoping the overturn (upheld, narrowly):* only the **names** are in the web payload — they sit in the
ABC constant-string pool between `buyCredits` and `[\\s\\r]*`, not in a data table. The web bindata set
holds **no achievement blob at all** (I listed all 27: 100-118 animdata, 119 survivalmodedata, 92 GIF,
93 room objects, 94-98 name tables). The `stat`/`val` thresholds still come from the Android blob.
And the sentence names three items — the daily-reward table and token costs are untouched.

**IDX 15 four Dan rows** — `114_Mobile_AchievementData.bin:436-470` (the file is text XML, so the
citelint `LINE_ON_BINARY` note is a false alarm): ids 48/49/50/51, all `stat 25`, vals **1/2/5/9** →
`Rebirth`/`Renshi`/`Kyoshi`/`Ultimate Warrior` and `Reach Dan 2./3./6./10.` ✔
I checked the quirk against `InventoryUI.as:2274-2317` + strings 455-467: `STAT_DAN 0 → ""`,
`1 → (弐段)` … `9 → (十段)` (**displayed Dan = STAT_DAN + 1**, four-point proof holds), and the shogo
titles start at **STAT_DAN 3 (Renshi, 465)**, **6 (Kyoshi, 466)**, **8 (Hanshi, 467)**. So the
achievement named *Renshi* really does fire one dan early, and so does *Kyoshi*. ✔

**IDX 16 + IDX 19 the 6×6 sector board is photographed** — I opened both.
`zFtCaTO0_1M/map/frames/frame_0020.jpg` crop (370,45)-(505,180) ×9 LANCZOS: gold-cornered panel,
column headers **0 1 2 3 4 5**, row headers **0 1 2 3 4 5**, **N** top / **E** right / **S** bottom /
**W** left, white wall/exit segments between cells, gate-arch glyphs at (0,0), (1,0) and (1,2), an **X**
at (4,2), a white player arrow with an exit chevron at the right edge of row 4, and beneath the panel
**`TERRITORY (21,51)` / `SECTOR (5,4)`**. ✔
`map_analysis/zFtCaTO0_1M_map_013_t565s.jpg` crop (395,20)-(512,125) ×10: same board, plus a dashed
movement trail into the player arrow. ✔
**Why these DO overturn `:245 ②`** (I checked, because "minimap ≠ war room" was my first instinct):
`WarHexUI.as:175-176 this.ht = 6; this.wt = 6;` and `:208-209`
`nodeid = getShiftedNodeId(zeronodeid,i,j); warTerrain.setTerrain(getRoomBG(nodeid),
territoryData.getLocationType(nodeid), territoryData.getNodeExitsNum(i,j));`
— the war board is built from the **same 6×6 territory node grid and the same `getNodeExitsNum`
adjacency** the minimap renders as walls (`Territorymap.as:65-75`, `minimapRoomList[6][6]`,
N/S/E/W labels from strings 398-401). Same board, two renderers. `overturn_upheld = true` for both.

**IDX 18 premium catalogue** — `121_Mobile_PremiumData.bin`: **176 `<item>` rows, 143 unique ids,
0 unresolved** against `itemdata.xml`. ✔ 5-Gold tier is exactly the four named (2200 Amnesia Scroll,
2203 Writ of Release, 2207 Name Change Scroll, 2212 Clan Deed) ✔; 1-Gold tier contains 2208 `1000 coins`,
2213 `Clan Invitation`, 2215 `Edit Clan` and exactly **12 Hair SKUs** (6023-6043) ✔.
**Two enumeration errors (minor, corrected here):**
- the ladder is **1/2/3/5/12**, not 1/3/5/12 — there is a **2-Gold tier**: 2101 `Medium Soldier Pill`,
  2126 `25 Duel Tokens`.
- the 12-Gold outfits number **23 unique / 24 raw** (2130…2171), **not 30**.
Full unique ladder: 1g=20 · 2g=2 · 3g=94 · 5g=4 · 12g=23 = 143.

**IDX 20 rebirth gold 25/100/300** — `§1t1523s0§.as:2638` function head, `:2643 if(getStat(DAN) == 8)`
→ `:2646 changeStat(§1t9413s0§,100)`, else `:2651 changeStat(§1t9413s0§,25)`, `§1t9413s0§ = 12` at `:228`
(= `STAT_HGOLD`), then `:2653 if(getStat(DAN) < 9) changeStat(DAN,1)`.
`§1t406s0§.as:1544 if(getStat(HGOLD) > 300 && getStat(DAN) < 9)`. ✔ 8 × 25 + 100 = **300**, and the
message string uses "10", which with `displayed Dan = STAT_DAN + 1` (IDX 15) is precisely the 10th-Dan
tier. **`:164-165` falls flat**: `MAX_DAN_RANK=10` and `tenthGold=100` are CONTRACT, and
"no 10th-rebirth tier" is disproven by shipped web code. `overturn_upheld = true`.

**IDX 21 war mechanics in the web build** — `§1t7785s0§.as:1108 _loc2_ = 100 * this.§1t7871s0§();`,
`:1123 _loc3_ = 80 + Math.random() * 40 * this.§1t7871s0§();`, `:2119-2145` the terrain multiplier
(`2→1.5, 1→1.2, 0→1, -1→0.75, -2→0.6, -3→0.5, -4→0.25`), `:2148-2155`
`if(param1 < 0 || param2 < 0 || param1 > 5 || param2 > 5) return 0;` over `§1t7806s0§[p1][p2]`. ✔
`§1t1056s0§.as:136` is `public static var §1t8883s0§:int = 63;` — literally true but a thin cite.
`overturn_upheld = true`, scoped: the 6×6 board bound and the terrain table are web-confirmed;
the *adjacency* model itself still reads off android `WarHexUI`/`Territorymap` (IDX 19).

**IDX 22 the war-room board is on screen** — I opened both seg-29 frames (×2 LANCZOS) and they are
**unmistakably the War Room**: vertical right rail **WAR ROOM** with an X close button;
frame_0019 `SELECT A SECTOR` + `TROOPS WILL ATTEMPT SECTOR CAPTURE IN 16:44:07` + `2 MOVE(S) LEFT` /
`NEXT TURN IN 1:00:00`; frame_0018 `SELECT HQ/TOWN TO ENTER TERRITORY` + `3 MOVE(S) LEFT` +
`16:44:10`. Board: thick black sector boundaries over grass/road, mountain and tree terrain, two green
clan banner flags, red enemy-shaded cells, **two circled-fist Command-HQ medallions with directional
arrows** (one down at top, one up at bottom), a wooden **barricade** icon and a crossed-arms/HQ building
icon on the contested cells. Right panel `RYUWARA MESSAGE BOARD` with `SEND TO SIDE` / `SEND TO ALL`,
`Enter message here`, and `ASUTORARU: BUILDING BARRICADES AT SECTOR (4,3) (2 HOURS AGO)`. ✔
*Transcription slips (minor, not fabrication):* the capture timer reads **16:44:07 / :10**, not 16:44:05;
the turn timer reads **`NEXT TURN IN 1:00:00`**, not 59:58 (which *strengthens* the one-hour turn claim);
the seg-29 frames are **1024×576**, not the "512×288" the cite states; and the "samurai on the contested
cell" is the silhouette inside the `TRAVELLING…` modal, not a board token. Core content holds.

**IDX 23 web bindata 119** — `§1t7785s0§.as:13 internal static const §1t12534s0§:Class = §1t4646s0§;`
against the extracted filename `bindata/119_1t4646s0.bin`; android twin `WarHexUI.as:13
internal static const SurvivalModeData:Class = WarHexUI_SurvivalModeData;`. ✔ And the binding is
*used*: `§1t7785s0§.as:1860 var _loc2_:XML = XML(new §1t12534s0§());` — the web wave-list builder,
mirroring android `createWarRoomWaveList`'s `XML(new SurvivalModeData())`.
I decoded both blobs (**UTF-8**, not UTF-16LE): `<survivalmodedata>`, 39 `<wave>`, 87 `<enemy>` in each.
So S0-1's "an ENTIRE GAME MODE absent from all 12 ledger systems" falls — 119 is the **war-room battle
wave table**, and the war room is already in the meta-social ledger at `:244-246`. ✔
*Also worth recording:* the android numbering is **109**, not 119 — the two builds' blob indices are not
aligned, so blob-number cites must always name their build.
*Note:* `ledger_text` is the S0 briefing, not a REBUILD_READINESS.md sentence.

---

## New findings this review produced (nobody has claimed these)

1. **Repair and Reinforce are priced in COINS, not Gold** — `StatsManager.as:192,194,2627-2630` +
   `changeGold`'s `getMaxCoins()` clamp. A2. Overturns the packet's own IDX 6 lane_impact.
2. **`REBUILD_READINESS.md:216` "Writ of Release 25g now double-confirmed" is contradicted by the
   shipped data** — `itemdata.xml:2328-2335` gives item 2203 `<baseprice>0</baseprice>
   <heavenlyprice>5</heavenlyprice>`, and `121_Mobile_PremiumData.bin` lists it in the **5-Gold** tier.
   A2. Nobody in this packet noticed the ledger's own banked price is off by 5×.
3. **A third `<baseprice>` exception** — `itemdata.xml:6902` item 11037 carries
   `<baseprice>.</baseprice>` (a literal period). A2.
4. **Wear DOES gate damage — as a binary cliff** — `§1t17s0§.as:1854-1865 isBroken()` is read by the web
   `getMinDamage`/`getDamageRange` twins at `§1t1523s0§.as:2306,2322`; android
   `StatsManager.getMinDamage()` shows a broken weapon contributing `ATK + 1` instead of
   `itemdata.mindamage`. A2. Qualifies IDX 2's "no damage path reads it".
5. **The save format has a LOCAL offline path** — `QueryManagerBase.as:2907,2917,2980` round-trips the
   equipment string through a `SharedObject`. A2. §6's "nothing to copy" is doubly wrong.
6. **Premium ladder is 1/2/3/5/12 Gold and the 12-Gold outfit tier is 23 SKUs, not 30.** A2.
7. **The war-room wave table sums to 340 + 11 = 351 in BOTH builds** (measured, not inferred). A2.
8. **The web payload references item id 2218 that no held item table contains** — `§1t5374s0§.as:368,
   385, 430, 465, 609, 644, 664, 681, 746, 893`; `reference/extracted/itemdata.xml` and
   `android/111_Mobile_ItemData.bin` have **identical 982-id sets** and neither holds 2218.
   STILL_UNHELD on interpretation; flagged as an integrity hole in the item-table parity story.
9. **`Nr4fQstqHDM/seg-05/frames/frame_0025.jpg` is a "YOU WIN" result card**, not a level-8 HUD —
   the frame that refutes IDX 10. A1.

## Scoping note the ledger rewrite must not miss
Three of the 24 findings (IDX 0, IDX 1, IDX 23) carry a `ledger_text` that is **not a sentence in
`docs/research/REBUILD_READINESS.md`** — I grepped it. They overturn sibling survey findings
(`itemdata/slashusage-is-a-reload-economy`, `itemdata/gold-catalogue`) and the Stage-0 S0-1 briefing.
They are true and they should be recorded, but **they will not rewrite the ledger**, and counting them
toward "203 claimed overturns of REBUILD_READINESS.md" inflates that number.
