# t1-overturns-02 — HUNTER LENS review (blind critic, §0 law)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-02.json` — **24 findings, 24 judged, 0 skipped.**
Every verdict below carries an artifact **I personally opened**. No other agent's prose was read.

Tooling I built for this pass (scratchpad only, no repo files touched):
recursive SWF tag walker (descends into every `DefineSprite`), a full `PlaceObject3`
flag/filter-list parser (MATRIX + CXFORMWITHALPHA bit-reader), a `DefineSound` extractor,
and a re-implementation of the game's own `ResourceManager.decryptByteArray`.

---

## HEADLINE — the biggest thing this packet got wrong

**S0-5 and finding #23 are both wrong: THE AUDIO IS NOT ENCRYPTED-BEYOND-REACH. IT IS RECOVERED.**

The decryptor is sitting in the repo, in the game's own source:

`reference/decompiled/shs3_android/scripts/ResourceManager.as:200-216`
```
internal static function decryptByteArray(source:ByteArray, key:int) : ByteArray
   for(var i:int = 3; i < 256; i++) {
      if(i % 11 == 0) { temp = int(ba[i]); ba[i] = ba[i+256]; ba[i+256] = temp; }
      ba[i] ^= key;
   }
```
and the key at `ResourceManager.as:186` / `:41`:
```
ba = decryptByteArray(ba, resourceFileNameArray[num].charCodeAt(1));
resourceFileNameArray = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"]
```
→ keys `h`=104, `u`=117, `o`=111, `m`=109, `g`=103. **All five containers decrypt and inflate cleanly.**
A plain whole-file XOR does NOT work (it dies 68 bytes into the deflate stream) — the `i%11` byte-swap
is what previous passes missed, which is why "unopenable" got written down.

| container | key | inflates to | contents |
|---|---:|---:|---|
| `reference/extracted/android/122_Mobile_SoundResource.bin` | 111 | 29,623 B FWS | **13 DefineSound**, MP3 11025 Hz mono |
| `reference/extracted/android/113_Mobile_MusicResource.bin` | 117 | 1,402,677 B FWS | **13 DefineSound**, MP3 11025 Hz mono |
| `115_Mobile_SHS3Resource.bin` | 104 | 1,040,849 B | 1,949 sprites |
| `120_Mobile_BGResource.bin` | 103 | 4,412,340 B | 552 sprites |
| `124_Mobile_ImageResource.bin` | 109 | 1,908,229 B | 94 sprites, 1,473 PO3 |

**The 13 SFX** (id / SymbolClass name / samples / bytes / md5-of-payload):
`deflect 8700/2082` · `die2 7264/1770` · `sumo 31928/6242` · `slash3 2976/1042` · `die3 9545/2186` ·
`refund 8033/1978` · `die1 5290/1458` · `slash2 6130/1562` · `slash1 3809/1146` · `goodkoto 17331/3642` ·
`hitmetal 5717/1562` · `fart 4608/838` · `punch 3456/1146`

**The 13 music STEMS**: `bgm_lose · safepercussion · safekoto · safeambience · bgm_levelup · bgm_gangnam ·
flutes · dungeonpiano · dungeonpercussion · dungeonflute · dungeonambience · battledrums · battlechants`
— all 11025 Hz mono MP3, loop stems of 882,144 / 504,288 samples.

These are byte-exact original assets, not "characterisable from a YouTube rip".

---

## THE OTHER DECISIVE CROSS-CHECK — the sim ticks at 24 Hz, from the bytes

I read the SWF file headers myself:

| file | stage rect | **frameRate** |
|---|---|---:|
| `reference/decrypted/shs3_payload_decoded.swf` (WEB v0.717) | **800 × 690** | **24.0** |
| `reference/decrypted/shs3_android_payload_decoded.swf` | 800 × 480 | 24.0 |

That single byte-pair settles two ledger bullets at once (findings #6 and #15) without needing the video —
though I reproduced the video measurement too (below).

---

## VERDICT TABLE

| # | id | verdict | overturn upheld? |
|---:|---|---|---|
| 0 | blend-modes-none-at-byte-level-web | **HELD** | yes |
| 1 | glow-filters-are-the-real-fx-answer | **HELD** (minor) | yes |
| 2 | hit-reaction-is-a-ladder | **HELD** | **NO** |
| 3 | hold-frames-are-authored-in-data | **REFUTED — fatal** | no |
| 4 | hud-150-is-a-potato-buff | **HELD** | **NO** |
| 5 | hud-150-is-potato-buff | **HELD** | **NO** |
| 6 | killbeat-6000ms-pins-24hz-tick | **HELD** | yes |
| 7 | no-blendmode-holds-for-timeline-tags-too | **HELD** | yes |
| 8 | no-blendmode-in-authored-data | **HELD** | yes |
| 9 | no-blendmode-in-swf-tags-either | **HELD** | yes |
| 10 | no-hold-frames-across-all-487 | **HELD** | **NO** |
| 11 | npc-death-dice-is-seven-way | **HELD** (lane_impact wrong) | yes |
| 12 | predecessor-sfx-lineage | **HELD** | yes |
| 13 | rig-is-27-parts | **HELD** | **NO** |
| 14 | screen-shake-amplitude-is-inert | **HELD** | yes (half) |
| 15 | second-layout-mode-800x690 | **HELD** | yes |
| 16 | sfx-contract-ten-routines | **HELD** | yes |
| 17 | zero-blendmode-byte-proof | **HELD** | yes |
| 18 | zero-placeobject3-tags | **REFUTED — material** | no |
| 19 | NEW-70th-trap-room-is-commented-out | **HELD** | **NO** |
| 20 | NEW-setvisible-partmax-22 | **HELD** | **NO** |
| 21 | NEW-trap-name-suffix-is-trigger-wiring | **HELD** | **NO** |
| 22 | NEW-warhex-has-14-states-not-7 | **HELD** | **NO** |
| 23 | audio-inventory-is-held | **REFUTED — material** | yes (but not for its stated reason) |

**11 of 24 claimed overturns do NOT hold.** 3 findings refuted outright.

---

## 1. The blend-mode cluster (#0, #7, #8, #9, #17, #18) — five right, one wrong

My recursive walk of `reference/decrypted/shs3_payload_decoded.swf`:
```
DefineSprite(39)=827  PlaceObject2(26)=7196  PlaceObject3(70)=304
PO3_hasBlendMode=0    PO3_hasFilterList=263  PO3_cacheAsBitmap=54   total tags=17523
```
android payload: `sprites=675 PO2=6010 PO3=248 blend=0 filters=214 cache=47`.
Decrypted resources: `115: PO2=2032 PO3=12 sprites=1949` · `120: PO2=2105 PO3=54 sprites=552 cacheAB=53` ·
`124: PO2=4653 PO3=1473 sprites=94`. **12+54+1473 = 1,539** (#9's number, exact).
**+304+248 = 2,091** (#0 and #17's number, exact). **Zero hasBlendMode anywhere.**

Streaming recount of the whole 329,520,665-byte `reference/extracted/payload.xml` (#7):
`194 buttonHasBlendMode="false"` + `304 placeFlagHasBlendMode="false"`, **zero `"true"`** — exact.

Code channel: `grep -rn blendMode reference/decompiled/` → **6 hits, all of them
`mx/core/IFlexDisplayObject.as:87/:89` interface declarations**. No game class ever sets a blend mode.

So the *conclusion* "none — normal alpha only" is solid on both channels. But:

### ✗ #18 `zero-placeobject3-tags` — REFUTED
It claims "**there is not a single PlaceObject3 tag**… ~11,500 tags". That is false: there are **2,091**.
Its own numbers give it away — it reports "shs3_payload_decoded.swf (4,051 tags)",
"115_Mobile_SHS3Resource (3,756)", "124_Mobile_ImageResource (330)". I measured the **top-level-only**
tag counts and got **exactly 4,051 / 3,756 / 330**. Its scanner never descended into `DefineSprite`
bodies, which is where every one of the 2,091 PO3 tags lives.
Second error: PlaceObject3 is **not** "the only place a SWF can carry a per-instance blend mode" —
`DefineButton2` carries one too, and `payload.xml` holds **194** such fields.
A right answer reached by a broken instrument. It must not enter the ledger; #0/#9/#17 say the same
thing correctly and should be kept instead.

### #1 glow filters — HELD, one stray number
My PO3 filter-list parse of the web payload: **262 placements carrying 264 filters =
Glow 205 / Blur 57 / DropShadow 2, across 71 sprites**. `sprite 2250 → 50 glows (anonymous)`,
`sprite 3110 → 47`, and `sprite 1624 → 2 glows, class shs3_fla.InteractUI_chikako_portrait_610` — all
verbatim correct. Its `quote` field says "total glow placements: 203"; the real number is **205**,
which its own `text` field states. Minor internal inconsistency, headline numbers exact.

---

## 2. The hold-frame contradiction (#3 vs #10) — the data settles it

These two findings are mutually exclusive. I measured the whole corpus:

```
100:20/0  101:7/0  102:51/0  103:25/0  104:13/0  105:8/0  106:21/0  107:20/0  108:158/0
109:8/0  110:21/0  111:17/0  112:16/0  113:26/0  114:10/0  115:16/0  116:21/0  117:8/0  118:21/0
TOTAL anims 487   TOTAL @d != len(<f>) mismatches 0
```
Identical, file-for-file, to **#10**. **#10 HELD.**

### ✗ #3 `hold-frames-are-authored-in-data` — REFUTED, fatal
It claims "96 of 385 rows have @d > their `<f>` count" and names three rows. All three are wrong:

| row | claimed | **actual** |
|---|---|---|
| `116_1t4643s0.bin heavy_horslash_parta` | d=5, 2 `<f>` | d=5, **5** `<f>` |
| `118_1t4645s0.bin light_horslash_parta` | d=13, 11 `<f>` | d=13, **13** `<f>` |
| `108_1t4635s0.bin heavyhorizontalslash_parta` | d=6, 4 `<f>` | d=6, **6** `<f>` |

The `@d` values it quotes are right; the `<f>` counts are fabricated by whatever parser it used
(likely one that stopped at the first nested `<n>`). Zero mismatches exist in 487 rows.

**Where the holds actually come from** — `AnimData.as:23-141`, a hard-coded per-animation tail
(~35 named entries, `switch(xml.@i.toString())`):
`light_afterslashpose +10` · all 13 `*SLASH_POSE` states `+10` · all 10 `*FALLSLASH_END`/`*JUMPSLASH_LAND`
`+15` · `sheathesword`/`sheathesword3` `+24` · six death anims + `KNEEGROIN_VICTIM` `+6` ·
`gotlauncheddownedend +24` · `downstab_up +10` · `katanadropdown +4` · `katanaattack +8` ·
`firearrow +10` · `throwgrenade +12` · `ogre_nap1_mid +48` · `DEATHTOUCH_PARTA +50` ·
`FLURRY_POSE / CLEAVE_POSE / JUTSU_GROUND_PARTB / GUARDIAN_STOMPFREEZE / AIRSTAB_STAB +24` … .
Held on the last pose by `MCSCharacter.as:1334 if(this.frameCounter < this.currentAnimation.frameList.length)`.
That table is the thing a recreation actually needs; it is not in any ledger.

---

## 3. The 24 Hz proof (#6) — HELD, and stronger than claimed

I re-ran the video measurement myself on `reference/videos/Nr4fQstqHDM.mp4` (60 fps, 1920×1080,
237,047 frames): 64×36 downscale, pixel counted red if `R>60 ∧ R>1.5G ∧ R>1.5B`, run = frames with
red-fraction > 0.65.

```
red run frames 401..760   t=516.683..522.667   360 frames   dur=6.000s
red run frames 281..640   t=587.683..593.667   360 frames   dur=6.000s
```
Exactly the two runs the finding quotes. `StageManager.as:1101 redFreezeCounter = 24 * 6;` verified
verbatim; the alternate exit at `:916` (`== 24 && anim != SHEATHESWORDCHIBURI`) verified verbatim.
144 ticks in 6.000 s ⇒ **24.0 Hz**.

Independent confirmation the finding did not have: **the WEB payload's SWF header frameRate is 24.0.**
And the 15 Hz figure is the upload's: at t=300 s the distinct-frame gap histogram is `{4: 23, 12: 1, 8: 1}`
— a new frame every 4th 60 fps frame = **15 fps capture**.

⚠ **MEASUREMENT-DOC vs FRAME, and here the FRAME WINS.** The ledger's "15fps pose latch" is a correct
description of the VIDEO and a wrong description of the GAME. Overturn upheld.

---

## 4. Overturns that are TRUE but point at the wrong sentence

### #2 hit-reaction ladder — TRUE, overturn NOT upheld
Every cite exact. `MCSPlayer.as:1455-1465` (DOWNSTAB→24 / controlledBy==0→84 / else 12),
`:1762-1768` (THOUSANDSTABS→26, DEADLYCLEAVE→16), `EnemyShield.as:331-339` verbatim including
`PART_weapon → damage=0, return false` and `PART_prop → damage=0, gotHitCounter=24, playHitMetal()`.
Census across all 559 scripts: `12 ×23 · 24 ×2 · 16 ×1 · 26 ×1 · 84 ×1 · 0 ×3 · -1 ×1` — **exact**.
But it names `REBUILD_READINESS.md:241`, "hit-tint scaling (7/12/16f) … all measured/authored but
missing from the art digest §5". `gotHitCounter` is the **stagger window**, not the **tint** frame count,
and the sentence's actual assertion — *these items are authored and absent from the digest* — is
untouched, indeed supported. Nothing in that sentence becomes false.

### #4 and #5 potato buff — TRUE, overturn NOT upheld
`reference/extracted/itemdata.xml:237-249` verbatim: item `2115`, `<type>10</type>`, `<name>4125</name>`,
`<desc>4132</desc>`, `<modifier><id>38</id><value>1</value></modifier>`.
Strings all exact: `4125 Potato Dog · 4126 Potato Bear · 4127 Potato Raccoon · 4128 Potato Cat ·
4227 Potato Pig · 4228 Potato Duck`; `4132 "Eat this potato to get the 150% Damage buff.\n\nNote: Only
one buff may be active at a time."`; `4133/4134/4135` Defense/XP/Speed; `4229/4230` 200% AP-Regen /
Duel-Token-Regen; `125 "Stance Restriction"`.
`MCSPlayer.as:3701-3703` verbatim → **`damage *= 1.2`**, then `:3708 damage -= this.getDefense()`,
then `:3714/:3716 if(behead) damage *= 1.5`.

**A1 confirmation I did myself** — `reference/frames/duel_dense/Nr4fQstqHDM_432.0.png`, crop
`(0,820)-(640,1080)` upscaled 3× (LANCZOS): red-ringed kasa portrait, green bar `20/20`, blue bar
`26/26`, a tan strip reading **`CANNOT CHANGE STANCE`**, and beneath it a yellow line
**`150% DAMAGE`**. Two separate HUD rows — the buff readout is not the stance multiplier.

Both findings nevertheless name `REBUILD_READINESS.md:241` (hit-tint / sword-detach / dash-snap / scarf /
FINISHER_FLASH). A food-buff HUD readout does not make that sentence false. #4's own `lane_impact`
concedes it overturns *a peer claim*, not the ledger. **overturn NOT upheld** for both.

### #10 — TRUE, overturn NOT upheld
Names `:239` "**Ready (strongest slice):** 15fps pose latch; …". Proving the data authors no holds does
not falsify any item in that Ready list — it explains the latch's *mechanism*, i.e. supports it.
The "15fps" half does fall, but to **#6's** evidence, not to this one's.

### #13 rig is 27 parts — TRUE, overturn NOT upheld
`MCSCharacter.as:9-62` carries the whole table `PART_l_hand=0 … PART_r_knee=26` verbatim.
My census: file 108 keyframes `[0-7, 9-16, 18-21]` = **20** indices (crotch=8 and hat=17 never
keyframed); across all 19 blobs the span is **0-26 with 25 in use**; node attrs in 108 =
**24,502 with i/x/y · 24,010 with r · 492 with the a/b/c/d matrix** (2.0%). Every number exact.
But it names `:126`, the readiness-table cell "motion (15fps latch, gaits, slash frames, death),
byte-exact palette". A 27-slot rig spec does not make that cell false — it is additive.

### #19, #20, #21, #22 — all four TRUE, none overturns the ledger
Their `ledger_text` fields **are not in `REBUILD_READINESS.md` at all**. I grepped:
`"Trap-dungeon" 0 · "69 rooms" 0 · "visibility resets" 0 · "wired graph" 0 · "War-Room board" 0 ·
"6x6 hex" 0 · "55 px pitch" 0 · "prop3" 0`. They quote a *peer claim's* text — and in each case the
quoted text already **states the finding's own conclusion** (#19's quote literally ends "A 70th room
exists only inside an XML comment"; #20's quote is #20's claim verbatim; same for #21 and #22).
Restating a sentence is not overturning it. No ledger sentence falls.

The findings themselves are all exact, and I verified every one:
- **#19** `reference/extracted/bindata/93_1t4647s0.bin` — line **22** `<!--<default>`, **29** `</room>`,
  **30** `</default>-->`, four `Trap_ElementAuto` at 25-28. Live `<room>` = **69**, raw = **70**.
  Tiers **easy 13 / medium 21 / hard 15 / veryhard 20**. `RoomGenNode.as:2437
  if(QuestEngine.trapRoomData.§default§.toString() != "")` verbatim. *(citelint's
  `LINE_ON_BINARY` flag is a false alarm — `file(1)` reports the .bin as "XML 1.0 document text,
  ASCII text, with CRLF line terminators", 622 lines.)*
- **#20** `FrameData.as:74-81` verbatim; `partMax=22`, loop `0..21`. Confirmed slots 22-26 are never
  cleared. Extra nuance it omits: `:87-88` force `PART_hat` and `PART_crotch` visible every frame.
- **#21** line **51** verbatim `<obj><id>7</id><name>Obj_FloorSwitch</name><x>200</x><property>Trap_Kunai</property></obj>`;
  schema line **6** verbatim `triggered object,triggered object...`. Measured: **297** live `<obj>`,
  **47** distinct raw `<name>` strings → **14** base types. `Obj_FloorSwitch1 → property Trap_Kunai1`
  pairing found in the medium tier, exactly as described.
- **#22** `WarHex.as:11,13,15,…,37` — all fourteen constants on the exact odd lines quoted;
  values `0-9, 11, 12, 13, 15`; **10 and 14 unused**. Exact.

---

## 5. Overturns that DO hold

- **#11 seven-way death dice** → closes blocker ⑤ *severed-limb death variant*. `NPC.as:898 override
  public function die()`, `:1005 dice = Math.random() * 7;`, branches verbatim including the `else`
  with `mcs.hair.visible = true; mcs.hatHair.visible = false; mcs.createFlyingWeapon();
  mcs.createFlyingHat();`. `dice==4 → ENEMYDEATHNOHAND` and `dice==5 → DEATHINHALF` **are** the
  severed-limb variants, with probabilities. ⚠ Its `lane_impact` is wrong on one number: **18 of 34**
  `Enemy*.as` declare `override public function die()`, not 3. Several delegate
  (`EnemyArcher.as:306 super.die();`, `EnemyElite.as:199 super.die();`) so the *conclusion* survives,
  but "only EnemyGoblin, EnemyGoblinThrower and EnemyZombie override" must not be copied forward.
- **#14 screen shake** → `StageManager.as:1200 startShake(shakeDuration:int, shakeAmt:int = 30)` and
  `:1225 shakeAmount = Math.min(screenShakeAmt,screenShakeCounter);` on the **exact** lines, and
  `:1226-1227 gameStage.x = start.x + (-shakeAmount/2 + Math.random()*shakeAmount)` on both axes.
  All **8** call sites confirmed: `HeavenlySwordProjectile.as:76(12)`, `MCSPlayer.as:911(12)`,
  `:946(24)`, `:4180(12)`, `Trap_CrusherColumnAuto.as:90(6)`, `Trap_CrusherBlockAuto.as:88(6)`,
  `Marker_RumbleTrigger.as:44(data)`, `StatsManager.as:3535(data)`. Blocker ④ said screen-shake was
  "never catalogued" — it is now catalogued down to the formula. **The `hitstop-on-landed-hit` half of
  that same sentence survives untouched** and must stay a blocker.
- **#15 second layout mode** → `GameEngine.as:269-284` verbatim (`originalHeight=480`,
  `originalHeightWithBar=690`, the `<=` aspect branch, `StatsManager.stageShowingFriendBar = true`,
  `OverworldHUD.instance.friendpanel.init()`). And my own header read: **the WEB payload's document
  rect really is 800×690** while the android one is 800×480. "Native canvas is 800×480" is not the
  whole truth for the web build. ⚠ The bullet's *consequence* — "HUD x-fractions measured off 16:9
  video may be pillarbox-wrong" — **survives intact**, because width is 800 in both modes.
- **#16 ten SFX routines** → `SoundManager.as:187/221/255/268/281/294/307/320/333/346` all exact, and
  the 13 asset names they call match, one-for-one, the 13 `DefineSound` SymbolClass names I pulled out
  of the decrypted `122_Mobile_SoundResource`. Full asset→event table.
- **#12 predecessor lineage** → I reproduced its MD5s **exactly**, once I matched its hashing scope
  (MP3 payload after the 2-byte SeekSamples field):
  `punch = cfd26c816a723ed36c45f79877924082` in Duels, SHS1 and SHS2;
  `slash1 = da4e98632c18a175715a1e679a3d42a2` in Duels, SHS1(`sword1`) and SHS2.
  The seven "same length, re-encoded" pairs all check out — identical sample counts and byte lengths,
  first differing byte at offset 13, divergence 89/88/89/78/73/68/68 % for
  slash2/slash3/die1/die2/die3/deflect/hitmetal. SHS1 = 10 DefineSound, SHS2 = 20 ✓.
  `shs2_kon.swf` SymbolClass id 2044 = `com.kongregate.as3.client.KongregateAPI` ✓ (a web build).
  One loose thread: SHS1 `sword3` is 6314 samples / 1666 bytes and does **not** map to Duels `slash3`
  (2976/1042) — the `sword3→slash3` leg of its rename map is unsupported; the SHS2 leg holds.
  Ledger `:348` "the exact waveforms/envelopes are not [study-able]" falls — and falls much harder
  than this finding claims, see below.

---

## 6. ✗ #23 `audio-inventory-is-held` — REFUTED (material)

The inventory half is exactly right and I verified all of it:
- 13 SFX names via `ResourceManager.getSound` ✓ — and they are precisely the 13 `DefineSound`
  SymbolClass names in the decrypted container.
- `punch` serves both `playHit` (`SoundManager.as:261`) and `playHurt` (`:274`) ✓.
- `MusicManager.as:12-44` — 18 `MUSIC_*` presets, gaps at 10 and 13 ✓ exact.
- `SoundManager.as:114 pickMusic(bg:int, isHostile:Boolean, isPvP:Boolean)` ✓, called from
  `StageManager.as:275/:453/:764`.

But its load-bearing negative is **false**:
> "The audio WAVEFORMS are lost … `113_Mobile_MusicResource.bin` and `122_Mobile_SoundResource.bin`
> remain unopenable."

They open. See the headline section. Its own supporting observation ("`CWS`, version byte 100,
declared length 1,969,230,408 vs 1,340,647 actual; zlib and raw-deflate both fail") is a true
description of the **raw** file and a demonstration that the game's own decryptor, present in this
repo at `ResourceManager.as:200-216`, was never applied. A negative asserted without running the
obvious check.

It also under-describes the music: there are **13 stems**, not 18 tracks. `MusicManager.as:50-76`
declares `TRACK_BATTLECHANTS=0 … TRACK_LOSE=12`, `TOTALTRACKS=13`, and `:133-186` builds each of the
18 presets as a **boolean layer mask over those 13 stems** — e.g.
`MUSIC_TOUGHBATTLE = flutes + battledrums + battlechants`,
`MUSIC_DUNGEONCREEPYDANGER = dungeonambience + dungeonflute + dungeonpercussion + dungeonpiano`,
`MUSIC_DOJO = flutes + safeambience + safekoto + safepercussion`.
It is an adaptive layered-stem system, and it is now **fully** recovered: stems as bytes, plus the
mixing table. Verdict REFUTED on the negative; the ledger cell it targets does fall, but for a
completely different and much larger reason.

---

## 7. NEW FINDINGS (not claimed by anyone in this packet)

1. **`audio-fully-recovered-via-resourcemanager-decrypt`** — see headline. Overturns **S0-5**,
   `REBUILD_READINESS.md:240` blocker ①, `:126`'s "all audio" cell, and `:348`.
2. **`web-swf-header-is-24fps-800x690`** — the WEB payload's own header: frameRate **24.0**,
   stage **800×690**. Byte-level web-side proof for #6 and #15 that neither finding had.
3. **`animdata-code-injected-hold-table`** — `AnimData.as:23-141`, ~35 named +2…+50 tails.
   The real "pose latch" spec.
4. **`music-is-13-stems-18-layer-presets`** — `MusicManager.as:50-76` + `:133-186`.
5. **`eighteen-of-34-enemy-classes-override-die`** — corrects #11's `lane_impact`.
6. **`hud-buff-row-is-frame-confirmed`** — A1 crop of `Nr4fQstqHDM_432.0.png` showing the five-row
   bottom-left stack; #4/#5 asserted it at A2 class only.

---

## Housekeeping
- No file outside this journal was modified. `src/core/Sim.ts` and `tests/duel-baseline.test.ts` untouched.
- `reference/decompiled/shs3_android/scripts` and `reference/decompiled/shs3_android_payload/scripts`
  are **byte-identical directories** (`diff -rq` → empty), so cites against either path resolve the same.
- Standing build-parity caveat still applies to every AS3 cite here: the readable decompile is the
  **Android v0.682** build; the web v0.717 payload's classes are obfuscated (`1t8477s0`). Where I could
  cross-check web-side I did (SWF headers, PlaceObject3 flags, `payload.xml`, the 19 web animdata blobs).
