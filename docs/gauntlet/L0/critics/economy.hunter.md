# economy — HUNTER CRITIC (blind)

Reviewer opened artifacts first-hand. Every verdict below carries the artifact **I**
opened. Frame work: `ffmpeg -ss <t> -i reference/videos/<id>.mp4 -frames:v 1`, then
PIL crop + LANCZOS upscale; crops stated per finding.

**Headline: 16 of 18 claims survive, most of them exactly.** This is a strong survey —
the AS3 sourcing is real, the quotes are verbatim, and the arithmetic checks out. Two
claims are refuted, one of them (`heavenlyprice-is-5x-deflated`) carries a **porting
instruction that would ship a 5× overcharge**. One under-claim is overturned with a new
cite.

---

## A. THE TWO REFUTATIONS

### A1. `economy/heavenlyprice-is-5x-deflated` — REFUTED as stated (material)

The surveyor's frame is real and its tally is exact. I re-extracted t=48:04
(`reference/videos/Nr4fQstqHDM.mp4`, 3950.9 s long so the timestamp exists; my PNG is
byte-identical in size to the scratchpad `t4804.png`, 1 016 704 B) and re-ran the
heavenlyprice tally:

```
heavenlyprice tally [(0,1),(1,59),(2,6),(3,191),(5,5),(8,1),(12,39),(25,1),(100,1)]  304 rows
```

Identical to the surveyor's. Credit where due.

**But the "exactly 5×" law is refuted by the surveyor's own cited evidence.** Its quote
states `Frame price set = {1,5,10,15,25,60}`. Under ×5 the badge `1` requires
`heavenlyprice = 0.2`, which does not exist. The surveyor never reconciled this.

I read all 16 shop tiles myself (crop `(185,260)-(950,1035)`, ×2 LANCZOS) and resolved
each against the premium catalogue:

| tile | item | name | heavenlyprice | frame badge | ratio |
|---|---|---|---|---|---|
| banknote "200" | 2208 | **"1000 coins"** | 1 | **1** | ×1 |
| green/blue "++" | 2209 | Full HP and Chi | 1 | **1** | ×1 |
| 1 grey skull | 2100 | Small Soldier Pill | 1 | 5 | ×5 |
| 2 grey skulls | 2101 | Medium Soldier Pill | 2 | 10 | ×5 |
| 5 grey skulls | 2102 | Large Soldier Pill | 3 | 15 | ×5 |
| 1 gold skull | 2125 | 10 Duel Tokens | 1 | **1** | ×1 |
| gold skulls | 2126 | 25 Duel Tokens | 2 | 10 | ×5 |
| 3 scrolls | 2200/2203/2207 | Amnesia / **Writ** / Name Change | 5 | 25 | ×5 |
| blue gift | 213x | Assassin/Santa/… Outfit | 12 | 60 | ×5 |
| hood, garment | 7034, 4065 | Assassin Hood/Robes | 3 | 15 | ×5 |

**13 of 16 tiles are ×5; three are ×1.** The claim's `lane_impact` instructs L3/L10/L11
that "`<heavenlyprice>` must be MULTIPLIED BY 5". Applied blindly that prices the coin
pack, the full-heal and the 10-token pack at **5 gold instead of 1** — a 5× overcharge on
precisely the impulse items a new player buys first.

There is also **no code path that multiplies**. I checked every candidate:
- `reference/decompiled/shs3_payload/scripts/§1t104s0§.as:92-94` (web XMLItem) —
  `hvalue = param1.heavenlyprice`, verbatim, no scaling.
- `reference/decompiled/shs3_payload/scripts/§1t61s0§.as:33` (web XMLShopItem) —
  copies `itemData.hvalue` straight through.
- `reference/decompiled/shs3_android/scripts/ShopUI.as:421` — `if(getHCost() < itemData.hvalue) reportHack(...)`.
  **`hvalue` is an anti-cheat FLOOR, not the price.** The shipped price may legitimately
  exceed it, which is exactly what the frame shows.

**Correct restatement (keep this, drop the law):** the shipped v0.717 premium prices are
*not derivable from `itemdata.xml` by any single multiplier*. 10, 15 and 60 appear on
film and exist nowhere in the file. Prices must be read **per item from frames**, with ×5
as a working prior for gear/consumables and ×1 for the three currency/utility SKUs.

Minor: "the web and Android itemdata are byte-identical apart from the XML declaration"
is not quite true — after stripping the 40-byte declaration the Android blob is still
2 bytes longer (a trailing newline). Immaterial, but it is not "byte-identical".

### A2. `economy/web-payload-is-decompilable` — HELD in substance, REFUTED in scope (material)

The decompile is real and the counts are right: `find … -name '*.as' | wc -l` = **1079**
(and `payload_export.log` ends "Exported script 1079/1079"); 612 `§`-mangled classes at
the top level of `scripts/`; `getSellAmt` sits at exactly **1977-1988** in
`§1t17s0§.as`. All confirmed.

**The overreach is the headline: "no lane needs to caveat 'this is the Android build' any
more."** That is true for **AS3 only** — which the `lane_impact` says, but the claim text
does not. For **data** it is false, and dangerously so:

- `grep -o 'heavenlyprice' reference/extracted/payload.xml | wc -l` → **1** occurrence in
  329 MB. I dumped its context at offset 19 403 382: it sits in a run of
  `<item>baseprice</item> <item>heavenlyprice</item> <item>minlvl</item>` — the **SWF ABC
  string constant pool**, i.e. the parser's field names. **There is no itemdata table in
  the web payload.** The web build fetched it from the dead Player.IO server.
- `reference/extracted/itemdata.xml` is content-identical to the Android blob
  `reference/extracted/android/111_Mobile_ItemData.bin`.

So all four data XMLs are **Android v0.682 provenance**, and §A1 above is direct proof
that the shipped web economy numbers diverge from them. The S0-3 caveat must stay on
data. Keep the claim, narrow the sentence to "for AS3".

---

## B. UNDER-CLAIM OVERTURNED (hunter lens)

### `economy/prosperity-magnitudes-server-side` — the PARTIAL is right, one clause is wrong

The taxonomy is verbatim-correct (I read `HistoryItem.as` lines 239, 283, 299, 303, 307,
311) and the deltas genuinely are server-side — `QueryManagerBase.as:2259` posts to
`this.server + "/town/updatetownprosperity.php"`. Honest PARTIAL, correctly scored.

But the clause **"Only the −1000 ninja hire is a recoverable constant" is false.** The
whole prosperity **scale** is on disk:

```
reference/decompiled/shs3_android/scripts/TerritoryData.as:782-805
public function getTownLevel() : int
{
   if(this.townProsperity == 0)    { return 0; }
   if(this.townProsperity < 500)   { return 1; }
   if(this.townProsperity < 1000)  { return 2; }
   if(this.townProsperity < 2000)  { return 3; }
   if(this.townProsperity < 4000)  { return 4; }
   return 5;
}
```

Four recovered thresholds — **500 / 1000 / 2000 / 4000** — which anchor the five-tier
ladder the surveyor already found consumed at `DungeonGenerator.as:1363-1555`. This is
the missing units-of-measure: it tells the offline sim that a town spans 0–4000+, and
therefore that the hard-coded `−1000` ninja hire is a **full-tier** shock, not noise.
L11 can now author deltas on a correct absolute scale instead of inventing one.

---

## C. NEW CORROBORATION FOUND FOR A SURVIVING CLAIM

`economy/premium-exchange-rate-200` was already well-sourced; I found a third,
independent leg. Item **2208's own name string is literally "1000 coins"** with desc
"Buy 1000 coins." (`docs/gauntlet/L0/index/resolved_names.json`, Android string table) —
while the **web frame's banknote art reads "200"** and web
`§1t401s0§.as:952` pays `200` where Android `InteractUI.as:923` pays `1000`.

The Android-era *name* survived into the shipped web build unchanged while the *payout*
and the *art* were both rescaled. That is a clean, self-consistent redenomination
signature, and it independently explains §A1: the web build made gold worth 1/5 as many
coins, then raised gear prices ×5 to compensate — and left the three currency/utility
SKUs at their 1-gold price point, cutting 2208's payout instead. The same ×5 shows up in
rebirth (5/20 → 25/100) and in the IAP ladder (10 gold → 50 gold).

---

## D. VERIFIED-EXACT (opened, matched, nothing to add)

| claim | what I checked | result |
|---|---|---|
| `writ-25g-upheld-by-frame` | mapped the 3 purple scrolls to 2200/2203/2207 myself — the only 3 consecutive hp=5 scrolls in the premium `<default>` list | **exact**, survives independently of the ×5 law |
| `duel-token-cap-40` | crop `(1500,130)-(1780,235)` ×5: **"40/40 · DUEL TOKENS"** legible; web `§1t1523s0§.as:200` = 40 vs Android `StatsManager.as:166` = 30, constant blocks align slot-for-slot | **exact**, I saw it |
| `iap-tiers-held-both-builds` | web 50/125/200/275/400; KREDS 50/100/150/200/250; −20% 60/150/240/330/480; −50% 75/188/300/413/600; Android 10/25/40/55/75 @ 4.99–24.99 | **all four ladders verbatim** |
| `premiumdata-blob-is-extracted` | read the 4 504-byte blob; 16 `<default>` SKUs, commented-out `<special>`, 5 named rotation sets, Assassin = 2130/7034/4065/5008/11036/12018 | **exact**; seed rule matches `XMLShopData.as:101-103` |
| `rebirth-payout-config-is-right` | web `§1t1523s0§.as:2644-2652` 100 on DAN==8 else 25; Android 20/5; `src/config/economy.ts` REBIRTH `{earlyGold:25, tenthGold:100}` | **exact** |
| `guest-start-3-gold-confirmed` | web wallet HGOLD **3**, GOLD 100, AP 30/30, DT 20/20; Android `StatsManager.as:706` HGOLD **0** | **exact** |
| `sell-price-formula` | web `§1t17s0§.as:1977-1988` ≡ Android `Item.as:1582-1592`; `sellPercentage` = 1 declaration, **0 reads** | **exact** (nit: paid at `:539`, not `:540`) |
| `repair-weapon-cost` | `InteractUI.as:1058` `getCurrentNodeLevel()*10`; uses→1 at `:1073`; refused for 0/13000 at `:1066` | **exact** |
| `coins-per-kill-and-xp` | loot id 0→`1*qty`, id 1→`5*qty` (`NPC.as:839/843`); `calcXP` complete at `:166-190`; duelists `Math.random()*level` (`EnemyPlayer.as:1298`) | **exact**; `KILL_REWARD={coinsFlat:8}` + its "no source formula found" docblock are both correctly refuted |
| `service-prices-are-formulas` | inn `:229` ×2, stables `:241` ×2, toll `:1406` ×1, forge `:1003-1008` `min(lvl,80)*100`, repair ×10, reinforce flat 5000 | **all six exact** — see caveat below |
| `coin-purse-cap-ladder` | `StatsManager.as:2632-2667` 1000/2000/4000/6000/8000/10000 + `changeGold` clamp; `BankUI.as:264` `100 + DAN*10 + PAIDSTORAGE*10` | **exact** |
| `trade-goods-arbitrage-loop` | table 0→(10,20) 1→(20,30) 2→(100,15) 3→(200,30) 4→(200,30) in both; Android seed has 3 factors, web `:1676` has 2 | **exact**, and the flagged divergence is **real** — honest PARTIAL |
| `crop-price-is-supply-oscillator` | `InteractUI.as:497-501` `[10,10,10,10]`, least→20, max→5; payout `count*price` `:1548` | **exact** |
| `quests-never-pay-coins` | my own scan: **386** `<outcome>` blocks, **0** with `<id>11</id>`; **69** exp rows, distinct = {100,200,250,290,500,600,750,1000,2000,3000} | **exact, all three numbers** |
| `war-room-structure-costs` | `WarHexUIBuildMenu.as:192/197/202/207` = 10000/5000/10000/10000; `WarHexUI.as:1332` buildcost 500; `WARMOVEINTERVAL 60*60` | **exact** |
| `cho-han-is-ev-neutral` | two `Math.random()*6`, `(d1+d2)%2`, win pays `bet*2` on an escrowed stake → parity exactly 50/50, EV 0 | **exact, math sound** |

### Caveat on `service-prices-are-formulas` (not a refutation)

The AS3 half is fully verified — that is the load-bearing part, and it stands. The
**frame sub-cite did not resolve**: "B-10 t=21:02" in `zFtCaTO0_1M.mp4`. I pulled global
t=1262 s (a town, quest banner "HEALTH FOR YOKO", no dialogue box) and built a 44-frame
contact sheet of `reference/frames/zFtCaTO0_1M/seg-10/frames/` (field combat throughout).
Neither shows a forge dialogue.

The wording is nonetheless genuine — the string table carries the template verbatim:

```
Forge an iron sword (level [0])?&#10;Cost: [1] coins&#10;Materials …
```

Both level and cost are **parameters**, which is itself independent proof that forge cost
is a formula rather than the ledger's 700c constant. **Action: re-cite the frame or drop
the sub-cite; do not drop the claim.**

---

## E. SCORE

**82 is roughly right; I would hold it at 78–80.** The survey is well-sourced and the
bulk of it is exact. The deduction is for the ×5 law being stated as fact and converted
into a blanket porting instruction, plus the "no Android caveat" headline — both are the
kind of confident over-generalisation that ships bugs downstream, and both were
falsifiable from evidence the surveyor had already quoted.
