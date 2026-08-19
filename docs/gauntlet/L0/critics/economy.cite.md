# CITE-LENS REVIEW — unit: economy (run 3)

Blind critic. I did not see the surveyor's reasoning. I opened every cited artifact
myself. Every verdict below carries an artifact **I** opened.

Reproduction environment for frame work:
```
ffmpeg -y -ss 2884 -i reference/videos/Nr4fQstqHDM.mp4 -frames:v 1 f2884_full.png
ffmpeg -y -i f2884_full.png -vf "crop=W:H:X:Y,scale=iw*N:ih*N:flags=lanczos" crop.png
```

---

## HEADLINE

**19 claims audited. 15 survive. 4 fall — one of them FATALLY.**

| # | claim | verdict |
|---|---|---|
| 16 | `quests-never-pay-coins` | **REFUTED — FATAL** |
| 2 | `heavenlyprice-is-5x-deflated` | **REFUTED — material** |
| 19 | `prosperity-magnitudes-server-side` | **REFUTED — material** |
| 3 | `writ-25g-upheld-by-frame` | **REFUTED — minor** (conclusion survives, mechanism does not) |
| 1 | `web-payload-is-decompilable` | **REFUTED — minor** (inventory verified; the "no lane needs to caveat" rider is false) |
| 4,5,6,7,8,9,10,11,12,13,14,15,17,18 | — | **HELD** |

Citation quality across the unit is unusually high: I line-checked ~40 file:line
cites and all but two resolved to the exact line claimed. The failures below are
failures of **inference**, not of transcription — except claim 16, which searched
the wrong XML element and then generalised from the absence.

---

## FATAL — claim 16 `economy/quests-never-pay-coins`

> "No shipped quest pays coins: the schema supports it but a scan of all 386
> `<outcome>` blocks in questdata.xml found zero carrying `<id>11</id>` … so the
> coin faucet set is closed and enumerable."

**The frame wins, and it is not close.**

**A1 (mine).** `reference/frames/zFtCaTO0_1M/seg-29/frames/frame_0013.jpg`,
crop `(480,335)-(770,465)` upscaled ×5 LANCZOS. Reads verbatim, four lines:

```
REWARD
250 XP
30 COINS
TOWN PROSPERITY: +5
```

**A2 (mine), on disk, static XML.** `reference/extracted/questdata.xml:4164-4168`:

```xml
<reward>
  <exp>750</exp>
  <loot>
    <id>0</id>
    <qty>30</qty>
```

Loot id 0 is coins (`1 * qty`) — the surveyor's own claim 12 establishes exactly
that. So a shipped quest pays 30 coins, and the frame shows a quest paying 30 coins.

**A2 (mine), the mechanism, in BOTH builds.** Quest coin pay lives in
`<reward><loot>`, not `<outcome><id>11</id>`:

- `reference/decompiled/shs3_android/scripts/QuestLogUI.as:455-461`
  ```as
  else if(lootType == 0 || lootType == 11) { coinReward += qty; }
  else if(lootType == 1)                   { coinReward += 5 * qty; }
  ```

**A2 (mine), and this is the part that makes the conclusion backwards.** The great
majority of quests are **generated at runtime as XML strings**, so they can never
appear in the static `questdata.xml` the surveyor scanned:

- Android `QuestGenerator.as:844` — `var questCoinReward:int = nodelvl * 5;`
- Android `QuestGenerator.as:1006` — bounty variant, `nodelvl * 10`
- Android `QuestGenerator.as:917` — `rewardStr += "<loot><id>0</id><qty>" + questCoinReward + "</qty></loot>";`
  … and at `:1092, :1292, :1319, :1533, :1559, :1708, :1734, :1903, :1929, :2154, :2180, :2315` (15+ sites)
- Android `QuestGenerator.as:876` — `introStr += "<outcome><id>11</id><modify>" + questCoinReward + "</modify>…"`
  — **generated quests emit the very `<outcome><id>11</id>` the surveyor searched for.**
- WEB build, same code: `reference/decompiled/shs3_payload/scripts/§1t123s0§.as:883`
  — `var _loc17_:int = _loc15_ * 5;` and `:955` —
  `_loc25_ = _loc25_ + ("<loot><id>" + 0 + "</id><qty>" + _loc17_ + "</qty></loot>");`
  (also `:1138, :1348, :1375, :1591, :1617, :1768, :1794`)

**Arithmetic closes it.** `questCoinReward = nodeLevel × 5`. The filmed reward is
30 coins → a level-6 node. Video B's town is a level-7 node
(`docs/research/video-study/segments/B-10-town-investigation-inn-rest-blacksmith.md:22`,
"COST: 700 COINS" = 7 × 100), and the second filmed quest reward the run-2 critic
recorded reads 35 COINS = 7 × 5. The formula predicts both.

**Consequence.** The claim's lane_impact — "quest rewards are exp + loot only" and
"faucet set closes to: mob loot rolls, duelist kills, chests, crops, trade goods,
item sales, war rank-ups, daily prize, gold conversion" — omits the **largest
repeatable early-game coin faucet in the game**. Against a mob EV of 0.5 coins/kill
(claim 12, which I verified), one level-7 quest = 35 coins = **70 mob kills**. An
offline economy built on the surveyor's faucet list would be starved by roughly two
orders of magnitude.

**Replacement law, held in both builds, ready to port:**
```
questCoinReward = nodeLevel * 5      // bounty quests: nodeLevel * 10
```

---

## MATERIAL — claim 2 `economy/heavenlyprice-is-5x-deflated`

> "the shipped v0.717 gold prices are **exactly 5×** the `<heavenlyprice>` rows in
> reference/extracted/itemdata.xml"
> lane_impact: "`<heavenlyprice>` must be **MULTIPLIED BY 5** for a v0.717 target"

The surveyor's tally is **exact** — I re-derived it independently:
`heavenlyprice` = `{0:1, 1:59, 2:6, 3:191, 5:5, 8:1, 12:39, 25:1, 100:1}`, 304 rows,
982 `<item>`. And 10, 15, 60 genuinely do not occur. That half stands.

The **rule** does not.

**1 — The claim's own frame breaks it.** I extracted `Nr4fQstqHDM.mp4 t=2884s`
myself and cropped `(190,270)-(560,450)` ×4: a grey banknote printed **200**, badge
**1** beside a gold coin; and the tile beside it (green + blue plus signs) also badge
**1**. Under a uniform ×5 those tiles need `heavenlyprice = 0.2`. `hvalue` is an
`int` (`XMLItem.as:16 — public var hvalue:int;`). No such row can exist.

**2 — Two rows with IDENTICAL heavenlyprice show DIFFERENT badges in the same grid.**
Resolving names off `docs/gauntlet/L0/index/resolved_names.json`:

| id | name | heavenlyprice | badge in frame |
|---|---|---|---|
| 2208 | **1000 coins** ("Buy 1000 coins.") | **1** | **1** |
| 2125 | **10 Duel Tokens** | **1** | **5** |
| 2128 | **Present** | **1** | **5** |

The banknote tile is item 2208: it is the coin-purchase SKU, special-cased by id in
**both** builds' shop (`ShopUI.as:428 — if(this.displayItem.itemID == 2208)` gating
`isCoinPurseFull()`; web `§1t6519s0§.as:387 — if(…itemID == 2208 || …== 2209)`), its
name is literally "1000 coins", and the web build's `convertgold` pays exactly 200
(`§1t401s0§.as:952`) — which is the number printed on the note. **No single
multiplier maps 1 → 1 and 1 → 5 simultaneously.**

**3 — There is no ×5 anywhere in the price path, in either build.** I traced it end
to end:

| stage | Android | Web |
|---|---|---|
| parse | `XMLItem.as:94-96` — `this.hvalue = xml.heavenlyprice;` | `§1t104s0§.as:92-94` — `this.§1t847s0§.§1t695s0§(param1.heavenlyprice);` |
| shop item | `XMLShopItem.as:37,123` — `this.hvalue = itemData.hvalue;` | `§1t61s0§.as` — same, `_loc2_.§1t854s0§()` |
| render | `ShopUI.as:393` — `slot.setCost(…value, …hvalue)` | `§1t6519s0§.as:466` — `_loc4_.§1t6868s0§(…§1t761s0§(), …§1t854s0§())` |
| store | `ShopItem.as:62-65` — `this.hcost = hamt;` | — |

Pass-through, unmodified, both builds. A 5 → 25 gap **cannot** come from code.

**4 — And the two data files are the same file.** I byte-diffed them:

```
reference/extracted/itemdata.xml                       184002 bytes, starts "<itemdata>"
reference/extracted/android/111_Mobile_ItemData.bin    184044 bytes, starts "<?xml …?>\r\n<itemdata>"
identical from <itemdata> onward:  True
```

So the on-disk file is **not** a web-denominated artifact that got scaled; it is the
same bytes both builds' repos carry.

**What is actually true (and is a better finding).** The **cash tier** was
redenominated ~5× — I verified both tables:

| KREDS / USD | web gold (`§1t410s0§.as:136-140`) | android gold (`PayUI.as:127-131`) | ratio |
|---|---|---|---|
| 50 KREDS / $4.99 | 50 | 10 | 5.00 |
| 100 / $9.99 | 125 | 25 | 5.00 |
| 150 / $14.99 | 200 | 40 | 5.00 |
| 200 / $19.99 | 275 | 55 | 5.00 |
| 250 / $24.99 | **400** | **75** | **5.33** |

and the coin sink moved the opposite way (web 200 coins/gold vs android 1000 —
claim 4, which I confirmed). So a redenomination is real, it is **not exactly 5×**
even at the cash tier, and the **shipped web `itemdata` is simply not the file on
disk**. The correct L3/L10/L11 instruction is *"heavenlyprice on disk is
Android-denominated and cannot be scaled to v0.717 by a constant — treat premium
prices as UNHELD except where a frame reads them"*, not *"multiply by 5"*.

---

## MATERIAL — claim 19 `economy/prosperity-magnitudes-server-side`

The taxonomy is **exact** — I opened `HistoryItem.as` and every quoted string sits
at the line implied (`:239, :283, :299, :303, :307, :311`), `dataToString` starts at
`:137`, `NetworkManager.as:2042` is `updateTownProsperity`, and the 5-tier ladder is
consumed at `DungeonGenerator.as:1363`/`:1555`. That much holds.

What fails is the negative universal: **"every magnitude arrives from the dead
server"** and **"Only the −1000 ninja hire is a recoverable constant."**

**A1 (mine).** The same frame that kills claim 16 —
`reference/frames/zFtCaTO0_1M/seg-29/frames/frame_0013.jpg`, crop
`(480,335)-(770,465)` ×5 — reads **"TOWN PROSPERITY: +5"** on a quest-completion
panel.

**A2 (mine), both builds, hard-coded literal:**
- Android `QuestGenerator.as:846` — `var prosperityReward:int = 10;`
- Android `QuestGenerator.as:850` — `prosperityReward = 5;`
- Android `QuestGenerator.as:921` — `rewardStr += "<loot><id>50007</id><qty>" + prosperityReward + "</qty></loot>";`
- Android `QuestGenerator.as:1094, 1293, 1320, 1534, 1560, 1709, 1735, 1904, 1930, 2155, 2181, 2316` — `"<loot><id>50007</id><qty>5</qty></loot>"` (literal 5)
- WEB `§1t123s0§.as:885` — `var _loc19_:int = 10;` / `:889` — `_loc19_ = 5;` /
  `:959` — `_loc25_ += "<loot><id>" + 50007 + "</id><qty>" + _loc19_ + "</qty></loot>";` /
  `:1140, :1349` — literal `5`
- Consumed client-side: `Overworld.as:357-359` — `else if(lootType == 50007) { StatsManager.changeStat(50007,qty); }`

So the **player-driven** prosperity channel is fully held, client-side, in both
builds, at +5 (+10 on the non-halved branch), and one value is confirmed on film.
`HistoryItem.as:373` even names the channel: *"Players changed prosperity through
quests by " + val1*.

The **daily-sim** magnitudes (bandit raids, merchant trade, mercenary upkeep, town
attacks) do remain server-side — that part of the PARTIAL is correct. But "only the
−1000 ninja hire is recoverable" is wrong and would make the rebuild author a number
that is already in hand.

---

## MINOR — claim 3 `economy/writ-25g-upheld-by-frame`

**Conclusion right, mechanism wrong.** I confirmed the frame myself: crop
`(390,650)-(940,840)` ×3 of `Nr4fQstqHDM.mp4 t=2884s` shows three purple-bordered
scroll tiles each badged **25** beside a gold coin, and 2200/2203/2207 (Amnesia
Scroll / Writ of Release / Name Change Scroll) are the only three scroll items in the
premium default list, all at `heavenlyprice 5`. The Writ *is* 25g on film, and the
instruction "do NOT correct the ledger down to 5" is correct.

But the stated reason — **"the 5 is the Android denomination"** — cannot be true. It
requires the two builds' `itemdata` to differ; they are byte-identical (proof above).
The 5 is what is on disk for *both*. This is an inference dressed as a citation, and
the claim explicitly offers itself as "the worked example proving the 5×
redenomination rule" — a rule that does not survive claim 2's audit. Keep the 25g.
Discard the explanation.

---

## MINOR — claim 1 `economy/web-payload-is-decompilable`

Inventory **verified exactly**:
```
find reference/decompiled/shs3_payload -name "*.as" | wc -l   → 1079
ls reference/decompiled/shs3_payload/scripts/ | grep -c '§'    → 612
```
and the whole class map checks out: `§1t17s0§`=Item (getSellAmt at `:1977-1988`),
`§1t401s0§`=InteractUI, `§1t410s0§`=PayUI, `§1t1523s0§`=StatsManager,
`§1t68s0§`=NPC, `§1t104s0§`=XMLItem, `§1t61s0§`=XMLShopItem, plus
`§1t6519s0§`=ShopUI and `§1t123s0§`=QuestGenerator which I resolved myself. This is
a genuinely valuable finding and the lane_impact's *"removable for AS3"* is the right
scope.

The claim **text** overshoots it: *"so no lane needs to caveat 'this is the Android
build' any more."* That is false, and this unit's own findings prove it:

- Every resolved **name** comes from `118_Mobile_Lang_EN.bin`, which is Android-only
  (§0 S0-3). `resolved_names.json` is Android provenance, full stop.
- Web and Android **disagree on gold numbers** in five of this unit's own claims:
  convertgold 200 vs 1000, rebirth 25/100 vs 5/20, guest HGOLD 3 vs 0, MAXDUELTOKENS
  40 vs 30, PayUI 50/125/200/275/400 vs 10/25/40/55/75.

The caveat is *more* necessary now, not less — it just moved from "all AS3" to "all
strings and all currency magnitudes". Keep the inventory; drop the rider.

---

## HELD — the fourteen that survived, with what I checked

| claim | what I opened | result |
|---|---|---|
| 4 `premium-exchange-rate-200` | `§1t401s0§.as:952` = `§1t9619s0§(200)`, literal `"convertgold"` at `:959`; `InteractUI.as:923` = `changeGold(1000)`; and I resolved `§1t9619s0§`→changeGold via the `getMaxCoins`/`isCoinPurseFull`/`changeGold` triple at `§1t1523s0§.as:2921/2941/2946` vs `StatsManager.as:2632/2652/2657` | **exact** |
| 5 `iap-tiers-held-both-builds` | all five ranges line-checked: `§1t410s0§.as:136-140`, `:274-278`, `:296-300`, `:325-329`; `PayUI.as:127-131` + `:137-141` | **exact, all four ladders** |
| 6 `premiumdata-blob-is-extracted` | `121_Mobile_PremiumData.bin`, 4,504 bytes; 16 `<default>` ids in the stated order; commented-out `<special>`; Assassin set = 2130/7034/4065/5008/11036/12018; `XMLShopData.as:101-102` = `setRNGSeed(serverDate * floor(serverTime/3600))` | **exact** |
| 7 `rebirth-payout-config-is-right` | `§1t1523s0§.as:2644-2656` (100 on DAN==8 else 25, DAN increments while <9) vs `StatsManager.as:2200-2208` (20/5); `src/config/economy.ts:54` REBIRTH `{earlyGold:25, tenthGold:100}` | **exact** |
| 8 `guest-start-3-gold-confirmed` | `§1t1523s0§.as:1007` initNewPlayer, wallet block `:1023-1028` = 100/3/30/30/20/20; `StatsManager.as:705-706` = 100/**0**; `src/config/profile.ts:16` pools {10,10,30} | **exact, line for line** |
| 9 `sell-price-formula` | `§1t17s0§.as:1977-1988`; `Item.as:1582-1592`; `ShopUI.as:401` (`getSellAmt()`), `:540` (`changeGold(getCost())`); `sellPercentage` grep → **1 hit, `ShopUI.as:58`, zero reads** | **held** — one nit: "byte-for-byte identical" is loose, the web copy is identifier-mangled; call it structurally identical |
| 10 `repair-weapon-cost` | `InteractUI.as:1057-1058` and web `§1t401s0§.as:1058` — same line number in both; `:1066` id-0/13000 refusal; `:1073` `if(weapon.uses > 1)` | **exact** |
| 11 `service-prices-are-formulas` | inn `:229` ×2, stables `:241` ×2, forge `:1003-1008` min(lvl,80)×100, toll `:1406` ×1, reinforce `:1083` flat 5000; B-10 cite resolves to `docs/research/video-study/segments/B-10-…md:22` with the exact quoted dialogue | **exact** — two nits: reinforce reagents are stats **20064/20065/20066** (`:1104,:1114,:1124`, spent at `:1110,:1120,:1130`), not "20060-20065"; and it is five formulas of six, not four |
| 12 `coins-per-kill-and-xp` | `§1t68s0§.as:861-867` + `:196-202`; `NPC.as:837-843` + `:166-190`; `getGreyLevel` `:94`, `getZeroDifference` `:112`; `npcdata.xml:38-44`; **I re-tallied all 131 `<loot>` blocks over 66 NPCs and every one of the surveyor's eight counts matched to the row**; `NPC.as:806` shows `chance` is rolled once per row and `qty` is the coin count, so the 0.5 EV is right; `src/config/economy.ts:37` + docblock `:32` | **exact** — one nit: the duelist half (`Math.random() * level`) lives at `EnemyPlayer.as:1298`, which is missing from the cite field; I verified it |
| 13 `trade-goods-arbitrage-loop` | `InteractUI.as:1558-1586` and `§1t401s0§.as:1647-1676`; price/variation table identical; return expression identical; `GameEngine.as:636` tip verbatim; seed divergence real (android 3 factors, web `§1t3317s0§.instance.§1t1848s0§() * param1`) | **exact — and the PARTIAL is honest**, the surveyor flagged the one thing it could not resolve |
| 14 `coin-purse-cap-ladder` | `StatsManager.as:2632-2666` ladder + changeGold clamp; web `§1t1523s0§.as:2921-2939` ladder; `ShopUI.as:426-435`; `InteractUI.as:1748` bankDeposit; `BankUI.as:264` storage weight | **held** — nit: the web cite `2921-2940` stops *before* changeGold, which is at `§1t1523s0§.as:2946-2957` (I read it; the clamp is there, plus a floor-at-zero branch the Android copy lacks) |
| 15 `crop-price-is-supply-oscillator` | `InteractUI.as:105`, `:497-501`, `:1544-1548`, `:220` | **exact, all four** |
| 17 `war-room-structure-costs` | `WarHexUIBuildMenu.as:192/197/202/207` = 10000/5000/10000/10000 under the four HEX_ cases; `WarHexUI.as:1332` `buildcost = 500`; `StatsManager.as:162` WARMOVEINTERVAL 60*60; `src/config/economy.ts:60` buildDonationCap 500 | **exact** |
| 18 `cho-han-is-ev-neutral` | `InteractUI.as:1790` doBet escrow, `:1802` doChoHan, `:1811-1812` two `Math.random()*6`, `:1823` parity, `:1832-1834` `changeGold(bet*2)` | **exact**, and the EV arithmetic is right: each die is uniform over {0..5}, 3 even / 3 odd, so P(parity)=½ and EV = ½·2b − b = 0 |

Two of the token-economy corroborations deserve their own line because I checked
them against film:

- **Claim 8's `40/40`.** My crop `(1500,130)-(1780,235)` ×5 of `t=2884s` shows a
  skull in a green diamond, a bordered field reading **40/40**, label **DUEL
  TOKENS**. The constant blocks align slot for slot exactly as claimed
  (`StatsManager.as:158-168` APINTERVAL 60 / DTINTERVAL 2*60 / WARMOVEINTERVAL 60*60
  / MAXQUESTS 7 / **MAXDUELTOKENS 30** / MAJORCUSTOMCLANTHRESHHOLD 40, against web
  `§1t1523s0§.as:194-202` … 2*60 / 60*60 / 7 / **40** / 40). Frame and web payload
  agree against Android. This is the model finding of the unit.
- **Claim 16's daily-prize table**, quoted in lane_impact, is right where the claim
  itself is wrong: `InteractUI.as:1247` `dice = Math.random() * 36`, `:1248` `if(dice
  <= 4)` → `:1250` 100c, `:1252` ==5 → `:1254` 200c, `:1256` ==6 → `:1258` 300c,
  items from 7; and the 10th-streak branch `:1217` `Math.random() * 6` → `:1220`
  1000c on a 0.

---

## SCORE

The surveyor's **82** is too high. Blocker ① is genuinely dead and the token,
repair, sell-price and service-formula work is first-rate, exactly-cited evidence.
But the unit **closed the coin faucet set while omitting the largest faucet**, and
shipped a port instruction ("multiply heavenlyprice by 5") that is contradicted by
the very frame it cites. Both errors are the same failure mode: generalising from an
absence in a static file, when the game generates most of its content at runtime.

**Recommended: 68.** Recoverable to ~85 by (a) replacing claim 16 with
`questCoinReward = nodeLevel × 5`, (b) demoting claim 2 to "premium prices UNHELD
except where a frame reads them", (c) moving quest prosperity +5/+10 out of claim 19's
server-side residue.
