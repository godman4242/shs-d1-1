# L0 SOURCE SURVEY — `skilldata` (orthogonal sweep)

Unit: `reference/extracted/skilldata.xml` (39,003 bytes, 1,970 lines, 75 `<skill>` × 182 `<level>`).
Document under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20, avg ~42/100).
Surveyor method: read the file end-to-end; resolved every `<displayname>`/`<desc>` through the
Stage-0b string table; then followed the file OUT into the AS3 that parses it
(`XMLSkill.as`, `SkillManager.as`, `StatsManager.as`, `EnemyPlayer.as`, `MCSActor.as`) and into the
Android animation blob. **The value of this unit is almost entirely in what sits BETWEEN systems** —
skilldata.xml is the join table for combat-core, skills-meters, progression, rebirth-elements,
economy, items-equipment, enemies-ai, ui-hud and art-anim all at once.

Headline: **skilldata.xml is not a "skills" file. It is the spine of five ledger systems, and it
closes or downgrades at least six named REBUILD_READINESS blockers.**

---

## SK-1 — Web and Android skilldata are the SAME FILE. The S0-3 build-parity caveat does not apply here.
**artifact_class A3** · **verdict HELD** · **overturns_ledger false** (overturns a Stage-0b caveat)

Stage-0b finding S0-3 carries the caveat *"UI copy and combat tuning parity is NOT established"*
between the Android build (v0.682) and the web build (v0.717). For skilldata that caveat is now
**measured away**.

```
$ python3 - <<'EOF'
w=open('reference/extracted/skilldata.xml').read()
a=open('reference/extracted/android/117_Mobile_SkillData.bin',encoding='utf-8').read()
...
EOF
web skills: 75 android skills: 75
in android NOT web: []
in web NOT android: []
normalized identical: True
```

Every skill id, every `<chi>`, `<cooldown>`, `<value>`, `<required>`, `<req>`, `<lvlreq>` and every
string id is identical between `reference/extracted/skilldata.xml` (web v0.717) and
`reference/extracted/android/117_Mobile_SkillData.bin` (Android v0.682); the only difference is CRLF
vs LF and the XML prolog. **Consequence: every skill name/desc/level-desc resolved out of the Android
`118_Mobile_Lang_EN.bin` string table can be ported to the web build with zero version risk.** No
"label which build this came from" hedge is needed for skill data specifically.

lane_impact: skills-meters, combat-core, rebirth-elements — removes the provenance discount from
every skilldata-derived number.

---

## SK-2 — The elemental skill tree and the elemental gear stats are ONE system, not two. The link is `req/has/id` 28–31.
**artifact_class A2** · **verdict HELD** · **overturns_ledger TRUE**

Ledger text overturned (§2 rebirth-elements, Surface):
> "elements are TWO systems (rebirth skills **and** gear ATK/DEF typing) — the gear side is measured
> (A-17) but never linked to the rebirth domain."

`skilldata.xml:924` — `<req><has><id>28</id><qty>10</qty></has></req>` (skill 1025 Fire Element Trap).
The same `has` ids 28/29/30/31 gate every category-7/8/9/10 skill at qty 10, 30 or 60.

What id 28–31 ARE, quoted verbatim:
- `reference/decompiled/shs3_android/scripts/StatsManager.as:226` — `internal static var STAT_FIREATK:int = 28;`
- `:228` — `internal static var STAT_WINDATK:int = 29;`
- `:230` — `internal static var STAT_WATERATK:int = 30;`
- `:232` — `internal static var STAT_EARTHATK:int = 31;`
- `StatsManager.as:4230` (inside `checkCondition`) — `else if(id >= 28 && id <= 31)` → `output = getStat(id);`

And what the player is SHOWN when the gate fails — `XMLSkill.as:153-168`:
```
else if(hasid == 28) { outputString += LangManager.getString(302) + " " + hasqty + " " + LangManager.getString(726) + "<br>"; }
```
with strings.json `302 = "Prerequisite:"`, `726 = "Fire Specialization"`, `727 = "Wind Specialization"`,
`728 = "Water Specialization"`, `729 = "Earth Specialization"`.

So: the rebirth "element specialization" counter, the skill unlock gate, and the `Fire ATK` stat that
elemental gear modifies are **literally the same stat id**. This is the missing link the ledger
flags. Note the id order is NOT alphabetical or elemental-wheel order — 28 Fire, **29 Wind**,
**30 Water**, 31 Earth. Any rebuild that assumes 28/29/30/31 = Fire/Water/Wind/Earth will mis-wire
the Water and Wind trees.

lane_impact: rebirth-elements (kills the "never linked" surface), items-equipment (gear elemental
ATK now has a consumer), skills-meters.

---

## SK-3 — "24 elemental skills, names only" is FALSE. Every elemental skill's damage, chi cost and cooldown is on disk.
**artifact_class A2** · **verdict HELD** · **overturns_ledger TRUE**

Ledger text overturned (§2 rebirth-elements, Blockers):
> "① what each element **does** (24 skills' damage/cost/AoE/status — names only)."

The `<desc>` on each `<level>` is a string id whose text is the numeric effect. Resolved:

| skill | id | per-level effect (string ids 7034-7057, 7043-7052) | chi | cooldown |
|---|---|---|---|---|
| Fire Breath | 1013 | `Fire Damage: 80% / 90% / 100% / 110% / 120% Fire ATK` (7034-7038) | 5,6,7,8,10 | 15 s |
| Ground Punch (Earth) | 1033 | `Earth Damage: 80…120% Earth ATK` (7043-7047) | 5,6,7,8,10 | 15 s |
| Wind Combo | 1034 | `Wind Damage: 80…120% Wind ATK` (7048-7052) | 5,6,7,8,10 | 15 s |
| Water Stomp | 1035 | `Water Damage: 80…120% Water ATK` (7053-7057) | 5,6,7,8,10 | 15 s |
| Inferno / Tsunami / Tornado / Earthquake | 1070-1073 | skill `<desc>` 6143-6146 = `Area of Effect Fire Attack\n\nFire Damage: 150% Fire ATK` (etc.) | 50 | 60 s |
| Fire/Water/Wind/Earth Kunai | 1029-1032 | `Throws a kunai that deals fire damage.\n\nRequires kunai ammo.` | 3 | 2 s |
| Fire/Water/Wind/Earth Element Trap | 1025-1028 | `Lay a trap that deals fire damage when triggered.\n\nRequires kunai ammo.` | 3 | 6 s |
| Dragon Dance Step ×4 | 1056-1059 | passive; `Unlocks the Dragon Dance Step for Fire and gives you the ability to teach it to others.` | — | — |
| Dragon Dance Step II ×4 (Later Heaven) | 1060-1063 | passive; same, `(Later Heaven)` | — | — |

Cite for the raw rows: `skilldata.xml:615-650` (skill 1013, five `<level>` blocks with
`<chi>5</chi>`…`<chi>10</chi>` and `<cooldown>15</cooldown>`); `skilldata.xml:1879-1894` (skill 1070
Inferno — `:1882 <lvlreq>50</lvlreq>`, `:1884 <req><has><id>28</id><qty>30</qty></has></req>`,
`:1890 <chi>50</chi>`, `:1891 <cooldown>60</cooldown>`).

**Elemental damage formula (partial):** damage = *percentage × the element's ATK stat*. The ATK side
is now fully specified. The **defence** side of ledger blocker ② (elemental ATK-vs-DEF formula)
remains unheld from this source — skilldata never mentions defence.

**Dragon Dance gate, measured:** Step = 30 specialization points, Step II = 60
(`skilldata.xml:1658` `<req><has><id>28</id><qty>30</qty></has></req>`, `:1726` `qty 60`). The
ledger's §2 surface guess "Dragon Dance unlocks at 3×/6× same-element rebirths" is **consistent**
with 30/60 points if a rebirth grants 10, and the base elemental skills gate at qty **10** = one
rebirth. Recorded as a corroboration, not an independent proof — I did not find the code that grants
the points.

lane_impact: rebirth-elements (blocker ① dead, ② halved, ④ corroborated), combat-core.

---

## SK-4 — The SPD→cooldown formula is not missing. It is four lines of AS3.
**artifact_class A2** · **verdict HELD** · **overturns_ledger TRUE**

Ledger text overturned (§2 skills-meters, Blockers):
> "④ SPD→cooldown formula."

`reference/decompiled/shs3_android/scripts/StatsManager.as:1844-1861`, verbatim:
```
internal static function getSkillCooldownModifier() : Number
{
   var speed:int = getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED);
   if(hasBuff(BUFF_SPEED))
   {
      speed *= 1.5;
   }
   return getSkillCooldownModifierVal(speed);
}

internal static function getSkillCooldownModifierVal(speed:int) : Number
{
   if(speed > 300)
   {
      speed = 300;
   }
   return 1 - speed / 300 * 0.5;
}
```

So: **cooldown multiplier = 1 − min(SPD, 300)/300 × 0.5.** SPD is hard-capped at 300 for this purpose
and the best possible cooldown reduction is exactly **50 %**. The speed BUFF multiplies SPD by 1.5
*before* the cap, so it can push a sub-cap character to the cap but never past it.

Applied at `XMLSkill.as:310`: `return val * StatsManager.getSkillCooldownModifier();`

lane_impact: skills-meters (blocker ④ closed), combat-core, items-equipment (SPD-modifier gear now
has a known consumer).

---

## SK-5 — `<cooldown>` is in SECONDS and the engine converts at **24 FPS**. The game's tick rate is 24, not 30 or 60.
**artifact_class A2** · **verdict HELD** · **overturns_ledger false** (not in the ledger at all)

`XMLSkill.as:308`, verbatim: `val = this.levelList[lvl].cooldown * 24;`
`XMLSkill.as:300` (past max level): `val = this.levelList[this.levelList.length - 1].cooldown * 24;`
`XMLSkill.as:116` (display back to seconds): `cooldown = this.getCooldown(1) / 24;` then rendered as
`cooldown.toFixed(2) + " " + LangManager.getString(648)` with `648 = "sec"`.

Independent confirmation of the 24: `reference/decompiled/shs3_android/scripts/Mobile.as:117` —
`GameEngine.getStageMC().frameRate = 24;`

**Consequence for this repo:** `src/core/Sim.ts` runs at a fixed 60 Hz. Every OG duration constant
recovered from this payload — cooldowns, and every `d="N"` on an animation (see SK-13) — is expressed
in **24 fps frames**, so the conversion factor to our sim is **×2.5**, not ×1 and not ×2. This is a
cross-cutting unit hazard that no system-siloed lane would surface, because it lives in the parser,
not the data. Flagged, not acted on (this lane touches no source code).

lane_impact: combat-core, art-anim-audio-feel, skills-meters — a global unit conversion.

---

## SK-6 — Shunpo's real effect is held. It is a charge-hold stance ultimate, not slow-mo.
**artifact_class A2** · **verdict HELD** · **overturns_ledger TRUE**

Ledger text overturned (§2 skills-meters, Blockers):
> "② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs to the **predecessor SHS2**,
> not Duels)."

`skilldata.xml:1235-1247` (skill 1039), verbatim:
```
		<id>1039</id>
		<displayname>6082</displayname>
		<desc>6085</desc>
		<req><has><id>1000</id><qty>10</qty></has></req>
		<order>10</order>
		<category>1</category>
		<level>
			<value>1</value>
			<required>1</required>
			<chi>50</chi>
			<cooldown>60</cooldown>
```
`6082 = "Shunpo"`; `6085 = "Ultimate Light Stance technique. \n\nHold down the skill icon to increase
the damage it inflicts.\n\nThis skill can only be used when in Light Stance."`
Confirmed by `SkillManager.as:54` — `public static var SKILL_SHUNPO:int = 1039;`

So Shunpo: one level only, **50 chi**, **60 s cooldown** (→ 1440 frames at 24 fps, before the SPD
modifier), requires **Light Stance Mastery at level 10** (`has id 1000 qty 10`), and is **hard-locked
to Light Stance**. Its two siblings are identical in shape: 1040 Thousand Stabs (Balanced, req 1001
×10) and 1041 Deadly Cleave (Heavy, req 1002 ×10), both 50 chi / 60 s. The ledger's parenthetical
("Light L10 ultimate") is confirmed exactly; the effect itself — a hold-to-charge damage scale — is
new.

lane_impact: skills-meters (blocker ② closed), combat-core (a third charge-hold input alongside
Charged Shot 1046 and the Thousand Stabs/Deadly Cleave pair).

---

## SK-7 — "Real Chi costs are single-digit (2/5)" is an OVER-CLAIM. Costs run to 100.
**artifact_class A2** · **verdict HELD** · **overturns_ledger TRUE**

Ledger text overturned (§2 skills-meters, Surface):
> "real Chi costs are single-digit (2/5); config's 30/25/10 is a fabricated-100-meter rescale."

Full `<chi>` distribution over all 182 level rows (counted from the file):
```
'' : 101   |  10 : 18  |  50 : 14  |  5 : 11  |  20 : 9  |  3 : 8
 2 : 5     |   6 : 4   |   7 : 4   |  8 : 4   |  0 : 3   | 100 : 1
```
Only **24 of 81 non-empty rows** are single-digit-and-≤5. Twenty-three distinct skills cost ≥10 chi,
including every stance ultimate (50), Heavenly Sword (50), Deadly Touch (50), Stealth (50), the four
elemental AoEs (50), and **Mass Shadow Clone 1055 at `<chi>100</chi>`** (`skilldata.xml:1648`).

The ledger's inference was drawn from the early tree only (Chi Punch 2, Focus 5) and generalised. The
"fabricated-100-meter rescale" verdict on `src/config` therefore needs re-examining — a 100-point chi
pool is exactly what a 100-cost skill implies. **`<chi>0</chi>` is also a real, distinct value**
(skill 1044 Spirit Thief, `skilldata.xml:1353`) — the parser at `XMLSkill.as:117` suppresses display
when `cost > 0` is false, so zero-cost and blank render identically but are different rows.

lane_impact: skills-meters (surface refuted), combat-core, progression (a 100-chi skill sets a floor
on the max-chi curve: at +5 Chi per stat point from a base of 10, ≥18 points must go to Chi).

---

## SK-8 — The player HUD carries exactly two bars: HP and Chi, as raw integers. **A1 — I opened the frame.**
**artifact_class A1** · **verdict HELD** · **overturns_ledger false**

Frame: `reference/frames/combat_frames/Nr4fQstqHDM_t0130s.png` (1920×1080).
Crop used: `(0, 820) → (700, 1080)`, upscaled 3× with LANCZOS to 2100×780.

Visibly in the crop: a circular straw-hat portrait medallion at bottom-left; to its right a **green
bar reading `20 / 20`** stacked directly above a **blue bar reading `26 / 26`**; beneath both, the
white label **`BALANCED STANCE`**. Top-left of the same frame (crop `(0,0)→(700,260)`, same 3×
upscale) shows two separate currency readouts: a silver-coin icon with **`425` / `COINS`**, a `+`
button, an oval gold-coin icon with **`2` / `GOLD`**, and a red **`GET G…`** button.

Two consequences:
1. **Chi is a small raw integer pool** (26 max at this point in the run), not a 0–100 percentage
   meter. That is consistent with SK-7's low-end costs (Chi Punch 2 = 13 casts here) and confirms a
   100-cost skill is a genuine late-game wall, not a rescale artefact.
2. The in-combat status cluster shows **only** these two bars. No Focus meter and no Critical meter is
   present in this crop. That does not prove Focus has no UI — it may sit elsewhere on screen or only
   in the skill/character panel — so ledger skills-meters blocker ③ (Focus max/fill/switch-cost)
   stays open; see SK-16.

lane_impact: ui-hud, skills-meters, economy.

---

## SK-9 — Base skill slots = 3, hard max = 8. The "3 skill slots" question is answered by code, not by eye.
**artifact_class A2** · **verdict HELD** · **overturns_ledger TRUE (partially)**

Ledger text overturned (§2 ui-hud, Blockers):
> "④ the '3 skill slots' is really ~2 abilities + a stance up-arrow."

`reference/decompiled/shs3_android/scripts/StatsManager.as:2293-2296`, verbatim:
```
      public static function getSkillSlotCount() : int
      {
         return 3 + getStat(1008);
      }
```
Skill 1008 is `Skill Slots+` (`SkillManager` has no constant for it; the string table resolves
`6014 = "Skill Slots+"`, `6016 = "Allows you to equip more skills."`). It has 5 levels
(`skilldata.xml:383-417`) whose level descs are `7009…7013` = `"4 skill slots"`, `"5 skill slots"`,
`"6 skill slots"`, `"7 skill slots"`, `"8 skill slots"`, costs 1/2/3/4/5 SP, `<lvlreq>5</lvlreq>`,
category 5 (Survival).

So the slot count is **3 at character creation, 8 fully invested (15 SP total)**. The ledger's read
("really ~2 abilities + a stance arrow") was an eyeball of one HUD state; the code says 3 real slots.
Where a measurement doc and the source disagree here, the source is unambiguous and the doc's number
was a guess — but note this is A2-vs-doc, not frame-vs-doc, so the frame-wins rule is not engaged.

Also from `canEquip()` (`XMLSkill.as:345-348`): `return !this.passive && StatsManager.getStat(this.id) > 0 && (...)`
— **the 27 passive skills never occupy a slot.** Of 75 skills only 48 are equippable at all, and 7 of
those are enemy-only (SK-11), leaving **41 player-equippable actives competing for 3–8 slots**.

lane_impact: ui-hud (blocker ④ answered), skills-meters, progression.

---

## SK-10 — Category ids 1–11 resolve to the real tree names, and category 11 is unnamed on purpose.
**artifact_class A2** · **verdict HELD** · **overturns_ledger false** (new structure)

`<category>` is a bare integer in all 75 rows. The string table holds the tab headers at 6024-6033,
and the mapping is 1:1 with the skills that carry each id:

| cat | header string | verbatim text | member skills |
|---|---|---|---|
| 1 | 6024 | `Light Stance Skills \n \n Skills that are usable when in light stance.` | 1000, 1014, 1015, 1036, 1039 |
| 2 | 6025 | `Balanced Stance Skills …` | 1001, 1016, 1017, 1037, 1040 |
| 3 | 6026 | `Heavy Stance Skills …` | 1002, 1018, 1019, 1038, 1041 |
| 4 | 6027 | `Chi Skills \n \n Skills that channel chi to create protective and offensive effects.` | 1005, 1006, 1042-1048, 1069 |
| 5 | 6028 | `Survival Skills \n \n General skills that make life easier.` | 1003, 1004, 1008, 1009, 1011, 1020-1022, 1049, 1050 |
| 6 | 6029 | `Ninja Skills \n \n Skills that are based on stealth, deception and illusion.` | 1007, 1010, 1012, 1024, 1051-1055 |
| 7 | 6030 | `Fire Element Skills …` | 1013, 1025, 1029, 1056, 1060, 1070 |
| 8 | 6031 | `Water Element Skills …` | 1026, 1030, 1035, 1057, 1061, 1071 |
| 9 | 6032 | `Wind Element Skills …` | 1027, 1031, 1034, 1058, 1062, 1072 |
| 10 | 6033 | `Earth Element Skills …` | 1028, 1032, 1033, 1059, 1063, 1073 |
| 11 | **no header string exists** | — | 1064-1068, 1500, 1501 |

That is a **10-tab skill screen** — three stance tabs, Chi, Survival, Ninja, four element tabs — with
`<order>` (0-10) giving the within-tab row position. The ledger's skills-meters entry knows only
"skill tree structure" as a Ready item; the tab set, the tab copy and the ordering key are new.

lane_impact: ui-hud (the skill screen is now fully specified structurally), skills-meters, progression.

---

## SK-11 — Category 11 is the ENEMY-ONLY skill set, and it is invisible to anyone reading npcdata.
**artifact_class A2** · **verdict HELD** · **overturns_ledger false** (absent from the ledger)

The seven category-11 rows have no `<lvlreq>`, no `<order>`, no `<desc>`, and no tab header — they
cannot appear on the skill screen. They are not in npcdata either:
```
skill 1064 -> 0 npc refs   skill 1065 -> 0   skill 1066 -> 0   skill 1067 -> 0
skill 1068 -> 0            skill 1500 -> 0   skill 1501 -> 0
```
(grep of `<skill>NNNN</skill>` across `reference/extracted/npcdata.xml`.)

They are granted in **code**. `SkillManager.as:88-96`, verbatim:
```
      public static var SKILL_BACKTHROW:int = 1064;
      public static var SKILL_AIRSTAB:int = 1065;
      public static var SKILL_BULLCHARGE:int = 1066;
      public static var SKILL_PUNCHLUNGE:int = 1067;
      public static var SKILL_UNDYING:int = 1068;
```
and used at `EnemyElite.as:197` — `if(!hasSkill(SkillManager.SKILL_UNDYING))` … `:203`
`startAction(SKILL_UNDYING_STATE);`, with `MCSActor.as:978` `internal static var SKILL_UNDYING_STATE:int = 56;`.

**A system-siloed enemies-ai reader would never open skilldata.xml and would therefore never find
these five enemy abilities.** Names resolve to `Back Throw`, `Air Stab`, `Bull Charge`,
`Punch Lunge`, `Undying`. Skills 1500 and 1501 have **no `<displayname>` at all** and no string —
they are pure state flags queried by id (the obfuscated web build queries 1501 at
`shs3_payload/scripts/§1t122s0§.as:866`).

**Data/code mismatch worth flagging:** `skilldata.xml:1842-1847` gives skill 1068 Undying **no
`<level>` element whatsoever** (it is the only one of the 75 with zero level rows), yet
`MCSPlayer.as:2164` branches on `if(this.getSkillLevel(SkillManager.SKILL_UNDYING) == 2)`. A level-2
Undying exists in code with no data row to define it.

lane_impact: enemies-ai (five new abilities + a two-tier Undying), combat-core.

---

## SK-12 — Enemy AI picks skills from four hard-coded RANGE BANDS. The lists are verbatim in the source.
**artifact_class A2** · **verdict HELD** · **overturns_ledger TRUE**

Ledger text overturned (§2 enemies-ai, and §0's own staleness table which only credits npcdata with
`<ai>` tags):
> "§2 enemies-ai **34/100**, blocker ① *'enemy level→stat formula… absent'*"

`reference/decompiled/shs3_android/scripts/EnemyPlayer.as:30-36` declares four arrays, verbatim
(truncated for width; full lists in the file):
```
internal var veryCloseRangeSkillList:Array = [SkillManager.SKILL_DEADLYCLEAVE,SkillManager.SKILL_DEATHTOUCH,SkillManager.SKILL_SPIRITTHIEF,SkillManager.SKILL_SLASHWAVE,...,SkillManager.SKILL_BACKTHROW];   // 16 skills
internal var closeRangeSkillList:Array     = [SkillManager.SKILL_SLASHWAVE,SkillManager.SKILL_FIREBREATH,...,SkillManager.SKILL_BULLCHARGE,SkillManager.SKILL_PUNCHLUNGE];  // 13
internal var midRangeSkillList:Array       = [SkillManager.SKILL_WINDMILL,SkillManager.SKILL_DASHLEFT,...,SkillManager.SKILL_PUNCHLUNGE];  // 22
internal var longRangeSkillList:Array      = [SkillManager.SKILL_KUNAITHROW,SkillManager.SKILL_TRAP,...,SkillManager.SKILL_BULLCHARGE];    // 16
```
This is the enemy's skill-selection policy: bucket by distance, choose from the band's list. It does
not give the level→stat formula (blocker ① stands), but it is a large, exact, previously-uncatalogued
piece of enemy AI that the ledger scores as absent. The band membership is itself informative — e.g.
`SKILL_HEAVENLYSWORDS` appears in **all four** bands (it is a drag-to-target strike), while
`SKILL_KUNAITHROW` appears only in mid and long.

lane_impact: enemies-ai (large under-claim closed on the *behaviour* axis), combat-core.

---

## SK-13 — 51 skill animations with full per-bone keyframes are on disk, including paired attacker/victim rigs.
**artifact_class A2** · **verdict HELD** · **overturns_ledger TRUE**

`reference/extracted/android/93_MCSCharacter_SkillsAnimationData.bin` — XML, UTF-8 BOM. Tag census:
`animdata 1 · anim 51 · f 547 · n 8351`. Verbatim head:
```
<animdata>
<anim i="chargedshot_start" d="4">
<f i="0">
<n i="20" x="9" y="-44" r="-54"></n>
<n i="19" x="25" y="-50" r="69"></n>
```
`<anim i=NAME d=FRAMES>` → `<f i=KEYFRAME>` → `<n i=BONE x= y= r=>`. That is **21 bones × 547
keyframes of exact translation + rotation** for the skill set. Durations (`d=`) are in **24 fps
frames** per SK-5 — e.g. `backthrow d="39"` = 1.625 s.

The 51 names map onto the skill list: `shunpo_start/_end`, `cleave_start/_end/_pose`,
`deathtouch_parta…partd`, `chargedshot_start/_end`, `focus_start/_end`, `chicharge_start/_end/_fly`,
`airstab_start/_mid/_stab/_end`, `bullcharge_start/_run`, `punchlunge_start/_mid/_end`,
`dash_start/_end`, `backstep_start/_end`, `getup_front`, `punch_start/_end`, `flurry_parta…partd`,
`flurry_pose`, `frontspin`, `backspin`, `fireball`, `spartakick_start/_end`.

**Two mechanisms visible only here:** (a) **paired two-actor animations** —
`backthrow d="39"` + `backthrow_victim d="36"`, and `kneegroin d="30"` + `kneegroin_victim d="41"`
(kneegroin is Spirit Thief 1044, whose desc is `"Knee target in the vitals and steal their chi."`).
The victim's animation is authored separately and is a *different length* to the attacker's, which is
a real animation-system requirement, not a nicety. (b) multi-part skills carry explicit `_pose` holds
(`flurry_pose`, `cleave_pose`, both `d="1"`).

The ledger's art-anim-audio-feel section (56/100) lists no animation-data blocker as closed and
S0-4 estimated ~450 animations across the MCSCharacter blobs; the *skill* subset is 51 of those, and
it is fully keyframed, not merely named.

lane_impact: art-anim-audio-feel (skill animation is HELD, with exact bone transforms and 24 fps
timings), combat-core (per-skill startup/active/recovery is derivable from `d=`).

---

## SK-14 — Three fully-animated buff skills exist that have NO skilldata row and NO SkillManager id.
**artifact_class A2** · **verdict HELD** · **overturns_ledger false** (new)

`MCSActor.as:636-644`, verbatim:
```
      internal static var ENCHANTWEAPON:String = "enchantweapon";
      internal static var BUFFARMOR_START:String = "buffarmor_start";
      internal static var BUFFARMOR_END:String = "buffarmor_end";
      internal static var WARCRY_START:String = "warcry_start";
      internal static var WARCRY_END:String = "warcry_end";
```
All five names have complete keyframe data in `93_MCSCharacter_SkillsAnimationData.bin`
(`enchantweapon d="8"`, `buffarmor_start d="8"` / `_end d="7"`, `warcry_start d="4"` / `_end d="19"`).
`grep -rli` across the whole Android script set returns **only `MCSActor.as`** — the constants are
declared and never referenced anywhere else, and no `<skill>` row and no `SkillManager.SKILL_*`
constant exists for weapon-enchant, armour-buff or war-cry.

Honest reading: these are **animated-but-unwired** abilities — either cut content or NPC/boss
flourishes driven from a data path I did not find. They are a real asset the rebuild can use and a
real gap in the ledger's picture of the ability roster. I am **not** claiming they were playable.

lane_impact: art-anim-audio-feel, enemies-ai, combat-core.

---

## SK-15 — Two complete skills are in the string table with full numerics but have NO row in skilldata.xml.
**artifact_class A2** · **verdict PARTIAL** · **overturns_ledger false** (new; hits meta-social)

Skill ids run 1000-1073 with exactly one hole: **1023 is absent**. The string table holds a
name/desc/level-desc set with no consumer anywhere in skilldata.xml:

```
6022 | 'Steal'
6023 | "Steal other players' money"
7024 | 'Steal up to 5 coins from other players. If target is online, 50% chance to get caught.'
7025 | 'Steal up to 10 coins from other players. If target is online, 45% chance to get caught.'
7026 | 'Steal up to 15 coins from other players. If target is online, 40% chance to get caught.'
7027 | 'Steal up to 20 coins from other players. If target is online, 35% chance to get caught.'
7028 | 'Steal up to 25 coins from other players. If target is online, 30% chance to get caught.'
```
Five levels, a coin ladder 5/10/15/20/25 and a **get-caught chance that falls 50 → 30 % in 5-point
steps, conditional on the target being ONLINE**. And a second orphan set:
```
6051 | 'Smithing'
6055 | 'Train to improve your abilities as a blacksmith.'
7042 | 'Increases your effectiveness in repairing weapons.'
```
`Smithing` sits exactly alongside the three shipped Survival professions — 6048 Farming / 6049
Scavenging / 6050 Mining, which ARE present as skills 1020/1021/1022 at `<order>` 7/8/9. Smithing
would be the fourth.

Verdict is **PARTIAL, not HELD**, because the *strings* are an artifact but the *attribution to id
1023* is inference from the id hole and the adjacency of the string ids — I found no `SKILL_STEAL`
constant in `SkillManager.as` and no row anywhere. What is HELD: a five-level player-vs-player
coin-theft skill and a weapon-repair profession were **specified, costed and localised**, then not
shipped in the data. The steal mechanic is a meta-social system the ledger scores at 31/100 and does
not mention at all.

lane_impact: meta-social (asynchronous PvP theft with exact numbers), economy, items-equipment
(weapon repair), skills-meters.

---

## SK-16 — Coin cap, carry weight and the "gold" naming trap. **Frame vs code — the frame decides the naming.**
**artifact_class A1 + A2** · **verdict HELD** · **overturns_ledger TRUE (partially)**

Two exact economy curves whose *only* definition is a skilldata row plus its consumer:

`StatsManager.as:2632-2650`, verbatim:
```
      internal static function getMaxCoins() : int
      {
         switch(getStat(1011))
         {
            case 0: return 1000;
            case 1: return 2000;
            case 2: return 4000;
            case 3: return 6000;
            case 4: return 8000;
            case 5: return 10000;
            default: return 1000;
         }
      }
```
Skill 1011 is `Coin Purse+` (`6020`), 5 levels, `<lvlreq>5</lvlreq>`, category 5, level descs
`7020-7023, 7007` = `"Coin purse is able to hold 2000 coins"` … `"…10000 coins"`. **Base coin cap =
1000.**

`StatsManager.as:2298-2300`, verbatim:
```
      public static function getCarryingWeight() : int
      {
         return 100 + getStat(1009) * 20;
```
Skill 1009 is `Carrying Weight+`, **10** levels, level descs 7014-7018 + 7029-7033 = `"Carrying
weight: 120"` … `"Carrying weight: 300"`. **Base carrying weight = 100, +20/level, max 300** — and
`itemdata.xml` carries a `<weight>` on items, so the inventory constraint is now fully closed on the
capacity side.

**The naming trap.** `StatsManager.as:2653-2655`: `public static function isCoinPurseFull() : Boolean
{ return getPlayerStats(STAT_GOLD) >= getMaxCoins(); }` — i.e. the stat named `STAT_GOLD` in the code
is the one bounded by the **coin** purse. The frame settles what the player actually sees:
`reference/frames/combat_frames/Nr4fQstqHDM_t0130s.png`, crop `(0,0)→(700,260)` upscaled 3×, shows
**two distinct counters side by side — `425 COINS` and `2 GOLD`** — with a `+` button next to COINS
and a `GET G…` button next to GOLD. Corroborated by string `100 = "You are out of AP.\nWould you like
to get 10 more AP for 1 Gold?"` — Gold is the premium currency.

**Where the code's identifier and the screen disagree, the frame wins: `STAT_GOLD` holds the COINS
value.** A rebuild that maps `STAT_GOLD` onto the gold counter will cap premium currency at 1000 and
leave coins unbounded. Say it out loud: the frame wins, and the AS3 identifier is misleading.

lane_impact: economy (two exact caps + a naming hazard), items-equipment (carry weight closed),
ui-hud, progression.

---

## SK-17 — The unlock cadence is real but has exactly two exceptions, and the stance trees have NO level gate at all.
**artifact_class A2** · **verdict PARTIAL** · **overturns_ledger TRUE (partially)**

Ledger text refined (§2 progression, Ready):
> "L1–L10 XP caps; cap 80; 80 SP first run; unlock cadence" … §0 TL;DR: "skills unlock at levels
> ending 0 (Ninja) / 5 (Chi)."

Every `<lvlreq>` in the file, by category:
- **Chi (cat 4):** 1042 Chi Punch **0** · 1005 Focus 5 · 1006 Slash Wave 15 · 1043 Chi Kick 25 ·
  1044 Spirit Thief 35 · 1045 Chi Burst 45 · **1069 Chi Charge 50** · 1046 Charged Shot 55 ·
  1047 Heavenly Sword 65 · 1048 Deadly Touch 75
- **Ninja (cat 6):** 1007 Throw Kunai 10 · **1024 Lay Trap 15** · 1010 Smoke Bomb 20 ·
  1051 Windmill 30 · 1052 Flashbang 40 · 1053 Shadow Clone 50 · 1054 Stealth 60 ·
  1012 Substitution 70 · 1055 Mass Shadow Clone 80
- **Stance (cats 1/2/3):** every one of the 15 rows has **no `<lvlreq>` element at all**
- **Survival (cat 5):** 0, 0, 0, **3** (Roll), then 5 ×6
- **Elements (cats 7-10):** 0 for traps/kunai/Dragon Dance, 20 for the close attacks, 50 for the AoEs

So the cadence holds for **17 of 19** gated Chi/Ninja skills; the exceptions are **Lay Trap at 15 in
the Ninja tree** and **Chi Charge at 50 in the Chi tree**. Roll at `<lvlreq>3</lvlreq>` is a third
off-pattern value in Survival. The maximum `<lvlreq>` in the file is **80**, independently confirming
the level cap.

**The larger finding is the stance trees.** They are gated **purely by mastery level**, never by
character level: `skilldata.xml:656` `<req><has><id>1000</id><qty>3</qty></has></req>` (Light Stance
Launch), `:1187` `qty 4` (Deflect), `:673` `qty 5` (Air Combo), `:1238` `qty 10` (Shunpo). Stance
Mastery itself (1000/1001/1002) has **10 levels** with `<required>` 1,1,2,3,4,5,6,7,8,9 —
**46 skill points to max one stance**, and 138 to max all three, against "80 SP first run". You
cannot max even two stances in a single life. That is a hard, previously-unstated progression
constraint and it is the real economic argument for rebirth.

It also explains the ledger's §3 correction "the stance tables are **mastery-9 ceilings**": the
level-10 row's `<required>` value is **9**, so a reader scanning the `required` column stops at 9
while `<value>` runs to 10. The ceiling is mastery **10**.

lane_impact: progression (SP budget vs tree cost), skills-meters, rebirth-elements (the motive),
combat-core (stance ultimates are a 46-SP investment).

---

## SK-18 — `<input>` and `<imageurl>` are parsed but EMPTY in all 75 rows. Dragon Dance's input is NOT here.
**artifact_class A2** · **verdict STILL_UNHELD** (for the ledger blocker) · **overturns_ledger false**

`XMLSkill.as:18` declares `public var input:String;` and `:24` `public var imageurl:String;`, and the
constructor reads them at `:60-75`:
```
         if(xml.input != "")
         {
            this.input = xml.input;
         }
```
`grep -c "<input>" reference/extracted/skilldata.xml` → **0**. Same for `<imageurl>`. The schema
supports a per-skill gesture/input string and a per-skill icon URL; **the shipped data sets neither**.

This is the honest negative result for ledger rebirth-elements blocker ④ ("Dragon Dance **input** +
Kanji-statue bonus"). skilldata.xml is the file you would expect to hold it, the schema has a slot
for it, and it is empty. **STILL_UNHELD** — the input notation lives somewhere else (or nowhere).
Likewise skill icons are not data-driven, so they must be embedded art, which pushes that question
into the art-anim lane rather than closing it.

lane_impact: rebirth-elements (blocker ④ confirmed still open, and its likely home eliminated),
ui-hud (skill icons are not data-driven), art-anim-audio-feel.

---

## SK-19 — The web decompile is obfuscated; the Android decompile is clean. Prefer Android for all skill logic.
**artifact_class A2** · **verdict HELD** · **overturns_ledger false** (methodological)

`reference/decompiled/shs3_payload/scripts/` has no `XMLSkill.as` — its classes are named
`§1t120s0§.as`, `§1t1120s0§.as`, and members are `§1t10163s0§`. The same lookup in
`reference/decompiled/shs3_android/scripts/` returns `SkillManager.as:88 public static var
SKILL_BACKTHROW:int = 1064;`.

Combined with SK-1 (the two builds' skilldata is the same file), the correct working rule for the
rest of L0 is: **read logic from `shs3_android/scripts/` and treat it as authoritative for skill
mechanics, because the data it operates on is byte-identical to the web build's.** Every A2 cite in
this survey follows that rule. Where a claim depends on something the two builds could legitimately
differ on — UI copy, monetisation, touch input — I have not made it.

Bonus corroboration: `SkillManager.as:8-106` names 50 of the 75 skill ids as constants
(`SKILL_LIGHTSTANCE 1000` … `SKILL_EARTHQUAKE 1073`), and **every one matches the string-table
resolution**. That is an independent, non-string-table confirmation of S0-3's name mapping for the
skill domain. Three names differ in wording only: 1034 `SKILL_WINDKICK` vs "Wind Combo",
1035 `SKILL_WATERSPLASH` vs "Water Stomp", 1048 `SKILL_DEATHTOUCH` vs "Deadly Touch".

lane_impact: all 12 — this is the read-order rule for the rest of the gauntlet.

---

## STILL_UNHELD — things I looked for in this source and did not find

- **Focus meter numerics** (skills-meters blocker ③: max / fill rate / switch cost). skilldata holds
  the *Focus skill* (1005: `"Instantly recharges your focus bar."`, chi 5, cd 10/9/8 s, `<lvlreq>5</lvlreq>`,
  requires Chi Punch) but says nothing about the bar's capacity, fill rate or what spends it. The
  frame crop in SK-8 shows no Focus bar in the combat status cluster. **STILL_UNHELD.**
- **Crit proc rule** (blocker ⑤). Nothing in skilldata, XMLSkill or SkillManager touches criticals.
  **STILL_UNHELD.**
- **Elemental ATK-vs-DEF formula** (rebirth blocker ②). The ATK side is closed (SK-3); the defence
  application is not in this source. **STILL_UNHELD from skilldata.**
- **Reach / hitbox in pixels for any skill.** Not a skilldata concern; the range *bands* exist
  (SK-12) but their pixel thresholds are in `EnemyPlayer` logic I did not read to the bottom.
  **STILL_UNHELD.**
- **Whether the Steal skill (SK-15) is id 1023.** Inference only. **PARTIAL.**
- **Audio.** Nothing here, and per S0-5 it stays held-but-encrypted.
