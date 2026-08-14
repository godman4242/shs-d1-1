# CITE-LENS CRITIC — unit: skills-meters

Blind critic. I did not see the surveyor's reasoning. Every verdict below cites an
artifact **I** opened this session. Commands re-run first-hand; nothing taken on trust.

**Headline:** 22 claims reviewed. **17 survive.** **5 refuted** — of which **3 are
material numeric errors that would ship wrong config values**:

1. **Focus meter max is `8 * 24` = 192 frames, not 120.** The cite given (`:55`) points at a
   different variable. 120 is the *Android* value the surveyor was explicitly trying to
   correct — the same error class they accused the previous survey of.
2. **Dual and Reversed stance are SWAPPED** in the reach formula. The web bundle's own
   string literals settle it: `§1t11073s0§ = "dual_stance"`, `§1t11115s0§ = "reversed_stance"`.
3. **"135 level rows carry a verbatim numeric effect string" is 83, not 135.** 52 of the
   135 resolved descs contain no digit at all ("Increased damage", "Reduced cooldown").

Two further refutations are wording/cite defects whose substance survives.

Suggested score adjustment: **86 → 74**. The lane's evidentiary position is genuinely
transformed (byte-check, string table, crit determinism, SPD cap, stance-switch reality all
hold), but three of the numbers a coder would lift straight into `src/config/` are wrong.

---

## REFUTED

### R1 — `skills-meters/focus-meter-numerics-web` · **MATERIAL** · mis-cited + wrong value

Claim: *"max 120 frames (5s)"*, cited to `§1t99s0§.as:55`.

**Line 55 is not maxreload.** It is a class-level static:

```
§1t99s0§.as:55:      internal static var §1t12234s0§:int = 5 * 24;
```

`§1t12234s0§` has exactly three references in the whole web bundle, and none of them is the
reload bar:

```
§1t99s0§.as:55   declaration
§1t99s0§.as:266            this.§1t4440s0§ = §1t12234s0§;
§1t122s0§.as:950              §1t4440s0§ = §1t12234s0§;
```

`§1t4440s0§` is a per-frame countdown (`§1t99s0§.as:1244-1247: if(this.§1t4440s0§ > 0){ --this.§1t4440s0§; ...}`).

The real maxreload is `§1t4415s0§` — it is the denominator in the bar mapping
`(param1-48)/(param2-48)`, the crit equality target, and the refill ceiling. It is assigned
**once**, inside the 15-param init:

```
§1t99s0§.as:249:         this.§1t4415s0§ = 8 * 24;
```

= **192 frames**. The clone/NPC class agrees: `§1t4904s0§.as:77:         §1t4415s0§ = 8 * 24;`.
`grep -rn '§1t4415s0§'` returns no other assignment anywhere in `shs3_payload/scripts/`.

**120 is the Android number**, at the structurally-parallel line of the same function
(android `initPlayer` starts :182, web `§1t4443s0§` starts :183):

```
shs3_android_payload/scripts/MCSPlayer.as:239:         this.maxreload = 5 * 24;
```

**Consequences the survey's lane_impact gets wrong:**
- usable meter range = 192 − 48 = **144 frames**, not 72.
- a stance switch (flat 48) costs **one-third** of the usable bar, not "two-thirds".
- the meter fills `++` **one frame per tick** (`§1t99s0§.as:1203-1205`), so a cold-to-crit
  cycle is **192 ticks / 8 s at 24 fps**, not 5 s.

Everything else in this claim I verified and it **holds**: dead zone 48 (`§1t113s0§.as:328`),
switch cost 48 (`§1t99s0§.as:3162`), slash cost ×0.5/×1.0/×1.5 (`:3302/3306/3310`),
bonus refill +6 (`:3320`).

---

### R2 — `skills-meters/per-stance-reach-formula` · **MATERIAL** · Dual/Reversed swapped

Claim: *"Dual x1.4, Reversed x1.0 floored at 100 px"*. **Reversed.**

The web bundle names its own animation constants — no Android inference needed:

```
§1t1544s0§.as:824:      internal static var §1t11073s0§:String = "dual_stance";
§1t1544s0§.as:866:      internal static var §1t11115s0§:String = "reversed_stance";
```

And `setStance` pairs each reach multiplier with the idle animation it plays:

```
§1t99s0§.as:3130:             case §1t12224s0§:
§1t99s0§.as:3131:                this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
§1t99s0§.as:3134:                   §1t1557s0§(§1t11115s0§);          <-- "reversed_stance"

§1t99s0§.as:3141:             case §1t12223s0§:
§1t99s0§.as:3142:                this.§1t4417s0§ = this.§1t4420s0§;
§1t99s0§.as:3145:                   this.§1t4417s0§ = 100;
§1t99s0§.as:3149:                   §1t1557s0§(§1t11073s0§);          <-- "dual_stance"
```

Second, independent confirmation from the constant values themselves:

```
§1t99s0§.as:33:      internal static var §1t12223s0§:int = 3;
§1t99s0§.as:35:      internal static var §1t12224s0§:int = 4;
shs3_android_payload/scripts/MCSPlayer.as:33:      internal static var DUAL_STANCE:int = 3;
shs3_android_payload/scripts/MCSPlayer.as:35:      internal static var REVERSED_STANCE:int = 4;
```

Third: android's own `setStance` gives REVERSED the long reach (`MCSPlayer.as:3067:
this.slashLength = this.baseSlashLength * 1.5;`) and DUAL the short one (`:3078:
this.slashLength = this.baseSlashLength;`) — same assignment, retuned 1.5 → 1.4.

**Correct: Reversed ×1.4, Dual ×1.0 floored at 100 px.**

Knock-on the survey did not state but a coder will hit: in `deductReloadBar`
(`§1t99s0§.as:3299-3311`) **Reversed groups with Balanced at ×1.0** and **Dual groups with
Heavy at ×1.5** — mirroring android `MCSPlayer.as:3251-3257`. Everything else in this claim
(base = `120 + floor((90 + DAN*5) * SPD/(20+SPD))`, Light ×1.4, Balanced ×1.0→1.2,
Heavy ×0.5→0.9 floored 100) I verified line-for-line and it **holds**.

---

### R3 — `skills-meters/per-level-effect-numbers` · **MATERIAL** · 135 → 83

Claim: *"135 of the 182 level rows carry a verbatim **numeric** effect string"*.

135 rows carry a *resolved* `<desc>`. Only **83** of those contain a digit. I parsed
`skilldata.xml` and joined every level `<desc>` to `index/strings.json`:

```
level rows 182 · blank desc 47 · resolved desc 135 · of which contain a digit 83
```

The 52 digit-free rows are purely qualitative, and they are concentrated on exactly the
skills the lane most needs numbers for:

```
Light Stance Mastery    lvl 1..10  -> 7000 'Increased damage'                (identical all 10)
Balanced Stance Mastery lvl 1..10  -> 7001 'Increased damage and slash range' (identical all 10)
Heavy Stance Mastery    lvl 1..10  -> 7002 'Increased slash range'            (identical all 10)
Focus                   lvl 2,3    -> 7067 'Reduced cooldown'
Farming / Scavenging    lvl 1..5   -> 7039 / 7040  (no numbers)
```

The 30 mastery rows carry **zero** numbers — the 0.9/1.2/1.4 ceiling is held only by the
AS3, never by the card text. Every individual string the claim quotes (7064/7065/7066,
7072, 7074, 7075, 7078, 7004, 7013) resolves exactly as printed; the **count and the word
"numeric" are the defect**.

Sub-assertions in the same claim that I checked and that **hold**:
- Roll 1004 = 60% / 80% / 100% dodge — verified, and it is the evasion source, not Focus.
- base hotbar 3 slots → 8. Better cite than the one given, and it is **web**, not Android:
  `§1t1523s0§.as:2742:         return 3 + §1t9714s0§(1008);` (android twin `StatsManager.as:2295`).
  `Skill Slots+` (1008) levels read 4/5/6/7/8, so base 3 comes from the code, not the table.
- `ChiPunchProjectile.as:20-31` = 10/20/30, matching descs 7064/7065/7066.

---

### R4 — `skills-meters/blocker1-costs-cooldowns` · **minor** · mis-scoped cite + false quantifier

(a) The Fire Breath cite `skilldata.xml:607-614` **contains no `<chi>` and no `<cooldown>`**.
That range is the skill header only; the level block starts one line later:

```
607: 	<skill>
...
614: 		<category>7</category>
615: 		<level>
618: 			<chi>5</chi>
619: 			<cooldown>15</cooldown>
```

The data exists — the cited range does not contain it.

(b) *"every one of the 75 skills' chi costs and cooldowns **sits in** skilldata.xml across
182 `<level>` rows"* is false as worded:

```
chi total: 182   chi EMPTY: 101
cooldown total: 182   cooldown EMPTY: 84
```

Including **two of the four skills the blocker names by hand** — `Throw Kunai` (`:355
<chi></chi>`) and `Lay Trap` (`:900 <chi></chi>`) — which the surveyor's own next claim
concedes have no chi cost at all.

Substance survives: blank is code-defined as 0
(`shs3_android_payload/scripts/XMLSkill.as:272-276 getChiCost` returns 0 on blank; `:302`
same for cooldown), and the 101/84 blanks land almost entirely on the 27 `<passive>1</passive>`
tree nodes. Correct wording: *every active skill's chi and cooldown is **determined by**
skilldata.xml, blank = 0.* The primary cite `:500-513` (Smoke Bomb 1010, chi 5, cd 6)
resolves verbatim.

---

### R5 — `skills-meters/ten-categories-all-named` · **minor** · lane_impact over-claims

Claim text **holds exactly** — `SkillScreenUI.as:84 categoryCount:int = 10`,
`:103-104` icons/descs, strings 6024-6033 resolving Light/Balanced/Heavy/Chi/Survival/
Ninja/Fire/Water/Wind/Earth, category 11 = {Back Throw, Air Stab, Bull Charge, Punch Lunge,
Undying, 1500, 1501} with no `<order>` and no `<lvlreq>`. All verified first-hand.

The **lane_impact is wrong**: *"cats 7-10 … all 24 now named, costed, cooldowned and
**per-level-numbered**"*. Only **4 of 24** are per-level-numbered. Parsed:

```
cat 7  Fire Breath        5 lvls  'Fire Damage: 80/90/100/110/120% Fire ATK'
cat 8  Water Stomp        5 lvls  'Water Damage: 80..120% Water ATK'
cat 9  Wind Combo         5 lvls  'Wind Damage: 80..120% Wind ATK'
cat 10 Ground Punch       5 lvls  'Earth Damage: 80..120% Earth ATK'
the other 20 (traps, kunai, Dragon Dance Steps I/II, Inferno/Tsunami/Tornado/Earthquake):
                          1 lvl each, <desc> BLANK
```

This directly contradicts the survey's own `ultimates-and-elemental-projectile-constants`
claim. L11/rebirth-elements must not read its blocker as closed.

The gating quantities **do** hold: per element, three skills at qty 10, Dragon Dance Step and
the AoE at 30, Dragon Dance Step II at 60 — i.e. the stated {10,10,10,30,30,60}, with item
ids 28 Fire / 30 Water / 29 Wind / 31 Earth.

---

## HELD — verified against the artifact, not the summary

| claim | what I opened | verdict |
|---|---|---|
| `kunai-chi-is-a-phantom` | `skilldata.xml:355`, `:900`, `SkillManager.as:252-259`, string 6013 | HELD — and see N1, it is **web**-true and the survey under-cited it |
| `crit-is-deterministic` | `§1t99s0§.as:3255-3277`, `:3293-3298` | HELD verbatim |
| `spd-cooldown-cap-600` | `§1t1523s0§.as:2289-2296` (cap 600) vs `StatsManager.as:1854-1860` (cap 300) | HELD verbatim |
| `ledger-decimals-are-display-artefacts` | `skilldata.xml:295/302/309`, `:1292/1299/1306`; reproduction re-run | HELD — I independently reproduce 4.96/9.92/8.92 for **web SPD 6-10** (android would need SPD 3-5). Ledger line 194 quoted correctly. |
| `crit-mult-is-1.3-ledger-vindicated` | `§1t99s0§.as:3274` vs `MCSPlayer.as:3219/3221`; `StatsManager.as:258 STAT_CRITICALDMG = 204`; `§1t99s0§.as:271-279` param6 → `§1t1243s0§` | HELD |
| `stance-damage-ceiling-is-mastery-10` | `§1t99s0§.as:3259-3271`; `StatsManager.as:1834` (getStat 1000/1001/1002 → params 12/13/14 → `§1t99s0§.as:196-198`); mastery skills 1000/1001/1002 each have 10 `<level>` rows | HELD — ceiling really is M=10 |
| `in-combat-stance-switch-is-real` | `§1t113s0§.as:336-347`; `§1t99s0§.as:3160-3166` | HELD — **and see N2, there is a far stronger direct cite the survey missed** |
| `string-table-resolves-all-73` | re-derived: 73 skills carry `<displayname>`, **0 misses**; 1500/1501 carry none | HELD exactly |
| `skilldata-byte-identical-across-builds` | re-ran the byte diff myself | HELD — `android 39045 / web 39003 / delta 42`; after stripping the 40-byte decl the common prefix is **39003 of 39003**; sha256 of both bodies `5aba91ed48fcb020` |
| `frame-crit-appears-at-exactly-full` | **I cropped and looked**: `m_nearfull.png` (1800×780) → (640,0)-(1800,390) and (640,390)-(1800,780), 2× Lanczos | HELD — top: 11/20, 47/47, white bar **no text**; bottom: identical, white bar carrying black **CRITICAL HIT**. My own pixel scan: white right edge 1525-1526 (top) vs 1534-1536 (bottom) against a full-blue track ending 1533. I read ~98.8%, the survey read 98.0% — threshold choice, same conclusion. |
| `frame-cracks-web-string-960` | **I cropped and looked**: `Nr4fQstqHDM_t428.0.png` → (60,880)-(1020,1080), 3× Lanczos; plus `§1t113s0§.as:110-111` | HELD — red portrait ring, green **20/20**, blue **26/26**, third bar **empty/brown** with off-white **CANNOT CHANGE STANCE**, yellow **150% DAMAGE** below. `strings.json['960']` is genuinely absent; `['175'] = 'Critical Hit'` while the frame renders **CRITICAL HIT** — **the frame wins, ship the caps.** `Snd_criticalDamage` at `:352` confirmed. |
| `150pct-damage-is-a-food-buff` | `OverworldHUD.as:1402-1404`, `MCSPlayer.as:210-223`, string 4132 | HELD — and the **web** build carries the identical mutually-exclusive else-if chain at `§1t99s0§.as:211-224`, so this is web fact, stronger than claimed |
| `chi-costs-are-not-single-digit` | re-derived distinct chi = {0,2,3,5,6,7,8,10,20,50,100}; `skilldata.xml:1638-1649`; `BattleUI.as:252-256`; `StatsManager.as:1734` regen `maxchi/10` | HELD exactly |
| `stab-is-a-passive-tree-node` | `skilldata.xml:721-727`; `XMLSkill.as:345-348`; `MCSPlayer.as:3147-3151`; skill 1002 = Heavy Stance Mastery, passive, 10 levels | HELD |
| `shunpo-effect` | `skilldata.xml:1234-1247`; strings 6082/6085; `MCSPlayer.as:1705-1706`, `:1747-1752` | HELD, and the PARTIAL verdict is the honest one — the 250 px / 3 s geometry really is Android-only |
| `skill-vfx-anim-audio` | `reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin` exists and is unopened | STILL_UNHELD, correctly |
| `ultimates-and-elemental-projectile-constants` | see N4 — verdict right, description off | STILL_UNHELD, correctly |

---

## NEW FINDINGS the surveyor missed

### N1 — the kunai-ammo mechanic is in the **WEB** bundle, and costs are 1 / 4 / 8, not just 1

The survey cited only Android `SkillManager.as`. The web player has the same gate, with an
extra tier Android does not have:

```
§1t120s0§.as:266:                   if(§1t1523s0§.§1t9714s0§(2501) == 0)
§1t120s0§.as:270:                   §1t1523s0§.§1t9713s0§(2501,-1);
§1t120s0§.as:319:                   if(§1t1523s0§.§1t9714s0§(2501) < 4)
§1t120s0§.as:323:                   §1t1523s0§.§1t9713s0§(2501,-4);
§1t120s0§.as:347:                   if(§1t1523s0§.§1t9714s0§(2501) < 8)
§1t120s0§.as:351:                   §1t1523s0§.§1t9713s0§(2501,-8);
```

Android has only the 1-cost and 4-cost cases (`SkillManager.as:254/259`, `:308/313`,
`:474/479`) — **no 8-cost case**. The web v0.717 build gained an 8-ammo skill.
The hotbar slot shows `floor(ammo/4)` for the 4-cost skill:
`§1t5184s0§.as:113:            this.§1t6959s0§.text = String(Math.floor(§1t1523s0§.§1t9714s0§(2501) / 4));`

### N2 — the stance-switch gate is a hard `reload >= 48`, and the cycle is Light→Balanced→Heavy→Light

The survey argued in-combat switching is real from the caption's three states plus the fact
that something is charged. There is a direct cite:

```
§1t99s0§.as:3048:       public function §1t4470s0§() : Boolean
§1t99s0§.as:3050:          return this.§1t4469s0§() && this.§1t4414s0§ >= 48;

§1t99s0§.as:3058:       public function §1t4472s0§() : *
§1t99s0§.as:3060:          if(this.§1t4414s0§ < 48)
§1t99s0§.as:3062:             return;
§1t99s0§.as:3066:             this.§1t3489s0§(§1t12220s0§);      // stance == -1  -> Light
§1t99s0§.as:3070:             this.§1t3489s0§(§1t12221s0§);      // Light    -> Balanced
§1t99s0§.as:3074:             this.§1t3489s0§(§1t12222s0§);      // Balanced -> Heavy
§1t99s0§.as:3078:             this.§1t3489s0§(§1t12220s0§);      // Heavy    -> Light
```

Two facts for L2 config: the button cycles **only the three core stances** (Dual and
Reversed are unreachable by it), and the switch unlocks at raw reload 48 — which is exactly
the point where the displayed bar is still 0% (`(48-48)/(192-48) = 0`). So the
`CANNOT CHANGE STANCE` caption is still on screen for the single frame in which the switch
first becomes legal. Faithful recreation must reproduce that off-by-one, not "fix" it.

### N3 — SPD is wired into the reload meter in Android and **dead** in the web build

Both builds compute `48 + SPD*6` and pass it into the player as param7:

```
§1t1523s0§.as:2276:          return 48 + (§1t7356s0§(§1t9410s0§) + §1t7358s0§(§1t9410s0§)) * 6;
§1t99s0§.as:191:         this.§1t4419s0§ = param7;
```

But `grep -rn '§1t4419s0§' shs3_payload/scripts/` returns **only** the declaration
(`:103`), that assignment (`:191`), and a copy-constructor (`§1t4904s0§.as:49`). It is never
read. Combined with the flat `++` fill at `:1203-1205` and the flat `8 * 24` max, **SPD has
zero effect on the Focus/crit meter in v0.717** — it only touches cooldowns (cap 600) and
slash reach. Do not port Android's SPD-scaled reload.

### N4 — the 47 blank level rows are all **level-1** rows, one per skill, across 47 skills

The survey describes them as *"clustered on the three stance ultimates, Mass Shadow Clone,
the four elemental AoEs' level rows, the eight elemental kunai/traps and both dashes"*.
Parsed: **every blank sits at `<value>1</value>`**, exactly one per skill, spread over 47
distinct skills. The named set covers ~18; the other ~29 include Jump, Focus, Smoke Bomb,
all three Deflects, Air Combo, Flip-up, Stab and Chi Charge — whose level-1 effect is
carried by the skill's own top-level `<desc>`, **not** by a projectile class. The
STILL_UNHELD verdict is right; the "read 40 projectile files" scope is smaller than stated.

### N5 — one cooldown in the file is not an integer

`ledger-decimals`'s lane_impact says *"config must encode the integers"*. Roll (1004) reads:

```
skilldata.xml:264: 			<cooldown>4</cooldown>
skilldata.xml:271: 			<cooldown>3.5</cooldown>
skilldata.xml:278: 			<cooldown>3</cooldown>
```

`index/skilldata.json` agrees: cooldown `distinct_values 14`, `sample_values [... "3.5" ...]`.
The config field must be a float.

---

## Method note

Every AS3 line above was read with `awk 'NR>=a && NR<=b'` against the file on disk, not from
the survey's quotes. The two frames were cropped with PIL, upscaled Lanczos, and looked at
— the crops are in the session scratchpad. The byte-check and the SPD reproduction were
re-run from scratch and match the survey's pasted output exactly.
