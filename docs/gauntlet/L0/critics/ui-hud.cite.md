# CITE-LENS REVIEW — unit: ui-hud (Pass 2 output)

Reviewer: blind critic, LENS 1 (over-claiming / mis-citation).
Method: every cite opened first-hand. Frames cropped + upscaled with PIL and LOOKED AT.
Code lines re-read with `sed -n` and line-numbered. XLIFF blob re-parsed from raw bytes.
No verdict below is second-hand.

**Score: 13 claims judged. 9 HELD, 4 REFUTED (all four are over-claims, none are fabrications).
Zero fabricated cites found — every file path and every quoted string exists. The failures are
all of one species: a real, correctly-quoted code line stretched into a "blocker closed" verdict
it does not support.**

---

## VERIFIED INFRASTRUCTURE (established before judging any claim)

**Android payload SWF header, read from bytes** (`reference/decrypted/shs3_android_payload_decoded.swf`):
signature `CWS`, **framerate = 24.0 fps**, **stage rect = 0,800 x 0,480 px** (16000 x 9600 twips).
This independently grounds every "@24fps" conversion in the unit under review, and the 480 stage
height. `GameEngine.as:442` — `stageMC.addEventListener(Event.ENTER_FRAME,gameloop)` — confirms
`update()` is one call per SWF frame, so frame counts convert to ms at 24 fps.

**`LangManager.getString()` really is resname-keyed.** `LangManager.as:73-76` →
`Locale.loadStringEx(num.toString(),language)`. Corroborating structural proof the surveyor did not
give: `LangManager.as:96-104` `getQuestString(id:String)` feeds the SAME `Locale.loadStringEx` with
`"IDS_..."` keys. Every `id` in the blob is numeric, so an `IDS_*` key can ONLY be a resname.

---

## CLAIM-BY-CLAIM

### 1. `ui-hud/langmanager-uses-resname-not-id` — **HELD**
Own cite: crop (40,0)-(560,200) of `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, upscaled 3x
(LANCZOS) — **I looked at it**: a brown plaque with a gold inner rule, top-left, reading
**AUTO SLASH OFF** in the white brush face.
`BattleUI.as:124` verified verbatim: `this.autoslashofflabel.text = LangManager.getString(619);`
Raw-blob re-parse of `118_Mobile_Lang_EN.bin` (UTF-16LE) reproduces the surveyor's numbers **exactly**:
2,555 trans-units; first unit `id="0" resname="0"`; first divergence `id="212" resname="222"` source
`CHI`; 2,343 units with id != resname; 649 non-numeric resnames, first `id="1906" resname="IDS_Q0TITLE"`.
Source text under each map: `resname 619` = `Auto Slash Off`; `id 619` (= resname 638) = `Special Event`.
**THE FRAME WINS, and it wins for resname.** Cross-lane correction stands.
Sub-corrections spot-checked in `strings.json`: 388 = `Condition: Poor`, 407 = `Game Paused`,
6014 = `Skill Slots+`, 7009/7010/7011 = `4/5/6 skill slots`, 104 = `FIGHT!` (id 104 = resname 104,
below the divergence point — Pass 1's FIGHT! survives, as claimed).

### 2. `ui-hud/transition-durations-exact` — **REFUTED (material)**
Cite resolves; quote is verbatim; **the number is wrong for one of the two shutters and the stated
arithmetic is wrong.**
I simulated `ScreenTransition.update()` exactly as decompiled (`++counter`, then `y += speed`, then
`speed += 2`):
- Speed used on frame *n* is `2(n-1)`, so displacement after *n* frames is **n(n-1)**, not `(n-2)(n-1)`.
  It reaches 240 px at **n = 16**, not 17.
- `TRANSITION_BLACKCLOSE` (`:78-91`) — geometry closes at frame 16, but `if(this.counter >= 17)`
  holds `doAction()` one extra frame → **17 frames / 708 ms. Correct, but for the gate, not the geometry.**
- `TRANSITION_BLACKOPEN` (`:93-108`) — **has NO counter gate**; the only exit is `blackup.y <= -240`,
  which fires at **frame 16 → 667 ms**. Simulated: `OPEN doAction at frame 16 y -240.0`.
So "**each** black shutter takes 17 frames (708 ms)" is false. Close = 17, open = 16.
White fade `white.alpha -= 1/24` (`:111`) → 24 frames / 1000 ms: accepted (in IEEE-754 the 24th
subtraction leaves ~2e-16, so `visible=false` lands on frame 25, but alpha is visually 0 at 24).
Everything else in the claim (480-px stage height corroboration) holds and is independently confirmed
by the SWF header above.

### 3. `ui-hud/dialogbox-metrics-in-code` — **REFUTED (material over-claim)**
All seven cited lines resolve **verbatim**: `:46` `button.x = 340`, `:49` `msgText.y = 187.5`,
`:53` `msgText.y = 220`, `:59` `align = "center"`, `:63` `align = "left"`, `:136` `button.x = 270`,
`:147` `button2.x = 425`. The narrow fact is true.
But the claim's own headline — "*Dialogue-box exact metrics are NOT locked inside an assets.swf
symbol*" — is false. I grepped **every** geometry assignment in `DialogBox.as`:
```
46,86,162: button.x   105,147: button2.x   49,53,89,93: msgText.y
```
That is the complete list. `button.y`, `button2.y`, `msgText.x`, the text-field bounds, the font size,
and the panel art/placement are **all** still inside `[Embed(source="/_assets/assets.swf",
symbol="symbol83")]` (`DialogBox.as:8`), which the same survey admits (claim 13) was never exported.
Three x/y overrides is not "blocker ⑤'s dialogue half closed"; ⑤ says *exact metrics*.

### 4. `ui-hud/pause-is-click-anywhere` — **HELD**
All three cites resolve verbatim at the exact line numbers:
`:179` `this.pausebutton.visible = !GameEngine.isDuelMode() && !GameEngine.isPvPRoomMode();`
`:267-272` the `if(GameEngine.isPaused){ setPaused(false); pauseScreen.visible=false; return true; }`
block — and it genuinely IS the first test in `gotClicked` (only `var i:int = 0;` precedes it).
`:324-328` `togglePaused(); pauseScreen.visible = true; setChildIndex(pauseScreen,numChildren-1);`
Traced the caller to close the loop: `InputManager.as:252-254` gates `BattleUI.instance.gotClicked`
on `drawArrayLength <= lengthThreshhold` — i.e. a tap, not a slash gesture. "Any click anywhere
resumes" is right; strictly it is "any tap short of the slash threshold". Immaterial.

### 5. `ui-hud/options-screen-complete` — **REFUTED (material over-claim)**
Copy is 100% correct — `:34-43` and `:44-51` resolve verbatim, six `XCheckBox` members confirmed at
`OptionsUI.as:11,13,15,17,19,23`, and all nine resnames resolve: 6/7/8/396/492/752/74/75/10 =
Music / Sound / Blood / Chat notification / Record Duels / Full Screen / Title Screen / Return To Game /
Options.
**But `overturns_ledger: true` against "⑤ pause/options/dialogue-box exact *metrics*" is wrong.**
`grep -n "\.x =\|\.y =\|\.width\|\.height" OptionsUI.as` returns **nothing — zero geometry
assignments in the entire class.** Every metric of the Options screen is inside
`symbol1133` (`OptionsUI.as:7`), unexported. This claim supplies string content and closes none of ⑤.
"Completely held" is false for the thing the blocker actually asks for.

### 6. `ui-hud/skill-cooldown-12-step-quantised` — **HELD**
All five cites resolve verbatim at the exact lines: `:220` `newframe = int(this.cooldown /
this.cooldownmax * 12) + 1;`, `:146` `this.shade.gotoAndStop(13);` inside `disableButton`, `:110`
kunai ammo, `:114` Windmill `/4`, `:153` the SHUNPO/THOUSANDSTABS/DEADLYCLEAVE stance gate.
Range-checked the quantiser myself: `cooldown` is decremented *before* the expression (`:219`), so the
ratio is always < 1 and `newframe ∈ [1,12]`, leaving frame 13 exclusively for disabled. The claim's
"12 steps + 13th" is arithmetically exact.
Added detail the claim under-states: `levelText` normally carries the skill level as a **Roman
numeral** (`:60-81`, `"I".."X"`); the ammo count *overwrites* that numeral. So the readout is
mutually exclusive with the level display.

### 7. `ui-hud/slot-geometry-frame-validated` — **REFUTED (material) — but the geometry finding itself survives**
I re-measured the frame from scratch and **reproduced the surveyor's core numbers**:
- content extents (max-luminance > 25): cols **52 → 1867, width 1816**, rows 0 → 1079. Identical.
- empty-slot bright border (threshold 150): cols **1448 → 1559, centre x = 1503.5** — x centre matches
  to the pixel. (My row span was 961→1072, centre 1016.5, vs the claim's 952→1073 / 1012.5 —
  threshold-dependent.)
- I also measured the **digit label centres** independently: "2" at x=1641.0, "3" at x=1777.5 →
  **pitch 136.5 frame px**, vs the claim's 137. Either converts to ~60.1–60.4 game px against
  `skillSlotButton.x = 760 - i * 60` (`BattleUI.as:133`). **The 60-px pitch is real and reproducible.**
- The crop content is exactly as described: three slots, leftmost **empty and unnumbered** with a
  *bright* border, middle "2" with a claw icon, right "3" with a gold up-arrow. The bright border is
  explained by `initEmpty()` `this.shade.visible = false` (`SkillSlotButton.as:129`) — the shade
  overlay is removed, so the un-dimmed art shows. Consistent with `initKeyPressText(slotCount - i)`
  (`BattleUI.as:504`) never running for that slot.

**Why refuted anyway — two sub-assertions are wrong:**
(a) **"to within ~1 px" is contradicted by the claim's own numbers** (x 639.4 vs 640 = 0.6 px, but
y 446.0 vs 450 = **4 px**), and the scale model used to get them is contradicted by the game's own
code. `GameEngine.resizeHandler` (`:267-306`) picks `newScale = stageHeight/originalHeight` with
`offsetX = (stageWidth - originalWidth*newScale)/2` whenever `originalAspectRatio < newAspectRatio` —
and 800/480 = 1.667 **is** less than the measured 1816/1080 = 1.681. So the correct conversion is
**scale 2.25, offsetX = 52 + 8 = 60**, not "width 1816, scale 2.270, x0 = 52". Redone properly:
game x = (1503.5 − 60)/2.25 = **641.6** (code 640) and game y = 1016.5/2.25 = **451.8** (code 450) —
within ~2 px on **both** axes. The surveyor's conclusion is stronger than its own arithmetic; the
arithmetic is still wrong.
(b) **"retires the 'android parity not established' caveat for the combat HUD" is refuted by the same
frame.** See NEW FINDING A below.

### 8. `ui-hud/result-cards-exact` — **HELD**
`WinUI.as:26` `addFrameScript(0,this.frame1,6,this.frame7,10,this.frame11);` verbatim. I opened the
frame handlers the claim did not quote and they confirm the beats exactly:
`frame1(){ this.winwords.visible = false; }` · `frame7(){ this.winwords.visible = true; }` ·
`frame11(){ stop(); }`. At the header-verified 24 fps: winwords at 6/24 = 250 ms, stop at 10/24 = 417 ms.
Draw branch verbatim at `:49-56`. Replay URL verbatim at `:90`. `LoseUI.as:35,36,45,53` verbatim.
Resnames check out (482 Continue, 483 Save Replay, 480 Respawn).
I went one step further on the paywall and it is stronger than stated: `LoseUI.as:94-107` —
`StatsManager.spendHeavenlyGold(1, success → reportPremiumBuy(3,"respawn",1) …, fail →
getgoldpromptdialog.show(1))`. **Revive costs exactly 1 Heavenly Gold**, and failure opens the
purchase prompt. Economy lane should take that number.

### 9. `ui-hud/interactui-menu-system` — **HELD** (one off-by-one cite, non-fatal)
Re-counted the blob myself: **20,947 bytes** ✓, `<uidata>` root ✓, **19 `<ui>` / 19 `<title>` / 47
`<menu>` / 139 `<option>` / 139 `<icon>` / 28 `<condition><has>` / 67 `<param>`** — every count exact.
The 19 title line numbers are exactly 5/14/47/66/73/82/94/109/117/142/161/190/219/227/249/257/281/291/301
with exactly the names given. Lines 5-9 quoted verbatim.
Verified the ledger omission first-hand: `REBUILD_READINESS.md:234` ui-hud Ready bullet reads
"combat-HUD geometry (frame-measured fractions); two-beat VS→FIGHT intro; result cards; overworld HUD
layout; 8-icon menu ribbon; minimap; (EQ:n) UX; parchment chrome family; login + character-creation
screens; transition timings" — **no town/interaction UI**. Under-claim confirmed.
Nit: the gated `<option>` the claim quotes is on **line 16**, not the cited line 17 (line 17 is
`<label>523</label>` "buy commodities"). Off-by-one on a secondary line; the text is verbatim; not
disqualifying. Labels resolve: 83 = `Buy`, 269 = `Sell crops`, 270 = `You do not have any crops for sale.`

### 10. `ui-hud/typography-edo-sz` — **HELD**
`reference/extracted/ui_strings.txt` lines 100, 206, 314 all resolve verbatim (I printed them by
index). `LangManager.as:127` `initTextField` confirmed — `embedFonts = false` only for CHINESE and
JAPANESE.
Full histogram over the file, which the claim summarises fairly but not completely:
`face="Edo SZ"` ×15, `face="Calibri"` ×2 · `size` 13 ×2, 14 ×10, 16 ×4, **18 ×1** ·
`color` #ffffff ×11, #cccccc ×3, #000000 ×2, #333333 ×1. The 13-px instances are indeed
`Edo SZ … #cccccc` (`:294`), so "13/14 px #cccccc body" is grounded. The one 18-px case is
`Edo SZ … #000000` (`:460`) and is elided. Minor, does not change the verdict.
Note for the record: the supporting `LangManager.as` half of the argument is from the **Android**
decompile, so "carries no Android-build caveat" is true of the `ui_strings.txt` evidence only.

### 11. `ui-hud/tier3-video-repass-obsolete` — **REFUTED (material)**
Ledger line quoted verbatim — confirmed at `REBUILD_READINESS.md:339`.
Two of the three sub-items genuinely are closed from source, and I verified both beyond the claim:
- **damage-popup animation**: `TextProjectile.as:20` `ttl = 12`, `:23` `velY = -5`, `:39-46`
  `scale += 0.1` once `ttl < 10`, `alpha -= 0.25` once `ttl < 4`, removal at `ttl <= 0`. Complete
  12-frame (500 ms) spec. Spawn point `MCSPlayer.as:3805` resolves **exactly** verbatim.
- **VS/FIGHT exact ms**: I opened the frame handlers the claim did not:
  `frame1(){ actionWord.visible = false }`, `frame20(){ showText() }`, `frame69(){ actionWord.visible
  = true }`, `frame88(){ introEnd(); stop() }` → 0 / 792 / 2833 / 3625 ms at 24 fps. Closed.
  (Cite nit: `addFrameScript` is on `DuelIntroBar.as:23`, not the cited `:22`.)
- **dialogue-box metrics: NOT closed.** Per claim 3 above, only `button.x`, `button2.x` and
  `msgText.y` are code-held; the panel, the text-field bounds, the button y and the font size are in
  the unexported `symbol83`. **Recommending that this Tier-3 slice "should not be funded" is wrong
  advice**, and it is wrong in the same file the survey itself flags as unexported in claim 13.

### 12. `ui-hud/690-friend-bar-never-filmed` — **HELD (PARTIAL, honestly graded)**
I measured all seven cited frames myself and **reproduced every number to the pixel**:
```
Nr4fQstqHDM_427.0 / 427.1 / 427.2 / 431.5 / t425.0s : cols 52→1867  w 1816  rows 0→1079  aspect 1.681
zFtCaTO0_1M_t0320s : cols 55→1861 w 1807 rows 0→1079 aspect 1.673
zFtCaTO0_1M_t0325s : cols 54→1861 w 1808 rows 0→1079 aspect 1.674
```
All seven files exist. Pillarbox only, no letterbox — as stated.
And the code half is stronger than the claim shows: `GameEngine.as:271` `originalHeightWithBar = 690`,
`:275` `originalWithBarAspectRatio = 800/690 = 1.159`, `:276-279` the bar engages **only** when
`newAspectRatio <= 1.159`. Observed 1.673–1.681 ≫ 1.159 → friend bar provably off in every filmed
frame. `OverworldHUD.as:390` `this.friendpanel.y = 480` confirms it hangs below the 480 game area.
The PARTIAL verdict and the "authoring, not copying" warning are correct and well-judged.

### 13. `ui-hud/hud-symbol-metrics` — **HELD (correct STILL_UNHELD)**
I verified all eight `[Embed]` symbol ids first-hand — BattleUI **2952**, OptionsUI **1133**,
DialogBox **83**, SkillSlotButton **2915**, WinUI **2894**, BattleIntroBar **2855**, DuelIntroBar
**2861**, ScreenTransition **2758** — every one exact. `ls reference/decompiled/shs3_android/` returns
`scripts` and nothing else, so "only scripts/ was exported" is literally true.
`SkillSlotButton.as:87` `this.image = ResourceManager.getSkillImage(this._skillId);` and
`ResourceManager.as:302` confirm the slot art is a runtime skill image, and `battlemodebust` is a
separate member (`BattleUI.as:26`) with its own `stancecolor1` / `highlight` / `bustcanvas`. Refusing
to name the slot-3 skill is the right call. This is exactly the respected STILL_UNHELD the law asks for.

---

## NEW FINDINGS (things the surveyor missed)

### A — THE FRAME WINS: the web HUD shows copy that does not exist in the Android string table
**A1.** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, crop (150,995)-(600,1080) upscaled 4x.
Visibly, under the blue Chi bar: a brown/gold plaque reading **"CANNOT CHANGE STANCE"**, and below it
in gold brush caps **"150% DAMAGE"**. (Same frame, crop (120,900)-(560,1020): the circular
stance-coloured bust portrait with a **red** ring, a green HP bar `20/20`, a blue Chi bar `26/26`.)
Now the payload check. In `118_Mobile_Lang_EN.bin` (2,555 units, searched raw):
- `"annot change"` → **0 hits.** `"CANNOT"` → **0 hits.**
- The only stance label is `<trans-unit id="208" resname="208"><source>Change Stance</source>` — which
  is what `BattleUI.as:110` assigns to `changestancelabel`, shown on `MOUSE_OVER` of `battlemodebust`
  (`BattleUI.as:192,432`), not as a persistent status plaque.
- `"150%"` → 8 hits, **all item descriptions** ("Eat this potato to get the 150% Damage buff.",
  resname 4132) — no standalone HUD label.
- `grep -ril "cannot change stance" reference/extracted/` → **nothing**, so it is not in the web
  extraction either.
**Consequence:** the web v0.717 combat HUD carries at least two text elements the Android v0.682
string table cannot produce — a **stance-lock status plaque** and an **active-buff readout**. This
directly refutes claim 7's "retires the 'android parity not established' caveat for the combat HUD".
Parity is established for HUD **geometry** (60-px slot pitch, x=640, verified above); it is
**refuted** for HUD **copy and state**. S0-3's caveat stands. Both elements are also absent from the
ledger's ui-hud Ready bullet.

### B — Ledger blocker ④ is factually wrong, and it is closeable
`REBUILD_READINESS.md:235` ④ reads: *"the '3 skill slots' is really ~2 abilities + a stance up-arrow."*
The frame + code say otherwise. In `Nr4fQstqHDM_428.0.png` crop (900,900)-(1880,1080), 2x, the three
boxes are: **an empty, unnumbered, un-shaded slot** (left), **slot "2"** with a claw icon, **slot "3"**
with the gold up-arrow. The stance control is **not** any of them — it is the circular bust bottom-left
(`battlemodebust`, `BattleUI.as:26,275,374`, click → `stanceButtonClick()`), 1,100 px away on the
opposite side of the HUD. `BattleUI.as:500-511` explains the empty box: `visible = i < slotCount`
makes 3 boxes, and the third fails `StatsManager.skillSlots[i] != null` so `initEmpty()` runs, clearing
`keypressText` (hence unnumbered) and hiding `shade` (hence the brighter border).
So it is **2 equipped abilities + 1 genuinely empty slot**, and the up-arrow **is** one of the two
abilities. Blocker ④ should be struck, not narrowed.

### C — Ledger blocker ① (aspect-ratio truth) is closed from source, no build required
`REBUILD_READINESS.md:235` ① asks *"5:3 native → are x-fractions pillarbox-wrong? — read
`stage.stageWidth` in a build."* There is no build, but there is `GameEngine.resizeHandler`
(`:267-306`), which is the whole answer:
```
originalWidth 800 · originalHeight 480 (690 with friend bar)
if(originalAspectRatio >= newAspectRatio)  newScale = stageWidth/800;   offsetY = (stageHeight-480*newScale)/2; fitWidth=true
else                                       newScale = stageHeight/480;  offsetX = (stageWidth -800*newScale)/2; fitWidth=false
StatsManager.stageScale / stageOffsetX / stageOffsetY / stageFitWidth / stageBaseWidth / stageBaseHeight
```
Uniform min-fit, centred on the overflow axis. Applied to the measured video B content region
(1816 x 1080, aspect 1.681 > 1.667): **height-fit, scale = 2.25, offsetX = 8 px, offsetY = 0** — i.e.
the game content is 1800 px wide inside an 1816-px pillarboxed region, so **x-fractions measured
against the full frame ARE wrong**, by the 52-px video pillarbox *plus* an 8-px in-engine inset.
Any lane holding frame-measured x-fractions should re-derive with `x_game = (x_frame − 60)/2.25`.

### D — Revive price is a hard number
`LoseUI.as:94` `StatsManager.spendHeavenlyGold(1, …)` with failure → `getgoldpromptdialog.show(1)`
(`:104`) and `QueryManager.instance.reportPremiumBuy(3,"respawn",1)` (`:96`). **1 Heavenly Gold per
respawn.** Belongs to the economy lane, which the survey only gestured at.
