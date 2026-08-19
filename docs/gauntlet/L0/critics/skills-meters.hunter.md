# GAUNTLET L0 — HUNTER CRITIC: **skills-meters**

Blind review. I did not see the surveyor's reasoning, only its 22 claims. Every verdict
below cites an artifact **I** opened this session. Two A1 frames were cropped, upscaled
and looked at with my own eyes.

**Headline: 15 of 22 claims survive. 6 are refuted — 3 because they are WRONG, 3 because
they UNDER-CLAIM and I found the evidence.** The survey's own governing rule ("Android
AS3 is not web-true") was violated by the survey itself on its single most load-bearing
meter constant.

---

## PART 1 — THE THREE WRONG CLAIMS

### ⛔ R-A `skills-meters/focus-meter-numerics-web` — **the meter max is 192 frames, not 120**

The claim: *"max 120 frames (5s)"*, cited to `§1t99s0§.as:55`.

`§1t99s0§.as:55` is **not** maxreload. It is an unrelated static:

```
55:      internal static var §1t12234s0§:int = 5 * 24;
```
…whose only two uses in the whole bundle are `§1t99s0§.as:266` and `§1t122s0§.as:950`,
both assigning it to `§1t4440s0§` — a different field entirely.

The real maxreload is `§1t4415s0§` (proven: `BattleUI.§1t5205s0§(reload, max)` computes
`(param1-48)/(param2-48)`; crit fires on `§1t4414s0§ == §1t4415s0§`; the refill clamps
`if(§1t4414s0§ > §1t4415s0§) §1t4414s0§ = §1t4415s0§`). Its only assignments are:

```
reference/decompiled/shs3_payload/scripts/§1t99s0§.as:249:         this.§1t4415s0§ = 8 * 24;
reference/decompiled/shs3_payload/scripts/§1t4904s0§.as:77:         §1t4415s0§ = 8 * 24;
```

**192 frames = 8 seconds.** And 120 is precisely the ANDROID value, in the structurally
identical position of the same function:

```
reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:239:         this.maxreload = 5 * 24;
```

So the survey imported an Android constant into a claim titled "-web", against its own
stated rule, and mis-cited it to a static that means something else.

**Consequences the survey states and gets wrong:**
- "usable meter range is 72 frames" → it is **144 frames** (192 − 48).
- "a stance switch costs two-thirds of it" → it costs **one third** (48 of 144).
- Any config coding 120 makes the crit bar fill 60% too fast.

Everything *else* in this claim I verified and it holds: 48-frame dead zone
(`§1t113s0§.as:328`), flat 48 switch cost (`§1t99s0§.as:3162`), slash cost
×0.5/×1.0/×1.5 (`:3302/:3306/:3310`), +6 refill (`:3320`). The survey was also right that
Android's dead zone is 24, not 48 (`MCSPlayer.as:1163`).

---

### ⛔ R-B `skills-meters/per-stance-reach-formula` — **Dual and Reversed are swapped**

The claim: *"Dual ×1.4, Reversed ×1.0 floored at 100 px."* That is backwards.

Web stance constants, `§1t99s0§.as:27-35`:
```
27:      internal static var §1t12220s0§:int = 0;   (LIGHT)
29:      internal static var §1t12221s0§:int = 1;   (BALANCED)
31:      internal static var §1t12222s0§:int = 2;   (HEAVY)
33:      internal static var §1t12223s0§:int = 3;   (DUAL)
35:      internal static var §1t12224s0§:int = 4;   (REVERSED)
```
Android names those same ordinals explicitly (`MCSPlayer.as:27-35`: LIGHT 0, BALANCED 1,
HEAVY 2, **DUAL 3, REVERSED 4**).

Web `setStance` therefore reads:
```
3130:             case §1t12224s0§:              <-- REVERSED (4)
3131:                this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3141:             case §1t12223s0§:              <-- DUAL (3)
3142:                this.§1t4417s0§ = this.§1t4420s0§;
3143:                if(this.§1t4417s0§ < 100)  { = 100 }
```

Android's *named* setStance confirms the same structure — `REVERSED_STANCE:
baseSlashLength * 1.5` (no floor) and `DUAL_STANCE: baseSlashLength` (floor 100).

**Correct: Reversed ×1.4 (no floor). Dual ×1.0, floored at 100 px.**

The rest of the claim is exactly right and I re-derived it: Light ×1.4
(`:3094`), Balanced ×(1 + 0.2·M·0.1) (`:3105`), Heavy ×(0.5 + 0.4·M·0.1) floor 100
(`:3116-3119`), and the base
`120 + floor((90 + DAN·5)·SPD/(20+SPD))` (`§1t1523s0§.as:2346-2347`, matched verbatim
by the named Android `StatsManager.getBaseSlashLengthVal`, `:1917-1918`).

---

### ⛔ R-C `skills-meters/per-level-effect-numbers` — 135 is not the numeric count; and the method is unsafe

Two separate problems.

**(1) The count is 83, not 135.** Measured over `skilldata.xml` joined to
`docs/gauntlet/L0/index/strings.json`:

```
levels: 182
level rows with a desc id: 135   blank: 47      <-- survey's 135/47 is correct
level ROWS whose desc contains a digit: 83      <-- the actual numeric count
distinct NON-numeric level descs: 15
```
The 52 non-numeric rows are exactly the ones a config needs numbers for and does not get:
```
7000 -> 'Increased damage'
7001 -> 'Increased damage and slash range'
7002 -> 'Increased slash range'
7067 -> 'Reduced cooldown'
7095 -> 'Increases the chi charging rate'
```
The claim calls these "a verbatim numeric effect string (damage/duration/dodge-%/slot
counts)". They are not.

**(2) The premise "so no projectile-class reading is needed for them" is disproved by the
survey's own worked example.** The claim asserts Roll is 60/80/100 %. Three sources, three
answers:

| source | Roll L1/L2/L3 |
|---|---|
| Android string table (ids 7004/7005/7006) | 60 / 80 / 100 % |
| Android code `MCSPlayer.as:3302-3313` | 80 / 85 / 90 % |
| **web code `§1t99s0§.as:3364-3375`** | **75 / 85 / 95 %** |

```
3363:             _loc15_ = this.§1t4491s0§(§1t120s0§.§1t10127s0§);   // §1t10127s0§ = 1004 = Roll
3366:                _loc16_ = 75;
3370:                _loc16_ = 85;
3374:                _loc16_ = 95;
```
The shipped card copy contradicts the shipped behaviour **inside the same build**. Ship
75/85/95. The survey's cross-lane instruction to "correct project memory" using the card
number would have coded the wrong evasion curve.

(The '8 skill slots' half of the claim survives: skill 1008 "Skill Slots+" ladders
4/5/6/7/8, so base 3 → max 8, and web `§1t6474s0§.as:64` sets `equippedSlotCount = 8`.)

---

## PART 2 — THE THREE UNDER-CLAIMS I BROKE

### ✅ R-D `skills-meters/shunpo-effect` was PARTIAL — **250 px / 3 s IS web fact**

The survey refused to promote the teleport geometry: *"Android-only and I will not promote
it to web fact."* It is in the web bundle, line-for-line:

```
reference/decompiled/shs3_payload/scripts/§1t99s0§.as
1764:             case §1t11179s0§:            (SHUNPO charging state)
1765:                this.§1t4432s0§ = 3 * 24;                 <-- 3-second charge window
1774:                this.§1t4433s0§ = ...§1t11300s0§, _loc3_, y - 27, ...   (charging FX)
1806:             if(_loc2_ == §1t11179s0§)
1810:                      this.§1t4468s0§(250);               <-- 250 px flash-step, facing right
1815:                      this.§1t4468s0§(-250);              <-- facing left
```
Same file also gives the two sibling charge windows the survey never claimed:
**Thousand Stabs 3 s (`:1777`), Deadly Cleave 4 s (`:1789`).**

**Bonus — a real divergence the survey missed while being over-cautious about a fake one.**
Shunpo's damage is `getBaseDamage() × chargingTime / 2` in web (`:1811` calls
`§1t4476s0§`, which at `:3279-3282` is the *raw* `minDamage + random·damageRange`), but
`getDamage() × chargingTime / 2` in Android (`MCSPlayer.as:1752`), which *is* stance- and
crit-multiplied (`:3198-3223`). **Web Shunpo ignores stance and crit; Android's does not.**

### ✅ R-E `skills-meters/ultimates-and-elemental-projectile-constants` was STILL_UNHELD — found, in four greps

The claim said each constant "must then be located in the obfuscated web bundle by
constant-pattern grep". Done. **43 web classes extend the Projectile base `§1t128s0§`.**

All four elemental ultimates, in the web bundle, identical to Android:

| web class | Damage ctor | AoE radius |
|---|---|---|
| `§1t8338s0§` (Inferno / BigFireBreath) | `param3 * 1.5` `:23` | 600 `:36` |
| `§1t8341s0§` (Tornado) | `param3 * 1.5` `:24` | 200 `:37` |
| `§1t8343s0§` (Tsunami / BigWave) | `param3 * 1.5` `:24` | 400 `:38` |
| `§1t8334s0§` (Earthquake) | `param3 * 1.5` `:27` | 50 `:72` |

The elemental breaths' per-level table is also web-true and identical, in **four** classes
(`§1t8365s0§`, `§1t8398s0§`, `§1t8359s0§`, `§1t8394s0§`): scale 1 / 1.1 / 1.2 / 1.3 / 1.4
and damage ×0.8 / ×0.9 / ×1.0 / ×1.1 / ×1.2 across skill levels 1-5. And Chi Punch
(`§1t8356s0§:19-30`) is 10/20/30 with a 200 px radius — matching Android exactly.

So the claim's stated blocker ("Android combat constants are retuned, so it cannot be
trusted") is over-generalised: **for every projectile I checked, the two builds are
identical.** The retuning the survey found is confined to `MCSPlayer` (crit, stance,
SPD cap, maxreload) — not to the projectile layer.

### ✅ R-F `skills-meters/skill-vfx-anim-audio` was STILL_UNHELD — the "unopened" blob is plain XML

The claim: *"nothing in this pass touches how a skill looks or sounds"*, and
`93_MCSCharacter_SkillsAnimationData.bin` *"is the likely home of the animation sets and
is unopened"*. I opened it. It is **not encrypted** — UTF-8 XML with a BOM:

```
reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin
<?xml version="1.0"?>
<animdata>
<anim i="chargedshot_start" d="4">
<f i="0">
<n i="20" x="9" y="-44" r="-54"></n>
```

**50 named skill animations · 547 keyframes · 8,351 node transforms across a 19-bone rig**
(`d=` equals the `<f>` count in every anim I checked). Directly on-lane:
`shunpo_start`(4) / `shunpo_end`(1), `focus_start`(8) / `focus_end`(13),
`cleave_start`(9)/`cleave_end`(14)/`cleave_pose`(1), `chargedshot_start/end`,
`flurry_parta..d` + `flurry_pose`, `deathtouch_parta..d`, `chicharge_start/end/fly`,
`airstab_start/mid/stab/end`, `punchlunge_*`, `backthrow` + `backthrow_victim`,
`bullcharge_start`, `warcry_*`, `buffarmor_*`, `enchantweapon`, `dash_*`, `backstep_*`,
`frontspin`, `backspin`, `fireball`, `spartakick_*`, `kneegroin` + `kneegroin_victim`.

**VFX:** 47 named spawn types (`ProjectileManager.as:14-106`), including the pure-FX ones —
`PROJ_BLADESLASHFX`, `PROJ_CHARGINGFX`, `PROJ_CHARGINGSHOTFX`, `PROJ_DASHFX`,
`PROJ_WHITEOUTFX`, `PROJ_NINJASMOKE` 1/2/3.

**Audio:** the claim says *"One SFX EVENT NAME was recovered"*. The **web** bundle names
**43**, uniquely:
```
Snd_addStat Snd_back Snd_birds1..3 Snd_bowFire Snd_bowFireMany Snd_challenge Snd_click
Snd_criticalDamage Snd_deflect Snd_die1..3 Snd_drop Snd_equip Snd_error Snd_fart
Snd_goodKoto Snd_hitMetal Snd_jump Snd_mail Snd_menu Snd_menuClose Snd_mining Snd_ninja
Snd_notification Snd_punch Snd_put Snd_refund Snd_rimshot Snd_sadTrombone Snd_slash1..3
Snd_smallClick Snd_smokebomb Snd_sumo Snd_upgradeSkill Snd_wrAttack Snd_wrDeploy
Snd_wrMove Snd_wrScout
```
Skill-specific ones with located call sites: `Snd_upgradeSkill` (`§1t5045s0§.as:1263`,
`§1t24s0§.as:849`), `Snd_ninja` (`§1t406s0§.as:1226/1245/1264/1289`), `Snd_smokebomb`.
Waveforms remain CWS-encrypted (S0-5 stands); the **event vocabulary does not**.

---

## PART 3 — WHAT THE SURVEY MISSED ENTIRELY

### N-1 ⚠ `skilldata.xml` is NOT a complete inventory of the web build's skills

The survey's strongest claim (R-13/byte-identity) is true and I reproduced it — but it
licenses a false converse. The **web** `SkillManager` (`§1t120s0§.as`) declares **54**
skill-id constants; Android declares 50; `skilldata.xml` contains none of the difference:

```
web SkillManager ids: 54   android: 50
web-only vs android: [1074, 1075, 1076, 1077]
web ids NOT in skilldata.xml: [1074, 1075, 1076, 1077]
```

### N-2 ⚠ A FIFTH thing the full meter does — a web-only per-stance auto-evade

Skills 1074 / 1075 / 1076 gate a full-meter damage negation inside the web take-damage
handler `§1t99s0§.as:3328`:

```
3383:  if(this.§1t4465s0§() && this.§1t4414s0§ == this.§1t4415s0§ && (
          this.stance == §1t12220s0§ && this.§1t4491s0§(§1t120s0§.§1t10173s0§) > 0    // LIGHT   + skill 1074
       || this.stance == §1t12221s0§ && this.§1t4491s0§(§1t120s0§.§1t10174s0§) > 0    // BALANCED+ skill 1075
       || this.stance == §1t12222s0§ && this.§1t4491s0§(§1t120s0§.§1t10175s0§) > 0))  // HEAVY   + skill 1076
3385:     §1t3246s0§ = 12;                          // 12 frames invulnerable
3386:     §1t88s0§.instance.§1t1516s0§("Snd_jump");
3387:     return true;                              // hit negated
```
Duplicated at `:3707`. **Android has no equivalent** (grep for the pattern returns
nothing). So in v0.717 a **full Focus meter DOES buy evasion** — which partly reinstates
the project-memory line the survey moved to correct.

### N-3 The in-combat stance gate is an explicit `reload >= 48`, not an inference

The survey argued from the 48-frame charge that a hard lock "would have nothing to
charge". It did not need to infer — the gate is written down twice:
```
3048:      public function §1t4470s0§() : Boolean            // canChangeStance
3050:         return this.§1t4469s0§() && this.§1t4414s0§ >= 48;
3058:      public function §1t4472s0§() : *                  // cycleStance
3060:         if(this.§1t4414s0§ < 48) { return; }
```
`:3064-3079` also fixes the cycle order: **Light → Balanced → Heavy → Light** (and −1 → Light).
This is the claim's strongest evidence and it was left on the table.

### N-4 Kunai ammo (stat 2501) covers 11 skills, not 2 — and one of them is web-only

`§1t120s0§.as` (web SkillManager) has **four** ammo sites, Android has three:
```
266/270:  == 0  → −1     (1007 Throw Kunai + 4 elemental kunai)
319/323:  <  4  → −4     (1051 Windmill Shuriken; card copy: "Uses 4 kunai.")
347/351:  <  8  → −8     (1077 — WEB ONLY, no skilldata row, no name string)
510/514:  == 0  → −1     (1024 Lay Trap + 4 elemental traps)
```

### N-5 `slashUsage` is a weapon stat, floored at 48

`§1t76s0§.as:413-422` — `slashUsage = itemdata.slashusage`, and `if(slashUsage < 48)
slashUsage = 48`. So the meter's per-slash cost is an **items-lane** number
(`itemdata.xml <slashusage>`), which no claim in this survey says.

### N-6 The SPD→cooldown formula has a pre-cap ×1.5 buff term

`§1t1523s0§.as:2279-2296`: the SPD sum is multiplied by 1.5 when `§1t9725s0§(§1t9455s0§)`
(the SPEED buff) is active, *before* the 600 cap. The claim's
`1 - min(SPD,600)/600 × 0.5` omits it. Same shape on the reach side
(`StatsManager.getBaseSlashLength:1908-1911`).

---

## PART 4 — WHAT I RE-OPENED AND CONFIRMED

**A1, looked at with my own eyes (crop + 2× Lanczos, `m_nearfull.png`, 1800×780):** top
panel = green 11/20, blue 47/47, white third bar with **no** text, yellow "150% DAMAGE";
bottom panel = identical bars, white bar now carrying black **"CRITICAL HIT"**. My own
independent pixel scan, not the survey's: blue track x736→1539 = **804 px**; top white
x737→1525 = **789 px = 98.1 %**; bottom white x737→1539 = **803 px ≈ 100 %**. The survey's
98.0 / 100 reproduces within one pixel. Frame and payload agree.

**A1, looked at (crop (60,880)-(1020,1080) + 3×, `Nr4fQstqHDM_t428.0.png`, 1920×1080):**
red portrait ring, green **20/20** full, blue **26/26** full, third bar empty/brown
carrying light-grey **"CANNOT CHANGE STANCE"**, yellow "150% DAMAGE" beneath. String 960
really is absent from `strings.json` (returns `None`), so the frame really does crack a
web-only string. The ALL-CAPS observation stands.

**A3, byte-check reproduced myself:**
```
android len 39045  web len 39003  delta 42
android[40:] == web  ->  True     (39,003 bytes)
```

**Counts re-derived:** 75 `<skill>`, 182 `<level>`, 73/73 displaynames resolve with 0
misses, chi domain exactly `{0,2,3,5,6,7,8,10,20,50,100}`, masteries 1000/1001/1002 have
**10** levels each. Focus (1005) cooldowns 10/9/8 at `:295/:302/:309`; Chi Punch (1069)
cd 5/5/5 at `:1292/:1299/:1306`. The 4.96 / 9.92 / 8.92 reproduction is arithmetically
sound: `int(5·24·0.995)=119 → 4.9583 → 4.96`, `int(10·24·0.995)=238 → 9.9166 → 9.92`,
`int(9·24·0.995)=214 → 8.9166 → 8.92`, via `§1t105s0§.as:308-318` (`cooldown × 24 ×
modifier`, `int` return).

**Precision notes (not refutations):**
- `blocker1-costs-cooldowns` — "every one of the 75 skills' chi costs and cooldowns" is
  loose: 38/75 skills have `<chi></chi>` on every row and 29/75 have `<cooldown></cooldown>`
  on every row. But only **2** of those 29 are non-passive (1500, 1501 — the NPC-only
  category-11 rows), so for all 46 active player skills the cooldown really is present.
  Substance holds.
- `150pct-damage-is-a-food-buff` and `ten-categories-all-named` are cited Android-only but
  are **web-true**: `§1t99s0§.as:211-213` has the same `minDamage *= 1.5` else-if chain,
  and `§1t6474s0§.as:84/103-104` has `= 10` and the identical `[6024..6033]` array. Both
  claims are stronger than filed.

---

## SCORE

The survey's **86** is not supportable as written. Three coded numbers are wrong
(maxreload, Dual/Reversed reach, Roll dodge), which is worse for a rebuild than the two
gaps it honestly flagged. But the two STILL_UNHELDs were both closable in minutes, and
the byte-identity + string-table + crit + SPD + mastery-10 work is solid and I
reproduced all of it. Net: **roughly a wash on score, materially different content.**
Fix the three constants, adopt the six new cites, and 86 is defensible.

**The standing rule this lane produced — "Android XML is web-true, Android AS3 is not" —
needs a third line: _the Android STRING TABLE is not web-true either._** Roll proves it.
