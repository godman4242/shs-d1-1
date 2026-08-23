# Blind cite-lens review — packet `t2-corroborating-02` (s27c)

**Packet size 14 · judged 14 · skipped 0 · refuted 1 · new findings 4**

Structured verdicts: `docs/gauntlet/L0/critics/t2-corroborating-02.cite.s27c.json` (written first).

Every verdict below rests on an artifact I opened myself. I did not read any
`critics/*.md` or `sources/*.md`.

---

## Headline

Thirteen of fourteen survive. This is an unusually clean packet: the four `QUOTE_UNVERIFIED`
flags from citelint were all false alarms caused by the `§1tNNNNs0§` glyphs and by quote
fields that splice two files together with a `||` or `·` joiner. I located every quoted
line verbatim at the stated number.

The one refutation is **`ui-hud/string-960-is-absent-from-android-because-the-android-label-is-a-portrait-rollover`**,
and it is refuted by the packet's own siblings plus a frame.

Two findings I re-derived from scratch rather than trusting:
the **resource decrypt keys** (I decrypted all five blobs) and the **third-bar fill fraction**
(I re-ran the pixel scan). Both held.

---

## The refutation

### `ui-hud/string-960-is-absent-from-android-because-the-android-label-is-a-portrait-rollover` — REFUTED (material)

Four things are wrong with it, and the true parts are all carried by other findings in the
same packet.

**1. "The web build REPLACED that hover affordance" is false.** The web build keeps it, verbatim:

```
§1t113s0§.as:241  this.§1t5158s0§.addEventListener(MouseEvent.MOUSE_OVER,this.§1t5215s0§);
§1t113s0§.as:242  this.§1t5158s0§.addEventListener(MouseEvent.MOUSE_OUT,this.§1t5216s0§);
§1t113s0§.as:542     this.§1t5161s0§.visible = true;     // §1t5215s0§ body
§1t113s0§.as:548     this.§1t5161s0§.visible = false;    // §1t5216s0§ body
```

That is the exact android shape (`BattleUI.as:192-193` → `:430-440`). The packet's own
`ui-hud/the-change-stance-affordance-IS-the-portrait-bust-not-a-separate-button` says so
correctly. The two contradict each other and this is the wrong half.

**2. THE FRAME WINS, and it agrees with the code.** I cropped
`reference/frames/session11/stance-reach/B_t851.867_LIGHT_ring_blue_CHANGE-STANCE_tooltip.png`
at `(0,756)-(1056,1080)` ×2 LANCZOS and looked. A v0.717 duel HUD: portrait bust with a
**blue** stance ring, and the words **CHANGE STANCE** rendered directly under it. The hover
tooltip is live in the web build. There is no version of this claim that survives that frame.

**3. The "because" conflates two different strings.** The rollover label is `getString(208)`.
`strings.json["208"]` resolves to **"Change Stance"** — it is *present* in the v0.682 table.
String 960 is a different string on a different widget. So 960's absence cannot be *because*
the android label is a rollover.

**4. The lane_impact is actively harmful.** "build the WEB behaviour … not the android hover
tooltip" would delete a widget the web build ships and a v0.717 frame shows.

What survives — android `:262` is the entire reload-bar text logic; android has no
empty-state bar label; `strings.json` has no key `"960"`; the web rescales `(reload-48)/(max-48)`
while android passes a pre-normalised percentage — is already carried correctly by
`ui-hud/the-grey-cannot-change-stance-label-is-a-v0717-web-only-addition`, which gives the
*right* reason: android's `updateReload` has no `ratio==0` branch, so no code path could
ever request 960.

---

## The two I re-derived rather than trusted

### `nf-judge/resource-decrypt-key-is-filename-charcode-1-per-resource` — HELD, strongest in the packet

`ResourceManager.as:186` reads `ba = decryptByteArray(ba,resourceFileNameArray[num].charCodeAt(1));`
and `:41` lists the five filenames. I implemented `:205-213` (i = 3..255, swap `ba[i]`↔`ba[i+256]`
when `i % 11 == 0`, then `ba[i] ^= key`) and ran it on all five blobs:

| blob | key | result |
|---|---|---|
| `115_Mobile_SHS3Resource.bin` | `'h'` = 104 | CWS v17, **1,040,849** inflated, **1,912** SymbolClass entries |
| `113_Mobile_MusicResource.bin` | `'u'` = 117 | CWS v17, 1,402,677, 13 |
| `122_Mobile_SoundResource.bin` | `'o'` = 111 | CWS v17, 29,623, 13 — matches **C3** |
| `124_Mobile_ImageResource.bin` | `'m'` = 109 | CWS v17, 1,908,229, 85 — matches **C1** |
| `120_Mobile_BGResource.bin` | `'g'` = 103 | CWS v17, 4,412,340, 67 |

The finding's own numbers for 115 reproduce exactly. Its "that's why the files still begin
with a readable CWS magic" is also right and testable: bytes 0–2 are outside the loop, and
byte 3 of 115 is `0x79`, which XORs with 104 to exactly **17** — the SWF version. Five for five.

### `ui-hud/measured-third-bar-fill-in-t1082-is-23-percent-not-28` — HELD

My own run-length scan of `reference/frames/session11/crit-focus/t1082.100.png` at `y=1035`:
anti-aliased edge at `x=245 (201,203,200)`, saturated white `x=246..303`, edge at
`x=304 (213,207,195)`, brown track to `x=513`, `(19,12,7)` at 514, `(1,1,1)` at 520. Fill
60 px over a 269 px track = **22.3%**. "About 28%" is wrong; "23 percent" is right. The
finding's own samples reproduce (it reports `(46,29,0)` through x=510; I read `(46,28,3)` at
505 and `(44,28,3)` at 510, and `(1,1,1)` at 520 exactly).

Trivial slip it carries: it writes `60/270 = 22.6%`. That is 22.2%. Doesn't touch the headline.

---

## The rest, briefly

- **`nf-judge/duel-hud-never-prints-the-word-CHI`** — HELD. I opened both frames.
  `frame_0020.jpg` (which is **1024×576**, not 1080p) cropped `(0,380)-(560,576)` ×3: green
  `16/20`, blue `15/15`, grey `CANNOT CHANGE STANCE`, **no `CHI`, no `HP`**. The stats-screen
  frame cropped `(192,216)-(1056,810)` ×1.8: the labelled ladder as coloured diamonds
  **HP** (green) / **CHI** (blue) / **AP** (cyan). Code half verbatim at `BattleUI.as:254-256`.
- **`nf-judge/name-greps-…-are-not-evidence-of-absence`** — HELD (method rule). Both anchor
  pairs are exact: `§1t546s0§`/`getSellAmt` (same body, `itemID < 3000 → return 1`) and
  `§1t1140s0§`/`isNoChangeTown` (identical literals `1466699/1503572/1368424/1540387`).
  *Minor mis-cite:* it pairs web `:18-22` with android `Item.as:8-16`; the real twin block is
  web `:8-16`. Web `:18-22` has no android counterpart at all — which became new finding #2.
- **`nf-judge/resizehandler-statsmanager-writes-are-307-312`** — HELD, exact. `:306` is `}`;
  six writes at `:307-312`; a `:306-311` transcription drops `stageBaseHeight`.
- **`nf-judge/web-battleui-carries-the-same-slot-constants…`** — HELD, exact both sides.
- **`s27b/v0717-rebalanced-the-manual-stat-caps-upward-vs-v0682`** — HELD, and I closed its
  one open joint. It infers the web stat ids from order alone, so I checked the constants:
  `§1t9403s0§=1 · §1t9406s0§=4 · §1t9408s0§=6 · §1t9409s0§=7 · §1t9410s0§=8 · §1t9411s0§=10 · §1t9415s0§=14`
  are numerically identical to `STAT_MAXHP=1 · STAT_MAXCHI=4 · STAT_ATTACK=6 · STAT_DEFENSE=7 ·
  STAT_SPEED=8 · STAT_LEVEL=10 · STAT_MAXAP=14`. Pinned again by web `:3347
  this.statsPanel.HPadd.visible = _loc3_;` — `HPadd` survived obfuscation. Hard C2 counterexample.
- **`skills-meters/the-initplayer-argument-order-is-a-noncircular-web-android-bridge`** — HELD,
  and stronger than claimed. The web ctor `§1t99s0§.as:183` declares exactly fifteen ints and
  `:185-199` carry **five** unobfuscated anchors (`defense`, `minDamage`, `damageRange`,
  `slashUsage`, `level`), not one. And android `MCSPlayer.as:182` names the parameters outright:
  `initPlayer(controlledBy, hp, maxhp, chi, maxchi, defense, baseReload, minDamage, damageRange,
  baseSlashLength, slashUsage, lightMastery, balancedMastery, heavyMastery, level)`.
  *Minor:* the cite range `:188-201` is wrong at both ends; assignments run `:185-199`.
- **`skills-meters/the-web-build-seeds-stance-mastery-at-1-too`** — HELD on its load-bearing
  claim: `§1t1523s0§.as:2586-2592` pushes the seven skill stats at 1, a line-for-line twin of
  `StatsManager.as:740-746`. *Flagged, not sunk:* the parenthetical "(Light ×0.54, Balanced
  ×1.02)" mislabels a stance — ×0.54 is **Heavy**. That became new finding #1.
- **`ui-hud/battleui-obfuscation-map-extension-eight-more-fields`** — HELD. I checked all eight
  against both files; the empty-bodied `setReloadMax` pair (`:308-310` == `:241-243`) is a
  particularly distinctive signature.
- **`ui-hud/the-change-stance-affordance-IS-the-portrait-bust-not-a-separate-button`** and
  **`ui-hud/the-change-stance-button-is-the-portrait-bust-itself`** — both HELD, all cites
  verbatim, and I confirmed the ring on film rather than second-hand (blue on the LIGHT frame,
  red on `frame_0020`). The `1=Light / 2=Balanced / 3=Heavy` mapping is nailed by android
  `MCSPlayer.as:3029/:3040/:3051`, which names the very cases the web calls
  `§1t5208s0§(1)/(2)/(3)` from.
- **`ui-hud/the-grey-cannot-change-stance-label-is-a-v0717-web-only-addition`** — HELD, and it
  is the correct explanation of string 960. I also watched the label render: the grey
  `CANNOT CHANGE STANCE` in my `frame_0020` crop is the `#BBBBBB` branch at `:111`/`:340`.
  *Minor omission:* the whole three-state block is gated at `:334` on
  `!§1t1540s0§.§1t9550s0§() && this.§1t5182s0§.visible`.

---

## New findings raised (4)

1. **`nf/web-stance-slash-length-formulas-and-the-light-mislabel`** (A2, both) — the stance
   reach formulas diverge on **three** axes, and "Light ×0.54" is really **Heavy** ×0.54.
   Web Light (`§1t99s0§.as:3094`) is a flat `×1.4` with **no mastery term at all**; android
   Light (`MCSPlayer.as:3030`) is `×1.5`. Balanced coefficient `0.2*0.1` web vs `0.5*0.01`
   android; Heavy `0.4*0.1` vs `0.5*0.01` — mastery buys 4–8× more reach in v0.717.
2. **`nf/web-item-carries-three-modifier-constants-android-lacks`** (A2, both) — web
   `§1t17s0§.as:18-22` adds modifier ids **206, 207, 208** with no android twin
   (`grep -nE "= *20[678];" Item.as` → zero hits). An android-derived modifier table is short by three.
3. **`nf/stance-ring-frame-index-is-not-a-bijection`** (A2, android) — `setStanceColor(2)` is
   called from **both** BALANCED and REVERSED (`:3048`, `:3074`), and `(3)` from **both** HEAVY
   and DUAL (`:3063`, `:3089`). Five stances, three ring frames — never infer stance from ring colour.
4. **`nf/third-hud-row-carries-an-unmapped-stance-name-textfield`** (A1, web v0.717) — the third
   HUD row renders a white **`LIGHT STANCE`** in `B_t851.867` while `CHANGE STANCE` is drawn
   separately at the bust. `§1t113s0§` can write only two htmlText values into `§1t5169s0§`
   (`:110-111`), and `§1t5161s0§` is already accounted for in that same frame — so a **fourth,
   unmapped TextField** occupies that row. The BattleUI field map is not yet complete.
