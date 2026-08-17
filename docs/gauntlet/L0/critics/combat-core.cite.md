# CITE-LENS REVIEW — unit: combat-core

**Reviewer stance:** blind critic. I did not see the surveyor's reasoning. I opened every
cited artifact myself. Every verdict below carries the artifact **I** opened.

---

## HEADLINE

**The surveyor read the wrong build and never checked.** Its own STILL_UNHELD claim
(`combat-core/build-version-parity`) asserts that the web v0.717 payload "is obfuscated …
and cannot be cross-read." **That is false, and it is the single error that generates every
other failure in this lane.**

- `reference/decompiled/shs3_payload/scripts/` contains **1,079 `.as` files** (652 directory
  entries). Only the *identifiers* are mangled (`§1t99s0§`); the bodies are plain, readable
  AS3. `find reference/decompiled/shs3_payload -name "*.as" | wc -l` → `1079`.
- The surveyor's cite `…/scripts/§1t51s0§/, 5 files` describes a directory. `§1t51s0§.as`
  is a **file**. The cite does not resolve.
- The repo *already* contains `docs/research/fidelity/SOURCE_CONSTANTS.md`, whose header
  reads: *"Status: CRACKED AND MINED (2026-07-25) … **Build identified as v0.717 — the same
  build our video measurements came from.** 189 constants extracted."*

I cross-read the web build in about ten minutes. `§1t99s0§.as` is the v0.717 `MCSPlayer`
(`public class §1t99s0§ extends §1t68s0§`, line 6; `standingRange:int = 50` at :9). Its
combat constants **differ from the android v0.682 ones the surveyor cited**, and where they
differ, **the repo's live config was already right and the surveyor calls it wrong.**

| quantity | android v0.682 (surveyor) | **web v0.717 (I opened it)** | `src/config` |
|---|---|---|---|
| light reach mult | `× 1.5` | **`× 1.4`** `§1t99s0§.as:3094` | 1.4 ✅ |
| balanced reach/mastery | `1 + 0.005·m` | **`1 + 0.2·m·0.1` = `1 + 0.02·m`** `:3105` | 0.02 ✅ |
| heavy reach/mastery | `0.5 + 0.005·m` | **`0.5 + 0.4·m·0.1` = `0.5 + 0.04·m`** `:3116` | 0.04 ✅ |
| crit multiplier | `1.5` light / `1.2` other | **flat `× 1.3` + STAT_CRITICALDMG** `:3274` | — |
| heavy damage mult | `× 1.5` | **`× 1.4`** `:3270` | — |
| maxreload (Focus) | `5 × 24` = 120 | **`8 × 24` = 192** `:249` | — |
| bar display mapping | `(r − 24)/(max − 24)` | **`(r − 48)/(max − 48)`** `§1t113s0§.as:328` | — |
| stance-switch gate | `reload < maxreload/6` | **`reload < 48`** `:3058-3060` | — |
| stance-switch tax | `>½ → max/3` else `−max/6` | **flat `reload −= 48`** `:3162` | — |

Verbatim, web build, `reference/decompiled/shs3_payload/scripts/§1t99s0§.as`:

```
3094:               this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3105:               this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3116:               this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
3274:            return _loc2_ * 1.3 + this.§1t1243s0§;
 249:         this.§1t4415s0§ = 8 * 24;
3059:         if(this.§1t4414s0§ < 48)   // nextStance early return
3162:            this.§1t4414s0§ -= 48;  // stance-switch cost
```

**Consequence:** the surveyor's `reach-stance-mults` claim would have "fixed" three
**correct** constants in `src/config/reach.ts` into wrong ones, and its `crit-multiplier`
claim discards **`1.3` — which is the right answer for the target build** — as "wrong."
Those are the two most damaging possible outcomes in this lane.

---

## WHAT SURVIVED — and it is a lot

Ten claims held up completely under my own reading, and I **parity-confirmed** most of them
against the web build, which the surveyor could not do because it believed the web build
unreadable. These can be promoted from `CONTRACT-SRC-v0.682` to plain **CONTRACT**:

| held claim | android cite I re-opened | web-build parity cite |
|---|---|---|
| reach base formula | `StatsManager.as:1915-1919` ✓ verbatim | `§1t1523s0§.as:2346-2347` — identical |
| arc-length budget | `InputManager.as:51-59, 198, 360-367` ✓ | `§1t1541s0§.as:51` `maxDistance = 200` |
| multi-target, full dmg, ≤1 hit/enemy | `NPCManager.as:1204-1295` ✓ verbatim | `§1t1543s0§.as:1486` `< 40000` filter |
| hit resolves instantly in `endSlash` | only call sites are `MCSPlayer.as:2796/2800/2809/2813` ✓ | — |
| pass-through dash 50/40/30, standingRange 50 | `MCSPlayer.as:9,15,17,19,2408,2476,2676-2705` ✓ | `§1t99s0§.as:9,15,17,19` — identical |
| gesture classifier (4 pts / 20 units / 25 dead-zone) | `InputManager.as:53,55,268`; `MCSPlayer.as:2260-2273, 2275-2285, 2298-2308` ✓ all exact | `§1t99s0§.as:2377` `< 625` |
| nine-way slash-type map | `MCSPlayer.as:37-53, 2403-2456, :11` ✓ exact | — |
| four-band damage floor + part rules | `NPC.as:301-320, 386-462`; `Damage.as:150-172` ✓ verbatim | `§1t67s0§.as:197-209` — identical |
| heavy defence `× 0.8` | `MCSPlayer.as:3231` ✓ | `§1t99s0§.as:3286-3288` — identical |
| mastery unlock ladder 3/4/5 | `MCSPlayer.as:3164-3194` ✓ exact | `§1t99s0§.as:3223-3241` — identical |

The `gesture-classifier` and `150pct-damage` line-number cites are the most precise I
checked all lane: `MCSPlayer.as:2260-2273`, `:2275-2285`, `:2298-2308` are exact to the
brace. Credit where due.

---

## FRAMES — I opened them and measured them myself

### `reference/frames/session11/gap-focus-trigger/m_nearfull.png` (1800×780)
Viewed whole at 50 %, then crop **(700,40)-(1620,310) upscaled 2×**.
**Visible:** two stacked panels of the same HUD. Portrait ring; **green HP `11/20`**;
**blue Chi `47/47`**; a **third white bar on a brown track**; gold **`150% DAMAGE`** below.
Lower panel: the third bar carries **`CRITICAL HIT`** printed across it.

Pixel measurement (mine): Chi track (full at 47/47) spans **x 735…1539**.
Upper white bar **x 737…1525 = 98.3 %**. Lower white bar **x 737…1540 = 100.1 %**, with the
`CRITICAL HIT` glyphs interrupting the white run at x 972…1304. HP and Chi are byte-identical
between panels. **The surveyor's read of this frame is correct** (it said ~97 % / 100 %).

### `reference/frames/session11/crit-focus/t1003.000.png` (1920×1080)
Crop **(0,910)-(620,1080) upscaled 2×** — the exact crop the surveyor states.
**Visible:** red portrait ring with straw hat, **HP `14/20` green**, **Chi `31/31` blue**,
third bar reading **`CANNOT CHANGE STANCE`**, and **`150% DAMAGE`** in gold beneath.
Track x 245…513; green right edge **x ≈ 433 = 70.1 %** vs HP 14/20 = 70 %. The bar-as-ruler
calibration is sound.

### Fill-rate frames — the pixels are right, the conclusion is not
My own measurement, track 245…513 (268 px), bar row y = 1036-1038:

| frame | white right edge (mine) | surveyor | % of track |
|---|---|---|---|
| t1004.800 | **281** | 281 | 13.4 % |
| t1005.000 | **290** | 290 | 16.8 % |
| t1082.100 | **303** | 304 | 21.6 % |
| t1082.900 | **340** | 340 | 35.4 % |
| t3779.000 | **370** | 370 | 46.6 % |
| t1003.000 | *no bar* | — | 0 % (matches `CANNOT CHANGE STANCE`) |

Rates **17.0 %/s** and **17.3 %/s** ⇒ **≈ 5.8 s** empty→full. The measurements are accurate.

**But there is no doc-vs-frame conflict here at all.** The web source predicts
`(192 − 48) = 144` displayed frames ÷ 24 fps = **6.000 s = 16.67 %/s** — within ~3 % of my
measurement, i.e. inside timestamp-and-edge error. The surveyor invoked the STANDING
INVARIANT ("the frame wins") against a **prediction it built from the wrong build**. The
frame and the *correct* source agree. `SOURCE_CONSTANTS.md` §3.2 already recorded this:
*"measured fill 5.97 s vs source 6.000 s — a 0.5 % match."* **Build 6.000 s (CONTRACT-SRC),
not 5.8 s (frame estimate).**

---

## NEW FINDINGS THE SURVEYOR MISSED

1. **`baseReload` is a write-only dead field in v0.682.** `getBaseReload() = 48 + SPD·6`
   (`StatsManager.as:1841`) is stored at `MCSPlayer.as:190` and **never read anywhere**:
   `grep -rni "basereload" reference/decompiled/shs3_android/scripts/ | grep -v "var baseReload\|this.baseReload = \|baseReload:int"` returns **nothing**. The surveyor's
   `crit-gating` lane_impact calls it "refill 48 + SPD·6" — it is not the refill; the refill
   is a flat `++reload` per frame (`MCSPlayer.as:1160`), SPD-independent.
2. **The web stance-switch gate grounds the `CANNOT CHANGE STANCE` frame exactly.**
   `§1t99s0§.as:3059` `if(this.§1t4414s0§ < 48) return;` — 48 is precisely the hidden display
   offset, so the rule is literally *"you cannot switch while the visible bar reads zero."*
   That is what `t1003.000.png` shows. The surveyor attached this frame to the android
   `maxreload/6` rule instead — and `CANNOT CHANGE STANCE` **does not exist in the android
   string table** (only id 208 `Change Stance`), so that linkage was ungrounded.
3. **Web damage stance curves are the exact permutation of the web reach curves** —
   light `0.5 + 0.04·m`, balanced `1 + 0.02·m`, heavy/dual/reversed flat `1.4`
   (`§1t99s0§.as:3262/3265/3270`). The permutation the repo documented is real; only the
   surveyor's *numbers* were from the wrong build.
4. **`InventoryUI.as:1940-1966` (android) independently corroborates the android reach
   multipliers** — `slashModifier` 1.5 / `1+0.5·m·0.01` / `0.5+0.5·m·0.01` and `defModifier`
   0.8. So the surveyor's "original-game display bug" story for the crit split is shakier
   than presented: in the android build the tooltip agrees with `setStance` on reach and
   defence and disagrees only on crit.

---

## VERDICT TABLE

| claim | verdict | severity |
|---|---|---|
| `build-version-parity` | **REFUTED** — web AS3 is readable (1,079 files); cite does not resolve; `SOURCE_CONSTANTS.md` already did the cross-read | **fatal** |
| `reach-stance-mults` | **REFUTED** — `src/config/reach.ts` 1.4 / 0.02 / 0.04 is **correct** for v0.717 | **fatal** |
| `crit-multiplier` | **REFUTED** — v0.717 crit is flat **× 1.3**, the ledger's own candidate | **fatal** |
| `crit-gating` | **REFUTED** — structure right; `5×24`, `maxreload/6`, "refill 48+SPD·6" all wrong | material |
| `damage-formula` | **REFUTED** — RNG roll right; stance curves are android-only | material |
| `crit-meter-fill-rate` | **REFUTED** — pixels right, but source and frame agree at 6.000 s; no invariant conflict | material |
| `reach-cap` | held (800×480 scale cite misattributed → `StatsManager.as:80/82`) | minor |
| `reach-is-arclength` | held (cite `:352-366` should be `:361-367`) | minor |
| `crit-meter-exists-in-web-build` | **held** — I saw it | — |
| `multi-target-full-damage` | **held** | — |
| `hit-registration-instant-at-endslash` | **held** — "only call sites" verified true | — |
| `pass-through-dash` | **held** + parity-confirmed | — |
| `gesture-classifier` | **held** — cites exact to the brace | — |
| `slash-type-map` | **held** | — |
| `mitigation-and-part-rule` | held ("top-most-first" is an inference from reverse-index iteration) | minor |
| `heavy-def-0.8` | **held** + parity-confirmed | — |
| `stance-triangle` | **held** | — |
| `early-ttk` | held ("every sampled lvl≤2 mob" rests on 2 quoted rows) | minor |
| `launch-unlock-levels` | **held** + parity-confirmed (`§1t99s0§.as:3223-3241`) | — |
| `150pct-damage-is-a-buff` | held (the stance-lock linkage in lane_impact was ungrounded — see New Finding 2) | minor |

**Score:** 78 is too high. The lane's genuine, parity-confirmed yield is real and large, but
three of its five "closed blockers" close them with **wrong constants for the target build**,
and the STILL_UNHELD that should have caught it instead asserted a falsehood about the
evidence on disk. **Recommend ≤ 60 until every A2 in this lane is re-read against
`reference/decompiled/shs3_payload/scripts/§1t99s0§.as`.**
