# GAUNTLET L0 — BLIND CRITIC (Lens 2, hunter): **art-anim-audio-feel**

Critic: hunter · date 2026-08-15 · unit under review:
`docs/gauntlet/L0/systems/art-anim-audio-feel.md` (surveyor, 2026-08-14, proposed 56 → 84)

I did not see the surveyor's reasoning. I re-opened every artifact myself, wrote my own
decoder and my own SWF tag parser rather than reusing `reference/tools/payload_decode.py`
output, and cropped the frame myself. Nothing outside this file was modified.

**Headline: the audio break is real and it reproduces byte-for-byte.** I brute-forced all
256 keys independently and landed on the same five, with the same declared and inflated
lengths, and pulled the same 26 MP3s. That is the load-bearing result of this lane and it
survives adversarial re-derivation intact.

**Three claims do not survive.** Two are numeric (`21-node rig`, `uniform 12-tick hit
reaction`), one is an interpretation error dressed up as a frame-vs-doc conflict
(`aspect-ratio-frame-wins`). All three are refuted from artifacts the surveyor itself
cited, plus one it did not open.

**Suggested score: 84 → 78.** The audio/font/FX/shake/gore/kill-beat block is as strong as
claimed — stronger, in two places. The deductions are for the rig count, the hit-reaction
over-generalisation, the manufactured aspect-ratio conflict, and for leaving
`reference/predecessors/` — 30 DefineSound tags sitting in this repo — completely unopened
while writing the audio-parity STILL_UNHELD.

---

## PART 1 — WHAT I REPRODUCED (verdicts: HELD)

### ✅ audio-recovered-not-encrypted — HELD, reproduced independently
I wrote my own decoder (same published transform, 256-way brute force) and my own SWF tag
walker. Output, verbatim from my run:

```
=== 122_Mobile_SoundResource.bin (23,928 B) head=43 57 53 7e d0 1c 6f 6f
  *** key=111 sig=CWS v17 declaredLen=29,631 inflated=29,623
SYMBOLCLASS: [(13,'punch'),(12,'fart'),(11,'hitmetal'),(10,'goodkoto'),(9,'slash1'),
              (8,'slash2'),(7,'die1'),(6,'refund'),(5,'die3'),(4,'slash3'),(3,'sumo'),
              (2,'die2'),(1,'deflect')]
DefineSound count = 13   (all: MP3 11025Hz 16bit mono)
afinfo slash1.mp3 -> 'Data format: 1 ch, 11025 Hz, .mp3 ... 576 frames/packet'
                     'estimated duration: 0.572000 sec'
```
All five keys reproduce exactly: 122→**111**, 113→**117**, 115→**104**, 124→**109**,
120→**103**, with inflated sizes 29,623 / 1,402,677 / 1,040,849 / 1,908,229 / 4,412,340 —
every figure matching the surveyor's table. **Stage-0 S0-5 is correctly overturned.**

### ✅ music-13-stems-measured — HELD, every duration reproduced
My `afinfo` pass, all 13: battlechants / battledrums / flutes / safeambience / safekoto /
safepercussion = **79.872000 sec** each; dungeonambience / dungeonflute / dungeonpercussion
/ dungeonpiano = **45.760000 sec** each; bgm_levelup 29.900000; bgm_lose 3.744000;
bgm_gangnam 3.848000. The six overworld stems are additionally identical in *payload* size
(159,744 B / 882,144 samples) and the four dungeon stems likewise (91,520 B / 504,288
samples) — the phase-lock mechanism is real.

### ✅ adaptive-music-engine — HELD (two small corrections, not refutations)
`MusicManager.as` verified at the quoted lines: `:301 volume -= 0.05`, `:329 volume +=
0.05`, `:206 playPosition = int(scArray[TRACK_FLUTES].position)`, `:243 play(0,1)`,
`:248 play(0,999)`, `:255` SOUND_COMPLETE re-arm. I additionally traced the tick: the fade
runs in `MusicManager.update()`, called from `GameEngine.as:923`, inside the
`Event.ENTER_FRAME` gameloop registered at `GameEngine.as:442`, at `frameRate = 24` — so
"±0.05 per tick ≈ 0.83 s" is confirmed end-to-end, which the surveyor asserted but did not
trace.

Corrections: (1) there are **18** `presetsArray[MUSIC_*]` assignments and 18 `MUSIC_*`
constants (`MUSIC_NONE` … `MUSIC_LOSE = 102`); "17 presets" is the count of *non-empty*
masks — defensible but should say so. (2) The phase-lock anchor is a **six-deep fallback
chain**, not just flutes: `:206` FLUTES → `:210` BATTLEDRUMS → `:214` SAFEPERCUSSION →
`:218` DUNGEONPIANO → `:222` DUNGEONAMBIENCE → `:226` DUNGEONFLUTE. A recreation that
phase-locks only to flutes will desync in dungeons.

### ✅ sfx-playback-contract — HELD verbatim
`SoundManager.as` read directly: `playSlash()` `var dice:int = Math.random() * 3;` →
slash1/2/3, each a bare `sound.play()`; `playDie()` identical shape → die1/2/3;
`playHit()` and `playHurt()` are byte-for-byte the same body, both
`ResourceManager.getSound("punch")`. No SoundTransform anywhere. Exactly as claimed.

### ✅ font-identified — HELD, and I found one more copyright string
My `DefineFontName` parse of the decoded containers:
```
115_Mobile_SHS3Resource: (12,'EPSON 太行書体Ｂ','(C) 2000 SEIKO EPSON CORP. All rights reserved.')
                         (61,'Adobe 고딕 Std B','Copyright © 2009-2011 Adobe Systems Incorporated...')
                         (161,'MS UI Gothic 標準','(C)2009 data:RICOH Co.,Ltd. typeface:RYOBI IMAGIX CO.')
                         (307,'Edo SZ','2008 Vic Fieger')
124_Mobile_ImageResource: (76,'Edo SZ','2008 Vic Fieger')
```
Ledger blocker ② is correctly dead. The licence flag is correctly raised — and MS UI Gothic
carries a **third-party typeface credit to RYOBI IMAGIX** that the surveyor omitted, i.e.
one more non-Lut asset.

### ✅ no-blend-modes — HELD, and I strengthened it from the data side
Code side: my grep over **all** decompiled trees (`shs3_android`, `shs3_payload`,
`shs3_android_payload`) returns exactly three files, all the same one —
`mx/core/IFlexDisplayObject.as:87/89`, an interface declaration. Zero game classes.

The surveyor stopped there, and a code-only grep is not sufficient: in Flash, a blend mode
is usually **authored on the timeline**, riding in a `PlaceObject3` tag, never touching
ActionScript. So I checked the bytes. My PlaceObject3 scan (top-level *and* nested inside
every `DefineSprite`) across `115_Mobile_SHS3Resource`, `124_Mobile_ImageResource`,
`120_Mobile_BGResource`, `113_Mobile_MusicResource`, `122_Mobile_SoundResource`:
**`PlaceObject3-with-blendmode-flag count: 0`** in every one.

The claim is therefore true on both the code path and the authoring path. Blocker ③ dead.

*Nit:* the claim says "all 559 client classes". Actual `.as` count under
`shs3_android/scripts/` is **970** (956 excluding `mx/`). Wrong number, right result.

### ✅ screen-shake-catalogued — HELD verbatim
`StageManager.as` read directly: `startShake(shakeDuration:int, shakeAmt:int = 30)`,
`shakeAmount = Math.min(screenShakeAmt,screenShakeCounter)`, `±shakeAmount/2` on both axes,
snap-back to `screenShakeStartPos` at counter 0. And the freeze interaction is exactly as
described — `if(screenShake) doShake();` sits **above** `if(actionState != STATE_FROZEN)`.

*Incomplete, not wrong:* the trigger set is 8 sites, not 5. The survey missed
`HeavenlySwordProjectile.as:76 startShake(12)`, `Trap_CrusherBlockAuto.as:88 startShake(6)`,
and `StatsManager.as:3535 startShake(val)` (fully data-driven amplitude).

### ✅ no-hitstop (PARTIAL) — HELD; I could not break it either
I ran a **wider** grep than the surveyor — case-insensitive, all decompiled trees:
`hitstop|hitpause|freezeframe|slowmo|timescale|hitfreeze` → **zero hits, everywhere**. And
`actionState = STATE_FROZEN` occurs at exactly two sites, `StageManager.as:162` and `:212`,
with the only other reference being the read at `:830`. The PARTIAL grade is the honest one
and I endorse it. Hunter lens applied and came back empty: there is no hitstop to find.

### ✅ gore-system-not-one-variant — HELD, with the load-bearing detail the survey omitted
Every frame count verified against the **web** blob `108_1t4635s0.bin`: death 38 ·
deathenemy 23 · deathnohand 25 · deathnohead 31 · deathinhalf 28 · deathwitharrow 23 ·
deathbyarrow 21 · deathdowned 7; and `103_1t4630s0.bin` carries seppuku_start 16 /
seppuku_mid 16 / seppuku_end 14 / seppuku_nohead 26.

The 40/20/20/20 split only works because of a detail the survey never states: **`dice` is
declared `var dice:int = 0;` at `EnemyGoblin.as:327`**, so `dice = Math.random() * 5`
truncates to a uniform draw over {0,1,2,3,4} and `dice <= 1` really is 40%. Had it been
`Number`, `dice == 2` would have had probability zero and the whole distribution would be
wrong. I checked; it is `int`. Claim stands.

*Over-generalised cite:* "mirrored in every Enemy* class" is false. There are 34 `Enemy*.as`
files; `dice = Math.random() * 5` appears in **5** (`EnemyGoblin`, `EnemyCivilian`,
`EnemySpearElite`, `EnemyGoblinThrower`, `NPC`) and `StatsManager.censored && fatal` in
**3**. The rule is real but not universal.

### ✅ blood-vfx-exact — HELD verbatim
`BloodParticleEmitter.as` constructor read directly: `pnumber = 20; px = 0; py = 0;
pangle = 0; panglevariance = 10; pvel = 6; pvelvariance = 2; pgravity = 0.6; pttl = 24;`
and the per-death emitter overrides (neck 130 / head 180 `setVel(4)` `setNumber(10)`;
neck 60 + l_uparm 180 `setVel(5)`; stomach 180 / pelvic 120; torso 80 with
`setAngleVariance(15)`) are all present verbatim in `EnemyGoblin.die()`.

### ✅ 24fps-keyframe-stream (PARTIAL) — HELD, and I found a better cite than the surveyor's
I verified `@d == len(<f>)` not on a spot-check but **exhaustively**: parsed all 487 `<anim>`
blocks across all 19 web animdata blobs — `anims with NO d attr: 0` and
`d != frame count: 0`. The data genuinely holds zero hold frames.

The code-side latch mechanism is exactly as described, and the reason it works is that the
two guards compare against *different* numbers: `updateAnimation()` tests
`frameCounter < currentAnimationDuration` (the `AnimData`-inflated value) while
`updateFrame()` tests `frameCounter < currentAnimation.frameList.length` (the authored
count) — so the tail ticks pass through `updateAnimation` but assign no new pose. Verified
at `MCSCharacter.as:1315` / `:1334`. Tail distribution across `AnimData.as`: `+= 6` ×8,
`+= 24` ×7, `+= 10` ×4, `+= 12` ×3, `+= 2` ×2, and one each of 4/8/15/20/48/50.

**Upgrade to the cite:** the surveyor's 24 fps evidence was `shs3.swf` (the *loader* shell —
2 frames, DoABC + SymbolClass only, no game content) and `Mobile.as:117` (Android). I read
the **web payload's own header**: `reference/decrypted/shs3_payload_decoded.swf` → `CWS v17,
framerate=24.0`. The 24 Hz clock is now proven for the **web v0.717 build directly**, with
no Android caveat at all. Use that cite, not the loader.

### ✅ android-web-byte-identity — HELD, reproduced exactly
My own MD5 cross-match of the two trees: **21 blobs identical**, including the two hashes
quoted verbatim — `99_MCSCharacter_HumanAnimationData.bin == 108_1t4635s0.bin =
bcfd658e79fafb41f52431afb7d10622` and LightStance == `a4d5501845c9fd553710c4d8139a7cd0`. Of
the 18 `MCSCharacter_*` animation blobs, **14 identical**; the 4 that differ are exactly
Ogre, Skills, Guardian, HumanSpear. Nothing to correct. This is the best-evidenced claim in
the unit after the audio.

### ✅ blade-trail-frame — HELD, I opened the crop myself
`reference/frames/duel_dense/Nr4fQstqHDM_432.0.png`, crop `(900,600)-(1300,900)`, ×3 Lanczos.
**Visibly in my crop:** a hard-edged blue wedge sweeping down-left, pale blue along its top
edge over a saturated blue body, **two thin white stripes** running its length, a solid
black outline, tapering to a point at the tail — and it **occludes** the grass blades behind
it, no lightening, no glow bloom. Fighter: straw kasa, navy haori with red lapel trim,
patterned cream obi, white hakama, bold black outlines on flat fills. To the right, a
bare-torso enemy in a downed/hunched pose with straw kasa shapes fallen beside him, **no
blood and no severed limb at this instant**. The surveyor's description is accurate.

*Nit:* the wedge emanates from the fighter's waist/hip, not "from the fighter's hands" —
his hands are not resolvable in this crop.

### ✅ kill-beat-timings — HELD verbatim
`StageManager.as` read directly: `redFreezeCounter = 24 * 6` (victory) / `24 * 3 + 6`
(harvest); `if(redFreezeCounter == 24 * 5)` → `battleUI.showWin()`;
`else if(redFreezeCounter == 24 && ...getAnim() != MCSActor.SHEATHESWORDCHIBURI ||
redFreezeCounter == 0)` → end; `else if(redFreezeCounter == 24 * 3)` → `showLose()`. All four
constants confirmed.

---

## PART 2 — REFUTED

### ❌ REFUTED (material) — `21-node-rig-held`: the rig is **19** nodes, not 21

Measured on **the surveyor's own cited artifact**,
`reference/extracted/bindata/118_1t4645s0.bin`, first frame of `light_stance`:

```
light_stance frame0 node ids: ['19','16','15','14','13','12','11','10','9','7','6','5',
                               '4','2','1','0','20','18','3']
COUNT = 19
```

Max `<n>` in any single frame, per web animdata blob — **not one file reaches 21**:
```
118 (LightStance) 19   106 (HeavyStance) 19   97-equiv/BalancedStance 19   104 (Reversed) 19
108 (Human) 20   110 (DualStance) 20   112 (Wolf) 26   111 18   113 18   107 17   115 17
101 16   105 16   109 16   117 16   100/102/103/114/116 19
```
The stance sets carry **19** nodes per pose; the human set peaks at **20**; the wolf set at
**26**. Separately, `MCSCharacter.as` declares **27** `PART_*` constants
(`PART_l_hand = 0` … `PART_r_knee = 26`). **21 matches none of these three numbers.**

Everything else in the claim is exactly right and I verified it: `FrameNodeData` applies
`x`/`y`/`rotation` directly, or a `matA..matD ÷ 100` matrix when `rotation == 999` /
`mc.skewed`; and the total is **487** `<anim>` across the 19 web blobs (I counted:
158+51+26+25+21+21+21+20+20+17+16+16+13+10+8+8+8+7 … = 487).

A recreation built to a 21-joint rig will not map onto this data. Correct number for the
board: **19 keyed nodes in the stance sets, 20 in the human set, 27 named parts in code.**

### ❌ REFUTED (material) — `aspect-ratio-frame-wins`: 690 is the **friend bar**, and there was never a frame-vs-doc conflict

I reproduced the measurement exactly — `thr 25/40/60 → cols 52..1867, w 1816, h 1080,
aspect 1.681481`, stable across thresholds — and I opened the frame and confirmed the
pillarbox by eye. That part is fine. The **resolution** is wrong, three ways:

**(a) 690 is not container chrome. It is a game-drawn friend panel.**
`GameEngine.as:269-283`, verbatim:
```
var originalWidth:int = 800;
var originalHeight:int = 480;
var originalHeightWithBar:int = 690;
...
if(newAspectRatio <= originalWithBarAspectRatio)
{
   originalAspectRatio = originalWithBarAspectRatio;
   originalHeight = originalHeightWithBar;
   StatsManager.stageShowingFriendBar = true;
   if(OverworldHUD.instance != null) { OverworldHUD.instance.friendpanel.init(); }
}
```
The 210 px difference is `friendpanel` — an in-game UI element the engine lays out itself,
switched on when the viewport is narrower than 800:690. Calling it "container chrome, not
play area" is a factual error, and it buries a cross-lane finding (see NEW-2).

**(b) There is no conflict for the frame to win.** I read the payload headers myself:
```
reference/decrypted/shs3_payload_decoded.swf   (WEB v0.717)  rect 800.0 x 690.0  framerate 24.0
reference/decrypted/shs3_android_payload_decoded.swf (ANDROID) rect 800.0 x 480.0  framerate 24.0
```
The web document rect is 800×690 and the Android one is 800×480 — **exactly the two branches
of the same `resizeHandler`**. The doc rect and the payload code agree with each other and
with the frame. Invoking the standing "THE FRAME WINS" invariant here manufactures a
disagreement that does not exist, and that cheapens the invariant for the cases where it
genuinely applies.

**(c) The arithmetic is stated as an identity when it is an approximation.**
`1816 / 1080 = 1.68148`; `800 / 480 = 1.66667`. At 1080p an exact 5:3 surface is **1800** px
wide, not 1816 — 16 px unaccounted, 8 per side. "aspect 1.6815 = 800x480" is not an
equality. My own edge profile shows the transition over ~2 px (col 50 = 1.9, col 52 = 48.2,
col 54 = 95.5 mean luma), so encoder ramp does not account for all 16 px.

**What survives:** the visible surface in this frame is ≈5:3 and is definitively *not*
800×690 (1.159). HUD fractions measured off 16:9 video do need re-basing. The conclusion is
right; the stated reasoning is not.

### ❌ REFUTED (material) — `hit-reaction-12-ticks`: not uniform, and the "150% DAMAGE" reading is wrong

**(a) "set identically in every enemy class and in MCSPlayer" is false.** My exhaustive
count of `gotHitCounter = N` across `shs3_android/scripts/`:
```
  23 × 12      3 × 0      2 × 24      1 × 84      1 × 26      1 × 16      1 × -1
```
and the non-12 sites are not obscure — several are in `MCSPlayer` itself:
```
MCSPlayer.as:1457  case REDFREEZE_STATE: if(mcs.animation == DOWNSTAB)  gotHitCounter = 24;
MCSPlayer.as:1461                        else if(this.controlledBy == 0) gotHitCounter = 84;
MCSPlayer.as:1764  else if(prevActionState == SKILL_THOUSANDSTABS_STATE) gotHitCounter = 26;
MCSPlayer.as:1768  else if(prevActionState == SKILL_DEADLYCLEAVE_STATE)  gotHitCounter = 16;
EnemyShield.as:338 case PART_prop: damage = 0; gotHitCounter = 24; playHitMetal();
```
Only **11 files** contain `gotHitCounter = 12` at all. 12 is the *default* reaction window
on the ordinary damage path, not a global invariant. A recreation that hard-codes 12
everywhere will get shield-block, down-stab and the two ultimate recoveries wrong.

**(b) The "un-reconciled" caution resolves against the surveyor's guess.** The survey
speculates the frame's "150% DAMAGE" "reads as the stance modifier". It does not.
`OverworldHUD.as:1402-1405`, verbatim:
```
else if(bufftype == StatsManager.BUFF_ATTACK)
{
   buffstr = "150% DAMAGE";
}
```
That is the *exact* string on screen, emitted by `updateBuff(bufftype, duration)` into
`this.bufftext` — the timed consumable-buff readout (`BUFF_ATTACK = 1`, siblings
`"150% XP"`, `"150% DEFENSE"`, `"150% SPEED"`, `"200% AP REGEN"`). Corroborated by the
string table: `strings.json` id **4132** = *"Eat this potato to get the 150% Damage buff.\n\n
Note: Only one buff may be active at a time."*

And the stance modifier is **not 1.5 at all** — `MCSPlayer.as`, a few lines above the
behead multiplier:
```
if(this.stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE || ... ) { damage *= 1.2; }
```
So there are **three** distinct multipliers, not two: stance triangle **×1.2**, behead
**×1.5**, and a consumable **BUFF_ATTACK** whose label reads 150%.

**What survives:** `gotHitCounter = 12` on the main `gotHit` path, and the behead branch
(`PART_hat` / `PART_head` / `PART_neck` → `behead = true`, then `damage *= 1.5`) — both
verified verbatim at `MCSPlayer.as:3689-3719`. The body-part headshot mechanic is real and
is a genuine cross-lane find.

### ⚠️ REFUTED (minor, scope only) — `web-audio-parity-unheld`: the negative is right, the consequence is over-broad

I verified the negative myself and it is solid. My tag scan of the decoded **web** payload:
```
WEB payload v0.717:  DefineSound: 0   DefineBinaryData: 27
   heads: GIF ×1, '<?x' ×3, plaintext name tables ×5, UTF-8 BOM animdata ×18 — no CWS
ANDROID payload:     DefineSound: 0   DefineBinaryData: 42   (5 of them CWS)
```
So yes: the web client held no packed audio and streamed it separately. Correct.

But "**we do not hold them**" and "**all audio claims here are Android v0.682 and must be
labelled as such**" over-reaches, because the survey never opened `reference/predecessors/`.
See NEW-6: two of the thirteen SFX masters are byte-identical to assets shipping in the same
studio's **web Flash** games. Those two carry no Android caveat at all.

---

## PART 3 — NEW FINDINGS (things the survey missed)

**NEW-1 · The rig is 19 keyed nodes / 27 named parts.** `118_1t4645s0.bin` `light_stance`
frame 0 = 19 `<n>`; `MCSCharacter.as` declares `PART_l_hand=0 … PART_r_knee=26` (27 parts).
Lane impact: L6 / art-anim-audio-feel skeleton spec.

**NEW-2 · `stageShowingFriendBar` — a viewport-driven social panel nobody holds.**
`GameEngine.as:271` `originalHeightWithBar = 690`, `:278-282` flips `originalHeight` to 690,
sets `StatsManager.stageShowingFriendBar = true` and calls
`OverworldHUD.instance.friendpanel.init()`. The web payload's own stage is 800×690, the
Android payload's is 800×480 — the two builds ship the two branches. **Cross-lane: this is a
ui-hud and meta-social finding, not an art one**, and neither lane has it.

**NEW-3 · 24 Hz is provable on the WEB build directly.**
`reference/decrypted/shs3_payload_decoded.swf` header: `CWS v17, framerate = 24.0`. Retire
the `shs3.swf`-loader and `Mobile.as` (Android) cites for the animation clock; this one has
no build caveat.

**NEW-4 · The frame's "150% DAMAGE" is the BUFF_ATTACK consumable readout.**
`OverworldHUD.as:1404` `buffstr = "150% DAMAGE";` under `bufftype == StatsManager.BUFF_ATTACK`;
`strings.json` 4132 "Eat this potato to get the 150% Damage buff." Closes the survey's own
"un-reconciled" note. **ui-hud needs a buff-text slot.**

**NEW-5 · The stance triangle multiplier is ×1.2.** `MCSPlayer.as`, light>balanced,
balanced>heavy, heavy>light → `damage *= 1.2` (and sets `damagetextcol = 16777215`, i.e.
the popup turns **white** on a stance-advantage hit). **Cross-lane: combat-core.**

**NEW-6 · `reference/predecessors/` holds 30 unexamined DefineSound tags, 2 byte-identical
to SHS3.** `shs2_kon.swf` (SHS2, web Flash) = 20 DefineSound, named
`deflect die1 die2 die3 hitmetal punch slash1 slash2 slash3 boom1 boom2 boom3` + 7 music
tracks (`power_mp3 area2_mp3 area3_mp3 area4_mp3 boss_fight_mp3 cutscene4_mp3
ending_cutscene_mp3`). `shs1_462631_shunpo202c.swf` = 10 (`sword1-3 hit1-3 punch bossdie
crash music1`). MD5 over the extracted MP3 payloads:
```
shs3 'punch'  == shs2 'punch'  == shs1 'punch'   cfd26c816a723ed36c45f79877924082
shs3 'slash1' == shs2 'slash1' == shs1 'sword1'  da4e98632c18a175715a1e679a3d42a2
```
The other seven shared names match in **sample count and byte length** but differ in bytes
(re-encode), e.g. die2 7264/1768 in both. So the studio's SFX library runs SHS1 → SHS2 →
SHS3 with masters carried forward, and **two SHS3 SFX are provably pre-Android web-Flash
assets**. Also: 7 SHS2 music tracks were never surveyed by any lane.

**NEW-7 · No blend mode in the *authored* data either.** PlaceObject3 blend-mode flag count
= **0** across all five decoded resource SWFs, top-level and nested in every DefineSprite.
This is the half of blocker ③ a code grep cannot answer, and it closes it.

**NEW-8 · Three missed `startShake` triggers.** `HeavenlySwordProjectile.as:76` (12),
`Trap_CrusherBlockAuto.as:88` (6), `StatsManager.as:3535 startShake(val)` — the last is
fully data-driven, so the amplitude set is open-ended, not the five listed.

**NEW-9 · `@d == len(<f>)` verified exhaustively, not spot-checked.** All 487 anims across
all 19 web blobs: `anims with NO d attr: 0`, `d != frame count: 0`. Promote this from a
four-sample spot-check to a measured universal.

---

## SCORE

| | |
|---|---|
| Surveyor proposed | **84** |
| Hunter counter-proposal | **78** |

Reproduced and endorsed: the entire audio recovery (26 masters + mixing + trigger contract),
the font programs, the no-blend-mode result (now proven twice over), screen-shake, the
no-hitstop negative, the gore system, the blood constants, the byte-identity proof, the
kill-beat, and the frame's flat-opaque blade trail. That is a large, real advance and most
of the 56→84 is earned.

Against it: a rig count that matches nothing in the data, a hit-reaction "uniform" that
isn't, a "THE FRAME WINS" invocation on a conflict that does not exist while the actual
answer (a friend panel) sat one line above the quoted code, and `reference/predecessors/` —
two SWFs, 30 sound assets, in this repo — never opened while writing the audio STILL_UNHELD.
