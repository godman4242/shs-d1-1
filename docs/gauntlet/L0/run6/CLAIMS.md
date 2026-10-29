# L0 — salvaged claim set (raw surveyor output)

> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED
> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).
> Banked: 0 surveys · 1 critic reviews · 10 claims · 15 verdicts.

## unassigned — re-scored ?

### `android-blobs-hunter/audio-decrypts-26-named-mp3-streams` — HELD [A2] ⚑ OVERTURNS LEDGER

The audio blocker is not a wall. ffdec cannot open 113_Mobile_MusicResource and 122_Mobile_SoundResource because they are XOR-obfuscated BEFORE the SWF header; applying the shipped key schedule turns both into ordinary CWS v17 SWFs that inflate and parse. Each holds 13 DefineSound tags, all MP3, 11025 Hz, 16-bit, mono, each bound to a SymbolClass name: music bgm_lose 3.53s, safepercussion/safekoto/safeambience 80.01s each, bgm_levelup 29.78s, bgm_gangnam 3.63s, flutes 80.01s, dungeonpiano/dungeonpercussion/dungeonflute/dungeonambience 45.74s each, battledrums 80.01s, battlechants 80.01s; sfx deflect 0.79s, die1 0.48s, die2 0.66s, die3 0.87s, slash1 0.35s, slash2 0.56s, slash3 0.27s, hitmetal 0.52s, punch 0.31s, sumo 2.90s, refund 0.73s, goodkoto 1.57s, fart 0.42s. The stem structure is itself a design fact: the 'safe' and 'dungeon' beds are 4 and 4 co-length stems (80.01s and 45.74s) - layered adaptive music, not single tracks. I did NOT listen to or grade any of it; I read tag headers only.

- **Cite:** `reference/extracted/android/113_Mobile_MusicResource.bin and 122_Mobile_SoundResource.bin, decrypted with reference/decompiled/shs3_android_payload/scripts/ResourceManager.as:206-217 keyed from Mobile.as:352 (charCodeAt(1) => 'u'=117 and 'o'=111); 13 DefineSound + 13 SymbolClass entries each`
- **Quote:** 113_Mobile_MusicResource -> CWS v17, 13 DefineSound: id=2 safepercussion MP3 11025Hz 16bit mono samples=882144 (80.01s); id=12 battledrums 882144 (80.01s). 122_Mobile_SoundResource -> id=9 slash1 MP3 11025Hz samples=3809 (0.35s); id=1 deflect 8700 (0.79s); id=11 hitmetal 5717 (0.52s).
- **Overturns:** "S0-5: audio is HELD but ENCRYPTED (nested "CWS" SWFs ffdec cannot open). You may NOT claim audio is recovered."
- **Lane impact:** L6 art-anim-audio-feel. The 'ffdec cannot open it' half of S0-5 is dead - the containers open with the game's own key schedule. What survives of S0-5 is only the honest part: nobody has listened to or graded the audio. A named, timed, format-known 26-cue manifest replaces a black box, and the 4-stem adaptive beds are a mechanic the ledger has nowhere.

### `android-blobs-hunter/bgdata-override-vocabulary-is-22-tags` — HELD [A2] ⚑ OVERTURNS LEDGER

The per-background override vocabulary in 123_Mobile_BGData is 22 tags, not the four the packet lists, and three of the overrides break the default ladder in ways the defaults cannot predict. Measured over all 49 rows: id 49, name 49, ffcount/fcount/ppcount/gcount/fgcount 49 each, wrap 17, contentwidth 17, fscroll 16, ffscroll 14, fblur 11, fwrap 11, ppwrap 9, ppblur 9, ffwrap 8, ppscroll 6, fgscroll 3, ffblur 3, gscroll 2, fgblur 2, gblur 1. Two rows set <gscroll>0</gscroll> - a LOCKED ground plane; three rows set <fgscroll>1.2</fgscroll>, overriding the 2.0 foreground ladder value; one row sets <ffscroll>1</ffscroll>, collapsing the farthest plane onto the camera. <gwrap> and <fgwrap> are never authored, and neither is <groundy> or <flatground>.

- **Cite:** `reference/extracted/android/123_Mobile_BGData.bin - tag histogram over all 49 <bg> records (623 lines); field mapping at reference/decompiled/shs3_android_payload/scripts/XMLBG.as:58-140`
- **Quote:** tag histogram over 49 <bg>: {'id':49,'name':49,'ffcount':49,'fcount':49,'ppcount':49,'gcount':49,'fgcount':49,'wrap':17,'contentwidth':17,'fscroll':16,'ffscroll':14,'fblur':11,'fwrap':11,'ppwrap':9,'ppblur':9,'ffwrap':8,'ppscroll':6,'fgscroll':3,'ffblur':3,'gscroll':2,'fgblur':2,'gblur':1}
- **Overturns:** "android-blobs/bgdata-is-a-parallax-spec: 'Overrides present: ffwrap 6 rows (1640/1670/1750/1770/2000/2000), ffscroll 14 rows (0.05-0.27), fscroll 16 rows (0.1-1.0), contentwidth 17 rows ..., wrap 17 rows all 0.'"
- **Lane impact:** L6 art-anim + L1 world-exploration. A recreation that implements only the five default scroll/blur constants will render 49 backgrounds and get roughly twenty of them wrong. Also corrects two numbers in the banked claim: ffwrap is 8 rows (lines 12, 23, 259, 330, 356, 370, 514, 530), and ffscroll's range is 0.05-1.0, not 0.05-0.27.

### `android-blobs-hunter/foreground-plane-is-the-most-blurred-element` — HELD [A1] ⚑ OVERTURNS LEDGER

Corrected frame reading. In the cited longplay frame the foreground plane does occlude both fighters' lower legs, but it is the SOFTEST element in the frame, not the sharpest: p99 local luminance gradient measures 3.0 / 3.0 / 3.4 across three grass boxes clear of the fighters, versus 7.0 for the far rock background, 7.0 for the tree trunk, 82.0 for the tan fighter's torso and 101.6 for the purple fighter's shoulder. The grass carries no near-black outline pixels. This is exactly what XMLBG.as:46 predicts - foregroundLayerBlur = 8, tied with farthestLayerBlur = 8 for the hardest blur in the ladder - so the frame and the AS3 agree, and a recreation must blur its foreground scenery as hard as its farthest layer.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png - crops (900,560)-(1180,960) x3 NEAREST, (760,780)-(1240,1010) x3, (950,840)-(1090,930) x8; gradient boxes (780,885)-(850,955), (1100,885)-(1230,955), (300,885)-(560,955) vs (1300,300)-(1500,450) and (960,700)-(1080,840) - cross-checked to reference/decompiled/shs3_android_payload/scripts/XMLBG.as:46`
- **Quote:** p99 gradient - grass (780,885)-(850,955)=3.0, (1100,885)-(1230,955)=3.0, (300,885)-(560,955)=3.4 ; far rock (1300,300)-(1500,450)=7.0 ; tan fighter torso (960,700)-(1080,840)=82.0 ; purple shoulder (820,830)-(900,880)=101.6
- **Overturns:** "android-blobs/foreground-layer-occludes-the-fighters: 'a sharply-outlined grass band ... The grass carries the same outline weight as the fighters - it is not the blurred far layer'"
- **Lane impact:** L6 art-anim. THE FRAME WINS over the measurement claim. The occlusion survives; the outline characterisation is inverted. Building crisp foreground grass from the original wording would be a visible 1:1 miss on every one of the 49 backgrounds that declares an <fgcount>.

### `android-blobs-hunter/item-icon-coverage-corrected` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Corrected icon coverage for the decrypted 115_Mobile_SHS3Resource, replacing the packet's figures. Joining the 112 item#### symbols by id against the 982 itemdata rows: band 2000-2999 is 50/99 covered (49 rows have no icon), band 20000-29999 is 58/79 (21 rows have no icon), accessories 8/9 (3007 missing). The consumable gap is one contiguous authored block plus strays: 2000, 2001, 2131-2141 (except 2140,2141 which DO ship), 2142, 2144-2175, 2204, 2206, 2500, 2502, 2503. Missing quest-item icons: 20005, 20009-20012, 20017, 20023, 20054-20058, 20100-20107, 20111. Skills, which the packet did not quantify: 68 of the 75 <skill> rows have a skill#### icon and 7 do not (1064, 1065, 1066, 1067, 1068, 1500, 1501); 11 skill symbols have no skilldata row.

- **Cite:** `decrypted reference/extracted/android/115_Mobile_SHS3Resource.bin (1,912 SymbolClass names) joined by id to reference/extracted/android/111_Mobile_ItemData.bin (982 <item>) and 117_Mobile_SkillData.bin (75 <skill>); resolution path reference/decompiled/shs3_android_payload/scripts/MCSItem.as:203`
- **Quote:** band 2000-2999: rows=99 covered=50 MISSING=49 -> [2000, 2001, 2131..2139, 2142, 2144..2175, 2204, 2206, 2500, 2502, 2503]; band 20000-29999: rows=79 covered=58 MISSING=21
- **Overturns:** "android-blobs/item-and-skill-icon-art-is-held: 'covering 94/99 consumables, 8/9 accessories and 67/79 quest items ... Residual named exactly: consumable arts 2000, 2001, 2500, 2502, 2503; accessory art 3007; 12 quest-item arts.'"
- **Lane impact:** L3 items-equipment + L10 ui-hud. The banked STILL_UNHELDs are still correctly retired - the art IS on disk - but roughly half the consumable roster falls back to item0 (MCSItem.as:206) rather than one in twenty. A builder planning icon work needs 70 originals, not 18.

### `android-blobs-hunter/shipped-vector-art-yields-solid-fill-palettes` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The shipped vector art is decodable, which closes the packet's own 'nothing was rendered' lead. Parsing FILLSTYLEARRAY across the three decrypted resource SWFs yields 2,423 shape records with solid fills. Most-used: 115_Mobile_SHS3Resource (fighter parts + icons) #000000 x225, #FFFFFF x224, #333333 x160, #CCCCCC x147, #FECA98 x127, #B78F6C x120, #222222 x100; 120_Mobile_BGResource #000000 x45, #30291D x35, #5A4D2E x33, #3A3323 x23, #251F16 x21, #453929 x21; 124_Mobile_ImageResource (portraits/cards) #DF9671 x52, #FCC6A6 x51, #000000 x39, #9E6750 x31. Per-symbol resolution works: torso4000 -> charId 1195 -> shape 1194 (DefineShape4) fills #FECA98 and #B78F6C; skill1000 -> shape 144 fill #C0AC4B; acc3000 -> shape 3725 fill #ABABAB. Semantic sanity check passes both ways - skin tones dominate the portrait file, earth tones the background file.

- **Cite:** `decrypted reference/extracted/android/115_Mobile_SHS3Resource.bin (1,755 shape records), 120_Mobile_BGResource.bin (562), 124_Mobile_ImageResource.bin (106) - DefineShape/2/3/4 FILLSTYLEARRAY parse; decrypt per reference/decompiled/shs3_android_payload/scripts/ResourceManager.as:206-217`
- **Quote:** 115 top fills: #000000 x225 - #FFFFFF x224 - #333333 x160 - #CCCCCC x147 - #FECA98 x127 - #B78F6C x120. torso4000 -> charId=1195, shape id=1194 tag=83, fills ['#FECA98','#B78F6C']
- **Overturns:** "android-blobs/nothing-was-rendered: 'not one DefineShape record was decoded, so no fill colour, outline weight, silhouette or per-slot geometry is held by this pass.'"
- **Lane impact:** L6 art-anim. Under the 2026-07-24 owner project ruling, exact OG hues are now permitted targets, and these are exact OG hues from the shipped art rather than eyedropper reads off a compressed video frame. HONEST LIMIT: first-fill-array reads only - no edge records, no silhouettes, and my LINESTYLE2 parse is not trustworthy, so I report NO outline weights.

### `android-blobs-hunter/survival-achievement-premium-namegen-blobs-unread` — HELD [A2] ⚑ OVERTURNS LEDGER

Four more shipped data blobs are named by no claim in the packet. 109_WarHexUI_SurvivalModeData: 555 lines, 39 <wave>, 87 <enemy>, enemy ids as alternation lists (400|401|402|403|404) - a spawn primitive nothing else in the corpus uses - and spawn x of -50 (49x), 1650 (37x), -1650 (1x), i.e. just off both edges of a 1600-wide stage, independently corroborating XMLBG contentWidth=1600. 114_Mobile_AchievementData: 553 lines, 61 <achievement> with id/img/name/desc/stat/val, all string-resolvable and stat-threshold driven; icon art is complete (img takes only 1-4 and achievement0-4 all ship). 121_Mobile_PremiumData: 257 lines, <default> :3, <special> :22, <rotation> :35 with 23 <set> and 176 <item> refs - the live-ops offer schedule. 85-89_NameGenerator_*: 1,430 authored proper nouns (male 397, female 290, place 676, samurai family 35, noble family 32).

- **Cite:** `reference/extracted/android/109_WarHexUI_SurvivalModeData.bin:3-14 + 114_Mobile_AchievementData.bin:4-11 + 121_Mobile_PremiumData.bin:3,22,35,37 + 85_NameGenerator_MaleNames.bin (397 lines), 88_NameGenerator_FemaleNames.bin (290), 89_NameGenerator_PlaceNames.bin (676), 87_NameGenerator_SamuraiFamilyNames.bin (35), 86_NameGenerator_NobleFamilyNames.bin (32); names resolved via docs/gauntlet/L0/index/strings.json["8000"]="Duelist I", ["8080"]="Win an online duel."`
- **Quote:** 109:3 <wave> 4:<enemy> 5:<id>400|401|402|403|404</id> 6:<qty>4</qty> 7:<x>-50</x> ; 114:5 <id>0</id> :6 <img>1</img> :7 <name>8000</name> :8 <desc>8080</desc> :9 <stat>60000</stat> :10 <val>1</val> ; 121:35 <rotation> :37 <set>
- **Overturns:** "S0-1: 119 <survivalmodedata> (a whole game mode absent from all 12 ledger systems)"
- **Lane impact:** Cross-cutting: L1 world-exploration, L-progression, L-meta-social, L-economy. S0-1 flagged survival mode as absent from all 12 systems; this is its authored wave content, and <survivalmodedata> is one of only two roots present in BOTH payloads, so it is not an Android-only mode. The 61-achievement system and the premium rotation are likewise entirely outside the ledger.

### `android-blobs-hunter/condition-comparison-enum-is-seven-operators` — HELD [A2]

The <condition> evaluator's comparison enum is seven operators, not the two the packet names. StatsManager.checkCondition special-cases 'rand' first and then runs a full switch: eq, gte, gt, lt, lte, not, with default returning false. Authored usage across the whole Android corpus is 13 sites: nodedata rand x1; achievementdata not x1; questdata eq x5, gt x1, gte x2, not x1; uidata gte x1, lt x1, not x1. An absent <comp> defaults to 'gte'. Every <condition> in nodedata, questdata, uidata and achievementdata draws on the same evaluator, so any of them can be made probabilistic, negated or bounded.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:4222 (rand), :4279-4295 (switch eq/gte/gt/lt/lte/not/default), :4173 (default gte); authored <comp> census over reference/extracted/android/*.bin`
- **Quote:** 4279:switch(comparison) 4281:case "eq": 4283:case "gte": 4285:case "gt": 4287:case "lt": 4289:case "lte": 4291:case "not": 4293:default: return false;
- **Lane impact:** L4 enemies-ai, L1 world-exploration, L-quests-story, L-economy. The ledger treats conditions as flat 'has item X' gates; the shipped evaluator is a six-operator comparison plus a probability primitive, and 'lte' is declared but never authored.

### `android-blobs-hunter/groundy-400-is-a-global-not-a-default` — HELD [A2]

groundY = 400 and flatGround = true are not per-background defaults that locations override - they are global constants for every location in the game. XMLBG's constructor overrides each field only when the matching tag is present (<groundy>, <flatground>), and across all 49 <bg> records in 123_Mobile_BGData neither tag occurs even once. The same is true of <gwrap> and <fgwrap>, so groundLayerWrap and foregroundLayerWrap are universally 1600.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLBG.as:10 (groundY=400), :12 (flatGround=true), :58-140 (override-if-present constructor) against the full tag histogram of reference/extracted/android/123_Mobile_BGData.bin (49 records, zero groundy / flatground / gwrap / fgwrap tags)`
- **Quote:** XMLBG.as:10 'internal var groundY:int = 400;' :12 'internal var flatGround:Boolean = true;' :66 'if(xml.groundy.toString() != "") { this.groundY = xml.groundy; }' - and <groundy> occurs 0 times across all 49 <bg> records.
- **Lane impact:** L6 art-anim + L5 combat-core. A single authored ground line at y=400 for every scene in the game is a hard layout constant a recreation can bake in, and it is stronger than the banked reading of groundY as a mere default.

### `android-blobs-hunter/traproomdata-70-rooms-four-difficulty-tiers` — HELD [A2]

84_QuestEngine_TrapRoomData.bin is unmentioned by any claim and holds a complete procedural level system: 622 lines, 70 <room>, 314 <obj>, 70 <width>, partitioned into four difficulty tiers - <easy> at line 32, <medium> at 126, <hard> at 309, <veryhard> at 446. Its shipped comment header is an authoring legend giving the property signature of every trap type: Obj_FloorSwitch, Obj_Lever, Obj_LowCeiling, Trap_Kunai, Trap_KunaiAuto, Trap_SawBladesAuto, Trap_CrushingBlockAuto, Trap_CrushingColumnAuto, Trap_ElementAuto, Trap_Jump, Trap_SpikesAuto, Trap_Boulder, Trap_SpikeBallAuto - each with its ordered <property> parameter list.

- **Cite:** `reference/extracted/android/84_QuestEngine_TrapRoomData.bin:5-20 (legend), :21 <traproomdata>, :32 <easy>, :126 <medium>, :309 <hard>, :446 <veryhard>, :33-37 (first authored room)`
- **Quote:** 32:	<easy> 33:		<room> 34:		<!-- 1x sawblade --> 35:			<width>800</width> 36:			<obj><id>43</id><name>Trap_SawBladesAuto</name><x>400</x><property>0,24,24,0,1</property></obj> 37:		</room> ; legend :10 <obj><id>42</id><name>Trap_KunaiAuto</name>...<property>angle, speed, kunaicount, spread, onDuration, offDuration, startInterval, active, bigDamage</property></obj>
- **Lane impact:** L1 world-exploration. The ledger's world model is a node graph; this is the room-interior content that hangs off it, with a typed trap vocabulary and an authored difficulty curve. Nothing in the 12 systems mentions traps, rooms or difficulty tiers.

### `android-blobs-hunter/uidata-is-the-whole-town-interaction-spec` — HELD [A2]

90_InteractUI_UIData.bin is named by no claim in the packet and is the only spec in the corpus for how a player interacts with a town: 314 lines, root <uidata>, 19 <ui> screens, 47 <menu>, 139 <option>, 28 <condition>. Screens: peddler, market, vegpatch, stables, merchant, inn, rebirth, barber, bank, gambling den, getcoins, getap, leaveclan, blacksmith, recentevents, playerpanel, joincustomclanrecruit, joincustomclangeneral, towntoll. A 46-verb action vocabulary drives them (goto x34, close x24, sellgoods, buygoods, sellcrop, plant, harvest, withdraw, deposit, bet, chohan, redeem, nameweapon, forgeweapon, repairweapon, reinforceweapon, crafting, fullhpchi, fire/wind/water/earthrebirth, dailyprize, convertgold, buypremium, achievement, duelreplay, challenge, addfriend, bankstorage, innrest, innbuy, barberbuy, paytowntoll, entertown, giveitem, givecoins). Labels are string-table ids that resolve today, and options carry conditions AND per-action conditions with <errormsg>.

- **Cite:** `reference/extracted/android/90_InteractUI_UIData.bin:5,14,47,66 (<title> peddler/market/vegpatch/stables) + docs/gauntlet/L0/index/strings.json["83"]="Buy", ["84"]="Sell", ["85"]="Leave", ["269"]="Sell crops"`
- **Quote:** 5:		<title>peddler</title> ; 6: <option><label>83</label><icon>15</icon><action><id>peddlerbuy</id></action></option> ; 15: <option><label>269</label><icon>1</icon><condition><has><id>20040</id><qty>1</qty></has></condition><action><id>goto</id><param>1</param><condition>...<errormsg>270</errormsg></action></option>
- **Lane impact:** L1 world-exploration, L3 items-equipment, L-economy, L10 ui-hud. Every shop, bank, gambling and rebirth interaction the ledger discusses second-hand is authored here as data, with resolvable labels and an explicit error-message path for failed conditions.
