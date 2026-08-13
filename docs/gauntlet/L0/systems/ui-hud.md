# GAUNTLET L0 — system survey: **ui-hud**

Ledger under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20), §2 table row
`| **ui-hud** | 57 | ... |` (line 125) and the `### ui-hud — 57` block (line 233).

**Headline:** the ui-hud block is scored against the wrong evidence base. Every one of its five
blockers is closed or materially overturned by a source tree that the ledger never knew existed:
`reference/decompiled/shs3_android/` and `reference/decompiled/shs3_android_payload/` are the
**Android build of SHS:Duels decompiled with class and field names fully intact** — 970 classes,
including `BattleUI.as`, `OverworldHUD.as`, `OptionsUI.as`, `DuelIntroBar.as`, `ScreenTransition.as`,
`TextProjectile.as`, `LangManager.as`. The web payload (`shs3_payload`) is name-obfuscated
(`§1t1523s0§`), which is why prior passes worked from frames alone. The two bundles are the same
program; the android one is the Rosetta stone.

Second headline: **the string table exists and is on disk.** It was extracted this pass from
`reference/decrypted/shs3_android_payload_decoded.swf` as `DefineBinaryData` id 118
(`Mobile_Lang_EN`, 500,024 bytes, UTF-16LE XLIFF, **1,906 verbatim UI strings**). GAUNTLET §2.1
declared the table "NOT YET LOCATED" and `bindata/` "EXHAUSTED as a candidate" — correct for the
*web* payload (re-verified: exactly 27 binarydata tags, no XLIFF), wrong for the game as a whole.
Scope caveat is stated honestly in claim `string-table-partial` below.

New scratch artifacts (outside the repo, nothing in the repo was modified):
`…/scratchpad/andbin/` (42 extracted binarydata blobs), `…/scratchpad/lang_en.xliff`,
`…/scratchpad/lang_map.json`.

---

## Method notes

- All frame measurements were made by cropping and upscaling, per §0. Crops are stated per claim.
- Frame→stage mapping used: video B (`Nr4fQstqHDM`) content box measured at x∈[52,1867], full height
  y∈[0,1079]; stage_x = (frame_x − 52) × 800/1816, stage_y = frame_y × 480/1080.
- Where a measurement doc and a frame disagreed, **the frame wins** — flagged inline.

---

## Claims

### 1. `ui-hud/native-stage-800x480` — HELD (A2) — OVERTURNS LEDGER

Blocker ① ("aspect-ratio truth … *inspect `unt.png` for side-bars; read `stage.stageWidth` in a
build*") is closed **without a build**. The constant is a literal in the shipped code, in both
bundles:

```
reference/decompiled/shs3_android/scripts/StatsManager.as:80
      public static var stageWidth:int = 800;
reference/decompiled/shs3_android/scripts/StatsManager.as:82
      public static var stageHeight:int = 480;
```

and identically in the obfuscated web payload:

```
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:104
      public static var stageWidth:int = 800;
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:106
      public static var stageHeight:int = 480;
```

SWF headers (read directly from the decrypted files this pass):
`shs3_android_payload_decoded.swf` → stage rect **800 × 480 @ 24.0 fps**;
`shs3_payload_decoded.swf` → stage rect **800 × 690 @ 24.0 fps**.

Ledger sentence overturned: *"**aspect-ratio truth** (5:3 native → are x-fractions pillarbox-wrong?)
— *inspect `unt.png` for side-bars; read `stage.stageWidth` in a build.*"*

### 2. `ui-hud/dual-layout-480-690` — HELD (A2) — UNDER-CLAIM

The game has **two authored layouts**, not one. The fit routine picks 690 for containers narrower
than 800/690 ≈ 1.159 and re-inits the HUD when it does:

```
reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:270-285
         var _loc2_:int = 800;
         var _loc3_:int = 480;
         var _loc4_:int = 690;
         var _loc5_:Number = _loc2_ / _loc3_;
         var _loc6_:Number = _loc2_ / _loc4_;
         var _loc7_:Number = §1t9973s0§.stageWidth / §1t9973s0§.stageHeight;
         if(_loc7_ <= _loc6_)
         {
            _loc5_ = _loc6_;
            _loc3_ = _loc4_;
            …
               §1t406s0§.instance.§1t6500s0§.init();
```

The web SWF's own header rect is 800×690, i.e. the tall layout is the authored canvas. No ui-hud
bullet in the ledger mentions a second aspect layout at all.

### 3. `ui-hud/no-scale-plus-blocker-bars` — HELD (A2)

Scaling is manual, not Flash's: `§1t9973s0§.scaleMode = StageScaleMode.NO_SCALE;`
(`§1t1540s0§.as:154`), then a uniform fit with centred offsets (`.as:293-307`), then four explicit
bar sprites the game draws over the overscan itself:

```
reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:417-431
         u_blocker.width = §1t9973s0§.stageWidth;
         …
         l_blocker.width = §1t1523s0§.§1t9359s0§;
         r_blocker.x = §1t1523s0§.§1t9359s0§ + §1t1523s0§.§1t9363s0§ * §1t1523s0§.§1t9358s0§;
```

The bars are suppressed only in the exact-fit cases:
`|| §1t9973s0§.stageWidth == 800 && (§1t9973s0§.stageHeight == 480 || §1t9973s0§.stageHeight == 690)`
(`.as:388`). Container wider than 5:3 ⇒ fit-to-height ⇒ **left/right pillarbox**.

### 4. `ui-hud/pillarbox-measured-in-frames` — HELD (A1)

Predicted pillarbox is visible in both longplays. Crop used: full-width strip
`(0,0)-(1920,220)` of `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png` — black columns at both
edges, "AUTO SLASH OFF" plaque top-left, red circular pause button top-right.

Per-column luminance means, content extent (threshold 20):

| video | frame | content x | width | letterbox y | content aspect |
|---|---|---|---|---|---|
| B `Nr4fQstqHDM` | `duel_dense/Nr4fQstqHDM_427.0.png` | 52 → 1867 | 1816 | none (0→1079) | 1.6815 |
| B | `combat_analysis/Nr4fQstqHDM_t428.0.png` | 52 → 1867 | 1816 | none | 1.6815 |
| A `zFtCaTO0_1M` | `zFt_combat/zFtCaTO0_1M_t0320s.png` | 55 → 1861 | 1807 | none | 1.6731 |

Both ≈ 5:3 (1.667), **not** 16:9. The two videos have **different** bar widths (52 px vs 55 px), so
any x-fraction taken against full 1920 width is video-specific and non-transferable.

### 5. `ui-hud/master-x-fractions-are-wrong` — HELD (A1 adjudicating A4) — OVERTURNS LEDGER

The ledger's Ready bullet credits "combat-HUD geometry (frame-measured fractions)". The convention
those fractions were taken under is stated in `SHSD_MASTER_REFERENCE.md`:

```
docs/research/SHSD_MASTER_REFERENCE.md:1372
The game runs at a **16:9 aspect ratio** (original 1920×1080 full-bleed; target stage 1024×576).
All coordinates expressed as **absolute pixels @1920×1080** and **normalized fractions**
(origin top-left), which transfer 1:1 to the 1024×576 stage.

docs/research/SHSD_MASTER_REFERENCE.md:1290
- **Scale:** `study_px @1080 ÷ 1.875 = stage_px` (canvas 1024×576)
```

**THE FRAME WINS, AND IT SAYS THE DOC IS WRONG.** The capture is not "full-bleed 16:9" — claim 4
measured 52–55 px of black on each side, and the content aspect is 1.68. The same document already
contains the contradiction it needed (`:1289 "both 1920×1080, upscaled from native 800×480"`,
`:2134 "800×480 native res"`) but never propagated it into the measuring convention.

Quantified against a source-known coordinate. `BattleUI.as:132-136` places skill slots at
`x = 760 − i*60`, so slot i=2 sits at stage x = 640. Measured in the frame (row band y 1000–1010,
box border columns detected at x 1447–1452 and 1556–1559 ⇒ box centre **1503.5**):

| route | stage x |
|---|---|
| pillarbox-corrected `(1503.5−52)×800/1816` | **639.4** ✅ (source says 640) |
| ideal `(1503.5−60)/2.25` | 641.6 ✅ |
| MASTER's rule `1503.5 ÷ 1.875` → 801.9 of 1024 → ×800/1024 | **626.5** ❌ (13.5 px error) |

Vertical fractions are unaffected (there is no letterbox), but every **absolute "stage px"** number
in MASTER §8 is 1.2× too large (576/480), and every **x-fraction** is offset-wrong. Both defects
must be corrected before any of the "Ready" geometry is used.

Ledger sentence overturned: *"**Ready:** combat-HUD geometry (frame-measured fractions); …"*

### 6. `ui-hud/bars-snap-not-tween` — HELD (A2) — OVERTURNS LEDGER

Blocker ② asks "bar tween vs snap". Answer: **snap**. `scaleX` is assigned the raw ratio inside the
per-update call; there is no tween, easing, lerp or target value anywhere in the path.

```
reference/decompiled/shs3_android/scripts/BattleUI.as:245-262
      public function updateHp(hp:int, maxhp:int) : *
      {
         this.hptext.text = hp + "/" + maxhp;
         this.hptextshadow.text = hp + "/" + maxhp;
         this.hpbar.bar.scaleX = hp / maxhp;
      }
      public function updateChi(chi:int, maxchi:int) : *
      {
         …
         this.chibar.bar.scaleX = chi / maxchi;
      }
      public function updateReload(percentage:Number) : *
      {
         this.reloadbar.bar.scaleX = percentage;
         this.crittext.visible = percentage >= 1 && this.reloadbar.visible;
      }
```

Same pattern for the overworld AP/XP bars (`OverworldHUD.as:1376`, `:1532`) and the action progress
bar (`MCSProgressBar.as: this.bar.scaleX = this.counter / this.max;`).

Note the paired `hptext` + `hptextshadow` fields — the value text is drawn twice, offset, which is
the outline seen on the frame (claim 12). That is a HUD render contract, not a font effect.

### 7. `ui-hud/combo-has-no-pop` — HELD (A2)

Blocker ② also asks about "combo pop". There is none in code — visibility toggle plus two text
assignments (value + shadow), no `gotoAndPlay`, no scale/alpha work:

```
reference/decompiled/shs3_android/scripts/BattleUI.as:382-396
      public function showCombo(num:int) : *
      {
         if(StageManager.isRedFreeze())
         {
            return;
         }
         this.combo.visible = true;
         this.combo.combo.text = num.toString();
         this.combo.comboshadow.text = num.toString();
      }
      public function hideCombo() : *
      {
         this.combo.visible = false;
      }
```

Label text is `LangManager.getString(45)` = **"Hit Combo"** (lang id 45), corroborated verbatim at
`reference/extracted/ui_strings.txt:313` — `hit combo`.

### 8. `ui-hud/vignette-is-timeline-not-ramp` — HELD (A2)

Blocker ② "vignette ramp": the damage vignette is an authored MovieClip timeline replayed from
frame 1, not a coded ramp. There is no alpha curve to recover from frames — recover the clip.

```
reference/decompiled/shs3_android/scripts/BattleUI.as:424-428
      public function showHurtRed() : *
      {
         this.hurtred.visible = true;
         this.hurtred.gotoAndPlay(1);
      }
```

### 9. `ui-hud/floating-damage-popups` — HELD (A2) — CLOSES BLOCKER ③

Blocker ③ ("floating damage/crit **popups** (absent from the ledger, confirmed to exist)") is closed
with a complete, portable spec. The popup is a pooled `TextProjectile`:

```
reference/decompiled/shs3_android/scripts/TextProjectile.as:16-50
      public function initText(str:String, color:int = 0) : *
      {
         visible = true;
         flying = true;
         ttl = 12;
         this.words.text = str;
         this.velX = 0;
         this.velY = -5;
         scaleX = 1;  scaleY = 1;  alpha = 1;
         this.words.textColor = color;
      }
      override public function update() : *
      {
         …
         x += velX;  y += velY;  --ttl;
         if(ttl < 10)
         {
            scaleX += 0.1;  scaleY += 0.1;
            if(ttl < 4)
            {
               alpha -= 0.25;
            }
         }
```

Spawn point and colour set (identical call shape in every enemy class):

```
reference/decompiled/shs3_android/scripts/ProjectileManager.as:468
      public static function createFloatingText(posx:int, posy:int, str:String, color:int = 10027008)
reference/decompiled/shs3_android/scripts/EnemyClone.as:306-327
   ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),0);
   ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,damage.toString(),10027008);
   ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,fireDamage.toString(),16737792);
   ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,windDamage.toString(),13421772);
   ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,waterDamage.toString(),26367);
   ProjectileManager.createFloatingText(mcs.x,mcs.y - 100,earthDamage.toString(),6697728);
```

| channel | decimal | hex |
|---|---:|---|
| physical (default) | 10027008 | `#990000` |
| the `0` variant (crit/special path) | 0 | `#000000` |
| fire | 16737792 | `#FF6600` |
| wind | 13421772 | `#CCCCCC` |
| water | 26367 | `#0066FF` |
| earth | 6697728 | `#663300` |

Offset is **(target.x, target.y − 100)** in 800×480 stage space; rise 5 px/frame at 24 fps; grows
0.1 scale/frame for the last 10 frames; fades 0.25 alpha/frame for the last 4; life 12 frames
(500 ms). Suppressed entirely during `StageManager.isRedFreeze()`.

Separately, `crittext` is **not** a floating popup — it is a fixed HUD field reading
`LangManager.getString(175)` = "Critical Hit", gated on `reloadbar` being full (`BattleUI.as:262`).
Two different things the ledger's one bullet conflated.

### 10. `ui-hud/skill-slots-3-to-8` — HELD (A2 + A1) — OVERTURNS LEDGER

Blocker ④ claims *"the '3 skill slots' is really ~2 abilities + a stance up-arrow."* The source says
otherwise: three genuine, data-driven `SkillSlotButton`s, count derived from a stat, with eight
buttons pre-built and laid out on a fixed 60 px pitch.

```
reference/decompiled/shs3_android/scripts/StatsManager.as:2293-2296
      public static function getSkillSlotCount() : int
      {
         return 3 + getStat(1008);
      }
reference/decompiled/shs3_android/scripts/BattleUI.as:132-138
         for(var i:int = 0; i < 8; i++)
         {
            skillSlotButton = new SkillSlotButton();
            skillSlotButton.x = 760 - i * 60;
            skillSlotButton.y = 450;
            …
reference/decompiled/shs3_android/scripts/BattleUI.as:496-504
         this.slotCount = StatsManager.getSkillSlotCount();
         …
            skillSlotButton.visible = i < this.slotCount;
            …
               skillSlotButton.initKeyPressText(this.slotCount - i);
```

The upgrade ladder is named in the string table: id 1506 `"Skill Slots+"`, ids 1648/1649/1650
`"4 skill slots"` / `"5 skill slots"` / `"6 skill slots"`. So: **base 3, max 6 by skill, 8 buttons
allocated.**

Frame check (crop `(0,900)-(1920,1080)` of `duel_dense/Nr4fQstqHDM_427.0.png`, viewed at 1:1):
three boxes on the bottom right, numerals **2** and **3** printed above the middle and right boxes,
right box holding a gold up-arrow. That matches `initKeyPressText(slotCount − i)` exactly for
slotCount=3 (i=0 → rightmost → key 3). The stance control is **not** the arrow: stance is bound to
the portrait bust (`BattleUI.as:275 this.battlemodebust.hitTestPoint(...) → stanceButtonClick()`),
with `changestancelabel` = `getString(208)` = "Change Stance" shown on `MOUSE_OVER` of the bust
(`:192`, `:430-434`). The up-arrow is a skill occupying slot 3.

Ledger sentence overturned: *"④ the "3 skill slots" is really ~2 abilities + a stance up-arrow."*

### 11. `ui-hud/portrait-ring-is-stance-colored` — HELD (A2 + A1) — CONFIRMS + UPGRADES SURFACE

The ledger's Surface bullet *"portrait ring is stance-colored, not fixed red"* is correct. Mechanism:

```
reference/decompiled/shs3_android/scripts/BattleUI.as:372-375
      public function setStanceColor(num:int) : *
      {
         this.battlemodebust.stancecolor1.gotoAndStop(num);
      }
```

— a MovieClip frame index keyed by stance id, i.e. the ring colours are authored frames, not tint.

Frame proof (crop `(60,900)-(700,1080)`, 2× LANCZOS upscale):
- `reference/frames/session11/stance-reach/B_t851.867_LIGHT_ring_blue_CHANGE-STANCE_tooltip.png`
  → **blue/violet** ring, HUD label reads "LIGHT STANCE", "CHANGE STANCE" tooltip visible bottom-left,
  HP 20/20 green, Chi 31/31 blue. Median saturated ring hue 229.8°.
- `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png` → **red** ring. Median hue 6.3°.

A hue sweep over 11 combat frame directories found ring clusters at ~0°, ~30–45°, ~120°, ~225–240°,
i.e. at least four distinct ring states — more than the three stances. Exact per-stance hex is
STILL_UNHELD (see claim 17).

### 12. `ui-hud/damage-modifier-readout` — HELD (A1) — UNDER-CLAIM

Crop `(60,900)-(700,1080)` @2× of `reference/frames/duel_dense/Nr4fQstqHDM_427.0.png` shows, below
the HP/Chi bars: a tan/brown label strip reading **"CANNOT CHANGE STANCE"**, and beneath it, in
yellow, **"150% DAMAGE"**. Neither a stance-lock indicator nor a damage-multiplier readout appears
anywhere in the ledger's ui-hud Ready list or its blockers. The bar-value text is white with a hard
black offset duplicate — the `hptext`/`hptextshadow` pair from claim 6, seen rendered.

### 13. `ui-hud/intro-beats-exact` — HELD (A2)

The Ready bullet "two-beat VS→FIGHT intro" is right and can now be given exact frames. The intro is
a timeline with four scripted frames, at the SWF's 24 fps:

```
reference/decompiled/shs3_android/scripts/DuelIntroBar.as:22-31, 84-105
         addFrameScript(0,this.frame1,19,this.frame20,68,this.frame69,87,this.frame88);
         this.leftbust.scaleX = 4;   this.leftbust.scaleY = 4;
         this.rightbust.scaleX = -4; this.rightbust.scaleY = 4;
      internal function frame1()  { this.actionWord.visible = false; }
      internal function frame20() { this.showText(); }
      internal function frame69() { this.actionWord.visible = true; }
      internal function frame88() { this.introEnd(); stop(); }
```

| beat | frame | t @24 fps |
|---|---:|---:|
| busts + names appear | 20 | 792 ms |
| action word appears | 69 | 2 042 ms |
| intro ends | 88 | 3 667 ms |

The word is `LangManager.getString(104)` = **"FIGHT!"** (corroborated verbatim at
`reference/extracted/ui_strings.txt:138` — `FIGHT!`). Busts render at 4× scale, right one
x-mirrored. Name colours: player `16763904` = `#FFC300`, opponent `16777215` = `#FFFFFF`.
This independently corroborates `SHSD_MASTER_REFERENCE.md:253` ("VS | ~2000ms") — the ~2 s is the
frame-20→frame-69 hold, 2 042 ms exactly.

### 14. `ui-hud/ap-is-in-the-overworld-hud` — HELD (A2) — OVERTURNS LEDGER

`OverworldHUD` owns a full AP meter — label, bar, value text + shadow, a regen countdown timer, and
a buy-more button:

```
reference/decompiled/shs3_android/scripts/OverworldHUD.as:64
      public var overworldHUD_ap:MovieClip;
reference/decompiled/shs3_android/scripts/OverworldHUD.as:208-211
         LangManager.initTextField(this.overworldHUD_ap.aplabel,true);
         this.overworldHUD_ap.aplabel.text = LangManager.getString(65);
reference/decompiled/shs3_android/scripts/OverworldHUD.as:1376
         this.overworldHUD_ap.APbar.bar.scaleX = percentage;
reference/decompiled/shs3_android/scripts/OverworldHUD.as:1381-1384
         if(this.overworldHUD_ap.APtimer.text != duration)
         { this.overworldHUD_ap.APtimer.text = duration;
           this.overworldHUD_ap.APtimershadow.text = duration; }
reference/decompiled/shs3_android/scripts/OverworldHUD.as:1488-1489
         this.overworldHUD_ap.APtext.text = ap + " / " + apmax;
```

`getString(65)` = **"Action Points"**; `getString(66)` = **"Experience Points"** (both corroborated
verbatim in `reference/extracted/ui_strings.txt:209` and `:286`).

Overturned in the ledger's own primary source, twice:
`SHSD_MASTER_REFERENCE.md:192` — *"| AP | 30 | Menu-only (not shown in overworld HUD) |"* and
`:419` — *"Fourth pool, AP (pale gold), exists only in Player▸Stats menu."*
Both are false. Bonus: the presence of `APtimer` proves AP regen is a **countdown-timer** model,
which speaks to the world-exploration blocker ④ "AP regen rate + cap".

### 15. `ui-hud/ribbon-and-maps-named` — HELD (A2)

The Ready bullets "8-icon menu ribbon" and "minimap" are correct and now nameable. `OverworldHUD`
declares exactly eight ribbon `SimpleButton`s on `buttonsBar` — `shopButton`, `chatButton`,
`playerStatsButton`, `duelmodeButton`, `playerQuestLogButton`, `playerSkillsButton`, `optionsButton`,
`warButton` (`OverworldHUD.as:22-84`), each with a paired label TextField (`shoplabel`, `chatlabel`,
`playerlabel`, `duellabel`, `questloglabel`, `skillslabel`, `optionslabel`, `warlabel`), plus five
recoloured war variants (`warButtonRed/Green/Blue/Yellow/Black/Custom`) and three notification
badges (`hasStatPointMark`, `hasSkillPointMark`, `hasWarMoveMark`).

Correction to "minimap": there are **three** map widgets, not one —
`public var minimap:Minimap;` `public var bigmap:Bigmap;` `public var territorymap:Territorymap;`
(`OverworldHUD.as:38-39, :70`).

### 16. `ui-hud/string-table-partial` — HELD (A2) — OVERTURNS THE GAUNTLET §2.1 BLOCKER, IN PART

The UI string table is **found**. `LangManager.getString(n)` resolves against an XLIFF that ships
embedded in the Android payload:

```
reference/decompiled/shs3_android/scripts/Mobile_Lang_EN.as:5-6
   [Embed(source="/_assets/118_Mobile_Lang_EN.bin", mimeType="application/octet-stream")]
   public class Mobile_Lang_EN extends ByteArrayAsset
```

Extracted this pass from `reference/decrypted/shs3_android_payload_decoded.swf`
(DefineBinaryData id 118, 500,024 bytes, UTF-16LE):

```
<?xml version="1.0"?>
<xliff version="1.0" xml:lang="en">
<file datatype="plaintext" source-language="EN">
<trans-unit id="0" resname="0"><source>No</source></trans-unit>
<trans-unit id="45" resname="45"><source>Hit Combo</source></trans-unit>
<trans-unit id="104" resname="104"><source>FIGHT!</source></trans-unit>
<trans-unit id="175" resname="175"><source>Critical Hit</source></trans-unit>
<trans-unit id="208" resname="208"><source>Change Stance</source></trans-unit>
<trans-unit id="388" resname="388"><source>Game Paused</source></trans-unit>
<trans-unit id="600" resname="600"><source>Auto Slash Off</source></trans-unit>
<trans-unit id="609" resname="609"><source>Draw a line to slash</source></trans-unit>
```

2,555 `<trans-unit>` elements parse to **1,906 unique ids, contiguous 0…1905**.

**The honest limit.** This closes UI/HUD strings and nothing more:
- `reference/extracted/itemdata.xml` `<name>` ids run to 4427; `skilldata.xml` `<displayname>` ids
  run 6000–6141; `<level><desc>` ids are 7000+. **All are out of range of this table** (max 1905) —
  every lookup returns `None`. Item/skill/npc display names remain **STILL_UNHELD**.
- GAUNTLET §2.1's statement that `bindata/` is exhausted is re-verified as correct *for the web
  payload*: re-extracting `shs3_payload_decoded.swf` this pass yields exactly **27** DefineBinaryData
  tags, matching `reference/extracted/bindata/`, and none is an XLIFF. The table was never in the
  file everyone was searching.
- `LangManager.setLanguage` shows the canonical table was **server-hosted**
  (`Locale.addXMLPath(ENGLISH, server + "shs3_en.xml")`, `LangManager.as:57`), and the embedded copy
  is the offline fallback (`"loadLanguage: error, using embedded EN"`, `Mobile.as:569`) — which is
  why it is truncated.

Ledger sentence overturned (partially): GAUNTLET §2.1 — *"bindata/ is now EXHAUSTED as a candidate.
So numbers are portable today; NAMES ARE NOT."* Correct for item/skill/npc names; **wrong for every
UI and HUD string**, 1,906 of which are now on disk.

### 17. `ui-hud/lang-id-drift-caveat` — HELD (A2) — do not use this table blind

The extracted table is from a **different build revision** than the decompiled `BattleUI`. Low ids
agree, high ids do not:

| call site | id | table says | correct? |
|---|---:|---|---|
| `BattleUI.as:99` combo label | 45 | "Hit Combo" | ✅ |
| `DuelIntroBar.as:70` action word | 104 | "FIGHT!" | ✅ |
| `BattleUI.as:102` crit text | 175 | "Critical Hit" | ✅ |
| `BattleUI.as:110` stance label | 208 | "Change Stance" | ✅ |
| `OptionsUI.as:33-35` | 6/7/8 | "Music"/"Sound"/"Blood" | ✅ |
| `OverworldHUD.as:209/213` | 65/66 | "Action Points"/"Experience Points" | ✅ |
| `BattleUI.as:124-125` autoslash off/on | 619/620 | "Special Event"/"Unbreakable" | ❌ |
| `OverworldHUD.as:211` AP bar icon | 223 | "Remove from friend list" | ❌ |

The true strings for the mismatches are present at **different** ids — 600 `"Auto Slash Off"`,
601 `"Auto Slash On"` — and 600/601 is what the *frame* shows ("AUTO SLASH OFF" plaque, claim 4;
`ui_strings.txt:221-222` `auto slash off` / `auto slash on`). **Frame + web-build strings win over
the android id numbering.** Rule for downstream lanes: ids below ~400 resolve directly; above that,
resolve by **string search, then corroborate against `ui_strings.txt` or a frame** — never by id alone.

### 18. `ui-hud/rosetta-deobfuscation` — HELD (A2) — method, not a number

The obfuscated web payload can be de-obfuscated by structural alignment with the android bundle.
Proof pair — identical statement, same clamp constant, different symbol names:

```
reference/decompiled/shs3_payload/scripts/§1t406s0§.as:3217
            else if(this.§1t6438s0§.x > §1t1523s0§.stageWidth - 180)
reference/decompiled/shs3_android/scripts/OverworldHUD.as:3225
               this.interactLabel.x = StatsManager.stageWidth - 180;
```

⇒ `§1t406s0§` = `OverworldHUD`, `§1t1523s0§` = `StatsManager`, `§1t6438s0§` = `interactLabel`.
Both files are ~3,300 lines with matching structure. This is a general-purpose unlock for **every**
gauntlet lane, not just ui-hud.

### 19. `ui-hud/pause-options-dialogue-metrics` — PARTIAL

Blocker ⑤ ("pause/options/dialogue-box exact metrics"). Half closes, half does not.

**Held:** the complete widget inventory and field lists.
`OptionsUI.as:9-30` declares `musiccheck`, `soundcheck`, `bloodcheck`, `chatcheck`, `recordcheck`,
`fullscreencheck` (all `XCheckBox`), `titletext`, `quitdialog:QuitDialog`,
`closewindowbutton:YellowButton`, `backtomainmenubutton:GreyButton`; strings resolve to "Music",
"Sound", "Blood", "Options" (id 10), "Title Screen" (74), "Return To Game" (75). Pause state string
is id 388 "Game Paused" (verbatim at `ui_strings.txt:298` — `game paused`). `DialogBox.as:11-16`
declares `button:YellowButton`, `button2:YellowButton`, `msgText:TextField` with a
`show(msg, buttonText, showOK)` contract and a mutually-exclusive `dialogBig` sibling. Sibling
classes `DialogBoxBig`, `QuestDialogueUI`, `QuestTextUI`, `QuestOptionUI`, `DialogueBust`,
`ConfirmDialog`, `ConfirmBuyDialogBox`, `LootDialog`, `LevelUpDialog`, `MOTDDialogBox` all exist by
name in `docs/gauntlet/L0/index/actionscript.json`.

**Still unheld:** exact pixel metrics. Every one of these classes is
`[Embed(source="/_assets/assets.swf", symbol="symbolNNNN")]` — the geometry lives in the symbol's
shape/placement records inside `assets.swf`, and only `scripts/` was exported from the SWFs
(`reference/decompiled/shs3_android/` contains a `scripts` directory and nothing else). The metrics
are recoverable — one JPEXS shape/sprite export away — but they are **not on disk today**.

### 20. `ui-hud/eq-n-ux` — STILL_UNHELD

The Ready bullet "(EQ:n) UX" could not be grounded this pass. `"EQ:"` appears in neither the 1,906-id
string table nor `reference/extracted/ui_strings.txt`; the only `EQ` token in the android source is
`NetworkManager.MSG_PLAYERUPDATEEQ` (a wire opcode, id 104), which is unrelated to an inventory
label. No cite. Honest answer: unheld.

### 21. `ui-hud/parchment-chrome-and-transition-timings` — STILL_UNHELD

`ScreenTransition.as` is on disk and names four transition types
(`TRANSITION_BLACKCLOSE/BLACKOPEN/WHITEIN/WAIT`) and ten actions, so the transition *taxonomy* is
held — but the durations are driven by `blackMovtSpeed` and per-call `counter` values I did not
trace to constants this pass, and the "parchment chrome family" palette was not re-measured from a
frame. Claiming either would be guessing. Unheld pending a follow-up.

---

## Re-score

**ui-hud: 57 → 85.**

Closed outright: blocker ① (native 800×480 from a shipped constant + SWF header + frame-measured
pillarbox), ② (bars snap; combo has no pop; vignette is a timeline clip), ③ (floating-popup spec
complete with six colour channels and a frame-exact motion curve), ④ (overturned — 3 data-driven
slots, ladder to 6, 8 allocated, stance is on the bust). Blocker ⑤ half-closed (inventory + strings
held, pixel metrics not exported yet). Both Surface bullets confirmed at source level, and the
overworld HUD is no longer "only in segment A-00" — it is 3,387 lines of named ActionScript.

Held back from 90+ by three real gaps: (a) the symbol geometry inside `assets.swf` is not exported,
so exact HUD pixel metrics remain a pending extraction; (b) MASTER §8's existing fractions must be
re-derived under the pillarbox correction before reuse — they are currently wrong, not merely
imprecise; (c) the android/web id drift means every string needs corroboration rather than a blind
lookup.

## Recommended follow-ups (not done here — this lane touches no source)

1. JPEXS-export shapes/sprites from `shs3_android_payload_decoded.swf` for the `BattleUI`,
   `OverworldHUD`, `OptionsUI`, `DialogBox` symbols → closes blocker ⑤ and supplies exact metrics.
2. Re-derive every MASTER §8 HUD coordinate as `(frame_x − barWidth) × 800 / contentWidth`,
   per-video (52 px / 1816 for video B; 55 px / 1807 for video A).
3. Run claim 18's Rosetta alignment across all 1,079 obfuscated web-payload classes — this is a
   whole-project unlock, not a ui-hud one.
