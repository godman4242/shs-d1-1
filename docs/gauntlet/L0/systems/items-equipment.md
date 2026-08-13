# GAUNTLET L0 — system survey: **items-equipment**

Ledger under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20), §2 row
`items-equipment | 42`, §4 block `### items-equipment — 42`, plus the §6
"structurally UNRECOVERABLE" list.

Surveyor run: 2026-08-13. Every claim below carries exactly one artifact class
(A1 frame / A2 payload / A3 byte-check / A4 measured ledger w/ own frame cite /
A5 owner LOOK verdict) or is marked STILL_UNHELD.

---

## 0. The find that re-frames this whole lane

`reference/decompiled/shs3_android/` is a **970-class, UNOBFUSCATED** decompile of
the Android build (`reference/preservation/shs3_android_payload.swf`, 15,142,649 bytes;
decoded copy at `reference/decrypted/shs3_android_payload_decoded.swf`). Class names
are intact: `Item.as`, `ItemGenerator.as`, `XMLItem.as`, `StatsManager.as`,
`MCSCharacter.as`, `ShopUI.as`, `CraftingUI.as`.

Every "blocker" in §4's items-equipment block is a *rule* question, and the rules
are AS3 source we already hold. **Five of the five blockers move.**

Additionally, running a SWF `DefineBinaryData` (tag 87) + `SymbolClass` (tag 76)
walk over the decoded Android payload yields **42 embedded binaries** that the web
payload's 27-file `reference/extracted/bindata/` does NOT contain, including:

```
111 Mobile_ItemData          184044  <?xml version="1  (= itemdata.xml, 184002 B in reference/extracted)
114 Mobile_AchievementData     9080
116 Mobile_QuestData         796384
118 Mobile_Lang_EN           500024  UTF-16LE  <xliff version="1.0" xml:lang="en">
121 Mobile_PremiumData         4504  <premiumdata>
```

`118_Mobile_Lang_EN` decodes to a **2,555-entry XLIFF English string table**
(ids 0–2554). This is a *partial* crack of the gauntlet's standing string-table
blocker — see claim `string-table-partial` below for exactly what it does and does
not close.

---

## 1. Claims

### C1 — `paperdoll-13-slots` · A2 · **OVERTURNS LEDGER**

Ledger §4 Ready bullet: *"9-slot paperdoll"*. The payload says **13**.

`reference/decompiled/shs3_android/scripts/StatsManager.as:108`
```as3
public static var equipment:Vector.<Item> = new Vector.<Item>(13);
```
`StatsManager.as:262-286`
```as3
internal static var EQ_ARMOR:int = 0;
internal static var EQ_GLOVES:int = 1;
internal static var EQ_HAIR:int = 2;
internal static var EQ_HAT:int = 3;
internal static var EQ_HEAD:int = 4;
internal static var EQ_MASK:int = 5;
internal static var EQ_NECK:int = 6;
internal static var EQ_PANTS:int = 7;
internal static var EQ_SHOES:int = 8;
internal static var EQ_WEAPON:int = 9;
internal static var EQ_SCABBARD:int = 10;
internal static var EQ_ACCESSORY1:int = 11;
internal static var EQ_ACCESSORY2:int = 12;
```
Three of the 13 (HEAD, NECK, SCABBARD) are excluded from the weight/stat rollups
(`StatsManager.as:2002`, `:2038`, `:1945` — `if(q != EQ_HEAD && q != EQ_NECK && q != EQ_SCABBARD)`),
which is probably where "9" came from — but they are still equipment slots that
render on the character.

**Verdict: HELD (ledger corrected 9 → 13).**

---

### C2 — `type-is-slot-index` · A2 · UNDER-CLAIM (ledger never had this)

`<type>` in `itemdata.xml` is not a taxonomy label — it is **the equipment array
index**. `reference/decompiled/shs3_android/scripts/Item.as:841-843`
```as3
var itemType:int = itemXML.type;
var itemModifierArray:Array = this.getModifierArray();
var equippedItem:Item = StatsManager.equipment[itemType];
```
Cross-checking every one of the 982 `<item>` blocks in
`reference/extracted/itemdata.xml` gives a perfectly clean id-range → slot map:

| id range | `<type>` | slot | items |
|---|---:|---|---:|
| 4xxx | 0 (absent ⇒ 0) | ARMOR | 152 |
| 5xxx | 1 | GLOVES | 35 |
| 6xxx | 2 | HAIR | 73 |
| 7xxx | 3 | HAT | 97 |
| 8xxx | 4 | HEAD | 38 |
| 9xxx | 5 | MASK | 60 |
| 10xxx | 6 | NECK | 14 |
| 11xxx | 7 | PANTS | 93 |
| 12xxx | 8 | SHOES | 55 |
| 13xxx | 9 | WEAPON | 177 |
| 2xxx | 10 | consumable (not equippable) | 98 |
| 3xxx | 11 | ACCESSORY | 9 |
| 20xxx | 12 | quest item | 79 |

One anomaly: exactly **1** item in the 7xxx (hat) range carries `type 0` (armor) —
an authoring slip in the original data, worth reproducing verbatim rather than
"fixing".

`Item.as:845` — `if(itemType != 10 && itemType != 12)` — is the guard that stops
consumables and quest items from printing damage/defense lines.

**Verdict: HELD.**

---

### C3 — `affix-suffix-pool` · A2 · **OVERTURNS LEDGER (blocker ④, first half)**

Ledger §4 Blockers: *"④ affix **suffix** pool + per-rarity affix count."*
The suffix pool is 8 tiers × 17 stats, verbatim, in
`reference/decompiled/shs3_android/scripts/ItemGenerator.as:102-127`:

```as3
var maxhp_pre:Array = ["Vital","Rugged","Tough","Earthy","Dynamic","Wayfarer's","Survivor's","Guardian's"];
var maxhp_suf:Array = ["of Health","of Fortitude","of Vitality","of Constitution","of Resilience","of Longevity","of Life","of the Ox"];
var attack_pre:Array = ["Sharp","Fierce","Vicious","Savage","Brutal","Deadly","Fine","Warrior's"];
var attack_suf:Array = ["of Attack","of Biting","of Striking","of Killing","of Slaughter","of Slaying","of Carnage","of the Butcher"];
var speed_pre:Array = ["Fast","Quick","Nimble","Hasty","Swift","Whistling","Lizard's","Snake's"];
var speed_suf:Array = ["of Speed","of Alacrity","of Haste","of Velocity","of Acceleration","of Sleight","of Swiftness","of Quickness"];
var windatk_pre:Array = ["Drafty","Gusty","Gale","Stormy","Howling","Roaring","Shocking","Glowing"];
var windatk_suf:Array = ["of Air","of Wind","of the Tempest","of the Typhoon","of the Cyclone","of the Tornado","of Shock","of Storms"];
var piercingdmg_suf:Array = ["of Piercing","of Piercing","of Piercing","of Piercing","of Piercing","of Piercing","of Piercing","of Piercing"];
```
(11 more pools in the same block: hpregen, maxchi, chiregen, defense, fireatk,
wateratk, earthatk, criticaldmg.)

Tier selection is `num = Math.floor(i / 10)` over `MAXINDEX + 1 = 80` item levels
(`ItemGenerator.as:128-148`), i.e. **8 name tiers, one per 10 levels**.

Elemental-DEFENSE affixes deliberately borrow the *opposing* element's word pool
(`ItemGenerator.as:142-145`): `preSufArray[FIREDEF] = wateratk_pre/suf`,
`[WINDDEF] = earthatk`, `[WATERDEF] = windatk`, `[EARTHDEF] = fireatk`.

The full item-name template is `ItemGenerator.as:733-749`: 0 mods → basename;
1 → prefix+base; 2 → prefix+base+suffix; 3 → prefix(mod2)+prefix(mod0)+base+suffix(mod1);
4+ → prefix(mod3)+prefix(mod2)+prefix(mod0)+base+suffix(mod1).

**Verdict: HELD. Blocker ④ first half is closed.**

---

### C4 — `affix-count-rule` · A2 · **OVERTURNS LEDGER (blocker ④, second half)**

`ItemGenerator.as:206-252` gives the exact per-rarity affix-count distribution:

```as3
internal function getEnchantmentCount(isRareItem:Boolean) : int
{
   if(isRareItem)
   {
      dice = this.rng.rand(11);
      if(dice <= 3) return 2;
      if(dice <= 6) return 3;
      if(dice <= 9) return 4;
      if(dice == 10) return 5;
      return 0;
   }
   dice = this.rng.rand(100);
   if(dice <= 84) return 0;
   if(dice <= 89) return 1;
   if(dice <= 93) return 2;
   if(dice <= 96) return 3;
   if(dice <= 98) return 4;
   return 5;
}
```
Legendary items take one fewer when the roll exceeds 2 (`ItemGenerator.as:371-374`).

**Verdict: HELD. Blocker ④ is fully closed.**

---

### C5 — `stat-vs-level-curve` · A2 · **OVERTURNS LEDGER (blocker ①)**

Ledger §4 Blockers: *"① item stat-magnitude **vs level** curve."* It is five
closed-form arithmetic progressions over 80 tiers, `ItemGenerator.as:150-183`:

```as3
var maxtier:int = MAXINDEX + 1;      // 80
base = 1; inc = 3 / 3;   prog1[i] = Math.floor(base + inc * i);  prog1[79] += 10;   // ATTACK / DEFENSE
base = 5; inc = 5 / 3;   prog2[i] = Math.floor(base + inc * i);  prog2[79] += 10;   // MAX HP / MAX CHI
base = 1; inc = 1 / 3;   prog3[i] = Math.floor(base + inc * i);  prog3[79] += 10;   // regen, all 8 elementals, CRIT DMG
base = 1; inc = 2 / 3;   prog4[i] = Math.floor(base + inc * i);                     // SPEED
base = 1; inc = 1 / 5;   prog5[i] = Math.floor(base + inc * i);                     // PIERCING DMG
```
Roll: `modvalue = prog[maxTier-1] + rng.rand(prog[maxTier] - prog[maxTier-1])`
(`ItemGenerator.as:474-490`), with tier drawn by
```as3
internal function getMaxTier(nodelvl:int, getHighestTier:Boolean) : int
{
   var tier:int = nodelvl + 1;   // clamped to [0, 79]
   if(getHighestTier) { tier = this.rng.rand(4) + tier - 3; ... return tier; }
   tier = this.rng.rand(10) + tier - 9; ...
}
```
i.e. the **first** rolled affix on an item uses a tight `-3..0` band off the node
level; every later affix uses a loose `-9..0` band. Weapon ATTACK and armor
DEFENSE additionally subtract the item's own `<minlvl>` before tiering
(`ItemGenerator.as:465-472`).

The per-slot allowed-affix masks are literal 17-bit arrays, `ItemGenerator.as:397-428`:
```as3
if(itemType == WEAPON)        pot = [1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,1,1];
else if(itemType == ARMOR)    pot = [1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1];
else if(itemType == GLOVES)   pot = [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0];
else if(itemType == PANTS)    pot = [1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0];
else if(itemType == SHOES)    pot = [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0];
else if(itemType == HAT)      pot = [1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0];
else if(itemType == MASK)     pot = [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0];
else if(itemType == ACCESSORY)pot = [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1];
```
with a forced first affix per slot (`ItemGenerator.as:432-452`): ARMOR→DEFENSE,
WEAPON→ATTACK, SHOES→SPEED, everything else random.

**Verdict: HELD. Blocker ① is closed.**

---

### C6 — `pot-mask-frame-confirmed` · A1 · corroborates C5

**The frame is the check, and the frame agrees with the code.**
`reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0031.jpg`
(1024×576; crop `(575,140)-(1015,420)`, upscaled 3× LANCZOS).

Visible: a green-bordered inventory icon, green item name **PANTS**, `OWNED: 0`,
`LEVEL 4`, and the stat list
`DEFENSE: +1 (EQ: 3)` · `FIRE DEF: +1 (EQ: 0)` · `WIND DEF: +2 (EQ: 0)` ·
`EARTH DEF: 0 (EQ: 1)` · `CRITICAL DAMAGE: 0 (EQ: 1)` · `MAX CHI: 0 (EQ: 5)` ·
`CHI REGEN: 0 (EQ: 2)` · `WEIGHT: 5`.

That set is *exactly* the PANTS mask `[1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0]`:
elemental **DEF** present, elemental **ATK** absent (indices 7–10 = 0), **PIERCING
absent** (index 16 = 0), CRIT DMG present (index 15 = 1). Red/green digit tinting
matches `Item.compareValue` (`Item.as:759-775`, `#00A606` better / `#FF0000` worse).

**Verdict: HELD.**

---

### C7 — `condition-has-no-damage-multiplier` · A2 · **OVERTURNS LEDGER (blocker ②)**

Ledger §4 Blockers: *"② condition→DMG **multiplier** (current "evidence" confounds
condition with a 2-level gap)."* There is no multiplier to find. Weapon condition
is **binary** at the damage layer.

`StatsManager.as:1863-1888`
```as3
if(itemdata == null || equipment[EQ_WEAPON].isBroken())
{
   basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + 1;
}
else
{
   basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + itemdata.mindamage;
}
```
`StatsManager.as:1890-1903` — `getDamageRange()` returns `0` when broken, else
`itemdata.maxdamage - itemdata.mindamage`. A broken weapon therefore deals a flat
`ATTACK + bonus + 1`; a 1%-condition weapon deals **identical damage to a
100%-condition one**.

Condition itself is display-only (`Item.as:712-745`) over a 0–100 percentage:
```as3
public function getCondition() : int {
   maxDurability = itemXML.durability + this.getModifierBonus(83);
   var val:int = (maxDurability - this.uses) / maxDurability * 100;
   ...
}
```
with **six** display bands, not the ledger's unnumbered "condition tier names":
`uses == 0` → string 639; `uses == 1` → 392; `condition == 0` → 387 (rendered red);
`< 25` → 388; `< 50` → 389; `< 75` → 390; else 391.
Broken test: `Item.as:1467-1479` — `return this.uses >= itemXML.durability + this.getModifierBonus(83);`

**Verdict: HELD. Blocker ② is dissolved — the question it asks has no answer
because the mechanic does not exist. Do not encode a condition multiplier.**

---

### C8 — `sell-price-formula` · A2 · PARTIAL (blocker ③)

Ledger §4 Blockers: *"③ sell-price formula."* Ledger §3 correction #9 says
*"Sell price is NOT flat per item — it scales with rarity/level (same sword 5c and 25c)."*

What the Android build actually does:
- Sell payout is the slot's `value` (`ShopUI.as:540` — `StatsManager.changeGold(this.displayItem.getCost());`,
  fed from `ShopUI.as:393` — `slot.setCost(this.currentItemList[index].value, this.currentItemList[index].hvalue);`).
- For an inventory item the vendor does not stock, `value` = the item's `<baseprice>`
  (`ShopUI.as:257` — `xmlShopItem = XMLShopItem.create(itemData.id,itemData.gvalue,itemData.desc);`
  and `XMLShopItem.as:31` — `this.value = itemData.gvalue;`).
- For **procedurally generated rare stock**, `XMLShopItem.as:68` and `:86`:
  ```as3
  this.value = itemData.gvalue + this.item.getLevel() * 100;
  ```
  where `Item.getLevel()` (`Item.as:274-300`) = `max(over modifiers) getModTier(...)+1`,
  floored by `<minlvl>` and capped at `StatsManager.levelCap`. **That** is the
  rarity/level scaling §3 observed.
- `ShopUI.as:58` declares `internal var sellPercentage:Number = 0.5;` — and a grep
  across all 970 Android classes finds **the declaration and nothing else**. The
  50%-of-value sell haircut is dead code in this build.

Caveat kept honest: this is the Android build. The web v0.717 sell path may differ,
and `nodrop` items are excluded from the sell list entirely (`ShopUI.as:258-265`).

**Verdict: PARTIAL — the buy/stock valuation formula is HELD verbatim; whether the
shipped web build applied a 0.5 sell multiplier is STILL_UNHELD.**

---

### C9 — `art-manifest-rule` · A2 · PARTIAL (blocker ⑤, icon-manifest half)

Ledger §4 Blockers: *"⑤ … + item **icon manifest**."* The manifest is not a list —
it is a **naming rule**, and we hold it.

`MCSCharacter.as:580-616` (identical body in `MCSItem.as:406-437`, `MCSBust.as`):
```as3
internal function getMCSComponent(partType:String, id:int) : MovieClip
{
   var xmlItem:XMLItem = QuestEngine.getItemData(id);
   art = (xmlItem == null) ? id : xmlItem.art;
   if(StatsManager.useExternalResource) return ResourceManager.getMCSComponent(partType,art);
   if(getDefinitionByName(partType + art.toString()))
      ClassDefinition = Class(getDefinitionByName(partType + art.toString()));
   else
      ClassDefinition = Class(getDefinitionByName(partType + "0"));
   ...
}
```
`XMLItem.as:110-117` — when `<art>` is absent, **`art` defaults to the item id**.
So the symbol name for any of the 982 items is computable today:
`partType + (art ?? id)`, with fallback `partType + "0"`.

The 18 `partType` prefixes are enumerated at the call sites (`MCSItem.as:67-392`):
`hat, hair, head, mask, weapon, item, acc, hand, foot, foottop, stomach, pelvic,
torso, uparm, lowarm, thigh, calf, crotch, neck`.

`reference/extracted/itemdata.xml` carries 146 explicit `<art>` values across 40
distinct ids (range 2122–20052) — the rest resolve by the id default.

The naming rule is directly corroborated by extracted asset names:
`reference/extracted/sprites/` contains `DefineSprite_2643_weapon13000`,
`DefineSprite_2642_weapon13002`, `DefineSprite_2647_torso4000`,
`DefineSprite_2649_thigh11000`, `DefineSprite_2675_foot12000`,
`DefineSprite_2673_foottop12000`, `DefineSprite_2679_calf11000`,
`DefineSprite_2657_mask9000`, `DefineSprite_2666_hat7000`,
`DefineSprite_2669_hair6001`, `DefineSprite_2671_hair6000`,
`DefineSprite_2661_item0` — the **12 default/fallback part symbols**, already
extracted, with 1,822 SVGs in `reference/extracted/shapes/`.

What is still missing: the per-item vector art for the other ~970 items lived in
external resource SWFs (`useExternalResource` → `ResourceManager`), fetched from
the dead server on web. The Android build embeds them as
`115_Mobile_SHS3Resource` (654,169 B) and `120_Mobile_BGResource` (4,204,635 B),
both **CWS-headered but not zlib-decompressible** (header scrambled the same way
the outer payload was, and `reference/decrypted/` only ever decoded two web-payload
binaries). Two decode attempts failed; stopping there per stuck-stop.

**Verdict: PARTIAL — the manifest RULE and the 12 default symbols are HELD; the
per-item art is one SWF-descrambling task away, not an unknown.**

---

### C10 — `compositing-part-order` · A2 · PARTIAL (blocker ⑤, layer-order half)

`MCSCharacter.as:8-60` enumerates the 27-part rig:
```as3
public static var PART_l_hand:int = 0;      PART_l_uparm 1;   PART_l_lowarm 2;
public static var PART_weapon:int = 3;      PART_prop 4;      PART_l_foot 5;
PART_l_thigh 6; PART_l_calf 7; PART_crotch 8; PART_r_foot 9; PART_r_thigh 10;
PART_r_calf 11; PART_neck 12; PART_stomach 13; PART_pelvic 14; PART_torso 15;
PART_head 16; PART_hat 17; PART_r_hand 18; PART_r_uparm 19; PART_r_lowarm 20;
PART_prop2 21; PART_prop3 22; PART_l_shoulder 23; PART_r_shoulder 24;
PART_l_knee 25; PART_r_knee 26;
```
The paperdoll wire format is `MCSCharacter.as:348` — a 12-field pipe-delimited string:
```as3
this.mcsString = armorid + armorColor + "|" + glovesid + "|" + hairid + "|" + hatid + hatColor + "|" + headid + "|" + maskid + maskColor + "|" + neckid + "|" + pantsid + pantsColor + "|" + shoesid + "|" + weaponid + "|" + propid + "|" + prop2id;
```
with per-slot tint injected as `,<PCOLORMODID>@<rgb>#<SCOLORMODID>@<rgb>#` — only
armor, pants, hat and mask are tintable (`MCSCharacter.as:312-347`). Hair/hat
mutual exclusion is explicit: `hatid > 0 && hatid != 7000 && hatid != 7049` →
`hatHair.visible = true; hair.visible = false` (`MCSCharacter.as:374-385`).

`MCSCharacter` itself is `[Embed(source="/_assets/assets.swf", symbol="symbol1970")]`
— so the **z-order of those 27 parts lives in the SWF timeline (PlaceObject depths),
not in ActionScript.** The part list, the slot→part routing and the serialization
are held; the numeric depth stack is not yet read out of the SWF.

**Verdict: PARTIAL.**

---

### C11 — `rarity-4-tiers-exact` · A2 + A1 · upgrades a Ready bullet

Ledger §4 Ready: *"4 rarity tiers"* — true, and now exact. `Item.as:417-451`:

| tier | rule | colour on dark loot dialog | colour on light inventory bg |
|---|---|---|---|
| unique/quest/player-named | `itemxml.unique == 1 \|\| isPickableQuestItem() \|\| isTradeQuestItem \|\| isPlayerNamed()` | `#b048f8` | `#6600cc` |
| rare | `modifierCount >= 3` | `#0080ff` | `#003399` |
| magic | `modifierCount > 0` | `#1eff00` | `#336600` |
| common | else | `#FFFFFF` | `#000000` |

Rarity is therefore **derived from affix count**, not stored. `<unique>` in
`itemdata.xml` has exactly 2 distinct values (1 and 2) over 369 rows — only `== 1`
triggers the purple tier.

Frame corroboration (A1): `reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0031.jpg`
crop `(575,140)-(1015,420)` @3× — "PANTS" renders **green** with a green icon
border, i.e. `1 <= modifierCount <= 2` on a dark shop overlay; and
`frame_0024.jpg` renders a 3-affix generated name in **blue**. Frame and code agree.

**Verdict: HELD.**

---

### C12 — `name-template-frame-confirmed` · A1 · corroborates C3

`reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0024.jpg` (1024×576; crop
`(0,420)-(640,500)`, upscaled 3× LANCZOS). Visibly, verbatim:

> `I AM LOOKING FOR ` **`DRAFTY SHARP IRON SWORD OF PIERCING`** ` .`

with the item name in bright blue and the surrounding sentence in white.

Decompose against `ItemGenerator.as:744-746` (the 3-modifier branch,
`pre(mod2) + " " + pre(mod0) + " " + basename + " " + suf(mod1)`):
- `pre(mod2)` = **"Drafty"** = `windatk_pre[0]` → mod2 is WINDATK, tier 0
- `pre(mod0)` = **"Sharp"** = `attack_pre[0]` → mod0 is ATTACK, tier 0 — and ATTACK
  is exactly what `ItemGenerator.as:439-443` **forces** as the first affix on a WEAPON
- `basename` = **"Iron Sword"** (a string-table `<name>` id we do not hold — see C15)
- `suf(mod1)` = **"of Piercing"** = `piercingdmg_suf[*]` → mod1 is PIERCINGDMG, which
  the WEAPON `pot` mask allows (index 16 = 1) and every other slot's mask forbids.

Three affixes ⇒ blue name ⇒ the `modifierCount >= 3` branch of C11. Every layer
agrees with every other.

**Verdict: HELD. This is the single strongest corroboration in the lane: a
video frame independently validates the affix pools, the forced-first-affix rule,
the slot mask and the rarity colour rule simultaneously.**

---

### C13 — `weight-cap-is-not-flat-100` · A2 · corrects a Ready bullet

Ledger §4 Ready: *"weight cap 100"*. `StatsManager.as:2298-2301`:
```as3
public static function getCarryingWeight() : int
{
   return 100 + getStat(1009) * 20;
}
```
100 is the **base**; the cap is upgradable in +20 steps via stat id 1009.
The load itself is `StatsManager.findWeight()` (`:1983-2026`) = Σ inventory
`weight × qty` + Σ equipment weight over `for(q = 0; q < 13; q++)` skipping
EQ_HEAD/EQ_NECK/EQ_SCABBARD + Σ quest-item `weight × qty`. Overweight blocks
travel/entry rather than pickup (`NodeUI.as:379`, `Obj_HiddenTemple.as:187`,
`InteractUI.as:1730`).

`itemdata.xml` carries 745 `<weight>` rows, values 0–500 (index
`docs/gauntlet/L0/index/itemdata.json`, `itemdata/item/weight`).

**Verdict: PARTIAL — "100" is right as a base and wrong as a cap.**

---

### C14 — `soul-infusion-transfer-rule` · A2 · upgrades a Ready bullet

Ledger §4 Ready: *"soul-infusion + stat-transfer rules (patch-note-sourced)"*.
The mechanic is `CraftingUI` — a two-slot combine (`designSlot` supplies the item,
`statsSlot` supplies the affixes), `CraftingUI.as:506-523`:
```as3
var combinedItem:Item = new Item(this.designSlot.itemID);
combinedItem.copyModifiers(this.statsSlot.getItem().modifiers);
if(designType == 13)
{
   designMinDamage = designItemXML.mindamage;
   statsMinDamage = QuestEngine.getItemData(this.statsSlot.itemID).mindamage;
   if(combinedItem.getModifierBonus(6) == 0) combinedItem.addModifier(6,statsMinDamage - designMinDamage);
   else { modifier = combinedItem.getModifierObject(6); modifier.value += statsMinDamage - designMinDamage; }
   combinedItem.uses = this.statsSlot.getItem().uses;
}
combinedItem.setPrimaryColor(this.designSlot.getPrimaryColor());
combinedItem.setSecondaryColor(this.designSlot.getSecondaryColor());
```
i.e. **all affixes transfer wholesale**; for weapons (`designType == 13`) the base
damage difference is reconciled into modifier id 6 (ATTACK) so the donor's damage
is preserved on the recipient's silhouette, and durability follows the donor.
Colour comes from the design item. Cost is paid in Gold (`goldicon1/goldicon2`).

**Verdict: HELD — no longer patch-note-sourced; it is source-sourced.**

---

### C15 — `string-table-partial` · A2 · **PARTIALLY OVERTURNS THE STANDING GAUNTLET BLOCKER**

The gauntlet's standing blocker says item `<name>`/`<desc>` are numeric ids into a
string table "NOT YET LOCATED … bindata/ is now EXHAUSTED as a candidate." Two
corrections:

**(a) The table is now NAMED and PATHED.**
`reference/decompiled/shs3_android/scripts/LangManager.as:38-58`
```as3
var server:String = "./data/";
if(StatsManager.useExternalLang) { ... server = QueryManager.instance.server + "strings/"; }
Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");
Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");
Locale.loadLanguageXML(id,onLanguageLoad);
```
It was never in `bindata/` because on the web build it is an **external server
file**, `shs3_en.xml`. Three locales exist (`ENGLISH "en"`, `CHINESE "zh-CN"`,
`JAPANESE "ja"`, `LangManager.as:9-13`).

**(b) A 2,555-entry English slice is now EXTRACTED and on disk-derivable.**
The Android build embeds a copy: `Mobile_Lang_EN.as:5`
```as3
[Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]
```
Pulling char-id 118 out of `reference/decrypted/shs3_android_payload_decoded.swf`
via a `DefineBinaryData` walk yields 500,024 bytes of UTF-16LE XLIFF, 250,011
characters decoded, `<trans-unit id="0" resname="0"><source>No</source>` … ids
**0–2554 contiguous**.

**(c) It does NOT close item names.** `itemdata.xml`'s `<name>` ids run 34–4427
(804 rows) and `<desc>` ids 207–4405 (178 rows); the quest engine calls
`getString(11253)`, `getString(11254)` (`shs3_payload/scripts/§1t123s0§.as:900-901`).
The embedded slice tops out at 2554. Lookups of 4000/4001/4002/4058/4172 all return
`None`; `grep -c "Katana\|Wakizashi\|Tanto\|Nodachi"` on the decoded table = **0**.

**Verdict: PARTIAL. The table is located and a third of it is in hand; item names
remain STILL_UNHELD. Numbers stay portable, names still do not.**

---

### C16 — `modifier-id-semantics` · A2 (payload) + the C15 table · UNDER-CLAIM

Because C15 recovered ids 0–2554, the item modifier enum is now fully decoded.
`XMLItem.as:231-298` maps each `<modifier><id>` to a label string id; resolving
those against the extracted table gives:

| `<modifier><id>` | string id | label |
|---:|---:|---|
| 0 | 110 | `HP` |
| 1 | 111 | `Max HP` |
| 2 | 112 | `HP Regen` |
| 3 | 113 | `Chi` |
| 4 | 114 | `Max Chi` |
| 5 | 115 | `Chi Regen` |
| 6 | 116 | `Attack` |
| 7 | 117 | `Defense` *(suppressed when `<defense>` is non-zero)* |
| 8 | 118 | `Speed` |
| 9 | 119 | `XP` |
| 10 | 120 | `Level ` |
| 11 | 63 | `Coins` |
| 12 | 64 | `Gold` |
| 13 | 102 | `AP` |
| 14 | 121 | `Max AP` |
| 15 | 59 | `Duel Tokens` |
| 16 | 122 | `Max Duel Tokens` |
| 101–1999 | 123 | `Set` + `": " + id` (equipment set bonus) |

plus `124` = `Level Required` (printed when `<minlvl> > 1`) and `125` =
`Stance Restriction` (printed when `<stancerestriction> > 0`), `108` = `Dmg`,
`109` = `Def`, `139` = the weight label.

`itemdata.xml` holds 412 `<modifier>` blocks over 34 distinct ids and 319
`<value>` rows. Every one of them is now readable.

**Verdict: HELD.**

---

### C17 — `weapon-slash-budget-and-reach` · A2 · cross-lane, feeds combat-core

`itemdata.xml` gives 106 `<slashusage>` rows with exactly 3 values — 24, 72, 96 —
and `XMLItem.as:152-159` supplies the default:
```as3
if(xml.slashusage.toString() != "") this.slashusage = xml.slashusage;
else this.slashusage = 48;
```
`StatsManager.as:1922-1930` reads it back with a floor of 48. Verbatim example,
`reference/extracted/itemdata.xml:8742-8752`:
```xml
	<item>
		<id>13113</id>
		<type>9</type>
		<name>4050</name>
		<minlvl>1</minlvl>
		<mindamage>2</mindamage>
		<maxdamage>16</maxdamage>
		<slashusage>96</slashusage>
		<stancerestriction>6</stancerestriction>
		<weight>15</weight>
		<uses>100</uses>
```
Immediately above it, `StatsManager.as:1915-1920`:
```as3
internal static function getBaseSlashLengthVal(speed:int) : int
{
   var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
   return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
}
```
So the drawable slash length is `120 + floor((90 + DAN*5) * SPEED / (20 + SPEED))`
px-equivalent, and `slashusage` is the per-weapon cost charged against it. At
SPEED 0 that is a hard **120** floor; the asymptote at DAN 0 is 210.

This is not the items lane's own blocker — it is §2's `combat-core` blocker
*"reach cap in **px**"*, and it was sitting inside the equipment code the whole time.

Also from the same rows: `<stancerestriction>` has exactly 2 values (4 and 6) over
53 items, `<uses>` has 4 values (50/60/80/100) over 115 items, `<nodrop>` 7 items,
`<nogive>` 12 items — and generated durability starts partially spent:
`ItemGenerator.as:654-661` — `newItem.uses = rng.rand(xmlItem.durability - 50)`
below node level 20, `rng.rand(xmlItem.durability)` at or above it, `0` for legendaries.

**Verdict: HELD.**

---

### C18 — `premium-catalog-held` · A2 · **PARTIALLY OVERTURNS §6**

Ledger §6 "structurally UNRECOVERABLE" lists *"**The dead IAP economy** — design an
offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this."*

The premium **catalog** is not lost. Char-id 121 of the decoded Android payload,
`Mobile_PremiumData`, 4,504 bytes:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<premiumdata>
<default>
<item>2208</item>
<item>2209</item>
<item>2212</item>
...
 </default>
 <special>
 <!--
<item>2171</item>
<item>13036</item>
...
-->
</special>
<rotation>
<!-- Assassin outfit -->
<set>
<item>2130</item>
<item>7034</item>
<item>4065</item>
<item>5008</item>
<item>11036</item>
<item>12018</item>
</set>
<!-- Dark Assassin outfit -->
```
— a default premium stock list, a commented-out "special" list (the dev's own
disabled SKUs), and a **rotation of named outfit sets** carrying the designers'
verbatim comments. Cross-referenced against `itemdata.xml`'s 304 `<heavenlyprice>`
rows (values 0,1,2,3,5,8,12,25,100), the entire Gold-priced item economy is
reconstructible.

What genuinely remains unrecoverable is the **real-money** layer (price points,
store SKUs, conversion rates) — which is a different and much smaller claim than
"the IAP economy".

**Verdict: PARTIAL — §6's bullet is too broad. The in-game premium catalogue is HELD.**

---

### C19 — `no-items-config-still-true` · A3 · ledger CONFIRMED

Ledger §4 Surface: *"measured weight table + named-item blocks exist in segment
notes but **no items config file exists yet** — entirely un-ported."*

Repo check (`ls src/config/`, not a suite test):
```
ai.ts anim.ts art.ts chi.ts combat-sim.ts combat.ts display.ts duel.ts economy.ts
fidelity.ts fx.ts gesture.ts mobs.ts nums.ts ogAnims.ts ogPose.ts palette.ts
popups.ts poses.ts profile.ts reach.ts rng.ts skills.ts stances.ts stats.ts
timing.ts xp.ts
```
No `items.ts`, no `equipment.ts`, no `affixes.ts`. The ledger is right — and after
C3/C4/C5/C16 the porting job is now a transcription task, not a research task.

**Verdict: HELD (ledger confirmed, not overturned).**

---

## 2. Score

REBUILD_READINESS §2 gives items-equipment **42/100**. On the evidence above:

- Blocker ① (stat-vs-level curve) — **closed**, exact formulas.
- Blocker ② (condition→DMG multiplier) — **dissolved**, the mechanic does not exist.
- Blocker ③ (sell-price formula) — **mostly closed** (valuation formula exact; a 0.5
  multiplier is declared-but-unused and unconfirmed for the web build).
- Blocker ④ (suffix pool + affix count) — **closed**, verbatim pools + dice tables.
- Blocker ⑤ (compositing contract + icon manifest) — **half closed**: part list,
  slot routing, symbol-naming rule and 12 default symbols held; per-item art and
  numeric z-order still out.
- Ready bullets: "9-slot paperdoll" was **wrong** (13); "weight cap 100" was a
  **base, not a cap**; "4 rarity tiers" and "soul-infusion rules" are now exact.
- Only genuinely open item: **item NAMES** (string ids ≥ 2555 not in the recovered slice).

**Re-score: 84/100.** The 16 points held back are: item/desc names (the largest),
per-item vector art behind a scrambled resource SWF, the SWF-timeline z-order
stack, and the unverified web-build sell multiplier.

## 2b. Lane impact (GAUNTLET.md §  lane table)

- **L3 (ITEMS + PAPERDOLL)** — its done-criterion currently reads *"982 items
  byte-exact; a dressed fighter composites in the OG's layer order against A1"*
  with the lane described as the **"9-slot compositing contract"**. That must
  become **13-slot** (C1), and the lane gains the affix generator (C3/C4/C5),
  the modifier enum (C16) and the symbol-naming rule (C9) as *inputs*, not as
  research. Only the z-order stack (C10) and the per-item art (C9) remain
  genuinely open.
- **L1b (STRING TABLE)** — its exit condition is *"every `<name>`/`<desc>`/
  `<displayname>` ID resolves to text with an A2 cite, or the lane reports the
  table as genuinely absent."* C15 hands it: the table's real name and path
  (`shs3_en.xml`, `./data/` or `<server>/strings/`), the reason it was never in
  `bindata/`, and 2,555 already-decoded English entries — while proving the
  remaining ids (≥ 2555, incl. all item names) are not in the Android slice.
- **L5 (COMBAT CORE)** — C17 hands it `getBaseSlashLengthVal()`, an exact
  closed-form slash-length formula, against §2's *"reach cap in **px**"* blocker.
- **L10 (PROGRESSION + ECONOMY)** — C8 supplies the item valuation formula and
  flags `sellPercentage = 0.5` as declared-but-never-referenced.
- **L11 (META + REBIRTH)** — C18 narrows §6's "dead IAP economy" to the
  real-money layer only; the premium catalogue is A2-held.

## 3. Files written by this lane
- this file only. No source touched. Binary extraction ran into the session
  scratchpad, not the repo.
