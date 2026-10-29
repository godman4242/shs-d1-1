# GAUNTLET L0 — system survey: **art-anim-audio-feel** (ledger score 56)

Auditor: system-surveyor agent · date 2026-08-14 · document under audit:
`docs/research/REBUILD_READINESS.md` (2026-07-20), block `### art-anim-audio-feel — 56`
(lines 238–241), plus §2 scorecard row (line 126), §1 unknown-unknowns (lines 303–307),
§5 Tier-1 (lines 320–324) and §6 "structurally UNRECOVERABLE" (lines 292–299).

## HEADLINE

**The entire "Blockers" list for this system is dead.** Four of the five named blockers
are now held as first-class artifacts; the fifth (hitstop) is answered in the negative.
The single biggest result:

> ⛔ **THE AUDIO IS RECOVERED.** Not "characterisable", not "held-but-encrypted" —
> **26 master assets extracted to disk as playable MP3**: 13 SFX and 13 music stems,
> with exact format, sample rate, bitrate and duration. Stage-0 finding **S0-5 is
> OVERTURNED** ("audio is HELD but ENCRYPTED … You may NOT claim audio is recovered")
> and so is §6's "the exact waveforms/envelopes are not [study-able]".

The break: the five `CWS`-headed "encrypted" blobs use **the same transform the
top-level payload used** (`reference/tools/payload_decode.py`: swap `b[i]↔b[i+256]`
for `i∈[3,256)` where `i%11==0`, then `b[i] ^= key`) — only with a **different XOR key
per file**. Key recovered by 256-way brute force, validated by the body inflating cleanly:

| blob | key | result |
|---|---:|---|
| `122_Mobile_SoundResource.bin` | **111** | CWS v17, declared 29,631 → inflates **29,623 B** |
| `113_Mobile_MusicResource.bin` | **117** | CWS v17, declared 1,402,685 → inflates **1,402,677 B** |
| `124_Mobile_ImageResource.bin` | **109** | CWS v17 → **1,908,229 B** |
| `115_Mobile_SHS3Resource.bin`  | **104** | CWS v17 → **1,040,849 B** |
| `120_Mobile_BGResource.bin`    | **103** | CWS v17 → **4,412,340 B** |

Decoded copies + extracted MP3s live in the session scratchpad
(`…/scratchpad/dec/`, `…/scratchpad/dec/sfx/*.mp3`) — **nothing was written into the repo.**
Study-only, local-only, per the owner ruling.

---

## CLAIMS

### AA-1 — Audio is recovered, not merely "encrypted" (A3) — OVERTURNS §4 blocker ① and Stage-0 S0-5
`122_Mobile_SoundResource.bin` decodes with key 111 into a valid SWF holding **13
`DefineSound` tags + a `SymbolClass` table naming every one**:

```
deflect  die2  sumo  slash3  die3  refund  die1  slash2  slash1  goodkoto  hitmetal  fart  punch
```

Every one: `MP3, 11025 Hz, 16-bit, mono`. Written out and verified with macOS `afinfo`
(independent decoder — proves they are real, decodable MP3, not garbage):

| SFX | duration (afinfo) | SFX | duration |
|---|---:|---|---:|
| slash1 | 0.572 s | die1 | 0.728 s |
| slash2 | 0.780 s | die2 | 0.884 s |
| slash3 | 0.520 s | die3 | 1.092 s |
| punch  | 0.572 s | deflect | 1.040 s |
| hitmetal | 0.780 s | goodkoto | 1.820 s |
| fart | 0.418 s | sumo | 3.120 s |
| refund | 0.988 s | | |

`afinfo` line, verbatim: `Data format: 1 ch, 11025 Hz, .mp3 … 576 frames/packet` /
`estimated duration: 0.572000 sec` (MPEG-2.5 Layer III, 16 kbps).

**Ledger sentence overturned** (§4): “① **ALL AUDIO** — every SFX + music param is
INFERRED, no composer sourced.”
**§6 sentence overturned:** “**Exact original SFX & music synthesis params** — the
*character* is study-able from audio; the exact waveforms/envelopes are not.”
The waveforms are on disk. WebAudio-synthesis of these SFX is now a *matching* problem
against a reference file, not an invention problem.

### AA-2 — The music is 13 layered stems, and we have them all (A3)
`113_Mobile_MusicResource.bin` (key 117) → 13 `DefineSound` + `SymbolClass`:
`battlechants battledrums flutes safeambience safekoto safepercussion dungeonambience
dungeonflute dungeonpercussion dungeonpiano bgm_gangnam bgm_levelup bgm_lose`.
Measured durations (afinfo):

* **79.872 s exactly** — flutes, battledrums, battlechants, safeambience, safekoto, safepercussion
* **45.760 s exactly** — dungeonambience, dungeonflute, dungeonpercussion, dungeonpiano
* bgm_levelup 29.900 s · bgm_lose 3.744 s · bgm_gangnam 3.848 s

The six "overworld family" stems being **bit-for-bit the same length** is the mechanism
that lets them layer in phase. This is the composer's grid, measured.

### AA-3 — The adaptive-music engine is fully specified in code (A2)
`reference/decompiled/shs3_android/scripts/MusicManager.as`.
17 presets are boolean masks over the 13 stems, e.g. verbatim:
`this.presetsArray[MUSIC_TOUGHBATTLE][this.TRACK_BATTLECHANTS] = true;` (line 140).
Preset table: EXPLOREBATTLE = flutes+battledrums · TOUGHBATTLE = +battlechants ·
EXPLORESAFE = flutes+safeambience · EXPLORETOWN = +safekoto · EXPLOREDANGER =
flutes+safeambience+safepercussion · DOJO = flutes+safeambience+safekoto+safepercussion ·
DUNGEON = dungeonambience+dungeonflute · DUNGEONDANGER = +dungeonpercussion ·
DUNGEONCREEPY = dungeonpiano alone · DUNGEONCREEPYDANGER = all four dungeon stems ·
PVP = battledrums+battlechants · DUNGEONBATTLE = battledrums+dungeonflute.
Crossfade, verbatim (lines 301 / 329): `sndTransform.volume -= 0.05;` /
`sndTransform.volume += 0.05;` — **±0.05 per tick → a 20-tick ≈ 0.83 s fade at 24 fps.**
A newly-enabled stem starts at the *playhead position of the currently-playing anchor
stem* (`playPosition = int(this.scArray[this.TRACK_FLUTES].position)`, line 206) so
layers enter phase-locked; stems loop by re-`play()` on `SOUND_COMPLETE` (line 279);
`bgm_lose` plays once (`play(0,1)`), `bgm_levelup` `play(0,999)`.
Which preset plays where is a hard `pickMusic(bg,isHostile,isPvP)` switch over the BG id
(`SoundManager.as:114-173`).

### AA-4 — SFX playback params are held too (A2)
`SoundManager.as:187-219`: **slash picks 1 of 3 at random** (`var dice:int = Math.random()*3`
→ `slash1|slash2|slash3`), death likewise 1-of-3 (`die1|die2|die3`).
`playHit()` **and** `playHurt()` both play the same asset — verbatim line 261 and 274:
`var sound:Sound = ResourceManager.getSound("punch");`. Every call is a bare
`sound.play()` — **no SoundTransform: volume 1.0, pan 0, no loop, offset 0.**
So "every SFX param is INFERRED" is false in both halves: the asset *and* its playback
contract are held.

### AA-5 — The font blocker is closed with copyright strings (A2/A3) — kills §4 blocker ②
`DefineFontName` tags inside the decoded resource SWFs:
* `115_Mobile_SHS3Resource`: id 307 `Edo SZ` © `2008 Vic Fieger`; id 12
  `EPSON 太行書体Ｂ` © `(C) 2000 SEIKO EPSON CORP.`; id 61 `Adobe 고딕 Std B`;
  id 161 `MS UI Gothic 標準`.
* `124_Mobile_ImageResource`: id 76 `Edo SZ` © `2008 Vic Fieger`.

This is stronger than Stage-0 S0-2 (which had only `face="Edo SZ"` in `ui_strings.txt`):
we now have the **embedded font programs** and their vendor strings, in two independent
containers. **Ledger sentence overturned:** “② font (unidentified).”
⚠️ **Licence caveat:** Edo SZ is **Vic Fieger's** font, not Lut's. The owner ruling
explicitly excludes third-party fonts. Identifying it is not the same as being free to redistribute it.

### AA-6 — "FX blend modes" is answered: the game uses NONE (A2) — kills §4 blocker ③
Exhaustive grep for `blendMode` across all 559 android client classes returns **only**
`mx/core/IFlexDisplayObject.as:87` (a framework interface the game never implements) —
same result in `shs3_payload`. **No game class ever sets a blend mode.** All compositing
is `ColorTransform` + two filters, and the whole vocabulary is one small class,
`ColorCode.as`:
* `setMCTint(mc, mul, col)` (line 110-120) — the exact tint formula:
  `ct = new ColorTransform(1-mul, 1-mul, 1-mul, 1, round(mul*r), round(mul*g), round(mul*b), 0)`
* `makeBlack` = `ColorTransform(0,0,0,1,0,0,0,0)` (silhouettes)
* `desaturate` = `ColorMatrixFilter([0.3,0.59,0.11,0,0, …])` (luma weights)
* `blur/blurHIGH` = `BlurFilter(n,n,LOW|HIGH)`
* `changeColor(obj,color)` — used on `primaryColor`/`secondaryColor` sub-clips of every
  equipment part (`MCSCharacter.as:748-1063`) = the two-tone dye system.
A recreation that reaches for additive/screen blending is **diverging from the original**.
Corroborated by A1 (see AA-13): the blade trail is a flat opaque shape, not a glow.

### AA-7 — Screen-shake is fully catalogued (A2) — kills half of §4 blocker ④
`StageManager.as:1200-1227`, verbatim:
```
public static function startShake(shakeDuration:int, shakeAmt:int = 30)
...
shakeAmount = Math.min(screenShakeAmt,screenShakeCounter);
gameStage.x = screenShakeStartPos.x + (-shakeAmount / 2 + Math.random() * shakeAmount);
gameStage.y = screenShakeStartPos.y + (-shakeAmount / 2 + Math.random() * shakeAmount);
```
i.e. **uniform random offset in ±amt/2 on both axes, every tick, amplitude 30 px by
default, auto-tapering over the final `amt` ticks (`min(amt,counter)`), snapping back to
the exact start position at 0.** It is stepped from `StageManager.update()` **outside**
the `STATE_FROZEN` gate (line 826-830), so the shake keeps running while the action is
frozen. Trigger set found: Cleave impact `startShake(12)` (`MCSPlayer.as:911`),
Earthquake jutsu `startShake(24)` (`MCSPlayer.as:946`), player launched/knocked back
`startShake(12)` (`MCSPlayer.as:4180`), crusher traps `startShake(6)`, a data-driven
`Marker_RumbleTrigger` (`shakeDuration=24, shakeAmt=30` defaults, overridable per room).
**Ledger sentence overturned:** “④ **screen-shake** + **hitstop-on-landed-hit** (never
catalogued)”, and §1's UNKNOWN-UNKNOWNS “**screen-shake** and **hitstop-on-landed-hit**
(never catalogued)”, and §5 Tier-1's "whether there's screen-shake / hitstop".

### AA-8 — There is **no** hitstop on a landed hit (A2, negative) — PARTIAL
Greps for `hitstop|hitpause|freezeframe|slowmo|timeScale|hitFreeze` return nothing.
The only time-freeze in the engine is `STATE_FROZEN`, set at exactly two sites
(`StageManager.as:162, 212`) — both the **battle-intro bar**, not a hit — and the
end-of-battle `redFreezeCounter`. `gotHit` (`MCSPlayer.as:3714-3720`) sets
`gotHitCounter = 12` and no global freeze. Verdict: **PARTIAL** — a negative from an
exhaustive grep of one build. Honest statement: *no hitstop mechanism exists in the
Android v0.682 client; a recreation that adds one is adding a deviation.*

### AA-9 — Severed-limb death is not one variant, it's a whole gore system (A2) — kills §4 blocker ⑤
The human animation set (`108_1t4635s0.bin`, web payload) contains, as `<anim i=...>`:
`death` (38 f) · `deathenemy` (23) · **`deathnohand` (25)** · **`deathnohead` (31)** ·
**`deathinhalf` (28)** · `deathwitharrow` (23) · `deathbyarrow` (21) · `deathdowned` (7)
— plus `seppuku_start/mid/end` and `seppuku_nohead` in `103_1t4630s0.bin`.
The **selection rule** is in code (`EnemyGoblin.as:352-432`, mirrored in every Enemy*
class), verbatim:
```
if(Math.random() * 2 < 1) { mcs.scaleX = -mcs.scaleX; }        // 50% corpse mirror
if(!StatsManager.censored && fatal) {
   if(behead) { startAnim(ENEMYDEATHNOHEAD); ... }
   else { dice = Math.random() * 5;
          dice<=1 -> GOB_DEATH ; ==2 -> ENEMYDEATH ; ==3 -> ENEMYDEATHNOHAND ; ==4 -> DEATHINHALF }
```
⇒ on a non-behead fatal blow the split is **40% plain / 20% plain-alt / 20% one-armed /
20% cut-in-half**, and `StatsManager.censored` (`StatsManager.as:314`, default **false**)
is a global gore switch. **Ledger sentence overturned:** “⑤ severed-limb death variant.”

### AA-10 — Blood VFX numbers are exact, no frame-measuring needed (A2)
`BloodParticleEmitter.as:18-26`, verbatim defaults:
`pnumber = 20; px = 0; py = 0; pangle = 0; panglevariance = 10; pvel = 6;
pvelvariance = 2; pgravity = 0.6; pttl = 24;`
(24 ticks ≈ **1.0 s** at 24 fps). Per-death overrides are literal too — beheading spawns
emitters at `PART_neck` angle **130** and/or `PART_head` angle **180** with
`setVel(4) / setNumber(10)`; one-armed spawns at `PART_neck` 60 + `PART_l_uparm` 180
with `setVel(5)`; cut-in-half at `PART_stomach` 180 / `PART_pelvic` 120; torso deaths use
angle 80–90 with `setAngleVariance(15)`.
**§5 Tier-1 item 2 overturned:** “Frame-measure combat numbers from existing footage:
… blade-trail width/fade; blood droplet count/spread; whether there's screen-shake /
hitstop.” None of that needs measuring now.

### AA-11 — The animation clock is **24 fps, one keyframe per tick**, and the "latch" is a code-added tail (A2/A3) — CORRECTS the ledger's headline Ready bullet
Three independent artifacts agree on 24 fps:
1. SWF header of the real web client `reference/preservation/shs3.swf` → **framerate 24.0**
   (and stage rect 800×690 twips-decoded; see AA-14).
2. `Mobile.as:117` verbatim: `GameEngine.getStageMC().frameRate = 24;`
3. Every duration constant in the engine is written as `24 × seconds`
   (`WhiteOutFX.as:22-30`: `ttlMax = 24 * 3 / 24 * 4 / 24 * 5`;
   `StageManager.as:1096-1101`: `redFreezeCounter = 24 * 3 + 6` / `24 * 6`).
The rig: `FrameNodeData.as` — each `<n>` is a joint with `x`,`y`,`r` (or a 2×2 matrix
`a,b,c,d` **÷100** when skewed), applied straight onto a MovieClip
(`mc.x/mc.y/mc.rotation`). 21 nodes per pose in the stance sets.
The clock: `MCSCharacter.updateAnimation()` does `++this.frameCounter` **once per game
tick** and `updateFrame()` only assigns a pose **while `frameCounter < frameList.length`**.
Measured over the whole XML: **`@d` == the number of `<f>` children for every anim**
(light_stance d=1/1f, light_run d=9/9f, walk d=20/20f, death d=38/38f …) — so the data
holds **no** hold frames. The holds are injected in code by `AnimData.as:23-142`
(`duration += 10` after every stance's slash pose, `+= 15` on jumpslash land, `+= 24` on
sheathe, `+= 6` on deaths, `+= 48` on `ogre_nap1_mid`, …), and `updateFrame()`'s guard
latches the final pose for those extra ticks.
**Ledger sentence contested** (§4 Ready): “15fps pose latch”. The authored motion is a
**24 Hz keyframe stream with per-animation hold tails**, not a 15 Hz latch. The 15 fps
figure is a video-sampling artifact (project memory already flags a "15fps sampling
floor"); no frame contradicts the payload here — the dense stills are 0.1 s apart (10 Hz)
and cannot resolve 24 vs 15. Marked **PARTIAL**, not HELD, because the *visible* cadence
of a specific animation could still read as slower; but the clock and the model are settled.

### AA-12 — The Android caveat **dissolves** for animation: 14 of 18 blobs are byte-identical to the web payload (A3)
MD5 over both trees:
`reference/extracted/android/99_MCSCharacter_HumanAnimationData.bin` ==
`reference/extracted/bindata/108_1t4635s0.bin` == `bcfd658e79fafb41f52431afb7d10622`
(and LightStance == `a4d5501845c9fd553710c4d8139a7cd0`, etc.)
Byte-identical: Human, Human2, Light/Balanced/Heavy/Dual/Reversed stances, Undead, Bear,
Deer, Wolf, Goblin, Boar, Horse (**14/18**) — plus TrapRoomData, MapBitmapData and all 5
NameGenerator tables (21 blobs total).
Differing (v0.717 drifted): Ogre, Skills (51 anims), Guardian, HumanSpear.
Total authored animations in the **web** payload: **487 `<anim>`** across 19 animdata
blobs — vs the board's assumed "~150" (Stage-0 S0-4 estimated ~450; measured 487).
⇒ Animation claims sourced from the Android build are **web-parity** for 14/18 sets, and
that is provable by hash, not assumed.

### AA-13 — A1 frame check: the blade trail is a flat opaque vector wedge, not a glow
Frame `reference/frames/duel_dense/Nr4fQstqHDM_432.0.png` (1920×1080), crop
`(900,600)-(1300,900)` upscaled ×3 Lanczos. **Visibly:** a wide hard-edged **blue** wedge
sweeping left from the fighter's hands — mid-blue upper body, darker blue lower half,
a **white double-stripe core** running its length, a solid **black outline**, tapering to
a point at the tail; it occludes the grass behind it rather than lightening it.
Also visible: navy haori with red trim, cream obi, white hakama, straw kasa, bold black
outlines (the ledger's "flat-vector bold-outline style" — CONFIRMED by frame);
a felled bare-torso enemy sprawled at the fighter's feet with his kasa fallen beside him,
**no blood and no severed limb at this instant** (consistent with a non-gore variant, or
with blood already expired at `pttl=24` ≈ 1 s).
This frame **corroborates AA-6**: an opaque outlined shape is what "no blendMode" looks
like. Where a doc were to claim an additive/glow trail, **the frame wins** and it does not.
Supporting A2: `bladeslashfx.as` is a **5-frame** clip that deletes itself
(`addFrameScript(4,this.frame5)` → `removeChild(this)`), i.e. the slash FX lives ~0.21 s.

### AA-14 — Aspect-ratio truth is closed, and the frame arbitrates it
The ledger lists this under UNKNOWN-UNKNOWNS: “**Aspect-ratio truth** — native canvas is
**800×480 (5:3)**, so HUD x-fractions measured off 16:9 video may be pillarbox-wrong.”
It is now a payload CONTRACT: `GameEngine.as` `resizeHandler`, verbatim
`var originalWidth:int = 800;` / `var originalHeight:int = 480;`, with
`newScale = stageHeight/originalHeight; offsetX = (stageWidth - originalWidth*newScale)/2`
and `stageMC.fullScreenSourceRect = new Rectangle(0,0,800 * newScale,480 * newScale)`;
`StageManager.as:159` positions the battle intro bar at `(480 - 80)/2 * stageScale + offsetY`.
**Conflict, resolved in the frame's favour:** the SWF *document* rect of the real client
`shs3.swf` decodes to **800×690 px** (16000×13800 twips) — but measuring the non-black
content box of `Nr4fQstqHDM_432.0.png` gives **cols 52…1867 × all 1080 rows = 1816×1080,
aspect 1.6815** (stable across thresholds 5→60 and across frames), which is 800×480
(1.6667), *not* 800×690 (1.159). **THE FRAME WINS: the visible game surface is the
800×480 design canvas, pillarboxed.** The 690-tall document rect is container chrome,
not play area.

### AA-15 — The "kill-beat" has exact numbers (A2)
`StageManager.as:898-935, 1085-1101`. On victory `redFreezeCounter = 24 * 6` (**6.0 s**);
the win card is shown when it counts down to `24 * 5` (i.e. **1.0 s** after the freeze
starts); the freeze ends at `redFreezeCounter == 24` **unless the player is still playing
`SHEATHESWORDCHIBURI`** (the blood-flick sheathe), in which case it runs to 0. On defeat
`redFreezeCounter == 24 * 3` (**3.0 s**) then the lose card. Harvest actions use
`24 * 3 + 6`. Combat/UI/particles are gated off during the freeze, **but the screen shake
is not**.

### AA-16 — Uniform 12-tick hit reaction, and a head-hit damage multiplier (A2)
`gotHitCounter = 12` is set identically in **every** enemy class and in `MCSPlayer`
(0.5 s at 24 fps) and decremented once per tick — a single global hit-reaction window.
The ledger's Surface bullet "hit-tint scaling (7/12/16f)" is *authored*, not original;
the original's one number is **12**.
Bonus, outside my lane but load-bearing (`MCSPlayer.as:3687-3716`), verbatim:
```
case mcs.partList[MCSCharacter.PART_hat]:
case mcs.partList[MCSCharacter.PART_head]:
case mcs.partList[MCSCharacter.PART_neck]:
   behead = true;
...
if(behead) { damage *= 1.5; }
```
⇒ **hitting hat/head/neck sets the behead flag AND multiplies damage ×1.5.** The blade
path's *body-part intersection* is the crit-shaped mechanic nobody had. (Do **not**
conflate with the HUD's "150% DAMAGE" line visible in `Nr4fQstqHDM_432.0.png` — that sits
under "CANNOT CHANGE STANCE" and reads as the stance modifier. Two different 1.5s;
un-reconciled.)

### AA-17 — §6's "structurally UNRECOVERABLE" audio line is wrong; only the *stems' authorship* is
§6 verbatim: “**Exact original SFX & music synthesis params** — the *character* is
study-able from audio; the exact waveforms/envelopes are not.”
Held now: the waveforms (AA-1/AA-2), the mixing engine, the fade rate, the preset masks,
the trigger map. Genuinely still unheld: **the stems' internal musical analysis**
(BPM/key/instrumentation) — but that is a listening task on a file we possess, not a
recovery problem. §5 Tier-1 item 3 ("Listen-pass on … the two longplays + the 3 music
rips + 2012 trailer … the deepest gap") is obsolete: **do not listen-pass a YouTube rip
when the master stem is on disk.**

### AA-18 — STILL_UNHELD, stated plainly
* **The web build's own audio.** The web `payload.swf`'s 27 bindata blobs contain **no**
  `CWS` blob at all (checked every one) — the web client streamed its sound/image/bg
  resources separately, and we do not hold them. Every audio claim above is sourced from
  the **Android v0.682** build (`shs3_android/scripts/StatsManager.as:30`). Web-parity is
  **proven for animation** (AA-12) and **unproven for audio**. Label ported audio
  "Android v0.682".
* **Whether the OG's on-screen cadence reads as 24 fps.** Settled in data (AA-11), not in
  frames — the dense stills sample at 10 Hz.
* **Per-part vector art fidelity.** `115_Mobile_SHS3Resource` is now open (1,949
  `DefineSprite`, 1,594 `DefineShape4`, symbols `head_bear_0`, `torso_boar_0`, `acc3000`…)
  and `120_Mobile_BGResource` holds 49 named backgrounds (`BG_Dojo`, `BG_Mine`, …) — but
  I did not render or grade a single shape this pass. Open lane, now trivially openable.

---

## LICENCE / SAFETY FLAGS RAISED BY THIS PASS
1. **`bgm_gangnam`** is in the music resource. That is third-party pop material; the Lut
   Games grant does not cover it. Do not ship, do not "recreate" it.
2. **`Edo SZ` © 2008 Vic Fieger**, `EPSON 太行書体Ｂ`, `Adobe Gothic Std B`,
   `MS UI Gothic` — third-party fonts, explicitly outside the owner ruling. Identify,
   don't redistribute; source a licensed lookalike.
3. Decoded assets were written **only** to the session scratchpad, never into the repo,
   and are study-only under RECREATE-NEVER-RIP + the 2026-07-24 ruling.

## PROPOSED RE-SCORE
**56 → 84.** Motion (487 authored anims, byte-exact joint data, web-parity proven),
audio (26 masters + the full mixing contract), FX compositing (no blend modes; exact
tint/blur/desat vocabulary), shake, gore system, kill-beat timings and the 800×480
canvas are all now first-class artifacts. Withheld from a higher score: the vector art
itself is un-graded (AA-18), audio web-parity is unproven, and no test in the suite
pins any of it yet.
