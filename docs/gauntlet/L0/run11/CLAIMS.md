# L0 — salvaged claim set (raw surveyor output)

> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED
> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).
> Banked: 0 surveys · 16 critic reviews · 46 claims · 409 verdicts.

## unassigned — re-scored ?

### `s26d/war-room-battlefield-board-is-a-hardcoded-6x6-grid` — HELD [A2] ⚑ OVERTURNS LEDGER

The War-Room battlefield board's dimensions are NOT server-supplied and ARE recoverable from the shipped code. WarHexUI.as:175-176 set 'this.ht = 6;' and 'this.wt = 6;' as plain literals, and grep over the whole file shows these are the ONLY two assignments to wt or ht anywhere in it. The hex layout is hardcoded at the same pitch: :253 'hex.x = 90 + xpos * 55;' :254 'hex.y = 92 + ypos * 55;', with the terrain layer using the identical transform at :206-207. The pipe-delimited server string parsed at :231-252 carries per-hex STATE only - a 7-field record of xpos, ypos, owner, side and strength. This overturns hunter-s26a/war-room-battlefield-board-is-server-dimensioned and partially closes REBUILD_READINESS ② 'War-Room map topology (board/adjacency)': the board is a 6x6 grid at 55 px pitch with origin (90, 92), and its adjacency follows from that.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:175-176, :206-207, :231-232, :239, :253-254`
- **Quote:** WarHexUI.as:175 'this.ht = 6;' :176 'this.wt = 6;' (the only two wt/ht assignments in the file) · :229 'this.hexArray.push(new Array(this.ht));' · :253 'hex.x = 90 + xpos * 55;' :254 'hex.y = 92 + ypos * 55;' · :206 'warTerrain.x = 90 + i * 55;' :207 'warTerrain.y = 92 + j * 55;' · :239 'if(strArray.length == 7)'
- **Overturns:** "② War-Room **map topology** (board/adjacency)"
- **Lane impact:** L-meta-social: the battlefield board can be specified today - 6x6, 55 px pitch, origin (90, 92). Only the per-hex state feed is server-side.

### `cite-audit/carry-weight-pvp-exemption-covers-only-five-of-eight-sites` — HELD [A2]

The carry-weight travel guard is NOT uniformly exempted inside PvP rooms. Of the sixteen findWeight() > getCarryingWeight() guards in the Android build, only eight carry the !GameEngine.isPvPRoomMode() prefix. Among the eight sites cited by string-table/weight-gate-is-a-travel-guard-in-code, five have the exemption (Obj_TownSign:44, Obj_DirectionSign:159, Obj_PathBush:110, Obj_HiddenTemple:187, Obj_DragonDancePath:275) and three do NOT (Obj_Hut:70, NodeUI:379, InteractUI:1730). Three further unexempted sites exist that the claim does not cite: InventoryUI:440, CraftingUI:233 and BankUI:348. So a rebuild that globally disables weight checks in duel rooms will let players hut-travel, node-explore, open the interact menu, equip, craft and bank over the cap.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_Hut.as:70, NodeUI.as:379, InteractUI.as:1730 (bare guards) versus Obj_TownSign.as:44, Obj_DirectionSign.as:159, Obj_PathBush.as:110, Obj_HiddenTemple.as:187, Obj_DragonDancePath.as:275 (PvP-exempt); my own grep -rn 'findWeight() > StatsManager.getCarryingWeight()' over reference/decompiled/shs3_android/scripts returns 16 hits across 11 files`
- **Quote:** Obj_Hut.as:68-70 `override public function interact() : * { if(StatsManager.findWeight() > StatsManager.getCarryingWeight())` - no isPvPRoomMode test. Obj_TownSign.as:42-44 `override public function interact() : * { if(!GameEngine.isPvPRoomMode() && StatsManager.findWeight() > StatsManager.getCarryingWeight())` - exempt.
- **Lane impact:** items-equipment + world-exploration. Corrects the blanket 'weight is not enforced inside duel rooms' half of string-table/weight-gate-is-a-travel-guard-in-code. The exemption is per-call-site and covers the outdoor movement objects only.

### `cite-audit/duel-hud-second-bar-is-chi-not-ap` — HELD [A2]

The blue bar in the duel HUD is the CHI bar, not an AP bar. BattleUI declares exactly two meters - hpbar and chibar - and drives them at :249 and :256; there is no AP bar in battle mode (AP lives on the overworld HUD, OverworldHUD.as:211 apbaricon). The reference frames label it directly: reference/frames/session11/stance-reach shows 'CHI 31/31' under the same widget and reference/frames/zFtCaTO0_1M/seg-11/frames/frame_0020.jpg shows 'CHI 15/15'. Claim ui-hud/buff-row-is-frame-confirmed-A1 enumerates it as 'a blue AP bar reading 26/26'; the reading 26/26 is right, the label is not.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:16 public var chibar:MovieClip, :24 public var hpbar:MovieClip, :249 hpbar.bar.scaleX = hp / maxhp, :256 chibar.bar.scaleX = chi / maxchi; corroborated visually in my own crop (0,860)-(700,1080) x2 LANCZOS of reference/frames/session11/stance-reach/B_t851.867_LIGHT_ring_blue_CHANGE-STANCE_tooltip.png`
- **Quote:** BattleUI.as:16 `public var chibar:MovieClip;` | :24 `public var hpbar:MovieClip;` | :249 `this.hpbar.bar.scaleX = hp / maxhp;` | :256 `this.chibar.bar.scaleX = chi / maxchi;` - no apbar field exists in the class.
- **Lane impact:** ui-hud. A rebuild that wires the duel HUD's second bar to AP will drain it on world actions instead of on skills. The overworld HUD is the build with an AP bar; the battle HUD is HP + Chi.

### `cite-audit/frame-to-stage-vertical-transform-is-contested-and-uniform-wins` — HELD [A1]

This packet publishes TWO incompatible frame-to-stage vertical transforms for video B and both are marked HELD. Model A (ui-hud/frame-to-stage-mapping-is-anisotropic, ui-hud/slot-strip-matches-all-three-constants): offsetY = 0, vertical scale 1080/480 = 2.250, horizontal 2.270, the 0.9% difference blamed on a re-encode stretch. Model B (ui-hud/frame-to-stage-transform, ui-hud/slot-box-measurement-corrected): a single uniform scale ~2.269 with origin (52, -5.0), i.e. ~5 px cropped off the top and bottom because 480 x 2.269 = 1089 > 1080. On my own measurement of the cited frame, Model B is the better-supported one and Model A should not be adopted as the lane convention. Evidence: (1) the pillarbox is exactly 52 px of black on BOTH sides, so content = 1816 px = 800 x 2.270 - a genuine 2.250 fit would leave 60 px pillarboxes, which the frame does not show; (2) under Model B the empty slot box is exactly 48 x 48 game px centred at exactly game (640, 450), matching BattleUI.as:133-134 to the integer, while under Model A it is 48.4 x 48.0 (non-square) centred at 451.8; (3) the frame box measures square (112 x 112 at threshold 150), which an anisotropic mapping would not produce. Model A is not disproved - the ~1 px thresholds leave room - but it carries an unreconciled 1.8 game-px residual against a code-known constant and Model B carries 0.2.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png - my own full-frame content-extent scan (max-channel > 25) giving cols 52..1867 (1816 px) and rows 0..1079, plus max-channel border scans of the empty skill-slot box at thresholds 150/170/190 giving cols 1448-1559 / 1449-1558 and rows 961-1072 / 963-1071, centre (1503.5, 1016.5); against reference/decompiled/shs3_android/scripts/BattleUI.as:133-134 skillSlotButton.x = 760 - i * 60 and .y = 450`
- **Quote:** my scan: content cols 52 1867 width 1816 / content rows 0 1079 ; thr 150 emptybox cols 1448 1559 rows 961 1072 ; thr 190 emptybox cols 1449 1558 rows 963 1071. Model B check: 450 * 2.270 - 5.0 = 1016.5 (measured 1016.5); 426 * 2.270 - 5.0 = 962.0 and 474 * 2.270 - 5.0 = 1071.0 (measured 962/963 and 1071) -> a 48.0 game-px box. Model A check: 1016.5 / 2.25 = 451.78 and box height 109 / 2.25 = 48.4 vs width 109 / 2.270 = 48.0.
- **Lane impact:** Cross-lane measuring convention (ui-hud, combat-core, art-anim, world-exploration). Two conflicting rules are about to enter the ledger from the same packet; only one can be the lane's transform. Adopt frame_x = 52 + 2.2689 * game_x and frame_y = -5.0 + 2.2689 * game_y for video B until a second code-known y constant is found to break the tie - BattleUI carries only one (y = 450), which is why one measurement cannot separate scale from offset.

### `cite-audit/gameengine-283-290-does-not-hold-the-fit-branch` — HELD [A2]

The fit-branch quoted by ui-hud/frame-to-stage-mapping-is-anisotropic is not at reference/decompiled/shs3_android/scripts/GameEngine.as:283-290. Lines 283-290 hold the tail of the friend-bar if-block, its else clause setting stageShowingFriendBar = false, and the newScale/offsetX declarations. The quoted assignments (newScale = stageMC.stageHeight / originalHeight; offsetX = (stageMC.stageWidth - originalWidth * newScale) / 2; offsetY = 0; fitWidth = false) are at :302-305, inside the else of the if(originalAspectRatio >= newAspectRatio) test at :293. Recorded so the ledger carries the right lines: resizeHandler head :267, constants :269-271, aspect gate :275, fit-width branch :295-298, fit-height/pillarbox branch :302-305, StatsManager writes :306-311.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:283-290 (read directly: `}` `}` `else` `{` `StatsManager.stageShowingFriendBar = false;` `}` `var newScale:Number = 1;` `var offsetX:Number = 0;`) versus :302-305 (the quoted fit code)`
- **Quote:** GameEngine.as:302-305 `newScale = stageMC.stageHeight / originalHeight;` `offsetX = (stageMC.stageWidth - originalWidth * newScale) / 2;` `offsetY = 0;` `fitWidth = false;` - preceded at :293 by `if(originalAspectRatio >= newAspectRatio)`.
- **Lane impact:** Cite hygiene for every lane quoting the resize handler. Three claims in this packet cite this function at three different ranges (:267-280, :271-279, :283-290) and only the first two overlap the code they quote.

### `cite-audit/lang-bin-id-column-is-contiguous-every-gap-is-in-resname` — HELD [A2]

Every 'gap' this lane has discussed in the Android language table is in the resname column, never the id column. Measured directly: reference/extracted/android/118_Mobile_Lang_EN.bin holds 2,555 <trans-unit> elements whose id attribute is CONTIGUOUS 0..2554 with ZERO gaps (set equality tested), while the numeric resname attribute has only 1,905 distinct values with 12 gaps, the largest being 1044 -> 2000. Because LangManager.getString resolves through fl.lang.Locale by resname (LangManager.as:78), the resname column is the lookup key space and the id column is inert. Any ledger sentence that says 'the table skips ids N..M' is checkable-false against the raw file and must say 'skips resnames'. Separately, docs/gauntlet/L0/index/strings.json is missing TWELVE numeric resnames the raw blob carries - 665, 820, 5002, 5017, 5022, 5023, 5024, 5025, 5034, 7003, 7041, 9000 - so 'absent from strings.json' is weaker still than 'absent from the table'.

- **Cite:** `reference/extracted/android/118_Mobile_Lang_EN.bin (my own utf-16-le parse: 2555 trans-unit ids, set(ids) == set(range(2555)) -> True; 1905 distinct numeric resnames; resname gaps (211,222)(356,366)(865,867)(880,1000)(1044,2000)(2014,3000)(3018,4000)(4427,5000)(5122,6000)(6146,7000)(7095,8000)(8159,9000)) versus docs/gauntlet/L0/index/strings.json (1893 numeric keys); reference/decompiled/shs3_android/scripts/LangManager.as:78`
- **Quote:** id contiguous 0..2554? True | resname gaps: [(211,222),(356,366),(865,867),(880,1000),(1044,2000),(2014,3000),(3018,4000),(4427,5000),(5122,6000),(6146,7000),(7095,8000),(8159,9000)] | in bin not in strings.json: [665, 820, 5002, 5017, 5022, 5023, 5024, 5025, 5034, 7003, 7041, 9000]
- **Lane impact:** string-table lane and every lane resolving a name. Sharpens strings/the-android-lang-table-skips-ids-881-999-entirely, whose conclusion is right but whose stated evidence names the wrong column. Also flags a real index defect: strings.json is not a complete image of the blob, so a resname lookup that misses in strings.json must be re-checked against the raw bin before anyone calls it web-only.

### `cite-audit/shs3-swf-loader-is-cws-v10` — HELD [A3]

reference/preservation/shs3.swf is CWS version 10, not version 17. Claim ui-hud/800x690-is-the-embed-stage-800x480-is-the-viewport reports 'shs3.swf header: CWS v17' inside a block presented as its own byte parse; every other field in that quote is exact (RECT 0,16000,0,13800 twips = 800.0 x 690.0, frameRate 0x1800 = 24.0, frameCount 2) but the version byte is the payload's, not the loader's. The sibling claim ui-hud/framerate-and-stage-rects-bytechecked reports v10 correctly. Recorded so no ledger row carries a wrong byte inside a byte-check: shs3.swf CWS v10, shs3preloader.swf CWS v10, shs3_payload_decoded.swf CWS v17, shs3_android_payload_decoded.swf CWS v26 - all four at 24.000 fps.

- **Cite:** `my own SWF header parse (signature bytes, version byte, zlib inflate, RECT bit-unpack, frameRate fixed8, frameCount uint16) of reference/preservation/shs3.swf, reference/preservation/shs3preloader.swf, reference/decrypted/shs3_payload_decoded.swf, reference/decrypted/shs3_android_payload_decoded.swf`
- **Quote:** shs3_payload_decoded.swf CWS v17 rect twips [0, 16000, 0, 13800] -> px [0.0, 800.0, 0.0, 690.0] fps 24.000 frames 6 | shs3_android_payload_decoded.swf CWS v26 rect twips [0, 16000, 0, 9600] -> px [0.0, 800.0, 0.0, 480.0] fps 24.000 frames 6 | shs3.swf CWS v10 rect [0.0, 800.0, 0.0, 690.0] fps 24.000 frames 2 | shs3preloader.swf CWS v10 rect [0.0, 800.0, 0.0, 690.0] fps 24.000 frames 2
- **Lane impact:** ui-hud cite hygiene. The conclusion (both loader and payload declare an 800x690 stage at 24 fps) is unaffected; only the version byte was mis-transcribed.

### `cite-audit/updatebuff-ladder-is-thirteen-not-eleven-and-appends-a-timer` — HELD [A2]

OverworldHUD.updateBuff's hard-coded ladder has THIRTEEN literals, not eleven, and the rendered line appends a live countdown. StatsManager declares 13 BUFF_* constants and the else-if chain covers all of them: the eleven the packet reports (150% XP / DAMAGE / DEFENSE / SPEED, 200% AP REGEN, 200% DUEL TOKEN REGEN, more coins, rare loot, Anti-Spam Muting, Anti-Spam Full Muting, Hell Imprisonment) plus 'Injured' at :1444 and 'Moderator' at :1448, both past the cite window ui-hud/NEW-hud-buff-line-is-a-hardcoded-string-table used. The HUD text is not the bare label either: :1451 renders buffstr + " <font color='#FFFFFF'>" + getTimeString(duration) + "</font>", so every buff row carries an h:mm:ss remaining-time suffix in white.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:1444 buffstr = "Injured", :1448 buffstr = "Moderator", :1450-1451 bufftext.visible = true and bufftext.htmlText = buffstr + " <font color='#FFFFFF'>" + this.getTimeString(duration) + "</font>"; StatsManager.as declares 13 BUFF_*:int constants (my own grep -c)`
- **Quote:** :1442 `else if(bufftype == StatsManager.BUFF_INJURED)` :1444 `buffstr = "Injured";` :1446 `else if(bufftype == StatsManager.BUFF_MODERATOR)` :1448 `buffstr = "Moderator";` :1451 `this.bufftext.htmlText = buffstr + " <font color='#FFFFFF'>" + this.getTimeString(duration) + "</font>";`
- **Lane impact:** ui-hud + meta-social. Two more buff states nobody holds (an Injured status and a Moderator badge), and the buff row's real shape is label + white countdown, not label alone - which matches the '150% DAMAGE 21m23s timer' filename at reference/frames/session11/stance-reach/B_t852.000_BALANCED_150pct-DAMAGE-21m23s-timer.png.

### `cite-audit/web-skill-1077-has-a-live-runtime-case` — HELD [A2]

The four web-only skill ids are not inert declarations: at least 1077 has a full runtime implementation in the web SkillManager. §1t120s0§.as:344 opens `case §1t10176s0§:` (= 1077) and :347-351 gate it on getStat(2501) < 8 then changeStat(2501,-8) - an eight-kunai ammo cost, double Windmill Shuriken's four and eight times a trap's one. Nothing in reference/extracted/skilldata.xml (max game-skill id 1073) or the Android SkillManager (50 ids, stopping at 1073) holds it, so this is a v0.717 skill with executable behaviour, no data row and no name string.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t120s0§.as:114 (§1t10176s0§ = 1077), :344 (case), :347 (< 8 guard), :351 (changeStat(2501,-8)); against my own parse of reference/extracted/skilldata.xml (127 <id> rows, none above 1073 except 1500/1501) and reference/decompiled/shs3_android/scripts/SkillManager.as (50 ids, max 1073)`
- **Quote:** §1t120s0§.as:344 `case §1t10176s0§:` :347 `if(§1t1523s0§.§1t9714s0§(2501) < 8)` :351 `§1t1523s0§.§1t9713s0§(2501,-8);` - the complete web ammo ladder is :270 (-1), :323 (-4), :351 (-8), :514 (-1).
- **Lane impact:** skills-meters + economy. Strengthens skills-meters/web-only-skills-1074-1077 from 'declared' to 'implemented' for 1077 and puts a fourth rung on the kunai-ammo cost curve (1 / 4 / 8). The remaining question is whether 1074-1076 also carry runtime cases; only 1077 is settled here.

### `housekeeping/questdata-text-word-count-is-40119` — HELD [A3]

The questdata <text> prose word count is 40,119 words across 3,307 <text> nodes (ElementTree itertext, which flattens the inline <br/> and <font> children). The 40,135 figure circulating as a 'correction' comes from a raw regex over the <text> blocks that counts the 14 '<br/>' and 2 '<font ...>/</font>' markup tokens as words. 40,135 is therefore not a correction of 40,119 — it is a worse measurement of the same thing.

- **Cite:** `reference/extracted/questdata.xml — two counts I ran side by side: sum over root.iter('text') of len(''.join(t.itertext()).split()) = 40119; sum over re.findall(r'<text>(.*?)</text>', raw, re.S) = 40135 over the same 3,307 blocks`
- **Quote:** itertext words 40119 · regex blocks 3307 raw words 40135
- **Lane impact:** L9 quests-story content budgeting: use 40,119 for prose volume. Trivial in isolation, but it is being passed around as a correction, and a 'correction' that counts HTML tags as words will keep getting re-corrected by the next unit that measures it properly.

### `newfind/frame-confirms-web-maxdueltokens-40` — HELD [A1]

The MAXDUELTOKENS divergence is not code-only — it is visible in the footage, which makes it the second cross-build parity datum in the repo that the frames decide. reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0005.jpg is a shop screen whose top bar reads '40/40' beside the skull glyph labelled 'DUEL TOKENS'. Web §1t1523s0§.as:200 declares '§1t9400s0§:int = 40;' and levelUp consumes it at :2079; android StatsManager.as:166 declares 'MAXDUELTOKENS:int = 30;' and levelUp consumes it at :1691. 40 is on screen, so the longplay is the web build and 40 is the number to port. The same frame's top bar also settles the currency taxonomy: a grey-ingot glyph labelled COINS (630) and a yellow-oval glyph labelled GOLD (2) are two separate counters, and GOLD is the premium currency itemdata denominates in <heavenlyprice>.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0005.jpg (1024x576; top-bar crop (0,0)-(1024,120) x3 LANCZOS) vs reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:200, :2079 and reference/decompiled/shs3_android/scripts/StatsManager.as:166, :1691`
- **Quote:** ON SCREEN: 'BUY' title, then 'COINS 630' (grey-ingot glyph in a green diamond), 'GOLD 2' (yellow-oval glyph), 'GET GOLD' button, 'REFRESH SHOP' with a yellow-oval cost glyph, and at the right '40/40' over 'DUEL TOKENS'. CODE: web §1t1523s0§.as:200 'internal static const §1t9400s0§:int = 40;' consumed :2079 '§1t9712s0§(§1t9416s0§,§1t9400s0§);' — android StatsManager.as:166 'internal static var MAXDUELTOKENS:int = 30;' consumed :1691 'setStat(STAT_DUELTOKENS,MAXDUELTOKENS);'. THE FRAME PICKS THE WEB CONSTANT.
- **Lane impact:** L4 progression + L0 meta-social/economy: upgrades progression/duel-token-refill-mismatch from an android-only observation to a build-decided one — port 40, not 30 — and gives the economy lane a frame-anchored proof that the two on-screen currencies are COINS and GOLD (premium), which is the currency <heavenlyprice> is in.

### `newfind/offline-save-branch-writes-nineteen-fields-not-fourteen` — HELD [A2]

The offline SharedObject schema is bigger than the packet's persistence claim states. QueryManagerBase.as's offlineMode branch does not end at :2925 — it continues to :2930 and writes five more fields: activeQuestList (:2926), completedQuestList (:2927), playerlocation (:2928), taunt (:2929) and friends (:2930). Counting the fourteen at :2912-2925 plus these, the branch serialises NINETEEN fields to SharedObject.getLocal(cookieName + '_' + charname). A single-player persistence schema transcribed from :2912-2925 alone would silently drop the entire quest state, the player's world location, the taunt and the friend list — i.e. a reload would put the character back with no active or completed quests and no saved position.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerBase.as:2905-2931, esp. :2926-2930`
- **Quote:** :2926 'sharedObject.data.activeQuestList = StatsManager.getActiveQuestString();' :2927 'sharedObject.data.completedQuestList = StatsManager.getCompletedQuestString();' :2928 'sharedObject.data.playerlocation = StatsManager.getLocationString();' :2929 'sharedObject.data.taunt = StatsManager.getTaunt();' :2930 'sharedObject.data.friends = StatsManager.getFriendListString();' :2932 'sharedObject.flush();'
- **Lane impact:** L10 persistence: the transcribe-don't-invent conclusion stands, but the range to transcribe is :2912-2930 (nineteen fields), not :2912-2925 (fourteen). Quest state and world location are in the shipped save format.

### `newfind/web-nextstance-drops-the-console-five-cycle-and-gates-on-48` — HELD [A2]

The WEB v0.717 stance-change entry point is a different function from android's, in two ways nobody has claimed. Web §1t99s0§.as:3058-3081 (§1t4472s0§) gates on a HARD reload threshold — ':3060 if(this.§1t4414s0§ < 48) { return; }' — and then cycles only '-1 → Light', Light → Balanced, Balanced → Heavy, Heavy → Light. There is NO StatsManager.consoleEnabled branch anywhere in it, so the five-stance dev cycle (Dual and Reversed) that android MCSPlayer.as:2981-3002 exposes does not exist in the shipped web build at all. Android also gates differently: ':2977 if(this.reload < this.maxreload / 6) { return; }', which at android maxreload = 120 is 20 ticks, versus web's fixed 48 — and 48 is the same constant the web HUD subtracts in §1t113s0§.as:328, so on web the stance lock releases exactly when the focus bar starts moving.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3058-3081 and :3060 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:2975-3016 and :2977; web HUD constant at §1t113s0§.as:328`
- **Quote:** web §1t99s0§.as:3060 'if(this.§1t4414s0§ < 48)' :3064 'if(this.stance == -1)' :3068 'else if(this.stance == §1t12220s0§)' :3072 'else if(this.stance == §1t12221s0§)' :3076 'else if(this.stance == §1t12222s0§)' — no consoleEnabled test in the function || android MCSPlayer.as:2977 'if(this.reload < this.maxreload / 6)' :2981 'if(StatsManager.consoleEnabled)' :2993 'this.setStance(DUAL_STANCE);' :2997 'this.setStance(REVERSED_STANCE);'
- **Lane impact:** L5 combat-core + L8: a seventh counted web-vs-android combat divergence. It hardens progression/player-stance-cycle-is-three for the TARGET build (three is right on web too, but for a different reason than that claim gives), and it supplies the stance-change gate a port needs: 48 reload ticks on web, not maxreload/6.

### `newfind/writ-badge-glyph-is-premium-gold-not-coins` — HELD [A1]

The Writ-of-Release price divergence is a 5x re-tune of ONE currency, not a switch between two. I zoomed the badge on the shop tile in reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0005.jpg (crop (600,190)-(720,230) at 10x) and the glyph beside the '25' is the YELLOW-OVAL glyph, which the same frame's top bar labels 'GOLD' (value 2) — not the grey-ingot glyph labelled 'COINS' (value 630). Since <heavenlyprice> is the premium currency and the android row for item 2203 is baseprice 0 / heavenlyprice 5, the correct statement of the divergence is 25 premium Gold on web against 5 premium Gold in the android data. That also removes an apparent contradiction: a coin price of 25 would be impossible against baseprice 0, so nothing here requires the web itemdata to have changed <baseprice>.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0005.jpg (badge crop (600,190)-(720,230) x10 LANCZOS; top-bar crop (0,0)-(1024,120) x3 LANCZOS) vs reference/extracted/itemdata.xml:2328-2333`
- **Quote:** ON SCREEN: badge reads '25' followed by a yellow-oval coin glyph identical to the top bar's 'GOLD' counter glyph; the top bar's other counter is a grey ingot in a green diamond labelled 'COINS'. DATA: itemdata.xml:2328 '<id>2203</id>' :2332 '<baseprice>0</baseprice>' :2333 '<heavenlyprice>5</heavenlyprice>'. THE FRAME WINS on the amount; the currency is the same on both sides.
- **Lane impact:** L4/L0 economy: keeps parity/writ-of-release-is-25g-in-web-and-5g-in-android's 5x gap intact while correcting its currency framing, so the config row reads heavenlyPrice 25 for v0.717 rather than a coin price of 25 against a baseprice of 0.

### `nf/four-classes-run-the-12-frame-ai-cadence` — HELD [A2]

The 12-frame retarget cadence is set by four classes, not one: MCSPlayer (EnemyPlayer's own base), EnemyPlayer, EnemyElite and FriendlyElite. Every Enemy* class that extends NPC directly — Archer, Katana, Knife, Ninja, Ogre, Shield, Spear, SpearElite, Zombie, Goblin, JiangSi, KanjiGuardian, NianMonster, SorcererBoss, TrainingDummy and the animal roster — inherits NPC.as:22's 24. The two-cadence model is right; 'only EnemyPlayer overrides it' is not.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:22; MCSPlayer.as:165; EnemyPlayer.as:52; EnemyElite.as:3,18; FriendlyElite.as:3; EnemyKnife.as:3`
- **Quote:** NPC.as:22 internal var aiCounterMax:int = 24; · MCSPlayer.as:165 aiCounterMax = 12; · EnemyPlayer.as:52 aiCounterMax = 12; · EnemyElite.as:18 aiCounterMax = 12; · FriendlyElite.as:18 aiCounterMax = 12; · EnemyElite.as:3 public class EnemyElite extends EnemyPlayer · EnemyKnife.as:3 public class EnemyKnife extends NPC
- **Lane impact:** L-enemies-ai — an implementer wiring '24 for everything except EnemyPlayer' makes elites half as reactive as the original.

### `nf/payload-xml-static-textfields-are-authoring-placeholders` — HELD [A2]

Static DefineEditText copy inside reference/extracted/payload.xml is AUTHORING PLACEHOLDER, not shipped v0.717 UI copy, for every field LangManager writes to at runtime. The war-rules dialog proves it: payload.xml:528040-528084 embeds six title/body pairs reading 'War room rules 1/6'..'6/6' (characterIDs 744-755), and the DefineSpriteTag that owns them is spriteId 756 at :528088 — which is precisely the symbol the shipping class embeds ([Embed(symbol="symbol756")] at §1t7924s0§.as:7). That class declares max:int = 7 (:23) and overwrites warrulestitle.text / warruleswords.text from getString() on every page turn (:96-123, case 7 at :121-123). This is the same class of trap as ui_strings.txt:215's 'soldier ... 15/60'. Treat payload.xml static text as a dead draft unless no code writes that field.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:7,23,96,121-123; reference/extracted/payload.xml:113188,528040,528088,2653462`
- **Quote:** §1t7924s0§.as:7 [Embed(source="/_assets/assets.swf", symbol="symbol756")] · :23 internal var max:int = 7; · :121-123 case 7: this.warrulestitle.text = §1t1521s0§.getString(11016); this.warruleswords.text = §1t1521s0§.getString(11017);  ||  payload.xml:528040 initialText "War room rules 1/6 &nbsp;(joining a battle)" characterID="744" · :528088 <item type="DefineSpriteTag" frameCount="6" spriteId="756">
- **Lane impact:** L0 meta-social and every lane porting UI copy — this is what kills the 'the filmed build is neither artifact' reading, and it is the general rule that prevents the next agent from porting a 6-page rulebook, 'soldier' rank, or '/60' move cap out of a placeholder.

### `nf/slashusage-48-floor-is-duplicated-on-the-npc-path` — HELD [A2]

The 48 floor that kills the lone <slashusage>24</slashusage> row is applied TWICE, not once. Besides StatsManager.getSlashUsage(), XMLNpc.initDuelist() clamps the same value for every AI duelist. So 24 is unreachable for both the player and every NPC, and no path in either build can produce a slash budget below 48.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLNpc.as:360-364; reference/decompiled/shs3_android/scripts/StatsManager.as:1921-1930`
- **Quote:** XMLNpc.as:360-364 this.slashUsage = itemdata.slashusage; if(this.slashUsage < 48) { this.slashUsage = 48; }
- **Lane impact:** L1 combat core — hardens items-equipment/slashusage-24-is-dead from 'dead on the player path' to 'dead everywhere'.

### `nf/territory-and-hex-clan-palettes-differ-on-only-two-sides` — HELD [A2]

The two war UIs do not use different hues for all four clans — only for two. Sides 1 and 4 are identical across both (0xFF0000 red, 0xFFFF00 yellow). Side 2 is #00FF00 in the territory map but 0x009900 in the hex UI, and side 3 is #00FFFF vs 0x0066FF. So the palette choice a renderer has to make is confined to the green and cyan clans.

- **Cite:** `reference/decompiled/shs3_android/scripts/TerritoryData.as:696,700,704,708; WarHexUI.as:1077,1081,1085,1089`
- **Quote:** TerritoryData.as:696/700/704/708 -> '#FF0000' / '#00FF00' / '#00FFFF' / '#FFFF00' · WarHexUI.as:1077/1081/1085/1089 -> 16711680 (0xFF0000) / 39168 (0x009900) / 26367 (0x0066FF) / 16776960 (0xFFFF00)
- **Lane impact:** L-art + L0 meta-social — sharpens meta-social/side-to-clan-bound-in-code from 'the two UIs disagree' to exactly which two sides disagree.

### `nf/war-turn-timer-bracketed-on-film` — HELD [A1]

The one-hour war turn is confirmed on film by two consecutive frames, not one: seg-29 frame_0019 reads 'NEXT TURN IN 1:00:00' and frame_0020 reads 'NEXT TURN IN 59:58'. That brackets WARMOVEINTERVAL = 60*60 as a full-hour countdown that starts at exactly 1:00:00, which no single frame establishes.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-29/frames/frame_0019.jpg and frame_0020.jpg (1024x576, bottom-right crop (0.60,0.86)-(0.98,0.94) upscaled ~2.4x LANCZOS); reference/decompiled/shs3_android/scripts/StatsManager.as:162`
- **Quote:** frame_0019: '2 MOVE(S) LEFT / NEXT TURN IN 1:00:00' · frame_0020: 'NEXT TURN IN 59:58' · StatsManager.as:162 internal static var WARMOVEINTERVAL:int = 60 * 60;
- **Lane impact:** L0 meta-social — corrects the frame attribution in meta-social/rank-ladder-a1-confirmed and upgrades the turn timer from a decompile constant to a frame-confirmed countdown.

### `nf/web-has-a-second-getsellamt-call-site` — HELD [A2]

'ShopUI.as:401 is the sole call site of getSellAmt' is an ANDROID-only fact. The web v0.717 build has two: the shop slot (§1t6519s0§.as:474) and an accumulator at §1t6172s0§.as:417 that sums sell amounts across items. The no-shop-side-level-multiplier inference still stands, but it must be re-derived on the web build rather than inherited from the Android grep.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t6172s0§.as:417; §1t6519s0§.as:474; §1t17s0§.as:1977; reference/decompiled/shs3_android/scripts/ShopUI.as:401`
- **Quote:** §1t6172s0§.as:417 _loc2_ += _loc5_.§1t546s0§(); · §1t6519s0§.as:474 _loc4_.§1t6868s0§(_loc4_.§1t2217s0§().§1t546s0§(),0);
- **Lane impact:** L4 economy — a bulk-sell total exists in v0.717 that the Android-sourced survey has no row for.

### `nf/web-item-weight-modifier-is-id-208` — HELD [A2]

The web-only weight term §1t478s0§ that makes the sell-price input diverge from Android is NOT unresolved: it is the payload of modifier id 208. §1t17s0§.as declares three non-stat modifier ids Android lacks, not one — 206 (xp), 207 and 208 — and 208 carries §1t478s0§ into the save string and into the displayed Weight line. So the web weight shown to the player is (row weight + modifier-208 value), and getWeight() multiplies that sum by quantity.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:18,20,22,60,300,1407,1963,1974; reference/decompiled/shs3_android/scripts/Item.as:6-16`
- **Quote:** :60 internal var §1t478s0§:int = 0; · :22 public static var §1t8741s0§:int = 208; · :300 _loc2_ += §1t8741s0§ + "@" + this.§1t478s0§ + "#"; · :1407 _loc3_ += §1t1521s0§.getString(139) + ": " + (_loc2_.weight + this.§1t478s0§) + "\n"; · :1974 return (this.weight + this.§1t478s0§) * this.§1t484s0§();
- **Lane impact:** L4 economy + L10 persistence — closes the PARTIAL on items-equipment/sell-weight-branch-is-stack-weight and adds ids 207 and 208 to the web save schema alongside the already-claimed 206.

### `nf/web-only-survival-enemy-443-is-named` — HELD [A2]

The enemy id the web survivalmode wave table adds and Android's drops is not an unresolvable number: npc 443 resolves to 'Soldier' in the already-parsed S0-3 table. The web-only late-wave additions are therefore fully named content, not a gap.

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json (npcdata.xml.resolved id 443); reference/extracted/bindata/119_1t4646s0.bin`
- **Quote:** resolved_names.json npcdata.xml.resolved["443"] = {"name": "Soldier"}; web rows read <id>449|454|449|454|443</id> where android reads <id>449|454</id>
- **Lane impact:** L-enemies-ai — the web wave mix can be ported outright; nothing in the 14 divergent rows is blocked.

### `progression/android-never-reassigns-levelcap-either` — HELD [A2]

The const-vs-var contrast between the two builds' level caps is decorative, not functional: shs3_android declares levelCap a mutable var, but every one of its references across the whole script tree is a READ (DungeonGenerator, Item, LootDialog, OverworldHUD, ItemGenerator, QuestGenerator, ...). No code path in either build ever assigns it. So 'levels 81-99 are structurally unreachable' is equally true of v0.682 and v0.717, and the web build's 'const' keyword adds nothing on top of the anti-cheat guard that already rejects any level above the cap.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:76 (declaration) with my own 'grep -rn levelCap reference/decompiled/shs3_android/scripts/' — every hit a comparison or a clamp read, none an assignment; web guard at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2043`
- **Quote:** android StatsManager.as:76 'public static var levelCap:int = 80;'  ·  representative reads: Item.as:295 'if(lvl > StatsManager.levelCap)', OverworldHUD.as:1528 'if(StatsManager.getLevel() >= StatsManager.levelCap)', QuestGenerator.as:840 'if(StatsManager.getLevel() == StatsManager.levelCap)'  —  zero assignments anywhere  ||  web §1t1523s0§.as:2043 'if(!_loc5_ && _loc4_ > §1t9470s0§) { … return false; }'
- **Lane impact:** L4 progression: keep the conclusion (expArray[81..98] is dead headroom, cap 80) but drop the const-vs-var reasoning — it does not distinguish the builds and would mislead anyone auditing the android side for a reachable path above 80.

### `provenance/web-projectilemanager-is-1t1712s0-not-1t112s0` — HELD [A2]

The web v0.717 ProjectileManager is reference/decompiled/shs3_payload/scripts/§1t1712s0§.as (enum 0..47 = 48 projectile types), NOT §1t112s0§.as. §1t112s0§.as is GameStage: it extends MovieClip, opens with a 400-px visible buffer, ends with screenWidth = 800, and its lines 112-130 match android GameStage.as:112-130 value for value (51, 55, 46, 47, 49, 50, 800) — that 0..55 run is the BG_* background enum, not projectiles. The true web-vs-android projectile delta is therefore +1 (48 vs 47), not the +9 asserted in questdata/projectile-type-enum-47-and-web-delta. Identification method: android ProjectileManager's structural signature (imports flash.display.DisplayObject + MovieClip + geom.Point, two leading Vectors, enum value 0 at line 14 and 46 at line 106) matches §1t1712s0§.as uniquely across all 2,768 web classes.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1712s0§.as:1-14 and :108; reference/decompiled/shs3_payload/scripts/§1t112s0§.as:112,:120,:122,:124,:126,:128,:130 vs reference/decompiled/shs3_android/scripts/GameStage.as:112,:120,:122,:124,:126,:128,:130`
- **Quote:** web §1t1712s0§.as:10 'internal static var §1t11271s0§:* = new Vector.<§1t128s0§>();' :12 'internal static var §1t5834s0§:* = new Vector.<§1t129s0§>();' :14 'public static var §1t11272s0§:int = 0;' :108 'public static var §1t11319s0§:int = 47;'  ||  android GameStage.as:120 'public static var BG_BAMBOOFORESTTOWN:int = 55;' :122 'public static var BG_MINE2:int = 46;' :130 'public static var screenWidth:int = 800;'  ==  web §1t112s0§.as:120 '...:int = 55;' :122 '...:int = 46;' :130 'public static var screenWidth:int = 800;'
- **Lane impact:** L7 enemies-ai + L2 skills-meters: the 47-name android projectile enum is still good, but the build-delta number attached to it is not. Anyone porting it must use +1, and any lane using '9 more projectile types in web' as a parity bound should drop it. Gauntlet-wide: obfuscated web class §1t112s0§ is GameStage — add it to the name map so the next unit does not repeat the substitution.

### `s26d/1t8702s0-is-the-dance-PATH-not-the-statue` — HELD [A2]

reference/decompiled/shs3_payload/scripts/§1t8702s0§.as is the web twin of Obj_DragonDancePath, NOT of Obj_DragonDanceStatue. Its three-regime generateSequence (3 / 5 / 6 clicks, seeded node*room+21) is present verbatim in the ANDROID build at Obj_DragonDancePath.as:150-224, so it is not a v0.717 change. getAPUse()->2 and abs(x - other.x) < 100 are shared by the whole Obj_ family and cannot identify a class.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Obj_DragonDancePath.as:150-224 vs reference/decompiled/shs3_payload/scripts/§1t8702s0§.as:150-229; family traits at Obj_DragonDanceStatue.as:224,:240`
- **Quote:** Obj_DragonDancePath.as:150  internal function generateSequence() : String
Obj_DragonDancePath.as:155     var rng:RNG = new RNG(StageManager.getCurrentNode() * StageManager.getCurrentRoom() + 21);
Obj_DragonDancePath.as:156     var nodelevel:int = NodeGenerator.instance.getNodeLevel(StageManager.getCurrentNode());
§1t8702s0§.as:150  internal function generateSequence() : String
§1t8702s0§.as:155     var _loc1_:§1t58s0§ = §1t58s0§.§1t8804s0§(§1t1525s0§.§1t9935s0§() * §1t1525s0§.§1t7341s0§() + 21);
- **Overturns:** "4 Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** Cross-cutting method rule for this lane: an obfuscated web class must be pinned by a method NAME or a unique literal, never by a virtual override that every sibling shares. generateSequence survived obfuscation and pins §1t8702s0§ exactly. The unresolved '<20 / <60' gating value is also now named: NodeGenerator.getNodeLevel(currentNode), and the seed's second term is StageManager.getCurrentRoom().

### `s26d/acc3007-has-no-symbol-in-the-shs3resource-export` — HELD [A2]

The recovered equipment SWF is one accessory short. Decrypting 115_Mobile_SHS3Resource.bin at key 104 and parsing its SymbolClass/ExportAssets tables yields exactly eight acc symbols - acc3000, acc3001, acc3002, acc3003, acc3004, acc3005, acc3006 and acc3008. acc3007 is absent. itemdata.xml carries nine rows in the 3000-3999 accessory band, and MCSItem.as:229 resolves an accessory icon with getMCSComponent("acc",id), falling back to AccessoryDummyIcon at :232 when the lookup misses. So one accessory in the roster renders as the dummy icon rather than its own art, and any 'the roster art is complete' statement needs this exception. It also corrects the sample range 'acc3000-3008' that two findings in this packet use as shorthand for the acc family.

- **Cite:** `reference/extracted/android/115_Mobile_SHS3Resource.bin (decrypted per reference/decompiled/shs3_android/scripts/ResourceManager.as:200-214 at key 104, SymbolClass parsed by me) + reference/decompiled/shs3_android/scripts/MCSItem.as:229, :232`
- **Quote:** MCSItem.as:232 'this.displayItem = new AccessoryDummyIcon();' is the fallback reached from :229 when the acc component lookup returns null. Decoded acc symbol set from 115_Mobile_SHS3Resource.bin = acc3000, acc3001, acc3002, acc3003, acc3004, acc3005, acc3006, acc3008 — 8 symbols, acc3007 absent.
- **Lane impact:** L3 items-equipment / L6 art: one accessory id has no shipped symbol and must be authored or aliased.

### `s26d/aoe-narrow-phase-is-2d-hittest` — HELD [A2]

The AoE dist parameter is a broad-phase HORIZONTAL gate only; the actual hit requires a 2D bounding-box overlap. NPCManager.checkHitObject filters on |dx| < dist and then calls NPC.checkHitObject, which walks the MCS part list and requires mc.hitTestObject(thing). So an elemental ultimate does NOT have unbounded vertical reach -- an airborne or elevated target whose parts do not overlap the projectile clip is missed.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:323-341 reached from NPCManager.as:1444`
- **Quote:** NPCManager.as:1444   if(enemydist * enemydist < distsq && enemy.checkHitObject(thing,damage,checkByAttacker))
NPC.as:323   public function checkHitObject(thing:MovieClip, damage:Damage, checkByAttacker:Boolean = false) : Boolean
NPC.as:326      var max:int = mcs.getPartListLength();
NPC.as:332      if(mc.hitTestObject(thing))
NPC.as:334         if(this.gotHit(mc,damage))
- **Overturns:** "1 what each element does (24 skills' damage/cost/AoE/status - names only)."
- **Lane impact:** combat-core + rebirth-elements: model the hit test as (horizontal broad-phase band of half-width dist) AND (per-part 2D overlap with the projectile clip). Implementing only the band makes every AoE hit airborne targets it should miss; implementing only a circle makes it miss grounded targets at range. The measured half-widths stand: Inferno 600 (BigFireBreathProjectile.as:32), Tsunami 400 (BigWaveProjectile.as:34), Tornado 200 (BigTornadoProjectile.as:33), Earthquake 50 (BigEarthquakeProjectile.as:68).

### `s26d/focus-bar-reads-empty-one-tick-before-the-stance-gate-closes` — HELD [A2]

There is a one-tick window where the web HUD lies about the stance gate, and it comes from a clamp rather than from the offset. §1t113s0§.as:328 computes the bar fill as '(param1 - 48) / (param2 - 48)', then :329-332 clamps a negative result to 0. The 'cannot change stance' label fires at :336 'if(_loc3_ == 0)', so it shows for every raw Focus value <= 48. The actual gates are strict: §1t99s0§.as:3050 'return this.§1t4469s0§() && this.§1t4414s0§ >= 48;' and :3060 'if(this.§1t4414s0§ < 48) { return; }'. At raw == 48 exactly the bar renders empty and prints the cannot-change-stance string while a stance switch is legal and costs the whole 48 (:3162). A 1:1 recreation must reproduce the clamp, not derive the label from the gate predicate.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:328-332, :336 + §1t99s0§.as:3050, :3060, :3162`
- **Quote:** §1t113s0§.as:328 `var _loc3_:Number = (param1 - 48) / (param2 - 48);` :329 `if(_loc3_ < 0)` :331 `_loc3_ = 0;` :336 `if(_loc3_ == 0)` ‖ §1t99s0§.as:3050 `return this.§1t4469s0§() && this.§1t4414s0§ >= 48;` :3060 `if(this.§1t4414s0§ < 48)`
- **Lane impact:** L5 + L8: the empty-bar label predicate is raw <= 48, the stance gate is raw < 48 - they differ at exactly one value.

### `s26d/seg10-frame0020-carries-four-hostiles-not-three` — HELD [A1]

THE FRAME WINS over the head-count in enemies-ai/seg10-wave-spawn-is-witnessed-across-three-frames. Opening frame_0020.jpg at crop (150,250)-(1024,500) upscaled x2 LANCZOS shows FOUR actors each carrying its own green HP bar: a blue-clad figure at the far left partly occluded by the tree, a brown-shirted figure, a bare-chested figure, and the still-fully-airborne figure at right whose bar is already drawn above it. The GUEST-labelled fifth actor is the player. frame_0019 at the same crop shows none of the four - only the player and a red slash trail over corpses in the grass. The three-frame drop-in witness and the 'HP bar attached at spawn, before the actor lands' reading both survive; the count of three does not.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0020.jpg, crop (150,250)-(1024,500) upscaled x2 LANCZOS (and frame_0019.jpg at the same crop)`
- **Quote:** Visibly in the crop of frame_0020: four separate green HP bars over four separate hostiles, the rightmost of them fully airborne with its bar already tracking; the fifth figure carries the yellow 'GUEST' name label and is the player.
- **Overturns:** "(no ledger sentence - this corrects a packet finding before it is absorbed)"
- **Lane impact:** L2 enemies-ai: the filmed seg-10 wave is four hostiles, so any wave-size number taken from this witness must be four.

### `s26d/status-and-duration-DO-ride-the-damage-packet` — HELD [A2]

A status effect and its duration ARE carried on the Damage object. launchType (constructor parameter 3) is the status channel -- Damage.STUN = 6, with isStun()/isDeathTouch()/isKnockDown()/isFly() reading it -- and setStunTime(num, stunPosX) writes a frame duration onto the same object. Flashbang builds exactly that: new Damage(0,0,Damage.STUN) followed by setStunTime(24 * 2), i.e. a 48-frame stun with zero damage.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Damage.as:18,:98-100,:137-140 + FlashbangProjectile.as:26-27`
- **Quote:** Damage.as:18       public static var STUN:int = 6;
Damage.as:98       public function isStun() : Boolean
Damage.as:100         return this.launchType == STUN;
Damage.as:137      public function setStunTime(num:int, stunPosX:int = 0) : *
FlashbangProjectile.as:26         damageObj = new Damage(0,0,Damage.STUN);
FlashbangProjectile.as:27         damageObj.setStunTime(24 * 2);
- **Overturns:** "1 what each element does (24 skills' damage/cost/AoE/status - names only)."
- **Lane impact:** rebirth-elements blocker 1 + combat-core: the status channel for the whole game is launchType + setStunTime, not the BUFF_* enum and not a bespoke per-projectile field. A rebuild should model status as a launchType tag on the damage packet with a frame duration. This is the artifact that refutes rebirth/status-not-on-damage-packet, and it also tells the lane exactly where to look for a per-element burn/slow: at each elemental projectile's 'new Damage(...)' call.

### `s26d/web-crit-is-1.3-flat-android-is-1.2-1.5-split` — HELD [A2]

The crit multiplier is a web-vs-android tuning split nobody in this packet claimed. Web v0.717 applies a single flat x1.3 plus the crit-damage stat regardless of stance; android v0.682 applies x1.5 in Light stance and x1.2 in every other stance. Both fire on the same deterministic trigger, reload == maxreload.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276 vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3215-3223`
- **Quote:** web 3272:         if(this.§1t4414s0§ == this.§1t4415s0§)
web 3274:            return _loc2_ * 1.3 + this.§1t1243s0§;
web 3276:         return _loc2_;
android 3215:         if(this.reload == this.maxreload)
android 3217:            if(this.stance != LIGHT_STANCE)
android 3219:               return maxDamage * 1.2 + this.STAT_CRITICALDMG;
android 3221:            return maxDamage * 1.5 + this.STAT_CRITICALDMG;
- **Overturns:** "5 crit proc rule (chance vs deterministic) - entirely absent."
- **Lane impact:** combat-core + skills-meters: the ledger's 'crit 1.3x' is CONFIRMED for the web build and must be labelled web-specific -- a config seeded from the android decompile would ship a stance-dependent 1.2/1.5 crit instead. Combined with maxreload 192 vs 120 and the mastery 0-10 vs 0-100 scale, this is the fourth confirmed tuning split between the two builds in this packet.

### `s26d/web-npcmanager-ai-switch-has-39-cases-not-38` — HELD [A2]

The web v0.717 NPCManager ai switch carries a 39th case that android v0.682 does not have, and no default arm. §1t1543s0§.as runs 'case 0:' at :617 through 'case 38:' at :731, where :732 is '_loc5_ = new §1t4551s0§();' and the switch closes at :733 with no 'default:'. Android NPCManager.as runs case 0 at :518 through case 37 at :629 and closes at :632-633 with 'default: trace("createNPC error: " + xml.ai);'. So the obfuscated-name mapping by case order is only valid for ai 0..37, and §1t4551s0§ is an enemy AI slot with no v0.682 counterpart - a fifth proven build divergence, and one that lands squarely on the enemies-ai roster.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1543s0§.as:731-733 vs reference/decompiled/shs3_android/scripts/NPCManager.as:629-633`
- **Quote:** web §1t1543s0§.as:731 `case 38:` :732 `_loc5_ = new §1t4551s0§();` :733 `}`  ‖  android NPCManager.as:629 `case 37:` :630 `actor = new EnemySpearElite(MCSPool.getMCS(),true);` :632 `default:` :633 `trace("createNPC error: " + xml.ai);`
- **Overturns:** "(no ledger sentence - this corrects gauntlet-s26b/web-npcmanager-switch-is-the-name-mapping-anchor before it is absorbed)"
- **Lane impact:** L2 enemies-ai: the web roster has 39 AI slots, not 38. Anyone porting names by case index must stop at 37, and §1t4551s0§ needs its own identification pass.

### `s26d/web-reach-and-cooldown-formulas-recovered` — HELD [A2]

Both surviving SPD consumers in v0.717 are recovered in full. Skill-cooldown modifier: clamp SPD to 600, then return 1 - SPD/600*0.5 (so a floor of x0.5 at SPD>=600). Base slash length: int(120 + floor((90 + STAT_DAN*5) * SPD / (20 + SPD))) -- a Dan-scaled asymptote rising from 210 px at Dan 0 to 255 px at Dan 9 before the per-stance multiplier. Slash usage has its own floor of 48.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2295, :2344-2347, :2350-2357`
- **Quote:** 2289:      internal static function §1t9590s0§(param1:int) : Number
2291:         if(param1 > 600)
2293:            param1 = 600;
2295:         return 1 - param1 / 600 * 0.5;
2344:      internal static function §1t9593s0§(param1:int) : int
2346:         var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5;
2347:         return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));
2353:         if(_loc1_ == null || _loc1_.slashusage < 48)
2355:            return 48;
- **Overturns:** "4 SPD->cooldown formula."
- **Lane impact:** L2/L5 blocker 4 (SPD->cooldown formula) is CLOSED with a web cite, and the reach base is closed with it. Note the shape: reach is asymptotic in SPD, so 294 px (Light, Dan 0) and 357 px (Light, Dan 9) are ceilings approached as SPD grows, not values at a particular SPD - any ledger row quoting them must say so. §1t9426s0§ is STAT_DAN (same const the rebirth routine tests at :2644).

### `s26d/web-statue-is-1t8703s0-and-has-full-parity` — HELD [A2]

The WEB v0.717 twin of Obj_DragonDanceStatue is reference/decompiled/shs3_payload/scripts/§1t8703s0§.as, and it carries the SAME two sequence modes as android: props>=8 subtracts 8, clears earlierHeaven and picks one of five hard-coded orderings (1246/4216/1642/1426/6241) seeded on the current node with the node digit appended; otherwise the sequence is taken verbatim from the room prop. The Kanji-statue rule is therefore build-agnostic, not android-only.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t8703s0§.as:36-66 vs reference/decompiled/shs3_android_payload/scripts/Obj_DragonDanceStatue.as:37-68`
- **Quote:** §1t8703s0§.as:36  this.num = int(param1);
§1t8703s0§.as:37  if(this.num >= 8)
§1t8703s0§.as:39     this.num -= 8;
§1t8703s0§.as:41     _loc4_ = §1t58s0§.random(5,§1t1525s0§.§1t9935s0§());
§1t8703s0§.as:48        §1t5518s0§ = "4216" + this.num;
§1t8703s0§.as:63  else
§1t8703s0§.as:65     §1t5518s0§ = param1;
- **Overturns:** "4 Dragon Dance input + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker 4, statue half: the two-mode statue rule can be promoted from android-caveated to build-agnostic CONTRACT. Found by grepping the unique string literal "4216" across both trees, which returns exactly three web classes and three android classes.

### `save-schema/dataslots-20-does-not-count-the-written-ids` — HELD [A2]

DATASLOTS=20 is NOT a count of the twenty written data ids. QueryManagerBase.as:41 uses it as `new Vector.<Boolean>(DATASLOTS)` and :66/:74/:1875 (plus QueryManagerPIO.as:1033) as the bound of `for(i = 0; i < DATASLOTS; i++)` - so it indexes slots 0..19, which INCLUDES the never-written slot 13 and EXCLUDES slot 103 entirely. The arithmetic agreement with '0-12, 14-19, 103 = 20' is a coincidence and must not be cited as corroboration of it.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerBase.as:15,41,66,74,1875`
- **Quote:** QueryManagerBase.as:41  internal var dataModified:Vector.<Boolean> = new Vector.<Boolean>(DATASLOTS);
QueryManagerBase.as:66  for(var i:int = 0; i < DATASLOTS; i++)
- **Lane impact:** L1 / §6 persistence: keeps the 23-slot arithmetic (which is independently sound from the enumeration) but strips a false supporting inference out of world-exploration/save-schema-has-three-timers before it reaches config.

### `save-schema/is-android-only-evidence` — HELD [A3]

The recovered save schema has an undischarged S0-3 web-parity hole that none of the three save-schema findings names. `grep -rn saveUpdate reference/decompiled/` returns hits in exactly four files - shs3_android/{NetworkManager,QueryManagerPIO}.as and shs3_android_payload/{NetworkManager,QueryManagerPIO}.as - and ZERO under shs3_payload. Every slot id, including the three timers, is android v0.682 only.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:1047-1187 and reference/decompiled/shs3_android/scripts/NetworkManager.as:1870 - the only saveUpdate sites in the repo besides their shs3_android_payload duplicates`
- **Quote:** $ grep -rn 'saveUpdate' reference/decompiled/ | awk -F: '{print $1}' | sort | uniq -c
   1 reference/decompiled/shs3_android/scripts/NetworkManager.as
  23 reference/decompiled/shs3_android/scripts/QueryManagerPIO.as
   1 reference/decompiled/shs3_android_payload/scripts/NetworkManager.as
  23 reference/decompiled/shs3_android_payload/scripts/QueryManagerPIO.as
- **Lane impact:** L1 / §6 persistence: the 23-slot schema must be labelled v0.682 when it is transcribed, not CONTRACT against the filmed build. Also confirms `saveUpdate(13` appears nowhere in the repo.

### `ui-hud/two-dan-title-renderers-romaji-and-kanji` — HELD [A2]

The Dan rank has TWO different on-screen renderers shipping side by side in BOTH builds, and a recreation needs both. InventoryUI paints the kanji ladder from the string table (455 unused, 456..464 over STAT_DAN 1..9) plus a Renshi/Kyoshi/Hanshi shogo suffix; PlayerPanel paints a HARDCODED ASCII romaji ladder instead — '(nidan)', '(sandan)', '(yondan)' ... '(judan)' as literals in the AS3, with only the shogo suffix fetched from the string table. Both renderers blank the field at STAT_DAN 0, so the dan-0-is-blank finding is confirmed twice over in each build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t408s0§.as:532-565 and reference/decompiled/shs3_android/scripts/PlayerPanel.as:388; vs reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2315 and reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3062-3065`
- **Quote:** web §1t408s0§.as:534-538 'case 0: dantext = ""; break; case 1: dantext = "(nidan)";' · :543 'case 3: dantext = "(yondan) " + §1t1521s0§.getString(465);' · :563 'default: dantext = "(judan) " + §1t1521s0§.getString(467);'  ||  android PlayerPanel.as:388 'dantext = "(nidan)";'  ||  InventoryUI.as:2280 'this.danfield.text = LangManager.getString(456);' where strings.json['456'] = '(弐段)'
- **Lane impact:** L-ui-hud: two panels show the rank in two different scripts (kanji on the inventory/character sheet, romaji on the player panel). Shipping only one is a visible divergence. It also independently corroborates the four dan-0 findings in this packet: the blank-at-0 behaviour is present in four separate switch statements across two builds and two UIs.

### `ui-hud/web-battleui-status-selector-has-nine-branches` — HELD [A2]

The web BattleUI status-line selector is a NINE-branch chain, not eight. reference/decompiled/shs3_payload/scripts/§1t113s0§.as:1272-1302 holds eight plain branches writing getString(11119) through getString(11126), and :1304-1314 adds a ninth branch keyed on a different constant that picks getString(11130) or getString(11131) depending on `getStat(§1t9414s0§) <= 1`, both wrapped in a red #FF0000 font tag. The result is written at :1316 as `this.§1t5159s0§.htmlText = _loc4_;` with :1315 setting the field visible and :1320 hiding it when no branch matched.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:1272-1316`
- **Quote:** _loc4_ = "<font color='#FF0000'>" + §1t1521s0§.getString(11130) + "</font>";
- **Lane impact:** ui-hud: a rebuild copying the '8-branch selector' description from ui-hud/web-battleui-diverges-from-android would drop the red low-resource warning pair. Nine states, one of them colour-coded and count-dependent.

### `uistrings-payload/web-build-ships-zh-cn-branching-without-a-zh-cn-table` — HELD [A2]

The web v0.717 build DOES contain zh-CN: reference/decompiled/shs3_payload/scripts/§1t1521s0§.as:15 declares `public static var CHINESE:String = "zh-CN";`, :185 branches on it, and shs3_fla/PauseScreen_51.as:29-36 makes a dedicated `title_chinese` MovieClip visible when getLanguage() == CHINESE. What the build lacks is a zh-CN STRING TABLE - the pool names exactly six language files, shs3_en/fr/es.xml at payload.xml:118535-118537 and tower_en/fr/es.xml at :118543-118545. So the Wayback CDX target list (strings/shs3_{en,fr,es}.xml and tower_{en,fr,es}.xml) is right, but 'no zh-CN anywhere in the payload' is false and must not be banked: a Chinese locale is wired into the code and has its own title art.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1521s0§.as:15 + reference/decompiled/shs3_payload/scripts/shs3_fla/PauseScreen_51.as:33 + reference/extracted/payload.xml:118535,118543`
- **Quote:** public static var CHINESE:String = "zh-CN";
- **Lane impact:** uistrings-payload / meta-social: replaces the refuted claim uistrings-payload/web-lang-files-are-en-fr-es-only. Keep its file list, drop its universal negative. Any lane reasoning about locale coverage in v0.717 must treat Chinese as code-supported but table-missing.

### `warroom/next-turn-in-is-string-309-not-307` — HELD [A2]

The War Room move-timer label is docs/gauntlet/L0/index/strings.json["309"] = 'Next turn in ', not ["307"]. ["307"] is 'Select territory' and ["310"] is 'Select a sector'. The move-counter label ["308"] = ' Move(s) Left' is correct as cited, and is written at WarUI.as:539 `this.movesleftlabel.text = warmoves + LangManager.getString(308);`.

- **Cite:** `docs/gauntlet/L0/index/strings.json["307"],["308"],["309"] + reference/decompiled/shs3_android/scripts/WarUI.as:539`
- **Quote:** 307 'Select territory' | 308 ' Move(s) Left' | 309 'Next turn in '
- **Lane impact:** L11 meta-social: corrects the supporting cite inside warroom/troop-advance-is-24-hours before it is banked. The 24-hour claim itself is verbatim in strings.json["376"] and stands.

### `world-exploration/farm-guaranteed-yield-is-the-FIRST-harvest` — HELD [A2]

The farming guaranteed-yield rule fires on the FIRST harvest of a patch, not the second. In InteractUI_crops.as, harvest() is declared at :586 and increments the harvest counter at :592 (`StatsManager.changeStat(this.startingIndex + 2,1);`) BEFORE testing it at :607 (`if(StatsManager.getStat(this.startingIndex + 2) == 1 || ...)`). StatsManager.changeStat's PLAYERSTAT branch is `setPlayerStats(id,getPlayerStats(id) + val)` - it adds - and getStat returns 0 for an unset stat, and no code anywhere else writes startingIndex + 2. A virgin patch therefore reads 0, becomes 1 on the first harvest, and satisfies `== 1` on that same first harvest.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI_crops.as:586,592,607`
- **Quote:** StatsManager.changeStat(this.startingIndex + 2,1);
- **Lane impact:** L1 world-exploration: this is the counter to world-exploration/farm-guaranteed-yield-is-harvest-two, which I refuted in this packet. The surveyor's original 'first harvest guaranteed' was right; do not port the 'second harvest' correction.

### `world-exploration/frozen-ring-is-19-territories-recomputed` — HELD [A3]

Recomputed independently: the isNoChangeTown level rule freezes exactly 19 LAND territories, distributed L3x1 / L4x2 / L5x4 / L6x5 / L7x7. Method: NodeGenerator.as:385 gives level = |x-341| + |y-341| + LEVELSTART with LEVELSTART = 3 (:144), and :400 freezes when level < 8, i.e. Manhattan distance <= 4 from (341,341). WorldMapUI.as:15,17,19,208 fix the mask index (TERRSHIFTX 21, TERRSHIFTY 51, WARMARKERSHIFTX 8), putting (341,341) at mask cell (13,51). Decoding 110_Mobile_MapBitmapData.bin as a 63x72 GIF (735 land cells total) and counting land inside that diamond gives 19.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:144,385,400 + WorldMapUI.as:15,17,19,208 + reference/extracted/android/110_Mobile_MapBitmapData.bin (63x72 GIF, 735 land cells)`
- **Quote:** land cells by level: {3: 1, 4: 2, 5: 4, 6: 5, 7: 7} -> FROZEN (lvl<8) = 19
- **Lane impact:** L1 world-exploration / L11 meta-social: settles the contradiction inside this packet, where world-exploration/frozen-town-levels-are-19-not-12 says 19 and world-exploration/nochange-ring says 46. 19 is correct; 46 is an arithmetic slip that its own enumeration contradicts.

### `world/kasuta-is-on-film-in-the-web-build` — HELD [A1]

The name-generator output is confirmed in the WEB v0.717 build on film, not just reproduced from android code. The same frame the packet cites for TERRITORY (21,51) also prints, top-left in the location banner, 'E KASUTA FIELD' with a travel row reading 'E KASUTA MOUNTAIN PATH (N)'. Territory (21,51) is the spawn territory 1397077 (341,341), whose android LCG name I independently reproduced as 'Kasuta'. So the generated syllable name, the compass prefix and the terrain suffix all survive into v0.717.

- **Cite:** `reference/frames/zFt_combat/zFtCaTO0_1M_t0330s.png - full 1920x1080 downscaled to 960x540; location banner occupies roughly x 40-295, y 80-165`
- **Quote:** on-screen banner: 'E KASUTA FIELD'; travel row below it: '(footprint icon) E KASUTA MOUNTAIN PATH (N)'; minimap below-right: 'TERRITORY (21,51)' / 'SECTOR (4,3)'
- **Lane impact:** L1 world-exploration: closes the build-parity half of world-exploration/start-town-is-kasuta and world-exploration/start-node-name-confirms-rng, both of which rest entirely on android artifacts. The web build names the spawn territory Kasuta on film.

### `world/nochange-town-rule-is-cross-build` — HELD [A2]

The 'no-change town' rule is NOT android-only. The web v0.717 twin of NodeGenerator carries the identical guard: §1t70s0§.as:414 `return _loc2_ < this.§1t1138s0§ + 5;` with `internal var §1t1138s0§:int = 3;` at :146 - i.e. level < 8, the same as android isNoChangeTown at NodeGenerator.as:400 with LEVELSTART=3 at :144. Every territory below level 8 has a permanently fixed town level in the FILMED build too.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t70s0§.as:146,414 vs reference/decompiled/shs3_android/scripts/NodeGenerator.as:144,400`
- **Quote:** §1t70s0§.as:414  return _loc2_ < this.§1t1138s0§ + 5;   ||   §1t70s0§.as:146  internal var §1t1138s0§:int = 3;
- **Lane impact:** L1 world-exploration: world-exploration/nochange-town-covers-all-level-under-8 can be banked as CONTRACT against the filmed build rather than carried with an S0-3 parity caveat. Found while judging that claim; nobody in the packet cited the web twin of isNoChangeTown.

### `world/placenames-blob-is-byte-identical-across-builds` — HELD [A3]

The 677-entry place-name table is byte-identical between builds: `cmp reference/extracted/bindata/98_1t4653s0.bin reference/extracted/android/89_NameGenerator_PlaceNames.bin` exits clean. This is a rare case where an S0-3 parity question is settled by a real byte-check rather than by the circular android-vs-android diff C2 warns about, because 98_1t4653s0.bin comes from the WEB bindata set and 89_* from the ANDROID extract.

- **Cite:** `reference/extracted/bindata/98_1t4653s0.bin vs reference/extracted/android/89_NameGenerator_PlaceNames.bin - cmp returns no output (identical); 677 entries when split on \n, no trailing newline`
- **Quote:** $ cmp reference/extracted/bindata/98_1t4653s0.bin reference/extracted/android/89_NameGenerator_PlaceNames.bin -> IDENTICAL
python split('\n') -> 677 entries; index 660 = 'Iwakuni', neighbours Hofu / Iwakuni / Kudamatsu / Mine / Nagato; 'Ibamaya' and 'Gokura' both ABSENT from the table
- **Lane impact:** L8 world-exploration: getTownName1's lookup table needs no build qualifier, and it confirms why Ibamaya/Gokura/Iwakuni must be hardcoded overrides in code - the first two are not in the table at all, and Iwakuni's presence in it is innocent (it is an ordinary Japanese-city row, not the override).

### `world/web-rng-is-pooled-but-numerically-identical` — HELD [A2]

The web v0.717 RNG is pool-allocated rather than constructed - §1t136s0§.as:171 calls `§1t58s0§.§1t8804s0§(param1 * 2)` and then `.destroy()` - which looks like a divergence from android's `new RNG(territoryID * 2)`. It is not. §1t58s0§.as:23-27 gets a pooled instance and immediately calls setSeed (§1t779s0§), and §1t779s0§ at :67-74 sets the seed, takes its absolute value and primes with `this.rnd()` exactly as the android constructor does at RNG.as:10-19; rnd() at :84 is the same `(randomSeed * 9301 + 49297) % 233280`. Output is bit-identical, so any name-generator reproduction done against the android RNG is valid for v0.717.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t58s0§.as:23-27,67-74,84 vs reference/decompiled/shs3_android/scripts/RNG.as:10-19,51-59,66-70`
- **Quote:** §1t58s0§.as:67  public function §1t779s0§(param1:Number) : *
:69     this.randomSeed = param1;
:74     this.rnd();
§1t58s0§.as:84  this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
- **Lane impact:** L8 world-exploration: removes a plausible-looking porting trap. A reader diffing the two name generators would see a pool factory on the web side and suspect a different priming sequence; there is none. Combined with the byte-identical place-names blob, the ONLY web/android divergence in the whole name generator is the third Iwakuni override.
