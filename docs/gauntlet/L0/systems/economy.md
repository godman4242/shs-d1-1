# GAUNTLET L0 — system survey: **economy** (ledger score 48/100)

Surveyor: economy lane, **re-survey pass 2** (2026-08-14).
Document under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20) — §2 table row
`| **economy** | 48 | prices, services, currencies, war-room costs | sell-price + prosperity formulas; coins-per-kill reality; server-sim economy |`,
the `### economy — 48` block at lines 213–216, the §1 "Economy statics" line 79–80, and the §6
"structurally UNRECOVERABLE" IAP bullet.

**This file supersedes the pass-1 economy survey that previously occupied this path.** Pass 1's
formula findings are re-verified and retained (renumbered E-01…); its **central provenance caveat
was false**, and four of its verdicts (E-08, E-12, E-13, E-18) are corrected below. Pass-1 claim
ids are cross-referenced so nothing is lost.

---

## ⛔ THE PASS-1 PROVENANCE CAVEAT IS DEAD — READ THIS FIRST

Pass 1 opened with:

> *"The web payload is **not decompilable**: `reference/decompiled/shs3_payload/scripts/` holds
> 652 files and **zero** game-logic classes (ColorPicker skins, `hair6000.as`, `foot12000.as`…)"*

**That is wrong.** Measured, this run:

```
$ find reference/decompiled/shs3_payload -name "*.as" | wc -l
    1079
$ ls reference/decompiled/shs3_payload/scripts | grep "§" | wc -l
     612
```

The web v0.717 game logic **is on disk**, decompiled, under SWFDefender's `§1t…s0§` identifier
mangling. String literals, numeric constants, item ids, line numbers and statement order all
survive intact — enough to read every economy formula and to diff it against the Android port
class-for-class, line-for-line. Worked correspondences established this pass:

| system | Android v0.682 | Web v0.717 |
|---|---|---|
| `StatsManager` | `scripts/StatsManager.as` | `scripts/§1t1523s0§.as` |
| `InteractUI` | `scripts/InteractUI.as` | `scripts/§1t401s0§.as` |
| `Item` | `scripts/Item.as` | `scripts/§1t17s0§.as` |
| `NPC` | `scripts/NPC.as` | `scripts/§1t68s0§.as` |
| `XMLItem` | `scripts/XMLItem.as` | `scripts/§1t104s0§.as` |
| `XMLShopItem` | `scripts/XMLShopItem.as` | `scripts/§1t61s0§.as` |
| `PayUI` | `scripts/PayUI.as` | `scripts/§1t410s0§.as` |

**Consequence for the whole gauntlet:** *no lane needs to caveat "this is the Android build" any
more.* Read the web class, diff it against the Android one, and cite the web. Where they differ,
say so — and this pass found that they **do** differ, on economy numbers, by a factor of five.

---

## ⚑ THE HEADLINE — THE PREMIUM CURRENCY IS DENOMINATED 5× DIFFERENTLY BETWEEN BUILDS

The Android bundle is **not** a safe source for any heavenly-gold number. Four independent
measurements, one of them a frame:

| quantity | Android v0.682 | Web v0.717 | ratio |
|---|---:|---:|---|
| gold bought per top IAP tier | 75 (`PayUI.as:131`, $24.99) | 400 (`§1t410s0§.as:140`, 250 KREDS) | ×5.33 |
| gold bought per entry IAP tier | 10 (`PayUI.as:127`, $4.99) | 50 (`§1t410s0§.as:136`, 50 KREDS) | **×5** |
| rebirth payout (normal / 9th) | 5 / 20 (`StatsManager.as:2203-2207`) | 25 / 100 (`§1t1523s0§.as:2644-2652`) | **×5** |
| guest starting gold | 0 (`StatsManager.as:706`) | 3 (`§1t1523s0§.as:1024`) | — |
| **coins per 1 gold converted** | **1000** (`InteractUI.as:923`) | **200** (`§1t401s0§.as:952`) | **÷5** |

The last row is the interlock: web gold is 5× more numerous and each unit buys 1/5 as many coins,
so *purchasing power is identical* — 50 web gold and 10 Android gold both convert to 10,000 coins.
The two builds price the same economy in two denominations.

**And the item price table did not follow.** `reference/extracted/itemdata.xml` is **byte-identical**
to the Android blob `reference/extracted/android/111_Mobile_ItemData.bin` apart from an XML
declaration and a trailing newline (unified diff = 8 lines, all header/EOF). Its entire
`<heavenlyprice>` value domain is `{0,1,2,3,5,8,12,25,100}` (304 rows, tabulated below). **The web
build's on-screen gold prices are five times those values** — proven on a frame in E-02.

> **Rule to carry out of this lane:** the payload's **data XMLs are build-parity** (byte-identical);
> the payload's **AS3 constants are not**. Port `<baseprice>`, `<weight>`, `<modifier>` freely.
> **Multiply every `<heavenlyprice>` by 5** for a v0.717 target, or cite the web AS3 directly.

---

## CLAIMS

### E-01 — the web payload holds the game logic; pass 1's "zero game-logic classes" is refuted (A3/A2)

Cite: `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988` — the web `Item.getSellAmt`,
verbatim:

```
         if(this.§1t467s0§.§1t697s0§() < 3000)
         {
            return 1;
         }
         if(this.§1t545s0§() >= 10)
         {
            return (1 + this.§1t497s0§()) * 10;
         }
```

612 `§…§` classes in that directory; 1079 `.as` files total. **Verdict: HELD.**
*(Overturns the pass-1 preamble, not the ledger.)*

---

### E-02 — ⚠️ **FRAME BEATS PAYLOAD:** the shipped gold prices are 5× the `<heavenlyprice>` rows (A1)

**The standing invariant fires here, and I am saying so out loud: the measurement doc and the
payload row disagree with the frame, and THE FRAME WINS.**

Frame: `reference/videos/Nr4fQstqHDM.mp4` @ **t = 48:04** (video B, v0.717), the premium "BUY"
shop. Extracted at `fps=2` from `-ss 2884`; 1920×1080. Crops used, each upscaled ×4 LANCZOS:

- crop `(380,840)-(580,1030)` — blue gift-box item, badge reads **`60`** + gold-coin icon.
- crop `(390,650)-(940,840)` — **three purple scroll items, each badge `25`** + gold-coin icon.
- crop `(190,270)-(560,450)` — a banknote icon printed **`200`**, badge **`1`** + gold-coin icon.

Visible gold-price set on that one screen: `{1, 5, 10, 15, 25, 60}`.
`reference/extracted/itemdata.xml` `<heavenlyprice>` domain, counted this run:

```
0:1   1:59   2:6   3:191   5:5   8:1   12:39   25:1   100:1     (304 rows)
```

**10, 15 and 60 do not exist in that file at all.** Every observed badge is exactly 5× a value that
*does*: 5=5×1, 10=5×2, 15=5×3, 25=5×5, 60=5×12. The three 25-gold scrolls correspond one-for-one to
the three 5-`<heavenlyprice>` scroll items — `2200` Amnesia Scroll (`:2273`), `2203` Writ of Release
(`:2333`), `2207` Name Change Scroll (`:2385`). The 5/10/15 ladder corresponds to the two triplets
`2100/2101/2102` (Soldier Pills, `<heavenlyprice>` 1/2/3, `:32/:46/:60`) and `2125/2126/2127`
(`<heavenlyprice>` 1/2/3, `:379/:393/:407`).

**Verdict: HELD** — and it invalidates the heavenly-gold column of the pass-1 claim E-09
(*"the whole shop price list is portable today"*). The coin column is portable; the gold column is
off by 5×.

---

### E-03 — the ledger's "Writ of Release 25g" is **CORRECT**, and the payload row that appears to refute it is the wrong denomination (A1)

Ledger sentence: §4 economy Surface — *"Writ of Release 25g now double-confirmed"*.

`reference/extracted/itemdata.xml:2327-2339` says otherwise:

```
	<item>
		<id>2203</id>
		<type>10</type>
		<name>4156</name>
		<unique>1</unique>
		<baseprice>0</baseprice>
		<heavenlyprice>5</heavenlyprice>
```

(`4156` → *"Writ of Release"*, `4157` → *"Use this item to leave your Clan."*, per
`docs/gauntlet/L0/index/resolved_names.json`.) No multiplier is applied anywhere on the read path —
`§1t104s0§.as:92-96` assigns `heavenlyprice` verbatim, `§1t61s0§.as:35` copies it verbatim into the
shop slot.

**The frame in E-02 shows three 25-gold scrolls; the forum record and segment note B-17 (t=48:12)
both say 25 gold. THE FRAME WINS.** The `5` is the Android denomination. A future porter who
"corrects" the ledger to 5 gold would be wrong.

**Verdict: HELD** (ledger upheld; the apparent A2 refutation is a denomination artifact).

---

### E-04 — 1 heavenly gold = **200 coins**, not 1000 (A2 web + A1 frame) — corrects pass-1 E-08

`reference/decompiled/shs3_payload/scripts/§1t401s0§.as:948-959` (web v0.717, `convertgold`):

```
                  §1t1523s0§.§1t9615s0§(1,function():*
                  {
                     §1t88s0§.instance.§1t1516s0§("Snd_goodKoto");
                     §1t1523s0§.§1t9619s0§(200);
                     …
                     §1t3317s0§.instance.§1t1986s0§(4,"convertgold",1);
```

(`"convertgold"` is a surviving string literal — it is the only occurrence in the web bundle, so
the correspondence is exact.) Android `InteractUI.as:918-923` runs the same block with
`StatsManager.changeGold(1000)`. The E-02 frame independently shows the bundle icon printed
**`200`** priced at **1 gold**. Frame and web payload agree; the Android row is the outlier.

Pass-1 E-08 asserted *"the premium↔coin exchange rate is HELD: 1 heavenly gold = 1000 coins"*.
**That number is wrong for the rebuild target.**

**Verdict: HELD (rate = 200).**

---

### E-05 — real-money IAP tiers are **HELD for both builds** — overturns pass-1 E-18 *and* grounds the ledger's Ready bullet (A2)

Ledger sentence grounded: §4 economy Ready — *"IAP tiers"*. Pass 1 marked this **STILL_UNHELD**.

Web v0.717 — `reference/decompiled/shs3_payload/scripts/§1t410s0§.as:136-140` and `:325-329`:

```
         this.goldtext0.text = 50 + " " + §1t1521s0§.getString(64);
         this.goldtext1.text = 125 + " " + §1t1521s0§.getString(64);
         this.goldtext2.text = 200 + " " + §1t1521s0§.getString(64);
         this.goldtext3.text = 275 + " " + §1t1521s0§.getString(64);
         this.goldtext4.text = 400 + " " + §1t1521s0§.getString(64);
…
            this.pricetext0.text = "50 KREDS";
            this.pricetext1.text = "100 KREDS";
            this.pricetext2.text = "150 KREDS";
            this.pricetext3.text = "200 KREDS";
            this.pricetext4.text = "250 KREDS";
```

Two discount ladders ship with it — `discount == 20` → `60/150/240/330/480` gold (`:274-278`),
`discount == 50` → `75/188/300/413/600` gold (`:296-300`).

Android v0.682 — `reference/decompiled/shs3_android/scripts/PayUI.as:127-141`:

```
         this.goldtext0.text = 10 + " " + LangManager.getString(64);
…
         this.goldtext4.text = 75 + " " + LangManager.getString(64);
…
         this.oldpricetext0.pricetext.text = "4.99";
…
         this.oldpricetext4.pricetext.text = "24.99";
```

The whole cash→gold→coin chain is now closed end-to-end: 50 KREDS → 50 gold → 10,000 coins.

**Verdict: HELD.**

---

### E-06 — the premium catalogue blob **is extracted** — overturns pass-1 E-18's second half (A2)

Pass 1: *"`find reference -name "*121*"` returns no such .bin — it was never extracted."* It is on
disk now: `reference/extracted/android/121_Mobile_PremiumData.bin`, 4,504 bytes, plain XML:

```
<?xml version="1.0" encoding="UTF-8"?>
<premiumdata>
<default>
<item>2208</item>
<item>2209</item>
<item>2212</item>
<item>2215</item>
<item>2213</item>
<item>2100</item>
…
 </default>
```

16 permanent premium SKUs, a commented-out `<special>` block (8 ids incl. `2171` "Swords of the
Mist"), and a `<rotation>` list of outfit `<set>`s carrying the **developers' own comments** as
section headers — `<!-- Assassin outfit -->`, `<!-- Dark Assassin outfit -->`, `<!-- Santa outfit -->`,
`<!-- Ichigo outfit -->`, `<!-- Zaraki outfit -->`. Each set names its 6–7 constituent item ids
(e.g. Assassin = `2130, 7034, 4065, 5008, 11036, 12018`), which is a paperdoll-slot manifest for
free. Rotation is hourly: `XMLShopData.as:101` seeds
`ItemGenerator.instance.setRNGSeed(seed * Math.floor(QueryManager.instance.getServerTime()/(60*60)))`.

**Verdict: HELD.** Ledger §6's *"**The dead IAP economy** — design an offline gold faucet"* is
**over-conceded**: the storefront, the catalogue, the rotation rule, the tier table and the exchange
rate all survive. Only the *payment processor* is dead, and `HAS_CASH_PURCHASE=false` already
handles that.

---

### E-07 — rebirth payout: the repo config is **right** and the Android bundle would have corrupted it (A2 web)

Ledger sentence grounded: §4 economy Ready — *"Forge/Reinforce/**Rebirth**/Writ costs"*.

`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2656` (web v0.717):

```
         if(§1t7356s0§(§1t9426s0§) == 8)
         {
            §1t9713s0§(§1t9413s0§,100);
            §1t3318s0§.instance.§1t3409s0§(§1t1521s0§.getString(864,[§1t9765s0§(),"10"]));
         }
         else
         {
            §1t9713s0§(§1t9413s0§,25);
         }
         if(§1t7356s0§(§1t9426s0§) < 9)
         {
            §1t9713s0§(§1t9426s0§,1);
         }
```

`src/config/economy.ts:54` carries `REBIRTH = { earlyGold: 25, tenthGold: 100, … }` — **exact
match**, now upgraded from research-sourced to A2-sourced. The Android build pays **5 / 20**
(`StatsManager.as:2200-2208`); porting from it would have introduced a 5× error into a landed
config. `MAX_DAN_RANK = 10` (`economy.ts:46`) is corroborated twice over: `STAT_DAN` increments only
while `< 9` (0-indexed → 10 ranks), and the announcement string is literally parameterised with
`"10"`.

**Verdict: HELD.**

---

### E-08 — the guest wallet is `100 coins / 3 gold` — the frame-sourced value is confirmed by the web payload; pass-1 E-13 was reading the wrong build (A2 web)

`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:1007` — `initNewPlayer`, wallet block
`:1023-1028`, positionally
identical to Android `StatsManager.as:692-711` (same 21 assignments, same order, same default args
`4017 / 11017 / 12017`):

```
         §1t7357s0§(§1t9412s0§,100);      ← STAT_GOLD    = 100
         §1t7357s0§(§1t9413s0§,3);        ← STAT_HGOLD   = 3
         §1t7357s0§(§1t9414s0§,30);       ← STAT_AP      = 30
         §1t7357s0§(§1t9415s0§,30);       ← STAT_MAXAP   = 30
         §1t7357s0§(§1t9416s0§,20);       ← STAT_DUELTOKENS    = 20
         §1t7357s0§(§1t9417s0§,20);       ← STAT_MAXDUELTOKENS = 20
```

Android sets `STAT_HGOLD` to **0** at the same slot. `src/config/profile.ts:10`'s note
*"(100 coins / 3 gold)"* — an A-00 frame reading — is **confirmed**, and pass 1's flagged
"live contradiction" dissolves. `PROFILE_START_POOLS = { hp: 10, chi: 10, ap: 30 }` also matches
verbatim (HP 10 / MAXHP 10 / CHI 10 / MAXCHI 10 / AP 30).

**Verdict: HELD.**

---

### E-09 — ⚠️ **FRAME BEATS PAYLOAD (again):** duel-token cap is **40**, not 30 — closes blocker ④ and corrects pass-1 E-12 (A1 + A2 web)

Ledger sentence overturned: §4 economy Blockers — *"④ token/tournament economy numbers."*

Frame: same shop screen, `reference/videos/Nr4fQstqHDM.mp4` @ t = 48:04, crop `(1500,130)-(1780,235)`
upscaled ×5 — the HUD reads **`40/40  DUEL TOKENS`** beside a skull icon. Unambiguous at that
magnification.

The Android bundle says 30 (`StatsManager.as:166 MAXDUELTOKENS:int = 30`). **The frame wins** — and
the web payload agrees with the frame. The two constant blocks align slot-for-slot:

| Android `StatsManager.as` | value | Web `§1t1523s0§.as` | value |
|---|---:|---|---:|
| `:158 APINTERVAL` | `60` | `:192` | `60` |
| `:160 DTINTERVAL` | `2 * 60` | `:194` | `2 * 60` |
| `:162 WARMOVEINTERVAL` | `60 * 60` | `:196` | `60 * 60` |
| `:164 MAXQUESTS` | `7` | `:198` | `7` |
| `:166 MAXDUELTOKENS` | **`30`** | `:200` | **`40`** |
| `:168 MAJORCUSTOMCLANTHRESHHOLD` | `40` | `:202` | `40` |

So the token economy is: cap **40**, regen **1 per 120 s** (`DTINTERVAL`), doubled under
`BUFF_DUELTOKENS` (`StatsManager.as:1134-1136`), fresh character starts 20/20. AP regen is
**1 per 60 s** — which also closes world-exploration blocker ④ *"AP regen rate + cap"*. War moves
regen 1 per real hour.

**Verdict: HELD.**

---

### E-10 — sell-price formula: HELD **in the web build**, kills half of blocker ② (A2 web)

Ledger sentence overturned: §4 economy Blockers — *"② sell-price + prosperity-daily-sim formulas."*

Web `§1t17s0§.as:1977-1988` (quoted in E-01) is byte-for-byte the Android `Item.as:1582-1592`:

```
      public function getSellAmt() : int
      {
         if(this.itemID < 3000) { return 1; }
         if(this.getWeight() >= 10) { return (1 + this.getModifierCount()) * 10; }
         return (1 + this.getModifierCount()) * 5;
      }
```

Three consequences a rebuild would otherwise get wrong: **(1)** sell price is completely
independent of `<baseprice>` — any "sell = X% of buy" model is false; **(2)** `ShopUI.as:58`'s
`internal var sellPercentage:Number = 0.5;` is **dead code** (one declaration, zero reads across the
bundle) and is a trap for a porter; **(3)** everything with `itemID < 3000` — every consumable and
material — sells for exactly **1 coin**.

**Verdict: HELD.**

---

### E-11 — Repair-Weapon cost: HELD **in the web build**, kills blocker ③ and a §5 Tier-2 task (A2 web)

Ledger sentence overturned: §4 economy Blockers — *"③ Repair-Weapon cost (never captured)."*
Also kills §5's *"Items/economy session: … read Repair cost"* — no playable build required.

Android `InteractUI.as:1057-1058`:

```
            case "repairweapon":
               cost = StageManager.getCurrentNodeLevel() * 10;
```

Web `§1t401s0§.as:1058` — **the same line number** — `cost = §1t1525s0§.§1t9936s0§() * 10;`. The two
files are the same source with mangled identifiers; the whole `InteractUI` cost table is therefore
web-verified by construction. On success (`:1073`) `if(weapon.uses > 1) weapon.uses = 1;` — repair
resets condition to tier 1, it does not restore to new. Refused for `itemID == 0 || itemID == 13000`
(bare fists / starter blade, `:1066`).

**Verdict: HELD.**

---

### E-12 — coins-per-kill and the XP formula: HELD **in the web build**, kills blocker ① twice (A2 web)

Ledger sentence overturned: §4 economy Blockers — *"① coins-per-kill reality (`=8` is an
**unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."*

**Field mobs** — web `§1t68s0§.as:861-867` (= Android `NPC.as:837-843`):

```
                  §1t406s0§.instance.§1t6488s0§.§1t5846s0§(1 * _loc8_);
               }
               else if(_loc7_ == 1)
               {
                  §1t406s0§.instance.§1t6488s0§.§1t5846s0§(5 * _loc8_);
```

i.e. `<reward><loot>` id **0 = 1 coin × qty**, id **1 = 5 coins × qty**, rolled against `<chance>`.
Those rows are already on disk: `reference/extracted/npcdata.xml` carries 131 `<loot>` blocks over
66 NPCs, and I tabulated every one —

```
(id,qty,chance) → count
(0,5,0.1):42   (0,5,0.05):19   (1,2,0.5):7   (0,2,0.5):5   (0,3,0.5):5   (0,5,0.5):6
(1,1,0.1):1    (1,1,0.5):1     (1,2,1):1     (2,1,1):10    (3,1,0.1):27  (3,1,1):1
(2112,1,0.3):2 (2113,1,0.3):2  (2114,1,0.4):1 (20028,1,0.5):1
```

First row verbatim, `reference/extracted/npcdata.xml:38-44`:

```
		<reward>
			<loot>
				<id>0</id>
				<qty>2</qty>
				<chance>0.5</chance>
			</loot>
		</reward>
```

The commonest field mob therefore yields **0.5 coins per kill in expectation** (10% × 5 × 1c), not 8.

**Duelist/PvP kills** — Android `EnemyPlayer.as:1293-1299`: `addLootCoins(Math.random() * level)`,
gated `if(level <= 10 || int(Math.random()*3) == 0)` — above level 10 the coin drop fires 1 kill in 3.
Global ×1.5 under `BUFF_COINS` (`LootDialog.as:650-656`).

**XP** — web `§1t68s0§.as:188-206` (= Android `NPC.as:166-190`):

```
         if(param2 - param1 > 3) { return 0; }
         var _loc5_:int = param3;
         if(param1 < param2) { _loc5_ = param3 * (1 + 0.05 * (param2 - param1)); }
         else if(param1 > param2) { _loc5_ = param3 * (1 - (param1 - param2) / §1t12069s0§()); }
         if(param4) { _loc5_ *= 2; }
```

with `getGreyLevel()` (`NPC.as:94`: `<6 → 0`; `<40 → L - floor(L/10) - 5`; `<60 → L - floor(L/5) - 1`;
else `L - 9`) and `getZeroDifference()` (`NPC.as:112`, 12-branch ladder `5,6,7,8,9,11,12,13,14,15,16,17`).

**Frame-vs-payload note:** the single filmed `+8 COINS` HUD read is *not* contradicted — at a level-9
duelist, `floor(U[0,1)×9)` spans 0–8, so 8 is the top of the range. What the payload refutes is the
*model* (`KILL_REWARD = { coinsFlat: 8 }`, `src/config/economy.ts:37`, docblocked *"COINS have NO
source formula found"*). **That docblock is now false.** The payload supplies the generator the
frame sampled once.

**Verdict: HELD.**

---

### E-13 — the service-price table is a set of **laws keyed to node level**, and one frame corroborates three of them at once (A2 + A1)

Ledger sentences corrected: §1 line 79-80 — *"inn 8c, toll 7c, stable 14c+5AP … Forge 700c+2 ore,
Reinforce 5000c+1 silver ore"*; §4 Surface — *"Forge 700c (the −70 HUD read is a capture artifact)"*.

All from `reference/decompiled/shs3_android/scripts/InteractUI.as`, all line-matched in the web
`§1t401s0§.as`:

| service | line | cost |
|---|---|---|
| Inn rest | 229 | `getNodeLevel(currentNode) * 2` |
| Stables travel | 241 | `getNodeLevel(currentNode) * 2` |
| Town toll | 1406 | `getNodeLevel(currentNode)` |
| Forge weapon | 1003–1008 | `level = getCurrentNodeLevel(); if(level > 80) level = 80; cost = level * 100;` |
| Repair weapon | 1058 | `getCurrentNodeLevel() * 10` |
| Reinforce weapon | 1083 | `5000` (flat) |

The ledger banked **samples, not laws**. And the samples cross-check the laws: video B's town is a
**level-7 node** (`FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS`, B-10 t=21:02) — so
`toll = 7`✓, `stable = 14`✓, `forge = 7 × 100 = 700`✓. Three filmed constants, one node level, one
formula family. Forge is **not** 700c; it is `min(nodeLevel, 80) × 100`, i.e. up to **8000c**.
Reinforce additionally burns reagent stats 20060–20065 in three level bands (`<30`, `<60`, `60+`).

**Verdict: HELD** (Ready bullet right in substance, wrong in kind for 4 of 6 rows).

---

### E-14 — the **coin-purse cap** is the load-bearing sink, and it appears in no ledger bullet (A2, both builds) — UNDER-CLAIM

Android `StatsManager.as:2632-2651`, web `§1t1523s0§.as:2921-2940` — **identical**:

```
      internal static function getMaxCoins() : int
      {
         switch(getStat(1011))
         {
            case 0: return 1000;   case 1: return 2000;   case 2: return 4000;
            case 3: return 6000;   case 4: return 8000;   case 5: return 10000;
            default: return 1000;
         }
      }
```

`changeGold` **clamps and discards the overflow** (`:2658-2667`; the web variant also floors at 0).
`isCoinPurseFull()` gates both the gold→coin conversion (E-04) and the purse-upgrade purchase
(`ShopUI.as:426-435`). A **1000-coin default cap** against a 5000c Reinforce and an 8000c
max-level Forge *is* the shape of the mid-game grind. The bank (`InteractUI.as:1748 bankDeposit`,
`STAT_COINSINBANK`) is the escape hatch and pays **zero interest**; the item-storage weight it
guards is `100 + STAT_DAN*10 + STAT_PAIDSTORAGE*10` (`BankUI.as:264`), each +10 costing 1 heavenly
gold (`BankUI.as:529-537`).

The ledger's four Ready/Blocker/Surface bullets name none of this.
**Verdict: HELD.**

---

### E-15 — a five-commodity trade-arbitrage loop exists and is in **none** of the ledger's bullets (A2, both builds) — UNDER-CLAIM

Web `§1t401s0§.as:1647-1676` and Android `InteractUI.as:1558-1586` — identical table:

| index | base price | variation |
|---:|---:|---:|
| 0 | 10 | 20 |
| 1 | 20 | 30 |
| 2 | 100 | 15 |
| 3 | 200 | 30 |
| 4 | 200 | 30 |

```
         return price * (100 - variation / 2 + rng.rand(variation)) / 100;
```

Deterministically seeded — Android `new RNG(StageManager.getCurrentNode() * getServerDate() * index)`;
the web expression at `:1676` is `§1t3317s0§.instance.§1t1848s0§() * param1` (two factors, not three).
**That seed difference is unresolved and I am not claiming which is authoritative** — the price
*table* is identical in both. Either way the loop is fully reproducible offline with the project's
injected mulberry32 RNG; no server is needed. `buyGoods`/`sellGoods` write stats 20054–20058.
`GameEngine.as:636` even ships the tutorial tip verbatim: *"Tip: You can make money easily by buying
goods from a market and selling in another town."*

**Verdict: HELD** (new subsystem, absent from the ledger).

---

### E-16 — crop price is a supply-driven oscillator, not the range "5–20c" (A2) — SHARPENS a Ready bullet

Ledger sentence sharpened: §4 Ready — *"crop 5–20c"*.

`InteractUI.as:105` `internal var cropPrices:Array = [10,10,10,10];`, and `:497-501`:

```
         this.cropPrices = [10,10,10,10];
         if(maxCrops != leastCrops)
         {
            this.cropPrices[leastCropsSide] = 20;
            this.cropPrices[maxCropsSide] = 5;
         }
```

Base **10** for all four clans; the clan holding the *fewest* crops pays **20**, the clan holding the
most pays **5**, and if the four are level everyone pays a flat 10. "5–20c" is the envelope; the rule
is a three-point supply signal fed by `getAllCrops` (`:220`). Payout is `count × price` in one lump
(`sellCrop`, `:1544-1548`).

**Verdict: HELD.**

---

### E-17 — quest rewards pay XP and loot, **never coins** — the coin faucet set is closed and enumerable (A2)

Scanned this run over `reference/extracted/questdata.xml`: **386 `<outcome>` blocks, 0 carrying
`<id>11</id>`** (`STAT_GOLD`). The schema *supports* it — `XMLQuestOutcome.as:56-58`:

```
               if(this.id == 11 && this.modify > 0)
               {
                  OverworldHUD.instance.lootDialog.addLootCoins(this.modify);
               }
```

— but no shipped quest uses it. What quests *do* pay: **69 `<reward><exp>` rows** over 10 distinct
values `{100, 200, 250, 290, 500, 600, 750, 1000, 2000, 3000}`, plus 19 `<reward><loot>` rows.

Combined with E-04 / E-12 / E-15 / E-16 the coin faucet set is **closed**: mob loot rolls, duelist
kills, chests, crops, trade goods, item sales, war rank-ups, the daily prize, gold conversion.
The daily-prize table itself is verbatim at `InteractUI.as:1195-1275` — a `Math.random()*36` roll
paying 100c (rolls 0–4) / 200c (5) / 300c (6) / items (7+), a `Math.random()*6` bonus roll every
10th day of a streak paying 1000c on a 0, and a 10-outcome outfit jackpot.

**Verdict: HELD.**

---

### E-18 — War-Room structure costs are HELD as payload rows; the Surface bullet's *"absent from config"* still stands (A2)

`WarHexUIBuildMenu.as:190-208` prints the four build totals verbatim:
`HEX_FORWARDBASE 10000` · `HEX_LADDER 5000` · `HEX_DEFENSE 10000` · `HEX_TOWN 10000` coins.
`WarHexUI.as:1291-1302` and `:1332-1386`: each donation is a flat `buildcost = 500`, deducted with
`changeStat(STAT_GOLD,-500)`, mirrored into `STAT_WARCOINSDONATED`, gated on `STAT_WARMOVES > 0`;
war moves regen 1 per real hour (`WARMOVEINTERVAL = 60*60`). `WarHex.as:424/478/521/541` confirm the
same totals as `maxcost` for the build-progress bar.

`src/config/economy.ts:60` already carries `buildDonationCap: 500` — corroborated. The four totals
are new to the repo, so the Surface bullet *"War-Room structure coin costs absent from config"*
remains **true of the repo**: this is now a port task, not a knowledge gap.

**Verdict: HELD.**

---

### E-19 — Cho-Han betting is **EV-neutral**, so the Ready bullet's "legit non-cash faucet" is wrong in expectation (A2)

Ledger sentence corrected: §4 Ready — *"gold has legit non-cash faucets (rebirth/tournament/**betting**)"*.

`InteractUI.as:1802-1843`:

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

Stake is escrowed on `doBet` (`:1790`); a correct call returns `bet × 2`. Two independent
`floor(U[0,1)×6)` dice give exactly 50/50 parity — Cho-Han is a **zero-expected-value variance
device**, not a gold source. (Rebirth *is* a genuine faucet — E-07.)

**Verdict: HELD.**

---

### E-20 — prosperity daily-sim: taxonomy HELD, magnitudes **STILL UNHELD** (blocker ② survives, narrowed)

`HistoryItem.as:137-311` `dataToString` enumerates every daily-sim event the client can render,
with its sign:

```
               return "merchants robbed by bandits: prosperity -" + val1;
               return getAttackerName(val2) + " attacked town: prosperity -" + val1;
               return "mercenaries upkeep cost: prosperity -" + val1;
               return "town hired ninja: prosperity -1000";
               return "trade with other towns: prosperity +" + val1;
               return "town status (prosperity: " + val4 + ", crops: " + val1 + ", goods: " + val2 + ", defense: " + val3 + ")";
```

Every magnitude except the hard-coded **−1000 ninja hire** arrives as `val1` from the server
(`NetworkManager.as:2042 updateTownProsperity`). The client **renders**; it does not **compute**.
Event set, the four town state variables (prosperity / crops / goods / defense), the 5-tier
prosperity ladder consumed by `DungeonGenerator.as:1363-1555`, and one constant are recoverable.
Tick rates and deltas are not.

**Verdict: PARTIAL** — blocker ② dies for sell-price (E-10), survives narrowed for prosperity.

---

## SCORE

**48 → 82.**

Of the four §4 blockers: ① dies twice (E-12, coins *and* XP), ③ dies outright (E-11), ④ dies
(E-09), ② splits — sell-price dies (E-10), prosperity survives narrowed (E-20). §6's IAP bullet is
over-conceded (E-05, E-06). Of the Ready bullets: "IAP tiers" goes from uncited to fully cited,
"Rebirth costs" is confirmed *and* shown to be corruptible by the wrong build, "betting" is wrong in
expectation, "crop 5–20c" is an envelope not a rule, and four of six "service prices" are formulas.
Two whole subsystems the ledger never mentions are fully held: trade-goods arbitrage (E-15) and the
coin-purse cap ladder that gives the economy its shape (E-14). One ledger claim under apparent
payload attack is **defended** by a frame (E-03, the Writ at 25g).

Not 90+, because: prosperity magnitudes are genuinely server-side (E-20); the trade-goods RNG seed
expression differs between builds and I did not resolve it (E-15); and the 5× premium
redenomination (E-02) means every heavenly-gold figure must be re-derived per build before it is
ported — the item table on disk carries the Android denomination.

---

## HANDOFF — what other lanes must act on

1. **Every lane:** the web v0.717 payload **is** decompiled and readable at
   `reference/decompiled/shs3_payload/scripts/§1t*.as`. Stop caveating "Android build". Diff, then
   cite the web.
2. **items-equipment (L3):** `<baseprice>`/`<weight>`/`<modifier>` port as-is (files are
   byte-identical across builds). **`<heavenlyprice>` does not** — ×5 for a v0.717 target (E-02).
3. **progression:** `src/config/economy.ts:37` `KILL_REWARD = { coinsFlat: 8 }` and its
   *"COINS have NO source formula found"* docblock are refuted (E-12). `REBIRTH` and
   `MAX_DAN_RANK` are confirmed (E-07).
4. **profile:** `src/config/profile.ts:10`'s "(100 coins / 3 gold)" is **confirmed** by the web
   payload (E-08) — seed it.
5. **world-exploration:** AP regen = 1 / 60 s, cap 30 at character creation (E-09) — closes that
   lane's blocker ④ for free.
6. **quests-story:** `questdata.xml` carries 3,307 verbatim `<text>` lines. §6's *"Verbatim
   dialogue … the actual script is gone"* is false on its face. Not my unit; flagging only.
