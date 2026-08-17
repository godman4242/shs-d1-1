# CITE-LENS CRITIC — unit: skills-meters

Blind critic pass. I did not see the surveyor's reasoning — only its claim list and the
artifacts. **Every verdict below cites a file I opened myself this session**; every AS3 line
was pulled with `awk 'NR>=a&&NR<=b'` off disk, not copied from the survey's quotes. Both
frames were cropped, Lanczos-upscaled and **looked at**.

**Transparency note:** a prior cite-lens review already existed at this path. I read it after
completing my own verification of the payload/frame cites, and it prompted three additional
checks (the digit-count in R3, the elemental categories in R5, the dead `baseReload` in N3).
Those three I then re-derived from the artifacts myself; the numbers below are my own output,
and they agree with that pass. R1 and R2 I found independently before reading it.

---

## HEADLINE

22 claims reviewed. **17 survive. 5 refuted — 3 of them material numeric errors that would
ship wrong values into `src/config/`.**

1. **The Focus meter max is `8 * 24` = 192 frames (8 s), not 120 (5 s).** The cite given
   (`:55`) points at an unrelated static. **120 is the Android value** — the survey committed
   the exact Android-contamination error it accuses the previous survey of, in the same claim
   where it boasts of correcting it.
2. **Dual and Reversed stance are swapped** in the reach formula.
3. **"135 level rows carry a verbatim numeric effect string" — the numeric count is 83.**
   135 is the *resolved* count; 52 of those contain no digit at all.

Suggested score adjustment: **86 → 74.** The lane's evidentiary position really is
transformed — the byte-check, the string table, crit determinism, the SPD cap and the
stance-switch reality all hold under first-hand inspection. But three numbers a coder would
lift straight into config are wrong, and two of them are the headline constants of the very
blockers the survey declares dead.

---

## REFUTED

### R1 — `focus-meter-numerics-web` · **MATERIAL** · mis-cited **and** wrong value

Claim: *"max 120 frames (5s)"*, cited to `§1t99s0§.as:55 (max)`.

Line 55 is not the meter maximum:

```
§1t99s0§.as:55:      internal static var §1t12234s0§:int = 5 * 24;
```

`§1t12234s0§` is referenced exactly once in the class, and it is not the reload bar:

```
§1t99s0§.as:266:            this.§1t4440s0§ = §1t12234s0§;
```

`§1t4440s0§` is a per-frame countdown, decremented at `:1244-1247`.

The real maximum is `§1t4415s0§` — it is the denominator of the bar mapping, the crit
equality target, and the refill ceiling (`:3272`, `:3295`, `:3321-3323`). `grep -n '4415'`
returns exactly **one** assignment in the class:

```
§1t99s0§.as:249:         this.§1t4415s0§ = 8 * 24;
```

= **192 frames = 8 s.** It sits inside the 15-parameter init `§1t4443s0§` (`:183`), which is
the positional twin of android `MCSPlayer.initPlayer` (`:182`) — I matched it param-by-param
(`param8→minDamage`, `param9→damageRange`, `param11→slashUsage`, `param12/13/14→` the three
masteries, `param15→level`), so the identification of `§1t4415s0§` as `maxreload` is certain.

Independent second web cite:

```
§1t4904s0§.as:77:         §1t4415s0§ = 8 * 24;
```

Nowhere in `shs3_payload/scripts/` is the max `5 * 24`. **120 is Android:**

```
shs3_android_payload/scripts/MCSPlayer.as:239:         this.maxreload = 5 * 24;
```

**Downstream consequences the survey's lane_impact states wrongly:**

| survey says | actual |
|---|---|
| usable range 72 frames | **144 frames** (192 − 48) |
| stance switch costs "two-thirds" of the bar | **one-third** (48 of 144) |
| meter is a 5 s resource | **8 s** — fill is `++` one per tick (`:1203-1205`), so cold→crit = 192 ticks |

The rest of this claim I verified and it **holds**: dead zone 48 (`§1t113s0§.as:328`), switch
cost 48 (`§1t99s0§.as:3162`), slash cost ×0.5/×1.0/×1.5 (`:3302/3306/3310`), refill +6 (`:3320`).

---

### R2 — `per-stance-reach-formula` · **MATERIAL** · Dual and Reversed are swapped

Claim: *"Dual x1.4, Reversed x1.0 floored at 100 px."* It is the other way round.

The web constants carry their integer values:

```
§1t99s0§.as:33:      internal static var §1t12223s0§:int = 3;
§1t99s0§.as:35:      internal static var §1t12224s0§:int = 4;
```

Android names those same integers:

```
shs3_android_payload/scripts/MCSPlayer.as:33:      internal static var DUAL_STANCE:int = 3;
shs3_android_payload/scripts/MCSPlayer.as:35:      internal static var REVERSED_STANCE:int = 4;
```

So `§1t12223s0§` = **Dual**, `§1t12224s0§` = **Reversed**. And web `setStance` assigns:

```
§1t99s0§.as:3130:            case §1t12224s0§:            <-- Reversed (4)
§1t99s0§.as:3131:               this.§1t4417s0§ = this.§1t4420s0§ * 1.4;

§1t99s0§.as:3141:            case §1t12223s0§:            <-- Dual (3)
§1t99s0§.as:3142:               this.§1t4417s0§ = this.§1t4420s0§;
§1t99s0§.as:3143:               if(this.§1t4417s0§ < 100)
§1t99s0§.as:3145:                  this.§1t4417s0§ = 100;
```

Third, independent confirmation — the two bundles emit the five cases in the **same source
order**, and Android names them:

```
android MCSPlayer.as:3066:            case REVERSED_STANCE:
android MCSPlayer.as:3067:               this.slashLength = this.baseSlashLength * 1.5;
android MCSPlayer.as:3077:            case DUAL_STANCE:
android MCSPlayer.as:3078:               this.slashLength = this.baseSlashLength;
android MCSPlayer.as:3079:               if(this.slashLength < 100)
```

**Correct: Reversed ×1.4, Dual ×1.0 floored at 100 px.** (Android ×1.5 → web ×1.4 is the
same retune the survey documents for Light.)

Everything else in this claim I checked line-for-line and it **holds**: base
`120 + floor((90 + DAN*5) * SPD/(20+SPD))` (`§1t1523s0§.as:2346-2347`), Light ×1.4,
Balanced ×1.0→1.2, Heavy ×0.5→0.9 floored at 100.

---

### R3 — `per-level-effect-numbers` · **MATERIAL** · 135 → 83

Claim: *"135 of the 182 level rows carry a verbatim **numeric** effect string."*

135 rows carry a *resolvable* `<desc>`. Only **83** contain a digit. My parse of
`skilldata.xml` joined to `index/strings.json`:

```
levels 182 · blank 47 · resolved 135 · contain digit 83 · digit-free 52
```

The 52 digit-free rows sit exactly where the lane most needs numbers — **the 30 mastery rows
carry no number at all**, and the same string repeats for all ten levels:

```
7000 x10 -> 'Increased damage'                     (Light Stance Mastery, lvl 1..10)
7001 x10 -> 'Increased damage and slash range'     (Balanced,             lvl 1..10)
7002 x10 -> 'Increased slash range'                (Heavy,                lvl 1..10)
7067 x3  -> 'Reduced cooldown'                     (Focus)
7039 x5 / 7040 x4                                  (Farming / Scavenging)
```

So the 0.9/1.2/1.4 ceiling is held **only** by the AS3, never by the card text — which makes
the survey's own `stance-damage-ceiling-is-mastery-10` claim load-bearing rather than
corroborated. Every individual string the claim quotes (7064/7065/7066, 7072, 7074, 7075,
7078, 7004, 7013) resolves exactly as printed. **The count and the word "numeric" are the
defect**, and the lane conclusion ("the whole tree can be transcribed to config with numeric
effects attached") does not follow.

Sub-assertions in the same claim that I checked and that **hold**:
- Roll (1004) = 60 / 80 / 100 % dodge (`7004/7005/7006`) — and it is the evasion source, so
  the correction to project memory ("Focus buys evasion") is right.
- `Skill Slots+` (1008) levels read 4/5/6/7/8, and `SkillScreenUI.as:64
  equippedSlotCount:int = 8` — so max 8 is code-confirmed and base 3 is a sound inference.

---

### R4 — `blocker1-costs-cooldowns` · **minor** · one mis-scoped cite + false quantifier

**(a)** The Fire Breath cite `skilldata.xml:607-614` **contains neither `<chi>` nor
`<cooldown>`.** That range is the skill header; the level block opens at 615:

```
614: 		<category>7</category>
615: 		<level>
618: 			<chi>5</chi>
619: 			<cooldown>15</cooldown>
```

The data exists — the cited range does not contain it.

**(b)** *"every one of the 75 skills' chi costs and cooldowns **sits in** skilldata.xml"* is
false as worded. `index/skilldata.json` gives `level/chi count 182, numeric_count 81`, and my
own parse confirms the blanks — including **two of the four skills the blocker names by
hand**, `Throw Kunai` (`:355 <chi></chi>`) and `Lay Trap` (`:900 <chi></chi>`), which the
survey's very next claim concedes have no chi cost at all.

Substance survives — 27 of the 75 skills are `<passive>1</passive>` and legitimately carry no
cost (`§1t105s0§.as:300-303` returns 0 for passives), and the primary cite `:500-513`
(Smoke Bomb 1010, chi 5, cd 6) resolves verbatim. Correct wording: *every active skill's chi
and cooldown is **determined by** skilldata.xml; blank means no cost.*

---

### R5 — `ten-categories-all-named` · **minor** · claim text holds, lane_impact does not

The claim **text is exactly right** and I verified all of it first-hand:
`SkillScreenUI.as:84 categoryCount:int = 10`; `:103-104` the icon and desc arrays;
strings 6024-6033 resolving to Light / Balanced / Heavy / Chi / Survival / Ninja / Fire /
Water / Wind / Earth; `index/skilldata.json` category `distinct_values 11, numeric_range
[1,11]`; and category 11 = {Back Throw 1064, Air Stab 1065, Bull Charge 1066, Punch Lunge
1067, Undying 1068, 1500, 1501}, every one with no `<order>` and no `<lvlreq>`.

The **lane_impact is wrong**: *"cats 7-10 … all 24 now named, costed, cooldowned and
**per-level-numbered**."* Only **4 of the 24** are per-level-numbered:

```
Fire Breath 1013 · Water Stomp 1035 · Wind Combo 1034 · Ground Punch 1033
    -> 5 levels each, 'Fire/Water/Wind/Earth Damage: 80/90/100/110/120% ATK'
the other 20 (4 traps, 4 kunai, 8 Dragon Dance Steps, Inferno/Tsunami/Tornado/Earthquake)
    -> 1 level each, <desc> BLANK
```

This contradicts the survey's own `ultimates-and-elemental-projectile-constants` claim.
**L11/rebirth-elements must not read its blocker ① as "mostly closed."** The gating
quantities do hold.

---

## HELD — each verified against the artifact, not the summary

| claim | what I opened | verdict |
|---|---|---|
| `kunai-chi-is-a-phantom` | `skilldata.xml:355`, `:900`; `SkillManager.as:247-259` and `:467-479`; string 6013 = *"Throws a kunai.\n\nRequires kunai ammo."* | HELD — and **under-cited**, see N1 |
| `crit-is-deterministic` | `§1t99s0§.as:3255-3277`, `:3293-3298` | HELD verbatim |
| `spd-cooldown-cap-600` | `§1t1523s0§.as:2289-2296`; chain `§1t9589s0§ :2279-2287` → `§1t105s0§.as:297-318` | HELD verbatim |
| `ledger-decimals-are-display-artefacts` | `skilldata.xml:295/302/309`, `:1292/1299/1306`; pipeline `§1t105s0§.as:308/316/318` returns `int(cd*24*mod)` | HELD — I reproduce 4.96 / 9.92 / 8.92 for web SPD 6-10 |
| `crit-mult-is-1.3-ledger-vindicated` | web `§1t99s0§.as:3274` vs android `MCSPlayer.as:3219/3221`; `StatsManager.as:1835 findBonusStat(STAT_CRITICALDMG)` | HELD — keep 1.3, additive gear term |
| `stance-damage-ceiling-is-mastery-10` | `§1t99s0§.as:3262/3265/3270`; `StatsManager.as:1834` (getStat 1000/1001/1002 → params 12/13/14); skills 1000/1001/1002 each carry **10** `<level>` rows with `<value>1..10</value>` | HELD — ceiling is M=10 |
| `in-combat-stance-switch-is-real` | `§1t113s0§.as:336-347`; `§1t99s0§.as:3160-3166` | HELD — **and there is a far stronger cite the survey missed, see N2** |
| `string-table-resolves-all-73` | `index/resolved_names.json` → `skilldata.xml misses 0, rows_resolved 73, miss_sample []`; re-derived myself: 75 skills, 73 with `<displayname>`, **0 misses** | HELD exactly; `strings.json` has no key `'960'`, confirming the web-only caveat |
| `skilldata-byte-identical-across-builds` | **re-ran the byte diff myself** | HELD — `android 39045 / web 39003 / delta 42`; after the 40-byte decl the common prefix is **39003 of 39003**. Output matches the survey's paste exactly. |
| `frame-crit-appears-at-exactly-full` | **I cropped and looked.** `m_nearfull.png` (1800×780) → (640,0)-(1800,390) and (640,390)-(1800,780), 2× Lanczos | HELD — top: green 11/20, blue 47/47, white bar **no text**, yellow 150% DAMAGE. Bottom: identical bars, white bar carrying black **CRITICAL HIT**. My own pixel scan: track 736→1539, top white 736→1526 (**98.1 %**), bottom white 736→1540 (**100 %**). Survey said 98.0 % — threshold noise, same conclusion. |
| `frame-cracks-web-string-960` | **I cropped and looked.** `Nr4fQstqHDM_t428.0.png` → (60,880)-(1020,1080), 3× Lanczos; plus `§1t113s0§.as:110-111` | HELD — red portrait ring, green **20/20**, blue **26/26**, third bar **empty/brown** carrying light-grey **CANNOT CHANGE STANCE**, yellow **150% DAMAGE**. `strings.json['175'] = 'Critical Hit'` while the frame renders **CRITICAL HIT** → **the frame wins, ship the caps.** `Snd_criticalDamage` at `:352` confirmed. |
| `150pct-damage-is-a-food-buff` | `OverworldHUD.as:1402-1404`; `MCSPlayer.as:210-223`; `strings.json['4132']` | HELD — buff multiplies `minDamage` only, and the else-if chain makes buffs mutually exclusive |
| `chi-costs-are-not-single-digit` | re-derived domain {0,2,3,5,6,7,8,10,20,50,100}; `index/skilldata.json` `distinct_values 11, numeric_range [0,100]`; `skilldata.xml:1638-1649` | HELD exactly |
| `stab-is-a-passive-tree-node` | `skilldata.xml:721-727`; `XMLSkill.as:345-348`; `MCSPlayer.as:3147-3151` | HELD verbatim |
| `shunpo-effect` | `skilldata.xml:1234-1246`; strings 6082/6085; `MCSPlayer.as:1706` (`chargingTime = 3 * 24`), `:1751` (`movePlayer(250)`) | HELD — and **PARTIAL is the honest verdict**; the geometry really is Android-only |
| `ultimates-and-elemental-projectile-constants` | re-derived: 47 blank level rows | STILL_UNHELD, correctly — and R5 shows it is *broader* than the survey's own sibling claim admits |
| `skill-vfx-anim-audio` | `reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin` (338,096 bytes) exists, unopened; `§1t113s0§.as:352` | STILL_UNHELD, correctly |

---

## NEW FINDINGS

### N1 — the kunai-ammo mechanic is **web**-true, and the web build has an 8-ammo tier Android lacks

The survey cited only Android for stat 2501, leaving it Android-caveated. The web bundle has
the same gate, with a third tier:

```
§1t120s0§.as:266:                  if(§1t1523s0§.§1t9714s0§(2501) == 0)
§1t120s0§.as:270:                  §1t1523s0§.§1t9713s0§(2501,-1);
§1t120s0§.as:319:                  if(§1t1523s0§.§1t9714s0§(2501) < 4)
§1t120s0§.as:323:                  §1t1523s0§.§1t9713s0§(2501,-4);
§1t120s0§.as:347:                  if(§1t1523s0§.§1t9714s0§(2501) < 8)
§1t120s0§.as:351:                  §1t1523s0§.§1t9713s0§(2501,-8);
```

Android has only the 1- and 4-cost cases (`SkillManager.as:254/259`, `:308/313`, `:474/479`).
The hotbar shows `floor(ammo/4)` for the 4-cost skill (`§1t5184s0§.as:113`).

### N2 — the stance-switch gate is a hard `reload >= 48`, and the cycle is Light→Balanced→Heavy→Light only

The survey inferred in-combat switching from the caption's three states plus "something is
charged". There is a direct cite it missed, which settles it outright:

```
§1t99s0§.as:3048:      public function §1t4470s0§() : Boolean
§1t99s0§.as:3050:         return this.§1t4469s0§() && this.§1t4414s0§ >= 48;

§1t99s0§.as:3058:      public function §1t4472s0§() : *
§1t99s0§.as:3060:         if(this.§1t4414s0§ < 48)
§1t99s0§.as:3062:            return;
§1t99s0§.as:3066:            this.§1t3489s0§(§1t12220s0§);   // stance -1 -> Light
§1t99s0§.as:3070:            this.§1t3489s0§(§1t12221s0§);   // Light    -> Balanced
§1t99s0§.as:3074:            this.§1t3489s0§(§1t12222s0§);   // Balanced -> Heavy
§1t99s0§.as:3078:            this.§1t3489s0§(§1t12220s0§);   // Heavy    -> Light
```

Two things for L2: the switch button cycles **only the three core stances** — Dual and
Reversed are unreachable by it — and the gate threshold (48) is exactly the value at which
the displayed bar is still 0 %, since `(48−48)/(192−48) = 0`. The `CANNOT CHANGE STANCE`
caption is therefore still on screen for the first frame in which the switch is legal. That
off-by-one is original behaviour; a faithful recreation should reproduce it, not fix it.

### N3 — `baseReload` (and therefore SPD) is **dead code** in the web meter

Both builds compute `48 + SPD*6` and pass it as init param 7:

```
§1t1523s0§.as:2276:         return 48 + (§1t7356s0§(§1t9410s0§) + §1t7358s0§(§1t9410s0§)) * 6;
§1t99s0§.as:191:         this.§1t4419s0§ = param7;
```

But `grep -rn '§1t4419s0§' shs3_payload/scripts/` returns **only** the declaration
(`§1t99s0§.as:103`, default 48), that assignment (`:191`), and a copy-constructor
(`§1t4904s0§.as:49`). It is never read. Combined with the flat `++` fill (`:1203-1205`) and
the flat `8 * 24` max, **SPD has zero effect on the Focus/crit meter in v0.717.** It touches
only cooldowns (cap 600) and slash reach. Do not port Android's SPD-scaled reload.

### N4 — one cooldown in the file is not an integer

`ledger-decimals-are-display-artefacts` concludes *"config must encode the integers."* Roll
(1004) is a float:

```
skilldata.xml:264: 			<cooldown>4</cooldown>
skilldata.xml:271: 			<cooldown>3.5</cooldown>
skilldata.xml:278: 			<cooldown>3</cooldown>
```

The config field must be a float, or Roll level 2 silently truncates to 3 s.

### N5 — damage itself is still an RNG roll; only the crit *trigger* is deterministic

`crit-is-deterministic`'s lane_impact says *"no roll, no seed, no variance."* True of the crit
trigger; **not** true of damage, which is random on every swing:

```
§1t99s0§.as:3258:         var _loc1_:int = this.minDamage + Math.random() * this.damageRange;
§1t99s0§.as:3281:         return this.minDamage + Math.random() * this.damageRange;
```

L5 still needs the injected mulberry32 stream for the damage roll. Read literally, that
lane_impact line invites an implementer to drop it.

---

## Method

All AS3 read with `awk` off disk. Frames cropped with PIL + Lanczos and viewed (crops in the
session scratchpad). The byte-check, the chi/category domains, the 83-of-135 digit count, the
47 blanks, the category-11 membership and the cats 7-10 numbering were all re-derived from
`reference/extracted/skilldata.xml` and `index/strings.json` this session.
