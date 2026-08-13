# CRITIC — unit `economy` — LENS 3 (PRECEDENCE / stale-claiming)

Blind review. I did not see the surveyor's reasoning. Every verdict below carries an
artifact **I** opened. Crops are stated. Frames are 1024×576 (not 1080p) in the
`seg-NN/frames/` trees; I upscaled 4–6× with LANCZOS before reading any text.

**Headline:** 13 of 19 claims survive, several of them stronger than the surveyor
knew. But this survey **never opened a single frame** (it says so itself in
`score_rationale`), and that is exactly where a precedence lens bites. Six claims
break, two of them fatally, and in every case the break is the same shape: an AS3
class constant from the **Android 0.682** bundle was promoted to a law of the game
without checking the **web v0.717** longplay that would have settled it in ninety
seconds.

**Score impact:** 78 is too high. The two fatal breaks remove a "closed and
enumerable" conclusion and an honest-but-wrong STILL_UNHELD. The three frame
corroborations I found (below) push in the other direction. Net: **72**.

---

## A. REFUTED

### R1 — `economy/quests-pay-no-coins` · **FATAL** · overturned by frame AND payload

The claim: *"Quest rewards pay XP and loot but never coins — the schema supports a
coin branch and zero quests use it — which closes the coin faucet set as
enumerable."*

This is false three times over.

**A1 — the frame.** `reference/frames/zFtCaTO0_1M/seg-29/frames/frame_0013.jpg`,
crop `(490,340)-(760,460)` upscaled ×5. The QUESTS panel reward block reads,
verbatim:

```
REWARD
250 XP
30 COINS
TOWN PROSPERITY: +5
```

And the money actually moves. Same segment, coin counter crop `(0,0)-(220,60)` ×5:
`frame_0012.jpg` = **365 COINS** (before turn-in) → `frame_0020.jpg` = **395 COINS**
(after). Delta **+30**, matching the panel exactly.

**A1 — second, independent.** `reference/frames/Nr4fQstqHDM/seg-28/frames/frame_0031.jpg`,
crop `(480,340)-(800,470)` ×4: `REWARD / 473 XP / 35 COINS / TOWN PROSPERITY: +10`.

**A2 — the payload the surveyor searched.** The coin branch for quest *rewards* is
not `<outcome><id>11</id>`; it is `<reward><loot><id>0|1|11</id>`. The surveyor
searched the wrong element. `QuestLogUI.as:456-461`:

```as3
else if(lootType == 0 || lootType == 11)
{
   coinReward += qty;
}
else if(lootType == 1)
{
   coinReward += 5 * qty;
}
```

and `reference/extracted/questdata.xml:4162-4175` — a shipped story quest that pays
30 coins on disk:

```xml
<reward>
  <exp>750</exp>
  <loot>
    <id>0</id>
    <qty>30</qty>
    <chance>1</chance>
  </loot>
  ...
```

Note the corroboration chain: that row is `750 XP + 30 coins`, and
`docs/research/video-study/segments/A-24-...md:27` records the matching HUD deltas
(`coins 310→340, XP 10431→11181`, i.e. +30 and +750). Payload row and film agree.

**Consequence.** The lane_impact sentence *"the coin faucet set is now closed and
enumerable — a rebuild can balance the economy without guessing at a hidden
quest-coin income stream"* is precisely backwards: quest coins ARE a faucet, they
are the one the survey omits, and they are the largest per-event payout in the
early game (+30/+35 vs a duelist kill's `floor(U[0,1)×level)`). Strike the claim and
re-open the enumeration.

---

### R2 — `economy/iap-price-tiers` · **FATAL** · STILL_UNHELD is wrong; the frames hold it

The claim: *"Real-money IAP price tiers cannot be grounded in any admissible
artifact."* The surveyor searched `Mobile_PremiumData.as`, `GetGoldPromptDialog.as`,
`PayVaultBuy*.as` and `bindata/`, found nothing, and — reasonably, on that evidence —
answered STILL_UNHELD. Its payload negatives are all correct: I re-ran them.
`Mobile_PremiumData.as:5` is `[Embed(source="/_assets/121_Mobile_PremiumData.bin", …)]`
and `ls reference/extracted/bindata/` returns 27 files (92–98, 100–119) with no 121.

But **§0 lists A1 first, and the survey never opened a frame.** The GET GOLD
storefront is on film.

`reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0003.jpg`, crop `(200,20)-(560,300)`
upscaled ×4, reads verbatim:

```
50 GOLD    4.99 USD   [BUY]
125 GOLD   9.99 USD   [BUY]
200 GOLD  14.99 USD   [BUY]   ("MOST POPULAR!" burst)
```

and the un-cropped frame continues `275 GOLD 19.99 USD`, `400 GOLD 24.99 USD`, with
the Super Rewards / TrialPay offer-wall buttons, a `FEATURE WISHLIST` button, and the
footer line *"Purchasing gold will support Straw Hat Samurai: Duels and help fund the
development of new features!"*

That is a five-row real-money tier table at A1, from the primary 1:1 reference, in
the proven web v0.717 build. Combined with the surveyor's own
`economy/gold-coin-exchange-rate` (1 gold = 1000 coins), the **entire** premium
economy — source, denomination and sink — is now recoverable, and
`REBUILD_READINESS.md §6`'s "The dead IAP economy … structurally UNRECOVERABLE" is
fully dead, not halved.

Sub-finding for the ledger: the Ready bullet "IAP tiers" traces to
`docs/research/video-study/SYNTHESIS.md:520`, which cites **B-17** as *"IAP tiers +
offer walls on-screen (B-17)"*. B-17's documented screen
(`segments/B-17-...md:4-11`) is the Ninja Shop BUY grid with **gold**-denominated
price badges (15/25/60/200/1/5/10) — not dollars. The tier table is in the same
segment but a different frame (`frame_0003`). The bullet was right by luck and
mis-cited; it is now correctly citable.

---

### R3 — `economy/duel-token-economy` · **MATERIAL** · the caps are creation values, not caps

The A2 rows are all verbatim — I checked every line number:
`StatsManager.as:158` `APINTERVAL:int = 60`, `:160` `DTINTERVAL:int = 2 * 60`,
`:162` `WARMOVEINTERVAL:int = 60 * 60`, `:164` `MAXQUESTS:int = 7`,
`:166` `MAXDUELTOKENS:int = 30`. The regen intervals stand.

The **caps** do not.

**Duel tokens.** `reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0001.jpg`, crop
`(820,50)-(1024,130)` upscaled ×6: a skull icon over **`40/40`** with the caption
**`DUEL TOKENS`**. Present on frames 1, 2, 4, 5, 6, 7 of that segment. Forty, not
thirty. `MAXDUELTOKENS:int = 30` is the value `changeDT()` clamps to *in the Android
0.682 build*; the web build the repo is recreating runs a max of 40.
**THE FRAME WINS — say so in the ledger.**

**AP.** The lane_impact claims this "closes world-exploration blocker ④ ('AP regen
rate + cap' — 30 max, one per 60 s)". `reference/frames/Nr4fQstqHDM/seg-28/frames/frame_0007.jpg`,
crop `(470,110)-(780,290)` upscaled ×4, character-summary tab:

```
HP   20 / 30
CHI  47 / 47
AP   30 / 40
```

**AP max is 40.** `setPlayerStats(STAT_MAXAP,30)` at `StatsManager.as:707` is a
level-1 character-creation initial — the same status as `STAT_MAXHP,10` two lines
above it, which the same frame shows as 30. Reading a creation initial as a cap is
the exact failure mode §0 exists to prevent. World-exploration blocker ④ is **not**
closed; the regen interval half is, the cap half is worse than open (there is now a
wrong number in circulation).

**Tournament.** Economy blocker ④ reads "token/**tournament** economy numbers."
`grep -rli tournament reference/decompiled/shs3_android/scripts/` returns **0 files**
across all 559 classes. The tournament half is untouched. This is a half-kill
reported as a kill.

---

### R4 — `economy/coins-per-kill` · **MATERIAL** · the reconciliation cites a frame that does not exist

The A2 cite is verbatim and correct — `EnemyPlayer.as:1293-1300`, field-mob path
`NPC.as:839/843` (`addLootCoins(1 * qty)` / `addLootCoins(5 * qty)`), buff at
`LootDialog.as:650-657`. The claim text stands on the payload alone.

The lane_impact does not:

> FRAME-VS-DOC: the filmed '+8 COINS' HUD read is NOT contradicted — at a level-9
> duelist floor(U[0,1)×9) tops out at exactly 8, so the frame and the payload agree
> … The frame sampled the generator once; the payload holds the generator.

**There is no such frame.** I traced the `8` to its source. `src/config/economy.ts:24-35`
states it outright:

```
 * Our +10/+8 was an INFERRED seed verified only against OUR OWN build's
 * screenshots; it was never an OG measurement, so the Stage-2 gate row that
 * reads "+10 XP / +8 COINS" is updated rather than left silently false.
```

Every "+10 XP / +8 COINS" in the repo (`docs/sessions/-SESSION-LOG.md:204, :525,
:739, :2095, :2241`) is a screenshot of **this repo's own Stage-2 victory screen**.
The upstream number is `docs/research/original-game-facts.md:74` — *"10 XP / 8 coins
per foe level (kills rewarding XP+coins is confirmed; formula isn't)"* — an unsourced
wiki-tier line that `SYNTHESIS.md:520` already marks *"⬆ upgraded to
**contradicted-as-formula**"*. Our own build's render is not one of the five
admissible classes, and dressing it as "the filmed HUD read" invents an OG artifact.
Strike the whole FRAME-VS-DOC paragraph; the claim survives on A2 with no frame
corroboration either way.

(For the record, the one duel-adjacent coin read that *is* on film — A-28's 3-bandit
pack, `350→365 = +15` — is a field-mob event, `3 × 5` on the `lootType == 1` path.
Consistent, but it tests the mob branch, not the duelist generator.)

---

### R5 — `economy/starting-wallet` · **MINOR** · "held verbatim" over-reaches on the gold row

`StatsManager.as:705-710` is verbatim; I read it. But the claim calls the whole
wallet "held verbatim" and then uses the `STAT_HGOLD,0` row to *correct* the repo:
*"src/config/profile.ts:10 records '(100 coins / 3 gold)' but this build starts at
STAT_HGOLD = 0."*

The frame disagrees, and the frame is the primary reference.
`reference/frames/zFtCaTO0_1M/seg-01/frames/frame_0033.jpg`, crop `(150,50)-(420,105)`
×6 → PLAYER panel currency row `114` coins beside the gold-koban icon reading `3`
(crop `(100,30)-(560,90)` ×4 catches both). That is roughly minute 4 of video A, one
tutorial quest in, with no gold faucet yet reachable — no rebirth, no tournament, no
IAP for a guest. `frame_0002.jpg` of the same segment shows the modal *"YOU NEED 2
MORE GOLD"* against a 5-gold fast-travel, which independently pins the holding at 3.

So: Android 0.682 starts a guest at 0 heavenly gold; web v0.717 shows 3 in hand
before anything could have granted it. That is a **version divergence**, not a repo
error, and the correction points the wrong way. `profile.ts`'s `3 gold` is the
frame-backed value and should stay. Downgrade the claim to PARTIAL: coins/AP/tokens
held, HGOLD contested.

---

### R6 — `economy/five-vendor-generators` · **MINOR** · peddler arithmetic is wrong

Core claim HELD verbatim — five generators at `XMLShopData.as:41` (peddler), `:63`
(inn), `:84` (merchant), `:98` (premium), `:137` (barber), and
`initMerchantItems()` really does ship `var defaultItems:Array = [];`. Inn
("7 fixed + 3 of 6", `removeCount:int = 3`) and barber ("49 culled to 16",
`removeCount = defaultItems.length - 16`) are both right.

The peddler is not. `XMLShopData.as:47`:

```as3
var removeCount:int = extraItems.length - (10 + defaultItems.length);
```

`extraItems.length` = 24, `defaultItems.length` = 7 → `removeCount` = 24 − 17 = **7**.
Seven are spliced out, so **17** extras survive and the peddler stocks 7 fixed + 17
of 24 (24 slots total). The lane_impact's "7 fixed + **10** of 24 rolled" reads the
`10` literal as the keep-count when it is a term inside the remove-count. A porter
copying that line ships a shop 7 items short.

---

## B. NEW — things the survey missed that make it STRONGER

### N1 — the "−70 capture artifact" is not an artifact. It is a Repair at node level 7.

`REBUILD_READINESS.md §economy` Surface bullet says: *"Forge 700c (the −70 HUD read
is a capture artifact)"*. `segments/B-10-...md:36` flags it harder — *"Flag as a
discrepancy to verify against a second viewing rather than hard-coding 700."* Both
are wrong, and the payload + the frames settle it together.

`reference/frames/Nr4fQstqHDM/seg-10/frames/`, coin counter crop `(0,0)-(150,42)` ×4
across consecutive frames:

| frame | coins | what is on screen |
|---|---|---|
| 0039 | 531 | blacksmith approach |
| 0040 | 531 | `FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE` (crop `(0,380)-(700,576)` ×2) |
| 0041 | 531 | `WHAT CAN I DO FOR YOU TODAY?` — back at the menu, **coins unchanged ⇒ forge was declined** |
| 0042 | **461** | `REINFORCE YOUR CURRENTLY EQUIPPED WEAPON TO MAKE IT UNBREAKABLE? / COST: 5000 COINS / MATERIALS NEEDED: 1 SILVER ORE` |

The −70 lands **between the menu and the reinforce prompt**, i.e. on the one
remaining paid menu item: **REPAIR WEAPON**. And `InteractUI.as:1058` prices it
`StageManager.getCurrentNodeLevel() * 10`. Node level is pinned at **7** by the forge
dialogue itself — `forgeweapon` builds `addRandomSword(level)` at the node level and
prices it `level * 100`, and the dialogue says *Iron Sword (LEVEL 7)* / *700 COINS*.
7 × 10 = **70**. Exact.

This single frame run does four things at once:
1. **Frame-corroborates the forge law** (`nodeLevel × 100` → 700 at nodeLevel 7).
2. **Frame-corroborates `economy/repair-weapon-cost`** (`nodeLevel × 10` → 70) — the
   survey's blocker-③ kill now has A1 backing, not just A2.
3. **Frame-corroborates reinforce = 5000 flat** (`InteractUI.as:1083`).
4. **Overturns the ledger's Surface line.** Delete "the −70 HUD read is a capture
   artifact" and close B-10's open flag.

It also quietly rebuts the survey's own `economy/provenance-android-0682` pessimism
for this subsystem: an 0.682 formula reproduced a v0.717 frame to the coin. Service
prices did not drift between builds. (Duel-token and AP caps did — see R3. So the
provenance caveat is real but **selective**, not blanket.)

### N2 — the sell-price formula is frame-corroborated. It was never checked.

`reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0008.jpg`, SELL grid crop
`(40,120)-(330,500)` ×4 and detail crop `(620,120)-(1010,420)` ×3:

- **PICKAXE** badge **10**. Pickaxe `WEIGHT: 10` (read on the A-04 player sheet).
  `getWeight() >= 10` → `(1 + 0) * 10` = **10**. ✔
- **TORN GARMENT** detail: `LEVEL 1 · DEFENSE: +1 (EQ: 1) · WEIGHT: 5`, badge **5**.
  Weight < 10, zero *modifiers* (the `+1` is the base `<defense>` row, not a
  `<modifier>`) → `(1 + 0) * 5` = **5**. ✔
- straw hat **5**, white garment **5**, plain katana **10**, green-bordered sword
  **15** = `(1 + 2) * 5`. ✔
- rice ball / red potion **1** — consumables are `2xxx` ids (`itemdata.xml:28`
  `<id>2100</id>`), so `itemID < 3000` → **1**. ✔
- "stick **0**" — the one apparent violation, and it is a hard-coded special case
  the survey walked past: `ShopUI.as:395-397`
  `else if(slot.getItemID() == 13002) { slot.setCost(0,0); }`. ✔

Six independent price points on the observed lattice `{0} ∪ {1} ∪ 5·(1+m) ∪ 10·(1+m)`,
zero misses. `economy/sell-price-formula` is the strongest claim in this unit and it
should be scored as A2 **+ A1**, not A2 alone. (Also confirmed: `sellPercentage` has
exactly one occurrence in the whole bundle — its own declaration at `ShopUI.as:58`.
Dead. The warning is correct.)

### N3 — inn rest = 8 coins is the same law, not a constant

`segments/A-07-...md:20` records the innkeeper line verbatim: *"COST: 8 COINS."*
`SYNTHESIS.md:239` banks it as *"Inn rest = 8 coins **flat**"*. `InteractUI.as:229`
prices it `getNodeLevel(getCurrentNode()) * 2` → 8 at node level 4. Another sampled
constant that is a formula. Supports `economy/service-prices-are-formulas`; the
SYNTHESIS "flat" wording is stale and should be corrected in the same edit.

### N4 — cite hygiene

`economy/service-prices-are-formulas` lane_impact contains `(InteractUI.as:1102-1047)` —
a reversed, impossible line range. The reinforce reagent bands are at
`InteractUI.as:1102-1138` (stats 20064 / 20065 / 20066 consumed in three level
bands; the `case "reinforceweapon"` block runs 1082→1139). Typo, not a fabrication,
but fix it before a porter chases it.

---

## C. VERDICT TABLE

| claim | verdict | severity |
|---|---|---|
| economy/sell-price-formula | HELD (+ frame-corroborated, N2) | — |
| economy/repair-weapon-cost | HELD (+ frame-corroborated, N1) | — |
| economy/coins-per-kill | **REFUTED** — fabricated frame in reconciliation | material |
| economy/xp-formula | HELD | — |
| economy/trade-goods-arbitrage | HELD | — |
| economy/crop-price-oscillator | HELD | — |
| economy/service-prices-are-formulas | HELD (+ frame-corroborated, N1/N3) | — |
| economy/gold-coin-exchange-rate | HELD | — |
| economy/item-price-table | HELD | — |
| economy/five-vendor-generators | **REFUTED** — peddler stock count wrong | minor |
| economy/war-room-build-costs | HELD | — |
| economy/duel-token-economy | **REFUTED** — DT cap 40 & AP cap 40 on film; tournament untouched | material |
| economy/starting-wallet | **REFUTED** — HGOLD row contested by frame | minor |
| economy/coin-purse-cap-ladder | HELD | — |
| economy/cho-han-is-ev-neutral | HELD | — |
| economy/quests-pay-no-coins | **REFUTED** — quests pay coins (frame ×2 + payload) | fatal |
| economy/prosperity-daily-sim | HELD (PARTIAL is honest) | — |
| economy/iap-price-tiers | **REFUTED** — tiers are held at A1 | fatal |
| economy/provenance-android-0682 | HELD, but selective — services match v0.717, caps do not | — |

## D. THE PATTERN, FOR THE NEXT SURVEYOR

Three of the six breaks are one mistake wearing three hats: **an Android-0.682 class
constant read as a law of the game**, when a v0.717 longplay frame was sitting in
`reference/frames/` the whole time. `MAXDUELTOKENS = 30` → film says 40.
`MAXAP = 30` → film says 40. `STAT_HGOLD = 0` → film says 3. All three are
*character-creation initials or build-specific clamps*, and all three were promoted
to invariants without a look.

Rule for this repo, restated: **decompiled AS3 is A2 and admissible, but it is not
above A1.** When a payload constant and a frame disagree, THE FRAME WINS — and the
finding must say so out loud. A payload row that has been checked against a frame
(N1, N2) is worth far more than four that have not.
