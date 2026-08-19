# items-equipment — BLIND CRITIC, LENS 4 (THE FRAME LENS)

Reviewer opened every artifact listed below first-hand. Frame work: `reference/frames/s21_weapon/t708.0.png`
(1920×1080, verified with PIL), four crops reproduced at the surveyor's stated boxes and upscaled
LANCZOS ×2/×4. Code work: `reference/decompiled/shs3_android/scripts/` (v0.682) and
`reference/decompiled/shs3_payload/scripts/` (web v0.717). Payload: `reference/extracted/itemdata.xml`,
`docs/gauntlet/L0/index/{itemdata,strings,frames}.json`.

**Headline: 15 of 20 claims survive. 5 are refuted — 4 material, 1 minor.** The score of 78 is
roughly defensible but the two things the surveyor said "held it back from >78" are wrong in
opposite directions: one of them (the ring-slot mapping) is fully resolvable and now resolved;
the other (per-item art) is honest and I strengthened it.

---

## THE FRAME WORK I DID

| crop (orig px) | zoom | what is visibly there |
|---|---|---|
| (170,240)-(870,1040) | ×2 | **exactly 9 slot boxes**, order confirmed: hat(filled, straw kasa) · mask(empty, oni outline) / armor(filled, grey haori) · gloves(empty, gauntlet outline) / pants(filled, white hakama) · weapon(filled, pickaxe) / ring(empty) · shoes(filled, sandals) · ring(empty). Fighter renders with visible dark hair under the hat and a white neck wrap — both are parts with **no** UI box. |
| (900,590)-(1640,960) | ×2 | 7 inventory icons; **2 carry a purple border** (blue feather, white feather). The branch slot is the dark "selected" state. Three icons — scroll, onigiri ×3, black stone — are **not body parts**. |
| (1400,540)-(1780,600) | ×4 | `WEIGHT: 43 / 100` |
| (1320,240)-(1620,320) | ×4 | `DMG: 1 - 2 (EQ: 1 - 3)` with the **2 rendered red**, and `WEIGHT: 1`. **`BRANCH` and `LEVEL 1` are NOT in this box** — they sit at ~x1021,y260 and ~x1050,y521, i.e. to the LEFT, not "under". |

Purple-border pixel re-sampled independently over (1270,600)-(1460,775): the modal saturated
purple is **RGB(144,102,203)** — the surveyor's sample reproduces exactly.

**The frame does not contradict the doc anywhere in this system.** It does, however, refute one
claim (the icon manifest) by simply showing three consumable icons that no paperdoll can produce.

---

## REFUTED — MATERIAL

### R1. `no-separate-icon-manifest` — the surveyor generalised setArmor to all 982 items
`ShopItem.as:134-199` is the complete itemID-band → icon-renderer dispatch, and it routes two whole
bands to art namespaces that **have no paperdoll counterpart**:

```
id == 1 | 2000-2999 | 20000-29999 -> itemMCS.setConsumable()  -> getMCSComponent("item", art)
id 3000-3999                      -> itemMCS.setAccessory()   -> getMCSComponent("acc",  art)
id 4000-4999 armor · 5000-5999 gloves · 6000-6999 hair · 7000-7999 hat · 8000-8999 head
id 9000-9999 mask · 11000-11999 pants · 12000-12999 shoes · 13000-13499 weapon
id 10000-10999 (neck) -> NO BRANCH AT ALL (falls through the `!(...)` guard, renders nothing)
```
`MCSCharacter.as:9-62` declares no `PART_item` and no `PART_acc`. So `item####` and `acc####` are a
**separate icon art set**, exactly the thing the ledger called an "icon manifest".
**THE FRAME SETTLES IT:** the (900,590)-(1640,960) ×2 crop shows a scroll, an onigiri ×3 and a black
stone sitting in the inventory grid. None of those is a torso, pelvic, uparm or lowarm.
Secondary error: the miss case is not "ArmorDummyIcon" — there are **eleven** dummy-icon classes
(`Accessory/Achievement/Armor/Consumable/Gloves/Hat/Invalid/Mask/Pants/Shoes/Weapon`) plus `item0`.

### R2. `purple-border-is-unique-not-rarity` — the interpretation is exactly backwards
`ShopItem.as:49-51`:
```as3
public function setItem(itemRef:Item) : Item {
   this.borderType = itemRef.getShopItemType();
   gotoAndStop(this.borderType + "_default");
```
The border is driven by **the same `getShopItemType()` 4-tier ladder as the name colour**, as an
8-frame MovieClip label set `{normal,special,rare,unique}_{default,selected}` (`setGotSelected`,
`setItemID`). `GameEngine.as:568` — three lines above the purple tip the surveyor quoted — reads
*"Tip: A blue border indicates that an item is rare."* So the lane_impact "prevents mis-wiring the
border colour to the 4-tier rarity ladder; border tracks `<unique>`, text colour tracks the 4 tiers"
is false on both halves. Further, purple is **not** `<unique>1`: `Item.as:392-395` returns "unique"
also for pickable quest items, the five trade-quest IDs, and any player-named item.
The A1 half (2 of 7 purple borders, RGB≈144,102,203) is fine — I reproduced it. The reading is not.

### R3. `defense-min-floor-is-wrong` — the floor IS in the generic damage pipeline
`Damage.as:149-171`:
```as3
public function getMinDamage() : int {
   if(this.damage == 0) return 0;
   if(this.attackerlvl == 0) return this.damage;
   if(this.attackerlvl <= 10) return 1 + this.piercingDamage;
   if(this.attackerlvl <= 20) return this.attackerlvl / 8 + this.piercingDamage;
   if(this.attackerlvl <= 30) return this.attackerlvl / 6 + this.piercingDamage;
   return this.attackerlvl / 4 + this.piercingDamage; }
```
This is the `Damage` object every hit is delivered through — the generic pipeline, not boss scaling.
It is keyed to **attackerlvl**, so when an enemy hits the player the top band is literally
**EnemyLevel/4**. The ledger's bullet is therefore *right in variable* and only *incomplete in shape*
(one of four bands). The surveyor's `playerLVL` version is just the mirror case with the player as
attacker, and it is not "boss auto-scaling" either — the same block appears in at least five enemy
classes (`EnemyElite.as:63`, `EnemyKanjiGuardian.as:88`, `EnemyWolfAlpha.as:109`,
`EnemySpearElite.as:107`, `EnemyPlayer.as:120`). Correct correction: *"one band of a four-band
ATTACKER-level floor, `1 / lvl8 / lvl6 / lvl4`, plus piercing"*.

### R4. `ui-slot-mapping-unknown` — answerable, and now answered
`InventoryUI.as:461-535` is a literal `for(var i:int = 0; i < 9; i++)` switch that names every box:
```
0 EQ_HAT->SLOT_HAT · 1 EQ_ARMOR->SLOT_ARMOR · 2 EQ_GLOVES->SLOT_GLOVES · 3 EQ_PANTS->SLOT_PANTS
4 EQ_MASK->SLOT_MASK · 5 EQ_WEAPON->SLOT_WEAPON · 6 EQ_SHOES->SLOT_SHOES
7 EQ_ACCESSORY1->SLOT_RING1 · 8 EQ_ACCESSORY2->SLOT_RING2
```
The two ring boxes are **ACCESSORY1 and ACCESSORY2**. `EQ_NECK` appears nowhere in the loop. The
same block also names the IDs the UI treats as "empty": armor 4000/4001, pants 11001. The
STILL_UNHELD is honest in wording ("the AS3 I read") but wrong as a claim about the evidence, and it
is one of the two things the score was held back for.

## REFUTED — MINOR

### R5. `rarity-is-derived-not-a-field` — headline right, two sub-facts wrong
Derivation ✓ (`Item.as:382-405`), no rarity field in itemdata.xml ✓ (absent from `itemdata.json`
paths), all eight hexes ✓ byte-identical in `§1t17s0§.as:683-712`. But the claim says "**six** tier
colours" while listing eight, and its "removes the S0-3 Android-parity caveat" is *falsified by the
web build itself*: v0.717 carries a fifth branch v0.682 does not —
`if(this.xp != null) -> "#ff9900"` (loot toast, `§1t17s0§.as:677-680`) and `"#ff6600"` (inventory,
`:699-702`). XP items get their own name colour on the web. The parity caveat stands.

---

## HELD — with corrections worth carrying

* **`sprite-compositing-contract-held`** ✓ verified: 27 `PART_` constants (`MCSCharacter.as:9-62`),
  constructor `addChild` loop so index == z-order (`:140-146`), the `partType + art` /
  `partType + "0"` contract (`:581-611`), armor drives 7 parts + a conditional neck, pants drives 5,
  and every named default class exists in the **web** payload too.
  ⚠ **`partListLength = 22` (`:120`)** — only 23 parts (0-22) are instantiated for the humanoid.
  `PART_l_shoulder/r_shoulder/l_knee/r_knee` (23-26) are creature-only (`MCSWolf.as:184-197`).
  Build 23, not 27.
* **`sell-price-formula`** ✓ verbatim in both builds (`Item.as:1582-1593`, `§1t17s0§.as:1977-1988`).
  ⚠ Its **input diverges**: Android `getWeight()` = `weight * quantity` (`Item.as:1564-1579`); web
  `getWeight()` = `(weight + §1t478s0§) * quantity` (`§1t17s0§.as:1958-1975`). And because quantity
  multiplies in, a *stack* of ten weight-1 branches trips the `>=10` branch. Neither is in the claim.
* **`condition-has-no-damage-multiplier`** ✓ `getCondition()` defined `Item.as:1481`, **sole** call
  site `:714` inside `getDesc()`; binary cliff at `StatsManager.as:1863-1903`. ⚠ Add: durability is
  `<uses>`, not a `<durability>` tag (`XMLItem.as:181-188`), and only **115 of 982** rows carry it —
  867 items return `-1` and print no condition line at all.
* **`condition-tier-thresholds`** ✓ thresholds, red-wrap and all seven strings resolve exactly;
  ladder present in web at `§1t17s0§.as:1005-1025`.
* **`affix-suffix-pool-and-counts`** ✓ 13 pools × 8 = 104/104, `MAXINDEX=79`, both dice tables,
  legendary `-1`. ⚠ The "shipped bug" reading is an over-read: FIREDEF←water, WINDDEF←earth,
  WATERDEF←wind, EARTHDEF←fire is a consistent **opposing-element** naming scheme, i.e. intentional.
* **`stat-vs-level-curve`** ✓ both itemdata rows byte-exact; `getMaxTier` and prog1-5 exact.
  ⚠ 158 rows carry mindamage/maxdamage but only **155** carry `minlvl`; the `+10` spike is applied to
  prog1/prog2/prog3 only (`:157,:164,:171`), **not** prog4/prog5.
* **`paperdoll-is-13-slots-not-9`** ✓ frame gives exactly 9 boxes in the stated order; code gives
  `Vector.<Item>(13)` + 13 `EQ_` constants + 11-arg `initMCS`. **Strengthened:** the web v0.717 build
  has the same 13-slot vector (`§1t1523s0§.as:132`), so this is not an Android-only fact.
  ⚠ A 9-slot builder loses **four** slots, not three — hair, head, **neck**, scabbard.
* **`eq-comparison-frame-payload-identity`** ✓ identity is exact and unique: `<name>4041</name>` has
  a single hit in the whole file (`itemdata.xml:7909` → id 13002), `strings.json["4041"] = "Branch"`,
  dmg 1-2, weight 1; hexes `#00A606`/`#FF0000` at `Item.as:759-774`.
  ⚠ **Crop defect:** the stated box does not contain `BRANCH` or `LEVEL 1`, and they are to the left,
  not under. Everything else in the quote is in the box.
* **`modifier-id-stat-table`**, **`slashusage-stancerestriction-omitted`**,
  **`item-save-format-held`** (Item.parse is genuinely the inventory/stash load path —
  `StatsManager.as:4555,:4597,:4793`), **`soul-infusion-is-code`**, **`weight-cap-is-a-base-not-a-cap`**,
  **`sell-price-corrects-section3-item9`** — all verified first-hand, no corrections.
* **`per-item-art-payload-unknown`** — correct STILL_UNHELD, and **stronger than stated**. I counted
  part-symbol classes in both bundles: exactly one default per namespace (hair/head/weapon have 2),
  **zero** `acc*`, one `item0`. And `useExternalResource` is hard-set `true`
  (`StatsManager.as:360`, `:508`), so 100% of MCS art resolves through `ResourceManager` — i.e. into
  the encrypted CWS blobs of S0-5. Not "fires when true"; it is the only path.
