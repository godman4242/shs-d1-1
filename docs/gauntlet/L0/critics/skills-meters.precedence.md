# CRITIC — LENS 3 (PRECEDENCE) — unit: **skills-meters**

Blind review. I did not see the surveyor's reasoning. Every verdict below cites an
artifact **I** opened this pass. Lens: hunt STALE-claiming — a claim that imports a
doc statement a later measurement/ruling/frame overturned, or that cites a doc
second-hand where a frame or a newer bundle settles it directly.

**Bottom line: 18 of 22 claims HELD, 2 REFUTED (1 fatal, 1 material), 2 honest
STILL_UNHELD survive.** The survey's central thesis — *"Android XML is web-true,
Android AS3 is not"* — is **correct and I re-verified it byte-for-byte**. The irony
is that the survey then committed that exact error twice, in the two places it
mattered most.

Suggested re-score: **86 → 78.** The blocker-① / ④ / ⑤ closures are real and
strongly cited; blocker ③ (Focus numerics) is **not** closed — its headline constant
is the Android one.

---

## ⛔ FATAL — F-1. `focus-meter-numerics-web`: maxreload is **192**, not 120

The claim: *"max 120 frames (5s)"*, cited to `§1t99s0§.as:55`.

**Line 55 is not maxreload.** Verbatim, `reference/decompiled/shs3_payload/scripts/§1t99s0§.as`:

```
 55:      internal static var §1t12234s0§:int = 5 * 24;
```

`§1t12234s0§` has exactly two uses in the whole web bundle, and neither is the meter:

```
266:            this.§1t4440s0§ = §1t12234s0§;          // §1t99s0§.as, inside §1t4444s0§
950:               §1t4440s0§ = §1t12234s0§;            // §1t122s0§.as
1244:         if(this.§1t4440s0§ > 0)
1246:            --this.§1t4440s0§;                     // a per-frame countdown, not a meter
```

The real maxreload — the var compared in `getDamage` (`:3272`), zeroed in
`deductReloadBar` (`:3295`), clamped in the refill (`:3321`), and handed to the UI as
`param2` (`:256`, `:1208`, `:3169`, `:3325`) — is `§1t4415s0§`, and it is assigned
**once**:

```
249:         this.§1t4415s0§ = 8 * 24;
```

`this.§1t4415s0§ = 8 * 24` = **192 frames = 8.00 s**.

That line sits inside `§1t4443s0§` (declared `:183`), which is the 15-parameter twin
of Android `MCSPlayer.as:182 initPlayer(controlledBy, hp, maxhp, chi, maxchi,
defense, baseReload, minDamage, damageRange, baseSlashLength, slashUsage,
lightMastery, balancedMastery, heavyMastery, level)` — same arity, same order,
param-for-param (`§1t99s0§.as:185-199` vs `MCSPlayer.as:184-198`). The Android twin
of line 249 is:

```
MCSPlayer.as:239:         this.maxreload = 5 * 24;
```

**So the survey reported the ANDROID constant as the web value, under a web line
number that does not contain it.** This is precisely the failure the survey's own
headline warns about, committed in the claim it scored highest.

### THE FRAME WINS — and the frame agrees with the code, not with the survey

`docs/research/fidelity/COMBAT_MEASUREMENTS.md` carries a frame-derived measurement
of this exact quantity:

```
:101  - Rate **45.05 ± 0.30 px/s** ⇒ empty→full **5.97 s** (confirms 6.00 s).
:589  | **f-5** | Focus fills PASSIVELY and LINEARLY … 45.0 px/s … 46.1 px/s | ≈45.5 px/s | MEASURED |
:590  | **f-6** | **Focus empty→full ≈ 5.9 s** … | **rate MEASURED; total INFERRED** |
```

The visible bar spans `(maxreload − 48)` frames — from `§1t113s0§.as:328
(param1 - 48) / (param2 - 48)`. At 24 fps:

| model | visible-bar travel | vs measured 5.97 s |
|---|---|---|
| **web `8*24`=192** | (192−48)/24 = **6.000 s** | ✅ exact |
| survey's `5*24`=120 | (120−48)/24 = **3.000 s** | ❌ off by 2× |

Two independent frame-scanned ramps and a code constant land on the same number to
three decimals. **Standing invariant applied out loud: when the measurement doc and
the frame disagree the frame wins — here they agree, and both refute the survey.**

Bonus: this **upgrades COMBAT_MEASUREMENTS f-6 from "total INFERRED" to CONTRACT.**
Empty→full is 192 frames = **8.000 s** of charge, of which the first 48 frames
(2.000 s) render as a zero-width bar carrying the refusal caption, leaving exactly
**6.000 s** of visible travel. f-6's extrapolation was right; it no longer needs to
be an extrapolation.

### What survives in that claim
Dead zone 48 ✅ · switch cost flat 48 ✅ (`:3162`) · slash cost ×0.5 / ×1.0 / ×1.5 ✅
(`:3302/3306/3310`) · bonus refill +6 ✅ (`:3320`). Only the max is wrong — but it is
the denominator of everything else, so the derived lane_impact is wrong too:
usable range is **144 frames, and a stance switch costs one THIRD of it**, not
"72 frames … two-thirds".

---

## ⚠️ MATERIAL — F-2. `per-stance-reach-formula`: **Dual and Reversed are swapped**

The formula is right. The two off-stance labels are inverted.

Web stance constants, `§1t99s0§.as:27-35` — `12220=0, 12221=1, 12222=2, 12223=3,
12224=4`. The Android bundle declares the same five in the same order **with names**:

```
MCSPlayer.as:27:      internal static var LIGHT_STANCE:int = 0;
MCSPlayer.as:29:      internal static var BALANCED_STANCE:int = 1;
MCSPlayer.as:31:      internal static var HEAVY_STANCE:int = 2;
MCSPlayer.as:33:      internal static var DUAL_STANCE:int = 3;
MCSPlayer.as:35:      internal static var REVERSED_STANCE:int = 4;
```

⇒ `§1t12223s0§` = **DUAL**, `§1t12224s0§` = **REVERSED**.

Android `setStance` is structurally isomorphic to the web one — same five cases in
the same source order (LIGHT, BALANCED, HEAVY, REVERSED, DUAL):

```
android 3066:            case REVERSED_STANCE:
android 3067:               this.slashLength = this.baseSlashLength * 1.5;
android 3077:            case DUAL_STANCE:
android 3078:               this.slashLength = this.baseSlashLength;
android 3079:               if(this.slashLength < 100)  → 100
```
```
web 3130:            case §1t12224s0§:                       // REVERSED
web 3131:               this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
web 3141:            case §1t12223s0§:                       // DUAL
web 3142:               this.§1t4417s0§ = this.§1t4420s0§;
web 3143:               if(this.§1t4417s0§ < 100) → 100
```

**Corrected:** Reversed ×1.4 · **Dual ×1.0 floored at 100** — the survey has it
backwards. Same inversion propagates to the slash-cost buckets (`:3305` groups
Balanced with **Reversed** at ×1.0; `:3309` groups Heavy with **Dual** at ×1.5).

Also flagged, not refuted: the wiki reconciliation "1.4×210=294 / 210 / 105" mixes
**mastery-10** for the damage table with **mastery-0** for the reach table. The
survey labels the step as inference, so it stands as flagged — but it is internally
inconsistent and should not be promoted.

---

## Precedence nits (NOT refutations — substance holds, the cite is second-hand)

Four claims reach for an **Android** cite where the **web** bundle settles it. Under
§0 that is weaker evidence than was available, and under the survey's own rule
("Android AS3 is not web-true") it is self-undermining. Supplying the web cites:

| claim | survey cited | web cite that settles it |
|---|---|---|
| `stance-damage-ceiling-is-mastery-10` (mastery source) | `StatsManager.as:1834` | **`§1t4906s0§.as:58-61`** — `_loc7_=getStat(1000)`, `_loc8_=(1001)`, `_loc9_=(1002)` passed as params 12/13/14 → `§1t99s0§.as:196-198` → `§1t4421s0§/4422/4423`. Mapping proven in the web build. |
| `150pct-damage-is-a-food-buff` | `OverworldHUD.as:1402-1404`, `MCSPlayer.as:210-223` | **`§1t99s0§.as:209-223`** — same else-if chain, `this.minDamage *= 1.5` / `defense *= 1.5` / injured `*0.5` incl. `this.§1t4420s0§ *= 0.5`. (That last line is also the independent proof that `§1t4420s0§` = baseSlashLength.) |
| `stab-is-a-passive-tree-node` (canEquip) | `XMLSkill.as:345-348` | no web cite offered; the XML half is web-true by the byte-check, so this is minor |
| `ten-categories-all-named` (categoryCount=10) | `SkillScreenUI.as:84` | no web cite offered; category domain [1,11] is web-true by the byte-check, so this is minor |

Also: `ledger-decimals-are-display-artefacts` concludes *"config must encode the
integers"*. The cooldown domain is **not** all-integer — `docs/gauntlet/L0/index/
skilldata.json → skilldata/skill/level/cooldown` has `distinct_values 14`,
`numeric_range [2.0, 70.0]`, `sample_values` including **`'3.5'`**. Config field must
be `Number`, not `int`. Minor, but it is a real trap.

And: `m_nearfull.png` is a **1800×780 derived montage** of two HUD strips, not a raw
1920×1080 video frame. The A1 reading is sound (I reproduced it, below) but the
provenance should be stated.

---

## What I re-verified and confirmed first-hand

- **A3 byte-check re-run:** android `117_Mobile_SkillData.bin` 39,045 B vs web
  `skilldata.xml` 39,003 B, delta 42; after stripping the 40-byte XML declaration the
  common prefix is **39,003 of 39,003 bytes**. ✅ The survey's central lever is real.
- **`getDamage` verbatim** (`§1t99s0§.as:3255-3277`): stance table `0.5+0.04M` /
  `1.0+0.02M` / flat `1.4`, then `if(reload == maxreload) return dmg*1.3 + STAT_CRITICALDMG`.
  Deterministic crit ✅, `1.3` ✅, mastery-10 ceiling ✅ (skills 1000/1001/1002 each
  carry exactly 10 `<level>` rows, values 1-10, all `<passive>` — my own scan).
- **SPD cap 600** (`§1t1523s0§.as:2291-2295`) vs **Android 300**
  (`StatsManager.as:1856-1860`). ✅ Divergence real; web value correct.
- **Cooldown decimals reproduced:** `§1t105s0§.as:297` returns `int`, so
  `int(120×mod)/24` etc. SPD ∈ **[6,10]** is the exact band that yields
  4.96 / 9.92 / 8.92 — SPD 5 and SPD 11 both break it. ✅
- **135 filled / 47 blank / 0 unresolved** across 182 `<level><desc>` rows — my own
  join against `strings.json`. Exactly as claimed. ✅
- **Category census:** 5/5/5/10/10/9/6/6/6/6 + cat-11 = 7 = 75. Cat 11 = Back Throw,
  Air Stab, Bull Charge, Punch Lunge, Undying, 1500, 1501 — **none** has `<lvlreq>` or
  `<order>`. ✅ NPC-only conclusion is sound.
- **Chi domain** exactly `0,2,3,5,6,7,8,10,20,50,100`. ✅
- **`resolved_names.json['skilldata.xml']`** → `misses: 0, rows_resolved: 73,
  miss_sample: []`; **`strings.json['960']` is MISSING**, `['175'] = 'Critical Hit'`. ✅
- **A1 re-measured myself.** `m_nearfull.png`, crops (640,0)-(1800,390) and
  (640,390)-(1800,780), 2× Lanczos. Top: green 11/20, blue 47/47, white third bar
  with **no** text. Bottom: identical, white bar now carrying **black "CRITICAL HIT"**.
  My own widest-row pixel sweep: chi-blue track `x735→1541` = **807 px**; TOP white
  `x736→1526` = **791 px = 98.0 %**; BOT white `x736→1540` = **805 px = 99.8 %**.
  Survey said 98.0 % / 100 % — matches within 1-2 px. ✅
- **A1 re-measured myself.** `Nr4fQstqHDM_t428.0.png`, crop (60,880)-(1020,1080),
  3× Lanczos: red portrait ring, green **20/20**, blue **26/26**, third bar
  empty/brown carrying light-grey **"CANNOT CHANGE STANCE"**, yellow **"150% DAMAGE"**.
  `§1t113s0§.as:110-111` verbatim confirmed, incl. `#BBBBBB` / `#000000`. ✅
- **`Snd_criticalDamage`** at `§1t113s0§.as:352` — verbatim confirmed. ✅

---

## NEW — things the survey missed

### N-1. The stance switch is **hard-gated at reload ≥ 48**, with a direct cite
The survey argued in-combat switching is real *by inference* ("a hard lock would
have nothing to charge"). The gate is explicit:

```
§1t99s0§.as:3048:      public function §1t4470s0§() : Boolean
             3050:         return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
             3058:      public function §1t4472s0§() : *
             3060:         if(this.§1t4414s0§ < 48)
             3062:            return;
```

`§1t4472s0§` is the stance cycle (`-1→Light→Balanced→Heavy→Light`, `:3064-3079`) and
it **early-returns below 48**. So "CANNOT CHANGE STANCE" is a *literally true refusal*
shown exactly when the switch is impossible — the bar reads 0 iff `reload ≤ 48` iff
the cycle refuses. The survey's conclusion is right and now needs no inference.
Ledger §3.4's "HARD-LOCKED in v0.717" is dead; the recreation's Focus-gated switch is
**faithful**, cost = flat 48, gate = ≥ 48.

### N-2. `baseReload` (48 + SPD×6) is computed, passed in, and **never read**
`StatsManager.as:1841 getBaseReload() = 48 + (SPD + bonus) * 6` → passed as param 7 →
stored to `§1t99s0§.as:191 this.§1t4419s0§ = param7` (declared `:103`, default 48).
`grep` over the entire web bundle: **those are its only two occurrences**. Identical
dead-end in Android (`baseReload` at `:105`, `:182`, `:190`, nowhere else).
Meanwhile the actual fill is a flat `++reload` per tick (`§1t99s0§.as:1203-1205`).

⇒ **SPD does NOT accelerate the Focus meter.** SPD buys cooldown reduction and reach
only. Do not wire SPD to meter fill in config. This also independently corroborates
COMBAT_MEASUREMENTS **f-5** ("fills PASSIVELY and LINEARLY with time… no
event-driven jumps") against gap-F's "charge begins on holding the slash input" —
the code has no input term at all.

### N-3. `slashUsage` is a **per-weapon itemdata field**, floored at 48
```
§1t1523s0§.as:2352:  var _loc1_ = …getItemData(equipped weapon);
             2353:  if(_loc1_ == null || _loc1_.slashusage < 48)
             2355:      return 48;
             2357:  return _loc1_.slashusage;
```
`itemdata.xml` carries `<slashusage>` on **106 items**, domain **{24, 72, 96}**
(`docs/gauntlet/L0/index/itemdata.json → itemdata/item/slashusage`, first at
`itemdata.xml:8044`). After the floor the effective domain is **{48, 72, 96}** — the
24-value weapons are clamped up. So the meter economy is weapon-dependent, and Light
slashes cost {24, 36, 48} frames against a 144-frame visible bar. The survey treats
`slashUsage` as an opaque symbol; this is codeable today and is a cross-lane hand-off
to items-equipment.

### N-4. Heavy's defence penalty is web-true A2
```
§1t99s0§.as:3286:         if(this.stance == §1t12222s0§)
             3288:            return defense * 0.8;
```
REBUILD_READINESS `:189` lists "Heavy def ×0.8" under combat-core **Ready** with no
cite. It now has one, in the shipped web build.

### N-5. Cooldowns are not all integers — `3.5` exists (see nits above).
