# items-equipment — HUNTER LENS review (blind critic)

Reviewer opened every artifact listed below first-hand. No verdict here rests on the
surveyor's text. §0 law applied: A1 = frame I cropped myself, A2 = payload/AS3 line I
read myself, A5 = none used.

---

## HEADLINE

Two of the surveyor's claims are **REFUTED as WRONG** (not merely thin), and **both
STILL_UNHELDs fall** — one of them completely.

| # | What | Verdict |
|---|------|---------|
| 1 | `ui-slot-mapping-unknown` — "cannot be established" | **REFUTED.** It is established, in **both** builds, at named line numbers. |
| 2 | `no-separate-icon-manifest` — "there is no separate icon art set" | **REFUTED.** There are two icon-only symbol namespaces (`item*`, `acc*`) with no paperdoll counterpart, covering **187 of 982** rows. |
| 3 | `purple-border-is-unique-not-rarity` | **REFUTED.** The border **is** the 4-tier rarity ladder — `ShopItem.borderType = getShopItemType()`. |
| 4 | `modifier-id-stat-table` — "fully resolved" | **REFUTED.** 9 of the 34 distinct modifier IDs in `itemdata.xml` resolve to nothing. |
| 5 | `per-item-art-payload-unknown` | **Downgraded to PARTIAL.** The disjunction is now settled and the missing file is *named*. |

Everything else held under first-hand inspection. The surveyor's two best finds —
`defense-min-floor-is-wrong` and `weight-cap-is-a-base-not-a-cap` — are exactly right
and I confirmed both byte-for-byte.

---

## 1. HUNTER KILL — `ui-slot-mapping-unknown` is HELD, in both builds

The surveyor wrote: *"Which of EQ_NECK / EQ_ACCESSORY1 / EQ_ACCESSORY2 the two visually
identical empty ring boxes map to cannot be established."*

It can. `InventoryUI` names all nine boxes and fixes their order:

```
reference/decompiled/shs3_android/scripts/InventoryUI.as:163-179
      internal var SLOT_HAT:int = 0;
      internal var SLOT_MASK:int = 1;
      internal var SLOT_ARMOR:int = 2;
      internal var SLOT_GLOVES:int = 3;
      internal var SLOT_PANTS:int = 4;
      internal var SLOT_WEAPON:int = 5;
      internal var SLOT_RING1:int = 6;
      internal var SLOT_SHOES:int = 7;
      internal var SLOT_RING2:int = 8;

InventoryUI.as:527    tempShopItem = this.equippedSlots[this.SLOT_RING1];   // case 7: EQ_ACCESSORY1
InventoryUI.as:535    tempShopItem = this.equippedSlots[this.SLOT_RING2];   // case 8: EQ_ACCESSORY2
InventoryUI.as:824-829  case SLOT_RING1: removeEquipment(EQ_ACCESSORY1)
                        case SLOT_RING2: removeEquipment(EQ_ACCESSORY2)
InventoryUI.as:268-269  equippedSlots[SLOT_RING1] = this.equipAccessory1;
                        equippedSlots[SLOT_RING2] = this.equipAccessory2;
```

**Not an Android-only fact.** The web v0.717 build carries the identical structure with
the timeline instance names un-obfuscated:

```
reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:175-193
      internal var §1t6002s0§:int = 0;   … §1t6010s0§:int = 8;   §1t6011s0§:int = 9;
reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:281-289
      §1t6012s0§[§1t6002s0§] = this.equipHat;
      §1t6012s0§[§1t6008s0§] = this.equipAccessory1;   // index 6
      §1t6012s0§[§1t6009s0§] = this.equipShoes;        // index 7
      §1t6012s0§[§1t6010s0§] = this.equipAccessory2;   // index 8
reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:37,39  public var acc1Icon / acc2Icon:MovieClip;
```

**The frame agrees, and I opened it.**
`reference/frames/s21_weapon/t708.0.png`, crop `(200,850)-(800,990)` upscaled ×2 LANCZOS:
a ring-outline placeholder, then the sandals (filled), then a second identical ring
outline. Reading the whole paperdoll left→right, top→bottom in crop `(170,240)-(870,1040)`
×2 gives hat · mask · armor · gloves · pants · pickaxe · **ring** · sandals · **ring** —
which is `SLOT_` index order 0…8 *exactly*.

**Answer:** left ring box = `EQ_ACCESSORY1`, right ring box = `EQ_ACCESSORY2`.
**`EQ_NECK` has no UI box at all** — and the icon dispatcher confirms it independently
(see §2: ids 10000–10999 fall through `ShopItem.setItemID` with no setter).
No frame/doc disagreement here; the doc was simply silent.

---

## 2. REFUTED — the "item icon manifest" is a real, separate art set

The surveyor's claim: *"the icon IS the paperdoll part stack … there is no separate icon
art set to recover."* That is true only for the eight wearable bands. Two bands use
symbol namespaces that **do not exist on the paperdoll**:

```
reference/decompiled/shs3_android/scripts/MCSItem.as:203-210
      public function setConsumable(id:int) : *
      {
         this.clearItem();
         this.displayItem = this.getMCSComponent("item",id);      <-- "item<art>" namespace
         if(this.displayItem == null) { this.displayItem = new item0(); ... }

reference/decompiled/shs3_android/scripts/MCSItem.as:226-233
      public function setAccessory(id:int) : *
      {
         this.displayItem = this.getMCSComponent("acc",id);       <-- "acc<art>" namespace
         if(this.displayItem == null) { this.displayItem = new AccessoryDummyIcon(); ... }
```

`item*` and `acc*` are **not** among the 27 `PART_*` names and are never used by
`MCSCharacter`. They are icon-only art.

The full dispatcher (`ShopItem.as:134-199`) is itself a finding the surveyor never
reported — the item-ID band table:

| id band | setter | art namespace | rows in itemdata.xml |
|---|---|---|---|
| 2000–2999 | `setConsumable` | **`item*`** | 99 |
| 3000–3999 | `setAccessory` | **`acc*`** | 9 |
| 4000–4999 | `setArmor` | stomach/pelvic/torso/uparm/lowarm | 152 |
| 5000–5999 | `setGloves` | hand | 35 |
| 6000–6999 | `setHair` | hair | 73 |
| 7000–7999 | `setHat` | hat | 98 |
| 8000–8999 | `setHead` | head | 38 |
| 9000–9999 | `setMask` | mask | 60 |
| **10000–10999** | **none — falls through, no icon** | — | 14 |
| 11000–11999 | `setPants` | crotch/thigh/calf | 93 |
| 12000–12999 | `setShoes` | foot | 55 |
| 13000–13499 | `setWeapon` | weapon | 177 |
| 20000–29999 | `setConsumable` | **`item*`** | 79 |

Counts measured this run over `reference/extracted/itemdata.xml` (982 rows, 0 unaccounted).
**187 rows (99 + 9 + 79) need `item*`/`acc*` icon symbols with no paperdoll equivalent.**
The icon manifest half of ledger blocker ⑤ is **still open**.

Secondary correction: the miss case is not one class but eight —
`HatDummyIcon`, `MaskDummyIcon`, `WeaponDummyIcon`, `AccessoryDummyIcon`,
`GlovesDummyIcon`, `ShoesDummyIcon`, `ArmorDummyIcon`, `PantsDummyIcon`
(`MCSItem.as:70, 158, 183, 232, 255, 285, 330, 368`).

---

## 3. REFUTED — the border **is** the rarity ladder

Claim: *"The purple item border … is the UNIQUE flag, not a rarity tier … border tracks
`<unique>`, text colour tracks the 4 tiers."* Backwards.

```
reference/decompiled/shs3_android/scripts/ShopItem.as:51-52
         this.borderType = itemRef.getShopItemType();
         gotoAndStop(this.borderType + "_default");
```

`getShopItemType()` (`Item.as:382-405`) is the *same* function that returns the four
tiers `"unique" / "rare" / "special" / "normal"`. The border frame label **is** the tier
string. "unique" is one of the four tiers, not a parallel flag. The game's own tip strings
say so for three of the four:

```
reference/decompiled/shs3_android/scripts/GameEngine.as:558  "Tip: A green border indicates that an item is special."
reference/decompiled/shs3_android/scripts/GameEngine.as:566  "Tip: A blue border indicates that an item is rare."
reference/decompiled/shs3_android/scripts/GameEngine.as:572  "Tip: A purple border indicates that an item is unique."
```

The surveyor quoted only line 572 and read the other two out of the picture. A builder
following the stated `lane_impact` would ship a purple border and flat borders for
special/rare — visibly wrong. The narrow observation (purple ⇒ unique) survives; the
*conclusion drawn from it* does not.

---

## 4. REFUTED — "fully resolved" modifier table is not fully resolved

Measured over `reference/extracted/itemdata.xml` this run: 412 `<modifier>` rows, 34
distinct ids —
`[0,1,2,3,5,6,7,8,9,12,13,15,25,38,78,79,82,84,90,96,97,98,99,101,102,103,104,105,106,117,122,123,124,40000]`.

The cited table (`XMLItem.as:231-298`) covers ids 0–16 plus the `>100 && <2000` Set band.
Cross-checking the remainder against `StatsManager` STAT_ constants (`StatsManager.as:170-260`):

- `25` → `STAT_DAN`, `38` → `STAT_BUFFTYPE` — real stats, but **absent from the display switch**, so they are not "readable stat grants" via the cited table.
- `78, 79, 84, 90, 96, 97, 98, 99, 40000` → **no STAT_ constant, not in 0–16, not in 101–1999, not among the six reserved ids (80/81/82/83/89/125)**. They hit `XMLItem.as:296  trace("ErrorValue: " + …)`.

That is **9 unresolved ids across 12 of the 412 rows**. Small in volume, but the claim's
load-bearing word is *fully*, and the `lane_impact` sentence ("the 412 `<modifier>` rows …
become readable stat grants instead of opaque numbers") is false for those rows. The
344 rows in the Set band are fine.

---

## 5. Downgraded — `per-item-art-payload-unknown` is PARTIAL, not STILL_UNHELD

The surveyor left a disjunction open: obfuscated in the web SWF, *or* inside the encrypted
CWS blobs. I settled it.

**Exhaustive symbol scan of both decoded payloads** (zlib-inflated `CWS` body, regex over
the whole ABC string pool):

```
shs3_payload_decoded.swf          (web  v0.717, 6,880,328 B inflated) -> 20 part symbols
shs3_android_payload_decoded.swf  (mobile v0.682, 15,142,649 B inflated) -> 20 part symbols
both identical: calf11000 crotch11000 foot12000 hair6000 hair6001 hand5000 hat7000
                head8000 head8004 lowarm4000 mask9000 neck10000 pelvic4000 prop13000
                stomach4000 thigh11000 torso4000 uparm4000 weapon13000 weapon13002
```

The lookup contract is a *literal* name resolve (`partType + art.toString()`), so any
shipped art symbol must appear verbatim in the constant pool. Exactly 20 do, in both
builds. **The per-item art is not in either SWF, obfuscated or otherwise.**

Where it *is* — and it has a name:

```
reference/decompiled/shs3_android/scripts/StatsManager.as:360
      public static var useExternalResource:Boolean = true;
reference/decompiled/shs3_android/scripts/ResourceManager.as:41
      internal static var resourceFileNameArray:Array =
        ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"];
reference/decompiled/shs3_android/scripts/ResourceManager.as:238-252
      public static function getMCSComponent(partType:String, id:int) : MovieClip
      { … var mcname:String = partType + id.toString();
        if(!applicationDomain.hasDefinition(mcname)) return null; … }
```

Those five filenames map 1:1 onto the five S0-5 encrypted blobs
(`115_Mobile_SHS3Resource`, `113_Mobile_MusicResource`, `122_Mobile_SoundResource`,
`124_Mobile_ImageResource`, `120_Mobile_BGResource`). I re-tested the encryption myself —
all five carry a `CWS` magic followed by non-zlib bytes and fail `zlib.decompress`
(`Error -3: incorrect header check` / `unknown compression method`). **S0-5 holds: held,
not recovered.**

Also measured: only **146 rows carry an explicit `<art>` override (68 distinct values,
max 20052)**; every other item resolves art = its own id. So the missing set is
"one symbol per wearable/consumable id", not 982 hand-authored pieces.

---

## Corrections to claims that otherwise HELD

**`sprite-compositing-contract-held`** — the 27 `PART_*` constants are real, but
`MCSCharacter` only *allocates* 23 of them:

```
MCSCharacter.as:120   internal var partListLength:int = 22;
MCSCharacter.as:141   for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }
```

Indices 23–26 (`PART_l_shoulder`, `PART_r_shoulder`, `PART_l_knee`, `PART_r_knee`) and
`PART_prop3` (22) are creature-rig extras — the only consumers are `MCSWolf.as:148,184,188,193,197`,
which raises `partListLength = 25` in its own constructor (`MCSWolf.as:13`). **The human
z-order stack is 23 deep, not 27.**
Also, `setArmor` drives **8** parts, not 7 — `neck` is added conditionally at
`MCSCharacter.as:1071-1083` (`if(componentObject != null) neck.addChild(...)`).

**`sell-price-formula` / `sell-price-corrects-section3-item9`** — the formula is verbatim
correct in both builds, but `getWeight()` is **stack weight**:

```
reference/decompiled/shs3_android/scripts/Item.as:1564-1568
      public function getWeight() : int
      { if(this.weight != -1) { return this.weight * this.getQuantity(); } … }
```

So the `>= 10` step in `getSellAmt()` trips on `unit weight × quantity` on every call
after the first (the first call, with `weight == -1`, returns the raw XML weight — a
shipped inconsistency). A builder implementing the threshold on unit weight will misprice
stacks.

**`stat-vs-level-curve`** — the `+10` spike at `MAXINDEX` applies to `prog1`, `prog2`,
`prog3` **only**; `prog4` and `prog5` have no spike (`ItemGenerator.as:157, 164, 171` vs
`:172-183`). `MAXINDEX = 79` confirmed at `ItemGenerator.as:58`. Also: 158 rows carry
`mindamage`/`maxdamage`, but only **122** carry `<minlvl>` (177 rows are `<type>9</type>`).

**`affix-suffix-pool-and-counts`** — 13 pools × 8 tiers = 104 + 104 confirmed verbatim.
But the "shipped bug" in `lane_impact` is an unsupported inference. The elemental-DEF
remap at `ItemGenerator.as:142-145` is a *consistent 4-cycle* —
FIREDEF←water, WATERDEF←wind, WINDDEF←earth, EARTHDEF←fire — i.e. each defence channel is
named after the element that counters it. That reads as deliberate naming, not copy-paste.
Nothing in the artifact establishes it as a bug.

**`rarity-is-derived-not-a-field`** — the six colours are byte-exact in both builds
(verified `§1t17s0§.as:683,687,691,704,708,712`). But the web v0.717 build has a
**seventh and eighth colour the Android build lacks**, gated on an `xp` field:

```
reference/decompiled/shs3_payload/scripts/§1t17s0§.as:677-680   if(this.xp != null) _loc1_ += "<font color=\"#ff9900\">";   // loot toast
reference/decompiled/shs3_payload/scripts/§1t17s0§.as:698-701   else if(this.xp != null) _loc1_ += "<font color=\"#ff6600\">";  // inventory
```

`grep -n "ff9900\|ff6600" shs3_android/scripts/Item.as` returns nothing. So the S0-3
parity caveat is **not** removed for this surface — it is inverted: the web build carries
a state the Android build does not.

---

## New identity the surveyor missed (frame ↔ payload)

The surveyor matched the *tooltip* item. The **equipped** item matches too, and it is the
stronger check because it is visible as art, not text.

Crop `(1300,230)-(1800,330)` ×3 LANCZOS of `reference/frames/s21_weapon/t708.0.png` reads
`DMG: 1 - 2 (EQ: 1 - 3)` with the `2` in red, and `WEIGHT: 1`. The paperdoll weapon box in
crop `(170,240)-(870,1040)` ×2 visibly holds a **pickaxe**. Searching
`reference/extracted/itemdata.xml` for `mindamage 1 / maxdamage 3` returns exactly three
rows — 13001 "Stick" (w 1), 13003 "Bamboo" (w 1), **13022 "Pickaxe" (weight 10)**. The art
picks the winner. Names via `docs/gauntlet/L0/index/strings.json`.

So the frame carries **two** independent payload identities: tooltip = id 13002 "Branch"
(name 4041, mindamage 1, maxdamage 2, weight 1 — the *only* row named 4041), equipped =
id 13022 "Pickaxe". The pickaxe's `weight 10` also lands exactly on the `getWeight() >= 10`
branch of `getSellAmt()`, so the frame incidentally exercises the sell-price step.

One frame detail remains unexplained and I am not going to guess at it: the item panel
shows `LEVEL 1` under the Branch icon, but 13002 has `<minlvl>-4</minlvl>` and no
`<levelrestriction>`, and the only `LangManager.getString(124)` ("Level Required")
render sites (`Item.as:1104, 1304`) wrap it in `#FF0000` — the on-screen text is cream.
STILL_UNHELD.

---

## Verdict summary

- Refuted (material): `no-separate-icon-manifest`, `purple-border-is-unique-not-rarity`, `modifier-id-stat-table`, `ui-slot-mapping-unknown`
- Refuted (minor): `per-item-art-payload-unknown` (disjunction settled; blocker survives)
- Held with correction (minor): `sprite-compositing-contract-held`, `sell-price-formula`, `sell-price-corrects-section3-item9`, `stat-vs-level-curve`, `affix-suffix-pool-and-counts`, `rarity-is-derived-not-a-field`
- Held clean: `condition-has-no-damage-multiplier`, `condition-tier-thresholds`, `item-save-format-held`, `paperdoll-is-13-slots-not-9`, `defense-min-floor-is-wrong`, `weight-cap-is-a-base-not-a-cap`, `eq-comparison-frame-payload-identity`, `slashusage-stancerestriction-omitted`

Score impact: the ledger blocker ⑤ is **half alive** (compositing dead, icon manifest
open), which the 78 does not reflect; against that, the slot-mapping STILL_UNHELD is dead
and the art-payload location is now named. Net: 78 is defensible but for different
reasons than the rationale gives.
