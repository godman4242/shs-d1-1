# CRITIC — LENS 1 (CITE LENS) — unit: `economy`

Reviewer: blind critic. I did not see the surveyor's reasoning. Every verdict below
carries an artifact **I** opened myself. Method: for each claim I resolved the cited
path, counted to the cited line, and diffed the surveyor's `quote` against the bytes
on disk.

**Headline:** the payload work is real. 17 of 19 claims resolve to the exact line and
the exact text. Two claims fail — one on a factual misreading of the merchant vendor,
one on inverting §0's standing frame-wins invariant. Separately, the journal contains
one **phantom frame**: a "filmed HUD read" that the repo's own config says was never
filmed from the original game.

---

## Summary table

| claim | refuted | severity | one-line reason |
|---|---|---|---|
| economy/sell-price-formula | no | — | `Item.as:1582-1593` verbatim; `sellPercentage` dead-code call confirmed by grep |
| economy/repair-weapon-cost | no | — | `InteractUI.as:1057-1058` verbatim |
| economy/coins-per-kill | no | **material** | A2 core exact — but the "frame-vs-doc" note cites a frame that does not exist |
| economy/xp-formula | no | minor | `NPC.as:166-190` verbatim; `getGreyLevel` is at :94 not :95 |
| economy/trade-goods-arbitrage | no | minor | `InteractUI.as:1558-1585` verbatim; commodity 0's seed degenerates to 0 |
| economy/crop-price-oscillator | no | — | all four cites (:105, :497-502, :1544-1548, :220) exact |
| economy/service-prices-are-formulas | no | **material** | six price rows exact; the reinforce-reagent sentence is wrong AND its cite range is malformed |
| economy/gold-coin-exchange-rate | no | minor | `InteractUI.as:918-926` verbatim; rate is clamped, not guaranteed |
| economy/item-price-table | no | minor | `itemdata.xml:28-34` byte-exact; one `<baseprice>` row is literally `.` |
| economy/five-vendor-generators | **YES** | **material** | merchant stock is client-generated, not server-pushed; 2 of 5 lists are not verbatim; peddler count wrong |
| economy/war-room-build-costs | no | — | `WarHexUI.as:1330-1387` verbatim |
| economy/duel-token-economy | no | minor | `StatsManager.as:158/160/162/166` verbatim; :1135 off by one |
| economy/starting-wallet | **YES** | **material** | inverts §0: the repo's "3 gold" is FRAME-BACKED, so THE FRAME WINS over the android row |
| economy/coin-purse-cap-ladder | no | minor | ladder verbatim; "by upgrade tier" is unsourced — stat 1011 has zero writers |
| economy/cho-han-is-ev-neutral | no | minor | EV math correct; it is EV-**negative** near the purse cap, and it pays coins not premium gold |
| economy/quests-pay-no-coins | no | — | I re-ran the scan independently: 386 outcomes, 0 with `<id>11</id>`; both branches checked |
| economy/prosperity-daily-sim | no | minor | strings verbatim; misses a 7th event at `HistoryItem.as:373` |
| economy/iap-price-tiers | no | — | STILL_UNHELD is correct and well-grounded; `Mobile_PremiumData.as:5` and the absent `.bin` both confirmed |
| economy/provenance-android-0682 | no | — | `StatsManager.as:30` verbatim; I re-ran `diff -q` myself — byte-identical, no output |

---

## The two refutations

### R1 — `economy/five-vendor-generators` is WRONG about the merchant (and about "verbatim")

The claim says the merchant "ships EMPTY, meaning merchant stock was server-pushed and
is dead", and the lane_impact calls it "a genuine hole an offline build must author".

`XMLShopData.initMerchantItems()` really is an empty stub (`XMLShopData.as:89`). But the
merchant's stock is not built there. `ShopUI.showBuyMerchant()` (`ShopUI.as:173`) builds
it **client-side, deterministically**, immediately after consuming the empty list:

```
190:         var seed:int = StageManager.getCurrentNode() * QueryManager.instance.getServerDate();
191:         ItemGenerator.instance.setRNGSeed(seed);
192:         var rng:RNG = new RNG(seed);
193:         for(i = 0; i < 8; i++)
195:            xsi = new XMLShopItem(new XML());
196:            xsi.initRandomRareMerchantItem(rng);
199:         for(i = 0; i < 8; i++)
202:            xsi.initRandomLegendaryMerchantPremiumItem(rng);
```

Sixteen items, seeded by `currentNode × serverDate` — the *same* seed shape the survey
correctly identifies for trade goods. The merchant is therefore **fully recoverable
offline**, not dead, and needs no authoring. A porter following the survey would invent
content that already exists.

Two further errors in the same claim:

- **"verbatim item-ID lists" is false for 2 of 5.** Merchant has no list (procedural,
  above). Premium's three lists come from `QuestEngine.premiumDefaultList /
  premiumSpecialList / premiumRotationList`, which are populated by
  `QuestEngine.loadPremiumData(xml)` (`QuestEngine.as:196-210`) from
  `121_Mobile_PremiumData.bin` — **the exact blob this same survey's
  `economy/iap-price-tiers` claim proves was never extracted.** The survey contradicts
  itself between two of its own claims. Only peddler, inn and barber carry verbatim lists.
- **Peddler arithmetic is wrong.** `XMLShopData.as:48` reads
  `var removeCount:int = extraItems.length - (10 + defaultItems.length);` = 24 − (10 + 7)
  = **7** removed, leaving **17** of 24 extras (24 items on the shelf). The claim says
  "7 fixed + 10 of 24 rolled". The inn ("3 of 6", `removeCount:int = 3` at :70) and barber
  ("49 culled to 16", `removeCount = defaultItems.length - 16` at :143) are both correct.

### R2 — `economy/starting-wallet` inverts §0's standing invariant

The A2 row is real; I read it byte-for-byte at `StatsManager.as:705-710`. The failure is
the conclusion: *"confirms the repo's '100 coins' but contradicts its '3 gold'."*

The repo's "3 gold" is **not** a doc guess. It is a frame reading:

- `docs/research/video-study/segments/A-00-boot-login.md:111-112` — PLAYER sheet,
  *"currency row `114 COINS`, `3 GOLD` (guest starts with 3 gold)"*
- same file `:150` — *"guest starts 100 coins / 3 gold"*
- corroborated in a second segment, `A-07-...:20` — *"gold coin icon `3` / `GOLD` label,
  plus red `GET GOLD` button (IAP currency, separate from the `126 COINS` soft currency)"*
- and `src/config/profile.ts:5` labels the A-00 guest start **"frame-backed"**.

**THE FRAME WINS.** I am saying it out loud as §0 requires. `STAT_HGOLD = 0` in the
**android 0.682** bundle does not correct the repo — it is evidence that the android
build's guest start diverges from the filmed **web 0.717** target. The row belongs in the
survey as a platform/version divergence note, not as a contradiction of a frame-backed
value. A porter acting on this claim would delete a frame-backed number in favour of an
off-version payload row, which is the precise failure mode §0 exists to prevent.

---

## The phantom frame (not a claim, but the worst thing in the unit)

`docs/gauntlet/L0/systems/economy.md:121-125` writes, under the heading
**"Frame-vs-doc note (the standing invariant)"**:

> The single filmed HUD read of `+8 COINS` is **not** contradicted by the payload — at a
> level-9 duelist, `floor(U[0,1)×9)` yields 0–8, so 8 is the top of the range. The frame
> and the payload agree; what is refuted is the *model* (flat constant) inferred from that
> one frame. The payload supplies the generator the frame only sampled once.

**There is no such frame.** The survey quotes `src/config/economy.ts` lines 32-35 but stops
one paragraph short of lines 28-30, which say the opposite:

```
28: * Our +10/+8 was an INFERRED seed verified only against OUR OWN build's
29: * screenshots; it was never an OG measurement, so the Stage-2 gate row that
30: * reads "+10 XP / +8 COINS" is updated rather than left silently false.
```

`docs/sessions/-SESSION-LOG.md:2095` confirms the provenance: *"2026-07-13 browser run …
real-input duel win → YOU WIN +10 XP/+8 COINS (screenshot)"* — **our** build in **our**
browser. Calling that "the frame" and reconciling the payload against it is a fabricated
A1 under §0. It must be struck.

**And a real frame was available and missed.** `A-00-boot-login.md:101-103` records actual
OG encounter payouts from the gold results modal:

> Observed: fight 1 (3 bandits) → **2 coins**, 53 XP; fight 2 (bandit mob + Jinbei L3, with
> ally) → **12 coins**, 444 XP.

Two filmed payouts, neither of them 8, differing by 6× between encounters. This is a far
stronger corroboration of the survey's own (correct) finding that coins-per-kill is a
generator and not a flat 8 — and it is consistent with the payload's split model
(`1 * qty` / `5 * qty` per field-mob loot unit at `NPC.as:837-844`, plus
`floor(U[0,1)×level)` for the L3 duelist at `EnemyPlayer.as:1293-1300`). The survey
invented a reconciliation while the genuine one sat in the ledger.

---

## Corrections that do not refute

**C1 — reinforce reagents (`economy/service-prices-are-formulas`).** The claim says
"reinforce is a flat 5000 plus reagent stats 20060-20065 consumed in three level bands
(InteractUI.as:1102-1047)". The cite range is malformed (descending) and the stat set is
the wrong service's. Reinforce consumes one reagent per weapon-level band —
**20064** (`:1104/:1110`, lvl<30), **20065** (`:1114/:1120`, <60), **20066**
(`:1124/:1130`, else). Stats **20060-20063 + 20065** are the **FORGE** reagents
(`:1017-1046`: 20061×2 / 20062×1+20063×2 / 20061×2+20060×2+20065×1). The 5000 flat
(`:1083`) and all six price rows are correct.

**C2 — trade-goods commodity 0 has a degenerate seed.** `InteractUI.as:1562` reads
`new RNG(StageManager.getCurrentNode() * QueryManager.instance.getServerDate() * index)`.
At `index == 0` the seed is **0** regardless of node or date, so commodity 0 (price 10,
variation 20) prices identically in every town on every day. Four of five commodities
arbitrage; one does not. Also note `getGoodsPriceString()` (`:1588+`) re-declares the same
price/variation table **without** the RNG, so display and charge come from two code paths.

**C3 — the coin-purse ladder's advancement path is STILL_UNHELD.** The six values are
verbatim (`StatsManager.as:2632-2651`). But "by upgrade tier" is unsourced: `getStat(1011)`
at `:2634` is the **only** true reference to stat 1011 in all 559 files of the bundle —
there is no writer, no purchase, no quest reward that raises it. The ladder is held; the
thing that climbs it is not.

**C4 — Cho-Han is EV-negative, and was never a *gold* faucet.** Two sharpenings that make
the survey's correction stronger, not weaker:
(a) `changeGold()` clamps at `getMaxCoins()` (`StatsManager.as:2657-2666`), so a winning
`bet * 2` is truncated whenever it would overflow the purse — expected value is strictly
**negative** near the cap, not zero.
(b) `changeGold` moves stat **11 = `STAT_GOLD`** (`StatsManager.as:192`), i.e. **coins**;
premium currency is `STAT_HGOLD = 12` (`:194`). Cho-Han never paid premium gold at all, so
it could not have been one of the ledger's "non-cash **gold** faucets" under any EV.

**C5 — prosperity has a seventh event, and it is player-driven.** The cited range
`HistoryItem.as:137-311` stops just short of `:373`:
`return "Players changed prosperity through quests by " + val1;`. That matters for the
PARTIAL verdict: prosperity is not purely a server tick — quest completion feeds it, which
is a lever an offline build can actually drive.

**C6 — one `<baseprice>` row is not a number.** `docs/gauntlet/L0/index/itemdata.json`
reports `itemdata/item/baseprice` `count: 550` but `numeric_count: 549`, with `"."` in
`sample_values`. The claim's "550 rows (0-5000)" will hand a porter one `NaN`.

**C7 — sell has two exceptions the formula misses.** `ShopUI.as:396-398` forces
`slot.setCost(0,0)` for `itemID == 13002` (sells for nothing), and the proceeds at
`:540` go through `changeGold`, so a sale into a full purse is silently truncated.

**C8 — a partial UI string table IS located; item names still are not.** Not a refutation
— the survey's caveat is right — but the §2.1 blocker is narrower than stated.
`reference/decompiled/shs3_android/scripts/Mobile_Lang_EN.as:5` reads
`[Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]`,
consumed by `LangManager.getString()` (`LangManager.as:73-78`). Low-ID service strings do
resolve against it (63 → "Coins", 83 → "Buy", 88 → the insufficient-funds dialog, matching
their `InteractUI` call sites exactly). The item-name range (4000+) and NPC-name range
(5060+) do **not** resolve. So: **UI chrome is nameable, priced items are not.** The
survey's "never claim a priced item's name is held" stands.

**C9 — a frame corroborates the inn formula, unremarked.**
`A-07-toshibara-castle-town-arrival-yasuka-at-.md:27` films the innkeeper's line
`COST: 8 COINS`, with the player at level 4 in that town (`A-09:4`, `A-10:4` both read the
level badge as `4`). The payload's inn rule is `nodeLevel * 2` (`InteractUI.as:229`).
8 = 4 × 2. Frame and payload agree — that is a genuine A1 confirmation the survey could
have banked instead of the phantom one.

---

## What I verified byte-for-byte (own cites)

Opened and line-counted: `Item.as:1582-1593`, `ShopUI.as:58/173/190-204/396-401/536-540/664`,
`InteractUI.as:105/220/229/241/497-502/805-820/918-926/1002-1008/1017-1046/1057-1076/1082-1131/1406/1544-1548/1558-1585/1619-1676/1748-1764/1790-1844`,
`EnemyPlayer.as:1293-1300/1307-1327`, `NPC.as:94-190/837-844`, `LootDialog.as:650-657`,
`NetworkManager.as:1268/2042`, `StatsManager.as:30/158-166/192/194/234/705-710/1130-1136/2371-2377/2632-2666`,
`WarHexUI.as:1330-1387`, `XMLShopData.as:41/48/63/70/84/89/98-134/137/143`,
`XMLQuestOutcome.as:1-45/50-77`, `XMLItem.as:86-96`, `QuestEngine.as:196-210`,
`Mobile_PremiumData.as:5`, `Mobile_Lang_EN.as:5`, `LangManager.as:73-78`,
`itemdata.xml:24-40`, `questdata.xml:210-216/290-300`,
`src/config/economy.ts:25-66`, `src/config/profile.ts:1-16`,
`docs/research/REBUILD_READINESS.md:128/200/213-216/352`,
`docs/research/video-study/segments/A-00-boot-login.md:50/101-103/111-112/150`,
`docs/research/video-study/segments/A-07-...:20/27`,
`docs/sessions/-SESSION-LOG.md:2095`,
`docs/gauntlet/L0/index/itemdata.json`, `docs/gauntlet/L0/systems/economy.md:110-130`.

Re-ran independently: `diff -q shs3_android/{InteractUI,Item}.as shs3_android_payload/…`
(both silent → byte-identical, provenance claim confirmed); a Python scan of all 386
`<outcome>` blocks in `questdata.xml` (0 contain `<id>11</id>`; 77 `<reward>` blocks =
69 `<exp>` + 19 `<loot>`) — and I additionally checked the `<set>` branch
(`XMLQuestOutcome.as:73-76` calls `setStat(this.id, this.setNo)`), which the survey did
not mention; it cannot pay coins either, because no outcome carries `<id>11</id>` at all.
The "coin faucet set is closed and enumerable" conclusion survives a stricter test than
the one it was given.

Frame opened: `reference/videos/Nr4fQstqHDM.mp4` @ t=1086s, cropped `1920×420+0+660`
and upscaled ×1.6 — combat scene (HP 10/20, CHI 31/47, "CANNOT CHANGE STANCE",
"150% DAMAGE"), no economy content; the segment-doc timestamps do not map linearly to
the video, so no economy row was gradeable from it. Recorded so the negative result is
not silently dropped.

---

## Score comment

`48 → 78` is defensible on volume but reads ~5 points rich given R1 (a whole vendor
mischaracterised as dead when it is deterministic and portable), R2 (a §0 invariant
inverted), and the phantom frame. `72-74` is the honest number. The provenance claim
(`economy/provenance-android-0682`) is the best work in the unit and correctly caps the
ceiling on its own.
