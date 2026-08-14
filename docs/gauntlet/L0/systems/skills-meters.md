# GAUNTLET L0 — system survey: **skills-meters** (VERIFIED RE-SURVEY, 2026-08-14)

Ledger under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20) — §2 scorecard row
(line 134), the §4 block `### skills-meters — 33` (lines 193-196), and the §3 corrections
that bear on this system (items 2, 3, 4, 5).

**This file REPLACES the UNVERIFIED version banked in commit `c3ea839`.** Every cite below
was re-opened and re-read first-hand this pass. Three claims in the previous version are
**WRONG and are corrected here** (S-08→R-06, S-04→R-04, S-09→R-17); the rest survived and
are re-cited. Corrections are called out inline, not buried.

**Headline: 33/100 is badly stale. Re-score 86/100.** All five §4 blockers are now HELD with
payload cites. The system is essentially solved on paper: 75 skills, every name, every
description, every chi cost, every cooldown, every prerequisite edge, every per-level numeric
effect, plus the crit rule, the meter model and the stance multipliers.

---

## THE FINDING THAT REORDERS THE BOARD: the two builds are TUNED DIFFERENTLY

Stage-0b finding S0-3 carried a standing caveat: *"this is the ANDROID build, clientVersion
0.682 … UI copy and combat tuning parity is NOT established."*

**It is now established, and it splits in two directions:**

| | verdict | evidence |
|---|---|---|
| `skilldata.xml` (the data) | **IDENTICAL** — 39,003 bytes byte-for-byte | R-14 |
| combat tuning in AS3 (the code) | **DIVERGENT** — different crit, stance and SPD-cap constants | R-06, R-07, R-04 |

So: **numbers out of `skilldata.xml` are web-true. Formulas out of the readable Android AS3
are NOT, and must be re-read in the obfuscated web bundle before use.** The previous survey
took Android formulas as fact and got the single most load-bearing constant in the system —
the crit multiplier — backwards. I re-derived every formula below from
`reference/decompiled/shs3_payload/` (the **web v0.717** bundle) and label any that is
Android-only.

Web-bundle class map I established this pass, so the next lane doesn't have to:

| obfuscated | is | key lines |
|---|---|---|
| `§1t99s0§.as` (5162 lines) | `MCSPlayer` | `:3255` getDamage · `:3091` setStance · `:3293` deductReloadBar |
| `§1t113s0§.as` | `BattleUI` | `:326` updateReload |
| `§1t105s0§.as` | `XMLSkill` | `:297` getCooldown |
| `§1t1523s0§.as` | `StatsManager` | `:2279` cooldown modifier · `:2344` base slash length |
| `§1t4906s0§.as` | `EnemyPlayer`/elite init | `:54,:57` reload + slash-length seeds |

---

## R-01 — Blocker ① OVERTURNED: every skill's chi cost and cooldown is on disk

**Ledger (§4:195):** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay
Trap, elemental) — *read skill cards in a preserved build.*"

No preserved build is needed. `reference/extracted/skilldata.xml` carries **182 `<level>` rows
across 75 `<skill>`**, and after the string-table join (R-13) every one is named. The four
skills the ledger names by hand:

| skill | id | lvlreq | chi / level | cooldown s / level | line |
|---|---|---|---|---|---|
| Smoke Bomb | 1010 | 20 | 5 / 10 / 10 | 6 / 6 / 5 | skilldata.xml:501 |
| Throw Kunai | 1007 | 10 | **(empty = 0)** | 2 / 2 / 2 | skilldata.xml:346 |
| Lay Trap | 1024 | 15 | **(empty = 0)** | 5 / 5 / 5 | skilldata.xml:890 |
| Fire Breath | 1013 | 20 | 5 / 6 / 7 / 8 / 10 | 15 ×5 | skilldata.xml:608 |

Verbatim, `reference/extracted/skilldata.xml:501-512`:

```
501: 		<id>1010</id>
502: 		<displayname>6018</displayname>
503: 		<lvlreq>20</lvlreq>
504: 		<desc>6019</desc>
505: 		<req><has><id>1024</id><qty>1</qty></has></req>
506: 		<order>2</order>
507: 		<category>6</category>
508: 		<level>
509: 			<value>1</value>
510: 			<required>1</required>
511: 			<chi>5</chi>
512: 			<cooldown>6</cooldown>
```

`6018` resolves to `"Smoke Bomb"` (R-13). **Verdict: HELD. overturns_ledger = true.**

---

## R-02 — "Kunai chi" is a phantom: kunai and traps cost ZERO chi and burn AMMO

`skilldata.xml:355` and `:900` are literally `<chi></chi>` — empty, not missing-and-defaulted.
`XMLSkill.as:268-277 getChiCost()` returns 0 on an empty node and `XMLSkill.as:117-119`
suppresses the "Chi Cost" card line when `cost > 0` is false, so the card showed no cost at all.

The resource kunai actually spends is an inventory counter, `SkillManager.as:252-259`:

```
252:                  if(owner.isPlayer())
253:                  {
254:                     if(StatsManager.getStat(2501) == 0)
255:                     {
256:                        trace("no ammo");
257:                        return false;
258:                     }
259:                     StatsManager.changeStat(2501,-1);
```

Corroborated by the shipped card copy itself — string `6011` (skill 1007's `<desc>`):
`'Throws a kunai.\n\nRequires kunai ammo.'`. Stat id **2501 = kunai ammo**.

**Verdict: HELD. overturns_ledger = true.** (The ledger's blocker names a cost that does not exist.)

---

## R-03 — Blocker ⑤ OVERTURNED: crit is DETERMINISTIC on an exactly-full meter, not a proc

**Ledger (§4:195):** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent."

There is no dice roll in the crit path in **either** build. Web,
`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3272-3276`:

```
3272:         if(this.§1t4414s0§ == this.§1t4415s0§)
3273:         {
3274:            return _loc2_ * 1.3 + this.§1t1243s0§;
3275:         }
3276:         return _loc2_;
```

`§1t4414s0§` = reload, `§1t4415s0§` = maxreload (both confirmed by `:3320-3323`, the +6 bonus-
reload clamp, and `:55 internal static var §1t12234s0§:int = 5 * 24;`). Equality — meter
**exactly** full — is the whole trigger. Spending it is the cost: `§1t99s0§.as:3295-3298`
zeroes the meter first when it was full, so a crit costs the entire bar rather than `slashUsage`.

The HUD agrees, `§1t113s0§.as:348-358`: the crit caption is shown iff `_loc3_ >= 1`.

**Verdict: HELD. overturns_ledger = true.** Frame-confirmed in R-15.

---

## R-04 — Blocker ④ OVERTURNED: the SPD→cooldown formula — and the cap is **600**, not 300

**Ledger (§4:195):** "④ SPD→cooldown formula."

**⚠ CORRECTION TO THE PREVIOUS SURVEY (its S-04).** That pass quoted Android
`StatsManager.as:1854-1861` (`if(speed > 300) speed = 300; return 1 - speed/300*0.5;`) and
asserted a hard cap of 300. I re-read the same function in the **web v0.717** bundle,
`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2289-2296`:

```
2289:      internal static function §1t9590s0§(param1:int) : Number
2290:      {
2291:         if(param1 > 600)
2292:         {
2293:            param1 = 600;
2294:         }
2295:         return 1 - param1 / 600 * 0.5;
2296:      }
```

**Web: `cooldownModifier = 1 − min(SPD_total, 600)/600 × 0.5`.** Cap 600, floor still exactly
0.5×. A speed buff multiplies effective SPD by 1.5 **before** the cap
(`§1t1523s0§.as:2282-2285`). The 300 in Android is a mobile rebalance.

Call chain into it: `§1t105s0§.as:297-318` (`XMLSkill.getCooldown`) —
`_loc2_ = levelList[lvl].cooldown * 24;` then `return _loc2_ * §1t1523s0§.§1t9589s0§();`
— i.e. **XML seconds → ×24 frames → × SPD modifier**, and the card prints
`getCooldown(1)/24` to 2 dp (`XMLSkill.as:116,123` in the readable Android twin).

**Verdict: HELD. overturns_ledger = true.**

---

## R-05 — The ledger's 4.96 / 9.92 / 8.92 are DISPLAY artefacts of one reader's SPD (and that SPD was 6-10)

**Ledger (§4:194):** "Chi Punch (10/20 dmg, cost 2, cd 4.96s); Replenish Focus (cost 5, cd
9.92→8.92s)".

The payload gives Chi Punch (1042) cooldown **5** at all three levels (`skilldata.xml:1292,
1299, 1306`) and Focus (1005) cooldown **10 / 9 / 8** (`:295, :302, :309`). Running raw values
through R-04's web pipeline (`val:int = raw*24`, `× modifier`, int-truncated by the `:int`
return type, `/24`, `toFixed(2)`):

```
WEB modifier = 1 - min(SPD,600)/600*0.5
SPD  5: mod=0.995833  5s->4.96  10s->9.96  9s->8.96
SPD  6: mod=0.995000  5s->4.96  10s->9.92  9s->8.92  <== matches ledger
SPD 10: mod=0.991667  5s->4.96  10s->9.92  9s->8.92  <== matches ledger
SPD 11: mod=0.990833  5s->4.92  10s->9.88  9s->8.92
```

Three independent decimals reproduced to the cent, and the constraint pins the reader's SPD to
**6-10 inclusive**. (The previous survey said "3, 4 or 5" — correct method, wrong build's
divisor. Same conclusion: a low single-digit SPD, exactly what an early-game longplay shows.)

Two consequences: **the contract values are the integers in the XML, not the decimals in the
ledger**, and the ledger truncated Focus to two levels — it has three, the third cooldown is 8 s.

**Verdict: HELD.**

---

## R-06 — ⚠ THE LEDGER WAS RIGHT AND THE PREVIOUS SURVEY WAS WRONG: crit is ×1.3 in v0.717

**Ledger (§4:194):** "crit = 1.3× formula." **Ledger (§3:152):** "Keep `CRIT_MULT=1.3`."

The previous survey graded this **WRONG** and set `overturns_ledger = true`, on the strength of
Android `MCSPlayer.as:3219-3221` (`×1.2` non-Light, `×1.5` Light). I found the web counterpart.
`reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3255-3277`:

```
3255:      internal function §1t4475s0§() : int
3256:      {
3257:         var _loc2_:int = 0;
3258:         var _loc1_:int = this.minDamage + Math.random() * this.damageRange;
3259:         switch(this.stance)
3260:         {
3261:            case §1t12220s0§:
3262:               _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);
3263:               break;
3264:            case §1t12221s0§:
3265:               _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3266:               break;
3267:            case §1t12222s0§:
3268:            case §1t12223s0§:
3269:            case §1t12224s0§:
3270:               _loc2_ = _loc1_ * 1.4;
3271:         }
3272:         if(this.§1t4414s0§ == this.§1t4415s0§)
3273:         {
3274:            return _loc2_ * 1.3 + this.§1t1243s0§;
3275:         }
3276:         return _loc2_;
3277:      }
```

**In the shipped web build the crit multiplier is a flat ×1.3 in every stance**, plus an
**additive** gear term (`§1t1243s0§` = `STAT_CRITICALDMG`, stat id 204, sourced only from
`findBonusStat` — `StatsManager.as:258, :1835`). `CRIT_MULT = 1.3` is correct and must not be
changed. The Android build retuned it to 1.5/1.2; that is not our target.

The "3× folklore" the ledger works to explain at §3:153 is fully explained here: Heavy is
already ×1.4, ×1.3 crit = **1.82×**, plus flat gear crit-damage — and §3 itself names
"Heavy ×1.82" as the per-stance crit-damage stat. Same number, now derived.

**Verdict: HELD — ledger CONFIRMED, previous survey OVERTURNED. overturns_ledger = false.**

---

## R-07 — §3.3's stance table is right but the ceiling is mastery **10**, not 9 — and these are DAMAGE, not just a "table"

**Ledger (§3:154-156):** "The stance tables (dmg **0.9/1.2/1.4**, reach 300/200/100) are
**MASTERY-9 CEILING** values, not base. A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 /
Heavy ×1.4 (Heavy is fixed)".

From R-06's `getDamage`, with mastery = the stance skill's own level (`StatsManager.as:1834`
passes `getStat(1000)/getStat(1001)/getStat(1002)` — skills 1000/1001/1002, each with exactly
**10** `<level>` rows in `skilldata.xml`):

| stance | web multiplier | mastery 0 | mastery 10 |
|---|---|---|---|
| Light | `base × (0.5 + 0.4 × M × 0.1)` | **0.50** | **0.90** |
| Balanced | `base × (1 + 0.2 × M × 0.1)` | **1.00** | **1.20** |
| Heavy / Dual / Reversed | `base × 1.4` (flat) | **1.40** | **1.40** |

Every number in the ledger's sentence is correct — 0.9/1.2/1.4 at the ceiling, 0.5/1.0/1.4 at
base, Heavy fixed. **The one error is the ceiling index: it is mastery 10, not 9.** The skill
has ten levels and the coefficient is `×0.1` per level, so level 10 is the top. Anyone who
codes a mastery-9 ceiling ships Light at 0.86 and Balanced at 1.18.

`§1t99s0§.as:3286-3289` also confirms the combat-core Ready bullet "Heavy def ×0.8":
`if(this.stance == §1t12222s0§) { return defense * 0.8; }` — and the shipped card copy says it
in words, string `6005`: `'…Effective against Balanced Stance.\nDefense -20%'`.

**Verdict: HELD. overturns_ledger = true** (off-by-one on the ceiling).

---

## R-08 — Cross-lane gift to combat-core's #1 blocker: per-stance REACH, exactly

Combat-core (§4:190) calls reach-in-px "the one value the whole model needs". It is in the same
`setStance` switch, `§1t99s0§.as:3091-3146`:

```
3093:            case §1t12220s0§:                                        // LIGHT
3094:               this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3104:            case §1t12221s0§:                                        // BALANCED
3105:               this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3115:            case §1t12222s0§:                                        // HEAVY
3116:               this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
3117:               if(this.§1t4417s0§ < 100)
3118:               {
3119:                  this.§1t4417s0§ = 100;
3120:               }
```

with the base, `§1t1523s0§.as:2344-2348`:

```
2344:      internal static function §1t9593s0§(param1:int) : int
2345:      {
2346:         var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5;
2347:         return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));
2348:      }
```

`baseSlashLength = 120 + floor((90 + DAN×5) × SPD/(20+SPD))` — 120 px at SPD 0, asymptotic to
**210 px** at Dan 0, +5 px per Dan rank. Then Light ×1.4, Balanced ×1.0→1.2, Heavy ×0.5→0.9
(floor 100 px), Dual ×1.4, Reversed ×1.0 (floor 100). Halved outright while injured
(`MCSPlayer.as:222`, Android-cited).

**§3's "reach 300/200/100" reconciles arithmetically:** at the SPD asymptote, Light = 1.4×210 =
**294**, Balanced at mastery 0 = **210**, Heavy at mastery 0 = **105** → 300/200/100 rounded.
I flag that last step as *inference from A2*, not measurement. And §3's "Heavy's reach also
scales ×0.5→×0.9" is **exactly right**.

**Verdict: HELD.** Hand to lane L1 / combat-core.

---

## R-09 — Blocker ③ OVERTURNED: the "Focus bar" is the reload/crit meter, and the WEB numbers differ from Android

**Ledger (§4:195):** "③ Focus numerics (max/fill/switch-cost)." All three, plus the bar mapping.

| quantity | **web v0.717** value | cite |
|---|---|---|
| max | `5 * 24` = **120 frames** = 5.00 s | `§1t99s0§.as:55` `internal static var §1t12234s0§:int = 5 * 24;` |
| bar mapping | `(reload − **48**) / (maxreload − 48)`, clamped ≥0 → a **48-frame dead zone** | `§1t113s0§.as:328-332` |
| stance-switch cost | **flat −48 frames**, clamped ≥0, applied only in battle | `§1t99s0§.as:3160-3166` |
| slash cost | `slashUsage × 0.5` Light · `× 1.0` Balanced/Reversed · `× 1.5` Heavy/Dual | `§1t99s0§.as:3299-3311` |
| slashUsage source | weapon `<slashusage>`, floored at 48 | `StatsManager.as:1921-1930` |
| bonus refill | `reload += 6`, clamped to max | `§1t99s0§.as:3318-3324` |
| Focus skill effect | `reload = maxreload − 1` (one frame short of full) | `SkillManager.as:218-219` |

Verbatim, `§1t113s0§.as:326-333`:

```
326:      public function §1t5205s0§(param1:int, param2:int) : *
327:      {
328:         var _loc3_:Number = (param1 - 48) / (param2 - 48);
329:         if(_loc3_ < 0)
330:         {
331:            _loc3_ = 0;
332:         }
333:         this.§1t5182s0§.bar.scaleX = _loc3_;
```

and `§1t99s0§.as:3160-3166`:

```
3160:         if(§1t1525s0§.§1t9948s0§())
3161:         {
3162:            this.§1t4414s0§ -= 48;
3163:            if(this.§1t4414s0§ < 0)
3164:            {
3165:               this.§1t4414s0§ = 0;
3166:            }
```

**⚠ The previous survey reported 24-frame dead zone, a `maxreload/6` refusal gate and a
`maxreload/2 → maxreload/3` switch cost. Those are the ANDROID numbers**
(`MCSPlayer.as:2977, 3098-3105, 3272`). The web build uses 48 and a flat 48 subtraction, with
no `/6` or `/3` constant anywhere in `§1t99s0§.as`. Usable meter range is therefore
**72 frames**, and a stance switch costs **two-thirds of it**.

**Verdict: HELD. overturns_ledger = true.**

---

## R-10 — §3.4 OVERTURNED: in-combat stance switching is REAL in v0.717; "CANNOT CHANGE STANCE" is a transient empty-meter refusal

**Ledger (§3:157-159):** "**In-combat stance is HARD-LOCKED in v0.717** ('CANNOT CHANGE
STANCE'). The recreation's Focus-gated in-combat switch models **removed 2014 behavior**. …
the *in-combat* switch is a recreation divergence — label it, don't present it as original."

That is wrong on all three counts, and the web build says so in one function.
`§1t113s0§.as:334-359`:

```
336:            if(_loc3_ == 0)
337:            {
338:               if(this.§1t5169s0§.htmlText != this.§1t5204s0§)
340:                  this.§1t5169s0§.htmlText = this.§1t5204s0§;
342:               this.§1t5169s0§.visible = true;
343:            }
344:            else if(_loc3_ > 0 && _loc3_ < 1 && this.§1t5169s0§.visible)
345:            {
346:               this.§1t5169s0§.visible = false;
347:            }
348:            else if(_loc3_ >= 1)
349:            {
352:                  §1t88s0§.instance.§1t1516s0§("Snd_criticalDamage");
356:                  this.§1t5169s0§.htmlText = this.§1t5203s0§;
358:               this.§1t5169s0§.visible = true;
359:            }
```

One text field, three states of the *same* bar: **empty → the refusal caption; partial → no
caption at all; full → the crit caption.** A permanent hard-lock would not be conditioned on
`_loc3_ == 0`, and `§1t99s0§.as:3162 this.§1t4414s0§ -= 48;` inside `setStance` would have
nothing to charge. **The recreation's Focus-gated in-combat switch is faithful, not a
divergence — it should be presented as original behaviour, and the cost is a flat 48 frames.**

Frame-confirmed in R-15/R-16: the 98%-full frame shows no caption, exactly as line 344-346 requires.

**Verdict: HELD. overturns_ledger = true.** This one *removes* a "labeled deviation" from the
project's honesty ledger rather than adding one.

---

## R-11 — Blocker ② PARTIAL: Shunpo is a Light-stance charge-and-strike ultimate, cost 50 chi / 60 s

**Ledger (§4:195):** "② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to
the **predecessor SHS2**, not Duels)."

The negative half stands — there is no slow-motion in any Shunpo path in either bundle. The
positive half is now held from the shipped card copy, which is build-agnostic data
(`reference/extracted/skilldata.xml:1234-1246`):

```
1235: 		<id>1039</id>
1236: 		<displayname>6082</displayname>
1237: 		<desc>6085</desc>
1238: 		<req><has><id>1000</id><qty>10</qty></has></req>
1239: 		<order>10</order>
1240: 		<category>1</category>
1244: 			<chi>50</chi>
1245: 			<cooldown>60</cooldown>
```

`6082 -> 'Shunpo'`; `6085 ->` *"Ultimate Light Stance technique. \n\nHold down the skill icon to
increase the damage it inflicts.\n\nThis skill can only be used when in Light Stance."*
The `<req>` is Light Stance Mastery **10**. Its two siblings are symmetric:
Thousand Stabs (1040, Balanced ×10) and Deadly Cleave (1041, Heavy ×10), both 50 chi / 60 s.

The Android AS3 adds mechanics I could **not** cross-check in the web bundle: 3-second charge
window, a **250 px** flash-step in the facing direction, and a projectile at
`getDamage() × chargingTime / 2` (`MCSPlayer.as:1705-1706, 1747-1753`). Given R-06/R-07/R-09
all diverge between builds, I will not promote those to web fact.

**Verdict: PARTIAL.** Gating, cost, cooldown and the charge-to-increase-damage rule are HELD;
the 250 px / 3 s constants are Android-only and unconfirmed for v0.717.

---

## R-12 — THE BIG UNDER-CLAIM: 135 of 182 level rows carry a verbatim numeric effect string

This is new material the previous survey listed as **STILL_UNHELD** ("per-skill damage
constants beyond Chi Punch … close-path: read the ~40 `*Projectile.as` classes"). No projectile
reading is required — the numbers are in the shipped skill-card copy, keyed by each
`<level><desc>` id in the 7000-7095 band.

Joined `reference/extracted/skilldata.xml` against
`docs/gauntlet/L0/index/strings.json` (script output, this session): **75 skills / 182 level
rows / 135 rows with a resolved effect string.** A representative slice, verbatim from the
string table:

```
7064 -> '10 damage'          7065 -> '20 damage'          7066 -> '30 damage'
7068 -> '25 damage'          7069 -> '50 damage'          7070 -> '75 damage'   7071 -> '100 damage'
7072 -> 'Steal 20 chi'       7073 -> 'Steal 35 chi'       7074 -> 'Steal 50 chi'
7075 -> '20 damage/sec, max 200 damage'                   7077 -> '60 damage/sec, max 600 damage'
7078 -> '500 damage, 5 sec delay'                         7080 -> '500 damage, 3 sec delay'
7034 -> 'Fire Damage: 80% Fire ATK'  …  7038 -> 'Fire Damage: 120% Fire ATK'
7004 -> '60% chance to dodge enemy attacks when rolling'
7006 -> '100% chance to dodge enemy attacks when rolling'
7009 -> '4 skill slots'  …  7013 -> '8 skill slots'
```

Worked rows (id → name → per-level chi / cooldown-s / effect):

| id | name | L1 | L2 | L3 |
|---|---|---|---|---|
| 1042 | Chi Punch | 2 / 5 / **10 damage** | 2 / 5 / **20 damage** | 2 / 5 / **30 damage** |
| 1006 | Slash Wave | 10 / 10 / 25 dmg | 10 / 10 / 50 dmg | 10 / 10 / 75 dmg |
| 1043 | Chi Kick | 5 / 10 / 50 dmg | 5 / 10 / 75 dmg | 5 / 10 / 100 dmg |
| 1044 | Spirit Thief | 0 / 10 / steal 20 chi | 0 / 10 / steal 35 | 0 / 10 / steal 50 |
| 1046 | Charged Shot | 20 / 10 / 20 dps cap 200 | 20 / 10 / 40 dps cap 400 | 20 / 10 / 60 dps cap 600 |
| 1047 | Heavenly Sword | 50 / 30 / 500 dmg, 5 s delay | 50 / 30 / 500, 4 s | 50 / 30 / 500, 3 s |
| 1051 | Windmill Shuriken | 10 / 10 / 40 dmg | 10 / 10 / 80 | 10 / 10 / 120 |
| 1004 | Roll | 0 / 4 / **60 % dodge** | 0 / 3.5 / **80 %** | 0 / 3 / **100 %** |

Chi Punch's 10/20/30 is independently confirmed in code —
`reference/decompiled/shs3_android_payload/scripts/ChiPunchProjectile.as:20-31`:

```
20:         if(skilllevel == 1)
22:            damage = 10;
24:         else if(skilllevel == 2)
26:            damage = 20;
28:         else if(skilllevel == 3)
30:            damage = 30;
```

Two things this settles beyond skills-meters:
- **Roll — not Focus — is what buys evasion** (60/80/100 %). Project memory
  `project-session11-study-pass` records *"OG has NO Critical meter (Focus buys evasion)"*.
  The first half is wrong (the crit meter is R-03/R-15) and the second is misattributed. Focus's
  own shipped description is `'Instantly recharges your focus bar.'` — nothing else.
- **Base hotbar = 3 slots.** "Skill Slots+" L1 reads "4 skill slots" and L5 "8 skill slots",
  and the container is `Vector.<IntStat>(8)` with slot 0 pre-filled with skill 1003/Jump
  (`StatsManager.as:2153-2154`). ui-hud blocker ④ ("the '3 skill slots' is really ~2 abilities
  + a stance up-arrow") is answerable: three, growing to eight.

**Verdict: HELD. overturns_ledger = true** (against §4's blocker ① and the previous survey's
STILL_UNHELD).

---

## R-13 — GAUNTLET §2.1's string-table blocker is DEAD for this system: 73 / 73 names, 0 misses

`docs/gauntlet/L0/index/resolved_names.json` → `skilldata.xml` → `misses: 0`,
`rows_resolved: 73`, `miss_sample: []`. (75 `<skill>` rows; 1500 and 1501 carry no
`<displayname>` element at all, so 73 is the full resolvable set.)

Verbatim sample from `docs/gauntlet/L0/index/strings.json`:

```
'6000' -> 'Light Stance Mastery'
'6018' -> 'Smoke Bomb'
'6042' -> 'Stab'
'6047' -> 'When target is downed, draw a downward line to stab him for massive damage.'
```

Every skill in the game is now named and described in shipped English, including the 24 rebirth
element skills (`'Inferno'`, `'Tsunami'`, `'Tornado'`, `'Earthquake'`, four `Dragon Dance Step`
pairs) and `'Deadly Touch'` — *"Depletes target's chi and does 10 damage for each chi point
target has."*

The card template is recoverable too, `XMLSkill.as:110-124` joined to the table:

```
Next Level (Level 1)        <- getString(157) + " (" + getString(155) + " 1)"
<per-level effect>          <- getString(levelList[0].desc)
Chi Cost: N                 <- getString(167)   [suppressed when cost <= 0]
Cooldown: X.XX sec          <- getString(647) … getString(648)
```

**⚠ CORRECTION TO THE PREVIOUS SURVEY (its S-16), which graded this PARTIAL and said the table
"is not on disk here".** It is: `reference/extracted/android/118_Mobile_Lang_EN.bin`, 2,533
entries, exported to `docs/gauntlet/L0/index/strings.json`. Caveat that survives: this is the
**Android** table. It is not identical to the web build's — web string **960** exists and is
absent from it (R-16) — and some phrasing is touch-specific ("Hold down the skill **icon**").
Label ported UI copy as Android-sourced.

**Verdict: HELD. overturns_ledger = true.**

---

## R-14 — BYTE-CHECK: the Android and web `skilldata` are the SAME 39,003 bytes

The load-bearing question for everything above: does the Android data apply to v0.717? For this
file, provably yes. Byte comparison run this session:

```
$ python3 - <<'EOF'
a=open('reference/extracted/android/117_Mobile_SkillData.bin','rb').read()
w=open('reference/extracted/skilldata.xml','rb').read()
...
EOF
android len 39045 web len 39003 delta 42
android first 40: b'<?xml version="1.0" encoding="utf-8"?>\r\n'
common prefix identical for 39003 bytes
tail android: b'>\r\n\t</skill>\r\n\r\n</skilldata>\r\n'
tail web:   b'el>\r\n\t</skill>\r\n\r\n</skilldata>'
```

The Android blob is the web file **byte-for-byte**, wrapped in a 40-byte XML declaration and one
trailing CRLF. Zero content difference across 75 skills, 182 levels, 52 prerequisite edges.

So every id, cost, cooldown, `<lvlreq>`, `<order>`, `<category>` and `<req><has>` in this survey
is **web v0.717 fact**, and the `<displayname>`/`<desc>` **ids** are too (only the resolved
*text* carries the Android caveat of R-13).

**Verdict: HELD.** Kills the S0-3 caveat for this system's data — while R-04/R-06/R-07/R-09
show it emphatically survives for this system's *code*.

---

## R-15 — A1 FRAME, MEASURED: the crit caption appears at 100 % fill and is absent at 98.0 %

Frame: `reference/frames/session11/gap-focus-trigger/m_nearfull.png` (1800×780; a pre-made
two-panel HUD crop). I cropped `(640,0)-(1800,390)` for the top panel and `(640,390)-(1800,780)`
for the bottom and upscaled **2× Lanczos** before grading.

**Visibly in the top crop:** green bar `11/20`, blue bar `47/47`, a third **white** bar with
**no text in it**, and yellow `150% DAMAGE` beneath.
**Visibly in the bottom crop:** identical `11/20` and `47/47`, the same white bar now carrying
**black** text `CRITICAL HIT`, `150% DAMAGE` unchanged.

Then I measured the fills in the original (blue chi bar at 47/47 = 100 % gives the track):

```
track (blue, 47/47):  x 736 -> 1540   (805 px)
TOP  white bar:       x 737 -> 1525   (789 px)  = 98.0 %
BOT  white bar:       x 737 -> 1540   (804 px)  = 100 %
```

**98.0 % → no caption. 100 % → "CRITICAL HIT".** That is `§1t113s0§.as:344-358` executing on
screen: `_loc3_ > 0 && _loc3_ < 1` hides the field, `_loc3_ >= 1` shows the crit string. A
probabilistic crit cannot produce this; a `reload == maxreload` equality does. **R-03 confirmed
by eye and by pixel.**

Frame and payload agree here. Had they disagreed, the frame would win — and R-16 is the case
where that matters.

**Verdict: HELD.**

---

## R-16 — A1 FRAME cracks a web-only string: 960 = "CANNOT CHANGE STANCE"

Frame: `reference/frames/combat_analysis/Nr4fQstqHDM_t428.0.png` (1920×1080), crop
`(60,880)-(1020,1080)` upscaled **3× Lanczos**.

**Visibly in the crop:** red portrait ring, green bar `20/20` (full), blue bar `26/26` (full),
a third bar that is **empty/brown** carrying light-grey text `CANNOT CHANGE STANCE`, and yellow
`150% DAMAGE` beneath.

The code names that field but not its text — `§1t113s0§.as:110-111`:

```
110:         this.§1t5203s0§ = "<font color=\'#000000\'>" + §1t1521s0§.getString(175) + "</font>";
111:         this.§1t5204s0§ = "<font color=\'#BBBBBB\'>" + §1t1521s0§.getString(960) + "</font>";
```

String **175** resolves in the Android table to `'Critical Hit'`. String **960 does not exist in
the Android table at all** (checked: `strings.json['960'] -> None`). **The frame supplies it:
960 = "CANNOT CHANGE STANCE".** The colour codes corroborate the pairing independently — the
crit caption is `#000000` and renders black-on-white in R-15's bottom crop; the refusal caption
is `#BBBBBB` and renders light-grey-on-brown here.

Note also that the frame renders **ALL CAPS** while the table row 175 is `'Critical Hit'` —
the text field uppercases. **The frame wins: ship the caps.**

Bonus for the audio lane (art-anim-audio-feel blocker ① "ALL AUDIO"): `§1t113s0§.as:352` fires
a **named** SFX event on the same transition — `§1t88s0§.instance.§1t1516s0§("Snd_criticalDamage")`.
The waveform is still unheld; the event name and its exact trigger are not.

**Verdict: HELD.**

---

## R-17 — ⚠ CORRECTION: "150% DAMAGE" is a food buff, NOT the Heavy-stance multiplier

The previous survey's S-09 claimed the frames' yellow `150% DAMAGE` was
`MCSPlayer.as:3213 case HEAVY_STANCE: maxDamage = baseDamage * 1.5` "seen". It is not — and
under R-07 the web Heavy multiplier is 1.4 anyway, so the coincidence it rested on does not
even exist in v0.717.

`OverworldHUD.as:1396-1413` builds that caption from the buff type, as a hardcoded literal that
never touches the string table:

```
1398:            if(bufftype == StatsManager.BUFF_XP)
1400:               buffstr = "150% XP";
1402:            else if(bufftype == StatsManager.BUFF_ATTACK)
1404:               buffstr = "150% DAMAGE";
1406:            else if(bufftype == StatsManager.BUFF_DEFENSE)
1408:               buffstr = "150% DEFENSE";
```

and the buff itself is applied at `MCSPlayer.as:210-223`:

```
210:            if(StatsManager.hasBuff(StatsManager.BUFF_ATTACK))
212:               this.minDamage *= 1.5;
214:            else if(StatsManager.hasBuff(StatsManager.BUFF_DEFENSE))
216:               this.defense *= 1.5;
218:            else if(StatsManager.hasBuff(StatsManager.BUFF_INJURED))
220:               this.minDamage *= 0.5;
221:               this.defense *= 0.5;
222:               this.baseSlashLength *= 0.5;
```

Confirmed by the item copy that grants it, string `4132`:
`'Eat this potato to get the 150% Damage buff.\n\nNote: Only one buff may be active at a time.'`
— which is exactly the Potato Dog the ledger's own §3 crux note names. **The ledger was right
and the previous survey misread it.**

Precise mechanic worth carrying: the buff multiplies **`minDamage` only**, not `damageRange`,
and buffs are **mutually exclusive** (an `else if` chain, and the item copy says so).

**Verdict: HELD (ledger confirmed, previous survey corrected).**

---

## R-18 — §4 Ready bullet UNDERCOUNTS: the tree has TEN player categories, not six — all named

**Ledger (§4:194):** "full 6-category tree structure + per-stance unlock levels".

`skilldata.xml` carries **11** distinct `<category>` values
(`docs/gauntlet/L0/index/skilldata.json` → `skilldata/skill/category`, `distinct_values: 11`,
`numeric_range [1,11]`). The skill screen builds exactly **ten** —
`SkillScreenUI.as:84,103-104`:

```
 84:      internal var categoryCount:int = 10;
103:         this.categoryIcons = [1,2,3,4,5,6,7,8,9,10];
104:         this.categoryDesc = [6024,6025,6026,6027,6028,6029,6030,6031,6032,6033];
```

and those ten blurb ids resolve, in order, to the ten category names — no inference needed:

| cat | name (string) | verbatim |
|---|---|---|
| 1 | 6024 | `'Light Stance Skills\n\nSkills that are usable when in light stance.'` |
| 2 | 6025 | `'Balanced Stance Skills…'` |
| 3 | 6026 | `'Heavy Stance Skills…'` |
| 4 | 6027 | `'Chi Skills\n\nSkills that channel chi to create protective and offensive effects.'` |
| 5 | 6028 | `'Survival Skills\n\nGeneral skills that make life easier.'` |
| 6 | 6029 | `'Ninja Skills\n\nSkills that are based on stealth, deception and illusion.'` |
| 7 | 6030 | `'Fire Element Skills…'` |
| 8 | 6031 | `'Water Element Skills…'` |
| 9 | 6032 | `'Wind Element Skills…'` |
| 10 | 6033 | `'Earth Element Skills…'` |

(The previous survey guessed cat 5 = "Movement/body". It is **Survival** — Farming, Scavenging,
Mining, Coin Purse+, Carrying Weight+, Skill Slots+, Jump, Roll, Dash L/R.)

**Category 11 is NPC-only** — its members (1064 Back Throw, 1065 Air Stab, 1066 Bull Charge,
1067 Punch Lunge, 1068 Undying, plus unnamed 1500/1501) carry **no `<order>` and no
`<lvlreq>`** and are absent from `SkillScreenUI`. That is why the data file holds 11 and the UI
holds 10.

Cross-lane to **rebirth-elements (score 30)**, whose blocker ① is "what each element **does** (24
skills' damage/cost/AoE/status — names only)": cats 7-10 are that lane, all 24 nodes are now
named, costed, cooldowned and per-level-numbered (R-12), each element tree gating on 10/10/10/
30/30/60 units of its element item (`skilldata.xml:612…1935`), and the capstones read
`'Area of Effect Fire Attack\n\nFire Damage: 150% Fire ATK'` (6143-6146). That blocker is
mostly closed by this survey's evidence, not by rebirth-elements' own.

**Verdict: HELD. overturns_ledger = true.**

---

## R-19 — §4 Surface bullet WRONG: chi costs are NOT single-digit

**Ledger (§4:196):** "real Chi costs are single-digit (2/5); config's 30/25/10 is a
fabricated-100-meter rescale."

The `<chi>` domain across 182 level rows is `0, 2, 3, 5, 6, 7, 8, 10, 20, 50, 100`
(`docs/gauntlet/L0/index/skilldata.json` → `skilldata/skill/level/chi`, `numeric_range [0,100]`,
`distinct_values: 11`). Double-digit costs are the norm above level ~30: Substitution Jutsu 20,
Charged Shot 20, Shadow Clone 20, Shunpo/Thousand Stabs/Deadly Cleave/Heavenly Sword/Deadly
Touch/Stealth **50**, and Mass Shadow Clone **100** — `skilldata.xml:1638-1649`:

```
1638: 		<id>1055</id>
1640: 		<lvlreq>80</lvlreq>
1648: 			<chi>100</chi>
1649: 			<cooldown>30</cooldown>
```

Chi is an **absolute integer pool that grows with level**, not a percentage meter
(`BattleUI.as:252-256` prints `chi + "/" + maxchi` and scales the bar by `chi/maxchi`), which
the frames show directly: `26/26` in R-16 and `47/47` in R-15. Start pool is 10/10 with regen
stat 1 (`StatsManager.as:697-699`), regen `+maxchi/10` per tick (`:1733-1739`). So the
"single-digit vs fabricated-100-meter" framing is the wrong axis: costs are absolute, the pool
scales, and the config's 30/25/10 is wrong for a different reason than the ledger states.

**Verdict: HELD. overturns_ledger = true.**

---

## R-20 — §4 Surface bullet CONFIRMED: "Stab" is Heavy L3 "Heavy Stab", a tree node, not a hotbar skill

**Ledger (§4:196):** "'Stab' is Heavy L3 'Heavy Stab,' a tree node, not a hotbar skill."

Every clause checks out. `skilldata.xml:721-727`:

```
721: 		<id>1018</id>
722: 		<displayname>6042</displayname>
723: 		<desc>6047</desc>
724: 		<req><has><id>1002</id><qty>3</qty></has></req>
725: 		<passive>1</passive>
726: 		<order>3</order>
727: 		<category>3</category>
```

`6042 -> 'Stab'`; `6047 -> 'When target is downed, draw a downward line to stab him for massive
damage.'`; category 3 = Heavy (R-18); prerequisite = Heavy Stance Mastery **3**;
`<passive>1</passive>` → `XMLSkill.as:347 canEquip()` returns `!this.passive && …` = false, so
it can never occupy a hotbar slot; and `MCSPlayer.as:3147-3151` reads it as a capability flag
(`this.canStab = this.getSkillLevel(1018) > 0;`).

The full per-stance ladder falls out with it (`<req><has>` quantities per node):

| stance | ×3 | ×4 | ×5 | ×10 capstone |
|---|---|---|---|---|
| Light (1000) | 1014 Light Stance Launch | 1036 Deflect | 1015 Air Combo | 1039 **Shunpo** |
| Balanced (1001) | 1016 Flip-up | 1037 Deflect | 1017 Balanced Stance Launch | 1040 **Thousand Stabs** |
| Heavy (1002) | 1018 **Stab** | 1038 Deflect | 1019 Heavy Stance Launch | 1041 **Deadly Cleave** |

One disambiguation the ledger does not make: **`Thousand Stabs` (1040) is the *Balanced*
capstone**, a different node from the Heavy `canStab`. Anyone grepping "stab" hits both.

**Verdict: HELD** (ledger confirmed).

---

## R-21 — STILL_UNHELD: the ultimates' and elemental kunai/traps' per-level numbers

47 of the 182 level rows resolve to an **empty** effect string, and they cluster on exactly the
skills a builder most wants: 1039 Shunpo, 1040 Thousand Stabs, 1041 Deadly Cleave, 1048 Deadly
Touch's level row, 1055 Mass Shadow Clone, 1070-1073 (Inferno/Tsunami/Tornado/Earthquake), the
eight elemental kunai/traps 1025-1032, and both dashes 1049/1050. Their *card* carried no
number because their damage is computed, not tabled.

For four of them the skill-level `<desc>` still gives the rule (`'…150% Fire ATK'`, Deadly
Touch's `'10 damage for each chi point'`). For the rest the constants live in the ~40
`*Projectile.as` classes under `reference/decompiled/shs3_android_payload/scripts/`, dispatched
from `ProjectileManager.as:195-260` — **which are Android, and R-06/R-07/R-09 prove Android
combat constants are retuned.** So this is now a *two-step* gap, not the one-step "read 40
files" the previous survey described: read them, then find each web counterpart in the
obfuscated bundle.

I did not open them. I am not asserting numbers I have not read.

**Verdict: STILL_UNHELD** (close-path: read the projectile classes in `shs3_android_payload`,
then locate each in `shs3_payload` by constant-pattern grep, as I did for `getDamage`).

---

## R-22 — STILL_UNHELD: skill VFX, animation timing and audio

Nothing in this pass touches how a skill *looks* or *sounds*: cast poses, charge tells, hit
sparks, screen-shake, the Shunpo streak, per-skill SFX. `93_MCSCharacter_SkillsAnimationData.bin`
exists in `reference/extracted/android/` and is presumably where the animation sets live, and
R-16 recovered one SFX **event name** (`Snd_criticalDamage`), but the audio resource blobs are
CWS-encrypted (Stage-0b finding S0-5) and I opened neither.

**Verdict: STILL_UNHELD.**

---

## Re-score

**33 → 86.**

Held now that was not before: all 75 skills **named and described** in shipped English (R-13);
all 182 rows' chi/cooldown (R-01); **135 rows' numeric effect** (R-12); the ten-category tree
with per-stance ladders and 52 prerequisite edges (R-18, R-20); the focus meter's max, dead
zone, switch cost, per-stance slash cost and refill (R-09); the crit trigger, multiplier and
gear term (R-03, R-06); the SPD→cooldown formula with its real cap (R-04); the per-stance damage
and reach multipliers with their mastery curves (R-07, R-08); the chi pool's start/regen (R-19);
and a **byte-identity proof** that the data is web-true (R-14).

Held back from ~95 by: the ultimates' and elemental projectiles' constants (R-21), skill VFX and
audio (R-22), Shunpo's charge/teleport geometry unconfirmed for web (R-11), and the standing
Android-vs-web caveat on all UI copy (R-13).

**Cost of the previous pass's error, stated plainly:** it graded the ledger's `CRIT_MULT=1.3`
as WRONG and told the next session to code 1.5/1.2. Coding that would have mistuned every
critical hit in the game. The lesson generalises — **`shs3_android_payload/` is readable and
therefore seductive, and it is not the build we are recreating.**
