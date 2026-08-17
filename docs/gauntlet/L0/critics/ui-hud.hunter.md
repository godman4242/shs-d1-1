# GAUNTLET L0 — HUNTER critic: **ui-hud** (Pass 2 output under review)

Blind review. I did not see the surveyor's reasoning. Every verdict below cites an artifact
**I opened myself**. Lens 2 (hunter): I went after every STILL_UNHELD / PARTIAL and tried to find it.

**Headline:** 8 of 13 claims survive. 5 are refuted — 3 material, 2 minor. The single most important
thing this review adds is that **the obfuscated web payload decompile is readable enough to test
build parity directly**, and when you do, one of the surveyor's claims breaks and four others get a
strictly better cite than the one they carry.

---

## 0. The unlock: the web build is NOT a black box

The surveyor treated `reference/decompiled/shs3_android/` as the only AS3 on disk and used a frame
match to argue Android→web parity. But `reference/decompiled/shs3_payload/scripts/` (652 files) is the
**web v0.717** decompile. Class names are obfuscated (`§1t113s0§.as`) — but **numeric literals and
public member names survive**, so a grep for a distinctive constant identifies the class outright.

| web file | line | content | = android class |
|---|---|---|---|
| `§1t113s0§.as` | 170–171 | `_loc1_.x = 760 - _loc2_ * 60;` / `_loc1_.y = 450;` | `BattleUI` |
| `§1t113s0§.as` | 160–161 | `getString(619)` / `getString(620)` | `BattleUI` autoslash labels |
| `§1t5184s0§.as` | 226 | `Math.ceil(this.cooldown / this.cooldownmax * 12) + 1;` | `SkillSlotButton` |
| `§1t5474s0§.as` | 46/49/53/105/136/147 | `button.x = 340` / `msgText.y = 187.5` / `220` / `button2.x = 425` / `button.x = 270` | `DialogBox` |
| `§1t6497s0§.as` | 89/113 | `if(this.counter >= 17)` / `this.white.alpha -= 1 / 24;` | `ScreenTransition` |
| `§1t1540s0§.as` | 271–273 | `_loc2_ = 800; _loc3_ = 480; _loc4_ = 690;` | `GameEngine.resizeHandler` |
| `§1t5186s0§.as` | 26 | `addFrameScript(0,this.frame1,6,this.frame7,10,this.frame11);` | `WinUI` |
| `§1t6407s0§ / §1t6422s0§` | 37–39 / 40–42 | `getString(396/492/752)` | `OptionsUI` (**two** variants) |

Consequence: for most of this lane the "android parity not established" caveat can simply be
**deleted by citing the web file** — no frame inference needed. And where the two builds *differ*,
you can now see it. They do differ. See F2.

---

## 1. Verdicts

| # | claim | verdict | severity |
|---|---|---|---|
| 1 | `langmanager-uses-resname-not-id` | **HOLDS** | — |
| 2 | `transition-durations-exact` | **HOLDS** | — |
| 3 | `dialogbox-metrics-in-code` | **REFUTED** | minor |
| 4 | `pause-is-click-anywhere` | **HOLDS** | — |
| 5 | `options-screen-complete` | **REFUTED** | minor |
| 6 | `skill-cooldown-12-step-quantised` | **REFUTED** | material |
| 7 | `slot-geometry-frame-validated` | **REFUTED** | material |
| 8 | `result-cards-exact` | **HOLDS** | — |
| 9 | `interactui-menu-system` | **HOLDS** | — |
| 10 | `typography-edo-sz` | **HOLDS** | — |
| 11 | `tier3-video-repass-obsolete` | **HOLDS** | minor |
| 12 | `690-friend-bar-never-filmed` | **HOLDS** (and upgraded) | — |
| 13 | `hud-symbol-metrics` (STILL_UNHELD) | **REFUTED** | material |

---

### 1 — `langmanager-uses-resname-not-id` — HOLDS. Best claim in the lane.

I opened the frame myself: `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, crop **(40,0)–(560,200)
upscaled 3×** → a brown plaque with a gold inner rule reading **AUTO SLASH OFF**, top-left. I re-parsed
`reference/extracted/android/118_Mobile_Lang_EN.bin` independently: **2,555 `trans-unit`s, 2,343 with
`id != resname`, 649 non-numeric resnames, first divergence `id="212" resname="222"`** — every number
the surveyor gave, reproduced exactly. `resname 619 = "Auto Slash Off"`, `id 619 = "Special Event"`.
Mechanism confirmed at `LangManager.as:78` — `Locale.loadStringEx(num.toString(), language)`, and
`fl.lang.Locale` keys XLIFF by `@resname`.

**I can strengthen it twice over:**
- `resname 600 = "Special Control Point"` but **`id 600 = "Auto Slash Off"`**. That is direct proof
  Pass 1 was reading the `id` column — and it kills Pass 1 claim 17's diagnosis ("the table is from a
  *different build revision*"; "the true strings are present at **different** ids — 600/601").
  Same table, wrong key.
- The **web** build calls the same numbers: `§1t113s0§.as:160-161` → `getString(619)` / `getString(620)`.
  So there is no build drift at all.

Spot-check of the downstream corrections, all confirmed: `resname 388 = "Condition: Poor"` /
`id 388 = "Game Paused"`; `resname 407 = "Game Paused"`; `resname 6014 = "Skill Slots+"`,
`7009/7010/7011 = "4/5/6 skill slots"` (`id 1506/1648/1649/1650` = the same strings under the wrong key);
`resname 104 = id 104 = "FIGHT!"`.

### 2 — `transition-durations-exact` — HOLDS.

I read `ScreenTransition.as:71-123, 125-147, 149-163, 165-180` in full. The displacement recurrence is
right: speed is applied *before* it increments, so after *n* frames displacement = (n−2)(n−1);
(17−2)(17−1) = **240 exactly**, which is why the gate is `counter >= 17`. `BLACKOPEN` (`:95-107`) has the
same recurrence and also lands at exactly 17. The white fade needed one fact the surveyor didn't state —
I checked it: **`ScreenTransition.as:173  this.white.alpha = 1;`** — so `alpha -= 1/24` is exactly 24 frames.

Two things the claim needed and did not cite, which I verified:
- **fps = 24.000**, read from the SWF headers of *both* payloads (see F3). Without this the ms figures
  are ungrounded.
- Web parity: `§1t6497s0§.as:89` `if(this.counter >= 17)` and `:113` `this.white.alpha -= 1 / 24;`.

Pass 1 claim 21 is quoted verbatim and correctly (ui-hud.md:560-562). This claim genuinely closes it.

### 3 — `dialogbox-metrics-in-code` — REFUTED (minor).

The four numbers are real. I read them, and they are **identical in the web build**
(`§1t5474s0§.as:46,49,53,105,136,147`). That part is a good find.

What is wrong is the sentence the claim leads with: *"Dialogue-box exact metrics are NOT locked inside
an assets.swf symbol"* and *"blocker (5)'s dialogue half is closed"*.

> `reference/decompiled/shs3_android/scripts/DialogBox.as:8`
> `[Embed(source="/_assets/assets.swf", symbol="symbol83")]`

The box frame art, `msgText.x` / `.width` / `.height`, the `YellowButton` dimensions and the box's own
stage position are **all** in symbol83, which is not exported — a fact the surveyor's own claim 13 states.
Code supplies 4 numbers; the symbol supplies the rest. Blocker ⑤'s dialogue half is **materially
advanced, not closed**, and `overturns_ledger: true` overstates it.

### 4 — `pause-is-click-anywhere` — HOLDS.

`BattleUI.as:179` (visible rule), `:268-272` (first branch of `gotClicked`), `:324-328` (raise + toggle) —
all verbatim. The load-bearing word is *"anywhere"*, which the claim did not ground; I did:
**`InputManager.as:254  if(BattleUI.instance.gotClicked(args.stageX,args.stageY))`** — every stage click
enters that routine, and the paused branch is its first test. Web parity: `§1t113s0§.as:219` (same
`!isDuelMode() && !isPvPRoomMode()` visibility), `:366-371` (same first-test resume), `:436-441`
(same `visible = true` + `setChildIndex(..., numChildren - 1)`).

### 5 — `options-screen-complete` — REFUTED (minor).

Every string resolves exactly as claimed (`OptionsUI.as:34-43,44-51` read verbatim; Music / Sound /
Blood / Chat notification / Record Duels / Full Screen / Title Screen / Return To Game / Options).
Two conclusions are wrong:

1. *"Adds three toggles Pass 1 missed (Chat notification 396, Record Duels 492, Full Screen 752)."*
   Pass 1 did **not** miss them. `docs/gauntlet/L0/systems/ui-hud.md:532-533` already lists
   `musiccheck, soundcheck, bloodcheck, chatcheck, recordcheck, fullscreencheck (all XCheckBox)`.
   What is new is the **copy**, not the toggles.
2. `overturns_ledger: true` is filed against *"⑤ pause/options/dialogue-box exact **metrics**"* — and the
   claim supplies **zero metrics**. `OptionsUI.as:7` is `[Embed(... symbol="symbol1133")]`; not one
   checkbox x/y is on disk. The claim also omits the declared `quitdialog:QuitDialog`.

An inventory + copy list is not "completely held" for a screen whose blocker is about pixel metrics.

### 6 — `skill-cooldown-12-step-quantised` — **REFUTED (material). Build divergence.**

The Android lines are all verbatim (`:220, :146, :110, :114, :153`). But the number "12" is
**Android-only**, and this lane is rebuilding the **web** game:

```
reference/decompiled/shs3_android/scripts/SkillSlotButton.as:220
   newframe = int(this.cooldown / this.cooldownmax * 12) + 1;
reference/decompiled/shs3_payload/scripts/§1t5184s0§.as:226      <-- WEB v0.717
   _loc1_ = Math.ceil(this.cooldown / this.cooldownmax * 12) + 1;
```

`int()` truncates, `Math.ceil()` rounds up. Both `update()` bodies are otherwise line-for-line identical
(same three stance early-returns, same `--this.cooldown`, same `shade.currentFrame != newframe` guard,
same `mouseEnabled = true` at 0). So with `cooldownmax = N > 12`:

| build | first tick (`c = N−1`) | last tick (`c = 0`) | shade frames used |
|---|---|---|---|
| android v0.682 | `floor(12−12/N)+1` = **12** | **1** | 12 (frame 13 reserved for disabled) |
| **web v0.717** | `ceil(12−12/N)+1` = **13** | **1** | **13 — the sweep uses frame 13, the same frame as `disableButton()`** |

So "exactly 12 steps with a 13th 'disabled' frame" is **wrong for the build being recreated**. This is
precisely the failure Stage-0 finding S0-3 warned about ("combat tuning parity is NOT established —
label which build any ported string came from"), and the claim carries no build label.

### 7 — `slot-geometry-frame-validated` — REFUTED (material).

I made the crop myself — `duel_dense/Nr4fQstqHDM_428.0.png`, **(1380,920)–(1880,1080) upscaled 3×** — and
the frame shows exactly what is described: three boxes, leftmost empty and unnumbered, middle "2",
right "3" with a gold up-arrow. I also re-measured the empty box's bright border cleanly (region
(1430,930)–(1580,1080), threshold >150 on mean RGB, ≥5 px per row/col): **cols 1448→1559 (centre 1503.5),
rows 961→1072 (centre 1016.5), 112 × 112 px.** The x centre matches the surveyor's to the half-pixel.
Their y centre (1012.5) does not match mine (1016.5).

Three problems:

**(a) "to within ~1 px" is not supported — by the claim's own numbers.** It reports game (639.4, **446.0**)
against code (640, **450**). That is 4.0 px on y, not ~1.

**(b) the scale is not pinned to better than ~1.5%, and the derivation used is the wrong one.**
`BattleUI.doResize()` (`:929-936`) is `scaleX = scaleY = StatsManager.stageScale; x = stageOffsetX; y = stageOffsetY`,
so screen = game·scale + offset, and `GameEngine.resizeHandler:293-306` says that at a window aspect of
1.68 (> 800/480) the branch taken is **height-fit**: `newScale = stageHeight/480 = 1080/480 = 2.25`,
`offsetY = 0`. Three independent estimates disagree:

| source of scale | value | ⇒ empty-box centre in game px | code |
|---|---|---|---|
| `resizeHandler` height-fit | 2.250 | (641.6, 451.8) | (640, 450) |
| content width 1815/800 (surveyor) | 2.270 | (639.2, 447.8) | (640, 450) |
| measured numeral pitch 137/60 | 2.283 | — | — |

The pillarbox edges are sharp and real (I profiled rows 300–800: background ≤1.0 at col 51, 99.2 at col 53;
1864→1867→0.9 on the right), so the game area really is ~1815 px for 800 game px — which is *not*
consistent with a clean 2.25. The video is a lossy re-encode with ~1% geometric slop. The honest
statement is **"code and frame agree to 1–2%, i.e. ±1–5 game px"**, not "~1 px".

**(c) the conclusion — "retires the 'android parity not established' caveat for the combat HUD" —
is false, and the claim did not need the frame at all.** Parity in this exact widget is *broken*
(finding 6: `Math.ceil` vs `int`). And the layout itself is directly readable in the web build:

> `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:170-171`
> `_loc1_.x = 760 - _loc2_ * 60;`
> `_loc1_.y = 450;`

That is the cite this claim should carry. A2 beats an A1 inference here.

What *does* hold, and is well reasoned: the empty-and-unnumbered leftmost box is exactly what
`BattleUI.as:501-511` produces (`visible = i < slotCount`; a null slot takes the `initEmpty()` branch,
and `SkillSlotButton.as:128` clears `keypressText`), with `initKeyPressText(slotCount - i)` at `:504`
putting key 3 at i=0 (x=760, rightmost) and key 2 at i=1 (x=700). slotCount = 3, two skills equipped.

### 8 — `result-cards-exact` — HOLDS.

`WinUI.as:26` verbatim; I read the frame bodies the claim inferred from — `:94-97 frame1 → winwords.visible = false`,
`:99-102 frame7 → winwords.visible = true`, `:104-107 frame11 → stop()`. So "winwords at frame 7 (250 ms),
stop at frame 11 (417 ms)" is right at 24 fps. DRAW variant `:49-56`, replay URL `:90`, `showButtons()`
gated on `isRecording()` `:32-39` (called from `BattleUI.as:449`), LoseUI `:35-36,:45,:53` + `gold` /
`getgoldpromptdialog` / `payui` `:15,:21,:29` — all verbatim. Web parity: `§1t5186s0§.as:26` identical.
One nit: *"brush stroke frames 1-6"* is an inference — frames 1–6 are only *"winwords hidden"*;
`brushStroke` is a separate `MovieClip` with its own timeline.

### 9 — `interactui-menu-system` — HOLDS.

I parsed `90_InteractUI_UIData.bin` myself: **19 `<ui>` / 19 `<title>` / 47 `<menu>` / 139 `<option>` /
139 `<icon>` / 139 `<action>` / 28 `<condition><has>` / 67 `<param>`, 20,947 bytes** — every count exact.
All 19 titles sit on exactly the line numbers given. The peddler quote (lines 5,7,8,9) and the gated
"sell crops" option are verbatim including the inline comment. Small mis-cite: the gated option is on
**line 16**, not 17. `<errormsg>` occurs **once** in the whole file, so "error copy" is one instance,
not a feature family. The under-claim finding itself is correct and valuable.

### 10 — `typography-edo-sz` — HOLDS.

`ui_strings.txt:100, 206, 314` read verbatim. Whole-file tallies I ran: `face="Edo SZ"` ×15,
`face="Calibri"` ×2; `size="14"` ×10, `"16"` ×4, `"13"` ×2, `"18"` ×1. The 13 px is indeed `#cccccc`.
`LangManager.as:127-137` confirmed — `embedFonts = false` only for `zh-CN` / `ja`. Unmentioned:
one `size="18" color="#000000"` Edo SZ face. No Android caveat: `reference/extracted/ui_strings.txt`
is the **web** payload (the Android blobs live under `reference/extracted/android/`).

### 11 — `tier3-video-repass-obsolete` — HOLDS (minor).

Ledger line verified verbatim at `docs/research/REBUILD_READINESS.md:339`. `TextProjectile.as:16-47`
(`ttl = 12`, `velY = -5`, `ttl<10 → scale +0.1`, `ttl<4 → alpha -= 0.25`) and `MCSPlayer.as:3805` verbatim;
web `§1t138s0§.as:20 ttl = 12`. Two nits: `DuelIntroBar`'s `addFrameScript` is on line **23**, not 22
(I also read the bodies — `:85-87 frame1` hides `actionWord`, `:95-97 frame69` shows it, `:100-103 frame88`
`stop()`, and `:69` sets it to `getString(104)` = FIGHT!; `BattleIntroBar.as:16` is the non-duel variant,
frames 1/6/25). And "dialogue-box metrics … closed from source" inherits claim 3's overreach, so it is
**2 of 3** closed, not 3.

### 12 — `690-friend-bar-never-filmed` — HOLDS, and I upgraded it from PARTIAL to structural.

I reproduced all five extent measurements to the pixel: `duel_dense/_428.0` and `_427.0` and
`duel_frames/_t425.0s` → cols 52→1867 (1816, aspect 1.681); `zFt_combat/_t0320s` → 55→1861 (1807, 1.673);
`_t0325s` → 54→1861 (1808, 1.674); rows 0→1079 in all.

Then I did what the claim needed and didn't do — **scanned 267 frames sampled across all 45 frame
directories**. 236 were full 1920×1080; **every one had content aspect ≥ 1.45. Zero friend-bar candidates.**

More importantly, this is no longer an induction. `GameEngine.as:271-279` (web: `§1t1540s0§.as:271-273`):

```
var originalHeightWithBar:int = 690;
var originalWithBarAspectRatio:Number = originalWidth / originalHeightWithBar;   // 800/690 = 1.1594
if(newAspectRatio <= originalWithBarAspectRatio) { … stageShowingFriendBar = true; friendpanel.init(); }
```

The friend bar appears **only** when the player's window is at most 1.159 wide-to-tall — a portrait-ish
window. A 16:9 fullscreen capture can never trigger it. "Never filmed" is not a sampling accident; it is
structurally impossible in these recordings. The claim's conclusion (build it, but label it
INFERRED-from-source) is correct.

### 13 — `hud-symbol-metrics` (STILL_UNHELD) — **REFUTED (material). Two of three are findable.**

The claim says *"HUD panel/bar/plaque pixel geometry, the icon manifest, and the identity of the gold
up-arrow … remain ungrounded — I will not name any of them."* One third of that is right.

**(a) The icon manifest exists on disk.** The claim says *"the 139 `<icon>` ids … map to unextracted art"*.
There are not 139 ids — there are **20 distinct** ones (1,2,4,7,11,12,14,15,16,18,19,21,23,24,25,26,27,29,30,31),
and every one resolves by name:

> `reference/decompiled/shs3_android/scripts/GenericActionButton.as:262-345`
> `public function setInteractIcon(iconID:int) : * { … switch(iconID) { case NodeUI.ACTION_LEAVE: this.image = new LeaveActionIcon(); … } }`
> `reference/decompiled/shs3_android/scripts/NodeUI.as:13-75`
> `ACTION_SHOP:int = 1 … ACTION_MEDAL:int = 31`

25 `case NodeUI.ACTION_*` labels → 22 named icon classes (`ShopActionIcon`, `LeaveActionIcon`,
`BackActionIcon`, `UseActionIcon`, `ItemActionIcon`, `TravelActionIcon`, `GiftIcon`, the four
`*ElementActionIcon`s, …). **All 20 in-use ids are covered.** Only the vector art is unexported.
`icon 15` = `ACTION_BUY` (42 uses), `14` = `ACTION_LEAVE` (22), `23` = `ACTION_BACK` (19).

**(b) Some HUD pixel geometry is grounded — in code and in the frame.**
- `BattleUI.as:339` (and web `§1t113s0§.as:451`): `if(mousey > 420 * StatsManager.stageScale + StatsManager.stageOffsetY)`
  — the skill-bar hit band starts at **game y = 420** in an 800×480 stage.
- From my own crop: the skill-slot box outer border is **112 × 112 video px = 49–50 game px**, on a
  **137 video px = ~60 game px** pitch (numeral centres 1641.0 and 1777.5), centred at game y ≈ 450.
  A 50-px-tall box centred on 450 spans 425–475, which is exactly why the hit band opens at 420.
  That is a slot-widget spec good enough to build.

**(c) What genuinely survives as unheld** — and here the claim is right, so I am not refuting this part.
`BattleUI.doResize()` (`:929-936`) only sets `scaleX/scaleY/x/y` on the whole clip, so every panel,
bar and plaque position really is authored inside `symbol2952` and is not on disk. And the slot-3
up-arrow's skill identity is genuinely unproven — `ResourceManager.getSkillImage()` (`:302-316`) builds
`"skill" + id` from `RESOURCE_BASE`, which is the encrypted `115_Mobile_SHS3Resource` (S0-5). The
candidate set is enumerable (`SkillManager.as:8-106`, 50+ ids) but naming one would be guessing.
**Declining to name it was correct.**

---

## 2. New findings

**F1 — the web build is directly citable; stop inferring parity.** `reference/decompiled/shs3_payload/scripts/`
is web v0.717 with obfuscated class names but intact literals and public member names. Table in §0.
This is a cross-lane unlock, not a ui-hud one. (Pass 1 claim 18 found the *method*; nobody applied it
to the HUD.)

**F2 — a real, measured build divergence: `Math.ceil` (web) vs `int` (android)** in `SkillSlotButton.update()`.
See verdict 6. Every Android-only number in every lane is now suspect until spot-checked against
`shs3_payload/scripts/`.

**F3 — SWF header byte-check: web stage 800×690, android stage 800×480, both 24.000 fps.**
Parsed straight from the file headers:
```
shs3_android_payload_decoded.swf   CWS v26   rect 0,800 × 0,480   fps=24.000
shs3_payload_decoded.swf           CWS v17   rect 0,800 × 0,690   fps=24.000
shs3_binarydata_9_decrypted.swf    CWS v10   rect 0,800 × 0,690   fps=24.000
```
Two consequences. (i) **24 fps is now held**, which is the missing premise under every ms figure in
this lane (claim 2's 708/1000 ms, claim 8's 250/417 ms, claim 11's popup timings). (ii) The web build's
*authored* stage is the with-friend-bar size; the logical stage is 800×480 in both
(`§1t1523s0§.as:104,106  stageWidth = 800; stageHeight = 480;`).

**F4 — `resname 600 = "Special Control Point"`, `id 600 = "Auto Slash Off"`.** Proves Pass 1 read the
`id` column and kills its "different build revision" story. Overturns Pass 1 claim 17
(ui-hud.md:505-509), which is still live in the journal as a rule for *other* lanes:
*"ids below ~400 resolve directly; above that, resolve by string search"* — wrong advice.
The right rule is: **resolve by `resname`, always, at every id.**

**F5 — ledger blocker ④ is overturned with a proper cite.** Ledger (REBUILD_READINESS.md:235):
*"④ the '3 skill slots' is really ~2 abilities + a stance up-arrow."* `BattleUI.as:501-511` gives a slot a
keypress number **only** on the `StatsManager.skillSlots[i] != null` branch; the null branch calls
`initEmpty()`, which clears `keypressText` (`SkillSlotButton.as:128`). In my crop the up-arrow box
carries the numeral **3** and the blank box carries nothing — so the up-arrow is an **equipped skill**.
Stance is bound to `battlemodebust` (`BattleUI.as:275, :192`). Pass 1 claim 10 said this; Pass 2 restated
it inside a STILL_UNHELD claim with an empty `cite` and `overturns_ledger: false`, which loses it.

**F6 — skill-slot widget geometry, measured.** 49–50 × 49–50 game px box, 60 game px pitch, centre
y = 450, hit band opening at y = 420. Cites in verdict 13(b).

**F7 — the friend bar is structurally unfilmable, not merely unfilmed.** `GameEngine.as:275`, plus my
267-frame / 45-directory scan. Verdict 12.

---

## 3. Score

The surveyor put ui-hud at **88**. On this review: **85–86**.

The +3 was justified as (a) blocker ⑤ closed, (b) transition durations, (c) InteractUI. (b) and (c) are
real and well earned. (a) is not — ⑤ is a *metrics* blocker and neither the Options nor the Dialogue
half supplies metrics; both screens are still symbol-locked. Against that, F1/F3 are worth something
real (24 fps held; web-build cites available for most of the lane), and F2 is a **correctness debt**
rather than a score change: it means at least one shipped number in this lane is from the wrong build.

**Recommendation to the board: before any other lane spends effort, re-grep `shs3_payload/scripts/` for
the literals it is about to ship.** That is a one-command check and it just caught a real divergence.
