# CITE LENS — art-anim-audio-feel

Blind critic. Every verdict below rests on an artifact **I** opened, decoded, or measured
myself. Nothing here is taken from the surveyor's word.

**Headline: 14 of 17 claims survive, and several survive harder than the surveyor proved
them. 3 are refuted — all 3 for the same failure mode: a correct local artifact
generalized into a global rule the payload contradicts a few lines away.**

Tooling I ran (scratchpad only, no repo file touched outside this journal):
- an independent re-implementation of the payload XOR/swap transform (I did **not** use
  `reference/tools/payload_decode.py`'s hard-coded key; I derived each key as `buf[3] ^ 17`)
- a from-scratch SWF tag walker (header rect, framerate, DefineSound, SymbolClass,
  DefineFontName, recursive DefineSprite descent, PlaceObject3 flag decode)
- `afinfo`, `md5`, PIL/numpy for the frame measurements

---

## Part 1 — what I reproduced byte-for-byte

### The audio decode is real. S0-5 is dead.

Stage-0 S0-5 said "ffdec cannot open them… you may NOT claim audio is recovered." I
re-derived the transform myself and all five CWS blobs open:

```
113_Mobile_MusicResource.bin key=117 sig=CWS ver=17 declaredLen=1402685 INFLATED=1402677
115_Mobile_SHS3Resource.bin  key=104 sig=CWS ver=17 declaredLen=1040857 INFLATED=1040849
120_Mobile_BGResource.bin    key=103 sig=CWS ver=17 declaredLen=4412348 INFLATED=4412340
122_Mobile_SoundResource.bin key=111 sig=CWS ver=17 declaredLen=29631   INFLATED=29623
124_Mobile_ImageResource.bin key=109 sig=CWS ver=17 declaredLen=1908237 INFLATED=1908229
```

The surveyor's `key=111 / declared 29,631 / inflates to 29,623` is exact. The SymbolClass
table I parsed is character-for-character what they quoted, all 13 pairs in the same order.
I extracted `slash1.mp3` and ran `afinfo`: `1 ch, 11025 Hz, .mp3 … 576 frames/packet`,
`estimated duration: 0.572000 sec`. Verbatim match.

All 13 music durations reproduce exactly — six overworld stems at 79.872 s, four dungeon
stems at 45.760 s, levelup 29.900, lose 3.744, gangnam 3.848.

### Line-number discipline was excellent

I checked **every** `.as` line number cited in this survey by `sed`-ing the exact range.
All of the following are exact, not approximate:

`MusicManager.as` 140 / 206 / 279 / 301 / 329 · `SoundManager.as` 114-173 / 187-219 /
194 / 197 / 200 / 221-253 / 255-279 / 261 / 274 · `ColorCode.as` 12 / 47 / 110-119 ·
`StageManager.as` 162 / 212 / 826-830 / 903 / 916 / 926 / 1096 / 1101 / 1200 / 1225-1227 ·
`MCSPlayer.as` 911 / 946 / 3689-3692 / 3714-3716 / 3719 / 4180 ·
`Marker_RumbleTrigger.as` 9-11 · `Trap_CrusherColumnAuto.as` 90 ·
`EnemyClone.as` 162/207/227/392/448 · `EnemyGoblin.as` 354-356 / 358 / 360-362 / 386 ·
`BloodParticleEmitter.as` 18-26 · `StatsManager.as` 30 / 314 · `Mobile.as` 117 ·
`MCSCharacter.as` 1309-1338 / 1315 / 1334 · `FrameNodeData.as` 27-75 / 60-70 ·
`AnimData.as` 41 · `WhiteOutFX.as` 22 · `bladeslashfx.as` `addFrameScript(4,this.frame5)`.

Not one mis-cite in that whole set. That is unusual and worth saying.

### I strengthened three claims

**`no-blend-modes` — corroborated through a channel the AS3 grep cannot see.** A
`blendMode` can also be set at authoring time in the SWF binary via the PlaceObject3 blend
flag, which never appears in decompiled ActionScript. I decoded the flag byte on every
PlaceObject3 tag, recursing into DefineSprite bodies:

```
115_SHS3Resource : PlaceObject2=2032 PlaceObject3=12   blendFlagSet=0 sprites=1949
120_BGResource   : PlaceObject2=2105 PlaceObject3=54   blendFlagSet=0 sprites=552
124_ImageResource: PlaceObject2=4653 PlaceObject3=1473 blendFlagSet=0 sprites=94
```

1,539 PlaceObject3 tags, **zero** with the blend-mode flag set. The answer really is
"normal alpha only", now from two independent directions.

**`24fps-keyframe-stream` — the surveyor measured 2 blobs; I measured all 19.** Splitting
on `<anim …>` headers across every `<animdata>` blob: **487 animations checked, 0
mismatches** between `@d` and the `<f>` child count. Their four samples (light_stance 1/1,
light_run 9/9, walk 20/20, death 38/38) are exact. And the code-side latch mechanism is
tighter than they said: `updateAnimation` gates on `currentAnimationDuration`, while
`updateFrame` guards on `frameList.length` — so once `AnimData`'s `duration += 10` pushes
the counter past the last authored frame, `setPosition` simply stops being called and the
final pose holds. That is precisely the described mechanism.

**`android-web-byte-identity` — my own MD5 run reproduces it exactly.** 14 of 18
MCSCharacter animation blobs identical, 21 identical overall, differing set = Ogre, Skills,
Guardian, HumanSpear. `99_MCSCharacter_HumanAnimationData.bin` and `108_1t4635s0.bin` both
`bcfd658e79fafb41f52431afb7d10622`. Exact.

**`web-audio-parity-unheld`** is an honest and correct STILL_UNHELD. I dumped the first 8
bytes of all 27 web bindata files: 19 UTF-8-BOM XML, 2 plain XML, 1 GIF89a, 5 name tables.
No FWS/CWS/ZWS anywhere. `StatsManager.as:30 clientVersion:Number = 0.682` confirmed.

### The frame

I made the surveyor's crop from scratch — `reference/frames/duel_dense/Nr4fQstqHDM_432.0.png`
(1920×1080), crop (900,600)-(1300,900), ×3 Lanczos — and looked. Visible: a wide hard-edged
blue wedge sweeping left, white double stripe along its length, solid black outline, tapering
to a point, **fully occluding** the bamboo/rock background and grass behind it. Fighter in
straw kasa, navy haori with red trim, cream patterned obi, white hakama, all bold flat-vector
outline. Bare-torso enemy felled at his feet, kasa on the ground, no blood and no severed limb
at this instant. The description is accurate down to the double stripe.

---

## Part 2 — the three refutations

All three share a shape: the cited artifact is real and quoted correctly, but a **local**
fact is asserted as a **global** rule, and the payload disproves the generalization within a
few lines of the quoted text.

### R1 — `gore-system-not-one-variant`: 40/20/20/20 is the *goblin* rule (MATERIAL)

The cite claims the selection rule is "mirrored in every `Enemy*` class". It is not. Only
three classes carry their own gore branch — `EnemyGoblin`, `EnemyGoblinThrower`,
`EnemyZombie`. The other 31 `Enemy*` classes extend `NPC`, and `NPC.as:898
override public function die()` runs a **different** dice:

```
NPC.as:1005   dice = Math.random() * 7;
  <=1  ENEMYDEATH              2/7
  ==2  DEATH_FORWARD           1/7   <- absent from the goblin path entirely
  ==3  DEFEATED2 (if !isRedFreeze)  1/7   <- absent from the goblin path entirely
  ==4  ENEMYDEATHNOHAND        1/7
  ==5  DEATHINHALF             1/7
  else ENEMYDEATH + createFlyingWeapon() + createFlyingHat() + hair reveal   1/7
```

This is the death distribution for every human opponent — which is the entire game. The
frame I opened shows a *human* enemy felled, not a goblin. A recreation built to 40/20/20/20
would ship the wrong distribution and would be missing two death animations and the
flying-weapon/flying-hat beat (which is the ledger's own "death sword-detach" line, now
sourced).

Everything else in the claim holds and is verified: 8 death anims in `108_1t4635s0.bin`
with `deathnohand`=25, `deathnohead`=31, `deathinhalf`=28 exactly; the 50% mirror coin flip;
`StatsManager.as:314 censored:Boolean = false`.

### R2 — `21-node-rig-held`: the rig is not 21 nodes (MATERIAL)

The `487` count is exact, `FrameNodeData` is quoted correctly, and the `118_1t4645s0.bin`
head is verbatim. But **21 is not the rig size on any reading**:

- `MCSCharacter.as:120  internal var partListLength:int = 22;` with
  `:141  for(var i:int = 0; i <= this.partListLength; i++)` → **23** part MovieClips
- `MCSCharacter.as:10-62` declares **27** named parts, `PART_l_hand`=0 … `PART_r_knee`=26
- `MCSWolf.as:13  partListLength = 25;` → **26** for wolves
- the very blob cited, `118_1t4645s0.bin`, writes **19** distinct node indices:
  `[0-7, 9-16, 18-20]` — 8 (`crotch`) and 17 (`hat`) never appear

21 appears to come from counting the contiguous index range 0..20 in one blob, which
includes two indices that blob never writes. A recreation building a 21-slot rig loses
`prop2`, `prop3`, both shoulders and both knees.

### R3 — `aspect-ratio-frame-wins`: 800×690 is a named layout, not chrome (MATERIAL)

This one invokes the standing FRAME-WINS invariant, so it needs to be right, and it isn't.
The claim quotes `GameEngine.as` lines 269 and 270 and stops. Line **271** is:

```
269   var originalWidth:int = 800;
270   var originalHeight:int = 480;
271   var originalHeightWithBar:int = 690;          <- omitted from the quote
...
275   if(newAspectRatio <= originalWithBarAspectRatio)
277      originalAspectRatio = originalWithBarAspectRatio;
278      originalHeight = originalHeightWithBar;     <- omitted from the quote
279      StatsManager.stageShowingFriendBar = true;
```

800×690 is `originalHeightWithBar` — the **friend-bar layout**, an explicitly named second
canvas the engine switches to when the window is narrower than 800/690. It is not "container
chrome". More importantly: **there is no frame-vs-doc disagreement here at all.** The payload
declares both heights; the SWF document rect was authored at the with-bar height; the frame
merely shows a session running in the wide mode. Invoking "THE FRAME WINS over the SWF
document rect" misapplies the invariant to a conflict that does not exist.

Two further problems:
- **The arithmetic doesn't close.** I re-measured the content box and reproduced their
  numbers (`thr 25/40/60 → cols 52..1867, w 1816, aspect 1.681481`; their "thr 12" label is
  one pixel off, mine gives 1817 there — trivial). But 1816/1080 = **1.6815** and 800/480 =
  **1.6667**. A true 800×480 surface letterboxed to 1080 tall would be **1800** px wide, not
  1816. The frame does not equal 800×480; it rules out 1.159 and lands ~0.9% off 5:3.
- **The letterbox math is Android-only.** `grep originalWidth\|originalHeight
  reference/decompiled/shs3_payload/scripts/` returns **zero hits**. The formula is applied
  to a web capture without the Android-parity caveat this same survey rightly insists on for
  audio.

What survives: 800×480 is the play-field canvas and 800×690 is the friend-bar layout, both
as payload constants. The practical instruction — re-base HUD fractions on 800×480 — stands.
The reasoning and the frame-wins framing do not.

---

## Part 3 — new findings the surveyor missed

- **`OverworldHUD.as:1404` resolves their un-reconciled CAUTION.** The `hit-reaction-12-ticks`
  claim flags that the HUD's "150% DAMAGE" "reads as the stance modifier". It doesn't. It is
  a consumable buff: `updateBuff(bufftype,duration)` → `bufftype == StatsManager.BUFF_ATTACK`
  → `buffstr = "150% DAMAGE"`, one of a family with "150% XP", "150% DEFENSE", "150% SPEED",
  "200% AP REGEN". Corroborated by `strings.json` id 4132: *"Eat this potato to get the 150%
  Damage buff."* Nothing to conflate.
- **The stance rock-paper-scissors multiplier is ×1.2, not ×1.5.** `MCSPlayer.as:3703
  damage *= 1.2;` for light>balanced>heavy>light, with the damage popup recoloured white
  (`damagetextcol = 16777215`). Distinct from the ×1.5 behead multiplier at `:3716`.
- **Screen-shake amplitude is effectively inert.** `shakeAmount = Math.min(screenShakeAmt,
  screenShakeCounter)` and every in-game call site passes a duration ≤ 24 < the default
  amt 30 — so `shakeAmount` is always the remaining counter, a pure linear ramp-down. The
  "default amplitude 30" is only reachable via `Marker_RumbleTrigger`'s data-driven `amt`.
- **The trigger set is 8 sites, not 5.** Add `HeavenlySwordProjectile.as:76` (12),
  `Trap_CrusherBlockAuto.as:88` (6), `StatsManager.as:3535` (data-driven `val`).
- **The victory freeze normally ends at 5.0 s, not 6.0 s.** `redFreezeCounter` starts at
  `24*6`=144 and the exit fires at `counter == 24` (120 ticks elapsed = 5.0 s) unless
  `SHEATHESWORDCHIBURI` is still playing, which extends it to `counter == 0` = 6.0 s. The
  claim's own quote of `:916` shows this; the headline number is the ceiling, not the norm.
- **Minor count slips, none load-bearing:** "559 client classes" is neither 553 (top-level
  `.as`) nor 970 (including `mx/`); "17 presets" is 18 `presetsArray` slots, 17 non-empty;
  the score rationale says "49 backgrounds in BGResource" but per S0-4 the 49 are in
  `123_Mobile_BGData` — `120_Mobile_BGResource` holds 552 sprites.
