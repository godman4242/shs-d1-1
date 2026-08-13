# GAUNTLET L0 — system survey: **skills-meters**

Ledger under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20), §2 row + §4 block
`### skills-meters — 33`. Surveyed 2026-08-13.

**Headline: 33/100 is badly stale. Re-score 82/100.** Every one of the five §4 blockers is
now HELD with an A2 cite, one Ready bullet is flat WRONG (crit multiplier), one Ready bullet
undercounts by 4 (six categories → ten), one Surface bullet is WRONG (chi costs are not
single-digit), and one Surface bullet is fully CONFIRMED ("Stab" is Heavy L3, a tree node).

**Where the evidence lives.** Two sources the ledger never saw:
- `reference/extracted/skilldata.xml` — 75 `<skill>`, 182 `<level>`, 81 non-empty `<chi>`,
  98 non-empty `<cooldown>`, 52 `<req><has>` prerequisite edges.
- `reference/decompiled/shs3_android_payload/scripts/` — **readable, un-obfuscated AS3** for
  the whole game: `SkillManager.as`, `XMLSkill.as`, `StatsManager.as`, `MCSPlayer.as`,
  `BattleUI.as`, `SkillScreenUI.as`, `SkillSlotButton.as`, `ChiPunchProjectile.as`.
  The desktop bundle `shs3_payload/` is identifier-obfuscated (`§1t4906s0§.as`), which is
  presumably why prior passes never mined it.

**Cross-build honesty caveat.** The readable AS3 is the **Android** bundle. I cross-checked
two constants against the obfuscated **web** bundle and both match verbatim:
`reference/decompiled/shs3_payload/scripts/§1t4906s0§.as:57` carries
`120 + Math.floor(_loc5_ * _loc4_ / (20 + _loc4_))` (identical to `StatsManager.as:1918`), and
`§1t99s0§.as:55` carries `5 * 24` (identical to `MCSPlayer.as:239`). I could **not** locate
the obfuscated counterpart of `getDamage()`, so the crit multipliers below are Android-cited
and **frame-corroborated** (see S-09) rather than web-cross-checked. Stated plainly.

---

## S-01 — Blocker ① OVERTURNED: every skill's chi cost and cooldown is on disk

**Ledger (§4, line 195):** "① every other skill's Chi cost + cooldown (Smoke Bomb, Kunai chi,
Lay Trap, elemental) — *read skill cards in a preserved build.*"

No preserved build is needed. `reference/extracted/skilldata.xml` carries the exact rows for
all four named skills. Identities come from `SkillManager.as` constants (S-15), not guesswork.

| skill | id | `SkillManager.as` const | cat | lvlreq | chi per level | cooldown per level | first line |
|---|---|---|---|---|---|---|---|
| Smoke Bomb | 1010 | `SKILL_SMOKEBOMB` (L24) | 6 | 20 | 5 / 10 / 10 | 6 / 6 / 5 | skilldata.xml:501 |
| Kunai Throw | 1007 | `SKILL_KUNAITHROW` (L22) | 6 | 10 | **(empty = 0)** | 2 / 2 / 2 | skilldata.xml:346 |
| Lay Trap | 1024 | `SKILL_TRAP` (L30) | 6 | 15 | **(empty = 0)** | 5 / 5 / 5 | skilldata.xml:890 |
| Fire Breath | 1013 | `SKILL_FIREBREATH` (L28) | 7 | 20 | 5 / 6 / 7 / 8 / 10 | 15 ×5 | skilldata.xml:608 |
| Ground Punch | 1033 | `SKILL_GROUNDPUNCH` (L48) | 10 | 20 | 5 / 6 / 7 / 8 / 10 | 15 ×5 | skilldata.xml:1049 |
| Wind Kick | 1034 | `SKILL_WINDKICK` (L50) | 9 | 20 | 5 / 6 / 7 / 8 / 10 | 15 ×5 | skilldata.xml:1094 |
| Water Splash | 1035 | `SKILL_WATERSPLASH` (L52) | 8 | 20 | 5 / 6 / 7 / 8 / 10 | 15 ×5 | skilldata.xml:1139 |

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

**Verdict: HELD. overturns_ledger = true.**

---

## S-02 — Kunai Throw and Lay Trap cost ZERO chi; kunai burns an ammo stat instead

`skilldata.xml:355` and `:900` are literally `<chi></chi>` — empty, not missing-and-defaulted.
`XMLSkill.as:268-277 getChiCost()` returns 0 for an empty node, and `XMLSkill.as:117-120`
suppresses the "Cost:" line when `cost <= 0`, so the card showed no chi cost at all.

The resource kunai *does* consume is an inventory counter, `SkillManager.as:252-259`:

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

The ledger's phrase "Kunai **chi**" presumes a chi cost that does not exist.

**Verdict: HELD. overturns_ledger = true.**

---

## S-03 — `<cooldown>` is raw SECONDS at 24 fps; the skill card shows raw × SPD modifier

`XMLSkill.as:289-311`:

```
289:      public function getCooldown(lvl:int) : int
...
300:            val = this.levelList[this.levelList.length - 1].cooldown * 24;
...
308:            val = this.levelList[lvl].cooldown * 24;
...
310:         return val * StatsManager.getSkillCooldownModifier();
```

and the card renders `XMLSkill.as:116` `cooldown = this.getCooldown(1) / 24;` then
`:123` `cooldown.toFixed(2)`.

So: XML value is seconds → ×24 to frames → × the player's SPD modifier → ÷24 → printed to 2dp.
**The decimals in the ledger are display artefacts of one particular character's SPD, not
contract values.** The contract values are the integers in the XML.

**Verdict: HELD.**

---

## S-04 — Blocker ④ OVERTURNED: the SPD→cooldown formula, verbatim

**Ledger (§4, line 195):** "④ SPD→cooldown formula."

`reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1844-1861`:

```
1844:      internal static function getSkillCooldownModifier() : Number
1845:      {
1846:         var speed:int = getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED);
1847:         if(hasBuff(BUFF_SPEED))
1848:         {
1849:            speed *= 1.5;
1850:         }
1851:         return getSkillCooldownModifierVal(speed);
1852:      }
1854:      internal static function getSkillCooldownModifierVal(speed:int) : Number
1855:      {
1856:         if(speed > 300)
1857:         {
1858:            speed = 300;
1859:         }
1860:         return 1 - speed / 300 * 0.5;
1861:      }
```

`cooldownModifier = 1 − min(SPD_total, 300)/300 × 0.5`. SPD is hard-capped at 300; the floor is
exactly 0.5× cooldown. A speed buff multiplies effective SPD by 1.5 **before** the cap.

Sibling formula on the same stat, same file — `getBaseReload()` at `:1839-1842`:
`return 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6;`

**Verdict: HELD. overturns_ledger = true.**

---

## S-05 — The ledger's 4.96 / 9.92 / 8.92 reconcile EXACTLY to raw 5 / 10 / 9 at low SPD

The ledger's Ready bullet gives Chi Punch "cd 4.96s" and Replenish Focus "cd 9.92→8.92s".
The payload gives Chi Punch (1042) cooldown **5** at every level (`skilldata.xml:1292`) and
Focus (1005) cooldown **10 / 9 / 8** (`skilldata.xml:295, 302, 309`).

Run those raw values through S-03 + S-04 at SPD 5 → modifier `1 − 5/300 × 0.5 = 0.991667`, and
`getCooldown()` truncates to int frames (`var val:int`, `XMLSkill.as:291`):

| raw s | ×24 | ×0.991667 → int frames | ÷24 → `toFixed(2)` | ledger says |
|---|---|---|---|---|
| 5 | 120 | 119 | **4.96** | 4.96s ✓ |
| 10 | 240 | 238 | **9.92** | 9.92s ✓ |
| 9 | 216 | 214 | **8.92** | 8.92s ✓ |

Three independent decimals reproduced to the cent by one modifier. Solving the constraint
properly, the modifier must lie in `[119/120, 239/240)` for all three to round as printed, so the
reader's SPD was **3, 4 or 5** — SPD 2 would have printed 9.96 instead of 9.92, and SPD 6 would
have printed 4.92. A low single-digit SPD is exactly what an early-game longplay should show.

It also shows the ledger **truncated the Focus skill to two levels** — it has three, and the
third cooldown is 8 s.

**Verdict: HELD.** (The measurements were correct; the *interpretation* — that these are the
game's numbers — was not.)

---

## S-06 — Blocker ③ OVERTURNED: the "Focus bar" is the reload/slash meter, fully specified

**Ledger (§4, line 195):** "③ Focus numerics (max/fill/switch-cost)." All three, plus four more.

| quantity | value | cite |
|---|---|---|
| **max** | `5 * 24` = 120 frames = 5.00 s | `MCSPlayer.as:239` `this.maxreload = 5 * 24;` |
| **fill** | +1 per frame, unconditional | `MCSPlayer.as:1158-1160` |
| **bar mapping** | `(reload − 24) / (maxreload − 24)` — the first 24 frames are a hidden dead zone | `MCSPlayer.as:1163-1168` |
| **stance-switch gate** | blocked while `reload < maxreload/6` (< 20 frames) | `MCSPlayer.as:2977` `if(this.reload < this.maxreload / 6) { return; }` |
| **stance-switch cost** | if `reload > maxreload/2` → **set to** `maxreload/3`; else **subtract** `maxreload/6` | `MCSPlayer.as:3098-3105` |
| **slash cost** | `slashUsage × 0.5` Light · `× 1.0` Balanced/Reversed · `× 1.5` Heavy/Dual | `MCSPlayer.as:3240-3258` `deductReloadBar()` |
| **slashUsage source** | weapon `<slashusage>`, floored at 48 | `StatsManager.as:1921-1930` |
| **bonus refill** | `reload += 6` clamped to max | `MCSPlayer.as:3265-3272` `bonusReload()` |
| **Focus skill effect** | sets `reload = maxreload − 1` (one frame short of full) | `SkillManager.as:218-219` |

Verbatim, `MCSPlayer.as:3240-3258`:

```
3240:      public function deductReloadBar() : *
3241:      {
3242:         if(this.reload == this.maxreload)
3243:         {
3244:            this.reload = 0;
3245:         }
3246:         switch(this.stance)
3247:         {
3248:            case LIGHT_STANCE:
3249:               this.reload -= this.slashUsage / 2;
3250:               break;
3251:            case BALANCED_STANCE:
3252:            case REVERSED_STANCE:
3253:               this.reload -= this.slashUsage;
3254:               break;
3255:            case HEAVY_STANCE:
3256:            case DUAL_STANCE:
3257:               this.reload -= this.slashUsage * 1.5;
3258:         }
```

and `SkillManager.as:218-219`:

```
218:            case SKILL_FOCUS:
219:               owner.reload = owner.maxreload - 1;
```

**Verdict: HELD. overturns_ledger = true.**

---

## S-07 — Blocker ⑤ OVERTURNED: crit is DETERMINISTIC on a full meter, not a proc

**Ledger (§4, line 195):** "⑤ crit **proc** rule (chance vs deterministic) — entirely absent."

There is no dice roll anywhere in the crit path. `MCSPlayer.as:3215`:

```
3215:         if(this.reload == this.maxreload)
```

That equality — meter exactly full — is the entire trigger. Spending it is the cost:
`deductReloadBar()` zeroes the meter first when it was full (`MCSPlayer.as:3242-3245`, quoted
in S-06), so a crit costs the whole bar rather than `slashUsage`.

The HUD says the same thing, `BattleUI.as:259-263`:

```
259:      public function updateReload(percentage:Number) : *
260:      {
261:         this.reloadbar.bar.scaleX = percentage;
262:         this.crittext.visible = percentage >= 1 && this.reloadbar.visible;
263:      }
```

**Verdict: HELD. overturns_ledger = true.**

---

## S-08 — Ready bullet WRONG: crit is ×1.5 Light / ×1.2 everything else + flat gear term, never ×1.3

**Ledger (§4, line 194):** "crit = 1.3× formula." **Ledger (§3, line 152):** "states the formula
'Critical = **1.3× Physical**.' Keep `CRIT_MULT=1.3`."

`reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3198-3224`:

```
3198:      internal function getDamage() : int
3199:      {
3200:         var maxDamage:int = 0;
3201:         var baseDamage:int = this.minDamage + Math.random() * this.damageRange;
3202:         switch(this.stance)
3203:         {
3204:            case LIGHT_STANCE:
3205:               maxDamage = baseDamage * (0.5 + 0.5 * this.lightMastery * 0.01);
3206:               break;
3207:            case BALANCED_STANCE:
3208:               maxDamage = baseDamage * (1 + 0.5 * this.balancedMastery * 0.01);
3209:               break;
3210:            case HEAVY_STANCE:
3211:            case DUAL_STANCE:
3212:            case REVERSED_STANCE:
3213:               maxDamage = baseDamage * 1.5;
3214:         }
3215:         if(this.reload == this.maxreload)
3216:         {
3217:            if(this.stance != LIGHT_STANCE)
3218:            {
3219:               return maxDamage * 1.2 + this.STAT_CRITICALDMG;
3220:            }
3221:            return maxDamage * 1.5 + this.STAT_CRITICALDMG;
3222:         }
3223:         return maxDamage;
3224:      }
```

Three corrections in one function:
1. **The crit multiplier is stance-dependent: ×1.5 in Light, ×1.2 in every other stance.**
   1.3 is neither, and no wiki-sourced single constant can be right.
2. There is an **additive** gear term `STAT_CRITICALDMG` (stat id 204, `StatsManager.as:258`,
   sourced from item modifiers via `findBonusStat`, `StatsManager.as:1835`). The "3× folklore"
   the ledger tries to explain away at §3 line 153 is far better explained by this: a Heavy
   swing is already 1.5× base, ×1.2 crit = 1.8×, **plus** flat crit-damage from gear.
3. Light stance is a damage **penalty**, `0.5 + 0.005 × lightMastery` — i.e. 0.50× at mastery 0
   rising only to 0.55× at mastery 10. Balanced is 1.00→1.05×. Heavy is a flat 1.5× and does
   **not** scale with mastery at all. That contradicts the ledger's "stance scaling" Ready
   bullet in §2 line 134 as a single scaling family.

Adjacent, same file `:3231-3235`, confirming the combat-core Ready bullet "Heavy def ×0.8":
`if(this.stance == HEAVY_STANCE) { return defense * 0.8; }`

**Verdict: HELD. overturns_ledger = true.**

---

## S-09 — A1 FRAME CONFIRMATION: "CRITICAL HIT" appears exactly when the third bar fills

Frame: `reference/frames/session11/gap-focus-trigger/m_nearfull.png` (1800×780; already a
2-panel HUD crop of the bottom-left corner, viewed at native size — the bars are ~40 px tall
in the crop, legible without further upscaling).

Visibly in the crop, **top panel**: portrait medallion, a green bar reading `11/20`, a blue bar
reading `47/47`, a **third bar, white and completely full**, and yellow text `150% DAMAGE`.
**Bottom panel**: same frame moments later — identical `11/20`, `47/47`, the same full white
bar, now with `CRITICAL HIT` printed inside it, `150% DAMAGE` unchanged.

Corroborated by a second, independent frame at a different moment:
`reference/frames/combat_analysis/Nr4fQstqHDM_t428.0.png`, crop `(80,900)-(1000,1080)` upscaled
2× — green `20/20`, blue `26/26`, third bar **empty and brown** with the caption
`CANNOT CHANGE STANCE`, and `150% DAMAGE` beneath.

Three code claims land on these two frames:
- `BattleUI.as:262` `crittext.visible = percentage >= 1` → the crit text is present iff the bar
  is full. **Deterministic crit, seen.**
- `MCSPlayer.as:2977` `if(this.reload < this.maxreload / 6) return;` → the game refuses a stance
  change on a near-empty meter, and the HUD prints exactly that refusal. **Switch gate, seen.**
- `MCSPlayer.as:3213` `case HEAVY_STANCE: maxDamage = baseDamage * 1.5` → `150% DAMAGE`.
  **Heavy stance multiplier, seen.**

Also: `BattleUI.as:102` `this.crittext.text = LangManager.getString(175);` — pairing that line
with the frame **cracks one cell of the missing string table: ID 175 = "CRITICAL HIT."** That is
a working method, not a one-off (see S-16).

No frame/doc conflict arises here — frame and payload agree. Had they disagreed, the frame wins.

**Verdict: HELD.**

---

## S-10 — Surface bullet WRONG: chi costs are NOT single-digit, and the 100-scale is not fabricated

**Ledger (§4, line 196):** "real Chi costs are single-digit (2/5); config's 30/25/10 is a
fabricated-100-meter rescale."

The `<chi>` domain across 182 level rows is `0, 2, 3, 5, 6, 7, 8, 10, 20, 50, 100`
(`docs/gauntlet/L0/index/skilldata.json`, `skilldata/skill/level/chi`, `numeric_range [0,100]`).
Double-digit costs are common and the top of the ladder is exactly 100 —
`reference/extracted/skilldata.xml:1638-1649`:

```
1638: 		<id>1055</id>
1640: 		<lvlreq>80</lvlreq>
1648: 			<chi>100</chi>
1649: 			<cooldown>30</cooldown>
```

(id 1055 = `SKILL_MASSCLONE`, `SkillManager.as:86`, the level-80 Ninja capstone.)

Chi is an **absolute integer pool**, not a percentage meter: `BattleUI.as:252-256`

```
252:      public function updateChi(chi:int, maxchi:int) : *
253:      {
254:         this.chitext.text = chi + "/" + maxchi;
256:         this.chibar.bar.scaleX = chi / maxchi;
```

and the frames show it as such — `26/26` in
`reference/frames/combat_analysis/Nr4fQstqHDM_t428.0.png` and `47/47` in
`reference/frames/session11/gap-focus-trigger/m_nearfull.png`. So a "single-digit vs 100-meter"
framing is the wrong axis entirely: costs are absolute, and the pool grows with level.

**Verdict: HELD. overturns_ledger = true.**

---

## S-11 — The chi pool's own numbers (start / regen / refill), previously uncatalogued

`StatsManager.as:697-699`:

```
697:         setPlayerStats(STAT_CHI,10);
698:         setPlayerStats(STAT_MAXCHI,10);
699:         setPlayerStats(STAT_CHIREGEN,1);
```

- Start pool **10/10**, base regen stat **1** — matches the ledger's progression Ready bullet
  "start pools (HP10/Chi10/AP30)", so that one is confirmed rather than corrected.
- Regen tick, `StatsManager.as:1733-1739`: `newchi = getPlayer().getChi() + maxchi / 10 +
  findBonusStat(STAT_CHIREGEN)`, clamped to max — **10 % of max chi per tick plus gear regen**.
- Half-refill, `StatsManager.as:1714-1720`: `newchi = maxchi * 0.5`.
- Full refill on level-up, `StatsManager.as:1699-1702`: `setStat(STAT_CHI, MAXCHI + bonus)`.
- Overflow clamp on every write, `StatsManager.as:1027-1029` and `:2748-2755`.

`STAT_CHI=3`, `STAT_MAXCHI=4`, `STAT_CHIREGEN=5` (`StatsManager.as:176-180`).

**Verdict: HELD** (new material — the ledger listed no chi-pool numerics at all).

---

## S-12 — Ready bullet UNDERCOUNTS: the skill tree has TEN categories, not six

**Ledger (§4, line 194):** "full 6-category tree structure + per-stance unlock levels".

`skilldata.xml` carries **11** distinct `<category>` values
(`docs/gauntlet/L0/index/skilldata.json` → `skilldata/skill/category`, `distinct_values: 11`,
`numeric_range [1,11]`), and the skill screen builds exactly **ten** category slots —
`reference/decompiled/shs3_android_payload/scripts/SkillScreenUI.as:84,103-104`:

```
 84:      internal var categoryCount:int = 10;
103:         this.categoryIcons = [1,2,3,4,5,6,7,8,9,10];
104:         this.categoryDesc = [6024,6025,6026,6027,6028,6029,6030,6031,6032,6033];
```

with `cat1`…`cat10` instantiated one by one at `:126-135` and pushed at `:136-145`.

Category **11** is not in the UI: its members (1064 `SKILL_BACKTHROW`, 1065 `SKILL_AIRSTAB`,
1066 `SKILL_BULLCHARGE`, 1067 `SKILL_PUNCHLUNGE`, 1068 `SKILL_UNDYING`, plus unnamed 1500/1501)
carry **no `<order>` and no `<lvlreq>`** — they are NPC/enemy movesets, not player tree nodes.
That is the clean explanation for the ledger's undercount being a *different* wrong number than
11: the player-visible tree is 10, the data file holds 11.

Bonus: `categoryDesc = [6024..6033]` pins the ten category blurb string IDs exactly.

**Verdict: HELD. overturns_ledger = true.**

---

## S-13 — The category→domain map, proven not assumed

| cat | domain | proof |
|---|---|---|
| 1 | **Light stance** | 1000 = `SKILL_LIGHTSTANCE`; capstone 1039 Shunpo has `<req><has><id>1000</id><qty>10</qty></has></req>` (skilldata.xml:1238) and is gated to `MCSPlayer.LIGHT_STANCE` (`SkillSlotButton.as:153`) |
| 2 | **Balanced stance** | 1001 = `SKILL_BALANCEDSTANCE`; capstone 1040 Thousand Stabs req `1001×10`, gated to `BALANCED_STANCE` |
| 3 | **Heavy stance** | 1002 = `SKILL_HEAVYSTANCE`; capstone 1041 Deadly Cleave req `1002×10`, gated to `HEAVY_STANCE` |
| 4 | **Chi** | 1042 ChiPunch, 1005 Focus, 1006 SlashWave, 1043 ChiKick, 1044 SpiritThief, 1045 ChiBurst, 1046 ChargedShot, 1047 HeavenlySwords, 1048 DeathTouch, 1069 ChiCharge |
| 5 | **Movement/body** | 1003 Jump, 1004 Roll, 1049 DashRight, 1050 DashLeft + 5 passives |
| 6 | **Ninja** | 1007 Kunai, 1024 Trap, 1010 SmokeBomb, 1051 Windmill, 1052 Flashbang, 1053 ShadowClone, 1054 Stealth, 1012 SubstitutionLog, 1055 MassClone |
| 7 | **Fire** | every member requires item **28**; `XMLSkill.as:153-155` maps `hasid == 28` to `LangManager.getString(726)` |
| 8 | **Water** | requires item **30** → string 728 |
| 9 | **Wind** | requires item **29** → string 727 |
| 10 | **Earth** | requires item **31** → string 729 |
| 11 | **NPC-only** | no `<order>`, no `<lvlreq>`, absent from `SkillScreenUI` (S-12) |

`SkillSlotButton.as:153`, verbatim:

```
153:         if(chi < this.chiCost || this._skillId == SkillManager.SKILL_SHUNPO && stance != MCSPlayer.LIGHT_STANCE || this._skillId == SkillManager.SKILL_THOUSANDSTABS && stance != MCSPlayer.BALANCED_STANCE || this._skillId == SkillManager.SKILL_DEADLYCLEAVE && stance != MCSPlayer.HEAVY_STANCE)
```

Cross-lane note for **rebirth-elements (score 30)**: cats 7-10 are that lane's "4 elements × 6
named skills", and each element tree's six nodes gate on 10 / 10 / 10 / 30 / 30 / 60 units of its
element item. Its blocker ① "what each element **does**" is now half-open — the costs, cooldowns
and prerequisite ladders are all here.

**Verdict: HELD.**

---

## S-14 — Blocker ② OVERTURNED: Shunpo's real effect

**Ledger (§4, line 195):** "② Shunpo's real effect (Light L10 ultimate; spacebar-slowmo belongs
to the **predecessor SHS2**, not Duels)."

The ledger's negative half stands — there is no slow-motion anywhere in the Shunpo path. The
positive half is now held. Shunpo is a **hold-to-charge flash-step**:

`MCSPlayer.as:1705-1706` (charge window):

```
1705:            case SKILL_SHUNPO_STATE:
1706:               this.chargingTime = 3 * 24;
```

`MCSPlayer.as:1747-1753` (release):

```
1747:               if(prevActionState == SKILL_SHUNPO_STATE)
1748:               {
1749:                  if(getMCS().isFacingRight())
1750:                  {
1751:                     this.movePlayer(250);
1752:                     ProjectileManager.createProjectile(ProjectileManager.PROJ_SHUNPOHIT,getMapPosition(),getMCS().y - 44,0,0,this.getDamage() * this.getChargingTime() / 2,level,this);
```

- charge up to **3 s (72 frames)**; teleport **250 px** in the facing direction;
- spawn a `ShunpoHitProjectile` whose damage is `getDamage() × chargingTime / 2` — i.e. it
  inherits the full stance/crit pipeline of S-08 and scales linearly with charge held;
- `StageManager.keepPlayerInView()` then `chargingTime = 0`.
- Cost **50 chi**, cooldown **60 s**, requires Light Stance ×10 (skilldata.xml:1238-1245).

Its two siblings, for symmetry: Thousand Stabs charges `3 * 24` and grants `gotHitCounter = 26`
on release (`MCSPlayer.as:1717, 1762-1764`); Deadly Cleave charges `4 * 24`, grants
`gotHitCounter = 16`, and fires `PROJ_CLEAVEHIT` at `getDamage() * getChargingTime() / 2`
(`MCSPlayer.as:1730, 1766-1768, 902-906`). All three cost 50 chi / 60 s cooldown
(skilldata.xml:1244-1245, 1260-1261, 1276-1277).

**Verdict: HELD. overturns_ledger = true.**

---

## S-15 — The string-table blocker does NOT block skill names: 48 are in AS3

GAUNTLET §2.1's standing blocker says item/skill `<name>`/`<displayname>` are numeric IDs into a
table we have not located, "so numbers are portable today; NAMES ARE NOT."

For this system that is **too pessimistic**. `SkillManager.as:8-106` declares 48 canonical
English skill identifiers, keyed to the same ids `skilldata.xml` uses:

```
  8:      public static var SKILL_LIGHTSTANCE:int = 1000;
 18:      public static var SKILL_FOCUS:int = 1005;
 24:      public static var SKILL_SMOKEBOMB:int = 1010;
 54:      public static var SKILL_SHUNPO:int = 1039;
 60:      public static var SKILL_CHIPUNCH:int = 1042;
 86:      public static var SKILL_MASSCLONE:int = 1055;
106:      public static var SKILL_EARTHQUAKE:int = 1073;
```

These are the developers' own identifiers, not a fan wiki. They are not display strings (no
casing/spacing/flavour), so a 1:1 rebuild still wants the table — but every claim in this
document about *which* skill a row is, is grounded on them rather than on inference.

**Verdict: HELD** (narrows a gauntlet-level blocker; does not close it).

---

## S-16 — The string table is LOCATED but NOT ARCHIVED: `data/shs3_en.xml`

`reference/decompiled/shs3_android_payload/scripts/LangManager.as:38-58`:

```
38:         var server:String = "./data/";
39:         if(StatsManager.useExternalLang)
40:         {
41:            if(StatsManager.usePlayerIO)
42:            {
43:               server = QueryManagerPIO.instance.getStringsDir();
44:            }
45:            else
46:            {
47:               server = QueryManager.instance.server + "strings/";
48:            }
49:         }
...
56:            Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");
57:            Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");
58:            Locale.loadLanguageXML(id,onLanguageLoad);
```

Every `<displayname>`/`<desc>` number resolves through `LangManager.getString(num)` →
`Locale.loadStringEx(num.toString(), language)` (`LangManager.as:78`) against
**`shs3_en.xml`, an external file fetched at runtime from `./data/` or `<server>/strings/`.**
It was never inside the SWF, which is why `bindata/` and `ui_strings.txt` were dead ends.

It is **not on disk here** — `find reference/ -iname "*shs3_en*"` returns nothing; the only hit
for `*strings*` is `reference/extracted/ui_strings.txt`, which the gauntlet already rules out.

Close-path, concrete: Wayback / Flashpoint for `…/data/shs3_en.xml` and `shs3_zh-CN.xml`
alongside the already-recovered `questdata.xml` / `skilldata.xml` / `itemdata.xml`. Interim
partial method: pair an AS3 `getString(N)` call site with a frame that shows the rendered text —
S-09 does exactly that and yields **175 = "CRITICAL HIT"**.

**Verdict: PARTIAL.** The table is identified and its format known; the strings are still unheld.

---

## S-17 — Ready bullet INCOMPLETE: Chi Punch has three levels — 10 / 20 / **30**

**Ledger (§4, line 194):** "Chi Punch (10/20 dmg, cost 2, cd 4.96s)".

`reference/decompiled/shs3_android_payload/scripts/ChiPunchProjectile.as:17-31`:

```
17:      override public function init(velX:int, velY:int, damage:int, skilllevel:int, owner:NPC = null) : *
18:      {
19:         var mcsplayer:MCSPlayer = null;
20:         if(skilllevel == 1)
21:         {
22:            damage = 10;
23:         }
24:         else if(skilllevel == 2)
25:         {
26:            damage = 20;
27:         }
28:         else if(skilllevel == 3)
29:         {
30:            damage = 30;
31:         }
```

Three levels, matching `skilldata.xml`'s three `<level>` blocks for id 1042. Cost is **2 at every
level** (`skilldata.xml:1291, 1298, 1305`), cooldown **5 s at every level** (`:1292, 1299, 1306`),
no `<lvlreq>`, no prerequisite — it is the entry node of the Chi tree (`<order>0</order>`,
`:1286`). Confirms the §3 line-75 claim that chi-skill damage is "a flat per-level constant":
the passed-in `damage` argument is discarded and overwritten, and `damageObj = new Damage(damage,
0, Damage.LAUNCH_KNOCKDOWN)` (`:39`) carries a **0** in the second slot.

Also note Focus (1005) requires Chi Punch: `<req><has><id>1042</id><qty>1</qty></has></req>`
(`skilldata.xml:288`).

**Verdict: PARTIAL** (the ledger is right as far as it goes and misses level 3).

---

## S-18 — Surface bullet **CONFIRMED**: "Stab" really is a Heavy L3 tree node, not a hotbar skill

**Ledger (§4, line 196):** "'Stab' is Heavy L3 'Heavy Stab,' a tree node, not a hotbar skill."

This one survives contact with the payload intact, and I want that on the record as loudly as
the corrections. `MCSPlayer.as:3127-3155`, `initSpecialSkills()`:

```
3127:      internal function initSpecialSkills() : *
3128:      {
3129:         if(this.controlledBy == 0 || this.controlledBy == 2)
3130:         {
3131:            if(this.stance == LIGHT_STANCE)
3132:            {
3133:               this.canLaunch = this.getSkillLevel(1014) > 0;
3134:               this.canDeflect = this.getSkillLevel(1036) > 0;
3135:               this.canAirCombo = this.getSkillLevel(1015) > 0;
...
3147:            else if(this.stance == HEAVY_STANCE)
3148:            {
3149:               this.canStab = this.getSkillLevel(1018) > 0;
3150:               this.canDeflect = this.getSkillLevel(1038) > 0;
3151:               this.canLaunch = this.getSkillLevel(1019) > 0;
```

and skill 1018, `reference/extracted/skilldata.xml:721-727`:

```
721: 		<id>1018</id>
722: 		<displayname>6042</displayname>
723: 		<desc>6047</desc>
724: 		<req><has><id>1002</id><qty>3</qty></has></req>
725: 		<passive>1</passive>
726: 		<order>3</order>
727: 		<category>3</category>
```

Category 3 = Heavy (S-13). Prerequisite = Heavy Stance at level **3**. `<passive>1</passive>` →
`XMLSkill.as:347` `canEquip()` returns `!this.passive && …` = **false**, so it can never occupy a
hotbar slot. Every clause of the ledger's sentence checks out.

The full per-stance capability ladder falls out with it — the "per-stance unlock levels" Ready
bullet, now with exact node ids:

| stance | mastery ×3 | ×4 | ×5 | ×10 capstone |
|---|---|---|---|---|
| Light (1000) | 1014 Launch | 1036 Deflect | 1015 AirCombo | 1039 **Shunpo** |
| Balanced (1001) | 1016 FlipUp | 1037 Deflect | 1017 Launch | 1040 **Thousand Stabs** |
| Heavy (1002) | 1018 **Stab** | 1038 Deflect | 1019 Launch | 1041 **Deadly Cleave** |

(prerequisite quantities read from `<req><has>` on each id; NPCs take a parallel path off raw
mastery thresholds ≥3/≥4/≥5, `MCSPlayer.as:3164-3196`.)

One disambiguation the ledger does not make: **`SKILL_THOUSANDSTABS` (1040) is a *Balanced*
capstone**, a different thing from the Heavy `canStab` node. Anyone grepping for "stab" will hit
both.

**Verdict: HELD** (ledger confirmed, not overturned).

---

## S-19 — Cross-lane: the reach-in-pixels formula combat-core calls its #1 blocker

Not my system, but it is three lines below `getSkillCooldownModifier` in the same file and
combat-core (§4 line 190) calls it "the one value the whole model needs".

`StatsManager.as:1905-1919`:

```
1905:      internal static function getBaseSlashLength() : int
...
1915:      internal static function getBaseSlashLengthVal(speed:int) : int
1916:      {
1917:         var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
1918:         return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
1919:      }
```

Slash length in stage px = `120 + floor((90 + DAN×5) × SPD / (20 + SPD))` — 120 px at SPD 0,
asymptotic to 210 px at Dan 0, rising 5 px per Dan rank. Feeds `InputManager.setMaxDistance(
this.slashLength)` (`MCSPlayer.as:3094`). Halved while `BUFF_INJURED` (`MCSPlayer.as:222`).

**This is the one formula I could cross-check against the obfuscated web bundle**, and it
matches character for character: `reference/decompiled/shs3_payload/scripts/§1t4906s0§.as:57`
`var _loc6_:int = 120 + Math.floor(_loc5_ * _loc4_ / (20 + _loc4_));`

**Verdict: HELD.** Hand to lane L1/combat-core.

---

## S-20 — STILL_UNHELD: per-skill damage constants beyond Chi Punch

I read one projectile class end-to-end (`ChiPunchProjectile.as`) and confirmed the pattern
(damage overwritten from `skilllevel`). The other ~40 — `ChiKickProjectile`, `ChiBurstProjectile`,
`HeavenlySwordProjectile`, `ShunpoHitProjectile`, `CleaveHitProjectile`, `WindmillProjectile`,
`FlashbangProjectile`, the four elemental kunai/trap families — exist at
`reference/decompiled/shs3_android_payload/scripts/` and are dispatched from
`ProjectileManager.as:195-260`, but I did **not** open them in this pass.

This is a *reading* gap, not an evidence gap: the files are on disk and the pattern is
established. I am not going to assert numbers I have not read.

**Verdict: STILL_UNHELD** (close-path: read the ~40 `*Projectile.as` classes; one sitting).

---

## S-21 — STILL_UNHELD: what Focus buys beyond charging the meter

Project memory (`project-session11-study-pass`) records "OG has NO Critical meter (Focus buys
evasion)". I can hold the meter half (S-06: `owner.reload = owner.maxreload - 1`) but I found
**no** evasion/dodge effect in the `SKILL_FOCUS` case at `SkillManager.as:218-226` — the rest of
that case is animation (`FOCUS_START`) and P2P replication. `MCSPlayer.as:3283+`
`checkHitObject()` computes a `dodgechance` from `rolllvl`, which is the Roll skill (1004), not
Focus — but I did not read that function to the end.

I will not grade the memory line either way on what I read.

**Verdict: STILL_UNHELD.**

---

## Re-score

**33 → 82.**

Held now that was not before: all 75 skills' costs/cooldowns and level counts; the complete tree
topology (10 player categories, `<order>`, `<lvlreq>` 3-80, 52 prerequisite edges); the exact
per-stance capability ladder; the reload/Focus meter's max, fill rate, bar mapping, switch gate,
switch cost, per-stance slash cost and bonus refill; the crit trigger and both crit multipliers
plus the gear term; the SPD→cooldown formula with its cap; Shunpo's full behaviour; the chi
pool's start/regen/refill numbers.

Held back from ~95 by: display names and descriptions (external `shs3_en.xml`, S-16 — the only
true blocker left in this system), the ~40 unread projectile damage constants (S-20, mechanical),
Focus's non-meter effect (S-21), and skill VFX/animation feel, which lives in the videos and was
outside this pass.
