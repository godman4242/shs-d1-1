# L0 CRITIC — `combat-core` · LENS 3 (PRECEDENCE)

- **Reviewer:** blind critic, precedence lens (hunts STALE-claiming)
- **Date:** 2026-08-15
- **Verdict on the unit:** **score 78 is not supportable. Recommend 55–60.**
- **Headline:** the survey read the **wrong build** and then told L5 to overwrite
  **correct** live config with it. Two claims are FATAL, three MATERIAL.

---

## §1 THE ONE FINDING THAT UNWINDS THE SURVEY

The survey's own caveat (a) — *"every source cite is the ANDROID v0.682 client and
parity with the web v0.717 is unproven"* — is correct, and then **every single
lane_impact ignores it** and instructs L5 to adopt the v0.682 number.

The premise that made that safe is false. Claim `combat-core/build-version-parity`
says:

> "The web payload's own AS3 is obfuscated
> (`reference/decompiled/shs3_payload/scripts/§1t51s0§/`, 5 files) and cannot be
> cross-read."

**That is wrong.** `reference/decompiled/shs3_payload/scripts/` holds **1,079 `.as`
files**. Class and member *names* are obfuscated; **the code bodies are plain**.
The survey's own proposed close-path — *"locate the same expressions in the
obfuscated web AS3 by numeric-literal shape (120/90/5/20, 5\*24, 50/40/30)"* —
takes about four `grep`s. I ran them. Build identity was already settled too:

```
reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:36
      public static var §1t9323s0§:Number = 0.717;
reference/decompiled/shs3_android/scripts/StatsManager.as:30
      public static var clientVersion:Number = 0.682;
```

`docs/DIVERGENCES.md` §"Source dive (2026-07-25)" already states this verbatim, and
`docs/research/fidelity/SOURCE_CONSTANTS.md` (515 lines, same date) already publishes
**the v0.717 constants** — including most of what this survey re-derives from v0.682.

So `build-version-parity` is not `STILL_UNHELD`. It is **HELD, and it says the
opposite of what the survey assumed**: where the builds differ, **v0.717 matches the
repo's existing config**, not the android read.

---

## §2 SIDE-BY-SIDE — v0.717 (target) vs v0.682 (what the survey cited)

All v0.717 lines from `reference/decompiled/shs3_payload/scripts/§1t99s0§.as`
(the `MCSPlayer` analogue; obfuscated names, verbatim bodies).

| quantity | v0.717 WEB (target) | v0.682 android (survey) | live config | survey said |
|---|---|---|---|---|
| light reach mult | `*4420 * 1.4` (:3094) | `* 1.5` | `reach.ts lightMult 1.4` ✅ | "wrong, use 1.5" ❌ |
| balanced reach | `* (1 + 0.2*m*0.1)` = **0.02/m** (:3105) | `0.005/m` | `balancedPerMastery 0.02` ✅ | "wrong, use 0.005" ❌ |
| heavy reach | `* (0.5 + 0.4*m*0.1)` = **0.04/m**, floor 100 (:3116-3119) | `0.005/m`, floor 100 | `heavyPerMastery 0.04` ✅ | "wrong, use 0.005" ❌ |
| damage curves | light `0.5+0.04m` · bal `1+0.02m` · heavy **×1.4** (:3258-3271) | `0.5+0.005m` · `1+0.005m` · ×1.5 | matches ✅ | "0.005 / ×1.5" ❌ |
| **crit** | **`return _loc2_ * 1.3 + critBonus`** (:3272-3276) | ×1.5 light / ×1.2 other | `CRIT_MULT = 1.3` ✅ | **"never 1.3"** ❌ |
| focus ceiling | **`8 * 24` = 192** (:249) | `5 * 24` = 120 | `FOCUS_MAX = 192` ✅ | "120" ❌ |
| stance-switch cost | **flat 48, gated `>= 48`** (:3050, :3060, :3162) | `maxreload/6`, `>1/2 → 1/3` | `FOCUS_SWITCH_COST = 48` ✅ | "1/6 meter" ❌ |
| slash spend | `/2` · `×1` · `×1.5` of `slashUsage` (:3301-3311) | same | `FOCUS_SPEND {24,48,72}` ✅ | same ✓ |
| bonus reload | `+= 6` (:3320) | `+= 6` | `FOCUS_KILL_BONUS = 6` ✅ | same ✓ |
| reach base | `120 + Math.floor(_loc2_*spd/(20+spd))`, `_loc2_ = 90 + dan*5` (`§1t1523s0§.as:2346-2347`) | identical | `reach.ts` ✅ | ✓ |
| mastery ladder | 3 / 4 / 5, heavy launch **3** (:3221-3244) | identical | `stances.ts heavy: 5` ❌ | ✓ **real bug** |
| heavy defence | `defense * 0.8` (:3284-3290) | identical | ✅ | ✓ |

**Consequence.** `reach.ts`'s `1.4 / 0.02 / 0.04` and `combat.ts`'s `CRIT_MULT 1.3`
and `FOCUS_MAX 192` were **read out of the v0.717 payload on 2026-07-25**
(`SOURCE_CONSTANTS.md` §142-143, §157, §169-175, §193, §204-206). The survey's
assertion that *"reach.ts's own comment shows they were back-derived from the legacy
0.9/1.2/1.4 triple, not read from the payload"* is false — and the direction of the
error is exactly backwards: the legacy `0.9/1.2/1.4` triple **is** those curves at
mastery 10, which is why the comment says so.

Acting on `combat-core/reach-stance-mults` and `combat-core/crit-multiplier` would
**introduce four regressions into currently-correct CONTRACT-SRC config.**

---

## §3 THE FILL-RATE "PARITY BREAK" DOES NOT EXIST

`combat-core/crit-meter-fill-rate` is the survey's stated proof that
"v0.682 combat tuning ≠ v0.717", and the reason the score is held off the 90s.

**The pixel work is sound** — I re-scanned row `y=1032` on all five frames and
reproduced the fill edges to ±1 px (`245→282 / 291 / 304 / 341 / 371`). Credit where
due: the fills are fully contiguous, so the measurement is immune to the
`COMBAT_MEASUREMENTS.md` §744 "text overprint fools a white-pixel detector" trap.

**But three things sink the claim:**

1. **The track width is wrong.** The survey used 263 px. The Chi bar is *full*
   (31/31) on `crit-focus/t1003.000.png` and spans exactly **x = 245 … 513 = 269 px**
   (my scan, rows 1008 and 1010). `COMBAT_MEASUREMENTS` f-4 says 268, f-8 says
   269–270. 263 is 2.3 % narrow and is where the low 5.8 s comes from.
2. **The repo already measured this, better, and the survey never cites it.**
   `COMBAT_MEASUREMENTS.md` f-9: *"empty → full **6.00 s**, agreeing to 0.5 %
   (6.01 / 6.00 / 5.98), 3 independent 60 fps regressions"*; f-5/f-6: 45.5 px/s ⇒
   5.9 s. §0 admits ledger numbers as **A4** — citing frames while an A4 with the
   same frames exists, and landing 3.3 % off it, is a precedence miss.
3. **There is no source↔frame conflict at all.** v0.717's meter is `8 * 24 = 192`
   raw at +1/frame = 8.000 s, displayed `(x − 48)/144` ⇒ visible span **144 frames
   = 6.000 s @24 fps**. That *is* the measured number. The "android predicts 4.00 s"
   discrepancy is manufactured entirely by reading v0.682's `5 * 24`.

Also: **"THE MEASUREMENT DOC AND THE FRAME DISAGREE, SO THE FRAME WINS" is a
mis-invocation of the standing invariant.** No measurement doc disagrees. The
measurement doc **agrees with the frame**, and both agree with the v0.717 source.
Invoking the invariant to license a number that is worse than the one already banked
is the precedence failure this lens exists to catch.

---

## §4 STALE-CLAIMING (substance right, novelty wrong)

None of these are *false*; all are presented as new closures of a ledger that a later
pass already closed. `REBUILD_READINESS.md` is the **2026-07-20** ledger; the source
dive (07-25), SESSION 11 (07-25), SESSION 13 and §S24 (08-12) all postdate it.

| claim | already banked at |
|---|---|
| `reach-cap` "blocker ① dead" | `DIVERGENCES.md` "CONTRADICTED §2 — `STANCE_TABLE.reach` is wrong in kind … stat-driven formula `base = 120 + floor((90+5·dan)·A/(20+A))`"; `src/config/reach.ts` header |
| `reach-is-arclength` "a model the repo asserted without a source" | `SOURCE_CONSTANTS.md:197` *"reach is the total ARC-LENGTH budget of the stroke you draw, spent segment by segment"*; SESSION13 **B3** landed `truncateTo`, `RESAMPLE_SPACING → 20` |
| `crit-gating` "an entire third combat resource … that no ledger system records" | `src/config/combat.ts:69-116` — `FOCUS_MAX 192`, `FOCUS_FILL_PER_S 24`, `FOCUS_KILL_BONUS 6`, `FOCUS_DISPLAY_OFFSET/SPAN 48/144`, `FOCUS_SWITCH_COST 48`, `FOCUS_SPEND {24,48,72}`, all `CONTRACT-SRC` |
| `crit-meter-exists-in-web-build` "correcting SESSION-11's 'no Critical meter'" | `COMBAT_MEASUREMENTS.md` **§00b CORRECTIONS**, row f-8/f-10: *"❌ WRONG. Focus **IS** the crit meter … prints 'CRITICAL HIT' (A t=1747.000, t=2175.933)"* — **"these corrections win"**. `m_nearfull.png` is that pass's own exhibit. |
| `pass-through-dash` "combat-sim.ts's 105.9 px … needs replacing" | `src/config/combat-sim.ts:69-78` already **deletes** `DASH_SLASH_PX` and exports `DASH_SPEED_PX_PER_FRAME = {50,40,30}`; `SOURCE_CONSTANTS.md:229,242` |
| `damage-formula` "damage is a RANDOM roll" | `DIVERGENCES.md` "CONFIRMED — damage is a **roll** (`minDamage + rand × damageRange`)" |
| `early-ttk` | `DIVERGENCES.md` "**CONFIRMED ×2 — mobs die in one hit**" — and with a mechanism the survey missed: `setLevel` forces `if (lvl <= 10) { damage = 1; defense = 1; maxHP = 1; }`, which overrides the Thug's `<defense>3</defense>` the survey computed against |
| `heavy-def-0.8`, `stance-triangle`, `150pct-damage-is-a-buff` | `DIVERGENCES.md` "CONFIRMED — our value was already right"; `stances.ts` `STANCE_BEATS` comment; `COMBAT_MEASUREMENTS` c-6 |
| `build-version-parity` "must be labelled CONTRACT-SRC-v0.682" | `DIVERGENCES.md`: android tables *"are therefore tagged `CONTRACT-SRC (0.682)` and must never be quoted as 0.717"* — standing since 07-25 |

## §5 WHAT SURVIVES, AND IS WORTH SHIPPING

1. **`launch-unlock-levels` — the one clean live-config bug.** I confirmed the ladder
   is **identical in v0.717** (`§1t99s0§.as:3221-3244`: light `>=3/4/5`, balanced
   `>=3/4/5` with launch at 5, heavy `>=3/4/5` with launch at **3**).
   `src/config/stances.ts LAUNCH_UNLOCK_LEVEL.heavy = 5` is wrong on the target
   build. **Fix it.** Reversed/Dual granting all five unconditionally (`:3245-3252`)
   is also real and unmodelled.
2. **`gesture-classifier` thresholds are not in config.** `SOURCE_CONSTANTS.md:235`
   banked "4 points or 20 px", but `src/config/gesture.ts` carries only
   `GESTURE_DIAG_DEG = 45`. The survey's **AND** reading is also more precise than
   the doc's "or" (`InputManager.as:268`: `drawArrayLength > 4 && distSQ > 400`).
   Wire them — after re-reading them on v0.717.
3. **`hit-registration-instant-at-endslash`** answers a question `DIVERGENCES.md`
   explicitly left open. Downgrade **HELD → PARTIAL**: the same DIVERGENCES entry
   records a *frame* observation in tension with it — *"damage appeared to resolve
   over the whole dash sweep … two enemies behind a line's near end died in one
   slash"*. Frame beats source until re-measured.
4. **`slash-type-map`** — quote verified verbatim (`MCSPlayer.as:2441-2456`). Nine
   types is genuinely more structure than the ledger's one-line "gesture→attack map".

## §6 A CORROBORATION THE SURVEY LEFT ON THE TABLE

`COMBAT_MEASUREMENTS.md` c-2 measured reach on frames and gave up on Balanced:
*"Balanced ❌ NOT CONFIRMED — measured 131 … the Balanced gap cannot be resolved
from this footage."* **The source formula resolves it.**

- Balanced was measured on the **level-1** tutorial fight. `base(SPD 1, dan 0)
  = 120 + floor(90·1/21) = 124`; balanced ≈ `base × 1.0`. Measured plateau
  **116–131**. The wiki's 200 was simply wrong.
- Heavy's measured plateau **97–103** on a level-8 character is the source's **hard
  floor clamp** `if (slashLength < 100) slashLength = 100` — a far better explanation
  than "mastery-9 ceiling", and it holds for *any* mastery.
- Light plateau **233–241** = `1.4 × base` for `base ≈ 167` (SPD ≈ 19 at level 8) —
  consistent, and it is the v0.717 `1.4`, not the survey's `1.5`.

That is **three frame-measured numbers reproduced by the v0.717 constants across two
different character levels** — the parity evidence the survey said did not exist, and
a direct overturn of c-2's "unresolvable".

## §7 SCORE

78 assumes five blockers closed at authoritative source. Two of the five
(**② crit**, and the reach half of **①**) are closed at the **wrong** source and
resolve the other way on the target build; **⑤** was already closed in config; **③**
was already `CONFIRMED ×2`; **④** and the hit-window are real gains.
Net new, correct, actionable output for this lane: **one config bug (heavy launch),
one un-wired threshold pair, the slash-type taxonomy, and the multi-target /
hit-window answers.** That is a **55–60**, not a 78.
