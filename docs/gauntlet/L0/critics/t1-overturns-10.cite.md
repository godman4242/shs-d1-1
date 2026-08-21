# t1-overturns-10 — CITE LENS review (blind critic)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-10.json` — 16 claims, all `overturns_ledger: true`.
Judged: 16/16. Skipped: 0.

Method: for every claim I opened the cited artifact myself. For A1 claims I cropped and
upscaled the frame and LOOKED. For sprite claims I rasterised the PNG and measured pixels.
For SWF-header claims I parsed the header bytes myself. No verdict below rests on another
agent's prose (§3.2 respected — `critics/*.md` and `sources/*.md` were never opened).

**Headline: 16 SURVIVE, 0 REFUTED.** This is an unusually clean packet — the four
`QUOTE_UNVERIFIED` citelint flags were all FALSE ALARMS (quotes that span two source lines,
or that fold a verbatim AS3 line together with measured pixel numbers). Three claims carry
defects worth recording, and four name a ledger sentence that does not actually fall.

---

## 1. `ui-hud/hurtred-vignette-catalogued` — HELD (citelint QUOTE_UNVERIFIED = false alarm)

Own cite: `reference/extracted/sprites/DefineSprite_3607_shs3_fla.hurtred_32/1-7.png` rasterised
with PIL + `reference/decompiled/shs3_payload/scripts/shs3_fla/hurtred_32.as:9-18`.

Every number reproduces exactly:

```
1 (800, 480) corner [153,0,0,251] centre [0,0,0,0] meanA 135.88 maxA 254
...  (frames 1-6 byte-identical)
7 (800, 480) corner [0,0,0,0]     centre [0,0,0,0] meanA 0.00   maxA 0
```

- `BattleUI.as:426-427` reads verbatim `this.hurtred.visible = true;` / `this.hurtred.gotoAndPlay(1);`
- `shs3_android_fla/hurtred_29.as:12` = `addFrameScript(6,this.frame7);`, `:15-18` = `internal function frame7() : * { stop(); }` — verbatim.
- "radial" is real, not a guess: row 240 alpha ramps `215 174 131 87 43 0 43 87 131 174` about x=400; col 400 ramps `131 104 78 52 26 0 26 52 78 104` about y=240.
- 7 frames at 24 fps = 291.7 ms ≈ the claimed 292 ms. I parsed the SWF header myself: 24.0 fps.

**BUILD-PARITY HOLE CLOSED, not opened.** The claim leans on an ANDROID `BattleUI.as`. The WEB
twin is byte-for-byte the same shape at the same line numbers — `shs3_payload/scripts/shs3_fla/hurtred_32.as:12`
`addFrameScript(6,this.frame7);`, embedding `symbol3607`, which is exactly the sprite id in the
measured directory name. No caveat needed.

Overturn: `REBUILD_READINESS.md:235` ② names "vignette ramp — uncatalogued" verbatim. That named
item is now catalogued to the pixel. **Overturn upheld.**

## 2. `ui-hud/in-combat-hud-is-three-bars` — HELD (core), one supporting sentence is WRONG

Own cite: `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png`, crop (150,955)-(700,1080) upscaled 3x,
and `reference/frames/combat_frames/Nr4fQstqHDM_t0130s.png` (full frame).

I LOOKED. Visibly in the combat crop: straw-hat portrait medallion ringed in RED; green bar
"20/20"; below it blue bar "26/26"; below that a tan/gold bar carrying "CANNOT CHANGE STANCE";
below the cluster yellow "150% DAMAGE". Exactly as described.

The contrast frame is decisive and I checked it myself: the overworld frame shows the SAME
portrait (brown ring), the SAME "20/20" and "26/26" bars — and then the text "BALANCED STANCE"
with **no third bar behind it**, plus XP bar, minimap, action ribbon. So the two-bar reading
really does come from overworld frames.

Code corroboration, all verbatim in files I opened:
- `BattleUI.as:60` `public var reloadbar:MovieClip;`
- `BattleUI.as:261` `this.reloadbar.bar.scaleX = percentage;` — it is a meter, proven in code.
- `MCSPlayer.as:2977` `if(this.reload < this.maxreload / 6)` — and it sits inside `nextStance()`
  (`:2975`), so the sixth-of-max gate really is the stance-change gate.
- `strings.json["4132"]` = `'Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a time.'` — exact.
  The "150% DAMAGE" trap warning is well founded; the crit text is a different field
  (`BattleUI.as:102` `crittext.text = LangManager.getString(175)`, and `strings.json["175"]` = `'Critical Hit'`).

**DEFECT (minor, recorded).** The sentence *"Across frames 427.0 / 429.0 / 431.0 the tan bar's
fill length changes, so it is a meter, not a plate"* does **not** reproduce. I measured the gold
column profile (median R−B over interior rows 1029..1047) on all three and they are
indistinguishable, and the bar's right edge sits at screen x≈511-513 in every one — the same
right edge as the full blue bar. Those three frames are static.

The conclusion is nevertheless right, from evidence the claim did not use: at **432.5** the
"CANNOT CHANGE STANCE" text vanishes and the bar becomes a dark brown TRACK with a small cream
FILL at the left, which then grows across 432.6 → 432.7 → 432.8 → 433.0. I cropped and looked.
So the wrong sentence is a mis-measured supporting observation attached to a correct conclusion.
Not refuted — but the ledger must not inherit that sentence.

Overturn: the claim names `:235` ② ("bar tween vs snap, combo pop, vignette ramp"). **Overturn NOT
upheld** — this finding is about HUD *composition*, not *feel*; it does not touch any of ②'s three
named items. Its real ledger target is line 125 / line 234's *Ready* list ("combat-HUD geometry"),
which is incomplete by one meter. Recorded as a new finding below.

## 3. `ui-hud/interactui-panel-geometry` — HELD

Own cite: `reference/extracted/payload.xml:626573-626600`. Every placement matrix reproduces
verbatim: `elementCircle` depth 37 translate (0,0); `titleText` (206,1400); `button1` (200,2180);
`button2` (200,2960); `button3` (200,3740); `button4` (200,4520); `button5` (200,5300). The
twips/20 arithmetic in `lane_impact` is correct in every cell (10.3/70; 10 at 109/148/187/226/265;
780 twips = 39 px pitch).

The identity claim ("the symbol §1t401s0§/InteractUI embeds") is CONFIRMED three ways:
- the export directory is literally named `reference/extracted/sprites/DefineSprite_1691_1t401s0`;
- `shs3_payload/scripts/§1t401s0§.as:9` = `[Embed(source="/_assets/assets.swf", symbol="symbol1691")]`;
- the android twin `InteractUI.as` carries the same children — `:63 elementCircle`, `:69 titleText`, `:87 button5`.

And the rebirth link is real: `InteractUI.as` declares `UIMODE_REBIRTH:int = 6`.

Stronger than the claim knew: the runtime layout AGREES with the authored matrices.
`InteractUI.as:93` `nodeuiX = NodeUI.instance.x + 10` (authored x = 10 px), `:97`
`nodeuiSpacingY = NodeUI.instance.actionButtonHeight` with `button2..button6` at
`nodeuiY + n*nodeuiSpacingY` (authored pitch = 39 px). The payload matrices are not stale
authoring residue.

Overturn: `:205` ⑤ "rebirth/element-picker UI (never filmed — both longplays pre-rebirth)" is
verbatim. "Never filmed" stays true, but the blocker's premise — that being unfilmed blocks the
rebuild — falls. **Overturn upheld.**

## 4. `ui-hud/jpexs-export-already-on-disk` — HELD

Own cite: `ls reference/extracted/shapes/*.svg | wc -l` = **1822**; `ls reference/extracted/sprites/ | wc -l` = **827**.
Measured opaque bounding boxes myself: `autoslashbutton_43` = 129x31 (fills canvas),
`skillSlotBG_755` = 56x55, `PauseScreen_51` = 802x481. All three exact.
`reference/extracted/shapes/1003.svg` first 200 bytes contain, verbatim,
`ffdec:objectType="shape" height="30.55px" wid`. All seven extra named sprites exist:
`stancecolor1_56`, `chatTextBattle_45`, `MinimapIcon_668`, `MinimapRoomIcon_672`,
`skillnodeinner_89`, `speechbubble_422`, `QuestLogButtonBG_548`.

Overturn: `:235` ⑤ "pause/options/dialogue-box exact metrics" verbatim. I opened
`PauseScreen_51/1.png` and LOOKED: a genuine 802x481 full-field black overlay with the
Duels logo and "GAME PAUSED". Those metrics are measurable now. **Overturn upheld.**

## 5. `ui-hud/pausescreen-sprite-confirms-play-field` — HELD

Own cite: I parsed both SWF headers first-hand (CWS → zlib → RECT/fps/frameCount):

```
reference/decrypted/shs3_payload_decoded.swf          CWS v17  rect twips [0,16000,0,13800] => 800.0 x 690.0  fps 24.0  frames 6
reference/decrypted/shs3_android_payload_decoded.swf  CWS v26  rect twips [0,16000,0,9600]  => 800.0 x 480.0  fps 24.0  frames 6
```

Exact, to the decimal, including the odd 690. `PauseScreen_51` rasterises to 802x481 with the
opaque bbox filling the canvas, and it is a `shs3_fla` (web) symbol.

Independent third confirmation I ran myself, which the claim did not have: the duel_dense
frames are PILLARBOXED. Non-black columns run x=52..1867 of 1920, i.e. a ~1800 px game area
in a 1080 px-tall frame → scale 2.25 → **800 x 480**. That is the play field, measured off the
video rather than off any build.

Overturn: `:235` ① "aspect-ratio truth (5:3 native → are x-fractions pillarbox-wrong?) — inspect
`unt.png` for side-bars; read `stage.stageWidth` in a build" is verbatim. Answer: yes, native is
5:3 800x480, the video IS pillarboxed, and x-fractions taken off the full 1920 width ARE wrong.
The "read stage.stageWidth in a build" instruction is moot. **Overturn upheld.**

## 6. `ui-hud/shade-wipe-is-vertical` — HELD (one off-by-one mis-cite)

Own cite: `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` vs `_428.9.png`, crop
(1710,955)-(1845,1080) upscaled 4x side by side — exactly the stated crop. I LOOKED.

At 428.0 the slot border is GREY and the left ~half of the face sits behind a hard VERTICAL
boundary, darker; at 428.9 the border is BRIGHT CREAM and the face is uniformly lit. Confirmed
as described.

The snap is confirmed too. I rendered 427.0 / 427.5 / 428.0 / 428.3 / 428.5 / 428.6 / 428.7 /
428.8 / 428.9 / 429.0 as a strip: the slot is grey-bordered and split through **428.6**, then at
**428.7** the border is cream and the face uniform, and it stays. One sample step, no
intermediate state — a discrete jump at exactly the frame the claim names.

The empty-slot corroboration is also visible: in the wider crop the LEFTMOST slot has an
undimmed bright-cream border, no icon and no keypress digit, while slots "2" and "3" are both
shaded. `SkillSlotButton.as` `initEmpty()` does set `this.shade.visible = false`.

**DEFECT (minor, recorded).** That statement is cited as `SkillSlotButton.as:130-135`. The line
is actually **129**; 130-135 is the `if(this.image != null){...}` block and the closing brace.
The function `initEmpty()` spans 123-135, so the cite lands in the right function but excludes
the very line it quotes. Off by one — not fatal, but a real mis-cite.

Also verified: no `shade` sprite exists anywhere in `reference/extracted/sprites/` (grep -ci = 0),
so the claim's premise that the wipe geometry exists only in the frames holds.

Overturn: `:235` ② "bar tween vs snap ... uncatalogued". The finding answers the tween-vs-snap
question with pixels for the cooldown widget. **Overturn upheld (partial — combo pop and vignette
ramp are untouched by this claim; the vignette third is closed by claim 1 instead).**

## 7. `ui-hud/stance-ring-colours-exact` — HELD, and much more strongly than claimed

Own cite: `reference/extracted/sprites/DefineSprite_3394_shs3_fla.stancecolor1_56/{1,2,3}.png` measured.
63x63, three frames, 2862 opaque px each. Peak/most-saturated opaque RGB per frame:

```
frame 1  (66,66,255)  = #4242FF
frame 2  (153,102,0)  = #996600
frame 3  (153,0,0)    = #990000
```

Exactly the three hexes. `BattleUI.as:374` reads `this.battlemodebust.stancecolor1.gotoAndStop(num);` verbatim.

The light/balanced/heavy MAPPING — the part most likely to be a guess — is independently
nailed down by four artifacts I opened:
- `OverworldHUD.as:569` `stancecolor1.gotoAndStop(StatsManager.stance + 1)` — frame = stance+1;
- `MCSPlayer.as:27,29,31` `LIGHT_STANCE=0`, `BALANCED_STANCE=1`, `HEAVY_STANCE=2`;
- `strings.json["IDS_Q50S3NODE1"]` = *"Your stance is indicated by the color of the circle around
  your portrait: Light stance - blue, Balanced stance - brown, Heavy stance - red."*;
- `reference/frames/combat_frames/Nr4fQstqHDM_t0130s.png` — I looked: a BROWN ring with the label
  "BALANCED STANCE" under it. The frame agrees with the asset and with the string.

The `#990000` reuse is real — the hurt vignette's edge measures `[153,0,0,251]`. One red, two uses.

Two small imprecisions, neither load-bearing:
- "Dominant opaque RGB" is loose. Those three are the *brightest / most saturated* pixels, not the
  modal ones (the modes are the dark inner-shadow tones (0,0,51) / (37,25,0) / (25,0,0)).
- The asset is a filled DISC, not an annulus — I printed its alpha map. It reads as a ring in game
  because the bust covers the centre, which is how the ledger's own surface note describes it.

Overturn: the named sentence is `:236` "Surface: ... portrait ring is stance-colored, not fixed red",
verbatim. **Overturn NOT upheld** — that sentence is CORRECT and this finding refines it rather
than falsifying it. The claim says as much in its own `lane_impact`. It is a ledger *upgrade*, not
an overturn.

## 8. `ui-hud/up-arrow-is-a-skill-not-a-stance-control` — HELD; blocker ④ genuinely dies

Own cite: `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`, crop (1380,920)-(1880,1080) upscaled 3x.
I LOOKED. Three slots. Rightmost: keypress digit "**3**" above it, gold up-arrow icon. Middle:
keypress digit "**2**", a claw/beast icon. Leftmost: bright-cream border, **black face, no icon,
no digit** — an empty slot.

Code, all verbatim in the file I opened:
- `BattleUI.as:133` `skillSlotButton.x = 760 - i * 60;`
- `BattleUI.as:504` `skillSlotButton.initKeyPressText(this.slotCount - i);`
- `BattleUI.as:501-502,510` visible = `i < slotCount`; equipped else `initEmpty()`.
- stance control is elsewhere: `:112`, `:275` `hitTestPoint`, `:374`.

Arithmetic checks out against the pixels. I located the three slot interiors at screen x
1454 / 1589 / 1724 — a pitch of **135 screen px = 60 game px** at the measured 2.25x pillarboxed
scale, exactly `760 - i*60`. The up-arrow box centre lands at game x ≈ 761.6 against the claim's
759.7 — inside my pillarbox-offset error bar. With `slotCount=3`, `slotCount - i` gives i=0→"3",
i=1→"2", i=2→"1"; the frame shows 3, 2, and a blank. That is the claim's prediction, confirmed.

Overturn: `:235` ④ "the '3 skill slots' is really ~2 abilities + a stance up-arrow" is verbatim.
It is **wrong on both halves**: the up-arrow is an ordinary equipped skill (it carries keypress
"3" and takes the same cooldown shade as slot "2"), and the third box is an EMPTY slot, not a
stance control. **Overturn upheld — blocker ④ should be struck.**

## 9. `ui-hud/up-arrow-is-a-skill-not-the-stance-control` — HELD (source-side twin of 8)

Own cite: `SkillSlotButton.as:87` = `this.image = ResourceManager.getSkillImage(this._skillId);` — verbatim.
`BattleUI.as:26` = `public var battlemodebust:MovieClip;` — verbatim. `:113` `buttonMode = true`,
`:192` MOUSE_OVER `showChangeStanceLabel`, `:275` `hitTestPoint` → `stanceButtonClick()`,
`:374` `stancecolor1.gotoAndStop(num)` — all verbatim. `BattleUI.as:130-137` does construct 8
buttons in a loop. Every cite in this claim resolves and says what it is said to say.

Overturn: same sentence as 8. **Overturn upheld.**

## 10. `warroom/web-warhex-has-fifteen-states` — HELD on evidence; ledger sentence is FABRICATED

Own cite: `reference/decompiled/shs3_payload/scripts/§1t416s0§.as:11-39` and
`reference/decompiled/shs3_android_payload/scripts/WarHex.as:11-37`, both read in full.

- Web `:31` = `public static var §1t12529s0§:int = 10;` — verbatim.
- Android `:29` `HEX_VILLAGE:int = 9;` → `:31` `HEX_CITY:int = 11;` — verbatim; **value 10 is absent**.
- Counts exact: web 15 constants at 11,13,15,17,19,21,23,25,27,29,31,33,35,37,39 (values 0-13,15);
  android 14 at 11..37 (values 0-9,11,12,13,15).
- Identity: I diffed the member lists. Both classes declare the SAME ELEVEN members —
  `bg, boundary, button, earrow, flag, hqflag, hqflag2, logo, narrow, sarrow, warrow`. Same imports.
  The identification is sound.
- `§1t7785s0§.as:261-262` = `_loc17_.x = 90 + _loc18_ * 55;` / `_loc17_.y = 92 + _loc19_ * 55;` — verbatim.

**DEFECT (minor, recorded).** `ledger_text` is `| **war-room** | board topology — BLOCKER |`.
**No such line exists in REBUILD_READINESS.md.** There is no `war-room` row in the §2 scorecard at
all — the twelve rows are ui-hud, art-anim-audio-feel, progression, economy, combat-core,
items-equipment, quests-story, world-exploration, enemies-ai, skills-meters, meta-social,
rebirth-elements. The nearest real lines are `:135` (meta-social row, "map board") and `:245`
("② War-Room **map topology** (board/adjacency)"). The claim quoted a ledger sentence that is
not in the ledger.

**Overturn NOT upheld.** Beyond the fabricated quote, the real blocker is *board/adjacency*, and a
state ENUM plus a 55 px placement pitch does not supply adjacency. I also could not confirm the
`lane_impact`'s "6x6 board" from `:261-262` — that code walks a variable-length `"|"`-split string
and never bounds the grid at 6.

The evidence itself is excellent and should be banked: **v0.717 has 15 hex states; porting from
the android enum loses state 10.**

## 11. `world-exploration/fourth-clock-dtinterval` — HELD

Own cite: `StatsManager.as:160` = `internal static var DTINTERVAL:int = 2 * 60;` — verbatim, exact line.
`QueryManagerPIO.as:1181` = `NetworkManager.instance.saveUpdate(101,StatsManager.nextDTUpdate.toString());`
— save slot 101 is `nextDTUpdate`, exactly as claimed. `StatsManager.as:709-710` =
`setPlayerStats(STAT_DUELTOKENS,20);` / `setPlayerStats(STAT_MAXDUELTOKENS,20);` — both exact.

Build-parity: I checked the WEB twin rather than assume. `§1t1523s0§.as:194`
`internal static const §1t9397s0§:int = 2 * 60;` — identical value in v0.717. No android caveat needed.

Overturn: `:225` ③ "real-world **\"day\" length** (governs expiry, farming, AP regen, war tick)"
verbatim. A 120 s duel-token clock is a consumer the blocker does not name and cannot be folded
into a day length. **Overturn upheld.**

## 12-14. The three war-tick claims — ALL HELD (12 and 14 are substantively duplicates)

`world-exploration/war-tick-is-hourly`, `.../war-tick-is-hourly-not-daily`, `.../war-tick-is-one-hour`.

Own cite, one read serving all three — `reference/decompiled/shs3_android/scripts/StatsManager.as`:

```
158:      internal static var APINTERVAL:int = 60;
160:      internal static var DTINTERVAL:int = 2 * 60;
162:      internal static var WARMOVEINTERVAL:int = 60 * 60;
...
818:         if(nextWarTurn - QueryManager.instance.getServerTime() < 0)
820:            nextWarTurn = QueryManager.instance.getServerTime() + WARMOVEINTERVAL;
```

Every quoted line, at every quoted line number, verbatim — including the blank-line spacing in
claim 13's three-constant block. `:782` really is `updateWarMoveCounter(...)`. The save-slot
inventory in claim 13 is exact: `QueryManagerPIO.as:1175/1181/1187` write slots
**100 / 101 / 102** = `nextAPUpdate` / `nextDTUpdate` / `nextWarTurn`.

Web parity confirmed by me, not assumed: `§1t1523s0§.as:192,194,196` = `60`, `2 * 60`, `60 * 60`,
and `:1549` carries a `24 * 60 * 60` quest window. Identical in v0.717.

Overturn: `:116` "**The real-world \"day\" length** governing quest expiry, farming, AP regen, and
the War-Room 24h tick" verbatim, and `:225` ③ verbatim. The war MOVE interval is 3600 s. The
ledger's one concrete number for that blocker is wrong by 24x. **Overturn upheld for all three.**

One thing the ledger already half-knew and none of the three claims mentions: `:246` records
"'moves per turn' reconciles as 'per hour'", and `:244` separately lists a "24h resolution" for the
war round. The hourly number kills "24h **tick**" at `:116`; it does not by itself decide whether a
war ROUND still resolves daily. Worth keeping distinct when the ledger is rewritten.

Claims 12 and 14 assert the same fact from the same two lines. Both are correct; the board
should merge them rather than count them twice.

## 15. `world-exploration/web-decompile-holds-full-logic` — HELD, and it is the most consequential claim in the packet

Own cite: `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36` =
`public static var §1t9323s0§:Number = 0.717;` — verbatim, and `grep -n` confirms line 36 is its only
occurrence. Against `reference/decompiled/shs3_android/scripts/StatsManager.as:30`
`public static var clientVersion:Number = 0.682;`.

I did not take the parity list on trust. Spot-checks I ran myself, all IDENTICAL across builds:
- `APINTERVAL/DTINTERVAL/WARMOVEINTERVAL`: web `§1t1523s0§.as:192,194,196` = `60`, `2*60`, `60*60`; android `:158,160,162` — same.
- quest `24*60*60`: web `§1t1523s0§.as:1549`.
- LCG: web `§1t58s0§.as:84-85` `(this.randomSeed * 9301 + 49297) % 233280` / `/ 233280`;
  android `RNG.as:68-69` — character-for-character identical.

The method the claim proposes — *before declaring an android-only caveat, grep `shs3_payload` for
the VALUE* — works, and I used it four times in this review.

Overturn: `:351` "**Server-sim topology & save format** — nothing to copy; design a single-player
persistence schema from the observed field set" verbatim. "Nothing to copy" is falsified —
`QueryManagerPIO` writes a numbered save-slot schema (100/101/102 and up) that can be read straight
off. **Overturn upheld.**

I did NOT verify the whole `lane_impact` inventory (NameGenerator arrays, TERRSHIFTX/Y, the
projection constants, the crop timers). Those remain unjudged detail riding on a claim whose
central mechanism I did confirm; they should not enter the ledger on this verdict alone.

## 16. `world-exploration/world-map-art-recovered` — HELD. I composited it and LOOKED.

Own cite: `reference/extracted/payload.xml` `DefineSpriteTag spriteId="262"`, and 36 sprite PNGs
under `reference/extracted/sprites/DefineSprite_{191..261 odd}/1.png`.

Quoted lines reproduce verbatim: `characterId="189" depth="1" ... name="shadowmap"`;
`characterId="227" depth="39" ... name="map_1_6"` with `translateX="1598" translateY="9600"`.
I re-derived the tile set with a regex over the sprite: **36 tiles**, characterIds exactly
191,193,...,261, names spanning `map_0_7` .. `map_8_1`. Every PNG is present — zero missing.

Then I composited all 36 at `translate/20` and opened the result. **Japan.** Hokkaido top-right,
Honshu through the middle, Shikoku and Kyushu at the bottom-left, Sado off the west coast and
Awaji in the inland sea — all present, all correctly shaped, with hairline seams from the 1598-vs-1600
twip offsets. The claim's LOOK verdict is honest.

**DEFECT (minor, recorded).** The cite range `payload.xml:395761-395830` is short. The
`DefineSpriteTag spriteId="262"` opens at **395759**, and the range as written contains only 21 of
the 36 tiles; the rest run to roughly 395880. The range lands inside the correct sprite, so the
cite resolves — it just under-covers what it is offered as evidence for.

Overturn: `:225` ① "**world bounds + geography** (sparse Japan-outline, not a W×H grid) — *mine
Fandom Category:Territories via API; trace the map image*" verbatim. The prescribed close-path
"trace the map image" is dead — the art is on disk and composites in one pass. **Overturn upheld**
for the close-path; note that the *sector/territory data* half of ① is untouched by this claim.

---

## Scorecard

| # | id | verdict | overturn upheld | severity |
|---|---|---|---|---|
| 1 | hurtred-vignette-catalogued | HELD | yes | — |
| 2 | in-combat-hud-is-three-bars | HELD (core) | **no** | minor |
| 3 | interactui-panel-geometry | HELD | yes | — |
| 4 | jpexs-export-already-on-disk | HELD | yes | — |
| 5 | pausescreen-sprite-confirms-play-field | HELD | yes | — |
| 6 | shade-wipe-is-vertical | HELD | yes (partial) | minor |
| 7 | stance-ring-colours-exact | HELD | **no** | minor |
| 8 | up-arrow-is-a-skill-not-a-stance-control | HELD | yes | — |
| 9 | up-arrow-is-a-skill-not-the-stance-control | HELD | yes | — |
| 10 | web-warhex-has-fifteen-states | HELD | **no** (ledger line fabricated) | minor |
| 11 | fourth-clock-dtinterval | HELD | yes | — |
| 12 | war-tick-is-hourly | HELD | yes | — |
| 13 | war-tick-is-hourly-not-daily | HELD | yes | — |
| 14 | war-tick-is-one-hour | HELD | yes | — |
| 15 | web-decompile-holds-full-logic | HELD | yes | — |
| 16 | world-map-art-recovered | HELD | yes | minor |

Note on citelint: all four `QUOTE_UNVERIFIED` flags (1, 7, 8, 9) were false alarms. The quotes
exist; the linter missed them because they concatenate two source lines, drop a `this.` prefix, or
splice a verbatim AS3 line together with measured pixel numbers. `QUOTE_SKIPPED_LARGE` on
`payload.xml` (3, 16) I resolved by hand — both quotes are verbatim.

## New findings raised while judging (nobody has claimed these)

1. **The reload bar's fill IS visible in duel_dense — at 432.5, not 427-431.** Frames 432.5
   through 433.0 show the "CANNOT CHANGE STANCE" label gone, the bar reduced to a dark brown
   track, and a cream fill growing from the LEFT edge across successive frames. This is the
   frame-side proof that the third bar is a meter, and it is also the fill direction and colour
   (cream on brown), which no claim in this packet states.
2. **"CANNOT CHANGE STANCE" is absent from the Android EN string table** — a real web/android UI
   copy divergence. The nearest android strings are `["125"] = 'Stance Restriction'` and
   `["208"] = 'Change Stance'`. Any lane resolving web UI copy from `strings.json` must treat
   exact wording as android-only.
3. **`strings.json["IDS_Q50S3NODE1"]` independently fixes the stance-ring palette mapping** —
   "Light stance - blue, Balanced stance - brown, Heavy stance - red" — and the overworld frame
   `combat_frames/Nr4fQstqHDM_t0130s.png` shows a brown ring labelled "BALANCED STANCE". Three
   independent artifacts agree with the three measured hexes.
4. **The longplay video is pillarboxed and the play field measures 800x480 off the video itself.**
   Non-black columns run x=52..1867 of 1920 with full-height rows, i.e. ~1800 px of game at 2.25x.
   This answers ledger ① from a frame, with no build and no android borrow.
5. **`REBUILD_READINESS.md` has no `war-room` scorecard row.** Claim 10 quoted one. The board should
   stop routing war-room overturns at a table row that does not exist and target `:245` ② instead.
