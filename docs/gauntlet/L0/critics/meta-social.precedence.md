# LENS 3 — PRECEDENCE CRITIC · unit `meta-social`

Blind review. I never saw the surveyor's reasoning — only its 22 claims and the artifacts.
Every verdict below cites an artifact **I** opened.

---

## THE HEADLINE FAILURE MODE

The surveyor found a superb source — `reference/decompiled/shs3_android/` — and then
**treated it as the game.** It is not. It is **clientVersion 0.682**
(`shs3_android/scripts/StatsManager.as:30`).

The target build is **v0.717**, and it is *also fully decompiled in this repo*:

```
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36
      public static var §1t9323s0§:Number = 0.717;
```
652 files. Obfuscated symbol names, identical structure. **The surveyor never opened it in
this pass** — its own first pass did (`§1t7924s0§.as:23`), then the second pass dropped it.

Stage-0b finding S0-3 warned in writing: *"UI copy and combat tuning parity is NOT
established. Label which build any ported string came from."* Eight claims ignore that
warning. I diffed the two builds on every number the lane asserts. **Five diverge.**

| datum | Android v0.682 (surveyor) | **web v0.717 (target)** | where I read v0.717 |
|---|---|---|---|
| rebirth Gold | 5, and 20 at Dan 8 → **60** lifetime | **25, and 100 at Dan 8 → 300** lifetime | `§1t1523s0§.as:2638,2646,2651` + anti-cheat ceiling `§1t406s0§.as:1544` (`> 300`) |
| Duel-Token hard cap | 30 | **40** | `§1t1523s0§.as:200` (`§1t9400s0§ = 40`), stat 15/16 mapping identical |
| daily base roll | `Math.random() * 36` | **`Math.random() * (37 + getLevel())`** | `§1t401s0§.as:1218` |
| daily 10-day bonus | 6 outcomes | **8 outcomes** | `§1t401s0§.as:1588` |
| barricade terrain penalty | `HEX_DEFENSE && cost==0` | **`… && owner != playerside`** | `§1t7785s0§.as:2123` |
| war wave roster | 87 rows | **14 of 87 rows differ** (web late waves carry id `443`) | byte-diff of `bindata/119_1t4646s0.bin` vs `android/109_…bin` |
| starting premium Gold | 0 | **3** | `§1t1523s0§.as:1024` vs `StatsManager.as:706` |

Everything the surveyor read out of the **web** payload (itemdata prices, the 63×72 GIF,
the 351-kill total, the two frames) held up perfectly. Everything read only out of Android
had to be re-checked, and five things broke.

---

## ⛔ FATAL — `meta-social/offline-gold-faucet-exists`

The claim: *"exactly 5 Gold per rebirth and 20 at the Dan 8→9 rebirth — 60 Gold lifetime …
This also contradicts KONGREGATE_FORUM_FINDINGS.md:399 'Rebirthing = 25 FREE Gold' —
**payload over forum memory**."*

**It is backwards.** v0.717's own `doRebirth`:

```as3
// reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638
public static function §1t9600s0§() : *          // doRebirth
   …
   if(§1t7356s0§(§1t9426s0§) == 8)               // getPlayerStats(STAT_DAN) == 8
   {
      §1t9713s0§(§1t9413s0§,100);                // changeStat(STAT_HGOLD, 100)
      …
   }
   else
   {
      §1t9713s0§(§1t9413s0§,25);                 // changeStat(STAT_HGOLD, 25)
   }
```
(`§1t9413s0§ = 12` at :228 — the same STAT_HGOLD id Android uses at `StatsManager.as:194`.)

And the surveyor's own proof-technique — the anti-cheat ceiling — confirms it in v0.717:

```as3
// reference/decompiled/shs3_payload/scripts/§1t406s0§.as:1544   (OverworldHUD)
if(§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9413s0§) > 300 && … §1t9426s0§) < 9)
```
**8 × 25 + 100 = 300.** Android's ceiling is 60 because Android's grant is 5/20.

So the forum was right, and `REBUILD_READINESS.md` §3 item 7 — *"film shows a flat +25 gold
every rebirth"* — was right, and the surveyor retired two correct statements using a build
the recreation is not targeting. This is the exact pattern this lens exists to catch:
**a superseded document being overturned by an even more superseded source.**

Two knock-ons the surveyor also inverted:
- `KONGREGATE_FORUM_FINDINGS.md:308` — *"25 gold every rebirth, rising to 100 on the 9th"* —
  is now **A2-CONFIRMED**, not folklore.
- `REBUILD_READINESS.md` §3 item 7 asks that `tenthGold=100` be downgraded to INFERRED.
  `§1t1523s0§.as:2646` makes it **CONTRACT**. That is a free upgrade the lane missed.

Blocker ④ *is* closed — the surveyor's direction was right. The rate is 25/100/300.

---

## ⚠ MATERIAL — `meta-social/frame-proves-string-table-parity`

The typo is real; I opened the frame and read it myself
(`reference/frames/Nr4fQstqHDM/map/frames/frame_0084.jpg`, 512×288, whole frame ×3 LANCZOS):

> **WAR ROOM RULES 1/7  (JOINING A BATTLE)**
> - THE WAR ROOM IS A CLAN-BASED STRATEGY GAME WITHIN STRAW HAT SAMURAI: DUELS.
> - AFTER JOINING A CLAN, **YOU CAN MAY SELECT** AN ON-GOING BATTLE TO TAKE PART IN.

Matches Android string 370 word for word. But the claim's *conclusion* —
*"proving the Android string table is v0.717's own copy … the calibration artifact for
every Android-sourced string in the lane"* — is **disproved by the same frame**:

```
strings.json 369 = 'War room rules 1/6  (joining a battle)'
strings.json 371 = 'War room rules 2/6  (Turns AND MOVES)'
frame_0084     →  'WAR ROOM RULES 1/7'
```
Both builds render page 1 as `getString(369)` (`§1t7924s0§.as` page block; Android
`WarRules.as`). The **id space** is shared. The **content** is not. **THE FRAME WINS, and I
am saying so out loud:** the Android table is a *sibling* of v0.717's, not a copy, and at
least strings 369 and 371 differ. Treating it as a blanket licence is unsafe — and the five
numeric divergences in the table above are what that licence costs.

---

## ⚠ MATERIAL — `meta-social/two-token-pools-quantified`

`AP 30/30, 1 per 60 s` and `Duel Token 1 per 120 s` and the ×2 buffs all hold in **both**
builds (`§1t1523s0§.as:194-198` = the same 60 / 2·60 / 60·60 block). The **hard cap is wrong**:

```as3
// v0.717 — reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:200
internal static const §1t9400s0§:int = 40;      // MAXDUELTOKENS
```
used exactly as Android uses `MAXDUELTOKENS = 30` (clamp at `:1401/:1405`, `x + "/" + max`
in the shop UI `§1t6519s0§.as:827`). Stat ids are identical in both builds (13 AP, 14 MAXAP,
15 DUELTOKENS, 16 MAXDUELTOKENS).

**The surveyor's own other cite refutes it.** `reference/extracted/itemdata.xml` (WEB v0.717)
item **2127** resolves to **"40 Duel Tokens"** — a refill SKU that would overflow a 30 cap.

---

## ⚠ MATERIAL — `meta-social/daily-reward-table`

*"a 36-outcome base roll … a 6-outcome bonus every 10th consecutive day"* — Android's table.
v0.717's:

```as3
// reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1218   (base roll)
var _loc1_:int = 37 + this.§1t5864s0§.getLevel();
var _loc2_:int = Math.random() * _loc1_;
// :1588   (10-day bonus)
_loc4_ = Math.random() * 8;
```
The base denominator is **level-scaled, 38 → 117**, so the coin/item probabilities the claim
publishes are wrong at every level (5/38 at L1, 5/117 at L80 — not 5/36). The 10-day bonus is
**8** outcomes. The 30-day super bonus (`Math.random() * 10`, `§1t401s0§.as:1535`), the 24 h
cooldown, the streak stats 30018/30019 and the −172800 s grace all match — those parts hold.
The claim also misses a v0.717 gate: the daily prize is only offered at
**level ≥ 3** (`§1t1540s0§.as:854`).

---

## ⚠ MATERIAL — `meta-social/flag-120-is-mislabelled-terrain-row`

Headline **correct and now double-sourced**: `getTerrainModifier` is byte-for-byte the same
switch in v0.717 (`§1t7785s0§.as:2119-2145`), `HEX_CONTROLPOINT` (=3, `§1t416s0§.as:17`)
never appears, deploy is `100 * modifier` (`:1108`) and arrows `80 + Math.random()*40*mod`
(`:1123`). With `TERRAIN_FIELD 0 / FOREST 1 / MOUNTAIN 2` the master-reference rows fall out
exactly: field→mountain −2 → 0.6 → **+60**; mountain→mountain 0 → 1.0 → **+100**;
field→forest −1 → 0.75 → **+75**. "flag +120%" is case 1. Good kill.

The **structure clause is v0.682's**:

```as3
// Android v0.682                    WarHexUI.as:2285
if(selectedHex.hextype == HEX_DEFENSE && selectedHex.cost == 0 || … CITY || … CASTLE)
// web v0.717                        §1t7785s0§.as:2123
if(… == §1t12527s0§ && … .cost == 0 && this.§1t7807s0§.owner != this.§1t7812s0§ || … )
```
v0.717 applies the Barricade `+2` **only to an enemy-owned barricade**. Build the Android
rule and your own completed barricades will penalise your own deploys.

---

## ⚠ MINOR — `meta-social/war-kill-cap-351`

**351 is right and I verified it independently in the WEB file**: `bindata/119_1t4646s0.bin`,
39 `<wave>`, 87 `<enemy>`, Σ`<qty>` = **351** = 340 (4xx block) + 11 (ids 700–710, qty 1 each).
The master reference's "350 (= 340 + 10)" is off by one samurai. The verbatim wave head the
surveyor quoted is exact.

*"identical in the web v0.717 and Android payloads"* is **false**. The files are 11,721 vs
11,553 bytes, different SHA-256, and **14 of 87 enemy rows differ**:

```
row 73  WEB '449|454|449|454|443' qty 3   ANDROID '449|454' qty 3
row 77  WEB '450|455|450|455|443' qty 3   ANDROID '450|455' qty 3
row 81  WEB '451|456|451|456|443' qty 4   ANDROID '451|456' qty 4     (…14 rows)
```
Quantities are identical — which is why 351 survives — but the **roster is not**. The web
late waves add enemy id `443` to the pool. Build the composition from
`bindata/119_1t4646s0.bin`, never from `android/109_…`.

*(Bonus: the desktop binds this directly — `§1t7785s0§.as:13` `§1t12534s0§:Class = §1t4646s0§`,
consumed at `:1860`, with the same 200/400/300/500/600 side remap at `:1882-1898`. That is a
**web** A2 for `survivalmode-is-the-warroom-wave-table`, which the surveyor cited Android-only.
The bindata filename `119_1t4646s0.bin` *is* the class name.)*

---

## HELD — checked and strengthened

| claim | what I opened | note |
|---|---|---|
| `world-board-63x72-byte-identical` | both bins in Python | `GIF89a`, 63×72, 272 B, sha256 `b9d152c046b66b59…`, **identical: True**; palette 2 colours; **735** non-black of 4536. `WarSelectUI.as:83/85/173` reads as quoted. |
| `frame-prints-coordinate-system` | `map/frames/frame_0090.jpg` ×3 | On screen: *KAKUCHI CASTLE TOWN, MAIN STREET / TERRITORY (24,52) SECTOR (3,0)* and *TOWN PROSPERITY: +10*. Exactly as claimed. |
| `four-clans-named-led-located` | strings 271-278, 324-327 | All verbatim. **Stronger cite available:** `PlayerPanel.as:424-439` binds side 1→275 Aka Ryu, 2→276 Midori Ken, 3→277 Aoi Hoiru, 4→278 Ki Sensu *directly* — no colour-order inference needed. |
| `kisensu-domain-typo-in-shipped-data` | strings 324 / 327 | Both say North-East; 325 SE, 326 SW; NW vacant. Real. (Android table — v0.717's copy of 327 unverified, see above.) |
| `rank-ladder-thresholds-and-moves` | `§1t1523s0§.as:198, 1186-1228` | `getWarRank` is **identical** in v0.717 — 36/84/180/324/516/816/1176/1596/2076/5000; `WARMOVEINTERVAL = 60*60`. Android-only cite, but it survives the diff. |
| `structure-costs-and-donation-rate` | `§1t7790s0§.as:195,200,205,210` + `§1t7785s0§.as:1321,1388,1407` | 10000/5000/10000/10000, HQ free, 500 per move — **identical in v0.717**. And the "per turn ≠ per move" point is *confirmed*: `updateWarMoveCounter` refills to `getMaxWarMoves()` (`WarUI.as:530-538`), and string 372 says *"Each turn, every player gets a number of moves based on their rank."* So 500 × 3…6 per turn. Ledger row is understated. |
| `six-actions-understated` | `§1t7785s0§.as` | **10** `useWarMove` sites in v0.717 too (1105, 1197, 1233, 1304, **1334**, 1370, **1493**, 1917, 2391, 2444 — two are the 2-arg form). Count survives. |
| `achievements-61-resolved` | the bin, parsed | 61 `<achievement>`; spot checks exact (0/60000/1 Duelist I; 45/60022/10 Chi Master; 46/60023/9 Ninja Master; 58/60018/340 Warrior III; 60/60025/1 Be Awesome). Frame 0084 even shows *ACHIEVEMENT UNLOCKED — JOIN A CLAN* (id 52). |
| `ninja-services-priced-catalogue` | `itemdata.xml` resolved | All ten spot rows correct off the **WEB** file. Nit: the cited line numbers are the `<item>` open tags, not the `<heavenlyprice>` lines. |
| `chikako-affinity-meter` | `InteractUI_chikako.as:24,26,40`, `StatsManager.as:2722-2723`, `NetworkManager.as:2306` | All quoted lines exact. **v0.717 caveat:** the system exists there (`shs3_fla/InteractUI_chikako_portrait_610.as`, string 723 used at `§1t1540s0§.as:702` and `§1t401s0§.as:628`) but `[0,10,30,60,100,150]` and `maxLevel = 5` do **not** appear in the desktop dump — the ladder numbers are Android-only. |
| `xp-curve-l11-80-recovered` | `§1t1523s0§.as:364` **and** `§1t29s0§.as:28` | The **web v0.717 payload carries the identical 99-entry array.** `[9]=25900, [10]=31400, [79]=4025800`. This retires a §6 "structurally unrecoverable" line with a *web* cite — much stronger than the Android one the surveyor gave. Best claim in the set. |
| `section6-live-clan-war-overbroad` | `§1t7785s0§.as:1108, :1123` | Deploy and arrow formulas confirmed in v0.717. PARTIAL is the right verdict. |

## STILL_UNHELD — all three correct

- **`warroom-board-frame`** — I built the 100-cell contact sheet and looked: quest panel,
  rules dialog, inventory, duels. No hex board. **And I widened it**: the surveyor swept only
  ONE of the two longplays. I built a contact sheet of the second video's map frames
  (`reference/frames/map_analysis/zFtCaTO0_1M_map_006…015`, 10 frames) — skills panel, mining,
  crop harvest, dialogue. Still no board. STILL_UNHELD stands, now over both videos.
  The 240-frame `broad_survey/` set remains unswept — that is the real close-path.
- **`war-rules-page-7-content`** — `strings.json` max numeric id = **9010**; 11016/11017 absent.
  `§1t7924s0§.as:23 max = 7`, page 7 = `getString(11016)/(11017)`. Correct. (v0.717 also calls
  `getString(11142)` at `§1t7785s0§.as:1419` — another >9010 string this lane cannot resolve.)
- **`rival-clan-ai`** — `SHSD_MASTER_REFERENCE.md:177` says it; nothing in either build's
  `War*` classes implements it. Correctly refused.

---

## SCORE

**78 is too high — call it 66–70.** Four load-bearing numbers in the rationale are the wrong
build's, and one of them (the gold faucet) is off by 5× and was used to retire two *correct*
project documents. The topology, achievements, ranks, structure costs, XP curve, the two
frames and the 351 total are all genuinely closed and were closed well.

**Standing rule this lane should adopt:** `shs3_android/` is a **lead**, not the target.
Every number ported from it must be re-read in `reference/decompiled/shs3_payload/` before it
enters a config file. That decompile is 652 files and it has been sitting in the repo the
whole time.
