# L0 CRITIC — `combat-core` · LENS 3 (PRECEDENCE)

- **Reviewer:** blind critic, precedence lens (hunts STALE-claiming)
- **Date:** 2026-08-15 (second precedence pass; §9 carries forward the first pass)
- **Verdict on the unit:** **score 78 is not supportable. Recommend 55–60.**
- **Refuted:** 7 of 20 claims — **3 FATAL**, 4 MATERIAL.
- **Headline:** the survey read the **wrong build**, then instructed L5 to overwrite
  **already-correct CONTRACT-SRC config** with it. The premise that licensed this —
  "the web AS3 cannot be cross-read" — is false, and I broke it with four `grep`s.

---

## §1 THE PREMISE THAT UNWINDS THE LANE

`combat-core/build-version-parity` (verdict `STILL_UNHELD`) says:

> "The web payload's own AS3 is obfuscated
> (`reference/decompiled/shs3_payload/scripts/§1t51s0§/`, 5 files) and cannot be
> cross-read."

**Both halves are wrong.**

```
$ ls reference/decompiled/shs3_payload/scripts/ | grep -c "§"
612
$ find reference/decompiled/shs3_payload -name "*.as" | wc -l
1079
```

`§1t51s0§/` is one subdirectory of many. There are **612 obfuscated top-level
classes** and **1,079 `.as` files** in the web payload. **Identifiers are obfuscated;
the code bodies are plain AS3.** The survey's own proposed close-path — *"locate the
same expressions in the obfuscated web AS3 by numeric-literal shape"* — is a grep, and
it works:

```
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36
      public static var §1t9323s0§:Number = 0.717;
reference/decompiled/shs3_android/scripts/StatsManager.as:30
      public static var clientVersion:Number = 0.682;
```

So parity is **not** unknown. It is **HELD** — and it resolves **against** the survey:
where the two builds differ, **v0.717 matches the repo's existing config**, not the
android read the survey wants substituted in.

---

## §2 SIDE-BY-SIDE — v0.717 (the build we are recreating) vs v0.682 (what was cited)

Web rows are from `reference/decompiled/shs3_payload/scripts/§1t99s0§.as` (the
`MCSPlayer` analogue) and `§1t1523s0§.as` (the `StatsManager` analogue). Every line
below I opened and read this pass.

| quantity | **v0.717 WEB (target)** | v0.682 android (survey's cite) | live config | survey said |
|---|---|---|---|---|
| reach base | `120 + Math.floor((90 + dan*5) * spd / (20 + spd))` (`§1t1523s0§.as:2346-2347`) | identical | `reach.ts` ✅ | ✓ agrees |
| light reach | `* 1.4` (`§1t99s0§.as:3094`) | `* 1.5` | `lightMult 1.4` ✅ | "wrong, use 1.5" ❌ |
| balanced reach | `* (1 + 0.2 * m * 0.1)` = **0.02/m** (`:3105`) | `0.005/m` | `balancedPerMastery 0.02` ✅ | "wrong, use 0.005" ❌ |
| heavy reach | `* (0.5 + 0.4 * m * 0.1)` = **0.04/m** (`:3116`) | `0.005/m` | `heavyPerMastery 0.04` ✅ | "wrong, use 0.005" ❌ |
| damage curves | light `0.5+0.04m` · bal `1+0.02m` · heavy/dual/rev **×1.4** (`:3262,:3265,:3270`) | `0.5+0.005m` · `1+0.005m` · ×1.5 | matches ✅ | "0.005 / ×1.5" ❌ |
| **crit** | **`return _loc2_ * 1.3 + critBonus`** — one branch, no stance split (`:3274`) | ×1.5 light / ×1.2 other | `CRIT_MULT = 1.3` ✅ | **"never 1.3"** ❌ |
| focus ceiling | **`this.§1t4415s0§ = 8 * 24` = 192** (`:249`) | `5 * 24` = 120 | `FOCUS_MAX = 192` ✅ | "120" ❌ |
| stance-switch cost | **flat `-= 48`** (`:3162`) | `maxreload/6` gate, `>1/2 → 1/3` | `FOCUS_SWITCH_COST = 48` ✅ | "1/6 meter" ❌ |
| behead / part crit | **`_loc3_ *= 1.3`, BEFORE the defence subtraction** (`§1t4904s0§.as:409`) | `damage *= 1.5`, AFTER the min-floor | — | "×1.5" ❌ |
| stance triangle in damage | **`*= 1.2` losing / `*= 0.9` winning** (`§1t4904s0§.as:419-429`) | `*= 1.2` only, no 0.9 (`MCSPlayer.as:3701`) | — | **never mentioned** ❌ |
| slash spend | `/2` · `×1` · `×1.5` of `slashUsage` (`:3300-3311`) | same | `FOCUS_SPEND` ✅ | ✓ |
| `slashUsage` floor | `< 48 → 48` (`§1t1523s0§.as:2353-2355`) | same | ✅ | ✓ |
| heavy defence | `defense * 0.8` (`:3286-3290`) | same | ✅ | ✓ |
| mastery ladder | 3 / 4 / 5, **heavy launch at 3** (`:3221-3244`) | identical | `stances.ts heavy: 5` ❌ | ✓ **real bug** |

**Consequence.** `reach.ts`'s `1.4 / 0.02 / 0.04`, `combat.ts`'s `CRIT_MULT 1.3`,
`FOCUS_MAX 192`, `FOCUS_SWITCH_COST 48` were **read out of the v0.717 payload on
2026-07-25** and published in `docs/research/fidelity/SOURCE_CONSTANTS.md`
(§3.1 / §3.2 / §3.3). The survey's assertion that *"reach.ts's own comment shows they
were back-derived from the legacy 0.9/1.2/1.4 triple, not read from the payload"* is
false, and backwards: the legacy triple **is** those curves at mastery 10, which is
exactly what the comment says.

Acting on `reach-stance-mults`, `crit-multiplier` and `damage-formula` would put
**six regressions into currently-correct CONTRACT-SRC config.**

---

## §3 THE FILL-RATE "PARITY BREAK" IS A MEASUREMENT ERROR, NOT A FINDING

`combat-core/crit-meter-fill-rate` is the survey's stated *proof* that v0.682 ≠
v0.717, and the stated reason the score is held off the 90s.

**The pixel work is honest.** I re-scanned the reload row on all five frames and
reproduced the survey's fill edges to ±1 px:

```
y=1036, last bright pixel (r,g>150):
  t1004.800 → 282   t1005.000 → 291   t1081.100 → 259
  t1082.100 → 304   t1082.900 → 340   t3779.000 → 371
```

**But the track is mis-calibrated, and that is the whole "discrepancy".**

1. The survey assumed the track is `x = 248…511` (263 px). It is not. On
   `crit-focus/t1003.000.png` the **Chi bar is full (31/31)** and spans
   **x = 245…513** (my scan, rows y=1004–1016), and the *empty* reload track's flat
   brown `(45,30,0)` run ends at **x = 511/512**. Track ≈ **267–269 px**.
2. Recomputing with the true track: **45 px/s ÷ 267 px = 16.9 %/s ⇒ 5.92 s**, not
   5.8 s. The survey's 5.8 s is a 2 % track-width artifact.
3. The repo already measured this, better, and the survey never cites it:
   `docs/research/fidelity/session11-raw/gap-focus-trigger.txt:2` — *"45.05 ± 0.30
   px/s @1080 … straight-line fit rms 0.76–1.01 px across 8 whole cycles …
   Empty→full = **5.97 s** ⇒ the 6.00 s design figure is confirmed."* My 45 px/s
   reproduces theirs exactly.
4. **There is no source↔frame conflict at all.** v0.717's meter is `8 * 24 = 192` raw
   at +1/frame, displayed `(x − 48)/144` ⇒ visible span **144 frames = 6.000 s @24 fps**
   (`§1t99s0§.as:249`; `Mobile.as:117` / SWF header = 24 fps). The frame says 5.92–5.97.
   The source says 6.000. They agree to 1 %. The "android predicts 4.00 s" gap is
   manufactured entirely by reading v0.682's `5 * 24`.

> **"THE MEASUREMENT DOC AND THE FRAME DISAGREE, SO THE FRAME WINS" is a
> mis-invocation of the standing invariant.** No measurement doc disagrees. The
> measurement doc agrees with the frame, and both agree with the v0.717 source.
> Using the invariant to install a number **worse** than the one already banked is
> precisely the failure this lens exists to catch.

---

## §4 STALE-CLAIMING — substance right, novelty wrong

`REBUILD_READINESS.md` is the **2026-07-20** ledger, and it says so itself:
*"On any conflict, the live `src/config/*.ts`, the fidelity ledgers, and owner rulings
still win."* The source dive (07-25) and SESSION 13 postdate it. The survey took the
ledger's blocker list as its frame and never checked what closed it.

| claim | already banked at |
|---|---|
| `reach-cap` "blocker ① is dead" | `SOURCE_CONSTANTS.md` §3.3 + `src/config/reach.ts` header — same formula, since 07-25 |
| `reach-is-arclength` "a model the repo asserted without a source" | `SOURCE_CONSTANTS.md` §3.3 *"reach is the total ARC-LENGTH budget of the stroke you draw, spent segment by segment"* |
| `crit-gating` "a third resource **no ledger system records**" | **false.** `src/config/combat.ts:80-108` — `FOCUS_MAX 192`, `FOCUS_FILL_PER_S 24`, `FOCUS_ACC 2/5`, `FOCUS_KILL_BONUS 6`, `FOCUS_DISPLAY_OFFSET/SPAN 48/144`, `FOCUS_START 0`, `FOCUS_SWITCH_COST 48` — all `CONTRACT-SRC` |
| `crit-meter-exists-in-web-build` "correcting SESSION-11's 'no Critical meter'" | `src/config/combat.ts:71-73` *"The original has THREE meters — HP, Chi, Focus — and **Focus IS the crit meter**: when it fills, the HUD prints 'CRITICAL HIT'."* Also `COMBAT_MEASUREMENTS.md:104-105`, `DIVERGENCES.md:435`. The project's position was **never** "no crit meter"; it was "no *separate fourth* meter" — which the frame does not contradict. Straw man. |
| `pass-through-dash` "combat-sim.ts's 105.9 px needs replacing" | `src/config/combat-sim.ts:68-78` already **deletes** `DASH_SLASH_PX` and exports `DASH_SPEED_PX_PER_FRAME = {50,40,30}`; `SOURCE_CONSTANTS.md` §3.4 already states *"TWO uncapped dashes per slash"* |
| `gesture-classifier` "carried no thresholds" | `SOURCE_CONSTANTS.md` §3.4 *"min stroke to count as a slash: 4 points or 20 px end-to-end"*; `combat-sim.ts:58` `MOVE_DEADZONE_PX = 25` `CONTRACT-SRC` |
| `damage-formula` "damage is a RANDOM roll" | `SOURCE_CONSTANTS.md` §3.1, and `combat-sim.ts` `FighterBase.damageRange` already models it — *"Sim has no place for"* is false |
| `early-ttk` | `SOURCE_CONSTANTS.md` §3.7 — `hp = 1` **authored in the data** *plus* the code path `setLevel: if (lvl <= 10) { damage = 1; defense = 1; maxHP = 1; }`, which **overrides the Thug's `<defense>3</defense>` the survey computed against** |
| `stance-triangle` "confirmed a third time" | `stances.ts STANCE_BEATS` comment: *"now the game's own words. **Never relitigate.**"* — and the survey still missed the triangle's actual numbers (§2) |
| `build-version-parity` "must be labelled CONTRACT-SRC-v0.682" | `SOURCE_CONSTANTS.md` §0/§3.7 already tags android-sourced rows `CONTRACT-SRC (0.682)` — standing since 07-25 |

---

## §5 WHAT SURVIVES AND IS WORTH SHIPPING

1. **`launch-unlock-levels` — the one clean live-config bug, and I strengthened it.**
   The ladder is **identical in v0.717** (`§1t99s0§.as:3221-3244`): light `>=3/4/5`,
   balanced flip-up 3 / deflect 4 / **launch 5**, heavy **launch 3** / deflect 4 /
   stab 5. `src/config/stances.ts LAUNCH_UNLOCK_LEVEL.heavy = 5` is wrong on the
   target build. **Fix it.** Reversed/Dual granting all five unconditionally
   (`:3245-3252`) is also real and unmodelled.
2. **`hit-registration-instant-at-endslash`** — verified verbatim
   (`MCSPlayer.as:2767-2814`; the only `NPCManager.checkHit` call sites; the whole
   polyline resolves in one call, and `deductReloadBar()` is charged in the same
   call). This genuinely answers a ledger unknown-unknown.
3. **`multi-target-full-damage`** — verified (`NPCManager.as:1204-1295`).
   `while(j < slashMax && !enemy.gotHitFlag)` caps each enemy at one hit; the same
   `Damage` object goes to every victim, and `NPC.gotHit` copies
   `damageObj.damage` into a **local int**, so no victim's mitigation leaks into the
   next. Full damage each, no falloff. Confirmed. Cheap pre-filter `|Δx| < 200` real.
4. **`slash-type-map`** — verified verbatim (`MCSPlayer.as:2403-2456`, constants
   `:37-53`, `jumpThreshhold` `:11`). Nine types is more structure than the ledger's
   one-line "gesture→attack map".
5. **`gesture-classifier` thresholds** — verified (`InputManager.as:268`,
   `lengthThreshhold=4` `:53`, `distThreshhold=400` `:55`, tap dead-zone `dist²<625`
   at `MCSPlayer.as:2299`). The **AND** reading is more precise than the doc's "or".
   Wire them — after re-reading them on v0.717.

---

## §6 TWO THINGS THE SURVEY MISSED (new findings)

### N1 — `src/core/Sim.ts:670` runs the dash **2.5× too fast**. Live bug.

```ts
// src/core/Sim.ts:670
speedPxS: DASH_SPEED_PX_PER_FRAME[player.stance] * FIXED_HZ,
```

`FIXED_HZ = 60` (`src/config/timing.ts:8`), and `combat-sim.ts:77` labels the
constant *"dash travel per **60 Hz** frame"*. But `50/40/30` is px per **24 fps**
frame — the original runs at 24 (`Mobile.as:117` `frameRate = 24`; SWF header;
`SOURCE_CONSTANTS.md` §3.4 spells it out: *"1200 / 960 / 720 px/s"*). Sim therefore
dashes at **3000 / 2400 / 1800 px/s** instead of **1200 / 960 / 720**.

The rest of the file already knows the source is 24 Hz — `combat.ts:83-91` names
`FOCUS_FILL_PER_S = 24` and `FOCUS_ACC 2/5 = 24/60` precisely to bridge it. The dash
is the one constant that skipped the conversion. This sits squarely in the survey's
`pass-through-dash` claim, which quoted `50/40/30` and never checked the unit.

### N2 — the **duel** damage path was never surveyed; the mob path was.

`mitigation-and-part-rule` cites only `NPC.as:386-462` — the path for **mobs**. The
fighter-vs-fighter path (`MCSPlayer.gotHit`, which is what `DuelScene` renders) is a
*different function* and carries a term the survey's pipeline has no slot for:

```
// v0.717  §1t4904s0§.as:405-429      (behead FIRST, at 1.3, BEFORE defence)
case hat: case head: case neck:  _loc3_ *= 1.3;  behead = true; break;
...
if (stance beats attacker's)  _loc3_ *= 1.2;      // losing the triangle
else if (attacker's beats stance) _loc3_ *= 0.9;  // winning it
_loc3_ -= getDefense();
```

vs the android v0.682 fighter path (`MCSPlayer.as:3701-3717`), which has **only the
×1.2 branch and no ×0.9**, and applies behead at **×1.5 AFTER the min-floor**.

So the survey's "mitigation is flat defence subtraction floored by a four-band table"
is the **mob** rule, stated as if universal, with the target build's ×1.3 / ×1.2 /
×0.9 terms absent. `StatsManager.resetCombo()` fires in the same block on player
damage — corroborating `SOURCE_CONSTANTS.md` §3.5 (*combo resets only when the player
takes damage*), which the survey's combo bullet also omits.

---

## §7 WHAT I VERIFIED FIRST-HAND (audit trail)

- Payload: `StatsManager.as:1915-1919`, `:1828-1840`, `:1920-1929`, `:4298-4306`;
  `MCSPlayer.as:5-60`, `:182-242`, `:1158-1168`, `:2255-2315`, `:2403-2530`,
  `:2660-2820`, `:2975-2985`, `:3020-3115`, `:3155-3195`, `:3197-3272`, `:3650-3720`;
  `NPCManager.as:1204-1295`; `NPC.as:295-462`; `Damage.as:1-60`, `:150-172`;
  `BattleUI.as:95-110`, `:250-270`; `Mobile.as:113-117`; `EnemyTrainingDummy.as:180-215`.
- Web payload: `§1t1523s0§.as:36`, `:2340-2355`; `§1t99s0§.as:55`, `:249`,
  `:3094-3131`, `:3155-3172`, `:3215-3252`, `:3255-3315`; `§1t4904s0§.as:395-430`.
- Data: `itemdata.xml:7904-7918` (13002 Branch 1-2), `npcdata.xml:144-154` (Thug lvl2
  hp1 atk5 def3), `:2472-2482` (Duelist lvl1 hp2 atk1 def0),
  `skilldata.xml:1-80` (levels 1..10 ⇒ mastery domain 0-10), `strings.json`
  175 / 4041 / 4132 / 5010 / 5052 / 6001 / 6003 / 6005.
- Frames (opened, cropped, upscaled): `session11/gap-focus-trigger/m_nearfull.png`
  (1800×780, viewed at 50 % — two panels, HP 11/20, Chi 47/47, third bar full with
  **CRITICAL HIT** printed, "150% DAMAGE" gold: **the survey's description is
  accurate**); `session11/crit-focus/t1003.000.png` (crop (0,900)-(640,1080) @2× —
  HP 14/20, Chi 31/31, third bar reading **CANNOT CHANGE STANCE**, "150% DAMAGE"
  gold: **accurate**); pixel scans of `t1004.800 / t1005.000 / t1081.100 / t1082.100 /
  t1082.900 / t3779.000`.
- Repo: `src/config/reach.ts`, `stances.ts`, `combat.ts`, `combat-sim.ts`,
  `timing.ts`, `src/core/Sim.ts:660-680`;
  `docs/research/fidelity/SOURCE_CONSTANTS.md` §0/§3.1-§3.9;
  `docs/research/fidelity/session11-raw/gap-focus-trigger.txt`;
  `docs/research/REBUILD_READINESS.md:19-45, 88-115, 189-190`.

---

## §8 SCORE

78 assumes five blockers closed at authoritative source. **② crit** and the
multiplier half of **①** are closed at the **wrong** source and resolve the other way
on the target build. **⑤** was already closed in live config with the *correct*
numbers. **③** was already closed twice (data + code path). **④** and the hit-window
are real gains. Net new, correct, actionable output for this lane: **one config bug
(heavy launch at 3), one un-wired threshold pair, the nine-way slash taxonomy, and
the multi-target / hit-registration answers** — plus, from this review, the Sim dash
unit bug and the duel-path damage terms.

That is a **55–60**, not a 78.

---

## §9 CARRIED FORWARD FROM THE FIRST PRECEDENCE PASS — *not* re-verified by me

The prior pass at this path reached the same three fatal calls independently. Two of
its items I did **not** re-check; they are recorded here so they are not lost, and
are **NOT** admissible under §0 until someone opens the artifact:

- Its §5.3 downgrade of `hit-registration-instant-at-endslash` **HELD → PARTIAL**,
  on a `DIVERGENCES.md` frame note that *"damage appeared to resolve over the whole
  dash sweep … two enemies behind a line's near end died in one slash"*. If that note
  exists, frame beats source and the downgrade stands. **Unverified by me.**
- Its §6 reconciliation of `COMBAT_MEASUREMENTS.md` c-2's "Balanced reach
  unresolvable": measured Light 233–241 / Balanced 116–131 / Heavy 97–103 stage px
  reproduced by the v0.717 constants at two character levels, with Heavy's plateau
  explained by the `< 100 → 100` floor clamp. Plausible and valuable if it holds.
  **Unverified by me.**
