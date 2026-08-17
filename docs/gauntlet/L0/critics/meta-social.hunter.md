# meta-social — HUNTER CRITIC (blind)

Reviewed 22 claims. **19 survive. 3 are refuted.** One refutation is fatal.

Every verdict below cites an artifact **I** opened. Commands and crops are pasted.

---

## THE HEADLINE: the surveyor read the wrong build, and it never looked

Two systemic failures produced all three refutations, and both are fixable in one pass:

1. **It never opened the WEB v0.717 decompile.** `reference/decompiled/shs3_payload/scripts/`
   holds 652 classes — the actual v0.717 desktop build, obfuscated but complete. Every war-room
   claim in this unit was sourced from `shs3_android` (clientVersion 0.682) and carried an
   Android caveat that was mostly unnecessary — and, in one case, concealed a 5× numeric error.
   The map: `§1t7785s0§.as` = WarHexUI · `§1t1523s0§.as` = StatsManager · `§1t7924s0§.as` = WarRules ·
   `§1t406s0§.as` = OverworldHUD.
2. **It searched one of the two longplays.** It checked `Nr4fQstqHDM/map/` (100 frames) and declared
   a board frame nonexistent. There are **7,364** frames, including a whole second longplay
   (`zFtCaTO0_1M`) and **2,475** `seg-*` frames. `seg-29` is a **War Room segment**. The board is
   on screen, twice, plus the rules dialog at page 3/7 and the rank ladder rendered live.

---

## R1 — FATAL · `meta-social/offline-gold-faucet-exists`

**The rebirth faucet is 25 / 100 in v0.717, not 5 / 20. The lifetime ceiling is 300 Gold, not 60.
And the forum source the claim discredits was right all along.**

WEB v0.717 — `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638-2656`:

```
2638   public static function §1t9600s0§() : *
2643      §1t9712s0§(§1t8755s0§,0);              // STAT_XP(9) = 0
2644      if(§1t7356s0§(§1t9426s0§) == 8)        // STAT_DAN(25) == 8
2646         §1t9713s0§(§1t9413s0§,100);         // STAT_HGOLD(12) += 100
2649      else
2651         §1t9713s0§(§1t9413s0§,25);          // STAT_HGOLD(12) += 25
2653      if(§1t7356s0§(§1t9426s0§) < 9)
2655         §1t9713s0§(§1t9426s0§,1);
```

Constant identity proven in the same file — `:222 §1t8755s0§ = 9` (STAT_XP), `:228 §1t9413s0§ = 12`
(STAT_HGOLD), `:254 §1t9426s0§ = 25` (STAT_DAN) — the same numeric stat ids as Android
(`shs3_android/scripts/StatsManager.as:194 STAT_HGOLD:int = 12`, `:220 STAT_DAN:int = 25`).

And the paid-player test the claim leans on, in the WEB build —
`reference/decompiled/shs3_payload/scripts/§1t406s0§.as:1544`:

```
if(§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9413s0§) > 300 && §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9426s0§) < 9)
```

**300**, not 60. And 8 × 25 + 100 = 300 exactly — the same internal-consistency argument the claim
made for 60, pointing at a different number.

The Android lines the claim quotes (`StatsManager.as:2203 changeStat(STAT_HGOLD,20)` / `:2207 …,5`
and `OverworldHUD.as:1333 … > 60 && … DAN < 9`) are real — I read them. They are the **mobile
rebalance**, exactly one fifth of desktop.

**Worse, the claim inverts a correct source.** It says the payload "contradicts
`docs/research/KONGREGATE_FORUM_FINDINGS.md:399 'Rebirthing = 25 FREE Gold'` — payload over forum
memory." Two errors in one sentence:

- Line 399 does not say that. Line 399 is about Golden Tokens; *"Rebirthing = 25 FREE Gold"* is the
  **title of the linked forum thread**, i.e. a URL slug quoted as if it were the document's claim.
  The document's actual assertion is `:308` — *"25 gold is awarded EVERY rebirth, rising to 100 gold
  on the 9th; each rebirth also adds +10 bank weight capacity."*
- That assertion is **exactly right** for v0.717. 25 per rebirth, 100 on the 9th. The forum beat the
  decompile because the forum was playing the desktop build.

**What survives:** the structural point. Blocker ④ is *not* unclosable — the client does contain an
offline premium-Gold faucet. That is a real and valuable overturn. Every number attached to it is
wrong for the build being recreated, and it must not be written into config as 5/20/60.

---

## R2 — MATERIAL · `meta-social/six-actions-understated`

**Ten is the Android count. v0.717 spends a war move at nine sites.**

Android (I confirmed the claim's own count — all ten lines exist exactly as cited):

```
$ grep -c "useWarMove(1)" reference/decompiled/shs3_android/scripts/WarHexUI.as
10          # lines 1049 1177 1210 1279 1304 1386 1654 1771 2420 2471
$ grep -n "useWarMove" reference/decompiled/shs3_android/scripts/WarUI.as
235:      internal function useWarMove(val:int) : *      # definition only, no self-call
```
→ Android total **10**.

WEB v0.717:

```
$ grep -c "§1t8015s0§(1)" "reference/decompiled/shs3_payload/scripts/§1t7785s0§.as"
8           # lines 1105 1197 1233 1304 1370 1917 2391 2444
$ grep -rn "§1t8015s0§" "reference/decompiled/shs3_payload/scripts/" | grep -v §1t7785s0§
§1t6483s0§.as:262:      internal function §1t8015s0§(param1:int, param2:int = 0) : *
§1t6483s0§.as:700:         this.§1t8015s0§(1);            # WarUI self-call — enter battlefield
```
→ Web total **9**.

The claim's core correction (the rulebook's 5–6 understates the real move economy) is right and
worth keeping. The number is not. Its `lane_impact` tells an implementer to build **ten** operations;
for v0.717 that is nine, and one of them lives in WarUI, not WarHexUI.

---

## R3 — MATERIAL · `meta-social/warroom-board-frame` (STILL_UNHELD → HELD)

**"No frame anywhere shows the board" is false. There are at least four, in a segment the surveyor
never opened.** Its own quote admits the search scope: *"Checked
`reference/frames/Nr4fQstqHDM_map_contact.jpg` (100 cells)"* — one contact sheet, one of two videos.
`reference/frames/Nr4fQstqHDM/seg-29/` is a 60-frame **War Room segment**.

### A1-a — the war-room board itself
`reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0019.jpg`, whole frame (512×288) upscaled ×3 LANCZOS.
Visibly on screen:

- vertical right-rail label **"WAR ROOM"**; header **"SELECT A SECTOR"**; **"HELP"** button
- **"TROOPS WILL ATTEMPT SECTOR CAPTURE IN 16:44:05"** — the 24 h advance, running
- **"2 MOVE(S) LEFT"** and **"NEXT TURN IN 59:58"** — an A1 proof of `WARMOVEINTERVAL = 60*60`
- the board: a 6-wide sector grid, black sector boundaries, terrain drawn as mountains vs open
  ground vs trees, **green** clan territory shading with **green banner flags**, **red** enemy
  shading, two Command-HQ fist medallions with directional arrows, a barricade structure icon and a
  samurai figure on the contested cell
- **"RYUWARA MESSAGE BOARD"** with **"SEND TO SIDE" / "SEND TO ALL"**, containing the log line
  **"ASUTORARU: BUILDING BARRICADES AT SECTOR (4,3)"** — sector coords inside 0..5, from gameplay

`frame_0018.jpg` is the same board one action earlier, header **"SELECT HQ/TOWN TO ENTER TERRITORY"**,
**"3 MOVE(S) LEFT"**, countdown 16:44:10.

### A1-b — the 6×6 sector board with printed 0–5 axes
`reference/frames/zFtCaTO0_1M/map/frames/frame_0024.jpg`, crop (398,40)-(502,160) upscaled ×10 LANCZOS.
The HUD minimap is a **6×6 grid** with the digits **0 1 2 3 4 5 along the top** and **0 1 2 3 4 5 down
the left**, compass letters **N** (top) **W** (left) **E** (right) **S** (bottom), wall/exit segments
between cells, gate glyphs, a `!` quest marker, an `X`, and the player arrow at column 2 row 4 —
with **"TERRITORY (22,51) SECTOR (2,4)"** printed beneath it. The arrow's cell matches the readout.

That is the picture of the board the claim says does not exist, and it independently confirms
`getTerrainValue`'s `x > 5 || y > 5` clamp and the `[N,S,E,W]` exit model from the frame side.

### A1-c — the world board, second longplay
`reference/frames/zFtCaTO0_1M/map/frames/frame_0025.jpg` (×3): the **WORLD MAP** — header
**"NAGANO (26,52) LEVEL: 9"**, **"ZOOM OUT"**, a tiled territory board where each tile carries a
settlement icon and a **coloured clan flag (yellow / blue / red / green)**, and a legend:
**"VILLAGE · TOWN · CITY · CASTLE TOWN · DESTROYED · QUEST"** plus **"GREY TERRITORIES – LEVEL TOO
LOW / RED TERRITORIES – LEVEL TOO HIGH"**. Four settlement tiers matching HEX_VILLAGE / HEX_TOWN /
HEX_CITY / HEX_CASTLE, a destroyed state, and per-territory level gating — none of which is in any
claim.

---

## What held, and what I could strengthen

I re-derived every number rather than trusting the survey. All of the following **held exactly**.

| claim | my own check |
|---|---|
| `war-kill-cap-351` | parsed `reference/extracted/bindata/119_1t4646s0.bin` with ElementTree: **39 waves, Σqty = 351**, split `{400-block: 340, 700-block: 11}`, 700-block = 11 distinct ids 700–710 at qty 1. Ledger's "350 (= 340 + 10 samurai)" (`SHSD_MASTER_REFERENCE.md:170`) miscounts the samurai by one. **Bonus cross-check the survey missed:** achievement id 58 is `stat 60018 val 340` → *"Warrior III — Defeat 340 in a war room attack."* The game itself names the 340. |
| `world-board-63x72-byte-identical` | re-ran the byte-check: web `92_1t4648s0.bin` and android `110_Mobile_MapBitmapData.bin` are both `GIF89a`, 63×72, 272 bytes, `sha256 b9d152c046b66b59…`, `identical: True`. Decoded palette = exactly 2 colours; **735** non-black of 4536. `WarSelectUI.as:83/85` mapWidth/mapHeight and `:173 getPixel(...) != 0` confirmed. |
| `flag-120-is-mislabelled-terrain-row` | the 7-row table `1.5/1.2/1/0.75/0.6/0.5/0.25` verified in **both** builds (android `WarHexUI.as:2289-2307`, web `§1t7785s0§.as:2127-2145`). `HEX_CONTROLPOINT` appears only at `WarHexUI.as:316,381` (board build) and `WarHex.as:463` (description text) — never in a modifier. The three neighbouring master-reference rows fall out exactly: 100×0.6 = **60** (field→mountain), 100×1.0 = **100** (mountain→mountain), 100×0.75 = **75** (field→forest). |
| `frame-prints-coordinate-system` | opened `Nr4fQstqHDM/map/frames/frame_0090.jpg` (512×288), crop (255,140)-(400,165) ×12: **"KAKUCHI CASTLE TOWN, MAIN STREET / TERRITORY (24,52) SECTOR (3,0)"**. Crop (200,180)-(470,288) ×6: **"REWARD / 473 XP / 35 COINS / TOWN PROSPERITY: +10"**. Both halves confirmed. |
| `frame-proves-string-table-parity` | crop (100,30)-(420,70) ×6 → **"…ES 1/7 (JOINING A BATTLE)"**; crop (100,50)-(420,250) ×5 → the typo **"YOU CAN MAY SELECT AN ON-GOING BATTLE TO TAKE PART IN."** verbatim against android string 370. `WarRules.as:23 max:int = 6` confirmed. |
| `four-clans-named-led-located` | strings 275–278 and 324–327 read as quoted; side→clan binding proven at `PlayerPanel.as:424-439` and `InteractUI.as:362-381` (side 1→275 Aka Ryu, 2→276, 3→277, 4→278) against colours `WarHexUI.as:1077-1089`. |
| `kisensu-domain-typo-in-shipped-data` | 324 and 327 both end *"rules the domain in the North-East."*; 325 South-East, 326 South-West; North-West vacant. |
| `ninja-services-priced-catalogue` | parsed **web** `itemdata.xml` and resolved through `strings.json`: 2100/2101/2102 at hprice 1/2/3 = Small/Medium/Large Soldier Pill; 2125/2126/2127 at 1/2/3 = 10/25/40 Duel Tokens; 2203 hprice 5 = Writ of Release; 2208 hprice 1 = "1000 coins"; 2212 hprice 5 = Clan Deed with the exact invitation text. |
| `two-token-pools-quantified` | `StatsManager.as` :158 :160 :166 :707 :709 :710 :1101 :1134 all read verbatim at the cited line numbers. `STAT_GOLD:int = 11` / `STAT_HGOLD:int = 12` naming trap confirmed at :192/:194. |
| `chikako-affinity-meter` | `InteractUI_chikako.as:24,26,40`, `StatsManager.as:2722-2723`, `NetworkManager.as:2306`, string 723 — all verbatim. |
| `rank-ladder-thresholds-and-moves` | re-derived `getWarRank` (`:824-867`): 12·3=36, +12·4=84, +24·4=180, +36·4=324, +48·4=516, +60·5=816, +72·5=1176, +84·5=1596, +96·5=2076, then <5000, else 10. `getMaxWarMoves` (`:966-1013`) = 3,4,4,4,4,5,5,5,5,5,6. Names 330–339 + 403 as quoted. |
| `achievements-61-resolved` | parsed the blob: **61** `<achievement>`, first row verbatim, and ids 45/46/53/54/55/58/60 resolve exactly as quoted. |
| `daily-reward-table` | code confirmed; the branch structure, the 30/10/36 dice and the item ids are all as described. |
| `structure-costs-and-donation-rate` | `WarHexUIBuildMenu.as:192/197/202/207` = 10000/5000/10000/10000, SPAWNPOINT has no cost line; `WarHexUI.as:1291` and `:1332` both `buildcost = 500`; `:1302 changeStat(STAT_WARCOINSDONATED,buildcost)` feeding `getWarRank`'s `int(…/1000)` proves 1 rank point per 1,000 coins. Castle gate `3*60*60` at `WarHex.as:499,507,513`. |
| `survivalmode-is-the-warroom-wave-table` | `WarHexUI.as:13` and `:1719` verbatim; remap at `:1736-1755` verbatim. |
| `section6-live-clan-war-overbroad` | `REBUILD_READINESS.md:349` quoted verbatim; all mechanic cites confirmed. |
| `xp-curve-l11-80-recovered` | array parsed: 99 entries, `a[9]=25900`, `a[10]=31400`, `a[79]=4025800`, tail `25395800, 29395800`. |
| `rival-clan-ai` (STILL_UNHELD) | **correctly unheld.** `SHSD_MASTER_REFERENCE.md:177` says exactly what is quoted; grepping `War*.as` + `Territory*.as` for AI/strategy/reinforce logic returns only `WarHex.as:343 canReinforce(side)` — a UI-enable predicate, not an opponent. |
| `war-rules-page-7-content` (STILL_UNHELD) | **correctly unheld, and better-grounded than it knew** — see F2. Android `strings.json` numeric ids top out at **9010**, so 11016/11017 genuinely are not in it, and the web `LangManager` (`§1t1521s0§.as:63-77`) fetches its table from `"./data/"` or `server + "strings/"` — a dead host. Unrecoverable stands. |

---

## New findings the surveyor missed

**F1 — the achievement list is in the WEB v0.717 payload; the Android caveat is unnecessary.**
`reference/extracted/payload.xml:119088-119148` is an AS3 constant-pool block of 61 achievement
names, `<item>Duelist I</item>` … `<item>Be Awesome</item>`. I compared it to the 61 android rows
resolved through `strings.json`:

```
android n= 61   web n= 61
EXACT MATCH: True
```

Same names, same order, zero diffs. This is the single best available validation of the whole S0-3
string table against the desktop build — and it means blocker ③'s achievement third closes with a
**web-build** cite.

**F2 — the WEB WarRules class exists and says `max = 7`; there is no doc-vs-frame conflict to resolve.**
`reference/decompiled/shs3_payload/scripts/§1t7924s0§.as` (found by
`grep -rln "warruleswords" reference/`) is v0.717's WarRules:

```
23      internal var max:int = 7;
...
121            case 7:
122               this.warrulestitle.text = §1t1521s0§.getString(11016);
123               this.warruleswords.text = §1t1521s0§.getString(11017);
```

Pages 1–6 use the identical ids 369–380 as Android. So the surveyor's `11016/11017` is **right**,
it just never cited where it came from — and its invocation of the standing invariant
("the FRAME WINS over the Android decompile") was unnecessary: the desktop code already agrees with
the frame. The frame and the correct source never disagreed.

**F3 — page 3 of the 7-page rules dialog is on screen, and it is android string 374 word-for-word.**
`reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0013.jpg` (×3):
**"WAR ROOM RULES 3/7 (ATTACKING AND DEFENDING)"** over the exact three bullets of string 374
(*"…you will personally fight against the enemy troops." / "…you will also encounter them during
battle." / "…kick them off the battlefield."*), with PREVIOUS/NEXT buttons. A second, independent
string-table calibration point — and it shows the only web/Android delta on pages 1–6 is the `/7`
vs `/6` suffix inside the title strings.

**F4 — the rank ladder is confirmed from a frame, not just from code.**
`reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0015.jpg` (×3), bottom-left panel:
**"ALLEGIANCE: CLAN AKA RYU / RANK: RECRUIT (3 MOVES A TURN) / MOVES MADE: 0/36"**, with
**"3 MOVE(S) LEFT"** bottom-right. That is `getWarRank` rank 0 = string 330 *"recruit"*,
`getMaxWarMoves(0) = 3`, and the `12*3 = 36` first threshold — all three rendered by the live
v0.717 client. Paired with `frame_0019`'s **"NEXT TURN IN 59:58"**, the entire rank/turn model is
now A1-held rather than A2-inferred.
Note the WEB build's *authoring placeholder* `reference/extracted/ui_strings.txt:215` reads
`allegiance: AKA RYU clanrank: soldier (3 moves a turn)moves made: 15/60` — "soldier", "/60". **The
frame wins**: shipped v0.717 renders "recruit" and "/36". Do not port the placeholder.

**F5 — the web build restricts the barricade defence bonus to enemy-owned barricades.**
Android `WarHexUI.as:2285`:
`if(hextype == HEX_DEFENSE && cost == 0 || hextype == HEX_CITY || hextype == HEX_CASTLE) toValue += 2;`
Web `§1t7785s0§.as:2123`:
`if(hextype == HEX_DEFENSE && cost == 0 && owner != playerside || hextype == HEX_CITY || hextype == HEX_CASTLE)`
(`§1t7812s0§` is playerside — it is the side argument passed to `setWarHex` at `:1109` and to
`getRandomEnemy` at `:1122`). Your own completed barricade does **not** penalise you in v0.717.

**F6 — v0.717 hard-caps a side's troops in a hex at 50,000.**
`reference/decompiled/shs3_payload/scripts/§1t7785s0§.as:2179-2186`:
```
_loc3_ = this.§1t7807s0§.§1t7776s0§(this.§1t7812s0§) + param2;
if(_loc3_ > 50000) { _loc3_ = 50000; }
```
`grep -n 50000 reference/decompiled/shs3_android/scripts/WarHexUI.as` returns **nothing** — the cap
is desktop-only. A war-sim number in no claim and no ledger row.

**F7 — the XP curve is in the WEB build, byte-for-byte.**
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364` (and `§1t29s0§.as:28`) hold the same
99-entry array; parsed and compared to Android: `IDENTICAL: True`. The `xp-curve-l11-80-recovered`
claim can drop its Android caveat entirely — `REBUILD_READINESS.md:200` and `:350` are retired on a
desktop cite.

**F8 — "clan crops" is a clan-economy resource absent from every claim and every ledger row.**
`frame_0015.jpg` prints **"CLAN CROPS: 402 (+2 HQ)"** on the war-select screen, and the WEB payload
carries its own placeholders: `reference/extracted/ui_strings.txt:248 "clan crops: 130 *(+1 hq)"`
and `:211 "aka ryu crops: +2bob crops: -2"`. A per-clan stockpile with HQ-derived income and
per-clan deltas.

**F9 — the same frame confirms the clan colour→identity binding visually.**
`frame_0015.jpg` shows the Aka Ryu crest as a **red banner with a gold dragon**, over chat reading
**"WE ARE THE RED DRAGONS!"** and **"LONG LIVE THE MIGHTY RED DRAGONS!"** — Aka Ryu = red dragon =
side 1 = `0xFF0000`, from a picture rather than an inference. The caption
**"FLAGS INDICATE BATTLES THAT THE CLANS ARE CURRENTLY ENGAGED IN"** also independently supports
R-claim `flag-120-is-mislabelled-terrain-row`: the map flag is a battle marker, not a combat modifier.

**F10 — the enemy-id remap has an independent witness.**
`InteractUI.as:365,370,375,380` sets the clan-town daimyo busts to NPC ids **247 / 447 / 347 / 547**
for sides 1/2/3/4 — the same `+200 / +400 / +300 / +500` offsets as
`WarHexUI.as:1736-1751`. Two unrelated call sites agree, so the mapping is a build-wide convention.

**F11 — minor, for the record.** `bindata/119_1t4646s0.bin` (11,721 B) and
`android/109_WarHexUI_SurvivalModeData.bin` (11,553 B) are **not** byte-identical, though both parse
to 39 waves and Σqty 351. The claim's word "identical" is true of the number, not of the files.
Separately, the daily-reward line numbers drift by one (`:1152→1153`, `:1153→1154`, `:1207→1208`);
content is exact.

---

## Score

The unit's own three stated deductions are now two-and-a-half: the board frame exists (R3), and the
page-7 structure is A1-held even though page 7's body is not (F2/F3). But **R1 is a 5× error on a
number the claim uses to overturn a ledger blocker, while discrediting a source that was correct** —
that is worth more than the board frame is worth. **78 is not supportable as written.** Re-derive the
war block against `shs3_payload` first, then re-score.
