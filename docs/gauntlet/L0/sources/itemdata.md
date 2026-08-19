# GAUNTLET L0 — SOURCE SWEEP: `itemdata` — **PASS 2** (2026-08-17)

**Unit:** `reference/extracted/itemdata.xml` (184,002 bytes · 10,545 lines · 982 `<item>`)
**Document under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20, avg ~42/100)
**Method:** index JSON first, then the file itself, then every AS3 consumer of every field,
then a frame to check the code against the shipped v0.717 picture.
**Pass 1 (2026-08-15, claims C1–C18) is retained verbatim below and is NOT restated here.**

---

## HEADLINE OF PASS 2

Pass 1 stopped at itemdata's own fields. Pass 2 followed itemdata's **consumers** —
`ItemGenerator`, `LootDialog`, `NPC`, `StatsManager` — and came back with the two things the
ledger calls unrecoverable or unmeasured in the *economy* and *progression* lanes:

1. **The complete L1–L98 XP table is on disk, byte-identical in BOTH builds, and a frame
   confirms it.** `REBUILD_READINESS.md` §6 lists *"L11–80 XP curve"* as **structurally
   UNRECOVERABLE**. It is not. That is the second §6 line to fall (after verbatim dialogue).
2. **Coins-per-kill and XP-per-kill are both exact formulas, not estimates.** Economy blocker
   ① (*"`=8` is an unconfirmed INFERRED seed; 20+ samples show no XP formula either"*) is
   fully closed — and the real answer is **~1.8 coins per kill on average, never 8**.

Also newly closed: the loot/drop tables, the affix **suffix** pool, the affix magnitude curve,
the item-name template, the Dragon Dance input, the duel-token economy, and the 30-minute
buff system that the ledger's own frame read ("150% DAMAGE", Potato Dog) had already *seen*
without being able to name.

**And a warning that changes how every other lane must cite:** the Android v0.682 bundle and
the web v0.717 bundle **disagree on tuning constants**. Concrete counterexample below (P8/P9).
Pass 1's C16 ("any itemdata-derived claim may be ported without the S0-3 caveat") is true for
itemdata *field semantics* and **false for AS3 numeric constants**. Label the build. Always.

**Frame first (own eyes, cropped and read):**
`reference/frames/s21_weapon/t655.0.png` (1920×1080; whole frame downscaled ×0.5 to read the
PLAYER screen; item panel legible at that scale) shows, verbatim on screen:
`PICKAXE` · `LEVEL 1` · `CONDITION: WELL-MAINTAINED` · `USED FOR MINING.` ·
`DMG: 1 - 3 (EQ: 1 - 2)` · `WEIGHT: 10` · `WEIGHT: 38 / 100` · `COINS 122` · `GOLD 3` ·
level badge `3` with `2098 / 2950  EXPERIENCE POINTS`.
Every one of those numbers is checked against the payload below.

---

## PASS-2 CLAIMS

### P1 — ⛔ §6's "L11–80 XP curve is structurally UNRECOVERABLE" is FALSE. The whole L1–L98 table is held, in both builds, and a frame proves it is the shipped curve.
**A2 + A1.**
`reference/decompiled/shs3_android/scripts/StatsManager.as:78`:
```
public static var expArray:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,43500,49850,56550,63900,71900,80300,89100,98300,108000,118300,129300,141100,154100,168100,183100,199100,216100,234100,253100,273100,294100,316100,339300,363300,389300,416800,445800,475800,507300,540300,574300,610300,647800,685800,725800,767800,812300,859300,908300,959300,1012300,1067300,1124300,1183300,1244800,1307800,1372800,1439800,1508800,1578800,1651800,1728800,1808800,1892800,1980800,2071800,2166800,2276800,2404800,2544800,2699800,2862800,3032800,3212800,3400800,3595800,3795800,4025800,4285800,4585800,4935800,5335800,5815800,6365800,6965800,7645800,8395800,9295800,10295800,11495800,12995800,14795800,16895800,19295800,22095800,25395800,29395800];
```
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364` declares the **same 99 values**
under the obfuscated name `§1t5923s0§` — measured element-by-element equal (`android len 99 ·
web len 99 · identical: True`). `StatsManager.as:76 public static var levelCap:int = 80` →
**L80 threshold = 4,285,800 XP**; the array runs to index 98 (29,395,800).
Consumers: `StatsManager.as:1586-1593 getLevel()` (first index whose threshold exceeds XP),
`:1598-1601 getXPtoLevel()`, `:1604-1606 getXPLevelThreshhold(level)`.

**A1 corroboration — the frame agrees with the code.**
`reference/frames/s21_weapon/t655.0.png`, XP-bar crop `(860,120)-(1290,215)` of the 1920×1080
frame (read at ×0.5 on the full frame, then confirmed on the same bar in `t711.0.png`):
level badge **3**, bar text **`2098 / 2950`**. `expArray[3] = 2950` and
`expArray[2]=1450 ≤ 2098 < 2950` ⇒ `getLevel()` returns 3. **Three independent quantities
(displayed level, current XP, next-level threshold) are mutually consistent with the table.**

**Overturns** `REBUILD_READINESS.md:350` (§6): *"**L11–80 XP curve** — no table published; a
solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."*
**Also overturns** `:200` (§4 progression blocker ②): *"**L11–80 XP curve — likely
unrecoverable** (no wiki table; both longplays cap at L10 …)"* and `:127` (§2 progression
"the thing blocking a 1:1"): *"L11–80 curve (likely unrecoverable)"*.
It **confirms** §1's L1–L10 caps ("550…31 400") exactly.
Lane: **progression** (score floor moves), **ui-hud** (the bar's denominator is `expArray[lvl]`).

### P2 — XP-per-kill is a closed formula: `base = mobLevel*2 + 20`, then a level-difference transfer function with a grey-out cut-off
**A2.** `reference/decompiled/shs3_android/scripts/NPC.as:218` and `:252`:
```
this.xp = this.level * 2 + 20;
```
`NPC.as:166-190`:
```
public static function calcXP(playerLevel:int, mobLevel:int, xp:int, elite:Boolean) : *
{  if(mobLevel <= getGreyLevel())        { return 0; }
   if(mobLevel - playerLevel > 3)        { return 0; }
   var finalXP:int = xp;
   if(playerLevel < mobLevel)  { finalXP = xp * (1 + 0.05 * (mobLevel - playerLevel)); }
   else if(playerLevel > mobLevel) { finalXP = xp * (1 - (playerLevel - mobLevel) / getZeroDifference()); }
   if(elite) { finalXP *= 2; }
   return finalXP; }
```
with `NPC.as:94-110 getGreyLevel()` (`<6 → 0`; `<40 → lvl - floor(lvl/10) - 5`;
`<60 → lvl - floor(lvl/5) - 1`; else `lvl - 9`) and `NPC.as:112-…
getZeroDifference()` (5/6/7/8/9… by player-level band).
`LootDialog.as:638-648 addLootXP` then applies **×1.5** if `BUFF_XP` or `BUFF_MODERATOR`, and
drops the XP entirely at `levelCap`.
Web v0.717 parity: `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:237` `this.xp =
this.level * 2 + 20;` and `:198` `_loc5_ = param3 * (1 + 0.05 * (param2 - param1));`.
**Overturns** `REBUILD_READINESS.md:215` (economy blocker ①): *"(`=8` is an **unconfirmed
INFERRED seed**; 20+ samples show **no XP formula either**)"* — the XP half.
Also closes `:200` progression blocker ④ *"full XP-income model"* for the kill channel.
Lane: **progression**, **economy**, **enemies-ai**.

### P3 — Coins-per-kill: the drop is per-NPC, the pickup is worth **1 or 5 coins**, and the measured expectation is **~1.8/kill — never 8**
**A2.** `reference/extracted/npcdata.xml` carries `<reward><loot><id>/<qty>/<chance>` (131 rows
over 66 of 495 NPCs — index `npcdata.json` `npcdata/npc/reward/loot` count 131, chance range
0.05–1.0, qty range 1–5). `reference/decompiled/shs3_android/scripts/NPC.as:799-856` decodes
the `<id>` as an **enum, not an item id**:
```
if(chance == 100 || Math.random() * 100 < chance) { …
   if(lootType == 0)      { OverworldHUD.instance.lootDialog.addLootCoins(1 * qty); }
   else if(lootType == 1) { OverworldHUD.instance.lootDialog.addLootCoins(5 * qty); }
   else if(lootType == 2) { OverworldHUD.instance.lootDialog.addQuestLootItem(); }
   else if(lootType == 3) { OverworldHUD.instance.lootDialog.addRandomLootItem(this.level,false,true); }
   else                   { OverworldHUD.instance.lootDialog.addLootItemBasic(lootType,qty); }
```
Web v0.717 is identical — `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:860-878`
(`… (1 * _loc8_) … (5 * _loc8_) … (this.level,false,true) …`).
Measured over all 66 loot-bearing NPCs (`Σ coinValue × qty × chance`):
**min 0.50 · max 10.00 · mean 1.78 coins/kill**, and **429 of 495 NPCs drop nothing at all.**
Verbatim examples: `npcdata.xml:22` npc 1 "Ruffian" lvl 3 → `<loot><id>0</id><qty>2</qty>
<chance>0.5</chance>` = **1.0 coin expected**; `:145` npc 6 "Thug" lvl 2 → `id 0 / qty 3 /
chance 0.5` = 1.5; `:273` npc 11 "Bandit" lvl 10 → three rows (`0/5/0.05`, `3/1/0.1`,
`0/5/0.1`) = 0.75 coins **plus a 10 % random-item roll**.
Only 4 of the 131 rows name a real item id: 2112 "Small Meat", 2113 "Meat", 2114 "Large Meat",
20028 "Animal Fang".
**Overturns** `REBUILD_READINESS.md:215` (economy blocker ①): *"coins-per-kill reality (`=8` is
an **unconfirmed INFERRED seed**…)"*. The seed is not merely unconfirmed — it is **~4.5×
too high**. Lane: **economy**, **enemies-ai**, **progression**.
*Bonus (art/feel, uncatalogued anywhere in the ledger):* the same block spawns each pickup as a
physics projectile — `movtx = random*16 − 8` (mirrored away from stage edges at x<100 /
x>width−100), `movty = −random*10 − 20` for coins vs `−random*10 − 25` for items,
`rot = ±20`, spawned at `mcs.y − 50` — i.e. coins pop **lower** than item drops.

### P4 — The loot/drop tables are held in full: three level-banded global pools, not per-enemy tables; **only 188 of 982 items (19.1 %) are randomly obtainable**
**A2.** `reference/decompiled/shs3_android/scripts/LootDialog.as:67-85` declares ten literal
arrays; `:448-496 addRandomLootItem` is the whole algorithm:
```
if(StatsManager.hasBuff(StatsManager.BUFF_RARELOOT) && int(Math.random() * 4) == 0)
{ isRareItem = true; alwaysGive = true; }
if(!alwaysGive && int(Math.random() * 2) == 0) { return; }
… if(playerlevel < 30) reward = randomItemList1[…]; else if(playerlevel < 60) …List2 …; else …List3 …;
if(QuestEngine.getItemData(reward).levelrestriction <= playerlevel + 3) { … } 
… (after 4 failed picks) this.lootList.push(new Item(this.consolationPrizeList[…],1));
```
So: **base 50 % chance to drop anything**; the Rare-Loot buff gives a **1-in-4 upgrade to
guaranteed + rare**; the pool is chosen by **player level bands 0–29 / 30–59 / 60+**; a pick
whose `minlvl > playerLevel + 3` is rejected and retried up to 4 times, then a
**consolation prize** is given from `[2103,2104,2106,2107,20054,20055]`.
List sizes (measured): `ironWeaponList` 38 · `bronzeItemList` 33 · `steelItemList` 33 ·
`randomItemList1` 119 · `randomItemList2` 113 · `randomItemList3` 114 ·
`randomMerchantItemList1/2/3` 111/104/104 · `consolationPrizeList` 6.
**Union of every random pool = 188 distinct ids = 19.1 % of the 982-row catalogue**, and all
188 resolve to real itemdata rows (0 dangling ids).
Web v0.717 parity is exact: `reference/decompiled/shs3_payload/scripts/§1t6172s0§.as:76`
holds the identical `[13100,13101,13103,…,13208]` and `:82` the identical 119-entry
`randomItemList1`.
Sibling generators in the same file: `:499-516 addRandomSword` (iron/bronze/steel by the same
bands, then `sword.setUses(1)` = "Well-Maintained"), `:520-545 getRandomRareItem`,
`:547-572 getRandomRareMerchantItem`, `:574-602 getRandomPremiumItem` and `:604-636
getRandomLegendaryMerchantPremiumItem` — the last two both splice in the same premium extras
`[4005,5002,7022,11005,12002,4061,9010]`.
**Overturns** `REBUILD_READINESS.md:93` (§1 KNOWN-UNKNOWNS): *"loot/drop tables"* — and
**overturns Pass 1's own STILL_UNHELD** line *"Loot/drop **tables** (which enemy or node drops
which item id) — nothing in itemdata addresses it."* Nothing in *itemdata* does; its consumer
holds all of it. Lane: **items-equipment**, **economy**, **enemies-ai**, **world-exploration**
(`Obj_Chest*`, `Obj_Bush`, `Obj_Corpse`, `Obj_DragonDanceLoot` all call the same entry point
with `this.lvl`).

### P5 — The affix **suffix** pool (and the prefix pool, and the tier rule) is held verbatim — 17 stat classes × 8 tiers, tier = `floor(itemLevel / 10)`
**A2.** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:102-127` — the complete
word lists, quoted verbatim for the seven non-elemental classes:
```
maxhp_pre    ["Vital","Rugged","Tough","Earthy","Dynamic","Wayfarer's","Survivor's","Guardian's"]
maxhp_suf    ["of Health","of Fortitude","of Vitality","of Constitution","of Resilience","of Longevity","of Life","of the Ox"]
hpregen_pre  ["Warm","Calm","Tireless","Pure","Organic","Regenerating","Healing","Natural"]
hpregen_suf  ["of Healing","of Remedy","of Recovery","of Regrowth","of Regeneration","of Blessing","of Restoration","of Regrowth"]
maxchi_pre   ["Reserved","Patient","Peaceful","Blessed","Mystic","Spiritual","Priestly","Saintly"]
maxchi_suf   ["of Energy","of Wisdom","of Reserve","of Grace","of Logic","of Balance","of Understanding","of Consciousness"]
chiregen_pre ["Blessed","Miko's","Priest's","Spiritual","Sparkling","Savant","Celestial","Master's"]
chiregen_suf ["of Focus","of Meditation","of Chanting","of Concentration","of the Priest","of the Moon","of the Star","of the Sun"]
attack_pre   ["Sharp","Fierce","Vicious","Savage","Brutal","Deadly","Fine","Warrior's"]
attack_suf   ["of Attack","of Biting","of Striking","of Killing","of Slaughter","of Slaying","of Carnage","of the Butcher"]
defense_pre  ["Sturdy","Dense","Fortified","Stout","Resistant","Protective","Lord's","Shogun's"]
defense_suf  ["of Defense","of Blocking","of Guarding","of Protection","of Absorption","of Warding","of the Shield","of the Titan"]
speed_pre    ["Fast","Quick","Nimble","Hasty","Swift","Whistling","Lizard's","Snake's"]
speed_suf    ["of Speed","of Alacrity","of Haste","of Velocity","of Acceleration","of Sleight","of Swiftness","of Quickness"]
```
plus the four elemental attack lines (`fiery/hot/burning/scorching/flaming/blazing/sizzling/
molten` → `of Tinder … of Incineration`; wind `Drafty…Glowing` → `of Air … of Storms`; water
`Wet…Shivering` → `of Water … of Winter`; earth `Rugged…Mountain's` → `of Dust … of the
Mountain`) and two degenerate lines (`criticaldmg` = "Crit"/"of Crit" ×8, `piercingdmg` =
"Piercing"/"of Piercing" ×8 — **placeholders that shipped**).
Tier rule, `ItemGenerator.as:128-148`: `num = Math.floor(i / 10)` over `i = 0…MAXINDEX(79)` ⇒
**8 word tiers, one per 10 item levels.**
*Elemental **defence** affixes borrow the opposing element's words* — `:142-145`:
`preSufArray[FIREDEF] = wateratk_*`, `[WINDDEF] = earthatk_*`, `[WATERDEF] = windatk_*`,
`[EARTHDEF] = fireatk_*` (a 4-cycle fire→water→wind→earth→fire). Whether that is a designed
opposition or a copy-paste is **not** established; the mapping itself is measured.
⚠ **Build caveat, stated plainly:** these literals are **v0.682 (Android)**. The web v0.717
`ItemGenerator` (`reference/decompiled/shs3_payload/scripts/§1t1644s0§.as:107-146`) builds the
same 17×8 structure but pulls the words from the language table at ids **10029, 10037, 10045,
… 10197** (+ 10205–10208 for crit/pierce). Our held string table
(`docs/gauntlet/L0/index/strings.json`, from Android `118_Mobile_Lang_EN.bin`) tops out at
numeric id **9010** — so the v0.717 wording is **STILL_UNHELD**; only the v0.682 wording is.
**Closes the second half of** `REBUILD_READINESS.md:210` blocker ④ *"affix **suffix** pool +
per-rarity affix count"* (Pass 1's C8 closed the count half and explicitly left this open).
Lane: **items-equipment**, **rebirth-elements** (the elemental affix classes are the gear side
of the element system).

### P6 — The item-name template: up to **three prefixes + one suffix**, drawn from fixed modifier slots
**A2.** `ItemGenerator.as:735-750`:
```
case 0: itemName = basename;
case 1: itemName = drawPreSufValue(mod[0],true) + " " + basename;
case 2: itemName = drawPreSufValue(mod[0],true) + " " + basename + " " + drawPreSufValue(mod[1],false);
case 3: itemName = drawPreSufValue(mod[2],true) + " " + drawPreSufValue(mod[0],true) + " " + basename + " " + drawPreSufValue(mod[1],false);
default: itemName = drawPreSufValue(mod[3],true) + " " + drawPreSufValue(mod[2],true) + " " + drawPreSufValue(mod[0],true) + " " + basename + " " + drawPreSufValue(mod[1],false);
```
with `:873-882 drawPreSufValue` = `preSufArray[statToMod(mod.id)][getModTier(mod.id,mod.value)]`
and `:884-895 reverseFindTier` (first prog index whose value ≥ the rolled magnitude).
So a 5-affix legendary reads e.g. *"Swift Sturdy Sharp Iron Sword of Slaughter"*, and the
**5th affix never appears in the name**. Lane: **items-equipment**, **ui-hud**.

### P7 — The affix magnitude-vs-level curve is five closed-form tables, not a mystery
**A2.** `ItemGenerator.as:150-198` builds `prog1…prog5` over 80 tiers:
`prog1 = floor(1 + 1·i)` (ATTACK, DEFENSE) · `prog2 = floor(5 + 5i/3)` (MAXHP, MAXCHI) ·
`prog3 = floor(1 + i/3)` (both regens, all 8 elemental ATK/DEF, CRITICALDMG) ·
`prog4 = floor(1 + 2i/3)` (SPEED) · `prog5 = floor(1 + i/5)` (PIERCINGDMG); `prog1..prog3`
each get `+10` at the top index only. Computed endpoints:
| table | tier 0 | tier 39 | tier 78 | tier 79 (cap) |
|---|---:|---:|---:|---:|
| prog1 ATK/DEF | 1 | 40 | 79 | **90** |
| prog2 HP/Chi | 5 | 70 | 135 | **146** |
| prog3 regen/elem/crit | 1 | 14 | 27 | **37** |
| prog4 SPEED | 1 | 27 | 53 | **53** |
| prog5 PIERCING | 1 | 8 | 16 | **16** |
Roll: `:321-334 getMaxTier(nodelvl, getHighestTier)` — the **first** affix rolls
`rand(4) + (lvl+1) − 3` (≤3 tiers below item level), every later affix rolls
`rand(10) + (lvl+1) − 9`; the magnitude is then `prog[maxTier−1] + rand(prog[maxTier] −
prog[maxTier−1])`. For WEAPON-ATTACK and ARMOR-DEFENSE the tier input is
`nodelvl − levelrestriction` (`:463-472`) — which is why the negative `<minlvl>` values
(Branch −4, Pickaxe −4) exist: they *raise* the affix tier of a low-requirement weapon.
Durability on a drop: `:648-661` — `uses = rng.rand(durability − 50)` below node level 20,
`rng.rand(durability)` at 20+, and **legendary items roll `uses = 0` = "Unbreakable"**.
**Closes** `REBUILD_READINESS.md:210` blocker ① *"item stat-magnitude **vs level** curve"* on
its randomised-affix side (Pass 1's C4 closed the fixed base-stat side from the XML rows).
Lane: **items-equipment**, **progression**.

### P8 — ⛔ §3 correction 7 is WRONG in both halves: rebirth gold is **+25 normally and +100 at the tenth**, and the Dan ceiling is real
**A2.** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638-2657` (**web v0.717**):
```
public static function §1t9600s0§() : *          // doRebirth
{  §1t9518s0§ = true;  §1t9599s0§();             // didRebirth = true; unequipAll()
   §1t9712s0§(§1t8755s0§,0);                     // setStat(STAT_XP, 0)
   if(§1t7356s0§(§1t9426s0§) == 8)               // if(getPlayerStats(STAT_DAN) == 8)
   {  §1t9713s0§(§1t9413s0§,100);                //    changeStat(STAT_HGOLD, 100)
      §1t3318s0§.instance.§1t3409s0§(§1t1521s0§.getString(864,[§1t9765s0§(),"10"])); }
   else
   {  §1t9713s0§(§1t9413s0§,25); }               //    changeStat(STAT_HGOLD, 25)
   if(§1t7356s0§(§1t9426s0§) < 9) { §1t9713s0§(§1t9426s0§,1); }   // DAN++ only while DAN < 9
```
Name mapping from the Android twin `StatsManager.as:2195-2214` (`doRebirth`, same shape):
`STAT_HGOLD = 12` (`StatsManager.as:194`), `STAT_DAN = 25` (`:220`), `getString(864)` =
`"[0] has rebirthed and is now Dan [1]!"` (`strings.json` entry 864).
So in the shipped web build: **+25 heavenly gold per rebirth, +100 on the rebirth that takes
you to Dan 10** (announced with a hard-coded `"10"`), and **DAN saturates at 9** (zero-indexed;
the announcement prints `DAN + 1`, so **10 displayed Dan ranks**). Rebirth also zeroes XP,
unequips everything, rebuilds an 8-slot skill bar with slot 0 = skill 1003, deletes
proc-gen daily quests, un-assigns stat points, and teleports to node **8382465**.
**Overturns** `REBUILD_READINESS.md:164-165` (§3 correction 7): *"**`MAX_DAN_RANK=10` and
`tenthGold=100` should be INFERRED, not CONTRACT.** The only wiki datum is garbled … film
shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."* Both constants are
**CONTRACT**, sourced from v0.717 code; the "no 10th-rebirth tier" reading is wrong; the
"+25" film read is right for the *base* case only. If a frame ever shows otherwise the frame
wins — but no frame is cited by the ledger for this line, and this is A2 from the shipped
v0.717 binary. Lane: **rebirth-elements**, **economy**, **meta-social**.

### P9 — ⛔ The Android v0.682 and web v0.717 bundles **disagree on tuning constants** — two measured counterexamples
**A2.** Same function, two builds:
| quantity | Android v0.682 | Web v0.717 |
|---|---|---|
| rebirth gold, normal | `StatsManager.as:2207` `changeStat(STAT_HGOLD,5)` | `§1t1523s0§.as:2651` `…,25)` |
| rebirth gold, Dan 8 | `:2203` `changeStat(STAT_HGOLD,20)` | `:2646` `…,100)` + `"10"` announcement |
| new-character heavenly gold | `:706` `setPlayerStats(STAT_HGOLD,0)` | `:1024` `…,3)` |
The third row is settled by a **frame, and the frame wins**:
`reference/frames/s21_weapon/t655.0.png` header crop `(150,120)-(860,215)` reads
`COINS 122` / **`GOLD 3`** on a GUEST character — i.e. the shipped web build, matching v0.717's
`3`, not Android's `0`.
**Scopes Pass 1's C16** (*"any itemdata-derived claim in this file may be ported without the
S0-3 build caveat"*): true for itemdata **field semantics and defaults** (which C16 verified
field-by-field), **false for AS3 numeric constants**, where the builds demonstrably diverge.
Every ported constant must name its build. Lane: **all** (methodological).

### P10 — Guest start-state, complete and frame-checked
**A2 + A1.** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:1007-1030` (web v0.717
character init; obfuscated setter `§1t7357s0§` = `setPlayerStats`, stat order identical to
`StatsManager.as:170-202`): HP 10/10, HP-regen 1, Chi 10/10, Chi-regen 1, ATK 1, DEF 1, SPD 1,
XP 0, level 1, **coins 100**, **heavenly gold 3**, **AP 30/30**, **duel tokens 20/20**,
skill points 0, stat points 0, location node 8382465. Default starting gear from the same
signature and from `:2630-2634`: armor **4017 "Torn Garment"**, pants **11017 "Torn Pants"**,
shoes **12017 "Worn Sandals"**, weapon **0** (→ auto-equips 13002 "Branch"), scabbard **13100
"Iron Sword"**.
`t655.0.png` shows GOLD 3, HP-side numbers consistent with the ledger's HP10/Chi10 (visible as
`20 / 20` and `10 / 10` on `t711.0.png` after two stat points), and the paperdoll wears a grey
robe + white hakama + sandals.
**Confirms** `REBUILD_READINESS.md:79` (*"100c/3g guest start"*) and `:199` (*"start pools
(HP10/Chi10/AP30)"*) and **adds** the never-recorded **duel-token start 20/20**
(`StatsManager.as:166 MAXDUELTOKENS = 30` is the *later* ceiling, not the start).
Lane: **progression**, **economy**, **meta-social**.

### P11 — The Dragon Dance **input** is an item: 2211 "Dragon Dance Scroll", modifier id 122
**A2.** `reference/extracted/itemdata.xml:2430-2443`:
```
<item>
    <id>2211</id> <type>12</type> <name>4386</name> <unique>1</unique>
    <weight>0</weight> <nogive>1</nogive> <nodrop>1</nodrop> <desc>4387</desc>
    <modifier> <id>122</id> <value>0</value> </modifier>
</item>
```
`resolved_names.json` → 2211 = **"Dragon Dance Scroll"**.
`reference/decompiled/shs3_android/scripts/InventoryUI.as:1071-1076`:
```
if(modid == 122) { this.onLeave(null); OverworldHUD.instance.onShowDragonDanceUI(); return; }
```
So Dragon Dance is opened from the inventory by a soulbound (`nogive`+`nodrop`+`unique`),
weightless, unpriceable quest-type scroll. **Partly overturns**
`REBUILD_READINESS.md:205` blocker ④ *"Dragon Dance **input** + Kanji-statue bonus"* — the
input is held; what the UI *contains* is not. `Obj_DragonDanceLoot.as:328-330` additionally
shows the reward shape: **two guaranteed rare rolls + one 50 % roll**, all at the object's level.
Verdict PARTIAL. Lane: **rebirth-elements**, **items-equipment**, **ui-hud**.

### P12 — The duel-token economy: exact price points, cap, and regen interval
**A2.** `itemdata.xml` items 2125/2126/2127 (lines 374/388/402) resolve to
**"10 Duel Tokens" / "25 Duel Tokens" / "40 Duel Tokens"**, each `<baseprice>0</baseprice>`
with `<heavenlyprice>` **1 / 2 / 3** and `<modifier><id>15</id>` (STAT_DUELTOKENS) value
**10 / 25 / 40**. Ceilings and regen: `StatsManager.as:166 MAXDUELTOKENS:int = 30`,
`:160 DTINTERVAL:int = 2 * 60` (a 120-second token tick), start 20/20 (P10),
`LootDialog`/`StatsManager.as:1134` show `BUFF_DUELTOKENS` accelerating it.
**Closes part of** `REBUILD_READINESS.md:215` economy blocker ④ *"token/tournament economy
numbers"* — the *token* half. Tournament payouts remain unheld.
Lane: **economy**, **meta-social**.

### P13 — The 30-minute buff system is held, and it names the buff the ledger's own frame read
**A2.** `InventoryUI.as:1094-1097`: `if(modid == 38) { StatsManager.setBuff(item.modifierXML[i]
.value, 30 * 60); }` — **1,800 s = 30 minutes**, uniformly.
`StatsManager.as:288-312`: `BUFF_XP 0 · BUFF_ATTACK 1 · BUFF_DEFENSE 2 · BUFF_SPEED 3 ·
BUFF_AP 4 · BUFF_DUELTOKENS 5 · BUFF_COINS 6 · BUFF_RARELOOT 7 · BUFF_MUTE 8 · BUFF_FULLMUTE 9
· BUFF_HELL 10 · BUFF_INJURED 11 · BUFF_MODERATOR 12`.
The six `modifier id 38` items in itemdata, with values, all priced **1 heavenly gold**:
`:237` 2115 **"Potato Dog"** = 1 (**ATTACK**) · `:251` 2116 "Potato Bear" = 2 (DEFENSE) ·
`:265` 2117 "Potato Raccoon" = 0 (XP) · `:279` 2118 "Potato Cat" = 3 (SPEED) ·
`:838` 2140 "Potato Pig" = 4 (AP) · `:852` 2141 "Potato Duck" = 5 (DUEL TOKENS).
`REBUILD_READINESS.md:178` records, from Kheshav-adjacent first-hand frame reading, a
**"150% DAMAGE" buff (Potato Dog)** on screen — the ledger *saw* this system and could not name
it. It is now named, enumerated, and timed; the **150 % magnitude itself is STILL_UNHELD**
(`setBuff` stores only a type and an expiry; the multiplier lives in the damage path, not read
this pass). Lane: **combat-core**, **economy**, **ui-hud**, **meta-social**.

### P14 — `<unique>` value **2** = NPC-wardrobe-only art: 116 rows, **zero** of them obtainable
**A2 (measured).** Partition of the 369 `<unique>` rows: **253 = 1, 116 = 2** (613 rows omit
the tag → 0 by `XMLItem.as:78-84`). Cross-tabulated against every loot/merchant array of P4 and
against the `<mcs>` paperdoll blocks of `npcdata.xml`:
| `unique` | n | in any random pool | on an NPC paperdoll |
|---|---:|---:|---:|
| 0 (absent) | 613 | 183 | 300 |
| 1 | 253 | 5 | 50 |
| **2** | **116** | **0** | **109** |
AS3 behaviour: `NetworkManager.as:1981` `if(itemXML == null || itemXML.unique != 0) { return; }`
blocks **bank/trade storage** for 1 *and* 2; every other gate (`Item.as:392,419,436,498,560,622`,
`InventoryUI.as:1169,1322`, `ShopUI.as:332,541`) tests only `== 1`, so a `unique 2` item is
sellable and droppable but never bankable — and never reachable, because nothing generates it.
Examples: 4031–4036 (NPC torsos), 7052 (a hat worn by npc 0), 8008–8011 (faces), 13053–13057
(NPC-only swords).
**Resolves Pass 1's STILL_UNHELD** *"The meaning of `<unique>` value 2"* to a measured
behaviour. The designers' *label* for it is still not in code → verdict PARTIAL.
Lane: **items-equipment**, **enemies-ai**, **art-anim-audio-feel**.

### P15 — `<stancerestriction>` is **dead data in both shipped builds**
**A2 (exhaustive grep).** `grep -rn "stancerestriction\|stanceRestriction"
reference/decompiled/` returns **six hits, all inside the two XMLItem classes**:
`shs3_android/scripts/XMLItem.as:38,160,162,166,321,327` and
`shs3_payload/scripts/§1t104s0§.as:30,172,174,178` (web). The only non-parse use is
`XMLItem.as:327 this.desc += LangManager.getString(125) + ": " + this.stancerestriction;`
(string 125 = **"Stance Restriction"**) — a **tooltip line, in the Android build only**. No
equip gate, no combat gate, in either bundle.
Measured distribution over the 53 rows: value **6** on 46 weapons (all four material lines:
Iron/Bronze/Steel Sword at weight 15, Iron/Bronze/Steel Sabre at weight 5/10) and value **4**
on 7 weapons, *all* Sabres at weight 15 (13206, 13207, 13208, 13215, 13216, 13226, 13227).
**Refines Pass 1's C12**: five stances exist (`MCSPlayer.as:27-35`), 53 weapons carry the tag —
but the tag is **never read by gameplay**, so a 1:1 recreation must reproduce a *label*, not a
restriction. What 4 and 6 encode remains **STILL_UNHELD** (they are not stance indices; the
bitmask reading stays a hypothesis). Lane: **combat-core**, **items-equipment**.

### P16 — The Android string table's UI copy **is** the v0.717 on-screen copy (three measured parity points)
**A1 + A2.** Stage-0b finding S0-3 carries the caveat *"UI copy and combat tuning parity is
**NOT** established"* for the Android `118_Mobile_Lang_EN.bin` table. Three strings now check
out directly against a v0.717 video frame:
| string id | held table text | what `t655.0.png` shows |
|---|---|---|
| 392 | `Condition: Well-Maintained` | `CONDITION: WELL-MAINTAINED` |
| 4244 | `Pickaxe` | `PICKAXE` |
| 4245 | `Used for mining.` | `USED FOR MINING.` |
(4244/4245 are exactly `itemdata.xml:8146-8156`'s `<name>` and `<desc>` for item **13022**;
392 is the `uses == 1` branch of `Item.as:714-746`. The frame renders all-caps — a font/UI
transform, not a different string.) The same crop also validates the *numbers*:
`DMG: 1 - 3` and `WEIGHT: 10` against `<mindamage>1</mindamage><maxdamage>3</maxdamage>
<weight>10</weight>`, and `(EQ: 1 - 2)` against the equipped Branch (13002, 1–2).
**Narrows S0-3's caveat**: UI copy parity is now *evidenced* (3/3 hits), not assumed. It is
**not** proven wholesale — P9 shows the same two builds diverging on numbers — so the honest
statement is "no counterexample found in UI copy; two counterexamples found in tuning
constants." Lane: **ui-hud**, **items-equipment**, **art-anim-audio-feel**.

### P17 — Procedural item colouring exists, with an 11-name palette vocabulary
**A2.** `ItemGenerator.as:663-666`: `if(itemID == 4062 || itemID == 4077 || itemID == 11040)
{ newItem.setPrimaryColor(ColorCode.generateDarkColor(this.rng.getSeed())); }` — those three
ids resolve to **"Female Kimono" (4062)**, **"Garment" (4077)** and **"Pants" (11040)**, and
all three sit in every random loot pool (P4). `ColorCode.as:95-102`:
```
public static function generateDarkColor(seed:int) : uint
{  var rng:RNG = new RNG(seed);
   var r:int = rng.rand(128); var g:int = rng.rand(128); var b:int = rng.rand(128);
   return r << 16 | g << 8 | b; }
```
— i.e. each channel uniform on **0–127**, so every generated garment is in the dark half of the
cube. The naming vocabulary is `ItemGenerator.as:91` `colorNameList = getString(432…442)` =
**Red, Orange, Yellow, Green, Blue, Purple, Pink, Brown, White, Grey, Black**
(`strings.json` entries 432–442). `<pcolor>`/`<scolor>` are declared in `XMLItem.as:20-24` but **no
itemdata row uses them** (measured tag histogram over all 10,545 lines: no `pcolor`/`scolor`
tags), so item colour is a **runtime** property only.
Nothing in the ledger's art or items lanes mentions dyed/tinted gear. New, not an overturn.
Lane: **art-anim-audio-feel**, **items-equipment**.

### P18 — Two shipped data bugs that a 1:1 recreation must decide about
**A2.** (a) `reference/extracted/itemdata.xml:6902` — item **11037 "Santa Pants"**:
`<baseprice>.</baseprice>`. `XMLItem.as:86-93` tests only for empty string, so
`gvalue = int(".") = 0` and the item is free. (Confirmed from Pass 1's C17 — it is real, at
that exact line.)
(b) `reference/extracted/npcdata.xml:31` — the `<hair>` list of npc 1 "Ruffian" reads
`6000,6001,6002,6003,6004,6007,6008,6009,6013,6014,6015.6017,6018,6019` — a **period instead of
a comma**, and a second `<mcs>` token in the file is the collapsed float
`6.5006501650265E+47`. Both are consumed by `MCSCharacter.as:581-607`'s
`getDefinitionByName(partType + art.toString())`, which fails the lookup and silently falls back
to `partType + "0"`. So specific ruffians render the **default hair** in the shipped game.
Reproduce or deviate — but log it; a "corrected" recreation will not match the footage.
Lane: **items-equipment**, **enemies-ai**, **art-anim-audio-feel**.

---

## PASS-2 STILL_UNHELD (honest list)

- **The v0.717 affix word lists.** Held only for v0.682 (P5); the web build reads string ids
  10029–10208, which are absent from our Android table (max numeric id 9010). The web payload
  ships **no** string-table blob (S0-1 accounts for all 27), so this needs the dead server's
  language file or a frame showing an affixed item name. No such frame was found this pass.
- **What `<stancerestriction>` 4 and 6 encode** (P15). Unenforced in both builds; no frame,
  no string, no consumer. The bitmask reading is a hypothesis, not a finding.
- **The buff *magnitudes*** — `setBuff` stores type + expiry only (P13); the "150 %" the
  ledger's frame shows is not traced to a constant this pass.
- **The item "LEVEL 1" badge on `t655.0.png`.** `Item.as:274-299 getLevel()` returns
  `max(affixTier+1, levelrestriction)` clamped to `levelCap` — for a modifier-less Pickaxe
  (`minlvl −4`) that is **0**, but the frame prints `LEVEL 1`. Frame vs code disagree, and
  **the frame wins**: the shipped display applies a floor or an offset that was not located.
  Flagged, not guessed.
- **Tournament / betting payouts** — P12 closes duel tokens only.
- **Whether an NPC repair *service* existed** alongside the two repair consumables (Pass 1 C7).
- **`<art>` → SWF symbol bytes.** P4/P17 give the ids; the shapes themselves are only
  reachable through `reference/extracted/shapes/` + `sprites/`, not audited here.


---

# ══════════ PASS 1 (2026-08-15) — RETAINED VERBATIM ══════════

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
