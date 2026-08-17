# CRITIC — LENS 1 (CITE LENS) — unit `art-anim-audio-feel`

Blind review. I did not see the surveyor's reasoning. Every verdict below is backed by an
artifact **I** opened this session; the commands and their output are pasted.

**Bottom line: this is the strongest survey I have graded on this board.** 15 of 18 claims
resolve exactly — file, line and quoted text — and several are *understated* rather than
over-claimed. Three claims fail the cite lens: two on false universals stated as citation
(`hit-reaction-12-ticks`, the `every Enemy* class` parenthetical in `gore-system-not-one-variant`)
and one on arithmetic plus a manufactured invocation of the standing frame-wins invariant
(`aspect-ratio-frame-wins`).

---

## Reproduction log (my own commands)

### Audio — reproduced from raw bytes, no trust in the surveyor's numbers

```
$ python3 -c "from payload_decode import decode, describe; ..." on reference/extracted/android/*.bin
=== 122_Mobile_SoundResource.bin 23928
  raw head 43 57 53 7e d0 1c 6f 6f
  dec: *** REAL SWF *** sig=CWS version=17 fileLength=29,631
  inflates to 29623
=== 113_Mobile_MusicResource.bin 1340647
  dec: *** REAL SWF *** sig=CWS version=17 fileLength=1,402,685   inflates to 1402677
=== 115_Mobile_SHS3Resource.bin 654169   -> CWS v17  inflates to 1040849   (key 104)
=== 124_Mobile_ImageResource.bin 1734935 -> CWS v17  inflates to 1908229   (key 109)
=== 120_Mobile_BGResource.bin 4204635    -> CWS v17  inflates to 4412340   (key 103, brute-forced)
```

Key 111 is *unique* for 122: raw `b[3] = 0x7e = 126`, and `126 ^ 111 = 17`. Not a lucky guess.

My own SWF tag parse of the two audio containers:

```
===== 122_Mobile_SoundResource.bin 29623
 tag histogram [(14, 13), (69,1), (77,1), (9,1), (86,1), (45,1), (82,1), (76,1), (1,1), (0,1)]
 SymbolClass: [(13,'punch'),(12,'fart'),(11,'hitmetal'),(10,'goodkoto'),(9,'slash1'),
               (8,'slash2'),(7,'die1'),(6,'refund'),(5,'die3'),(4,'slash3'),(3,'sumo'),
               (2,'die2'),(1,'deflect')]
  DefineSound id=1..13  fmt=MP3 rate=11025 bits=16 mono
===== 113_Mobile_MusicResource.bin 1402677
 SymbolClass: [(13,'battlechants'),(12,'battledrums'),(11,'dungeonambience'),(10,'dungeonflute'),
               (9,'dungeonpercussion'),(8,'dungeonpiano'),(7,'flutes'),(6,'bgm_gangnam'),
               (5,'bgm_levelup'),(4,'safeambience'),(3,'safekoto'),(2,'safepercussion'),(1,'bgm_lose')]
  ids 2,3,4,7,12,13 -> samples=882144 bytes=159746   (the six overworld stems, byte-identical length)
  ids 8,9,10,11     -> samples=504288 bytes=91522    (the four dungeon stems)
```

`afinfo` on the MP3s I extracted myself:

```
122_9.mp3  (slash1)         1 ch, 11025 Hz, .mp3, 576 frames/packet   estimated duration: 0.572000 sec
113_13.mp3 (battlechants)                                             estimated duration: 79.872000 sec
113_11.mp3 (dungeonambience)                                          estimated duration: 45.760000 sec
113_5.mp3  (bgm_levelup)                                              estimated duration: 29.900000 sec
113_1.mp3  (bgm_lose)                                                 estimated duration: 3.744000 sec
113_6.mp3  (bgm_gangnam)                                              estimated duration: 3.848000 sec
```

Every number in claims 1 and 2 reproduces to the digit. **Stage-0 finding S0-5 ("you may NOT
claim audio is recovered") is correctly overturned.**

### Web-audio-parity — the STILL_UNHELD claim is honest

I signature-checked all 27 web blobs myself. Zero FWS/CWS/ZWS:

```
100..118_*.bin  ef bb bf 3c 3f 78   b'\xef\xbb\xbf<?x'   (BOM + XML)
119_1t4646s0.bin 3c 3f 78 6d 6c 20  b'<?xml '
92_1t4648s0.bin  47 49 46 38 39 61  b'GIF89a'
93_1t4647s0.bin  b'<?xml '
94..98           b'Akeno\r' b'Konoe\r' b'Asai\r\n' b'Ai\r\nAi' b'Anjo\r\n'
```

### Animation — I re-ran the measurement across ALL 19 blobs, not 2

```
$ robust parse  <anim\b([^>]*)>(.*?)</anim>  over reference/extracted/bindata/*.bin
total anims parsed: 487
mismatches d != #f : 0
```

**Trap worth banking:** ~100 of the 487 `<anim>` tags carry an *extra attribute after `d`*
(the loop flag). A strict `<anim i="X" d="N">` regex silently drops them — it drops 38 of the
158 anims in `108_1t4635s0.bin`. My first pass produced a bogus "96 mismatches" that way.
Anyone re-deriving this must parse `<anim\b[^>]*>`.

Raw per-file `<anim ` counts (open/close balanced in every file), totalling **487**:

```
100:20 101:7 102:51 103:25 104:13 105:8 106:21 107:20 108:158 109:8
110:21 111:17 112:16 113:26 114:10 115:16 116:21 117:8 118:21
```

Surveyor's four spot values, re-measured: `light_stance d=1` (118) ✓ · `light_run d=9` (118) ✓ ·
`walk d=20` (108) ✓ · `death d=38` (108) ✓.

Rig size, from source not inference: `MCSCharacter.as` declares exactly **21** `PART_*`
constants, ids 0..20 (`PART_l_hand:int = 0` … `PART_r_lowarm:int = 20`). Claim 12's "21-node
rig" is exact for the human rig. (Creature blobs push node ids to 26; the 21 is not universal.)

### Android/web hash identity — my own MD5 cross-match

```
MD5 99_MCSCharacter_HumanAnimationData.bin = bcfd658e79fafb41f52431afb7d10622
MD5 108_1t4635s0.bin                       = bcfd658e79fafb41f52431afb7d10622
...
total android blobs matching a web blob: 21
MCSCharacter AnimationData blobs: 18   matching: 14
DIFF: 91_Ogre, 93_Skills, 102_Guardian, 104_HumanSpear
```

Exactly as claimed. Claim 13 is airtight.

### Fonts — my own DefineFontName (tag 88) parse

```
115_Mobile_SHS3Resource.bin (key 104), 1949 DefineSprite:
  DefineFontName id=12  name='EPSON 太行書体Ｂ'   copyright='(C) 2000 SEIKO EPSON CORP. All rights reserved.'
  DefineFontName id=61  name='Adobe 고딕 Std B'  copyright='Copyright © 2009-2011 Adobe Systems Incorporated. All Rights Reserved.'
  DefineFontName id=161 name='MS UI Gothic 標準'  copyright='(C)2009 data:RICOH Co.,Ltd. typeface:RYOBI IMAGIX CO.'
  DefineFontName id=307 name='Edo SZ'           copyright='2008 Vic Fieger'
124_Mobile_ImageResource.bin (key 109):
  DefineFontName id=76  name='Edo SZ'           copyright='2008 Vic Fieger'
```

Verbatim. The licence flag on Edo SZ is correct and should be carried.

### Frame — I opened it and cropped it

`reference/frames/duel_dense/Nr4fQstqHDM_432.0.png`, 1920×1080, crop (900,600)–(1300,900)
upscaled ×3 Lanczos. Visibly present, exactly as claim 14 describes: a wide hard-edged blue
wedge sweeping left, **mid-blue body over a darker blue lower half, white double stripe along
its length, solid black outline, tapering to a point**, fully opaque over the grass. Fighter in
navy haori with a red trim stripe, cream/straw patterned obi, white hakama, straw kasa; a
bare-torso enemy collapsing at his feet with a kasa fallen beside him; **no blood and no severed
limb at this instant**. Claim 14 holds by eye.

HUD in the same frame (my own crop of rows 0–260 and the bottom-left plate): `AUTO SLASH OFF`
top-left · `5 HIT COMBO` top-right · HP `20/20` green · `26/26` blue · `CANNOT CHANGE STANCE` ·
`150% DAMAGE` in yellow.

---

## The three failures

### ✗ `hit-reaction-12-ticks` — REFUTED (material)

The claim asserts *"a single uniform 12-tick window … set identically in every enemy class and
in MCSPlayer."* That universal is false. My own grep:

```
$ grep -rhn "gotHitCounter = [0-9]" reference/decompiled/shs3_android/scripts/ | ... | uniq -c
   3 gotHitCounter = 0
  23 gotHitCounter = 12
   1 gotHitCounter = 16
   2 gotHitCounter = 24
   1 gotHitCounter = 26
   1 gotHitCounter = 84
```

The non-12 sites, opened:

- `EnemyShield.as:335-339` — `case mcs.partList[MCSCharacter.PART_prop]: gotHitFlag = true;
  damage = 0; gotHitCounter = 24; SoundManager.instance.playHitMetal();`
  → a **shield block is a landed-hit path with a 24-tick reaction**, double the claimed uniform value.
- `MCSPlayer.as:1768` — `else if(prevActionState == SKILL_DEADLYCLEAVE_STATE) { gotHitCounter = 16; }`
- `MCSPlayer.as:1764` — `else if(prevActionState == SKILL_THOUSANDSTABS_STATE) { gotHitCounter = 26; }`
- `MCSPlayer.as:1457/1461` — `24` (REDFREEZE_STATE + DOWNSTAB) and `84` (local player).

This matters because the lane_impact says *"the authored 7/12/16-frame tint ladder is a
recreation invention — the original's single number is 12."* **The original contains a 16.**
Deleting the ladder on the strength of this claim would be acting on a false universal.

What *does* hold, verbatim: `MCSPlayer.as:3689-3692` (hat/head/neck → `behead = true`),
`:3714-3716` (`if(behead) { damage *= 1.5; }`), `:3719` (`gotHitCounter = 12;`).

### ✗ `aspect-ratio-frame-wins` — REFUTED (material)

**(a) The arithmetic is wrong.** I reproduced the measurement exactly:

```
$ non-black content box of Nr4fQstqHDM_432.0.png
thr  5  cols 48 1871  w 1824  aspect 1.688889
thr 12  cols 52 1868  w 1817  aspect 1.682407
thr 25  cols 52 1867  w 1816  aspect 1.681481
thr 40  cols 52 1867  w 1816  aspect 1.681481
thr 60  cols 52 1867  w 1816  aspect 1.681481
col means 50..55: 0.7 1.1 39.7 83.8 83.3 82.1   (hard edge at col 52)
col means 1864..1869: 82.9 68.3 29.1 2.0 0.5 1.6 (hard edge at col 1867)
```

The claim says *"aspect 1.6815 = 800x480"*. It is not. `800/480 = 1.666667`; the measured
`1.681481` is **0.89% off**. Run the client's own letterbox math for a 1920×1080 window:
`newScale = 1080/480 = 2.25` → surface `800*2.25 = 1800` px wide → `offsetX = (1920-1800)/2 = 60`
→ cols **60..1859**. The frame shows **52..1867**, 16 px wider, with sharp edges. The frame does
**not** confirm 800×480 exactly; it is consistent to ~1% and no better. Any rebuild that re-bases
HUD x-fractions by mapping cols 52..1867 onto 0..800 inherits that 16-px error.

**(b) The "THE FRAME WINS" invocation is a manufactured conflict.** The surveyor cited
`GameEngine.as` resizeHandler but skipped the two lines *inside it* that already answer the
question:

```
GameEngine.as:271   var originalHeightWithBar:int = 690;
GameEngine.as:273   var originalWithBarAspectRatio:Number = originalWidth / originalHeightWithBar;
GameEngine.as:275   if(newAspectRatio <= originalWithBarAspectRatio)
GameEngine.as:278      originalHeight = originalHeightWithBar;
GameEngine.as:279      StatsManager.stageShowingFriendBar = true;
```

The payload itself reconciles 690: it is the **800×690 "friend bar" layout mode**, entered when
the window aspect drops to ≤ `800/690 = 1.1594`. There was never a measurement-vs-frame
disagreement for the standing invariant to arbitrate. Declaring "the frame wins over the SWF
document rect" dresses an already-payload-answered question as a frame victory, on a citation
that omits the answering lines. The *conclusion* (design canvas 800×480) is right; the route
and the equality are not.

### ✗ `gore-system-not-one-variant` — REFUTED (minor; scope parenthetical only)

Every number holds. Re-measured from `reference/extracted/bindata/108_1t4635s0.bin`:

```
death 38 · deathenemy 23 · deathnohand 25 · deathnohead 31 · deathwitharrow 23
deathbyarrow 21 · deathdowned 7 · deathinhalf 28        (8 death anims — exact)
```

`EnemyGoblin.as:354-356`, `:358`, `:360-362`, `:386-423` and `StatsManager.as:314
public static var censored:Boolean = false;` all quote verbatim. The 40/20/20/20 split is exact
(`dice = Math.random() * 5` → `<=1` GOB_DEATH 40%, `==2` ENEMYDEATH, `==3` ENEMYDEATHNOHAND,
`==4` DEATHINHALF).

What fails is the cite's parenthetical *"(mirrored in every Enemy* class)"*. It is not:

```
$ for f in Enemy*.as; do grep -q DEATHNOHEAD "$f" || echo "NO-GORE: $f"; done
NO-GORE: EnemyBear EnemyBoar EnemyCivilianFemale EnemyClone EnemyDeer EnemyElite
NO-GORE: EnemyFox EnemyHorse EnemyNianMonster EnemyPlayer EnemyPlayerGiant EnemyStag
NO-GORE: EnemyVegePatch EnemyWolf EnemyWolf2 EnemyWolfAlpha Enemy_VegePatch
(17 of 34 Enemy*.as)
```

**The gore system is humanoid-only.** Every animal, plus Clone / Player / Elite / NianMonster /
CivilianFemale / VegePatch, takes a non-dismemberment death path. A rebuild that wires
`deathnohead` onto a wolf is diverging.

---

## Minor corrections that do not refute

| claim | correction |
|---|---|
| `adaptive-music-engine` | **18** preset arrays are assigned (`MUSIC_NONE`…`MUSIC_LOSE`, lines 133–185), not 17. `MUSIC_NONE` is the empty one, so "17" is defensible only if you exclude it. All quoted lines resolve exactly. The `~0.83 s` figure is sound: `MusicManager.instance.update()` is `GameEngine.as:923`, in the same tick body as `StageManager.update()` at `:912`, and `Mobile.as:117` sets `frameRate = 24`. |
| `no-blend-modes` | The negative is airtight — `blendMode` has exactly 2 hits (`IFlexDisplayObject.as:87,89`) in *each* of `shs3_android/` and `shs3_payload/`, both the mx interface, and `BlendMode.` never appears. But *"the entire compositing vocabulary is one class"* is wrong: `Minilogo.as:177` sets a `BlurFilter` directly, and `ParticleEmitter.as`, `BG_TownProcGen.as`, `Obj_TownBuilding.as`, `Obj_TownOutside.as` construct `ColorTransform`s outside `ColorCode`. Also "all 559 client classes" — the tree holds 970 `.as` files (553 top-level non-package). |
| `screen-shake-catalogued` | Algorithm, default `shakeAmt = 30`, `Math.min` taper, snap-back and the placement *outside* the `STATE_FROZEN` gate (`:826-830`) all verbatim. But "fully catalogued" misses 3 trigger sites: `HeavenlySwordProjectile.as:76` (12), `Trap_CrusherBlockAuto.as:88` (6), and `StatsManager.as:3535` `StageManager.startShake(val)` — a **data-driven** amplitude. |
| `kill-beat-timings` | All four quotes exact. But the headline "freezes for 24*6 ticks (6.0 s)" is the counter's *initial value*; the exit test at `:916` fires at `counter == 24`, i.e. after 120 ticks = **5.0 s**, extending to 6.0 s only while `SHEATHESWORDCHIBURI` is playing. The claim's own second half says this, so it self-corrects — the headline number is the loose part. |
| `music-13-stems-measured` | "bit-identical lengths are the mechanism that lets them layer in phase" is an inference. The actual phase-lock mechanism is `MusicManager.as:206` (copy the anchor stem's playhead), which the surveyor cites separately in claim 3. Equal lengths are necessary, not the mechanism. |
| `audio-recovered-not-encrypted` | lane_impact says "world-exploration (BGResource, 49 named backgrounds)". `120_Mobile_BGResource.bin` holds a **67-entry** SymbolClass (~52 `BG_*` classes + `bgresource_fla.*` sub-parts + `Canvas`/`RedBG`). The "49" belongs to `123_Mobile_BGData`, a different container. |
| `24fps-keyframe-stream` | **Understated.** The surveyor measured `@d` vs `#<f>` on 2 blobs and claimed the universal. I ran it over all 19 blobs / 487 anims: **0 mismatches**. The universal actually holds. The PARTIAL grade (frames sample at 10 Hz, cannot arbitrate 24 vs 15) is honest and correct. |
| `21-node-rig-held` | 21 is the human `MCSCharacter` rig exactly (`PART_l_hand:int = 0` … `PART_r_lowarm:int = 20`). Node ids run to **26** in creature blobs, so 21 is not a universal across all 487 anims. |

---

## New findings the surveyor missed

### N1 — the frame's `150% DAMAGE` is a consumable buff, not a stance modifier (overturns the survey's own CAUTION)

Claim 17 flags *"the HUD shows '150% DAMAGE' … which reads as the stance modifier — do not
conflate the two 1.5s."* It is not the stance modifier, and the two-1.5s framing is wrong on
both sides:

- The stance rock-paper-scissors multiplier in the shipped client is **×1.2**, not ×1.5:
  `MCSPlayer.as:3701-3703` — `if(this.stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE
  || … ) { damage *= 1.2; }`.
- The HUD line resolves to a **consumable food buff**. `reference/extracted/itemdata.xml:237-249`:
  `<item><id>2115</id><type>10</type><name>4125</name> … <desc>4132</desc>
  <modifier><id>38</id><value>1</value></modifier></item>`, and via the Android string table
  `118_Mobile_Lang_EN.bin` → `resname 4125 = "Potato Dog"`, `resname 4132 = "Eat this potato to
  get the 150% Damage buff.\n\nNote: Only one buff may be active at a time."`

So the frame is showing an **active buff readout** (buff name + its restriction line
`CANNOT CHANGE STANCE`), which is a HUD element no ledger holds, and the ×1.2 stance multiplier
is a combat-core number.

### N2 — `gotHitCounter` is a ladder, not a constant

See the refutation above. `12` general · `24` on shield-block · `16` after Deadly Cleave ·
`26` after Thousand Stabs · `24`/`84` in redfreeze. The original *does* contain a 16.

### N3 — the `@d == #<f>` invariant is universal, and the loop flag is a parsing trap

0 mismatches across all 487 anims in all 19 web animdata blobs. But ~100 `<anim>` tags carry an
extra attribute after `d` (the loop flag), so a strict `<anim i="X" d="N">` regex drops them
silently — 38 of 158 in `108_1t4635s0.bin` alone, and it manufactures ~96 phantom "hold frames".

### N4 — the gore system is humanoid-only

17 of 34 `Enemy*.as` classes carry no `DEATHNOHEAD` / dismemberment branch at all.

### N5 — the client ships a second layout mode: 800×690 "friend bar"

`GameEngine.as:271/273/275/278/279`. The ledger's "aspect-ratio truth" item has **two** answers
— 800×480 when window aspect > 1.1594, 800×690 with the friend bar below it otherwise — not one.
This is also why the `shs3.swf` document rect decodes to 800×690.

---

## Verdict summary

- 15 claims survive the cite lens intact (2 of them stronger than stated).
- 3 refuted: `hit-reaction-12-ticks` (material), `aspect-ratio-frame-wins` (material),
  `gore-system-not-one-variant` (minor, scope parenthetical).
- The `STILL_UNHELD` claim (`web-audio-parity-unheld`) is honest and I confirmed its negative
  byte-check myself. It is the correct answer and should not be pushed harder.
- Score 84 is defensible but should come down a notch on the two material refutations and on
  the survey's own admission that the 1,949 SHS3Resource sprites and 67 BGResource symbols were
  never rendered or graded.
