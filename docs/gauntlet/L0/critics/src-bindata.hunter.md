# src-bindata — HUNTER CRITIC review

Packet: `docs/gauntlet/L0/worklist/src-bindata.claims.json` — **36 claims, 36 judged, 0 skipped.**
Source: `reference/extracted/bindata/` (27 web files).
I did **not** read `docs/gauntlet/L0/sources/bindata.md`.

Every verdict below cites an artifact **I** opened. Where I re-measured a number the surveyor
gave, I say whether it reproduced.

---

## 0. What I re-measured from scratch (so the rest is anchored)

| Measurement | My result | Command / artifact |
|---|---|---|
| animdata totals over 100–118 | **anims 487 · `<f>` 5,596 · `<n>` 81,706** | python regex over `reference/extracted/bindata/1[01][0-9]_*.bin` |
| file 108 alone | **158 / 1,638 / 24,502** | same |
| `tests/a11AnimData.test.ts` | `Test Files 1 passed (1)` / `Tests 12 passed (12)` | `npx vitest run tests/a11AnimData.test.ts` |
| bindata refs in src+scripts+tests | **exactly one file: `108_1t4635s0`** (6 hits) | `grep -rn "1t46" src/ scripts/ tests/` |
| web SWF header | `CWS` v17, rect `[0,16000,0,13800]` = **800×690**, **framerate 24.0**, 6 frames | `reference/decrypted/shs3_payload_decoded.swf` |
| android SWF header | `CWS` v26, rect `[0,16000,0,9600]` = **800×480**, framerate 24.0 | `reference/decrypted/shs3_android_payload_decoded.swf` |
| GIF 92 decode | GIF89a 63×72, palette `000000/ffffff/666666/999999`, **735 of 4,536** set, row 51 exact, (21,51)=1 | Pillow on `reference/extracted/bindata/92_1t4648s0.bin` |
| md5 92 vs android 110 | both `13068dfa1a5cc5628720a25782f93fed` | `md5 -q` |
| frames 427.0/428.0/431.0/433.0 | content **x 52..1867 (1816 px)**, y 0..1079, aspect **1.6815**, identical on all four | per-column max-channel scan + eyeball at 960×540 |
| 93 trap tiers | easy 13 rooms/37 objs · medium 21/94 · hard 15/72 · veryhard 20/94 = **69 rooms / 297 objs** | tier-scoped parse of `93_1t4647s0.bin` |
| 93 duty cycles | **75 values are NOT multiples of 24**; domain `{0,6,8,12,16,18,24,30,32,36,42,48,54,64,60,72,96,1000}`, gcd **2** | schema-driven parse of every `<property>` |
| 119 | 39 `<wave>`, 87 `<enemy>`; x = −50 ×49, 1650 ×37, −1650 ×1 (line 77, 6th wave) | grep/uniq |
| npcdata.xml | 495 `<npc>`, ids 0–819, **none in 690–730** | python |
| android `125_Mobile_NpcData.bin` | 1,273 `<id>`, max **20028**, none in 700–710, 495 `<npc>` | python (file is **UTF-8**, not UTF-16LE) |
| name tables | 94=**398** · 95=**33** · 96=**36** · 97=**291** · 98=**677** | `tr -d '\r' | grep -c .` |

**THE FRAME WINS, and I say so:** the longplay canvas measures 1816×1080 (1.6815). The web
payload's own SWF header declares an 800×690 stage (1.1594). The frame is right about what the
*game area* is — and `GameEngine.as:269-271` explains the header:
`originalWidth=800 · originalHeight=480 · originalHeightWithBar=690`. The 690 stage is 480 of game
plus a 210 px friend bar; the playfield is 800×480 = 1.6667, which is what the frame shows.

---

## 1. Verdict table

| # | claim id | refuted | severity | one-line reason |
|---|---|---|---|---|
| 0 | 487-anims-held-4-ported | no | — | every number reproduced; test 12/12; only 108 is referenced by the build |
| 1 | 51-skill-animations | no | — | all 12 line/duration pairs exact; 102 holds exactly 51 anims |
| 2 | RETRACTION-animation-rate-is-24hz | **YES** | material | text asserts "corroborated by the trap duty cycles" — **false**, 75 counter-examples |
| 3 | RETRACTION-gif92-is-the-world-map | no | — | I decoded it; it is Japan; every figure exact |
| 4 | anim-duration-holds | no | — | all 7 quoted cases verbatim in `AnimData.as` |
| 5 | aspect-frame-beats-swf-header | no | minor | reproduced exactly; the "contradiction" is resolved by `GameEngine.as:269-271` |
| 6 | audio-not-in-this-source | no | — | honest and correct; audio blobs are `CWS`+impossible-version, neither zlib nor raw-deflate opens |
| 7 | boss-telegraph-triads | no | — | all 9 clip/duration pairs exact |
| 8 | clan-band-tail-holds-seasonal-event-enemies | no | minor | all 4 wave lines + all 5 clan bands verified; remap is at 1733–1754 not 1732–1750 |
| 9 | element-enum-order-and-archetypes | **YES** | material | "projectile **speed** 20" — the 6th arg of `createProjectile` is **damage** |
| 10 | engine-ticks-24fps | no | material | thesis verified from the web header myself; **strike the duty-cycle limb in the quote** |
| 11 | five-stances-not-three | **YES** | material | "each with the same 21-animation kit" — reversed has **13**, no down/upslash family |
| 12 | launcher-downed-ground-finisher-verbset | no | — | all 16 quoted durations exact |
| 13 | map-bitmap-vs-territory-scale-unreconciled | **YES** | material | fully reconcilable; exact transform recovered (see §3) |
| 14 | missing-boss-npcs-700-710 | **YES** | material | not a hole — runtime player injection, mechanism verified |
| 15 | mounted-shield-archer-poses-eggs | no | — | every clip + `MCSActor.as:132-150` POSE1..POSE10 exact |
| 16 | original-rng-is-a-specific-lcg | no | — | verbatim, and now **web-verified** at `§1t58s0§.as:84` |
| 17 | paired-grab-throw-victim-anims | no | — | 4 line numbers + `AnimData.as:65-66` exact |
| 18 | per-stance-idle-poses | no | — | every coordinate exact; 19 nodes each; 33 px head delta exact |
| 19 | pillarbox-independently-reverified | no | — | I reproduced the column values to the digit on 4 frames and looked |
| 20 | place-name-26x26-lookup | **YES** | material | `getTownName1` is **unreachable** for all 735 real territories |
| 21 | procedural-name-generator | no | minor | exact, and web-confirmed; **under-claimed** (see §3) |
| 22 | reach-cap-not-in-this-source | **YES** | fatal | the reach cap IS recovered, in full, per stance (see §3) |
| 23 | severed-limb-deaths | no | minor | all durations exact; "nine-clip death family" is 10 (or 7 excl. severed) |
| 24 | slash-is-four-part-looping-hold | no | minor | exact for hor/down/up; fallslash is 3-part, jumpslash's partb does not loop |
| 25 | spawn-geometry | no | minor | −50/1650/−1650 counts exact; the "~1600 px arena" is inference, not in the artifact |
| 26 | sprite-compositing-contract | no | — | 27-slot map verbatim; **89** r="1" frames in 108 exact |
| 27 | survival-is-warroom-content | no | — | verbatim, and web-confirmed (`§1t7785s0§` consumes `§1t4646s0§`) |
| 28 | territory-12bit-packing-and-6x6-nodes | no | minor | verbatim; the fields are **biased by 341** (see §3) |
| 29 | trap-census-and-800-is-one-screen | **YES** | material | census counts the schema comment + commented `<default>` room; sums to 314 vs its own 297 |
| 30 | trap-dungeon-system | no | minor | schema verbatim; 69 live rooms not 70; 13 schema'd types, not 14 |
| 31 | trap-room-placement-and-level-gate | no | minor | dice + gate verbatim; a 4th and 5th placement rule exist |
| 32 | veryhard-rooms-rotate-daily | no | — | `:2445` verbatim; **all eight** cross-references verified exact |
| 33 | war-boss-ids-are-rival-players | no | — | strongest claim in the packet; every element reproduced |
| 34 | warhex-board-6x6 | **YES** | material | "seven enumerated hex states" — `WarHex.as:11-37` enumerates **fourteen** |
| 35 | world-map-bitmap | no | — | decoded myself; every figure exact |

**9 refuted · 27 upheld.**

---

## 2. The refutations, in detail

### 2 / 10 — "every authored duty cycle is a multiple of 24" is FALSE
The 24 Hz conclusion is **right** and I verified it independently (web SWF header framerate 24.0;
`GameEngine.as:442` `stageMC.addEventListener(Event.ENTER_FRAME,gameloop);`;
`MCSCharacter.as:1315-1319` `++this.frameCounter; if(this.frameCounter < this.currentAnimationDuration) { this.updateFrame(); }`).
The **corroboration is fabricated by over-generalisation.** Parsing every `<property>` in
`93_1t4647s0.bin` against the file's own schema comment gives 75 duty-cycle values that are not
multiples of 24. The surveyor quoted one of them: line 451 `<property>0,24,36,0,1,1,1</property>`
— `Trap_SpikesAuto` = `direction, onDuration, offDuration, …`, so **offDuration = 36**.
Measured domain: `startInterval ∈ {0,6,8,12,16,18,24,30,32,36,42,48,54,64,72}`,
`offDuration ∈ {0,24,36,48,60,96,1000}`, `onDuration ∈ {0,24,48}`. **gcd = 2, not 24.**
Claim 2 puts the false limb in its `text`, so it is refuted; claim 10 keeps it in the quote only,
so its thesis stands with that sentence struck.

### 9 — "projectile speed 20" is damage, not speed
`ProjectileManager.as:131`
`public static function createProjectile(type:int, x:int, y:int, velX:Number, velY:Number, damage:int, skilllevel:int, owner:NPC)`.
`Trap_ElementAuto.as:90` passes `(projType, x+xChange+stagePos, y+yChange, 1, 0, 20, 1, null)` — the
`20` is **damage**; velocity is ±1 with velY 0. The element enum (0 fire / 1 wind / 2 water /
3 earth) and the −55 / 0 emission heights are exactly right.

### 11 — the reversed stance is not a 21-clip kit
Measured clip lists: light 118 = 21 · balanced 106 = 21 · heavy 116 = 21 · dual 110 = 21 ·
**reversed 104 = 13**. Reversed has *no* `downslash` and *no* `upslash` family — it has one generic
`reversed_slash_parta/b/c/d` where the other four have three separate directional families.
The headline "five stances, not three" is **right** and is now also code-confirmed
(`MCSPlayer.as:3029-3090` switches on `LIGHT_STANCE/BALANCED_STANCE/HEAVY_STANCE/REVERSED_STANCE/DUAL_STANCE`).

### 13 — the map/territory scale IS reconciled
See §3.1. Refuted with a complete, verified transform.

### 14 — the 700–710 "hole" is not a hole
Verified myself: `QuestEngine.as:1035-1043` `clearPlayersInNPCData()` splices out
`npcList[i].id >= 700 && npcList[i].id <= 710`; `WarHexUI.as:1412-1413` builds them from a server
sentry string (`initDuelist(...)` then `npcXML.id = 700 + i`). Web build agrees:
`§1t1524s0§.as:1283` and `§1t7785s0§.as:1525`. Claim 33 already carries this; claim 14 must not
enter the ledger alongside it.

### 20 — bindata/98's 677 place names are DEAD DATA in the shipped world
`NameGenerator.as:147` `var namex:int = territoryx % 137;` and `:149` `if(namex < 26)` gate the
26×26 lookup. Every real territory's raw x is in **[329, 389]** (derived below), so
`namex ∈ [55, 115]` — **always ≥ 26**. `getTownName1` is therefore **never reached for any of the
735 land territories**. Every place name in the shipped world is either a hardcoded exception or a
`getTownName2` compound (`namestarting[78] × nameending[37]`, seeded `RNG(territoryID*2)`).
The claim's arithmetic about the table is fine; "the world-naming algorithm is recovered whole" is not.
The claim also misses that the **web** build has a **third** hardcoded town (§3.2).

### 29 — the trap census counts comments as content
`93_1t4647s0.bin` has 314 raw `<obj>` lines: 13 in the schema documentation comment (`:6-18`),
4 in the commented-out `<default>` template room (`:25-28`), and **297 live**. The claim's census
sums to exactly 314 — every type is +1 (`Trap_ElementAuto` +5) — while the claim's own headline says
297. Raw `<room>` count is 70 because line 23 is inside the `<!--<default>` comment; **69 rooms are
live**, and the claim's own per-tier split (13+21+15+20) sums to 69. What survives: 297 objects,
14 types, the per-tier split, easy-tier widths all 800, and `GameEngine.as:269 var originalWidth:int = 800;`.

### 34 — fourteen hex states, not seven
`WarHex.as:11-37` (I opened it):
`HEX_NOTHING=0 · HEX_SPAWNPOINT=1 · HEX_FORWARDBASE=2 · HEX_CONTROLPOINT=3 · HEX_TOWN=4 ·
HEX_POTENTIALSPAWNPOINT=5 · HEX_UPCOMINGSPAWNPOINT=6 · HEX_LADDER=7 · HEX_DEFENSE=8 ·
HEX_VILLAGE=9 · HEX_CITY=11 · HEX_CASTLE=12 · HEX_DISABLEDSPAWNPOINT=13 · HEX_DEMOLISHEDSPAWNPOINT=15`
— fourteen constants with explicit values and gaps at 10 and 14. The seven the claim lists are just
the ones a render switch at `WarHexUI.as:266-322` happens to touch, and the claim cites that switch
rather than the enum. 6×6 and the 55 px pitch hold (`WarHexUI.as:175-176`, `:253`).

### 22 — the biggest one: the reach cap is NOT missing
See §3.3.

---

## 3. NEW FINDINGS (the hunt)

### 3.1 The map-bitmap ↔ territory-ID transform, complete and web-verified — CLOSES claim 13
Constants (`WorldMapUI.as:15,17,19` and `WarSelectUI.as:15,17,19`):
`WARMARKERSHIFTX = 8 · TERRSHIFTX = 21 · TERRSHIFTY = 51`, and the 12-bit fields are **biased by 341**.

* forward, `QuestEngine.as:522-526`:
  `if(mapBitmapData.getPixel(i,j) != 0) { terrX = i - TERRSHIFTX + WARMARKERSHIFTX; terrY = j - TERRSHIFTY; warMarkerList.push(terrX + 341 << 12 | terrY + 341); }`
* inverse, `QuestEngine.as:1206`:
  `return mapBitmapData.getPixel(x + WarSelectUI.TERRSHIFTX - 341 - WarSelectUI.WARMARKERSHIFTX, y + WarSelectUI.TERRSHIFTY - 341) != 0;`

Collapsed: **pixel_x = rawTerrX − 328 · pixel_y = rawTerrY − 290**.
Land pixels ⇒ **rawTerrX ∈ [329, 389], rawTerrY ∈ [290, 361]**, mapid ∈ [1347935, 1593647],
**735 war-marker territories** — the same 735 land cells I counted in the GIF.

Proof it is right — all three hardcoded towns land on **LAND**:

| town | id | raw (x,y) | pixel | land? |
|---|---|---|---|---|
| Ibamaya | 1405272 | (343,344) | (15,54) | **yes** |
| Gokura | 1524045 | (372,333) | (44,43) | **yes** |
| Iwakuni *(web only)* | 1519945 | (371,329) | (43,39) | **yes** |

Web parity: `§1t7934s0§.as:15,17,19` = `8, 21, 51`; `§1t1524s0§.as:1463` is the same `getPixel(... -341 ...)`.
Also: the ledger's "start coordinate (21,51)" is not a coordinate — it is literally
`(TERRSHIFTX, TERRSHIFTY)`, the territory-space origin expressed in bitmap pixels.

### 3.2 The WEB build has a THIRD hardcoded town the Android build does not
`reference/decompiled/shs3_payload/scripts/§1t136s0§.as:148-151`
`if(param1 == 1519945) { return "Iwakuni"; }` — absent from
`shs3_android_payload/scripts/NameGenerator.as`, which stops at Gokura. A concrete, located
web-vs-android divergence: the §S0 build-parity caveat is real and this is an instance of it.

### 3.3 THE PER-STANCE REACH CAP IN STAGE PIXELS — recovered in full — REFUTES claim 22
`MCSPlayer.as:3019-3095` (`setStance`):
```
LIGHT_STANCE    slashLength = baseSlashLength * 1.5
BALANCED_STANCE slashLength = baseSlashLength * (1 + 0.5 * balancedMastery * 0.01)
HEAVY_STANCE    slashLength = baseSlashLength * (0.5 + 0.5 * heavyMastery * 0.01)   // floor 100
REVERSED_STANCE slashLength = baseSlashLength * 1.5
DUAL_STANCE     slashLength = baseSlashLength                                        // floor 100
if (controlledBy == 0) InputManager.setMaxDistance(this.slashLength);
```
The base (`StatsManager.as:1915-1919`):
`getBaseSlashLengthVal(speed) = int(120 + Math.floor((90 + STAT_DAN*5) * speed / (20 + speed)))`,
with `speed = STAT_SPEED + findBonusStat(STAT_SPEED)`, ×1.5 under `BUFF_SPEED` (`:1907-1911`).
`BUFF_INJURED` halves it (`MCSPlayer.as:222`). AI opponents use the same shape with
`maxincrement = 90` fixed (`EnemyPlayer.as:757`). Default before any stance is set:
`InputManager.as:51 internal static var maxDistance:int = 200;`.
Consumption/taper: `InputManager.as:198 distanceLeft = maxDistance;` and
`:360 lineStyle(thickness - thickness * ((maxDistance - distanceLeft)/maxDistance), 10027008, …)`.
**Web parity:** `§1t1523s0§.as:2347 return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));`
and `§1t1541s0§.as:361` identical.

Consequence for the model: **light reaches 1.5×, heavy 0.5× at zero mastery and only reaches parity
at 100 % heavy mastery** — reach is the stance trade-off, and it is mastery-scaled, not a constant.
The surveyor's grep missed it because the class is `MCSPlayer.as` (not `Player.as`) and the symbol
is `slashLength`/`baseSlashLength` (not in the pattern list).

### 3.4 The slash-line colours, exact
`InputManager.as:172-180` — `greenLine()` = **39168 = 0x009900**, `redLine()` = **10027008 = 0x990000**;
the enemy's drawn line is **0 = 0x000000** (`:492`). Identical in the web build
(`§1t1541s0§.as:174,179`). Byte-exact palette values for the single most visible UI element in a duel.

### 3.5 An 11-entry exact-hue palette nobody has mentioned
`QuestGenerator.as:38` / `ItemGenerator.as:701` / `Obj_PickableItemProcGen.as:58`:
`colorhexlist = [16711680, 16737792, 16763904, 39168, 13311, 6684927, 16751103, 6697728, 16777215, 10066329, 0]`
= `#FF0000 #FF6600 #FFCC00 #009900 #0033FF #6600FF #FF99FF #663300 #FFFFFF #999999 #000000`,
selected by `rng.rand(11)` and applied via `ColorCode.changeColor`. Also present in the web build
(`§1t8608s0§.as:60`, `§1t1644s0§.as:827`). Scope is procedurally-generated quest items.

### 3.6 The audio INVENTORY is held even though the waveforms are encrypted
I confirmed the blobs are unreadable (`113_Mobile_MusicResource.bin` = `CWS` + version byte 100,
declared length 1,969,230,408 vs 1,340,647 actual; zlib and raw-deflate both fail) — S0-5 stands.
But the *names and trigger rules* are fully recovered:
* `SoundManager.as` — **13 SFX**: `slash1/slash2/slash3` (random-of-3 per slash), `die1/die2/die3`
  (random-of-3), `punch` (used for **both** `playHit` and `playHurt`), `hitmetal`, `deflect`,
  `fart`, `goodkoto`, `sumo`, `refund`.
* `MusicManager.as:12-46` — **18 presets with explicit ids**: NONE 0, EXPLOREBATTLE 1, TOUGHBATTLE 2,
  QUIET 3, EXPLORESAFE 4, EXPLOREDANGER 5, EXPLORETOWN 6, DUNGEONBATTLE 7, PVP 8, DUNGEON 9,
  DUNGEONCREEPY 11, DUNGEONCREEPYDANGER 12, DOJO 14, BATTLEDRUMS 15, DUNGEONDANGER 16,
  GANGNAM 100, LEVELUP 101, LOSE 102 (gaps at 10 and 13).
* `SoundManager.pickMusic(bg, isHostile, isPvP)` (`:114+`) is the exact per-background selection rule.

The ledger's "**all audio**" blocker should be split: *waveforms* blocked, *inventory + triggers* held.

### 3.7 The engine has a shipped `<default>` override for the whole trap system
`RoomGenNode.as:2437-2440`
`if(QuestEngine.trapRoomData.default.toString() != "") { trapRoom = QuestEngine.trapRoomData.default.room; }`
— checked **before** any tier selection, so a live `<default>` block replaces every trap room in the
game. `93_1t4647s0.bin:22-30` is exactly that block, shipped commented out. This is also the source
of the census inflation in claim 29.

### 3.8 Two trap-room placement rules the packet missed
* `RoomGenNode.as:1978-1981` — `else if(this.roomType == ROOM_KEY && this.isEnterFromLeft() && rng.rand(2) == 0) { this.roomType = ROOM_TRAPKEY; }` — a **fourth** placement rule, and
  `ROOM_TRAPKEY` re-enters the level gate at `:2378`.
* `DungeonGenerator.as:967` — `createRoute(traproomIndex, nodeid, bg, 6, rng, RoomGenNode.ROOM_TRAPVERYHARD, RoomGenNode.ROOM_TRAPVERYHARD, roomArray, null, null, NodeGenerator.EXIT_N, true)`
  — the veryhard tier is a dedicated **6-room route**, which is why it alone gets the daily reroll.
`RoomGenNode.as:78 ROOM_TRAPVERYHARD:int = 35;`

### 3.9 `getServerDate()` is a game-wide daily clock, not a trap-room detail
Claim 32 lists 8 sites. There are **30+**, including shop stock (`XMLShopData.as:101`,
`ShopUI.as:190`), corpse loot (`Obj_Corpse.as:58`), chests (`Obj_ChestGoodLoot.as:36,52`),
procgen NPCs and quests (`Obj_NPCProcGen.as:37,78,83`), bounty targets (`Obj_NPCAggro.as:53`),
pickable items (`Obj_PickableItemProcGen.as:55`), and `StageManager.as:698`.

### 3.10 1,839 nodes use the a/b/c/d matrix form, not rotation — and 258 frames reorder
Measured over all 19 animdata blobs: **79,867 `<n>` use `r=`**, **1,839 use the `a/b/c/d` quad**
(2.25 %), concentrated in `114` (spider, 817) and `108` (human, 492); `matA` spans **−101…150**,
i.e. mirrored and up to 1.5× scaled parts. And **258** `<f r="1">` reorder frames exist across the
19 blobs — claim 26's "89 in file 108" is exact but is only a third of the total.
(`src/config/ogAnims.ts` already models the quad, so this is a coverage number, not a bug.)

### 3.11 Six ledger-named NPCs decompose from the name tables, not two
Claim 21 found 2. Exhaustive lookup against `94/95/96/97`:

| ledger name | surname | given | generator |
|---|---|---|---|
| Hachisuka Kano | 96:7 (samurai) | 94:80 (male) | `getSamuraiName(male)` |
| Honda Shizuka | 96:11 (samurai) | 97:226 (female) | `getSamuraiName(female)` |
| **Honda Gin** | 96:11 | 97:38 (female) | `getSamuraiName(female)` |
| **Hojo Taka** | 96:10 (samurai) | 97:236 (female) | `getSamuraiName(female)` |
| **Inokuma Kinkiyo** | **95:11 (NOBLE)** | 94:107 (male) | **`getNobleName(male)`** |
| **Niji** | — | 97:170 (female) | **`getCommonerName(female)`** |

`Zabuza`, `Tengu`, `Hotaru` are in none of the tables ⇒ those are authored `npcdata` NPCs.
Ledger names from `docs/research/video-study/SYNTHESIS.md:429` and `REBUILD_READINESS.md:221`.
This proves all three name generators (`getCommonerName`, `getNobleName`, `getSamuraiName`) are live.

### 3.12 The web bindata→consumer map, proved from the WEB build (not inferred from Android names)
The web AS3 is symbol-obfuscated, which is why the surveyor had to work from the Android decompile —
that was necessary, not lazy. But the mapping is still provable in the web build:
* `§1t136s0§.as:10-18` (NameGenerator) declares, **in order**,
  `§1t4651s0§ · §1t4650s0§ · §1t4649s0§ · §1t4652s0§ · §1t4653s0§` → male / female / noble / samurai /
  place, i.e. web bindata **94 / 97 / 95 / 96 / 98**. Confirms claim 21's table assignment.
* `§1t1524s0§.as:83,87` (QuestEngine) owns `§1t4647s0§` (93, traproomdata) and `§1t4648s0§` (92, map bitmap).
* `§1t7785s0§.as:13` (WarHexUI) owns `§1t4646s0§` (119, survivalmodedata).
* `§1t75s0§.as:79-103` (MCSCharacter) owns all the animdata blobs.

### 3.13 Small corrections worth carrying
* `WarHexUI.as:254 hex.y = 92 + ypos * 55;` — the y pitch is also 55, origin 92. Claim 34 gave only x.
* `§1t7934s0§.as:299-300` — the world map renders at **10 px per territory cell**, offsets +4.5 / +8.8.
* `FrameData.setVisible` (`:74-89`) hides parts `0..21` only — `prop3(22)`, `l_shoulder(23)`,
  `r_shoulder(24)`, `l_knee(25)`, `r_knee(26)` are **never** hidden, then `hat` and `crotch` are
  force-shown. A faithful renderer must reproduce that asymmetry.
* `93_1t4647s0.bin` uses **`Obj_BonePile` 3×** with **no schema line** — 13 of the 14 types are documented.
* `RoomGenNode.as:1923/1942/1960` assign `this.roomType`, not `traplvl`; only `:2380` uses `traplvl`.
* Android `125_Mobile_NpcData.bin` is **UTF-8**, not UTF-16LE — the §0 warning does not apply to it.
