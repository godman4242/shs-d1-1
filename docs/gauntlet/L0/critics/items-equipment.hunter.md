# HUNTER CRITIC — items-equipment

Blind review. I did not see the surveyor's reasoning, only its claim list. Every verdict below
cites an artifact **I opened myself**. Frames were cropped and upscaled before grading.

Bottom line: **17 of 20 claims survive**, most of them cleanly and with unusually good cites
(the frame→payload identity check on the Branch is the best single piece of evidence in this
lane). **3 are refuted**, all three by a line the surveyor did not read that sits within a few
lines of a line it did read. One STILL_UNHELD is **fully closed** by the hunter pass, and one
STILL_UNHELD is **honest and correct** — I tried hard to break it and could not.

---

## A. REFUTATIONS

### R1 — `sprite-compositing-contract-held` — the human part stack is **23 layers, not 27**  (MATERIAL)

The surveyor read `MCSCharacter.as:10-62` (the enum) and `:141-146` (the addChild loop), but not
`:120`, which is **21 lines above the loop it quoted**:

```
reference/decompiled/shs3_android/scripts/MCSCharacter.as:120
      internal var partListLength:int = 22;
reference/decompiled/shs3_android/scripts/MCSCharacter.as:141
         for(var i:int = 0; i <= this.partListLength; i++)
```

`i <= 22` allocates **23** MovieClips (indices 0–22). `PART_l_shoulder=23`, `PART_r_shoulder=24`,
`PART_l_knee=25`, `PART_r_knee=26` are **never allocated on a human** — reading `partList[23]`
would be out of range.

Those four indices exist for one reason, and it is not equipment:

```
reference/decompiled/shs3_android/scripts/MCSWolf.as:13
         partListLength = 25;                        // after super() already pushed 23
reference/decompiled/shs3_android/scripts/MCSWolf.as:184,188,193,197
         var r_frontleg1:MovieClip = partList[PART_r_shoulder];
         var l_frontleg1:MovieClip = partList[PART_l_shoulder];
         var r_backleg2:MovieClip  = partList[PART_r_knee];
         var l_backleg2:MovieClip  = partList[PART_l_knee];
```

23–26 are **wolf legs**, re-purposed in a subclass that extends the list. The claim's own
lane_impact — "the z-order table … directly codeable" — hands a builder four phantom layers on
the human paperdoll.

What survives intact and should be kept: index == addChild z-order for 0–22 (nothing calls
`setChildIndex`/`swapChildren` on the top-level partList — the six `setChildIndex` calls at
:683/:706/:724/:755/:873/:885 all reorder *inside* a part container); `armor` drives 7 parts and
`pants` drives 5 (I counted the `addChild(componentObject)` sites in `setArmor` and `setPants`
myself: 7 and 5); and the `partType + art` / `partType + "0"` symbol contract at :581-607.

### R2 — `no-separate-icon-manifest` — there are **two icon-only art namespaces**, plus 11 placeholder symbols  (MATERIAL)

The claim is "the icon IS the paperdoll part stack … there is no separate icon art set to
recover." The surveyor read `MCSItem.setArmor` (:324-349) and generalised from it. Twelve lines
earlier and eighteen lines later, in the same class, are two setters that do **not** use paperdoll
parts at all:

```
reference/decompiled/shs3_android/scripts/MCSItem.as:206,209
         this.displayItem = this.getMCSComponent("item",id);
            this.displayItem = new item0();
reference/decompiled/shs3_android/scripts/MCSItem.as:229
         this.displayItem = this.getMCSComponent("acc",id);
```

`"item"` and `"acc"` are not `PART_*` types — there is no `PART_item`, no `MCSCharacter.setItem`,
and accessories are not even passed to `initMCS` (StatsManager.as:1765 passes 11 slots; ACCESSORY1/2
are not among them). They are dedicated icon symbol namespaces (`item<art>`, `acc<art>`).

On top of that there are 11 named placeholder icon classes in the Android bundle —
`ArmorDummyIcon, PantsDummyIcon, HatDummyIcon, MaskDummyIcon, GlovesDummyIcon, ShoesDummyIcon,
WeaponDummyIcon, AccessoryDummyIcon, ConsumableDummyIcon, InvalidDummyIcon, AchievementDummyIcon`
(`ls reference/decompiled/shs3_android/scripts/ | grep DummyIcon`).

**The frame proves the consequence.** `reference/frames/s21_weapon/t708.0.png`, crop
(900,590)-(1640,960) upscaled ×2 LANCZOS: of the 7 inventory icons, **five** are a scroll, an
onigiri (×3), a black stone and two feathers. None of those is a torso/pelvic/uparm stack. The
lane_impact "one art pipeline, not two; … no icon-authoring pass is needed" is wrong — it is at
least three pipelines (paperdoll parts, `item*`, `acc*`) plus a placeholder set.

### R3 — `purple-border-is-unique-not-rarity` — the border **is** the 4-tier ladder  (MATERIAL)

The claim's headline (purple ⇒ `<unique>`) is true. Its actionable conclusion — "border tracks
`<unique>`, text colour tracks the 4 tiers" — is the exact mis-wiring it claims to prevent.

The surveyor quoted `GameEngine.as:572`. Four lines up, in the same else-if chain:

```
reference/decompiled/shs3_android/scripts/GameEngine.as:568
            str = "Tip: A blue border indicates that an item is rare.";
reference/decompiled/shs3_android/scripts/GameEngine.as:572
            str = "Tip: A purple border indicates that an item is unique.";
```

And the authoritative artifact is not the tip string at all:

```
reference/decompiled/shs3_android/scripts/ShopItem.as:27,51-52
      internal var borderType:String = "normal";
         this.borderType = itemRef.getShopItemType();
         gotoAndStop(this.borderType + "_default");
reference/decompiled/shs3_android/scripts/ShopItem.as:283,287,295,299
         gotoAndStop(this.borderType + "_selectedmouseover");
         gotoAndStop(this.borderType + "_mouseover");
         gotoAndStop(this.borderType + "_selected");
         gotoAndStop(this.borderType + "_default");
```

`getShopItemType()` returns exactly `"unique" | "rare" | "special" | "normal"` (Item.as:382-405) —
the same 4-value enum the ledger calls "4 rarity tiers". So the border art contract is
**4 tiers × 4 states = 16 frame labels**, and `unique` is the top tier *of* that ladder, not a
separate flag beside it. `InventoryUI.as:1453` passes `clickedItem.getBorderType()` as the type —
the method is literally named for the border.

Frame corroboration, same crop as R2: the two feathers carry purple borders; the selected Branch
tile is `normal_selected` (same tan border, darkened fill); the other four are `normal_default`.
That is the tier×state matrix rendering, visible.

---

## B. THE STILL_UNHELD THAT IS NOW HELD

### N1 — `ui-slot-mapping-unknown` is **closed**. Left ring = EQ_ACCESSORY1, right ring = EQ_ACCESSORY2, and EQ_NECK has no UI box.

`InventoryUI.as` answers it outright, and the slot **indices reproduce the frame's reading order
exactly**:

```
reference/decompiled/shs3_android/scripts/InventoryUI.as:181
      internal var totalEquippedSlots:int = 9;
reference/decompiled/shs3_android/scripts/InventoryUI.as:163-179
      SLOT_HAT=0  SLOT_MASK=1  SLOT_ARMOR=2  SLOT_GLOVES=3  SLOT_PANTS=4
      SLOT_WEAPON=5  SLOT_RING1=6  SLOT_SHOES=7  SLOT_RING2=8
reference/decompiled/shs3_android/scripts/InventoryUI.as:268-269
         this.equippedSlots[this.SLOT_RING1] = this.equipAccessory1;
         this.equippedSlots[this.SLOT_RING2] = this.equipAccessory2;
reference/decompiled/shs3_android/scripts/InventoryUI.as:522,527,530,535
                  tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1];
                  tempShopItem = this.equippedSlots[this.SLOT_RING1];
                  tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY2];
                  tempShopItem = this.equippedSlots[this.SLOT_RING2];
```

Frame check, `reference/frames/s21_weapon/t708.0.png` crop (170,240)-(870,1040) upscaled ×2:
row 1 = straw hat, oni-mask outline; row 2 = grey haori, gauntlet outline; row 3 = white hakama,
pickaxe; row 4 = ring outline, sandals, ring outline. Left-to-right, top-to-bottom that is
0,1,2,3,4,5,6,7,8 — an exact match to the SLOT_ constants. `totalEquippedSlots = 9` also confirms
the ledger's "9-slot paperdoll" **from code**, and `EQ_NECK`/`EQ_HAIR`/`EQ_HEAD`/`EQ_SCABBARD`
provably have no box.

Bonus from the same block: `InventoryUI.as:475,493` treat item IDs **4000, 4001** (armor) and
**11001** (pants) as "empty" and show the placeholder icon — so the naked-default *item* IDs are
4000/4001/11001, which is not the same list as the naked-default *art* IDs (4000/11000) the
surveyor's lane_impact gives. `<art>` defaults to the item id only when the tag is absent
(`XMLItem.as:110-116`).

---

## C. THE STILL_UNHELD THAT SURVIVED (I tried to break it and failed)

`per-item-art-payload-unknown` is **correct and honest**. I counted part-symbol classes across
every decompiled bundle:

```
$ for d in reference/decompiled/*/; do find "$d" -name '*.as' | grep -cE '/(torso|stomach|uparm|lowarm|pelvic|crotch|thigh|calf|foot|hand|hair|hat|head|mask|neck|weapon|prop)[0-9]+\.as$'; done
shs1 0 · shs2 0 · shs3_android 20 · shs3_android_payload 20 · shs3_payload 20
```

Exactly the 19 naked defaults plus `head8004` and `weapon13002` — nothing else, in any bundle.
Against 982 roster rows, that is a real, unclosed art gap. Do not let anyone score it away.

Two upgrades to the *lead* (still not artifacts, do not promote them):
1. The container is **named**: all 411 symbol-bearing classes in `shs3_payload` carry
   `[Embed(source="/_assets/assets.swf", symbol="symbolNNNN")]` (e.g. `torso4000.as` →
   `symbol2647`, `weapon13002.as` → `symbol2642`). `assets.swf` is not present anywhere under
   `reference/` (`find reference -iname '*assets*'` returns only an unrelated shs2 file). "Obfuscated
   in the web SWF" is more precisely "inside an embedded `assets.swf` whose symbols are numbered".
2. The gap is **larger** than the claim states: R2 adds the `item<art>` and `acc<art>` icon
   namespaces to it, of which only the `item0` fallback is present as a named class.
3. One item's art *is* recovered: item 13002 has no `<art>` tag, so `art = id` (XMLItem.as:110-116),
   giving class `weapon13002` — the Branch visible in the frame.

---

## D. NEW FINDINGS THE SURVEY MISSED

### N2 — Repair-Weapon cost is held. This kills an **economy** ledger blocker.

`REBUILD_READINESS.md:213` lists economy blocker ③ as "Repair-Weapon cost (never captured)".

```
reference/decompiled/shs3_android/scripts/InteractUI.as:1057-1058
            case "repairweapon":
               cost = StageManager.getCurrentNodeLevel() * 10;
reference/decompiled/shs3_android/scripts/InteractUI.as:1073-1076
               if(weapon.uses > 1)
               {
                  weapon.uses = 1;
               }
```

Cost = **current node level × 10 gold**. Repair is refused when the weapon slot is empty or holds
id 13000 (the bare-hands default). Repair sets the wear counter to **1, not 0** — so a repaired
weapon reads "Condition: Well-Maintained" (string 392) and can **never** return to the `uses == 0`
"Unbreakable" state. That is a deliberate one-way door and it explains the otherwise-odd
`uses == 0 ⇒ Unbreakable` branch the surveyor transcribed without interpreting.
`reinforceweapon` is a flat 5000 gold at :1083.

### N3 — Durability exists for only **115 of 982** items, and the XML tag is `<uses>`, not `<durability>`.

```
reference/decompiled/shs3_android/scripts/XMLItem.as:186,190
            this.durability = xml.uses;
            this.durability = 0;
```

`docs/gauntlet/L0/index/itemdata.json` → `itemdata/item/uses` count **115**, values {50,60,80,100};
there is no `itemdata/item/durability` path at all. `getCondition()` returns **-1** when
`durability == 0`, and `getDesc()` gates the whole condition ladder on `condition >= 0`
(Item.as:1485-1487, :714-715). So the surveyor's (correct) 7-state ladder applies to 115 items;
the other 867 render no condition line whatsoever. That belongs in the ledger next to the ladder.

### N4 — The sell formula's `getWeight()` is **stack** weight, and the two builds differ.

Android (`Item.as:1564-1568`): `return this.weight * this.getQuantity();`
Web v0.717 (`§1t17s0§.as:1958-1963,1974`): `return (this.weight + this.§1t478s0§) * this.§1t484s0§();`

`getSellAmt()` is byte-identical across builds — the surveyor is right about that — but its
`getWeight() >= 10` test reads **base weight × quantity**, and the web build adds a per-item
weight-modifier term the Android build lacks. A builder implementing "weight ≥ 10" as *per-item*
weight gets the wrong branch on any stack of ten light items. Note also the only call site is
`ShopUI.as:401` (`slot.setCost(slot.getItem().getSellAmt(),0)`) — no shop-side multiplier exists,
which is what actually proves the "no level term" half of the claim.

### N5 — The frame shows an item-panel "LEVEL 1" caption that no formula I found produces. STILL_UNHELD.

`reference/frames/s21_weapon/t708.0.png`, crop (980,480)-(1200,540) upscaled ×5 LANCZOS:
"LEVEL 1" is rendered in the UI font beneath the Branch icon. `Item.getLevel()` (Item.as:274-299) =
`max(levelrestriction, max over modifiers of getModTier(id,val)+1)` clamped to `levelCap`. For
item 13002 that is `max(-4, 0) = 0`, not 1. `levelrestriction` is -4. The two `Level Required`
render sites (Item.as:1101-1104, :1299-1304) are both gated on `itemlevel > 0` and would not fire.
I could not source this label; it is a real, small, open items-owned UI number. **The frame wins** —
the caption is on screen whether or not the Android v0.682 code explains it, and this may be a
web-v0.717 divergence.

---

## E. PRECISION NOTES (claims survive, wording should be tightened)

- `affix-suffix-pool-and-counts`: verified verbatim (13 pools × 8 tiers = 104 + 104, `num =
  Math.floor(i/10)`, `MAXINDEX = 79` at ItemGenerator.as:58). But calling the DEF-channel pool
  reuse "the shipped bug" is an **unevidenced inference**. ItemGenerator.as:142-145 is a clean
  4-cycle — FIREDEF←water, WATERDEF←wind, WINDDEF←earth, EARTHDEF←fire — which reads at least as
  plausibly as deliberate counter-element naming. State the mapping; don't label it a bug.
- `stat-vs-level-curve`: `mindamage`/`maxdamage` are 158 rows but `minlvl` is **155**
  (`docs/gauntlet/L0/index/itemdata.json`) — three weapon rows carry no level. And the `+10` spike
  at index 79 applies to **prog1/prog2/prog3 only**; prog4 (speed) and prog5 have no spike
  (ItemGenerator.as:178-183). The lane_impact reads as if all five get it.
- `sell-price-corrects-section3-item9`: rarity **is** modifier count (`modifierCount >= 3 ⇒ rare`,
  Item.as:396-403), so the ledger's "scales with rarity" half of §3 #9 was already right by
  construction. Only the "/level" half is corrected. Say that, or the correction over-claims.
- `item-save-format-held`: `mcsString` (MCSCharacter.as:348) is the 12-field **appearance/render**
  string — it carries no scabbard and no accessories, so it is not the equipment save format. The
  PARTIAL verdict is right; the wording "equipment is a 12-field pipe string" is not.
- `modifier-id-stat-table`: five reserved IDs are named constants (80/81/82/89/125,
  Item.as:6-16); **83** is inferred from `getModifierBonus(83)` at Item.as:1464 and :1487 (a
  durability bonus). "Six reserved IDs" is fine but 83 has a different provenance — flag it.
- `condition-tier-thresholds` / `rarity-is-derived-not-a-field` / `defense-min-floor-is-wrong` /
  `weight-cap-is-a-base-not-a-cap` / `eq-comparison-frame-payload-identity` /
  `slashusage-stancerestriction-omitted` / `soul-infusion-is-code` / `condition-has-no-damage-multiplier`:
  all opened and all confirmed verbatim. `getCondition` really does have exactly two occurrences in
  the whole Android bundle (its definition and its one call in `getDesc`) — I ran the grep.
  `InventoryUI.as:439` is a further A2 confirmation of the weight-cap claim:
  `WeightAmount.text = getString(139) + ": " + findWeight() + " / " + getCarryingWeight()`, which
  is the frame's "WEIGHT: 43 / 100" exactly.

## F. SCORE

78 is too high given R1–R3, but not by much — N1 and N2 are worth more than the three refutations
cost. Net: **73–75**. The residual art gap (Section C, now three namespaces wide) is the thing
holding this system down, and it is a genuine wall, not an unopened door.
