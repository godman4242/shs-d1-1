# GAUNTLET L0 — CRITIC (LENS 3: PRECEDENCE) — unit `art-anim-audio-feel`

Reviewer: blind precedence critic · date 2026-08-17 · target: surveyor output for
`docs/gauntlet/L0/systems/art-anim-audio-feel.md` (proposed 56 → 84).

I did not see the surveyor's reasoning. Every verdict below cites an artifact **I**
opened. Where I re-derived a surveyor number I say so; where I could not reproduce it
I say that too.

---

## HEADLINE

**The audio half of this survey is real and it survives everything I threw at it.** I
brute-forced the keys myself without looking at the surveyor's table and landed on
111 / 117 / 104 / 109 / 103, pulled 26 `DefineSound` tags with their `SymbolClass`
names, wrote MP3s and confirmed them with an independent decoder. Stage-0 S0-5 is
genuinely overturned. Font, screen-shake, blood constants, the MD5 parity table and
the A1 blade-trail frame all reproduced exactly.

**Four claims do not survive, and one of them is fatal.**

> ⛔ **`no-hitstop` is REFUTED AT THE PIXELS.** The claim is "there is no hitstop on a
> landed hit anywhere in the client", from an exhaustive grep of the Android build.
> `docs/research/fidelity/COMBAT_MEASUREMENTS.md:944` (§S24-F) already recorded the
> opposite — *"Global hit-stop: when the A28 player took a hit, the ENTIRE world froze
> 3 content ticks (~200 ms) under a red edge vignette"* — and §S24-H's 2026-08-12
> verify pass, which voided several neighbouring rows, **did not touch that one**. The
> surveyor never cites or reconciles it. I went to the frames and reproduced it:
> `reference/frames/session24/reach-A28-forest-duel/burst_0059…0065.png` (15 fps
> extraction, per COMBAT_MEASUREMENTS.md:765). Mean frame-to-frame |Δ| runs 19–45
> through the fight, then at `burst_0061` a full-screen red wash lands, the player's HP
> ticks 20/20 → 19/20, and **`burst_0062` and `burst_0063` hold the world**: |Δ| 1.25
> and 1.02, only 3.3 % / 2.8 % of pixels moving more than 8 levels — background trees,
> the other three fighters, the HP bars, all held. `burst_0064` releases and 88 % of
> pixels change at once. Three frames at the 15 fps floor = **~200 ms**, exactly the
> ledger's number.
>
> **THE FRAME WINS over the decompiled code, and I am saying so out loud.** A grep of
> the Android v0.682 client is a document; the longplay is the artifact. Whatever the
> mechanism (a v0.717/v0.682 divergence, or an FX class the grep vocabulary missed),
> the beat is on screen. The survey's instruction — *"any hitstop in the recreation is
> an authored deviation and must be labelled"* — would delete a measured feature.

---

## VERDICTS

### R1 · `no-hitstop` — **REFUTED (fatal)**
See headline. My cite: `reference/frames/session24/reach-A28-forest-duel/burst_0061.png`
→ `burst_0063.png`, whole-frame diff, plus `COMBAT_MEASUREMENTS.md:944`.
The surveyor's supporting code reading is itself sound — I checked that
`STATE_FROZEN` really is set at exactly two sites (`StageManager.as:162`, `:212`) and
that the only public setter `setActionState` (`:1015`) is called once, with
`STATE_BATTLE` (`BattleUI.as:915`). That makes the negative airtight *for the Android
build* and worthless against a frame.

### R2 · `no-blend-modes` — **REFUTED IN HALF (material)**
The blend-mode half is TRUE and I strengthened it. But the surveyor used the wrong
instrument: in Flash, blend modes are authored into `PlaceObject3` tags, not
ActionScript, so a `grep blendMode` over `.as` could never have found one. I parsed
the SWF tag stream instead, recursing into `DefineSprite`:

* `reference/decrypted/shs3_payload_decoded.swf` (the real web v0.717 payload):
  827 sprites, 7,196 `PlaceObject2`, **304 `PlaceObject3`, ZERO with the
  `PlaceFlagHasBlendMode` bit.** Same for the Android payload (248 / 0).
  ⇒ "no blend modes" is now a byte-check, not a code inference.

**But the second half of the claim is wrong.** "The entire compositing vocabulary is
one class using ColorTransform, BlurFilter and a luma ColorMatrixFilter" — the same
scan finds **262 authored filter placements in the web payload: 205 `GlowFilter`,
57 `BlurFilter`, 2 `DropShadowFilter`**, across 71 sprites, one of which resolves
through `SymbolClass` to `shs3_fla.InteractUI_chikako_portrait_610`. `ColorCode.as`
contains no glow. A recreation built to "ColorCode.as is the whole vocabulary" will
ship 205 missing glows.

### R3 · `kill-beat-timings` — **REFUTED (material)**
The claim: *"on victory the action freezes for 24\*6 ticks (6.0 s)"*. `StageManager.as`
disagrees with itself in the surveyor's own quote. Setup is `redFreezeCounter = 24*6`
(:1101), but the terminator at :916 fires at **`redFreezeCounter == 24`**, not 0 —
`redFreezeCounter = -2; … GameEngine.endBattleMode(true)`. So the normal victory beat
is 144 − 24 = **120 ticks = 5.0 s**; 6.0 s happens only in the branch where the player
is still playing `SHEATHESWORDCHIBURI`.

And the frame agrees with 5.0, not 6.0: §S24-F's measured kill-cam is *"red screen
total ~74 ticks (~4.9 s)"* at the 15 fps floor. **The measurement and the code agree
once the code is read correctly; only the claim is out.**

Second error in the same claim: the actor freeze is *released* at 24\*5 by
`unRedFreeze()` — the same tick `showWin()` fires. `MCSActor.redFreeze()` is
`ColorCode.makeBlack(mcs); animFrozen = true`, and `unRedFreeze()` is
`animFrozen = false`. So the black-silhouette hold is **1.0 s**, not 6.0; the remaining
4.0 s is input-disabled result screen. A recreation holding the silhouette for six
seconds is 6× wrong.

### R4 · `gore-system-not-one-variant` — **REFUTED IN ITS NUMBER (material)**
The system is real — I verified the anim rows in `reference/extracted/bindata/108_1t4635s0.bin`
(`death` d=38, `deathnohand` 25, `deathnohead` 31, `deathinhalf` 28, all with
`d == len(<f>)`), the 50 % mirror, and `StatsManager.as:314 censored = false`.

The **distribution is not global.** The cite says the rule is "mirrored in every
Enemy\* class". It is not: only 8 of the 35 `Enemy*.as` files contain
`Math.random() * 5` at all.

| class | roll | branches |
|---|---|---|
| `EnemyGoblin.as:386` | `* 5` | 40/20/20/20 (what the claim reports) |
| **`NPC.as` (the human enemy)** | **`* 7`** | ENEMYDEATH ×2 · DEATH_FORWARD · **DEFEATED2** · NOHAND · DEATHINHALF · else ENEMYDEATH |
| `EnemyZombie.as` | `* 6` | ENEMYDEATH ×2 · DEATH_FORWARD · NOHAND · … |
| `EnemyClone.as:747` | none | smoke puff + `mcs.visible = false`, no gore at all |
| `EnemyOgre.as:351` | none | single `OGRE_DEATH` |

For *Straw Hat Samurai: **Duels***, the class that matters is the human, and its split
is 7-way with a non-gore `DEFEATED2` branch the claim does not mention. Report the
distribution per class, never as one number.

### R5 · `24fps-keyframe-stream` — **REFUTED IN ITS MODEL, AND STALE (material)**

**(a) "the data holds no hold frames" is false.** The `@d == len(<f>)` half is
CONFIRMED — I re-derived it across all 19 animdata blobs: 487 `<anim>`, **0
mismatches**. But the inference does not follow. Of 5,596 `<f>` elements, **896
(16.0 %) contain zero `<n>` children** — authored holds. `ogre_walk` and `zom_idle`
alternate pose/empty on every other frame, i.e. 12 Hz content inside a 24 Hz stream;
`zom_getup` is 49 empty of 95. Even the human blob `108_1t4635s0.bin` is 183 empty of
1,638 (11.2 %). The fighter's own core clips (`walk`, `run`, `death`, the death
variants, `light_stance`, `light_run`) are indeed empty-free, so the claim is right
*where the surveyor looked* and wrong as stated.

**(b) precedence — this correction is eleven weeks old and better cited elsewhere.**
`docs/research/IMPROVEMENTS_RESEARCH.md:998` is a verifier correction that already
ruled: *"The OG's document frame rate is 24 fps, not 15.
`reference/extracted/payload.xml`'s own SWF header reads `frameRate="24.0"` — a
decompiler-extracted primary source that outranks any video inference"*, and
`COMBAT_MEASUREMENTS.md` §S24-H (2026-08-12) had already declared *"The 60 fps
'4-frame content block' defence is VOID."* So REBUILD_READINESS's "15fps pose latch"
was **already dead before this survey opened**, and the strongest cite is a WEB-build
artifact. The surveyor instead cites `Mobile.as:117` — which is inside
`handleMobileActivate` and only runs `frameRate = 24` when `frameRate == 0`, i.e. an
Android resume-from-background handler. (The `shs3.swf` header cite is fine: I decoded
it, 800×690 twips, **framerate 24.0**, 2 frames.)

### R6 · `aspect-ratio-frame-wins` — **REFUTED (material)**
Three problems, in ascending order of seriousness.

1. **The arithmetic.** 1816/1080 = 1.6815. 800/480 = 1.6667. They are not equal; a
   true 5:3 surface at 1080 px tall is **1800** px wide, not 1816.
2. **The frame does not measure to that precision.** I reproduced the surveyor's box
   exactly (`Nr4fQstqHDM_432.0.png`, thr 25–60 → cols 52…1867, 1816×1080). Then I
   measured the *other* longplay: `zFtCaTO0_1M_t0320s.png` → cols 55…1861,
   **1807×1080 = 1.6731**. The content box drifts ~1 % between uploads. It rules out
   800×690 (1.159) decisively; it does not certify 800×480.
3. **The load-bearing mis-cite.** `find reference/decompiled -name GameEngine.as`
   returns **only** `shs3_android/` and `shs3_android_payload/` — there is no
   `GameEngine.as` in `shs3_payload/`, and none of `StageManager`, `MCSPlayer`,
   `SoundManager`, `MusicManager`, `ColorCode`, `AnimData`, `MCSCharacter`,
   `BloodParticleEmitter` exist there either. So `originalWidth = 800 / originalHeight
   = 480` is an **Android/Mobile constant**. Meanwhile the surveyor waved away the
   690-tall rect as "container chrome" while citing only the 164 KB, 2-frame loader
   `shs3.swf` — and never opened the web game itself. I did:
   **`reference/decrypted/shs3_payload_decoded.swf` — CWS v17, 6,880,328 B, the
   v0.717 client payload — has stage rect 800×690 at 24 fps**, identical to the
   loader. The Android payload (`shs3_android_payload_decoded.swf`) is 800×480.
   The two builds have *different stages*, and the claim asserts the Android one for
   the web build.

Honest residue: the visible surface in both longplays is ≈5:3, so HUD x-fractions are
probably not pillarbox-wrong. But "aspect-ratio truth is CLOSED" is not earned, and
the reconciliation "690 is container chrome" is an assertion, not an artifact.

---

## CLAIMS THAT HELD (re-derived first-hand)

| claim | what I did | result |
|---|---|---|
| `audio-recovered-not-encrypted` | 256-way brute force of `payload_decode.py`'s transform over `122_Mobile_SoundResource.bin`, blind to the survey's table | key **111**, CWS v17, declared 29,631 → inflates 29,623 B; 13 `DefineSound` + `SymbolClass` = deflect die2 sumo slash3 die3 refund die1 slash2 slash1 goodkoto hitmetal fart punch; all `MP3, 11025 Hz, 16-bit, mono`; wrote `slash1.mp3`, `afinfo` → `1 ch, 11025 Hz, .mp3 … 576 frames/packet` / `estimated duration: 0.572000 sec` |
| `music-13-stems-measured` | same on `113_Mobile_MusicResource.bin` | key **117**, 13 stems, names exact. **Stronger than afinfo:** the six overworld stems carry the *identical authored sample count* `SoundSampleCount = 882,144`, and the four dungeon stems `504,288`. That is the phase-lock proof. (Method nit: those counts are 80.013 s / 45.740 s; the survey's 79.872 / 45.760 are afinfo's MP3-frame estimate. Same conclusion.) |
| `adaptive-music-engine` | read `MusicManager.as:200-212, 296-334` | `sndTransform.volume -= 0.05` / `+= 0.05` verbatim; `playPosition = int(scArray[TRACK_FLUTES].position)` with a documented fallback chain (→ battledrums → safepercussion). Held. |
| `sfx-playback-contract` | read `SoundManager.as:187-219, 255-279` + grepped the file for `SoundMixer`/`soundTransform` | `var dice:int = Math.random() * 3` → slash1/2/3; `playHit()` and `playHurt()` are byte-for-byte the same body on `"punch"`; bare `sound.play()`; **no global `SoundMixer` transform anywhere in the class** — only a `hasSound` on/off. Held. |
| `font-identified` | decoded 115 (key 104) and 124 (key 109) myself, walked tag 88 | `DefineFontName` id 307 `Edo SZ` © `2008 Vic Fieger`; id 12 `EPSON 太行書体Ｂ` © `(C) 2000 SEIKO EPSON CORP.`; id 61 `Adobe 고딕 Std B` © `Copyright © 2009-2011 Adobe Systems Incorporated`; id 161 `MS UI Gothic 標準` © `(C)2009 data:RICOH Co.,Ltd. typeface:RYOBI IMAGIX CO.`; and id 76 `Edo SZ` in ImageResource. Exact. Also confirms 1,949 `DefineSprite` / 1,594 `DefineShape4`. |
| `screen-shake-catalogued` | read `StageManager.as:1200-1227` and `:824-830` | verbatim match, `shakeAmt:int = 30` default, `Math.min(screenShakeAmt,screenShakeCounter)` taper, exact snap-back at 0, and `doShake()` is called **before** the `if(actionState != STATE_FROZEN)` gate. Held. |
| `blood-vfx-exact` | read `BloodParticleEmitter.as:18-26` | `pnumber 20 · panglevariance 10 · pvel 6 · pvelvariance 2 · pgravity 0.6 · pttl 24` verbatim. Held. (Its lane_impact wrongly banks "hitstop" as closed — see R1.) |
| `21-node-rig-held` | parsed all 19 animdata blobs | **487 `<anim>` exactly.** Node attribute histogram: 79,867 nodes as `(i,r,x,y)`, 1,839 as `(a,b,c,d,i,x,y)` — the claim's two forms, measured. Held, with two notes below. |
| `android-web-byte-identity` | MD5 over both trees | **14/18** AnimationData blobs identical; differing = Guardian, HumanSpear, Ogre, Skills; **21 of 42** android blobs match a web blob overall. Reproduced exactly. |
| `blade-trail-frame` | opened `Nr4fQstqHDM_432.0.png`, crop (900,600)-(1300,900), ×3 Lanczos | Confirmed by eye: hard-edged blue wedge sweeping left from the hands, mid-blue upper / darker blue lower band, **two white stripes** along its length, solid black outline, tapering to a point; it **occludes** grass and background. Fighter in navy haori with red trim, straw obi with an orange band, white hakama, straw kasa, bold black outlines. Felled bare-torso enemy at his feet, kasa fallen beside him, **no blood, no severed limb**. Held. |
| `web-audio-parity-unheld` | `head -c 3` over all 27 web bindata files | signatures are `EFBBBF` (×19 animdata), `3C3F78` (`<?x`), `474946` (GIF89a) and plain text — **zero** FWS/CWS/ZWS. Honest STILL_UNHELD, correctly stated. |
| `hit-reaction-12-ticks` | read `MCSPlayer.as:3687-3720` | `PART_hat / PART_head / PART_neck → behead = true`; `if(behead) damage *= 1.5`; `gotHitCounter = 12`. Held — plus a finding the claim omits (F3 below). |

### Two notes on `21-node-rig-held` (not refutations)
* **"21 nodes per pose" is not what the data does.** Node lists are *sparse
  carry-forward*: per-frame counts run 0…26. The wolf blob `112_1t4639s0.bin` uses
  **25 distinct node indices, max i = 26**; `118_1t4645s0.bin` (light stance) uses 19,
  max 20; `108_1t4635s0.bin` (human) uses 20, max 21. Sizing a rig at a flat 21 will
  drop wolf joints.
* **Precedence: this is not new.** `docs/research/fidelity/FIGHTER_ART_IDS.md`
  (SESSION 15, 2026-07-26, "A1 GATE GREEN") already states *"the fighter is
  CODE-ASSEMBLED from 21 named body-part classes"* and *"the poses that arrange them
  are embedded in the payload as XML"*, and `src/core/ogAnimPlayer.ts` already
  implements the player. `overturns_ledger: true` against a 2026-07-20 line that the
  repo's own later work had already superseded overstates the novelty.

---

## NEW FINDINGS THE SURVEY MISSED

**F1 · 205 authored `GlowFilter` placements in the shipped web payload.** See R2. This
is the real answer to blocker ③: *no blend modes, but glow is everywhere.*
(A3: recursive `PlaceObject3` scan of `reference/decrypted/shs3_payload_decoded.swf` —
262 filter placements = 205 Glow / 57 Blur / 2 DropShadow, over 71 sprites incl.
`shs3_fla.InteractUI_chikako_portrait_610`.)

**F2 · The web and Android builds ship different stages.** `shs3_payload_decoded.swf`
= 800×690 @ 24 fps; `shs3_android_payload_decoded.swf` = 800×480 @ 24 fps. Any
constant lifted from `shs3_android/scripts/GameEngine.as` about canvas, scale or
letterbox is Mobile-only. (A2/A3, SWF headers.)

**F3 · An unreported stance-triangle ×1.2, and the damage pipeline's ORDER.**
`MCSPlayer.as` (same block as the ×1.5): `if(LIGHT vs BALANCED || BALANCED vs HEAVY ||
HEAVY vs LIGHT) { damage *= 1.2; … damagetextcol = 16777215; }` **then**
`damage -= getDefense()` **then** clamp to `damageObj.getMinDamage()` **then**
`if(behead) damage *= 1.5`. The white damage-text colour is set only when
`controlledBy != 0`. Combat-core holds none of this ordering.

**F4 · 16 % of all authored frames are pose holds.** See R5(a). 896 / 5,596.

**F5 · The Android build's own gore roll is per-class, and the human's is 7-way.**
See R4.

---

## SCORE

**56 → 84 is too generous. My number is 74.**

The audio result alone is worth a large jump and I am not trying to take it back —
blocker ① is dead, ② is dead, ⑤ is dead in substance, and half of ③ is now a
byte-check rather than a grep. But: ④ is only **half** closed and the hitstop half is
closed *the wrong way* against a standing frame measurement; the compositing answer is
missing 205 glows; the kill-beat number is 6.0 s where the code and the frame both say
5.0; the animation-clock model contradicts 16 % of the data and re-announces an
eleven-week-old correction; and the aspect-ratio "closure" rests on an Android
constant asserted over the web payload's own header.

Everything above is reproducible from this document. No file outside this path was
modified; decoded audio and crops went to the session scratchpad only.
