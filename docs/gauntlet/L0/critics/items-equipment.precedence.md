# CRITIC — items-equipment · LENS 3 (PRECEDENCE / stale-claiming)

Blind review. I did not see the surveyor's reasoning. Every verdict below cites an
artifact **I** opened. Where a measurement doc and a frame disagreed, I say so.

**Headline:** the survey is unusually well-grounded — its A2 quotes are verbatim and
its arithmetic against `itemdata.xml` is exact (I re-derived 412 modifier blocks / 34
distinct ids / 319 value rows, 745 weight rows 0–500, 369 `<unique>` rows split
253×1 + 116×2, 304 `<heavenlyprice>` over exactly {0,1,2,3,5,8,12,25,100},
slashusage {24,72,96}×106, stancerestriction {4,6}×53, uses {50,60,80,100}×115 —
all match). **But three claims are wrong, two of them fatally**, and in each case the
answer was in a file the surveyor already had open:

1. **Blocker ③ (sell price) is answered wrong.** `Item.as:1582` `getSellAmt()` is the
   real formula. The survey's `gvalue + level*100` is the *buy* value of generated
   shop stock and cannot produce the 5c the video ledger measured.
2. **The string table is cracked, not "partial".** A constant offset of **−3060**
   resolves **730/804** item `<name>` ids and **174/178** `<desc>` ids against the
   already-extracted table. `frame_0024`'s visible "IRON SWORD" *is* item 13113's
   `<name>4050`.
3. **The "reach cap in px" find is stale-claiming.** `src/config/reach.ts` has carried
   that exact formula since commit `b1a49b6` (2026-07-26, SESSION13 A0.5).

---

## Verdict table

| # | claim | verdict | severity |
|---|---|---|---|
| 1 | paperdoll-13-slots | **stands** | — |
| 2 | type-is-slot-index | **refuted** | material |
| 3 | affix-suffix-pool | **stands** | — |
| 4 | affix-count-rule | **stands** | — |
| 5 | stat-vs-level-curve | **stands** | — |
| 6 | pot-mask-frame-confirmed | **refuted** | minor |
| 7 | condition-no-damage-multiplier | **stands (strengthened)** | — |
| 8 | sell-price-formula | **refuted** | **fatal** |
| 9 | art-manifest-rule | **stands** | — |
| 10 | compositing-part-order | **stands** | — |
| 11 | rarity-4-tiers-exact | **stands** | — |
| 12 | name-template-frame-confirmed | **refuted** | minor |
| 13 | weight-cap-is-not-flat-100 | **stands** | — |
| 14 | soul-infusion-transfer-rule | **stands** | — |
| 15 | string-table-partial | **refuted** | **fatal** |
| 16 | modifier-id-semantics | **refuted** | material |
| 17 | weapon-slash-budget-and-reach | **refuted** | material |
| 18 | premium-catalog-held | **stands** | — |
| 19 | no-items-config-still-true | **stands** | — |

---

## FATAL 1 — blocker ③ is fully closed, and the survey's answer is the wrong number

`reference/decompiled/shs3_android/scripts/ShopUI.as:401` (sell mode):

```
else { slot.setCost(slot.getItem().getSellAmt(), 0); }
```

`reference/decompiled/shs3_android/scripts/Item.as:1582-1593`:

```
public function getSellAmt() : int
{
   if(this.itemID < 3000)      { return 1; }
   if(this.getWeight() >= 10)  { return (1 + this.getModifierCount()) * 10; }
   return (1 + this.getModifierCount()) * 5;
}
```

Selling never touches `gvalue`, `value`, `getLevel()` or `sellPercentage`. It is a
two-branch step function of **weight** and **affix count**.

**Cross-validated against the video ledger** —
`docs/research/video-study/segments/B-09-castle-town-toll-gate-and-shop.md:77`:

> "Iron Sabre detail (SELL screen … t=19:10) — LEVEL 5, CONDITION: GOOD, DMG 6-16
> (EQ 8-21), **WEIGHT 5, sell price 5 coins**."

weight 5 < 10, 0 affixes → `(1+0)*5` = **5**. Exact. The survey's
`gvalue + getLevel()*100` gives ≥ 100 for that sword.

It also explains `REBUILD_READINESS.md:168` §3 #9 — *"same sword 5c and 25c"* —
`(1+0)*5 = 5`, `(1+4)*5 = 25`. **§3 #9 is itself half wrong:** it says price
"scales with rarity/**level**". Level is not in the formula; weight is.

The survey's stated open question ("whether the shipped web build applied the
declared-but-unreferenced 0.5 sell multiplier") is a phantom — `sellPercentage` is
dead code on *both* builds because the sell path never multiplies anything.

---

## FATAL 2 — item names are HELD; the string-table blocker falls for L3

`XMLItem.as:62-64` — `this.displayname = LangManager.getString(xml.name);` — so
`<name>` is a direct `getString` id.

I re-extracted char-id 118 from `reference/decrypted/shs3_android_payload_decoded.swf`
myself (2,555 `<trans-unit>`, ids 0–2554 contiguous — that part of the survey is
correct) and applied a **constant offset of −3060** to the item-name block:

```
item 13001  <name>4040 → 980 'Stick'
item 13002  <name>4041 → 981 'Branch'
item 13010  <name>4049 → 989 'Training Sword'
item 13113  <name>4050 → 990 'Iron Sword'        ← see frame check below
item  7001  <name>4025 → 965 'Straw Hat'
item  7003  <name>4099 → 1039 'Bandana'
item  2000  <name>4058 → 998 'Potion'
item  5007  <name>4182 → 1122 'Leather Gloves'
item 13014  <name>4193 → 1133 'Zanpakuto'
item 13022  <name>4244 → 1184 'Pickaxe'   <desc>4245 → 1185 'Used for mining.'
item 13024  <name>4381 → 1321 'Whisper Sword'
item 13033  <name>4308 → 1248 'Warlord Scythe'
item  8000  <name>4170 → 1110 'Face'      <desc>4171 → 1111 'Change your face'

coverage: name 730/804 resolved · desc 174/178 resolved
```

The 74 that miss at −3060 are the sub-2555 ids, which resolve at **offset 0**
(`item 6000 <name>34 → 'Hair'`). So the survey's *"every item name id (4000+) sits
ABOVE that slice"* is false twice over: 74 sit inside it, and the other 730 are in the
table at a fixed displacement.

**A1 confirmation (I cropped and looked).**
`reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0024.jpg`, 1024×576, crop
(0,420)-(640,500), 3× lanczos → visibly *"I AM LOOKING FOR **DRAFTY SHARP IRON SWORD
OF PIERCING** ."* — and item 13113's `<name>4050` resolves to **'Iron Sword'**. Frame
and table agree independently.

**Honest caveat I am putting in writing:** the Android table is a *different build
revision* from the Android ActionScript. Provable — `Item.as:1020-1043` reads
`getString(871…876)` for the elemental labels, and only at **−20** does the table give
`'Fire DEF' / 'Wind DEF' / 'Water DEF' / 'Earth DEF' / 'Critical Damage' / 'Piercing
Damage'` in that exact order. Raw ids 871–876 give *place names*
('Construction Site', 'Riverside Town', …). Ids ≤ ~199 need no offset at all
(`110='HP'`, `123='Set'`, `139='Weight'`, `199='Eq'`). **So the table is piecewise
offset (0 / −20 / −3060) and every block must be anchored before use.** And
`docs/research/video-study/SYNTHESIS.md:186` records a condition label
**"WELL-MAINTAINED"** that the Android table does not contain — the web build's
wording differs, and where it does, **the frame wins**. Item names are held *as the
Android build worded them*; each one still deserves a frame check before shipping.

---

## FATAL 3 — the "reach cap in px" claim is stale-claiming (this is the LENS-3 hit)

Claim 17 says L5's blocker *"reach cap in px"* now "has an exact formula". It already
did. `src/config/reach.ts`, committed `b1a49b6 2026-07-26 "SESSION13 A0.5+A2+A3"`:

```
 *   base = 120 + floor( (90 + 5 × danRank) × SPD / (20 + SPD) )
 ...
 * values are CONTRACT-SRC (read out of the payload) and are in **WORLD px**
```

That is byte-for-byte the same formula as `StatsManager.getBaseSlashLengthVal`.
`REBUILD_READINESS.md` is dated 2026-07-20; `reach.ts` landed 2026-07-26. **The
ledger's blocker list is stale on this line and the survey imported it.** Worse,
`reach.ts` carries the *per-stance* layer (light ×1.4, balanced ×(1+0.02·m), heavy
×(0.5+0.04·m) floored at 100) that `getBaseSlashLengthVal` does **not** have — so the
Android function is a strict subset of what the repo already holds.

Sub-facts in claim 17 that I verified and that *do* stand: `<slashusage>` {24,72,96}
over 106 items, `<stancerestriction>` {4,6} over 53, `<uses>` {50,60,80,100} over 115,
and `itemdata.xml:8742-8752` for item 13113. One correction: `getSlashUsage()`
(`StatsManager.as:1921-1928`) clamps anything `< 48` to 48, so the single item with
`<slashusage>24</slashusage>` never charges 24 — only **48/72/96** are reachable.

---

## MATERIAL — claim 2: `<type>` is not the routing key; the **id band** is

`InventoryUI.as:1167` (`onEquip`):

```
var tempValue:int = Math.floor(itemID / 1000);
if(QuestEngine.getItemData(item.itemID).unique == 1) { switch(...type...) { case 11: tempValue = 3; case 0: tempValue = 4; ... } }
```

`<type>` is consulted **only** to remap `unique == 1` items back into the band space.
Routing is `id/1000`. `StatsManager.equipment[itemType]` at `Item.as:843` is the
*compare-tooltip* lookup, not the equip path.

Consequences the claim would encode wrongly:
- type **10** is consumables (98 items, band 2xxx) but slot 10 is `EQ_SCABBARD`;
  type **12** is quest items (79 items, band 20xxx) but slot 12 is `EQ_ACCESSORY2`.
  `Item.as:845` guards `if(itemType != 10 && itemType != 12)` precisely because they
  are not slots. 177 of 982 items would be mis-routed.
- the actual scabbard is `equipment[EQ_SCABBARD] = new Item(13100,1)`
  (`StatsManager.as:735`) — a **type 9** item in the weapon band, hard-wired to slot 10.
- accessories are one type (11) feeding two slots.

Also: my parse shows the 152 armor items and item 7075 **have no `<type>` tag at
all** (`grep -c '<type>0</type>'` = 0); type 0 is the parse default. And item 7075 is
an empty stub — `<item><id>7075</id></item>`, nothing else — so calling it an
"authoring anomaly … carries type 0 (armor)" over-reads an absent tag. The band→count
map itself (152/35/73/97/38/60/14/93/55/177/98/9/79) I re-derived and it is exact.

---

## MATERIAL — claim 16: the modifier enum is **not** fully decoded

The 0–16 mapping is right — I resolved it myself from the extracted table:
`110 HP · 111 Max HP · 112 HP Regen · 113 Chi · 114 Max Chi · 115 Chi Regen ·
116 Attack · 117 Defense · 118 Speed · 119 XP · 120 'Level ' · 63 Coins · 64 Gold ·
102 AP · 121 Max AP · 59 Duel Tokens · 122 Max Duel Tokens · 123 Set ·
124 Level Required · 125 Stance Restriction · 108 Dmg · 109 Def · 139 Weight · 199 Eq`.

But *"fully decoded end-to-end … all 412 `<modifier>` blocks are now readable"* is
wrong. The 34 distinct ids actually present are
`0,1,2,3,5,6,7,8,9,12,13,15,25,38,78,79,82,84,90,96,97,98,99,101,102,103,104,105,106,117,122,123,124,40000`:

- **id 103 alone is 223 of the 412 blocks** and is *not* a set id.
  `Item.as:1047-1052` resolves 103/106 to `QuestEngine.getItemData(value).displayname`
  — a **set-member item reference**. Rendering it as `"Set: 103"` per the claim's rule
  would be visibly wrong in the tooltip.
- `102` → `getString(640) + NodeGenerator.getNodeNameCode(value)` (`Item.as:1044`), also
  not a set id.
- ids 25, 38, 78, 79, 82, 84, 90, 96–99, 104, 105 fall in neither stated range;
  `40000` hits `XMLItem.as`'s `trace("ErrorValue: …")` branch.
- the **elemental / crit / piercing** modifiers (`StatsManager.STAT_FIREDEF` … 
  `STAT_PIERCINGDMG`, handled at `Item.as:1020-1043`) are missing from the claim's
  enum entirely — and they are the exact lines the claim's own cited frame displays.

The narrow rider *"modifier 7 is suppressed when the item carries a non-zero
`<defense>`"* is also incomplete: `Item.as:948-953` shows it prints **only** when
`(mindamage>0 || maxdamage>0) && defense == 0`, i.e. weapons only.

---

## MINOR — claim 6: the frame is real, "confirms the bitmask" is not

I cropped it: `frame_0031.jpg`, crop (575,140)-(1015,420) 3× lanczos, plus a second
crop (575,400)-(1015,550) to catch the cut-off line. Visibly present, exactly as
described: green-bordered icon with a **450** price badge, green **PANTS**,
**OWNED: 0**, **LEVEL 4**, then `DEFENSE +1 (EQ 3)` / `FIRE DEF +1 (EQ 0)` /
`WIND DEF +2 (EQ 0)` / `EARTH DEF 0 (EQ 1)` / `CRITICAL DAMAGE 0 (EQ 1)` /
`MAX CHI 0 (EQ 5)` / `CHI REGEN 0 (EQ 2)` / **`WEIGHT: 5`**, and a BUY button.

But the tooltip cannot confirm a mask. `Item.as:893-911` builds `modArrayCheck` as the
**union of the equipped item's modifier array and the candidate's**, then prints one
line per entry. A missing PIERCING line means *neither of these two pants rolled
piercing* — nothing about the mask. Note **WATER DEF is allowed by the PANTS mask and
is also absent** from the frame, which makes the point concretely. One sample is
consistent with the mask; it does not confirm it. The mask itself
(`ItemGenerator.as:409-412`, `[1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0]`) I verified
verbatim and it stands on A2 alone.

---

## MINOR — claim 12: decomposition right, one stated fact wrong

The name decomposition is **exactly** right — `ItemGenerator.as:744` case 3 is
`pre(mod2) + " " + pre(mod0) + " " + basename + " " + suf(mod1)`, giving
`Drafty · Sharp · Iron Sword · of Piercing`. Forced-first ATTACK on weapons
(`ItemGenerator.as:433-437`) holds. And it is now *stronger* than claimed: 'Iron Sword'
is `<name>4050` → table 990 (see FATAL 2), so the basename is A2-held too.

Wrong: *"'of Piercing' … allowed **ONLY** by the WEAPON mask"*. Index 16 is `1` in the
ARMOR mask (`ItemGenerator.as:402`) and the ACCESSORY mask (`:425`) as well.
Piercing is allowed on weapons, armor **and** accessories.

Cite nit: the colour comes from `getNameBlackBG()` (`Item.as:491-513`), not `getName`
— `getName`'s bright branch at `:417` is additionally gated on
`!inventoryUI.visible && (lootDialog.visible || gotGiftDialog.visible)`. The
mechanism is unaffected; the black quest box takes the black-BG palette.

---

## What stands, and why it matters

- **Claim 7 is the survey's best work and I am strengthening it.** `getCondition()` has
  exactly two occurrences in the whole 970-class bundle — its own definition
  (`Item.as:1481`) and one display call (`Item.as:714`). It touches no damage path.
  `getMinDamage`/`getDamageRange` switch only on `isBroken()`. This also **overturns a
  measurement doc**: `docs/research/video-study/segments/B-00-post-win-inventory-and-loadout-managemen.md:55,88`
  infers a `item.conditionMultiplier` from "Iron Sabre Lv7 Unbreakable 12–19 vs Lv2
  Usable 2–13". That delta is the level/modifier-6 gap, not condition — exactly what
  ledger blocker ② suspected. **Do not encode a condition multiplier.**
- **Bonus, now exact:** the ledger's unnumbered "condition tier names" resolve at −20
  to five sequential entries matching `Item.getDesc`'s five branches in order —
  `Condition: Broken · Poor · Used · Usable · Good` (table 368–372), plus
  `Unbreakable` (620). The video's **WELL-MAINTAINED** is not among them; the frame
  wins, so treat the Android wording as a lead, not as ship text.
- Claims 1, 3, 4, 5, 9, 10, 11, 13, 14, 18, 19 I checked against the source and they
  are verbatim-accurate. `MAXINDEX = 79` → 80 tiers confirmed; `levelrestriction`
  **is** `<minlvl>` (`XMLItem.as:128-130`) confirmed; all 27 `PART_` constants,
  `mcsString`, the hat/hair exclusion, `getMCSComponent`'s fallback, `CraftingUI`'s
  transfer, `findWeight`'s three-slot exclusion and all three overweight gates
  (`NodeUI.as:379`, `Obj_HiddenTemple.as:187`, `InteractUI.as:1730`) confirmed. I
  re-extracted char-id 121 (4,504 B) and it is byte-identical to the quoted premium
  catalogue.

## Score

84 is too high given ③ is answered wrong and names were declared unheld when they are
held. Netting the two fatals (which *raise* real readiness once corrected) against the
three overstatements: **the lane is genuinely ~88**, but only on a corrected ledger —
blocker ③ closed by `getSellAmt`, blocker ①④ closed as stated, ② closed as "no such
mechanic", ⑤ still half open (per-item vector art), and L1b downgraded from "blocker"
to "anchor each id block, then frame-check the wording".
