# t1-overturns-03 — BLIND CRITIC (hunter lens) — s26a

Packet: `docs/gauntlet/L0/worklist/t1-overturns-03.json` — 19 findings, all claiming a
REBUILD_READINESS.md overturn. **All 19 judged. None skipped.**

Every verdict below rests on an artifact I opened myself. Where I re-measured a frame or
re-parsed a byte stream, the numbers pasted are mine, not the finding's.

Headline: **16 of 19 survive; 2 are refuted; 3 more survive as claims but their claimed
overturn does NOT hold.** The two refutations are both in ui-hud, and they are the two
findings that reasoned from a number instead of opening the file.

---

## The two refutations

### ✗ `ui-hud/payload-swf-stage-is-800x690` — the header is right, the conclusion is dead

I reproduced the finding's header parse byte-for-byte (zlib-inflating past the CWS
8-byte prefix first):

```
sig b'CWS' ver 17  declared len 11892061  bytes on disk 6880328
rect twips [0, 16000, 0, 13800] -> px [0.0, 800.0, 0.0, 690.0]
frameRate 24.0   frameCount 6
```

So `800 × 690 @ 24 fps` is exactly right. The **inference** is wrong. The web build's own
resize handler is on disk and names all three numbers:

`reference/decompiled/shs3_payload/scripts/§1t1540s0§.as:271-273`
```
var _loc2_:int = 800;
var _loc3_:int = 480;
var _loc4_:int = 690;
```
…identical to `shs3_android/scripts/GameEngine.as:269-271`
(`originalWidth 800 / originalHeight 480 / originalHeightWithBar 690`). The 690 is the
**friend-bar** stage variant, chosen only when the viewport aspect ≤ 800/690 = 1.159; the
**game canvas is 800 × 480**. Independent corroboration: the full-screen hurt vignette art
in `reference/extracted/sprites/DefineSprite_3607_shs3_fla.hurtred_32/*.png` is **800×480**
on all seven frames.

So `REBUILD_READINESS.md:117` and `:171` ("native canvas is 800×480 (5:3)") are **CORRECT
and now WEB-sourced**, and the finding's load-bearing sentence — "the flat 800×480
assertion is unsupported by the artifact" — is false. Its own `STILL_UNHELD` ("which stage
the game VIEW uses") is now HELD, in its favour but against its conclusion.
`overturn_upheld = false`.

### ✗ `ui-hud/longplay-frames-are-pillarboxed` — right fact, wrong ruler

The pillarbox itself is real and I reproduced it exactly: on
`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (1920×1080) a max-over-RGB scan at
threshold 18 gives **non-black cols 52..1867** (content 1816 px), **non-black rows
0..1079** — the same numbers the finding quotes.

Its *ruler* does not survive. I measured the three skill-slot boxes two independent ways:

* dark-interior runs at y=975 → centres **1504.0 / 1640.5 / 1776.5**
* sub-pixel gradient-centroid on the box outer edges over rows 995..1060 →
  **1503.46 / 1640.35 / 1776.53**, widths 113.3 / 113.1 / 113.5
* normalised cross-correlation of slot-2's border art against slot-3's, top-border rows
  958..988 → best shift **136.00 px** (0.876), i.e. the pitch, not 135.

Finding 10 claims centres **1777.5 / 1642.5 / 1507.5**, pitch **135.0**, hence s = 2.25,
x0 = 57, and "must be re-derived as (x−57)/1811". Measured: pitch **136.0–136.9**, mean
136.5, and content width 1816 → **s = 2.270, x0 = 52**. Its own s=2.264 and its own
pitch 135.0 are mutually inconsistent (2.264 × 60 = 135.8). `overturn_upheld = false`; the
surviving half of this finding is fully carried by finding 9.

---

## ✓ `ui-hud/filmed-session-scale-is-2.27-not-2.25-THE-FRAME-WINS` — confirmed, and now
## explained by the code

My measurements land on finding 9's model, not finding 10's. Better than that, the model
closes on the source. `§1t1540s0§.as:295-307` is the web resize handler:

```
if(_loc5_ >= _loc7_) { scale = stageWidth/800; offsetX = 0;  offsetY = (stageHeight-h*scale)/2 }
else                 { scale = stageHeight/h;  offsetX = (stageWidth-800*scale)/2; offsetY = 0 }
```

Pillarbars ⇒ the second branch. Put the frame's numbers in: scale 2.270 ⇒ stageHeight
= 480 × 2.270 = **1089.6**, and offsetX = (1920 − 800 × 2.270)/2 = (1920 − 1816)/2 = **52.0**
— which is the measured left bar to the pixel. The browser window was ~1920 × 1090, *not*
1920 × 1080, which is precisely why the naive code-only s = 1080/480 = 2.25 is wrong.

**STANDING INVARIANT, SAID OUT LOUD: the code-only derivation and the frame disagreed, and
THE FRAME WON.** The conversion for this video is `x_game = (x_frame − 52) / 2.27`.

One correction to finding 9's wording: the branch it lands in is the code's **fit-HEIGHT**
branch (`fitWidth = false`, offsetX ≠ 0). Its label "(FIT-WIDTH)" is backwards. The numbers
are right; only the name is wrong.

---

## The three inflated overturns (finding true, ledger sentence survives)

### ~ `world-exploration/farm-timers-and-patch-ladder`
Every number verified verbatim: `InteractUI_crops.as:116/:131/:146/:161` = 15·60, 60·60,
6·60·60, 12·60·60; `:105-107` caps harvestedTimes at 50; `:457-479` is the six-rank ladder
at 10/20/30/40/50; `:549-558` repeats the four periods on the planting path. Two small
errors: `gracePeriod` is **900 s** (`:55`, unstated by the finding), and case 4 (the 12 h
crop) has **no** grace/ROTTED branch at all (`:160-169`) — so "each followed by a
gracePeriod window" is wrong for one of the four.

But the ledger sentence it targets is `② gather/mine/farm **yield + whiff + respawn**
tables`, and growth timers are none of those three. The finding concedes as much ("Yield
rows per crop remain to be read out"). `overturn_upheld = false` — *on its own evidence*.
Hunting for what it missed, I found the yield and whiff rows sitting in the same file, 150
lines further down (see new findings).

### ~ `world/war-map-is-already-on-film`
The frame reads exactly as claimed — I cropped (20,30)-(720,420) @2× LANCZOS on
`reference/frames/Nr4fQstqHDM/seg-20/frames/frame_0014.jpg` and got "SELECT TERRITORY",
"ZOOM IN", "HELP", "CLAN CROPS: 402 (+2 HQ)", the brown flat-vector Honshu/Shikoku/Kyushu
coastline with island blobs, a ruled square grid, one red clan flag mid-Honshu, and the
"WAR ROOM" rail. Verbatim.

But a 1024×576 *picture* of the map delivers neither world bounds nor geography. It
satisfies the precondition of the close-path ("trace the map image"); it does not falsify
the blocker. Blocker ① dies to finding 17's bitmap, not to this frame. `overturn_upheld
= false`.

### ~ `skills-meters/web-stance-damage-ladder…` — overturn holds, but the ledger was
### mostly RIGHT and the label is off by one
The function is verbatim (`§1t99s0§.as:3255-3277`, `:3284-3290`), and the android contrast
is real (`MCSPlayer.as:3198-3238`: 0.5→1.0 / 1.0→1.5 / 1.5 flat, crit ×1.5 light ×1.2
other, mastery on a 0-100 scale — do **not** seed config from it). The identities check out
structurally one-for-one: `§1t4475s0§`=getDamage, `§1t4477s0§`=getDefense,
`§1t4414s0§/§1t4415s0§`=reload/maxreload, `§1t1243s0§`=STAT_CRITICALDMG,
`§1t4421s0§/§1t4422s0§`=light/balancedMastery, `§1t12222s0§`=HEAVY_STANCE.

What the ledger got *right* and this finding does not overturn: 0.9/1.2/1.4 really are
ceiling values, level 1 really is 0.5/1.0/1.4, and Heavy's reach really does scale
0.5→0.9 (`§1t99s0§.as:3116`, floored at 100 by `:3117-3120`). What falls is the **fork** at
`RR:157` ("either model the mastery curve or decide-and-flag") — there is nothing to
decide, the curve is a transcription. I mark `overturn_upheld = true` on that basis only,
and I flag a second-order correction the finding half-made: the ceiling is **mastery 10,
not 9** (skilldata declares `<level>` 1..10 for skills 1000/1001/1002, and
`strings.json["8131"/"8132"/"8133"]` = "Light/Balanced/Heavy Stance Mastery Level 10.").

---

## The mis-cites inside surviving findings

Both stance findings survive on their load-bearing lines but each names one wrong file.

* `ui-hud/web-battleui-is-1t113s0-…` calls `§1t113s0§.as:293 §1t5198s0§` "= android
  BattleUI.setStanceColor". It is not. Android `setStanceColor(num)` is
  `this.battlemodebust.stancecolor1.gotoAndStop(num)` (`BattleUI.as:372-375`), whose web
  twin is `§1t5208s0§` at **:482** (`this.§1t5158s0§.§1t15895s0§.gotoAndStop(param1)`),
  called from `§1t99s0§.as:3101/:3112/:3127` exactly where android calls
  `setStanceColor(1/2/3)`. Line :293 loops eight skill slots. Its `:326 = updateReload`
  mapping is functionally right but not literal — android takes a `Number percentage`,
  the web takes `(int,int)` and computes `(param1-48)/(param2-48)`.
* `ui-hud/web-battleui-stance-button-plays-an-error-sound…` cites `§1t406s0§.as:944` as
  "the button binding". `§1t406s0§` is the **OverworldHUD** — :944-946 is the twin of
  `OverworldHUD.as:838-840` (`bustUI.battlemodebust` → nextStance/show/hideChangeStanceLabel).
  The in-battle binding is `§1t113s0§.as:379-381`, the twin of android
  `BattleUI.gotClicked` `:275-284`. Both findings' `:468-479` and `:3048-3051` cites are
  exact, so this is minor, not fatal.

## The nameplate rule is real but stated wrong

`ui-hud/v0717-duel-nameplate-has-no-level` is right on the frame — I cropped
(520,580)-(840,650) @4× LANCZOS on
`reference/frames/session11/stance-reach/B_t785.200_LIGHT_stroke553px_endtoend.png` and
read **"FUKUSHIMA CHIKO"** in white over a green bar, no parentheses, no digits. All four
android call sites it quotes are verbatim.

Its **rule** is wrong. The web build does not gate on plate colour; it gates on level:

`reference/decompiled/shs3_payload/scripts/§1t122s0§.as:92-99`
```
if(param1 > 0 && !this.§1t4895s0§()) { mcs.…(this.charname + " (" + param1 + ")",_loc6_); }
else                                 { mcs.…(this.charname,_loc6_); }
```
…and the same if/else at `:802-809`, `:915-921`, `:1418-1422`. Android v0.682 has **no**
else branch at the corresponding `EnemyPlayer.as:84/:776/:881`. And the *red* overworld
aggro plate carries the identical `lvl == 0` split in **both** builds
(`§1t8638s0§.as:79-86` / `Obj_NPCAggro.as:74-81`). So the real rule is **"append (N) iff
level > 0"**, in web only — not "red carries it, white doesn't". The ledger's blanket
`nameplate (N)=level` still falls, so the overturn stands.

## Everything else, checked and standing

* **Repair = nodeLevel × 10.** `InteractUI.as:647` verbatim; `strings.json["848"]` =
  `"Repair your currently equipped weapon?\nCost: [0] coins"`. Forge = nodeLevel × 100
  (`:634/:638/:642` + strings 845/846/847). Frame `Nr4fQstqHDM/seg-10/frames/frame_0040.jpg`,
  crop (0,370)-(1024,576) @1.6× LANCZOS, reads **"FORGE AN IRON SWORD (LEVEL 7)? / COST:
  700 COINS / MATERIALS NEEDED: 2 IRON ORE"** — string 845 rendered with [0]=7, [1]=700,
  from the *web* build. One correction: Reinforce is flat 5000 across **three** tiers, and
  at weapon level ≥ 60 it wants **1 Uncut Diamond** (`strings.json["852"]`), not Titanium.
* **expArray on camera.** `§1t1523s0§.as:364` is a **99-entry** array (idx 10 = 31 400,
  idx 11 = 37 400, idx 80 = 4 285 800). I pulled the frames myself with ffmpeg:
  `zFtCaTO0_1M.mp4 -ss 653.0` → badge **3**, "2098 / 2950"; `-ss 1600` → badge **4**,
  "5110 / 5150". Both match. A third, unclaimed: `seg-20/frames/frame_0015.jpg` → badge
  **10**, "25988 / 31400". RR:350 does not survive.
* **AP is +5 per point in web.** `§1t5957s0§.as:3413-3414` spends a point
  (`§1t9419s0§`=18=STAT_STATPOINTS) and calls `§1t9609s0§(5)`; `§1t1523s0§.as:2807-2814` is
  `changeStat(§1t9415s0§, param1)` with `:232 §1t9415s0§:int = 14` = android
  `STAT_MAXAP:int = 14`, and the whole body matches android `addMaxAP` (`StatsManager.as:2361-2369`).
  Both duplicate findings hold.
* **Unlock cadence breaks in both named families.** Re-parsed skilldata myself: Ninja
  (cat 6) = 10/15/20/30/40/50/60/70/80 — **Lay Trap 15**; Chi (cat 4) = 0/5/15/25/35/45/**50**/55/65/75
  — **Chi Charge 50**. v0.682 data, flagged.
* **Dan 10 is real.** `§1t1523s0§.as:2644-2652`: DAN==8 pays HGOLD **+100** and announces
  `getString(864,[name,"10"])`, else +25; `:2653-2656` increments only while DAN < 9.
  Android pays 20/5. `strings.json["864"]` = "[0] has rebirthed and is now Dan [1]!" and —
  unclaimed — `strings.json["8124"]` = **"Reach Dan 10."**
* **Blocker ② (HUD feel) falls.** My own tag walk of `shs3_payload_decoded.swf`:
  DefineSprite **3611** = 1 declared frame, `PlaceObject2 depth1/char74`, `depth2/3608`,
  `depth3/3609`, `depth4/3610`, ShowFrame, End — no ColorTransform flag on any placement.
  DefineSprite **3607** = 7 declared frames, one PlaceObject2 (char 3606), **six**
  ShowFrames, RemoveObject2, ShowFrame, End. The finding's quote says five ShowFrames; it
  is six, and its stated conclusion (6-frame hold = 0.25 s @ 24 fps) is the correct one.
  Extracted art confirms: 7 PNGs at 800×480, and DefineSprite_3611 has exactly one PNG
  (117×92). Bars: `§1t113s0§.as:316/:323/:333` are bare `bar.scaleX =` writes and the file
  contains **zero** matches for Tween/ENTER_FRAME.
* **In-combat stance switch is live.** `§1t113s0§.as:468-479` verbatim; the gate is
  `§1t99s0§.as:3048-3051` `return this.§1t4469s0§() && this.§1t4414s0§ >= 48;` (an
  actionState guard the findings omit, plus reload ≥ 48); the 48 is deducted only inside
  `if(isBattle())` at `:3160-3166`; version stamp `§1t1523s0§.as:36 = 0.717`. Android's
  `BattleUI.stanceButtonClick` (`:360-370`) has the same gate and **no sounds** — the two
  SFX are a v0.717 addition. RR:158 must be struck.
* **Ore respawn is per node visit.** `Obj_OreDeposit.as:83` (the finding says :82, inside
  its own cited range) → `StageManager.addToDeadList` `:621-627` → `GameStage.createRoomObjects`
  `:602-632` skips names in the list; cleared at `:249` (initRooms) and `:366` (node
  change) only — `:451`, the within-node room change, does **not** clear it. Confirmed.
* **The world map is held, byte-exact.** I ran the md5 myself:
  `13068dfa1a5cc5628720a25782f93fed` on **both** `reference/extracted/bindata/92_1t4648s0.bin`
  (web, 272 bytes) and `reference/extracted/android/110_Mobile_MapBitmapData.bin`. Pillow
  decodes it as GIF 63×72 mode P with **735** non-black pixels, and rendered at 10× nearest
  it is unmistakably Japan — Hokkaido top-right, the Honshu arc, Shikoku/Kyushu bottom-left.
  `§1t4648s0§.as:4` embeds `/_assets/92_1t4648s0.bin` in the **web** build;
  `§1t1524s0§.as:716-739` enumerates every non-zero pixel into `x+341 << 12 | y+341`;
  `QuestEngine.as:1204-1207` is the bounds test; `WarSelectUI.as:15/17/19` give
  WARMARKERSHIFTX 8 / TERRSHIFTX 21 / TERRSHIFTY 51. Span x ∈ [−13,49], y ∈ [−51,20]
  checks out. This is the strongest finding in the packet and RR:225 blocker ① dies to it.

## Build-parity notes (C2 discipline)

Findings 0, 3, 15, 16 rest on `shs3_android` v0.682 code or on the four v0.682 data XMLs.
Each labels its build honestly. Finding 0 is additionally validated by a **web** frame
rendering the sibling template with the same `level` variable, which is real parity
evidence for that string family and nothing wider. Finding 3's ladder is v0.682 skilldata;
the web build fetches skilldata from the CDN and embeds no copy, so it cannot be
cross-checked today — flagged, not refuted. Findings 15 and 16 remain v0.682-only.
