# ui-hud — BLIND CRITIC (Lens 4, the frame lens)

Reviewer opened every artifact itself. No verdict below rests on the surveyor's reasoning,
which the reviewer never saw. Frames were cropped and upscaled per §0; crops are stated.

## Method / crops used

- `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (1920×1080, verified `PIL` size).
  - crop **(40,0)–(560,200) ×3 LANCZOS** — top-left plaque.
  - crop **(1700,0)–(1880,200) ×4** — top-right pause control.
  - crop **(1380,920)–(1880,1080) ×3** — skill-slot strip.
  - crop **(40,900)–(700,1080) ×2.4** — bottom-left portrait/bars/stance plaque.
- Pillarbox re-measured programmatically on the full frame at five thresholds (10/16/25/40/60):
  content columns **52→1867 (w 1816)**, rows **0→1079**, stable at every threshold ≥16.
- Layout-invariance sample widened well past the surveyor's 7 frames: **all 240 `broad_survey`
  thumbnails, both videos** (`Nr4fQstqHDM` and `zFtCaTO0_1M`) — every one ≈5:3, none ≈1.159.

## Two artifacts the surveyor did not open, which change several verdicts

1. **`reference/extracted/shapes/` (1,822 ffdec SVGs) and `reference/extracted/sprites/`
   (827 sprite directories, 54 MB + 120 MB) already exist**, exported from the **web** payload
   (names carry the web build's `shs3_fla.*` symbols). The "one JPEXS shape/sprite export away"
   the surveyor schedules as future work **has already been run**.
2. **SWF headers, parsed here first-hand** (zlib-inflate + rect/frame-rate decode):
   `shs3_payload_decoded.swf` → **800 × 690 @ 24.0 fps**;
   `shs3_android_payload_decoded.swf` → **800 × 480 @ 24.0 fps**.
   The 24 fps that every duration claim in this lane depends on is now measured, not assumed.

---

## Verdicts

### 1. `langmanager-uses-resname-not-id` — UPHELD, and strengthened
Own cite: `reference/decompiled/shs3_android/scripts/fl/lang/Locale.as:301` —
`var _loc2_:String = param1.attributes.resname;` … `stringMap[_loc2_] = _loc3_;` (:307), read by
`loadStringEx` (:168–176). This is a **code proof**, stronger than the frame the surveyor cited.
Re-parsed `118_Mobile_Lang_EN.bin` independently: 2,555 units, **2,343** with `id != resname`,
first divergence `('212','222')`, **649** non-numeric resnames, first `('1906','IDS_Q0TITLE')` —
all four numbers reproduce exactly. Spot-checks all reproduce: resname 619 `Auto Slash Off`
(id 619 = `Special Event`), resname 388 `Condition: Poor` / id 388 `Game Paused`, resname 407
`Game Paused`, resnames 6014 / 7009-7011 vs ids 1506 / 1648-1650.
Frame confirms: the (40,0)–(560,200) ×3 crop shows a brown plaque reading **AUTO SLASH OFF**.

**New, and it retires the caveat the surveyor kept:** the *web* build proves the same thing.
`reference/decompiled/shs3_payload/scripts/shs3_fla/PauseScreen_51.as:26` —
`this.loadingtext.text = §1t1521s0§.getString(407);`. Under resname that is `Game Paused`;
under the id attribute it is `Search rocks`. The resname correction therefore carries **no
Android-build caveat at all**.

### 2. `transition-durations-exact` — **REFUTED (material)**
Own cite: `ScreenTransition.as:95-106`.
- The **open** shutter has **no counter gate**. `:98 if(this.blackup.y <= -240) … :106 doAction();`
  Simulated the exact integer loop: displacement after *n* frames is **n(n−1)**, which is 240 at
  **n = 16**. The open transition therefore completes in **16 frames / 667 ms**, not 17 / 708 ms.
  "each black shutter takes 17 frames (708 ms)" is wrong for half the cases.
- The stated derivation is also wrong. The claim asserts displacement is `(n−2)(n−1)` and that
  `(17−2)(17−1) = 240` is "why the gate is `counter >= 17`". The real displacement is n(n−1);
  it reaches 240 at frame **16**, at which point `counter` is 16 and the gate at `:87` **fails**.
  The close takes 17 frames only because the shutter sits shut for one extra frame. Right answer,
  fabricated reason.
- White fade: `:111 white.alpha -= 1/24` from `:173 white.alpha = 1`. In plain IEEE-754 doubles the
  loop runs **25** iterations (residual after 24 is ~1.1e-16 > 0, forcing a 25th subtract). It is 24
  only if you model Flash's 8.8 alpha quantisation. "**exactly** 24 frames" is quantisation-dependent
  and stated without that qualification. Also `:118 if(this.counter == 2) doAction();` — the gameplay
  handoff on a white transition is 2 frames, not 24.
- Its lane_impact calls the ±240 park "a third independent confirmation of the 480-px stage height".
  The **web** SWF header rect is **800 × 690** (measured above); 480 is the android stage and the web
  *play field*, not the web stage. See finding NF6 for a web-native artifact that does confirm 480.

24 fps itself is confirmed (both headers). The `-240 / 480 / 0 / 240` constants at :143-144, :159-160
are verbatim correct.

### 3. `dialogbox-metrics-in-code` — **REFUTED (material overreach)**
Own cite: `DialogBox.as`, full `grep -n "msgText"` and `grep -n "public function|numLines|align =|button.x|button2.x|msgText.y"`.
The individual numbers are right (`button.x = 340` :46, `msgText.y = 187.5` :49 / `220` :53,
`button.x = 270` :136, `button2.x = 425` :147). The **claim built on them is not**:
- `msgText.x`, `msgText.width`, `msgText.height`, `button.y`, `button2.y` and the box's own stage
  placement are **never assigned anywhere in the class** — they come from `symbol83`. So
  "Dialogue-box exact metrics are NOT locked inside an assets.swf symbol" is false in part, and
  "blocker ⑤'s dialogue half is closed" does not follow. The surveyor's own claim 13 concedes
  symbol geometry is unheld; claims 3 and 13 contradict each other.
- The alignment rule is **method-specific**, not the single rule quoted. `show()` uses
  `numLines <= 2` (:57); `showAP()` uses `numLines == 1` (:107); `showYesNoDialog()` sets
  `myFormat.align = "center"` **unconditionally** (:171). The quote pairs the `<= 2` rule with the
  Yes/No cites (:136,:147) — the one path where it does not apply.

### 4. `pause-is-click-anywhere` — UPHELD
Own cite: `BattleUI.as:179` (`pausebutton.visible = !isDuelMode() && !isPvPRoomMode()`), `:268-272`
(isPaused test is the first branch of `gotClicked`), `:324-328` (`togglePaused` + `pauseScreen.visible`
+ `setChildIndex(pauseScreen, numChildren-1)`) — all verbatim.
**Frame corroboration the surveyor did not supply:** the (1700,0)–(1880,200) ×4 crop of
`Nr4fQstqHDM_428.0.png` shows a **red circular two-bar pause glyph** at the top right of the play
field, in a multi-enemy story fight (not a duel) — exactly the visibility rule.
Qualification, not a refutation: `InputManager.as:252-254` only routes to `gotClicked` when
`drawArrayLength <= lengthThreshhold && (inputMode == BATTLE_MODE || BATTLEAUTOSLASH_MODE) &&
BattleUI.instance.visible`, so a click long enough to register as a drawn slash does not resume.
Also `:178 chatButton.visible = isDuelMode() || isPvPRoomMode()` — in duels the pause button is
*replaced* by chat, which is a stronger statement than "hidden".

### 5. `options-screen-complete` — UPHELD
Own cite: `OptionsUI.as:34-51` verbatim, plus my own resname resolution of all eight ids
(6/7/8/396/492/752/74/75 → Music / Sound / Blood / Chat notification / Record Duels / Full Screen /
Title Screen / Return To Game; title 10 = Options). Both conditional hides verified.
Minor: "completely held" excludes the panel's own pixel layout (`symbol1133`, :7) and omits the
`quitdialog:QuitDialog` child declared at `:25`. Not enough to refute.

### 6. `skill-cooldown-12-step-quantised` — UPHELD
Own cite: `SkillSlotButton.as:220` (`newframe = int(cooldown/cooldownmax*12) + 1`), `:146`
(`shade.gotoAndStop(13)` in `disableButton`), `:110` / `:114` (ammo readout, Windmill `/4`),
`:153` (stance gate for SHUNPO/THOUSANDSTABS/DEADLYCLEAVE). All verbatim. The 12+1 arithmetic
checks: the decrement precedes the frame calc, so the sweep uses frames 1–12 and 13 is disabled-only.
Minor imprecision: the HP/Chi bars are **continuous** — `BattleUI.as:249 hpbar.bar.scaleX = hp/maxhp`,
`:256 chibar.bar.scaleX = chi/maxchi` — so "the same … character" holds for *no-tween* but not for
*quantised*.

### 7. `slot-geometry-frame-validated` — **REFUTED (material: wrong conversion, wrong residual)**
Own cite: `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, crop (1380,920)–(1880,1080) ×3, plus
programmatic column-run measurement of the bright empty-slot border → **x 1448→1560, centre 1504**
(the surveyor's 1449→1558 / centre 1503.5 reproduces).
The claim text says the source predicts the frame "**to within ~1 px**". Its **own quote** reports
game **(639.4, 446.0)** against code **(640, 450)** — a **4.0 px** y error. The claim is refuted by
its own evidence.
The cause is a method error: y was divided by the **horizontal** scale 2.270. This lane's own journal,
`docs/gauntlet/L0/systems/ui-hud.md:31-32`, states the convention
`stage_x = (frame_x − 52) × 800/1816, stage_y = frame_y × 480/1080` — the mapping is **anisotropic**
(x 2.270, y 2.250; the ~0.9 % stretch is a re-encode artifact, see NF5). Under the lane's own rule the
surveyor's own centre 1012.5 → **exactly 450.0**. So the underlying finding is *better* than reported
and the published arithmetic is wrong. Anyone copying this lane's y-conversion inherits a 1 % error.
Pitch is fine: measured box centres ≈1504 / ≈1642 / ≈1777 → ~137 frame px → 60.2 game px vs code 60.

### 8. `result-cards-exact` — UPHELD
Own cite: `WinUI.as:26` `addFrameScript(0,frame1,6,frame7,10,frame11)`, and the three bodies at
`:94-107` — `frame1 { winwords.visible = false }`, `frame7 { winwords.visible = true }`,
`frame11 { stop() }`. The ms conversion checks at the measured 24 fps (6/24 = 250 ms, 10/24 = 417 ms).
Draw variant, `isRecording()` gating, replay URL (`WinUI.as:90`) and `LoseUI.as:35-36,45,53`
(`respawnbutton` 480/483, `gold`, `getgoldpromptdialog`, `payui`) all verbatim.

### 9. `interactui-menu-system` — UPHELD
Own cite: re-parsed `reference/extracted/android/90_InteractUI_UIData.bin`. Every count reproduces
exactly: **20,947 bytes**, 19 `<ui>`, 19 `<title>`, 47 `<menu>`, 139 `<option>`, 139 `<icon>`,
28 `<condition><has>`, 67 `<param>`; all 19 title line numbers (5/14/47/66/73/82/94/109/117/142/161/
190/219/227/249/257/281/291/301) and their names match. Ledger under-claim confirmed against
`REBUILD_READINESS.md:234` — the ui-hud Ready bullet list has no town interaction UI.
Two minors: the gated "sell crops" option is on **line 16**, outside the cited range `:5-9,17`
(line 17 is the "buy commodities" option); and there is exactly **one** `<errormsg>` in the file, so
"error copy" is one string, not a class. Scoring note: this blob was already handed to the surveyor
as Stage-0 finding **S0-4**, explicitly mapped to "ui-hud blocker ⑤" — the claim's wording
("neither the ledger nor Pass 1") is literally true but the discovery credit in the score rationale
is inflated.

### 10. `typography-edo-sz` — UPHELD
Own cite: `reference/extracted/ui_strings.txt:100,206,314` — all three strings verbatim, byte for byte.
I enumerated every `<font face= size= color=>` in the file: Edo SZ 16/#ffffff ×3, 14/#cccccc ×2,
**13/#cccccc ×1**, 14/#ffffff ×1, 18/#000000 ×1; Calibri 14/#ffffff ×2. The "13/14 px" in the claim
text is **not** supported by the three cited lines (they only show 14) but **is** grounded elsewhere
in the same file — so it stands. `LangManager.as:127-137` reads as claimed; note the code only
*declines to disable* `embedFonts` for EN, it never enables it, so "embedded and authoritative" is an
inference rather than a read.

### 11. `tier3-video-repass-obsolete` — **REFUTED (material)**
Own cite: `DialogBox.as` (full grep, above) and `BattleIntroBar.as:16`.
- Leg (a) collapses with claim 3: **dialogue-box metrics are not closed from source**. The claim
  recommends *not funding* work on a blocker that is only partly closed.
- Leg (b) is not established by its cite. "VS/FIGHT exact ms" is asserted from
  `DuelIntroBar.as:22` — the `addFrameScript` is actually at **:23** — and the claim never states a
  single millisecond value, never reads the frame bodies (`:85-103`: `frame1` hides actionWord,
  `frame20 showText()`, `frame69` shows actionWord, `frame88 introEnd()+stop()`), and never
  distinguishes it from **`BattleIntroBar.as:16 addFrameScript(0,frame1,5,frame6,24,frame25)`**,
  a *second* timeline that also renders `getString(104)` = "FIGHT!" (`:28`, `:45`) on completely
  different beats. Two candidate answers, no disambiguation, no ms.
- Leg (c) is right in direction and wrong in fact: "that is a JPEXS symbol export" — **it is already
  done and on disk** (see NF2).
Leg for the damage popup is sound: `TextProjectile.as` (`ttl = 12`, `velY = -5`, `+0.1` scale at
`ttl < 10`, `alpha -= 0.25` at `ttl < 4`) and `MCSPlayer.as:3805`
`ProjectileManager.createFloatingText(mcs.x, mcs.y - 100, damage.toString(), damagetextcol);`
both verbatim.

### 12. `690-friend-bar-never-filmed` — UPHELD, and upgraded from empirical to mechanical
Own cite: `Nr4fQstqHDM_428.0.png` pillarbox re-measured at five thresholds (52→1867, w 1816,
rows 0→1079) — the surveyor's numbers replicate — **plus all 240 `broad_survey` thumbnails across
both videos**, every one ≈5:3, none ≈1.159.
More usefully, I found the mechanism that makes this an inference rather than an absence-of-evidence
argument: `GameEngine.as:266-290 resizeHandler()` selects `originalHeightWithBar = 690` and sets
`StatsManager.stageShowingFriendBar = true` **only** when the container aspect ≤ 800/690 ≈ 1.159;
otherwise it takes the 480 branch, which fits **height** and pillarboxes
(`newScale = stageHeight/originalHeight; offsetX = (stageWidth − 800·newScale)/2; offsetY = 0`).
Full-height-plus-pillarbox is precisely the geometry every frame shows. So the frames do not merely
fail to show the friend bar — they show the branch that **excludes** it. Verdict PARTIAL is right and
the "INFERRED-from-source if built" label is right.

### 13. `hud-symbol-metrics` (STILL_UNHELD) — **REFUTED (material): the residual is already closed**
Own cite: `reference/extracted/sprites/` and `reference/extracted/shapes/`, listed and opened.
The claim's stated ground — "only `scripts/` was exported, so symbol geometry is not on disk …
Closing all three is one JPEXS shape/sprite export away" — is false. On disk right now, exported from
the **web** payload:
- `reference/extracted/shapes/` — **1,822** ffdec SVGs carrying explicit px dimensions.
- `reference/extracted/sprites/` — **827** sprite directories, including the exact HUD symbols the
  claim says are missing:
  `DefineSprite_3621_shs3_fla.autoslashbutton_43/1.png` → **129 × 31** (opaque bbox = full canvas)
  `DefineSprite_934_shs3_fla.skillSlotBG_755/1.png` → **56 × 55** (opened it — it is the rounded
  metallic slot frame seen in the frame crop)
  `DefineSprite_3632_shs3_fla.PauseScreen_51/1.png` → **802 × 481**
  plus `stancecolor1_56`, `chatTextBattle_45`, `MinimapIcon_668`, `MinimapRoomIcon_672`,
  `skillnodeinner_89`, `speechbubble_422`, `QuestLogButtonBG_548`.

**And a frame settles it, per §0.** On `Nr4fQstqHDM_428.0.png`, thresholding the plaque's black
outline (`r,g,b < 45`, pillarbox masked off) gives the AUTO SLASH plaque at
**x 74→364 (291 frame px), y 18→86 (69 frame px)**. Under this lane's own convention
(x ÷ 2.270, y ÷ 2.250) that is **128.2 × 30.7 game px** against the exported sprite's **129 × 31**.
Sub-pixel agreement between a web-build vector asset and the video. "HUD panel/bar/plaque pixel
geometry … remain ungrounded — I will not name any of them" is refuted; here is one, named and
frame-validated.
Fair to the surveyor: the *android* symbol ids it lists (2952 / 1133 / 83 / 2915 …) genuinely are not
exported. But the 1:1 target is the **web** build, whose equivalents are.

---

## New findings

**NF1 — the web build proves the resname keying by itself.** (A2)
`reference/decompiled/shs3_payload/scripts/shs3_fla/PauseScreen_51.as:26`
`this.loadingtext.text = §1t1521s0§.getString(407);` — resname 407 = `Game Paused`, id 407 =
`Search rocks`. Removes the "Android v0.682 vs web v0.717" caveat from the whole string-id correction.

**NF2 — the JPEXS shape/sprite export is already on disk.** (A2, frame-validated A1)
1,822 SVGs + 827 sprite dirs under `reference/extracted/`. `autoslashbutton_43` = 129 × 31 matches the
frame-measured plaque (291 × 69 frame px → 128.2 × 30.7 game px) to under 1 px. Overturns
`REBUILD_READINESS.md:235` blocker ⑤'s "exact metrics" framing and the art-anim close-path.

**NF3 — ledger blocker ④ is wrong, and THE FRAME WINS.** (A1)
`REBUILD_READINESS.md:235` ④: *"the '3 skill slots' is really ~2 abilities + a stance up-arrow."*
Crop (40,900)–(700,1080) ×2.4 of `Nr4fQstqHDM_428.0.png` shows the stance control is the **bottom-left
portrait bust** — red stance ring, `CANNOT CHANGE STANCE` plaque directly under the 20/20 HP and
26/26 Chi bars. Crop (1380,920)–(1880,1080) ×3 shows the gold up-arrow sitting inside a **numbered
hotkey slot labelled "3"** in the slot strip. A stance control does not get a keypress label.
Corroborated in code: stance is `battlemodebust.hitTestPoint` → `stanceButtonClick()`
(`BattleUI.as:275-277`), while slot art is `SkillSlotButton.image`. The slots are 3 skills, one empty.

**NF4 — the black shutter is asymmetric.** (A2) `ScreenTransition.as:87` vs `:98,:106`.
Close = **17 frames / 708 ms** (gated on `counter >= 17`). Open = **16 frames / 667 ms** (ungated).

**NF5 — the video→stage mapping is anisotropic, and here is why.** (A2 + A1)
`GameEngine.as:283-290` takes the fit-height branch for any container wider than 800/690, giving
`newScale = stageHeight/480` and pillarboxing. At 1080 that is exactly 2.25 vertical; the measured
horizontal is 1816/800 = 2.270, a ~0.9 % stretch introduced by the re-encode. Any lane converting a
**y** with 2.270 is 1 % wrong — claim 7 did exactly that.

**NF6 — a web-native artifact confirms the 800 × 480 play field.** (A2)
`reference/extracted/sprites/DefineSprite_3632_shs3_fla.PauseScreen_51/1.png` = **802 × 481**, from the
web payload. Closes ledger blocker ① without borrowing the android build's stage rect — which matters,
because the web SWF header rect is 800 × 690, not 800 × 480.

---

## Score

The surveyor asks for **88**. On my own reading the evidence base is real and mostly excellent —
claims 1, 4, 5, 6, 8, 9, 10, 12 all survive first-hand re-derivation, several of them exactly to the
digit. But five of thirteen claims are wrong as written, and the two that matter most are the two that
tell the board what work to stop funding (11) and what work remains (13) — and 13's residual is
already sitting on disk, unopened. A lane whose declared unknown is closed in its own repo has not
finished surveying. **83**, not 88.
