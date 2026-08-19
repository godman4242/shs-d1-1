# art-anim-audio-feel — LENS 4 (FRAME) blind critic

Reviewer opened every artifact listed below first-hand. Nothing here is taken from the
surveyor's word. Commands and pixel values are pasted so any of it can be re-run.

---

## Headline

**14 of 18 claims survive. 4 are refuted — and 2 of those are the unit's two A1 (frame)
claims.** That is the signature of the exact failure this lens exists to catch: the audio
and code work in this survey is excellent and reproduces byte-for-byte, but where the
surveyor reached for a *frame*, they graded the wrong object and asserted an equality the
pixels deny.

| verdict | claims |
|---|---|
| HELD (re-derived independently) | audio-recovered · music-13-stems · adaptive-music-engine · sfx-playback-contract · font-identified · no-blend-modes · screen-shake · no-hitstop · gore-system · blood-vfx · android-web-byte-identity · kill-beat · hit-reaction · web-audio-parity-unheld |
| **REFUTED — fatal** | `24fps-keyframe-stream` |
| **REFUTED — material** | `21-node-rig-held` · `blade-trail-frame` (A1) · `aspect-ratio-frame-wins` (A1) |

---

## R1 — FATAL. `24fps-keyframe-stream`: the data DOES hold frames, in 96 of 385 animations

The claim: *"the XML's @d equals the number of `<f>` children for every animation, so the
data holds no hold frames; the 'latch' is injected in code by AnimData's per-animation
duration tails."*

I measured `@d` against `len(<f>)` across all 19 web-payload animdata blobs myself:

```
animdata files 19   total anims 385 (parseable)   mismatched d vs len(f): 96
```

The mismatches are not in some obscure creature blob. They are in **both files the
surveyor names as their evidence**:

| file | anims | @d > len(f) | example |
|---|---|---|---|
| `reference/extracted/bindata/108_1t4635s0.bin` (Human) | 120 | **23** | `heavyhorizontalslash_parta` d=6, 4 `<f>` |
| `reference/extracted/bindata/118_1t4645s0.bin` (LightStance) | 17 | **6** | `light_horslash_parta` d=13, 11 `<f>`; `light_horslash_partc` d=6, 4 `<f>` |
| `116_1t4643s0.bin` (HeavyStance) | 17 | 8 | `heavy_horslash_parta` d=5, **2** `<f>` — 60 % of that animation is a held pose |
| `102_1t4629s0.bin` (Skills) | 50 | 16 | `fireball` d=12, 8 `<f>` |

The surveyor quoted four clean rows — `light_stance 1/1`, `light_run 9/9`, `walk 20/20`,
`death 38/38` — and generalised "hold=0 everywhere". Idle, locomotion and death happen to
be clean. **Every horizontal/down/up slash is not.** In a sword game that is the motion
that matters.

The engine confirms the semantics, and it is the opposite of what the claim says:

- `reference/decompiled/shs3_android/scripts/AnimData.as:16-21`
  `this.duration = xml.@d;` … `var max:int = xml.f.length(); for(...) frameList.push(new FrameData(xml.f[i]));`
  → `duration` and `frameList.length` are **independent**.
- `MCSCharacter.as` `updateAnimation()`: `++this.frameCounter; if(this.frameCounter < this.currentAnimationDuration) this.updateFrame();`
- `MCSCharacter.as` `updateFrame()`: `if(this.frameCounter < this.currentAnimation.frameList.length) { ...setPosition(this); }`

So for every tick in `[len(frameList), duration)` the counter advances and **no new pose is
applied — the rig latches on the last keyframe**. That is a hold, authored in the data.
The `duration += 10 / 15 / 24` tails in `AnimData.as:23-142` are a *second*, additional
hold stacked on top — not the origin of the latch.

Correct model: **24 Hz playback; the keyframe stream is sparse; `@d − len(<f>)` held ticks
are authored per-animation in the XML; code tails extend selected poses further.**
A recreation built on the surveyor's model plays `heavy_horslash_parta` in 2 ticks instead
of 5 — 2.5× too fast.

The 24 Hz half of the claim is right and I verified it independently: my own parse of
`reference/preservation/shs3.swf` gives `rect twips [0,16000,0,13800] framerate 24.0`, and
`Mobile.as:117 GameEngine.getStageMC().frameRate = 24;`.

---

## R2 — MATERIAL. `21-node-rig-held`: the rig is 27 parts, and 25 node ids are keyed

The structural half is correct — I verified `FrameNodeData` applies `x`/`y`/`rotation`
straight onto MovieClip transforms, else a 2×2 matrix ÷100 — and the **487 anim count is
correct** (I counted 487 `<anim ` tags across the 19 blobs).

"21-node" is not. `reference/decompiled/shs3_android/scripts/MCSCharacter.as:10-62` declares
**27** parts, `PART_l_hand:int = 0` … `PART_r_knee:* = 26`. Across the 19 animdata blobs the
keyed node ids are `[0..7, 9..16, 18..26]` — **25 distinct ids** (8 = `crotch` and
17 = `hat` are never keyed; they ride their parent). Per-blob maxima:

```
112_1t4639s0.bin (Wolf)      maxid 26  ids>20: [21,22,23,24,25,26]
114_1t4641s0.bin (Goblin?)   maxid 24  ids>20: [21,22,23,24]
108_1t4635s0.bin (Human)     maxid 21  ids>20: [21]
110_1t4637s0.bin (DualStance) maxid 21 ids>20: [21]
all others                   maxid 20
```

21 is what you get by counting `0..20` off one humanoid idle pose. A rig built to 21 nodes
silently drops `prop2`, `prop3`, `l_shoulder`, `r_shoulder`, `l_knee`, `r_knee` — the
shoulder and knee nodes are exactly what makes limb bending read right, and the Human blob
already keys id 21.

---

## R3 — MATERIAL (A1). `blade-trail-frame`: the object graded is not a blade trail

I opened the cited frame `reference/frames/duel_dense/Nr4fQstqHDM_432.0.png` (1920×1080) and
reproduced the cited crop (900,600)–(1300,900) upscaled ×3 Lanczos. Then I tracked the blue
object across **all 42 frames** of `duel_dense` (427.0 → 433.0, 0.1 s spacing), masking
`b>150 & b−r>110 & b−g>50 & g>60` and excluding the HUD (`y<960, x>400`):

```
427.0  1140 px    428.9  1939 px    431.4  2915 px    432.4  1962 px
427.4  3070 px    429.0  1938 px    431.9  1859 px    432.9  1395 px
428.2  2737 px    431.0  2863 px    432.0  1960 px    433.0  1392 px
        ... present in 42 of 42 frames, 6.0 s of footage ...
```

A blue mass of 1,392–3,134 px sits in the play area in **every single frame**, always
anchored at the fighter's hands, rotating with him (vertical at 427.1, horizontal-right at
428.9, horizontal-left at 431.2), with the same internal white chevron artwork each time.

That cannot be the slash FX. The surveyor's own supporting A2 says
`bladeslashfx.as:12 addFrameScript(4,this.frame5)` — a 5-frame clip that removes itself,
~0.21 s at 24 Hz. **0.21 s cannot occupy 42 consecutive 0.1 s samples.** The object is the
fighter's equipped blade. (The transient slash mark in this footage is *red* — see the
thick red stroke crossing frame 427.1.)

Two descriptors are also measurably inverted. Vertical scan at x=1000 on the cited frame:

```
y 796-808  (0,76,140) → (0,87,160)      upper band  — DARKER
y 814      (231,226,223)                white stripe
y 820-829  (0,106,185) → (0,116,183)    lower band  — BRIGHTER
y 835      (188,205,222)                white stripe
```

Reproduced at x=950 and x=1040. The claim says "mid-blue body over a **darker** blue lower
half" — it is the other way round. And the left terminus is a **blunt flat edge**, not a
point (crop (880,750)–(1120,880) ×6).

**What does hold:** opacity. Horizontal scan at y=832 puts the object's left outline at
x≈932 with dark grass `(38,41,33)` immediately outside and saturated `(0,110,190)`
immediately inside — zero background bleed. No additive/screen lightening. So the
*observation* survives; the *identification* does not, and the "no blendMode corroborated
from the frame side" line is therefore unsupported: an opaque weapon sprite says nothing
about how FX composite.

---

## R4 — MATERIAL (A1). `aspect-ratio-frame-wins`: the arithmetic fails, 690 is not chrome, and nothing was arbitrated

**(a) 1.6815 ≠ 1.6667.** I re-ran the threshold sweep on the same frame and got the
surveyor's numbers exactly:

```
thr  5  cols 48 1871  w 1824  aspect 1.68889
thr 12  cols 52 1868  w 1817  aspect 1.68241
thr 25  cols 52 1867  w 1816  aspect 1.68148
thr 40  cols 52 1867  w 1816  aspect 1.68148
thr 60  cols 52 1867  w 1816  aspect 1.68148
800/480 = 1.66667   →  a true 5:3 surface at 1080 tall is 1800 px wide, not 1816
```

The measurement is honest and reproducible; the claim built on it is not. 1816 vs 1800 is
16 px of letterbox bleed — the frame is *consistent with* 5:3 to ~0.9 %, it does not
*equal* it. Writing "aspect 1.6815 = 800x480" asserts an equality the numbers deny.

**(b) "the 690-tall rect is container chrome, not play area" is wrong.**
`reference/decompiled/shs3_android/scripts/GameEngine.as:269-312`:

```as3
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
...
StatsManager.stageBaseHeight = originalHeight;
```

690 is the game's **own friend-bar layout mode**. When the window is at or below 800:690
the client switches its base height to 690 and initialises `OverworldHUD.friendpanel` into
the extra 210 px. That is client-drawn UI, not browser chrome. (Cross-lane: this is a
meta-social / ui-hud fact nobody holds.)

**(c) There was no conflict to arbitrate.** The video is a fullscreen capture, and
`GameEngine.as:190` hard-codes `stageMC.fullScreenSourceRect = new Rectangle(0,0,800*newScale,480*newScale)`.
A fullscreen frame reading ~5:3 is the code doing exactly what the code says. Invoking
"THE FRAME WINS" here is theatre — the frame *confirms* the payload. My own parse of the
SWF header (`CWS v10, rect twips [0,16000,0,13800] = 800×690, framerate 24.0, framecount 2`)
is the **loader/preloader** stage, which is why it carries the with-bar height.

The re-basing advice ("HUD fractions taken off 16:9 video must be re-based on 800×480") is
still right, and `StageManager.as:159` independently corroborates the 480 play height:
`battleIntroBar.y = (480 - 80) / 2 * StatsManager.stageScale + ...`.

---

## What I re-derived and confirms (own artifacts, not the surveyor's word)

**Audio — the strongest work in the survey, and it reproduces exactly.**
I wrote my own decoder (scratchpad, no repo writes) implementing the `payload_decode.py`
transform and ran it over the five CWS blobs:

```
122_Mobile_SoundResource.bin  key 111  CWS v17  declared 29,631     inflated 29,623
113_Mobile_MusicResource.bin  key 117  CWS v17  declared 1,402,685  inflated 1,402,677
115_Mobile_SHS3Resource.bin   key 104  CWS v17  declared 1,040,857  inflated 1,040,849
124_Mobile_ImageResource.bin  key 109  CWS v17  declared 1,908,237  inflated 1,908,229
120_Mobile_BGResource.bin     key 103  (brute-forced)  CWS v17      inflated 4,412,340
```

Stage-0 finding **S0-5 is dead** — all five are recovered, not merely held-but-encrypted.
Tag parse of `122`: 13 × `DefineSound`, all `MP3 / 11025 Hz / 16-bit / mono`; `SymbolClass`
= `[(13,'punch'),(12,'fart'),(11,'hitmetal'),(10,'goodkoto'),(9,'slash1'),(8,'slash2'),(7,'die1'),(6,'refund'),(5,'die3'),(4,'slash3'),(3,'sumo'),(2,'die2'),(1,'deflect')]` — verbatim as claimed.
I carved `slash1` myself and ran the system decoder: `afinfo` → `1 ch, 11025 Hz, .mp3 …
576 frames/packet`, `estimated duration: 0.572000 sec`. Matches the surveyor's quote.

`113`: 13 × `DefineSound`; the six safe/battle stems are **882,144 samples / 159,753 bytes
each**, the four dungeon stems **504,288 samples / 91,529 bytes each** — bit-identical, so
the phase-lock mechanism is real.

**Correction to carry (new):** the SWF `DefineSound` sample count, not `afinfo`, is what
Flash plays. `slash1` is **3,809 samples @ 11025 Hz = 0.345 s**, while `afinfo` estimates
0.572 s from the raw MP3 stream. Timing an SFX to 0.572 s would be 66 % too long. Likewise
the stems are `882144/11025 = 80.013 s` and `504288/11025 = 45.741 s`, not the quoted
79.872 / 45.760. And labelling `battlechants`/`battledrums` as "overworld" stems fights the
engine's own preset table, which routes them to battle presets.

**Music engine** — `MusicManager.as:301` `sndTransform.volume -= 0.05;` · `:329` `+= 0.05;` ·
`:206` `playPosition = int(this.scArray[this.TRACK_FLUTES].position);` · presets are boolean
masks; `MusicManager.instance.update()` is driven from `GameEngine.as:923` inside the
per-frame update. Verified. Count nit: there are **18** `presetsArray[MUSIC_*]` entries
(17 non-empty plus `MUSIC_NONE`), and the constants are non-contiguous — ids 10 and 13 do
not exist.

**SFX contract** — `SoundManager.as` `playSlash`/`playDie` both `var dice:int = Math.random() * 3;`,
`playHit` and `playHurt` are byte-identical bodies both fetching `"punch"`, every call a bare
`sound.play()`. Verified verbatim.

**Fonts** — parsed `DefineFontName` (tag 88) myself:
`115` → id 12 `EPSON 太行書体Ｂ` "(C) 2000 SEIKO EPSON CORP.", id 61 `Adobe 고딕 Std B`,
id 161 `MS UI Gothic 標準`, id 307 `Edo SZ` "2008 Vic Fieger";
`124` → id 76 `Edo SZ` "2008 Vic Fieger" (27,878-byte `DefineFont3` — the full program).
Verified. The third-party licence flag on Edo SZ is correct and should stay attached.

**No blend modes — and I can make it stronger.** The grep result is right (sole hit
`mx/core/IFlexDisplayObject.as:87-89`). But code is only half the surface: SWF authoring
can set a blend on the `PlaceObject3` tag. I parsed every decoded container —
`shs3_payload_decoded.swf` (4,051 tags), `shs3_android_payload_decoded.swf` (3,311),
`115` (3,756), `124` (330), `113`, `122`, `shs3.swf`, `shs3preloader.swf` —
and found **zero `PlaceObject3` tags anywhere**, therefore zero authored blend modes.
The negative is now complete on both the code and the art side. (Nit: the claim says "all
559 client classes"; `shs3_android/scripts/*.as` is 553 files at top level, 956 including
`mx/`.)

**Screen-shake, hitstop, kill-beat, hit-reaction, gore, blood, MD5 parity** — all read
first-hand and all match:
`StageManager.as` `startShake(shakeDuration, shakeAmt:int = 30)`, `shakeAmount = Math.min(screenShakeAmt,screenShakeCounter)`,
snap-back at counter 0, and `doShake()` called *before* the `if(actionState != STATE_FROZEN)` gate;
`STATE_FROZEN` assigned at exactly two sites (`:162`, `:212`), both one line after
`battleIntroBar.init(action);`; zero grep hits for `hitstop|hitpause|freezeframe|slowmo|timeScale|hitFreeze`;
`redFreezeCounter = 24 * 6` with `showWin()` at `== 24*5` and `showLose()` at `== 24*3`;
`MCSPlayer` behead on `PART_hat`/`PART_head`/`PART_neck`, `damage *= 1.5`, `gotHitCounter = 12`;
`EnemyGoblin.as` `dice = Math.random() * 5` → `<=1 / ==2 / ==3 / ==4` = **40/20/20/20**;
`StatsManager.as:314 public static var censored:Boolean = false;`;
`BloodParticleEmitter.as:18-26 pnumber=20 … panglevariance=10 pvel=6 pvelvariance=2 pgravity=0.6 pttl=24`;
death rows in `108_1t4635s0.bin`: `death 38 · deathenemy 23 · deathnohand 25 · deathnohead 31 ·
deathwitharrow 23 · deathbyarrow 21 · deathdowned 7 · deathinhalf 28` (eight, as claimed);
MD5 pairing = **21 identical blobs, 14 of 18 AnimationData identical**, differing set
exactly `{Ogre, Skills, Guardian, HumanSpear}`, and
`bcfd658e79fafb41f52431afb7d10622` on both `99_MCSCharacter_HumanAnimationData.bin` and
`108_1t4635s0.bin`.

**The STILL_UNHELD is honest.** I brute-forced all 256 keys against all 27 web bindata
files: zero FWS/CWS/ZWS signatures. The web payload really does not carry its audio.
`clientVersion 0.682` confirmed at `StatsManager.as:30`.

---

## Frame-side additions the surveyor did not make

**F1 — the post-kill freeze is visible in the footage.** Mean |Δ| between consecutive
`duel_dense` frames (grey, play area, 0.1 s spacing) runs 0.4–4.6 during action, then
collapses:

```
432.1  0.46   432.2  0.02   432.3  0.08   432.4  0.02   432.5  0.01   432.6  0.01   432.7  0.50
```

A ≥0.5 s near-total freeze immediately after the kill. Far too long for hitstop, and it
follows a kill — so it reads as the `redFreeze` kill-beat. This is frame-side support for
the `no-hitstop` negative, which the surveyor graded PARTIAL on grep alone.

**F2 — blood is visibly a discrete particle spray, and it decays on roughly the coded
clock.** Connected-component count of strong-red blobs in the 428.x kill burst
(crop (600,680)–(860,860)):

```
428.1  32 blobs   428.2  25   428.3  15   428.4  15
```

and total strong-red pixels over the whole play area rise 1,999 → 9,717 and fall back to
~4,100 across 427.4 → 428.4, i.e. an event ~1.0 s long. Consistent with `pnumber = 20`
(two emitters on some death variants) and `pttl = 24` ticks at 24 Hz. Corroboration, not
a measurement — video compression merges and splits droplets.

**F3 — the fighter reads as clothed and bold-outlined, confirming the style bullet by eye.**
Crop (900,600)–(1300,900) ×3: straw kasa, navy haori with a red trim stripe, cream obi with
a wave pattern over an orange band, white hakama, all flat fills behind a heavy black
outline. No gradients, no soft shadows on the character.

---

## Score

The surveyor proposed 56 → 84. On my reading the audio/font/FX/shake/gore work fully earns
its keep, but the **animation model is wrong in its central assertion** and both A1 claims
fail. Motion is the unit's headline "Ready" slice; shipping a 21-node rig with no
data-authored holds would look wrong in exactly the frames a 1:1 recreation is judged on.
**76** is the defensible number until the hold-frame table is rebuilt and re-cited.
