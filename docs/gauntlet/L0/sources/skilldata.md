# L0 SOURCE SWEEP — `skilldata` (orthogonal / by-source)

**Unit:** `reference/extracted/skilldata.xml` (39,003 B · 1,970 lines · 75 `<skill>` × 182 `<level>`)
**Document under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20, avg ~42/100)
**Swept:** 2026-08-15
**Method:** index JSON first (`docs/gauntlet/L0/index/skilldata.json` — counts confirmed, not
re-derived), then the file read end-to-end, then every ID resolved through
`docs/gauntlet/L0/index/strings.json` + `resolved_names.json` (S0-3), then every consumer of a
skilldata field traced in the decompiled AS3.

## ⚠ BUILD-PROVENANCE NOTE — READ BEFORE PORTING

Every AS3 cite below is from `reference/decompiled/shs3_android/scripts/` = the **ANDROID build,
clientVersion 0.682** (`StatsManager.as:30`), not the web **v0.717**. S0-3 warned that "combat
tuning parity is NOT established."

**For skilldata that caveat is now DISCHARGED — see claim `skilldata/android-web-byte-identical`
(the two files are byte-identical) and `skills-meters/measured-cooldowns-explained` (the android
formula reproduces the web longplay's on-screen cooldowns to the hundredth of a second).**
The caveat still stands for AS3 constants I did not independently cross-check.

---

## A. WHAT THE FILE ACTUALLY IS

75 skills, ids **1000–1073 plus 1500, 1501**. The 1000–1073 run is contiguous **except 1023**
(`skilldata.xml:887` closes skill 1022, `:890` opens `<id>1024</id>`) — the single gap in the range.

Eleven `<category>` values. `SkillScreenUI.as:84` sets `categoryCount:int = 10` and
`:104 categoryDesc = [6024,6025,6026,6027,6028,6029,6030,6031,6032,6033]`, which resolve to:

| cat | name (string id) | skills |
|---|---|---|
| 1 | Light Stance Skills (6024) | 1000, 1014, 1015, 1036, 1039 |
| 2 | Balanced Stance Skills (6025) | 1001, 1016, 1017, 1037, 1040 |
| 3 | Heavy Stance Skills (6026) | 1002, 1018, 1019, 1038, 1041 |
| 4 | Chi Skills (6027) | 1005, 1006, 1042–1048, 1069 |
| 5 | Survival Skills (6028) | 1003, 1004, 1008, 1009, 1011, 1020, 1021, 1022, 1049, 1050 |
| 6 | Ninja Skills (6029) | 1007, 1010, 1012, 1024, 1051–1055 |
| 7 | Fire Element Skills (6030) | 1013, 1025, 1029, 1056, 1060, 1070 |
| 8 | Water Element Skills (6031) | 1026, 1030, 1035, 1057, 1061, 1071 |
| 9 | Wind Element Skills (6032) | 1027, 1031, 1034, 1058, 1062, 1072 |
| 10 | Earth Element Skills (6033) | 1028, 1032, 1033, 1059, 1063, 1073 |
| **11** | **no tab, no string** | 1064–1068, 1500, 1501 — **NPC/enemy-only** |

The ledger's skills-meters "Ready" line calls this a "**full 6-category tree structure**"
(`REBUILD_READINESS.md:194`). It is **ten** player-facing categories; the four elemental trees
(cats 7–10, 24 skills) were counted under rebirth-elements instead and the two lanes never
reconciled. Category 11 appears in no ledger system at all.

---

## B. CLAIMS

### 1. `skills-meters/chi-cooldown-table-held` — HELD (A2) — OVERTURNS LEDGER

Ledger `:195` blocker ①: *"① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi, Lay
Trap, elemental) — read skill cards in a preserved build."*

All 182 level rows carry `<chi>` and `<cooldown>` verbatim. The four skills the blocker names:

```
skilldata.xml:508-514   1010 Smoke Bomb   L1  <chi>5</chi>  <cooldown>6</cooldown>
skilldata.xml:927-933   1025 Fire Trap    L1  <chi>3</chi>  <cooldown>6</cooldown>
skilldata.xml:897-903   1024 Lay Trap     L1  <chi></chi>   <cooldown>5</cooldown>
skilldata.xml:991-997   1029 Fire Kunai   L1  <chi>3</chi>  <cooldown>2</cooldown>
```

Chi domain across the file: `0,2,3,5,6,7,8,10,20,50,100` (empty = free).
Cooldown domain: `2, 3, 3.5, 4, 5, 6, 8, 9, 10, 15, 20, 30, 60, 70` seconds.
**Zero INFERRED cooldowns need to remain in config. The blocker is dead.**

### 2. `skills-meters/spd-cooldown-formula` — HELD (A2) — OVERTURNS LEDGER

Ledger `:195` blocker ④: *"④ SPD→cooldown formula."*

```as3
// reference/decompiled/shs3_android/scripts/StatsManager.as:1854-1861
internal static function getSkillCooldownModifierVal(speed:int) : Number
{
   if(speed > 300) { speed = 300; }
   return 1 - speed / 300 * 0.5;
}
```
and `:1844-1853 getSkillCooldownModifier()` — `speed = STAT_SPEED + findBonusStat(STAT_SPEED)`,
then `if(hasBuff(BUFF_SPEED)) { speed *= 1.5; }`.

Applied at `XMLSkill.as:289-311`:
```as3
public function getCooldown(lvl:int) : int
{ ... val = this.levelList[lvl].cooldown * 24;
  return val * StatsManager.getSkillCooldownModifier(); }
```

So **effective cooldown = xmlCooldown × (1 − SPD/600)**, SPD capped at 300 (max −50 %), Speed buff
multiplies SPD by 1.5 *before* the cap. Exact, closed, no measurement needed.

### 3. `skills-meters/measured-cooldowns-explained` — HELD (A2) — cross-build parity proof

Ledger `:194` "Ready": *"Chi Punch (10/20 dmg, cost 2, cd 4.96s); Replenish Focus (cost 5, cd
9.92→8.92s)"* — three oddly precise numbers read off the **web v0.717** longplay.

The payload reproduces all three exactly. `getCooldown` returns `int`, so it truncates:

| skill | xml row | xml cd | ×24 | × (1−5/600) | int | ÷24 → `.toFixed(2)` | ledger measured |
|---|---|---|---|---|---|---|---|
| 1042 Chi Punch L1 | `skilldata.xml:1288-1294` | 5 | 120 | 119.0 | 119 | **4.96** | 4.96 ✓ |
| 1005 Focus L1 | `skilldata.xml:291-297` | 10 | 240 | 238.0 | 238 | **9.92** | 9.92 ✓ |
| 1005 Focus L2 | `skilldata.xml:298-304` | 9 | 216 | 214.2 | 214 | **8.92** | 8.92 ✓ |

All three fall out of **SPD = 5**. Three independent hits to the hundredth is not coincidence: the
android v0.682 skilldata + formula **is** the web v0.717 tuning.

Also corrected by the same rows: Chi Punch has a **level 3 = 30 damage** (`:1302-1308`, desc 7066)
the ledger's "10/20 dmg" misses, and the skill is named **"Focus"**, not "Replenish Focus"
(string 6008; desc 6011 = *"Instantly recharges your focus bar."*).

### 4. `skilldata/android-web-byte-identical` — HELD (A3) — kills the S0-3 caveat for this unit

```
$ python3 -c "...normalize whitespace, strip XML decl, sha1..."
android sha1 bdc45aec04640165b78a133483c3a429f13bae27
web     sha1 bdc45aec04640165b78a133483c3a429f13bae27
IDENTICAL
```
`difflib` over the two files' non-blank stripped lines yields **one** hunk: android has
`<?xml version="1.0" encoding="utf-8"?>` on line 1, web does not. 1,895 other lines identical.
Same 75 ids, no id present in one and not the other.

`reference/extracted/android/117_Mobile_SkillData.bin` (39,045 B, plain XML, CRLF) vs
`reference/extracted/skilldata.xml` (39,003 B).

### 5. `skills-meters/shunpo-effect` — HELD (A2) — OVERTURNS LEDGER

Ledger `:195` blocker ②: *"② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to
the predecessor SHS2, not Duels)."*

`skilldata.xml:1234-1248` — id 1039, displayname 6082, desc 6085, `<req><has><id>1000</id><qty>10</qty></has></req>`,
`<chi>50</chi> <cooldown>60</cooldown>`. String 6082/6085 resolve to:

> **Shunpo** — *"Ultimate Light Stance technique. / Hold down the skill icon to increase the damage
> it inflicts. / This skill can only be used when in Light Stance."*

`SkillManager.as:54 SKILL_SHUNPO:int = 1039`; `MCSPlayer.as:2395` lists it under `isCharging()`
states. It is a **hold-to-charge damage ultimate gated on Light-Stance-Mastery 10**, 50 chi, 60 s.
The ledger was right that it is not SHS2's slow-mo; the effect itself is now held.
Its two siblings resolve the same way: **1040 Thousand Stabs** (Balanced) and **1041 Deadly Cleave**
(Heavy), both 50 chi / 60 s / mastery-10 gated.

### 6. `skills-meters/focus-is-the-reload-meter` — HELD (A2) — OVERTURNS LEDGER

Ledger `:195` blocker ③: *"③ Focus numerics (max/fill/switch-cost)."* All three are held, because
**the Focus bar IS the `reload` meter**:

```as3
// SkillManager.as:218-221
case SKILL_FOCUS:
   owner.reload = owner.maxreload - 1;
```
(`SkillManager.as:18 SKILL_FOCUS:int = 1005`; string 6011 = "Instantly recharges your focus bar.")

- **max** — `StatsManager.as:1839-1842 getBaseReload() { return 48 + (STAT_SPEED + bonus) * 6; }`,
  in 24 fps frames → **2 s + SPD/4 s**. Passed into `MCSPlayer.initPlayer(..., baseReload, ...)`
  (`MCSPlayer.as:182,190`).
- **fill** — instant to `maxreload − 1` via skill 1005 (chi 5; cd 10/9/8 s at levels 1/2/3,
  `skilldata.xml:291-311`), gated `lvlreq 5` and `<req><has><id>1042</id>…` (needs Chi Punch).
- **drain per slash** — `StatsManager.as:1921-1930 getSlashUsage()` returns the equipped weapon's
  `<slashusage>` with a **hard floor of 48**; 106 `<slashusage>` rows exist in `itemdata.xml`
  (e.g. `itemdata.xml:8044 <slashusage>72</slashusage>`). Weapon choice sets slashes-per-bar.
- **switch-cost** — inside `MCSPlayer.as:3019 setStance()`:
  ```as3
  // MCSPlayer.as:3098-3105
  if(this.reload > this.maxreload / 2) { this.reload = this.maxreload / 3; }
  else                                 { this.reload -= this.maxreload / 6; }
  ```
  Changing stance costs Focus: down to a third if above half, else a flat sixth.

### 7. `combat-core/five-stances-not-three` — HELD (A2) — OVERTURNS LEDGER

`grep -i "reversed\|dual" docs/research/REBUILD_READINESS.md` returns **nothing**. The whole ledger
models three stances (`:74` *"Physical = (ATK + WeaponDMG) × stanceMult"*; `:100` *"`STANCE_TABLE`
already carries reach 300/200/120"*).

Skills **1500 and 1501** (`skilldata.xml:1947-1957`, `:1959-1969`) have no `<displayname>`, no
`<desc>`, no `<order>`, no `<lvlreq>` — category 11 only. They are stance selectors read off the NPC
row:

```as3
// EnemyPlayer.as:836-843  (identical in EnemyElite.as:161-167, FriendlyElite.as:84-90)
if(xml.getMastery(1500) > 0)      { setStance(REVERSED_STANCE); }
else if(xml.getMastery(1501) > 0) { setStance(DUAL_STANCE); }
```

Corroborated by the art pipeline: S0-1 lists `reversed` and `dual_stance` among the 19 bindata
animation sets, and `reference/extracted/android/` holds
`95_MCSCharacter_ReversedStanceAnimationData.bin` and `101_MCSCharacter_DualStanceAnimationData.bin`.
**Five stances shipped. Two are NPC-only and absent from all 12 ledger systems.**

### 8. `combat-core/stance-reach-formula` — HELD (A2) — OVERTURNS LEDGER

Ledger `:190` combat-core blocker ①: *"① reach cap in **stage px** per stance (the one value the
whole model needs; wiki gives 'units' of unknown scale) — measure blade-FX tip-to-body span … or
slash a dummy in a preserved build."* Called "the one value the whole model needs." It is in the
payload, in px, complete.

```as3
// StatsManager.as:1915-1919
internal static function getBaseSlashLengthVal(speed:int) : int
{
   var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
   return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
}
```
```as3
// MCSPlayer.as:3030   LIGHT     this.slashLength = this.baseSlashLength * 1.5;
// MCSPlayer.as:3041   BALANCED  this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01);
// MCSPlayer.as:3052   HEAVY     this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);
//        :3053-3055             if(this.slashLength < 100) { this.slashLength = 100; }
// MCSPlayer.as:3067   REVERSED  this.slashLength = this.baseSlashLength * 1.5;
// MCSPlayer.as:3078   DUAL      this.slashLength = this.baseSlashLength;  (:3079-3081 same <100 floor)
```
Consumed as the input cap: `MCSPlayer.as:3094 InputManager.setMaxDistance(this.slashLength);` —
i.e. **slashLength is the maximum length of the drawn line, in stage px.**

The `heavyMastery`/`balancedMastery` terms come from `getStat(1002)`/`getStat(1001)`
(`StatsManager.as:1834`), the stance-mastery skill values from `skilldata.xml`.

Note the **Heavy floor of exactly 100** — the ledger's `:101` correction *"(and Heavy should be 100,
not 120)"* is confirmed by the source, and it is a floor, not a table entry. Light takes a flat
×1.5 with **no** mastery term, so Light's reach never scales with mastery.

### 9. `combat-core/mastery-domain` — STILL_UNHELD

The `0.5 * mastery * 0.01` coefficient only produces a meaningful spread if `mastery` runs 0–100
(Balanced 1.0→1.5, Heavy 0.5→1.0 — a coherent design that also explains the wiki's 300/200/120
"ceilings"). But `skilldata.xml`'s `<value>` runs 1–10 and `XMLNpc.getMastery()` (`:671-686`)
returns that `<value>` verbatim. **I could not find the conversion.** Whether `getStat(1001)`
returns 1–10 or a 0–100 derived figure is not resolved by anything I read. Do not port a number
here; port the formula and leave the domain flagged.

### 10. `rebirth-elements/24-elemental-skills-with-numbers` — HELD (A2) — OVERTURNS LEDGER

Ledger `:205` rebirth-elements blocker ①: *"① what each element **does** (24 skills'
damage/cost/AoE/status — **names only**)."* The ledger `:83` likewise lists *"the full 24-skill
elemental set NAMES"* under known-knowns.

Categories 7/8/9/10 hold **exactly 24 skills**, 6 per element, with full numbers. Fire, verbatim:

| id | name | lvlreq | req | chi | cd | per-level effect (string) |
|---|---|---|---|---|---|---|
| 1029 | Fire Kunai | — | FireATK ≥ 10 | 3 | 2 | — |
| 1025 | Fire Element Trap | — | FireATK ≥ 10 | 3 | 6 | — |
| 1013 | Fire Breath | 20 | FireATK ≥ 10 | 5/6/7/8/10 | 15 | 7034-7038 = "Fire Damage: 80/90/100/110/120% Fire ATK" |
| 1056 | Dragon Dance Step: Fire | — | FireATK ≥ 30 | passive | — | — |
| 1060 | Dragon Dance Step: Fire II | — | FireATK ≥ 60 | passive | — | *"(Later Heaven)"* |
| 1070 | Inferno | 50 | FireATK ≥ 30 | 50 | 60 | desc 6143 = "Area of Effect Fire Attack / Fire Damage: **150% Fire ATK**" |

Water (1030/1026/1035/1057/1061/1071 · strings 7053-7057), Wind (1031/1027/1034/1058/1062/1072 ·
7048-7052) and Earth (1032/1028/1033/1059/1063/1073 · 7043-7047) are structurally identical, same
chi/cd ladders. **The damage model is a straight percentage of the element ATK stat** — which also
answers blocker ② (*"elemental ATK-vs-DEF formula"*) on the ATK side.

### 11. `rebirth-elements/element-gate-is-a-stat-threshold` — HELD (A2) — CORRECTS LEDGER

Ledger `:206`: *"Dragon Dance unlocks at 3×/6× same-element rebirths — explains why point-stacking
matters."*

The gate in the data is **not** a rebirth count. `<req><has><id>N</id><qty>Q</qty></has></req>` with
N ∈ {28,29,30,31} resolves through `StatsManager.as`:

```as3
StatsManager.as:226   internal static var STAT_FIREATK:int = 28;
StatsManager.as:228   internal static var STAT_WINDATK:int = 29;
StatsManager.as:230   internal static var STAT_WATERATK:int = 30;
StatsManager.as:232   internal static var STAT_EARTHATK:int = 31;
```
and `StatsManager.as:4152-4177 checkConditions()` defaults the comparison to `"gte"` when
`<comp>` is empty (it always is here). So `skilldata.xml:1658 <req><has><id>28</id><qty>30</qty></has></req>`
reads **"STAT_FIREATK ≥ 30"**.

Thresholds: **10** (Kunai / Trap / close-range attack), **30** (Dragon Dance Step + the AoE
ultimate), **60** (Dragon Dance Step II). The ledger's 3×/6× is consistent *if* one rebirth grants
+10 element ATK, but the shipped gate is the **stat**, and it can also be reached through gear —
`StatsManager.as:1835 initAttackStats(... STAT_FIREATK + findBonusStat(STAT_FIREATK) ...)` adds
equipment bonuses. Port the threshold, not the rebirth count.

Also held from the same rows: **8 Dragon Dance Steps**, not 4 — each element has an "Early Heaven"
(cats 7-10, order 3, qty 30) and a **"… II (Later Heaven)"** (order 5, qty 60) variant, all
`<passive>1</passive>`, all described as *"…and gives you the ability to teach it to others"*
(strings 6117/6119/6121/6123/6125/6127/6129/6131). **Dragon Dance is player-to-player teachable.**
Blocker ④'s other half — the Dragon Dance *input* and the Kanji-statue bonus — remains unheld.

### 12. `ui-hud/skill-slots-3-to-8` — HELD (A2) — OVERTURNS LEDGER

Ledger `:235` ui-hud blocker ④: *"④ the '3 skill slots' is really ~2 abilities + a stance up-arrow."*

```as3
StatsManager.as:2295   return 3 + getStat(1008);          // number of usable slots
StatsManager.as:126    public static var skillSlots:Vector.<IntStat> = new Vector.<IntStat>(8);
StatsManager.as:749    skillSlots[0] = new IntStat(1003,1);   // default occupant = skill 1003
SkillManager.as:14     public static var SKILL_JUMP:int = 1003;
```
Skill **1008 "Skill Slots+"** (`skilldata.xml:375-418`, cat 5, lvlreq 5, passive) has 5 levels whose
descs are strings 7009-7013 = **"4 skill slots" … "8 skill slots"**. 3 + 5 = 8 = the vector length.

So: **base 3, max 8, and slot 0 ships pre-filled with Jump.** The ledger's "stance up-arrow" reading
is wrong — the three stance masteries are `<passive>1</passive>` (`skilldata.xml:7`, `:86`, `:165`)
and passives cannot occupy an action slot. The third element is the **Jump skill**, which is why the
icon is an up-arrow (draw an upward line = jump).

### 13. `ui-hud/three-slots-on-screen` — HELD (A1)

`reference/frames/duel_dense/Nr4fQstqHDM_431.0.png` (1920×1080), crop **(1380, 900) → (1920, 1080)**,
Lanczos-upscaled **3×** to 1620×540. Visible: **exactly three** rounded-square skill slots along the
bottom-right, bevelled pale-grey frames on black.
- slot 1 (leftmost) — **empty**, no number label
- slot 2 — labelled **"2"**, gold clenched **fist with motion streaks**, and the whole tile is
  dimmed/tinted (cooling down)
- slot 3 — labelled **"3"**, plain gold **up-arrow**

Same frame's left HUD reads `20/20` green, `26/26` blue, "CANNOT CHANGE STANCE", "150% DAMAGE".

The fist = **1042 Chi Punch** (*"Focuses Chi into your fist for a deadly punch"*), the up-arrow =
**1003 Jump** per claim 12. Frame and payload agree; no conflict to adjudicate here.

### 14. `ui-hud/skill-icons-are-gestural` — HELD (A2) — OVERTURNS LEDGER

Ledger `:235` blocker ②: *"② dynamic HUD 'feel' (bar tween vs snap, combo pop, vignette ramp) —
uncatalogued."* The skill bar is not a row of click-once buttons; the icons carry two input verbs,
stated verbatim in the shipped descriptions:

- **hold-to-charge** — 1039 Shunpo / 1040 Thousand Stabs / 1041 Deadly Cleave (strings 6085/6086/6087)
  and 1046 Charged Shot (6099): *"Hold down the skill icon to increase the damage it inflicts."*
  Charged Shot adds *"Getting hit while charging will cancel the skill"* and scales
  20/40/60 dmg per sec to a 200/400/600 cap (strings 7075-7077).
- **drag-and-drop-to-aim** — 1047 Heavenly Sword (6100): *"Drag and drop skill icon to select target
  location."*; 1049/1050 Dash Right/Left (6103/6105): *"Interchangable with Dash Left Skill if you
  drag and drop skill icon to select direction."* — i.e. **one slot holds both dashes**.

### 15. `art-anim/engine-tick-is-24fps` — HELD (A2)

`XMLSkill.as:300,308` multiply the XML cooldown by **24** to get engine units, and `:116,189,205,223`
divide by 24 for display (`LangManager.getString(647)` = "Cooldown", `648` = "sec").
`MCSPlayer.as:239 this.maxreload = 5 * 24;` likewise. **The original simulation ticks at 24 fps.**
Our `Sim` is fixed 60 Hz — every duration ported from skilldata/AS3 in *frames* must be rescaled
(×2.5), and sub-frame timings that were exact at 24 fps will not land on 60 Hz boundaries.
This is distinct from the ledger's `:84` *"15fps pose latch"*, which is an animation-hold rate, not
the sim rate.

### 16. `progression/required-is-skill-points` — HELD (A2)

`<required>` is not a character level — it is the **skill-point price of that level**:
```as3
// XMLSkill.as:253-263
required = int(this.levelList[lvl].required);
if(StatsManager.getStat(StatsManager.STAT_SKILLPOINTS) < required)
   ... return outputString + (LangManager.getString(158) + ": " + required + "</font>");
```
`strings.json["158"] = "Required Skill Points"`. Character-level gating is the separate `<lvlreq>`
(33 skills carry one; domain 3–80, matching the ledger's `:78` level cap 80).

The three stance masteries run **10 levels** at `<required>` 1,1,2,3,4,5,6,7,8,9
(`skilldata.xml:10-79`) — 46 SP each to max. Because level 1 **and** level 2 both cost 1, the ladder
tops out 9 above its start, which is the likely origin of the wiki's "mastery-9" framing the ledger
repeats at `:58` and `:155`. The data says ten levels.

### 17. `economy/coin-cap-weight-cap-mining-tiers` — HELD (A2) — CORRECTS LEDGER

Ledger `:209` items-equipment "Ready" includes *"weight cap 100"*. That is the base only.

- **1011 Coin Purse+** (`skilldata.xml:531-574`, cat 5, lvlreq 5, passive, 5 levels) — strings
  7020-7023 + 7007: coin cap **2000 → 4000 → 6000 → 8000 → 10000**. A hard economy ceiling the
  ledger's economy section (`:213-216`) does not carry.
- **1009 Carrying Weight+** (`:420-498`, 10 levels) — strings 7014-7018 + 7029-7033: carrying weight
  **120 → 140 → … → 300**. So the cap is 100 base, 300 fully invested.
- **1022 Mining** (`:844-887`, 5 levels) — strings 7059-7063 give the full ore tier ladder:
  L1 coal+iron · L2 +tin · L3 +copper, silver · L4 +titanium · L5 +diamond.
  ⚠ string 7060 ships a verbatim typo: *"Allows you to mine coal, iron, tin and tin deposits."*
- **1020 Farming** (7039) rare-crop chance; **1021 Scavenging** (7040) hidden-item chance.
  Three gathering professions, 5 levels each, all in cat 5 "Survival Skills".

### 18. `world-exploration/secret-areas-behind-bushes` — HELD (A2)

`skilldata.xml:835-841` — skill 1021 Scavenging level 5, `<desc>7094</desc>`:
> *"Bushes concealing paths to secret areas will be highlighted in red."*

A **hidden-passage layer in overworld rooms**, revealed by a skill, in red. The ledger's
world-exploration section (`:223-227`) carries nothing like it, and its `:95` known-unknown is only
*"per-quest trigger types + coords; the full territory map/geography."*

### 19. `meta-social/pvp-rooms-and-a-cut-steal-skill` — PARTIAL (A2)

**Held.** Two skills are explicitly PvP-aware: 1053 Shadow Clone (string 6111) and 1055 Mass Shadow
Clone (6115), both ending *"This skill cannot be used in **PvP rooms**."* Per-skill PvP exclusion
is a shipped rule the ledger's meta-social section (`:243-246`) does not carry.

**Held.** A five-level coin-stealing ability exists in the shipped string table with **no skill row
referencing it** — `strings.json` 7024-7028:
> *"Steal up to 5 coins from other players. If target is online, 50% chance to get caught."*
> … escalating to *"Steal up to 25 … 30% chance to get caught."*

plus 6022 `"Steal"` / 6023 `"Steal other players' money"`, plus the art
(`StealActionIcon.as` → `[Embed(source="/_assets/assets.swf", symbol="symbol1076")]`) wired to
`NodeUI.ACTION_STEAL` (`GenericActionButton.as:191-193`, `:309-311`).

**Not held.** That this belongs to the missing **id 1023** — the single gap in the otherwise
contiguous 1000-1073 run, sitting exactly where the other 5-level cat-5 professions (1020 Farming,
1021 Scavenging, 1022 Mining) live — is inference, not evidence. `SkillManager.as` has no
`SKILL_STEAL` constant and no reference to 1023 anywhere in the AS3. Record it as **cut or
node-only content with orphaned strings**, not as skill 1023.

### 20. `enemies-ai/npcs-run-on-skilldata` — HELD (A2)

`npcdata.xml` carries 647 `<skill>` rows (verified count, §0) and enemies draw their cooldowns
straight from this file:
```as3
// EnemyPlayer.as:825-829
skilldata = QuestEngine.getSkillData(skillList[i].getId());
if(skilldata != null)
{ this.cooldownArray[skillList[i].getId()] = skilldata.getCooldown(skillList[i].getValue()); }
```
And the AI's usage policy is four hard-coded range buckets (`EnemyPlayer.as:30,32,34,36`):
`veryCloseRangeSkillList` (16 skills incl. `SKILL_BACKTHROW`), `closeRangeSkillList` (13),
`midRangeSkillList` (22), `longRangeSkillList` (16). Category-11 skills 1064 Back Throw / 1065 Air
Stab / 1066 Bull Charge / 1067 Punch Lunge appear only in these lists — never in a player tree.
1065 Air Stab is fired on a downed target at a measured range: `EnemyPlayer.as:1079`
`if(this.canUseSkill(SkillManager.SKILL_AIRSTAB) && downedDist > 50 && downedDist < 200)`.
1068 **Undying** is the only skill in the file with **no `<level>` block at all**
(`skilldata.xml:1842-1847`) and is checked as an elite-only revive: `EnemyElite.as:197-203`
`if(!hasSkill(SkillManager.SKILL_UNDYING)) … startAction(SKILL_UNDYING_STATE);`

Ledger `:218-222` enemies-ai scores 34 with blocker ① *"enemy level→stat formula… absent"*; that
blocker is npcdata's to close, but **the enemy moveset + per-skill cooldown half of it is in
skilldata and already held.**

### 21. `skills-meters/crit-proc-rule` — STILL_UNHELD

Ledger `:195` blocker ⑤: *"⑤ crit **proc** rule (chance vs deterministic) — entirely absent."*
`skilldata.xml` contains **no crit field of any kind** — no `<crit>`, no crit string among the 6xxx
or 7xxx descs, no crit term in `XMLSkill.as`. `STAT_CRITICALDMG:int = 204` exists
(`StatsManager.as:258`) but it is an *item/gear* stat plumbed through
`MCSPlayer.initAttackStats(..., findBonusStat(STAT_CRITICALDMG), ...)`, not a skill field.
**This blocker survives my sweep. It is not in skilldata and I will not guess at it.**

---

## C. SCORE IMPACT

`REBUILD_READINESS.md:134` scores **skills-meters 33/100** with five blockers.
After this sweep: ① closed, ② closed, ③ closed, ④ closed, ⑤ **still open**.
Every one of the 182 level rows is byte-portable, name-resolved, and cross-validated against the
web build's own on-screen numbers. The remaining work in L2 is a transcription loop plus one
unresolved question (claim 9, the mastery domain) and one genuinely absent value (claim 21).

`REBUILD_READINESS.md:136` scores **rebirth-elements 30/100** with blocker ① *"names only."*
All 24 elemental skills now carry costs, cooldowns and damage percentages; the gate is a stat
threshold; there are 8 Dragon Dance Steps, not 4, and they are teachable. Blocker ① is dead,
② is half-dead (ATK side held, DEF side not), ③ ④ ⑤ survive.

---

*Sweep by the L0 orthogonal source lane. No file outside this path was modified.*
