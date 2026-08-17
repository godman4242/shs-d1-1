# GAUNTLET L0 — SOURCE SWEEP: `itemdata` (orthogonal, by-source)

**Unit:** `reference/extracted/itemdata.xml` (184,002 bytes · 10,545 lines · 982 `<item>`)
**Document under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20, avg ~42/100)
**Run:** 2026-08-15 · surveyor agent, source lane
**Index used (authoritative on counts):** `docs/gauntlet/L0/index/itemdata.json`,
`docs/gauntlet/L0/index/resolved_names.json`, `docs/gauntlet/L0/index/strings.json`

## Headline

`itemdata.xml` is not a flat item list. It is the **key that decodes four of the five
`items-equipment` blockers and two of the four `economy` blockers**, because every one of its
numeric fields has a named consumer in the decompiled AS3 — and the field names are *not*
obfuscated in the Android bundle (`reference/decompiled/shs3_android/scripts/XMLItem.as`),
while the **web v0.717 bundle carries a byte-identical parser** with the same defaults
(`reference/decompiled/shs3_payload/scripts/§1t104s0§.as`). Following one field
(`<slashusage>`) into `StatsManager` also surfaced the **SPEED→slash-length (reach) formula**
and the **SPEED→cooldown formula**, which the ledger lists as open combat/skills blockers.

**A1 corroboration (the frame wins, and here it agrees):**
`reference/frames/s21_weapon/t708.0.png` (1920×1080 PLAYER screen) shows
`DMG: 1 - 2 (EQ: 1 - 3)` / `WEIGHT: 1` for **BRANCH**, and `WEIGHT: 43 / 100`.
`itemdata.xml:7907` gives item 13002 "Branch" `mindamage 1 / maxdamage 2 / weight 1`;
item 13022 "Pickaxe" (the weapon rendered in the paperdoll) gives `1 / 3`.
Three independent numbers match. **This validates `itemdata.xml` against the v0.717 video
build** and retires the Stage-0b S0-3 Android-parity caveat *for item numbers*.

---

## Claims

### C1 — the 12 `<type>` codes ARE the equipment-slot enum; a missing `<type>` means ARMOR
**A2.** `reference/extracted/itemdata.xml:2608` (item 4000 has **no** `<type>`) +
`reference/decompiled/shs3_android/scripts/XMLItem.as:70-77`:
```
if(xml.type.toString() != "") { this.type = xml.type; } else { this.type = 0; }
```
and `StatsManager.as:262-282`:
```
EQ_ARMOR:int = 0; EQ_GLOVES = 1; EQ_HAIR = 2; EQ_HAT = 3; EQ_HEAD = 4; EQ_MASK = 5;
EQ_NECK = 6; EQ_PANTS = 7; EQ_SHOES = 8; EQ_WEAPON = 9; EQ_SCABBARD = 10;
```
Measured partition of the 982 rows (id ranges are 1:1 with the type code):
| type | slot | n | id range |
|---|---|---|---|
| *(absent)* → 0 | ARMOR / torso | 153 | 4000–7075 |
| 1 | GLOVES | 35 | 5000–5034 |
| 2 | HAIR | 73 | 6000–6520 |
| 3 | HAT | 97 | 7000–7097 |
| 4 | HEAD (face) | 38 | 8000–8509 |
| 5 | MASK | 60 | 9000–9059 |
| 6 | NECK | 14 | 10000–10013 |
| 7 | PANTS | 93 | 11000–11514 |
| 8 | SHOES | 55 | 12000–12054 |
| 9 | WEAPON | 177 | 13000–13232 |
| 10 | consumable | 98 | 2000–2503 |
| 11 | ring / amulet | 9 | 3000–3008 |
| 12 | quest / misc | 80 | 2211–20111 |

Lane: **items-equipment**. Not an overturn — a decode the ledger never had.

### C2 — the paperdoll is 9 BOXES over 13 equipment indices; 4 slots are non-box
**A1 + A2.** Frame `reference/frames/s21_weapon/t708.0.png`, crop `(170,240)-(870,1045)`
(1× — boxes are ~150 px, no upscale needed): exactly **nine** slot boxes —
hat (filled straw hat), mask (empty), armor (filled grey robe), gloves (empty),
pants (filled white hakama), weapon (filled pickaxe), **ring (empty)**, shoes (filled sandals),
**ring (empty)**. Two accessory/ring boxes are visible, and the AS3 enum in C1 names **no**
ring slot. Reconciliation, from `StatsManager.as` `findBonusStat`:
```
for(var q:* = 0; q < 13; q++)
{ if(q != EQ_HEAD && q != EQ_NECK && q != EQ_SCABBARD && q != EQ_HAIR && ...
```
The equipment array is **13** long (0–12) though only 0–10 are named — indices 11/12 are the
two ring boxes — and **HAIR/HEAD/NECK/SCABBARD contribute no stats**, which is why they get no
box: they are rendered on the body (the frame's character wears hair, a face, and a
back-slung scabbard, none of them clickable). 13 − 4 = **9 boxes**, exactly what the frame shows.
Ledger's "9-slot paperdoll" is right on the box count and silent on the other four.
Lane: **items-equipment**, **ui-hud**. Verdict PARTIAL (refines, does not overturn).

### C3 — itemdata's weapon numbers are the ones on screen in the v0.717 video
**A1.** Same frame, crop `(1310,235)-(1780,320)` upscaled **3×** → reads
`DMG: 1 - 2 (EQ: 1 - 3)` and `WEIGHT: 1`; crop `(1420,545)-(1780,600)` ×3 → `WEIGHT: 43 / 100`.
**A2.** `itemdata.xml:7907`:
```
<id>13002</id><type>9</type><name>4041</name><baseprice>0</baseprice>
<minlvl>-4</minlvl><mindamage>1</mindamage><maxdamage>2</maxdamage><weight>1</weight>
```
`resolved_names.json` → 13002 = **"Branch"**; item 13022 "Pickaxe" = `mindamage 1 / maxdamage 3`.
And `StatsManager.as:1830-1832` makes 13002 the **auto-equipped starter weapon**:
```
if(equipment[EQ_WEAPON].itemID == 0) { equipItem(EQ_WEAPON,new Item(13002,1)); }
```
Overturns §1 KNOWN-UNKNOWNS *"early-mob HP + **starter weapon DMG** + hits-to-kill"* —
starter weapon DMG is **1–2 (Branch, id 13002)**, held on disk and visible on screen.
Also frame-confirms the ledger's "weight cap 100". Lane: **combat-core**, **items-equipment**.

### C4 — the "item stat-magnitude vs level curve" is a TABLE, not a missing formula
**A2.** 158 weapons carry `<mindamage>`+`<maxdamage>`; 155 items carry `<minlvl>` spanning
**−4 … 79**. Endpoints, verbatim:
`itemdata.xml:7907` id 13002 `minlvl -4`, dmg 1–2 → `itemdata.xml` id 13225 "Steel Sabre"
`minlvl 79`, dmg **81–90**. Armour side: 111 typeless (ARMOR) rows carry `<defense>`, e.g.
id 4006 "Medium Armor" `minlvl 10 / defense 15`; id 4050 "Zaku Samurai Armor" `minlvl 30 /
defense 35` (the max). Defence domain is 0–35 across 371 rows.
**Overturns** ledger line 210 blocker ① *"item stat-magnitude **vs level** curve"* and the §1
line *"item stat-vs-level curve"* — nothing needs deriving; every rung to level 79 is tabulated.
Lane: **items-equipment**, **progression**.

### C5 — there is NO condition→damage multiplier; condition is binary + a display label
**A2.** `StatsManager.as:1863-1888` — while not broken, `basedamage = ATK + itemdata.mindamage`;
when broken:
```
basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + 1;
```
and `getDamageRange()` returns `0` for a broken weapon. `Item.as:1467-1496`:
```
public function isBroken() : Boolean { ... return this.uses >= itemXML.durability + this.getModifierBonus(83); }
public function getCondition() : int { ... var val:int = (maxDurability - this.uses) / maxDurability * 100; }
```
`Item.as:714-746` maps that percentage to **display-only** strings:
`uses==0` → "Unbreakable" (639); `uses==1` → "Well-Maintained" (392); `condition==0` → red
"Condition: Broken" (387); `<25` "Poor"; `<50` "Used"; `<75` "Usable"; else "Good".
Durability itself is `<uses>` — 115 items, values **50 / 60 / 80 / 100** only.
**Overturns** blocker ② *"condition→DMG **multiplier** (current "evidence" confounds condition
with a 2-level gap)"* — the question is malformed: damage is flat until break, then the weapon
contributes nothing. The ledger's own suspicion (a level gap, not condition) is confirmed.
Lane: **items-equipment**, **combat-core**.

### C6 — the sell-price formula, held in BOTH builds
**A2.** Android `Item.as:1582-1593`:
```
public function getSellAmt() : int
{
   if(this.itemID < 3000) { return 1; }
   if(this.getWeight() >= 10) { return (1 + this.getModifierCount()) * 10; }
   return (1 + this.getModifierCount()) * 5;
}
```
Web **v0.717** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988` is the same
function with obfuscated names: `if(... < 3000) return 1; if(... >= 10) return (1 + ...) * 10;
return (1 + ...) * 5;` — and `ShopUI.as:58 internal var sellPercentage:Number = 0.5`.
**Overturns** items blocker ③ *"sell-price formula"*, economy blocker ② *"sell-price + …
formulas"*, and **corrects §3 correction 9** — line 168: *"**Sell price is NOT flat per item**
— it scales with rarity/level (same sword 5c and 25c)."* There is **no level term at all**:
5c = 0 modifiers, 25c = 4 modifiers, `(1+4)×5`. It scales with **modifier count**, with a
single **weight ≥ 10** step from ×5 to ×10. Lane: **economy**, **items-equipment**.
*Note:* buy-side, `XMLShopItem.as:68,86` gives the rare-stock price `itemData.gvalue +
item.getLevel() * 100` — *that* is where a level term lives.

### C7 — Repair-Weapon cost: captured
**A2.** `itemdata.xml:294-304` and `:306-317`:
```
<id>2119</id><type>10</type><name>4141</name><baseprice>20</baseprice><weight>1</weight>
<desc>4142</desc><modifier><id>82</id><value>10</value></modifier>
<id>2120</id><type>10</type><name>4143</name><baseprice>40</baseprice><weight>1</weight>
<desc>4144</desc><modifier><id>82</id><value>25</value></modifier>
```
Resolved: 2119 = **"Whet Stone"** — *"Use this to improve the condition of your equipped
weapon."*, 2120 = **"Sword Repair Kit"** — *"…significantly."*
Consumer, `InventoryUI.as:992` (inside `onUseItem`, declared at `:854`):
```
else if(modid == 82) { StatsManager.repairEquippedWeapon(item.modifierXML[i].value); ... }
```
So repair is **consumable-based**: 20 coins restores 10 uses, 40 coins restores 25 uses; and
`XMLShopData.as:46 var defaultItems:Array = [13100,2119,2120,2501,2204,2202,2210];` puts both
in the **default stock of every shop**. **Overturns** economy blocker ③ *"Repair-Weapon cost
(never captured)"*. (A separate NPC "repair service" is not evidenced either way — unheld.)
Lane: **economy**, **items-equipment**.

### C8 — per-rarity affix count + per-slot affix pools + forced first affix
**A2.** `ItemGenerator.as:206-252`:
```
if(isRareItem) { dice = this.rng.rand(11); if(dice <= 3) return 2; if(dice <= 6) return 3;
                 if(dice <= 9) return 4; if(dice == 10) return 5; return 0; }
dice = this.rng.rand(100);
if(dice <= 84) return 0; if(dice <= 89) return 1; if(dice <= 93) return 2;
if(dice <= 96) return 3; if(dice <= 98) return 4; return 5;
```
→ **normal:** 85 % zero affixes, then 5/4/3/2/1 % for 1–5. **rare:** uniform-ish 2–5 (4/11,
3/11, 3/11, 1/11). Legendary decrements a count above 2. `ItemGenerator.as:397-428` gives the
per-slot allowed-stat pool as a 17-long mask over the stat ids (WEAPON, ARMOR, GLOVES, PANTS,
SHOES, HAT, MASK, ACCESSORY each get their own), and `:432-449` forces the **first** affix:
ARMOR→DEFENSE, WEAPON→ATTACK, SHOES→SPEED. Tiering is `prog1..prog5` per stat class
(`getModTier`), and prefix/suffix are drawn from `preSufArray[attrib][tier]`.
**Overturns** the *"per-rarity affix count"* half of blocker ④. The **suffix word list**
itself (`preSufArray` contents) was not read this pass → that half stands. Verdict PARTIAL.
Lane: **items-equipment**.

### C9 — the sprite-compositing contract and the icon manifest are both held
**A2.** `MCSCharacter.as:581-607`:
```
internal function getMCSComponent(partType:String, id:int) : MovieClip
{  var xmlItem:XMLItem = QuestEngine.getItemData(id);
   if(xmlItem == null) { art = id; } else { art = xmlItem.art; }
   ...
   if(getDefinitionByName(partType + art.toString())) { ClassDefinition = Class(getDefinitionByName(partType + art.toString())); }
   else { ClassDefinition = Class(getDefinitionByName(partType + "0")); }
```
i.e. **symbol class name = `partType` + `art`**, with `art = <art> if present else <id>`
(`XMLItem.as:110-117`, identical in web `§1t104s0§.as:108-115`). The z-ordered part array is
`MCSCharacter.as:10-62` — **27 parts**: `l_hand, l_uparm, l_lowarm, weapon, prop, l_foot,
l_thigh, l_calf, crotch, r_foot, r_thigh, r_calf, neck, stomach, pelvic, torso, head, hat,
r_hand, r_uparm, r_lowarm, prop2, prop3, l_shoulder, r_shoulder, l_knee, r_knee`.
The **web payload itself ships the fallback symbols**, named on exactly this scheme:
`reference/decompiled/shs3_payload/scripts/` contains `torso4000.as`, `stomach4000.as`,
`pelvic4000.as`, `uparm4000.as`, `lowarm4000.as`, `hand5000.as`, `hair6000.as`, `hat7000.as`,
`head8000.as`, `mask9000.as`, `neck10000.as`, `crotch11000.as`, `thigh11000.as`,
`calf11000.as`, `foot12000.as`, `foottop12000.as`, `weapon13000.as`, `prop13000.as` — each a
one-line `[Embed(source="/_assets/assets.swf", symbol="symbolNNNN")]`.
So one ARMOR item paints 5 parts, PANTS 3, SHOES 2, GLOVES/HAT/MASK/HAIR/HEAD/NECK 1, WEAPON 1(+prop).
**Overturns** blocker ⑤ *"**sprite-compositing contract** (layer order, per-slot body render —
a from-scratch-art blocker) + item **icon manifest**"* — both halves. Lane: **items-equipment**,
**art-anim-audio-feel**.

### C10 — `<art>` is used exclusively for art-SHARING, so the manifest is complete for all 982
**A2.** 146 rows carry `<art>`; **all 146 point at a different id** (measured). First rows:
`itemdata.xml:326` item 2121 "Red Packet" `<art>20041</art>`; items 2131–2174 (the outfit
bundles) all `<art>2130</art>`. Every other item resolves `art = id` by the default in C9.
Therefore the icon/art manifest for all 982 items is derivable with zero missing entries.
Lane: **items-equipment**, **art-anim-audio-feel**.

### C11 — `<slashusage>` is a per-weapon RELOAD cost; the whole reload resource is undocumented
**A2.** `XMLItem.as:152-159` defaults it to **48**. `StatsManager.as:1921-1930` clamps
`< 48` → 48. `MCSPlayer.as:3240-3263`:
```
switch(this.stance)
{ case LIGHT_STANCE:    this.reload -= this.slashUsage / 2;    break;
  case BALANCED_STANCE:
  case REVERSED_STANCE:  this.reload -= this.slashUsage;        break;
  case HEAVY_STANCE:
  case DUAL_STANCE:      this.reload -= this.slashUsage * 1.5; }
```
with `MCSPlayer.as:3265 bonusReload() { this.reload += 6; ... updateReload((this.reload - 24) / (this.maxreload - 24)); }`
and `StatsManager.as:1839-1842 getBaseReload() { return 48 + (STAT_SPEED + bonus) * 6; }`.
Measured cross-tab over all 177 type-9 rows, `slashusage` is a pure function of `weight`:
no weight tag → tag absent (**=48**) ×19 · weight 1 → absent ×9 · weight 5 → absent ×43
(+1 outlier that writes `24` explicitly) · weight 10 → **72** ×70 · weight 15 → **96** ×35.
(19+9+43+1+70+35 = 177.) So the ladder is 48 / 72 / 96 at weight 5 / 10 / 15.
**Nothing in the 12-system ledger models a reload/stamina bar at all** — it is absent from
combat-core's "Ready" and from its blockers. Lane: **combat-core**, **items-equipment**, **ui-hud**.

### C12 — the engine has FIVE stances, and 53 weapons are stance-locked
**A2.** `MCSPlayer.as:27-35`:
```
LIGHT_STANCE:int = 0; BALANCED_STANCE = 1; HEAVY_STANCE = 2; DUAL_STANCE = 3; REVERSED_STANCE = 4;
```
`itemdata.xml` carries `<stancerestriction>` on **53** type-9 rows, values **4** (7 rows, all
weight 15) and **6** (46 rows). `XMLItem.as:327` only *prints* it
(`LangManager.getString(125)` = "Stance Restriction"); no enforcement site was found in the
Android bundle this pass, and **the 4/6 encoding is NOT decoded** — 4 and 6 are not stance
indices, so a bitmask (4 = 0b100 = heavy, 6 = 0b110 = balanced+heavy) is a *hypothesis only*.
Held: five stances exist and 53 weapons restrict by stance. Unheld: what 4 and 6 mean.
Verdict PARTIAL. Lane: **combat-core**, **items-equipment**.

### C13 — the premium (Gold) catalogue and its exact price points are held
**A2.** 303 items carry `heavenlyprice > 0`. Measured histogram of Gold prices:
**3 G ×191 · 1 G ×59 · 12 G ×39 · 2 G ×6 · 5 G ×5 · 8 G ×1 · 25 G ×1 · 100 G ×1**.
Top end: `2175` "Paradise Gift Pack" = 25 G; `2142` "Wedding Package" = **100 G**;
the 12 G tier is the outfit line (2169 "Demon Huntress Outfit" … 2174 "Paradise Outfit").
Every one of these has `<baseprice>0</baseprice>` — Gold-only, uncoinable.
The ledger's §6 line *"The dead IAP economy — design an offline gold faucet"* is about the
**faucet** and still stands; what is now held is the entire **sink** side an offline faucet must
be balanced against. Lane: **economy**, **meta-social**. Verdict HELD (not an overturn).

### C14 — the consumable-effect table is exact (modifier id → engine action)
**A2.** `XMLItem.as:219-298` (`determineAttributes`) maps ids 0–16 to stat strings via `LangManager`, resolved through
`docs/gauntlet/L0/index/strings.json`:
`0 HP · 1 Max HP · 2 HP Regen · 3 Chi · 4 Max Chi · 5 Chi Regen · 6 Attack · 7 Defense ·
8 Speed · 9 XP · 10 Level · 11 Coins · 12 Gold · 13 AP · 14 Max AP · 15 Duel Tokens ·
16 Max Duel Tokens` (= `StatsManager.as:170-202 STAT_*`).
`InventoryUI.as:901-1010` (inside `onUseItem`, `:854`) gives the action ids, verbatim branches:
`9 → changeXP` · `25 → rebirth UI (STAT_DAN)` · `78 → unAssignStatPoints` ·
`79 → unAssignSkillPoints` · `82 → repairEquippedWeapon(value)` · `84 → addRandomLootItem` ·
`90 → LEAVECLAN UI` · `97 → changeSex` · `98 → full wipe: unequipAll, clear inventory,
setStat(11,1000), grant 2201 + 10× 2206 + 20 random rare items, clear completedQuestList,
teleport 8382465` · `99 → fullHealth` · `101 → change-name dialog` ·
`102 → teleport to node id in value` · `103 → addRareLootItem(value, level, 1, true)`.
Named examples from itemdata: 2202 "Scroll of Rebirth" (25), 2200 "Amnesia Scroll" (78+79),
2201 "Level 10 Scroll" (78+79+98), 2203 "Writ of Release" (90), 2204 "Dojo Recall Scroll" (96),
2205 "Scroll of Sex Change Jutsu" (97), 2206 "Rejuvenation Scroll" (99), 2207 "Name Change
Scroll" (101), 2143 "Wedding Invitation" (102 → node **9902095**).
Lane: **items-equipment**, **progression**, **rebirth-elements**, **meta-social**, **world-exploration**.

### C15 — modifier id 103 = "grants item X"; 42 outfit bundles, 223 grants, and it proves the id→slot map from data alone
**A2.** `itemdata.xml` item 2130 "Assassin Outfit" carries five `<modifier><id>103</id>` rows
with values **7034, 4065, 5008, 11036, 12018** — i.e. hat, armor, gloves, pants, shoes by the
C1 id-range map. `InventoryUI.as:1005`: `else if(modid == 103) { OverworldHUD.instance.lootDialog
.addRareLootItem(item.modifierXML[i].value, StatsManager.getLevel(), 1, true); }`.
Totals: **223** id-103 grants across the bundles; ids 104 (42 rows) and 105 (40 rows) are
valueless flags on the same bundles; 106 (33 rows) carries further item ids.
Consequence: the *cosmetic set* content of the store (Assassin, Dark Assassin, Ichigo, Santa,
Zaraki, Byakuya, Hitsugaya, Mayuri, Komamura, Firefistace, Kanji, Chronos, Heavenly, Paradise,
Demon Huntress, Wedding…) is fully enumerable, per-piece. Lane: **items-equipment**, **economy**.

### C16 — item schema parity between web v0.717 and Android v0.682 is PROVEN for itemdata
**A2.** `reference/decompiled/shs3_payload/scripts/§1t104s0§.as` (web v0.717) declares the
identical field set — `id, type, unique, art, animated, levelrestriction, mindamage, maxdamage,
slashusage, stancerestriction, defense, weight, durability, nogive, nodrop, pcolor, scolor,
imageurl, modifierXML` — and the identical defaults: `type→0` (`:68-75`), `unique→0` (`:76-83`),
`baseprice→1` (`:84-91`), `heavenlyprice→0` (`:92-99`), `art→id` (`:108-115`),
`slashusage→48` (`:164-171`), `stancerestriction→0` (`:172-178`), `uses→durability` (`:198-202`).
Combined with C3's frame match, **any itemdata-derived claim in this file may be ported without
the S0-3 build caveat.** Lane: all. Verdict HELD.

### C17 — a real data bug in the source: `<baseprice>.</baseprice>`
**A2.** `itemdata.xml` item **11037 "Santa Pants"** has `<baseprice>.</baseprice>` (the index's
`baseprice` sample list carries `"."` as a distinct value, 550 rows / 549 numeric).
`XMLItem.as:86-93` tests only for empty-string, so `gvalue = int(".") = 0` — the item is free.
A 1:1 recreation must either reproduce this or knowingly deviate; log it, do not "fix" it
silently. Lane: **items-equipment**, **economy**.

### C18 — ledger line 211 still holds: there is no items config in the build
**A3 (filesystem byte-check, not a vitest).** `ls src/config/` on 2026-08-15 returns:
`CLAUDE.md ai.ts anim.ts art.ts chi.ts combat-sim.ts combat.ts display.ts duel.ts economy.ts
fidelity.ts fx.ts gesture.ts mobs.ts nums.ts ogAnims.ts ogPose.ts palette.ts popups.ts poses.ts
profile.ts reach.ts rng.ts skills.ts stances.ts stats.ts timing.ts xp.ts` — **no `items.ts`**.
The ledger's *"no items config file exists yet — entirely un-ported"* is **still true**, and
after C1–C17 it is now the *only* thing standing between the payload and a 1:1 item system.
Lane: **items-equipment**. Verdict HELD (confirms, does not overturn).

---

## Adjacent finds (surfaced by following an itemdata field; flagged for the system lanes)

These are **not** itemdata rows. They were reached by chasing `<slashusage>` into
`StatsManager` and are reported because the ledger lists them as open blockers:

- **SPEED → slash length (reach), in px** — `StatsManager.as:1915-1919`:
  `getBaseSlashLengthVal(speed) { var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
  return int(120 + Math.floor(maxincrement * speed / (20 + speed))); }` — a base of **120 px**
  rising asymptotically toward `120 + 90 + 5·Dan`. Ledger combat-core blocker: *"**reach cap in
  px**"*; §1: *"reach cap in **px** per stance"*. Note it is **not** per-stance here.
  ⚠ The frames measure real strokes at 226–239 px (`reference/frames/session11/stance-reach/`
  filenames) — a frame-vs-code reconciliation is owed, and **the frame wins** if they disagree.
- **SPEED → skill cooldown** — `StatsManager.as:1854-1861`:
  `getSkillCooldownModifierVal(speed) { if(speed > 300) speed = 300; return 1 - speed / 300 * 0.5; }`
  → cooldowns scale linearly to a **50 % floor at SPEED 300**. Ledger skills blocker: *"the
  SPEED-stat→cooldown formula"*.
- **Heavy-stance defence penalty confirmed** — `MCSPlayer.as:3231-3237`:
  `getDefense() { if(this.stance == HEAVY_STANCE) { return defense * 0.8; } return defense; }`
  — matches the ledger's known-known exactly.

## STILL_UNHELD after this pass (say so, do not guess)

- What `<stancerestriction>` values **4** and **6** encode (C12).
- The `preSufArray` prefix/suffix **word lists** and the `prog1..prog5` tier thresholds — the
  remaining half of items blocker ④ (C8).
- Loot/drop **tables** (which enemy or node drops which item id) — nothing in itemdata addresses it.
- Whether an NPC "repair service" existed alongside the two repair consumables (C7).
- The meaning of `<unique>` value **2** (369 rows carry `unique`, values 1 and 2; the AS3 only
  ever tests `== 1` and `== 0`).
