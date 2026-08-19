# GAUNTLET L0 — HUNTER critic: **ui-hud**

Blind review under §0. I did not see the surveyor's reasoning. **Every verdict below cites an
artifact I opened myself**, and every number I state I re-derived — by parsing the blob, by
simulating the loop, by measuring the frame with a threshold sweep, or by opening the sprite.
Lens 2 (hunter): I went after every STILL_UNHELD / PARTIAL and tried to find it.

**Headline finding — the one thing this review adds that nothing else in the lane has:**
`reference/extracted/sprites/` (827 `DefineSprite` exports, 39 of them class-named) and
`reference/extracted/shapes/` (1,822 SVGs) are **on disk, from the WEB payload**, and they contain
exactly the HUD art claim 13 says is "not on disk" — including a **802×481 `PauseScreen` that
renders the words GAME PAUSED**, a **56×55 / 51×51 `skillSlotBG` in 5 states**, the **800×480
7-frame `hurtred` vignette** that the ledger calls *uncatalogued*, and the **3 stance rings at
#4242FF / #996600 / #990000**. Claim 13 is refuted, and so is ledger blocker ②'s "vignette ramp".

**Second finding — a correctness hit the survey did not catch.** The web build (v0.717, the
build in the videos) and the Android build (v0.682) **diverge inside `SkillSlotButton.update()`**:
Android truncates the cooldown sweep, web rounds up. That single line disproves claim 7's
licence sentence ("retires the 'android parity not established' caveat for the combat HUD").

Score view: I would hold ui-hud at **88** — the residual the surveyor priced (symbol geometry
unexported) is smaller than he thought, but the parity licence he claimed is not earned, and the
two cancel.

---

## Verdict table

| # | claim id | verdict | severity |
|---|---|---|---|
| 1 | `langmanager-uses-resname-not-id` | **HOLDS** — and it is the best claim in the set | — |
| 2 | `transition-durations-exact` | **REFUTED** | material |
| 3 | `dialogbox-metrics-in-code` | **REFUTED** | material |
| 4 | `pause-is-click-anywhere` | **HOLDS** (bounded) | — |
| 5 | `options-screen-complete` | **REFUTED** | minor |
| 6 | `skill-cooldown-12-step-quantised` | **REFUTED** | material |
| 7 | `slot-geometry-frame-validated` | **REFUTED** | material |
| 8 | `result-cards-exact` | **HOLDS** | — |
| 9 | `interactui-menu-system` | **HOLDS** — verified to the byte | — |
| 10 | `typography-edo-sz` | **HOLDS** — and I upgraded the cite to the web SWF itself | — |
| 11 | `tier3-video-repass-obsolete` | **REFUTED** | minor |
| 12 | `690-friend-bar-never-filmed` | **HOLDS** — I replicated all four measurements | — |
| 13 | `hud-symbol-metrics` (STILL_UNHELD) | **REFUTED** | material |

8 hold, 5 refuted (4 material, 2 minor — claim 7 counted once).

---

## 1 — `langmanager-uses-resname-not-id` — HOLDS. Strongest claim in the set.

I re-parsed the blob rather than trusting the summary:

```
$ python3 -c "…re.findall(r'<trans-unit id=\"([^\"]*)\" resname=\"([^\"]*)\">\s*<source>(.*?)</source>' …)"
units 2555
id!=resname 2343
nonnumeric resname 649
first nonnum ('1906', 'IDS_Q0TITLE')
first divergence ('212', '222')
resname619 'Auto Slash Off' id= 600
id619 'Special Event' resname= 638
```

Every one of the surveyor's five numbers is exact. The mechanism is confirmed at
`reference/decompiled/shs3_android/scripts/LangManager.as:78` —
`Locale.loadStringEx(num.toString(),language)` — and `fl.lang.Locale` keys XLIFF by `resname`.

**And the frame adjudicates, as §0 requires.** My own crop of
`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, region (40,0)–(560,200) upscaled 3×, shows a
brown plaque top-left reading **AUTO SLASH OFF** in white brush type. `BattleUI.as:124` calls
`getString(619)`. Under resname that is *"Auto Slash Off"*; under `id` it is *"Special Event"*.
**THE FRAME WINS, and it picks resname.**

Spot-checks I ran on the other resnames the lane depends on, all correct:
`6/7/8`→Music/Sound/Blood · `396`→Chat notification · `492`→Record Duels · `752`→Full Screen ·
`74/75`→Title Screen/Return To Game · `10`→Options · `104`→FIGHT! · `407`→**Game Paused**
(while `id` 388 = Game Paused — exactly the Pass-1 error the claim describes) · `482/483`→
Continue/Save Replay · `480`→Respawn · `208`→Change Stance · `620`→Auto Slash On.

---

## 2 — `transition-durations-exact` — REFUTED (material). "Each" is wrong, and the arithmetic is wrong.

The quoted code is verbatim (`ScreenTransition.as:80-88,111,143-146,159-162` all check out), and
the *white fade* half is right. Two things are not.

**(a) The stated formula is wrong.** The claim says *"displacement after n frames is (n−2)(n−1);
(17−2)(17−1) = 240"*. Speed is applied **then** incremented, so frame *n* adds `2(n−1)` and the
cumulative displacement is **n(n−1)**, which hits 240 at **n = 16**, not 17. I simulated the loop
exactly as written:

```
close frame 15 y -30 speed 30
close frame 16 y 0   speed 32          <- shutters MEET here
close frame 17 y 0   speed 34 DOACTION <- gate counter>=17 holds one extra frame
```

So `BLACKCLOSE` is **16 frames of motion (667 ms) + 1 held frame before the action (708 ms)** —
two different numbers, and the claim collapses them into one and attributes it to a formula that
does not produce it.

**(b) "Each black shutter takes 17 frames" is false for the open shutter.** `TRANSITION_BLACKOPEN`
(`:93-107`) has **no counter gate at all** — it fires `doAction()` the instant `blackup.y <= -240`:

```
open frame 15 y -210 speed 30
open frame 16 y -240 DOACTION          <- 16 frames, 667 ms
```

**Open = 16 frames / 667 ms. Close = 16 frames of motion, action at 17 / 708 ms.** A rebuild that
ships 708 ms for both is wrong on every room exit.

**(c) The white fade holds — but only by an accident worth banking.** `1/24` per frame from
`alpha = 1` reaches 0 on frame 24 → 1000 ms. ✓. But `doAction()` sets `transitioning = false`, and
`update()` early-returns on that, so the `counter == 2` call at `:118-121` should freeze the fade
at α ≈ 0.917 forever. It does not, because `startOpenWhite` has exactly **one** caller
(`Overworld.as:377`) and it passes `ACTION_REFRESHROOMONOPEN`, whose case at `:289-292` re-arms
`this.transitioning = true`. Any other action would break the fade. That coupling must be copied.

**Parity is fine here** — I found the web build's own copy at
`reference/decompiled/shs3_payload/scripts/§1t6497s0§.as:79-124`, structurally identical
(`counter >= 17`, `<= -240`, `1 / 24`). So the *corrected* numbers are web-valid.

**24 fps is not an assumption — I byte-checked it** (see F2 below).

---

## 3 — `dialogbox-metrics-in-code` — REFUTED (material). It contradicts the survey's own claim 13.

The quotes are exact (`DialogBox.as:46,49,53,59,63,136,147` all verbatim). The **conclusion** is
what fails. The claim's headline is *"Dialogue-box exact metrics are **NOT** locked inside an
assets.swf symbol … so blocker ⑤'s dialogue half is closed."*

I read the whole file and grepped every geometric assignment in it:

```
$ grep -n "\.x = \|\.y = \|width\|height\|scale" DialogBox.as
46:  this.button.x = 340;      86:  this.button.x = 270;
49:  this.msgText.y = 187.5;   89:  this.msgText.y = 187.5;
53:  this.msgText.y = 220;     93:  this.msgText.y = 220;
105: this.button2.x = 425;     136: this.button.x = 270;
147: this.button2.x = 425;     162: this.button.x = 340;
```

That is **the complete list**. `button.y`, `button2.y`, `msgText.x`, the text field's width and
height, and the panel/frame art itself are **never assigned in code** — they live in
`[Embed(source="/_assets/assets.swf", symbol="symbol83")]` (`DialogBox.as:8`), which is precisely
what the survey's *own* claim 13 says is not on disk. Two claims in one submission cannot both be
true. Blocker ⑤'s dialogue half is **partly** closed (two x's, one y, one alignment rule), not
closed.

**Upgrade I can give it for free:** the web build's DialogBox is
`reference/decompiled/shs3_payload/scripts/§1t5474s0§.as` and it is **line-for-line identical** —
`button.x = 340` at :46, `msgText.y = 187.5` at :49, `= 220` at :53, `align` at :59/:63,
`button.x = 270` at :86/:136, `button2.x = 425` at :105/:147. So these four constants carry **no
Android caveat**. That is a strictly better cite than the one the claim shipped with.

---

## 4 — `pause-is-click-anywhere` — HOLDS, with one bound the claim overstates.

`BattleUI.as:179`, `:267-272` and `:324-328` are verbatim and in that order — `isPaused` really is
the **first** test in `gotClicked`, before the stance bust, the chat button and the pause button.

The bound: `gotClicked` has exactly one caller, `InputManager.as:254`, and it sits behind two
gates I read myself — `if(mouseY > 480){ return; }` (`:231`) and
`if(drawArrayLength <= lengthThreshhold && (inputMode == BATTLE_MODE || …) && BattleUI.instance.visible)`
(`:252`). So it is *"any **tap** anywhere **inside the 800×480 game area** while in battle input
mode"*, not literally any click. A drawn slash-line does **not** resume. Not a refutation — but a
rebuild that resumes on mouse-up after a slash gesture would be wrong.

**And I can close the visual half the claim left open** — see F1: `PauseScreen` is on disk and
renders black-out + logo + **GAME PAUSED**, which independently confirms resname 407 from art.

---

## 5 — `options-screen-complete` — REFUTED (minor). "Completely held" is not true.

Copy and structure verified verbatim at `OptionsUI.as:34-43,44-51`, and all nine resnames resolve
exactly as claimed (I checked each against the blob). Two problems with *"completely held"*:

- **A child is missing from the inventory.** `OptionsUI.as:25` declares
  `public var quitdialog:QuitDialog;`, hidden at `:60` on every `show()`. The screen has a
  confirm-quit sub-dialog the claim never mentions.
- **It claims the options half of blocker ⑤, which asks for *exact metrics*.** `OptionsUI` is
  `[Embed(… symbol="symbol1133")]` (`:7`) and assigns **zero** coordinates in code. Copy ≠ metrics.

---

## 6 — `skill-cooldown-12-step-quantised` — REFUTED (material). Wrong build, and the step count is off.

The Android quotes are verbatim (`:220,:146,:110,:114,:153`). But this claim is offered as a spec
of the game in the videos, and **the web build rounds the other way**:

```
android  reference/decompiled/shs3_android/scripts/SkillSlotButton.as:220
            newframe = int(this.cooldown / this.cooldownmax * 12) + 1;
web      reference/decompiled/shs3_payload/scripts/§1t5184s0§.as:226
            _loc1_ = Math.ceil(this.cooldown / this.cooldownmax * 12) + 1;
```

I confirmed `§1t5184s0§` **is** the web SkillSlotButton: same `stat 2501` ammo read at `:109`,
same `Math.floor(… / 4)` Windmill rule at `:113`, same three stance-gated early returns at
`:213/:217/:221`, same `--this.cooldown` at `:225`. `int()` truncates, `Math.ceil()` rounds up —
they differ by one shade frame for **every** non-integral ratio, i.e. for essentially the whole
sweep. A rebuild copying the Android line renders the wrong frame almost always.

Secondary: *"exactly 12 steps with a 13th 'disabled' frame"* mis-describes the widget. The shade
clip has **13 frames**; frame 13 is reached **both** by `disableButton()` (`:146`) **and** by the
formula at full cooldown; and initialisation uses frame **12**, not 13 (`:105`
`this.shade.gotoAndStop(12)` when `cooldown > 0`).

---

## 7 — `slot-geometry-frame-validated` — REFUTED (material). Right conclusion, wrong number, wrong licence.

I measured the frame myself with a threshold sweep, not by eye. Crop
`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, region (1050,900)–(1880,1080) upscaled 3×
for the look, then per-row/per-column scans at threshold >150 for the numbers:

```
y=975   left border 1448-1450   right border 1557-1559
y=1050  left border 1448-1450   right border 1558-1559
x=1470  top 961-962             bottom 1070-1072
```
→ empty-box centre **(1503.7, 1016.5)**. The surveyor's x (1503.5) replicates; his **y centre
1012.5 does not** — I get 1016.5.

**The 446.0 in the claim is an arithmetic slip.** The journal's own stated mapping
(`systems/ui-hud.md`, Method notes) is *anisotropic* — `stage_x = (x−52)×800/1816`,
`stage_y = y×480/1080` — but the claim card applies the **x** scale (2.270) to **y**. Redone
correctly with my measurement: game **(639.5, 451.8)** vs code `(640, 450)`. The headline
*"within ~1 px"* survives on the corrected arithmetic (0.5 px in x, 1.8 px in y); the number
printed in the cite does not.

**The licence sentence is the material part and it is disproven.** The claim says the match
*"retires the 'android parity not established' caveat for the combat HUD."* It does not — claim 6
above shows `SkillSlotButton`, the very class being geometry-matched here, **diverges between the
builds** on the next method down. Geometry agreed; behaviour did not. Parity must stay
per-constant, checked against `shs3_payload/`, not retired wholesale.

**What I can add in its place** (and it is better evidence): the **asset** agrees with the frame.
`reference/extracted/sprites/DefineSprite_934_shs3_fla.skillSlotBG_755/` is a 56×55 canvas whose
bright border bounding box is **51×51 px** (alpha>200 ∧ luma>150, frames 1–5). My frame-measured
outer border is 1448→1559 = 112 video px = **49.8 game px** at 1080/480. Asset 51 vs frame 49.8 —
**web art and web frame agree to ~1 px, with no Android in the loop at all.**

---

## 8 — `result-cards-exact` — HOLDS.

`WinUI.as:26,32-37,49-55,90` and `LoseUI.as:35-36,45,53` are all verbatim; I also opened
`WinUI.frame11()` (`:104-107`) and it is `stop()`, so the 11-frame read is right, and
`addFrameScript(0,…,6,…,10,…)` → winwords at frame 7 = 250 ms, stop at frame 11 = 417 ms @ 24 fps
(fps byte-verified, F2). DRAW variant, the `isRecording()` gate, the replay URL and the LoseUI
`gold` / `getgoldpromptdialog` / `payui` trio all check out.

One over-generalisation, not a refutation: **only `WinUI` has an `addFrameScript` timeline.**
`LoseUI` has none — it drives `this.brushStroke.gotoAndPlay(1)` (`:50`) on a child clip. "The
win/lose result cards are an 11-frame timeline" is true of the win card only.

*(The brush stroke itself is on disk — `animatedBrush_62`, 371×166, **8 frames**. See F1.)*

---

## 9 — `interactui-menu-system` — HOLDS. Verified to the byte.

```
bytes 20947 · enc utf8 · lines 314
<ui> 19 · <title> 19 · <menu> 47 · <option> 139 · <icon> 139 · <condition> 28 · <has> 28 · <param> 67
titles at 5/14/47/66/73/82/94/109/117/142/161/190/219/227/249/257/281/291/301
```

Every count, every line number and all 19 titles are exact. Lines 5–9 and 16 are verbatim as
quoted. One nit: there is exactly **one** `<errormsg>` in the whole file, so "error copy" is
singular, not a body of copy.

---

## 10 — `typography-edo-sz` — HOLDS, and I upgraded the cite.

`ui_strings.txt:100,206,314` are verbatim. But that file is, per `docs/GAUNTLET.md:156`, an
*alphabetised dump* — so I went to the source instead and found the run **inside the web payload's
own bytes**:

```
$ python3 -c "zlib.decompress(open('reference/decrypted/shs3_payload_decoded.swf','rb').read()[8:]) …"
b'ccccc" letterSpacing="0.00" kerning="1">physical dmg: 1234 - 1235 &nbsp;(heavy)</font></p>
  <p align="center"><font face="Edo SZ" size="14" color="#cccccc" letterSpacing="0.00" kerning="1">
  critical dmg: 1234-1235 *(heavy)</font></p>…'
```

816 occurrences of `Edo SZ` in the **web** payload (572 in Android). The "no Android caveat" claim
is correct and now directly cited. `LangManager.as:127-141` verified — `embedFonts = false` only
for `zh-CN` and `ja`.

Two completeness notes: the size inventory is **13 (×2) / 14 (×5) / 16 (×4) / 18 (×1)**, and the
18 px instance is `color="#000000"` (`ui_strings.txt:460`) — the claim's "13/14 body, 16 heading"
misses an 18 px black style. And the *face* half of this was already banked as Stage-0 finding
S0-2 and as GAUNTLET.md §1's "free win"; the genuinely new part is sizes/colours/letterSpacing.

---

## 11 — `tier3-video-repass-obsolete` — REFUTED (minor). It is two of five, not three.

Ledger line verified: `docs/research/REBUILD_READINESS.md:339` reads exactly
*"Archer moveset at full fps; VS/FIGHT exact ms; damage-popup animation; dialogue-box metrics;
overworld HUD pixel geometry."*

- **VS/FIGHT exact ms — genuinely closed.** I read the frame handlers, which the claim did not
  quote: `DuelIntroBar.as:85-104` — `frame1` hides `actionWord`, `frame20` calls `showText()`
  (busts + names in), `frame69` shows `actionWord` (whose text is `getString(104)` = **FIGHT!**,
  `:69`), `frame88` ends the intro and stops. At 24 fps: busts 792 ms, FIGHT! 2833 ms, end
  3625 ms. ✓
- **Damage-popup animation — genuinely closed.** `TextProjectile.as:20-46` verbatim; spawn at
  `MCSPlayer.as:3805` verbatim. ✓
- **Dialogue-box metrics — NOT closed.** See claim 3: four constants are in code, the panel and
  every y except `msgText`'s are in `symbol83`. ✗

The *action* ("don't fund a video re-pass") survives for all three, because what is missing is a
symbol export, not footage. The *reason given* is false for one of them.

---

## 12 — `690-friend-bar-never-filmed` — HOLDS. I replicated all four measurements.

```
Nr4fQstqHDM_428.0   x 52→1867  w 1816  rows 0→1079  aspect 1.6815
Nr4fQstqHDM_t425.0s x 52→1867  w 1816  rows 0→1079  aspect 1.6815
zFtCaTO0_1M_t0320s  x 55→1861  w 1807  rows 0→1079  aspect 1.6731
zFtCaTO0_1M_t0325s  x 54→1861  w 1808  rows 0→1079  aspect 1.6741
```
Threshold sweep 5→80 on 428.0 puts the hard pillarbox edge at 52 and 1866-1867 either way.
Pillarbox only, no letterbox, nothing near 800/690 = 1.159. The PARTIAL verdict is correct and
honest.

**I can tell you *why* it is unfilmable, which turns PARTIAL into a rule.**
`GameEngine.as:271-284`: `originalHeightWithBar = 690` and the bar is enabled **only** when
`newAspectRatio <= originalWidth / originalHeightWithBar` — i.e. **only in a browser window
narrower than 1.159:1**. Both longplays sit at ~1.68. The bar therefore *cannot* appear in any
frame of either video, and no denser sampling will ever find one. It is INFERRED-from-source
permanently, exactly as the claim says.

---

## 13 — `hud-symbol-metrics` (STILL_UNHELD) — REFUTED (material). The art is on disk.

The claim's load-bearing premise is *"only `scripts/` was exported, so symbol geometry is not on
disk."* **That is false.** Two sibling directories exist, both from the **web** payload
(`shs3_fla` naming, matching `reference/decompiled/shs3_payload/scripts/shs3_fla/`):

```
$ ls reference/extracted/sprites | wc -l   → 827      (DefineSprite exports, PNG per frame)
$ ls reference/extracted/shapes  | wc -l   → 1822     (SVG per DefineShape)
$ ls reference/extracted/sprites | grep shs3_fla | wc -l → 39   (class-named)
```

39 of them are class-named, and they are HUD:

| sprite | size (game px) | frames | what it is |
|---|---|---|---|
| `PauseScreen_51` | **802 × 481** | 1 | the pause overlay — black field, SHS:Duels logo, **"GAME PAUSED"** |
| `skillSlotBG_755` | 56 × 55 canvas, **51 × 51** border | **5** | the skill-slot box, all five states |
| `autoslashbutton_43` | **129 × 31** | 2 | the AUTO SLASH plaque, off/on |
| `hurtred_32` | **800 × 480** | **7** | the damage vignette |
| `stancecolor1_56` | **63 × 63** | **3** | the stance portrait ring |
| `animatedBrush_62` | 371 × 166 | 8 | the win/lose card brush stroke |
| `chatTextBattle_45` | 437 × 212 | 2 | in-battle chat panel |
| `CharSlot_126` | 267 × 50 | 1 | character-select slot |
| `MinimapIcon_668` | 15 × 18 | **20** | minimap icon set |
| `MinimapRoomIcon_672` | 20 × 30 | **17** | minimap room icon set |
| `speechbubble_422` | 137 × 110 | 6 | overworld speech bubble |
| `skillnodeinner_89` | 64 × 64 | 7 | skill-tree node |
| `QuestLogButtonBG_548` | 314 × 43 | 5 | quest-log button |
| `clanemblem_778` | 47 × 47 | 7 | clan emblem set |

I opened `PauseScreen_51/1.png`, `skillSlotBG_755/1–5.png`, `hurtred_32/1–7.png` and
`stancecolor1_56/1–3.png` and looked at them. **802 × 481 is the 800 × 480 stage + 1 px AA** — a
fourth independent confirmation of the game-area height, this time from a web-build asset.

**Part (c) of the claim survives and I am not refuting it.** I byte-searched both decrypted
payloads for the skill-icon class names `ResourceManager.getSkillImage` builds
(`"skill" + id`, `:302-316`):

```
$ grep skill1[0-9]{3} in shs3_payload_decoded.swf     → []
$ grep skill1[0-9]{3} in shs3_android_payload_decoded → []
```

Zero hits in either. The icon art really is only inside the encrypted `115_Mobile_SHS3Resource`
(S0-5). **Declining to name the gold up-arrow was correct** and I would have refuted any guess.

---

## New findings the survey missed

### F1 — the vignette the ledger calls "uncatalogued" is on disk, and I catalogued it.

Ledger blocker ② (`REBUILD_READINESS.md:235`) reads *"dynamic HUD 'feel' (bar tween vs snap,
combo pop, **vignette ramp**) — uncatalogued."*

`reference/extracted/sprites/DefineSprite_3607_shs3_fla.hurtred_32/` — **7 PNG frames, 800 × 480**,
a red radial vignette: edge `#990000` at α 251, fully transparent at centre. Frames 1–6 render
identically; **frame 7 is entirely blank** (`maxA 0`). The driver is
`BattleUI.as:424-428` `showHurtRed(){ hurtred.visible = true; hurtred.gotoAndPlay(1); }`, and the
clip's own timeline class `shs3_android_fla/hurtred_29.as:12,15-18` is
`addFrameScript(6,this.frame7)` → `frame7(){ stop(); }`.

**Spec: 800×480 full-screen red radial `#990000`→transparent, played from frame 1, holds 6 frames,
blanks on frame 7 and stops — 7 frames = 292 ms at 24 fps.** Blocker ② is no longer uncatalogued
for the vignette.

### F2 — 24 fps and both stage rects, byte-checked from the SWF headers.

Every millisecond figure in this lane rests on "24 fps". Nothing had verified it. I parsed the
headers directly:

```
shs3_payload_decoded.swf          CWS v17  rect 0..800 × 0..690  fps=24.000  frames=6
shs3_android_payload_decoded.swf  CWS v26  rect 0..800 × 0..480  fps=24.000  frames=6
shs3.swf                          CWS v10  rect 0..800 × 0..690  fps=24.000
shs3preloader.swf                 CWS v10  rect 0..800 × 0..690  fps=24.000
```

**24.000 fps is held (A3).** And the **authored web stage is 800 × 690 while Android is 800 × 480**
— the friend bar is a real structural difference between the builds, not just a code path. Pair
this with F1's 800×480 `hurtred` and PauseScreen's 802×481: the *game area* is 480 in both; the web
build reserves 210 px more of authored stage for the bar.

### F3 — the stance ring colours, exact.

Ledger surface note (`:236`): *"portrait ring is stance-colored, not fixed red."* Now measured, from
`DefineSprite_3394_shs3_fla.stancecolor1_56/` (63 × 63, 3 frames), dominant opaque hue per frame:

| frame | ring | RGB | hex |
|---|---|---|---|
| 1 | light stance | (66, 66, 255) | **#4242FF** |
| 2 | balanced | (153, 102, 0) | **#996600** |
| 3 | heavy | (153, 0, 0) | **#990000** |

Driven by `BattleUI.as:372-374` `battlemodebust.stancecolor1.gotoAndStop(num)`. Note frame 3 is the
same `#990000` as the `hurtred` edge — one red in the palette, used twice.

### F4 — the hotkey numbering rule, which explains the frame exactly.

`BattleUI.as:133` lays slots out **right to left** (`x = 760 - i*60`), and `:504` labels them
`initKeyPressText(this.slotCount - i)`. With `slotCount = 3`: i=0 (x=760, rightmost) → key **3**,
i=1 (x=700) → key **2**, i=2 (x=640, leftmost) → key **1**. My wide crop (1050,900)–(1880,1080)
shows exactly three boxes: leftmost bright-bordered, **empty and unnumbered**; middle labelled
**2** with a pale claw/fang icon; right labelled **3** with the gold up-arrow. The leftmost is
unnumbered because `skillSlots[2]` is null → `initEmpty()` clears `keypressText`
(`SkillSlotButton.as:123-135`). Frame and code agree on all three slots, including the gap.

### F5 — `InteractUI` icon ids resolve without any art.

Claim 13 says the 139 `<icon>` ids "map to unextracted art". The **ids** resolve in code even
though the art does not: `NodeUI.as` declares `ACTION_*` constants and
`GenericActionButton.setInteractIcon(iconID)` switches on them into named classes
(`ShopActionIcon`, `LeaveActionIcon`, `BackActionIcon`, …). The 139 uses draw on a small distinct
set, so "139 unresolved icons" overstates the gap by roughly 7×.

---

## What I would tell the next lane

1. **Re-derive every `Mobile_Lang_EN` id above 211 against `resname`.** Claim 1 is correct and it
   is cross-lane. `strings.json` is the map; `id` is a trap.
2. **Stop treating `shs3_android/` as the game.** Two divergences found in one review
   (`int` vs `Math.ceil`; stage rect 480 vs 690). `reference/decompiled/shs3_payload/scripts/` is
   obfuscated but **numeric literals and public member names survive**, so any constant can be
   confirmed against the real build by grepping for the literal. I did it four times here
   (DialogBox → `§1t5474s0§`, ScreenTransition → `§1t6497s0§`, SkillSlotButton → `§1t5184s0§`,
   GameEngine → the 690 gate). Every future "the code says X" claim should carry the web cite too.
3. **`reference/extracted/sprites/` and `shapes/` are unmined across the whole board.** 827 + 1,822
   assets nobody in this lane knew existed. Three lanes are affected immediately: ui-hud (this
   review), art-anim-audio-feel (vignette, brush stroke, stance rings), world-exploration
   (minimap icon sets, `WorldMapMarkerBase`, `town_*`).
