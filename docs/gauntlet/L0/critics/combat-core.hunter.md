# combat-core — BLIND CRITIC (Lens 2, Hunter)

**Headline: the surveyor read the wrong build, and a fully readable copy of the RIGHT
build was sitting in this repo the whole time.**

`reference/decompiled/shs3_payload/scripts/` — the **web v0.717 payload** — contains
**1,079 `.as` files**, not the "5 files" the surveyor's `build-version-parity` claim
asserts. Identifiers are renamed (`§1t99s0§`), but **every numeric literal and every
control-flow structure survives verbatim**. I cross-read the web build's `MCSPlayer`,
`StatsManager`, `BattleUI`, `NPCManager` and `InputManager` directly against the
android v0.682 sources this lane used.

Result: **13 of 21 claims hold** (several are now parity-confirmed and stronger than the
surveyor could show). **5 are refuted** — two of them fatally, because they instruct the
project to overwrite CORRECT live constants with android-only values, and one of them
overturns a ledger line (`crit 1.3`) that was **right**.

---

## §A — The refutations

### A1. `combat-core/reach-stance-mults` — **FATAL**

The surveyor: *"src/config/reach.ts lightMult 1.4 (src: 1.5), balancedPerMastery 0.02
(src: 0.005), heavyPerMastery 0.04 (src: 0.005) are all wrong … reach.ts's own comment
shows they were back-derived from the legacy 0.9/1.2/1.4 triple, not read from the payload."*

**All three are exactly right.** Web v0.717, `§1t99s0§.as` (= MCSPlayer) `setStance`:

```
3094:  case §1t12220s0§ (LIGHT):    this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3105:  case §1t12221s0§ (BALANCED): this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3116:  case §1t12222s0§ (HEAVY):    this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
3117:                               if(this.§1t4417s0§ < 100) { this.§1t4417s0§ = 100; }
```

`0.2 · m · 0.1 = 0.02·m` and `0.4 · m · 0.1 = 0.04·m`. Light is flat **×1.4**.
`src/config/reach.ts` carries `lightMult: 1.4`, `balancedPerMastery: 0.02`,
`heavyPerMastery: 0.04`, `heavyFloor: 100` — a four-for-four match, and its comment
correctly explains 0.9/1.2/1.4 as the curves **evaluated at mastery 10**, not as a
back-derivation. Acting on this claim would plant three regressions in a clean file.

Bonus the surveyor's three-stance model has no slot for: `3130` DUAL `× 1.4`,
`3143` REVERSED `× 1.0` (also floored at 100).

### A2. `combat-core/crit-multiplier` — **FATAL, and it overturns a CORRECT ledger line**

The surveyor: *"crit is ×1.5 in Light and ×1.2 in every other stance … never 1.3 and never 3"*,
overturning ledger blocker ② *"crit 1.3 vs 3 final"*.

Web v0.717, `§1t99s0§.as:3272-3276`:

```as3
if(this.§1t4414s0§ == this.§1t4415s0§)   // reload == maxreload
{
   return _loc2_ * 1.3 + this.§1t1243s0§;   // flat ×1.3, ALL stances, + STAT_CRITICALDMG
}
return _loc2_;
```

**Flat ×1.3 for every stance.** The 1.5/1.2 split is android-only. The ledger's "1.3"
was correct, and `src/config/combat.ts` (`CRIT_MULT = 1.3`, *"the source's crit term is
× 1.3 + flatCritBonus"*) was already correct. The surveyor's lane_impact —
*"src/config/combat.ts's '1.3 × …' is wrong"* — is the thing that is wrong.

### A3. `combat-core/build-version-parity` — **REFUTED as STILL_UNHELD (the Lens-2 kill)**

Its close-path premise is factually false. `reference/decompiled/shs3_payload/scripts/`
= **1,079 files**, readable. Parity is no longer unshowable — it is now *measured*:

| constant | android v0.682 | web v0.717 | |
|---|---|---|---|
| base reach `120+floor((90+5·dan)·SPD/(20+SPD))` | `StatsManager.as:1915-1919` | `§1t1523s0§.as:2346-2347` | **same** |
| stage world units | `StatsManager.as:80,82` 800×480 | `§1t1523s0§.as:104,106` 800×480 | **same** |
| `standingRange` / `jumpThreshhold` / `runSpeed` / `gravity` | `MCSPlayer.as:9,11,13,25` | `§1t99s0§.as:9,11,13,25` | **same** |
| slash speeds 50/40/30 | `MCSPlayer.as:15-19` | `§1t99s0§.as:15-19` | **same** |
| `maxDistance 200 / lenThr 4 / distThr 400 / thickness 8 / largestUnit 20` | `InputManager.as:51-59` | `§1t1541s0§.as:51-59` | **same** |
| multi-target prefilter `dist²<40000` | `NPCManager.as:1229` | `§1t1543s0§.as:1486` | **same** |
| heavy defence `×0.8` | `MCSPlayer.as:3226-3234` | `§1t99s0§.as:3284-3288` | **same** |
| `slashusage` floor 48 · baseReload `48+SPD·6` · bonusReload `+6` | `StatsManager.as:1921-1925,1839` | `§1t1523s0§.as:2353,2276` · `§1t99s0§.as:3319` | **same** |
| ability ladder 3 / 4 / 5 | `MCSPlayer.as:3164-3194` | `§1t99s0§.as:3223-3241` | **same** |
| **maxreload** | `5*24 = 120` (`MCSPlayer.as:239`) | **`8*24 = 192`** (`§1t99s0§.as:249`) | **DIFFERS** |
| **reload bar span** | `(r-24)/(max-24)` = 96 ticks (`MCSPlayer.as:1162-1168`) | **`(r-48)/(max-48)` = 144 ticks** (`§1t113s0§.as:328`) | **DIFFERS** |
| **crit** | 1.5 light / 1.2 other | **flat 1.3** | **DIFFERS** |
| **heavy/dual/rev damage mult** | `×1.5` | **`×1.4`** | **DIFFERS** |
| **mastery coefficients** | `0.005/level` | **`0.04` light-dmg, `0.02` bal** | **DIFFERS** |
| **light reach mult** | `×1.5` | **`×1.4`** | **DIFFERS** |
| **stance-switch gate / cost** | `>= max/6`, two-branch penalty | **`>= 48`, flat `-48`** | **DIFFERS** |
| **losing-matchup damage** | *(absent)* | **`×0.9`** (`§1t99s0§.as:3796-3799`) | **DIFFERS** |

### A4. `combat-core/crit-gating` — **MATERIAL**

The *mechanism* is right and survives in the web build (reload resource, `++` per frame,
zeroed on crit, `slashUsage ÷2 / ×1 / ×1.5`, refill `48+SPD·6`, floor 48, `bonusReload +6`).
The two headline **numbers** are android-only:

* `maxreload = 8*24 = 192` — `§1t99s0§.as:249`, not `5*24`.
* stance switch is gated on `reload >= 48` and costs a **flat 48**
  (`§1t99s0§.as:3050`, `:3060`, `:3157-3161`), not `maxreload/6` with the
  `>max/2 → max/3 else −max/6` branch.

At `max/6` of 192 the gate would be 32; the real gate is 48 (25% of the bar). Do not
port the android economy.

### A5. `combat-core/damage-formula` — **MATERIAL**

Random roll ✓, permutation ✓. Coefficients ✗. Web `§1t99s0§.as:3258-3270`:

```as3
var _loc1_:int = this.minDamage + Math.random() * this.damageRange;
case LIGHT:                 _loc2_ = _loc1_ * (0.5 + 0.4 * lightMastery * 0.1);   // 0.5 + 0.04·m
case BALANCED:              _loc2_ = _loc1_ * (1   + 0.2 * balancedMastery * 0.1); // 1   + 0.02·m
case HEAVY/DUAL/REVERSED:   _loc2_ = _loc1_ * 1.4;                                 // NOT 1.5
```

### A6. `combat-core/crit-meter-fill-rate` — **MATERIAL (right measurement, wrong conclusion)**

*"THE MEASUREMENT DOC AND THE FRAME DISAGREE, SO THE FRAME WINS — build 5.8 s."*

**They never disagreed.** The frame was compared against the wrong build. Web source:
`(192 − 48) / 24 = 144 ticks = **6.00 s exactly***.

I re-measured it myself at 60 fps rather than from 5 stills — and this also disposes of
the alternative the surveyor didn't rule out (a Flash session running below nominal
frame rate, which would make wall-clock timings meaningless):

* `reference/videos/Nr4fQstqHDM.mp4` is 60 fps but its **content updates on a strict
  4-frame (15 Hz) cadence** (whole-frame mean-abs-diff spikes only at 1080.2000 /
  1080.2667 / 1080.3333 …), so the footage has a hard 15 Hz temporal floor.
* Subpixel white-fill edge, crit-bar row `y=1034`, track `x∈[246,513]`, window
  1084.3333–1085.9333 s: steps are cleanly **bimodal at ≈1.9 px and ≈3.8 px** —
  i.e. 1 or 2 ticks per 15 Hz sample. 37 ticks over 24 samples (1.60 s), plus 20 ticks
  over 12 samples (0.80 s) in a second ramp = **57 ticks / 2.40 s = 23.75 ticks/s.**
* **The game was running at its nominal 24 fps.** Independently byte-confirmed:
  the web payload's own SWF header says `frameRate = 24.000`
  (`reference/decrypted/shs3_payload_decoded.swf`, and `reference/preservation/shs3.swf`).
* Tick quantum = 1.899 px → displayed span = 267 px / 1.899 = **140.6 ticks**,
  versus the source's **144**. Agreement to 2.4%, inside my ±3 px track-width error.

So the constant to build is **6.00 s / 144 ticks**, sourced (A2), not 5.8 s estimated (A1).
The claim's own lane_impact — *"the period constant must come from the frame, not the
android build"* — is obsolete: it comes from the **web source**.

---

## §B — What held (and is now stronger)

`reach-cap` · `reach-is-arclength` · `crit-meter-exists-in-web-build` ·
`multi-target-full-damage` · `hit-registration-instant-at-endslash` · `pass-through-dash` ·
`gesture-classifier` · `slash-type-map` · `mitigation-and-part-rule` · `heavy-def-0.8` ·
`stance-triangle` · `early-ttk` · `launch-unlock-levels` · `150pct-damage-is-a-buff`.

Every android quote I spot-checked was **verbatim and correctly line-cited** — the
surveyor's transcription discipline is not in question; its *source selection* is.
Seven of these are now **parity-confirmed in the web build** (table in §A3), which
upgrades them from `CONTRACT-SRC-v0.682` to portable.

Frames I opened myself:

* `reference/frames/session11/crit-focus/t1003.000.png`, crop `(0,910)-(620,1080)` @2× —
  portrait ring, HP `14/20` green, Chi `31/31` blue, third bar empty with
  **CANNOT CHANGE STANCE**, gold **150% DAMAGE** below. Confirms `150pct-damage-is-a-buff`
  and the stance-switch meter gate. Bar track measured `x=246..513`; HP green edge at
  `x=433` = 69.8% vs 14/20 = 70.0%.
* `reference/frames/session11/gap-focus-trigger/m_nearfull.png` (1800×780) @0.5× —
  upper panel third bar ~97% white, lower panel 100% with **CRITICAL HIT** printed on it,
  HP 11/20 and Chi 47/47 unchanged. Confirms `crit-meter-exists-in-web-build`.
* Viewport check: game content in the 1080p frame spans `cols 52..1867`, `rows 0..1079`
  → aspect **1.6815**, vs `800/480 = 1.6667` (and *not* `800/690 = 1.1594`, the SWF
  canvas rect). Corroborates the 800×480 world-unit scale independently of code.

---

## §C — What the surveyor left on the table (under-claims)

1. **The stance triangle is in CODE, with numbers.** `stance-triangle` cites only the
   string table. `MCSPlayer.as:3701-3704` (android) and `§1t99s0§.as:3788-3799` (web):
   the victim takes **×1.2** when the attacker's stance beats theirs; the web build
   additionally applies **×0.9** when it loses. Direction reads
   `victim LIGHT ← attacker BALANCED`, `victim BALANCED ← attacker HEAVY`,
   `victim HEAVY ← attacker LIGHT` = light>heavy>balanced>light. `STANCE_BEATS` confirmed
   a **fourth** time, now with the magnitudes the ledger needed.
2. **A fifth damage term, web-only:** `§1t99s0§.as:3804-3807`
   `if(§1t1071s0§) { _loc5_ *= 1.3; }` — a boolean character-state multiplier
   (declared `§1t67s0§.as:52` / `§1t68s0§.as:62`) with no android counterpart. Lead, not
   yet identified; likely a downed/launched state. Flagging so it is not silently dropped.
3. **`mitigation-and-part-rule` describes only the NPC-victim path.** For the *player*
   victim the pipeline is `stance mult → −defence → minDamage floor → behead ×1.5 →
   elemental adds → gotHitCounter=12`, not the flat subtraction the claim describes.
   (Correct as stated for `NPC.as`; incomplete for `MCSPlayer.gotHit`.)
4. **Stale lane_impacts.** `pass-through-dash` says `combat-sim.ts`'s "fixed 105.9 px
   pass-through … needs replacing" — `src/config/combat-sim.ts` already deprecates
   `DASH_SLASH_PX` and already carries `DASH_SPEED_PX_PER_FRAME = {light:50, balanced:40,
   heavy:30}`. Nothing to do.

---

## §D — Score

**78 → 62.** Not because the work is shallow (it is the deepest lane on the board), but
because ~40% of its *actionable* output points at the wrong build's constants, two items
would regress correct live config, and the one blocker it declared unclosable is closable
today with a `grep` in this repo. Re-run the lane against
`reference/decompiled/shs3_payload/` and it lands in the 90s — most of the structure
transfers unchanged.
