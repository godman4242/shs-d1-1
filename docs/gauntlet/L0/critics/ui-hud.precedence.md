# ui-hud — PRECEDENCE CRITIC (blind, Lens 3)

Reviewer opened every artifact first-hand. No verdict below rests on the surveyor's text.
Standing invariant applied: **when a measurement doc and a frame disagree, the frame wins.**

Headline: **4 of 13 claims refuted** (2 material derivation errors, 1 material
"blocker closed" over-claim ×2, 1 material *existence* error). The two strongest claims
(resname keying; InteractUI subsystem) survive intact and one of them catches a
**fabricated verbatim quote inside this lane's own Pass-1 journal**.

The single biggest miss: **the JPEXS symbol export the pass says is missing already exists
on disk**, from the WEB payload, and I opened it.

---

## Commands / measurements I ran myself

```
python3  parse 118_Mobile_Lang_EN.bin        -> 2555 <trans-unit>; first divergence id="212" resname="222";
                                                649 non-numeric resnames; 2343 rows with id != resname
python3  SWF header parse reference/decrypted/*.swf
   shs3_payload_decoded.swf          CWS v17  stage 800x690 px  fps 24.0  frames 6     (WEB)
   shs3_android_payload_decoded.swf  CWS v26  stage 800x480 px  fps 24.0  frames 6     (ANDROID)
python3  simulate ScreenTransition   -> CLOSE done at frame 17 · OPEN done at frame 16 (y = -240.0)
                                     -> WHITE: 25 frames under IEEE double, 24 under float32
python3  PIL crop+3x  duel_dense/Nr4fQstqHDM_428.0.png (40,0)-(560,200)     -> reads "AUTO SLASH OFF"
python3  PIL crop+3x  duel_dense/Nr4fQstqHDM_428.0.png (1380,920)-(1880,1080) -> 3 slots, empty/2/3
python3  pillarbox scan, 63 random frames across all 18 reference/frames/ subdirs
grep -n '\.x =|\.y =|width|height|scale' DialogBox.as   -> exactly 10 hits, all button.x/button2.x/msgText.y
```

---

## Verdicts

### 1. `ui-hud/langmanager-uses-resname-not-id` — **UPHELD, and stronger than claimed**
I cropped `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` at (40,0)-(560,200) and upscaled
3x: a brown gold-bordered plaque top-left reads **AUTO SLASH OFF**. I then parsed the blob
myself: 2,555 `<trans-unit>`, first divergence at `id="212" resname="222"`, 649 non-numeric
resnames, 2,343 rows where `id != resname`. `resname 619 = "Auto Slash Off"` /
`resname 620 = "Auto Slash On"` against `id 619 = "Special Event"` / `id 620 = "Unbreakable"` —
and the two AS3 fields are literally named `autoslashofflabel` / `autoslashonlabel`
(`BattleUI.as:124-125`). That is a second, frame-independent proof the surveyor did not use.
`LangManager.getString` → `Locale.loadStringEx(num.toString(), language)` (`LangManager.as:78`),
and `fl.lang.Locale` is resname-keyed. **THE FRAME WINS.**

**Bonus refutation of the lane's own journal.** `docs/gauntlet/L0/systems/ui-hud.md:465`
quotes `<trans-unit id="388" resname="388"><source>Game Paused</source></trans-unit>`.
That string does not occur in the blob (`'<trans-unit id="388" resname="388">' in d` → `False`).
The real row is `<trans-unit id="388" resname="407">\r\n<source>Game Paused</source>`, and
`resname 388 = "Condition: Poor"` sits on `id="369"`. Pass 1 wrote a verbatim quote that does
not exist. Pass 2 caught the consequence; nobody caught the fabrication. Flagging it here.

### 2. `ui-hud/transition-durations-exact` — **REFUTED (material)**
"**each** black shutter takes 17 frames" is wrong. `TRANSITION_BLACKOPEN`
(`ScreenTransition.as:93-108`) has **no `counter` gate** — unlike `BLACKCLOSE` it fires
`doAction()` the instant `blackup.y <= -240`. Simulated: **OPEN completes at frame 16**
(y lands on exactly -240.0), i.e. **666.7 ms**, not 708.

The derivation is also wrong. Speed is applied *before* it increments, so displacement after
n frames is **n(n-1)**, not the quoted `(n-2)(n-1)`. n=16 → 240 exactly. So the shutter is
physically shut at frame 16 and the `counter >= 17` gate holds it one *extra* frame — that gate
is not "why" the arithmetic lands on 240. The two formulas coincide numerically at 240 by
accident; they diverge everywhere else.

Surviving: CLOSE = 17 frames / 708.3 ms (confirmed by simulation). WHITE = 24 frames, but only
because `startOpenWhite`'s **sole** caller is `Overworld.as:377` passing
`ACTION_REFRESHROOMONOPEN`, whose case re-sets `transitioning = true` after the `counter == 2`
`doAction()` — otherwise the fade would freeze at alpha 0.917. The surveyor never checked that.
And "**exactly** 24" is not exact: `alpha -= 1/24` from 1.0 needs **25** iterations under IEEE
doubles and only lands on 24 if Flash stores `DisplayObject.alpha` as float32.

24 fps itself is fine, but the pass never cited it. It is not `Mobile.as:117` (a
`frameRate == 0` fallback) — it is the SWF headers: **both payloads are 24.0 fps**, parsed above.

### 3. `ui-hud/dialogbox-metrics-in-code` — **REFUTED (material)**
The three quoted assignments are real and line-exact (`:46, :49, :53, :86, :105, :136, :147,
:162`). But I grepped every geometry assignment in the file:

```
46: button.x = 340 · 49: msgText.y = 187.5 · 53: msgText.y = 220 · 86: button.x = 270
89/93: msgText.y · 105: button2.x = 425 · 136: button.x = 270 · 147: button2.x = 425
162: button.x = 340
```

Ten hits, three distinct properties. `DialogBox.as` **never** sets `button.y`, `button2.y`,
`msgText.x`, `msgText.width/height`, or any panel dimension — all of which live in
`[Embed(source="/_assets/assets.swf", symbol="symbol83")]` (`DialogBox.as:8`), which the pass's
own claim 13 says is not on disk. So "Dialogue-box exact metrics are **NOT** locked inside an
assets.swf symbol" is false: most of them are. `overturns_ledger: true` against
"⑤ pause/options/dialogue-box exact **metrics**" is not earned, and claims 3 and 13 contradict
each other inside the same submission.

### 4. `ui-hud/pause-is-click-anywhere` — **UPHELD (behaviour), ledger flag mis-set (minor)**
All three cites verified: `:179` visibility, `:268-272` the resume branch is genuinely the FIRST
test in `gotClicked`, `:324-328` toggle + `setChildIndex(pauseScreen, numChildren-1)`. Behaviour
holds. But the claim supplies **zero metrics** and blocker ⑤ is literally "exact metrics", so
`overturns_ledger: true` is wrong in kind. It is also unnecessary — see New Finding N2, where
the actual pause-screen geometry turns out to be sitting on disk unopened.

### 5. `ui-hud/options-screen-complete` — **REFUTED (material)**
Every string resolves exactly as quoted (`:34-43` verified; resnames 6/7/8/396/492/752/74/75/10 →
Music / Sound / Blood / Chat notification / Record Duels / Full Screen / Title Screen /
Return To Game / Options). That part is clean. But "**completely held**" is false:
`OptionsUI.as` contains **not one coordinate, size, or checkbox position** — the entire layout is
inside `[Embed(... symbol="symbol1133")]` (`OptionsUI.as:7`). It also omits a member of the
screen: `public var quitdialog:QuitDialog` (`:25`), reset on every `show()`. Flagging
`overturns_ledger: true` on a blocker whose text is "exact metrics", from a claim with no
metrics in it, is exactly the move Lens 3 exists to catch.

### 6. `ui-hud/skill-cooldown-12-step-quantised` — **UPHELD on substance, ledger flag wrong (minor)**
All five cites line-exact. The 12-step math checks out: init latches `shade.gotoAndStop(12)`
(`:105`), `update()` decrements *then* computes `int(cooldown/cooldownmax*12)+1` (`:219-220`) so
the sweep spans 12→1, and 13 is the disabled frame (`:146`, `:153`). Ammo readout confirmed
(`:110`, `:114`).
Two corrections: (a) `overturns_ledger: true` contradicts the claim's own `lane_impact`, which
says it "**extends** blocker (2)" — none of "bar tween vs snap, combo pop, vignette ramp" is
resolved; extending a blocker is not overturning it. (b) "the same no-tween, snap character as
the HP/Chi bars" is loose — `BattleUI.as:261` sets `reloadbar.bar.scaleX = percentage`, which is
continuous, not quantised.

### 7. `ui-hud/slot-geometry-frame-validated` — **UPHELD, but the quoted measurement is wrong (minor)**
Substance is right and in fact **better** than claimed. My correction:

| | surveyor | me (reproducible) |
|---|---|---|
| empty-box bright cols | 1449→1558, ctr 1503.5 | 1448→1560, ctr **1504.0** ✓ agrees |
| empty-box bright rows | 952→1073, ctr 1012.5 | 960/961→1073, ctr **1016.5** ✗ |
| derived game (x,y) | (639.4, **446.0**) vs code (640, 450) | see below |

`rows 952` does not reproduce at any threshold I tried (120/150/180). Their y is 4 px off — so
the headline "**to within ~1 px**" is not supported by their own arithmetic.

Use the game's own fit routine instead of an ad-hoc uniform scale. `GameEngine.resizeHandler`
(`:267-307`): for content wider than 800/480 it takes the else branch, `newScale =
stageHeight/480`, `offsetY = 0`. With scale 2.25 vertically and the measured 2.27 horizontally,
**all three visible slots** land on the code constants:

```
box centres (frame x)  1503.0   1641.0   1777.5     [digits "2" and "3" measured at 1641.0 / 1777.5]
-> game x              639.4    700.0    760.1
code  x = 760 - i*60   640      700      760        (i = 2, 1, 0)      <- 0.6 / 0.0 / 0.1 px
game y = 1016.5/2.25 = 451.8   vs code y = 450                          <- 1.8 px
```

That is a much stronger result than the pass reported. Separately, "retires the *android parity
not established* caveat" over-reaches: one UI class's layout constants matching says nothing
about combat tuning parity, which is what the S0-3 caveat was actually about.

### 8. `ui-hud/result-cards-exact` — **UPHELD**
`WinUI.as:26 addFrameScript(0,frame1,6,frame7,10,frame11)` verified, and I opened the frame
bodies the surveyor did not cite: `frame1(){ winwords.visible = false }` (:94),
`frame7(){ winwords.visible = true }` (:99), `frame11(){ stop() }` (:104). So 250 ms / 417 ms
hold. DRAW variant verified (`:49-56`). Resnames 482 "Continue" / 483 "Save Replay" /
480 "Respawn" all confirmed against the blob. `LoseUI` gold gate confirmed (`payui = new PayUI()`
:37, `getgoldpromptdialog.show(1)` :104).
Minor: "brush stroke frames 1-6" is an inference — nothing in the cited code names a brush-stroke
span; `frame1()` only hides `winwords`.

### 9. `ui-hud/interactui-menu-system` — **UPHELD (one line number off)**
Every count reproduces **exactly**: 20,947 bytes, 19 `<ui>` / 19 `<title>`, 47 `<menu>`,
139 `<option>`, 139 `<icon>`, 28 `<condition><has>`, 67 `<param>`. The 19 title line numbers are
exactly the list given. Labels resolve (269 → "Sell crops", 270 → "You do not have any crops for
sale.", 83 → "Buy").
Correction: the gated sell-crops option is at **line 16**, not 17 — line 17 is the
"buy commodities" `goto 2` row. Also there is exactly **one** `<errormsg>` in the whole file, so
"error copy" is a single string, not a corpus.

### 10. `ui-hud/typography-edo-sz` — **UPHELD (incomplete, minor)**
Lines 100 / 206 / 314 verbatim-correct. Whole-file face inventory: **15× `Edo SZ`, 2× `Calibri`**.
Full size/colour set, which the claim under-reports:
`Edo SZ 13/#cccccc ×1 · 14/#cccccc ×2 · 14/#ffffff ×1 · 16/#ffffff ×3 · 18/#000000 ×1`.
Provenance is right — `ui_strings.txt` sits at `reference/extracted/` top level beside the web
`payload.xml`, not in `extracted/android/`, so the no-Android-caveat statement holds.
One bad argument to drop: "`initTextField` turns embedFonts off only for zh/ja, **so** Edo SZ is
embedded." `LangManager.as:127-141` never sets `embedFonts = true`; it only turns it *off*.
That is suggestive, not proof.

### 11. `ui-hud/tier3-video-repass-obsolete` — **REFUTED (material)**
Two of the three hold; the third does not, so "three of five... should not be funded" over-counts.
- damage-popup animation — **holds** (`TextProjectile.as:20,23,39-45`; `MCSPlayer.as:3805` exact).
- VS/FIGHT exact ms — **holds**, but the cite is off by one (`addFrameScript` is
  `DuelIntroBar.as:23`, not `:22`) and the quote alone does not establish it. I had to open the
  frame bodies (`:85-104`: frame1 hides `actionWord`, frame20 `showText()`, frame69
  `actionWord.visible = true`, frame88 `introEnd(); stop()`) to get **0 / 792 / 2833 / 3625 ms**
  at 24 fps. `actionWord` text is `getString(104)` = "FIGHT!" (`:69`).
- dialogue-box metrics — **does not hold**, per verdict 3.

### 12. `ui-hud/690-friend-bar-never-filmed` — **UPHELD, and I widened it**
Pillarbox replicated to the pixel: 52→1867 / w 1816 in `duel_dense/_427.0, _427.1, _427.2,
_428.0, _431.5` and `duel_frames/_t425.0s`; 55→1861 / w 1807 and 54→1861 / w 1808 in
`zFt_combat/_t0320s, _t0325s`; rows 0→1079 in all. I then ran a random 63-frame sample spanning
**every one of the 18 `reference/frames/` subdirectories** — nothing anywhere near
800/690 = 1.159; everything clusters 1.67–1.69 (the >2.0 outliers are dark scenes where the
luminance threshold clipped, plus the hand-made `duel_crops`).
And the code's own switch confirms the interpretation: `GameEngine.resizeHandler:275-284`
sets `stageShowingFriendBar = true` and calls `friendpanel.init()` only when
`newAspectRatio <= 800/690`. At 1.681 the friend bar is off. PARTIAL is the correct verdict.

### 13. `ui-hud/hud-symbol-metrics` — **REFUTED (material) — the biggest miss in the pass**
"symbol geometry is not on disk", "HUD chrome art still sealed in the encrypted
`124_Mobile_ImageResource`", and "Closing all three is **one JPEXS shape/sprite export away**"
are all wrong. **That export already happened**, on 2026-07-26, alongside `payload.xml`:

```
reference/extracted/shapes/     1,822 .svg   (ffdec objectType="shape", explicit px w/h + path data)
reference/extracted/sprites/      827 dirs   (rendered PNG frames per DefineSprite)
```

and it is from the **WEB** payload, which is the build in the videos. Named HUD members present:

- `sprites/DefineSprite_3632_shs3_fla.PauseScreen_51/1.png` — **802 × 481**. I opened it: a
  full-stage near-black overlay, the Straw Hat Samurai *DUELS* logo centred at roughly
  y = 130–260, and a white "GAME PAUSED" line at roughly y = 285. That is the pause screen's
  exact geometry, sitting unopened.
- `sprites/DefineSprite_934_shs3_fla.skillSlotBG_755/` — 5 frames at **56 × 55**; I rendered the
  strip and frame 4 (bright cream border + black fill) is precisely the empty highlighted slot in
  `Nr4fQstqHDM_428.0`. 56-wide art on a 60-px pitch = 4 px gutter.
- also `shs3_fla.autoslashbutton` (the plaque from verdict 1), `chatTextBattle`, `skillnodeinner`,
  `MinimapIcon`, `MinimapRoomIcon`, `speechbubble`, `CharSlot`, `QuestLogButtonBG`.

The reasoning error is a category error: `[Embed(source="/_assets/assets.swf", symbol="symbolNNNN")]`
is the **AIR/Android** packaging pattern. The web build has no separate `assets.swf` — its symbols
are inside the payload that was already decoded and exported. Reasoning from the android artifact
when a web artifact settles it directly is the Lens-3 failure this review hunts.

**What does survive in claim 13**, and is correct and grounded: the slot-3 up-arrow is an
equipped-skill image — `SkillSlotButton.as:87 this.image = ResourceManager.getSkillImage(this._skillId);`
— and the stance control is `battlemodebust` (`BattleUI.as:192-193` `changestancelabel` on
MOUSE_OVER, `:275` `stanceButtonClick()`, `:374` `stancecolor1.gotoAndStop(num)`). That quietly
refutes ledger blocker ④ ("the '3 skill slots' is really ~2 abilities + a stance up-arrow"), which
the pass never flagged.

---

## Score

Not proposing a number. The corrections push in both directions: verdicts 3, 5 and 11 argue the
+3 for "blocker ⑤ closed except symbol geometry" was not earned, while verdict 13 shows more is
held than the pass believed — the residual it priced into holding the score below 90
("no assets.swf symbol geometry exported", "HUD chrome art still sealed") does not exist.
Re-score after N2 is worked.
