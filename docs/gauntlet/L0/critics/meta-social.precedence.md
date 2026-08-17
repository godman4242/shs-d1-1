# meta-social — LENS 3 (PRECEDENCE) critic

Blind review. I did not see the surveyor's reasoning. Every verdict below carries an
artifact **I** opened. Commands and crops are reproducible from this file.

**Headline:** the lane is substantively strong — I re-derived 18 of 22 claims first-hand
and they held. But it was sourced almost entirely from the **wrong build**. The repo holds
a **desktop v0.717 decompile at `reference/decompiled/shs3_payload/` (1,079 classes indexed,
652 script files — LARGER than `shs3_android`'s 970/559)**, and it is listed in the lane's own
evidence index (`docs/gauntlet/L0/index/actionscript.json`). The surveyor cited the Android
0.682 decompile throughout and attached a version caveat instead of opening the target build.
Four concrete consequences below, one of which changes a quoted line.

Second failure: the frame search covered **one of the two longplays** and skipped
`reference/frames/map_analysis/` entirely. The 6×6 board the lane says is unpictured is
**visible on screen** in the second longplay.

---

## A. The precedence failure: shs3_payload (v0.717) was on disk and unopened

| # | Android 0.682 (what was cited) | Desktop v0.717 (what the target build says) | Effect |
|---|---|---|---|
| A1 | `WarRules.as:23 max:int = 6` | `§1t7924s0§.as:23 internal var max:int = 7;` + `:121-123 case 7: getString(11016)/(11017)` | **No doc-vs-frame conflict ever existed.** The frame's `1/7` is confirmed by the desktop payload itself. |
| A2 | `WarHexUI.as:2285` barricade guard = `hextype==HEX_DEFENSE && cost==0 \|\| CITY \|\| CASTLE` | `§1t7785s0§.as:2123` adds **`&& this.§1t7807s0§.owner != this.§1t7812s0§`** | The Barricade `+2` applies **only to a hex you do not own** in v0.717. The lane's verbatim quote is the wrong build's. |
| A3 | `StatsManager.as:78 expArray` (99 entries) | `§1t1523s0§.as:364` — **byte-identical head, 99 entries, a[79]=4025800, tail 25395800/29395800** | The XP-curve claim is *stronger* than filed: no Android caveat needed at all. |
| A4 | `StatsManager.as:158/160/162/166` | `§1t1523s0§.as:192=60, :194=2*60, :196=60*60, :264=30` | Token/war-move intervals identical → caveat dischargeable. |

Also verified identical in the desktop build: `§1t7785s0§.as:1321,1388,1407 = 500` (build donation)
and `:1413/1423/1433/1443 = 10000/5000/10000/10000` (structure costs); the terrain switch
`1.5/1.2/1/0.75/0.6/0.5/0.25` and the `>5` sector bound are byte-for-byte the same.

**Not** found in the desktop decompile, after two independent pattern searches over all 652 files:
the rebirth Gold grant (`,20)`/`,5)` on `DAN == 8`) and the `> 60 && DAN < 9` hack check.
That makes claim `offline-gold-faucet-exists` the one place where the Android sourcing is a
live risk, not a formality — mobile IAP tuning is exactly where two builds diverge.

---

## B. New finding: the 6×6 board IS pictured — in the longplay the lane never opened

`warroom-board-frame` is filed STILL_UNHELD and its lane_impact says *"every board claim in
this lane rests on decompiled code plus the on-screen coordinate readout, not on a picture of
the board."* That is false.

- **A1:** `reference/frames/map_analysis/zFtCaTO0_1M_map_013_t565s.jpg` and
  `zFtCaTO0_1M_map_010_t439s.jpg`, crop `(395,20)-(512,125)` upscaled ×10 LANCZOS.
  Visibly on screen: a bordered panel with **column headers `0 1 2 3 4 5`** across the top and
  **row headers `0 1 2 3 4 5`** down the left; cells carrying gate/arch icons, an `X` marker and
  a white player arrow; **white connector lines drawn between adjacent cells** — the exits.
  Below the panel, `TERRITORY (21,51)`.
- **A2 corroboration:** `reference/decompiled/shs3_android/scripts/Territorymap.as:65-75` builds
  exactly `for(i<6){ for(j<6){ new BigmapRoom() … x = i*20-77+28 } }` with N/S/E/W labels, and
  `:501-504` runs A* over the same 6×6.
- **Same board as the war room:** `WarHexUI.as:175-176 this.ht = 6; this.wt = 6;` and `:208-209`
  builds it from `getShiftedNodeId(zeronodeid,i,j)` / `getNodeExitsNum(i,j)` — the *same* node
  grid the Territorymap draws. `WarTerrain.getExitArray()` returns the 4-bit exit mask.

Only the war-room's *hex skin* is unpictured. The 6×6 board, its axis labelling and its exit
topology are on screen. The score deduction that rests on this is not earned.

`reference/frames/map_analysis/` holds 20 frames — 10 from each longplay. The lane's search
(`Nr4fQstqHDM_map_contact.jpg`, 100 cells — I regenerated and read both halves) covered neither.

---

## C. Corrections to individual claims (all re-derived first-hand)

**`war-kill-cap-351` — number right, "identical" wrong.**
I summed the web file myself: 39 `<wave>`, 87 `<enemy>`, **total qty 351**, `{400-block: 340,
700-block: 11 (ids 700–710)}`. The 351 stands and overturns the ledger's 350 and the master
reference's "340 + 10 samurai" (`SHSD_MASTER_REFERENCE.md:170`).
But the two builds are **not** identical:
`sha256 709d94cb28c08ba1 (web, 11,721 B)` vs `b56f8c6a028357c4 (android, 11,553 B)`; normalising
CRLF still leaves **14 differing lines**. The web v0.717 late waves draw from
`<id>449|454|449|454|443</id>` where Android has `<id>449|454</id>` (same for 450|455 and
451|456). Counts match; **enemy mix does not** — NPC 443 is in the web pool and absent from
Android's. A 1:1 build must take the mix from the web file.

**`ninja-services-priced-catalogue` — "12-row" is off by an order of magnitude.**
Every cited row checks out. But `121_Mobile_PremiumData.bin` holds **176 `<item>` rows / 143
unique SKUs**, and all 143 resolve in the **web** `itemdata.xml` with a clean Gold ladder:
1 (consumables, coin packs, clan invite), 3 (all cosmetic equipment), 5 (Amnesia Scroll, Writ of
Release, Name Change, Clan Deed), 12 (30 named outfit bundles — "Assassin Outfit" … "Swords of
the Mist"). The premium economy is 143 SKUs, not 12.

**`frame-proves-string-table-parity` — right reading, wrong framing, over-broad conclusion.**
I reproduced both crops on `frame_0084.jpg` (512×288): `…ES 1/7 (JOINING A BATTLE)` and
`…A CLAN, YOU CAN MAY SELECT AN ON-GOING BATTLE…` are plainly legible. String 370 matches
word-for-word including the typo — good. But **string 369 does *not* match**: it reads
`War room rules 1/6  (joining a battle)`. One string in the same dialog matches and the next
does not, so "the Android string table is v0.717's own copy" is disproved by the claim's own
frame. And invoking the STANDING INVARIANT is theatrical: there is no measurement-vs-frame
conflict here, only a build mismatch, and the **desktop payload agrees with the frame** (A1 above).
Correct calibration: *body copy carries over between builds; page-numbered headers do not.*

**`six-actions-understated` — 10 call sites, not 10 operations.**
The ten `useWarMove(1)` lines are exactly where cited. But they sit in **7 enclosing functions**:
`deployClick` · `spyClick` · `buildClick` ×3 · `startBuild` · `showWarRoomKills` · `moveClick` ·
`createSpawnPointCallBack` ×2. `buildClick`'s three are branches of one operation and
`showWarRoomKills` is a battle-result callback, not a player action. "Anyone implementing the
move economy needs ten operations, not six" is not supported by the artifact.

**`world-board-63x72-byte-identical` — confirmed, one nuance.**
Reproduced: both files 272 B, `sha256 b9d152c046b66b59…`, `identical: True`, 63×72,
**735 non-black of 4536**. The GIF's global colour table declares **4** entries
(`000000 ffffff 666666 999999`); only 2 are *used*. "2 colours" is true of the decoded image,
not of the palette.

**`structure-costs-and-donation-rate` — survives a challenge I expected it to fail.**
`getMaxWarMoves()` looked like a *bank cap*, which would make "500 coins/turn" correct at a
sustained 1 move/hour. It is not: `WarUI.as:535-537` — `if(warmoves != maxmoves)
StatsManager.setStat(STAT_WARMOVES, maxmoves);` — **refills to full each turn**. String 329 is
`" moves a turn"` and string 372 opens *"Each turn, every player gets a number of moves based on
their rank."* So 6 × 500 = 3,000/turn for a War Hero. The correction holds even against
`REBUILD_READINESS.md:246`'s own "moves per turn reconciles as per hour" reconciliation.
Bonus from the same string, missed by lane and ledger alike: **"the clan will pay the player
5 coins per move made."**

**`flag-120-is-mislabelled-terrain-row` — headline correct, quote from the wrong build.**
Verified in **both** builds: the switch is `1.5/1.2/1/0.75/0.6/0.5/0.25`;
`WarTerrain.as:9-13` gives FIELD=0, FOREST=1, MOUNTAIN=2, so the master reference's
+60/+100/+75 are exactly 0.6/1.0/0.75 and the orphan ×1.20 is the `case 1` row.
`HEX_CONTROLPOINT` appears only at `WarHex.as:463` (a description string) and
`WarTerrain.as:71` — never in a modifier. Independent corroboration in string 372:
*"the effect of moves is dependent on the terrain. mountains have the highest tactical advantage,
followed by forests and fields."* The quoted guard, however, is Android's — see A2.

---

## D. Held clean, re-derived first-hand (no correction)

`frame-prints-coordinate-system` (crop `(255,140)-(400,165)` ×12 — `TERRITORY (24,52) SECTOR (3,0)`
and `TOWN PROSPERITY: +10` both legible) · `four-clans-named-led-located` (strings + colours
16711680/39168/26367/16776960) · `kisensu-domain-typo-in-shipped-data` (324 and 327 both
"North-East"; 325 SE, 326 SW; NW vacant) · `two-token-pools-quantified` ·
`chikako-affinity-meter` · `rank-ladder-thresholds-and-moves` (all ten thresholds and all
eleven max-move values read out of `getWarRank`/`getWarMovesToNextRank`/`getMaxWarMoves`) ·
`achievements-61-resolved` (61 rows; ids 0/45/46/53/54/55/58/60 all match) ·
`daily-reward-table` (`var dice:int` at `InteractUI.as:767` makes the 36/10/6 rolls genuine
integer outcome counts; tail confirmed at `dice == 35` → item 2216) ·
`survivalmode-is-the-warroom-wave-table` · `section6-live-clan-war-overbroad` ·
`xp-curve-l11-80-recovered` · `war-rules-page-7-content` (11016/11017 genuinely absent from the
Android table — max id 9010; the ids are **not** invented, they are in the desktop payload) ·
`rival-clan-ai` (`SHSD_MASTER_REFERENCE.md:177` states it; no AI in any `War*.as`/`Territory*.as`).

## E. Score

78 is defensible on substance but two of its three stated deductions do not survive:
the 6×6 board **is** pictured (§B), and the page-7 gap is smaller than filed since the
desktop payload supplies the call site if not the copy. Against that, the lane is one
build off-target throughout (§A) and the premium catalogue is 143 SKUs, not 12 (§C).
Net: roughly a wash. Do not raise the score on this review; re-run the lane against
`reference/decompiled/shs3_payload/` first.
