# GAUNTLET L0 — SOURCE SURVEY: `android-blobs` (the 42 class-named Android DefineBinaryData blobs)

**Unit:** `reference/extracted/android/` — 42 blobs exported from
`reference/decrypted/shs3_android_payload_decoded.swf` (clientVersion **0.682**).
**Document under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20, avg ~42).
**Sweep type:** ORTHOGONAL (by source, not by system).
**Date:** 2026-08-20. Run 5.

---

## Headline

Four earlier runs mined these blobs for *content*. This pass mines them for
**provenance and cross-build delta**, and that turns out to be where the
un-banked value was:

1. **The web v0.717 payload holds ZERO of ten XML data roots.** `questdata`,
   `itemdata`, `skilldata`, `npcdata`, `nodedata`, `achievementdata`, `uidata`,
   `bgdata`, `premiumdata`, `mapdata` — all absent from the inflated web payload,
   all present in the Android one. The Android blobs are the *sole* source for
   ten of the thirteen data roots the game ships.
2. **Two banked L0 claims that "discharge the v0.682 caveat" by comparing
   `reference/extracted/<x>.xml` against the Android blob are CIRCULAR** — those
   four `.xml` files *are* the Android blob, re-exported without its prolog.
3. **The web build is an animation SUPERSET: 487 vs 471, delta exactly 16**,
   and 10 of those 16 are a complete, engine-known **SPIDER** enemy that appears
   nowhere in the Android npcdata, string table or ActionScript.
4. **Boss attack timing was re-cut between builds.** Six Ogre durations and one
   Guardian duration differ; the Android build ships *no* `*end` recovery clip
   and folds recovery into a 3.6×-longer `*hit` clip. The telegraph/active/
   recovery triad that closes enemies-ai blocker ③ is a **web-only** fact.
5. **`123_Mobile_BGData` + `XMLBG.as` are a complete parallax contract** — 49
   backgrounds, 874 authored layer instances, a 5-plane scroll ladder and a
   depth-of-field blur ladder symmetric about the player plane — and no ledger
   system mentions backgrounds at all.
6. **The item/accessory/skill ICON art is held**, which retires a banked
   STILL_UNHELD; and the 66 dialogue portraits + 16 story cards are held and
   enumerated, which retires "held-but-encrypted".

Counter-weight, stated up front: **I rendered nothing.** I enumerated exported
symbol *names* inside the decrypted resource SWFs; I did not decode a single
`DefineShape` and I make no claim about any colour, outline weight or silhouette.

---

## M0 — METHOD CORRECTION: 41 of the 42 blobs are plain UTF-8, not UTF-16LE

The kickoff warns "⚠ THEY ARE UTF-16LE. A byte-level grep returns 0 hits and will
fool you." Measured: **only `118_Mobile_Lang_EN.bin` is UTF-16LE** (BOM `ff fe`).
Every other XML blob opens with the ASCII bytes `3c 3f 78 6d 6c` = `<?xml`.

```
$ xxd -l 32 reference/extracted/android/112_Mobile_NodeData.bin
00000000: 3c3f 786d 6c20 7665 7273 696f 6e3d 2231  <?xml version="1
00000010: 2e30 2220 656e 636f 6469 6e67 3d22 7574  .0" encoding="ut
$ xxd -l 32 reference/extracted/android/118_Mobile_Lang_EN.bin
00000000: fffe 3c00 3f00 7800 6d00 6c00 2000 7600  ..<.?.x.m.l. .v.
```

Consequence: `grep -n` works directly on 41 blobs and its line numbers are the
real ones. Recorded so run 6 does not pay the decode tax I paid.

---

## A1 — The web v0.717 payload contains NONE of the ten Mobile_* data roots

- **Artifact:** A2 · `reference/decrypted/shs3_payload_decoded.swf` vs
  `reference/decrypted/shs3_android_payload_decoded.swf` (both `CWS`, zlib-inflated)
- **Measured** (root-tag occurrence count in the inflated bytes):

  | root | web v0.717 | android v0.682 |
  |---|---:|---:|
  | `<questdata>` | **0** | 1 |
  | `<itemdata>` | **0** | 1 |
  | `<skilldata>` | **0** | 1 |
  | `<npcdata>` | **0** | 1 |
  | `<nodedata>` | **0** | 1 |
  | `<achievementdata>` | **0** | 1 |
  | `<uidata>` | **0** | 1 |
  | `<bgdata>` | **0** | 1 |
  | `<premiumdata>` | **0** | 1 |
  | `<mapdata>` | **0** | 1 |
  | `<survivalmodedata>` | 1 | 1 |
  | `<traproomdata>` | 1 | 1 |
  | `<animdata>` | **19** | **18** |

  Inflated sizes: web 11,892,053 B · android 21,688,584 B.
- **Consequence:** ten of the thirteen data roots exist **only** in the Android
  build. Every quest line, item row, skill row, NPC row, world node, achievement,
  UI menu, background definition and premium SKU in the entire L0 corpus is an
  Android v0.682 measurement with **no web counterpart to check against**. That
  is not a caveat that can be discharged by any comparison inside the corpus we
  hold — the other side of the comparison does not exist.
- **Relation to banked work:** strengthens `quests-story/payload-provenance-is-android`
  (which established this for 4 roots) by extending it to **10** and by
  re-deriving it from a second, independent direction (root-tag census of both
  inflated payloads rather than mtime ordering).
- **Verdict: HELD.**

## A2 — The "web-vs-Android byte-identical" parity proofs are CIRCULAR. I contradict a banked claim.

- **Artifact:** A3 · `diff reference/extracted/skilldata.xml reference/extracted/android/117_Mobile_SkillData.bin`
- **Quote (complete output, exit 1):**
  ```
  0a1
  > <?xml version="1.0" encoding="utf-8"?>
  1971c1972
  < </skilldata>
  \ No newline at end of file
  ---
  > </skilldata>
  ```
  The identical two-hunk shape (missing prolog + missing trailing newline, zero
  content lines changed) repeats for `itemdata.xml` vs `111_Mobile_ItemData.bin`
  (7 diff lines), `npcdata.xml` vs `125_Mobile_NpcData.bin` (7), and
  `questdata.xml` vs `116_Mobile_QuestData.bin` (5 — that one has no prolog on
  either side). Sizes differ by exactly the 40-byte prolog + 2-byte CRLF:
  184,002/184,044 · 39,003/39,045 · 228,413/228,455 · 796,383/796,384.
- **Banked claim contradicted:** `skilldata/android-web-byte-identical` — *"The
  Android v0.682 skilldata blob and the web v0.717 skilldata.xml are
  byte-identical apart from the XML declaration line, which discharges the S0-3
  'parity NOT established' caveat for this unit."*
- **Why it fails:** there is no "web v0.717 skilldata.xml". Per A1 the web
  payload contains **zero** `<skilldata>` roots. `reference/extracted/skilldata.xml`
  is the Android blob with its prolog stripped — which is exactly the diff shape
  above. Comparing a file to itself proves nothing about build parity, and the
  conclusion ("the caveat no longer applies to skilldata") is unsupported.
- **Scope of the contradiction:** I am **not** disputing
  `itemdata/web-android-schema-parity` (that compares two *AS3 parser classes*,
  a real cross-build comparison) nor `world-exploration/21-of-27-blobs-are-cross-build-identical`
  (that compares the 27 web bindata blobs against Android ones — also real).
  Only the four `reference/extracted/*.xml`-vs-blob comparisons are circular.
- **Verdict: HELD (contradicts a banked claim).** The S0-3 caveat stands
  undischarged for questdata, itemdata, skilldata and npcdata.

## A3 — A whole enemy — the SPIDER — is WEB-ONLY and is invisible to every Android-sourced survey

- **Artifact:** A2 · `reference/extracted/bindata/114_1t4641s0.bin` (10 anims, 2,261 lines)
- **Quote (verbatim, with line numbers):**
  ```
     3:<anim i="spider_idle" d="1">
    24:<anim i="spider_walk" d="25" l="1">
   503:<anim i="spider_attackstart" d="7">
   614:<anim i="spider_attackend" d="10">
   745:<anim i="spider_lunge" d="9">
   909:<anim i="spider_death" d="26">
  1357:<anim i="spider_flinch" d="12">
  1566:<anim i="spider_descend" d="25" l="1">
  1755:<anim i="spider_dig" d="25" l="1">
  2106:<anim i="spider_death2" d="9">
  ```
- **It is engine-known in v0.717**, not orphan art —
  `reference/decompiled/shs3_payload/scripts/§1t1544s0§.as:480-498` (the web
  build's obfuscated `MCSActor`) declares every pose constant, sitting between
  the `guardian_*` and `gob_*` blocks:
  ```as3
  internal static var §1t10731s0§:String = "spider_idle";
  internal static var §1t10733s0§:String = "spider_walk";
  ...
  internal static var §1t10747s0§:String = "spider_descend";
  internal static var §1t10749s0§:String = "spider_dig";
  ```
- **It is absent from the entire Android corpus.** Measured, all three empty:
  `grep -i spider reference/extracted/npcdata.xml` → 0 ·
  `docs/gauntlet/L0/index/strings.json` values containing "pider" → 0 ·
  `grep -rn -i spider reference/decompiled/shs3_android_payload/scripts/*.as` → 0.
  No Android animation blob carries a spider set (md5 sweep, A4 below).
- **Ledger sentence:** §4 enemies-ai — *"**Ready:** full taxonomy
  (Humans/Undead/Oni/Animals + Tengu/Guardian) with movesets incl. **the archer**
  (closed this pass)"*.
- **What is new here.** The blob's existence is already catalogued
  (`docs/gauntlet/L0/journal.md:26` lists "spider_idle" among the 19 web sets).
  What nobody has said is that it is **web-only**, and that therefore the
  Android npcdata — which is the *only* npcdata we hold (A1) — carries no spider
  NPC row, no stats, no AI id and no name. `spider_descend` and `spider_dig`
  (both looping) are two distinct entry behaviours (drop-in and burrow) that no
  other creature in the corpus has.
- **Verdict: HELD (overturns by omission, and localises a permanent hole).**

## A4 — The web build is an animation SUPERSET of the Android build: 487 vs 471, delta exactly 16

- **Artifact:** A3 · `<anim ` count over `reference/extracted/bindata/*.bin`
  (19 animdata blobs) vs `reference/extracted/android/*AnimationData.bin` (18 blobs)
- **Quote (measured this pass, per-blob for the web side):**
  ```
  100:20  101:7  102:51  103:25  104:13  105:8  106:21  107:20  108:158
  109:8  110:21  111:17  112:16  113:26  114:10  115:16  116:21  117:8  118:21
  WEB TOTAL 487        ANDROID TOTAL 471
  ```
- **The 16-animation delta, itemised** (md5 sweep + per-blob name diff):

  | web blob | android counterpart | web-only animations |
  |---|---|---|
  | `114_1t4641s0.bin` | **none** | the 10 `spider_*` (A3) |
  | `100_1t4627s0.bin` | `91_MCSCharacter_OgreAnimationData.bin` | `ogre_swingdownend` (:1325, d=11), `ogre_stompend` (:2400, d=9) |
  | `111_1t4638s0.bin` | `102_MCSCharacter_GuardianAnimationData.bin` | `guardian_swingdownend` (:1316, d=11) |
  | `113_1t4640s0.bin` | `104_MCSCharacter_HumanSpearAnimationData.bin` | `spear_relax2` (:3712, d=1), `spear_relax3` (:3734, d=1), `spear_flourish` (:3930, d=33) |

  10 + 2 + 1 + 3 = **16**. Android-only animations: **zero**.
- **What this reconciles.** `bindata.md` C17 measured **487**; Stage-0b S0-4
  measured **471** over the 18 Android blobs. Both are right and nobody had
  reconciled them. The difference is not a counting error — it is content the
  Android port dropped.
- **Methodological consequence, and it is the load-bearing one:** *absence in the
  Android build does not prove absence in the shipped game.* Every "X does not
  exist" claim in this corpus that rests on an Android grep is, at best,
  provisional.
- **Verdict: HELD (reconciles two banked counts; new).**

## A5 — Boss attack timing was RE-CUT between builds. The telegraph/active/recovery triad is a WEB fact only.

- **Artifact:** A2 · `reference/extracted/bindata/100_1t4627s0.bin` and
  `111_1t4638s0.bin` vs `reference/extracted/android/91_MCSCharacter_OgreAnimationData.bin`
  and `102_MCSCharacter_GuardianAnimationData.bin`
- **Quote (verbatim lines, both sides):**
  ```
  web  100_1t4627s0.bin:901   <anim i="ogre_swingdown" d="16">
  web  100_1t4627s0.bin:1223  <anim i="ogre_swingdownhit" d="5">
  web  100_1t4627s0.bin:1325  <anim i="ogre_swingdownend" d="11">
  andr 91_MCSCharacter_OgreAnimationData.bin:901   <anim i="ogre_swingdown" d="14">
  andr 91_MCSCharacter_OgreAnimationData.bin:1183  <anim i="ogre_swingdownhit" d="18">
  (no ogre_swingdownend in the Android blob)

  web  111_1t4638s0.bin:1174  <anim i="guardian_swingdownhit" d="7">
  web  111_1t4638s0.bin:1316  <anim i="guardian_swingdownend" d="11">
  andr 102_MCSCharacter_GuardianAnimationData.bin:1174 <anim i="guardian_swingdownhit" d="18">
  ```
- **Complete divergence table** (durations, ticks at 24 Hz per `bindata.md` C3):

  | animation | web v0.717 | android v0.682 |
  |---|---:|---:|
  | `ogre_swingdown` | 16 | 14 |
  | `ogre_swingdownhit` | **5** | **18** |
  | `ogre_swingup` | 13 | 11 |
  | `ogre_swinguphit` | 5 | 7 |
  | `ogre_stomp` | 10 | 9 |
  | `ogre_stomphit` | **4** | **14** |
  | `guardian_swingdownhit` | **7** | **18** |

  The `skills` blob (51 anims) and the `spear` blob show **zero** duration
  divergence — so this is a deliberate re-cut of the two boss movesets, not
  global drift. The pattern is consistent: the Android build has **no separate
  recovery clip** and carries the recovery inside a long `*hit` clip; the web
  build splits it into a short active window plus an authored `*end`.
- **Ledger sentence:** §4 enemies-ai blocker ③ — *"telegraph/active/recovery +
  stagger frames."*
- **Consequence:** `bindata.md` C12 closed this blocker with the **web** numbers
  (0.67 s telegraph / 0.21 s active / 0.46 s recovery) and is correct. But the
  Android build — which is the only source for ten of thirteen data roots (A1)
  and the only readable AS3 — says 0.58 / **0.75** / none. Anyone reading boss
  timing off the Android side gets an active window **3.6× too long**. Flagging
  this because the corpus routinely treats the Android bundle as the readable
  stand-in for the web one.
- **Verdict: HELD (new; sharpens a banked close into a build-scoped one).**

## A6 — `123_Mobile_BGData` is a 49-background parallax spec: 874 authored layer instances across 5 depth planes

- **Artifact:** A2 · `reference/extracted/android/123_Mobile_BGData.bin` (623 lines, root `<bgdata>`)
- **Quote (the first record, verbatim, lines 4-13):**
  ```
   4:	<bg>
   5:		<id>0</id>
   6:		<name>BG_Forest</name>
   7:		<ffcount>2</ffcount>
   8:		<fcount>7</fcount>
   9:		<ppcount>19</ppcount>
  10:		<gcount>2</gcount>
  11:		<fgcount>4</fgcount>
  12:		<ffwrap>1670</ffwrap>
  13:	</bg>
  ```
- **Measured over all 49 records:** farthest 147 · far 211 · player-plane 311 ·
  ground 92 · foreground 113 = **874 authored layer instances**. Ids run 0–54
  with six unused slots (4, 19, 23, 24, 25, 43). Per-background overrides present:
  `ffwrap` (6 rows: 1640/1670/1750/1770/2000/2000), `ffscroll` (14 rows,
  0.05–0.27), `fscroll` (16 rows, 0.1–1.0), `contentwidth` (17 rows, 800–5000),
  `wrap` (17 rows, all `0`).
- **The 49 names are the world's location vocabulary**, and they match the 49
  `BG_*` symbols exported by the decrypted `120_Mobile_BGResource` one-for-one —
  e.g. `BG_Forest`, `BG_Mountain`, `BG_Battlefield`, `BG_PadiField`,
  `BG_TempleRuins`, `BG_Waterfall`, `BG_Dojo/2/3`, `BG_Mine`, `BG_CaveLava`,
  `BG_Jinmaku`/`JinmakuNight`/`JinmakuOutside`/`JinmakuNightOutside`,
  `BG_NinjaVillage`, `BG_AncientRuins`, `BG_Graveyard`, `BG_BanditHideout`,
  `BG_GamblingDen`, `BG_Inn`, `BG_Kitchen`, `BG_CastleHallway/Room/Walkway/Walls/WallsInner`.
- **Ledger:** no system ledger mentions backgrounds, parallax or layer counts.
  The nearest text, §4 art-anim *"Ready (strongest slice)"*, lists only fighter
  motion and palette; §4 world-exploration lists *"node-based room graph +
  signposts"*.
- **Verdict: HELD (overturns by omission).** Widest content: `BG_NinjaVillage`
  at `contentwidth` 5000 — 6.25 screens at the 800-wide stage.

## A7 — The parallax + depth-of-field contract, complete, with defaults

- **Artifact:** A2 · `reference/decompiled/shs3_android_payload/scripts/XMLBG.as:10-58`
- **Quote (verbatim field defaults):**
  ```as3
  internal var groundY:int = 400;
  internal var flatGround:Boolean = true;
  internal var contentWidth:int = 1600;
  internal var wrapAround:Boolean = true;
  ...
  internal var farthestLayerWrap:int = 1600;   (same for far / playerPlane / ground / foreground)
  internal var farthestLayerBlur:int = 8;
  internal var farLayerBlur:int = 4;
  internal var playerPlaneLayerBlur:int = 0;
  internal var groundLayerBlur:int = 4;
  internal var foregroundLayerBlur:int = 8;
  internal var farthestLayerScroll:Number = 0.25;
  internal var farLayerScroll:Number = 0.3333333333333333;
  internal var playerPlaneLayerScroll:Number = 0.5;
  internal var groundLayerScroll:Number = 1;
  internal var foregroundLayerScroll:Number = 2;
  ```
- **Two things fall out that the banked work does not have.**
  (a) The **blur ladder is symmetric about the player plane**: 8 / 4 / **0** / 4 / 8.
  It is a true depth-of-field with the focal plane on the fighter, not a
  monotone haze — the *foreground* is blurred as hard as the farthest layer.
  (b) The **scroll ladder** is 0.25 / 0.333 / 0.5 / 1 / 2, i.e. the foreground
  moves at **twice** camera speed.
  `groundY = 400` is the authored standing line, and `contentWidth = 1600` is
  the default room width (two 800-px screens).
- **Banked claim strengthened:** `art-anim-audio-feel/depth-of-field-blur` —
  *"parallax layers need per-layer BlurFilter (observed constants 4 and 8)"*.
  It read the call sites in `BG_Loader.as` and inferred two constants; the
  declaration site gives all five, their plane assignment, and the scroll ladder
  the same layers use.
- **Verdict: HELD (strengthens a banked claim with the full table).**

## A8 — A1: a FOREGROUND layer occludes the fighters. The 5-plane model is visible in a frame.

- **Artifact:** A1 · `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png`
- **Crop used:** `(900,560)-(1180,960)` of the 1920×1080 PNG, upscaled ×3 NEAREST
  (280×400 → 840×1200). Second crop `(760,780)-(1240,1010)` ×3 for the leg line.
- **What is visibly in it:** the tan-clad fighter is drawn *behind* a band of
  sharply-outlined green grass blades that crosses the lower ~25 % of the crop.
  The grass overlaps and hides both fighters' lower legs — it is painted over
  them, not behind them. The blades carry the same hard black outline as the
  fighters (they are not the blurred far layer), and the dark rock forms behind
  the fighter are soft-edged.
- **What it grounds:** `fgcount` in A6 and `foregroundLayerScroll = 2` in A7.
  `BG_Forest` (`123_Mobile_BGData.bin:11`) declares `<fgcount>4</fgcount>`, and
  a foreground plane that occludes the actor is exactly what a `fgcount` layer
  is for. A recreation that draws all scenery behind the fighter loses this.
- **Honest limits.** I did **not** confirm `groundY = 400` from this frame. The
  fighter is in the combat crouch and his feet are occluded by the very layer
  this claim is about, so the standing line is not readable here; the visible
  head-to-occlusion span is ~687 → ~880 px. Anyone wanting `groundY` in frame
  coordinates needs an un-occluded stance. **STILL_UNHELD** for that number
  from this frame.
- **Verdict: PARTIAL.**

## A9 — The item / accessory / skill ICON ART IS HELD. I retire a banked STILL_UNHELD.

- **Artifact:** A2 · `reference/extracted/android/115_Mobile_SHS3Resource.bin`
  (654,169 B; decrypts with the game's own `ResourceManager.decryptByteArray`
  at key `'h'`=104 → `CWS` v17, declared 1,040,857 B, zlib body inflates to
  1,040,849 B) — **1,912 exported symbols**.
- **Measured symbol families** (`SymbolClass`/`ExportAssets` names, grouped by
  alpha prefix):
  ```
  torso 151 · uparm 151 · lowarm 151 · pelvic 151 · stomach 151
  item 112 · weapon 109 · hat 96 · calf 85 · crotch 85 · thigh 85
  skill 79 · hair 73 · prop 60 · mask 59 · foot 44 · foottop 44
  head 38 · hand 33 · neck 33 · acc 8 · achievement 5 · (animal + horse rigs)
  ```
- **Cross-checked against `111_Mobile_ItemData.bin`** (itemdata has no `<art>`
  tag anywhere, so art id = item id):

  | band | itemdata rows | rows with a matching symbol |
  |---|---:|---:|
  | 2000–2999 consumables (`item####`) | 99 | **94** |
  | 3000–3999 accessories (`acc####`) | 9 | **8** |
  | 20000–29999 quest items (`item####`) | 79 | **67** |

  Residual, named exactly: consumable arts **2000, 2001, 2500, 2502, 2503**;
  accessory art **3007**; 12 quest-item arts. Everything else is on disk.
- **Banked claim contradicted:** `items-equipment/icon-symbol-families-still-unheld`
  (verdict STILL_UNHELD) — *"an item icon art set (~187 of ~983 roster rows, plus
  every accessory) remains unrecovered and ledger blocker (5)'s icon half is
  still open"* — and `items-equipment/icon-only-symbol-families-still-open`
  (PARTIAL) — *"only the fallback item0 survives in the web payload, with zero
  acc classes."*
- **Why they were wrong, and it is not their fault:** both reasoned from the
  **web** payload's exported class list, where only `item0.as` survives. The art
  is not in the web payload at all — the web client streamed `shs3resource.swf`
  from the server (`ResourceManager.as:41,82`). It is in the Android build,
  embedded, and it decrypts.
- **Ledger sentence:** §4 items-equipment blocker ⑤ — *"**sprite-compositing
  contract** (layer order, per-slot body render — a from-scratch-art blocker) +
  item **icon manifest**."*
- **Verdict: HELD (contradicts two banked claims).** ~169 of the ~187
  "unrecovered" icon rows are held, plus **79 `skill####` symbols** — the skill
  icon set, which the ledger's ui-hud block never lists at all.
  **Caveat I insist on:** I enumerated *names*, not pixels. No shape was decoded.

## A10 — The 66 dialogue portraits and 16 story cards are decrypted and enumerated — and questdata has a DEAD portrait reference

- **Artifact:** A2 · `reference/extracted/android/124_Mobile_ImageResource.bin`
  (1,734,935 B; key `'m'`=109 → `CWS` v17, 1,908,237 B declared, inflates to
  1,908,229 B) — 85 exported symbols.
- **Measured:** **66** `portrait_*` symbols and **16** story cards
  (`image_episode0` … `image_episode12`, `image_exposition`,
  `image_exposition_epilogue`, `image_epilogue`).
- **Cross-checked against the banked 52-portrait manifest**
  (`questdata/portrait-count-correction`, the distinct `<dialogue><img>` set):
  **51 of 52 are present.** The one absent is **`chikako_maked`** — and the
  shipped art is `portrait_chikako_mask`. `chikako_maked` is an authoring typo
  in `questdata`; at runtime `ResourceManager.getPortrait("chikako_maked")`
  resolves to nothing. That is a shipped dead reference, not a missing asset.
- **15 portraits ship that questdata never references**, and 12 of them are a
  clean set: `{blue,green,red,yellow} × {sergeant,captain,general}` — the
  **clan-officer portrait grid**, i.e. meta-social / War-Room art. Plus
  `ladyoiwa_snake2`, `takamori_masked`, `takamori_standmask`.
- **Banked claim strengthened:** `quests-story/portraits-held-but-encrypted`
  (HELD) — the "encrypted" half is now discharged and the manifest is exact.
- **Verdict: HELD (strengthens a banked claim; adds a new defect).**

## A11 — All thirteen episode splash cards SHIPPED. §3.8's "Ep4–12 were likely never shipped" dies a second time, in art.

- **Artifact:** A2 · `reference/extracted/android/124_Mobile_ImageResource.bin`,
  decrypted symbol list
- **Quote (verbatim symbol names):**
  ```
  image_episode0  image_episode1  image_episode2  image_episode3  image_episode4
  image_episode5  image_episode6  image_episode7  image_episode8  image_episode9
  image_episode10 image_episode11 image_episode12
  image_exposition  image_exposition_epilogue  image_epilogue
  ```
- **Ledger sentence:** §3.8 — *"**Season 1 is Prologue + 12 episodes + epilogue =
  14 chapters**, not 4. Only Prologue–Ep3 are documented/reachable; **Ep4–12 were
  likely never shipped.** **Scope decision:** faithful campaign = Prologue–Ep3,
  with Ep4–12 labeled canonical-but-unshipped."*
- **Why this is worth saying again.** The staleness banner already killed this
  with `questdata.xml`'s 61 quests. But "the quest rows exist" is a weaker
  refutation than "the *bespoke full-screen splash art* for every one of episodes
  4 through 12 was drawn, exported and shipped in the binary." Nobody authors and
  ships 13 chapter cards for 4 chapters. The §3.8 **scope decision** — the one
  line in this document that tells a builder what to cut — is built on a
  falsehood and must be withdrawn, not merely footnoted.
- **Verdict: HELD (overturns).**

## A12 — `119_Mobile_MapData` is empty, and there is no web copy to blame. Half of a banked STILL_UNHELD closes.

- **Artifact:** A2 · `reference/extracted/android/119_Mobile_MapData.bin` (65 bytes)
- **Quote (the entire file):**
  ```
  <?xml version="1.0" encoding="utf-8"?>
  <mapdata>

  </mapdata>
  ```
- **Banked claim:** `world-exploration/mapdata-blob-empty` (STILL_UNHELD) —
  *"possible Android-only stripping, possible dead subsystem. Whether the web
  v0.717 build shipped a populated mapdata is not established."*
- **What A1 settles:** the web payload contains **zero** `<mapdata>` roots — not
  an empty one, none at all. So "Android-only stripping of content the web client
  carried" is ruled out for the *client*: no web client copy exists, populated or
  otherwise. What remains open is whether the web build fetched a populated
  mapdata from the dead server (`ResourceManager.loadResource` → `getresource.php`
  / Player.IO), which no artifact we hold can answer.
- **Verdict: PARTIAL.** The client-side hypothesis is dead; the server-side one
  is permanently unresolvable.

## A13 — `<comp>rand</comp>` is the random-encounter primitive, and the one authored use is a 50 % roll

- **Artifact:** A2 · `reference/extracted/android/112_Mobile_NodeData.bin:117-118`
- **Quote (verbatim, the `aggro2` object in node 8394753 / "W Kasuta Forest" chain):**
  ```
  117:				<property>1,3,<xml><wave><enemy><id>1</id><qty>3</qty></enemy><enemy><id>3</id><qty>2</qty></enemy></wave></xml></property>
  118:				<condition><has><id>100</id><qty>50</qty><comp>rand</comp></has></condition>
  ```
- **The decoder,** `reference/decompiled/shs3_android_payload/scripts/StatsManager.as:4222-4225`:
  ```as3
  if(comparison == "rand")
  {
     return Math.random() * id <= val;
  }
  ```
  So `id=100, qty=50` is `Math.random()*100 <= 50` — a **50 % spawn probability**.
  `id` is the denominator, `qty` the threshold; the condition system's default
  comparison is `"gte"` (`StatsManager.as:4171-4177`).
- **Ledger sentence:** §4 enemies-ai blocker ④ — *"aggro/leash/**spawn
  geometry**."*
- **Verdict: PARTIAL.** This is spawn *probability*, not aggro radius or leash
  distance — neither of which appears in this blob. But it is the first
  authored encounter-rate number in the corpus, and the primitive generalises:
  any `<condition>` in nodedata/questdata/uidata can be made probabilistic.

## A14 — STILL_UNHELD: the five decrypted resource SWFs are enumerated but never RENDERED

- **Artifact:** STILL_UNHELD.
- Decrypting all five `CWS` blobs (keys `h`/`u`/`o`/`m`/`g` = 104/117/111/109/103,
  `ResourceManager.as:41` + `:200-216` + `Mobile.as:352`) yields:
  `115_Mobile_SHS3Resource` 3,756 tags (1,949 `DefineSprite`, 1,594 `DefineShape4`,
  127 `DefineShape`, 4 `DefineFont3`) · `120_Mobile_BGResource` 1,124 tags
  (552 sprites, 370 shapes) · `124_Mobile_ImageResource` 330 tags ·
  `113_Mobile_MusicResource` and `122_Mobile_SoundResource` 22 tags each.
- **Nothing in this survey opened a single `DefineShape` record.** Every art
  claim above (A9, A10, A11) is a claim about **exported symbol names and
  counts**, and about nothing else. No fill colour, no outline weight, no
  silhouette, no per-slot geometry is held by this survey. The ledger's
  §4 art-anim *"byte-exact HUD/result palette"* is untouched by me in both
  directions.
- **Verdict: STILL_UNHELD.** Stated so the volume above is not mistaken for
  having graded the art.

---

## Lane-impact summary

| Claim | Lane(s) | Direction |
|---|---|---|
| M0 encoding correction | method | corrects the kickoff |
| A1 web payload holds zero data roots | ALL 12 | **provenance** — the v0.682 caveat is irreducible for 10 roots |
| A2 parity proofs are circular | skills-meters, items-equipment, quests-story, enemies-ai | **contradicts a banked claim** |
| A3 spider is web-only | enemies-ai | **omission + permanent hole localised** |
| A4 web is an animation superset (487/471) | art-anim, enemies-ai | **reconciles two banked counts** |
| A5 boss timings re-cut across builds | enemies-ai, art-anim | **new** — blocker ③'s close is web-scoped |
| A6 BGData 49 backgrounds / 874 layers | art-anim, world-exploration | **omission** — no ledger mentions backgrounds |
| A7 parallax + DoF contract | art-anim | **strengthens** a banked claim |
| A8 foreground layer occludes fighters (frame) | art-anim | A1 corroboration; groundY STILL_UNHELD |
| A9 icon art is held | items-equipment, ui-hud | **contradicts two banked STILL_UNHELDs** |
| A10 66 portraits + dead `chikako_maked` ref | quests-story, ui-hud, meta-social | **strengthens** + new defect |
| A11 13 episode splash cards shipped | quests-story | **overturns §3.8's scope decision** |
| A12 mapdata has no web counterpart | world-exploration | closes half a banked STILL_UNHELD |
| A13 `comp=rand` = 50 % encounter roll | enemies-ai, world-exploration | under-claim (partial) |
| A14 nothing rendered | art-anim | **STILL_UNHELD**, stated |

## Standing caveats carried

- Every claim sourced from `reference/extracted/android/` or from
  `reference/decompiled/shs3_android_payload/` is **clientVersion 0.682**
  (`StatsManager.as:30`). Per A1 that caveat is **not dischargeable** for ten of
  the thirteen data roots, because the web build ships no counterpart. A2 removes
  a comparison the corpus believed had discharged it for four of them.
- A4 and A5 are the concrete cost of that caveat: the two builds differ in
  content (16 animations) and in tuning (7 boss durations), always with the web
  build as the richer and the later one. Where they differ, **v0.717 is the 1:1
  target**.
- A8 is the only A1 claim here, and it is deliberately narrow. Where I could not
  read a number off the frame (`groundY`), I said STILL_UNHELD rather than
  inferring it from the doc — no doc-vs-frame conflict arose in this unit.
- The decrypted resource SWFs live only in a scratch directory outside the repo.
  Nothing in `reference/`, `src/`, `tests/` or `docs/` was modified by this pass
  except this file.
