# t1-overturns-06 — HUNTER LENS review

Packet: `docs/gauntlet/L0/worklist/t1-overturns-06.json` · 24 claims · **24 judged, 0 skipped.**
Every verdict below rests on an artifact **I** opened in this session. No claim was judged from prose.

Severity key used in the structured return:
- `minor` — claim HELD, overturn honest, no defect found.
- `material` — claim HELD but the **overturn is inflated**, or a false rider travels with it.
- `fatal` — the claim itself is false.

Headline: **0 of 24 claims are false.** This packet is unusually clean on facts.
**7 of 23 claimed overturns do not land** (`overturn_upheld=false`) — they are true statements
pointed at a ledger sentence they do not falsify. That is where the value of this pass is.

---

## Scoreboard

| # | id | refuted | overturn | severity |
|---|---|---|---|---|
| 0 | meta-social/web-daily-prize-rolls-differ | no | ✅ | minor |
| 1 | meta-social/web-duel-token-cap-40 | no | ❌ | material |
| 2 | meta-social/web-rebirth-25-100 | no | ✅ | minor |
| 3 | meta-social/web-rebirth-faucet-25-100-300 | no | ✅ | minor |
| 4 | meta-social/web-rebirth-grants-25-and-100-gold | no | ✅ | material (false rider) |
| 5 | meta-social/web-survival-table-differs-in-composition | no | ✅ | minor |
| 6 | meta-social/world-map-tiers-and-level-gating | no | ❌ | material |
| 7 | meta-social/xp-curve-has-a-web-cite | no | ✅ | minor |
| 8 | meta-social/xp-curve-in-web-build | no | ✅ | minor |
| 9 | meta-social/xp-curve-is-in-the-web-build | no | ✅ | minor |
| 10 | meta-social/xp-curve-is-web-native | no | ✅ | minor |
| 11 | npcdata/five-stances-reversed-and-dual | no | ❌ | material |
| 12 | npcdata/hp-less-combat-rows-default-to-1 | no | ❌ | material |
| 13 | payload/repair-weapon-cost-is-a-template-not-a-constant | no | ✅ | minor |
| 14 | progression/elemental-damage-bypasses-def | no | n/a | minor |
| 15 | progression/elemental-def-crosswheel | no | ✅ | minor |
| 16 | progression/full-xp-table-recovered | no | ✅ | minor |
| 17 | progression/mining-pipeline-zero-xp | no | ✅ (scoped) | minor |
| 18 | progression/no-gather-xp-path-exists | no | ✅ | minor |
| 19 | progression/per-point-two-frame-delta | no | ❌ | material |
| 20 | progression/procgen-quest-xp-formula | no | ✅ | minor |
| 21 | progression/quest-xp-sum-kills-blocker2-rationale | no | ✅ | minor |
| 22 | progression/second-frame-confirms-plus3-per-point | no | ❌ | material |
| 23 | progression/second-xp-curve-mastery-ranks | no | ❌ | material |

---

## The seven inflated overturns (LENS 2b)

### #1 `web-duel-token-cap-40` — TRUE, but a **cap is not a cost**
Verified myself: `§1t1523s0§.as:200 internal static const §1t9400s0§:int = 40;`, used as the duel-token
ceiling at `:1401` (`if(get(§1t9416s0§) > §1t9400s0§)`, `§1t9416s0§:int = 15` at `:234` = STAT_DUELTOKENS)
and rendered "n/40" at `§1t6519s0§.as:827`. Android's slot is `StatsManager.as:166
MAXDUELTOKENS:int = 30`, and the surrounding block aligns one-for-one (60 / 2*60 / 60*60 / 7 / **cap** / 40).
The claim is exactly right.
**But the ledger sentence is `③ achievements list, daily-reward table, token costs`.** "Token costs" means
what things *cost* in tokens (cf. `:336` "Ninja-Services Achievements + Daily Prize + **token costs**",
`:215 ④ token/tournament economy numbers`). A hard cap of 40 supplies no price. The sentence's token
third survives untouched. `overturn_upheld=false`.

### #6 `world-map-tiers-and-level-gating` — TRUE frame, wrong target sentence
I opened `reference/frames/zFtCaTO0_1M/map/frames/frame_0025.jpg` (512×288, ×3 LANCZOS, whole frame).
Everything claimed is visibly there: header `NAGANO (26,52) LEVEL: 9`, `ZOOM OUT`, the vertical
`WORLD MAP` rail, the legend `VILLAGE TOWN CITY CASTLE TOWN DESTROYED QUEST`, the two-line colour key
`GREY TERRITORIES - LEVEL TOO LOW / RED TERRITORIES - LEVEL TOO HIGH`, and yellow/blue/red/green clan
flags on settlement tiles. Corroborated in code: `WorldMapUI.as:154-168` sets exactly those six legend
labels from strings 450/451/452/453/769/811 and 768.
**But the target sentence is `:245 ② War-Room map topology (board/adjacency)`.** A single viewport
around one territory gives tile *vocabulary* and level *colouring*; it gives neither which cells exist
nor how they connect. The sentence still stands on its own terms. `overturn_upheld=false`.
→ The topology *is* recoverable, but from somewhere else entirely — see **N2** below.

### #11 `five-stances-reversed-and-dual` — TRUE and stronger than filed, but the ledger's stance content is player-facing
Verified: `EnemyElite.as:160-167`, `EnemyPlayer.as:836-840`, `FriendlyElite.as:83-87` all dispatch
`getMastery(1500)→REVERSED_STANCE` / `getMastery(1501)→DUAL_STANCE`; `MCSPlayer.as:27-35` defines five
stance ids 0-4; `95_MCSCharacter_ReversedStanceAnimationData.bin` and
`101_MCSCharacter_DualStanceAnimationData.bin` ship alongside 97/106/108. `skilldata.xml` gives 1500/1501
category 11 with empty `<chi>/<cooldown>/<desc>`. npcdata carriers verified — and there are **seven**, not
four: 1500 → Aboshi (:3662, :3683, :4349), Magoichi (:3898, :4290); 1501 → Gojo Takamori (:3934, :3956).
It also holds in the **WEB** build, which the finding did not claim: `§1t4906s0§.as:90-96` with
`§1t12224s0§=4` (reversed) and `§1t12223s0§=3` (dual).
**But** the quoted `ledger_text` ("Stance system = 3 stances (light / balanced / heavy)") **does not exist
in REBUILD_READINESS.md** — I grepped. The doc's actual stance content is player-facing (`:74` damage math,
`:155` three-entry stance tables, `:169` three ring colours), and **`MCSPlayer.as:2975-3016 nextStance()`
cycles Light→Balanced→Heavy→Light for a normal player**; the five-state cycle is gated behind
`StatsManager.consoleEnabled`. So a three-state **player** stance model is *not* "short two".
`overturn_upheld=false`. The finding is still one of the most valuable in the packet.

### #12 `hp-less-combat-rows-default-to-1` — TRUE census, but it **confirms** the ledger, it does not overturn it
I reproduced the census exactly: `XMLNpc.as:143-149` is verbatim `if(xml.hp.toString() != "") … else this.hp = 1;`;
495 `<npc>` blocks; **22** carry `<ai>` with no `<hp>`; **12** of those carry `<skills>`, at
questdata-side lines 3365, 3424, 3760, 3777, 3863, 3884, 3917, 3939, 4021, 4256, 4275, 4293 — the packet's
list, unchanged; none has a top-level `<lvl>`; Gojo Takamori (npc 190) carries 14 skills.
**But** the quoted `ledger_text` ("per-enemy HP authored for all combat NPCs") is **not in
REBUILD_READINESS.md either**. The ledger says the opposite: `:220 ② per-enemy HP` is an open blocker and
`:133` lists it as a gap. This finding *agrees with* the ledger and overturns a sibling packet claim, not
the document. `overturn_upheld=false`.
→ Its honest open question ("where their real HP and level come from at spawn") **is now closed** — see **N7**.

### #19 `per-point-two-frame-delta` — TRUE, and I re-read both frames myself; it **confirms** the sentence
I pulled `reference/videos/zFtCaTO0_1M.mp4` at `-ss 653.0` and `-ss 1600`
(`crop=iw*0.55:ih*0.35:iw*0.42:ih*0.12`, ×2 lanczos) and read every value:
- 653.0 → badge **3**, `2098 / 2950 EXPERIENCE POINTS`, `AVAILABLE STAT POINTS: 0`, HP 20/20, CHI 10/10, AP 30/30, ATK 7, DEF 7 **+ 2** (orange), SPD 4.
- 1600 → badge **4**, `5110 / 5150`, `AVAILABLE STAT POINTS: 0`, HP 20/20, CHI **9/15**, AP 15/30, ATK **10**, DEF **10 + 13**, SPD 4.

Delta over exactly one level with zero unspent at both ends: Chi max **+5**, ATK **+3**, DEF base **+3**.
Web magnitudes (`§1t5957s0§.as:3394/3406/3414/3422/3434/3443`) = +10HP / +5Chi / +5AP / +3ATK / +3DEF / +3SPD
per point → **3 points**, exactly the per-level grant (`§1t1523s0§.as:2075 §1t9713s0§(§1t9419s0§,3)`).
Android magnitudes (`StatsManager.as:1669-1683`) = MAXHP+5 / MAXCHI+5 / MAXAP+1 / everything-else **+1**
→ **7 points**. The finding's arithmetic is exactly right and this is the hardest proof in the packet that
v0.682 is a decoder ring, not the tuning source.
**But** the target sentence `:199` is the progression **"Ready:"** list — `+3 stat/+1 skill/full refill per
level; +10HP/+5Chi/+1AP/+3-stat per point`. The delta **agrees** with every term it touches. Upgrading the
*evidence* for a line is not overturning it. `overturn_upheld=false`.

### #22 `second-frame-confirms-plus3-per-point` — TRUE, but the +1AP correction is **not on its cites**
`A-02-dojo-tutorial-3-stances-chi-punch-on-dum.md:24` and `:25` are verbatim as quoted (I opened the file;
93 lines). `§1t5957s0§.as:3422/3434/3443` are indeed ATK+3 / DEF+3 / SPD+3.
**But** the sentence's error is the `+1AP` term, and none of this finding's cites touches AP. The AP line is
`§1t5957s0§.as:3413-3414` → `§1t1523s0§.§1t9609s0§(5)` → `§1t1523s0§.as:2807-2810 changeStat(§1t9415s0§, 5)`
with `§1t9415s0§:int = 14` = STAT_MAXAP. **AP is +5 per point in the web build.** That is a real overturn —
on *my* cite, not theirs (filed as **N5**). Also loose: "CHI 10/10 and AP 30/30 … confirm the start pools
directly" — A-02's panel is at level 3 with points already spent (HP reads 20/20, not the start pool's 10),
so it confirms only that no points went into Chi or AP. `overturn_upheld=false`.

### #23 `second-xp-curve-mastery-ranks` — TRUE and a genuine new system, but §2 is **already** declared stale
Every element verified: `§1t29s0§.as:30` is the 11-entry `[0,300,900,2100,4800,10200,21000,42600,85800,172200,345000]`;
`:326-328` selects `§1t5923s0§` for bar `§1t24s0§.§1t8755s0§ = 0` and this second array for the rest;
`§1t7329s0§` at `:424-438` takes the max over bars 1..5 (`while(_loc2_ < §1t8761s0§)`, `§1t8761s0§ = 6`);
the ladder `§1t7210s0§` at `:440-487` runs E, E+, D, D+, C, C+, B, B+, A, A+, S; `:24 §1t12495s0§ = 10`;
`strings.json:1774` is `"8133": "Heavy Stance Mastery Level 10."`. **Web-only confirmed**: `grep 345000|172200`
over `shs3_android/scripts/` returns nothing and no `"A+"` ladder exists there. The 22xxx string ids it calls
are genuinely outside the Android table (max numeric id = 9010).
**But** the target is the §2 table row `:127`, and the document's own staleness banner (`:21-39`) already says
"**The scores in §2 are therefore stale, not merely conservative** … treat §2's numbers as a floor". Finding an
unlisted system *confirms* the banner rather than falsifying the row. `overturn_upheld=false` — file it as a
new system (like S0-1's `survivalmodedata`), not as a ledger overturn.

---

## The sixteen that land

**#0 daily prize.** `§1t401s0§.as:1216-1219` — `var _loc1_:int = 37 + this.§1t5864s0§.getLevel(); var _loc2_:int = Math.random() * _loc1_;`
reached from the daily handler `§1t3544s0§` at `:1623-1626` (the `else` branch, `:1625 this.§1t5891s0§();`). `:1535 _loc4_ = Math.random() * 10;`
under `(_loc2_ - 1) % 30 == 0`; `:1588 _loc4_ = Math.random() * 8;` under `% 10 == 0`; 24 h cooldown at `:1527`.
Android side read directly: `InteractUI.as:1247 dice = Math.random() * 36;` (fixed, not level-scaled),
`:1217 * 6` (not 8), `:1163 * 10` (matches). Claim exact. Overturn lands on the daily-reward third of `③`.

**#2/#3/#4 rebirth faucet.** `§1t1523s0§.as:2638-2656` — `if(get(§1t9426s0§) == 8) { change(§1t9413s0§,100) } else { change(§1t9413s0§,25) }`,
with `§1t9413s0§:int = 12` (`:228`) = STAT_HGOLD and `§1t9426s0§:int = 25` (`:254`) = STAT_DAN, matching
`StatsManager.as:194 STAT_HGOLD:int = 12` / `:220 STAT_DAN:int = 25`. Android `doRebirth` at
`StatsManager.as:2195-2212` grants **20 / 5**. Exactly 5×. New-character grant `§1t1523s0§.as:1024
setStat(§1t9413s0§,3)` vs Android `:706 setPlayerStats(STAT_HGOLD,0)`. Anti-cheat `§1t406s0§.as:1544 > 300 && DAN < 9`;
8×25 + 100 = 300 exactly. `KONGREGATE_FORUM_FINDINGS.md:308` ("25 gold is awarded EVERY rebirth, rising to 100
gold on the 9th") is **vindicated**, not refuted. And an exhaustive grep of `§1t9413s0§` across the web payload
returns only these sites plus the purchase helper `§1t9614s0§` (`:2854-2890`) — **rebirth is the only
non-purchase gold faucet in the build**, which makes blocker `④` close outright.
⚠️ **False rider on #4**: its lane_impact says "the Android >60-Gold reportHack ceiling has no web equivalent."
It has one — `§1t406s0§.as:1544`, same `updateHUD` position as `OverworldHUD.as:1333`, threshold 300 not 60.

**#5 survival table.** Both files opened. `diff` gives **28 changed lines, every one inside `<id>`** (I ran it;
`grep -v '<id>'` over the diff returns 0). Both: 39 `<wave>`, 87 `<enemy>`, Σ`<qty>` = **351**, buckets
`{400: 340, 700: 11}`. Seven late waves differ (pairs at x=-50/x=1650 on lines 466/471, 479/484, 492/497,
505/510, 518/523, 531/536, 544/549). The "168-line unified diff" is a tooling detail; `diff -u` default gives 107.
Substance holds. **The overturn is sharper than filed — see N3.**

**#7/#8/#9/#10/#16 XP curve.** `§1t1523s0§.as:364` (the class whose `:36` is `§1t9323s0§:Number = 0.717;`) parses to
99 entries, `[9]=25900`, `[10]=31400`, `[79]=4025800`, tail `25395800, 29395800`; a **second copy** sits at
`§1t29s0§.as:28`. Element-wise compare against `shs3_android/scripts/StatsManager.as:78` (and the identical
`shs3_android_payload` copy): `IDENTICAL True`. `levelCap:int = 80` at `StatsManager.as:76`. Consumption sites
`§1t1523s0§.as:2013 / 2024 / 2029` confirmed. §6's `:350` "no table published … keep the extrapolation labeled
INFERRED" falls, on a **web** cite, with no build caveat. Five near-duplicate claims, all correct.

**#21 quest-XP sum.** My own count: 69 `<exp>` rows in `questdata.xml`, sum **79,890**; values only
{100,200,250,290,500,600,750,1000,2000,3000}. `expArray[17] = 80300`, and the game's own
`getLevel()` (`StatsManager.as:1586-1596`: first `q` with `expArray[q] > XP`) returns **17** for 79,890 —
the claim's level is exactly right, not approximately. 142 `<minlvl>` rows in `itemdata.xml` confirmed.
Blocker `②`'s parenthetical "a solo build probably can't reach L11+ offline" is false on the content.
⚠️ Caveat worth carrying: quest turn-in was server-mediated, so "a solo offline player" is a statement about
authored content, not about a reachable offline run.

**#13 repair cost.** `strings.json["848"]` = `Repair your currently equipped weapon?\nCost: [0] coins` — one slot,
no material line; siblings `["845"]`/`["850"]` as quoted. I opened both frames:
`Nr4fQstqHDM/seg-10/frames/frame_0040.jpg` (crop 0,370–1024,576 @1.46×) renders
`FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE`, and `frame_0042.jpg`
renders string 850 verbatim with `COST: 5000 COINS / 1 SILVER ORE`. The finding is right that it is a template.
**It under-claims: the formula is on disk — see N4.** Overturn on `:215 ③` lands, harder than asked.

**#14/#15 elemental pipeline.** `MCSPlayer.as:3347-3350` subtract the four element defs; `:3351-3357` floor each at
1 (if the attack carried that element) else 0; `:3415 damage -= this.getDefense();` `:3416-3419` min-damage floor;
`:3420 setHP(getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));`. The behead branch is the
second copy at `:3709-3718` — `:3714 if(behead)` `:3716 damage *= 1.5;` `:3718 setHP(...)`. Web mirror
`§1t99s0§.as:3484-3489` — `_loc17_ = _loc5_ + _loc7_ + _loc9_ + _loc8_ + _loc10_;`. Cross-wheel at
`StatsManager.as:1836`: `initElementDefenseStats(WATERATK+FIREDEF, EARTHATK+WINDDEF, WINDATK+WATERDEF, FIREATK+EARTHDEF)`;
web `§1t1523s0§.as:2270` has the **identical argument order** with `§1t1235s0§=28 … §1t1242s0§=203` (`:260-294`)
matching `StatsManager.as:226-256` one-for-one. Blocker `:205 ②` dies.
**Independent corroboration I found:** `KONGREGATE_FORUM_FINDINGS.md:312` — "Element strength cycle:
Water > Fire > Earth > Wind > Water" — is exactly what that argument order encodes. Forum and payload agree.

**#17 mining.** `NodeUI.as:554-563 runMine` (`:558 startProgress(24, ACTION_MINE)`), `:565-608 doMine` — oreType 1-8 →
items 20059-20066, `if(oreType != 1) clearOre()`, `updateWeaponUse(1)`, `reportAchievementStat(60003,1)`, and
**no `addLootXP` and no `changeXP` in the function** (I read the whole body). `Obj_OreDeposit.as:46` pickaxe gate
(stat 59 ≠ 13022 → string 651), `:51` broken-weapon gate (663), `:57-62` the skill ladder
(`getStat(1022)`; 8≥5, 7≥4, 6≥3, 5≥2, 3≥1 — Rock/Coal/Tin ungated), `:63-67` AP gate, `:70-77` the flat 50 % whiff
(`oreType != 2 && int(Math.random()*2) != 0 → runMine(1)`). Strings 650-659 and items 20059-20066 resolve exactly
as quoted. Overturn on `:225 ②` lands for **mining**; respawn I closed separately (**N8**), farming is untouched
by this finding but is also on disk (**N9**).

**#18 no gather-XP path.** I re-ran the grep: exactly **13** `addLootXP` hits, at exactly the 13 named lines. The
one non-loot path `InventoryUI.as:906 StatsManager.changeXP(item.modifierXML[i].value)` under `modid == 9` is
confirmed at `:901-906`. The enumeration missed one `changeXP` site — `OverworldHUD.as:2137` — but I opened it and
it is inside the `/setlevel` **dev-console** command (`:2132-2138`), so the shipped-gameplay enumeration stands.
⚠️ Build-parity hole the finding does not declare: this is entirely `shs3_android` v0.682. The web payload does
carry the same PvP term (`* 5 + 45` in `§1t122s0§.as:82/836` and eight sibling enemy classes), so the structure
transfers, but the 13-site enumeration was never re-run on the web build.

**#20 proc-gen quest XP.** `QuestGenerator.as:839` verbatim; `:916 rewardStr += "<exp>" + questReward + "</exp>";`;
`StatsManager.as:1604-1606 getXPLevelThreshhold`. Web parity at `§1t123s0§.as:878, :1039, :1283, :1522` and
`§1t27s0§.as:317`, all consuming `§1t1523s0§.§1t5928s0§` = `§1t1523s0§.as:2027-2030 return §1t5923s0§[param1];`.
I re-evaluated every value: 5→527, 6→500, 7→**473**, 8→462, 9→458, 10→454, 11→423. nodelvl 7 = (20900−16350)/9.6
= 473.958 → 473. **473 is absent from the 69-row table** (I have the full distinct-value list). The on-screen 473
is recorded three independent times in the video study — `B-16:22`, `B-16:26`, `B-18:16`, `B-18:31`, `B-28:46`,
`B-28:69`, `B-28:70` — always on a "expires at the end of the day" quest, i.e. a proc-gen daily, and
`B-18:32` records the XP bar moving `24881 → 25354` (+473 exactly). Overturn on `:200 ④` lands on the quest leg.

---

## New findings (LENS 2a — things nobody in this packet claimed)

**N1 — the achievements list is HELD.** `reference/extracted/android/114_Mobile_AchievementData.bin` is plain
UTF-8 XML: `<achievementdata>` with **61 `<achievement>`** rows, each `<id>/<img>/<name>/<desc>/<stat>/<val>`.
Names resolve through the string table: 8000 "Duelist I" (`stat 60000, val 1`), 8003 "Killer I"/"Defeat 100
enemies." (`60017, 100`), 8006 "Eye of the Beheader I", 8058 "Warrior III"/"Defeat 340 in a war room attack.",
8060 "Be Awesome"/"Completed Season 1". Descriptions are `name id + 80`. **The `achievements list` third of
ledger `:245 ③` is closed from a file already on disk, no Ruffle session involved.**

**N2 — the world-map / War-Room board topology is HELD, and it is a bitmap.**
`reference/extracted/android/110_Mobile_MapBitmapData.bin` is a **63×72 GIF**, 2 colours, **735 white pixels**
on black — a pixel silhouette of Japan (Hokkaido, Honshu, Shikoku, Kyushu and the Ryukyu chain all legible when
scaled ×8). `WorldMapUI.as:206-208 hasTerritory()` = `mapBitmapData.getPixel(territoryx + TERRSHIFTX -
WARMARKERSHIFTX, territoryy + TERRSHIFTY) != 0`, with `WarSelectUI.as:15/17/19` giving
`WARMARKERSHIFTX = 8, TERRSHIFTX = 21, TERRSHIFTY = 51`; `getHexOwner` at `:371-390` keys ownership by
`mapid = (x+341) << 12 | (y+341)`; `QuestEngine.as:1206` uses the same mask.
**Cross-validated against the frame:** the displayed `NAGANO (26,52)` from `frame_0025.jpg` maps to
`getPixel(26-8, 52) = getPixel(18,52)` — which I read as `(255,255,255)`, land. **735 territories, a W×H grid
with holes, adjacency = grid neighbours.** This overturns `:245 ② War-Room map topology (board/adjacency)`,
`:115` ("not a grid you can generate from W×H" — it *is* a grid, plus a mask), and `:225 ①`'s close-path
("trace the map image" — the image is already extracted).

**N3 — the kill cap is 351, not 350.** `SHSD_MASTER_REFERENCE.md:170` reads `Kill cap (troops) | 350
(= 340 troops + 10 samurai)` and `REBUILD_READINESS.md:244` carries it as `kill cap 350`. Measured from
`reference/extracted/bindata/119_1t4646s0.bin` (and the identical Android `109_...`): the 400-block sums to
**340** and the 700-block to **11** (ids 700-710, one each) = **351**. Corroborated from the other side by
achievement 8058 "Defeat **340** in a war room attack." — the troop half is right, the samurai half is off by one.

**N4 — the Repair-Weapon cost formula is on disk: `nodeLevel × 10` coins.**
`InteractUI.as:620-621` sets `level = StageManager.getCurrentNodeLevel()` capped at 80; then
`:647 this.detailstext.text = LangManager.getString(848,[level * 10]);`. The same block gives Forge =
`level * 100` (`:634 / :638 / :642`, iron <30, bronze 30-59, steel 60+) and Reinforce = flat 5000
(`:649-668`, silver ore <30, titanium ≥30). **Validated by frame**: `frame_0040.jpg` renders
`FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS` — 7 × 100 = 700 exactly, from the very line above the repair
line. Ledger `:215 ③ Repair-Weapon cost (never captured)` dies outright, and `:334`'s "read Repair cost" close-path
is already done. Repair at a level-7 node = **70 coins**.

**N5 — per-point AP is +5 in the WEB build, not +1.** `§1t5957s0§.as:3413-3414` spends one stat point and calls
`§1t1523s0§.§1t9609s0§(5)`; `§1t1523s0§.as:2807-2810` is `changeStat(§1t9415s0§, param1)` with
`§1t9415s0§:int = 14` (`:232`) = STAT_MAXAP. The full web per-point table, all six buttons read directly:
**MAXHP +10 · MAXCHI +5 · MAXAP +5 · ATK +3 · DEF +3 · SPD +3.** Ledger `:199` and `:77` both print `+1AP`.
That term is wrong. (Android's auto-allocator at `StatsManager.as:1669-1683` is +5/+5/+1/+1 — the `+1AP` looks
like an Android value that leaked into a web line.)

**N6 — the player's stance cycle is three, not five.** `MCSPlayer.as:2975-3016 nextStance()`: with
`StatsManager.consoleEnabled` it cycles all five (Light→Balanced→Heavy→Dual→Reversed→Light); without it,
`:3004-3014` cycles Light→Balanced→Heavy→Light. Reversed and Dual are enemy/NPC states plus a dev affordance.
This bounds finding #11 and should travel with it into any config.

**N7 — spawn level for the hp-less/lvl-less combat rows comes from the QUEST WAVE.**
`NPCManager.as:110-131` reads `wave[i].enemy[j].lvl` into `new NPCHolder(id,fatal,xpos,lvl)`;
`:407/411/433/437` pass `npcHolder.getLvl()` into `createEnemy/createObjective`, which call
`actor.setLevel(lvl)` when `lvl != 0` (`:877-879`, `:931-934`). **160 of 169 `<enemy>` blocks in
`questdata.xml` carry `<lvl>`.** Concretely: Gojo Takamori npc 190 spawns at **lvl 25**
(`questdata.xml:26101` id, `:26105` lvl), npc 191 at **35** (`:25862` / `:25866`), Magoichi npc 188 at 35,
npc 810 at 27. Friendlies never need one — `FriendlyElite.as:70` and `FriendlyArcher.as:58` call
`setLevel(StatsManager.getLevel())`, i.e. **allies scale to the player**; 7 of the 12 skill-carrying hp-less
rows are `ai 30`/`ai 34` = FriendlyElite/FriendlyArcher (`NPCManager.as:608-621`). `NPC.setLevel` at
`:239-259` then rescales `damage/defense/maxhp` by `lvl/level` and **hard-clamps all three to 1 when
`lvl <= 10`**. Finding #12's PARTIAL is closed.

**N8 — ore-node respawn rule.** `Obj_OreDeposit.as:80-87 clearOre()` calls
`StageManager.addToDeadList(objectName)`; `StageManager.as:621-625` pushes to `roomDeadList`, which
`GameStage.as:602-630 createRoomObjects` uses to suppress objects on room build. `roomDeadList.length = 0`
at `StageManager.as:249` (`initRooms`) and `:366` (node change) — **a mined-out node repopulates the next
time you enter the node.** That is the "respawn" third of `:225 ②`.

**N9 — the farm timers and patch ladder are on disk too.** `InteractUI_crops.as:116/131/146/161` give four crop
growth periods — **15 min / 1 h / 6 h / 12 h** — each with a `gracePeriod` window before the crop is lost;
`:457-479 getPatchLevel()` is a 6-rank patch ladder at 10/20/30/40/50 cumulative harvests, capped at 50
(`:105-107`). Together with #17 and N8 that leaves nothing of `:225 ②` standing except the per-crop yield rows.

**N10 — a stance counter-triangle worth ×1.2 is missing from the ledger's damage math.**
`MCSPlayer.as:3701-3707`: `if(this.stance == LIGHT && enemyStance == BALANCED || BALANCED vs HEAVY ||
HEAVY vs LIGHT) { damage *= 1.2; }` — applied **before** `damage -= getDefense()` (`:3709`). Ledger `:74`
records only "Heavy defender Defense ×0.8 (one way)". This is a three-way rock-paper-scissors on the
attacker's stance vs the defender's, and it is not in the doc.

**N11 — the recovered expArray is validated on camera, three times.** Video A `-ss 653.0` renders
`2098 / 2950` at level badge 3 and `expArray[3] = 2950`; `-ss 1600` renders `5110 / 5150` at badge 4 and
`expArray[4] = 5150`; `B-18-turn-in-and-hattori-kazushi-bounty-accep.md:32` records `24881/25900 → 25354/25900`
and `expArray[9] = 25900`. **Frame and payload agree** — the L11-80 table is not merely on disk, its low end is
independently confirmed by the primary reference. There is nothing left of `:350`.

---

*Method note: every artifact above was opened in this session with `sed`/`grep`/`diff`/`python3`/`ffmpeg`/PIL.
No packet cite was accepted on trust; the seven refused overturns were each checked against
`docs/research/REBUILD_READINESS.md` read in context, and two of them (#11, #12) quote sentences that are not
in that file at all.*
