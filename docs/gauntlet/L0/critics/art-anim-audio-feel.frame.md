# GAUNTLET L0 — BLIND CRITIC (Lens 4: THE FRAME LENS) — unit `art-anim-audio-feel`

Critic: blind-critic agent · date 2026-08-15 · reviewing
`docs/gauntlet/L0/systems/art-anim-audio-feel.md` (proposed re-score 56 → 84).

I did not see the surveyor's reasoning. Every verdict below cites an artifact **I** opened.
Scratchpad for all derived files (nothing written into the repo outside this file):
`/private/tmp/claude-501/-Users-kheshav-kheshav-code-SSHD-1-1/70279977-fb70-4a26-ba27-9b32a10d27dc/scratchpad`

---

## HEADLINE

**The audio result is real. I reproduced it end to end from raw bytes.** All five CWS blobs
decode, the 13 SFX and 13 music stems come out as playable MP3, and every duration in the
surveyor's table matched `afinfo` to the millisecond. Stage-0 **S0-5 is correctly overturned.**

**Four claims are refuted, and one of them is the exact Lens-4 failure this lens exists to catch.**

> ⛔ **The surveyor wrote: "no frame can arbitrate the visible cadence: the dense stills sample
> at 0.1 s (10 Hz) and cannot resolve 24 vs 15." THAT IS FALSE.** Both primary reference videos
> are **60 fps native** (`ffprobe`: `r_frame_rate=60/1`, 237,047 and 251,111 frames). The
> surveyor graded a cadence question off a pre-baked still set while the 60 fps source sat on
> disk — the same class of mistake as SESSION 18's A4-D. I extracted the source at 60 fps and
> **the frames arbitrate it twice over** (§NF-1, §NF-2).

---

## VERDICT TABLE

| # | claim | verdict | severity |
|---|---|---|---|
| 1 | audio-recovered-not-encrypted | **UPHELD** (reproduced from bytes) | — |
| 2 | music-13-stems-measured | **UPHELD** | — |
| 3 | adaptive-music-engine | **UPHELD** | — |
| 4 | sfx-playback-contract | **UPHELD** | — |
| 5 | font-identified | **UPHELD** | — |
| 6 | no-blend-modes | **UPHELD + HARDENED** | — |
| 7 | screen-shake-catalogued | **UPHELD** | — |
| 8 | no-hitstop | **UPHELD** (PARTIAL is the right grade) | — |
| 9 | gore-system-not-one-variant | **UPHELD** (no A1 corroboration exists) | — |
| 10 | blood-vfx-exact | **UPHELD** | — |
| 11 | 24fps-keyframe-stream | **UPHELD in substance; its stated ground is FALSE** | minor |
| 12 | 21-node-rig-held | **REFUTED** — the rig is not 21 nodes | minor |
| 13 | android-web-byte-identity | **UPHELD** (MD5 sweep reproduced) | — |
| 14 | blade-trail-frame | **REFUTED** — the wedge does not taper to a point | minor |
| 15 | aspect-ratio-frame-wins | **REFUTED** — 690 is the friend bar, not "container chrome" | **material** |
| 16 | kill-beat-timings | **UPHELD + FRAME-CONFIRMED** | — |
| 17 | hit-reaction-12-ticks | **REFUTED** — 12 is not uniform; 16/24/26/84 exist | **material** |
| 18 | web-audio-parity-unheld | **UPHELD + HARDENED** | — |

---

## WHAT I REPRODUCED (upheld claims)

**Audio (claims 1, 2, 4).** I re-implemented the transform from `reference/tools/payload_decode.py`
and ran it over `reference/extracted/android/`:

```
122_Mobile_SoundResource.bin  key=111 -> CWS v17 declared=29,631    inflated=29,623
113_Mobile_MusicResource.bin  key=117 -> CWS v17 declared=1,402,685 inflated=1,402,677
124_Mobile_ImageResource.bin  key=109 -> CWS v17 declared=1,908,237 inflated=1,908,229
115_Mobile_SHS3Resource.bin   key=104 -> CWS v17 declared=1,040,857 inflated=1,040,849
120_Mobile_BGResource.bin     key=103 -> CWS v17 declared=4,412,348 inflated=4,412,340
```

My own SWF tag parser then found exactly 13 `DefineSound` + one `SymbolClass` in each of the
two audio blobs, with the surveyor's name lists byte-for-byte. `afinfo` on the MP3s I extracted:
`slash1 0.572000` `slash2 0.780000` `slash3 0.520000` `punch 0.572000` `deflect 1.040000`
`die1 0.728 die2 0.884 die3 1.092` `hitmetal 0.780` `goodkoto 1.820` `fart 0.418` `sumo 3.120`
`refund 0.988`; six overworld stems **79.872000 sec** each, four dungeon stems **45.760000 sec**
each, `bgm_levelup 29.900000`, `bgm_lose 3.744000`, `bgm_gangnam 3.848000`. **Every number matched.**

Stronger than the claim: the six overworld stems are not merely equal in *duration*, their MP3
payloads are equal in *bytes* — **159,744 B / 882,144 samples** each; the four dungeon stems
**91,520 B / 504,288 samples** each. That is the layering grid, confirmed at the byte level.

**Font (claim 5).** `DefineFontName` tags I parsed myself:
`115_Mobile_SHS3Resource` id 12 `EPSON 太行書体Ｂ` © `(C) 2000 SEIKO EPSON CORP. All rights reserved.`,
id 61 `Adobe 고딕 Std B` © `Copyright © 2009-2011 Adobe Systems Incorporated.`,
id 161 `MS UI Gothic 標準` © `(C)2009 data:RICOH Co.,Ltd. typeface:RYOBI IMAGIX CO.`,
id 307 `Edo SZ` © `2008 Vic Fieger`; `124_Mobile_ImageResource` id 76 `Edo SZ` © `2008 Vic Fieger`.
Licence flag is correct and I endorse it.

**Shake / hitstop / gore / blood / kill-beat / behead (claims 7, 8, 9, 10, 16).** All quoted
lines verified verbatim in `reference/decompiled/shs3_android/scripts/`. `doShake()` really is
called *before* the `if(actionState != STATE_FROZEN)` gate (`StageManager.as:825-830`).
`STATE_FROZEN` really is assigned at exactly two sites (`:162`, `:212`). `StatsManager.censored`
really is `false` at `:314` and `clientVersion` really is `0.682` at `:30`.

**Byte identity (claim 13).** I re-ran the MD5 sweep: **21 blobs identical** overall, **14 of 18**
`MCSCharacter_*AnimationData` identical, differing exactly Ogre / Skills / Guardian / HumanSpear.
`99_MCSCharacter_HumanAnimationData.bin` == `108_1t4635s0.bin` == `bcfd658e79fafb41f52431afb7d10622`.

**Animation data (claim 11 substance).** `@d == len(<f>)` with **zero mismatches across all 487
`<anim>`** in the 19 web animdata blobs — I counted 487 independently. `AnimData.as` carries 30
`duration +=` tails. `updateAnimation()` compares `frameCounter` to `currentAnimationDuration`
while `updateFrame()` guards on `frameList.length` — the latch mechanism is exactly as described.

---

## REFUTATIONS

### R1 — claim 15 `aspect-ratio-frame-wins` — **MATERIAL**. The 690 is the FRIEND BAR.

The surveyor staged a doc-vs-frame conflict and declared "THE FRAME WINS … the 690-tall document
rect is container chrome, not play area." **There was never a conflict, and 690 is not chrome.**
`GameEngine.as` `resizeHandler`, which the surveyor cites but did not read to the end:

```
:269  var originalWidth:int = 800;
:270  var originalHeight:int = 480;
:271  var originalHeightWithBar:int = 690;
:272  var originalAspectRatio:Number = originalWidth / originalHeight;
:273  var originalWithBarAspectRatio:Number = originalWidth / originalHeightWithBar;
:275  if(newAspectRatio <= originalWithBarAspectRatio)
:277     originalAspectRatio = originalWithBarAspectRatio;
:278     originalHeight = originalHeightWithBar;
:279     StatsManager.stageShowingFriendBar = true;
:282     OverworldHUD.instance.friendpanel.init();
```

The extra 210 px is the **in-game friend panel**, a named second layout mode with its own state
flag. The videos show 5:3 because they were captured in **fullscreen**, where
`setFullScreen()` sets `fullScreenSourceRect = new Rectangle(0,0,800*newScale,480*newScale)`
(`GameEngine.as:190`) and drops the bar. Both numbers are true simultaneously; the code holds the
switch. Cross-lane: **ui-hud has a whole friend panel it does not know about.**

Two further errors in the same claim:
* The quoted letterbox formula is presented as unconditional. It is the **else** branch:
  `if(originalAspectRatio >= newAspectRatio)` fits **width** (`offsetX = 0`, `offsetY` centred);
  only the else fits height. A recreation copying the quoted line alone gets the wrong branch.
* **"aspect 1.6815 = 800×480" is loose.** 5:3 at 1080 height is **1800** px, not 1816. My own
  measurement of `Nr4fQstqHDM_432.0.png` reproduces cols 52…1867 (w 1816, aspect 1.68148) at
  thresholds 12/25/40 — but the *other* longplay gives a different number:
  `zFt_combat/zFtCaTO0_1M_t0320s.png` → cols 55…1861, **w 1807, aspect 1.67315**. Two captures
  disagree by 9 px. **1816 is a property of that upload, not of the game.** What the frames
  establish is "≈5:3, decisively not 800×690 (1.159)" — which is all that was needed.

### R2 — claim 17 `hit-reaction-12-ticks` — **MATERIAL**. 12 is not uniform, and 16 is original.

The claim: "a single uniform 12-tick window … set identically in **every** enemy class and in
`MCSPlayer`", used to declare the ledger's authored `7/12/16f` tint ladder "a recreation invention".
Exhaustive count of the assignment across `shs3_android/scripts/*.as`:

```
  23  gotHitCounter = 12
   3  gotHitCounter = 0
   2  gotHitCounter = 24
   1  gotHitCounter = 84
   1  gotHitCounter = 26
   1  gotHitCounter = 16
```

The non-12 sites, read in context:
* `EnemyShield.as:338` — an **enemy class** — sets `gotHitCounter = 24` when the blade hits
  `PART_prop` (the shield): `damage = 0; gotHitCounter = 24; SoundManager.instance.playHitMetal();`
  (and this is what the `hitmetal` SFX from claim 1 is *for*).
* `MCSPlayer.as:1457/1461` — `REDFREEZE_STATE`: `DOWNSTAB → 24`, player-controlled → **84**, else 12.
* `MCSPlayer.as:1764/1768` — post-skill recovery: `SKILL_THOUSANDSTABS → 26`,
  `SKILL_DEADLYCLEAVE → **16**`.
* `MCSPlayer.as:1959` — `gotHitCounter = -1` sentinel.

So **16 is in the original**, there is a 12/16/24/26/84 ladder, and "set identically in every
enemy class" is false at `EnemyShield.as:338`. The derived conclusion ("the original's one number
is 12") must not be shipped.

**And the claim's own CAUTION note is now resolvable, and it guessed wrong.** It says the HUD's
`150% DAMAGE` in `Nr4fQstqHDM_432.0.png` "reads as the stance modifier". It is not: the
stance-triangle bonus sits **eleven lines above the behead multiplier in the same function** —
`MCSPlayer.as:3701` `damage *= 1.2;` — so the stance modifier is **×1.2**, not ×1.5. The string
table (Stage-0b S0-3, `docs/gauntlet/L0/index/strings.json`) resolves the HUD line outright:
`4132 = "Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a
time."` and `125 = "Stance Restriction"`. The two stacked HUD lines are an active **BUFF_ATTACK**
buff (`StatsManager.as:290`) plus a stance-restriction debuff. Not un-reconciled any more.

### R3 — claim 12 `21-node-rig-held` — minor. The rig is not 21 nodes.

I opened the file the claim cites. `reference/extracted/bindata/118_1t4645s0.bin`, first pose:

```
<anim i="light_stance" d="1">
<f i="0">
<n i="19" .../> <n i="16" .../> <n i="15" .../> ... <n i="18" .../> <n i="3" .../>
```

**19 `<n>` elements**, index space 0…20 with **8 and 17 absent** (same in `light_run`, and in
every stance blob). Across all 19 web animdata blobs the distinct-index counts are 16…25 and the
max index runs 20…26 (`112_1t4639s0.bin` reaches 26). And the code declares **22** parts:
`MCSCharacter.as` `PART_l_hand = 0` … `PART_prop2 = 21`. There is no 21 on any reading.

Everything else in the claim holds: `FrameNodeData.as:60-70` really does apply `mc.x/mc.y/
mc.rotation`, with the `rotation != 999` sentinel selecting the `matA…matD / 100` matrix path;
and my independent count of `<anim>` across the 19 blobs is **exactly 487**.

### R4 — claim 14 `blade-trail-frame` — minor. The wedge ends BLUNT, not in a point.

I opened `reference/frames/duel_dense/Nr4fQstqHDM_432.0.png` (1920×1080) myself at three crops:
`(900,600)-(1300,900) ×3`, `(900,760)-(1220,880) ×4`, `(920,780)-(1160,900) ×6 Lanczos`.

Confirmed by eye at ×6: flat opaque blue wedge, hard black outline, a broad white stripe with a
second thinner white line parallel below it, mid-blue over a darker blue; navy haori with red
trim, cream obi, white hakama, straw kasa, bold flat-vector outlines; a bare-torso enemy doubled
over at his feet with a straw kasa on the ground beside him, **no blood and no severed limb**.

Confirmed numerically: the blue field is a near-constant `(0,112,191)` (second cluster
`(0,88,161)`) across a *varying* backdrop — that is opacity, and it is exactly what "no blendMode"
looks like. The claim's mechanism point stands.

**But "tapering to a point" is wrong in this frame.** Column-wise extent of the blue field:

```
x  945 h 20 | x  960 h 26 | x  975 h 32 | x  990 h 34 | x 1005 h 38 | x 1020 h 40
```

The wedge is **widest at the hands and narrows leftward, terminating at x≈940 on a blunt,
near-vertical flat edge ~20 px tall.** It never converges. (A *pointed* wedge does exist in the
corpus — the black silhouette in `session24/reach-A28-forest-duel/ev2_S3_wintint_hz031.png`
tapers to a point — so the shape varies across the 5-frame `bladeslashfx` clip and the surveyor
appears to have merged two frames.) Minor second slip: in this crop the wedge lies over the
mottled cliff/ground backdrop, not over grass.

Supporting A2 verified: `bladeslashfx.as` is `addFrameScript(4,this.frame5)` → `removeChild(this)`,
a 5-frame clip.

---

## NEW FINDINGS THE SURVEYOR MISSED

### NF-1 (A1, **overturns the surveyor's reasoning**) — the reference videos are 60 fps, and they DO resolve the cadence.

`ffprobe` on both primary references:
`Nr4fQstqHDM.mp4` — `width=1920 height=1080 r_frame_rate=60/1 nb_frames=237047 duration=3950.875`
`zFtCaTO0_1M.mp4` — `width=1920 height=1080 r_frame_rate=60/1 nb_frames=251111 duration=4185.258`

I extracted native-rate windows (`ffmpeg -fps_mode passthrough`, 180–240 frames each) and
autocorrelated the frame-to-frame mean-abs-difference over the game surface (cols 60…1860):

| window | mean diff | ac[3] | **ac[4]** | ac[5] | peak lag → rate |
|---|---:|---:|---:|---:|---|
| Nr4f t420–423 | 2.238 | −0.243 | **+0.810** | −0.245 | 4 → **15.00 Hz** |
| Nr4f t429–433 | 0.599 | −0.057 | **+0.800** | −0.059 | 4 → **15.00 Hz** |
| Nr4f t2800–2803 | 1.358 | −0.156 | **+0.577** | −0.154 | 4 → **15.00 Hz** |
| zFt t600–603 | 1.165 | −0.125 | **+0.842** | −0.117 | 4 → **15.00 Hz** |
| zFt t1200–1204 | 1.834 | −0.136 | **+0.864** | −0.128 | 4 → **15.00 Hz** |
| zFt t3000–3003 | 1.061 | −0.108 | **+0.718** | −0.108 | 4 → **15.00 Hz** |

Windows on near-static scenes (Nr4f t1200, t1990, t2500, t3400) show no periodicity at all
(|ac| < 0.04) — they do not contradict, they carry no signal. **`ac[5]` is negative in every
window**, so there is no 24-in-60 (2/3-frame) signature anywhere. The on-screen content in both
longplays updates at exactly **15.0 Hz**.

### NF-2 (A1, **frame-CONFIRMS claims 11 and 16**) — the kill-beat measures 6.000 s, so the sim tick is 24 Hz and the 15 Hz is the CAPTURE.

I located the end-of-battle red freezes in `Nr4fQstqHDM.mp4` by scanning at 4 Hz, then measured
each at native 60 fps (red-fraction > 0.65 of a 64×36 downscale):

```
t = 516.683 .. 522.667   duration 6.000 s  (360 frames @60)
t = 587.683 .. 593.667   duration 6.000 s  (360 frames @60)
t = 697.550 .. 703.600   duration 6.067 s  (364 frames @60)
t = 864.417 .. 871.067   duration 6.667 s  (400 frames @60)
```

`StageManager.as:1101` sets `redFreezeCounter = 24 * 6` = 144 ticks. **144 ticks in 6.00 ± 0.07 s
⇒ tick rate 24.0 ± 0.3 Hz.** A 15 Hz sim would take 9.6 s. So:

* claim 16's `24*6` is **confirmed by frame**, to the frame, twice independently — and the
  measured 6.0 s (rather than the code's normal 5.0 s exit at `counter == 24`) proves the
  `SHEATHESWORDCHIBURI` branch at `StageManager.as:916` is the **common** case, not the exception.
* claim 11's 24 Hz clock is **confirmed by frame**, so its PARTIAL grade is under-confident and
  can be raised to HELD — but on evidence the surveyor said did not exist.
* the 15.0 Hz of NF-1 is therefore the **capture rate of both uploads**, not the game's. This
  matters more than it sounds: **every animation cadence ever measured off these two videos was
  sampled at 15 Hz against a 24 Hz source and is under-resolved by 37%.** The ledger's "15fps
  pose latch" is a correct description of the *video* and a wrong description of the *game*.

### NF-3 (A1) — what the kill beat LOOKS like was never opened.

`reference/frames/session24/reach-A28-forest-duel/ev2_S3_wintint_hz031.png` (1100×630, viewed
whole at ×0.87): a **flat saturated red field** with **every actor rendered as a pure black
silhouette** — fighters, kasa, blade wedge, grass line, all solid black, no interior detail.
That is `ColorCode.blackColorTransform = new ColorTransform(0,0,0,1,0,0,0,0)` (`ColorCode.as:12`)
applied stage-wide, i.e. **claim 6's compositing vocabulary caught in the act, from the frame
side.** The surveyor gave the kill-beat as timings only and never looked at it.

### NF-4 (A2, hardens claim 6) — the AS3 grep could not see timeline blend modes. I checked them; they are all off.

An ActionScript grep cannot see a blend mode set in the Flash IDE — that lives in the
`PlaceObject3` / `DefineButton2` tag flags. I checked the shipped **web** client:

```
$ grep -a -o -E "[a-zA-Z]*blendMode=\"[^\"]*\"" reference/extracted/payload.xml | sort | uniq -c
 194 buttonHasBlendMode="false"
 304 placeFlagHasBlendMode="false"
```

**498 of 498 false, zero true.** And in the three decoded Android resource SWFs I parsed
`PlaceObject3` flags directly: `115_Mobile_SHS3Resource` 0, `124_Mobile_ImageResource` 0,
`120_Mobile_BGResource` 0 tags with `HasBlendMode`. Claim 6's answer ("none — normal alpha only")
now holds for authored timeline content too, not just code.

### NF-5 (A3, hardens claim 18) — the web client ships NO audio tags of any kind.

Beyond the 27 bindata blobs (I checked every magic: 19 UTF-8-BOM XML, `92_1t4648s0.bin` = GIF89a,
5 name tables, 2 plain XML — zero `FWS`/`CWS`/`ZWS`), the **entire 329 MB ffdec export** of the
web client contains no sound tag at all: `grep -o -E 'type="[A-Za-z0-9]*(Sound|Audio|MP3)[A-Za-z0-9]*"'
reference/extracted/payload.xml` → **no matches**. The STILL_UNHELD is correct and now airtight.

### NF-6 (A3, cite correction) — `reference/preservation/shs3.swf` is the loader, not the client.

Claim 11 cites it as "the real web client". It is 164 KB with **frameCount 2** and is byte-adjacent
to `shs3preloader.swf` (164,533 B); both parse to `CWS v10, rect 16000×13800 twips = 800×690,
framerate 24.0`. The **actual client** is `shs3_payload.swf` (6.88 MB), and its ffdec export header
independently says `frameRate="24.0" frameCount="6"` with `displayRect Xmax="16000" Ymax="13800"`.
Substance unaffected — both agree on 24.0 and 800×690 — but the better cite is
`reference/extracted/payload.xml` line 1 `<swf … frameRate="24.0" version="17">`.

### NF-7 (open, A1 gap) — the gore system has NO frame corroboration in the 7,381-frame set.

I scanned all 7,364 readable frames under `reference/frames/` for saturated-red blobs. Every
high-red hit resolved to a **full-screen red freeze**, not a localised blood spray. Claim 9's
40/20/20/20 split, the `deathnohead`/`deathinhalf` variants and the `pttl=24` droplets are held
from bytes only; **no frame in the corpus has been shown to display them.** Not a refutation —
the payload cite is solid — but the visual half of blocker ⑤ is still unopened, and the 15 Hz
capture rate (NF-2) means a `pttl=24` (1.0 s) spray is only ~15 sampled frames wide.

---

## SCORE OPINION

The **84** is defensible on the audio/font/FX/shake/gore/kill-beat wins, which I reproduced.
But two rebuild-facing numbers in it are wrong (`21-node rig`; `uniform 12-tick reaction`), one
cross-lane structure was mislabelled as chrome (the **friend panel**), and the unit's own headline
methodological claim ("no frame can arbitrate") is false against a 60 fps source that was on disk
the whole time. **I would hold at 78–80 until R1–R4 are corrected in the journal**, then 84+ —
NF-1/NF-2 genuinely *raise* claim 11 from PARTIAL to frame-confirmed, which is worth more than
the deductions.

**Standing invariant, stated out loud as required:** in NF-1/NF-2 the payload (24 fps SWF header)
and the frames (15 Hz visible content) appear to disagree. **I looked, and the frames win — and
what they show, once measured properly, is that both are true**: the sim ticks at 24.0 Hz
(6.000 s red freeze = 144 ticks) and the videos were recorded at 15 fps. The disagreement was
never real; it was the surveyor's refusal to open the video that made it look real.
