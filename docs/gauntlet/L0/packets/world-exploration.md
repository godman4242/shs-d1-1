# LEDGER PACKET — `world-exploration`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**28 surviving overturns · 4 true-but-rejected · 64 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
| **world-exploration** | 35 | coord system, room graph, AP costs, travel methods, mining ladder | world map/geography; gather/farm yield tables; "day" length; save model |
### world-exploration — 35
- **Ready:** territory/sector coord system (start 21,51 / 0,3); node-based room graph + signposts; AP cost table (pick 1 / search+mine 2 / stable 5); 4 travel methods; mining ore-by-level ladder; minimap iconography; hidden-path system; prosperity ladder.
- **Blockers:** ① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.* ② gather/mine/farm **yield + whiff + respawn** tables. ③ real-world **"day" length** (governs expiry, farming, AP regen, war tick). ④ AP regen rate + cap. ⑤ sector↔room mapping rule (town=fixed sector vs wilderness=one-screen-per-sector).
- **Surface:** ZERO world numbers in config yet — needs new `world.ts`/`ap.ts`/`farming.ts` modules. Mining ore ladder + far-territory coords are sourced but missing from the digest.
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[actionscript/ap-and-war-clocks]]` — UPHELD [A2] (2 critics)

All real-time clocks are explicit and server time is counted in whole seconds: AP regenerates 1 per 60s (doubled by the AP buff), the second timed resource 'DT' 1 per 120s, and a war move accrues 1 per 3600s — and regen is offline-accruing arithmetic, not a live tick.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:158-162 (intervals), :1099-1104 (accrual + buff), :707 (start AP 30); units proved by QueryManagerBase.as:39 'new Timer(1000)', :111 'this.serverTime += 1;', :105 'new Date(this.serverTime * 1000)'`
- **KILLS this line:** "③ real-world "day" length (governs expiry, farming, AP regen, war tick). ④ AP regen rate + cap."
- **Lane impact:** L-world-exploration (blockers ③ and ④ closed — AP cap is STAT_MAXAP + bonus, rate 1/min), L-meta-social (the ledger's surface note '"moves per turn" reconciles as "per hour"' is CONFIRMED literally by WARMOVEINTERVAL = 60*60), L-economy.

### `[[actionscript/farming-and-prosperity-numbers]]` — UPHELD [A2] (2 critics)

Farming is a four-tier real-time crop system (15 min / 1 h / 6 h / 12 h) with a 900 s rot grace window, a 3x2 six-slot plot and a patch level advancing every 10 harvests to a cap of 50; town prosperity is a five-band step function at 0 / 500 / 1000 / 2000 / 4000 that drives town generation directly.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI_crops.as:41-47, :61-69, :105-107, :457-479, :548-558 · reference/decompiled/shs3_android/scripts/TerritoryData.as:782-805 · consumer DungeonGenerator.as:1363-1555`
- **KILLS this line:** "② gather/mine/farm yield + whiff + respawn tables. ③ real-world "day" length (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** L-world-exploration: the farm branch of blocker ② and blocker ③ closed (12 h is the longest timer in the game; there is no abstract 'day'); L-economy: the prosperity-threshold half of blocker ② closed. Gather/mine yields remain open from this lane.

### `[[android-blobs-hunter/bgdata-override-vocabulary-is-22-tags]]` — UPHELD [A2] (1 critic)

The per-background override vocabulary in 123_Mobile_BGData is 22 tags, not the four the packet lists, and three of the overrides break the default ladder in ways the defaults cannot predict. Measured over all 49 rows: id 49, name 49, ffcount/fcount/ppcount/gcount/fgcount 49 each, wrap 17, contentwidth 17, fscroll 16, ffscroll 14, fblur 11, fwrap 11, ppwrap 9, ppblur 9, ffwrap 8, ppscroll 6, fgscroll 3, ffblur 3, gscroll 2, fgblur 2, gblur 1. Two rows set <gscroll>0</gscroll> - a LOCKED ground plane; three rows set <fgscroll>1.2</fgscroll>, overriding the 2.0 foreground ladder value; one row sets <ffscroll>1</ffscroll>, collapsing the farthest plane onto the camera. <gwrap> and <fgwrap> are never authored, and neither is <groundy> or <flatground>.

- **Cite:** `reference/extracted/android/123_Mobile_BGData.bin - tag histogram over all 49 <bg> records (623 lines); field mapping at reference/decompiled/shs3_android_payload/scripts/XMLBG.as:58-140`
- **Build:** android v0.682
- **KILLS this line:** "android-blobs/bgdata-is-a-parallax-spec: 'Overrides present: ffwrap 6 rows (1640/1670/1750/1770/2000/2000), ffscroll 14 rows (0.05-0.27), fscroll 16 rows (0.1-1.0), contentwidth 17 rows ..., wrap 17 rows all 0.'"
- **Lane impact:** L6 art-anim + L1 world-exploration. A recreation that implements only the five default scroll/blur constants will render 49 backgrounds and get roughly twenty of them wrong. Also corrects two numbers in the banked claim: ffwrap is 8 rows (lines 12, 23, 259, 330, 356, 370, 514, 530), and ffscroll's range is 0.05-1.0, not 0.05-0.27.

### `[[bindata/place-name-table-is-dead-data]]` — UPHELD [A2] (2 critics)

bindata/98's 677 place names are DORMANT in the shipped world. getPlaceName gates the 26x26 lookup on `namex = territoryx % 137` being < 26, but every real territory's raw x lies in [329,389] (from the bitmap transform), so namex is always in [55,115]. getTownName1 is reached for ZERO of the 735 land territories. Every shipped place name is either a hardcoded exception or a getTownName2 compound: namestarting[78] concatenated with nameending[37], seeded RNG(territoryID*2). Anyone porting world naming from the 677-entry table will produce names the original never generated.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NameGenerator.as:145-166 + QuestEngine.as:522-526 + reference/extracted/bindata/98_1t4653s0.bin`
- **Build:** both
- **Lane impact:** L-world-map: refutes bindata/place-name-26x26-lookup's 'recovered whole'. The correct generator is the 78x37 compound, giving 2,886 possible names, deterministic per territory.

### `[[bindata/territory-to-bitmap-transform]]` — UPHELD [A2] (2 critics)

The 63x72 map bitmap and the 12-bit territory-ID space ARE reconciled, exactly, and the transform is entirely in the payload. The 12-bit fields are biased by 341, and the bitmap is offset by the constants WARMARKERSHIFTX=8, TERRSHIFTX=21, TERRSHIFTY=51. Collapsed: pixel_x = (id>>12 & 0xFFF) - 328, pixel_y = (id & 0xFFF) - 290. Every land pixel becomes one war-marker territory, so the 735 white cells ARE the shipped territory count; raw territory-x spans [329,389] and y spans [290,361], mapid spans [1347935, 1593647]. Proof: all three hardcoded towns land on land cells — Ibamaya 1405272 -> pixel (15,54), Gokura 1524045 -> (44,43), web-only Iwakuni 1519945 -> (43,39).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/QuestEngine.as:518-526, :1204-1206 + WorldMapUI.as:15,17,19,377 + WarSelectUI.as:15,17,19 + reference/decompiled/shs3_payload/scripts/§1t7934s0§.as:15,17,19 + §1t1524s0§.as:1463`
- **Build:** both
- **KILLS this line:** "| world-map | 63x72 bitmap and 12-bit territory ids at unreconciled scales |"
- **Lane impact:** L-world-map: refutes bindata/map-bitmap-vs-territory-scale-unreconciled and makes the world grid fully implementable. Also identifies the ledger's 'start coordinate (21,51)' as (TERRSHIFTX, TERRSHIFTY), the territory-space origin in bitmap pixels — not a coordinate at all.

### `[[bindata/trap-room-placement-and-level-gate]]` — UPHELD [A2] (2 critics)

Trap-room placement and difficulty are governed by exact shipped rules — a per-background placement dice and a level gate at 10 and 50 — and the level-50 band proves L11–80 is shipped content, not extrapolation.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/RoomGenNode.as:1918-1975,2380-2431`
- **KILLS this line:** "Surface: ZERO world numbers in config yet — needs new world.ts/ap.ts/farming.ts modules."
- **Lane impact:** world-exploration (extends run-3 C8 from 'the rooms exist' to 'here is how they are placed and tiered') + progression (the `lvl < 50` band is direct evidence the L11–80 range is real shipped content, bearing on progression blocker ②'s 'likely unrecoverable' framing).

### `[[bindata/world-map-bitmap]]` — UPHELD [A2] (2 critics)

reference/extracted/bindata/92_1t4648s0.bin is a 63x72 GIF89a whose 735 white cells are a boolean land mask of Japan — the world grid the ledger calls unrecoverable geography.

- **Cite:** `reference/extracted/bindata/92_1t4648s0.bin (md5 13068dfa1a5cc5628720a25782f93fed, byte-identical to reference/extracted/android/110_Mobile_MapBitmapData.bin)`
- **KILLS this line:** "① world bounds + geography (sparse Japan-outline, not a W×H grid) — mine Fandom Category:Territories via API; trace the map image."
- **Lane impact:** L-world-exploration: blocker ① is dead. World grid is exactly 63x72 with 735 traversable cells, held as a 272-byte payload asset. No wiki mining or map tracing needed. src/config/ has no world module at all today, so this is a straight import.

### `[[frames/HUNT-war-tick-is-24-hours]]` — UPHELD [A2] (4 critics)

Ledger blocker (3) asks for the real-world 'day' length that governs the war tick. It is written down: troops advance every 24 hours. The same rules pages also give the capture rule, win condition, five structure types, the 500-coin contribution, terrain advantage order and a 5-coins-per-move payout.

- **Cite:** `strings.json["376"], ["372"], ["378"], ["380"]; rendering verified at reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg, frame_0012.jpg, frame_0013.jpg`
- **Build:** android v0.682; the same pages render in web v0.717 (verified verbatim on frames 1/7, 3/7, 6/7)
- **KILLS this line:** "(3) real-world "day" length (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** meta-social, world-exploration, economy: the war-tick half of blocker (3) closes outright

### `[[frames/quest-card-expiry-prosperity-and-coords]]` — UPHELD [A1] (2 critics)

The quest log prints the three things §4 lists as blockers on one card: a calendar-day expiry rule stated in words, a full reward tuple including a Town Prosperity delta, and per-quest territory/sector coordinates.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0016.jpg (read whole @2.54x); second instance reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0057.jpg (@2.54x)`
- **Build:** web v0.717
- **KILLS this line:** "③ real-world "day" length (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** quests-story (blocker ③ coords + rewards), world-exploration (blocker ③ the day clock, at least for quest expiry), economy (prosperity is a quest-completion output)

### `[[frames/world-map-has-a-fifth-banner-colour]]` — UPHELD [A1] (2 critics)

The world-map ownership layer carries at least FIVE banner colours, not four: blue, gold, red, green AND a black banner bearing a white circular mon. A fifth side is exactly what the war-room code implies. Any rebuild modelling four factions from the clan-join screen will be missing an owner class.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg (crop 700,160-780,230 @15x LANCZOS; row context at crops 40,155-950,235 and 40,220-950,305 @1.65x)`
- **Build:** web v0.717
- **KILLS this line:** "the four canonical clans' identities in the war room"
- **Lane impact:** meta-social, world-exploration: model >=5 territory owners (four clans plus a neutral/shogunate side), not four

### `[[progression/ap-regen]]` — UPHELD [A2] (8 critics)

AP regenerates +1 per 60 seconds of server time, doubled by the AP buff, hard-stopped at MAXAP (which starts at 30 and is itself a spendable stat).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:158 and :1090-1115; web parity at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:192`
- **KILLS this line:** "④ AP regen rate + cap."
- **Lane impact:** CROSS-LANE GIFT to L10 world-exploration blocker ④ ("AP regen rate + cap") — closed. The cap is the MAXAP stat, whose cap formula is 30+(level+10)*5 (see progression/per-stat-hard-caps).

### `[[progression/mining-pipeline-zero-xp]]` — UPHELD [A2] (2 critics)

The complete mining pipeline is on disk and it awards ZERO XP — doMine() yields an item and nothing else — which closes the surveyor's PARTIAL and hands world-exploration its gather yield/whiff/gate table.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeUI.as:554-608 (runMine + doMine) and Obj_OreDeposit.as:40-78 (interact + gates); ore node names resolved at docs/gauntlet/L0/index/strings.json entries 650-659`
- **KILLS this line:** "② gather/mine/farm yield + whiff + respawn tables."
- **Lane impact:** L4: refutes progression/xp-from-gather-and-dungeon's PARTIAL — the gather-XP value IS held and it is zero, so payload and frame (A-04 line 32, 'XP bar unmoved ... no XP awarded from mining') AGREE rather than merely not contradicting. CROSS-LANE GIFT to L10 world-exploration blocker 2: full yield table (oreType 1-8 -> items 20059-20066), full skill-gate ladder (getStat(1022) >= 1/2/3/4/5 for Iron/Copper/Silver/Titanium/Diamond; Rock, Coal and Tin ungated), the whiff rule (flat 50% downgrade to Rock for every ore except coal), the consumption rule (nodes 2-8 cleared via clearOre(), node 1 repeatable), the 24-tick action bar, and the pickaxe / broken-weapon / AP preconditions. Also touches L7 economy: mining awards no coins either.

### `[[questdata/node-name-pipeline-END-TO-END]]` — UPHELD [A2] (2 critics)

The full on-screen node-name pipeline is held and I verified it end-to-end against shipped data. getNodeName() = direction-prefix + generated town name + background-type noun. Direction comes from the node's sector-within-territory: terrSector.y<=1 -> 'N', >=4 -> 'S'; terrSector.x<=1 -> 'W', >=4 -> 'E'. Background nouns are string ids 1002 Field / 1003 Forest / 1006 Road / 1015 Mountain Path / 1020 Beach / 1021 Cave / 1022 Waterfall. Worked proof: questdata.xml:15 <node>8382465</node> -> sector (2046,2049) -> territory (341,341) -> territoryId 1397077 -> getTownName2 = 'Kasuta'; terrSector.x = 0 -> 'W'; bg 4 -> 'Forest'; result 'W Kasuta Forest', which is exactly strings.json["1037"], the <name> stored on that node. Node 8726547 -> 'Yasuoka', matching strings.json["1039"] 'Yasuoka Forest'.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:296, :305, :314, :1637, :1694, :1701 joined to reference/extracted/android/112_Mobile_NodeData.bin:5-6 and reference/extracted/questdata.xml:15`
- **Build:** android v0.682 (packing arithmetic byte-identical in web v0.717 at shs3_payload/scripts/§1t136s0§.as:152-153)
- **Lane impact:** L8 world-exploration: closes the axis question the packet's node-packing claim left open. +4096 = one sector East, +1 = one sector South, 6x6 sectors per territory, display origin at territory 341.

### `[[world-exploration/ap-cost-table]]` — UPHELD [A2] (6 critics)

The real AP cost table is far larger than the ledger's three entries, and stables additionally charge (node level × 2) coins on top of 5 AP.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeUI.as:361,384,395,414,427,460,535 + Obj_OreDeposit.as getAPUse + Obj_DirectionSign.as:20,106-108 + InteractUI.as:1723,1736`
- **KILLS this line:** "AP cost table (pick 1 / search+mine 2 / stable 5)"
- **Lane impact:** L1 world-exploration: enter node 1 · world-map travel 5 · rest 1 (+100 HP/Chi) · camp 5 (+50 HP/Chi) · hunt 3 · fish 3 · search 2 · mine 2 · pick 1 · signpost 1 (0 inside a town interior room 14>roomid or roomid>=100, or a dojo) · quest step = per-step <ap>. The ledger's three entries are individually right but the table is 12 rows, and 'stable 5' omits the gold fare. The '4 travel methods' resolve to signpost / world-map / stables (adjacent-territory towns only, gated on hasTown() && isInBoundary()) / consumable teleport items (InventoryUI.as:980,1045; recall-to-start at :960,1067).

### `[[world-exploration/ap-regen-and-cap]]` — UPHELD [A2] (6 critics)

Blocker ④ "AP regen rate + cap" is dead: AP regenerates 1 per 60 real seconds (doubled under BUFF_AP), starts at 30, and max-AP is capped at character level + 30.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:158, :1100-1103, :707-708; InventoryUI.as:2409`
- **KILLS this line:** "④ AP regen rate + cap."
- **Lane impact:** L1 world-exploration: closes blocker ④. Regen is timestamp-based (nextAPUpdate) so it accrues offline. Cap gate is `getStat(STAT_MAXAP) < 20 + (charlevel + 10)`. Gold faucet is 10 AP for 1 Gold (strings.json id 100; GetGoldPromptDialog.as:204). Also surfaces an uncatalogued feel rule: MCSPlayer.as:1230 makes AP==0 in adventure mode a death/retreat condition.

### `[[world-exploration/day-length-is-three-clocks]]` — UPHELD [A2] (6 critics)

Blocker ③ is mis-framed, not merely open: there is no in-game day. AP runs on a 60-second clock, crops on absolute 900/3600/21600/43200-second clocks, and the literal 24 h (86400 s) governs only quest repeat-eligibility and daily rollover.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1184, :158; Obj_VegePatch.as:80-140; QueryManagerBase.as:105; InteractUI.as:1153`
- **KILLS this line:** "③ real-world "day" length (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** L1 world-exploration (and L11 meta-social): the blocker's premise — one shared day clock governing expiry, farming, AP regen and the war tick — is false. Three independent real-time clocks, all measured off QueryManager.getServerTime() in raw seconds. Same correction applies to §1 line 116, which repeats the single-clock framing.

### `[[world-exploration/farming-tables]]` — UPHELD [A2] (6 critics)

Farming is fully tabled: crop grow times 15 min / 1 h / 6 h / 12 h with a 15-minute harvest grace before ROT, soil grade 1-6 at 10/20/30/40/50 cumulative harvests, yield chance 1/(10-farmSkill), and — uncatalogued anywhere in the project — harvesting spawns a one-enemy combat wave.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_VegePatch.as:80-140; InteractUI_crops.as:116-161, :457-481, :595-646`
- **KILLS this line:** "② gather/mine/farm yield + whiff + respawn tables."
- **Lane impact:** L1 world-exploration: gracePeriod = 15*60 then ROTTED. Harvest roll `getStat(startingIndex+2) == 1 || int(Math.random() * (10 - getStat(1020))) == 0` — first harvest guaranteed, then 10% at skill 0. Crop dice over patchlevel picks items 2115/2116/2117/2118/2140/2141, so higher soil grade widens rather than improves the table. The harvest ambush uses enemy id 64 at x=400 on an 800-px stage, player entering at x=150, bg 43 — except at node 8402947 which uses bg 19.

### `[[world-exploration/fourth-clock-dtinterval]]` — UPHELD [A2] (1 critic)

There is a fourth independent real-time clock the day-length claim does not name: DTINTERVAL = 120 seconds, the duel-token regen interval, persisted alongside AP as save slot 101 nextDTUpdate.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:160 + QueryManagerPIO.as:1181`
- **KILLS this line:** "③ real-world "day" length (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** L1 world-exploration and L11 meta-social: strengthens world-exploration/day-length-is-three-clocks — it is four clocks, not three (AP 60 s, duel tokens 120 s, crops 900/3600/21600/43200 s, quest rollover 86400 s), plus nextWarTurn as a fifth persisted timer at save slot 102. The ledger blocker's 'one day length governs expiry, farming, AP regen and the war tick' premise is even further from the truth than the surveyor claimed. Start values are STAT_DUELTOKENS 20 / STAT_MAXDUELTOKENS 20 (StatsManager.as:709-710).

### `[[world-exploration/gather-yield-whiff-tables]]` — UPHELD [A2] (6 critics)

Blocker ② "gather/mine/farm yield + whiff" is dead: hunt and fish are 3 AP with a 40% whiff and a 30/20/10 three-tier loot split; search is 2 AP with whiff = 1-(skill+1)/10; mining is 2 AP with a flat 50% downgrade to plain Rock on any non-Coal deposit.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeUI.as:424-490 (hunt/fish), Obj_Bush.as:47 (search), Obj_OreDeposit.as:70 (mine)`
- **KILLS this line:** "② gather/mine/farm yield + whiff + respawn tables."
- **Lane impact:** L1 world-exploration: closes blocker ②. Hunt (3 AP, dice=int(rand*10)): 3/4/5→item 2112 'small game' 30%, 1/2→2113 'some game' 20%, 0→2114 'big game' 10%, 6-9→whiff 40%. Fish (3 AP) identical shape: items 2109/2110/2111. Search (2 AP, 24-frame bar): `int(Math.random()*10) <= getStat(1021)` → 10% at skill 0, +10pp per point. Ore ladder fully named from strings 652-659: 1 Rock/2 Coal/3 Iron/4 Tin/5 Copper/6 Silver/7 Titanium/8 Diamond (items 20059-20066), skill-1022 gates (8≥5, 7≥4, 6≥3, 5≥2, 3≥1), pickaxe item 13022 required, unbroken weapon required. 'Respawn' is not a timer — clearOre() calls StageManager.addToDeadList until room regeneration.

### `[[world-exploration/ore-node-respawn-rule]]` — UPHELD [A2] (2 critics)

The respawn third of the gather blocker is closed. Obj_OreDeposit.as:80-87 clearOre() calls StageManager.addToDeadList(objectName); StageManager.as:621-625 pushes the name onto roomDeadList, and GameStage.as:602-630 createRoomObjects suppresses any object whose name is in that list when the room is built. roomDeadList is emptied at StageManager.as:249 (initRooms) and :366 (node change). So a mined-out deposit repopulates the next time the node is entered — the respawn rule is 'per node visit', with the AP cost per swing as the only throttle. There is no timer and no server tick involved.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_OreDeposit.as:80-87; StageManager.as:249, :366, :621-625, :633-636; GameStage.as:602-630`
- **Build:** android v0.682
- **KILLS this line:** "② gather/mine/farm yield + whiff + respawn tables."
- **Lane impact:** L10 world-exploration — with the packet's mining finding supplying yield, whiff and gates, this supplies respawn. Blocker ② is now closed for mining end to end and needs no measurement pass.

### `[[world-exploration/prosperity-thresholds]]` — UPHELD [A2] (6 critics)

The 'prosperity ladder' the ledger lists as Ready is six numeric tiers at 0 / 500 / 1000 / 2000 / 4000 prosperity, with specific territories pinned to a fixed town level and never changing.

- **Cite:** `reference/decompiled/shs3_android/scripts/TerritoryData.as:782-804, :807-830; NodeGenerator.as:393-447`
- **KILLS this line:** "Ready: territory/sector coord system (start 21,51 / 0,3); node-based room graph + signposts; AP cost table (pick 1 / search+mine 2 / stable 5); 4 travel methods; mining ore-by-level ladder; minimap iconography; hidden-path system; prosperity ladder."
- **Lane impact:** L1 world-exploration and L11 meta-social: 'prosperity ladder' was listed as Ready but carried no numbers. Pinned territories: ids 1466699, 1503572, 1368424, 1540387, 1413461, 1409366, 1401176, 1397081 → level 5; 1405270 → 4; 1401173 → 3; 1397077 and 1397078 → 0. Note 1409366 is the frame's Kakuchi and 1397077 is the start territory — pinned to level 0, i.e. no town at spawn.

### `[[world-exploration/sector-room-mapping]]` — UPHELD [A2] (6 critics)

Blocker ⑤ "sector↔room mapping rule" is dead, and the answer is neither option the ledger offered: a sector IS a node, a node owns an ordered list of rooms, and each room is one side-scrolling stage with a declared pixel width of 800-4000.

- **Cite:** `reference/extracted/android/112_Mobile_NodeData.bin:8-18 + reference/decompiled/shs3_android/scripts/QuestEngine.as:1234-1240`
- **KILLS this line:** "⑤ sector↔room mapping rule (town=fixed sector vs wilderness=one-screen-per-sector)."
- **Lane impact:** L1 world-exploration: closes blocker ⑤. Measured across the authored file: 44 nodes, 98 rooms, 94 with explicit <width>, min 800 max 4000 (modes 800×22, 1000×21, 1400×7, 1600×7) = 1 to 5 screens of scroll against the 800×480 native canvas. Rooms carry <bg> (30 distinct ids), optional <roomname> and optional <enterx>. Both town and wilderness nodes carry multi-room lists, so neither ledger option holds. Player position saves as the (STAT_LOCATION node, STAT_LOCATION_ROOM room) pair.

### `[[world-exploration/world-bounds-land-mask]]` — UPHELD [A2] (6 critics)

The ledger's #1 blocker "world bounds + geography" is dead: the world's boundary is a 63x72 GIF land mask embedded in the payload, holding exactly 735 land territories, and the boundary test is a single getPixel != 0 against it.

- **Cite:** `reference/decompiled/shs3_android/scripts/QuestEngine.as:1206 + reference/extracted/android/110_Mobile_MapBitmapData.bin (GIF89a 63x72)`
- **KILLS this line:** "① world bounds + geography (sparse Japan-outline, not a W×H grid) — mine Fandom Category:Territories via API; trace the map image."
- **Lane impact:** L1 world-exploration: closes blocker ① outright. Decoding the GIF (PIL, two colours only: (0,0,0) sea / (255,255,255) land) yields 735 land pixels of 4536, bbox i∈[1,61] j∈[1,70], rendering as the Japanese archipelago. Pixel→territory map is i = x−328, j = y−290. WorldMapUI.as:230 fixes the projection at 10 px per territory, i.e. a 630×720 px world map. No Fandom scrape and no tracing required.

### `[[world-exploration/world-is-procedural]]` — UPHELD [A2] (6 critics)

Only 44 nodes are hand-authored; every other node in the 26,460-sector world is generated deterministically from its own id, so the entire world is bit-reproducible offline from code we hold.

- **Cite:** `reference/decompiled/shs3_android/scripts/QuestEngine.as:1123; TerritoryData.as:74, :86-99, :1054/:1488/:1550/:1597/:1671; RNG.as:64-66`
- **KILLS this line:** "① world bounds + geography (sparse Japan-outline, not a W×H grid) — mine Fandom Category:Territories via API; trace the map image."
- **Lane impact:** L1 world-exploration: the ledger's close-path had the problem backwards — geography is code, not a wiki scrape. TerritoryData(id) runs generateSectors() (a ~430-line seeded road/route builder), and territory exits are pure functions of the id via `new RNG(territoryId)`. With the LCG seed=(seed*9301+49297)%233280 the whole world regenerates offline. Per-territory fixed features are node-id lists on TerritoryData:9-49 (dungeonList, controlPointList, pickableList, exitsList, hutList, animalSpawnList, dojoNode, templeNode, oniDenNode, graveyardNode, mercCampNode, townNode).

### `[[world-exploration/world-map-art-recovered]]` — UPHELD [A2] (1 critic)

The drawn world-map art IS held: the web v0.717 payload carries it as 36 tiles inside DefineSprite 262, already exported to reference/extracted/sprites/, and reassembling them at their own twip offsets renders the Japanese archipelago.

- **Cite:** `reference/extracted/payload.xml:395761-395830 (DefineSpriteTag spriteId="262") + reference/extracted/sprites/DefineSprite_{191,193,195,197,199,201,203,205,207,209,211,213,215,217,219,221,223,225,227,229,231,233,235,237,239,241,243,245,247,249,251,253,255,257,259,261}/1.png`
- **KILLS this line:** "① world bounds + geography (sparse Japan-outline, not a W×H grid) — mine Fandom Category:Territories via API; trace the map image."
- **Lane impact:** L1 world-exploration: kills the journal's own STILL_UNHELD 'map-art-unheld' and removes one of the four negatives holding the score at 85. 36 tiles map_0_7..map_8_1, characterIds 191-261, placed at translateX = i*80*20 twips and translateY = j*80*20 twips (map_1_6 -> 79.9, 480 px), plus a 'shadowmap' underlay at characterId 189. Every tile PNG is already on disk from the earlier ffdec export; nothing new needs decrypting. I composited all 36 and LOOKED: Hokkaido, Honshu, Shikoku, Kyushu, Sado and Awaji are all present and correctly shaped. The ledger's 'trace the map image' close-path is doubly obsolete - the image does not need tracing, it needs compositing.

### `[[world/map-bitmap-is-held-byte-exact]]` — UPHELD [A2] (2 critics)

THE WORLD MAP IS HELD, BYTE-EXACT, IN BOTH BUILDS. reference/extracted/bindata/92_1t4648s0.bin is a 63x72 GIF89a land mask with 735 non-black pixels in the unmistakable shape of the Japanese archipelago (Honshu, Hokkaido top-right, Kyushu/Shikoku bottom-left) — I decoded it with Pillow and rendered every pixel. It is byte-identical to the android blob reference/extracted/android/110_Mobile_MapBitmapData.bin: md5 13068dfa1a5cc5628720a25782f93fed on BOTH. Every non-zero pixel IS a territory. web: embedded at §1t4648s0§.as:5, loaded at §1t1524s0§.as:697-702, enumerated into territory ids at §1t1524s0§.as:716-739 ('push(x + 341 << 12 | y + 341)' for every non-zero pixel). android: embedded at Mobile_MapBitmapData.as:5, enumerated at QuestEngine.as:514-529. The world-bounds predicate is QuestEngine.as:1204-1207 hasTerritory(x,y), using WarSelectUI.TERRSHIFTX=21, TERRSHIFTY=51, WARMARKERSHIFTX=8 — the same 21/51 origin the ledger already records at REBUILD_READINESS.md:224. So the map spans display territory x in [-13,49], y in [-51,20], 735 land territories. This is the single largest unheld item this packet touches and none of its four world-exploration findings cites the file.

- **Cite:** `reference/extracted/bindata/92_1t4648s0.bin + reference/decompiled/shs3_payload/scripts/§1t1524s0§.as:716-739 + reference/decompiled/shs3_android/scripts/QuestEngine.as:1204-1207`
- **Build:** both — md5-identical (web v0.717 bindata/92_1t4648s0.bin == android v0.682 110_Mobile_MapBitmapData.bin)
- **KILLS this line:** "① world bounds + geography (sparse Japan-outline, not a W×H grid) — mine Fandom Category:Territories via API; trace the map image."
- **Lane impact:** L8 world-exploration blocker ① at REBUILD_READINESS.md:225 dies OUTRIGHT. The parenthetical was right — it IS a sparse Japan outline, not a WxH grid — but the close-path is obsolete: we do not need to mine the Fandom API and we do not need to trace anything, because we hold the map image itself, in both builds, byte-identical. Recreation needs: the 735-pixel mask, the 21/51/8 shift constants, the id packing (x+341 << 12 | y+341), and hasTerritory() as the bounds test. This also finally reconciles with the ledger's own :224 'territory/sector coord system (start 21,51 / 0,3)'.

### `[[world/war-map-is-already-on-film]]` — UPHELD [A1] (2 critics)

The War Room / SELECT TERRITORY world map is already captured in the repo: a flat-vector sparse Japan outline under a uniform grid overlay, with a clan flag marker — which is precisely the artifact the ledger's world-exploration blocker ① sends someone to Fandom to find.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg (1024x576; crop (20,30)-(720,420) @2x LANCZOS)`
- **Build:** web v0.717
- **KILLS this line:** "① world bounds + geography (sparse Japan-outline, not a W×H grid) — mine Fandom Category:Territories via API; trace the map image."
- **Lane impact:** world-exploration ① and meta-social ② (:245 'War-Room map topology (board/adjacency)'): the close-path both blockers prescribe — go find and trace the map image — is already satisfiable from held material. PARTIAL because the capture is 1024x576, so the grid resolution is readable but the per-sector labels are not; a ZOOM IN frame would close it outright.

### `[[world/war-map-renders-at-10px-per-territory]]` — UPHELD [A2] (3 critics)

The rendering constant that turns the 63x72 land mask into the board seen on film. WarSelectUI.as:233-234 places a war flag at `(terrx + TERRSHIFTX) * 10 + 4.5` , `(terry + TERRSHIFTY) * 10 + 8.8`, and :253-254 places the player marker at the same *10 pitch with +5 / +8.5 offsets. So one territory is a 10 x 10 px cell and the whole 63 x 72 mask draws as a 630 x 720 board - which is why the on-film War Room shows a uniform square grid ruled over a vector coastline. Together with the 735-pixel mask and the 21/51/8 shifts this is a complete, buildable specification of the board.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarSelectUI.as:15,:17,:19,:233-234,:253-254 + reference/extracted/bindata/92_1t4648s0.bin (63x72 GIF, 735 land pixels, md5 13068dfa1a5cc5628720a25782f93fed)`
- **Build:** android v0.682 (the web twin is §1t1524s0§; the shift constants are identical)
- **KILLS this line:** "(1) world bounds + geography (sparse Japan-outline, not a WxH grid) - mine Fandom Category:Territories via API; trace the map image."
- **Lane impact:** L10 world-exploration: with the mask, the shifts and this 10 px pitch, the board can be rendered pixel-for-pixel without touching Fandom or tracing anything.

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[hunter/hp-chi-regen-is-per-battle]]` — NOT-UPHELD [A2] (2 critics)

HP and Chi do not regenerate on a clock — they regenerate once per battle resolution, by max/10 plus the equipped gear's regen stat, clamped to max, with a paired no-regen variant for defeats. The packet contains no claim about Chi at all, and Chi is the blue bar in the reference frames. The new-character seed block sits in the same file.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:694-712, :1724-1745`
- **Build:** android v0.682
- **aimed at this line, which SURVIVES:** "③ real-world "day" length (governs expiry, farming, AP regen, war tick). ④ AP regen rate + cap."
- **Lane impact:** L-skills-meters and L-progression: the Chi meter's income model, plus a complete Stage-1 starting stat block that needs no inference.

### `[[hunter04/territory-owners-are-open-ended-not-four]]` — NOT-UPHELD [A2] (2 critics)

Rider on the fifth-banner finding: the world-map ownership layer is OPEN-ENDED, not four owners and not five. The four canonical clans are named in the string table - docs/gauntlet/L0/index/strings.json["275"]-["278"] = 'Clan Aka Ryu' / 'Clan Midori Ken' / 'Clan Aoi Hoiru' / 'Clan Ki Sensu' (red / green / blue / gold, matching the banners I read off reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg). But ["491"] is 'Neutral', and the game ships player-founded clans that choose their own heraldry: ["4400"] 'Clan Deed', ["4401"] 'Form your own clan.\nWar Hero rank required.', ["4405"] "Edit your Clan's name, acronym, color and banner", ["816"] 'Clan Color', ["818"] 'Clan Acronym', and ["834"]/["835"] 'Minor Clan ( [0] territories owned )' / 'Major Clan ( [0] territories owned )' - i.e. custom clans own territory. A rebuild must model territory ownership as an arbitrary (colour, banner, name) tuple with a Neutral sentinel, not an enum of four or five.

- **Cite:** `docs/gauntlet/L0/index/strings.json["275"]-["278"], ["491"], ["816"], ["818"], ["4400"], ["4401"], ["4405"], ["834"], ["835"] · reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg (crop 700,160-780,230 @15x LANCZOS)`
- **Build:** android v0.682 string table; banner colours read off a web v0.717 frame
- **aimed at this line, which SURVIVES:** "(2) War-Room map topology (board/adjacency)."
- **Lane impact:** L-meta-social and L-world-exploration: territory ownership is a data-driven (colour, banner, acronym) record plus a Neutral sentinel, so the four-clan enum in any rebuild is wrong in kind. The black-banner tile on the world map is consistent with a custom clan or the neutral/shogunate side; either way ≥5 is a floor.

### `[[world-exploration/farm-timers-and-patch-ladder]]` — NOT-UPHELD [A2] (2 critics)

The farming side of the gather blocker is also on disk. InteractUI_crops.as:116, :131, :146, :161 give four crop growth periods — 15 * 60, 60 * 60, 6 * 60 * 60 and 12 * 60 * 60 seconds, i.e. 15 minutes, 1 hour, 6 hours and 12 hours — each followed by a gracePeriod window before the crop is lost (:117-121, :132-136, :147-151, :162-166), with the same four values repeated in the planting path at :549-558. getPatchLevel() at :457-479 is a six-rank patch ladder that steps at 10, 20, 30, 40 and 50 cumulative harvests, and harvestedTimes is capped at 50 (:105-107). Yield rows per crop remain to be read out, but there is nothing structural left to guess.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI_crops.as:105-107, :116, :131, :146, :161, :457-479, :549-558`
- **Build:** android v0.682
- **aimed at this line, which SURVIVES:** "② gather/mine/farm yield + whiff + respawn tables."
- **Lane impact:** L10 world-exploration + L7 economy — the ledger treats farm tables as unmeasured. The timers, the grace window and the patch-level progression are all recoverable statically; only the per-crop yield rows still need a read-out. Also bears on :225 ③ (the real-world 'day' length), since 12h and 24h windows are hard-coded rather than server-defined here.

### `[[world-exploration/farm-yield-and-whiff-are-on-disk-too]]` — NOT-UPHELD [A2] (3 critics)

The farm yield and whiff rows the packet's farming finding says still need a read-out are in the same file, 150 lines below the timers. InteractUI_crops.as:607 is the whiff gate: `if(StatsManager.getStat(this.startingIndex + 2) == 1 || int(Math.random() * (10 - StatsManager.getStat(1020))) == 0)` - stat 1020 is the Farming skill (skilldata id 1020 = 'Farming'), so the proc chance is 1/(10 - farmingLevel), and the very first harvest on a patch is a guaranteed drop. :609-610 then rolls `dice = Math.random() * getPatchLevel(harvestedTimes)`, i.e. the six-rank patch ladder IS the yield table's index, and :611-646 map dice 0..5 onto items 2115 / 2116 / 2117 / 2118 / 2140 / 2141, each also bumping a counter stat (30008-30011) and achievement 60002. Also: gracePeriod is a flat 900 s (:55), and the 12-hour crop (case 4, :160-169) has no rot branch at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI_crops.as:55,:160-170,:455-482,:598-648 + reference/extracted/skilldata.xml (skill id 1020 = 'Farming' via docs/gauntlet/L0/index/strings.json)`
- **Build:** android v0.682 (the web build embeds no crops UI copy I could locate)
- **aimed at this line, which SURVIVES:** "(2) gather/mine/farm yield + whiff + respawn tables."
- **Lane impact:** L10 world-exploration + L7 economy: with the packet's mining finding (yield/gates), the ore-respawn finding (respawn) and this (farm yield + whiff), RR:225 blocker (2) is closed end to end and needs no measurement pass. The Farming skill level feeds the whiff denominator directly, so farming.ts needs the skill level as an input.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[android-blobs-hunter/traproomdata-70-rooms-four-difficulty-tiers]]` — UPHELD [A2] (1 critic)

84_QuestEngine_TrapRoomData.bin is unmentioned by any claim and holds a complete procedural level system: 622 lines, 70 <room>, 314 <obj>, 70 <width>, partitioned into four difficulty tiers - <easy> at line 32, <medium> at 126, <hard> at 309, <veryhard> at 446. Its shipped comment header is an authoring legend giving the property signature of every trap type: Obj_FloorSwitch, Obj_Lever, Obj_LowCeiling, Trap_Kunai, Trap_KunaiAuto, Trap_SawBladesAuto, Trap_CrushingBlockAuto, Trap_CrushingColumnAuto, Trap_ElementAuto, Trap_Jump, Trap_SpikesAuto, Trap_Boulder, Trap_SpikeBallAuto - each with its ordered <property> parameter list.

- **Cite:** `reference/extracted/android/84_QuestEngine_TrapRoomData.bin:5-20 (legend), :21 <traproomdata>, :32 <easy>, :126 <medium>, :309 <hard>, :446 <veryhard>, :33-37 (first authored room)`
- **Build:** android v0.682
- **Lane impact:** L1 world-exploration. The ledger's world model is a node graph; this is the room-interior content that hangs off it, with a typed trap vocabulary and an authored difficulty curve. Nothing in the 12 systems mentions traps, rooms or difficulty tiers.

### `[[android-blobs/bgdata-override-census-corrected]]` — UPHELD [A2] (1 critic)

Correction to android-blobs/bgdata-is-a-parallax-spec's override census: ffwrap is 8 rows not 6, ffscroll's range runs to 1.0 not 0.27, and three override families (ppscroll, gscroll, fgscroll) are missing from the census entirely.

- **Cite:** `reference/extracted/android/123_Mobile_BGData.bin:411 and :530`
- **Build:** android v0.682
- **Lane impact:** L6 art-anim + L1 world-exploration. Everything else in that claim reproduced exactly (874 layer instances, 147/211/311/92/113, 49 records, ids 0-54 less {4,19,23,24,25,43}, contentwidth 17 rows 800-5000, wrap 17 rows all 0), so this is a repair, not a demolition. It matters because the omitted families are the ones that override the XMLBG defaults on the near planes: fgscroll=1.2 in three backgrounds contradicts the declared foregroundLayerScroll=2, and gscroll=0 in two backgrounds pins the ground plane still. A rebuilder using the declared ladder alone gets those five scenes wrong.

### `[[android-blobs/four-shipped-bg-id-collisions]]` — UPHELD [A2] (1 critic)

Four background constants shipped with duplicate ids: BG_MINE2, BG_RIVERBANK, BG_DOJO4 and BG_DOJO5 re-use 46, 47, 49 and 50, which already belong to BG_JINMAKU_OUTSIDE, BG_JINMAKU_NIGHT_OUTSIDE, BG_TEMPLERUINS_FOG and BG_TEMPLEINTERIOR2 — so four named scenes resolve to somebody else's background.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/GameStage.as:102, :104, :108, :110, :122, :124, :126, :128`
- **Build:** android v0.682
- **Lane impact:** L1 world-exploration + L6 art-anim. Bounds android-blobs/bgdata-is-a-parallax-spec: bgdata holds 49 records over ids 0-54 with six unused slots, and BGResource exports exactly 49 matching BG_* symbols — but GameStage declares 60 constants, so four names (Mine2, RiverBank, Dojo4, Dojo5) have no scene of their own and would load the fog/jinmaku scenes instead. Either they are abandoned constants or a shipped bug; either way a 1:1 recreation must not invent four extra backgrounds to satisfy them.

### `[[android-blobs/mapdata-has-no-web-counterpart]]` — UPHELD [A2] (2 critics)

119_Mobile_MapData is a 65-byte empty stub, and the 'possible Android-only stripping' hypothesis is now dead: the web payload contains no <mapdata> root at all, populated or otherwise, so no client-side comparison can exist.

- **Cite:** `reference/extracted/android/119_Mobile_MapData.bin (65 bytes, entire file) + the root-tag census in reference/decrypted/shs3_payload_decoded.swf`
- **Build:** both
- **Lane impact:** L1 world-exploration. Closes the client-side half of the banked STILL_UNHELD world-exploration/mapdata-blob-empty ('possible Android-only stripping … Whether the web v0.717 build shipped a populated mapdata is not established'). Ruled out: stripping of web client content, because there is no web client copy. Still open and permanently unresolvable: whether the web build fetched a populated mapdata from the dead server (ResourceManager.loadResource -> getresource.php / Player.IO).

### `[[bindata/NEW-place-name-table-has-one-dead-row]]` — UPHELD [A2] (1 critic)

The place-name table holds 677 entries but the lookup can only reach indices 0..675, so its last row is unreachable dead data.

- **Cite:** `reference/extracted/bindata/98_1t4653s0.bin:677 + reference/decompiled/shs3_android_payload/scripts/NameGenerator.as:147-148,158`
- **Build:** both
- **KILLS this line:** "Place-name grid is 26x26 = 676 reachable entries indexed namex26+namey; the shipped table has 677 rows, the last (Yamanashi) being unreachable."
- **Lane impact:** Prevents an off-by-one in any port of the world-naming algorithm and settles the 'usable row count' wording.

### `[[bindata/RETRACTION-gif92-is-the-world-map]]` — UPHELD [A2] (2 critics)

RETRACTION of my own first-pass claim: I called bindata/92 a placeholder GIF stub after reading only its header — it is the world map, a 63×72 boolean land mask of Japan, exactly as this lane's prior run established.

- **Cite:** `reference/extracted/bindata/92_1t4648s0.bin (decoded in docs/gauntlet/L0/sources/bindata.md §C1; md5 13068dfa1a5cc5628720a25782f93fed, byte-identical to reference/extracted/android/110_Mobile_MapBitmapData.bin)`
- **Lane impact:** world-exploration. Logged as a retraction rather than deleted because the failure mode matters: I reasoned from a header and plausibility instead of decoding the pixels, which is precisely what §0 forbids. The substantive claim (92 = world map, blocker ① dead) belongs to the prior run and stands.

### `[[bindata/web-has-third-hardcoded-town]]` — UPHELD [A2] (1 critic)

A located WEB-vs-ANDROID divergence: the web build (v0.717) getPlaceName has THREE hardcoded towns, the Android build (v0.682) has only two. The web adds territoryID 1519945 -> 'Iwakuni', which decodes under the recovered transform to bitmap pixel (43,39) — a land cell. This is a concrete instance of the S0 build-parity caveat and a reason to prefer the web decompile wherever it is legible.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t136s0§.as:140-151 vs reference/decompiled/shs3_android_payload/scripts/NameGenerator.as:137-144`
- **Build:** web v0.717
- **Lane impact:** L-world-map / build-parity: proves the two builds' content is NOT identical and gives the first measured example.

### `[[frames/world-map-zoom-in-is-a-viewport-not-the-board]]` — UPHELD [A1] (1 critic)

The zoomed-in world-map panel is a scrolling VIEWPORT onto a much larger territory board, not the board itself. Thirteen tile columns fit the panel, but the coordinates printed by the game in the same corpus run in the twenties and fifties, so W and H cannot be read off one screen — and no frame in the corpus gives them.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg (whole-frame @1.37x plus row crop 40,220-950,305 @1.65x), cross-read against reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0016.jpg and reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0057.jpg (both whole-frame @1.37x)`
- **Build:** web v0.717
- **Lane impact:** world-exploration: blocker 'world bounds' stays OPEN from the frame corpus; the tile geometry is held, the extents are not

### `[[meta-social/only-3-of-7-war-room-pages-were-ever-filmed]]` — UPHELD [A1] (1 critic)

Only 3 of the 7 War Room rules pages exist on film (1/7, 3/7, 6/7). Page 6/7 renders the android string table word for word in v0.717, which is real copy-parity evidence — but the 24-hour war-tick page is NOT among them, so that number is android-sourced only and cannot be called frame-confirmed.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/ — 20 files total; frame_0011.jpg, frame_0012.jpg, frame_0013.jpg read at x2 LANCZOS, plus a title-bar contact sheet over frames 0008-0020`
- **Build:** web v0.717
- **KILLS this line:** "③ real-world "day" length (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** L0 meta-social: bounds how far the war-tick claim can be pushed. The 24h number is A2-held on the v0.682 string table and NOT corroborated on film, so it keeps the S0-3 hedge — while the structure/contribution page is now confirmed identical across builds and can drop its hedge.

### `[[npcdata/procgen-town]]` — UPHELD [A2] (2 critics)

Town population is procedurally generated from a seeded RNG whose seed contains the real-world date — `seed = nodeid * date + roomid * (index + 3)` — across six weighted archetypes, and its NPC names come from the five bindata name-generator tables identified in S0-1.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLNpc.as:403-597, seed at :415-418, archetype dice at :419-442, name calls at :296/:458/:484/:529`
- **Lane impact:** world-exploration — the `date` term is the concrete hook for blocker ③ ('real-world day length'); also closes the loop on S0-1's five unattributed name-generator bindata blobs by naming their consumer.

### `[[provenance/extracted-sprites-and-shapes-are-web-v0717]]` — UPHELD [A2] (2 critics)

reference/extracted/sprites/ (827 DefineSprite render dirs) and reference/extracted/shapes/ (1,822 SVGs) come from the WEB v0.717 payload, not the Android build — proved by tag count rather than assumed from file location. Every art claim resting on that corpus is therefore free of the §0 Android build-parity caveat.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf and reference/decrypted/shs3_android_payload_decoded.swf — my own tag-stream scan`
- **Build:** both
- **Lane impact:** Cross-lane: settles the provenance question for ui-hud, art-anim-audio-feel and world-exploration in one line. The 827/1822 corpus is web v0.717 art at 1:1 game-pixel scale and can be cited without a build qualifier.

### `[[questdata-critic/territory-sector-mapping-closed]]` — UPHELD [A2] (2 critics)

The on-screen TERRITORY / SECTOR readout maps to node ids exactly: nodeid = ((terrX + 341 - 21) * 6 + secX) << 12 | ((terrY + 341 - 51) * 6 + secY). Six sectors per territory on each axis. The high 12 bits are the E-W axis — the one left/right room exits traverse by +/-4096 — and the low 12 bits are N-S, traversed by +/-1. Verified against the frame's own readout: TERRITORY (23,52) SECTOR (3,5) yields territoryID 1405270, whose generated place name 'Chikada' is exactly what that frame's location bar shows.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:2187 and reference/decompiled/shs3_android/scripts/WarSelectUI.as:17, :19; sector modulus at reference/decompiled/shs3_android/scripts/NodeGenerator.as:318`
- **Build:** android v0.682 for the +21/+51 display shift — but it reproduces the WEB frame's readout exactly, which is the web-side proof
- **Lane impact:** L8 world-exploration: closes the item questdata/node-packing-decoded explicitly left open ('which axis is N-S vs E-W and the mapping onto the on-screen TERRITORY/SECTOR readout').

### `[[questdata/count-corrections-to-packet]]` — UPHELD [A3] (2 critics)

Three measured corrections to numbers asserted inside packet claims. (1) The five name-generator tables hold 398 male / 291 female / 33 noble / 36 samurai / 677 place names - each exactly one more than the packet's 397/290/32/35/676. (2) reference/extracted/android/112_Mobile_NodeData.bin holds 44 <node> elements, not 535; 535 is the count of <id> elements across nodes, rooms and objs. 16 of 44 nodes carry an authored <name>, i.e. 36% named, not 3%. (3) The node-exit delta histogram is -4096 x19, +4096 x18, +1 x19, -1 x19; the packet says +1 x18. (4) questdata's <text> nodes total 40,135 words by my count, not 40,119.

- **Cite:** `reference/extracted/android/85_NameGenerator_MaleNames.bin, 86_NameGenerator_NobleFamilyNames.bin, 87_NameGenerator_SamuraiFamilyNames.bin, 88_NameGenerator_FemaleNames.bin, 89_NameGenerator_PlaceNames.bin (CRLF line counts) and reference/extracted/android/112_Mobile_NodeData.bin (xml.etree tag histogram)`
- **Build:** android v0.682
- **Lane impact:** Housekeeping for L7/L8/L12: the generator's namespace is 398x33 + 398x36 male-name pairings (plus 291x33 + 291x36 female) and 677 table place names, and 112_Mobile_NodeData is a 44-node SAMPLE of the world graph, not the world graph. Anyone sizing the overworld off '535 nodes' would be out by 12x.

### `[[string-table/hell-is-a-first-class-room-type]]` — UPHELD [A2] (1 critic)

Jigoku is not just a location in dialogue — it is an enumerated room type, XMLRoomData.ROOMTYPE_HELL = 8, sitting in the same enum as DOJO 3 / PVP 9 / PVPDOJO 10 / PVPCLAN 11, and it is tested by six classes to suppress normal actions.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLRoomData.as:6-16 + OverworldHUD.as:1168-1171,1274`
- **Build:** android v0.682
- **Lane impact:** world-exploration + meta-social — strengthens string-table/jigoku-is-a-timed-penalty-jail from copy to schema. A 1:1 recreation needs a room-type enum with a HELL member that suppresses duelling, war-room entry, inventory and quest-log actions, not just a themed room. Zero corpus hits for ROOMTYPE_HELL.

### `[[string-table/jigoku-is-a-timed-penalty-jail]]` — UPHELD [A2] (2 critics)

Jigoku is a shipped, named location that functions as a moderation jail with a variable sentence length keyed to the infraction, with its own action-block message and GM commands — absent from every ledger system.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin:2666,:2669,:2531,:3875 + docs/gauntlet/L0/index/strings.json["1026"]`
- **Build:** android v0.682
- **Lane impact:** meta-social + world-exploration — a room and a state machine a 1:1 recreation would otherwise drop silently. Neighbouring GM string 4348 '/tteleport (territory x) (territory y)' independently confirms the world address space is a (territory x, territory y) pair.

### `[[uistrings-payload/clan-hq-rooms-staff-missions-absent-from-all-12-systems]]` — UPHELD [A2] (1 critic)

An entire base-building / staff / mission / graveyard subsystem is authored in the web payload (rooms, upgrade-to-level-2, demolish, staff assignment, mission success probability and risk tiers, room capacity, a corpse-eviction graveyard) and none of the twelve ledger systems has a slot for it — the same class of gap as Stage-0 finding S0-1's <survivalmodedata>.

- **Cite:** `reference/extracted/payload.xml:666623`
- **Build:** web v0.717 authored; android v0.682 for the graveyard-node half
- **Lane impact:** meta-social / world-exploration — a thirteenth system. Vocabulary contiguous at :665876-:684584: merchant training room :665912, modify living quarters :666263, upgrade to level 2 :666268, demolish room :666296, no available missions :666619, mission in progress :668811, success probability: 90% :668819, high risk / recommended level: 80 :670323, capacity: 5/5 (Full) :670630, graveyard is empty :672096, graveyard-full corpse eviction :672110, mission result :672684, select 5 crates :673319, 'is now a member of your staff!' :684272; twelve 10000/10000 progress meters at :665884-:665904 and :666324-:666344. Cross-build: staff / living quarters / training room / kitchen / workshop / ninja crates / capacity / crates all return 0 of 2,533 Android entries; graveyard returns 1 (strings.json["1016"]) and appears in 9 Android script files (NodeGenerator, BigmapRoom, TerritoryData, QuestGenerator, ActiveQuest, SoundManager, GameStage, QuestItem, HistoryItem). PARTIAL: I proved the UI is authored and the graveyard node is live; I did NOT prove the room/staff/mission loop shipped, and the web scripts are name-obfuscated so an identifier-absence check is not evidence there.

### `[[uistrings-payload/tower-is-the-name-of-the-thirteenth-system]]` — UPHELD [A2] (2 critics)

The room/staff/mission/graveyard subsystem is called the TOWER and its identifiers are NOT obfuscated in the web payload — TowerRoomStairs / TowerRoomHut / TowerRoomHutEntrance / TowerRoomHutKitchen / TowerRoomHutWorkshop, resolved at runtime by §1t412s0§.as:866-928 — and it is web-only: 0 files in shs3_android/scripts and 0 of 2,533 table entries mention 'tower'.

- **Cite:** `reference/extracted/payload.xml:121701`
- **Build:** web v0.717 only
- **Lane impact:** meta-social / world-exploration — STRENGTHENS and closes the stated limit of this unit's clan-hq-rooms-staff-missions-absent-from-all-12-systems ('the web scripts are name-obfuscated so an identifier-absence check is not evidence there'): for this subsystem they are not obfuscated. The Tower has its own language file (tower_en.xml, payload.xml:118543), its own RPC (playerio/logtowerget.php :119328), gate fields towerreq (:106222) and notowerget (:120371), a room-style resolver keyed on (type, level) at §1t412s0§.as:866, and a named FX symbol shs3_fla.TowerBladeslashfx_580 (:2653284). 'kitchen' and 'workshop' — two of the exact words the parent claim reported as 0-of-2,533 Android hits — are room class names here. This is a thirteenth system with a proper name, same class of gap as Stage-0 S0-1's <survivalmodedata>.

### `[[world-exploration/12h-crop-never-rots]]` — UPHELD [A2] (1 critic)

The 12-hour crop (plantType 4) has no ROTTED branch at all - once ready it stays harvestable forever, so the '15-minute grace before ROT' rule applies only to the 15 min / 1 h / 6 h crops.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_VegePatch.as:133-140 (mirrored at InteractUI_crops.as:158-161)`
- **Lane impact:** L1 world-exploration: corrects the surveyor's farming table before it reaches src/config. Types 1-3 all carry the explicit three-way ladder gated on timePeriod + gracePeriod; type 4 is two-way. Porting a uniform rot rule would destroy the 12 h crop's only advantage.

### `[[world-exploration/21-of-27-blobs-are-cross-build-identical]]` — UPHELD [A3] (1 critic)

Twenty-one of the twenty-seven web-payload bindata blobs are byte-identical to their Android counterparts, including all five NameGenerator tables, the QuestEngine trap-room file and fourteen MCSCharacter animation sets -- so the Stage-0b v0.682 caveat applies to AS3 constants, not to the data blobs.

- **Cite:** `md5 sweep of reference/extracted/bindata/*.bin (27 files) vs reference/extracted/android/*.bin (42 files)`
- **Lane impact:** L1 world-exploration, and every lane that inherits the Stage-0b Android caveat. It refutes this journal's own cross-build-numeric-parity claim ('only the land mask is byte-proven identical') and its score rationale ('the one world artifact with proven cross-build parity'). Concretely it upgrades place-name-reproduced-from-payload: the PlaceNames table the generator reads is cross-build proven, so only the AS3 exception list is in doubt. It also hands L6 art-anim a fact worth its own claim -- 14 of the 19 web animation sets are byte-identical to the Android ones, so the Android animation data is not a port-specific rebuild.

### `[[world-exploration/ap-cap-formula-is-frame-confirmed]]` — UPHELD [A1] (1 critic)

The Android level+30 max-AP formula reproduces the web build's own HUD exactly -- the frame that was used to rule 'the 30 max must not be ported' shows a LEVEL 10 player with AP 30/40, and 10+30 = 40 -- so there is no frame-vs-payload conflict on AP cap, and the prior banked ruling that 'AP max is 40' (flat) is itself wrong.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-28/frames/frame_0007.jpg, crop (470,110)-(780,290) Lanczos x4 AND crop (300,0)-(1024,130) Lanczos x3 of the same frame; formula at reference/decompiled/shs3_android/scripts/InventoryUI.as:2409`
- **Lane impact:** L1 world-exploration and L10 economy. (1) It upgrades world-exploration/ap-regen-and-cap from A2 to A2+A1 -- the cap is FRAME-CONFIRMED, not merely code-sourced. (2) It partially overturns the banked claim economy/ap-and-token-caps-are-40 (docs/gauntlet/L0/CLAIMS.md:2288), which ruled 'AP max is 40' and 'the 30 max does not and must not be ported': AP max is neither 30 nor 40, it is level+30, and both observations are instances of it (30 = the level-1 creation initial at StatsManager.as:707-708, 40 = the level-10 ceiling). (3) It is a FOURTH frame-code agreement showing an Android v0.682 AS3 constant reproducing web v0.717 behaviour, which materially weakens the blanket 'every ported number is v0.682' discount. The duel-token half of CLAIMS.md:2288 is untouched and still needs its own check.

### `[[world-exploration/ap-ceiling-plus-gear]]` — UPHELD [A2] (1 critic)

Max AP is not hard-capped at level+30: level+30 is only the stat-point spend ceiling, and equipment adds on top via findBonusStat(STAT_MAXAP).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1031-1035 (vs the spend gate at InventoryUI.as:2409)`
- **Lane impact:** L1 world-exploration and L4 items-equipment: the regen loop stops at base MAXAP + gear bonus, so AP-boosting equipment raises the real ceiling above level+30. Two separate numbers that must not be collapsed into one config constant.

### `[[world-exploration/ap-zero-is-a-pose-not-a-death]]` — UPHELD [A2] (1 critic)

AP==0 in adventure mode does not kill or retreat the player — it swaps the idle animation to "tired"; outside adventure mode the same pose fires at HP <= maxhp/4.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:1230 (+ MCSActor.as:116)`
- **Lane impact:** L1 world-exploration and L6 art-anim: CORRECTS the world-exploration journal's own lane_impact on claim ap-regen-and-cap, which reads this line as "a death/retreat condition". It is an idle-pose selector. grep for `STAT_AP) == 0` across all 559 android classes returns this single line — there is no AP-death rule anywhere. The portable rule is: adventure-mode idle has two poses (tired / idle_sheathed) gated on AP==0, and duel-mode idle has two poses gated on HP <= 25%. That is a real L6 animation-state finding the ledger does not carry.

### `[[world-exploration/authored-start-node-name-confirms-derivation]]` — UPHELD [A2] (2 critics)

The authored start node's name string is itself "W Kasuta Forest", independently confirming both the procedural place-name derivation and the direction-prefix law.

- **Cite:** `reference/extracted/android/112_Mobile_NodeData.bin:6 <name>1037</name> + docs/gauntlet/L0/index/strings.json id 1037`
- **Lane impact:** L1 world-exploration: the hand-authored name for node 8382465 equals the name my independent re-run of the LCG generates for its territory 1397077 ('Kasuta'), plus the prefix getNodeName emits for terrSector.x=2046%6=0 <= 1 (string 401 = 'W') and the bg suffix for a forest (string 1003). That is a second, non-circular proof of the naming law — the surveyor proved it against a video frame, this proves it against the payload's own authored data.

### `[[world-exploration/compass-prefix-is-two-axis]]` — UPHELD [A2] (1 critic)

The generated node-name prefix is two-axis, not one: dir1 comes from the sector Y (<=1 -> string 398 'N', >=4 -> 399 'S') and dir2 from the sector X (<=1 -> 401 'W', >=4 -> 400 'E'), concatenated - so corner sectors emit 'NW', 'SE' and so on.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:1643-1663 + docs/gauntlet/L0/index/strings.json (398='N', 399='S', 400='E', 401='W')`
- **Lane impact:** L1 world-exploration: completes the name generator. Of the 36 sectors in a territory, the 4x4 interior block (x and y both in 2..3) gets no prefix, the edge sectors get one letter and the 16 corner sectors get two. frame_0020 (sector 1,3 -> 'W') and frame_0080 (sector 3,2 -> none) are both consistent, and the full name is dir + territoryName + ' ' + bgString where bgString is a switch over 8 background families (strings 1002/1003/1006/1015/1020/1021/1022).

### `[[world-exploration/config-still-empty]]` — UPHELD [A3] (6 critics)

The Surface bullet is CONFIRMED unchanged: src/config still contains zero world numbers — no world.ts, no ap.ts, no farming.ts, no nodes.ts.

- **Cite:** `$ ls src/config/  (repo check, 2026-08-15)`
- **KILLS this line:** "Surface: ZERO world numbers in config yet — needs new world.ts/ap.ts/farming.ts modules. Mining ore ladder + far-territory coords are sourced but missing from the digest."
- **Lane impact:** L1 world-exploration: the only ledger bullet in this block that survives audit intact. But its character changes — after this pass it is a porting task with a finished source list (this journal), not a measurement task.

### `[[world-exploration/coordinate-law]]` — UPHELD [A2] (6 critics)

The world coordinate law is fully specified in code: nodeid = sectorX<<12 | sectorY, territory = floor(sector/6), territorySector = sector mod 6 — so a territory is exactly a 6x6 block of 36 explorable nodes.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:298-302, :333; WarSelectUI.as:15-19`
- **Lane impact:** L1 world-exploration: 735 land territories × 36 sectors = 26,460 explorable nodes. Display offsets are constants TERRSHIFTX=21, TERRSHIFTY=51, WARMARKERSHIFTX=8.

### `[[world-exploration/dead-exit-branch]]` — UPHELD [A2] (1 critic)

TerritoryData.getNorthExits contains a dead branch: rng.rand(3) can only return 0, 1 or 2, but the code tests dice == 3 to set count = 2 - so every territory generates exactly one north exit.

- **Cite:** `reference/decompiled/shs3_android/scripts/TerritoryData.as:86-99 + RNG.as:73-75`
- **Lane impact:** L1 world-exploration: a latent bug in the original world generator, not a design choice. Because rnd() returns [0,1), rand(3) is confined to {0,1,2}. A faithful 1:1 port must decide explicitly whether to reproduce the bug (always 1 exit) or the evident intent (sometimes 2) - and must say which. Worth checking the sibling getSouth/East/WestExits for the same pattern.

### `[[world-exploration/depleted-ore-is-redrawn-not-suppressed]]` — UPHELD [A2] (1 critic)

The room-object dead list does not delete ore deposits, it re-creates them depleted. GameStage.as:633 exempts six object ids from suppression, and ore is one of them: GameStage.as:792-793 is `case 30: obj = new Obj_OreDeposit(objProperty,objName);`, and :647-650 re-creates a dead id-30 object with ',1' appended to its property string. Obj_OreDeposit.as:19-24 reads that flag and does gotoAndStop(1) with canInteract=false and buttonMode=false. So the mined-out rock is still drawn, in its spent frame, and simply cannot be interacted with. Ids 18, 19, 22 and 58 get the same ',1' treatment and id 33 (lever) gets property[1]='2'.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameStage.as:633-670 and :792-794 + reference/decompiled/shs3_android/scripts/Obj_OreDeposit.as:18-24`
- **Build:** android v0.682
- **Lane impact:** L10 world-exploration - a recreation coded from 'suppress objects in the dead list' would render a missing rock instead of a spent one.

### `[[world-exploration/duel-token-clock]]` — UPHELD [A2] (1 critic)

A fifth independent real-time clock exists that the 'three clocks' claim omits: duel-token regen runs on a 120-second interval.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:160 and :1130-1148`
- **Lane impact:** L1 world-exploration and L11 meta-social: the correct count is at least five clocks - AP 60 s, duel tokens 120 s, war turn 3600 s, crops 900/3600/21600/43200 s, quest repeat 86400 s. Duel tokens start at 20 (STAT_DUELTOKENS/STAT_MAXDUELTOKENS, StatsManager.as:709-710) and persist via save slot 101.

### `[[world-exploration/fifth-clock-duel-tokens]]` — UPHELD [A2] (1 critic)

A fifth independent real-time clock exists that the "three clocks" framing omits: duel tokens regenerate on a 120-second interval.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:160, :1133, :1148`
- **Lane impact:** L1 world-exploration and L11 meta-social: the real clock inventory is AP 60 s, duel tokens 120 s, war move 3600 s, crops 900/3600/21600/43200 s (+900 s grace), quest repeat 86400 s — five, not three. Persisted as save slot 101 (nextDTUpdate), same timestamp-based offline-accrual shape as AP.

### `[[world-exploration/frame-confirms-6x6-grid]]` — UPHELD [A1] (6 critics)

A video frame shows the minimap as a 6x6 grid labelled 0-5 on both axes with the player marker at column 1 row 3, matching the HUD's own "SECTOR (1,3)" — independently confirming the floor(sector/6) / sector%6 law from the code.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg, crop (360,10)-(512,120), Lanczos ×8 → 1216×880`
- **Lane impact:** L1 world-exploration: frame and payload AGREE — no frame-vs-doc conflict to adjudicate here. Confirms the territory board is 6×6 and the sector pair is the within-territory index. Two sibling frames (frame_0040.jpg 'INSIDE SECTOR (3,0)', frame_0080.jpg 'SECTOR (3,2)', crop (415,132)-(500,162) ×4) show the two label variants come from Minimap.as:103 vs Territorymap.as:113.

### `[[world-exploration/frozen-town-levels-are-19-not-12]]` — UPHELD [A2] (1 critic)

Town levels are frozen for 19 territories, not the 12 explicitly listed ids — isNoChangeTown also returns true for every territory whose level is below LEVELSTART+5.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:393-400 + recomputation over reference/extracted/android/110_Mobile_MapBitmapData.bin`
- **Lane impact:** L1 world-exploration and L11 meta-social: extends the journal's prosperity-thresholds claim, which lists only the 12 hard-coded ids. The real rule is a radius: any territory with level < 8, i.e. Manhattan distance <= 4 from (341,341). I counted these over the land mask myself — 19 territories (L3x1 + L4x2 + L5x4 + L6x5 + L7x7). So the starting region is a fixed, non-warrable tutorial zone by construction, and only the 716 outer territories have dynamic prosperity.

### `[[world-exploration/kakuchi-is-cross-build-parity-proof]]` — UPHELD [A1] (1 critic)

The Kakuchi reproduction is itself a web-vs-Android parity proof and is under-claimed: a WEB v0.717 video frame renders a name that only falls out of ANDROID v0.682 code if the coordinate law, TERRSHIFTX/Y, the LCG constants, both name tables and the compass-band rule are all identical across builds.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg crops (0,30)-(300,80) x5 and (400,120)-(512,180) x8, vs my Python re-implementation of reference/decompiled/shs3_android/scripts/RNG.as:66-77 + NameGenerator.as:40,42,162-166 + NodeGenerator.as:485-512`
- **Lane impact:** L1 world-exploration: upgrades world-exploration/cross-build-numeric-parity from 'only the land mask is proven' to 'the land mask is byte-proven AND the whole coordinate/naming stack is behaviourally proven'. Specifically validated in v0.717 by this single frame: getTerritory, getTerritorySector, TERRSHIFTX=21, TERRSHIFTY=51, the LCG (s*9301+49297)%233280, RNG's constructor-advances-once behaviour, getPlaceName's %137 branch, the 78-entry namestarting and 37-entry nameending tables, and getNodeCompassDir's <=1 / >=4 bands. That is far above the 'string-pool inference' the score rationale settles for. It does NOT extend to the tuning constants (APINTERVAL, LEVELSTART, AP costs, crop timers) — those remain Android-labelled.

### `[[world-exploration/land-mask-version-parity]]` — UPHELD [A3] (6 critics)

The world land mask is byte-identical between the web v0.717 payload and the Android v0.682 build, so the Stage-0b Android caveat does not apply to the world geography.

- **Cite:** `md5 + cmp of reference/extracted/bindata/92_1t4648s0.bin vs reference/extracted/android/110_Mobile_MapBitmapData.bin`
- **Lane impact:** L1 world-exploration: upgrades WX-01 from Android-only to cross-build proven. Also corrects Stage-0 finding S0-1, which catalogued web bindata 92 merely as "GIF89a 63x72 raster" — that raster IS the world.

### `[[world-exploration/level-gradient]]` — UPHELD [A2] (6 critics)

Content difficulty across the whole world is one formula: node level = |territoryX-341| + |territoryY-341| + 3, capped at 200 — which over the actual land mask yields a real range of 3 to 93.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:385-390 and :144`
- **Lane impact:** L1 world-exploration and L9 enemies-ai: the entire difficulty geography, absent from the ledger. LEVELSTART=3. Territory counts by level: L3×1, L4×2, L5×4, L6×5, L7×7, L8×8, L9×10, L10×9, L11×10, L12×14. Cross-check: the frame's territory (24,52) → internal (344,342) → level 7, and the same frame shows a level-8 player.

### `[[world-exploration/map-art-is-held-web-shape-188]]` — UPHELD [A2] (1 critic)

The rendered world-map ART is HELD, in the WEB v0.717 build: reference/extracted/shapes/188.svg is the filled Japanese-archipelago vector the world map is drawn from, and the 63x72 land mask is a 10-px-per-cell quantisation of it.

- **Cite:** `reference/extracted/shapes/188.svg (svg header: height="785.15px" width="663.65px", 399 sub-paths); provenance docs/research/fidelity/ART_EXTRACTION.md:18 + docs/sessions/SESSION15_KICKOFF.md:58`
- **Lane impact:** L1 world-exploration: kills the surveyor's own STILL_UNHELD world-exploration/map-art-unheld and removes one of the four negatives holding its score at 85. It also moves the map art from 'Android, encrypted' to 'web v0.717, already extracted on disk' — the one artifact class this lane most wanted. Why it was missed is on the record: docs/sessions/-SESSION-LOG.md:2392 and docs/DIVERGENCES.md:3191 say that of the 1,822 shapes in reference/extracted/shapes/, only the 16 the fighter uses had ever been opened. The remaining ~1,806 are an unswept evidence pool for every art-bearing lane (L6 art-anim-audio-feel, L5 ui-hud), not just this one.

### `[[world-exploration/map-art-validates-projection]]` — UPHELD [A3] (1 critic)

Overlaying the 63x72 land mask on the reassembled map art at the code's own projection agrees on 652 of 735 land cells (88.7% by cell centre) and traces the coastline exactly, independently confirming the mask-to-screen transform.

- **Cite:** `my overlay of reference/extracted/bindata/92_1t4648s0.bin onto the 36-tile composite of reference/extracted/sprites/DefineSprite_*/1.png, transform cell (i,j) -> px (10i+80, 10j) derived from WorldMapUI.as:208 and :230`
- **Lane impact:** L1 world-exploration: the projection claim previously rested on two lines of code (WorldMapUI.as:208 getPixel(territoryx + 21 - 8, territoryy + 51) and :230 (terrx + 21) * 10 + 5). It now has a picture behind it. The 83 'misses' are coastline cells sampled at cell centre on a 10 px grid plus my own tile-assembly seams, not a transform error. Practical upshot for the port: a renderer can draw the OG map by blitting the 36 tiles at (i*80, j*80) and index territories with x = i_mask + 328, y = j_mask + 290.

### `[[world-exploration/mapdata-blob-empty]]` — UPHELD [STILL_UNHELD] (6 critics)

119_Mobile_MapData.bin is a 65-byte empty stub (<mapdata></mapdata>, zero children) even though Mobile_MapData.as, QuestEngine.getMapSquareID and XMLWorldMap all expect content — and I cannot say why.

- **Lane impact:** L1 world-exploration: possible Android-only stripping, possible dead subsystem. Whether the web v0.717 build shipped a populated mapdata is not established. Logged as a lead, not a finding.

### `[[world-exploration/minimap-x-at-3-2]]` — UPHELD [A1] (1 critic)

On frame_0020 the gold X marker sits at minimap column 3 row 2, not the claimed ~(2,2), and there is a sixth gold icon - an arch, visually distinct from the gate glyph - at (5,5) that the claim's quote omits.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg, crop (393,38)-(502,138), Lanczos x10 -> 1090x1000`
- **Lane impact:** L1 world-exploration and L5 ui-hud: the frame wins over the surveyor's hedged reading. The substantive claim (6x6 grid, player at (1,3)) is unaffected, but the icon inventory needs amending - and the arch/gate distinction is a real minimap-iconography datum that maps onto NodeGenerator's 24-value ICON_ enum.

### `[[world-exploration/minimap-x-is-quest-target]]` — UPHELD [A1] (2 critics)

The gold X on the frame_0020 minimap sits at sector (3,2), not (2,2) - and (3,2) is exactly the sector the player reaches in frame_0080, so the X is the active quest-target marker.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg, crop (395,38)-(505,148) Lanczos x9 -> 990x990; cross-read with frame_0080.jpg crops (0,30)-(300,80) x5 and (355,110)-(512,180) x7`
- **Lane impact:** L1 world-exploration and L4 ui-hud: corrects the surveyor's '~(2,2)' misread and upgrades the finding. The minimap's gold X is the quest destination, and frames 0020 and 0080 are a matched before/after pair for the same objective - a reusable behaviour cite for the minimap iconography Ready bullet. The same x9 crop also shows a sixth icon at (5,5) that the original quote omits (the journal lists only the (5,0) and (0,5) gates).

### `[[world-exploration/minimap-x-marker-column]]` — UPHELD [A1] (2 critics)

The minimap's gold X marker in frame_0020 sits at column 3 row 2, not the "~(2,2)" the surveyor's crop description reports.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg, crop (395,40)-(490,135), Lanczos x10 -> 950x950 with a 10-px red coordinate grid overlaid`
- **Lane impact:** L1 world-exploration: correction only, and non-load-bearing — the grid shape, the 0-5 labelling on both axes, the player triangle at column 1 row 3 and the HUD's 'SECTOR (1,3)' all verify. Worth fixing before anyone ports the minimap icon layout from the journal's prose rather than from the frame.

### `[[world-exploration/name-tables-in-web-payload]]` — UPHELD [A2] (1 critic)

The name-generator vocabulary ships verbatim in the web v0.717 payload string pool, so the place-name derivation is corroborated across builds and is not an Android-only reconstruction.

- **Cite:** `reference/extracted/payload.xml:119152-119260`
- **Lane impact:** L1 world-exploration: the Android namestarting/nameending arrays appear in the v0.717 pool in the same order, minus only the entries the string pool deduplicates ('Kiyo' which occurs twice in the array, and the short strings 'i' and 'no'). Combined with the LCG constants at :104820-104821, the whole place-name law is cross-build corroborated. Strengthens world-exploration/place-name-reproduced-from-payload from an Android derivation to a v0.717-grounded one.

### `[[world-exploration/nochange-ring]]` — UPHELD [A2] (1 critic)

isNoChangeTown freezes far more than the four hard-coded ids: every territory whose level is below 8 is also frozen, with its town level drawn deterministically from new RNG(territoryID).rand(7).

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:392-400 and :417-447`
- **Lane impact:** L1 world-exploration and L11 meta-social: with LEVELSTART=3 the threshold is level 8, which by my recomputation over the land mask covers 46 territories (L3x1 L4x2 L5x4 L6x5 L7x7 plus the L8 boundary excluded) - the whole newbie ring has RNG-fixed, war-immune town levels. The surveyor's 'specific territories pinned' reads as a list of 12 exceptions; it is actually a rule plus 12 exceptions.

### `[[world-exploration/nochange-town-covers-all-level-under-8]]` — UPHELD [A2] (1 critic)

The pinned-town rule is far broader than the twelve listed ids: isNoChangeTown returns true for EVERY territory whose level is below LEVELSTART+5 (i.e. level < 8), so the entire low-level core of the world has permanently fixed town levels.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:392-400`
- **Lane impact:** L1 world-exploration and L11 meta-social: the surveyor's prosperity claim lists only the explicit id pins and so understates the rule. Combined with its own verified level histogram (L3x1 L4x2 L5x4 L6x5 L7x7 = 19 territories at level < 8), this means 19 of the 735 land territories — the whole starting region including spawn — never change town level, and their level comes from getNoChangeTownLevel, whose fallback is RNG(territoryID).rand(7) with dice 0 AND dice 6 both mapping to level 0. Prosperity accumulation only ever moves towns in the level>=8 outer world.

### `[[world-exploration/place-name-reproduced-from-payload]]` — UPHELD [A1] (6 critics)

The territory name burned into the video frames ("KAKUCHI") is reproducible character-for-character from the payload's own LCG and name tables, proving every place name in the 26,460-node world is deterministically regenerable from the node id.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg + frame_0080.jpg, crop (20,40)-(180,64), Lanczos ×5; derivation from NameGenerator.as:145-166 and RNG.as:64-66`
- **Lane impact:** L1 world-exploration: displayed (24,52) → internal territory (344,342) → territoryID 1409366 → getTownName2 → RNG(2818732) with seed=(seed*9301+49297)%233280 picks namestarting[73]="Ka" + nameending[19]="kuchi" = "Kakuchi". Exact match with the frame. The 'W' prefix is also generated (terrSector.x=1 ≤1 → string 401 = "W"), and frame_0080's sector (3,2) correctly emits no prefix. Same routine names the start territory (id 1397077) "Kasuta".

### `[[world-exploration/rock-deposit-never-clears]]` — UPHELD [A2] (1 critic)

A Rock deposit (oreType 1) is an unlimited faucet — the despawn is guarded on oreType != 1, so it can be mined for 2 AP indefinitely, unlike every other ore which is added to the dead list on first success.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeUI.as:600 (doMine) + Obj_OreDeposit.as:79-86 (clearOre)`
- **Lane impact:** L1 world-exploration and L2 economy: refines the journal's "'Respawn' is not a timer" line, which is right but incomplete. Combined with the 50% downgrade-to-Rock rule at Obj_OreDeposit.as:70, the real loop is: any non-Coal deposit has a 50% chance of yielding item 20059 ("Unusable rocks") AND staying on the map, so the node is farmable until the player rolls the real ore. That is an economy sink/faucet the ledger has no line for.

### `[[world-exploration/room-object-enum-and-node-graph]]` — UPHELD [A2] (6 critics)

The room-object type enum is fully recovered as 73 entries (ids 0-72 plus a nested-list id 100), and object id 0 — the signpost — is the node graph itself, accounting for 186 of the authored file's 343 objects.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameStage.as:683-920; Obj_DirectionSign.as:37-90; reference/extracted/android/112_Mobile_NodeData.bin:16`
- **Lane impact:** L1 world-exploration: gives the ledger's 'node-based room graph + signposts' Ready bullet real content. Signpost property format decodes as destRoom,entryX,destNodeId,visible,compassDir(0=N,1=S,2=E,3=W),spriteFrame,arrowLabelId — worked example '0,50,8386561,1,2,2,1' = 'walk East to node 8386561, land in its room 0 at x=50'. Minimap icon enum is 24 values (NodeGenerator.as:34-82, ICON_NOTHING 0 … ICON_BEACH 23, ICON_OVERWRITENODE 100), which grounds the 'minimap iconography' Ready bullet.

### `[[world-exploration/save-schema-has-three-timers]]` — UPHELD [A3] (1 critic)

The save schema is 20 data slots (ids 0-12, 14-19, 103) plus THREE timer slots (100/101/102), 23 distinct ids in total — slot 13 is never written and slot 103 is battle stats, not a timer.

- **Cite:** `$ grep -o 'saveUpdate([0-9]*' reference/decompiled/shs3_android/scripts/ | sort -u  +  QueryManagerBase.as:15`
- **Lane impact:** L1 world-exploration and every lane inheriting §6: corrects the journal's save-schema-recovered claim, which says "20 numbered data slots plus four timer slots" while its own enumeration lists only three timers, and the score rationale which says "24-slot". DATASLOTS:int = 20 at QueryManagerBase.as:15 is the literal the schema is sized on, and 103 (getBattleStatsString) is written next to slot 1 as a data slot. The headline — §6's "design a persistence schema" is false, it needs transcribing — is unaffected.

### `[[world-exploration/save-schema-is-23-slots]]` — UPHELD [A2] (1 critic)

The recovered save schema is 23 slots - 20 data and 3 timers - not the 24 / 'four timer slots' the journal states.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:1047-1187 (23 saveUpdate call sites) + NetworkManager.as:1870 (the saveUpdate definition, which is the 24th grep hit)`
- **Lane impact:** L1 world-exploration: cosmetic correction to save-schema-recovered. Data slots are 0-12, 14-19 and 103 (= 20); timer slots are 100 nextAPUpdate, 101 nextDTUpdate, 102 nextWarTurn (= 3). Slot 13 is genuinely absent from the writer. The substantive claim - that the format is transcribable rather than designable, and that slot 10 is the packed world position - is unaffected.

### `[[world-exploration/save-slot-count-23]]` — UPHELD [A2] (1 critic)

The recovered save schema is 23 slots, not 24: 20 data slots (0-12, 14-19, 103) and only three timer slots (100, 101, 102).

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:1047-1187 (23 saveUpdate calls, enumerated) + NetworkManager.as:1870`
- **Lane impact:** L1 world-exploration: arithmetic correction to the claim text ('20 numbered data slots plus four timer slots') and to the score rationale ('the 24-slot save schema'). A repo-wide grep confirms QueryManagerPIO holds every call site; NetworkManager.as:1870 is the definition. Slot 13 is genuinely unused. The three timers map exactly onto the three sub-day clocks (AP 60 s, duel tokens 120 s, war turn 3600 s).

### `[[world-exploration/search-chance-semantics]]` — UPHELD [STILL_UNHELD] (6 critics)

The node-level <search><id>20000</id><chance>5</chance> block's semantics are unknown: XMLWorldNode stores it in searchList and no consumer of searchList exists anywhere in the 559-class decompile.

- **Lane impact:** L1 world-exploration: exactly one such block exists in the whole authored node file. 'chance' in XMLLoot is a 0..1 fraction (Overworld.as:324 multiplies by 100), which would make the value 5 meaningless here. Dead field, alternate scale, or a consumer I failed to find — not claimed either way.

### `[[world-exploration/stables-is-the-5ap-object]]` — UPHELD [A2] (1 critic)

The prior round's banked PARTIAL 'there is no 5-AP stable object' is wrong: the adjacent-town travel dialog is built by a function literally named initStablesButtons, and the action it fires costs 5 AP plus nodeLevel x 2 gold -- so the ledger's 'stable 5' entry is correct and merely omits the fare.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1680 (initStablesButtons) and :1720-1745 (travel); string ids 525/735 'Stables', 5061 'Stablehand' in docs/gauntlet/L0/index/strings.json`
- **Lane impact:** L1 world-exploration and L10 economy: docs/gauntlet/L0/CLAIMS.md:2751 (world-exploration/ap-cost-table-stable-mislabelled, PARTIAL) should be marked SUPERSEDED. The ledger's Ready bullet 'stable 5' does not need downgrading to PARTIAL after all -- it needs the gold fare appended. The economy lane's 'section-1 line 79 stable 14c+5AP' reconciles cleanly as one level-7 observation of nodeLevel x 2 (7 x 2 = 14). The current survey reaches the right answer but never declares that it is reversing a banked claim, so the ledger of banked claims stays wrong unless this is recorded.

### `[[world-exploration/start-coords-derived]]` — UPHELD [A2] (6 critics)

The ledger's Ready bullet "(start 21,51 / 0,3)" is confirmed and now derivable: the character-creation literal STAT_LOCATION = 8382465 decodes to sector (2046,2049) → territory (341,341) → displayed TERRITORY (21,51), SECTOR (0,3).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:713 (+ decode via NodeGenerator.as:298-302, WarSelectUI.as:17-19)`
- **KILLS this line:** "Ready: territory/sector coord system (start 21,51 / 0,3)"
- **Lane impact:** L1 world-exploration: the Ready bullet was right but ungrounded. "21,51" is not an observed coordinate pair, it IS TERRSHIFTX/TERRSHIFTY — the world's level-3 origin territory (341,341) displays at (21,51) by construction. 8382465 is also the first node in 112_Mobile_NodeData.bin:5.

### `[[world-exploration/start-node-name-confirms-rng]]` — UPHELD [A2] (1 critic)

The payload's own string table independently confirms the NameGenerator reproduction: the start node's authored label resolves to "W Kasuta Forest", matching the LCG-derived town name "Kasuta" for territory 1397077.

- **Cite:** `reference/extracted/android/112_Mobile_NodeData.bin:5-6 + docs/gauntlet/L0/index/strings.json id 1037`
- **Lane impact:** L1 world-exploration: a second, independent artifact corroborating claim place-name-reproduced-from-payload. The surveyor derived "Kasuta" purely from re-running the LCG; the authored node file plus the XLIFF string table produce the same word from a completely different path, and also confirm the 'W' quadrant prefix is baked into authored names as well as generated ones. Also worth carrying: 8382465 appears three times in the node file (:5 as the start node id, :46 and :2731 as signpost destinations), so the start node is a routed hub, not an isolated spawn.

### `[[world-exploration/start-town-is-kasuta]]` — UPHELD [A2] (1 critic)

The start territory's generated name is 'Kasuta' and the boot banner is 'W KASUTA FOREST' - a second, independent reproduction of the name generator from a different territory id.

- **Cite:** `reference/decompiled/shs3_android/scripts/NameGenerator.as:40,42,163-166 + RNG.as:64-75, reproduced by me; corroborated by docs/research/video-study/segments/A-00-boot-login.md:61`
- **Lane impact:** L1 world-exploration: raises the name-generator result from one match to two, from two different territory ids, one of which (the spawn) also independently confirms STAT_LOCATION=8382465 -> sector (0,3) and displayed territory (21,51). Note the corroborating source is a video-study segment summary, i.e. a LEAD not an artifact - the A2 reproduction is what carries this finding.

### `[[world-exploration/the-twelve-hour-crop-never-rots]]` — UPHELD [A2] (1 critic)

Three of the four crop tiers can rot; the fourth cannot. InteractUI_crops.as:55 declares `internal var gracePeriod:int = 900;` (15 minutes). The 15-minute (:116-128), 1-hour (:131-143) and 6-hour (:146-158) crops each run PLANTED / READYFORHARVEST-within-grace / ROTTED. The 12-hour crop at :161-169 has only PLANTED else READYFORHARVEST - no grace term and no ROTTED arm at all. A recreation that applies a uniform 900-second spoil window to all four crops is wrong on the highest tier.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI_crops.as:55 and :110-170`
- **Build:** android v0.682
- **Lane impact:** L10 world-exploration - corrects the farm-timer finding in this same packet before it reaches config.

### `[[world-exploration/tired-idle-not-death]]` — UPHELD [A2] (1 critic)

AP == 0 in adventure mode is not a death or retreat condition - it swaps the player to a TIRED idle animation, and the same branch fires in combat at HP <= 25% of max.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:1228-1232`
- **Lane impact:** L1 world-exploration (removes a fabricated rule from the AP claim) and L6 art-anim-audio-feel (adds a real, uncatalogued one). TIRED appears exactly twice in the class - here and in a sheathed-state test at :4319 - so it is unambiguously an idle pose, not a state transition. The combat half is the more valuable half: the fighter visibly changes idle at quarter health, which is a feel cue the art lane can implement.

### `[[world-exploration/twelve-hour-crop-never-rots]]` — UPHELD [A2] (1 critic)

The 12-hour crop has no ROTTED state — its state machine is two-way (PLANTED, then READYFORHARVEST forever), unlike the 15-minute, 1-hour and 6-hour crops which all rot after a 900-second grace.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_VegePatch.as:131-140 (also duplicated at InteractUI_crops.as:158-168)`
- **Lane impact:** L1 world-exploration: corrects the journal's farming-tables claim, which states a 15-minute grace before ROT across all four crop tiers. Three of four. The 12-hour crop is the safe overnight plant — it cannot be lost to inattention, which is a deliberate free-to-play design choice and exactly the kind of feel rule a port would silently get wrong if it applied the grace uniformly.

### `[[world-exploration/twelve-hour-crops-never-rot]]` — UPHELD [A2] (1 critic)

The 15-minute harvest grace does not apply to the 12-hour crop: Obj_VegePatch's case 4 has no grace or ROTTED branch at all, so a 12-hour crop sits in READYFORHARVEST indefinitely.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_VegePatch.as:134-143`
- **Lane impact:** L1 world-exploration: corrects world-exploration/farming-tables, which states all four tiers carry 'a 15-minute harvest grace before ROT'. Cases 1, 2 and 3 do (900/3600/21600 s + 900 s grace, else ROTTED); case 4 does not. Any ported farming.ts must special-case the 12 h crop as non-perishable, or it will destroy player crops the OG never destroyed.

### `[[world-exploration/web-payload-carries-world-constants]]` — UPHELD [A2] (1 critic)

The web v0.717 payload's own constant pool carries the world's LCG constants and all twelve pinned-territory ids in one contiguous run, so cross-build parity for the world extends far past the land mask the surveyor conceded.

- **Cite:** `reference/extracted/payload.xml:104820-104834 (and :104821 for the modulus)`
- **Lane impact:** L1 world-exploration: upgrades the surveyor's own STILL_UNHELD 'cross-build-numeric-parity'. 49297 and 233280 are the RNG.rnd() increment and modulus; the twelve ids that follow are exactly the pinned-town table from Android NodeGenerator.getNoChangeTownLevel, in the same clustered order. `grep -c ">8382465<"` also returns 1, so the spawn node ships in v0.717 too. This is constant-pool evidence, not byte-proof — but it is the identical evidence class the surveyor already accepted for the procedural room builder at payload.xml:118249-118266, so the same standard must extend the verdict. What remains genuinely Android-only: APINTERVAL=60, LEVELSTART=3, the crop timers, the AP costs.

### `[[world-exploration/web-third-placename-hardcode]]` — UPHELD [STILL_UNHELD] (1 critic)

The web v0.717 build may carry a third hardcoded territory-name exception ('Iwakuni') that the Android v0.682 getPlaceName does not, which would make the ported name generator emit the wrong name for at least one territory.

- **Lane impact:** L1 world-exploration: a porting hazard against world-exploration/place-name-reproduced-from-payload, logged as a lead because it rests on constant-pool adjacency rather than a quoted line of code. Evidence for: NameGenerator.as:136-144 hardcodes exactly two exceptions ('Ibamaya' for territoryID 1405272, 'Gokura' for 1524045), neither of which appears in 89_NameGenerator_PlaceNames.bin; the WEB payload's constant pool carries three capitalised place names adjacently at payload.xml:119264-119266 -- Ibamaya, Gokura, Iwakuni -- immediately after the nameending array and the 'replace' token used only by the name functions; and grep -rn Iwakuni over all 559 android classes returns 0 files. Evidence against my own hypothesis: 'Iwakuni' IS a normal row of the PlaceNames blob, sitting in a run of real Japanese cities (Hofu / Iwakuni / Kudamatsu / Mine / Nagato), so its presence in the blob is innocent -- but a blob row does not need to be an AS3 string constant. Separately confirmed and NOT in doubt: the web pool's namestarting and nameending runs match the android arrays in order and content with exactly the two absences a deduplicating pool predicts (Kiyo once instead of twice; 'i' and 'no' deduped), so the generator TABLES are cross-build consistent. Closing this needs a web-side NameGenerator decompile, which the repo does not hold.

### `[[world/map-bitmap-is-in-the-repo-735-land-pixels]]` — UPHELD [A2] (1 critic)

The world map bitmap is IN the repo and is byte-checkable — nobody has cited it. reference/extracted/android/110_Mobile_MapBitmapData.bin is a 272-byte GIF89a, 63 x 72, with exactly 735 non-black pixels. Applying QuestEngine.processMapBitmapData's transform to all 735 gives territoryx in [329,389], territoryy in [291,360], and mapid in [1347935, 1593647]. The '735 territories' figure is therefore MEASURED, not inferred, and the entire world grid can be generated deterministically from a 272-byte artifact already on disk.

- **Cite:** `reference/extracted/android/110_Mobile_MapBitmapData.bin (GIF89a 63x72, 735 non-black pixels, decoded by me) + reference/decompiled/shs3_android_payload/scripts/QuestEngine.as:522-526`
- **Build:** both
- **Lane impact:** L-world-exploration: 'world map/geography' (REBUILD_READINESS.md:132) is no longer a must-measure — the projection and the full territory set are recoverable from one committed file.

### `[[world/the-hud-prints-territory-21-51-on-film]]` — UPHELD [A1] (1 critic)

Frame-side confirmation of the two shift constants the war-map finding rests on. reference/frames/zFt_combat/zFtCaTO0_1M_t0330s.png shows the overworld minimap panel top-right with 'TERRITORY (21,51)' and 'SECTOR (4,3)' printed beneath it. TERRSHIFTX=21 and TERRSHIFTY=51 are therefore not merely code constants — they are the start territory the ledger already records as 'start 21,51 / 0,3', now seen on film. The same frame also shows a red overworld nameplate reading 'GUESTDIT (3)', which is independent frame evidence for the (N)=level plate.

- **Cite:** `reference/frames/zFt_combat/zFtCaTO0_1M_t0330s.png — full 1920x1080 frame downscaled to 960x540; minimap panel occupies roughly x 760-930, y 70-280`
- **Build:** web v0.717
- **KILLS this line:** "- Ready: territory/sector coord system (start 21,51 / 0,3)"
- **Lane impact:** L10 world-exploration + L0 ui-hud: the minimap prints TERRITORY (x,y) and SECTOR (x,y) verbatim, and the coordinate origin matches the payload's TERRSHIFTX/Y.

### `[[world/third-hardcoded-placename-override-web-only]]` — UPHELD [A2] (1 critic)

getPlaceName in the WEB v0.717 build special-cases THREE territory ids, not two: 1405272 -> 'Ibamaya', 1524045 -> 'Gokura', and 1519945 -> 'Iwakuni'. The android v0.682 NameGenerator has only the first two. Every place-name claim in this lane that enumerates 'two hard-coded overrides' is therefore an android reading applied to the web build, and a recreation built to that spec will render territory 1519945 with a generated syllable name instead of Iwakuni.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t136s0§.as:140-150; contrasted with reference/decompiled/shs3_android/scripts/NameGenerator.as:135-144`
- **Build:** web v0.717 (divergence from android v0.682)
- **Lane impact:** L8 world-exploration: the place-name generator port needs all three overrides. Also a live parity hole in two claims already in this packet (questdata-critic/placename-generator-held asserts 'no parity hole' at exactly this spot; questdata/placename-generator-DECODED labels itself build 'both').

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
