# CRITIC — skills-meters — LENS 3 (PRECEDENCE / stale-claiming)

Blind review. I did not see the surveyor's reasoning. Every verdict below cites an artifact
**I** opened this session. Commands were re-run; nothing is taken on the surveyor's word.

**Headline: 19 of 21 claims survive contact with the artifacts. Two are wrong.**
One of the two is **fatal** and it is the exact failure mode this lens hunts:
the claim that says *"corrects the previous survey, which banked the Android numbers"*
**banks an Android number itself**, by mis-binding a coincidentally-equal web constant.

Re-score: the surveyor's **86 is too high. Honest figure ≈ 78.**
Blocker ③ (Focus numerics) is not closed — its headline constant is wrong by 60%.
The "135 numeric effect rows" is really 83, and the one string cross-checkable against
web AS3 is contradicted by it.

---

## R-09 `focus-meter-numerics-web` — **REFUTED, FATAL**

**Claim:** *"max 120 frames (5s)"*, cite `§1t99s0§.as:55 (max)`.
Journal restates it as a table row: `| max | 5 * 24 = **120 frames** = 5.00 s | §1t99s0§.as:55 |`
(`docs/gauntlet/L0/systems/skills-meters.md:325`).

**What line 55 actually is** — I opened it:

```
reference/decompiled/shs3_payload/scripts/§1t99s0§.as
 55:      internal static var §1t12234s0§:int = 5 * 24;
```

`§1t12234s0§` is **never assigned to maxreload**. Its only two uses in the whole bundle:

```
§1t99s0§.as:266:            this.§1t4440s0§ = §1t12234s0§;
§1t122s0§.as:950:               §1t4440s0§ = §1t12234s0§;
```

and `§1t4440s0§` is a per-tick countdown decremented at `§1t99s0§.as:1244-1247` — a timer,
not a meter.

**maxreload is `§1t4415s0§`, and it is 8 × 24 = 192 frames = 8.00 s.** Exhaustive grep,
whole web bundle, every occurrence of the symbol:

```
$ grep -rn "§1t4415s0§" reference/decompiled/shs3_payload/scripts/
§1t99s0§.as:95:       internal var §1t4415s0§:int;
§1t99s0§.as:249:      this.§1t4415s0§ = 8 * 24;      <== ONLY assignment (player)
§1t4904s0§.as:77:     §1t4415s0§ = 8 * 24;           <== ONLY assignment (clone)
   …all remaining hits are reads (:1203 refill, :3272 crit, :3295 spend, :3321 clamp)
```

**Where 120 came from.** It is the **Android** value, from the very build the claim says it
is correcting:

```
reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as
 239:         this.maxreload = 5 * 24;
3272:         StageManager.getBattleUI().updateReload((this.reload - 24) / (this.maxreload - 24));
```

Android = 120 max / 24 dead zone. Web = **192 max / 48 dead zone**. The claim correctly
caught the dead zone (48, `§1t113s0§.as:328` — verified verbatim) and then imported the
Android max anyway, because a *different* web static happened to also equal `5 * 24`.

**Corrections the lane must carry:**

| | claim | measured (web v0.717) |
|---|---|---|
| maxreload | 120 frames / 5.00 s | **192 frames / 8.00 s** — `§1t99s0§.as:249` |
| usable range above dead zone | 72 frames | **144 frames / 6.00 s** |
| stance switch (48) as share of usable | "two-thirds of it" | **one third of it** |
| natural refill | (unstated) | **+1 per tick**, `§1t99s0§.as:1203-1205` → 0→full = 8.00 s |

Everything else in R-09 verified verbatim and stands: dead zone 48, switch cost 48
(`:3160-3166`), slash cost `slashUsage × 0.5 / 1.0 / 1.5` by stance (`:3299-3311`),
bonus refill +6 (`:3318-3324`).

---

## R-11 `per-level-effect-numbers` — **REFUTED, MATERIAL** (two independent defects)

**Claim:** *"135 of the 182 level rows carry a verbatim numeric effect string … so no
projectile-class reading is needed for them."*

### (a) The count is 83, not 135.

I joined every `<level><desc>` id in `reference/extracted/skilldata.xml` to
`docs/gauntlet/L0/index/strings.json` and counted:

```
total 182 · nonempty desc 135 · resolved-with-a-digit 83 · missing from table 0 · no-digit 52
no-digit breakdown:
  'Increased damage' ×10 · 'Increased damage and slash range' ×10 · 'Increased slash range' ×10
  'Increases your chances of harvesting rare crops' ×5 · '…finding hidden items…' ×4
  'Reduced cooldown' ×3 · 'Increases the chi charging rate' ×2 · …
```

135 is the count of **non-empty** desc rows. Only **83** carry a number. The 52 that don't
include **all 30 mastery rows** — and those are precisely the rows whose real coefficients
the surveyor had to get from AS3 (`§1t99s0§.as:3262-3270`), not from the string table. The
claim's own sibling claim proves its headline number wrong.

### (b) The one numeric string I could cross-check against web AS3 is contradicted by it.

Roll (skill 1004). Card copy in the recovered table:

```
7004 -> '60% chance to dodge enemy attacks when rolling'
7005 -> '80% …'      7006 -> '100% …'
```

Web build, same skill (`§1t120s0§.as:16` proves `§1t10127s0§ = 1004 = Roll`):

```
reference/decompiled/shs3_payload/scripts/§1t99s0§.as
3363:            _loc15_ = this.§1t4491s0§(§1t120s0§.§1t10127s0§);
3364:            if(_loc15_ == 1)      { _loc16_ = 75; }
3368:            else if(_loc15_ == 2) { _loc16_ = 85; }
3372:            else if(_loc15_ >= 3) { _loc16_ = 95; }
3376:            if(int(Math.random() * 100) < _loc16_)
```

**75 / 85 / 95, not 60 / 80 / 100.** The survey's own governing rule — *"Android XML is
web-true, Android AS3 is not"* — has a hole in it: the **Android string table is neither.**
It is Android UI copy, and where v0.717 code disagrees with it, the code wins. Numeric
effect strings must be labelled Android-sourced and re-checked against the web bundle
before any of them is coded.

### (c) The lane_impact's project-memory correction is also wrong.

*"Roll (60/80/100%) is what buys evasion, not Focus (correcting project memory 'Focus buys
evasion')."* A **full Focus meter does buy evasion** in v0.717:

```
§1t99s0§.as:3383  if(this.§1t4465s0§() && this.§1t4414s0§ == this.§1t4415s0§ && (…stance-ultimate owned…))
3385:            §1t3246s0§ = 12;                       // 12 frames of immunity
3386:            §1t88s0§.instance.§1t1516s0§("Snd_jump");
3387:            return true;                           // incoming hit fully negated
```
(same block duplicated at `§1t4909s0§.as:74` and `:311`).
Caveat I attach myself: the gate reads skills **1074 / 1075 / 1076**
(`§1t120s0§.as:108-112`), and **none of those ids exists in `skilldata.xml`** (max real id
1068, then 1500/1501), so the branch may be unreachable in shipped data. Report it as
PARTIAL — but *not* as "Focus does not buy evasion".

---

## Claims that HELD (I re-opened each)

- **`blocker1-costs-cooldowns`** — all four line ranges verified verbatim. One correction to
  carry: of the 182 rows, **101 `<chi>` and 84 `<cooldown>` elements are EMPTY**. Only two
  skills lack a cooldown entirely (1500/1501, category 11, NPC-only), so the *cooldown* half
  is genuinely complete for every playable skill; blank `<chi>` needs an explicit blank→0
  rule before a transcription script runs, and blank `<cooldown>` is handled in code at
  `§1t105s0§.as:310-313` (`cooldown.toString == "" → 0`).
- **`kunai-is-a-phantom`** — `skilldata.xml:355` / `:900` are `<chi></chi>`; `SkillManager.as:252-259`
  verbatim. Ammo stat 2501.
- **`crit-is-deterministic`** — `§1t99s0§.as:3272-3276` verbatim.
- **`spd-cooldown-cap-600`** — `§1t1523s0§.as:2289-2296` verbatim; Android's 300 confirmed at
  `StatsManager.as:1856-1860`. Missing detail: the SPD fed in is **pre-multiplied ×1.5 under
  the SPEED buff** (`§1t1523s0§.as:2281-2285`), so the cap bites at SPD 400 while buffed.
- **`ledger-decimals-are-display-artefacts`** — reproduced. Requires **int truncation at each
  step**, which `§1t105s0§.as:297-318` supplies (`_loc2_:int`, `:int` return):
  5 s → 120 f → ×0.995 = 119.4 → **119** → /24 = 4.958 → **4.96**. Same for 9.92 / 8.92. Held.
- **`crit-mult-is-1.3-ledger-vindicated`** — web `:3274` = ×1.3 flat; Android `MCSPlayer.as:3215-3221`
  = ×1.5 Light / ×1.2 other. Both verbatim. The ledger is vindicated; the earlier survey was wrong.
- **`stance-damage-ceiling-is-mastery-10`** — `§1t99s0§.as:3262-3270` verbatim, and skills
  1000/1001/1002 each have exactly **10 `<level>` rows with `<passive>1</passive>`**. 0.9/1.2/1.4
  is the mastery-**10** ceiling. Precedence nit: they cite the **Android** `StatsManager.as:1834`
  for the mastery source when the **web** cite exists — `§1t1523s0§.as:2268` passes
  `§1t9714s0§(1000), (1001), (1002)` as params 12-14.
- **`per-stance-reach-formula`** — verified, and I confirmed the parameter binding they asserted:
  `§1t99s0§.as:183-194` (`param10 → §1t4420s0§`) against the call at `§1t1523s0§.as:2268`
  (`param10 = §1t9592s0§()` = `§1t9593s0§(SPD)`). Enemy path hard-codes the DAN term to 90
  (`§1t4906s0§.as:56-57`). Two nits: the injured buff **halves** baseSlashLength
  (`§1t99s0§.as:219-223`); and the "wiki 300/200/100 reconciles at the SPD asymptote" footnote
  computes Balanced ×1.0 and Heavy ×0.5 — i.e. **mastery 0** — inside a survey whose headline
  finding is a **mastery-10** ceiling. It is flagged as inference, so it stands, but it is
  internally inconsistent and must not be promoted. The names "Dual"/"Reversed" for stance
  constants `§1t12224s0§`/`§1t12223s0§` are unevidenced in the web bundle.
- **`in-combat-stance-switch-is-real`** — **HELD and strengthened.** The surveyor argued from the
  caption plus the 48-frame charge. The decisive artifact is stronger and they missed it:
  ```
  §1t99s0§.as:3048   public function §1t4470s0§() : Boolean       // canChangeStance
  3050:      return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
  §1t99s0§.as:3058   public function §1t4472s0§() : *              // cycleStance
  3060:      if(this.§1t4414s0§ < 48) { return; }
  ```
  A hard lock has no `reload >= 48` gate. Frame corroboration, mine: `m_nearfull.png` top panel
  shows a **98%-full** focus bar mid-combat with **no caption at all**. The ledger line
  (`REBUILD_READINESS.md:158`, and `SHSD_MASTER_REFERENCE.md:388` which grades it **[CONTRACT]**)
  is dead. Both docs should be struck.
- **`string-table-resolves-all-73`** — `resolved_names.json` → `{misses: 0, rows_resolved: 73}`;
  my own parse: 73 of 75 skills carry a `<displayname>` (1500/1501 do not). String `960`
  confirmed **absent** from `strings.json`.
- **`skilldata-byte-identical-across-builds`** — reproduced independently:
  `android 39045 · web 39003 · delta 42 · common prefix after the 40-byte decl = 39003`.
- **`frame-crit-appears-at-exactly-full`** — I re-cropped `(640,0)-(1800,390)` / `(640,390)-(1800,780)`,
  2× Lanczos, and re-measured in the original: TOP white bar x736→1526 = **791 px**, BOT white
  x736→1540 = **805 px** → **98.3% vs 100%**; captions exactly as described (none / black
  "CRITICAL HIT"). Wording caution: a 98%-vs-100% pair is *consistent with* exact equality but
  does not prove it alone — any threshold in (98%, 100%] fits. The A2 equality is what proves it.
- **`frame-cracks-web-string-960`** — my crop `(60,880)-(1020,1080)` 3×: red portrait ring,
  green 20/20, blue 26/26, empty brown third bar carrying light-grey **"CANNOT CHANGE STANCE"**,
  yellow "150% DAMAGE". `§1t113s0§.as:110-111` verbatim; `strings.json` has `175 = "Critical Hit"`
  and **no 960**. Held.
- **`150pct-damage-is-a-food-buff`** — held, but cited from Android when the **web** cite exists
  and says the same thing: `§1t99s0§.as:209-223` is the same else-if chain
  (`hasBuff(9453) → minDamage *= 1.5`). Use the web cite.
- **`ten-categories-all-named`** — `SkillScreenUI.as:84,103-104` verbatim; category domain 1–11
  confirmed in `skilldata.json`; my own membership check of category 11 returns exactly
  1064 Back Throw / 1065 Air Stab / 1066 Bull Charge / 1067 Punch Lunge / 1068 Undying / 1500 / 1501,
  **none with `<order>` or `<lvlreq>`** — as claimed. Caveat the survey should have applied to
  itself: "ten tabs" rests **entirely on Android UI code**; the web skill screen was never opened.
- **`chi-costs-are-not-single-digit`** — `skilldata.json` chi domain
  `{distinct 11, range [0,100], samples 0,2,3,5,6,7,8,10,20,50,100}` — matches exactly;
  `skilldata.xml:1638-1649` verbatim. Note `numeric_count` is **81**, so the ladder describes
  81 populated cells, not 182.
- **`stab-is-a-passive-tree-node`** — `skilldata.xml:720-727` verbatim (`<passive>1</passive>`,
  req 1002 ×3, category 3); `XMLSkill.as:345-348` verbatim.
- **`shunpo-effect`** — `skilldata.xml:1234-1248` verbatim (req 1000 ×10, chi 50, cd 60, one level,
  **no `<lvlreq>`** so the gate is purely mastery-10); Android `MCSPlayer.as:1706` (`3 * 24`) and
  `:1751` (`movePlayer(250)`) verbatim. The **PARTIAL** verdict and the refusal to promote the
  Android geometry are correct and are vindicated by R-09 and R-06.
- **`ultimates-and-elemental-projectile-constants`** (STILL_UNHELD) — 47 empty `<desc>` rows
  confirmed by my own parse. Honest.
- **`skill-vfx-anim-audio`** (STILL_UNHELD) — `reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin`
  exists; `Snd_criticalDamage` verified at `§1t113s0§.as:352`. Honest.

---

## NEW — things the survey missed

1. **maxreload = 192 frames (8.00 s)** — closes ledger blocker ③'s "max" for real. `§1t99s0§.as:249`.
2. **`canChangeStance()` is a named public method whose only gate is `reload >= 48`** —
   `§1t99s0§.as:3048-3051`. Kills the "hard lock" [CONTRACT] outright.
3. **Web Roll dodge = 75 / 85 / 95** — `§1t99s0§.as:3363-3376`. Establishes that Android
   *string-table numbers* are not web-true, a hole in the survey's own build-parity rule.
4. **A full Focus meter negates an incoming hit** (12 i-frames, `Snd_jump`) when the stance's
   ultimate skill is owned — `§1t99s0§.as:3383-3388`. PARTIAL: ids 1074-1076 are absent from
   `skilldata.xml`, so the branch may be unreachable in shipped data.
5. **`slashUsage` is weapon-derived with a floor of 48** — `§1t1523s0§.as:2350-2358` reads the
   weapon's `<slashusage>`; `itemdata.xml` carries 106 of them (e.g. `:8044 <slashusage>72</slashusage>`).
   With max 192 / usable 144, a 72-usage weapon costs 36 focus per Light slash, 72 Balanced,
   108 Heavy. R-09 left this an opaque symbol; it is the number that makes the meter simulable.
6. **`baseReload = 48 + SPD × 6`** — `§1t1523s0§.as:2274-2276`, param 7, distinct from maxreload
   (this is the field the Android name `getBaseReload()` maps to, `StatsManager.as:1839-1841`).
7. **"Focus" (skill 1005) sets `reload = maxreload − 1`** in the **web** build —
   `§1t120s0§.as:230-231` (`§1t10128s0§ = 1005`, `:18`). The journal had only an Android cite.
8. **SPD is pre-multiplied ×1.5 under the SPEED buff** before *both* the cooldown modifier and
   baseSlashLength — `§1t1523s0§.as:2281-2285` and `:2336-2340`.

---

## Precedence-lens summary

No claim here leans on a superseded *document* — the survey correctly went to payload and
frames throughout, and it correctly refused to promote Android-only mechanics for Shunpo.
The stale-import happened one level down, inside the code layer:

- **the Android *string table* is a third build-parity category** the survey's rule does not
  cover, and R-11 treats it as fact (refuted by Roll 75/85/95);
- **R-09 imported an Android constant while claiming to correct exactly that mistake**, via a
  same-valued web static that binds to a different field.

Both are the same disease the lens exists for: *a number that reads right, from a source that
is one build off.* The fix is mechanical — bind the symbol, don't match the value.
