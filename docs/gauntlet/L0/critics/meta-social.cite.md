# CITE-LENS review — meta-social (blind critic, run 2)

Lens: **over-claiming**. Every cite below was opened by me. Where I disagree, I paste the
artifact I opened. §0 rules applied: no memory, no plausibility, one artifact per claim.

**Headline: 3 of 22 claims are refuted, two of them on the SAME failure mode —
the surveyor ported ANDROID v0.682 numbers into the lane as if they were v0.717,
and in both cases the WEB payload we already hold says something different.**
The §0 briefing warned about exactly this ("combat tuning parity is NOT established.
Label which build any ported string came from"). The lane did not label them.

---

## REFUTED — 3

### R1 (FATAL) `meta-social/offline-gold-faucet-exists` — the numbers are the wrong build's, and the forum was right

The claim: "5 Gold per rebirth and 20 at the Dan 8→9 rebirth — 60 Gold lifetime … the
client itself treats >60 Gold below Dan 9 as proof of purchase", plus
"contradicts KONGREGATE_FORUM_FINDINGS.md:399 'Rebirthing = 25 FREE Gold' — payload over forum memory."

The Android cite resolves — `StatsManager.as:2203/:2207` and `OverworldHUD.as:1333` are
verbatim as quoted. But the **WEB v0.717 payload's own doRebirth says 25 and 100**:

```
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as
2639:      public static function §1t9600s0§() : *          <- doRebirth (announces string 864)
2643:         §1t9712s0§(§1t8755s0§,0);                     <- setStat(STAT_XP, 0)
2644:         if(§1t7356s0§(§1t9426s0§) == 8)               <- if getStat(STAT_DAN) == 8
2646:            §1t9713s0§(§1t9413s0§,100);                <- changeStat(STAT_HGOLD, 100)
2651:            §1t9713s0§(§1t9413s0§,25);                 <- else changeStat(STAT_HGOLD, 25)
```

`§1t9413s0§` is proven to be `STAT_HGOLD` two ways: `§1t1523s0§.as:228 internal static
const §1t9413s0§:int = 12;` (Android `STAT_HGOLD:int = 12`), and the web build's own
anti-cheat check, which is the direct analogue of the Android line the surveyor quoted:

```
reference/decompiled/shs3_payload/scripts/§1t406s0§.as
1544:  if(§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9413s0§) > 300 && §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9426s0§) < 9)
1549:  if(§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9413s0§) > 3   && §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9426s0§) < 1)
1581:  if((§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9413s0§) - 3) / 25 > _loc3_)
```

v0.717: ceiling **300**, starting grant **3** Gold (`§1t1523s0§.as:1024
§1t7357s0§(§1t9413s0§,3);` in initNewPlayer, vs Android `setPlayerStats(STAT_HGOLD,0)`
at `StatsManager.as:706`), and line 1581 literally divides by **25** — the per-rebirth grant.

So for the target build: **3 + 8×25 + 100 = 303 Gold lifetime**, guarded at >300.
Not 60. And the forum was *right*, not wrong: the thread title "Rebirthing = 25 FREE
Gold" matches v0.717 exactly. The surveyor inverted the evidence and dismissed a
correct source. Two further problems with that parenthetical: (a)
`KONGREGATE_FORUM_FINDINGS.md:399` does not *assert* 25 gold — the string is the
hyperlink title of a cited thread inside a bullet about Golden Tokens; (b) the
lane's own §0 caveat about build parity should have caught it.

**What survives:** blocker ④ *is* closable — an offline premium-Gold faucet exists in
the client. That half of the claim is a real, valuable overturn of the ledger. Only the
numbers and the forum-contradiction are wrong.

### R2 (MATERIAL) `meta-social/two-token-pools-quantified` — the Duel-Token cap is 40 in v0.717, not 30

Android `StatsManager.as:166 MAXDUELTOKENS:int = 30;` resolves verbatim. The web build's
same constant, in the same declaration order (APINTERVAL 60 → DTINTERVAL 2*60 →
WARMOVEINTERVAL 60*60 → MAXQUESTS 7 → MAXDUELTOKENS → MAJORCUSTOMCLANTHRESHHOLD 40):

```
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as
192:   internal static const §1t9396s0§:int = 60;       <- APINTERVAL
194:   internal static const §1t9397s0§:int = 2 * 60;   <- DTINTERVAL
196:   internal static const §1t9398s0§:int = 60 * 60;  <- WARMOVEINTERVAL
198:   internal static const §1t9399s0§:int = 7;        <- MAXQUESTS
200:   internal static const §1t9400s0§:int = 40;       <- MAXDUELTOKENS  ***40***
```

`§1t9400s0§` is used as the DT clamp (`:1401 if(getStat(DUELTOKENS) > §1t9400s0§)`,
`:1405 setStat(DUELTOKENS,§1t9400s0§)`, `:2079`) and is rendered as the denominator of
the token readout: `§1t6519s0§.as:827 … §1t9416s0§ + "/" + §1t9400s0§`.

Independently corroborated by the **web** data file the lane itself cites elsewhere:
`reference/extracted/itemdata.xml` line 402, item **2127**, resolves to
**"40 Duel Tokens"** — a premium SKU that would overflow a 30 cap.

AP 30/30 @ 60 s and DT interval 120 s hold in both builds; DT start 20 holds
(`§1t1523s0§.as:1016 §1t7357s0§(§1t9416s0§,20);`). Only "hard cap 30" is wrong.

### R3 (MATERIAL) `meta-social/war-kill-cap-351` — the "11 named samurai" are live enemy PLAYERS, and they are not named anywhere

The arithmetic is real: summing `<qty>` over `reference/extracted/bindata/119_1t4646s0.bin`
gives `{400-block: 340, 700-block: 11} = 351`, 39 waves, 87 `<enemy>` elements. I
reproduced it. `WarHexUI.as:1719 var xml:XML = XML(new SurvivalModeData());` resolves.

But ids 700–710 have **no NPC row in either build**. I scanned both:

```
reference/extracted/npcdata.xml                 495 <npc>, max id 819, ids in 690-720: []
reference/extracted/android/125_Mobile_NpcData.bin  495 <npc>, max id 819, ids in 690-720: []
```

They are runtime-injected **online opponents**, written into the NPC list at battle start:

```
reference/decompiled/shs3_android/scripts/WarHexUI.as
1412:  npcXML.initDuelist(innerStrArray[1],…,innerStrArray[5],1,innerStrArray[0],false);
1413:  npcXML.id = 700 + i;                       <- one slot per enemy player in the sector
1523:  npcXML.id = 700 + i;                       <- same, PlayerIO path

reference/decompiled/shs3_android/scripts/QuestEngine.as
1041:  if(npcList[i].id >= 700 && npcList[i].id <= 710 || npcList[i].id == XMLNpc.INDEX_NPCHOLDER)
1043:     npcList.splice(i,1);                    <- function is literally clearPlayersInNPCData()
```

Same in the web build (`§1t7785s0§.as:1525`, `:1642`, `§1t5565s0§.as:528`). And war-rules
string 374 says it in prose: *"if enemy players are present in the sector, you will also
encounter them during battle."*

Consequences: (1) calling them "named samurai" asserts an identity for bare numeric ids
that resolve to nothing — the exact §2.1 trap; (2) for an **offline** rebuild the
payload-deterministic kill count is **340**, and 351 is only the ceiling when 11 real
opponents happen to be standing in the sector — i.e. the 11 are the *server* half the
lane elsewhere concedes is unrecoverable; (3) the achievement table agrees with 340, not
351: `114_Mobile_AchievementData.bin` id 58, `<stat>60018</stat><val>340</val>` →
*"Warrior III — Defeat 340 in a war room attack."*

Also wrong: "identical in the web v0.717 and Android payloads." The files are not
identical (`sha256 709d94cb…` vs `b56f8c6a…`) and **waves 33–39 differ in enemy pool**:

```
wave 33  web: <id>449|454|449|454|443</id>   android: <id>449|454</id>
wave 39  web: <id>451|456|451|456|443</id>   android: <id>451|456</id>
```

Only the `<qty>` totals coincide.

---

## HELD — 19 (spot-checks that survived)

| claim | what I opened | result |
|---|---|---|
| `flag-120-is-mislabelled-terrain-row` | `WarHexUI.as:2281-2307` verbatim; `HEX_CONTROLPOINT` occurs ONLY at `:316`,`:381` (setHexType), never in the modifier | HELD — and confirmed cross-build: web `§1t7785s0§.as:2119-2146` has the identical 1.5/1.2/1/0.75/0.6/0.5/0.25 switch and `+= 2` structure rule (web adds one extra guard, `&& owner != playerside`, for HEX_DEFENSE) |
| `world-board-63x72-byte-identical` | `shasum -a 256` → **both** `b9d152c046b66b59863c63dc9a0239867f8f9950cbea916cb03488f48e505aef`, 272 bytes; PIL decode: mode P, 63×72, exactly 2 colours, **735 white / 3801 black / 4536 total**; `WarSelectUI.as:82 mapWidth=63`, `:84 mapHeight=72`, `:173 getPixel(...) != 0` | HELD exactly as written (cite says lines 83-85; actual 82/84 — cosmetic) |
| `frame-prints-coordinate-system` | I cropped `frame_0090.jpg` (512×288) at (255,140)-(400,165) ×12 LANCZOS: reads **"KAKUCHI CASTLE TOWN, MAIN STREET / TERRITORY (24,52) SECTOR (3,0)"**; full-frame ×3 also shows **"TOWN PROSPERITY: +10"** | HELD. One framing nit: this is the **QUESTS panel's location readout**, not the war-room map UI. The coordinate system is the same one (`getTerrainValue` bounds `x>5\|\|y>5`, `hasTerritory` against the 63×72 mask), so the inference stands |
| `frame-proves-string-table-parity` | crops of `frame_0084.jpg` at (100,30)-(420,70)×6 and (100,50)-(420,250)×4 — "…ES 1/7 (JOINING A BATTLE)" and "…A CLAN, YOU CAN MAY SELECT AN ON-GOING BATTLE TO TAKE PART IN." word-for-word incl. the error | HELD as observation. **But the invariant did not need invoking**: the WEB payload states it directly — `§1t7924s0§.as:23 internal var max:int = 7;` with `case 7: getString(11016)`. Frame and web code agree; only the Android build has 6. And "proving the Android string table is v0.717's own copy" is over-broad — R1/R2 are counter-examples in the same class of data |
| `four-clans-named-led-located` | strings 275-278, 324-327 verbatim; `WarHexUI.as:1077-1089` colours 16711680/39168/26367/16776960 | HELD — and there is a **direct** binding the surveyor missed, better than the colour inference: `WarSelectUI.as:381-395` `if(side==1) sidename = getString(275) … side==4 → getString(278)`, plus `TerritoryData.as:694-709` pairing townSide 1-4 with `#FF0000/#00FF00/#00FFFF/#FFFF00` |
| `kisensu-domain-typo-in-shipped-data` | strings 324 and 327 both end "rules the domain in the North-East."; 325 South-East, 326 South-West | HELD verbatim |
| `ninja-services-priced-catalogue` | parsed every cited `itemdata.xml` block and resolved through `strings.json` — 2100/2101/2102 @1/2/3 Gold = Small/Medium/Large Soldier Pill; 2125/2126/2127 @1/2/3 = 10/25/40 Duel Tokens; 2203 @5 Writ of Release; 2208 @1 "1000 coins"; 2212 @5 Clan Deed; string 609 "Buy 1000 coins for 1 gold?"; string 100 "…10 more AP for 1 Gold?" | HELD, all 16 rows. Cited line numbers point at the `<item>` open tag (index convention), one line above `<id>` |
| `chikako-affinity-meter` | `InteractUI_chikako.as:24 expArray=[0,10,30,60,100,150]`, `:26 maxLevel=5`, `:40 getXP() = STAT_CHIKAKOLOVE + QuestEngine.getAchievementScore()`; `StatsManager.as:2722-2723`; `NetworkManager.as:2306 m.type == "refunded"`; string 723 verbatim | HELD. Nit: the refund *roll* arrives as a server message, so the payout probability is **not** recovered — only the input meter is |
| `rank-ladder-thresholds-and-moves` | computed `getWarRank` cumulatives: 36/84/180/324/516/816/1176/1596/2076/5000 ✓; `getMaxWarMoves` returns 3,4,4,4,4,5,5,5,5,5,6 ✓; `:162 WARMOVEINTERVAL = 60*60` ✓; `:826` coin/1000 ✓; strings 330-339 + 403 ✓ | HELD — **and cross-build clean**: the web `§1t1523s0§.as` carries the same `12*3 + 12*4 + 24*4…` chain (7 matches) and `< 5000` at `:1225` |
| `achievements-61-resolved` | parsed `114_Mobile_AchievementData.bin`: exactly **61** `<achievement>`; row 0 verbatim as quoted; id 45 stat 60022 val 10 "Chi Master"; id 46 stat 60023 val 9 "Ninja Master"; id 58 stat 60018 val 340 "Warrior III"; id 60 "Be Awesome / Completed Season 1" | HELD, every spot-check |
| `daily-reward-table` | `InteractUI.as:1139 case "dailyprize"`; the 24 h set, the %30 → `Math.random()*10` over 2130,2131,2132,2133,2135,2136,2137,2138,2139,2146, the %10 → `Math.random()*6` over 1000 coins/2101/2105/2126/2127/+1, and `:1247 dice = Math.random()*36` with ≤4→100, 5→200, 6→300 — all verbatim | HELD. Two inner line numbers off by one (`:1152`→1153, `:1207`→1208); `:1247` exact; the range cite `1139-1375` resolves |
| `structure-costs-and-donation-rate` | `WarHexUIBuildMenu.as` getDesc: 10000 / 5000 / 10000 / 10000, HQ costless; `WarHexUI.as:1291 buildcost = 500;` and the donation path **does** burn a move — `:1301 changeStat(STAT_GOLD,-buildcost)`, `:1302 changeStat(STAT_WARCOINSDONATED,buildcost)`, `:1304 useWarMove(1)`; `:1332` startBuild; castle gate `3 * 60 * 60` in `WarHex.as` | HELD. Ledger line confirmed at `SHSD_MASTER_REFERENCE.md:171` |
| `six-actions-understated` | 10× `useWarMove(1)` in Android `WarHexUI.as`; the web equivalent `§1t7785s0§.as` also has **10** call sites (1105, 1197, 1233, 1304, 1334, 1370, 1493, 1917, 2391, 2444 — two of them two-arg) | HELD cross-build. Missed: string 372 also states **"the clan will pay the player 5 coins per move made"** and that arrows are the *blocked-neighbour* fallback |
| `survivalmode-is-the-warroom-wave-table` | `WarHexUI.as:13 SurvivalModeData:Class = WarHexUI_SurvivalModeData`, `:1719`, remap block `:1735-1752` verbatim | HELD — genuinely re-homes S0-1's "orphan game mode" |
| `section6-live-clan-war-overbroad` | ledger `REBUILD_READINESS.md:349` quoted exactly; string 376 verbatim; `:1052 deployvalue = 100 * getTerrainModifier()`; `:1104 num = 80 + Math.random() * 40 * getTerrainModifier()` | HELD |
| `xp-curve-l11-80-recovered` | Android `StatsManager.as:78`, 99 entries, `[9]=25900 [10]=31400 [79]=4025800`, last 29395800; ledger `:350` quoted exactly; string 4155 verbatim; `StatsManager.as:76 levelCap = 80` | HELD — and **stronger than cited**: the byte-identical 99-entry array is in the WEB payload at `§1t1523s0§.as:364` (I diffed them: `equal: True`), so this one carries **no Android caveat at all** |
| `warroom-board-frame` (STILL_UNHELD) | I opened `reference/frames/Nr4fQstqHDM_map_contact.jpg` (1280×720, 100 cells) and read every cell — inventory, dialogue, overworld, duels, YOU WIN cards. No hex board anywhere | Honest and correct |
| `war-rules-page-7-content` (STILL_UNHELD) | `strings.json` max numeric key = **9010**; 11016/11017 absent | Honest — **and now upgradeable to a cited gap**: the ids are confirmed real at `§1t7924s0§.as:122-123`, and the content is unrecoverable for a structural reason worth banking (below) |
| `rival-clan-ai` (STILL_UNHELD) | `SHSD_MASTER_REFERENCE.md:177` says it; I grepped all 17 `War*.as` + `Territory*.as` — the only "strategy" hits are `TERRAIN_FIELD/FOREST/MOUNTAIN` enums | Honest and correct |

---

## New findings the surveyor missed

1. **`meta-social/web-rebirth-25-100`** — v0.717 rebirth grants 25 Gold (100 at Dan 8), start 3, anti-cheat ceiling 300. Overturns the ledger AND the survey's own claim 8. `§1t1523s0§.as:2646,2651,1024` + `§1t406s0§.as:1544,1581`.
2. **`meta-social/web-duel-token-cap-40`** — v0.717 DT cap is 40. `§1t1523s0§.as:200`, `§1t6519s0§.as:827`, corroborated by web `itemdata.xml` item 2127 "40 Duel Tokens".
3. **`meta-social/700-block-is-live-players`** — ids 700–710 are enemy-player slots, not NPCs. `WarHexUI.as:1413`, `QuestEngine.as:1041`, plus zero npcdata rows in 690–720.
4. **`meta-social/web-warrules-7-pages`** — the WEB build states `max:int = 7` and `case 7: getString(11016)/(11017)` outright (`§1t7924s0§.as:23,122-123`). The frame-vs-Android conflict is settled by A2, not only by the frame.
5. **`meta-social/web-lang-is-network-loaded`** — the web `LangManager` (`§1t1521s0§.as`) imports `URLLoader`/`URLRequest` and streams language data from the dead server. That is *why* no web string table exists on disk, and it makes page 7 permanently unrecoverable unless a v0.717 lang file is found in an archive. It is also the structural reason every Android string in this lane must stay labelled.
6. **`meta-social/clan-pays-5-coins-per-move`** — string 372's last line: *"the clan will pay the player 5 coins per move made."* A war-room income rule absent from both the ledger and the survey.
7. **`meta-social/side-to-clan-bound-in-code`** — `WarSelectUI.as:381-395` binds side 1-4 to strings 275-278 directly; `TerritoryData.as:694-709` binds the same sides to `#FF0000/#00FF00/#00FFFF/#FFFF00`. (Note the UI colour disagreement with `WarHexUI.as`'s `0x009900`/`0x0066FF` — two different palettes for the same four sides.)
8. **`meta-social/xp-curve-is-web-native`** — the 99-entry XP array is in the WEB payload, byte-for-byte. Retires the Android caveat on the lane's biggest cross-lane overturn.

---

## Score

`78` is too high given R1 and R2. The two blockers the rationale leans on hardest — ③'s
token third and ④'s gold faucet — are both closed with **wrong numbers for the target
build**, and the rationale's boldest sentence ("both disputed 'Ready' numbers are now
positively resolved") is half wrong: `flag +120%` is genuinely killed, `kill cap 350` is
not "measurably 351". Everything structural (topology, achievements, daily table, ranks,
costs, terrain) is solid and *is* worth a large jump from 31. **Suggested: 66–70**, with
a standing rule for this lane: *no Android number ships without a web-payload check —
the check is cheap, and it has now failed three times in a row.*
