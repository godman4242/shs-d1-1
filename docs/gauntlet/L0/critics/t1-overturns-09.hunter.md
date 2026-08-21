# t1-overturns-09 — HUNTER LENS review

Packet: `docs/gauntlet/L0/worklist/t1-overturns-09.json` — 24 findings, all judged, none skipped.
Every verdict below rests on an artifact I opened in this session. Nothing was taken on the
strength of another agent's prose (`critics/*.md` and `sources/*.md` were not opened).

---

## 0. Symbol map I established myself (this is what makes the web bundle readable)

The web payload is obfuscated; the Android payload is not. I proved the mapping by structural
isomorphism, not by guessing:

| web symbol | android name | proof |
|---|---|---|
| `§1t99s0§` | `MCSPlayer` | `§1t99s0§.as:249` ↔ `MCSPlayer.as:239` in identical init sequence |
| `§1t4904s0§` | `EnemyClone` | `§1t4904s0§.as:75-78` ↔ `EnemyClone.as:75-78` verbatim structure |
| `§1t113s0§` | `BattleUI` | `§1t113s0§.as:320-323` ↔ `BattleUI.as:245-256` (hp text/shadow/scaleX) |
| `§1t1523s0§` | `StatsManager` | `§1t1523s0§.as:36 = 0.717` ↔ `StatsManager.as:30 clientVersion = 0.682` |
| `§1t1525s0§` | `StageManager` | `§1t99s0§.as:3086` ↔ `MCSPlayer.as:3022` (`isBattle()` → `stopMoving`) |
| `§1t1540s0§` | `GameEngine` | `§1t1540s0§.as:269-314` ↔ `GameEngine.as:267-312` line-for-line |
| `§1t4415s0§` | `maxreload` | both assigned once in Player and once in Clone, same slots |
| `§1t4417s0§` | `slashLength` (REACH) | `§1t99s0§.as:3094/3105/3116` ↔ `MCSPlayer.as:3030/3041/3052` |
| `§1t4420s0§` | `baseSlashLength` | same switch, same operand |
| `§1t4422s0§ / §1t4423s0§` | `balancedMastery / heavyMastery` | same switch positions |

**BUILD VERSIONS CONFIRMED FIRST-HAND.** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36`
`public static var §1t9323s0§:Number = 0.717;` — the obfuscated bundle IS web v0.717.
`reference/decompiled/shs3_android/scripts/StatsManager.as:30` `clientVersion:Number = 0.682`.
So every §1t…§ cite in this packet is a WEB v0.717 cite, and the build-parity caveat in §0 does
not apply to them.

---

## 1. The skills-meters cluster (#0, #1, #2, #5, #6) — HELD, with one nit

Everything numeric in this cluster reproduces exactly.

- `§1t99s0§.as:249` — `this.§1t4415s0§ = 8 * 24;` ✔ (192 frames)
- `§1t4904s0§.as:77` — `§1t4415s0§ = 8 * 24;` ✔ (the clone; the ONLY other assignment)
- `shs3_android_payload/scripts/MCSPlayer.as:239` — `this.maxreload = 5 * 24;` ✔ (120, Android)
- `§1t113s0§.as:328` — `var _loc3_:Number = (param1 - 48) / (param2 - 48);` ✔ → dead zone 48,
  visible travel = 192 − 48 = **144 frames**
- SWF framerate **24.0 fps**, decoded by me from `reference/decrypted/shs3_payload_decoded.swf`
  → 144/24 = **6.000 s** visible, 192/24 = **8.000 s** total
- passive fill `§1t99s0§.as:1203-1205` — `++this.§1t4414s0§` once per frame
- stance-switch cost `§1t99s0§.as:3162` — `this.§1t4414s0§ -= 48;` (flat, inside `if(isBattle())`)
- per-slash spend `§1t99s0§.as:3302/3306/3310` — `slashUsage / 2` (Light) · `slashUsage`
  (Balanced, 12224) · `slashUsage * 1.5` (Heavy, 12223)
- `§1t1523s0§.as:2350-2358` — slashusage read off the weapon with a hard floor of 48 ✔ verbatim
- `reference/extracted/itemdata.xml:8044` — `\t\t<slashusage>72</slashusage>` ✔ exact
- I counted the whole file myself: **106** `<slashusage>` rows, values `{24:1, 72:70, 96:35}` →
  effective domain after the floor is **{48, 72, 96}** ✔ exactly as claimed

**The 120 mis-cite is real and I confirmed the mechanism.** In the web build `5 * 24` exists at
`§1t99s0§.as:55` as `§1t12234s0§`, but it feeds `§1t4440s0§` (a separate countdown, set at :266,
decremented at :1246, cleared at :2935) — it is NOT maxreload. A survey that grepped `5 * 24`
and called it the Focus max was reading a different timer.

**NIT (#0 only, minor):** "it is the ONLY assignment of maxreload in the web bundle" is not true —
there are two (`§1t99s0§.as:249` and `§1t4904s0§.as:77`). Both are `8 * 24`, so the number is
untouched. Claim #1 states this correctly.

**#6's overturn is inflated.** Blocker ③ names *max / fill / switch-cost*. slashUsage is the
per-slash **spend** — a fourth numeric the sentence does not name. ③ does fall, but on #0's max,
#2's fill and the stance cluster's flat-48, not on #6.

**#2's overturn target is not in REBUILD_READINESS.md at all.** Its `ledger_text` is
`docs/research/fidelity/COMBAT_MEASUREMENTS.md:590` (row f-6), which I opened. Row f-6's *number*
(≈5.9 s from 45.5 px/s) is **confirmed**, not falsified: the code gives 6.000 s of visible travel
and `COMBAT_MEASUREMENTS.md:101` already reads "45.05 ± 0.30 px/s ⇒ empty→full 5.97 s (confirms
6.00 s)". Only the *confidence label* changes. Nothing in REBUILD_READINESS.md falls.

---

## 2. #3 reach-triple — HELD, and it is the sharpest correction in the packet

I proved `§1t4417s0§` is **reach**, not damage, three ways:

1. Android names it: `MCSPlayer.as:3030` `this.slashLength = this.baseSlashLength * 1.5;`
2. It is used spatially: `§1t99s0§.as:5007` `_loc2_ = _loc3_ - this.§1t4417s0§ / 2;`,
   `:5032-5050` (`± §1t4417s0§ * 2/3`, `± /3`), `:5091` `/ 20`.
3. Damage is a **separate** function with the **mirrored** triple —
   `§1t99s0§.as:3261-3270`:
   - `case §1t12220s0§: _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);`  (Light dmg 0.5→0.9)
   - `case §1t12221s0§: _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);`   (Bal  dmg 1.0→1.2)
   - `case §1t12222s0§/12223/12224: _loc2_ = _loc1_ * 1.4;`                      (Heavy dmg 1.4 FLAT)

Reach, `§1t99s0§.as:3094/3105/3116` (+ floor 100 at `:3117-3119`):
Light `× 1.4` FLAT · Balanced `× (1 + 0.02·m)` · Heavy `× (0.5 + 0.04·m)`, base from
`§1t1523s0§.as:2344-2348` → `120 + floor((90 + 5·dan)·SPD/(20+SPD))`, asymptote **210** at dan 0.

At mastery 0 that is **294 / 210 / 105** ≈ the wiki triple 300/200/100.
At mastery 10 it is 294 / 252 / 189 — nothing like 100.

**So REBUILD_READINESS.md:155 is half-backwards.** The *damage* triple 0.9/1.2/1.4 IS a mastery
ceiling (confirmed above). The *reach* triple 300/200/100 is a **mastery-0 base**. The line's own
next sentence ("Heavy's *reach* also scales ×0.5→×0.9") already contradicts its bolded claim —
the finding caught a sentence that was internally inconsistent.

Nit: "~294/252/189" assumes mastery max 10 and the SPD→∞ asymptote; RR:158 elsewhere says
mastery-**9**, which would give 294/248/185. Direction and magnitude are unaffected.

---

## 3. The stance cluster (#7, #8, #9, #10) — HELD, and I found the decisive artifact none of
them cited

All four quote `§1t99s0§.as:3050` (`return this.§1t4469s0§() && this.§1t4414s0§ >= 48;`) and
`:3060-3062` (`if(this.§1t4414s0§ < 48) return;`) — verbatim, verified. The cycle at
`:3064-3079` touches only `§1t12220s0§ → §1t12221s0§ → §1t12222s0§ → §1t12220s0§`; Dual and
Reversed are unreachable ✔.

**What all four missed, and what actually kills RR:158:** the *BattleUI itself* wires the
in-combat click. `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:468-479`:

```
468:      internal function §1t5207s0§() : *
470:         if(§1t1523s0§.§1t9586s0§().§1t4470s0§())          // canChangeStance(): reload >= 48
472:            §1t88s0§.instance.§1t1516s0§("Snd_smallClick");
473:            §1t1523s0§.§1t9586s0§().§1t4472s0§();           // nextStance()
478:            §1t88s0§.instance.§1t1516s0§("Snd_error");      // refusal beep
```

and the cost is charged **only in battle** — `§1t99s0§.as:3160-3166`:
`if(§1t1525s0§.§1t9948s0§()) { this.§1t4414s0§ -= 48; ... }` where `§1t9948s0§` = `isBattle()`
(proved by `§1t99s0§.as:3086` ↔ `MCSPlayer.as:3022`).

That is a **live, Focus-gated, in-combat stance switch in web v0.717, with its own refusal sound**.
REBUILD_READINESS.md:158 says the exact opposite twice ("HARD-LOCKED in v0.717"; "The
recreation's Focus-gated in-combat switch models **removed 2014 behavior** … the *in-combat*
switch is a recreation divergence"). Both clauses are false. **Overturn upheld, decisively.**

**#9's extra claim is also true and I checked it:** the Android gate is `reload < maxreload / 6`
(`MCSPlayer.as:2977`) = 20; the web gate is a literal 48 and 192/6 = 32 ≠ 48, so an
Android-derived `maxreload/6` gate does not exist in the web player class.

**Caption timing.** `§1t113s0§.as:111` builds the zero-fill caption as
`"<font color='#BBBBBB'>" + getString(960) + "</font>"`, and `:336-343` shows it iff the bar
fraction is 0, i.e. iff reload ≤ 48 — the exact frame the gate opens. I cropped
`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` at (40,900)-(700,1080) upscaled 2.4× and the
"CANNOT CHANGE STANCE" plaque is rendered in **grey**, matching `#BBBBBB`, on a zero-fill brown
track. Honest limit: `docs/gauntlet/L0/index/strings.json` has **no entry "960"** (it is the
Android v0.682 table), so id 960 → "CANNOT CHANGE STANCE" is strongly corroborated but not
byte-held. I flag it rather than bank it.

**Structural note for the rewriter:** #7/#8/#9/#10 are four near-duplicates of one claim against
one sentence. They should be merged before the count of "overturns" is taken seriously.

---

## 4. The stage-rect cluster (#11, #13, #14, #20) — one REFUTED, three stand but only #14
actually overturns anything

I wrote my own SWF header decoder (`nbits = byte[0]>>3`, four signed twips fields, ÷20) and ran
it on every SWF under `reference/`:

```
shs3_payload_decoded.swf            CWS v17  rect [0,800,0,690]  24.0 fps  6 frames
shs3_android_payload_decoded.swf    CWS v26  rect [0,800,0,480]  24.0 fps  6 frames
shs3.swf                            CWS v10  rect [0,800,0,690]  24.0 fps  2 frames
shs3preloader.swf                   CWS v10  rect [0,800,0,690]  24.0 fps  2 frames
shs3_binarydata_9_decrypted.swf     CWS v10  rect [0,800,0,690]  24.0 fps  1 frame
```

Every number in #11 and #13 reproduces. **The bytes are not in dispute.**

**#11 is REFUTED anyway, and the error is material.** Its load-bearing sentences are
"the web v0.717 native stage is 800 x 690, **not** 800 x 480" and "800x480 … **that is the
ANDROID figure**". Both are false:

- `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:271-273` — the **web** resize handler:
  `var _loc2_:int = 800; var _loc3_:int = 480; var _loc4_:int = 690;` — 480 is `originalHeight`,
  690 is `originalHeightWithBar`.
- `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104,106` — the **web** defaults:
  `stageWidth:int = 800` / `stageHeight:int = 480`.
- `reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:388` — the **web** legality check:
  `stageWidth == 800 && (stageHeight == 480 || stageHeight == 690)`.
- The **web** payload's own art is 480 tall: `PauseScreen_51/1.png` = 802×481,
  `hurtred_32/1.png` = 800×480. A full-stage pause overlay on a 690-tall native canvas would be
  690 tall. It is not.

800×690 is the SWF **document rect** — the maximum canvas that reserves room for the friend bar.
The game's native canvas is 800×480. REBUILD_READINESS.md:117 and :171 stand exactly as written,
including the operative half ("HUD x-fractions measured off 16:9 video may be pillarbox-wrong"),
which #14 goes on to *confirm*. A builder who followed #11 would lay out a 690-tall canvas and
every y-coordinate in the HUD would be wrong.

**#13 stands as written but overturns nothing.** Its `text` — "the two builds literally ship
different SWF document rects" — is exactly true and I reproduced it. It does not claim the ledger
figure is Android. Two flaws worth logging: `artifact_class` **A3 is wrong** (this is a self-run
byte decode, i.e. A2 — there is no test in the suite that does this), and its `lane_impact`
states "the android build does not ship the bar at all", which is false —
`shs3_android/scripts/GameEngine.as:271,277-283` has `originalHeightWithBar = 690` and calls
`OverworldHUD.instance.friendpanel.init()`.

**#20 stands as written but overturns nothing.** `GameEngine.as:271` and `:277-283` verified
verbatim. Its own conclusion — a two-mode layout, "800x480 with the friend bar off (wide
viewports, **which is what both longplays record**)" — *confirms* RR:117 for exactly the frames
every HUD measurement was taken from. Its build-parity hole (an Android cite asserting web
behaviour) I closed myself: the web build has the identical handler at `§1t1540s0§.as:269-314`.

**#14 is the best finding in the packet and its overturn holds.** Blocker ① asks a question
("5:3 native → are x-fractions pillarbox-wrong?") and prescribes "read `stage.stageWidth` in a
build" — a method §0 says is impossible. The answer is in source. I verified the whole chain:

- `GameEngine.as:267-312` verbatim (and `§1t1540s0§.as:269-314`, the web twin).
- I re-measured the frame myself, not from the doc:
  `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, per-column max over RGB, threshold 18 →
  **non-black columns 52 … 1867 = 1816 px wide, rows 0 … 1079 = full height.**
- newAspectRatio = 1816/1080 = 1.6815; originalWithBarAspectRatio = 800/690 = 1.1594 →
  friend bar **off**; originalAspectRatio = 800/480 = 1.6667 < 1.6815 → **else** branch →
  `newScale = 1080/480 = 2.25`, `offsetX = (1816 − 1800)/2 = 8`, `offsetY = 0`.
- So `x_game = (x_frame − 60)/2.25`, `y_game = y_frame/2.25`. Exactly as claimed.

Note that #14 *affirms* the ledger's 5:3 premise while closing the question — which is precisely
why #11's "not 800x480" framing is the wrong reading of the same evidence.

---

## 5. Blocker ④ (#16, #17, #19) — the ledger is factually wrong and the frame says so

I cropped `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` at (1380,920)-(1880,1080)
upscaled 3× and at (40,900)-(700,1080) upscaled 2.4× and looked.

Slot strip, left → right: **an empty box with a bright cream/silver border and NO numeral**; a
box numbered **2** holding a pale claw/fang icon; a box numbered **3** holding a **gold
up-arrow**. Bottom-left, ~1,100 px away: a **portrait bust inside a red ring**, above a green
20/20 HP bar, a blue 26/26 Chi bar, a brown grey-lettered CANNOT CHANGE STANCE plaque and a
yellow 150% DAMAGE line.

Code, verified verbatim:
- `shs3_android/scripts/BattleUI.as:501` `skillSlotButton.visible = i < this.slotCount;`
  (#16's prose says `:503` — off by two; the cite field's `500-511` range is correct)
- `:502-506` — the numeral branch runs **only** when `StatsManager.skillSlots[i] != null`
- `:510` `skillSlotButton.initEmpty();`
- `SkillSlotButton.as:128` `this.keypressText.text = "";` · `:129` `this.shade.visible = false;`
  — which is exactly why the empty box is unnumbered and brighter
- `BattleUI.as:275-277` stance is `battlemodebust.hitTestPoint(...) → stanceButtonClick()`
- `BattleUI.as:133` `skillSlotButton.x = 760 - i * 60;` — right-to-left, so i=0 is the **rightmost**
  slot and gets numeral `slotCount - i` = 3. #17's "key 3 at i=0 (x=760), key 2 at i=1 (x=700)"
  is exactly right.
- The web build creates the same strip: `§1t113s0§.as:167-175`, `_loc1_.x = 760 - _loc2_ * 60;`,
  `_loc1_.y = 450;`, 8 buttons — parity hole closed.

**REBUILD_READINESS.md:235 ④ ("the '3 skill slots' is really ~2 abilities + a stance up-arrow")
is wrong and should be STRUCK, not narrowed.** A stance control does not carry a keypress
numeral, and this one does. THE FRAME WINS.

---

## 6. Blocker ② (#15, #18) — and my own hunt closes the rest of it

**#15 holds.** `BattleUI.as:245-256` verbatim (text + shadow + `bar.scaleX = hp/maxhp`), and the
**web** twin at `§1t113s0§.as:320-323` is identical — so this is not an Android-only claim. No
Tween, no easing anywhere in the class (the single `gotoAndPlay` in BattleUI is `:427`,
`hurtred`, not a bar). Frame-confirmed: the crop shows 20/20 and 26/26 centred on full bars, the
`hp + "/" + maxhp` format exactly.

**#18's content half holds and its residual half I closed.** `BattleUI.as:56, 99-100, 382-395`
verbatim; `getString(45)` = **"Hit Combo"** per `docs/gauntlet/L0/index/strings.json["45"]`; the
web twin is `§1t113s0§.as:117, 498-500, 505`, also a bare `visible` toggle. Frame-confirmed at
(1560,0)-(1920,200) ×3: red brush **3** with a hard offset shadow over a black HIT COMBO plaque.

Then I went looking for the "pop", which #18 left open inside a symbol timeline. I walked the
web SWF tag stream and found the container:

> **`reference/decrypted/shs3_payload_decoded.swf`, DefineSprite id 3611** (the sprite whose body
> contains `comboshadow`): **1 declared frame**, four PlaceObject2 tags — shape id 74 plus
> DefineEditText 3608 / 3609 / 3610 (`comboshadow`, `§1t5168s0§`, `§1t15885s0§`) — one ShowFrame,
> one End. No child is a sprite. **There is no combo pop in web v0.717**; the widget is a static
> composition toggled by `visible`.

And the third item of blocker ②:

> **DefineSprite id 3607** (`shs3_fla.hurtred_32`, 800×480, exported to
> `reference/extracted/sprites/DefineSprite_3607_shs3_fla.hurtred_32/1-7.png`): **7 frames** —
> PlaceObject2 on frame 1, five bare ShowFrames, **RemoveObject2 on frame 7**. There is no
> vignette *ramp*: it is a **6-frame flat hold = 0.25 s at 24 fps**, then removed. Played by
> `§1t113s0§.as:534-537` (`visible = true; gotoAndPlay(1);`), the web twin of
> `BattleUI.as:424-428`.

**So blocker ② falls entirely: bars SNAP, combo does NOT pop, vignette does NOT ramp.** No single
packet claim earns that — #15 closes one third, #18 closes the content of a second, and the two
sprite decodes above close the rest. That is why I mark #15's and #18's individual overturns as
noted-but-partial in the reason strings.

---

## 7. #21 bar geometry — measurement reproduces EXACTLY, overturn does not

I ran the finding's own colour masks (`green: G>110 ∧ G−R>45 ∧ G−B>45`; `blue: B>110 ∧ B−R>45 ∧
B−G>25`) over `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` window (200,940)-(600,1070):

```
green  count 2980   frame x 246..513   frame y 972..988
blue   count 4020   frame x 245..513   frame y 1000..1019
```

Identical to the claim, to the pixel. I also confirmed the AUTO SLASH plaque by eye (crop
(60,10)-(420,110) ×3: a brown gold-bordered plaque reading **AUTO SLASH OFF**).

Two problems:

1. **The game-space conversion is wrong.** Back-solving its numbers gives scale 2.270 with
   x₀ = 52 — the width-fit model that #14 proves the engine does not use. Under the engine's own
   model (`x_game = (x−60)/2.25`) the HP fill is x 82.7…201.3, y 432.0…439.1, not
   x 85.5…203.2, y 430.6…437.7. ~2–3 game px out on both axes. The frame numbers are gold; the
   converted numbers should be re-derived.
2. **The overturn is inflated.** It names the ui-hud scorecard row, REBUILD_READINESS.md:125 —
   whose *Rebuild-ready now* column **already reads "combat-HUD geometry"**, and RR:234 already
   reads "Ready: combat-HUD geometry (frame-measured fractions)". The ledger concedes this two
   lines away. The row's blocker column (aspect-ratio truth / HUD feel / off-screen screens) is
   untouched by bar rectangles. Nothing in RR:125 becomes false.

---

## 8. #22, #23 sprite export — HELD, and I closed their build-parity question in their favour

Counts reproduce exactly: `ls reference/extracted/sprites | wc -l` → **827**;
`| grep shs3_fla | wc -l` → **39**; `ls reference/extracted/shapes | wc -l` → **1822**.
Dimensions reproduce exactly: PauseScreen_51 **802×481** (1 frame), skillSlotBG_755 **56×55**
(5 frames), autoslashbutton_43 **129×31** (2), hurtred_32 **800×480** (7), stancecolor1_56
**63×63** (3). I opened PauseScreen_51/1.png composited over a dark ground: a full-stage near-black
overlay carrying the 草帽武士 kanji logo over a red brush **DUELS** and a white **GAME PAUSED**
line. I rendered skillSlotBG_755 frames 1-5 at 4× NEAREST: dark/olive, bright-cream/olive,
dark/black, **bright-cream/black**, dark/olive — frame 4 is exactly the empty highlighted slot in
the frame crop.

**The "no Android caveat" claim is now HELD, by my own byte scan, not by assertion.** I walked the
tag streams:

```
shs3_payload_decoded.swf          DefineSprite = 827   DefineShape = 1822   (max sprite id 3641)
shs3_android_payload_decoded.swf  DefineSprite = 675   DefineShape = 1557   (max sprite id 2953)
```

827/1822 match the on-disk directory counts exactly. `reference/extracted/sprites` and
`reference/extracted/shapes` are **web v0.717**.

**But the overturn only goes two-thirds of the way.** Blocker ⑤ is "pause/options/**dialogue-box**
exact metrics". Pause is closed outright. Dialogue is arguably closed by `speechbubble_422`
(137×110, 6 frames). **Options is not** — I scanned every `shs3_fla.*` symbol name in the web SWF
(40 of them) for `option|setting|pause|dialog|speech|menu|hud|panel` and only `PauseScreen_51` and
`speechbubble_422` came back. ⑤ must be narrowed to the options screen, not struck.

---

## 9. #4 skill-animation blob — HELD, overturn is a category error

Verified byte-for-byte: **338,096 bytes**, UTF-8 **with BOM**, opening bytes exactly
`<?xml version="1.0"?>\r\n<animdata>\r\n<anim i="chargedshot_start" d="4">\r\n<f i="0">\r\n<n i="20" x="9" y="-44" r="-54"></n>`.
Counts: **547** `<f `, **8,351** `<n `, **19** distinct bone ids
(0-7, 9-16, 18-20 — note 8 and 17 are absent). 51 `<anim ` openers, **50** `</anim>`-closed
blocks. Every named animation and `d=` value I spot-checked is present: shunpo_start 4,
shunpo_end 1, focus_start 8, focus_end 13, cleave_start 9, cleave_end 14, cleave_pose 1,
backthrow 39, backthrow_victim 36, kneegroin 30, kneegroin_victim 41. And the strongest part of
the claim holds under a full check, not a spot check: **`d=` equals the `<f>` count in all 50
closed blocks, zero mismatches.**

**But its `ledger_text` is `### skills-meters — 33` — a section *header*, not a claim.** Skill
*animation* keyframes touch none of skills-meters' five blockers (Chi costs, cooldowns, Shunpo
effect, Focus numerics, SPD→cooldown, crit proc). The finding's own `lane_impact` says
"L6 (ART/ANIM)". Filed against the wrong row; overturns nothing where it points.

---

## 10. #12 piercing/crit — HELD, overturn is an addition not a refutation

`reference/extracted/ui_strings.txt:100` reproduces verbatim. I closed the provenance question
directly rather than trusting the file's location — scanning the decompressed SWF bodies:
`shs3_payload_decoded.swf` contains `piercing dmg` ×1 and `critical dmg` ×1. **The web v0.717
payload carries both channels in its own bytes**; the Android caveat really is retired.

**But RR:189 is a `**Ready:**` line.** Adding two more ready channels cannot make a list of
already-ready things false. Worse for the overturn: everything RR:189 asserts I independently
*confirmed* in the web code — `§1t99s0§.as:3274` `return _loc2_ * 1.3 + this.§1t1243s0§;`
(crit **1.3×**, plus an item crit-damage add) and `§1t99s0§.as:3286-3290`
`if(this.stance == §1t12222s0§) return defense * 0.8;` (**Heavy def ×0.8**). The sentence survives,
strengthened.

---

## 11. Scoreboard

| # | id | refuted | overturn upheld |
|---|---|---|---|
| 0 | skills-meters/maxreload-is-192 | no (nit: two assignments, not one) | **yes** |
| 1 | skills-meters/maxreload-is-192-frames | no | n/a |
| 2 | skills-meters/maxreload-is-192-not-120 | no | **no** — target is COMBAT_MEASUREMENTS:590 |
| 3 | skills-meters/reach-triple-is-a-floor-not-a-ceiling | no | **yes** |
| 4 | skills-meters/skill-animation-data-is-plain-xml | no | **no** — wrong lane |
| 5 | skills-meters/slashusage-is-a-weapon-stat | no | n/a |
| 6 | skills-meters/slashusage-is-weapon-derived | no | **no** — answers a 4th numeric |
| 7 | skills-meters/stance-switch-gate-and-cycle | no | **yes** |
| 8 | skills-meters/stance-switch-gate-is-48 | no | **yes** |
| 9 | skills-meters/stance-switch-gate-is-reload-48 | no | **yes** |
| 10 | skills-meters/stance-switch-hard-gate-48 | no | **yes** |
| 11 | stage/web-native-canvas-is-800x690-not-800x480 | **YES (material)** | **no** |
| 12 | string-table/piercing-and-crit-are-web-v0717-held | no | **no** — a Ready line |
| 13 | ui-hud/NEW-web-and-android-payloads-ship-different-stage-rects | no (class mis-labelled A3) | **no** |
| 14 | ui-hud/aspect-ratio-truth-closed-from-source | no | **yes** |
| 15 | ui-hud/bars-are-untweened-continuous-scalex | no | **yes** (1 of ②'s 3) |
| 16 | ui-hud/blocker-4-is-wrong-2-abilities-plus-empty-slot | no | **yes** |
| 17 | ui-hud/blocker4-uparrow-is-an-equipped-skill | no | **yes** |
| 18 | ui-hud/combo-widget-content-held-pop-unheld | **YES (hunt succeeded)** | **yes** |
| 19 | ui-hud/frame-refutes-stance-up-arrow | no | **yes** |
| 20 | ui-hud/friend-bar-690 | no | **no** |
| 21 | ui-hud/hp-chi-bar-geometry-measured | no (conversion off ~2-3 px) | **no** |
| 22 | ui-hud/hud-art-already-exported | no | **yes** (options survives) |
| 23 | ui-hud/hud-sprite-art-on-disk | no | **yes** (options survives) |

24 judged / 24 in packet. 0 skipped.

## 12. New findings (mine, unclaimed by anyone)

1. **In-combat stance switching is live in web v0.717's BattleUI** —
   `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:468-479` + `§1t99s0§.as:3160-3166`.
   Overturns RR:158 outright; none of #7-#10 cited it.
2. **No combo pop in web v0.717** — `shs3_payload_decoded.swf` DefineSprite id 3611, 1 frame,
   4 non-sprite children. Closes ②'s combo third.
3. **No vignette ramp — a 6-frame flat hold** — DefineSprite id 3607, PlaceObject2 → 5 bare
   ShowFrames → RemoveObject2 on frame 7 = 0.25 s at 24 fps. Closes ②'s vignette third.
   With #15, **blocker ② falls entirely.**
4. **43 named SFX cues are held in web v0.717** — 43 distinct `"Snd_*"` literals across
   `reference/decompiled/shs3_payload/scripts/`, each at a live trigger (`§1t113s0§.as:472`
   Snd_smallClick on a legal stance switch, `:478` Snd_error on refusal). PARTIAL against RR:240 ①
   "**ALL AUDIO** — every SFX + music param is INFERRED": the *cue inventory and trigger map* are
   HELD; the waveforms remain encrypted (S0-5 stands).
5. **`reference/extracted/sprites` + `shapes` are provably web v0.717** — 827/1822 tag counts
   match the web SWF exactly (Android: 675/1557).
6. **The damage triple and crit 1.3× are held in web source** — `§1t99s0§.as:3261-3270`,
   `:3274`, `:3288`. Confirms (does not overturn) RR:189 and the damage half of RR:155.
