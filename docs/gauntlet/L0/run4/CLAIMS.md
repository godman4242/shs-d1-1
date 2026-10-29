# L0 — salvaged claim set (raw surveyor output)

> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED
> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).
> Banked: 0 surveys · 8 critic reviews · 80 claims · 280 verdicts.

## unassigned — re-scored ?

### `actionscript/build-divergence-7-cooldown-cap` — HELD [A2] ⚑ OVERTURNS LEDGER

A seventh combat-tuning divergence the build-divergence claim missed: the SPEED-to-skill-cooldown clamp is 300 in Android v0.682 but 600 in web v0.717. Both give a 50% maximum cooldown reduction and both apply the SPEED buff x1.5 before the clamp, so only the cap constant moved — but it halves the effective value of SPEED for cooldowns in the build this project targets.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2295 vs reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1860`
- **Quote:** web §1t1523s0§.as:2291:         if(param1 > 600)
web §1t1523s0§.as:2293:            param1 = 600;
web §1t1523s0§.as:2295:         return 1 - param1 / 600 * 0.5;   ||   android StatsManager.as:1856: if(speed > 300) … :1860: return 1 - speed / 300 * 0.5;   (twin identity: §1t105s0§.as:318 `return _loc2_ * §1t1523s0§.§1t9589s0§();` == XMLSkill.as:310 `return val * StatsManager.getSkillCooldownModifier();`)
- **Overturns:** "SPEED 300 is the cooldown cap"
- **Lane impact:** L-skills-meters / L-progression: any SPEED-scaling CONTRACT must be tagged per build; add this row to the build-divergence table before any of it is marked CONTRACT.

### `actionscript/repair-weapon-cost-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The Repair-Weapon service cost IS in the tree and is a one-liner: cost = currentNodeLevel x 10 gold, deducted immediately, and the repair restores the weapon to uses = 1 (near-full condition) rather than to zero wear. This is the exact ledger item that actionscript/repair-cost declared not found.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1057-1081 (node level resolver at StageManager.as:782-785)`
- **Quote:** 1057:            case "repairweapon":
1058:               cost = StageManager.getCurrentNodeLevel() * 10;
1059:               if(StatsManager.getGold() < cost)
1072:               StatsManager.changeGold(-cost);
1073:               if(weapon.uses > 1)
1075:                  weapon.uses = 1;
- **Overturns:** "Repair-Weapon cost never captured"
- **Lane impact:** L-economy: the repair-cost blocker closes with a real formula instead of a consumables workaround. Web-parity check still owed (find the §1t… twin of InteractUI).

### `actionscript/slash-line-colour-is-0x990000` — HELD [A2] ⚑ OVERTURNS LEDGER

The drawn slash line and the physical-damage popup both use literal 10027008, which is 0x990000, not 0xA30000 (=10682368, which appears nowhere in reference/decompiled/). The web build additionally carries a second stroke colour, 39168 = 0x009900, on a separate lineStyle setter alongside the red one.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:360 and reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:174 and :179`
- **Quote:** InputManager.as:360:            canvas.graphics.lineStyle(thickness - thickness * ((maxDistance - distanceLeft) / maxDistance),10027008,1,false,LineScaleMode.NONE,CapsStyle.ROUND,JointStyle.ROUND,3);   ||   §1t1541s0§.as:174:          canvas.graphics.lineStyle(thickness,39168,1,…);   §1t1541s0§.as:179:          canvas.graphics.lineStyle(thickness,10027008,1,…);
- **Overturns:** "slash line colour 0xA30000"
- **Lane impact:** L-art-anim-audio-feel / L-ui-hud: the correct hue is 0x990000 (already what src/config/palette.ts:58 carries as winRed); the green 0x009900 variant is an unbanked second render state that needs a frame pass to identify.

### `actionscript/war-board-is-a-6x6-square-grid` — HELD [A2] ⚑ OVERTURNS LEDGER

The War-Room board is a 6x6 SQUARE lattice, not a hex grid: cells are laid out on a uniform 55 px pitch with no odd-row offset and adjacency is strictly 4-way cardinal (N/S/E/W), with the four board edges (xpos or ypos == 0 or 5) exiting to the neighbouring territory. The cells are drawn as hexagon art (class WarHex, [Embed] symbol622) which is what makes the name misleading.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:350-360 and :443-464 (arrow gating at WarHex.as:219-222)`
- **Quote:** WarHexUI.as:350:            for(i = 0; i < 6; i++)
WarHexUI.as:352:               for(j = 0; j < 6; j++)
WarHexUI.as:359:                  hex.x = 90 + xpos * 55;
WarHexUI.as:360:                  hex.y = 92 + ypos * 55;
WarHexUI.as:447:         if(xpos == 0) … getOwner(territoryx - 1,territoryy);   :451 xpos == 5 … :455 ypos == 0 … :459 ypos == 5   ||   WarHex.as:219: this.narrow.visible = exitArray[0] == 0 && this.ypos != 0;
- **Overturns:** "War board is a hexagonal grid"
- **Lane impact:** L-meta-social: prevents an implementer building cube/axial hex coordinates for what is a 6x6 square board; the 14 typed cell roles and the arrow rendering survive unchanged.

### `bindata/NEW-70th-trap-room-is-commented-out` — HELD [A2] ⚑ OVERTURNS LEDGER

The trap-dungeon file's 70th <room> is inside a commented-out <default> template block and is never shipped — the real count is 69, matching the per-tier split 13+21+15+20. The engine branch that would have consumed a live <default> is consequently dead code.

- **Cite:** `reference/extracted/bindata/93_1t4647s0.bin:22-30 + reference/decompiled/shs3_android_payload/scripts/RoomGenNode.as:2437`
- **Quote:** 93_1t4647s0.bin:22 `<!--<default>` … :29 `</room>` :30 `</default>-->`, containing one <room> with four Trap_ElementAuto objects. RoomGenNode.as:2437 `if(QuestEngine.trapRoomData.§default§.toString() != "")` — the guard that reads it.
- **Overturns:** "Trap-dungeon system ships 69 rooms across 4 tiers (easy 13 / medium 21 / hard 15 / veryhard 20) and 297 placed objects across 14 base object types. A 70th room exists only inside an XML comment."
- **Lane impact:** Corrects the room count in two separate claims and flags a dead engine branch that a reimplementation would otherwise waste time supporting.

### `bindata/NEW-setvisible-partmax-22-leaves-5-slots-unhidden` — HELD [A2] ⚑ OVERTURNS LEDGER

The sprite-compositing contract has a gap the packet's own claim does not mention: the per-frame visibility pass only clears part slots 0..21, so slots 22-26 (prop3, both shoulders, both knees) are never hidden and persist from the previous frame.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/FrameData.as (setVisible)`
- **Quote:** `public function setVisible(mcs:MCSCharacter) : * { var i:int = 0; var partMax:int = 22; for(i = 0; i < partMax; i++) { mcs.getPart(i).visible = false; } … }` — against MCSCharacter.as:56-62 which declares PART_prop3 = 22, PART_l_shoulder = 23, PART_r_shoulder = 24, PART_l_knee = 25, PART_r_knee = 26.
- **Overturns:** "Per-frame visibility resets only part slots 0-21; slots 22-26 (prop3, l/r shoulder, l/r knee) are never auto-hidden and carry over between frames."
- **Lane impact:** A faithful renderer must reproduce this or the shoulder/knee overlays will disappear where the original keeps them — a visible-feel difference that no test currently guards.

### `bindata/NEW-trap-name-suffix-is-the-trigger-wiring` — HELD [A2] ⚑ OVERTURNS LEDGER

Trap object <name> values carry instance suffixes — 47 distinct raw strings collapsing to 14 base types — and the suffix is the trigger-wiring id: a floor switch's <property> holds the NAME of the object it fires. This is how switches, levers and traps are linked, and the packet never states it.

- **Cite:** `reference/extracted/bindata/93_1t4647s0.bin:51 and the Obj_FloorSwitch1/Trap_Kunai1 pairing in the medium tier`
- **Quote:** :51 `<obj><id>7</id><name>Obj_FloorSwitch</name><x>200</x><property>Trap_Kunai</property></obj>` paired with :52 `<obj><id>32</id><name>Trap_Kunai</name>…`; and `<obj><id>7</id><name>Obj_FloorSwitch1</name><x>300</x><property>Trap_Kunai1</property></obj>`. Schema at :6 declares the property as `triggered object,triggered object...`.
- **Overturns:** "Trap rooms are a wired graph, not a flat object list: Obj_FloorSwitch / Obj_Lever carry a pipe- or comma-separated list of TARGET NAMES in <property>, and numeric name suffixes (Trap_Kunai1, Obj_FloorSwitch3, Trap_SawBladesAuto10) exist solely to make those references unique within a room."
- **Lane impact:** Any trap-room reimplementation needs the name-reference resolver; without it switches do nothing. Also explains why a naive <name> census returns 47 types instead of 14.

### `bindata/NEW-warhex-has-14-states-not-7` — HELD [A2] ⚑ OVERTURNS LEDGER

WarHex.as carries the canonical hex-state enumeration with numeric values: fourteen states, not the seven the packet reports. Values 10 and 14 are unused, which is itself evidence the enum was edited over the game's life.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/WarHex.as:11-37`
- **Quote:** 11 `public static var HEX_NOTHING:int = 0;` · 13 `HEX_SPAWNPOINT:int = 1;` · 15 `HEX_FORWARDBASE:int = 2;` · 17 `HEX_CONTROLPOINT:int = 3;` · 19 `HEX_TOWN:int = 4;` · 21 `HEX_POTENTIALSPAWNPOINT:int = 5;` · 23 `HEX_UPCOMINGSPAWNPOINT:int = 6;` · 25 `HEX_LADDER:int = 7;` · 27 `HEX_DEFENSE:int = 8;` · 29 `HEX_VILLAGE:int = 9;` · 31 `HEX_CITY:int = 11;` · 33 `HEX_CASTLE:int = 12;` · 35 `HEX_DISABLEDSPAWNPOINT:int = 13;` · 37 `HEX_DEMOLISHEDSPAWNPOINT:int = 15;`
- **Overturns:** "War-Room board: 6x6 hex grid, 55 px pitch on BOTH axes (x = 90 + xpos*55, y = 92 + ypos*55), with FOURTEEN enumerated hex states carrying explicit numeric ids (10 and 14 unused)."
- **Lane impact:** The board-topology blocker can be closed properly rather than with 7 of 14 states; the numeric ids also mean saved war state can be decoded.

### `bindata/audio-inventory-is-held` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The audio WAVEFORMS are lost, but the audio INVENTORY and its trigger rules are fully recovered — the ledger's 'ALL AUDIO' blocker should be split in two. There are exactly 13 named SFX and 18 music presets with explicit ids. Slash and death each pick randomly from three variants; 'punch' serves both playHit and playHurt. Music is selected by background via SoundManager.pickMusic(bg, isHostile, isPvP).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/SoundManager.as:114-360 + MusicManager.as:12-46 (waveforms: reference/extracted/android/113_Mobile_MusicResource.bin and 122_Mobile_SoundResource.bin remain unopenable)`
- **Quote:** SoundManager.as SFX names via ResourceManager.getSound: "slash1","slash2","slash3","die1","die2","die3","punch" (playHit AND playHurt),"hitmetal","deflect","fart","goodkoto","sumo","refund" = 13. MusicManager.as:12-46 `MUSIC_NONE=0 · MUSIC_EXPLOREBATTLE=1 · MUSIC_TOUGHBATTLE=2 · MUSIC_QUIET=3 · MUSIC_EXPLORESAFE=4 · MUSIC_EXPLOREDANGER=5 · MUSIC_EXPLORETOWN=6 · MUSIC_DUNGEONBATTLE=7 · MUSIC_PVP=8 · MUSIC_DUNGEON=9 · MUSIC_DUNGEONCREEPY=11 · MUSIC_DUNGEONCREEPYDANGER=12 · MUSIC_DOJO=14 · MUSIC_BATTLEDRUMS=15 · MUSIC_DUNGEONDANGER=16 · MUSIC_GANGNAM=100 · MUSIC_LEVELUP=101 · MUSIC_LOSE=102` (gap
- **Overturns:** "| **art-anim-audio-feel** | … | **all audio** (SFX + music params) |"
- **Lane impact:** L-art-anim-audio-feel: the blocker is half-open. WebAudio synthesis now has a named 13-SFX target list and an 18-preset music state machine with the exact per-background selection rule, even with no waveform to copy.

### `bindata/place-name-table-is-dead-data` — HELD [A2] ⚑ OVERTURNS LEDGER

bindata/98's 677 place names are DORMANT in the shipped world. getPlaceName gates the 26x26 lookup on `namex = territoryx % 137` being < 26, but every real territory's raw x lies in [329,389] (from the bitmap transform), so namex is always in [55,115]. getTownName1 is reached for ZERO of the 735 land territories. Every shipped place name is either a hardcoded exception or a getTownName2 compound: namestarting[78] concatenated with nameending[37], seeded RNG(territoryID*2). Anyone porting world naming from the 677-entry table will produce names the original never generated.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NameGenerator.as:145-166 + QuestEngine.as:522-526 + reference/extracted/bindata/98_1t4653s0.bin`
- **Quote:** NameGenerator.as:147-153 `var namex:int = territoryx % 137; var namey:int = territoryy % 26; if(namex < 26) { return this.getTownName1(namex,namey); } return this.getTownName2(territoryID);` ; :162-165 `public function getTownName2(territoryID:int) : String { var rng:RNG = new RNG(territoryID * 2); return this.namestarting[rng.rand(this.namestarting.length)] + this.nameending[rng.rand(this.nameending.length)]; }` — I counted the arrays: namestarting = 78, nameending = 37. Measured over all 735 land territories: territoryx in [329,389], namex in [55,115], getTownName1 hit count = 0/735.
- **Lane impact:** L-world-map: refutes bindata/place-name-26x26-lookup's 'recovered whole'. The correct generator is the 78x37 compound, giving 2,886 possible names, deterministic per territory.

### `bindata/reach-cap-recovered-per-stance` — HELD [A2] ⚑ OVERTURNS LEDGER

THE PER-STANCE REACH CAP IN STAGE PIXELS IS RECOVERED IN FULL. MCSPlayer.setStance sets it per stance and feeds it straight to the input line: LIGHT = baseSlashLength*1.5; BALANCED = baseSlashLength*(1 + 0.5*balancedMastery*0.01); HEAVY = baseSlashLength*(0.5 + 0.5*heavyMastery*0.01) with a hard floor of 100; REVERSED = *1.5; DUAL = base with floor 100; then InputManager.setMaxDistance(slashLength). The base is 120 + floor((90 + STAT_DAN*5) * speed / (20 + speed)), speed = STAT_SPEED + bonus, x1.5 under BUFF_SPEED, halved by BUFF_INJURED. AI opponents use the same shape with maxincrement fixed at 90. Default before any stance is set is 200. So reach IS the stance trade-off: light reaches 1.5x, heavy only 0.5x at zero mastery and reaches parity only at 100% heavy mastery.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3019-3095, :107, :222 + StatsManager.as:1905-1919 + EnemyPlayer.as:757 + InputManager.as:51,106-108,198 + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2347`
- **Quote:** MCSPlayer.as:3030 `this.slashLength = this.baseSlashLength * 1.5;` · :3041 `this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01);` · :3052-3055 `this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01); if(this.slashLength < 100) { this.slashLength = 100; }` · :3078-3081 DUAL `this.slashLength = this.baseSlashLength;` floor 100 · :3094 `InputManager.setMaxDistance(this.slashLength);` ; StatsManager.as:1915-1918 `internal static function getBaseSlashLengthVal(speed:int) : int { var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5; return 
- **Overturns:** "| **combat-model** | reach cap | the single per-stance value the whole combat model needs — MISSING |"
- **Lane impact:** L-combat-model: directly refutes bindata/reach-cap-not-in-this-source and closes the ledger's single named blocker. Web-verified, so the S0 build-parity caveat does not apply.

### `bindata/six-ledger-names-decompose` — HELD [A2] ⚑ OVERTURNS LEDGER

SIX of the ledger's named NPCs decompose from the five bindata name tables, not two — and they exercise all THREE generators, proving getCommonerName, getNobleName and getSamuraiName are all live in the shipped game. Hachisuka Kano = samurai 96:7 + male 94:80. Honda Shizuka = samurai 96:11 + female 97:226. Honda Gin = 96:11 + female 97:38. Hojo Taka = samurai 96:10 + female 97:236. Inokuma Kinkiyo = NOBLE 95:11 + male 94:107 (getNobleName, not getSamuraiName). Niji = bare female 97:170 (getCommonerName). Zabuza, Tengu and Hotaru appear in NONE of the tables, so those are authored npcdata NPCs and must be sourced differently.

- **Cite:** `reference/extracted/bindata/96_1t4652s0.bin:7,10,11 · 95_1t4649s0.bin:11 · 94_1t4651s0.bin:80,107 · 97_1t4650s0.bin:38,170,226,236 + docs/research/video-study/SYNTHESIS.md:429 + docs/research/REBUILD_READINESS.md:221`
- **Quote:** Exact-match lookup (`grep -n '^NAME$'`): 96:7 Hachisuka · 96:10 Hojo · 96:11 Honda · 95:11 Inokuma · 94:80 Kano · 94:107 Kinkiyo · 97:38 Gin · 97:170 Niji · 97:226 Shizuka · 97:236 Taka. Zabuza / Tengu / Hotaru: no hit in any of 94-98. Ledger names from SYNTHESIS.md:429 'Honda Shizuka, Honda Gin, Hojo Taka, Hachisuka Kano, Inokuma Kinkiyo, Niji,' and REBUILD_READINESS.md:221 'Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru.'
- **Lane impact:** L-content: triples the recovered coverage of bindata/procedural-name-generator and separates procedural NPCs from authored ones, which tells the port which names to generate and which to transcribe.

### `bindata/slash-line-colours-exact` — HELD [A2] ⚑ OVERTURNS LEDGER

The exact hues of the drawn slash line — the most visible element of a duel — are two constants in the input layer, identical in both builds. The player's guide line is drawn green when the slash is affordable and dark red otherwise, and the stroke tapers as the allowed distance is consumed; the enemy's line is drawn pure black.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InputManager.as:172-180,360,467-472,485-492 + reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:174,179,361,477`
- **Quote:** InputManager.as:172-180 `public static function greenLine() : * { canvas.graphics.lineStyle(thickness,39168,1,…); }` / `public static function redLine() : * { canvas.graphics.lineStyle(thickness,10027008,1,…); }` — 39168 = 0x009900, 10027008 = 0x990000. :360 `lineStyle(thickness - thickness * ((maxDistance - distanceLeft) / maxDistance),10027008,…)` — the taper. :492 the enemy line uses colour `0`. WEB §1t1541s0§.as:174,179,361 identical.
- **Overturns:** "| **art-anim-audio-feel** | … byte-exact palette |"
- **Lane impact:** L-art-anim-audio-feel: three byte-exact colours plus the taper law for the slash guide line, straight from the shipped source. Should be cross-checked against a frame before banking as final, since the frames also show a blue effect line that these constants do not explain.

### `bindata/territory-to-bitmap-transform` — HELD [A2] ⚑ OVERTURNS LEDGER

The 63x72 map bitmap and the 12-bit territory-ID space ARE reconciled, exactly, and the transform is entirely in the payload. The 12-bit fields are biased by 341, and the bitmap is offset by the constants WARMARKERSHIFTX=8, TERRSHIFTX=21, TERRSHIFTY=51. Collapsed: pixel_x = (id>>12 & 0xFFF) - 328, pixel_y = (id & 0xFFF) - 290. Every land pixel becomes one war-marker territory, so the 735 white cells ARE the shipped territory count; raw territory-x spans [329,389] and y spans [290,361], mapid spans [1347935, 1593647]. Proof: all three hardcoded towns land on land cells — Ibamaya 1405272 -> pixel (15,54), Gokura 1524045 -> (44,43), web-only Iwakuni 1519945 -> (43,39).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/QuestEngine.as:518-526, :1204-1206 + WorldMapUI.as:15,17,19,377 + WarSelectUI.as:15,17,19 + reference/decompiled/shs3_payload/scripts/§1t7934s0§.as:15,17,19 + §1t1524s0§.as:1463`
- **Quote:** QuestEngine.as:522-526 `if(mapBitmapData.getPixel(i,j) != 0) { terrX = i - WorldMapUI.TERRSHIFTX + WorldMapUI.WARMARKERSHIFTX; terrY = j - WorldMapUI.TERRSHIFTY; warMarkerList.push(terrX + 341 << 12 | terrY + 341); }` ; QuestEngine.as:1206 `return mapBitmapData.getPixel(x + WarSelectUI.TERRSHIFTX - 341 - WarSelectUI.WARMARKERSHIFTX,y + WarSelectUI.TERRSHIFTY - 341) != 0;` ; WorldMapUI.as:15 `public static var WARMARKERSHIFTX:int = 8;` :17 `TERRSHIFTX:int = 21;` :19 `TERRSHIFTY:int = 51;` ; WEB §1t7934s0§.as:15,17,19 = 8, 21, 51
- **Overturns:** "| **world-map** | 63x72 bitmap and 12-bit territory ids at unreconciled scales |"
- **Lane impact:** L-world-map: refutes bindata/map-bitmap-vs-territory-scale-unreconciled and makes the world grid fully implementable. Also identifies the ledger's 'start coordinate (21,51)' as (TERRSHIFTX, TERRSHIFTY), the territory-space origin in bitmap pixels — not a coordinate at all.

### `bindata/trap-duty-cycle-domain-measured` — HELD [A2] ⚑ OVERTURNS LEDGER

CORRECTED replacement for the false 'every trap duty cycle is a multiple of 24' corroboration. The 24 Hz engine tick is right (web SWF header framerate 24.0 + ENTER_FRAME gameloop + one keyframe per updateAnimation call), but the trap timings do NOT corroborate it. Measured over every live <property> in 93_1t4647s0.bin against the file's own schema comment: onDuration in {0,24,48}; offDuration in {0,24,36,48,60,96,1000}; startInterval in {0,6,8,12,16,18,24,30,32,36,42,48,54,64,72}. 75 values are not multiples of 24 and the gcd of the whole domain is 2. Trap timings are authored in raw ticks at 1/24 s, not in whole seconds.

- **Cite:** `reference/extracted/bindata/93_1t4647s0.bin:6-18 (schema) and :92-94,:131,:176-177,:183-184,:233-235,:243-245,:404-406,:451 (counter-examples) + reference/decrypted/shs3_payload_decoded.swf header`
- **Quote:** 93_1t4647s0.bin:451 `<obj><id>48</id><name>Trap_SpikesAuto</name><x>500</x><property>0,24,36,0,1,1,1</property></obj>` — schema :15 gives `direction, onDuration, offDuration, startInterval, active, spikelook, bigDamage`, so offDuration = 36. Also :99,:106,:198-206 `Trap_CrushingBlockAuto/ColumnAuto` offDuration = 1000. Web SWF header parsed by me: CWS v17, rect [0,16000,0,13800], framerate 24.0, 6 frames.
- **Lane impact:** L-motion/L-traps: preserves the 24 Hz result while removing a false universal that two packet claims were resting on.

### `bindata/warhex-14-states-not-7` — HELD [A2] ⚑ OVERTURNS LEDGER

The War-Room hex-state enum has FOURTEEN members with explicit integer values and two gaps, not the seven a render switch happens to touch. WarHex.as:11-37: HEX_NOTHING=0, HEX_SPAWNPOINT=1, HEX_FORWARDBASE=2, HEX_CONTROLPOINT=3, HEX_TOWN=4, HEX_POTENTIALSPAWNPOINT=5, HEX_UPCOMINGSPAWNPOINT=6, HEX_LADDER=7, HEX_DEFENSE=8, HEX_VILLAGE=9, HEX_CITY=11, HEX_CASTLE=12, HEX_DISABLEDSPAWNPOINT=13, HEX_DEMOLISHEDSPAWNPOINT=15 (10 and 14 unused). The board geometry is 6x6 at 55px pitch in BOTH axes: x = 90 + xpos*55, y = 92 + ypos*55.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/WarHex.as:11-37 + WarHexUI.as:175-176,253-254`
- **Quote:** WarHex.as:11 `public static var HEX_NOTHING:int = 0;` … :37 `public static var HEX_DEMOLISHEDSPAWNPOINT:int = 15;` (14 constants, `grep -c 'public static var HEX_' WarHex.as` = 14) ; WarHexUI.as:175-176 `this.ht = 6; this.wt = 6;` ; :253-254 `hex.x = 90 + xpos * 55; hex.y = 92 + ypos * 55;`
- **Overturns:** "| **war-room** | board topology — BLOCKER |"
- **Lane impact:** L-war-room: replaces bindata/warhex-board-6x6's seven-state list with the real fourteen-value enum plus the y pitch the claim omitted.

### `frames/HUNT-39-hardcoded-tips-in-GameEngine` — HELD [A2] ⚑ OVERTURNS LEDGER

39 hardcoded gameplay rules live in an if(dice==n) ladder in GameEngine.as and are in NO string table and NO ledger. They state, in words, mechanics that several blockers are waiting on: the item rarity colour enum (green=special, blue=rare, purple=unique - which decodes the coloured quest-item names on film), SPD driving both skill cooldown and slash length, the hold-mouse-to-run rule that project memory records as 'never sourced', the full keyboard/gesture input map (spacebar=stance, number keys=skills, drag-and-drop to aim a skill), a 12-hour crop seed constant, undead head-targeting, the village->town->city->castle upgrade ladder behind TOWN PROSPERITY, a whole duel-recording/'Duels TV' feature, chat emotes, Scavenging L5 revealing hidden paths, and AP replenishing via duels/war room.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:536-695 (39 tips); key lines :564, :568, :572, :584, :588, :592, :596, :608, :612, :616, :620, :624, :640, :644, :679, :683, :695`
- **Quote:** :564 'Tip: A green border indicates that an item is special.' :568 blue = rare :572 purple = unique. :683 'Tip: A higher speed stat will reduce skill cooldown times and also give you a longer slash line.' :640 'Tip: When not in battle, you can hold down the mouse button to keep running in that direction.' :644 'Tip: Crops grown from 12-hour seeds do not rot.' :612 'Tip: When fighting undead, target their heads.'
- **Overturns:** "memory: "§3's 'hold-run per Tip #27' was REVERSED by measurement 2026-07-25 - it was never sourced""
- **Lane impact:** items-equipment (rarity enum), combat-core (SPD->cooldown+reach, hold-run, undead heads), ui-hud (input map), world-exploration (settlement upgrade ladder), meta-social (Duels TV)

### `frames/HUNT-combat-corpus-never-opened` — HELD [A1] ⚑ OVERTURNS LEDGER

58% of the frame corpus was never read by this survey. Of 7,381 frames, only 2,675 sit in the two longplay chapter directories - and every single one of the packet's 21 cites points at a seg-NN longplay directory. 4,256 frames across 44 directories are purpose-shot 1920x1080 COMBAT/DUEL measurement stills (session24/svm-B05-mountain-duel/fight15 480, svm-A16-beach-duel 406, reach-A28-forest-duel 372, reach-B-dojo 342, reach-B-honda-duel 248, gait-duel-speeds 194, session11/stance-reach, gap-gait-hitbox, strike-travel-duration, duel_dense, combat_analysis...) and NOT ONE claim touches them. Every claim in the packet is a UI screen, menu or dialogue box. The lane this repo exists for - 1:1 duel combat feel - is 100% absent from the packet, and it is the half of the corpus shot at full resolution with self-describing measurement filenames (e.g. A_t117.400_BALANCED_lvl1_stroke235px.png, B_t783.400_LIGHT_stroke-anchored-at-body_farGap436px.png, t393.0_stance-ring-colours.png, t396.0_counter-triangle.png).

- **Cite:** `docs/gauntlet/L0/index/frames.json (directory counts) + reference/frames/session11/lead/t396.0_counter-triangle.png (1920x1080, read whole) + reference/frames/session11/stance-reach/B_t785.200_LIGHT_stroke553px_endtoend.png (1920x1080, read whole)`
- **Quote:** t396.0_counter-triangle.png: TRAINING HALL / 'STORY QUEST: ATTACK TRAINING DUMMY USING HEAVY STANCE', articulated wooden dummy, HUD 'BALANCED STANCE' with a TAN/BROWN ring round the portrait, '1257 / 1450 EXPERIENCE POINTS'. B_t785.200: live duel - 'AUTO SLASH OFF' toggle, '1 HIT COMBO' counter, enemy nameplate 'FUKUSHIMA CHIKO' over a red/green HP bar, player 'SOUND360TM', a RED SLASH LINE drawn end-to-end with a steel blade sprite at its head, portrait ring BLUE (Light stance), HP 14/20, CHI 26/31, '150% DAMAGE' buff, skill tray slots numbered 2 and 3.
- **Lane impact:** combat-core, art-anim-audio-feel, skills-meters: the entire 1:1 combat evidence base is unsurveyed. Re-run the frames survey against session11/* and session24/* before anything else.

### `frames/HUNT-gold-to-resource-exchange-rate` — HELD [A2] ⚑ OVERTURNS LEDGER

The gold-to-resource exchange rate is stated twice and identically: 1 Gold buys 10 AP or 10 Duel Tokens. Token IAP packs and a max-token cap exist too. Separately, the frame that shows the stable price shows NO AP component, so the ledger's 'stable 14c+5AP' needs its own cite for the +5AP half or should be trimmed.

- **Cite:** `strings.json["61"], ["100"], ["122"], ["4173"]-["4175"]; stable prompt at reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0048.jpg (crop 0,400-700,576 @2x)`
- **Quote:** ["61"] 'You are out of Duel Tokens.\nWould you like to get 10 more Duel Tokens for 1 Gold?' ["100"] 'You are out of AP.\nWould you like to get 10 more AP for 1 Gold?' ["4173"]/["4174"]/["4175"] '10 Duel Tokens'/'25 Duel Tokens'/'40 Duel Tokens'. frame_0048: 'STABLEHAND / WOULD YOU LIKE TO RENT A HORSE TO TRAVEL TO A NEIGHBOURING VILLAGE? / COST: 14 COINS' - no AP line rendered.
- **Overturns:** "**Economy statics:** ... stable 14c+5AP ..."
- **Lane impact:** economy: adds the hard-currency conversion rate; puts the '+5AP' half of the stable static in doubt

### `frames/HUNT-player-screen-stat-contract` — HELD [A1] ⚑ OVERTURNS LEDGER

The PLAYER screen prints a complete stat contract the ledger records nowhere: a 9-slot equipment doll (hat, mask, torso, gloves, legs, weapon, 2x ring, boots), three meters HP/CHI/AP, three stats ATK/DEF/SPD with equipment bonuses rendered separately from base, and a WEIGHT encumbrance cap. Weight appears nowhere in any of the twelve ledger systems.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0051.jpg (read whole @1.9x); corroborated at reference/extracted/ui_strings.txt:197 and :314`
- **Quote:** 'PLAYER' card: 114 COINS, 3 GOLD, level badge 2 with '787 / 1450 EXPERIENCE POINTS', 'AVAILABLE STAT POINTS: 3'; HP 10/10 (green), CHI 10/10 (blue), AP 30/30 (light blue) with a bare '30' beneath; ATK 1, DEF '1 +2' (base + bonus), SPD 1; 'ADD HP' affordance; 'WEIGHT: 14 / 100'. ui_strings.txt:197 'Weight: 50/50'; :314 'hp: 123 / 123 (hp regen 12 ) chi: 123 / 434 (chi regen 13)'.
- **Lane impact:** progression, items-equipment, ui-hud: encumbrance cap, slot count, stat/bonus split, HP+CHI regen as displayed stats

### `frames/HUNT-rebirth-picker-recoverable-from-strings` — HELD [A2] ⚑ OVERTURNS LEDGER

The rebirth/element picker is unfilmable (see the level-80 gate) but its CONTENT is A2-recoverable: the picker's own prompt string, a closed four-element set, a hard level gate and the full effect list. Ledger blocker (5) 'rebirth/element-picker UI (never filmed)' is mostly closable without a picture.

- **Cite:** `strings.json["611"], ["4155"], ["610"], ["6030"]-["6033"], ["507"]-["510"], ["6058"]-["6061"], ["4154"], ["864"]`
- **Quote:** ["611"] 'Choose an element to specialize in.' ["4155"] 'New Game +\nProgress on to the next Dan Rank and specialize in an element. \nLevel 80 required.' ["610"] '...reborn as a level 1 character while retaining your inventory, skill points and clan rank. Your current equipment will be automatically unequipped.\n\nSlash length and bank storage is increased with each dan rank.' ["6030"]-["6033"] Fire / Water / Wind / Earth Element Skills. ["864"] '[0] has rebirthed and is now Dan [1]!'
- **Overturns:** "(5) rebirth/element-picker UI (never filmed - both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements: prompt, four-element enum, level-80 gate and effect list all become buildable; only the picker's visual layout stays unheld

### `frames/HUNT-repair-cost-is-runtime-parameterised` — HELD [A2] ⚑ OVERTURNS LEDGER

The Repair-Weapon blocker is mis-specified and can never be closed by finding a frame: repair cost is a runtime fill, exactly like Forge. Reinforce is also not one constant but three material variants, and there is a second gold-priced unbreakable path via Ninja Services.

- **Cite:** `strings.json["848"], ["849"]-["852"], ["636"], ["669"], ["393"], ["4143"], ["7042"]; weapon condition field at reference/extracted/ui_strings.txt:257`
- **Quote:** ["848"] 'Repair your currently equipped weapon?\nCost: [0] coins'. ["850"]/["851"]/["852"] all read 'Reinforce ... Cost: 5000 coins' but with 1 Silver Ore / 1 Titanium Ore / 1 Uncut Diamond respectively. ["636"] 'Name your currently equipped weapon and make it unbreakable for 2 Gold?' ui_strings.txt:257 'condition: well-maintained23'.
- **Overturns:** "(3) Repair-Weapon cost (never captured)."
- **Lane impact:** economy, items-equipment: re-state the blocker as 'derive repair cost f(runtime)'; correct 'Reinforce 5000c+1 silver ore' to a three-tier material table

### `frames/HUNT-stance-triangle-and-ring-colours` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete stance rock-paper-scissors and its only hard number are held in the string table, plus the HUD portrait-ring colour enum - and none of it is in the packet. Heavy stance carries an explicit Defense -20% penalty, which is directly codeable.

- **Cite:** `strings.json["6001"], ["6003"], ["6005"], ["IDS_Q50S3NODE0"], ["IDS_Q50S3NODE1"], ["6085"]-["6087"]; visual corroboration reference/frames/session11/lead/t396.0_counter-triangle.png (tan/brown ring, BALANCED STANCE) and reference/frames/session11/stance-reach/B_t785.200_LIGHT_stroke553px_endtoend.png (blue ring, LIGHT)`
- **Quote:** ["6001"] 'Swift but light stance. Slash range is longer but damage inflicted is lower.\nEffective against Heavy Stance.' ["6003"] 'Balanced stance.\nEffective against Light Stance.' ["6005"] 'Slow but powerful stance. Damage inflicted is increased but slash range is shorter.\nEffective against Balanced Stance.\nDefense -20%' ["IDS_Q50S3NODE1"] 'Your stance is indicated by the color of the circle around your portrait: Light stance - blue, Balanced stance - brown, Heavy stance - red.'
- **Lane impact:** combat-core (counter triangle + Defense -20%), ui-hud (ring colour enum), skills-meters (per-stance hold-to-charge ultimates)

### `frames/HUNT-ui-strings-txt-is-unmined` — HELD [A2] ⚑ OVERTURNS LEDGER

reference/extracted/ui_strings.txt is a 471-line WEB-build artifact the packet uses for exactly one thing (font faces). It contains a duel BETTING system with odds, a tournament/arena mode template, a three-way damage taxonomy, next-level skill previews, HP/CHI regen fields, and the war-room rules page that v0.717 added.

- **Cite:** `reference/extracted/ui_strings.txt:7, :26, :100, :193, :197, :212, :214, :215, :257, :314`
- **Quote:** :7 '"Odds" refers to the estimated profit that you will make for each token that you bet. example: If you bet 2 tokens at 1.5 odds, you will make an estimated profit of 3 gold when your bet wins'. :26 'Odds are changed whenever someone makes a bet and are only finalized when betting is closed.' :193 'War room rules 5/6  (WINNING AND LOSING)'. :214 'level requirement: 10 - 30 autostarts upon full roster round duration: 30 min'. :100 'physical dmg: 1234 - 1235  (heavy) critical dmg: 1234-1235 *(heavy) piercing dmg: 20'. :212 'next level damage: 10 def: 20'.
- **Lane impact:** meta-social (betting + tournaments), combat-core (damage taxonomy), skills-meters (next-level deltas), and it names v0.717's extra war-room rules page

### `frames/HUNT-war-tick-is-24-hours` — HELD [A2] ⚑ OVERTURNS LEDGER

Ledger blocker (3) asks for the real-world 'day' length that governs the war tick. It is written down: troops advance every 24 hours. The same rules pages also give the capture rule, win condition, five structure types, the 500-coin contribution, terrain advantage order and a 5-coins-per-move payout.

- **Cite:** `strings.json["376"], ["372"], ["378"], ["380"]; rendering verified at reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0011.jpg, frame_0012.jpg, frame_0013.jpg`
- **Quote:** ["376"] '- Troops will advance on enemy sectors every 24 hours.\n\n- If a sector has more attacking troops than defending troops, the sector will be captured by the attackers.\n\n- The Clan that captures all the control points in the battlefield will gain control of the territory.' ["372"] '- the effect of moves is dependent on the terrain. mountains have the highest tactical advantage, followed by forests and fields.\n\n- the clan will pay the player 5 coins per move made.' ["380"] names Command HQ / Forward base / Barricades / Tunnels / Towns at 500 coins per contributing player.
- **Overturns:** "(3) real-world "day" length (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** meta-social, world-exploration, economy: the war-tick half of blocker (3) closes outright

### `frames/v0717-rewords-the-daily-streak-ladder` — HELD [A1] ⚑ OVERTURNS LEDGER

The v0.717 web client REWORDS the daily-prize streak ladder relative to the android v0.682 string table: it prepends 'AFTER'. This is a second, independent rewording class alongside the War Room rules 1/6 -> 1/7 page count, and together they mean the S0-3 android-parity hedge cannot be lifted wholesale — it can only be lifted for strings personally seen on film.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-00/frames/frame_0001.jpg (crop 0,380-700,576 @2.14x LANCZOS; source still is 1024x576)`
- **Quote:** On screen in v0.717: 'YOU HAVE CLAIMED YOUR DAILY PRIZE FOR 0 CONSECUTIVE DAYS. / AFTER EVERY 10 CONSECUTIVE DAYS: BONUS PRIZE! / AFTER EVERY 30 CONSECUTIVE DAYS: SUPER BONUS PRIZE!!!' Android table: strings.json["843"] = 'Every 10 consecutive days: bonus prize!', strings.json["844"] = 'Every 30 consecutive days: super bonus prize!!!'. THE FRAME WINS.
- **Overturns:** "S0-3 caveat: 'UI copy and combat tuning parity is NOT established' between android v0.682 and web v0.717"
- **Lane impact:** ui-hud, meta-social, and every lane porting UI copy: the android-only hedge stays on any string not confirmed from a frame

### `frames/world-map-has-a-fifth-banner-colour` — HELD [A1] ⚑ OVERTURNS LEDGER

The world-map ownership layer carries at least FIVE banner colours, not four: blue, gold, red, green AND a black banner bearing a white circular mon. A fifth side is exactly what the war-room code implies. Any rebuild modelling four factions from the clan-join screen will be missing an owner class.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg (crop 700,160-780,230 @15x LANCZOS; row context at crops 40,155-950,235 and 40,220-950,305 @1.65x)`
- **Quote:** A castle-town tile in the upper visible row flies a solid BLACK banner with a white circular emblem, distinct from the blue four-ring, gold fan, red dragon and green fist banners elsewhere in the same view. docs/gauntlet/L0/systems/meta-social.md:397-398 independently records that 'the code speaks only in side numbers 1-5 and colours'.
- **Overturns:** "the four canonical clans' identities in the war room"
- **Lane impact:** meta-social, world-exploration: model >=5 territory owners (four clans plus a neutral/shogunate side), not four

### `hunter/buff-table-and-video-contamination` — HELD [A2] ⚑ OVERTURNS LEDGER

A 13-entry buff table with exact multipliers exists and no claim mentions it: XP / DAMAGE / DEFENSE / SPEED all 150%, AP-regen and duel-token-regen both 200%, plus COINS, RARELOOT, MUTE, FULLMUTE, HELL, INJURED, MODERATOR. CRITICAL METHODOLOGICAL CONSEQUENCE: the gold '150% DAMAGE' text under the third HUD bar in the duel_dense longplay is this buff indicator, not a stance readout — BUFF_ATTACK is ACTIVE in that footage, so every damage or time-to-kill number measured off those frames is inflated x1.5.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:288-312 · reference/decompiled/shs3_android/scripts/OverworldHUD.as:1388-1425 · corroborated visually in reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop x230-560 y960-1070, 4x LANCZOS)`
- **Quote:** OverworldHUD.as:1400:                buffstr = "150% XP";
1404:                buffstr = "150% DAMAGE";
1408:                buffstr = "150% DEFENSE";
1412:                buffstr = "150% SPEED";
1416:                buffstr = "200% AP REGEN";
1420:                buffstr = "200% DUEL TOKEN REGEN";   ||   StatsManager.as:288-312 BUFF_XP 0 · BUFF_ATTACK 1 · BUFF_DEFENSE 2 · BUFF_SPEED 3 · BUFF_AP 4 · BUFF_DUELTOKENS 5 · BUFF_COINS 6 · BUFF_RARELOOT 7 · BUFF_MUTE 8 · BUFF_FULLMUTE 9 · BUFF_HELL 10 · BUFF_INJURED 11 · BUFF_MODERATOR 12
- **Lane impact:** All video-measurement lanes: any TTK/damage read from reference/frames/duel_dense/ must be divided by 1.5. L-economy and L-progression gain the whole consumable-buff layer.

### `hunter/crit-spent-on-release-not-on-hit` — HELD [A2] ⚑ OVERTURNS LEDGER

The Focus meter is emptied at slash RELEASE, before any hit test runs, in both builds. deductReloadBar() zeroes a full bar then subtracts the per-stance slashUsage, and it is called from endSlash() ahead of NPCManager.checkHit(). Damage (including the crit multiply) is frozen even earlier, at slash launch. A whiffed crit therefore costs the entire meter.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2699, :2767-2796, :3240-3244 · reference/decompiled/shs3_payload/scripts/§1t99s0§.as:2850, :2869, :2882, :3293-3297`
- **Quote:** MCSPlayer.as:2767:       internal function endSlash() : *
2778:          this.deductReloadBar();
2796:                NPCManager.checkHit(this.slashArray,offset,damage);   ||   :3242 if(this.reload == this.maxreload) 3244 this.reload = 0;   ||   :2699 this.slashDamage = this.getDamage();   ||   web §1t99s0§.as:2850 this.§1t4478s0§();  :2869/:2882 §1t1543s0§.§1t3273s0§(...)
- **Lane impact:** L-combat-core feel: the crit is a committed swing, not a rewarded hit. A recreation that refunds a missed crit plays measurably differently.

### `hunter/elemental-rebirth-reward-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The four elemental rebirths each grant +10 to the matching elemental ATK stat, DOUBLED to +20 when the player is at Dan 8 (the tenth and final rebirth), and consume one unit of stat 2202. This is the elemental-rebirth reward table and it appears in no claim in the packet.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:848-899`
- **Quote:** 849:                if(StatsManager.getPlayerStats(StatsManager.STAT_DAN) == 8)
851:                   StatsManager.changeStat(StatsManager.STAT_FIREATK,20);
853:                else if(StatsManager.getPlayerStats(StatsManager.STAT_DAN) < 8)
855:                   StatsManager.changeStat(StatsManager.STAT_FIREATK,10);
857:                StatsManager.changeStat(2202,-1);
859:                StatsManager.doRebirth();   (windrebirth :861-872, waterrebirth :874-885, earthrebirth :887-898 identical)
- **Overturns:** "7. `MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT."
- **Lane impact:** L-rebirth-elements: the reward half of the rebirth loop closes exactly. L-progression: rebirth is now fully specified — SP formula, elemental grant, currency payout.

### `hunter/focus-plus6-is-a-kill-bonus` — HELD [A2] ⚑ OVERTURNS LEDGER

The +6 Focus reward fires on a KILL, not on a landed slash. Both builds gate bonusReload() behind a count of enemies that just died this resolution pass. This inverts the meter economy the packet describes: connecting gives nothing back, so a long single-target duel drains Focus monotonically until the enemy dies.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1685-1712 · reference/decompiled/shs3_android/scripts/MCSPlayer.as:3265-3272 · reference/decompiled/shs3_payload/scripts/§1t1543s0§.as:2035-2049`
- **Quote:** NPCManager.as:1685:             if(!enemy.isDead() && enemy.checkDie())
1691:                deathCount++;
1709:          if(deathCount > 0)
1711:             StatsManager.getPlayer().bonusReload();   ||   MCSPlayer.as:3267: this.reload += 6;   ||   web §1t1543s0§.as:2047: if(_loc4_ > 0) 2049: §1t1523s0§.§1t9586s0§().§1t4479s0§();
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L-skills-meters and L-combat-core: the Focus income model changes shape — +1/frame plus a per-kill +6, with no reward for merely connecting.

### `hunter/hp-chi-regen-is-per-battle` — HELD [A2] ⚑ OVERTURNS LEDGER

HP and Chi do not regenerate on a clock — they regenerate once per battle resolution, by max/10 plus the equipped gear's regen stat, clamped to max, with a paired no-regen variant for defeats. The packet contains no claim about Chi at all, and Chi is the blue bar in the reference frames. The new-character seed block sits in the same file.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:694-712, :1724-1745`
- **Quote:** 1727:          var newhp:int = getPlayer().getHP() + maxhp / 10 + findBonusStat(STAT_HPREGEN);
1734:          var newchi:int = getPlayer().getChi() + maxchi / 10 + findBonusStat(STAT_CHIREGEN);
1742:       public static function saveHealthAfterBattleNoRegen() : *   ||   :694-712 HP/MAXHP 10 · HPREGEN 1 · CHI/MAXCHI 10 · CHIREGEN 1 · ATTACK 1 · DEFENSE 1 · SPEED 1 · LEVEL 1 · GOLD 100 · HGOLD 0 · AP/MAXAP 30 · DUELTOKENS/MAX 20 · SKILLPOINTS 0 · STATPOINTS 0
- **Overturns:** "③ real-world **"day" length** (governs expiry, farming, AP regen, war tick). ④ AP regen rate + cap."
- **Lane impact:** L-skills-meters and L-progression: the Chi meter's income model, plus a complete Stage-1 starting stat block that needs no inference.

### `hunter/interactui-service-cost-table` — HELD [A2] ⚑ OVERTURNS LEDGER

InteractUI.as holds the complete town-service action table — roughly 40 named verbs, most with an explicit cost — and no claim in the packet mentions it. Costs I read directly: repairweapon nodeLevel x 10, reinforceweapon 5000 coins, nameweapon 2 Heavenly Gold, fullhpchi 1 Heavenly Gold, convertgold 1 Heavenly Gold -> 1000 coins. The rest of the verb set: goto, close, innrest, peddlerbuy/sell, merchantbuy/sell, barberbuy, innbuy, sellcrop, travel, plant, harvest, buygoods, sellgoods, fire/wind/water/earthrebirth, deposit, withdraw, bet, chohan, buypremium, leaveclan, joincustomclanrecruit/general, forgeweapon, dailyprize, redeem, bankstorage, crafting, achievement, paytowntoll.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:783-1405`
- **Quote:** InteractUI.as:1083:                cost = 5000;   (reinforceweapon)  ||  :921-923 StatsManager.spendHeavenlyGold(1,function():* { StatsManager.changeGold(1000);   (convertgold)  ||  :974 if(StatsManager.getHeavenlyGold() >= 2 && NetworkManager.instance.isGlobalPIOConnected())   (nameweapon)  ||  :991 StatsManager.spendHeavenlyGold(1,   (fullhpchi)
- **Overturns:** "Systems formulas: DEF mitigation curve + SPD scaling; item stat-vs-level curve; sell-price formula; condition→DMG multiplier; loot/drop tables; L11–80 XP curve; prosperity thresholds + daily-sim math."
- **Lane impact:** L-economy and L-world-exploration: most of the open service/pricing surface in one file, and it fixes the premium-currency exchange rate (1 HGold = 1000 coins).

### `hunter/paperdoll-is-23-slots-plus-quadruped-extension` — HELD [A2] ⚑ OVERTURNS LEDGER

The human paperdoll is 23 slots (0..22), not 27. Both builds allocate partListLength+1 = 23 MovieClips. The four extra PART_ constants (l_shoulder 23, r_shoulder 24, l_knee 25, r_knee 26) are a QUADRUPED extension: their only readers anywhere are MCSWolf, which raises partListLength to 25 and rebinds them as front/back legs, and rebinds PART_prop3 as tail3.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120, :136-146 · reference/decompiled/shs3_android/scripts/MCSWolf.as:9-18, :148, :184-197 · reference/decompiled/shs3_payload/scripts/§1t75s0§.as:125, :159`
- **Quote:** MCSCharacter.as:120:      internal var partListLength:int = 22;
141:         for(var i:int = 0; i <= this.partListLength; i++)
144:            addChild(mc);
145:            this.partList.push(mc);   ||   MCSWolf.as:13: partListLength = 25;  :184 var r_frontleg1:MovieClip = partList[PART_r_shoulder];  :193 var r_backleg2:MovieClip = partList[PART_r_knee];  :148 var tail3:MovieClip = partList[PART_prop3];
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L-items-equipment and L-art-anim-audio-feel: the human layer stack is 23 deep, and the animal rigs are a documented 26-slot variant of the same paperdoll rather than a separate system.

### `hunter/repair-cost-formula-found` — HELD [A2] ⚑ OVERTURNS LEDGER

The Repair-Weapon cost the ledger calls 'never captured' is an explicit formula: repair = currentNodeLevel x 10 coins, paid at a town service, restoring the weapon to uses = 1. A second, premium path costs 2 Heavenly Gold and makes the weapon unbreakable + named. Both claim/repair-cost (STILL_UNHELD) and claim/repair-cost-is-two-consumables ('not a priced service') missed it.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1057-1081 · reference/decompiled/shs3_android/scripts/GetGoldPromptDialog.as:225-236 · reference/decompiled/shs3_android/scripts/GameEngine.as:1295-1297`
- **Quote:** InteractUI.as:1058:                cost = StageManager.getCurrentNodeLevel() * 10;  ||  :1072 StatsManager.changeGold(-cost);  :1073-1075 if(weapon.uses > 1) { weapon.uses = 1; }  ||  GetGoldPromptDialog.as:227: if(StatsManager.getHeavenlyGold() >= 2)  ||  strings.json["669"] = 'Your weapon broke!\nWould you like to make it unbreakable for 2 Gold?'
- **Overturns:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** L-economy: blocker ③ closes with a formula, not just a shop price. L-items-equipment inherits the uses=1 restore semantics; L-meta-social gets the 2-HGold Ninja-Services price.

### `hunter/skillui-gesture-input-mode` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

A gesture-drawn skill input mode exists in both builds and no claim mentions it: an 8-node pad (node0..node7) where the stroke's crossing order concatenates into a skill string, with green/red circle status art, per-node 4-frame states, clear / doSkill / close buttons, and the fighter posing per node crossed. It is vestigial in the shipped builds (only the invalid case '012' and one wired case '345'), but it is a whole input surface and a whole render surface absent from all 12 ledger systems.

- **Cite:** `reference/decompiled/shs3_android/scripts/SkillUI.as:6-58, :75, :117-183 · reference/decompiled/shs3_payload/scripts/§1t6980s0§.as:61-193`
- **Quote:** SkillUI.as:126:          if(this.skillStr == "012")
128:             this.redCircle.visible = true;
132:                this.nodeList[i].gotoAndStop(4);
136:             InputManager.redLine();   ||   :154 this.skillValue.push(i);  :164 StatsManager.getPlayer().doPose(i);  ||  :178 case "345": :179 BattleUI.instance.setSelectTargetMode();  :181 case "543":
- **Lane impact:** L-ui-hud and L-skills-meters: an undocumented input surface. PARTIAL because the skill-string vocabulary is stubbed in both builds, so what a completed gesture would have done is not recoverable from code.

### `hunter/tenth-rebirth-tier-exists` — HELD [A2] ⚑ OVERTURNS LEDGER

A tenth-rebirth tier DOES exist and the ledger's 'flat +25 gold, no 10th-rebirth tier' film reading is wrong in kind: rebirth pays Heavenly Gold (premium currency), +5 normally and +20 when STAT_DAN == 8. With the elemental +10/+20 rule this makes the final rebirth a deliberate double-or-quadruple tier. The surveyor quoted lines 2209-2214 of this exact function and did not report 2201-2207.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2196-2214`
- **Quote:** 2201:         if(getPlayerStats(STAT_DAN) == 8)
2203:            changeStat(STAT_HGOLD,20);
2205:         else
2207:            changeStat(STAT_HGOLD,5);
- **Overturns:** "7. `MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT. … film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** L-rebirth-elements and L-economy: 'tenthGold' is real but is 20 HGold not 100 gold, and the base is 5 HGold not 25 gold — the film read the wrong currency.

### `hunter/two-drawn-line-colours-and-the-real-red` — HELD [A2] ⚑ OVERTURNS LEDGER

The drawn-line colour constant 10027008 is 0x990000, not 0xA30000 (which is 10682368) — the packet states the wrong hex in two claims. There are also TWO named line styles, not one: greenLine() = 39168 = 0x009900 and redLine() = 10027008 = 0x990000, both 8px with ROUND caps and joins, named identically in both builds.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:172-179 · reference/decompiled/shs3_payload/scripts/§1t1541s0§.as:172-179 · reference/decompiled/shs3_android/scripts/SkillUI.as:75, :136`
- **Quote:** InputManager.as:172:      public static function greenLine() : *
174:         canvas.graphics.lineStyle(thickness,39168,1,false,LineScaleMode.NONE,CapsStyle.ROUND,JointStyle.ROUND,3);
177:      public static function redLine() : *
179:         canvas.graphics.lineStyle(thickness,10027008,1,false,LineScaleMode.NONE,CapsStyle.ROUND,JointStyle.ROUND,3);
- **Lane impact:** L-art-anim-audio-feel and L-combat-core: under the 1:1 licence ruling the blade stroke must be #990000, and the recreation needs the #009900 companion stroke for the gesture surface.

### `hunter/web-focus-bar-dead-zone-is-48` — HELD [A2] ⚑ OVERTURNS LEDGER

The web v0.717 Focus bar's hidden dead zone is 48, not the 24 the packet reports from the Android build. Displayed fill = (reload - 48) / (192 - 48), so the bar reads exactly zero precisely while reload <= 48, which is exactly when the stance change is refused: the bar and the CANNOT CHANGE STANCE gate are the same predicate. This is also the constant that makes the longplay measurement come out right — 44.7 px/s predicted vs 42.5 px/s measured, against 38.3 px/s from the Android-24 model.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:326-333 · contrast reference/decompiled/shs3_android/scripts/MCSPlayer.as:1163-1168 and :3272`
- **Quote:** §1t113s0§.as:326:      public function §1t5205s0§(param1:int, param2:int) : *
328:         var _loc3_:Number = (param1 - 48) / (param2 - 48);
329:         if(_loc3_ < 0)
331:            _loc3_ = 0;
333:         this.§1t5182s0§.bar.scaleX = _loc3_;   ||   android MCSPlayer.as:1163: this.tempreload = this.reload - 24;  :1168 updateReload(this.tempreload / (this.maxreload - 24));
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L-ui-hud and L-skills-meters: the Focus bar render contract for v0.717. Corrects claim/focus-meter-numerics and claim/focus-bar-is-the-third-hud-bar, and adds an eighth row to the build-divergence table.

### `hunter/web-speed-cooldown-cap-is-600` — HELD [A2] ⚑ OVERTURNS LEDGER

Seventh build-divergence row: the SPEED-to-cooldown transfer function is capped at 600 in web v0.717 and 300 in Android v0.682, so the web build needs twice the SPEED to reach the same 50% cooldown reduction. The surveyor marked this PARTIAL because a literal search for '300 * 0.5' found nothing in the web tree — which is exactly what a doubled constant does to that search.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2279-2296 · contrast reference/decompiled/shs3_android/scripts/StatsManager.as:1844-1860`
- **Quote:** 2289:      internal static function §1t9590s0§(param1:int) : Number
2291:         if(param1 > 600)
2293:            param1 = 600;
2295:         return 1 - param1 / 600 * 0.5;   ||   android StatsManager.as:1856 if(speed > 300) 1858 speed = 300; 1860 return 1 - speed / 300 * 0.5;
- **Overturns:** "④ SPD→cooldown formula."
- **Lane impact:** L-skills-meters blocker ④ and L-progression blocker ① close for the RIGHT build. Also confirms getBaseReload = 48 + SPEED*6 is identical in both (StatsManager.as:1841 = §1t1523s0§.as:2276).

### `itemdata-hunter/full-bar-is-the-crit` — HELD [A2] ⚑ OVERTURNS LEDGER

A full reload bar IS the crit condition, and stance mastery scales damage — neither is mentioned anywhere in the packet, which treats the bar purely as a slash budget. getDamage rolls baseDamage = minDamage + random()*damageRange, applies a stance factor (LIGHT x(0.5 + 0.5*lightMastery*0.01), BALANCED x(1 + 0.5*balancedMastery*0.01), HEAVY/DUAL/REVERSED x1.5), and then, only when reload == maxreload, returns maxDamage*1.2 + STAT_CRITICALDMG (x1.5 in LIGHT).

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3198-3223`
- **Quote:** internal function getDamage() : int { var baseDamage:int = this.minDamage + Math.random() * this.damageRange; switch(this.stance) { case LIGHT_STANCE: maxDamage = baseDamage * (0.5 + 0.5 * this.lightMastery * 0.01); ... case HEAVY_STANCE: case DUAL_STANCE: case REVERSED_STANCE: maxDamage = baseDamage * 1.5; } if(this.reload == this.maxreload) { if(this.stance != LIGHT_STANCE) { return maxDamage * 1.2 + this.STAT_CRITICALDMG; } return maxDamage * 1.5 + this.STAT_CRITICALDMG; } return maxDamage; }
- **Lane impact:** L-combat-core / L-skills-meters: this is the mechanism behind 'OG has NO Critical meter (Focus buys evasion)' in the session-11 memory — the crit is bought by a FULL reload bar, and the stance mastery stats are damage multipliers, not cosmetic ranks.

### `itemdata-hunter/reach-is-per-stance` — HELD [A2] ⚑ OVERTURNS LEDGER

Reach IS per-stance in the engine, closing the ledger blocker the packet's own claim #0 said was still open. MCSPlayer.setStance converts baseSlashLength (StatsManager.getBaseSlashLengthVal = 120 + floor((90 + DAN*5) * speed / (20 + speed))) into the live reach: LIGHT x1.5, BALANCED x(1 + 0.5*balancedMastery*0.01), HEAVY x(0.5 + 0.5*heavyMastery*0.01) floored at 100, REVERSED x1.5, DUAL x1 floored at 100 — then pushes it to InputManager.setMaxDistance. Note LIGHT carries no mastery term at all; lightMastery is spent on damage instead (MCSPlayer.as:3205).

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3019-3094`
- **Quote:** case LIGHT_STANCE: this.slashLength = this.baseSlashLength * 1.5; ... case BALANCED_STANCE: this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01); ... case HEAVY_STANCE: this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01); if(this.slashLength < 100) { this.slashLength = 100; } ... case REVERSED_STANCE: this.slashLength = this.baseSlashLength * 1.5; ... case DUAL_STANCE: this.slashLength = this.baseSlashLength; if(this.slashLength < 100) { this.slashLength = 100; } ... InputManager.setMaxDistance(this.slashLength);
- **Overturns:** "Combat numbers: reach cap in px per stance."
- **Lane impact:** L5 COMBAT CORE / L-art-anim-feel: the ledger's 'reach cap in px per stance' blocker is CLOSED. Reach = getBaseSlashLengthVal(speed) x the stance factor above, in an 800-px-wide game stage (StatsManager.as:80), i.e. 2.4 screen px per game px in a 1080p capture.

### `itemdata-hunter/reload-bar-max-is-flat-not-speed` — HELD [A2] ⚑ OVERTURNS LEDGER

The reload/Focus bar's maximum is a flat constant, not 48 + SPEED*6, and the two builds use DIFFERENT constants. StatsManager.getBaseReload() (48 + SPEED*6) is computed, passed into MCSPlayer.initPlayer and stored at :190 — and then never read anywhere in the bundle. :239 unconditionally sets maxreload = 5*24 = 120 (EnemyClone.as:77 does the same). The web v0.717 build sets 8*24 = 192. A recreation that scales the meter with SPEED is modelling something the original does not do.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:190 and :239; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249`
- **Quote:** MCSPlayer.as:190 'this.baseReload = baseReload;' — grep across the bundle finds declaration (:105), parameter (:182) and this assignment, and NO read. MCSPlayer.as:239 'this.maxreload = 5 * 24;'. §1t99s0§.as:249 'this.§1t4415s0§ = 8 * 24;'.
- **Lane impact:** L-skills-meters / L-combat-core / L-ui-hud: the Focus/reload max is a CONTRACT constant of 192 for the web v0.717 target. 48 + SPEED*6 must not be implemented.

### `itemdata/nine-paperdoll-slots-are-fully-named` — HELD [A2] ⚑ OVERTURNS LEDGER

The nine stat-bearing equipment slots are completely named in AS3 and match the nine paperdoll boxes box-for-box: {0 EQ_ARMOR, 1 EQ_GLOVES, 3 EQ_HAT, 5 EQ_MASK, 7 EQ_PANTS, 8 EQ_SHOES, 9 EQ_WEAPON, 11 EQ_ACCESSORY1, 12 EQ_ACCESSORY2}. The four body-only indices findBonusStat skips are 4 EQ_HEAD, 6 EQ_NECK, 10 EQ_SCABBARD, 2 EQ_HAIR. Nothing has to be invented for the two ring boxes.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:262-286 (EQ_* enum, 13 entries) and :1943-1945 (findBonusStat skip list); corroborated visually at reference/frames/s21_weapon/t708.0.png, crop (170,240)-(870,1045)`
- **Quote:** StatsManager.as:284 — 'internal static var EQ_ACCESSORY1:int = 11;'  ·  :286 — 'internal static var EQ_ACCESSORY2:int = 12;'  ·  :1943-1945 — 'for(var q:* = 0; q < 13; q++) { if(q != EQ_HEAD && q != EQ_NECK && q != EQ_SCABBARD && q != EQ_HAIR && !(skipWeapon && q == EQ_WEAPON))'. In the t708.0 crop the nine boxes are, in reading order: hat (straw hat, filled) / mask (ghost outline); armor (grey robe, filled) / gloves (ghost); pants (white hakama, filled) / weapon (pickaxe, filled); ring (ghost) / shoes (sandals, filled) / ring (ghost).
- **Overturns:** "itemdata/paperdoll-9-boxes-13-indices: 'two of the nine boxes are ring/accessory slots that the named AS3 enum does not cover'"
- **Lane impact:** L3 art-anim and L8 UI: the inventory screen's slot indices are contract, not inference — corrects itemdata/paperdoll-9-boxes-13-indices, which asserted the enum does not cover the two ring boxes.

### `itemdata/reload-bar-max-is-a-hard-constant-and-diverges` — HELD [A2] ⚑ OVERTURNS LEDGER

The reload/focus bar MAXIMUM is a hard-coded constant, not a SPEED formula, and it DIVERGES between builds: 5*24 = 120 on Android v0.682 and 8*24 = 192 on web v0.717. In both builds the value StatsManager.getBaseReload() computes (48 + SPEED*6) is passed into initPlayer, stored in a field, and never read by anything - it is dead code. This is a third android-vs-web tuning divergence beyond the two in itemdata/android-vs-web-constants-diverge, and it is what refutes itemdata/slashusage-is-a-reload-economy's bar-max half.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:105, :182, :190, :239 and EnemyClone.as:49 and :77; reference/decompiled/shs3_android/scripts/StatsManager.as:1839-1842; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:103, :191, :249 and §1t4904s0§.as:49 and :77`
- **Quote:** MCSPlayer.as:239 — 'this.maxreload = 5 * 24;' set INSIDE initPlayer, after :190 'this.baseReload = baseReload;'. MCSPlayer.as:105 — 'internal var baseReload:int = 48;'. StatsManager.as:1839-1842 — 'internal static function getBaseReload() : int { return 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6; }'. Web: §1t99s0§.as:249 — 'this.§1t4415s0§ = 8 * 24;' and §1t99s0§.as:103 — 'internal var §1t4419s0§:int = 48;'. grep -rn "baseReload" reference/decompiled/shs3_android/scripts/ returns MCSPlayer.as:105,:182,:190 and EnemyClone.as:49 — declaration, parameter, assignment, copy. 
- **Overturns:** "itemdata/slashusage-is-a-reload-economy: 'the bar's max is 48 + SPEED*6, its floor is 24'"
- **Lane impact:** L1/L5 COMBAT CORE: the slash economy must be modelled as a flat 192-frame (8 s at 24 fps) bar for v0.717 fidelity, NOT as 48 + SPEED*6. SPEED does not lengthen the bar at all; it only affects reach and cooldowns. L6/L3: one more constant that must name its build. Also a general methodology lesson — a value that is computed and passed is not thereby used.

### `itemdata/two-gold-items-are-coin-buyable` — HELD [A2] ⚑ OVERTURNS LEDGER

Exactly two premium items carry a <heavenlyprice> but NO <baseprice> tag, so XMLItem's default fires and they are purchasable for 1 coin: item 2212 (heavenlyprice 5) and item 7049 (heavenlyprice 3). Every other Gold item writes <baseprice>0</baseprice>. This is the counterexample to 'Gold-only, not buyable with coins'.

- **Cite:** `reference/extracted/itemdata.xml:2446-2459 (item 2212) and :5218-5226 (item 7049); reference/decompiled/shs3_android/scripts/XMLItem.as:86-93 (and web parity reference/decompiled/shs3_payload/scripts/§1t104s0§.as:84-91)`
- **Quote:** itemdata.xml:2446-2454 — '<id>2212</id><type>10</type><name>4400</name><unique>1</unique><heavenlyprice>5</heavenlyprice><weight>0</weight><nogive>1</nogive><nodrop>1</nodrop><desc>4401</desc>' — no <baseprice> line at all. itemdata.xml:5218-5225 — '<id>7049</id><type>3</type><name>4346</name><unique>1</unique><heavenlyprice>3</heavenlyprice><defense>2</defense><weight>1</weight><desc>4347</desc>' — likewise. XMLItem.as:86-93 — 'if(xml.baseprice.toString() != "") { this.gvalue = xml.baseprice; } else { this.gvalue = 1; }'.
- **Overturns:** "itemdata/gold-catalogue: 'Every one of these rows also carries <baseprice>0</baseprice> — Gold-only, not buyable with coins.'"
- **Lane impact:** L6 economy: the premium catalogue is 301 Gold-only rows plus 2 that also carry a 1-coin price. A recreation that hard-codes 'heavenlyprice > 0 implies coin price 0' will diverge on these two rows.

### `payload/repair-weapon-cost-is-a-template-not-a-constant` — HELD [A2] ⚑ OVERTURNS LEDGER

The Repair-Weapon cost can never be captured as a constant, because it is not one. The confirmation string is a runtime template with a substitution slot, structurally identical to the Forge string whose '700 coins' this packet already re-labelled as f(weapon level). Blocker 'Repair-Weapon cost (never captured)' should be re-stated as 'Repair cost is f(weapon), formula unknown' rather than treated as a missing number.

- **Cite:** `docs/gauntlet/L0/index/strings.json["848"], parsed from reference/extracted/android/118_Mobile_Lang_EN.bin; frame corroboration of the sibling templates at reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0040.jpg (crop 0,370-1024,576 @1.46x) and frame_0042.jpg (crop 0,370-1024,576 @1.46x)`
- **Quote:** strings.json["848"] = 'Repair your currently equipped weapon?\nCost: [0] coins' — one substitution slot, no material line. Compare strings.json["845"] = 'Forge an iron sword (level [0])?\nCost: [1] coins\nMaterials needed: 2 Iron Ore', whose runtime fill I read off frame_0040 as 'FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS', and strings.json["850"] (Reinforce), whose fixed 5000-coin cost I read off frame_0042.
- **Overturns:** "Repair-Weapon cost (never captured)"
- **Lane impact:** economy, items-equipment: stop hunting for a repair PRICE; the deliverable is a repair COST FUNCTION

### `actionscript/stance-triangle-second-android-site` — HELD [A2]

The stance counter-triangle has a second Android implementation site beyond MCSPlayer: EnemyClone applies the same x1.2 unfavourable multiplier with the same white 16777215 popup. Both builds therefore spread the rule across MCSPlayer plus its EnemyPlayer-derived subclasses, and neither build applies it in the plain NPC class.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyClone.as:434-441 (compare MCSPlayer.as:3701-3707; absent from NPC.as:429-460 and from web §1t68s0§.as:465-481)`
- **Quote:** EnemyClone.as:434:            if(stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE || stance == BALANCED_STANCE && enemyStance == HEAVY_STANCE || stance == HEAVY_STANCE && enemyStance == LIGHT_STANCE)
EnemyClone.as:436:               damage *= 1.2;
EnemyClone.as:439:                  damagetextcol = 16777215;
- **Lane impact:** L-combat-core / L-enemies-ai: fixes the scope of the triangle — it is a duellist/player-vs-player rule in BOTH builds, not something web widens to field mobs.

### `actionscript/unbreakable-and-reinforce-prices` — HELD [A2]

Two more previously-uncaptured service prices sit in the same switch and dialog: reinforce/upgrade weapon is a flat 5,000 coins, and making a weapon unbreakable (which also names it) costs 2 Heavenly Gold.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1082-1096 and GetGoldPromptDialog.as:225-235 (prompt copy at docs/gauntlet/L0/index/strings.json["669"])`
- **Quote:** InteractUI.as:1083:               cost = 5000;   ||   GetGoldPromptDialog.as:227: if(StatsManager.getHeavenlyGold() >= 2)   ||   strings.json["669"] = "Your weapon broke!\nWould you like to make it unbreakable for 2 Gold?"
- **Lane impact:** L-economy: two more priced services with exact numbers; premium (Heavenly Gold) currency confirmed as a distinct wallet.

### `actionscript/web-weapon-parry-lives-in-the-npc-class` — HELD [A2]

The weapon-part parry (zero damage, hit not consumed) exists in web v0.717 but in the NPC class, not MCSPlayer. Neither build gives it to player-derived defenders, so it is an NPC-defender-only surface — worth stating explicitly because the mechanic is easy to over-generalise into a universal parry.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:458-461 (part index §1t12380s0§ = 3 = PART_weapon at §1t75s0§.as:19); absent from §1t99s0§.as:3736-3747 and from shs3_android MCSPlayer.as:3687-3697`
- **Quote:** 458:             case mcs.§1t6231s0§[§1t75s0§.§1t12380s0§]:
459:                this.§1t3256s0§ = false;
460:                _loc3_ = 0;
461:                return false;
- **Lane impact:** L-combat-core: corrects the cite for the parry half of the behead/parry claim and bounds the mechanic to NPC defenders.

### `bindata/NEW-place-name-table-has-one-dead-row` — HELD [A2]

The place-name table holds 677 entries but the lookup can only reach indices 0..675, so its last row is unreachable dead data.

- **Cite:** `reference/extracted/bindata/98_1t4653s0.bin:677 + reference/decompiled/shs3_android_payload/scripts/NameGenerator.as:147-148,158`
- **Quote:** NameGenerator.as:147 `var namex:int = territoryx % 137;` :148 `var namey:int = territoryy % 26;` with getTownName1 called only when `namex < 26`, and :158 `var index:int = namex * 26 + namey;` — so index max = 25*26+25 = 675. 98_1t4653s0.bin:676 `Uenohara` is the last reachable row; :677 `Yamanashi` can never be selected.
- **Overturns:** "Place-name grid is 26x26 = 676 reachable entries indexed namex*26+namey; the shipped table has 677 rows, the last (Yamanashi) being unreachable."
- **Lane impact:** Prevents an off-by-one in any port of the world-naming algorithm and settles the 'usable row count' wording.

### `bindata/NEW-swf-690-is-480-plus-bar` — HELD [A2]

The apparent contradiction between the web SWF header's 800x690 stage rect and the 800x480 gameplay canvas is not a contradiction — the engine declares both, with 690 being the stage height WITH the bar. This reconciles the frame measurement (1816x1080 pillarboxed, aspect 1.6815) with the payload header without anyone having to lose.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/GameEngine.as:269-271`
- **Quote:** 269 `var originalWidth:int = 800;` 270 `var originalHeight:int = 480;` 271 `var originalHeightWithBar:int = 690;` — inside `internal static function resizeHandler(event:Event) : void`.
- **Overturns:** "Stage is 800x480 gameplay; 800x690 is the stage including the bar. The SWF header rect (twips [0,16000,0,13800]) is the with-bar figure, not a conflicting stage size."
- **Lane impact:** Closes the open conflict carried by bindata/aspect-frame-beats-swf-header without weakening the frame-wins invariant — the frame and the header were measuring different rectangles.

### `bindata/NEW-web-android-survival-data-differ-in-14-lines` — HELD [A2]

The web survival/war wave table and its Android counterpart are not identical: exactly 14 lines differ, all in the late 449/450/451 waves, where the web build repeats the enemy pair and appends a 443 (Soldier). Wave count, enemy count, spawn geometry and the 700-710 slots are identical.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin:466,471,479,484,492,497,505,510,518,523,531,536,544,549 vs reference/extracted/android/109_WarHexUI_SurvivalModeData.bin (same lines)`
- **Quote:** web :466 `<id>449|454|449|454|443</id>` vs android :466 `<id>449|454</id>`; web :492 `<id>450|455|450|455|443</id>` vs android `<id>450|455</id>`; web :518 `<id>451|456|451|456|443</id>` vs android `<id>451|456</id>`. All other 542 lines are byte-identical; both files are 556 lines, 39 <wave>, 87 <enemy>.
- **Overturns:** "Web v0.717 war waves are denser than Android v0.682 in the final nine waves (pair repeated + one Soldier appended). Use the web file (bindata/119) for v0.717 tuning."
- **Lane impact:** Gives a concrete, bounded measurement of web-vs-android data drift instead of a blanket caveat: 14 lines out of 556, all late-wave density.

### `bindata/NEW-web-payload-is-decompiled-parity-is-checkable` — HELD [A2]

The WEB v0.717 payload is decompiled and on disk at reference/decompiled/shs3_payload/scripts/ — 1,079 .as files with obfuscated identifiers (§1t58s0§.as etc.). Every Android-v0.682 cite in this packet is therefore parity-checkable against the actual web build, and the gauntlet's standing 'android string while asserting web behaviour' hole is narrower than assumed. I used it twice: the RNG LCG is identical in both builds, and the AnimData post-clip hold table carries the same value sequence.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t58s0§.as:84-85 and :12-20; reference/decompiled/shs3_payload/scripts/§1t783s0§.as:42-145`
- **Quote:** §1t58s0§.as:84 `this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;` :85 `return this.randomSeed / 233280;` — with the same negate-negative-seed-then-burn-one-rnd() constructor at :12-20. §1t783s0§.as duration ladder = 10,15,24,6,24,10,4,8,10,12,6,6,2,20,2,6,48,6,6,50,24,24,24,24,24,6,12,6,12 (+ one extra +12 case at :145).
- **Overturns:** "Web v0.717 code IS recovered (obfuscated). RNG and animation hold-table are byte-equivalent across builds; other android-only cites can and should be parity-checked here before being marked as parity holes."
- **Lane impact:** Removes the blanket build-parity caveat from every AS3-sourced claim in this lane; each one is now individually checkable rather than presumptively android-only.

### `bindata/default-block-overrides-all-traps` — HELD [A2]

The trap system ships with a debug override the packet never mentions, and it is the source of the census inflation in bindata/trap-census-and-800-is-one-screen. RoomGenNode checks for a <default> element in traproomdata BEFORE any tier selection and, if present, replaces every trap room in the game with it. 93_1t4647s0.bin:22-30 is exactly that block, shipped commented out — which is why raw greps of the file return 70 rooms and 314 objects instead of the live 69 and 297.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/RoomGenNode.as:2437-2440 + reference/extracted/bindata/93_1t4647s0.bin:22-30`
- **Quote:** RoomGenNode.as:2437-2440 `if(QuestEngine.trapRoomData.§default§.toString() != "") { trapRoom = QuestEngine.trapRoomData.§default§.room; }` — evaluated before the `else if(roomList.room.length() > 0)` tier branch at :2441. 93_1t4647s0.bin:22-30 `<!--<default>` … `<room><width>1000</width>` + 4x Trap_ElementAuto … `</room></default>-->`
- **Lane impact:** L-traps: explains a live counting trap in this source and documents a shipped dev switch.

### `bindata/item-colour-palette-11` — HELD [A2]

An eleven-entry exact-hue palette used for procedurally generated quest items, selected by rng.rand(11) and applied through ColorCode.changeColor. Present in three classes in the Android build and in the web build.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/QuestGenerator.as:38 · ItemGenerator.as:701 · Obj_PickableItemProcGen.as:57-60 + reference/decompiled/shs3_payload/scripts/§1t8608s0§.as:60`
- **Quote:** Obj_PickableItemProcGen.as:57-60 `var colorindex:int = rng.rand(11); var colorhexlist:Array = [16711680,16737792,16763904,39168,13311,6684927,16751103,6697728,16777215,10066329,0]; this.color = colorhexlist[colorindex]; ColorCode.changeColor(this.primary,this.color);` = #FF0000 #FF6600 #FFCC00 #009900 #0033FF #6600FF #FF99FF #663300 #FFFFFF #999999 #000000
- **Lane impact:** L-art: eleven exact OG hues, a preferred fidelity target. Scoped to procgen quest items, not to the fighter.

### `bindata/matrix-nodes-and-reorder-frames` — HELD [A2]

Two measured coverage numbers nobody in the packet states. (1) Of the 81,706 <n> nodes across the 19 animdata blobs, 79,867 use the plain rotation form and 1,839 (2.25%) use the a/b/c/d 2x2 matrix form — concentrated in 114 (spider, 817) and 108 (human, 492), spread over 15 of the 19 blobs. matA spans -101..150 in fixed-point x100, so parts are mirrored and scaled up to 1.5x, not merely rotated. (2) There are 258 <f r="1"> layer-reorder frames across all 19 blobs; claim bindata/sprite-compositing-contract's '89 in file 108' is exact but is only a third of the total. Also: FrameData.setVisible hides only slots 0..21, so prop3(22), l_shoulder(23), r_shoulder(24), l_knee(25) and r_knee(26) are never hidden, then hat and crotch are force-shown.

- **Cite:** `reference/extracted/bindata/114_1t4641s0.bin and 108_1t4635s0.bin (regex census over 1[01][0-9]_*.bin) + reference/decompiled/shs3_android_payload/scripts/FrameData.as:74-89`
- **Quote:** Measured: nodes with r= 79,867 · nodes with a/b/c/d 1,839 · per-file {114:817, 108:492, 116:171, 102:157, 110:54, 104:32, 113:32, 106:21, 118:16, 100:14, 111:14, 115:14, 101:2, 112:2, 103:1} · matA range -101..150 · <f r="1"> total 258. FrameData.as:77 `var partMax:int = 22;` then :78-81 hides 0..21 only, :87-88 `mcs.partList[MCSCharacter.PART_hat].visible = true; mcs.partList[MCSCharacter.PART_crotch].visible = true;`
- **Lane impact:** L-art-anim: sizes the remaining transcription work honestly (src/config/ogAnims.ts already models the matrix quad, so this is coverage, not a bug) and names an engine asymmetry a faithful renderer must reproduce.

### `bindata/stage-letterbox-algorithm` — HELD [A2]

The engine's own letterbox/pillarbox algorithm, which resolves the apparent 800x690-vs-800x480 contradiction between the web SWF header and the longplay frames. The base canvas is 800x480; 690 is 800x480 plus a 210px friend bar that is only shown when the window is TALLER than 800/690. The engine fits width or height, centres with an offset, and publishes stageScale / stageOffsetX / stageOffsetY / stageFitWidth / stageBaseWidth / stageBaseHeight — the same values InputManager uses to convert mouse coordinates back into stage space.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/GameEngine.as:267-312 + InputManager.as:185-186`
- **Quote:** GameEngine.as:269-274 `var originalWidth:int = 800; var originalHeight:int = 480; var originalHeightWithBar:int = 690; var originalAspectRatio:Number = originalWidth / originalHeight; var originalWithBarAspectRatio:Number = originalWidth / originalHeightWithBar; var newAspectRatio:Number = stageMC.stageWidth / stageMC.stageHeight;` ; :293-306 fit-width vs fit-height with `offsetX = (stageMC.stageWidth - originalWidth * newScale) / 2;` ; :307-312 publishes stageScale/stageOffsetX/stageOffsetY/stageFitWidth/stageBaseWidth/stageBaseHeight ; InputManager.as:185-186 `mouseX = (args.stageX - StatsMa
- **Lane impact:** L-render/L-input: the frame still wins on what the playfield is (1816x1080 measured, 5:3), and this is the code that produces those pillars. It also gives the exact screen-to-stage mapping any input port needs.

### `bindata/two-more-trap-placement-rules` — HELD [A2]

Trap-room placement has FIVE paths, not the three in bindata/trap-room-placement-and-level-gate. A fourth converts key rooms into ROOM_TRAPKEY, and a fifth places the veryhard tier as a dedicated 6-room route — which is exactly why veryhard alone gets the daily reroll.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/RoomGenNode.as:78,1978-1981,2378 + DungeonGenerator.as:967`
- **Quote:** RoomGenNode.as:1978-1981 `else if(this.roomType == ROOM_KEY && this.isEnterFromLeft() && rng.rand(2) == 0) { this.roomType = ROOM_TRAPKEY; }` ; :2378 `if(this.roomType == ROOM_TRAP || this.roomType == ROOM_TRAPKEY)` re-enters the lvl<10 / lvl<50 gate ; :78 `public static var ROOM_TRAPVERYHARD:int = 35;` ; DungeonGenerator.as:967 `traproomIndex = this.createRoute(traproomIndex,nodeid,bg,6,rng,RoomGenNode.ROOM_TRAPVERYHARD,RoomGenNode.ROOM_TRAPVERYHARD,roomArray,null,null,NodeGenerator.EXIT_N,true);`
- **Lane impact:** L-traps: completes the placement model that bindata/trap-room-placement-and-level-gate started.

### `bindata/web-build-owns-the-bindata-map` — HELD [A2]

The web bindata -> consumer mapping is provable FROM THE WEB BUILD, without relying on Android class names, which closes the S0 build-parity hole for the structural claims. The web AS3 is symbol-obfuscated (which is why the Android decompile was necessary at all), but the ByteArrayAsset bindings survive: NameGenerator §1t136s0§ binds 94/97/95/96/98 in male/female/noble/samurai/place order; QuestEngine §1t1524s0§ owns 93 (traproomdata) and 92 (map bitmap); WarHexUI §1t7785s0§ owns 119 (survivalmodedata); MCSCharacter §1t75s0§ owns all 19 animdata blobs.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t136s0§.as:10-18 · §1t1524s0§.as:83,87 · §1t7785s0§.as:13 · §1t75s0§.as:79-103`
- **Quote:** §1t136s0§.as:10-18 `internal static const §1t11470s0§:Class = §1t4651s0§;` (=94 male) `… §1t11471s0§:Class = §1t4650s0§;` (=97 female) `… §1t11472s0§:Class = §1t4649s0§;` (=95 noble) `… §1t11473s0§:Class = §1t4652s0§;` (=96 samurai) `… §1t11474s0§:Class = §1t4653s0§;` (=98 place) — the same declaration order as Android NameGenerator.as:10-18. §1t1524s0§.as:83 `internal static const §1t9843s0§:Class = §1t4647s0§;` and :87 `… = §1t4648s0§;`. §1t7785s0§.as:13 `internal static const §1t12534s0§:Class = §1t4646s0§;`.
- **Lane impact:** Cross-cutting: upgrades bindata/procedural-name-generator, bindata/trap-dungeon-system and bindata/survival-is-warroom-content from Android-inferred to web-proven.

### `bindata/web-has-third-hardcoded-town` — HELD [A2]

A located WEB-vs-ANDROID divergence: the web build (v0.717) getPlaceName has THREE hardcoded towns, the Android build (v0.682) has only two. The web adds territoryID 1519945 -> 'Iwakuni', which decodes under the recovered transform to bitmap pixel (43,39) — a land cell. This is a concrete instance of the S0 build-parity caveat and a reason to prefer the web decompile wherever it is legible.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t136s0§.as:140-151 vs reference/decompiled/shs3_android_payload/scripts/NameGenerator.as:137-144`
- **Quote:** WEB §1t136s0§.as:140-151 `if(param1 == 1405272) { return "Ibamaya"; } if(param1 == 1524045) { return "Gokura"; } if(param1 == 1519945) { return "Iwakuni"; }` — ANDROID NameGenerator.as:137-144 stops after Gokura.
- **Lane impact:** L-world-map / build-parity: proves the two builds' content is NOT identical and gives the first measured example.

### `frames/HUNT-death-card-header-and-warroom-death` — HELD [A1]

The death card header DOES resolve to the string table even though its two buttons do not, and there is a separate war-room death string nobody has surfaced. Small but it tightens claim 6: the card is a mix of table-backed and hardcoded copy.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-22/frames/frame_0026.jpg (read whole @1.9x) vs strings.json["92"] and ["831"]`
- **Quote:** Frame header 'YOU WERE DEFEATED!' == strings.json["92"] 'You were defeated!' exactly. strings.json["831"] = 'You were defeated in the war room!' - a second, war-room-specific defeat path that never appears in any ledger system.
- **Lane impact:** ui-hud, meta-social

### `frames/HUNT-duel-combat-hud-widgets` — HELD [A1]

The duel combat HUD carries three widgets no claim mentions: an AUTO SLASH toggle, an enemy nameplate that prints the opponent's level in parentheses over an HP bar, and a CANNOT CHANGE STANCE lock state during duels.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0019.jpg (read whole @1.9x); labels at strings.json["619"], ["620"], ["125"], ["208"]`
- **Quote:** Frame: 'AUTO SLASH OFF' button top-left; opponent nameplate 'TYLUV (3)' above a green HP bar; player status line reads 'CANNOT CHANGE STANCE' beneath 20/20 HP and 10/10 CHI; skill tray slots numbered 2 and 3. strings.json["619"]='Auto Slash Off', ["620"]='Auto Slash On', ["125"]='Stance Restriction', ["208"]='Change Stance'.
- **Lane impact:** combat-core, ui-hud

### `frames/HUNT-duel-refresh-token-delta` — PARTIAL [A1]

During the duel-list REFRESHING... modal the token widget renders TWO values where the settled screens render one, which is an animated 10-token delta on the refresh action. Direction is unresolved from three frames, so this is a lead for a dense re-extract, not a number to bank.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-03/frames/frame_0016.jpg (crop 50,60-220,180 @6x), against frame_0017.jpg and frame_0018.jpg (same crop)`
- **Quote:** frame_0016 (REFRESHING... modal up): '40' inside the skull-diamond box AND a bare '30' printed directly under the 'DUEL TOKENS' caption. frame_0017 and frame_0018: '40' only, no second number.
- **Lane impact:** meta-social, economy: probable 10-token refresh cost; needs a dense re-extract of seg-03 around t(frame_0016) to settle the direction

### `frames/HUNT-fourth-clan-and-domain-collision` — HELD [A1]

Two corrections to the clan set. First, the fourth (green-fist) crest resolves: Clan Midori Ken - the four clan names are closed at Aka Ryu, Midori Ken, Aoi Hoiru, Ki Sensu. Second, the game contradicts itself on domains: two different clan cards both claim the NORTH-EAST, so a rebuild that mirrors a clean four-point compass will diverge from the OG.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0007.jpg and frame_0001.jpg (both read whole @1.9x); names at strings.json["289"]-["292"]; bios at strings.json["326"], ["327"]`
- **Quote:** frame_0007: 'CLAN KI SENSU RULES THE DOMAIN IN THE NORTH-EAST.' frame_0001: 'CLAN AKA RYU RULES THE DOMAIN IN THE NORTH-EAST.' Same compass point, two clans. Names: ["289"] 'Aka Ryu Crops', ["290"] 'Midori Ken Crops', ["291"] 'Aoi Hoiru Crops', ["292"] 'Ki Sensu Crops' (Midori = green, Ken = fist -> the green-fist crest).
- **Lane impact:** meta-social: completes the crest-to-name binding for all four clans and logs an OG defect so a rebuild does not 'fix' it silently

### `frames/HUNT-item-rarity-colour-on-film` — HELD [A1]

The rarity colour enum from GameEngine.as is visible on film and nothing in the packet mentions it. Quest-offer lines render the item name in a rarity colour, and the names themselves expose a four-part procedural grammar (prefix / quality / base / 'of' suffix).

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0033.jpg and frame_0038.jpg (crop 0,400-700,576 @2x); enum at reference/decompiled/shs3_android/scripts/GameEngine.as:564-572`
- **Quote:** frame_0033: 'QUEST: FIND FAST SHOES OF FOCUS' with the item name in GREEN. frame_0038: 'QUEST: FIND RESERVED SHARP IRON SWORD OF WATER' with the item name in BLUE, over options 'I'LL SEE WHAT I CAN DO' / 'MAYBE LATER'.
- **Lane impact:** items-equipment: rarity tiers, their UI colours, and the procedural name grammar all become buildable

### `frames/HUNT-six-buff-potatoes` — HELD [A2]

The 30-minute buff timer governs a six-member family, not the single damage buff the packet found: four 150% buffs and two 200% regeneration buffs, each carrying the same one-buff-at-a-time clause.

- **Cite:** `strings.json["4132"]-["4135"], ["4229"], ["4230"]; render check at reference/frames/Nr4fQstqHDM/seg-04/frames/frame_0007.jpg (crop 600,80-1024,260 @5x)`
- **Quote:** ["4132"] 150% Damage, ["4133"] 150% Defense, ["4134"] 150% XP, ["4135"] 150% Speed, ["4229"] 200% AP Regeneration, ["4230"] 200% Duel Token Regeneration - all ending 'Note: Only one buff may be active at a time.'
- **Lane impact:** items-equipment, economy, ui-hud: the buff HUD widget must render six labels, not one

### `frames/two-clans-share-the-north-east-domain` — HELD [A1]

The clan-join screen assigns the NORTH-EAST domain to TWO different clans. This is an original-data collision in the shipped game, not a reading error: the frame and the string table agree. 'Domain' is therefore descriptive flavour, not a partition key, and a rebuild must not use it to place clans on the map.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0001.jpg (crop 575,415-900,465 @4.62x) and reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0007.jpg (crop 575,395-900,445 @4.62x)`
- **Quote:** frame_0001: 'CLAN AKA RYU RULES THE DOMAIN IN THE NORTH-EAST.' frame_0007: 'CLAN KI SENSU RULES THE DOMAIN IN THE NORTH-EAST.' Confirmed in the payload: strings.json["324"] (Aka Ryu) and strings.json["327"] (Ki Sensu) both end 'rules the domain in the North-East', while ["325"] Midori Ken = South-East and ["326"] Aoi Hoiru = South-West. Only three of four compass quadrants are used.
- **Lane impact:** meta-social: the four-clan geography has a collision; do not derive clan starting territories from the domain line

### `frames/world-map-zoom-in-is-a-viewport-not-the-board` — PARTIAL [A1]

The zoomed-in world-map panel is a scrolling VIEWPORT onto a much larger territory board, not the board itself. Thirteen tile columns fit the panel, but the coordinates printed by the game in the same corpus run in the twenties and fifties, so W and H cannot be read off one screen — and no frame in the corpus gives them.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0029.jpg (whole-frame @1.37x plus row crop 40,220-950,305 @1.65x), cross-read against reference/frames/zFtCaTO0_1M/seg-08/frames/frame_0016.jpg and reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0057.jpg (both whole-frame @1.37x)`
- **Quote:** Map header: 'NAGANO (26,52) LEVEL: 9' over exactly 13 tile columns (border pitch ~66 px, x=54..901 inside a panel ending at x~912). Quest cards in the same corpus print 'TERRITORY (22,51) SECTOR (5,2)' and 'TERRITORY (21,51) SECTOR (2,3)'; the HUD elsewhere prints 'TERRITORY (23,52) INSIDE SECTOR (5,4)'. A 13-wide board cannot hold column 26.
- **Lane impact:** world-exploration: blocker 'world bounds' stays OPEN from the frame corpus; the tile geometry is held, the extents are not

### `hunter/blade-impact-vfx-contract` — HELD [A2]

The blade-impact VFX has an exact contract nobody claimed: on each connecting polyline point, spawn a bladeslashfx instance at that point and rotate it by the local segment direction in degrees (atan2 x 57.2727), taking the previous point as the tangent partner or the next one at index 0, and suppress the spawn entirely while the kill-beat redFreeze is running.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1232-1247`
- **Quote:** 1234:                         if(!StageManager.isRedFreeze())
1236:                            bladeslash = new bladeslashfx();
1238:                            bladeslash.x = slashArray[j].x - offset;
1239:                            bladeslash.y = slashArray[j].y;
1240:                            ptA = j;
1241:                            ptB = j - 1;
1243:                               ptB = j + 1;
1246:                            bladeslash.rotation = Math.atan2(slashArray[ptB].y - slashArray[ptA].y,slashArray[ptB].x - slashArray[ptA].x) * 57.2727;
- **Lane impact:** L-art-anim-audio-feel: a hit-spark placement and orientation rule the recreation can implement exactly, plus the redFreeze suppression that keeps the kill beat clean.

### `hunter/web-weapon-parry-and-part-index-parity` — HELD [A2]

The free weapon-parry surface and the behead multiplier are both present in the WEB v0.717 NPC class, which the packet cited only from Android — and the obfuscated part constants decode to exactly the Android z-order indices, independently reproducing the paperdoll table in the web build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:450-478 · reference/decompiled/shs3_payload/scripts/§1t75s0§.as:19, :37, :45, :47`
- **Quote:** §1t68s0§.as:458:             case mcs.§1t6231s0§[§1t75s0§.§1t12380s0§]:
459:                this.§1t3256s0§ = false;
460:                _loc3_ = 0;
461:                return false;
472:             if(this.§1t1071s0§)
474:                _loc3_ *= 1.3;   ||   §1t75s0§.as:19 §1t12380s0§ = 3 (weapon) · :37 §1t12389s0§ = 12 (neck) · :45 §1t12393s0§ = 16 (head) · :47 §1t12394s0§ = 17 (hat)
- **Lane impact:** L-combat-core and L-items-equipment: the 'rendered sword is a parry surface' rule is v0.717 behaviour, not an Android-only quirk, and the part-index table is now cited in the build the project targets.

### `itemdata-hunter/damage-table-is-non-monotonic` — HELD [A2]

The itemdata weapon damage table is NOT monotonic in level, so it cannot be replaced by a fitted curve. The catalogue maximum damage belongs to item 13179 'Steel Sword' at minlvl 65 with mindamage 39 / maxdamage 108, which is above the only minlvl-79 row (13225 'Steel Sabre', 81-90) that claim #31 presents as the high end. Claim #31's headline (the curve is tabulated, not missing) stands; its implied ordering does not.

- **Cite:** `reference/extracted/itemdata.xml:9591 (item 13179) vs :9925 (item 13225)`
- **Quote:** Measured top of the maxdamage distribution over all 982 rows: 13179 max 108 / min 39 / minlvl 65; 13178 96 / 57 / 70; 13176 94 / 55 / 66; 13177 92 / 53 / 64; 13227 92 / 50 / 63; 13225 90 / 81 / 79.
- **Lane impact:** L-items-equipment: port the 158-row table verbatim; any level->damage formula fitted to it will misprice the top of the Steel ladder.

### `itemdata-hunter/itemdata-ships-an-empty-item-row` — HELD [A2]

A third shipped data bug the packet misses: itemdata.xml contains a completely EMPTY item record — item 7075 has an <id> and nothing else. It parses to type 0 = ARMOR, displayname "", gvalue 1, art 7075 (a HAT-range art id on a torso slot, so getMCSComponent falls back to torso0). It is also the single 7xxx id inside the 153 'type-absent torso items' claim #32 counts. Around 90 further rows are stubs carrying only <id> plus at most <type> or <unique>. Measured over all 982 items: 804 carry <name> and 178 DO NOT (103 of the nameless are unique=2 NPC-wardrobe art, 75 are not) — those 178 render with an empty name.

- **Cite:** `reference/extracted/itemdata.xml:5449-5451`
- **Quote:** 	<item>\n		<id>7075</id>\n	</item>  — the whole record. Other stubs: the <item> at :2775 (4021), :3165 (4070), :3457-3479 (4102-4107), :3501-3531 (4110-4117).
- **Lane impact:** L-items-equipment: any item pipeline must survive a row with no fields at all and 178 nameless items, and a 1:1 recreation has to decide whether to reproduce the empty row or deviate — the same call claim #27 asks for on the other two bugs.

### `itemdata-hunter/modifier-dispatch-numeric-fallback` — HELD [A2]

The consumable modifier dispatch has a three-way numeric fallback that no claim decodes, plus nine named engine actions the packet's 'consumable effect table' omits. After the named branches, InventoryUI.onUseItem falls through to: modid < 2000 -> changeStat(modid, value) (so ANY id under 2000 is a stat delta, not just the 0-16 enum); modid >= 30000 -> setStat(modid, value) (a raw stat write); otherwise -> changeItemQty(modid, value), i.e. 'give `value` of item #modid'. itemdata exercises the second branch: item 2210 'Reset Quests' carries <modifier><id>40000</id>. Undocumented named branches: 34 (addGeneratedItemToInventory), 96 (teleport to territory dojo), 104/105/106 (loot-dialog control, RNG seed from server date, addLootItemBasic), 117 (wipe quest log + teleport), 123/124 (create clan).

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:1098-1109; reference/extracted/itemdata.xml:2411-2429`
- **Quote:** else if(modid < 2000) { StatsManager.changeStat(modid,item.modifierXML[i].value); } else if(modid >= 30000) { StatsManager.setStat(modid,item.modifierXML[i].value); } else { StatsManager.changeItemQty(modid,item.modifierXML[i].value); }  |  itemdata.xml:2412 <id>2210</id> ... :2425 <id>40000</id>
- **Lane impact:** L-items-equipment / L-economy: completes the item-effect contract. The measured modifier-id histogram over all 982 items is 103 x223, 104 x42, 105 x40, 106 x33, 0 x13, 3 x13, 38 x6, 13/15/1/2 x3 each, 82/84/78/79/9/8/5 x2 each, and one each of 102, 98, 25, 12, 90, 96, 97, 99, 101, 117, 40000, 122, 123, 124, 6, 7.

### `itemdata-hunter/npc-loot-ids-are-not-only-an-enum` — HELD [A2]

NPC <loot><id> carries raw item ids as well as the 0-3 enum, and the malformed <hair> run claim #27 flags is systemic rather than a one-off. Measured over all 495 <npc> rows the loot-id histogram is 0 x77, 3 x28, 2 x10, 1 x10, 2113 x2, 2112 x2, 2114 x1, 20028 x1 — six rows fall through to the else branch, addLootItemBasic(lootType, qty), i.e. 'drop item #lootType'. Separately, the malformed id run '6015.6017' recurs in 355 of the 495 <mcs> blocks (the collapsed float '6.5006501650265E+47' really is a single occurrence).

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:854-856; reference/extracted/npcdata.xml:31 and my parse of all 495 <mcs> blocks`
- **Quote:** NPC.as:853-856 'else { OverworldHUD.instance.lootDialog.addLootItemBasic(lootType,qty); }' with addLootItemBasic at :855. npcdata.xml:31 '<hair>6000,6001,6002,6003,6004,6007,6008,6009,6013,6014,6015.6017,6018,6019</hair>' — that exact string appears in 355 of 495 blocks.
- **Lane impact:** L-enemies-ai / L-economy: the drop model needs a fifth case (fixed item by id) that claim #9's four-case summary omits, and the art fallback to part '0' fires on 355 NPCs, not on a handful.

### `itemdata-hunter/sellpercentage-is-dead-data` — HELD [A2]

ShopUI's sellPercentage = 0.5 is declared and never read — do not apply it on top of getSellAmt(). Claim #26 cites the line without saying it is unreferenced, which invites a 50% haircut the original never applies. grep across the entire Android bundle returns exactly one occurrence (the declaration), and the only consumer of the sell price calls getSellAmt() unmodified.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopUI.as:58 and :401`
- **Quote:** ShopUI.as:58 'internal var sellPercentage:Number = 0.5;' — sole occurrence in `grep -n "sellPercentage" reference/decompiled/shs3_android/scripts/*.as`. ShopUI.as:401 'slot.setCost(slot.getItem().getSellAmt(),0);'
- **Lane impact:** L-economy: the sell price is exactly (1 + modifierCount) x 10 or x 5 with no percentage applied. Guards against a 2x error in every sale.

### `itemdata-hunter/stance-gate-threshold-differs-by-build` — HELD [A2]

The in-combat stance-change gate uses a different threshold in each build. Android v0.682 gates nextStance() on reload >= maxreload/6, which with the flat maxreload of 120 is 20 units = one sixth of the bar. The web v0.717 build gates the same action on Focus >= 48 against a max of 192 = one quarter of the bar. Anyone porting the 'CANNOT CHANGE STANCE' threshold must take the web number and must not read the Android fraction as authoritative.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2975-2979 and :239; reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249`
- **Quote:** MCSPlayer.as:2977 'if(this.reload < this.maxreload / 6) { return; }' with MCSPlayer.as:239 'this.maxreload = 5 * 24;' -> threshold 20/120 = 1/6. Web: §1t99s0§.as:249 '= 8 * 24' (192) with the documented Focus >= 48 gate -> 48/192 = 1/4.
- **Lane impact:** L-combat-core / L-ui-hud: pins the stance-switch gate to a quarter bar for the v0.717 target and flags the Android bundle as an unsafe source for this specific constant.

### `itemdata-hunter/v0717-strings-are-loaded-over-the-network` — STILL_UNHELD [A2]

Positive mechanism evidence for why the v0.717 affix wording is gone, upgrading claim #34 from an absence argument. The web build never embeds its string table: LangManager.setLanguage builds a path of './data/' (or server + 'strings/') and hands Locale the URLs shs3_en.xml / shs3_fr.xml / shs3_es.xml, then calls Locale.loadLanguageXML. The table was fetched from the now-dead server at runtime. `find reference -iname "*shs3_en*"` returns nothing, and LC_ALL=C grep over the 329 MB reference/extracted/payload.xml for 'Slaughter' and 'of Attack' returns 0 hits each.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1521s0§.as:63-84 (and the duplicate path at :91-94)`
- **Quote:** var _loc2_:String = "./data/"; if(§1t1523s0§.§1t9495s0§) { ... _loc2_ = §1t3317s0§.instance.server + "strings/"; } ... Locale.addXMLPath(§1t9271s0§,_loc2_ + "shs3_en.xml"); Locale.addXMLPath(§1t9277s0§,_loc2_ + "shs3_fr.xml"); Locale.addXMLPath(§1t9279s0§,_loc2_ + "shs3_es.xml"); Locale.loadLanguageXML(param1,§1t9286s0§);
- **Lane impact:** L-items-equipment / L-ui-copy: settles that NO amount of further searching in what we hold will recover v0.717 UI copy above string id 9010. The Android v0.682 hardcoded word lists (ItemGenerator.as:102-127) are the only wording we will ever have, and using them is a knowing v0.682 substitution.

### `itemdata/dot-baseprice-bug-is-inert` — PARTIAL [A2]

The <baseprice>. bug on item 11037 'Santa Pants' has no observable consequence: the item also carries <heavenlyprice>3</heavenlyprice>, and every other Gold-priced row in the file writes <baseprice>0</baseprice>, so int('.') = 0 produces exactly the value the row was meant to have. There is no 'reproduce or deviate' decision with a stake in it.

- **Cite:** `reference/extracted/itemdata.xml:6897-6906 (item 11037 in full); reference/decompiled/shs3_android/scripts/XMLItem.as:14 (public var gvalue:int) and :86-93`
- **Quote:** itemdata.xml:6898-6905 — '<id>11037</id><type>7</type><name>4204</name><unique>1</unique><baseprice>.</baseprice><heavenlyprice>3</heavenlyprice><defense>1</defense><weight>5</weight>'. Measured over all 982 items: 303 rows carry a non-zero <heavenlyprice>; 300 of them write <baseprice>0</baseprice>. 11037 is the only one that writes '.'.
- **Overturns:** "itemdata/baseprice-dot-data-bug: 'a 1:1 recreation has to decide to reproduce or deviate, not silently fix'"
- **Lane impact:** L6 economy: itemdata/baseprice-dot-data-bug is factually correct but its 'a 1:1 recreation has to decide' framing overstates the stake — the bug is inert. Worth carrying so the lane does not spend a decision cycle on it.

### `itemdata/sellpercentage-is-dead` — HELD [A2]

ShopUI's sellPercentage = 0.5 has zero readers anywhere in the Android tree. Sell price is getSellAmt() alone; a recreation must not multiply by 0.5 on top of it.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopUI.as:58; exhaustive grep -rn "sellPercentage" reference/decompiled/shs3_android/scripts/ returns that one line`
- **Quote:** ShopUI.as:58 — 'internal var sellPercentage:Number = 0.5;'  — sole occurrence in the tree. The actual price is Item.as:1582-1593 getSellAmt(): 'if(this.itemID < 3000) { return 1; } if(this.getWeight() >= 10) { return (1 + this.getModifierCount()) * 10; } return (1 + this.getModifierCount()) * 5;'
- **Overturns:** "itemdata/sell-price-formula cite includes 'ShopUI.as:58 — internal var sellPercentage:Number = 0.5'"
- **Lane impact:** L6 economy: itemdata/sell-price-formula cites sellPercentage alongside the real formula; flagging it as dead prevents a 2x error in the sell path. Same dead-constant pattern as MCSPlayer.baseReload — this bundle carries several computed-then-discarded values, so every constant a lane adopts should be grep-checked for readers.
