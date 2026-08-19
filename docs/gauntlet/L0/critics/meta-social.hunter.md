# meta-social — HUNTER LENS review (blind critic)

**Reviewer stance:** every verdict below was reached by opening the artifact myself. Nothing here
is taken from the surveyor's reasoning (which I never saw) or from memory of a game that is dead.

---

## Headline

The surveyor did real work: 15 of its 22 claims survive artifact-level checking, several of them
exactly line-for-line. But it made **one systemic mistake that poisons four numeric claims**, and it
**under-claimed two frame findings that are sitting in a video it never opened.**

### The systemic mistake — it never opened the WEB decompile

`reference/decompiled/shs3_payload/scripts/` holds **1,079 decompiled `.as` files — the WEB
v0.717 build**, i.e. the exact build in the two longplays that CLAUDE.md calls the primary 1:1
reference. It is name-obfuscated (`§1t1523s0§.as` = StatsManager, `§1t7785s0§.as` = WarHexUI,
`§1t401s0§.as` = InteractUI) but every **numeric literal survives intact**. The surveyor sourced
15 numbers from `shs3_android/` and never cross-checked one of them there.

Where I cross-checked, the web build **confirms** the terrain table, the rank ladder, moves/turn,
structure costs, the 500-coin build donation, AP/Duel-Token pools and the 99-entry XP array —
and **contradicts** four of the surveyor's headline numbers:

| Number | Surveyor (Android 0.682) | **WEB v0.717 (the reference build)** | Cite |
|---|---|---|---|
| Rebirth Gold | 5 / 20 at Dan 8 → 60 lifetime | **25 / 100 at Dan 8 → 300 lifetime** | `§1t1523s0§.as:2638–2656` |
| Daily base roll | fixed `random()*36` | **`random()*(37 + playerLevel)`** | `§1t401s0§.as:1216–1219` |
| Day-10 bonus roll | 6 outcomes | **8 outcomes** | `§1t401s0§.as:1588` |
| Chikako ladder | `[0,10,30,60,100,150]`, ach.score ×1 | **`[0,50,150,300,500,750]`, ach.score ×5** | `§1t5865s0§.as:24,42` |
| War-move spend sites | 10 | **8** | `§1t7785s0§.as` ×8 |

The rebirth one is the worst: the surveyor used it to **overrule a correct source**, writing
"payload over forum memory" against `KONGREGATE_FORUM_FINDINGS.md`'s *"Rebirthing = 25 FREE Gold"*.
The web payload says **25**. The forum was right; the Android decompile was a later rebalance.
(Two further mis-cites there: that doc's line 399 does **not** assert 25 Gold — the phrase is a
hyperlink label, a Kongregate thread title, attached to a sentence about Golden Tokens. And
`OverworldHUD.as:1333` does not treat >60 Gold as "proof of purchase" — it calls
`reportHack("gold")`, i.e. proof of *cheating*; and that check **does not exist in the web build at
all**.)

### The root cause — an over-generalised calibration claim

`meta-social/frame-proves-string-table-parity` concludes the Android string table "is v0.717's own
copy" and calls itself "the calibration artifact for every Android-sourced string in the lane."
**Its own frame disproves it.** In one dialog: the *body* (string 370) matches word-for-word
including the "you can may select" typo — but the *title* (string 369) does not, Android reading
`1/6` where the frame reads `1/7`. One string matching is not a table matching, and the five
divergences above are the proof.

### The under-claim — the board IS photographed, in the other longplay

`meta-social/warroom-board-frame` says no frame pictures the board and that "every board claim in
this lane rests on decompiled code … not on a picture of the board." The surveyor searched
`Nr4fQstqHDM` only. The frames manifest lists a **second longplay, `zFtCaTO0_1M`**, with its own
100-frame map segment. Two frames in it picture the board:

- **`zFtCaTO0_1M/map/frames/frame_0020.jpg`**, crop `(370,45)-(505,180)` upscaled ×9 LANCZOS — the
  HUD minimap is the **6×6 sector board**: column headers `0 1 2 3 4 5`, row labels `0 1 2 3 4 5`,
  N/E/S/W compass letters, white wall segments drawing the blocked/open adjacency, gate glyphs, an
  `X`, the player arrow, and beneath it `TERRITORY (21,51) SECTOR (5,4)`. That is an A1 picture of
  the same 0..5 grid `getTerrainValue` bounds-checks (`x > 5 || y > 5 → 0`).
- **`zFtCaTO0_1M/map/frames/frame_0025.jpg`** ×3 — the **WORLD MAP board**: `NAGANO (26,52) LEVEL: 9`,
  a tile grid of territories carrying VILLAGE / TOWN / CITY / CASTLE TOWN / DESTROYED / QUEST icons
  and **red / blue / yellow / green clan flags**, with legend "GREY TERRITORIES – LEVEL TOO LOW /
  RED TERRITORIES – LEVEL TOO HIGH".

Only the war-room *hex overlay UI* remains unpictured. Verdict downgraded from STILL_UNHELD to PARTIAL.

---

## Honest STILL_UNHELDs — confirmed, and one strengthened

- **`war-rules-page-7-content`** — correct, and I can now say *why*. `§1t7924s0§.as:23` is
  `internal var max:int = 7;` and `:121–123` reads page 7 from `getString(11016)/getString(11017)`,
  so the ids are real (not the pants item ids 11016/11017 that also exist). The web string table is
  **never embedded**: `§1t1521s0§.as:80–84` loads `./data/shs3_en.xml` (or `server + "strings/"`) at
  runtime. `find . -iname "shs3_*.xml"` returns nothing. Genuinely dead.
- **`rival-clan-ai`** — correct. `SHSD_MASTER_REFERENCE.md:177` states the greedy strategy verbatim;
  the class listing of `shs3_android/scripts/` contains `War{ActiveBattle,ChooseUI,Flag,Hex,HexUI,
  Marker,Rules,SelectUI,SpawnPoint,Terrain,TroopsMarker,UI}`, `TerritoryData`, `SectorBuild` — and no
  AI class. Every war action in the web `§1t7785s0§.as` originates in a `MouseEvent` handler.

---

## Bonus finds while hunting

- **`§1t7785s0§.as:2123`** — the web build's barricade modifier carries an extra clause the Android
  version drops: `… HEX_DEFENSE && cost == 0 && owner != playerside …`. In v0.717 the `+2` defence
  step applies only to an **enemy-owned** barricade.
- **`§1t7785s0§.as:13`** is `internal static const §1t12534s0§:Class = §1t4646s0§;` — which names
  `reference/extracted/bindata/119_1t4646s0.bin` directly. The web bindata 119 → war-room wave table
  binding is exact, not inferred.
- **`shs3_payload/scripts/§1t29s0§.as:28` and `§1t1523s0§.as:364`** both carry the same 99-entry
  `expArray` as Android. The L11–80 XP curve is recovered from the **web** build; the Android caveat
  the surveyor attached to it can be dropped entirely.
- **`WarSelectUI.as:381–396`** is a direct `side → clan name` switch (1→275 Aka Ryu, 2→276 Midori Ken,
  3→277 Aoi Hoiru, 4→278 Ki Sensu) plus `clanemblem.gotoAndStop(side)`. Stronger than the colour-word
  inference the surveyor used, and it makes the clan↔side binding an artifact rather than a reading.
- **`§1t1523s0§.as:1024`** — a new web-only player starts with **3 Heavenly Gold**
  (`setPlayerStats(STAT_HGOLD, 3)`); the Android build starts at 0.
- **`reference/extracted/ui_strings.txt:189–194` / `payload.xml`** — the web SWF's authoring-time
  placeholder text still says "War room rules 1/6 … 6/6" *and* orders page 5 as "WINNING AND LOSING",
  page 6 as "rank" — the reverse of the Android runtime order. Placeholder text, not runtime strings
  (the same block contains `Territory(9999,9999)Sector(2,3)` and `Weight: 50/50`), so it does not beat
  the frame — but that placeholder is itself web-native A2 corroboration of the
  `TERRITORY(x,y) SECTOR(x,y)` readout.
- **`frame_0084`** also shows an `ACHIEVEMENT UNLOCKED / JOIN A CLAN.` toast — A1 proof the achievement
  system shipped in v0.717, which the achievements claim never cited.
- **bindata 119 vs Android 109 are NOT byte-identical** (11,721 B vs 11,553 B). 39 waves and Σqty 351
  match exactly, but seven waves' id pools differ (web pools carry an extra `443`). The *number* is
  identical across builds; the *composition* is not.

---

## Verdict table

| Claim | Verdict | Severity |
|---|---|---|
| war-kill-cap-351 | HELD (total 351 reproduced; "identical payloads" is true only of the total) | minor |
| flag-120-is-mislabelled-terrain-row | HELD + web-confirmed | — |
| world-board-63x72-byte-identical | HELD (sha256 match reproduced) | — |
| frame-prints-coordinate-system | HELD (crop read myself) | — |
| frame-proves-string-table-parity | **REFUTED** — conclusion over-generalised; own frame is the counterexample | material |
| four-clans-named-led-located | HELD (better cite exists: WarSelectUI.as:381–396) | — |
| kisensu-domain-typo-in-shipped-data | HELD | — |
| offline-gold-faucet-exists | **REFUTED** — web v0.717 grants 25/100, not 5/20; forum source was right | fatal |
| ninja-services-priced-catalogue | HELD (premium `<default>` list is 16 rows, not 12) | minor |
| two-token-pools-quantified | HELD + web-confirmed | — |
| chikako-affinity-meter | **REFUTED** — web ladder is [0,50,150,300,500,750], ach.score ×5 | material |
| rank-ladder-thresholds-and-moves | HELD + web-confirmed | — |
| achievements-61-resolved | HELD (61 rows verified; web parity NOT established — no web table on disk) | minor |
| daily-reward-table | **REFUTED** — web base roll is 37+level, day-10 bonus is 8 | material |
| structure-costs-and-donation-rate | HELD + web-confirmed | — |
| six-actions-understated | **REFUTED** — web build spends a move at 8 sites, not 10 | minor |
| survivalmode-is-the-warroom-wave-table | HELD + web class binding found | — |
| section6-live-clan-war-overbroad | HELD | — |
| xp-curve-l11-80-recovered | HELD + **web-native**, Android caveat can be dropped | — |
| warroom-board-frame | **REFUTED** — second longplay pictures both boards | material |
| war-rules-page-7-content | STILL_UNHELD confirmed (external `./data/shs3_en.xml`) | — |
| rival-clan-ai | STILL_UNHELD confirmed | — |

**On the score:** 31 → 78 is directionally right but reads high to me while five of the lane's
numbers are the wrong build's. Re-source them from `shs3_payload/` first; the ceiling then rests on
war-rules page 7, the un-pictured hex overlay, and web parity for the achievement table.
