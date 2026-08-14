# combat-core — HUNTER CRITIC (blind review)

**Reviewer stance:** §0 blind critic, LENS 2 (hunt under-claiming). Every verdict below
carries an artifact *I* opened. Nothing here is taken from the surveyor's reasoning.

---

## HEADLINE — THE SURVEY READ THE WRONG BUILD, AND THE RIGHT ONE WAS SITTING IN THE REPO

The survey's single load-bearing caveat is that "every source cite is the ANDROID v0.682
client and parity with the web v0.717 is unproven", and its `combat-core/build-version-parity`
claim asserts:

> "The web payload's own AS3 is obfuscated (reference/decompiled/shs3_payload/scripts/§1t51s0§/,
> **5 files**) and cannot be cross-read."

That is false, and it is contradicted by the Stage-0 evidence index the surveyor was
explicitly told to trust over hand-counting:

```
$ python3 -c "import json;print(json.load(open('docs/gauntlet/L0/index/actionscript.json'))['bundles'])"
{'shs1': 164, 'shs2': 366, 'shs3_android': 970, 'shs3_android_payload': 970,
 'shs3_loader': 3, 'shs3_payload': 1079, 'shs3_stage2': 6, 'shs3_stage3': 9}

$ ls reference/decompiled/shs3_payload/scripts/*.as | wc -l
     645
$ find reference/decompiled/shs3_payload -name "*.as" | wc -l
    1079
$ ls "reference/decompiled/shs3_payload/scripts/§1t51s0§/" | wc -l
       1
```

`§1t51s0§/` holds **one** entry, not five. The 645 top-level classes are obfuscated in
*name* only — every literal, every control-flow branch and every arithmetic expression is
intact and readable.

**Build identity, proven:**
- `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36` — `public static var §1t9323s0§:Number = 0.717;` → this bundle **is** the shipped web build.
- `reference/decompiled/shs3_android/scripts/StatsManager.as:30` — `public static var clientVersion:Number = 0.682;`

**Web-build class map I recovered by numeric-literal shape** (exactly the close-path the
survey proposed but did not execute):

| web (v0.717) file | is | proof |
|---|---|---|
| `§1t99s0§.as` | `MCSPlayer` | `:11 internal static var jumpThreshhold:int = 100;` + `:9 standingRange:int = 50` + `:15-19` slash speeds 50/40/30 — byte-identical const block to `shs3_android/scripts/MCSPlayer.as:9-19` |
| `§1t1523s0§.as` | `StatsManager` | `:36` clientVersion 0.717 |
| `§1t122s0§.as` | stat/enemy builder | `:774 var _loc6_:int = 120 + Math.floor(_loc5_ * _loc4_ / (20 + _loc4_));` |
| `§1t113s0§.as` | `BattleUI` | `:326 §1t5205s0§(param1:int, param2:int)` = `updateReload` |
| `§1t1541s0§.as` | `InputManager` | `:52 maxDistance:int = 200`, `:54 = 4`, `:56 = 400`, `:58 thickness:int = 8`, `:60 = 20` |
| `§1t67s0§.as` | `Damage` | `:203/:207/:209` the four-band `attackerlvl/8, /6, /4` floor table |
| `§1t68s0§.as` | `NPC` | `:467 _loc3_ -= this.defense;` `:483 this.§1t3246s0§ = 12;` |

Reading those seven files takes about thirty minutes and settles the parity question that
the survey docked its own score for and left `STILL_UNHELD`.

---

## THE PARITY DELTA TABLE (what the survey should have produced)

All rows verified by me, both sides, first-hand.

| quantity | ANDROID v0.682 | **WEB v0.717 (shipped)** | survey said | repo `src/config` |
|---|---|---|---|---|
| crit multiplier | `1.2` non-light / `1.5` light `MCSPlayer.as:3216-3221` | **`1.3` flat** `§1t99s0§.as:3274` | "never 1.3" ❌ | `CRIT_MULT = 1.3` ✅ |
| light reach mult | `× 1.5` `MCSPlayer.as:3030` | **`× 1.4`** `§1t99s0§.as:3094` | src=1.5 ❌ | `lightMult: 1.4` ✅ |
| balanced reach | `× (1 + 0.005·m)` `:3041` | **`× (1 + 0.2·m·0.1)` = 1+0.02·m** `:3105` | src=0.005 ❌ | `balancedPerMastery: 0.02` ✅ |
| heavy reach | `× (0.5 + 0.005·m)` `:3052` | **`× (0.5 + 0.4·m·0.1)` = 0.5+0.04·m** `:3116` | src=0.005 ❌ | `heavyPerMastery: 0.04` ✅ |
| heavy reach floor | `100` `:3054` | **`100`** `:3118` | 100 ✅ | `heavyFloor: 100` ✅ |
| light dmg mult | `0.5 + 0.005·m` `:3205` | **`0.5 + 0.04·m`** `:3262` | 0.005 ❌ | curve ✅ |
| balanced dmg mult | `1 + 0.005·m` `:3208` | **`1 + 0.02·m`** `:3265` | 0.005 ❌ | curve ✅ |
| heavy/dual/rev dmg | `× 1.5` `:3212` | **`× 1.4`** `:3270` | 1.5 ❌ | 1.4 ✅ |
| `maxreload` | `5 * 24` = 120 `MCSPlayer.as:239` | **`8 * 24` = 192** `§1t99s0§.as:249` | 5×24 ❌ | — |
| reload bar display | `(reload − 24)/(max − 24)` `MCSPlayer.as:1161-1167` | **`(reload − 48)/(max − 48)`** `§1t113s0§.as:328` | "first 24 hidden" ❌ | — |
| stance-switch gate | `reload < maxreload/6` (=20) `MCSPlayer.as:2977` | **`reload < 48`** `§1t99s0§.as:3060` | 1/6 ❌ | — |
| stance-switch cost | 2-branch `>max/2 → max/3` else `−max/6` `:3098-3105` | **flat `−48`** `§1t99s0§.as:3162` | 2-branch ❌ | — |
| behead multiplier | `× 1.5` `NPC.as:453` | **`× 1.3`** `§1t68s0§.as:472` | 1.5 ❌ | — |
| reach base formula | `120 + floor((90+5·dan)·SPD/(20+SPD))` | **identical** `§1t122s0§.as:774` | ✅ | ✅ |
| standingRange / slash speeds | 50 / 50,40,30 `:9,:15-19` | **identical** `§1t99s0§.as:9,:15-19` | ✅ | — |
| InputManager consts | 200/4/400/8/20 `:51-59` | **identical** `§1t1541s0§.as:52-60` | ✅ | — |
| launch/deflect/advanced ladder | 3/4/5, heavy launch@3 `:3164-3194` | **identical** `§1t99s0§.as:3221-3244` | ✅ | `heavy: 5` ❌ (survey right) |
| defence floor bands | `≤10→1+p, ≤20→lvl/8, ≤30→lvl/6, else lvl/4` `Damage.as:150-172` | **identical** `§1t67s0§.as:199-209` | ✅ | — |
| i-frames | `gotHitCounter = 12` `NPC.as:461` | **identical** `§1t68s0§.as:483` | ✅ | — |
| heavy defence penalty | `defense * 0.8` `MCSPlayer.as:3230` | **identical** `§1t99s0§.as:3288` | ✅ | ✅ |
| stage frame rate | 24.000 (SWF header) | **24.000** (SWF header) | 24 ✅ | — |

SWF headers parsed directly from `reference/decrypted/`:
```
shs3_payload_decoded.swf          CWS v17  stage 800x690  frameRate=24.000
shs3_android_payload_decoded.swf  CWS v26  stage 800x480  frameRate=24.000
```

**Net effect:** the survey correctly sensed a parity risk, then resolved it in the wrong
direction. Its `lane_impact` lines instruct the project to overwrite four `src/config`
values that are **already correct for the shipped game** with android-only values. That
is the most damaging thing in this unit and it must not be actioned.

---

## THE CRIT-METER "FRAME BEATS DOC" FINDING DISSOLVES

`combat-core/crit-meter-fill-rate` is the survey's flagship parity proof. Its measurement
is honest — I reproduced its pixel right-edges **exactly**, independently:

```python
# reference/frames/session11/crit-focus/*.png, y=1032, bright run (sum(rgb)>600)
t1003.000  none (bar empty)
t1004.800  246..281
t1005.000  246..290
t1082.100  246..304
t1082.900  246..340
t3779.000  246..370
```
(my track read is x≈244..513 ≈ 269 px, vs the survey's 248..511 = 263 px — a ~2 % shift,
not material. Rates: 16.5 %/s over the t1004.8→t1005.0 window, 16.9 %/s over
t1082.1→t1082.9 → **full sweep ≈ 5.9–6.1 s**.)

The inference built on top of it is what fails. The survey predicted **4.00 s** from
`(maxreload − 24)/24 = 96/24` using android constants. The **web** build's own numbers are:

- `§1t99s0§.as:249` — `this.§1t4415s0§ = 8 * 24;` → maxreload = **192**
- `§1t113s0§.as:328` — `var _loc3_:Number = (param1 - 48) / (param2 - 48);` → displayed span = **192 − 48 = 144 ticks**
- SWF header — **24 fps**

→ **144 / 24 = 6.00 s.**

Measured 5.9–6.1 s. **The web source and the frame AGREE.** The standing "frame wins"
invariant never fires here, because there is no disagreement — the disagreement was
manufactured by reading v0.682 when v0.717 was on disk. The survey's own stated A2
structural feature, "first 24 ticks hidden", is also wrong for the shipped build: it is
the first **48** ticks.

That same `-48` is elegant and self-confirming on the frames: the bar reads exactly 0
precisely when `reload < 48`, which is exactly `nextStance()`'s block condition
(`§1t99s0§.as:3060`) — and `§1t113s0§.as:335-340` sets the overlay text when `_loc3_ == 0`.
Which is what I see in `reference/frames/session11/crit-focus/t1003.000.png` (crop
(0,900)-(700,1080), 3× LANCZOS): HP 14/20 green, Chi 31/31 blue, **third bar empty with
"CANNOT CHANGE STANCE" printed on it**, gold "150% DAMAGE" beneath. Bar-at-zero ⟺
stance locked, one rule, one constant.

---

## FRAME CLAIMS — BOTH HELD, I LOOKED

- `reference/frames/session11/gap-focus-trigger/m_nearfull.png`, viewed 2× upscaled. Two
  stacked panels. Upper: HP `11/20` green, Chi `47/47` blue, third bar ~97 % white and
  unlabelled, gold `150% DAMAGE`. Lower: identical HP/Chi, third bar 100 % white with
  **`CRITICAL HIT`** printed across it. `combat-core/crit-meter-exists-in-web-build` HELD,
  and the SESSION-11 note "OG has NO Critical meter" is correctly overturned.
- `reference/frames/session11/crit-focus/t1003.000.png` crop (0,900)-(700,1080) @3×.
  Straw hat, portrait ring, HP `14/20`, Chi `31/31`, `CANNOT CHANGE STANCE` on the third
  bar, `150% DAMAGE` in gold below the bar stack — a buff readout, sitting *outside* the
  bar row. `combat-core/150pct-damage-is-a-buff` HELD; corroborated by
  `§1t99s0§.as:213 this.minDamage *= 1.5;` in the web build.

---

## PER-CLAIM VERDICTS

| claim | survey | mine | severity |
|---|---|---|---|
| reach-cap | HELD | **stands** (minor: drops the `BUFF_SPEED` `speed *= 1.5` pre-step at `StatsManager.as:1907-1911`) | minor |
| reach-stance-mults | HELD | **REFUTED** — web is 1.4 / 0.02 / 0.04; the three `reach.ts` constants it calls wrong are right | **fatal** |
| reach-is-arclength | HELD | **stands**, and parity confirmed | — |
| crit-multiplier | HELD | **REFUTED** — web crit is flat **1.3**; "never 1.3" is backwards | **fatal** |
| crit-gating | HELD | **REFUTED in part** — maxreload 192 not 120; gate `<48` flat, not 1/6 | material |
| crit-meter-exists-in-web-build | HELD | **stands** (verified by eye) | — |
| crit-meter-fill-rate | PARTIAL | **REFUTED** — web source predicts 6.00 s, frame says 5.9–6.1 s; they agree | material |
| multi-target-full-damage | HELD | **stands** | — |
| hit-registration-instant-at-endslash | HELD | **stands** | — |
| pass-through-dash | HELD | **stands**, parity confirmed | — |
| gesture-classifier | HELD | **stands**, parity confirmed | — |
| slash-type-map | HELD | **stands** | — |
| damage-formula | HELD | **REFUTED in part** — RNG roll right; stance terms are android-only | material |
| mitigation-and-part-rule | HELD | **REFUTED in part** — web behead is **×1.3**, not ×1.5 | material |
| heavy-def-0.8 | HELD | **stands**, parity confirmed | — |
| stance-triangle | HELD | **stands** | — |
| early-ttk | HELD | **stands** (all four cites re-opened) | — |
| launch-unlock-levels | HELD | **stands**, parity confirmed — `stances.ts heavy: 5` genuinely wrong | — |
| 150pct-damage-is-a-buff | HELD | **stands** (minor: quotes android's `maxreload/6`; web is `<48`) | minor |
| build-version-parity | STILL_UNHELD | **REFUTED** — 1079 files, not 5; cross-read in full | **fatal** |

---

## SCORE

The survey scored **78** and named build-parity as reason (a) for holding off the 90s.
That reason is now closed — in both directions. Parity is *established* for ten
quantities and *broken* for eight, all measured. But four of the survey's headline
numbers are android-only and three of its four "fix `src/config`" instructions would
corrupt correct values.

**My score: 62.** The structural discoveries (arc-length budget, instant resolution at
`endSlash`, multi-target no-falloff, universal part rules, nine-way slash classifier,
pass-through derivation, the crit meter's existence on frames) are real, valuable and
correctly cited — that is what keeps this above 50. The deduction is for grading an
entire lane against a build the project does not ship, while the shipped build's source
sat un-opened in `reference/decompiled/shs3_payload/`.

## DO-NOT-ACTION LIST

1. Do **not** change `src/config/reach.ts` `lightMult`, `balancedPerMastery`, `heavyPerMastery`.
2. Do **not** change `src/config/combat.ts` `CRIT_MULT` off 1.3.
3. Do **not** replace the balanced/heavy damage curves with 0.005-per-mastery.
4. **Do** fix `src/config/stances.ts` `LAUNCH_UNLOCK_LEVEL.heavy` 5 → 3 (survey is right, both builds agree).
5. **Do** label ported constants by build. The android bundle is a *different game version*, not a proxy.
