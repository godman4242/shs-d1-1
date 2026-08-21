# t1-overturns-10 — BLIND CRITIC, LENS 2 (HUNTER)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-10.json` — **16 claims, 16 judged, 0 skipped.**
Every verdict below rests on an artifact I opened myself. I did not read any
`docs/gauntlet/L0/critics/*.md` or `docs/gauntlet/L0/sources/*.md`.

Ledger read in full: `docs/research/REBUILD_READINESS.md` (378 lines). The five sentences
this packet attacks live at lines **116, 205, 225, 235, 236, 245, 351**.

## Headline

- **12 claims survive, 4 are refuted.**
- **6 of the 12 survivors do NOT overturn the ledger sentence they named.** That is the
  point of this tier: 203 claimed overturns are about to rewrite that document, and six
  of the sixteen here would have rewritten a sentence that is still true.
- **The three "war tick is hourly, the ledger is wrong by 24x" claims are all WRONG.**
  The game's own rules screen says otherwise. Details below — this is the biggest catch.
- **One claim (`in-combat-hud-is-three-bars`) is right in its headline and wrong in two
  of its four sentences.** I measured the frame it cites and the frame contradicts it.
  **STANDING INVARIANT: the measurement doc and the frame disagree — THE FRAME WINS.**

---

## THE BIG REFUTATION: the War-Room tick is 24 hours, and the ledger was right

Three claims (`war-tick-is-hourly`, `war-tick-is-hourly-not-daily`, `war-tick-is-one-hour`)
all rest on the same constant, and all three draw the same false conclusion.

The constant is real. I read it:

    reference/decompiled/shs3_android/scripts/StatsManager.as:162
      internal static var WARMOVEINTERVAL:int = 60 * 60;
    :816-822
      public static function setNextWarTurn() : *
      { if(nextWarTurn - QueryManager.instance.getServerTime() < 0)
        { nextWarTurn = QueryManager.instance.getServerTime() + WARMOVEINTERVAL; } }

But **`WARMOVEINTERVAL` is not the war tick.** It refreshes the *player's per-turn move
allotment*. I followed it into the UI:

    StatsManager.as:782  OverworldHUD.instance.warUI.updateWarMoveCounter(serverTimeVariable - nextWarTurn, serverTimeVariable);
    WarUI.as:525-541     maxmoves = StatsManager.getMaxWarMoves();
                         StatsManager.setStat(StatsManager.STAT_WARMOVES, maxmoves);
                         this.movesleftlabel.text = warmoves + LangManager.getString(308);

and the two labels it drives are
`docs/gauntlet/L0/index/strings.json["307"] = 'Next turn in '` and
`["308"] = ' Move(s) Left'`.

The **war tick** — the thing the ledger calls the "War-Room 24h tick" — is the troop
advance, and the game states it verbatim on its own rules screen:

    docs/gauntlet/L0/index/strings.json["376"]   (War room rules 4/6, CAPTURING Sectors)
      "- use the "deploy troops" action to increase the number of troops in a sector.
       - Troops will advance on enemy sectors every 24 hours.
       - If a sector has more attacking troops than defending troops, the sector will be
         captured by the attackers. ..."

So `REBUILD_READINESS.md:116` — *"the War-Room 24h tick"* — is **CORRECT**, not "wrong by
24x". And the hourly move cadence these claims present as a discovery is **already in the
ledger, twice**:

    :244  "War-Room 6 actions + 11-rank ladder (moves/hr + thresholds) ... 24h resolution"
    :246  "'moves per turn' reconciles as 'per hour' (36 = Private's rank threshold, not a turn cap)"

The ledger already holds **both** clocks and distinguishes them. Three claims conflated
them and declared an error that does not exist. All three refuted.

The fourth clock claim, `fourth-clock-dtinterval`, makes no such assertion and **survives**.

---

## THE SECOND REFUTATION: the tan bar does not change

`in-combat-hud-is-three-bars` states: *"Across frames 427.0 / 429.0 / 431.0 the tan bar's
fill length changes, so it is a meter, not a plate."*

I opened the frames. It does not.

Top strip of the bar (rows 1030-1032, x 250-525), column means, every 10 px:

    427.0   20  23 167 182 168 124  47 112 135  83 131 144  51  29  38  73  23 129 ...
    429.0   20  22 166 182 176 127  47 107 136  75 126 146  56  32  42  70  25 120 ...
    431.0   22  22 162 181 173 128  41 105 132  82 123 141  54  29  39  73  22 121 ...

Identical to within compression noise. Right-edge tracking over the band y1029-1047 gives
**509 / 509 / 511** for 427.0 / 429.0 / 431.0 — the two frames the claim contrasts are
*byte-for-byte the same length*, and the third differs by 2 px. **The frame wins.**

The bar IS a meter — but from the source, not the frames:
`BattleUI.as:261 this.reloadbar.bar.scaleX = percentage;`

The claim's second bad sentence: *"The third bar carries the status text 'CANNOT CHANGE
STANCE' when it is below a sixth of max."* In the very frame it cites the bar reads FULL
while the label is displayed. `MCSPlayer.as:2977 if(this.reload < this.maxreload / 6) return;`
is a *silent* early-return in `nextStance()`, not a label driver. The android string table
has no such string at all (`["208"] = 'Change Stance'`, `["125"] = 'Stance Restriction'`),
and `REBUILD_READINESS.md` §3 item 4 already reads the label as v0.717's **unconditional**
in-combat hard lock. Both sentences must be struck before this enters the ledger.

The headline — three bars, green HP / blue Chi / tan reload — I confirmed with my own eyes
(crop (150,960)-(560,1050) of `reference/frames/duel_dense/Nr4fQstqHDM_431.0.png`, 4x
LANCZOS): red-ringed straw-hat medallion, `20/20` green, `26/26` blue, tan bar with
`CANNOT CHANGE STANCE`, yellow `150% DAMAGE` below. That part is solid.

---

## THE SIX INFLATED OVERTURNS

| claim | names ledger | why the sentence survives |
|---|---|---|
| `in-combat-hud-is-three-bars` | :235 ② dynamic HUD "feel" | bar *count* is HUD **geometry**, which the ledger lists under ui-hud **Ready**. ② is about tween-vs-snap / combo pop / vignette ramp. Untouched. |
| `shade-wipe-is-vertical` | :235 ② dynamic HUD "feel" | ② enumerates three widgets. The skill-slot cooldown shade is a **fourth** the ledger never named. All three named items survive this evidence. |
| `jpexs-export-already-on-disk` | :235 ⑤ pause/options/dialogue-box **exact metrics** | Art on disk ≠ metrics measured. And I opened `PauseScreen_51/1.png`: it is a bare 802x481 "GAME PAUSED" logo overlay with **no options UI at all** — the "options" third of ⑤ is not even represented by that symbol. |
| `stance-ring-colours-exact` | :236 Surface "portrait ring is stance-colored, not fixed red" | The finding **confirms** that sentence. §3 item 10 already prints "Light blue / Balanced brown / Heavy red". I even found the primary source that settles it: `strings.json["IDS_Q50S3NODE1"] = "Your stance is indicated by the color of the circle around your portrait: Light stance - blue, Balanced stance - brown, Heavy stance - red."` Corroboration, not overturn. |
| `web-warhex-has-fifteen-states` | `\| **war-room** \| board topology — BLOCKER \|` | **That sentence is not in REBUILD_READINESS.md.** There is no war-room row; the scorecard row is `meta-social` (:135). The nearest real sentence is :245 ② "War-Room **map topology** (board/adjacency)" — and a hex **state enum** is not board topology. :245 ① and ② both stand. |
| `web-decompile-holds-full-logic` | :351 "Server-sim topology & save format — nothing to copy" | A complete **client** decompile is not the **server** simulation. The ledger already concedes "design a ... schema from the observed field set." The finding's real target is the Stage-0b android caveat, which it names in `lane_impact` but did not name as its ledger sentence. |

---

## THE OVERTURNS THAT DO LAND

- **`up-arrow-is-a-skill-not-a-stance-control` and `up-arrow-is-a-skill-not-the-stance-control`
  kill ledger blocker ④ outright** (`:235 ④ the "3 skill slots" is really ~2 abilities + a
  stance up-arrow`). I cropped (1380,920)-(1880,1080) of `Nr4fQstqHDM_428.0.png` at 3x and
  LOOKED. Three slots: leftmost **empty** (bright cream border, no keypress number, no icon),
  middle labelled **"2"** with a claw icon, right labelled **"3"** with the gold up-arrow.
  The up-arrow slot carries a keypress number — it is an ordinary equipped skill.
  Slot centres measure at screen x 1777.5 / 1642.5 / 1507.5 → game x **760.8 / 701.2 / 641.6**
  = exactly `760 - 60i`. And the WEB build carries the same formula, so no android caveat:
  `reference/decompiled/shs3_payload/scripts/§1t113s0§.as:167-176` —
  `while(_loc2_ < 8) { _loc1_ = new §1t5184s0§(); _loc1_.x = 760 - _loc2_ * 60; _loc1_.y = 450; ... }`
  The stance control is `battlemodebust` (`BattleUI.as:26, 113, 192, 275, 374`). Ledger ④ is dead.
- **`world-map-art-recovered`** — I composited the tiles AND found something better:
  `reference/extracted/sprites/DefineSprite_262/1.png` is **already the finished 688x810
  composite**. I looked at it: Hokkaido, Honshu, Shikoku, Kyushu, Sado, Awaji, unmistakable.
  The close-path "*trace the map image*" at :225 ① is dead. Narrowing: the **"world bounds"**
  half of ① (sector / territory coordinate extent) is not answered by the art.
- **`pausescreen-sprite-confirms-play-field`** — I parsed both SWF headers myself:
  web `800.0 x 690.0 @ 24.0 fps, 6 frames`; android `800.0 x 480.0 @ 24.0 fps, 6 frames`.
  ①'s close-path "*read `stage.stageWidth` in a build*" is dead. See NEW FINDING 2 below,
  which answers the other half of ① that nobody claimed.
- **`hurtred-vignette-catalogued`** — closes the *vignette ramp* third of ②. Note what the
  artifact actually shows: **there is no ramp.** Frames 1-6 are pixel-identical
  (corner RGBA `[153,0,0,251]`, centre `[0,0,0,0]`, mean alpha 135.88) and frame 7 is
  entirely blank (maxA 0). Red is visible for **6 frames = 250 ms**, not 292 ms; the 7th
  frame is the blank stop-frame.
- **`interactui-panel-geometry`** and **`fourth-clock-dtinterval`** — land, narrowly. See table.

---

## NEW FINDINGS (nobody has claimed these)

1. **InteractUI has SIX buttons, not five.** The cited range `payload.xml:626573-626600`
   stops one line short of `button6`. `:626602-626603` `name="button6" ... translateX="200"
   translateY="6100"` → **(10, 305) px**, keeping the 39 px pitch; and `:626605-626606`
   `name="npcname" ... translateX="220" translateY="6514"` → (11, 325.7) px. Confirmed in
   code both builds: `shs3_payload/scripts/§1t401s0§.as:67,133-135` and
   `shs3_android/scripts/InteractUI.as:57,131-133`. A rebuild laid out from the packet's
   five-button quote will be one row short.
2. **The longplay frames ARE pillarboxed — ledger blocker ① answered.** On
   `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (1920x1080) the non-black columns run
   **52..1867** while rows run 0..1079. Content ≈ **1815 x 1080 = 1.68 ≈ 5:3**. So **yes, HUD
   x-fractions measured over the full 1920 are wrong**; the mapping is
   `game_x ≈ (screen_x - 57) / 2.264`. Cross-check: that mapping puts the three skill slots
   at game x 760.8 / 701.2 / 641.6, matching `760 - 60i` to under 1 px.
3. **The Focus/crit gating rule is HELD** — the ledger lists it as combat-core blocker ⑤
   *and* skills-meters blocker ③, both "absent".
   `MCSPlayer.as:239 this.maxreload = 5 * 24;` (120 frames = 5 s @ 24 fps);
   `:3267 this.reload += 6;` recharge; `:3249-3257` drain by `slashUsage` (x0.5 / x1 / x1.5);
   `:3242-3244 if(this.reload == this.maxreload) { this.reload = 0; }`;
   `:3272 updateReload((this.reload - 24) / (this.maxreload - 24));`;
   `BattleUI.as:261-262 this.reloadbar.bar.scaleX = percentage; this.crittext.visible = percentage >= 1 && this.reloadbar.visible;`;
   `MCSPlayer.as:2977 if(this.reload < this.maxreload / 6) return;` (stance gate);
   `:3098-3112` on-hit penalty (`reload > max/2 → reload = max/3`, else `-= max/6`).
4. **The three world clocks are WEB-PARITY.** `shs3_payload/scripts/§1t1523s0§.as:192,194,196`
   = `60`, `2 * 60`, `60 * 60`, and `:36 §1t9323s0§:Number = 0.717`. No android caveat is
   needed on any clock claim in this packet.
5. **`hurtred` needs no android cite.** `shs3_payload/scripts/shs3_fla/hurtred_32.as:12,15-18`
   carries the identical `addFrameScript(6,this.frame7)` / `frame7(){stop();}` in the WEB build.
6. **Cite slips worth fixing before ingest** (none fatal):
   `initEmpty()`'s `this.shade.visible = false;` is `SkillSlotButton.as:`**129**, not 130-135
   (130-135 is the image-removal block). The 8-slot loop is `BattleUI.as:130-`**138**, not 130-137.
   `web-warhex-has-fifteen-states` cites `§1t7785s0§.as:261-262` for "6x6 board" but those two
   lines carry only the 55 px pitch and the (90,92) origin; the 6x6 loops are at `:365,:368`,
   `:1055,:1058` and `:1082,:1085` of the same file.
7. **`stance-ring-colours-exact` says "dominant"; it means "peak".** The modal opaque colours
   are (0,0,51) 303 px / (37,25,0) 294 px / (25,0,0) 309 px — the dark inner ramp. The quoted
   hexes are the bright rim: (66,66,255) 81 px, (153,102,0) 53 px, (153,0,0) 66 px. The hexes
   are right; the word is wrong. (153,0,0) is byte-identical to the hurt-vignette corner, so
   the "one red, two uses" observation does hold.

---

## VERDICT TABLE

| # | claim | refuted | overturn upheld | severity |
|---|---|---|---|---|
| 1 | ui-hud/hurtred-vignette-catalogued | no | **yes** (narrow) | minor |
| 2 | ui-hud/in-combat-hud-is-three-bars | no (headline) | **no** | material |
| 3 | ui-hud/interactui-panel-geometry | no | **yes** (narrow) | minor |
| 4 | ui-hud/jpexs-export-already-on-disk | no | **no** | minor |
| 5 | ui-hud/pausescreen-sprite-confirms-play-field | no | **yes** | minor |
| 6 | ui-hud/shade-wipe-is-vertical | no | **no** | minor |
| 7 | ui-hud/stance-ring-colours-exact | no | **no** | minor |
| 8 | ui-hud/up-arrow-is-a-skill-not-a-stance-control | no | **YES** | fatal (to :235 ④) |
| 9 | ui-hud/up-arrow-is-a-skill-not-the-stance-control | no | **YES** | fatal (to :235 ④) |
| 10 | warroom/web-warhex-has-fifteen-states | no | **no** (ledger_text not in the doc) | material |
| 11 | world-exploration/fourth-clock-dtinterval | no | **yes** (narrow) | minor |
| 12 | world-exploration/war-tick-is-hourly | **YES** | no | material |
| 13 | world-exploration/war-tick-is-hourly-not-daily | **YES** | no | material |
| 14 | world-exploration/war-tick-is-one-hour | **YES** | no | material |
| 15 | world-exploration/web-decompile-holds-full-logic | no | **no** | minor |
| 16 | world-exploration/world-map-art-recovered | no | **yes** (geography only) | material |

judged 16 / 16 · skipped 0
