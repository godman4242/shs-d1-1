# CITE-LENS REVIEW — unit `ui-hud` (blind critic, pass 2)

Reviewer opened every cited artifact first-hand. Every verdict below carries the artifact
**I** opened. Nothing here is taken from the surveyor's reasoning (never seen) or from memory.

**Headline:** 9 of 13 claims survive; 4 are refuted. The surveyor's evidence work is unusually
clean — every line number I spot-checked in `shs3_android/scripts/` resolved, and the
`90_InteractUI_UIData.bin` tag counts are exact to the unit. The failures are all one species:
**declaring a ledger blocker CLOSED on evidence that does not contain the thing the blocker
asks for.** Blocker ⑤ asks for *exact metrics*; claims 3 and 5 answer it with copy and
behaviour. Claim 11 then compounds it by recommending that video work be defunded.

**The one finding that changes other lanes:** claim 7 asks to retire the "Android parity not
established" caveat for the combat HUD. It is refutable twice over — once by the frame, once by
the web build's own code, which **is on disk and the surveyor never opened it**
(`reference/decompiled/shs3_payload/scripts/`, 612 identifier-mangled AS3 classes).

---

## Verdicts

### 1. `ui-hud/langmanager-uses-resname-not-id` — **STANDS** (minor)
**I opened:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` crop (40,0)-(560,200) at 3x;
`reference/decompiled/shs3_android/scripts/LangManager.as:75-78`;
`reference/extracted/android/118_Mobile_Lang_EN.bin` (parsed).

The frame check is real. My crop shows a brown plaque top-left, gold inner border, white brush
lettering reading **AUTO SLASH OFF**. `BattleUI.as:124` sets that field from `getString(619)`.
Under resname 619 = `Auto Slash Off`; under the `id` attribute 619 = `Special Event`. Resname wins.

Every count re-derived and exact: 2,555 `<trans-unit>`; 2,343 with `id != resname`; first
divergence `('212','222','CHI')`; 649 non-numeric resnames, first `('1906','IDS_Q0TITLE')`.
The Pass-1 corrections check out too: `id 1506 -> resname 6014 'Skill Slots+'`,
`id 1648/1649/1650 -> resname 7009/7010/7011`, `id 388 -> resname 407 'Game Paused'`.

Two things the claim understates, both in its favour:
- The mechanism is nailed by the code, not just the frame: `getString` is
  `Locale.loadStringEx(num.toString(), language)` (`LangManager.as:78`), and the sibling
  `getQuestString(id:String)` (`:92`) takes `IDS_*` keys — keys that exist **only** as resnames.
- Second independent confirmation, free: `90_InteractUI_UIData.bin` carries its own inline
  comments. Label 83 is commented `buy` and resname 83 = `Buy`; label 269 `"sell crops"` /
  resname 269 = `Sell crops`; label 270 `"you don't have any crops for sale"` / resname 270 =
  `You do not have any crops for sale.` Third confirmation: resname 45 = `Hit Combo`
  (`BattleUI.as:99`) and the same frame shows a black plaque reading **HIT COMBO**.

**Correction (minor):** the quote's causal clause — "2,343 … have id != resname *because* 649
carry non-numeric resnames" — is wrong. The 649 non-numeric rows are one cause; the bulk is an
insertion cascade from `id=212` onward, which is why every id ≥ 212 is shifted.
**Caveat the claim does not state:** the web build does **not** load this blob — it loads
`./data/shs3_en.xml` (`LangManager.as:56`, non-mobile branch). Resolving web `getString(n)`
through the Android blob is a second assumption. The frame validates it for 619; it is not
validated in general, and §N1 below shows 11 web ids that the Android table cannot resolve at all.

### 2. `ui-hud/transition-durations-exact` — **STANDS** (minor)
**I opened:** `reference/decompiled/shs3_android/scripts/ScreenTransition.as:77-91,111,138-146,164-173`
and `GameEngine.as:442,913`; SWF headers of `reference/decrypted/*.swf`.

Every line number is exact (`:80-88` is the per-frame block, `:111` is `white.alpha -= 1/24`,
`:143-146` is the `startClose` reset). The arithmetic is right and I re-derived it: `++counter`
precedes the move, so displacement after n frames is `(n-2)(n-1)`; `(17-2)(17-1) = 240`, which is
exactly the 240-px travel, which is exactly why the gate reads `counter >= 17`. `TRANSITION_BLACKOPEN`
takes the same 17 frames by the same sum. `startOpenWhite` sets `white.alpha = 1` (`:173`), so
24 decrements of `1/24` = 24 frames.

**Gap I closed for it:** the claim asserts "at the SWF's 24 fps" with no cite. Supplied — see §N5.
I also confirmed the per-frame cadence, which the claim assumed: `update()` is called from
`GameEngine.as:913` inside `gameloop`, bound at `GameEngine.as:442` to `Event.ENTER_FRAME`.
**Bonus:** this now holds for the *web* build directly — `shs3_payload/scripts/§1t6497s0§.as:89`
`counter >= 17`, `:100-103` `-240`/`480`, `:113` `white.alpha -= 1 / 24`.

### 3. `ui-hud/dialogbox-metrics-in-code` — **REFUTED** (material) — scope, not facts
**I opened:** `reference/decompiled/shs3_android/scripts/DialogBox.as:8,46,49,53,57-63,86,105,107,136,147`.

The seven cited lines all resolve verbatim. The three facts are true and useful.

What is false is the thesis sentence: *"Dialogue-box exact metrics are NOT locked inside an
assets.swf symbol."* `DialogBox.as:8` reads
`[Embed(source="/_assets/assets.swf", symbol="symbol83")]`. Panel bounds, panel art, the
`msgText` field rect, the button symbol's own width/height and the font size all remain inside
symbol83. Code re-assigns exactly three things: one button x, one message y, one alignment flag.
Three properties is not "exact metrics", and blocker ⑤'s dialogue half is therefore **not closed**.
The surveyor's own claim 13 concedes this — it lists `DialogBox 83` among the "script-only
exports, so symbol geometry is not on disk." Claims 3 and 13 cannot both be right.

Second, smaller error: "re-assigns … text alignment … on every show" hides a real inconsistency —
`show()` centres at `numLines <= 2` (`:57`) but `showAP()` centres only at `numLines == 1` (`:107`).
A rebuild copying the quoted rule would render `showAP` wrong.

**What survives, and should be re-banked at PARTIAL:** button x = 340 single / 270+425 pair;
`msgText.y` 187.5 with button, 220 without; the two alignment rules. All four are additionally
confirmed **for the web build** at the same line numbers — `shs3_payload/scripts/§1t5474s0§.as:46,49,53,57,86,105,107,136,147`.

### 4. `ui-hud/pause-is-click-anywhere` — **STANDS**
**I opened:** `reference/decompiled/shs3_android/scripts/BattleUI.as:179,267-272,324-328`; frame
`duel_dense/Nr4fQstqHDM_428.0.png` crop (1560,0)-(1920,200) at 3x.

All three cites exact. The deduction is sound and I checked the ordering myself: the
`GameEngine.isPaused` branch is the **first** statement of `gotClicked` and returns `true`
unconditionally, so no clickable item inside `pauseScreen` can ever be reached — "no in-battle
pause menu" follows from the code rather than being asserted over it.

This is the correctly-scoped sibling of claims 3 and 5: it says "closes the pause half **as
behaviour** … the remaining unheld part is pixel geometry only." That is exactly the honest form.

**Free frame support the claim did not take:** my crop shows a red circled ⏸ glyph at the
top-right of a *non-duel* battle — visually consistent with `:179`
(`pausebutton.visible = !isDuelMode() && !isPvPRoomMode()`), and it establishes the widget's
corner. Note in passing: the frame set in `duel_dense/` is **not** duel mode by this test.

### 5. `ui-hud/options-screen-complete` — **REFUTED** (material) — zero metrics offered against a metrics blocker
**I opened:** `reference/decompiled/shs3_android/scripts/OptionsUI.as` (whole file, 7-51),
plus `grep -n "\.x =|\.y =|width|height" OptionsUI.as` → **no output**.

All eight `setText` calls, the title, and both conditional hides are verbatim correct, and I
resolved all eight strings through `strings.json` — Music / Sound / Blood / Chat notification /
Record Duels / Full Screen / Title Screen / Return To Game, title `Options`. Good work.

But the claim sets `overturns_ledger: true` against **"⑤ pause/options/dialogue-box exact
metrics"** while `OptionsUI.as` contains **not one coordinate, dimension, or spacing value** —
the grep above returns nothing — and the class is `[Embed(… symbol="symbol1133")]` (`:7`). It
delivers the screen's *inventory and copy*, not its metrics. "Completely held" is false: no
checkbox position, no panel size, no row pitch, no font size is known.
It also misses a ninth declared child, `quitdialog:QuitDialog` (`:25`), which `show()` hides at
`:39` — so even the inventory is not complete.

**Re-bank as:** Options *content* held (6 XCheckBox + 2 buttons + title + QuitDialog + 2
conditional hides, copy verbatim); Options *metrics* STILL_UNHELD, blocker ⑤ untouched.

### 6. `ui-hud/skill-cooldown-12-step-quantised` — **STANDS** (minor)
**I opened:** `reference/decompiled/shs3_android/scripts/SkillSlotButton.as:87,99,105,110,114,128,139,146,153,220,255,271`;
`BattleUI.as:249,256`.

All five cited lines exact. I checked the range the claim asserts: because `--this.cooldown`
executes *before* `newframe` is computed (`:219-220`), the ratio is always `< 1`, so `newframe`
lands in 1..12 and 13 is reserved for `disableButton()` — the "12 steps + 13th disabled frame"
reading is correct, not an off-by-one. The rider is right too: `cooldownmax =
skillData.getCooldown(this._skillLevel)` at `:99`, `:255`, `:271`.

**Correction (minor):** *"the same no-tween, snap character as the HP/Chi bars."* Half true. I
checked the bars — `BattleUI.as:249` `this.hpbar.bar.scaleX = hp / maxhp;` and `:256`
`this.chibar.bar.scaleX = chi / maxchi;` — no tween, correct. But those are **continuous**
scaleX; the cooldown is **12-step quantised**. They are not "the same character", and a rebuild
told they are will quantise the health bar. (The bars deserved their own claim — see §N3.)
**Second (minor):** `overturns_ledger: true` contradicts the claim's own lane_impact, which says
it *extends* blocker ②. Extending a blocker is not overturning it.

### 7. `ui-hud/slot-geometry-frame-validated` — **REFUTED** (material) — measurement replicates, conclusion does not
**I opened:** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (own crops (1380,920)-(1880,1080)
at 3x and (0,910)-(700,1080) at 2x, plus own luminance measurement);
`reference/decompiled/shs3_payload/scripts/§1t113s0§.as:169-171,1274-1316`;
`reference/decompiled/shs3_android/scripts/BattleUI.as:133-134`.

**What I confirm.** The crop is exactly as described: three slot boxes, leftmost empty and
unnumbered with a pale border, middle labelled 2 holding a claw/fang icon, right labelled 3
holding a gold up-arrow. My own measurement of the empty box's bright border: columns
**1448→1559, centre 1503.5** — identical to the surveyor's centre. Converting with the same
pillarbox, `(1503.5 − 52)/2.270 = 639.4` against code `640`. I went further and measured all
three boxes: game x **639.4 / 700.9 / 760.4**, i.e. `760 − 60i` for i = 2/1/0, with measured
pitch 138 and 135 frame px = **60.1 game px vs 60**. The x-axis match is real and I back it.

**Error 1 (arithmetic).** "within ~1 px" is not what the claim's own quote supports. It reports
game y **446.0** against code **450** — a 4 px miss — because it applied the *x* scale (2.270) to
a *y* coordinate. The capture is anamorphic: 1816/1080 = 1.681 but native 800/480 = 1.667. With
the frame's own y scale (1080/480 = 2.25) my measured centre 1016.5 gives **451.8** vs 450, a
~1.8 px residual. The conclusion survives; the quoted number and the headline do not agree.
(My y extent was 961→1072, a square 112x112 box; the surveyor's 952→1073 gives a 109x121 box,
so its top edge is a threshold artifact.)

**Error 2 (fatal to the claim's purpose).** The claim exists to "retire the 'android parity not
established' caveat for the combat HUD" and to "license using the Android decompile as a source
of web-build HUD geometry." Both are refuted, twice:

- **THE FRAME WINS.** My crop (0,910)-(700,1080) at 2x of the *same frame* shows, under the green
  HP bar (`20/20`) and blue Chi bar (`26/26`), a brown plaque reading **CANNOT CHANGE STANCE**
  and a yellow line reading **150% DAMAGE**. Neither exists in the Android build: the string
  "cannot change stance" appears in **0 of 2,555** trans-units of `118_Mobile_Lang_EN.bin` and in
  0 Android scripts, and `BattleUI.as` has no buff/status renderer at all (its only stance text is
  `changestancelabel = getString(208) = "Change Stance"`, a hover tooltip on `battlemodebust`,
  `:110,192,432,438`). Say it out loud: the measurement doc (the Android decompile) and the frame
  disagree, and the frame wins.
- **The web build's own code says non-parity.** See §N1: the web BattleUI is 1,344 lines to the
  Android's 939 and calls 11 string ids that do not exist in the Android table.

**Error 3 (framing).** "the strongest build-parity evidence in this lane" is false.
`shs3_payload/scripts/§1t113s0§.as:170-171` states `_loc1_.x = 760 - _loc2_ * 60; _loc1_.y = 450;`
in the **web v0.717 payload itself**. A one-pixel video measurement is not needed to prove the
slot geometry, and it is much weaker than the web source that was sitting on disk unopened.

**Re-bank as:** slot geometry HELD for the web build from `§1t113s0§.as:170-171` (A2), with the
frame as independent corroboration to ~0.6 px in x / ~1.8 px in y. Parity caveat **stands**.

### 8. `ui-hud/result-cards-exact` — **STANDS** (minor)
**I opened:** `reference/decompiled/shs3_android/scripts/WinUI.as:26,28-29,32-38,49-55,90,94-106`
and `LoseUI.as:7,15,19,21,29,35-38,45,53,104`.

`addFrameScript(0,this.frame1,6,this.frame7,10,this.frame11)` exact at `:26`; I read the three
handlers — `frame1` hides `winwords`, `frame7` shows it, `frame11` calls `stop()`. So the beats
are genuinely code-held and the 250 ms / 417 ms conversions follow from 24 fps (§N5). The DRAW
variant (`winwords.gotoAndStop(2)`), the `isRecording()` gate on both buttons, the replay URL
string, and the whole `respawnbutton` / `gold` / `getgoldpromptdialog` / `PayUI` set on LoseUI
all resolve verbatim, and `getgoldpromptdialog.show(1)` at `LoseUI.as:104` backs the "gold-gated
revive" reading.

**Correction (minor):** "brush stroke frames 1-6" is an inference, not a cite — nothing in the
three frame handlers touches `brushStroke`; its motion lives inside symbol2894. Say "frames 1-6
carry no script" rather than describing what the art does.

### 9. `ui-hud/interactui-menu-system` — **STANDS** (minor cite error)
**I opened:** `reference/extracted/android/90_InteractUI_UIData.bin` (whole file, parsed + lines 5-9,16,17,47-60).

Counts re-derived and **exact to the unit**: 20,947 bytes, 19 `<ui>`, 19 `<title>`, 47 `<menu>`,
139 `<option>`, 139 `<icon>`, 139 `<label>`, 28 `<condition>`, 28 `<has>`, 67 `<param>`. The 19
title line numbers and names are correct to the line: 5/14/47/66/73/82/94/109/117/142/161/190/
219/227/249/257/281/291/301 — peddler … towntoll. Lines 5-9 quote verbatim. This is the best-
evidenced claim in the set and the ledger really does omit the town interaction UI.

**Correction (minor):** the second quoted row is at **line 16, not 17**. Line 17 is
`<option><label>523</label><icon>15</icon><action><id>goto</id><param>2</param></action></option> <!-- "buy commodities" buyicon-->`.
The quoted `label 269 / icon 1 / has 20040 / errormsg 270` row is line 16 — and it is the file's
**only** `<errormsg>` (1 occurrence), so it is worth citing precisely.

### 10. `ui-hud/typography-edo-sz` — **STANDS** (minor)
**I opened:** `reference/extracted/ui_strings.txt:100,206,314` plus a full face/size/colour
inventory of the file; `reference/decompiled/shs3_android/scripts/LangManager.as:127-137`.

All three lines verbatim correct. The "13 px" that the claim asserts but does not quote **does
exist** — exactly one `face="Edo SZ" size="13" color="#cccccc"` — so the claim is right and merely
under-cited. Full inventory, which the lane should bank instead of the summary:
Edo SZ x15, Calibri x2; `(16,#ffffff)` x3, `(14,#cccccc)` x2, `(14,#ffffff)` x1, `(13,#cccccc)` x1,
`(18,#000000)` x1, Calibri `(14,#ffffff)` x2. `LangManager.as:127-137` is exact.

**Corrections (minor):** (a) the summary drops the Calibri pair and the 18px/#000000 style — a
rebuild told "Edo SZ everywhere" will be wrong twice; (b) the claim says it "carries no
Android-build caveat", which is true of `ui_strings.txt` (web payload) but not of the
`embedFonts` argument it leans on, which is Android `LangManager.as`. Split the provenance.

### 11. `ui-hud/tier3-video-repass-obsolete` — **REFUTED** (material) — the count is wrong and the recommendation is unsafe
**I opened:** `docs/research/REBUILD_READINESS.md:337-339`;
`shs3_android/scripts/TextProjectile.as:17-46`, `MCSPlayer.as:3805`, `DuelIntroBar.as:22,85-104`.

The ledger quote is verbatim correct and sits under "### Tier 3 — denser video re-passes"
(`:338`). Every code cite resolves: `ttl = 12`, `velY = -5`, `ttl < 10 → scale += 0.1`,
`ttl < 4 → alpha -= 0.25`; `createFloatingText(mcs.x, mcs.y - 100, damage.toString(), damagetextcol)`
at exactly `:3805`; `addFrameScript(0,frame1,19,frame20,68,frame69,87,frame88)` at `:22`, and I
read the handlers — `frame20 = showText()`, `frame69 = actionWord.visible = true`,
`frame88 = introEnd(); stop()`.

**Leg 1 — damage-popup animation: fully HELD.** 12-frame life, −5 px/frame rise, +10 %/frame growth
from frame 3, fade over the last 3 frames. Genuinely closed; that re-pass should not be funded.

**Leg 2 — "VS/FIGHT exact ms": PARTIAL.** The frame *gates* are exact (792 / 2833 / 3625 ms at
24 fps), but everything between the gates is timeline animation inside symbol2861. "Exact ms"
for the beats, yes; "fully specified in source", no.

**Leg 3 — "dialogue-box metrics": NOT closed.** It inherits claim 3, which I refuted above:
symbol83 still holds the panel and field rects.

So the count is 1 closed + 1 partial + 1 open, not "three … already fully specified", and the
operative sentence — *"so that work should not be funded"* — would kill two re-passes that are
still the only route to the missing halves. Refuted for the claim and the recommendation; leg 1
should be re-banked on its own as HELD.

### 12. `ui-hud/690-friend-bar-never-filmed` — **STANDS** (minor)
**I opened:** the eight frames myself with a per-column max-luminance measurement (threshold >25);
`reference/decompiled/shs3_android/scripts/GameEngine.as:268-283`.

Replicated **to the pixel**: video B `52→1867` (width 1816, aspect 1.681) in `duel_dense/_427.0`,
`_427.1`, `_427.2`, `_431.5`, `_428.0` and `duel_frames/_t425.0s`; video A `55→1861` (1807, 1.673)
and `54→1861` (1808, 1.674); rows `0→1079` in all eight — pillarbox only, no letterbox. The
PARTIAL verdict and the "authoring, not copying" warning are the right calls.

**The claim under-cites its own premise, which I supply:** `GameEngine.as:268-271` declares
`originalWidth = 800`, `originalHeight = 480`, `originalHeightWithBar = 690`, and `:275-283`
flips `StatsManager.stageShowingFriendBar` + calls `OverworldHUD.instance.friendpanel.init()`
whenever the window aspect ≤ 800/690 = 1.159. Measured 1.68 ≫ 1.159, so the friend bar is off in
every frame — a mechanism-level confirmation, not just an aspect coincidence. Third confirmation:
the slot row resolves to game y ≈ 450 only under a 480-tall viewport (under 690 it maps to ~647).

**Correction (minor):** "All approximately 5:3" — 5:3 is 1.667, the captures are 1.681 and 1.673.
That 0.8 % anamorphic stretch is small but it is exactly the error that produced claim 7's y = 446.
Worth carrying as a number, not rounding away.
**Worth knowing:** 690 is not an exotic branch — it is the web SWF's **own stage rect**
(§N5: `shs3_payload_decoded.swf` header = 800x690). The videos were captured with it suppressed.

### 13. `ui-hud/hud-symbol-metrics` — **STANDS** (the strongest claim in the set)
**I opened:** the `[Embed]` line of all eight named classes.

Every symbol number is exact: BattleUI `symbol2952` (`:10`), OptionsUI `symbol1133` (`:7`),
DialogBox `symbol83` (`:8`), SkillSlotButton `symbol2915` (`:6`), WinUI `symbol2894` (`:7`),
BattleIntroBar `symbol2855` (`:5`), DuelIntroBar `symbol2861` (`:6`), ScreenTransition
`symbol2758` (`:5`). `SkillSlotButton.as:87` is `ResourceManager.getSkillImage(this._skillId)` as
stated, and `battlemodebust` is demonstrably the stance control (hover label `:192-193`, hit test
`:275`), so declining to name the slot-3 up-arrow is right.

This claim is also the internal witness against claims 3 and 5: it correctly states that symbol
geometry is not on disk. Where it and claims 3/5 conflict, **this one is right**.
One addition: "only `scripts/` was exported" is true of the Android bundle, but the **web**
payload was exported too (612 mangled classes) — see §N7. That does not weaken this claim; the
web export is also scripts-only.

---

## New findings the surveyor missed

**N1 — the web BattleUI is not the Android BattleUI, and the Android string table cannot
resolve it.** `shs3_payload/scripts/§1t113s0§.as` (the web build's BattleUI — identified by
`getString(619)`/`getString(620)` on the autoslash labels and the `760 - i*60` slot loop at
`:169-171`) is **1,344 lines** to Android `BattleUI.as`'s **939**, and calls 11 string ids the
Android class never calls: 960, 11119-11126, 11130, 11131. **None of the 11 exist in
`118_Mobile_Lang_EN.bin`** (max numeric resname there is 9010). `:1269-1316` is an 8-branch
selector writing `htmlText` into a status field with two `<font color='#FF0000'>` variants.
This is the buff/status readout the frame shows and the Android build cannot render.

**N2 — the web combat HUD carries two status lines that appear in no Android artifact.** Crop
(0,910)-(700,1080) at 2x of `duel_dense/Nr4fQstqHDM_428.0.png`: circular portrait, green HP bar
`20/20`, blue Chi bar `26/26`, then a brown plaque **CANNOT CHANGE STANCE** and a yellow
**150% DAMAGE**. "Cannot change stance" is in 0/2,555 Android trans-units; `150% Damage` exists
only inside an item description (resname 4132, a potato buff), never as a HUD line. THE FRAME WINS.

**N3 — blocker ② "bar tween vs snap" is closed, and it is snap.** `BattleUI.as:246-256`:
`hptext.text = hp + "/" + maxhp; hptextshadow.text = …; hpbar.bar.scaleX = hp / maxhp;` and the
same three for chi. Direct assignment, no tween, no easing, continuous (not quantised). The
paired `*shadow` field is a drop-shadow duplicate — a real fidelity detail. Frame-confirmed: the
`20/20` / `26/26` readouts sit centred on full green/blue bars in the crop above, matching the
`hp + "/" + maxhp` format exactly.

**N4 — blocker ② "combo pop": content closed, pop still open.** `BattleUI.as:98-100,382-395`:
`combo.combolabel.text = getString(45)` = `Hit Combo`; `showCombo(num)` writes `combo.combo.text`
**and** `combo.comboshadow.text`; `hideCombo()` just sets `visible = false`. Frame-confirmed —
crop (1560,0)-(1920,200) at 3x shows a red brush "3" with a hard black offset shadow over a black
`HIT COMBO` plaque. The number+shadow structure and the label are held; there is **no** code-side
animation, so the "pop" is timeline motion inside symbol2952 and remains unheld. PARTIAL.

**N5 — the 24 fps every ms figure in this lane depends on, byte-checked.** SWF headers read
directly: `reference/decrypted/shs3_android_payload_decoded.swf` = CWS v26, stage **800x480**,
**24.0 fps**; `reference/decrypted/shs3_payload_decoded.swf` = CWS v17, stage **800x690**,
**24.0 fps**; `reference/preservation/shs3.swf` = CWS v10, stage **800x690**, **24.0 fps**. Both
builds run at 24 fps, so claims 2, 8 and 11's frame→ms conversions are sound; and the web stage
rect is natively the 690 friend-bar layout (see claim 12).

**N6 — a third combat meter exists in code and is absent from the frame.** `BattleUI.as:48,60,102,259-262`:
a `reloadbar` plus a `crittext` set to `getString(175)` = **"Critical Hit"**, shown when
`percentage >= 1 && reloadbar.visible`. It is live, not dead code — `MCSPlayer.as:241,1168,3112,3272`
drive it from `reload / maxreload` (with a `- 24` offset, i.e. one second at 24 fps). But
`reloadbar.visible` is never assigned in any Android script, and the frame crop shows **two bars
only**. So: the widget is code-held, frame-absent. The memory line "OG has NO Critical meter"
survives at the frame level; treat this as a lead for skills-meters, not an overturn.

**N7 — the web payload's logic IS on disk; the parity caveat is dischargeable by diff, not by
video.** `reference/decompiled/shs3_payload/scripts/` holds **612 identifier-mangled AS3 classes**
(`§1t…s0§.as`). Names are mangled but numeric and string literals survive intact, so any
Android-sourced constant in any lane can be checked against v0.717 directly. Already confirmed
this way in this lane: slot geometry (`§1t113s0§.as:170-171` = `760 - i*60`, `y = 450`), the whole
DialogBox metric set (`§1t5474s0§.as:46,49,53,57,86,105,107,136,147` — same values, same line
numbers), and the transition constants (`§1t6497s0§.as:89,100-103,113`). Cheapest recipe: grep
the mangled tree for the literal.

---

## Scoring note

The lane's own residual claim (13) is right that the remaining gap is a JPEXS symbol export. But
the 88 rests partly on claims 3, 5 and 7, two of which close blocker ⑤ without producing a metric
and one of which retires a parity caveat that the web build's own code contradicts. Netting the
refutations against the four genuine additions above (N1/N3/N4/N7 are all lane-relevant), the
honest range is **83-85**, not 88 — and the ⑤ line in the ledger should stay open.
