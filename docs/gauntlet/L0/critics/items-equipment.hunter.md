# L0 CRITIC — items-equipment — HUNTER LENS

Blind review. I did not see the surveyor's reasoning, only its output. Every verdict
below carries an artifact **I** opened. Frames were cropped and upscaled by me before
grading (crops stated inline).

**Headline:** the survey is unusually solid on A2 transcription — I re-derived 14 of its
17 claims byte-for-byte and found the quotes verbatim. It fails in exactly the direction
this lane exists to catch: **it under-claims the string table.** Item names are *not*
unheld. I resolved 22/22 modifier labels, all 11 procedural colour names, all 6 condition
tier names, all 6 elemental/crit/piercing stat labels and a contiguous ~52-entry English
item-name block that includes the literal `Iron Sword` its own frame cite shows on screen.

Second failure: it declares the compositing **z-order** unheld ("lives in the SWF
timeline"). It is in ActionScript, ten lines below the enum it already quoted.

---

## Score

Surveyor: **84**. My read: **88**, on the strength of the two refutations below
(z-order closed, string table half-open) minus a small deduction for
`modifier-id-semantics` being presented as complete when a third of the ids in
`itemdata.xml` are outside its map.

---

## R1 — REFUTED (material): the paperdoll z-order IS in ActionScript

**Claim:** `items-equipment/compositing-part-order` — *"only the numeric z-order stack is
not [held], because it lives in the SWF timeline rather than in ActionScript."*

**My artifact:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:119-146`

```as3
internal var partListLength:int = 22;
...
public function MCSCharacter()
{
   var mc:MovieClip = null;
   this.partList = new Vector.<MovieClip>();
   super();
   for(var i:int = 0; i <= this.partListLength; i++)
   {
      mc = new MovieClip();
      addChild(mc);              // line 144
      this.partList.push(mc);    // line 145
   }
```

`addChild` appends to the **top** of the display list. The loop creates parts in index
order 0…22 and adds each one immediately, so **display depth == partList index == the
`PART_*` constant the surveyor already transcribed.** The stack is, back to front:

```
0 l_hand · 1 l_uparm · 2 l_lowarm · 3 weapon · 4 prop · 5 l_foot · 6 l_thigh · 7 l_calf
8 crotch · 9 r_foot · 10 r_thigh · 11 r_calf · 12 neck · 13 stomach · 14 pelvic
15 torso · 16 head · 17 hat · 18 r_hand · 19 r_uparm · 20 r_lowarm · 21 prop2 · 22 prop3
```

Blocker ⑤'s "layer order" half is **CLOSED**, not open. Two corrections that ride along:

- **The human rig is 23 parts, not 27.** `partListLength = 22` ⇒ indices 0–22 only.
  `PART_l_shoulder(23) r_shoulder(24) l_knee(25) r_knee(26)` are never allocated by
  `MCSCharacter`; they belong to the **wolf** rig — `MCSWolf.as:13 partListLength = 25`,
  used at `MCSWolf.as:184-197` as `r_frontleg1 / l_frontleg1 / r_backleg2 / l_backleg2`.
  No rig is 27 parts.
- **One documented depth exception:** `MCSBust.as:104`
  `addChild(this.partList[MCSCharacter.PART_r_uparm]);` — the bust portrait re-adds the
  right upper arm to lift it to the front. Reproduce that or portraits will be wrong.

Sub-verdict on within-part depth (also in AS3, also not in the timeline):
`MCSCharacter.as:682-683` `head.setChildIndex(componentObject,0)`;
`:705-706` hatHair → index 2; `:723-724` hair → index 3; `:754-755` headMask → index 1;
`:872-873` / `:884-885` calf art → index 0.

---

## R2 — REFUTED (fatal to the claim's negative half): item names are PARTLY HELD

**Claim:** `items-equipment/string-table-partial` — *"every item name id (4000+) sits
above that slice, so item names remain unheld"* / lane_impact *"Item names stay
STILL_UNHELD."*

The claim contradicts itself inside its own quote block: it writes *"itemdata `<name>`
ids run 34-4427"* and then asserts *"every item name id (4000+)"*. 34 is not 4000+.

**My artifact:** char-id 118 of `reference/decrypted/shs3_android_payload_decoded.swf`,
extracted myself (`DefineBinaryData` tag 87, 500,024 B, UTF-16LE XLIFF, 2,555 units,
ids 0–2554 contiguous — the surveyor's count is exact).

### 2a. The negative test was a false negative

The survey grepped `Katana|Wakizashi|Tanto|Nodachi` → 0 and concluded names were absent.
This game does not use Japanese weapon names. Trans-unit ids **960–1011 are a contiguous
block of item names**:

```
960 Torn Garment   961 Rags            962 Monk Garment  963 Heavy Gloves
964 Ninja Gloves   965 Straw Hat       966 Helmet        967 Hat
968 Hood           969 Top Hat         970 Afro Wig      971 Mask
972 Pants          973 Heavy Armor Pants  974 Torn Pants 975 Ninja Pants
976 Shorts         977 Sandals         978 Shoes         979 Boots
980 Stick          981 Branch          982 Bamboo        983 Flute
984 Spoon          985 Fork            986 Bat           987 Stick with nail
988 Katar          989 Training Sword  990 Iron Sword    991 Iron Sabre
992 Dragon Blade   993 Thunder Blade   994 Bevel Edge    995 Defender
996 Heavy Armor    997 Cleaver         998 Potion        999 Scroll
1000 Amulet ... 1005 Broken Sandal ... 1011 Daruma Doll
```

`990 = "Iron Sword"` is the **exact base name in the survey's own A1 cite**
(`frame_0024.jpg`, "DRAFTY SHARP **IRON SWORD** OF PIERCING"). The surveyor held a frame
proving the name is real and a table containing it, and reported the names as unheld.

### 2b. 74 of 804 `<name>` rows resolve *today*, with correct semantics

Resolved `reference/extracted/itemdata.xml` `<name>` ids against the table:

| item ids | name id | resolves to |
|---|---|---|
| 6000–6520 (all 73 HAIR items, type 2) | 34 | `Hair` |
| 2122/2123/2124 and 20100/20101/20102 | 443/444/445 | `(八段)` `(九段)` `(十段)` — Dan 8/9/10 |
| 2122–2124, 2148 (`<desc>`) | 207 | `Quest Item` |

Not noise — every hit is semantically correct for its item band.

### 2c. The table is the RIGHT table with a ~−19/−20 revision drift above id ≈350

This is why the survey's spot-checks looked like misses. Below ~id 210 the AS3 ids and the
table agree **exactly**; above ~350 the embedded table is an earlier revision, short by
19–20 entries. Proof, three independent bands:

- **Colour names.** `ItemGenerator.as:93` builds `colorNameList` from
  `getString(432…442)` (11 entries) and `:701` pairs it with
  `colorhexlist = [16711680, 16737792, 16763904, 39168, 13311, 6684927, 16751103, 6697728, 16777215, 10066329, 0]`.
  Table ids **413–423** are `Red Orange Yellow Green Blue Purple Pink Brown White Grey Black`
  — 11 for 11, and each matches its hex (16711680 = 0xFF0000 Red … 0 = Black). Offset −19.
- **Condition tiers.** `Item.getDesc` (`Item.as:712-745`) uses 387/388/389/390/391/392.
  Table **368–373**: `Condition: Broken`, `Condition: Poor`, `Condition: Used`,
  `Condition: Usable`, `Condition: Good`, `Condition: Well-Maintained`. Offset −19.
  The ledger's unnumbered *"condition tier names"* Ready bullet is now **verbatim**.
- **Elemental/crit/piercing labels.** `Item.as:1238-1268` uses 871–876. Table **851–856**:
  `Fire DEF`, `Wind DEF`, `Water DEF`, `Earth DEF`, `Critical Damage`, `Piercing Damage`.
  Offset −20. These are the exact strings my `frame_0031` crop shows on screen.

### 2d. "a third of it is decoded" is wrong

`reference/decompiled/shs3_payload/scripts/§1t123s0§.as:900` (the survey's own cite)
calls `§1t1521s0§.getString(11253)`. The full space is ≥11,257 entries, so 2,555 is
**≤23%**, not a third.

**Correct verdict for L1b:** item names are **PARTIAL**, not STILL_UNHELD. Held: the
English item-name vocabulary, the modifier labels, the condition tiers, the colour names,
74 exact id→name bindings. Unheld: the id→name binding for the ~730 `<name>` rows whose
ids land in the drifted/absent upper band.

---

## R3 — REFUTED (material): the modifier enum is NOT decoded end-to-end

**Claim:** `items-equipment/modifier-id-semantics` — *"The item modifier enum is now
**fully decoded end-to-end**: ids 0-16 map to named player stats, and ids 101-1999 are
equipment SET bonuses."*

The 0–16 half is **exactly right** — I resolved all 22 label ids against char-id 118 and
got 22/22 (`110 HP · 111 Max HP · 112 HP Regen · 113 Chi · 114 Max Chi · 115 Chi Regen ·
116 Attack · 117 Defense · 118 Speed · 119 XP · 120 "Level " · 63 Coins · 64 Gold ·
102 AP · 121 Max AP · 59 Duel Tokens · 122 Max Duel Tokens · 123 Set · 124 Level Required ·
125 Stance Restriction · 108 Dmg · 109 Def`, plus `139 Weight`, `199 Eq`). But "fully" and
"end-to-end" are false on two counts.

**(a) `XMLItem.as:231-298` is not the end-to-end enum — `Item.as:1148-1272` is.** It adds:

```as3
case 28: LangManager.getString(507)   case 29: (508)   case 30: (509)   case 31: (510)
case StatsManager.STAT_FIREDEF:  (871)   // = 200
case StatsManager.STAT_WINDDEF:  (872)   // = 201
case StatsManager.STAT_WATERDEF: (873)   // = 202
case StatsManager.STAT_EARTHDEF: (874)   // = 203
case StatsManager.STAT_CRITICALDMG: (875) // = 204
case StatsManager.STAT_PIERCINGDMG: (876) // = 205
case 82: case 78: case 79:  break;        // present, deliberately rendered as nothing
```
plus `case 102` (node-name code), `case 103 / 106` (nested item displayname), `case 25`.
Ids 28–31 and 200–205 are exactly the affixes `ItemGenerator` rolls — so the enum the
survey published cannot express any generated elemental/crit/piercing item.

**(b) `itemdata.xml` itself carries 12 distinct ids outside the published map.** Parsing
all 412 `<modifier>` blocks (34 distinct ids, 319 `<value>` rows — both counts correct):

```
in-map : 0,1,2,3,5,6,7,8,9,12,13,15, 101,102,103,104,105,106,117,122,123,124
OUT    : 25, 38, 78, 79, 82, 84, 90, 96, 97, 98, 99, 40000
```
Those 12 fall into `XMLItem`'s `trace("ErrorValue: ...")` branch. `25` is
`StatsManager.STAT_DAN`, `38` is `STAT_BUFFTYPE`; `83` (which the survey *quoted* in
`isBroken()`) is a live max-durability bonus and is likewise absent from its map.

---

## R4 — REFUTED (material): "of Piercing" is not weapon-only

**Claim:** `items-equipment/name-template-frame-confirmed` — *"suf(mod1)='of Piercing'=
piercingdmg_suf (index 16, **allowed ONLY by the WEAPON mask**)"*, and therefore the frame
*"validates … the weapon slot mask"*.

**My artifact:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:397-425`.
Index 16 (`PIERCINGDMG`) is `1` in **three** of the eight masks:

```
WEAPON    [1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,1,1]   <- idx16 = 1
ARMOR     [1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1]   <- idx16 = 1
ACCESSORY [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1]   <- idx16 = 1
GLOVES/PANTS/SHOES/HAT/MASK  ................0   <- idx16 = 0
```

So a "of Piercing" suffix does **not** identify the slot, and a porter reading this claim
would wrongly gate PIERCING to weapons only.

**What survives, and it is strong.** I re-derived the decomposition myself and it is
exact. `ItemGenerator.as:742-745`, case 3:

```as3
itemName = drawPreSufValue(getModifierByIndex(2),true) + " "
         + drawPreSufValue(getModifierByIndex(0),true) + " " + basename + " "
         + drawPreSufValue(getModifierByIndex(1),false);
```
and my own crop of `reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0024.jpg`
(1024×576, crop (0,420)-(640,500), 3× LANCZOS) reads
`I AM LOOKING FOR` (white) + `DRAFTY SHARP IRON SWORD OF PIERCING` (blue) + ` .` —
pre(mod2)=`Drafty`, pre(mod0)=`Sharp`, base=`Iron Sword`, suf(mod1)=`of Piercing`,
3 modifiers ⇒ the `modifierCount>=3` blue branch. Confirmed.

The mask evidence the frame *does* carry is the **other** prefix: `Drafty` =
`windatk_pre[0]` = `WINDATK` (index 8), which is `1` only on WEAPON / GLOVES / SHOES /
MASK / ACCESSORY and `0` on ARMOR / PANTS / HAT. Use that, not piercing.

---

## Upheld, re-derived first-hand

| claim | my artifact | note |
|---|---|---|
| `paperdoll-13-slots` | `StatsManager.as:108` (`Vector.<Item>(13)`), `:262`–`:286` (EQ_ARMOR 0 … EQ_ACCESSORY2 12) | exact. Ledger `REBUILD_READINESS.md:209` "9-slot paperdoll" is overturned. `findWeight` excludes EQ_HEAD/EQ_NECK/EQ_SCABBARD — the likely source of "9". |
| `type-is-slot-index` | parsed all 982 `<item>` blocks; `Item.as:841-845` | routing map correct. **Correction:** the 152 armor rows and item 7075 carry **no `<type>` tag at all**; type 0 is `XMLItem.as:76`'s default. And there are **two** authoring anomalies, not one: 7075 is an empty stub `<item><id>7075</id></item>`, and **2211** sits in the 2xxx consumable band with `<type>12</type>`. |
| `affix-suffix-pool` | `ItemGenerator.as:102-148` | 17 stats × 8 tiers, prefixes **and** suffixes, verbatim. Opposing-element borrowing confirmed exactly: FIREDEF←wateratk, WINDDEF←earthatk, WATERDEF←windatk, EARTHDEF←fireatk. |
| `affix-count-rule` | `ItemGenerator.as:205-248`, `:369-372` | dice tables exact; `if(isLegendaryItem && numEnchant > 2) numEnchant--;` exact. |
| `stat-vs-level-curve` | `ItemGenerator.as:150-183`, `:321-345`, `:392-452`, `:474-576` | all five progressions and the full routing verified (prog1 ATK/DEF, prog2 MAXHP/MAXCHI, prog3 = 8 elementals + both regens + CRITDMG, prog4 SPEED, prog5 PIERCING). `MAXINDEX = 79` ⇒ 80 tiers. **Omission:** only prog1/prog2/prog3 get `[MAXINDEX] += 10`; prog4 and prog5 do **not**. |
| `pot-mask-frame-confirmed` | my crop of `frame_0031.jpg`, 1024×576, crop (575,140)-(1015,420), 3× LANCZOS | I see it: green-bordered icon, green `PANTS`, `450` + coin, `OWNED: 0`, `LEVEL 4`, DEFENSE +1 (EQ 3), FIRE DEF +1 (EQ 0), WIND DEF +2 (EQ 0), EARTH DEF 0 (EQ 1), CRITICAL DAMAGE 0 (EQ 1), MAX CHI 0 (EQ 5), CHI REGEN 0 (EQ 2), WEIGHT 5. Consistent with the PANTS mask; **no forbidden stat appears**. **Caveat the survey missed:** `Item.as:898-899` builds the line set as `equippedItem.getModifierArray().concat(this.getModifierArray())` de-duplicated — it is a **union**, so the `0 (EQ: n)` lines describe the *equipped* pants. The frame cannot attribute a line to one item. |
| `condition-no-damage-multiplier` | `StatsManager.as:1863-1902`, `Item.as:1467-1479`, `:712-745` | exact. Damage is binary on `isBroken()`. **Two corrections:** `getDesc` has **seven** branches (the survey listed seven and wrote "SIX"), and `isBroken()` returns false outright when `durability == 0` — and `<durability>` is not an XML tag: `XMLItem.as:186` maps `<uses>` → durability, so the 867 items without a `<uses>` row **never break**. |
| `sell-price-formula` | `XMLItem.as:88` (`gvalue = xml.baseprice`), `XMLShopItem.as:31,68,86`, `ShopUI.as:58,257,393,536-540` | `grep -rn sellPercentage` over all 970 classes returns **only** the `ShopUI.as:58` declaration — confirmed by me. `onSell` → `StatsManager.changeGold(displayItem.getCost())`, no haircut. `if(!itemData.nodrop)` excludes nodrop from the sell list. **See N1 — I found frame corroboration.** |
| `art-manifest-rule` | `MCSCharacter.as:581-615`, `XMLItem.as:110-117`, `ls reference/extracted/sprites/` | naming rule exact; all 12 named sprite dirs exist. I re-tried the decode myself: char-ids 113/115/120/122/124 carry a `CWS` magic but garbage version bytes and declared uncompressed lengths of 1.7–1.9 **GB**; zlib fails at every offset. Not SWFs — the blocker is real. **Mis-cite:** the survey lists 19 partType prefixes and calls them 18; `grep -c '"neck"' MCSItem.as` = **0** — `"neck"` comes from `MCSCharacter.as:806,1071`. MCSItem enumerates 18. |
| `rarity-4-tiers-exact` | `Item.as:407-451` | all eight hex values verbatim; `<unique>` = 369 rows, exactly {1: 253, 2: 116}. **Correction:** the two palettes are not light-bg/dark-bg — the branch is `!inventoryUI.visible && (lootDialog.visible ‖ gotGiftDialog.visible)` ⇒ bright set, else the dark set. Loot popup vs everywhere else. |
| `weight-cap-is-not-flat-100` | `StatsManager.as:2298-2301`, `:1983-2026`; 745 `<weight>` rows, values {0,1,2,3,4,5,10,15,20,25,500} | exact. **See N2 — independent string-table corroboration.** |
| `soul-infusion-transfer-rule` | `CraftingUI.as:494-527` | verbatim. **Omission:** `:494` `designType = Math.floor(designSlot.itemID / 1000)` and `:496` `if(designType != statsType)` — both slots must be the same 1000-band, and 13 is the weapon band. |
| `weapon-slash-budget-and-reach` | `StatsManager.as:1915-1930`, `XMLItem.as:152-159`, `itemdata.xml:8742-8752` | reach formula exact; 210 asymptote at DAN 0 correct. Row 13113 quoted verbatim and correct. Distributions all confirmed by my own parse: `slashusage` 3 values (24×1, 72×70, 96×35) over 106; `stancerestriction` {6: 46, 4: 7} over 53; `uses` {100: 46, 80: 34, 60: 34, 50: 1} over 115. **Omission:** `getBaseSlashLength` multiplies SPEED by 1.5 under `BUFF_SPEED` before calling. |
| `premium-catalog-held` | char-id 121 extracted by me, 4,504 B | XML matches the quote exactly, including the commented-out `<special>` SKUs and the `<!-- Assassin outfit -->` / `<!-- Dark Assassin outfit -->` rotation sets. 304 `<heavenlyprice>` rows, values {0,1,2,3,5,8,12,25,100} — exact. |
| `no-items-config-still-true` | `ls src/config/` | 27 `.ts` files + `CLAUDE.md`; no `items.ts`, `equipment.ts` or `affixes.ts`. The A3 self-caveat ("a repo byte-check, NOT a vitest test") is honest and correct. |

---

## New findings (hunter lens)

**N1 — an A1 frame independently confirms the buy-value formula.** My `frame_0031` crop
shows `450` on the icon and `LEVEL 4` beneath it. `XMLShopItem.as:68/86`:
`this.value = itemData.gvalue + this.item.getLevel() * 100`; `XMLItem.as:88`
`this.gvalue = xml.baseprice`. **29 of the 11xxx PANTS rows in `itemdata.xml` carry
`<baseprice>50</baseprice>`.** 50 + 4×100 = **450**. Exact. This upgrades the buy half of
blocker ③ from A2-only to A2 + A1, and proves the frame's PANTS is a *generated* shop
rare (`XMLShopItem` also sets `item.uses = 1`, which is why it shows a condition band).

**N2 — the string table independently confirms `100 + rank×20` carry weight.**
Trans-units `1507 "Carrying Weight+"`, `1653 "Carrying weight: 120"`,
`1654 "Carrying weight: 140"`, and `138 "You are carrying too many things to travel.
Upgrade the Carrying Weight+ skill to carry more items."` — 120 and 140 are exactly
ranks 1 and 2 of `getCarryingWeight() = 100 + getStat(1009) * 20`. Two artifacts, one
number.

**N3 — the six condition tier names are now verbatim** (see R2c): `Condition: Broken`,
`Condition: Poor`, `Condition: Used`, `Condition: Usable`, `Condition: Good`,
`Condition: Well-Maintained`, plus `374` "Your weapon is broken! … Buy whet stones and
sword repair kits from peddlers to repair your weapon, or use ninja services to make your
weapon unbreakable and give it a name." — which independently sources the repair economy
and the ninja "unbreakable + named" service.

**N4 — the 11 procedural colour names are held and hex-matched** (see R2c).

---

## Frame-vs-doc conflicts

**None arose in this unit.** Both frames I opened agree with the AS3. Stating that
explicitly because the standing invariant requires it: had they disagreed, the frame
would have won.

---

## No files outside this path were modified.
