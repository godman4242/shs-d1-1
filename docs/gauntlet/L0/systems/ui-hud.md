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

---
---

# PASS 2 — independent re-survey (2026-08-14)

Second surveyor, run cold against the same ledger block. **Nothing above was edited.** Pass 1's
claims 1–18 were independently re-derived and hold (see §R below). This pass records only what is
**new or corrects Pass 1**, and it overturns two of Pass 1's own verdicts.

Headline: **`docs/gauntlet/L0/index/strings.json` and Pass 1 use two DIFFERENT string-id
mappings, and a video frame decides which one `LangManager.getString()` actually uses.** Every
string id Pass 1 quoted above 211 is wrong. Details in claim P1.

---

## P1. `ui-hud/langmanager-uses-resname-not-id` — HELD (A1 adjudicating A2) — CORRECTS PASS 1

`118_Mobile_Lang_EN.bin` gives every unit **two** keys:

```
reference/extracted/android/118_Mobile_Lang_EN.bin  (UTF-16LE XLIFF, 2,555 trans-units)
<trans-unit id="0" resname="0">
<trans-unit id="1" resname="1">
```

They agree up to id 211 and then diverge permanently — first divergence
`id="212" resname="222"` (source `CHI`); **2,343 of 2,555 units have id ≠ resname**, because 649
units carry non-numeric resnames (`IDS_Q0TITLE` … , first at id 1906). `strings.json` is keyed by
**resname**; Pass 1 built its own map keyed by **id** (hence its "1,906 strings" — that is exactly
the count of numeric-id units).

The frame settles which key the game uses. `BattleUI.as:124` reads
`this.autoslashofflabel.text = LangManager.getString(619);`

| key 619 under | text |
|---|---|
| resname (`strings.json`) | **"Auto Slash Off"** |
| id attribute (Pass 1's map) | "Special Event" |

Crop `(40,0)-(560,200)` of `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, upscaled 3× —
the top-left plaque reads **AUTO SLASH OFF** (rendered all-caps; the table stores Title Case, so the
TextField/typeface uppercases). **The frame wins: `LangManager` ids are resnames.**

Consequences, all inside this document:
- Pass 1 claim 19's *"Pause state string is id 388 'Game Paused'"* is wrong. Resname **388 =
  "Condition: Poor"**; **"Game Paused" is resname 407.**
- Pass 1 claim 10's *"id 1506 `Skill Slots+`, ids 1648/1649/1650"* → correct resnames are
  **6014** (`Skill Slots+`) and **7009 / 7010 / 7011** (`4 / 5 / 6 skill slots`). The *content* of
  that claim (base 3, ladder to 6) survives; only the ids were wrong.
- Pass 1 claim 13's `getString(104)` = "FIGHT!" is below the divergence point and is safe
  (resname 104 = `FIGHT!` too).

Any lane that quoted a string id above 211 must re-derive it against `strings.json` resnames.

## P2. `ui-hud/transition-durations-exact` — HELD (A2) — OVERTURNS PASS 1 CLAIM 21

Pass 1: *"the durations are driven by `blackMovtSpeed` and per-call `counter` values I did not
trace to constants this pass … Claiming either would be guessing. Unheld pending a follow-up."*
They are constants, and they are in the same file.

```
reference/decompiled/shs3_android/scripts/ScreenTransition.as:143-146   (BLACKCLOSE setup)
         this.blackup.y = -240;
         this.blackdown.y = 480;
         this.blackMovtSpeed = 0;
         this.counter = 0;
reference/decompiled/shs3_android/scripts/ScreenTransition.as:80-88     (per-frame)
            this.blackup.y += this.blackMovtSpeed;
            this.blackdown.y -= this.blackMovtSpeed;
            this.blackMovtSpeed += 2;
            if(this.blackup.y >= 0)
            {
               this.blackup.y = 0;
               this.blackdown.y = 240;
               if(this.counter >= 17)
reference/decompiled/shs3_android/scripts/ScreenTransition.as:111       (WHITEIN)
            this.white.alpha -= 1 / 24;
```

Arithmetic: speed is applied **before** it increments, so displacement after n frames is
0+2+4+…+2(n−2) = (n−2)(n−1). Closing needs 240 px; **(17−2)(17−1) = 240 exactly** — hence the
`counter >= 17` gate is not a magic number, it is the closing time. Same profile for BLACKOPEN
(`:159-162`, 0 → −240).

| transition | frames | ms @ 24 fps |
|---|---:|---:|
| black shutter close (accelerating, +2 px/frame²) | 17 | 708 |
| black shutter open | 17 | 708 |
| white fade-in (`alpha -= 1/24`) | 24 | 1000 |
| WHITEIN action fires at `counter == 2` | 2 | 83 |

Shutter halves park at ±240 and meet at y=0/240 — 240 = half of the 480-px stage: a third
independent confirmation of the 800×480 base.

## P3. `ui-hud/dialogbox-metrics-in-code` — HELD (A2) — OVERTURNS LEDGER BLOCKER ⑤ (dialogue half)

Ledger blocker ⑤: *"pause/options/dialogue-box exact metrics."* Pass 1 filed this PARTIAL on the
grounds that "the geometry lives in the symbol". For `DialogBox` it does **not** — the layout is
re-assigned in ActionScript on every show:

```
reference/decompiled/shs3_android/scripts/DialogBox.as:46,49,53,59,63
         this.button.x = 340;               // single-button layout
            this.msgText.y = 187.5;         // when a button is shown
            this.msgText.y = 220;           // when no button is shown
            myFormat.align = "center";      // if msgText.numLines <= 2
            myFormat.align = "left";        // otherwise
reference/decompiled/shs3_android/scripts/DialogBox.as:136,147            // Yes/No layout
            this.button.x = 270;
            this.button2.x = 425;
```

So: dialog buttons sit at x=340 (one) or x=270 / x=425 (two) in 800-wide stage space, message
baseline moves 187.5 ↔ 220 depending on whether a button is present, and the copy auto-centres at
≤2 lines and left-aligns beyond that. Yes/No text defaults are resnames 1/0 = "Yes"/"No"; the
"Get AP" second button is resname 227 with `button.x = 270 / button2.x = 425` (`:86,105`).

## P4. `ui-hud/pause-is-click-anywhere` — HELD (A2) — closes the pause half of blocker ⑤

```
reference/decompiled/shs3_android/scripts/BattleUI.as:179
         this.pausebutton.visible = !GameEngine.isDuelMode() && !GameEngine.isPvPRoomMode();
reference/decompiled/shs3_android/scripts/BattleUI.as:324-328
         if(this.pausebutton.visible && this.pausebutton.hitTestPoint(mousex,mousey))
         {
            GameEngine.togglePaused();
            this.pauseScreen.visible = true;
            setChildIndex(this.pauseScreen,numChildren - 1);
reference/decompiled/shs3_android/scripts/BattleUI.as:267-272
         if(GameEngine.isPaused)
         {
            GameEngine.setPaused(false);
            this.pauseScreen.visible = false;
            return true;
```

Behaviour spec: the pause button exists **only outside duel/PvP**; pressing it raises `pauseScreen`
to the top of the display list; and **any** click anywhere resumes (the paused branch is the first
test in `gotClicked`). There is no pause *menu* in battle — Options is an overworld screen.

## P5. `ui-hud/options-screen-complete` — HELD (A2)

`OptionsUI.as:34-43` is the whole screen, and the copy resolves verbatim (resnames):

| widget | resname | text |
|---|---:|---|
| `musiccheck` | 6 | Music |
| `soundcheck` | 7 | Sound |
| `bloodcheck` | 8 | Blood |
| `chatcheck` | 396 | Chat notification |
| `recordcheck` | 492 | Record Duels |
| `fullscreencheck` | 752 | Full Screen |
| `backtomainmenubutton` (GreyButton) | 74 | Title Screen |
| `closewindowbutton` (YellowButton) | 75 | Return To Game |
| `titletext` | 10 | Options |

Conditional hides: `bloodcheck.visible = false` when `StatsManager.hideBloodOption`;
`fullscreencheck.visible = false` when `StatsManager.isMobile` (`:44-51`).

## P6. `ui-hud/skill-cooldown-12-step-quantised` — HELD (A2) — extends blocker ②

Blocker ② asks for the HUD's dynamic feel. The cooldown sweep is **quantised to 12 steps**, not
smooth, and disabled is a 13th frame:

```
reference/decompiled/shs3_android/scripts/SkillSlotButton.as:220
            newframe = int(this.cooldown / this.cooldownmax * 12) + 1;
reference/decompiled/shs3_android/scripts/SkillSlotButton.as:146
         this.shade.gotoAndStop(13);        // disableButton()
```

Same "no tween anywhere" character as Pass 1's snapping bars. Also on the slot face:
Roman-numeral skill level (`:48-78`, "" for L0/1 then II…X), and for kunai/trap skills the level
text is replaced by **live ammo** `StatsManager.getStat(2501)` (`:110`), with Windmill showing
`floor(ammo/4)` (`:114`). Stance-gated skills (Shunpo/Thousand Stabs/Deadly Cleave) grey out when
the stance is wrong (`:153-158`).

## P7. `ui-hud/slot-geometry-frame-validated` — HELD (A1 + A2)

Pass 1 established the slot *rule*; this pass measures it against the video and finds the **Android
v0.682 source predicts the web v0.717 frame to ~1 px**, which is the strongest parity evidence in
this lane.

Frame `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, crop `(1380,920)-(1880,1080)` upscaled
3×: three slot boxes, the leftmost **empty and unnumbered**, middle labelled **2**, right labelled
**3** holding a gold up-arrow. The empty box's bright border was measured numerically:
columns 1449→1558 (centre **1503.5**), rows 952→1073 (centre **1012.5**).

Converting with this video's own pillarbox (content x0=52, width 1816 ⇒ scale 2.270):

| | measured (game px) | code says |
|---|---:|---:|
| slot i=2 centre x | 639.4 | **640** (`760 − 2×60`) |
| slot centre y | 446.0 | **450** |
| slot pitch | 137 frame px → 60.4 | **60** |

`BattleUI.as:133-134` `skillSlotButton.x = 760 - i * 60; skillSlotButton.y = 450;`
The unnumbered empty box matches `initEmpty()` clearing `keypressText` (`SkillSlotButton.as:128`).
Click gating agrees too: `BattleUI.as:339` `if(mousey > 420 * StatsManager.stageScale + …)` — the
slot strip is the bottom 60 px of the 480-tall stage.

## P8. `ui-hud/result-cards-exact` — HELD (A2)

The ledger banks "result cards" as Ready with no numbers. They are an 11-frame timeline:

```
reference/decompiled/shs3_android/scripts/WinUI.as:26
         addFrameScript(0,this.frame1,6,this.frame7,10,this.frame11);
```
brush stroke wipes frames 1–6, `winwords` appears **frame 7 (250 ms)**, `stop()` at **frame 11
(417 ms)**. `winwords.gotoAndStop(1)` = win, **`gotoAndStop(2)` = DRAW** (`:49-55`) — a result
state the ledger never mentions. Buttons: `continuebutton` (Grey, resname 482 "Continue") +
`savereplaybutton` (Yellow, 483 "Save Replay"), both hidden unless the duel was being recorded
(`:32-37`); on save, `urltext` shows
`"http://www.strawhatsamuraiduels.com/watch?name=" + StatsManager.charname` (`:90`).
`LoseUI.as:35-36,45,53` mirrors it with `respawnbutton` (resname 480 "Respawn", or 483 when
recording), a `gold` readout, `getgoldpromptdialog` and `payui` — i.e. the death card is also the
revive-for-gold paywall.

## P9. `ui-hud/interactui-menu-system` — HELD (A2) — UNDER-CLAIM, whole subsystem missing

Neither the ledger's ui-hud block nor Pass 1 mentions the game's town/interaction UI at all. It is
fully data-driven and on disk: `reference/extracted/android/90_InteractUI_UIData.bin`
(20,947 bytes, root `<uidata>`) — **19 `<ui>` screens, 47 `<menu>` pages, 139 `<option>` rows,
139 `<icon>` refs, 28 `<condition><has>` gates, 67 `<param>`, 19 `<title>`.**

```
reference/extracted/android/90_InteractUI_UIData.bin:5-9
		<title>peddler</title>
		<menu>
		<option><label>83</label><icon>15</icon><action><id>peddlerbuy</id></action></option> <!-- buy buyicon-->
		<option><label>84</label><icon>16</icon><action><id>peddlersell</id></action></option> <!-- sell sellicon-->
		<option><label>85</label><icon>14</icon><action><id>close</id></action></option> <!-- leave leaveicon-->
reference/extracted/android/90_InteractUI_UIData.bin:17
		<option><label>269</label><icon>1</icon><condition><has><id>20040</id><qty>1</qty></has></condition><action><id>goto</id><param>1</param>…<errormsg>270</errormsg></action></option> <!-- "sell crops" shopicon "you don't have any crops for sale" -->
```

The 19 titles, verbatim, at lines 5/14/47/66/73/82/94/109/117/142/161/190/219/227/249/257/281/291/301:
`peddler, market, vegpatch, stables, merchant, inn, rebirth, barber, bank, gambling den, getcoins,
getap, leaveclan, blacksmith, recentevents, playerpanel, joincustomclanrecruit,
joincustomclangeneral, towntoll`. Labels resolve through `strings.json` (83/84/85/232 = Buy / Sell
/ Leave / Back). The dev's own inline comments name each icon slot. This is the interaction-UI
contract — menu nesting (`goto param`), inventory gates, error copy — free.

## P10. `ui-hud/typography-edo-sz` — HELD (A2)

HUD/tooltip typography is specified in the **web** payload's own TextField defaults, so it needs no
android caveat:

```
reference/extracted/ui_strings.txt:100
…physical dmg: 1234 - 1235 &nbsp;(heavy)critical dmg: 1234-1235 *(heavy)piercing dmg: 20<font face="Edo SZ" size="14" color="#cccccc" letterSpacing="0.…
reference/extracted/ui_strings.txt:314
hp: 123 / 123 &nbsp;(hp regen 12 ) chi: 123 / 434 &nbsp;(chi regen 13)<font face="Edo SZ" size="14" color="#cccccc" letterSpacing="0.00" kerning…
reference/extracted/ui_strings.txt:206
aaa<font face="Edo SZ" size="16" color="#ffffff" letterSpacing="0.…
```

Body copy **Edo SZ 13/14 px #cccccc**, headings **16 px #ffffff**, `letterSpacing="0.00"`,
`kerning="1"`; `Calibri` appears only on account/network plumbing text (`:182`, `:201`).
`LangManager.initTextField` turns `embedFonts` **off** only for Chinese/Japanese (`:127-137`) —
i.e. Edo SZ is embedded and authoritative for EN.

## P11. `ui-hud/tier3-video-repass-obsolete` — HELD (A2) — OVERTURNS §5 TIER 3

Ledger §5 Tier 3 line: *"Archer moveset at full fps; VS/FIGHT exact ms; damage-popup animation;
dialogue-box metrics; overworld HUD pixel geometry."* Three of those five are ui-hud items and none
of them needs a video re-pass any more:

- **VS/FIGHT exact ms** → `DuelIntroBar.as:22` frame script (Pass 1 claim 13).
- **damage-popup animation** → `TextProjectile.as:20-46` (`ttl = 12`, `velY = -5`,
  `scaleX += 0.1` from ttl<10, `alpha -= 0.25` from ttl<4) + spawn at
  `MCSPlayer.as:3805 createFloatingText(mcs.x, mcs.y - 100, …)`.
- **dialogue-box metrics** → P3 above.

Only "overworld HUD pixel geometry" still wants an extraction (assets.swf symbols), and that is a
JPEXS run, not a video re-pass.

## P12. `ui-hud/690-friend-bar-never-filmed` — PARTIAL (A1)

The tall 800×690 layout Pass 1 found in code (claim 2) is **not exercised anywhere in the reference
footage.** Content-box measurement over both longplays (threshold >25 on per-column max):

| frame | content x | width | aspect |
|---|---|---:|---:|
| `duel_dense/Nr4fQstqHDM_427.0.png` … `_427.2`, `_431.5` | 52→1867 | 1816 | 1.682 |
| `duel_frames/Nr4fQstqHDM_t425.0s.png` | 52→1867 | 1816 | 1.682 |
| `zFt_combat/zFtCaTO0_1M_t0320s.png` | 55→1861 | 1807 | 1.673 |
| `zFt_combat/zFtCaTO0_1M_t0325s.png` | 54→1861 | 1808 | 1.674 |

All ≈5:3 ⇒ every captured session ran the 480 layout. So the 690/friend-bar layout is
**code-held but frame-unverified**: nobody has ever seen it. Do not author it from the code alone
without labelling it INFERRED-from-source.

## P13. `ui-hud/hud-symbol-metrics` — STILL_UNHELD

What P3/P5 close is *code-assigned* layout. The panel/bar/plaque geometry that lives inside
`[Embed(source="/_assets/assets.swf", symbol="symbolNNNN")]` (BattleUI = symbol2952, OptionsUI =
symbol1133, DialogBox = symbol83, SkillSlotButton = symbol2915, WinUI = symbol2894,
BattleIntroBar = symbol2855, DuelIntroBar = symbol2861, ScreenTransition = symbol2758) is **not on
disk** — only `scripts/` was exported. Also still unheld: the **icon manifest** (the 139
`<icon>` ids in `90_InteractUI_UIData.bin` map to art nobody has extracted), and **the identity of
the gold up-arrow skill** in slot 3 of `Nr4fQstqHDM_428.0.png` — it is an equipped-skill image
(`ResourceManager.getSkillImage`), not the stance control, but which skill is unproven. Refusing to
name it.

## R. Replication of Pass 1 (no new cites, recorded for confidence)

Re-derived independently and identical: 800/480/690 fit constants
(`GameEngine.as:269-271`; web `§1t1540s0§.as:270-273`), the exact-fit escape
`stageWidth == 800 && (stageHeight == 480 || stageHeight == 690)` (`§1t1540s0§.as:388`), SWF header
rects 800×690 (web) / 800×480 (android) **both at 24.0 fps**, pillarbox 52 px / 1816 px in video B
and ~55 px / 1807 px in video A, `hpbar/chibar/reloadbar .bar.scaleX = a/b` with **no tween**
(`BattleUI.as:249,256,261`, web `§1t113s0§.as:316,323,333`), `showCombo` setting only
`visible`+text vs `showHurtRed` doing `gotoAndPlay(1)` (`BattleUI.as:388-390` vs `:426-427`), the
six floating-text colour channels, `getSkillSlotCount() = 3 + getStat(1008)`
(`StatsManager.as:2293-2296`), and the stance-coloured portrait ring
(`BattleUI.as:372-374 battlemodebust.stancecolor1.gotoAndStop(num)`).

## Re-score (Pass 2)

**ui-hud: 85 → 88.** Pass 1's 57→85 stands; +3 for blocker ⑤ going from "half closed" to
"closed except symbol geometry" (dialogue metrics and pause/options behaviour are in code), for the
transition durations Pass 1 left unheld, and for the InteractUI menu contract. Held below 90 by
P13: no exported symbol geometry, no icon manifest, HUD chrome art still inside the encrypted
`124_Mobile_ImageResource`, and `(EQ:n)` still ungrounded (Pass 1 claim 20).

**Cross-lane action item from P1:** every gauntlet lane that quoted a `Mobile_Lang_EN` string id
**above 211** must re-derive it against `strings.json` resnames. The frame proved resname is the
live key.
