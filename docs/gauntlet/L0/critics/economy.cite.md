# CITE-LENS REVIEW — unit: economy

Blind critic. I did not see the surveyor's reasoning. Every verdict below rests on an
artifact I opened myself; the artifact is named in each entry.

**Headline: 18 of 20 claims HOLD, several of them unusually well-cited. Two are REFUTED,
and they are the two the surveyor was proudest of — the "FRAME BEATS PAYLOAD" ×5
redenomination rule and the Writ-of-Release corroboration that rides on it.**

The ×5 rule is not merely unproven; it is contradicted by the web display code, by two
tiles in the surveyor's own cited frame, and by the surveyor's own claim 4. Its prescribed
port rule ("multiply `<heavenlyprice>` by 5") would inject a 5× error into 59 of the 304
priced rows if a lane acted on it.

---

## REFUTED

### R1 — `economy/heavenlyprice-is-5x-deflated` — FATAL

**Claim:** shipped v0.717 gold prices are *exactly 5×* the `<heavenlyprice>` rows.

**What I opened.** I extracted the frame myself:
`ffmpeg -ss 2884 -i reference/videos/Nr4fQstqHDM.mp4` → 1920×1080, then cropped the shop
grid at `crop=740:400:180:250` and `crop=740:400:180:640`, each ×2.6 LANCZOS. The badges
are unambiguous at that magnification.

**Row 1 of the premium grid reads: banknote printed `200` @ **1** gold · green-plus +
blue-plus @ **1** gold · one grey skull @ 5 · two grey skulls @ 10.**

Under "prices are exactly 5× the heavenlyprice rows" **no item can ever cost 1 gold** —
the minimum positive value in the domain is 1, and 5×1 = 5. The surveyor's own quote lists
`1` in the frame price set and then omits it from the claim sentence.

**The web code settles it — there is no multiplier anywhere in the chain:**

- `reference/decompiled/shs3_payload/scripts/§1t104s0§.as:94` (web XMLItem) —
  `this.§1t847s0§.§1t695s0§(param1.heavenlyprice);` — raw store into a protected-int wrapper.
- `reference/decompiled/shs3_payload/scripts/§1t61s0§.as:35` (web XMLShopItem) —
  `this.§1t847s0§.§1t695s0§(_loc2_.§1t854s0§());` — straight pass-through.
- `reference/decompiled/shs3_payload/scripts/§1t394s0§.as` (web ShopItem, located by the
  surviving instance names `coin` / `gold`), function `§1t6868s0§(param1:int, param2:int)`:
  `if(param2 > 0) { this.coin.visible = false; this.gold.visible = true;
  this.§1t6859s0§.text = param2.toString(); }` — **the badge is `hvalue`, printed raw.**
  Byte-for-byte the same logic as `shs3_android/scripts/ShopItem.as:62` `setCost`.

**And the identity of the 1-gold tiles is provable, not guessed:**
`shs3_android/scripts/ShopUI.as:428` gates `itemID == 2208` on `isCoinPurseFull()`, and
`ShopUI.as:482-484` pays it out — `if(this.displayItem.itemID == 2208) {
StatsManager.changeGold(1000); }`. `ShopUI.as:487-489` pays `itemID == 2209` with
`StatsManager.fullHealth()`. Resolved names: **2208 = "1000 coins" / "Buy 1000 coins."
`<heavenlyprice>1</heavenlyprice>`**; **2209 = "Full HP and Chi" / "Instantly replenish
your HP and Chi!" `<heavenlyprice>1</heavenlyprice>`**. The banknote tile is 2208 (web
payout 200, matching `§1t401s0§.as:952`); the green-plus/blue-plus tile is 2209 (green =
HP, blue = Chi). Both carry heavenlyprice 1 and both are filmed at **1 gold**. Ratio 1,
not 5.

**What actually survives, and it is worth banking:** 10, 15 and 60 genuinely do not exist
in the file's domain (`0:1 1:59 2:6 3:191 5:5 8:1 12:39 25:1 100:1`, 304 rows — I
reproduced this tally exactly). So `reference/extracted/itemdata.xml`'s heavenlyprice
column **does not describe the filmed build**. The honest verdict on the transform is
**STILL_UNHELD**, not "×5". See N1/N2/N4 below for the mechanism I think is really at work.

**Consequence if unrefuted:** the lane_impact instructs `<heavenlyprice>` × 5 for a v0.717
target. That would price all **59** heavenlyprice-1 SKUs (2100, 2125, 2128, 2129, 2206,
2208, 2209, 2213, 2215, …) at 5 gold instead of 1.

### R2 — `economy/writ-25g-upheld-by-frame` — MATERIAL

**Claim:** the frame's three 25-gold scroll tiles map one-for-one to the three
heavenlyprice-5 scrolls 2200 / 2203 / 2207, therefore the ledger's "Writ of Release 25g"
is double-confirmed.

**What I opened.** My `grid_bot.png` crop of the same frame: three purple-bordered scroll
tiles at 25 gold (olive/yellow, white, yellow), confirmed. And
`reference/extracted/itemdata.xml:2327-2339` — item 2203, `<heavenlyprice>5</heavenlyprice>`
— which resolves exactly as cited.

**Why it fails.** The mapping is circular: it assumes the ×5 rule (R1) in order to select
which items the tiles are, then offers the match as proof of the ×5 rule. Independent
checks both cut against it:

- Exactly **one** item in the entire file carries heavenlyprice 25 — 2175 "Paradise Gift
  Pack". The frame shows **three** tiles at 25. The file cannot produce three 25s.
- There are at least **nine** scroll-named items (2200, 2201, 2202, 2203, 2204, 2205,
  2206, 2207, 2211) at four different heavenlyprice values. Picking the three that happen
  to share hp=5 is selection on the conclusion.

The Writ may well be 25g from some other source — but this frame does not establish it,
and it is emphatically not "the worked example proving the 5× redenomination rule".

---

## HELD — with corrections worth carrying

### `economy/service-prices-are-formulas` — HELD, two material corrections

The six android cites are **exact**: `InteractUI.as:229` inn `getNodeLevel(currentNode)*2`,
`:241` stables `*2`, `:1406` toll `getNodeLevel(currentNode)`, `:1003-1008` forge
`level = getCurrentNodeLevel(); if(level > 80) level = 80; cost = level * 100;`,
`:1058` repair `*10`, `:1083` reinforce `cost = 5000`. Quoted verbatim, all resolve.

I also opened the frame rather than trusting the ledger:
`reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0040.jpg`, cropped to the lower 45% and
upscaled ×2.2, reads **"FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS
NEEDED: 2 IRON ORE"**. Level 7 × 100 = 700 ✓. Real.

1. **"all line-matched in web `§1t401s0§.as`" is FALSE.** Web `§1t401s0§.as:1003-1008` is
   clan-creation code (`§1t3318s0§.instance.§1t3432s0§(clanId, …)`), not the forge. The web
   inn cost sits at `:232`, not `:229`. Only *repair* happens to land on the same line
   (`:1058` in both). A lane that follows this cite to the web file will read the wrong
   function.
2. **"one filmed town corroborates three of them simultaneously" over-reaches.** Forge 700
   is filmed (frame_0040). Stable 14 is independently attested —
   `docs/research/video-study/segments/B-10-town-investigation-inn-rest-blacksmith.md:23`:
   *"Confirm dialogue: `WOULD YOU LIKE TO RENT A HORSE TO TRAVEL TO A NEIGHBOURING VILLAGE?
   / COST: 14 COINS`"*. **Toll 7 was never filmed** — it is a prediction of the formula, not
   a corroboration of it. Two of three, not three.

### `economy/web-payload-is-decompilable` — HELD, one over-reach

`find … -name '*.as' | wc -l` = **1079**, matching the export log's "Exported script
1079/1079" exactly. `§1t17s0§.as:1977-1988` is precisely `getSellAmt`, and the quoted body
is verbatim. Class map spot-checked and correct.

- Count nit: §-mangled classes are **611** top-level / **667** recursive, not 612.
- Over-reach: *"no lane needs to caveat 'this is the Android build' any more"* is wrong.
  The string table (S0-3), `121_Mobile_PremiumData`, `112_Mobile_NodeData`,
  `114_Mobile_AchievementData` are all Android-only, and **eight of this survey's own
  twenty claims** (13, 14, 16, 17, 18, 19, 20, and the premium blob in 6) rest on
  android-only files. The narrower lane_impact wording — "removable for AS3, diff web vs
  android, cite the web" — is the correct form. Keep that, drop the claim sentence.

### `economy/coins-per-kill-and-xp` — HELD, two nits

Every cite resolves exactly: web `§1t68s0§.as:863/867` = `(1 * _loc8_)` / `(5 * _loc8_)`;
android `NPC.as:839/843` identical; `npcdata.xml:38-44` is verbatim the quoted `<reward>`
block; calcXP branches at web `:196/198/200/202`; helpers `getGreyLevel` at `NPC.as:94` and
`getZeroDifference` at `NPC.as:112`. I reproduced the loot tally independently — **131
`<loot>` blocks across 66 NPCs**, and all eight listed buckets match to the unit
(42/27/19/10/7/6/5/5).

- "rest singletons" is wrong: `(2113,1,0.3)` and `(2112,1,0.3)` each occur **twice**.
- The duelist mechanism `Math.random()×level` is **real but uncited** in the cite field —
  it is `shs3_android/scripts/EnemyPlayer.as:1298`,
  `addLootCoins(Math.random() * level)`. Add it; the claim's "+8 is the top of
  floor(U[0,1)×9)" argument is load-bearing and currently rests on nothing.

### Held clean (cites exact, quotes verbatim, no correction needed)

| claim | what I opened to confirm |
|---|---|
| `premium-exchange-rate-200` | web `§1t401s0§.as:952` = `§1t1523s0§.§1t9619s0§(200);`, literal `"convertgold"` at `:959`; android `InteractUI.as:923` = `changeGold(1000)`. Frame banknote "200" ✓ |
| `iap-tiers-held-both-builds` | web `:136-140` 50/125/200/275/400 · `:325-329` "50…250 KREDS" · `:274-278` 60/150/240/330/480 · `:296-300` 75/188/300/413/600; android `PayUI.as:127-131` 10/25/40/55/75 + `:137-141` 4.99…24.99. All five ranges exact |
| `premiumdata-blob-is-extracted` | 4,504-byte XML; I counted the `<default>` list = **16** SKUs; `<special>` commented out; rotation comments verbatim; Assassin set = 2130, 7034, 4065, 5008, 11036, 12018 exact. Seed at `XMLShopData.as:101-102`, set-pick RNG at `:127-128` |
| `rebirth-payout-config-is-right` | web `:2644` `== 8` → `:2646` 100 / `:2652` 25; android `:2201/2203/2207` → 20 / 5; `src/config/economy.ts:54` REBIRTH earlyGold 25, tenthGold 100 ✓ |
| `guest-start-3-gold-confirmed` | web `:1023-1028` = 100 / 3 / 30 / 30 / 20 / 20; android `:706` HGOLD 0. I walked the whole 21-assignment run — positionally aligned throughout; default args 4017/11017/12017 visible in the web signature |
| `duel-token-cap-40` | **I read the frame**: "40/40" beside a skull in a green diamond, label DUEL TOKENS. Web `:200` = 40 vs android `:166` = 30, and the constant block aligns at a constant +34 offset (android 162/164/166/168 ↔ web 196/198/200/202). `APINTERVAL:int = 60` at `StatsManager.as:158` ✓ so the AP-regen lane impact is right too |
| `sell-price-formula` | **strongest claim in the set.** Web body exact at `1977-1988`; android `Item.as:1582-1592` identical; `ShopUI.as:401` and `:540` exact. I independently grepped the whole android bundle for `sellPercentage`: **exactly one hit**, the declaration at `ShopUI.as:58`. Zero reads confirmed |
| `repair-weapon-cost` | android `:1057-1058`, web `:1058`, guard `:1066` (itemID 0 / 13000), uses-reset at `:1073-1075`. All exact |
| `coin-purse-cap-ladder` | ladder exact in both builds (android `:2632`, web `:2921`); `changeGold` clamp verbatim; `BankUI.as:264` weight formula exact; `InteractUI.as:1748` `bankDeposit` exact. *Nit:* `ShopUI.as:426-435` gates the **2208 coin-pack** purchase, not a "purse-upgrade purchase" |
| `trade-goods-arbitrage-loop` | android `:1558-1586` and web `:1647-1676` both exact, including the divergent seed line the surveyor flagged (`§1t3317s0§.instance.§1t1848s0§() * param1`, two factors). `GameEngine.as:636` tip verbatim. **PARTIAL is the correct verdict** — honest self-limitation, no penalty |
| `crop-price-is-supply-oscillator` | `:105`, `:497-501`, `:220`, `:1544-1548` all exact; quote verbatim |
| `quests-never-pay-coins` | I re-ran the scan: **386** `<outcome>` blocks, **0** carrying `<id>11</id>`, **69** `<reward><exp>` rows over exactly the 10 distinct values listed. `XMLQuestOutcome.as:56-58` verbatim. Daily-prize `addLootCoins(1000)` on the bonus roll confirmed at `InteractUI.as:1220` |
| `war-room-structure-costs` | build-menu strings exact at `:192/197/202/207`; **double-sourced** — `WarHex.as` maxcost: FORWARDBASE 10000 `:424`, TOWN 10000 `:477`, LADDER 5000 `:521`, DEFENSE 10000 `:540`. (Two cites off by one: 478→477, 541→540 — trivial, same block) |
| `cho-han-is-ev-neutral` | dice `:1811-1812`, parity `:1823`, payout `:1832-1834` all exact. **I checked the escrow the claim asserts**: `doBet` is declared at `:1790` and deducts at `:1796` — `StatsManager.changeStat(StatsManager.STAT_GOLD,-num);`. EV = −b + ½·2b = 0 confirmed |
| `prosperity-magnitudes-server-side` | all six `HistoryItem.as` strings verbatim at `:239/283/299/303/307/311`, including the lone constant `"town hired ninja: prosperity -1000"`; `NetworkManager.as:2042` `updateTownProsperity(territoryid, side, num)` exact. PARTIAL is correct |

**Ledger quotes audited.** Every `ledger_text` in the submission is verbatim from
`docs/research/REBUILD_READINESS.md` — line 214 (Ready bullet), 215 (blockers ①–④),
216 (Surface), 352 (dead IAP). No fabricated ledger text. Worth saying explicitly.

---

## NEW FINDINGS (things the surveyor missed)

**N1 — the ×5 model is refuted by the web display chain; the transform is STILL_UNHELD.**
`§1t104s0§.as:94` → `§1t61s0§.as:35` → `§1t394s0§.as` `§1t6868s0§` prints `param2.toString()`.
No multiplication exists. Anything the filmed shop shows that the file cannot produce is a
**data divergence**, not a formula. L3/L10/L11 must label the premium price column
DIVERGENT and re-derive per build — not multiply.

**N2 — the real 5× is on the COIN side, and it is already held.** Item 2208 is the shop's
gold→coin SKU (`ShopUI.as:428` gate, `:482-484` payout `changeGold(1000)`), priced at
heavenlyprice 1. The web pays **200** (`§1t401s0§.as:952`), the android **1000**
(`InteractUI.as:923`). The filmed banknote reads "200" at 1 gold. So v0.717 deflated the
*coins per gold* 5×, at an unchanged 1-gold price — the inverse of what the claim asserts.

**N3 — web and android `itemdata` are LINE-IDENTICAL.** I diffed them (stripping the XML
declaration): **10,546 lines each, zero diff hunks**; the 2-byte length delta is a trailing
newline. So `<baseprice>/<weight>/<modifier>` really do port as-is — but the same fact is
what makes the premium-price divergence a *live-data* problem, not an Android-build problem.

**N4 — direct evidence the filmed build carries content the string table cannot resolve.**
The tooltip at t=48:04 reads **"TRAINING GARMENT … SOUL-INFUSED / THIS ITEM LEVELS UP AS
YOU GAIN XP"** (15 gold, LEVEL 7, DEFENSE +21, EARTH DEF +3, PIERCING DAMAGE +2, MAX CHI
+15, WEIGHT 10). Neither "Training Garment" nor "levels up as you gain" exists anywhere in
`118_Mobile_Lang_EN.bin` (I searched both). The S0-3 caveat is not theoretical — this is a
filmed item the 0.682 table cannot name.

**N5 — the coin-faucet set the survey listed without cites, now cited.**
`EnemyPlayer.as:1298` duelist `Math.random()*level` · `Obj_ChestLoot.as:45`
`Math.random()*lvl` · `Obj_ChestGoodLoot.as:62` and `Obj_DragonDanceLoot.as:331`
`Math.random()*lvl + lvl*5` · `WarUI.as:491` rank-up `newrank * 100` · `WarUI.as:241` flat 5
· `InteractUI.as:1548` crops `count * price`.

---

## Scoring note

82 is too high while R1 stands, because R1 is not a soft claim — it is a stated law with a
prescribed port rule, presented as the unit's flagship "frame beats payload" result, and it
is wrong in the direction that silently corrupts config. Strip R1 and R2 and the remaining
18 are genuinely strong work: exact line numbers, verbatim quotes, honest PARTIAL verdicts
where the evidence ran out, and ledger quotes that all check out. **Suggested: 70–73.**
