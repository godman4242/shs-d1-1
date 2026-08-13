# GAUNTLET L0 — system survey: **economy** (ledger score 48/100)

Surveyor: economy lane. Date: 2026-08-13.
Document under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20), §2 table row
`| **economy** | 48 | prices, services, currencies, war-room costs | sell-price + prosperity formulas; coins-per-kill reality; server-sim economy |`
and the `### economy — 48` block at §4 (lines 213–216).

---

## PROVENANCE CAVEAT — read this before trusting any A2 cite below

Every AS3 formula in this survey comes from **`reference/decompiled/shs3_android/`**, the
Android port. Two facts about it, both checked first-hand:

- `reference/decompiled/shs3_android/scripts/StatsManager.as:30` —
  `public static var clientVersion:Number = 0.682;`
  The web Flash build proven in REBUILD_READINESS §5 was **v0.717**. The Android bundle is an
  **earlier** client. Numbers may have been rebalanced between .682 and .717.
- The web payload is **not decompilable**: `reference/decompiled/shs3_payload/scripts/` holds
  652 files and **zero** game-logic classes (ColorPicker skins, `hair6000.as`, `foot12000.as`…),
  and `reference/decompiled/shs3_stage2/scripts/com/swfdefender/MD5.as` shows the web SWF is
  SWFDefender-protected. `shs3_android` and `shs3_android_payload` are **byte-identical** for
  `InteractUI.as` and `Item.as` (`diff -q` → no output).

So: these are **A2 payload rows**, admissible, but they are the *Android* client's rows.
Where a longplay frame ever contradicts one of them, **the frame wins** — I say so explicitly
in E-03 below, which is the one place a frame reading is already on record.

---

## CLAIMS

### E-01 — **sell-price formula is HELD, verbatim, and it is not what anyone assumed** (OVERTURNS BLOCKER ②)

Ledger sentence overturned: *"② sell-price + prosperity-daily-sim formulas."* (§4 economy Blockers)

`reference/decompiled/shs3_android/scripts/Item.as:1582`:

```
      public function getSellAmt() : int
      {
         if(this.itemID < 3000)
         {
            return 1;
         }
         if(this.getWeight() >= 10)
         {
            return (1 + this.getModifierCount()) * 10;
         }
         return (1 + this.getModifierCount()) * 5;
      }
```

Called at `ShopUI.as:401` — `slot.setCost(slot.getItem().getSellAmt(),0);` — and the coins are
paid at `ShopUI.as:540` — `StatsManager.changeGold(this.displayItem.getCost());`.

Three consequences that a rebuild would otherwise get wrong:
1. **Sell price is completely independent of `<baseprice>`.** It is a function of item id band,
   weight, and *affix count only*. Any "sell = X% of buy price" model is false.
2. `ShopUI.as:58` declares `internal var sellPercentage:Number = 0.5;` — **dead code**. `grep -rn
   "sellPercentage"` over the whole bundle returns exactly that one declaration line, no reads.
   That constant is a trap for a future porter.
3. Every consumable/material (`itemID < 3000`) sells for exactly **1 coin**.

Verdict: **HELD**.

### E-02 — **Repair-Weapon cost is HELD** (OVERTURNS BLOCKER ③ *and* the §5 Tier-2 task list)

Ledger sentence overturned: *"③ Repair-Weapon cost (never captured)."*
Also kills the §5 Tier-2 line *"**Items/economy session:** … read Repair cost"* — no build needed.

`reference/decompiled/shs3_android/scripts/InteractUI.as:1057`:

```
            case "repairweapon":
               cost = StageManager.getCurrentNodeLevel() * 10;
```

and on success (`:1073`) `if(weapon.uses > 1) { weapon.uses = 1; }` — repair resets condition to
tier 1, it does not restore to "new". Repair is refused for `itemID == 0 || itemID == 13000`
(bare fists / starter blade), `InteractUI.as:1066`.

Verdict: **HELD**.

### E-03 — **coins-per-kill is HELD and it is a RANDOM ROLL, not a flat 8** (OVERTURNS BLOCKER ① and the repo's own config)

Ledger sentence overturned: *"① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**;
20+ samples show no XP formula either)."*

`reference/decompiled/shs3_android/scripts/EnemyPlayer.as:1293`:

```
         if(this.isDuelist)
         {
            OverworldHUD.instance.lootDialog.addRandomLootItem(level);
            if(level <= 10 || int(Math.random() * 3) == 0)
            {
               OverworldHUD.instance.lootDialog.addLootCoins(Math.random() * level);
            }
         }
```

So: coins per duelist kill = `floor(U[0,1) × enemyLevel)`, and **above level 10 the coin drop
only fires 1 kill in 3**. Field mobs use a different path — `NPC.as:837`:

```
               if(lootType == 0)
               {
                  OverworldHUD.instance.lootDialog.addLootCoins(1 * qty);
               }
               else if(lootType == 1)
               {
                  OverworldHUD.instance.lootDialog.addLootCoins(5 * qty);
               }
```

There is also a global multiplier, `LootDialog.as:650`:
`if(StatsManager.hasBuff(StatsManager.BUFF_COINS)) { num *= 1.5; }`.

**Frame-vs-doc note (the standing invariant):** the repo config `src/config/economy.ts:37`
carries `export const KILL_REWARD = { coinsFlat: 8 };` with the docblock *"COINS have NO source
formula found, so they stay INFERRED — and FLAT, not per-level"*. The single filmed HUD read of
`+8 COINS` is **not** contradicted by the payload — at a level-9 duelist, `floor(U[0,1)×9)`
yields 0–8, so 8 is the top of the range. The frame and the payload agree; what is refuted is the
*model* (flat constant) inferred from that one frame. The payload supplies the generator the
frame only sampled once.

Verdict: **HELD**.

### E-04 — **the XP formula the same blocker calls missing is HELD in full** (OVERTURNS the second half of BLOCKER ①)

Ledger clause overturned: *"20+ samples show no XP formula either"*.

`reference/decompiled/shs3_android/scripts/NPC.as:166`:

```
      public static function calcXP(playerLevel:int, mobLevel:int, xp:int, elite:Boolean) : *
      {
         if(mobLevel <= getGreyLevel())
         {
            return 0;
         }
         if(mobLevel - playerLevel > 3)
         {
            return 0;
         }
         var finalXP:int = xp;
         if(playerLevel < mobLevel)
         {
            finalXP = xp * (1 + 0.05 * (mobLevel - playerLevel));
         }
         else if(playerLevel > mobLevel)
         {
            finalXP = xp * (1 - (playerLevel - mobLevel) / getZeroDifference());
         }
         if(elite)
         {
            finalXP *= 2;
         }
         return finalXP;
      }
```

Both helper curves are literal too — `NPC.as:95` `getGreyLevel()`:
`playerLevel < 6 → 0`; `< 40 → playerLevel - floor(playerLevel/10) - 5`;
`< 60 → playerLevel - floor(playerLevel/5) - 1`; else `playerLevel - 9`.
`NPC.as:112` `getZeroDifference()` is a 12-branch ladder returning 5,6,7,8,9,11,12,13,14,15,16,17.

Base `xp` for a duelist is `msg.lvl * 5 + 45` (`NetworkManager.as:1268`), matching the repo's
already-landed `XP_PER_LEVEL`/`XP_REWARD_BASE`. Sub-L10 players get `× 3` on duel XP
(`EnemyPlayer.as:1318`); L10+ get the elite `× 2` path (`:1322`). XP buff is `× 1.5`
(`LootDialog.as:640`).

Verdict: **HELD**.

### E-05 — **an entire trade-goods arbitrage economy exists and appears in NONE of the four ledger bullets** (UNDER-CLAIM)

`reference/decompiled/shs3_android/scripts/InteractUI.as:1558`:

```
      internal function getGoodsPrice(index:int) : int
      {
         var price:int = 0;
         var variation:int = 0;
         var rng:RNG = new RNG(StageManager.getCurrentNode() * QueryManager.instance.getServerDate() * index);
```
…base/variation pairs `0:(10,20) 1:(20,30) 2:(100,15) 3:(200,30) 4:(200,30)`…
```
         return price * (100 - variation / 2 + rng.rand(variation)) / 100;
```

Five commodities, buy low / carry / sell high, with prices **deterministically seeded by
`node × serverDate × commodityIndex`** — i.e. fully reproducible offline with the project's
existing mulberry32-style injected RNG, no server needed. `buyGoods` writes stats 20054–20058
(`InteractUI.as:1617`+). Ledger §4 economy names `buy`/`sell` nowhere; its Ready bullet
("two-vendor tiers") does not cover this at all.

Verdict: **HELD** (new system, not in the ledger).

### E-06 — **the crop price rule is HELD and is a supply-driven oscillator, not a static "5–20c" range** (SHARPENS a Ready bullet)

Ledger sentence sharpened: Ready — *"crop 5–20c"*.

`InteractUI.as:105` `internal var cropPrices:Array = [10,10,10,10];`
`InteractUI.as:497`:

```
         this.cropPrices = [10,10,10,10];
         if(maxCrops != leastCrops)
         {
            this.cropPrices[leastCropsSide] = 20;
            this.cropPrices[maxCropsSide] = 5;
         }
```

Base is **10** for all four clans; the clan with the *least* crops in the global tally pays
**20**, the clan with the most pays **5**, and if every clan is level the price is a flat 10 for
all four. "5–20c" is the envelope, not the rule; the rule is a three-point supply signal fed by
`QueryManagerPIO.instance.getAllCrops` (`:220`). Payout is `count × price` in one lump
(`sellCrop`, `InteractUI.as:1544`).

Verdict: **HELD**.

### E-07 — **the full service-price table is HELD, and three of the four "prices" are FORMULAS, not constants** (CORRECTS the Ready bullet + the Surface bullet)

Ledger sentence corrected: Surface — *"Forge 700c (the −70 HUD read is a capture artifact)"*.

All from `reference/decompiled/shs3_android/scripts/InteractUI.as`:

| service | line | cost |
|---|---|---|
| Inn rest | 229 | `NodeGenerator.instance.getNodeLevel(StageManager.getCurrentNode()) * 2` |
| Stables travel | 241 | `NodeGenerator.instance.getNodeLevel(StageManager.getCurrentNode()) * 2` |
| Town toll | 1406 | `NodeGenerator.instance.getNodeLevel(StageManager.getCurrentNode())` |
| Forge weapon | 1003–1008 | `level = getCurrentNodeLevel(); if(level > 80) level = 80; cost = level * 100;` |
| Reinforce weapon | 1083 | `cost = 5000;` (flat) |
| Repair weapon | 1058 | `getCurrentNodeLevel() * 10` (see E-02) |

"Forge 700c" is **not a constant** — it is `level × 100` evaluated at a level-7 node, capped at
level 80 (max 8000c). The ledger banked the sample, not the law. Reinforce additionally consumes
reagent stats 20060–20065 in three level bands (`<30`, `<60`, `60+`, lines 1102–1047).

Verdict: **HELD** (Ready bullet was right in substance, wrong in kind for 4 of 6 rows).

### E-08 — **the premium↔coin exchange rate is HELD: 1 heavenly gold = 1000 coins** (UNDER-CLAIM; partially overturns §6)

Ledger sentence partially overturned: §6 — *"**The dead IAP economy** — design an offline gold
faucet; `HAS_CASH_PURCHASE=false` already commits to this."*

`InteractUI.as:918`:

```
            case "convertgold":
               if(!StatsManager.isCoinPurseFull())
               {
                  StatsManager.spendHeavenlyGold(1,function():*
                  {
                     StatsManager.changeGold(1000);
```

The **consumption** half of the premium economy is fully recoverable: this rate, plus 304
verbatim `<heavenlyprice>` rows in `reference/extracted/itemdata.xml` (index
`docs/gauntlet/L0/index/itemdata.json` → `itemdata/item/heavenlyprice`, count 304, range 0–100).
Only the **acquisition** half (real money → gold tiers) is gone: `Mobile_PremiumData.as:5` shows
`[Embed(source="/_assets/121_Mobile_PremiumData.bin", ...)]` and `find reference -name "*121*"`
returns no such .bin — it was never extracted (`reference/extracted/bindata/` holds 92–98 and
100–119 only). So §6 is **half right**: the IAP *storefront* is dead, the IAP *sink* is not.

Verdict: **PARTIAL**.

### E-09 — **982 items carry verbatim prices in two currencies** (UNDER-CLAIM against the §2 "server-sim economy" gap)

`reference/extracted/itemdata.xml:28`:

```
		<id>2100</id>
		<type>10</type>
		<name>4000</name>
		<baseprice>0</baseprice>
		<heavenlyprice>1</heavenlyprice>
		<weight>0</weight>
		<desc>4172</desc>
```

Index-verified counts (`docs/gauntlet/L0/index/itemdata.json`): **550 `<baseprice>`** rows,
range 0–5000; **304 `<heavenlyprice>`** rows, range 0–100. Consumed at
`XMLItem.as:86` `this.gvalue = xml.baseprice;` and `:96` `this.hvalue = xml.heavenlyprice;`.
The whole shop price list is portable today — with the standing caveat from GAUNTLET §2.1 that
`<name>`/`<desc>` are numeric string-table IDs and the table is still unlocated, so **prices are
portable, item names are not**.

Verdict: **HELD**.

### E-10 — **there are FIVE vendor stock generators, not two** (CORRECTS the Ready bullet "two-vendor tiers")

`reference/decompiled/shs3_android/scripts/XMLShopData.as` defines, with verbatim item-ID lists:
`initPeddlerItems` (:41, npc 104, 7 fixed + 10 of 24 rolled out),
`initInnItems` (:63, npc 148, 7 fixed + 3 of 6 removed),
`initMerchantItems` (:84, npc 52, **empty `defaultItems:Array = []`** — merchant stock is
server-pushed and therefore dead),
`initPremiumItems` (:98, three lists from `QuestEngine.premiumDefaultList/SpecialList/RotationList`,
seeded `serverDate * floor(serverTime/3600)` — an hourly rotation),
`initBarberItems` (:137, 49 cosmetic IDs culled to 16 per visit).

The peddler line, verbatim (`:46–47`):
```
         var defaultItems:Array = [13100,2119,2120,2501,2204,2202,2210];
         var extraItems:Array = [2115,2116,2117,2118,2140,2141,3000,3001,4037,4018,4019,11004,11012,11013,11016,11033,11018,11019,12001,12003,12004,12005,12010,13022];
```

Verdict: **HELD**.

### E-11 — **War-Room structure costs are HELD as payload rows** (upgrades a Ready bullet's evidence class; the Surface bullet still stands)

`reference/decompiled/shs3_android/scripts/WarHexUI.as:1330`:

```
      public function startBuild(buildtarget:int) : *
      {
         var buildcost:int = 500;
```
with per-structure totals `HEX_FORWARDBASE → cost = 10000` (:1338), `HEX_LADDER → 5000` (:1347),
`HEX_DEFENSE → 10000` (:1356), `HEX_TOWN → 10000` (:1365); each donation deducts
`StatsManager.changeStat(StatsManager.STAT_GOLD,-buildcost)` and burns one war move (:1383–1386),
gated on `STAT_WARMOVES > 0`. Move regen is `WARMOVEINTERVAL:int = 60 * 60`
(`StatsManager.as:162`) — one war move per real hour.

The repo config already carries `buildDonationCap: 500` (`src/config/economy.ts:60`), so the 500
is corroborated; the four structure **totals** are new. The Surface bullet *"War-Room structure
coin costs absent from config"* remains **true of the repo** — this is a port task, not a
knowledge gap.

Verdict: **HELD**.

### E-12 — **the token/tournament economy numbers are HELD** (OVERTURNS BLOCKER ④)

Ledger sentence overturned: *"④ token/tournament economy numbers."*

`reference/decompiled/shs3_android/scripts/StatsManager.as`:
- `:166` `internal static var MAXDUELTOKENS:int = 30;`
- `:160` `internal static var DTINTERVAL:int = 2 * 60;` → **one duel token per 120 s**
- `:158` `internal static var APINTERVAL:int = 60;` → one AP per 60 s (this also closes
  world-exploration blocker ④ "AP regen rate + cap")
- `:709–710` `setPlayerStats(STAT_DUELTOKENS,20); setPlayerStats(STAT_MAXDUELTOKENS,20);`
- regen doubles under a buff: `:1135` `if(StatsManager.hasBuff(StatsManager.BUFF_DUELTOKENS)) { diff *= 2; }`
- `ShopUI.as:664` renders `STAT_DUELTOKENS + "/" + StatsManager.MAXDUELTOKENS`.

Note the discrepancy the payload itself carries: the *character-creation* max is 20, the class
constant `MAXDUELTOKENS` is 30 — `changeDT` (`:2373`) clamps to 30, not to the per-character 20.

Verdict: **HELD**.

### E-13 — **the starting wallet is HELD verbatim** (confirms the Ready bullet "currencies + guest start")

`reference/decompiled/shs3_android/scripts/StatsManager.as:705`:

```
         setPlayerStats(STAT_GOLD,100);
         setPlayerStats(STAT_HGOLD,0);
         setPlayerStats(STAT_AP,30);
         setPlayerStats(STAT_MAXAP,30);
         setPlayerStats(STAT_DUELTOKENS,20);
         setPlayerStats(STAT_MAXDUELTOKENS,20);
```

100 coins, 0 heavenly gold, 30/30 AP, 20/20 duel tokens. `src/config/profile.ts:10` notes
"(100 coins / 3 gold)" — the **100 coins is confirmed**; the "3 gold" is **not** in this build,
which starts at `STAT_HGOLD = 0`. Flagging that as a live contradiction for the profile lane.

Verdict: **HELD**.

### E-14 — **the coin purse cap ladder is HELD — and it is the load-bearing sink the ledger never names** (UNDER-CLAIM)

`reference/decompiled/shs3_android/scripts/StatsManager.as:2632`:

```
      internal static function getMaxCoins() : int
      {
         switch(getStat(1011))
         {
            case 0:
               return 1000;
            case 1:
               return 2000;
            case 2:
               return 4000;
            case 3:
               return 6000;
            case 4:
               return 8000;
            case 5:
               return 10000;
            default:
               return 1000;
         }
      }
```

`isCoinPurseFull()` (`:2653`) gates the gold→coin conversion (E-08) and the coin-purse item
purchase (`ShopUI.as:430`). A 1000-coin default cap against a 5000c Reinforce and an 8000c
max-level Forge is the entire shape of the mid-game grind, and it appears in **no** ledger bullet.
The bank (`InteractUI.as:1748` `bankDeposit`) is the escape hatch — and pays **zero interest**;
it is pure overflow storage (`STAT_COINSINBANK`, `:234`).

Verdict: **HELD**.

### E-15 — **the gambling faucet is HELD and is EV-neutral** (grounds the Ready bullet "gold has legit non-cash faucets … betting")

`reference/decompiled/shs3_android/scripts/InteractUI.as:1802` `doChoHan`:

```
         var dice1:int = Math.random() * 6;
         var dice2:int = Math.random() * 6;
         …
         var isEven:Boolean = (dice1 + dice2) % 2 == 0;
         …
         if(isEven && choice == 0 || !isEven && choice == 1)
         {
            StatsManager.changeGold(this.bet * 2);
```

Stake is escrowed on `doBet` (`:1790`, `changeStat(STAT_GOLD,-num)`), and a correct even/odd call
returns `bet × 2`. Two independent `floor(U[0,1)×6)` dice give exactly 50/50 parity, so Cho-Han
is a **zero-expected-value** faucet, not a gold source. The Ready bullet's claim that betting is a
"legit non-cash faucet" is therefore **wrong in expectation** — it is a variance device.

Verdict: **HELD** (and it corrects the Ready bullet).

### E-16 — **quest rewards pay XP and loot, never coins** (closes the income model's last branch)

Index `docs/gauntlet/L0/index/questdata.json`: `questdata/quest/step/reward` ×77, of which
`reward/exp` ×69 (range 100–3000) and `reward/loot` ×19. Verbatim,
`reference/extracted/questdata.xml:214`:

```
    <reward>
      <exp>290</exp>
    </reward>
```

I checked for a coin branch directly: `XMLQuestOutcome.as:56` routes `id == 11`
(`STAT_GOLD`) to `addLootCoins(this.modify)`, so the schema *supports* quest coin rewards — but a
scripted scan of all **386** `<outcome>` blocks in questdata.xml found **0** with `<id>11</id>`.
No quest in the shipped data pays coins. Combined with E-03/E-05/E-06 that makes the coin faucet
set closed and enumerable: kills, chests, crops, trade goods, selling, war, gold conversion.

(Side observation for the quests lane: line 295 of the same file reads
`<text>Nice to meet you, Hiroshi-sama. Please, your assitance would be appreciated.</text>` —
verbatim shipped dialogue, typo and all. §6's *"Verbatim dialogue … the actual script is gone"* is
false on its face. Not my unit; flagging only.)

Verdict: **HELD**.

### E-17 — **prosperity daily-sim: taxonomy HELD, magnitudes STILL UNHELD** (BLOCKER ② stands, but narrower)

`reference/decompiled/shs3_android/scripts/HistoryItem.as:137` `dataToString` enumerates every
daily-sim event the client can render, with its sign:

```
               return "merchants robbed by bandits: prosperity -" + val1;
…
               return getAttackerName(val2) + " attacked town: prosperity -" + val1;
…
               return "mercenaries upkeep cost: prosperity -" + val1;
…
               return "town hired ninja: prosperity -1000";
…
               return "trade with other towns: prosperity +" + val1;
…
               return "town status (prosperity: " + val4 + ", crops: " + val1 + ", goods: " + val2 + ", defense: " + val3 + ")";
```

Every magnitude except the hard-coded **−1000 ninja hire** arrives as `val1` from the server
(`NetworkManager.as:2042 updateTownProsperity`). The client **renders**, it does not **compute**.
So the event set, the four town state variables (prosperity / crops / goods / defense) and one
constant are recoverable; the tick rates and deltas are not.

Verdict: **PARTIAL** — blocker ② survives for prosperity, dies for sell-price (E-01).

### E-18 — real-money IAP price tiers: **STILL UNHELD**

Ledger Ready bullet claims *"IAP tiers"*. I could not ground it. The only payload handle is
`Mobile_PremiumData.as:5` — `[Embed(source="/_assets/121_Mobile_PremiumData.bin", mimeType="application/octet-stream")]`
— and that `.bin` is **not** among the 27 extracted files in `reference/extracted/bindata/`
(92–98, 100–119). `GetGoldPromptDialog.as` contains no price strings; `PayVaultBuy*.as` are
Player.IO wire-message stubs with no tier table. The ledger's "IAP tiers" is presumably
wiki/store-page sourced, which is **not** one of the five admissible artifact classes.

Since `HAS_CASH_PURCHASE = false` (`src/config/economy.ts:66`) this blocks nothing — but the
Ready bullet should be demoted or given a cite.

Verdict: **STILL_UNHELD**.

---

## SCORE

**48 → 78.** Of the four §4 blockers: ① dies twice over (E-03 coins, E-04 XP), ③ dies outright
(E-02), ④ dies (E-12), ② splits — sell-price dies (E-01), prosperity survives narrowed (E-17).
Three of the six Ready-bullet "prices" turn out to be formulas rather than constants (E-07), one
Ready bullet is factually wrong in expectation (E-15, betting is EV-neutral), one is undercounted
(E-10, five vendors not two), and one is uncited (E-18, IAP tiers). Two whole subsystems the
ledger never mentions are fully held: the trade-goods arbitrage loop (E-05) and the coin-purse cap
ladder that gives the economy its shape (E-14).

Not 90+, because of the provenance caveat at the top: these are v0.682 Android rows against a
v0.717 web target, none of them cross-checked against a frame, and the string table that would
name any of these items is still missing.
