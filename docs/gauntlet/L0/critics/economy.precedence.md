# economy — LENS 3 (PRECEDENCE) critic review

Blind review. I did not see the surveyor's reasoning. Every verdict below carries an
artifact **I** opened. Frames were extracted fresh from `reference/videos/` with ffmpeg
and cropped/upscaled with PIL; crops are stated.

**Headline:** the survey's payload work is unusually good — 14 of 20 claims verified
verbatim, line-for-line, including several I expected to fail. But it has **one fatal
claim** (`quests-never-pay-coins`, refuted three independent ways including a frame it
never opened), **two claims built on a mechanism that is provably false**
(`heavenlyprice-is-5x-deflated`, `writ-25g-upheld-by-frame`), and **one fabricated
timestamp** (`service-prices-are-formulas`). Score 82 is too high; I would put it at 68.

---

## §1 — THE FATAL ONE: quests DO pay coins

`economy/quests-never-pay-coins` asserts *"No shipped quest pays coins … so the coin
faucet set is closed and enumerable."*

The surveyor's **measurement is correct** — I reproduced it: `questdata.xml` has exactly
386 `<outcome>` blocks and exactly 0 carry `<id>11</id>`. The **conclusion is wrong**,
because it searched the wrong element and the wrong id set. Refuted three ways:

**(a) FRAME — and per §0 the frame wins.**
`reference/videos/Nr4fQstqHDM.mp4` (video B) t=21:35, QUESTS journal, right-hand detail
panel for `SHIGENOI TOKIMASA'S QUEST`. Crop (950,700)-(1350,880), upscaled ×4 LANCZOS.
Reads, unambiguously:

```
473 XP
35 COINS
TOWN PROSPERITY: +10
```

**(b) CODE — the renderer the surveyor never opened.**
`reference/decompiled/shs3_android/scripts/QuestLogUI.as:454-465` (`parseReward`):

```as3
else if(lootType == 0 || lootType == 11) { coinReward += qty; }
else if(lootType == 1)                   { coinReward += 5 * qty; }
else if(lootType == 50007)               { townProsperityReward += qty; }
```
and `:490-497` emits `xpReward + " XP\n"`, `coinReward + " coins\n"`,
`"Town Prosperity: +" + townProsperityReward` — **the exact three lines, in the exact
order, that the frame shows.**

Quest coin rewards live in `<reward><loot>`, not `<outcome>`, and the coin ids are
**0, 1 and 11** — not 11 alone. The surveyor documented ids 0 and 1 as coins in its own
`coins-per-kill-and-xp` claim and did not carry that forward.

**(c) PAYLOAD — it is in questdata.xml itself.**
Tallying all 77 `<reward>` blocks: one carries `<loot><id>0</id><qty>30</qty></loot>`
= a **30-coin quest reward**, sitting in the authored data the surveyor scanned.

> Precedence note: a frame that settles this was available and was not opened. A
> universal negative ("no shipped quest pays coins", "the faucet set is closed") drawn
> from an incomplete search space is exactly the failure mode §0 exists to prevent.

---

## §2 — The 5× redenomination: right answer, false argument

Two claims (`heavenlyprice-is-5x-deflated`, `writ-25g-upheld-by-frame`) rest on the
sentence *"the 5 is the Android denomination."* **That is impossible.**

`reference/extracted/itemdata.xml` and `reference/extracted/android/111_Mobile_ItemData.bin`
are the **same bytes**. Stripping the Android blob's 40-byte XML declaration and
trailing newline:

```
md5(itemdata.xml body)              = 75d5344925e13de09924120b4136ae2a
md5(111_Mobile_ItemData.bin body)   = 75d5344925e13de09924120b4136ae2a
```

`diff` reports only the declaration line and the trailing newline. The surveyor's own
`web-payload-is-decompilable` claim states this byte-identity — and then the `writ-25g`
claim contradicts it. A file that is identical in both builds **cannot carry a
per-build denomination**.

Nor is there a multiplier anywhere in the item→shop path, in **either** build:

| stage | Android | Web |
|---|---|---|
| parse | `XMLItem.as:96` `this.hvalue = xml.heavenlyprice;` | `§1t104s0§.as:94` `this.§1t847s0§.§1t695s0§(param1.heavenlyprice);` |
| shop row | `XMLShopItem.as:37,123` `this.hvalue = itemData.hvalue;` | — |
| premium list | `XMLShopData.as:109` `xsi.assignFromId(defaultItems[i])` → raw `hvalue` | — |
| render | `ShopUI.as:393` `slot.setCost(…, …hvalue)` | — |

**The ×5 ratio is nevertheless real — and the proof is in CODE, in three constant pairs
the surveyor collected but never connected:**

| pair | web v0.717 | android v0.682 | ratio |
|---|---|---|---|
| rebirth payout (`§1t1523s0§.as:2646,2651` / `StatsManager.as:2203,2207`) | 100 / 25 | 20 / 5 | **5×** |
| convertgold (`§1t401s0§.as:952` / `InteractUI.as:923`) | 200 coins per gold | 1000 coins per gold | **1/5 value** |
| IAP tiers (`§1t410s0§.as:136-140` / `PayUI.as:127-131`) | 50/125/200/275/400 | 10/25/40/55/75 | **5×** (top tier 5.33×) |

So: **web gold is denominated 5× (5× as many units, each worth 1/5 the coins).** That is
a solid, three-way-corroborated finding. What remains genuinely **STILL_UNHELD** is *how*
the web shop turns a shared `heavenlyprice` of 5 into an on-screen 25 — no multiplier
exists in either decompile. The surveyor papered over that gap with a false provenance
story instead of reporting it.

### And "exactly 5×" is false on its face

Video B t=48:04, premium BUY shop. My crops, row 1 = (185,255)-(965,455) ×3 and row 2 =
(185,445)-(965,645) ×3:

- row 1: banknote printed `200` — badge **1** · green+blue `++` — badge **1** ·
  grey skull — badge **5** · grey 3-skull — badge **10**
- row 2: grey 5-skull — badge **15** · **gold skull — badge 1** · gold 5-skull —
  badge **10** · gift box — badge **5**

`heavenlyprice` domain is `{0,1,2,3,5,8,12,25,100}`; ×5 yields `{0,5,10,15,25,40,60,125,500}`.
**1 is not in that set.** Three separate tiles price at 1 gold. The surveyor quotes the
banknote-at-1 tile in its own evidence string and never reconciles it. The grey-skull
duel-token ladder (1,2,3 → 5,10,15) and the three 25-gold scrolls do fit ×5 cleanly, so
the *pattern* is real for itemdata-priced tiles — but "exactly 5×" as a porting law is
overstated, and `L3`'s instruction to multiply every `<heavenlyprice>` by 5 would
mis-price the 1-gold slots.

### Minor, same claim family
`writ-25g` says *"the three heavenlyprice-5 scrolls 2200 / 2203 / 2207."* There are
**five** rows at heavenlyprice 5 — 2200, 2203, 2207, **2212 (Clan Deed)** and
**2214** — and 2212 is in `121_Mobile_PremiumData.bin`'s `<default>` list too. The
one-for-one pairing is asserted, not shown.

---

## §3 — A fabricated timestamp

`economy/service-prices-are-formulas` cites:

> *"Video B's town is a level-7 node (B-10 t=21:02 dialogue: 'FORGE AN IRON SWORD
> (LEVEL 7)? / COST: 700 COINS')"*

I pulled `Nr4fQstqHDM.mp4` at t=21:02. It shows **MAIN STREET** — location banner, 531
coins, 2 gold, level 8, TERRITORY (24,52) — and **no dialogue box at all**. The source,
`docs/research/video-study/segments/B-10-…md:22`, gives that dialogue as an unlabelled
`e.g.` with **no timestamp attached**. The timestamp was manufactured.

Worse for the precedence lens: the claim imports the ledger line
`REBUILD_READINESS.md:216` *"Forge 700c (the −70 HUD read is a capture artifact)"* while
`SYNTHESIS.md:243` flags that same discrepancy as **"unresolved … do NOT hardcode."**
The surveyor re-banked a figure its own source says not to bank.

**The six formulas themselves are fine** — I read every line:
`InteractUI.as:229` inn `nodeLevel*2` · `:241` stables `nodeLevel*2` · `:1003-1008`
forge `min(level,80)*100` · `:1058` repair `nodeLevel*10` · `:1083` reinforce `5000` ·
`:1406` toll `nodeLevel`. All verbatim. The claim's **code half holds; its frame
corroboration does not exist.**

### Bonus — I resolved the ledger's −70 for it
Across B's blacksmith visit the wallet reads **531 → 461 = −70** (t=21:25 blacksmith
menu at 531; t=21:45 stables at 461). At node level 7, `repair = 7 × 10 = 70`. The −70
is a **Repair Weapon**, not a mis-captured forge — and the forge was never paid, because
the player held 531 against a 700 quote (B-MAP.md:24 records the insufficient-funds
popup). `REBUILD_READINESS.md:216`'s "capture artifact" parenthetical is **wrong and now
closable**, and the −70 independently confirms `repair = nodeLevel × 10` on film.
(The stables 545 → 531 = −14 = 7 × 2 confirms the inn/stable formula the same way.)

---

## §4 — What held (verified line-by-line, not taken on trust)

| claim | my check |
|---|---|
| `web-payload-is-decompilable` | 1079 `.as`; **exactly 612** `§`-mangled at `scripts/` top level; `§1t17s0§.as:1977-1988` read verbatim |
| `premium-exchange-rate-200` | web `§1t401s0§.as:952` `…(200);` inside the `"convertgold"` block at `:959`; Android `InteractUI.as:923` `changeGold(1000)`; frame banknote `200` @ 1 gold |
| `iap-tiers-held-both-builds` | all four ladders exact — web 50/125/200/275/400 & 50-250 KREDS; 20% 60/150/240/330/480; 50% 75/188/300/413/600; Android 10/25/40/55/75 @ 4.99-24.99 |
| `premiumdata-blob-is-extracted` | blob read; 16 `<default>` SKUs, commented-out `<special>`, named rotation `<set>`s |
| `rebirth-payout-config-is-right` | web 25 / 100 (DAN==8), Android 5 / 20; `src/config/economy.ts` `REBIRTH` matches |
| `guest-start-3-gold-confirmed` | 21 assignments align slot-for-slot; `§1t9413s0§`(HGOLD) web **3** vs Android **0**; 100/30/30/20/20 identical |
| `duel-token-cap-40` | web constant block `:197-205` aligns to Android `:162-170`; MAXDUELTOKENS web **40** vs Android 30; **my own frame reads `40/40`** |
| `sell-price-formula` | web `§1t17s0§.as:1979-1988` verbatim; `sellPercentage` = **1 occurrence repo-wide**, dead as claimed |
| `repair-weapon-cost` | web `§1t401s0§.as:1058` and Android `:1058` both `× 10` — same line number, as claimed |
| `coins-per-kill-and-xp` | `NPC.as:838/842` `1*qty` / `5*qty`; `calcXP` at `:166` verbatim |
| `coin-purse-cap-ladder` | ladder + `changeGold` clamp verbatim; `ShopUI:426-435`, `BankUI:264`, `InteractUI:1748` all check out |
| `crop-price-is-supply-oscillator` | `InteractUI.as:497-501` verbatim |
| `war-room-structure-costs` | `WarHexUIBuildMenu.as:192/197/202/207` = 10000/5000/10000/10000 verbatim |
| `cho-han-is-ev-neutral` | escrow at `:1794` `changeStat(STAT_GOLD,-num)`; dice `:1811-12`; payout `:1833` |
| `trade-goods-arbitrage-loop` | table + return expression identical; **seed divergence real** — Android 3 factors, web `§1t401s0§.as:1676` 2 factors. PARTIAL is the honest call |

**Ledger quoting is accurate.** Every `ledger_text` I checked matches
`REBUILD_READINESS.md` verbatim (lines 214, 215, 216, 352). No fabricated ledger text —
worth saying, since that is the usual failure here.

### Two small things the survey got slightly wrong but not wrongly
- `duel-token-cap-40` is labelled **"FRAME BEATS PAYLOAD."** It isn't: the frame and the
  **web** payload agree at 40; only the **Android** payload dissents. It is
  web-beats-Android. (Cite is `:200`; the constant is at `:201`.)
- `coins-per-kill-and-xp` quotes `calcXP` but omits two guards that change behaviour:
  `if(mobLevel <= getGreyLevel()) return 0` and `if(mobLevel - playerLevel > 3) return 0`,
  plus `if(elite) finalXP *= 2`. Incomplete, not wrong.
- `cho-han-is-ev-neutral`: the payout is `changeGold(bet*2)`, and `changeGold` **clamps
  at `getMaxCoins()`** (the surveyor's own claim 14). Near the purse cap cho-han is
  **negative** EV, not neutral. Also worth noting the stake is `STAT_GOLD` = stat 11 =
  **coins**, so the ledger's "gold has … faucets (… betting)" is wrong twice over.

---

## §5 — New findings the survey missed

1. **Quest coin rewards exist** (§1) — fatal to `quests-never-pay-coins`, and reopens
   the coin-faucet enumeration for L1/L10.
2. **The 5× redenomination is a CODE fact, not an itemdata fact** (§2) — three constant
   pairs prove it; the itemdata route cannot. The *mechanism* by which the web shop
   renders 25 from a shared `heavenlyprice` of 5 is **STILL_UNHELD**.
3. **The ledger's −70 is Repair Weapon at node level 7** (§3) — overturns
   `REBUILD_READINESS.md:216`.
4. **Fast travel costs 5 heavenly gold.** Video B t=21:35, QUESTS panel, `TAKE ME THERE`
   button; crop (1650,450)-(1790,530) ×7 shows the yellow koban gold icon + `5`. A gold
   **sink** absent from the survey's model — which enumerates coin faucets carefully and
   never enumerates gold sinks at all.
5. **Town prosperity is loot id 50007**, magnitude carried in client-side `<qty>`
   (`QuestLogUI.as:462`), rendered as `TOWN PROSPERITY: +10` on film, and logged by
   `HistoryItem.as:373` `"Players changed prosperity through quests by " + val1` — a
   seventh prosperity channel the `prosperity-magnitudes-server-side` taxonomy omits.
   So *"only the −1000 ninja hire is a recoverable constant"* is false.

---

## §6 — Verdict

| | count |
|---|---|
| HELD, independently verified | 15 |
| refuted — fatal | 1 |
| refuted — material | 3 |
| refuted — minor | 1 |

The payload archaeology is genuinely strong and the web/Android diff method is a real
contribution. The failures cluster in one place: **wherever the surveyor needed a frame,
it reached for a document or an inference instead** — and every time it did, the frame
disagreed.
