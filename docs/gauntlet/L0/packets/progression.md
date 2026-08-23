# LEDGER PACKET — `progression`

> **This is the ONLY evidence you may cite.** Every id below was JUDGED by blind
> artifact-citing critics and SURVIVED (GAUNTLET.md §0). Cite one inline as
> `[[id]]`, exactly as written. Gate **L0-B** resolves every reference against the
> pooled verdicts and goes RED on anything unjudged, refuted, or invented — so a
> claim id you do not see here cannot enter the ledger, and neither can a
> plausible-looking one you compose yourself.

**31 surviving overturns · 1 true-but-rejected · 53 corroborating.**

---

## The ledger text you are rewriting, verbatim

```markdown
| **progression** | 55 | level-up spine, L1–L10 XP, stat-point effects, unlock cadence | DEF/SPD transfer functions; L11–80 curve (likely unrecoverable); post-rebirth SP economy |
### progression — 55
- **Ready:** +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30).
- **Blockers:** ① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — *measure per-point deltas in a build.* ② **L11–80 XP curve — likely unrecoverable** (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED. ③ post-rebirth SP economy; ④ full XP-income model (quest/gather/dungeon, not just kills).
- **Surface:** the per-point stat table + `atkPlusWeapon` term are solved but scattered; promote to a `STAT_GROWTH` config const. The "271 cap" is gear/rebirth-inclusive (237-point first-run budget makes it impossible in one stat) — resolvable by arithmetic now.
```

---

## ① Surviving overturns — these REWRITE the lines they name

A critic opened the sentence, read it in context, and ruled that it falls.

### `[[NEW-3-full-xp-curve-is-shipped-in-both-builds]]` — UPHELD [A2] (2 critics)

THE FULL LEVEL CURVE IS RECOVERED. A 99-entry expArray, [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,…,29395800], is a shipped constant in BOTH builds. Index 10 = 31 400, matching the known L1–L10 caps exactly; index 80 = 4 285 800; the table runs to index 98. REBUILD_READINESS.md's progression blocker ② and its §6 'structurally unrecoverable' list both name the L11–80 XP curve as likely unrecoverable and tell the project to keep an INFERRED extrapolation. That is now false — the curve is A2, in two independent bundles.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364`
- **Build:** both
- **KILLS this line:** "② L11–80 XP curve — likely unrecoverable (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."
- **Lane impact:** L-progression: blocker ② closes outright and the §6 'unrecoverable' list loses an entry. This is the largest un-banked win I found while judging — no claim in this packet mentions it. Delete the INFERRED extrapolation and paste the table.

### `[[NF-3-def-mitigation-is-flat-subtraction-both-builds]]` — UPHELD [A2] (3 critics)

DEF mitigation is FLAT SUBTRACTION in both builds and no curve exists. Damage is reduced by `damage -= getDefense()`, and getDefense returns `defense * 0.8` only when the DEFENDER is in Heavy stance, otherwise `defense`. This closes the DEF half of REBUILD_READINESS.md:200 progression blocker ① ('DEF mitigation curve … measure per-point deltas in a build') — there is no build to measure and no curve to find. It corroborates docs/research/fidelity/SOURCE_CONSTANTS.md:149 ('defence SUBTRACTS, it never divides'), a ruling the ledger never absorbed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3484, :3800, :4391 and :3284-3290 (android twins: reference/decompiled/shs3_android/scripts/MCSPlayer.as:3415, :3709, :3231-3238)`
- **Build:** both
- **KILLS this line:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — measure per-point deltas in a build."
- **Lane impact:** L-progression + L1 combat-core: blocker ① at :200 closes in FULL when combined with the SPD formulas (NF-4 and stance-modifier-table-in-payload). Nothing about DEF needs measuring.

### `[[actionscript/defense-is-flat-subtraction]]` — UPHELD [A2] (2 critics)

DEF mitigation is flat integer subtraction, not a curve, floored by a four-band attacker-level ladder that PIERCINGDMG adds to; elemental damage is four independent subtractive channels (attackerElemATK − defenderElemDEF, floor 1) added after physical mitigation.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3736-3808 (web v0.717) · floor at reference/decompiled/shs3_android/scripts/Damage.as:150-172 · plain-named elemental twin NPC.as:393-428`
- **KILLS this line:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — measure per-point deltas in a build."
- **Lane impact:** L-progression blocker ① reshaped (no curve exists); L-rebirth-elements blocker ② closed (elemental ATK-vs-DEF is subtractive and additive-to-physical); corrects L-items-equipment's 'defense min-floor (EnemyLevel/4)' — it is the ATTACKER's level and a four-band ladder.

### `[[actionscript/xp-income-model]]` — UPHELD [A2] (2 critics)

The full XP-per-kill model is held: base XP = mobLevel*2+20, zero below a grey-level step function, zero for mobs more than 3 levels above the player, +5% per level of under-levelling, a linear decay over a zeroDifference ladder when over-levelled, and ×2 for elites.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:185-208 and :237 (web v0.717) · ladders at reference/decompiled/shs3_android/scripts/NPC.as:94-110 and :112-161`
- **KILLS this line:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** L-progression: blocker ④'s kill half closed exactly; explains why the ledger's 20+ video samples found no XP constant (payout depends on the player's level too).

### `[[android-blobs-hunter/survival-achievement-premium-namegen-blobs-unread]]` — UPHELD [A2] (1 critic)

Four more shipped data blobs are named by no claim in the packet. 109_WarHexUI_SurvivalModeData: 555 lines, 39 <wave>, 87 <enemy>, enemy ids as alternation lists (400|401|402|403|404) - a spawn primitive nothing else in the corpus uses - and spawn x of -50 (49x), 1650 (37x), -1650 (1x), i.e. just off both edges of a 1600-wide stage, independently corroborating XMLBG contentWidth=1600. 114_Mobile_AchievementData: 553 lines, 61 <achievement> with id/img/name/desc/stat/val, all string-resolvable and stat-threshold driven; icon art is complete (img takes only 1-4 and achievement0-4 all ship). 121_Mobile_PremiumData: 257 lines, <default> :3, <special> :22, <rotation> :35 with 23 <set> and 176 <item> refs - the live-ops offer schedule. 85-89_NameGenerator_*: 1,430 authored proper nouns (male 397, female 290, place 676, samurai family 35, noble family 32).

- **Cite:** `reference/extracted/android/109_WarHexUI_SurvivalModeData.bin:3-14 + 114_Mobile_AchievementData.bin:4-11 + 121_Mobile_PremiumData.bin:3,22,35,37 + 85_NameGenerator_MaleNames.bin (397 lines), 88_NameGenerator_FemaleNames.bin (290), 89_NameGenerator_PlaceNames.bin (676), 87_NameGenerator_SamuraiFamilyNames.bin (35), 86_NameGenerator_NobleFamilyNames.bin (32); names resolved via docs/gauntlet/L0/index/strings.json["8000"]="Duelist I", ["8080"]="Win an online duel."`
- **Build:** android v0.682
- **KILLS this line:** "S0-1: 119 <survivalmodedata> (a whole game mode absent from all 12 ledger systems)"
- **Lane impact:** Cross-cutting: L1 world-exploration, L-progression, L-meta-social, L-economy. S0-1 flagged survival mode as absent from all 12 systems; this is its authored wave content, and <survivalmodedata> is one of only two roots present in BOTH payloads, so it is not an Android-only mode. The 61-achievement system and the premium rotation are likewise entirely outside the ledger.

### `[[combat-core/stance-modifier-table-in-payload]]` — UPHELD [A2] (2 critics)

The full per-stance modifier table — damage, crit, defense AND slash distance, each with its mastery term — is sitting in the payload and no claim in this lane cited it; it is the multiplier half of combat-core blocker ①.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:1940-1970, consumed at :2232`
- **KILLS this line:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — measure per-point deltas in a build."
- **Lane impact:** L1 combat-core: supplies stance damage / crit / defense / reach multipliers in one table, independently corroborates progression/def-mitigation-is-flat (Heavy defModifier 0.8), and confirms COMBAT_MEASUREMENTS c-0's reading that the wiki tables are mastery ceilings. ⚠ Cited android-only here — must be re-verified in the web payload before porting, per this lane's own rule.

### `[[hunter04/full-xp-table-l1-to-l80-is-in-both-builds]]` — UPHELD [A2] (2 critics)

The complete XP curve is a hard-coded 99-entry array in BOTH builds, so the ledger's 'L11-80 XP curve - likely unrecoverable' call is dead. reference/decompiled/shs3_android/scripts/StatsManager.as:78 declares 'public static var expArray:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,...]' and reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 declares the identical 99-entry array. Indices 1-10 are 550, 1450, 2950, 5150, 8350, 12150, 16350, 20900, 25900, 31400 - EXACTLY the ledger's own 'XP caps L1-L10 (550...31 400)' at :77, which authenticates the array against a value the ledger already trusts. Index 79 = 4,025,800; the array runs to index 98 (29,395,800), well past the level cap of 80. Nothing needs extrapolating and nothing needs to stay labelled INFERRED.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:78 · reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364`
- **Build:** both
- **KILLS this line:** "(2) L11–80 XP curve — likely unrecoverable (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."
- **Lane impact:** L-progression: blocker (2) closes outright and §6's 'structurally unrecoverable' list loses an entry. The XP curve becomes CONTRACT for the whole 1-80 range in the target build.

### `[[progression/271-cap-explained]]` — UPHELD [A2] (9 critics)

The "271 cap" is exactly the level-80 evaluation of the ATK/DEF/SPD cap formula 1+(80+10)*3 = 271 — a hard per-stat UI ceiling, not a gear/rebirth-inclusive total, and it IS reachable in one stat on a first run.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3344 (cap formula) + §1t1523s0§.as:362 (levelCap 80) + §1t1523s0§.as:2577 (237-point budget)`
- **KILLS this line:** "The "271 cap" is gear/rebirth-inclusive (237-point first-run budget makes it impossible in one stat) — resolvable by arithmetic now."
- **Lane impact:** L4: the Surface bullet's arithmetic is refuted; it assumed +1 per point. Replace with the cap formula.

### `[[progression/campaign-level-band]]` — UPHELD [A2] (9 critics)

The campaign's own intended level band is tabled — 142 quest-wave enemy <lvl> rows spanning levels 2–35 (plus ally rows to 80) — so "both longplays cap at L10" is a capture limit, not a content limit.

- **Cite:** `docs/gauntlet/L0/index/questdata.json paths questdata/quest/step/wave/enemy/lvl (count 142, range 2.0–35.0), questdata/quest/step/wave/friend/lvl (count 9, range 25.0–80.0), questdata/quest/step/roomobj/property/obj/property/xml/wave/enemy/lvl (count 18, all 25)`
- **KILLS this line:** "② L11–80 XP curve — likely unrecoverable (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline)."
- **Lane impact:** L4: removes the stated reason for blocker ② ("both longplays cap at L10") as evidence about the game rather than about the capture. Also useful to L8 enemies-ai for level-band pacing.

### `[[progression/def-mitigation-is-flat]]` — UPHELD [A2] (9 critics)

There is NO DEF mitigation curve: defense is flat subtraction from incoming damage, floored at the attack's own minDamage, with exactly one modifier — Heavy stance multiplies your defense by 0.8.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3284-3291 and :3484-3488 (web); clear-named at reference/decompiled/shs3_android/scripts/MCSPlayer.as:3231-3237 and :3415-3419`
- **KILLS this line:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — measure per-point deltas in a build."
- **Lane impact:** L4 blocker ① (DEF half) dies — and there was never a curve to find. Corroborated by the resolved string table: skill 1002 Heavy Stance Mastery desc ends "Defense -20%". Feeds L1 combat-core's damage pipeline directly.

### `[[progression/full-xp-table-recovered]]` — UPHELD [A2] (2 critics)

The complete cumulative XP-per-level table is on disk in both builds — a 99-entry array, byte-identical between v0.682 android and v0.717 desktop — so the L11-80 curve is not unrecoverable and needs no extrapolation.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:78 and reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 (consumed at §1t1523s0§.as:2013, 2024, 2029); arrays compared element-wise this pass, identical`
- **KILLS this line:** "② L11–80 XP curve — likely unrecoverable (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."
- **Lane impact:** progression blocker ② dies outright and the XP curve moves from INFERRED-extrapolation to CONTRACT. Found while verifying levelCap for the SP formula; belongs to the progression lane, which should drop its extrapolated table.

### `[[progression/inferred-extrapolation-error]]` — UPHELD [A2] (9 critics)

The shipped XP_DELTA_STEP=500 extrapolation is not merely INFERRED but quantifiably wrong — it under-shoots the real curve by -61.3% at level 80.

- **Cite:** `src/config/xp.ts:28 vs reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364; test tests/xp.test.ts > xpThreshold — cumulative cap to finish a level > extrapolates L11+ by growing the per-level delta by XP_DELTA_STEP (INFERRED)`
- **KILLS this line:** "Keep the extrapolation as labeled INFERRED."
- **Lane impact:** L4: src/config/xp.ts must swap the extrapolation for the real 99-entry table and drop the INFERRED label; tests/xp.test.ts's extrapolation test pins a refuted model.

### `[[progression/no-gather-xp-path-exists]]` — UPHELD [A2] (2 critics)

An exhaustive enumeration of every addLootXP call site proves there is NO gather/mine/farm XP path at all — gathering XP can only arrive as a quest outcome, so the missing 'gather XP number' is not missing, it does not exist.

- **Cite:** `grep -rn addLootXP reference/decompiled/shs3_android/scripts/ — 13 sites, all enumerated: NPC.as:863; EnemyPlayer.as:1318/1322/1327; NetworkManager.as:1268/1272/2818/2822; ConnectionPIO.as:643/647; Overworld.as:318; XMLQuestOutcome.as:66; definition LootDialog.as:638`
- **KILLS this line:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** L4: upgrades progression/xp-from-gather-and-dungeon from PARTIAL to a held negative — stop looking for a gather-XP constant. Corroborated on camera by A-04 (XP bar frozen at 2098/2950 for an entire mining session), so code and frame agree.

### `[[progression/per-point-ap-is-plus-5-not-plus-1]]` — UPHELD [A2] (2 critics)

Per stat point the WEB build grants +5 max AP, not +1. §1t5957s0§.as:3413-3414 spends one stat point and calls §1t1523s0§.§1t9609s0§(5); §1t1523s0§.as:2807-2810 is changeStat(§1t9415s0§, param1) with §1t9415s0§:int = 14 (:232) = STAT_MAXAP. Reading all six allocation buttons directly, the complete web per-point table is: MAXHP +10 (:3394), MAXCHI +5 (:3406), MAXAP +5 (:3414), ATK +3 (:3422), DEF +3 (:3434), SPD +3 (:3443). The ledger's '+1AP' looks like an Android value that leaked into a web line — Android's auto-allocator at StatsManager.as:1669-1683 is +5 HP / +5 Chi / +1 AP / +1 everything-else.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3394, :3406, :3413-3414, :3422, :3434, :3443 and reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2807-2810, :232`
- **Build:** web v0.717
- **KILLS this line:** "- Ready: +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30)."
- **Lane impact:** L4 progression — one wrong term inside a line the ledger lists as READY, i.e. a value that would have been coded as CONTRACT without challenge. The rest of the line (+3 stat/level, +10HP, +5Chi, +3-stat) is confirmed by the same six lines.

### `[[progression/per-point-magnitudes]]` — UPHELD [A1] (9 critics)

Per stat point the WEB v0.717 build grants HP +10, Chi +5, AP +5, ATK +3, DEF +3, SPD +3 — the ledger's "+1AP" is wrong (it is +5); and where the Android v0.682 payload disagrees (HP+5/AP+1/stat+1), THE FRAME WINS and it matches WEB.

- **Cite:** `FRAME: reference/videos/zFtCaTO0_1M.mp4 @ t=1600s, crop=iw*0.55:ih*0.20:iw*0.42:ih*0.16 scale=1.7×; adjudicating reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3390-3445 (web) against reference/decompiled/shs3_android/scripts/InventoryUI.as:2417-2453 (android)`
- **KILLS this line:** "- Ready: +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30)."
- **Lane impact:** L4: fixes the +1AP error. Gauntlet-wide: proves Stage-0b finding S0-3's parity caveat concretely — shs3_android v0.682 is DIFFERENTLY TUNED and must be used only as a decoder ring for symbol names; port all progression numbers from shs3_payload (web v0.717). Also closes an open INFERRED flag in docs/research/video-study/segments/A-02-...md line 25.

### `[[progression/per-stat-caps-are-a-level-formula-and-they-prove-the-build-split]]` — UPHELD [A2] (2 critics)

The per-stat CEILINGS are on disk in both builds as level formulas, and they arithmetically corroborate the per-point tables. WEB v0.717 (§1t5957s0§.as:3341-3346): MAXHP < 10+(level+10)*10, MAXCHI < 10+(level+10)*5, MAXAP < 30+(level+10)*5, ATK/DEF/SPD < 1+(level+10)*3. ANDROID v0.682 (InventoryUI.as:2407-2412): MAXHP < 10+(level+10)*5, MAXCHI < 10+(level+10)*5, MAXAP < 20+(level+10), ATK/DEF/SPD < level+10. Each build's caps are exactly its per-point grant times the point budget, which independently confirms web = 10/5/5/3/3/3 and android = 5/5/1/1/1/1. The web bases 10 / 10 / 30 also match the ledger's recorded start pools HP10 / Chi10 / AP30.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341-3346 + reference/decompiled/shs3_android/scripts/InventoryUI.as:2406-2412`
- **Build:** both
- **KILLS this line:** "- Surface: the per-point stat table + atkPlusWeapon term are solved but scattered; ... The "271 cap" is gear/rebirth-inclusive ..."
- **Lane impact:** L4 progression - RR:201's '271 cap' surface note can be replaced by an exact per-stat cap formula per build; no arithmetic reconstruction needed.

### `[[progression/plus1ap-is-androids-manual-panel-not-a-typo]]` — UPHELD [A2] (2 critics)

The ledger's '+1AP per stat point' has a specific, citable android source, and it is NOT the auto-allocator the packet blamed. Android v0.682's manual stat panel InventoryUI.as:2429-2434 is `APaddHandle` -> `StatsManager.addMaxAP(1)`, with siblings +5 MAXHP (:2417), +5 MAXCHI (:2424), +1 ATK (:2439), +1 DEF (:2446), +1 SPD (:2453). The android auto-allocator at StatsManager.as:1669-1683 independently reads +5/+5/+1/+1. The web v0.717 twin (§1t5957s0§ binds the identical `this.statsPanel.HPadd` member at :3334) grants 10/5/5/3/3/3. So RR:77 and RR:199's '+10HP/+5Chi/+1AP/+3-stat' is a TWO-BUILD HYBRID: +10HP and +3-stat are web values, +1AP is the android value, and no single build ever shipped that line.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:2415-2455 + reference/decompiled/shs3_android/scripts/StatsManager.as:1660-1687 + reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3334 and :3390-3445`
- **Build:** both
- **KILLS this line:** "- Ready: +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; ..."
- **Lane impact:** L4 progression - gives the '+5AP vs +1AP' correction a build-attributed source instead of a guess, so the ledger line can be rewritten as two labelled rows rather than one contested number.

### `[[progression/post-rebirth-sp]]` — UPHELD [A2] (9 critics)

The post-rebirth skill-point economy is a single closed form: SP = (level-1) + Dan*(levelCap-1) = (level-1) + Dan*79, so each rebirth permanently adds a full 79-point budget (lifetime max 790 at the Dan-9 cap).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2598 (web), clear-named at reference/decompiled/shs3_android/scripts/StatsManager.as:2156`
- **KILLS this line:** "③ post-rebirth SP economy;"
- **Lane impact:** L4 blocker ③ dies. Also: doRebirth() (StatsManager.as:2195-2231) calls unAssignStatPoints() but NOT unAssignSkillPoints() — learned skills survive rebirth; only the equipped skill-slot vector resets to skillSlots[0]=IntStat(1003,1) (Jump).

### `[[progression/post-rebirth-sp-economy]]` — UPHELD [A2] (9 critics)

The post-rebirth skill-point economy is an exact formula, SP = (level−1) + DAN×(levelCap−1) = (level−1) + DAN×79, which also shows the ledger's '80 SP first run' is one too many.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2156, desktop confirm §1t1523s0§.as:2598; levelCap=80 at StatsManager.as:76`
- **KILLS this line:** "③ post-rebirth SP economy;"
- **Lane impact:** progression blocker ③ closed, and its Ready bullet '80 SP first run' corrected to 79 at L80/Dan 0. A Dan-10 L80 character has 790 SP.

### `[[progression/procgen-quest-xp-formula]]` — UPHELD [A2] (2 critics)

Proc-gen daily quests compute their XP at runtime from the recovered expArray — questReward = (expArray[nodelvl+1] − expArray[nodelvl]) / ((nodelvl+1) × 1.2) — and this formula, not the 69-row table, produces the only quest-XP number visible in either longplay.

- **Cite:** `reference/decompiled/shs3_android/scripts/QuestGenerator.as:839 and :916 (and ~28 sibling sites at 1001/1228/1465/1644/1839/2105/2266/2417…); WEB parity reference/decompiled/shs3_payload/scripts/§1t123s0§.as:878, :1039, :1283, :1522 and §1t27s0§.as:317; consumed via reference/decompiled/shs3_android/scripts/StatsManager.as:1604-1606`
- **KILLS this line:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** L4: overturns the surveyor's own progression/quest-xp-tabled ('a table, not a formula') and closes blocker ④'s quest side more completely than claimed. L9 quests-story: the daily-quest generator is a second reward system with its own XP curve. Also an independent VALIDATION of the newly recovered expArray, since the formula consumes it — the frame's 473 could not be reproduced without the real table.

### `[[progression/quest-xp-sum-kills-blocker2-rationale]]` — UPHELD [A2] (2 critics)

The 69 tabled quest XP rewards sum to 79,890 — enough on their own to carry a solo offline player to level 17, which destroys the ledger's stated reason for calling the L11-80 curve unrecoverable.

- **Cite:** `reference/extracted/questdata.xml — my own sum over all 69 <exp> rows; compared against expArray at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364`
- **KILLS this line:** "② L11–80 XP curve — likely unrecoverable (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."
- **Lane impact:** L4: blocker ②'s parenthetical was doing the persuasive work, and it is now false on two counts — the curve is on disk AND a solo build reaches L11+ from quests alone. Also strengthens L9 quests-story (the reward side is fully tabled) and L8 enemies-ai level-band pacing.

### `[[progression/quest-xp-tabled]]` — UPHELD [A2] (9 critics)

Quest XP is a table, not a formula, and it is on disk — 69 <exp> reward rows across the 61 quests, range 100–3000, attached to quest steps.

- **Cite:** `reference/extracted/questdata.xml:214-216 and :411-413; index docs/gauntlet/L0/index/questdata.json path questdata/quest/step/reward/exp (count 69, range 100.0–3000.0)`
- **KILLS this line:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** L4 blocker ④ (quest side). Also touches L9 quests-story blocker ③ ("per-quest trigger types + coords + rewards (sampled, not tabled)") — the reward side is tabled.

### `[[progression/second-frame-confirms-plus3-per-point]]` — UPHELD [A4] (2 critics)

A second frame reading, already in the video study and flagged INFERRED there, independently confirms +3 per stat point and the start pools — it was sitting unused while the ledger carried the wrong +1AP figure.

- **Cite:** `docs/research/video-study/segments/A-02-dojo-tutorial-3-stances-chi-punch-on-dum.md:24-25 (segment carries its own frame cites); adjudicated against reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3422,3434,3443`
- **KILLS this line:** "- Ready: +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30)."
- **Lane impact:** L4: closes A-02's open INFERRED flag with a payload cite, and shows the frame evidence for +3/point was already on disk. CHI 10/10 and AP 30/30 in the same frame confirm the start pools directly. No replay needed — mark A-02:25 RESOLVED.

### `[[progression/second-xp-curve-mastery-ranks]]` — UPHELD [A2] (2 critics)

There is a SECOND cumulative XP curve in the web payload — an 11-entry array [0,300,900,2100,4800,10200,21000,42600,85800,172200,345000] capped at level 10 — driving five per-unit sub-bars that roll up into an E, E+, D, D+, C, C+, B, B+, A, A+, S letter-grade rank, and neither the ledger nor the surveyor mentions it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t29s0§.as:30 (the array), :326-328 (curve selection), :459-486 (letter ladder), :24 (const §1t12495s0§ = 10); corroborated by docs/gauntlet/L0/index/strings.json:1774`
- **KILLS this line:** "| progression | 55 | level-up spine, L1–L10 XP, stat-point effects, unlock cadence | DEF/SPD transfer functions; L11–80 curve (likely unrecoverable); post-rebirth SP economy |"
- **Lane impact:** L4: a second progression axis absent from the ledger's progression row entirely — 5 graded sub-bars per unit on their own 11-entry XP table, cap 10, surfaced as an E-to-S letter rank. Straddles L11 meta-social: §1t24s0§ imports playerio and pushes §1t29s0§ instances into a roster (§1t553s0§) placed on a grid (§1t558s0§[x][y]), with the player inserted by charname at §1t24s0§.as:265 — this is the clan/castle roster. WEB-ONLY: the array and the letter ladder are both absent from shs3_android (grep returns nothing), another concrete instance of the S0-3 parity caveat. Its UI copy is still unheld — the 22xxx string ids it calls (getString(22080/22101/22102)) are OUTSIDE the Android Mobile_Lang_EN table, whose max id is 9010.

### `[[progression/sp-first-run-off-by-one]]` — UPHELD [A2] (9 critics)

First-run skill points are 79, not 80 — SP = level-1 with level capped at 80.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2598 with Dan=0, and per-level grants at §1t1523s0§.as:2074-2075`
- **KILLS this line:** "cap 80; 80 SP first run; unlock cadence;"
- **Lane impact:** L4: an off-by-one in the Ready bullet. The '+3 stat/+1 skill per level' half of the same bullet is confirmed correct.

### `[[progression/spd-scaling]]` — UPHELD [A2] (9 critics)

All three SPD transfer functions are held verbatim — slash length (reach) = 120 + floor((90 + Dan*5)*spd/(20+spd)); slash reload = 48 + spd*6; skill cooldown multiplier = 1 - min(spd,600)/600*0.5 (WEB) vs /300 (Android drift); speed buff pre-multiplies spd by 1.5. SPD never touches damage.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2276, :2286-2296, :2344-2347 (web); clear-named at reference/decompiled/shs3_android/scripts/StatsManager.as:1841, :1854-1861, :1915-1919`
- **KILLS this line:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — measure per-point deltas in a build."
- **Lane impact:** L4 blocker ① dies in full. CROSS-LANE GIFT to L1 combat-core blocker ① ("reach cap in stage px per stance — the one value the whole model needs"): the base slash-length getter is a SPD formula with a hard floor of 120 and a Dan-0 asymptote of 210, with per-stance modifiers applied on top. Also closes skills-meters blocker ④ (SPD→cooldown formula).

### `[[progression/web-ap-per-point-is-5-not-1]]` — UPHELD [A2] (2 critics)

The ledger's '+1AP per stat point' is wrong for the WEB v0.717 build: one stat point buys +5 max AP, not +1. The stat-panel click handlers spend one point each and grant MAXHP +10, MAXCHI +5, ATK +3, DEF +3, SPD +3 — and AP +5 via a helper. This is the only per-point magnitude in the ledger's 'Ready' line that is wrong, and it is wrong in both places the ledger states it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3414 with reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2807-2814 and :232; android cross-check reference/decompiled/shs3_android/scripts/StatsManager.as:198`
- **Build:** web v0.717
- **KILLS this line:** "- Ready: +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30)."
- **Lane impact:** L4 progression — REBUILD_READINESS.md:199 and :77 both carry '+1AP' and both must change to '+5AP'. src/config's per-point AP value needs the same correction. Found while adjudicating progression/second-frame-confirms-plus3-per-point, which asserts the +1AP figure is wrong but supplies no cite for it; this is that cite.

### `[[progression/web-per-point-table-is-confirmed-on-camera-L3-to-L4]]` — UPHELD [A1] (2 critics)

The WEB per-point stat table is confirmed by film, not only by decompile. In reference/videos/zFtCaTO0_1M.mp4 the character screen at -ss 653.0 reads level 3 with HP 20/20, CHI 10/10, AP 30/30, ATK 7, DEF 7, SPD 4 and AVAILABLE STAT POINTS: 0; at -ss 1600 it reads level 4 with HP 20/20, CHI 9/15, AP 15/30, ATK 10, DEF 10, SPD 4 and again 0 points available. The level-up therefore spent exactly three points and bought MAXCHI +5, ATK +3 and DEF +3 - matching the web handlers (§1t5957s0§.as:3406 +5 CHI, :3422 +3 ATK, :3434 +3 DEF) and matching the ledger's '+3 stat points per level'. It also rules android's +5/+1/+1 out on camera. HP 20 against a base of 10 needs a single +10 web point; android's +5 would need two.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 @ -ss 653.0 and @ -ss 1600 (crop=iw*0.55:ih*0.35:iw*0.42:ih*0.12, x2 lanczos, my own ffmpeg extraction) + reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3390-3445`
- **Build:** web v0.717
- **KILLS this line:** "- Ready: +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; ..."
- **Lane impact:** L4 progression - promotes CHI +5 and ATK/DEF +3 per point from decompile-only to frame-plus-payload agreement, the same standard the XP-array claim reached.

### `[[progression/xp-curve-kills-three-more-docs]]` — UPHELD [A2] (2 critics)

The dead 'L11–80 curve is unrecoverable' statement is load-bearing in three documents beyond the two the unit names — including the gauntlet's own charter and a calibration row whose acceptance gate would have passed the refuted model.

- **Cite:** `docs/GAUNTLET.md:373-374 · docs/CALIBRATION.md:38 (row 17) · docs/research/REBUILD_READINESS.md:62 and :93`
- **KILLS this line:** "② L11–80 XP curve — likely unrecoverable (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."
- **Lane impact:** Blast radius is wider than L4. GAUNTLET.md:373 mis-states what L11 (meta+rebirth) must author as a deviation — L11 loses one authored-deviation obligation. CALIBRATION.md row 17's ±5% band is worse than stale: the real curve misses it by −61.3% at L80, so the gate as written would have green-lit a refuted model; rewrite row 17 as CONTRACT against the 99-entry table. REBUILD_READINESS.md:62 and :93 need the same edit as :200/:350.

### `[[progression/xp-curve-l11-80]]` — UPHELD [A2] (9 critics)

The complete L1→L99 cumulative XP table is a literal array on disk in BOTH payloads (byte-identical), so the L11–80 curve the ledger calls "likely unrecoverable" and lists under §6 "structurally UNRECOVERABLE" is fully held.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 (web v0.717; duplicated at §1t29s0§.as:28) and reference/decompiled/shs3_android/scripts/StatsManager.as:78`
- **KILLS this line:** "② L11–80 XP curve — likely unrecoverable (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."
- **Lane impact:** L4 progression blocker ② dies outright; §6's "structurally UNRECOVERABLE" list loses the L11–80 XP curve line (line 350).

### `[[questdata-critic/xp-curve-held-web]]` — UPHELD [A2] (2 critics)

The COMPLETE 99-entry level XP curve is a literal array in the shipped WEB payload, not merely two frame-read points. [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,...,25395800,29395800]. This also corrects the packet's frame-read by-product: L7->L8 is 16350, not 16550 — the 16550 came from reading a 480x270 survey-scale frame without upscaling.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 (WEB v0.717); duplicated at reference/decompiled/shs3_android/scripts/StatsManager.as:78`
- **Build:** web v0.717 (byte-equal array in android v0.682)
- **KILLS this line:** "the L11-80 XP curve is likely unrecoverable"
- **Lane impact:** L3 progression: the whole L1-99 XP curve is measured, not inferred. Every INFERRED XP threshold in the config can be promoted to CONTRACT.

## ② TRUE, but the line SURVIVES — do NOT delete anything for these

The finding held up; the overturn did not. 36% of claimed overturns were rejected this way. Bank the knowledge, keep the sentence.

### `[[progression/per-point-two-frame-delta]]` — NOT-UPHELD [A1] (2 critics)

A two-frame differential in video A proves the WEB per-point magnitudes without any assumption about gear folding into displayed maxima: one level-up spends exactly 3 stat points and buys Chi +5, ATK +3, DEF +3 — 3 points under web magnitudes, 7 under Android.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 @ -ss 653.0 and -ss 656.5 vs @ -ss 1600; crops crop=iw*0.55:ih*0.30:iw*0.42:ih*0.15 scale=1.5x lanczos and crop=iw*0.55:ih*0.30:iw*0.42:ih*0.12 / :ih*0.36 scale=2x lanczos`
- **aimed at this line, which SURVIVES:** "- Ready: +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30)."
- **Lane impact:** L4: this should replace the single-frame budget sum as the canonical evidence for the web-build ruling — it is gear-proof because it is a delta and because the HUD renders equipment bonus separately (DEF 7 + 2 -> DEF 10 + 13). Gauntlet-wide it is the hardest available proof that shs3_android v0.682 is a decoder ring only.

## ③ Corroborating — new knowledge, no line deleted

These add or sharpen; they do not contradict.

### `[[NF-17-four-actives-cost-zero-skill-points]]` — UPHELD [A2] (1 critic)

Four player actives cost NO skill points, and the file expresses 'free' two different ways. Jump (1003) and Chi Punch level 1 (1042) use an EMPTY <required></required>; Dash Right (1049) and Dash Left (1050) use an explicit <required>0</required>. XMLSkill.as:253 reads it as int(this.levelList[lvl].required), and AS3's int("") is 0, so both spellings work in the OG.

- **Cite:** `reference/extracted/skilldata.xml:240 (skill 1003), :1282 (skill 1042), :1491 (skill 1049), :1506 (skill 1050); reference/decompiled/shs3_android/scripts/XMLSkill.as:253`
- **Build:** android v0.682 (skilldata byte-identical to web v0.717)
- **Lane impact:** L10 progression — the starting kit (Jump, both Dashes, Chi Punch L1) is free, which changes the 80-SP first-run budget arithmetic. PORTING HAZARD: a TypeScript port using parseInt("") gets NaN where AS3's int("") gets 0, silently breaking four skills' affordability check.

### `[[NF-6-xp-array-runs-past-the-level-cap]]` — UPHELD [A2] (1 critic)

The recovered XP table is 99 entries (indices 0..98, last 29,395,800) but the level cap is 80 in both builds: §1t1523s0§.as:362 `public static const §1t9470s0§:int = 80;` and android StatsManager.as:76 `public static var levelCap:int = 80;`. Indices 81..98 are shipped-but-unreachable tail data. A rebuild should paste the whole array for fidelity but cap progression at 80 rather than treating 98 as the cap.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:362, :364 and reference/decompiled/shs3_android/scripts/StatsManager.as:76, :78`
- **Build:** both
- **Lane impact:** L-progression: rides with NEW-3. Do not let the 99-entry array be read as a level-98 cap when the ledger's 'cap 80' Ready item at :199 is correct.

### `[[NF-I/def-subtraction-is-floored-by-the-attackers-min-damage]]` — UPHELD [A2] (1 critic)

Every DEF subtraction in both builds is immediately floored by the ATTACKER's minimum damage, so defence can never reduce a hit below that floor — a term the 'DEF is flat subtraction' statement omits. All three web damage paths do `_loc5_ -= getDefense();` then `if(_loc5_ < param2.getMinDamage()) { _loc5_ = param2.getMinDamage(); }`, and android does the same at MCSPlayer.as:3709-3713. A Sim that subtracts DEF without the floor will produce zero-damage hits the original never produces.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3484-3488, :3800-3804, :4391-4395 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:3709-3713`
- **Build:** both
- **KILLS this line:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — measure per-point deltas in a build."
- **Lane impact:** L-progression ① / L1 combat-core: completes the DEF model — flat subtraction, floored at the attacker's minDamage, with the defender-in-Heavy x0.8 as the only conditional.

### `[[frames/levelup-card-corroborates-banked-numbers]]` — UPHELD [A1] (2 critics)

The level-up card corroborates the ledger's already-banked '+3 stat/+1 skill per level' with an A1 cite it previously lacked, and adds one rendering rule: NEXT LEVEL is XP REMAINING, not the threshold.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0049.jpg (crop 330,190-700,400 @5x); paired PLAYER screen reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0051.jpg`
- **Build:** web v0.717
- **Lane impact:** progression, ui-hud: corroboration plus one widget-semantics correction

### `[[gauntlet/index-firstlines-are-leafname-scoped]]` — UPHELD [A2] (1 critic)

⚠ CROSS-CUTTING: the Stage-0 index's first_lines field is scoped to the LEAF TAG NAME, not to the full path, so it is only a valid line cite when the leaf name is unique in the file — every lane citing it must open the line first.

- **Cite:** `docs/gauntlet/L0/index/questdata.json (three distinct paths sharing first_lines) vs reference/extracted/questdata.xml:93`
- **Lane impact:** All lanes L1-L11: never cite an index first_lines value as a path-specific line number. It happens to be correct for unique leaf names (<exp> -> [215,412], <lvlreq> -> [257,286], both of which I verified) and wrong for repeated ones. The progression unit did not fall into this — all four of its XML line cites were self-derived and all four verified — but the trap is live for every other lane.

### `[[itemdata/guest-start-state]]` — UPHELD [A2] (2 critics)

The guest start state is exact in web v0.717 — HP 10/10, HP-regen 1, Chi 10/10, Chi-regen 1, ATK/DEF/SPD 1, XP 0, level 1, 100 coins, 3 heavenly gold, AP 30/30, duel tokens 20/20, 0 skill/stat points, node 8382465 — with starting gear armor 4017 'Torn Garment', pants 11017 'Torn Pants', shoes 12017 'Worn Sandals', scabbard 13100, weapon 0 (auto-equipping 13002 'Branch').

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:1007-1030 (char init) and :2630-2634 (re-equip on rebirth); stat-id map reference/decompiled/shs3_android/scripts/StatsManager.as:170-202; names via docs/gauntlet/L0/index/resolved_names.json`
- **Lane impact:** L3 progression and L6 economy: confirms the ledger's '100c/3g guest start' and 'start pools (HP10/Chi10/AP30)' from primary code, and ADDS the never-recorded duel-token start of 20/20 (the MAXDUELTOKENS=30 constant is a later ceiling, not the start). L5 items-equipment gains the exact starting outfit ids.

### `[[npcdata/kill-xp-formula]]` — UPHELD [A2] (1 critic)

Kill-XP is not authored anywhere in the data — it is computed from level in code as xp = lvl * 2 + 20, inside NPC.setLevel. This completes the packet's npcdata/no-kill-xp claim, which correctly found <exp> absent from npcdata but did not locate the real source.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:252 (inside public function setLevel(lvl:int), :239-260)`
- **Build:** android v0.682
- **KILLS this line:** "kill-XP source unknown / absent from payload"
- **Lane impact:** Closes the 'where does kill XP come from' question for the progression lane without needing a build: XP per kill = 2*level + 20, a pure function of the spawned level.

### `[[npcdata/no-kill-xp]]` — UPHELD [A2] (2 critics)

Kill-XP is NOT in npcdata: the reward parser supports an <exp> field but the file contains zero <exp> elements, and 429 of 495 NPCs carry no <reward> block at all (including all 285 clan-army rows).

- **Cite:** `grep -c "<exp>" reference/extracted/npcdata.xml → 0; parser field at reference/decompiled/shs3_android_payload/scripts/XMLReward.as`
- **Lane impact:** progression + economy — narrows blocker ④ ('full XP-income model'): kill XP is a formula or lives in questdata, not in the NPC rows. Honest negative result.

### `[[progression/a02-second-frame-corroboration]]` — UPHELD [A4] (1 critic)

A second, independent frame confirmation of the WEB per-point magnitudes exists at level 3 in the video study and was not used: A-02's own budget arithmetic closes exactly on +10 HP / +3 stat per point, discharging that segment's INFERRED hedge.

- **Cite:** `docs/research/video-study/segments/A-02-dojo-tutorial-3-stances-chi-punch-on-dum.md:24-25 (frame-backed, t=07:35–07:45 of video A), reconciled against reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3390-3445`
- **Lane impact:** L4 — two frames at two different levels (A-02 L3, and the t=1600 L4 crop) independently confirm the same web per-point table, so progression/per-point-magnitudes rests on more than one reading. A-02 line 25's 'treat exact point-to-stat ratio as INFERRED' can now be closed as CONTRACT.

### `[[progression/android-caps-also-drifted]]` — UPHELD [A2] (1 critic)

The Android build's per-stat CAP formulas are drifted in lockstep with its per-point magnitudes (HP *5 not *10, AP 20+(L+10) not 30+(L+10)*5, ATK/DEF/SPD L+10 not 1+(L+10)*3), proving the divergence is a deliberate mobile re-tune of the whole stat economy rather than decompiler noise.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:2407-2412 vs reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341-3346`
- **Lane impact:** L4: independent corroboration that progression/per-stat-hard-caps picked the right build. At Android L80 the ATK ceiling would be 90, not 271 — port the WEB cap formula. Gauntlet-wide: hardens S0-3's parity caveat from 'not established' to 'measurably violated in the stat economy'.

### `[[progression/android-stat-caps-are-a-different-formula]]` — UPHELD [A2] (1 critic)

Android's per-stat caps are a wholly different formula from web's — ATK/DEF/SPD capped at level+10 (90 at L80) against web's 1+(level+10)*3 (271) — so 271 is a web-only number and the whole cap sub-system must be ported from web.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:2407-2412 vs reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341-3346`
- **Lane impact:** L4: strengthens progression/271-cap-explained — 271 exists only in web, so the ledger's '271' was always a web observation — and adds a fifth concrete instance of android/web tuning drift alongside per-point magnitudes, rebirth gold, MAXDUELTOKENS and the /300-vs-/600 cooldown divisor. The lane rule should be stated once and enforced: ANDROID SUPPLIES SYMBOL NAMES, WEB SUPPLIES NUMBERS.

### `[[progression/autoassign-android-only]]` — UPHELD [A2] (1 critic)

The autoAssignStats round-robin the unit surfaces as a newly-found level-up mechanic exists ONLY in the Android v0.682 build — the web v0.717 levelUp has no such branch, and the feature's own magnitudes are the Android tuning this same unit proved the frame refutes.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2072-2082 (complete web levelUp) vs reference/decompiled/shs3_android/scripts/StatsManager.as:1655-1687, :322, :586 and InventoryUI.as:313, :2376, QueryManagerBase.as:3091/:3171`
- **Lane impact:** L4 progression: strike autoAssignStats from the port list or label it ANDROID-ONLY. Its round-robin grants changeStat(stat,5) HP and changeStat(stat,1) ATK/DEF/SPD — the exact magnitudes progression/per-point-magnitudes proved the frame refutes — so porting it would inject a non-existent feature carrying refuted numbers. This is the S0-3 parity trap the unit identified in claim 5 and then walked into in claim 11.

### `[[progression/autoassign-is-android-only]]` — UPHELD [A2] (1 critic)

The autoAssignStats round-robin the survey surfaced as a progression sub-system does not exist in the WEB v0.717 build at all — it is an Android-port convenience feature, and porting it would import Android's wrong per-point magnitudes with it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2072-2082 (the complete web levelUp) vs reference/decompiled/shs3_android/scripts/StatsManager.as:322, :586, :1655-1688`
- **Lane impact:** L4: strike autoAssignStats from the progression board, or label it ANDROID-ONLY (v0.682). It is listed unlabeled in progression/levelup-refill-and-cap's lane_impact and would otherwise reach config carrying the exact per-point numbers this lane just proved wrong for the web build.

### `[[progression/duel-token-refill-mismatch]]` — UPHELD [A2] (1 critic)

Correction to claim progression/levelup-refill-and-cap: levelUp() refills duel tokens to the CLASS CONSTANT MAXDUELTOKENS = 30, but a new character starts with STAT_MAXDUELTOKENS = 20 — so the first level-up silently raises the token pool from 20 to 30.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:166 vs :709-710 and :1691, with :202 disambiguating the constant from the stat index`
- **Lane impact:** L4/L11: port the constant 30 for the level-up refill, not the STAT_MAXDUELTOKENS stat — a rebuild that reads the stat will cap first-run duel tokens at 20 and diverge on the very first level-up.

### `[[progression/elemental-damage-bypasses-def]]` — UPHELD [A2] (2 critics)

Defense is subtracted from the physical damage term only — fire, wind, water and earth damage are added after the min-damage floor and are never mitigated by DEF; and a behead multiplies x1.5 after the floor too.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3484-3489 and reference/decompiled/shs3_android/scripts/MCSPlayer.as:3415-3418, :3709-3718`
- **Lane impact:** L4 completeness on the DEF claim, and a CROSS-LANE GIFT to L1 combat-core: stacking DEF has zero effect on elemental builds, which is a real balance property of the original, not an approximation.

### `[[progression/enemy-base-xp-is-lvl5plus45]]` — UPHELD [A2] (1 critic)

There are two mob base-XP formulas and the split is per-class: level*2+20 is the GENERIC NPC base, level*5+45 is the base for fifteen named enemy classes — not, as the surveyor labelled it, a 'duellist/PvP base'.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:218 vs EnemyWolf.as:32, EnemyFox.as:26, EnemyNianMonster.as:41, EnemySpearElite.as:62,78 and 11 more; web parity at reference/decompiled/shs3_payload/scripts/§1t4902s0§.as:26`
- **Lane impact:** L4: corrects progression/xp-income-model. A rebuilder applying level*2+20 to wolves, bears, foxes, boars, deer or ogres would be ~2.5x low on every overworld kill (at L10: 40 vs 95 base XP before calcXP scaling). Several classes carry BOTH formulas on level-dependent branches (EnemySpearElite:62/78, EnemyStag, EnemyPlayer), so the mapping must be ported per class, not per game. Also feeds L8 enemies-ai: this is a clean per-class inventory of which enemies are 'named' tier.

### `[[progression/expArray-levelcap-clamp]]` — UPHELD [A2] (1 critic)

The web build clamps its XP accumulator at expArray[levelCap] = 4,285,800, giving the shipped builds three separate stops before array index 81 — a real lead on the surveyor's open levels-81-99 question, but not enough to close it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t29s0§.as:350-358 and :361-372; corroborated by shs3_android/scripts/StatsManager.as:1619 and LootDialog.as:644; scope limit from §1t29s0§.as:8 and §1t24s0§.as:30`
- **Lane impact:** L4: upgrades progression/levels-81-99 from STILL_UNHELD to PARTIAL. Three independent gates (bar clamp at expArray[80], changeXP reportHack on newlevel > levelCap, LootDialog's getLevel() < levelCap) all stop short of index 81, so expArray[81..98] should be treated as dead headroom — but do NOT record levels 81-99 as proven-unreachable on this evidence alone.

### `[[progression/frame-confirms-xp-caps]]` — UPHELD [A1] (9 critics)

Opened the primary video first-hand: the on-screen XP bar reads the payload's numbers exactly (expArray[3]=2950, expArray[4]=5150) — payload and frame AGREE, no conflict to adjudicate here.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 (video A, 1920×1080), ffmpeg -ss 1600 and -ss 655; crops crop=iw*0.55:ih*0.20:iw*0.42:ih*0.16 scale=1.7× lanczos (stat block) and crop=iw*0.55:ih*0.22:iw*0.42:ih*0.09 scale=1.8× (XP row)`
- **Lane impact:** L4: independent on-screen confirmation of the payload XP table; supplies the stat readings that arbitrate the build conflict in progression/per-point-magnitudes.

### `[[progression/getlevel-pins-cumulative-cap-semantics]]` — UPHELD [A2] (1 critic)

getLevel()'s strictly-greater comparison is a payload witness for the cumulative-cap semantics that src/core/xp.ts currently justifies from frames alone — reaching a cap exactly finishes the level.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2007-2020; pins the behaviour asserted in tests/xp.test.ts > levelForXp — current level for a cumulative XP total > crosses to the next level exactly AT each cap (bar full = level done)`
- **Lane impact:** L4: src/core/xp.ts's level semantics can be relabeled CONTRACT (payload-backed) instead of frame-INFERRED. Note the tail behaviour differs by build — web returns 1 on overflow, android returns 99 (StatsManager.as:1596) — so do not port android's tail.

### `[[progression/kill-xp-never-validated-on-screen]]` — UPHELD [STILL_UNHELD] (2 critics)

The kill-XP model is held as code but has never been reconciled with the one on-screen kill-XP delta in the footage (+52 XP at player level 10), and no plausible parameterisation of calcXP reproduces 52.

- **Lane impact:** L4 + L7 economy: keeps one honest validation gap on the board against progression/xp-income-model. The fix is cheap and specific — crop the enemy nameplate during the video-B forest bandit duel (~t=1:00:35–1:00:59) to read the mob's level and elite/boss status, then re-run calcXP. Until then the kill-XP branch is payload-held but frame-unvalidated, unlike the quest branch which IS now frame-validated at 473.

### `[[progression/l1-l10-caps-confirmed]]` — UPHELD [A3] (9 critics)

The frame-derived XP_THRESHOLDS already in config is EXACTLY the payload's expArray[1..10] — the video study got all ten right, which is what licenses trusting the frames elsewhere in this lane.

- **Cite:** `tests/xp.test.ts > XP_THRESHOLDS — the frame-backed L1–L10 table > pins all ten observed cumulative caps exactly`
- **Lane impact:** L4: confirms the ledger's "L1–L10 XP caps" Ready bullet and upgrades it from frame-INFERRED to payload-CONTRACT.

### `[[progression/l3-budget-second-confirmation]]` — UPHELD [A4] (1 critic)

A second, independent level confirms the WEB per-point magnitudes — at level 3 with zero unspent points the stat panel costs exactly the 6-point budget under web magnitudes and 17 under Android's — and the L3-to-L4 delta between the two panels is exactly the +3 stat points per level.

- **Cite:** `docs/research/video-study/segments/A-04-mines-takahasi-coal-mining-quest.md line 29 (carries its own frame cite t=10:55 in reference/videos/zFtCaTO0_1M.mp4) and line 32; session anchored by my own crop of that video at -ss 655 (crop=iw*0.62:ih*0.55:iw*0.36:ih*0.10, 1.6x lanczos)`
- **Lane impact:** L4: claim progression/per-point-magnitudes now rests on TWO independent on-screen budget reconciliations (L3 = 6 pts, L4 = 9 pts) plus the L3-to-L4 delta, not one. This is the strongest evidence in the gauntlet that progression must be ported from the WEB v0.717 payload and that shs3_android v0.682 is a decoder ring only.

### `[[progression/level-10-scroll-xp-item]]` — UPHELD [A2] (1 critic)

A fourth XP source exists and is tabled: item 2201 'Level 10 Scroll' carries two STAT_XP modifiers (-1,000,000 then +25,900) that floor XP to zero and set it to expArray[9], plus a full stat+skill respec — an independent payload-internal proof that 25,900 is the level-10 boundary.

- **Cite:** `reference/extracted/itemdata.xml:2284-2305; consumed at reference/decompiled/shs3_android/scripts/InventoryUI.as:906; STAT_XP id 9 at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:222`
- **Lane impact:** L4 — adds an item-modifier XP channel to the income model the survey did not list, and confirms expArray[9]=25900 from a second, independent place in the payload (getLevel() returns the first q with expArray[q] > XP, so XP=25900 reads as level 10). Cross-lane to L7 economy: 2 heavenly gold, undercutting the Amnesia Scroll's 5.

### `[[progression/level-3-to-4-on-film-buys-plus3-atk-plus3-def-plus5-chi]]` — UPHELD [A1] (2 critics)

An A1 confirmation of the web per-point stat magnitudes that nobody has claimed. In reference/videos/zFtCaTO0_1M.mp4 the player sheet at -ss 653.0 reads level badge 3, ATK 7, DEF 7 (+2), SPD 4, HP 20/20, CHI 10/10, AP 30/30, AVAILABLE STAT POINTS: 0. At -ss 1600 the same sheet reads level badge 4, ATK 10, DEF 10 (+13), SPD 4, HP 20/20, CHI 9/15, AP 15/30, AVAILABLE STAT POINTS: 0. Between them the player gained exactly one level and spent all three of that level's stat points: ATK +3, DEF +3, CHI max +5, AP max unchanged. Those are precisely the web handler magnitudes (1t5957s0.as:3422 ATK+3, :3434 DEF+3, :3406 MAXCHI+5) and they are NOT the android manual-panel magnitudes (InventoryUI.as:2439/:2446 +1, :2424 +5). It also confirms '+3 stat points per level' directly.

- **Cite:** `my own ffmpeg single-frame extractions from reference/videos/zFtCaTO0_1M.mp4 at -ss 653.0 and -ss 1600 (1920x1080, read at 960x540 LANCZOS) + reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3402-3445`
- **Build:** web v0.717
- **KILLS this line:** "- Ready: +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point"
- **Lane impact:** L4 progression: promotes the web per-point table from decompile-only to frame-plus-payload agreement for ATK/DEF/CHI. AP is still decompile-only, because the filmed player never spent a point on it - which is exactly why the ledger's +1AP survived this long.

### `[[progression/level10-scroll-validates-xp-table]]` — UPHELD [A2] (1 critic)

The payload validates its own XP table without any frame: the 'Level 10 Scroll' sets cumulative XP to 25,900, which is exactly expArray[9] — confirming both the L1-L10 values and the cumulative-threshold semantics (hitting a cap finishes that level).

- **Cite:** `reference/extracted/itemdata.xml:2284-2302; reference/decompiled/shs3_android/scripts/StatsManager.as:188 and :1612-1617; InventoryUI.as:902-906; names via docs/gauntlet/L0/index/strings.json 4131/4137`
- **Lane impact:** L4: a payload-internal cross-check of the XP curve that depends on no frame and no video reading. The game asserts cumulative XP 25,900 => level 10, and expArray[9] = 25,900, so it independently confirms the L1-L10 table AND the semantics already encoded in src/core/xp.ts (level N holds while xpThreshold(N-1) <= totalXp < xpThreshold(N)). Worth banking as a second, fully independent line of evidence for the curve.

### `[[progression/levelcap-const-vs-var]]` — UPHELD [A2] (1 critic)

levelCap is declared const in the web build but var in the Android build, which is the one structural reason the levels 81-99 question stays honestly open rather than being closable as dead data.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:362 vs reference/decompiled/shs3_android/scripts/StatsManager.as:76`
- **Lane impact:** L4: strengthens (does not weaken) the STILL_UNHELD verdict on progression/levels-81-99. The web build could not raise its cap at runtime; the mobile build could, so the 18 unused expArray entries may have been live headroom for a server-side raise. Still do not port 81-99 as reachable.

### `[[progression/levelup-refill-and-cap]]` — UPHELD [A2] (9 critics)

"Full refill per level" is right and under-specified — levelUp() refills HP, Chi, AP AND duel tokens; and level cap 80 is enforced twice (XP is simply not credited past it, and a level jump past it is reported as a cheat).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:76, :1619-1628, :1646-1692; reference/decompiled/shs3_android/scripts/LootDialog.as:644-647`
- **Lane impact:** L4: extends the Ready bullet (duel tokens refill too). Also newly surfaced: an autoAssignStats mode (StatsManager.as:1655-1687) that round-robins the 3 points through [MAXHP,MAXCHI,ATTACK,DEFENSE,SPEED,MAXAP] starting at getLevel()%6, and a Dan cap of 9 (:2209) ⇒ 10 Dan ranks, rebirth paying +5 gold or +20 at Dan 8 (:2201-2208) — the last is a cross-lane gift to rebirth-elements blocker ③ (count only, not titles).

### `[[progression/new-character-start-table]]` — UPHELD [A2] (1 critic)

The complete new-character start table is on disk; the ledger's 'start pools (HP10/Chi10/AP30)' Ready bullet captures about a third of it and omits HP/Chi regen, both currencies, duel tokens and the spawn node id.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:695-714 (+ :2230 for the spawn-id match)`
- **Lane impact:** L4: extends the 'start pools' Ready bullet with HPREGEN 1, CHIREGEN 1, ATK/DEF/SPD 1, SKILLPOINTS 0, STATPOINTS 0. L7 economy: starting COINS = 100 (STAT_GOLD) and starting premium GOLD = 0 (STAT_HGOLD) — two distinct currencies, matching the t=1600 frame's separate GOLD 3 readout. L10 world-exploration: node 8382465 is both the character-creation spawn and the post-rebirth teleport target.

### `[[progression/paid-level-skip-item]]` — UPHELD [A2] (1 critic)

A premium level-skip item exists — 'Level 10 Scroll', 2 heavenly gold — that zeroes XP and sets it to expArray[9] = 25900, independently confirming the cumulative-threshold semantics the config encodes.

- **Cite:** `reference/extracted/itemdata.xml:2283-2305 + docs/gauntlet/L0/index/strings.json 4131 / 4137 + reference/decompiled/shs3_android/scripts/InventoryUI.as:903-906`
- **Lane impact:** L4 + L7: a paid progression skip on the board. Its value 25900 = expArray[9] is a payload-side proof that a character is level N once totalXp reaches expArray[N-1] — the exact semantics src/core/xp.ts already implements, previously only frame-inferred.

### `[[progression/per-point-plus3-direct-frame-proof]]` — UPHELD [A1] (1 critic)

One stat point grants +3 to ATK/DEF/SPD, proved directly on screen by a single-click delta rather than by budget reconstruction: at t=456 the panel reads STAT POINTS 3 with SPD 1, and at t=459 it reads STAT POINTS 2 with SPD 4.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4, own ffmpeg extracts -ss 456 / 459 / 462, crop=iw*0.62:ih*0.42:iw*0.36:ih*0.09 (no upscale needed, the stats modal is large in frame)`
- **KILLS this line:** "likely +1 stat point grants +3 to the underlying stat ... treat exact point-to-stat ratio as INFERRED, needs frame-by-frame combat-panel replay to confirm"
- **Lane impact:** L4: upgrades progression/per-point-magnitudes from an indirect budget reconstruction (which must assume the whole spend history) to a directly observed single-click delta, and kills the android +1 model on the frame alone. It also supplies a second, independent budget proof at a DIFFERENT level from the surveyor's: at t=462 the character is level 3, budget (3-1)*3 = 6, and the web magnitudes cost exactly (20-10)/10 + 0 + 0 + (7-1)/3 + (7-1)/3 + (4-1)/3 = 1+0+0+2+2+1 = 6, while android magnitudes give 17. FRAME vs DOC, and the frame wins: docs/research/video-study/segments/A-02-...md:25 asked for exactly this frame-by-frame replay and left the ratio INFERRED; the replay is now done, so the ratio is CONTRACT and that INFERRED flag can be cleared with an A1 cite rather than the A2 one the journal used.

### `[[progression/per-stat-hard-caps]]` — UPHELD [A2] (9 critics)

Stats are hard-capped by character level — HP < 10+(L+10)*10, Chi < 10+(L+10)*5, AP < 30+(L+10)*5, ATK/DEF/SPD < 1+(L+10)*3 — a mechanic the ledger's progression block does not mention at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341-3346`
- **Lane impact:** L4: a whole missing sub-system for the ledger's Ready list — at L80 the ceilings are HP 910, Chi 460, AP 480, ATK/DEF/SPD 271.

### `[[progression/player-stance-cycle-is-three]]` — UPHELD [A2] (2 critics)

Reversed and Dual stance are not reachable by a normal player. MCSPlayer.as:2975-3016 nextStance() branches on StatsManager.consoleEnabled: with the dev console on it cycles all five (Light→Balanced→Heavy→Dual→Reversed→Light, :2982-3002); without it, :3004-3014 cycles Light→Balanced→Heavy→Light. So the shipped game has five stance STATES with five renderable animation blobs, but a three-state PLAYER stance cycle. Any config must model both facts: enemy/NPC stance has five values, player stance selection has three.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2975-3016 (nextStance), :27-35 (five stance ids)`
- **Build:** android v0.682; the web build's five stance constants at §1t99s0§.as:29-33 mirror it
- **Lane impact:** L1 combat-core / L8 enemies-ai — this is the boundary condition that the packet's five-stances finding needed and did not state. Without it, 'any stance model with three states is short two' would push a wrong player-facing model into the build.

### `[[progression/rebirth-pays-heavenly-gold]]` — UPHELD [A2] (1 critic)

Rebirth's payout is STAT_HGOLD (stat id 12, the premium 'heavenly' currency that itemdata's <heavenlyprice> is denominated in), not STAT_GOLD (stat id 11).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:192, :194, :2201-2208`
- **Lane impact:** L4/L5: corrects the lane_impact note on progression/levelup-refill-and-cap, which called it '+5 gold'. Rebirth hands out premium currency — the same currency that gates the Amnesia Scroll — which is a materially different economic fact from a soft-gold payout. L5 rebirth-elements and L7 economy should take the corrected version.

### `[[progression/respec-costs-premium-gold]]` — UPHELD [A2] (1 critic)

Respec is not free: it is delivered only by the 'Amnesia Scroll', a unique item priced at 5 HEAVENLY gold (premium currency) with a coin baseprice of 0, i.e. unbuyable with coins.

- **Cite:** `reference/extracted/itemdata.xml:2267-2281 + reference/decompiled/shs3_android/scripts/InventoryUI.as:983-991 + docs/gauntlet/L0/index/strings.json entries 4130 / 4136`
- **Lane impact:** L4: corrects progression/start-pools-and-respec. L7 economy: a premium-currency sink sitting on the progression system — heavenly gold is the same STAT_HGOLD that doRebirth() pays out at +5 (or +20 at Dan 8), so respec and rebirth share one currency loop.

### `[[progression/respec-is-premium-gated]]` — UPHELD [A2] (1 critic)

The respec is not free: it is delivered only by item 2200 'Amnesia Scroll', a unique item with baseprice 0 and heavenlyprice 5, i.e. purchasable only with the premium currency.

- **Cite:** `reference/extracted/itemdata.xml:2267-2280; reference/decompiled/shs3_android/scripts/InventoryUI.as:984-991; names via docs/gauntlet/L0/index/strings.json 4130/4136`
- **Lane impact:** L4: corrects progression/start-pools-and-respec. The stat economy is premium-gated and consumable-limited, not costlessly re-rollable — porting it as a free respec button would materially change stat commitment. Cross-lane to L7 economy (a premium sink) and L5 rebirth-elements.

### `[[progression/second-xp-curve]]` — UPHELD [A2] (1 critic)

There is a SECOND cumulative XP curve in the payload — an 11-entry array capped at level 10 — sitting two lines below the character expArray the surveyor cited, with its own level lookup, next-level delta, bar fraction and clamp; the ledger's progression block has no second progression track at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t29s0§.as:30 (array), :20 (cap), :299, :328, :347, :396-406 (its consumers)`
- **Lane impact:** L4: a second 10-level progression track exists and is fully tabled, but WHICH track (mastery / pet / companion / clan) is STILL_UNHELD — do not port it as a guess. Notable that the surveyor cited §1t29s0§.as:28 and did not read :30. Web-only, so it is also a data point on web-vs-android divergence.

### `[[progression/second-xp-curve-web-only]]` — UPHELD [A2] (1 critic)

A second literal progression curve exists in the web payload only — an 11-entry array [0,300,900,2100,4800,10200,21000,42600,85800,172200,345000] driving five parallel non-character tracks in the same XP-bar widget, capped at level 5, and absent from the Android build entirely.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t29s0§.as:30, branch logic at :331-347, consumers at §1t24s0§.as:1124-1128 and :1824-1844; absence confirmed by grep over reference/decompiled/shs3_android/scripts/`
- **Lane impact:** L4 — a progression sub-system in the FILMED build that no ledger system mentions and the survey did not surface. The curve and its cap-at-5 branch are held; which five tracks it drives is not yet identified. Flag as a lead for L4/L5, and note it is another web-only feature absent from android (the reverse direction of the S0-3 caveat).

### `[[progression/setlevel-console-confirms-xp-indexing]]` — UPHELD [A2] (1 critic)

A shipped dev console command proves stat id 9 is the raw cumulative XP total and that expArray is indexed directly by character level.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:2132-2139`
- **Lane impact:** L4: independently confirms the expArray indexing convention (expArray[N-1] is the cap you must cross to BECOME level N, i.e. expArray[L] is the cumulative cap to FINISH level L) — the exact convention src/core/xp.ts already implements. Also resolves the unlabeled '§1t9713s0§(9,param1)' in the web changeXP at §1t1523s0§.as:2036 as stat 9 = raw XP. Cross-lane: this is a live debug console (/setlevel, /changestat, loot spawners) that may be reachable in the shipped build — relevant to L11 meta-social.

### `[[progression/setlevel-debug-command-is-a-14th-xp-write-site]]` — UPHELD [A2] (1 critic)

There is a fourteenth XP write site that the addLootXP enumeration misses by construction: OverworldHUD's /setlevel developer chat command writes STAT_XP directly and then nudges changeXP(1) to trigger the level-up path. It is a GM cheat, not a gameplay faucet, so it does not weaken the no-gather-XP negative — but any future exhaustive XP census must grep changeXP as well as addLootXP or it will miss it.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:2132-2138`
- **Build:** android v0.682
- **Lane impact:** L4 progression, methodological. Confirms rather than dents progression/no-gather-xp-path-exists: the full changeXP census is 6 sites — LootDialog.as:251 (the loot pipe), StatsManager.as:1609/1621/1627 (definition + two reportHack guards), InventoryUI.as:906 (item modifier id 9), and this debug command. No gameplay path outside the 13 addLootXP sites survives the wider grep. It also incidentally proves expArray is the live level ladder, since the cheat indexes it to fabricate a level.

### `[[progression/slash-length-settles-balanced-reach]]` — UPHELD [A4] (2 critics)

The SPD slash-length formula reconciles with a frame measurement the combat lane declared unresolvable: at SPD 1 it returns 124 stage px, landing inside the frame-measured level-1 Balanced plateau of 116–131 — so Balanced ≈ ×1.0 base, and the wiki's Balanced 200 is refuted.

- **Cite:** `docs/research/fidelity/COMBAT_MEASUREMENTS.md §c-2 (reach-per-stance table, method 'distance from the player's body to the far end of the drawn stroke, counting only strokes whose near end starts within 30 px', n=17 Balanced) combined with reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2346-2347`
- **Lane impact:** L1 combat-core blocker ① : the cross-lane gift is no longer just a lead — it is frame-corroborated at the one stance/level where a measurement exists. STANCE_TABLE's Balanced entry should become 124 at SPD 1 and track 120 + 90·spd/(20+spd), not the wiki's 200. Corroborated by strings.json 6005 (Heavy: 'slash range is shorter'), matching measured Heavy 97–103 < Balanced 116–131. CARRY THIS CAVEAT: §S24-H's re-run REFUTED the older 775 px / '≈413 stage px' reading at COMBAT_MEASUREMENTS.md:221 ('No normal-anatomy stroke >280 px anywhere re-checked; the 775 refutation REPRODUCED') — reconcile against the §S24-H-corrected figures, never :221. Left PARTIAL because Light/Heavy multipliers and the stage-px unit domain are still unverified.

### `[[progression/spent-points-audit-second-witness]]` — UPHELD [A2] (2 critics)

A second, structurally independent WEB witness for both the start pools and the per-point magnitudes: a spent-points audit whose divisors are the magnitudes and whose subtrahends are the start pools.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3450-3457`
- **Lane impact:** L4: raises the per-point table (HP+10/Chi+5/AP+5/ATK,DEF,SPD+3) and the start pools (10/10/30/1/1/1) from single-witness to triple-witness — the click handlers, this audit, and the frame budget arithmetic all agree, all within the WEB payload. Ready to land in config as CONTRACT.

### `[[progression/start-pools-third-frame]]` — UPHELD [A4] (2 critics)

A third, level-2 frame-backed reading independently confirms the virgin base stats including the ATK/DEF/SPD = 1 the unit added, and a fourth observation (A-02) had already inferred the +3-per-point ratio the payload now proves.

- **Cite:** `docs/research/fidelity/COMBAT_MEASUREMENTS.md:203 §H-1 (tagged MEASURED, carries its own frame cite 'A t≈152 PLAYER screen, re-read at full resolution') and docs/research/video-study/segments/A-02-dojo-tutorial-3-stances-chi-punch-on-dum.md:25`
- **Lane impact:** L4: §H-1 is at level 2 with all 3 points UNSPENT, so its ATK 1 / DEF 1 / SPD 1 / Chi 10 / AP 30 ARE the unAssignStatPoints() literals — the unit's added start values are frame-confirmed, not payload-only. A-02:25's INFERRED flag on the point-to-stat ratio is now closed twice over (payload + my L3→L4 delta). Four independent confirmations of +3 now exist: A-02, §H-1, the L3 absolute fit, and the L3→L4 delta.

### `[[progression/unlock-cadence-to-l80]]` — UPHELD [A2] (9 critics)

The unlock cadence is held all the way to L80, not just to L10 where both longplays stop — 33 character-level gates plus a 52-row skill prerequisite graph the ledger never mentions.

- **Cite:** `reference/extracted/skilldata.xml:257 (<lvlreq>3</lvlreq>, id 1004 Roll) through skilldata.xml:1640 (<lvlreq>80</lvlreq>, id 1055 Mass Shadow Clone); index docs/gauntlet/L0/index/skilldata.json paths skilldata/skill/lvlreq (33, range 3–80) and skilldata/skill/req/has/id (52)`
- **Lane impact:** L4: upgrades the "unlock cadence" Ready bullet from an L1–L10 observation to a complete L3–L80 table. Two gates are themselves progression systems: getSkillSlotCount() = 3 + getStat(1008) (StatsManager.as:2293-2295) and getCarryingWeight() = 100 + getStat(1009)*20 (:2298-2300) — the frame's WEIGHT: 73 / 100 is the un-upgraded base.

### `[[progression/web-anticheat-and-console-differ]]` — UPHELD [A2] (2 critics)

Two more web-vs-android divergences in the same function: the web anti-cheat rejects a jump of more than 2 levels (android: 5 or more), and the web build has consoleEnabled constant-folded to a literal false, so every guard written !consoleEnabled is unconditional in v0.717.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2042, :2043, :2049 vs reference/decompiled/shs3_android/scripts/StatsManager.as:1619, :1625, :336`
- **Lane impact:** L4: the multi-level anti-cheat threshold is 2, not 5, for the rebuild target. GAUNTLET-WIDE decoding rule: whenever an android guard reads `!consoleEnabled && X`, the web equivalent is plain `X` — do not port the flag, and do not treat an android console/admin path as evidence that a behaviour was reachable in v0.717.

### `[[progression/web-calcxp-parity]]` — UPHELD [A2] (2 critics)

The WEB v0.717 build has its own calcXP / greyLevel / zeroDifference, byte-parallel with the Android twin, so the entire XP-income model — cited android-only by the survey — is now sourced from the actual rebuild target.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:113-129 (greyLevel), :131-178 (zeroDifference), :180-202 (calcXP)`
- **Lane impact:** L4: removes the single biggest sourcing risk in the survey. Given this lane's own ruling that shs3_android v0.682 is differently tuned, an android-only cite for a numeric model was a live hazard; the web twin is identical here, so the XP-income model may be ported as-is with a WEB cite.

### `[[progression/web-level-cap-is-const]]` — UPHELD [A2] (2 critics)

On the shipped WEB build levels 81–99 were structurally unreachable, because levelCap is a compile-time const there while Android makes it a mutable var.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:362 vs reference/decompiled/shs3_android/scripts/StatsManager.as:76; dead band at §1t68s0§.as:176-179`
- **Lane impact:** L4: partially closes progression/levels-81-99 for v0.717 specifically — expArray[81..98] is dead headroom in the web build by construction, not merely by observation. The 'were they EVER reachable' question survives only across versions.

### `[[progression/web-only-maxdueltokens-40]]` — UPHELD [A2] (2 critics)

MAXDUELTOKENS is 40 in the web build and 30 in the Android build — a further load-bearing proof that shs3_android is differently tuned, and it is the value web levelUp() actually refills to.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:200 and :2079 vs reference/decompiled/shs3_android/scripts/StatsManager.as:166 and :1690`
- **Lane impact:** L4: the 'duel tokens refill on level-up' extension is right, but the value is 40, not 30. Cross-lane to L11 meta-social / duel economy: the web duel-token budget is 40.

### `[[progression/web-payload-is-v0717]]` — UPHELD [A2] (2 critics)

The web payload's own version stamp is 0.717 — the 'stamps v0.706 under a v0.717 preloader' provenance caveat circulating in this lane is unsupported by the decompiled bundles.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36; negative grep across shs3_payload/, shs3_loader/, shs3_stage2/, shs3_stage3/`
- **Lane impact:** Gauntlet-wide — protects every 'web v0.717' label in this unit's cites, and removes a provenance discount asserted at docs/gauntlet/L0/CLAIMS.md:1213 ('the web payload stamps v0.706 under a v0.717 preloader, so it is the last live payload, not provably the filmed build'). The only version literal in the payload is 0.717.

### `[[progression/web-stance-triangle-has-a-penalty-branch]]` — UPHELD [A2] (2 critics)

The WEB build's stance rock-paper-scissors is symmetric — x1.2 on a favourable matchup AND x0.9 on an unfavourable one — whereas the Android build has only the x1.2 branch; a third concrete proof that Android is differently tuned.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3788-3799 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3708`
- **Lane impact:** CROSS-LANE GIFT to L1 combat-core's damage pipeline: the stance triangle is x1.2 / x1.0 / x0.9, applied BEFORE the flat DEF subtraction. Also a standing warning for every lane — a formula present in both builds can still differ in structure, not just in constants.

### `[[progression/xp-array-outruns-level-cap]]` — UPHELD [A2] (1 critic)

The shipped XP table has 99 entries (indices 0-98) while the level-cap constant two lines above it is 80. §1t1523s0§.as:362 'public static const §1t9470s0§:int = 80;' immediately precedes §1t1523s0§.as:364's 99-entry array. Either the cap was lowered without trimming the table, or thresholds past 80 are reachable in some mode (rebirth/Dan?). Worth resolving before anyone hard-codes a 99-level ladder off the array.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:362 and :364`
- **Build:** web v0.717 (android twin StatsManager.as:78 carries the same array)
- **Lane impact:** L3 progression: promote L1-L80 to CONTRACT from the array, but flag indices 81-98 as unexplained rather than silently shipping a level cap of 98.

### `[[progression/xp-income-web-parity]]` — UPHELD [A2] (2 critics)

The XP-income model was cited entirely from the differently-tuned Android v0.682 build; the WEB v0.717 parity it needed is present and byte-for-byte identical, so the claim survives on web evidence too.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:185-208 (calcXP), :120-128 (grey level), :131-182 (zeroDifference); §1t4574s0§.as:39 (mob base); §1t4902s0§.as:26 (duellist base)`
- **Lane impact:** L4 — hardens progression/xp-income-model against the very build-drift risk the same survey proved is real (per-point magnitudes). Record the web line numbers; the model may now be ported as CONTRACT from the filmed build rather than inferred from android.

### `[[questdata/frame-corroborates-objective]]` — UPHELD [A1] (2 critics)

The divergence is revision-level, not wholesale: a v0.717 on-screen objective string matches the extracted questdata title character-for-character, so A2 quest cites are trustworthy as on-screen copy — they are simply not proven exhaustive.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-24/frames/frame_0003.jpg (1024x576, read full-frame; objective text upper-left ~x60-300, y135-175) vs reference/extracted/questdata.xml:4160`
- **Lane impact:** L9 quests-story: bounds run-1's Q-02 in the other direction and validates the §6 dialogue overturn. Free by-product handed to L3 progression: the same crop reads the L6->L7 XP threshold as 12150, and reference/frames/broad_survey/Nr4fQstqHDM_0060.jpg reads L7->L8 = 16550 — two real points on the L11-80 curve the ledger calls likely unrecoverable.

### `[[string-table/war-room-gate-has-a-dan-escape-hatch]]` — UPHELD [A2] (1 critic)

The war room is NOT a flat level-10 gate: the guard is `getLevel() < 10 && getPlayerStats(STAT_DAN) == 0`, so any rebirthed character (Dan >= 1) enters at any level — and two further gates the copy never mentions bracket it, a per-character War-Room disable flag and an offline-mode block.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:1260-1272`
- **Build:** android v0.682
- **Lane impact:** progression + meta-social + rebirth-elements — refutes string-table/level-gates-war-room-10-duel-2's headline rule. The level-10 message is copy, not the rule; the rule is level-10 OR any Dan. This also hands rebirth a second concrete privilege beyond the banked gold faucet. The duel gate IS flat and is confirmed in the same file at :1172 `else if(StatsManager.getLevel() < 2)`. Zero corpus hits for 'STAT_DAN) == 0'.

---

## What is NOT here, and why

Refuted claims and claims no critic ever judged (§0: an unjudged claim is a LEAD)
are excluded by `buildLedgerPackets.py`. If you believe something is missing, say so
in your return — do not reconstruct it from memory, and do not cite it.
