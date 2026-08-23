# LEDGER PACKET — `meta-social`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**36 surviving overturns · 3 true-but-rejected · 50 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
| **meta-social** | 31 | clan facts, 11-rank ladder, structure costs, Ninja-Services prices | server-sim topology; map board; achievements/daily/token numbers; offline gold faucet |
### meta-social — 31
- **Ready:** 4 clans (heraldry/masks/daimyo/capitals) + Shira Tancho story-only; War-Room 6 actions + 11-rank ladder (moves/hr + thresholds); structure costs; terrain deploy mods; kill cap 350; flag +120%; 24h resolution; Ninja-Services prices; daily-login structure; two token types.
- **Blockers (mostly structural):** ① **server-authoritative simulation** (24h tick, matchmaking, live population) — **unrecoverable at 1:1**; must be scoped out or rebuilt as a *new* offline AI sim (labeled). ② War-Room **map topology** (board/adjacency). ③ achievements list, daily-reward table, token costs — *one Ruffle session closes all.* ④ offline gold faucet rate (primary source was dead IAP).
- **Surface:** War-Room numbers already in config are now primary-confirmed (upgrade citations); "moves per turn" reconciles as "per hour" (36 = Private's rank threshold, not a turn cap); Golden Token reads as a **quest item** in v0.717 vs a spendable currency in the wiki — version-check needed.

---
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[NF-4/premium-ladder-has-a-2-gold-tier]]` — UPHELD [A2] (3 critics)

The premium (Ninja Services) price ladder is 1/2/3/5/12 Gold, not 1/3/5/12: a 2-Gold tier exists holding 2101 'Medium Soldier Pill' and 2126 '25 Duel Tokens'. Measured tier counts over the 143 unique SKUs: 1 Gold x20, 2 Gold x2, 3 Gold x94, 5 Gold x4, 12 Gold x23. The 12-Gold outfit tier is 23 bundles, not 30.

- **Cite:** `reference/extracted/android/121_Mobile_PremiumData.bin joined to reference/extracted/itemdata.xml <heavenlyprice> and docs/gauntlet/L0/index/strings.json`
- **Build:** both (list Android, prices WEB itemdata.xml)
- **KILLS this line:** "Ninja-Services prices"
- **Lane impact:** L4 economy + L-items-equipment — two SKUs would be mispriced by a 1/3/5/12 ladder, and the outfit-bundle count is off by seven.

### `[[actionscript/territory-daily-sim-vocabulary]]` — UPHELD [A2] (2 critics)

The daily territory simulation's entity set and complete event vocabulary are held client-side because the client renders the log — wildlife population dynamics, mercenary arrival/upkeep, named bandit groups with takeovers, oni thresholds, prosperity losses and compass-directional neighbours — but the tuning coefficients are not.

- **Cite:** `reference/decompiled/shs3_android/scripts/HistoryItem.as:137-300 and :42`
- **KILLS this line:** "① server-authoritative simulation (24h tick, matchmaking, live population) — unrecoverable at 1:1; must be scoped out or rebuilt as a new offline AI sim (labeled)."
- **Lane impact:** L-meta-social: blocker ① narrowed, not closed — the tick (RUN-2 WARMOVEINTERVAL), the board (RUN-2 hex grid) and now the ecology are all held; what is genuinely unrecoverable is the live player population and the rate constants. PARTIAL because no coefficient is grounded.

### `[[bindata/survival-is-warroom-content]]` — UPHELD [A2] (2 critics)

bindata/119 is not a standalone survival mode: WarHexUI.createWarRoomWaveList loads it as the CLAN WAR battle content and re-bases every enemy id per clan side (id%100 + 200/300/400/500/600), which is why npcdata carries five parallel Soldier rosters.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin (39 <wave>, 87 <enemy>) + reference/decompiled/shs3_android_payload/scripts/WarHexUI.as:1719-1752 — Android class name 109_WarHexUI_SurvivalModeData.bin`
- **KILLS this line:** "① server-authoritative simulation (24h tick, matchmaking, live population) — unrecoverable at 1:1; must be scoped out or rebuilt as a new offline AI sim (labeled)."
- **Lane impact:** L-meta-social + L-enemies-ai: the live population and 24h tick remain genuinely unrecoverable — not disputed. But the clan war's BATTLE CONTENT (39 waves, 87 enemy groups, the per-clan id remap, the Soldier/Elite/Heavy/Castle Guard tiering resolved via docs/gauntlet/L0/index/resolved_names.json) is held verbatim and is currently filed under 'unrecoverable'. Waves also use ids 453=Santa and 455=Nian Monster, i.e. seasonal live-ops content no ledger mentions.

### `[[bindata/territory-12bit-packing-and-6x6-nodes]]` — UPHELD [A2] (2 critics)

Territory ids pack two 12-bit fields (x = id>>12 & 0xFFF, y = id & 0xFFF) and every territory subdivides into exactly 6×6 nodes re-using the identical packing — which is why the War-Room board is 6×6.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/WarHexUI.as:1422-1424 + NameGenerator.as:145-146`
- **KILLS this line:** "② War-Room map topology (board/adjacency)."
- **Lane impact:** world-exploration + meta-social. Explains run-3's C10 (6×6 hex board) — the war board IS the territory's node grid, not a separate abstraction. Gives the coordinate contract a builder needs for world.ts.

### `[[frames/achievements-daily-and-tokens-all-on-film]]` — UPHELD [A1] (2 critics)

All three items of §4 meta-social blocker ③ are recoverable without a Ruffle session: a named achievement toast, the daily-prize streak ladder and the live duel-token counter are each visible in frames and each resolves into the string table.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0001.jpg (crop 550,490-1000,545 @6.5x); reference/frames/Nr4fQstqHDM/seg-00/frames/frame_0001.jpg (crops 0,30-1024,300 @3x and 0,380-1024,520 @3.2x); reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0018.jpg`
- **Build:** web v0.717 frames; android v0.682 string cross-refs
- **KILLS this line:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** meta-social, economy: closes blocker ③ and supplies the daily streak structure

### `[[frames/recruit-gets-three-moves-a-turn]]` — UPHELD [A1] (2 critics)

The v0.717 War Room UI literally prints 'MOVES A TURN' beside a separate live 'MOVE(S) LEFT' allowance, refuting the ledger's reconciliation of moves-per-turn as 'per hour', while corroborating its reading of 36 as a rank threshold — and it supplies the missing bottom-rung value, Recruit = 3 moves a turn.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg (crop 0,0-1024,576 @1.95x)`
- **Build:** web v0.717
- **KILLS this line:** ""moves per turn" reconciles as "per hour" (36 = Private's rank threshold, not a turn cap)"
- **Lane impact:** meta-social: fixes the 11-rank ladder's units and adds the Recruit rate

### `[[frames/war-room-territory-board-frame-exists]]` — UPHELD [A1] (2 critics)

A frame of the War Room board DOES exist — the banked meta-social survey searched the wrong segment and declared it absent — and it shows the territory layer is a uniform orthogonal grid ruled over a Japan silhouette, with allegiance, rank, move budget and clan-crops all printed on the same card.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg (crop 0,0-1024,576 @1.95x)`
- **Build:** web v0.717
- **KILLS this line:** "② War-Room map topology (board/adjacency)."
- **Lane impact:** meta-social: closes §4 blocker ② at the territory layer; the 6x6 sector board remains a second, unfilmed layer

### `[[hunter05/war-wave-table-is-340-plus-11-equals-351]]` — UPHELD [A2] (2 critics)

Measured, not inferred: the war-room wave table sums to 340 rank-and-file troops plus exactly 11 id-700..710 live-player slots = 351, and the android and web blobs agree to the row.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin and reference/extracted/android/109_WarHexUI_SurvivalModeData.bin`
- **Build:** both
- **KILLS this line:** "kill cap 350"
- **Lane impact:** L0 meta-social — the ledger's 'kill cap 350' is wrong in both directions. An offline war-room battle should spawn 340.

### `[[meta-social/700-block-is-live-players]]` — UPHELD [A2] (2 critics)

NPC ids 700-710 in the war-room wave table are runtime slots for live enemy players, not payload NPCs -- so the payload-deterministic kill count of a war-room battle is 340, and the extra 11 are the server half that cannot be recreated offline.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:1412-1413 and :1523 + QuestEngine.as:1039-1043 + reference/extracted/npcdata.xml and reference/extracted/android/125_Mobile_NpcData.bin (both: 495 <npc>, max id 819, zero ids in 690-720)`
- **KILLS this line:** "kill cap 350"
- **Lane impact:** L0 meta-social + L-enemies-ai -- an offline war-room battle should spawn 340 troops from the 39-wave table and zero id-700 entities; the '350/351 samurai' framing must not be built.

### `[[meta-social/achievement-58-pins-340]]` — UPHELD [A2] (2 critics)

The game's own achievement text independently pins 340 as the rank-and-file war-room kill count, corroborating the wave-table sum from a second, unrelated table.

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin, achievement row index 58, resolved via docs/gauntlet/L0/index/strings.json`
- **KILLS this line:** "kill cap 350"
- **Lane impact:** L0 meta-social — supports the 340-troop half of the kill-cap correction without relying on the wave-table sum, and separates the 340 troops from the 11 unresolved boss slots.

### `[[meta-social/achievements-61-resolved]]` — UPHELD [A2] (6 critics)

Blocker ③'s achievements third is dead without a Ruffle session: all 61 achievements resolve to names, descriptions, tracked stat ids and thresholds.

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin (<achievementdata>, 61 <achievement> rows) resolved through docs/gauntlet/L0/index/strings.json`
- **KILLS this line:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** L0 meta-social — also pins the skill-tree shape for L-skills (10 Chi skills, 9 Ninja skills) as a side effect.

### `[[meta-social/achievements-in-web-payload]]` — UPHELD [A2] (2 critics)

The 61 achievement names are in the WEB v0.717 payload itself, in the same order as the Android blob, so blocker ③'s achievement third closes on a desktop cite with no Android caveat.

- **Cite:** `reference/extracted/payload.xml:119088-119148 compared element-wise to reference/extracted/android/114_Mobile_AchievementData.bin resolved via docs/gauntlet/L0/index/strings.json`
- **KILLS this line:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** L0 meta-social -- and this is the strongest available validation of the whole S0-3 Android string table against the desktop build: 61 independently-authored strings agreeing name-for-name and order-for-order.

### `[[meta-social/achievements-list-is-on-disk]]` — UPHELD [A2] (2 critics)

The achievements list is HELD, not a blocker. reference/extracted/android/114_Mobile_AchievementData.bin is plain UTF-8 XML: <achievementdata> with 61 <achievement> rows, each carrying <id>/<img>/<name>/<desc>/<stat>/<val>. Names and descriptions resolve straight through the string table (desc id = name id + 80): 8000 'Duelist I' (stat 60000, val 1), 8003 'Killer I' / 'Defeat 100 enemies.' (60017, 100), 8006 'Eye of the Beheader I', 8058 'Warrior III' / 'Defeat 340 in a war room attack.', 8060 'Be Awesome' / 'Completed Season 1'. The full list, its tracked stat ids and its thresholds are all already extracted.

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin (61 <achievement> rows, my own parse) + docs/gauntlet/L0/index/strings.json["8000"]-["8060"] and ["8080"]-["8140"]`
- **Build:** android v0.682
- **KILLS this line:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** L0 meta-social — the achievements third of blocker ③ closes from a file already on disk. With the daily-reward third closed by the packet's own finding, only 'token costs' survives, and the 'one Ruffle session closes all' close-path is moot given the P0 no-build verdict.

### `[[meta-social/flag-120-is-mislabelled-terrain-row]]` — UPHELD [A2] (6 critics)

"flag +120%" is not a flag bonus at all — it is the case-1 row of getTerrainModifier (one step of terrain advantage); the only structure modifier in the payload is toValue += 2 for a completed Barricade, City or Castle, which can push an attacker down to 0.25x.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:2281-2307`
- **KILLS this line:** "flag +120%"
- **Lane impact:** L0 meta-social — kills a phantom number and replaces it with the real defender modifier the ledger omits entirely; the three neighbouring master-reference deploy rows (+60/+100/+75) are proven exact by the same table.

### `[[meta-social/frame-shows-6x6-sector-board]]` — UPHELD [A1] (2 critics)

The 6x6 sector board IS photographed: the overworld HUD minimap in the second longplay draws the whole board with axis labels 0-5 on both axes, N/E/S/W compass letters and the wall segments that encode blocked vs open adjacency.

- **Cite:** `reference/frames/zFtCaTO0_1M/map/frames/frame_0020.jpg, crop (370,45)-(505,180) upscaled x9 LANCZOS (source frame is 512x288)`
- **KILLS this line:** "② War-Room map topology (board/adjacency)"
- **Lane impact:** L0 meta-social — blocker ②'s sector half now has A1 backing as well as A2: the 0..5 board and its 4-way blocked/open adjacency are visible, matching WarHexUI's `x > 5 || y > 5` bounds and the war-rules 'if the adjacent sector is blocked' rule. Also L-world-exploration: this is the sector-navigation UI.

### `[[meta-social/frame-shows-world-territory-board]]` — UPHELD [A1] (2 critics)

The world territory board is photographed too — a tile grid of territories with settlement-tier icons and per-territory clan flags in the clan colours, plus the level-gating legend.

- **Cite:** `reference/frames/zFtCaTO0_1M/map/frames/frame_0025.jpg upscaled x3 (source frame 512x288)`
- **KILLS this line:** "② War-Room map topology (board/adjacency)"
- **Lane impact:** L0 meta-social — pairs with the 63x72 GIF mask: the mask is the land shape, this frame is how the 735 territories render, tier by tier, with the clan flag the war-room rules say marks on-going battles. Also gives ui-hud the world-map screen and world-exploration the territory-level gate.

### `[[meta-social/kill-cap-is-351-not-350]]` — UPHELD [A3] (2 critics)

The War-Room kill cap is 351, not 350, and the master reference's decomposition is off by one on the samurai half. Both survival-wave tables (web bindata/119 and Android 109) contain 39 waves and 87 <enemy> rows summing to 351: the 400-id block sums to 340 and the 700-id block to 11 (ids 700 through 710, one each). SHSD_MASTER_REFERENCE.md:170 records 'Kill cap (troops) | 350 (= 340 troops + 10 samurai)' and REBUILD_READINESS.md:244 carries it forward as 'kill cap 350'. The troop half is exactly right; the samurai half is 11, not 10. Corroborated from the other side by achievement 8058 'Warrior III' = 'Defeat 340 in a war room attack.'

- **Cite:** `my own parse of reference/extracted/bindata/119_1t4646s0.bin and reference/extracted/android/109_WarHexUI_SurvivalModeData.bin (both: 39 waves, 87 enemy rows, sum qty 351, buckets {400: 340, 700: 11}, distinct 700-block ids 700-710); docs/research/SHSD_MASTER_REFERENCE.md:170`
- **Build:** both
- **KILLS this line:** "kill cap 350"
- **Lane impact:** L0 meta-social / L8 enemies-ai — a one-number correction to a CONTRACT-grade value that is already in the ledger's 'Ready' column, so it would have shipped wrong. Both builds agree, so there is no parity hole.

### `[[meta-social/premium-catalogue-is-143-skus]]` — UPHELD [A2] (2 critics)

The premium (Ninja Services) catalogue is 143 unique SKUs on a 1/3/5/12 Gold ladder, not the 12 rows the lane reports, and every one of them resolves in the WEB itemdata.xml.

- **Cite:** `reference/extracted/android/121_Mobile_PremiumData.bin joined to reference/extracted/itemdata.xml <heavenlyprice> and docs/gauntlet/L0/index/strings.json`
- **KILLS this line:** "Ninja-Services prices"
- **Lane impact:** L0 meta-social and L-items-equipment — the cosmetic tier is the bulk of the premium economy and is entirely absent from the lane's 12-row account.

### `[[meta-social/pvp-rooms-and-a-cut-steal-skill]]` — UPHELD [A2] (2 critics)

Two skills are explicitly excluded from PvP rooms, and a complete five-level coin-stealing ability exists in the shipped string table and art with NO skill row referencing it — but attributing it to the missing id 1023 is inference, not evidence.

- **Cite:** `reference/extracted/skilldata.xml:1575-1604 and :1637-1652 (strings 6111/6115); orphan strings 7024-7028 + 6022/6023 in docs/gauntlet/L0/index/strings.json; StealActionIcon.as:5-6 wired at GenericActionButton.as:191-193 and :309-311`
- **KILLS this line:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** L11 meta+rebirth and L8 ui-hud — per-skill PvP-room exclusion is a shipped rule the ledger's meta-social section does not carry. The steal content should be recorded as cut-or-node-only with orphaned strings, NOT as skill 1023; the id-1023 attribution is circumstantial (it sits exactly where the other 5-level cat-5 professions live) and I will not assert it.

### `[[meta-social/six-by-six-sector-board-is-pictured]]` — UPHELD [A1] (2 critics)

The 6x6 sector board the lane files as unpictured is plainly on screen in the SECOND longplay, complete with 0-5 axis labels on both axes and the white connector lines that are its exit topology.

- **Cite:** `reference/frames/map_analysis/zFtCaTO0_1M_map_013_t565s.jpg and zFtCaTO0_1M_map_010_t439s.jpg, crop (395,20)-(512,125) upscaled x10 LANCZOS`
- **KILLS this line:** "② War-Room map topology (board/adjacency)"
- **Lane impact:** L0 meta-social — kills one of the three deductions holding the score at 78. Also exposes the search scope: reference/frames/map_analysis/ (20 frames, 10 per longplay) and the entire zFtCaTO0_1M longplay were never opened by this lane.

### `[[meta-social/structure-costs-and-donation-rate]]` — UPHELD [A2] (6 critics)

Structure costs are exact — Forward Base 10000, Tunnels 5000, Barricades 10000, Village→Town 10000, Command HQ free — and the ledger's "500 coins/turn" donation cap is really 500 coins per build MOVE, so a War Hero can contribute 3,000 per turn.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUIBuildMenu.as:185-213 + WarHexUI.as:1291,1332 + WarHex.as:424,477,521,540`
- **KILLS this line:** "Build donation cap | 500 coins/turn"
- **Lane impact:** L0 meta-social — the move economy is off by a factor of 3-6 as written; also newly pins the castle gate window at 3*60*60 s (WarHex.as:499,507,513).

### `[[meta-social/war-mechanics-are-in-the-web-build]]` — UPHELD [A2] (2 critics)

The entire war deploy/arrow/terrain/6x6-board stack is present in the WEB v0.717 build, so the Android caveat is removable for war-room mechanics.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7785s0§.as:1108, :1123, :2119-2145, :2150`
- **KILLS this line:** "② War-Room map topology (board/adjacency)."
- **Lane impact:** L0 meta-social — blocker ② closes on WEB evidence rather than Android, which is what the ledger actually needed.

### `[[meta-social/war-room-frame-carries-rank-moves-and-clan-numbers]]` — UPHELD [A1] (2 critics)

The same War Room frame the packet cites for the map also carries meta-social numbers nobody has claimed. Reading the full 1024x576 frame: 'ALLEGIANCE: CLAN AKA RYU', 'RANK: RECRUIT (3 MOVES A TURN)', 'MOVES MADE: 0/36', '3 MOVE(S) LEFT', 'CLAN CROPS: 402 (+2 HQ)', 'FLAGS INDICATE BATTLES THAT THE CLANS ARE CURRENTLY ENGAGED IN', and a 'SHOW CLAN MSG' button. The rank line settles the ledger's own open question at RR:246 in favour of a per-turn cap that the UI states in words - Recruit gets 3 moves a turn - while 36 is a separate cumulative counter, not the cap. The board is also confirmed as a uniform square grid over a vector coastline, at 10 px per territory per WarSelectUI.as:233-234.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg (full-frame read at 1024x576 plus crop 20,30-720,420 @2x LANCZOS) + reference/decompiled/shs3_android/scripts/WarSelectUI.as:233-234`
- **Build:** web v0.717
- **KILLS this line:** ""moves per turn" reconciles as "per hour" (36 = Private's rank threshold, not a turn cap)"
- **Lane impact:** L11 meta-social: RR:246's reconciliation is contradicted on camera - the UI says 'RECRUIT (3 MOVES A TURN)' in so many words, and 36 is the denominator of a separate MOVES MADE counter. Also closes part of RR:245 (2) War-Room map topology when read with world/map-bitmap-is-held-byte-exact.

### `[[meta-social/war-room-frame-says-moves-a-turn-not-per-hour]]` — UPHELD [A1] (2 critics)

The War Room frame nobody mined carries four unclaimed meta-social numbers, and one of them contests the ledger. reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg reads, along its bottom rail: 'ALLEGIANCE: CLAN AKA RYU', 'RANK: RECRUIT (3 MOVES A TURN)', 'MOVES MADE: 0/36', and on the right '3 MOVE(S) LEFT', with 'FLAGS INDICATE BATTLES THAT THE CLANS ARE CURRENTLY ENGAGED IN' and a 'SHOW CLAN MSG' button; the header reads 'CLAN CROPS: 402 (+2 HQ)'. The shipped UI says A TURN, in the game's own copy, and pairs a per-turn allowance of 3 with a 0/36 running counter - so 36 is a counter denominator sitting beside a 3-per-turn allowance, not evidence that 'moves per turn' means 'per hour'.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg (full frame, my own 2x LANCZOS render)`
- **Build:** web v0.717
- **KILLS this line:** "- Surface: War-Room numbers already in config are now primary-confirmed (upgrade citations); "moves per turn" reconciles as "per hour" (36 = Private's rank threshold, not a turn cap);"
- **Lane impact:** L12 meta-social - RR:247's 'reconciles as per hour' is contradicted by the shipped UI copy; the frame wins and the reconciliation needs redoing.

### `[[meta-social/warroom-board-is-on-screen]]` — UPHELD [A1] (2 critics)

The war-room board is on screen in at least four frames in a segment the survey never opened -- reference/frames/Nr4fQstqHDM/seg-29/ is a War Room segment, and the 6x6 sector board with printed 0-5 axes appears in the second longplay's map segment.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0019.jpg and frame_0018.jpg (whole frame, 512x288 upscaled x3 LANCZOS); reference/frames/zFtCaTO0_1M/map/frames/frame_0024.jpg crop (398,40)-(502,160) upscaled x10 LANCZOS`
- **KILLS this line:** "② War-Room map topology (board/adjacency)"
- **Lane impact:** L0 meta-social -- retires the survey's only frame-side STILL_UNHELD, and gives A1 confirmation of the 0..5 sector clamp, the [N,S,E,W] exit model, the one-hour turn (NEXT TURN IN 59:58) and the 24h capture advance, none of which had a picture before.

### `[[meta-social/web-bindata-119-class-name-match]]` — UPHELD [A2] (2 critics)

The web bindata blob 119 is bound to the war-room wave table by NAME, not by inference: the web WarHexUI declares its SurvivalModeData class as §1t4646s0§, which is literally the class token in the extracted filename 119_1t4646s0.bin.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7785s0§.as:13 vs reference/extracted/bindata/119_1t4646s0.bin`
- **KILLS this line:** "119 = <survivalmodedata> — an ENTIRE GAME MODE absent from all 12 ledger systems"
- **Lane impact:** L0 meta-social / enemies-ai — Stage-0 S0-1's orphan 'survival mode' is definitively the war-room battle wave table in the WEB build too, and the anonymous web bindata filenames turn out to encode the consuming class token, which is a general decoding key for the other 26 web blobs.

### `[[meta-social/web-daily-prize-rolls-differ]]` — UPHELD [A2] (3 critics)

The WEB v0.717 daily-login prize uses a level-scaled base roll of (37 + player level) outcomes and an eight-outcome day-10 bonus; only the 30-day super-bonus (10 outcomes) matches the Android table.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1216-1219, 1535, 1588 (streak/cooldown block at :1514-1527)`
- **KILLS this line:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** L0 meta-social — the daily-reward third of blocker ③ is closed from the WEB payload, but with different probability tables than the survey filed; a 1:1 recreation must use 37+level / 8 / 10.

### `[[meta-social/web-duel-token-cap-40]]` — UPHELD [A2] (3 critics)

The v0.717 Duel Token hard cap is 40, not the Android build's 30.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:200, :1401, :1405, :2079 + §1t6519s0§.as:827 + reference/extracted/itemdata.xml line 402 (item 2127)`
- **KILLS this line:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** L0 meta-social -- completes blocker 3's token third with the RIGHT number; the web premium SKU selling 40 tokens is the independent cross-check.

### `[[meta-social/web-rebirth-25-100]]` — UPHELD [A2] (3 critics)

In the target WEB v0.717 build, rebirth grants 25 premium Gold (100 at the Dan 8 rebirth), new characters start with 3 Gold, and the client's own anti-cheat ceiling is 300 -- not the 5/20/60 the survey reported from the Android build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651, :1024, :228 + reference/decompiled/shs3_payload/scripts/§1t406s0§.as:1544, :1549, :1581`
- **KILLS this line:** "④ offline gold faucet rate (primary source was dead IAP)"
- **Lane impact:** L0 meta-social -- blocker 4 is closed, but at 25/100/303, and the Kongregate forum's 'Rebirthing = 25 FREE Gold' is CONFIRMED rather than contradicted. Any config written from the survey's 5/20/60 would be wrong for v0.717.

### `[[meta-social/web-rebirth-faucet-25-100-300]]` — UPHELD [A2] (3 critics)

The v0.717 rebirth faucet is 25 Gold per rebirth and 100 at the Dan 8 rebirth -- a 300-Gold lifetime ceiling that the desktop client itself uses as its paid-player test -- exactly 5x the Android values the survey reported.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638-2656 (and :222,:228,:254) + reference/decompiled/shs3_payload/scripts/§1t406s0§.as:1544`
- **KILLS this line:** "④ offline gold faucet rate (primary source was dead IAP)"
- **Lane impact:** L0 meta-social -- blocker ④ closes, but at 25/100/300 not 5/20/60. Also vindicates docs/research/KONGREGATE_FORUM_FINDINGS.md:308 ('25 gold is awarded EVERY rebirth, rising to 100 gold on the 9th'), which the survey declared refuted by the payload; the forum was describing the desktop build the survey never opened.

### `[[meta-social/web-rebirth-grants-25-and-100-gold]]` — UPHELD [A2] (3 critics)

In the WEB v0.717 build rebirth grants 25 Heavenly Gold, and 100 at the Dan 8 rebirth — a 300-Gold lifetime offline faucet, five times the Android build's 5/20/60, and an exact match for the Kongregate thread the survey dismissed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638-2656 (stat ids fixed by :222/:228/:254)`
- **KILLS this line:** "④ offline gold faucet rate (primary source was dead IAP)"
- **Lane impact:** L0 meta-social — blocker ④ IS closed, but at 25/100/300, not 5/20/60; also restores KONGREGATE_FORUM_FINDINGS' 'Rebirthing = 25 FREE Gold' as a corroborated source, and shows the Android >60-Gold reportHack ceiling has no web equivalent.

### `[[meta-social/web-survival-table-differs-in-composition]]` — UPHELD [A3] (3 critics)

The web and Android war-room wave tables agree on 39 waves and 351 total enemies but not on composition: seven late waves in the web build draw from a five-slot id pool that includes an extra id 443, which the Android build reduces to two slots.

- **Cite:** `byte/diff check: reference/extracted/bindata/119_1t4646s0.bin (11,721 B) vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin (11,553 B)`
- **KILLS this line:** "kill cap 350"
- **Lane impact:** L0 meta-social / enemies-ai — the 351 kill total is safe from either build, but the per-wave enemy MIX must be read from the web file (bindata/119); the Android copy is a different, thinner draw.

### `[[meta-social/world-board-63x72-byte-identical]]` — UPHELD [A3] (6 critics)

Blocker ②'s world half is closed: the strategic war board is a 63x72 two-colour GIF mask with 735 land territories, and the web and Android copies are byte-identical, so the claim carries no Android caveat.

- **Cite:** `byte-check: reference/extracted/bindata/92_1t4648s0.bin vs reference/extracted/android/110_Mobile_MapBitmapData.bin`
- **KILLS this line:** "server-sim topology; map board; achievements/daily/token numbers; offline gold faucet"
- **Lane impact:** L0 meta-social — the §2 table's "map board" gap is dead; combined with the 6x6 sector generator the whole topology is now 735 territories → 6x6 sectors → 4-way [N,S,E,W] exits.

### `[[meta-social/world-map-topology-is-a-bitmap-mask]]` — UPHELD [A2] (2 critics)

The world-map / War-Room board topology is HELD and it is a bitmap, not a mystery. reference/extracted/android/110_Mobile_MapBitmapData.bin is a 63x72 two-colour GIF with 735 white pixels on black — a pixel silhouette of Japan (Hokkaido, Honshu, Shikoku, Kyushu and the Ryukyu chain all legible at x8 nearest-neighbour). White = a territory exists. WorldMapUI.as:206-208 hasTerritory() is mapBitmapData.getPixel(territoryx + TERRSHIFTX - WARMARKERSHIFTX, territoryy + TERRSHIFTY) != 0, with WarSelectUI.as:15/17/19 giving WARMARKERSHIFTX=8, TERRSHIFTX=21, TERRSHIFTY=51; getHexOwner keys ownership by mapid = (x+341) << 12 | (y+341); QuestEngine.as:1206 uses the same mask. CROSS-VALIDATED AGAINST A FRAME: the displayed 'NAGANO (26,52)' in frame_0025.jpg maps to getPixel(26-8, 52) = getPixel(18,52), which I read as pure white — land. So the board is 735 territories on a W x H grid with holes, and adjacency is grid-neighbour.

- **Cite:** `reference/extracted/android/110_Mobile_MapBitmapData.bin (63x72 GIF, 735 non-black pixels, my own PIL read incl. pixel(18,52) = (255,255,255)); reference/decompiled/shs3_android/scripts/WorldMapUI.as:206-208, :371-390 and WarSelectUI.as:15, :17, :19; frame reference/frames/zFtCaTO0_1M/map/frames/frame_0025.jpg`
- **Build:** android v0.682 blob, but the coordinate transform is confirmed against a web v0.717 frame
- **KILLS this line:** "② War-Room map topology (board/adjacency)"
- **Lane impact:** L0 meta-social + L10 world-exploration. Kills :245 ② outright, and also falsifies :115's unknown-unknown ('sparse geographic Japan outline, not a grid you can generate from W×H' — it IS a W×H grid plus a mask) and makes :225 ①'s close-path ('trace the map image') redundant, since the image is already extracted. This is the correct evidence for the sentence that meta-social/world-map-tiers-and-level-gating was pointed at and missed.

### `[[npcdata/five-clan-armies]]` — UPHELD [A2] (2 critics)

58% of the file (285 rows, ids 200-256/300-356/400-456/500-556/600-656) is FIVE identical 57-NPC level-1→70 clan armies differing only by armour and hat item id — five factions, not the ledger's four — and none of them carries a <reward>.

- **Cite:** `reference/extracted/npcdata.xml:4451 / :5486 / :6521 / :7556 / :8591 (base Soldier of each block, armor 4038 / 4041 / 4044 / 4047 / 4053) and :5392 / :6427 / :7462 / :8497 / :9532 (Castle Guard, armor 4040/4043/4046/4049/4052, hat 7024/7025/7026/7027/7029)`
- **KILLS this line:** "- Ready: 4 clans (heraldry/masks/daimyo/capitals) + Shira Tancho story-only; War-Room 6 actions + 11-rank ladder (moves/hr + thresholds); structure costs; terrain deploy mods; kill cap 350; flag +120%; 24h resolution; Ninja-Services prices; daily-login structure; two token types."
- **Lane impact:** meta-social — the clan-war army roster is recoverable content, and there are five armies not four; clan identity is per-item ART (all five armor ids resolve to the same string 'Garment'), not a tint, which is an art-anim constraint too.

### `[[uistrings-payload/golden-tokens-are-spendable-in-v0717]]` — UPHELD [A2] (1 critic)

Golden Tokens are a spendable currency in the web v0.717 build — they are the tournament entry fee — not a quest item; proved twice, by the authored tournament card and by a live goldenTokenText field on the tournament UI class.

- **Cite:** `reference/extracted/payload.xml:534288`
- **Build:** web v0.717
- **KILLS this line:** "Golden Token reads as a quest item in v0.717 vs a spendable currency in the wiki — version-check needed."
- **Lane impact:** meta-social Surface line closed; economy currency model. PARTIAL because the NUMBERS on the card are design-time placeholders — the currency ROLE is what is held. Second cite: reference/decompiled/shs3_payload/scripts/§1t7144s0§.as:22 'public var goldenTokenText:TextField;'.

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[actionscript/war-board-is-a-6x6-square-grid]]` — NOT-UPHELD [A2] (2 critics)

The War-Room board is a 6x6 SQUARE lattice, not a hex grid: cells are laid out on a uniform 55 px pitch with no odd-row offset and adjacency is strictly 4-way cardinal (N/S/E/W), with the four board edges (xpos or ypos == 0 or 5) exiting to the neighbouring territory. The cells are drawn as hexagon art (class WarHex, [Embed] symbol622) which is what makes the name misleading.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:350-360 and :443-464 (arrow gating at WarHex.as:219-222)`
- **Build:** android v0.682
- **aimed at this line, which SURVIVES:** "War board is a hexagonal grid"
- **Lane impact:** L-meta-social: prevents an implementer building cube/axial hex coordinates for what is a 6x6 square board; the 14 typed cell roles and the arrow rendering survive unchanged.

### `[[meta-social/world-map-tiers-and-level-gating]]` — NOT-UPHELD [A1] (2 critics)

The world board's tile vocabulary and level-gating are visible in the second longplay: four settlement tiers plus a destroyed state and a quest marker, with grey/red tiles encoding level-too-low / level-too-high.

- **Cite:** `reference/frames/zFtCaTO0_1M/map/frames/frame_0025.jpg (whole frame, 512x288 upscaled x3 LANCZOS)`
- **aimed at this line, which SURVIVES:** "② War-Room map topology (board/adjacency)"
- **Lane impact:** L0 meta-social + L-world-exploration -- maps HEX_VILLAGE/HEX_TOWN/HEX_CITY/HEX_CASTLE onto rendered art, adds a per-territory LEVEL field and the destroyed state, and confirms the four clan colours on the world board from a picture.

### `[[warroom/web-warhex-has-fifteen-states]]` — NOT-UPHELD [A2] (1 critic)

The shipped web build v0.717 has FIFTEEN war-room hex states, not the fourteen the android build carries. The web WarHex class is §1t416s0§.as -- identified by its identical shape to the android WarHex.as (same imports flash.display.MovieClip / SimpleButton / playerio, same MovieClip members logo, narrow, sarrow, boundary, bg, button, earrow, flag, hqflag, hqflag2) -- and its state constants at :11-39 take the values 0,1,2,3,4,5,6,7,8,9,10,11,12,13,15. Value 10, which the android enum skips entirely, is a live state in v0.717; only 14 is unused. Anyone porting the war room from the android enum will be missing one board state.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t416s0§.as:11-39 + reference/decompiled/shs3_android_payload/scripts/WarHex.as:11-37`
- **Build:** web v0.717
- **aimed at this line, which SURVIVES:** "| war-room | board topology — BLOCKER |"
- **Lane impact:** L-war-room: bank FIFTEEN states for v0.717, with 14 as the only gap. The 6x6 board at 55 px pitch is separately web-confirmed at §1t7785s0§.as:261-262 (`x = 90 + _loc18_ * 55; y = 92 + _loc19_ * 55;`), so the topology blocker does close — just not with the android enum.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[NF-13-steal-was-a-node-action-not-a-skill]]` — UPHELD [A2] (1 critic)

Steal shipped in the overworld NODE-ACTION space, not the skill space. NodeUI declares ACTION_STEAL = 22 alongside ACTION_ATTACK and ACTION_BACK, and GenericActionButton maps it to an embedded StealActionIcon. That is why the Steal content has strings (6022, 6023, 7024-7028) and art but no <skill> row — and it is further evidence against attributing it to the missing skill id 1023.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeUI.as:57; GenericActionButton.as:191-193 and :309-311; StealActionIcon.as:5-6`
- **Build:** android v0.682
- **Lane impact:** L11 meta-social and L9 world — reclassifies the orphan Steal set from 'cut skill' to 'node action on the overworld map', which is where an asynchronous PvP theft mechanic would live. PARTIAL because ACTION_STEAL is referenced only by the icon switch in the whole android script set; I did not find a node in the data that issues it, so whether any shipped node offered the button is still open.

### `[[cite04/three-war-room-decks-disagree]]` — UPHELD [A2] (1 critic)

There are THREE different war-room rules decks in the evidence, and only aligning them licenses reading the 24-hour tick onto the web build. (a) android v0.682 string table: SIX pages, 5/6 = rank, 6/6 = building structures. (b) web v0.717 on film: SEVEN pages. (c) reference/extracted/ui_strings.txt: a six-page deck whose 5/6 is 'WINNING AND LOSING' and 6/6 is 'rank' - and the phrase 'winning and losing' appears NOWHERE in the 2,533-entry android table. Because web pages 1/7, 3/7 and 6/7 carry the android 1, 3 and 6 bodies in the same positions, the extra web page must sit at position 7, so android page 4 ('Troops will advance on enemy sectors every 24 hours') is web page 4/7. The extra page is most likely WINNING AND LOSING.

- **Cite:** `docs/gauntlet/L0/index/strings.json["369"],["371"],["373"],["375"],["377"],["379"]; reference/extracted/ui_strings.txt:189-194; reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg, frame_0012.jpg, frame_0013.jpg (each @2x LANCZOS, whole frame)`
- **Build:** android v0.682 table vs web v0.717 frames vs the web payload's baked text fields
- **Lane impact:** L-meta-social: the war-room rules deck is 7 pages in v0.717, page 7 is unfilmed and unnamed in the android table, and the deck alignment is what makes android string bodies safe to port for pages 1-6.

### `[[frames/HUNT-fourth-clan-and-domain-collision]]` — UPHELD [A1] (1 critic)

Two corrections to the clan set. First, the fourth (green-fist) crest resolves: Clan Midori Ken - the four clan names are closed at Aka Ryu, Midori Ken, Aoi Hoiru, Ki Sensu. Second, the game contradicts itself on domains: two different clan cards both claim the NORTH-EAST, so a rebuild that mirrors a clean four-point compass will diverge from the OG.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0007.jpg and frame_0001.jpg (both read whole @1.9x); names at strings.json["289"]-["292"]; bios at strings.json["326"], ["327"]`
- **Build:** web v0.717 frames; names from android v0.682
- **Lane impact:** meta-social: completes the crest-to-name binding for all four clans and logs an OG defect so a rebuild does not 'fix' it silently

### `[[frames/clan-identity-bound-on-screen]]` — UPHELD [A1] (2 critics)

The clan-join screen binds crest art to clan name to daimyo to domain on screen — the exact binding the banked meta-social survey said no payload row provides.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0007.jpg and frame_0008.jpg (both read whole @1.76x); frame_0001.jpg (@1.95x); frame_0004.jpg`
- **Build:** web v0.717
- **Lane impact:** meta-social: closes the banked survey's stated gap #3 and fixes the War Room unlock at level 10

### `[[frames/two-clans-share-the-north-east-domain]]` — UPHELD [A1] (1 critic)

The clan-join screen assigns the NORTH-EAST domain to TWO different clans. This is an original-data collision in the shipped game, not a reading error: the frame and the string table agree. 'Domain' is therefore descriptive flavour, not a partition key, and a rebuild must not use it to place clans on the map.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0001.jpg (crop 575,415-900,465 @4.62x) and reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0007.jpg (crop 575,395-900,445 @4.62x)`
- **Build:** web v0.717 frame, corroborated by android v0.682 string table
- **Lane impact:** meta-social: the four-clan geography has a collision; do not derive clan starting territories from the domain line

### `[[hunter-s26c/war-room-10px-territory-pitch-is-web-side-too]]` — UPHELD [A2] (1 critic)

Repairs the build label on meta-social/war-room-frame-carries-rank-moves-and-clan-numbers, which is filed as 'web v0.717' but cites the ANDROID WarSelectUI.as for its 10-px territory pitch — exactly the kind of cross-build slip correction C2 warns about. The web payload carries the same transform: §1t7934s0§.as:299 '_loc11_.x = (_loc8_ + §1t12536s0§) * 10 + 4.5;', the twin of android WarSelectUI.as:233 'warFlag.x = (terrx + TERRSHIFTX) * 10 + 4.5;'. So the pitch claim survives at the target build and the frame cite and the code cite are now the same build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7934s0§.as:299 · reference/decompiled/shs3_android/scripts/WarSelectUI.as:225-236`
- **Build:** web v0.717 (confirms android v0.682)
- **Lane impact:** L11/L12 meta-social: the War-Room board pitch is target-build evidence, contributing to RR:245's blocker (2) map topology rather than sitting on a mobile-only cite.

### `[[hunter05/premium-ladder-is-1-2-3-5-12]]` — UPHELD [A2] (1 critic)

The premium Gold ladder has FIVE tiers, not four: 1g=20 SKUs, 2g=2 SKUs (2101 'Medium Soldier Pill', 2126 '25 Duel Tokens'), 3g=94, 5g=4, 12g=23 — total 143 unique. The 12-Gold outfit tier is 23 unique SKUs (24 raw rows), not 30.

- **Cite:** `reference/extracted/android/121_Mobile_PremiumData.bin joined to reference/extracted/itemdata.xml <heavenlyprice>`
- **Build:** android blob joined to the shared itemdata table
- **Lane impact:** L0/L6 — corrects meta-social/premium-catalogue-is-143-skus, whose headline is right but whose ladder omits a whole price tier and overstates the outfit tier by 7.

### `[[meta-social/android-string-table-is-not-v0717s-copy]]` — UPHELD [A1] (1 critic)

The Android string table is a sibling of v0.717's, not a copy: the same longplay frame the surveyor used as a parity proof renders 'WAR ROOM RULES 1/7' while the Android table's string 369 reads '1/6' — the frame wins, and at least strings 369 and 371 differ between builds.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0084.jpg (512x288 source, whole frame upscaled x3 LANCZOS) vs docs/gauntlet/L0/index/strings.json ids 369, 371`
- **Lane impact:** L0 meta-social + every lane porting strings — the 'typo is a fingerprint' calibration does not license blanket Android string reuse; ids resolve, wording must still be frame-checked.

### `[[meta-social/chikako-affinity-meter]]` — UPHELD [A2] (6 critics)

An entire meta-social loop the ledger never mentions: the Chikako affinity meter, a 5-level ladder fed 1 point per premium Gold spent plus achievement score, which pays out as random Gold refunds — the one place achievements have a mechanical payout.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI_chikako.as:24-26,40 + StatsManager.as:2719-2724 + NetworkManager.as:2306-2315`
- **Lane impact:** L0 meta-social — the 31/100 was scored over a smaller system than exists; this changes how achievements must be scoped (mechanical, not cosmetic).

### `[[meta-social/clan-crops-resource]]` — UPHELD [A1] (1 critic)

An entire clan-economy resource -- 'clan crops', a per-clan stockpile with HQ-derived income and per-clan deltas -- appears in the war-room UI and in the web payload, and is in no claim and no ledger row.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0015.jpg (x3 LANCZOS) + reference/extracted/ui_strings.txt:248 and :211`
- **Lane impact:** L0 meta-social -- another system the 31/100 was never scored over; income scales with the number of Command HQs a clan holds, which couples it directly to the war-room build economy.

### `[[meta-social/clan-pays-5-coins-per-move]]` — UPHELD [A2] (1 critic)

The war room pays the player 5 coins for every move made -- a war-room income rule absent from both the ledger and the survey.

- **Cite:** `docs/gauntlet/L0/index/strings.json id 372 (from reference/extracted/android/118_Mobile_Lang_EN.bin), final line`
- **Lane impact:** L0 meta-social + L-economy -- closes the loop between the move economy and the coin economy; at 6 moves/turn a War Hero earns 30 coins/turn from war participation alone.

### `[[meta-social/clan-pays-5-coins-per-move-and-war-hero-grants-clan-deed]]` — UPHELD [A2] (1 critic)

Two war-economy faucets the lane's §4 block omits entirely: the clan pays 5 coins per war move made, and reaching war rank 10 auto-grants item 2212 (Clan Deed) rather than requiring its 5-Gold purchase.

- **Cite:** `docs/gauntlet/L0/index/strings.json 372 + reference/decompiled/shs3_android/scripts/WarUI.as:241 + reference/decompiled/shs3_payload/scripts/§1t6483s0§.as:526-531`
- **Lane impact:** L0 meta-social + economy — the war room is a coin faucet, not only a coin sink, and the clan-founding SKU is reachable without spending Gold.

### `[[meta-social/clan-pays-five-coins-per-move]]` — UPHELD [A2] (1 critic)

The war rulebook states a per-move coin income neither the ledger nor the lane records: the clan pays the player 5 coins for every war move made.

- **Cite:** `docs/gauntlet/L0/index/strings.json id 372 (from reference/extracted/android/118_Mobile_Lang_EN.bin), rendered by WarRules.as:100-101 as war-rules page 2`
- **Lane impact:** L0 meta-social / L-economy — closes the war-move income side of the loop; the lane costs moves at 500 coins each but never credits the 5-coin payout.

### `[[meta-social/desktop-v0717-decompile-was-on-disk-unopened]]` — UPHELD [A2] (1 critic)

The repo holds a DESKTOP v0.717 decompile at reference/decompiled/shs3_payload/ that is LARGER than the Android one (1,079 classes indexed / 652 script files vs 970 / 559) and is listed in the lane's own evidence index, yet the entire lane was sourced from the Android 0.682 build and papered over with version caveats.

- **Cite:** `docs/gauntlet/L0/index/actionscript.json (bundles: shs3_payload 1079, shs3_android 970) + reference/decompiled/shs3_payload/scripts/ (652 .as files)`
- **Lane impact:** L0 meta-social, and every other L-lane that sourced from shs3_android — most Android caveats are dischargeable in minutes, but one quoted line (the barricade owner guard) is wrong for v0.717 and one claim (offline gold faucet) is unconfirmable in the target build. Re-run the lane against shs3_payload before raising the score.

### `[[meta-social/enemy-remap-second-witness]]` — UPHELD [A2] (1 critic)

The 4-clan to NPC-id-block mapping has a second, unrelated witness in the client, making it a build-wide convention rather than a war-room quirk.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:362-381 vs WarHexUI.as:1736-1751`
- **Lane impact:** L0 meta-social + L-enemies-ai -- the clan->NPC block mapping can be treated as a global rule, and the 700-block exclusion explains why the 11 named samurai are shared across all four sides.

### `[[meta-social/four-clans-named-led-located]]` — UPHELD [A2] (6 critics)

The four canonical clans are fully bound to names, daimyo, compass domains and side numbers — closing the first survey pass's STILL_UNHELD #3 and grounding the ledger's "4 clans (heraldry/masks/daimyo/capitals)" Ready bullet in A2 evidence.

- **Cite:** `docs/gauntlet/L0/index/strings.json ids 271-278 and 324-327 + reference/decompiled/shs3_android/scripts/WarHexUI.as:1077-1089`
- **Lane impact:** L0 meta-social — side n ↔ clan n is now fixed, which is required before any clan-coloured render or war-sim can be built.

### `[[meta-social/frame-prints-coordinate-system]]` — UPHELD [A1] (6 critics)

A longplay frame prints the live war-map coordinate system — TERRITORY (24,52) SECTOR (3,0) — independently confirming the 63x72 territory grid and the 0..5 sector board decoded from code.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0090.jpg, crop (255,140)-(400,165) upscaled x12 LANCZOS`
- **Lane impact:** L0 meta-social — A1 corroboration for the A2 topology claim, plus surfaces "town prosperity", a town-conversion currency absent from the §4 block.

### `[[meta-social/kisensu-domain-typo-in-shipped-data]]` — UPHELD [A2] (6 critics)

The shipped game data contains a quadrant bug: Ki Sensu is described as ruling the North-East, the same quadrant already assigned to Aka Ryu, leaving North-West vacant — a 1:1 recreation must decide to reproduce or knowingly fix it.

- **Cite:** `docs/gauntlet/L0/index/strings.json ids 324 and 327 (from reference/extracted/android/118_Mobile_Lang_EN.bin)`
- **Lane impact:** L0 meta-social — a fidelity decision the ledger's "capitals" bullet hides; needs an owner ruling before the world map is authored.

### `[[meta-social/ninja-services-priced-catalogue]]` — UPHELD [A2] (6 critics)

"Ninja-Services prices" upgrades from a bullet to a 12-row priced catalogue read out of the WEB v0.717 itemdata.xml, including the clan-economy SKUs and two currency conversion rates.

- **Cite:** `reference/extracted/itemdata.xml lines 27, 41, 55, 374, 388, 402, 416, 430, 2267, 2327, 2379, 2393, 2402, 2445, 2461, 2479; catalogue list at reference/extracted/android/121_Mobile_PremiumData.bin`
- **Lane impact:** L0 meta-social — the premium economy is now implementable without a Ruffle session; prices come from the WEB build so no version caveat applies.

### `[[meta-social/rank-ladder-a1-confirmed]]` — UPHELD [A1] (1 critic)

The rank ladder, its first threshold and the one-hour turn are all rendered by the live v0.717 client, upgrading the survey's A2-only rank claim to A1.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0015.jpg (whole frame x3 LANCZOS) and frame_0019.jpg`
- **Lane impact:** L0 meta-social -- the 11-rank ladder moves from decompile-only to frame-confirmed, and flags a trap in ui_strings.txt that a text-only pass would have copied.

### `[[meta-social/rank-ladder-thresholds-and-moves]]` — UPHELD [A2] (6 critics)

The 11-rank ladder is exact: thresholds 36/84/180/324/516/816/1176/1596/2076/5000, moves per turn 3,4,4,4,4,5,5,5,5,5,6, a turn is exactly one hour, and coin donations buy rank at 1 point per 1,000 coins.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:162, 824-1013 (getWarRank / getWarMovesToNextRank / getMaxWarMoves) + strings 330-339, 403`
- **Lane impact:** L0 meta-social — confirms the ledger's Surface note ("moves per turn reconciles as per hour; 36 = Private's threshold") with A2 evidence rather than inference.

### `[[meta-social/rival-clan-ai]]` — UPHELD [STILL_UNHELD] (6 critics)

The "Rival-clan AI: Greedy strategy — reinforce weakest border, attack adjacent weaker enemy, build when Captain+ and flush" in the project's own master reference has no payload backing — the server ran the clan AI, and no war AI exists in the client.

- **Lane impact:** L0 meta-social — must be labelled recreation-authored design, never cited as original fidelity.

### `[[meta-social/second-longplay-never-swept]]` — UPHELD [A1] (1 critic)

The war-room board search covered only one of the two longplays the project invariant names as primary reference; the second video's map frames exist and were never opened by this lane.

- **Cite:** `reference/frames/map_analysis/zFtCaTO0_1M_map_006_t272s.jpg … _015_t649s.jpg (10 frames, 512x288) — contact sheet built and read at 256x144 per cell`
- **Lane impact:** L0 meta-social — the STILL_UNHELD on the 6x6 board stands over both videos now, but the 240-frame broad_survey/ set is still unswept and is the real close-path for a board frame.

### `[[meta-social/side-to-clan-bound-in-code]]` — UPHELD [A2] (1 critic)

The side-number to clan-name binding is explicit in code, not an inference from colour semantics -- and the two war UIs use different hues for the same sides.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarSelectUI.as:381-395 + TerritoryData.as:694-709 + WarHexUI.as:1075-1090`
- **Lane impact:** L0 meta-social + L-art -- the mapping is now A2-direct, but a clan-coloured render must choose which palette to reproduce: the bright territory-map hues or the darker hex-UI hues.

### `[[meta-social/side-to-clan-direct-binding]]` — UPHELD [A2] (1 critic)

There is a direct payload switch binding war side numbers to clan names, so the clan-to-side mapping does not need to be inferred from the Japanese colour words at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarSelectUI.as:379-396`
- **Lane impact:** L0 meta-social — upgrades the clan-to-side binding from inference to artifact, and `clanemblem.gotoAndStop(side)` says the four heraldry emblems are frames 1-4 of one MovieClip, which is what the ledger's 'heraldry' Ready bullet actually needs.

### `[[meta-social/side-to-clan-is-direct-not-inferred]]` — UPHELD [A2] (1 critic)

The side-number to clan binding is a literal switch in two independent files, not an inference from Japanese colour words — and the same files reproduce the side to npc-id-block map from a second site.

- **Cite:** `reference/decompiled/shs3_android/scripts/PlayerPanel.as:424-438 and InteractUI.as:362-380`
- **Lane impact:** L0 meta-social + L-enemies-ai — upgrades the clan claim from a colour-word inference to direct code proof, and double-sources the 4-clan → NPC-id-block mapping.

### `[[meta-social/survivalmode-is-the-warroom-wave-table]]` — UPHELD [A2] (6 critics)

Stage-0 finding S0-1's "entire game mode absent from all 12 ledger systems" is sharper than that: survivalmodedata IS the war-room battle wave table, and enemy ids are remapped per clan side into distinct NPC id blocks.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:13, 1711-1752`
- **Lane impact:** L0 meta-social — reassigns bindata/119 from an orphan 'survival mode' to meta-social's core battle content, and hands enemies-ai the 4-clan → NPC-id block mapping.

### `[[meta-social/survivalmode-web-android-diverge]]` — UPHELD [A3] (1 critic)

Web and Android survivalmodedata are NOT identical: 14 of 87 enemy rows differ in composition, even though wave count and total quantity match exactly.

- **Cite:** `byte-check + row diff: reference/extracted/bindata/119_1t4646s0.bin vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin`
- **Lane impact:** L0 meta-social + L-enemies-ai — the 351 total is build-independent, the enemy MIX is not; any wave table built for 1:1 must be sourced from the web blob, not the Android one.

### `[[meta-social/survivalmode-web-vs-android-differ]]` — UPHELD [A3] (1 critic)

The war-room wave table is NOT identical between builds: 14 lines differ after CRLF normalisation, and the web v0.717 late waves draw from a wider enemy pool than Android's.

- **Cite:** `byte-check: reference/extracted/bindata/119_1t4646s0.bin vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin`
- **Lane impact:** L0 meta-social and L-enemies-ai — the kill cap of 351 is safe, but the enemy MIX of the late war-room waves must be read from the web file; NPC 443 is web-only.

### `[[meta-social/war-boss-npcs-unresolvable]]` — UPHELD [STILL_UNHELD] (1 critic)

The 11 singleton war-room boss spawns (npc ids 700-710) resolve to nothing — no name, no stats, no art binding anywhere on disk — so the war-room battle content is not fully held.

- **Lane impact:** L0 meta-social and L-enemies-ai — 11 of the war-room battle's 39 waves are gated on unknown boss entities; calling them 'named samurai' is the §2.1 numeric-ID failure.

### `[[meta-social/war-rules-page-7-content]]` — UPHELD [STILL_UNHELD] (6 critics)

The content of war-rules page 7 (desktop-only, string ids 11016/11017) is not held — those ids sit above the Android string table's 9010 ceiling.

- **Lane impact:** L0 meta-social — one of three remaining deductions in the 78 score.

### `[[meta-social/warrules-page3-frame]]` — UPHELD [A1] (1 critic)

Page 3 of the 7-page war-room rulebook is on screen and renders Android string 374 word-for-word -- a second, independent string-table calibration point.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0013.jpg (whole frame, 512x288 upscaled x3 LANCZOS)`
- **Lane impact:** L0 meta-social -- shows the only web/Android delta on rules pages 1-6 is the '/7' vs '/6' suffix inside the title strings, so android 369-380 can be ported for pages 1-6 with a suffix edit.

### `[[meta-social/web-barricade-bonus-has-owner-clause]]` — UPHELD [A2] (1 critic)

The WEB v0.717 defender bonus is narrower than the Android one the survey quoted: the +2 terrain step for a completed Barricade applies only when the hex is NOT owned by the attacking side.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7785s0§.as:2123-2125`
- **Lane impact:** L0 meta-social — the terrain/deploy model the ledger wants is now web-exact; deploying onto your own completed barricade takes no defensive penalty in v0.717.

### `[[meta-social/web-barricade-bonus-owner-gated]]` — UPHELD [A2] (1 critic)

In v0.717 the +2 defensive terrain penalty for a completed Barricade applies only when the barricade belongs to an ENEMY; the Android build applies it regardless of owner.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7785s0§.as:2123 vs reference/decompiled/shs3_android/scripts/WarHexUI.as:2285`
- **Lane impact:** L0 meta-social -- your own completed barricade does not penalise your deploys in v0.717; implementing the Android condition would make friendly Barricades self-harming.

### `[[meta-social/web-barricade-guard-stricter]]` — UPHELD [A2] (1 critic)

The web v0.717 terrain-modifier guard is stricter than the Android line the survey quoted: a completed Barricade gives no +2 defence step against its own owner.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7785s0§.as:2123 vs reference/decompiled/shs3_android/scripts/WarHexUI.as:2287`
- **Lane impact:** L0 meta-social — a recreation copying the Android condition would over-buff deploys onto friendly barricades. Everything else in the switch (1.5/1.2/1/0.75/0.6/0.5/0.25) is identical across builds.

### `[[meta-social/web-chikako-ladder-differs]]` — UPHELD [A2] (1 critic)

The Chikako affinity meter exists in the WEB v0.717 build with a much steeper ladder — [0,50,150,300,500,750] over 5 levels — and weights achievement score x5 rather than x1.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5865s0§.as:24, 26, 42`
- **Lane impact:** L0 meta-social — the achievements-have-a-mechanical-payout finding survives and strengthens (x5 weighting makes achievement score the dominant input), but the ladder numbers in the survey are the Android build's.

### `[[meta-social/web-lang-is-network-loaded]]` — UPHELD [A2] (1 critic)

No v0.717 string table exists on disk because the web LangManager streams language data from the dead server at runtime -- the structural reason page 7 is unrecoverable and why every Android-sourced string in this lane must stay labelled.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1521s0§.as:1-10 (imports) and :122`
- **Lane impact:** L0 all lanes -- makes the Android-vs-web string caveat permanent rather than provisional, and explains why the 27 web bindata blobs contain no lang table.

### `[[meta-social/web-new-player-starts-with-3-gold]]` — UPHELD [A2] (1 critic)

A new character in the WEB v0.717 build starts with 3 Heavenly Gold; the Android build starts at 0.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:1023-1028 vs reference/decompiled/shs3_android/scripts/StatsManager.as:705-710`
- **Lane impact:** L0 meta-social / economy — the starting purse for a 1:1 v0.717 recreation is 100 coins + 3 Gold + 30/30 AP + 20/20 Duel Tokens.

### `[[meta-social/web-payload-decompile-is-the-authority]]` — UPHELD [A2] (1 critic)

The whole lane was surveyed off the Android v0.682 decompile while a full v0.717 decompile of the target build sits in the same repo — 652 files under reference/decompiled/shs3_payload/ — and five of the lane's numbers change when you read it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 vs reference/decompiled/shs3_android/scripts/StatsManager.as:30`
- **Lane impact:** ALL LANES (L0-L11) — any gauntlet claim sourced from shs3_android/ must be re-read in shs3_payload/ before it enters src/config/. Stage-0b's S0-3 caveat was correct and was not applied.

### `[[meta-social/web-payload-decompile-is-the-reference]]` — UPHELD [A2] (1 critic)

The WEB v0.717 build is fully decompiled at reference/decompiled/shs3_payload/scripts/ (1,079 .as files, name-obfuscated but with every numeric literal intact) — a larger bundle than the Android decompile (970 files) and the build the two longplays actually show, so every Android-sourced number must be cross-checked there before it can be called v0.717 fidelity.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ — 1,079 .as files; aliases §1t1523s0§.as = StatsManager, §1t7785s0§.as = WarHexUI, §1t7790s0§.as = WarHexUIBuildMenu, §1t401s0§.as = InteractUI, §1t7924s0§.as = WarRules, §1t5865s0§.as = InteractUI_chikako, §1t1521s0§.as = LangManager`
- **Lane impact:** L0 meta-social and every other lane that sourced from shs3_android/ — the gauntlet's standing Android caveat is load-bearing, not bookkeeping: five numbers in this lane alone change between the two builds.

### `[[meta-social/web-string-table-is-an-external-dead-file]]` — UPHELD [A2] (1 critic)

The web build's string table is not merely 'above the Android ceiling' — it is an external runtime download, ./data/shs3_en.xml (or server + 'strings/'), which exists nowhere on disk; that is the structural reason war-rules page 7 and the achievement definitions cannot be recovered from the web payload.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1521s0§.as:80-95 (plus a repo-wide find for shs3_*.xml returning nothing)`
- **Lane impact:** L0 all lanes — names the exact missing artifacts (shs3_en.xml / shs3_fr.xml / shs3_es.xml) so a future web-archive hunt has filenames to search for, and explains why 118_Mobile_Lang_EN.bin is the only string table we will ever hold.

### `[[meta-social/web-troop-cap-50000]]` — UPHELD [A2] (1 critic)

v0.717 hard-caps a single side's troop strength in one hex at 50,000; the Android build has no such cap.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7785s0§.as:2179-2186 (grep -n 50000 reference/decompiled/shs3_android/scripts/WarHexUI.as returns nothing)`
- **Lane impact:** L0 meta-social -- a war-sim ceiling in no claim and no ledger row; any offline AI war sim needs it or troop counts diverge from the original at scale.

### `[[meta-social/web-warrules-7-pages]]` — UPHELD [A2] (1 critic)

The seven-page war-rules book is stated outright by the WEB payload, so the frame-vs-Android page-count conflict is settled by code as well as by the frame.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:23 and :121-123`
- **Lane impact:** L0 meta-social -- upgrades the page-7 gap from a frame-only observation to a cited, bounded gap: the ids are known, only the text is missing.

### `[[meta-social/web-warrules-max-7]]` — UPHELD [A2] (1 critic)

The WEB v0.717 WarRules class exists and declares max = 7 with case 7 reading string ids 11016/11017 -- the desktop code agrees with the frame, so no standing-invariant adjudication was ever needed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:23,121-123 (located via grep -rln "warruleswords" reference/)`
- **Lane impact:** L0 meta-social -- supplies the missing cite for the survey's 11016/11017 assertion and corrects its methodology note; the page-7 body stays unrecoverable because the web LangManager loads strings over the network (§1t1521s0§.as:63-77, './data/' or server+'strings/').

### `[[meta-social/web-wave-roster-differs-from-android]]` — UPHELD [A3] (1 critic)

The web and Android war-room wave tables are NOT the same file: quantities match (both total 351) but 14 of 87 enemy rows carry different id pools, the web late waves adding enemy id 443.

- **Cite:** `byte-diff: reference/extracted/bindata/119_1t4646s0.bin (11,721 B, sha256 709d94cb28c0…) vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin (11,553 B, sha256 b56f8c6a0283…), parsed row-by-row in Python`
- **Lane impact:** L0 meta-social + enemies-ai — the 39-wave composition must be built from bindata/119_1t4646s0.bin; the desktop binds it by name (§1t7785s0§.as:13 `§1t12534s0§:Class = §1t4646s0§`, consumed :1860).

### `[[uistrings-payload/chat-surface-is-31-commands-including-three-debug]]` — UPHELD [A2] (1 critic)

The web v0.717 chat surface is 31 distinct non-emote commands, not 21 — and three of them are developer/debug commands (/picture, /enableconsole, /transitionoff) that sit outside the help-list ranges any prior sweep quoted.

- **Cite:** `reference/extracted/payload.xml:121506`
- **Build:** web v0.717 only ('emote' and every command token = 0 of 2,533 Android entries)
- **Lane impact:** meta-social + a new debug-surface note. CORRECTS this unit's emote-and-chat-command-surface count. Full set parsed from payload.xml 121100-121600: /ally /allyroom /ban /createprivate /disablepvp /emotes /enableconsole /help /help:ally /help:channel /help:emotes /hidehud /ignore /invite /join /kick /leave /leavetown /list /picture /ping /recall /showally /showignore /stopally /stopallyall /stopignore /tournament /transitionoff /unban /whoisonline, plus the 11 emotes at :121490. Twenty carry an inline #CCCCCC help description; the bracketed-arg forms (/join [ , /ignore [ , /kick [ , /ban [ , /unban [ , /createprivate [ , /invite [ , /stopignore [ , /ally [) split theirs across items, which is the likely source of the '21'. /transitionoff implies a skippable scene transition and /enableconsole implies a shipped debug console — neither has a slot in any of the twelve ledger systems.

### `[[uistrings-payload/war-sector-panel-format]]` — UPHELD [A2] (1 critic)

The war sector inspector shows friendly strength as a number but renders enemy strength as '???', and the war RPC set carries a matching pair /war/warsentry.php and /war/getwarenemysentry.php — i.e. enemy troop counts are fog-gated behind the spy action the shipped rules name; defender nameplates use 'name (level)'.

- **Cite:** `reference/extracted/payload.xml:484834`
- **Build:** web v0.717
- **Lane impact:** meta-social blocker ② — this is the sector inspector's FIELD SET, not the board topology. PARTIAL: authored field (see uistrings-payload/uistrings-is-design-time-not-shipped). The '???' is a format literal rather than a mock number, but the only '"???"' string literal I could find in either script tree (§1t3318s0§.as:3169, QueryManagerPIO.as:2816) is the CLAN-ACRONYM fallback, not the troop counter — so the fog-of-war reading is inference from the endpoint pair (:119319, :119321), not proof. Refusing to grade it HELD.

### `[[uistrings-payload/warroom-build-menu-is-ladder-in-web-copy]]` — UPHELD [A2] (1 critic)

The 5,000-coin barrier-bypass structure is HEX_LADDER in both builds' code and the web build's authored menu calls it 'Ladder — Bypasses barriers surrounding the sector'; 'Tunnels' is only the Android EN table's wording for the same structure (strings.json["568"]/["569"]).

- **Cite:** `reference/extracted/payload.xml:485373`
- **Build:** web v0.717 authored vs android v0.682 table
- **Lane impact:** meta-social — qualifies the banked meta-social/structure-costs-and-donation-rate, whose 'Tunnels 5000' is the Android display name, not a universal one. Ports should key on the internal name HEX_LADDER (reference/decompiled/shs3_android/scripts/WarHexUIBuildMenu.as:195) and pick a display string deliberately. Full web build menu: Build Menu cid638 :485368, Barricades 10000 cid734 :527783, forward base 10000 cid736 :527793, Ladder 5000 cid639 :485373 — the COSTS survived the revision, only the copy moved.

### `[[uistrings-payload/warroom-earlier-design-preserved-in-payload]]` — UPHELD [A2] (1 critic)

The web payload's stale authored TextFields preserve an EARLIER War Room design the shipped build replaced — a flat '3 moves' per turn, a 'WINNING AND LOSING' page, and an 80%-of-battlefield / Castle-HQ-captured win condition recorded nowhere else in this corpus — superseded at runtime by rank-based moves (strings.json["372"]) and a control-points win condition (strings.json["376"]).

- **Cite:** `reference/extracted/payload.xml:528076`
- **Build:** authored text is pre-v0.717 web; strings.json 369-380 is the shipped copy
- **Lane impact:** meta-social — recovered design history, and a TRAP: anyone reading ui_strings.txt:19 ('- Each turn, every player gets 3 moves.') would code a flat 3 moves/turn and be wrong. Independent staleness proof that does not rely on version numbers: the authored web text carries the typo 'kidk them off the battlefield' (payload.xml:528060) which the shipped table fixes to 'kick' (strings.json["374"]). Do NOT code 80%/Castle HQ; do NOT code flat 3 moves.

### `[[uistrings-payload/warroom-web-has-a-seventh-rules-page]]` — UPHELD [A2] (2 critics)

The web v0.717 War Room rules screen has SEVEN pages, not six — page 7 fetches getString(11016)/getString(11017), both inside the unresolvable web-only 11000 block — so one whole rules page is UNHELD and the Android table's page-numbered titles ('War room rules 1/6'…'6/6') cannot be the v0.717 shipped titles.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:23`
- **Build:** web v0.717 (max=7) vs android v0.682 (WarRules.as:23 `internal var max:int = 6;`)
- **Lane impact:** meta-social — CONTRADICTS this unit's warroom-rules-web-uses-android-id-set. The twelve body/title slots 369-380 do map identically (§1t7924s0§.as:96-119 vs WarRules.as:94-117, verified line-by-line), but page 7 at §1t7924s0§.as:121-123 has no Android counterpart and no recoverable text. A port must either build six pages and record page 7 as lost, or re-author it — and must re-number all six titles, because strings.json["369"]…["379"] literally read 'N/6'.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
