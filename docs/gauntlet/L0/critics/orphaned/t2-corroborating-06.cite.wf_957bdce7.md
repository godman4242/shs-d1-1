# t2-corroborating-06 — BLIND CITE-LENS REVIEW

Packet: `docs/gauntlet/L0/worklist/t2-corroborating-06.json` — **48 claims, 48 judged, 0 skipped.**
Every verdict below rests on an artifact I opened in this run. I did not open any
`critics/*.md` or `sources/*.md`.

**Result: 42 survive, 6 REFUTED (#8, #14, #15, #40, #44, #45).**
**5 new findings, two of them large: all five "encrypted" Android resource blobs decrypt,
and `115_Mobile_SHS3Resource.bin` contains the entire art set (1,912 named symbols).**

---

## A. THE TWO CLAIMS THAT MOVED THE BOARD (my own measurement)

### N1 — S0-5 is dead for ALL FIVE blobs, not just audio

`ResourceManager.as:186` passes the key as `resourceFileNameArray[num].charCodeAt(1)` — the
**second character of the file name** — into `decryptByteArray` (`ResourceManager.as:200-217`),
which XORs only bytes 3..255 and swaps `ba[i] <-> ba[i+256]` for every `i % 11 == 0`.

I implemented exactly that and ran it over all five blobs in `reference/extracted/android/`:

| blob | key | char | header after decrypt | zlib inflate |
|---|---|---|---|---|
| 113_Mobile_MusicResource.bin | 117 | 'u' of "musicresource.swf" | `CWS\x11` | OK, 1,402,677 B |
| 115_Mobile_SHS3Resource.bin | 104 | 'h' of "shs3resource.swf" | `CWS\x11` | **OK, 1,040,849 B** |
| 120_Mobile_BGResource.bin | 103 | 'g' of "bgresource.swf" | `CWS\x11` | OK, 4,412,340 B |
| 122_Mobile_SoundResource.bin | 111 | 'o' of "soundresource.swf" | `CWS\x11` | OK, 29,623 B |
| 124_Mobile_ImageResource.bin | 109 | 'm' of "imageresource.swf" | `CWS\x11` | OK, 1,908,229 B |

The naive "XOR the whole file with one key" approach fails on all five — which is exactly
the false negative that kept these closed.

### N2 — the art set is RECOVERED: 115_Mobile_SHS3Resource.bin holds 1,912 named symbols

Parsed the SymbolClass tag (76) of the inflated body:

- **112 `item####`** icons (2100…20110) — the consumable/quest icon family
- **8 `acc####`** icons (3000-3006, 3008) — the accessory icon family
- **109 `weapon####`** (13000…13232) — including **`weapon13002`, the Branch in the frame**
- 96 `hat`, 73 `hair`, 59 `mask`, 151 each of `torso`/`uparm`/`lowarm`/`pelvic`, 150 `stomach`,
  85 each `calf`/`crotch`/`thigh`, 44 `foot`/`foottop`, 38 `head`, 33 `hand`/`neck`, 60 `prop`
- 79 `skill####` icons, 5 `achievement`
- full creature rigs: `*_bear_`, `*_boar_`, `*_deer_`, `*_horse_`, `*_wolf_`

1,949 DefineSprite + 1,594 DefineShape4 tags carry the actual vector data.

**This is the artifact six claims in this packet say does not exist.** It has been sitting in
`reference/extracted/android/` the whole time. Per C1's own warning, a plain grep of the six
non-text blobs returns 0 hits for content that IS there.

---

## B. REFUTATIONS

### #8 `items-equipment/art-payload-is-a-named-external-swf` — REFUTED (material)
Half right, half fatally stale.
- **Holds:** `ResourceManager.as:41` `resourceFileNameArray = ["shs3resource.swf", …]` verbatim;
  `StatsManager.as:360 public static var useExternalResource:Boolean = true;` verbatim;
  `ResourceManager.as:238-252` is a literal `hasDefinition(partType + id)` name resolve.
  I re-ran the symbol scan myself: `shs3_payload_decoded.swf` = 490 symbols, `shs3_android_payload_decoded.swf`
  = 423, and the part-family set is identical in both — one each of calf/crotch/foot/foottop/hand/
  hat/lowarm/mask/neck/pelvic/prop/stomach/thigh/torso/uparm/item, two each of hair/head/weapon.
  So "the per-item art is not in either payload SWF" is TRUE.
- **Refuted:** the cite asserts "all five blobs still fail zlib after the CWS magic, so S0-5 stands."
  All five inflate (N1). This also repeats the brief's superseded S0-5 line, which is auto-refuted
  under the standing corrections.

### #14 `items-equipment/build-provenance-drift-in-ui-claims` — REFUTED (fatal cite)
The cite IS the claim: *"grepped EQ_ACCESSORY1/EQ_ACCESSORY2/EQ_NECK/ring: zero hits"*.
My grep of the same file:
```
$ grep -c "EQ_ACCESSORY1\|EQ_ACCESSORY2" reference/decompiled/shs3_android/scripts/InventoryUI.as
10
InventoryUI.as:175   internal var SLOT_RING1:int = 6;
InventoryUI.as:179   internal var SLOT_RING2:int = 8;
InventoryUI.as:268   this.equippedSlots[this.SLOT_RING1] = this.equipAccessory1;
InventoryUI.as:269   this.equippedSlots[this.SLOT_RING2] = this.equipAccessory2;
InventoryUI.as:522   tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1];
```
Only the EQ_NECK leg is true. The Android InventoryUI binds both accessory slots to two ring
boxes — which is precisely the 9-box paperdoll the frame shows (I opened it, §D). The claim's
conclusion ("the 9-box paperdoll in the frame may not be the layout the cited Android UI code
renders") is inverted by its own file. Its "no per-item LEVEL label" leg is also loose:
`InventoryUI.as:1161 if(this.selectedSlotItem.getLevel() > StatsManager.getLevel())` shows a
per-item level in the inventory, just not as a panel field.

### #15 `items-equipment/consumable-accessory-icon-families` — REFUTED (material)
Code half is verbatim-correct (`MCSItem.as:203-224`, `:226-247`). The claim's own text says the
icon family covers *"the ~824 non-weapon rows of the 982-item roster."* It does not.
`ShopItem.setItemID` (`:134-199`) routes `item`/`acc` for exactly three bands — 2000-2999 (99),
3000-3999 (9), 20000-29999 (79) = **187 rows**; every other non-weapon row is paperdoll-composited.
And "still-unrecovered" is false per N2. Sibling #16 states the same mechanism without the scope error.

### #40 `items-equipment/icon-symbol-families-still-unheld` — REFUTED (material)
Its row arithmetic is exact (795 paperdoll-composited + 187 icon-only = 982; I reproduced the
band histogram, below). It fails on the load-bearing sentence: *"item*/acc* art that exists in no
held artifact."* It exists in a held artifact — 112 `item####` + 8 `acc####` symbols in
`115_Mobile_SHS3Resource.bin` (N2).

### #44 `items-equipment/mcs-human-rig-is-23-layers` — REFUTED (minor)
Headline is right, enumeration contradicts itself: *"PART_prop3/l_shoulder/r_shoulder/l_knee/r_knee
**(22-26)** are creature-rig extras that only MCSWolf allocates."* `MCSCharacter.as:120,141-146`
loops `i <= partListLength` with `partListLength = 22`, so **index 22 is allocated by the human
constructor** — that is the 23rd of the "23-deep" stack the same sentence claims. Also MCSWolf
calls `super()` first (`MCSWolf.as:12`) and *then* pushes 26 more, so the wolf's list is 49 long;
23-26 exist because of the second loop, not because index 22 was ever wolf-only.
Nothing is lost: eight sibling claims carry the correct version.

### #45 `items-equipment/mcs-partlist-is-23-layers` — REFUTED (material cite)
Text: *"PART_l_shoulder 23 … PART_r_knee 26 are declared but never used anywhere in the corpus"*,
with the cite asserting *"grep for the four constants returns only their declarations."*
My grep of the whole `reference/decompiled/` tree returns eight non-declaration hits:
```
shs3_android/scripts/MCSWolf.as:184  var r_frontleg1:MovieClip = partList[PART_r_shoulder];
shs3_android/scripts/MCSWolf.as:188  var l_frontleg1:MovieClip = partList[PART_l_shoulder];
shs3_android/scripts/MCSWolf.as:193  var r_backleg2:MovieClip  = partList[PART_r_knee];
shs3_android/scripts/MCSWolf.as:197  var l_backleg2:MovieClip  = partList[PART_l_knee];
   (+ the same four in shs3_android_payload/)
```
This is the exact misattribution its eight siblings warn about. Its lane note is fine
(`StatsManager.as:3330 case EQ_ACCESSORY1: getPlayerMCS().setProp2(itemid)` ✓).

---

## C. WHAT I VERIFIED FIRST-HAND (survivors)

### The 23-layer rig (claims #4, #5, #32, #33, #34, #35, #43 — all HOLD)
`MCSCharacter.as` — `:120 internal var partListLength:int = 22;` and `:141-146` the
`for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }`
loop, both verbatim. `:10-62` declares PART_l_hand 0 … PART_r_knee 26. `MCSWolf.as:13 partListLength = 25;`
`:184/:188/:193/:197` bind 23-26 as quadruped legs; `:148` binds PART_prop3 as tail3.
Two small corrections that do not sink anything:
- #4 and #43 both say indices 23-26 are "the only ones typed `:*`". `MCSCharacter.as:54` shows
  **PART_prop3 is `:*` too** — the type tell is 0-21 `:int`, 22-26 `:*`.
- #32's lane note verified exactly: 6 `setChildIndex` calls (`:683, :706, :724, :755, :873, :885`),
  zero `swapChildren`, none on the top-level partList. setPants = 5 parts ✓; setArmor lists 8
  (`:918-925`, neck conditional) — #45's "8 incl. conditional neck" is the tighter reading.

### The border ladder (#9, #10, #11, #12 — all HOLD; two were QUOTE_UNVERIFIED, both quotes located)
`ShopItem.as:27 internal var borderType:String = "normal";` · `:51-52 this.borderType = itemRef.getShopItemType(); gotoAndStop(this.borderType + "_default");`
· `:116 "_selected"` · `:219-220` · `:283 "_selectedmouseover"` `:287 "_mouseover"` `:295 "_selected"` `:299 "_default"`.
`Item.as:382-405 getShopItemType()` is the 4-tier ladder, and `:386-392` confirms #12's note that
"unique" is broader than `<unique>==1` (pickable quest items, trade ids 20103-20107, player-named).
`GameEngine.as:564` green=special, `:568` blue=rare, `:572` purple=unique — all three tips exist.
**Correction to #10:** it says the label set is 8 frames ({4 tiers} x {_default,_selected}). The
lines it cites do only show those two suffixes, but `:283-299` adds `_mouseover` and
`_selectedmouseover`, so the art contract is **16 frames**, as #9 and #11 say. Held, not refuted —
incomplete, not wrong.

### The frame (`reference/frames/s21_weapon/t708.0.png`, 1920x1080) — I opened it
Crops I made and looked at, all LANCZOS:
- **(1320,240)-(1620,320) x4** — `BRANCH` / `DMG: 1 - 2  (EQ: 1 - 3)` with the **2 in red** / `WEIGHT: 1`. Exactly as #24 says.
- **(980,480)-(1200,540) x5** — the words **`LEVEL 1`** centred under the item tile. #41/#42 confirmed.
- **(900,590)-(1640,960) x2** — 7 tiles: branch (darkened tile, **unchanged tan border** = selected),
  red/yellow scroll, blue feather (**purple border**), onigiri with green nori + `X3`, katana,
  black stone, white feather (**purple border**). #11's "2 purple, 1 darkened tan, 4 plain tan" is
  exactly right; #36's four non-equipment icons and #40's 7-icon list are exactly right.
- **(170,240)-(870,1040) x2** — **nine** paperdoll boxes: straw hat, oni-mask **outline placeholder**,
  grey robe, **gauntlet outline placeholder**, white pants, pickaxe, **ring outline**, sandals,
  **ring outline**. No neck box. Confirms #47 and #36; refutes #14.
- Also visible: `WEIGHT: 43 / 100`, and the chat-bubble button beside the item icon — which matches
  `InventoryUI.as:584 this.itemPanel.chatbutton`.

### #24 frame-to-payload identity — HOLDS, and the uniqueness is real
My own parse of all 982 rows: **exactly one** row has mindamage 1 / maxdamage 2 — id 13002,
name 4041, weight 1. `strings.json["4041"] = "Branch"`. Id 13022 = mindamage 1, maxdamage 3,
weight 10, name 4244 = `"Pickaxe"`. Both verbatim.

### #41/#42 the LEVEL caption — HOLD, and the frame wins
`itemdata.xml` row 13002 carries `<minlvl>-4</minlvl>` and no `<levelrestriction>`.
`Item.as:274-299 getLevel()`: `maxlevel` = 0 with no modifiers, then `if(lvl < baselevel) lvl = baselevel;`
— `0 < -4` is false, so it returns **0**. Both "Level Required" sites (`:1101-1104`, `:1299-1304`,
`LangManager.getString(124)` = `"Level Required"`) are gated on `itemlevel > 0` and cannot fire.
`InventoryUI.as:1453-1462` shows the panel exposes only `selectItem`, `selectItemName`,
`selectItemAttribute` (+ `chatbutton` at `:584`) — no level field.
**THE FRAME WINS: the caption is on screen; the Android v0.682 code cannot produce it.** Said out loud.
(#25 is the same open item with no cite of its own — an honest STILL_UNHELD; the data behind it
checks out, so it enters as an open question, never as a fact.)

### Economy / data (#2, #3, #7, #17, #18, #19, #23, #26, #29, #30, #31, #46 — all HOLD)
Measurements I re-derived from `reference/extracted/itemdata.xml` myself:
- 982 `<item>`, 146 `<art>` rows, 68 distinct, max 20052 — #7 exact. `XMLItem.as:110-116` is the
  cleaner cite for "no `<art>` ⇒ art = id" (`this.art = this.id;` at `:116`).
- id 11037 verbatim: `<type>7</type><name>4204</name><unique>1</unique><baseprice>.</baseprice><heavenlyprice>3</heavenlyprice><defense>1</defense><weight>5</weight>`.
  `strings.json["4204"] = "Santa Pants"`. 303 rows carry non-zero `<heavenlyprice>`, **300** write
  `<baseprice>0</baseprice>`, 11037 is the only `.` — #2's numbers land on the nose. `XMLItem.as:86-93`
  takes `gvalue = xml.baseprice` when the tag is non-empty (the empty branch would give **1**, not 0),
  so `int(".") = 0` really does land on the intended value. Inert, as claimed.
- `<uses>` = 115 rows, distinct {50,60,80,100}; no `durability` tag exists. `XMLItem.as:184-190`,
  `Item.as:1481-1495` (`return -1` when `durability == 0`), `Item.as:712-716`. #18/#19 exact.
- 412 `<modifier>` rows, 34 distinct ids. Stat switch 0-16 = **47** rows; Set band 101-1999 = **344**
  rows; unmapped = 21 rows / 12 ids (25, 38, 78, 79, **82**, 84, 90, 96, 97, 98, 99, 40000).
  #23 and #46 say 19/11 by excluding id 82 as `Item.as:12 USESMODID:int = 82` — defensible, but note
  82 has no case in `XMLItem.as:233-296` either, so **21 rows hit `trace("ErrorValue")`, not 19**.
- `ShopUI.as:58 internal var sellPercentage:Number = 0.5;` is the sole occurrence in the tree
  (declaration only, zero readers). `Item.as:1582-1592 getSellAmt()` verbatim, one caller
  (`ShopUI.as:401`). #3 exact.
- `Item.as:1564-1579 getWeight()` verbatim, and `Item.as:36 internal var weight:int = -1;` proves
  #30's first-call asymmetry. Web `§1t17s0§.as:1958-1975` verbatim:
  `return (this.weight + this.§1t478s0§) * this.§1t484s0§();` on **both** paths. #29/#30/#31 exact.
- `Item.as:317-330 copyModifiers` refuses 85/86/87/88 verbatim. #17 exact.
- #26: `Item.as:1004-1053` verbatim; `StatsManager.as:226-232` (STAT_FIREATK 28 … STAT_EARTHATK 31)
  and `:250-260` (STAT_FIREDEF 200 … STAT_PIERCINGDMG 205); `strings.json` 507 "Fire ATK", 510
  "Earth ATK", 871 "Fire DEF", 875 "Critical Damage", 876 "Piercing Damage", 123 "Set". Id 103 = 223
  rows ✓. **One over-reach:** only `case 103:` and `case 106:` resolve to container contents in the
  cited switch; 104 and 105 (82 rows) have no case anywhere in `Item.as`.

### #6 affix matrix, #37/#39 band table — HOLD, numbers reproduce exactly
`ItemGenerator.as:397-437` gives 8 item types x 17-entry `pot` arrays verbatim; `:431-450` forces
the first affix (ARMOR→DEFENSE, WEAPON→ATTACK, SHOES→SPEED) and zeroes that channel.
My band histogram of all 982 ids: 99 / 9 / 152 / 35 / 73 / 98 / 38 / 60 / **14** / 93 / 55 / 177 / 79
— identical to #37's, to the row. `ShopItem.as:177` really is `else if(!(this.itemID < 11000 && this.itemID > 9999))`,
so the 14 neck items get **no** icon branch. 11 `*DummyIcon` classes exist on disk
(Accessory, Achievement, Armor, Consumable, Gloves, Hat, Invalid, Mask, Pants, Shoes, Weapon) — #39's
"eleven, not one" ✓.

### #0 stance gate — HOLDS, and I strengthened it
Android: `MCSPlayer.as:2977 if(this.reload < this.maxreload / 6) { return; }` with
`:239 this.maxreload = 5 * 24;` → 20/120 = **1/6**.
Web: `§1t99s0§.as:249 this.§1t4415s0§ = 8 * 24;` (192) — and I went and found the gate the claim
only called "documented": `§1t99s0§.as:3058-3063`
```
public function §1t4472s0§() : *   // the nextStance twin: -1 -> stance1 -> stance2 -> stance3 -> stance1
{
   if(this.§1t4414s0§ < 48) { return; }
```
plus `:3050 return this.§1t4469s0§() && this.§1t4414s0§ >= 48;` (the canChangeStance twin).
There is **no `/6` division of `§1t4415s0§` anywhere in the web file**. 48/192 = **1/4** confirmed
independently. Take the web number.

### #13 build parity — HOLDS, verbatim on both sides
`StatsManager.as:1854-1861` caps at 300 and returns `1 - speed / 300 * 0.5`;
`§1t1523s0§.as:2289-2296` caps at 600 and returns `1 - param1 / 600 * 0.5`. Clean 2x divergence.

### #1 v0.717 strings are network-loaded — HOLDS
`§1t1521s0§.as:63-84` verbatim, including `_loc2_ = §1t3317s0§.instance.server + "strings/";` at :72
and the `Locale.addXMLPath(..., _loc2_ + "shs3_en.xml")` triple; duplicate path at `:91-95`.
I re-ran both greps: `find reference -iname "*shs3_en*"` → nothing;
`LC_ALL=C grep -c "Slaughter" reference/extracted/payload.xml` → 0; `"of Attack"` → 0.
The Android word lists are real and sit at `ItemGenerator.as:110-111` (`attack_pre` / `attack_suf`,
"of Slaughter" among them) — the claim's `:102-127` range is the whole 26-array block ✓.

### #20/#21/#22 elemental-DEF pools — HOLD, with a line correction
The four lines are at **`ItemGenerator.as:141-144`**, not `:142-145` (`:145` is CRITICALDMG):
```
141  this.preSufArray[FIREDEF][i]  = new PreSuf(wateratk_pre[num],wateratk_suf[num]);
142  this.preSufArray[WINDDEF][i]  = new PreSuf(earthatk_pre[num],earthatk_suf[num]);
143  this.preSufArray[WATERDEF][i] = new PreSuf(windatk_pre[num],windatk_suf[num]);
144  this.preSufArray[EARTHDEF][i] = new PreSuf(fireatk_pre[num],fireatk_suf[num]);
```
The mapping all three claims state is exactly what is there. It is a single 4-cycle with no fixed
point (fire←water←wind←earth←fire), which is a coherent "countered-by" wheel — #21's reading holds
up structurally. Intent ("deliberate, not a bug") remains an inference the AS3 cannot settle, but
the operative instruction — copy it verbatim, do not "fix" it — is the 1:1-safe call either way.

### #27/#28 min-damage floor — HOLD, with a line correction
`getMinDamage()` is at **`Damage.as:150-173`**; the cited `:149-170` clips the final
`return this.attackerlvl / 4 + this.piercingDamage;` (line 172). Quote otherwise verbatim.
Call site `MCSPlayer.as:3415-3418` verbatim, second site at `:3709-3712`, and
`grep -l damageObj.getMinDamage()` returns exactly **9 files** ✓. `EnemyPlayer.as:107-123` is the
same ladder keyed to `playerLVL` sizing `bossHP` ✓ — L3, not L1/L2.

### #47 nine-slot mapping — HOLDS, code and frame agree
`InventoryUI.as:461-535` verbatim: `for(i = 0; i < 9; i++)` with cases HAT/ARMOR/GLOVES/PANTS/MASK/
WEAPON/SHOES/ACCESSORY1→SLOT_RING1/ACCESSORY2→SLOT_RING2, EQ_NECK absent. Empty sentinels
(armor 4000/4001, pants 11001, else 0) verified at `:474`, `:490`, `:534`. My paperdoll crop shows
exactly nine boxes and no neck box.

---

## D. NEW FINDINGS (nobody has claimed these)

1. **N1 — all five resource blobs decrypt** (table above). Key = `filename.charCodeAt(1)`, then
   `decryptByteArray`'s bytes-3..255 + `i%11` swap, then inflate from offset 8.
2. **N2 — `115_Mobile_SHS3Resource.bin` is the art payload**: 1,912 SymbolClass names including
   112 `item####`, 8 `acc####`, 109 `weapon####` (incl. `weapon13002`, the frame's Branch), 79
   `skill####`, the full human part families and five creature rigs. Overturns the ledger's
   "item **icon manifest**" half of blocker ⑤ and every "exists in no held artifact" line.
3. **N3 — a second inert band hole:** `ShopItem.as:190` routes weapons on `< 13500 && > 12999`, so
   ids 13500-13999 fall to `trace("ShopItem: out of range")`. Measured: **0** such rows (all 177
   weapons are 13000-13499), so it is inert — same class as the `.` baseprice bug.
4. **N4 — the ErrorValue count is 21/12, not 19/11:** id 82 (`Item.USESMODID`) has no case in
   `XMLItem.as:233-296` either, so its 2 rows hit `trace("ErrorValue")` alongside the other 19.
5. **N5 — the Android build does have a per-item level in the inventory**, just not as a panel
   field: `InventoryUI.as:1161 if(this.selectedSlotItem.getLevel() > StatsManager.getLevel())`
   blocks the equip. Bounds the LEVEL-caption question: what is missing is the *caption*, not the
   concept.

---

## E. TALLY

| verdict | ids |
|---|---|
| survive (42) | 0,1,2,3,4,5,6,7,9,10,11,12,13,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,41,42,43,46,47 |
| REFUTED (6) | 8 (material), 14 (fatal cite), 15 (material), 40 (material), 44 (minor), 45 (material) |

judged 48 / packet 48 / skipped 0.
