# items-equipment — LENS 3 (PRECEDENCE) critic

Blind review. I did not see the surveyor's reasoning. Every verdict below cites an artifact
**I** opened this run. Lens: stale-claiming — does a claim import a doc statement a later
measurement/ruling/frame overturned, or cite a doc where a frame settles it directly?

Frame work done first-hand: `reference/frames/s21_weapon/t708.0.png` (1920×1080, verified via
PIL `im.size == (1920,1080)`), four crops regenerated at the surveyor's stated coordinates and
opened: paperdoll `(170,240)-(870,1040)` ×2, inventory `(900,590)-(1640,960)` ×2, weight
`(1400,540)-(1780,600)` ×4, tooltip `(1320,240)-(1620,320)` ×4. **All four crop rectangles are
accurate** — they frame exactly what the surveyor said they frame.

---

## Headline

**18 of 20 claims survive.** The evidence work is unusually good: I spot-checked 11 line-number
cites down to the exact line (including six obfuscated web-payload lines, `§1t17s0§.as`
:683/:687/:691/:704/:708/:712 — all six land on the exact hex they were said to) and every
verbatim quote reproduced. Row counts I re-derived independently all matched
(`slashusage` 106 / three values 24·72·96; `stancerestriction` 53 / values 4·6; `<unique>1` 253,
`<unique>2` 116; 982 `<item>`).

**Two claims fail, and both fail the same way — the surveyor stopped reading one file too early.**

1. `purple-border-is-unique-not-rarity` is **FATAL**. Four lines above the tip string it quotes,
   the same file says *"Tip: A blue border indicates that an item is rare."*
2. `ui-slot-mapping-unknown` is a **STILL_UNHELD that is not unheld** — `InventoryUI.as` answers it
   outright, and the surveyor cited `InventoryUI.as` in a neighbouring claim.

Plus one **material internal contradiction**: `paperdoll-is-13-slots-not-9` silently resolves the
very ambiguity `ui-slot-mapping-unknown` declares unresolvable — and resolves it wrongly.

---

## FATAL — claim 13 `purple-border-is-unique-not-rarity`

> Claim: *"The purple item border … is the UNIQUE flag, not a rarity tier."*
> Lane impact: *"prevents mis-wiring the border colour to the 4-tier rarity ladder."*

**Backwards. The border IS the 4-tier ladder.**

`reference/decompiled/shs3_android/scripts/ShopItem.as:51-52`

```
this.borderType = itemRef.getShopItemType();
gotoAndStop(this.borderType + "_default");
```

`getShopItemType()` is the four-valued function the surveyor themselves quoted in claim 12
(`Item.as:382-405` → `"unique"` / `"rare"` / `"special"` / `"normal"`). So the border art has four
frames — `normal_default`, `special_default`, `rare_default`, `unique_default` — and purple is
simply the **top tier's** border, not a separate flag.

And the refutation was one screenful from the cite. The surveyor quoted `GameEngine.as:572`.
`GameEngine.as:567`:

```
str = "Tip: A blue border indicates that an item is rare.";
```

Two further errors ride along:
- `getShopItemType()` returns `"unique"` on `itemxml.unique == 1` **OR** `isPickableQuestItem()`
  **OR** the five trade-quest IDs **OR** `isPlayerNamed()` — so it is not "the `<unique>` flag"
  even at the top tier.
- `<unique>` is not boolean: I counted **253 `<unique>1`** and **116 `<unique>2`** rows in
  `reference/extracted/itemdata.xml`. Every test in the code is `== 1`, so the 116 `2`-rows fall
  through to the modifier-count path. The surveyor noticed this in claim 12 and then wired the
  border to it anyway in claim 13.

**Cost if shipped:** a builder deletes the blue "rare" and green "special" borders the game
actually ships and implements a monochrome frame plus a bolt-on unique flag.

The frame is consistent with the *correct* reading, not the claim's: my inventory crop shows 2 of
7 icons with purple borders and 5 with the plain frame — no rare/special items happen to be in
this bag, which is why the frame alone cannot distinguish the two hypotheses. **This is exactly the
case §0 warns about: the frame is silent, so the code is the authority — and the code says four
tiers.**

---

## MATERIAL — claim 19 `ui-slot-mapping-unknown` is answered

STILL_UNHELD is a respected answer, but not when the answer is in a file the survey already
opened. `reference/decompiled/shs3_android/scripts/InventoryUI.as:520-533`:

```
case 7:
   tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1];
   if(tempItem.getItemID() == 0) { this.acc1Icon.visible = true; }
   tempShopItem = this.equippedSlots[this.SLOT_RING1];
   break;
case 8:
   tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY2];
   if(tempItem.getItemID() == 0) { this.acc2Icon.visible = true; }
   tempShopItem = this.equippedSlots[this.SLOT_RING2];
```

The switch runs `case 0` … `case 8` — **nine** paperdoll cases, matching the nine boxes in the
frame — and the two ring boxes are `EQ_ACCESSORY1`/`EQ_ACCESSORY2`, named `SLOT_RING1`/`SLOT_RING2`
in the game's own source. `EQ_NECK` never appears in the switch.

Independent corroboration from the dummy-icon roster (`ls | grep DummyIcon`): the tree ships
`AccessoryDummyIcon`, `ArmorDummyIcon`, `GlovesDummyIcon`, `HatDummyIcon`, `MaskDummyIcon`,
`PantsDummyIcon`, `ShoesDummyIcon`, `WeaponDummyIcon` — eight classes for nine boxes, accessory
used twice — and **no** `NeckDummyIcon`, `HairDummyIcon`, `HeadDummyIcon` or `ScabbardDummyIcon`.

Frame agrees: at ×2 both empty bottom boxes render the **identical ring band**, not an amulet.

---

## MATERIAL — claim 11 `paperdoll-is-13-slots-not-9` loses four slots, not three

The 9-box count is right (I counted them in the crop: hat·mask / armor·gloves / pants·pickaxe /
ring·shoes·ring) and the 13-entry model is right (`StatsManager.as:108`, `:262-286` — verified
verbatim, `EQ_ARMOR 0` … `EQ_ACCESSORY2 12`), and `:1765` does pass 11 to the renderer.

But the operative sentence — *"a builder coding '9 slots' … loses hair, head and scabbard"* —
presupposes `EQ_NECK` owns a ring box. Per the section above it does not. The loss is **four**:
`EQ_HAIR`, `EQ_HEAD`, `EQ_NECK`, `EQ_SCABBARD`. And this presupposition directly contradicts
claim 19, which declares that same mapping unestablished. Both cannot stand.

---

## MATERIAL — claim 1 `sprite-compositing-contract-held`: two counting errors

The symbol-name contract is **solid** and I confirmed the cross-build half myself: all 18 named
default part classes exist in the web payload (`torso4000.as`, `stomach4000.as`, `uparm4000.as`,
`lowarm4000.as`, `pelvic4000.as`, `crotch11000.as`, `thigh11000.as`, `calf11000.as`,
`foot12000.as`, `hand5000.as`, `hair6000.as`, `hair6001.as`, `hat7000.as`, `head8000.as`,
`mask9000.as`, `neck10000.as`, `weapon13000.as`, `prop13000.as` — every one present). `pants=5`
is correct (`setPants` → crotch, l_thigh, r_thigh, l_calf, r_calf).

Two numbers are wrong.

**(a) 27 z-ordered parts → 23 for a human.** `MCSCharacter.as:120`:

```
internal var partListLength:int = 22;
```

and the constructor at `:141` is `for(var i:int = 0; i <= this.partListLength; i++)` → indices
**0…22 = 23** MovieClips. The four highest declarations — `PART_l_shoulder:* = 23`,
`PART_r_shoulder:* = 24`, `PART_l_knee:* = 25`, `PART_r_knee:* = 26` (note: typed `:*`, not `:int`,
unlike 0–22) — are never allocated on a human. `grep` across the tree shows their only consumers
are quadrupeds: `MCSWolf.as:188` `partList[PART_l_shoulder]`, `MCSWolf.as:197`
`partList[PART_l_knee]`. The surveyor counted the enum, not the allocation.

**(b) `armor=7` → 8.** `setArmor` (`MCSCharacter.as:915-1088`) declares eight part locals and
addChilds to all eight — torso, stomach, l_uparm, r_uparm, l_lowarm, r_lowarm, pelvic **and
neck**. The trap is real and I nearly fell in it: the `removeChildAt(0)` prologue lists only seven
(neck is excluded). The eighth attach is at the tail:

```
componentObject = this.getMCSComponent("neck",id);
...
   neck.addChild(componentObject);
```

Related structural detail the model misses: `PART_neck` is written by **both** `setArmor` and
`setNeck` (`:795-813`, which clears `removeChildAt(1)` then `removeChildAt(0)`), so that one slot
legitimately holds up to two children — armour collar plus neck item.

---

## MATERIAL — claim 3 `sell-price-formula`: the formula matches across builds, its *input* does not

`getSellAmt` is genuinely byte-identical in shape. I read both:

- Android `Item.as:1582-1593` — verbatim as quoted.
- Web v0.717 `§1t17s0§.as:1977-1988` — `if(this.§1t467s0§.§1t697s0§() < 3000) return 1;`
  `if(this.§1t545s0§() >= 10) return (1 + this.§1t497s0§()) * 10;` `return (1 + …) * 5;`

But `getWeight()` — the branch input — **diverges between the two builds**:

| build | body |
|---|---|
| Android `Item.as:1564-1580` | `return this.weight * this.getQuantity();` |
| Web `§1t17s0§.as:1958-1975` | `return (this.weight + this.§1t478s0§) * this.§1t484s0§();` |

The web build adds a per-item weight term the Android build has no counterpart for. So
*"confirmed in BOTH builds"* holds for `getSellAmt` and fails for the quantity that decides its
only branch. The S0-3 parity caveat is still live here, not discharged.

Also under-specified in a way that changes numbers: `getWeight()` multiplies by **quantity**, so
the `>= 10` step is a *stack* threshold, not an item-weight threshold — ten weight-1 items sell at
×10, not ×5.

---

## MATERIAL — claim 12 `rarity-is-derived-not-a-field`: parity is *disproved* by the cited file

The derivation is exactly right and I confirmed every hex at the exact web line numbers given
(683 `#b048f8`, 687 `#0080ff`, 691 `#1eff00`, 704 `#6600cc`, 708 `#003399`, 712 `#336600` — all
six land). The `<unique>` 253/116 counts reproduce.

But *"removes the S0-3 Android-parity caveat for them"* is false, and the file cited proves it.
Web `§1t17s0§.as` carries **two colour branches Android does not**:

```
if(this.xp != null) { _loc1_ += "<font color=\"#ff9900\">"; }     // loot palette, :677
else if(this.xp != null) { _loc1_ += "<font color=\"#ff6600\">"; } // inventory palette, :700
```

`grep -rn "ff9900\|ff6600"` across all 559 Android scripts returns **nothing**, and Android
`getName()` (`Item.as:407-450`) has no `xp` test at all. The web build has five states per
palette, not four. Parity is *narrower* after this check, not wider.

---

## MATERIAL — claim 16 `eq-comparison-frame-payload-identity`: exact on three fields, unexplained on the fourth

I opened the crop. It reads exactly as claimed: **"DMG: 1 - 2 (EQ: 1 - 3)"** with the `2` in red,
**"WEIGHT: 1"**. And the payload identity is perfect —
`reference/extracted/itemdata.xml:7906-7915` is `<id>13002</id> <name>4041</name>
<minlvl>-4</minlvl> <mindamage>1</mindamage> <maxdamage>2</maxdamage> <weight>1</weight>`, and
`strings.json["4041"] == "Branch"`. `compareValue` explains the red. Excellent work.

The overclaim is *"reproduced **exactly** by an XML row"*, because the claim's own quote includes
the on-screen label **"LEVEL 1"**, and row 13002 does not produce it:

- `XMLItem.as:128-134`: `this.levelrestriction = xml.minlvl;` → **−4** for the Branch.
- `Item.getLevel()` (`Item.as:274-298`): no modifiers → `maxlevel = 0`; `if(lvl < baselevel)` is
  `0 < -4` = false → **returns 0**, not 1.
- The Android item panel has **no level field at all**. `InventoryUI.as:228-236` and
  `:1453-1462` wire only `selectItem`, `selectItemName`, `selectItemAttribute` and `chatbutton`
  (the `chatbutton` is the "…" speech bubble visible beside the icon in the frame).

**The frame wins and I say so out loud:** the web v0.717 item panel renders a LEVEL row that has
no counterpart anywhere in the Android v0.682 source. The three-field identity stands; the
"exactly / cleanest cross-check" framing does not, and this is S0-3's parity caveat biting inside
the one claim offered as proof that cross-build reading is safe.

---

## MINOR

- **Claim 4 `sell-price-corrects-section3-item9`** — the `/level` half of §3 #9 is correctly
  killed. The `rarity/` half is **not** wrong: `getShopItemType()` derives rarity from
  `modifierCount`, the same term the price uses, so price scales with rarity *by construction*.
  Also `getModifierCount()` is `modifiers.length` (`Item.as:307-310`), which counts the reserved
  non-stat IDs 80/81/82/89/125 — so a recolour or a player-given name raises sell price.
- **Claim 7 `affix-suffix-pool-and-counts`** — counts and both dice tables verified verbatim
  (13 pools × 8 = 104 each; `MAXINDEX = 79` at `ItemGenerator.as:58`). But the lane-impact's
  *"shipped bug where the four elemental-DEF channels reuse the wrong pools"* is an unsupported
  reading: `FIREDEF→water, WATERDEF→wind, WINDDEF→earth, EARTHDEF→fire` is a consistent 4-cycle,
  which reads as deliberate counter-element naming ("Icy … of Frost" on a fire-resist item) at
  least as easily as a mistake. No artifact establishes intent. Call it *cross-wired*, not *a bug*.
- **Claim 8 `stat-vs-level-curve`** — verified end to end (both itemdata rows verbatim; prog
  mapping confirmed: prog1 ATK/DEF, prog2 MAXHP/MAXCHI, prog3 elementals+regens+crit, prog4 SPEED,
  prog5 PIERCINGDMG). The `+10` spike at index 79 applies to **prog1/prog2/prog3 only** — prog4 and
  prog5 get no spike. The claim generalises it.
- **`removeParts()` leaks `PART_prop3`.** `MCSCharacter.as:246`:
  `for(var i:* = int(this.partListLength - 1); i >= 0; i--)` iterates 21…0, so `partList[22]`
  (`PART_prop3`) is never cleared. A recreation that clears all 23 will diverge from OG behaviour.

---

## Claims that survive intact

`no-separate-icon-manifest` (MCSItem.as:324-349 verbatim; note the icon stack is 5 parts vs the
doll's 8) · `condition-has-no-damage-multiplier` (**strongest claim in the set** — my own grep
returns `getCondition` exactly twice in 559 files: the definition at `Item.as:1481` and one call
at `Item.as:714` inside `getDesc`; `StatsManager.as:1871/:1892` confirm the binary cliff) ·
`condition-tier-thresholds` (all 7 strings verified in `strings.json`; web ladder at
`§1t17s0§.as:1011/1015/1019`) · `item-save-format-held` (PARTIAL scoping is correct; ledger line
351 quoted accurately) · `soul-infusion-is-code` (`CraftingUI.as:494-525` verbatim; string 698 =
"Both items must be of the same type") · `defense-min-floor-is-wrong` (`EnemyPlayer.as:107-123`
verbatim — boss auto-scaling, `playerLVL`, divisors 1/8/6/4) · `weight-cap-is-a-base-not-a-cap`
(and I found the wiring the claim didn't cite: `InventoryUI.as:439`
`this.WeightAmount.text = getString(139) + ": " + StatsManager.findWeight() + " / " +
StatsManager.getCarryingWeight()` — the frame's "43 / 100" is exactly this) ·
`modifier-id-stat-table` (all 21 string IDs verified verbatim) ·
`slashusage-stancerestriction-omitted` (my independent counts match exactly) ·
`per-item-art-payload-unknown` (honest and correctly scoped — `MCSCharacter.as:594-596`
`if(StatsManager.useExternalResource) return ResourceManager.getMCSComponent(partType,art);`
is a real lead, and no recovery is claimed).

---

## Score

**78 → 72.** The blocker work is real and mostly stands, but blocker ⑤ is the one this unit was
scored highest on, and its border half is inverted while its z-order and per-slot part counts are
both off. Deduct for the fatal border inversion (−4) and the four-slot paperdoll error (−2). The
two "additionally WRONG ledger bullets" (defense min-floor, weight cap) are correct and should be
actioned as written.
