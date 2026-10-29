# L0 — salvaged claim set (raw surveyor output)

> **UNVERIFIED.** These are surveyor claims. A claim is only CONFIRMED
> once blind artifact-citing critics have judged it (GAUNTLET.md §0/§3.3).
> Banked: 12 surveys · 8 critic reviews · 287 claims · 151 verdicts.

## art-anim-audio-feel — re-scored 92

56 -> 92. Five of the block's six blockers close outright. The headline: the ledger's #1 blocker "ALL AUDIO -- every SFX + music param is INFERRED, no composer sourced" and §6's "exact waveforms/envelopes are not [recoverable]" are both FALSE -- reference/preservation/shs3_android_payload.swf has been on disk since 2026-07-23 and decrypts with the game's own documented routine (key = filename.charCodeAt(1), ResourceManager.as:186,200) to yield 13 SFX + 13 music stems as MPEG-2.5 Layer III / 16 kbps / 11025 Hz mono MP3, named exactly as SoundManager/MusicManager call them. Font closes (Edo SZ, (c) 2008 Vic Fieger, embedded DefineFont3 with metrics). Blend modes close as a resolved NEGATIVE (6 blendMode hits corpus-wide, all Flex framework; game uses ColorTransform + BlurFilter + ColorMatrixFilter only). Screen-shake closes with the exact algorithm and call-site durations. Severed-limb deaths close (deathinhalf/deathnohand/deathnohead + seppuku_nohead). Beyond the blockers, the whole "Ready" list is under-claimed: it credits video MEASUREMENTS where the ORIGINAL source sits on disk -- 487 authored animations / 5,596 keyframes / 81,706 bone poses, ~2,400 vector shapes with literal fill hex, exact blood-particle and blade-FX params, per-layer depth-of-field blur, and a 24 fps engine clock that contests the "15fps pose latch". Residual -8 is two honest STILL_UNHELDs (per-hit hitstop; three unverifiable "Surface" bullets incl. scarf physics, which has zero counterpart in 2,768 decompiled classes) plus the fact that mapping the 19 rig node ids to shape symbols is real engineering. What remains here is engineering, not archaeology.

### `art-anim-audio-feel/audio-waveforms-held` — HELD [A3] ⚑ OVERTURNS LEDGER

The ledger's single biggest blocker is void: all 13 SFX and all 13 music stems exist on disk right now as MPEG-2.5 Layer III / 16 kbps / 11025 Hz mono MP3, inside reference/preservation/shs3_android_payload.swf, which decrypts with the game's own routine.

- **Cite:** `reference/preservation/shs3_android_payload.swf -> DefineBinaryData charId 122 (soundresource.swf, 13 DefineSound) and charId 113 (musicresource.swf, 13 DefineSound); pasted parse output in docs/gauntlet/L0/systems/art-anim-audio-feel.md CLAIM 1`
- **Quote:** soundresource (122): deflect/die1/die2/die3/sumo/slash1/slash2/slash3/refund/goodkoto/hitmetal/fart/punch -- all (MP3, 11025, 16, 'mono'). musicresource (113): bgm_lose, safepercussion, safekoto, safeambience, bgm_levelup, bgm_gangnam, flutes, dungeonpiano, dungeonpercussion, dungeonflute, dungeonambience, battledrums, battlechants. First MP3 frame header decoded: 'mpeg MPEG2.5 layer III bitrate 16 kbps samplerate 11025 channel mono'
- **Overturns:** "① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced. *But not unclosable:* ≥3 isolated music-bed rips exist on YouTube (menu/battle/mine) + a 2012 dev trailer — a **listen-pass (watch skill) on the longplay audio + rips** characterizes them (study-only, legal)."
- **Lane impact:** L7 (AUDIO) is transformed. Its done-criterion ('characterised via a listen-pass') is obsolete: synthesis targets can be derived from the isolated original stems by spectral analysis rather than guessed from mixed longplay audio. Kheshav's ears remain the gate, but the reference is now exact. Caveat: study-only/local-only/gitignored -- the project invariant is WebAudio-synthesized SFX only, and the owner grant excludes licensed third-party music (bgm_gangnam is self-evidently third-party).

### `art-anim-audio-feel/blend-modes-none` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ③ 'FX blend modes' closes as a resolved NEGATIVE: no game class ever reads, writes or names a blend mode -- the original composites in normal blend only, and its entire effect vocabulary is ColorTransform + BlurFilter + ColorMatrixFilter.

- **Cite:** `reference/decompiled/shs3_android/scripts/ColorCode.as:12,21-26,47-48,52-56,58-62; whole-corpus grep -rn "blendMode" reference/decompiled/ -> 6 hits, all mx/core/IFlexDisplayObject.as:87,89`
- **Quote:** internal static var blackColorTransform:ColorTransform = new ColorTransform(0,0,0,1,0,0,0,0); ... var myElements_array:Array = [0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0.3,0.59,0.11,0,0,0,0,0,1,0]; var myColorMatrix_filter:ColorMatrixFilter = new ColorMatrixFilter(myElements_array); ... var blurFilter:BlurFilter = new BlurFilter(blur,blur,BitmapFilterQuality.LOW);
- **Overturns:** "③ FX **blend modes**;"
- **Lane impact:** L6: stop hunting for a compositing contract that does not exist. Recursive filter census over all 559 android scripts: 13 x BlurFilter, 7 x ColorMatrixFilter, 0 of every other filter type. Desaturation luma weights are 0.3/0.59/0.11. (payload.xml's 206 glowColor / 2 dropShadowColor entries are authoring-time filters baked per symbol, recoverable from reference/extracted/.)

### `art-anim-audio-feel/blood-particle-params` — HELD [A2] ⚑ OVERTURNS LEDGER

A §5 Tier-1 task listed as 'measure from footage' is already closed in the payload: the blood emitter's exact parameters are in code -- 20 droplets, +/-10 degrees spread, speed 6+/-2, gravity 0.6, life 24 ticks (1.00 s at 24 fps).

- **Cite:** `reference/decompiled/shs3_android/scripts/BloodParticleEmitter.as:18-26`
- **Quote:** pnumber = 20; px = 0; py = 0; pangle = 0; panglevariance = 10; pvel = 6; pvelvariance = 2; pgravity = 0.6; pttl = 24;
- **Overturns:** "**Frame-measure combat numbers from existing footage:** blade-FX reach span per stance; L1 bandit-fight damage popups + HP-bar fractions; blade-trail width/fade; blood droplet count/spread; whether there's screen-shake / hitstop."
- **Lane impact:** L6: delete 'blood droplet count/spread' from the Tier-1 measure list. Pooled bitmap particles via BloodParticlePool, with a black variant (BloodParticleBlackArt) for non-bleeding enemies.

### `art-anim-audio-feel/font-edo-sz` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ② 'font (unidentified)' closes with designer, year, embedded glyph outlines and numeric metrics -- the game font is Edo SZ by Vic Fieger (2008), a freeware face, used at sizes 13/14/16 in #cccccc and #ffffff.

- **Cite:** `reference/extracted/payload.xml DefineFont3Tag fontID="2" + DefineFontNameTag fontId="2"; reference/extracted/ui_strings.txt:100,206,212`
- **Quote:** fontCopyright="2008 Vic Fieger" fontId="2" fontName="Edo SZ"  ·  fontAscent="18505" fontDescent="4315" fontFlagsHasLayout="true" fontID="2" fontLeading="2926" fontName="Edo SZ"  ·  ui_strings.txt:100: <font face="Edo SZ" size="14" color="#cccccc" letterSpacing="0.
- **Overturns:** "② font (unidentified)."
- **Lane impact:** L8 + L6: the display font is obtainable (freeware) AND its outlines ship inside the payload. Upgrades Stage-0 finding S0-2, which had only the face name. Caveat: the payload also embeds Calibri (533), Calibri Bold (60), Arial, Times New Roman, Adobe Godic Std B and EPSON -- all third-party, all outside the owner grant; only Edo SZ matters for fidelity.

### `art-anim-audio-feel/framerate-24-not-15` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The engine clock is 24 fps, not 15: the SWF header, the mobile entry point and all three decrypted resource libraries all declare 24.0, and the animation runtime advances exactly one authored keyframe per tick with no sub-rate divider -- so the 'pose latch' is a per-clip authored HOLD, not a global 15 Hz sample rate.

- **Cite:** `reference/extracted/payload.xml:5 (frameRate="24.0"); reference/decompiled/shs3_android/scripts/Mobile.as:117; MCSCharacter.as:1315,1332-1337; AnimData.as:25-126`
- **Quote:** <swf ... frameCount="6" frameRate="24.0" ... version="17">  ·  GameEngine.getStageMC().frameRate = 24;  ·  ++this.frameCounter; ... internal function updateFrame() : * { if(this.frameCounter < this.currentAnimation.frameList.length) { this.currentAnimation.frameList[this.frameCounter].setPosition(this); } }  ·  case "sheathesword": this.duration += 24;  ·  case MCSActor.DEATHTOUCH_PARTA: this.duration += 50;
- **Overturns:** "motion (15fps latch, gaits, slash frames, death), byte-exact palette"
- **Lane impact:** L5 + L6: every duration in the payload is in 24 fps ticks, so any config value derived from a 15 fps assumption is off by 1.6x. Marked PARTIAL and not HELD because this is payload code vs a video-derived measurement, NOT frame-vs-doc -- the frame-wins invariant does not decide it. But project memory already records a 15 fps SAMPLING FLOOR on the video study ([[project-session11-study-pass]]), which is exactly the number the ledger reports as the engine rate, so it is far more likely a sampling artefact. Correct next step is one dense-fps frame pass, not another doc edit.

### `art-anim-audio-feel/music-architecture` — HELD [A2] ⚑ OVERTURNS LEDGER

The music is not a playlist but a 13-stem vertical-layering mixer with 18 preset masks, phase-locked stem entry, and a fixed 0.05-per-tick linear fade (~0.83 s at 24 fps) -- exactly the 'music params' the ledger calls INFERRED.

- **Cite:** `reference/decompiled/shs3_android/scripts/MusicManager.as:12-46,50-76,115-186,206,243,248,301,329`
- **Quote:** internal var TOTALTRACKS:int = 13; ... presetsArray[MUSIC_EXPLOREDANGER][TRACK_FLUTES] = true; presetsArray[MUSIC_EXPLOREDANGER][TRACK_SAFEAMBIENCE] = true; presetsArray[MUSIC_EXPLOREDANGER][TRACK_SAFEPERCUSSION] = true; ... playPosition = int(this.scArray[this.TRACK_FLUTES].position); ... sndTransform.volume -= 0.05; ... sndTransform.volume += 0.05;
- **Overturns:** "| **art-anim-audio-feel** | 56 | motion (15fps latch, gaits, slash frames, death), byte-exact palette | **all audio** (SFX + music params); font; FX blend modes; screen-shake/hitstop |"
- **Lane impact:** L7 must be built as a stem mixer, not a track player. Presets MUSIC_NONE 0 / EXPLOREBATTLE 1 / TOUGHBATTLE 2 / QUIET 3 / EXPLORESAFE 4 / EXPLOREDANGER 5 / EXPLORETOWN 6 / DUNGEONBATTLE 7 / PVP 8 / DUNGEON 9 / DUNGEONCREEPY 11 / DUNGEONCREEPYDANGER 12 / DOJO 14 / BATTLEDRUMS 15 / DUNGEONDANGER 16 / GANGNAM 100 / LEVELUP 101 / LOSE 102. LOSE plays 1 loop, LEVELUP 999.

### `art-anim-audio-feel/music-waveforms-unrecoverable-false` — HELD [A3] ⚑ OVERTURNS LEDGER

§6's 'structurally UNRECOVERABLE' entry for SFX/music waveforms is disproven -- the exact waveforms are held, not merely their character, and the stem lengths prove the vertical-layering design (all six surface stems exactly 882,144 samples; all four dungeon stems exactly 504,288).

- **Cite:** `reference/preservation/shs3_android_payload.swf -> charId 113 musicresource.swf DefineSound sample counts`
- **Quote:** safepercussion/safekoto/safeambience/flutes/battledrums/battlechants = 882144 samples (~80.01 s) each; dungeonpiano/dungeonpercussion/dungeonflute/dungeonambience = 504288 samples (~45.74 s) each
- **Overturns:** "**Exact original SFX & music synthesis params** — the *character* is study-able from audio; the exact waveforms/envelopes are not."
- **Lane impact:** L0 must delete this bullet from §6's unrecoverable list. L7 gains stem-identical loop lengths, which is the mechanical precondition for reproducing the phase-locked crossfade.

### `art-anim-audio-feel/native-canvas-800x480` — HELD [A1] ⚑ OVERTURNS LEDGER

The §1 aspect-ratio unknown-unknown closes: native canvas is 800x480 (with an 800x690 friend-bar variant), and the reference video is pillarboxed, so x-fractions taken against full 1920 width are wrong by ~3%.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png (measured non-black content bbox: cols 52-1867, rows 0-1079 = 1816x1080, aspect 1.6815); reference/decompiled/shs3_android/scripts/GameEngine.as:269-271; reference/extracted/payload.xml:6`
- **Quote:** var originalWidth:int = 800; var originalHeight:int = 480; var originalHeightWithBar:int = 690;   ·   <displayRect type="RECT" Xmax="16000" Xmin="0" Ymax="13800" Ymin="0" nbits="15"/>  (twips /20 = 800 x 690)   ·   frame content bbox 1816x1080, aspect 1.6815 vs 5:3 = 1.6667
- **Overturns:** "**Aspect-ratio truth** — native canvas is **800×480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."
- **Lane impact:** L8 (UI + SCREENS) blocker ① closes with doc AND frame in agreement. Every prior pixel measurement taken off these 1080p frames must be renormalised to the 1816 px content box, not 1920 -- this affects L6's fighter-height and stride numbers as much as L8's HUD fractions.

### `art-anim-audio-feel/original-keyframe-rig` — HELD [A2] ⚑ OVERTURNS LEDGER

The whole 'Ready' list is under-claimed on provenance: it credits video measurements where the ORIGINAL authored skeletal animation data sits on disk -- 487 animations, 5,596 keyframes and 81,706 individual bone poses with integer x/y/rotation or a full 2x2 matrix.

- **Cite:** `reference/extracted/bindata/118_1t4645s0.bin:3,26-28,217; reference/extracted/anim_xml.txt (482 unique names); reference/decompiled/shs3_android/scripts/AnimData.as:15-16 + FrameNodeData.as:27-44,46-76`
- **Quote:** <anim i="light_run" d="9" l="1">  /  <f i="0">  /  <n i="20" x="-3" y="-52" r="66"></n>   ·   counts: grep -o '<anim i=' -> 487, grep -o '<f i=' -> 5,596, grep -o '<n i=' -> 81,706   ·   FrameNodeData: this.rotation = xml.@r; ... m.a = this.matA / 100;
- **Overturns:** "**Ready (strongest slice):** 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle; flat-vector bold-outline style; **byte-exact HUD/result palette**; blade-trail colors; kill-beat."
- **Lane impact:** L6 (ART + ANIM) is re-founded. Its scope item 'the remaining ~150 animations' is wrong by 3x -- there are 487, and none of them need authoring, only porting. Per-stance slash timings become exact (Light horslash a13/b9-loop/c6/d1, downslash a12/b9/c4/d1, upslash a6/b9/c5/d1, fallslash a7/b1/c1, jumpslash a2/b1/c5/d1). 19 distinct rig node ids per human.

### `art-anim-audio-feel/screen-shake` — HELD [A2] ⚑ OVERTURNS LEDGER

Screen-shake is fully catalogued: uniform random 2-D offset in +/-amt/2 per tick on both axes, self-damping via min(amt, counter), exact snap-back to origin, default amplitude 30 px, with measured call-site durations of 6, 12 and 24 ticks.

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:1200-1227 (+ MCSPlayer.as:911,946,4180; HeavenlySwordProjectile.as:76; Trap_CrusherBlockAuto.as:88; Marker_RumbleTrigger.as:9,11)`
- **Quote:** public static function startShake(shakeDuration:int, shakeAmt:int = 30) : * { screenShake = true; screenShakeCounter = shakeDuration; screenShakeAmt = shakeAmt; screenShakeStartPos = new Point(gameStage.x,gameStage.y); } ... shakeAmount = Math.min(screenShakeAmt,screenShakeCounter); gameStage.x = screenShakeStartPos.x + (-shakeAmount / 2 + Math.random() * shakeAmount); gameStage.y = screenShakeStartPos.y + (-shakeAmount / 2 + Math.random() * shakeAmount);
- **Overturns:** "④ **screen-shake** + **hitstop-on-landed-hit** (never catalogued)"
- **Lane impact:** L5 + L6: implementable today with zero inference. Also kills §5 Tier-1 item 2's sub-task 'whether there's screen-shake'. NOTE the RNG requirement: Sim uses injected mulberry32, so the two Math.random() calls per tick must be drawn from that stream to stay deterministic.

### `art-anim-audio-feel/severed-limb-deaths` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ⑤ closes: four dismemberment death animations plus a beheaded seppuku are named in the animation table with exact frame durations and a documented +6-frame post-hold.

- **Cite:** `reference/extracted/anim_xml.txt:86-97; reference/extracted/bindata/103_1t4630s0.bin (child id seppuku_nohead); reference/decompiled/shs3_android/scripts/AnimData.as:59-66`
- **Quote:** <anim i="deathinhalf" d="28">  ·  <anim i="deathnohand" d="25">  ·  <anim i="deathnohead" d="31">  ·  <anim i="death" d="38">  ·  <anim i="deathbyarrow" d="21">  ·  <anim i="deathdowned" d="7">  ·  <anim i="deathenemy" d="23">
- **Overturns:** "⑤ severed-limb death variant."
- **Lane impact:** L6: the severed-limb variants are not a gap, they are four named clips with keyframe data sitting in reference/extracted/bindata/. Each carries duration += 6 applied at load.

### `art-anim-audio-feel/sfx-cue-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete SFX trigger contract is held, including two facts no video pass could recover: slash and death each pick uniformly from three variants, and hit and hurt play the SAME sound.

- **Cite:** `reference/decompiled/shs3_android/scripts/SoundManager.as:187-219,221-253,261,274,287,300`
- **Quote:** public function playSlash() : * { ... var dice:int = Math.random() * 3; if(dice == 0) { sound = ResourceManager.getSound("slash1"); ... } else if(dice == 1) { ... "slash2" ... } else if(dice == 2) { ... "slash3" ... } }  //  playHit():261 -> getSound("punch")  ·  playHurt():274 -> getSound("punch")
- **Overturns:** "① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced."
- **Lane impact:** L7 gets the trigger map for free; L5 (COMBAT CORE) gets a free oracle on hit registration -- one landed hit fires exactly one 'punch' whether the player deals or takes it.

### `art-anim-audio-feel/vector-library-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The art itself is held byte-exact as vector, twice over -- 1,822 SVG shapes + 827 sprites already extracted from the web payload, plus roughly 2,423 shapes / 2,595 sprites across the five decrypted mobile libraries, with exactly 4 bitmap tags in the entire game.

- **Cite:** `reference/extracted/shapes/1.svg:4; docs/gauntlet/L0/index/payload_histogram.json ("shapes": 1822, "shapeBounds": 1822, "subTags": 827, "color": 14788, "textColor": 856); decrypted blobs 115/120/124 tag census`
- **Quote:** <path d="M800.0 480.0 L800.0 500.4 800.0 744.0 14.0 744.0 0.0 744.0 0.0 672.15 0.0 500.4 0.0 480.0 800.0 480.0" fill="#eeeee6" fill-rule="evenodd" stroke="none"/>   ·   blob 115 shs3resource.swf -> 1,755 shapes / 1,949 sprites / 0 bitmaps; blob 120 bgresource.swf -> 562 shapes / 552 sprites / 2 bitmaps; blob 124 imageresource.swf -> 106 shapes / 94 sprites / 2 bitmaps
- **Overturns:** "flat-vector bold-outline style; **byte-exact HUD/result palette**; blade-trail colors"
- **Lane impact:** L6 + L3: the palette is recoverable as literal fill="#rrggbb" per path rather than eyedropped from video, which upgrades 'byte-exact' from a measurement claim to a source claim. It also independently vindicates the project invariant 'procedural vector art only (no image files)' as a FIDELITY choice -- the original is ~100% vector.

### `art-anim-audio-feel/blade-slash-fx-lifetime` — HELD [A2]

The blade slash flash is a 5-frame self-deleting MovieClip (~208 ms at 24 fps) whose art is a named symbol in the recoverable vector library, so blade-trail width/fade/colour need no video eyedropping.

- **Cite:** `reference/decompiled/shs3_android/scripts/bladeslashfx.as:5,12,15-21`
- **Quote:** [Embed(source="/_assets/assets.swf", symbol="symbol172")] ... addFrameScript(4,this.frame5); ... internal function frame5() : * { if(parent != null) { MovieClip(parent).removeChild(this); } }
- **Lane impact:** L6: closes the other half of Tier-1 item 2 ('blade-trail width/fade'). Sibling FX classes in the same bundle: DashFX, WhiteOutFX, ChiChargeFX, ChargingFX, ChargingShotFX, BullChargeFX, YinYangUpFX, YinYangDownFX, SlashWaveProjectile.

### `art-anim-audio-feel/depth-of-field-blur` — HELD [A1]

The game applies per-parallax-layer Gaussian blur -- a depth-of-field that is a large part of the art's read and is absent from every bullet in the ledger's art block; the frame agrees with the code.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png, crop (300,200)-(700,450) upscaled x3 NEAREST vs crop (760,600)-(1200,900) x3; corroborated by reference/decompiled/shs3_android/scripts/BG_Loader.as:111,190,211,231,250,263`
- **Quote:** In the (300,200)-(700,450) crop the far rock-wall layer has soft wide gradient outlines with no hard edge anywhere -- unmistakable blur, not stylisation. In the (760,600)-(1200,900) crop the two fighters have hard black outlines, flat fills, zero softness. Same frame, two layers, opposite treatment. Code: ColorCode.blur(mc,farthestLayerBlur); ColorCode.blur(mc,farLayerBlur); ColorCode.blur(mc,playerPlaneLayerBlur); ColorCode.blur(mc,groundLayerBlur); ColorCode.blur(mc,foregroundLayerBlur); ColorCode.setMCTint(farArray[i].base,0.1,bgParam);
- **Lane impact:** L6 + L9: parallax layers need per-layer BlurFilter (observed constants 4 and 8) plus a 10% distance tint on the far layer. Omitting this is why a flat-vector recreation reads as flatter than the original.

### `art-anim-audio-feel/hitstop-per-hit` — STILL_UNHELD [STILL_UNHELD]

The hitstop-on-landed-hit half of blocker ④ remains genuinely unheld: no per-hit time freeze exists anywhere in the decompiled corpus under any name I searched, and I did not open dense-fps frames to test it empirically.

- **Quote:** grep across reference/decompiled/shs3_android/ for hitstop, hitStop, freezeFrame, timeScale, slowmo, slowMotion, hitPause, pauseGame returned zero hits outside the battle-end redFreeze; animFrozen (MCSPlayer.as:4433) is an animation-hold flag, not a global tick freeze
- **Overturns:** "④ **screen-shake** + **hitstop-on-landed-hit** (never catalogued)"
- **Lane impact:** L5: absence of a symbol is not proof of absence of the effect. Close path does not need frames -- read the decrypted shs3resource.swf MovieClip timelines, or trace GameEngine's main tick for a conditional skip. Cheap, and now unblocked by the decrypt recipe.

### `art-anim-audio-feel/kill-beat-redfreeze` — HELD [A2]

The 'kill-beat' listed as a frame-measured Ready item is an engine state named redFreeze with exact tick counts and an exact layer composition -- 24*6 ticks (6.0 s) on battle end, win UI at 24*5, lose branch at 24*3, all parallax layers hidden and ground layers 0-1 driven to pure black.

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:898-930,1075-1106 + GameStage.as:514-544`
- **Quote:** redFreezeCounter = 24 * 6; ... if(redFreezeCounter == 24 * 5) { unRedFreeze(); ... battleUI.showWin(); } ... else if(redFreezeCounter == 24 * 3) { redFreezeCounter = -2; ... battleUI.showLose(); }  //  GameStage.redFreeze(): farthestArray[i].visible = false; ... if(i <= 1) { ColorCode.makeBlack(this.groundArray[i]); } else { this.groundArray[i].visible = false; }
- **Lane impact:** L5 + L6 + L8: the end-of-battle beat is now a spec, not a look. Also freezes NPCManager, ProjectileManager, ParticleSystemManager, hides battleUI/skillUI, disables input and calls StatsManager.resetCombo().

### `art-anim-audio-feel/music-routing` — HELD [A2]

The full background-to-music-preset router and the danger-to-battle escalation rule are held verbatim.

- **Cite:** `reference/decompiled/shs3_android/scripts/SoundManager.as:114-185`
- **Quote:** if(isPvP) { this.playMusic(MusicManager.MUSIC_PVP); } else if(bg == GameStage.BG_DUNGEON || bg == GameStage.BG_CAVE || ... ) { if(isHostile) { this.playMusic(MusicManager.MUSIC_DUNGEONDANGER); } else { this.playMusic(MusicManager.MUSIC_DUNGEON); } } ... public function pickBattleMusic() : * { if(this.isPlaying == MusicManager.MUSIC_EXPLOREDANGER) { this.playMusic(MusicManager.MUSIC_EXPLOREBATTLE); }
- **Lane impact:** L7 + L9 (WORLD): music selection is a pure function of (background id, isHostile, isPvP), so it can be wired the moment the room graph exists.

### `art-anim-audio-feel/resource-decrypt-recipe` — HELD [A2]

All five original resource libraries decrypt with the game's own documented rule -- key = resourceFileNameArray[n].charCodeAt(1) -- and brute-force recovers exactly the predicted key characters, independently confirming the routine.

- **Cite:** `reference/decompiled/shs3_android/scripts/ResourceManager.as:41,186,200-217`
- **Quote:** internal static var resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"]; ... ba = decryptByteArray(ba,resourceFileNameArray[num].charCodeAt(1)); ... for(var i:int = 3; i < 256; i++) { if(i % 11 == 0) { temp = int(ba[i]); ba[i] = ba[i + 256]; ba[i + 256] = temp; } ba[i] ^= key; }
- **Lane impact:** Cross-lane lever. Brute-force returned key 117 'u' (musicresource), 111 'o' (soundresource), 104 'h' (shs3resource), 103 'g' (bgresource), 109 'm' (imageresource) -- exactly charCodeAt(1) of each name. This is what unlocked L7's audio and it also opens the full mobile art libraries for L6/L3.

### `art-anim-audio-feel/surface-bullets-unverified` — STILL_UNHELD [STILL_UNHELD]

Three of the block's five 'Surface' bullets could not be grounded at all, and one of them (scarf physics) has zero counterpart anywhere in 2,768 decompiled classes -- yet the ledger asserts they are already measured/authored.

- **Quote:** grep across all 8 decompiled bundles for scarf/Scarf -> 0 hits; hitTint/tintCounter/hitFlash/makeRed -> 0 hits; FINISHER_FLASH -> 0 hits. The ledger sentence asserts these are 'all measured/authored but missing from the art digest §5'.
- **Overturns:** "**Surface:** hit-tint scaling (7/12/16f), death sword-detach, dash-snap, scarf physics, FINISHER_FLASH — all measured/authored but missing from the art digest §5."
- **Lane impact:** L6: before promoting these into the art digest, establish whether they are ORIGINAL behaviours or project-authored inventions. If authored, they belong in DIVERGENCES, not in a fidelity digest. I did not open frames to test them and did not determine which -- flagging only that the ledger's confidence here is not supported by the original code.

## combat-core — re-scored 88

42 → 88. The ledger scored combat-core as "structure known, load-bearing numbers must be measured from footage or a dead build." That premise is void: `reference/decompiled/shs3_android/scripts/` holds the complete, UNOBFUSCATED ActionScript 3 source of the combat system (925 default-package classes: MCSPlayer 4775 lines, NPCManager, InputManager, StatsManager, Damage, BattleUI, StageManager). Identity confirmed as Duels, not a sibling title (QueryManagerPIO.as:1872 `"name":"Straw Hat Samurai: Duels",`). ALL FIVE combat-core blockers are closed from source, not measurement: ① reach cap (full formula + units), ② crit multiplier (1.5 Light / 1.2 other, not 1.3 and not 3), ③ early-mob HP + starter weapon DMG + TTK (payload XML rows: hp 1, defense 0, weapon 1–2), ④ multi-target rule (full damage each, one hit per enemy per stroke), ⑤ Focus/crit gating (deterministic on a full reload bar, no proc). Beyond the blockers, one whole mechanic absent from the entire ledger was recovered (the ×1.2 stance triangle), two "Ready" bullets are wrong (crit 1.3; "shielder legs"), and two cross-lane blockers close as side effects (screen-shake catalogued, damage popups with exact colours). Not 100 because: (a) the readable source is the ANDROID/AIR payload — the web payload's logic is identifier-mangled (payload_export.log:9 `§1t398s0§`), so web-v0.717 parity is unproven, and one constant (`maxreload = 5*24` with a dead speed-scaled `baseReload`) smells like a mobile simplification; (b) per-slash animation start/active/recovery frames still live in the unopened `<animdata>` bindata sets (art-anim's ground); (c) `jumpThreshhold` and the provenance of the shipped `DASH_SLASH_PX=127` remain unverified — I did not find 127 anywhere in the slash path and will not call it wrong without evidence.

### `combat-core/crit-gate-deterministic` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ⑤ is closed: crit is DETERMINISTIC on a full reload bar (`reload == maxreload`) with no proc chance anywhere in the path; the crit slash zeroes the bar and then still pays its own stance cost.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3215 and :3242-3257; BattleUI.as:262`
- **Quote:** MCSPlayer.as:3215 `if(this.reload == this.maxreload)`  ·  :3242-3244 `if(this.reload == this.maxreload)` / `{` / `this.reload = 0;`  ·  :3249/3253/3257 `this.reload -= this.slashUsage / 2;` (Light) / `this.reload -= this.slashUsage;` (Balanced, Reversed) / `this.reload -= this.slashUsage * 1.5;` (Heavy, Dual)  ·  BattleUI.as:262 `this.crittext.visible = percentage >= 1 && this.reloadbar.visible;`
- **Overturns:** "⑤ Focus/crit gating rule — *watch the Focus bar fill/consume.*"
- **Lane impact:** combat-core blocker ⑤ closed, and skills-meters blocker ⑤ ('crit **proc** rule (chance vs deterministic) — entirely absent') closed with it: it is deterministic. `slashUsage` is a weapon stat with a floor of 48 (StatsManager.as:1921-1929).

### `combat-core/crit-multiplier` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ② is closed and the answer is neither 1.3 nor 3: crit is x1.5 in Light stance and x1.2 in every other stance, with the item stat STAT_CRITICALDMG added as a FLAT term after the multiplier.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3215-3222 (corroborated InventoryUI.as:1946/1955/1964/1970-1971)`
- **Quote:** MCSPlayer.as:3215-3222 `if(this.reload == this.maxreload)` / `{` / `if(this.stance != LIGHT_STANCE)` / `{` / `return maxDamage * 1.2 + this.STAT_CRITICALDMG;` / `}` / `return maxDamage * 1.5 + this.STAT_CRITICALDMG;` / `}`  ·  InventoryUI.as:1970 `minCrit = minDamage * critModifier + criticalDmgDiff;`
- **Overturns:** "damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8)"
- **Lane impact:** combat-core: closes blocker ② and invalidates the shipped `CRIT_MULT=1.3` constant. Also explains the '3x' folklore without compounding — a large flat crit-damage roll is additive, so a small base hit can appear to triple.

### `combat-core/damage-formula-full-chain` — HELD [A2] ⚑ OVERTURNS LEDGER

The full damage chain is (ATK + bonus + weapon.mindamage) + rand*(weapon.maxdamage - weapon.mindamage), x stance, x crit if the bar is full, then victim-side x1.2 stance triangle, minus defence, floored by a four-tier attacker-level minimum, then x1.5 on a head/hat/neck hit — the ledger's '(ATK+Wpn)×stance' has the right shape but omits the random roll, the triangle, the level-tiered floor, the flat crit-damage term and the behead multiplier.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1881 and :1902; MCSPlayer.as:3201, :3701-3717; Damage.as:160-172`
- **Quote:** StatsManager.as:1881 `basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + itemdata.mindamage;` · :1902 `return itemdata.maxdamage - itemdata.mindamage;` · MCSPlayer.as:3709-3716 `damage -= this.getDefense();` / `if(damage < damageObj.getMinDamage())` / `{` / `damage = damageObj.getMinDamage();` / `}` / `if(behead)` / `{` / `damage *= 1.5;` · Damage.as:160-172 `if(this.attackerlvl <= 10) return 1 + this.piercingDamage;` / `if(this.attackerlvl <= 20) return this.attackerlvl / 8 + this.piercingDamage;` / `if(this.attackerlvl <= 30) return this.attackerlvl / 6 + this.piercingDa
- **Overturns:** "damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8)"
- **Lane impact:** combat-core (formula) and items-equipment (its 'defense min-floor (EnemyLevel/4)' Ready bullet is one branch of a four-branch ATTACKER-level table, and its condition question gets a partial answer: a broken weapon is ATK+1 flat with zero range, per StatsManager.as:1877 and :1892-1894). Confirms the ledger's 'Heavy def ×0.8' exactly (MCSPlayer.as:3233-3235).

### `combat-core/damage-popups` — HELD [A2] ⚑ OVERTURNS LEDGER

Floating damage popups are held with exact colours and anchor: physical 0x990000, fire 0xFF6600, wind 0xCCCCCC, water 0x0066FF, earth 0x663300, each spawned at the victim's (x, y-100), with one separate popup per element.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyShield.as:392-408 and MCSPlayer.as:3805-3826`
- **Quote:** `ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),10027008);` / `...fireDamage.toString(),16737792);` / `...windDamage.toString(),13421772);` / `...waterDamage.toString(),26367);` / `...earthDamage.toString(),6697728);`
- **Overturns:** "③ floating damage/crit **popups** (absent from the ledger, confirmed to exist)."
- **Lane impact:** ui-hud blocker ③ ('floating damage/crit **popups** (absent from the ledger, confirmed to exist)') closed. Also gives combat-core the elemental mitigation rule: each element is reduced by its own STAT_?DEF with a floor of 1 whenever the incoming elemental term was > 0.

### `combat-core/early-ttk` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ③ is closed from the payload, not from video: early field mobs have hp 1 and defense 0, the engine's fallback weapon rolls 1-2 damage, and the attacker-level damage floor is 1 for any attacker of level <= 10 — so hits-to-kill on early mobs is exactly 1, unconditionally, even for a mastery-0 Light swing.

- **Cite:** `reference/extracted/npcdata.xml:22-29 + reference/extracted/itemdata.xml:7906-7913 + Damage.as:160-162 (fallback weapon id from EnemyElite.as:97)`
- **Quote:** npcdata.xml:23-29 `<id>1</id>` / `<name>5009</name>` / `<lvl>3</lvl>` / `<hp>1</hp>` / `<ai>1</ai>` / `<attack>3</attack>` / `<defense>0</defense>`  ·  itemdata.xml:7907-7913 `<id>13002</id>` / `<type>9</type>` / `<name>4041</name>` / `<baseprice>0</baseprice>` / `<minlvl>-4</minlvl>` / `<mindamage>1</mindamage>` / `<maxdamage>2</maxdamage>`  ·  Damage.as:160-162 `if(this.attackerlvl <= 10)` / `{` / `return 1 + this.piercingDamage;`
- **Overturns:** "③ early-mob HP + starter weapon DMG + hits-to-kill — *read L1 bandit-fight popups in video A.*"
- **Lane impact:** combat-core blocker ③ closed and its close-path ('read L1 bandit-fight popups in video A') made unnecessary. Independently confirms the SESSION 11 frame measurement that mobs die in ONE hit — from source this time. Also hands enemies-ai its blocker ② (per-enemy HP): the whole 495-row roster carries <hp>, <attack>, <defense>, <lvl>.

### `combat-core/movement-gesture` — HELD [A2] ⚑ OVERTURNS LEDGER

§3 correction #1 is wrong: a non-line tap DOES move the player to the tapped x — walk if |dx| <= 100 px, run beyond that, with a 25 px dead-zone — and there is no hold-mouse-to-run state anywhere in InputManager, so the SESSION11 'hybrid' the correction overrode was right.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2300-2308 and :2337-2344; InputManager.as:268 with :53-55`
- **Quote:** MCSPlayer.as:2300-2308 `dist = lineArray[0].x - getMCS().x;` / `if(dist * dist < 625)` / `{` / `return;` / `}` / ... / `this.initMove(lineArray[0]);`  ·  :2337-2343 `if(dist * dist <= 10000)` / `{` / `this.startAction(WALK_STATE);` / `}` / `else` / `{` / `this.startAction(RUN_STATE);`  ·  InputManager.as:268 `isLine = drawArrayLength > lengthThreshhold && getDistanceSQ(firstPoint,lastPoint) > distThreshhold;` with `lengthThreshhold:int = 4` and `distThreshhold:int = 400`
- **Overturns:** "**Movement is HOLD-mouse-to-run-toward-cursor, not click-to-destination.** In-game Tip #27 is explicit. → **The SESSION11 "hybrid" is half-wrong:** the drawn line is the blade path (correct), but there is *no* "tap/click = move-to-target" gesture."
- **Lane impact:** combat-core input model: reverses the 'replace A/D keyboard movement with hold-mouse' instruction that §3 #1 pushed into SESSION11/MECHANICS_GAP/RESUME_HERE. The real gesture split is: stroke longer than 20 px end-to-end and more than 4 sampled points = slash; anything shorter = a move click.

### `combat-core/multi-target-rule` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ④ is closed: every enemy whose art overlaps any sampled point of the drawn stroke takes the SAME Damage object — full damage each, no falloff and no tip/base gradient — and each enemy can be hit at most once per stroke.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPCManager.as:1225-1232 and :1252-1256, :1286`
- **Quote:** `while(j < slashMax && !enemy.gotHitFlag)` / `{` / `dist = enemy.mcs.x - slashArray[j].x + offset;` / ... / `if(dist * dist < 40000 && enemy.mcs.hitTestPoint(scaledX,scaledY,false))` / `{` / `if(enemy.checkHit(scaledX,scaledY,damage))`  ·  :1252-1254 `if(enemy.gotHitFlag)` / `{` / `comboCount++;`  ·  :1286 `StatsManager.addCombo(comboCount);`
- **Overturns:** "④ multi-target per-hit rule (full vs falloff)."
- **Lane impact:** combat-core blocker ④ answered as FULL damage, not falloff. Also fixes the geometry: the `dist*dist < 40000` pre-filter is a ±200 px x-window between the STROKE POINT and the enemy, not between the enemy and the player — reinforcing that player position plays no part in hit resolution.

### `combat-core/reach-cap` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ① is closed: the per-stance reach cap is `slashLength` in 800x480 stage pixels, derived as base = 120 + floor((90 + DAN*5) * SPEED / (20 + SPEED)) then Light x1.5 flat, Balanced x(1 + 0.005*balancedMastery), Heavy x(0.5 + 0.005*heavyMastery) with a hard floor of 100, Reversed x1.5, Dual x1.0 floor 100.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1915-1918 + MCSPlayer.as:3030 / 3041 / 3052-3055 / 3067 / 3078-3082 / 3094`
- **Quote:** StatsManager.as:1917-1918 `var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;` / `return int(120 + Math.floor(maxincrement * speed / (20 + speed)));`  ·  MCSPlayer.as:3030 `this.slashLength = this.baseSlashLength * 1.5;`  ·  :3041 `this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01);`  ·  :3052-3055 `this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);` / `if(this.slashLength < 100)` / `this.slashLength = 100;`  ·  :3094 `InputManager.setMaxDistance(this.slashLength);`
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** combat-core ledger block: kills blocker ① outright and removes its close-path (frame-measuring blade-FX span, or slashing a dummy in a build that does not exist). Also retires the 'wiki gives units of unknown scale' complaint — the wiki's 300/200/100 is this exact table evaluated at base=200.

### `combat-core/reach-is-stroke-budget` — HELD [A2] ⚑ OVERTURNS LEDGER

Reach is a stroke-ARC-LENGTH budget spent while you drag, not a radius gate around the player — the player's position is never consulted when the cap is applied, so the ledger's prescribed fix (pass player pos into resolveSlash and gate hits by distance) would implement the wrong mechanic.

- **Cite:** `reference/decompiled/shs3_android/scripts/InputManager.as:198 and :363-367 (and :360 for the taper)`
- **Quote:** InputManager.as:198 `distanceLeft = maxDistance;`  ·  :363-367 `if(distanceTravelled > distanceLeft)` / `{` / `distanceTravelled = distanceLeft;` / `}` / `distanceLeft -= distanceTravelled;`  ·  :360 `canvas.graphics.lineStyle(thickness - thickness * ((maxDistance - distanceLeft) / maxDistance),10027008,...)`
- **Overturns:** "**Surface:** `DASH_SLASH_PX=127`, `SLASH_FRAMES`, `STANCE_TABLE` reach — already measured; **wire reach into `resolveSlash`** (today it gets no player pos and no reach gate)."
- **Lane impact:** combat-core Surface bullet: the queued code task is mis-specified. Reach belongs in the input/stroke layer (cap the drawn polyline's cumulative length, taper its thickness as the budget drains), not in the hit resolver. Also fixes the drawn-line spec: colour 0x990000 dark red, base thickness 8.

### `combat-core/shake-and-no-hitstop` — HELD [A2] ⚑ OVERTURNS LEDGER

Screen-shake exists with a full algorithm (uniform +/-amt/2 jitter on gameStage x and y, auto-decaying over the final amt frames, default amt 30) but is NOT fired by ordinary landed slashes; there is no per-hit global time freeze — per-hit feel is 12 frames of invulnerability plus a red vignette, and the only freeze is a last-wave-clear 'red freeze' of 24*6 ticks.

- **Cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:1200-1227, :1101; NPCManager.as:1630-1648; MCSPlayer.as:911, :946, :3719; BattleUI.as:424-428`
- **Quote:** StageManager.as:1225-1227 `shakeAmount = Math.min(screenShakeAmt,screenShakeCounter);` / `gameStage.x = screenShakeStartPos.x + (-shakeAmount / 2 + Math.random() * shakeAmount);` / `gameStage.y = screenShakeStartPos.y + (-shakeAmount / 2 + Math.random() * shakeAmount);`  ·  callers: MCSPlayer.as:911 `StageManager.startShake(12);` (Deadly Cleave), :946 `StageManager.startShake(24);` (Earthquake), HeavenlySwordProjectile.as:76 `StageManager.startShake(12);`, Trap_CrusherBlockAuto.as:88 `StageManager.startShake(6);`  ·  StageManager.as:1101 `redFreezeCounter = 24 * 6;`  ·  BattleUI.as:426-427 `th
- **Overturns:** "③ FX **blend modes**; ④ **screen-shake** + **hitstop-on-landed-hit** (never catalogued); ⑤ severed-limb death variant."
- **Lane impact:** art-anim-audio-feel blocker ④ ('**screen-shake** + **hitstop-on-landed-hit** (never catalogued)') closes in both directions: shake is fully catalogued here, and hitstop-on-landed-hit does not exist — a recreation that adds it is inventing feel. The kill-beat is a distinct last-enemy-of-last-wave freeze (NPCManager.as:1635-1646).

### `combat-core/stance-damage-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The per-stance damage multipliers are Light base x(0.5 + 0.005*lightMastery), Balanced base x(1 + 0.005*balancedMastery), and Heavy/Dual/Reversed a flat x1.5 — so the ceilings are 1.0/1.5/1.5, not the ledger's 0.9/1.2/1.4, and Heavy is fixed at 1.5 not 1.4.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3201-3213`
- **Quote:** `var baseDamage:int = this.minDamage + Math.random() * this.damageRange;` / `case LIGHT_STANCE: maxDamage = baseDamage * (0.5 + 0.5 * this.lightMastery * 0.01);` / `case BALANCED_STANCE: maxDamage = baseDamage * (1 + 0.5 * this.balancedMastery * 0.01);` / `case HEAVY_STANCE: case DUAL_STANCE: case REVERSED_STANCE: maxDamage = baseDamage * 1.5;`
- **Overturns:** "**The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are MASTERY-9 CEILING values, not base.** A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4 (Heavy is fixed); Heavy's *reach* also scales ×0.5→×0.9."
- **Lane impact:** combat-core + progression: the mastery term is mastery*0.005 on a 0-100 scale, not a 9-step ladder, which kills the 'decide-and-flag: the build targets mastery-9' framing. Also note damage and reach scale on DIFFERENT stances — damage scales Light+Balanced and fixes Heavy; reach fixes Light and scales Balanced+Heavy.

### `combat-core/stance-triangle` — HELD [A2] ⚑ OVERTURNS LEDGER

A stance rock-paper-scissors worth +20% damage exists and appears nowhere in the ledger: Balanced beats Light, Heavy beats Balanced, Light beats Heavy, applied on the victim's side before defence subtraction.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3701-3706`
- **Quote:** `if(this.stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE || this.stance == BALANCED_STANCE && enemyStance == HEAVY_STANCE || this.stance == HEAVY_STANCE && enemyStance == LIGHT_STANCE)` / `{` / `damage *= 1.2;` / ... / `damagetextcol = 16777215;`
- **Overturns:** "- **Ready:** gesture→attack map; damage formula ((ATK+Wpn)×stance, crit 1.3×, Heavy def ×0.8); blade-path-with-reach model; combo rules; part-based weak points (shielder legs, undead heads)."
- **Lane impact:** combat-core: a pure under-claim — nothing in §2, §3 or §4 mentions any stance-vs-stance interaction. It makes stance a live read in PvP rather than a stat preset, and it gives the white-coloured damage popup its meaning (an NPC landing a triangle-advantaged hit on you).

### `combat-core/weak-points-corrected` — HELD [A2] ⚑ OVERTURNS LEDGER

Part-based hit rules are exact but the ledger's 'shielder legs' does not exist: for the shielder a head/hat/neck hit is x1.5 and a hit on the shield prop absorbs the strike entirely (0 damage, metal SFX, 24 frames of invulnerability); for the undead a NON-head hit is halved; on any enemy a hit landing on the weapon part is a clean whiff.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyShield.as:325-340 and :351-353; EnemyZombie.as:496-505 and :516-518; NPC.as:301-320`
- **Quote:** EnemyShield.as:335-340 `case mcs.partList[MCSCharacter.PART_prop]:` / `gotHitFlag = true;` / `damage = 0;` / `gotHitCounter = 24;` / `SoundManager.instance.playHitMetal();` / `return false;`  ·  :351-353 `if(behead)` / `{` / `damage *= 1.5;`  ·  EnemyZombie.as:516-518 `if(!behead)` / `{` / `damage /= 2;`  ·  EnemyShield.as:331-334 / EnemyZombie.as:502-505 `case mcs.partList[MCSCharacter.PART_weapon]:` / `gotHitFlag = false;` / `damage = 0;` / `return false;`
- **Overturns:** "part-based weak points (shielder legs, undead heads)"
- **Lane impact:** combat-core Ready bullet corrected. 'Undead heads' is right but inverted in kind — the head is not a bonus, everything else is 50%-resisted. 'Shielder legs' is fabricated; the shielder's real rules are head x1.5 and shield-absorbs-all. Resolution order matters: NPC.as:301-320 walks partList BACK-TO-FRONT and takes the first part containing the point.

### `combat-core/combo-rule` — HELD [A1]

Combo counts DISTINCT ENEMIES HIT BY ONE STROKE, accumulates across strokes to a cap of 999, and resets the moment the player takes damage.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_429.0.png (full frame downscaled to 960x540; HUD top-right) paired with StatsManager.as:4298-4305, NPCManager.as:1286, MCSPlayer.as:3732`
- **Quote:** Visibly in the frame: a large red `3` above a black plate reading `HIT COMBO` at top-right. Code: StatsManager.as:4300-4305 `combo += num;` / `if(combo > 999)` / `{` / `combo = 999;` / `}` / `BattleUI.instance.showCombo(combo);`  ·  MCSPlayer.as:3732 `StatsManager.resetCombo();` (fires inside the player's gotHit)
- **Lane impact:** combat-core Ready bullet 'combo rules' quantified: it is a breadth counter (enemies per swing) plus a no-damage streak, cap 999 — not a hit-chain timer. Recreations that tick combo per landed hit on the same enemy will read wrong.

### `combat-core/gesture-attack-map` — HELD [A2]

The gesture-to-attack map is held with exact thresholds: eight slash types selected from the stroke's start-vs-end geometry (HOR_SLASH default, HOR_SLASHUP at dy>25, HOR_SLASHDOWN at dy<-25, UP_SLASH launcher, DOWNSTAB at |dx|<50 with canStab, plus JUMP/DROP/AIR variants), with the launcher gated on the stance's unlock.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:2420-2456, :2459-2466, :2781-2784, :3131-3187`
- **Quote:** MCSPlayer.as:2437-2454 `else if(this.canStab && this.destY < lastPt.y && Math.abs(this.destX - lastPt.x) < 50)` / `{` / `this.slashType = DOWNSTAB_SLASH;` / ... / `if(diff > 25)` / `{` / `this.slashType = HOR_SLASHUP;` / `}` / `else if(diff < -25)` / `{` / `this.slashType = HOR_SLASHDOWN;`  ·  :2781-2783 `if(this.slashType == UP_SLASH && this.canLaunch)` / `{` / `launchType = Damage.LAUNCH_AIR;`  ·  :2461/2465 `this.destX -= 55;` / `this.destX += 55;`
- **Lane impact:** combat-core Ready bullet confirmed and quantified. Unlocks are dual-path: mastery >= 3/4/5 per stance (:3164-3187) or explicit skill IDs 1014-1019 / 1036-1038 in the skill-tree path (:3131-3154) — which also hands skills-meters a concrete node-ID map for launch/deflect/stab/flip-up/air-combo.

### `combat-core/mobile-vs-web-parity` — STILL_UNHELD [STILL_UNHELD]

Whether these constants match the web v0.717 build is not established: the only unobfuscated combat source is the Android/AIR payload, and the web payload's logic is identifier-mangled, so there is no second source to diff against.

- **Lane impact:** Governs how every number above should be labelled in config: CONTRACT-from-source with a 'mobile-build' qualifier, not 'v0.717 measured'. The specific value most at risk is `maxreload = 5 * 24` with a dead speed-scaled `baseReload` (MCSPlayer.as:190 assigns it, nothing ever reads it) — that reads like a port simplification, but I cannot prove it. Same caution for `jumpThreshhold` (used at MCSPlayer.as:2433/2441/2789, value not read by me) and for the shipped `DASH_SLASH_PX=127`, whose 127 I could not find anywhere in the slash path and therefore will not call wrong.

### `combat-core/reload-meter-numbers` — HELD [A1]

The third combat-HUD bar is `reloadbar` — the crit meter — and it fills at exactly +1 per tick with `maxreload` hard-coded to 5*24 = 120 ticks; the speed-scaled `getBaseReload() = 48 + SPEED*6` is computed, passed in and stored, then never read, so SPEED does not affect crit-bar fill in this build.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_429.0.png, crop 560x180+0+900 of the 1920x1080 frame upscaled x3 nearest-neighbour (paired with MCSPlayer.as:239, :1158-1168, :190 and BattleUI.as:24/16/60/48)`
- **Quote:** Visibly in the crop: a red-ringed portrait, then THREE stacked bars — green `20/20`, blue `26/26`, and a third tan/olive bar with `CANNOT CHANGE STANCE` printed over it, plus `150% DAMAGE` beneath; top-left `AUTO SLASH OFF`, top-right a red `3` over `HIT COMBO`. Code side: MCSPlayer.as:239 `this.maxreload = 5 * 24;` · :1158-1160 `if(this.reload < this.maxreload)` / `{` / `++this.reload;` · :1168 `StageManager.getBattleUI().updateReload(this.tempreload / (this.maxreload - 24));`
- **Lane impact:** combat-core + ui-hud: identifies the bar the project has been calling 'Focus'. One resource does three jobs — crit gate, per-slash budget, and stance-change currency (MCSPlayer.as:2977 refuses a switch below maxreload/6; :3100/:3104 charge maxreload/3 or maxreload/6). Bar fills empty-to-full in 96 ticks = 4.0 s at the 24 fps of Mobile.as:117. Note the mobile-build caveat: the dead `baseReload` may be a port simplification.

### `combat-core/string-table-located` — PARTIAL [A2]

The string-table blocker is LOCATED but its bytes are not on disk: on the web build the table is a server-side file `data/shs3_en.xml`, which is why bindata/ was exhausted without finding it; on the mobile build it is embedded as binary asset `_assets/118_Mobile_Lang_EN.bin` inside reference/preservation/shs3_android_payload.swf, which we hold but from which only scripts were ever exported.

- **Cite:** `reference/decompiled/shs3_android/scripts/LangManager.as:37 and :55-56; Mobile_Lang_EN.as:5; reference/decompiled/android_export.log (Exported script 511/970 Mobile_Lang_EN)`
- **Quote:** LangManager.as:37 `var server:String = "./data/";`  ·  :55-56 `Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");` / `Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");`  ·  Mobile_Lang_EN.as:5 `[Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]`
- **Lane impact:** L1b (string table): the journal's S0-1 shrank the search space to payload.xml + the decompiled AS3 — this is the hit in that space. It explains the negative result (the web build never carried the table; it was fetched from the dead server) and names a concrete close-path: run JPEXS `-export binaryData` on reference/preservation/shs3_android_payload.swf. I did NOT do this — ffdec is not installed here and a naive zlib decompress of that SWF fails (header `435753 72 7899226910...`). No <name>/<desc>/<displayname> is held today.

## economy — re-scored 78

48 -> 78. Of the four §4 economy blockers: (1) dies twice over (coins-per-kill generator AND the XP formula are both literal payload code), (3) Repair-Weapon cost dies outright, (4) token economy dies, (2) splits — sell-price formula dies, prosperity daily-sim survives but narrowed to "client renders, server computes". Three of six Ready-bullet "prices" turn out to be FORMULAS not constants; one Ready bullet is wrong in expectation (betting is EV-neutral, not a faucet); one is undercounted (five vendor generators, not two); one is uncited (IAP tiers, STILL_UNHELD). Two whole subsystems the ledger never mentions are fully held: the node×date-seeded trade-goods arbitrage loop, and the coin-purse cap ladder (1000..10000) that gives the whole economy its shape. Held back from 90+ by provenance: every AS3 cite is from the ANDROID bundle at clientVersion 0.682 (StatsManager.as:30) while the proven web target is v0.717; the web SWF is SWFDefender-protected and yields zero logic classes, so there is no same-version cross-check. None of these numbers has been checked against a longplay frame, and the string table that would NAME any priced item is still unlocated — prices are portable, names are not.

### `economy/cho-han-is-ev-neutral` — HELD [A2] ⚑ OVERTURNS LEDGER

The gambling faucet is held and is EV-neutral: Cho-Han escrows the stake and pays bet×2 on a correct even/odd call over two uniform dice, i.e. a fair coin flip — so betting is a variance device, not a gold faucet.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1790-1844`
- **Quote:** var dice1:int = Math.random() * 6;
var dice2:int = Math.random() * 6;
...
var isEven:Boolean = (dice1 + dice2) % 2 == 0;
...
if(isEven && choice == 0 || !isEven && choice == 1)
{
   StatsManager.changeGold(this.bet * 2);
- **Overturns:** "gold has legit non-cash faucets (rebirth/tournament/betting)"
- **Lane impact:** Corrects a Ready bullet that is wrong in expectation. Two independent floor(U[0,1)x6) dice give exactly 50/50 parity and the payout is 2x, so Cho-Han has zero expected value — it cannot be counted as one of the 'legit non-cash faucets' that make an offline gold economy work.

### `economy/coin-purse-cap-ladder` — HELD [A2] ⚑ OVERTURNS LEDGER

The coin-purse cap ladder (1000/2000/4000/6000/8000/10000 by upgrade tier) is held, and it is the sink that gives the whole economy its shape — yet it appears in no ledger bullet.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2632-2656; bank overflow at InteractUI.as:1748-1764, STAT_COINSINBANK at StatsManager.as:234`
- **Quote:** internal static function getMaxCoins() : int
{
   switch(getStat(1011))
   {
      case 0:
         return 1000;
      case 1:
         return 2000;
      case 2:
         return 4000;
      case 3:
         return 6000;
      case 4:
         return 8000;
      case 5:
         return 10000;
      default:
         return 1000;
   }
}
- **Overturns:** "### economy — 48
- **Ready:** currencies + guest start; all service prices; Forge/Reinforce/Rebirth/Writ costs; War-Room structure costs; crop 5–20c; IAP tiers; two-vendor tiers; gold has legit non-cash faucets (rebirth/tournament/betting)."
- **Lane impact:** New subsystem absent from all three economy bullets. A 1000-coin default cap against a 5000c Reinforce and an 8000c max-level Forge IS the mid-game pacing curve. isCoinPurseFull() also gates gold->coin conversion (ShopUI.as:430, InteractUI.as:919). The bank is the escape hatch and pays ZERO interest — pure overflow storage.

### `economy/coins-per-kill` — HELD [A2] ⚑ OVERTURNS LEDGER

Coins-per-kill is held and is a random roll gated by level, not a flat 8: duelist kills pay floor(U[0,1)×enemyLevel) and above level 10 the coin drop only fires 1 kill in 3; field mobs pay 1 or 5 per loot unit instead.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyPlayer.as:1293-1300 (field-mob path NPC.as:837-844; 1.5x buff LootDialog.as:650-657)`
- **Quote:** if(this.isDuelist)
{
   OverworldHUD.instance.lootDialog.addRandomLootItem(level);
   if(level <= 10 || int(Math.random() * 3) == 0)
   {
      OverworldHUD.instance.lootDialog.addLootCoins(Math.random() * level);
   }
}
- **Overturns:** "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."
- **Lane impact:** Kills the coins half of economy blocker ①. Directly refutes the MODEL behind src/config/economy.ts:37 `export const KILL_REWARD = { coinsFlat: 8 };`. FRAME-VS-DOC: the filmed '+8 COINS' HUD read is NOT contradicted — at a level-9 duelist floor(U[0,1)×9) tops out at exactly 8, so the frame and the payload agree; what is refuted is the flat-constant model inferred from that single sample. The frame sampled the generator once; the payload holds the generator.

### `economy/crop-price-oscillator` — HELD [A2] ⚑ OVERTURNS LEDGER

The crop price rule is held and is a supply-driven three-point oscillator (base 10, least-supplied clan pays 20, most-supplied pays 5, flat 10 if all level), not the static '5–20c' range the ledger banks.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:105 and :497-502 (payout at sellCrop, InteractUI.as:1544-1548)`
- **Quote:** this.cropPrices = [10,10,10,10];
if(maxCrops != leastCrops)
{
   this.cropPrices[leastCropsSide] = 20;
   this.cropPrices[maxCropsSide] = 5;
}
- **Overturns:** "crop 5–20c"
- **Lane impact:** Sharpens a Ready bullet from an envelope into a rule. Ties farming income to the global four-clan crop tally (QueryManagerPIO.getAllCrops, InteractUI.as:220), which an offline build must simulate rather than hard-code.

### `economy/duel-token-economy` — HELD [A2] ⚑ OVERTURNS LEDGER

The token economy numbers are held: cap 30 (character-creation max 20), one token per 120 s, AP one per 60 s, regen doubled under a buff.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:158, :160, :166, :709-710, :1135, :2373-2377; rendered at ShopUI.as:664`
- **Quote:** internal static var APINTERVAL:int = 60;

internal static var DTINTERVAL:int = 2 * 60;

internal static var WARMOVEINTERVAL:int = 60 * 60;

internal static var MAXQUESTS:int = 7;

internal static var MAXDUELTOKENS:int = 30;
- **Overturns:** "④ token/tournament economy numbers."
- **Lane impact:** Kills economy blocker ④ and simultaneously closes world-exploration blocker ④ ('AP regen rate + cap' — 30 max, one per 60 s). Also corroborates the quests-story Surface bullet QUEST_LOG_CAP = 7 via MAXQUESTS:int = 7. Note the payload's own internal discrepancy: creation sets max 20 but changeDT clamps to the class constant 30.

### `economy/five-vendor-generators` — HELD [A2] ⚑ OVERTURNS LEDGER

There are five distinct vendor stock generators with verbatim item-ID lists, not the 'two-vendor tiers' the Ready bullet claims — and the merchant's list ships EMPTY, meaning merchant stock was server-pushed and is dead.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLShopData.as:41 (peddler), :63 (inn), :84 (merchant, empty), :98 (premium, hourly rotation), :137 (barber)`
- **Quote:** var defaultItems:Array = [13100,2119,2120,2501,2204,2202,2210];
var extraItems:Array = [2115,2116,2117,2118,2140,2141,3000,3001,4037,4018,4019,11004,11012,11013,11016,11033,11018,11019,12001,12003,12004,12005,12010,13022];
- **Overturns:** "two-vendor tiers"
- **Lane impact:** Corrects and expands a Ready bullet: peddler (7 fixed + 10 of 24 rolled), inn (7 fixed + 3 of 6), barber (49 cosmetics culled to 16), premium (three QuestEngine lists on an hourly serverDate*floor(serverTime/3600) rotation), merchant (initMerchantItems has `var defaultItems:Array = [];` — a genuine hole an offline build must author).

### `economy/gold-coin-exchange-rate` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The premium-to-coin exchange rate is held at 1 heavenly gold = 1000 coins, so the CONSUMPTION half of the premium economy is fully recoverable even though the real-money storefront is dead.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:918-926; 304 <heavenlyprice> rows per docs/gauntlet/L0/index/itemdata.json (itemdata/item/heavenlyprice, count 304, range 0-100)`
- **Quote:** case "convertgold":
   if(!StatsManager.isCoinPurseFull())
   {
      StatsManager.spendHeavenlyGold(1,function():*
      {
         StatsManager.changeGold(1000);
- **Overturns:** "**The dead IAP economy** — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this."
- **Lane impact:** Halves a §6 'structurally UNRECOVERABLE' entry. The IAP SINK (what gold buys: 304 priced items plus a 1:1000 coin conversion) is held verbatim; only the IAP SOURCE (real money -> gold tiers) is gone. An offline gold faucet no longer has to invent its own denomination — it can pay in the original units at the original rate.

### `economy/iap-price-tiers` — STILL_UNHELD [STILL_UNHELD] ⚑ OVERTURNS LEDGER

Real-money IAP price tiers cannot be grounded in any admissible artifact — the embedded premium data blob was never extracted and no price strings exist in the dialog or PayVault classes.

- **Overturns:** "IAP tiers"
- **Lane impact:** The Ready bullet 'IAP tiers' has no cite. The only handle is Mobile_PremiumData.as:5 [Embed(source="/_assets/121_Mobile_PremiumData.bin", ...)], and that .bin is NOT among the 27 files in reference/extracted/bindata/ (92-98, 100-119) — `find reference -name "*121*"` returns only unrelated SVG/sprite hits. GetGoldPromptDialog.as has no price strings; PayVaultBuy*.as are Player.IO wire stubs with no tier table. Presumably wiki/store-page sourced, which is not one of the five admissible classes. Blocks nothing (HAS_CASH_PURCHASE=false at src/config/economy.ts:66) but the bullet should be demoted or cited.

### `economy/item-price-table` — HELD [A2] ⚑ OVERTURNS LEDGER

982 items carry verbatim prices in two currencies on disk: 550 <baseprice> rows (0-5000) and 304 <heavenlyprice> rows (0-100), consumed by XMLItem as gvalue/hvalue.

- **Cite:** `reference/extracted/itemdata.xml:28-34 (counts from docs/gauntlet/L0/index/itemdata.json; consumers XMLItem.as:86 and :96)`
- **Quote:** <id>2100</id>
<type>10</type>
<name>4000</name>
<baseprice>0</baseprice>
<heavenlyprice>1</heavenlyprice>
<weight>0</weight>
<desc>4172</desc>
- **Overturns:** "| **economy** | 48 | prices, services, currencies, war-room costs | sell-price + prosperity formulas; coins-per-kill reality; server-sim economy |"
- **Lane impact:** The entire shop price list is portable today. Carries the GAUNTLET §2.1 blocker forward unchanged: <name> and <desc> are numeric string-table IDs and the table is still unlocated, so PRICES are portable and item NAMES are not. Never claim a priced item's name is held.

### `economy/repair-weapon-cost` — HELD [A2] ⚑ OVERTURNS LEDGER

Repair-Weapon cost is held: node level × 10 coins, and repair resets weapon uses to 1 rather than restoring to new.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1057-1076`
- **Quote:** case "repairweapon":
   cost = StageManager.getCurrentNodeLevel() * 10;
- **Overturns:** "③ Repair-Weapon cost (never captured)."
- **Lane impact:** Kills economy blocker ③ outright and deletes the §5 Tier-2 task line 'Items/economy session: ... read Repair cost' — no playable build is required for it.

### `economy/sell-price-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The sell-price formula is held verbatim in the payload and is independent of <baseprice> entirely — it is a function of item-id band, weight and affix count only.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593 (consumed at ShopUI.as:401, paid at ShopUI.as:540)`
- **Quote:** public function getSellAmt() : int
{
   if(this.itemID < 3000)
   {
      return 1;
   }
   if(this.getWeight() >= 10)
   {
      return (1 + this.getModifierCount()) * 10;
   }
   return (1 + this.getModifierCount()) * 5;
}
- **Overturns:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** Closes the sell-price half of economy blocker ②; also closes items-equipment blocker ③ ('sell-price formula'). Warns the porter that ShopUI.as:58 'internal var sellPercentage:Number = 0.5;' is dead code with zero reads in the bundle — any 'sell = 50% of buy' model is false.

### `economy/service-prices-are-formulas` — HELD [A2] ⚑ OVERTURNS LEDGER

The full service-price table is held, and four of six rows are FORMULAS keyed to node level, not constants — Forge is level×100 capped at level 80 (max 8000c), so '700c' is one sample of the law, not the law.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1003-1008 (forge), :229 (inn), :241 (stables), :1406 (town toll), :1083 (reinforce 5000 flat), :1058 (repair)`
- **Quote:** case "forgeweapon":
   level = StageManager.getCurrentNodeLevel();
   if(level > 80)
   {
      level = 80;
   }
   cost = level * 100;
- **Overturns:** "Forge 700c (the −70 HUD read is a capture artifact)"
- **Lane impact:** Converts the Ready bullet 'all service prices' from a list of sampled constants into the actual pricing laws. Inn rest and stables travel are both nodeLevel×2; town toll is nodeLevel×1; reinforce is a flat 5000 plus reagent stats 20060-20065 consumed in three level bands (InteractUI.as:1102-1047).

### `economy/trade-goods-arbitrage` — HELD [A2] ⚑ OVERTURNS LEDGER

An entire five-commodity trade-goods arbitrage economy exists with deterministic node×serverDate×index seeded prices, and appears in none of the four §4 economy bullets.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1558-1585 (buyGoods at :1617+, writing stats 20054-20058)`
- **Quote:** internal function getGoodsPrice(index:int) : int
{
   var price:int = 0;
   var variation:int = 0;
   var rng:RNG = new RNG(StageManager.getCurrentNode() * QueryManager.instance.getServerDate() * index);
   ... case 0: price = 10; variation = 20; ... case 2: price = 100; variation = 15; ... case 4: price = 200; variation = 30;
   return price * (100 - variation / 2 + rng.rand(variation)) / 100;
}
- **Overturns:** "### economy — 48
- **Ready:** currencies + guest start; all service prices; Forge/Reinforce/Rebirth/Writ costs; War-Room structure costs; crop 5–20c; IAP tiers; two-vendor tiers; gold has legit non-cash faucets (rebirth/tournament/betting)."
- **Lane impact:** New subsystem, entirely absent from the ledger's Ready/Blockers/Surface bullets. Because the seed is node × serverDate × index it is fully reproducible offline with the project's injected mulberry32 RNG — no dead server needed. Needs a new config module alongside the world/farming ones world-exploration already wants.

### `economy/xp-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The XP formula the same blocker calls missing is held in full, including both helper curves (grey-level cutoff and zero-difference ladder), the >3-level cutoff, the ±5%/level scaling and the elite ×2.

- **Cite:** `reference/decompiled/shs3_android/scripts/NPC.as:166-190, with getGreyLevel() at NPC.as:95-110 and getZeroDifference() at NPC.as:112-163`
- **Quote:** public static function calcXP(playerLevel:int, mobLevel:int, xp:int, elite:Boolean) : *
{
   if(mobLevel <= getGreyLevel())
   {
      return 0;
   }
   if(mobLevel - playerLevel > 3)
   {
      return 0;
   }
   var finalXP:int = xp;
   if(playerLevel < mobLevel)
   {
      finalXP = xp * (1 + 0.05 * (mobLevel - playerLevel));
   }
   else if(playerLevel > mobLevel)
   {
      finalXP = xp * (1 - (playerLevel - mobLevel) / getZeroDifference());
   }
   if(elite)
   {
      finalXP *= 2;
   }
   return finalXP;
}
- **Overturns:** "20+ samples show no XP formula either"
- **Lane impact:** Kills the XP half of economy blocker ①, and closes progression blocker ④ ('full XP-income model'). Base duelist xp is `lvl * 5 + 45` (NetworkManager.as:1268), corroborating the repo's already-landed XP_PER_LEVEL/XP_REWARD_BASE. Sub-L10 duel XP is ×3 (EnemyPlayer.as:1318), L10+ takes the elite ×2 path (:1322).

### `economy/prosperity-daily-sim` — PARTIAL [A2]

Prosperity daily-sim: the event taxonomy and the four town state variables are held, but every magnitude except the hard-coded ninja-hire −1000 arrives from the dead server — the client renders, it does not compute.

- **Cite:** `reference/decompiled/shs3_android/scripts/HistoryItem.as:137-311 (dataToString); server source at NetworkManager.as:2042 updateTownProsperity`
- **Quote:** return "merchants robbed by bandits: prosperity -" + val1;
...
return "mercenaries upkeep cost: prosperity -" + val1;
...
return "town hired ninja: prosperity -1000";
...
return "trade with other towns: prosperity +" + val1;
...
return "town status (prosperity: " + val4 + ", crops: " + val1 + ", goods: " + val2 + ", defense: " + val3 + ")";
- **Overturns:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** Blocker ② survives for prosperity but narrows sharply: the event SET (rob / attack / crops-eaten / mercenary upkeep / ninja hire / inter-town trade / status), the sign of each delta, the four town state variables and one constant (-1000) are all recoverable. Only tick rate and per-event magnitudes are lost — those become honest labeled INFERRED design choices, not unknowns.

### `economy/provenance-android-0682` — PARTIAL [A2]

Every AS3 economy formula in this survey comes from the ANDROID bundle at clientVersion 0.682, while the proven web target is v0.717 — and the web SWF yields zero logic classes, so no same-version cross-check exists.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:30; reference/decompiled/shs3_stage2/scripts/com/swfdefender/MD5.as; reference/decompiled/shs3_payload/scripts/ (652 files, all asset classes — ColorPicker skins, hair6000.as, foot12000.as)`
- **Quote:** public static var clientVersion:Number = 0.682;
- **Overturns:** "## 6. What is structurally UNRECOVERABLE (make these honest, labeled deviations)"
- **Lane impact:** Caps how far this lane's score can rise. shs3_android and shs3_android_payload are byte-identical for InteractUI.as and Item.as (diff -q, no output), so there is no internal disagreement — but there is also no v0.717 copy to check against, because the web payload is SWFDefender-protected and decompiles to assets only. Numbers may have been rebalanced between .682 and .717. If any longplay frame ever contradicts one of these rows, THE FRAME WINS and the row must be demoted.

### `economy/quests-pay-no-coins` — HELD [A2]

Quest rewards pay XP and loot but never coins — the schema supports a coin branch and zero quests use it — which closes the coin faucet set as enumerable.

- **Cite:** `reference/extracted/questdata.xml:214-216 (counts from docs/gauntlet/L0/index/questdata.json: reward x77, reward/exp x69 range 100-3000, reward/loot x19); schema branch at XMLQuestOutcome.as:53-59; scripted scan of all 386 <outcome> blocks found 0 with <id>11</id>`
- **Quote:** <reward>
  <exp>290</exp>
</reward>
- **Overturns:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** Combined with the kill, chest, crop, trade-goods, sell, war and gold-conversion paths, the coin faucet set is now closed and enumerable — a rebuild can balance the economy without guessing at a hidden quest-coin income stream. Also gives progression 69 verbatim quest XP payouts. Side note for the quests lane, not my unit: questdata.xml:295 reads '<text>Nice to meet you, Hiroshi-sama. Please, your assitance would be appreciated.</text>' — verbatim shipped dialogue, typo included, so §6's 'Verbatim dialogue ... the actual script is gone' is false on its face.

### `economy/starting-wallet` — HELD [A2]

The starting wallet is held verbatim — 100 coins, 0 heavenly gold, 30/30 AP, 20/20 duel tokens — which confirms the repo's '100 coins' but contradicts its '3 gold'.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:705-710 (contradicted note at src/config/profile.ts:10)`
- **Quote:** setPlayerStats(STAT_GOLD,100);
setPlayerStats(STAT_HGOLD,0);
setPlayerStats(STAT_AP,30);
setPlayerStats(STAT_MAXAP,30);
setPlayerStats(STAT_DUELTOKENS,20);
setPlayerStats(STAT_MAXDUELTOKENS,20);
- **Overturns:** "currencies + guest start"
- **Lane impact:** Grounds the Ready bullet 'currencies + guest start' in an A2 row. Raises a live contradiction for the profile lane: src/config/profile.ts:10 records '(100 coins / 3 gold)' but this build starts at STAT_HGOLD = 0.

### `economy/war-room-build-costs` — HELD [A2]

War-Room structure costs are held as payload rows: 500 coins per donation action, with per-structure totals Forward Base 10000, Ladder 5000, Defense 10000, Town 10000, gated on one war move per real hour.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:1330-1387; WARMOVEINTERVAL at StatsManager.as:162`
- **Quote:** public function startBuild(buildtarget:int) : *
{
   var buildcost:int = 500;
   ...
   this.selectedHex.cost = 10000;   // HEX_FORWARDBASE
   this.selectedHex.cost = 5000;    // HEX_LADDER
   this.selectedHex.cost = 10000;   // HEX_DEFENSE
   this.selectedHex.cost = 10000;   // HEX_TOWN
   ...
   StatsManager.changeStat(StatsManager.STAT_GOLD,-buildcost);
- **Overturns:** "War-Room structure coin costs absent from config."
- **Lane impact:** Upgrades the Ready bullet's evidence class from unsourced to A2 and adds the four structure TOTALS, which were never in the ledger. The repo already has buildDonationCap: 500 (src/config/economy.ts:60), so the 500 is corroborated. The Surface bullet stays TRUE — it is a port task, not a knowledge gap.

## enemies-ai — re-scored 78

All five of §4's numbered enemies-ai blockers are held by artifacts already on disk: the level→stat formula is a named function (NPC.setLevel), per-enemy HP is a 403-row table, telegraph/active/recovery frame counts sit in all 19 animdata sets, stagger is a literal 12-frame lockout, spawn geometry is x/y/qty/level-override in 118 questdata waves, arrow ballistics is a closed-form solve, and the "undead damage-reflect" does not exist (it is a headshot-gated x0.5). What remains is transcription, not measurement. Held below ~85 by two real caps: (1) every NPC name is a numeric ID into the dead server-side shs3_en.xml, so the roster is nameless; (2) all AS3 cited comes from the Android bundle because the web v0.717 bundle decompiles to asset stubs only — argued equivalent (zero isMobile branches in the enemy classes, exact <ai> 1..37 vs case 0..37 coverage) but never byte-checked.

### `enemies-ai/aggro-rule-and-no-leash` — HELD [A2] ⚑ OVERTURNS LEDGER

'Independent aggro, no coordination' is confirmed and refined: each NPC independently picks the nearest opponent by 1-D horizontal distance only, gated to on-screen ±10 px, skipping SKILL_UNDYING_STATE, re-evaluated every aiCounterMax = 24 frames (12 for elites and player-shaped enemies) — and there is NO leash anywhere (grep for leash|returnhome|deaggro|forgetTarget|giveUp over all 970 scripts returns zero hits).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:1360-1390 + NPC.as:22 + NPC.as:285-294`
- **Quote:** if(pos > -10 && pos < stageWidth + 10) { dist = Math.abs(xpos - pos); if(!enemy.isDead() && dist < maxdist && enemy.actionState != MCSActor.SKILL_UNDYING_STATE)  ||  internal var aiCounterMax:int = 24;
- **Overturns:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L4 — the targeting function is portable verbatim; 'no leash' is a design fact the rebuild must not invent around.

### `enemies-ai/arrow-arc-physics` — HELD [A2] ⚑ OVERTURNS LEDGER

Arrow ballistics is a closed-form solve, fully held: gravity 3 px/frame², muzzle and aim point at y-60, fixed 30° launch geometry (the 0.866 = cos30 constant), exact velY solve, ±4 px/frame vertical jitter, and a level-gated chance the arrow launches the target (1/2 above lv50, 1/3 above lv20, 1/4 above lv10, never at or below lv10).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyArcher.as:254-301 + Projectile.as:8`
- **Quote:** var velA:Number = Projectile.GRAVITY * Math.abs(targetX - fireX) / 0.866; velA = Math.sqrt(velA); var velXa:Number = velA * 0.866; var t:Number = Math.abs(targetX - fireX) / velXa; var velYa:Number = (targetY - fireY - 0.5 * Projectile.GRAVITY * t * t) / t; ... velYa += Math.random() * 8 - 4;   ||   internal static var GRAVITY:Number = 3;
- **Overturns:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L4 — the archer, the ledger's own 'closed this pass' win, is now closed to the pixel including its miss-jitter.

### `enemies-ai/boss-names-live-in-frames` — PARTIAL [A1] ⚑ OVERTURNS LEDGER

The Surface bullet's close-path is inverted: the payload can never supply the missing boss NAMES (numeric IDs into the dead shs3_en.xml) but the frames already did — 'HONDA SHIZUKA (7)' is legible. Conversely the payload supplies what frames cannot: all 19 boss-flagged NPCs (ai in 14/35/36/37) with exact lvl/hp/atk/def. The frame's level 7 does not contradict the table because <wave><lvl> overrides it at spawn and the boss stats are then back-solved.

- **Cite:** `reference/frames/session24/reach-B-honda-duel/e11_wide_f0140_x780-1500_y560-900_x2.png (name+level) + reference/extracted/npcdata.xml lines 495,538,798,1001,1216,1466,1905,1926,3085,3234,3442,3467,3487,3842,3982,4002,4072,4111,4178 (stats)`
- **Quote:** Frame: 'HONDA SHIZUKA (7)'. Table: 3842 ai=37 id=186 name=5107 lvl=30 hp=600 atk=60 def=30; 4072 ai=35 id=800 name=5118 lvl=23 hp=800 def=40; 3442 ai=37 id=165 name=5090 lvl=10 hp=200 atk=18 def=10.
- **Overturns:** "Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru."
- **Lane impact:** L4 — boss stat rows are portable today; boss names must be harvested from frames (A1) until L1b cracks the string table, and the rebuild must not hard-code boss HP (see the TTK back-solve).

### `enemies-ai/boss-ttk-rubber-band` — HELD [A2] ⚑ OVERTURNS LEDGER

Elite and boss HP/ATK are not read from the table — they are back-solved at spawn from the player's live stats to a target time-to-kill (boss dies in ~10 hits, kills the player in ~18, both shifted by level difference), with the tabled values acting only as a floor.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyElite.as:23-84`
- **Quote:** var lvldiff:int = lvl - playerLVL; var hitsToKillBoss:int = 10 + lvldiff; var hitsToKillPlayer:int = 18 - lvldiff; ... var bossHP:int = playerhit * hitsToKillBoss; if(bossHP > maxhp) { maxhp = bossHP; setHP(maxhp); updateHealthBar(); } var bosshit:int = playerHP / hitsToKillPlayer; var bossATK:int = bosshit + playerDEF; if(bossATK > minDamage) { minDamage = bossATK; }
- **Overturns:** "③ early-mob HP + starter weapon DMG + hits-to-kill — *read L1 bandit-fight popups in video A.*"
- **Lane impact:** L4 + L5 — an entire balancing system the ledger has nowhere; also answers combat-core blocker ③ for the boss half with no video-reading required.

### `enemies-ai/enemy-damage-intake` — HELD [A2] ⚑ OVERTURNS LEDGER

NPC.gotHit yields several numbers the ledger has nowhere: striking the weapon part is a total no-op (damage = 0, hit rejected); head/hat/neck sets behead giving x1.5; physical mitigation is flat subtraction floored at the attack's own minDamage; each element is mitigated separately but floored at 1 rather than 0 whenever the source had any; death-touch is a literal 500; an NPC's <fire> value sets both FIREATK and EARTHDEF (fire<->water, wind<->earth counter-wheel); and floating damage popups exist with exact colours 0x990000 physical / 0xFF7F00 fire / 0xCCCCCC wind / 0x0066FF water.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:386-462 + XMLNpc.as:190-212 + EnemyZombie.as:548-560`
- **Quote:** case mcs.partList[MCSCharacter.PART_weapon]: gotHitFlag = false; damage = 0; return false;   ||   if(behead) { damage *= 1.5; }   ||   if(damageObj.isDeathTouch()) { damage = 500; damageObj.launchType = Damage.LAUNCH_FLY; }   ||   this.STAT_FIREATK = xml.fire; this.STAT_EARTHDEF = xml.fire;   ||   ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),10027008);
- **Overturns:** "③ floating damage/crit **popups** (absent from the ledger, confirmed to exist)."
- **Lane impact:** L4 + L5 + L8 — the enemy-side damage intake is now fully specified, and ui-hud's popup blocker closes with exact colours and a y-100 offset.

### `enemies-ai/engagement-distance` — HELD [A2] ⚑ OVERTURNS LEDGER

Per-class engagement geometry is literal: EnemyKnife closes at 4-6 px/frame and swings inside 50 px on x AND 50 px on y, and if the target is downed it enters a ground-stab dealing double damage.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyKnife.as:140, :181, :110-114`
- **Quote:** walkSpeed = Math.random() * 2 + 4;  ||  if(mcs.x - playerX < 50 && mcs.y - playerY < 50)  ||  target.checkHitObject(mcs.partList[MCSCharacter.PART_weapon],new Damage(damage * 2,level));
- **Overturns:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L4 — gives the first concrete per-class approach speed and strike range; the 2x downed-stab finisher is absent from the ledger entirely.

### `enemies-ai/level-stat-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The enemy level-to-stat formula is not absent — it is NPC.setLevel(), a proportional rescale of damage/defense/maxhp by factor = lvl/level, with a 0.9 handicap band below level 21 and a hard 1/1/1 clamp at level <= 10.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:239-259`
- **Quote:** public function setLevel(lvl:int) : * { var factor:Number = lvl / this.level; if(lvl <= 20) { factor *= 0.9; } this.level = lvl; this.damage *= factor; this.defense *= factor; maxhp *= factor; setHP(maxhp); this.updateHealthBar(); this.xp = lvl * 2 + 20; if(lvl <= 10) { this.damage = 1; this.defense = 1; maxhp = 1; setHP(maxhp); } }
- **Overturns:** "① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred)."
- **Lane impact:** L4 — the AI-behaviour generator can emit the scaling rule directly from A2 instead of authoring a curve; removes the single largest 'must-measure' item from the lane.

### `enemies-ai/nameplate-is-elite-only` — PARTIAL [A1] ⚑ OVERTURNS LEDGER

THE FRAME REFINES THE LEDGER: the '(N)=level' nameplate is real but elite-only. reach-B-honda-duel f0140 shows a white 'HONDA SHIZUKA (7)' plate over a green/dark-red health bar; duel_dense 428.0 shows three trash enemies with NO plate and NO bar, the only overhead text being the player's own name in yellow. The code matches exactly — only EnemyElite/EnemyPlayer/EnemyKanjiGuardian call setDisplayName, in 0xFFFFFF, while the player's is 0xFFC300.

- **Cite:** `reference/frames/session24/reach-B-honda-duel/e11_wide_f0140_x780-1500_y560-900_x2.png (crop x780-1500 y560-900 of 1920x1080, upscaled x2) + reference/frames/duel_dense/Nr4fQstqHDM_428.0.png (crop x520-1120 y580-900, upscaled x2.5)`
- **Quote:** Visible in the f0140 crop: white all-caps 'HONDA SHIZUKA (7)' with a ~45%-filled green-on-dark-red bar directly beneath it, over a pink-clad female samurai in a straw kasa mid-slash with a red blade trail; partial yellow 'SOUN…' to its right. Visible in the 428.0 crop: three enemies (prone bleeding kasa bandit, crouched purple figure, khaki figure spraying blood from the neck) under a blue Light-stance arc — none carries a nameplate or health bar. Mechanism: EnemyElite.as:114 mcs.setDisplayName(xml.name + " (" + level + ")",16777215);
- **Overturns:** "nameplate (N)=level."
- **Lane impact:** L4 + L8 — the rebuild must NOT draw plates or bars on trash mobs; free geometry too: healthBar.y = -120, bar.width = fraction * 60.

### `enemies-ai/per-enemy-hp` — HELD [A2] ⚑ OVERTURNS LEDGER

Per-enemy HP is a 403-row explicit table in npcdata.xml spanning 1 to 1000, with 42 NPCs at hp 1 and the top row (id 144, lvl 80, ai 28) at hp 1000 / attack 200 / defense 200.

- **Cite:** `reference/extracted/npcdata.xml:22-29 (403 <hp> rows total; index docs/gauntlet/L0/index/npcdata.json 'npcdata/npc/hp: count 403, numeric_range [1.0, 1000.0]')`
- **Quote:** <npc>\n\t\t<id>1</id>\n\t\t<name>5009</name>\n\t\t<lvl>3</lvl>\n\t\t<hp>1</hp>\n\t\t<ai>1</ai>\n\t\t<attack>3</attack>\n\t\t<defense>0</defense>
- **Overturns:** "② per-enemy HP."
- **Lane impact:** L4 — 'each <ai> value maps to observed behaviour' is now joinable against a complete stat table; nothing to measure.

### `enemies-ai/projectile-set` — HELD [A2] ⚑ OVERTURNS LEDGER

The Ready bullet under-claims the projectile set by an order of magnitude: it names three types (arrows, oni rocks, bandit hammer) while 38 projectile/arrow classes exist on disk.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/ — ls | grep -cE "Projectile\.as$|^Arrow" → 38`
- **Quote:** Arrow, ArrowBouncing, ArrowDudProjectile, ArrowProjectile, BigEarthquakeProjectile, BigFireBreathProjectile, BigRockProjectile, BigTornadoProjectile, BigWaveProjectile, BoulderProjectile, ChargedShotProjectile, ChiBurstProjectile, ChiKickProjectile, ChiPunchProjectile, CleaveHitProjectile, FireBreathProjectile, FireballProjectile, FlashbangProjectile, GroundPunchProjectile, HeavenlySwordProjectile, KunaiProjectile, LightningPunchProjectile, LogSmokeProjectile, LootProjectile, PartProjectile, PurpleExplosionProjectile, RockProjectile, ShunpoHitProjectile, SlashWaveProjectile, TextProjectile, Tr
- **Overturns:** "projectile set (arrows arc, oni rocks, bandit hammer)"
- **Lane impact:** L4 + L6 — the VFX/projectile surface is far larger than scoped; each class is a named, transcribable behaviour.

### `enemies-ai/pvp-dummy-surface` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's Surface bullet is correct and now A2-backed: hp 150 exists but belongs to level-60 ai=9 (EnemyPlayer) duel NPCs, while field trash is hp 1 — but its closing clause is false, because every PvE number lives in npcdata.xml, not 'only in notes'.

- **Cite:** `reference/extracted/npcdata.xml:9512 (id 651, lvl 60, hp 150, attack 150, defense 168; repeats at 8477, 8571, 9606)`
- **Quote:** id 651, name 5059, lvl 60, hp 150, attack 150, defense 168 — ai 9 = EnemyPlayer(mcs,false,false)
- **Overturns:** "the shipped `AI_TIERS`/`ENEMY_BASE` are a **PvP-duel dummy** (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives only in notes."
- **Lane impact:** L4 — confirms the shipped config is modelling the wrong tier, and supplies the correct rows to replace it.

### `enemies-ai/reach-in-stage-px` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

CROSS-LANE: the reach cap in stage pixels — combat-core's stated single most-needed value — is a function, found via how EnemyElite initialises its AI. baseSlashLength = 120 + floor((90 + DAN*5) * speed / (20 + speed)), i.e. 120 px at speed 0 rising asymptotically to 210 px, then multiplied per stance: Light 1.5x, Balanced 1.0->1.5x by mastery, Heavy 0.5->1.0x by mastery, floored at 100, and fed straight to InputManager.setMaxDistance — the drawn blade line's max length IS the reach. This also puts §3 correction #3 in doubt: 1.5:1.0:0.5 is exactly 3:2:1, so 300/200/100 reads as the mastery-ZERO values at baseSlashLength 200, not mastery-9 ceilings, and mastery raises Balanced/Heavy rather than being their cap.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1905-1919 + EnemyElite.as:100-102 + MCSPlayer.as:3030-3094 + InventoryUI.as:2232`
- **Quote:** internal static function getBaseSlashLengthVal(speed:int) : int { var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5; return int(120 + Math.floor(maxincrement * speed / (20 + speed))); }   ||   this.slashLength = this.baseSlashLength * 1.5;  /  this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01);  /  this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);  if(this.slashLength < 100) { this.slashLength = 100; }   ||   InputManager.setMaxDistance(this.slashLength);
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** L5 — closes combat-core's #1 blocker with a formula instead of a measurement; PARTIAL only because reconciling it against §3's 'mastery-9 ceiling' reading needs the 0-100 mastery scale pinned first. L4 inherits the same function for AI reach.

### `enemies-ai/spawn-geometry` — HELD [A2] ⚑ OVERTURNS LEDGER

Spawn geometry is fully specified: 118 questdata <wave> blocks carry per-enemy id/qty/x-in-stage-pixels/fatal plus a <lvl> override, and NPCManager.nextWave puts wave 0 on the ground while every later wave drops in from y = 0 minus a random 0-200 above screen top.

- **Cite:** `reference/extracted/questdata.xml:77-95 (data) + reference/decompiled/shs3_android_payload/scripts/NPCManager.as:394-412 (rule)`
- **Quote:** <wave><enemy><id>1</id><qty>1</qty><x>750</x></enemy><enemy><id>6</id><qty>1</qty><x>790</x><fatal>0</fatal></enemy><neutral><id>118</id><qty>1</qty><x>2000</x><lvl>1</lvl></neutral></wave>  ||  createEnemy(npcHolder.getNPCID(),npcHolder.getXPos(),posY - Math.random() * 200,npcHolder.getFatal(),npcHolder.getLvl());
- **Overturns:** "④ aggro/leash/spawn geometry."
- **Lane impact:** L4 — wave composition and spawn positions are portable data; the <lvl> override is the hook that triggers the C1/C3 scaling.

### `enemies-ai/stagger-12-frames` — HELD [A2] ⚑ OVERTURNS LEDGER

Stagger is a universal 12-frame hit-lockout on every NPC: gotHit() sets gotHitCounter = 12 after HP is deducted, and re-entry is refused while it is non-zero.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:462 (guard at :388; canHit() at :296-299; repeated at EnemyZombie.as:522)`
- **Quote:** this.gotHitCounter = 12;
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L4 + L5 — a hard i-frame constant the Sim can adopt directly; also caps multi-hit stacking.

### `enemies-ai/taxonomy-is-38-branches` — HELD [A2] ⚑ OVERTURNS LEDGER

The taxonomy is a hard 38-branch dispatch (case 0..37) in NPCManager.createNPC, of which npcdata.xml references 34; the ledger's four-family prose summary omits Fox, Nian Monster, Jiang Si, Vege Patch, Goblin Thrower, Stag, Horse, Training Dummy, Sorcerer Boss, Player Giant, and the entire friendly-ally side (ai 30/31/34) that shares the same AI machinery.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPCManager.as:517-632 + XMLNpc.as:647 + reference/extracted/npcdata.xml <ai> census`
- **Quote:** switch(xml.ai) { case 0: actor = new EnemyPlayer(MCSPool.getMCS(),true,false); break; case 1: actor = new EnemyKnife(MCSPool.getMCS()); break; case 2: actor = new EnemyArcher(MCSPool.getMCS()); ... case 37: actor = new EnemySpearElite(MCSPool.getMCS(),true); break; default: trace("createNPC error: " + xml.ai); }
- **Overturns:** "full taxonomy (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. **the archer** (closed this pass); boss roster; projectile set (arrows arc, oni rocks, bandit hammer); independent-aggro (no coordination — closed); nameplate (N)=level."
- **Lane impact:** L4 — the lane's done-criterion 'each <ai> value maps to observed behaviour' now has an exact, enumerated left-hand side: 38 branches, 34 in use.

### `enemies-ai/telegraph-active-recovery` — HELD [A2] ⚑ OVERTURNS LEDGER

Telegraph/active/recovery is fully tabled: every creature attack in the 19 <animdata> sets is split into a start/hit/end triple with integer frame counts (e.g. ogre_swingdown 16 / swingdownhit 5 / swingdownend 11; guardian 14/7/11; wolf_pounce 9/17/7).

- **Cite:** `reference/extracted/bindata/100_1t4627s0.bin (ogre set); also 111_ (guardian), 112_ (wolf), 115_ (goblin), 114_ (spider), 107_ (zombie/jiangsi), 113_ (spear), 101_ (bear), 117_ (boar)`
- **Quote:** <?xml version="1.0"?><animdata><anim i="idle" d="1"> … ('ogre_swingdown','16') ('ogre_swingdownhit','5') ('ogre_swingdownend','11') ('ogre_swingup','13') ('ogre_swinguphit','5') ('ogre_swingupend','11')
- **Overturns:** "③ telegraph/active/recovery + stagger frames."
- **Lane impact:** L4 + L6 — AI attack timing is transcribable per creature; no frame-counting from video needed.

### `enemies-ai/undead-is-halving-not-reflect` — HELD [A2] ⚑ OVERTURNS LEDGER

There is NO damage-reflect in this game — grep for 'reflect' across all 970 decompiled scripts returns zero hits; what undead actually have is a deterministic headshot-gated 50% damage reduction (damage /= 2 unless the hit set behead), the mirror image of the base class's behead x1.5 bonus. The ledger names a mechanic that does not exist and calls it probabilistic when it is deterministic.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyZombie.as:510-521 (vs NPC.as:449-455)`
- **Quote:** damage -= defense; if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); } if(!behead) { damage /= 2; }
- **Overturns:** "⑤ Undead damage-reflect probability; arrow arc physics."
- **Lane impact:** L4 — removes a phantom 'must-measure probability' and replaces it with a two-line rule; also makes head-targeting the undead counterplay, which L5 must respect.

### `enemies-ai/xp-per-kill` — HELD [A2] ⚑ OVERTURNS LEDGER

CROSS-LANE: XP per kill is fully specified — base lvl*2+20 for trash, lvl*5+45 for elites, +5% per level the mob is above you, linear 1/getZeroDifference() decay per level below, zero if grey or more than 3 levels above you, x2 for elites; both threshold helpers are literal step tables. Loot is likewise tabled: 131 <loot> rows with id/qty(1-5)/chance(0.05-1.0).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:218, :166-190, :94-109, :112-163 + EnemyElite.as:33 + reference/extracted/npcdata.xml:38-44`
- **Quote:** this.xp = this.level * 2 + 20;   ||   xp = lvl * 5 + 45;   ||   if(mobLevel <= getGreyLevel()) { return 0; } if(mobLevel - playerLevel > 3) { return 0; } ... if(playerLevel < mobLevel) { finalXP = xp * (1 + 0.05 * (mobLevel - playerLevel)); } else if(playerLevel > mobLevel) { finalXP = xp * (1 - (playerLevel - mobLevel) / getZeroDifference()); } if(elite) { finalXP *= 2; }   ||   <reward><loot><id>0</id><qty>2</qty><chance>0.5</chance></loot></reward>
- **Overturns:** "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."
- **Lane impact:** L10 — the XP-income model the economy lane calls unsampled is fully held; L4 owns the loot table that feeds it.

### `enemies-ai/movesets-are-tabled` — HELD [A2]

The 'movesets' Ready bullet is confirmed with A2: 647 <skill> rows across 96 <skills> blocks give each NPC its skill ids (1000-1501) and per-skill levels, joined at spawn against skilldata.xml for real cooldowns; ids 1000/1001/1002 are the three stance masteries, not hotbar skills.

- **Cite:** `reference/extracted/npcdata.xml:1040 (647 rows total; index npcdata.json 'npcdata/npc/skills/skill: count 647') + EnemyElite.as:103-105, :150-157`
- **Quote:** <skills><skill><id>1000</id><lvl>10</lvl></skill><skill><id>1001</id><lvl>10</lvl></skill><skill><id>1002</id><lvl>10</lvl></skill><skill><id>1003</id><lvl>1</lvl></skill><skill><id>1004</id><lvl>5</lvl></skill><skill><id>1007</id><lvl>1</lvl></skill><skill><id>1010</id><lvl>1</lvl></skill><skill><id>1012</id><lvl>1</lvl></skill><skill><id>1024</id><lvl>1</lvl></skill></skills>   ||   cooldownArray[skillList[i].getId()] = skilldata.getCooldown(skillList[i].getValue());
- **Lane impact:** L4 + L2 — enemy movesets are data, and they force the L2 skilldata port to land first (the join is by id).

### `enemies-ai/provenance-caveat` — PARTIAL [A2]

HONESTY CAVEAT on every A2 cite above: all AS3 comes from the Android bundle because the web v0.717 bundle decompiles to asset stubs only (no NPC.as, no NPCManager.as). Equivalence is argued but NOT byte-checked — the enemy classes contain zero isMobile branches, npcdata's <ai> domain 1..37 maps exactly onto the switch's case 0..37 with no orphans either way, and NPCManager.as is byte-identical between shs3_android and shs3_android_payload. That is strong; it is not an A3.

- **Cite:** `reference/decompiled/shs3_payload/scripts/ (1,079 .as files, all asset stubs — `ls reference/decompiled/shs3_payload/scripts/NPC.as` → No such file or directory) vs reference/decompiled/shs3_android_payload/scripts/ (970 .as, full game logic)`
- **Quote:** $ grep -c isMobile NPC.as NPCManager.as EnemyArcher.as → 0, 0, 0   ||   $ diff -q shs3_android/scripts/NPCManager.as shs3_android_payload/scripts/NPCManager.as → IDENTICAL   ||   index npcdata.json: npcdata/npc/ai numeric_range [1.0, 37.0], 34 distinct — vs NPCManager.createNPC case 0..37
- **Lane impact:** L4 — the lane needs one byte-check comparing the web v0.717 AI code path to the Android one before treating these formulas as v0.717 CONTRACT rather than INFERRED-from-build-family.

### `enemies-ai/setlevel-is-overridden` — HELD [A2]

NPC.setLevel is overridden by 11 classes, so the 1/1/1 clamp binds only plain trash mobs — elites, player-shaped enemies, bosses, Ogre, WolfAlpha, Stag, KanjiGuardian and all Friendlies scale by their own rule; a rebuild applying the base method universally produces 1-HP bosses.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/EnemyElite.as:23 (+ EnemyOgre.as:51, EnemyTrainingDummy.as:23, EnemyWolfAlpha.as:52, EnemyPlayer.as:57, FriendlyArcher.as:21, EnemyKanjiGuardian.as:48, FriendlyElite.as:23, EnemySpearElite.as:32, EnemyStag.as:48, FriendlySpearElite.as:19)`
- **Quote:** override public function setLevel(lvl:int) : *
- **Lane impact:** L4 — the generator must branch on <ai> before applying any scaling; this is the correctness trap in porting C1.

### `enemies-ai/string-table-LOCATED` — PARTIAL [A2]

The run-wide name blocker is now LOCATED, not merely unsolved: XMLNpc resolves <name> via LangManager.getString, and LangManager.setLanguage fetches './data/shs3_en.xml' from the (dead) server at runtime — the table was never inside the SWF, which is why bindata/ was exhausted for nothing. A live lead exists: the Android build embeds an English fallback as /_assets/118_Mobile_Lang_EN.bin, a different asset set from the web bindata 92-119 we hold.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/LangManager.as (setLanguage) + XMLNpc.as:147-150 + Mobile_Lang_EN.as + Mobile.as:546-552`
- **Quote:** Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");   ||   this.name = LangManager.getString(xml.name);   ||   [Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")] public class Mobile_Lang_EN extends ByteArrayAsset   ||   trace("loadLanguage: cache embedded"); this.writeFile(ByteArray(new Lang_EN()),fileId);
- **Lane impact:** L1b + L2 + L3 + L4 — this is the blocker gating names in four lanes at once. Recommend a dedicated extraction pass on the Android package's _assets; if 118_Mobile_Lang_EN.bin comes out, every <name>/<desc>/<displayname> ID resolves simultaneously.

### `enemies-ai/tengu-unsupported` — STILL_UNHELD [STILL_UNHELD]

The Ready bullet's 'Tengu' family is unsupported: the string 'tengu' appears in ZERO of the 8 decompiled bundles and zero extracted files — no EnemyTengu class, no tengu animation set among the 19, no tengu string. It can be neither confirmed nor refuted while the name table is unreachable.

- **Quote:** $ grep -rli "tengu" reference/decompiled/ reference/extracted/ui_strings.txt  →  (no output)
- **Lane impact:** L4 — the ledger should stop carrying 'Tengu' as an established family; if it exists it is an EnemyElite/EnemyPlayer skin identified only by an unresolvable <name> ID.

## items-equipment — re-scored 84

42/100 was written before the payload was extracted and before anyone opened reference/decompiled/shs3_android/ — a 970-class UNOBFUSCATED decompile in which every one of §4's five items-equipment blockers is answered by readable AS3. Blocker ① (stat-vs-level curve) is five closed-form progressions; ② (condition→DMG multiplier) does not exist as a mechanic at all (damage is binary on isBroken); ③ is exact for valuation; ④ (suffix pool + affix count) is verbatim arrays plus a dice table; ⑤ is half closed (part list, slot routing, symbol-naming rule and 12 default symbols held). Two "Ready" bullets were also wrong: the paperdoll is 13 slots not 9, and weight 100 is a base not a cap. Held back to 84 rather than higher because four things are genuinely still open and one of them is large: (a) item NAMES — the string table is now located and a 2,555-entry English slice extracted, but every item name id (4000+) sits above that slice, so names remain unheld; (b) per-item vector art lives in a CWS-headered but non-zlib resource SWF that resisted two decode attempts; (c) the numeric z-order of the 27-part rig is in the SWF timeline, not in ActionScript; (d) whether the shipped web build applied the declared-but-unreferenced 0.5 sell multiplier is unverified. Score is for the Android build's rule set; the web v0.717 build could differ on (d).

### `items-equipment/affix-count-rule` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ④'s 'per-rarity affix count' is an exact dice table, not an unknown.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:206-252 (and :371-374 for legendaries)`
- **Quote:** if(isRareItem) { dice = this.rng.rand(11); if(dice <= 3) return 2; if(dice <= 6) return 3; if(dice <= 9) return 4; if(dice == 10) return 5; return 0; }  dice = this.rng.rand(100); if(dice <= 84) return 0; if(dice <= 89) return 1; if(dice <= 93) return 2; if(dice <= 96) return 3; if(dice <= 98) return 4; return 5;
- **Overturns:** "④ affix **suffix** pool + per-rarity affix count."
- **Lane impact:** L3 — blocker ④ is now fully closed (pools + counts). Legendary items take one fewer affix when the roll exceeds 2.

### `items-equipment/affix-suffix-pool` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ④'s 'affix suffix pool' is not missing — 17 stats × 8 tiers of prefixes AND suffixes sit verbatim in ItemGenerator.as.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:102-148`
- **Quote:** var attack_suf:Array = ["of Attack","of Biting","of Striking","of Killing","of Slaughter","of Slaying","of Carnage","of the Butcher"];  ...  var windatk_pre:Array = ["Drafty","Gusty","Gale","Stormy","Howling","Roaring","Shocking","Glowing"];  ...  num = Math.floor(i / 10);  this.preSufArray[FIREDEF][i] = new PreSuf(wateratk_pre[num],wateratk_suf[num]);
- **Overturns:** "- **Blockers:** ① item stat-magnitude **vs level** curve. ② condition→DMG **multiplier** (current "evidence" confounds condition with a 2-level gap). ③ sell-price formula. ④ affix **suffix** pool + per-rarity affix count. ⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L3 — the affix name generator becomes a transcription task. 8 name tiers, one per 10 item levels; elemental-DEF affixes deliberately borrow the OPPOSING element's word pool (FIREDEF uses wateratk, WINDDEF uses earthatk, WATERDEF uses windatk, EARTHDEF uses fireatk).

### `items-equipment/art-manifest-rule` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Blocker ⑤'s 'item icon manifest' is not a missing list — it is a naming RULE we hold, plus 12 default part symbols already extracted; only the per-item vector art is still out.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:580-616 (identical in MCSItem.as:406-437), XMLItem.as:110-117; corroborated by reference/extracted/sprites/ directory names`
- **Quote:** art = (xmlItem == null) ? id : xmlItem.art;  if(StatsManager.useExternalResource) return ResourceManager.getMCSComponent(partType,art);  if(getDefinitionByName(partType + art.toString())) ClassDefinition = Class(getDefinitionByName(partType + art.toString())); else ClassDefinition = Class(getDefinitionByName(partType + "0"));   |   XMLItem.as:116  this.art = this.id;   |   extracted sprite dirs: DefineSprite_2643_weapon13000, _2642_weapon13002, _2647_torso4000, _2649_thigh11000, _2675_foot12000, _2673_foottop12000, _2679_calf11000, _2657_mask9000, _2666_hat7000, _2669_hair6001, _2671_hair6000,
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L3 + L6 — the symbol name for any of the 982 items is computable today as partType + (art ?? id) with fallback partType+"0"; 18 partType prefixes are enumerated at MCSItem.as:67-392 (hat hair head mask weapon item acc hand foot foottop stomach pelvic torso uparm lowarm thigh calf crotch neck). STILL OUT: per-item art lives in Android char-ids 115 Mobile_SHS3Resource (654,169 B) and 120 Mobile_BGResource (4,204,635 B), both CWS-headered but not zlib-decompressible — two decode attempts failed, stopped per stuck-stop.

### `items-equipment/compositing-part-order` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The compositing contract's part list, slot routing and wire format are held; only the numeric z-order stack is not, because it lives in the SWF timeline rather than in ActionScript.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:5-60 (embed + PART_ enum), :348 (mcsString), :312-347 (tint), :374-385 (hair/hat exclusion)`
- **Quote:** [Embed(source="/_assets/assets.swf", symbol="symbol1970")]  ...  PART_l_hand 0, PART_l_uparm 1, PART_l_lowarm 2, PART_weapon 3, PART_prop 4, PART_l_foot 5, PART_l_thigh 6, PART_l_calf 7, PART_crotch 8, PART_r_foot 9, PART_r_thigh 10, PART_r_calf 11, PART_neck 12, PART_stomach 13, PART_pelvic 14, PART_torso 15, PART_head 16, PART_hat 17, PART_r_hand 18, PART_r_uparm 19, PART_r_lowarm 20, PART_prop2 21, PART_prop3 22, PART_l_shoulder 23, PART_r_shoulder 24, PART_l_knee 25, PART_r_knee 26   |   this.mcsString = armorid + armorColor + "|" + glovesid + "|" + hairid + "|" + hatid + hatColor + "|" + 
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L3 + L6 — 27-part rig enumerated; only armor, pants, hat and mask are tintable (primary+secondary colour injected into the wire string); hair/hat are mutually exclusive via hatid > 0 && hatid != 7000 && hatid != 7049. The depth stack must still be read out of the SWF's PlaceObject tags.

### `items-equipment/condition-no-damage-multiplier` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ② is a question with no answer: there is NO condition→DMG multiplier. Weapon condition is binary at the damage layer — a 1%-condition weapon hits exactly as hard as a 100% one; only isBroken() changes damage.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1863-1903, Item.as:1467-1479 (isBroken), Item.as:712-745 (condition is display-only)`
- **Quote:** if(itemdata == null || equipment[EQ_WEAPON].isBroken()) { basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + 1; } else { basedamage = getPlayerStats(STAT_ATTACK) + findBonusStat(STAT_ATTACK) + itemdata.mindamage; }   |   getDamageRange(): if(equipment[EQ_WEAPON].itemID == 0 || equipment[EQ_WEAPON].isBroken()) return 0; ... return itemdata.maxdamage - itemdata.mindamage;   |   isBroken(): return this.uses >= itemXML.durability + this.getModifierBonus(83);
- **Overturns:** "② condition→DMG **multiplier** (current "evidence" confounds condition with a 2-level gap)."
- **Lane impact:** L3 + L5 — do NOT encode a condition damage multiplier; encode a broken/not-broken switch. Condition itself is a 0-100 percentage with SIX display bands (uses==0, uses==1, ==0 red, <25, <50, <75, else), not the ledger's unnumbered 'condition tier names'.

### `items-equipment/paperdoll-13-slots` — HELD [A2] ⚑ OVERTURNS LEDGER

The paperdoll is 13 equipment slots, not the 9 the ledger claims.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:108 and :262-286`
- **Quote:** public static var equipment:Vector.<Item> = new Vector.<Item>(13);  ...  internal static var EQ_ARMOR:int = 0; EQ_GLOVES 1; EQ_HAIR 2; EQ_HAT 3; EQ_HEAD 4; EQ_MASK 5; EQ_NECK 6; EQ_PANTS 7; EQ_SHOES 8; EQ_WEAPON 9; EQ_SCABBARD 10; EQ_ACCESSORY1 11; EQ_ACCESSORY2 12;
- **Overturns:** "- **Ready:** 9-slot paperdoll; 4 rarity tiers; affix **prefix** pool (verbatim); item-name template; full ItemStats field list; (EQ:n) comparison UX; condition tier names; weight cap 100; soul-infusion + stat-transfer rules (patch-note-sourced); measured weight table + a few named-item stat blocks; defense min-floor (EnemyLevel/4)."
- **Lane impact:** L3 (ITEMS + PAPERDOLL) — the lane's own description in GAUNTLET.md says '9-slot compositing contract'; it must read 13-slot. Three of the 13 (HEAD, NECK, SCABBARD) are excluded from weight/stat rollups, which is likely where '9' came from, but they still render.

### `items-equipment/premium-catalog-held` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

§6's 'dead IAP economy — structurally unrecoverable' is too broad: the in-game premium catalogue, including the designers' own named outfit sets and their commented-out SKUs, is on disk.

- **Cite:** `char-id 121 Mobile_PremiumData (4,504 bytes) extracted from reference/decrypted/shs3_android_payload_decoded.swf; cross-referenced with the 304 <heavenlyprice> rows in reference/extracted/itemdata.xml`
- **Quote:** <?xml version="1.0" encoding="UTF-8"?>\n<premiumdata>\n<default>\n<item>2208</item>\n<item>2209</item>\n<item>2212</item>\n...\n </default>\n\n <special>\n <!--\n<item>2171</item>\n<item>13036</item>\n...\n-->\n</special>\n\n<rotation>\n<!-- Assassin outfit -->\n<set>\n<item>2130</item>\n<item>7034</item>\n<item>4065</item>\n<item>5008</item>\n<item>11036</item>\n<item>12018</item>\n</set>\n<!-- Dark Assassin outfit -->
- **Overturns:** "- **The dead IAP economy** — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this."
- **Lane impact:** L11 (META + REBIRTH) — narrow §6's bullet to the real-money layer only (price points, store SKUs, conversion rates), which IS gone. The Gold-priced item economy is reconstructible from premiumdata + the 304 <heavenlyprice> rows (values 0,1,2,3,5,8,12,25,100).

### `items-equipment/sell-price-formula` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Blocker ③ is mostly closed: item valuation is baseprice for plain stock and baseprice + itemLevel*100 for procedurally generated rares; the declared sellPercentage of 0.5 is never referenced anywhere in the 970-class bundle.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLShopItem.as:31, :68, :86; ShopUI.as:58, :257, :393, :540; Item.as:274-300 (getLevel)`
- **Quote:** this.value = itemData.gvalue + this.item.getLevel() * 100;   |   internal var sellPercentage:Number = 0.5;   [grep -rn "sellPercentage" *.as across all 970 Android classes returns ONLY this declaration]   |   StatsManager.changeGold(this.displayItem.getCost());   |   xmlShopItem = XMLShopItem.create(itemData.id,itemData.gvalue,itemData.desc);
- **Overturns:** "③ sell-price formula."
- **Lane impact:** L10 (PROGRESSION + ECONOMY) — the valuation formula is A2-exact and explains §3 correction #9's 'same sword 5c and 25c' (Item.getLevel() = max modifier tier + 1, floored by <minlvl>, capped at levelCap). STILL_UNHELD: whether the shipped web v0.717 build applied the 0.5 haircut. nodrop items are excluded from the sell list entirely.

### `items-equipment/stat-vs-level-curve` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ① 'item stat-magnitude vs level curve' is five closed-form arithmetic progressions over 80 tiers, plus per-slot allowed-affix bitmasks and a forced first affix.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:150-183 (progressions), :321-347 (tier draw), :397-452 (masks + forced first), :474-490 (roll)`
- **Quote:** base = 1; inc = 3 / 3; prog1[i] = Math.floor(base + inc * i); prog1[MAXINDEX] += 10;  base = 5; inc = 5 / 3; prog2[...]  base = 1; inc = 1 / 3; prog3[...]  base = 1; inc = 2 / 3; prog4[...]  base = 1; inc = 1 / 5; prog5[...]   |   modvalue = modMin + this.rng.rand(modMax - modMin);   |   if(getHighestTier) { tier = this.rng.rand(4) + tier - 3; ... } tier = this.rng.rand(10) + tier - 9;   |   if(itemType == WEAPON) pot = [1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,1,1];
- **Overturns:** "① item stat-magnitude **vs level** curve."
- **Lane impact:** L3 — prog1 drives ATTACK/DEFENSE, prog2 MAX HP/MAX CHI, prog3 regens + all 8 elementals + CRIT DMG, prog4 SPEED, prog5 PIERCING. The FIRST rolled affix uses a tight -3..0 band off node level, later affixes a loose -9..0 band. Weapon ATTACK and armor DEFENSE subtract the item's own <minlvl> before tiering.

### `items-equipment/string-table-partial` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The gauntlet's standing string-table blocker moves but does not fall: the table is now NAMED and PATHED (shs3_en.xml, external server file — which is why bindata/ never held it) and a 2,555-entry English slice has been extracted from the Android payload, but every item name id sits ABOVE that slice, so item names remain unheld.

- **Cite:** `reference/decompiled/shs3_android/scripts/LangManager.as:9-13, :38-58; Mobile_Lang_EN.as:5; char-id 118 of reference/decrypted/shs3_android_payload_decoded.swf (500,024 bytes UTF-16LE XLIFF); reference/decompiled/shs3_payload/scripts/§1t123s0§.as:900`
- **Quote:** var server:String = "./data/"; ... Locale.addXMLPath(ENGLISH,server + "shs3_en.xml"); Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");   |   [Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]   |   decoded: <trans-unit id="0" resname="0"><source>No</source></trans-unit> ... 2555 units, ids 0-2554 contiguous, max id 2554   |   BUT itemdata <name> ids run 34-4427 and <desc> 207-4405, and the quest engine calls §1t1521s0§.getString(11253) — lookups of 4000/4001/4002/4058/4172 all return None; grep -c "Katana|Wakizashi|Tanto|Nodachi" on the decoded table = 
- **Overturns:** "KNOWN BLOCKER (GAUNTLET.md §2.1): item/skill/npc <name>, <desc>, <displayname> and cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED. ui_strings.txt is NOT it. bindata/ is now EXHAUSTED as a candidate."
- **Lane impact:** L1b (STRING TABLE) — its exit condition ('every ID resolves with an A2 cite, or the lane reports the table as genuinely absent') is now answerable: the table is a server-side external file shs3_en.xml under ./data/ or <server>/strings/, three locales exist (en, zh-CN, ja), and a third of it is decoded. Item names stay STILL_UNHELD; numbers remain portable, names do not.

### `items-equipment/weapon-slash-budget-and-reach` — HELD [A2] ⚑ OVERTURNS LEDGER

The equipment code carries combat-core's missing 'reach cap in px': slash length is a closed-form function of SPEED and Dan rank, and each weapon's <slashusage> is the cost charged against it.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:1915-1930; XMLItem.as:152-159; reference/extracted/itemdata.xml:8742-8752`
- **Quote:** internal static function getBaseSlashLengthVal(speed:int) : int { var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5; return int(120 + Math.floor(maxincrement * speed / (20 + speed))); }   |   if(itemdata == null || itemdata.slashusage < 48) { ... return 48; } return itemdata.slashusage;   |   XMLItem.as:158  this.slashusage = 48;   |   itemdata.xml:8742-8752  <item><id>13113</id><type>9</type><name>4050</name><minlvl>1</minlvl><mindamage>2</mindamage><maxdamage>16</maxdamage><slashusage>96</slashusage><stancerestriction>6</stancerestriction><weight>15</weight><uses>100</uses>
- **Overturns:** "| **combat-core** | 42 | gesture map, damage formula, blade-path model, combo rules | **reach cap in px**; crit final read; early TTK numbers; Focus/crit gating rule |"
- **Lane impact:** L5 (COMBAT CORE) — its §2 blocker 'reach cap in px' has an exact formula: 120 + floor((90 + DAN*5) * SPEED / (20 + SPEED)), i.e. a hard 120 floor at SPEED 0 and a 210 asymptote at DAN 0. Also from the same rows: <slashusage> has exactly 3 values (24/72/96) over 106 items with default 48; <stancerestriction> 2 values (4, 6) over 53 items; <uses> 4 values (50/60/80/100) over 115 items; generated items START partially spent (ItemGenerator.as:654-661).

### `items-equipment/weight-cap-is-not-flat-100` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The 'weight cap 100' Ready bullet is a base, not a cap — carry weight is 100 + stat1009 * 20 and is upgradable.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2298-2301 (cap) and :1983-2026 (findWeight)`
- **Quote:** public static function getCarryingWeight() : int { return 100 + getStat(1009) * 20; }   |   findWeight(): weight += itemXML.weight * inventory[q].getQuantity(); ... for(q = 0; q < 13; q++) { if(q != EQ_HEAD && q != EQ_NECK && q != EQ_SCABBARD) { ... weight += itemXML.weight; } } ... weight += itemXML.weight * questItems[q].getQuantity();
- **Overturns:** "weight cap 100"
- **Lane impact:** L3 + L10 — encode 100 as a base with a +20/rank upgrade track. Overweight blocks travel/room entry (NodeUI.as:379, Obj_HiddenTemple.as:187, InteractUI.as:1730) rather than blocking pickup. itemdata.xml carries 745 <weight> rows, 0-500.

### `items-equipment/modifier-id-semantics` — HELD [A2]

The item modifier enum is now fully decoded end-to-end: modifier ids 0-16 map to named player stats, and ids 101-1999 are equipment SET bonuses.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:231-298 (id → string-id switch), resolved against the 2,555-entry table extracted from char-id 118 of reference/decrypted/shs3_android_payload_decoded.swf`
- **Quote:** case 0: tempString += LangManager.getString(110); ... case 16: tempString += LangManager.getString(122); default: if(int(this.modifierXML[q].id) < 2000 && int(this.modifierXML[q].id) > 100) { tempString += LangManager.getString(123) + ": " + this.modifierXML[q].id; }   →   0 HP, 1 Max HP, 2 HP Regen, 3 Chi, 4 Max Chi, 5 Chi Regen, 6 Attack, 7 Defense, 8 Speed, 9 XP, 10 'Level ', 11 Coins, 12 Gold, 13 AP, 14 Max AP, 15 Duel Tokens, 16 Max Duel Tokens, 101-1999 'Set'; plus 124 'Level Required', 125 'Stance Restriction', 108 'Dmg', 109 'Def'
- **Lane impact:** L3 — all 412 <modifier> blocks (34 distinct ids, 319 <value> rows) in itemdata.xml are now readable. Note modifier 7 (Defense) is suppressed from the tooltip when the item already carries a non-zero <defense>.

### `items-equipment/name-template-frame-confirmed` — HELD [A1]

A single video frame simultaneously validates the affix pools, the forced-first-affix rule, the weapon slot mask and the rarity colour rule — the generated quest-item name 'DRAFTY SHARP IRON SWORD OF PIERCING' decomposes exactly as the code's 3-modifier template predicts.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0024.jpg — 1024x576 source, crop (0,420)-(640,500), upscaled 3x LANCZOS`
- **Quote:** Visibly in the crop: 'I AM LOOKING FOR' in white, then 'DRAFTY SHARP IRON SWORD OF PIERCING' in bright blue, then ' .'  —  which decomposes against ItemGenerator.as:744-746 as pre(mod2)="Drafty"=windatk_pre[0], pre(mod0)="Sharp"=attack_pre[0] (ATTACK is the FORCED first affix on a WEAPON per ItemGenerator.as:439-443), basename="Iron Sword", suf(mod1)="of Piercing"=piercingdmg_suf (index 16, allowed ONLY by the WEAPON mask). Three affixes ⇒ the modifierCount>=3 blue branch of Item.getName.
- **Lane impact:** L3 — strongest corroboration in the lane: frame, affix pools, forced-first rule, slot mask and rarity colour all agree, so the generator can be ported with confidence rather than tuned by eye.

### `items-equipment/no-items-config-still-true` — HELD [A3]

The ledger's Surface bullet is correct and unchanged: no items config file exists in the repo — the catalogue is entirely un-ported.

- **Cite:** ``ls src/config/` (a repo byte-check, NOT a vitest suite test — stating that plainly so the class is not overread)`
- **Quote:** ai.ts anim.ts art.ts chi.ts combat-sim.ts combat.ts display.ts duel.ts economy.ts fidelity.ts fx.ts gesture.ts mobs.ts nums.ts ogAnims.ts ogPose.ts palette.ts popups.ts poses.ts profile.ts reach.ts rng.ts skills.ts stances.ts stats.ts timing.ts xp.ts  — no items.ts, no equipment.ts, no affixes.ts
- **Lane impact:** L3 — the port is now a transcription task rather than a research task: 982 items + the affix generator + the modifier enum are all A2-held. Only names (L1b) gate the human-readable half.

### `items-equipment/pot-mask-frame-confirmed` — HELD [A1]

A video frame independently confirms the PANTS allowed-affix bitmask: elemental DEF present, elemental ATK and PIERCING absent, CRIT DMG present — exactly the code's mask.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0031.jpg — 1024x576 source, crop (575,140)-(1015,420), upscaled 3x LANCZOS`
- **Quote:** Visibly in the crop: a green-bordered icon, green item name 'PANTS', 'OWNED: 0', 'LEVEL 4', then 'DEFENSE: +1 (EQ: 3)' / 'FIRE DEF: +1 (EQ: 0)' / 'WIND DEF: +2 (EQ: 0)' / 'EARTH DEF: 0 (EQ: 1)' / 'CRITICAL DAMAGE: 0 (EQ: 1)' / 'MAX CHI: 0 (EQ: 5)' / 'CHI REGEN: 0 (EQ: 2)' / 'WEIGHT: 5'. No elemental ATK line, no PIERCING line.
- **Lane impact:** L3 — the frame and the AS3 agree, so no frame-vs-doc conflict arises here; PANTS mask [1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0] is confirmed against live footage. Red/green digit tinting matches Item.compareValue's #FF0000/#00A606.

### `items-equipment/rarity-4-tiers-exact` — HELD [A2]

The '4 rarity tiers' Ready bullet is true and now exact: rarity is DERIVED from affix count (not stored), with eight literal hex colours across two backgrounds.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:417-451`
- **Quote:** if(itemxml != null && itemxml.unique == 1 || this.isPickableQuestItem() || isTradeQuestItem || this.isPlayerNamed()) { output += "<font color=\"#b048f8\">"; } else if(modifierCount >= 3) { output += "<font color=\"#0080ff\">"; } else if(modifierCount > 0) { output += "<font color=\"#1eff00\">"; } else { output += "<font color=\"#FFFFFF\">"; }   [light-bg variants: #6600cc / #003399 / #336600 / #000000]
- **Lane impact:** L3 + L8 — rarity needs no data field; compute it from modifier count plus the <unique>==1 flag. itemdata.xml's <unique> has exactly 2 distinct values (1 and 2) over 369 rows and only ==1 triggers the purple tier.

### `items-equipment/soul-infusion-transfer-rule` — HELD [A2]

The 'soul-infusion + stat-transfer rules (patch-note-sourced)' Ready bullet is now source-sourced and exact: a two-slot craft that transfers ALL affixes wholesale and reconciles weapon base damage into modifier id 6.

- **Cite:** `reference/decompiled/shs3_android/scripts/CraftingUI.as:506-527`
- **Quote:** var combinedItem:Item = new Item(this.designSlot.itemID); combinedItem.copyModifiers(this.statsSlot.getItem().modifiers); if(designType == 13) { designMinDamage = designItemXML.mindamage; statsMinDamage = QuestEngine.getItemData(this.statsSlot.itemID).mindamage; if(combinedItem.getModifierBonus(6) == 0) combinedItem.addModifier(6,statsMinDamage - designMinDamage); else { modifier = combinedItem.getModifierObject(6); modifier.value += statsMinDamage - designMinDamage; } combinedItem.uses = this.statsSlot.getItem().uses; } combinedItem.setPrimaryColor(this.designSlot.getPrimaryColor());
- **Lane impact:** L3 — designSlot supplies the item body and colour, statsSlot supplies the affixes and durability; the damage delta is folded into the ATTACK modifier so the donor's damage survives on the recipient's silhouette. Paid in Gold.

### `items-equipment/type-is-slot-index` — HELD [A2]

itemdata.xml's <type> is not a taxonomy label — it is the equipment-array index, giving a clean id-range → slot map across all 982 items.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:841-845, cross-checked against all 982 <item> blocks in reference/extracted/itemdata.xml`
- **Quote:** var itemType:int = itemXML.type;  ...  var equippedItem:Item = StatsManager.equipment[itemType];  ...  if(itemType != 10 && itemType != 12)   // parsed counts: 4xxx→type0 ARMOR 152, 5xxx→1 GLOVES 35, 6xxx→2 HAIR 73, 7xxx→3 HAT 97, 8xxx→4 HEAD 38, 9xxx→5 MASK 60, 10xxx→6 NECK 14, 11xxx→7 PANTS 93, 12xxx→8 SHOES 55, 13xxx→9 WEAPON 177, 2xxx→10 consumable 98, 3xxx→11 ACCESSORY 9, 20xxx→12 quest 79
- **Lane impact:** L3 — the item→slot routing for the whole catalogue is a lookup, not a classification job. One authoring anomaly to reproduce verbatim: exactly 1 item in the 7xxx hat range carries type 0 (armor).

## meta-social — re-scored 72

31 -> 72. Of the four §4 blockers: ② (map topology) and ③ (achievements/daily/tokens) are FULLY closed from artifacts; ① (server sim) is closed on mechanics and open only on hosted state; ④ (gold faucet) is confirmed correct as written. §6's "Server-sim topology & save format — nothing to copy" is over-claimed and downgraded to PARTIAL. Deductions that keep it off 85+: war-rules page 7 (string ids 11016/11017) is above the recovered string table's 9010 ceiling; no payload row binds war-room side numbers 1-5 to the four named clans; no frame of the hex board itself was found in 7,381 stills; and an entire duel/leaderboard/friends/custom-clan surface exists in the payload that the ledger block never surveyed, so 31 was scored over a smaller system than the one that exists.

### `meta-social/achievements-61` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete achievement list — 61 rows with name id, desc id, tracked stat id, image tier and threshold — is on disk inside the Android payload; no Ruffle session is needed.

- **Cite:** `reference/decrypted/shs3_android_payload_decoded.swf DefineBinaryData id 114 (9,080 bytes, root <achievementdata>); pointer class reference/decompiled/shs3_android/scripts/Mobile_AchievementData.as:5; resolved through the string table of claim meta-social/string-table-located`
- **Quote:** <achievement>\n\t\t<id>0</id>\n\t\t<img>1</img>\n\t\t<name>8000</name>\n\t\t<desc>8080</desc>\n\t\t<stat>60000</stat>\n\t\t<val>1</val>\n\t</achievement>  — resolves to 'Duelist I — Win an online duel.' 61 rows total, e.g. id 5 stat 60017 val 10000 'Killer III — Defeat 10000 enemies.'; id 51 stat 25 val 9 'Ultimate Warrior — Reach Dan 10.'; id 55 stat 60001 val 10 'War Hero — Reach War Hero Rank.'; id 58 stat 60018 val 340 'Warrior III — Defeat 340 in a war room attack.'; id 60 stat 60025 val 1 'Be Awesome — Completed Season 1'.
- **Overturns:** "③ achievements list, daily-reward table, token costs — *one Ruffle session closes all.*"
- **Lane impact:** L11 gets the full achievement table A2-exact. Bonus cross-lane: achievements 45/46 pin the skill tree at 10 Chi skills + 9 Ninja skills (L2), and 48-51 pin the Dan ladder at Dan 2/3/6/10 milestones (L11 rebirth).

### `meta-social/daily-reward-table` — HELD [A2] ⚑ OVERTURNS LEDGER

The daily-login reward table is fully specified in client code — a 36-outcome base roll, a 6-outcome 10-day bonus roll and a 10-outcome 30-day super-bonus roll, plus the 24h/48h streak bookkeeping.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1139-1375, case "dailyprize"`
- **Quote:** case "dailyprize": ... 'StatsManager.setStat(30018,QueryManager.instance.getServerTime() + 24 * 60 * 60);' ... 'if(streak > 1 && (streak - 1) % 30 == 0)' -> 'dice = Math.random() * 10;' over item ids 2130,2131,2132,2133,2135,2136,2137,2138,2139,2146 ... 'else if(streak > 1 && (streak - 1) % 10 == 0)' -> 'dice = Math.random() * 6;' over 1000 coins / 2101 / 2105 / 2126 / 2127 / addRandomLootItem ... else 'dice = Math.random() * 36;' with 'if(dice <= 4) addLootCoins(100)', dice 5 -> 200 coins, 6 -> 300 coins, 7 -> random level-scaled item, 8..35 -> fixed item ids 2115..2216. Streak resets if the 
- **Overturns:** "③ achievements list, daily-reward table, token costs — *one Ruffle session closes all.*"
- **Lane impact:** L11 + L10 (ECONOMY): the daily faucet is now an exact distribution, not an INFERRED rate. Corroborated by string ids 843/844 ('Every 10 consecutive days: bonus prize!' / 'Every 30 consecutive days: super bonus prize!!!').

### `meta-social/hex-type-enum` — HELD [A2] ⚑ OVERTURNS LEDGER

Fourteen War-Room hex types and three terrain types are enumerated as named constants, with per-type descriptions, build-progress math and a castle-gate timer.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHex.as:11-37 (types), :425 and :521 (build math), :499 (gate window); WarTerrain.as:9-13 (terrain)`
- **Quote:** public static var HEX_NOTHING:int = 0; ... HEX_SPAWNPOINT 1, HEX_FORWARDBASE 2, HEX_CONTROLPOINT 3, HEX_TOWN 4, HEX_POTENTIALSPAWNPOINT 5, HEX_UPCOMINGSPAWNPOINT 6, HEX_LADDER 7, HEX_DEFENSE 8, HEX_VILLAGE 9, HEX_CITY 11, HEX_CASTLE 12, HEX_DISABLEDSPAWNPOINT 13, HEX_DEMOLISHEDSPAWNPOINT 15. Build progress: 'buildpercentage = (maxcost - this.cost) / maxcost * 100;' with maxcost=10000 (5000 for HEX_LADDER). Castle gate: 'if(QueryManager.instance.getServerTime() - castleGateTime > 3 * 60 * 60)'. Terrain: 'public static var TERRAIN_FIELD:int = 0; ... TERRAIN_FOREST:int = 1; ... TERRAIN_MOUNTAIN:i
- **Overturns:** "② War-Room **map topology** (board/adjacency)."
- **Lane impact:** L11: the hex taxonomy, its build costs and the 3h castle-gate window are all A2-portable to config — none of it needs authoring.

### `meta-social/save-schema-copyable` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

§6's 'Server-sim topology & save format — nothing to copy' is over-claimed: the complete PlayerIO BigDB table-and-key schema is enumerable from the client's query manager.

- **Cite:** `reference/decompiled/shs3_android/scripts/QueryManagerPIO.as:421, 815, 1267, 1284, 1914, 2004, 2149, 2180, 2321, 2353`
- **Quote:** this.client.bigDB.loadMyPlayerObject(function(po:DatabaseObject):* ...  /  client.bigDB.load("GeneralData","motd", ...)  /  this.client.bigDB.load("GeneralData","TownState", ...)  /  this.client.bigDB.load("GeneralData","WarRoomState", ...)  /  this.client.bigDB.load("TerritoryData",territoryId.toString(), ...)  /  this.client.bigDB.load("TerritoryExtraData",territoryId.toString(), ...)  /  this.client.bigDB.load("WarSentryData",StatsManager.charname, ...)  /  this.battleData.save();
- **Overturns:** "**Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** L9 (WORLD, 'a save round-trips') and L11: the persistence topology — tables PlayerObjects / GeneralData(motd, TownState, WarRoomState) / TerritoryData / TerritoryExtraData / WarSentryData / battleData — is copyable. Only the hosted ROWS are gone. §6 should be rewritten to say 'the hosted state is gone', not 'nothing to copy'.

### `meta-social/token-numbers` — HELD [A2] ⚑ OVERTURNS LEDGER

Both token economies are numerically held: Duel Tokens regenerate 1 per 120 s with a starting cap of 20 and a hard cap of 30, and the premium currency's prices are already in the extracted itemdata as 304 <heavenlyprice> rows.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:160,166,709-710 + reference/extracted/itemdata.xml (304 <heavenlyprice> occurrences) + reference/decrypted/shs3_android_payload_decoded.swf DefineBinaryData id 121 root <premiumdata>`
- **Quote:** internal static var DTINTERVAL:int = 2 * 60;
internal static var MAXDUELTOKENS:int = 30;  — and at :709-710 'setPlayerStats(STAT_DUELTOKENS,20); setPlayerStats(STAT_MAXDUELTOKENS,20);'. itemdata id 2100: '<heavenlyprice>1</heavenlyprice>'. premiumdata: '<default><item>2208</item><item>2209</item>...'
- **Overturns:** "③ achievements list, daily-reward table, token costs — *one Ruffle session closes all.*"
- **Lane impact:** L11 + L10: token regen/cap and the full premium price list are A2-portable. Note the premium currency is named 'Gold' in the UI and 'Heavenly Gold' in code (StatsManager.getHeavenlyGold), distinct from 'coins'.

### `meta-social/warroom-board-6x6` — HELD [A2] ⚑ OVERTURNS LEDGER

The War-Room map topology is a 6x6 sector grid generated deterministically client-side from the territory id — it is not server state and is fully reconstructible.

- **Cite:** `reference/decompiled/shs3_android/scripts/TerritoryData.as:1066-1080 (generation); WarHexUI.as:2311-2316 (bounds); WarHex.as:218-222 (adjacency)`
- **Quote:** var rng:RNG = new RNG(this.territoryID);
var territoryx:int = this.territoryID >> 12 & 0x0FFF;
var territoryy:int = this.territoryID & 0x0FFF;
for(var i:int = 0; i < 6; i++)
{
   sectorBuildArray[i] = new Array();
   for(j = 0; j < 6; j++)
   {
      sectorBuild = new SectorBuild(i,j,territoryx * 6 + i << 12 | territoryy * 6 + j);   — and adjacency at WarHex.as:218-222: 'exitArray = OverworldHUD.instance.warUI.warHexUI.terrainArray[this.xpos][this.ypos].getExitArray(); this.narrow.visible = exitArray[0] == 0 && this.ypos != 0;' (exit order N,S,E,W)
- **Overturns:** "② War-Room **map topology** (board/adjacency)."
- **Lane impact:** L11 (META) can build the war-room board 1:1 rather than authoring a deviation; L9 (WORLD) inherits the same territoryID = (x<<12)|y coordinate scheme and the SectorBuild node-id formula.

### `meta-social/warroom-mechanics-recoverable` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The War-Room simulation MECHANICS are client-side and fully recovered — deploy strength, arrow-fire damage, the 7-entry terrain modifier table, structure costs and the 24h advance tick; only the hosted population is gone, so 'unrecoverable at 1:1' over-states the loss.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:1052, :1104, :2286-2306, :613-617; WarHexUIBuildMenu.as:190-213; string 376 via the recovered table`
- **Quote:** deployvalue = 100 * this.getTerrainModifier();  /  num = 80 + Math.random() * 40 * this.getTerrainModifier();  /  terrain table: 'case 2: return 1.5; case 1: return 1.2; case 0: return 1; case -1: return 0.75; case -2: return 0.6; case -3: return 0.5; case -4: return 0.25;' with defence/city/castle adding 'toValue += 2'  /  build costs: Forward Base 10000, Tunnels 5000, Barricades 10000, Town 10000, Command HQ free  /  string 376: '- Troops will advance on enemy sectors every 24 hours.'  /  actions at :613-617 are deploy, attack, move, spy, build, each costing useWarMove(1).
- **Overturns:** "① **server-authoritative simulation** (24h tick, matchmaking, live population) — **unrecoverable at 1:1**; must be scoped out or rebuilt as a *new* offline AI sim (labeled)."
- **Lane impact:** L11: the offline sim does NOT have to be authored from scratch — deploy math, terrain table, structure costs, castle-gate window and the 24h tick are OG-exact. Only matchmaking and live population remain authored deviations, and the DIVERGENCES entry should shrink to just those. Also confirms the ledger's own '24h resolution' Ready bullet with an A2 cite.

### `meta-social/custom-clans` — HELD [A2]

The clan roster is not four fixed clans: the game supports player-created custom clans as war side 7, with per-clan colour, logo and logo-colour, gated on War Hero rank.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHex.as:117-120, :174-187; CreateClanDialog.as; string id 4031 via the recovered table`
- **Quote:** if(StatsManager.isCustomClan(num))
{
   this.ownerbg = 7;
}  — and :174-182 'this.customClanObj = QueryManagerPIO.instance.getCustomClanData(this.owner); ... ColorCode.changeColor(this.bg.customhexbg,this.customClanObj.color); ... this.flag.logo.gotoAndStop(this.customClanObj.logo); ColorCode.changeColor(this.flag.logo,this.customClanObj.logocolor);'. String 4031: 'Form your own clan.\nWar Hero rank required.\n\nIncludes:\n1 Clan General Invitations\n3 Clan Invitations'. Canonical side colours at WarHexUI.as:1656-1675: 1=0xFF0000, 2=0x009900, 3=0x0066FF, 4=0xFFFF00, neutral=0xFFFFFF.
- **Lane impact:** L11: the Ready bullet '4 clans (heraldry/masks/daimyo/capitals)' under-describes the system — it is 4 canonical sides + a custom-clan slot (side 7) with a colour/logo customiser. The 4 canonical side colours are now byte-exact and should go straight to config.

### `meta-social/duel-social-surface-unscored` — HELD [A2]

An entire online-duel, leaderboard, friends and gifting layer exists in the payload that the meta-social ledger block never mentions, so the 31/100 was scored over a smaller system than the one that exists.

- **Cite:** `reference/decompiled/shs3_android/scripts/DuelLeaderboardUI.as:7-19 (and siblings DuelModeUI.as, DuelRequestDialog.as, DuelSlot.as, LeaderboardUI.as, FriendPanel.as, GiveCoinsDialog.as, GotGiftDialog.as, BankUI.as, MOTDDialogBox.as, CreateClanDialog.as)`
- **Quote:** [Embed(source="/_assets/assets.swf", symbol="symbol1472")]
   public class DuelLeaderboardUI extends MovieClip
   {
      public var typeButton:RedButtonSmall;
      public var namelabel:TextField;
      public var winlosslabel:TextField;
      public var nextButton:RedButtonSmall;
      public var leaderboardtype:TextField;  — corroborated by achievements 0-2 ('Duelist I-III — Win n online duels', stat 60000) and 23 ('Philanthropist — Give 10000 coins to friends', stat 60009).
- **Lane impact:** L0 scoring + L11 scope: the meta-social block must be widened to cover duel mode, two leaderboard UIs, friends/gifting, the bank, MOTD and clan creation before its score means anything. These are named, unobfuscated classes — the shape is free; only the hosted opponent data is gone.

### `meta-social/gold-faucet-confirmed` — HELD [A2]

The ledger is RIGHT that there is no offline premium-gold faucet to recover: the only sources of Heavenly Gold in the client are IAP, a payment-provider dialog, and server-pushed gifts — and questdata awards zero gold.

- **Cite:** `reference/decompiled/shs3_android/scripts/PayUI.as:672, ProviderSelectDialog.as:177, StatsManager.as:4734, LootDialog.as:659; reference/extracted/questdata.xml (grep -c '<gold>' = 0)`
- **Quote:** Only three call sites of addLootGold exist: 'OverworldHUD.instance.gotGiftDialog.addLootGold(newGold - this.currentGold);' (PayUI.as:672 and ProviderSelectDialog.as:177) and 'OverworldHUD.instance.gotGiftDialog.addLootGold(insideStrArray[1]);' (StatsManager.as:4734, gift-notification parser). questdata.xml contains 0 occurrences of <gold>. The coin faucet is separately stated in war-rules string 372: '- the clan will pay the player 5 coins per move made.'
- **Lane impact:** L11 + L10: blocker ④ STANDS as written — the offline gold faucet must be authored and labelled in DIVERGENCES. What IS recovered is every price the faucet must feed (304 <heavenlyprice> rows) and the coin faucet rate (5 coins/war move).

### `meta-social/killcap-350-flag-120-ungrounded` — STILL_UNHELD [STILL_UNHELD]

The ledger's 'kill cap 350' and 'flag +120%' Ready items could not be grounded anywhere in the war-room payload code; the nearest real numbers are a 340 achievement threshold and a 1.2 terrain modifier.

- **Quote:** Searched reference/decompiled/shs3_android/scripts/War*.as, WarTerrain.as, NPCManager.as and GameEngine.as for a 350 kill cap: the only matches for 350 are 'LangManager.getString(350)' (the 'Forward Base' label) at WarHexUIBuildMenu.as:191 and WarHex.as:421. No flag bonus of any kind appears. Nearest real values: achievementdata id 58 = stat 60018, val 340 ('Warrior III — Defeat 340 in a war room attack') and WarHexUI.as:2293-2294 'case 1: return 1.2;' (one-step terrain elevation advantage).
- **Overturns:** "kill cap 350; flag +120%;"
- **Lane impact:** L11: do not port these two numbers as OG fidelity. They are listed under 'Ready' but carry no payload cite; they are probably a mis-transcription of the 340 achievement threshold and the 1.2 terrain modifier. Either produce a frame/wiki cite with a version check, or relabel them INFERRED.

### `meta-social/named-clans-unheld` — STILL_UNHELD [STILL_UNHELD]

No payload row binds the War-Room side numbers 1-5 to the four named canonical clans (heraldry / masks / daimyo / capitals) — only numeric sides and their colours are held.

- **Quote:** WarHex.as, WarHexUI.as, WarTerrain.as and StatsManager.as speak only in integer sides (playerside, targetside, owner 1..5, custom = 7) and colour constants. I found no <clan> table in reference/extracted/, no clan-name block in the recovered 2,555-entry string table beyond generic strings such as 'Major Clan  ( [0] territories owned )', and no cite that maps side 1 to a named clan. The ledger's clan-identity Ready bullet is not something this survey could ground.
- **Overturns:** "4 clans (heraldry/masks/daimyo/capitals) + Shira Tancho story-only"
- **Lane impact:** L11: clan identity remains sourced from wiki/video study, not the payload. Either an A1 frame of the clan-select screen or an A5 owner LOOK verdict is needed before the four clans' heraldry can be treated as OG fidelity.

### `meta-social/rank-curve-exact` — HELD [A2]

The 11-rank war ladder is exact and byte-identical in the desktop v0.717 payload: rank = warMovesMade + floor(coinsDonated/1000) against thresholds 36/84/180/324/516/816/1176/1596/2076/5000, with 3-6 moves per hourly turn and 11 named ranks.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:824-867 (curve), :870-914 (thresholds), :916-964 (names), :966-1014 (moves), :162 (interval) — cross-checked at reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:1186-1228`
- **Quote:** var num:int = getStat(STAT_WARMOVESMADE) + int(getStat(STAT_WARCOINSDONATED) / 1000);
if(num < 12 * 3)
{
   return 0;
}  — thresholds 36,84,180,324,516,816,1176,1596,2076,5000; getMaxWarMoves returns 3,4,4,4,4,5,5,5,5,5,6; 'internal static var WARMOVEINTERVAL:int = 60 * 60;'; names via string ids 330-339 + 403 = recruit, private, corporal, sergeant, sergeant major, lieutenant, captain, major, colonel, general, War Hero. Desktop parity: §1t1523s0§.as:1188 'var _loc1_:int = §1t9714s0§(§1t9424s0§) + int(§1t9714s0§(§1t9425s0§) / 1000); if(_loc1_ < 12 * 3)'.
- **Lane impact:** L11: the ledger's Ready bullet '11-rank ladder (moves/hr + thresholds)' is CONFIRMED and upgraded from inference to A2, including the 11 rank NAMES which were previously blocked by the string table. It also confirms the ledger's own surface note that '36 = Private's rank threshold, not a turn cap' — moves refresh hourly (WARMOVEINTERVAL=3600) at 3-6 per turn.

### `meta-social/rng-lcg-recovered` — HELD [A2]

The original's RNG is recovered and is a 9301/49297/233280 LCG, identical in the Android and desktop builds — load-bearing because the war-room board is seeded from the territory id, so a different generator produces a different board.

- **Cite:** `reference/decompiled/shs3_android/scripts/RNG.as:64-67, cross-checked at reference/decompiled/shs3_payload/scripts/§1t58s0§.as:84-85`
- **Quote:** public function rnd() : Number
{
   this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
   return this.randomSeed / 233280;
}  — desktop payload §1t58s0§.as:84 is the identical line.
- **Lane impact:** L11 + L9: any system seeded from a content id (territory boards via 'new RNG(this.territoryID)', procedural towns, name generation) will NOT match the original unless this LCG is used. src/core is currently specified as mulberry32 (CLAUDE.md), a different stream — flagging for whoever owns determinism; not a ruling.

### `meta-social/rules-page7-content-unheld` — STILL_UNHELD [STILL_UNHELD]

The content of War-Room rules page 7 (desktop string ids 11016/11017) is not recoverable from the string table we now hold, because that table stops at id 9010.

- **Quote:** reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:121-123 asks for 'getString(11016)' and 'getString(11017)'. The recovered table (binaryData 118) has 1,906 numeric ids with a maximum of 9010; lookups for 11016 and 11017 return nothing. The frame at t=3300s confirms page 7 exists ('WAR ROOM RULES 1/7') but the longplay never pages to it.
- **Lane impact:** L1b: this is the concrete measure of the recovered table's incompleteness — every desktop string id >= 9011 is still missing. Closing it needs either a captured shs3_en.xml from Wayback/Player.IO's strings dir (LangManager.as:56 gives the filename) or a frame that pages the rules to 7/7.

### `meta-social/rules-pages-7-not-6` — HELD [A1]

THE FRAME WINS: the v0.717 gameplay video shows 'WAR ROOM RULES 1/7' while the Android build's WarRules.as hard-codes max=6 — proving the Android string table is a strict SUBSET of the desktop table, which extends past its 9010 ceiling to at least id 11017.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 @ t=3300s, 1920x1080, crop (200,80)-(1000,300) upscaled x2; same moment at low res in reference/frames/Nr4fQstqHDM/map/frames/frame_0084.jpg`
- **Quote:** Visible in the crop: 'WAR ROOM RULES 1/7   (JOINING A BATTLE)' above a red-X 'WAR ROOM' side tab. Contradicting A2: reference/decompiled/shs3_android/scripts/WarRules.as:23 'internal var max:int = 6;' (string 369 = 'War room rules 1/6  (joining a battle)'). Confirming A2 from the DESKTOP payload: reference/decompiled/shs3_payload/scripts/§1t7924s0§.as:23 'internal var max:int = 7;' and :121-123 'case 7: this.warrulestitle.text = §1t1521s0§.getString(11016); this.warruleswords.text = §1t1521s0§.getString(11017);'
- **Lane impact:** L1b + L0 method calibration: the Android decompile is a valid Rosetta stone for the obfuscated desktop payload (pages 1-6 use identical string ids 369-380), but any desktop string id >= 9011 is STILL_UNHELD. Every downstream lane quoting an Android-sourced string must state this ceiling.

### `meta-social/sector-coords-frame` — HELD [A1]

A 1080p frame independently corroborates the 6x6 sector grid: the overworld HUD prints sector coordinates inside the 0..5 range the code bounds them to.

- **Cite:** `reference/videos/Nr4fQstqHDM.mp4 @ t=3380s, 1920x1080 full frame, minimap block at upper right (approx x 1450-1850, y 150-600); downscaled copy shows it legibly at 960x540`
- **Quote:** Visibly printed under the compass minimap: 'TERRITORY (23,52)' / 'INSIDE SECTOR (3,5)'. Sector indices are within 0..5 exactly as WarHexUI.as:2311 bounds them ('if(x < 0 || y < 0 || x > 5 || y > 5)'), and territory id decodes as 23<<12 | 52.
- **Lane impact:** L11 + L9: the frame and the payload AGREE here, so the 6x6 board and the (x<<12)|y territory id can be treated as OG fidelity rather than inference. Also gives L8 a real HUD string format for the location readout.

### `meta-social/string-table-located` — HELD [A2]

The string table that gates the whole gauntlet is NOT absent — it is a 500,024-byte UTF-16 XLIFF embedded as DefineBinaryData id 118 inside the Android payload SWF we already hold, and it resolves 100% of the numeric name/desc ids in itemdata, skilldata and npcdata.

- **Cite:** `reference/decompiled/shs3_android/scripts/Mobile_Lang_EN.as:5 (pointer) + reference/decrypted/shs3_android_payload_decoded.swf DefineBinaryData tag 87, characterId 118, 500024 bytes (decoded: 2,555 <trans-unit>, 1,906 numeric ids 0..9010 + 649 IDS_Q* keys)`
- **Quote:** [Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]  —  and from the decoded blob: <trans-unit id="0" resname="0"><source>No</source></trans-unit>. Measured coverage: itemdata <name> 390/390 distinct resolved, <desc> 38/38; skilldata <displayname> 71/71, <desc> 148/148; npcdata <name> 110/110. Spot checks: 4000 => 'Small Soldier Pill', 6000 => 'Light Stance Mastery', 4172 => 'Replenish your AP without waiting!'
- **Lane impact:** L1b (STRING TABLE) is effectively already done for every id <= 9010 — its done-criterion 'every <name>/<desc>/<displayname> ID resolves to text with an A2 cite' is met at 100%. This unblocks L2 (skills) and L3 (items), which GAUNTLET.md §2.1 lists as gated. Recommended: extract binaryData 118 to reference/extracted/strings/shs3_en.xml and add a resolve-coverage test.

### `meta-social/survivalmode-is-warroom-waves` — HELD [A2]

Stage-0 finding S0-1 mis-scoped bindata/119: <survivalmodedata> is not only a standalone mode, it is the WAR-ROOM battle wave table, read by WarHexUI and remapped to the attacking clan's NPC id block — so its 39 waves are meta-social content the ledger never listed.

- **Cite:** `reference/decompiled/shs3_android/scripts/WarHexUI.as:13, :1711-1719, :1731-1752; reference/extracted/bindata/119_1t4646s0.bin (39 <wave>, 87 <enemy>); GameEngine.as:1119-1121; LootDialog.as:687-690`
- **Quote:** internal static const SurvivalModeData:Class = WarHexUI_SurvivalModeData;  ... internal function createWarRoomWaveList(targetside:int) : Vector.<XMLQuestWave>\n{\n   ...\n   var xml:XML = XML(new SurvivalModeData());  — then per-side remap: 'if(targetside == 1){ strArray[k] = remainder + 200; } else if(targetside == 2){ strArray[k] = remainder + 400; } else if(targetside == 3){ strArray[k] = remainder + 300; } else if(targetside == 4){ strArray[k] = remainder + 500; } else if(targetside == 0 || targetside == 5 || StatsManager.isCustomClan(targetside)){ strArray[k] = remainder + 600; }'. Reward
- **Lane impact:** L11 gets the actual FIGHTS of the war room (39 waves, 87 enemy groups, base npc ids 400-456 + bosses 700/701/702) and the clan-side -> NPC id block mapping (+200/+300/+400/+500/+600). L4 (ENEMIES) inherits the same mapping. Corrects the scope of Stage-0 S0-1, which called this 'an ENTIRE GAME MODE absent from all 12 ledger systems' without noting it is the war-room content.

## progression — re-scored 88

All four §4 progression blockers are now A2-sourced and closed: ① DEF/SPD transfer functions (P-06, P-07), ② the L11–80 XP curve (P-01, the full 99-entry table verbatim), ③ post-rebirth SP economy (P-05, exact formula plus the stat-point asymmetry), ④ the XP-income model (P-08, kill formula + grey-out ladder + 69 quest rows). The Ready list survives with two corrections (+1AP→+5AP, 80 SP→79 SP) and two additions (AP + duel-token refill on level-up; ATK/DEF/SPD base 1). The Surface bullet's 271-cap reasoning is replaced by the exact formula 1+(level+10)*3. Nothing in progression remains INFERRED except AP regeneration, which is really a world-lane number. Held back from higher only by (a) every progression-facing NAME still being a numeric id into shs3_en.xml, a runtime HTTP fetch we do not hold, and (b) the residual provenance gap — the web payload stamps v0.706 under a v0.717 preloader, so it is "the last live payload", not provably the filmed build.

### `progression/271-cap-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

The '271 cap' is exactly 1 + (level + 10) × 3 — a pure stat-point ceiling on a single stat at level 80 — not a gear/rebirth-inclusive total, and it is reachable in one stat with 90 of the 237-point budget.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341-3346`
- **Quote:** var _loc6_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9408s0§) < 1 + (_loc2_ + 10) * 3;     // ATTACK
- **Overturns:** "The "271 cap" is gear/rebirth-inclusive (237-point first-run budget makes it impossible in one stat) — resolvable by arithmetic now."
- **Lane impact:** L10 — replaces a wrong explanation with an exact formula. Full L80 cap table: HP 910, Chi 460, AP 480, ATK/DEF/SPD 271 each. Gear rides on top via findBonusStat and is not counted by this test.

### `progression/dan-ranks-and-rebirth-gold` — HELD [A2] ⚑ OVERTURNS LEDGER

Dan rank maxes at 9 stored / 10 displayed, and rebirth gold IS tiered: +25 hard gold on every rebirth and +100 on the last one — so MAX_DAN_RANK=10 and tenthGold=100 are CONTRACT, not INFERRED.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2638-2656 (doRebirth); rank titles at reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2274-2316`
- **Quote:** if(§1t7356s0§(§1t9426s0§) == 8) {
   §1t9713s0§(§1t9413s0§,100);
   §1t3318s0§.instance.§1t3409s0§(§1t1521s0§.getString(864,[§1t9765s0§(),"10"]));
} else {
   §1t9713s0§(§1t9413s0§,25);
}
if(§1t7356s0§(§1t9426s0§) < 9) { §1t9713s0§(§1t9426s0§,1); }
- **Overturns:** "**`MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT.** The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th); film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** L11 / L10 — restores two config values to CONTRACT. DAN is stored 0–9 and displayed as DAN+1, with the literal string "10" hard-coded on the final tier, i.e. ten ranks. It also exposes an internal ledger contradiction: §3 #7 claims 'film shows a flat +25 gold' while §4 rebirth-elements says the rebirth UI was 'never filmed — both longplays pre-rebirth'. Bonus: QueryManagerBase.as:2674 gives leaderboard effective level = level + Dan×80 (max 800). Android v0.682 paid +5/+20 — web wins.

### `progression/def-flat-subtraction` — HELD [A2] ⚑ OVERTURNS LEDGER

DEF has no mitigation curve — it is flat subtraction with a Heavy-stance defender ×0.8 penalty and a damage floor keyed to the ATTACKER's level in four bands.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3415 and :3709 (application), :3231-3237 (getDefense), Damage.as:150-172 (floor)`
- **Quote:** damage -= this.getDefense();
if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
…
internal function getDefense() : int { if(this.stance == HEAVY_STANCE) { return defense * 0.8; } return defense; }
…
if(this.attackerlvl <= 10) { return 1 + this.piercingDamage; }
if(this.attackerlvl <= 20) { return this.attackerlvl / 8 + this.piercingDamage; }
if(this.attackerlvl <= 30) { return this.attackerlvl / 6 + this.piercingDamage; }
return this.attackerlvl / 4 + this.piercingDamage;
- **Overturns:** "① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — *measure per-point deltas in a build.*"
- **Lane impact:** L10 / L5 — half of blocker ① closed. Effective damage = max(raw − defense[×0.8 if defender Heavy], attackerLevelFloor + piercing). One DEF point is worth exactly 3 flat damage all the way to 271. Also corrects items-equipment's 'defense min-floor (EnemyLevel/4)': that is only the ≥31 band, and the divisor keys off the attacker.

### `progression/first-run-sp-79` — HELD [A2] ⚑ OVERTURNS LEDGER

First-run skill points are 79, not 80: a new character starts with 0 SP and gains exactly 1 per level-up across 79 level-ups; what the player also gets is 7 free rank-1 skills, not a skill point.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:711 (init) + reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2072-2075 (levelUp)`
- **Quote:** setPlayerStats(STAT_SKILLPOINTS,0);   …   §1t9713s0§(§1t9418s0§,1);   // SKILLPOINTS +1 per level
- **Overturns:** "80 SP first run"
- **Lane impact:** L10 / L2 — off-by-one in the skill-point budget. The 7 free starter skills are ids 1000,1001,1002,1003,1042,1049,1050 (1000/1001/1002 = Light/Balanced/Heavy stance masteries), with 1003 pre-slotted in hotbar slot 0.

### `progression/mob-level-scaling-1hp` — HELD [A2] ⚑ OVERTURNS LEDGER

Cross-lane: enemy level→stat scaling is a multiplicative rescale of the npcdata base row (×0.9 below level 21), and everything at level ≤10 is hard-clamped to exactly 1 HP / 1 damage / 1 defense — the code cause of the measured 'mobs die in ONE hit'.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:239-259`
- **Quote:** var factor:Number = lvl / this.level;
if(lvl <= 20) { factor *= 0.9; }
this.level = lvl;
this.damage *= factor;  this.defense *= factor;  maxhp *= factor;  setHP(maxhp);
this.xp = lvl * 2 + 20;
if(lvl <= 10) { this.damage = 1; this.defense = 1; maxhp = 1; setHP(maxhp); }
- **Overturns:** "① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred). ② per-enemy HP."
- **Lane impact:** L4 — closes enemies-ai blockers ① and ②. Payload and the SESSION 11 frame measurement agree, so nothing is in conflict here. It also means npcdata.xml's 403 <hp> rows are BASE rows to be rescaled, not final HP, and it condemns the shipped AI_TIERS/ENEMY_BASE 'hp 150' duel dummy.

### `progression/per-point-ap-is-5` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Per-point magnitudes in the live web payload are +10 HP / +5 Chi / +5 AP / +3 ATK / +3 DEF / +3 SPD — the ledger's '+1AP' is wrong; the other three fragments are confirmed.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3390-3444 (click handlers) and :3447-3466 (the build's own reverse-division audit)`
- **Quote:** _loc1_ += (§1t9714s0§(§1t9403s0§) - 10) / 10;   // (MAXHP - 10) / 10
_loc1_ += (§1t9714s0§(§1t9406s0§) - 10) / 5;    // (MAXCHI - 10) / 5
_loc1_ += (§1t9714s0§(§1t9415s0§) - 30) / 5;    // (MAXAP - 30) / 5
_loc1_ += (§1t9714s0§(§1t9408s0§) - 1) / 3;     // (ATTACK - 1) / 3
- **Overturns:** "+10HP/+5Chi/+1AP/+3-stat per point"
- **Lane impact:** L10 — one config value changes (AP +1 → +5). Critically, the Android v0.682 bundle has an OLDER table (+5 HP / +1 AP / +1 ATK, caps charlevel+10): a surveyor reading only the Android bundle would have 'disproven' the ledger and shipped the wrong numbers. The web payload is the version the longplays ran, so it wins — and it vindicates §3 correction #11's '+3', while showing the A-21 '+1' was a real v0.682 value, not a misread.

### `progression/post-rebirth-sp-economy` — HELD [A2] ⚑ OVERTURNS LEDGER

The post-rebirth SP economy is fully held: skill points compound as (level − 1) + Dan × 79, while stat points reset to (level − 1) × 3 with no Dan term at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2598 (SP) and :2577 (stat points); named twins StatsManager.as:2156 and :2136`
- **Quote:** setPlayerStats(STAT_SKILLPOINTS,getLevel() - 1 + getPlayerStats(STAT_DAN) * (levelCap - 1));  …  setPlayerStats(STAT_STATPOINTS,(getLevel() - 1) * 3);
- **Overturns:** "③ post-rebirth SP economy;"
- **Lane impact:** L10 / L11 — closes blocker ③ outright. At L80 Dan 9 that is 790 skill points and still only 237 stat points. The skills-compound / stats-don't asymmetry is the entire mechanical point of rebirth.

### `progression/skill-unlock-cadence` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Skill unlock levels are A2-sourced from skilldata.xml <lvlreq>, but the ledger's 'ending 0 / ending 5' cadence has three real exceptions and is a mnemonic, not a spec.

- **Cite:** `reference/extracted/skilldata.xml:257 (and 32 further <lvlreq> rows; index docs/gauntlet/L0/index/skilldata.json path skilldata/skill/lvlreq, count 33, range 3–80)`
- **Quote:** <lvlreq>3</lvlreq>   (skill id 1004, category 5, a passive)
- **Overturns:** "skills unlock at levels ending 0 (Ninja) / 5 (Chi)"
- **Lane impact:** L2 / L10 — category 4 runs 5,15,25,35,45,50,55,65,75 (id 1069 breaks it at 50); category 6 runs 10,15,20,30,40,50,60,70,80 (id 1024 breaks it at 15); category 5 passives are 3,5,5,5,5,5,5; elemental categories 7–10 are 20 and 50. Names remain blocked — <displayname> is a numeric id 6000–6141.

### `progression/spd-transfer-functions` — HELD [A2] ⚑ OVERTURNS LEDGER

All three SPD transfer functions are held — slash-meter capacity 48 + SPD×6, skill cooldown 1 − min(SPD,600)/600×0.5, and base slash reach 120 + floor((90 + Dan×5) × SPD/(20+SPD)) px — the last of which is L5's missing reach cap in pixels.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2276 (reload), :2289-2295 (cooldown), :2344-2347 (reach); named twins StatsManager.as:1839-1842, 1854-1860, 1915-1919`
- **Quote:** return 48 + (§1t7356s0§(§1t9410s0§) + §1t7358s0§(§1t9410s0§)) * 6;
…
if(param1 > 600) { param1 = 600; } return 1 - param1 / 600 * 0.5;
…
var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5; return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** L5 headline unblock + L10 blocker ①(b). Reach is ONE SPD/Dan-driven base length with stance multipliers (MCSPlayer.as:3030/3041/3052: Light ×1.5, Balanced ×(1+0.005·mastery), Heavy ×(0.5+0.005·mastery) clamped to ≥100), NOT three fixed per-stance reaches — so the shipped STANCE_TABLE 300/200/120 is the wrong model. A level-1 starter (SPD 1, Dan 0) is base 124 px → Light 186 / Balanced 124 / Heavy 100, in native 800×480 stage px (StatsManager.as:80-82). VERSION FLAG: the Android v0.682 build caps the cooldown at SPD 300, the live web payload at 600 — web wins.

### `progression/string-table-located-not-held` — STILL_UNHELD [A2] ⚑ OVERTURNS LEDGER

The string table is named, formatted and located — shs3_en.xml, fetched at runtime over HTTP from <server>/strings/ or ./data/ — and is provably NOT inside anything we hold, so every progression-facing NAME remains unheld.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/LangManager.as:38, 56-58 and :73-78; file-id reservations at StatsManager.as:62-66 vs :70/:72`
- **Quote:** var server:String = "./data/";
…
Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");
Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");
…
var output:String = Locale.loadStringEx(num.toString(),language);
- **Overturns:** "item/skill/npc <name>, <desc>, <displayname> and cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED."
- **Lane impact:** L1b — the strings themselves are still unheld and I claim nothing about their content. What IS now held is the file's name, format, loader and the proof it was never bundled: FILE_LANG_EN=15/ZHCN=16/JA=17 sit OUTSIDE both xmlFileIdArray (0–9) and resourceFileIdArray (10–14). L1b should hunt Wayback for strawhatsamuraiduels.com/strings/shs3_en.xml, not keep grepping the payload. Blocks Dan titles (456–467), level-up dialog copy (119,120,133–136), all skill displaynames (6000–6146). NOT blocked: quest <title>/<stitle> are plain English inline (questdata.xml:409-410).

### `progression/xp-curve-l11-80` — HELD [A2] ⚑ OVERTURNS LEDGER

The complete 99-entry character XP threshold table is on disk verbatim in both the web and Android payloads, so the L11–80 curve is not unrecoverable and needs no extrapolation.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t29s0§.as:28 (byte-identical at §1t1523s0§.as:364 and, named, at reference/decompiled/shs3_android_payload/scripts/StatsManager.as:78)`
- **Quote:** public static const §1t5923s0§:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,43500,49850,56550,63900,71900,80300,89100,98300,108000,118300,129300,141100,154100,168100,183100,199100,216100,234100,253100,273100,294100,316100,339300,363300,389300,416800,445800,475800,507300,540300,574300,610300,647800,685800,725800,767800,812300,859300,908300,959300,1012300,1067300,1124300,1183300,1244800,1307800,1372800,1439800,1508800,1578800,1651800,1728800,1808800,1892800,1980800,2071800,2166800,2276800,2404800,2544800,2699800,2862800,3032800,3212800,3400800,3595800,3795800,4025800,42
- **Overturns:** "**L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L10 — the single highest-value progression unblock: level 11 = 31,400 XP … level 80 (cap) = 4,025,800 XP, every threshold exact. Zero INFERRED XP values remain. Also deletes the matching §6 'structurally UNRECOVERABLE' bullet.

### `progression/xp-income-model` — HELD [A2] ⚑ OVERTURNS LEDGER

The full XP-income model is held: base mob XP = mobLevel×2+20, scaled by a level-difference formula with a grey-out cutoff, a +3-level ceiling, elite ×2 and buff ×1.5, plus 69 hand-tuned quest reward rows.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NPC.as:218,252 (base xp), :166-189 (calcXP), :94-110 (grey level), :112-163 (zero-difference), LootDialog.as:640-644 (buff+cap gate); reference/extracted/questdata.xml:215 (quest exp)`
- **Quote:** this.xp = this.level * 2 + 20;
…
if(mobLevel <= getGreyLevel()) { return 0; }
if(mobLevel - playerLevel > 3) { return 0; }
var finalXP:int = xp;
if(playerLevel < mobLevel) { finalXP = xp * (1 + 0.05 * (mobLevel - playerLevel)); }
else if(playerLevel > mobLevel) { finalXP = xp * (1 - (playerLevel - mobLevel) / getZeroDifference()); }
if(elite) { finalXP *= 2; }
…
      <exp>290</exp>
- **Overturns:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** L10 — blocker ④ closed. Quest XP is 69 <exp> rows with only 10 distinct values (1000×27, 2000×19, 600×8, 500×3, 250×3, 200×3, 3000×2, 100×2, 750×1, 290×1) — a hand-tuned tier ladder, not a formula. Survival mode halves XP (LootDialog.as:687-690); XP stops entirely at levelCap.

### `progression/hud-hp-chi-frame` — HELD [A1]

A1 frame corroboration: the overworld HUD shows HP 20/20 and Chi 10/10 as two small integer meters, confirming the Chi base of 10 and killing any 100-scale meter model — but the frame alone cannot settle the per-point HP magnitude, so the payload decides it.

- **Cite:** `reference/frames/session11/lead/t583.65_overworld-heavy-stance-hud.png — 1920×1080, crop x=0, y=0.72·H, w=0.45·W, h=0.28·H (bottom-left HUD), upscaled 2.6× lanczos`
- **Quote:** Visibly in the crop: a green bar reading '20 / 20', a blue bar reading '10 / 10', the caption 'HEAVY STANCE', and a red-ringed straw-hat portrait.
- **Overturns:** "start pools (HP10/Chi10/AP30)"
- **Lane impact:** L10 / L8 — the blue 10/10 is the untouched Chi base. The green 20/20 is 10 + one +10 HP point under the web table, but reads equally as 10 + two +5 points under Android v0.682, so I state plainly that the frame is CONSISTENT with, not decisive for, P-03; the payload is what settles it. The frame does independently confirm §3 correction #5 (small integer meters, not a fabricated 100-max).

### `progression/level-up-grants` — HELD [A2]

A level-up is a four-resource event — +1 skill point, +3 stat points, full HP and Chi (gear bonuses included), full AP, and duel tokens reset to max — two of which the ledger omits.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2072-2082; named twin reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1646-1671; UI text at LevelUpDialog.as:54-55`
- **Quote:** changeStat(STAT_SKILLPOINTS,1);
changeStat(STAT_STATPOINTS,3);
setStat(STAT_LEVEL,getLevel());
…
fullHealth();
setStat(STAT_AP,getPlayerStats(STAT_MAXAP));
setStat(STAT_DUELTOKENS,MAXDUELTOKENS);
- **Overturns:** "+3 stat/+1 skill/full refill per level"
- **Lane impact:** L10 — expands the Ready bullet. Also: the Android build has an autoAssignStats round-robin auto-spend branch (StatsManager.as:1655-1682) that the web build does NOT have — do not port it.

### `progression/second-mastery-xp-curve` — PARTIAL [A2]

A second, 11-entry XP curve capped at tier 10 exists only in the live web payload and belongs to no ledger system; the strong reading is per-stance mastery XP, but I could not resolve the branch key so I do not assert it.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t29s0§.as:30, with the tier max at :20 and the lookup at :297`
- **Quote:** public static const §1t12498s0§:Array = [0,300,900,2100,4800,10200,21000,42600,85800,172200,345000];   …   public static const §1t12495s0§:int = 10;   …   while(_loc4_ <= §1t12495s0§)
- **Lane impact:** L10 / L5 — a whole second progression axis absent from all 12 ledger systems. grep across reference/decompiled/ returns ONE hit (web payload only), so it postdates the Android v0.682 build. The class declares exactly four pool ids (0–3): character XP plus three others, and masteries 1000/1001/1002 drive slashLength and gate canLaunch/canDeflect/canAirCombo (MCSPlayer.as:3166-3184). I am confident about the array and its max tier, NOT about the pool identity — recorded PARTIAL rather than asserted.

### `progression/stance-counter-triangle` — HELD [A2]

Cross-lane: the stance counter-triangle is a concrete ×1.2 damage relation in code — Balanced beats Light, Heavy beats Balanced, Light beats Heavy — applied before the flat DEF subtraction.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3701-3707, with the attacker/defender direction fixed by :3654`
- **Quote:** var enemyStance:int = damageObj.stance;
…
if(this.stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE || this.stance == BALANCED_STANCE && enemyStance == HEAVY_STANCE || this.stance == HEAVY_STANCE && enemyStance == LIGHT_STANCE)
{
   damage *= 1.2;
- **Lane impact:** L5 — a combat multiplier that appears in NO §4 block. §3 has a frame note (t396.0_counter-triangle.png) but never a number. Beheading adds a further damage *= 1.5 at :3716.

### `progression/start-pools` — HELD [A2]

Start pools are HP 10 / Chi 10 / AP 30 as the ledger says, plus three it omits — ATK, DEF and SPD all base 1, which is what makes the 271 cap read as 1 + (level+10)×3.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:693-712 (new character) and :2117-2137 (respec re-asserts the same bases)`
- **Quote:** setPlayerStats(STAT_HP,10);      setPlayerStats(STAT_MAXHP,10);
setPlayerStats(STAT_CHI,10);     setPlayerStats(STAT_MAXCHI,10);
setPlayerStats(STAT_ATTACK,1);   setPlayerStats(STAT_DEFENSE,1);  setPlayerStats(STAT_SPEED,1);
setPlayerStats(STAT_AP,30);      setPlayerStats(STAT_MAXAP,30);
- **Overturns:** "start pools (HP10/Chi10/AP30)"
- **Lane impact:** L10 — canonical base vector is 10/10/30/1/1/1. Cross-lane flag for L10-economy: the same block sets STAT_GOLD=100 and STAT_HGOLD=0, which does not match the ledger's '100c/3g guest start' — the 3g half is unsourced by this build.

### `progression/web-payload-is-decompiled` — HELD [A3]

Meta-correction for the whole L0 run: the L0 economy lane's provenance caveat that the web payload is 'not decompilable' with 'zero game-logic classes' is false — 570 of its 652 files are obfuscated-name game logic, including a 6,236-line StatsManager.

- **Cite:** `shell verification against reference/decompiled/shs3_payload/scripts/ (three commands, output pasted below); the file in question is §1t1523s0§.as`
- **Quote:** $ ls reference/decompiled/shs3_payload/scripts/ | wc -l          → 652
$ ls reference/decompiled/shs3_payload/scripts/ | grep -c "^§1t" → 570
$ wc -l "reference/decompiled/shs3_payload/scripts/§1t1523s0§.as" → 6236
- **Lane impact:** ALL LANES — every L0 system survey that caveated its A2 cites as 'Android v0.682 only, may have been rebalanced' can now cross-check against the LIVE payload. The Android bundle is the Rosetta Stone: its stat-index table (StatsManager.as:170-220, STAT_MAXHP=1 … STAT_DAN=25) matches the web build's const block (§1t1523s0§.as:206-254) index for index. This survey found three real v0.682→live divergences (AP +1→+5, ATK/DEF/SPD +1→+3, cooldown cap 300→600, rebirth gold +5/+20→+25/+100) that an Android-only read would have shipped wrong. Residual honesty caveat: the live manifest stamps the payload v0.706 while the preloader stamps v0.717 (reference/preservation/shs3_payload_version.swf; A1 p0_ruffle_titlescreen.png), so it is 'the last live payload', not provably the filmed build.

## quests-story — re-scored 85

42 → 85. The ledger's headline claim for this system — that the script is gone — is false: 40,013 words of final English text sit on disk, along with all 14 chapters, 225 steps with coords, the 471-choice branch graph, the 15-verb cutscene director, per-chapter XP/loot, and the whole quest runtime as decompiled AS3 (QuestEngine, QuestGenerator, QuestLogUI, QuestDialogueUI, CutsceneManager). Blockers ①②③ are closed outright; ④ is downgraded from an unanswerable blocker to a query over held data (answer: 122 of 195 option blocks write divergent state, but the headline Prologue toll choice is cosmetic). Not 100 because three named external files remain unfetched: shs3_en.xml (59 NPC nameplates + 9 cutscene bubble strings) and imageresource.swf (67 portraits + 14 chapter splash cards). Nothing in this system is genuinely lost. Two of those three now have exact filenames and URL constructions, which is a different situation from "not located".

### `quests-story/archetypes-are-generated` — HELD [A2] ⚑ OVERTURNS LEDGER

The Ready bullet's archetype taxonomy is the wrong shape twice over: the real enum is QuestType's 9 named constants (questdata uses only StoryQuest ×37, Dialogue ×22, NormalSideQuest ×2), and the bounty/escort/gather/trade side quests are not authored data at all — they are composed at runtime by QuestGenerator.as from 17 QUEST_* templates × 20 REASON_* motives.

- **Cite:** `reference/decompiled/shs3_android/scripts/QuestType.as:5-21; QuestItem.as:26-58 and :60-98; QuestGenerator.as:925-938 (3,766 lines total)`
- **Quote:** public static var NormalSideQuest:int = 0;
      public static var RepeatableSideQuest:int = 1;
      public static var StoryQuest:int = 2;
      public static var DailySideQuest:int = 3;
      public static var Dialogue:int = 4;
      public static var ClanQuest:int = 5;
      public static var OngoingQuest:int = 6;
      public static var HighLvlQuest:int = 7;
      public static var LowLvlQuest:int = 8;
- **Overturns:** "archetype taxonomy (story/normal/trade + bounty/escort/gather/timed)"
- **Lane impact:** L1 CAMPAIGN scope change the ledger does not anticipate: side quests need a GENERATOR port, not a table port. Its literal English strings ('Ah yes! I have been looking for this.', 'Get X for Y') are already on disk and pass through getQuestString verbatim.

### `quests-story/choice-consequence` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Blocker ④ is no longer a blocker but a query over held data, and the honest answer is "sometimes": all 471 choices carry <goto> and all 196 option blocks branch to ≥2 targets, 122 of 195 simulated blocks reach divergent outcome sets, yet the headline Prologue toll choice is purely cosmetic — both branches converge on label2 and fire the identical outcome.

- **Cite:** `reference/extracted/questdata.xml:146-185 (the convergent case); :2178-2184 (a state-gated choice); XMLQuestOutcome.as:applyOutcome for the state-write path`
- **Quote:**       <option>
        <id>-2</id>
        <choice>
          <text>I'll stand my ground and ask them to leave me alone.</text>
          <goto>9</goto>
        </choice>
        <choice>
          <text>They'll get nothing from me!</text>
          <goto>15</goto>
        </choice>
      </option>
      ...
      <label>label2</label>
      <outcome>
        <id>111</id>
        <set>5</set>
        <end>0</end>
      </outcome>
- **Overturns:** "④ are player choices consequential?"
- **Lane impact:** L1 CAMPAIGN: implement the branch graph literally (goto = index into the intro child list, per CutsceneManager.gotoStep's `currentDisplayNo = goto`, with <label> jumps) rather than assuming either 'all cosmetic' or 'all consequential'. L1's gate '471 choices branch' is measurable.

### `quests-story/coords-tabled` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ③'s "coords" is closed: every one of the 225 steps carries both <node> and <roomobj><room> — 51 distinct world nodes, 29 rooms, 14 teleportnode/teleportposx pairs, plus 348 per-object <x> placements spanning −1000…5000.

- **Cite:** `reference/extracted/questdata.xml:14-20`
- **Quote:**   <step>
    <node>8382465</node>
    <roomobj>
      <room>0</room>
      <id>39</id>
      <name>_storystart</name>
    </roomobj>
- **Overturns:** "③ per-quest trigger types + coords + rewards (sampled, not tabled)."
- **Lane impact:** L1 CAMPAIGN + L9 WORLD: the 51 quest node ids are a hard seed for the room graph / map topology that L9 currently treats as unsourced.

### `quests-story/ep4-12-shipped` — HELD [A2] ⚑ OVERTURNS LEDGER

Ep4–12 + Epilogue were not "likely never shipped" — they are the bulk of the game: 1,788 dialogue lines against Ep1–Ep3's 495, with Episode 7 alone (322 lines, 18 steps) larger than Episodes 1 and 2 combined.

- **Cite:** `reference/extracted/questdata.xml:24867 (Episode 12); chapter table parsed from quest-level <title> at lines 2,2263,2576,3469,5121,6865,8518,9332,10810,12795,15424,17277,20802,23077,24867,27345,27695`
- **Quote:**   <title>Episode 12</title>
- **Overturns:** "Only Prologue–Ep3 are documented/reachable; Ep4–12 were likely never shipped. **Scope decision:** faithful campaign = Prologue–Ep3, with Ep4–12 labeled canonical-but-unshipped."
- **Lane impact:** L1 CAMPAIGN: the §3 scope decision must be reversed — building 'Prologue–Ep3 only' would discard 78% of a campaign that is already on disk. L1's gate 'Prologue→Ep12→Epilogue playable end-to-end' is achievable from A2 alone.

### `quests-story/haikus-frame-only` — PARTIAL [A1] ⚑ OVERTURNS LEDGER

The "+ haikus" Ready bullet is held ONLY in the video frames, never in the payload: the chapter cards are <img>_episodeN</img> art symbols with no text node, so the text is baked into artwork living in the external imageresource.swf. Where the measurement doc and the frame disagree about where this content lives, THE FRAME WINS — and here the frame is the sole holder.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0006.jpg — source 1024×576, whole frame downscaled to 900 px wide (text is full-screen, no crop needed); cross-checked against reference/extracted/questdata.xml:30-32 which carries <img>_exposition</img><img>_episode0</img> and no text`
- **Quote:** Visibly in the crop: white brush-face capitals over a dark red silhouette of a samurai on a ridge — "THE DAIMYO OF THE SHIRA TANCHO, LORD MASAHIRO, / HAS RULED AS SHOGUN FOR FIVE YEARS, / BRINGING STABILITY TO A LAND ONCE WRACKED BY CONFLICT. // HOWEVER DARK CLOUDS GATHER AT THE EDGE OF THE EMPIRE, / THREATENING AN END TO THIS HARD-WON PEACE. // SETTING OFF ON YOUR WARRIOR'S PILGRIMAGE, / YOU ARE TRAVELING EAST IN ACCORDANCE WITH / YOUR SENSEI'S INSTRUCTIONS TO FIND A MAN NAMED HIROSHI,"
- **Overturns:** "full Season-1 (Prologue–Ep3) step chains + haikus"
- **Lane impact:** L1 CAMPAIGN: 14 splash cards become 14 frame-transcription jobs, not a payload port. Typeface is the Edo SZ face already identified by Stage-0 finding S0-2.

### `quests-story/player-is-not-satoshi` — HELD [A2] ⚑ OVERTURNS LEDGER

The "player named Satoshi" contradiction is resolved definitively: dialogue <id>-2</id> is the player, rendered with the player's own charname and paperdoll bust, and speaks 556 of the 2,771 lines; Satoshi is a separate NPC with 385 portrait-tagged lines.

- **Cite:** `reference/decompiled/shs3_android/scripts/QuestDialogueUI.as:46-52; speaker histogram parsed from reference/extracted/questdata.xml`
- **Quote:** if(ID == -2)
         {
            this.npcName.text = StatsManager.charname;
            if(portrait == "")
            {
               this.bust.initMCSFromPlayer();
            }
         }
- **Overturns:** "the +3-stat and "player named Satoshi" contradictions are already resolvable"
- **Lane impact:** L1 CAMPAIGN: the dialogue box must composite the player's live paperdoll as a bust for 556 lines — a render requirement, not just a text one. Corroborated by A1: the player nameplate in reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0016.jpg reads GUEST.

### `quests-story/procgen-reward-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

"9 reward tuples" is a floor — the procedural side-quest economy is a closed-form function of node level, repeated verbatim at eight sites in QuestGenerator.as.

- **Cite:** `reference/decompiled/shs3_android/scripts/QuestGenerator.as:2105 and :2110 (repeated at 2266/2271, 2417/2422, 2587/2592, 2790/2795, 2986/2991, 3238/3243, 3402/…); prosperity payout at :850 and :921`
- **Quote:** questReward = (StatsManager.getXPLevelThreshhold(nodelvl + 1) - StatsManager.getXPLevelThreshhold(nodelvl)) / ((nodelvl + 1) * 1.2);
         questCoinReward = nodelvl * 5;
- **Overturns:** "9 reward tuples"
- **Lane impact:** L10 ECONOMY: closes the quest-side of the XP/coin faucet with an exact formula rather than a sampled tuple set; combines with expArray (QS-03) to make side-quest income fully computable.

### `quests-story/questlog-cap-gloss-wrong` — HELD [A2] ⚑ OVERTURNS LEDGER

QUEST_LOG_CAP = 7 is confirmed, but the ledger's "(1 story + 6 side)" gloss is wrong: it is one pooled cap with no reserved story slot, and story progression through setActiveQuest pushes unconditionally, bypassing MAXQUESTS entirely.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:164 (the constant), :1262 (the only gate), :1276-1301 (setActiveQuest, no gate)`
- **Quote:** internal static var MAXQUESTS:int = 7;   …   if(activeQuestList.length < MAXQUESTS || forceAdd)
- **Overturns:** "QUEST_LOG_CAP = 7 (1 story + 6 side)."
- **Lane impact:** L1 CAMPAIGN quest-log model. Also supersedes docs/research/video-study/SYNTHESIS.md:612 which carries `QUEST_LOG_CAP | ≥7 (exact unknown) | INFERRED` — that row becomes CONTRACT.

### `quests-story/rewards-tabled` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ③'s "rewards" is closed: 69 <exp> rows and 19 <loot> rows table the full campaign — Prologue 2,940 XP through Episode 12's 8,000, totalling 79,890 XP, with qty=−1 loot rows decoding as turn-in consumption.

- **Cite:** `reference/extracted/questdata.xml — 69 reward/exp + 19 reward/loot nodes, aggregated per quest (see journal §2 QS-08 table)`
- **Quote:** exp values are the 10-member set {100,200,250,290,500,600,750,1000,2000,3000}; per-chapter totals Prologue 2940 · Ep1 3750 · Ep2 5000 · Ep3 3800 · Ep4 5000 · Ep5 8000 · Ep6 9000 · Ep7 7000 · Ep8 5000 · Ep9 8000 · Ep10 8000 · Ep11 6000 · Ep12 8000
- **Overturns:** "③ per-quest trigger types + coords + rewards (sampled, not tabled)."
- **Lane impact:** L10 PROGRESSION+ECONOMY: 79,890 XP of campaign income against expArray lands the player near level 39 — a hard constraint on the XP-income model the ledger lists as blocker ④ for progression.

### `quests-story/story-art-not-held` — HELD [A2] ⚑ OVERTURNS LEDGER

OVER-CLAIM: "character roster + roles" holds the roster but not the art — questdata names 68 portrait tokens, but getPortrait loads 'portrait_'+id from the external imageresource.swf, and payload.xml contains exactly one real portrait symbol (portrait_kojuro). 67 portraits and 14 chapter splash cards are absent from everything we hold.

- **Cite:** `reference/decompiled/shs3_android/scripts/ResourceManager.as:286-294 and :41; reference/extracted/payload.xml:111136 (the sole portrait_ symbol)`
- **Quote:** internal static var resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"];
- **Overturns:** "quest-log UI + data model; archetype taxonomy (story/normal/trade + bounty/escort/gather/timed); turn-in modal chain; 9 reward tuples; full Season-1 (Prologue–Ep3) step chains + haikus; character roster + roles; plot spine"
- **Lane impact:** L1 CAMPAIGN gains an art blocker the ledger never listed. Free win for L7 AUDIO: the same array names musicresource.swf and soundresource.swf, giving §6's 'exact SFX & music params' bullet a named target file — I claim the names only, not that the files are obtainable.

### `quests-story/string-table-located` — HELD [A2] ⚑ OVERTURNS LEDGER

GAUNTLET §2.1's "a string table that has not been located" is overturned — the table is shs3_en.xml (plus _fr, _es, _zh-CN), served from PlayerIO gameFS /lang/ under a known game id. It is external to the payload by design, which is why bindata/ and ui_strings.txt were always going to come up empty.

- **Cite:** `reference/decompiled/shs3_android/scripts/LangManager.as:55-57 and QueryManagerPIO.as:109-116 and :41; corroborated in the payload's own constant pool at reference/extracted/payload.xml:118534-118537`
- **Quote:** return PlayerIO.gameFS(this.gameid).getUrl("/lang/");   …   public var gameid:String = "straw-hat-samurai-duels-5nsekxalfuoiuqdxrmtxw";   …   Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");
- **Overturns:** "They index a **string table that has not been located.** `ui_strings.txt` is **not** it … candidate homes are the remaining `bindata/*.bin` …, `payload.xml`, and the decompiled AS3"
- **Lane impact:** L1b STRING TABLE changes shape entirely: stop searching the payload, fetch one named file from the same PlayerIO CDN Stage-0 already proved still serves shs3_payload.swf. This unblocks L2 (skill names) and L3 (item names). I claim the name and URL construction only — I did not fetch the file.

### `quests-story/text-is-final-not-keys` — HELD [A2] ⚑ OVERTURNS LEDGER

The 3,307 <text> values are FINAL displayable strings, not string-table keys — proven by the game's own loader contract, not by eyeball: getQuestString returns the literal unless it begins 'ID', and 0 of 3,307 do (0 numeric, 0 empty, mean length 64.8 chars).

- **Cite:** `reference/decompiled/shs3_android/scripts/LangManager.as:93-98`
- **Quote:** public static function getQuestString(id:String) : String
      {
         if(id.charAt(0) != "I" || id.charAt(1) != "D")
         {
            return id;
         }
- **Overturns:** "① **verbatim dialogue — captured NOWHERE** (study policy + no wiki transcripts) — *transcribe from a preserved build, IF it loads offline; else original-author to the summaries.*"
- **Lane impact:** L1 + L1b: upgrades GAUNTLET §2.1's ✅ bullet from 'verified by eye' to a mechanism proof, and defines exactly which fields elsewhere in the payload are gated (only ID-prefixed or numeric ones).

### `quests-story/trigger-types-decoded` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ③'s "per-quest trigger types" is closed: 215 of 225 steps carry <action>, decoding against GameEngine's 15-value enum to 169 ACTION_NOTHING / 37 ACTION_FIGHT / 5 ACTION_DUEL / 3 ACTION_SURVIVECLEANUP / 1 ACTION_SURVIVE.

- **Cite:** `reference/decompiled/shs3_android/scripts/GameEngine.as:81-109; values tabulated from reference/extracted/questdata.xml (first occurrences L21, L73, L1687, L11675, L26086)`
- **Quote:** internal static var ACTION_NOTHING:int = 0;
      internal static var ACTION_FIGHT:int = 1;
      ...
      internal static var ACTION_DUEL:int = 6;
      ...
      internal static var ACTION_SURVIVECLEANUP:int = 14;
- **Overturns:** "③ per-quest trigger types + coords + rewards (sampled, not tabled)."
- **Lane impact:** L1 CAMPAIGN: the quest state machine's step-dispatch switch is fully specified, including 10 enum members the campaign never uses (ASSASSINATE, ESCORT, REACHMARKER, HARVEST, SURVIVALMODE…) that other lanes will need.

### `quests-story/verbatim-script-held` — HELD [A2] ⚑ OVERTURNS LEDGER

§6's flagship "structurally UNRECOVERABLE" entry is false: the complete campaign script — 2,771 dialogue blocks, 36,828 words of dialogue, 40,013 words across all 3,307 <text> nodes — is byte-present in questdata.xml today.

- **Cite:** `reference/extracted/questdata.xml:169 (and :128); counts parsed across all 27,734 lines`
- **Quote:** <text>WHAT–?! You dare defy Jinbei the Bandit King, the greatest highwayman that ever lived?!</text>
- **Overturns:** "**Verbatim dialogue** — if the story is server-fetched and the server is dead, the actual script is gone; author original lines to the summaries (RECREATE-NEVER-RIP already requires original dialogue anyway)."
- **Lane impact:** L1 CAMPAIGN: its gate 'all 3,307 lines present byte-exact' is now a transform, not research — a script beats a swarm. L0 must delete this §6 bullet.

### `quests-story/xp-curve-not-unrecoverable` — HELD [A2] ⚑ OVERTURNS LEDGER

CROSS-LANE: §6's "L11–80 XP curve — no table published" is overturned — the complete 99-entry level threshold array is a literal in StatsManager.as, found while chasing this system's side-quest reward formula.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:78`
- **Quote:** public static var expArray:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,43500,49850,56550,63900,71900,80300,89100,98300,108000,118300,129300,141100,154100,168100,183100,199100,216100,234100,253100,273100,294100,316100,339300,363300,389300,416800,445800,475800,507300,540300,574300,610300,647800,685800,725800,767800,812300,859300,908300,959300,1012300,1067300,1124300,1183300,1244800,1307800,1372800,1439800,1508800,1578800,1651800,1728800,1808800,1892800,1980800,2071800,2166800,2276800,2404800,2544800,2699800,2862800,3032800,3212800,3400800,3595800,3795800,4025800,428580
- **Overturns:** "**L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."
- **Lane impact:** L10 PROGRESSION: delete the §6 bullet and progression blocker ②; the curve moves from INFERRED extrapolation to a byte-checkable A2 table. Its gate 'every curve either A2-sourced or labelled INFERRED' is now satisfiable for the headline curve.

### `quests-story/frame-payload-agree` — HELD [A1]

Frame corroboration of a Prologue step: the HUD objective ticker and the neutral spawn in the video match questdata exactly — no conflict to adjudicate between doc and frame here.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-00/frames/frame_0016.jpg — source 1024×576; crop (20,74)–(368,190) LANCZOS ×3 for the ticker, crop (614,299)–(819,472) LANCZOS ×4 for the animal; checked against reference/extracted/questdata.xml:74 and :89-94`
- **Quote:** Visibly in the ×3 crop: a parchment banner reading "W KASUTA FOREST" and beneath it "STORY QUEST: LOOK FOR A MAN NAMED HIROSHI". Visibly in the ×4 crop: one spotted sika deer, idle, facing left, standing behind a bamboo culm — a single non-hostile animal far right of the player's start. Payload: <title>Look for a man named Hiroshi</title> and <neutral><id>118</id><qty>1</qty><x>2000</x><lvl>1</lvl></neutral>.
- **Lane impact:** L1 CAMPAIGN + L8 UI: the objective ticker renders the step <title> uppercased with a 'STORY QUEST:' prefix driven by <type>2</type> = QuestType.StoryQuest — a concrete HUD contract. I do NOT claim npc 118 is named 'deer'; its <name>5033</name> is string-table-gated.

### `quests-story/residual-gap-is-nameplates` — PARTIAL [A2]

Precisely scoped residual: the campaign renders today with every line of dialogue correct and every NAMEPLATE reading '?', because XMLNpc routes <name> through the numeric LangManager.getString path — all 59 distinct story speakers are gated (Jinbei = npc 151 = <name>5078</name>), plus 16 cutscene say bubbles using ~9 distinct ids in the 9000–9009 range.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLNpc.as:127-129; QuestEngine.as:1049-1057 (returns "?" on miss); reference/extracted/npcdata.xml:2707-2708 for the npc-118 pattern; reference/extracted/questdata.xml:100-102 for the say param`
- **Quote:** this.name = LangManager.getString(xml.name);   …   <id>jinbei</id>
          <action>say</action>
          <param>9006</param>
- **Lane impact:** L1 CAMPAIGN can ship the whole campaign before L1b lands, with nameplates stubbed from the portrait tokens (which ARE literal in questdata) — the blocker is cosmetic and narrowly bounded, not structural.

### `quests-story/season2-is-a-stub` — HELD [A2]

Counterweight to the above so the correction does not over-swing: quest id 60 "Season 2" is a one-step teaser hook with zero dialogue, not a 15th chapter — the campaign ends at the Epilogue, 14 chapters.

- **Cite:** `reference/extracted/questdata.xml:27726`
- **Quote:**       <text>This episode is not yet released. Return here when the episode is released to continue the story!</text>
- **Lane impact:** L1 CAMPAIGN: build 14 chapters and a Season-2 stub screen; do not budget content for Season 2.

## rebirth-elements — re-scored 78

30 -> 78. The ledger block was written before anyone opened reference/decompiled/shs3_android_payload/ — 970 UNOBFUSCATED ActionScript classes for this exact game. Four of the block's five blockers are answered outright by files already on disk, and every answer was re-verified in the obfuscated desktop v0.717 payload (reference/decompiled/shs3_payload/) before banking. Now held: the four element identities (FIRE/WIND/WATER/EARTH = stat ids 28/29/30/31, DEF 200-203) as class constants that do NOT need the missing string table; the complete 24-skill roster keyed to SkillManager constants; every elemental Chi cost and cooldown from skilldata.xml; the damage rule (elementATK x {0.8..1.2} by level, x1.5 on ultimates, ZERO physical component); per-element AoE radii 600/400/200/50 and launch types; the mitigation formula (flat subtraction with a hard min-1 floor); the element counter-wheel (your WATER atk IS your FIRE defence, etc.); the entire rebirth transaction down to the teleport target; Dan cap 9 with 9 title strings and 3 suffix tiers; and the complete Dragon Dance input (8-node click ring, two Heavens, the {1,2,4,6} gate, RNG-permuted statue sequences, 2 AP per attempt). Not 90+ because four real gaps remain: (1) all display TEXT is an index into data/shs3_en.xml, which is named now but not on disk; (2) the element-circle ART was never filmed — I enumerated all 113 frame directories in frames.json and zero match rebirth/element/dan/statue/dragon, so the ledger's "never filmed" clause SURVIVES; (3) per-element status effects beyond launch type are unverified either way; (4) statue placement data is not yet joined to bindata/93 room-object defs. Also holding the score below 85: one of six load-bearing numbers DIVERGED between the readable v0.682 bundle and the desktop v0.717 client (heavenly gold 5/20 vs 25/100), so every number must be desktop-re-read before it reaches src/config/.

### `rebirth-elements/base-slash-length-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

CROSS-LANE: the base slash-length formula is on disk and is Dan-scaled — `120 + floor((90 + DAN*5) * SPEED / (20 + SPEED))` — answering the units question behind combat-core's headline blocker, and making rebirth the thing that raises the reach ceiling from 210 px at Dan 0 to 255 px at Dan 9.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1915-1918 (desktop confirm: reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2344-2348)`
- **Quote:** 1915:      internal static function getBaseSlashLengthVal(speed:int) : int
1917:         var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
1918:         return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
// desktop v0.717 §1t1523s0§.as:2346  var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5;  2347  return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));
- **Overturns:** "- **Blockers:** ① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** combat-core (42), via rebirth-elements: NARROWS the headline blocker rather than erasing it. The unknown scale is answered — units are stage pixels, base 120, weapon-side budget is a separate per-item `slashusage` defaulting to 48 (StatsManager.as:1921-1929). Still open: the per-stance multiplier. New and unrecorded anywhere: rebirth raises the reach ceiling, a rebirth-elements <-> combat-core link the ledger has no bullet for.

### `rebirth-elements/dan-rank-count-is-nine` — HELD [A2] ⚑ OVERTURNS LEDGER

Dan-rank count is definitively 9 (STAT_DAN is a 0-based counter hard-capped by `if(DAN < 9)`), with exactly 9 title strings 456-464 and 3 name-suffix tiers 465/466/467 in colour #7D5500; the DISPLAYED rank is DAN+1 and tops out at 10.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2209-2214 and InventoryUI.as:2274-2316 (desktop confirm: §1t1523s0§.as:2653 and §1t5957s0§.as:3062-3103)`
- **Quote:** 2209:         if(getPlayerStats(STAT_DAN) < 9)
2211:            changeStat(STAT_DAN,1);
2214:         NetworkManager.instance.globalAnnouncement("",LangManager.getString(864,[getChatDisplayCharname(),(getPlayerStats(STAT_DAN) + 1).toString()]));
// InventoryUI.as:2274  switch(StatsManager.getPlayerStats(StatsManager.STAT_DAN))  case 0: danfield.text = "";  case 1..9: getString(456..464)  case 3-5 suffix getString(465), 6-7 getString(466), 8-9 getString(467)
- **Overturns:** "- **Blockers:** ③ Dan-rank count/titles (garbled source)."
- **Lane impact:** rebirth-elements: blocker ③ half-closed — the COUNT is now CONTRACT-grade (9 stat ranks, 10 displayed), which also reconciles the 'garbled' wiki datum (kyudan=9th) with the project's MAX_DAN_RANK=10: both were right at different layers. Title TEXT stays blocked (see rebirth-elements/string-table-is-named).

### `rebirth-elements/dragon-dance-gate-is-1x-3x-6x-not-3x-6x` — HELD [A2] ⚑ OVERTURNS LEDGER

The 'Dragon Dance unlocks at 3x/6x same-element rebirths' surface note is wrong in shape: the gate is an element ATK STAT threshold at 10/30/60, and since each rebirth grants +10 (+20 at Dan 8) there are THREE tiers — 1x/3x/6x — and the 1x tier is the one that opens each element's entire usable attack kit.

- **Cite:** `reference/extracted/skilldata.xml:612 / :1658 / :1726 (qty 10/30/60 on stat id 28) with reference/decompiled/shs3_android_payload/scripts/InteractUI.as:849-855 (desktop confirm: §1t401s0§.as:873-881)`
- **Quote:** 612:		<req><has><id>28</id><qty>10</qty></has></req>
1658:		<req><has><id>28</id><qty>30</qty></has></req>
1726:		<req><has><id>28</id><qty>60</qty></has></req>
// InteractUI.as:851  StatsManager.changeStat(StatsManager.STAT_FIREATK,20);   (DAN == 8)
// InteractUI.as:855  StatsManager.changeStat(StatsManager.STAT_FIREATK,10);   (DAN < 8)
- **Overturns:** "Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking matters."
- **Lane impact:** rebirth-elements: the surface bullet is corrected, not deleted. Three consequences the ledger misses — (a) the 1x tier exists and delivers Kunai + Trap + the tier-2 attack, so the whole playable elemental kit lands on your FIRST rebirth into that element; (b) gear affixes on stats 28-31 count toward the same threshold since they are the same stat ids; (c) the Dan-8 rebirth grants +20, so the cadence is not a clean multiple of 3.

### `rebirth-elements/dragon-dance-input` — HELD [A2] ⚑ OVERTURNS LEDGER

The Dragon Dance input is fully held: an 8-node clickable ring where each click appends its digit to a sequence string and plays MCSActor.POSE1-8, with a second 'Later Heaven' ring unlocked by clicking exactly the {1,2,4,6} node set in the first four inputs.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/DragonDanceUI.as:343-355, 367-370, 283-338 (desktop confirm: reference/decompiled/shs3_payload/scripts/§1t8695s0§.as:176-216 carries the same literal sequences)`
- **Quote:** 354:         this.clickedArray[num] = true;
355:         this.sequence += num.toString();
367:         if(Boolean(this.earlierHeaven && this.sequence.length == 4) && Boolean(this.clickedArray[1]) && Boolean(this.clickedArray[2]) && Boolean(this.clickedArray[4]) && Boolean(this.clickedArray[6]))
369:            this.setLaterHeaven();
- **Overturns:** "- **Blockers:** ④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements: blocker ④ closed on the input axis. Ties straight back into the element system — the four tier-3 elemental passives 1056/1057/1058/1059 teach exactly nodes 6/2/1/4, i.e. PRECISELY the {1,2,4,6} set that unlocks Later Heaven (DragonDanceUI.as:283-338). Rebirthing into all four elements to 30 ATK owns the gate. Those eight passives are referenced by NO other file in the bundle, so this is their entire effect.

### `rebirth-elements/element-counter-wheel` — HELD [A2] ⚑ OVERTURNS LEDGER

Elements form a counter-wheel the ledger has nowhere: your WATER attack stat IS your FIRE defence, EARTH atk is WIND defence, WIND atk is WATER defence, FIRE atk is EARTH defence — so picking a rebirth element simultaneously picks what you become immune to.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1836 (desktop confirm: reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2270); parameter order from MCSPlayer.as:260`
- **Quote:** 1836:         player.initElementDefenseStats(getPlayerStats(STAT_WATERATK) + findBonusStat(STAT_FIREDEF),getPlayerStats(STAT_EARTHATK) + findBonusStat(STAT_WINDDEF),getPlayerStats(STAT_WINDATK) + findBonusStat(STAT_WATERDEF),getPlayerStats(STAT_FIREATK) + findBonusStat(STAT_EARTHDEF));
// MCSPlayer.as:260  public function initElementDefenseStats(STAT_FIREDEF:int, STAT_WINDDEF:int, STAT_WATERDEF:int, STAT_EARTHDEF:int)
- **Overturns:** "- **Surface:** elements are TWO systems (rebirth skills **and** gear ATK/DEF typing) — the gear side is measured (A-17) but never linked to the rebirth domain."
- **Lane impact:** rebirth-elements: the surface bullet asked for the missing link between the gear side and the rebirth domain — this IS the link, and it is stronger than the ledger guessed: they are not two systems but one stat set (28-31) read twice, once as offence and once as cross-element defence. Gear affixes 200-203 stack on top.

### `rebirth-elements/element-picker-ui-mechanism-vs-pixels` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The rebirth/element-picker UI mechanism is held — InteractUI mode 6, a two-state flow whose second state reveals a MovieClip literally named `elementCircle` over the player's own bust, with four dispatch actions firerebirth/windrebirth/waterrebirth/earthrebirth — but the ledger's 'never filmed' is CORRECT and stands: zero of the 113 frame directories in frames.json match rebirth/element/dan/statue/dragon.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InteractUI.as:25, 63, 171, 252-256, 551-559, 848-898; negative frame check against docs/gauntlet/L0/index/frames.json`
- **Quote:** 25:      public static var UIMODE_REBIRTH:int = 6;
63:      public var elementCircle:MovieClip;
253:               this.titleText.label.text = LangManager.getString(4154);
254:               this.bust.initMCSFromPlayer();
552:               if(this.menuState == 0)
554:                  this.detailstext.text = LangManager.getString(610);
556:               else if(this.menuState == 1)
558:                  this.detailstext.text = LangManager.getString(611);
559:                  this.elementCircle.visible = true;
- **Overturns:** "- **Blockers:** ⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."
- **Lane impact:** rebirth-elements: blocker ⑤ splits. Behaviour, state machine, widget name, bust framing and button actions are all codeable now; only the circle's ART, layout and colours remain unheld, and no frame can supply them. This is the ONE clause of the block that survives the audit intact — worth saying out loud, since the standing invariant is that the frame wins and here there is no frame to consult.

### `rebirth-elements/elemental-aoe-radii` — HELD [A2] ⚑ OVERTURNS LEDGER

Per-element AoE radii and launch types are on disk: Inferno 600, Tsunami 400, Tornado 200, Earthquake 50-per-rock, tier-2 attacks 200; Tornado alone uses LAUNCH_AIR while the other three ultimates use LAUNCH_KNOCKDOWN.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/BigFireBreathProjectile.as:32, BigWaveProjectile.as:34, BigTornadoProjectile.as:24+33, BigEarthquakeProjectile.as:68, FireBreathProjectile.as:60`
- **Quote:** BigFireBreathProjectile.as:32   NPCManager.checkHitObject(this,damageObj,600);
BigWaveProjectile.as:34         NPCManager.checkHitObject(this,damageObj,400);
BigTornadoProjectile.as:33      NPCManager.checkHitObject(this,damageObj,200);
BigEarthquakeProjectile.as:68   NPCManager.checkHitObject(this,damageObj,50);
BigTornadoProjectile.as:24      damageObj = new Damage(0,0,Damage.LAUNCH_AIR,-1,0,0,damage * 1.5);
- **Overturns:** "- **Blockers:** ① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements: blocker ① collapses on the AoE axis. These are the first real AoE numbers in the project and they are in stage px, the same unit as the slash-length formula (see rebirth-elements/base-slash-length-formula).

### `rebirth-elements/elemental-chi-and-cooldowns` — HELD [A2] ⚑ OVERTURNS LEDGER

Every one of the 24 elemental skills' Chi cost and cooldown is already in reference/extracted/skilldata.xml — Kunai 3/2, Trap 3/6, tier-2 5-6-7-8-10 chi at cooldown 15 across five levels, ultimates 50 chi / 60 s.

- **Cite:** `reference/extracted/skilldata.xml:985-995 (Kunai), :921-931 (Trap), :615-649 (tier-2), :1884-1891 (ultimate)`
- **Quote:** 985:		<id>1029</id>
988:		<req><has><id>28</id><qty>10</qty></has></req>
994:			<chi>3</chi>
995:			<cooldown>2</cooldown>
---
1884:		<req><has><id>28</id><qty>30</qty></has></req>
1890:			<chi>50</chi>
1891:			<cooldown>60</cooldown>
- **Overturns:** "- **Blockers:** ① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — *read skill cards in a preserved build.*"
- **Lane impact:** rebirth-elements AND skills-meters (33): the close-path 'read skill cards in a preserved build' is VOID — the preserved build is dead (REBUILD_READINESS §5) but the numbers never needed it. skills-meters blocker ① is answered for the whole elemental subtree without a build.

### `rebirth-elements/elemental-damage-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

Elemental skill damage is the caster's element ATK stat scaled by skill level (x0.8/0.9/1.0/1.1/1.2 for L1-5, x1.5 for ultimates) and carries ZERO physical component — the four elements are numerically mirrored and differ only in which damage channel they fill.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/FireBreathProjectile.as:19-51 (signature: Damage.as:50; caster arg: MCSPlayer.as:781)`
- **Quote:** 19:         if(skilllevel == 1) { scale = 1;   damage *= 0.8; }
...
35:         else if(skilllevel == 5) { scale = 1.4; damage *= 1.2; }
51:         damageObj = new Damage(0,0,2,-1,damage);
// Damage.as:50  public function Damage(damage:int = 0, attackerlvl:int = 0, launchType:int = 0, stance:int = -1, fireDamage:int = 0, waterDamage:int = 0, windDamage:int = 0, earthDamage:int = 0)
// BigFireBreathProjectile.as:23  damageObj = new Damage(0,0,Damage.LAUNCH_KNOCKDOWN,-1,damage * 1.5);
- **Overturns:** "- **Blockers:** ① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements: blocker ① collapses on the damage axis. GroundPunchProjectile.as:22-53 is the identical ladder writing the earth slot, so one formula covers all 24 skills. Also feeds combat-core: elemental hits bypass the physical DEF path entirely.

### `rebirth-elements/elemental-mitigation-is-flat-subtraction` — HELD [A2] ⚑ OVERTURNS LEDGER

The elemental ATK-vs-DEF formula is FLAT SUBTRACTION with a hard min-1 floor per channel, and total HP loss is physical-after-DEF plus all four elemental channels summed.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3347-3357, 3415-3420`
- **Quote:** 3347:         var fireDamage:int = damageObj.fireDamage - STAT_FIREDEF;
3351:         if(damageObj.fireDamage > 0 && fireDamage < 1)
3353:            fireDamage = 1;
3355:         else if(fireDamage < 0)
3357:            fireDamage = 0;
3420:               setHP(getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
- **Overturns:** "- **Blockers:** ② elemental ATK-vs-DEF **formula**."
- **Lane impact:** rebirth-elements: blocker ② closed. Also corrects combat-core: the elemental floor is a hard 1, a DIFFERENT mechanism from the level-banded physical getMinDamage() ladder at Damage.as:150-172 that the ledger calls the 'Undead/Red-Oni damage floor'.

### `rebirth-elements/kanji-statue-mechanics` — HELD [A2] ⚑ OVERTURNS LEDGER

The Kanji statue is held: props is the node id, props>=8 means a Later-Heaven statue whose required sequence is a map-node-seeded RNG permutation of "1246" plus the node digit; success plays a koto sting, permanently sets stat 40002+props, costs 2 AP and requires the player within 100 px.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Obj_DragonDanceStatue.as:37-62, 171-186, 214, 224-226, 238-240`
- **Quote:** 42:            rng = new RNG(StageManager.getCurrentNode());
43:            dice = rng.rand(5);
46:               sequence = "1246" + this.num;
50:               sequence = "4216" + this.num;
...
185:            StatsManager.setStat(40002 + int(props),1);
224:      override public function getAPUse() : int
226:         return 2;
238:      override public function isInInteractRange(mc:MovieClip) : Boolean  ->  return abs(x - mc.x) < 100;
- **Overturns:** "- **Blockers:** ④ Dragon Dance **input** + Kanji-statue bonus."
- **Lane impact:** rebirth-elements: blocker ④ closed on the statue axis. Also a world-exploration (35) hook: the same statue in the same map node always demands the same dance because the RNG is seeded on StageManager.getCurrentNode(), so statue placement is deterministic content — join to bindata/93 room-object defs to recover which nodes carry which statues.

### `rebirth-elements/post-rebirth-sp-economy` — HELD [A2] ⚑ OVERTURNS LEDGER

CROSS-LANE: the post-rebirth skill-point economy is held — `SP = (level - 1) + DAN * (levelCap - 1)` = (level-1) + DAN*79 — which also makes the ledger's '80 SP first run' off by one; the true first-run figure is 79.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2140-2156 (desktop confirm: reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2598)`
- **Quote:** 2156:         setPlayerStats(STAT_SKILLPOINTS,getLevel() - 1 + getPlayerStats(STAT_DAN) * (levelCap - 1));
// free, never point-costed: 2144-2150 skillStats.push(new IntStat(1000,1)); 1001; 1002; 1003; 1042; 1049; 1050
- **Overturns:** "- **Blockers:** ... ③ post-rebirth SP economy; ④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** progression (55), via rebirth-elements: blocker ③ closed outright and the Ready bullet '80 SP first run' corrected to 79. Each Dan is worth a permanent +79 SP, so a Dan-9 L80 character holds 790. Seven skills (three stances, Jump, Chi Punch, both dashes) are free and never cost points. doRebirth does NOT call unAssignSkillPoints, so spent points survive a rebirth — the formula is the respec ceiling, not an automatic grant.

### `rebirth-elements/tenth-rebirth-tier-is-real` — HELD [A2] ⚑ OVERTURNS LEDGER

§3 correction #7 is WRONG: the real v0.717 desktop client grants +25 heavenly gold per rebirth and +100 on the Dan 8->9 rebirth, broadcasting the hard-coded literal "10" — so both `tenthGold=100` and a 10th-rebirth tier are CONTRACT, not INFERRED.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651 (constants: §1t9426s0§=25=STAT_DAN at :254, §1t9413s0§=12=STAT_HGOLD at :228)`
- **Quote:** 2644:         if(§1t7356s0§(§1t9426s0§) == 8)
2646:            §1t9713s0§(§1t9413s0§,100);
2647:            §1t3318s0§.instance.§1t3409s0§(§1t1521s0§.getString(864,[§1t9765s0§(),"10"]));
2651:            §1t9713s0§(§1t9413s0§,25);
- **Overturns:** "7. **`MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT.** The only wiki datum is garbled ("dan rank 5 (kyudan)" — kyudan=9th); film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."
- **Lane impact:** rebirth-elements AND economy (48): the ledger's own §3 correction demoted two values that the shipped client hard-codes. Promote MAX_DAN_RANK and tenthGold back to CONTRACT in src/config/. The film's '+25' was the ordinary branch, correctly observed but wrongly generalised to 'no 10th-rebirth tier'.

### `rebirth-elements/android-bundle-is-a-key-not-an-authority` — HELD [A2]

METHOD: the readable shs3_android_payload bundle is clientVersion 0.682 against the desktop's v0.717, so it is a de-obfuscation key rather than an authority — five of six load-bearing cross-checks matched exactly, but the heavenly-gold grant DIVERGED (5/20 android vs 25/100 desktop) and the desktop value must win.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:30 vs :2201-2207, against reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651`
- **Quote:** 30:      public static var clientVersion:Number = 0.682;
// android StatsManager.as:2203 changeStat(STAT_HGOLD,20) / :2207 changeStat(STAT_HGOLD,5)
// desktop §1t1523s0§.as:2646 §1t9713s0§(§1t9413s0§,100) / :2651 §1t9713s0§(§1t9413s0§,25)
- **Overturns:** "(no ledger sentence — this is a claim about how much weight the other claims can bear)"
- **Lane impact:** ALL lanes that consume reference/decompiled/: names, class structure and control flow port safely from the android bundle, but every NUMBER must be re-read in shs3_payload/ before it reaches src/config/. One in six load-bearing numbers moved between 0.682 and 0.717. Any lane quoting the android bundle without a desktop confirm should be re-checked.

### `rebirth-elements/carry-items-reset-level-exact` — HELD [A2]

'carry-items-reset-level' is CONFIRMED and made exact: all 9 equipped items are moved INTO inventory (nothing destroyed) and replaced by starter gear ids 4017/11017/12017/0/13100, XP goes to 0, ATK/DEF/SPD to 1, MAXCHI 10, MAXAP 30, the hotbar is wiped to a single slot holding skill 1003, proc-gen dailies are purged, and the player is teleported to map node 8382465 at (0,200).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2195-2233 (doRebirth), :2164-2193 (unequipAll), :2117-2138 (unAssignStatPoints)`
- **Quote:** 2199:         unequipAll();
2200:         setStat(STAT_XP,0);
2217:         skillSlots[0] = new IntStat(1003,1);
2229:         unAssignStatPoints();
2230:         OverworldHUD.getInstance().screenTransition.setTeleportTarget(8382465,0,200);
// unequipAll  2176: addItemsToInventory(itemList);  2187-2191: equipItem(EQ_ARMOR,new Item(4017,1)) ... EQ_SCABBARD 13100
// unAssignStatPoints  2122: setPlayerStats(STAT_MAXCHI,10);  2125-2127: ATTACK/DEFENSE/SPEED = 1;  2134: MAXAP,30;  2135: STATPOINTS,(getLevel() - 1) * 3
- **Overturns:** "- **Ready:** ... Undead/Red-Oni damage floor; carry-items-reset-level."
- **Lane impact:** rebirth-elements: the Ready bullet becomes a complete, codeable transaction rather than a phrase. Also touches items-equipment (42) with five concrete starter-gear item ids, and world-exploration (35) with a real map-node id (8382465) — the ledger says world-exploration has 'ZERO world numbers in config'.

### `rebirth-elements/elements-are-fire-wind-water-earth` — HELD [A2]

The four elements are FIRE / WIND / WATER / EARTH, carried as ActionScript class constants (ATK stat ids 28/29/30/31, DEF stat ids 200/201/202/203), so element identity is portable TODAY without the un-located string table.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:226-232 (desktop confirm: reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:260-266)`
- **Quote:** 226:      internal static var STAT_FIREATK:int = 28;
228:      internal static var STAT_WINDATK:int = 29;
230:      internal static var STAT_WATERATK:int = 30;
232:      internal static var STAT_EARTHATK:int = 31;   // desktop v0.717: §1t1235s0§:int = 28; §1t1236s0§:int = 29; §1t1237s0§:int = 30; §1t1238s0§:int = 31;
- **Overturns:** "KNOWN BLOCKER (GAUNTLET.md §2.1): item/skill/npc <name>, <desc>, <displayname> and cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED."
- **Lane impact:** rebirth-elements (this lane): the standing string-table blocker is NARROWED, not lifted — element and skill IDENTITIES come from AS3 constants, not from <displayname>. Skill names such as SKILL_FIREBREATH/SKILL_TSUNAMI are portable now; only player-facing display TEXT is still blocked.

### `rebirth-elements/per-element-status-effects` — STILL_UNHELD [STILL_UNHELD]

Per-element STATUS effects beyond launch type are STILL_UNHELD: I read the Damage construction in all nine elemental projectile classes and found no burn/slow/root/DoT flag, only launchType and a 30-second trap lifetime — but I did not trace the buff system end-to-end, so absence is not proven.

- **Overturns:** "- **Blockers:** ① what each element **does** (24 skills' damage/cost/AoE/status — names only)."
- **Lane impact:** rebirth-elements: the 'status' quarter of blocker ① is the only part of ① that survives. Close-path: read Damage.as buff fields and the BUFF_* constants in StatsManager.as, plus NPCManager.checkHitObject. Files checked with no status flag found: FireBreathProjectile, GroundPunchProjectile, WaterSplashProjectile, KunaiProjectile, TrapProjectile (ttl = 24*30 at :24), BigFireBreathProjectile, BigWaveProjectile, BigTornadoProjectile, BigEarthquakeProjectile.

### `rebirth-elements/rebirth-trigger-item-2202` — HELD [A2]

The ledger's '1000c scroll, L80' is CONFIRMED and sharpened: the trigger is item 2202 (baseprice 1000, weight 0, name string 4154), its rebirth power is modifier id 25, and the gate is `getLevel() == levelCap` EXACTLY with a server-side reportHack("multiple rebirth") guard.

- **Cite:** `reference/extracted/itemdata.xml:2312-2324 and reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:910-921 (levelCap: StatsManager.as:76)`
- **Quote:** itemdata.xml:2312		<id>2202</id>
		<name>4154</name>
		<baseprice>1000</baseprice>
---
InventoryUI.as:910               if(modid == 25)
912:                  if(StatsManager.getLevel() > StatsManager.levelCap || StatsManager.didRebirth)
914:                     QueryManager.instance.reportHack("multiple rebirth");
917:                  if(StatsManager.getLevel() == StatsManager.levelCap)
920:                     OverworldHUD.instance.interactUI.show(InteractUI.UIMODE_REBIRTH);
// StatsManager.as:76  public static var levelCap:int = 80;
- **Overturns:** "- **Ready:** rebirth trigger (1000c scroll, L80, +25g, "next Dan rank + specialize in an element"); ..."
- **Lane impact:** rebirth-elements: the Ready bullet is upgraded from wiki-sourced to A2 payload-sourced, and gains three codeable details the ledger lacked — the exact item id, the modifier-25 dispatch, and that the level test is equality not >=. Note the scroll's second modifier (id 12 = STAT_HGOLD, value 5) is display-only: the modid==25 branch returns before the modifier loop reaches it.

### `rebirth-elements/string-table-is-named` — PARTIAL [A2]

All rebirth display TEXT (Dan titles 456-464, suffixes 465-467, rebirth-UI prompts 610/611, scroll name 4154) is still unheld — but the missing string table now has a filename: data/shs3_en.xml, fetched from the game-server strings dir.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/LangManager.as:39-56; `find reference -iname "*shs3_en*"` returns no hits`
- **Quote:** 39:         var server:String = "./data/";
55:            Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");
56:            Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");
- **Overturns:** "KNOWN BLOCKER (GAUNTLET.md §2.1): ... a string table NOT YET LOCATED. ui_strings.txt is NOT it. bindata/ is now EXHAUSTED as a candidate."
- **Lane impact:** L1b (string table lane): the search space narrows from 'somewhere' to two named files, data/shs3_en.xml and data/shs3_zh-CN.xml, off the game-server root — a concrete Wayback/CDX target. Negative-but-actionable, same shape as the S0-1 bindata exhaustion.

## skills-meters — re-scored 82

33 -> 82. All five §4 blockers are closed with A2 cites; two of four Ready bullets and one of two Surface bullets are wrong. Newly held: all 75 skills' chi/cooldown/level counts; full tree topology (10 player categories, <order>, <lvlreq> 3-80, 52 prerequisite edges); the per-stance capability ladder; the reload/Focus meter's max (5*24 frames), fill (+1/frame), bar mapping ((r-24)/(max-24)), switch gate (>= max/6) and cost, per-stance slash cost (0.5/1.0/1.5 x slashUsage), bonus refill (+6); the crit trigger (deterministic on full meter) and BOTH multipliers (x1.5 Light, x1.2 others) plus the flat STAT_CRITICALDMG gear term; the SPD->cooldown formula 1 - min(SPD,300)/300*0.5; Shunpo's full behaviour; the chi pool's start/regen/refill numbers. Held back from ~95 by exactly four things: display names/descriptions live in an external, unarchived shs3_en.xml (the only true remaining blocker); ~40 per-skill damage constants sit in unread *Projectile.as classes (mechanical, not a research gap); what Focus buys beyond charging the meter; and skill VFX/animation feel, which lives in the videos and was outside this pass. The decisive unlock was reference/decompiled/shs3_android_payload/scripts/ — a fully readable, un-obfuscated AS3 decompile of the whole game that no prior pass appears to have mined (the desktop bundle shs3_payload/ is identifier-obfuscated, e.g. §1t4906s0§.as, which likely explains the oversight).

### `skills-meters/blocker1-costs-cooldowns-held` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ① is dead: skilldata.xml carries the exact chi cost and cooldown for every skill the ledger names as unmeasurable — Smoke Bomb 1010 (chi 5/10/10, cd 6/6/5), Kunai Throw 1007 (chi 0, cd 2/2/2), Lay Trap 1024 (chi 0, cd 5/5/5) and all sixteen elemental skills — across 81 non-empty <chi> and 98 non-empty <cooldown> rows; no preserved build is needed.

- **Cite:** `reference/extracted/skilldata.xml:501-512 (Smoke Bomb), :346-356 (Kunai Throw), :890-901 (Lay Trap), :608-647 (Fire Breath); identity from reference/decompiled/shs3_android_payload/scripts/SkillManager.as:22,24,28,30`
- **Quote:** 501: <id>1010</id> / 503: <lvlreq>20</lvlreq> / 507: <category>6</category> / 511: <chi>5</chi> / 512: <cooldown>6</cooldown>  —  SkillManager.as:24 "public static var SKILL_SMOKEBOMB:int = 1010;"
- **Overturns:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — *read skill cards in a preserved build.*"
- **Lane impact:** L2 (SKILLS + METERS) — its done-criterion 'zero INFERRED cooldowns remain' is reachable today by a pure generator script over skilldata.xml; no build, no measurement pass.

### `skills-meters/blocker2-shunpo-effect` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ② is dead: Shunpo is a hold-to-charge flash-step — up to 3 s (72 frames) of charge, then a 250 px teleport in the facing direction spawning a PROJ_SHUNPOHIT volume for getDamage() × chargingTime / 2, costing 50 chi on a 60 s cooldown and requiring Light Stance ×10. The ledger's negative half (no spacebar slow-motion; that is SHS2) stands.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:1705-1706 and :1747-1752; SkillManager.as:566; reference/extracted/skilldata.xml:1235-1245`
- **Quote:** MCSPlayer.as:1706 "this.chargingTime = 3 * 24;"  |  :1751 "this.movePlayer(250);"  |  :1752 "ProjectileManager.createProjectile(ProjectileManager.PROJ_SHUNPOHIT,getMapPosition(),getMCS().y - 44,0,0,this.getDamage() * this.getChargingTime() / 2,level,this);"  |  skilldata.xml:1238 "<req><has><id>1000</id><qty>10</qty></has></req>", :1244 "<chi>50</chi>", :1245 "<cooldown>60</cooldown>"
- **Overturns:** "② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the **predecessor SHS2**, not Duels)."
- **Lane impact:** L2 for the skill definition; L5 (COMBAT CORE) — the 250 px displacement and charge-scaled damage are combat-model inputs, and the sibling capstones give i-frame windows (Thousand Stabs gotHitCounter 26, Deadly Cleave 16).

### `skills-meters/blocker3-focus-meter-fully-specified` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ③ is dead and the 'Focus bar' is the reload/slash meter: max = 5×24 = 120 frames; fill = +1 per frame; the HUD bar maps (reload−24)/(maxreload−24) so the first 24 frames are a hidden dead zone; a stance switch is blocked below maxreload/6 and costs 'set to maxreload/3 if above half, else subtract maxreload/6'; a slash costs slashUsage × 0.5 Light / 1.0 Balanced-Reversed / 1.5 Heavy-Dual; bonusReload() adds 6; and the Focus skill sets reload = maxreload − 1.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:239, :1158-1168, :2977, :3098-3105, :3240-3258, :3265-3272; SkillManager.as:218-219; StatsManager.as:1921-1930`
- **Quote:** MCSPlayer.as:239 "this.maxreload = 5 * 24;"  |  :2977 "if(this.reload < this.maxreload / 6)"  |  :3098-3104 "if(this.reload > this.maxreload / 2) { this.reload = this.maxreload / 3; } else { this.reload -= this.maxreload / 6; }"  |  :3249 "this.reload -= this.slashUsage / 2;" :3253 "this.reload -= this.slashUsage;" :3257 "this.reload -= this.slashUsage * 1.5;"  |  SkillManager.as:219 "owner.reload = owner.maxreload - 1;"
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2's 'meters on-screen match A1' criterion is now fully specifiable; L5 (COMBAT CORE) blocker ⑤ 'Focus/crit gating rule — watch the Focus bar fill/consume' is closed by the same eight numbers.

### `skills-meters/blocker4-spd-cooldown-formula` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ④ is dead: cooldownModifier = 1 − min(SPD_total, 300)/300 × 0.5, with SPD hard-capped at 300 (a 50% floor) and a speed buff multiplying effective SPD by 1.5 before the cap.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1844-1861`
- **Quote:** 1854: internal static function getSkillCooldownModifierVal(speed:int) : Number / 1856: if(speed > 300) / 1858: speed = 300; / 1860: return 1 - speed / 300 * 0.5;   (and 1847-1850: if(hasBuff(BUFF_SPEED)) { speed *= 1.5; })
- **Overturns:** "④ SPD→cooldown formula."
- **Lane impact:** L2 for the cooldown runtime; L10 (PROGRESSION + ECONOMY) inherits the SPD-300 cap as a hard progression ceiling it does not currently model.

### `skills-meters/blocker5-crit-is-deterministic` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker ⑤ is dead: crit is DETERMINISTIC, not a chance proc — the sole trigger is the equality reload == maxreload, there is no dice roll in the path, and spending it costs the whole bar because deductReloadBar() zeroes a full meter before applying the per-stance slash cost.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3215 and :3242-3245; BattleUI.as:259-263`
- **Quote:** MCSPlayer.as:3215 "if(this.reload == this.maxreload)"  |  :3242-3245 "if(this.reload == this.maxreload) { this.reload = 0; }"  |  BattleUI.as:262 "this.crittext.visible = percentage >= 1 && this.reloadbar.visible;"
- **Overturns:** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L2 and L5 — removes all RNG from the crit path, which matters for Sim determinism (mulberry32 budget) and for the duel-baseline recording.

### `skills-meters/chi-costs-not-single-digit` — HELD [A2] ⚑ OVERTURNS LEDGER

The Surface bullet is WRONG: <chi> values span 0, 2, 3, 5, 6, 7, 8, 10, 20, 50 and 100 — double-digit costs are common and the level-80 capstone costs exactly 100 — and chi is an absolute integer pool displayed as chi/maxchi, so the 'single-digit vs fabricated-100-meter' framing is the wrong axis entirely.

- **Cite:** `reference/extracted/skilldata.xml:1638-1649 (id 1055, chi 100); docs/gauntlet/L0/index/skilldata.json skilldata/skill/level/chi numeric_range [0,100]; BattleUI.as:252-256; corroborated by frames showing 26/26 and 47/47`
- **Quote:** skilldata.xml:1640 "<lvlreq>80</lvlreq>" / :1648 "<chi>100</chi>" / :1649 "<cooldown>30</cooldown>"  |  BattleUI.as:254 "this.chitext.text = chi + \"/\" + maxchi;"
- **Overturns:** "real Chi costs are single-digit (2/5); config's 30/25/10 is a fabricated-100-meter rescale."
- **Lane impact:** L2 — chi config must store absolute integer costs against a growing max pool; the 'fabricated rescale' accusation should be struck from the ledger.

### `skills-meters/chi-punch-three-levels` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The Chi Punch Ready bullet is incomplete: the skill has THREE levels dealing 10 / 20 / 30 damage, at cost 2 and cooldown 5 s at every level, with no <lvlreq> and no prerequisite (it is the Chi tree's entry node) — and its damage is a flat per-level constant that overwrites the passed-in damage argument, confirming the ledger's §3 line-75 characterisation.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/ChiPunchProjectile.as:17-31,:39; reference/extracted/skilldata.xml:1283-1306`
- **Quote:** ChiPunchProjectile.as:20-31 "if(skilllevel == 1) { damage = 10; } else if(skilllevel == 2) { damage = 20; } else if(skilllevel == 3) { damage = 30; }"  |  :39 "damageObj = new Damage(damage,0,Damage.LAUNCH_KNOCKDOWN);"  |  skilldata.xml:1286 "<order>0</order>", :1291 "<chi>2</chi>", :1292 "<cooldown>5</cooldown>"
- **Overturns:** "Chi Punch (10/20 dmg, cost 2, cd 4.96s)"
- **Lane impact:** L2 — adds the missing third level and replaces the measured 4.96 s with the contract 5 s.

### `skills-meters/crit-multiplier-not-1.3` — HELD [A2] ⚑ OVERTURNS LEDGER

The Ready bullet 'crit = 1.3× formula' is flatly WRONG: the crit multiplier is stance-dependent — ×1.5 in Light stance, ×1.2 in every other stance — plus an ADDITIVE gear term STAT_CRITICALDMG (stat id 204); 1.3 is neither value. The same function shows Light is a damage penalty (0.5 + 0.005×lightMastery), Balanced is 1.0→1.05×, and Heavy is a flat 1.5× that does not scale with mastery at all.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3198-3224; StatsManager.as:258 and :1835`
- **Quote:** 3205: maxDamage = baseDamage * (0.5 + 0.5 * this.lightMastery * 0.01); / 3208: maxDamage = baseDamage * (1 + 0.5 * this.balancedMastery * 0.01); / 3213: maxDamage = baseDamage * 1.5; / 3215: if(this.reload == this.maxreload) / 3219: return maxDamage * 1.2 + this.STAT_CRITICALDMG; / 3221: return maxDamage * 1.5 + this.STAT_CRITICALDMG;
- **Overturns:** "crit = 1.3× formula."
- **Lane impact:** L5 (COMBAT CORE) — kills CRIT_MULT=1.3 outright and closes its blocker ② 'crit 1.3 vs 3 final'; the '3× folklore' is explained by Heavy 1.5 × crit 1.2 = 1.8 plus flat gear crit-damage, not by the ledger's §3 line-153 compounding story.

### `skills-meters/kunai-trap-cost-zero-chi` — HELD [A2] ⚑ OVERTURNS LEDGER

Kunai Throw and Lay Trap have literally empty <chi> elements — they cost ZERO chi, and the kunai family instead consumes an ammo counter (stat 2501), so the ledger's phrase 'Kunai chi' presumes a cost that does not exist.

- **Cite:** `reference/extracted/skilldata.xml:355 and :900; reference/decompiled/shs3_android_payload/scripts/SkillManager.as:247-259; XMLSkill.as:268-277 and :117-120`
- **Quote:** skilldata.xml:355 "<chi></chi>"  |  SkillManager.as:254-259 "if(StatsManager.getStat(2501) == 0) { trace(\"no ammo\"); return false; } StatsManager.changeStat(2501,-1);"  |  XMLSkill.as:117 "if(cost > 0)" — the card suppresses the Cost line entirely
- **Overturns:** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental)"
- **Lane impact:** L2 — the meter model needs a second consumable resource (kunai ammo, stat 2501) that no ledger system currently lists.

### `skills-meters/ledger-decimals-reconciled` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's three measured decimals reconcile EXACTLY to the payload's integers: raw 5 / 10 / 9 seconds through ×24 → ×modifier → int-truncate → ÷24 → toFixed(2) print as 4.96 / 9.92 / 8.92, pinning the reader's SPD to 3-5; the measurements were right, the interpretation that they were the game's numbers was not, and the ledger also truncated the Focus skill to two levels when it has three (third cooldown 8 s).

- **Cite:** `reference/extracted/skilldata.xml:1292 (Chi Punch cd 5) and :295,:302,:309 (Focus cd 10/9/8); arithmetic over XMLSkill.as:291,:308,:310,:116,:123 and StatsManager.as:1860`
- **Quote:** skilldata.xml:295 "<cooldown>10</cooldown>", :302 "<cooldown>9</cooldown>", :309 "<cooldown>8</cooldown>"; XMLSkill.as:291 "var val:int = 0;" (the int truncation). 240×0.991667=238 → 238/24=9.9167 → "9.92"; 216×0.991667=214.2→214 → "8.92"; 120×0.991667=119 → "4.96".
- **Overturns:** "Replenish Focus (cost 5, cd 9.92→8.92s)"
- **Lane impact:** L2 — retires three INFERRED cooldowns and adds a missing third level; also a worked template for converting any other decimal-measured cooldown in the corpus back to its contract integer.

### `skills-meters/slash-reach-formula-crosslane` — HELD [A2] ⚑ OVERTURNS LEDGER

Cross-lane find in the same StatsManager block: slash length in stage px = 120 + floor((90 + DAN×5) × SPD / (20 + SPD)) — 120 px at SPD 0, asymptotic to 210 px at Dan 0, +5 px per Dan rank, halved while injured. This is the reach-in-pixels value combat-core calls 'the one value the whole model needs', and it is the one formula I could cross-check against the obfuscated web bundle, where it matches character for character.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1905-1919 and MCSPlayer.as:222,:3094; cross-check reference/decompiled/shs3_payload/scripts/§1t4906s0§.as:57`
- **Quote:** StatsManager.as:1917-1918 "var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5; return int(120 + Math.floor(maxincrement * speed / (20 + speed)));"  |  §1t4906s0§.as:57 "var _loc6_:int = 120 + Math.floor(_loc5_ * _loc4_ / (20 + _loc4_));"
- **Overturns:** "① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives "units" of unknown scale) — *measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a preserved build.*"
- **Lane impact:** L5 (COMBAT CORE) — closes its #1 blocker with an A2 cite and no measurement pass. Note the reach is per-SPD-and-Dan, NOT per-stance as the ledger assumed; that assumption should be struck too.

### `skills-meters/string-table-located-not-archived` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The missing string table is IDENTIFIED: it is an external file shs3_en.xml (plus shs3_zh-CN.xml) fetched at runtime from ./data/ or <server>/strings/ via fl.lang.Locale — it was never inside the SWF, which is why bindata/ and ui_strings.txt were dead ends. It is not on disk here, so the strings remain unheld, but 'not located' becomes 'identified, not archived' with a concrete Wayback/Flashpoint close-path.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/LangManager.as:38-58 and :78; negative check: `find reference/ -iname "*shs3_en*"` returns nothing`
- **Quote:** 38: var server:String = "./data/"; / 47: server = QueryManager.instance.server + "strings/"; / 56: Locale.addXMLPath(ENGLISH,server + "shs3_en.xml"); / 57: Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml"); / 78: var output:String = Locale.loadStringEx(num.toString(),language);
- **Overturns:** "ui_strings.txt is NOT it. bindata/ is now EXHAUSTED as a candidate. So numbers are portable today; NAMES ARE NOT. Never claim a name is held unless you found the table."
- **Lane impact:** L1b (STRING TABLE) — this is that lane's target, named and pathed. Its done-criterion 'or the lane reports the table as genuinely absent' can now be met precisely: absent from our archive, present as ./data/shs3_en.xml on the dead host.

### `skills-meters/ten-categories-not-six` — HELD [A2] ⚑ OVERTURNS LEDGER

The Ready bullet undercounts: skilldata.xml holds 11 distinct <category> values and the skill screen instantiates exactly TEN category slots with ten blurb string IDs — category 11 is NPC/enemy moveset data (no <order>, no <lvlreq>, absent from the UI), which is why the data file and the player-visible tree give different counts, and neither of them is six.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/SkillScreenUI.as:84,:103-104,:126-145; docs/gauntlet/L0/index/skilldata.json skilldata/skill/category distinct_values 11, range [1,11]`
- **Quote:** 84: internal var categoryCount:int = 10; / 103: this.categoryIcons = [1,2,3,4,5,6,7,8,9,10]; / 104: this.categoryDesc = [6024,6025,6026,6027,6028,6029,6030,6031,6032,6033];
- **Overturns:** "full 6-category tree structure + per-stance unlock levels"
- **Lane impact:** L2 — the tree UI needs ten tabs, not six, and category 11's six members belong to L4 (ENEMIES + AI) as NPC movesets, not to the player tree.

### `skills-meters/48-skill-names-in-as3` — HELD [A2]

The gauntlet's string-table blocker is too pessimistic for this system: 48 canonical English skill identifiers are declared as AS3 constants keyed to the same ids skilldata.xml uses, so every 'which skill is this row' question in this survey is grounded on the developers' own names rather than inference (they are identifiers, not display strings, so a 1:1 rebuild still wants the table).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/SkillManager.as:8-106`
- **Quote:** 8: public static var SKILL_LIGHTSTANCE:int = 1000; / 18: public static var SKILL_FOCUS:int = 1005; / 24: public static var SKILL_SMOKEBOMB:int = 1010; / 54: public static var SKILL_SHUNPO:int = 1039; / 60: public static var SKILL_CHIPUNCH:int = 1042; / 86: public static var SKILL_MASSCLONE:int = 1055; / 106: public static var SKILL_EARTHQUAKE:int = 1073;
- **Overturns:** "KNOWN BLOCKER (GAUNTLET.md §2.1): item/skill/npc <name>, <desc>, <displayname> and cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED. … NAMES ARE NOT."
- **Lane impact:** L2 no longer strictly 'needs L1b for names' to start — 48 of 75 skills have developer identifiers today, so the ordering rule's L1b dependency for L2 is softer than GAUNTLET.md states.

### `skills-meters/a1-crit-text-on-full-bar` — HELD [A1]

A1 FRAME CONFIRMATION of the crit gating, the stance-switch gate and the Heavy multiplier in one HUD: a two-panel bottom-left crop shows HP 11/20, Chi 47/47, a third bar full and white with 'CRITICAL HIT' printed inside it in the second panel, and '150% DAMAGE' in yellow — and a second frame shows the same third bar empty, captioned 'CANNOT CHANGE STANCE'.

- **Cite:** `reference/frames/session11/gap-focus-trigger/m_nearfull.png (1800×780, already a bottom-left HUD crop; viewed at native size, bars ~40 px tall) and reference/frames/combat_analysis/Nr4fQstqHDM_t428.0.png (1920×1080, crop (80,900)-(1000,1080) upscaled 2× LANCZOS)`
- **Quote:** m_nearfull.png, visibly: green bar '11/20', blue bar '47/47', a third bar full and white — top panel blank, bottom panel reading 'CRITICAL HIT' — and yellow '150% DAMAGE' below. Nr4fQstqHDM_t428.0.png crop, visibly: green '20/20', blue '26/26', third bar empty/brown captioned 'CANNOT CHANGE STANCE', yellow '150% DAMAGE'.
- **Overturns:** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent."
- **Lane impact:** L2 and L8 (UI + SCREENS) — the frame independently corroborates BattleUI.as:262, MCSPlayer.as:2977 and MCSPlayer.as:3213 from the WEB longplay, covering the one gap in the Android-vs-web cross-check. Frame and payload agree here; had they disagreed, the frame would win.

### `skills-meters/category-domain-map-proven` — HELD [A2]

The category→domain map is proven rather than assumed: cats 1/2/3 are Light/Balanced/Heavy (each stance's ×10 capstone is stance-gated in code), cat 4 is Chi, cat 5 movement, cat 6 Ninja, and cats 7/8/9/10 are Fire/Water/Wind/Earth keyed to element items 28/30/29/31.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/SkillSlotButton.as:153; XMLSkill.as:153-167; reference/extracted/skilldata.xml:1238 (1039 req 1000×10), :1251-1261 (1040), :1267-1277 (1041)`
- **Quote:** SkillSlotButton.as:153 "if(chi < this.chiCost || this._skillId == SkillManager.SKILL_SHUNPO && stance != MCSPlayer.LIGHT_STANCE || this._skillId == SkillManager.SKILL_THOUSANDSTABS && stance != MCSPlayer.BALANCED_STANCE || this._skillId == SkillManager.SKILL_DEADLYCLEAVE && stance != MCSPlayer.HEAVY_STANCE)"  |  XMLSkill.as:153-155 "else if(hasid == 28) { ... LangManager.getString(726) ..."
- **Overturns:** "full 6-category tree structure + per-stance unlock levels"
- **Lane impact:** L2 for the tree; L11 (META + REBIRTH) — cats 7-10 ARE its '4 elements × 6 named skills', and their costs, cooldowns and 10/10/10/30/30/60 element-item ladders are all held, half-opening its blocker ① 'what each element DOES'.

### `skills-meters/chi-pool-numerics` — HELD [A2]

The chi pool's own numbers, absent from every ledger system, are held: start 10/10 with base regen stat 1; the regen tick adds maxchi/10 plus gear CHIREGEN; a half-refill sets chi = maxchi × 0.5; level-up sets chi to full; every write clamps to max.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:697-699, :1699-1702, :1714-1720, :1733-1739, :1027-1029, :176-180`
- **Quote:** 697: setPlayerStats(STAT_CHI,10); / 698: setPlayerStats(STAT_MAXCHI,10); / 699: setPlayerStats(STAT_CHIREGEN,1);  |  1734: var newchi:int = getPlayer().getChi() + maxchi / 10 + findBonusStat(STAT_CHIREGEN);  |  1715: var newchi:int = maxchi * 0.5;
- **Overturns:** "③ Focus numerics (max/fill/switch-cost)."
- **Lane impact:** L2 — the Chi meter is now fully codeable; also confirms L10's progression Ready bullet 'start pools (HP10/Chi10/AP30)' on its chi half with an A2 cite.

### `skills-meters/cooldown-is-seconds-at-24fps` — HELD [A2]

<cooldown> in skilldata.xml is raw SECONDS at a 24 fps tick; the skill card multiplies by 24 to frames, applies the SPD cooldown modifier, divides by 24 and prints to two decimals — so any decimal cooldown in a ledger is a display artefact of one character's SPD, never a contract value.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/XMLSkill.as:289-311 and :116,:123`
- **Quote:** 308: val = this.levelList[lvl].cooldown * 24;  /  310: return val * StatsManager.getSkillCooldownModifier();  /  116: cooldown = this.getCooldown(1) / 24;  /  123: ... + cooldown.toFixed(2) + ...
- **Overturns:** "Chi Punch (10/20 dmg, cost 2, cd 4.96s); Replenish Focus (cost 5, cd 9.92→8.92s)"
- **Lane impact:** L2 — every cooldown in config must be stored as the integer second value with a runtime SPD modifier applied, not as the measured decimal.

### `skills-meters/focus-non-meter-effect-unknown` — STILL_UNHELD [STILL_UNHELD]

What the Focus skill buys beyond charging the meter is still unheld: the SKILL_FOCUS case contains only the reload assignment, an animation and P2P replication — I found no evasion effect there, and the dodgechance path in checkHitObject derives from the Roll skill (1004), not Focus, but I did not read that function to the end, so I decline to grade project memory's 'Focus buys evasion' line either way.

- **Lane impact:** L2/L5 — close-path is reading MCSPlayer.as checkHitObject() (from :3275) end-to-end plus the FOCUS_START/FOCUS_END animation state handlers at MCSPlayer.as:1048-1080.

### `skills-meters/per-skill-damage-constants-unread` — STILL_UNHELD [STILL_UNHELD]

The per-skill damage constants for every skill except Chi Punch are on disk but I did not read them: ~40 *Projectile.as classes dispatched from ProjectileManager follow the same 'overwrite damage from skilllevel' pattern, and I will not assert numbers I have not opened.

- **Lane impact:** L2 — a reading gap, not an evidence gap; close-path is one sitting reading reference/decompiled/shs3_android_payload/scripts/*Projectile.as against the dispatch table in ProjectileManager.as:195-260.

### `skills-meters/stab-is-heavy-l3-CONFIRMED` — HELD [A2]

The Surface bullet survives intact and should be recorded as CONFIRMED, not corrected: 'Stab' is skill 1018, a category-3 (Heavy) node with <passive>1</passive> whose prerequisite is Heavy Stance ×3, gating the canStab capability — and because it is passive, canEquip() returns false, so it can never occupy a hotbar slot. The full per-stance ladder falls out with it (×3/×4/×5 capability nodes + ×10 capstone per stance).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3127-3155; XMLSkill.as:345-347; reference/extracted/skilldata.xml:721-727`
- **Quote:** MCSPlayer.as:3149 "this.canStab = this.getSkillLevel(1018) > 0;"  |  skilldata.xml:724-727 "<req><has><id>1002</id><qty>3</qty></has></req> / <passive>1</passive> / <order>3</order> / <category>3</category>"  |  XMLSkill.as:347 "return !this.passive && StatsManager.getStat(this.id) > 0 && ..."
- **Overturns:** ""Stab" is Heavy L3 "Heavy Stab," a tree node, not a hotbar skill."
- **Lane impact:** L2 — gives the exact per-stance unlock ladder (Light 1014/1036/1015→1039, Balanced 1016/1037/1017→1040, Heavy 1018/1038/1019→1041); L5 gets canStab/canDeflect/canLaunch/canFlipUp/canAirCombo as tree-gated combat capabilities. Grep disambiguation: SKILL_THOUSANDSTABS (1040) is a *Balanced* capstone, a different thing.

### `skills-meters/string-id-175-cracked` — HELD [A1]

One cell of the string table is cracked by pairing AS3 with a frame: ID 175 = 'CRITICAL HIT', because BattleUI assigns crittext.text = LangManager.getString(175) and the HUD frame shows exactly that text in exactly that field — demonstrating a repeatable method for recovering string IDs without the table file.

- **Cite:** `reference/frames/session11/gap-focus-trigger/m_nearfull.png (bottom panel, third bar) paired with reference/decompiled/shs3_android_payload/scripts/BattleUI.as:102`
- **Quote:** BattleUI.as:102 "this.crittext.text = LangManager.getString(175);" — and the frame's lower panel visibly reads 'CRITICAL HIT' inside the full white bar.
- **Overturns:** "Never claim a name is held unless you found the table."
- **Lane impact:** L1b — a working partial method (AS3 getString(N) call site × A1 frame) that recovers UI-visible strings even if shs3_en.xml is never found; it will not reach item/skill display names, which are never rendered in the two longplays' HUD.

## ui-hud — re-scored 85

57 -> 85. The ui-hud block was scored against the wrong evidence base: reference/decompiled/shs3_android/ and shs3_android_payload/ are the Android build of SHS:Duels decompiled with class AND field names fully intact (970 classes: BattleUI.as, OverworldHUD.as, OptionsUI.as, DuelIntroBar.as, ScreenTransition.as, TextProjectile.as, LangManager.as). The web payload is name-obfuscated, which is why every prior pass worked from frames alone. Blockers (1)(2)(3) close outright and (4) is overturned; (5) half-closes (widget inventory + strings held, pixel metrics not exported). Both Surface bullets confirmed at source level. Held back from 90+ by three real gaps: (a) symbol geometry inside assets.swf was never exported, so exact HUD pixel metrics remain a pending JPEXS extraction; (b) MASTER §8's existing HUD fractions are wrong, not merely imprecise, and must be re-derived under the pillarbox correction before reuse; (c) android/web string-id drift means every string needs corroboration rather than a blind lookup.

### `ui-hud/ap-is-in-the-overworld-hud` — HELD [A2] ⚑ OVERTURNS LEDGER

AP is a first-class overworld HUD meter — label, bar, value text + shadow, a regen countdown timer and a buy-more button — flatly contradicting the ledger's primary source, which says AP is menu-only.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:64, :208-211, :1376, :1381-1384, :1488-1489; string ids 65/66 corroborated verbatim at reference/extracted/ui_strings.txt:209 and :286`
- **Quote:** public var overworldHUD_ap:MovieClip;  /  this.overworldHUD_ap.APbar.bar.scaleX = percentage;  /  this.overworldHUD_ap.APtimer.text = duration; this.overworldHUD_ap.APtimershadow.text = duration;  /  this.overworldHUD_ap.APtext.text = ap + " / " + apmax;
- **Overturns:** "| AP | 30 | Menu-only (not shown in overworld HUD) |"
- **Lane impact:** L-ui-hud: overturns SHSD_MASTER_REFERENCE.md:192 and :419 ('Fourth pool, AP (pale gold), exists only in Player▸Stats menu') — both false. Bonus for L-world-exploration: the APtimer field proves AP regen is a countdown-timer model, which speaks directly to that lane's blocker ④ 'AP regen rate + cap'.

### `ui-hud/bars-snap-not-tween` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker (2)'s 'bar tween vs snap' resolves to SNAP: scaleX is assigned the raw ratio inline with no tween, easing, lerp or target value anywhere in the path, in the combat HUD, the overworld AP/XP bars and the action progress bar alike.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:245-262; also OverworldHUD.as:1376, :1532 and MCSProgressBar.as`
- **Quote:** this.hpbar.bar.scaleX = hp / maxhp;  /  this.chibar.bar.scaleX = chi / maxchi;  /  this.reloadbar.bar.scaleX = percentage;
- **Overturns:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** L-ui-hud: blocker ② first third retired. Also surfaces the hptext/hptextshadow paired-TextField outline trick as a render contract, which is what the frame shows rendered.

### `ui-hud/combo-has-no-pop` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker (2)'s 'combo pop' resolves to NO POP: showCombo is a visibility toggle plus two text assignments (value + shadow), with no gotoAndPlay and no scale or alpha work.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:382-396; label string id 45 corroborated verbatim at reference/extracted/ui_strings.txt:313`
- **Quote:** this.combo.visible = true; this.combo.combo.text = num.toString(); this.combo.comboshadow.text = num.toString();
- **Overturns:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** L-ui-hud: blocker ② second third retired. Prevents a recreation from inventing a combo-pop animation the original never had.

### `ui-hud/damage-modifier-readout` — HELD [A1] ⚑ OVERTURNS LEDGER

The combat HUD carries a stance-lock indicator and a damage-multiplier readout that appear nowhere in the ledger's ui-hud Ready list or blockers.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png — crop (60,900)-(700,1080) at 2x LANCZOS`
- **Quote:** Below the HP/Chi bars: a tan/brown label strip reading 'CANNOT CHANGE STANCE', and beneath it in yellow '150% DAMAGE'. Bar value text is white with a hard black offset duplicate.
- **Overturns:** "**Surface:** overworld HUD lives only in segment A-00, not MASTER §8 (which is combat-only); portrait ring is stance-colored, not fixed red."
- **Lane impact:** L-ui-hud: two uncatalogued combat-HUD elements. Also visually confirms the hptext/hptextshadow paired-TextField outline from the bars-snap claim.

### `ui-hud/dual-layout-480-690` — HELD [A2] ⚑ OVERTURNS LEDGER

The game has TWO authored layouts (800x480 landscape, 800x690 tall) with a runtime switch that re-inits the HUD, and the web SWF's own header rect is the 800x690 one — no ui-hud ledger bullet mentions a second aspect layout at all.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:270-285`
- **Quote:** var _loc2_:int = 800; var _loc3_:int = 480; var _loc4_:int = 690; ... if(_loc7_ <= _loc6_) { _loc5_ = _loc6_; _loc3_ = _loc4_; ... §1t406s0§.instance.§1t6500s0§.init();
- **Overturns:** "**Ready:** combat-HUD geometry (frame-measured fractions); two-beat VS→FIGHT intro; result cards; overworld HUD layout; 8-icon menu ribbon; minimap; (EQ:n) UX; parchment chrome family; login + character-creation screens; transition timings."
- **Lane impact:** L-ui-hud: adds a whole second HUD layout the ledger never scoped. Any 1:1 HUD build must decide whether it targets 480 or 690, and the re-init hook shows the HUD is rebuilt on the switch.

### `ui-hud/floating-damage-popups` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker (3) closes with a complete portable spec: floating damage numbers are pooled TextProjectiles spawned at (target.x, target.y-100) with ttl 12, velY -5, +0.1 scale/frame for the last 10 frames, -0.25 alpha/frame for the last 4, across six colour channels.

- **Cite:** `reference/decompiled/shs3_android/scripts/TextProjectile.as:16-50; ProjectileManager.as:468; EnemyClone.as:306-327`
- **Quote:** ttl = 12; this.velX = 0; this.velY = -5; ... if(ttl < 10) { scaleX += 0.1; scaleY += 0.1; if(ttl < 4) { alpha -= 0.25; } }  //  createFloatingText(posx,posy,str,color:int = 10027008)  //  fire 16737792 #FF6600, wind 13421772 #CCCCCC, water 26367 #0066FF, earth 6697728 #663300
- **Overturns:** "③ floating damage/crit **popups** (absent from the ledger, confirmed to exist)."
- **Lane impact:** L-ui-hud: blocker ③ retired with numbers, not just confirmation. Separately disentangles crittext (a FIXED HUD field reading 'Critical Hit', gated on reloadbar being full at BattleUI.as:262) from the floating popups — the ledger's single bullet conflated two different things.

### `ui-hud/master-x-fractions-are-wrong` — HELD [A1] ⚑ OVERTURNS LEDGER

The ledger's 'Ready: combat-HUD geometry (frame-measured fractions)' is an over-claim — the fractions were taken under a 16:9 full-bleed / ÷1.875 / 1024x576 convention that the frames disprove, putting a source-known coordinate 13.5 px off in an 800-wide stage.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png — row band y 1000-1010, skill-box border columns detected at x 1447-1452 and 1556-1559 (centre 1503.5); compared against docs/research/SHSD_MASTER_REFERENCE.md:1290 and :1372, and BattleUI.as:132-136`
- **Quote:** Measured box centre 1503.5 -> pillarbox-corrected (1503.5-52)*800/1816 = 639.4 (source says x=640, error 0.6px); MASTER's rule 1503.5/1.875 = 801.9 of 1024 -> 626.5 in an 800 stage (error 13.5px). MASTER:1290 reads 'Scale: study_px @1080 ÷ 1.875 = stage_px (canvas 1024×576)'.
- **Overturns:** "**Ready:** combat-HUD geometry (frame-measured fractions); two-beat VS→FIGHT intro; result cards; overworld HUD layout; 8-icon menu ribbon; minimap; (EQ:n) UX; parchment chrome family; login + character-creation screens; transition timings."
- **Lane impact:** L-ui-hud: THE FRAME WINS AND SAYS THE DOC IS WRONG. Every absolute 'stage px' in MASTER §8 is 1.2x too large (576/480) and every x-fraction is offset-wrong. The 'Ready' geometry must be re-derived as (frame_x - barWidth)*800/contentWidth before any of it is coded.

### `ui-hud/native-stage-800x480` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker (1) 'aspect-ratio truth' closes without a build: the native stage is 800x480 as a shipped literal in both bundles, and the SWF headers read 800x480 @24fps (android) / 800x690 @24fps (web).

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:80,82 and reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104,106; SWF header rects read from reference/decrypted/shs3_android_payload_decoded.swf and shs3_payload_decoded.swf`
- **Quote:** public static var stageWidth:int = 800;  /  public static var stageHeight:int = 480;
- **Overturns:** "① **aspect-ratio truth** (5:3 native → are x-fractions pillarbox-wrong?) — *inspect `unt.png` for side-bars; read `stage.stageWidth` in a build.*"
- **Lane impact:** L-ui-hud: blocker ① retired. No playable build is needed for stage truth; the constant and two SWF header rects are on disk. Also removes the P0 'must load a build' dependency for all HUD geometry work.

### `ui-hud/pause-options-dialogue-metrics` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Blocker (5) half-closes: the complete widget inventory, field lists and strings for pause/options/dialogue are held, but the exact pixel metrics live in assets.swf symbols that were never exported — only scripts/ was.

- **Cite:** `reference/decompiled/shs3_android/scripts/OptionsUI.as:9-30 and :33-40; DialogBox.as:11-16 and :30; string ids 10/74/75/388 in scratchpad/lang_map.json, 388 corroborated at reference/extracted/ui_strings.txt:298; class inventory in docs/gauntlet/L0/index/actionscript.json`
- **Quote:** public var musiccheck:XCheckBox; ... public var quitdialog:QuitDialog; public var closewindowbutton:YellowButton; public var backtomainmenubutton:GreyButton;  //  id 10='Options', 74='Title Screen', 75='Return To Game', 388='Game Paused'  //  every class is [Embed(source="/_assets/assets.swf", symbol="symbolNNNN")] and reference/decompiled/shs3_android/ contains a scripts directory and nothing else
- **Overturns:** "⑤ pause/options/dialogue-box exact metrics."
- **Lane impact:** L-ui-hud: blocker ⑤ downgraded from unknown to a single pending extraction. The metrics are recoverable — one JPEXS shape/sprite export from shs3_android_payload_decoded.swf — but they are not on disk today, so this stays PARTIAL.

### `ui-hud/pillarbox-measured-in-frames` — HELD [A1] ⚑ OVERTURNS LEDGER

Both longplays are pillarboxed, not full-bleed: content spans x 52..1867 (video B) and x 55..1861 (video A) at full 1080 height, giving content aspect 1.6815 / 1.6731 (5:3), and the two videos have DIFFERENT bar widths.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png, reference/frames/combat_analysis/Nr4fQstqHDM_t428.0.png, reference/frames/zFt_combat/zFtCaTO0_1M_t0320s.png — crop (0,0)-(1920,220) full-width strip, plus per-column luminance-mean profile at threshold 20`
- **Quote:** Visible in the top crop: black columns at both left and right edges, an 'AUTO SLASH OFF' plaque top-left and a red circular pause button top-right. Measured content box video B x=52..1867 (w 1816), video A x=55..1861 (w 1807), no top/bottom bars.
- **Overturns:** "The game runs at a **16:9 aspect ratio** (original 1920×1080 full-bleed; target stage 1024×576)."
- **Lane impact:** L-ui-hud: kills the 'full-bleed 16:9' premise underlying every existing HUD x-fraction. Because the two videos differ (52 vs 55 px), fractions taken against full 1920 width are video-specific and non-transferable.

### `ui-hud/skill-slots-3-to-8` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker (4) is overturned: there are three genuine data-driven SkillSlotButtons (count = 3 + getStat(1008), ladder to 6 via a 'Skill Slots+' skill, 8 buttons pre-allocated at x = 760 - i*60, y = 450) and the stance control is the portrait bust, not the up-arrow.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2293-2296; BattleUI.as:132-138, :496-504, :275, :192, :430-434; string-table ids 1506/1648/1649/1650; frame crop (0,900)-(1920,1080) of reference/frames/duel_dense/Nr4fQstqHDM_427.0.png`
- **Quote:** public static function getSkillSlotCount() : int { return 3 + getStat(1008); }  //  skillSlotButton.x = 760 - i * 60; skillSlotButton.y = 450;  //  skillSlotButton.initKeyPressText(this.slotCount - i);  //  ids 1648/1649/1650 = '4 skill slots'/'5 skill slots'/'6 skill slots'. Frame shows three boxes bottom-right with numerals 2 and 3 above the middle and right boxes and a gold up-arrow in the right box — exactly initKeyPressText(slotCount-i) for slotCount=3.
- **Overturns:** "④ the "3 skill slots" is really ~2 abilities + a stance up-arrow."
- **Lane impact:** L-ui-hud: blocker ④ overturned. The frame observation was right but the interpretation was wrong — the up-arrow is a skill occupying slot 3, stance is bound to battlemodebust via stanceButtonClick(), and slot count is data-driven 3..6 rather than a fixed 3.

### `ui-hud/string-table-partial` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The UI string table is FOUND — 1,906 verbatim UI strings (ids 0..1905, contiguous) in an embedded UTF-16LE XLIFF extracted from the Android payload — but it does NOT cover item/skill/npc display names, whose ids (4000+/6000+/7000+) are all out of its range.

- **Cite:** `reference/decompiled/shs3_android/scripts/Mobile_Lang_EN.as:5-6 (the Embed); DefineBinaryData id 118 of reference/decrypted/shs3_android_payload_decoded.swf (500,024 bytes), extracted this pass to scratchpad/lang_en.xliff; range check against reference/extracted/itemdata.xml and skilldata.xml; LangManager.as:57 and Mobile.as:569`
- **Quote:** [Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]  //  <trans-unit id="45" resname="45"><source>Hit Combo</source></trans-unit>  //  itemdata.xml <name> ids run to 4427, skilldata.xml <displayname> ids 6000-6141, <level><desc> 7000+ — all return None against a table maxing at 1905.  //  Locale.addXMLPath(ENGLISH, server + "shs3_en.xml")
- **Overturns:** "ui_strings.txt is NOT it. bindata/ is now EXHAUSTED as a candidate. So numbers are portable today; NAMES ARE NOT. Never claim a name is held unless you found the table."
- **Lane impact:** Cross-lane, not just ui-hud. GAUNTLET §2.1 is correct for the WEB payload — I re-extracted shs3_payload_decoded.swf this pass and confirmed exactly 27 DefineBinaryData tags matching reference/extracted/bindata/, none an XLIFF — but wrong for the game as a whole: the table was never in the file everyone was searching. UI/HUD strings are now held; item/skill/npc names remain STILL_UNHELD, because the canonical table was server-hosted (shs3_en.xml) and the embedded copy is a truncated offline fallback.

### `ui-hud/vignette-is-timeline-not-ramp` — HELD [A2] ⚑ OVERTURNS LEDGER

Blocker (2)'s 'vignette ramp' is not a coded ramp — the damage vignette is an authored MovieClip timeline replayed from frame 1, so there is no alpha curve to recover from frames; the clip itself must be recovered.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:424-428`
- **Quote:** public function showHurtRed() : * { this.hurtred.visible = true; this.hurtred.gotoAndPlay(1); }
- **Overturns:** "② dynamic HUD "feel" (bar tween vs snap, combo pop, vignette ramp) — uncatalogued."
- **Lane impact:** L-ui-hud: blocker ② fully retired, and it redirects the close-path — the vignette is an assets.swf symbol export job, not a frame-measurement job.

### `ui-hud/eq-n-ux` — STILL_UNHELD [STILL_UNHELD]

The Ready bullet '(EQ:n) UX' could not be grounded in any artifact this pass.

- **Lane impact:** L-ui-hud: one Ready bullet remains unsourced. 'EQ:' appears in neither the 1,906-id string table nor reference/extracted/ui_strings.txt; the only EQ token in the android source is NetworkManager.MSG_PLAYERUPDATEEQ, a wire opcode unrelated to an inventory label. Claiming it would be guessing.

### `ui-hud/intro-beats-exact` — HELD [A2]

The Ready bullet 'two-beat VS→FIGHT intro' is correct and now exact: a 4-keyframe timeline at 24 fps — busts+names at frame 20 (792 ms), 'FIGHT!' at frame 69 (2042 ms), end at frame 88 (3667 ms), busts at 4x scale with the right one x-mirrored.

- **Cite:** `reference/decompiled/shs3_android/scripts/DuelIntroBar.as:22-31, :70, :84-105; fps from the SWF header of reference/decrypted/shs3_android_payload_decoded.swf; word string id 104 corroborated verbatim at reference/extracted/ui_strings.txt:138`
- **Quote:** addFrameScript(0,this.frame1,19,this.frame20,68,this.frame69,87,this.frame88); this.leftbust.scaleX = 4; this.rightbust.scaleX = -4;  //  actionWord.textmask.colorText.text = LangManager.getString(104) = 'FIGHT!'  //  name colours 16763904 = #FFC300 (player), 16777215 = #FFFFFF (opponent)
- **Lane impact:** L-ui-hud: upgrades a Ready bullet from frame-estimated to frame-exact, and independently corroborates SHSD_MASTER_REFERENCE.md:253's 'VS | ~2000ms' — the ~2s is the frame-20→frame-69 hold, 2042 ms exactly.

### `ui-hud/lang-id-drift-caveat` — HELD [A2]

The extracted string table is from a different build revision than the decompiled BattleUI: ids below ~400 resolve correctly, ids above ~600 do not, so strings must be resolved by search and corroborated, never by id alone.

- **Cite:** `reference/decompiled/shs3_android/scripts/BattleUI.as:124-125 and OverworldHUD.as:211 vs scratchpad/lang_map.json ids 619/620/223; correct strings at ids 600/601, corroborated at reference/extracted/ui_strings.txt:221-222 and in the frame crop (0,0)-(1920,220) of reference/frames/duel_dense/Nr4fQstqHDM_427.0.png`
- **Quote:** BattleUI.as:124-125 calls getString(619)/getString(620) for the autoslash off/on labels, but the table gives 619='Special Event', 620='Unbreakable'; the true strings sit at 600='Auto Slash Off' and 601='Auto Slash On' — which is what the frame plaque reads ('AUTO SLASH OFF') and what ui_strings.txt:221-222 carries. Likewise OverworldHUD.as:211 calls getString(223), which the table gives as 'Remove from friend list'.
- **Lane impact:** Cross-lane guard rail on the new string table. THE FRAME WINS over the android id numbering. Rule for downstream lanes: ids below ~400 resolve directly; above that, resolve by string search then corroborate against ui_strings.txt or a frame.

### `ui-hud/no-scale-plus-blocker-bars` — HELD [A2]

Scaling is manual (StageScaleMode.NO_SCALE) with a uniform fit, centred offsets, and four explicit blocker sprites the game draws over its own overscan — so pillarbox/letterbox is a game-drawn artifact, not a player-embed artifact.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:154, :293-307, :388, :417-431`
- **Quote:** §1t9973s0§.scaleMode = StageScaleMode.NO_SCALE;  ...  l_blocker.width = §1t1523s0§.§1t9359s0§;  r_blocker.x = §1t1523s0§.§1t9359s0§ + §1t1523s0§.§1t9363s0§ * §1t1523s0§.§1t9358s0§;
- **Lane impact:** L-ui-hud: explains the black bars measured in the frames and predicts fit-to-height + pillarbox for any container wider than 5:3, which is exactly what both longplays show.

### `ui-hud/parchment-chrome-and-transition-timings` — STILL_UNHELD [STILL_UNHELD]

'Transition timings' and 'parchment chrome family' remain unheld: the transition taxonomy is named in source but the durations were not traced to constants, and the chrome palette was not re-measured from a frame.

- **Lane impact:** L-ui-hud: two Ready bullets stay open. ScreenTransition.as names four types (TRANSITION_BLACKCLOSE/BLACKOPEN/WHITEIN/WAIT) and ten actions, so the taxonomy is held, but the timings are driven by blackMovtSpeed and per-call counter values I did not trace to constants, and no frame was re-measured for the chrome palette. Flagged rather than asserted.

### `ui-hud/portrait-ring-is-stance-colored` — HELD [A1]

The Surface bullet 'portrait ring is stance-colored, not fixed red' is CONFIRMED and upgraded: the ring is a MovieClip frame index keyed by stance id, and frames show a blue/violet ring on LIGHT stance versus red elsewhere.

- **Cite:** `reference/frames/session11/stance-reach/B_t851.867_LIGHT_ring_blue_CHANGE-STANCE_tooltip.png and reference/frames/duel_dense/Nr4fQstqHDM_427.0.png — crop (60,900)-(700,1080) at 2x LANCZOS; mechanism at reference/decompiled/shs3_android/scripts/BattleUI.as:372-375`
- **Quote:** Blue/violet ring, HUD label reads 'LIGHT STANCE', 'CHANGE STANCE' tooltip bottom-left, HP 20/20 green, Chi 31/31 blue (median saturated ring hue 229.8°); the duel_dense frame shows a red ring (median hue 6.3°). Code: public function setStanceColor(num:int) : * { this.battlemodebust.stancecolor1.gotoAndStop(num); }
- **Lane impact:** L-ui-hud: Surface bullet promoted from an unsourced note to A1+A2. A hue sweep over 11 combat frame directories found clusters at ~0°, ~30-45°, ~120°, ~225-240° — at least four ring states, more than three stances, so the per-stance hex mapping is still open.

### `ui-hud/ribbon-and-maps-named` — HELD [A2]

The '8-icon menu ribbon' Ready bullet is correct and now nameable (shop, chat, playerStats, duelmode, questLog, skills, options, war, each with a paired label and three notification badges) — but 'minimap' is an under-count: there are three map widgets.

- **Cite:** `reference/decompiled/shs3_android/scripts/OverworldHUD.as:22-84 (buttons + labels), :38-39 and :70 (maps)`
- **Quote:** public var minimap:Minimap;  public var bigmap:Bigmap;  public var territorymap:Territorymap;  // buttons: shopButton, chatButton, playerStatsButton, duelmodeButton, playerQuestLogButton, playerSkillsButton, optionsButton, warButton (+ warButtonRed/Green/Blue/Yellow/Black/Custom); badges: hasStatPointMark, hasSkillPointMark, hasWarMoveMark
- **Lane impact:** L-ui-hud: converts two Ready bullets from frame-observed to source-enumerated, and corrects 'minimap' to a three-widget family. Also retires the Surface note that the overworld HUD 'lives only in segment A-00' — it is 3,387 lines of named ActionScript.

### `ui-hud/rosetta-deobfuscation` — HELD [A2]

The obfuscated web payload can be de-obfuscated by structural alignment with the fully-named Android bundle — matching statements with identical constants pin symbol identities exactly.

- **Cite:** `reference/decompiled/shs3_payload/scripts/§1t406s0§.as:3217 vs reference/decompiled/shs3_android/scripts/OverworldHUD.as:3225`
- **Quote:** else if(this.§1t6438s0§.x > §1t1523s0§.stageWidth - 180)   ===   this.interactLabel.x = StatsManager.stageWidth - 180;   ⇒ §1t406s0§ = OverworldHUD, §1t1523s0§ = StatsManager, §1t6438s0§ = interactLabel
- **Lane impact:** Whole-project unlock, not a ui-hud one. Both files are ~3,300 lines with matching structure; running this alignment across all 1,079 obfuscated web-payload classes would give every gauntlet lane named source instead of frame archaeology.

## unassigned — re-scored ?

### `combat-core/string-table-resolved` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The mobile string table has in fact been extracted this session and resolves the numeric IDs — npcdata <name>5009 is "Ruffian", itemdata <name>4041 is "Branch", and BattleUI's crittext string 175 is "Critical Hit" — closing the §2.1 naming blocker for the mobile build, though the file is not yet under reference/.

- **Cite:** `session scratchpad lang_en.xml (250 KB XLIFF derived from reference/preservation/shs3_android_payload.swf binaryData 118) lines 532-533, 2950-2951, 4138-4139; source path proven by reference/decompiled/shs3_android/scripts/Mobile_Lang_EN.as:5`
- **Quote:** `<trans-unit id="1377" resname="5009">` / `<source>Ruffian</source>`  ·  `<trans-unit id="981" resname="4041">` / `<source>Branch</source>`  ·  `<trans-unit id="175" resname="175">` / `<source>Critical Hit</source>`  ·  Mobile_Lang_EN.as:5 `[Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]`
- **Overturns:** "KNOWN BLOCKER (GAUNTLET.md §2.1): item/skill/npc <name>, <desc>, <displayname> and cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED."
- **Lane impact:** L1b (string table) closes for the mobile build. Two immediate consequences: npcdata id 1 IS a bandit-class mob ('Ruffian'), which retroactively licenses the identification the early-ttk claim asserted without grounds; and item 13002 is a 'Branch', i.e. a stick, consistent with its 1-2 damage. ACTION REQUIRED: the XML lives only in the session scratchpad and is therefore NOT citable under §0 — copy it into reference/extracted/ to make it a durable A2. I independently reproduced the surveyor's failure (zlib.decompress on that SWF errors, header 4357 5372 7899 2269), so their honesty about not having done the extraction is accurate.

### `economy/ap-and-token-caps-are-40` — HELD [A1] ⚑ OVERTURNS LEDGER

Both 'caps' the survey read out of StatsManager class constants are contradicted on film: AP max is 40 and duel-token max is 40, not 30. The 30s are level-1 character-creation initials.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-28/frames/frame_0007.jpg crop (470,110)-(780,290) upscaled x4; reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0001.jpg crop (820,50)-(1024,130) upscaled x6`
- **Quote:** seg-28 frame_0007: 'HP 20 / 30 · CHI 47 / 47 · AP 30 / 40'   |   seg-17 frame_0001: skull icon over '40/40' captioned 'DUEL TOKENS'
- **Overturns:** "④ token/tournament economy numbers."
- **Lane impact:** world-exploration blocker ④ ('AP regen rate + cap') is only half-closed — the 60 s interval holds, the '30 max' does not and must not be ported. economy blocker ④ likewise survives on two counts: the token cap is 40 on the web build, and `grep -rli tournament` over all 559 android classes returns 0 files, so the tournament economy is entirely untouched. STANDING INVARIANT applied: payload constant vs frame, THE FRAME WINS.

### `economy/cho-han-ev-negative-at-cap` — HELD [A2] ⚑ OVERTURNS LEDGER

Cho-Han is EV-neutral only away from the purse ceiling: because the 2x payout goes through changeGold(), which clamps to getMaxCoins(), a win that would overflow the purse is silently truncated while the loss is always full — so at the cap the game is strictly EV-negative.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1833 `StatsManager.changeGold(this.bet * 2);` against StatsManager.as:2656-2660 changeGold, which opens `var maxCoins:int = getMaxCoins();`, and StatsManager.as:2632-2650 getMaxCoins (1000 by default)`
- **Quote:** InteractUI.as:1831-1834 — `if(isEven && choice == 0 || !isEven && choice == 1)\n{\n   StatsManager.changeGold(this.bet * 2);` ... StatsManager.as:2656-2658 — `public static function changeGold(num:int) : int\n{\n   var maxCoins:int = getMaxCoins();`
- **Overturns:** "gold has legit non-cash faucets (rebirth/tournament/betting)"
- **Lane impact:** economy. Strengthens the survey's own correction rather than contradicting it: betting is not merely a zero-EV variance device, it is a NET COIN SINK for any player near the default 1000-coin purse cap — which, given the ladder starts at 1000 and Reinforce costs 5000, is most of the early game. This joins the coin-purse cap ladder as part of the same pacing mechanism and further removes 'betting' from the ledger's list of legitimate gold faucets.

### `economy/en-string-table-located-partial` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

An English UI string table IS located and embedded in the android bundle, and low-ID service strings resolve against it — but the item-name (4000+) and NPC-name (5060+) ranges do not, so the §2.1 blocker is narrower than 'unlocated' but still open where it matters.

- **Cite:** `reference/decompiled/shs3_android/scripts/Mobile_Lang_EN.as:5, consumed by LangManager.as:73-78`
- **Quote:** Mobile_Lang_EN.as:5 — [Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]
LangManager.as:73-78 — public static function getString(num:int, paramArray:Array = null) : String { ... var output:String = Locale.loadStringEx(num.toString(),language);
- **Overturns:** "KNOWN BLOCKER (GAUNTLET.md §2.1): item/skill/npc <name>, <desc>, <displayname> and cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED. ui_strings.txt is NOT it. bindata/ is now EXHAUSTED as a candidate."
- **Lane impact:** Sharpens §2.1 rather than closing it. Service-side strings DO resolve (id 63 -> 'Coins', 83 -> 'Buy', 88 -> the insufficient-funds dialog, each matching its InteractUI/ShopUI call site), so UI chrome for the economy screens is nameable today. Item names are not: ids 4000 and 4172 from itemdata.xml:30/34 have no entry. The survey's caveat 'prices are portable, names are not' stands verbatim — but the search for the item-name table should now target the android asset numbering, not reference/extracted/bindata/, and 121_Mobile_PremiumData.bin remains the other unextracted blob.

### `economy/iap-tiers-on-film` — HELD [A1] ⚑ OVERTURNS LEDGER

The real-money IAP tier table is fully held at A1: five gold packs priced in USD on the in-game GET GOLD storefront, so the premium economy's SOURCE is recoverable, not lost.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-17/frames/frame_0003.jpg, crop (200,20)-(560,300) upscaled x4 (full-frame view for rows 4-5)`
- **Quote:** 50 GOLD 4.99 USD · 125 GOLD 9.99 USD · 200 GOLD 14.99 USD (MOST POPULAR!) · 275 GOLD 19.99 USD · 400 GOLD 24.99 USD — with Super Rewards / TrialPay offer-wall buttons, a FEATURE WISHLIST button, and the footer 'Purchasing gold will support Straw Hat Samurai: Duels and help fund the development of new features!'
- **Overturns:** "**The dead IAP economy** — design an offline gold faucet; `HAS_CASH_PURCHASE=false` already commits to this."
- **Lane impact:** Kills the §6 'structurally UNRECOVERABLE' entry outright rather than halving it: source (5 USD tiers), denomination (1 gold = 1000 coins, InteractUI.as:918-926) and sink (304 <heavenlyprice> rows) are all held. HAS_CASH_PURCHASE=false stays a deliberate deviation, but an offline gold faucet can now be calibrated against the original's real dollar-per-gold curve. Also grounds the previously uncited Ready bullet 'IAP tiers' and corrects SYNTHESIS.md:520, which cites B-17's gold-priced Ninja Shop grid for this instead of the dollar screen in the same segment.

### `economy/inn-cost-frame-corroborates-formula` — HELD [A4] ⚑ OVERTURNS LEDGER

A longplay frame independently confirms the inn-rest formula: the innkeeper's filmed line reads COST: 8 COINS at a node where the player is level 4, and the payload rule is nodeLevel x 2.

- **Cite:** `docs/research/video-study/segments/A-07-toshibara-castle-town-arrival-yasuka-at-.md:27 (level badge read as 4 in the adjacent segments A-09:4 and A-10:4); payload rule at reference/decompiled/shs3_android/scripts/InteractUI.as:229`
- **Quote:** A-07:27 — "Inn 'Rest' service cost (t=18:05/18:08, innkeeper dialogue): `COST: 8 COINS` — restores 'HEALTH, CHI AND AP' per the innkeeper's stated line"
InteractUI.as:229 — "inncost = NodeGenerator.instance.getNodeLevel(StageManager.getCurrentNode()) * 2;"
- **Overturns:** "- **Surface:** Forge 700c (the −70 HUD read is a capture artifact); Writ of Release 25g now double-confirmed; War-Room structure coin costs absent from config."
- **Lane impact:** The first genuine frame-vs-payload agreement in this unit, and it goes the survey's way: 8 = 4 x 2. Promotes the service-price formulas from android-0682-only (the ceiling economy/provenance-android-0682 imposes) to frame-corroborated on at least one row, and by the same arithmetic reads the ledger's 'Forge 700c' as a level-7 node sample of level x 100. Also flags A-07:54's 'Rest cost is a flat 8 COINS INFERRED constant' as a doc row now superseded — it is a formula, not a constant.

### `economy/merchant-is-procedural-not-dead` — HELD [A2] ⚑ OVERTURNS LEDGER

Merchant shop stock is generated client-side and deterministically at ShopUI.showBuyMerchant -- 8 rare plus 8 legendary-premium items seeded by currentNode x serverDate -- so it is fully recoverable offline, not a server-pushed hole.

- **Cite:** `reference/decompiled/shs3_android/scripts/ShopUI.as:190-204 (entered from InteractUI.as:811-814 case "merchantbuy")`
- **Quote:** var seed:int = StageManager.getCurrentNode() * QueryManager.instance.getServerDate();
ItemGenerator.instance.setRNGSeed(seed);
var rng:RNG = new RNG(seed);
for(i = 0; i < 8; i++)
{
   xsi = new XMLShopItem(new XML());
   xsi.initRandomRareMerchantItem(rng);
   this.currentItemList.push(xsi);
}
for(i = 0; i < 8; i++)
{
   xsi = new XMLShopItem(new XML());
   xsi.initRandomLegendaryMerchantPremiumItem(rng);
   this.currentItemList.push(xsi);
}
- **Overturns:** "two-vendor tiers"
- **Lane impact:** Overturns the surveyor's own economy/five-vendor-generators lane_impact ('merchant ... a genuine hole an offline build must author'). Adds a THIRD node x serverDate deterministic generator alongside trade goods and premium rotation, all reproducible with the project's injected mulberry32 -- the config module the economy lane needs must cover vendor stock, not just prices. The item pools it draws from are also on disk verbatim: LootDialog.as:79/81/83 randomMerchantItemList1/2/3.

### `economy/minus-70-is-a-repair` — HELD [A1] ⚑ OVERTURNS LEDGER

The famous '-70 forge HUD read' is not a capture artifact and not a forge — it is a Repair Weapon at node level 7 (nodeLevel x 10), which simultaneously frame-proves the forge, repair and reinforce price laws.

- **Cite:** `reference/frames/Nr4fQstqHDM/seg-10/frames/frame_0039-0042; coin crops (0,0)-(150,42) upscaled x4; dialogue crops (0,380)-(700,576) upscaled x2`
- **Quote:** frame_0039 = 531 COINS · frame_0040 = 531 COINS with 'FORGE AN IRON SWORD (LEVEL 7)? / COST: 700 COINS / MATERIALS NEEDED: 2 IRON ORE' · frame_0041 = 531 COINS with 'WHAT CAN I DO FOR YOU TODAY?' (forge declined, purse unchanged) · frame_0042 = 461 COINS with 'REINFORCE YOUR CURRENTLY EQUIPPED WEAPON TO MAKE IT UNBREAKABLE? / COST: 5000 COINS / MATERIALS NEEDED: 1 SILVER ORE'
- **Overturns:** "Forge 700c (the −70 HUD read is a capture artifact)"
- **Lane impact:** Deletes 'capture artifact' from the economy Surface bullet and closes segments/B-10's standing 'resolve this before hard-coding' flag. Upgrades economy/repair-weapon-cost and economy/service-prices-are-formulas from A2-only to A2+A1. Also supplies the one hard datapoint on the 0.682-vs-0.717 question: the Android service formulas reproduce a web-build frame to the coin, so the provenance discount should NOT be applied uniformly across this lane.

### `economy/plus-8-coins-provenance` — HELD [A4] ⚑ OVERTURNS LEDGER

The '+8 COINS' the ledger, src/config/economy.ts and the survey's reconciliation all lean on has no OG artifact behind it — it is this repo's own build screenshot plus an unsourced wiki line that SYNTHESIS already retracted.

- **Cite:** `src/config/economy.ts:24-35 (docblock); docs/research/original-game-facts.md:74; docs/research/video-study/SYNTHESIS.md:520; docs/sessions/-SESSION-LOG.md:204, :525, :739, :2095, :2241`
- **Quote:** src/config/economy.ts: "Our +10/+8 was an INFERRED seed verified only against OUR OWN build's screenshots; it was never an OG measurement" · original-game-facts.md:74: "10 XP / 8 coins per foe level (kills rewarding XP+coins is confirmed; formula isn't)" · SYNTHESIS.md:520: "⬆ upgraded to **contradicted-as-formula**"
- **Overturns:** "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."
- **Lane impact:** Any future finding that 'reconciles' a payload formula against 'the filmed +8 COINS' is reconciling against our own render and is VOID under §0. The ledger's '=8 is an unconfirmed INFERRED seed' was, if anything, too generous — it is not a seed from the OG at all. src/config/economy.ts:37 KILL_REWARD.coinsFlat = 8 should be replaced by the EnemyPlayer.as:1298 generator, and the docblock's 'COINS have NO source formula found' line is now false.

### `economy/premium-vendor-stock-held` — HELD [A2] ⚑ OVERTURNS LEDGER

The premium vendor's entire stock table is held verbatim as an embedded asset — 176 item ids across a <default> list, a <special> list and 23 <rotation> <set> blocks — which the survey treated as server-side QuestEngine lists and the ledger's 'IAP tiers' bullet never sourced.

- **Cite:** `reference/decompiled/shs3_android/scripts/Mobile_PremiumData.as:5 [Embed(source="/_assets/121_Mobile_PremiumData.bin")]; extracted from reference/decrypted/shs3_android_payload_decoded.swf via reference/tools/ffdec/ffdec-cli.jar; consumed by QuestEngine.loadPremiumData at QuestEngine.as:196-212 into premiumDefaultList/premiumSpecialList/premiumRotationList, read by XMLShopData.initPremiumItems at XMLShopData.as:98-131`
- **Quote:** <premiumdata>\n<default>\n<item>2208</item>\n<item>2209</item>\n<item>2212</item>\n<item>2215</item>\n<item>2213</item>\n<item>2100</item>\n<item>2101</item>\n<item>2102</item>\n<item>2125</item> ... </default>\n<special> ... <rotation> ... <!-- Mist Swords -->\n<set>\n<item>2171</item>\n<item>13036</item>\n<item>13037</item>\n<item>13038</item>\n<item>13039</item>\n<item>13040</item>\n<item>13041</item>\n<item>13042</item>\n</set>\n</rotation>\n</premiumdata>  — tag histogram: 176 <item>, 23 <set>, 1 each of default/special/rotation; ZERO price/usd/tier/cost strings
- **Overturns:** "IAP tiers"
- **Lane impact:** economy. Splits the ledger's uncited 'IAP tiers' bullet in two: the premium SHOP (what gold buys, and in which weekly-rotating sets) is now fully portable, while the real-money PRICE tiers stay STILL_UNHELD — the blob contains no currency strings at all. The rotation sets even ship with designer comments (e.g. '<!-- Mist Swords -->') naming each set, and joined to the string table those 176 ids resolve to real item names. Note the survey's stated obstacle was wrong: the blob is not missing, it had simply never been exported — reference/preservation/shs3_android_payload.swf throws EndOfStreamException in ffdec, but reference/decrypted/shs3_android_payload_decoded.swf exports all 42 blobs cleanly.

### `economy/quest-coin-faucet` — HELD [A1] ⚑ OVERTURNS LEDGER

Quests are a coin faucet — story quests carry <reward><loot><id>0</id><qty>N</qty>, rendered as 'N COINS' and paid to the purse — so the survey's 'coin faucet set is closed and enumerable' is false.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-29/frames/frame_0013.jpg, crop (490,340)-(760,460) upscaled x5; corroborated by reference/extracted/questdata.xml:4162-4175 and QuestLogUI.as:456-461`
- **Quote:** REWARD / 250 XP / 30 COINS / TOWN PROSPERITY: +5  — and the same segment's coin counter (crop (0,0)-(220,60) x5) reads 365 COINS at frame_0012 and 395 COINS at frame_0020, delta exactly +30
- **Overturns:** "④ full XP-income model (quest/gather/dungeon, not just kills)."
- **Lane impact:** Re-opens the economy coin-faucet enumeration the survey closed. A rebuild must model quest coin payouts (+30, +35 observed) alongside kill/chest/crop/trade-goods/sell/war/conversion. Also gives the quests lane a verbatim payload row (exp 750 + 30 coins) that matches A-24's filmed HUD deltas exactly.

### `economy/sell-formula-frame-check` — HELD [A1] ⚑ OVERTURNS LEDGER

The getSellAmt() formula predicts every filmed SELL badge, including the zero-price outlier, which the survey never checked because it opened no frames.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0008.jpg — grid crop (40,120)-(330,500) upscaled x4, detail crop (620,120)-(1010,420) upscaled x3`
- **Quote:** Badges visible: straw hat 5, white garment 5, katana 10, green-bordered sword 15, garment 5, PICKAXE 10. Detail pane: 'TORN GARMENT / OWNED: 1 / LEVEL 1 / DEFENSE: +1 (EQ: 1) / WEIGHT: 5' with badge 5. Predictions: pickaxe weight 10 -> (1+0)*10 = 10 ✔; torn garment weight 5, 0 modifiers -> (1+0)*5 = 5 ✔; green sword -> (1+2)*5 = 15 ✔; consumables (2xxx ids, itemID < 3000) -> 1 ✔; 'stick 0' -> ShopUI.as:395-397 'else if(slot.getItemID() == 13002){ slot.setCost(0,0); }' ✔
- **Overturns:** "③ sell-price formula."
- **Lane impact:** Promotes economy/sell-price-formula (and items-equipment blocker ③) from A2-only to A2 + A1 with six independent price points and zero misses. Adds one payload detail the survey missed and a porter needs: item 13002 is hard-coded to sell for 0.

### `economy/string-table-located` — HELD [A2] ⚑ OVERTURNS LEDGER

The string table that GAUNTLET §0 lists as the standing KNOWN BLOCKER is LOCATED: it is the embedded asset 118_Mobile_Lang_EN.bin in the android payload SWF, a UTF-16LE XLIFF with 5,110 trans-units keyed by resname 0-9010 plus IDS_* quest keys, and it resolves item, skill, vendor, war, UI and quest name/desc IDs.

- **Cite:** `reference/decompiled/shs3_android/scripts/Mobile_Lang_EN.as:5 declares [Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]; extracted with `java -jar reference/tools/ffdec/ffdec-cli.jar -export binaryData <out> reference/decrypted/shs3_android_payload_decoded.swf` (42 blobs, 1.6s). Key proof: reference/decompiled/shs3_android/scripts/fl/lang/Locale.as:301-307 and :168-173`
- **Quote:** Locale.as:301-307 — `var _loc2_:String = param1.attributes.resname; if(_loc2_.length > 0 && ...) { _loc3_ = parseSource(...); if(_loc3_.length > 0) { stringMap[_loc2_] = _loc3_;` ... Locale.as:168-173 — `public static function loadStringEx(param1:String, param2:String) : String { var _loc3_:Object = stringMapList[param2]; if(_loc3_) { return _loc3_[param1]; }` ... and from the extracted table: `<trans-unit id="940" resname="4000"><source>Small Soldier Pill</source></trans-unit>`, `<trans-unit id="1112" resname="4172"><source>Replenish your AP without waiting!</source></trans-unit>`, `<trans-un
- **Overturns:** "KNOWN BLOCKER (GAUNTLET.md §2.1): item/skill/npc <name>, <desc>, <displayname> and cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED. ui_strings.txt is NOT it. bindata/ is now EXHAUSTED as a candidate. So numbers are portable today; NAMES ARE NOT."
- **Lane impact:** Cross-cutting: unblocks EVERY lane, not just economy. L0-economy (item/vendor/service names), items-equipment (982 item names + descs), skills-meters (75 skill displaynames + 182 level descs), enemies-ai (npc displaynames), quests-story (IDS_* quest titles/steps/dialogue), UI/HUD (all button and dialog copy). Two riders must travel with it: (1) key on `resname`, NOT `id` — they have drifted (id 618 carries resname 637), so an id-keyed port produces silently wrong text; (2) provenance is v0.682 ANDROID — I ran the identical extraction on reference/decrypted/shs3_payload_decoded.swf (web v0.717) and it yields only the 27 known bindata blobs with no lang table, because LangManager.setLanguage (LangManager.as:52-56) fetched shs3_en.xml from the dead server on web. So names inherit economy/provenance-android-0682's caveat exactly.

### `economy/trade-goods-are-named` — HELD [A2] ⚑ OVERTURNS LEDGER

The five trade-goods commodities are not anonymous indices — they are Tea Leaves (base 10c, variation 20), Silk (20c/30), Spices (100c/15), Ceramics (200c/30) and Opium (Illegal) (200c/30), the last of which implies a contraband/legality hook nobody in the ledger has ever mentioned.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:545-548 (getString(4162..4165) paired with getGoodsPriceString(0..3) and stats 20054-20057); names resolved through the extracted 118_Mobile_Lang_EN.bin at resname 4162-4166`
- **Quote:** InteractUI.as:545 — `this.detailstext.text = LangManager.getString(4162) + this.getGoodsPriceString(0,StatsManager.getStat(20054));` ... lang table: resname 4162 <source>Tea Leaves</source> · 4163 <source>Silk</source> · 4164 <source>Spices</source> · 4165 <source>Ceramics</source> · 4166 <source>Opium (Illegal)</source>
- **Overturns:** "### economy — 48
- **Ready:** currencies + guest start; all service prices; Forge/Reinforce/Rebirth/Writ costs; War-Room structure costs; crop 5–20c; IAP tiers; two-vendor tiers; gold has legit non-cash faucets (rebirth/tournament/betting)."
- **Lane impact:** economy, and the first concrete demonstration that the located string table pays off inside this lane. The arbitrage subsystem the survey found goes from five nameless price curves to a shippable, named commodity ladder. '(Illegal)' on commodity 4 is a live lead: it is priced identically to Ceramics (200/30) yet flagged, so an offline port must decide whether legality was cosmetic flavour or a real risk/reward hook — a design question the ledger cannot even pose today.

### `items-equipment/carry-weight-string-corroboration` — HELD [A2] ⚑ OVERTURNS LEDGER

The string table independently corroborates the 100 + rank*20 carry-weight track that the survey derived from code alone.

- **Cite:** `char-id 118 of reference/decrypted/shs3_android_payload_decoded.swf, trans-units 138, 1507, 1653, 1654; formula at StatsManager.as getCarryingWeight()`
- **Quote:** 1507 'Carrying Weight+'  |  1653 'Carrying weight: 120'  |  1654 'Carrying weight: 140'  |  138 'You are carrying too many things to travel.&#10;&#10;Upgrade the Carrying Weight+ skill to carry more items.'  vs  `return 100 + getStat(1009) * 20;`
- **Overturns:** "weight cap 100"
- **Lane impact:** L3 + L10 — 120 and 140 are ranks 1 and 2 of the +20/rank track, from an artifact wholly independent of StatsManager.as. Stat 1009 is the 'Carrying Weight+' skill, and overweight blocks travel (not pickup), which string 138 states in the game's own words.

### `items-equipment/condition-tier-names-exact` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The ledger's unnumbered 'condition tier names' are now exact: five sequential table entries match Item.getDesc's five branches in order - Broken / Poor / Used / Usable / Good - plus 'Unbreakable'.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:713-742 read against DefineBinaryData char-id 118 of reference/decrypted/shs3_android_payload_decoded.swf at offset -20`
- **Quote:** Item.as branch order: condition==0 -> getString(387+1=388); <25 -> 389; <50 -> 390; <75 -> 391; else -> 392.  Table at -20: 368 'Condition: Broken', 369 'Condition: Poor', 370 'Condition: Used', 371 'Condition: Usable', 372 'Condition: Good'; 620 'Unbreakable'.
- **Overturns:** "- **Ready:** ... condition tier names; weight cap 100; ..."
- **Lane impact:** L3 + L8 - the five bands become shippable strings with their exact numeric cutoffs (0 / <25 / <50 / <75 / else on a 0-100 percentage, with two extra states for uses==0 and uses==1). PARTIAL because docs/research/video-study/SYNTHESIS.md:186 observed 'UNBREAKABLE / WELL-MAINTAINED / GOOD / USABLE' on the web build and 'WELL-MAINTAINED' is absent from the Android table - THE FRAME WINS, so the web wording differs and these five are the Android build's words.

### `items-equipment/condition-tier-names-recovered` — HELD [A2] ⚑ OVERTURNS LEDGER

The ledger's unnumbered 'condition tier names' are recovered verbatim: six of them, at string-table ids 368-373.

- **Cite:** `char-id 118 of reference/decrypted/shs3_android_payload_decoded.swf, trans-units 368-373`
- **Quote:** 368 'Condition: Broken' · 369 'Condition: Poor' · 370 'Condition: Used' · 371 'Condition: Usable' · 372 'Condition: Good' · 373 'Condition: Well-Maintained'
- **Overturns:** "condition tier names"
- **Lane impact:** L3 — the six band labels are transcribable today. They pair with the seven-branch selector in Item.getDesc() (uses==0, uses==1, condition==0, <25, <50, <75, else); pinning which label goes with which branch still needs a same-build id table per the drift finding.

### `items-equipment/frame-confirms-name-id-4050` — HELD [A1] ⚑ OVERTURNS LEDGER

The video independently validates the -3060 offset: the quest item named on screen as 'IRON SWORD' is itemdata id 13113, whose <name> is 4050, which resolves to table entry 990 = 'Iron Sword'.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0024.jpg - 1024x576 source, crop (0,420)-(640,500), upscaled 3x LANCZOS`
- **Quote:** Visibly in the crop: 'I AM LOOKING FOR' in white, then 'DRAFTY SHARP IRON SWORD OF PIERCING' in bright blue, then ' .' - the basename 'IRON SWORD' matches table id 990 reached from <name>4050 at offset -3060.
- **Overturns:** "item/skill/npc <name>, <desc>, <displayname> and cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED."
- **Lane impact:** L1b - this is the anchor that makes the offset an evidenced mapping rather than a curve fit. A frame, the payload XML and the extracted string table all agree on one item's name, which is the standard L1b should hold every other id block to.

### `items-equipment/item-names-are-in-the-extracted-table` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

English item base names ARE present verbatim in the already-extracted 2,555-entry string table — ids 980-1011 are a contiguous item-name block — so the correct blocker is the id-to-name MAPPING, not the names themselves.

- **Cite:** `char-id 118 of reference/decrypted/shs3_android_payload_decoded.swf (500,024 B UTF-16LE XLIFF), extracted by me via an SWF tag-87 walk; trans-units 980-1011 and 1063/1083/1085/1100/1215/1307`
- **Quote:** 980 Stick · 981 Branch · 982 Bamboo · 983 Flute · 984 Spoon · 985 Fork · 986 Bat · 987 'Stick with nail' · 988 Katar · 989 'Training Sword' · 990 'Iron Sword' · 991 'Iron Sabre' · 992 'Dragon Blade' · 993 'Thunder Blade' · 994 'Bevel Edge' · 995 Defender · 996 'Heavy Armor' · 997 Cleaver · 998 Potion · 999 Scroll · 1000 Amulet · 1005 'Broken Sandal'; also 1063 'Worn Sandals', 1083 'Sword Repair Kit', 1085 'Bronze Sword', 1100 'Steel Sword', 1215 'Gaius Sword', 1307 "Inokichi's Club (Broken)"
- **Overturns:** "KNOWN BLOCKER (GAUNTLET.md §2.1): item/skill/npc <name>, <desc>, <displayname> and cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED. ui_strings.txt is NOT it. bindata/ is now EXHAUSTED as a candidate."
- **Lane impact:** L1b (STRING TABLE) — restate the blocker. The table is located, extracted and READABLE, and it contains item names; what is missing is the mapping, because the web itemdata.xml <name> ids reach 4427 while this Android table stops at 2554. Next step is to obtain the web build's shs3_en.xml (./data/ or <server>/strings/) or to align the two id spaces, not to keep hunting for 'the table'. 74 of 804 <name> ids already fall inside the extracted slice and resolve today.

### `items-equipment/item-names-partially-held` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

Item names are PARTIALLY HELD, not unheld: 74 of 804 itemdata <name> ids resolve against the extracted table, and trans-units 960-1011 are a contiguous English item-name block containing the exact 'Iron Sword' the survey's own frame shows on screen.

- **Cite:** `char-id 118 (500,024 B UTF-16LE XLIFF) extracted from reference/decrypted/shs3_android_payload_decoded.swf, cross-resolved against reference/extracted/itemdata.xml; XMLItem.as:64`
- **Quote:** 989 'Training Sword'  990 'Iron Sword'  991 'Iron Sabre'  992 'Dragon Blade'  993 'Thunder Blade'  994 'Bevel Edge'  995 'Defender'  996 'Heavy Armor'  997 'Cleaver'  |  965 'Straw Hat' 966 'Helmet' 967 'Hat' 968 'Hood' 969 'Top Hat' 970 'Afro Wig' 971 'Mask' 972 'Pants' 973 'Heavy Armor Pants' 974 'Torn Pants' 975 'Ninja Pants'  |  resolved bindings: items 6000-6520 -> name 34 -> 'Hair' (73 items); items 2122/2123/2124 and 20100/20101/20102 -> 443/444/445 -> '(八段)' '(九段)' '(十段)'; desc 207 -> 'Quest Item'
- **Overturns:** "KNOWN BLOCKER (GAUNTLET.md §2.1): item/skill/npc <name>, <desc>, <displayname> and cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED. ui_strings.txt is NOT it. bindata/ is now EXHAUSTED as a candidate."
- **Lane impact:** L1b (STRING TABLE) — flips from STILL_UNHELD to PARTIAL. The survey's negative test grepped Katana/Wakizashi/Tanto/Nodachi; SHS3 weapons are 'Iron Sword', 'Iron Sabre', 'Dragon Blade', 'Thunder Blade', 'Bevel Edge', 'Defender', 'Cleaver', 'Training Sword', 'Katar'. Also corrects the coverage figure: §1t123s0§.as:900 calls getString(11253), so the full space is >=11,257 and the 2,555-entry slice is <=23%, not a third.

### `items-equipment/sell-formula-exact` — HELD [A2] ⚑ OVERTURNS LEDGER

Sell price is `1` for ids under 3000, `(1 + affixCount) * 10` for items of weight >= 10, and `(1 + affixCount) * 5` otherwise - a step function of weight and affix count that never touches baseprice, item level or the dead sellPercentage.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1582-1593 (reached from ShopUI.as:401 `slot.setCost(slot.getItem().getSellAmt(),0)`)`
- **Quote:** public function getSellAmt() : int { if(this.itemID < 3000) { return 1; } if(this.getWeight() >= 10) { return (1 + this.getModifierCount()) * 10; } return (1 + this.getModifierCount()) * 5; }
- **Overturns:** "9. **Sell price is NOT flat per item** - it scales with rarity/level (same sword 5c and 25c). Don't encode flat-per-type."
- **Lane impact:** L10 (PROGRESSION + ECONOMY) - blocker (3) is CLOSED, not 'mostly closed'. Cross-validated against the video ledger: docs/research/video-study/segments/B-09-castle-town-toll-gate-and-shop.md:77 records 'Iron Sabre ... WEIGHT 5, sell price 5 coins' and (1+0)*5 = 5 exactly, while 5c/25c for the same sword is (1+0)*5 and (1+4)*5. It also corrects §3 #9 itself: the formula has no LEVEL term - the second axis is WEIGHT, not level. L3 must expose affixCount and weight to the shop layer; nothing else is needed to price a sale.

### `items-equipment/string-table-cracked-for-items` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The string table blocker falls for items: a constant offset of -3060 against the already-extracted 2,555-entry Android table resolves 730 of 804 item <name> ids and 174 of 178 <desc> ids to correct English text, and the remaining 74 resolve at offset 0.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:62-64 joined to DefineBinaryData char-id 118 of reference/decrypted/shs3_android_payload_decoded.swf against reference/extracted/itemdata.xml`
- **Quote:** XMLItem.as:64  this.displayname = LangManager.getString(xml.name);   |   resolved at -3060: 4040->'Stick' 4041->'Branch' 4049->'Training Sword' 4050->'Iron Sword' 4025->'Straw Hat' 4099->'Bandana' 4058->'Potion' 4182->'Leather Gloves' 4193->'Zanpakuto' 4244->'Pickaxe' (desc 4245->'Used for mining.') 4381->'Whisper Sword' 4308->'Warlord Scythe' 4170->'Face' (desc 4171->'Change your face')   |   at offset 0: item 6000 <name>34 -> 'Hair'   |   coverage: name 730/804, desc 174/178
- **Overturns:** "KNOWN BLOCKER (GAUNTLET.md §2.1): item/skill/npc <name>, <desc>, <displayname> and cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED. ui_strings.txt is NOT it. bindata/ is now EXHAUSTED as a candidate."
- **Lane impact:** L1b + L3 - L1b's exit condition is now answerable for the item half and its job changes from 'find the table' to 'anchor each id block'. PARTIAL, not HELD, for two honest reasons: (a) the Android table is a different build revision from the Android AS3, so the offset is PIECEWISE (0 for ids <= ~199, -20 for the ~380-880 UI block, -3060 for the 4000+ item-name block) and every block must be anchored before use; (b) docs/research/video-study/SYNTHESIS.md:186 records a condition label 'WELL-MAINTAINED' the Android table does not contain, so the web build's wording differs in places - THE FRAME WINS, and each shipped name still needs a frame check. L3 is no longer name-blocked; it is name-provisional.

### `items-equipment/string-table-offset-drift` — HELD [A2] ⚑ OVERTURNS LEDGER

The extracted table is the RIGHT table with a ~-19/-20 revision drift above id ~350 (exact below ~210), which is why the survey's spot-checks looked like misses — this recovers the condition tier names, the 11 procedural colour names and the six elemental/crit/piercing stat labels verbatim.

- **Cite:** `char-id 118 ids 368-373, 413-423, 851-856 vs reference/decompiled/shs3_android/scripts/Item.as:712-745, ItemGenerator.as:93 + :701, Item.as:1238-1268`
- **Quote:** 368 'Condition: Broken' 369 'Condition: Poor' 370 'Condition: Used' 371 'Condition: Usable' 372 'Condition: Good' 373 'Condition: Well-Maintained'  (AS3 uses 387-392)  |  413 Red 414 Orange 415 Yellow 416 Green 417 Blue 418 Purple 419 Pink 420 Brown 421 White 422 Grey 423 Black  — 11-for-11 against colorhexlist [16711680,16737792,16763904,39168,13311,6684927,16751103,6697728,16777215,10066329,0]  (AS3 uses 432-442)  |  851 'Fire DEF' 852 'Wind DEF' 853 'Water DEF' 854 'Earth DEF' 855 'Critical Damage' 856 'Piercing Damage'  (AS3 uses 871-876)
- **Overturns:** "- **Ready:** ... condition tier names; ..."
- **Lane impact:** L1b + L3 + L8 — the ledger's unnumbered 'condition tier names' Ready bullet is now verbatim, and ids 851-856 are the exact strings visible in frame_0031. Anyone resolving further ids must apply the -19/-20 drift above ~350 and take ids below ~210 at face value.

### `items-equipment/z-order-in-actionscript` — HELD [A2] ⚑ OVERTURNS LEDGER

The paperdoll compositing z-order is fully held: MCSCharacter's constructor addChilds parts in partList index order, so display depth equals the PART_ constant (0 l_hand back … 22 prop3 front), closing the 'layer order' half of blocker ⑤.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSCharacter.as:119 and :138-146`
- **Quote:** internal var partListLength:int = 22;  ...  for(var i:int = 0; i <= this.partListLength; i++) { mc = new MovieClip(); addChild(mc); this.partList.push(mc); }
- **Overturns:** "⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker) + item **icon manifest**."
- **Lane impact:** L3 + L6 — blocker ⑤'s layer-order half is CLOSED, leaving only the per-item vector art. Also corrects the rig size: the human rig is 23 parts (0-22), not 27; PART_l_shoulder(23)/r_shoulder(24)/l_knee(25)/r_knee(26) are wolf legs (MCSWolf.as:13 partListLength=25, used at :184-197). One exception to reproduce: MCSBust.as:104 re-addChilds PART_r_uparm to the front for portraits.

### `string-table/resname-is-the-key` — HELD [A2] ⚑ OVERTURNS LEDGER

The string table's lookup key is the trans-unit `resname` attribute, not `id` — and on that key the already-extracted 2,555-entry table resolves 100% of item, npc and skill names and descriptions, so the gauntlet's standing string-table blocker has FALLEN, not merely moved.

- **Cite:** `char-id 118 of reference/decrypted/shs3_android_payload_decoded.swf (500,024 B UTF-16LE XLIFF, decoded by me): `<trans-unit id="990" resname="4050"><source>Iron Sword</source></trans-unit>`; cross-checked against reference/extracted/itemdata.xml:8743-8745 (`<id>13113</id> ... <name>4050</name>`) and reference/decompiled/shs3_android/scripts/LangManager.as:73-79`
- **Quote:** <trans-unit id="990" resname="4050">\n<source>Iron Sword</source>\n</trans-unit>   |   itemdata.xml:8743-8745  <id>13113</id> <type>9</type> <name>4050</name>   |   LangManager.as:77  var output:String = Locale.loadStringEx(num.toString(),language);   |   MEASURED COVERAGE via resname: itemdata <name> 804/804, itemdata <desc> 178/178, npcdata <name> 490/490, skilldata <desc> 201/201, skilldata <displayname> 73/73
- **Overturns:** "KNOWN BLOCKER (GAUNTLET.md §2.1): item/skill/npc <name>, <desc>, <displayname> and cutscene <param> are NUMERIC IDS indexing a string table NOT YET LOCATED. ui_strings.txt is NOT it. bindata/ is now EXHAUSTED as a candidate. So numbers are portable today; NAMES ARE NOT."
- **Lane impact:** L1b (STRING TABLE) — exit condition MET for items, npcs and skills: every one of those ids resolves with an A2 cite today, from a file already on disk. L3 (ITEMS) loses its last gate: the 982-item catalogue is now fully transcribable, names included. Also unblocks the name half of L2/L4 (npc names 490/490) and L7 (skill descs 201/201, displaynames 73/73). Only cutscene <param> remains unchecked by me.

### `combat-core/behead-order-not-uniform` — HELD [A2]

The x1.5 behead multiplier is not applied at the same point in the chain across enemy classes — EnemyClone applies it inside the part switch before defence subtraction, while EnemyShield, EnemyZombie and MCSPlayer apply it after the min-damage floor.

- **Cite:** `reference/decompiled/shs3_android/scripts/EnemyClone.as:421-425 vs EnemyShield.as:344-353 and MCSPlayer.as:3709-3717`
- **Quote:** EnemyClone.as:421-425 `case mcs.partList[MCSCharacter.PART_hat]:` / `case mcs.partList[MCSCharacter.PART_head]:` / `case mcs.partList[MCSCharacter.PART_neck]:` / `damage *= 1.5;` / `behead = true;`  ·  EnemyShield.as:346-353 `damage -= defense;` / `if(damage < damageObj.getMinDamage())` / `{` / `damage = damageObj.getMinDamage();` / `}` / `if(behead)` / `{` / `damage *= 1.5;`
- **Lane impact:** combat-core: a single shared hit resolver in the recreation will diverge from the original on low-damage head hits, where the ordering decides whether the 1.5x lands on the pre-defence number or on the floored number. Ordering must be per-enemy-class, not global.

### `combat-core/crit-label-web-divergence` — PARTIAL [A1]

The web build's crit HUD is not the mobile build's: the frame prints a gold percentage label "150% DAMAGE" plus "CANNOT CHANGE STANCE" across the third bar, where the mobile build loads a single static string "Critical Hit" into crittext and keeps the stance label on an unrelated hover clip.

- **Cite:** `reference/frames/duel_dense/Nr4fQstqHDM_429.0.png, my own crop 560x180+0+900 of the 1920x1080 frame upscaled x3 nearest-neighbour; against BattleUI.as:102 and :430-440`
- **Quote:** Visibly in the crop: green bar `20/20`, blue bar `26/26`, then a tan/olive third bar with `CANNOT CHANGE STANCE` printed across it and gold `150% DAMAGE` beneath. Code: BattleUI.as:102 `this.crittext.text = LangManager.getString(175);` (string 175 = "Critical Hit") · :430-434 `internal function showChangeStanceLabel(event:MouseEvent) : *` / `{` / `this.changestancelabel.visible = true;` — a hover handler, not a state readout.
- **Lane impact:** THE FRAME WINS: for what the web build actually displayed, this crop overrides the mobile source, and it is the first concrete instance of the mobile-vs-web parity gap the surveyor correctly left STILL_UNHELD. It also gives blocker 2 a decisive, cheap close-path: find any duel frame where the third bar is full in a non-Light stance and read the percentage. If it ever reads 120%, the stance-split crit is confirmed for web; if it always reads 150%, web crit is flat and BOTH the MCSPlayer and InventoryUI tables are mobile-only.

### `combat-core/crit-modifier-contradiction` — PARTIAL [A2]

The build ships two mutually inverted crit tables — combat applies Light x1.5 / other x1.2 while the character sheet displays Light x1.2 / Balanced and Heavy x1.5 — so ledger blocker 2 is PARTIAL, not closed.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:1941-1971 vs MCSPlayer.as:3215-3222`
- **Quote:** InventoryUI.as:1941 `if(stance == MCSPlayer.LIGHT_STANCE)` / :1946 `critModifier = 1.2;` · :1950 `else if(stance == MCSPlayer.BALANCED_STANCE)` / :1955 `critModifier = 1.5;` · :1959 `else if(stance == MCSPlayer.HEAVY_STANCE)` / :1964 `critModifier = 1.5;`  ·  MCSPlayer.as:3217-3221 `if(this.stance != LIGHT_STANCE)` / `return maxDamage * 1.2 + this.STAT_CRITICALDMG;` / `return maxDamage * 1.5 + this.STAT_CRITICALDMG;`
- **Lane impact:** combat-core blocker 2 must be re-opened as PARTIAL rather than closed. The same InventoryUI function's dmgModifier, defModifier and slashModifier all agree with combat exactly — only critModifier is flipped, so this reads as a real ship bug, not a decompiler artefact. Config must carry BOTH numbers with a note, and blocker 2's original close-path ('read one crit popup') is now the arbitrating evidence again, not redundant.

### `combat-core/early-ttk-not-universal` — PARTIAL [A2]

'Early mobs die in exactly one hit, unconditionally' is false: level-2 npc rows 7-10 carry hp 5 and defense 3, so a mastery-0 Light swing floored to 1 damage needs five strokes.

- **Cite:** `reference/extracted/npcdata.xml — full 495-row scan; rows with <lvl> <= 5 include ids 6-10; plus Damage.as:160-162`
- **Quote:** (id, lvl, hp, defense) for the lvl<=5 set: (1,3,1,0) (2,3,1,0) (3,3,1,0) (4,3,1,0) (5,3,1,0) (6,2,1,3) (7,2,5,3) (8,2,5,3) (9,2,5,3) (10,2,5,3) (56,3,1,0) (57,3,1,0) (58,3,1,0) (101,1,2,0) (117,5,10,5). hp==1 occurs in 42 of 495 rows. Damage.as:160-162 `if(this.attackerlvl <= 10)` / `{` / `return 1 + this.piercingDamage;`
- **Lane impact:** combat-core blocker 3 closes only for the hp-1/defense-0 subset (42 of 495 rows), not for early mobs generally. Also feeds enemies-ai: the roster's early band is not uniform, and defense 3 at level 2 is enough to force the attacker-level damage floor, which is the mechanism that makes low-mastery Light swings feel useless early. The starter-weapon half of blocker 3 remains open — item 13002 is EnemyElite's NPC fallback (EnemyElite.as:94-97), not an established player starter.

### `combat-core/reload-fill-time` — HELD [A2]

The crit bar's visible fill span (96 ticks / 4.0 s) and the crit gate's actual charge time (120 ticks / 5.0 s from reload = 0) are two different numbers, because the UI maps (reload-24)/(maxreload-24) and therefore reads zero for the first 24 ticks.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:239-241, :1158-1168, :3215; Mobile.as:117`
- **Quote:** MCSPlayer.as:239-240 `this.maxreload = 5 * 24;` / `this.reload = 0;`  ·  :1163-1168 `this.tempreload = this.reload - 24;` / `if(this.tempreload < 0)` / `{` / `this.tempreload = 0;` / `}` / `StageManager.getBattleUI().updateReload(this.tempreload / (this.maxreload - 24));`  ·  :3215 `if(this.reload == this.maxreload)`  ·  Mobile.as:117 `GameEngine.getStageMC().frameRate = 24;`
- **Lane impact:** combat-core + ui-hud: config must carry both, labelled distinctly. A recreation that animates the bar over 5.0 s will look wrong (the first 24 ticks show nothing); one that gates crit at 4.0 s will play wrong (crit arrives a full second early). Note also :3272 uses the same (reload-24)/(maxreload-24) mapping while :3112 uses the raw reload/maxreload — the UI is fed by two inconsistent mappings.

### `combat-core/shake-callers-incomplete` — HELD [A2]

The screen-shake caller catalogue is missing four sites, one of which (a level marker) is the only caller that overrides the default amplitude, making shake amplitude authorable per level.

- **Cite:** `reference/decompiled/shs3_android/scripts/Marker_RumbleTrigger.as:44, MCSPlayer.as:4180 (inside gotDeathTouch, function header :4161), StatsManager.as:3533-3536, Trap_CrusherColumnAuto.as:90; against StageManager.as:1200`
- **Quote:** Marker_RumbleTrigger.as:44 `StageManager.startShake(this.shakeDuration,this.shakeAmt);`  ·  MCSPlayer.as:4180 `StageManager.startShake(12);` (inside `internal function gotDeathTouch(flyVelX:int, flyVelY:int)`)  ·  StatsManager.as:3533-3535 `if(id == 126)` / `{` / `StageManager.startShake(val);`  ·  StageManager.as:1200 `public static function startShake(shakeDuration:int, shakeAmt:int = 30) : *`
- **Lane impact:** art-anim-audio-feel: the shake catalogue is complete only after adding these. None is an ordinary landed slash, so the surveyor's headline conclusion survives, but Marker_RumbleTrigger means amplitude is level-authored data rather than a fixed constant, and StatsManager.as:3535 means cutscenes can call shake with a scripted amount — both need a data hook in the recreation, not a hard-coded 30.

### `combat-core/white-popup-dead-code` — HELD [A2]

The white (0xFFFFFF) triangle-advantage damage popup is unreachable dead code, and the player's own damage numbers always render black (0x000000), never dark red.

- **Cite:** `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3584, :3700, :3706, :3803-3809; identical pattern EnemyClone.as:348/433/439/514-516`
- **Quote:** MCSPlayer.as:3584 `var damagetextcol:int = 0;` · :3700 `damagetextcol = 0;` · :3704-3706 `if(this.controlledBy != 0)` / `{` / `damagetextcol = 16777215;` · :3803-3805 `if(this.controlledBy == 0)` / `{` / `ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),damagetextcol);`
- **Lane impact:** combat-core + ui-hud: corrects two errors in the surveyed output. The stance-triangle claim's gloss ('white popup = an NPC landing a triangle hit on you') is inverted — `this` is the victim, so `!= 0` means a NON-player victim — and is moot anyway because the assignment branch and the read branch are exact complements. The damage-popups claim's 'physical 0x990000' is wrong for the player-victim case. A recreation should paint enemy popups 0x990000, player popups 0x000000, and never render a white one.

### `economy/coin-purse-tier-has-no-writer` — PARTIAL [A2]

The coin-purse cap ladder's values are held but its advancement path is not: stat 1011 has exactly one read and zero writes across all 559 files of the android bundle, so nothing in the client raises the tier.

- **Cite:** `reference/decompiled/shs3_android/scripts/StatsManager.as:2634 — the sole true reference to stat 1011 in the bundle (grep across all 559 scripts; every other hit is a substring of item IDs like 11011)`
- **Quote:** switch(getStat(1011))
- **Overturns:** "### economy — 48
- **Ready:** currencies + guest start; all service prices; Forge/Reinforce/Rebirth/Writ costs; War-Room structure costs; crop 5–20c; IAP tiers; two-vendor tiers; gold has legit non-cash faucets (rebirth/tournament/betting)."
- **Lane impact:** Splits the survey's new coin-purse claim. The six cap values (1000..10000) are A2-held and portable. The word 'upgrade tier' is unsourced — no purchase, quest reward or level-up in the bundle writes 1011, so the ladder is presumably server- or IAP-driven and the climb becomes an honest labelled INFERRED design choice. Matters because the default 1000 cap against a 5000c Reinforce and an 8000c max Forge IS the mid-game pacing curve the survey rightly highlights; without the climb, that curve has no exit.

### `economy/guest-gold-frame-wins` — HELD [A4]

The repo's frame-backed guest start of 3 heavenly gold beats the android bundle's STAT_HGOLD = 0; the two disagree and THE FRAME WINS, so this is a platform/version divergence, not a correction to the repo.

- **Cite:** `docs/research/video-study/segments/A-00-boot-login.md:111-112 and :150; corroborated A-07-toshibara-castle-town-arrival-yasuka-at-.md:20; contradicted row at reference/decompiled/shs3_android/scripts/StatsManager.as:706`
- **Quote:** A-00:111-112 — "Header: 'PLAYER'; red 'STATS' tab button; currency row '114 COINS', '3 GOLD' (guest starts with 3 gold)"
A-00:150 — "Fast travel costs 5 gold via quest log; guest starts 100 coins / 3 gold."
StatsManager.as:706 — "setPlayerStats(STAT_HGOLD,0);"
- **Overturns:** "currencies + guest start"
- **Lane impact:** First concrete instance of the version risk economy/provenance-android-0682 warns about: android 0.682 and web 0.717 differ on a starting value. Sets the precedent for the whole gauntlet — where an android AS3 row and a longplay frame disagree, the frame is the target and the row is a labelled divergence. src/config/profile.ts:10 stays as written; the survey's 'contradicts its 3 gold' must be rewritten.

### `economy/phantom-plus-8-coins-frame` — HELD [A4]

The journal's 'Frame-vs-doc note' cites a filmed '+8 COINS' HUD read that does not exist; the +8 came from the repo's OWN build screenshot, and the real OG frames record 2 coins and 12 coins per encounter.

- **Cite:** `docs/research/video-study/segments/A-00-boot-login.md:101-103 (the real frames); phantom-frame proof at src/config/economy.ts:28-30 and docs/sessions/-SESSION-LOG.md:2095`
- **Quote:** A-00-boot-login.md:101-103 — "a gold-frame results modal: 'YOU RECEIVED' + coin icon count + 'XP' count + OK. Observed: fight 1 (3 bandits) -> 2 coins, 53 XP; fight 2 (bandit mob + Jinbei L3, with ally) -> 12 coins, 444 XP."

src/config/economy.ts:28-30 — " * Our +10/+8 was an INFERRED seed verified only against OUR OWN build's\n * screenshots; it was never an OG measurement, so the Stage-2 gate row that\n * reads \"+10 XP / +8 COINS\" is updated rather than left silently false."
- **Overturns:** "① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**; 20+ samples show no XP formula either)."
- **Lane impact:** Strikes a fabricated A1 from docs/gauntlet/L0/systems/economy.md:121-125 and replaces it with the genuine article. The two filmed payouts (2 and 12 coins, 6x apart, neither equal to 8) corroborate the payload's split model — 1*qty / 5*qty per field-mob loot unit at NPC.as:837-844 plus floor(U[0,1)xlevel) for the L3 duelist at EnemyPlayer.as:1293-1300 — far more strongly than the invented level-9 reconciliation. The blocker still dies; it dies for the right reason.

### `economy/reinforce-reagents-are-20064-20066` — HELD [A2]

Reinforce consumes reagent stats 20064/20065/20066 by weapon-level band, not the 20060-20065 set the survey assigns it — that set belongs to Forge.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1104/:1110, :1114/:1120, :1124/:1130 (reinforce) vs :1017-1046 (forge)`
- **Quote:** reinforce: if(weaponlevel < 30) { if(StatsManager.getStat(20064) == 0) {...} StatsManager.changeStat(20064,-1); }
else if(weaponlevel < 60) { ... StatsManager.changeStat(20065,-1); }
else { ... StatsManager.changeStat(20066,-1); }

forge: if(level < 30) { StatsManager.changeStat(20061,-2); }
else if(level < 60) { StatsManager.changeStat(20062,-1); StatsManager.changeStat(20063,-2); }
else { StatsManager.changeStat(20061,-2); StatsManager.changeStat(20060,-2); StatsManager.changeStat(20065,-1); }
- **Overturns:** "Forge/Reinforce/Rebirth/Writ costs"
- **Lane impact:** Corrects the survey's economy/service-prices-are-formulas lane_impact, whose cite range '(InteractUI.as:1102-1047)' is also malformed (descending). Both services gate on reagents as well as coins, and the two reagent sets are disjoint except for 20065 — a porter wiring the wrong three into the wrong service would make max-level forging and reinforcing mutually blocking. Note also that forge is keyed to NODE level while reinforce is keyed to WEAPON level.

### `economy/trade-goods-index-0-degenerate` — HELD [A2]

Trade-goods commodity 0 has a degenerate seed: node x serverDate x 0 = 0, so its price is identical in every town on every day and cannot be arbitraged.

- **Cite:** `reference/decompiled/shs3_android/scripts/InteractUI.as:1562 (with the case-0 constants at :1565-1568 and the return at :1585)`
- **Quote:** var rng:RNG = new RNG(StageManager.getCurrentNode() * QueryManager.instance.getServerDate() * index);
- **Overturns:** "② sell-price + prosperity-daily-sim formulas."
- **Lane impact:** Narrows the new trade-goods subsystem from five arbitraged commodities to four. A porter reimplementing it faithfully must reproduce the zero-seed quirk or knowingly deviate. Second gotcha in the same subsystem: getGoodsPriceString (InteractUI.as:1588+) re-declares the price/variation table WITHOUT the RNG, so the displayed range and the charged price come from two code paths that must be kept in sync.

### `items-equipment/buy-value-frame-confirmed` — HELD [A1]

A video frame independently confirms the shop valuation formula: the pants tooltip shows 450 and LEVEL 4, and 29 of the 11xxx pants rows carry baseprice 50 — exactly gvalue + getLevel()*100.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0031.jpg — 1024x576 source, crop (575,140)-(1015,420), upscaled 3x LANCZOS; formula at XMLShopItem.as:68/:86 and XMLItem.as:88`
- **Quote:** Visibly in the crop: a green-bordered pants icon carrying the number '450' beside a coin glyph, and 'LEVEL 4' beneath it. XMLShopItem.as:68 `this.value = itemData.gvalue + this.item.getLevel() * 100;` and XMLItem.as:88 `this.gvalue = xml.baseprice;`. itemdata.xml: 29 of the 11xxx PANTS rows carry <baseprice>50</baseprice>. 50 + 4*100 = 450.
- **Lane impact:** L10 (PROGRESSION + ECONOMY) — upgrades the buy half of blocker ③ from A2-only to A2 + A1. It also proves the frame's PANTS is a procedurally generated shop rare (XMLShopItem also sets item.uses = 1), which is what licenses reading it against ItemGenerator's PANTS mask at all.

### `items-equipment/condition-band-labels` — HELD [A2]

The condition tier names the ledger lists as 'Ready' but unnumbered are now readable verbatim, and there are seven of them, not six.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:712-744, resolved against char-id 118 by resname`
- **Quote:** Item.as:715-743  if(this.uses == 0) getString(639); else if(this.uses == 1) getString(392); else if(condition == 0) red getString(387); else if(condition < 25) getString(388); else if(condition < 50) getString(389); else if(condition < 75) getString(390); else getString(391);   ->   639 'Unbreakable', 392 'Condition: Well-Maintained', 387 'Condition: Broken', 388 'Condition: Poor', 389 'Condition: Used', 390 'Condition: Usable', 391 'Condition: Good'
- **Lane impact:** L3 + L8 — the seven condition strings and their exact thresholds can be transcribed rather than invented. Note 'Unbreakable' fires on uses==0 and 'Well-Maintained' on uses==1, so the top two bands are keyed off raw uses, not the percentage.

### `items-equipment/equip-routing-is-id-band` — HELD [A2]

Equipment slot routing is by ID BAND (`Math.floor(itemID / 1000)`), not by <type>; <type> is consulted only to remap unique==1 items back into band space.

- **Cite:** `reference/decompiled/shs3_android/scripts/InventoryUI.as:1167-1199, cross-checked against StatsManager.as:735`
- **Quote:** var tempValue:int = Math.floor(itemID / 1000); if(QuestEngine.getItemData(item.itemID).unique == 1) { switch(QuestEngine.getItemData(item.itemID).type) { case 11: tempValue = 3; case 0: tempValue = 4; case 1: tempValue = 5; case 3: tempValue = 7; case 5: tempValue = 9; case 7: tempValue = 11; case 8: tempValue = 12; case 9: tempValue = 13; } }   |   StatsManager.as:735  equipment[EQ_SCABBARD] = new Item(13100,1);  // a TYPE 9 item in slot 10
- **Lane impact:** L3 - the port must key routing on the id band (3 ACCESSORY, 4 ARMOR, 5 GLOVES, 6 HAIR, 7 HAT, 8 HEAD, 9 MASK, 11 PANTS, 12 SHOES, 13 WEAPON) with the type-switch as the unique-item override. Keying on <type> instead would route 98 consumables into EQ_SCABBARD and 79 quest items into EQ_ACCESSORY2, and would never place the scabbard, which is a type-9 weapon-band item hard-wired to slot 10. ItemGenerator.getItemType (:255-292) independently derives type from id ranges, confirming the band is the primary key.

### `items-equipment/itemdata-type-is-implicit-not-literal` — HELD [A2]

itemdata.xml never writes <type>0</type>: the 153 armor-slot items carry no <type> element at all and rely on E4X coercing the missing node to 0, and there is a second band anomaly the survey missed.

- **Cite:** `reference/extracted/itemdata.xml — my own parse of all 982 <item> blocks`
- **Quote:** Distinct literal <type> values across the whole file: [1,2,3,4,5,6,7,8,9,10,11,12] — no 0. Items with NO <type> element: 153, of which 152 sit in the 4xxx armor band and exactly 1 in 7xxx (id 7075). Missed anomaly: '<id>2211</id> <type>12</type> <name>4386</name> <unique>1</unique> <weight>0</weight> <nogive>1</nogive> <nodrop>1</nodrop>' — a 2xxx-band item typed 12.
- **Lane impact:** L3 — a port must default a missing <type> to 0 rather than reject the row, or it silently drops 152 armor items and one hat. Reproduce both authoring anomalies verbatim (7075 and 2211). Also note types 10 and 12 are not equipment-array indices despite the enum values, which is why Item.as:845 guards them.

### `items-equipment/lang-table-build-shift` — HELD [A2]

The Android string table and the Android ActionScript are different build revisions: ids up to ~199 need no offset, but the ~380-880 UI block needs -20, so any naive getString(id) resolution above ~380 silently returns the wrong string.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1020-1043 read against DefineBinaryData char-id 118 of reference/decrypted/shs3_android_payload_decoded.swf`
- **Quote:** AS3 reads getString(871..876) for FIREDEF/WINDDEF/WATERDEF/EARTHDEF/CRITICALDMG/PIERCINGDMG. Table raw 871-876 = 'Construction Site','Riverside Town','Wooden Bridge','Waterfall Lake','Jinmaku','Mountain Path'. Table at -20 = 'Fire DEF','Wind DEF','Water DEF','Earth DEF','Critical Damage','Piercing Damage' - six in a row in the AS3's exact switch order. Control: ids 110='HP', 123='Set', 139='Weight', 199='Eq' are correct at offset 0.
- **Lane impact:** L1b - this is a methodological landmine for the whole lane, not just items. Any lane resolving <name>/<desc>/<displayname>/<param> ids against this table must anchor its id block against a known string (or a frame) FIRST. frame_0031 settles this one directly: it shows 'FIRE DEF', 'WIND DEF', 'EARTH DEF', 'CRITICAL DAMAGE' on screen, which is what -20 produces and not what the raw ids produce.

### `items-equipment/modifier-103-is-set-member-ref` — HELD [A2]

Modifier id 103 - 223 of the 412 modifier blocks in itemdata.xml, by far the largest cohort - is not a 'Set' id: its <value> is an item id and the tooltip prints that item's display name, i.e. it is a set-MEMBER reference.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1047-1052; own parse of reference/extracted/itemdata.xml`
- **Quote:** case 103: case 106: itemxml = QuestEngine.getItemData(modArrayCheck[q].value); if(itemxml != null) { attribs += "- " + itemxml.displayname + "\n"; } break;   |   parsed: 412 <modifier> blocks, 34 distinct ids, id 103 appears 223 times, 104 x42, 105 x40, 106 x33
- **Lane impact:** L3 - set bonuses render as a bulleted list of member item names, which means the SET system is itself name-dependent and therefore now unblocked by the -3060 offset finding. Encoding 103 as 'Set: 103' per the surveyed rule would produce a visibly wrong tooltip on more than half the modifier rows in the catalogue.

### `items-equipment/modifier-enum-real-extent` — PARTIAL [A2]

The end-to-end item modifier enum is Item.as:1148-1272, not XMLItem.as: it adds elemental ATK (28-31), elemental DEF + crit + piercing (200-205), a deliberate silent group (78/79/82) and node/nested-item cases (102/103/106); and itemdata.xml carries 12 further ids that fall through to a trace("ErrorValue") branch.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:1148-1272; histogram of all 412 <modifier> blocks in reference/extracted/itemdata.xml`
- **Quote:** case 28: getString(507) ... case 31: getString(510)  |  case StatsManager.STAT_FIREDEF: getString(871) ... case StatsManager.STAT_PIERCINGDMG: getString(876)  |  case 82: case 78: case 79: break;  |  case 102: getString(640)+NodeGenerator.getNodeNameCode(value)  |  case 103: case 106: '- ' + itemxml.displayname  |  itemdata.xml modifier ids OUTSIDE 0-16 and 101-1999: 25, 38, 78, 79, 82, 84, 90, 96, 97, 98, 99, 40000
- **Lane impact:** L3 — the 0-16 map the survey published is correct but incomplete; a port using only it cannot represent any generated elemental, crit or piercing affix. Ids 25 and 38 are StatsManager.STAT_DAN and STAT_BUFFTYPE; id 83 is a live max-durability bonus consumed by isBroken() and getCondition(). STILL_UNHELD: the meaning of 84, 90, 96-99 and 40000.

### `items-equipment/modifier-ids-are-stat-ids` — HELD [A2]

Item modifier ids are StatsManager STAT_* ids, so the enum extends far beyond 0-16 and 101-1999 — the elemental ATK (28-31), elemental DEF (200-203), CRIT DMG (204) and PIERCING (205) families are modifier ids too, and twelve of itemdata's 34 distinct ids fall into the code's own trace("ErrorValue") hole.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:583-637; StatsManager.as:226-260; XMLItem.as:293-297; own Counter over the 412 <modifier> blocks in reference/extracted/itemdata.xml`
- **Quote:** ItemGenerator.as:606  case FIREATK: attrib = StatsManager.STAT_FIREATK; ... case PIERCINGDMG: attrib = StatsManager.STAT_PIERCINGDMG;  then :638  newItem.addModifier(attrib,modvalue);   |   StatsManager.as:226-260  STAT_FIREATK=28 STAT_WINDATK=29 STAT_WATERATK=30 STAT_EARTHATK=31 STAT_FIREDEF=200 STAT_WINDDEF=201 STAT_WATERDEF=202 STAT_EARTHDEF=203 STAT_CRITICALDMG=204 STAT_PIERCINGDMG=205   |   XMLItem.as:296  trace("ErrorValue: " + this.modifierXML[q].id);   |   itemdata.xml distinct modifier ids: 0 1 2 3 5 6 7 8 9 12 13 15 | 25 38 78 79 82 84 90 96 97 98 99 | 101 102 103 104 105 106 117 122
- **Lane impact:** L3 — the port must model modifier ids as the STAT id space, not as a 0-16 enum with a 'Set' bucket. Elemental DEF / CRIT DMG affixes (visible in reference/frames/zFtCaTO0_1M/seg-17/frames/frame_0031.jpg) would otherwise be silently dropped. Their display names are in the table: resnames 851 Fire DEF, 852 Wind DEF, 853 Water DEF, 854 Earth DEF, 855 Critical Damage, 856 Piercing Damage; 488 Fire ATK, 489 Wind ATK. Ids 25/38/78/79/82/84/90/96-99/40000 (21 blocks) still need a semantic — they render nothing in the tooltip path.

### `items-equipment/modifier-ids-outside-the-switch` — PARTIAL [A2]

21 of the 412 <modifier> blocks carry ids that no branch of XMLItem's tooltip switch handles — they hit trace("ErrorValue") and render nothing — and at least one un-named id (83) is load-bearing in gameplay code.

- **Cite:** `reference/decompiled/shs3_android/scripts/XMLItem.as:288-296 (default branch) counted against reference/extracted/itemdata.xml; Item.as:1478 for id 83`
- **Quote:** default: if(int(this.modifierXML[q].id) < 2000 && int(this.modifierXML[q].id) > 100) { tempString += LangManager.getString(123) + ": " + this.modifierXML[q].id; } else { trace("ErrorValue: " + this.modifierXML[q].id); }  —  my count of undecodable ids in itemdata.xml: 25x1, 38x6, 78x2, 79x2, 82x2, 84x2, 90x1, 96x1, 97x1, 98x1, 99x1, 40000x1 = 21 blocks.  Meanwhile Item.isBroken() reads 'this.uses >= itemXML.durability + this.getModifierBonus(83)'.
- **Lane impact:** L3 — the modifier enum is 391/412 decoded, not 412/412. The residual 21 (ids 25, 38, the 78-99 cluster, 40000) plus the code-referenced 83 need their own pass; treat them as an open sub-blocker rather than closed.

### `items-equipment/paperdoll-is-9-visible-13-internal` — HELD [A1]

The shipped build's paperdoll renders exactly 9 equipment tiles; the AS3 Vector(13) is an internal array whose four extra entries (HAIR, HEAD, NECK, SCABBARD) have no tile, so the ledger's '9-slot paperdoll' is correct and 13 - 4 = 9 reconciles the two exactly.

- **Cite:** `reference/frames/zFtCaTO0_1M/seg-13/frames/frame_0019.jpg — 1024x576, crop (110,120)-(480,560), 2.6x LANCZOS; re-checked on frame_0031.jpg same crop 2.4x`
- **Quote:** Visibly in the crop, arranged around the character figure: row 1 HAT (straw hat, filled) and MASK (empty, ghost oni mask); row 2 ARMOR (grey robe, filled) and GLOVES (empty, ghost gauntlets); row 3 PANTS (green border, filled) and WEAPON (katana, filled); row 4 ACCESSORY (ring), SHOES (sandals, filled), ACCESSORY (ring). Nine tiles. On frame_0031.jpg the left ring is filled with a gold ring — same nine-tile grid, different fill state.
- **Overturns:** "- **Ready:** 9-slot paperdoll; 4 rarity tiers; affix **prefix** pool (verbatim); ..."
- **Lane impact:** L3 (ITEMS + PAPERDOLL) — do NOT rewrite the ledger bullet or GAUNTLET.md's '9-slot compositing contract' to 13. Port as 9 UI slots backed by a 13-entry internal array; HAIR/HEAD/NECK/SCABBARD are engine-owned appearance/state entries, not player-facing slots. The frame and the measurement disagreed and the frame wins.

### `items-equipment/piercing-not-weapon-only` — HELD [A2]

The PIERCINGDMG affix (mask index 16) is allowed by three of the eight slot masks — WEAPON, ARMOR and ACCESSORY — not by WEAPON alone.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:397-425`
- **Quote:** if(itemType == WEAPON) pot = [1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,1,1]; else if(itemType == ARMOR) pot = [1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1]; ... else if(itemType == ACCESSORY) pot = [1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1];
- **Lane impact:** L3 — corrects the survey's frame-decomposition rationale. Do NOT gate PIERCING to weapons. The slot-identifying affix in frame_0024 is 'Drafty' (windatk_pre[0] = WINDATK, index 8), which is 0 on the ARMOR, PANTS and HAT masks.

### `items-equipment/premium-rotation-is-third-party-ip` — HELD [A2]

The premium rotation catalogue is largely third-party anime cosplay sets (Bleach, Naruto, Adventure Time), which the project's licensing invariant explicitly excludes from the Lut Games grant — so it is a hazard to reproduce, not an asset to mine.

- **Cite:** `char-id 121 Mobile_PremiumData (4,504 B) extracted by me from reference/decrypted/shs3_android_payload_decoded.swf`
- **Quote:** <rotation> comments in file order: 'Assassin outfit', 'Dark Assassin outfit', 'Santa outfit', 'Ichigo outfit', 'Zaraki outfit', 'Byakuya outfit', 'Hitsugaya outfit', 'Mayuri outfit', 'Komamura outfit', 'Finn outfit', 'Sasuke Taka outfit', 'Obito outfit', 'Madara outfit', 'Itachi Akatsuki outfit', 'Kakashi outfit'
- **Lane impact:** L11 (META + REBIRTH) + L3 — keep §6's IAP bullet narrowed as the surveyor suggests, but add the opposite caveat to their recommendation: the <default> and <special> blocks and the 304 <heavenlyprice> rows are fair game under the project scope; the named rotation sets are not, and must be excluded from any port or replaced with original outfits.

### `items-equipment/string-table-build-drift` — PARTIAL [A2]

The shs3_android ActionScript and the char-id-118 string table come from DIFFERENT builds: ids below ~200 align perfectly while ids above ~360 resolve to unrelated strings, so any 'resolved against the table' step above ~200 is unsafe unless the build is named.

- **Cite:** `reference/decompiled/shs3_android/scripts/Item.as:712-745 (condition string ids) resolved against char-id 118 of reference/decrypted/shs3_android_payload_decoded.swf; identical ids confirmed in reference/decompiled/shs3_android_payload/scripts/Item.as:720-744`
- **Quote:** Item.getDesc() picks condition text from string ids 639, 392, 387, 388, 389, 390, 391. In the extracted table those are: 639 'Mine Titanium Deposit' · 392 'You are not supposed to be here!' · 387 'Pick flower' · 388 'Game Paused' · 389 'has joined the chat.' · 390 'has left the chat.' · 391 'Intruder!' — nonsense as condition labels. Yet ids under 200 align exactly: 108 'Dmg', 109 'Def', 110 'HP', 111 'Max HP', 116 'Attack', 117 'Defense', 123 'Set', 124 'Level Required', 125 'Stance Restriction', 199 'Eq'.
- **Lane impact:** L1b + L3 + L8 — every future string-id resolution must state which build's table it used. The 0-16 modifier mapping survives (all its string ids are under 200 and were independently corroborated by the frame's literal '(EQ:' label = id 199), but nothing above ~200 should be trusted without a same-build table.

### `items-equipment/three-type-spaces` — HELD [A2]

There are three mutually inconsistent item-type code spaces in this build; conflating them is a porting trap.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:254-291; StatsManager.as:264-286 and :735; InventoryUI.as:1195-1197; CraftingUI.as:508; XMLItem.as:72-77`
- **Quote:** ItemGenerator.as:254-291  getItemType(): <=2999 -> -1; <=3999 -> 7; <=4999 -> 1; <=5999 -> 2; <=7999 -> 5; <=9999 -> 6; <=11999 -> 3; <=12999 -> 4; <=13999 -> 0   (with WEAPON=0 ARMOR=1 GLOVES=2 PANTS=3 SHOES=4 HAT=5 MASK=6 ACCESSORY=7)   |   StatsManager.as:264-286  EQ_ARMOR=0 ... EQ_WEAPON=9 EQ_SCABBARD=10 EQ_ACCESSORY1=11 EQ_ACCESSORY2=12   |   StatsManager.as:735  equipment[EQ_SCABBARD] = new Item(13100,1);   (item 13100 is <type>9</type>)   |   InventoryUI.as:1195-1197  case 9: tempValue = 13;   |   CraftingUI.as:508  if(designType == 13)   |   XMLItem.as:76  this.type = 0;   (default whe
- **Lane impact:** L3 — the port needs an explicit itemdata-type -> EQ-slot function, not an array index. Consumables (type 10, 98 items) and quest items (type 12, 80 items) are NOT equipment despite colliding with EQ_SCABBARD and EQ_ACCESSORY2; accessories (type 11) fill slot 11 or 12 at runtime; the scabbard holds a type-9 weapon. And 153 items carry no <type> tag at all — the parser defaults to 0, so a naive XML port yields undefined for the entire 4xxx armor band.

### `string-table/proof-resname-not-id` — HELD [A2]

Independent proof that `resname` and not `id` is the lookup key: ItemGenerator's colorNameList is built from getString(432..442) and matched against an 11-entry colour hex list; by resname those ids return the eleven colour words, by id they return unrelated town/rank strings.

- **Cite:** `reference/decompiled/shs3_android/scripts/ItemGenerator.as:91 and :701, resolved against char-id 118 both ways`
- **Quote:** ItemGenerator.as:91  this.colorNameList = [LangManager.getString(432),...,LangManager.getString(442)];   |   :701  colorhexlist = [16711680,16737792,16763904,39168,13311,6684927,16751103,6697728,16777215,10066329,0];   |   BY RESNAME 432-442 = Red, Orange, Yellow, Green, Blue, Purple, Pink, Brown, White, Grey, Black   |   BY ID 432-442 = Town, City, Castle Town, Town Prosperity, (初段), (弐段), (参段), (四段), (五段), (六段), (七段)
- **Lane impact:** L1b — settles the decode method so no other lane repeats the surveyor's mistake: always key on resname. As a bonus it hands L3 the procedural quest-item name generator's full colour vocabulary, matched 1:1 to its RGB values.

## world-exploration — re-scored 82

Was 35. Four of the five §4 blockers are now fully closed from material already on disk (world bounds/geography, AP regen+cap, day length, gather/mine/farm yield+whiff+respawn), the fifth (sector↔room rule) is closed and independently confirmed by a video frame, and the whole overworld turns out to be a deterministic seeded-LCG generator rather than authored geography — verified closed-loop by regenerating the start territory's town name "Kasuta" and matching it to the frame that also reads TERRITORY (21,51). Three previously-unknown assets surfaced: the 63x72 Japan land mask (735 territories), a 676-line place-name table, and 69 authored trap rooms across 4 difficulty tiers. Held back from 90+ by three real gaps: src/config still contains zero world numbers (the Surface bullet survives), the string table is located but its binary is not extracted so every world NAME is still id-only, and the server-side prosperity daily-sim is genuinely gone. Also discounted slightly because the named AS3 is the Android port's payload, not the web build — mitigated but not eliminated by the three frame↔code agreements.

### `world-exploration/ap-cost-table-stable-mislabelled` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

The Ready bullet's AP table is right on pick-1 and search+mine-2 but wrong on 'stable 5': there is no 5-AP stable object — 5 AP buys TRAVEL or CAMP, and paid fast-travel costs nodeLevel x 2 gold plus 5 AP, so the ledger's '14c' elsewhere is one level-7 observation of a formula.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/InteractUI.as:1721-1746; NodeUI.as:361, :384, :414, :427, :535; Obj_Hut.as:83-86; Obj_Bush.as:92-95; Obj_OreDeposit.as:126-129`
- **Quote:** internal function travel(nodeid:int) : * { var cost:int = NodeGenerator.instance.getNodeLevel(StageManager.getCurrentNode()) * 2; ... if(!StatsManager.checkAP(5))
- **Overturns:** "- **Ready:** territory/sector coord system (start 21,51 / 0,3); node-based room graph + signposts; AP cost table (pick 1 / search+mine 2 / stable 5); 4 travel methods; ..."
- **Lane impact:** world-exploration lane Ready bullet downgraded from HELD to PARTIAL, and it splashes into the economy lane: §1 line 79's 'stable 14c+5AP' is a constant recorded where a formula (nodeLevel x 2 gold) belongs.

### `world-exploration/ap-regen-and-cap` — HELD [A2] ⚑ OVERTURNS LEDGER

AP regenerates at exactly 1 per 60 real seconds (doubled under BUFF_AP) with a base cap of 30, and the sibling timers are duel tokens 1/120s cap 20 and war moves 1/3600s.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:158-162, :1097-1103, :707-710`
- **Quote:** internal static var APINTERVAL:int = 60;  internal static var DTINTERVAL:int = 2 * 60;  internal static var WARMOVEINTERVAL:int = 60 * 60;   ///   diff = Math.floor(timeDiff / APINTERVAL) + 1; if(StatsManager.hasBuff(StatsManager.BUFF_AP)) { diff *= 2; }   ///   setPlayerStats(STAT_AP,30); setPlayerStats(STAT_MAXAP,30);
- **Overturns:** "④ AP regen rate + cap."
- **Lane impact:** world-exploration lane: blocker ④ closed with literal constants. Full 30 AP refills in 30 minutes of real time; feeds directly into a future src/config/ap.ts.

### `world-exploration/day-length` — HELD [A2] ⚑ OVERTURNS LEDGER

There is no game-invented day: every consumer the ledger names reads server unix time against literal real-second constants (AP 60s, war move 3600s, war resolution / quest expiry 86400s, crops 900-43200s).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1184 and :158-162; QueryManagerBase.as:105; InteractUI.as:1153`
- **Quote:** if(completedQuest.completedTime == 0 || completedQuest.completedTime < serverTimeVariable - 24 * 60 * 60)   ///   this.serverDateYesterday = new Date(this.serverTime * 1000 - 24 * 60 * 60 * 1000).getDate();   ///   StatsManager.setStat(30018,QueryManager.instance.getServerTime() + 24 * 60 * 60);
- **Overturns:** "③ real-world **"day" length** (governs expiry, farming, AP regen, war tick)."
- **Lane impact:** world-exploration lane: blocker ③ closed, and the §1 UNKNOWN-UNKNOWN 'The real-world "day" length governing quest expiry, farming, AP regen, and the War-Room 24h tick' falls with it. A single-player build substitutes its own clock source; the intervals are known.

### `world-exploration/farming-table` — HELD [A1] ⚑ OVERTURNS LEDGER

The farm table is exact — four crop tiers at 15min / 1h / 6h / 12h, a 900-second grace window after which the crop ROTS, and a soil-grade ladder at 10/20/30/40/50 harvests — and a video frame independently shows 'SOIL GRADE 1 (HARVESTED 0/10)'.

- **Cite:** `reference/frames/map_analysis/zFtCaTO0_1M_map_014_t607s.jpg, crop (0,205)-(300,288) upscaled x6; corroborated by reference/decompiled/shs3_android_payload/scripts/InteractUI_crops.as:55, :110-170, :457-503`
- **Quote:** Frame text: 'VEGETABLES READY FOR HARVEST' / 'SOIL GRADE 1 (HARVESTED 0/10)'. Code: 'internal var gracePeriod:int = 900;' ; 'this.timePeriod = 15 * 60;' / '60 * 60' / '6 * 60 * 60' / '12 * 60 * 60' ; 'if(harvestedTimes < 10) { return 1; }' and 'if(patchlevel == 1) { return 10; }'
- **Overturns:** "② gather/mine/farm **yield + whiff + respawn** tables."
- **Lane impact:** world-exploration lane: the farm third of blocker ② closed. Second of the three frame↔code agreements; the frame's on-screen '1' and '0/10' land exactly on getPatchLevel(0) and getNextPatchLevel(0).

### `world-exploration/hunt-fish-yield-and-whiff` — HELD [A2] ⚑ OVERTURNS LEDGER

Hunt and Fish are one 3-AP action with an identical ten-sided roll: 30% common / 20% uncommon / 10% rare / 40% whiff, over item ids 2112-2114 (hunt) and 2109-2111 (fish).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NodeUI.as:427-500`
- **Quote:** if(StatsManager.checkAP(3)) { dice = Math.random() * 10; if(dice == 3 || dice == 4 || dice == 5) { ... addLootItem(2112,1,1); } else if(dice == 1 || dice == 2) { ... addLootItem(2113,1,1); } else if(dice == 0) { ... addLootItem(2114,1,1); } else { OverworldHUD.instance.showDialog(LangManager.getString(130),LangManager.getString(5)); } }
- **Overturns:** "② gather/mine/farm **yield + whiff + respawn** tables."
- **Lane impact:** world-exploration lane: the gather third of blocker ② closed with a literal probability table, not an inference.

### `world-exploration/mining-yield-and-whiff` — HELD [A2] ⚑ OVERTURNS LEDGER

The mining table is exact: a flat 50% whiff for every ore type except type 2, a mining-skill gate ladder, ore types 1-8 mapping to item ids 20059-20066 at qty 1, 2 AP per swing, and the deposit consumed only on a non-whiff.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/Obj_OreDeposit.as:56-77 and :126-129; NodeUI.as:566-603`
- **Quote:** if(oreType == 8 && miningskill < 5 || oreType == 7 && miningskill < 4 || oreType == 6 && miningskill < 3 || oreType == 5 && miningskill < 2 || oreType == 3 && miningskill < 1)   ///   if(oreType != 2 && int(Math.random() * 2) != 0) { OverworldHUD.getInstance().getNodeUI().runMine(1,this); }   ///   else if(this.oreType == 8) { OverworldHUD.instance.lootDialog.addLootItemBasic(20066,1); }
- **Overturns:** "② gather/mine/farm **yield + whiff + respawn** tables."
- **Lane impact:** world-exploration lane: the mine third of blocker ② closed. Also upgrades the Ready bullet 'mining ore-by-level ladder' from sourced-but-vague to an exact 5-step skill gate plus an exact item map.

### `world-exploration/procgen-determinism-kasuta` — HELD [A1] ⚑ OVERTURNS LEDGER

The overworld is not authored geography but a deterministic seeded LCG keyed on node id; re-running the shipped generator on the start territory produces the town name "Kasuta", exactly matching the room title in the frame that also reads TERRITORY (21,51).

- **Cite:** `reference/frames/map_analysis/zFtCaTO0_1M_map_010_t439s.jpg (room title, top-left) vs reference/decompiled/shs3_android_payload/scripts/RNG.as:66-75 + NameGenerator.as:135-165`
- **Quote:** Frame reads 'NE KASUTA MOUNTAIN PATH' with 'TERRITORY (21,51)'. Code: 'this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;' and 'return this.namestarting[rng.rand(this.namestarting.length)] + this.nameending[rng.rand(this.nameending.length)];'. Re-implemented: territoryID = 341<<12|341 = 1397077, 341 % 137 = 67 >= 26 -> syllable branch -> RNG(2794154) -> namestarting[75]="Kasu" + nameending[0]="ta" = "Kasuta".
- **Overturns:** "① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** world-exploration lane, and it re-frames the whole system: the world is REGENERABLE, not recoverable-by-tracing. Town names, ore types, exits, room widths and object placement all fall out of RNG(nodeid). Closed-loop verified against a frame, so the Android payload's generator is the one the web build shipped.

### `world-exploration/prosperity-thresholds` — HELD [A2] ⚑ OVERTURNS LEDGER

The prosperity ladder thresholds are literal constants (0 / <500 / <1000 / <2000 / <4000 / else), which also overturns the §1 KNOWN-UNKNOWN listing 'prosperity thresholds' as unresolved.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/TerritoryData.as:782-805`
- **Quote:** if(this.townProsperity == 0) { return 0; } if(this.townProsperity < 500) { return 1; } if(this.townProsperity < 1000) { return 2; } if(this.townProsperity < 2000) { return 3; } if(this.townProsperity < 4000) { return 4; } return 5;
- **Overturns:** "condition→DMG multiplier; loot/drop tables; L11–80 XP curve; prosperity thresholds + daily-sim math."
- **Lane impact:** world-exploration lane Ready bullet made exact; §1 KNOWN-UNKNOWNS loses 'prosperity thresholds'. The 'daily-sim math' half of that same ledger phrase stays open (see the STILL_UNHELD claim).

### `world-exploration/respawn-rule` — HELD [A2] ⚑ OVERTURNS LEDGER

Harvested world objects respawn on node re-entry rather than on a timer: the dead-object list is node-scoped, never persisted, and zeroed on every node change.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StageManager.as:58, :249, :366, :621-626`
- **Quote:** internal static var roomDeadList:Vector.<String> = new Vector.<String>();   ///   roomDeadList.length = 0; (inside initRooms, and again on the node-change path at :366)   ///   public static function addToDeadList(objname:String) : * { roomDeadList.push(objname); }
- **Overturns:** "② gather/mine/farm **yield + whiff + respawn** tables."
- **Lane impact:** world-exploration lane: the respawn third of blocker ② closed — and closed as 'there is no respawn table', which is a cheaper thing to build than the table the ledger assumed existed.

### `world-exploration/save-format-is-copyable` — PARTIAL [A2] ⚑ OVERTURNS LEDGER

§6's claim that the save format has 'nothing to copy' is wrong: world persistence is a flat integer stat table with 46 enumerated STAT_* indices, and farm plots are a fixed 4-field record read at startingIndex+0..3.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:196, :198, :208, :248 (46 STAT_* constants total); InteractUI_crops.as:102-108; StageManager.as:381`
- **Quote:** internal static var STAT_AP:int = 13;  internal static var STAT_MAXAP:int = 14;  internal static var STAT_LOCATION:int = 19;  internal static var STAT_LOCATION_ROOM:int = 43;   ///   this.plantType = StatsManager.getStat(startingIndex); this.plantTime = StatsManager.getStat(startingIndex + 1); this.harvestedTimes = StatsManager.getStat(startingIndex + 2); this.modLevel = StatsManager.getStat(startingIndex + 3);
- **Overturns:** "- **Server-sim topology & save format** — nothing to copy; design a single-player persistence schema from the observed field set."
- **Lane impact:** Hits §6, the highest-value target in the document. The save-format half of that bullet moves out of 'structurally UNRECOVERABLE' — the schema can be copied, not designed. The server-sim-topology half of the same sentence stands, so this is a PARTIAL overturn, not a kill.

### `world-exploration/six-by-six-sectors` — HELD [A1] ⚑ OVERTURNS LEDGER

The sector↔room mapping rule is a fixed 6x6 sector grid per territory, and the video frame's overworld minimap shows exactly that grid with 0-5 axis labels and a player marker matching its printed SECTOR readout.

- **Cite:** `reference/frames/map_analysis/zFtCaTO0_1M_map_010_t439s.jpg, crop (370,40)-(512,160) upscaled x8 Lanczos; corroborated by reference/decompiled/shs3_android_payload/scripts/TerritoryData.as:1071-1077 and Territorymap.as:65-70`
- **Quote:** Visible in the crop: a 6-column x 6-row grid with column headers '0 1 2 3 4 5' and row labels '0 1 2 3 4 5', inter-cell connection lines, three yellow arch icons, a triangle marker at column 4 / row 1, and beneath it 'TERRITORY (21,51)' / 'SECTOR (4,1)'. Code: 'sectorBuild = new SectorBuild(i,j,territoryx * 6 + i << 12 | territoryy * 6 + j);'
- **Overturns:** "⑤ sector↔room mapping rule (town=fixed sector vs wilderness=one-screen-per-sector)."
- **Lane impact:** world-exploration lane: blocker ⑤ closed. 735 territories x 36 sectors = 26,460 sectors. The frame and the payload agree — this is one of the three frame↔code agreements that let the Android-port source be trusted for the web build.

### `world-exploration/traproomdata-unknown-system` — HELD [A2] ⚑ OVERTURNS LEDGER

An entire authored content system is missing from the ledger: bindata file 93 is not 'room-object defs' but <traproomdata>, 69 hand-built trap rooms across four difficulty tiers with exact widths, object placements and a documented property signature for all 13 trap types.

- **Cite:** `reference/extracted/bindata/93_1t4647s0.bin — root <traproomdata> at line 21; tiers <easy> l.32 (13 rooms), <medium> l.126 (21), <hard> l.309 (15), <veryhard> (20)`
- **Quote:** <obj><id>43</id><name>Trap_SawBladesAuto</name><x>400</x><property>0,24,24,0,1</property></obj>   ///   header comment: <obj><id>32</id><name>Trap_Kunai</name><x>200</x><y>300</y><property>angle, speed, kunaicount, spread, bigdamage</property></obj>
- **Overturns:** "- **Surface:** ZERO world numbers in config yet — needs new `world.ts`/`ap.ts`/`farming.ts` modules. Mining ore ladder + far-territory coords are sourced but missing from the digest."
- **Lane impact:** world-exploration lane gains a whole content pillar (dungeon/trap rooms) the ledger never scored — comparable in status to the survivalmodedata finding from Stage 0. Room widths 800/1000/1100/1150/1400 are also the first hard authored world geometry numbers available.

### `world-exploration/world-mask-on-disk` — HELD [A2] ⚑ OVERTURNS LEDGER

World bounds and geography are not a blocker: the sparse Japan outline is a 63x72 two-colour GIF on disk with exactly 735 land pixels = 735 territories, consumed by a one-line pixel test.

- **Cite:** `reference/extracted/bindata/92_1t4648s0.bin (GIF89a 63x72, 735 non-black px) + reference/decompiled/shs3_android_payload/scripts/QuestEngine.as:489 and :1204-1207`
- **Quote:** myLoader.load(new URLRequest("map.gif"));   ///   public static function hasTerritory(x:int, y:int) : * { return mapBitmapData.getPixel(x + WarSelectUI.TERRSHIFTX - 341 - WarSelectUI.WARMARKERSHIFTX,y + WarSelectUI.TERRSHIFTY - 341) != 0; }
- **Overturns:** "① **world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine Fandom Category:Territories via API; trace the map image.*"
- **Lane impact:** world-exploration lane: blocker ① deleted. Nothing needs tracing or wiki-mining; the land mask is a 272-byte file already in the repo and territory existence is getPixel(x,y)!=0. Also kills the §1 UNKNOWN-UNKNOWN 'World-map topology/projection ... not a grid you can generate from W×H'.

### `world-exploration/four-travel-methods` — STILL_UNHELD [STILL_UNHELD]

The Ready bullet's claim of exactly '4 travel methods' is not supported by any artifact I found — I can enumerate the movement paths in code but nothing states the count, and it changes depending on how they are bucketed.

- **Lane impact:** world-exploration lane: one Ready bullet I decline to score. ScreenTransition.as:17-35 lists ACTION_EXPLORENODE, ACTION_TELEPORT, ACTION_TELEPORTDOWNED and ACTION_TELEPORTCLANQUEST, and separately NodeUI has ACTION_TRAVEL plus 1-AP path/signpost traversal — that is more than four transitions and fewer than four player-facing 'methods' depending on the cut. Recording it as unheld rather than bending the evidence to the ledger's number.

### `world-exploration/minimap-and-hidden-paths-exact` — HELD [A2]

The 'minimap iconography' and 'hidden-path system' Ready bullets are held and now exact: 24 enumerated map icons plus 22 room themes, and hidden paths cost 2 AP to reveal / 1 AP to traverse with skill 1021 at level 5 pre-revealing them.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NodeGenerator.as:34-124; Obj_PathBush.as:50-53, :63-82, :115-121`
- **Quote:** public static var ICON_NOTHING:int = 0; ... public static var ICON_BEACH:int = 23; public static var ICON_OVERWRITENODE:int = 100;   ///   if(StatsManager.getStat(1021) == 5) { gotoAndStop(2); }   ///   if(!this.revealed) { return 2; } return 1;
- **Lane impact:** world-exploration lane: two Ready bullets promoted from 'sourced' to exact enumerations, directly transcribable into config. The 24-icon list is also the ui-hud lane's minimap legend.

### `world-exploration/node-level-formula` — HELD [A2]

The world's entire difficulty gradient is a closed-form function absent from all twelve ledger systems: node level = Manhattan distance from the start territory (341,341) plus 3, capped at 200.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/NodeGenerator.as:144 and :382-395`
- **Quote:** internal var LEVELSTART:int = 3;   ///   var lvl:int = Math.abs(territory.x - 341) + Math.abs(territory.y - 341) + this.LEVELSTART; if(lvl > 200) { lvl = 200; }
- **Lane impact:** world-exploration lane gains its single most load-bearing number, and it reaches into the enemies-ai lane (whose blocker ① is 'enemy level→stat formula') and the economy lane (fast-travel price = nodeLevel x 2). The ledger mentions it nowhere.

### `world-exploration/prosperity-daily-sim` — STILL_UNHELD [STILL_UNHELD]

The rule that moves town prosperity day to day is genuinely gone — every field that feeds it arrives from the dead Player.IO server and no artifact in the repo supports any daily-sim formula.

- **Lane impact:** world-exploration lane: the one genuinely lost piece of this system. TerritoryData's townProsperity/townSide/atWar/clanInfluence are all guarded by dataFromServer and populated by gotTerritoryData(terrX,terrY,terrData); QuestEngine.getTownState() indexes a server-sent townsData string. The thresholds are held; the update rule must become a labelled recreation-authored deviation.

### `world-exploration/start-coords-confirmed` — HELD [A2]

The Ready bullet 'start 21,51 / 0,3' is correct and now byte-grounded: the shipped starting STAT_LOCATION is 8382465, which decodes to territory (341,341) = display (21,51) and sub-sector (0,3).

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:714; decode rule at NodeGenerator.as:296-333; display shift at WarSelectUI.as:17-19`
- **Quote:** setPlayerStats(STAT_LOCATION,8382465);   ///   var sectorx:int = nodeid >> 12 & 0x0FFF; var sectory:int = nodeid & 0x0FFF; var territoryx:int = Math.floor(sectorx / 6);   ///   public static var TERRSHIFTX:int = 21; public static var TERRSHIFTY:int = 51;
- **Lane impact:** world-exploration lane: confirms a Ready bullet rather than overturning it, and supplies the decode rule (node = sectorX<<12 | sectorY, territory = sector/6, display = territory - 341 + (21,51)) that turns all 51 distinct <node> ids in questdata.xml into real map coordinates.

### `world-exploration/string-table-located` — PARTIAL [A2]

The numeric-id string table the gauntlet lists as 'NOT YET LOCATED' is now named — data/shs3_en.xml on the web build, embedded asset 118_Mobile_Lang_EN.bin in the Android SWF — but the binary was never exported, so it is located, not held.

- **Cite:** `reference/decompiled/shs3_android_payload/scripts/LangManager.as:59-62; Mobile_Lang_EN.as:4-5; reference/decompiled/android_export.log:514`
- **Quote:** Locale.addXMLPath(ENGLISH,server + "shs3_en.xml"); Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");   ///   [Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")] public class Mobile_Lang_EN extends ByteArrayAsset   ///   Exported script 511/970 Mobile_Lang_EN, 00:00.079
- **Lane impact:** Cross-lane: this is the standing GAUNTLET §2.1 blocker that gates NAMES in every lane (item/skill/npc/place/sign/ore). It is correct that bindata/ is exhausted, but the table is not unlocated — re-exporting the Android SWF's _assets/ directory (scripts were exported, binaries were not) should close it. I am reporting PARTIAL because the bytes are not on disk today; I did not find a name and I am not claiming one.
