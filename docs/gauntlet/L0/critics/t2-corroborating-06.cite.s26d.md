# t2-corroborating-06 — CITE LENS review (blind critic, s26d)

**Packet:** 48 claims · **Judged:** 48 · **Skipped:** 0 · **Refuted:** 0 · **New findings:** 8

Structured verdicts: `docs/gauntlet/L0/critics/t2-corroborating-06.cite.s26d.json` (written first).

---

## Headline

Zero refutations, and that is not a rubber stamp. I opened the cited artifact for every
one of the 48 claims and re-derived the load-bearing number myself wherever a number was
asserted. This packet is unusually well cited: dozens of quotes land on the exact line,
including one that names a byte offset inside a 329 MB XML (`payload.xml:626602`) and one
that names a line inside a UTF-16LE blob (`118_Mobile_Lang_EN.bin` line 1807). Several
frame measurements reproduced digit-for-digit under my own independent scan.

What I did find is **eight real defects**, none of which destroys its claim but all of
which would corrupt the ledger if copied verbatim. They are filed as new findings.

**Five citelint flags were false alarms.** `QUOTE_UNVERIFIED` on
`string-table/hell-is-a-first-class-room-type`, `ui-hud/resname-600-proves-pass1-read-the-id-column`,
`ui-hud/hotkey-numbering-rule`, `ui-hud/shutter-frame-counts-corrected`,
`ui-hud/shutter-is-asymmetric`, `ui-hud/skill-slot-widget-geometry-measured` and
`ui-hud/interactui-icon-ids-resolve` all resolved once I looked: they are composite
backtick quotes, simulation transcripts, or the author's own measurements — not file
quotes a substring matcher could find. Every one of them held.

---

## The one claim I came closest to refuting

`ui-hud/frame-to-stage-mapping-is-anisotropic` — **material**, not refuted.

Two defects:

1. **Mis-cite.** The quoted fit-branch code is **not** at `GameEngine.as:283-290`. Those
   lines hold the friend-bar else-block and two variable declarations. The quoted
   assignments are at **:302-305**. Right file, wrong seventeen lines.
2. **Contested model.** "y divides by 2.250" assumes the frame contains the full 480 px
   game height. That is unproven, and my own measurement pushes the other way.

I did not refute it because the *frame* half of its cite reproduced exactly — content
cols 52→1867 (1816 px), rows 0→1079, and `ls reference/frames/broad_survey/*.jpg` = 240 —
and the code is real and inside the cited file. But the ledger must carry `:302-305`.

---

## The transform conflict (new finding N1)

Four claims in this packet measure the same skill-slot box on the same frame and agree to
within ~1 px. They then **disagree on how to convert it**, and both answers are marked HELD:

| | vertical rule | slot centre → game y | box size (game px) |
|---|---|---|---|
| Model A — `frame-to-stage-mapping-is-anisotropic`, `slot-strip-matches-all-three-constants` | ÷ 2.250, offsetY 0 | 451.8 | 48.4 × 48.0 (not square) |
| Model B — `frame-to-stage-transform`, `slot-box-measurement-corrected` | × 2.2689, y₀ = −5.0 | **450.0** | **48 × 48** |

My own scan of `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`:

```
content cols 52 1867 width 1816     content rows 0 1079
thr 150  emptybox cols 1448 1559  rows 961 1072   (112 x 112, square)
thr 190  emptybox cols 1449 1558  rows 963 1071
```

Three points favour Model B:

- The pillarbox is **exactly 52 px of black on both sides**, so content = 1816 = 800 × 2.270.
  A true 2.250 fit needs 60 px pillarboxes. The frame does not show them.
- Under Model B the box is exactly **48 × 48** game px centred at exactly **(640, 450)** —
  integers matching `BattleUI.as:133-134` to the digit. Under Model A it is 48.4 × 48.0
  centred at 451.8.
- The box measures **square** in the frame (112 × 112 at threshold 150). An anisotropic
  mapping would not produce that.

Model A is not disproved — the ±1 px thresholds leave room, and only one code-known y
constant exists (`y = 450`), so no single measurement can separate scale from offset. But
`slot-strip-matches-all-three-constants` prescribes Model A as the rule "every future A1
measurement in ui-hud and combat-core should use", and that prescription should not be
adopted until the tie is broken.

---

## The other seven new findings

- **N2 — every "id gap" in the language table is a resname gap.** The `id` attribute of
  `118_Mobile_Lang_EN.bin` is **contiguous 0..2554 with zero gaps** (set equality tested).
  The `resname` column has 1,905 distinct values and 12 gaps. `strings/the-android-lang-table-skips-ids-881-999-entirely`
  reaches the right conclusion — absence ≠ v0.717 addition — but names the wrong column;
  as literally written it is checkable-false. Also: `strings.json` is missing **12 resnames**
  the raw blob carries (665, 820, 5002, 5017, 5022-5025, 5034, 7003, 7041, 9000).
- **N3 — the duel HUD's blue bar is CHI, not AP.** `BattleUI` declares only `hpbar` (:24)
  and `chibar` (:16). `buff-row-is-frame-confirmed-A1` calls it "a blue AP bar reading 26/26";
  the reading is right, the label is not. The sibling frames say `CHI 31/31` and `CHI 15/15`.
- **N4 — `updateBuff` has 13 literals, not 11**, and appends a countdown. "Injured" (:1444)
  and "Moderator" (:1448) sit past the cited window, and :1451 renders
  `buffstr + " <font color='#FFFFFF'>" + getTimeString(duration) + "</font>"`.
- **N5 — the carry-weight PvP exemption covers 5 of 8 cited sites.** `Obj_Hut:70`,
  `NodeUI:379` and `InteractUI:1730` enforce weight regardless of PvP room mode, as do
  `InventoryUI:440`, `CraftingUI:233` and `BankUI:348`.
- **N6 — `GameEngine.as:283-290` does not hold the fit branch** (see above); correct map:
  head :267 · constants :269-271 · aspect gate :275 · fit-width :295-298 · pillarbox :302-305.
- **N7 — web skill 1077 is implemented, not just declared.** `§1t120s0§.as:344` opens its
  case and :351 spends **8** kunai ammo — a fourth rung on the ammo curve (1 / 4 / 8).
- **N8 — `shs3.swf` is CWS v10, not v17.** One wrong byte inside a claimed byte-parse in
  `800x690-is-the-embed-stage`; the sibling `framerate-and-stage-rects-bytechecked` has it right.

---

## What I re-derived myself (selected)

**String table.** Built my own id→resname→source map from the raw UTF-16LE blob. Confirmed
`resname 600 = "Special Control Point"` vs `id 600 = "Auto Slash Off"`, `resname 601 =
"Villages may be converted into towns…"` vs `id 601 = "Auto Slash On"`, `resname 619 =
"Auto Slash Off"` at bin **line 1807**, `resname 223 = "AP"`, `resname 4000 = "Small Soldier
Pill"` with max `id` = 2554. First divergence: `id 211 → resname 211`, `id 212 → resname 222`.
Ran the fabrication test: `'<trans-unit id="388" resname="388">' in blob` → **False**; both
replacement rows → **True**. Resnames 161-166 really are the six `Target: …` strings and
`getString(161..166)` returns **0 hits across all of `reference/decompiled/`**.

**Frames.** Opened and looked, per §0. The stance medallion: my own pixels at ring (90,1022)
and disc (93,959) reproduce all six RGB triples exactly, and the upscaled crops show navy /
olive-brown / dark-maroon **disc fills** behind the bust, not just tinted rings. The BALANCED
annulus reads pale khaki (#b3ae76, hue 55°, sat 34%) — **the frame wins** over the banked
#996600. The buff stack in `Nr4fQstqHDM_432.0` is exactly five rows with the brown restriction
pill and the gold `150% DAMAGE` line visibly separate. `frame_0020.jpg` shows the gold `GUEST`
plate still drawn above the fighter mid-fight. The slot strip shows an empty unnumbered box,
then `2` with a claw icon, then `3` with a gold arrow — precisely what `initKeyPressText(slotCount − i)`
with a null `skillSlots[0]` predicts.

**Bytes.** Parsed all four SWF headers myself (inflate + RECT bit-unpack): 800×690 @ 24.000 fps
for both web files, 800×480 @ 24.000 for Android. `hurtred_32/1.png` is exactly 800×480. The
anim blobs open `EF BB BF` and yield 25 / 158 `<anim>` under utf-8-sig and 0 / 0 under utf-16-le.
`90_InteractUI_UIData.bin` holds exactly 139 `<icon>` refs over 20 distinct ids, and mapping the
25 `case NodeUI.ACTION_*` labels through `NodeUI`'s constants covers **all 20 with zero uncovered**.

**Counts.** Web `SkillManager` 54 ids vs Android 50, difference exactly [1074, 1075, 1076, 1077];
`skilldata.xml` stops at 1073. `SOURCE_CONSTANTS.md` contains **zero** `§1t` strings while
claiming v0.717; the decompile it names stamps `clientVersion = 0.682`, and I spot-checked one
named divergence — Android `maxreload = 5*24 = 120` vs web `8*24 = 192`.

**Frame scan.** Random 120-file sample across `reference/frames/**`: of 63 full 1920×1080 frames,
**zero** have content aspect below 1.45, so the 1.1594 friend-bar mode is structurally unfilmable
as claimed. (The claim's "45 directories" matches nothing — I count 20 top-level, 113 in
`frames.json`, 185 total — but that is a sampling description, not the finding.)
