# t1-overturns-09 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-09.json` — **24 claims, 24 judged, 0 skipped.**
Every verdict below rests on an artifact I opened myself in this session. Where I could not
reproduce a number, I say so.

**Headline:** 22 of 24 survive. **2 are REFUTED** — both in the aspect-ratio cluster, and both
for the same reason: a code-derived scale model that the frame itself contradicts.
**THE FRAME WINS, and it wins here.**

---

## The one measurement that decided the aspect-ratio cluster

`reference/decompiled/shs3_android/scripts/BattleUI.as:133` fixes the skill-slot pitch at
exactly **60 game px**:

```
133:            skillSlotButton.x = 760 - i * 60;
```

That is a hard, unit-bearing ruler inside the HUD. I measured the three slot boxes in
`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (dark-run centroids in the clean band
y = 965..980, x = 1400..1880, luminance < 70 over > 80 % of the band):

| box | frame-x run | centre |
|---|---|---|
| left (empty)   | 1457..1550 | **1503.5** |
| middle ("2")   | 1589..1691 | **1640.0** |
| right ("3")    | 1726..1828 | **1777.0** |

Pitch = 136.5 and 137.0 frame px for 60 game px ⇒ **scale 2.275–2.283**.

Predicted centre of slot i = 0 (game x = 760):

* model **s = 2.27, x0 = 52** (width-fit, video pillarbox only) → 1777.2 — **0.2 px off**
* model **s = 2.25, x0 = 60** (height-fit + 8 px engine inset) → 1770.0 — **7.0 px off**

The filmed session ran the **fit-width** branch. There is no 8 px in-engine inset in this frame.
`x_game = (x_frame − 52) / 2.27`.

I also independently re-decoded every SWF header under `reference/` (5-bit nbits, four signed
twips fields, /20):

```
shs3_payload_decoded.swf          CWS v17  [0,16000,0,13800]  800.0 x 690.0  24.0 fps  6 frames
shs3_android_payload_decoded.swf  CWS v26  [0,16000, 0,9600]  800.0 x 480.0  24.0 fps  6 frames
shs3.swf / shs3preloader.swf      CWS v10  [0,16000,0,13800]  800.0 x 690.0
shs3_binarydata_9_decrypted.swf   CWS v10  [0,16000,0,13800]  800.0 x 690.0
```

…and I found the **web** build's own resize handler, which nobody in this packet cited:

`reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:271-273`
```
271:          var _loc2_:int = 800;
272:          var _loc3_:int = 480;
273:          var _loc4_:int = 690;
```
byte-for-byte the same three constants as `shs3_android/scripts/GameEngine.as:269-271`.
**800 × 480 is the WEB build's own base canvas, not "the Android figure."**

---

## Verdicts

### HELD — the Focus/reload meter (claims 0, 1, 2)

`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249` — verbatim:
```
249:         this.§1t4415s0§ = 8 * 24;
```
`:95` declares it, `:3321-3323` clamps reload to it, `:1203-1205` increments reload by 1 per
frame. `§1t4415s0§` is maxreload: the Android twin `MCSPlayer.as:239` reads
`this.maxreload = 5 * 24;` in the identical position of the identical `initPlayer` body.
Dead zone verified at `§1t113s0§.as:328`:
```
328:         var _loc3_:Number = (param1 - 48) / (param2 - 48);
```
So web max = **192**, visible travel = **144 frames = 6.000 s**, and
`COMBAT_MEASUREMENTS.md:101` ("Rate 45.05 ± 0.30 px/s ⇒ empty→full 5.97 s (confirms 6.00 s)")
is verbatim and matches to 0.03 s. Rows f-5/f-6 are at `:589-590` as cited. **The build split is
real: 192 web / 120 Android.**

*One over-claim, minor:* claim 0 says 249 "is the ONLY assignment of maxreload in the web
bundle." It is not — `§1t4904s0§.as:77` assigns it too. Same value (`8 * 24`), so nothing
downstream moves; claim 1 gets this right.

### HELD — reach triple is a mastery-0 read (claim 3)

`§1t99s0§.as:3094 / :3105 / :3116` are verbatim as quoted. `§1t4417s0§` is `slashLength`:
`:3158` passes it to `§1t1541s0§.§1t10094s0§(...)`, the twin of
`MCSPlayer.as:3094 InputManager.setMaxDistance(this.slashLength)`. `§1t1523s0§.as:2347` is
verbatim, and `StatsManager.as:1917` names the term:
`var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;` ⇒ **asymptote 210 at DAN 0**. ✔

I also checked the half the claim asserts without a cite — and it holds.
`§1t99s0§.as:3255-3277` is the web `getDamage`:
```
3262:                _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);   Light   0.5 -> 0.9
3265:                _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);    Balanced 1.0 -> 1.2
3270:                _loc2_ = _loc1_ * 1.4;                                  Heavy    1.4 flat
3274:            return _loc2_ * 1.3 + this.§1t1243s0§;                      crit x1.3 at full reload
```
**0.9 / 1.2 / 1.4 IS the mastery-10 ceiling. 300/200/100 is not.** RR:155 is half-backwards
exactly as claimed — and RR:156 already contradicts RR:155 in the ledger's own text.

### HELD — slashUsage (claims 5, 6)

`§1t1523s0§.as:2350-2358` verbatim. Param 11 confirmed twice: `§1t99s0§.as:195`
`this.slashUsage = param11;`, and the Android signature `MCSPlayer.as:182 initPlayer(... ,
baseSlashLength, slashUsage, lightMastery, ...)`. `itemdata.xml:8044` is verbatim.
My counts: **106** `<slashusage>` rows, values `24 × 1, 72 × 70, 96 × 35` — the claimed
domain {24,72,96} → floored {48,72,96} is exact. Spend verified at `§1t99s0§.as:3302/3306/3310`
(÷2 / ×1 / ×1.5).

### HELD — the in-combat stance switch, and RR:158 FALLS (claims 7, 8, 9, 10)

`§1t99s0§.as:3048-3051` and `:3058-3080` verbatim. Cost verified at `:3160-3166`
(`this.§1t4414s0§ -= 48;` guarded by `StageManager.isBattle()`). Claim 9's extra assertion is
correct: **`maxreload / 6` does not occur anywhere in the web player class** — that is the
Android gate (`MCSPlayer.as:2977`), alongside an entirely different Android cost rule
(`:3098-3104`, `reload = maxreload/3` or `-= maxreload/6`).

The killing detail nobody in the packet cited — the web BattleUI's own button handler,
`§1t113s0§.as:468-479`:
```
470:          if(§1t1523s0§.§1t9586s0§().§1t4470s0§())
472:             §1t88s0§.instance.§1t1516s0§("Snd_smallClick");
473:             §1t1523s0§.§1t9586s0§().§1t4472s0§();
478:             §1t88s0§.instance.§1t1516s0§("Snd_error");
```
v0.717 ships a battle-UI stance button that plays an **error sound** when the Focus gate
refuses. RR:158 ("in-combat stance is HARD-LOCKED … models removed 2014 behavior") is dead.

### HELD — blocker ④ is wrong (claims 16, 17, 19)

I cropped `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` at (1380,920)-(1880,1080) ×3 and
(40,900)-(700,1080) ×2 and looked. Left to right in the slot strip: an **empty, unnumbered box
with a bright silver border**; a box marked **2** over a pale claw/fang icon; a box marked **3**
over a **gold up-arrow**. Bottom-left: a portrait bust inside a **red ring**, green **20/20**,
blue **26/26**, a brown **CANNOT CHANGE STANCE** plaque, a yellow **150% DAMAGE** line.

Code checks out: `BattleUI.as:501-511`, `SkillSlotButton.as:123-135`
(`:128 this.keypressText.text = "";`, `:129 this.shade.visible = false;`), `:275`
`battlemodebust.hitTestPoint → stanceButtonClick()`, `:374`
`battlemodebust.stancecolor1.gotoAndStop(num)`, `:192` bust MOUSE_OVER → showChangeStanceLabel.
Claim 17's slot maths is exact: `BattleUI.as:133 skillSlotButton.x = 760 - i * 60;` ⇒
i = 0 → 760 (key 3), i = 1 → 700 (key 2), i = 2 → 640 (empty, no numeral). That is precisely
the strip in the frame.

Two independent corroborations these claims did not have:
* `strings.json["IDS_Q50S3NODE1"]` = *"Your stance is indicated by the color of the circle
  around your portrait: Light stance - blue, Balanced stance - brown, Heavy stance - red."*
  The game's own tutorial says the portrait ring is the stance indicator.
* the **web** build wires it the same way — `§1t113s0§.as:482-485` (`setStanceColor` →
  `battlemodebust.stancecolor1`) and `§1t406s0§.as:944` (CLICK listener on the bust). The
  Android-only parity hole on these three claims is closed.

*Line slip, minor:* claim 16 attributes `skillSlotButton.visible = i < this.slotCount;` to
`:503`; it is `:501`.

### HELD — HUD behaviour and art (claims 15, 18, 21, 22, 23)

* **15** `BattleUI.as:245-256` verbatim. Parity hole closed by me: the web twin
  `§1t113s0§.as:312-317` and `:319-324` has the identical text + shadow + `bar.scaleX`
  pattern. Snap, not tween. (Pedantic: the class is not literally motion-free —
  `:427 this.hurtred.gotoAndPlay(1);` — but no bar is interpolated.)
* **18** `BattleUI.as:56, 98-100, 382-395` verbatim; `strings.json["45"]` = `Hit Combo`.
  My crop (1560,0)-(1920,200) ×3 shows a red brush **3** with a hard black offset shadow over a
  black **HIT COMBO** plaque. The residual STILL_UNHELD on the pop animation is honest and
  correctly localised.
* **21** I reproduced the geometry **exactly** with the claim's own colour keys:
  green `x 246..513, y 972..988`; blue `x 245..513, y 1000..1019`. Identical to the digit.
  Its game-px model (s ≈ 2.27, x0 = 52) is the one my slot-pitch ruler vindicates.
  Minor: it uses 2.268 in x and 2.257 in y where one uniform scale applies, and offsetY is
  unverified — but the numbers land within ~1 game px.
* **22 / 23** I opened the art. `PauseScreen_51/1.png` is 802×481 and visibly renders the
  草帽武士 kanji in white over a red brush **DUELS** with **GAME PAUSED** beneath.
  `skillSlotBG_755` frames 1-5 at 4× are: dark/olive, bright/olive, dark/black, **bright/black**,
  dark/olive — and frame 4 is pixel-for-pixel the empty highlighted slot in the duel frame.
  Bright-border bbox of frame 4 = **51 × 51** as claimed. Counts: `sprites` 827, `shs3_fla` 39,
  `shapes` 1822 — all exact. I re-measured **all fourteen** of claim 23's dimension/frame-count
  pairs (animatedBrush 371×166×8, chatTextBattle 437×212×2, CharSlot 267×50, MinimapIcon
  15×18×20, MinimapRoomIcon 20×30×17, speechbubble 137×110×6, skillnodeinner 64×64×7,
  QuestLogButtonBG 314×43×5, clanemblem 47×47×7, autoslashbutton 129×31×2, hurtred 800×480×7,
  stancecolor1 63×63×3). **Every one is correct.** This is the cleanest-cited claim in the packet.

### HELD — skill animation blob (claim 4)

`93_MCSCharacter_SkillsAnimationData.bin` is 338,096 bytes, UTF-8 with BOM, plain
`<animdata>` XML. My counts: **547** `<f>`, **8,351** `<n>`, **19** distinct bone ids — exact.
Every quoted `d=` is exact (`shunpo_start 4`, `shunpo_end 1`, `focus_start 8`, `focus_end 13`,
`cleave_start 9`, `cleave_end 14`, `cleave_pose 1`, `backthrow 39`, `backthrow_victim 36`), and
`d == len(children)` in **all** anims, not just the ones checked.

*Count error, minor:* there are **51** `<anim>` elements and 51 names, not 50. The claim also
omits `bullcharge_run`, `frontspin`, `backspin`, `fireball`, `spartakick_start/end`,
`punch_start/end`, `getup_front`. Its `ledger_text` is a section **heading**
(`REBUILD_READINESS.md:193 "### skills-meters — 33"`), not a proposition — so there is no
ledger sentence here to fall.

### HELD — piercing / critical are web-held (claim 12)

`ui_strings.txt:100` carries the quoted string verbatim. I went one better and grepped the web
payload export itself — `reference/extracted/payload.xml`, whose companion
`reference/decompiled/payload_export.log` shows the obfuscated `§1tNNNs0§` class names that
only the **web** build has:
```
$ grep -c "piercing dmg" reference/extracted/payload.xml   -> 1
$ grep -c "critical dmg" reference/extracted/payload.xml   -> 1
```
The build-parity hole genuinely does not exist. **But this does not overturn `RR:189`** — the
ledger line it names is a *Ready* line already asserting `crit 1.3×, Heavy def ×0.8`, which
`§1t99s0§.as:3274` and `:3286-3288` confirm. The claim **supports** the ledger; nothing falls.

### HELD, overturn NOT upheld — claims 13, 20

Both rect facts are true; I re-decoded the headers myself. But `RR:117` does **not** fall:
`§1t1540s0§.as:271-272` makes **800 × 480 the web build's own base canvas**, with 690 reached
only when `newAspectRatio <= 800/690` (`:277-281`). Claim 20's reading — a **two-mode layout**,
480 with the bar off on wide viewports, 690 with a game-drawn panel on narrow ones — is the
correct one, and `§1t406s0§.as:427 this.§1t6500s0§.y = 480;` (the web friend panel parked
directly below the play area) confirms it.

*Material error in claim 13's lane impact:* "the android build does not ship the bar at all"
is **false**. Android ships the whole friend panel — `GameEngine.as:282, :1159, :1331`,
`FriendBox.as:212`, `InventoryUI.as:796/801/806/935/1235/1248`.

---

## REFUTED

### ✗ claim 11 — `stage/web-native-canvas-is-800x690-not-800x480` — MATERIAL

The bytes are right and I verified all of them. The **conclusion is wrong**.

* "*that is the ANDROID figure*" — no. The **web** payload's own `resizeHandler`
  (`§1t1540s0§.as:271-272`) declares `originalWidth = 800; originalHeight = 480;`, identical to
  `shs3_android/scripts/GameEngine.as:269-270`. 800 × 480 is the web build's base canvas.
* "*every HUD x-fraction derived from a 5:3 assumption needs re-checking against 800 × 690
  (1.159:1)*" — actively harmful. The **width is 800 in both modes**; 690 only ever replaces
  480 on the *vertical* axis, and only when the viewport is narrower than 1.159:1 — which is
  not the case in either longplay. Re-deriving x-fractions against 1.159:1 would introduce the
  error it claims to fix.
* Cite slip: `REBUILD_READINESS.md:118` is a **blank line**. The sentence is at `:117`.

The SWF document-rect observation is real and worth keeping — claim 13 states it correctly and
claim 20 explains it. Claim 11's framing is the part that must not enter the ledger.

### ✗ claim 14 — `ui-hud/aspect-ratio-truth-closed-from-source` — MATERIAL

The code cite is verbatim (`GameEngine.as:267-306`, with `StatsManager.stageScale…` at
`:307-310`, one line past the stated range), the mechanism identification is right, and the
1816 × 1080 content region is real — I measured the pillarbox myself at
`x 52..1867, y 0..1079`.

But the **delivered number is wrong**, and the frame it cites is what kills it. Against the
60-game-px slot pitch of `BattleUI.as:133`, the measured pitch is **136.5–137.0 frame px
⇒ s = 2.275–2.283**. The claim's `s = 2.25` predicts 135.0 — off by 2 px per slot and
**7.0 px** at slot i = 0 (predicted 1770.0, measured 1777.0). The competing width-fit model
(`s = 2.27, x0 = 52`) predicts **1777.2** — 0.2 px.

**STANDING INVARIANT, SAID OUT LOUD: the measurement doc and the frame disagree, and THE FRAME
WINS.** The filmed session ran the **fit-width** branch, not the height-fit branch. There is no
8 px in-engine inset, `x_game = (x_frame − 52)/2.27`, and the claim's rider that this "corrects
claim 7's scale model" is backwards — claim 7's model was the right one.

The unstated assumption that broke it: *recorded 1816 × 1080 region == browser stage*. It is a
YouTube upload of a browser window; the branch the engine takes depends on the **browser's**
aspect, which the code cannot tell you. So ledger blocker ① does **not** close from source
alone — `resizeHandler` gives the mechanism, the frame has to supply the branch.

Re-file the mechanism half. It is genuinely valuable. Do not ship the 2.25.
