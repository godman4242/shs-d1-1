# Blind cite-lens review — packet `t2-corroborating-07` (48 claims)

**Judged 48 of 48. Skipped: none. Refuted: 2.**

Structured verdicts: `docs/gauntlet/L0/critics/t2-corroborating-07.cite.s26d.json` (written before this file).

---

## Headline

Two claims fall, and both fall for the same reason: **an affirmative statement I could disprove
with one command.**

1. **`world-exploration/farm-guaranteed-yield-is-harvest-two` — REFUTED, material.**
   The claim reads the harvest counter at the wrong point in the function. `InteractUI_crops.as`
   `harvest()` is declared at `:586`, **increments** the counter at `:592`
   (`StatsManager.changeStat(this.startingIndex + 2,1);`), and only then tests it at `:607`
   (`== 1`). `changeStat`'s PLAYERSTAT branch is `setPlayerStats(id,getPlayerStats(id) + val)` —
   it adds — and `getStat` returns `0` for an unset stat. I grepped every write to
   `startingIndex + 2` in the tree: there is exactly one, the increment. So a virgin patch reads
   0, becomes 1 on the first harvest, and satisfies `== 1` **on that first harvest**. The
   surveyor's original "first harvest guaranteed" was right; this "correction" would have
   inverted a shipped game rule in `src/config`.

2. **`uistrings-payload/web-lang-files-are-en-fr-es-only` — REFUTED, material.**
   The file list is exact and worth keeping (`payload.xml:118534-118537`, `:118543-118545`).
   The closing universal is not. `grep -c 'zh-CN' reference/extracted/payload.xml` → **1**, and
   `§1t1521s0§.as:15` declares `public static var CHINESE:String = "zh-CN";`, branched on at
   `:185` and again at `shs3_fla/PauseScreen_51.as:33`, where a dedicated `title_chinese`
   MovieClip is made visible. The web build ships **Chinese branching and Chinese title art** and
   is merely missing the zh-CN string table. Banked as written, this claim would let a future
   lane rule Chinese out of v0.717 entirely. Corrected version supplied in `new_findings`.

Everything else survived. Several survived *spectacularly* — see below.

---

## Reproductions that came back exact

These are the ones where I re-derived the number from the artifact rather than merely
confirming the quote sits on the line.

| Claim | What I re-derived | Result |
|---|---|---|
| `swf-header-24fps…` / `swf-headers-24fps…` | Own SWF header byte-parse (inflate, 5-bit RECT, `u16/256` fps) | android CWS26 800×480 24.000 ×6 · web CWS17 800×690 24.000 ×6 · binarydata_9 CWS10 800×690 24.000 ×1 · shs3.swf CWS10 **165252 B** 800×690 24.000 ×2 — every field to the digit |
| `tan-reload-bar-is-static` | Stated band y1029-1047, >35 % of rows above 45, on the **red/max** channel | right edge **509 / 509 / 511** — the quoted numbers exactly |
| `the-stance-label-is-grey` | Bright-pixel census at threshold 143 / 166 | label **#B3AA9C** (n 1311 vs 1307), buff **#EDBD1F** (n 686 vs 678), HP **#DCE7DE** (n 482 vs 481) |
| `chat-surface-is-31-commands` | Own extraction over `payload.xml:121100-121600` | 42 bare tokens − 11 emotes (single item at `:121490`) = **31**, same set |
| `21-of-27-blobs-are-cross-build-identical` | Own md5 sweep, 27 web vs 42 android | **21 matches**, every pairing and every byte size as quoted |
| `kakuchi-is-cross-build-parity-proof` | Full Python re-implementation of the android naming stack | (24,52) → (344,342) → id **1409366** → 344 % 137 = **70** → RNG(**2818732**) → rand(78)=**74**, rand(37)=**19** → **"Kakuchi"**; tables are exactly 78 and 37 long |
| `frozen-town-levels-are-19-not-12` | Decoded the 63×72 GIF mask, counted Manhattan ≤ 4 from cell (13,51) | **19**, distributed L3×1 L4×2 L5×4 L6×5 L7×7 |
| `map-art-is-held-web-shape-188` | Rendered `188.svg` and **looked** | Hokkaido, Honshu diagonal, Shikoku/Kyushu, Ryukyu — 399 M-commands, `fill="#9d826d"` |
| `map-art-validates-projection` | Own overlay of the mask on a flattened `188.svg` raster | **695/735 = 94.6 %** best pure-translation fit; transform confirmed as 10 px/cell, no scale or rotation term |
| `web-and-android-font-sets-diverge` | `grep -c` on the 329 MB payload | exactly **9** `DefineFont3Tag`, exactly **7** `DefineFontNameTag` (missing: `_sans` id 47, `Arial` id 1296), **0** hits for `MS UI Gothic` |
| `web-build-confirms-resname` | Own regex parse of the XLIFF | `id="407"` → 'Search rocks'; `resname="407"` → 'Game Paused'; **2,343 of 2,555** units have id ≠ resname |

**The frame wins, twice, and I checked by looking, not by reading a doc.** My 4× crop of
`duel_dense/Nr4fQstqHDM_428.0.png` at (150,995)-(600,1080) shows a brown plaque reading
**CANNOT CHANGE STANCE** in white brush caps with **150% DAMAGE** in gold beneath it; the
companion crop shows the red-ringed kasa bust, green **20/20** and blue **26/26**. Neither
string exists in the 2,555-unit Android table (`'CANNOT'` → 0 hits). And on
`seg-28/frame_0007.jpg` I read **HP 20/30 · CHI 47/47 · AP 30/40** beside a level badge
reading **10** — 10 + 30 = 40, exactly `InventoryUI.as:2409`.

---

## The four QUOTE_UNVERIFIED claims all cleared

All five flagged claims were escaping or formatting artefacts, not missing text:

- `web-battleui-diverges-from-android` — the file writes `\'#FF0000\'`. Everything else
  reproduces: web id set `{…,960,11119-11126,11130,11131}`, android `{45…868}`, exactly 11
  extras, **all 11 absent** from `strings.json` (max numeric key **9010**, confirmed against the
  raw XLIFF).
- `web-build-confirms-resname` — `PauseScreen_51.as:26` is verbatim.
- `web-payload-confirms-android-claims` / `web-payload-is-directly-citable` /
  `web-payload-carries-the-same-resizehandler` — every quoted literal is verbatim at the stated
  line (`§1t1540s0§.as:271-273,277,280-281,304-306,313-314`).

**The single strongest artefact in the packet** is the DialogBox identity: web `§1t5474s0§.as`
and android `DialogBox.as` agree character-for-character at `:46, :49, :53, :57, :86, :105,
:107, :136, :147` — **same values AND same line numbers**. That is what makes the "grep the
mangled tree, don't infer parity from video" method real.

---

## Corrections to carry forward (claims that survive but need a fix before banking)

| Claim | Fix |
|---|---|
| `warroom/troop-advance-is-24-hours` | `strings.json["307"]` is **'Select territory'**. `'Next turn in '` is **`["309"]`**. `["308"] = ' Move(s) Left'` is correct. The 24-hour headline is verbatim in `["376"]` and stands. |
| `world-exploration/nochange-ring` | "covers **46** territories" is wrong. Its own enumeration (L3×1 L4×2 L5×4 L6×5 L7×7) sums to **19**, and my recount gives 19. It also contradicts its sibling in this same packet. |
| `web-hud-copy-absent-from-android-table` | Of the eight `'150%'` hits, four are **skill** descriptions (resname 6143-6146), not "all item descriptions". Conclusion untouched. |
| `web-battleui-diverges-from-android` | The selector has **nine** branches, not eight (eight plain + a red `#FF0000` pair on `getStat(…) <= 1`). `getString(619)/(620)` are at `:160-161`, not `:161-162`. |
| `web-symbol-ids-differ` | All seven mappings are **right**; the `:6` shorthand is only correct for `§1t5184s0§` and `§1t5533s0§` (others: `:10, :7, :8, :7, :5`). |
| `web-payload-logic-is-on-disk` | `find -name '§1t*s0§.as'` → **625** recursive / 569 top-level, not 612. Android's `-240/480` pair is at `ScreenTransition.as:100-101`; `:102-103` are the **web** numbers. |
| `web-payload-confirms-android-claims` | `counter >= 17` is at `:89` (outside the stated `:78-88`); `white.alpha -= 1/24` is at `:113`, not `:111`. |
| `12h-crop-never-rots` | The `case 4:` block is `:135-144`; the stated `:133-140` clips the `else` half of its own quote. Substance verified: cases 1-3 carry the three-way `gracePeriod → ROTTED` ladder, case 4 is two-way. |
| `map-art-is-held-web-shape-188` | "lands **every** land cell" overstates — it is ~89-95 % at cell-centre sampling, misses on coastline. |
| `ap-cap-formula-is-frame-confirmed` | The `30` at `StatsManager.as:707-708` is a literal creation value, not an instance of level+30 (which would be 31 at level 1). |
| `name-tables-in-web-payload` | Table starts at `payload.xml:119151`, one line before the stated `:119152`. |

---

## Verification I could not complete

`web-and-android-font-sets-diverge` — the **web** half is exact on all nine line numbers, and
`MS UI Gothic` returns **0** hits across the whole payload, so web-absence is proven. The
**android-presence** half I could not re-derive: that face would live inside one of the
XOR-obfuscated resource blobs, and my decrypt attempts at keys 109/111 on
`115_Mobile_SHS3Resource.bin` failed to inflate. That half rides on the banked android font
finding, not on anything I opened. Flagged in the verdict rather than refuted, because
nothing I checked contradicted it and the claim's operative conclusion — no "the font is
closed" statement is valid without naming the build — follows from the web half alone.

---

## Duplicates in the packet (bank one, not both)

- `swf-header-24fps-and-stage-rects` ≈ `swf-headers-24fps-and-stage-rects`
- `web-android-cooldown-divergence` ≈ `web-cooldown-uses-ceil` ≈ `web-vs-android-cooldown-rounding`
- `duel-token-clock` ≈ `fifth-clock-duel-tokens`
- `minimap-x-at-3-2` ≈ `minimap-x-is-quest-target` ≈ `minimap-x-marker-column`
- `frozen-town-levels-are-19-not-12` ≈ `nochange-ring` (and they disagree on the count — 19 is right)

## Metadata note

`world-exploration/ap-cap-formula-is-frame-confirmed` carries `overturns_ledger: false` but its
own text says it "partially overturns the banked claim `economy/ap-and-token-caps-are-40`
(`CLAIMS.md:2288`)". I opened `CLAIMS.md:2285-2288`: it carries the same frame crop and the
ruling "the '30 max' does not and must not be ported". That ruling does break. The claim is
mislabelled as non-overturning.
