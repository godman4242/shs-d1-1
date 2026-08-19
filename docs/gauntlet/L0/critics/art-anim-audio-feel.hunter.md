# art-anim-audio-feel — HUNTER LENS review

Blind critic. I did not see the surveyor's reasoning. Every verdict below carries an
artifact **I** opened. Method notes and reproduction commands are inline.

Working scripts (scratchpad, not committed):
`…/scratchpad/hunt/{dec.py,swftags.py,sounds.py,dump.py,blend.py}`

---

## HEADLINE

The audio half of this survey is **real and I reproduced all of it from scratch** —
independent brute-force of all 256 keys, my own SWF tag parser, my own MP3 extraction,
`afinfo` on the results. Every number the surveyor quoted came back byte-exact. That is
an unusually strong survey.

Three claims do not survive contact with the artifacts:

| claim | verdict | why |
|---|---|---|
| `hit-reaction-12-ticks` | **REFUTED — material** | not "a single uniform 12"; the window is **{12, 16, 24, 26, 84}** |
| `21-node-rig-held` | **REFUTED — material** | the rig is **27 parts** (`PART_l_hand=0 … PART_r_knee=26`); 21 is one part's index |
| `aspect-ratio-frame-wins` | **REFUTED — material** | `1.6815 ≠ 800/480`; no frame-vs-byte conflict exists; already a CONTRACT + passing test |
| `24fps-keyframe-stream` | **REFUTED — material** | omits `l="1"`, the loop flag on 102 of 487 anims |

And four significant things the survey **under-claimed** — the failure this lane exists to fix.

---

## PART 1 — WHAT I REPRODUCED FIRST-HAND

### Audio decode (claims 1–4): fully reproduced, byte-exact

I brute-forced **all 256 keys** through the payload transform rather than trusting the
quoted key. Results:

```
122_Mobile_SoundResource.bin  key=111 UNIQUE  CWS v17  declaredLen=29,631  inflates 29,623
113_Mobile_MusicResource.bin  key=117 UNIQUE  CWS v17  declaredLen=1,402,685  inflates 1,402,677
115_Mobile_SHS3Resource.bin   key=104         CWS v17  declaredLen=1,040,857
120_Mobile_BGResource.bin     key=103         CWS v17  declaredLen=4,412,348
124_Mobile_ImageResource.bin  key=109         CWS v17  declaredLen=1,908,237
```

Key 111 is the *only* key of 256 whose body inflates. My own SWF tag parser then returned
the SymbolClass table **verbatim identical** to the surveyor's quote:

```
[(1,'deflect'),(2,'die2'),(3,'sumo'),(4,'slash3'),(5,'die3'),(6,'refund'),(7,'die1'),
 (8,'slash2'),(9,'slash1'),(10,'goodkoto'),(11,'hitmetal'),(12,'fart'),(13,'punch')]
```

All 13 are `MP3, 11025 Hz, 16-bit, mono`. `afinfo slash1.mp3` → `estimated duration:
0.572000 sec`, exactly as quoted. All 13 music durations reproduced exactly
(79.872 / 45.760 / 29.900 / 3.744 / 3.848).

**Stage-0 finding S0-5 is dead.** "You may NOT claim audio is recovered" is overturned for
all five CWS blobs. I confirm this independently of the surveyor.

> ⚠️ Precision note for whoever ports these: `afinfo` reports the **container estimate**
> (packets × 576 ÷ 11025), which over-reports by the encoder padding. The authoritative
> length is the `DefineSound` header's sample count:
> `slash1` = 3,809 samples = **0.345 s** (not 0.572 s); the 80 s stems are **882,144
> samples = 80.013 s**; the dungeon stems **504,288 = 45.740 s**. Use the sample counts.

### AS3 claims: all quoted lines confirmed verbatim

`MusicManager.as` (±0.05 fades, phase-lock from the anchor stem, `SOUND_COMPLETE` loop),
`SoundManager.as` (1-of-3 slash/die, shared `punch` for hit *and* hurt, bare `sound.play()`),
`ColorCode.as` (ColorTransform + BlurFilter + luma ColorMatrixFilter, no blend mode),
`StageManager.as` shake + redFreeze, `BloodParticleEmitter.as` constants,
`AnimData.as` duration tails, `FrameNodeData.as` transform, `bladeslashfx.as`
`addFrameScript(4, frame5)` — **every one checked out word for word.**

### MD5 parity: reproduced exactly

21 blobs identical android↔web; **14 of 18** MCSCharacter blobs identical; the four that
differ are Ogre, Skills, Guardian, HumanSpear — exactly as stated.
`md5(99_MCSCharacter_HumanAnimationData.bin) = md5(108_1t4635s0.bin) =
bcfd658e79fafb41f52431afb7d10622` ✓

### The frame (claim `blade-trail-frame`): I cropped it and looked

`reference/frames/duel_dense/Nr4fQstqHDM_432.0.png` (1920×1080), crop **(900,600)–(1300,900)
upscaled ×3 Lanczos**. Visibly present: the wide hard-edged blue wedge sweeping left,
tapering to a point, mid-blue over darker blue, **white double stripe**, solid black
outline; fighter in navy haori with red trim, cream wave-patterned obi, white hakama,
straw kasa; a bare-torso enemy sprawled at his feet with a fallen kasa; **no blood, no
severed limb at this instant.** The wedge is opaque — it hides the grass rather than
lightening it. The A1 description is accurate in every particular. **HELD.**

### Death animation frame counts: measured directly, exact

From `108_1t4635s0.bin` — **exactly 8** death animations:
`death 38 · deathenemy 23 · deathnohand 25 · deathnohead 31 · deathwitharrow 23 ·
deathbyarrow 21 · deathdowned 7 · deathinhalf 28`. The three quoted (25/31/28) are exact.
`var dice:int = 0;` at `EnemyGoblin.as:327` confirms the **40/20/20/20** split is real.

---

## PART 2 — REFUTATIONS

### R1 · `hit-reaction-12-ticks` — the window is NOT uniform. **MATERIAL.**

The claim: *"a single uniform 12-tick window … set identically in every enemy class and in
MCSPlayer"*, and from it: *"the authored 7/12/16-frame tint ladder is a recreation
invention — the original's single number is 12."*

```
$ grep -rhn "gotHitCounter = " reference/decompiled/shs3_android/scripts/*.as \
    | sed 's/.*gotHitCounter = //' | sort | uniq -c
   1 -1;      3 0;      23 12;      1 16;      2 24;      1 26;      1 84;
```

**Seven distinct values.** Concretely:

- `MCSPlayer.as:1454-1465` (REDFREEZE_STATE) — `DOWNSTAB` → **24**; local player
  (`controlledBy == 0`) → **84** (3.5 s); else 12.
- `MCSPlayer.as:1763-1768` — after `SKILL_THOUSANDSTABS_STATE` → **26**;
  after `SKILL_DEADLYCLEAVE_STATE` → **16**.
- `EnemyShield.as:330-339` — hitting `PART_weapon` → `damage = 0; return false` (no
  reaction at all); hitting `PART_prop` (the shield) → `damage = 0; gotHitCounter = 24;
  SoundManager.instance.playHitMetal();`

12 is the **default**, not the rule. The original has its own ladder — and that ladder
**contains both 12 and 16**, so the survey's verdict that the recreation's 7/12/16 ladder is
"a recreation invention" is exactly backwards.

*(The claim's `text` field — 12-tick default, behead on hat/head/neck, ×1.5 — is itself
correct and verbatim-confirmed at `MCSPlayer.as:3689-3719`. It is the word "uniform" and
the derived lane_impact that fail.)*

### R2 · `21-node-rig-held` — the rig is 27 parts, not 21. **MATERIAL.**

`MCSCharacter.as:10-62` declares the rig explicitly:

```
PART_l_hand=0  l_uparm=1  l_lowarm=2  weapon=3  prop=4  l_foot=5  l_thigh=6  l_calf=7
crotch=8  r_foot=9  r_thigh=10  r_calf=11  neck=12  stomach=13  pelvic=14  torso=15
head=16  hat=17  r_hand=18  r_uparm=19  r_lowarm=20  prop2=21  prop3=22
l_shoulder=23  r_shoulder=24  l_knee=25  r_knee=26
```

**27 parts, indices 0–26.** Measured from the data: the Human blob uses **20 distinct**
`<n i=>` indices (0–7, 9–16, 18–21 — `8`=crotch and `17`=hat are never keyframed); across
all 19 web animdata blobs the index space spans **0–26, 25 in use**. "21" is none of
{20, 22, 25, 27} — it is the index of `PART_prop2`, an off-by-one off the Human max.
A rebuild that provisions 21 nodes will be short.

The *mechanism* half of the claim is right and I measured the split: in `108_1t4635s0.bin`,
24,502 `<n>` nodes carry `i/x/y`; **24,010 carry `r`** and **492 carry the `a/b/c/d`
matrix** (2.0 %), discriminated in `FrameNodeData.as` by the sentinel `rotation != 999`.
The **487** anim count is also correct — I counted it raw.

### R3 · `24fps-keyframe-stream` — the model omits the loop flag. **MATERIAL.**

The `@d == len(<f>)` half is **correct, and I verified it further than the surveyor did** —
across **all 487** animations in all 19 web blobs, **zero mismatches**. Excellent finding.

But the stated mechanism — *"the 'latch' is injected in code by AnimData's per-animation
duration tails, which the frame guard then holds on the final pose"* — is only the
non-looping path. **102 of the 487 animations carry a third attribute `l="1"`:**

```
100_1t4627s0.bin  <anim i="ogre_walk"  d="24" l="1">
118_1t4645s0.bin  <anim i="lightstanceidle" …  l="1">   (also balanced/heavy stance idles)
…walk · run_sheathed · lightstancerun · balancedstancerun · heavystancerun ·
  ninjastealthwalk · every *_partb slash tail · mining · femalewalk · zom_crawl …
```

It is parsed and consumed:

```
AnimData.as:10      public var looping:Boolean = false;
AnimData.as:16      this.looping = xml.@l == 1;
MCSCharacter.as:1293  this.currentAnimationLooping = this.currentAnimation.looping;
```

Every stance idle, every gait and every slash-continuation **cycles**; it does not latch on
the final pose. A rebuild following this claim as written will freeze the idle.

*(Also: `Mobile.as:117 frameRate = 24` sits inside `if(frameRate == 0)` — it is a fallback,
not the setting. 24 Hz is nonetheless solid: every SWF header I parsed reads `framerate=24.0`.)*

### R4 · `aspect-ratio-frame-wins` — three problems. **MATERIAL.**

The conclusion (**design canvas = 800×480**) is CORRECT. The evidence and the framing are not.

**(a) The arithmetic contradicts itself.** I reproduced the measurement exactly —
`thr 25/40/60 → cols 52..1867, w=1816, aspect=1.681481`. The claim then asserts
`aspect 1.6815 = 800×480`. **800/480 = 1.666667.** A true 800×480 surface letterboxed into
1080 px of height is **1800** px wide, not 1816. The frame is **0.89 % wider than 800×480
predicts** (8 px per side; sub-pixel edge analysis narrows it to ~1814, still ≠ 1800).
The frame does not confirm 800×480 — it lands *near* it. Under §0 that has to be said out
loud rather than rounded away.

**(b) There is no frame-vs-byte conflict to arbitrate.** The claim invokes
"THE FRAME WINS over the SWF document rect". But other byte-checks agree with the frame:

```
reference/decrypted/shs3_android_payload_decoded.swf   rect = 800.0 × 480.0 px
124_Mobile_ImageResource (decoded k=109)               rect = 800.0 × 480.0 px
reference/decrypted/shs3_payload_decoded.swf (web)     rect = 800.0 × 690.0 px
```

And the 690 is **named in code** — it is not unspecified "container chrome":

```
GameEngine.as:271  var originalHeightWithBar:int = 690;
GameEngine.as:277-281  originalHeight = originalHeightWithBar;
                       StatsManager.stageShowingFriendBar = true;
                       OverworldHUD.instance.friendpanel.init();
```

The extra 210 px is the **FRIEND BAR**, a real selectable mode entered when the window is
taller-relative-to-width than 800/690. Two canvas modes, both authored.

**(c) It was never open.** This repo already holds it as a CONTRACT with a passing test:

```
src/config/display.ts   WORLD_WIDTH = 800 · WORLD_HEIGHT = 480 · WORLD_HEIGHT_TALL = 690
                        all labelled CONTRACT-SRC, sourced to "the payload's resize routine"
tests/viewport.test.ts  pins the original's resize routine verbatim
$ npx vitest run tests/viewport.test.ts   →  Test Files 1 passed · Tests 8 passed
```

`tests/viewport.test.ts`'s own header comment even records the *same* pillarbox measurement
(`x≈53–56 … 1861–1865 on a 1920-wide capture`). So "promoted out of §1's UNKNOWN-UNKNOWNS
into a payload CONTRACT" is wrong — it was already a contract, already tested, since
SESSION13/D1.

---

## PART 3 — UNDER-CLAIMING (the hunter's job)

### H1 · The font needs **no Android caveat at all** — it is in the web payload

The claim cites only Android containers and then flags the Android-build caveat. The
**web** payload carries the font programs itself:

```
reference/decrypted/shs3_payload_decoded.swf  (v0.717, the web build)
  DefineFontName id=2    'Edo SZ'              '2008 Vic Fieger'
  DefineFontName id=60   'Calibri Bold'        '© 2015 Microsoft Corporation…'
  DefineFontName id=533  'Calibri'             '© 2015 Microsoft Corporation…'
  DefineFontName id=1273 'Adobe 고딕 Std B'
  DefineFontName id=1482 'EPSON 太行書体Ｂ'
  DefineFontName id=2212 'Times New Roman'     '© 2014 The Monotype Corporation…'
  DefineFontName id=3538 'Olivia Brush'        "Allen R. Walden's Friendly Fonts
                                                (Unprotected. Please distribute freely.)"
```

**Seven faces, two of them missed entirely** by the survey — and one of the misses matters
for the licence flag: **Olivia Brush ships with an explicit free-distribution grant**, a
materially different status from the Edo SZ restriction the survey raised. (The Android
payload additionally carries `id=828 'Edo'` © 2006 Vic Fieger — a *different* face from
'Edo SZ', so don't conflate them.)

Corroborated from the frame side: the fighter's name label **"SOUND360TM"** in
`Nr4fQstqHDM_432.0.png` renders in the gold brush display face — Edo SZ is not merely
embedded, it is the face on screen.

### H2 · "no blend modes" was proved the wrong way — I proved it the right way, in the web build

An AS3 grep **cannot** establish this. Flash stores authored blend modes in the
**PlaceObject3** tag, set in the IDE, with no code involved. The survey's grep is therefore
not evidence for the negative it draws.

I wrote a recursive DefineSprite walker and read the `PlaceFlagHasBlendMode` bit
(`flags2 >> 1 & 1`) on every PlaceObject3 in every container:

```
shs3_payload_decoded.swf   (WEB)  827 sprites  304 PlaceObject3  263 w/filters  54 cacheAsBitmap  BLEND MODES: 0
shs3_android_payload_decoded.swf  675 sprites  248 PlaceObject3  214 w/filters  47 cacheAsBitmap  BLEND MODES: 0
115_Mobile_SHS3Resource           1949 sprites  12 PlaceObject3   12 w/filters                    BLEND MODES: 0
120_Mobile_BGResource              552 sprites  54 PlaceObject3   37 w/filters  53 cacheAsBitmap  BLEND MODES: 0
124_Mobile_ImageResource            94 sprites 1473 PlaceObject3 …                                BLEND MODES: 0
```

**Zero blend modes across 2,091 PlaceObject3 tags**, including the web build. The
conclusion now stands at byte level *and* carries web parity, which the AS3 grep could not
give it. (Bonus: 263 sprites in the web payload *do* carry filter lists and 54 use
`cacheAsBitmap` — that is the real compositing budget.)

One correction to the cite: it lists `reference/decompiled/shs3_payload/` as if that were
web *client* code. It is not — that bundle holds only art/framework classes
(`StageManager`, `MCSPlayer`, `SoundManager`, `ColorCode`, `AnimData`, `GameEngine`,
`StatsManager`, `EnemyGoblin` are **all absent**). **Every AS3 claim in this survey is
Android-only**, not just the audio ones. That should be stated once, globally.

### H3 · The "150 % DAMAGE" HUD line is a **potato buff**, not the stance modifier

The survey flagged this as un-reconciled and guessed the stance modifier. Both halves are
wrong, and the string table settles it:

```
docs/gauntlet/L0/index/strings.json
  4132  "Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a time."
  4133  "…150% Defense buff…"   4134  "…150% XP buff…"   4135  "…150% Speed buff…"
  4229  "…200% AP Regeneration buff…"   4230  "…200% Duel Token Regeneration buff…"
  4125-4128 / 4227-4228  Potato Dog · Potato Bear · Potato Raccoon · Potato Cat · Potato Pig · Potato Duck
  125   "Stance Restriction"     (pairs with the frame's "CANNOT CHANGE STANCE")
```

And the stance modifier is **1.2, not 1.5**:

```
MCSPlayer.as:3701-3703
  if(this.stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE || … )
  {  damage *= 1.2;  }
```

So there were never "two 1.5s" to conflate. There are three separate multipliers:
**stance triangle ×1.2** → `damage -= getDefense()` → **behead ×1.5**, in that order — plus
a consumable **×1.5 buff** displayed in the HUD. Cross-lane into combat-core, items and ui-hud.

### H4 · The SFX contract is bigger than four routines, and 2 of 13 assets are in a WEB build

`SoundManager.as` exposes **ten** SFX routines covering all 13 assets — the survey mapped
four (8 assets), leaving five unmapped:

```
playSlash → slash1|2|3 (1-of-3)   playDie → die1|2|3 (1-of-3)
playHit → punch                   playHurt → punch
playHitMetal → hitmetal           playDeflect → deflect
playFart → fart                   playGoodKoto → goodkoto
playSumo → sumo                   playRefund → refund
```

`playHitMetal` in particular is load-bearing: `EnemyShield.as:335-339` fires it when the
blade strikes the shield, alongside `damage = 0`.

**And a bound on the "Android v0.682 only" label.** The predecessors on disk are
unencrypted, plain SWFs — I parsed them:

```
reference/predecessors/shs1_462631_shunpo202c.swf  10 DefineSound
reference/predecessors/shs2_kon.swf                20 DefineSound (+ SoundStreamBlock ×310)
       …and SymbolClass includes com.kongregate.as3.client.KongregateAPI  → a WEB build
```

SHS2's SFX are named **identically** to Duels': `deflect die1 die2 die3 slash1 slash2
slash3 hitmetal punch`. MD5 comparison against my extracted Duels SFX:

- **`punch` and `slash1` are BYTE-IDENTICAL** in Duels, SHS2 *and* SHS1 (SHS1 names it
  `sword1`). Two of thirteen Duels SFX are therefore attested in an independent,
  unencrypted, web-distributed Lut Games build.
- Seven more (`slash2 slash3 die1 die2 die3 deflect hitmetal`) have **identical sample
  counts and identical byte lengths** to their SHS2 namesakes but differ from byte 13 on
  (~70–89 % of bytes) — the same source recording, re-encoded.
- SHS1 → Duels rename map: `sword1/2/3 → slash1/2/3`, `hit1/2/3 → die1/2/3`.

This does not close web-audio parity, but it means "all audio must carry an Android v0.682
label" is too strong for at least `punch` and `slash1`.

### H5 · The screen-shake trigger set is 8 sites, not 5

"Fully catalogued" over-claims. `grep -rn "startShake(" ` returns:

```
MCSPlayer.as:911 (12) · :946 (24) · :4180 (12)        ← listed
Trap_CrusherColumnAuto.as:90 (6) · Marker_RumbleTrigger.as:44  ← listed
Trap_CrusherBlockAuto.as:88 (6)                        ← MISSED
HeavenlySwordProjectile.as:76 (12)                     ← MISSED
StatsManager.as:3535  startShake(val)                  ← MISSED — data-driven duration
```

Algorithm, default `shakeAmt = 30`, `Math.min` taper and the snap-back are all confirmed
verbatim, as is the shake running outside the `STATE_FROZEN` gate (`StageManager.as:826-830`).

---

## PART 4 — HONEST STILL_UNHELD: upheld

`web-audio-parity-unheld` is **correct and I verified it independently**. All 27 web
bindata blobs are XML (`ef bb bf 3c 3f 78 6d 6c`), one GIF89a and five plain-text name
tables — **zero** FWS/CWS/ZWS signatures. And no `DefineSound` tag exists in
`shs3_payload_decoded.swf`, `shs3.swf`, `shs3preloader.swf`, or either binarydata SWF.
The Android build has exactly five CWS blobs; the web build has none. This is the right
answer and it should not be marked down.

Two riders inside it are wrong, though:

1. *"no test in the suite pins any finding in this survey"* — **false.**
   `tests/viewport.test.ts` pins the 800/480/690 resize routine; 8 tests pass.
2. *"49 named backgrounds in BGResource"* — mis-attributed. `120_Mobile_BGResource`'s
   SymbolClass has **67** entries; the 49 figure belongs to `123_Mobile_BGData`.

---

## SCORE

The surveyor proposed **84**. On my reading the audio/VFX/gore/compositing work is worth
it, but the animation model carries three material errors (rig size, loop flag, hit-reaction
uniformity) that a rebuild would act on, and the aspect-ratio claim re-opens something that
was already contract + test. **I would land at 76**, with the four refutations fixed as the
condition for going higher.
