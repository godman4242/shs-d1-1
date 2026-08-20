# HUNTER CRITIC — src-itemdata packet

Packet: `docs/gauntlet/L0/worklist/src-itemdata.claims.json` — 38 claims. **38 judged, 0 skipped.**
Source under review: `reference/extracted/itemdata.xml` (10,545 lines, 982 `<item>`).

Every verdict below rests on an artifact **I** opened. Frames were cropped and upscaled by me
(crop boxes stated). Counts were re-derived by me with a parser over the raw XML, not taken from
the surveyor.

## Headline

The packet is unusually well-cited: I checked ~70 line-number cites and the overwhelming majority
land **exactly** on the construct named (e.g. `ItemGenerator.as:432-449` is precisely the forced-first-affix
block; `XMLItem.as:86-93` is precisely the baseprice branch; `itemdata.xml:326` is precisely the
`<art>20041</art>` line). Roughly a dozen measured distributions reproduce **to the row**.

8 of 38 claims are refuted. Three are material:

1. **`adjacent-speed-formulas` — reach IS per-stance.** The claim's load-bearing caveat
   ("the reach formula carries NO stance term … the code is per-character not per-stance") is false.
2. **`slashusage-is-a-reload-economy` — the reload bar's max is NOT `48 + SPEED*6`.** That value is
   computed, passed in, stored, and then never read. The bar's max is a flat constant.
3. **`paperdoll-9-boxes-13-indices` — the "unnamed" slots 11 and 12 are named** `EQ_ACCESSORY1` /
   `EQ_ACCESSORY2`.

Five more are minor factual slips inside otherwise-solid claims (miscounts and one over-broad
"every shop"). Nothing in the packet is fabricated — I found no invented cite.

## Frame work I did myself

- `reference/frames/s21_weapon/t655.0.png` (1920x1080), crop **(1310,235)-(1780,500)** upscaled 3x LANCZOS.
  VISIBLY: `CONDITION: WELL-MAINTAINED` / `USED FOR MINING.` / `DMG: 1 - 3  (EQ: 1 - 2)` / `WEIGHT: 10`.
  Whole-frame view at 0.5x additionally shows the item title `PICKAXE`, `COINS 122`, `GOLD 3`,
  the level badge `3` with `2098 / 2950 EXPERIENCE POINTS`, `AVAILABLE STAT POINTS: 0`,
  `WEIGHT: 38 / 100`, and the character name `GUEST`.
- `reference/frames/s21_weapon/t708.0.png` (1920x1080), whole frame at 0.5x + crops.
  VISIBLY: item title `BRANCH`, `DMG: 1 - 2  (EQ: 1 - 3)`, `WEIGHT: 1`, `WEIGHT: 43 / 100`,
  and the paperdoll weapon box now holds a **pickaxe** (it held a branch at t655.0).
  I counted the paperdoll boxes myself: **exactly nine** — hat, mask / armor, gloves / pants, weapon /
  ring, shoes, ring. Hair, face and the back-slung scabbard are drawn on the body with no box.
- `reference/frames/session11/stance-reach/A_t121.667_BALANCED_lvl1_stroke239px_max.png` (1920x1080),
  viewed at 0.5x. VISIBLY: a single red slash ribbon from the straw-hatted GUEST across two enemies,
  `2 HIT COMBO`, HUD `10/10` HP and `10/10` Chi, three bottom-left bars.

**FRAME vs DOC:** no override was needed anywhere in this packet. Where I checked the frame against
the code (item damage, weight, XP, gold, slot count, reach budget) **they agree**, and I say so out loud.

## Verdicts

### REFUTED — material

**#0 `itemdata/adjacent-speed-formulas`** — the two quoted formulas are verbatim-correct
(`StatsManager.as:1915-1919`, `:1854-1861`; both open and read by me). The claim is refuted on its
qualifier. `MCSPlayer.setStance` (`reference/decompiled/shs3_android/scripts/MCSPlayer.as:3019-3094`)
turns `baseSlashLength` into the actual reach **per stance**:

```
:3030 LIGHT     slashLength = baseSlashLength * 1.5
:3041 BALANCED  slashLength = baseSlashLength * (1 + 0.5 * balancedMastery * 0.01)
:3052 HEAVY     slashLength = baseSlashLength * (0.5 + 0.5 * heavyMastery * 0.01)   // floor 100 at :3053-3055
:3067 REVERSED  slashLength = baseSlashLength * 1.5
:3078 DUAL      slashLength = baseSlashLength                                        // floor 100 at :3079-3081
:3094           InputManager.setMaxDistance(this.slashLength)
```

So the ledger blocker "reach cap in **px** per stance" is **closed**, not open — the opposite of what
the claim says. The claimed frame-vs-code conflict also evaporates once the units are fixed:
`StatsManager.as:80` — `public static var stageWidth:int = 800;` — so a 1920-px-wide frame is
**2.4 screen px per game px**. `getBaseSlashLengthVal(1)` with DAN 0 = `120 + floor(90*1/21)` = **124 game px**
= 297 screen px, and the frame's 239-px level-1 BALANCED stroke is **99.6 game px — inside the budget**.
The LIGHT frames in the same directory (`stroke553px_endtoend`) are ~2.3x the BALANCED strokes, which is
what the 1.5x LIGHT multiplier plus a higher SPEED stat predicts.

**#22 `itemdata/paperdoll-9-boxes-13-indices`** — the frame half is right (I counted nine boxes) and
`findBonusStat` (`StatsManager.as:1932-1945`) does loop `q < 13` skipping `EQ_HEAD`, `EQ_NECK`,
`EQ_SCABBARD`, `EQ_HAIR` = 9. Refuted on "two of the nine boxes are ring/accessory slots that the named
AS3 enum does not cover" / "only indices 0-10 are named":

```
StatsManager.as:284   internal static var EQ_ACCESSORY1:int = 11;
StatsManager.as:286   internal static var EQ_ACCESSORY2:int = 12;
StatsManager.as:736-737  equipment[EQ_ACCESSORY1] = new Item(0,1); equipment[EQ_ACCESSORY2] = new Item(0,1);
StatsManager.as:2184-2185 removeEquipment(EQ_ACCESSORY1); removeEquipment(EQ_ACCESSORY2);
```

All 13 indices are named. The two ring boxes are `EQ_ACCESSORY1` and `EQ_ACCESSORY2`.

**#28 `itemdata/slashusage-is-a-reload-economy`** — the stance multipliers and the weight cross-tab are
exact (I reproduced 19+9+43+1+70+35 = 177 type-9 rows to the row). Refuted on the bar's max and floor:

```
MCSPlayer.as:190   this.baseReload = baseReload;      // getBaseReload() = 48 + SPEED*6 lands here…
MCSPlayer.as:239   this.maxreload = 5 * 24;           // …and the bar's max is set to a flat 120
```
`grep -n "baseReload" MCSPlayer.as` returns declaration (:105), parameter (:182), assignment (:190) —
and **no read**. `maxreload` is likewise hardcoded in `EnemyClone.as:77`. The web v0.717 build uses a
different constant: `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249` — `this.§1t4415s0§ = 8 * 24;`
(=192). Neither build scales the bar with SPEED.
"Its floor is 24" is also wrong: `deductReloadBar` clamps at **0** (`:3259-3262`); 24 is a *display*
dead-zone in `updateReload((this.reload - 24) / (this.maxreload - 24))` (`:3272`, and `:1163-1168`
clamps the displayed value at 0).

### REFUTED — minor

**#16 `itemdata/gold-catalogue`** — 304 `<heavenlyprice>` rows, 303 non-zero, first at `:32`, and the
price histogram `3G x191 · 1G x59 · 12G x39 · 2G x6 · 5G x5 · 8G x1 · 25G x1 · 100G x1` all reproduce
**exactly**. Refuted on "all with baseprice 0" / "Every one of these rows also carries `<baseprice>0</baseprice>`":
three do not — `itemdata.xml:2444-2458` item **2212 'Clan Deed'** (5G) and `:5216-5226` item
**7049 'Invisible Hat'** (3G) carry **no `<baseprice>` tag at all**, which `XMLItem.as:90-92` defaults to
`gvalue = 1`, so both are coin-buyable for 1; and `:6902` item **11037 'Santa Pants'** (3G) carries
`<baseprice>.</baseprice>`.

**#20 `itemdata/modifier-103-grants-items`** — `InventoryUI.as:1005` exact, 223 id-103 grants exact,
item 2130's five values (7034, 4065, 5008, 11036, 12018) exact, id-104 on 42 rows and id-105 on 40 rows
exact. Refuted on two counts: id-103 sits on **40** items, not 42 (42 is the id-104 figure); and id 106
occurs **33 times across 19 items**, not "33 rows".

**#25 `itemdata/repair-weapon-cost`** — item blocks `:294-304` (2119 Whet Stone, 20 coins, mod 82 = 10)
and `:306-317` (2120 Sword Repair Kit, 40 coins, mod 82 = 25) exact; `InventoryUI.as:992` exact;
`XMLShopData.as:46` exact. Refuted on "both stocked by **every** shop by default": line 46 is inside
`initPeddlerItems`. `XMLShopData.as` has five shop initialisers — `:41` Peddler, `:63` Inn, `:84` Merchant,
`:98` Premium, `:137` Barber — and 2119/2120 appear only in the Peddler's list.

**#30 `itemdata/stancerestriction-is-dead-data`** — the conclusion holds: no equip gate and no combat gate
exists, and the only non-parse use is the Android tooltip. Refuted on the grep result:
`grep -rn "stancerestriction|stanceRestriction" reference/decompiled/` returns **16 hits across THREE files**,
not "six hits … the two XMLItem classes" — `shs3_android/scripts/XMLItem.as` (:38,160,162,166,321,327),
`shs3_android_payload/scripts/XMLItem.as` (same six), `shs3_payload/scripts/§1t104s0§.as` (:30,172,174,178).
Also 13208 is 'Defender', not a Sabre.

**#33 `itemdata/unique-2-is-npc-only`** — every measured number reproduces exactly: unique=2 n=116,
in any random/merchant pool **0**, on an NPC paperdoll **109**; unique=1 n=253 → 5 → 50; absent n=613 → 183 → 300.
`NetworkManager.as:1981` exact. Refuted on "every other gate tests only `== 1`": four gates test `unique == 0`
and therefore lump 2 with 1 exactly as the bank gate does — `InventoryUI.as:1322`, `Item.as:1556`,
`ShopUI.as:332`, `ShopUI.as:541`.

### HELD (30)

`#1 affix-count-per-rarity` · `#2 affix-magnitude-curve` · `#3 affix-suffix-pool` ·
`#4 android-string-table-matches-v0717-ui` · `#5 android-vs-web-constants-diverge` · `#6 art-is-only-for-sharing` ·
`#7 baseprice-dot-data-bug` · `#8 buff-system-30min` · `#9 coins-per-kill-is-1-or-5` ·
`#10 condition-has-no-damage-multiplier` · `#11 consumable-effect-table` · `#12 dragon-dance-input` ·
`#13 duel-token-economy` · `#14 five-stances-and-stance-locked-weapons` · `#15 frame-validates-the-payload` ·
`#17 guest-start-state` · `#18 item-name-template` · `#19 loot-tables-held` · `#21 no-items-config-still-true` ·
`#23 procedural-item-colour` · `#24 rebirth-gold-25-and-100` · `#26 sell-price-formula` ·
`#27 shipped-data-bugs` · `#29 sprite-compositing-contract` · `#31 stat-vs-level-is-a-table` ·
`#32 type-is-the-slot-enum` · `#34 v0717-affix-words (STILL_UNHELD upheld)` · `#35 web-android-schema-parity` ·
`#36 xp-curve-l1-l98-held` · `#37 xp-per-kill-formula`

Selected re-derivations that landed exactly: `MAXINDEX = 79` giving the five affix caps 90/146/37/53/16;
the 13-way `<type>` partition (153/35/73/97/38/60/14/93/55/177/98/9/80); the 115 `<uses>` rows with only
values 50/60/80/100; 155 `<minlvl>` rows spanning -4..79 and 371 `<defense>` rows spanning 0..35;
the union of the three random loot pools = **188 items = 19.1%** of the 982-item catalogue;
`expArray` **99 values, byte-identical** between `StatsManager.as:78` and `§1t1523s0§.as:364`, `expArray[80] = 4,285,800`;
and **all twelve** LootDialog arrays byte-identical between Android and web (I diffed all twelve, the claim only cited two).

### #34 — an honest STILL_UNHELD, upheld and strengthened

I hunted this one hard and it survives. All three of the claim's legs check out:
`§1t1644s0§.as:108-140` builds every affix word array from `getString` runs 10029, 10037, … 10197
(helper `§1t1657s0§` at `:227` pushes `getString(start … start+n)`), plus 10205-10208 for crit/piercing;
`strings.json` has max numeric id **9010** and nothing in 10000-10300; and none of the 27 web bindata
files is a string table. I add positive evidence the surveyor did not have — see NF-6 below.

## NEW FINDINGS (the silence)

Ten things in or adjacent to this source that **no claim in the packet mentions**.

**NF-1 · Per-stance reach table (closes a ledger blocker).**
`reference/decompiled/shs3_android/scripts/MCSPlayer.as:3019-3094` — `setStance` scales `baseSlashLength`
by stance: LIGHT x1.5 (`:3030`), BALANCED x(1 + 0.5·balancedMastery·0.01) (`:3041`),
HEAVY x(0.5 + 0.5·heavyMastery·0.01) with a hard floor of 100 (`:3052-3055`), REVERSED x1.5 (`:3067`),
DUAL x1 with the same floor of 100 (`:3078-3081`); the result is pushed to
`InputManager.setMaxDistance(this.slashLength)` at `:3094`. Note LIGHT carries **no** mastery term —
`lightMastery` is spent on damage instead. A2. Overturns the ledger's "reach cap in px per stance" blocker.

**NF-2 · Reload/Focus bar max is a flat constant, and it differs per build.**
Android v0.682 `MCSPlayer.as:239` — `this.maxreload = 5 * 24;` (=120, 5 s at 24 fps).
Web v0.717 `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249` — `this.§1t4415s0§ = 8 * 24;` (=192).
`getBaseReload()` (`StatsManager.as:1839-1842`, `48 + SPEED*6`) reaches `MCSPlayer.as:190` and is then
**never read**. A recreation that scales the meter with SPEED is modelling something the original does not do.
A2. Build divergence: **120 (android v0.682) vs 192 (web v0.717)**.

**NF-3 · A full reload bar is the crit, and stance mastery scales damage.**
`MCSPlayer.as:3198-3223` (`getDamage`): `baseDamage = minDamage + random()*damageRange`, then
LIGHT x(0.5 + 0.5·lightMastery·0.01), BALANCED x(1 + 0.5·balancedMastery·0.01),
HEAVY/DUAL/REVERSED x1.5; then **`if(this.reload == this.maxreload)`** return `maxDamage * 1.2 + STAT_CRITICALDMG`
(x1.5 in LIGHT). The packet treats the bar purely as a slash budget; it is also the crit condition.
A2. Feeds L-combat-core and the "no Critical meter" line in the session-11 memory.

**NF-4 · itemdata.xml ships a completely empty item row, and 178 of 982 items have no name.**
`reference/extracted/itemdata.xml:5449-5451`:
```
	<item>
		<id>7075</id>
	</item>
```
No type, no name, no price, no weight. It parses to type 0 = ARMOR (`XMLItem.as:70-77`), displayname `""`,
`gvalue = 1`, `art = 7075` — a nameless armour whose art id lives in the HAT range, so
`getMCSComponent` falls back to `torso0`. It is also the single 7xxx id inside the 153 type-absent rows the
packet labels "torso items". A further ~90 rows are stubs carrying only `<id>` (+ `<type>` or `<unique>`),
e.g. the `<item>` at `:2775` (4021), `:3165` (4070), and `:3457-3479` (4102-4107). Measured: **804 of 982 items carry `<name>`;
178 do not** (103 of those are `unique=2` NPC-wardrobe art, 75 are not). This is a **third** shipped data
bug beyond the two in `#27`. A2.

**NF-5 · The modifier dispatch has a three-way numeric fallback nobody decoded.**
`reference/decompiled/shs3_android/scripts/InventoryUI.as:1098-1109`:
```
else if(modid < 2000)      { StatsManager.changeStat(modid, value); }
else if(modid >= 30000)    { StatsManager.setStat(modid, value); }
else                       { StatsManager.changeItemQty(modid, value); }
```
So **any** id below 2000 is a stat delta (not just 0-16), ids >= 30000 are raw stat writes, and ids in
[2000, 30000) mean "give `value` of item #`modid`". itemdata exercises the third branch nowhere but
exercises the second once: `reference/extracted/itemdata.xml:2411-2429`, item **2210 'Reset Quests'**
carries `<modifier><id>117</id>` **and** `<modifier><id>40000</id>`. Engine actions 34, 96, 104, 105, 106,
117, 123, 124 are likewise undocumented in the packet (`InventoryUI.as:1009`, `:1013`, `:1020`, `:1025`,
`:1032`, `:1052`, `:1077`, `:1088`). A2.

**NF-6 · Positive proof the v0.717 affix words are gone: the web build loads language data over the network.**
`reference/decompiled/shs3_payload/scripts/§1t1521s0§.as:63-84` — `setLanguage` sets
`var _loc2_:String = "./data/";` (or `§1t3317s0§.instance.server + "strings/"`) and then
`Locale.addXMLPath(§1t9271s0§, _loc2_ + "shs3_en.xml")` / `Locale.loadLanguageXML(...)`.
v0.717 never embeds its string table; it fetches `shs3_en.xml` from the dead server. `find reference -iname "*shs3_en*"`
returns nothing, and `LC_ALL=C grep -c "Slaughter"` / `"of Attack"` over the 329 MB `reference/extracted/payload.xml`
both return **0**. This upgrades `#34` from an absence argument to a mechanism. A2. STILL_UNHELD, correctly.

**NF-7 · `sellPercentage = 0.5` is dead data — do not apply it.**
`reference/decompiled/shs3_android/scripts/ShopUI.as:58` declares it and
`grep -n "sellPercentage" reference/decompiled/shs3_android/scripts/*.as` returns **only that line**.
`ShopUI.as:401` calls `slot.getItem().getSellAmt()` with no multiplier. Claim `#26` cites `:58` without
saying it is unreferenced, which invites a 50% haircut the original never applies. A2.

**NF-8 · The weapon damage table is NOT monotonic in level.**
`#31` is right that the stat-vs-level curve is tabulated, but a recreation that fits a curve to it will be
wrong. The catalogue maximum damage is **item 13179 'Steel Sword' at `itemdata.xml:9591`, minlvl 65,
maxdamage 108** — higher than the only minlvl-79 row, item 13225 'Steel Sabre' (`:9925`, 81-90). A2.

**NF-9 · NPC `<loot><id>` carries raw item ids as well as the 0-3 enum.**
`#9` decodes 0/1/2/3 correctly but stops there. Measured over all 495 `<npc>` rows the loot-id histogram is
`0 x77 · 3 x28 · 2 x10 · 1 x10 · 2113 x2 · 2112 x2 · 2114 x1 · 20028 x1` — six rows fall through to
`NPC.as:854-856`'s `else { addLootItemBasic(lootType, qty); }`, i.e. "drop item #lootType". Also
`"6015.6017"` (the malformed `<hair>` run `#27` flags) is not a one-off: it recurs in **355 of the 495**
`<mcs>` blocks. A2.

**NF-10 · The in-combat stance gate differs between builds.**
Android `MCSPlayer.as:2977` — `if(this.reload < this.maxreload / 6) return;` i.e. 20 of 120 = **1/6 of the bar**.
Web v0.717 gates the same action on Focus >= 48 of 192 = **1/4 of the bar**. Anyone porting the
"CANNOT CHANGE STANCE" threshold must take the web number. A2. Build divergence.
