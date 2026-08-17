# Critic — art-anim-audio-feel · LENS 3 (PRECEDENCE)

**Reviewer:** blind critic, Lens 3 (stale-claiming / doc-vs-frame precedence).
**Date:** 2026-08-15. **Unit reviewed:** `docs/gauntlet/L0/systems/art-anim-audio-feel.md`, 18 claims, proposed 56 → 84.
**Method:** every verdict below cites an artifact **I opened myself**. I re-decoded the blobs with my own
script rather than trusting the surveyor's, re-measured the frame, and extracted my own 60 fps video frames.

**Headline:** 13 of 18 claims survive intact. **Three are refuted** — one of them fatally, and it is
exactly the failure this lens exists to catch: the surveyor **overturned a frame-measured ledger line
using a byte inference, while asserting that no frame could arbitrate**. The primary reference is
1080p**60** video. It arbitrates. It says 15 Hz.

Recommended score: **74**, not 84.

---

## ⛔ FATAL — `art-anim-audio-feel/24fps-keyframe-stream`

The claim: *"The animation clock is 24 fps … Graded PARTIAL … because the payload settles the clock but
no frame can arbitrate the visible cadence: the dense stills sample at 0.1 s (10 Hz) and cannot resolve
24 vs 15, so this is a doc-vs-payload correction, not a frame-vs-doc one."*

The stated reason is false on its face. `reference/frames/duel_dense/` is a *pre-extracted subset*, not
the source. The source is:

```
$ ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate,width,height \
    reference/videos/Nr4fQstqHDM.mp4
width=1920  height=1080  r_frame_rate=60/1  avg_frame_rate=60/1  nb_frames=237047
```

Both longplays are true 1080p60. I extracted 150 consecutive frames from `Nr4fQstqHDM.mp4` at t=428 s
(the same duel as the surveyor's own A1 frame) and 120 from `zFtCaTO0_1M.mp4` at t=900 s, converted to
luma, cropped to the play area `[400:1000, 500:1500]` to exclude the static HUD, and took the
frame-to-frame mean absolute difference.

**Nr4fQstqHDM @ 428 s — first 40 inter-frame MAEs:**
```
0.42 5.94 0.05 0.02 0.02 5.29 0.02 0.02 0.03 4.95 0.00 0.03 0.00 3.17 0.02 0.04
0.10 3.29 0.00 0.03 0.00 1.70 0.04 0.02 0.02 1.36 0.02 0.02 0.03 0.85 0.01 0.05
0.01 0.93 0.03 0.02 0.02 4.28 0.01 0.70
mean MAE by index mod 4 -> [0.061, 3.076, 0.026, 0.069]
```

**zFtCaTO0_1M @ 900 s (different uploader, different session):**
```
0.00 0.63 10.46 0.03 0.00 0.00 0.00 0.00 ... 2.85 0.01 0.00 0.00 1.80 0.00 0.00 0.00
10.98 0.01 0.00 0.00 8.15 0.02 0.00 0.00 17.57 0.02 0.01 0.06 25.56 ...
mean MAE by index mod 4 -> [0.003, 0.040, 6.438, 0.078]
```

Unique content lands on **exactly every 4th frame of 60**, phase-locked across 150 frames, in **two
independent captures**. 60 ÷ 4 = **15 Hz**. There is no 24 Hz signature anywhere — a 24 Hz game in a
60 fps capture would beat at an irregular 2/3/2/3 cadence, which is not what either video shows.

This independently reproduces `docs/research/SHSD_MASTER_REFERENCE.md:892` ("*every 4th video frame in
60fps footage … MAE ≈ 0 except every 4th frame*") and `docs/DIVERGENCES.md:333` ("*longplays carry only
~15 fps of unique content in a 60 fps container*").

**I say it out loud, per the standing invariant: THE FRAME WINS.** The ledger's
`REBUILD_READINESS.md:239` "15fps pose latch" is frame-measured and **stands**. The surveyor's
`lane_impact` — *"the headline Ready bullet's model is wrong"* — is itself the wrong call.

What *does* survive from this claim, and should be kept:

- `@d` **does** equal `count(<f>)` for all 487 animations. I verified with an attribute-tolerant regex
  over all 19 web animdata blobs: **0 mismatches**. (A strict `<f i="\d+">` regex reports 96 false
  mismatches because 258 frames carry an extra attribute — see New Finding N9.)
- The code-side duration tails are real: `AnimData.as:15 this.duration = xml.@d;` then a switch on
  `xml.@i` adding +4 … +24 (`:41 this.duration += 10;` for all 13 stance slash poses).
- The hold mechanism is real: `MCSCharacter.as:1315 ++this.frameCounter;` runs to
  `currentAnimationDuration`, while `:1334 if(this.frameCounter < this.currentAnimation.frameList.length)`
  gates the pose write — so once the counter passes the last keyframe the pose latches. Verified verbatim.
- SWF headers really do declare 24 fps (I parsed them: `shs3.swf`, `shs3_payload_decoded.swf`,
  `shs3_android_payload_decoded.swf` all `fps 24.0`).

So the correct statement is: **the SWF stage declares 24 Hz; the shipped game visibly steps poses at
15 Hz.** Both are true and the reconciliation is open. What is not permitted is deleting a
frame-measured ledger line on the strength of the header alone.

Note also the weaker sub-cite: `Mobile.as:117 GameEngine.getStageMC().frameRate = 24;` sits inside
`handleMobileActivate` guarded by `if(frameRate == 0)` — an AIR resume-from-background handler in the
*Android* build. It is not the web build's clock.

---

## ✖ REFUTED — `art-anim-audio-feel/21-node-rig-held` (the number 21)

The rig is not 21 nodes. Three independent counts, all mine:

| Source | Count |
|---|---|
| `MCSCharacter.as:10-62` — named `PART_*` constants, `PART_l_hand:int = 0` … `PART_r_knee:* = 26` | **27** |
| `MCSCharacter.as:120 partListLength:int = 22` + `:141 for(var i:int = 0; i <= this.partListLength; i++)` → MovieClips actually built | **23** |
| distinct `<n i="…">` ids across all 19 web animdata blobs (`0–26` minus `8` and `17`) | **25** |
| distinct ids in `118_1t4645s0.bin` (LightStance) / `108_1t4635s0.bin` (Human) | **19 / 20** |

**21 matches none of them.** Per-frame node-count histogram across all 487 anims:
`{9:1, 16:22, 17:39, 18:56, 19:240, 20:17, 25:9, 26:1}` — 21 never occurs. A rebuild that builds a
21-bone rig from this claim builds the wrong skeleton.

Everything else in the claim holds and I confirmed it verbatim:
`118_1t4645s0.bin` opens `<anim i="light_stance" d="1">` / `<f i="0">` /
`<n i="19" x="14" y="-67" r="-25"></n>`; `FrameNodeData.as:32-43` takes `x`, `y`, and `r` **or**
`a/b/c/d`, and `:60-70` writes `mc.x/mc.y/mc.rotation` else `m.a = this.matA / 100`. And the **487**
is right — my raw `<anim` count across the 19 blobs is exactly 487.

---

## ✖ REFUTED — `art-anim-audio-feel/hit-reaction-12-ticks` ("single uniform 12-tick window")

`gotHitCounter` is **not** uniformly 12, and `MCSPlayer` — named in the claim as one of the places it is
"set identically" — is the counterexample:

```
EnemyShield.as:338    gotHitCounter = 24;    // hit on PART_prop (the shield) + playHitMetal()
MCSPlayer.as:1457     gotHitCounter = 24;    // REDFREEZE_STATE, animation == DOWNSTAB
MCSPlayer.as:1461     gotHitCounter = 84;    // REDFREEZE_STATE, local player
MCSPlayer.as:1764     gotHitCounter = 26;    // recovery after SKILL_THOUSANDSTABS_STATE
MCSPlayer.as:1768     gotHitCounter = 16;    // recovery after SKILL_DEADLYCLEAVE_STATE
```

12 is the *default* (23 call sites), not the only value. The reaction window has at least five values:
**12, 16, 24, 26, 84**.

This kills the claim's `lane_impact` outright: *"the authored 7/12/16-frame tint ladder is a recreation
invention — the original's single number is 12."* The original has 12 **and** 16 in its own set. Two of
the recreation's three rungs are vindicated, not invented.

What holds: the behead branch is exactly as quoted — `MCSPlayer.as:3689-3692`
`case PART_hat: case PART_head: case PART_neck: behead = true;` and `:3716 damage *= 1.5;`, with
`:3719 gotHitCounter = 12;`. The ×1.5 body-part multiplier is a genuine find.

**And their own "CAUTION, un-reconciled" is answerable from the index they were handed.**
`docs/gauntlet/L0/index/strings.json` entry **4132** = *"Eat this potato to get the 150% Damage buff.
\n\nNote: Only one buff may be active at a time."* The HUD's "150% DAMAGE" is a **consumable buff**,
not the stance modifier — the stance-matchup bonus in the same function is `damage *= 1.2`
(`MCSPlayer.as`, light>balanced>heavy>light chain). Entry 125 is "Stance Restriction". The caution
should have been closed, not carried.

---

## ✖ REFUTED — `art-anim-audio-feel/aspect-ratio-frame-wins` (the framing, not the number)

The **800×480 conclusion is correct**. Three things around it are not.

**1. There is no frame-vs-byte conflict for the frame to arbitrate.** The payload explains its own
690 rect:

```
GameEngine.as:269   var originalWidth:int = 800;
GameEngine.as:270   var originalHeight:int = 480;
GameEngine.as:271   var originalHeightWithBar:int = 690;
GameEngine.as:275   if(newAspectRatio <= originalWithBarAspectRatio)
GameEngine.as:278   {  originalHeight = originalHeightWithBar;
GameEngine.as:279      StatsManager.stageShowingFriendBar = true;
GameEngine.as:281      OverworldHUD.instance.friendpanel.init();  }
```

690 is **`originalHeightWithBar`** — the 480 play area plus a named in-game **friend panel**, switched
on when the window aspect drops to ≤ 800/690. Calling it "container chrome" is wrong: it is game UI with
its own class, and it is *conditional*, not a constant. Invoking "THE FRAME WINS over the SWF document
rect — I say so explicitly" for a conflict the payload resolves by itself is precedence theatre.

**2. `overturns_ledger: true` is wrong.** The ledger already says 800×480 — twice:
`REBUILD_READINESS.md:117` (*"native canvas is **800×480 (5:3)**"*) and `:171` (*"Native resolution is
800×480 (5:3), not 16:9"*). The claim **confirms** the ledger and closes its open question ("*are
x-fractions pillarbox-wrong?*"). That is valuable — and it is a promotion, not an overturn. Scoring it
as an overturn inflates the unit.

**3. The arithmetic is presented as an equality it is not.** I reproduced the measurement exactly —
`thr 25/40/60 → cols 52..1867, w=1816, rows 0..1079, aspect 1.6815` — but 800/480 = **1.6667**. A 0.9 %
gap (≈16 px at 1080 tall). "aspect 1.6815 = 800x480" should read "≈".

**The byte answer they missed:** the Android payload SWF's own document rect *is literally 800×480.*
I parsed the headers:

```
reference/preservation/shs3.swf                       rect 16000 x 13800 twips = 800 x 690, fps 24.0
reference/decrypted/shs3_payload_decoded.swf          rect 16000 x 13800 twips = 800 x 690, fps 24.0
reference/decrypted/shs3_android_payload_decoded.swf  rect 16000 x  9600 twips = 800 x 480, fps 24.0
```

The web containers carry the friend bar; the mobile one, which has no friend bar, is 800×480 exactly.

---

## ⚠ MATERIAL CORRECTION (claim stands) — `art-anim-audio-feel/no-blend-modes`

**The headline is right and I proved it harder than the survey did.** The survey rested on an
ActionScript grep. Blend modes can also be authored on the timeline in `PlaceObject3`, which no grep
would see. So I parsed every `PlaceObject3` tag — recursing into every `DefineSprite` — in all three
decoded art containers *and* both decoded payloads:

| container | PlaceObject3 | blend-mode fields |
|---|---|---|
| `115_Mobile_SHS3Resource.bin` (key 104) | 12 | **0** |
| `124_Mobile_ImageResource.bin` (key 109) | 1,473 | **0** |
| `120_Mobile_BGResource.bin` (key 103) | 54 | **0** |
| `shs3_payload_decoded.swf` | 304 | **0** |
| `shs3_android_payload_decoded.swf` | 248 | **0** |

**2,091 PlaceObject3 tags, zero blend modes.** Blocker ③ is closed by bytes, not by inference.

**But the tail of the claim is false.** *"the entire compositing vocabulary is one class using
ColorTransform, BlurFilter and a luma ColorMatrixFilter"* — the same parse shows the shipped art is
full of **timeline-authored filters that `ColorCode.as` never constructs**:

| container | Glow | Blur | DropShadow |
|---|---|---|---|
| `124_Mobile_ImageResource.bin` | **1,469** | 4 | — |
| `120_Mobile_BGResource.bin` | — | 29 | — |
| `115_Mobile_SHS3Resource.bin` | 8 | — | — |
| `shs3_payload_decoded.swf` | 152 | 41 | 2 |

`ColorCode.as` imports only `BlurFilter` and `ColorMatrixFilter` and never builds a `GlowFilter` or
`DropShadowFilter`. A recreation built from this claim would omit glow entirely — and glow is visible
in the frame: the yellow nameplate and the HUD text both carry a dark outer glow (see below).

Corroborated from the frame side, which the surveyor did *not* claim: the background in
`Nr4fQstqHDM_432.0.png` is visibly **blur-filtered** — a depth-of-field pass on the rock wall,
matching the 29 timeline Blur filters in `BGResource`.

---

## ⚠ MINOR CORRECTIONS (claims stand)

**`screen-shake-catalogued`** — "fully catalogued … trigger set" is short by three. I found **8**
`startShake` call sites, not 5. Missing from the survey:
`HeavenlySwordProjectile.as:76 StageManager.startShake(12);`,
`Trap_CrusherBlockAuto.as:88 StageManager.startShake(6);`, and
`StatsManager.as:3535 StageManager.startShake(val);` (fully data-driven). Also their
`Marker_RumbleTrigger.as:9-11` cite points at blank lines — the constants are `:8 shakeDuration:int = 24`
and `:10 shakeAmt:int = 30`. The algorithm at `:1200-1227` and the outside-the-freeze gate at `:824-830`
are verbatim correct.

**`kill-beat-timings`** — `redFreezeCounter = 24 * 6` at `:1101` is the **else of the HARVEST branch**,
so it is set on *both* win and loss. On a win the freeze normally **ends at `counter == 24`** (`:916`),
i.e. after **120 ticks**, not 144; the full 144 runs only while `SHEATHESWORDCHIBURI` is still playing.
"freezes for 24*6 (6.0 s)" is the ceiling, not the norm. All five line cites are exact.

**`web-audio-parity-unheld`** — correct and honest; I re-ran it (see below). One phrasing slip: "49
named backgrounds in BGResource". `BGResource`'s SymbolClass has **67** entries (`BG_AncientRuins`,
`BG_BanditHideout`, `BG_Battlefield`, `BG_Beach`, `BG_CastleHallway`, … plus `bgresource_fla.*`
sub-parts). The 49 is `123_Mobile_BGData`'s row count from Stage-0 S0-4 — a different artifact.

---

## ✔ CONFIRMED FIRST-HAND (13 claims)

I re-derived the audio from scratch with my own decode script rather than trusting the survey's:

```
122_Mobile_SoundResource.bin  key=111 -> CWS v17, declared 29,631, zlib body inflates to 29,623
113_Mobile_MusicResource.bin  key=117 -> CWS v17, declared 1,402,685, inflates to 1,402,677
115_Mobile_SHS3Resource.bin   key=104 -> CWS v17   124_Mobile_ImageResource.bin key=109 -> CWS v17
120_Mobile_BGResource.bin     key=103 -> CWS v17 (brute-forced; not named in the survey)
```

- **`audio-recovered-not-encrypted` — HELD.** 13 `DefineSound` tags, all MP3 (fmt 2), 11025 Hz, mono.
  SymbolClass reproduces verbatim: `punch, fart, hitmetal, goodkoto, slash1, slash2, die1, refund,
  die3, slash3, sumo, die2, deflect`. I wrote the MP3 payloads out and `afinfo slash1.mp3` returns
  `1 ch, 11025 Hz, .mp3 … 576 frames/packet` / `estimated duration: 0.572000 sec`. **This overturns
  Stage-0 S0-5's "You may NOT claim audio is recovered."** It is recovered.
- **`music-13-stems-measured` — HELD, exactly.** My own `afinfo` on my own extraction:
  `battlechants / battledrums / flutes / safeambience / safekoto / safepercussion = 79.872000 sec`
  (all 882,144 samples, all 159,744 bytes — bit-identical);
  `dungeonambience / dungeonflute / dungeonpercussion / dungeonpiano = 45.760000 sec`
  (all 504,288 samples, 91,520 bytes); `bgm_levelup 29.900000`, `bgm_lose 3.744000`,
  `bgm_gangnam 3.848000`. Every figure reproduced to the millisecond.
- **`adaptive-music-engine` — HELD.** `MusicManager.as:140` (preset table), `:206` (flutes-anchored
  `playPosition`), `:279` (SOUND_COMPLETE re-`play()` loop), `:301 volume -= 0.05`,
  `:329 volume += 0.05` — all five line numbers exact. 17 non-empty presets + `MUSIC_NONE`. And
  `update()` really is per-tick: `GameEngine.as:923 MusicManager.instance.update();` inside the
  `ENTER_FRAME` gameloop (`GameEngine.as:442`). Extra detail worth keeping: `:233` clamps an
  overrunning anchor with `playPosition %= this.trackArray[i].length`, and `:228` forces
  `playPosition = 0` on any flutes↔dungeonflute swap.
- **`sfx-playback-contract` — HELD.** `SoundManager.as:194 var dice:int = Math.random() * 3;`,
  `:197/:200`, and `:261` and `:274` are byte-identical `ResourceManager.getSound("punch")`.
  Confirmed stronger: **zero** occurrences of `SoundTransform` or `volume` in the whole file, and
  **zero** `SoundMixer` references anywhere in the client — the bare `sound.play()` reading is right.
- **`font-identified` — HELD.** My own `DefineFontName` parse:
  `115_…SHS3Resource` id 307 `Edo SZ` / `2008 Vic Fieger`; id 12 `EPSON 太行書体Ｂ` /
  `(C) 2000 SEIKO EPSON CORP.`; id 61 `Adobe 고딕 Std B` / `Copyright © 2009-2011 Adobe Systems`;
  id 161 `MS UI Gothic 標準` / `(C)2009 data:RICOH Co.,Ltd. typeface:RYOBI IMAGIX CO.`;
  `124_…ImageResource` id 76 `Edo SZ`. The licence flag on Edo SZ is right and should be carried.
- **`no-hitstop` — PARTIAL is the correct grade.** My grep for
  `hitstop|hitpause|freezeframe|slowmo|timescale|hitfreeze` over the whole android script tree returns
  nothing; `STATE_FROZEN` exists only at `:52` (declaration), `:162`, `:212` (both battle-intro) and
  `:830` (the gate). Grading a build-scoped negative as PARTIAL rather than HELD is exactly right and
  should not be second-guessed.
- **`gore-system-not-one-variant` — HELD, with its numbers.** I parsed `108_1t4635s0.bin` myself:
  exactly **8** death animations — `death d=38, deathenemy 23, deathnohand 25, deathnohead 31,
  deathwitharrow 23, deathbyarrow 21, deathdowned 7, deathinhalf 28`. Every figure in the claim checks.
  The 40/20/20/20 split is sound because `EnemyGoblin.as:327 var dice:int = 0;` — `Math.random() * 5`
  truncates to a uniform 0–4, and `dice <= 1` takes two of them. `:356` mirror coin-flip, `:358`
  censor gate, `:386` the d5. `StatsManager.as:314 censored:Boolean = false` — plus `:556` a runtime
  toggle and `:4679 censored = str.charAt(2) == "1"` (it round-trips through the save string), which
  strengthens the ui-hud cross-lane note.
- **`blood-vfx-exact` — HELD.** `BloodParticleEmitter.as:18 pnumber = 20`, `:22 panglevariance = 10`,
  `:25 pgravity = 0.6`, `:26 pttl = 24` — verbatim.
- **`android-web-byte-identity` — HELD, exactly.** My own MD5 over all 42 android and all 27 web
  bindata files: **21 identical hashes**. Of the 18 `MCSCharacter_*AnimationData` blobs, **14** match
  (`99_Human = 108_1t4635s0 = bcfd658e79fafb41f52431afb7d10622`), and the four that differ are exactly
  `Ogre, Skills, Guardian, HumanSpear`. `MCSCharacter.as` loads exactly those 18 classes. This is the
  strongest claim in the unit and it is airtight.
- **`blade-trail-frame` — HELD.** I opened the identical crop, `(900,600)-(1300,900)` upscaled ×3
  Lanczos, and looked. Present as described: a wide hard-edged blue wedge sweeping left from the hands,
  two blue tones split by a white double stripe, a solid black outline, tapering to a point, fully
  **occluding** the grass behind it — the visual signature of no blend mode. Navy haori with red trim,
  woven cream obi, white hakama, straw kasa; a bare-torso enemy collapsed at his feet with his kasa
  fallen beside him, no blood, no severed limb at this instant. `bladeslashfx.as:12
  addFrameScript(4,this.frame5)` with `frame5()` calling `removeChild(this)` — 5 frames, self-deleting.
- **`web-audio-parity-unheld` — the STILL_UNHELD is correct and I confirm the bound.** I signature-
  scanned all 27 web bindata files: no `FWS`/`CWS`/`ZWS`. I walked the decoded web payload's tag tree:
  **0 `DefineSound`, 0 `SoundStreamHead`, 27 `DefineBinaryData`** — against **42** in the android
  payload. `StatsManager.as:30 clientVersion:Number = 0.682`. Labelling ported audio "Android v0.682"
  is the right call and should be enforced downstream.

---

## NEW FINDINGS the survey missed

**N1 — the 15 Hz cadence is directly measurable and confirms the ledger.** See the fatal section. Both
1080p60 longplays step unique content every 4th frame. `docs/research/REBUILD_READINESS.md:239`
"15fps pose latch" **stands**. THE FRAME WINS.

**N2 — the no-blend-mode negative is now a byte proof, not a grep.** 2,091 `PlaceObject3` tags across
five containers, zero blend-mode fields.

**N3 — Glow is part of the compositing vocabulary and `ColorCode.as` is not.** 1,469 timeline Glow
filters in `ImageResource`, 152 + 41 Blur + 2 DropShadow in the web payload. Visible in-frame on the
nameplate and HUD text.

**N4 — the rig is 23 built parts over 27 named slots**, not 21.

**N5 — "150% DAMAGE" is a potato.** `strings.json:4132` — *"Eat this potato to get the 150% Damage
buff."* Not the stance modifier (`damage *= 1.2`), not the behead multiplier. Cross-lane into
items-equipment and ui-hud: a consumable-buff HUD row exists and no ledger holds it.

**N6 — 690 = 480 + friend panel**, conditional on window aspect, with its own
`OverworldHUD.instance.friendpanel`. The android payload's document rect is 800×480 exactly. Cross-lane
into ui-hud and meta-social: an in-battle friend panel is a UI surface the board does not list.

**N7 — three uncatalogued screen-shake triggers**, including a fully data-driven one at
`StatsManager.as:3535`.

**N8 — every tick→seconds conversion in this unit is contingent on the contested 24 Hz.** The tick
counts (12, 20, 24, 26, 30, 84, 144) are solid bytes. "0.5 s", "0.83 s", "1.0 s", "6.0 s" are not, if
the web build stepped at 15 Hz. Carry the ticks; label the seconds.

**N9 — the animdata carries two attributes nobody has used.** `<anim … l="1">` = looping
(`AnimData.as:16 this.looping = xml.@l == 1;`) — **102** of the 487 anims. `<f … r="1">` = a per-frame
**z-order reorder** flag (`FrameData.as:15-17 this.reorder = xml.@r == 1;`, driven at
`MCSCharacter.as:1306 frameList[frameCounter].reorderLayers(this)`) — **258** frames. Part re-sorting
mid-animation is authored motion data, and no ledger system holds it.

---

## Score

**74, not 84.** Blockers ①–⑤ genuinely fall — that alone is worth the bulk of the rise, and the audio
recovery is the single biggest artifact win in this run. The deduction is for: a fatal frame-contradicted
motion-clock claim that also mis-states what the frames can do; a wrong rig node count; a wrong
uniform-hit-window claim; a mis-graded aspect-ratio "overturn" that actually confirms the ledger; and
the surveyor's own honest note that the 1,949 recovered sprites and the backgrounds were never rendered
or graded, and that nothing in the suite pins any of it.
