# GAUNTLET L0 — BLIND CRITIC (Lens 3, PRECEDENCE) — unit: `progression`

Reviewer: precedence critic. Pass date 2026-08-15.
Surveyor journal under review: `docs/gauntlet/L0/systems/progression.md` (claimed 88/100).
I did not see the surveyor's reasoning — only its claim list and the artifacts.

**Headline: 20/20 claims SURVIVE.** I opened an artifact for every one. Nothing is
refuted. This is the cleanest unit I have audited: every one of the ~60 line cites I
spot-checked resolved to the quoted text, the obfuscated-symbol decoder ring is
independently verifiable, and the one frame-vs-payload adjudication is correct — I
re-derived it from my own crops and it holds by a wider margin than the surveyor
claimed.

Lens 3 asks: *does this claim import a doc statement that a later measurement, ruling
or frame overturned?* **It does not.** The direction of travel is the opposite one:
this unit overturns docs, and I found **three more documents** carrying the dead claim
that the surveyor did not name.

I file **7 new findings** — 1 material correction, 5 strengthenings, 1 extra ledger kill.

---

## §A — What I verified first-hand (method)

Commands run, not inherited:

- `python3` parse of `§1t1523s0§.as:364` and `StatsManager.as:78` → both arrays
  **99 entries, string-identical** (`ra == rb` → `True`), and the third copy at
  `§1t29s0§.as:28` identical too. `expArray[11]=37400 · [20]=108000 · [40]=507300 ·
  [60]=1508800 · [80]=4285800 · [98]=29395800`.
- `npx vitest run tests/xp.test.ts --reporter=verbose` → 11/11 pass, test names
  verbatim as quoted.
- **My own ffmpeg crops of video A** (not the surveyor's): `-ss 1600`, `-ss 653.0`,
  `-ss 656.5`, `-ss 655`, each `crop=iw*0.55:ih*…:iw*0.42:ih*…` + `scale=2×` lanczos.
  Read with my own eyes.
- Raw-XML re-derivation of every index count I relied on
  (`ElementTree`: 69 `<exp>` rows 100–3000; 160 enemy `<lvl>` rows 2–35; 33 `<lvlreq>`).
- Decoder-ring audit: grepped the web stat-id constants and matched them one-by-one
  against the Android clear names.

### The decoder ring is sound (this is what licenses every A2 in the unit)

| web symbol | value | android name | id |
|---|---|---|---|
| `§1t9403s0§` | 1 | `STAT_MAXHP` | 1 |
| `§1t9406s0§` | 4 | `STAT_MAXCHI` | 4 |
| `§1t9408s0§` | 6 | `STAT_ATTACK` | 6 |
| `§1t9409s0§` | 7 | `STAT_DEFENSE` | 7 |
| `§1t9410s0§` | 8 | `STAT_SPEED` | 8 |
| `§1t9411s0§` | 10 | `STAT_LEVEL` | 10 |
| `§1t9415s0§` | 14 | `STAT_MAXAP` | 14 |
| `§1t9418s0§` | 17 | `STAT_SKILLPOINTS` | 17 |
| `§1t9419s0§` | 18 | `STAT_STATPOINTS` | 18 |
| `§1t9426s0§` | 25 | `STAT_DAN` | 25 |

Every one checked (`grep -n "§1t94..s0§:int"` on `§1t1523s0§.as:206–254`). The mapping
is not asserted, it is **arithmetically forced** — the integers match.

I also closed the one mapping the surveyor asserted without proof:
`§1t9609s0§` **is** `addMaxAP` — `§1t1523s0§.as:2807-2809` reads
`public static function §1t9609s0§(param1:int) : * { §1t9713s0§(§1t9415s0§,param1); … }`
= `changeStat(STAT_MAXAP, param1)`. So `§1t9609s0§(5)` really is **MAXAP +5 per
point**, and the ledger's `+1AP` really is wrong. That sub-claim was the one load-
bearing link with no cite behind it; it now has one.

---

## §B — The frame adjudication, re-derived independently

The surveyor rests `progression/per-point-magnitudes` on ONE frame and a budget sum.
I re-cut the frames myself and found a **stronger, assumption-free proof**.

**Frame 1 — video A `-ss 653.0` and `-ss 656.5`** (crop `iw*0.55:ih*0.30:iw*0.42:ih*0.15`,
1.5× lanczos). Visibly in the crop, on both ticks:
> level badge **3** · `2098 / 2950` EXPERIENCE POINTS · `AVAILABLE STAT POINTS: 0` ·
> **HP 20/20** · **CHI 10/10** · **AP 30/30** · **ATK 7** · **DEF 7 + 2** (the `+2`
> in orange) · **SPD 4**

**Frame 2 — video A `-ss 1600`** (crops `…ih*0.30:…ih*0.12` and `…ih*0.30:…ih*0.36`, 2×):
> level badge **4** · `5110 / 5150` EXPERIENCE POINTS · `AVAILABLE STAT POINTS: 0` ·
> **HP 20/20** · **CHI 9/15** · **AP 15/30** · **ATK 10** · **DEF 10 + 13** ·
> **SPD 4** · `WEIGHT: 73 / 100`

**The differential proof.** Between the two frames the player gained exactly one level,
i.e. **exactly 3 stat points** (`§1t1523s0§.as:2075` grants `STATPOINTS +3`), and both
frames read `AVAILABLE STAT POINTS: 0`, so all 3 were spent. The deltas are:

| stat | L3 | L4 | delta | web cost | android cost |
|---|---|---|---|---|---|
| max Chi | 10 | 15 | **+5** | 1 pt (`+5`) | 1 pt (`+5`) |
| ATK | 7 | 10 | **+3** | 1 pt (`+3`) | 3 pts (`+1`) |
| DEF (base) | 7 | 10 | **+3** | 1 pt (`+3`) | 3 pts (`+1`) |
| | | | **total** | **3 ✓** | **7 ✗** |

This is strictly stronger than the surveyor's absolute-budget argument because it is a
**delta** — it cannot be confounded by gear folded into a displayed max (and the HUD
shows gear separately anyway: `DEF 7 + 2` → `DEF 10 + 13`). Only **7 stat points**
would buy that delta under Android magnitudes; only **3** exist. **THE FRAME WINS, and
it names the WEB build.**

The absolute fits corroborate at both levels, from base `HP10/Chi10/AP30/ATK1/DEF1/SPD1`:
- L3, budget 6: `HP 20`(1) + `Chi 10`(0) + `AP 30`(0) + `ATK 7`(2) + `DEF 7`(2) + `SPD 4`(1) = **6 ✓**
- L4, budget 9: `HP 20`(1) + `Chi 15`(1) + `AP 30`(0) + `ATK 10`(3) + `DEF 10`(3) + `SPD 4`(1) = **9 ✓**

And `expArray[3]=2950` / `expArray[4]=5150` are the on-screen caps, to the digit.

---

## §C — Verdicts (20/20 survive, 0 refuted)

| # | claim | verdict | note |
|---|---|---|---|
| 1 | `xp-curve-l11-80` | **SURVIVES** | 99 entries, byte-identical across 3 copies, verified by parse |
| 2 | `inferred-extrapolation-error` | **SURVIVES** | I re-derived the extrapolation: L80 → 1,658,900 vs real 4,285,800 = **−61.3%** ✓ |
| 3 | `l1-l10-caps-confirmed` | **SURVIVES** | 11/11 green; config == `expArray[1..10]` exactly |
| 4 | `frame-confirms-xp-caps` | **SURVIVES** | re-cut both frames myself; readings identical |
| 5 | `per-point-magnitudes` | **SURVIVES + STRENGTHENED** | see §B; also `§1t9609s0§` = `addMaxAP` now proven |
| 6 | `per-stat-hard-caps` | **SURVIVES** | `§1t5957s0§.as:3341-3346`; I confirmed `_loc7_`/`_loc8_` (DEF/SPD) use the same `1+(L+10)*3` |
| 7 | `271-cap-explained` | **SURVIVES** | 271 = 1+3·90 is *exactly* on the `+3` lattice from base 1 — the cap is hit, not overshot |
| 8 | `start-pools-and-respec` | **SURVIVES** | web `:2561-2577` exact; corroborated by a third frame (see NF5) |
| 9 | `post-rebirth-sp` | **SURVIVES** | `:2598` / `:2156` exact; `doRebirth` really does *not* call `unAssignSkillPoints` |
| 10 | `sp-first-run-off-by-one` | **SURVIVES** | web `§1t1523s0§.as:2074-2075` exact — the one cite I had not seen checked |
| 11 | `levelup-refill-and-cap` | **SURVIVES** (minor) | three quoted line numbers are off by one; lane_impact needs the parity flag — **NF1** |
| 12 | `def-mitigation-is-flat` | **SURVIVES** | both builds; string table corroborates "Defense -20%" verbatim |
| 13 | `spd-scaling` | **SURVIVES** (minor) | all four web cites exact incl. `/600` vs `/300`; the ×1.5 buff does **not** touch reload |
| 14 | `xp-income-model` | **SURVIVES + STRENGTHENED** | web parity now established — **NF2** |
| 15 | `quest-xp-tabled` | **SURVIVES** | 69 rows / 100–3000 re-derived from raw XML |
| 16 | `unlock-cadence-to-l80` | **SURVIVES** | 33 gates, per-level counts match the surveyor's ladder *exactly* |
| 17 | `campaign-level-band` | **SURVIVES** | 142 + 18 rows, 2–35, re-derived |
| 18 | `ap-regen` | **SURVIVES** | `APINTERVAL=60` both builds |
| 19 | `levels-81-99` | **SURVIVES (correctly STILL_UNHELD)** | honest; I add a datum that keeps it unheld |
| 20 | `xp-from-gather-and-dungeon` | **SURVIVES (correctly PARTIAL)** | A-04 line 32 is verbatim |

### Residual defects (none fatal, all recorded)

1. **Off-by-one in three quoted line numbers**, claim 11: `:1688 fullHealth()` /
   `:1689 setStat(STAT_AP…)` / `:1690 setStat(STAT_DUELTOKENS…)` are actually
   **1689 / 1690 / 1691**. The containing range in the cite field (`:1646-1692`) is
   correct and the quoted text is verbatim, so this is a slip, not a mis-cite of
   substance. Same shape in claim 18: the quoted `:1099-1103` is really `:1100-1105`,
   inside the correct `:1090-1115` range.
2. **`spd-scaling` over-generalises the speed buff.** `hasBuff(BUFF_SPEED) → speed *= 1.5`
   appears in `getSkillCooldownModifier` (`§1t1523s0§.as:2284`) and `getBaseSlashLength`
   (`:2339`) — but **not** in `getBaseReload` (`:2276`, no buff branch). Slash reload is
   not sped up by the buff. Fix the wording, keep the claim.
3. **`xp-income-model` calls the scaling "symmetric".** It is not: under-level is
   `×(1 + 0.05·Δ)`, over-level is `×(1 − Δ/zeroDiff)` — two unrelated shapes. The
   verbatim quote in the claim is correct, so a reader is not misled; the summary
   sentence is.

---

## §D — NEW FINDINGS

### NF1 — ⚠️ MATERIAL: `autoAssignStats` is **ANDROID-ONLY**; the web build has no such mode

Claim 11's lane_impact surfaces "an autoAssignStats mode (`StatsManager.as:1655-1687`)
that round-robins the 3 points" as a newly-found mechanic. It is real — **in the Android
v0.682 build only**. The web v0.717 `levelUp()` is six lines long and has no branch:

```
§1t1523s0§.as:2072   public static function §1t9577s0§() : void
:2074                   §1t9713s0§(§1t9418s0§,1);          // SKILLPOINTS +1
:2075                   §1t9713s0§(§1t9419s0§,3);          // STATPOINTS  +3
:2076                   §1t9712s0§(§1t9411s0§,getLevel()); // setStat LEVEL
:2077                   §1t9578s0§();                       // fullHealth
:2078                   §1t9712s0§(§1t9414s0§,§1t7356s0§(§1t9415s0§)); // AP = MAXAP
:2079                   §1t9712s0§(§1t9416s0§,§1t9400s0§);  // DUELTOKENS = MAX
:2082                }
```

There is no `%`-indexed stat bucket anywhere in the web `StatsManager`
(`grep "new Array(§1t9403s0§" → no match`). The Android feature ships with a whole UI
surface the web build lacks: `InventoryUI.as:313` `autoAssignCheckBox.setCheck(…)`,
`:2376` `autoAssignStatsToggle`, persisted at `QueryManagerBase.as:3091/3171`.

**Why this matters:** the round-robin's own magnitudes are the Android ones
(`changeStat(stat,5)` HP / `changeStat(stat,1)` ATK) — i.e. exactly the tuning this
unit's own claim 5 proved the frame refutes. Porting it would inject a non-existent
feature *carrying refuted numbers* into L4. This is the parity trap the surveyor
itself identified in S0-3 and claim 5, and then walked into one claim later.

**Action:** strike `autoAssignStats` from the L4 build list, or keep it explicitly
labelled ANDROID-ONLY / not-in-OG-web. The refill + duel-token half of claim 11 is
unaffected — I verified it in **both** builds.

### NF2 — STRENGTHENS claim 14: the XP-income model has full WEB parity

The surveyor cited the entire kill-XP model from Android (`NPC.as`) alone. Given the
demonstrated tuning drift, that was an unflagged risk. **I closed it.** The web build
carries the same three functions, structurally and numerically identical:

- `§1t68s0§.as:113-128` — grey level: `<6 ⇒ 0` · `<40 ⇒ L − floor(L/10) − 5` ·
  `<60 ⇒ L − floor(L/5) − 1` · else `L − 9` ✓
- `§1t68s0§.as:131-…` — zero-difference ladder `5,6,7,8,9,11,12,13,14,15,16,17,17` at
  breakpoints `8,10,12,16,20,30,40,45,50,55,60,80` — **identical to Android's, value
  for value**
- `§1t68s0§.as:185-208` — `calcXP`: grey cutoff, `+3` cutoff,
  `param3 * (1 + 0.05 * (param2 − param1))`, `param3 * (1 − (param1−param2)/zeroDiff)`,
  elite `×2` ✓

Plus the base-XP literals already had web cites (`§1t4574s0§.as:39` `level*2+20`,
`§1t4902s0§.as:26` `level*5+45`). L4 blocker ④'s kill side is now held **on the shipped
web build**, not by inference from a different SKU.

### NF3 — STRENGTHENS claim 5: a two-frame differential proof (see §B)

`A1` — video A `-ss 653.0`/`-ss 656.5` vs `-ss 1600`. Three points bought
`Chi +5, ATK +3, DEF +3`. Web = 3 points ✓. Android = 7 points ✗. Independent of any
assumption about gear folding into displayed maxima. Record this as the canonical
evidence for the web-build ruling; it is harder to attack than the budget sum.

### NF4 — the dead L11–80 claim lives in **three more documents** the unit did not name

Claim 1 overturns `REBUILD_READINESS.md:200` and `:350`. The same dead statement is
also load-bearing in:

- **`docs/REBUILD_READINESS.md:62`** — *"Some things are structurally unrecoverable …
  the live clan-war population, and the L11–80 XP curve. See §6."*
- **`docs/REBUILD_READINESS.md:93`** — lists `L11–80 XP curve` under 🔷 KNOWN-UNKNOWNS.
- **`docs/GAUNTLET.md:373-374`** — *"it does not claim the server-side systems (live
  clan war, **L11–80 curve**, IAP economy) are recoverable — those are named as
  authored deviations in L11, not hidden."* ⇒ the gauntlet's own charter now
  mis-states what L11 must author. **Lane impact: L11, not just L4.**
- **`docs/CALIBRATION.md:38` row 17** — *"XP curve tail (L11+) | `xp.ts` XP_DELTA_STEP |
  threshold **±5%** vs any future high-level HUD read | +500/level delta growth …
  INFERRED"*. The real curve misses that acceptance band by **−61.3%** at L80. Row 17
  is not merely INFERRED-and-stale, its **gate would have passed a refuted model**;
  rewrite it as CONTRACT against the 99-entry table.

`grep -rln "expArray\|37400" docs/ src/` returns **only** this run's gauntlet artifacts
— confirming the table was genuinely unknown to the project before this pass. The find
is new, and its blast radius is wider than the journal states.

### NF5 — STRENGTHENS claim 8: a third, level-2 frame confirms the start pools

`docs/research/fidelity/COMBAT_MEASUREMENTS.md` §H-1 (line 203), tagged MEASURED and
carrying its own frame cite (`A t≈152 PLAYER screen, re-read at full resolution`):

> *"Early player pools + stats (PLAYER screen, level 2) | **HP green · Chi 10/10 ·
> AP 30/30**; **ATK 1 · DEF 1 (+2) · SPD 1**; weight 14/100; available stat points 3"*

Level 2 ⇒ budget `(2−1)*3 = 3`, and **3 are unspent** ⇒ zero points allocated ⇒ these
are the *virgin* base values. They are `unAssignStatPoints()`'s literals exactly:
`MAXHP 10 · MAXCHI 10 · MAXAP 30 · ATK 1 · DEF 1 · SPD 1`. The surveyor's added
`ATK 1 / DEF 1 / SPD 1` are frame-confirmed, not payload-only.

Related: `docs/research/video-study/segments/A-02-…md:25` observed 3 points producing
`ATK 4→7, DEF 4→7, SPD 1→4` and reasoned *"likely +1 stat point grants +3 to the
underlying stat … treat exact point-to-stat ratio as INFERRED, needs frame-by-frame
replay to confirm"*. That INFERRED flag is now closed by the payload **and** by NF3 —
the study's guess was right. Four independent confirmations of `+3` now exist (A-02,
§H-1, my L3 frame, my L3→L4 delta).

### NF6 — STRENGTHENS the cross-lane gift to L1, and settles a frame dispute L1 could not

Claim 13 hands combat-core the base slash-length getter with the hedge "per-stance
modifiers applied on top". I can do better than hedge — **it reconciles with a frame
measurement that L1 flagged unresolvable.**

`COMBAT_MEASUREMENTS.md §c-2` (method: body → far end of drawn stroke, n counted per
stance, stage px) reports:

| stance | plateau | max | n | wiki | verdict |
|---|---|---|---|---|---|
| Light | 233–241 | 303 | 17 | 300 | ✅ |
| **Balanced** | **116–131** | **131** | 17 | 200 | ❌ **NOT CONFIRMED** |
| Heavy | 97–103 | 121 | 25 | 100 | ✅ |

§c-2 says the Balanced gap "cannot be resolved from this footage" because the only
Balanced combat is the **level-1** tutorial fight. But at level 1 `SPD = 1`
(§H-1 confirms SPD is still 1 at level 2), and the payload gives

`getBaseSlashLength(1) = 120 + floor(90·1/(20+1)) = 120 + 4 = **124** stage px`

which lands **inside the measured 116–131 plateau**. So the base getter ≈ the Balanced
reach (Balanced = ×1.0), the wiki's `200` for Balanced is refuted, and `STANCE_TABLE`'s
Balanced entry should be **124 at SPD 1**, rising along `120 + 90·spd/(20+spd)`.
Corroborating: the string table's Heavy description reads *"slash range is shorter"*
(`strings.json` 6005), matching Heavy 97–103 < Balanced 116–131.

⚠️ Carry one caveat to L1: `§S24-H`'s re-run REFUTED the older 775 px / "≈413 stage px"
stroke reading (*"No normal-anatomy stroke >280 px anywhere re-checked; the 775
refutation REPRODUCED"*). Anyone reconciling reach numbers must use the §S24-H-corrected
figures, not `COMBAT_MEASUREMENTS.md:221`. That is a live precedence trap in the
neighbouring lane, not in this one.

### NF7 — one more ledger sentence dies: the "levels ending 0 / 5" unlock rule is false

`REBUILD_READINESS.md:77` states the progression spine as *"…skills unlock at levels
ending 0 (Ninja) / 5 (Chi)."* The lvlreq table falsifies it on its very first row:
`reference/extracted/skilldata.xml:257` `<lvlreq>3</lvlreq>` for id `1004`
(`displayname` 6007 → **"Roll"**). The real ladder is `3, 5, 10, 15, 20, 25, 30, 35, 40,
45, 50, 55, 60, 65, 70, 75, 80` — one exception at L3, then 5-step. The surveyor's
claim 16 implicitly contains this, but does not mark line 77 as overturned; it should.

---

## §E — On the score

88 is defensible and if anything conservative. Both retained unknowns are genuine, and
the surveyor resisted the temptation to convert `expArray[81..98]` into 18 free levels
— I add a datum that keeps that restraint correct: `getLevel()`
(`StatsManager.as:1586-1596`) derives level **purely from XP against `expArray`** and
returns up to **99**, so the engine can *represent* L81–99; what gates it is
`changeXP`'s `reportHack("changeXP levelcap")` (`:1619`) and `LootDialog.as:644`
refusing to credit at `getLevel() >= levelCap`. Reachability stays **STILL_UNHELD** —
correctly. (Small precision note: `changeXP` credits the XP via `changeStat(9,num)`
*before* the cap check, so the "XP is simply not credited" half of claim 11 is true at
the loot layer, not inside `changeXP`.)

The one thing I would not sign is claim 11's lane_impact until NF1 is applied.
