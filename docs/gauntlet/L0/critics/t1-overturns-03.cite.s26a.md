# t1-overturns-03 — blind CITE-LENS review (s26a)

19 claims in the packet, 19 judged, 0 skipped. Every verdict below rests on an artifact
I opened myself in this session; where a claim's own numbers were reproducible I re-derived
them rather than reading them.

**Headline: 18 of 19 survive, 1 is refuted, and 3 of the survivors do not actually overturn
the ledger sentence they name.** This is an unusually strong packet — 14 of the 19 quotes
are byte-for-byte what is on disk at the exact line numbers cited.

| claim | verdict | overturn | severity |
|---|---|---|---|
| payload/repair-cost-formula-is-node-level-times-10 | HELD | upheld | minor |
| progression/expArray-validated-on-camera | HELD | upheld | material |
| progression/per-point-ap-is-plus-5-not-plus-1 | HELD | upheld | material |
| progression/unlock-rule-breaks-inside-ninja-and-chi | HELD | upheld | material |
| progression/web-ap-per-point-is-5-not-1 | HELD (dup) | upheld | material |
| rebirth/tenth-dan-tier-is-real | HELD | upheld | material |
| skills-meters/web-stance-damage-ladder-and-crit | HELD | upheld | material |
| stance/in-combat-switch-is-live-in-web-battleui | HELD | upheld | **fatal** |
| ui-hud/blocker-2-falls-entirely-no-pop-no-ramp | HELD | upheld | material |
| ui-hud/filmed-session-scale-is-2.27 | HELD | upheld | material |
| ui-hud/longplay-frames-are-pillarboxed | **REFUTED** | (falls, but not on these numbers) | material |
| ui-hud/payload-swf-stage-is-800x690 | HELD | **NOT upheld** | minor |
| ui-hud/v0717-duel-nameplate-has-no-level | HELD | upheld | material |
| ui-hud/web-battleui-is-1t113s0 | HELD (dup) | upheld | minor |
| ui-hud/web-battleui-stance-button-error-sound | HELD (dup) | upheld | minor |
| world-exploration/farm-timers-and-patch-ladder | HELD | **NOT upheld** | minor |
| world-exploration/ore-node-respawn-rule | HELD | **NOT upheld** | minor |
| world/map-bitmap-is-held-byte-exact | HELD | upheld | **fatal** |
| world/war-map-is-already-on-film | HELD | upheld (weak) | minor |

---

## The one refutation

### ui-hud/longplay-frames-are-pillarboxed — REFUTED

Its headline is true and I confirmed it independently: a full-frame max-over-RGB scan of
`reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` gives non-black columns 52..1867 and
non-black rows 0..1079. The frames ARE pillarboxed and x/1920 fractions ARE wrong.

But this is an A1 *measurement* claim, and every number it derives is wrong:

1. Bars are exactly **52 px** each side, not "~58".
2. Content is **1816 px = 800 × 2.270**. "800×480 scaled by 2.25" would be 1800 px. The
   finding asserts 2.25 and 2.264 in the same paragraph.
3. Its slot centres **1507.5 / 1642.5 / 1777.5 do not reproduce**. Two independent methods
   (the dark-run method, and a column-gradient border-edge method) give 1503.0–1503.5 /
   1640.0–1640.5 / 1775.5–1776.5. The pitch its numbers imply is 135.0; measured is 136.0–137.0.
4. Its quoted column-luminance sequences could not be located. With max-over-RGB at
   threshold 18 my x=0..75 profile begins `1,1,1,1,1,…`, not `0,0,0,2,0,0,0,0,4,2,8,151,153`.
   citelint's `QUOTE_NOT_LOCATED` is a **true positive**.
5. Its prescribed ledger correction `(x−57)/1811` uses two wrong constants.

`REBUILD_READINESS.md:235` blocker ① does fall — but on the sibling claim
`ui-hud/filmed-session-scale-is-2.27`'s constants (x0 = 52, s = 2.270), which I upheld.
**Do not carry 57 / 1811 / 2.25 / 2.264 into the ledger.**

---

## Three survivors whose overturn does not land

**ui-hud/payload-swf-stage-is-800x690.** The header parse is exactly right — I reproduced it
byte for byte (CWS, v17, declared length 11,892,061, file 6,880,328 bytes, RECT 0,16000,0,13800
twips = 800.0 × 690.0, frameRate field 0x1800 = 24.000, frameCount 6). But `RR:117` / `RR:171`'s
800×480 does not fall, because three artifacts pin the **viewport** at 800×480: the outer loader
`reference/preservation/shs3.swf` *also* declares 800×690 @24 fps (so 690 is the embed stage for
the whole title, not a payload quirk); the full-screen hurt vignette art in this very SWF measures
exactly 800×480; and the filmed content region is 1816×1080 = 1.681 ≈ 5:3, with the BattleUI slot
row at y = 450. 690 is the stage rect, 480 is the play area. The claim's own PARTIAL grading and
its "the VIEW is STILL_UNHELD" caveat are honest, so this is not a refutation.

**world-exploration/farm-timers-and-patch-ladder.** Every number verbatim. But `RR:225` blocker ②
names *yield + whiff + respawn*, and farm yield rows are still unread — the claim says so itself.
The blocker is amended, not struck.

**world-exploration/ore-node-respawn-rule.** Every cited line verbatim and the respawn rule is
right. But on its own it supplies respawn only; its "closed end to end" leans on a mining
yield/whiff finding that is not in this packet, which I may not assume under §0.

---

## Corrections carried into surviving claims

- **Repair-cost claim:** Reinforce has **three** material tiers, not two.
  `InteractUI.as:662-673` branches weaponlevel <30 / <60 / else onto strings 850 / 851 / 852 =
  1 Silver Ore / 1 Titanium Ore / **1 Uncut Diamond**, all at a flat 5000 coins. The claim's
  `:649-668` cite stops one branch short.
- **HUD-feel claim:** **six** ShowFrames precede the RemoveObject2 in DefineSprite 3607, not
  five — but the number that matters, a 6-frame flat hold = 0.25 s at 24.0 fps, is right.
- **web-battleui-is-1t113s0:** `§1t113s0§.as:293` is **not** android `BattleUI.setStanceColor`.
  Android's takes a `num:int` and does `battlemodebust.stancecolor1.gotoAndStop(num)`; the web
  `:293-302` takes no parameter and loops eight skill slots. The nearest web twin of
  setStanceColor is `:482-485`.
- **stance-button-error-sound:** "the button binding at `§1t406s0§.as:944`" is **mis-cited**.
  That line is a CLICK binding inside a *different* UI class (embed symbol3427) onto that
  class's own `§1t4472s0§` at `:3064`, which handles mail/notification state. The real binding
  is `§1t113s0§.as:379-381` — a hitTestPoint on the portrait bust dispatching `§1t5207s0§()`,
  the twin of android `BattleUI.gotClicked → stanceButtonClick`.
- **farm-timers:** the **12-hour crop never rots.** `:161-169` is a bare two-branch if/else with
  no ROTTED arm. Grace (`gracePeriod = 900` at `:55`) applies only at `:121`, `:136`, `:151`.
- **ore-respawn:** `createRoomObjects` does **not** suppress the ore. Ore is object id 30
  (`GameStage.as:792-793`), and id 30 is exempt at `:633`; at `:647-650` a dead ore is
  **re-created with `,1` appended** to its property, and `Obj_OreDeposit.as:19-24` then does
  `gotoAndStop(1)` with `canInteract = false`. The depleted rock is still drawn. A rebuild coded
  from "suppress objects in the dead list" would render a hole.
- **stance damage ladder:** the ceiling is **mastery 10, not the ledger's mastery-9**.
  0.5 + 0.4×9×0.1 = 0.86, not 0.9.
- **map bitmap:** `QuestEngine.as:524-525` reads the shift constants off `WorldMapUI`, not
  `WarSelectUI` (only `:1206` uses WarSelectUI). Immaterial — same values.
- **war-map-on-film:** the filmed board is the **rendered war-map art**, a different artifact
  from the 63×72 territory **mask**. Complementary, not duplicate.

---

## Independent strengthenings I found while judging

**The stance triplet.** Three claims (`stance/in-combat-switch-is-live-in-web-battleui`,
`ui-hud/web-battleui-is-1t113s0`, `ui-hud/web-battleui-stance-button-error-sound`) are the same
overturn. All survive; the ledger must record **one** strike on `RR:158` and
`SHSD_MASTER_REFERENCE.md:388`, not three. I pinned the class identity harder than any of them
did: `§1t1525s0§.as:1073` declares `public static function §1t9941s0§() : §1t113s0§`, the exact
twin of android `StageManager.as:950 getBattleUI() : BattleUI`, and `§1t1525s0§.as:1152` is the
twin of `isBattle()`. **The build diff is the proof:** android's `canChangeStance`
(`MCSPlayer.as:2965-2968`) has *no reload term at all*, and android's `stanceButtonClick`
(`BattleUI.as:360-370`) plays *no sound on either branch*. The web build ADDED the `reload >= 48`
gate and BOTH audio cues. A hard lock does not grow a Focus gate and a refusal beep.

**The stance-scale ruler is build-safe.** `filmed-session-scale-is-2.27` used the android
constant `BattleUI.as:133`. The web payload carries the identical constant at
`§1t113s0§.as:170` (`_loc1_.x = 760 - _loc2_ * 60;`, y = 450 in both), so the ruler cannot be
attacked on parity grounds.

**The AP claims get a real source.** The ledger's "+1AP" is not a typo — it is android's
**manual** panel, `InventoryUI.as:2429-2434` (`APaddHandle → StatsManager.addMaxAP(1)`), a better
cite than the auto-allocator the packet blamed. And the **per-stat caps** make the split
arithmetic-proof: web `§1t5957s0§.as:3341-3346` caps are `10+(lvl+10)*10 / 10+(lvl+10)*5 /
30+(lvl+10)*5 / 1+(lvl+10)*3`, android `InventoryUI.as:2407-2412` caps are `10+(lvl+10)*5 /
10+(lvl+10)*5 / 20+(lvl+10) / lvl+10` — each build's cap is exactly its per-point grant times the
budget. `RR:77` and `RR:199`'s "+10HP/+5Chi/+1AP/+3-stat" is a **two-build hybrid** no single
build ever shipped.

**The web per-point table is on camera too.** At `-ss 653.0` the character screen reads L3 /
HP 20/20 / CHI 10/10 / AP 30/30 / ATK 7 / DEF 7 / SPD 4 / 0 points; at `-ss 1600` it reads L4 /
HP 20/20 / CHI 9/15 / AP 15/30 / ATK 10 / DEF 10 / SPD 4 / 0 points. Three points spent bought
CHI +5, ATK +3, DEF +3 — exactly the web handlers, and android's +5/+1/+1 is ruled out on film.

**The "CANNOT CHANGE STANCE" film evidence is reconcilable.** `§1t113s0§.as:326-343` draws the
reload bar as `(reload − 48) / (maxreload − 48)` — it only begins to fill above the stance
threshold — and drives one text field off it: a grey `#BBBBBB` label from `getString(960)` at
bar 0, hidden mid-fill, and `getString(175)` = "Critical Hit" plus `Snd_criticalDamage` at full.
String 960 is used at exactly one site in the whole web payload and does **not** exist in the
android v0.682 table. The label is **bar-state driven, not battle-state driven** — a
Focus-insufficiency readout, not a lock.

**The map bitmap escapes the C2 circularity trap.** `92_1t4648s0.bin` is embedded by the WEB
payload's own AS3 (`§1t4648s0§.as:5`, wired through `§1t1524s0§.as:87 → :701`), and it is
byte-identical to the android blob — md5 `13068dfa1a5cc5628720a25782f93fed` on both, 272 bytes.
That is genuine cross-build parity, not a file diffed against itself. I decoded it myself
(GIF89a, 63×72, 735 non-black of 4536) and rendered it at 10×: unmistakably the Japanese
archipelago. This is the single most valuable item in the packet.

**Unclaimed data on the War Room frame.** `frame_0014.jpg` also carries
"ALLEGIANCE: CLAN AKA RYU", "**RANK: RECRUIT (3 MOVES A TURN)**", "**MOVES MADE: 0/36**",
"3 MOVE(S) LEFT", "FLAGS INDICATE BATTLES THAT THE CLANS ARE CURRENTLY ENGAGED IN" and a
"SHOW CLAN MSG" button. The shipped UI says **A TURN**, in the game's own copy — which contests
`RR:247`'s "'moves per turn' reconciles as 'per hour'". THE FRAME WINS.

---

## Notes on the machine audit

- The three `QUOTE_UNVERIFIED` flags on `expArray-validated-on-camera`,
  `per-point-ap-is-plus-5-not-plus-1`, `farm-timers-and-patch-ladder` and
  `ore-node-respawn-rule` are **false positives** — the quotes are either on-screen
  descriptions or compound multi-file strings, and I located every fragment on disk.
- The `QUOTE_UNVERIFIED` flag on `longplay-frames-are-pillarboxed` is a **true positive**:
  I could not reproduce the quoted luminance profile either, and the finding is refuted.
- No `BROKEN` cites in this packet. Every path exists and every line number is inside the file.
