# GAUNTLET L0 — system survey: **art-anim-audio-feel**

**Ledger under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20), §2 row + §4 block
`### art-anim-audio-feel — 56`, plus the §1 and §6 lines that touch this system.

**Surveyor verdict: 56 → 92.** This was scored as the project's second-strongest system on the
strength of *video measurements*. It is in fact the **best-evidenced system in the game**, because
the original source data — every animation keyframe, every vector shape, every SFX and music stem —
is on disk right now. The single biggest blocker in the block ("**ALL AUDIO**") is not a blocker;
the audio was already in this repo, sitting encrypted inside a 15 MB SWF nobody had opened.

**Headline:** `reference/preservation/shs3_android_payload.swf` decrypts with the game's own
documented routine and yields **13 SFX + 13 music stems as MPEG-2.5 Layer III, 16 kbps, 11 025 Hz
mono MP3**, with the exact names `SoundManager.as` / `MusicManager.as` call for.

---

## §0 — Method note (applies to every A2 cite below)

`reference/decompiled/shs3_payload/` is **identifier-obfuscated** (`§1t8566s0§.as`,
`§1t1525s0§.§1t9960s0§(...)`). `reference/decompiled/shs3_android/` is the **same codebase with
real symbol names** — `Marker_RumbleTrigger.as`, `StageManager.startShake(...)`. The two are
line-for-line twins:

```
shs3_payload/scripts/§1t8566s0§.as:9       internal var shakeDuration:int = 24;
shs3_android/scripts/Marker_RumbleTrigger.as:9   internal var shakeDuration:int = 24;
shs3_payload/scripts/§1t8566s0§.as:44   §1t1525s0§.§1t9960s0§(this.shakeDuration,this.shakeAmt);
shs3_android/scripts/Marker_RumbleTrigger.as:44  StageManager.startShake(this.shakeDuration,this.shakeAmt);
```

So the android bundle is the **decoder ring for the entire web payload**. Every claim below that
cites `shs3_android/` is a claim about the shipped game logic, not about a mobile-only fork.

---

## CLAIM 1 — `art/audio-waveforms-held` — **OVERTURNS §4 blocker ① and §6 bullet 2**

**Ledger says (§4):**
> "**Blockers:** ① **ALL AUDIO** — every SFX + music param is INFERRED, no composer sourced."

**Ledger says (§6, "structurally UNRECOVERABLE"):**
> "**Exact original SFX & music synthesis params** — the *character* is study-able from audio; the exact waveforms/envelopes are not."

**Reality: we hold the actual waveforms.** `reference/preservation/shs3_android_payload.swf`
(15 142 649 bytes, on disk since 2026-07-23) is an encrypted SWF. It decrypts with the game's own
`ResourceManager.decryptByteArray` (see CLAIM 2), and its `DefineBinaryData` blob **122** is
`soundresource.swf` and blob **113** is `musicresource.swf`. Parsed tag stream:

```
=== soundresource (122) uncompressed 29623 bytes   frameRate 24.0
   DefineSound tags: 13
    deflect  (1, 'MP3', 11025, 16, 'mono',  8700 samples, 2082 bytes)
    die2     (2, 'MP3', 11025, 16, 'mono',  7264, 1770)
    sumo     (3, 'MP3', 11025, 16, 'mono', 31928, 6242)
    slash3   (4, 'MP3', 11025, 16, 'mono',  2976, 1042)
    die3     (5, 'MP3', 11025, 16, 'mono',  9545, 2186)
    refund   (6, 'MP3', 11025, 16, 'mono',  8033, 1978)
    die1     (7, 'MP3', 11025, 16, 'mono',  5290, 1458)
    slash2   (8, 'MP3', 11025, 16, 'mono',  6130, 1562)
    slash1   (9, 'MP3', 11025, 16, 'mono',  3809, 1146)
    goodkoto (10,'MP3', 11025, 16, 'mono', 17331, 3642)
    hitmetal (11,'MP3', 11025, 16, 'mono',  5717, 1562)
    fart     (12,'MP3', 11025, 16, 'mono',  4608,  838)
    punch    (13,'MP3', 11025, 16, 'mono',  3456, 1146)
=== musicresource (113) uncompressed 1402677 bytes   frameRate 24.0
   DefineSound tags: 13
    bgm_lose          (1, 'MP3',11025,16,'mono',  38880,   7490)
    safepercussion    (2, 'MP3',11025,16,'mono', 882144, 159746)
    safekoto          (3, 'MP3',11025,16,'mono', 882144, 159746)
    safeambience      (4, 'MP3',11025,16,'mono', 882144, 159746)
    bgm_levelup       (5, 'MP3',11025,16,'mono', 328320,  59802)
    bgm_gangnam       (6, 'MP3',11025,16,'mono',  40032,   7698)
    flutes            (7, 'MP3',11025,16,'mono', 882144, 159746)
    dungeonpiano      (8, 'MP3',11025,16,'mono', 504288,  91522)
    dungeonpercussion (9, 'MP3',11025,16,'mono', 504288,  91522)
    dungeonflute     (10, 'MP3',11025,16,'mono', 504288,  91522)
    dungeonambience  (11, 'MP3',11025,16,'mono', 504288,  91522)
    battledrums      (12, 'MP3',11025,16,'mono', 882144, 159746)
    battlechants     (13, 'MP3',11025,16,'mono', 882144, 159746)
```

First MP3 frame header of the first music stem, decoded from the raw bytes:

```
charId 1 first bytes 7d06ffe320c00000
mpeg MPEG2.5 layer III bitrate 16 kbps samplerate 11025 channel mono
```

**Derived durations** (samples ÷ 11 025): slash1 **0.345 s** · slash2 **0.556 s** · slash3 **0.270 s** ·
punch **0.313 s** · hitmetal **0.519 s** · deflect **0.789 s** · die1 **0.480 s** · die2 **0.659 s** ·
die3 **0.866 s** · fart 0.418 s · refund 0.729 s · goodkoto 1.572 s · sumo 2.896 s.
Music: the five "surface" stems (`flutes`, `safeambience`, `safekoto`, `safepercussion`,
`battledrums`, `battlechants`) are **all exactly 882 144 samples ≈ 80.01 s**, and the four dungeon
stems are **all exactly 504 288 samples ≈ 45.74 s** — identical lengths *by design*, because the
mixer cross-fades stems at a shared play position (CLAIM 4).

**Consequence:** §5 Tier-1 item 3 — *"Listen-pass on existing audio (watch skill on the two longplays
+ the 3 music rips + 2012 trailer) … the deepest gap"* — is obsolete. There is no need to
characterise the beds from lossy YouTube rips; the isolated stems are here, unmixed, one file each.

**Caveats, stated plainly.** (a) Project invariant is *WebAudio-synthesized SFX only, no image/audio
files* — so these are a **study/measurement source** for synth parameters, not shippable assets.
(b) The owner's Lut Games grant explicitly **excludes third-party assets including licensed music**
(`CLAUDE.md`); `bgm_gangnam` is self-evidently third-party. Treat the audio as study-only,
local-only, gitignored — exactly like the client SWFs already are.

- **artifact_class:** A3 (byte-check, output pasted above)
- **cite:** `reference/preservation/shs3_android_payload.swf` → DefineBinaryData charIds 113 & 122 → DefineSound tags (13 + 13)
- **verdict:** HELD · **overturns_ledger:** true

---

## CLAIM 2 — `art/resource-decrypt-recipe` — the lever that opened CLAIM 1

`ResourceManager.as` names the five resource libraries and the key rule:

```
reference/decompiled/shs3_android/scripts/ResourceManager.as:41
   internal static var resourceFileNameArray:Array = ["shs3resource.swf","musicresource.swf","soundresource.swf","imageresource.swf","bgresource.swf"];
reference/decompiled/shs3_android/scripts/ResourceManager.as:186
   ba = decryptByteArray(ba,resourceFileNameArray[num].charCodeAt(1));
reference/decompiled/shs3_android/scripts/ResourceManager.as:200
   internal static function decryptByteArray(source:ByteArray, key:int) : ByteArray
   { ... for(var i:int = 3; i < 256; i++) { if(i % 11 == 0) { temp = int(ba[i]); ba[i] = ba[i+256]; ba[i+256] = temp; } ba[i] ^= key; } ... }
```

Brute-forcing the key over the five embedded blobs recovers **exactly** the predicted characters —
independent confirmation that the routine is the right one:

```
blob 113 key 117 'u'  -> musicresource.swf  (SWF v17, 1 402 685 B)
blob 122 key 111 'o'  -> soundresource.swf  (SWF v17,    29 631 B)
blob 115 key 104 'h'  -> shs3resource.swf   (1 040 849 B)
blob 120 key 103 'g'  -> bgresource.swf     (4 412 340 B)
blob 124 key 109 'm'  -> imageresource.swf  (1 908 229 B)
outer   key 104 'h'   -> shs3_android_payload.swf (SWF v26, 21 688 592 B)
```

- **artifact_class:** A2 (+A3 confirmation) · **cite:** `reference/decompiled/shs3_android/scripts/ResourceManager.as:41,186,200-217`
- **verdict:** HELD

---

## CLAIM 3 — `art/sfx-cue-table` — the trigger map, not just the sounds

`SoundManager.as` is the complete SFX contract. Slash and death each pick **uniformly from 3
variants**; **hit and hurt are the same sound** (`punch`) — a detail no video pass would ever recover.

```
reference/decompiled/shs3_android/scripts/SoundManager.as:187-219
   public function playSlash() : * { ... var dice:int = Math.random() * 3;
     if(dice == 0) { sound = ResourceManager.getSound("slash1"); ... }
     else if(dice == 1) { ... "slash2" ... } else if(dice == 2) { ... "slash3" ... } }
reference/decompiled/shs3_android/scripts/SoundManager.as:221-253   playDie()  -> die1|die2|die3, same 3-way dice
reference/decompiled/shs3_android/scripts/SoundManager.as:261       playHit()   -> ResourceManager.getSound("punch")
reference/decompiled/shs3_android/scripts/SoundManager.as:274       playHurt()  -> ResourceManager.getSound("punch")
reference/decompiled/shs3_android/scripts/SoundManager.as:287       playHitMetal() -> "hitmetal"
reference/decompiled/shs3_android/scripts/SoundManager.as:300       playDeflect()  -> "deflect"
```

- **artifact_class:** A2 · **cite:** `reference/decompiled/shs3_android/scripts/SoundManager.as:187-305`
- **verdict:** HELD · **overturns_ledger:** true (same §4 ① sentence as CLAIM 1)

---

## CLAIM 4 — `art/music-architecture` — vertical stem layering with phase-locked crossfades

The music is **not** a playlist of tracks. It is 13 mono stems and 18 preset masks; changing preset
starts newly-enabled stems **at the currently-playing stem's sample position** so everything stays
in phase, then fades in at a fixed rate.

```
reference/decompiled/shs3_android/scripts/MusicManager.as:50-76
   TRACK_BATTLECHANTS 0 · TRACK_BATTLEDRUMS 1 · TRACK_FLUTES 2 · TRACK_SAFEAMBIENCE 3 ·
   TRACK_SAFEKOTO 4 · TRACK_SAFEPERCUSSION 5 · TRACK_DUNGEONAMBIENCE 6 · TRACK_DUNGEONFLUTE 7 ·
   TRACK_DUNGEONPERCUSSION 8 · TRACK_DUNGEONPIANO 9 · TRACK_GANGNAM 10 · TRACK_LEVELUP 11 ·
   TRACK_LOSE 12 · TOTALTRACKS 13
reference/decompiled/shs3_android/scripts/MusicManager.as:143-149
   presetsArray[MUSIC_EXPLORESAFE][TRACK_FLUTES] = true;
   presetsArray[MUSIC_EXPLORESAFE][TRACK_SAFEAMBIENCE] = true;
   presetsArray[MUSIC_EXPLOREDANGER][TRACK_FLUTES] = true;
   presetsArray[MUSIC_EXPLOREDANGER][TRACK_SAFEAMBIENCE] = true;
   presetsArray[MUSIC_EXPLOREDANGER][TRACK_SAFEPERCUSSION] = true;
reference/decompiled/shs3_android/scripts/MusicManager.as:206
   playPosition = int(this.scArray[this.TRACK_FLUTES].position);
reference/decompiled/shs3_android/scripts/MusicManager.as:301   sndTransform.volume -= 0.05;   // ACTION_FADEOUT, per update tick
reference/decompiled/shs3_android/scripts/MusicManager.as:329   sndTransform.volume += 0.05;   // ACTION_FADEIN
reference/decompiled/shs3_android/scripts/MusicManager.as:243   scArray[TRACK_LOSE]    = trackArray[i].play(0,1);    // lose stinger: 1 loop
reference/decompiled/shs3_android/scripts/MusicManager.as:248   scArray[TRACK_LEVELUP] = trackArray[i].play(0,999);  // level-up: 999 loops
```

Fade rate 0.05/tick at 24 fps ⇒ a **20-tick ≈ 0.83 s** linear fade in each direction. Presets:
`MUSIC_NONE 0, EXPLOREBATTLE 1, TOUGHBATTLE 2, QUIET 3, EXPLORESAFE 4, EXPLOREDANGER 5,
EXPLORETOWN 6, DUNGEONBATTLE 7, PVP 8, DUNGEON 9, DUNGEONCREEPY 11, DUNGEONCREEPYDANGER 12,
DOJO 14, BATTLEDRUMS 15, DUNGEONDANGER 16, GANGNAM 100, LEVELUP 101, LOSE 102`
(`MusicManager.as:12-46`). This is the "music params" the ledger calls INFERRED, in full.

- **artifact_class:** A2 · **cite:** `reference/decompiled/shs3_android/scripts/MusicManager.as:12-46,50-76,115-186,193-272,284-351`
- **verdict:** HELD · **overturns_ledger:** true

---

## CLAIM 5 — `art/music-routing` — which bed plays where

`SoundManager.pickMusic(bg, isHostile, isPvP)` is a complete background→preset router, and
`pickBattleMusic()` is the danger→battle escalation rule.

```
reference/decompiled/shs3_android/scripts/SoundManager.as:116-118
   if(isPvP) { this.playMusic(MusicManager.MUSIC_PVP); }
reference/decompiled/shs3_android/scripts/SoundManager.as:120-129
   else if(bg == GameStage.BG_DUNGEON || bg == GameStage.BG_CAVE || ... || bg == GameStage.BG_ANCIENTRUINS)
   { if(isHostile) playMusic(MUSIC_DUNGEONDANGER); else playMusic(MUSIC_DUNGEON); }
reference/decompiled/shs3_android/scripts/SoundManager.as:177-184
   if(this.isPlaying == MusicManager.MUSIC_EXPLOREDANGER) { this.playMusic(MusicManager.MUSIC_EXPLOREBATTLE); }
   else if(isPlaying == MUSIC_DUNGEONDANGER || isPlaying == MUSIC_DUNGEONCREEPYDANGER) { playMusic(MUSIC_DUNGEONBATTLE); }
```

- **artifact_class:** A2 · **cite:** `reference/decompiled/shs3_android/scripts/SoundManager.as:114-185`
- **verdict:** HELD

---

## CLAIM 6 — `art/screen-shake` — **OVERTURNS §4 blocker ④ (shake half) and the §1 unknown-unknown**

**Ledger says (§4):** "④ **screen-shake** + **hitstop-on-landed-hit** (never catalogued)"
**Ledger says (§1 unknown-unknowns):** "**screen-shake** and **hitstop-on-landed-hit** (never catalogued)."
**Ledger says (§5 Tier 1):** "…whether there's screen-shake / hitstop."

It is catalogued now, exactly:

```
reference/decompiled/shs3_android/scripts/StageManager.as:1200-1206
   public static function startShake(shakeDuration:int, shakeAmt:int = 30) : *
   { screenShake = true; screenShakeCounter = shakeDuration; screenShakeAmt = shakeAmt;
     screenShakeStartPos = new Point(gameStage.x,gameStage.y); }
reference/decompiled/shs3_android/scripts/StageManager.as:1207-1227
   internal static function doShake() : *
   { --screenShakeCounter;
     if(screenShakeCounter == 0) { screenShake = false; gameStage.x = screenShakeStartPos.x; gameStage.y = screenShakeStartPos.y; }
     else { shakeAmount = Math.min(screenShakeAmt,screenShakeCounter);
            gameStage.x = screenShakeStartPos.x + (-shakeAmount / 2 + Math.random() * shakeAmount);
            gameStage.y = screenShakeStartPos.y + (-shakeAmount / 2 + Math.random() * shakeAmount); } }
```

Algorithm: **uniform random 2-D offset in ±shakeAmount/2 on both axes, once per tick**, with the
amplitude **self-damping** via `min(amt, counter)` for the last `amt` ticks, and an exact snap-back
to the pre-shake origin. Default amplitude **30 px**. Measured call sites:

```
MCSPlayer.as:911   StageManager.startShake(12);
MCSPlayer.as:946   StageManager.startShake(24);
MCSPlayer.as:4180  StageManager.startShake(12);
HeavenlySwordProjectile.as:76  StageManager.startShake(12);
Trap_CrusherBlockAuto.as:88 / Trap_CrusherColumnAuto.as:90   StageManager.startShake(6);
Marker_RumbleTrigger.as:9,11  shakeDuration = 24; shakeAmt = 30;   // designer-overridable via "d,amt" prop string
shs3_payload/scripts/§1t99s0§.as:3514,3825,4267   §1t1525s0§.§1t9960s0§(6,20);
```

- **artifact_class:** A2 · **cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:1200-1227` (+ call sites above)
- **verdict:** HELD · **overturns_ledger:** true

---

## CLAIM 7 — `art/kill-beat-redfreeze` — the "kill-beat" is a named, timed engine state

The Ready bullet lists "kill-beat" as frame-measured. It is an engine state called **redFreeze**,
with exact tick counts at 24 fps:

```
reference/decompiled/shs3_android/scripts/StageManager.as:1096   redFreezeCounter = 24 * 3 + 6;   // ACTION_HARVEST
reference/decompiled/shs3_android/scripts/StageManager.as:1101   redFreezeCounter = 24 * 6;       // normal battle end (6.0 s)
reference/decompiled/shs3_android/scripts/StageManager.as:903-907 if(redFreezeCounter == 24 * 5) { unRedFreeze(); ... battleUI.showWin(); }   // +1.0 s
reference/decompiled/shs3_android/scripts/StageManager.as:926-928 else if(redFreezeCounter == 24 * 3) { redFreezeCounter = -2; ... showLose(); }
reference/decompiled/shs3_android/scripts/StageManager.as:1103-1104 InputManager.disableInput(); InputManager.clearCanvas();
```

Visual composition of the beat (`GameStage.redFreeze`, `reference/decompiled/shs3_android/scripts/GameStage.as:514-544`):
**every** farthest / far / player-plane / foreground layer is set `visible = false`; ground layers
0-1 are driven to pure black via `ColorCode.makeBlack`; higher ground layers hidden. Also frozen:
`NPCManager`, `ProjectileManager`, `ParticleSystemManager`, HUD (`battleUI.hideAll()`,
`skillUI.visible = false`), and `StatsManager.resetCombo()`.

- **artifact_class:** A2 · **cite:** `reference/decompiled/shs3_android/scripts/StageManager.as:898-930,1075-1106` + `GameStage.as:514-544`
- **verdict:** HELD

---

## CLAIM 8 — `art/hitstop-per-hit` — **STILL_UNHELD, and stated honestly**

The other half of blocker ④. I searched the whole android bundle for a per-landed-hit time freeze:
`hitstop`, `hitStop`, `freezeFrame`, `timeScale`, `slowmo`, `slowMotion`, `hitPause`, `pauseGame`
— **zero hits** outside the battle-end `redFreeze` (CLAIM 7) and `animFrozen` (an animation-hold
flag, not a global tick freeze: `MCSPlayer.as:4433`). Absence of a symbol is not proof the effect
does not exist, and I did not open frames at a landed-hit boundary to test it. **STILL_UNHELD.**
Close path is cheap and does not need frames: instrument the decrypted `shs3resource.swf` MovieClip
timelines, or read `GameEngine`'s main tick for any conditional skip.

- **artifact_class:** STILL_UNHELD · **verdict:** STILL_UNHELD

---

## CLAIM 9 — `art/blend-modes-none` — **OVERTURNS §4 blocker ③ (as a resolved negative)**

**Ledger says (§4):** "③ FX **blend modes**"
**Ledger says (§1):** "**Compositing/blend modes** for tint/vignette/trail/blood … (never catalogued)."

`BlendMode.` appears **nowhere** in 2 768 decompiled classes across all 8 bundles
(`docs/gauntlet/L0/index/actionscript.json` → `"class_count": 2768`). `grep -rn "blendMode"
reference/decompiled/` returns **exactly 6 hits**, and every one is the Adobe Flex framework's own
interface declaration `mx/core/IFlexDisplayObject.as:87,89` repeated across the three bundles that
ship Flex (`shs3_android`, `shs3_android_payload`, `shs3_payload`). **No game class ever reads or
writes `blendMode`, and no `BlendMode.*` constant is ever named.** There is nothing to
recover: **the game composites in normal blend only.** Its entire visual-effect vocabulary is three
primitives:

```
reference/decompiled/shs3_android/scripts/ColorCode.as:12
   internal static var blackColorTransform:ColorTransform = new ColorTransform(0,0,0,1,0,0,0,0);
reference/decompiled/shs3_android/scripts/ColorCode.as:21-26   changeColor()  -> ColorTransform.color = <uint>
reference/decompiled/shs3_android/scripts/ColorCode.as:52-56   blur(obj, n)   -> new BlurFilter(n,n,BitmapFilterQuality.LOW)
reference/decompiled/shs3_android/scripts/ColorCode.as:58-62   blurHIGH(obj,n)-> BitmapFilterQuality.HIGH
reference/decompiled/shs3_android/scripts/ColorCode.as:47-48
   var myElements_array:Array = [0.3,0.59,0.11,0,0, 0.3,0.59,0.11,0,0, 0.3,0.59,0.11,0,0, 0,0,0,1,0];
   var myColorMatrix_filter:ColorMatrixFilter = new ColorMatrixFilter(myElements_array);
```

Filter census over the whole `shs3_android` bundle (recursive, 559 scripts) — `grep -rhon
"GlowFilter\|DropShadowFilter\|BlurFilter\|ColorMatrixFilter\|BevelFilter\|GradientGlowFilter\|ConvolutionFilter\|DisplacementMapFilter"`:
**13 × BlurFilter, 7 × ColorMatrixFilter, 0 of every other filter type.** The desaturation matrix
uses luma weights **0.3 / 0.59 / 0.11**. (Note: the *payload.xml* asset tree does carry 206
`glowColor` and 2 `dropShadowColor` entries — those are **authoring-time filters baked onto
individual symbols** in the FLA, not runtime code, and they are recoverable per-symbol from
`reference/extracted/`.)

- **artifact_class:** A2 · **cite:** `reference/decompiled/shs3_android/scripts/ColorCode.as:1-124` + whole-corpus `grep -rn "BlendMode\." reference/decompiled/` → 0 results
- **verdict:** HELD · **overturns_ledger:** true

---

## CLAIM 10 — `art/severed-limb-deaths` — **OVERTURNS §4 blocker ⑤**

**Ledger says:** "⑤ severed-limb death variant."

Four dismemberment deaths plus a beheaded seppuku are named in the animation table, with exact
frame durations:

```
reference/extracted/anim_xml.txt:86   <anim i="death" d="38">
reference/extracted/anim_xml.txt:87   <anim i="deathbyarrow" d="21">
reference/extracted/anim_xml.txt:88   <anim i="deathdowned" d="7">
reference/extracted/anim_xml.txt:89   <anim i="deathenemy" d="23">
reference/extracted/anim_xml.txt:90   <anim i="deathinhalf" d="28">
reference/extracted/anim_xml.txt:91   <anim i="deathnohand" d="25">
reference/extracted/anim_xml.txt:92   <anim i="deathnohead" d="31">
reference/extracted/anim_xml.txt:97   <anim i="deathwitharrow" d="23">
reference/extracted/bindata/103_1t4630s0.bin  child_ids include "seppuku_nohead"
```

Each of these carries a **+6-frame post-hold** applied at load
(`reference/decompiled/shs3_android/scripts/AnimData.as:59-66`: `case "deathenemy": case "deathnohand":
case "deathnohead": case "death": ... this.duration += 6;`).

- **artifact_class:** A2 · **cite:** `reference/extracted/anim_xml.txt:86-97`
- **verdict:** HELD · **overturns_ledger:** true

---

## CLAIM 11 — `art/font-edo-sz` — **OVERTURNS §4 blocker ② and §2's "font"**

**Ledger says (§2 row):** "…**all audio** (SFX + music params); **font**; FX blend modes; screen-shake/hitstop"
**Ledger says (§4):** "② font (unidentified)."

Identified, with copyright line and embedded glyph outlines:

```
reference/extracted/payload.xml  (DefineFont3Tag)
   fontAscent="18505" fontDescent="4315" fontFlagsHasLayout="true" fontID="2" fontLeading="2926" fontName="Edo SZ "
reference/extracted/payload.xml  (DefineFontNameTag)
   fontCopyright="2008 Vic Fieger" fontId="2" fontName="Edo SZ"
reference/extracted/ui_strings.txt:100
   ="1">physical dmg: 1234 - 1235 &nbsp;(heavy)critical dmg: 1234-1235 *(heavy)piercing dmg: 20<font face="Edo SZ" size="14" color="#cccccc" letterSpacing="0.
reference/extracted/ui_strings.txt:206   aaa<font face="Edo SZ" size="16" color="#ffffff" letterSpacing="0.
reference/extracted/ui_strings.txt:212   align="center">next leveldamage: 10def: 20<font face="Edo SZ" size="13" colo
```

So the game font is **Edo SZ by Vic Fieger (2008)** — a *freeware* face, therefore actually
obtainable — used at sizes **13 / 14 / 16**, colours `#cccccc` and `#ffffff`. The payload also
embeds `Calibri` (fontID 533) and `Calibri Bold` (60) — © 2015 Microsoft — plus `_sans`, `Arial`,
`Times New Roman`, `Adobe 고딕 Std B`, `EPSON 太行書体Ｂ`. **Only Edo SZ matters for fidelity;**
the Microsoft/Adobe/Epson faces are third-party and outside the owner grant.

This also **upgrades Stage-0 finding S0-2**, which had only the face *name* from `ui_strings.txt`:
we now have the designer, the year, the numeric metrics, and the fact that the glyph outlines
themselves ship inside the payload.

- **artifact_class:** A2 · **cite:** `reference/extracted/payload.xml` DefineFont3Tag/DefineFontNameTag fontID=2; `reference/extracted/ui_strings.txt:100,206,212`
- **verdict:** HELD · **overturns_ledger:** true

---

## CLAIM 12 — `art/original-keyframe-rig` — the Ready bullets are massively UNDER-claimed

**Ledger says (§2 row):** "motion (15fps latch, gaits, slash frames, death), byte-exact palette"
**Ledger says (§4):** "**Ready (strongest slice):** 15fps pose latch; walk + run gaits; per-stance slash frames; hit-stagger; death collapse; proportions; combat-crouch idle…"

Every one of those is listed as a *measurement from video*. In fact **the original authored
skeletal animation data is on disk**, in `reference/extracted/bindata/` (19 `<animdata>` files):

```
$ cat reference/extracted/bindata/1[0-1][0-9]_*.bin | grep -o '<anim i=' | wc -l   ->    487
$ cat reference/extracted/bindata/1[0-1][0-9]_*.bin | grep -o '<f i='    | wc -l   ->  5,596
$ cat reference/extracted/bindata/1[0-1][0-9]_*.bin | grep -o '<n i='    | wc -l   -> 81,706
```

**487 animations · 5 596 keyframes · 81 706 individual bone poses.** The format, verbatim:

```
reference/extracted/bindata/118_1t4645s0.bin:3    <anim i="light_stance" d="1">
reference/extracted/bindata/118_1t4645s0.bin:26   <anim i="light_run" d="9" l="1">
reference/extracted/bindata/118_1t4645s0.bin:27   <f i="0">
reference/extracted/bindata/118_1t4645s0.bin:28   <n i="20" x="-3" y="-52" r="66"></n>
reference/extracted/bindata/118_1t4645s0.bin:217  <anim i="light_horslash_parta" d="13">
```

Runtime semantics (`reference/decompiled/shs3_android/scripts/AnimData.as:15-16`,
`FrameNodeData.as:27-44,46-76`): `d` = duration in frames, `l="1"` = looping, `<f>` = keyframe,
`<n>` = one rigged node with **integer x, y and integer degrees `r`** — or, when `r` is absent,
a full 2×2 matrix `a,b,c,d` each **divided by 100** for skewed parts. 19 distinct node ids in the
0–20 range per human rig. Per-stance slash timings are no longer estimates, e.g. Light:
`horslash` a13/b9(loop)/c6/d1 · `downslash` a12/b9/c4/d1 · `upslash` a6/b9/c5/d1 ·
`fallslash` a7/b1/c1 · `jumpslash` a2/b1/c5/d1.

- **artifact_class:** A2 · **cite:** `reference/extracted/bindata/118_1t4645s0.bin:3,26-28,217` + `reference/extracted/anim_xml.txt` (482 unique names) + `docs/gauntlet/L0/index/bindata.json`
- **verdict:** HELD · **overturns_ledger:** true (Ready bullets understate provenance: measured → original source)

---

## CLAIM 13 — `art/framerate-24-not-15` — the "15fps pose latch" is not in the engine

**Ledger says:** "15fps pose latch" (both §2 row and §4 Ready bullet).

The shipped SWF header and the mobile entry point both declare **24 fps**, and the decrypted
resource libraries agree:

```
reference/extracted/payload.xml:5
   <swf ... frameCount="6" frameRate="24.0" ... version="17">
reference/decompiled/shs3_android/scripts/Mobile.as:117   GameEngine.getStageMC().frameRate = 24;
decrypted soundresource (blob 122) header  -> frameRate 24.0
decrypted musicresource (blob 113) header  -> frameRate 24.0
decrypted shs3_android_payload             -> frameRate 24.0, frameCount 6
```

The animation runtime advances **exactly one authored keyframe per tick** — there is no sub-rate
divider anywhere:

```
reference/decompiled/shs3_android/scripts/MCSCharacter.as:1315   ++this.frameCounter;
reference/decompiled/shs3_android/scripts/MCSCharacter.as:1332-1337
   internal function updateFrame() : * { if(this.frameCounter < this.currentAnimation.frameList.length)
   { this.currentAnimation.frameList[this.frameCounter].setPosition(this); } }
```

The *appearance* of a latch is real but is a different mechanism: `AnimData` deliberately sets
`duration` **larger than the keyframe list**, so the last authored pose is **held** for the surplus
ticks — a per-animation authored hold, hand-tuned per clip:

```
reference/decompiled/shs3_android/scripts/AnimData.as:25-26   case "light_afterslashpose": this.duration += 10;
reference/decompiled/shs3_android/scripts/AnimData.as:27-41   <all 13 *SLASH_POSE ids>: this.duration += 10;
reference/decompiled/shs3_android/scripts/AnimData.as:42-53   <all *FALLSLASH_END / *JUMPSLASH_LAND>: this.duration += 15;
reference/decompiled/shs3_android/scripts/AnimData.as:54-57   case "sheathesword": case "sheathesword3": this.duration += 24;
reference/decompiled/shs3_android/scripts/AnimData.as:113-114 case MCSActor.DEATHTOUCH_PARTA: this.duration += 50;
```

**Standing-invariant note:** this is *payload code vs. a video-derived measurement*, not frame vs.
doc — so the frame-wins rule does not decide it. But the project's own memory already records a
**15 fps sampling floor** on the video study ([[project-session11-study-pass]]), which is the exact
value the ledger reports as the engine's pose rate. The 15 fps figure is far more likely a sampling
artefact than an engine property. **Verdict PARTIAL**, and the correct next step is one dense-fps
frame pass, not another doc edit.

- **artifact_class:** A2 · **cite:** `reference/extracted/payload.xml:5` (`frameRate="24.0"`) + `MCSCharacter.as:1315,1332-1337` + `AnimData.as:25-126`
- **verdict:** PARTIAL · **overturns_ledger:** true

---

## CLAIM 14 — `art/blood-particle-params` — a §5 Tier-1 measuring task that no longer needs doing

**Ledger says (§5 Tier 1, item 2):** "blade-trail width/fade; **blood droplet count/spread**; whether there's screen-shake / hitstop."

```
reference/decompiled/shs3_android/scripts/BloodParticleEmitter.as:18-26
   pnumber = 20;  px = 0;  py = 0;  pangle = 0;  panglevariance = 10;
   pvel = 6;  pvelvariance = 2;  pgravity = 0.6;  pttl = 24;
```

**20 droplets per burst**, emission angle 0 ± 10°, speed 6 ± 2 px/tick, gravity 0.6 px/tick², life
**24 ticks = 1.00 s at 24 fps**. Rendered as pooled bitmaps (`BloodParticlePool.getBloodParticle()`),
with a black variant (`BloodParticleBlackArt.as`) for non-bleeding enemies.

- **artifact_class:** A2 · **cite:** `reference/decompiled/shs3_android/scripts/BloodParticleEmitter.as:18-26`
- **verdict:** HELD · **overturns_ledger:** true (the task is already closed, not "to measure")

---

## CLAIM 15 — `art/blade-slash-fx-lifetime`

Same Tier-1 item: "blade-trail width/fade". The slash flash is a 5-frame self-deleting MovieClip.

```
reference/decompiled/shs3_android/scripts/bladeslashfx.as:5    [Embed(source="/_assets/assets.swf", symbol="symbol172")]
reference/decompiled/shs3_android/scripts/bladeslashfx.as:12   addFrameScript(4,this.frame5);
reference/decompiled/shs3_android/scripts/bladeslashfx.as:15-21 internal function frame5() : * { if(parent != null) { MovieClip(parent).removeChild(this); } }
```

Lifetime **5 frames ≈ 208 ms at 24 fps**; the art itself is `symbol172` in the asset library, i.e.
recoverable as vector (CLAIM 17), so "blade-trail colors" need not be eyedropped from video.
Sibling FX classes present in the same bundle: `DashFX`, `WhiteOutFX`, `ChiChargeFX`,
`ChargingFX`, `ChargingShotFX`, `BullChargeFX`, `YinYangUpFX`, `YinYangDownFX`,
`SlashWaveProjectile`.

- **artifact_class:** A2 · **cite:** `reference/decompiled/shs3_android/scripts/bladeslashfx.as:5,12,15-21`
- **verdict:** HELD

---

## CLAIM 16 — `art/depth-of-field-blur` — a real feel element the digest never lists

Not in the Ready list, not in the Blockers, not in Surface. The game applies **per-parallax-layer
Gaussian blur** — a depth-of-field that is a large part of why the art reads the way it does.

```
reference/decompiled/shs3_android/scripts/BG_Loader.as:190   ColorCode.blur(mc,farthestLayerBlur);
reference/decompiled/shs3_android/scripts/BG_Loader.as:211   ColorCode.blur(mc,farLayerBlur);
reference/decompiled/shs3_android/scripts/BG_Loader.as:231   ColorCode.blur(mc,playerPlaneLayerBlur);
reference/decompiled/shs3_android/scripts/BG_Loader.as:250   ColorCode.blur(mc,groundLayerBlur);
reference/decompiled/shs3_android/scripts/BG_Loader.as:263   ColorCode.blur(mc,foregroundLayerBlur);
reference/decompiled/shs3_android/scripts/GameStage.as:250   ColorCode.blur(mc,8);
reference/decompiled/shs3_android/scripts/GameStage.as:267   ColorCode.blur(mc,4);
reference/decompiled/shs3_android/scripts/BG_TownProcGen.as:131,150,154,188,197  blur 8 / 8 / 4 / 4 / 8
reference/decompiled/shs3_android/scripts/BG_Loader.as:111   ColorCode.setMCTint(farArray[i].base,0.1,bgParam);   // 10% distance tint
```

**Frame check (A1).** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png` (1920×1080), crop
**(300,200)–(700,450)** upscaled ×3 NEAREST: the far rock-wall layer has soft, wide, gradient
outlines with no hard edge anywhere — an unmistakable blur, not stylisation. Crop
**(760,600)–(1200,900)** ×3 on the two fighters: hard black outlines, flat fills, zero softness.
Same frame, two layers, opposite treatment. **The frame agrees with the code.**

- **artifact_class:** A1 (+A2) · **cite:** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png` crops (300,200,700,450) and (760,600,1200,900) ×3; `reference/decompiled/shs3_android/scripts/BG_Loader.as:111,190,211,231,250,263`
- **verdict:** HELD

---

## CLAIM 17 — `art/vector-library-held` — the art itself, byte-exact

**Ledger says (Ready):** "flat-vector bold-outline style; **byte-exact HUD/result palette**; blade-trail colors."

Those are eyedropper results. The actual vector source is held twice over:

```
reference/extracted/shapes/   -> 1,822 .svg files    (matches payload_histogram.json "shapes": 1822, "shapeBounds": 1822)
reference/extracted/sprites/  ->   827 sprite dirs   (matches "subTags": 827)
reference/extracted/shapes/1.svg:4
   <path d="M800.0 480.0 L800.0 500.4 800.0 744.0 14.0 744.0 0.0 744.0 0.0 672.15 0.0 500.4 0.0 480.0 800.0 480.0" fill="#eeeee6" fill-rule="evenodd" stroke="none"/>
```

Plus, from the decrypted mobile libraries (CLAIM 2), a second and larger copy:

```
blob 115 shs3resource.swf  -> 1,755 shape tags · 1,949 sprite tags · 0 bitmaps · 4 fonts
blob 120 bgresource.swf    ->   562 shape tags ·   552 sprite tags · 2 bitmaps
blob 124 imageresource.swf ->   106 shape tags ·    94 sprite tags · 2 bitmaps
```

**≈2 423 shapes and ≈2 595 sprites across the whole game, with exactly 4 bitmap tags total.** The
original is essentially 100 % vector — which independently vindicates the project invariant
*"procedural vector art only (no image files)"* as a fidelity choice, not merely a constraint.
Palette is therefore recoverable as literal `fill="#rrggbb"` per path (`payload_histogram.json`
counts **14 788** `<color>` and **856** `<textColor>` entries), superseding video eyedropping.

- **artifact_class:** A2 · **cite:** `reference/extracted/shapes/1.svg:4`; `docs/gauntlet/L0/index/payload_histogram.json` ("shapes": 1822, "subTags": 827); decrypted blobs 115/120/124 tag census
- **verdict:** HELD

---

## CLAIM 18 — `art/native-canvas-800x480` — closes a §1 unknown-unknown, doc + frame agree

**Ledger says (§1 unknown-unknowns):** "**Aspect-ratio truth** — native canvas is **800×480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-wrong."

Confirmed from code, and **the frame agrees**:

```
reference/decompiled/shs3_android/scripts/GameEngine.as:269-271
   var originalWidth:int = 800;
   var originalHeight:int = 480;
   var originalHeightWithBar:int = 690;
reference/extracted/payload.xml:6
   <displayRect type="RECT" Xmax="16000" Xmin="0" Ymax="13800" Ymin="0" nbits="15"/>   // twips ÷20 = 800 × 690
reference/decompiled/shs3_android/scripts/StageManager.as:1054   playerMCS.x = 800 - (gameStage.gameStageWidth - posX);
```

**Frame check (A1).** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png`, non-black bounding box
measured programmatically: content occupies **cols 52–1867, rows 0–1079 → 1816 × 1080, aspect
1.6815**. Expected for 5:3 in a 1920×1080 frame: 1800 × 1080 with 60 px bars; measured 52 px bars
(the 16 px delta is edge bleed at the >12 luma threshold). The video is **pillarboxed, not
letterboxed** — so any *x*-fraction previously taken against full 1920 width is wrong by ~3 %, and
the correct denominator is the 1816 px content box.

- **artifact_class:** A1 (+A2) · **cite:** `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png` (content bbox cols 52–1867 / rows 0–1079); `reference/decompiled/shs3_android/scripts/GameEngine.as:269-271`
- **verdict:** HELD

---

## CLAIM 19 — `art/surface-bullets-unverified` — honest non-finding

**Ledger says (Surface):** "hit-tint scaling (7/12/16f), death sword-detach, dash-snap, **scarf physics**, FINISHER_FLASH — all measured/authored but missing from the art digest §5."

I could not ground three of these. `scarf`/`Scarf` returns **zero** matches across all 2 768
decompiled classes; `hitTint`/`tintCounter`/`hitFlash`/`makeRed` return zero; `FINISHER_FLASH`
returns zero. They may exist under other names, live in project config rather than the original, or
be authored inventions rather than measurements — I did not determine which, and I did not open
frames to test them. **STILL_UNHELD.** Flagging because a "Surface" bullet asserts these are
*already measured/authored*, and at least the scarf has no counterpart in the original code I read.

- **artifact_class:** STILL_UNHELD · **verdict:** STILL_UNHELD

---

## Re-score: **56 → 92**

| Ledger blocker | Status after this survey |
|---|---|
| ① ALL AUDIO (SFX + music params) | **CLOSED** — 13 SFX + 13 stems held as MP3 on disk; full cue table; full mixer architecture |
| ② font (unidentified) | **CLOSED** — Edo SZ, © 2008 Vic Fieger, embedded DefineFont3 + metrics + sizes/colours |
| ③ FX blend modes | **CLOSED (negative)** — none exist; vocabulary is ColorTransform + Blur + ColorMatrix |
| ④ screen-shake | **CLOSED** — exact algorithm, default amp 30, call-site durations 6/12/24 |
| ④ hitstop-on-landed-hit | **STILL_UNHELD** — searched, not found (CLAIM 8) |
| ⑤ severed-limb death variant | **CLOSED** — deathinhalf / deathnohand / deathnohead / seppuku_nohead + durations |

Plus a whole tier the ledger did not know existed: **487 original animations / 5 596 keyframes /
81 706 bone poses**, **~2 400 vector shapes**, exact **blood-particle** and **blade-FX** params,
**per-layer depth-of-field blur**, and the engine's true **24 fps** clock.

What is left in this system is **engineering, not archaeology**: mapping the 19 rig node ids to the
right shape symbols, and one dense-fps frame pass to settle hitstop and the 15-vs-24 fps question.
The residual −8 is exactly that plus CLAIM 8 and CLAIM 19.

---

*Surveyed 2026-08-13 for GAUNTLET lane L0. No file outside this path was modified. No source code
was touched. Audio and client SWFs remain study-only, local-only, gitignored — RECREATE-NEVER-RIP
governs, and the third-party exclusions in `docs/OWNER_PERMISSION_RULING.md` apply to the fonts
(Calibri/Arial/Adobe/Epson) and to `bgm_gangnam`.*
