# GAUNTLET L0 — critic review: **ui-hud** — LENS 3 (PRECEDENCE / stale-claiming)

Reviewer: blind critic. I did not see the surveyor's reasoning. Every verdict below carries an
artifact **I** opened. Pass-2 output under review = 13 claims, proposed score 88.

---

## Headline

**The citations are meticulous — and the build scoping is not.**

I re-derived all 13 claims from artifacts. Every quoted AS3 line, every line number, every XML count,
and the two headline frame measurements are **verbatim correct**. I found exactly one wrong number in
a quote (claim P7's row measurement) and zero fabricated cites. That is the best cite hygiene I have
seen in this gauntlet.

The systemic failure is a different one, and it is squarely a **precedence** failure:

> **Pass 2 published Android v0.682 constants as this lane's answer for seven claims whose
> web v0.717 analogues are already on disk in `reference/decompiled/shs3_payload/scripts/`,
> and never opened them.** For five of the seven the web build agrees (which *retires* the
> S0-3 Android caveat — an upgrade Pass 2 left on the table). For two it **disagrees**, and
> both disagreements are in numbers Pass 2 published as build-neutral fact.

The unlock was already in this lane's own journal — Pass 1 claim 18 `ui-hud/rosetta-deobfuscation`
("a general-purpose unlock for **every** gauntlet lane"). Pass 2 did not use it.

The two divergences:

| thing | Android v0.682 (what Pass 2 published) | Web v0.717 (what the frames show) |
|---|---|---|
| skill-cooldown quantiser | `int(cooldown/cooldownmax*12)+1` | `Math.ceil(cooldown/cooldownmax*12)+1` |
| HUD `assets.swf` symbol ids | BattleUI 2952 · DialogBox 83 · SkillSlotButton 2915 · WinUI 2894 · DuelIntroBar 2861 · ScreenTransition 2758 · OptionsUI 1133 | 3640 · 91 · 3605 · 3584 · 3549 · 3430 · 3464 |

Neither kills a claim's headline. Both would produce a wrong rebuild if copied as written — and the
symbol-id one makes claim P13's stated close-path ("one JPEXS shape/sprite export away") point at the
wrong file's index.

Score: **88 is defensible, but for a reason Pass 2 did not give.** The lane is stronger than 88 on
evidence quality and weaker than 88 on build discipline. I would leave the number and attach the
build-scope correction as a standing condition on the lane.

---

## Verdicts

### P1 `langmanager-uses-resname-not-id` — **SURVIVES** (minor: under-claims)

**My cite:** `reference/decompiled/shs3_android/scripts/fl/lang/Locale.as:301,307` —
`var _loc2_:String = param1.attributes.resname;` … `stringMap[_loc2_] = _loc3_;`

That is the mechanism, stated by the Flash runtime class itself, and it is stronger than the frame
argument P1 leads with. I then re-parsed the blob independently: 2,555 `<trans-unit>`; 2,343 with
`id != resname`; 649 non-numeric resnames, first `id="1906" resname="IDS_Q0TITLE"`; last agreeing
pair `id="211" resname="211"`, first divergence `id="212" resname="222"`. **All exact.** "Above 211"
is precisely right, not approximately right.

I re-cropped the frame myself — `duel_dense/Nr4fQstqHDM_428.0.png`, crop `(40,0)-(560,200)`,
Lanczos ×3 — and the brown plaque reads **AUTO SLASH OFF**. Held.

And I closed the loop P1 left open: the **web** build makes the same call.
`reference/decompiled/shs3_payload/scripts/§1t113s0§.as:160` —
`this.§1t5156s0§.text = §1t1521s0§.getString(619);`. So the resname map is authoritative for the
build the frames come from, not just for Android. P1 could have said this and didn't.

Corrections verified: resname 388 = `Condition: Poor`, 407 = `Game Paused`; resname 6014 =
`Skill Slots+`, 7009/7010/7011 = `4/5/6 skill slots`; the unit whose **id** is 600 has
**resname 619**, source `Auto Slash Off` — which is exactly why Pass 1 claim 17 got confused.

**Under-claim (see NEW-6 and NEW-7):** this mechanism does not just correct two numbers. It voids Pass 1
claim 16's entire "The honest limit" paragraph and Pass 1 claim 17's "different build revision"
diagnosis and its "~400" threshold — all three still sit in `systems/ui-hud.md` as live guidance
for downstream lanes. P1 sets `overturns_ledger:false` and names neither.

### P2 `transition-durations-exact` — **SURVIVES** (minor: under-cited to the wrong build)

**My cite:** `reference/decompiled/shs3_payload/scripts/§1t6497s0§.as:78-88,102-103,111` — the
**web** ScreenTransition, `counter >= 17`, `§1t6843s0§ += 2`, `blackup.y = -240`,
`blackdown.y = 480`/`240`, `this.white.alpha -= 1 / 24`. Identical to the Android file.

Plus a real byte-check on the fps rather than an inference: I parsed both SWF headers directly.
`shs3_payload_decoded.swf` → stage 800×690 @ **24.0 fps**; `shs3_android_payload_decoded.swf` →
stage 800×480 @ **24.0 fps**. P2's supporting cite for fps was `Mobile.as:117
frameRate = 24` — a mobile-only *fallback* guarded by `if(frameRate == 0)`. The header is the real
artifact.

Arithmetic re-derived: speed applies before it increments, so displacement after *n* frames is
`(n-2)(n-1)`; `(17-2)(17-1) = 240` exactly, which is why the gate is `counter >= 17`. **Held, exact.**

The "480-px stage height" corollary is also correct and I want that on record, because it looks
wrong next to the 800×690 web header and isn't: `GameEngine.as:271-273` names them
`originalHeight = 480` and `originalHeightWithBar = 690`. 480 is the game canvas in **both** builds.

### P3 `dialogbox-metrics-in-code` — **SURVIVES, but the scope word is wrong** (material)

**My cite:** `reference/decompiled/shs3_android/scripts/DialogBox.as:46,49,53,86,89,93,105,136,147,162`
— and `DialogBox.as:194 public function showHTML(msg:String)`, which sets **none** of them.

The three re-assignments are real and verbatim, and the web build confirms them
(`§1t5474s0§.as:46,49,89,105,147,162`). What is wrong is the sentence *"Dialogue-box exact metrics
are **NOT** locked inside an assets.swf symbol."* Three metrics are not. The panel shape, the
`msgText` TextField bounds and word-wrap width, the button dimensions, and the font metrics all
still are — inside `symbol83` (Android) / `symbol91` (web). P13 concedes exactly this in the same
output. "Blocker ⑤'s dialogue half is closed" over-reads its own evidence.

Also worth logging: P3 found only `show()` and `showYesNoDialog`. `showAP()` at `:86,105` is a
third variant with its own 270/425 pair.

### P4 `pause-is-click-anywhere` — **SURVIVES, clean**

**My cite:** `BattleUI.as:179`, `:267-272`, `:324-328` read first-hand — line numbers exact, quotes
verbatim, and the paused branch is genuinely the first statement in `gotClicked` before any
`hitTestPoint`, so "any click resumes" is a property of the control flow, not an inference.

Frame corroboration I ran myself: `duel_dense/Nr4fQstqHDM_428.0.png`, crop `(1780,0)-(1880,80)`,
Lanczos ×6 — a red circled double-bar **pause glyph** is rendered top-right in a battle that also
shows the AUTO SLASH OFF plaque and a HIT COMBO counter. Consistent with the
`!isDuelMode() && !isPvPRoomMode()` branch. Nice unplanned frame↔code agreement.

### P5 `options-screen-complete` — **SURVIVES** (minor: "Pass 1 missed" is not true)

**My cite:** `OptionsUI.as:34-51` — all eight `setText` calls, `titletext = getString(10)`, and both
conditional hides, verbatim. Copy resolves through `strings.json` exactly as claimed.

But the lane_impact says *"Adds three toggles Pass 1 missed (Chat notification 396, Record Duels 492,
Full Screen 752)."* Pass 1 did not miss them. `docs/gauntlet/L0/systems/ui-hud.md:531-533` already
declares `musiccheck, soundcheck, bloodcheck, chatcheck, recordcheck, fullscreencheck` by name. What
P5 adds is the resolved **copy** for three of the six, not the toggles. Small, but it is precisely
the kind of "Pass 1 got this wrong" framing that later readers inherit uncritically.

Web parity holds: `§1t6407s0§.as:37-39` and `§1t6422s0§.as:40-42` carry the same 396/492/752.

### P6 `skill-cooldown-12-step-quantised` — **SURVIVES; the published formula is the wrong build's** (material)

**My cite:** `reference/decompiled/shs3_payload/scripts/§1t5184s0§.as:226` —
`_loc1_ = Math.ceil(this.cooldown / this.cooldownmax * 12) + 1;`
(that file is the web SkillSlotButton: `:6 [Embed(... symbol="symbol3605")]`, `:12 keypressText`,
`:26 cooldownmax`, `:152/162/172/183/190 shade.gotoAndStop(13)`).

The Android file P6 quotes uses `int(...)`. `int()` truncates, `Math.ceil()` rounds up. They agree
only at exact twelfths and at the endpoints; for every intermediate value the **web build sits one
shade frame higher than the number Pass 2 published**. A rebuild that copies `int(...)` will be
visibly off by one step through most of every cooldown sweep.

The headline — 12 quantised steps, 13th frame = disabled, no tween — survives in both builds. The
formula does not. This is the exact failure mode the precedence lens exists to catch: an Android
constant imported as if it were build-neutral, when the target build's own code is on disk and says
something else.

Everything else in P6 is verbatim-correct (`:220`, `:146`, `:110`, `:114`, `:153`).

### P7 `slot-geometry-frame-validated` — **SURVIVES; the row measurement in the quote is wrong** (minor)

**My cite:** my own measurement of `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`
(threshold `max-channel > 150` over `y∈[930,1080), x∈[1400,1620)`).

Column borders **1449 / 1558** → centre **1503.5**. That matches P7 exactly.
Row borders **962 / 1071** → centre **1016.5**. P7 says "rows 952→1073 (centre 1012.5)". P7's rows
span 121 px against a 109-px width — a box that is not square. Mine are 109 × 109. **The frame wins
over the quote.**

P7's conversion also applies the *horizontal* scale to a vertical measurement. The correct model:
content is 1816 px wide for an 800-px canvas → scale 2.270; 480 × 2.270 = 1089.6 > 1080, so ~5 px is
cropped off the top and bottom (which is why rows run 0→1079 with no letterbox). Solving
`frame_row = game_y × 2.270 + c` from **both** borders gives `c = −5.0` from each independently —
self-consistent — and centre 1016.5 → game **y = 450.0**, exact.

So the conclusion is *stronger* than P7 states, not weaker: not "~1 px", but a three-point match.
Box centres 1503.5 / ≈1641 / ≈1778 → game x **639.4 / 700.0 / 760.4** against
`skillSlotButton.x = 760 − i*60` → **640 / 700 / 760**. See NEW-4.

I also confirm the visual reading (crop `(1380,920)-(1880,1080)`, ×3): three boxes, leftmost
bright-bordered, **empty and unnumbered**; middle numbered **2** holding a beige claw/fang icon;
right numbered **3** holding a gold up-arrow. And `SkillSlotButton.as:128
this.keypressText.text = "";` inside `initEmpty()` is line-exact.

Web parity: `§1t113s0§.as:170 _loc1_.x = 760 - _loc2_ * 60;`. The licence P7 asks for is granted —
but by the web file, not by inference from Android.

### P8 `result-cards-exact` — **SURVIVES, clean**

**My cite:** `WinUI.as:26` `addFrameScript(0,this.frame1,6,this.frame7,10,this.frame11);` plus the
handler bodies at `:94-105` (`frame1` hides `winwords`, `frame7` shows it, `frame11` calls `stop()`)
— so the beats are not inferred from the registration line alone. `:32-37` gates both buttons on
`isRecording()`; `:49-55` is the draw branch; `:90` is the replay URL. `LoseUI.as:35-38,43-46,53`
verbatim.

Web parity: `§1t5186s0§.as:26 addFrameScript(0,this.frame1,6,this.frame7,10,this.frame11);` —
identical. The DRAW state and the gold-gated revive are real.

### P9 `interactui-menu-system` — **SURVIVES** (minor: one off-by-one, one inflated noun)

**My cite:** my own parse of `reference/extracted/android/90_InteractUI_UIData.bin`. Every count
reproduces exactly: 20,947 bytes, root `<uidata>`, 19 `<ui>`, 19 `<title>`, 47 `<menu>`,
139 `<option>`, 139 `<icon>`, 67 `<param>`, 28 `<condition><has>`. All 19 title strings and all 19
line numbers match to the line.

Two corrections:
1. The gated `sell crops` example is at **line 16**, not 17. Line 17 is a different option
   (`<label>523</label> … goto param 2`). The quote itself is verbatim from line 16.
2. `grep -n errormsg` returns **exactly one hit in the whole file**. "inventory gates and error copy"
   reads as a systematic feature; it is 28 gates and **one** error string.

Novelty note: Stage-0 finding **S0-4** already named this blob and already mapped it to ui-hud
blocker ⑤ ("`90_InteractUI_UIData` (167 ids, 139 option/label/icon) → ui-hud blocker ⑤"). "Appears
in neither the ledger nor Pass 1" is literally true — I checked `REBUILD_READINESS.md:232-234` and
the Ready bullet does omit the town UI — but the score rationale banks +1 for a discovery the
gauntlet header had already handed over. P9 finds the *contents*; it does not find the *file*.

### P10 `typography-edo-sz` — **SURVIVES** (minor: the size/colour split is tidier than the data)

**My cite:** `reference/extracted/ui_strings.txt` lines 100, 101, 206, 212, 294, 314, 321 read
first-hand. Lines 100/206/314 are verbatim as quoted. But `:101` is
`face="Edo SZ" size="14" color="#ffffff"` and `:321` is `itemDesc123<font face="Edo SZ" size="14"
color="#ffffff"` — 14 px white body text. The clean "13/14 px `#cccccc` body, 16 px `#ffffff`
heading" rule does not survive contact with the file; there are at least three size/colour
combinations in use. 17 `Edo SZ` occurrences total.

Also: the claim asserts it "carries no Android-build caveat", then supports the embedding argument
with `LangManager.as:127-137` — an **Android** file. The `ui_strings.txt` half is web-sourced and
carries the claim; the `embedFonts` half does not.

The blocker close itself is right and is worth the ledger edit
(`REBUILD_READINESS.md:240` ② font (unidentified) — verified verbatim).

### P11 `tier3-video-repass-obsolete` — **SURVIVES** (minor: two of three legs are Pass 1's, undisclosed)

**My cite:** `docs/gauntlet/L0/systems/ui-hud.md:370-395` (Pass 1 claim 13 `intro-beats-exact`) and
`:234-260` (Pass 1 claim 9 `floating-damage-popups`).

Pass 1 already closed "VS/FIGHT exact ms" from the *same* `DuelIntroBar.as:22` line, with the beat
table (792 / 2 042 / 3 667 ms), and already closed "damage-popup animation" from the *same*
`TextProjectile.as:16-50` block. P11 re-derives both without saying so. Only the dialogue-box leg is
new to Pass 2, and P3 over-claims that one. The re-prioritisation conclusion is sound; the framing
implies three new closures where there is one.

I checked the parity worry and it comes out in P11's favour, so I am *not* refuting it:
`§1t5533s0§.as:23 addFrameScript(19,this.frame20,68,this.frame69,87,this.frame88);` — the web build
carries the same 19/68/87 timeline beats (it omits only the frame-0 handler). And `ttl = 12` is
present in the web payload. So the "don't fund the video re-pass" call holds on the merits.

### P12 `690-friend-bar-never-filmed` — **SURVIVES as a measurement; the conclusion inverts the shipped default** (material)

**My cite (frames):** I re-measured all four cited frames and reproduce them exactly —
`duel_dense/Nr4fQstqHDM_427.0.png` cols 52→1867 (w 1816, aspect 1.681);
`duel_frames/Nr4fQstqHDM_t425.0s.png` 52→1867 (1816, 1.681);
`zFt_combat/zFtCaTO0_1M_t0320s.png` 55→1861 (1807, 1.673);
`zFt_combat/zFtCaTO0_1M_t0325s.png` 54→1861 (1808, 1.674). Rows 0→1079 in all four.

I then widened the sample far beyond P12's seven frames: a seeded random sample of **661 images
across every directory under `reference/frames/`** (content bbox via max-channel > 25). Every
genuine full-frame game capture lands at 1.67–1.68. **Nothing anywhere near 800/690 = 1.159.** P12's
narrow assertion is not just true, it is now properly sampled. Credit where due.

**But the conclusion is backwards.** P12 says shipping the 690 layout would be *"authoring, not
copying"*. The web build's own artifacts say the opposite:
- `reference/decrypted/shs3_payload_decoded.swf` header rect = **800 × 690** (I parsed it). That is
  the authored canvas of the shipped web game.
- `GameEngine.as:268-280`: `originalHeightWithBar:int = 690;` … `if(newAspectRatio <=
  originalWithBarAspectRatio){ … StatsManager.stageShowingFriendBar = true; OverworldHUD.instance.friendpanel.init(); }`
  — the threshold is **exactly** 800/690, so a container matching the SWF's own header selects the
  friend bar.
- `OverworldHUD.as:388-390`: `this.friendpanel = new FriendPanel(); addChild(this.friendpanel);
  this.friendpanel.y = 480;` — the bar is the 210 px strip below the 480 canvas. The "friend bar"
  name is grounded.

And Pass 1 claim 2 (`systems/ui-hud.md:88-90`) already concluded *"The web SWF's own header rect is
800×690, i.e. the tall layout is the authored canvas."* P12 contradicts its own journal without
citing it.

The correct reading: **the 690 friend-bar layout was almost certainly the default shipped
experience; the videos captured the *non-default* wide mode.** "Frame-unverified" is right.
"Authoring, not copying" is wrong — and it is the sentence a future session would act on.

### P13 `hud-symbol-metrics` — **SURVIVES as an honest STILL_UNHELD; the ids are the wrong build's** (material)

**My cite:** all eight `[Embed(...)]` lines read first-hand from
`reference/decompiled/shs3_android/scripts/` — BattleUI symbol2952, OptionsUI symbol1133,
DialogBox symbol83, SkillSlotButton symbol2915, WinUI symbol2894, BattleIntroBar symbol2855,
DuelIntroBar symbol2861, ScreenTransition symbol2758. All verbatim. `ls
reference/decompiled/shs3_android/` returns `scripts` and nothing else — the export-scope claim is
true. `ResourceManager.as:302 getSkillImage(id:int)` and `BattleUI.as:274 battlemodebust` both
check out. This is a well-disciplined refusal to name what isn't held.

The defect: **every one of those symbol ids is Android-only.** The web analogues, which I pulled
from `reference/decompiled/shs3_payload/scripts/`:

| class | Android | Web (v0.717) |
|---|---:|---:|
| BattleUI | 2952 | **3640** (`§1t113s0§`) |
| OptionsUI | 1133 | **3464** (`§1t6407s0§`) / 1348 (`§1t6422s0§`) |
| DialogBox | 83 | **91** (`§1t5474s0§`) |
| SkillSlotButton | 2915 | **3605** (`§1t5184s0§`) |
| WinUI | 2894 | **3584** (`§1t5186s0§`) |
| DuelIntroBar | 2861 | **3549** (`§1t5533s0§`) |
| ScreenTransition | 2758 | **3430** (`§1t6497s0§`) |

P13's stated close-path — "one JPEXS shape/sprite export away" — is correct in method and wrong in
index. Anyone following it against the web `assets.swf` with these ids exports the wrong symbols.

---

## New findings

**NEW-1 — The web build confirms five of Pass 2's seven Android-sourced claims, retiring the S0-3
caveat for them.** `§1t6497s0§.as` (ScreenTransition: `counter >= 17`, `+= 2`, `alpha -= 1/24`,
`±240/480`), `§1t5474s0§.as:46,49,105,147` (DialogBox 340/187.5/425), `§1t113s0§.as:160,170`
(getString(619); `760 - i*60`), `§1t6407s0§.as:37-39` (options 396/492/752),
`§1t5186s0§.as:26` (WinUI 0/6/10), `§1t5533s0§.as:23` (intro 19/68/87). Pass 2 should have said
"both builds", not "Android".

**NEW-2 — Web cooldown quantiser is `Math.ceil`, not `int`.** `§1t5184s0§.as:226`. Material for any
rebuild. Detailed under P6.

**NEW-3 — Web HUD symbol ids differ from Android across the board.** Table under P13.

**NEW-4 — Corrected slot-box measurement, and a three-point geometry match.** Rows are 962→1071
(109 px, square with the 109-px width), centre 1016.5, not P7's 952→1073/1012.5. With the ~5 px
vertical overflow crop (`c = −5.0`, solved independently from both borders) the centre converts to
game **y = 450.0** exactly. Box centres 1503.5 / ≈1641 / ≈1778 → game x **639.4 / 700.0 / 760.4** vs
code **640 / 700 / 760**. Three slots, three matches. THE FRAME WINS over P7's quoted rows.

**NEW-5 — The 690 friend-bar layout is the shipped default, not an unshipped code path.** SWF header
800×690 + `GameEngine.as:271-278` + `OverworldHUD.as:388-390`. Detailed under P12.

**NEW-6 — Two Pass-1 statements that P1 silently kills are still live in `systems/ui-hud.md`.**
Pass 1 claim 16 (`:472,:475`) still tells readers *"Item/skill/npc display names remain
**STILL_UNHELD**"* — dead, since resnames reach 7011 and S0-3 measures 804/0, 73/0, 484/6 resolved.
Pass 1 claim 17 (`:491,:508`) still attributes the mismatch to *"a different build revision"* and
still hands downstream lanes the rule *"ids below ~400 resolve directly"* — the true divergence is
exactly at `id="212" resname="222"`, and the cause is the attribute, not the build. Both are stale
claims of the type this repo has been burned by twice. P1 corrects two downstream numbers and leaves
both governing sentences standing.

**NEW-7 — Pass 1's "verbatim" XLIFF quote block is misquoted, and P1 did not catch it.**
`systems/ui-hud.md:465-467` prints, inside a fenced quote block presented as the raw file:

```
<trans-unit id="388" resname="388"><source>Game Paused</source></trans-unit>
<trans-unit id="600" resname="600"><source>Auto Slash Off</source></trans-unit>
<trans-unit id="609" resname="609"><source>Draw a line to slash</source></trans-unit>
```

`reference/extracted/android/118_Mobile_Lang_EN.bin` actually says `resname="407"`,
`resname="619"` and `resname="628"` for those three ids. The four rows at ids 45/104/175/208 are
correct because they are below the divergence point. So the one attribute P1's entire thesis turns
on was **silently rewritten** in the journal's own evidence block — a reader checking P1 against
that block would conclude P1 is wrong. This is worse than the stale prose in NEW-6: a
verbatim-looking quote that does not match the artifact is the failure mode §0 calls the worst
outcome available. It needs correcting in `systems/ui-hud.md` directly, not just superseding.

---

## Bottom line

Nothing here is fabricated and nothing is refuted outright. Four claims (P3, P6, P12, P13) carry
material defects; five (P1, P5, P7, P9, P10, P11) carry minor ones; P4 and P8 are clean.

If one line survives this review, make it this: **stop citing `shs3_android/` when
`shs3_payload/` has the same class.** The rosetta method to read it is in this lane's own Pass 1
claim 18. Two of the seven Android borrowings were already wrong.
