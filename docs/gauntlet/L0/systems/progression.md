# GAUNTLET L0 — system survey: **progression** (ledger score 55/100)

Surveyor: progression lane. Date: 2026-08-13. Lane impact: **L10 (PROGRESSION + ECONOMY)**,
with spill into **L5 (combat core)**, **L4 (enemies)**, **L11 (rebirth)**, **L2 (skills)**, **L1b (string table)**.

Document under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20)
- §2 table row: `| **progression** | 55 | level-up spine, L1–L10 XP, stat-point effects, unlock cadence | DEF/SPD transfer functions; L11–80 curve (likely unrecoverable); post-rebirth SP economy |`
- §4 block `### progression — 55` (Ready / Blockers / Surface)
- §6 bullet: *"**L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."*
- §3 correction #7 and #11 (both touch progression)

---

## ⚠️ PROVENANCE — this survey overturns the L0 economy lane's provenance caveat

`docs/gauntlet/L0/systems/economy.md` states:

> *"The web payload is **not decompilable**: `reference/decompiled/shs3_payload/scripts/` holds
> 652 files and **zero** game-logic classes (ColorPicker skins, `hair6000.as`, `foot12000.as`…),
> and … SWFDefender-protected."*

**That is false, and it matters for every A2 cite in this whole L0 run.** The web payload *is*
decompiled; its identifiers are **obfuscated (`§1t…s0§`), not absent**:

```
$ ls reference/decompiled/shs3_payload/scripts/ | wc -l          → 652
$ ls reference/decompiled/shs3_payload/scripts/ | grep -c "^§1t" → 570
$ wc -l "reference/decompiled/shs3_payload/scripts/§1t1523s0§.as" → 6236
```

`§1t1523s0§.as` **is** `StatsManager` (6,236 lines of game logic). The Android bundle is the
**Rosetta Stone**: its stat-index table (`StatsManager.as:170–222`, `STAT_MAXHP=1 … STAT_DAN=25`)
matches the web build's `internal static const` block (`§1t1523s0§.as:206–254`) **index for index**,
so every obfuscated symbol I quote below is decoded against a named twin.

**Version provenance, checked first-hand:**

| Bundle | Version | Evidence |
|---|---|---|
| `reference/decompiled/shs3_android_payload/` | **0.682** | `StatsManager.as:30` `public static var clientVersion:Number = 0.682;` |
| `reference/decompiled/shs3_payload/` (**6,880,328 B** = the 6.88 MB live payload) | **0.706 payload under the v0.717 preloader** | `strings reference/preservation/shs3_payload_version.swf` → `tinyloaderversion=1.0&version=0.706&forceupdate=false&payload=http://www.strawhatsamuraiduels.com/shs3_payload.swf` — and A1 `reference/preservation/p0_ruffle_titlescreen.png` (viewed, upscaled 1.6×, bottom-right) reads **`EXPLOSIVE BARREL v0.717`** |

**Ruling used throughout: where the two builds disagree, the WEB payload wins**, because it is the
live payload the filmed v0.717 client actually downloaded. The Android 0.682 bundle is an *earlier
balance pass*. Three of the findings below are exactly such a disagreement — and in every one of
them the older Android numbers are the ones a naive survey would have shipped.

---

## CLAIMS

### P-01 — **The L11–80 XP curve is NOT unrecoverable. The entire 99-level table is on disk, verbatim.** (OVERTURNS §6 + §4 blocker ② + §2 table)

Ledger sentences overturned:
- §6: *"**L11–80 XP curve** — no table published; a solo build likely can't reach L11+; keep the extrapolation labeled INFERRED."*
- §4: *"② **L11–80 XP curve — likely unrecoverable** (no wiki table; both longplays cap at L10; a solo build probably can't reach L11+ offline). Keep the extrapolation as labeled INFERRED."*
- §2: *"L11–80 curve (likely unrecoverable)"*

**A2 — `reference/decompiled/shs3_payload/scripts/§1t29s0§.as:28`** (and, byte-identical,
`§1t1523s0§.as:364`; and named `expArray` at `shs3_android_payload/scripts/StatsManager.as:78`):

```
public static const §1t5923s0§:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,25900,31400,37400,43500,49850,56550,63900,71900,80300,89100,98300,108000,118300,129300,141100,154100,168100,183100,199100,216100,234100,253100,273100,294100,316100,339300,363300,389300,416800,445800,475800,507300,540300,574300,610300,647800,685800,725800,767800,812300,859300,908300,959300,1012300,1067300,1124300,1183300,1244800,1307800,1372800,1439800,1508800,1578800,1651800,1728800,1808800,1892800,1980800,2071800,2166800,2276800,2404800,2544800,2699800,2862800,3032800,3212800,3400800,3595800,3795800,4025800,4285800,4585800,4935800,5335800,5815800,6365800,6965800,7645800,8395800,9295800,10295800,11495800,12995800,14795800,16895800,19295800,22095800,25395800,29395800];
```

I verified the web and Android arrays are **character-identical** (python string compare → `True`),
99 entries, indices 0–98.

Semantics, read off the lookup (`StatsManager.as:1586–1596`):

```
public static function getLevel() : int {
   var currentXP:int = getPlayerStats(STAT_XP);
   for(var q:int = 0; q < 99; q++) { if(expArray[q] > currentXP) { return q; } }
   return 99;
}
```

→ **`expArray[n]` is the XP threshold to *reach* level `n+1`.** Level 1 = XP 0–549.

| Level | XP threshold | Δ from prev |
|---|---|---|
| 2 | 550 | 550 |
| 10 | 25,900 | 5,000 |
| **11** | **31,400** | 5,500 |
| 20 | 98,300 | 9,200 |
| 40 | 475,800 | 30,000 |
| 60 | 1,439,800 | 67,000 |
| **80 (cap)** | **4,025,800** | 230,000 |
| 99 (array end, unreachable) | 29,395,800 | — |

`levelCap` is a hard `80` — `StatsManager.as:76` `public static var levelCap:int = 80;` / web
`§1t1523s0§.as:362` `public static const §1t9470s0§:int = 80;` — and `changeXP` refuses to cross it
(`StatsManager.as:1618–1622`, `QueryManager.instance.reportHack("changeXP levelcap")`).

Verdict: **HELD.** The ledger's L1–L10 figures (*"550…31 400"*) match `expArray[1..10]` exactly, so
the ledger was right about what it had and wrong about what it lacked. Zero INFERRED XP values remain.

---

### P-02 — **The "271 cap" is not gear/rebirth-inclusive. It is `1 + (level + 10) × 3`, a pure stat-point cap, and it IS reachable in one stat.** (OVERTURNS the §4 Surface bullet)

Ledger sentence overturned: *"The \"271 cap\" is gear/rebirth-inclusive (237-point first-run budget makes it impossible in one stat) — resolvable by arithmetic now."*

**A2 — `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341–3346`** (the character-sheet
"+" button visibility test; `_loc2_` = `STAT_LEVEL`):

```
var _loc3_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9403s0§) < 10 + (_loc2_ + 10) * 10;   // MAXHP
var _loc4_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9406s0§) < 10 + (_loc2_ + 10) * 5;    // MAXCHI
var _loc5_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9415s0§) < 30 + (_loc2_ + 10) * 5;    // MAXAP
var _loc6_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9408s0§) < 1 + (_loc2_ + 10) * 3;     // ATTACK
var _loc7_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9409s0§) < 1 + (_loc2_ + 10) * 3;     // DEFENSE
var _loc8_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9410s0§) < 1 + (_loc2_ + 10) * 3;     // SPEED
```

At level 80: `1 + (80 + 10) * 3 = **271**`. That is the number, exactly, from base 1 plus 90 points
at +3. Two consequences the ledger gets backwards:

1. **271 is a stat-point ceiling, not a gear total.** Gear bonuses ride on top via `findBonusStat`
   and are *not* counted by this test (`§1t9714s0§` is the raw stat getter, no bonus term).
2. **It is trivially reachable in one stat.** 90 points ≤ the 237-point L80 budget. The ledger's
   *"237-point first-run budget makes it impossible in one stat"* is arithmetically false.

Full cap table at L80: HP **910**, Chi **460**, AP **480**, ATK/DEF/SPD **271** each.

Verdict: **HELD** (claim overturned in both halves).

---

### P-03 — **Per-point magnitudes: the ledger is right on HP/Chi/ATK-DEF-SPD and WRONG on AP — it is +5, not +1.** (PARTIAL overturn of the §4 Ready bullet)

Ledger sentence partially overturned: *"+10HP/+5Chi/**+1AP**/+3-stat per point"*

**A2 — `§1t5957s0§.as:3390–3444`**, the six click handlers (each spends one point, `§1t9419s0§`=18=STATPOINTS):

```
§1t6049s0§: §1t9713s0§(§1t9419s0§,-1); §1t9713s0§(§1t9403s0§,10);   // MAXHP  +10
§1t6050s0§: §1t9713s0§(§1t9419s0§,-1); §1t9713s0§(§1t9406s0§,5);    // MAXCHI +5
§1t6051s0§: §1t9713s0§(§1t9419s0§,-1); §1t1523s0§.§1t9609s0§(5);    // addMaxAP(5)
§1t6052s0§: §1t9713s0§(§1t9419s0§,-1); §1t9713s0§(§1t9408s0§,3);    // ATTACK  +3
§1t6053s0§: §1t9713s0§(§1t9419s0§,-1); §1t9713s0§(§1t9409s0§,3);    // DEFENSE +3
§1t6054s0§: §1t9713s0§(§1t9419s0§,-1); §1t9713s0§(§1t9410s0§,3);    // SPEED   +3
```

Independently corroborated by the build's own anti-cheat audit, which *reverse-divides* every stat
by its per-point magnitude and compares the total to the level budget —
**`§1t5957s0§.as:3447–3466`**:

```
_loc1_ += (§1t9714s0§(§1t9403s0§) - 10) / 10;   // (MAXHP  - 10) / 10
_loc1_ += (§1t9714s0§(§1t9406s0§) - 10) / 5;    // (MAXCHI - 10) / 5
_loc1_ += (§1t9714s0§(§1t9415s0§) - 30) / 5;    // (MAXAP  - 30) / 5
_loc1_ += (§1t9714s0§(§1t9408s0§) - 1) / 3;     // (ATTACK - 1) / 3
_loc1_ += (§1t9714s0§(§1t9409s0§) - 1) / 3;
_loc1_ += (§1t9714s0§(§1t9410s0§) - 1) / 3;
_loc1_ += §1t9714s0§(§1t9419s0§);               // + unspent points
_loc2_ = (getLevel() - 1) * 3;
```

That single block *is* the whole stat-point economy: base values (10/10/30/1/1/1), per-point
magnitudes (10/5/5/3/3/3), and the budget `(level − 1) × 3` = **237 at L80** — which is the ledger's
own figure, now A2-sourced instead of arithmetic-inferred.

**Version note (frame-adjacent rule applied):** the Android **0.682** bundle has an *older, smaller*
table — `InventoryUI.as:2415–2456`: `changeStat(STAT_MAXHP,5)` / `addMaxAP(1)` /
`changeStat(STAT_ATTACK,1)`, with caps `10 + (charlevel+10)*5` and `charlevel + 10`. A surveyor who
read only the Android bundle would have "disproven" the ledger and shipped +5 HP / +1 ATK. **The web
payload is the version the longplays show, so the web numbers win** — and they vindicate §3
correction #11 (*"Stat-point +3 is confirmed … the A-21 '+1' was a misread"*): the +1 was not a
misread of nothing, it was the *real v0.682 value*, superseded by v0.706/0.717.

Verdict: **PARTIAL** — 3 of 4 fragments HELD, `+1AP` overturned to `+5AP`.

---

### P-04 — **First-run skill points are 79, not 80.** (OVERTURNS the §4 Ready bullet)

Ledger sentence overturned: *"80 SP first run"*

**A2 — new-character init, `shs3_android_payload/scripts/StatsManager.as:711–712`:**

```
setPlayerStats(STAT_SKILLPOINTS,0);
setPlayerStats(STAT_STATPOINTS,0);
```

**A2 — `levelUp()`, web `§1t1523s0§.as:2072–2075`** (named twin `StatsManager.as:1646–1653`):

```
public static function §1t9577s0§() : void {
   §1t9713s0§(§1t9418s0§,1);   // STAT_SKILLPOINTS +1
   §1t9713s0§(§1t9419s0§,3);   // STAT_STATPOINTS  +3
```

A character starts at level 1 with **0** SP and gains 1 per level-up. L1 → L80 is **79 level-ups →
79 SP**. Confirmed by the refund formula (P-05) which returns `getLevel() - 1` at Dan 0.

What the player *does* start with is **7 free rank-1 skills**, not a skill point
(`StatsManager.as:2144–2150` / `740–746`): ids `1000, 1001, 1002, 1003, 1042, 1049, 1050`
(1000/1001/1002 = Light/Balanced/Heavy stance masteries), with `1003` pre-slotted in hotbar slot 0.
The ledger's "80" looks like 79 + that free starter tier collapsed into one number.

Verdict: **HELD** (ledger off by one).

---

### P-05 — **The post-rebirth SP economy is fully held: skill points COMPOUND across Dan ranks, stat points DO NOT.** (OVERTURNS §4 blocker ③ + §2 table)

Ledger sentences overturned: §4 *"③ post-rebirth SP economy"* (listed as a blocker); §2 *"post-rebirth SP economy"*.

**A2 — web `§1t1523s0§.as:2598`** (inside the skill-respec routine; `§1t9418s0§`=17=SKILLPOINTS,
`§1t9426s0§`=25=DAN, `§1t9470s0§`=levelCap=80). Named twin, `StatsManager.as:2156`:

```
setPlayerStats(STAT_SKILLPOINTS,getLevel() - 1 + getPlayerStats(STAT_DAN) * (levelCap - 1));
```

→ **SP total = (level − 1) + Dan × 79.** At L80 Dan 9 that is 79 + 711 = **790 skill points.**

**A2 — the stat-point counterpart, web `§1t1523s0§.as:2577`** (named twin `StatsManager.as:2136`):

```
setPlayerStats(STAT_STATPOINTS,(getLevel() - 1) * 3);
```

→ **stat points do NOT carry a Dan term.** They reset to 237 at L80 no matter how many rebirths you
have. The asymmetry is the whole point of rebirth: skills compound, stats don't.

`doRebirth` (web `§1t1523s0§.as:2638–2656`) calls the stat reset, zeroes XP
(`§1t9712s0§(§1t8755s0§,0)`), unequips all, wipes proc-gen daily quests, and resets the hotbar to
one slot holding skill 1003.

Verdict: **HELD.**

---

### P-06 — **DEF has no mitigation "curve". It is flat subtraction, with a Heavy-stance ×0.8 penalty and an attacker-level damage floor.** (OVERTURNS half of §4 blocker ① + §2 table)

Ledger sentences overturned: §4 *"① DEF mitigation curve + SPD range/cooldown scaling (wiki gives only direction) — measure per-point deltas in a build."*; §2 *"DEF/SPD transfer functions"*.

**A2 — `shs3_android_payload/scripts/MCSPlayer.as:3414–3418` and `3709–3713`** (the only two damage-application sites; `EnemyClone.as:221,442` repeats them):

```
damage -= this.getDefense();
if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
```

**A2 — `MCSPlayer.as:3231–3237`:**

```
internal function getDefense() : int {
   if(this.stance == HEAVY_STANCE) { return defense * 0.8; }
   return defense;
}
```

**A2 — the floor, `Damage.as:150–172`** — it scales with the **attacker's** level, in four bands:

```
if(this.attackerlvl <= 10) { return 1 + this.piercingDamage; }
if(this.attackerlvl <= 20) { return this.attackerlvl / 8 + this.piercingDamage; }
if(this.attackerlvl <= 30) { return this.attackerlvl / 6 + this.piercingDamage; }
return this.attackerlvl / 4 + this.piercingDamage;
```

So the answer to "DEF mitigation curve" is: **there is no curve.** Effective damage =
`max(rawDamage − defense[×0.8 if defender in Heavy], attackerLevelFloor + piercing)`. A point of DEF
is worth exactly 3 flat damage (P-03), all the way to the 271 cap.

Cross-lane correction for **items-equipment** (§4 Ready: *"defense min-floor (EnemyLevel/4)"*): that
is only the ≥31 band, and the divisor keys off the **attacker**, not "EnemyLevel" per se.

Verdict: **HELD.**

---

### P-07 — **SPD's three transfer functions are all held — and one of them is L5's missing reach cap in pixels.** (OVERTURNS the other half of §4 blocker ①; lands on **L5**)

Ledger sentences overturned: §4 progression *"SPD range/cooldown scaling (wiki gives only direction)"*; and §4 combat-core *"① reach cap in **stage px** per stance (the one value the whole model needs; wiki gives \"units\" of unknown scale)"*.

**A2 — `shs3_android_payload/scripts/StatsManager.as:1839–1842, 1854–1860, 1915–1919`** (all three
present character-identically in the web payload, cited below):

```
internal static function getBaseReload() : int {
   return 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6;
}

internal static function getSkillCooldownModifierVal(speed:int) : Number {
   if(speed > 300) { speed = 300; }
   return 1 - speed / 300 * 0.5;
}

internal static function getBaseSlashLengthVal(speed:int) : int {
   var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
   return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
}
```

Web cross-checks (same file family, obfuscated):
- `§1t1523s0§.as:2276` → `return 48 + (§1t7356s0§(§1t9410s0§) + §1t7358s0§(§1t9410s0§)) * 6;`
- `§1t1523s0§.as:2346–2347` → `var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5; return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));`
- also at `§1t122s0§.as:771,774`, `§1t4906s0§.as:54,57`, `§1t4907s0§.as:102,105` (the NPC/duelist paths).

**⚠️ VERSION DIVERGENCE — the cooldown cap doubled.** Web `§1t1523s0§.as:2289–2295`:

```
internal static function §1t9590s0§(param1:int) : Number {
   if(param1 > 600) { param1 = 600; }
   return 1 - param1 / 600 * 0.5;
}
```

v0.682 caps SPD at **300**; the live web payload caps at **600**. **The web value wins.** So:

| Function | Formula (v0.706/0.717, live) |
|---|---|
| Slash-meter capacity | `baseReload = 48 + SPD × 6` |
| Skill-cooldown multiplier | `1 − min(SPD, 600) / 600 × 0.5` — linear, floors at **0.5×** at SPD 600 |
| **Base slash reach (px)** | `120 + floor((90 + Dan × 5) × SPD / (20 + SPD))` — **120 px at SPD 0, asymptote 210 px at Dan 0**, 255 px at Dan 9 |

Then per-stance multipliers on top, `MCSPlayer.as:3029–3053`:

```
LIGHT_STANCE:    this.slashLength = this.baseSlashLength * 1.5;
BALANCED_STANCE: this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01);
HEAVY_STANCE:    this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);
                 if(this.slashLength < 100) { this.slashLength = 100; }
```

A level-1 starter (SPD 1, Dan 0) has `baseSlashLength = 120 + floor(90×1/21) = 124` px →
Light **186 px**, Balanced **124 px**, Heavy **100 px** (clamped). Note the canvas is **800×480**
(`StatsManager.as:80–82` `stageWidth=800; stageHeight=480;`), so these are native stage px.

This kills L5's headline blocker and **contradicts the shipped `STANCE_TABLE` reach 300/200/120**:
the real model is one SPD/Dan-driven base length with stance multipliers `1.5 / ~1.0 / ~0.5`, not
three fixed per-stance reaches. Flagged for L5, not changed here (§4 no-touch).

Verdict: **HELD.**

---

### P-08 — **The XP-income model is fully held: kill XP, its level-difference scaling, its grey-out cutoff, and quest XP.** (OVERTURNS §4 blocker ④)

Ledger sentence overturned: *"④ full XP-income model (quest/gather/dungeon, not just kills)."*

**(a) Base mob XP — `shs3_android_payload/scripts/NPC.as:218` and `:252`:**

```
this.xp = this.level * 2 + 20;
```

(web: `§1t122s0§.as:103`, `§1t4523s0§.as:66`, `§1t4555s0§.as:62`, `§1t4570s0§.as:34`, `§1t4574s0§.as:39` — all `xp = level * 2 + 20`.)

**(b) The award function — `NPC.as:166–189`:**

```
public static function calcXP(playerLevel:int, mobLevel:int, xp:int, elite:Boolean) : * {
   if(mobLevel <= getGreyLevel()) { return 0; }
   if(mobLevel - playerLevel > 3) { return 0; }
   var finalXP:int = xp;
   if(playerLevel < mobLevel)      { finalXP = xp * (1 + 0.05 * (mobLevel - playerLevel)); }
   else if(playerLevel > mobLevel) { finalXP = xp * (1 - (playerLevel - mobLevel) / getZeroDifference()); }
   if(elite) { finalXP *= 2; }
   return finalXP;
}
```

**(c) Grey-out ladder — `NPC.as:94–110`** (below this mob level you earn nothing):

```
if(playerLevel < 6)  { return 0; }
if(playerLevel < 40) { return playerLevel - Math.floor(playerLevel / 10) - 5; }
if(playerLevel < 60) { return playerLevel - Math.floor(playerLevel / 5) - 1; }
return playerLevel - 9;
```

**(d) Zero-difference denominator — `NPC.as:112–163`**, a 10-band step function:
`<8→5, <10→6, <12→7, <16→8, <20→9, <30→11, <40→12, <45→13, <50→14, <55→15, <60→16, else 17`.

**(e) Multipliers and the cap gate — `LootDialog.as:640–648`:**

```
if(StatsManager.hasBuff(StatsManager.BUFF_XP) || StatsManager.hasBuff(StatsManager.BUFF_MODERATOR)) { num *= 1.5; }
if(StatsManager.getLevel() < StatsManager.levelCap) { this.lootXP.changeIntValue(num); }
```

Plus mode modifiers: survival mode halves XP (`LootDialog.as:687–690`,
`this.lootXP.setIntValue(this.lootXP.getIntValue() / 2);`) as does `halfXPMaxFourLoot()` (:693).

**(f) Quest XP — A2, `reference/extracted/questdata.xml`.** 69 `<exp>` rows under
`questdata/quest/step/reward/exp` (index `docs/gauntlet/L0/index/questdata.json`, confirmed by
`grep -c "<exp>" → 69`). Verbatim, first row, lines 214–216:

```
    <reward>
      <exp>290</exp>
    </reward>
```

and lines 411–413 (with its plain-English step title above it at :409 `<title>Meet Hiroshi outside his hut</title>`):

```
    <reward>
      <exp>200</exp>
    </reward>
```

Full distribution: `1000`×27, `2000`×19, `600`×8, `500`×3, `250`×3, `200`×3, `3000`×2, `100`×2,
`750`×1, `290`×1. Only 10 distinct values — quest XP is a hand-tuned tier ladder, not a formula.

Verdict: **HELD.** Nothing in the XP-income model is inferred any more.

---

### P-09 — **Level-up grants more than the ledger records: it also refills AP and resets duel tokens.** (EXPANDS the §4 Ready bullet)

Ledger sentence expanded: *"+3 stat/+1 skill/full refill per level"*

**A2 — web `§1t1523s0§.as:2072–2082`**, decoded (`§1t9418s0§`=17 SKILLPOINTS, `§1t9419s0§`=18 STATPOINTS,
`§1t9411s0§`=10 LEVEL, `§1t9414s0§`=13 AP, `§1t9415s0§`=14 MAXAP, `§1t9416s0§`=15 DUELTOKENS).
Named twin, `StatsManager.as:1646–1671`:

```
public static function levelUp() : void {
   changeStat(STAT_SKILLPOINTS,1);
   changeStat(STAT_STATPOINTS,3);
   setStat(STAT_LEVEL,getLevel());
   …
   fullHealth();
   setStat(STAT_AP,getPlayerStats(STAT_MAXAP));
   setStat(STAT_DUELTOKENS,MAXDUELTOKENS);
```

`fullHealth()` (`:1696–1700`) sets HP and Chi to max **including gear bonuses**
(`getPlayerStats(STAT_MAXHP) + findBonusStat(STAT_MAXHP)`). So a level-up is a **four-resource**
event: HP, Chi, AP, duel tokens. The UI text corroborates the grant —
`LevelUpDialog.as:54–55`: `this.statText.text = "+" + numOfLevels * 3;` /
`this.skillText.text = "+" + numOfLevels * 1;` — and it plays `MusicManager.MUSIC_LEVELUP` (:60).

One divergence worth recording: the Android build has an `autoAssignStats` auto-spend branch
(`StatsManager.as:1655–1682`, round-robin over `[MAXHP, MAXCHI, ATTACK, DEFENSE, SPEED, MAXAP]`);
**the web build has none.** Do not port the auto-assign.

Verdict: **HELD** (with two grants the ledger omits).

---

### P-10 — **Start pools confirmed and completed — and an A1 frame independently corroborates the Chi base.**

Ledger sentence: *"start pools (HP10/Chi10/AP30)"*

**A2 — `shs3_android_payload/scripts/StatsManager.as:693–712`** (new-character init):

```
setPlayerStats(STAT_HP,10);      setPlayerStats(STAT_MAXHP,10);   setPlayerStats(STAT_HPREGEN,1);
setPlayerStats(STAT_CHI,10);     setPlayerStats(STAT_MAXCHI,10);  setPlayerStats(STAT_CHIREGEN,1);
setPlayerStats(STAT_ATTACK,1);   setPlayerStats(STAT_DEFENSE,1);  setPlayerStats(STAT_SPEED,1);
setPlayerStats(STAT_XP,0);       setPlayerStats(STAT_LEVEL,1);
setPlayerStats(STAT_GOLD,100);   setPlayerStats(STAT_HGOLD,0);
setPlayerStats(STAT_AP,30);      setPlayerStats(STAT_MAXAP,30);
setPlayerStats(STAT_DUELTOKENS,20); setPlayerStats(STAT_MAXDUELTOKENS,20);
```

The three the ledger names are right; the three it omits are **ATK/DEF/SPD = 1 each**, which is what
makes P-02's `1 + (level+10)×3` read as a cap on those stats. `unAssignStatPoints`
(`StatsManager.as:2117–2137`) re-asserts the identical bases on respec, so 10/10/30/1/1/1 is the
canonical base vector.

**A1 corroboration — `reference/frames/session11/lead/t583.65_overworld-heavy-stance-hud.png`**
(1920×1080; crop x=0, y=0.72·H, w=0.45·W, h=0.28·H → bottom-left HUD, upscaled 2.6× with lanczos).
Visibly in the crop: a **green bar reading `20 / 20`**, a **blue bar reading `10 / 10`**, the caption
**`HEAVY STANCE`**, and a **red-ringed straw-hat portrait**. The blue `10 / 10` is the untouched Chi
base. The green `20 / 20` is 10 base + one +10 HP point (P-03) — note it would equally read as
"10 + two +5 points" under the Android v0.682 table, so **the frame alone cannot settle the per-point
magnitude; the web payload does**, and the frame is consistent with it. The frame also settles that
HP and Chi are two *small integer* meters, not a 100-scale — confirming §3 correction #5.

Verdict: **HELD.**

---

### P-11 — **Skill unlock cadence is A2-sourced but the "ending 0 / ending 5" rule has three real exceptions.** (PARTIAL — corrects the §4 Ready bullet)

Ledger sentences: §4 progression Ready *"unlock cadence"*; §1 KNOWN-KNOWNS *"skills unlock at levels ending 0 (Ninja) / 5 (Chi)"*.

**A2 — `reference/extracted/skilldata.xml`**, `<lvlreq>` on 33 of 75 skills (index
`docs/gauntlet/L0/index/skilldata.json`, `skilldata/skill/lvlreq` count 33, range 3–80). Parsed by
category:

| Category | `<lvlreq>` sequence (by `<order>`) | skill ids |
|---|---|---|
| **4** | 5, 15, **25, 35, 45, _50_, 55, 65, 75** | 1005,1006,1043,1044,1045,**1069**,1046,1047,1048 |
| **6** | 10, **_15_**, 20, 30, 40, 50, 60, 70, 80 | 1007,**1024**,1010,1051,1052,1053,1054,1012,1055 |
| **5** (passives) | **_3_**, 5, 5, 5, 5, 5, 5 | **1004**,1008,1009,1011,1020,1021,1022 |
| 7 / 8 / 9 / 10 (elemental) | 20, 50 | 1013+1070, 1035+1071, 1034+1072, 1033+1073 |

Verbatim, `reference/extracted/skilldata.xml:257` — `<lvlreq>3</lvlreq>` (skill id `1004`, category 5).

So: category 4 is the "ending 5" tree and category 6 the "ending 0" tree, **but** skill `1069` breaks
cat-4 at level 50, skill `1024` breaks cat-6 at level 15, and passive `1004` unlocks at **level 3**.
The ledger's rule is a good mnemonic and a bad spec.

**Names are still blocked.** `<displayname>` is a numeric id (`6000`–`6141`), `<desc>` is `6001`–`6146` —
see P-13.

Verdict: **PARTIAL.**

---

### P-12 — **Dan ranks: max is 9 stored / 10 displayed, and the rebirth gold IS tiered — `+25`, with `+100` on the last one.** (OVERTURNS §3 correction #7; lands on **L11**)

Ledger sentence overturned: *"7. **`MAX_DAN_RANK=10` and `tenthGold=100` should be INFERRED, not CONTRACT.** The only wiki datum is garbled (\"dan rank 5 (kyudan)\" — kyudan=9th); film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."*

**A2 — web `§1t1523s0§.as:2638–2656`** (`§1t9426s0§`=25=DAN, `§1t9413s0§`=12=HGOLD; named twin `StatsManager.as:2195–2214`):

```
if(§1t7356s0§(§1t9426s0§) == 8) {
   §1t9713s0§(§1t9413s0§,100);
   §1t3318s0§.instance.§1t3409s0§(§1t1521s0§.getString(864,[§1t9765s0§(),"10"]));
} else {
   §1t9713s0§(§1t9413s0§,25);
}
if(§1t7356s0§(§1t9426s0§) < 9) { §1t9713s0§(§1t9426s0§,1); }
```

Three things fall out, all against the ledger:
1. **`tenthGold = 100` is CONTRACT, not INFERRED.** The literal is right there, on the `DAN == 8` branch.
2. **`MAX_DAN_RANK = 10` is CONTRACT.** DAN is stored 0–9 and *displayed* as `DAN + 1` (the same line
   hard-codes the string `"10"` for the final one), i.e. ten ranks. `InventoryUI.as:2274–2316` confirms
   the display ladder: `case 0: danfield.text = "";` then nine distinct title strings for DAN 1–9,
   with a name-colour tier changing at DAN 3, 6 and 8.
3. **"no 10th-rebirth tier" is false**, and *"film shows a flat +25 gold"* cannot be the source it
   claims to be — §4 rebirth-elements says the opposite in the same document: *"rebirth/element-picker
   UI (never filmed — both longplays pre-rebirth)"*. The ledger contradicts itself; the payload settles it.

Bonus, **A2 `QueryManagerBase.as:2674`** — the server-facing effective level:
`variables.level = StatsManager.getLevel() + StatsManager.getPlayerStats(StatsManager.STAT_DAN) * 80;`
→ leaderboard level = `level + Dan × 80`, max **800**.

*Android v0.682 note:* that build paid `+5` / `+20` instead of `+25` / `+100`
(`StatsManager.as:2201–2211`). Web wins.

Verdict: **HELD.**

---

### P-13 — **The string table is named and located — and it is genuinely NOT in anything we hold.** (STILL_UNHELD, but the search is now bounded; lands on **L1b**)

`GAUNTLET.md` §2.1 blocker: item/skill/npc `<name>`, `<desc>`, `<displayname>` are numeric ids into a
table "NOT YET LOCATED"; `bindata/` is exhausted as a candidate.

**A2 — `shs3_android_payload/scripts/LangManager.as:38, 56–58`:**

```
var server:String = "./data/";
if(StatsManager.useExternalLang) { … server = QueryManager.instance.server + "strings/"; }
…
Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");
Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");
Locale.loadLanguageXML(id,onLanguageLoad);
```

and the accessor, `LangManager.as:73–78`:

```
public static function getString(num:int, paramArray:Array = null) : String {
   … var output:String = Locale.loadStringEx(num.toString(),language);
```

So the table is **`shs3_en.xml`** (plus `shs3_zh-CN.xml`, `shs3_ja`), fetched at runtime over HTTP
from `<server>/strings/` or `./data/`. It is a **separate network resource, never embedded in the
SWF** — which is exactly why `bindata/` came up empty and why `ui_strings.txt` (extracted static
TextField contents) isn't it. `StatsManager.as:62–66` reserves file ids `FILE_LANG_EN=15`,
`FILE_LANG_ZHCN=16`, `FILE_LANG_JA=17` **outside** both `xmlFileIdArray` (0–9) and
`resourceFileIdArray` (10–14, both at `:70`/`:72`), confirming it was never part of the payload bundle.

This blocks: Dan titles (ids 456–467), the level-up dialog copy (ids 119, 120, 133–136), every skill
`<displayname>`/`<desc>` (6000–6146 / 7000–7095), every item/NPC name.

**Not blocked:** quest `<title>`/`<stitle>` are plain English inline —
`reference/extracted/questdata.xml:409` `<title>Meet Hiroshi outside his hut</title>`,
`:410` `<stitle>Talk to Hiroshi</stitle>`.

Verdict: **STILL_UNHELD** on the strings themselves. What is now held is the file's *name, format,
loader, and the proof it was never local* — L1b should hunt Wayback for
`strawhatsamuraiduels.com/strings/shs3_en.xml` (or `/data/shs3_en.xml`), not keep grepping the payload.

---

### P-14 — **A second, separate progression curve exists that no ledger system mentions: an 11-entry mastery-XP table, present ONLY in the live web payload.** (NEW — absent from all 12 systems)

**A2 — `reference/decompiled/shs3_payload/scripts/§1t29s0§.as:30`, on the line immediately after the character-XP array:**

```
public static const §1t12498s0§:Array = [0,300,900,2100,4800,10200,21000,42600,85800,172200,345000];
```

with, at `:20` of the same class, `public static const §1t12495s0§:int = 10;` and the lookup at
`:296–316`:

```
_loc4_ = 0;
while(_loc4_ <= §1t12495s0§) { if(§1t12498s0§[_loc4_] >= _loc3_) { … return _loc4_; } _loc4_++; }
```

The class branches on `param1 == §1t24s0§.§1t8755s0§` (stat index 9 = XP) to use the *character*
table and otherwise this one — i.e. **four parallel XP pools: character level plus three others**
(the class declares exactly four ids, `§1t12491s0§`–`§1t12494s0§` = 0,1,2,3). Given skills
1000/1001/1002 are the Light/Balanced/Heavy masteries that feed `slashLength` (P-07) and gate
`canLaunch`/`canDeflect`/`canAirCombo` (`MCSPlayer.as:3166–3184`), the strong reading is
**per-stance mastery XP, 11 tiers (0–10)**.

`grep -rn "0,300,900,2100,4800" reference/decompiled/` returns **one hit** — the web payload only.
The Android 0.682 build has no such array, which fits it being a later-version system.

I am confident about the array, its max index (10) and that it is a *second* XP-driven progression
axis. I am **not** confident it is stance-specific rather than, say, weapon-type mastery: the branch
key is an obfuscated stat index I did not resolve. Recording as **PARTIAL** rather than asserting.

Verdict: **PARTIAL.**

---

### P-15 — **Cross-lane (L4): field mobs at level ≤ 10 have exactly 1 HP, 1 damage, 1 defense — in the code.** (CONFIRMS the SESSION 11 measurement; OVERTURNS §4 enemies-ai blockers ①②)

Ledger sentences overturned: §4 enemies-ai *"① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred). ② per-enemy HP."*

**A2 — `shs3_android_payload/scripts/NPC.as:239–259`:**

```
public function setLevel(lvl:int) : * {
   var factor:Number = lvl / this.level;
   if(lvl <= 20) { factor *= 0.9; }
   this.level = lvl;
   this.damage *= factor;  this.defense *= factor;  maxhp *= factor;  setHP(maxhp);
   this.updateHealthBar();
   this.xp = lvl * 2 + 20;
   if(lvl <= 10) { this.damage = 1; this.defense = 1; maxhp = 1; setHP(maxhp); }
}
```

The level→stat rule is a **multiplicative rescale of the `npcdata.xml` base row**
(`factor = targetLvl / baseLvl`, ×0.9 below level 21), and everything at level ≤ 10 is hard-clamped
to **1 HP / 1 damage / 1 defense**. This is the code-level cause of the SESSION 11 frame measurement
*"mobs die in ONE hit"* — measurement and payload agree.

It also condemns the shipped `AI_TIERS`/`ENEMY_BASE` "hp 150" dummy the ledger already flags, and it
means `npcdata.xml`'s 403 `<hp>` rows are *base* rows to be rescaled, not final HP.

Verdict: **HELD.**

---

### P-16 — **Cross-lane (L5): the stance triangle is a ×1.2 damage relation, and it is in the code.** (NEW; not in any §4 block)

**A2 — `shs3_android_payload/scripts/MCSPlayer.as:3701–3707`:**

```
if(this.stance == LIGHT_STANCE && enemyStance == BALANCED_STANCE
|| this.stance == BALANCED_STANCE && enemyStance == HEAVY_STANCE
|| this.stance == HEAVY_STANCE && enemyStance == LIGHT_STANCE)
{
   damage *= 1.2;
```

`this` is the **defender** (the method that takes the hit) and `enemyStance` is the **attacker's** —
`MCSPlayer.as:3654` `var enemyStance:int = damageObj.stance;`. So: **Balanced beats Light, Heavy
beats Balanced, Light beats Heavy**, ×1.2 damage, applied **before** the flat DEF subtraction of P-06. Beheading adds a further
`damage *= 1.5` (`:3713–3716`). §4 combat-core lists a *"counter triangle"* nowhere; §3 has a frame
note `t396.0_counter-triangle.png` but no multiplier.

Verdict: **HELD.**

---

## STILL_UNHELD after this survey

Recorded honestly; each is something the progression lane looked for and did not find.

| # | What | Why it is still open |
|---|---|---|
| U-1 | **Every progression-facing NAME** — Dan rank titles (`getString(456…464)`), the level-up dialog copy (`getString(119,120,133,134,135,136)`), all 73 skill `<displayname>` ids | P-13: they live in `shs3_en.xml`, a runtime HTTP fetch that was never inside the payload. No local copy exists. |
| U-2 | **AP regeneration rate and its real-world tick** | Level-up refills AP (P-09) and points raise MAXAP by 5, but I found no regen constant in `StatsManager`; the ledger's world-exploration blocker ③/④ (day length, AP regen) is untouched by anything I read. |
| U-3 | **Whether the v0.706 payload is byte-equal to what the longplays ran** | The preloader stamps v0.717 (A1 title screen); the live manifest stamps the *payload* v0.706. They are different version counters and I could not prove they are the same build. Treat every web-payload number as "the last live payload", not "provably the filmed frame". |
| U-4 | **The semantics of the 11-entry mastery curve's branch key** (P-14) | The discriminating constant is an unresolved obfuscated stat index. |

---

## What this does to the score

The §4 progression block had 4 blockers. **Blockers ①, ②, ③ and ④ are all now A2-sourced and closed**
(P-06/P-07, P-01, P-05, P-08). The Ready list survives with two corrections (`+1AP`→`+5AP`,
`80 SP`→`79 SP`) and two additions (AP + duel-token refill; ATK/DEF/SPD base 1). The Surface bullet's
271-cap reasoning is wrong and replaced by an exact formula.

Nothing in progression is INFERRED any more except U-2 (AP regen), which is really a world-lane
number. On the ledger's own 0–100 framing this is no longer a 55.

**Re-score: 88 / 100.** Held back from higher only by U-1 (every label is a numeric id into a file we
do not have) and U-3 (the residual version-provenance gap).
