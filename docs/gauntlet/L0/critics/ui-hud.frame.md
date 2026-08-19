# ui-hud — BLIND CRITIC, LENS 4 (THE FRAME LENS)

Reviewer opened artifacts first-hand. Every verdict below carries the artifact **I**
opened. §0 standing invariant applied: **when a measurement doc and a frame disagree,
THE FRAME WINS**, and it is said out loud where it happened.

Tooling used: Pillow 12.3.0, numpy. All crops stated. Frames are 1920x1080 RGB.

---

## 0. The transform I derived (needed to grade any pixel claim)

Video **B** (`Nr4fQstqHDM`, the `duel_dense` / `duel_frames` set):

* Pillarbox measured on 5 frames: content columns **52..1867** (width 1816), rows
  **0..1079** (no letterbox). Pure-black columns are 0..51 and 1868..1919, so the
  content is exactly centred.
* Three skill-slot centres measured independently (below) fit
  **`frame_x = 52 + 2.2689 * game_x`** with residuals **-0.35 / +0.30 / +0.10 px**.
* Flash scales uniformly here (`GameEngine.resizeHandler`, one `newScale` applied to
  both axes), so `frame_y = -5.0 + 2.2689 * game_y`. The capture is cropped ~5 px at
  the top and ~4 px at the bottom of the 800x480 stage (480 * 2.2689 = 1089 px > 1080).
* **The surveyor's transform is wrong on the y axis.** It applied the *horizontal*
  scale 2.270 to y with `y0 = 0`. That is why its own quoted conversion landed on
  `game y = 446.0` against a code value of `450` — a 4 px miss it then described as
  "within ~1 px". With the correct transform the slot sits at 450.0.

Video **A** (`zFtCaTO0_1M`): columns 55..1861 / 54..1861 / 56..1861 (widths 1807 /
1808 / 1806), rows 0..1079. Slightly different browser width, same 5:3 game area.

---

## 1. Verdicts

### ui-hud/langmanager-uses-resname-not-id — **HOLDS (strongest claim in the set)**

I opened the frame. `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`,
crop **(40,0)-(560,200)** upscaled **3x** (LANCZOS): a brown plaque with a gold inner
border, top-left, reading **AUTO SLASH OFF** in white brush-script caps. Not ambiguous.

I then re-derived the mapping instead of trusting it:

* `BattleUI.as:124` is *exactly* `this.autoslashofflabel.text = LangManager.getString(619);`
* `LangManager.as:76` → `Locale.loadStringEx(num.toString(), language)`. `fl.lang.Locale`
  keys XLIFF by the **string name**, i.e. the `resname` attribute — never `id`.
* My own parse of `reference/extracted/android/118_Mobile_Lang_EN.bin` (UTF-16LE):
  **2,555** `<trans-unit>`, **2,343** with `id != resname`, **649** non-numeric resnames,
  first divergence `id="212" resname="222"` source `CHI`, first non-numeric
  `id="1906" resname="IDS_Q0TITLE"`. Every number the surveyor gave, to the unit.
* resname 619 = `Auto Slash Off`; id 619 = `Special Event`. resname 388 =
  `Condition: Poor`, and `Game Paused` is resname **407**. resname 6014 = `Skill Slots+`,
  7009/7010/7011 = `4/5/6 skill slots`. `docs/gauntlet/L0/index/strings.json` (2,533 keys)
  is itself resname-keyed and agrees.

**THE FRAME WINS over both id maps, and it does.** This is a cross-lane correctness fix,
not a ui-hud detail.

### ui-hud/transition-durations-exact — **REFUTED (material)**

The claim's whole value is the word *exactly*. I simulated the shipped loop.

`startClose` (ScreenTransition.as:143-146) seeds `blackup.y=-240, blackMovtSpeed=0,
counter=0`; `update()` (`:76-88`) does `++counter; y += speed; speed += 2`. Displacement
after *n* ticks is **n(n-1)**, not the `(n-2)(n-1)` the claim asserts. n(n-1) = 240 at
**n = 16**, so the shutters physically meet on tick **16**, not 17. `doAction()` is then
withheld one extra tick by `if(counter >= 17)`.

`startOpen` (`:159-162`) has **no counter gate at all** — `if(blackup.y <= -240)` fires
`doAction()` the same tick the displacement reaches 240, i.e. tick **16 / 667 ms**.
So "**each** black shutter takes 17 frames (708 ms)" is false for the open shutter and
describes an action gate, not the shutter, for the close one.

White fade: `startOpenWhite` sets `white.alpha = 1` (`:174`), `update()` does
`white.alpha -= 1/24` (`:111`). In IEEE-754 doubles the residue after 24 ticks is
**+3.75e-16**, so `alpha <= 0` first holds on tick **25**. Under AVM2's 1/256 alpha
quantisation it lands on 24. "Exactly 24" is therefore not established either way.

What survives, and I confirmed it: **24.0 fps** and **800x480** are real — I read them
out of the SWF header of `reference/decrypted/shs3_android_payload_decoded.swf`
(`stage 0,800,0,480 px`, `framerate 24.0`). Cite line numbers are off by one in three of
four places (`:79` not `:80`, `:110` not `:111`, `:142` not `:143`; `:159-162` is exact).

### ui-hud/dialogbox-metrics-in-code — **HOLDS**

Opened `DialogBox.as`. Line-exact, every one: `:46 this.button.x = 340;`
`:49 this.msgText.y = 187.5;` `:53 this.msgText.y = 220;` `:59 myFormat.align = "center";`
`:63 myFormat.align = "left";` `:136 this.button.x = 270;` `:147 this.button2.x = 425;`
The layout genuinely is re-assigned in script on every show, so blocker ⑤'s dialogue
half is closed. Best-cited claim in the set.

### ui-hud/pause-is-click-anywhere — **HOLDS, and is stronger than stated**

`BattleUI.as:179` verbatim; `:267-272` is the first test in `gotClicked`; `:324-328`
verbatim. I also traced the caller the claim did not: **`InputManager.as:254`** —
`BattleUI.instance.gotClicked(args.stageX, args.stageY)` — a stage-level handler, which
is what actually earns the words "any click **anywhere**". And `grep pauseScreen` returns
only 5 hits, all in `BattleUI.as`, none touching a child: there is provably no in-battle
pause menu. The frame corroborates the button's existence (round pause glyph at game
centre **(785.2, 17.0)**, 56 frame px across).

### ui-hud/options-screen-complete — **HOLDS**

`OptionsUI.as:34-43` and `:44-51` verbatim. All eight resnames resolve as quoted
(6/7/8/396/492/752/74/75 → Music / Sound / Blood / Chat notification / Record Duels /
Full Screen / Title Screen / Return To Game; title 10 = Options).

### ui-hud/skill-cooldown-12-step-quantised — **HOLDS, and the frame adds what code cannot**

`SkillSlotButton.as:220` `newframe = int(this.cooldown / this.cooldownmax * 12) + 1;`
line-exact; `:146`, `:110`, `:114`, `:153` all line-exact.

Then I did what this lens exists for and looked. See finding **F3** — the frame settles
the *shape and sweep direction* of the `shade` overlay, which the scripts cannot tell you.

### ui-hud/slot-geometry-frame-validated — **REFUTED (minor) — the geometry survives, the two conclusions attached to it do not**

I re-measured, and the underlying match is *better* than claimed. Crop
**(1380,920)-(1880,1080)** at 3x shows three slots: leftmost empty with a bright cream
border and **no** number, middle "2" with a tan fang icon, right "3" with a gold
up-arrow — exactly as described. Border columns read off scanlines y=1000/1050/1060:

| slot | border cols | centre (frame) | → game x | code `760 - 60i` |
|---|---|---|---|---|
| left | 1447..1561 | 1503.75 | **639.5** | 640 (i=2) |
| mid  | 1585..1696 | 1640.5  | **699.8** | 700 (i=1) |
| right| 1721..1832 | 1776.5  | **759.7** | 760 (i=0) |

Sub-0.4 px on all three. Pitch 136.75 / 136.0 frame px = 60.1 game px vs code 60.

Refuted on two points:

1. **"to within ~1 px" is not what the surveyor's own arithmetic says.** Its stated
   conversion yields `(639.4, 446.0)` against `(640, 450)` — 4.0 px out in y, because it
   used the horizontal scale on the vertical axis. Correct transform gives 450.0.
2. **"retires the 'android parity not established' caveat for the combat HUD" is
   contradicted by a measured artifact.** I read both SWF headers: the **web** payload
   `reference/decrypted/shs3_payload_decoded.swf` is **800 x 690**, the Android payload is
   **800 x 480**. That is a real, measured layout divergence inside the very subsystem
   being declared at parity. One linear rule matching on one axis licenses using Android
   for *this* geometry — not for the HUD generally.

### ui-hud/result-cards-exact — **HOLDS**

`WinUI.as:26` line-exact; `frame7()` is `winwords.visible = true`, `frame11()` is
`stop()` — so the 250 ms / 417 ms beats are right at 24 fps. Draw variant verbatim.
`LoseUI.as:35,36,45,53` all line-exact; `gold` / `getgoldpromptdialog` / `payui:PayUI`
present, so the gold-gated revive is real.

### ui-hud/interactui-menu-system — **HOLDS**

My own parse of `90_InteractUI_UIData.bin`: 20,947 bytes, root `<uidata>`, **19** `<ui>`,
**19** `<title>`, **47** `<menu>`, **139** `<option>`, **139** `<icon>`, **67** `<param>`,
**28** `<condition><has>`. All 19 title line numbers match the list exactly. The second
quoted option is verbatim but lives at **line 16, not 17** (line 17 is the `label 523`
"buy commodities" option). Also: `errormsg` appears exactly **once** in the whole file,
so "error copy" is one string, not a system.

### ui-hud/typography-edo-sz — **HOLDS**

`ui_strings.txt:100`, `:206`, `:314` verbatim. Full census of the web payload:
**15** `face="Edo SZ"`, **2** `face="Calibri"`; Edo SZ appears at 16/#ffffff (x3),
14/#cccccc (x2), 14/#ffffff, 13/#cccccc, and **18/#000000** — the last is omitted from
the claim. Minor: the supporting inference ("so Edo SZ is embedded") is carried by the
Android `LangManager`, which only ever sets `embedFonts = false`; embedding is an
authoring fact, not a code fact. The face/size/colour data itself is web-native, so the
"no Android caveat" headline stands.

### ui-hud/tier3-video-repass-obsolete — **HOLDS**

Ledger line quoted verbatim — `docs/research/REBUILD_READINESS.md:339`. `TextProjectile.as:20-46`
and `MCSPlayer.as:3805` verbatim. Two nits: `DuelIntroBar` `addFrameScript` is line **23**,
not 22; and the claim ignores **`BattleIntroBar.as:16`** `addFrameScript(0,frame1,5,frame6,24,frame25)`,
the non-duel FIGHT! variant (both classes set `actionWord` from `getString(104)`), so the
"VS/FIGHT" item has two timelines, not one.

### ui-hud/690-friend-bar-never-filmed — **HOLDS, and the mechanism is now known**

My pillarbox re-measurement replicates the surveyor's numbers **to the pixel** on all
seven listed frames (video B 52..1867 / 1816 / 1.681; video A 55..1861 / 1807 / 1.673 and
54..1861 / 1808 / 1.674). Nothing is 800/690 = 1.159. See finding **F5** — the reason is
in the code, and it upgrades this from "nobody happened to film it" to "it was
structurally impossible to film at these window aspects".

### ui-hud/hud-symbol-metrics — **REFUTED (material) — this is the Lens-4 failure**

The claim declares "HUD panel/bar/plaque pixel geometry … ungrounded — I will not name
any of them", justified by `assets.swf` symbol shapes not being exported. That reasoning
grades a **visual** question from a **document** (an `[Embed]` line) while a frame was
sitting there — and the same surveyor had, one claim earlier, measured skill-slot
geometry off that exact frame to 0.4 px. **THE FRAME WINS.** Measured below (F2, F3).
The icon-manifest and up-arrow-identity thirds of the claim I leave standing.

---

## 2. New findings the surveyor missed

**F1 — frame↔stage transform for video B.** `frame = (52 + 2.2689*gx, -5.0 + 2.2689*gy)`,
game stage 800x480, fitted on three code-known slot centres with sub-0.4 px residuals.
Reusable by every lane that wants to measure anything off `Nr4fQstqHDM`.

**F2 — HP and Chi bar geometry, measured.** Crop (200,940)-(600,1070) of
`duel_dense/Nr4fQstqHDM_428.0.png`. Colour-keyed bboxes (frame px → game px via F1):

* HP (green, reading 20/20 so full): frame x 246..513, y 972..988 → **game x 85.5..203.2,
  y 430.6..437.7**; ~118 x 7.5 game px.
* Chi (blue, 26/26): frame x 245..513, y 1000..1019 → **game x 85.1..203.2, y 442.9..451.3**;
  ~118.6 x 8.8 game px (blue glow inflates the height).

Both bars share a left edge at game x ≈ 85 and a right edge at ≈ 203. This is exactly the
class of number the ledger calls "combat-HUD geometry" and the surveyor called ungrounded.

**F3 — the cooldown `shade` is a straight VERTICAL wipe, revealing right→left, and it dims
the slot's border too.** Crop (1710,955)-(1845,1080) at 4x, `_428.0` vs `_428.9`
side by side. At t=428.0 the slot-3 border is grey and the left ~53% of the face is
visibly darker with a hard vertical boundary; at t=428.9 the border is bright cream and
the face is uniformly lit. Tracking the strongest vertical luminance step across 42
consecutive `duel_dense` frames: slot i=0 holds the edge at **0.53** of slot width from
427.0 through 428.6, then snaps to **0.01** at 428.7 and stays — a discrete jump, no
tween, matching the 12-step quantisation. Slot i=1 independently goes 0.00 → 0.95 → 0.01.
This is geometry that is *not* in the scripts (it is `shade` frames 1..13 inside
`assets.swf`) and *is* in the frames. It also explains the bright cream border on the
empty slot: `initEmpty()` sets `shade.visible = false`, so ready and empty slots share the
undimmed look.

**F4 — ledger blocker ④ is wrong, and the surveyor found it but did not flag it.**
`REBUILD_READINESS.md:235` says: *"④ the "3 skill slots" is really ~2 abilities + a stance
up-arrow."* The up-arrow is at game x **759.7 ≈ 760 = SkillSlotButton i=0**
(`BattleUI.as:133`) and is labelled **"3"** by `initKeyPressText` (`BattleUI.as:504`).
The stance control is `battlemodebust`, bottom-left (`BattleUI.as:112-113, 275, 374`).
So the true reading is **2 abilities + 1 EMPTY slot**, and the up-arrow is an ability.
The surveyor stated the "not the stance control" half inside a STILL_UNHELD claim, set
`overturns_ledger: false` and left `ledger_text` empty — so a ledger blocker that is now
dead stays on the board.

**F5 — the friend bar was structurally unfilmable, not merely unfilmed.**
`GameEngine.as:267-280`: `originalHeightWithBar = 690`, `originalWithBarAspectRatio =
800/690 = 1.159`, and `StatsManager.stageShowingFriendBar` is set true **only** when the
window aspect is `<= 1.159`. Both longplays were captured at ~16:9, so the bar could never
appear. The same handler's else-branch (`newScale = stageHeight/originalHeight`,
`offsetX = (stageWidth - originalWidth*newScale)/2`) is precisely the pillarbox both
videos show. Separately: the **web** payload SWF stage is **800x690** while the Android
payload's is **800x480** — the web build authors the friend bar into the stage itself.

**F6 — the keypress number is reversed against the slot array.** `BattleUI.as:504`
`skillSlotButton.initKeyPressText(this.slotCount - i)` with `x = 760 - i*60`, so key "3"
fires `StatsManager.skillSlots[0]` (rightmost) and key "1" is the leftmost slot. Any
rebuild that binds key N to `skillSlots[N-1]` will mirror the OG's bindings.
