# CRITIC — unit `economy` — LENS 3 (PRECEDENCE / stale-claiming)

**Run:** 2026-08-15 · blind review of the 19-claim `economy` survey scored **82**.
**Supersedes** the 2026-08-13 precedence review at this path (committed `c3ea839`;
recover with `git show c3ea839:docs/gauntlet/L0/critics/economy.precedence.md`).
Its R1/R3/R4 findings are re-verified first-hand below and are load-bearing here.

Every verdict carries an artifact **I** opened. Frames are stated with the exact
crop and upscale. I extracted my own stills from `reference/videos/` with `ffmpeg`
(1920×1080) and separately used the 1024×576 stills already in
`reference/frames/*/seg-NN/frames/`.

---

## HEADLINE

This is the **most accurate payload survey I have reviewed on this board.** I
re-derived 14 of its A2 cites and they land on the exact line, including four
mangled-class line numbers in the web bundle. Its frame work is real: I re-cut its
three stated crops from `Nr4fQstqHDM.mp4` at t=48:04 and every glyph it reported is
there. Nothing here is invented except where noted in R5.

It nevertheless fails the precedence lens twice, fatally, in the same way both
times: **it re-asserts, as new, two claims that a prior critic killed at this exact
path on 2026-08-13** — and it retires a §0 standing caveat it has no authority to
retire, on a premise I can positively disprove.

Net: the economy is in far better shape than 48. It is not in 82 shape, because
82 is priced on a coin-faucet set that is not closed and an Android caveat that
cannot be dropped. **Recommended score: 74.**

---

## THE CENTRAL FINDING — R1 (fatal): the web build ships NO game data at all

`economy/web-payload-is-decompilable` concludes: *"so no lane needs to caveat 'this
is the Android build' any more."* Its own `lane_impact` narrows this to AS3. **The
text is what ships, and the text is false and dangerous.**

The AS3 half is true and I verified it: `find reference/decompiled/shs3_payload
-name '*.as' | wc -l` → **1079**; `ls reference/decompiled/shs3_payload/scripts |
grep -c '^§'` → **612**; and `§1t17s0§.as:1977` really is the web `getSellAmt`.

But the four data XMLs are a different question, and the answer is the opposite.

**Proof 1 — the web payload's own binary blobs.** I printed the first 60 bytes of
all 27 files in `reference/extracted/bindata/`. Nineteen are `<animdata>`, one is
`<survivalmodedata>`, one is room-object defs, five are name-generator word lists,
one is a GIF89a. **There is no item, skill, npc or quest data among them.**

**Proof 2 — the payload dump.** `reference/extracted/payload.xml` (329 MB) contains
the literal `heavenlyprice` exactly **once**, at byte offset **19403382**, and
`itemdata` exactly **once**, at **19503662** — both inside an AS3 *string constant
pool*, listed between `baseprice` and `minlvl`, i.e. tag names the client uses to
**parse XML it receives**. No rows. The web build fetched its data from the dead
Player.IO backend.

**Proof 3 — the files are Android byte-for-byte.** All four:

```
diff reference/extracted/itemdata.xml   reference/extracted/android/111_Mobile_ItemData.bin  → only the <?xml?> line + trailing NL
diff reference/extracted/skilldata.xml  reference/extracted/android/117_Mobile_SkillData.bin → same
diff reference/extracted/npcdata.xml    reference/extracted/android/125_Mobile_NpcData.bin   → same
diff reference/extracted/questdata.xml  reference/extracted/android/116_Mobile_QuestData.bin → trailing NL only
```

**Proof 4 — the shipped web content demonstrably differs from those rows.** Item
`2208` is named **"1000 coins"** in the on-disk table and Android
`InteractUI.as:923` pays `changeGold(1000)`; the web frame at t=48:04 shows that
same SKU as a banknote printed **"200"** and web `§1t401s0§.as:952` pays `(200)`.

**Proof 5 — strings on film that the Android table does not contain.** The t=48:04
detail panel reads `TRAINING GARMENT` / `SOUL-INFUSED`. Decoding
`reference/extracted/android/118_Mobile_Lang_EN.bin` as UTF-16LE gives **0 hits**
for `Soul-Infused` and **0** for `Training Garment` (11 hits for `Garment`, none
of them that item).

**Proof 6 — a reward channel the on-disk quests do not have.**
`QuestLogUI.as:463-465` renders `lootType == 50007` as `townProsperityReward`, and
a web frame shows `TOWN PROSPERITY: +5` on a quest reward panel (see R2). The
string `50007` appears **0 times** in `reference/extracted/questdata.xml`.

**Consequence.** §0's standing S0-3 caveat — *"this is the ANDROID build,
clientVersion 0.682 … combat tuning parity is NOT established. Label which build
any ported string came from"* — is not merely still alive, it is now **proven
necessary**: we hold no web-side copy of any data table, so parity can never be
established by diff, only by frame. Retiring it repo-wide on the strength of an
AS3 decompile would license L1/L3/L4/L5/L10/L11 to port 982 items, 75 skills, 495
NPCs and 61 quests as if they were v0.717. They are not.

Note the internal contradiction this creates: the survey's **own** claim 2 needs
the on-disk heavenlyprice rows to be *wrong for the web build by 5×*. Claim 1 says
the Android caveat is retired. They cannot both stand. Claim 2 is the one that is
right.

**Also strike** claim 2's supporting sentence *"the web and Android itemdata are
byte-identical apart from the XML declaration"* and the instruction it carries,
*"`<baseprice>`/`<weight>`/`<modifier>` port as-is."* There is no web itemdata to
be identical to. Given that this very item table's premium prices, one SKU's
payout, and the IAP ladder all diverge 5× between builds, "port as-is" is an
unsafe default dressed as a verified one. Port them **labelled 0.682-sourced**.

---

## R2 (fatal) — `economy/quests-never-pay-coins` is a verbatim re-import of a claim killed on 2026-08-13

The claim: *"No shipped quest pays coins … so the coin faucet set is closed and
enumerable."* The 2026-08-13 review at this path killed this as **R1 · FATAL**.
It is back, same reasoning, same wrong element scanned.

**My own A1.** `reference/frames/zFtCaTO0_1M/seg-29/frames/frame_0013.jpg`, crop
`(490,340)-(760,460)` upscaled **×5 LANCZOS**. I opened it. It reads, verbatim:

```
REWARD
250 XP
30 COINS
TOWN PROSPERITY: +5
```

**My own A2, three ways.**

1. `reference/extracted/questdata.xml:4162-4168` — the shipped quest *"Turn in
   Inokichi's Club at the Bounty Board"*:
   ```xml
   <reward>
     <exp>750</exp>
     <loot><id>0</id><qty>30</qty><chance>1</chance></loot>
   ```
2. `QuestLogUI.as:457` `coinReward += qty;` · `:461` `coinReward += 5 * qty;` ·
   `:494` `rewardStr += coinReward + " coins\n";` — the client literally prints
   "N coins" into the quest reward panel.
3. **The survey refutes itself.** Its own claim `economy/coins-per-kill-and-xp`
   establishes that `<reward><loot><id>0</id>` = 1 coin × qty. Claim 16 then scans
   only `<outcome><id>11</id>` — a different element — and concludes the channel
   does not exist. The 386-outcome scan is *correct* (I re-ran it: 386 blocks, 0
   with `<id>11</id>`, and 69 `<exp>` rows over exactly the 10 values it lists).
   It is correct about the wrong element.

**Consequence.** Quest coins are a faucet, they are the one the survey omits, and
at +30/+35 they are the **largest single early-game payout** — bigger than a
duelist kill's `floor(U[0,1)×level)` and 60× the commonest mob's 0.5-coin
expectation, which this same survey computes. `lane_impact`'s *"the faucet set
closes"* is backwards. Re-open the enumeration.

---

## R3 (material) — `economy/duel-token-cap-40` re-closes an AP cap that a frame already refuted

The cap-40 core is **right and I confirm it twice over**:

- **A1, mine.** `ffmpeg -ss 2884 -i reference/videos/Nr4fQstqHDM.mp4`, crop
  `(1500,130)-(1780,235)` ×5 LANCZOS: a white skull in a green diamond beside a
  bordered field reading **`40/40`**, captioned **`DUEL TOKENS`**. Exactly the
  survey's stated crop; exactly what it reported.
- **A2, mine.** `§1t1523s0§.as:200` = `40` where `StatsManager.as:166` =
  `MAXDUELTOKENS:int = 30`, with the four preceding constants aligned slot-for-slot
  (`60`, `2*60`, `60*60`, `7`). THE FRAME WINS and the payload agrees with it.

The failure is in `lane_impact`: *"L9 (WORLD) gets AP regen = 1 per 60 s free,
closing world-exploration blocker ④ 'AP regen rate + cap'."* It supplies a regen
rate and declares a **cap** closed without measuring one.

**My own A1.** `reference/frames/Nr4fQstqHDM/seg-28/frames/frame_0007.jpg`, crop
`(470,110)-(780,290)` ×4 LANCZOS — the character-summary tab:

```
HP   20 / 30
CHI  47 / 47
AP   30 / 40
```

**AP max is 40.** `setPlayerStats(STAT_MAXAP,30)` is a level-1 creation initial —
the same status as `STAT_MAXHP,10` two lines above it, which this same frame shows
at **30**. Blocker ④'s cap half is not closed; it is worse than open, because a
wrong number now has a citation attached. This is the identical error the
2026-08-13 review killed as R3, with the identical frame available.

**Second half-kill in the same claim.** Blocker ④ reads "token/**tournament**
economy numbers." The 2026-08-13 review reported `grep -rli tournament
reference/decompiled/shs3_android/scripts/` → **0 files** and called the tournament
half untouched. That is still true of Android — but **not of the web bundle the
survey itself just proved is decompiled**:

```
grep -rli tournament reference/decompiled/shs3_payload/scripts/  →  5 files
```

`§1t7144s0§.as` is a full tournament UI with its member names unmangled —
`notournamenttext`, `tournamentCreate`, `tournamentdetailstext`,
`tournamenttitletext`. **Tournament is a web-only system** (further corroborating
R1), and blocker ④'s tournament half is now *openable* rather than dead. The
survey held the key — claim 1 — and did not turn it.

---

## R4 (minor) — `economy/service-prices-are-formulas` cites a measurement doc where a frame exists

The six formulas are **exactly right** and I re-read every one:
`InteractUI.as:1003-1008` forge `min(level,80)*100` · `:1057` repair
`nodeLevel*10` · `:229` inn and `:241` stables `getNodeLevel(...)*2` · `:1406` toll
`getNodeLevel(...)` · `:1083` reinforce flat `5000`. Web line-parity holds:
`§1t401s0§.as:1058` = `§1t1525s0§.§1t9936s0§() * 10`.

The corroboration cite does not hold. It reads: *"Video B's town is a level-7 node
(B-10 t=21:02 dialogue: 'FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS')."*

- That sentence is not a frame. It is
  `docs/research/video-study/segments/B-10-town-investigation-inn-rest-blacksmith.md:22`,
  a measurement doc, quoted second-hand.
- **A frame exists** and settles it directly — it was already opened and logged in
  `docs/gauntlet/L0/verdicts.json:459`. §0: *"Citing a measurement doc second-hand
  when a frame exists is REFUTED."*
- The timestamp does not resolve. I extracted `zFtCaTO0_1M.mp4` at t=21:02
  (`-ss 1262`): a town street, quest banner `HEALTH FOR YOKO`, `TERRITORY (22,5)`,
  `SECTOR (2,4)`. No blacksmith dialogue. "B-10" is a segment of *Nr4fQstqHDM* —
  the same video the survey calls its t=48:04 source — so "Video B" is being used
  for both films.

**The fact is true; take the right cite.** Mine:
`reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0040.jpg`, crop `(0,380)-(700,576)`
×2 LANCZOS — `BLACKSMITH / FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS /
MATERIALS NEEDED: 2 IRON ORE`. Node level 7 → toll 7, inn/stable 14, forge 700. ✓

While here: the ledger sentence being overturned is
`REBUILD_READINESS.md:216` — *"Forge 700c (the −70 HUD read is a capture
artifact)"*. The survey kills the "700c constant" half and leaves the "capture
artifact" half standing, though `verdicts.json:452-453` already resolved it: the
−70 is the **repair** charge on the same level-7 node, `7 × 10 = 70`, exact. Both
halves of that ledger line are dead; say so.

---

## R5 (material) — `economy/coins-per-kill-and-xp` asserts a filmed OG artifact that does not exist

The A2 body is excellent and I verified all of it: web `§1t68s0§.as:863-867`
(`1 * _loc8_` / `5 * _loc8_`), calcXP at `:188-206` with both helper curves, the
duelist path at `EnemyPlayer.as:1296-1298` (`addLootCoins(Math.random() * level)`
gated by `level <= 10 || int(Math.random()*3) == 0`), and the loot tally — I
re-derived it independently and got the survey's numbers **exactly**: 131 `<loot>`
blocks over 66 of 495 NPCs, `(0,5,0.1)×42`, `(3,1,0.1)×27`, `(0,5,0.05)×19`,
`(2,1,1)×10`, `(1,2,0.5)×7`, `(0,5,0.5)×6`, `(0,2,0.5)×5`, `(0,3,0.5)×5`.

Then `lane_impact` says: *"the filmed +8 is the top of the duelist range
floor(U[0,1)×9), so the frame stands and only the flat-constant MODEL falls."*

**There is no such frame.** The repo says so in its own words —
`src/config/economy.ts:27-31`:

```
 * Our +10/+8 was an INFERRED seed verified only against OUR OWN build's
 * screenshots; it was never an OG measurement, so the Stage-2 gate row that
 * reads "+10 XP / +8 COINS" is updated rather than left silently false.
```

The "+8" is **this repo's own Stage-2 victory screen**, not one of §0's five
admissible classes. Calling it "the filmed +8" manufactures an OG artifact, and
§0 is explicit that a fabricated cite is the worst outcome available. This is the
third verbatim re-import of a 2026-08-13 kill (that review's R4).

Strike the clause. The claim survives on A2 with **no** frame corroboration in
either direction, which is the honest position.

---

## R6 (minor) — `economy/prosperity-magnitudes-server-side` under-counts what is recoverable

The taxonomy is verbatim-correct; I read every quoted line in `HistoryItem.as`
(`:239`, `:283`, `:299`, `:303`, `:307`, `:311`) and `NetworkManager.as:2042`. The
PARTIAL verdict is the right shape and the honest one.

But the enumeration *"Only the −1000 ninja hire is a recoverable constant"* is a
universal statement and it is false. Two lines the survey did not quote:

- `HistoryItem.as:373` — `"Players changed prosperity through quests by " + val1`
- `QuestLogUI.as:463-465` — `else if(lootType == 50007) { townProsperityReward += qty; }`

and my own frame (R2 above) shows a quest paying **`TOWN PROSPERITY: +5`**. So the
quest→prosperity channel is a second recoverable magnitude class, client-side,
per-quest, and on film. Its per-quest values are *not* in our artifacts (0 hits for
`50007` in the 0.682 questdata — see R1 Proof 6), so the correct statement is:
**two** channels recoverable in kind, the ninja constant recoverable in value, the
daily-sim deltas genuinely server-side.

---

## A. WHAT I COULD NOT BREAK — and one place the survey undersold itself

Verified first-hand, on the line, no correction:

| claim | what I re-derived |
|---|---|
| `heavenlyprice-is-5x-deflated` | heavenlyprice tally **exact**: `0:1 1:59 2:6 3:191 5:5 8:1 12:39 25:1 100:1`, 304 rows. My crops `(380,840)-(580,1030)` ×4 → blue gift **60**; `(390,650)-(940,840)` ×3 → three purple scrolls **25/25/25**. 10, 15, 60 absent from the file. |
| `writ-25g-upheld-by-frame` | `itemdata.xml:2327-2339` item 2203 `<heavenlyprice>5</heavenlyprice>`. Rationale is *more* right than stated — per R1 the file simply **is** Android data. |
| `premium-exchange-rate-200` | web `§1t401s0§.as:952` `(200)` under the `"convertgold"` literal at `:959`; Android `InteractUI.as:923` `changeGold(1000)`. |
| `iap-tiers-held-both-builds` | web `:136-140` 50/125/200/275/400 · `:274-278` 60/150/240/330/480 · `:296-300` 75/188/300/413/600 · `:325-329` "50…250 KREDS"; Android `:127-131` 10/25/40/55/75, `:138-142` 4.99…24.99. |
| `premiumdata-blob-is-extracted` | catted all 4,504 bytes. 16 defaults, commented `<special>`, 23 named rotation sets; Assassin = 2130/7034/4065/5008/11036/12018. |
| `rebirth-payout-config-is-right` | web `:2644-2652` 100/25 vs Android `:2200-2208` 20/5. |
| `guest-start-3-gold-confirmed` | web `:1007` initNewPlayer, `:1023-1028` = 100/3/30/30/20/20 vs Android `:705-710` HGOLD **0**. |
| `sell-price-formula` | web `§1t17s0§.as:1977-1988`, Android `Item.as:1582-1592`, character-for-character identical. |
| `repair-weapon-cost` | Android `:1057`, web `§1t401s0§.as:1058` — the same line number, as claimed. |
| `coin-purse-cap-ladder` | Android `:2632-2667`, web `§1t1523s0§.as:2921-2940` — ladder and `changeGold` clamp identical. |
| `trade-goods-arbitrage-loop` | both price tables and the return expression verbatim. Honest PARTIAL — see the resolution I owe it, below. |
| `crop-price-is-supply-oscillator` | `InteractUI.as:103` and `:497-501` verbatim. |
| `war-room-structure-costs` | `WarHexUIBuildMenu.as:192/197/202/207` = 10000/5000/10000/10000; `WarHexUI.as:1332` `buildcost:int = 500`. |
| `cho-han-is-ev-neutral` | `:1811-1812`, `:1823`, `:1832-1834`, and the escrow at `doBet` `:1790-1797` (`changeStat(STAT_GOLD,-num)`). EV = 0. |
| `quests-never-pay-coins` (scan half) | 386 outcomes, 0 with `<id>11</id>`, 69 `<exp>` rows over exactly the 10 stated values. Correct scan, wrong element. |

**Where it undersold itself.** Claim 2 argues the 5× redenomination from
icon-matching a frame against a payload table — good work, but it is an inference.
The survey **already held an A2 proof and did not notice**. Its own claim 5 quotes
both IAP ladders:

```
Android PayUI.as:127-131   10   25   40   55   75  gold
web  §1t410s0§.as:136-140  50  125  200  275  400  gold
```

**Exactly ×5, five for five, code-to-code, no frame needed.** And rebirth is a
third independent instance: 25/100 web vs 5/20 Android — ×5 twice more. The chain
closes on itself: 50 KREDS → 50 web gold → 10,000 coins at 200/gold; 10 Android
gold → 10,000 coins at 1000/gold. **Same real value, five-for-one unit split.** The
5× rule should be banked at A2 with three independent code witnesses, not at A1 by
icon inference. That is a genuine strengthening of the survey's best claim.

---

## B. ONE OPEN ITEM THE SURVEY FLAGGED HONESTLY — now resolved by one factor

`trade-goods-arbitrage-loop` says: *"the web expression at :1676 is
`§1t3317s0§.instance.§1t1848s0§() * param1` (two factors, not three) — I did NOT
resolve which is authoritative."* Flagging that was the right call. Here is the
factor:

```
Android InteractUI.as:1562  new RNG(StageManager.getCurrentNode() * QueryManager.instance.getServerDate() * index)
web     §1t401s0§.as:1676   _loc4_ = §1t3317s0§.instance.§1t1848s0§() * param1;
```

`§1t3317s0§` is QueryManager (it carries `saveModifiedCharData` and
`reportPremiumBuy(4,"convertgold",1)` in the block I verified for claim 4), so
`§1t1848s0§()` is `getServerDate()`. **The web seed drops `getCurrentNode()`.**

Taken literally that makes every town quote the same price for a given commodity
on a given day — which would flatly contradict `GameEngine.as:636`'s own tip
(*"buy goods from a market and sell in another town"*) and kill the arbitrage
premise. Either the web build applies the node offset at a call site I have not
found, or the loop works differently in v0.717. **I am not resolving it either** —
but the open question is now one named factor wide, not "the expressions differ",
and `lane_impact`'s *"fully reproducible offline, no server needed"* is premature
for a web target until someone reads the call site.

---

## C. SCORE

| | |
|---|---|
| Survey's score | **82** |
| Fatal | R1 (Android caveat retired on a false premise) · R2 (quest coins, re-import) |
| Material | R3 (AP cap re-closed; tournament half) · R5 (fabricated "filmed +8") |
| Minor | R4 (mis-cited frame) · R6 (prosperity enumeration) |
| Credit | 14 claims verified on the line; 5× redenomination upgradeable to A2 |
| **My score** | **74** |

Three of the six breaks are re-imports of kills already logged **at this exact
path** on 2026-08-13. That is the precedence lens's whole thesis, and it is the
one thing the next pass must fix before anything else: **read the critic file for
your own unit before you write the survey.**
