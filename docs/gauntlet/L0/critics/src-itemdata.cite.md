# CITE-LENS REVIEW — packet `src-itemdata.claims.json`

Critic: blind cite-lens critic (LENS 1). Packet size **38**. Judged **38**. Skipped **0**.
Every verdict below names an artifact **I opened myself**. Nothing here is quoted from the
surveyor's prose (`docs/gauntlet/L0/sources/itemdata.md` was NOT read, per §3.2).

Machine-audit intake: 35 `RESOLVES`, 3 `QUOTE_UNVERIFIED` (claims 14, 33, 36), 1 `UNCHECKABLE`
(claim 34, a legitimate STILL_UNHELD with no cite). **All three QUOTE_UNVERIFIED flags turned out
to be compression/ellipsis artefacts, not fabrications** — I located every quoted string in the
cited file. Details in their rows.

**Headline: 7 of 38 refuted.** One is material and load-bearing (`slashusage-is-a-reload-economy`);
one is material and actionable (`repair-weapon-cost`); five are false universals sitting on top of
measurements that are themselves exactly right.

---

## REFUTED (7)

### R1 — `itemdata/slashusage-is-a-reload-economy` — **MATERIAL**
The claim states *"the bar's max is 48 + SPEED\*6"*. That is wrong in **both** shipped builds.

- `reference/decompiled/shs3_android/scripts/MCSPlayer.as:182` — `initPlayer(... baseReload:int ...)`
- `reference/decompiled/shs3_android/scripts/MCSPlayer.as:190` — `this.baseReload = baseReload;`
- `reference/decompiled/shs3_android/scripts/MCSPlayer.as:239` — `this.maxreload = 5 * 24;`  ← **inside the
  same `initPlayer`, after :190.** The bar max is the hard constant **120**.
- `grep -rn "baseReload" reference/decompiled/shs3_android/scripts/` returns FOUR lines only:
  `MCSPlayer.as:105` (decl, default 48), `:182` (param), `:190` (assignment), `EnemyClone.as:49`
  (copy). **Zero readers.** `StatsManager.getBaseReload()` (`StatsManager.as:1839-1842`,
  `return 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6;`) is computed,
  passed, stored and never used.
- Same dead-value pattern in the web build: `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:103`
  (decl `= 48`), `:191` (assignment), and `grep -rn "§1t4419s0§"` across the whole payload returns
  only those two plus one copy in `§1t4904s0§.as:49`. No reader.
- The web max is **different**: `§1t99s0§.as:249` — `this.§1t4415s0§ = 8 * 24;` = **192**.

Also `"its floor is 24"` is a **display** baseline, not a floor on the value: the value floors at 0
(`MCSPlayer.as:3259-3261`), while 24 is subtracted only for the bar readout
(`MCSPlayer.as:1163-1168` and `:3272 updateReload((this.reload - 24) / (this.maxreload - 24))`).

**What survives, fully verified:** the stance multipliers (`MCSPlayer.as:3246-3258`, light ×0.5,
balanced/reversed ×1, heavy/dual ×1.5), the `XMLItem.as:152-159` default of 48, and the weight
cross-tab — I reproduced it exactly: weight-absent→tag absent ×19, weight 1→absent ×9,
weight 5→absent ×43 + one row writing 24, weight 10→72 ×70, weight 15→96 ×35, total 177 type-9 rows.

### R2 — `itemdata/repair-weapon-cost` — **MATERIAL**
*"both stocked by every shop by default"* is false. `XMLShopData.as:46` is inside
`initPeddlerItems` (`:41`), which sets `this.npcID = 104;` (`:44`). The other four initialisers
carry different lists:
- `:63 initInnItems` (npcID 148) → `:68 defaultItems = [2103,2104,2105,2216,2106,2107,2108]`
- `:84 initMerchantItems` (npcID 52) → `:89 defaultItems = []` (empty)
- `:98 initPremiumItems` → `QuestEngine.premiumDefaultList`
- `:137 initBarberItems` (npcID 52) → a 49-entry hair/head list

2119 and 2120 appear in **one** shop list, the Peddler's.
**Survives:** `itemdata.xml:294-304` (2119, baseprice 20, modifier 82 value 10) and `:306-317`
(2120, baseprice 40, modifier 82 value 25) are verbatim correct, as is
`InventoryUI.as:992 else if(modid == 82)` and the resolved names Whet Stone / Sword Repair Kit.

### R3 — `itemdata/type-is-the-slot-enum` — minor
The 13-bucket partition is **exactly right** — I re-derived all of it from
`reference/extracted/itemdata.xml`: absent 153 (4000-7075), 1→35 (5000-5034), 2→73 (6000-6520),
3→97 (7000-7097), 4→38 (8000-8509), 5→60 (9000-9059), 6→14 (10000-10013), 7→93 (11000-11514),
8→55 (12000-12054), 9→177 (13000-13232), 10→98 (2000-2503), 11→9 (3000-3008), 12→80 (2211-20111);
sums to 982. `XMLItem.as:70-77` (missing type → 0) is verbatim.

But *"the 12 `<type>` codes are the equipment-slot enum verbatim"* fails for **2 of 12**:
`StatsManager.as:282` `EQ_SCABBARD = 10` vs type 10 = consumables, and `StatsManager.as:286`
`EQ_ACCESSORY2 = 12` vs type 12 = quest/misc. The scabbard item **13100 'Iron Sword' is type 9**,
so there is no scabbard type at all. The mapping is verbatim for 1-9 and 11 only.

### R4 — `itemdata/paperdoll-9-boxes-13-indices` — minor
I cropped `reference/frames/s21_weapon/t708.0.png` at (170,240)-(870,1045) myself: **exactly nine
boxes**, five filled (straw hat, grey robe, white hakama, pickaxe, sandals) and four ghosted (mask,
gloves, ring, ring). `StatsManager.as:1943-1945` is verbatim —
`for(var q:* = 0; q < 13; q++) { if(q != EQ_HEAD && q != EQ_NECK && q != EQ_SCABBARD && q != EQ_HAIR && ...`.

Refuted on: *"two of the nine boxes are ring/accessory slots that the named AS3 enum does not
cover."* They are named — `StatsManager.as:284 EQ_ACCESSORY1:int = 11` and `:286 EQ_ACCESSORY2:int = 12`.
The nine boxes are precisely the nine indices the loop does **not** skip:
**{0 ARMOR, 1 GLOVES, 3 HAT, 5 MASK, 7 PANTS, 8 SHOES, 9 WEAPON, 11 ACCESSORY1, 12 ACCESSORY2}**.
Secondary: in the crop the back-slung object is not separable from the equipped Pickaxe, so
"a back-slung scabbard" is not a frame reading.

### R5 — `itemdata/gold-catalogue` — minor
Histogram exact (3G×191, 1G×59, 12G×39, 2G×6, 5G×5, 8G×1, 25G×1, 100G×1 = 303 non-zero of 304
`<heavenlyprice>` rows, first at `itemdata.xml:32`), named top-end items correct.
Refuted on *"Every one of these rows also carries `<baseprice>0</baseprice>` — Gold-only, not buyable
with coins."* Three exceptions: `itemdata.xml:2446` item **2212** (heavenlyprice 5) and
`itemdata.xml:5218` item **7049** (heavenlyprice 3) carry **no `<baseprice>` tag at all**, so
`XMLItem.as:92 this.gvalue = 1;` makes them buyable for 1 coin; and item 11037 carries `.`.

### R6 — `itemdata/art-is-only-for-sharing` — minor
The load-bearing measurement is **confirmed**: 146 `<art>` rows, **0** self-references — every one
points at a different item id. `itemdata.xml:326 <art>20041</art>` (item 2121 'Red Packet') verbatim.
Refuted on *"Items 2131-2174 … all carry `<art>2130</art>`"*: of the 41 `<art>` rows in that id
range, **38** carry 2130; the exceptions are 2144→2143, 2148→20007, 2171→2202.
Secondary: *"the icon manifest resolves for all 982 items with zero gaps"* is not checkable from
what we hold — `reference/decompiled/shs3_payload/scripts/` ships only 22 `part+id` symbol classes
(the fallback set), the rest of the art being inside the encrypted `assets.swf`.

### R7 — `itemdata/shipped-data-bugs` — minor
Both malformed strings are real and I read them: `itemdata.xml:6902 <baseprice>.</baseprice>`
(item 11037) and `npcdata.xml:31 <hair>…6015.6017,…</hair>` (355 occurrences), plus
`npcdata.xml:1644 <hair>6.5006501650265E+47</hair>` (which the claim describes but does not cite by line).
Refuted on the asserted consequence — *"…fail getDefinitionByName and silently fall back to part
art '0'"*. `MCSCharacter.as:574-579` — `internal function processString(xmlstring:String) : int
{ … return selectArray[int(Math.random() * selectArray.length)]; }` — the return is **coerced to
int**, so `"6015.6017"` becomes **6015**, a valid hair id inside the measured 6000-6520 range. It
does not fail; the real defect is that hair **6017 is unreachable** for those rows. And the
fallback target is `partType + "0"` (`MCSCharacter.as:606`) — there is no `hair0` class among the
shipped symbols, and the surrounding `catch(error:ReferenceError)` (`:609`) is itself evidence
that the first `getDefinitionByName` throws rather than returning falsy, so the part simply does
not render.

---

## HELD ON MY OWN RE-OPENING (31)

Grouped by what I did to check them.

### Frame claims — I cropped and looked
- **`frame-validates-the-payload` (A1).** `reference/frames/s21_weapon/t708.0.png`, item panel
  crop (1310,235)-(1780,320) ×3 and (1420,545)-(1780,600) ×3: reads **BRANCH**, **"DMG: 1 - 2
  (EQ: 1 - 3)"**, **"WEIGHT: 1"**, **"WEIGHT: 43 / 100"**. `itemdata.xml:7907` is `<id>13002</id>`
  with `<mindamage>1</mindamage><maxdamage>2</maxdamage><weight>1</weight>` — exact.
  `StatsManager.as:1830-1832` auto-equips 13002 — exact.
- **`android-string-table-matches-v0717-ui` (A1).** `t655.0.png` crop (1310,235)-(1780,500):
  **"CONDITION: WELL-MAINTAINED" / "USED FOR MINING." / "DMG: 1 - 3 (EQ: 1 - 2)" / "WEIGHT: 10"**,
  with **"PICKAXE"** in the panel header (above the surveyor's crop box, at y≈173 in a
  1280-wide render). `strings.json` 392/4244/4245 are 'Condition: Well-Maintained' / 'Pickaxe' /
  'Used for mining.'; `itemdata.xml:8146` is item 13022 with mindamage 1 / maxdamage 3 / weight 10.
  Case differs (the UI font renders caps); the strings themselves match.
- **`android-vs-web-constants-diverge` (A1).** Same frame, header: **COINS 122 / GOLD 3** on a
  character named **GUEST**. `StatsManager.as:706 setPlayerStats(STAT_HGOLD,0);` vs
  `§1t1523s0§.as:1024 §1t7357s0§(§1t9413s0§,3);` — both at the exact cited lines, and I confirmed
  §1t9413s0§ = HGOLD by aligning the 21-call init sequence position-for-position against the
  Android one. **Caveat:** the frame proves *current* gold is 3, not *starting* gold; it
  corroborates rather than settles. The code half is dispositive on its own.

### Byte-exact measurement claims — I re-derived every number
`coins-per-kill-is-1-or-5` (66 loot-bearing NPCs / 429 with none / min 0.50 / max 10.00 / **mean
1.7763**) · `unique-2-is-npc-only` (116/0-in-pool/109-on-doll, 253/5/50, 613/183/300 — all three
rows exact) · `loot-tables-held` (union of the pools = **188** of 982 = 19.1%, and all **ten**
arrays are element-for-element identical between `LootDialog.as` and `§1t6172s0§.as`) ·
`stat-vs-level-is-a-table` (158 dmg rows, 155 minlvl rows spanning -4..79, 371 defense rows 0..35,
13225 Steel Sabre 79/81/90, 4050 Zaku Samurai Armor def 35 = max) · `modifier-103-grants-items`
(103×223, 104×42, 105×40, 106×33; item 2130's five values 7034/4065/5008/11036/12018) ·
`stancerestriction-is-dead-data` (53 rows, 46×6 + 7×4, all type 9) · `baseprice-dot-data-bug`
(550 baseprice rows, exactly one non-numeric) · `no-items-config-still-true` (`ls src/config/`
reproduces the pasted output character-for-character; no `items.ts`).

### Code claims — I opened the file and read the lines
`adjacent-speed-formulas` · `affix-count-per-rarity` · `affix-magnitude-curve` (I recomputed the
caps from `MAXINDEX = 79` at `ItemGenerator.as:58`: prog1→90, prog2→146, prog3→37, prog4→53,
prog5→16 — all five match, and the prog→stat switch at `:492/:515/:545/:565` matches the claimed
assignment) · `affix-suffix-pool` (the fire→water→wind→earth→fire defence-word cycle is verbatim at
`:142-145`) · `buff-system-30min` (exactly six modifier-38 items, values 1/2/0/3/4/5, all
heavenlyprice 1) · `condition-has-no-damage-multiplier` (`grep getCondition()` → the declaration
plus **one** reader, the tooltip) · `consumable-effect-table` (the stat map is exact down to
string 120 = `'Level '` **with the trailing space**; all twelve action branches sit at the lines
named) · `dragon-dance-input` · `duel-token-economy` · `five-stances-and-stance-locked-weapons` ·
`guest-start-state` · `item-name-template` · `procedural-item-colour` (0 `pcolor`/`scolor` tags in
itemdata; colour vocabulary 432-442 = Red…Black) · `rebirth-gold-25-and-100` · `sell-price-formula`
(identical in both builds) · `sprite-compositing-contract` (27 PART_* constants in the exact order
claimed, `MCSCharacter.as:10-62`; `torso4000.as` really is a one-line
`[Embed(source="/_assets/assets.swf", symbol="symbol2647")]`) · `web-android-schema-parity` (all
eight named web defaults at their exact line ranges) · `xp-curve-l1-l98-held` · `xp-per-kill-formula`.

### The three QUOTE_UNVERIFIED flags — all cleared
- **14 `five-stances-…`**: `MCSPlayer.as:27-35` really does hold LIGHT=0, BALANCED=1, HEAVY=2,
  DUAL=3, REVERSED=4 on exactly those lines; the surveyor merely collapsed nine lines onto one.
- **33 `unique-2-is-npc-only`**: `NetworkManager.as:1981` is literally
  `if(itemXML == null || itemXML.unique != 0)`.
- **36 `xp-curve-l1-l98-held`**: `StatsManager.as:78` and `§1t1523s0§.as:364` each hold a 99-element
  array; I parsed both and they are **identical element-for-element**. `expArray[80] = 4,285,800`,
  last = 29,395,800, `levelCap = 80` at `:76`. And the v0.717 frame reads **"2098 / 2950"** with
  badge **3**, exactly as `expArray[2]=1450 <= 2098 < expArray[3]=2950` predicts.

### The one STILL_UNHELD — correct and well-founded
`v0717-affix-words`. Verified independently: `§1t1644s0§.as:108-140` reads the word arrays from
language ids **10029, 10037, … 10197** plus **10205-10208**; our string table's maximum numeric id
is **9010**; and `docs/gauntlet/L0/index/bindata.json` shows the web payload's 27 blobs are 20
`animdata`, 1 `survivalmodedata`, 1 GIF, 1 `obj`, 4 text — **no string table**. Refusing to claim
these words is the right answer.

---

## NEW FINDINGS (not in the packet)

**N1 — a THIRD android-vs-web tuning divergence, and a dead formula (A2).**
The reload/focus bar maximum is a hard constant that differs between builds:
`shs3_android/scripts/MCSPlayer.as:239 this.maxreload = 5 * 24;` (**120**) versus
`shs3_payload/scripts/§1t99s0§.as:249 this.§1t4415s0§ = 8 * 24;` (**192**). In both builds the
`baseReload` value handed in by `StatsManager.getBaseReload()` = `48 + SPEED*6` is stored and never
read (android: decl `:105`, param `:182`, assign `:190`, copy `EnemyClone.as:49`, no reader —
web: decl `§1t99s0§.as:103`, assign `:191`, copy `§1t4904s0§.as:49`, no reader). This both refutes
R1 above and adds a third instance to `android-vs-web-constants-diverge`.

**N2 — the complete named 9-slot map the L3/L8 lanes actually need (A2).**
`StatsManager.as:262-286` names all thirteen equipment indices including `EQ_ACCESSORY1 = 11` and
`EQ_ACCESSORY2 = 12`; `StatsManager.as:1943-1945` skips HEAD/NECK/SCABBARD/HAIR. The nine
stat-bearing, box-bearing slots are therefore **{0 ARMOR, 1 GLOVES, 3 HAT, 5 MASK, 7 PANTS,
8 SHOES, 9 WEAPON, 11 ACCESSORY1, 12 ACCESSORY2}** — and that set matches box-for-box what I see in
`reference/frames/s21_weapon/t708.0.png`.

**N3 — `ShopUI.as:58 sellPercentage:Number = 0.5` is dead (A2).**
`grep -rn "sellPercentage" reference/decompiled/shs3_android/scripts/` returns the declaration and
nothing else. Sell price is `getSellAmt()` alone (`Item.as:1582-1593`); a recreation must not apply
a further 0.5.

**N4 — two Gold items are coin-purchasable (A2).**
`itemdata.xml:2446` (2212) and `:5218` (7049) carry a `<heavenlyprice>` but no `<baseprice>`, and
`XMLItem.as:86-93` defaults `gvalue = 1` (`:92`). They are the only two premium items with a coin price.

**N5 — the `.`-baseprice bug is behaviourally inert (A2).**
Item 11037 also carries `<heavenlyprice>3</heavenlyprice>`, and every other Gold item carries
`<baseprice>0</baseprice>`; `int(".") = 0` therefore produces exactly the value the row was meant
to have. The "reproduce or deviate" decision the claim asks for has no observable stake.

---

## Standing-invariant note
No measurement-doc-versus-frame conflict arose in this packet. Every frame reading I took
(`t655.0.png`, `t708.0.png`) **agreed** with the extracted payload — DMG 1-2/1-3, WEIGHT 1/10,
XP 2098/2950, and GOLD 3 all match `itemdata.xml`, `expArray` and the web init respectively.
Where I did overturn something it was code-versus-code, not doc-versus-frame.
