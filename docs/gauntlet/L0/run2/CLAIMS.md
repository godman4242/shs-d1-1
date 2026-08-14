# L0 — salvaged claim set (raw surveyor output)

> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED
> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).
> Banked: 12 surveys · 13 critic reviews · 336 claims · 256 verdicts.

## art-anim-audio-feel — re-scored 84

56 -> 84. Every one of the five named blockers in the "### art-anim-audio-feel — 56" block is now resolved: (1) ALL AUDIO is recovered as 26 playable MP3 masters plus the complete mixing/trigger contract; (2) the font is identified down to its embedded font program and vendor copyright string; (3) "FX blend modes" is answered — the game sets NO blendMode anywhere, all compositing is ColorTransform + BlurFilter + ColorMatrixFilter via one small class; (4) screen-shake is fully catalogued (exact algorithm, default amplitude 30, trigger set); (5) the severed-limb death is not one variant but a gore SYSTEM with a measured 40/20/20/20 distribution, a behead flag, and a global censor switch. On top of that the animation model is settled from bytes (24 Hz keyframe stream, 21-node rig, code-added hold tails) and 14 of 18 animation blobs are proven byte-identical between the Android and web builds, so the usual Android caveat does not apply to motion. Held back from higher: the newly-opened vector art (1,949 sprites in SHS3Resource, 49 backgrounds in BGResource) was not rendered or graded this pass; audio web-parity is unproven (the web payload holds no CWS blob at all); and no test in the suite pins any of this yet.

### `art-anim-audio-feel/21-node-rig-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The authored motion itself is held byte-exact: a 21-node skeletal rig where each <n> carries x, y and rotation (or a 2x2 matrix divided by 100 when skewed), applied straight onto MovieClip transforms — 487 authored animations across the 19 web-payload animdata blobs.

- **Cite:** `reference/extracted/bindata/118_1t4645s0.bin head (light_stance pose); reference/decompiled/shs3_android/scripts/FrameNodeData.as:27-75; counted 487 <anim> across reference/extracted/bindata/*.bin with root animdata`
- **Quote:** 118_1t4645s0.bin: `<anim i="light_stance" d="1">` / `<f i="0">` / `<n i="19" x="14" y="-67" r="-25"></n>` ...  ·  FrameNodeData.as:60-70 `mc.x = this.x; mc.y = this.y; mc.rotation = this.rotation;` else `m.a = this.matA / 100;`
- **Overturns:** "motion (15fps latch, gaits, slash frames, death), byte-exact palette"
- **Lane impact:** art-anim-audio-feel: the §2 scorecard's 'Rebuild-ready now' entry undersells reality — motion is not 'measured from video', it is the shipped keyframe data. 487 anims measured vs the board's assumed ~150 (Stage-0 S0-4 estimated ~450).

### `art-anim-audio-feel/24fps-keyframe-stream` — PARTIAL [A3] ⚑ OVERTURNS LEDGER

The animation clock is 24 fps with exactly one keyframe per tick — the XML's @d equals the number of <f> children for every animation, so the data holds no hold frames; the 'latch' is injected in code by AnimData's per-animation duration tails, which the frame guard then holds on the final pose.

- **Cite:** `SWF header of reference/preservation/shs3.swf (framerate 24.0); reference/decompiled/shs3_android/scripts/Mobile.as:117; MCSCharacter.as:1309-1338 (updateAnimation/updateFrame); AnimData.as:23-142 (duration tails); measured @d vs len(<f>) across 108_1t4635s0.bin and 118_1t4645s0.bin`
- **Quote:** Mobile.as:117 `GameEngine.getStageMC().frameRate = 24;`  ·  MCSCharacter.as:1315 `++this.frameCounter;` and :1334 `if(this.frameCounter < this.currentAnimation.frameList.length)`  ·  AnimData.as:41 `this.duration += 10;` (every stance's slash pose)  ·  measured: light_stance d=1/1f, light_run d=9/9f, walk d=20/20f, death d=38/38f — hold=0 everywhere  ·  WhiteOutFX.as:22 `ttlMax = 24 * 3;` (durations written as 24 x seconds)
- **Overturns:** "**Ready (strongest slice):** 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle;"
- **Lane impact:** art-anim-audio-feel: the headline Ready bullet's model is wrong — motion is a 24 Hz keyframe stream with per-animation code-added hold tails, not a 15 Hz latch. Graded PARTIAL and not HELD because the payload settles the clock but no frame can arbitrate the visible cadence: the dense stills sample at 0.1 s (10 Hz) and cannot resolve 24 vs 15, so this is a doc-vs-payload correction, not a frame-vs-doc one.

### `art-anim-audio-feel/adaptive-music-engine` — HELD [A2] ⚑ OVERTURNS LEDGER

The adaptive-music engine is fully specified: 17 presets are boolean masks over the 13 stems, crossfades move volume by exactly ±0.05 per tick (~0.83 s at 24 fps), and a newly-enabled stem starts at the playhead of the currently-playing anchor stem so layers enter phase-locked.

- **Cite:** `reference/decompiled/shs3_android/scripts/MusicManager.as:115-190 (stem table + presets), :206 (phase lock), :301 and :329 (fade rate), :279 (loop on SOUND_COMPLETE); SoundManager.as:114-173 (pickMusic BG switch)`
- **Quote:** MusicManager.as:301  `sndTransform.volume -= 0.05;`  ·  :329  `sndTransform.volume += 0.05;`  ·  :206  `playPosition = int(this.scArray[this.TRACK_FLUTES].position);`  ·  :140  `this.presetsArray[MUSIC_TOUGHBATTLE][this.TRACK_BATTLECHANTS] = true;`
- **Overturns:** "**all audio** (SFX + music params)"
- **Lane impact:** art-anim-audio-feel: the §2 scorecard's blocking phrase 'music params' is void — the params are literal constants in the shipped client, including the per-background preset routing table.

### `art-anim-audio-feel/aspect-ratio-frame-wins` — HELD [A1] ⚑ OVERTURNS LEDGER

Aspect-ratio truth is closed and the frame arbitrates it: the design canvas is literally 800x480 with letterbox scale/offset math in code, and although the real client SWF's document rect decodes to 800x690, the measured visible game surface in a 1080p frame is 1816x1080 (aspect 1.6815 = 800x480), so the 690-tall rect is container chrome, not play area.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_432.0.png non-black content box measured at thresholds 5/12/25/40/60 (cols 52..1867, all 1080 rows); cross-checked against reference/preservation/shs3.swf header rect (16000x13800 twips = 800x690) and reference/decompiled/shs3_android/scripts/GameEngine.as resizeHandler`
- **Quote:** GameEngine.as: `var originalWidth:int = 800;` / `var originalHeight:int = 480;` / `newScale = stageMC.stageHeight / originalHeight; offsetX = (stageMC.stageWidth - originalWidth * newScale) / 2;` and :190 `stageMC.fullScreenSourceRect = new Rectangle(0,0,800 * newScale,480 * newScale);`  ·  measured frame: 'thr 12 cols 52 1867 w 1816 aspect 1.6814814814814816' (800x480 = 1.6667, 800x690 = 1.1594)
- **Overturns:** "**Aspect-ratio truth** — native canvas is **800×480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** art-anim-audio-feel and ui-hud: promoted out of §1's UNKNOWN-UNKNOWNS into a payload CONTRACT, including the exact letterbox formula. THE FRAME WINS over the SWF document rect — I say so explicitly: the byte-check says the document is 800x690, the frame says the visible surface is 800x480, and the frame decides what the player saw. Every HUD fraction and feel measurement taken off 16:9 video must be re-based on 800x480.

### `art-anim-audio-feel/audio-recovered-not-encrypted` — HELD [A3] ⚑ OVERTURNS LEDGER

The audio is RECOVERED, not encrypted: 122_Mobile_SoundResource.bin decodes with the known payload transform at XOR key 111 into a valid CWS v17 SWF holding 13 DefineSound tags plus a SymbolClass table naming every SFX, all extracted to playable MP3 and verified with an independent decoder.

- **Cite:** `reference/extracted/android/122_Mobile_SoundResource.bin decoded with reference/tools/payload_decode.py transform at key=111 -> CWS v17, declared len 29,631, zlib body inflates to 29,623 B; macOS afinfo on the extracted slash1.mp3`
- **Quote:** SymbolClass: [(13,'punch'),(12,'fart'),(11,'hitmetal'),(10,'goodkoto'),(9,'slash1'),(8,'slash2'),(7,'die1'),(6,'refund'),(5,'die3'),(4,'slash3'),(3,'sumo'),(2,'die2'),(1,'deflect')]  //  afinfo: 'Data format: 1 ch, 11025 Hz, .mp3 ... 576 frames/packet' / 'estimated duration: 0.572000 sec'
- **Overturns:** "① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** art-anim-audio-feel (this unit): blocker ① deleted; the SFX lane flips from 'invent a WebAudio synth' to 'match a reference file'. Also overturns Stage-0 finding S0-5 ('You may NOT claim audio is recovered') for all five CWS blobs, which unblocks ui-hud (ImageResource portraits), world-exploration (BGResource, 49 named backgrounds) and items-equipment (SHS3Resource, 1,949 part sprites).

### `art-anim-audio-feel/blood-vfx-exact` — HELD [A2] ⚑ OVERTURNS LEDGER

Blood VFX numbers are exact constants, not something to frame-measure: 20 particles, angle variance 10°, velocity 6 ±2, gravity 0.6, time-to-live 24 ticks (~1.0 s at 24 fps), with per-death-variant emitter overrides naming the exact body part and spray angle.

- **Cite:** `reference/decompiled/shs3_android/scripts/BloodParticleEmitter.as:18-26; per-death overrides at EnemyGoblin.as:367-432`
- **Quote:** BloodParticleEmitter.as:18-26  `pnumber = 20; px = 0; py = 0; pangle = 0; panglevariance = 10; pvel = 6; pvelvariance = 2; pgravity = 0.6; pttl = 24;`  ·  behead spray: `createEmitter(0,mcs.getPart(MCSCharacter.PART_neck),...,130)` and `...PART_head...,180)` with `setVel(4)` / `setNumber(10)`
- **Overturns:** "**Frame-measure combat numbers from existing footage:** blade-FX reach span per stance; L1 bandit-fight damage popups + HP-bar fractions; blade-trail width/fade; blood droplet count/spread; whether there's screen-shake / hitstop."
- **Lane impact:** art-anim-audio-feel: §5 Tier-1 item 2 loses three of its five sub-tasks (blood droplet count/spread, screen-shake, hitstop) — they are payload constants now, not video measurements.

### `art-anim-audio-feel/font-identified` — HELD [A2] ⚑ OVERTURNS LEDGER

The font blocker is closed with embedded font programs and vendor copyright strings: the display face is Edo SZ (© 2008 Vic Fieger), alongside EPSON Taigyousho B, Adobe Gothic Std B and MS UI Gothic.

- **Cite:** `DefineFontName tags in reference/extracted/android/115_Mobile_SHS3Resource.bin (key=104), font ids 307/12/61/161, and 124_Mobile_ImageResource.bin (key=109), font id 76`
- **Quote:** DefineFontName id=307 name='Edo SZ' copyright='2008 Vic Fieger'  ·  DefineFontName id=12 name='EPSON 太行書体Ｂ' copyright='(C) 2000 SEIKO EPSON CORP. All rights reserved.'  ·  DefineFontName id=61 name='Adobe 고딕 Std B'  ·  DefineFontName id=161 name='MS UI Gothic 標準'
- **Overturns:** "② font (unidentified)."
- **Lane impact:** art-anim-audio-feel blocker ② deleted, and ui-hud gets the text face for every HUD string. Stronger than Stage-0 S0-2 (which had only face="Edo SZ" in ui_strings.txt): we now hold the font programs themselves in two independent containers. LICENCE FLAG: Edo SZ is Vic Fieger's, not Lut's — third-party, outside the owner grant; identify, do not redistribute.

### `art-anim-audio-feel/gore-system-not-one-variant` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'severed-limb death variant' is a whole gore system: eight death animations including deathnohand (25 f), deathnohead (31 f) and deathinhalf (28 f), selected by a behead flag plus a 40/20/20/20 random split, with a 50% corpse-mirror coin flip and a global censored switch that defaults to false.

- **Cite:** `reference/extracted/bindata/108_1t4635s0.bin (web payload human animdata) for the anim rows; reference/decompiled/shs3_android/scripts/EnemyGoblin.as:352-432 for the selection rule (mirrored in every Enemy* class); StatsManager.as:314 for the censor default`
- **Quote:** EnemyGoblin.as:354-356 `if(Math.random() * 2 < 1) { mcs.scaleX = -mcs.scaleX; }`  ·  :358 `if(!StatsManager.censored && fatal)`  ·  :360-362 `if(behead) { startAnim(ENEMYDEATHNOHEAD); }`  ·  :386-423 `dice = Math.random() * 5;` -> `<=1 GOB_DEATH · ==2 ENEMYDEATH · ==3 ENEMYDEATHNOHAND · ==4 DEATHINHALF`  ·  StatsManager.as:314 `public static var censored:Boolean = false;`
- **Overturns:** "⑤ severed-limb death variant."
- **Lane impact:** art-anim-audio-feel blocker ⑤ deleted with its exact probability distribution. Cross-lane: enemies-ai gets the per-enemy death branch, and the censored flag is an options-screen item ui-hud does not have.

### `art-anim-audio-feel/hit-reaction-12-ticks` — HELD [A2] ⚑ OVERTURNS LEDGER

The hit reaction is a single uniform 12-tick window (0.5 s at 24 fps) set identically in every enemy class and in MCSPlayer, and hitting the hat, head or neck part sets the behead flag AND multiplies damage by 1.5.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3687-3719; gotHitCounter = 12 repeated across EnemyClone.as:162/207/227/392/448 and decremented once per tick in every Enemy* update`
- **Quote:** MCSPlayer.as:3689-3692 `case mcs.partList[MCSCharacter.PART_hat]: case mcs.partList[MCSCharacter.PART_head]: case mcs.partList[MCSCharacter.PART_neck]: behead = true;`  ·  :3714-3716 `if(behead) { damage *= 1.5; }`  ·  :3719 `gotHitCounter = 12;`
- **Overturns:** "hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHER_FLASH — all measured/authored but missing from the art digest §5."
- **Lane impact:** art-anim-audio-feel: the authored 7/12/16-frame tint ladder is a recreation invention — the original's single number is 12. Cross-lane into combat-core: a body-part headshot multiplier of x1.5 driven by the blade path is a mechanic no ledger holds. CAUTION, un-reconciled: the HUD in Nr4fQstqHDM_432.0.png shows '150% DAMAGE' under 'CANNOT CHANGE STANCE', which reads as the stance modifier — do not conflate the two 1.5s.

### `art-anim-audio-feel/music-13-stems-measured` — HELD [A3] ⚑ OVERTURNS LEDGER

The music is 13 named MP3 stems, all held, and the six overworld stems are exactly 79.872 s while the four dungeon stems are exactly 45.760 s — bit-identical lengths are the mechanism that lets them layer in phase.

- **Cite:** `reference/extracted/android/113_Mobile_MusicResource.bin (key=117) -> 13 DefineSound + SymbolClass; durations measured with macOS afinfo on the extracted MP3s`
- **Quote:** battlechants/battledrums/flutes/safeambience/safekoto/safepercussion = 'estimated duration: 79.872000 sec' each; dungeonambience/dungeonflute/dungeonpercussion/dungeonpiano = 45.760000 sec each; bgm_levelup 29.900000; bgm_lose 3.744000; bgm_gangnam 3.848000
- **Overturns:** "**Exact original SFX & music synthesis params** — the *character* is study-able from audio; the exact waveforms/envelopes are not."
- **Lane impact:** art-anim-audio-feel: §6's 'structurally UNRECOVERABLE' audio bullet falls. Also kills §5 Tier-1 item 3 ('Listen-pass on existing audio ... the deepest gap') — never listen-pass a YouTube rip when the master stem is on disk.

### `art-anim-audio-feel/no-blend-modes` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'FX blend modes' blocker is answered in the negative: no game class ever sets a blendMode — the only hit across all 559 client classes is an mx framework interface the game never implements — and the entire compositing vocabulary is one class using ColorTransform, BlurFilter and a luma ColorMatrixFilter.

- **Cite:** `exhaustive grep for blendMode over reference/decompiled/shs3_android/scripts/ and reference/decompiled/shs3_payload/ (only hit: mx/core/IFlexDisplayObject.as:87-89); reference/decompiled/shs3_android/scripts/ColorCode.as:12-120`
- **Quote:** ColorCode.as:110-119 `setMCTint(mc,mul,col)`: `var ctMul:Number = 1 - mul; ... var ct:* = new ColorTransform(ctMul,ctMul,ctMul,1,ctRedOff,ctGreenOff,ctBlueOff,0);`  ·  :47 `var myElements_array:Array = [0.3,0.59,0.11,0,0, ...];`  ·  :12 `new ColorTransform(0,0,0,1,0,0,0,0)`
- **Overturns:** "③ FX **blend modes**;"
- **Lane impact:** art-anim-audio-feel blocker ③ deleted: the answer is 'none — normal alpha only'. A recreation reaching for additive/screen blending on trails, tints or vignettes is diverging from the original. Corroborated visually by the A1 blade-trail crop (opaque, outlined, occluding).

### `art-anim-audio-feel/no-hitstop` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

There is no hitstop on a landed hit anywhere in the client: the only time-freeze is STATE_FROZEN, set at exactly two sites (both the battle-intro bar), plus the end-of-battle redFreeze; gotHit sets a 12-tick reaction counter and no global freeze.

- **Cite:** `grep for hitstop|hitpause|freezeframe|slowmo|timeScale|hitFreeze over reference/decompiled/shs3_android/scripts/*.as returns zero hits; STATE_FROZEN set only at StageManager.as:162 and :212; MCSPlayer.as:3719`
- **Quote:** StageManager.as:161-162 `battleIntroBar.init(action);` / `actionState = STATE_FROZEN;`  ·  MCSPlayer.as:3719 `gotHitCounter = 12;` (no freeze call)
- **Overturns:** "④ **screen-shake** + **hitstop-on-landed-hit** (never catalogued);"
- **Lane impact:** art-anim-audio-feel: the honest answer is 'the mechanism does not exist', so any hitstop in the recreation is an authored deviation and must be labelled. Graded PARTIAL, not HELD, because this is a negative from an exhaustive grep of one build rather than a positive artifact.

### `art-anim-audio-feel/screen-shake-catalogued` — HELD [A2] ⚑ OVERTURNS LEDGER

Screen-shake is fully catalogued: a uniform random offset within ±amt/2 on both axes every tick, default amplitude 30 px, auto-tapering over the final amt ticks via min(amt,counter), snapping back to the exact start position — and it keeps running while the action is frozen.

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:1200-1227 (startShake/doShake), :826-830 (stepped outside the STATE_FROZEN gate); triggers at MCSPlayer.as:911 (Cleave, 12), :946 (Earthquake jutsu, 24), :4180 (player launched, 12), Trap_CrusherColumnAuto.as:90 (6), Marker_RumbleTrigger.as:9-11 (data-driven, defaults 24/30)`
- **Quote:** StageManager.as:1225-1227  `shakeAmount = Math.min(screenShakeAmt,screenShakeCounter);` / `gameStage.x = screenShakeStartPos.x + (-shakeAmount / 2 + Math.random() * shakeAmount);` / `gameStage.y = screenShakeStartPos.y + (-shakeAmount / 2 + Math.random() * shakeAmount);`
- **Overturns:** "④ **screen-shake** + **hitstop-on-landed-hit** (never catalogued);"
- **Lane impact:** art-anim-audio-feel blocker ④ half-deleted, and §1's UNKNOWN-UNKNOWNS bullet 'screen-shake and hitstop-on-landed-hit (never catalogued)' plus §5 Tier-1's 'whether there's screen-shake / hitstop' are both closed without any frame-measuring.

### `art-anim-audio-feel/sfx-playback-contract` — HELD [A2] ⚑ OVERTURNS LEDGER

SFX playback params are held too: slash and death each pick 1-of-3 at random, hit and hurt both play the SAME 'punch' asset, and every call is a bare sound.play() — no SoundTransform, so volume 1.0, pan 0, no loop, no offset.

- **Cite:** `reference/decompiled/shs3_android/scripts/SoundManager.as:187-219 (playSlash), :221-253 (playDie), :255-279 (playHit/playHurt)`
- **Quote:** SoundManager.as:194 `var dice:int = Math.random() * 3;` ... :197 `sound = ResourceManager.getSound("slash1");` :200 `sound.play();`  ·  :261 and :274 are identical: `var sound:Sound = ResourceManager.getSound("punch");`
- **Overturns:** "① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** art-anim-audio-feel: 'every SFX param is INFERRED' is false in both halves — the asset and its playback contract are both held. Note the shared punch asset: a recreation with separate hit/hurt sounds is a deviation.

### `art-anim-audio-feel/android-web-byte-identity` — HELD [A3]

The Android-build caveat dissolves for animation: 14 of the 18 MCSCharacter animation blobs are MD5-identical between the Android v0.682 export and the web v0.717 payload, including Human, Human2 and all five stance sets.

- **Cite:** `MD5 over reference/extracted/android/*.bin vs reference/extracted/bindata/*.bin — 21 blobs identical overall`
- **Quote:** MD5 (reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin) = bcfd658e79fafb41f52431afb7d10622 ; MD5 (reference/extracted/bindata/108_1t4635s0.bin) = bcfd658e79fafb41f52431afb7d10622 — differing: Ogre, Skills (51 anims), Guardian, HumanSpear
- **Lane impact:** art-anim-audio-feel and every lane citing the Android build: Stage-0 S0-3's standing caveat ('this is the ANDROID build ... parity is NOT established') is now PROVEN for 14/18 animation sets by hash rather than assumed. Animation claims sourced from shs3_android are web-parity; audio claims are not (see the STILL_UNHELD claim).

### `art-anim-audio-feel/blade-trail-frame` — HELD [A1]

Frame check: the blade trail is a flat opaque vector wedge — mid-blue body over a darker blue lower half, a white double-stripe core, a hard black outline, tapering to a point — and it occludes the grass behind it rather than lightening it, which is what 'no blendMode' looks like on screen.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_432.0.png (1920x1080), crop (900,600)-(1300,900) upscaled x3 Lanczos`
- **Quote:** Visibly in the crop: a wide hard-edged blue wedge sweeping left from the fighter's hands with a white double stripe running its length and a solid black outline; the fighter in navy haori with red trim, cream obi, white hakama and straw kasa, all bold-outlined flat vector; a felled bare-torso enemy sprawled at his feet with his kasa fallen beside him, with NO blood and NO severed limb at this instant.
- **Lane impact:** art-anim-audio-feel: independently corroborates the no-blend-mode finding from the frame side, and confirms the ledger's 'flat-vector bold-outline style' Ready bullet by eye rather than second-hand. Supporting A2: bladeslashfx.as is a 5-frame clip that removes itself (`addFrameScript(4,this.frame5)`), so the slash FX lives ~0.21 s at 24 fps.

### `art-anim-audio-feel/kill-beat-timings` — HELD [A2]

The kill-beat has exact numbers: on victory the action freezes for 24*6 ticks (6.0 s) with the win card shown 1.0 s in, and the freeze will not end at the 24-tick mark while the player is still playing the blood-flick sheathe animation; on defeat it is 24*3 (3.0 s).

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:898-935 (countdown) and :1095-1101 (setup)`
- **Quote:** StageManager.as:1096 `redFreezeCounter = 24 * 3 + 6;` (harvest) / :1101 `redFreezeCounter = 24 * 6;`  ·  :903 `if(redFreezeCounter == 24 * 5)` -> `battleUI.showWin();`  ·  :916 `else if(redFreezeCounter == 24 && StatsManager.getPlayer().getMCS().getAnim() != MCSActor.SHEATHESWORDCHIBURI || redFreezeCounter == 0)`  ·  :926 `else if(redFreezeCounter == 24 * 3)` -> `battleUI.showLose();`
- **Overturns:** "hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHER_FLASH — all measured/authored but missing from the art digest §5."
- **Lane impact:** art-anim-audio-feel: the Ready bullet's 'kill-beat' is now a number set, not a vibe, and it is gated on a named animation (SHEATHESWORDCHIBURI). Note the screen shake is deliberately NOT gated off during the freeze (StageManager.as:826-830).

### `art-anim-audio-feel/web-audio-parity-unheld` — STILL_UNHELD [STILL_UNHELD]

The web build's own audio is STILL_UNHELD: every one of the web payload's 27 bindata blobs was checked and none is a CWS blob, so the web client streamed its sound resources separately and we do not hold them — all audio claims here are Android v0.682 and must be labelled as such.

- **Quote:** Scanned all 27 files in reference/extracted/bindata/ for an FWS/CWS/ZWS signature: zero hits (the 19 animdata, 5 name tables, room-object defs, survivalmodedata and one GIF89a are all that is there). Build id: reference/decompiled/shs3_android/scripts/StatsManager.as:30 clientVersion 0.682 vs the web build's 0.717.
- **Lane impact:** art-anim-audio-feel: bounds the audio win. Web-parity is PROVEN for animation (14/18 blobs hash-identical) and UNPROVEN for audio, so ported SFX/music must carry an 'Android v0.682' label. Two further honest gaps: the newly-opened vector art (1,949 DefineSprite in SHS3Resource, 49 named backgrounds in BGResource) was not rendered or graded this pass, and no test in the suite pins any finding in this survey.

## combat-core — re-scored 78

All five §4 combat-core blockers (reach cap, crit read, early TTK, multi-target rule, crit gating) are closed at literal decompiled source, plus three §1 UNKNOWN-UNKNOWNS (multi-target damage rule, reach-cap↔dash relationship, hit-registration window) and half of a fourth (i-frames). Held off the 90s by four things: (a) every source cite is the ANDROID v0.682 client and parity with the web v0.717 is unproven — and already broken once, measured on frames (claim crit-meter-fill-rate); (b) duel AI/telegraphs live in EnemyPlayer.as/Enemy*.as, surveyed by L4 not here; (c) screen-shake, hitstop-beyond-i-frames and blend modes still uncatalogued; (d) three live constants in src/config/reach.ts and one in src/config/stances.ts are WRONG against the source and must be fixed before any of it is wired in.

### `combat-core/crit-gating` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ⑤ is dead: crit is a deterministic full-meter gate on a 'reload' resource (maxreload = 5×24, +1 per frame, zeroed on crit, charged slashUsage per slash scaled Light÷2 / Balanced×1 / Heavy×1.5), not a chance proc — and stance switching is blocked below 1/6 meter and costs meter.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:239-240, :1158-1168, :2975-2978, :3098-3108, :3240-3262; refill rate StatsManager.as:1839`
- **Quote:** public function deductReloadBar() : * { if(this.reload == this.maxreload) { this.reload = 0; } switch(this.stance) { case LIGHT_STANCE: this.reload -= this.slashUsage / 2; break; case BALANCED_STANCE: case REVERSED_STANCE: this.reload -= this.slashUsage; break; case HEAVY_STANCE: case DUAL_STANCE: this.reload -= this.slashUsage * 1.5; }
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** L5 + L2 — an entire third combat resource with a full economy (refill 48 + SPD·6, weapon-driven slashUsage floored at 48, bonusReload +6, stance-switch tax) that no ledger system records.

### `combat-core/crit-meter-exists-in-web-build` — HELD [A1] ⚑ OVERTURNS LEDGER

A web-build frame shows the third HUD bar reaching 100% with the label CRITICAL HIT printed across it — proving the crit meter exists in the shipped game and correcting the project's own SESSION-11 note that 'OG has NO Critical meter'.

- **Cite:** `reference/frames/session11/gap-focus-trigger/m_nearfull.png — 1800×780 two-panel still, viewed at 50%; lower panel, HUD bar row. Corroborated by BattleUI.as:259-262 + :102 and strings.json 175`
- **Quote:** Visible in the crop: upper panel = third bar filled ~97%, unlabelled; lower panel = same bar at 100% with 'CRITICAL HIT' printed on it, HP 11/20 and Chi 47/47 unchanged between panels. Code: this.crittext.visible = percentage >= 1 && this.reloadbar.visible; / this.crittext.text = LangManager.getString(175); / string 175 = 'Critical Hit'.
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** L5 + L8 — the combat HUD is three bars, not two; the third is the crit/reload meter and it carries a 'CRITICAL HIT' overlay at full. Consumption is also visible: session11/gap-focus-trigger/t1003.933.png empty right after a slash, t1004.000.png a fresh sliver.

### `combat-core/crit-multiplier` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ② is dead and BOTH candidates were wrong: crit is ×1.5 in Light and ×1.2 in every other stance, plus a flat additive STAT_CRITICALDMG gear term — never 1.3 and never 3.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3213-3223`
- **Quote:** if(this.reload == this.maxreload) { if(this.stance != LIGHT_STANCE) { return maxDamage * 1.2 + this.STAT_CRITICALDMG; } return maxDamage * 1.5 + this.STAT_CRITICALDMG; } return maxDamage;
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** L5 — src/config/combat.ts's '1.3 × our STANCE_TABLE dmgMults (1.17/1.56/1.82)' is wrong. Carry the internal contradiction: InventoryUI.as:1946/:1955/:1964 uses the OPPOSITE mapping (light 1.2, balanced/heavy 1.5) for its tooltip preview — an original-game display bug; MCSPlayer.getDamage is authoritative.

### `combat-core/damage-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's Ready formula '(ATK+Wpn)×stance' is wrong in two ways: damage is a RANDOM roll over the weapon's min..max range, and the stance term is a mastery curve (light 0.5+0.005m, balanced 1+0.005m, heavy/dual/reversed flat 1.5) that is the exact permutation of the reach curves.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3197-3212; inputs StatsManager.as:1860-1900`
- **Quote:** var baseDamage:int = this.minDamage + Math.random() * this.damageRange; switch(this.stance) { case LIGHT_STANCE: maxDamage = baseDamage * (0.5 + 0.5 * this.lightMastery * 0.01); break; case BALANCED_STANCE: maxDamage = baseDamage * (1 + 0.5 * this.balancedMastery * 0.01); break; case HEAVY_STANCE: case DUAL_STANCE: case REVERSED_STANCE: maxDamage = baseDamage * 1.5; }
- **Overturns:** "**Ready:** gesture→attack map; damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8); blade-path-with-reach model; combo rules; part-based weak points (shielder legs, undead heads)."
- **Lane impact:** L5 — Sim needs an RNG draw per slash (mulberry32, injected) that the current model has no place for; minDamage = ATK + itemBonus + weapon.mindamage, damageRange = weapon.maxdamage - mindamage, and BOTH collapse when the weapon is broken (range 0, +1 flat).

### `combat-core/early-ttk` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ③ is dead: the L1 character has ATK 1 / DEF 1 / SPD 1 / HP 10, the starter weapon fallback is item 13002 'Branch' at 1-2 damage, and every sampled lvl≤2 mob has 1-5 HP — so early mobs die in ONE hit, confirming the SESSION-11 frame measurement from source.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:693-708 and :1830-1832; reference/extracted/itemdata.xml:7906-7915; reference/extracted/npcdata.xml:146-152 and :2474-2480; names via docs/gauntlet/L0/index/strings.json`
- **Quote:** if(equipment[EQ_WEAPON].itemID == 0) { equipItem(EQ_WEAPON,new Item(13002,1)); }   ///   itemdata.xml:7907 <id>13002</id> <name>4041</name> <baseprice>0</baseprice> <mindamage>1</mindamage> <maxdamage>2</maxdamage>   [4041 = 'Branch']   ///   npcdata.xml:146 <id>6</id><name>5010</name><lvl>2</lvl><hp>1</hp><ai>1</ai><attack>5</attack><defense>3</defense>   [5010 = 'Thug']   ///   npcdata.xml:2474 <id>101</id><name>5052</name><lvl>1</lvl><hp>2</hp><attack>1</attack><defense>0</defense>   [5052 = 'Duelist']
- **Overturns:** "③ early-mob HP + starter weapon DMG + hits-to-kill — *read L1 bandit-fight popups in video A.*"
- **Lane impact:** L5 + L4 — full derivation: minDamage 1+1 = 2, range 1, balanced roll 2, vs Thug DEF 3 → floored at 1+pierce → 1 damage vs 1 HP = one-hit kill. Conversely Thug attack 5 vs player maxhp 10 means the player dies in 2-3 hits at L1.

### `combat-core/hit-registration-instant-at-endslash` — HELD [A2] ⚑ OVERTURNS LEDGER

The hit-registration window is answered: there is no active sweep and no per-frame hitbox — the entire polyline resolves in one instant inside endSlash(), against wherever enemies stand at that moment.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2766-2814 (the only call sites of NPCManager.checkHit / checkPlayerHit)`
- **Quote:** var damage:Damage = new Damage(this.slashDamage,level,launchType,this.stance); damage.setPiercingDamage(this.STAT_PIERCINGDMG); ... if(this.controlledBy == 0 || this.controlledBy == 3) { NPCManager.checkHit(this.slashArray,offset,damage); }
- **Overturns:** "**Hit-registration window** (instant at release vs an active sweep an enemy can dodge into/out of)."
- **Lane impact:** L5 — an enemy cannot dodge into or out of a stroke mid-sweep; deductReloadBar() is charged in the same call, so the meter cost lands at resolution, not at input.

### `combat-core/mitigation-and-part-rule` — HELD [A2] ⚑ OVERTURNS LEDGER

Part-based weak points are UNIVERSAL, not per-enemy: hat/head/neck on any character is a behead at ×1.5, and a hit landing on the weapon part deals zero and does not even register — mitigation itself is flat defence subtraction floored by a four-band attacker-level table.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:386-462 (part search order at :301-320); floor table Damage.as:150-172`
- **Quote:** case mcs.partList[MCSCharacter.PART_hat]: case mcs.partList[MCSCharacter.PART_head]: case mcs.partList[MCSCharacter.PART_neck]: behead = true; gotHitFlag = true; break; case mcs.partList[MCSCharacter.PART_weapon]: gotHitFlag = false; damage = 0; return false;  ...  damage -= this.defense; if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); } if(behead) { damage *= 1.5; }  ...  this.gotHitCounter = 12;
- **Overturns:** "part-based weak points (shielder legs, undead heads)"
- **Lane impact:** L5 + L4 + L8 — blade-on-blade parry emerges from the paperdoll, not from AI; parts test top-most-first; gotHitCounter = 12 is a 12-frame (0.5 s @24fps) i-frame window, half of §1's uncatalogued 'hitstop-on-landed-hit'; the ledger's items-equipment 'defense min-floor (EnemyLevel/4)' is only the last of four bands (≤10 → 1+pierce, ≤20 → lvl/8, ≤30 → lvl/6, else lvl/4); damage popups spawn at (mcs.x, mcs.y-100) in 0x990000, closing ui-hud blocker ③.

### `combat-core/multi-target-full-damage` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ④ is dead: one slash tests the whole enemyList and neutralList, each enemy can be hit at most once, and every victim takes the SAME Damage object — full damage each, no falloff toward the tip.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1204-1295 (damage rolled once at MCSPlayer.as:2699); combo cap StatsManager.as:4298-4306`
- **Quote:** while(j < slashMax && !enemy.gotHitFlag) { dist = enemy.mcs.x - slashArray[j].x + offset; ... if(dist * dist < 40000 && enemy.mcs.hitTestPoint(scaledX,scaledY,false)) { if(enemy.checkHit(scaledX,scaledY,damage)) ... } j++; } if(enemy.gotHitFlag) { comboCount++; }
- **Overturns:** "**Multi-target damage rule** (one arc hits N enemies — full damage each? falloff toward the tip?)."
- **Lane impact:** L5 — also yields the cheap pre-filter |Δx| < 200 world units, and grounds the 'combo rules' Ready bullet: combo = count of DISTINCT enemies hit per stroke, accumulated into a persistent counter capped at 999.

### `combat-core/pass-through-dash` — HELD [A2] ⚑ OVERTURNS LEDGER

The reach-cap ↔ dash relationship is answered: there is NO fixed dash constant — the player runs to the stroke's first point only if it is ≥ standingRange 50 away, then passes THROUGH to the stroke's last point at a per-stance slashSpeed of 50/40/30 world units per frame.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2408, :2476, :2676-2705; constants at :9 (standingRange=50) and :15-19 (slash speeds)`
- **Quote:** this.destX = this.slashArray[this.slashArray.length - 1].x; ... var xdiff:int = this.destX - posX; var ydiff:int = this.destY - this.slashArray[0].y; var dist:Number = Math.sqrt(xdiff * xdiff + ydiff * ydiff); var time:Number = dist / slashSpeed; velX = xdiff / time; velY = ydiff / time; this.slashDamage = this.getDamage();
- **Overturns:** "**The reach-cap ↔ 127px-dash relationship** (pass-through vs stop-within-reach — possibly two stacked motions)."
- **Lane impact:** L5 — it IS two stacked motions (approach, then pass-through), but the travel distance is the stroke's own span, itself bounded by the arc-length reach budget. src/config/combat-sim.ts's 'fixed 105.9 px pass-through' and the ledger's DASH_SLASH_PX=127 both need replacing with the derivation. Bonus (L2): Shunpo is setPosition(destX,destY) + slashDamage *= 2 + endSlash() at MCSPlayer.as:2700-2705.

### `combat-core/reach-cap` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ① is dead: reach is a source-exact stat formula, base = 120 + floor((90 + 5·danRank)·SPD/(20+SPD)), in 800×480 world units — not an unmeasured 'unit of unknown scale'.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1915-1919 (scale established by InputManager.as:341 and :229)`
- **Quote:** internal static function getBaseSlashLengthVal(speed:int) : int { var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5; return int(120 + Math.floor(maxincrement * speed / (20 + speed))); }
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** L5 — the reach gate can be built today from a formula rather than waiting on a footage measurement; at the stated L1 character base = 124 world px.

### `combat-core/reach-stance-mults` — HELD [A2] ⚑ OVERTURNS LEDGER

The per-stance reach multipliers are light ×1.5 flat, balanced ×(1+0.005·mastery), heavy ×(0.5+0.005·mastery) hard-floored at 100 — which means BOTH the ledger's '300/200/120 mastery-9' triple AND three live constants in src/config/reach.ts are wrong.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3030, :3041, :3052-3055 (mastery domain 0-10 from reference/extracted/skilldata.xml:3-11 and :74)`
- **Quote:** case LIGHT_STANCE: this.slashLength = this.baseSlashLength * 1.5;  ...  case BALANCED_STANCE: this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01);  ...  case HEAVY_STANCE: this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01); if(this.slashLength < 100) { this.slashLength = 100; }
- **Overturns:** "- `STANCE_TABLE` already carries reach 300/200/120 + speed — but **never wired into `resolveSlash`** and mislabeled INFERRED when they're actually the wiki's **mastery-9** values (and Heavy should be 100, not 120)."
- **Lane impact:** L5 — src/config/reach.ts lightMult 1.4 (src: 1.5), balancedPerMastery 0.02 (src: 0.005), heavyPerMastery 0.04 (src: 0.005) are all wrong and are labelled CONTRACT-SRC; reach.ts's own comment shows they were back-derived from the legacy 0.9/1.2/1.4 triple, not read from the payload. Heavy's 100 is a floor clamp, not a mastery value.

### `combat-core/150pct-damage-is-a-buff` — HELD [A1]

The gold '150% DAMAGE' line under the HUD bars in the combat frames is a consumable BUFF readout, not a stance damage multiplier — reading it as 'heavy stance' would silently corrupt every TTK derived from those frames.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png — bottom-left HUD, crop (0,910)-(620,1080) upscaled 2×; bound to OverworldHUD.as:1404, strings.json 4132, and MCSPlayer.as:209-211`
- **Quote:** Visible in the crop: portrait ring, HP 14/20 green, Chi 31/31 blue, a third bar reading 'CANNOT CHANGE STANCE', and below them '150% DAMAGE' in gold. Code: buffstr = "150% DAMAGE"; under bufftype == StatsManager.BUFF_ATTACK; string 4132 = 'Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a time.'; effect = if(StatsManager.hasBuff(StatsManager.BUFF_ATTACK)) { this.minDamage *= 1.5; }
- **Lane impact:** L5 + L8 — the buff scales minDamage BEFORE the stance multiplier and only one buff can be live; heavy stance's own multiplier is also 1.5, which is exactly why the misread is available. The same frame independently corroborates the stance-switch meter gate: 'CANNOT CHANGE STANCE' is the label over the reload bar, matching nextStance()'s reload < maxreload/6 early return.

### `combat-core/build-version-parity` — STILL_UNHELD [STILL_UNHELD]

I cannot show that the android v0.682 combat constants equal the web v0.717 ones — and one of them provably does not (the crit-meter period), so every A2 in this lane must be ported labelled CONTRACT-SRC-v0.682, never plain CONTRACT.

- **Lane impact:** L5 — blocks promoting maxreload, slashUsage floors, slashSpeed 50/40/30, the 1.2/1.5 crit split and the 0.005-per-mastery terms to CONTRACT. The web payload's own AS3 is obfuscated (reference/decompiled/shs3_payload/scripts/§1t51s0§/, 5 files) and cannot be cross-read. Close-path: locate the same expressions in the obfuscated web AS3 by numeric-literal shape (120/90/5/20, 5*24, 50/40/30), or measure each on frames the way the crit-meter rate was measured.

### `combat-core/crit-meter-fill-rate` — PARTIAL [A1]

Measured on frames, the web build's crit meter fills at ~17.3%/s (≈5.8 s end to end); the android constants predict 4.00 s. THE MEASUREMENT DOC AND THE FRAME DISAGREE, SO THE FRAME WINS — build 5.8 s.

- **Cite:** `reference/frames/session11/crit-focus/{t1004.800,t1005.000,t1082.100,t1082.900,t3779.000}.png — meter track x=248..511 (263 px), row y≈1032; track width validated on t1003.000.png where HP 14/20 puts the green edge at x=433 = 70.3%`
- **Quote:** Fill right edge: t1004.800 x=281 (12.5%), t1005.000 x=290 (16.0%), t1082.100 x=304 (21.3%), t1082.900 x=340 (35.0%), t3779.000 x=370 (46.4%). Rates 17.5%/s and 17.1%/s, monotonic. Android prediction: '++this.reload' (MCSPlayer.as:1160) at 'GameEngine.getStageMC().frameRate = 24' (Mobile.as:117) over displayed span maxreload-24 = 96 ticks = 4.00 s.
- **Lane impact:** L5 — the structural model (linear, first 24 ticks hidden, zeroed on crit, slashUsage per stance) is A2-held, but the period constant must come from the frame, not the android build. This is the concrete proof that v0.682 combat tuning ≠ v0.717.

### `combat-core/gesture-classifier` — HELD [A2]

The gesture→attack map's discriminator is exact: a stroke is a SLASH iff it sampled >4 points AND its start→end straight-line distance exceeds 20 world units; otherwise it is a tap that moves the fighter, with a 25-unit dead-zone.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:268 with constants at :53 and :55; tap path MCSPlayer.as:2298-2308; peaceful-mode demotion MCSPlayer.as:2260-2273`
- **Quote:** isLine = drawArrayLength > lengthThreshhold && getDistanceSQ(firstPoint,lastPoint) > distThreshhold;   //  lengthThreshhold = 4, distThreshhold = 400   ...   dist = lineArray[0].x - getMCS().x; if(dist * dist < 625) { return; }
- **Lane impact:** L5 — the Ready bullet 'gesture→attack map' carried no thresholds; these are the numbers. Also uncovers input buffering the ledger has nowhere: a line drawn while a slash is committed is stored as slashArrayBuffer and fired next (MCSPlayer.as:2275-2285).

### `combat-core/heavy-def-0.8` — HELD [A2]

The Heavy-stance defence penalty ×0.8 is the one Ready sub-claim that survives intact, confirmed twice — in code and in the game's own skill copy.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3226-3234; corroborating string 6005 in docs/gauntlet/L0/index/strings.json (skill 1002 desc, reference/extracted/skilldata.xml)`
- **Quote:** internal function getDefense() : int { if(this.stance == HEAVY_STANCE) { return defense * 0.8; } return defense; }   ///   string 6005: 'Slow but powerful stance. Damage inflicted is increased but slash range is shorter.\nEffective against Balanced Stance.\nDefense -20%'
- **Lane impact:** L5 — the penalty exists ONLY on the defence side, which validates the repo's Stage-2 landmine warning; src/config/stances.ts heavy.damageTakenMult 1.25 is the same number inverted (1/0.8) and must stay data-only.

### `combat-core/launch-unlock-levels` — HELD [A2]

src/config/stances.ts's LAUNCH_UNLOCK_LEVEL is wrong for heavy: the source ladder is 3 = the stance's signature move (light launch / balanced flip-up / heavy launch), 4 = deflect in every stance, 5 = the stance's advanced move — so heavy launch unlocks at mastery 3, not 5.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3164-3194`
- **Quote:** else if(this.stance == LIGHT_STANCE) { this.canLaunch = this.lightMastery >= 3; this.canDeflect = this.lightMastery >= 4; this.canAirCombo = this.lightMastery >= 5; ... } else if(this.stance == BALANCED_STANCE) { this.canFlipUp = this.balancedMastery >= 3; this.canDeflect = this.balancedMastery >= 4; this.canLaunch = this.balancedMastery >= 5; ... } else if(this.stance == HEAVY_STANCE) { this.canLaunch = this.heavyMastery >= 3; this.canDeflect = this.heavyMastery >= 4; this.canStab = this.heavyMastery >= 5; ... }
- **Lane impact:** L5 + L2 — light 3 ✓, balanced 5 ✓, heavy 3 ✗ (config says 5). Reversed and Dual stances get all five abilities unconditionally (MCSPlayer.as:3188-3194), which the ledger's three-stance model has no slot for.

### `combat-core/reach-is-arclength` — HELD [A2]

Reach is an arc-length budget spent along the drawn stroke (a curvy slash covers less ground than a straight one), with the stroke visibly tapering to zero thickness as the budget drains — confirming a model the repo asserted without a source.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:198, :352-366 (defaults at :51-59; per-stance value set by MCSPlayer.as:3094)`
- **Quote:** distanceTravelled = Math.sqrt(distanceTravelledSQ); originalDistanceTravelled = distanceTravelled; if(distanceTravelled > distanceLeft) { distanceTravelled = distanceLeft; } distanceLeft -= distanceTravelled;
- **Lane impact:** L5 — the reach gate must decrement per polyline segment, not test a radius. Also fixes the stroke render: thickness = 8 tapering by (maxDistance-distanceLeft)/maxDistance, battle colour 0x990000, points resampled to ≤20 units.

### `combat-core/slash-type-map` — HELD [A2]

The 'gesture→attack map' is really a nine-way slash-type classifier with exact geometric gates (jumpThreshhold 100, ±25 tilt band, downstab |Δx|<50, drop >100), not a single mapping.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2403-2456; type constants at :37-53; jumpThreshhold at :11`
- **Quote:** else if(mcs.y - this.destY > jumpThreshhold) { this.slashType = JUMP_SLASH; } else if(this.canStab && this.destY < lastPt.y && Math.abs(this.destX - lastPt.x) < 50) { this.slashType = DOWNSTAB_SLASH; } else if(this.destY - lastPt.y > jumpThreshhold && !isAirborne()) { this.slashType = UP_SLASH; } else { diff = this.destY - lastPt.y; if(diff > 25) { this.slashType = HOR_SLASHUP; } else if(diff < -25) { this.slashType = HOR_SLASHDOWN; } }
- **Lane impact:** L5 + L6 — nine slash types (HOR / JUMP / DROP / UP / AIR / LAUNCH / DOWNSTAB / HOR_UP / HOR_DOWN) each drive their own animation, and UP_SLASH is the launcher (endSlash sets Damage.LAUNCH_AIR when canLaunch).

### `combat-core/stance-triangle` — HELD [A2]

The stance counter-triangle CONTRACT (light>heavy, heavy>balanced, balanced>light) is confirmed a third time, now from the payload's own string table rather than a transcribed tutorial line.

- **Cite:** `docs/gauntlet/L0/index/strings.json entries 6001 / 6003 / 6005, attached to skilldata.xml skills 1000 / 1001 / 1002`
- **Quote:** 6001: 'Swift but light stance. Slash range is longer but damage inflicted is lower.\nEffective against Heavy Stance.'  ·  6003: 'Balanced stance.\nEffective against Light Stance.'  ·  6005: '...\nEffective against Balanced Stance.\nDefense -20%'
- **Lane impact:** L5 — src/config/stances.ts STANCE_BEATS matches exactly; never relitigate. 6001 also states the light trade in the developer's words (longer range, lower damage), which is the reach/damage permutation in prose.

## economy — re-scored 82

48 → 82. Blocker ① dies twice (coins-per-kill generator AND calcXP), ③ dies outright (repair = nodeLevel×10), ④ dies (token cap 40 + 120s regen), ② splits — sell-price dies, prosperity survives narrowed to "magnitudes are server-side". §6's "dead IAP economy" is over-conceded: tier table, catalogue blob, hourly rotation rule and exchange rate all survive. Two subsystems the ledger never names are fully held (trade-goods arbitrage; the coin-purse cap ladder). One ledger claim under apparent payload attack is DEFENDED by a frame (Writ at 25g). Held back from 90+ by: prosperity deltas genuinely server-side; the trade-goods RNG seed expression differs between builds and I did not resolve it; and the 5× premium redenomination means every heavenly-gold figure must be re-derived per build before porting.

### `economy/cho-han-is-ev-neutral` — HELD [A2] ⚑ OVERTURNS LEDGER

Cho-Han betting is a zero-expected-value variance device, not a gold faucet — two independent floor(U[0,1)×6) dice give exactly 50/50 parity and a correct call returns bet × 2 on an escrowed stake.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1802-1843 (doChoHan); stake escrowed at :1790 (doBet)`
- **Quote:** InteractUI.as:1811-1812 — "var dice1:int = Math.random() * 6;\nvar dice2:int = Math.random() * 6;"; :1823 — "var isEven:Boolean = (dice1 + dice2) % 2 == 0;"; :1832-1834 — "if(isEven && choice == 0 || !isEven && choice == 1)\n{\n   StatsManager.changeGold(this.bet * 2);"
- **Overturns:** "gold has legit non-cash faucets (rebirth/tournament/betting)"
- **Lane impact:** L10/L11: betting must not be modelled as a gold source. Rebirth IS a genuine faucet (25 gold, 100 on the ninth). The Ready bullet is wrong in expectation on the betting clause.

### `economy/coins-per-kill-and-xp` — HELD [A2] ⚑ OVERTURNS LEDGER

Both halves of blocker ① are HELD in the web build: coins per kill come from <reward><loot> id 0 (=1 coin × qty) and id 1 (=5 coins × qty) rolled against <chance>, or Math.random()×level for duelists — and calcXP is a complete, literal formula with both helper curves.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:861-867 and :188-206 (= Android NPC.as:837-843 and :166-190); loot rows at reference/extracted/npcdata.xml:38-44 (131 <loot> blocks over 66 NPCs, tabulated this run)`
- **Quote:** §1t68s0§.as:863-867 — "§1t406s0§.instance.§1t6488s0§.§1t5846s0§(1 * _loc8_);\n}\nelse if(_loc7_ == 1)\n{\n   §1t406s0§.instance.§1t6488s0§.§1t5846s0§(5 * _loc8_);". npcdata.xml:38-44 — "<reward>\n<loot>\n<id>0</id>\n<qty>2</qty>\n<chance>0.5</chance>\n</loot>\n</reward>". §1t68s0§.as:196-202 — "if(param1 < param2) { _loc5_ = param3 * (1 + 0.05 * (param2 - param1)); } else if(param1 > param2) { _loc5_ = param3 * (1 - (param1 - param2) / §1t12069s0§()); }". Loot tally: (0,5,0.1)×42, (0,5,0.05)×19, (3,1,0.1)×27, (2,1,1)×10, (1,2,0.5)×7, (0,5,0.5)×6, (0,2,0.5)×5, (0,3,0.5)×5, rest singletons.
- **Overturns:** "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."
- **Lane impact:** L4/L10: the commonest field mob yields 0.5 coins/kill in expectation (10% × 5 × 1c), not 8. src/config/economy.ts:37 KILL_REWARD={coinsFlat:8} and its docblock 'COINS have NO source formula found' are both refuted — the filmed +8 is the top of the duelist range floor(U[0,1)×9), so the frame stands and only the flat-constant MODEL falls. calcXP helpers: getGreyLevel (NPC.as:94) and getZeroDifference (NPC.as:112).

### `economy/duel-token-cap-40` — HELD [A1] ⚑ OVERTURNS LEDGER

FRAME BEATS PAYLOAD: the duel-token cap is 40, not the Android bundle's 30 — the HUD reads 40/40 on film and the web payload's constant at the same slot is 40; this closes the token-economy blocker.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=48:04, crop (1500,130)-(1780,235) upscaled ×5; corroborated at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:200 vs reference/decompiled/shs3_android/scripts/StatsManager.as:166`
- **Quote:** The crop shows a skull icon in a green diamond beside a bordered field reading '40/40' with the label 'DUEL TOKENS' beneath. Constant blocks align slot-for-slot: APINTERVAL 60=60, DTINTERVAL 2*60=2*60, WARMOVEINTERVAL 60*60=60*60, MAXQUESTS 7=7, MAXDUELTOKENS Android 30 vs web 40, MAJORCUSTOMCLANTHRESHHOLD 40=40.
- **Overturns:** "④ token/tournament economy numbers."
- **Lane impact:** L10: token economy fully specified — cap 40, regen 1 per 120 s, ×2 under BUFF_DUELTOKENS, fresh character 20/20. L9 (WORLD) gets AP regen = 1 per 60 s free, closing world-exploration blocker ④ 'AP regen rate + cap'.

### `economy/iap-tiers-held-both-builds` — HELD [A2] ⚑ OVERTURNS LEDGER

The real-money IAP tier tables are HELD verbatim for BOTH builds, including two discount ladders — the ledger's 'IAP tiers' Ready bullet is now cited rather than assumed, and the prior survey's STILL_UNHELD verdict is overturned.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t410s0§.as:136-140 + :325-329 + :274-278 + :296-300 (web); reference/decompiled/shs3_android/scripts/PayUI.as:127-141 (Android)`
- **Quote:** §1t410s0§.as:136-140 — "this.goldtext0.text = 50 + \" \" + §1t1521s0§.getString(64);" … 125 … 200 … 275 … 400; :325-329 — "this.pricetext0.text = \"50 KREDS\";" … 100 … 150 … 200 … 250 KREDS. PayUI.as:127-141 — 10/25/40/55/75 gold at "4.99"/"9.99"/"14.99"/"19.99"/"24.99". Discounts: 20% → 60/150/240/330/480 (:274-278); 50% → 75/188/300/413/600 (:296-300).
- **Overturns:** "**The dead IAP economy** — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this."
- **Lane impact:** L10/L11: the whole cash→gold→coin chain now closes end-to-end (50 KREDS → 50 gold → 10,000 coins). §6 must stop calling the IAP economy structurally unrecoverable; only the payment processor is dead.

### `economy/premium-exchange-rate-200` — HELD [A2] ⚑ OVERTURNS LEDGER

1 heavenly gold buys 200 coins in the web v0.717 build, not the 1000 the Android build pays — frame and web payload agree against the Android row.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:948-959 (web convertgold) vs reference/decompiled/shs3_android/scripts/InteractUI.as:918-923; corroborated by the '200' banknote at 1 gold in the t=48:04 frame`
- **Quote:** §1t401s0§.as:952 — "§1t1523s0§.§1t9619s0§(200);" inside the block tagged by the surviving literal "convertgold" at :959; Android InteractUI.as:923 — "StatsManager.changeGold(1000);"
- **Overturns:** "The dead IAP economy — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this."
- **Lane impact:** L10/L11: the premium→coin sink is fully specified for the rebuild target at 200 coins/gold. Also corrects the prior gauntlet economy survey's E-08, which banked 1000.

### `economy/premiumdata-blob-is-extracted` — HELD [A2] ⚑ OVERTURNS LEDGER

The premium storefront catalogue blob IS on disk and is plain XML — 16 permanent SKUs, a commented-out special list, and rotating outfit sets carrying the developers' own comment headers — overturning the prior survey's finding that it was never extracted.

- **Cite:** `reference/extracted/android/121_Mobile_PremiumData.bin (4,504 bytes, XML 1.0); rotation seeding at reference/decompiled/shs3_android/scripts/XMLShopData.as:101`
- **Quote:** "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<premiumdata>\n<default>\n<item>2208</item>\n<item>2209</item>\n<item>2212</item>\n<item>2215</item>\n<item>2213</item>\n<item>2100</item>" … and in <rotation>: "<!-- Assassin outfit -->", "<!-- Dark Assassin outfit -->", "<!-- Santa outfit -->", "<!-- Ichigo outfit -->", "<!-- Zaraki outfit -->", each followed by a <set> of 6-7 item ids (Assassin = 2130, 7034, 4065, 5008, 11036, 12018)
- **Overturns:** "**The dead IAP economy** — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this."
- **Lane impact:** L3 (ITEMS/PAPERDOLL): each rotation <set> is a free 6-7-slot paperdoll manifest with a human-readable outfit name. L10/L11: hourly rotation rule is `setRNGSeed(serverDate * floor(serverTime/3600))`.

### `economy/repair-weapon-cost` — HELD [A2] ⚑ OVERTURNS LEDGER

Repair-Weapon cost is HELD in both builds at currentNodeLevel × 10 coins, and repair resets condition to tier 1 rather than restoring to new.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1057-1058; the same line number in the web build, reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1058`
- **Quote:** InteractUI.as:1057-1058 — "case \"repairweapon\":\n   cost = StageManager.getCurrentNodeLevel() * 10;"; §1t401s0§.as:1058 — "cost = §1t1525s0§.§1t9936s0§() * 10;". On success InteractUI.as:1073 — "if(weapon.uses > 1) { weapon.uses = 1; }"; refused for itemID 0 or 13000 at :1066.
- **Overturns:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** L10: closes the blocker and also kills the §5 Tier-2 task line 'Items/economy session: … read Repair cost' — no playable build is needed for it.

### `economy/sell-price-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The sell-price formula is HELD verbatim in the WEB build and is independent of <baseprice> — it is a function of item-id band, weight and affix count only, so any 'sell = X% of buy' model is false.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988 (web), byte-for-byte identical to reference/decompiled/shs3_android/scripts/Item.as:1582-1592; consumed at ShopUI.as:401, paid at ShopUI.as:540`
- **Quote:** public function getSellAmt() : int
{
   if(this.itemID < 3000) { return 1; }
   if(this.getWeight() >= 10) { return (1 + this.getModifierCount()) * 10; }
   return (1 + this.getModifierCount()) * 5;
}
- **Overturns:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** L10 (PROGRESSION + ECONOMY): sell price is portable today. Trap flagged: ShopUI.as:58 declares `internal var sellPercentage:Number = 0.5;` which is dead code — one declaration, zero reads across the bundle. Every itemID < 3000 (all consumables/materials) sells for exactly 1 coin.

### `economy/service-prices-are-formulas` — HELD [A2] ⚑ OVERTURNS LEDGER

Four of the six service 'prices' the ledger banked as constants are formulas keyed to node level, and one filmed town corroborates three of them simultaneously.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:229 (inn), :241 (stables), :1406 (toll), :1003-1008 (forge), :1058 (repair), :1083 (reinforce) — all line-matched in web §1t401s0§.as`
- **Quote:** InteractUI.as:1003-1008 — "level = StageManager.getCurrentNodeLevel();\nif(level > 80)\n{\n   level = 80;\n}\ncost = level * 100;". Inn/stables = getNodeLevel(currentNode) * 2; toll = getNodeLevel(currentNode); reinforce = flat 5000. Video B's town is a level-7 node (B-10 t=21:02 dialogue: 'FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS'), which makes toll 7 ✓, stable 14 ✓, forge 7×100=700 ✓.
- **Overturns:** "Forge 700c (the −70 HUD read is a capture artifact)"
- **Lane impact:** L10: Forge is min(nodeLevel,80)×100 — up to 8000c, not a 700c constant. The ledger banked samples, not laws. Reinforce additionally burns reagent stats 20060-20065 in three level bands (<30, <60, 60+).

### `economy/coin-purse-cap-ladder` — HELD [A2]

A hard coin-purse cap ladder (1000/2000/4000/6000/8000/10000) exists in BOTH builds and changeGold silently discards the overflow — the load-bearing sink that gives the economy its shape, named in none of the ledger's economy bullets.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2632-2667; identical in web at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2921-2940`
- **Quote:** internal static function getMaxCoins() : int
{
   switch(getStat(1011))
   {
      case 0: return 1000;  case 1: return 2000;  case 2: return 4000;
      case 3: return 6000;  case 4: return 8000;  case 5: return 10000;
      default: return 1000;
   }
}
… changeGold: "if(newCoins > maxCoins) { newCoins = setStat(11,maxCoins); }"
- **Lane impact:** L10/L9: a 1000-coin default cap against a 5000c Reinforce and an 8000c max-level Forge IS the mid-game grind. isCoinPurseFull() gates both the gold→coin conversion and the purse-upgrade purchase (ShopUI.as:426-435). The bank (InteractUI.as:1748 bankDeposit, STAT_COINSINBANK) is the escape hatch and pays zero interest; storage weight = 100 + STAT_DAN*10 + STAT_PAIDSTORAGE*10 (BankUI.as:264), each +10 costing 1 heavenly gold.

### `economy/crop-price-is-supply-oscillator` — HELD [A2]

Crop price is not a static '5–20c' range but a three-point supply signal: base 10 for all four clans, 20 for the clan with the fewest crops, 5 for the clan with the most, and a flat 10 if the four are level.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:105 and :497-501; payout at :1544-1548; global tally fed by getAllCrops at :220`
- **Quote:** InteractUI.as:497-501 — "this.cropPrices = [10,10,10,10];\nif(maxCrops != leastCrops)\n{\n   this.cropPrices[leastCropsSide] = 20;\n   this.cropPrices[maxCropsSide] = 5;\n}"
- **Overturns:** "crop 5–20c"
- **Lane impact:** L9/L10/L11: '5–20c' is the envelope, not the rule. Payout is count × price in one lump. Needs the four-clan crop tally as state, which is a server-sim surface the offline build must author.

### `economy/guest-start-3-gold-confirmed` — HELD [A2]

The frame-sourced guest wallet '100 coins / 3 gold' is confirmed verbatim by the web payload's initNewPlayer; the Android build's 0 gold is what made the prior survey call it a live contradiction.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:1007 (initNewPlayer), wallet block :1023-1028 — positionally identical to reference/decompiled/shs3_android/scripts/StatsManager.as:692-711 (same 21 assignments, same order, same default args 4017/11017/12017)`
- **Quote:** §1t1523s0§.as:1023-1028 — "§1t7357s0§(§1t9412s0§,100);" (GOLD) "§1t7357s0§(§1t9413s0§,3);" (HGOLD) "§1t7357s0§(§1t9414s0§,30);" (AP) "§1t7357s0§(§1t9415s0§,30);" (MAXAP) "§1t7357s0§(§1t9416s0§,20);" (DUELTOKENS) "§1t7357s0§(§1t9417s0§,20);" (MAXDUELTOKENS). Android StatsManager.as:706 — "setPlayerStats(STAT_HGOLD,0);"
- **Lane impact:** L9/L10: src/config/profile.ts:10's deferred '(100 coins / 3 gold)' is now A2-confirmed and can be seeded. PROFILE_START_POOLS {hp:10, chi:10, ap:30} also matches verbatim.

### `economy/heavenlyprice-is-5x-deflated` — HELD [A1]

FRAME BEATS PAYLOAD: the shipped v0.717 gold prices are exactly 5× the <heavenlyprice> rows in reference/extracted/itemdata.xml — the frame shows badges 60, 25, 15, 10 and 5 while that file's entire heavenlyprice domain is {0,1,2,3,5,8,12,25,100}, so 10, 15 and 60 do not exist in it at all.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=48:04, premium BUY shop, 1920×1080; crops (380,840)-(580,1030) badge '60', (390,650)-(940,840) three scrolls each badge '25', (190,270)-(560,450) banknote '200' badge '1' — each upscaled ×4 LANCZOS`
- **Quote:** Visible in the crops: a blue gift-box tile with a white '60' beside a gold-coin icon; three purple-bordered scroll tiles each with '25' beside a gold-coin icon; a banknote icon printed '200' with '1' beside a gold-coin icon. Frame price set = {1,5,10,15,25,60}; itemdata.xml heavenlyprice tally = 0:1 1:59 2:6 3:191 5:5 8:1 12:39 25:1 100:1 (304 rows).
- **Lane impact:** L3 (ITEMS): <baseprice>/<weight>/<modifier> port as-is (the web and Android itemdata are byte-identical apart from the XML declaration), but <heavenlyprice> must be MULTIPLIED BY 5 for a v0.717 target or the shop will price every premium item at one-fifth of the original. L10/L11 inherit the same rule.

### `economy/prosperity-magnitudes-server-side` — PARTIAL [A2]

The prosperity daily-sim taxonomy is HELD — every renderable event, its sign, the four town state variables and one hard-coded constant — but every magnitude arrives from the dead server, so the tick rates and deltas remain unheld.

- **Cite:** `reference/decompiled/shs3_android/scripts/HistoryItem.as:137-311 (dataToString); values sourced at NetworkManager.as:2042 (updateTownProsperity); 5-tier ladder consumed at DungeonGenerator.as:1363-1555`
- **Quote:** HistoryItem.as — "return \"merchants robbed by bandits: prosperity -\" + val1;" / "return getAttackerName(val2) + \" attacked town: prosperity -\" + val1;" / "return \"mercenaries upkeep cost: prosperity -\" + val1;" / "return \"town hired ninja: prosperity -1000\";" / "return \"trade with other towns: prosperity +\" + val1;" / "return \"town status (prosperity: \" + val4 + \", crops: \" + val1 + \", goods: \" + val2 + \", defense: \" + val3 + \")\";"
- **Overturns:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** L11: the client renders, it does not compute. Blocker ② dies for sell-price and survives NARROWED for prosperity — the offline sim must author the deltas and label them in DIVERGENCES. Only the −1000 ninja hire is a recoverable constant.

### `economy/quests-never-pay-coins` — HELD [A2]

No shipped quest pays coins: the schema supports it but a scan of all 386 <outcome> blocks in questdata.xml found zero carrying <id>11</id> (STAT_GOLD) — so the coin faucet set is closed and enumerable.

- **Cite:** `reference/extracted/questdata.xml — 386 <outcome> blocks scanned this run, 0 with <id>11</id>; 69 <reward><exp> rows over 10 distinct values; branch at reference/decompiled/shs3_android/scripts/XMLQuestOutcome.as:56-58`
- **Quote:** XMLQuestOutcome.as:56-58 — "if(this.id == 11 && this.modify > 0)\n{\n   OverworldHUD.instance.lootDialog.addLootCoins(this.modify);\n}". Quest XP reward values, measured: {100, 200, 250, 290, 500, 600, 750, 1000, 2000, 3000}.
- **Lane impact:** L1 (CAMPAIGN) / L10: quest rewards are exp + loot only. Faucet set closes to: mob loot rolls, duelist kills, chests, crops, trade goods, item sales, war rank-ups, daily prize, gold conversion. Daily-prize table verbatim at InteractUI.as:1195-1275 (Math.random()*36 → 100c on 0-4, 200c on 5, 300c on 6, items 7+; a Math.random()*6 bonus roll every 10th streak day paying 1000c on a 0).

### `economy/rebirth-payout-config-is-right` — HELD [A2]

The web build pays 25 heavenly gold per rebirth and 100 on the ninth (DAN==8), exactly matching src/config/economy.ts REBIRTH — while the Android build pays 5/20, so porting from the Android decompile would have injected a 5× error into an already-landed config.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2656 (web) vs reference/decompiled/shs3_android/scripts/StatsManager.as:2200-2208 (Android); config at src/config/economy.ts:54`
- **Quote:** §1t1523s0§.as:2644-2652 — "if(§1t7356s0§(§1t9426s0§) == 8)\n{\n   §1t9713s0§(§1t9413s0§,100);\n   §1t3318s0§.instance.§1t3409s0§(§1t1521s0§.getString(864,[§1t9765s0§(),\"10\"]));\n}\nelse\n{\n   §1t9713s0§(§1t9413s0§,25);\n}"; Android StatsManager.as:2200-2208 — "changeStat(STAT_HGOLD,20)" / "changeStat(STAT_HGOLD,5)"
- **Lane impact:** L10/L11: REBIRTH.earlyGold=25 / tenthGold=100 upgrades from research-sourced to A2-sourced. MAX_DAN_RANK=10 corroborated twice — STAT_DAN increments only while <9 (0-indexed = 10 ranks) and the announcement string is literally parameterised with "10".

### `economy/trade-goods-arbitrage-loop` — PARTIAL [A2]

A five-commodity buy-low/carry/sell-high arbitrage loop with a deterministic seeded price oscillator exists in both builds and appears in none of the ledger's four economy bullets.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t401s0§.as:1647-1676 (web) = reference/decompiled/shs3_android/scripts/InteractUI.as:1558-1586 (Android); tutorial tip at GameEngine.as:636`
- **Quote:** Price/variation table identical in both: 0→(10,20), 1→(20,30), 2→(100,15), 3→(200,30), 4→(200,30); return expression "return price * (100 - variation / 2 + rng.rand(variation)) / 100;". GameEngine.as:636 — "Tip: You can make money easily by buying goods from a market and selling in another town." Android seeds `new RNG(StageManager.getCurrentNode() * QueryManager.instance.getServerDate() * index)`; the web expression at :1676 is `§1t3317s0§.instance.§1t1848s0§() * param1` (two factors, not three) — I did NOT resolve which is authoritative.
- **Lane impact:** L9/L10: fully reproducible offline with the project's injected mulberry32 RNG, no server needed. buyGoods/sellGoods write stats 20054-20058. The seed-expression divergence between builds is an open item.

### `economy/war-room-structure-costs` — HELD [A2]

War-Room structure build totals are HELD as payload rows — Forward Base 10000, Ladder 5000, Defense 10000, Town 10000 coins, donated in flat 500-coin chunks that each burn one war move.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUIBuildMenu.as:190-208 (per-structure totals); WarHexUI.as:1291-1302 and :1332-1386 (donation mechanics); WarHex.as:424/478/521/541 (same totals as maxcost); StatsManager.as:162 (WARMOVEINTERVAL)`
- **Quote:** WarHexUIBuildMenu.as:192 — "str += \"- \" + LangManager.getString(566) + 10000 + \" \" + LangManager.getString(63) + \"\\n\";" under case WarHex.HEX_FORWARDBASE; :197 = 5000 under HEX_LADDER; :202 = 10000 under HEX_DEFENSE; :207 = 10000 under HEX_TOWN. WarHexUI.as:1332 — "var buildcost:int = 500;". StatsManager.as:162 — "internal static var WARMOVEINTERVAL:int = 60 * 60;"
- **Overturns:** "War-Room structure coin costs absent from config"
- **Lane impact:** L11 (META + REBIRTH): src/config/economy.ts:60 buildDonationCap:500 is corroborated; the four totals are new to the repo. The Surface bullet stays TRUE of the repo — this is now a port task, not a knowledge gap. War moves regen 1 per real hour.

### `economy/web-payload-is-decompilable` — HELD [A2]

The web v0.717 payload IS decompiled and readable on disk under SWFDefender identifier mangling — 1079 .as files, 612 §…§ game-logic classes — so no lane needs to caveat 'this is the Android build' any more.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988 (web Item.getSellAmt); 612 §-mangled classes in that directory, 1079 .as files total`
- **Quote:** if(this.§1t467s0§.§1t697s0§() < 3000)
{
   return 1;
}
if(this.§1t545s0§() >= 10)
{
   return (1 + this.§1t497s0§()) * 10;
}
- **Lane impact:** Every lane (L1–L11): the Android-only provenance caveat that the pass-1 economy survey and the L0 journal S0-3 both carry is now removable for AS3. Diff web vs android, cite the web. Class map established: StatsManager=§1t1523s0§, InteractUI=§1t401s0§, Item=§1t17s0§, NPC=§1t68s0§, XMLItem=§1t104s0§, XMLShopItem=§1t61s0§, PayUI=§1t410s0§.

### `economy/writ-25g-upheld-by-frame` — HELD [A1]

The ledger's 'Writ of Release 25g' is CORRECT and is upheld against a payload row that appears to refute it: itemdata.xml lists the Writ at heavenlyprice 5, but the frame shows three 25-gold scrolls matching the three 5-priced scroll items exactly, so the 5 is the Android denomination.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 t=48:04 crop (390,650)-(940,840) ×4 — three purple scroll tiles at 25 gold; vs reference/extracted/itemdata.xml:2327-2339 (item 2203)`
- **Quote:** itemdata.xml:2327-2339 — "<item>\n<id>2203</id>\n<type>10</type>\n<name>4156</name>\n<unique>1</unique>\n<baseprice>0</baseprice>\n<heavenlyprice>5</heavenlyprice>"; the frame's three 25-gold scrolls correspond one-for-one to the three heavenlyprice-5 scrolls 2200 (Amnesia Scroll), 2203 (Writ of Release), 2207 (Name Change Scroll).
- **Overturns:** "Writ of Release 25g now double-confirmed"
- **Lane impact:** L10/L3: do NOT 'correct' the ledger down to 5 gold on the strength of the payload row. This is the worked example proving the 5× redenomination rule and the standing frame-wins invariant in the same claim.

## enemies-ai — re-scored 78

Ledger says 34/100. Re-scored 78. All five §4 blockers resolve on disk: ① the level→stat formula is NPC.setLevel() (linear rescale + 0.9 sub-21 + a hard 1/1/1 clamp at lvl<=10); ② 403 authored <hp> rows (1..1000); ③ every attack animation ships as parta/partb/partc with explicit frame durations across 471 timed anims; ④ per-class engagement distances (50/100/400/250) plus a 24-frame decision cadence, and 118 <wave> blocks with 160 <x> spawn coords + drop-in-from-above rule; ⑤ the archer's full ballistic solve (GRAVITY=3, cos30 launch, ±4 jitter) and — refuting the blocker's premise — no reflect mechanic anywhere, only a zombie half-damage-unless-behead gate. Beyond the blockers the payload holds a 38-case ai-id→class dispatch that the shipped 3-tier AI_TIERS does not model at all. Capped at 78, not 90+, by four things: (1) every behavioural constant comes from the ANDROID v0.682 decompile — the web v0.717 payload decompile holds 652 classes and ZERO Enemy*/NPC* gameplay code, so build parity is unestablished and this is the dominant residual risk; (2) "Tengu", listed Ready in the ledger taxonomy, greps to 0 across the entire payload and script tree; (3) the 38 behaviour classes are unwritten work, not a tuning gap; (4) the 12-frame hit-lockout is a counter with no stagger animation and wants frame-side confirmation before it is treated as CONTRACT.

### `enemies-ai/ai-id-to-class-map` — HELD [A2] ⚑ OVERTURNS LEDGER

The <ai> field is not a difficulty tier — it is an index into a literal 38-case switch that instantiates 34 named Enemy* classes plus 3 Friendly* classes, each a full hand-written state machine; the shipped src/config/ai.ts AI_TIERS easy|normal|hard table models a structure the original does not have.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:516-634`
- **Quote:** switch(xml.ai) { case 0: actor = new EnemyPlayer(MCSPool.getMCS(),true,false); break; case 1: actor = new EnemyKnife(MCSPool.getMCS()); break; case 2: actor = new EnemyArcher(MCSPool.getMCS()); break; case 3: actor = new EnemyKatana(MCSPool.getMCS()); break; case 4: actor = new EnemySpear(MCSPool.getMCS()); break; case 5: actor = new EnemyShield(MCSPool.getMCS()); break; ... case 35: actor = new EnemySorcererBoss(MCSPool.getMCS()); break; case 36: actor = new EnemyKanjiGuardian(MCSPool.getMCS()); break; case 37: actor = new EnemySpearElite(MCSPool.getMCS(),true); break;
- **Overturns:** "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. **the archer** (closed this pass); boss roster"
- **Lane impact:** L0 enemies-ai: the taxonomy is A2-held, not research-reconstructed. But the shipped 3-tier AI model is the wrong SHAPE, and that unwritten 38-class work is what keeps the score under 90. npcdata uses 34 distinct <ai> values across 425 rows (histogram: 1×56 2×48 3×52 4×47 5×48 6×3 7×6 8×2 9×73 14×15 26×8 28×24 29×10 30×8 …).

### `enemies-ai/arrow-arc-physics` — HELD [A2] ⚑ OVERTURNS LEDGER

Arrow arc physics is held in full: a closed-form ballistic solve at a fixed 30° launch (0.866 = cos30) from a 60px muzzle offset with ±4 vertical scatter, integrated per-frame with GRAVITY = 3 and ttlMax = 48, rotation = atan(velY/velX)*57.2727+180, dying at groundY; knockdown chance gates on the archer's level (>50 → 1-in-2, >20 → 1-in-3, >10 → 1-in-4, else never). The Oni thrower reuses the identical solve via createRock.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyArcher.as:271-302 + ArrowProjectile.as:51-56 + Projectile.as:8,22 + EnemyGoblinThrower.as:555-565`
- **Quote:** var velA:Number = Projectile.GRAVITY * Math.abs(targetX - fireX) / 0.866; velA = Math.sqrt(velA); var velXa:Number = velA * 0.866; var t:Number = Math.abs(targetX - fireX) / velXa; var velYa:Number = (targetY - fireY - 0.5 * Projectile.GRAVITY * t * t) / t; if(fireX > targetX) { velXa = -velXa; } velYa += Math.random() * 8 - 4;   ·   Projectile.as:8 internal static var GRAVITY:Number = 3;   ·   ArrowProjectile.as:51-56 x += velX; y += velY; … rotation = Math.atan(velY / velX) * 57.2727 + 180; velY += GRAVITY;
- **Overturns:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L0 enemies-ai: kills the arrow half of blocker ⑤. Corroborated visually by the two drawn-longbow archers in the seg-11 frame (CLAIM 4).

### `enemies-ai/boss-names-are-procgen` — HELD [A2] ⚑ OVERTURNS LEDGER

Two of the four 'missing bosses' the ledger flags are not bosses at all — "Hachisuka Kano" and "Honda Shizuka" are procedurally generated bounty-target names assembled from the shipped name tables; "Zabuza" and "Hotaru" appear nowhere in the payload or the 559-class decompile.

- **Cite:** `reference/extracted/android/87_NameGenerator_SamuraiFamilyNames.bin, 85_NameGenerator_MaleNames.bin, 88_NameGenerator_FemaleNames.bin + XMLNpc.as:527,581-594`
- **Quote:** 87_NameGenerator_SamuraiFamilyNames.bin (36 entries): "Asai / Askikaga / Chosokabe / Date / Fukushima / Genji / Hachisuka / Hattori / Heike / Hojo / Honda / Hosokawa / …"  ·  85_MaleNames.bin (398 entries) contains "Kano" at index 79  ·  88_FemaleNames.bin (291 entries) contains "Shizuka" at index 225  ·  XMLNpc.as:527 this.name = NameGenerator.getInstance().getSamuraiName(rng,true);  ·  XMLNpc.as:581-586 if(isBountyTarget) { bossxml = QuestEngine.getNPCData(18); this.id = INDEX_BOUNTYTARGET; this.ai = bossxml.ai; this.hp = bossxml.hp;
- **Overturns:** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru."
- **Lane impact:** L0 enemies-ai: prevents a real authoring error — a recreation that hard-codes these as named bosses would be wrong. The correct port is a bounty-target generator: random surname + given name wearing NPC 18's statline.

### `enemies-ai/engagement-ranges` — HELD [A2] ⚑ OVERTURNS LEDGER

Aggro/engagement geometry is a set of per-class literal constants, plus a global decision cadence: Knife 50px, Katana 100px, Spear 400px approach with 100/50px stab, Shield 50/100px, Ogre 100/40px, Wolf lunge band 100>d>50 and pounce 100-250 at 1-in-3, Archer switches bow→knife under 100px, JiangSi 50px, overworld roamer trigger 100px; NPC.aiCounterMax = 24 frames, halved to 12 for elites and the player-mirror.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:22 + NPC.as:285-294; EnemyKnife.as:181,200; EnemyKatana.as:167,179; EnemySpear.as:192,204,225,227; EnemyShield.as:204,216,265; EnemyOgre.as:239,241; EnemyWolf.as:255,259; EnemyArcher.as:202,219; EnemyJiangSi.as:192; Obj_NPCProcGen.as:135`
- **Quote:** internal var aiCounterMax:int = 24;  …  internal function checkAITrigger() : Boolean { --this.aiCounter; if(this.aiCounter <= 0) { this.aiCounter = this.aiCounterMax; return true; } return false; }  ·  EnemySpear.as:192 if(playerX - mcs.x < 400 && mcs.y - playerY < 10 && int(Math.random() * 4) == 0)  ·  EnemyWolf.as:259 else if(dist >= 100 && dist < 250 && int(Math.random() * 3) == 0)  ·  Obj_NPCProcGen.as:135 return abs(this.npc.mcs.x - mc.x) < 100;
- **Overturns:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L0 enemies-ai: kills the aggro half of blocker ④, and supplies the decision cadence that src/config/ai.ts currently models as AI_THINK_INTERVAL_MS with no source.

### `enemies-ai/kill-rewards-close-two-economy-blockers` — HELD [A2] ⚑ OVERTURNS LEDGER

Kill rewards are fully authored in npcdata's <reward> plus NPC.as: loot id 0 = a 1-coin drop, id 1 = a 5-coin drop, id 2 = quest item, id 3 = level-scaled random item, anything else = that literal item id — so coins-per-kill is Σ(qty × {1,5}) over rolled drops, not a flat 8; and the XP award is the complete grey-level / over-level / elite curve on base xp = level*2 + 20.

- **Cite:** `reference/extracted/npcdata.xml:38-44 (66 <reward> / 131 <loot>, chance domain 0.05,0.1,0.3,0.4,0.5,1) + reference/decompiled/shs3_android/scripts/NPC.as:218, 799-855, 166-190, 94-105, 112-124`
- **Quote:** npcdata.xml:38-44 <reward><loot><id>0</id><qty>2</qty><chance>0.5</chance></loot>   ·   NPC.as chance = loot.chance * 100; if(chance == 100 || Math.random() * 100 < chance) … if(lootType == 0) { addLootCoins(1 * qty); } else if(lootType == 1) { addLootCoins(5 * qty); } else if(lootType == 2) { addQuestLootItem(); } else if(lootType == 3) { addRandomLootItem(this.level,false,true); } else { addLootItemBasic(lootType,qty); }   ·   NPC.as:166-190 public static function calcXP(playerLevel:int, mobLevel:int, xp:int, elite:Boolean) { if(mobLevel <= getGreyLevel()) { return 0; } if(mobLevel - playerL
- **Overturns:** "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."
- **Lane impact:** Cross-lane into L0 economy, banked here because it lives in npcdata.xml. Kills economy blocker ① in both halves: the coin faucet and the full XP curve (incl. getGreyLevel playerLevel - floor(playerLevel/10) - 5, and getZeroDifference 5/6/…) are on disk.

### `enemies-ai/level-stat-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The enemy level→stat formula the ledger calls "absent, not just inferred" is NPC.setLevel(): a linear rescale of the authored XML statline (factor = requestedLvl / authoredLvl, ×0.9 at or under level 20) applied identically to damage, defense and maxhp, with a hard clamp to 1/1/1 at level ≤ 10 and xp = lvl*2 + 20.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:239-260`
- **Quote:** public function setLevel(lvl:int) : * { var factor:Number = lvl / this.level; if(lvl <= 20) { factor *= 0.9; } this.level = lvl; this.damage *= factor; this.defense *= factor; maxhp *= factor; setHP(maxhp); this.updateHealthBar(); this.xp = lvl * 2 + 20; if(lvl <= 10) { this.damage = 1; this.defense = 1; maxhp = 1; setHP(maxhp); } }
- **Overturns:** "① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L0 enemies-ai: kills blocker ①. The lvl<=10 clamp is also the mechanical CAUSE of the SESSION-11 empirical finding that mobs die in one hit, and it retro-justifies src/config ENEMY_BASE.hp = 1.

### `enemies-ai/per-enemy-hp` — HELD [A2] ⚑ OVERTURNS LEDGER

Per-enemy HP is fully authored: 403 <hp> rows spanning 1..1000, alongside 406 <attack> and 394 <defense> rows.

- **Cite:** `reference/extracted/npcdata.xml:3121-3128 (index: docs/gauntlet/L0/index/npcdata.json, npcdata/npc/hp count 403, range [1.0, 1000.0])`
- **Quote:** <npc>\n\t\t<id>144</id>\n\t\t<name>5058</name>\n\t\t<lvl>80</lvl>\n\t\t<hp>1000</hp>\n\t\t<ai>28</ai>\n\t\t<attack>200</attack>\n\t\t<defense>200</defense>
- **Overturns:** "② per-enemy HP."
- **Lane impact:** L0 enemies-ai: kills blocker ②. Measured HP histogram top: 1×42, 15×32, 30×26, 10×23, 40×19, 20×13, 150×11.

### `enemies-ai/shipped-config-hp150-is-stale` — HELD [A3] ⚑ OVERTURNS LEDGER

The ledger's Surface bullet that the shipped ENEMY_BASE is a PvP-duel dummy at hp 150 was true when written (2026-07-20) and is false now — the 150 was removed in commit 335e615 on 2026-07-26 and ENEMY_BASE.hp is 1, asserted green in the suite.

- **Cite:** `tests/config-values.test.ts (57 passed) + tests/enemyModel.test.ts (14 passed); assertion at tests/config-values.test.ts:466-474`
- **Quote:** $ npx vitest run tests/config-values.test.ts →  Test Files  1 passed (1) / Tests  57 passed (57).  Assertion: expect(ENEMY_BASE).toEqual({ hp: 1, minDamage: 1, damageRange: 0, defense: 5, stance: 'heavy', deflectLearned: false, stats: ENEMY_STATS });  ·  git log -S"hp: 150" -- src/config/combat-sim.ts → 335e615 2026-07-26 SESSION13 PHASE B
- **Overturns:** "the shipped `AI_TIERS`/`ENEMY_BASE` are a **PvP-duel dummy** (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives only in notes."
- **Lane impact:** L0 enemies-ai: the Surface bullet is stale on both halves — the hp 150 is gone, and 'every PvE number lives only in notes' is refuted by 403 hp / 406 attack / 394 defense rows. The code comment that guessed at the 1 now has its source: NPC.as:253 clamps to 1 below level 11.

### `enemies-ai/spawn-geometry` — HELD [A2] ⚑ OVERTURNS LEDGER

Spawn geometry is fully authored: 118 <wave> blocks carrying 160 <x> spawn coordinates (range -400..2000), 171 <lvl> overrides (1..80), 75 <fatal> flags, 169 <enemy> / 70 <friend> / 2 <neutral>; the spawn rule is wave 0 on the ground and waves 1+ dropping in from above at posY - random*200, with the next wave gated on every enemy in enemyList being dead.

- **Cite:** `reference/extracted/questdata.xml:77-88 + reference/decompiled/shs3_android/scripts/NPCManager.as:300-320,374-412`
- **Quote:** <wave>\n      <enemy>\n        <id>1</id>\n        <qty>1</qty>\n        <x>750</x>\n      </enemy>\n      <enemy>\n        <id>6</id>\n        <qty>1</qty>\n        <x>790</x>\n        <fatal>0</fatal>\n      </enemy>   ·   NPCManager: if(currentWave == 0) { posY = StageManager.getGroundY(); } else { posY = 0; } … createEnemy(npcHolder.getNPCID(),npcHolder.getXPos(),posY - Math.random() * 200,npcHolder.getFatal(),npcHolder.getLvl());
- **Overturns:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L0 enemies-ai: kills the spawn half of blocker ④, so ④ is dead in both halves. Also explains the FALL_STATE→LAND_STATE branch every Enemy class opens with (EnemyArcher.as:49-52 catches ENEMYLAND).

### `enemies-ai/stagger-is-a-counter-not-an-anim` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The 'stagger' half of blocker ③ resolves differently than the ledger assumes: the hit reaction is a 12-frame hit-lockout counter (gotHitCounter = 12, gating canHit()), and there is NO stagger/flinch/gothit animation among the 158 human anim names — only a launch/knockdown reaction chain (gotlaunchedupwards 4/9/7, gotlauncheddowned 18, downedup 4, downedup2 25, deathdowned 7).

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:462 and NPC.as:296-299`
- **Quote:** this.gotHitCounter = 12;  …  public function canHit() : Boolean { return this.gotHitCounter == 0; }
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai: the number is held (12 frames of hit-lockout / i-frames) but the ledger asked for a mechanic the source does not implement. Wants frame-side confirmation before being stamped CONTRACT — this is one of the four things capping the re-score.

### `enemies-ai/telegraph-active-recovery-frames` — HELD [A2] ⚑ OVERTURNS LEDGER

Telegraph / active / recovery frame counts are authored verbatim: every stance attack ships as three named parts with explicit frame durations, e.g. heavyhorizontalslash_parta d=6, _partb d=9 (looping = active hold), _partc d=7 — across 471 timed animations in the 18 MCSCharacter_*AnimationData blobs.

- **Cite:** `reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin (158 <anim> blocks; measured 471 across all 18 *AnimationData.bin)`
- **Quote:** <?xml version="1.0"?>\n<animdata>\n<anim i="idle" d="1">\n<f i="0">\n<n i="20" x="-10" y="-64" r="-9"></n>  …  heavyhorizontalslash_parta:6, heavyhorizontalslash_partb:9 (l="1"), heavyhorizontalslash_partc:7, balancedhorizontalslash_parta:4/_partb:9/_partc:7, lighthorizontalslash:3, katanaattack:10, stabattack:14, downstab:15, ninjaslash:8, pullbackarrow:9, pullbackarrow_full:15, firearrow:1, arrownormalpose:22
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L0 enemies-ai + art-anim: kills the telegraph/active/recovery half of blocker ③. Also corrects S0-4's '~450 animations' estimate to a measured 471, each with a frame duration and full 21-part keyframes.

### `enemies-ai/tengu-is-not-in-the-payload` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

"Tengu", listed in the ledger's Ready taxonomy, greps to zero across payload.xml, questdata.xml, npcdata.xml, itemdata.xml, skilldata.xml, ui_strings.txt and the entire Android script tree. "Guardian" is held.

- **Cite:** `grep -c -i "tengu" over reference/extracted/*.xml + ui_strings.txt → 0 each; Guardian at reference/decompiled/shs3_android/scripts/NPCManager.as:628 and reference/extracted/npcdata.xml:4111`
- **Quote:** npcdata.xml:0  itemdata.xml:0  questdata.xml:0  ui_strings.txt:0  payload.xml:0  skilldata.xml:0   ·   NPCManager.as:628 case 36: actor = new EnemyKanjiGuardian(MCSPool.getMCS()); break;   ·   npcdata.xml:4111 <id>802</id> … <lvl>10</lvl> <hp>30</hp> <ai>36</ai>  (name resolves to "Guardian"; dedicated 102_MCSCharacter_GuardianAnimationData.bin, 16 anims)
- **Overturns:** "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian)"
- **Lane impact:** L0 enemies-ai: Guardian HELD, Tengu STILL_UNHELD. The Ready bullet over-claims one whole faction — either a v0.717-only addition or a ledger invention. This is one of the four things capping the re-score.

### `enemies-ai/undead-rule-is-not-reflect` — HELD [A2] ⚑ OVERTURNS LEDGER

The Undead blocker is wrong in kind, not merely unmeasured: grep 'reflect' over all 559 Android classes returns zero hits. The actual Undead-specific rule is a head-gate — a zombie takes HALF damage unless the hit lands on hat/head/neck — inverting the base class, which instead rewards a behead with ×1.5. JiangSi uses the standard ×1.5 and does not halve.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyZombie.as:493-518 (contrast NPC.as:451-453 and EnemyJiangSi.as:308-311)`
- **Quote:** switch(target) { case mcs.partList[MCSCharacter.PART_hat]: case mcs.partList[MCSCharacter.PART_head]: case mcs.partList[MCSCharacter.PART_neck]: behead = true; … } … if(!behead) { damage /= 2; }   ·   NPC.as:451-453 if(behead) { damage *= 1.5; }
- **Overturns:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L0 enemies-ai: kills the undead half of blocker ⑤ by refuting its premise. There is no reflect mechanic and therefore no reflect probability to measure — planning a measurement pass for it would have been wasted work.

### `enemies-ai/combat-hud-drops-the-nameplate` — HELD [A1]

The enemy readout is mode-switched: in active combat every hostile shows only a bare thin HP bar with no name, no level and no numerals — the nameplate seen on the overworld is gone.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-11/frames/frame_0020.jpg — crops (560,300)→(1024,500) and (250,300)→(620,500), LANCZOS ×3`
- **Quote:** Visibly in the crops: dungeon brick interior under a full-screen red near-death vignette; HUD 16/20 green, 15/15 blue, "CANNOT CHANGE STANCE", "AUTO SLASH OFF". Five thin horizontal HP bars (four green, one dim tan at far right) float above five separate hostiles; NO hostile carries a name or level. The only text over a fighter is the gold "GUEST" over the player, mid-swing with a pickaxe as a bare-chested bandit lunges from the left. Two kasa-hatted archers with drawn longbows stand at the right.
- **Overturns:** "nameplate (N)=level"
- **Lane impact:** L0 ui-hud + enemies-ai: the single ledger bullet flattens two distinct UI states. A recreation that shows names+levels during combat is wrong.

### `enemies-ai/creature-and-boss-roster` — HELD [A2]

The boss and creature roster is held with exact statlines and skill loadouts: Wolf Alpha lvl15/hp100, Ogre lvl80/hp40, Zombie lvl8/hp40 (×7) and lvl30/hp150, Guardian lvl10/hp30, elite spearmen Tadao lvl10/hp200 and Amaya lvl30/hp600, Mad Cultist (SorcererBoss) lvl23/hp800, Hiroshi lvl80/hp1000 — plus 96 <skills> blocks carrying 647 <skill> rows with ids 1000-1501 and mastery levels 1,2,3,5,10.

- **Cite:** `reference/extracted/npcdata.xml:1844, 2064, 2395, 3442, 3842, 4072, 4111, 3121 + skills at npcdata.xml:492 and :535`
- **Quote:** npcdata.xml:492 <skills><skill><id>1003</id><lvl>1</lvl></skill><skill><id>1004</id><lvl>5</lvl></skill></skills>   ·   npcdata.xml:535 (Bandit Leader) <skills><skill><id>1000</id><lvl>10</lvl></skill><skill><id>1001</id><lvl>10</lvl></skill><skill><id>1002</id><lvl>10</lvl></skill><skill><id>1003</id><lvl>1</lvl></skill><skill><id>1004</id><lvl>5</lvl></skill><skill><id>1006</id><lvl>1</lvl></skill></skills>   ·   npcdata.xml:4072 <id>800</id> <lvl>23</lvl> <hp>800</hp> <ai>35</ai>
- **Overturns:** "boss roster; projectile set (arrows arc, oni rocks, bandit hammer)"
- **Lane impact:** L0 enemies-ai: the roster is A2-held with numbers, not just names. Note also that 'bandit hammer' from the ledger's projectile set greps to zero — hammer/club appear nowhere in the 39 *Projectile.as classes.

### `enemies-ai/nameplate-level-4-bandit` — HELD [A1]

Roaming overworld enemies carry a red all-caps nameplate with a parenthesised level — "BANDIT (4)" — while the player carries a gold "GUEST"; the frame's level 4 disagrees with npcdata's authored lvl 10 for Bandit, and the frame wins, which routes that bandit through setLevel(4) and the ≤10 clamp to a real on-screen HP of 1.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-10/frames/frame_0013.jpg — crop (340,320)→(900,480), LANCZOS ×3`
- **Quote:** Visibly in the crop: two kasa-hatted hostiles walking across a reed field, each under a red all-caps label reading "BANDIT (4)" (the right-hand label is two overlapping copies for two stacked bandits); the player at x≈430 under a gold label "GUEST"; HUD readout TERRITORY (22,51) / SECTOR (1,2). Contrast npcdata.xml:273-280 <id>11</id> <lvl>10</lvl> <hp>15</hp>.
- **Overturns:** "nameplate (N)=level"
- **Lane impact:** L0 enemies-ai: confirms the Ready bullet and adds the colour rule (hostile red / player gold) the ledger omits. THE FRAME WINS over the npcdata statline on level, and that is what makes the 1-HP clamp bite.

### `enemies-ai/no-per-enemy-chi-or-speed` — HELD [A2]

Enemy Chi and SPD are not authored anywhere: npcdata.xml contains zero <chi> and zero <speed> tags, so XMLNpc's parse defaults every NPC to chi = 1 and speed = 1 (other defaults on the same path: ai→1, hp→1, attack→1, defense→0).

- **Cite:** `grep -c "<chi>\|<speed>" reference/extracted/npcdata.xml → 0; reference/decompiled/shs3_android/scripts/XMLNpc.as:150-182`
- **Quote:** if(xml.chi.toString() != "") { this.chi = xml.chi; } else { this.chi = 1; }  …  if(xml.speed.toString() != "") { this.speed = xml.speed; } else { this.speed = 1; }
- **Overturns:** "enemies-ai | 34 | full taxonomy + movesets, boss roster, projectile set"
- **Lane impact:** L0 enemies-ai: a positive answer, not a gap. Any recreation that gives enemies a Chi pool or a per-enemy speed stat is inventing a system the original does not have — this deletes work rather than adding it.

### `enemies-ai/no-squad-coordination` — HELD [A2]

There is no squad coordination anywhere: every NPC independently re-queries the nearest live target within the stage bounds ±10px, with no shared aggro table, no formation and no flanking assignment in NPCManager.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1360-1390`
- **Quote:** public static function getNearestEnemy(xpos:int, isEnemy:Boolean = false) : NPC { … var maxdist:int = 99999; … if(pos > -10 && pos < stageWidth + 10) { dist = Math.abs(xpos - pos); if(!enemy.isDead() && dist < maxdist && enemy.actionState != MCSActor.SKILL_UNDYING_STATE) { selectedEnemy = enemy; maxdist = dist; } }
- **Overturns:** "independent-aggro (no coordination — closed)"
- **Lane impact:** L0 enemies-ai: promotes a research-closed Ready bullet to an A2 cite. Corroborated by the seg-11 frame, where five hostiles converge from both sides with no formation.

### `enemies-ai/one-statline-six-movesets` — HELD [A2]

The authoring rule is one archetype × N AI classes: NPC ids 11-16 are identical statlines (name 5011 "Bandit", lvl 10, hp 15, attack 24, defense 20) differing in exactly one field, <ai> = 1,2,3,4,5,9 — knife / archer / katana / spear / shield / player-mirror.

- **Cite:** `reference/extracted/npcdata.xml:273-465`
- **Quote:** id 11 line 275-280: <name>5011</name> <lvl>10</lvl> <hp>15</hp> <ai>1</ai> <attack>24</attack> <defense>20</defense>  ·  id 12 line 315: <ai>2</ai>  ·  id 13 line 352: <ai>3</ai>  ·  id 14 line 389: <ai>4</ai>  ·  id 15 line 426: <ai>5</ai>  ·  id 16 line 463: <ai>9</ai>
- **Overturns:** "full taxonomy … with movesets"
- **Lane impact:** L0 enemies-ai: this is the real 'moveset' model and it is absent from the ledger entirely. It also means the roster is far cheaper to build than 495 rows suggests — 38 behaviours × a paperdoll/statline table.

### `enemies-ai/web-build-parity` — STILL_UNHELD [STILL_UNHELD]

Every behavioural constant cited above comes from the ANDROID v0.682 decompile; the web v0.717 payload decompile holds 652 classes and zero Enemy*/NPC* gameplay classes, so nothing on disk establishes that v0.717 kept these numbers.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:30 (version) + `ls reference/decompiled/shs3_payload/scripts | grep -ci "enemy\|npc"` → 0`
- **Quote:** StatsManager.as:30 — public static var clientVersion:Number = 0.682;   ·   shs3_payload: 652 files, NPC.as? no   ·   shs3_android_payload: 559 files, NPC.as? present (byte-identical to shs3_android/scripts/NPC.as)
- **Lane impact:** L0 enemies-ai: this is the dominant residual risk and the main reason the re-score is 78 rather than 90+. Do not stamp any AS3-sourced number CONTRACT until the web bytecode is recovered or a frame measurement corroborates that specific number. Label all ported values v0.682-ANDROID.

## items-equipment — re-scored 78

42 -> 78. All five listed blockers resolve against the payload: (1) stat-magnitude-vs-level is held BOTH as a 158-row static weapon table in itemdata.xml (minlvl -4..79, mindamage 1..81, maxdamage 2..108) AND as the executable roll formula in ItemGenerator.getMaxTier + prog1..prog5; (2) condition->DMG multiplier is dissolved, not closed - no multiplier exists anywhere, getCondition() is display-only and damage is a binary broken/not-broken cliff in StatsManager.getMinDamage/getDamageRange; (3) sell price is an exact formula, confirmed in BOTH the Android v0.682 and the web v0.717 builds; (4) the suffix pool the ledger calls a blocker sits verbatim next to the prefix pool (104 + 104 strings) with both affix-count distributions; (5) the sprite-compositing contract is a 27-entry z-ordered PART_* enum plus a `partType + <art>` symbol-name contract, cross-confirmed by the web payload exporting exactly the named default part classes, and the "icon manifest" turns out not to exist as a separate thing (the icon IS the paperdoll part stack at published offsets). Held back from >78 by two genuine remaining gaps: the per-item vector art payload for the full 982-row roster (either obfuscated in the web SWF or inside the encrypted CWS resource blobs per S0-5), and one UI-slot mapping the frame cannot disambiguate. Two ledger "Ready" bullets are additionally WRONG and need correcting rather than re-scoring (defense min-floor, weight cap).

### `items-equipment/affix-suffix-pool-and-counts` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker 4 is fully held: 104 verbatim prefixes and 104 verbatim suffixes (13 distinct pools x 8 tiers) plus both affix-count distributions (normal d100 and rare d11) and the legendary -1 rule.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:102-127, :128-148, :206-252, :371-374`
- **Quote:** var attack_suf:Array = ["of Attack","of Biting","of Striking","of Killing","of Slaughter","of Slaying","of Carnage","of the Butcher"];  /  num = Math.floor(i / 10);  /  dice = this.rng.rand(100); if(dice <= 84) { return 0; } if(dice <= 89) { return 1; } if(dice <= 93) { return 2; } if(dice <= 96) { return 3; } if(dice <= 98) { return 4; } return 5;  /  dice = this.rng.rand(11); if(dice <= 3) { return 2; } if(dice <= 6) { return 3; } if(dice <= 9) { return 4; } if(dice == 10) { return 5; } return 0;
- **Overturns:** "④ affix **suffix** pool + per-rarity affix count."
- **Lane impact:** L4/L7 (economy + loot) — the whole procedural item-naming and enchant-count system is now copyable verbatim, including the shipped bug where the four elemental-DEF channels reuse the wrong prefix/suffix pools (ItemGenerator.as:142-145).

### `items-equipment/condition-has-no-damage-multiplier` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker 2 is dissolved, not closed: there is NO condition->damage multiplier anywhere — getCondition() is called only by getDesc(), and damage is a binary broken/not-broken cliff (broken weapon = ATK+bonus+1 with damage range 0).

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1481-1496 and :714 (only non-definition call site); StatsManager.as:1863-1903`
- **Quote:** var val:int = (maxDurability - this.uses) / maxDurability * 100;  /  if(itemdata == null || equipment[EQ_WEAPON].isBroken()) { basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + 1; } else { basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + itemdata.mindamage; }  /  getDamageRange(): if(equipment[EQ_WEAPON].itemID == 0 || equipment[EQ_WEAPON].isBroken()) { return 0; } return itemdata.maxdamage - itemdata.mindamage;
- **Overturns:** "② condition→DMG **multiplier** (current "evidence" confounds condition with a 2-level gap)."
- **Lane impact:** L1/L2 (combat core + damage) — kills a phantom mechanic; a 99%-worn sword hits identically to a pristine one, so no wear curve should be implemented.

### `items-equipment/defense-min-floor-is-wrong` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's Ready bullet 'defense min-floor (EnemyLevel/4)' is wrong in both variable and shape: the real code is a four-band floor on the PLAYER's post-defense hit keyed to playerLVL with divisors 1 / 8 / 6 / 4, and it lives in boss auto-scaling, not the generic defense pipeline.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyPlayer.as:107-123`
- **Quote:** playerhit = playerATK - defense; if(playerLVL <= 10 && playerhit < 1) { playerhit = 1; } else if(playerLVL <= 20 && playerhit < playerLVL / 8) { playerhit = playerLVL / 8; } else if(playerLVL <= 30 && playerhit < playerLVL / 6) { playerhit = playerLVL / 6; } else if(playerhit < playerLVL / 4) { playerhit = playerLVL / 4; }
- **Overturns:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) and L3 (enemy AI) — this is a boss-scaling floor, not an item/defense rule; implementing 'EnemyLevel/4' as written produces different numbers at every level band below 30.

### `items-equipment/item-save-format-held` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The item and equipment serialization formats are on disk, which partially overturns §6's claim that there is 'nothing to copy' for the save format — Item.parse reads "<id>,<qty>,<modid>@<val>#..." with five reserved modifier IDs, and equipment is a 12-field pipe string.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:6-16 and :47-104; MCSCharacter.as:348`
- **Quote:** public static var PCOLORMODID:int = 80; public static var SCOLORMODID:int = 81; public static var USESMODID:int = 82; public static var NAMEMODID:int = 89; public static var CREATORMODID:int = 125;  /  var strArray:Array = str.split(","); var item:Item = new Item(int(strArray[0]),int(strArray[1])); ... modArray = strArray[2].split("#"); ... modvalArray = modArray[q].split("@");  /  this.mcsString = armorid + armorColor + "|" + glovesid + "|" + hairid + "|" + hatid + hatColor + "|" + headid + "|" + maskid + maskColor + "|" + neckid + "|" + pantsid + pantsColor + "|" + shoesid + "|" + weaponid +
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L10 (persistence/save) — the §6 line stands for server topology but is wrong for the item/equipment schema; the wire format is copyable byte-for-byte. Marked PARTIAL because only the item/equipment slice of §6's claim is overturned.

### `items-equipment/no-separate-icon-manifest` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'item icon manifest' half of blocker 5 is a category error: the inventory icon is composed from the SAME MCS part symbols as the paperdoll, at hard-coded sub-offsets, with ArmorDummyIcon as the miss case — there is no separate icon art set to recover.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:324-349`
- **Quote:** public function setArmor(id:int) : * { this.clearItem(); this.displayItem = this.getMCSComponent("stomach",id); if(this.displayItem == null) { this.displayItem = new ArmorDummyIcon(); addChild(this.displayItem); } else { addChild(this.displayItem); this.displayItem.x = -0.65; this.displayItem.y = 5.9; this.displayItem1 = this.getMCSComponent("pelvic",id); addChild(this.displayItem1); this.displayItem1.x = -0.35; this.displayItem1.y = 10; this.displayItem2 = this.getMCSComponent("torso",id); addChild(this.displayItem2); this.displayItem2.y = -2; this.displayItem3 = this.getMCSComponent("uparm",
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L6 — one art pipeline, not two; icon offsets are published numbers, so no icon-authoring pass is needed.

### `items-equipment/paperdoll-is-13-slots-not-9` — PARTIAL [A1] ⚑ OVERTURNS LEDGER

The frame shows exactly 9 paperdoll boxes so the ledger's UI claim is right, but the equipment MODEL is a Vector.<Item>(13) with 13 named EQ_ constants of which 11 are passed to the renderer — a builder coding '9 slots' from the ledger loses hair, head and scabbard. FRAME AND DOC DO NOT DISAGREE HERE; the doc is simply describing the UI and silently omitting the model.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (170,240)-(870,1040) upscaled x2 LANCZOS — 9 boxes: hat(filled) mask(empty) armor(filled) gloves(empty) pants(filled) weapon/pickaxe(filled) ring-left(empty) shoes(filled) ring-right(empty); corroborated by A2 reference/decompiled/shs3_android/scripts/StatsManager.as:108, :262-286, :724-738, :1765`
- **Quote:** Visible in the crop: a 'GUEST' fighter surrounded by exactly nine slot boxes — straw hat, oni mask outline, grey haori, gauntlet outlines, white hakama, pickaxe, ring outline, sandals, ring outline. Code side: public static var equipment:Vector.<Item> = new Vector.<Item>(13); EQ_ARMOR 0 · EQ_GLOVES 1 · EQ_HAIR 2 · EQ_HAT 3 · EQ_HEAD 4 · EQ_MASK 5 · EQ_NECK 6 · EQ_PANTS 7 · EQ_SHOES 8 · EQ_WEAPON 9 · EQ_SCABBARD 10 · EQ_ACCESSORY1 11 · EQ_ACCESSORY2 12; player.initMCS(equipment[EQ_ARMOR],equipment[EQ_GLOVES],equipment[EQ_HAIR],equipment[EQ_HAT],equipment[EQ_HEAD],equipment[EQ_MASK],equipment[EQ
- **Overturns:** "**Ready:** 9-slot paperdoll; 4 rarity tiers;"
- **Lane impact:** L5 (UI/HUD) + L6 (art) — the bullet must read '9 UI boxes over a 13-slot equipment model, 11 of which render'. PARTIAL because the 9 is correct for the UI.

### `items-equipment/sell-price-corrects-section3-item9` — HELD [A2] ⚑ OVERTURNS LEDGER

The same formula corrects §3 correction #9: sell price scales with MODIFIER COUNT and a single weight>=10 step — it does NOT scale with level at all (5c = 0 mods weight<10; 25c = 4 mods weight<10).

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593`
- **Quote:** if(this.getWeight() >= 10) { return (1 + this.getModifierCount()) * 10; } return (1 + this.getModifierCount()) * 5;
- **Overturns:** "**Sell price is NOT flat per item** — it scales with rarity/level (same sword 5c and 25c). Don't encode flat-per-type."
- **Lane impact:** L4 (economy) — a builder encoding a level term implements a different curve; the observed 5c/25c pair is fully explained by modifier count alone.

### `items-equipment/sell-price-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker 3 (sell-price formula) is held exactly and in BOTH builds: sell = 1 for id<3000, else (1 + modifierCount) * 10 when weight>=10, else (1 + modifierCount) * 5.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593; web v0.717 reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1977-1988`
- **Quote:** public function getSellAmt() : int { if(this.itemID < 3000) { return 1; } if(this.getWeight() >= 10) { return (1 + this.getModifierCount()) * 10; } return (1 + this.getModifierCount()) * 5; }
- **Overturns:** "③ sell-price formula."
- **Lane impact:** L4 (economy) + items — closes the shared economy/items sell-price gap with a two-build-confirmed formula; no INFERRED seed needed.

### `items-equipment/soul-infusion-is-code` — HELD [A2] ⚑ OVERTURNS LEDGER

Soul-infusion / stat-transfer is exact code, not a patch-note inference: the gate is floor(id/1000) equality, modifiers copy wholesale from the stats item, weapons get the damage delta as modifier id 6 (Attack), durability follows the stats item and colour follows the design item.

- **Cite:** `reference/decompiled/shs3_android/scripts/CraftingUI.as:494-525`
- **Quote:** var designType:int = Math.floor(this.designSlot.itemID / 1000); var statsType:int = Math.floor(this.statsSlot.itemID / 1000); if(designType != statsType) { this.noCombine(LangManager.getString(698)); return; } ... combinedItem.copyModifiers(this.statsSlot.getItem().modifiers); if(designType == 13) { ... combinedItem.addModifier(6,statsMinDamage - designMinDamage); ... combinedItem.uses = this.statsSlot.getItem().uses; } combinedItem.setPrimaryColor(this.designSlot.getPrimaryColor());
- **Overturns:** "soul-infusion + stat-transfer rules (patch-note-sourced)"
- **Lane impact:** L4 (economy/crafting) — upgrades a patch-note paraphrase to executable rules; the ledger's Ready bullet understates what is held.

### `items-equipment/sprite-compositing-contract-held` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker 5 is dead: MCSCharacter declares 27 named part indices whose index IS the addChild z-order, one equipment slot drives many parts (armor=7, pants=5), and the symbol-lookup contract is class name = partType + <art> with a partType+"0" fallback.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:10-62, :141-146, :581-607, :915-924; cross-confirmed by reference/decompiled/shs3_payload/scripts/torso4000.as, stomach4000.as, uparm4000.as, lowarm4000.as, pelvic4000.as, crotch11000.as, thigh11000.as, calf11000.as, foot12000.as, hand5000.as, hair6000.as, hat7000.as, head8000.as, mask9000.as, neck10000.as, weapon13000.as, prop13000.as`
- **Quote:** public static var PART_l_hand:int = 0; ... PART_weapon:int = 3; ... PART_torso:int = 15; ... PART_r_lowarm:int = 20;  /  for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }  /  if(getDefinitionByName(partType + art.toString())) ClassDefinition = Class(getDefinitionByName(partType + art.toString())); else ClassDefinition = Class(getDefinitionByName(partType + "0"));
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L6 (art/animation) — removes the named from-scratch-art blocker for equipment rendering; the z-order table and the 11 naked-default part IDs (head 8000, mask 9000, hair 6001/6000, hat 7000, neck 10000, armor 4000, shoes 12000, pants 11000, gloves 5000, weapon 13000, prop 13000) are directly codeable.

### `items-equipment/stat-vs-level-curve` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker 1 is held twice over: a complete 158-row static weapon ladder in itemdata.xml (minlvl -4..79) AND the generated-affix roll formula tier = clamp(nodelvl+1, 0, 79) with five progression arrays and a levelrestriction subtraction on the item's signature stat.

- **Cite:** `reference/extracted/itemdata.xml:7906-7915 and :9925-9937; reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-183, :321-347, :465-490`
- **Quote:** <item><id>13002</id><type>9</type><name>4041</name><baseprice>0</baseprice><minlvl>-4</minlvl><mindamage>1</mindamage><maxdamage>2</maxdamage><weight>1</weight></item>  ...  <item><id>13225</id><type>9</type><name>4161</name><minlvl>79</minlvl><mindamage>81</mindamage><maxdamage>90</maxdamage><slashusage>72</slashusage><stancerestriction>6</stancerestriction><weight>10</weight><art>13205</art><uses>60</uses></item>  /  var tier:int = nodelvl + 1; if(tier < 0) tier = 0; else if(tier > MAXINDEX) tier = MAXINDEX; if(getHighestTier) { tier = this.rng.rand(4) + tier - 3; ... } tier = this.rng.rand(
- **Overturns:** "① item stat-magnitude **vs level** curve."
- **Lane impact:** L4/L7 — no extrapolation needed for the L-4..L79 weapon ladder; the per-tier affix magnitudes (prog1 attack/defense, prog2 maxhp/maxchi, prog3 elemental+regen+crit, prog4 speed, prog5) are exact, including the +10 spike at index 79.

### `items-equipment/weight-cap-is-a-base-not-a-cap` — HELD [A2] ⚑ OVERTURNS LEDGER

'Weight cap 100' is the guest BASE, not a constant: carrying capacity is 100 + stat1009*20, and bank storage is a separate upgradeable cap of 100 + DAN*10 + PAIDSTORAGE*10.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2298-2301 and BankUI.as:264; A1 corroboration reference/frames/s21_weapon/t708.0.png crop (1400,540)-(1780,600) upscaled x4 reads "WEIGHT: 43 / 100"`
- **Quote:** public static function getCarryingWeight() : int { return 100 + getStat(1009) * 20; }  /  this.storageMaxWeight = 100 + StatsManager.getPlayerStats(StatsManager.STAT_DAN) * 10 + StatsManager.getPlayerStats(StatsManager.STAT_PAIDSTORAGE) * 10;
- **Overturns:** "weight cap 100"
- **Lane impact:** L4 (economy) + L5 (UI/HUD) — two distinct upgradeable caps where the ledger records one constant; the frame's 100 is the stat1009=0 case.

### `items-equipment/condition-tier-thresholds` — HELD [A2]

The condition ladder is 7 named states with exact thresholds (uses==0, uses==1, ==0, <25, <50, <75, else), names resolved via the S0-3 string table, and the 25/50/75 ladder is present in the web v0.717 build too.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:712-746 + docs/gauntlet/L0/index/strings.json ids 387-392,639; web v0.717 reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1011,1015,1019`
- **Quote:** if(this.uses == 0) { conditionStr = LangManager.getString(639); } else if(this.uses == 1) { conditionStr = LangManager.getString(392); } else if(condition == 0) { conditionStr = "<font color=\"#FF0000\">" + LangManager.getString(387) + "</font>"; } else if(condition < 25) { ...388 } else if(condition < 50) { ...389 } else if(condition < 75) { ...390 } else { ...391 }   [639="Unbreakable" 392="Condition: Well-Maintained" 387="Condition: Broken" 388="Condition: Poor" 389="Condition: Used" 390="Condition: Usable" 391="Condition: Good"]
- **Lane impact:** L5 (UI/HUD) + items — the ledger listed only 'condition tier names' as Ready; the numeric thresholds and the red-wrap on Broken are now exact.

### `items-equipment/eq-comparison-frame-payload-identity` — HELD [A1]

The (EQ:n) comparison UX is confirmed to the hex AND the frame's item resolves exactly to a payload row: the frame's BRANCH / DMG 1-2 / WEIGHT 1 is itemdata.xml id 13002 name 4041 -> strings.json "Branch", mindamage 1 maxdamage 2 weight 1, with the red 2 explained by compareValue's a<b branch.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (1320,240)-(1620,320) upscaled x4; matched to reference/extracted/itemdata.xml:7906-7915 and docs/gauntlet/L0/index/strings.json["4041"]; formula at reference/decompiled/shs3_android/scripts/Item.as:759-770`
- **Quote:** Visibly in the crop: "DMG: 1 - 2 (EQ: 1 - 3)" with the 2 rendered red, and "WEIGHT: 1", under the item name "BRANCH" and the label "LEVEL 1". Code: internal function compareValue(a:int, b:int) : String { if(a > b) { output = "<font color=\"#00A606\">" + String(a) + "</font>"; } else if(a < b) { output = "<font color=\"#FF0000\">" + String(a) + "</font>"; }
- **Lane impact:** L5 (UI/HUD) — supplies the two comparison hexes (#00A606 green / #FF0000 red, both present in the web build) and is the cleanest frame-to-payload identity check in this system: an on-screen tooltip reproduced exactly by an XML row.

### `items-equipment/modifier-id-stat-table` — HELD [A2]

The modifier-ID -> stat-name table is fully resolved (17 stat channels 0-16 plus a Set band 101-1999 and six reserved non-stat IDs), using the S0-3 string table.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:231-298 + docs/gauntlet/L0/index/strings.json ids 59,63,64,102,108-125`
- **Quote:** case 0: tempString += LangManager.getString(110); ... case 16: tempString += LangManager.getString(122); ... default: if(int(this.modifierXML[q].id) < 2000 && int(this.modifierXML[q].id) > 100) { tempString += LangManager.getString(123) + ": " + this.modifierXML[q].id; }   [110=HP 111=Max HP 112=HP Regen 113=Chi 114=Max Chi 115=Chi Regen 116=Attack 117=Defense 118=Speed 119=XP 120="Level " 63=Coins 64=Gold 102=AP 121=Max AP 59=Duel Tokens 122=Max Duel Tokens 123=Set 124=Level Required 125=Stance Restriction]
- **Lane impact:** L4/L7 — the 412 <modifier> rows in itemdata.xml (34 distinct IDs) become readable stat grants instead of opaque numbers; also names the reserved IDs 80/81/82/83/89/125 that are colour/uses/durability-bonus/name/creator rather than stats.

### `items-equipment/per-item-art-payload-unknown` — STILL_UNHELD [STILL_UNHELD]

Whether the vector symbols for the full 982-row item roster exist in the web SWF under obfuscated names or only inside the encrypted CWS-prefixed Android resource blobs is not established — the naming CONTRACT is held, the ART PAYLOAD is not.

- **Lane impact:** L6 (art) — the residual real blocker for this system. Lead (not an artifact): getMCSComponent's ResourceManager branch fires when StatsManager.useExternalResource is true, and S0-5 lists 115_Mobile_SHS3Resource and 124_Mobile_ImageResource as held-but-encrypted; neither was opened, so no recovery claim is made.

### `items-equipment/purple-border-is-unique-not-rarity` — HELD [A2]

The purple item border visible in the frame is the UNIQUE flag, not a rarity tier — the game's own tip string says so verbatim.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:572; visual corroboration reference/frames/s21_weapon/t708.0.png crop (900,590)-(1640,960) upscaled x2 — 2 of 7 inventory icons carry a purple border, sampled border pixel RGB(144,102,203)`
- **Quote:** str = "Tip: A purple border indicates that an item is unique.";
- **Lane impact:** L5 (UI/HUD) — prevents mis-wiring the border colour to the 4-tier rarity ladder; border tracks <unique>, text colour tracks the 4 tiers. Sampled hex is approximate (video compression); the code string is the authority.

### `items-equipment/rarity-is-derived-not-a-field` — HELD [A2]

The '4 rarity tiers' are real but DERIVED at read time from unique-flag + modifier count — there is no rarity field in itemdata.xml — and all six tier colours are byte-exact and confirmed in the WEB v0.717 build, not just Android.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:382-405 and :417-451; web v0.717 reference/decompiled/shs3_payload/scripts/§1t17s0§.as:683,687,691,704,708,712`
- **Quote:** if(itemxml != null && itemxml.unique == 1 || this.isPickableQuestItem() || isTradeQuestItem || this.isPlayerNamed()) { return "unique"; } if(modifierCount >= 3) { return "rare"; } if(modifierCount > 0) { return "special"; } return "normal";  /  loot toast: #b048f8 unique · #0080ff rare · #1eff00 special · #FFFFFF normal ; inventory: #6600cc unique · #003399 rare · #336600 special · #000000 normal
- **Lane impact:** L5 (UI/HUD) — supplies byte-exact tier colours in two palettes and removes the S0-3 Android-parity caveat for them. Also surfaces a third state the ledger does not know: itemdata.xml has 253 rows <unique>1</unique> and 116 rows <unique>2</unique> (counted this run), and 2 passes every ==1 test as not-unique while failing every ==0 test.

### `items-equipment/slashusage-stancerestriction-omitted` — HELD [A2]

itemdata.xml carries two items-owned combat inputs the ledger block never mentions: 106 <slashusage> rows with exactly three values 24/72/96 (default 48) and 53 <stancerestriction> rows with values 4 and 6.

- **Cite:** `docs/gauntlet/L0/index/itemdata.json paths itemdata/item/slashusage and itemdata/item/stancerestriction; reference/decompiled/shs3_android/scripts/XMLItem.as:152-167; StatsManager.as:1921-1930 and :1915-1919`
- **Quote:** if(xml.slashusage.toString() != "") { this.slashusage = xml.slashusage; } else { this.slashusage = 48; }  /  internal static function getSlashUsage() : int { var itemdata:XMLItem = QuestEngine.getItemData(equipment[EQ_WEAPON].itemID); if(itemdata == null || itemdata.slashusage < 48) { return 48; } return itemdata.slashusage; }  /  getBaseSlashLengthVal: var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5; return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
- **Lane impact:** L1 (combat core / reach) — the weapon slash-meter budget and the stance gate are items-owned numbers absent from the items block entirely; the reach formula 120 + floor((90 + DAN*5) * speed/(20+speed)) is an A2 hand-off to the combat lane.

### `items-equipment/ui-slot-mapping-unknown` — STILL_UNHELD [STILL_UNHELD]

Which of EQ_NECK / EQ_ACCESSORY1 / EQ_ACCESSORY2 the two visually identical empty ring boxes in the paperdoll map to cannot be established from the frames or the AS3 I read.

- **Lane impact:** L5 (UI/HUD) — one unresolved slot label; the 9-box layout itself is frame-confirmed, only the identity of two boxes is open.

## meta-social — re-scored 78

31/100 is badly stale. Of the four §4 blockers: ② (map topology) is fully closed at BOTH scales — a 6×6 sector board plus a world board that is a 63×72 GIF byte-identical across the web and Android payloads (735 land territories); ③ (achievements / daily-reward / token numbers) is closed outright with 61 resolved achievements, the full 36/6/10-slot daily prize tables, and both token pools quantified; ① (server sim) is closed on MECHANICS (deploy = 100×terrain-mod, arrows = 80+rand40×mod, 7-row terrain table, structure costs, 11-rank curve, 24h advance, 39-wave battle table) and open only on hosted state; ④ (offline gold faucet) is NOT unclosable as both the ledger and the first survey pass claimed — doRebirth grants 5 Gold per rebirth and 20 at Dan 8, a 60-Gold lifetime ceiling the client itself uses as its paid-player test. Both disputed "Ready" numbers are now positively resolved: "kill cap 350" is measurably 351 (340 troops + 11 samurai, identical in web and Android), and "flag +120%" is the terrain table's case-1 row wearing the wrong label — there is no control-point deploy bonus at all. Held back from higher by three real gaps: war-rules page 7 (desktop string ids 11016/11017, above the Android table's 9010 ceiling), no frame anywhere in the 100-frame map segment showing the 6×6 board itself, and the entire duel/leaderboard/friends/custom-clan surface that was never in scope when 31 was computed.

### `meta-social/achievements-61-resolved` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ③'s achievements third is dead without a Ruffle session: all 61 achievements resolve to names, descriptions, tracked stat ids and thresholds.

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin (<achievementdata>, 61 <achievement> rows) resolved through docs/gauntlet/L0/index/strings.json`
- **Quote:** First row verbatim: `<achievement><id>0</id><img>1</img><name>8000</name><desc>8080</desc><stat>60000</stat><val>1</val></achievement>` → "Duelist I — Win an online duel." Others: id 45 stat 60022 val 10 "Chi Master — Learn all Chi Skills."; id 46 stat 60023 val 9 "Ninja Master — Learn all Ninja Skills."; id 58 stat 60018 val 340 "Warrior III — Defeat 340 in a war room attack."; id 60 stat 60025 val 1 "Be Awesome — Completed Season 1".
- **Overturns:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** L0 meta-social — also pins the skill-tree shape for L-skills (10 Chi skills, 9 Ninja skills) as a side effect.

### `meta-social/daily-reward-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The full daily-login reward system is on disk: a 24h cooldown, a 36-outcome base roll, a 6-outcome bonus every 10th consecutive day and a 10-outcome super-bonus every 30th, with a global chat announcement on each bonus tier.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1139-1375 (case "dailyprize")`
- **Quote:** `:1152 StatsManager.setStat(30018,QueryManager.instance.getServerTime() + 24 * 60 * 60);` `:1153 if(streak > 1 && (streak - 1) % 30 == 0)` → `dice = Math.random() * 10` over items 2130,2131,2132,2133,2135,2136,2137,2138,2139,2146; `:1207 else if(streak > 1 && (streak - 1) % 10 == 0)` → `dice = Math.random() * 6` over 1000 coins / 2101 / 2105 / 2126 / 2127 / random level-scaled item; base `:1247 dice = Math.random() * 36` → `dice <= 4` 100 coins, 5 → 200, 6 → 300, 7 → random item, 8-35 fixed item ids. Corroborated by strings 843 "Every 10 consecutive days: bonus prize!" and 844 "Every 30 consec
- **Overturns:** "③ achievements list, daily-reward table, token costs — one Ruffle session closes all."
- **Lane impact:** L0 meta-social — closes the daily-reward third of blocker ③ with the exact probability tables.

### `meta-social/flag-120-is-mislabelled-terrain-row` — HELD [A2] ⚑ OVERTURNS LEDGER

"flag +120%" is not a flag bonus at all — it is the case-1 row of getTerrainModifier (one step of terrain advantage); the only structure modifier in the payload is toValue += 2 for a completed Barricade, City or Castle, which can push an attacker down to 0.25x.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:2281-2307`
- **Quote:** `if(this.selectedHex.hextype == WarHex.HEX_DEFENSE && this.selectedHex.cost == 0 || this.selectedHex.hextype == WarHex.HEX_CITY || this.selectedHex.hextype == WarHex.HEX_CASTLE){ toValue += 2; } switch(fromValue - toValue){ case 2: return 1.5; case 1: return 1.2; case 0: return 1; case -1: return 0.75; case -2: return 0.6; case -3: return 0.5; case -4: return 0.25; }` — with `deployvalue = 100 * this.getTerrainModifier();` at WarHexUI.as:1052. HEX_CONTROLPOINT never appears in this function.
- **Overturns:** "flag +120%"
- **Lane impact:** L0 meta-social — kills a phantom number and replaces it with the real defender modifier the ledger omits entirely; the three neighbouring master-reference deploy rows (+60/+100/+75) are proven exact by the same table.

### `meta-social/offline-gold-faucet-exists` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Blocker ④ is NOT unclosable: rebirth is an offline premium-Gold faucet at exactly 5 Gold per rebirth and 20 at the Dan 8→9 rebirth — 60 Gold lifetime — and the client itself treats >60 Gold below Dan 9 as proof of purchase.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2195-2208 and reference/decompiled/shs3_android/scripts/OverworldHUD.as:1333`
- **Quote:** StatsManager.as:2195 `public static function doRebirth() : *` … :2203 `changeStat(STAT_HGOLD,20);` … :2207 `changeStat(STAT_HGOLD,5);`. OverworldHUD.as:1333 `if(StatsManager.getStat(StatsManager.STAT_HGOLD) > 60 && StatsManager.getStat(StatsManager.STAT_DAN) < 9)` — 8 rebirths × 5 + 20 = 60, the exact free ceiling. This also contradicts docs/research/KONGREGATE_FORUM_FINDINGS.md:399 "Rebirthing = 25 FREE Gold" — payload over forum memory.
- **Overturns:** "④ offline gold faucet rate (primary source was dead IAP)"
- **Lane impact:** L0 meta-social — overturns both the ledger blocker and the FIRST survey pass's verdict ("there is none in the client… Blocker ④ stands as written"), which searched addLootGold and missed changeStat(STAT_HGOLD, …).

### `meta-social/section6-live-clan-war-overbroad` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

§6's "the live clan-war is structurally unrecoverable" is over-broad: only the hosted population and the authoritative tick are gone — every rule of the clan war is client-side and now readable.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:1052 (deploy), :1104 (arrows), :2281-2307 (terrain), WarHexUIBuildMenu.as:185-213 (costs), StatsManager.as:162,824-1013 (ranks), string 376 (24h)`
- **Quote:** WarHexUI.as:1052 `deployvalue = 100 * this.getTerrainModifier();` · :1104 `num = 80 + Math.random() * 40 * this.getTerrainModifier();` · string 376: "- Troops will advance on enemy sectors every 24 hours. - If a sector has more attacking troops than defending troops, the sector will be captured by the attackers. - The Clan that captures all the control points in the battlefield will gain control of the territory."
- **Overturns:** "**The live clan-war** — warring alongside thousands of real players is impossible offline; scope out or build a *new* AI-driven sim."
- **Lane impact:** L0 meta-social — the scoping decision (offline AI sim) stays right, but it must be built to the ORIGINAL numbers, not authored ones.

### `meta-social/six-actions-understated` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

"War-Room 6 actions" is correct as the in-game rulebook's count but wrong as a move budget: the client spends a war move at ten distinct sites, adding build-HQ, demolish-HQ and castle assault.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as lines 1049, 1177, 1210, 1279, 1304, 1386, 1654, 1771, 2420, 2471`
- **Quote:** Ten occurrences of `OverworldHUD.instance.warUI.useWarMove(1);` — versus rulebook string 372: "Moves can be used to deploy troops, attack enemy troops, move to a different sector, spy on the enemy or build structures." (5) plus the blocked-neighbour arrow branch (6).
- **Overturns:** "War-Room 6 actions + 11-rank ladder (moves/hr + thresholds)"
- **Lane impact:** L0 meta-social — anyone implementing the move economy needs ten operations, not six.

### `meta-social/structure-costs-and-donation-rate` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Structure costs are exact — Forward Base 10000, Tunnels 5000, Barricades 10000, Village→Town 10000, Command HQ free — and the ledger's "500 coins/turn" donation cap is really 500 coins per build MOVE, so a War Hero can contribute 3,000 per turn.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUIBuildMenu.as:185-213 + WarHexUI.as:1291,1332 + WarHex.as:424,477,521,540`
- **Quote:** WarHexUIBuildMenu.as getDesc rows: `str += "- " + LangManager.getString(566) + 10000 + " " + LangManager.getString(63)` for HEX_FORWARDBASE, `+ 5000` for HEX_LADDER (Tunnels), `+ 10000` for HEX_DEFENSE (Barricades) and HEX_TOWN; HEX_SPAWNPOINT (Command HQ) carries no cost line. WarHexUI.as:1291 `buildcost = 500;` gated on `StatsManager.getStat(StatsManager.STAT_WARMOVES) > 0 && StatsManager.getStat(StatsManager.STAT_GOLD) >= buildcost`. Ledger source SHSD_MASTER_REFERENCE.md:171 says "Build donation cap | 500 coins/turn".
- **Overturns:** "Build donation cap | 500 coins/turn"
- **Lane impact:** L0 meta-social — the move economy is off by a factor of 3-6 as written; also newly pins the castle gate window at 3*60*60 s (WarHex.as:499,507,513).

### `meta-social/two-token-pools-quantified` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's "two token types" bullet resolves to two fully specified pools — AP (30/30, 1 per 60 s) and Duel Tokens (start 20, hard cap 30, 1 per 120 s) — each with a x2 regeneration buff.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:158,160,166,707,709,710 and :1101,:1134`
- **Quote:** `:158 internal static var APINTERVAL:int = 60;` `:160 internal static var DTINTERVAL:int = 2 * 60;` `:166 internal static var MAXDUELTOKENS:int = 30;` `:707 setPlayerStats(STAT_AP,30);` `:709 setPlayerStats(STAT_DUELTOKENS,20);` `:710 setPlayerStats(STAT_MAXDUELTOKENS,20);` and `:1101 if(StatsManager.hasBuff(StatsManager.BUFF_AP)) diff *= 2;`. Naming trap: STAT_GOLD=11 is the COIN stat (string 63 = "Coins"); the premium currency is STAT_HGOLD=12 behind getHeavenlyGold() and <heavenlyprice>.
- **Overturns:** "achievements/daily/token numbers"
- **Lane impact:** L0 meta-social — completes blocker ③'s token third; the first survey pass covered only Duel Tokens.

### `meta-social/war-kill-cap-351` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's "kill cap 350" is measurably 351 — 340 rank-and-file troops plus 11 named samurai — summed over the 39-wave war-room battle table, identical in the web v0.717 and Android payloads.

- **Cite:** `reference/extracted/bindata/119_1t4646s0.bin (web v0.717 <survivalmodedata>, first <wave> at line 3, 39 waves) + reference/decompiled/shs3_android/scripts/WarHexUI.as:1711-1720`
- **Quote:** WarHexUI.as:1719 `var xml:XML = XML(new SurvivalModeData());` — and summing every <qty> in bindata/119: qty by id-block {400: 340, 700: 11} total 351. Wave head verbatim: `<enemy><id>400|401|402|403|404</id><qty>4</qty><x>-50</x></enemy>`. The 700 block is 11 distinct ids 700-710 at qty 1 each.
- **Overturns:** "kill cap 350"
- **Lane impact:** L0 meta-social — turns a STILL_UNHELD Ready bullet into a measured number and corrects it by one; also gives the war-room battle its full 39-wave enemy composition.

### `meta-social/world-board-63x72-byte-identical` — HELD [A3] ⚑ OVERTURNS LEDGER

Blocker ②'s world half is closed: the strategic war board is a 63x72 two-colour GIF mask with 735 land territories, and the web and Android copies are byte-identical, so the claim carries no Android caveat.

- **Cite:** `byte-check: reference/extracted/bindata/92_1t4648s0.bin vs reference/extracted/android/110_Mobile_MapBitmapData.bin`
- **Quote:** web  b'GIF89a' 63 72 272 bytes sha256 b9d152c046b66b59… / andr b'GIF89a' 63 72 272 bytes sha256 b9d152c046b66b59… / identical: True — decoded palette is 2 colours, 735 non-black pixels of 4536. Consumer: WarSelectUI.as:83-85 `internal var mapWidth:int = 63; internal var mapHeight:int = 72;` and :173 `return this.mapBitmapData.getPixel(territoryx + TERRSHIFTX - WARMARKERSHIFTX,territoryy + TERRSHIFTY) != 0;`
- **Overturns:** "server-sim topology; map board; achievements/daily/token numbers; offline gold faucet"
- **Lane impact:** L0 meta-social — the §2 table's "map board" gap is dead; combined with the 6x6 sector generator the whole topology is now 735 territories → 6x6 sectors → 4-way [N,S,E,W] exits.

### `meta-social/xp-curve-l11-80-recovered` — HELD [A2] ⚑ OVERTURNS LEDGER

CROSS-LANE (progression), but it is a §6 line: the "L11–80 XP curve, likely unrecoverable" is a 99-entry array in the payload, and level 80 is exactly the rebirth gate.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:78`
- **Quote:** `public static var expArray:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,…,25395800,29395800];` — 99 entries; expArray[9]=25900, expArray[10]=31400 (the L11+ cliff), expArray[79]=4025800. String 4155: "New Game +\nProgress on to the next Dan Rank and specialize in an element. \nLevel 80 required."
- **Overturns:** "**L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L1/L-progression — retires a §6 "structurally unrecoverable" line and the §2 note "L11–80 curve (likely unrecoverable)"; the labeled-INFERRED extrapolation in src/config/xp.ts can be replaced with measured values.

### `meta-social/chikako-affinity-meter` — HELD [A2]

An entire meta-social loop the ledger never mentions: the Chikako affinity meter, a 5-level ladder fed 1 point per premium Gold spent plus achievement score, which pays out as random Gold refunds — the one place achievements have a mechanical payout.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI_chikako.as:24-26,40 + StatsManager.as:2719-2724 + NetworkManager.as:2306-2315`
- **Quote:** InteractUI_chikako.as:24 `internal var expArray:Array = [0,10,30,60,100,150];` :26 `internal var maxLevel:int = 5;` :40 `return StatsManager.getPlayerStats(StatsManager.STAT_CHIKAKOLOVE) + QuestEngine.getAchievementScore();`. StatsManager.as:2722-2723 `changeHeavenlyGold(-num,callbackSuccess,callbackError); changeStat(STAT_CHIKAKOLOVE,num);`. NetworkManager.as:2306 `else if(m.type == "refunded")` → `showChikakoRefund()`. String 723: "Tip: Use Ninja Services or unlock achievements to impress Chikako and increase your chances for a \"Chikako Refund\"!"
- **Lane impact:** L0 meta-social — the 31/100 was scored over a smaller system than exists; this changes how achievements must be scoped (mechanical, not cosmetic).

### `meta-social/four-clans-named-led-located` — HELD [A2]

The four canonical clans are fully bound to names, daimyo, compass domains and side numbers — closing the first survey pass's STILL_UNHELD #3 and grounding the ledger's "4 clans (heraldry/masks/daimyo/capitals)" Ready bullet in A2 evidence.

- **Cite:** `docs/gauntlet/L0/index/strings.json ids 271-278 and 324-327 + reference/decompiled/shs3_android/scripts/WarHexUI.as:1077-1089`
- **Quote:** id 275-278: "Clan Aka Ryu" / "Clan Midori Ken" / "Clan Aoi Hoiru" / "Clan Ki Sensu". id 324: "Clan Aka Ryu is led by Lord Tsuyoshi… rules the domain in the North-East." id 325: "…led by Lord Daichi… rules the domain in the South-East." id 326: "…led by Lord Yoshio… rules the domain in the South-West." id 327: "…led by Lady Tsubasa…". Side colours WarHexUI.as:1077-1089: 16711680=0xFF0000 red, 39168=0x009900 green, 26367=0x0066FF blue, 16776960=0xFFFF00 yellow — i.e. Aka Ryu (red dragon), Midori Ken (green sword), Aoi Hoiru (blue wheel), Ki Sensu (yellow fan), same order.
- **Lane impact:** L0 meta-social — side n ↔ clan n is now fixed, which is required before any clan-coloured render or war-sim can be built.

### `meta-social/frame-prints-coordinate-system` — HELD [A1]

A longplay frame prints the live war-map coordinate system — TERRITORY (24,52) SECTOR (3,0) — independently confirming the 63x72 territory grid and the 0..5 sector board decoded from code.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0090.jpg, crop (255,140)-(400,165) upscaled x12 LANCZOS`
- **Quote:** Visibly on screen: "KAKUCHI CASTLE TOWN, MAIN STREET / TERRITORY (24,52) SECTOR (3,0)" — and in the same panel a reward line "TOWN PROSPERITY: +10". x=24 ≤ 62 and y=52 ≤ 71 both sit inside the 63x72 mask; sector (3,0) sits inside 0..5.
- **Lane impact:** L0 meta-social — A1 corroboration for the A2 topology claim, plus surfaces "town prosperity", a town-conversion currency absent from the §4 block.

### `meta-social/frame-proves-string-table-parity` — HELD [A1]

A v0.717 longplay frame renders Android string 370 word-for-word including the original's grammatical error "you can may select", proving the Android string table is v0.717's own copy; the same frame's header reads 1/7 where the Android source says max = 6, and the FRAME WINS.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0084.jpg, crops (100,50)-(420,250) x5 and title strip (100,30)-(420,70) x6`
- **Quote:** On screen: "…ES 1/7 (JOINING A BATTLE)" / "…IS A CLAN-BASED STRATEGY GAME WITHIN STRAW HAT SAMURAI: DUELS." / "…A CLAN, YOU CAN MAY SELECT AN ON-GOING BATTLE TO TAKE PART IN." / "…TTLES WILL BE MARKED ON THE WAR ROOM MAP WITH YOUR CLAN'S FLAG." — versus reference/decompiled/shs3_android/scripts/WarRules.as:23 `internal var max:int = 6;`. STANDING INVARIANT APPLIED: the measurement source (Android decompile) and the frame disagree on page count, and the frame wins — v0.717 has seven pages.
- **Lane impact:** L0 meta-social — this is the calibration artifact for every Android-sourced string in the lane; a typo is a fingerprint. Also independently reproduces the first pass's 1/7 finding from a frame file rather than a video timecode.

### `meta-social/kisensu-domain-typo-in-shipped-data` — HELD [A2]

The shipped game data contains a quadrant bug: Ki Sensu is described as ruling the North-East, the same quadrant already assigned to Aka Ryu, leaving North-West vacant — a 1:1 recreation must decide to reproduce or knowingly fix it.

- **Cite:** `docs/gauntlet/L0/index/strings.json ids 324 and 327 (from reference/extracted/android/118_Mobile_Lang_EN.bin)`
- **Quote:** 324: "Clan Aka Ryu rules the domain in the North-East." / 327: "Clan Ki Sensu rules the domain in the North-East." — with 325 South-East and 326 South-West, North-West is unassigned.
- **Lane impact:** L0 meta-social — a fidelity decision the ledger's "capitals" bullet hides; needs an owner ruling before the world map is authored.

### `meta-social/ninja-services-priced-catalogue` — HELD [A2]

"Ninja-Services prices" upgrades from a bullet to a 12-row priced catalogue read out of the WEB v0.717 itemdata.xml, including the clan-economy SKUs and two currency conversion rates.

- **Cite:** `reference/extracted/itemdata.xml lines 27, 41, 55, 374, 388, 402, 416, 430, 2267, 2327, 2379, 2393, 2402, 2445, 2461, 2479; catalogue list at reference/extracted/android/121_Mobile_PremiumData.bin`
- **Quote:** itemdata.xml:2393 item 2208 <heavenlyprice>1</heavenlyprice> → "1000 coins — Buy 1000 coins."; :2445 item 2212 heavenlyprice 5 → "Clan Deed — Form your own clan. War Hero rank required. Includes: 1 Clan General Invitations, 3 Clan Invitations"; :2327 item 2203 heavenlyprice 5 → "Writ of Release — Use this item to leave your Clan."; :27/:41/:55 items 2100/2101/2102 at 1/2/3 Gold → Small/Medium/Large Soldier Pill; :374/:388/:402 items 2125/2126/2127 at 1/2/3 Gold → 10/25/40 Duel Tokens. Rates: 1 Gold = 1000 coins (item 2208, string 609) and 1 Gold = 10 AP (string 100).
- **Lane impact:** L0 meta-social — the premium economy is now implementable without a Ruffle session; prices come from the WEB build so no version caveat applies.

### `meta-social/rank-ladder-thresholds-and-moves` — HELD [A2]

The 11-rank ladder is exact: thresholds 36/84/180/324/516/816/1176/1596/2076/5000, moves per turn 3,4,4,4,4,5,5,5,5,5,6, a turn is exactly one hour, and coin donations buy rank at 1 point per 1,000 coins.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:162, 824-1013 (getWarRank / getWarMovesToNextRank / getMaxWarMoves) + strings 330-339, 403`
- **Quote:** `:162 internal static var WARMOVEINTERVAL:int = 60 * 60;` `:826 var num:int = getStat(STAT_WARMOVESMADE) + int(getStat(STAT_WARCOINSDONATED) / 1000);` `:827 if(num < 12 * 3){ return 0; }` … getMaxWarMoves returns 3 at rank 0 and 6 at rank 10. Names ids 330-339 + 403: recruit, private, corporal, sergeant, sergeant major, lieutenant, captain, major, colonel, general, War Hero. Achievements 53/54/55 cross-check the indices: "Reach Lieutenant Rank" val 5, "Reach General Rank" val 9, "Reach War Hero Rank" val 10.
- **Lane impact:** L0 meta-social — confirms the ledger's Surface note ("moves per turn reconciles as per hour; 36 = Private's threshold") with A2 evidence rather than inference.

### `meta-social/rival-clan-ai` — STILL_UNHELD [STILL_UNHELD]

The "Rival-clan AI: Greedy strategy — reinforce weakest border, attack adjacent weaker enemy, build when Captain+ and flush" in the project's own master reference has no payload backing — the server ran the clan AI, and no war AI exists in the client.

- **Quote:** docs/research/SHSD_MASTER_REFERENCE.md:177 states the strategy, but nothing in reference/decompiled/shs3_android/scripts/War*.as or Territory*.as implements or describes an AI opponent; every war action originates from a player click and is posted to QueryManager.
- **Lane impact:** L0 meta-social — must be labelled recreation-authored design, never cited as original fidelity.

### `meta-social/survivalmode-is-the-warroom-wave-table` — HELD [A2]

Stage-0 finding S0-1's "entire game mode absent from all 12 ledger systems" is sharper than that: survivalmodedata IS the war-room battle wave table, and enemy ids are remapped per clan side into distinct NPC id blocks.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:13, 1711-1752`
- **Quote:** `:13 internal static const SurvivalModeData:Class = WarHexUI_SurvivalModeData;` `:1719 var xml:XML = XML(new SurvivalModeData());` and the remap: `if(targetside == 1){ strArray[k] = remainder + 200; } else if(targetside == 2){ strArray[k] = remainder + 400; } else if(targetside == 3){ strArray[k] = remainder + 300; } else if(targetside == 4){ strArray[k] = remainder + 500; } else if(targetside == 0 || targetside == 5 || StatsManager.isCustomClan(targetside)){ strArray[k] = remainder + 600; }`
- **Lane impact:** L0 meta-social — reassigns bindata/119 from an orphan 'survival mode' to meta-social's core battle content, and hands enemies-ai the 4-clan → NPC-id block mapping.

### `meta-social/war-rules-page-7-content` — STILL_UNHELD [STILL_UNHELD]

The content of war-rules page 7 (desktop-only, string ids 11016/11017) is not held — those ids sit above the Android string table's 9010 ceiling.

- **Quote:** The frame shows the header "1/7" but the page-7 body was never on screen in any extracted frame, and reference/extracted/android/118_Mobile_Lang_EN.bin tops out below id 9011.
- **Lane impact:** L0 meta-social — one of three remaining deductions in the 78 score.

### `meta-social/warroom-board-frame` — STILL_UNHELD [STILL_UNHELD]

No frame anywhere in the 100-frame map segment shows the war-room 6x6 board itself; every board claim in this lane rests on decompiled code plus the on-screen coordinate readout, not on a picture of the board.

- **Quote:** Checked reference/frames/Nr4fQstqHDM_map_contact.jpg (100 cells) and pulled frames 0048, 0084, 0090 at full source resolution; the longplay opens the War Room rules dialog and the quest panel, never the hex board.
- **Lane impact:** L0 meta-social — the honest ceiling on the topology claim; a denser video pass over the war-room segment is the close-path.

## progression — re-scored 88

All four of the 2026-07-20 blockers are now HELD in the payload, including the one escalated to §6 "structurally UNRECOVERABLE" (L11–80 XP curve, a 99-entry literal array present byte-identically in both the web v0.717 and Android v0.682 builds). Also newly held: post-rebirth SP closed form, flat-subtraction DEF, all three SPD transfer functions, the complete kill-XP model with grey-level/over-level cutoffs, 69 tabled quest XP rewards, a 33-gate L3–L80 unlock ladder, per-stat level caps, free total respec, and AP regen. Two "Ready" bullets were WRONG (+1AP is really +5; "80 SP first run" is really 79) and the Surface bullet's "271 cap" explanation is refuted (271 = 1+(80+10)*3, a hard per-stat UI cap, and it IS reachable in one stat). Not 100 because two genuine unknowns remain: whether levels 81–99 (18 unused expArray entries above the level-80 cap) were ever reachable, and whether a dedicated gather/mine/farm XP number exists at all (plumbing held, value not). One frame-vs-payload conflict was found and resolved in the frame's favour: the Android build is differently tuned for per-point magnitudes, so progression must be ported from the WEB payload.

### `progression/271-cap-explained` — HELD [A2] ⚑ OVERTURNS LEDGER

The "271 cap" is exactly the level-80 evaluation of the ATK/DEF/SPD cap formula 1+(80+10)*3 = 271 — a hard per-stat UI ceiling, not a gear/rebirth-inclusive total, and it IS reachable in one stat on a first run.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3344 (cap formula) + §1t1523s0§.as:362 (levelCap 80) + §1t1523s0§.as:2577 (237-point budget)`
- **Quote:** §1t5957s0§.as:3344 "< 1 + (_loc2_ + 10) * 3" · §1t1523s0§.as:362 "public static const §1t9470s0§:int = 80;" · §1t1523s0§.as:2577 "§1t7357s0§(§1t9419s0§,(getLevel() - 1) * 3);" — 1+(80+10)*3 = 271; the 237-point budget buys 271 in one stat with only 90 points because each point is +3, not +1.
- **Overturns:** "The "271 cap" is gear/rebirth-inclusive (237-point first-run budget makes it impossible in one stat) — resolvable by arithmetic now."
- **Lane impact:** L4: the Surface bullet's arithmetic is refuted; it assumed +1 per point. Replace with the cap formula.

### `progression/ap-regen` — HELD [A2] ⚑ OVERTURNS LEDGER

AP regenerates +1 per 60 seconds of server time, doubled by the AP buff, hard-stopped at MAXAP (which starts at 30 and is itself a spendable stat).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:158 and :1090-1115; web parity at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:192`
- **Quote:** StatsManager.as:158  internal static var APINTERVAL:int = 60;
StatsManager.as:1099-1103  diff = Math.floor(timeDiff / APINTERVAL) + 1; if(StatsManager.hasBuff(StatsManager.BUFF_AP)) { diff *= 2; } newAP = changeAP(diff);
§1t1523s0§.as:192  internal static const §1t9396s0§:int = 60;
- **Overturns:** "④ AP regen rate + cap."
- **Lane impact:** CROSS-LANE GIFT to L10 world-exploration blocker ④ ("AP regen rate + cap") — closed. The cap is the MAXAP stat, whose cap formula is 30+(level+10)*5 (see progression/per-stat-hard-caps).

### `progression/campaign-level-band` — HELD [A2] ⚑ OVERTURNS LEDGER

The campaign's own intended level band is tabled — 142 quest-wave enemy <lvl> rows spanning levels 2–35 (plus ally rows to 80) — so "both longplays cap at L10" is a capture limit, not a content limit.

- **Cite:** `docs/gauntlet/L0/index/questdata.json paths questdata/quest/step/wave/enemy/lvl (count 142, range 2.0–35.0), questdata/quest/step/wave/friend/lvl (count 9, range 25.0–80.0), questdata/quest/step/roomobj/property/obj/property/xml/wave/enemy/lvl (count 18, all 25)`
- **Quote:** questdata/quest/step/wave/enemy/lvl 142 [2.0, 35.0] sample_values ['11','15','17','18','2','20','22','23','25','27']
- **Overturns:** "② **L11–80 XP curve — likely unrecoverable** (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline)."
- **Lane impact:** L4: removes the stated reason for blocker ② ("both longplays cap at L10") as evidence about the game rather than about the capture. Also useful to L8 enemies-ai for level-band pacing.

### `progression/def-mitigation-is-flat` — HELD [A2] ⚑ OVERTURNS LEDGER

There is NO DEF mitigation curve: defense is flat subtraction from incoming damage, floored at the attack's own minDamage, with exactly one modifier — Heavy stance multiplies your defense by 0.8.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3284-3291 and :3484-3488 (web); clear-named at reference/decompiled/shs3_android/scripts/MCSPlayer.as:3231-3237 and :3415-3419`
- **Quote:** MCSPlayer.as:3231-3237  internal function getDefense() : int { if(this.stance == HEAVY_STANCE) { return defense * 0.8; } return defense; }
MCSPlayer.as:3415-3418  damage -= this.getDefense(); if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
§1t99s0§.as:3484-3487  _loc5_ -= this.§1t4477s0§(); if(_loc5_ < param2.§1t1088s0§()) { _loc5_ = param2.§1t1088s0§(); }
- **Overturns:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — *measure per-point deltas in a build.*"
- **Lane impact:** L4 blocker ① (DEF half) dies — and there was never a curve to find. Corroborated by the resolved string table: skill 1002 Heavy Stance Mastery desc ends "Defense -20%". Feeds L1 combat-core's damage pipeline directly.

### `progression/inferred-extrapolation-error` — HELD [A2] ⚑ OVERTURNS LEDGER

The shipped XP_DELTA_STEP=500 extrapolation is not merely INFERRED but quantifiably wrong — it under-shoots the real curve by -61.3% at level 80.

- **Cite:** `src/config/xp.ts:28 vs reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364; test tests/xp.test.ts > xpThreshold — cumulative cap to finish a level > extrapolates L11+ by growing the per-level delta by XP_DELTA_STEP (INFERRED)`
- **Quote:** export const XP_DELTA_STEP = 500;  — measured divergence: L12 real 43,500 vs inferred 43,900 (+0.9%); L20 108,000 vs 113,900 (+5.5%); L40 507,300 vs 428,900 (-15.5%); L60 1,508,800 vs 943,900 (-37.4%); L80 4,285,800 vs 1,658,900 (-61.3%)
- **Overturns:** "Keep the extrapolation as labeled INFERRED."
- **Lane impact:** L4: src/config/xp.ts must swap the extrapolation for the real 99-entry table and drop the INFERRED label; tests/xp.test.ts's extrapolation test pins a refuted model.

### `progression/per-point-magnitudes` — HELD [A1] ⚑ OVERTURNS LEDGER

Per stat point the WEB v0.717 build grants HP +10, Chi +5, AP +5, ATK +3, DEF +3, SPD +3 — the ledger's "+1AP" is wrong (it is +5); and where the Android v0.682 payload disagrees (HP+5/AP+1/stat+1), THE FRAME WINS and it matches WEB.

- **Cite:** `FRAME: reference/videos/zFtCaTO0_1M.mp4 @ t=1600s, crop=iw*0.55:ih*0.20:iw*0.42:ih*0.16 scale=1.7×; adjudicating reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3390-3445 (web) against reference/decompiled/shs3_android/scripts/InventoryUI.as:2417-2453 (android)`
- **Quote:** Web §1t5957s0§.as:3390-3445: "§1t9713s0§(§1t9419s0§,-1); §1t9713s0§(§1t9403s0§,10);" (MAXHP +10) · "…(§1t9406s0§,5)" (Chi +5) · "§1t9609s0§(5)" (addMaxAP 5) · "…(§1t9408s0§,3)/(§1t9409s0§,3)/(§1t9410s0§,3)" (ATK/DEF/SPD +3). Android InventoryUI.as:2417/2424/2431/2438/2445/2452: "changeStat(STAT_MAXHP,5)", "changeStat(STAT_MAXCHI,5)", "addMaxAP(1)", "changeStat(STAT_ATTACK,1)", "…STAT_DEFENSE,1", "…STAT_SPEED,1". FRAME at level 4 shows AVAILABLE STAT POINTS: 0 with maxHP 20, maxChi 15, maxAP 30, ATK 10, DEF 10, SPD 4 from a 9-point budget: web magnitudes cost exactly 1+1+0+3+3+1 = 9 ✓; android 
- **Overturns:** "- **Ready:** +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30)."
- **Lane impact:** L4: fixes the +1AP error. Gauntlet-wide: proves Stage-0b finding S0-3's parity caveat concretely — shs3_android v0.682 is DIFFERENTLY TUNED and must be used only as a decoder ring for symbol names; port all progression numbers from shs3_payload (web v0.717). Also closes an open INFERRED flag in docs/research/video-study/segments/A-02-...md line 25.

### `progression/post-rebirth-sp` — HELD [A2] ⚑ OVERTURNS LEDGER

The post-rebirth skill-point economy is a single closed form: SP = (level-1) + Dan*(levelCap-1) = (level-1) + Dan*79, so each rebirth permanently adds a full 79-point budget (lifetime max 790 at the Dan-9 cap).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2598 (web), clear-named at reference/decompiled/shs3_android/scripts/StatsManager.as:2156`
- **Quote:** §1t1523s0§.as:2598  §1t7357s0§(§1t9418s0§,getLevel() - 1 + §1t7356s0§(§1t9426s0§) * (§1t9470s0§ - 1));
StatsManager.as:2156  setPlayerStats(STAT_SKILLPOINTS,getLevel() - 1 + getPlayerStats(STAT_DAN) * (levelCap - 1));
- **Overturns:** "③ post-rebirth SP economy;"
- **Lane impact:** L4 blocker ③ dies. Also: doRebirth() (StatsManager.as:2195-2231) calls unAssignStatPoints() but NOT unAssignSkillPoints() — learned skills survive rebirth; only the equipped skill-slot vector resets to skillSlots[0]=IntStat(1003,1) (Jump).

### `progression/quest-xp-tabled` — HELD [A2] ⚑ OVERTURNS LEDGER

Quest XP is a table, not a formula, and it is on disk — 69 <exp> reward rows across the 61 quests, range 100–3000, attached to quest steps.

- **Cite:** `reference/extracted/questdata.xml:214-216 and :411-413; index docs/gauntlet/L0/index/questdata.json path questdata/quest/step/reward/exp (count 69, range 100.0–3000.0)`
- **Quote:** questdata.xml:214-216
    <reward>
      <exp>290</exp>
    </reward>
questdata.xml:411-413
    <reward>
      <exp>200</exp>
    </reward>
Consumed at Overworld.as:318  overworldHUD.lootDialog.addLootXP(reward.exp);
- **Overturns:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** L4 blocker ④ (quest side). Also touches L9 quests-story blocker ③ ("per-quest trigger types + coords + rewards (sampled, not tabled)") — the reward side is tabled.

### `progression/sp-first-run-off-by-one` — HELD [A2] ⚑ OVERTURNS LEDGER

First-run skill points are 79, not 80 — SP = level-1 with level capped at 80.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2598 with Dan=0, and per-level grants at §1t1523s0§.as:2074-2075`
- **Quote:** §1t1523s0§.as:2074-2075  §1t9713s0§(§1t9418s0§,1);  §1t9713s0§(§1t9419s0§,3);   // +1 skill point, +3 stat points per level — 79 levels gained L1→L80 ⇒ 79 SP and 237 stat points
- **Overturns:** "cap 80; 80 SP first run; unlock cadence;"
- **Lane impact:** L4: an off-by-one in the Ready bullet. The '+3 stat/+1 skill per level' half of the same bullet is confirmed correct.

### `progression/spd-scaling` — HELD [A2] ⚑ OVERTURNS LEDGER

All three SPD transfer functions are held verbatim — slash length (reach) = 120 + floor((90 + Dan*5)*spd/(20+spd)); slash reload = 48 + spd*6; skill cooldown multiplier = 1 - min(spd,600)/600*0.5 (WEB) vs /300 (Android drift); speed buff pre-multiplies spd by 1.5. SPD never touches damage.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2276, :2286-2296, :2344-2347 (web); clear-named at reference/decompiled/shs3_android/scripts/StatsManager.as:1841, :1854-1861, :1915-1919`
- **Quote:** StatsManager.as:1841  return 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6;
StatsManager.as:1860  return 1 - speed / 300 * 0.5;        [web §1t1523s0§.as:2295 = /600]
StatsManager.as:1917  var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
StatsManager.as:1918  return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
- **Overturns:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — *measure per-point deltas in a build.*"
- **Lane impact:** L4 blocker ① dies in full. CROSS-LANE GIFT to L1 combat-core blocker ① ("reach cap in stage px per stance — the one value the whole model needs"): the base slash-length getter is a SPD formula with a hard floor of 120 and a Dan-0 asymptote of 210, with per-stance modifiers applied on top. Also closes skills-meters blocker ④ (SPD→cooldown formula).

### `progression/xp-curve-l11-80` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete L1→L99 cumulative XP table is a literal array on disk in BOTH payloads (byte-identical), so the L11–80 curve the ledger calls "likely unrecoverable" and lists under §6 "structurally UNRECOVERABLE" is fully held.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364 (web v0.717; duplicated at §1t29s0§.as:28) and reference/decompiled/shs3_android/scripts/StatsManager.as:78`
- **Quote:** public static const §1t5923s0§:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,43500,49850,56550,63900,71900,80300,89100,98300,108000, … ,19295800,22095800,25395800,29395800];  — 99 entries; expArray[11]=37400, [20]=108000, [40]=507300, [60]=1508800, [80]=4285800, [98]=29395800
- **Overturns:** "② **L11–80 XP curve — likely unrecoverable** (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."
- **Lane impact:** L4 progression blocker ② dies outright; §6's "structurally UNRECOVERABLE" list loses the L11–80 XP curve line (line 350).

### `progression/xp-income-model` — HELD [A2] ⚑ OVERTURNS LEDGER

The full XP-income model is held: base XP per mob, a grey-level cutoff, a +3-level cutoff, symmetric under/over-level scaling, elite ×2, a sub-level-10 duellist ×3 boost, and an XP-buff ×1.5.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:166-190 (calcXP), :94-109 (getGreyLevel), :112-164 (getZeroDifference), :218/:252 (mob base xp); EnemyPlayer.as:1307-1327; LootDialog.as:640-642`
- **Quote:** NPC.as:166-190  public static function calcXP(playerLevel:int, mobLevel:int, xp:int, elite:Boolean) : * { if(mobLevel <= getGreyLevel()) { return 0; } if(mobLevel - playerLevel > 3) { return 0; } var finalXP:int = xp; if(playerLevel < mobLevel) { finalXP = xp * (1 + 0.05 * (mobLevel - playerLevel)); } else if(playerLevel > mobLevel) { finalXP = xp * (1 - (playerLevel - mobLevel) / getZeroDifference()); } if(elite) { finalXP *= 2; } return finalXP; }
NPC.as:218  this.xp = this.level * 2 + 20;   [web parity §1t4574s0§.as:39 "xp = level * 2 + 20;"]
ConnectionPIO.as:643 / §1t4902s0§.as:26  lvl * 5
- **Overturns:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** L4 blocker ④ largely dies (kill + quest sides fully held). Confirms src/config/duel.ts:55-56 XP_PER_LEVEL=5 / XP_REWARD_BASE=45 against the payload. Also feeds L7 economy blocker ① ("20+ samples show no XP formula either") — the formula is now held.

### `progression/frame-confirms-xp-caps` — HELD [A1]

Opened the primary video first-hand: the on-screen XP bar reads the payload's numbers exactly (expArray[3]=2950, expArray[4]=5150) — payload and frame AGREE, no conflict to adjudicate here.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 (video A, 1920×1080), ffmpeg -ss 1600 and -ss 655; crops crop=iw*0.55:ih*0.20:iw*0.42:ih*0.16 scale=1.7× lanczos (stat block) and crop=iw*0.55:ih*0.22:iw*0.42:ih*0.09 scale=1.8× (XP row)`
- **Quote:** Visibly in the t=1600s crop: fan level badge "4", gold XP bar "5110 / 5150" captioned EXPERIENCE POINTS, "AVAILABLE STAT POINTS: 0", HP 20 / 20 (green), CHI 9 / 15 (blue), AP 15 / 30, ATK 10, DEF 10 + 13 (the +13 orange = gear), SPD 4, WEIGHT: 73 / 100. Visibly in the t=655s crop: level badge "3", "2098 / 2950 EXPERIENCE POINTS", AVAILABLE STAT POINTS: 0, WEIGHT 38/100.
- **Lane impact:** L4: independent on-screen confirmation of the payload XP table; supplies the stat readings that arbitrate the build conflict in progression/per-point-magnitudes.

### `progression/l1-l10-caps-confirmed` — HELD [A3]

The frame-derived XP_THRESHOLDS already in config is EXACTLY the payload's expArray[1..10] — the video study got all ten right, which is what licenses trusting the frames elsewhere in this lane.

- **Cite:** `tests/xp.test.ts > XP_THRESHOLDS — the frame-backed L1–L10 table > pins all ten observed cumulative caps exactly`
- **Quote:** ✓ tests/xp.test.ts > XP_THRESHOLDS — the frame-backed L1–L10 table > pins all ten observed cumulative caps exactly 1ms
 Test Files  1 passed (1)      Tests  11 passed (11)   — config holds [550,1450,2950,5150,8350,12150,16350,20900,25900,31400], identical to expArray[1..10]
- **Lane impact:** L4: confirms the ledger's "L1–L10 XP caps" Ready bullet and upgrades it from frame-INFERRED to payload-CONTRACT.

### `progression/levels-81-99` — STILL_UNHELD [STILL_UNHELD]

Whether levels 81–99 were ever reachable is not held: expArray carries 99 entries (up to 29,395,800) but levelCap=80 gates both XP credit and level-up, and no UI, quest, item or string references a level above 80.

- **Lane impact:** L4: keeps one honest blocker on the board. Treat expArray[81..98] as dead headroom; do NOT port them as reachable levels.

### `progression/levelup-refill-and-cap` — HELD [A2]

"Full refill per level" is right and under-specified — levelUp() refills HP, Chi, AP AND duel tokens; and level cap 80 is enforced twice (XP is simply not credited past it, and a level jump past it is reported as a cheat).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:76, :1619-1628, :1646-1692; reference/decompiled/shs3_android/scripts/LootDialog.as:644-647`
- **Quote:** StatsManager.as:76 "public static var levelCap:int = 80;" · :1688 "fullHealth();" · :1689 "setStat(STAT_AP,getPlayerStats(STAT_MAXAP));" · :1690 "setStat(STAT_DUELTOKENS,MAXDUELTOKENS);" · :1619 "if(!consoleEnabled && newlevel > levelCap) { QueryManager.instance.reportHack("changeXP levelcap"); }" · LootDialog.as:644 "if(StatsManager.getLevel() < StatsManager.levelCap) { this.lootXP.changeIntValue(num); }"
- **Lane impact:** L4: extends the Ready bullet (duel tokens refill too). Also newly surfaced: an autoAssignStats mode (StatsManager.as:1655-1687) that round-robins the 3 points through [MAXHP,MAXCHI,ATTACK,DEFENSE,SPEED,MAXAP] starting at getLevel()%6, and a Dan cap of 9 (:2209) ⇒ 10 Dan ranks, rebirth paying +5 gold or +20 at Dan 8 (:2201-2208) — the last is a cross-lane gift to rebirth-elements blocker ③ (count only, not titles).

### `progression/per-stat-hard-caps` — HELD [A2]

Stats are hard-capped by character level — HP < 10+(L+10)*10, Chi < 10+(L+10)*5, AP < 30+(L+10)*5, ATK/DEF/SPD < 1+(L+10)*3 — a mechanic the ledger's progression block does not mention at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341-3346`
- **Quote:** var _loc3_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9403s0§) < 10 + (_loc2_ + 10) * 10;
var _loc4_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9406s0§) < 10 + (_loc2_ + 10) * 5;
var _loc5_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9415s0§) < 30 + (_loc2_ + 10) * 5;
var _loc6_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9408s0§) < 1 + (_loc2_ + 10) * 3;
- **Lane impact:** L4: a whole missing sub-system for the ledger's Ready list — at L80 the ceilings are HP 910, Chi 460, AP 480, ATK/DEF/SPD 271.

### `progression/start-pools-and-respec` — HELD [A2]

Start pools HP10/Chi10/AP30 are correct and now carry a payload cite, plus the two missing entries ATK 1 / DEF 1 / SPD 1; the same function is the game's respec, which is free, total, and refunds (level-1)*3 points.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2559-2578 (web), clear-named at reference/decompiled/shs3_android/scripts/StatsManager.as:2118-2138`
- **Quote:** public static function unAssignStatPoints() : *
{
   setPlayerStats(STAT_MAXHP,10);
   …
   setPlayerStats(STAT_MAXCHI,10);
   …
   setPlayerStats(STAT_ATTACK,1);
   setPlayerStats(STAT_DEFENSE,1);
   setPlayerStats(STAT_SPEED,1);
   …
   setPlayerStats(STAT_MAXAP,30);
   setPlayerStats(STAT_STATPOINTS,(getLevel() - 1) * 3);
}
- **Lane impact:** L4: confirms a Ready bullet with an A2 cite and adds ATK/DEF/SPD start values plus a respec mechanic the ledger omits.

### `progression/unlock-cadence-to-l80` — HELD [A2]

The unlock cadence is held all the way to L80, not just to L10 where both longplays stop — 33 character-level gates plus a 52-row skill prerequisite graph the ledger never mentions.

- **Cite:** `reference/extracted/skilldata.xml:257 (<lvlreq>3</lvlreq>, id 1004 Roll) through skilldata.xml:1640 (<lvlreq>80</lvlreq>, id 1055 Mass Shadow Clone); index docs/gauntlet/L0/index/skilldata.json paths skilldata/skill/lvlreq (33, range 3–80) and skilldata/skill/req/has/id (52)`
- **Quote:** skilldata.xml:257 "<lvlreq>3</lvlreq>" … skilldata.xml:1640 "<lvlreq>80</lvlreq>". Full ladder measured this pass: L3 Roll · L5 Focus, Skill Slots+, Carrying Weight+, Coin Purse+, Farming, Scavenging, Mining · L10 Throw Kunai · L15 Slash Wave, Lay Trap · L20 Smoke Bomb, Fire Breath, Ground Punch, Wind Combo, Water Stomp · L25 Chi Kick · L30 Windmill Shuriken · L35 Spirit Thief · L40 Flashbang · L45 Chi Burst · L50 Shadow Clone, Chi Charge, Inferno, Tsunami, Tornado, Earthquake · L55 Charged Shot · L60 Stealth · L65 Heavenly Sword · L70 Substitution Jutsu · L75 Deadly Touch · L80 Mass Shadow Cl
- **Lane impact:** L4: upgrades the "unlock cadence" Ready bullet from an L1–L10 observation to a complete L3–L80 table. Two gates are themselves progression systems: getSkillSlotCount() = 3 + getStat(1008) (StatsManager.as:2293-2295) and getCarryingWeight() = 100 + getStat(1009)*20 (:2298-2300) — the frame's WEIGHT: 73 / 100 is the un-upgraded base.

### `progression/xp-from-gather-and-dungeon` — PARTIAL [A2]

For gathering (mine/farm/forage) only the plumbing is held — XP arrives as a quest outcome or an item-modifier value, not via a dedicated gather-XP formula, and the one filmed mining session awarded none.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLQuestOutcome.as:66 and InventoryUI.as:906; corroborated by docs/research/video-study/segments/A-04-mines-takahasi-coal-mining-quest.md line 32`
- **Quote:** XMLQuestOutcome.as:66  OverworldHUD.instance.lootDialog.addLootXP(this.modify);
InventoryUI.as:906  StatsManager.changeXP(item.modifierXML[i].value);
A-04 line 32: "XP bar unmoved at 2098/2950 (level 3) for entire segment — no XP awarded from mining or quest steps shown."
- **Lane impact:** L4: blocker ④'s gather/dungeon sub-clause survives as a PARTIAL — the delivery path is held, a per-gather-action XP number is not, and on the A-04 evidence may not exist at all.

## quests-story — re-scored 78

42 -> 78. Additive gains: the full script + branching graph is on disk and renders literally (Q-01); all 14 chapters ship, not 4 (Q-02); triggers/coords/rewards are fully tabled and the loot ids name-resolve (Q-03); the choice-consequence question is ANSWERED rather than open (Q-04); the Android-version caveat is retired by a byte check (Q-05); the cutscene director is a closed 15-verb instruction set (Q-12); an entire unlisted ally-wave subsystem is held (Q-11). Held back from 85+ by three real gaps: the shipped web build's Prologue dialogue is REWRITTEN relative to questdata.xml (Q-06 — the frame wins, so line-level fidelity is only guaranteed where a longplay shows the scene), plus two unnamed enums (step <action> semantics, Q-14; <outcome><id> flag namespace, Q-15). Not 90+: <img> portraits and <bg> backdrops are referenced by token only — the art itself is a separate recovery problem.

### `quests-story/ally-waves-unlisted-system` — HELD [A2] ⚑ OVERTURNS LEDGER

An entire subsystem is missing from the §4 block: scripted ALLIES in quest waves — 70 <wave><friend> entries resolving to Fumio x16, Yuudai x15, Satoshi x14, Old Guard x6, Soldier x8, Mitsuo/Hachimaru/Shou x3 each, Hiroshi, Chikako; 59 of 70 carry <fatal>0</fatal> (allies knock down, do not die). The same table gives 151 <enemy> rows (lvl 2-35, qty 1-10, spawn x -400..2000) and 4 <endless> waves.

- **Cite:** `reference/extracted/questdata.xml — 70 <wave><friend> / 151 <wave><enemy> / 2 <wave><neutral>, ids resolved via docs/gauntlet/L0/index/resolved_names.json`
- **Quote:** FRIEND ids: 164 Fumio x16 · 168 Yuudai x15 · 161 Satoshi x14 · 90 Old Guard x6 · 807/806 Soldier x4 each · 197 Mitsuo x3 · 181 Hachimaru x3 · 182 Shou x3 · 144 Hiroshi x1 · 811 Chikako x1. NEUTRAL: <id>118</id> = Training Dummy.
- **Overturns:** "- **Ready:** quest-log UI + data model; archetype taxonomy (story/normal/trade + bounty/escort/gather/timed); turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles; plot spine; LEAVE AREA vs FREE RESPAWN (closed); the "two Yasukas" = one person (closed)."
- **Lane impact:** L1 CAMPAIGN must spawn allies; L4 ENEMIES+AI gains a per-quest encounter table (151 rows with level and spawn x) and an ally-AI requirement its §4 block never mentions.

### `quests-story/choices-not-consequential` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker (4) is ANSWERED and the answer is no: the engine supports per-choice outcomes (XMLQuestChoice.applyOutcome) but ZERO of the 471 shipped choices carry <outcome> — all 471 are pure <goto> jumps, only 7 are condition-gated, and the Prologue's two branches reconverge on the same <label> and the same terminal <outcome>.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLQuestChoice.as:38-47 + reference/extracted/questdata.xml:146-185 (measured over all 471 <choice> blocks)`
- **Quote:** public function applyOutcome() : * { var max:int = this.outcome.length(); for(var i:int = 0; i < max; i++) { outcomeXML = new XMLQuestOutcome(this.outcome[i]); outcomeXML.applyOutcome(); } }  ||  measured: <goto> 471/471 · <outcome> 0/471 · <condition> 7/471 · <gotolabel> 0/471
- **Overturns:** "④ are player choices consequential?"
- **Lane impact:** L1 CAMPAIGN — the choice graph is a flat jump table, not a consequence system; drops a large chunk of L1's assumed runtime risk.

### `quests-story/cutscene-director-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The cutscene director is fully recovered: 55 <cutscene> blocks, 399 timed commands, and a CLOSED 15-verb instruction set with time (0-8 s), actor handle, param and x (-200..1600) — including 23 `sound` cue points and 7+7 addemitter/removeemitter particle calls.

- **Cite:** `reference/extracted/questdata.xml:27414-27420 (+ measured verb histogram over all 399 <data> commands)`
- **Quote:** <data>\n  <time>0</time>\n  <id>fig1</id>\n  <action>create</action>\n  <param>814,shoulderweapon,1</param>\n  <x>220</x>\n</data>  ||  verbs: anim 107 · walk 76 · create 75 · end 33 · sound 23 · say 16 · createprojectile 16 · face 13 · remove 10 · addemitter 7 · removeemitter 7 · pose 6 · darkblur 6 · setposition 3 · createobject 1
- **Overturns:** "- **Ready:** quest-log UI + data model; archetype taxonomy (story/normal/trade + bounty/escort/gather/timed); turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles; plot spine; LEAVE AREA vs FREE RESPAWN (closed); the "two Yasukas" = one person (closed)."
- **Lane impact:** L1 CAMPAIGN — the cutscene director is a 15-opcode interpreter, fully specified. L7 AUDIO gains 23 exact cue points; L6 ART gains a named particle-emitter requirement its blocker list calls uncatalogued.

### `quests-story/ep4-12-epilogue-shipped` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker (2) is dead: Episodes 4-12 and the Epilogue all ship with full step chains, cutscenes, waves and rewards; the ONLY unshipped chapter is Season 2, and the payload says so in its own words.

- **Cite:** `reference/extracted/questdata.xml:8521, :24869, :27347, :27697, :27710, :27726`
- **Quote:**   <title>Episode 4</title> / <title>Episode 12</title> / <title>Epilogue</title> / <title>Season 2</title> / <title>(Unreleased) The adventure continues...</title> / <text>This episode is not yet released. Return here when the episode is released to continue the story!</text>
- **Overturns:** "Only Prologue–Ep3 are documented/reachable; Ep4–12 were likely never shipped. **Scope decision:** faithful campaign = Prologue–Ep3, with Ep4–12 labeled canonical-but-unshipped."
- **Lane impact:** L1 CAMPAIGN — scope is Prologue -> Ep1-12 -> Epilogue (14 chapters), tripling the campaign the ledger planned to build.

### `quests-story/frame-beats-payload-dialogue-rewritten` — PARTIAL [A1] ⚑ OVERTURNS LEDGER

FRAME BEATS PAYLOAD: the shipped build's Prologue dialogue is REWRITTEN relative to questdata.xml — of six comparable strings in one scene, 1 is exact, 1 near-exact and 4 are different wording, while the structure (speakers, beat order, exactly two choice rows, reconvergence) matches perfectly. questdata.xml is a script-COMPLETE, near-verbatim source, not a byte-verbatim one, and I say so out loud: where the frame and the payload disagree, THE FRAME WINS.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 @ t=62/66/68/72/76 s, 1920x1080 frames, crop (0,700)-(1400,1060) [bottom parchment dialogue box + nameplate tab], 5-up sheet at 640x360/panel — scratch: /private/tmp/claude-501/-Users-kheshav-kheshav-code-SSHD-1-1/70279977-fb70-4a26-ba27-9b32a10d27dc/scratchpad/qframes/sheet.png`
- **Quote:** VISIBLE IN CROP t=62, nameplate JINBEI: "IT'S NOT OFTEN WE MEET A NEW FACE ON THESE ROADS. IT'S THE BANDITS, YOU SEE. THEY'VE DRIVEN ALL THE HONEST FOLK AWAY." vs questdata.xml:128 "Ah! A new face in this territory!..." (DIFFERENT). t=68, nameplate GUEST, two stacked rows: "I'LL STAND MY GROUND AND ASK THEM TO LEAVE ME ALONE." (= :149 EXACT) / "THESE BANDITS DON'T SCARE ME!" (vs :153 "They'll get nothing from me!" DIFFERENT). t=72: "HOW ABOUT I HAND OVER HALF THE LENGTH OF THIS SWORD -- SHARP END FIRST..." (vs :183 which prefixes "I say "). t=76 JINBEI: "THAT'S TOO BAD, TRAVELER, IT REALLY IS.
- **Overturns:** "| §4 quests-story: *"verbatim dialogue — captured NOWHERE"*; §6: *"structurally unrecoverable"* | `questdata.xml` — **2,771 `<dialogue>` blocks, 3,307 verbatim `<text>` lines, 471 `<choice>`**, full `<cutscene>` direction |"
- **Lane impact:** L1 CAMPAIGN — its done-criterion 'all 3,307 lines present byte-exact' is now known to NOT equal on-screen fidelity for at least the Prologue. L1 must add a frame-reconciliation pass for every scene visible in the two longplays, and must label the rest 'payload wording, may differ from shipped build'.

### `quests-story/quest-log-cap-is-a-row-count` — HELD [A2] ⚑ OVERTURNS LEDGER

'QUEST_LOG_CAP = 7 (1 story + 6 side)' is a misread of a UI row count — the 7 is the number of visible scroller rows (x=60, y=73+55i) over an unbounded activeQuests list with scroll-up/down buttons; a grep for an accept-time cap finds only a selection-index clamp.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/QuestLogUI.as:88-96 (+ :525, :553)`
- **Quote:** this.questLogButtonList = new Vector.<QuestLogButton>(); for(i = 0; i < 7; i++) { tempQuestLogButton = new QuestLogButton(i); tempQuestLogButton.x = 60; tempQuestLogButton.y = 73 + i * 55; ... }  ||  :553 this.questScrollDownButton.visible = this.activeQuests.length - this.currentRow > length;
- **Overturns:** "QUEST_LOG_CAP = 7 (1 story + 6 side)."
- **Lane impact:** L1 CAMPAIGN + L8 UI — ship a 7-row scroller with exact geometry (x=60, y=73+55i); do NOT ship a 7-quest limit.

### `quests-story/questtype-taxonomy-wrong` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's 'archetype taxonomy (story/normal/trade + bounty/escort/gather/timed)' is the wrong taxonomy: the engine's QuestType is a 9-value enum containing none of trade/bounty/escort/gather/timed, and the 61 shipped quests use only 3 of the 9 (StoryQuest 37, Dialogue 22, NormalSideQuest 2).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/QuestType.as:6-24 + measured <type> over the 61 quests in reference/extracted/questdata.xml`
- **Quote:** public static var NormalSideQuest:int = 0; public static var RepeatableSideQuest:int = 1; public static var StoryQuest:int = 2; public static var DailySideQuest:int = 3; public static var Dialogue:int = 4; public static var ClanQuest:int = 5; public static var OngoingQuest:int = 6; public static var HighLvlQuest:int = 7; public static var LowLvlQuest:int = 8; public static var length:int = 9;  ||  measured {2:37, 4:22, 0:2}
- **Overturns:** "archetype taxonomy (story/normal/trade + bounty/escort/gather/timed)"
- **Lane impact:** L1 CAMPAIGN — build the 9-value enum, not the invented 7; note that types 1/3/5/6/7/8 are produced at runtime by QuestGenerator.as and never authored in questdata.xml. Also touches L11 (ClanQuest).

### `quests-story/reward-and-roster-undercount` — HELD [A2] ⚑ OVERTURNS LEDGER

Two 'Ready' bullets under-claim badly: there are 77 <reward> blocks (69 <exp> + 18 <loot>), not '9 reward tuples'; and the character roster is 68 distinct <img> portrait tokens including emotional variants (mitsuo_dying, yasuka_hurt, jinbei_angry, chikako_blush, magoichi_masked, yuudai_before), i.e. a complete story-mode portrait manifest.

- **Cite:** `reference/extracted/questdata.xml — measured: 77 <reward>, 69 <exp> {100,200,250,290,500,600,750,1000,2000,3000}, 18 <loot>, 68 distinct <img>`
- **Quote:** top <img> tokens by use: kojuro 213 · yuudai 210 · satoshi_serious 209 · fumio 177 · satoshi 176 · chikako_mask 77 · hiroshi 65 · hachimaru 65 · mitsuo 52 · fumio_happy 52 · chikako 47 · yasuka 41 · shinmen 33 · tanaka 32
- **Overturns:** "turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles"
- **Lane impact:** L1 CAMPAIGN gets the exp/loot table; L6 ART gets a closed 68-asset portrait manifest to draw against.

### `quests-story/triggers-coords-rewards-tabled` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker (3) is dead: per-quest triggers, coords and rewards are fully tabled — 225 <step> with <node>+<roomobj>, 215 <action> over a closed 5-value domain, 348+52+14+97 coordinate fields, and 77 <reward> blocks (69 <exp> over a closed 10-value domain, 18 <loot> rows) whose item ids all resolve to names.

- **Cite:** `reference/extracted/questdata.xml:442-456 (+ docs/gauntlet/L0/index/resolved_names.json)`
- **Quote:** <reward>\n <loot>\n  <id>13100</id>\n  <qty>1</qty>\n  <chance>1</chance>\n </loot>\n <loot>\n  <id>2103</id>\n  <qty>5</qty>\n  <chance>1</chance>\n </loot>  -> 13100 = "Iron Sword", 2103 = "Small Rice Ball"
- **Overturns:** "③ per-quest trigger types + coords + rewards (sampled, not tabled)."
- **Lane impact:** L1 CAMPAIGN — the quest state machine can be generated from data instead of hand-authored; L9 WORLD gets 225 node ids + 14 teleport coords for free.

### `quests-story/verbatim-script-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The verbatim story script is NOT gone and NOT server-fetched: 2,771 <dialogue> blocks / 3,307 <text> lines sit as static XML in the client payload, and LangManager.getQuestString returns non-"ID" strings unchanged, so those lines are what the game renders.

- **Cite:** `reference/extracted/questdata.xml:128 (+ reference/decompiled/shs3_android_payload/scripts/LangManager.as:95-100)`
- **Quote:** <text>Ah! A new face in this territory! My, it isn't often we see people walk this road alone, what with all the bandits infesting it...</text>  ||  public static function getQuestString(id:String) : String { if(id.charAt(0) != "I" || id.charAt(1) != "D") { return id; }
- **Overturns:** "**Verbatim dialogue** — if the story is server-fetched and the server is dead, the actual script is gone; author original lines to the summaries (RECREATE-NEVER-RIP already requires original dialogue anyway)."
- **Lane impact:** L1 CAMPAIGN — the dialogue corpus is an input, not a writing task. Also deletes the top entry of REBUILD_READINESS.md §6.

### `quests-story/android-caveat-retired` — HELD [A3]

The standing Android v0.682-vs-web v0.717 caveat DOES NOT apply to quests-story: the web questdata.xml and the Android 116_Mobile_QuestData.bin are byte-identical apart from one trailing newline, which legitimises using the Android bundle's 53 named quest classes (the web payload's ActionScript is obfuscated and holds none).

- **Cite:** `cmp + sha256 of reference/extracted/questdata.xml vs reference/extracted/android/116_Mobile_QuestData.bin`
- **Quote:** $ cmp reference/extracted/questdata.xml reference/extracted/android/116_Mobile_QuestData.bin\ncmp: EOF on reference/extracted/questdata.xml\nandroid len 796384 web len 796383 · android[:-1]==web ? True · android last byte b'\\n'\nsha256 web        e8ecb01f05cc47c3a331328a3278c70a986d93038838af5a27c8075a035aad2e\nsha256 android[:-1] e8ecb01f05cc47c3a331328a3278c70a986d93038838af5a27c8075a035aad2e
- **Lane impact:** L1 CAMPAIGN + L1b — quest DATA needs no build label; quest CODE ported from shs3_android_payload should still be labelled v0.682.

### `quests-story/outcome-id-namespace` — STILL_UNHELD [STILL_UNHELD]

I could not ground the <outcome><id> global-variable namespace: 194 <set> rows write 28 distinct ids (42..40002) and startcondition/has reads them back, but I did not open XMLQuestOutcome.as or StatsManager.checkConditions, so any mapping of id ranges to 'story flags' / 'quest items' / 'stats' would be a guess.

- **Lane impact:** L1 CAMPAIGN + L9 WORLD (save schema) — the quest flag namespace is the save-game's story section. Close-path: read XMLQuestOutcome.as + StatsManager.checkConditions in reference/decompiled/shs3_android_payload/scripts/.

### `quests-story/player-name-satoshi-resolved` — HELD [A1]

The 'player named Satoshi' contradiction is RESOLVED: the player has no canonical name (the dialogue nameplate is the account name — 'GUEST' unauthenticated, 'SOUND360TM' in the other longplay), speaks as <id>-2</id>, and Satoshi is NPC id 161, a portrait-bearing companion who fights beside the player in 14 quest waves.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4 @ t=68 s, crop (0,700)-(1400,1060) [nameplate tab reads GUEST]; reference/frames/broad_survey/Nr4fQstqHDM_0090.jpg [PLAYER sheet, name field reads SOUND360TM]; corroborated A2 reference/extracted/questdata.xml:158`
- **Quote:** VISIBLE IN CROP: the black nameplate banner above the player's own two choice rows reads "GUEST"; the PLAYER character-sheet frame shows "SOUND360TM" over the paperdoll. questdata.xml:158 <id>-2</id> is the player speaker id; 'satoshi*' appears 406x as an <img> portrait token and resolves to NPC id 161 "Satoshi", 14x as <wave><friend>.
- **Lane impact:** L1 CAMPAIGN — the dialogue box must substitute the player's chosen name for speaker id -2; Satoshi is an ally NPC to spawn, not the PC.

### `quests-story/step-action-enum-semantics` — STILL_UNHELD [STILL_UNHELD]

I could not ground the SEMANTICS of <step><action>: the domain is measured ({0:169, 1:37, 6:5, 14:3, 4:1} over 215 rows) and QuestAction.as:49 reads it, but I did not find the enum mapping those ints to behaviours (talk-to / kill / gather / enter-room). Per-step trigger TYPES are therefore enumerated but not named.

- **Lane impact:** L1 CAMPAIGN — blocks generating the quest state machine's trigger dispatch. Close-path: trace QuestAction.action consumers in InteractUI.as / GenericActionButton.as / Obj_NPC.as under reference/decompiled/shs3_android_payload/scripts/. One focused pass.

### `quests-story/two-yasukas-confirmed` — HELD [A2]

The 'two Yasukas = one person' Ready bullet holds, now on a payload cite rather than inference: exactly one NPC resolves to the name 'Yasuka' (id 156), and questdata uses two portrait tokens for her (yasuka, yasuka_hurt) — one character, two emotional states.

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json -> npcdata.xml resolved: id 156; reference/extracted/questdata.xml:1508 <img>yasuka</img>`
- **Quote:** resolved NPC name matches for 'yasuka': [('156', 'Yasuka')] — exactly one. questdata portrait tokens: yasuka x41, yasuka_hurt x10.
- **Lane impact:** L1 CAMPAIGN — no disambiguation work needed; L4 gets one NPC row, not two.

## rebirth-elements — re-scored 88

Ledger scored this 30/100 with five blockers. Blockers (1) what each element does, (2) elemental ATK-vs-DEF formula, (3) Dan-rank count/titles, and (4) Dragon Dance input + Kanji-statue bonus are all fully answered by files already on disk; blocker (5) the element-picker UI is answered as data/flow/copy/icons, with only its ART still unheld. §3 correction #7 is disproven by the real v0.717 client. Three cross-lane numbers the ledger files nowhere (Dan-scaled slash length in stage px, +79 SP/Dan, +10 bank weight/Dan) are recovered. Remaining gaps are narrow and named: elementCircle art (no frame exists), per-element status effects (unverified either way), statue placement join, and v0.717 parity for the per-stance slash multipliers. 88, not higher, because the art gap is genuinely unclosable from held material and one number block is android-only.

### `combat-core/dan-scaled-slash-length` — HELD [A2] ⚑ OVERTURNS LEDGER

The base slash length is an exact formula in stage pixels that is scaled by Dan rank, so the combat-core 'reach in units of unknown scale' blocker is answered and its ceiling is owned by the rebirth system.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1915-1919, desktop confirm reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2344-2348; BankUI.as:264`
- **Quote:** internal static function getBaseSlashLengthVal(speed:int) : int\n{\n   var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;\n   return int(120 + Math.floor(maxincrement * speed / (20 + speed)));\n}
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** combat-core blocker ① — units are stage pixels, floor 120, asymptote 210 px at Dan 0 rising to 255 px at Dan 9. Bank weight is 100 + DAN*10 + PAIDSTORAGE*10. Both are corroborated by the game's own prompt (string 610: 'Slash length and bank storage is increased with each dan rank').

### `progression/post-rebirth-sp-economy` — HELD [A2] ⚑ OVERTURNS LEDGER

The post-rebirth skill-point economy is an exact formula, SP = (level−1) + DAN×(levelCap−1) = (level−1) + DAN×79, which also shows the ledger's '80 SP first run' is one too many.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2156, desktop confirm §1t1523s0§.as:2598; levelCap=80 at StatsManager.as:76`
- **Quote:** setPlayerStats(STAT_SKILLPOINTS,getLevel() - 1 + getPlayerStats(STAT_DAN) * (levelCap - 1));
- **Overturns:** "③ post-rebirth SP economy;"
- **Lane impact:** progression blocker ③ closed, and its Ready bullet '80 SP first run' corrected to 79 at L80/Dan 0. A Dan-10 L80 character has 790 SP.

### `rebirth/aoe-radii-per-element` — HELD [A2] ⚑ OVERTURNS LEDGER

The four ultimates have different AoE radii and different launch types, so they are not reskins of each other.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/BigFireBreathProjectile.as:32, BigWaveProjectile.as:34, BigTornadoProjectile.as:33, BigEarthquakeProjectile.as:68, BigTornadoProjectile.as:24`
- **Quote:** BigFireBreathProjectile.as:32   NPCManager.checkHitObject(this,damageObj,600);\nBigWaveProjectile.as:34         NPCManager.checkHitObject(this,damageObj,400);\nBigTornadoProjectile.as:33      NPCManager.checkHitObject(this,damageObj,200);\nBigEarthquakeProjectile.as:68   NPCManager.checkHitObject(this,damageObj,50);
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① (AoE half). Inferno 600 / Tsunami 400 / Tornado 200 / Earthquake 50-per-rock; Tornado is LAUNCH_AIR while the other three are LAUNCH_KNOCKDOWN. Carried from PASS 1 and re-verified verbatim.

### `rebirth/dan-achievements-prove-ten` — HELD [A2] ⚑ OVERTURNS LEDGER

The achievement table independently proves the ladder tops out at a displayed Dan 10: achievement 51 fires at STAT_DAN==9 with the description 'Reach Dan 10.'

- **Cite:** `reference/extracted/android/114_Mobile_AchievementData.bin:463-470 + strings 8044/8124`
- **Quote:** <id>51</id>\n<name>8044</name>\n<desc>8124</desc>\n<stat>25</stat>\n<val>9</val>      → 8044='Ultimate Warrior', 8124='Reach Dan 10.', stat 25=STAT_DAN
- **Overturns:** "**`MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT.** The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th); film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements + meta-social: MAX_DAN_RANK=10 becomes CONTRACT; the four Dan achievement rows also drop straight into meta-social blocker ③.

### `rebirth/dan-ladder-titles` — HELD [A2] ⚑ OVERTURNS LEDGER

The Dan ladder is fully recovered: STAT_DAN 0..9 displays as Dan 1..10, with kanji titles 初段…十段 (strings 455–464) and the kendo shogo suffixes Renshi / Kyoshi / Hanshi (465/466/467) awarded at STAT_DAN 3-5 / 6-7 / 8-9.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2285-2288 + StatsManager.as:2209-2211 (desktop confirm §1t1523s0§.as:2653-2655), joined to docs/gauntlet/L0/index/strings.json:455-467`
- **Quote:** case 3:\n   nametext += " <font color='#7D5500'>" + LangManager.getString(465) + "</font>";\n   this.danfield.text = LangManager.getString(458);   // 465='Renshi', 458='(四段)'
- **Overturns:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements blocker ③ closed outright. Also explains the wiki garble the ledger complains about in §3 #7: 九段 (kyudan) is STAT_DAN 8 / displayed Dan 9 — the wiki collapsed two numbering layers.

### `rebirth/dragon-dance-bagua-input` — HELD [A2] ⚑ OVERTURNS LEDGER

The Dragon Dance input is an 8-node bagua click ring with two named arrangements, and clicking the four elemental nodes {1,2,4,6} is what flips Earlier Heaven to Later Heaven.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/DragonDanceUI.as:70-71, :354-355, :367-369, :302-334, :447`
- **Quote:** this.earlierHeavenLabel = ["sky","wind","water","mountain","earth","thunder","fire","lake"];\nthis.laterHeavenLabel = ["fire","earth","lake","sky","water","mountain","thunder","wind"];\n…\nif(Boolean(this.earlierHeaven && this.sequence.length == 4) && Boolean(this.clickedArray[1]) && Boolean(this.clickedArray[2]) && Boolean(this.clickedArray[4]) && Boolean(this.clickedArray[6]))
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④ (input half). The four tier-3 passives 1056/1057/1058/1059 teach precisely nodes 6/2/1/4 — exactly the set that opens Later Heaven — which is the whole design rationale for rebirthing into all four elements. Carried from PASS 1, re-verified.

### `rebirth/dragon-dance-teachable` — HELD [A2] ⚑ OVERTURNS LEDGER

Dragon Dance steps are a player-to-player transmission mechanic, and the game's own name for the second bagua arrangement is 'Later Heaven' — neither fact appears anywhere in the ledger.

- **Cite:** `docs/gauntlet/L0/index/strings.json:6117, 6125, 750`
- **Quote:** 6125 = 'Unlocks the Dragon Dance Step for Fire (Later Heaven) and gives you the ability to teach it to others.'
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④ + meta-social: the Dragon Dance is a social propagation system, not a solo unlock, so a single-player recreation must decide how to substitute the teaching loop.

### `rebirth/element-counter-wheel` — HELD [A2] ⚑ OVERTURNS LEDGER

Your ATK in one element IS your defence against another — a rock-paper-scissors wheel that makes choosing a rebirth element simultaneously a choice of what you become immune to.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1836, desktop confirm reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2270; parameter order from MCSPlayer.as:260`
- **Quote:** player.initElementDefenseStats(getPlayerStats(STAT_WATERATK) + findBonusStat(STAT_FIREDEF),getPlayerStats(STAT_EARTHATK) + findBonusStat(STAT_WINDDEF),getPlayerStats(STAT_WINDATK) + findBonusStat(STAT_WATERDEF),getPlayerStats(STAT_FIREATK) + findBonusStat(STAT_EARTHDEF));
- **Overturns:** "② elemental ATK-vs-DEF **formula**."
- **Lane impact:** rebirth-elements blocker ② (the DEF half) and the Surface bullet's 'elements are TWO systems' note — the gear side and the rebirth side are the SAME stat ids (28-31 ATK, 200-203 DEF gear affixes), which is the link the ledger says was never made. Carried from PASS 1, re-verified in both bundles.

### `rebirth/element-picker-uidata` — HELD [A2] ⚑ OVERTURNS LEDGER

The rebirth/element-picker UI is held as shipped DATA — a two-menu flow whose second menu is four buttons labelled 'Fire ATK' / 'Earth ATK' / 'Wind ATK' / 'Water ATK' in that on-screen order with icons 24/27/25/26, plus a Dan-10 short-circuit that skips the element menu entirely.

- **Cite:** `reference/extracted/android/90_InteractUI_UIData.bin:94-105 (labels resolved via strings.json 507-510)`
- **Quote:** <option><label>1</label><icon>12</icon><condition><has><id>25</id><qty>9</qty><comp>gte</comp></has></condition><action><id>firerebirth</id></action></option> <!-- "yes" useicon >=10 dan, no element boost-->
- **Overturns:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements blocker ⑤ reduced from 'unknown UI' to 'unknown ART only'. The shipped dev comment '>=10 dan, no element boost' is a fourth independent confirmation of the 10-rank ladder.

### `rebirth/elemental-damage-ladder` — HELD [A2] ⚑ OVERTURNS LEDGER

Elemental skill damage is the caster's element ATK stat scaled by skill level {0.8, 0.9, 1.0, 1.1, 1.2} with a zero physical component, and ultimates deal x1.5.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/FireBreathProjectile.as:15-52 and :51; Damage.as:50; BigFireBreathProjectile.as:23`
- **Quote:** if(skilllevel == 1) { scale = 1; damage *= 0.8; } … else if(skilllevel == 5) { scale = 1.4; damage *= 1.2; }\n…\ndamageObj = new Damage(0,0,2,-1,damage);   // signature: (damage, attackerlvl, launchType, stance, fireDamage, …) → physical 0
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① (damage half). Carried from the PASS-1 journal and re-read line by line this pass; independently corroborated by the shipped tooltip '150% Fire ATK'. The FX sprite scale 1.0→1.4 moves in lockstep with the damage ladder.

### `rebirth/elemental-skill-tooltips` — HELD [A2] ⚑ OVERTURNS LEDGER

The 24 elemental skills are not 'names only' — the shipped tooltips state their AoE nature and damage magnitude in words, and skilldata.xml carries every Chi cost and cooldown.

- **Cite:** `docs/gauntlet/L0/index/strings.json:6143-6146 + reference/extracted/skilldata.xml:1880-1893`
- **Quote:** 6143 = 'Area of Effect Fire Attack\n\nFire Damage: 150% Fire ATK'   ·   skilldata.xml:1889 <chi>50</chi>  1890 <cooldown>60</cooldown>  1882 <lvlreq>50</lvlreq>
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① closed for damage/cost/AoE. Also closes skills-meters blocker ① for the elemental branch ('read skill cards in a preserved build' — no build needed). Tooltips also reveal traps/kunai consume kunai AMMO on top of Chi, a cost the ledger never records.

### `rebirth/kanji-statue-bonus` — HELD [A2] ⚑ OVERTURNS LEDGER

The Kanji-statue bonus is specified: 2 AP per attempt, 100 px interact range, a permanent node unlock, and a required sequence that is a deterministic RNG permutation of '1246' seeded on the map node id.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Obj_DragonDanceStatue.as:37-62, :185, :224-226, :238-240`
- **Quote:** rng = new RNG(StageManager.getCurrentNode());\ndice = rng.rand(5);\nif(dice == 0) { sequence = "1246" + this.num; } … else if(dice == 4) { sequence = "6241" + this.num; }\n…\noverride public function getAPUse() : int { return 2; }
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④ (statue half). The same statue in the same room always demands the same dance, but different rooms demand different permutations — reproducible offline from the node id alone. Carried from PASS 1, re-verified.

### `rebirth/mitigation-flat-min1` — HELD [A2] ⚑ OVERTURNS LEDGER

Elemental mitigation is flat subtraction with a hard min-1 floor per channel, summed with physical damage into a single HP loss.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3347-3357 and :3420`
- **Quote:** var fireDamage:int = damageObj.fireDamage - STAT_FIREDEF;\nif(damageObj.fireDamage > 0 && fireDamage < 1) { fireDamage = 1; }\nelse if(fireDamage < 0) { fireDamage = 0; }\n…\nsetHP(getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
- **Overturns:** "② elemental ATK-vs-DEF **formula**."
- **Lane impact:** rebirth-elements blocker ② (the ATK-vs-DEF half) closed. Note the elemental floor is a hard 1, distinct from the physical getMinDamage() ladder — so the ledger's Ready bullet 'Undead/Red-Oni damage floor' is a different mechanism and should not be conflated. Carried from PASS 1, re-verified.

### `rebirth/stance-slash-multipliers-parity` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The per-stance slash-length multipliers are recovered (Light x1.5 fixed, Balanced x(1+0.005·mastery), Heavy x(0.5+0.005·mastery) floored at 100 px) but only in the android v0.682 bundle — I grepped the whole v0.717 desktop tree for the identical expressions and got zero hits, so parity is NOT established.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3029-3081; negative grep over reference/decompiled/shs3_payload/scripts/ for '0.5 + 0.5 *', '1 + 0.5 *', '0.005' returned no matches`
- **Quote:** this.slashLength = this.baseSlashLength * 1.5;                                     // LIGHT\nthis.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01);  // BALANCED\nthis.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);   // HEAVY\nif(this.slashLength < 100) { this.slashLength = 100; }
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** combat-core: mastery is a 0-100 percentage here, not 0-9, so the ledger's 'mastery-9 ceiling' framing needs re-checking in its own lane. Flagged PARTIAL rather than HELD because the numbers are v0.682-only and §A7 proves numbers moved between builds.

### `rebirth/string-table-resolved` — HELD [A2] ⚑ OVERTURNS LEDGER

Every display string this system needs — Dan titles, shogo suffixes, rebirth prompts, all 24 elemental skill names and descriptions, the element-button labels — is resolved on disk, so the PASS-1 journal's claim that the table is missing is retracted.

- **Cite:** `docs/gauntlet/L0/index/strings.json (from reference/extracted/android/118_Mobile_Lang_EN.bin, 2533 entries)`
- **Quote:** 610 = 'Are you ready to attain the next dan rank?\n\nYou will be reborn as a level 1 character while retaining your inventory, skill points and clan rank. Your current equipment will be automatically unequipped.\n\nSlash length and bank storage is increased with each dan rank.'
- **Overturns:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements: dissolves the PASS-1 survey's own stated blocker ('all display TEXT … NOT on disk'), which was auto-REFUTED by Stage-0b finding S0-3. Also feeds ui-hud and quests-story.

### `rebirth/tenth-gold-is-100` — HELD [A2] ⚑ OVERTURNS LEDGER

The real v0.717 desktop client pays +25 gold on every rebirth and +100 on the Dan 8→9 (displayed 9→10) rebirth, so both MAX_DAN_RANK=10 and tenthGold=100 are CONTRACT, not INFERRED.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2652 (§1t9426s0§=25=STAT_DAN at :254, §1t9413s0§=12=STAT_HGOLD at :228)`
- **Quote:** if(§1t7356s0§(§1t9426s0§) == 8)\n{\n   §1t9713s0§(§1t9413s0§,100);\n   §1t3318s0§.instance.§1t3409s0§(§1t1521s0§.getString(864,[§1t9765s0§(),"10"]));\n}\nelse\n{\n   §1t9713s0§(§1t9413s0§,25);\n}
- **Overturns:** "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements + economy: promotes two config values from INFERRED to CONTRACT. Also the concrete evidence for the S0-3 build-parity caveat — the android v0.682 bundle uses 5/20 for the same two branches (StatsManager.as:2201-2207), so one in six checked numbers moved between 0.682 and 0.717; the desktop value wins.

### `rebirth/unlock-gate-is-stat-threshold` — HELD [A2] ⚑ OVERTURNS LEDGER

The Dragon Dance / elemental unlock gate is a stat threshold on element ATK at 10/30/60, not a rebirth count, so there are three tiers (1x/3x/6x) and the entire usable elemental kit lands on the FIRST rebirth into that element.

- **Cite:** `reference/extracted/skilldata.xml:1884 (qty 30), :1726 (qty 60), :985+ (qty 10); id 28 = STAT_FIREATK per reference/decompiled/shs3_android_payload/scripts/StatsManager.as:226; grant at InteractUI.as:849-855, desktop §1t401s0§.as:873-881`
- **Quote:** <req><has><id>28</id><qty>30</qty></has></req>      // id 28 = 'internal static var STAT_FIREATK:int = 28;'
- **Overturns:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** rebirth-elements Surface bullet corrected: the ledger drops the 1x tier, which is the one that opens each element's Kunai, Trap AND tier-2 attack. Gear affixes on stats 28-31 count toward the same threshold, and the Dan-8 rebirth grants +20, so the cadence is not a clean multiple of 3.

### `rebirth/element-circle-art` — STILL_UNHELD [STILL_UNHELD]

The element-picker circle's art, layout and colours remain unrecovered — no frame in any of the 113 frame directories shows the rebirth flow, the element circle, or a Dan title.

- **Overturns:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements blocker ⑤, art half — this is the one clause of the ledger's rebirth block that fully survives. The 'frame wins' rule never fired in this lane because there is no frame to weigh against the docs. Close-path: locate the exported symbol for InteractUI's elementCircle MovieClip in the asset SWF, or accept a recreation-authored design and label it.

### `rebirth/element-status-effects` — STILL_UNHELD [STILL_UNHELD]

Whether elemental skills apply a status (burn / slow / root / DoT) beyond their launch type is unverified in either direction.

- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① residual. No burn/slow/DoT flag appears at any elemental Damage construction site, but I did not read NPCManager.checkHitObject or the BUFF_* system end to end, so I will not assert that none exists. Close-path: read Damage.as buff fields plus the BUFF_* constants in StatsManager.as.

## skills-meters — re-scored 86

33 -> 86. All five §4 blockers are now HELD with payload cites: every skill's chi cost and cooldown (182 level rows), the Focus/reload meter's max + dead zone + switch cost + per-stance slash cost, the deterministic crit trigger and its multiplier, the SPD->cooldown formula, and Shunpo's gating/cost/charge rule. On top of that, 73/73 skill names and descriptions now resolve from the recovered string table, 135 of 182 level rows carry a verbatim numeric effect string (damage/duration/dodge-%/slot counts), and a byte-check proves the Android and web skilldata are the same 39,003 bytes so all of it is web-v0.717 fact. Held back from ~95 by: the ultimates' and elemental projectiles' constants (47 blank level rows, and Android projectile code is proven-retuned so it cannot be trusted for v0.717), skill VFX/animation/audio entirely untouched, Shunpo's 250px/3s charge geometry Android-only, and all UI copy carrying an Android-table caveat.

### `skills-meters/blocker1-costs-cooldowns` — HELD [A2] ⚑ OVERTURNS LEDGER

Ledger blocker ① is dead: every one of the 75 skills' chi costs and cooldowns sits in skilldata.xml across 182 <level> rows, including all four skills the blocker names by hand.

- **Cite:** `reference/extracted/skilldata.xml:500-513 (Smoke Bomb, id 1010); also :345-358 (Throw Kunai 1007), :889-902 (Lay Trap 1024), :607-614 (Fire Breath 1013)`
- **Quote:** 501:		<id>1010</id>
502:		<displayname>6018</displayname>
503:		<lvlreq>20</lvlreq>
505:		<req><has><id>1024</id><qty>1</qty></has></req>
507:		<category>6</category>
511:			<chi>5</chi>
512:			<cooldown>6</cooldown>
- **Overturns:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — *read skill cards in a preserved build.*"
- **Lane impact:** L2 (SKILLS + METERS): the lane's stated done-condition 'all 75 skills x 182 rows byte-exact from A2; zero INFERRED cooldowns remain' is reachable by a transcription script today, with no preserved build and no measurement pass.

### `skills-meters/chi-costs-are-not-single-digit` — HELD [A2] ⚑ OVERTURNS LEDGER

The Surface bullet is wrong: chi costs run 0, 2, 3, 5, 6, 7, 8, 10, 20, 50, 100 — double digits are the norm above level ~30 and the ladder tops out at exactly 100.

- **Cite:** `docs/gauntlet/L0/index/skilldata.json -> skilldata/skill/level/chi (distinct_values 11, numeric_range [0,100]); reference/extracted/skilldata.xml:1638-1649 (Mass Shadow Clone, id 1055)`
- **Quote:** 1638:		<id>1055</id>
1640:		<lvlreq>80</lvlreq>
1648:			<chi>100</chi>
1649:			<cooldown>30</cooldown>
- **Overturns:** "real Chi costs are single-digit (2/5); config's 30/25/10 is a fabricated-100-meter rescale."
- **Lane impact:** L2: chi is an absolute integer pool that grows with level (BattleUI.as:252-256 prints chi + '/' + maxchi; frames show 26/26 and 47/47), starting 10/10 with regen +maxchi/10 per tick. 'Single-digit vs fabricated-100-meter' is the wrong axis — config's 30/25/10 is wrong for a different reason than the ledger gives.

### `skills-meters/crit-is-deterministic` — HELD [A2] ⚑ OVERTURNS LEDGER

Ledger blocker ⑤ is dead: crit is not a proc at all — it fires on the exact equality reload == maxreload and costs the whole meter, in the shipped web build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276 (getDamage) and :3295-3298 (deductReloadBar zeroes a full meter)`
- **Quote:** 3272:         if(this.§1t4414s0§ == this.§1t4415s0§)
3273:         {
3274:            return _loc2_ * 1.3 + this.§1t1243s0§;
3275:         }
3276:         return _loc2_;
- **Overturns:** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L5 (COMBAT CORE): removes the crit-chance RNG question entirely — no roll, no seed, no variance. L2: the meter is the crit resource, so Focus/crit are one system not two.

### `skills-meters/focus-meter-numerics-web` — HELD [A2] ⚑ OVERTURNS LEDGER

Ledger blocker ③ is dead: the 'Focus bar' is the reload/crit meter — max 120 frames (5s), bar mapping (reload-48)/(maxreload-48) i.e. a 48-frame dead zone, stance switch costs a flat 48 frames, slash costs slashUsage x0.5/x1.0/x1.5 by stance, bonus refill +6.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:326-333 (mapping); §1t99s0§.as:55 (max), :3160-3166 (switch cost), :3299-3311 (slash cost), :3318-3324 (refill)`
- **Quote:** 328:         var _loc3_:Number = (param1 - 48) / (param2 - 48);
---
3162:            this.§1t4414s0§ -= 48;
---
3302:               this.§1t4414s0§ -= this.slashUsage / 2;
3306:               this.§1t4414s0§ -= this.slashUsage;
3310:               this.§1t4414s0§ -= this.slashUsage * 1.5;
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2: usable meter range is 72 frames and a stance switch costs two-thirds of it. Also corrects the previous UNVERIFIED survey, which banked the Android numbers (24-frame dead zone, maxreload/6 gate, maxreload/2->maxreload/3 cost) — none of those constants exist in the web player class.

### `skills-meters/in-combat-stance-switch-is-real` — HELD [A2] ⚑ OVERTURNS LEDGER

§3.4 is wrong: in-combat stance switching is real in v0.717. 'CANNOT CHANGE STANCE' is a transient caption shown only when the focus bar reads exactly 0, hidden at any partial fill — and setStance charges a flat 48 frames, which a hard lock would have nothing to charge.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:336-347 (three-state caption) with §1t99s0§.as:3160-3166 (the charge)`
- **Quote:** 336:            if(_loc3_ == 0)
340:                  this.§1t5169s0§.htmlText = this.§1t5204s0§;
342:               this.§1t5169s0§.visible = true;
344:            else if(_loc3_ > 0 && _loc3_ < 1 && this.§1t5169s0§.visible)
346:               this.§1t5169s0§.visible = false;
- **Overturns:** "**In-combat stance is HARD-LOCKED in v0.717** ("CANNOT CHANGE STANCE"). The recreation's Focus-gated in-combat switch models **removed 2014 behavior**"
- **Lane impact:** L5/L2: the recreation's Focus-gated in-combat switch is FAITHFUL, not a divergence — it should be presented as original behaviour and the cost set to a flat 48 frames. This REMOVES an entry from the project's labelled-deviation list rather than adding one.

### `skills-meters/kunai-chi-is-a-phantom` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's 'Kunai chi' blocker names a cost that does not exist: Throw Kunai and Lay Trap have an empty <chi> element (cost 0) and spend an ammo counter, stat id 2501, instead.

- **Cite:** `reference/extracted/skilldata.xml:355 and :900; reference/decompiled/shs3_android_payload/scripts/SkillManager.as:252-259`
- **Quote:** 355:			<chi></chi>
---
254:                     if(StatsManager.getStat(2501) == 0)
256:                        trace("no ammo");
257:                        return false;
259:                     StatsManager.changeStat(2501,-1);
- **Overturns:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental)"
- **Lane impact:** L2: kunai/trap skills must be wired to an ammo stat (2501), not to the chi pool; the shipped card copy confirms it in words ('Throws a kunai.\n\nRequires kunai ammo.').

### `skills-meters/ledger-decimals-are-display-artefacts` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's 4.96 / 9.92 / 8.92 cooldowns are not contract values — they are one reader's SPD applied to the raw integers 5 / 10 / 9, and under the web formula that reader's SPD was 6-10.

- **Cite:** `reference/extracted/skilldata.xml:1292/1299/1306 (Chi Punch cd 5) and :295/302/309 (Focus cd 10/9/8), run through §1t1523s0§.as:2289-2296`
- **Quote:** 295:			<cooldown>10</cooldown>
302:			<cooldown>9</cooldown>
309:			<cooldown>8</cooldown>
--- reproduction ---
SPD  6: mod=0.995000  5s->4.96  10s->9.92  9s->8.92  <== matches ledger
SPD 10: mod=0.991667  5s->4.96  10s->9.92  9s->8.92  <== matches ledger
- **Overturns:** "Chi Punch (10/20 dmg, cost 2, cd 4.96s); Replenish Focus (cost 5, cd 9.92→8.92s)"
- **Lane impact:** L2: config must encode the integers 5/10/9 and compute the display, not hard-code the decimals. Also shows the ledger truncated Focus to two levels — it has three (cd 8 at L3).

### `skills-meters/per-level-effect-numbers` — HELD [A2] ⚑ OVERTURNS LEDGER

The single biggest under-claim: 135 of the 182 level rows carry a verbatim numeric effect string in the recovered string table — damage, damage/sec caps, chi-steal, durations, dodge percentages, slot counts — so no projectile-class reading is needed for them.

- **Cite:** `reference/extracted/skilldata.xml <level><desc> ids 7000-7095 joined to docs/gauntlet/L0/index/strings.json; cross-checked in code at shs3_android_payload/scripts/ChiPunchProjectile.as:20-31`
- **Quote:** 7064 -> '10 damage'   7065 -> '20 damage'   7066 -> '30 damage'
7072 -> 'Steal 20 chi'  7074 -> 'Steal 50 chi'
7075 -> '20 damage/sec, max 200 damage'
7078 -> '500 damage, 5 sec delay'
7004 -> '60% chance to dodge enemy attacks when rolling'
7013 -> '8 skill slots'
- **Overturns:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — *read skill cards in a preserved build.*"
- **Lane impact:** L2: the whole tree can be transcribed to config with numeric effects attached. Also settles two things outside the lane — Roll (60/80/100%) is what buys evasion, not Focus (correcting project memory 'Focus buys evasion'), and the base hotbar is 3 slots growing to 8 (answers L8/ui-hud blocker ④).

### `skills-meters/per-stance-reach-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

Combat-core's #1 blocker (reach cap in stage px per stance) is fully held: baseSlashLength = 120 + floor((90 + DAN*5) * SPD/(20+SPD)), then Light x1.4, Balanced x1.0->1.2, Heavy x0.5->0.9 floored at 100 px, Dual x1.4, Reversed x1.0 floored at 100.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3146 (setStance) and §1t1523s0§.as:2344-2348 (base)`
- **Quote:** 3094:               this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3105:               this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3116:               this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
3119:                  this.§1t4417s0§ = 100;
---
2346:         var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5;
2347:         return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale)"
- **Lane impact:** L5: closes the blocker the ledger calls 'the one value the whole model needs'. §3's wiki 300/200/100 reconciles at the SPD asymptote (1.4x210=294 / 210 / 105) — I flag that last step as inference from A2, not measurement. §3's 'Heavy's reach also scales x0.5->x0.9' is exactly right.

### `skills-meters/shunpo-effect` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Ledger blocker ② is half closed: Shunpo is the Light-stance capstone at mastery 10, costs 50 chi on a 60s cooldown, and is a hold-to-charge damage skill — but its 250px/3s teleport geometry is Android-only and I will not promote it to web fact.

- **Cite:** `reference/extracted/skilldata.xml:1234-1246 with strings 6082/6085; Android-only mechanics at shs3_android_payload/scripts/MCSPlayer.as:1705-1706, 1747-1753`
- **Quote:** 1235:		<id>1039</id>
1236:		<displayname>6082</displayname>
1238:		<req><has><id>1000</id><qty>10</qty></has></req>
1244:			<chi>50</chi>
1245:			<cooldown>60</cooldown>
---
6085 -> 'Ultimate Light Stance technique. \n\nHold down the skill icon to increase the damage it inflicts.\n\nThis skill can only be used when in Light Stance.'
- **Overturns:** "② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the **predecessor SHS2**, not Duels)."
- **Lane impact:** L2: gating, cost, cooldown and the charge-to-increase-damage rule are codeable now; the 250 px flash-step and 3s charge window need a web-bundle cross-check first, because the crit/stance/SPD constants all diverge between builds. The ledger's negative half (no spacebar slow-mo) stands — there is no slow-motion in any Shunpo path in either bundle.

### `skills-meters/spd-cooldown-cap-600` — HELD [A2] ⚑ OVERTURNS LEDGER

Ledger blocker ④ is dead — and the cap is 600, not the 300 that the readable Android build shows: web cooldownModifier = 1 - min(SPD,600)/600 x 0.5.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2296; call chain via §1t105s0§.as:297-318 (XMLSkill.getCooldown)`
- **Quote:** 2291:         if(param1 > 600)
2293:            param1 = 600;
2295:         return 1 - param1 / 600 * 0.5;
- **Overturns:** "④ SPD→cooldown formula."
- **Lane impact:** L2: cooldown pipeline is XML seconds -> x24 frames -> x SPD modifier -> /24 -> 2dp for display. Also corrects the previous (UNVERIFIED) L0 survey, which banked the Android cap of 300.

### `skills-meters/stance-damage-ceiling-is-mastery-10` — HELD [A2] ⚑ OVERTURNS LEDGER

§3.3's stance damage table 0.9/1.2/1.4 is exactly right and is the web build's per-stance damage multiplier — but the ceiling index is mastery 10, not 9; the coefficient is x0.1 per level and the mastery skills have ten levels.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3259-3271; mastery source at shs3_android_payload/scripts/StatsManager.as:1834 (getStat(1000)/(1001)/(1002))`
- **Quote:** 3262:               _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);
3265:               _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3270:               _loc2_ = _loc1_ * 1.4;
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L5/L2: Light = 0.5 + 0.04*M, Balanced = 1.0 + 0.02*M, Heavy/Dual/Reversed = flat 1.4, M in 0..10. Coding a mastery-9 ceiling ships Light at 0.86 and Balanced at 1.18 — both wrong.

### `skills-meters/string-table-resolves-all-73` — HELD [A2] ⚑ OVERTURNS LEDGER

GAUNTLET §2.1's string-table blocker is dead for this system: all 73 skills that carry a <displayname> resolve, with 0 misses, and their descriptions come with them.

- **Cite:** `docs/gauntlet/L0/index/resolved_names.json -> skilldata.xml -> misses: 0, rows_resolved: 73, miss_sample: []; source blob reference/extracted/android/118_Mobile_Lang_EN.bin`
- **Quote:** '6000' -> 'Light Stance Mastery'
'6018' -> 'Smoke Bomb'
'6042' -> 'Stab'
'6047' -> 'When target is downed, draw a downward line to stab him for massive damage.'
- **Overturns:** "### skills-meters — 33"
- **Lane impact:** L1b is DONE for L2 — the lane's blocking dependency ('needs L1b for names') is satisfied. Caveat that survives: the table is the ANDROID one, it is not identical to the web build's (web string 960 is absent from it), and some phrasing is touch-specific ('Hold down the skill icon'); label ported UI copy as Android-sourced. This also corrects the previous UNVERIFIED survey, which graded the table PARTIAL and said it was 'not on disk here'.

### `skills-meters/ten-categories-all-named` — HELD [A2] ⚑ OVERTURNS LEDGER

The Ready bullet undercounts by four: the skill screen builds TEN player categories (Light / Balanced / Heavy / Chi / Survival / Ninja / Fire / Water / Wind / Earth), all now named verbatim; the data file's eleventh category is NPC-only.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/SkillScreenUI.as:84,103-104, joined to docs/gauntlet/L0/index/strings.json ids 6024-6033; category domain from docs/gauntlet/L0/index/skilldata.json (distinct_values 11, range [1,11])`
- **Quote:**  84:      internal var categoryCount:int = 10;
103:         this.categoryIcons = [1,2,3,4,5,6,7,8,9,10];
104:         this.categoryDesc = [6024,6025,6026,6027,6028,6029,6030,6031,6032,6033];
---
6027 -> 'Chi Skills\n\nSkills that channel chi to create protective and offensive effects.'
6028 -> 'Survival Skills\n\nGeneral skills that make life easier.'
6029 -> 'Ninja Skills\n\nSkills that are based on stealth, deception and illusion.'
- **Overturns:** "full 6-category tree structure + per-stance unlock levels"
- **Lane impact:** L2: ten tabs, not six. Category 11 (Back Throw, Air Stab, Bull Charge, Punch Lunge, Undying, 1500, 1501) has no <order> and no <lvlreq> and is absent from SkillScreenUI — it is enemy moveset data, so it belongs to L4 not L2. Cross-lane to L11/rebirth-elements: cats 7-10 are its '4 elements x 6 named skills', all 24 now named, costed, cooldowned and per-level-numbered, gating on 10/10/10/30/30/60 units of the element item — its blocker ① 'what each element does' is mostly closed by THIS lane's evidence.

### `skills-meters/150pct-damage-is-a-food-buff` — HELD [A2]

Correction to the previous UNVERIFIED survey: the frames' yellow '150% DAMAGE' is the BUFF_ATTACK food buff (minDamage x1.5), not evidence of a Heavy-stance multiplier — and the ledger's own §3 crux note (Potato Dog) was right all along.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/OverworldHUD.as:1402-1404 and MCSPlayer.as:210-223; item copy string 4132`
- **Quote:** 1402:            else if(bufftype == StatsManager.BUFF_ATTACK)
1404:               buffstr = "150% DAMAGE";
---
210:            if(StatsManager.hasBuff(StatsManager.BUFF_ATTACK))
212:               this.minDamage *= 1.5;
---
4132 -> 'Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a time.'
- **Overturns:** "Also visible: player HP **20/20**, **"150% DAMAGE"** buff (Potato Dog), **"CANNOT CHANGE STANCE"**"
- **Lane impact:** L5/L10: the buff multiplies minDamage ONLY (not damageRange), and buffs are mutually exclusive (an else-if chain, and the item copy says so). Under the web build Heavy is x1.4 anyway, so the coincidence the previous survey rested on does not exist in v0.717.

### `skills-meters/crit-mult-is-1.3-ledger-vindicated` — HELD [A2]

The ledger's CRIT_MULT=1.3 is CORRECT for the shipped web build v0.717 — and the previous UNVERIFIED L0 survey was wrong to overturn it, because it read the Android build (which was retuned to 1.5 Light / 1.2 other).

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277 (web getDamage), vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3219-3221 (android)`
- **Quote:** web  3274:            return _loc2_ * 1.3 + this.§1t1243s0§;
android 3219:               return maxDamage * 1.2 + this.STAT_CRITICALDMG;
android 3221:            return maxDamage * 1.5 + this.STAT_CRITICALDMG;
- **Overturns:** "crit = 1.3× formula."
- **Lane impact:** L5: keep CRIT_MULT=1.3, flat across stances, plus an ADDITIVE gear term STAT_CRITICALDMG (stat 204, gear-only via findBonusStat). Coding the previous survey's 1.5/1.2 would have mistuned every critical hit in the game.

### `skills-meters/frame-cracks-web-string-960` — HELD [A1]

A1 cracks a web-only string the recovered table does not contain: string 960 = 'CANNOT CHANGE STANCE', rendered light-grey in the empty focus bar.

- **Cite:** `reference/frames/combat_analysis/Nr4fQstqHDM_t428.0.png — crop (60,880)-(1020,1080) upscaled 3x Lanczos; paired with reference/decompiled/shs3_payload/scripts/§1t113s0§.as:110-111`
- **Quote:** Visibly in the crop: red portrait ring, green 20/20 (full), blue 26/26 (full), a third bar EMPTY/brown carrying light-grey text 'CANNOT CHANGE STANCE', yellow '150% DAMAGE' beneath.
---
110:         this.§1t5203s0§ = "<font color='#000000'>" + §1t1521s0§.getString(175) + "</font>";
111:         this.§1t5204s0§ = "<font color='#BBBBBB'>" + §1t1521s0§.getString(960) + "</font>";
- **Overturns:** "### skills-meters — 33"
- **Lane impact:** L2/L8: one text field, three states of the same bar (empty = refusal caption grey #BBBBBB, partial = hidden, full = crit caption black #000000). The frame renders ALL CAPS while table row 175 is 'Critical Hit' — the field uppercases, so THE FRAME WINS: ship the caps. Bonus for L7: §1t113s0§.as:352 fires a named SFX event 'Snd_criticalDamage' on the same transition.

### `skills-meters/frame-crit-appears-at-exactly-full` — HELD [A1]

A1, measured: the crit caption is absent when the third bar reads 98.0% full and present when it reads 100% — the on-screen proof that crit is an exactly-full equality, not a probability.

- **Cite:** `reference/frames/session11/gap-focus-trigger/m_nearfull.png — crops (640,0)-(1800,390) and (640,390)-(1800,780), each upscaled 2x Lanczos; fill widths then measured in the original`
- **Quote:** Visibly in the top crop: green 11/20, blue 47/47, a white third bar with NO text, yellow '150% DAMAGE'. Bottom crop: identical 11/20 and 47/47, the same white bar now carrying BLACK text 'CRITICAL HIT'. Measured: track (blue at 47/47) x736->1540 = 805 px; TOP white x737->1525 = 789 px = 98.0%; BOT white x737->1540 = 804 px = 100%.
- **Overturns:** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L2's done-condition 'meters on-screen match A1' now has its reference measurement. Frame and payload agree here; had they disagreed the frame would win.

### `skills-meters/skill-vfx-anim-audio` — STILL_UNHELD [STILL_UNHELD]

Still unheld: nothing in this pass touches how a skill looks or sounds — cast poses, charge tells, hit sparks, screen-shake, the Shunpo streak, per-skill SFX.

- **Lane impact:** L6/L7: reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin is the likely home of the animation sets and is unopened; the audio resource blobs are CWS-encrypted (Stage-0b S0-5). One SFX EVENT NAME was recovered ('Snd_criticalDamage', §1t113s0§.as:352) — the event and its exact trigger are held, the waveform is not.

### `skills-meters/skilldata-byte-identical-across-builds` — HELD [A3]

Byte-check: the Android v0.682 skilldata blob is the web v0.717 skilldata.xml byte-for-byte across all 39,003 bytes, plus only a 40-byte XML declaration and one trailing CRLF — so every id, cost, cooldown, lvlreq, order, category and prerequisite edge in this survey is web-build fact.

- **Cite:** `byte comparison of reference/extracted/android/117_Mobile_SkillData.bin against reference/extracted/skilldata.xml (python3 prefix/suffix diff, run this session)`
- **Quote:** android len 39045 web len 39003 delta 42
android first 40: b'<?xml version="1.0" encoding="utf-8"?>\r\n'
common prefix identical for 39003 bytes
tail android: b'>\r\n\t</skill>\r\n\r\n</skilldata>\r\n'
tail web:   b'el>\r\n\t</skill>\r\n\r\n</skilldata>'
- **Overturns:** "### skills-meters — 33"
- **Lane impact:** L2: kills the standing Stage-0b S0-3 caveat ('combat tuning parity is NOT established') for this system's DATA. It emphatically survives for this system's CODE — see the crit, stance and SPD-cap divergences. Rule for every downstream lane: Android XML is web-true, Android AS3 is not.

### `skills-meters/stab-is-a-passive-tree-node` — HELD [A2]

The Surface bullet survives contact with the payload intact: 'Stab' (id 1018) is Heavy category, prerequisite Heavy Stance Mastery 3, marked <passive>1</passive>, and canEquip() returns false for passives so it can never occupy a hotbar slot.

- **Cite:** `reference/extracted/skilldata.xml:721-727; reference/decompiled/shs3_android_payload/scripts/XMLSkill.as:345-348 and MCSPlayer.as:3147-3151`
- **Quote:** 721:		<id>1018</id>
722:		<displayname>6042</displayname>
724:		<req><has><id>1002</id><qty>3</qty></has></req>
725:		<passive>1</passive>
727:		<category>3</category>
---
347:         return !this.passive && StatsManager.getStat(this.id) > 0 && (StatsManager.getLevel() >= this.lvlreq || StatsManager.canEquipAllSkills);
- **Overturns:** ""Stab" is Heavy L3 "Heavy Stab," a tree node, not a hotbar skill."
- **Lane impact:** L2: the full per-stance capability ladder falls out — Light 1014/1036/1015/1039-Shunpo, Balanced 1016/1037/1017/1040-Thousand-Stabs, Heavy 1018-Stab/1038/1019/1041-Deadly-Cleave at mastery 3/4/5/10. One disambiguation the ledger misses: Thousand Stabs (1040) is the BALANCED capstone, a different node from the Heavy canStab.

### `skills-meters/ultimates-and-elemental-projectile-constants` — STILL_UNHELD [STILL_UNHELD]

Still unheld: 47 of 182 level rows resolve to an empty effect string, clustered on the three stance ultimates, Mass Shadow Clone, the four elemental AoEs' level rows, the eight elemental kunai/traps and both dashes — their damage is computed in projectile classes, not tabled.

- **Lane impact:** L2: this is now a TWO-step gap, not the one-step 'read 40 projectile files' a prior pass assumed — the ~40 *Projectile.as classes are Android, and this survey proves Android combat constants are retuned, so each must then be located in the obfuscated web bundle by constant-pattern grep (the method that found getDamage this pass). Four of the blanks are partly covered by their skill-level <desc> ('150% Fire ATK', Deadly Touch's '10 damage for each chi point').

## ui-hud — re-scored 88

Pass 1 of this lane already moved ui-hud 57 -> 85 on the Android decompile; I re-derived its claims 1-18 independently and they hold, so 85 is the floor, not a contested number. +3 for three things Pass 1 left open or got wrong: (a) blocker (5) goes from "half closed" to "closed except symbol geometry" — DialogBox re-assigns its layout in ActionScript every show (button.x 340 / 270+425, msgText.y 187.5 vs 220, centre-if-<=2-lines), and the battle pause is a full behaviour spec (button hidden in duel/PvP, pauseScreen raised to top, any click resumes); (b) the screen-transition durations Pass 1 declared "unheld pending a follow-up" are constants in the same file and resolve by arithmetic to 17 frames / 708 ms for each shutter and exactly 24 frames / 1000 ms for the white fade; (c) an entire UI subsystem — 19-screen, 47-menu, 139-option InteractUI UIData with inventory gates and error copy — is on disk and appears in neither the ledger nor Pass 1. Held below 90 by real gaps, not caution: no assets.swf symbol geometry exported (BattleUI symbol2952, OptionsUI symbol1133, DialogBox symbol83, SkillSlotButton symbol2915 etc. are script-only exports), no icon manifest for the 139 icon ids, HUD chrome art still sealed in the encrypted 124_Mobile_ImageResource, the 800x690 friend-bar layout is code-held but appears in zero reference frames, and "(EQ:n) UX" is still ungrounded. Separately, P1 is a correctness hit that does not change the score but changes every other lane: the string-id mapping Pass 1 used is the wrong one.

### `ui-hud/dialogbox-metrics-in-code` — HELD [A2] ⚑ OVERTURNS LEDGER

Dialogue-box exact metrics are NOT locked inside an assets.swf symbol — DialogBox re-assigns button x, message y and text alignment in ActionScript on every show, so blocker (5)'s dialogue half is closed.

- **Cite:** `reference/decompiled/shs3_android/scripts/DialogBox.as:46,49,53,59,63,136,147`
- **Quote:** `this.button.x = 340;` (single-button) / `this.button.x = 270;` + `this.button2.x = 425;` (Yes/No); `this.msgText.y = 187.5;` when a button is shown else `this.msgText.y = 220;`; `myFormat.align = "center";` if `this.msgText.numLines <= 2` else `myFormat.align = "left";`
- **Overturns:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** ui-hud lane: closes the dialogue half of blocker (5) and upgrades this lane's Pass 1 claim 19 from PARTIAL ('exact pixel metrics ... the geometry lives in the symbol's shape/placement records inside assets.swf') — for DialogBox it demonstrably does not.

### `ui-hud/options-screen-complete` — HELD [A2] ⚑ OVERTURNS LEDGER

The Options screen is completely held — six XCheckBox toggles, two buttons, a title, two conditional hides — with all copy resolving verbatim through the resname table.

- **Cite:** `reference/decompiled/shs3_android/scripts/OptionsUI.as:34-43,44-51`
- **Quote:** `this.musiccheck.setText(LangManager.getString(6)); this.soundcheck.setText(LangManager.getString(7)); this.bloodcheck.setText(LangManager.getString(8)); this.chatcheck.setText(LangManager.getString(396)); this.recordcheck.setText(LangManager.getString(492)); this.fullscreencheck.setText(LangManager.getString(752)); this.backtomainmenubutton.setText(LangManager.getString(74)); this.closewindowbutton.setText(LangManager.getString(75));` -> Music / Sound / Blood / Chat notification / Record Duels / Full Screen / Title Screen / Return To Game, title = 'Options' (10). Hides: `if(StatsManager.hideB
- **Overturns:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** ui-hud lane: the options half of blocker (5). Adds three toggles Pass 1 missed (Chat notification 396, Record Duels 492, Full Screen 752).

### `ui-hud/pause-is-click-anywhere` — HELD [A2] ⚑ OVERTURNS LEDGER

The battle pause is fully specified in code: the pause button exists only outside duel/PvP, pressing it raises pauseScreen to the top of the display list, and any click anywhere resumes — there is no in-battle pause menu.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:179,267-272,324-328`
- **Quote:** `this.pausebutton.visible = !GameEngine.isDuelMode() && !GameEngine.isPvPRoomMode();` (:179); `if(GameEngine.isPaused){ GameEngine.setPaused(false); this.pauseScreen.visible = false; return true;` as the FIRST test in gotClicked (:267-272); `GameEngine.togglePaused(); this.pauseScreen.visible = true; setChildIndex(this.pauseScreen,numChildren - 1);` (:324-328)
- **Overturns:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** ui-hud lane: closes the pause half of blocker (5) as behaviour (the remaining unheld part is pixel geometry only, see ui-hud/hud-symbol-metrics).

### `ui-hud/skill-cooldown-12-step-quantised` — HELD [A2] ⚑ OVERTURNS LEDGER

The skill-slot cooldown sweep is quantised to exactly 12 steps with a 13th 'disabled' frame — the same no-tween, snap character as the HP/Chi bars — and the slot face doubles as a live ammo readout.

- **Cite:** `reference/decompiled/shs3_android/scripts/SkillSlotButton.as:220,146,110,114,153`
- **Quote:** `newframe = int(this.cooldown / this.cooldownmax * 12) + 1;` (:220); `this.shade.gotoAndStop(13);` in disableButton (:146); `this.levelText.text = String(StatsManager.getStat(2501));` for kunai/trap skills (:110) and `String(Math.floor(StatsManager.getStat(2501) / 4))` for Windmill (:114); stance-gated grey-out for SHUNPO/THOUSANDSTABS/DEADLYCLEAVE (:153)
- **Overturns:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** ui-hud lane: extends blocker (2) beyond Pass 1's bars/combo/vignette to the cooldown widget. Feeds skills-meters too (cooldownmax comes from XMLSkill.getCooldown(level), and stat 2501 is the kunai ammo pool).

### `ui-hud/tier3-video-repass-obsolete` — HELD [A2] ⚑ OVERTURNS LEDGER

Three of the five items the ledger's Tier-3 plan schedules for 'denser video re-passes' are ui-hud items that are already fully specified in source, so that work should not be funded.

- **Cite:** `reference/decompiled/shs3_android/scripts/TextProjectile.as:20-46 and MCSPlayer.as:3805 and DialogBox.as:46-63 and DuelIntroBar.as:22`
- **Quote:** `ttl = 12; ... this.velY = -5;` then `if(ttl < 10){ scaleX += 0.1; scaleY += 0.1; if(ttl < 4){ alpha -= 0.25; } }` (TextProjectile.as:20-46); spawn `ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),damagetextcol);` (MCSPlayer.as:3805); dialogue metrics per DialogBox.as:46-63; `addFrameScript(0,this.frame1,19,this.frame20,68,this.frame69,87,this.frame88);` (DuelIntroBar.as:22).
- **Overturns:** "- Archer moveset at full fps; VS/FIGHT exact ms; damage-popup animation; dialogue-box metrics; overworld HUD pixel geometry."
- **Lane impact:** ui-hud lane re-prioritises the ledger's close-path: of the five Tier-3 items, VS/FIGHT exact ms, damage-popup animation and dialogue-box metrics are closed from source; only overworld HUD pixel geometry still needs work, and that is a JPEXS symbol export, not a video re-pass.

### `ui-hud/typography-edo-sz` — HELD [A2] ⚑ OVERTURNS LEDGER

HUD and tooltip typography is specified inside the WEB payload's own TextField defaults — Edo SZ at 13/14 px #cccccc for body and 16 px #ffffff for headings — so it carries no Android-build caveat.

- **Cite:** `reference/extracted/ui_strings.txt:100,206,314`
- **Quote:** `...physical dmg: 1234 - 1235 &nbsp;(heavy)critical dmg: 1234-1235 *(heavy)piercing dmg: 20<font face="Edo SZ" size="14" color="#cccccc" letterSpacing="0.` (:100); `aaa<font face="Edo SZ" size="16" color="#ffffff" letterSpacing="0.` (:206); `hp: 123 / 123 &nbsp;(hp regen 12 ) chi: 123 / 434 &nbsp;(chi regen 13)<font face="Edo SZ" size="14" color="#cccccc" letterSpacing="0.00" kerning` (:314). LangManager.initTextField turns embedFonts off only for Chinese/Japanese (LangManager.as:127-137), so Edo SZ is embedded and authoritative for EN.
- **Overturns:** "② font (unidentified)."
- **Lane impact:** ui-hud lane supplies the missing spec for every HUD text field; also closes the art-anim-audio-feel blocker (2) 'font (unidentified)' with sizes, colours, letterSpacing and kerning attached, not just a face name (this extends Stage-0 finding S0-2).

### `ui-hud/690-friend-bar-never-filmed` — PARTIAL [A1]

The 800x690 'friend bar' layout that Pass 1 found in code is exercised in zero reference frames — every captured session ran the 480 layout — so it is code-held but frame-unverified and must be labelled INFERRED-from-source if built.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png, duel_frames/Nr4fQstqHDM_t425.0s.png, zFt_combat/zFtCaTO0_1M_t0320s.png, zFt_combat/zFtCaTO0_1M_t0325s.png`
- **Quote:** Per-column max-luminance content extents (threshold >25) over full 1920x1080 frames: video B 52->1867 (width 1816, aspect 1.682) in duel_dense/_427.0, _427.1, _427.2, _431.5 and duel_frames/_t425.0s; video A 55->1861 (1807, aspect 1.673) and 54->1861 (1808, 1.674). Rows 0->1079 in all — no letterbox, pillarbox only. All approximately 5:3, none approximately 800/690 = 1.159.
- **Lane impact:** ui-hud lane: bounds Pass 1's claim 2 (dual-layout 480/690). The layout exists in code but nobody has ever seen it rendered; a rebuild that ships it is authoring, not copying. Independently replicates Pass 1's pillarbox measurement to the pixel (52/1816 and 55/1807).

### `ui-hud/hud-symbol-metrics` — STILL_UNHELD [STILL_UNHELD]

HUD panel/bar/plaque pixel geometry, the icon manifest, and the identity of the gold up-arrow skill in slot 3 remain ungrounded — I will not name any of them.

- **Lane impact:** ui-hud lane: the residual after P3/P4/P5. Every HUD class is [Embed(source="/_assets/assets.swf", symbol="symbolNNNN")] (BattleUI 2952, OptionsUI 1133, DialogBox 83, SkillSlotButton 2915, WinUI 2894, BattleIntroBar 2855, DuelIntroBar 2861, ScreenTransition 2758) and only scripts/ was exported, so symbol geometry is not on disk; the 139 <icon> ids in 90_InteractUI_UIData.bin map to unextracted art; and the slot-3 up-arrow is an equipped-skill image from ResourceManager.getSkillImage (NOT the stance control, which is bound to battlemodebust) but which skill is unproven. Closing all three is one JPEXS shape/sprite export away.

### `ui-hud/interactui-menu-system` — HELD [A2]

An entire data-driven interaction-UI subsystem — 19 screens, 47 menu pages, 139 options with icons, inventory gates and error copy — is on disk and is mentioned by neither the ledger's ui-hud block nor Pass 1.

- **Cite:** `reference/extracted/android/90_InteractUI_UIData.bin:5-9,17`
- **Quote:** `<title>peddler</title>` then `<option><label>83</label><icon>15</icon><action><id>peddlerbuy</id></action></option> <!-- buy buyicon-->`; and the gated form `<option><label>269</label><icon>1</icon><condition><has><id>20040</id><qty>1</qty></has></condition><action><id>goto</id><param>1</param>...<errormsg>270</errormsg></action></option> <!-- "sell crops" shopicon "you don't have any crops for sale" -->`. Root <uidata>, 20,947 bytes: 19 <ui>/<title>, 47 <menu>, 139 <option>, 139 <icon>, 28 <condition><has>, 67 <param>. Titles at lines 5/14/47/66/73/82/94/109/117/142/161/190/219/227/249/257/2
- **Lane impact:** ui-hud lane under-claim: the Ready bullet list (combat HUD, VS/FIGHT, result cards, overworld HUD, ribbon, minimap, parchment chrome, login/char-create) omits the town interaction UI entirely. Directly feeds economy (peddler/market/bank/blacksmith/gambling den option sets), world-exploration (stables, towntoll, vegpatch), rebirth-elements (a 'rebirth' screen exists) and meta-social (leaveclan, joincustomclan*).

### `ui-hud/langmanager-uses-resname-not-id` — HELD [A1]

LangManager.getString() is keyed by the XLIFF resname attribute, not the id attribute, so every string id Pass 1 of this lane quoted above 211 is wrong — and a video frame, not a document, is what proves it.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop (40,0)-(560,200), upscaled 3x) adjudicating reference/decompiled/shs3_android/scripts/BattleUI.as:124`
- **Quote:** BattleUI.as:124 reads `this.autoslashofflabel.text = LangManager.getString(619);`. Under resname (docs/gauntlet/L0/index/strings.json) 619 = 'Auto Slash Off'; under the id attribute 619 = 'Special Event'. The crop shows a brown plaque top-left reading AUTO SLASH OFF. Raw blob: `<trans-unit id="0" resname="0">`; first divergence `id="212" resname="222"` (source 'CHI'); 2,343 of 2,555 units have id != resname because 649 carry non-numeric resnames (first `id="1906" resname="IDS_Q0TITLE"`).
- **Lane impact:** Cross-lane, not just ui-hud: any lane that quoted a Mobile_Lang_EN id above 211 must re-derive it against strings.json resnames. Concretely corrects this lane's own Pass 1: 'Pause state string is id 388 "Game Paused"' is wrong (resname 388 = 'Condition: Poor'; 'Game Paused' is resname 407), and 'id 1506 Skill Slots+, ids 1648/1649/1650' should be resnames 6014 and 7009/7010/7011. Pass 1's getString(104)='FIGHT!' is below the divergence point and survives. THE FRAME WINS over both maps.

### `ui-hud/result-cards-exact` — HELD [A2]

The win/lose result cards are an 11-frame timeline with exact beats, a DRAW variant the ledger never mentions, and a revive-for-gold paywall on the lose card.

- **Cite:** `reference/decompiled/shs3_android/scripts/WinUI.as:26,32-37,49-55,90 and LoseUI.as:35-36,45,53`
- **Quote:** `addFrameScript(0,this.frame1,6,this.frame7,10,this.frame11);` — brush stroke frames 1-6, winwords appears frame 7 (250 ms @24fps), stop() frame 11 (417 ms). `if(!BattleUI.instance.getIsDraw()){ this.winwords.gotoAndStop(1); } else { this.winwords.gotoAndStop(2); }`. Buttons resname 482 'Continue' + 483 'Save Replay', shown only `if(NetworkManager.instance.isRecording())`; on save `this.urltext.text = "http://www.strawhatsamuraiduels.com/watch?name=" + StatsManager.charname;`. LoseUI: respawnbutton resname 480 'Respawn' (483 when recording) plus `gold`, `getgoldpromptdialog`, `payui`.
- **Lane impact:** ui-hud lane: upgrades the Ready bullet 'result cards' from structural to frame-exact and adds an unlisted DRAW state. Touches economy (the lose card is a gold-gated revive prompt) and meta-social (replay URL).

### `ui-hud/slot-geometry-frame-validated` — HELD [A1]

The Android v0.682 source predicts the web v0.717 video frame's skill-slot layout to within ~1 px, which is the strongest build-parity evidence in this lane and retires the 'android parity not established' caveat for the combat HUD.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop (1380,920)-(1880,1080), upscaled 3x) vs reference/decompiled/shs3_android/scripts/BattleUI.as:133-134`
- **Quote:** Visible in the crop: three slot boxes, leftmost empty AND unnumbered, middle labelled 2, right labelled 3 holding a gold up-arrow. Measured empty-box bright border: columns 1449->1558 (centre 1503.5), rows 952->1073 (centre 1012.5). Converting with this video's own pillarbox (x0=52, content width 1816, scale 2.270) gives game (639.4, 446.0); code says `skillSlotButton.x = 760 - i * 60; skillSlotButton.y = 450;` i.e. (640, 450) for i=2. Measured pitch 137 frame px = 60.4 game px vs 60.
- **Lane impact:** ui-hud lane: converts Pass 1's rule-level claim into a measured frame<->code match, and licenses using the Android decompile as a source of web-build HUD geometry. Unnumbered empty slot matches initEmpty() clearing keypressText (SkillSlotButton.as:128).

### `ui-hud/transition-durations-exact` — HELD [A2]

Screen-transition durations are constants in the shipped code and resolve exactly: each black shutter takes 17 frames (708 ms) and the white fade takes exactly 24 frames (1000 ms) at the SWF's 24 fps.

- **Cite:** `reference/decompiled/shs3_android/scripts/ScreenTransition.as:80-88,111,143-146,159-162`
- **Quote:** `this.blackup.y = -240; this.blackdown.y = 480; this.blackMovtSpeed = 0; this.counter = 0;` (:143-146) then per frame `this.blackup.y += this.blackMovtSpeed; this.blackdown.y -= this.blackMovtSpeed; this.blackMovtSpeed += 2; if(this.blackup.y >= 0){ this.blackup.y = 0; this.blackdown.y = 240; if(this.counter >= 17)` (:80-88), and `this.white.alpha -= 1 / 24;` (:111). Speed applies before it increments, so displacement after n frames is (n-2)(n-1); (17-2)(17-1) = 240 exactly, which is why the gate is counter >= 17.
- **Lane impact:** ui-hud lane: overturns this lane's own Pass 1 claim 21 ('the durations are driven by blackMovtSpeed and per-call counter values I did not trace to constants this pass ... Claiming either would be guessing. Unheld pending a follow-up.'). Also confirms the ledger's Ready bullet 'transition timings' and supplies a third independent confirmation of the 480-px stage height (shutter halves park at +/-240 and meet at 240).

## unassigned — re-scored ?

### `combat-core/36-was-not-a-crit` — HELD [A1] ⚑ OVERTURNS LEDGER

The repo's only numeric basis for 'crit 1.3' (red 36 vs 27 on the same target) is dead: the crit bar was EMPTY on every frame of that fight, so 27/30/36 is a random damage roll — frame proof of the RNG term in getDamage().

- **Cite:** `reference/frames/session11/damage-ttk/t19*.png (18 frames), row-1032 crit-bar scan x∈[247,515]; plus t1961.900.png HUD crop (100,940)-(620,1080) LANCZOS x3`
- **Quote:** bar_px = 0 (0%) on all 18 frames t1940.000 … t1979.000. The t1961.900 HUD crop reads green 10/20, blue 20/20, and the third bar showing 'CANNOT CHANGE STANCE' — i.e. reload < maxreload/6 (MCSPlayer.as:2977), so a crit was impossible. The red '36' popup lands on JINBEI (4) in that same frame.
- **Overturns:** "36/27 = 1.333 does match the forum-derived "crit 1.3""
- **Lane impact:** L5 — closes the 'crit 1.3' folklore from the frame side as well as the source side, and gives the next measurer a real crit-detection protocol: pair every popup value with the third bar's state in the same frame (full + 'CRITICAL HIT' = crit, anything else = roll).

### `combat-core/basereload-is-dead-code` — HELD [A2] ⚑ OVERTURNS LEDGER

getBaseReload() = 48 + SPD·6 is computed, passed into initPlayer and stored, and then never read anywhere — it is dead code in both builds, so there is no speed-scaled crit-meter refill to implement.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1839-1842 and MCSPlayer.as:105, :182, :190; exhaustive grep over reference/decompiled/shs3_android/scripts/`
- **Quote:** StatsManager.as:1841  return 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6;   ///   MCSPlayer.as:190  this.baseReload = baseReload;   ///   grep -rn baseReload → MCSPlayer.as:105,182,190 · EnemyClone.as:49 · EnemyPlayer.as:754 · EnemyElite.as:99 · FriendlyElite.as:49 — no read site anywhere
- **Overturns:** "an entire third combat resource with a full economy (refill 48 + SPD·6, weapon-driven slashUsage floored at 48, bonusReload +6, stance-switch tax) that no ledger system records"
- **Lane impact:** L5 + L2 — do NOT build a SPD-scaled meter refill. SPD affects reach (via the 20+SPD soft-cap) and skill cooldowns, not crit-meter charge rate.

### `combat-core/basereload-is-dead-code` — HELD [A2] ⚑ OVERTURNS LEDGER

getBaseReload() = 48 + SPD·6 is passed into initPlayer, stored, and NEVER read — the crit meter fills at a flat ++reload per frame, so SPD does not accelerate crit charging in v0.682.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:105, :182, :190 (the only three occurrences in the class) vs :1158-1160; StatsManager.as:1840-1843`
- **Quote:** MCSPlayer.as:105 `internal var baseReload:int = 48;` · :190 `this.baseReload = baseReload;` · and the actual fill: :1158 `if(this.reload < this.maxreload)` :1160 `++this.reload;`. A grep of `baseReload` across all 2,768 android scripts finds only declarations, the initPlayer parameter, the assignment, and EnemyClone.as:49 copying it — no read site that affects the meter.
- **Overturns:** "an entire third combat resource with a full economy (refill 48 + SPD·6, weapon-driven slashUsage floored at 48, bonusReload +6, stance-switch tax)"
- **Lane impact:** L5 — do NOT put a SPD term in the crit-meter refill config. slashUsage (spend side) and the stance-switch tax are real; the 48 + SPD·6 refill is not.

### `combat-core/crit-track-268px-six-seconds` — HELD [A1] ⚑ OVERTURNS LEDGER

The crit/reload track is 268 px wide at 1080p (x 245..512), measured on a bar that is actually FULL — which makes the fill rate 45.0 px/s = 16.8 %/s and the empty→full sweep 5.96 s, not 5.8 s.

- **Cite:** `reference/frames/session11/gap-focus-trigger/t2175.933.png — white-pixel extent over rows 1026-1049, x∈[200,600]; HUD crop (100,940)-(620,1080) LANCZOS x3`
- **Quote:** bar white extent x 245 -> 512, width 268. The crop shows green 4/20, blue 47/47, and the third bar 100% solid white with 'CRITICAL HIT' printed across it. Rate from crit-focus/t1082.100 (edge 303) to t1082.900 (edge 339) = 36 px / 0.8 s = 45.0 px/s ⇒ 268/45.0 = 5.96 s. Independent third route: focusbar_scan2_videoB_fps15.tsv, edge 247 @ t2170.000 → 512 @ t2176.000 = 6.000 s.
- **Overturns:** "Measured on frames, the web build's crit meter fills at ~17.3%/s (≈5.8 s end to end)"
- **Lane impact:** L5 + L8 — build the meter at 6.0 s, and use 268 px / x 245..512 as the HUD track geometry for all three bars. Measuring a bar's track on an EMPTY bar is the error mode; measure it on a full one.

### `combat-core/formula-resolves-c2-balanced-gap` — HELD [A4] ⚑ OVERTURNS LEDGER

The reach formula resolves COMBAT_MEASUREMENTS c-2's 'unresolvable' Balanced gap: balanced was measured on the level-1 tutorial where base = 124, which lands inside the measured 116–131 band, and Heavy's measured 97–103 plateau is the source's hard 100-px floor clamp rather than a mastery-9 ceiling.

- **Cite:** `docs/research/fidelity/COMBAT_MEASUREMENTS.md §(c) c-2 (frame-measured: Light plateau 233–241 / max 303 n=17; Balanced 116–131 n=17; Heavy 97–103 n=25) against reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2346-2347 and §1t99s0§.as:3094/:3105/:3116-3119`
- **Quote:** c-2: 'Balanced | 116–131 | 131 | 17 | wiki 200 | ❌ NOT CONFIRMED — measured 131' and '⚠️ The Balanced gap cannot be resolved from this footage … Light and Heavy were both measured on a level-8 character.' — vs base(SPD 1, dan 0) = 120 + floor(90·1/21) = 124, balanced = base × (1+0.02m) ≈ 124; heavy = max(base×(0.5+0.04m), 100) = 100.
- **Overturns:** "⚠️ **The Balanced gap cannot be resolved from this footage.**"
- **Lane impact:** L5 — three frame-measured reach numbers, taken at two different character levels, are reproduced by the v0.717 constants. That is the cross-build parity evidence the survey said did not exist, and it is positive for reach. It also retires the wiki's 300/200/100 triple for good: 200 was never a reach value.

### `combat-core/full-reload-crit-is-1p3-in-v0717` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 crit is a flat x1.3 on every stance when the reload gauge is full, plus the gear crit-damage affix - so the ledger's open 'crit 1.3 vs 3' question is closed at 1.3 for the shipped build.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276 (§1t1243s0§ = STAT_CRITICALDMG per the initAttackStats call at §1t1523s0§.as:2269; §1t4414s0§/§1t4415s0§ = reload/maxreload per :3162 and :3169); android v0.682 diverges at MCSPlayer.as:3215-3221`
- **Quote:** if(this.§1t4414s0§ == this.§1t4415s0§)
{
   return _loc2_ * 1.3 + this.§1t1243s0§;
}
return _loc2_;
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** L combat-core blocker (2) closed without a video frame. Also names the trigger the ledger lists as unknown ('the Focus/crit gating rule (fill trigger/amount/consumption)'): the gate is reload == maxreload, and android v0.682 splits it x1.2 non-Light / x1.5 Light, so the split is NOT in the shipped build.

### `combat-core/injured-buff-halves-reach` — HELD [A2] ⚑ OVERTURNS LEDGER

The INJURED buff halves base slash length alongside min damage and defence - a reach modifier neither the ledger nor the rebirth lane records.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:214-223`
- **Quote:** 216:    this.defense *= 1.5;
218: else if(StatsManager.hasBuff(StatsManager.BUFF_INJURED))
219: {
220:    this.minDamage *= 0.5;
221:    this.defense *= 0.5;
222:    this.baseSlashLength *= 0.5;
223: }
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale)"
- **Lane impact:** L-combat-core: reach is not a pure function of speed, Dan and stance - a status effect scales the base by 0.5 before the stance multiplier. Any reach test that does not control for BUFF_INJURED can measure the wrong number.

### `combat-core/mastery-caps-at-ten` — HELD [A2] ⚑ OVERTURNS LEDGER

Stance mastery is a 0-10 skill level, not 0-9 and not a 0-100 percentage, so the wiki's stance-damage table 0.9/1.2/1.4 is the mastery-TEN ceiling, and the v0.717 stance damage roll is Light x(0.5+0.4*m*0.1), Balanced x(1+0.2*m*0.1), Heavy/Dual/Reversed x1.4 flat.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3271 joined to reference/extracted/skilldata.xml skills 1000 (lines 3-80), 1001 (82-159), 1002 (161-238), each carrying exactly ten <level><value> rows 1..10; param binding at §1t99s0§.as:183-199`
- **Quote:** internal function §1t4475s0§() : int
{
   var _loc1_:int = this.minDamage + Math.random() * this.damageRange;
   switch(this.stance)
   {
      case §1t12220s0§:  _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);
      case §1t12221s0§:  _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
      case §1t12222s0§: case §1t12223s0§: case §1t12224s0§:  _loc2_ = _loc1_ * 1.4;
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L combat-core: 'mastery-9' becomes 'mastery-10' everywhere, and 0.5+0.4*10*0.1 = 0.9, 1+0.2*10*0.1 = 1.2, Heavy 1.4 reproduces the wiki table exactly. The ledger's 'level-1 Shugyosha does Light x0.5 / Balanced x1.0 / Heavy x1.4' is confirmed as the mastery-0 row.

### `combat-core/popup-colour-is-a-semantic` — HELD [A1] ⚑ OVERTURNS LEDGER

Damage-popup colour is a SEMANTIC, not a constant: black (0x000000) for damage the player takes, 0x990000 for damage dealt to anyone else, plus four element colours and a chi colour — so ui-hud blocker ③ closes on the rule, not on one hue.

- **Cite:** `reference/frames/session11/damage-ttk/t1960.000.png crop (760,500)-(900,620) LANCZOS x6, and t1961.900.png crop (470,580)-(680,700) LANCZOS x5`
- **Quote:** t1960.000: above the player (tag 'GUEST', HP 14/20) a fading '2' whose modal pixels over the sky are (140,160,180)/(140,140,180) — a black glyph alpha-fading, zero red dominance. t1961.900: above JINBEI (4) (enemy, HP bar ~55%) a red '36', core pixels (163,14,0). Source agrees: MCSPlayer.as:3542 `if(this.controlledBy == 0) ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),0);` :3546 `else ... ,10027008);`; element colours 16737792 / 13421772 / 26367 / 6697728 at :3551-3563 and chi 3394815 at :1633.
- **Overturns:** "damage popups spawn at (mcs.x, mcs.y-100) in 0x990000, closing ui-hud blocker ③"
- **Lane impact:** L8 — the HUD spec needs a colour TABLE keyed on victim and damage element, not a single popup colour; building the surveyor's version paints every hit the player takes dark red. L5 — the same branch is a free 'is this me' flag for the popup emitter.

### `combat-core/raw-frames-show-full-crit-meter` — HELD [A1] ⚑ OVERTURNS LEDGER

Two raw 1920×1080 video frames — not a montage — show the third HUD bar at 99% and then at 100% with CRITICAL HIT printed across it, permanently killing SESSION-11's 'the bar never once reached full (max 67.7%)' and 'OG has NO Critical meter'.

- **Cite:** `reference/frames/session11/gap-focus-trigger/t1746.733.png and t1747.000.png — crop (150,940)-(620,1070) upscaled 3× (LANCZOS); third full-bar frame at t2175.933.png`
- **Quote:** t1746.733: HP 11/20 green, Chi 47/47 blue, third bar solid white to a ~2 px brown sliver at the right end, no text. t1747.000 (0.267 s later): identical HP 11/20 and Chi 47/47, third bar 100% white with 'CRITICAL HIT' in dark caps across it. Found by scanning all 309 1920×1080 session11 frames for a contiguous white run on row y=1032 from x=246.
- **Overturns:** "SUMMARY: HEADLINE: our build's meter set is wrong. The OG has exactly three meters — HP (green), CHI (blue), and FOCUS (white, no numerals) — and NO Critical meter at all. ... CRIT: NOT FOUND, and this matters. Across ~845 s of sampled play the bar never once reached full (max 67.7% at B t=837.683)"
- **Lane impact:** L5 + L8 — the surveyor's own cite (m_nearfull.png) is a derived montage; these are its raw sources and are the citable artifacts. SESSION-11's 'Focus buys evasion, not crit' conclusion and its Critical-meter deletion recommendation both need re-opening.

### `combat-core/reach-and-crit-configs-already-correct` — HELD [A2] ⚑ OVERTURNS LEDGER

src/config/reach.ts's lightMult 1.4 / balancedPerMastery 0.02 / heavyPerMastery 0.04 and src/config/combat.ts's CRIT_MULT 1.3 are all EXACTLY the shipped web build's values — they must not be 'fixed' to the android numbers this unit recommends.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3119, :3274 vs src/config/reach.ts (REACH block) and src/config/combat.ts:17`
- **Quote:** §1t99s0§.as:3094  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;   :3105  * (1 + 0.2 * this.§1t4422s0§ * 0.1);   :3116-3119  * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); if(... < 100) { ... = 100; }   :3274  return _loc2_ * 1.3 + this.§1t1243s0§;   ///   reach.ts: lightMult: 1.4, balancedPerMastery: 0.02, heavyBase: 0.5, heavyPerMastery: 0.04, heavyFloor: 100   ///   combat.ts:17  export const CRIT_MULT = 1.3;
- **Overturns:** "three live constants in src/config/reach.ts and one in src/config/stances.ts are WRONG against the source and must be fixed before any of it is wired in"
- **Lane impact:** L5 — this is a DO-NOT-TOUCH ruling on four live constants that are already right and already labelled CONTRACT-SRC. Only stances.ts LAUNCH_UNLOCK_LEVEL.heavy (5, source 3 in both builds) is a genuine live bug.

### `combat-core/reach-table-is-mastery-zero` — HELD [A2] ⚑ OVERTURNS LEDGER

The stance REACH table is the mastery-ZERO case, not a ceiling: the v0.717 multipliers at mastery 0 are 1.4 : 1.0 : 0.5 = 2.8 : 2 : 1, which is the ledger's 300/200/100; at mastery 10 they become 1.4 : 1.2 : 0.9, which is nothing like 3:2:1.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116`
- **Quote:** 3094: * 1.4                    (LIGHT, mastery-independent)
3105: * (1 + 0.2 * m * 0.1)     (BALANCED, = 1.0 at m=0, 1.2 at m=10)
3116: * (0.5 + 0.4 * m * 0.1)   (HEAVY,    = 0.5 at m=0, 0.9 at m=10)
- **Overturns:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L-combat-core: the ledger's §3 correction is HALF wrong. Damage 0.9/1.2/1.4 is a mastery ceiling (see combat-core/mastery-is-small-integer) but reach 300/200/100 is the mastery-0 ratio. Treating reach as a ceiling would shrink every low-mastery stance reach in the rebuild.

### `combat-core/reach-table-is-mastery-zero-not-a-ceiling` — HELD [A2] ⚑ OVERTURNS LEDGER

The wiki reach table 300/200/100 is the mastery-ZERO base at high speed, not a mastery ceiling: base slash length asymptotes to 210 stage px at Dan 0, and the mastery-0 stance multipliers 1.4/1.0/0.5 give 294/210/105.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2344-2348 (base) combined with §1t99s0§.as:3094/3105/3116 (mastery-0 multipliers); android confirm StatsManager.as:1915-1919`
- **Quote:** internal static function §1t9593s0§(param1:int) : int
{
   var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5;
   return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));
}
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.**"
- **Lane impact:** L combat-core blocker (1): the damage table and the reach table are read off DIFFERENT rows of the mastery curve - damage at mastery 10, reach at mastery 0. The ledger sweeps both into one claim. At mastery 10 the reaches are 294/252/189, nothing like 300/200/100. Note the crossover the ledger misses: the mastery-scaled term is each stance's WEAK axis (Light's damage, Heavy's reach); its strong axis is a fixed 1.4.

### `combat-core/v0717-crit-is-flat-1.3` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ② resolves to 1.3 after all: the v0.717 build applies a flat ×1.3 plus a flat crit-damage stat at full meter, with no stance branch — so CRIT_MULT = 1.3 in src/config/combat.ts is already right.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276`
- **Quote:** if(this.§1t4414s0§ == this.§1t4415s0§) { return _loc2_ * 1.3 + this.§1t1243s0§; } return _loc2_;
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** L5 — blocker ② is closed at the TARGET build, in the ledger's own favour. The ×1.5/×1.2 split is a v0.682-only retune. SOURCE_CONSTANTS.md:158 additionally records a SECOND, stacking ×1.3 for body parts 12 neck / 16 head / 17 hat — which is the v0.717 answer to the survey's ×1.5 behead.

### `combat-core/v0717-stance-curves-are-already-in-config` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 web payload gives light reach ×1.4, balanced ×(1+0.02·mastery), heavy ×(0.5+0.04·mastery) floored at 100, and damage light ×(0.5+0.04·m) / balanced ×(1+0.02·m) / heavy ×1.4 — i.e. src/config/reach.ts is already correct and the survey's 'three wrong constants' would regress it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3119 (reach) and :3258-3271 (damage); build stamped 0.717 at §1t1523s0§.as:36`
- **Quote:** 3094: this.§1t4417s0§ = this.§1t4420s0§ * 1.4;  ·  3105: this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);  ·  3116-3119: this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }  ·  3262-3270: _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1); … _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1); … _loc2_ = _loc1_ * 1.4;
- **Overturns:** "- `STANCE_TABLE` already carries reach 300/200/120 + speed — but **never wired into `resolveSlash`** and mislabeled INFERRED when they're actually the wiki's **mastery-9** values (and Heavy should be 100, not 120)."
- **Lane impact:** L5 — do NOT touch src/config/reach.ts. lightMult 1.4, balancedPerMastery 0.02, heavyPerMastery 0.04, heavyFloor 100 are the target build's own numbers and were read from this file on 2026-07-25 (SOURCE_CONSTANTS.md:193, 204-206). The android 1.5/0.005/0.005 values are v0.682 and must never be quoted as 0.717.

### `combat-core/v0717-stance-multipliers` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 desktop client carries the full five-case stance slash-length switch and its numbers differ from the android v0.682 bundle in four of five cases: LIGHT x1.4 (not 1.5), BALANCED x(1 + 0.2*mastery*0.1), HEAVY x(0.5 + 0.4*mastery*0.1) floored at 100, REVERSED x1.4, DUAL x1.0 floored at 100.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3146 (compare reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3029-3082)`
- **Quote:** 3094: this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3105: this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3116: this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
3117: if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
3131: this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3142: this.§1t4417s0§ = this.§1t4420s0§;
- **Overturns:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L-combat-core: the stance reach model is now recovered from the SHIPPED v0.717 client rather than inferred, and the android values must NOT be used. It also kills the surveyor's 'parity is NOT established' framing and shows the 0.682-to-0.717 numeric drift is far worse than the '1 in 6' the lane reported - 4 of 5 branches moved in this one function.

### `combat-core/v0717-stance-slash-multipliers` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 desktop build's per-stance slash-length multipliers are on disk and differ from the android v0.682 set the survey adopted: Light and Reversed are x1.4 (not x1.5), Balanced is base*(1 + 0.2*balancedMastery*0.1), Heavy is base*(0.5 + 0.4*heavyMastery*0.1) floored at 100 px, Dual is base floored at 100 px.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3091-3155 (desktop MCSPlayer; identified because it defines §1t4446s0§, the initElementDefenseStats callee at §1t1523s0§.as:2270), param order pinned at :183-199`
- **Quote:** case §1t12220s0§:
   this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
case §1t12221s0§:
   this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
case §1t12222s0§:
   this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
   if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.** A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4 (Heavy is fixed); Heavy's *reach* also scales ×0.5→×0.9."
- **Lane impact:** L combat-core: the reach multipliers stop being android-only guesses. Also kills the survey's PARTIAL on rebirth/stance-slash-multipliers-parity - the surveyor's grep terms ('0.005', '0.5 + 0.5 *') exist in neither build, so its negative grep proved nothing.

### `combat-core/v0717-stance-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete v0.717 per-stance combat table — slash-length multiplier, damage multiplier, crit multiplier and defence multiplier — is on disk in the desktop bundle, so combat-core blocker ① needs no footage measurement and no playable build for its multipliers.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094/:3105/:3116-3119 + reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:2721-2748`
- **Quote:** §1t99s0§.as:3094  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;                                  // LIGHT slash\n§1t99s0§.as:3105  this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);   // BALANCED slash\n§1t99s0§.as:3116  this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1); // HEAVY slash, floor 100\n§1t5957s0§.as:2725-2728  _loc41_ = 0.5 + 0.4 * _loc46_ * 0.1;  _loc42_ = 1.3;  _loc47_ = 1;  _loc48_ = 1.4;   // LIGHT dmg/crit/def/slash\n§1t5957s0§.as:2735-2738  _loc41_ = 1 + 0.2 * _loc46_ * 0.1;    _loc42_ = 1.3;  _loc47_ = 1;  _loc48_ = 1 + 0.2 * _loc46_ * 0.
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** combat-core (L for combat-core): the per-stance multipliers are CONTRACT from the shipping v0.717 build — Light x1.4, Balanced x(1+0.02·mastery), Heavy x(0.5+0.04·mastery) floored at 100 — and mastery is a 0-10 scale, not 0-100. Combined with getBaseSlashLengthVal this gives Dan-0 reach of 294 (Light) / 210-252 (Balanced) / 105-189 floored to 100+ (Heavy) in display units. Only the stage-px:frame-px conversion still needs footage. Also confirms the ledger's dmg 0.9/1.2/1.4 as mastery-ceiling values and the banked 'crit 1.3' correction (crit is a flat 1.3 in ALL three stances in v0.717, vs android's 1.2/1.5).

### `combat-core/web-as3-is-readable` — HELD [A2] ⚑ OVERTURNS LEDGER

The shipped web build v0.717's full ActionScript is decompiled and cross-readable in the repo — 1,079 classes with obfuscated identifiers but intact numeric literals — so combat constants never needed to come from the android v0.682 build at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 (StatsManager, web) and §1t99s0§.as:9-19 (MCSPlayer, web); inventory count at reference/decompiled/payload_export.log:4`
- **Quote:** §1t1523s0§.as:36  public static var §1t9323s0§:Number = 0.717;   ///   §1t99s0§.as:9-19  internal static var standingRange:int = 50; ... internal static var jumpThreshhold:int = 100; ... internal static var lightSlashSpeed:int = 50; internal static var balancedSlashSpeed:int = 40; internal static var heavySlashSpeed:int = 30;   ///   payload_export.log:4  Exported script 1/1079 mx.core.mx_internal
- **Overturns:** "The web payload's own AS3 is obfuscated (reference/decompiled/shs3_payload/scripts/§1t51s0§/, 5 files) and cannot be cross-read."
- **Lane impact:** L5 + every lane that cited android source — the CONTRACT-SRC-v0.682 labelling policy this unit proposes is unnecessary; constants that match across both builds (base-reach formula, standingRange, jumpThreshhold, slash speeds, defence ×0.8, slashUsage floor 48, unlock ladder, RNG damage roll) can be promoted to plain CONTRACT today, and constants that differ must be taken from the WEB file.

### `combat-core/web-behead-is-1.3` — HELD [A2] ⚑ OVERTURNS LEDGER

The behead (hat/head/neck) multiplier in the shipped web build is ×1.3, not ×1.5.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:470-472 (vs reference/decompiled/shs3_android/scripts/NPC.as:451-453)`
- **Quote:** web §1t68s0§.as:470-472: `if(this.§1t1071s0§)\n{\n   _loc3_ *= 1.3;\n}`   ·   android NPC.as:451-453: `if(behead)\n{\n   damage *= 1.5;\n}`
- **Overturns:** "part-based weak points (shielder legs, undead heads)"
- **Lane impact:** L5 — universal head/neck/hat weak point confirmed in the shipped build, but at ×1.3. Note the pattern: v0.682 moved BOTH the crit multiplier and the behead multiplier off 1.3 and onto 1.5, so any android number near 1.5 should be treated as suspect until cross-read.

### `combat-core/web-build-as3-is-readable` — HELD [A2] ⚑ OVERTURNS LEDGER

The shipped web build's ActionScript is fully readable — 1079 decompiled classes under reference/decompiled/shs3_payload/, name-obfuscated but literal-intact — so every combat constant can be cross-read on v0.717 directly instead of being inferred from the android v0.682 client.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36 (build stamp) + docs/gauntlet/L0/index/actionscript.json bundles.shs3_payload = 1079`
- **Quote:** §1t1523s0§.as:36: `public static var §1t9323s0§:Number = 0.717;`  ·  actionscript.json: {"shs1":164,"shs2":366,"shs3_android":970,"shs3_android_payload":970,"shs3_loader":3,"shs3_payload":1079,"shs3_stage2":6,"shs3_stage3":9}  ·  `find reference/decompiled/shs3_payload -name '*.as' | wc -l` -> 1079  ·  `ls 'reference/decompiled/shs3_payload/scripts/§1t51s0§/' | wc -l` -> 1
- **Overturns:** "P0 EXPERIMENT RUN 2026-07-23: DEFINITIVELY no offline playable build ... ~40 INFERRED values won't be measured from a live build."
- **Lane impact:** L5 (and every other lane citing android source) — the whole 'android v0.682 is all we have, parity unproven' framing is wrong. Class map recovered by numeric-literal shape: §1t99s0§=MCSPlayer, §1t1523s0§=StatsManager, §1t113s0§=BattleUI, §1t1541s0§=InputManager, §1t67s0§=Damage, §1t68s0§=NPC, §1t122s0§=stat/enemy builder. ~40 INFERRED values are now readable from the shipped build without needing it to run.

### `combat-core/web-crit-is-1.3-flat` — HELD [A2] ⚑ OVERTURNS LEDGER

Crit in the shipped web build is a flat ×1.3 with no stance split — the ledger's 1.3 candidate was correct and src/config/combat.ts CRIT_MULT must NOT be changed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276`
- **Quote:** if(this.§1t4414s0§ == this.§1t4415s0§)\n{\n   return _loc2_ * 1.3 + this.§1t1243s0§;\n}\nreturn _loc2_;
- **Overturns:** "② crit 1.3 vs 3 final — *read one crit popup.*"
- **Lane impact:** L5 — blocker ② closes at 1.3, not at the survey's 1.2/1.5 split. Android v0.682's 1.2 (non-light) / 1.5 (light) is a version retune and must not be ported.

### `combat-core/web-heavy-damage-1.4` — HELD [A2] ⚑ OVERTURNS LEDGER

In the shipped build the heavy/dual/reversed damage multiplier is ×1.4, not ×1.5 — the same 1.4/1.5 android retune that hits light reach, so the reach↔damage permutation is 1.4-flat on both diagonals in v0.717.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3258-3271`
- **Quote:** var _loc1_:int = this.minDamage + Math.random() * this.damageRange; switch(this.stance) { case §1t12220s0§: _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1); break; case §1t12221s0§: _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1); break; case §1t12222s0§: case §1t12223s0§: case §1t12224s0§: _loc2_ = _loc1_ * 1.4; }
- **Overturns:** "the stance term is a mastery curve (light 0.5+0.005m, balanced 1+0.005m, heavy/dual/reversed flat 1.5) that is the exact permutation of the reach curves"
- **Lane impact:** L5 — the damage table for v0.717 is light ×(0.5+0.04m), balanced ×(1+0.02m), heavy/dual/reversed ×1.4; the RNG roll per slash (mulberry32, injected) is confirmed in both builds and is the real structural finding here.

### `combat-core/web-maxreload-192` — HELD [A2] ⚑ OVERTURNS LEDGER

The shipped crit/reload meter is 192 ticks with the first 48 hidden, refilling +1 per frame at 24.0 fps — exactly 6.000 s empty→full, which matches the repo's own frame regression to three decimals and dissolves the claimed source-vs-frame conflict.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 and :1203-1205; §1t113s0§.as:328; frame rate from the SWF header of reference/decrypted/shs3_payload_decoded.swf`
- **Quote:** §1t99s0§.as:249  this.§1t4415s0§ = 8 * 24;   ///   §1t113s0§.as:328  var _loc3_:Number = (param1 - 48) / (param2 - 48);   ///   §1t99s0§.as:1203-1205  if(this.§1t4414s0§ < this.§1t4415s0§) { ++this.§1t4414s0§;   ///   SWF header: CWS, version 17, frameRate 24.0, 6,880,328 bytes   =>  (192-48)/24 = 6.000 s
- **Overturns:** "Measured on frames, the web build's crit meter fills at ~17.3%/s (≈5.8 s end to end); the android constants predict 4.00 s. THE MEASUREMENT DOC AND THE FRAME DISAGREE, SO THE FRAME WINS — build 5.8 s."
- **Lane impact:** L5 + L8 — build maxreload = 192, hide the first 48 ticks in the HUD, refill +1 per 24 Hz frame. The repo's session-11 measurement (6.01 / 6.00 / 5.98 s) is now source-confirmed rather than the only evidence, and the android's 120/24 is a retune to be discarded.

### `combat-core/web-maxreload-192-and-48-offset` — HELD [A2] ⚑ OVERTURNS LEDGER

The web build's crit meter is maxreload = 8×24 = 192 ticks with the HUD bar showing (reload−48)/(192−48) = 144 ticks — which at the SWF's 24 fps is 6.00 s, matching the frame-measured 5.9–6.1 s and dissolving the survey's claimed parity break.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 and §1t113s0§.as:326-330; frame rate from the SWF header of reference/decrypted/shs3_payload_decoded.swf`
- **Quote:** §1t99s0§.as:249 `this.§1t4415s0§ = 8 * 24;`  ·  §1t113s0§.as:326-330 `public function §1t5205s0§(param1:int, param2:int) : * { var _loc3_:Number = (param1 - 48) / (param2 - 48); if(_loc3_ < 0) { _loc3_ = 0; }`  ·  SWF header parse: shs3_payload_decoded.swf CWS v17 stage 800x690 frameRate=24.000  ·  my re-measure of the cited frames at y=1032: 281 / 290 / 304 / 340 / 370 -> 16.5%/s and 16.9%/s -> 5.9-6.1 s
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** L5 + L8 — blocker ⑤ closes fully from the shipped build: 192-tick meter, +1/frame at 24 fps, bar shows the last 144 ticks, zeroed at full on crit, charged slashUsage ÷2/×1/×1.5. The stance lock is a flat `reload < 48` with a flat −48 cost, and 'reload < 48' is EXACTLY 'bar reads zero', which is why t1003.000.png shows CANNOT CHANGE STANCE on an empty bar. No frame-vs-source conflict exists.

### `combat-core/web-reach-and-damage-curves-match-repo` — HELD [A2] ⚑ OVERTURNS LEDGER

The shipped web build's per-stance reach AND damage multipliers are exactly the values already in src/config — light reach ×1.4, balanced ×(1+0.02·m), heavy ×(0.5+0.04·m) floored at 100; damage light ×(0.5+0.04·m), balanced ×(1+0.02·m), heavy/dual/reversed ×1.4.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094, :3105, :3116-3120, :3262-3270`
- **Quote:** :3094 `this.§1t4417s0§ = this.§1t4420s0§ * 1.4;`  ·  :3105 `... * (1 + 0.2 * this.§1t4422s0§ * 0.1);`  ·  :3116 `... * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);` then `if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }`  ·  :3262 `_loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);`  ·  :3265 `_loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);`  ·  :3270 `_loc2_ = _loc1_ * 1.4;`
- **Overturns:** "- `STANCE_TABLE` already carries reach 300/200/120 + speed — but **never wired into `resolveSlash`** and mislabeled INFERRED when they're actually the wiki's **mastery-9** values (and Heavy should be 100, not 120)."
- **Lane impact:** L5 — the reach/damage curve family is now CONTRACT (shipped-build source), not CONTRACT-SRC-guessed. It also promotes reach.ts's 'one mastery drives both tables' permutation from an observation to a source fact, in the correct build. The 300/200/120 ledger triple is dead, but so is the survey's replacement.

### `items-equipment/web-soul-infusion-superset` — HELD [A2] ⚑ OVERTURNS LEDGER

The shipped web v0.717 soul-infusion transfers a DEFENSE delta (modifier id 7) for every item type and a WEIGHT delta for armor (type 4) and pants (type 11), and gates the durability copy on the design item having non-zero durability — none of which exists in the Android v0.682 code the survey quoted.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5374s0§.as:686-724`
- **Quote:** _loc6_ = _loc5_.defense; _loc7_ = …(statsSlot).defense; if(_loc3_.§1t523s0§(7) == 0) { _loc3_.§1t493s0§(7,_loc7_ - _loc6_); } … if(_loc1_ == 4 || _loc1_ == 11) { _loc8_ = statsItem.§1t545s0§(); _loc9_ = _loc5_.weight; _loc3_.§1t478s0§ = _loc8_ - _loc9_; } … if(_loc5_.durability != 0) { _loc3_.uses = statsItem.uses; }
- **Overturns:** "soul-infusion + stat-transfer rules (patch-note-sourced)"
- **Lane impact:** L4 (economy/crafting) — implement the v0.717 rule set; the Android-only version silently no-ops for armour and pants.

### `ledger/film-shows-rebirth-is-unsourced` — HELD [A1] ⚑ OVERTURNS LEDGER

REBUILD_READINESS.md §3 #7 attributes its '+25 gold' to film, but nothing about rebirth was ever filmed — both longplays are frame-verified at level 5 and level 8, seventy-plus levels below the L80 rebirth gate, and the ledger's own §4 says so.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-05/frames/frame_0025.jpg and reference/frames/zFtCaTO0_1M/seg-20/frames/frame_0019.jpg — top-22% HUD strips, 2x LANCZOS upscale`
- **Quote:** Visibly in the crops: a level badge reading 8 beside '20880 / 20900 EXPERIENCE POINTS', and a level badge reading 5 beside '8093 / 8350 EXPERIENCE POINTS' with 'REGISTER TO SAVE YOUR PROGRESS AND PLAY ONLINE!' (a guest session). Both HUDs also show a silver '507 / 259 COINS' readout separate from a gold '2 GOLD' readout with a 'GET GOLD' button, and an EMPTY Dan field.
- **Overturns:** "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements + economy + ledger hygiene. THE FRAME WINS, and here it wins against the ledger's own sourcing claim: the longplays cap at L5/L8 so no rebirth could have been observed, and REBUILD_READINESS.md:205 concedes it ('never filmed — both longplays pre-rebirth') — the ledger contradicts itself at :165 vs :205. The '+25' number is NOT wrong; it is the value already banked in the ledger's KNOWN-KNOWNS at :79 ('rebirth scroll 1000c (+25g)') and it is now CONFIRMED by v0.717 code. Only the 'no 10th-rebirth tier' half of §3 #7 is disproven. Downstream lanes must stop treating '+25' as a film measurement — the frames prove that provenance is fictitious. The frames also confirm COINS and GOLD are two distinct on-screen currencies, so STAT_HGOLD is the on-screen 'GOLD'.

### `progression/quest-xp-sum-kills-blocker2-rationale` — HELD [A2] ⚑ OVERTURNS LEDGER

The 69 tabled quest XP rewards sum to 79,890 — enough on their own to carry a solo offline player to level 17, which destroys the ledger's stated reason for calling the L11-80 curve unrecoverable.

- **Cite:** `reference/extracted/questdata.xml — my own sum over all 69 <exp> rows; compared against expArray at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364`
- **Quote:** quest exp rows 69, sum 79890. expArray[10]=31,400 · expArray[17]=80,300 — 79,890 XP from quest turn-ins alone, before a single mob kill, lands at level 17. Supporting: reference/extracted/itemdata.xml carries 142 <minlvl> rows spanning 0-79, i.e. gear authored for the whole band.
- **Overturns:** "② **L11–80 XP curve — likely unrecoverable** (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."
- **Lane impact:** L4: blocker ②'s parenthetical was doing the persuasive work, and it is now false on two counts — the curve is on disk AND a solo build reaches L11+ from quests alone. Also strengthens L9 quests-story (the reward side is fully tabled) and L8 enemies-ai level-band pacing.

### `progression/second-frame-confirms-plus3-per-point` — HELD [A4] ⚑ OVERTURNS LEDGER

A second frame reading, already in the video study and flagged INFERRED there, independently confirms +3 per stat point and the start pools — it was sitting unused while the ledger carried the wrong +1AP figure.

- **Cite:** `docs/research/video-study/segments/A-02-dojo-tutorial-3-stances-chi-punch-on-dum.md:24-25 (segment carries its own frame cites); adjudicated against reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3422,3434,3443`
- **Quote:** A-02:24  "Three resource bars with `+` allocate buttons: `HP 20/20`, `CHI 10/10`, `AP 30/30`"
A-02:25  "Observed progression: ATK 4→7, DEF 4+2→7+2 (i.e., DEF base 4→7 too), SPD 1→4, spending the 3 stat points … total distributed points = (7-4)+(7-4)+(4-1)=3+3+3=9 … treat exact point-to-stat ratio as INFERRED, needs frame-by-frame combat-panel replay to confirm"
- **Overturns:** "- **Ready:** +3 stat/+1 skill/full refill per level; +10HP/+5Chi/+1AP/+3-stat per point; L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence; start pools (HP10/Chi10/AP30)."
- **Lane impact:** L4: closes A-02's open INFERRED flag with a payload cite, and shows the frame evidence for +3/point was already on disk. CHI 10/10 and AP 30/30 in the same frame confirm the start pools directly. No replay needed — mark A-02:25 RESOLVED.

### `rebirth/dragon-dance-ui-art-is-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The Dragon Dance ritual UI art is fully on disk: a dark-red double outer ring, eight green-outlined white kanji nodes, an inner dark-red bagua trigram ring, a black/white taiji centre carrying the element name, and an X close button.

- **Cite:** `reference/extracted/sprites/DefineSprite_1810_1t5495s0/1.png (819x500, viewed whole) + DefineSprite_1800/1.png (green bagua ring 437x437), DefineSprite_1802/1.png (dark-red bagua ring 437x437), DefineSprite_1808/1.png (taiji 242x242), DefineSprite_1797_shs3_fla.dragondancewords_235 (39x40, 58 frames), DefineSprite_1798_1t5501s0 (64x64); class link via reference/decompiled/shs3_payload/scripts/§1t5495s0§.as:70-71`
- **Quote:** §1t5495s0§.as:70  this.§1t5516s0§ = ["sky","wind","water","mountain","earth","thunder","fire","lake"];
§1t5495s0§.as:71  this.§1t5517s0§ = ["fire","earth","lake","sky","water","mountain","thunder","wind"];
(art) DefineSprite_1810_1t5495s0/1.png visibly shows the 8-node click ring, the trigram ring and a yin-yang centre reading "FIRE"
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** L rebirth-elements blocker (4): the survey closed the INPUT half only and left the art unmentioned. The art half is held too. The 58-frame dragondancewords strip is exactly what DragonDanceUI.as:359 and :364 index (word.gotoAndStop(num + 11) for Earlier Heaven, (num + 31) for Later Heaven), so the glyph-per-node mapping is reproducible frame-for-frame.

### `rebirth/element-circle-art-is-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The rebirth element-picker circle's art, layout and colours are fully recovered from the exported asset set: an 808x480 panel with FIRE (red) / EARTH (dark gold) / WIND (white-grey) / WATER (blue) kanji badges on a ring, joined by grey 'STRONG AGAINST' arrows running FIRE->EARTH->WIND->WATER->FIRE.

- **Cite:** `reference/extracted/sprites/DefineSprite_1650/1.png (808x480; viewed whole, then crop (230,80)-(620,420) upscaled x3 LANCZOS); parent symbol reference/extracted/sprites/DefineSprite_1691_1t401s0/1.png (crop (520,250)-(860,470) x4) linked by reference/decompiled/shs3_payload/scripts/§1t401s0§.as:9 [Embed symbol="symbol1691"] and :77 elementCircle:MovieClip`
- **Quote:** Visibly in the crop: four circular element badges - FIRE at top (bright red ring, 火 in red on a near-black disc, white label 'FIRE'), EARTH at right (dark-gold ring, 土, 'EARTH'), WIND at bottom (light-grey ring, 風, 'WIND'), WATER at left (blue ring, 水 in blue, 'WATER') - connected by grey curved arrows each captioned 'STRONG AGAINST' in white, on a plain grey field.
- **Overturns:** "⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** L rebirth-elements blocker (5) closed OUTRIGHT, art half included - it is not merely 'data held, art unheld'. The arrow direction independently corroborates the code wheel at StatsManager.as:1836, so art and AS3 agree with no measurement doc in between. The 808x480 sprite size is also fresh corroboration of ledger §3 #12's 800x480 native stage. Prompt copy recovered too: string 611 = 'Choose an element to specialize in.' (InteractUI.as:556-559).

### `rebirth/elemental-gate-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete elemental unlock table is recoverable by name: qty 10 opens Fire Breath, the four Element Traps, the four Kunai, Ground Punch, Wind Combo and Water Stomp; qty 30 opens the four Dragon Dance Steps AND the four ultimates Inferno/Tsunami/Tornado/Earthquake; qty 60 opens the four Dragon Dance Step II passives.

- **Cite:** `reference/extracted/skilldata.xml — every <req><has><id>28|29|30|31</id><qty>…</qty> block, names joined through docs/gauntlet/L0/index/strings.json (anchors verified at :988, :1726, :1884)`
- **Quote:** 988:  <req><has><id>28</id><qty>10</qty></has></req>   skill 1029 = 'Fire Kunai'
1884: <req><has><id>28</id><qty>30</qty></has></req>   skill 1070 = 'Inferno'
1726: <req><has><id>28</id><qty>60</qty></has></req>   skill 1060 = PASSIVE 'Dragon Dance Step: Fire II'
- **Overturns:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** L-rebirth-elements + L-skills-meters: the ledger's Dragon Dance sentence is correct as written; what it omits is the 1x tier (breath/traps/kunai/stomps) and the fact that the four ultimates share the 3x gate with the Dragon Dance Steps. This is the table that refutes the rebirth lane's 'entire usable elemental kit lands on the FIRST rebirth'.

### `rebirth/no-elemental-status-effects-exist` — HELD [A2] ⚑ OVERTURNS LEDGER

Elemental skills apply no status effect at all - no burn, slow, root or DoT - because the Damage packet has no field to carry one and every BUFF_* constant is a meta/economy buff.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Damage.as:26-48 (complete field list) and :6-24 (launchType enum) + StatsManager.as:288-312 (complete BUFF_* list)`
- **Quote:** Damage.as fields: damage, stance, launchType, attackerlvl, piercingDamage, fireDamage, waterDamage, windDamage, earthDamage, flyVelX, flyVelY, victimPosX.
StatsManager.as:288-312: BUFF_XP 0, BUFF_ATTACK 1, BUFF_DEFENSE 2, BUFF_SPEED 3, BUFF_AP 4, BUFF_DUELTOKENS 5, BUFF_COINS 6, BUFF_RARELOOT 7, BUFF_MUTE 8, BUFF_FULLMUTE 9, BUFF_HELL 10, BUFF_INJURED 11, BUFF_MODERATOR 12
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** L rebirth-elements blocker (1): the 'status' clause resolves to a clean NEGATIVE rather than staying open. Build the elemental kit statusless and label it. The only per-hit reaction is launchType (Tornado = LAUNCH_AIR, the other three ultimates = LAUNCH_KNOCKDOWN).

### `rebirth/romaji-dan-ladder` — HELD [A2] ⚑ OVERTURNS LEDGER

The v0.717 desktop build ships a SECOND Dan ladder — hard-coded English romaji, absent from the string table and from the android build — printed in the versus/duel panel, and it is the direct explanation of the 'garbled wiki datum' the ledger complains about.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t408s0§.as:532-566, rendered at :582`
- **Quote:** case 0: dantext = "";                                case 5: dantext = "(rokudan) "  + §1t1521s0§.getString(465);\ncase 1: dantext = "(nidan)";                         case 6: dantext = "(nanadan) "  + §1t1521s0§.getString(466);\ncase 2: dantext = "(sandan)";                        case 7: dantext = "(hachidan) " + §1t1521s0§.getString(466);\ncase 3: dantext = "(yondan) " + getString(465);      case 8: dantext = "(kyudan) "   + §1t1521s0§.getString(467);\ncase 4: dantext = "(godan) "  + getString(465);      case 9: dantext = "(judan) "    + §1t1521s0§.getString(467);\n:582  this.playerText.tex
- **Overturns:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements blocker ③ + ui-hud: the versus panel reads 'Level: N (yondan) Renshi' in ROMAJI, while the inventory panel shows the KANJI danfield — two different display formats for the same stat, and only the kanji one was recovered by the survey. This also settles the ledger's §3 #7 garble: the game itself prints '(kyudan)' at STAT_DAN 8, so a wiki editor transcribing the versus panel would write exactly the string the ledger calls garbled. Copy '(nanadan)' for 7th verbatim — it is a non-standard romanisation and is what shipped.

### `art-anim/equipment-art-was-server-streamed` — PARTIAL [A2]

All equipment art is loaded at runtime from an external shs3resource.swf (POST to getresource.php, pass=12345), because useExternalResource is hard-set true — so the roster art was never in either payload and the getDefinitionByName symbol path is dead code in shipped builds.

- **Cite:** `reference/decompiled/shs3_android/scripts/ResourceManager.as:41, :80-115, :139 + StatsManager.as:360, :508; corroborated by reference/extracted/sprites/ (22 MCS part sprites out of 827)`
- **Quote:** internal static var resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"];  /  public static var useExternalResource:Boolean = true;  /  StatsManager.mainTimeLine.loadingScreen.loadertext.text = "Loading art assets... ";
- **Lane impact:** L6 (art) — restates the residual blocker precisely: the only surviving copy is the CWS-obfuscated 115_Mobile_SHS3Resource.bin (zlib fails: 'unknown compression method'), so equipment art must be authored from frames, and the 22 naked defaults are the only symbols we hold.

### `combat-core/cannot-change-stance-not-in-android-strings` — HELD [A1]

'CANNOT CHANGE STANCE' — printed on the web build's reload bar — has no counterpart anywhere in the android build's 2,533-entry string table, a third hard android-v0.682 ≠ web-v0.717 divergence.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png crop (0,900)-(640,1080) NEAREST x3 and reference/frames/session11/damage-ttk/t1961.900.png crop (100,940)-(620,1080) LANCZOS x3; cross-checked against docs/gauntlet/L0/index/strings.json`
- **Quote:** Both crops legibly read 'CANNOT CHANGE STANCE' over the third bar. Exhaustive value search of strings.json: entries containing 'annot' AND 'stance' = []; entries starting 'Cannot' = []. The nearest entries are 208 'Change Stance' (the android's BattleUI.as:114 changestancelabel) and 125 'Stance Restriction'.
- **Lane impact:** L8 + L5 — strengthens combat-core/build-version-parity from one divergence to three, and warns that porting android UI copy verbatim will produce strings the shipped game never showed. Label every ported string CONTRACT-SRC-v0.682.

### `combat-core/crit-is-full-reload-1p3` — HELD [A2]

The crit condition in the shipped v0.717 client is a full reload bar, and the multiplier is 1.3 with piercing damage added flat afterwards.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276 (android twin at MCSPlayer.as:3215ff)`
- **Quote:** 3272: if(this.§1t4414s0§ == this.§1t4415s0§)
3273: {
3274:    return _loc2_ * 1.3 + this.§1t1243s0§;
3275: }
3276: return _loc2_;
- **Overturns:** "③ §3 corrections (hold-run, crit 1.3, mastery-9, Chi-10)"
- **Lane impact:** L-combat-core / L-skills-meters: independently confirms the 1.3 crit from the shipped client rather than the forum, and pins the trigger - reload == maxreload, i.e. a fully recharged slash, not a random roll and not a Critical meter.

### `combat-core/every-checked-combat-number-moved-between-builds` — HELD [A2]

The android v0.682 bundle and the desktop v0.717 bundle disagree on every combat-tuning number checked so far, so android-only combat values must be treated as INFERRED until the desktop line is located.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3094/3105/3116/3131/3162/3262/3265/3270/3274 and §1t1523s0§.as:2644-2652 vs reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3030/3041/3052/3067/3098-3104/3205/3208/3213/3215-3221 and StatsManager.as:2201-2207`
- **Quote:** rebirth payout 5/20 (android) vs 25/100 (desktop) · Light+Reversed reach x1.5 vs x1.4 · mastery scaling *0.01 vs *0.1 (coefficients 0.5/0.5 vs 0.4/0.2) · Heavy stance damage x1.5 vs x1.4 · full-reload crit x1.2 non-Light / x1.5 Light vs flat x1.3 · stance-change reload penalty maxreload/3 then -maxreload/6 vs a flat -48
- **Overturns:** "⚠ CAVEAT to carry: this is the ANDROID build, clientVersion 0.682 ... UI copy and combat tuning parity is NOT established."
- **Lane impact:** All lanes sourcing android AS3. The Stage-0b caveat is stronger than 'one in six numbers moved' - six for six moved in the combat block. The desktop file to check first is reference/decompiled/shs3_payload/scripts/§1t99s0§.as (MCSPlayer) and §1t1523s0§.as (StatsManager); both are present and complete, so 'android-only' is almost never the true state of a combat number.

### `combat-core/focus-6s-is-the-source-not-a-parity-break` — HELD [A2]

There is no crit-meter parity break: v0.717's meter is 8×24 = 192 raw units rendered as (x−48)/144, so the visible fill is 144 frames = exactly 6.000 s at 24 fps — which is the frame-measured value, to 0.5%.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249 (`= 8 * 24`) and :1203-1208 (`if(reload < maxreload) { ++reload; … updateReload(reload, maxreload) }`); measured counterpart COMBAT_MEASUREMENTS.md f-9 (6.00 s, 3× 60 fps regressions) and src/config/combat.ts:82-101`
- **Quote:** §1t99s0§.as:249  this.§1t4415s0§ = 8 * 24;   ///   f-9: 'empty → full 6.00 s … agreeing to 0.5 % (6.01 / 6.00 / 5.98)'   ///   combat.ts: FOCUS_MAX = 192 · FOCUS_DISPLAY_OFFSET = 48 · FOCUS_DISPLAY_SPAN = 144
- **Lane impact:** L5 — kills the survey's score-capping caveat (a) as stated and kills its 5.8 s recommendation. Build 6.00 s, which is already in config. The android's 5×24 with a 24-frame hidden offset is the v0.682 retune; quoting it as the prediction is what manufactured the 4.00 s 'discrepancy'.

### `combat-core/generic-post-defense-damage-floor` — HELD [A2]

The real post-defense damage floor is a four-band ladder on the ATTACKER's level — 1 / lvl/8 / lvl/6 / lvl/4, each plus piercingDamage — applied on every hit in the generic pipeline, not only in boss scaling.

- **Cite:** `reference/decompiled/shs3_android/scripts/Damage.as:149-172; applied at MCSPlayer.as:3415-3418 (and :3710, EnemyWolf.as:384, EnemyShield.as:347, EnemyNianMonster.as:383, EnemyClone.as:222/443, EnemyJiangSi.as:304)`
- **Quote:** if(this.attackerlvl <= 10) { return 1 + this.piercingDamage; } if(this.attackerlvl <= 20) { return this.attackerlvl / 8 + this.piercingDamage; } if(this.attackerlvl <= 30) { return this.attackerlvl / 6 + this.piercingDamage; } return this.attackerlvl / 4 + this.piercingDamage;   /   damage -= this.getDefense(); if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
- **Overturns:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) — the ledger's Ready bullet is CORRECT and should be extended to four bands + piercing, not replaced by the boss-only rule the survey proposed.

### `combat-core/heavy-launch-unlock-is-3-on-target-build` — HELD [A2]

The mastery ladder is identical in v0.717, so src/config/stances.ts LAUNCH_UNLOCK_LEVEL.heavy = 5 is wrong on the target build, not just on the android one — this is the survey's single clean, shippable config fix.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3221-3244 (and :3245-3252 for Reversed/Dual); vs src/config/stances.ts LAUNCH_UNLOCK_LEVEL`
- **Quote:** 3221-3227 light: §1t4425s0§ = m >= 3; §1t4430s0§ = m >= 4; §1t4429s0§ = m >= 5;  ·  3229-3235 balanced: §1t4427s0§ = m >= 3; §1t4430s0§ = m >= 4; §1t4425s0§ = m >= 5;  ·  3237-3243 heavy: §1t4425s0§ = m >= 3; §1t4430s0§ = m >= 4; §1t4426s0§ = m >= 5;  ·  3245-3252 reversed/dual: all five = true.
- **Lane impact:** L5 + L2 — ship `heavy: 3`. Same-slot permutation across both builds means this one is safe to land without a further v0.717 re-read. Reversed and Dual granting all five abilities unconditionally still has no slot in the three-stance model.

### `combat-core/hud-track-is-269px` — HELD [A1]

The HUD bar track is 269 px at 1080p (x = 245…513), not the 263 px the survey calibrated against — measurable directly off the FULL Chi bar in the survey's own frame.

- **Cite:** `reference/frames/session11/crit-focus/t1003.000.png — blue-channel scan of rows 1008 and 1010 (Chi reads 31/31, i.e. a full bar), plus HP cross-check on row 980`
- **Quote:** Chi (31/31, full) blue span = x 245…513 → width 269 px, identical on both rows. HP green edge at x=433 → (433−245)/269 = 69.9 % against a displayed 14/20 = 70.0 %. COMBAT_MEASUREMENTS f-4 says 268 px, f-8 says 269–270 px.
- **Lane impact:** L8 + L5 — any future percentage read off this bar must use 269, not 263. The 6 px error is 2.3 % and is most of the gap between the survey's 5.8 s and the banked 6.00 s.

### `combat-core/mastery-domain-unresolved` — STILL_UNHELD [STILL_UNHELD]

Whether stance mastery runs 0-10 or 0-100 is UNRESOLVED and it silently scales both the reach and damage tables — on the 0-10 reading the heavy reach mastery term can never do anything, because its maximum (×0.55) stays permanently under its own 100-unit floor.

- **Lane impact:** L5 — blocks promoting the 0.005-per-mastery terms in reach.ts/damage to CONTRACT at any domain. Close-path: measure a balanced-stance stroke at lvl 1 (stance-reach/A_t121.667, 239 px ⇒ 106 world at 2.25 px/unit) against a late-game balanced stroke at known SPD; the two readings pin the coefficient's domain directly, since the domain is the only free variable left in the formula.

### `combat-core/mastery-is-small-integer` — HELD [A2]

Stance mastery is a small integer (roughly 0-10), not a 0-100 percentage: abilities are gated at mastery >= 3 / 4 / 5, and substituting mastery=10 into the v0.717 damage switch reproduces the ledger's stance damage table 0.9 / 1.2 / 1.4 exactly.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3271 + reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3166-3184 and StatsManager.as:1834`
- **Quote:** 3262: _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);   // LIGHT    -> 0.9 at mastery 10
3265: _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);       // BALANCED -> 1.2 at mastery 10
3270: _loc2_ = _loc1_ * 1.4;                                     // HEAVY/DUAL/REVERSED
---
MCSPlayer.as:3174: this.canFlipUp = this.balancedMastery >= 3;
MCSPlayer.as:3175: this.canDeflect = this.balancedMastery >= 4;
MCSPlayer.as:3176: this.canLaunch = this.balancedMastery >= 5;
- **Overturns:** "The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base."
- **Lane impact:** L-combat-core: CONFIRMS the ledger's mastery-ceiling reading for the damage table and refutes the rebirth lane's counter-assertion that mastery is a 0-100 percentage. Also gives the recreation the ability-unlock ladder for free: light 3/4/5 = launch/deflect/air-combo, balanced 3/4/5 = flip-up/deflect/launch, heavy 3/4/5 = launch/deflect/stab; reversed and dual grant all five unconditionally (MCSPlayer.as:3188-3195).

### `combat-core/parity-established-for-ten-quantities` — HELD [A2]

Ten combat quantities the survey flagged as android-only are byte-identical in the shipped web build, so they can be labelled CONTRACT rather than CONTRACT-SRC-v0.682.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:9-19, :3221-3251, :3283-3289; §1t1541s0§.as:52-60; §1t67s0§.as:199-209; §1t68s0§.as:465-483; §1t122s0§.as:771-774`
- **Quote:** §1t99s0§.as:9-19 standingRange 50 / jumpThreshhold 100 / runSpeed 12 / lightSlashSpeed 50 / balancedSlashSpeed 40 / heavySlashSpeed 30  ·  §1t99s0§.as:3288 `return defense * 0.8;`  ·  §1t99s0§.as:3238 `this.§1t4425s0§ = this.§1t4423s0§ >= 3;` (heavy canLaunch at mastery 3)  ·  §1t1541s0§.as:52-60 maxDistance 200 / 4 / 400 / thickness 8 / 20  ·  §1t67s0§.as:203-209 `attackerlvl / 8`, `/ 6`, `/ 4`  ·  §1t68s0§.as:467 `_loc3_ -= this.defense;` :483 `this.§1t3246s0§ = 12;`  ·  §1t122s0§.as:771-774 `_loc3_ = 48 + param1.speed * 6;` ... `120 + Math.floor(_loc5_ * _loc4_ / (20 + _loc4_))`
- **Lane impact:** L5 — promotes to CONTRACT: the reach base formula, reload refill 48+SPD·6, standingRange 50, slashSpeed 50/40/30, jumpThreshhold 100, the whole InputManager gesture/arc-length constant set, the 12-frame i-frame window, the four-band defence floor table, heavy defence ×0.8, and the 3/4/5 mastery ability ladder (heavy launch at 3). src/config/stances.ts LAUNCH_UNLOCK_LEVEL.heavy 5 -> 3 is the one config edit from this unit that is safe to make.

### `combat-core/payload-swf-framerate-24` — HELD [A2]

The web payload SWF's own header declares 24.0 fps, so the tick→second conversion for every v0.717 frame-counted constant is first-party and no longer borrowed from the android Mobile.as.

- **Cite:** `reference/decrypted/shs3_payload_decoded.swf — SWF header (signature CWS, version 17, RECT, then the 8.8-fixed FrameRate field)`
- **Quote:** ('CWS', 17, 24.0, 6, 6880328) — parsed signature, version, frameRate, frameCount, file bytes
- **Lane impact:** L5 + L6 — every ticks-based constant (i-frames gotHitCounter=12 → 0.5 s, reload 192 → 8.0 s raw / 6.0 s displayed, doReload jitter) now converts to seconds from a web-build artifact.

### `combat-core/stroke-render-frame-confirmed` — HELD [A1]

The drawn-stroke render is settled on frames, not just in code: thickness 8 world units (measured 18 screen px), colour 0x990000 (measured modal (150,0,0)), tapering from the START of the stroke to a point at the end — which also pins the world→screen scale at 2.25 px/unit and so confirms the 800×480 world.

- **Cite:** `reference/frames/session11/stance-reach/B_t862.600_HEAVY_bold-bright-red-head-only.png and B_t862.667_HEAVY_thin-dark-tail-plus-bold-head.png, both crop (400,690)-(1020,820) LANCZOS x3`
- **Quote:** t862.600 shows one BOLD red segment over the enemy (≈x 840-940) and no tail; t862.667, 67 ms later at the identical crop, shows that same bold segment PLUS a thin red line now extending left across the whole crop. Red-pixel column heights along the stroke: x=460 2px, x=540 5px, x=780 4px, x=900 13px, x=940 18px. Modal stroke colour (150,0,0); 10027008 = 0x990000 = (153,0,0). 18 px ÷ 8 world units = 2.25 px/unit = 1080/480.
- **Lane impact:** L5 + L8 — the stroke renderer can be built and gated today with no remaining unknowns, and any reach number expressed in screen px converts at exactly 2.25. Also re-classes combat-core/reach-is-arclength from A2 to A2+A1.

### `combat-core/web-payload-is-cross-readable` — HELD [A2]

The web v0.717 AS3 is fully cross-readable — 1,079 decompiled .as files with obfuscated names but plain bodies — so the build-parity question the survey filed as STILL_UNHELD is answerable in minutes by numeric-literal grep, and was already answered in-repo three weeks ago.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ (1,079 .as files); §1t1523s0§.as:36 = 0.717; reference/decompiled/shs3_android/scripts/StatsManager.as:30 = 0.682; docs/research/fidelity/SOURCE_CONSTANTS.md (515 lines, 2026-07-25)`
- **Quote:** §1t1523s0§.as:36  public static var §1t9323s0§:Number = 0.717;   ///   StatsManager.as:30  public static var clientVersion:Number = 0.682;   ///   DIVERGENCES.md: 'BUILD IDENTIFIED: v0.717 … The android payload is 0.682 — an earlier build despite a newer SWF container; its four data tables are therefore tagged CONTRACT-SRC (0.682) and must never be quoted as 0.717.'
- **Lane impact:** L5 + every other lane citing shs3_android — the correct protocol is: read v0.682 for structure, then confirm each constant in shs3_payload by literal shape before it becomes CONTRACT. Nine of this unit's twenty claims cite v0.682 numbers that were never checked against the target build.

### `economy/rebirth-pays-premium-currency` — HELD [A2]

The rebirth payout is Heavenly Gold (STAT_HGOLD = 12, the PayVault premium currency), not the soft coin purse (STAT_GOLD = 11), so any tenthGold config value must be wired to the premium wallet.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:192-194, :2627-2677 + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2652 and :228; docs/gauntlet/L0/index/strings.json keys 63/64`
- **Quote:** 192: internal static var STAT_GOLD:int = 11;
194: internal static var STAT_HGOLD:int = 12;
2653: public static function isCoinPurseFull() : Boolean { return getPlayerStats(STAT_GOLD) >= getMaxCoins(); }
2669: public static function getHeavenlyGold() : int { var hgold:int = getPlayerStats(STAT_HGOLD); if(usePlayerIO) { hgold += QueryManagerPIO.instance.getPayVaultCoins(); } return hgold; }
---
strings 63 = 'Coins'   64 = 'Gold'
- **Overturns:** "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** L-economy + L-rebirth-elements: the rebirth reward touches the premium wallet, which also means it is entangled with the dead Player.IO PayVault backend and needs an offline substitute. If the ledger's filmed '+25 gold' was read off the Coins counter, the film and the code describe different currencies - and per the standing invariant the frame wins, so that reading needs re-checking against the frame.

### `economy/sell-price-edge-cases` — HELD [A2]

Two shipped edge cases sit on top of the sell formula: item 13002 (the starter Branch) is force-priced at 0 in the sell list, and ShopUI.sellPercentage = 0.5 is dead code — onSell pays getSellAmt() unmodified.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopUI.as:58, :394-401, :536-540`
- **Quote:** else if(slot.getItemID() == 13002) { slot.setCost(0,0); } else { slot.setCost(slot.getItem().getSellAmt(),0); }  /  internal var sellPercentage:Number = 0.5;   [no other reference]  /  StatsManager.changeGold(this.displayItem.getCost());
- **Lane impact:** L4 (economy) — prevents a builder wiring a 50% vendor haircut that the game never applies.

### `items-equipment/27-parts-but-23-human-layers` — HELD [A2]

MCSCharacter declares 27 PART_ indices but allocates only 23 MovieClip layers for a human (partListLength = 22, loop i <= partListLength); indices 23-26 (l/r shoulder, l/r knee) are creature-only and exist solely for MCSWolf, which raises partListLength to 25.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:56-62, :120, :141-146; reference/decompiled/shs3_android/scripts/MCSWolf.as:13-14, :184-197`
- **Quote:** internal var partListLength:int = 22;  /  for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }  /  MCSWolf: partListLength = 25; for(var i:int = 0; i <= partListLength; i++) ... var r_frontleg1:MovieClip = partList[PART_r_shoulder]; ... var l_backleg2:MovieClip = partList[PART_l_knee];
- **Lane impact:** L6 (art) — the paperdoll z-order table a builder should implement is 23 layers (PART_l_hand 0 .. PART_prop3 22), not 27. The four extra indices are the quadruped rig.

### `items-equipment/affix-eligibility-matrix` — HELD [A2]

Affix rolling is gated by an 8-type x 17-channel 0/1 eligibility matrix, and the FIRST affix is forced by item type (armor -> DEFENSE, weapon -> ATTACK, shoes -> SPEED) with that channel then removed from the pool.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:397-455`
- **Quote:** if(itemType == WEAPON) { pot = [1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,1,1]; } else if(itemType == ARMOR) { pot = [1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1]; } … if(i == 0) { if(itemType == ARMOR) { attrib = DEFENSE; pot[DEFENSE] = 0; } else if(itemType == WEAPON) { attrib = ATTACK; pot[ATTACK] = 0; } else if(itemType == SHOES) { attrib = SPEED; pot[SPEED] = 0; } }
- **Lane impact:** L4/L7 (economy + loot) — this is the missing half of the affix system the survey banked; without it every item type rolls from the same pool and loot identity collapses.

### `items-equipment/border-is-four-tier-16-frames` — HELD [A2]

The inventory slot border encodes the full 4-tier derived rarity (normal/special/rare/unique) as 16 named frames — borderType + _default/_selected/_mouseover/_selectedmouseover — which is why the game ships both a 'blue border = rare' tip and a 'purple border = unique' tip.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:51-52, :116, :219-220, :283-299; GameEngine.as:568 and :572`
- **Quote:** this.borderType = itemRef.getShopItemType(); gotoAndStop(this.borderType + "_default");  …  gotoAndStop(this.borderType + "_selectedmouseover");  /  str = "Tip: A blue border indicates that an item is rare."
- **Lane impact:** L5 (UI/HUD) + L6 (art) — the slot symbol needs 4 border palettes x 4 interaction states; wiring the border to <unique> alone drops the blue rare state.

### `items-equipment/border-is-the-four-tier-ladder` — HELD [A2]

The item border is driven by getShopItemType() and therefore has four frames (normal/special/rare/unique _default), not a binary unique flag — the game's own tip list says a BLUE border means rare.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:51-52 and :219-220, :243-245; reference/decompiled/shs3_android/scripts/GameEngine.as:567`
- **Quote:** this.borderType = itemRef.getShopItemType(); gotoAndStop(this.borderType + "_default");  /  str = "Tip: A blue border indicates that an item is rare.";
- **Lane impact:** L5 (UI/HUD) — directly overturns the survey's claim 13. Border AND text colour come from the same four-valued function; ShopItem additionally has _selected, _mouseover and _selectedmouseover frames per tier, i.e. 4 tiers x 4 states = 16 border frames to author, not one purple outline.

### `items-equipment/border-is-the-rarity-ladder` — HELD [A2]

The item border is driven by the SAME derived 4-tier function as the text colour, not by the <unique> flag: ShopItem sets borderType = getShopItemType() and jumps to that frame label, and the game's own tip list contains a blue=rare border tip six lines above the purple=unique one.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopItem.as:51-52; reference/decompiled/shs3_android/scripts/GameEngine.as:568 and :572`
- **Quote:** this.borderType = itemRef.getShopItemType(); gotoAndStop(this.borderType + "_default");  /  else if(dice == 8) { str = "Tip: A blue border indicates that an item is rare."; } ... else if(dice == 9) { str = "Tip: A purple border indicates that an item is unique."; }
- **Lane impact:** L5 (UI/HUD) — one colour system, four border states (normal/special/rare/unique) x four frame suffixes (_default/_mouseover/_selected/_selectedmouseover). Overturns the survey's guidance that border and text colour are separate channels. Also note 'unique' is broader than <unique>==1: quest-pickable items, trade ids 20103-20107 and player-named items all return 'unique'.

### `items-equipment/build-parity-caveat-proven-live` — HELD [A2]

S0-3's build-parity caveat is load-bearing, not theoretical: the same speed-scaling function caps at 300 in Android v0.682 and at 600 in web v0.717 — a clean 2x tuning divergence.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1861 (getSkillCooldownModifierVal); reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2288-2296`
- **Quote:** Android: internal static function getSkillCooldownModifierVal(speed:int) : Number { if(speed > 300) { speed = 300; } return 1 - speed / 300 * 0.5; }   Web: { if(param1 > 600) { param1 = 600; } return 1 - param1 / 600 * 0.5; }
- **Lane impact:** Cross-lane (L1/L2/L8) — a concrete counterexample proving Android combat/skill tuning may NOT be ported unchecked. Every Android-only number in this and other units needs a §1t1523s0§ / §1t17s0§ cross-read before it is treated as v0.717. (The items-lane numbers I re-checked — getSellAmt, the condition ladder, getMinDamage/getDamageRange, getSlashUsage, the reach formula — all DO match.)

### `items-equipment/consumable-accessory-icon-families` — STILL_UNHELD [A2]

Consumables and accessories have their own icon symbol namespaces — getMCSComponent("item",id) with an item0 fallback and getMCSComponent("acc",id) with AccessoryDummyIcon — so the item icon manifest is a real, still-unrecovered art set covering the ~824 non-weapon rows of the 982-item roster.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:203-224 and :226-247; absence confirmed by ls reference/decompiled/shs3_payload/scripts/ (1 item[0-9]* class = item0.as, 0 acc[0-9]* classes)`
- **Quote:** public function setConsumable(id:int) : * { this.clearItem(); this.displayItem = this.getMCSComponent("item",id); if(this.displayItem == null) { this.displayItem = new item0(); addChild(this.displayItem); } ... }  /  public function setAccessory(id:int) : * { this.displayItem = this.getMCSComponent("acc",id); if(this.displayItem == null) { this.displayItem = new AccessoryDummyIcon(); ... }
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L6 (art) — blocker ⑤ must be split, not closed: the paperdoll compositing contract is HELD, the item/accessory icon manifest is STILL_UNHELD. Two art pipelines, and the second one needs an authoring pass or a recovery of 124_Mobile_ImageResource / 115_Mobile_SHS3Resource (encrypted, S0-5).

### `items-equipment/elemental-def-affix-wheel-is-deliberate` — HELD [A2]

The four elemental-DEF affix channels borrowing other pools is a deliberate counter-element wheel, not a shipped bug: each DEF channel uses the pool of the element that counters it.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:142-145`
- **Quote:** this.preSufArray[FIREDEF][i] = new PreSuf(wateratk_pre[num],wateratk_suf[num]); this.preSufArray[WINDDEF][i] = new PreSuf(earthatk_pre[num],earthatk_suf[num]); this.preSufArray[WATERDEF][i] = new PreSuf(windatk_pre[num],windatk_suf[num]); this.preSufArray[EARTHDEF][i] = new PreSuf(fireatk_pre[num],fireatk_suf[num]);
- **Lane impact:** L4/L7 — port it verbatim as designed. Fire defense is named 'of Water / of Ice / of Frost', wind defense 'of Stone / of the Mountain'; treating it as a bug and 'fixing' it would change 32 of the 104 affix names away from the original.

### `items-equipment/frame-equipped-item-also-resolves` — HELD [A1]

Both items in the frame resolve to payload rows, and the selected one is UNIQUE across the whole roster: exactly one of 982 rows has mindamage 1 / maxdamage 2 (id 13002 'Branch'), and the pickaxe in the weapon box with (EQ: 1 - 3) is id 13022 name 4244 'Pickaxe', weight 10.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (1320,240)-(1620,320) upscaled x4 LANCZOS and crop (170,240)-(870,1040) upscaled x2 LANCZOS; matched to reference/extracted/itemdata.xml and docs/gauntlet/L0/index/strings.json`
- **Quote:** Visibly in the crops: header 'BRANCH', 'DMG: 1 - 2  (EQ: 1 - 3)' with the 2 red, 'WEIGHT: 1', and a brown-hafted pickaxe filling the weapon box of the paperdoll. Payload: id 13002 name 4041 -> 'Branch' mindamage 1 maxdamage 2 weight 1 (the ONLY 1-2 row in 982); id 13022 name 4244 -> 'Pickaxe' mindamage 1 maxdamage 3 weight 10.
- **Lane impact:** L5 + L4 — a two-item frame-to-payload identity rather than one, and the selected tile's grey (normal) border independently confirms the derived-rarity read: 13002 carries no <unique> and no modifiers, so getShopItemType() = 'normal'. Open sub-item: the 'LEVEL 1' label under the icon is NOT <minlvl> (13002 is -4) and Item.getLevel() returns 0 for a modifier-free Branch — its source is a SWF-embedded field not resolvable in the decompiled AS3.

### `items-equipment/full-modifier-id-table` — HELD [A2]

The complete runtime modifier-ID table adds ten channels to the XML-only one: 28-31 = Fire/Wind/Water/Earth ATK and 200-205 = Fire/Wind/Water/Earth DEF, Critical Damage, Piercing Damage; and ids 103-106 (82% of itemdata's modifier rows) are container contents, not stats.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1004-1053; ids at StatsManager.as:226-260; names at docs/gauntlet/L0/index/strings.json 507-510, 871-876`
- **Quote:** case 28: attribs += LangManager.getString(507);  … case StatsManager.STAT_PIERCINGDMG: attribs += LangManager.getString(876);  … case 103: case 106: itemxml = QuestEngine.getItemData(modArrayCheck[q].value); attribs += "- " + itemxml.displayname;   [507 'Fire ATK' … 875 'Critical Damage' 876 'Piercing Damage']
- **Lane impact:** L4/L7 — the elemental and crit/pierce affixes are 11 of the 17 generated channels; without these ids the tooltip renders them blank and mislabels 223 pack rows as 'Set: 103'.

### `items-equipment/generic-defense-floor-is-attackerlvl` — HELD [A2]

The generic post-defense damage floor is Damage.getMinDamage(), a four-band ladder keyed to attackerlvl (1 / lvl÷8 / lvl÷6 / lvl÷4, each + piercingDamage), applied immediately after 'damage -= getDefense()' at every damage-receipt site including the player's.

- **Cite:** `reference/decompiled/shs3_android/scripts/Damage.as:149-170; call site reference/decompiled/shs3_android/scripts/MCSPlayer.as:3415-3418`
- **Quote:** public function getMinDamage() : int { if(this.damage == 0) { return 0; } if(this.attackerlvl == 0) { return this.damage; } if(this.attackerlvl <= 10) { return 1 + this.piercingDamage; } if(this.attackerlvl <= 20) { return this.attackerlvl / 8 + this.piercingDamage; } if(this.attackerlvl <= 30) { return this.attackerlvl / 6 + this.piercingDamage; } return this.attackerlvl / 4 + this.piercingDamage; }  /  damage -= this.getDefense(); if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
- **Overturns:** "defense min-floor (EnemyLevel/4)"
- **Lane impact:** L1/L2 (combat core + damage) — VINDICATES the ledger bullet the surveyor tried to delete. Encode the full four-band ladder keyed to the ATTACKER's level plus the piercing add-on; the ledger's 'EnemyLevel/4' is the >30 band written down. The separate playerLVL ladder the surveyor found (EnemyPlayer.as:107-123, duplicated in EnemySpearElite/EnemyWolfAlpha/EnemyKanjiGuardian/EnemyElite) is enemy HP auto-scaling and belongs to L3, not here.

### `items-equipment/getweight-diverges-between-builds` — HELD [A2]

getWeight() — the input to the sell-price branch and to the carry-weight total — is NOT the same function in the two builds: web v0.717 adds a per-item weight term that Android v0.682 has no counterpart for.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1564-1580 vs reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1958-1975`
- **Quote:** Android: if(this.weight != -1) { return this.weight * this.getQuantity(); } ... return this.weight;   |   Web v0.717: if(this.weight != -1) { return (this.weight + this.§1t478s0§) * this.§1t484s0§(); } ... return (this.weight + this.§1t478s0§) * this.§1t484s0§();
- **Lane impact:** L4 (economy) + L5 (HUD weight bar) — a concrete instance of the S0-3 Android-parity caveat biting. getSellAmt is identical in both builds but its only branch reads a function that is not. Also: getWeight multiplies by QUANTITY, so the >=10 sell step is a stack threshold, not an item-weight threshold — ten weight-1 items sell at x10.

### `items-equipment/getweight-is-stack-weight-and-diverges` — HELD [A2]

getWeight() returns weight x QUANTITY, so the sell formula's `weight >= 10` step is stack weight, not the itemdata <weight> field — and the web build adds a weight-modifier term the Android build lacks.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as getWeight; reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1948-1976`
- **Quote:** Android: public function getWeight() : int { if(this.weight != -1) { return this.weight * this.getQuantity(); } ... return this.weight; }   Web: public function §1t545s0§() : int { if(this.weight != -1) { return (this.weight + this.§1t478s0§) * this.§1t484s0§(); } ... return (this.weight + this.§1t478s0§) * this.§1t484s0§(); }
- **Lane impact:** L4 (economy) — getSellAmt is two-build-confirmed but its INPUT is not. A builder feeding the static <weight> column into `>= 10` gets the wrong branch for stacks, and gets the web build wrong for any item carrying a weight modifier. Also explains the frame's WEIGHT: 43 / 100 as a stack sum (the onigiri x3 contributes 3).

### `items-equipment/humanoid-stack-is-23-layers` — HELD [A2]

MCSCharacter allocates 23 render layers, not 27: partListLength is 22 and the constructor loops i <= partListLength, so PART_l_shoulder(23), PART_r_shoulder(24), PART_l_knee(25) and PART_r_knee(26) are never instantiated on a human — they are quadruped parts used only by MCSWolf, which raises partListLength to 25.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120 and :141; readers at reference/decompiled/shs3_android/scripts/MCSWolf.as:13, :184, :188, :193, :197`
- **Quote:** internal var partListLength:int = 22;  /  for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }  /  MCSWolf.as:13  partListLength = 25;  /  MCSWolf.as:184  var r_frontleg1:MovieClip = partList[PART_r_shoulder];
- **Lane impact:** L6 (art/animation) — code 23 z-ordered layers for the fighter paperdoll, indices 0..22 ending at PART_prop3. The four shoulder/knee indices belong to the creature rig only.

### `items-equipment/icon-art-is-a-separate-family` — HELD [A1]

Inventory icons are NOT just paperdoll part stacks: MCSItem uses two symbol families absent from the paperdoll — "item" for consumables (fallback class item0) and "acc" for accessories (fallback AccessoryDummyIcon) — plus eleven dedicated *DummyIcon placeholder artworks, four of which are visible in the frame.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (900,590)-(1640,960) upscaled x2 LANCZOS and crop (170,240)-(870,1040) upscaled x2 LANCZOS; code side reference/decompiled/shs3_android/scripts/MCSItem.as:203-216 and :226-233`
- **Quote:** Visibly in the (900,590)-(1640,960) crop: 7 inventory tiles of which 4 hold non-equipment art — a red/yellow scroll, a white onigiri with a green nori patch labelled 'X3', a black stone, a white feather. Visibly in the (170,240)-(870,1040) crop: four empty slot boxes rendering dedicated line-art placeholders — a red oni-mask outline, a pair of gauntlet outlines, and two ring outlines. Code: public function setConsumable(id:int) : * { this.clearItem(); this.displayItem = this.getMCSComponent("item",id); if(this.displayItem == null) { this.displayItem = new item0(); ... }  /  public function set
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L6 (art) — blocker ⑤'s ICON half stays OPEN. The survey's 78 rests partly on 'the icon manifest turns out not to exist'; it does exist, as three separate authoring jobs: the `item<art>` consumable family, the `acc<art>` accessory family, and 11 DummyIcon placeholders. THE FRAME WINS over the document here: the surveyor graded from one AS3 method while a frame showing four non-equipment icons and four placeholder artworks was available.

### `items-equipment/item-panel-level-row-unexplained` — PARTIAL [A1]

The web v0.717 item panel renders a 'LEVEL n' row under the item icon that has no counterpart in the Android v0.682 source, and for the frame's Branch the Android formula would produce 0, not the 1 on screen.

- **Cite:** `reference/frames/s21_weapon/t708.0.png, crop (575,240)-(880,540) region of the middle panel (I read it at x2 from the (170,240)-(870,1040) and full-frame passes): 'BRANCH' / icon / 'LEVEL 1'; against reference/decompiled/shs3_android/scripts/XMLItem.as:128-134, Item.as:274-298, InventoryUI.as:228-236 and :1453-1462`
- **Quote:** Visibly in the frame: the item name 'BRANCH', the branch icon, and the label 'LEVEL 1' beneath it. Code side: XMLItem.as:130 `this.levelrestriction = xml.minlvl;` (= -4 for id 13002); Item.getLevel() with zero modifiers gives maxlevel 0, then `if(lvl < baselevel) lvl = baselevel;` is 0 < -4 = false, so it returns 0. InventoryUI's itemPanel exposes only selectItem, selectItemName, selectItemAttribute and chatbutton — no level field.
- **Lane impact:** L5 (UI/HUD) — THE FRAME WINS over the Android measurement path. The item panel needs a fourth field the Android decompile does not describe, and its formula is unheld. Held: the label exists and reads 'LEVEL 1' for an unmodified Branch. Unheld: what computes it. This also bounds the survey's 'cleanest frame-to-payload identity' claim to name/DMG/weight.

### `items-equipment/mcs-human-partlist-is-23-not-27` — HELD [A2]

MCSCharacter allocates 23 z-ordered part MovieClips (indices 0..22) for a human, not 27; PART_l_shoulder/r_shoulder/l_knee/r_knee (23-26) are declared but never instantiated and are used only by quadruped subclasses.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:120, :141-146, :56-62; reference/decompiled/shs3_android/scripts/MCSWolf.as:188 and :197`
- **Quote:** internal var partListLength:int = 22;  /  for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }  /  public static var PART_l_shoulder:* = 23; ... PART_r_knee:* = 26;  /  MCSWolf.as:188  var l_frontleg1:MovieClip = partList[PART_l_shoulder];
- **Lane impact:** L6 (art/animation) — the human paperdoll z-stack is 23 deep. Building 27 layers produces 4 permanently empty layers and, worse, invites treating the shoulder/knee indices as human parts when they belong to the wolf/quadruped rig. Note the type tell: 0-22 are `:int`, 23-26 are `:*`.

### `items-equipment/mcs-partlist-is-23-layers` — HELD [A2]

The MCS render stack instantiates 23 layers (indices 0-22), not 27: PART_l_shoulder 23, PART_r_shoulder 24, PART_l_knee 25 and PART_r_knee 26 are declared but never used anywhere in the corpus.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:56-62, :120, :141-146 (grep for the four constants returns only their declarations)`
- **Quote:** internal var partListLength:int = 22;  /  for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }
- **Lane impact:** L6 (art) — build 23 layers; also note setArmor drives 8 parts (neck included, conditionally) and EQ_ACCESSORY1 renders into PART_prop2 (21) via StatsManager.as:3330.

### `items-equipment/modifier-rows-are-mostly-set-ids` — PARTIAL [A2]

Only 47 of the 412 <modifier> rows in itemdata.xml (11%) resolve to a named stat channel; 344 rows (83%) fall in the 101-1999 Set band and render as the literal string 'Set: <id>', and 19 rows across 11 distinct ids resolve to nothing and hit the trace("ErrorValue") branch.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:231-298 (the switch) evaluated against my parse of all 412 <modifier> rows in reference/extracted/itemdata.xml (34 distinct ids)`
- **Quote:** Unmapped by the table, with row counts: 25 x1, 38 x6, 78 x2, 79 x2, 84 x2, 90 x1, 96 x1, 97 x1, 98 x1, 99 x1, 40000 x1 = 19 rows / 11 distinct ids. Set-band (101-1999) = 344 rows. Stat switch (0-16) = 47 rows. Code: default: if(int(this.modifierXML[q].id) < 2000 && int(this.modifierXML[q].id) > 100) { tempString += LangManager.getString(123) + ": " + this.modifierXML[q].id; } else { trace("ErrorValue: " + this.modifierXML[q].id); }
- **Lane impact:** L4/L7 (economy + loot) — the modifier table is transcribed but the DATA is not thereby readable: the dominant channel is set membership (344 rows), which needs a separate set-bonus table that no one has looked for, and 11 ids shipped in the data have no handler at all.

### `items-equipment/paperdoll-ui-slot-mapping-resolved` — HELD [A2]

The two visually identical ring boxes in the 9-box paperdoll are EQ_ACCESSORY1 and EQ_ACCESSORY2 (named SLOT_RING1/SLOT_RING2 in source); EQ_NECK, EQ_HAIR, EQ_HEAD and EQ_SCABBARD have no UI box at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:520-533, plus the dummy-icon roster in reference/decompiled/shs3_android/scripts/ (8 slot-dummy classes, no Neck/Hair/Head/Scabbard dummy)`
- **Quote:** case 7: tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1]; if(tempItem.getItemID() == 0) { this.acc1Icon.visible = true; } tempShopItem = this.equippedSlots[this.SLOT_RING1]; break; case 8: tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY2]; if(tempItem.getItemID() == 0) { this.acc2Icon.visible = true; } tempShopItem = this.equippedSlots[this.SLOT_RING2];
- **Lane impact:** L5 (UI/HUD) — closes the survey's only STILL_UNHELD UI item and fixes the 13-vs-9 delta: the four model-only slots are HAIR, HEAD, NECK, SCABBARD. The paperdoll switch has exactly 9 cases (0..8), matching the frame's 9 boxes, so the whole slot map is now codeable.

### `items-equipment/placeholder-icon-art-set` — HELD [A2]

There IS a small item-icon art set to author: 8 *DummyIcon symbols for inventory misses plus 9 per-slot empty-box icons in the paperdoll, the latter directly visible as the ghosted mask/gauntlet/ring outlines in the frame.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:70,95,126,158,183,232,255,285,330,368 + InventoryUI.as:459-540; frame reference/frames/s21_weapon/t708.0.png crop (170,240)-(870,1040) x2 LANCZOS`
- **Quote:** this.displayItem = new HatDummyIcon(); … new MaskDummyIcon(); … new WeaponDummyIcon(); … new AccessoryDummyIcon(); … new GlovesDummyIcon(); … new ShoesDummyIcon(); … new ArmorDummyIcon(); … new PantsDummyIcon();  /  if(tempItem.getItemID() == 0) { this.maskIcon.visible = true; }
- **Lane impact:** L6 (art) — a bounded 17-symbol authoring task that the 'no icon manifest' finding would have dropped.

### `items-equipment/prog-spike-and-dead-slashusage` — HELD [A2]

Two implementation traps in the survey's own numbers: the +10 end-spike applies to prog1/prog2/prog3 only (SPEED and PIERCINGDMG have none), and the single <slashusage>24</slashusage> row is dead because getSlashUsage floors anything below 48 to 48 in both builds.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-183; reference/decompiled/shs3_android/scripts/StatsManager.as:1921-1928; reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2352-2359`
- **Quote:** this.prog1[MAXINDEX] += 10; ... this.prog2[MAXINDEX] += 10; ... this.prog3[MAXINDEX] += 10;   [no += 10 after the prog4 or prog5 loops]  /  internal static function getSlashUsage() : int { var itemdata:XMLItem = ...; if(itemdata == null || itemdata.slashusage < 48) { return 48; } return itemdata.slashusage; }
- **Lane impact:** L4/L7 (loot magnitudes) and L1 (reach) — a builder applying the +10 spike to all five progression arrays overshoots SPEED and PIERCINGDMG at tier 79, and one implementing slashusage=24 as a fast weapon implements a value the shipped game clamps away.

### `items-equipment/removeparts-leaks-prop3` — HELD [A2]

MCSCharacter.removeParts() never clears partList[22] (PART_prop3) — its loop starts at partListLength - 1 = 21, one short of the highest allocated index.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:245-258 against :120 and :141`
- **Quote:** for(var i:* = int(this.partListLength - 1); i >= 0; i--) { mc = this.partList[i]; childmax = mc.numChildren; for(j = 0; j < childmax; j++) { this.partList[i].removeChildAt(0); } this.partList[i].cacheAsBitmap = false; }   [partListLength = 22; the constructor allocates 0..22]
- **Lane impact:** L6 (art) — an OG behaviour, not a recreation choice: a second prop attached at PART_prop3 persists across a character rebuild. A from-scratch renderer that correctly clears all 23 slots will visibly diverge from the videos in any scene where prop3 is used.

### `items-equipment/ring-slots-are-accessory1-and-2` — HELD [A2]

The two identical ring boxes are EQ_ACCESSORY1 (left) and EQ_ACCESSORY2 (right), not EQ_NECK; and the 9 UI boxes are exactly the 9 stat-bearing slots, because findBonusStat skips EQ_HEAD, EQ_NECK, EQ_SCABBARD and EQ_HAIR.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:163-181, :268-269, :522-535; reference/decompiled/shs3_android/scripts/StatsManager.as:1944-1946`
- **Quote:** internal var SLOT_HAT:int = 0; SLOT_MASK 1; SLOT_ARMOR 2; SLOT_GLOVES 3; SLOT_PANTS 4; SLOT_WEAPON 5; SLOT_RING1 6; SLOT_SHOES 7; SLOT_RING2 8; internal var totalEquippedSlots:int = 9;  /  this.equippedSlots[this.SLOT_RING1] = this.equipAccessory1; this.equippedSlots[this.SLOT_RING2] = this.equipAccessory2;  /  tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1]; ... tempShopItem = this.equippedSlots[this.SLOT_RING1];  /  for(var q:* = 0; q < 13; q++) { if(q != EQ_HEAD && q != EQ_NECK && q != EQ_SCABBARD && q != EQ_HAIR && !(skipWeapon && q == EQ_WEAPON))
- **Lane impact:** L5 (UI/HUD) — closes the survey's only STILL_UNHELD on this system and upgrades the ledger's '9-slot paperdoll' from a frame reading to a code constant (totalEquippedSlots = 9). The 4 model-only slots (hair, head, neck, scabbard) are cosmetic and grant NO stat bonuses.

### `items-equipment/sell-price-reads-stack-weight` — HELD [A2]

getSellAmt's weight>=10 test reads stack weight, not row weight, because getWeight() multiplies by quantity — so ten weight-1 items in one stack each sell at x10 instead of x5.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1564-1568 (getWeight) feeding Item.as:1582-1593 (getSellAmt); web divergence at reference/decompiled/shs3_payload/scripts/§1t17s0§.as:1974`
- **Quote:** public function getWeight() : int { if(this.weight != -1) { return this.weight * this.getQuantity(); } ... }  /  web v0.717: return (this.weight + this.§1t478s0§) * this.§1t484s0§();
- **Lane impact:** L4 (economy) — a port that evaluates the >=10 threshold on the XML row's <weight> mis-prices every stack. Also note the web build adds a weight-modifier term the Android build lacks, so the sell formula's INPUT is not cross-build identical even though its body is.

### `items-equipment/setarmor-drives-8-parts` — HELD [A2]

One armor equip drives EIGHT part slots, not seven: torso, stomach, l_uparm, r_uparm, l_lowarm, r_lowarm, pelvic AND neck — and PART_neck is shared with setNeck, so it can hold two children.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:915-1088 (declaration block at :917-924, neck attach at the tail of setArmor) and :795-813 (setNeck)`
- **Quote:** var neck:MovieClip = this.partList[PART_neck]; ... componentObject = this.getMCSComponent("neck",id); ... neck.addChild(componentObject); neck.cacheAsBitmapMatrix = neck.transform.concatenatedMatrix;  /  setNeck: if(neck.numChildren > 1) { neck.removeChildAt(1); } if(neck.numChildren > 0) { neck.removeChildAt(0); }
- **Lane impact:** L6 (art) — the armor art set needs a neck/collar symbol per item, an 8th piece the survey's part budget omits. The removeChildAt(0) prologue in setArmor covers only 7 parts (neck excluded), which is the trap that produces a 7-count; setNeck's two-deep clear proves the slot is deliberately shared.

### `items-equipment/stancerestriction-is-dead-data` — HELD [A2]

<stancerestriction> is parsed and printed in a description string in the Android build and never read at all in the web build — there is no stance gate to implement.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t104s0§.as:30,172-178 (only occurrences); reference/decompiled/shs3_android/scripts/XMLItem.as:38,160-166,321-327 (only occurrences)`
- **Quote:** if(param1.stancerestriction.toString() != "") { this.stancerestriction = param1.stancerestriction; } else { this.stancerestriction = 0; }   [web: no further reference]  /  Android: if(this.stancerestriction > 0) { … this.desc += LangManager.getString(125) + ": " + this.stancerestriction; }
- **Lane impact:** L1 (combat core) — removes a phantom weapon/stance restriction from the combat plan; the 53 rows are display text only.

### `items-equipment/two-ring-slots-are-accessory1-and-2` — HELD [A2]

The two visually identical empty ring boxes in the paperdoll are EQ_ACCESSORY1 and EQ_ACCESSORY2, not EQ_NECK: MCSItem — the slot-icon renderer — declares 11 setters and none of them is setNeck, so EQ_NECK has no UI-box renderer at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSItem.as:64, :89, :120, :152, :177, :203, :226, :249, :279, :324, :362 (the complete setter list); setNeck exists only at reference/decompiled/shs3_android/scripts/MCSCharacter.as:795 and MCSBust.as:47`
- **Quote:** MCSItem setters, complete: setHat(:64) setHair(:89) setHead(:120) setMask(:152) setWeapon(:177) setConsumable(:203) setAccessory(:226) setGloves(:249) setShoes(:279) setArmor(:324) setPants(:362). No setNeck. And setAccessory is the only one that draws a repeatable identical empty box: this.displayItem = this.getMCSComponent("acc",id); if(this.displayItem == null) { this.displayItem = new AccessoryDummyIcon(); }
- **Lane impact:** L5 (UI/HUD) — closes the survey's only open UI question. The 9 boxes map to hat, mask, armor, gloves, pants, weapon, accessory1, shoes, accessory2; EQ_NECK, EQ_HAIR, EQ_HEAD and EQ_SCABBARD render on the body but have no paperdoll box.

### `items-equipment/ui-slot-map-resolved` — HELD [A2]

The nine paperdoll boxes map exactly to HAT, MASK, ARMOR, GLOVES, PANTS, WEAPON, ACCESSORY1(left ring), SHOES, ACCESSORY2(right ring) — declaration order equals screen reading order — and EQ_NECK is not a UI box at all.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:163-179, :519-540 (cross-checked against reference/frames/s21_weapon/t708.0.png crop (170,240)-(870,1040) x2 LANCZOS)`
- **Quote:** internal var SLOT_HAT:int = 0; SLOT_MASK 1; SLOT_ARMOR 2; SLOT_GLOVES 3; SLOT_PANTS 4; SLOT_WEAPON 5; SLOT_RING1 6; SLOT_SHOES 7; SLOT_RING2 8;  /  case 7: tempItem = StatsManager.equipment[StatsManager.EQ_ACCESSORY1]; tempShopItem = this.equippedSlots[this.SLOT_RING1];  case 8: … EQ_ACCESSORY2 … SLOT_RING2
- **Lane impact:** L5 (UI/HUD) — closes the survey's only STILL_UNHELD UI item; the paperdoll can be laid out and wired without guessing.

### `items-equipment/uses-zero-is-a-never-wears-sentinel` — HELD [A2]

uses == 0 is a sentinel meaning the item never degrades, not 'brand new': gotUsed() returns immediately when uses==0 and repair() clamps to a floor of 1, so 0 is unreachable once an item has ever worn — which is why the ladder's first branch is 'Unbreakable'.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1419-1424 (gotUsed), :1439-1449 (repair), :712-724 (ladder head)`
- **Quote:** public function gotUsed(num:int = 1) : * { if(this.uses == 0) { return; } ... this.uses += num; }  /  public function repair(num:int) : * { if(this.uses == 0) { return; } this.uses -= num; if(this.uses <= 0) { this.uses = 1; } }  /  if(this.uses == 0) { conditionStr = LangManager.getString(639); } else if(this.uses == 1) { conditionStr = LangManager.getString(392); }   [639='Unbreakable', 392='Condition: Well-Maintained']
- **Lane impact:** L5 (UI/HUD) + items — a builder who initialises fresh items to uses=0 makes every item permanently Unbreakable. Fresh wearable items must start at uses=1 ('Well-Maintained'); uses=0 is reserved for the unbreakable class.

### `items-equipment/web-build-has-a-fifth-name-colour-band` — HELD [A2]

The web v0.717 build colours xp-bearing items #ff9900 (loot toast) / #ff6600 (inventory) in a branch placed ABOVE the unique tier — a fifth band the Android v0.682 build does not have at all, because the Android Item class has no xp field.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:42, :677-681, :698-701; reference/decompiled/shs3_android/scripts/Item.as:415-451 (no xp branch; `grep -c xp Item.as` -> 0)`
- **Quote:** internal var xp:§1t98s0§ = null;  /  if(this.xp != null) { _loc1_ += "<font color=\"#ff9900\">"; } else if(_loc5_ != null && _loc5_.unique == 1 || ...) { _loc1_ += "<font color=\"#b048f8\">"; }  /  else if(this.xp != null) { _loc1_ += "<font color=\"#ff6600\">"; }
- **Lane impact:** L5 (UI/HUD) — the survey says the web cross-check 'removes the S0-3 Android-parity caveat' for the tier colours; it is the reverse. The 1:1 target build has FIVE name-colour bands, not four, and xp-bearing items (an entire item concept absent from the Android class) sit at the top.

### `items-equipment/web-build-has-fifth-name-colour` — HELD [A2]

The web v0.717 build carries a name colour the Android v0.682 build does not: an orange #ff6600 branch gated on 'this.xp != null', sitting between the loot-dialog palette and the inventory palette.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:698-701; absent from reference/decompiled/shs3_android/scripts/Item.as:417-451`
- **Quote:** else if(this.xp != null) { _loc1_ += "<font color=\"#ff6600\">"; }
- **Lane impact:** L5 (UI/HUD) — five name-colour states in the web build, not four, and the S0-3 Android-parity caveat is NOT fully removed for item colours. Any port graded against the videos (which are the web build) needs the #ff6600 XP-item state.

### `items-equipment/web-only-xp-item-colour` — HELD [A2]

The web v0.717 build has a FIFTH item-name colour state the Android v0.682 build lacks entirely — #ff9900 in the loot palette and #ff6600 in the inventory palette, keyed on the item carrying xp.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t17s0§.as:677 and :700; absent from reference/decompiled/shs3_android/scripts/Item.as:407-450 and from a tree-wide grep of all 559 Android scripts`
- **Quote:** Web: if(this.xp != null) { _loc1_ += "<font color=\"#ff9900\">"; }  ...  else if(this.xp != null) { _loc1_ += "<font color=\"#ff6600\">"; }   |   Android getName() has no xp branch in either palette; `grep -rn "ff9900\|ff6600"` over shs3_android/scripts returns nothing.
- **Lane impact:** L5 (UI/HUD) — disproves the survey's claim that the Android-parity caveat is discharged for item colours. Five states per palette in the shipped web build, four in Android. Since the reference videos are the WEB build, a recreation copying Android silently drops the colour an xp-bearing (soul) item displays in.

### `progression/autoassign-is-android-only` — HELD [A2]

The autoAssignStats round-robin the survey surfaced as a progression sub-system does not exist in the WEB v0.717 build at all — it is an Android-port convenience feature, and porting it would import Android's wrong per-point magnitudes with it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2072-2082 (the complete web levelUp) vs reference/decompiled/shs3_android/scripts/StatsManager.as:322, :586, :1655-1688`
- **Quote:** WEB levelUp in full — eight statements, no statBucket, no branch:
public static function §1t9577s0§() : void { §1t9713s0§(§1t9418s0§,1); §1t9713s0§(§1t9419s0§,3); §1t9712s0§(§1t9411s0§,getLevel()); §1t9578s0§(); §1t9712s0§(§1t9414s0§,§1t7356s0§(§1t9415s0§)); §1t9712s0§(§1t9416s0§,§1t9400s0§); §1t3317s0§.instance.§1t1530s0§(§1t9673s0§); §1t406s0§.instance.§1t6578s0§(); }
Grep for the six-stat statBucket array across the whole web payload: zero hits. Android StatsManager.as:322 "public static var autoAssignStats:Boolean = false;" and its bucket at :1657 grants +5 MAXHP / +5 MAXCHI / +1 everythin
- **Lane impact:** L4: strike autoAssignStats from the progression board, or label it ANDROID-ONLY (v0.682). It is listed unlabeled in progression/levelup-refill-and-cap's lane_impact and would otherwise reach config carrying the exact per-point numbers this lane just proved wrong for the web build.

### `progression/elemental-damage-bypasses-def` — HELD [A2]

Defense is subtracted from the physical damage term only — fire, wind, water and earth damage are added after the min-damage floor and are never mitigated by DEF; and a behead multiplies x1.5 after the floor too.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3484-3489 and reference/decompiled/shs3_android/scripts/MCSPlayer.as:3415-3418, :3709-3718`
- **Quote:** MCSPlayer.as:3415-3418  damage -= this.getDefense(); if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
MCSPlayer.as:3714-3718  if(behead) { damage *= 1.5; }  setHP(getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
§1t99s0§.as:3489  _loc17_ = _loc5_ + _loc7_ + _loc9_ + _loc8_ + _loc10_;
- **Lane impact:** L4 completeness on the DEF claim, and a CROSS-LANE GIFT to L1 combat-core: stacking DEF has zero effect on elemental builds, which is a real balance property of the original, not an approximation.

### `progression/getlevel-pins-cumulative-cap-semantics` — HELD [A2]

getLevel()'s strictly-greater comparison is a payload witness for the cumulative-cap semantics that src/core/xp.ts currently justifies from frames alone — reaching a cap exactly finishes the level.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2007-2020; pins the behaviour asserted in tests/xp.test.ts > levelForXp — current level for a cumulative XP total > crosses to the next level exactly AT each cap (bar full = level done)`
- **Quote:** public static function getLevel() : int { var _loc1_:int = §1t7356s0§(§1t8755s0§); var _loc2_:int = 0; while(_loc2_ < 99) { if(§1t5923s0§[_loc2_] > _loc1_) { return _loc2_; } _loc2_++; } return 1; }  — at xp=550, expArray[1]=550 is NOT > 550, so it falls through to expArray[2] and returns 2
- **Lane impact:** L4: src/core/xp.ts's level semantics can be relabeled CONTRACT (payload-backed) instead of frame-INFERRED. Note the tail behaviour differs by build — web returns 1 on overflow, android returns 99 (StatsManager.as:1596) — so do not port android's tail.

### `progression/level10-scroll-validates-xp-table` — HELD [A2]

The payload validates its own XP table without any frame: the 'Level 10 Scroll' sets cumulative XP to 25,900, which is exactly expArray[9] — confirming both the L1-L10 values and the cumulative-threshold semantics (hitting a cap finishes that level).

- **Cite:** `reference/extracted/itemdata.xml:2284-2302; reference/decompiled/shs3_android/scripts/StatsManager.as:188 and :1612-1617; InventoryUI.as:902-906; names via docs/gauntlet/L0/index/strings.json 4131/4137`
- **Quote:** itemdata.xml:2284-2302  <id>2201</id> <name>4131</name> <desc>4137</desc> <heavenlyprice>2</heavenlyprice> <modifier><id>9</id><value>-1000000</value></modifier> <modifier><id>9</id><value>25900</value></modifier>   |   StatsManager.as:188 'internal static var STAT_XP:int = 9;'   |   InventoryUI.as:904-906 'if(modid == 9) { StatsManager.changeXP(item.modifierXML[i].value); }'   |   strings 4131 = 'Level 10 Scroll', 4137 = 'Use this to become level 10'
- **Lane impact:** L4: a payload-internal cross-check of the XP curve that depends on no frame and no video reading. The game asserts cumulative XP 25,900 => level 10, and expArray[9] = 25,900, so it independently confirms the L1-L10 table AND the semantics already encoded in src/core/xp.ts (level N holds while xpThreshold(N-1) <= totalXp < xpThreshold(N)). Worth banking as a second, fully independent line of evidence for the curve.

### `progression/per-point-plus3-direct-frame-proof` — HELD [A1]

One stat point grants +3 to ATK/DEF/SPD, proved directly on screen by a single-click delta rather than by budget reconstruction: at t=456 the panel reads STAT POINTS 3 with SPD 1, and at t=459 it reads STAT POINTS 2 with SPD 4.

- **Cite:** `reference/videos/zFtCaTO0_1M.mp4, own ffmpeg extracts -ss 456 / 459 / 462, crop=iw*0.62:ih*0.42:iw*0.36:ih*0.09 (no upscale needed, the stats modal is large in frame)`
- **Quote:** t=456 visibly: 'AVAILABLE STAT POINTS: 3', ATK 4, DEF 4 + 2, SPD 1, HP 20/20, CHI 10/10, AP 30/30, XP 1502/2950, badge 3. t=459 visibly: 'AVAILABLE STAT POINTS: 2', ATK 4, DEF 4 + 2, SPD 4 — exactly one point spent, SPD moved 1 -> 4. t=462 visibly: 'AVAILABLE STAT POINTS: 0', ATK 7, DEF 7 + 2, SPD 4 — the remaining two points took ATK 4->7 and DEF 4->7.
- **Overturns:** "likely +1 stat point grants +3 to the underlying stat ... treat exact point-to-stat ratio as INFERRED, needs frame-by-frame combat-panel replay to confirm"
- **Lane impact:** L4: upgrades progression/per-point-magnitudes from an indirect budget reconstruction (which must assume the whole spend history) to a directly observed single-click delta, and kills the android +1 model on the frame alone. It also supplies a second, independent budget proof at a DIFFERENT level from the surveyor's: at t=462 the character is level 3, budget (3-1)*3 = 6, and the web magnitudes cost exactly (20-10)/10 + 0 + 0 + (7-1)/3 + (7-1)/3 + (4-1)/3 = 1+0+0+2+2+1 = 6, while android magnitudes give 17. FRAME vs DOC, and the frame wins: docs/research/video-study/segments/A-02-...md:25 asked for exactly this frame-by-frame replay and left the ratio INFERRED; the replay is now done, so the ratio is CONTRACT and that INFERRED flag can be cleared with an A1 cite rather than the A2 one the journal used.

### `progression/rebirth-pays-heavenly-gold` — HELD [A2]

Rebirth's payout is STAT_HGOLD (stat id 12, the premium 'heavenly' currency that itemdata's <heavenlyprice> is denominated in), not STAT_GOLD (stat id 11).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:192, :194, :2201-2208`
- **Quote:** StatsManager.as:192 'internal static var STAT_GOLD:int = 11;' · :194 'internal static var STAT_HGOLD:int = 12;' · :2201-2208 'if(getPlayerStats(STAT_DAN) == 8) { changeStat(STAT_HGOLD,20); } else { changeStat(STAT_HGOLD,5); }'
- **Lane impact:** L4/L5: corrects the lane_impact note on progression/levelup-refill-and-cap, which called it '+5 gold'. Rebirth hands out premium currency — the same currency that gates the Amnesia Scroll — which is a materially different economic fact from a soft-gold payout. L5 rebirth-elements and L7 economy should take the corrected version.

### `progression/respec-is-premium-gated` — HELD [A2]

The respec is not free: it is delivered only by item 2200 'Amnesia Scroll', a unique item with baseprice 0 and heavenlyprice 5, i.e. purchasable only with the premium currency.

- **Cite:** `reference/extracted/itemdata.xml:2267-2280; reference/decompiled/shs3_android/scripts/InventoryUI.as:984-991; names via docs/gauntlet/L0/index/strings.json 4130/4136`
- **Quote:** itemdata.xml:2267-2280  <id>2200</id> <type>10</type> <name>4130</name> <unique>1</unique> <baseprice>0</baseprice> <heavenlyprice>5</heavenlyprice> ... <modifier><id>78</id></modifier> <modifier><id>79</id></modifier>   |   InventoryUI.as:984-991  if(modid == 78) { StatsManager.unAssignStatPoints(); } else if(modid == 79) { StatsManager.unAssignSkillPoints(); }   |   strings 4130 = 'Amnesia Scroll', 4136 = 'Use this to unassign your stat and skill points.'
- **Lane impact:** L4: corrects progression/start-pools-and-respec. The stat economy is premium-gated and consumable-limited, not costlessly re-rollable — porting it as a free respec button would materially change stat commitment. Cross-lane to L7 economy (a premium sink) and L5 rebirth-elements.

### `progression/spent-points-audit-second-witness` — HELD [A2]

A second, structurally independent WEB witness for both the start pools and the per-point magnitudes: a spent-points audit whose divisors are the magnitudes and whose subtrahends are the start pools.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3450-3457`
- **Quote:** _loc1_ += (§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9403s0§) - 10) / 10;
_loc1_ += (§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9406s0§) - 10) / 5;
_loc1_ += (§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9415s0§) - 30) / 5;
_loc1_ += (§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9408s0§) - 1) / 3;
_loc1_ += (§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9409s0§) - 1) / 3;
_loc1_ += (§1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9410s0§) - 1) / 3;
_loc1_ += §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9419s0§);
- **Lane impact:** L4: raises the per-point table (HP+10/Chi+5/AP+5/ATK,DEF,SPD+3) and the start pools (10/10/30/1/1/1) from single-witness to triple-witness — the click handlers, this audit, and the frame budget arithmetic all agree, all within the WEB payload. Ready to land in config as CONTRACT.

### `progression/web-anticheat-and-console-differ` — HELD [A2]

Two more web-vs-android divergences in the same function: the web anti-cheat rejects a jump of more than 2 levels (android: 5 or more), and the web build has consoleEnabled constant-folded to a literal false, so every guard written !consoleEnabled is unconditional in v0.717.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2042, :2043, :2049 vs reference/decompiled/shs3_android/scripts/StatsManager.as:1619, :1625, :336`
- **Quote:** WEB §1t1523s0§.as:2042  var _loc5_:Boolean = false;
WEB :2043  if(!_loc5_ && _loc4_ > §1t9470s0§) { … return false; }
WEB :2049  if(!_loc5_ && _loc6_ > 2) { … return false; }
ANDROID StatsManager.as:1619  if(!consoleEnabled && newlevel > levelCap) { QueryManager.instance.reportHack("changeXP levelcap"); return false; }
ANDROID :1625  if(!consoleEnabled && leveldiff >= 5) { … }
ANDROID :336  internal static var consoleEnabled:Boolean = true;   (live var, toggled at :586 and OverworldHUD.as:2715)
- **Lane impact:** L4: the multi-level anti-cheat threshold is 2, not 5, for the rebuild target. GAUNTLET-WIDE decoding rule: whenever an android guard reads `!consoleEnabled && X`, the web equivalent is plain `X` — do not port the flag, and do not treat an android console/admin path as evidence that a behaviour was reachable in v0.717.

### `progression/web-calcxp-parity` — HELD [A2]

The WEB v0.717 build has its own calcXP / greyLevel / zeroDifference, byte-parallel with the Android twin, so the entire XP-income model — cited android-only by the survey — is now sourced from the actual rebuild target.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t68s0§.as:113-129 (greyLevel), :131-178 (zeroDifference), :180-202 (calcXP)`
- **Quote:** §1t68s0§.as:180-202  public static function §1t12070s0§(param1:int, param2:int, param3:int, param4:Boolean) : * { if(param2 <= §1t12068s0§()) { return 0; } if(param2 - param1 > 3) { return 0; } var _loc5_:int = param3; if(param1 < param2) { _loc5_ = param3 * (1 + 0.05 * (param2 - param1)); } else if(param1 > param2) { _loc5_ = param3 * (1 - (param1 - param2) / §1t12069s0§()); } if(param4) { _loc5_ *= 2; } return _loc5_; }  ·  :122 "return _loc1_ - Math.floor(_loc1_ / 10) - 5;"  ·  the 13-band zeroDifference table (5,6,7,8,9,11,12,13,14,15,16,17,17) is identical to android's
- **Lane impact:** L4: removes the single biggest sourcing risk in the survey. Given this lane's own ruling that shs3_android v0.682 is differently tuned, an android-only cite for a numeric model was a live hazard; the web twin is identical here, so the XP-income model may be ported as-is with a WEB cite.

### `progression/web-stance-triangle-has-a-penalty-branch` — HELD [A2]

The WEB build's stance rock-paper-scissors is symmetric — x1.2 on a favourable matchup AND x0.9 on an unfavourable one — whereas the Android build has only the x1.2 branch; a third concrete proof that Android is differently tuned.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3788-3799 vs reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3708`
- **Quote:** §1t99s0§.as:3788-3799  if(this.stance == §1t12220s0§ && _loc11_ == §1t12221s0§ || … ) { _loc5_ *= 1.2; … } else if(this.stance == §1t12220s0§ && _loc11_ == §1t12222s0§ || … ) { _loc5_ *= 0.9; }   ← the else-if is ABSENT from android, whose block is only  if(LIGHT vs BALANCED || BALANCED vs HEAVY || HEAVY vs LIGHT) { damage *= 1.2; }
- **Lane impact:** CROSS-LANE GIFT to L1 combat-core's damage pipeline: the stance triangle is x1.2 / x1.0 / x0.9, applied BEFORE the flat DEF subtraction. Also a standing warning for every lane — a formula present in both builds can still differ in structure, not just in constants.

### `rebirth/dan-1-has-no-kanji` — HELD [A2]

A Dan-1 character (STAT_DAN 0) displays no kanji badge at all - the dan field is set to the empty string - and string 455 '(初段)' is never referenced anywhere in the decompiled tree.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2280; negative grep 'getString(455' over reference/decompiled/ returns zero hits`
- **Quote:** 2276: case 0:
2277:    this.danfield.text = "";
2278:    break;
2279: case 1:
2280:    this.danfield.text = LangManager.getString(456);   // 456 = '(弐段)' = 2nd dan
- **Overturns:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** L-rebirth-elements / L-ui-hud: the used kanji range is 456-464 over STAT_DAN 1-9 (nine badges), not 455-464 over 0-9. A recreation that paints 初段 on a fresh character contradicts the shipped build.

### `rebirth/dan-zero-shows-no-title` — HELD [A2]

A Dan-1 (STAT_DAN 0) character displays a BLANK dan field, so the kanji title string 455 exists in the table but is never shown in game; the displayed ladder runs 456..464 for STAT_DAN 1..9.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2276-2312`
- **Quote:** case 0:
   this.danfield.text = "";
   break;
case 1:
   this.danfield.text = LangManager.getString(456);   // 456 = '(弐段)' = 2nd dan
- **Overturns:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** L rebirth-elements + ui-hud: a recreation that renders 初段 for a fresh character diverges from the original on the most common screen state in the game. The shogo suffix bands the survey reported are exactly right (465 at cases 3/4/5, 466 at 6/7, 467 at 8/9, default 467+464).

### `rebirth/dan1-renders-blank` — HELD [A2]

String 455 '(初段)' is never displayed: at STAT_DAN 0 both builds set the Dan field to an empty string, so a Dan-1 character shows NO rank text at all.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2275-2277 and desktop twin reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3063-3065`
- **Quote:** case 0:\n   this.danfield.text = "";\n   break;      // grep -rn "getString(455)" over BOTH decompiled trees returns zero hits
- **Overturns:** "③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements + ui-hud: corrects the surveyor's claim rebirth/dan-ladder-titles. The display mapping is STAT_DAN n → string 456+(n-1) for n>=1 and BLANK at n=0, not 455..464 across the board. A recreation copying the survey verbatim would render '(初段)' where the OG renders nothing — and every HUD frame in both longplays shows exactly that empty field, so this is frame-consistent too.

### `rebirth/elemental-aoe-is-a-horizontal-band` — HELD [A2]

The elemental AoE parameter is a horizontal half-width, not a radius: the hit test compares x-distance only, so Inferno 600 / Tsunami 400 / Tornado 200 / Earthquake 50 describe a band +/-N px wide with unbounded y.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:1422-1449`
- **Quote:** public static function checkHitObject(thing:MovieClip, damage:Damage, dist:int = 100, checkByAttacker:Boolean = false, objectToCheckDist:MovieClip = null) : Boolean
{
   var distsq:int = dist * dist;
   ...
   enemydist = enemy.getMCS().x - thing.x;
   if(enemydist * enemydist < distsq && enemy.checkHitObject(thing,damage,checkByAttacker))
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** L rebirth-elements + combat-core: the survey's numbers are right but its word 'radii' is not. A circular-radius implementation would let an airborne or elevated target dodge an ultimate that in the original always connects. The same function is the generic melee/projectile hit test, so this applies well beyond the elemental kit.

### `rebirth/no-elemental-buff-channel` — PARTIAL [A2]

The game's buff system provably carries no elemental status effect: the BUFF_* enum has thirteen entries and not one is burn, slow, root, freeze or damage-over-time.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:288-312`
- **Quote:** BUFF_XP=0  BUFF_ATTACK=1  BUFF_DEFENSE=2  BUFF_SPEED=3  BUFF_AP=4  BUFF_DUELTOKENS=5  BUFF_COINS=6  BUFF_RARELOOT=7  BUFF_MUTE=8  BUFF_FULLMUTE=9  BUFF_HELL=10  BUFF_INJURED=11  BUFF_MODERATOR=12
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements blocker ① residual, narrowed. Every BUFF_* is a meta/economy/moderation buff; none is a combat status. So elemental skills cannot apply a status via the buff system, and the only remaining place a burn/slow could live is an ad-hoc per-projectile effect. A grep for setOnFire|burning|poison|slowed|frozen over the android tree returns only background-art redFreeze() and a guardian stomp animation constant, so the residual is close to empty — but I did not read NPCManager.checkHitObject end to end, so PARTIAL not HELD.

### `rebirth/payout-is-the-premium-gold-purse` — HELD [A2]

The rebirth payout (+25, +100 at Dan 8) lands in STAT_HGOLD=12, the IAP-linked premium purse the HUD labels 'GOLD', not in STAT_GOLD=11, the coin purse the HUD labels 'MONEDAS'.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:192-194, 2669-2675 + OverworldHUD.as:1567-1569 + reference/extracted/sprites/DefineSprite_1671/1.png ('100000 MONEDAS') and DefineSprite_1674/1.png ('100000 GOLD')`
- **Quote:** StatsManager.as:192  internal static var STAT_GOLD:int = 11;
StatsManager.as:194  internal static var STAT_HGOLD:int = 12;
StatsManager.as:2669 public static function getHeavenlyGold() : int { var hgold:int = getPlayerStats(STAT_HGOLD); if(usePlayerIO) { hgold += QueryManagerPIO.instance.getPayVaultCoins(); }
OverworldHUD.as:1567 public function updateHGoldText(gold:int) : * { this.info.goldtext.text = String(gold); }
- **Overturns:** "film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** L economy + rebirth-elements: refines the survey's tenth-gold claim rather than refuting it (the game itself calls HGOLD 'gold', so the film's '+25 gold' is consistent). But REBIRTH.earlyGold/tenthGold must be wired to the premium currency, and a recreation that omits IAP has to decide what that purse becomes. Also resolves the ledger's currency naming: 'coins' = STAT_GOLD = MONEDAS, 'gold' = STAT_HGOLD = the cash-purchasable one.

### `rebirth/statue-two-sequence-modes` — HELD [A2]

Dragon Dance statues have TWO sequence modes, not one: the RNG permutation only applies to Later-Heaven statues (prop >= 8); Earlier-Heaven statues take their sequence verbatim from the room-object property.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Obj_DragonDanceStatue.as:37-42 and :65-66`
- **Quote:** this.num = int(props);\nif(this.num >= 8)\n{\n   this.num -= 8;\n   this.earlierHeaven = false;\n   rng = new RNG(StageManager.getCurrentNode());\n   dice = rng.rand(5);\n   …\n}\nelse\n{\n   sequence = props;\n}
- **Overturns:** "④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements blocker ④, statue half — refines the surveyor's claim rebirth/kanji-statue-bonus, which presents the RNG permutation as THE sequence rule. A recreation must implement both branches: authored sequence straight off the room prop for Earlier Heaven, node-id-seeded permutation of '1246' for Later Heaven. Both are reproducible offline; the prop values come from the room-object defs in bindata 93 / 84_QuestEngine_TrapRoomData.

### `rebirth/status-not-on-damage-packet` — PARTIAL [A2]

No elemental status effect can be carried on the Damage object: its constructor has eight parameters and none of them is a status, buff, duration or DoT field.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Damage.as:50`
- **Quote:** public function Damage(damage:int = 0, attackerlvl:int = 0, launchType:int = 0, stance:int = -1, fireDamage:int = 0, waterDamage:int = 0, windDamage:int = 0, earthDamage:int = 0)
- **Overturns:** "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** L-rebirth-elements: narrows the surveyor's STILL_UNHELD on per-element status from 'unverified in either direction' to 'not on the damage packet'. A status would have to be applied by the projectile or inside NPCManager.checkHitObject; that read is the remaining close-path.

### `rebirth/unlock-gate-ignores-gear-affixes` — HELD [A2]

Gear affixes on the four element-ATK stats do NOT count toward the 10/30/60 skill-unlock thresholds - only the rebirth-granted base stat does.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:4216-4233 (checkCondition) vs :1835 (initAttackStats), reached from XMLSkill.as:133/:321 -> StatsManager.checkConditions(:4152-4183)`
- **Quote:** public static function checkCondition(id:int, val:int, comparison:String = "gte") : Boolean
{
   ...
   else if(id >= 28 && id <= 31)
   {
      output = getStat(id);      // NO findBonusStat — contrast :1835 which adds it explicitly
   }
- **Overturns:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** L rebirth-elements: corrects the survey's own lane_impact on rebirth/unlock-gate-is-stat-threshold, which asserts the opposite. The unlock cadence therefore IS a clean function of rebirth count (1x/3x/6x, with the Dan-8 rebirth granting +20 instead of +10), because nothing else feeds stats 28-31. Shipping the gear-inclusive rule would let a player buy their way past the gate.

## world-exploration — re-scored 85

All five ledger blockers are dead. ① world bounds/geography = a byte-exact 63x72 GIF land mask (735 land territories) plus a getPixel boundary test — and the mask is byte-identical (md5 13068dfa1a5cc5628720a25782f93fed) between web v0.717 and Android v0.682, so it is the one world artifact with proven cross-build parity. ② gather/mine/farm yield+whiff tables are exact code (hunt/fish 40% whiff with 3-tier loot; search whiff = 1-(skill+1)/10; mine 50% downgrade-to-Rock; farm 1/(10-skill)). ③ "day" is 86400 real seconds and governs ONLY quest expiry — AP (60 s) and crops (900/3600/21600/43200 s + 900 s grace) are separate clocks, so the blocker was mis-framed rather than merely open. ④ AP regen 1/60 s, start 30, cap level+30. ⑤ sector=node, node=ordered room list, room=side-scrolling stage of declared px width (98 rooms, 800-4000 px) — neither option the ledger offered. On top of that the coordinate law (nodeid = x<<12|y, territory = sector/6), the level gradient (|tx-341|+|ty-341|+3, real range 3..93), the 73-entry room-object enum, the prosperity thresholds and the 24-slot save schema are all recovered, and the world's place names were reproduced character-for-character from the payload RNG and matched against a video frame. Held back from 90+ by four honest negatives: the rendered world-map ART is inside an encrypted resource blob; numeric parity of the world constants vs v0.717 is inferred (string-pool only), not byte-proven; 119_Mobile_MapData.bin is an unexplained empty stub; and the node-level <search><chance> field has no located consumer. The Surface bullet is unchanged — src/config still contains zero world numbers — but that is now a porting task, not a research one.

### `world-exploration/ap-cost-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The real AP cost table is far larger than the ledger's three entries, and stables additionally charge (node level × 2) coins on top of 5 AP.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeUI.as:361,384,395,414,427,460,535 + Obj_OreDeposit.as getAPUse + Obj_DirectionSign.as:20,106-108 + InteractUI.as:1723,1736`
- **Quote:** var cost:int = NodeGenerator.instance.getNodeLevel(StageManager.getCurrentNode()) * 2;
- **Overturns:** "AP cost table (pick 1 / search+mine 2 / stable 5)"
- **Lane impact:** L1 world-exploration: enter node 1 · world-map travel 5 · rest 1 (+100 HP/Chi) · camp 5 (+50 HP/Chi) · hunt 3 · fish 3 · search 2 · mine 2 · pick 1 · signpost 1 (0 inside a town interior room 14>roomid or roomid>=100, or a dojo) · quest step = per-step <ap>. The ledger's three entries are individually right but the table is 12 rows, and 'stable 5' omits the gold fare. The '4 travel methods' resolve to signpost / world-map / stables (adjacent-territory towns only, gated on hasTown() && isInBoundary()) / consumable teleport items (InventoryUI.as:980,1045; recall-to-start at :960,1067).

### `world-exploration/ap-regen-and-cap` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ④ "AP regen rate + cap" is dead: AP regenerates 1 per 60 real seconds (doubled under BUFF_AP), starts at 30, and max-AP is capped at character level + 30.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:158, :1100-1103, :707-708; InventoryUI.as:2409`
- **Quote:** internal static var APINTERVAL:int = 60;
- **Overturns:** "④ AP regen rate + cap."
- **Lane impact:** L1 world-exploration: closes blocker ④. Regen is timestamp-based (nextAPUpdate) so it accrues offline. Cap gate is `getStat(STAT_MAXAP) < 20 + (charlevel + 10)`. Gold faucet is 10 AP for 1 Gold (strings.json id 100; GetGoldPromptDialog.as:204). Also surfaces an uncatalogued feel rule: MCSPlayer.as:1230 makes AP==0 in adventure mode a death/retreat condition.

### `world-exploration/day-length-is-three-clocks` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ③ is mis-framed, not merely open: there is no in-game day. AP runs on a 60-second clock, crops on absolute 900/3600/21600/43200-second clocks, and the literal 24 h (86400 s) governs only quest repeat-eligibility and daily rollover.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1184, :158; Obj_VegePatch.as:80-140; QueryManagerBase.as:105; InteractUI.as:1153`
- **Quote:** if(completedQuest.completedTime == 0 || completedQuest.completedTime < serverTimeVariable - 24 * 60 * 60)
- **Overturns:** "③ real-world **"day" length** (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** L1 world-exploration (and L11 meta-social): the blocker's premise — one shared day clock governing expiry, farming, AP regen and the war tick — is false. Three independent real-time clocks, all measured off QueryManager.getServerTime() in raw seconds. Same correction applies to §1 line 116, which repeats the single-clock framing.

### `world-exploration/farming-tables` — HELD [A2] ⚑ OVERTURNS LEDGER

Farming is fully tabled: crop grow times 15 min / 1 h / 6 h / 12 h with a 15-minute harvest grace before ROT, soil grade 1-6 at 10/20/30/40/50 cumulative harvests, yield chance 1/(10-farmSkill), and — uncatalogued anywhere in the project — harvesting spawns a one-enemy combat wave.

- **Cite:** `reference/decompiled/shs3_android/scripts/Obj_VegePatch.as:80-140; InteractUI_crops.as:116-161, :457-481, :595-646`
- **Quote:** wave.init(new XMLList(<enemy><id>64</id><qty>1</qty><x>400</x></enemy>));
...
GameEngine.initBattleMode(-1,8,43,800,0,wavelist,150);
- **Overturns:** "② gather/mine/farm **yield + whiff + respawn** tables."
- **Lane impact:** L1 world-exploration: gracePeriod = 15*60 then ROTTED. Harvest roll `getStat(startingIndex+2) == 1 || int(Math.random() * (10 - getStat(1020))) == 0` — first harvest guaranteed, then 10% at skill 0. Crop dice over patchlevel picks items 2115/2116/2117/2118/2140/2141, so higher soil grade widens rather than improves the table. The harvest ambush uses enemy id 64 at x=400 on an 800-px stage, player entering at x=150, bg 43 — except at node 8402947 which uses bg 19.

### `world-exploration/gather-yield-whiff-tables` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ② "gather/mine/farm yield + whiff" is dead: hunt and fish are 3 AP with a 40% whiff and a 30/20/10 three-tier loot split; search is 2 AP with whiff = 1-(skill+1)/10; mining is 2 AP with a flat 50% downgrade to plain Rock on any non-Coal deposit.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeUI.as:424-490 (hunt/fish), Obj_Bush.as:47 (search), Obj_OreDeposit.as:70 (mine)`
- **Quote:** if(oreType != 2 && int(Math.random() * 2) != 0)
{
   OverworldHUD.getInstance().getNodeUI().runMine(1,this);
}
- **Overturns:** "② gather/mine/farm **yield + whiff + respawn** tables."
- **Lane impact:** L1 world-exploration: closes blocker ②. Hunt (3 AP, dice=int(rand*10)): 3/4/5→item 2112 'small game' 30%, 1/2→2113 'some game' 20%, 0→2114 'big game' 10%, 6-9→whiff 40%. Fish (3 AP) identical shape: items 2109/2110/2111. Search (2 AP, 24-frame bar): `int(Math.random()*10) <= getStat(1021)` → 10% at skill 0, +10pp per point. Ore ladder fully named from strings 652-659: 1 Rock/2 Coal/3 Iron/4 Tin/5 Copper/6 Silver/7 Titanium/8 Diamond (items 20059-20066), skill-1022 gates (8≥5, 7≥4, 6≥3, 5≥2, 3≥1), pickaxe item 13022 required, unbroken weapon required. 'Respawn' is not a timer — clearOre() calls StageManager.addToDeadList until room regeneration.

### `world-exploration/is-a-wxh-grid` — HELD [A2] ⚑ OVERTURNS LEDGER

§1's unknown-unknown "World-map topology/projection ... not a grid you can generate from W×H" is wrong — it is precisely a W×H grid, 63 wide by 72 tall, carrying a 1-bit land mask and rendered at 10 px per cell.

- **Cite:** `reference/extracted/android/110_Mobile_MapBitmapData.bin (GIF89a 63x72) + WorldMapUI.as:230`
- **Quote:** this.playermarker.x = (terrx + TERRSHIFTX) * 10 + 5;
- **Overturns:** "- **World-map topology/projection** (sparse geographic Japan outline, not a grid you can generate from W×H)."
- **Lane impact:** L1 world-exploration: retires one of §1's eight unknown-unknowns. The 'sparse geographic outline' intuition was right about the shape and wrong about the representation — which is exactly what made it look unrecoverable. Two lines of code plus one 272-byte GIF reproduce the whole projection.

### `world-exploration/prosperity-thresholds` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'prosperity ladder' the ledger lists as Ready is six numeric tiers at 0 / 500 / 1000 / 2000 / 4000 prosperity, with specific territories pinned to a fixed town level and never changing.

- **Cite:** `reference/decompiled/shs3_android/scripts/TerritoryData.as:782-804, :807-830; NodeGenerator.as:393-447`
- **Quote:** if(this.townProsperity == 0)
{
   return 0;
}
if(this.townProsperity < 500)
{
   return 1;
}
if(this.townProsperity < 1000)
{
   return 2;
}
if(this.townProsperity < 2000)
{
   return 3;
}
if(this.townProsperity < 4000)
{
   return 4;
}
return 5;
- **Overturns:** "**Ready:** territory/sector coord system (start 21,51 / 0,3); node-based room graph + signposts; AP cost table (pick 1 / search+mine 2 / stable 5); 4 travel methods; mining ore-by-level ladder; minimap iconography; hidden-path system; prosperity ladder."
- **Lane impact:** L1 world-exploration and L11 meta-social: 'prosperity ladder' was listed as Ready but carried no numbers. Pinned territories: ids 1466699, 1503572, 1368424, 1540387, 1413461, 1409366, 1401176, 1397081 → level 5; 1405270 → 4; 1401173 → 3; 1397077 and 1397078 → 0. Note 1409366 is the frame's Kakuchi and 1397077 is the start territory — pinned to level 0, i.e. no town at spawn.

### `world-exploration/save-schema-recovered` — HELD [A2] ⚑ OVERTURNS LEDGER

§6's claim that the save format is unrecoverable is wrong: the complete persistence schema is 20 numbered data slots plus four timer slots, each with a named serializer, and slot 10 is the world position.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:1047-1187; QueryManagerBase.as:15; StatsManager.as:208,248,5073-5080`
- **Quote:** saveUpdate(10,StatsManager.getLocationString());
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L1 world-exploration (blocker 'save model') and every other lane that inherits §6. The topology half of the ledger sentence stands (Player.IO BigDB is dead); the save-format half is false. Slots: 0 playerlevel, 1 playerstats (+103 battlestats), 2 equipment, 3 skillstats, 4 inventory, 5 questitems, 6 intstats, 7 booleanstats, 8 activequest, 9 completedquest, 10 location, 11 taunt, 12 friendlist, 14 skillslots, 15 side, 16 playerdan, 17 stash, 18 options, 19 achievementstats, 100 nextAPUpdate, 101 nextDTUpdate, 102 nextWarTurn. STAT_LOCATION=19 holds the packed node id, STAT_LOCATION_ROOM=43 the room index. There is also a real offlineMode branch and a saveCharCookieData() local path. The schema needs transcribing, not designing.

### `world-exploration/sector-room-mapping` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ⑤ "sector↔room mapping rule" is dead, and the answer is neither option the ledger offered: a sector IS a node, a node owns an ordered list of rooms, and each room is one side-scrolling stage with a declared pixel width of 800-4000.

- **Cite:** `reference/extracted/android/112_Mobile_NodeData.bin:8-18 + reference/decompiled/shs3_android/scripts/QuestEngine.as:1234-1240`
- **Quote:** 	<roomdata>
		<room>
			<id>0</id>
			<bg>4</bg>
			<width>800</width>
			<obj>
				<id>0</id>
				<x>750</x>
				<property>0,50,8386561,1,2,2,1</property>
			</obj>
		</room>
- **Overturns:** "⑤ sector↔room mapping rule (town=fixed sector vs wilderness=one-screen-per-sector)."
- **Lane impact:** L1 world-exploration: closes blocker ⑤. Measured across the authored file: 44 nodes, 98 rooms, 94 with explicit <width>, min 800 max 4000 (modes 800×22, 1000×21, 1400×7, 1600×7) = 1 to 5 screens of scroll against the 800×480 native canvas. Rooms carry <bg> (30 distinct ids), optional <roomname> and optional <enterx>. Both town and wilderness nodes carry multi-room lists, so neither ledger option holds. Player position saves as the (STAT_LOCATION node, STAT_LOCATION_ROOM room) pair.

### `world-exploration/world-bounds-land-mask` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's #1 blocker "world bounds + geography" is dead: the world's boundary is a 63x72 GIF land mask embedded in the payload, holding exactly 735 land territories, and the boundary test is a single getPixel != 0 against it.

- **Cite:** `reference/decompiled/shs3_android/scripts/QuestEngine.as:1206 + reference/extracted/android/110_Mobile_MapBitmapData.bin (GIF89a 63x72)`
- **Quote:** return mapBitmapData.getPixel(x + WarSelectUI.TERRSHIFTX - 341 - WarSelectUI.WARMARKERSHIFTX,y + WarSelectUI.TERRSHIFTY - 341) != 0;
- **Overturns:** "① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** L1 world-exploration: closes blocker ① outright. Decoding the GIF (PIL, two colours only: (0,0,0) sea / (255,255,255) land) yields 735 land pixels of 4536, bbox i∈[1,61] j∈[1,70], rendering as the Japanese archipelago. Pixel→territory map is i = x−328, j = y−290. WorldMapUI.as:230 fixes the projection at 10 px per territory, i.e. a 630×720 px world map. No Fandom scrape and no tracing required.

### `world-exploration/world-is-procedural` — HELD [A2] ⚑ OVERTURNS LEDGER

Only 44 nodes are hand-authored; every other node in the 26,460-sector world is generated deterministically from its own id, so the entire world is bit-reproducible offline from code we hold.

- **Cite:** `reference/decompiled/shs3_android/scripts/QuestEngine.as:1123; TerritoryData.as:74, :86-99, :1054/:1488/:1550/:1597/:1671; RNG.as:64-66`
- **Quote:** return NodeGenerator.getInstance().generateNode(nodeID >> 12 & 0x0FFF,nodeID & 0x0FFF);
- **Overturns:** "① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** L1 world-exploration: the ledger's close-path had the problem backwards — geography is code, not a wiki scrape. TerritoryData(id) runs generateSectors() (a ~430-line seeded road/route builder), and territory exits are pure functions of the id via `new RNG(territoryId)`. With the LCG seed=(seed*9301+49297)%233280 the whole world regenerates offline. Per-territory fixed features are node-id lists on TerritoryData:9-49 (dungeonList, controlPointList, pickableList, exitsList, hutList, animalSpawnList, dojoNode, templeNode, oniDenNode, graveyardNode, mercCampNode, townNode).

### `world-exploration/config-still-empty` — HELD [A3]

The Surface bullet is CONFIRMED unchanged: src/config still contains zero world numbers — no world.ts, no ap.ts, no farming.ts, no nodes.ts.

- **Cite:** `$ ls src/config/  (repo check, 2026-08-15)`
- **Quote:** CLAUDE.md ai.ts anim.ts art.ts chi.ts combat-sim.ts combat.ts display.ts duel.ts economy.ts fidelity.ts fx.ts gesture.ts mobs.ts nums.ts ogAnims.ts ogPose.ts palette.ts popups.ts poses.ts profile.ts reach.ts rng.ts skills.ts stances.ts stats.ts timing.ts xp.ts
- **Overturns:** "**Surface:** ZERO world numbers in config yet — needs new `world.ts`/`ap.ts`/`farming.ts` modules. Mining ore ladder + far-territory coords are sourced but missing from the digest."
- **Lane impact:** L1 world-exploration: the only ledger bullet in this block that survives audit intact. But its character changes — after this pass it is a porting task with a finished source list (this journal), not a measurement task.

### `world-exploration/coordinate-law` — HELD [A2]

The world coordinate law is fully specified in code: nodeid = sectorX<<12 | sectorY, territory = floor(sector/6), territorySector = sector mod 6 — so a territory is exactly a 6x6 block of 36 explorable nodes.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:298-302, :333; WarSelectUI.as:15-19`
- **Quote:** var sectorx:int = nodeid >> 12 & 0x0FFF;
var sectory:int = nodeid & 0x0FFF;
var territoryx:int = Math.floor(sectorx / 6);
var territoryy:int = Math.floor(sectory / 6);
- **Lane impact:** L1 world-exploration: 735 land territories × 36 sectors = 26,460 explorable nodes. Display offsets are constants TERRSHIFTX=21, TERRSHIFTY=51, WARMARKERSHIFTX=8.

### `world-exploration/cross-build-numeric-parity` — STILL_UNHELD [STILL_UNHELD]

Cross-build numeric parity for the world constants is not established: only the land mask is byte-proven identical across v0.717 and v0.682, so APINTERVAL=60, LEVELSTART=3, the crop timers and the AP costs remain Android v0.682 measurements.

- **Lane impact:** L1 world-exploration: the web payload's constant pool does prove the same procedural room builder ships in v0.717 (the <obj><id>N</id><x> templates, 'roomdata', 'procgenronin', 'aggrobandits', 'merccaptain' at payload.xml:118249-118266), but there is no web-side decompile of NodeGenerator/StatsManager — reference/decompiled/shs3_payload/scripts/ holds only display symbols, and grepping the 329 MB payload.xml for getNodeLevel|APINTERVAL|TERRSHIFTX|getOreType returns nothing. Both android bundles report clientVersion 0.682. Every ported number must carry that label.

### `world-exploration/frame-confirms-6x6-grid` — HELD [A1]

A video frame shows the minimap as a 6x6 grid labelled 0-5 on both axes with the player marker at column 1 row 3, matching the HUD's own "SECTOR (1,3)" — independently confirming the floor(sector/6) / sector%6 law from the code.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg, crop (360,10)-(512,120), Lanczos ×8 → 1216×880`
- **Quote:** Visible in the crop: a 6-column × 6-row minimap grid, columns labelled 0 1 2 3 4 5 across the top and rows 0 1 2 3 4 5 down the left, N/E/S/W compass letters, a white player triangle at column 1 / row 3, a gold up-arrow exit icon at (3,0), gold gate icons at (5,0) and (0,5), a gold X at ~(2,2), and a dashed white route outline. Below it the HUD prints TERRITORY (24,52) / SECTOR (1,3).
- **Lane impact:** L1 world-exploration: frame and payload AGREE — no frame-vs-doc conflict to adjudicate here. Confirms the territory board is 6×6 and the sector pair is the within-territory index. Two sibling frames (frame_0040.jpg 'INSIDE SECTOR (3,0)', frame_0080.jpg 'SECTOR (3,2)', crop (415,132)-(500,162) ×4) show the two label variants come from Minimap.as:103 vs Territorymap.as:113.

### `world-exploration/land-mask-version-parity` — HELD [A3]

The world land mask is byte-identical between the web v0.717 payload and the Android v0.682 build, so the Stage-0b Android caveat does not apply to the world geography.

- **Cite:** `md5 + cmp of reference/extracted/bindata/92_1t4648s0.bin vs reference/extracted/android/110_Mobile_MapBitmapData.bin`
- **Quote:** MD5 (reference/extracted/bindata/92_1t4648s0.bin) = 13068dfa1a5cc5628720a25782f93fed
MD5 (reference/extracted/android/110_Mobile_MapBitmapData.bin) = 13068dfa1a5cc5628720a25782f93fed
$ cmp ... && echo "BYTE-IDENTICAL"
BYTE-IDENTICAL
- **Lane impact:** L1 world-exploration: upgrades WX-01 from Android-only to cross-build proven. Also corrects Stage-0 finding S0-1, which catalogued web bindata 92 merely as "GIF89a 63x72 raster" — that raster IS the world.

### `world-exploration/level-gradient` — HELD [A2]

Content difficulty across the whole world is one formula: node level = |territoryX-341| + |territoryY-341| + 3, capped at 200 — which over the actual land mask yields a real range of 3 to 93.

- **Cite:** `reference/decompiled/shs3_android/scripts/NodeGenerator.as:385-390 and :144`
- **Quote:** var lvl:int = Math.abs(territory.x - 341) + Math.abs(territory.y - 341) + this.LEVELSTART;
if(lvl > 200)
{
   lvl = 200;
}
- **Lane impact:** L1 world-exploration and L9 enemies-ai: the entire difficulty geography, absent from the ledger. LEVELSTART=3. Territory counts by level: L3×1, L4×2, L5×4, L6×5, L7×7, L8×8, L9×10, L10×9, L11×10, L12×14. Cross-check: the frame's territory (24,52) → internal (344,342) → level 7, and the same frame shows a level-8 player.

### `world-exploration/map-art-unheld` — STILL_UNHELD [STILL_UNHELD]

The rendered world-map ART is not recovered — the 63x72 GIF is a 1-bit land/sea mask only, and the drawn map lives in an encrypted nested-SWF resource blob.

- **Lane impact:** L1 world-exploration: the topology is recovered, the picture is not. MapBG/WorldMapUI source their visuals from assets.swf, and the mobile art bundle 124_Mobile_ImageResource.bin (1.73 MB) is one of the five CWS nested-SWF blobs Stage-0b finding S0-5 marks held-but-encrypted, not opened. Must not be claimed as recovered.

### `world-exploration/mapdata-blob-empty` — STILL_UNHELD [STILL_UNHELD]

119_Mobile_MapData.bin is a 65-byte empty stub (<mapdata></mapdata>, zero children) even though Mobile_MapData.as, QuestEngine.getMapSquareID and XMLWorldMap all expect content — and I cannot say why.

- **Lane impact:** L1 world-exploration: possible Android-only stripping, possible dead subsystem. Whether the web v0.717 build shipped a populated mapdata is not established. Logged as a lead, not a finding.

### `world-exploration/place-name-reproduced-from-payload` — HELD [A1]

The territory name burned into the video frames ("KAKUCHI") is reproducible character-for-character from the payload's own LCG and name tables, proving every place name in the 26,460-node world is deterministically regenerable from the node id.

- **Cite:** `reference/frames/Nr4fQstqHDM/map/frames/frame_0020.jpg + frame_0080.jpg, crop (20,40)-(180,64), Lanczos ×5; derivation from NameGenerator.as:145-166 and RNG.as:64-66`
- **Quote:** Frame title bars read verbatim: "W KAKUCHI MOUNTAIN PATH" (frame_0020, SECTOR (1,3)) and "KAKUCHI DOJO GATES" (frame_0080, SECTOR (3,2)), both at TERRITORY (24,52).
- **Lane impact:** L1 world-exploration: displayed (24,52) → internal territory (344,342) → territoryID 1409366 → getTownName2 → RNG(2818732) with seed=(seed*9301+49297)%233280 picks namestarting[73]="Ka" + nameending[19]="kuchi" = "Kakuchi". Exact match with the frame. The 'W' prefix is also generated (terrSector.x=1 ≤1 → string 401 = "W"), and frame_0080's sector (3,2) correctly emits no prefix. Same routine names the start territory (id 1397077) "Kasuta".

### `world-exploration/room-object-enum-and-node-graph` — HELD [A2]

The room-object type enum is fully recovered as 73 entries (ids 0-72 plus a nested-list id 100), and object id 0 — the signpost — is the node graph itself, accounting for 186 of the authored file's 343 objects.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameStage.as:683-920; Obj_DirectionSign.as:37-90; reference/extracted/android/112_Mobile_NodeData.bin:16`
- **Quote:** case 30:
   obj = new Obj_OreDeposit(objProperty,objName);
case 31:
   obj = new Obj_Hut(objProperty);
- **Lane impact:** L1 world-exploration: gives the ledger's 'node-based room graph + signposts' Ready bullet real content. Signpost property format decodes as destRoom,entryX,destNodeId,visible,compassDir(0=N,1=S,2=E,3=W),spriteFrame,arrowLabelId — worked example '0,50,8386561,1,2,2,1' = 'walk East to node 8386561, land in its room 0 at x=50'. Minimap icon enum is 24 values (NodeGenerator.as:34-82, ICON_NOTHING 0 … ICON_BEACH 23, ICON_OVERWRITENODE 100), which grounds the 'minimap iconography' Ready bullet.

### `world-exploration/search-chance-semantics` — STILL_UNHELD [STILL_UNHELD]

The node-level <search><id>20000</id><chance>5</chance> block's semantics are unknown: XMLWorldNode stores it in searchList and no consumer of searchList exists anywhere in the 559-class decompile.

- **Lane impact:** L1 world-exploration: exactly one such block exists in the whole authored node file. 'chance' in XMLLoot is a 0..1 fraction (Overworld.as:324 multiplies by 100), which would make the value 5 meaningless here. Dead field, alternate scale, or a consumer I failed to find — not claimed either way.

### `world-exploration/start-coords-derived` — HELD [A2]

The ledger's Ready bullet "(start 21,51 / 0,3)" is confirmed and now derivable: the character-creation literal STAT_LOCATION = 8382465 decodes to sector (2046,2049) → territory (341,341) → displayed TERRITORY (21,51), SECTOR (0,3).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:713 (+ decode via NodeGenerator.as:298-302, WarSelectUI.as:17-19)`
- **Quote:** setPlayerStats(STAT_LOCATION,8382465);
- **Overturns:** "**Ready:** territory/sector coord system (start 21,51 / 0,3)"
- **Lane impact:** L1 world-exploration: the Ready bullet was right but ungrounded. "21,51" is not an observed coordinate pair, it IS TERRSHIFTX/TERRSHIFTY — the world's level-3 origin territory (341,341) displays at (21,51) by construction. 8382465 is also the first node in 112_Mobile_NodeData.bin:5.
