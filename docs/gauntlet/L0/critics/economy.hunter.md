# economy — HUNTER LENS review (blind critic, run 3)

Reviewer opened artifacts first-hand. Every verdict below carries its own cite.
No file outside this path was modified.

---

## 0. What I re-derived myself before judging anything

| Check | Command / artifact | Result |
|---|---|---|
| Web decompile exists | `find reference/decompiled/shs3_payload -name "*.as" \| wc -l` | **1079** ✓ |
| §-mangled classes | `ls reference/decompiled/shs3_payload/scripts/ \| grep -c '^§'` | **612** ✓ |
| Frame t=48:04 is real | `ffmpeg -ss 2884 -i reference/videos/Nr4fQstqHDM.mp4 -frames:v 1` | **reproduced, see §1** |
| heavenlyprice domain | `grep -o '<heavenlyprice>[0-9]*' reference/extracted/itemdata.xml \| sort \| uniq -c` | `0:1 1:59 2:6 3:191 5:5 8:1 12:39 25:1 100:1` = **304 rows** ✓ exact match |
| quest coin outcomes | python scan of `reference/extracted/questdata.xml` | **386 `<outcome>`, 0 with `<id>11</id>`, 69 `<exp>` over exactly {100,200,250,290,500,600,750,1000,2000,3000}** ✓ exact match |

The surveyor's counts are honest. I found no fabricated cite anywhere in this unit.
That is worth saying plainly: 19 claims, 19 real artifacts.

---

## 1. THE FRAME — I opened it, it is exactly as described (and it says more)

`ffmpeg -ss 2884 -i reference/videos/Nr4fQstqHDM.mp4 -frames:v 1` → 1920×1080.
Crops: grid top `crop=800:340:180:260 ×2.5 lanczos`; HUD `crop=280:105:1500:130 ×5`.

Visibly in the frame:

- HUD: `COINS 630` · `GOLD 2` · **`40/40` under `DUEL TOKENS`** → **cap 40 CONFIRMED**
- Premium BUY grid, price badges read: **1, 1, 5, 10, 15, 1, 10, 5, 5, 25, 25, 25, 5, 60, 15, 15**
- Tile 1 is a **banknote printed `200`** at **1 gold**

So the surveyor's price set `{1,5,10,15,25,60}` is correct, and the `40/40` read is correct.
**The frame wins and it wins twice.**

---

## 2. THE BIG ONE — I proved the provenance the surveyor assumed

The surveyor wrote, inside `heavenlyprice-is-5x-deflated`:

> "the web and Android itemdata are byte-identical apart from the XML declaration"

**That comparison is void, because there is no web itemdata.** Evidence:

1. `reference/extracted/itemdata.xml` **IS** `reference/extracted/android/111_Mobile_ItemData.bin`
   minus its 40-byte `<?xml …?>` declaration and one trailing CRLF.
   `diff <(tr -d '\r' < a40.xml) <(tr -d '\r' < itemdata.xml)` → **only difference is
   "\ No newline at end of file"**. Same bytes. The surveyor compared a file to itself.
2. The Android build **embeds** it — `reference/decompiled/shs3_android/scripts/Mobile_ItemData.as:5`
   `[Embed(source="/_assets/111_Mobile_ItemData.bin", mimeType="application/octet-stream")]`
3. The **web** build embeds nothing of the kind. It **URL-loads every data XML from the dead
   server**: `reference/decompiled/shs3_payload/scripts/§1t1524s0§.as:334, 357, 388, 420, 453,
   479, 505, 528, 554, 580, 606, 632, 658` are thirteen `URLRequest` loads built from the
   obfuscated string table (cf. Android `QuestEngine.as:312` — `myLoader.load(new
   URLRequest(xmlURL + "itemdata.xml"))`). Only `traproomdata.xml` survives as a literal
   (`§1t1524s0§.as:683`).
4. `find reference -name "*itemdata*"` returns exactly **two** paths, both Android-derived.

**Consequence, and it is the most important line in this review:**
`itemdata.xml`, `npcdata.xml`, `questdata.xml`, `skilldata.xml` are **100% Android v0.682 artifacts**.
The web v0.717 data XMLs were server-side and are **gone**. The S0-3 caveat does **not** lift for data —
it lifts for **AS3 only**. Claim `web-payload-is-decompilable`'s sentence
*"no lane needs to caveat 'this is the Android build' any more"* is **wrong as written** and would
mislead L1 (quests), L2 (skills), L3 (items) and L4 (npcs) — the four lanes that live on those files.

---

## 3. "exactly 5×" — refuted by the surveyor's own frame

The 5× **gold redenomination is real** and I strengthened it three ways the surveyor did not have:

| Quantity | Android (v0.682) | Web (v0.717) | ratio |
|---|---|---|---|
| rebirth payout | `changeStat(STAT_HGOLD,5)` `StatsManager.as:2207` | `§1t9713s0§(§1t9413s0§,25)` `§1t1523s0§.as:2651` | 5× |
| ninth rebirth | 20 `:2203` | 100 `:2646` | 5× |
| `convertgold` payout | `changeGold(1000)` `InteractUI.as:923` | `§1t1523s0§.§1t9619s0§(200)` `§1t401s0§.as:952` | 1/5 |
| IAP tiers 1–4 | 10 / 25 / 40 / 55 `PayUI.as:127-130` | 50 / 125 / 200 / 275 `§1t410s0§.as:136-139` | 5× |
| item 2208 name | **"1000 coins"** (`resolved_names.json`) | banknote reads **"200"** (frame) | 1/5 |

**But "exactly 5×" is false**, and the counter-evidence is in artifacts the surveyor already held:

- **IAP tier 5**: Android `75` (`PayUI.as:131`) → Web `400` (`§1t410s0§.as:140`). 75×5 = **375 ≠ 400**.
- **Legendary-merchant premium price**, same function, same slot:
  Android `XMLShopItem.as:102` `this.hvalue = 2;` vs
  Web `§1t61s0§.as:100` `this.§1t847s0§.§1t695s0§(5);` → **2.5×, not 5×**.
- **The cited frame itself carries three `1`-gold badges.** 1 ÷ 5 = 0.2, which is not in the
  `heavenlyprice` domain at all. The surveyor listed only "60, 25, 15, 10 and 5" and omitted the 1s —
  the omission is what lets "exactly" stand.
- Both builds read `heavenlyprice` **raw, with no multiplier**: `XMLItem.as:96` `this.hvalue =
  xml.heavenlyprice;` ≡ `§1t104s0§.as:94`; and `ShopUI.as:421` `if(this.displayItem.getHCost() <
  itemData.hvalue) reportHack("shop buy")` proves **displayed price == hvalue**. So there is no
  runtime ×5 anywhere — the difference lived in the **server's** itemdata.xml, which we do not have.

**Therefore the lane_impact instruction "`<heavenlyprice>` must be MULTIPLIED BY 5 for a v0.717
target" is unsafe.** It would price item 2208 (the coin pack) and 2209 (Full HP and Chi) at 5 gold
where the film shows 1. The correct porting rule is: **the itemdata we hold is Android-denominated;
gold prices for a v0.717 target must be re-derived per SKU, with the film as arbiter, and every
un-filmed SKU labelled INFERRED.**

What *does* survive intact, and is the claim's real value: **FRAME BEATS PAYLOAD — the shipped
v0.717 gold prices are not the rows in `itemdata.xml`, and 10/15/60 do not exist in that file.**

---

## 4. Sell price — the formula holds, the "byte-for-byte identical" does not

`getSellAmt` body is structurally identical in both builds (`§1t17s0§.as:1977-1988` ≡ `Item.as:1581-1592`) ✓.
But it branches on `getWeight() >= 10`, and **`getWeight` diverges**:

```
ANDROID  Item.as:1565-1580     return this.weight * this.getQuantity();   … else  return this.weight;
WEB      §1t17s0§.as:1958-1975 return (this.weight + this.§1t478s0§) * this.§1t484s0§();   (both branches)
```

`§1t478s0§` (`§1t17s0§.as:60`) is an int serialised into the item string as `"@N#"`
(`:298-300`, `:360-362`) — a per-item added weight the Android build does not apply. It also fixes
an Android bug (the uncached branch there forgets `* qty`). **Ten is exactly the threshold where the
sell multiplier doubles (×10 vs ×5)**, so the two builds can price the same item differently.
Port the **web** `getWeight`, not the Android one.

---

## 5. HUNTER LENS — things the surveyor under-claimed, now held

### 5.1 The trade-goods PARTIAL is resolvable. I resolved it.
The surveyor wrote *"I did NOT resolve which is authoritative."* It is resolvable from the web bundle:

- `§1t3317s0§` = **QueryManager** — proven by `§1t401s0§.as:1641`
  `§1t3317s0§.instance.§1t1955s0§(50000 + param1,_loc3_)` ≡ Android `InteractUI.as:1552`
  `QueryManager.instance.updateGlobalVar(50000 + house,count)`.
- `§1t1848s0§` = **getServerDate**, `§1t1847s0§` = **getServerTime** — proven twice:
  `§1t7216s0§.as:256` `§1t1848s0§() * Math.floor(§1t1847s0§() / (60 * 60))` ≡ Android
  `XMLShopData.as:102` `setRNGSeed(seed * Math.floor(getServerTime() / (60*60)))` where
  `seed = getServerDate()`; and `§1t401s0§.as:796` `§1t58s0§.§1t8804s0§(§1t1525s0§.§1t9935s0§()
  * §1t3317s0§.instance.§1t1848s0§())` ≡ Android `RNG(getCurrentNode() * getServerDate())`.

**Answer:** web v0.717 `§1t401s0§.as:1676` seeds goods price with **`getServerDate() * index`** —
the `getCurrentNode()` factor present in Android `InteractUI.as:1562` is **dropped**. Same at the
display path `§1t401s0§.as:1706`. Web also uses a *static* `§1t58s0§.random(variation, seed)`
instead of `new RNG(...)`.

**Design consequence L9/L10:** in v0.717 **every town shows the same commodity price on a given
day** — the buy-low-here/sell-high-there arbitrage the tutorial tip advertises
(`GameEngine.as:636`) only works **across days**, not across towns. That is a real gameplay
difference and it must be a labelled decision in the rebuild, not an accident.

### 5.2 Cho-Han is EV-**negative**, not EV-neutral
Dice are fair (`InteractUI.as:1811-1812`, two independent `int(Math.random()*6)` → P(even) = 0.5 exactly ✓).
But the two sides of the wager use **different functions**:

- stake: `doBet` `:1796` `StatsManager.changeStat(StatsManager.STAT_GOLD,-num)` — **uncapped**
- payout: `doChoHan` `:1834` `StatsManager.changeGold(this.bet * 2)` — and `changeGold`
  (`StatsManager.as:2658-2667`) **clamps to `getMaxCoins()` and silently discards the overflow**.

With the default purse cap of **1000** (`StatsManager.as:2637`), any bet whose doubled return would
cross the cap is a **guaranteed partial loss**. The surveyor's conclusion (*"betting must not be
modelled as a gold source"*) gets stronger; the stated reason (*"zero-expected-value"*) is wrong.

### 5.3 The "closed faucet set" is missing its biggest per-event payer
`grep -rn "addLootCoins" reference/decompiled/shs3_android/scripts/` returns a payer the survey
lists only as the bare word "chests":

```
Obj_ChestGoodLoot.as:62     addLootCoins(Math.random() * this.lvl + this.lvl * 5);
Obj_DragonDanceLoot.as:331  addLootCoins(Math.random() * this.lvl + this.lvl * 5);
```

That is `lvl*5 … lvl*6` per open — at node level 40 that is **200–240 coins in one interaction**,
against a commonest-mob expectation of **0.5 coins/kill**. Any offline faucet budget built from the
mob number alone will be off by two orders of magnitude. Also present and unlisted:
`NetworkManager.as:1264` and `:2814` `addLootCoins(Math.random() * lvl)`, and
`WarUI.as:241` `addLootCoins(5)`.

### 5.4 calcXP has two hard zero cut-offs the survey did not quote
`NPC.as:166-190` — the survey quoted only the two scaling branches. The gates matter more:

```
if(mobLevel <= getGreyLevel())      return 0;   // NPC.as:168
if(mobLevel - playerLevel > 3)      return 0;   // NPC.as:172
…
if(elite) finalXP *= 2;                          // NPC.as:187
```

`getGreyLevel()` (`:94-110`) is a three-band step function and `getZeroDifference()` (`:112-164`) an
eleven-band table. **The XP model is complete and portable today** — grey-out floor, +3 over-level
ceiling, elite doubler included. This is a bigger kill on blocker ① than the survey claims.

### 5.5 Quests DO move prosperity
`HistoryItem.as:373` — `"Players changed prosperity through quests by " + val1` — a seventh
prosperity event the survey's taxonomy omits, and the only one with a **player-side** lever.

---

## 6. Small corrections, not refutations

- `prosperity-magnitudes-server-side` cites `NetworkManager.as:2042 (updateTownProsperity)` as where
  "values are sourced". I opened it: it is a **client→server send**
  (`connectionGlobalPIO.send(...)`, `:2050`). The PARTIAL verdict is still right — magnitudes arrive
  in server history messages that `HistoryItem` merely renders — but the direction is backwards.
  5-tier ladder at `DungeonGenerator.as:1363-1555` ✓ verified (`prosperity` 1–5, `:1429-1502`).
- `coin-purse-cap-ladder` says `ShopUI.as:426-435` gates "the purse-upgrade purchase". I opened it:
  `:428` `if(this.displayItem.itemID == 2208)` — it gates the **coin-pack SKU**, not a purse upgrade.
  Everything else in that claim verified verbatim, both builds.
- `writ-25g-upheld-by-frame`: the frame shows three 25-gold **scroll-icon** tiles but **no names**.
  The identification with 2200/2203/2207 is an inference — a good one (those are the only three
  scroll SKUs in `121_Mobile_PremiumData.bin`'s `<default>`, all `heavenlyprice 5`, and
  `ShopUI.as:421` proves displayed price == hvalue) — but it is an inference, not a read.
- `sell-price-formula`'s dead-code flag is **correct**: `grep -n sellPercentage
  reference/decompiled/shs3_android/scripts/*.as` → exactly one hit, `ShopUI.as:58`. Zero reads.

---

## 7. Verified verbatim, no notes

`premium-exchange-rate-200` · `iap-tiers-held-both-builds` · `premiumdata-blob-is-extracted` ·
`rebirth-payout-config-is-right` · `guest-start-3-gold-confirmed` · `duel-token-cap-40` ·
`repair-weapon-cost` · `coins-per-kill-and-xp` · `service-prices-are-formulas` ·
`crop-price-is-supply-oscillator` · `quests-never-pay-coins` · `war-room-structure-costs`

Repo-side assertions also checked and true: `src/config/economy.ts:37` `KILL_REWARD = { coinsFlat: 8 }`
with the docblock "COINS have NO source formula found"; `:54` `REBIRTH = { earlyGold: 25,
tenthGold: 100, … }`; `:60` `buildDonationCap: 500`; `MAX_DAN_RANK = 10`;
`src/config/profile.ts:10` "(100 coins / 3 gold) are deliberately NOT seeded here".
Ledger quotes checked against `docs/research/REBUILD_READINESS.md:213-216` and `:352` — all real.

---

## 8. Score

The surveyor asked for **82**. On my reading the *evidence* justifies it; the *framing* does not yet.
Two of the four headline framings need a correction before any lane consumes them:
the Android-provenance lift is **AS3-only**, and the ×5 is a **direction, not a multiplier**.
With those two edits I would sign 82. Without them, **76** — because the ×5 porting rule as written
injects errors into L3/L10/L11, which is exactly the class of mistake this gauntlet exists to catch.
