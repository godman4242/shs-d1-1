# GAUNTLET L0 — system survey: **items-equipment**

Surveyor pass, 2026-08-14. Document under audit: `docs/research/REBUILD_READINESS.md`
(2026-07-20), block `### items-equipment — 42` (lines 208–211), row line 130, banner line 33.

**Headline: the 42/100 is badly stale. All five listed blockers are held on disk.**
Four of the five are held as *executable AS3 formulas*, not inferences. Two "Ready"
bullets are, in fact, WRONG. One §6 "structurally UNRECOVERABLE" line is partially
overturned for this system.

Evidence base used:
- `docs/gauntlet/L0/index/itemdata.json` (authoritative counts)
- `reference/extracted/itemdata.xml` (982 `<item>`)
- `reference/decompiled/shs3_android/scripts/` — **named** AS3 (Android v0.682)
- `reference/decompiled/shs3_payload/scripts/` — **name-obfuscated** AS3 (web v0.717);
  used to CROSS-CONFIRM every load-bearing formula so the S0-3 build-parity caveat
  does not apply to the claims below that carry a web cite.
- `docs/gauntlet/L0/index/strings.json` (2,533 resolved names — S0-3)
- `reference/frames/s21_weapon/t708.0.png` (1920×1080 PLAYER screen)

---

## A. OVERTURNS — the ledger says blocked, the payload holds it

### IE-1 · Blocker ⑤ sprite-compositing contract — HELD, complete
**Ledger (line 210):** "⑤ **sprite-compositing contract** (layer order, per-slot body
render — a from-scratch-art blocker) + item **icon manifest**."

`MCSCharacter.as:10–62` declares **27 named part indices**, and the index IS the
z-order: the constructor (`MCSCharacter.as:141–146`) does
`for(i=0; i<=partListLength; i++){ mc = new MovieClip(); addChild(mc); partList.push(mc); }`
with `partListLength = 22` (`:120`). Depth = `PART_*` value.

```
PART_l_hand 0 · l_uparm 1 · l_lowarm 2 · weapon 3 · prop 4 · l_foot 5 · l_thigh 6
l_calf 7 · crotch 8 · r_foot 9 · r_thigh 10 · r_calf 11 · neck 12 · stomach 13
pelvic 14 · torso 15 · head 16 · hat 17 · r_hand 18 · r_uparm 19 · r_lowarm 20
prop2 21 · prop3 22 · l_shoulder 23 · r_shoulder 24 · l_knee 25 · r_knee 26
```

Per-slot body render is explicit: **one equipment slot drives many parts.**
`setArmor()` (`MCSCharacter.as:915–924`) claims **7** parts (torso, stomach, l/r uparm,
l/r lowarm, pelvic); `setPants()` (`:1091–1098`) claims **5** (crotch, l/r thigh,
l/r calf); `setWeapon()` (`:1206–1219`) claims 1.

Symbol lookup contract, `MCSCharacter.as:581–607`:
```as3
internal function getMCSComponent(partType:String, id:int) : MovieClip {
   var xmlItem:XMLItem = QuestEngine.getItemData(id);
   if(xmlItem == null) { art = id; } else { art = xmlItem.art; }
   if(StatsManager.useExternalResource) return ResourceManager.getMCSComponent(partType,art);
   if(getDefinitionByName(partType + art.toString()))
      ClassDefinition = Class(getDefinitionByName(partType + art.toString()));
   else ClassDefinition = Class(getDefinitionByName(partType + "0"));
```
i.e. **class name = `partType + <art>`**, with `<art>` from `itemdata.xml` (146 explicit
rows; else `art = id`, `XMLItem.as:110–117`), falling back to `partType + "0"`.

**This is confirmed against the WEB build.** `reference/decompiled/shs3_payload/scripts/`
exports exactly the naked-default symbol classes the code names:
`torso4000.as`, `stomach4000.as`, `pelvic4000.as`, `uparm4000.as`, `lowarm4000.as`,
`hand5000.as`, `hair6000.as`, `hair6001.as`, `hat7000.as`, `head8000.as`, `head8004.as`,
`mask9000.as`, `neck10000.as`, `crotch11000.as`, `thigh11000.as`, `calf11000.as`,
`foot12000.as`, `foottop12000.as`, `weapon13000.as`, `weapon13002.as`, `prop13000.as`,
`item0.as`. Those match the naked-fallback IDs hard-coded in `initMCS`
(`MCSCharacter.as:349–449`: head 8000 · mask 9000 · hair 6001/6000 · hat 7000 ·
neck 10000 · armor 4000 · shoes 12000 · pants 11000 · gloves 5000 · weapon 13000 ·
prop 13000). Verdict: **HELD, not a blocker.**

### IE-2 · Blocker ⑤(b) item icon manifest — HELD, and there is no separate manifest
`MCSItem.as:324–349` builds the inventory icon out of **the same MCS part symbols**,
with hard-coded sub-offsets:
```as3
public function setArmor(id:int) : * {
   this.displayItem  = this.getMCSComponent("stomach",id);
   if(this.displayItem == null) { this.displayItem = new ArmorDummyIcon(); addChild(...); }
   else { addChild(this.displayItem); this.displayItem.x = -0.65; this.displayItem.y = 5.9;
          this.displayItem1 = this.getMCSComponent("pelvic",id); ... x=-0.35; y=10;
          this.displayItem2 = this.getMCSComponent("torso",id);  ... y=-2;
          this.displayItem3 = this.getMCSComponent("uparm",id);  ... x=-5.2; y=-13.5;
          this.displayItem4 = this.getMCSComponent("lowarm",id); ...
```
So "icon manifest" is a category error: **the icon IS the paperdoll part stack**, at
published offsets, with `ArmorDummyIcon` as the miss case. Nothing to recover.

### IE-3 · Blocker ③ sell-price formula — HELD, exact, in BOTH builds
**Ledger (line 210):** "③ sell-price formula."
Android `Item.as:1582–1593`:
```as3
public function getSellAmt() : int {
   if(this.itemID < 3000) { return 1; }
   if(this.getWeight() >= 10) { return (1 + this.getModifierCount()) * 10; }
   return (1 + this.getModifierCount()) * 5;
}
```
Web v0.717 `shs3_payload/scripts/§1t17s0§.as:1977–1988` is the same function,
obfuscated but structurally identical (`if(... >= 10) return (1 + ...()) * 10; return (1 + ...()) * 5;`).

**This also corrects §3 correction #9.** §3 #9 says *"Sell price is NOT flat per item —
it scales with rarity/level (same sword 5c and 25c)."* Half right, half wrong: it does
NOT scale with level at all. It scales with **modifier count** (which is what "rarity"
is derived from, see IE-6) and one **weight ≥ 10** step. 5c = 0 modifiers, weight < 10;
25c = 4 modifiers, weight < 10. Level never enters.

### IE-4 · Blocker ② condition→DMG multiplier — **there is no multiplier**
**Ledger (line 210):** "② condition→DMG **multiplier** (current 'evidence' confounds
condition with a 2-level gap)."

The ledger is hunting a function that does not exist. Condition is **display-only**;
damage is a **binary broken / not-broken cliff**.

`Item.as:1481–1496` — condition is a pure percentage:
```as3
maxDurability = itemXML.durability + this.getModifierBonus(83);
var val:int = (maxDurability - this.uses) / maxDurability * 100;
```
`getCondition()` has exactly **two** call sites in the whole bundle: its own definition
and `getDesc()` (`Item.as:714`). It never reaches combat.

Damage, `StatsManager.as:1863–1903`:
```as3
if(itemdata == null || equipment[EQ_WEAPON].isBroken())
   { basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + 1; }
else
   { basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + itemdata.mindamage; }
...
getDamageRange(): if(equipment[EQ_WEAPON].itemID == 0 || equipment[EQ_WEAPON].isBroken()) return 0;
                  return itemdata.maxdamage - itemdata.mindamage;
```
A 99%-worn sword hits exactly as hard as a pristine one. At 100% worn it drops to
`ATK + 1` with **zero** spread. `isBroken()` (`Item.as:1467–1478`) = `uses >= durability + getModifierBonus(83)`.

The condition **ladder** is 7 states with exact thresholds (`Item.as:712–746`), names
resolved via `strings.json`:
| test | LangManager id | text |
|---|---|---|
| `uses == 0` | 639 | `Unbreakable` |
| `uses == 1` | 392 | `Condition: Well-Maintained` |
| `condition == 0` | 387 | `Condition: Broken` (wrapped `<font color="#FF0000">`) |
| `condition < 25` | 388 | `Condition: Poor` |
| `condition < 50` | 389 | `Condition: Used` |
| `condition < 75` | 390 | `Condition: Usable` |
| else | 391 | `Condition: Good` |
Web v0.717 carries the same 25/50/75 ladder (`§1t17s0§.as:1011,1015,1019`).
⚠ The `uses == 0 → "Unbreakable"` branch is reported verbatim; it reads like a shipped
quirk (a pristine breakable item labels itself Unbreakable). Do not "fix" it silently.

Roll-on-drop, `ItemGenerator.as:648–661`: legendary → `uses = 0`; `nodelvl < 20` →
`uses = rng.rand(durability - 50)`; else `uses = rng.rand(durability)`. `<uses>` in
`itemdata.xml` (115 rows, values 50/60/80/100) is durability (`XMLItem.as:184–186`:
`this.durability = xml.uses;`) — so under L20 the game *cannot* hand you a badly-worn drop.

### IE-5 · Blocker ④ affix suffix pool + per-rarity affix count — HELD, verbatim
**Ledger (line 210):** "④ affix **suffix** pool + per-rarity affix count."
**Ledger (line 209) claims only the prefix pool is Ready.** Both pools are on disk.

`ItemGenerator.as:102–127` declares **13 distinct prefix arrays × 8** and **13 distinct
suffix arrays × 8** = 104 prefixes + 104 suffixes, verbatim. Sample rows:
```as3
var attack_pre:Array  = ["Sharp","Fierce","Vicious","Savage","Brutal","Deadly","Fine","Warrior's"];
var attack_suf:Array  = ["of Attack","of Biting","of Striking","of Killing","of Slaughter","of Slaying","of Carnage","of the Butcher"];
var defense_suf:Array = ["of Defense","of Blocking","of Guarding","of Protection","of Absorption","of Warding","of the Shield","of the Titan"];
var speed_suf:Array   = ["of Speed","of Alacrity","of Haste","of Velocity","of Acceleration","of Sleight","of Swiftness","of Quickness"];
```
Tier selection: `num = Math.floor(i / 10)` over `i` in 0..79 (`:128–148`) — **8 name tiers
across 80 value tiers**. The four elemental-DEF channels reuse the wrong pools
(`FIREDEF ← wateratk`, `WINDDEF ← earthatk`, `WATERDEF ← windatk`, `EARTHDEF ← fireatk`,
`:142–145`) — a shipped bug; copy it or flag the deviation.

Affix **count** distribution, `ItemGenerator.as:206–252`:
- **normal** `rng.rand(100)`: ≤84 → 0 · ≤89 → 1 · ≤93 → 2 · ≤96 → 3 · ≤98 → 4 · else → 5
- **rare** `rng.rand(11)`: ≤3 → 2 · ≤6 → 3 · ≤9 → 4 · ==10 → 5
- **legendary** subtracts 1 when count > 2 (`:371–374`)

Name assembly template, `ItemGenerator.as:733–749` (ordering is by modifier INDEX,
not by value): 0 mods → `base`; 1 → `pre(m0) base`; 2 → `pre(m0) base suf(m1)`;
3 → `pre(m2) pre(m0) base suf(m1)`; 4+ → `pre(m3) pre(m2) pre(m0) base suf(m1)`.

### IE-6 · Blocker ① stat-magnitude vs level curve — HELD as both a table AND a formula
**Ledger (line 210):** "① item stat-magnitude **vs level** curve."

**(a) Static table.** `itemdata.xml` carries 155 `<minlvl>` (range −4…79), 158
`<mindamage>` (1…81), 158 `<maxdamage>` (2…108), 371 `<defense>` (0…35). Endpoints,
quoted verbatim:
```xml
reference/extracted/itemdata.xml:7906-7915
	<item>
		<id>13002</id>
		<type>9</type>
		<name>4041</name>          <!-- strings.json 4041 = "Branch" -->
		<baseprice>0</baseprice>
		<minlvl>-4</minlvl>
		<mindamage>1</mindamage>
		<maxdamage>2</maxdamage>
		<weight>1</weight>
	</item>

reference/extracted/itemdata.xml:9925-9937
	<item>
		<id>13225</id>
		<type>9</type>
		<name>4161</name>          <!-- "Steel Sabre" -->
		<minlvl>79</minlvl>
		<mindamage>81</mindamage>
		<maxdamage>90</maxdamage>
		<slashusage>72</slashusage>
		<stancerestriction>6</stancerestriction>
		<weight>10</weight>
		<art>13205</art>
		<uses>60</uses>
	</item>
```
That is the whole L−4→L79 weapon ladder, 158 rows, no extrapolation needed.

**(b) The roll formula for generated affixes.** `ItemGenerator.as:321–347`:
```as3
internal function getMaxTier(nodelvl:int, getHighestTier:Boolean) : int {
   var tier:int = nodelvl + 1;                      // tier ≈ node/item level
   if(tier < 0) tier = 0; else if(tier > MAXINDEX) tier = MAXINDEX;   // MAXINDEX = 79
   if(getHighestTier) { tier = this.rng.rand(4) + tier - 3; ... }     // first affix: level−3..level
   tier = this.rng.rand(10) + tier - 9;                               // later affixes: level−9..level
```
then value = `modMin + rng.rand(modMax - modMin)` where min/max come from progression
arrays built in `:150–183`:
`prog1[i]=floor(1+i)` (ATTACK, DEFENSE) · `prog2[i]=floor(5+5i/3)` (MAXHP, MAXCHI) ·
`prog3[i]=floor(1+i/3)` (all elemental, regen, CRITICALDMG) · `prog4[i]=floor(1+2i/3)`
(SPEED) · `prog5[i]=floor(1+i/5)`; prog1–3 get **+10** at index 79 (`:157,164,171`).
Weapons/armor subtract the item's own `levelrestriction` before rolling their signature
stat (`:465–472`), so a high-minlvl base rolls a *smaller* bonus. This is the
"stat-magnitude vs level curve", in full.

### IE-7 · Item + equipment SAVE/WIRE format is held — partially overturns §6
**Ledger §6:** "**Server-sim topology & save format** — nothing to copy; design a
single-player persistence schema from the observed field set."

For this system there IS something to copy — the exact serialization. `Item.parse`
(`Item.as:47–104`) reads `"<id>,<qty>,<modid>@<val>#<modid>@<val>#"`, with reserved
modifier IDs `PCOLORMODID 80`, `SCOLORMODID 81`, `USESMODID 82`, `NAMEMODID 89`,
`CREATORMODID 125` (`Item.as:6–16`), and clamps every other value to
`ItemGenerator.getModMax(modid)`.

Equipment is a 12-field pipe string, `MCSCharacter.as:348`:
```as3
this.mcsString = armorid + armorColor + "|" + glovesid + "|" + hairid + "|" + hatid + hatColor
   + "|" + headid + "|" + maskid + maskColor + "|" + neckid + "|" + pantsid + pantsColor
   + "|" + shoesid + "|" + weaponid + "|" + propid + "|" + prop2id;
```
The §6 line stands for *server topology*; it is wrong that there is nothing to copy for
the item/equipment save schema.

### IE-8 · Soul-infusion / stat-transfer is code, not patch-note inference
**Ledger (line 209)** lists it under Ready as "(patch-note-sourced)". It is exact.
`CraftingUI.as:494–523`:
```as3
var designType:int = Math.floor(this.designSlot.itemID / 1000);
var statsType:int  = Math.floor(this.statsSlot.itemID / 1000);
if(designType != statsType) { this.noCombine(LangManager.getString(698)); return; }   // "must be same kind"
combinedItem.copyModifiers(this.statsSlot.getItem().modifiers);
if(designType == 13) {                                    // weapons only
   ... combinedItem.addModifier(6, statsMinDamage - designMinDamage);   // 6 = Attack
   combinedItem.uses = this.statsSlot.getItem().uses;      // durability follows the STATS item
}
combinedItem.setPrimaryColor(this.designSlot.getPrimaryColor());   // colour follows the DESIGN item
```
Gate is `floor(id/1000)` equality (finer than "same slot" — a katana can't take a
sabre's stats across the 13xxx band boundary only if the thousands digit differs).

### IE-9 · The ID→slot band map is complete and exact
`ShopItem.as:134–180` + `ItemGenerator.getItemType` (`:254–293`) give a total function
from item ID to slot, and `itemdata.xml`'s 982 rows land in exactly those bands
(counted this run):

| band | slot | rows in itemdata.xml |
|---|---|---|
| 2000–2999 | consumable | 99 |
| 3000–3999 | accessory | 9 |
| 4000–4999 | armor | 152 |
| 5000–5999 | gloves | 35 |
| 6000–6999 | hair | 73 |
| 7000–7999 | hat | 98 |
| 8000–8999 | head | 38 |
| 9000–9999 | mask | 60 |
| 10000–10999 | neck | 14 |
| 11000–11999 | pants | 93 |
| 12000–12999 | shoes | 55 |
| 13000–13999 | weapon | **177** |
| 20000+ | quest/trade | 79 |

---

## B. THE LEDGER IS WRONG — "Ready" bullets that do not survive contact

### IE-10 · "9-slot paperdoll" is right for the UI and wrong for the model
**Ledger (line 209):** "**Ready:** 9-slot paperdoll".

**A1 — the frame.** `reference/frames/s21_weapon/t708.0.png`, 1920×1080, PLAYER screen.
Crop `(170,240)-(870,1040)` upscaled ×2 (LANCZOS) shows the paperdoll around a "GUEST"
fighter: **exactly 9 boxes** — hat (straw hat, filled) · mask (oni, empty) · armor (grey
haori, filled) · gloves (gauntlets, empty) · pants (white hakama, filled) · weapon
(pickaxe, filled) · ring-left (empty) · shoes (sandals, filled) · ring-right (empty).
So "9-slot paperdoll" **is what the frame shows** and the ledger is right about the UI.

**A2 — the model is 13.** `StatsManager.as:108` `public static var equipment:Vector.<Item> = new Vector.<Item>(13);`
with `:262–286`:
`EQ_ARMOR 0 · EQ_GLOVES 1 · EQ_HAIR 2 · EQ_HAT 3 · EQ_HEAD 4 · EQ_MASK 5 · EQ_NECK 6 ·
EQ_PANTS 7 · EQ_SHOES 8 · EQ_WEAPON 9 · EQ_SCABBARD 10 · EQ_ACCESSORY1 11 · EQ_ACCESSORY2 12`,
all thirteen assigned at `:724–738` (`EQ_SCABBARD = new Item(13100,1)` is a real default),
and **eleven** passed to the renderer at `:1765`:
`player.initMCS(EQ_ARMOR, EQ_GLOVES, EQ_HAIR, EQ_HAT, EQ_HEAD, EQ_MASK, EQ_NECK, EQ_PANTS, EQ_SHOES, EQ_WEAPON, EQ_SCABBARD.itemID)`.
A builder who codes "9 slots" from the ledger will have no hair, no head, no scabbard.
**Residual, honestly unheld:** which of `EQ_NECK / EQ_ACCESSORY1 / EQ_ACCESSORY2` the two
identical ring boxes in the frame map to — the frame cannot distinguish them. See IE-14.

### IE-11 · "4 rarity tiers" — real, but they are derived, not a data field
**Ledger (line 130):** items-equipment Ready includes "rarity".
There is **no rarity field** in `itemdata.xml`. The four tiers are computed at read time,
`Item.as:382–405`:
```as3
if(itemxml.unique == 1 || isPickableQuestItem() || isTradeQuestItem || isPlayerNamed()) return "unique";
if(modifierCount >= 3) return "rare";
if(modifierCount > 0)  return "special";
return "normal";
```
Byte-exact colours (`Item.as:417–451`) — loot-toast palette vs inventory palette:
| tier | loot toast | inventory |
|---|---|---|
| unique | `#b048f8` | `#6600cc` |
| rare (≥3 mods) | `#0080ff` | `#003399` |
| special (1–2 mods) | `#1eff00` | `#336600` |
| normal | `#FFFFFF` | `#000000` |
**All six hexes cross-confirmed in the WEB v0.717 build**,
`shs3_payload/scripts/§1t17s0§.as:683,687,691,704,708,712` — no Android caveat.
`<unique>` in `itemdata.xml` is not boolean: 253 rows `<unique>1</unique>`, 116 rows
`<unique>2</unique>` (counted this run). Every `== 1` test treats `2` as *not* unique
while every `== 0` test treats it as *not* stackable/sellable — a third state the ledger
does not know about.

### IE-12 · "defense min-floor (EnemyLevel/4)" — WRONG variable, WRONG shape
**Ledger (line 209):** "defense min-floor (EnemyLevel/4)".
The real code is `EnemyPlayer.as:107–123` (boss auto-scaling), and it is a floor on the
PLAYER's post-defense hit, banded by **player** level, with three different divisors:
```as3
playerhit = playerATK - defense;
if(playerLVL <= 10 && playerhit < 1)            { playerhit = 1; }
else if(playerLVL <= 20 && playerhit < playerLVL / 8) { playerhit = playerLVL / 8; }
else if(playerLVL <= 30 && playerhit < playerLVL / 6) { playerhit = playerLVL / 6; }
else if(playerhit < playerLVL / 4)              { playerhit = playerLVL / 4; }
```
It is `playerLVL`, not EnemyLevel; `/8` and `/6` bands exist below L30; and it lives in
boss scaling, not in the generic defense pipeline. Anyone coding "EnemyLevel/4" from the
ledger implements a different game.

### IE-13 · "weight cap 100" is a base, not a cap
**Ledger (line 209):** "weight cap 100".
**A1:** the frame `reference/frames/s21_weapon/t708.0.png` reads `WEIGHT: 43 / 100`
(crop `(1400,540)-(1780,600)`, upscaled ×4), which is the *guest* value.
**A2:** `StatsManager.as:2298–2301` `getCarryingWeight(){ return 100 + getStat(1009) * 20; }`
— +20 per rank of stat 1009. Separately, bank storage is a different cap:
`BankUI.as:264` `100 + STAT_DAN * 10 + STAT_PAIDSTORAGE * 10`. Two caps, both upgradeable;
the ledger records one constant.

---

## C. CONFIRMATIONS the ledger already had, now byte-exact

### IE-14 · "(EQ:n) comparison UX" — frame and code agree to the hex
**A1:** `reference/frames/s21_weapon/t708.0.png`, crop `(1320,240)-(1620,320)` upscaled ×4,
reads verbatim: `DMG: 1 - 2 (EQ: 1 - 3)` with the **2 rendered red**, and `WEIGHT: 1`,
under the item name `BRANCH` and the label `LEVEL 1`.
**A2:** `Item.as:759–770` `compareValue(a,b)`: `a > b` → `<font color="#00A606">`,
`a < b` → `<font color="#FF0000">`. `2 < 3` ⇒ red. `#00A606` is present in the web build
too (`shs3_payload/scripts/§1t17s0§.as`).
**Frame↔payload identity:** the frame's `BRANCH / DMG 1-2 / WEIGHT 1` is
`itemdata.xml:7906-7915` id 13002 name 4041 → `strings.json["4041"] = "Branch"`,
`mindamage 1 / maxdamage 2 / weight 1`. Exact match, no rounding.

### IE-15 · Modifier ID → stat name table, fully resolved
`XMLItem.as:231–298` switches modifier id → `LangManager.getString(n)`; resolved via
`strings.json` (S0-3):
`0 HP · 1 Max HP · 2 HP Regen · 3 Chi · 4 Max Chi · 5 Chi Regen · 6 Attack · 7 Defense ·
8 Speed · 9 XP · 10 Level · 11 Coins · 12 Gold · 13 AP · 14 Max AP · 15 Duel Tokens ·
16 Max Duel Tokens`; ids 101–1999 render as `Set: <id>` (`:290–292`). Reserved ids
`80/81/82/83/89/125` are colour/uses/durability-bonus/name/creator, not stats.
Tooltip header strings: `108 "Dmg"`, `109 "Def"`, `124 "Level Required"`,
`125 "Stance Restriction"`. `itemdata.xml` uses 34 distinct modifier ids across 412 rows.

### IE-16 · `<slashusage>` and `<stancerestriction>` are combat contracts the block omits
`itemdata.xml` carries 106 `<slashusage>` rows with exactly three values **24 / 72 / 96**
and a **default of 48** (`XMLItem.as:152–159`, re-asserted as a floor in
`StatsManager.getSlashUsage()` `:1921–1930`), plus 53 `<stancerestriction>` rows with
values **4** and **6**. Neither appears anywhere in the items-equipment block, and both
feed the blade-reach/stroke budget:
`StatsManager.as:1915–1919` `getBaseSlashLengthVal(speed) = 120 + floor((90 + DAN*5) * speed / (20 + speed))`.
Flagging for the combat lane — this is an items-owned input to reach.

---

## D. STILL UNHELD (honest)

### IE-17 · Which UI box is NECK vs ACCESSORY1 vs ACCESSORY2
The frame shows two visually identical empty ring boxes; the code has three candidate
indices (`EQ_NECK 6`, `EQ_ACCESSORY1 11`, `EQ_ACCESSORY2 12`). No frame in
`reference/frames/` that I opened shows a filled neck/accessory slot, and no AS3 line I
read binds a UI box index to an `EQ_` constant. **STILL_UNHELD.**

### IE-18 · Per-item icon art for the 982 rows in the WEB build
`getMCSComponent` has two paths; the web payload's `scripts/` exports only ~22 named
default part classes, the rest going through `ResourceManager.getMCSComponent(partType,art)`
when `StatsManager.useExternalResource` is true. Whether the remaining ~960 items' vector
symbols are inside the web SWF under obfuscated names, or in one of the encrypted
`CWS`-prefixed Android resource blobs (S0-5: `115_Mobile_SHS3Resource`,
`124_Mobile_ImageResource`), **I did not establish**. The naming *contract* is held
(IE-1); the *art payload* for the full roster is **STILL_UNHELD**.

---

## E. Suggested re-score

**items-equipment: 42 → 78.**
All five listed blockers resolve: ① held as a 158-row table *and* the roll formula;
② dissolved (no multiplier exists — binary broken/not-broken); ③ held as an exact
two-build-confirmed formula; ④ held verbatim (104+104 affixes + both count
distributions); ⑤ held (27-index z-order + `partType + art` symbol contract + icon
offsets). Held back from higher only by IE-18 (per-item art payload for the full roster)
and IE-17 (one UI-slot mapping). Two "Ready" bullets (IE-12 defense floor, IE-13 weight
cap) must be **corrected**, not merely re-scored, and "9-slot paperdoll" (IE-10) needs
"…of a 13-slot equipment model, 11 of which render".
