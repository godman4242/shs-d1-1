# progression — LENS 3 (PRECEDENCE) critic

Blind review. I did not see the surveyor's reasoning. Every verdict below cites an
artifact **I** opened this pass. §0 law applied throughout; where a measurement doc
and a frame disagree I say so out loud.

**Headline: 18 of 20 claims survive. 2 are REFUTED, both for the same precedence
sin — importing an ANDROID v0.682 number into a WEB v0.717 recreation, in one case
directly contradicting the web payload AND contradicting the ledger line the
surveyor was trying to correct.**

The lane's own best claim (`per-point-magnitudes`) establishes the rule "Android is
a decoder ring, not a tuning source." Two sibling claims break that rule.

---

## What I re-derived first-hand

| # | Check | Command / artifact | Result |
|---|---|---|---|
| 1 | expArray is real, 99 entries, byte-identical in 3 places | parsed `§1t1523s0§.as:364`, `§1t29s0§.as:28`, `StatsManager.as:78` | identical hash, len 99, `[11]=37400 [20]=108000 [40]=507300 [60]=1508800 [80]=4285800 [98]=29395800` ✅ |
| 2 | extrapolation divergence | recomputed `31400 + Σ(5500+(k−10)·500)` vs expArray | L12 +0.9%, L20 +5.5%, L40 −15.5%, L60 −37.4%, L80 −61.3% — **all five reproduce exactly** ✅ |
| 3 | test output | `npx vitest run tests/xp.test.ts` | `Test Files 1 passed (1) · Tests 11 passed (11)` ✅ |
| 4 | frame t=1600 | `ffmpeg -ss 1600` + `crop=iw*0.62:ih*0.55:iw*0.36:ih*0.10 scale=1.4×` | badge **4**, `5110 / 5150 EXPERIENCE POINTS`, `AVAILABLE STAT POINTS: 0`, HP 20/20, CHI 9/15, AP 15/30, ATK 10, DEF 10 **+13**, SPD 4, `WEIGHT: 73 / 100`, GOLD 3 ✅ |
| 5 | frame t=655 | same crop | badge **3**, `2098 / 2950`, `AVAILABLE STAT POINTS: 0`, `WEIGHT: 38 / 100` ✅ |
| 6 | web vs android stat-point handlers | `§1t5957s0§.as:3390-3445` vs `InventoryUI.as:2415-2453` | web +10/+5/+5/+3/+3/+3 · android +5/+5/+1/+1/+1/+1 ✅ |
| 7 | web calcXP parity (surveyor never cited it) | `§1t68s0§.as:184-208` | web `1 + 0.05*(param2-param1)`, `/§1t12069s0§()`, `*= 2` elite — **structurally identical to android** ✅ |
| 8 | web AP-regen parity (surveyor never cited it) | `§1t1523s0§.as:1459-1478` | `floor(diff/60)+1`, `*= 2` on AP buff, clamp to MAXAP — **full web parity** ✅ |
| 9 | web doRebirth gold | `§1t1523s0§.as:2638-2656` | **+25 hard gold, +100 at Dan 8** ⚠ |
| 10 | 69 `<exp>` / 33 `<lvlreq>` | `grep -c` on questdata.xml / skilldata.xml | 69 ✅ · 33 ✅ (histogram matches the surveyor's ladder level-for-level) |

---

## REFUTED

### R1 — `progression/levelup-refill-and-cap` · **material**

The claim is cited **100% from `shs3_android`** and one of its shipped payloads is
flatly wrong for the target build.

The surveyor's lane_impact offers, as a *cross-lane gift to rebirth-elements
blocker ③*: **"rebirth paying +5 gold or +20 at Dan 8 (StatsManager.as:2201-2208)."**

The WEB payload says otherwise — `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651`:

```
if(§1t7356s0§(§1t9426s0§) == 8)
{
   §1t9713s0§(§1t9413s0§,100);      // §1t9413s0§ :int = 12 == STAT_HGOLD
   ...
}
else
{
   §1t9713s0§(§1t9413s0§,25);
}
```

**Web = +25 gold, +100 at Dan 8. Android = +5 / +20.** A 5× divergence.

This is the precedence sin twice over:
1. It contradicts the payload the recreation actually targets (v0.717).
2. It contradicts **the ledger's own line**, which is *correct*: REBUILD_READINESS
   rebirth-elements "Ready" bullet reads `1000c scroll, L80, +25g`. The surveyor was
   in the business of correcting the ledger and here overturned a line that was right.

Also Android-only and **absent from the web build entirely**: the `autoAssignStats`
round-robin (`StatsManager.as:1655-1687`). The web `levelUp()` is the whole of
`§1t1523s0§.as:2072-2081` and has no such branch — I read it end to end. Porting it
would inject a mode the web game never had.

**What survives** (I re-verified in web): `levelUp` refills HP+Chi (`§1t9578s0§()`),
AP (`§1t9712s0§(§1t9414s0§, §1t7356s0§(§1t9415s0§))`) and duel tokens
(`§1t9712s0§(§1t9416s0§, §1t9400s0§)`); `levelCap = 80` at `§1t1523s0§.as:362`.
Bonus divergence found while checking: web `MAXDUELTOKENS = 40` (`§1t1523s0§.as:200`),
android `= 30` (`StatsManager.as:166`).

### R2 — `progression/xp-income-model` · **material**

The *structure* is held — and I confirmed the web parity the surveyor never cited
(`§1t68s0§.as:184-208`). But two statements inside the claim are wrong:

**(a) "`lvl * 5 + 45` (duellist/PvP base)" — wrong attribution.** This is the base
XP for essentially every *coded* enemy class, not for duellists:

```
$ grep -rln "xp = level \* 5 + 45" reference/decompiled/shs3_payload/scripts/ | wc -l
      14
$ grep -rln "xp = level \* 2 + 20" reference/decompiled/shs3_payload/scripts/ | wc -l
       2
```

Named in the android build, `lvl*5+45` belongs to **EnemyFox, EnemyCivilian,
EnemySpearElite, EnemyNianMonster, EnemyWolf, EnemyWolfAlpha, EnemyStag, EnemyBear,
EnemyDeer, EnemyOgre, EnemyBoar, EnemyElite** *and* EnemyPlayer. `level*2+20` is the
generic XML-driven `NPC` base only (`NPC.as:218`, `:252`; web `§1t4574s0§.as:39`,
`§1t4570s0§.as:34` — both `extends §1t68s0§`). Implementing "mobs = 2n+20, duellists
= 5n+45" would under-pay every wolf, bear and ogre in the game by ~2.5×.

**(b) "symmetric under/over-level scaling" — wrong.** The two branches are not
symmetric and not even the same shape:

```
if(playerLevel < mobLevel)  finalXP = xp * (1 + 0.05 * (mobLevel - playerLevel));   // +5%/level, multiplier
else if(playerLevel > mobLevel) finalXP = xp * (1 - (playerLevel-mobLevel)/getZeroDifference());  // −1/zeroDiff per level
```

`getZeroDifference()` is 5 below level 8 → the over-level penalty is **−20% per
level** against a +5%-per-level under-level bonus. Four-to-one asymmetry.

---

## Precedence caveats that did NOT reach refutation

- **`frame-confirms-xp-caps` — the stated crop is wrong.** I ran the surveyor's exact
  `crop=iw*0.55:ih*0.20:iw*0.42:ih*0.16 scale=1.7×` at t=1600: it clips the XP number
  at the top edge and cuts off AP, SPD and WEIGHT at the bottom. Every observation
  listed is nevertheless **true** — I confirmed all of them at
  `crop=iw*0.62:ih*0.55:iw*0.36:ih*0.10 scale=1.4×`. §0 requires the crop be stated
  so it can be checked; state the working one. Substance stands.
- **`post-rebirth-sp`** — the closed form lives in `unAssignSkillPoints()`, which
  `doRebirth()` does **not** call (the surveyor says so itself). So
  `SP = (level−1) + Dan·79` is the *respec-restore invariant*, not a rebirth-time
  grant; post-rebirth SP actually accrues +1/level through `levelUp()`. Same total,
  different mechanism — implement the mechanism, not the formula.
- **`per-stat-hard-caps`** — the cited lines set `statsPanel.*add.visible`, i.e. they
  gate the **+ button**, not a server clamp. The surveyor's sibling `271` claim words
  this correctly ("hard per-stat UI cap"); this one says "hard-capped" unqualified.
  The ceilings themselves are exact (HP 910 · Chi 460 · AP 480 · ATK/DEF/SPD 271).
- **`spd-scaling`'s cross-lane gift** — see NF6. The formula is verbatim-correct in
  both builds, but it does **not** close combat-core blocker ① as stated, because
  nobody has reconciled payload px with the frame-measured stage px.
- **`xp-curve-l11-80` novelty** — true and correctly cited, but it is a
  re-derivation of a finding already banked earlier in *this* gauntlet run:
  `docs/gauntlet/L0/sources/actionscript.md:62-64` ("expArray[11] = 37400,
  expArray[80] = 4285800") and `docs/gauntlet/L0/run2/CLAIMS.md:1975`. It still kills
  ledger blocker ② and §6 line 350. Score novelty accordingly.

---

## NEW FINDINGS the surveyor missed

**NF1 — web rebirth gold is +25 / +100, not +5 / +20.** `§1t1523s0§.as:2644-2651`.
Vindicates the ledger; refutes R1's cross-lane gift.

**NF2 — MAXDUELTOKENS: web 40, android 30.** `§1t1523s0§.as:200` vs
`StatsManager.as:166`. Third independent proof of build divergence.

**NF3 — `autoAssignStats` does not exist in the web build.** Web `levelUp()` is
`§1t1523s0§.as:2072-2081`, ten lines, no stat bucket. Android-only feature.

**NF4 — the per-stance modifier table is IN THE PAYLOAD** (`InventoryUI.as:1940-1970`).
This is the multiplier half of combat-core blocker ① and nobody in this lane cited it:

| stance | dmgModifier | critModifier | defModifier | **slashModifier** |
|---|---|---|---|---|
| Light | 0.5 + 0.005·mastery | 1.2 | 1 | **1.5** (flat) |
| Balanced | 1 + 0.005·mastery | 1.5 | 1 | **1 + 0.005·mastery** |
| Heavy | 1.5 | 1.5 | **0.8** | **0.5 + 0.005·mastery** |

Consumed at `InventoryUI.as:2232`:
`"slash distance: " + int(baseSlashLength * slashModifier) + " (" + stanceName + ")"`.
`defModifier` Heavy 0.8 independently corroborates `def-mitigation-is-flat`.
Also verified: `STAT_SPEED` appears in **no** file outside StatsManager/InventoryUI —
the claim "SPD never touches damage" is a true universal negative.

**NF5 — the android per-stat caps are a different formula entirely**
(`InventoryUI.as:2407-2412`): HP `10+(L+10)*5`, Chi `10+(L+10)*5`, AP `20+(L+10)`,
ATK/DEF/SPD `L+10`. At L80 android caps ATK at **90**; web caps it at **271**.
This *strengthens* `271-cap-explained`: 271 is a web-only number, so the ledger's
"271" was always a web observation.

**NF6 — ⚠ FRAME-vs-PAYLOAD, UNRECONCILED. The frame wins; say so.**
`COMBAT_MEASUREMENTS.md §c-2` (which carries its own frame cites, n=17/17/25) measured
reach in stage px on a level-8 character: **Light max 303, Heavy plateau 97–103**;
Balanced 116–131 on a *level-1* character.

- Ratio check **passes**: payload predicts Light/Heavy = `1.5 / (0.5+0.005·m)` = **3.00**
  at mastery 0; frame gives **303/100 = 3.03**. Independent confirmation of NF4.
- Absolute check **fails**: both frame readings imply `baseSlashLength ≈ 202`
  (303/1.5 = 202; 100/0.5 = 200). Inverting the payload formula
  `120 + floor((90+Dan·5)·s/(20+s)) = 202` needs **s ≈ 205** at Dan 0 — but the
  level-8 per-stat cap (NF5, web) is `1+(8+10)*3 = 55`, and the Dan-0 asymptote is
  **210 total**, so 202 is barely inside the formula's entire range and unreachable
  by a level-8 character.

⇒ There is an unestablished unit/scale factor between "stage px" in the measurement
doc and px in the payload. **Do not port 120/210 as stage px.** By the standing
invariant the frame wins on the stage-px values; the payload contributes the *shape*
(base × stance modifier × mastery), not the magnitude. `spd-scaling`'s lane_impact
should be downgraded from "the one value the whole model needs" to "the model's
shape; magnitude still frame-bound."

---

## Net effect on the lane

- Blockers ①②③ die as claimed; ④ dies on the kill+quest side, PARTIAL on gather.
- Ledger §6 line 350 loses the L11–80 XP curve.
- Two "Ready"-bullet corrections stand (+5 AP not +1; 79 SP not 80).
- The Surface bullet's 271 arithmetic is correctly refuted.
- **Do not propagate** the +5/+20 rebirth gold or the `autoAssignStats` mode.
- Score 88 is defensible on evidence but ~3-4 points generous: it counts a
  previously-banked expArray finding as new, and ships two Android-tuned numbers.
