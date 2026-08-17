# meta-social — CITE LENS critic (blind)

Reviewer opened every cited artifact first-hand. 22 claims audited. **3 REFUTED (all
material), 19 upheld** — this is an unusually well-cited survey; the refutations are
about *conclusions dressed as citations*, not invented evidence. No fabricated file
paths were found.

Headline: **§0's Android-vs-web caveat was applied backwards.** The surveyor treated
`reference/extracted/` (web v0.717) as the build in the longplay and the Android
decompile as the suspect copy. Opening the payload proves the reverse for the one
screen where a frame lets us adjudicate: **the longplay build is neither artifact.**

---

## REFUTED

### R1 — `meta-social/war-kill-cap-351` (material)

The number survives. I re-derived it independently:

```
reference/extracted/bindata/119_1t4646s0.bin
  <wave> blocks .................. 39
  sum of every <qty> ............. 351
  by id block: 4xx = 340 · 7xx = 11 (ids 700..710, qty 1 each)
```

That correctly overturns `docs/research/SHSD_MASTER_REFERENCE.md:171`
`| Kill cap (troops) | 350 (= 340 troops + 10 samurai) |`.

Two sub-assertions are false:

**(a) "identical in the web v0.717 and Android payloads" — refuted by byte-check.**

```
web  reference/extracted/bindata/119_1t4646s0.bin          11721 B  sha256 709d94cb28c08ba1…
andr reference/extracted/android/109_WarHexUI_SurvivalModeData.bin  11553 B  sha256 b56f8c6a028357c4…
identical: False
```
14 of 87 `<enemy>` rows differ. Web rows carry `<id>449|454|449|454|443</id>`; Android
carries `<id>449|454</id>`. The **totals** match (39 waves / 351 / 340+11) — the
**tables do not**. Say "the total is identical", never "the payloads are identical".

**(b) "11 named samurai" — a NAME claim on an unresolvable numeric ID (§2.1 failure).**
Ids 700–710 exist in **no** npc table:
- `reference/extracted/npcdata.xml` — npc ids run 0…656 then jump to 800…819. No 7xx.
- `reference/extracted/android/125_Mobile_NpcData.bin` — regex `<id>70[0-9]</id>` → 0 hits.
- `docs/gauntlet/L0/index/resolved_names.json` `npcdata.xml.resolved` → `700`…`710` all `None`.

They are 11 singleton spawns on odd waves (bindata/119 waves 1,3,5,7,9…) with no name,
no stats, no art binding. Correct verdict: **the 11 boss slots are STILL_UNHELD.**

---

### R2 — `meta-social/frame-proves-string-table-parity` (material — conclusion inverted)

The *observations* are right. I re-cropped `frame_0084.jpg` (512×288 source, crop
(60,20)-(300,45) ×10 LANCZOS) and read **`ROOM RULES 1/7  (JOINING A BATTLE)`**
unambiguously — a 7, not a 6. Body crop (100,50)-(420,250) ×5 shows
`YOU CAN MAY SELECT AN ON-GOING BATTLE` — Android string 370's typo, verbatim.

The *conclusion* — "proving the Android string table is v0.717's own copy" — is refuted
by v0.717's own copy. The web payload's war-rules dialog is `DefineEditTextTag`
characterIDs **744–755 = exactly six title/body pairs**, and page 1's body reads:

```
reference/extracted/payload.xml:528044  (characterID 745, initialText, tags stripped)
  1) pick a side.
  2) select a battle to join.
  3) select the sector with your side's castle HQ and select the "MOVE" action to
     enter the battlefield.
```

That is **different text entirely** from what the frame shows. Corroborating counts over
the 329 MB payload: `"you can may"` → **0**, `"on-going battle"` → **0**,
`"clan-based"` → **0**, `"1/7"` → **0**. The only titles present are
`payload.xml:528040,528048,528056,528064,528072,528080` = `War room rules 1/6 … 6/6`
(same six in `reference/extracted/ui_strings.txt:189-194`). The desktop scripts hold no
war-rules string at all (`grep -rn "room rules" reference/decompiled/shs3_payload/scripts/`
→ empty), so those static TextFields *are* the desktop copy.

**STANDING INVARIANT APPLIED, and it cuts deeper than the survey said: the frame
disagrees with the WEB artifact too. The frame wins, so the longplay build is a
revision that matches neither `reference/extracted/payload.xml` (6 pages, older copy)
nor `reference/decompiled/shs3_android` (6 pages, matching body copy).** The Android
table is the *closer* of the two, not "v0.717's own copy".

Consequence the lane must carry: **"it came from the WEB build so no version caveat
applies" is unsafe** (used explicitly in `meta-social/ninja-services-priced-catalogue`).
The extracted web payload is demonstrably not the filmed build.

---

### R3 — `meta-social/war-rules-page-7-content` (material — verdict right, cause fabricated)

STILL_UNHELD is the correct verdict and I do not contest it. The stated *cause* is wrong:

> "desktop string ids 11016/11017, above the Android table's 9010 ceiling"

**11016 and 11017 are ITEM ids, not string ids.**
- `reference/extracted/itemdata.xml:6702` → `<id>11016</id>`
- `reference/decompiled/shs3_android/scripts/XMLNpc.as:475`
  `pantslist = [11006,…,11013,11016,11017,11018,11019];`

The 9010 ceiling itself is right (`docs/gauntlet/L0/index/strings.json`, max numeric key
= 9010 → `"Heh!"`). But the desktop build does not address war-rules text by numeric id
at all — see R2. The true reason page 7 is unheld is that **the extracted web payload
has only six pages and different wording**, so there is nothing on disk to read.

---

## UPHELD (each personally re-opened)

| claim | what I opened | note |
|---|---|---|
| `flag-120-is-mislabelled-terrain-row` | `WarHexUI.as:2281-2307` | Switch verbatim as quoted; `HEX_CONTROLPOINT` genuinely absent from `getTerrainModifier`; only 2 call sites exist (`:1052`, `:1104`). Master ref `:176` `Control-point flag bonus ×1.20` is indeed the case-1 row. **See NF2 — the web build's guard is stricter.** |
| `world-board-63x72-byte-identical` | both blobs + Pillow decode | Reproduced exactly: `GIF89a`, 63×72, 272 B, sha256 `b9d152c046b66b59863c…`, **identical: True**, 2 colours, **735 / 4536** non-black. `WarSelectUI.as:83,85,173` verbatim. 63 also present in the web build (`§1t1056s0§.as:136`). |
| `frame-prints-coordinate-system` | `map/frames/frame_0090.jpg` ×3 full-frame | `TERRITORY (24,52) SECTOR (3,0)`, `TOWN PROSPERITY: +10`, `473 XP / 35 COINS` all legible. Frames here are **512×288**, not 1080p — the §0 crop rule is about `reference/frames/` generally; this dir is low-res and the crop the survey used is correct for it. Minor: the panel is the QUESTS panel, not a war-map panel. |
| `four-clans-named-led-located` | strings 271-278/324-327 + `WarHexUI.as:1077-1089` | All verbatim. **Stronger than cited — see NF8:** side→clan is a literal switch, not a translation inference. |
| `kisensu-domain-typo-in-shipped-data` | strings 324 & 327 | Both end "rules the domain in the North-East."; 325 South-East, 326 South-West; North-West vacant. Caveat: Android copy only — the web wording of these two is not held. |
| `offline-gold-faucet-exists` | `StatsManager.as:2195,2203,2207` + `OverworldHUD.as:1333` | Verbatim. `DAN==8 → +20`, else `+5`; hack check `HGOLD > 60 && DAN < 9`. Survey said PARTIAL; evidence supports **HELD** on the client rule. Minor: the "contradicts KONGREGATE_FORUM_FINDINGS.md:399" sub-cite mis-reads a hyperlink *title* as a finding — that line's bullet is about Golden Tokens. |
| `ninja-services-priced-catalogue` | 9 item rows parsed out of `itemdata.xml` | 2100/2101/2102 → hprice 1/2/3 "Small/Medium/Large Soldier Pill"; 2125/2126/2127 → 1/2/3 "10/25/40 Duel Tokens"; 2203 → 5 "Writ of Release"; 2208 → 1 "1000 coins"; 2212 → 5 "Clan Deed". Strings 609 and 100 verbatim. Cited line numbers point at each `<item>` open tag (id on the next line) — resolves. |
| `two-token-pools-quantified` | `StatsManager.as:158,160,166,192,194,707,709,710` + `regenAP` | All verbatim. `STAT_GOLD:int = 11` (:192), `STAT_HGOLD:int = 12` (:194) — naming trap real. `diff *= 2` under `BUFF_AP` confirmed in `regenAP`. |
| `chikako-affinity-meter` | `InteractUI_chikako.as:24,26,40`, `StatsManager.as:2722-2723`, `NetworkManager.as:2306` | All verbatim; string 723 exact. |
| `rank-ladder-thresholds-and-moves` | `StatsManager.as:162,826-827,~870-1013` | Thresholds **36/84/180/324/516/816/1176/1596/2076/5000** exact; `getMaxWarMoves` returns **3,4,4,4,4,5,5,5,5,5,6** exact; names 330-339 + 403 exact. Achievements 53/54/55 descs are "Reach Lieutenant Rank." / "Reach General Rank." / "Reach War Hero Rank." at val 5/9/10 — the survey quoted the desc, correctly. |
| `achievements-61-resolved` | `114_Mobile_AchievementData.bin` parsed | **61** rows. Row 0 verbatim as quoted. 45 → Chi Master val 10; 46 → Ninja Master val 9; 58 → Warrior III val 340; 60 → Be Awesome val 1. |
| `daily-reward-table` | `InteractUI.as:1153,1154,1163,1208,1217,1247` | Every mechanism confirmed: 24 h via `setStat(30018, serverTime + 24*60*60)`, `%30 → random*10` over 2130,2131,2132,2133,2135,2136,2137,2138,2139,2146; `%10 → random*6` over 1000 coins/2101/2105/2126/2127/random; base `random*36` with `<=4`→100, 5→200, 6→300, 7→random item. **Line numbers drift by +1** on three of four cites (:1152→1153, :1153→1154, :1207→1208; :1247 exact) — content resolves, and repo convention is to cite symbols not lines. Minor. |
| `structure-costs-and-donation-rate` | `WarHexUIBuildMenu.as:190-212` + `WarHexUI.as:1291,1304,1332` | Costs 10000 / 5000 / 10000 / 10000 and HQ costless, verbatim. `buildcost = 500` gated on `WARMOVES > 0`, spends `useWarMove(1)` at `:1304` and credits `WARCOINSDONATED += 500` — so 500 **per move**, not per turn. Survey said PARTIAL; evidence supports **HELD**. |
| `six-actions-understated` | `grep -n "useWarMove(1);" WarHexUI.as` | Exactly **10** hits, at **1049, 1177, 1210, 1279, 1304, 1386, 1654, 1771, 2420, 2471** — every cited line number is right to the digit. String 372 verbatim. |
| `survivalmode-is-the-warroom-wave-table` | `WarHexUI.as:13,1719,1728-1752` | Verbatim. Independently corroborated by NF8's bust ids. |
| `section6-live-clan-war-overbroad` | `REBUILD_READINESS.md:349` + `WarHexUI.as:1052,1104` + string 376 | Ledger line quoted verbatim; formulas verbatim. **See NF4 — no Android caveat needed.** |
| `xp-curve-l11-80-recovered` | `StatsManager.as:78` parsed | **99** entries; `[9]=25900`, `[10]=31400`, `[79]=4025800`, tail `…,25395800,29395800`. Ledger lines 350 and 127 quoted verbatim. String 4155 exact. **See NF3 — it is in the WEB build too.** |
| `warroom-board-frame` (STILL_UNHELD) | `Nr4fQstqHDM_map_contact.jpg` (1280×720, 100 cells) | I scanned the sheet myself. Cell 84 = the war-rules dialog, cell 90 = the quest panel; **no hex board anywhere**. Honest and correct. |
| `rival-clan-ai` (STILL_UNHELD) | `SHSD_MASTER_REFERENCE.md:177` + `grep 'AI\b' War*.as Territory*.as` | Line 177 verbatim; grep returns **zero** files. Honest and correct. |

---

## NEW FINDINGS

**NF1 (A1+A2, overturns the lane's version model).** The longplay build is neither
extracted artifact. Frame `map/frames/frame_0084.jpg` shows page **1/7** and the Android
wording; `payload.xml` (v0.717, `§1t1523s0§.as:36` `= 0.717`) holds **six** pages with
*different* prose (`:528044`). Every Android-sourced string in this lane must be labeled
"matches the filmed build, not the extracted v0.717 payload".

**NF2 (A2, corrects claim `flag-120…`).** The web v0.717 barricade rule is **stricter**
than the Android line the survey quoted:
```
android  WarHexUI.as:2287      hextype == HEX_DEFENSE && cost == 0                          || CITY || CASTLE
web      §1t7785s0§.as:2123    hextype == HEX_DEFENSE && cost == 0 && owner != playerside   || CITY || CASTLE
```
In v0.717 a completed Barricade gives **no** `toValue += 2` against its own owner.
A recreation copying the Android line would over-buff friendly deploys.

**NF3 (A2, removes an Android caveat).** The 99-entry XP array is in the **web** payload:
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364` (same class as
`0.717` at :36) and `§1t29s0§.as:28` — verified len 99, `[79]=4025800`, tail `29395800`.
The L11–80 §6 line closes with **no build caveat at all**.

**NF4 (A2, removes an Android caveat).** The whole war stack is in the web build:
`§1t7785s0§.as:1108` `100 * this.§1t7871s0§()`, `:1123` `80 + Math.random() * 40 * …`,
`:2119-2145` the 7-row terrain switch (1.5/1.2/1/0.75/0.6/0.5/0.25), `:2150`
`param1 > 5 || param2 > 5` → the **6×6 board is web-confirmed**.

**NF5 (STILL_UNHELD).** The 11 war-room boss slots (npc ids 700–710) have no name, no
stats and no art anywhere on disk. See R1(b).

**NF6 (A3).** Web and Android `survivalmodedata` differ in 14/87 enemy rows (web pools
include npc 443 and duplicated ids). Totals agree; composition does not. See R1(a).

**NF7 (A2, corroboration).** Achievement 58 — `stat 60018 val 340`, *"Warrior III —
Defeat 340 in a war room attack."* — is the game's own statement that the rank-and-file
count is 340, independently of the wave-table sum.

**NF8 (A2, upgrades claim `four-clans…` from inference to direct proof).**
`PlayerPanel.as:424-438` and `InteractUI.as:362-380` map side → clan literally:
1→string 275 Aka Ryu, 2→276 Midori Ken, 3→277 Aoi Hoiru, 4→278 Ki Sensu — no
Japanese-colour-word inference needed. The same file binds busts
`initMCSFromNPCID(247/447/347/547)`, reproducing the wave-remap's
side→npc-block map (`+200/+400/+300/+500`) from a second, independent site.

---

## Score comment

The evidence genuinely supports a large jump from 31. But **78 is too high given NF1**:
the lane's primary artifact is not the filmed build, so every "web build, therefore no
caveat" upgrade is provisional, and the 11 boss NPCs are a hard hole in the war-room
battle content. A defensible band is **68–72**, with the delta recoverable by a denser
video pass over the war-room segment (which would also close `warroom-board-frame`).
