# GAUNTLET L0 — system survey: **progression** (ledger score 55/100)

Surveyor pass, 2026-08-14. Document under audit: `docs/research/REBUILD_READINESS.md`
(2026-07-20), §2 table row line 127, §4 block lines 198–201, §6 line 350.

**Headline.** The progression block is the most out-of-date block in the ledger.
Every one of its **four blockers is now HELD in the payload**, including the one the
document escalated to §6 "structurally UNRECOVERABLE" (the L11–80 XP curve). The
score should not be 55.

Two of its "Ready" bullets are also **wrong in detail** (`+1AP` per point; `80 SP
first run`), and its Surface bullet's explanation of the "271 cap" is **refuted by
arithmetic** — 271 is a hard UI cap formula evaluated at level 80, not a budget.

A frame **arbitrates a build conflict** in this lane and is recorded as such below
(claim `progression/per-point-magnitudes`): the Android v0.682 payload and the web
v0.717 payload disagree on per-stat-point magnitudes, and **the frame wins** — it
matches web. Port progression numbers from **web**, not Android.

---

## Evidence base

| Source | What it is |
|---|---|
| `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as` | the **web v0.717** `StatsManager` (obfuscated names) — the shipped build |
| `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as` | web v0.717 `InventoryUI` (stat-point spend + caps) |
| `reference/decompiled/shs3_payload/scripts/§1t99s0§.as` | web v0.717 `MCSPlayer` (damage/defense) |
| `reference/decompiled/shs3_android/scripts/StatsManager.as` | **Android v0.682** `StatsManager` — CLEAR-NAMED, used to decode the web symbols |
| `reference/decompiled/shs3_android/scripts/NPC.as` | `calcXP` / grey-level / zero-difference |
| `reference/extracted/skilldata.xml`, `questdata.xml` | unlock cadence, quest XP rewards |
| `reference/videos/zFtCaTO0_1M.mp4` | video **A** — 1920×1080; frames extracted first-hand this pass |

Symbol map established this pass (android name → web obfuscated symbol), all
verified by matching literal values and stat-id integers:

```
STAT_MAXHP=1  → §1t9403s0§    STAT_MAXCHI=4  → §1t9406s0§
STAT_ATTACK=6 → §1t9408s0§    STAT_DEFENSE=7 → §1t9409s0§
STAT_SPEED=8  → §1t9410s0§    STAT_LEVEL=10  → §1t9411s0§
STAT_AP=13    → §1t9414s0§    STAT_MAXAP=14  → §1t9415s0§
STAT_SKILLPOINTS=17 → §1t9418s0§   STAT_STATPOINTS=18 → §1t9419s0§
STAT_DAN=25   → §1t9426s0§    levelCap=80 → §1t9470s0§   expArray → §1t5923s0§
addMaxAP      → §1t9609s0§
```

---

## CLAIMS

### 1. `progression/xp-curve-l11-80` — **HELD** (A2) · OVERTURNS §6 + blocker ②

**Claim.** The complete L1→L99 cumulative XP table is on disk in **both** payloads,
byte-identical; the L11–80 stretch the ledger calls "likely unrecoverable" and lists
under §6 "structurally UNRECOVERABLE" is a 99-entry literal array.

**Ledger text overturned** (line 200): *"② **L11–80 XP curve — likely unrecoverable**
(no wiki table; both longplays cap at L10; a solo build probably can't reach L11+
offline). Keep the extrapolation as labeled INFERRED."*
and (line 350): *"- **L11–80 XP curve** — no table published; a solo build likely
can't reach L11+; keep the extrapolation labeled INFERRED."*

**Cite.** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:364` (web v0.717)
— duplicated verbatim at `§1t29s0§.as:28`, and clear-named at
`reference/decompiled/shs3_android/scripts/StatsManager.as:78`.

**Quote (verbatim, truncated at L20 for width; the array is 99 entries):**
```
public static const §1t5923s0§:Array = [0,550,1450,2950,5150,8350,12150,16350,20900,
25900,31400,37400,43500,49850,56550,63900,71900,80300,89100,98300,108000, … ,
19295800,22095800,25395800,29395800];
```
Anchor values: `expArray[11]=37400`, `[20]=108000`, `[40]=507300`, `[60]=1508800`,
`[80]=4285800`, `[98]=29395800`.

**Semantics** (`§1t1523s0§.as` / android `StatsManager.as:1586-1606`):
`getLevel()` scans `for(q=0; q<99; q++) if(expArray[q] > currentXP) return q;` —
so `expArray[L]` is the **cumulative cap to FINISH level L**, exactly the semantics
`src/config/xp.ts` already documents. `getXPtoLevel() = expArray[getLevel()] - XP`.

**Lane impact.** L4 (progression) blocker ② dies; §6's list loses a line.

---

### 2. `progression/inferred-extrapolation-error` — **HELD** (A2+A3)

**Claim.** The shipped `XP_DELTA_STEP = 500` extrapolation is not merely "labeled
INFERRED", it is quantifiably wrong, and the error compounds catastrophically —
it under-shoots the real curve by **−61.3 % at level 80**.

**Cite.** `src/config/xp.ts:28` (`export const XP_DELTA_STEP = 500;`) vs the array in
claim 1. Test currently green and pinning the wrong model:
`tests/xp.test.ts > xpThreshold — cumulative cap to finish a level > extrapolates
L11+ by growing the per-level delta by XP_DELTA_STEP (INFERRED)`:

```
 ✓ tests/xp.test.ts > xpThreshold — cumulative cap to finish a level > extrapolates L11+ by growing the per-level delta by XP_DELTA_STEP (INFERRED) 0ms
 Test Files  1 passed (1)      Tests  11 passed (11)
```

**Measured divergence** (real vs the config model):
```
L11: real=   37,400  inferred=   37,400  err= +0.0%   ← coincidence, one level only
L12: real=   43,500  inferred=   43,900  err= +0.9%
L20: real=  108,000  inferred=  113,900  err= +5.5%
L40: real=  507,300  inferred=  428,900  err=-15.5%
L60: real=1,508,800  inferred=  943,900  err=-37.4%
L80: real=4,285,800  inferred=1,658,900  err=-61.3%
```

---

### 3. `progression/l1-l10-caps-confirmed` — **HELD** (A3 + A2)

**Claim.** The frame-derived `XP_THRESHOLDS` already in config is **exactly** the
payload's `expArray[1..10]` — the video study got all ten right. This is a rare
clean corroboration of the study method, and it is what licenses trusting the
frames elsewhere.

**Cite.** `tests/xp.test.ts > XP_THRESHOLDS — the frame-backed L1–L10 table > pins
all ten observed cumulative caps exactly` — PASSES:
```
 ✓ tests/xp.test.ts > XP_THRESHOLDS — the frame-backed L1–L10 table > pins all ten observed cumulative caps exactly 1ms
```
`src/config/xp.ts:23-25` holds `[550, 1450, 2950, 5150, 8350, 12150, 16350, 20900,
25900, 31400]`; `expArray[1..10]` = the identical ten integers.

---

### 4. `progression/frame-confirms-xp-caps` — **HELD** (A1)

**Claim.** Opened the primary video first-hand: the on-screen XP bar reads the
payload's numbers exactly. Payload and frame **agree**; no conflict to adjudicate.

**Cite / crop.** `reference/videos/zFtCaTO0_1M.mp4` (video A, 1920×1080),
`ffmpeg -ss 1600 -i … -frames:v 1` → PLAYER panel. Crops used:
`crop=iw*0.55:ih*0.20:iw*0.42:ih*0.16, scale=1.7×, lanczos` (stat block) and
`crop=iw*0.55:ih*0.22:iw*0.42:ih*0.09, scale=1.8×` (XP row).
Second frame at `-ss 655` (the same panel one level earlier).

**Visibly in the crop (t=1600 s):** a fan-shaped level badge reading **4**, gold XP
bar **"5110 / 5150"** with caption **EXPERIENCE POINTS**, **"AVAILABLE STAT POINTS: 0"**,
green **HP 20 / 20**, blue **CHI 9 / 15**, **AP 15 / 30**, **ATK 10**, **DEF 10 + 13**
(the +13 in orange = gear), **SPD 4**, **WEIGHT: 73 / 100**.
**Visibly in the crop (t=655 s):** level badge **3**, **"2098 / 2950 EXPERIENCE POINTS"**,
**AVAILABLE STAT POINTS: 0**, WEIGHT 38/100.

`expArray[4] = 5150` ✓ and `expArray[3] = 2950` ✓ — read off the screen, matching
the payload literal.

---

### 5. `progression/per-point-magnitudes` — **HELD** (A1 arbitrates A2-vs-A2) · OVERTURNS a Ready bullet

**Claim.** Per stat point the WEB v0.717 build grants **HP +10, Chi +5, AP +5,
ATK +3, DEF +3, SPD +3**. The ledger's `+1AP` is **wrong** (it is +5); the other
three are right. The **Android v0.682 build grants different numbers**
(HP +5, Chi +5, AP +1, ATK/DEF/SPD +1) — and **the frame wins over the Android
payload**: only the web magnitudes reproduce what is on screen.

**Ledger text overturned** (line 199): *"- **Ready:** +3 stat/+1 skill/full refill per
level; **+10HP/+5Chi/+1AP/+3-stat per point**; …"*

**Cite (web, authoritative).** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3390-3445`:
```
public function §1t6049s0§(param1:MouseEvent) : void      // HP add
   §1t1523s0§.§1t9713s0§(§1t1523s0§.§1t9419s0§,-1);      // statpoints -1
   §1t1523s0§.§1t9713s0§(§1t1523s0§.§1t9403s0§,10);      // MAXHP +10
…  §1t1523s0§.§1t9713s0§(§1t1523s0§.§1t9406s0§,5);       // MAXCHI +5
…  §1t1523s0§.§1t9609s0§(5);                             // addMaxAP(5)
…  §1t1523s0§.§1t9713s0§(§1t1523s0§.§1t9408s0§,3);       // ATTACK +3
…  §1t1523s0§.§1t9713s0§(§1t1523s0§.§1t9409s0§,3);       // DEFENSE +3
…  §1t1523s0§.§1t9713s0§(§1t1523s0§.§1t9410s0§,3);       // SPEED +3
```
**Cite (android, contradicting).** `reference/decompiled/shs3_android/scripts/InventoryUI.as:2417,2424,2431-2453`:
```
StatsManager.changeStat(StatsManager.STAT_MAXHP,5);
StatsManager.changeStat(StatsManager.STAT_MAXCHI,5);
StatsManager.addMaxAP(1);
StatsManager.changeStat(StatsManager.STAT_ATTACK,1);   // and DEFENSE,1 / SPEED,1
```

**THE FRAME WINS — and it picks web.** From claim 4's crop at t=1600 s: level 4,
`AVAILABLE STAT POINTS: 0`, maxHP 20, maxChi 15, maxAP 30, ATK 10, DEF 10 (base),
SPD 4. Start pools are HP 10 / Chi 10 / AP 30 / ATK 1 / DEF 1 / SPD 1 (claim 8),
and the level-4 budget is `(4-1)*3 = 9` points.
- **web magnitudes:** HP 10→20 = 1 pt · Chi 10→15 = 1 pt · AP unspent = 0 · ATK 1→10
  (+9) = 3 pts · DEF 1→10 (+9) = 3 pts · SPD 1→4 (+3) = 1 pt → **exactly 9 points,
  and 0 remaining.** ✓
- **android magnitudes:** the same screen would need 2 + 1 + 0 + 9 + 9 + 3 = **24
  points** — impossible from a 9-point budget. ✗

**Consequence for the whole gauntlet.** Stage-0b's S0-3 caveat ("UI copy and combat
tuning parity is NOT established") is now **concretely proven for progression**:
the two builds are tuned differently. Use `shs3_payload` (web) for numbers; use
`shs3_android` only as a **decoder ring** for symbol names.

**Bonus correction.** This also settles an open INFERRED flag in the video study:
`docs/research/video-study/segments/A-02-dojo-tutorial-3-stances-chi-punch-on-dum.md`
line 25 hedges *"treat exact point-to-stat ratio as INFERRED, needs frame-by-frame
combat-panel replay to confirm"* — it is +3 per point for ATK/DEF/SPD, confirmed.

---

### 6. `progression/per-stat-hard-caps` — **HELD** (A2) · NEW, absent from the ledger

**Claim.** Stats are **hard-capped by character level**, a mechanic the ledger's
progression block does not mention at all. The `+` buttons are hidden once a stat
reaches its cap:

| Stat | Cap formula (web v0.717) | at L1 | at L80 |
|---|---|---|---|
| MAX HP | `10 + (level + 10) × 10` | 120 | **910** |
| MAX CHI | `10 + (level + 10) × 5` | 65 | 460 |
| MAX AP | `30 + (level + 10) × 5` | 85 | 480 |
| ATK / DEF / SPD | `1 + (level + 10) × 3` | 34 | **271** |

**Cite.** `reference/decompiled/shs3_payload/scripts/§1t5957s0§.as:3341-3346`:
```
var _loc3_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9403s0§) < 10 + (_loc2_ + 10) * 10;
var _loc4_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9406s0§) < 10 + (_loc2_ + 10) * 5;
var _loc5_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9415s0§) < 30 + (_loc2_ + 10) * 5;
var _loc6_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9408s0§) < 1 + (_loc2_ + 10) * 3;
```
(`_loc2_` = `getStat(STAT_LEVEL)`; the android build's caps differ again —
`10+(L+10)*5`, `20+(L+10)`, `L+10` — same version-drift as claim 5.)

---

### 7. `progression/271-cap-explained` — **HELD** (A2) · OVERTURNS the Surface bullet

**Claim.** The mysterious "271 cap" is **exactly** the level-80 evaluation of the
ATK/DEF/SPD cap formula: `1 + (80 + 10) × 3 = 271`. It is a hard per-stat UI ceiling,
not a "gear/rebirth-inclusive" total, and the ledger's arithmetic explanation is
wrong because it assumed +1 per point.

**Ledger text overturned** (line 201): *"The \"271 cap\" is gear/rebirth-inclusive
(237-point first-run budget makes it impossible in one stat) — resolvable by
arithmetic now."*

**Why the ledger's reasoning fails.** The first-run budget is indeed
`(80-1) × 3 = 237` points — but each point is **+3** to ATK/DEF/SPD (claim 5), so a
single stat needs only **90 points** to hit 271, well inside 237. The cap is
reachable in one stat on a first run, and it binds *before* the budget runs out.

**Cite.** `§1t5957s0§.as:3344` (formula, quoted in claim 6) + `§1t1523s0§.as:362`
`public static const §1t9470s0§:int = 80;` (level cap) + `§1t1523s0§.as:2577`
`§1t7357s0§(§1t9419s0§,(getLevel() - 1) * 3);` (237-point budget).

---

### 8. `progression/start-pools-and-respec` — **HELD** (A2)

**Claim.** The ledger's start pools (HP 10 / Chi 10 / AP 30) are correct and now
carry a payload cite, plus the two missing entries: **ATK 1, DEF 1, SPD 1**. The
same function is the game's **respec** (`unAssignStatPoints`), which restores those
six values and refunds `(level-1) * 3` points — i.e. respec is free and total.

**Cite.** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2559-2578` (web),
clear-named at `reference/decompiled/shs3_android/scripts/StatsManager.as:2118-2138`:
```
public static function unAssignStatPoints() : *
{
   setPlayerStats(STAT_MAXHP,10);
   …
   setPlayerStats(STAT_MAXCHI,10);
   …
   setPlayerStats(STAT_ATTACK,1);
   setPlayerStats(STAT_DEFENSE,1);
   setPlayerStats(STAT_SPEED,1);
   …
   setPlayerStats(STAT_MAXAP,30);
   setPlayerStats(STAT_STATPOINTS,(getLevel() - 1) * 3);
}
```

---

### 9. `progression/post-rebirth-sp` — **HELD** (A2) · OVERTURNS blocker ③

**Claim.** The post-rebirth skill-point economy is a single closed-form line:
**`SP = (level − 1) + Dan × (levelCap − 1)` = `(level − 1) + Dan × 79`.** Each
rebirth permanently adds a full 79-point skill budget. With the Dan cap of 9
(claim 11) the lifetime maximum is `79 + 9 × 79 = 790` SP.

**Ledger text overturned** (line 200): *"③ post-rebirth SP economy;"* (listed as a blocker).

**Cite.** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2598` (web):
```
§1t7357s0§(§1t9418s0§,getLevel() - 1 + §1t7356s0§(§1t9426s0§) * (§1t9470s0§ - 1));
```
clear-named at `reference/decompiled/shs3_android/scripts/StatsManager.as:2156`:
```
setPlayerStats(STAT_SKILLPOINTS,getLevel() - 1 + getPlayerStats(STAT_DAN) * (levelCap - 1));
```

**Also settled:** `doRebirth()` (android `StatsManager.as:2195-2231`) calls
`unAssignStatPoints()` but **not** `unAssignSkillPoints()` — learned skills survive a
rebirth; only the equipped **skill slot vector** is reset to a single entry
(`skillSlots[0] = new IntStat(1003,1)` = *Jump*).

---

### 10. `progression/sp-first-run-off-by-one` — **HELD** (A2) · OVERTURNS a Ready bullet

**Claim.** First-run skill points are **79**, not 80. `SP = level − 1` with `level`
capped at 80.

**Ledger text overturned** (line 199): *"…; cap 80; **80 SP first run**; unlock
cadence; …"*

**Cite.** same line as claim 9 (`§1t1523s0§.as:2598`), with `Dan = 0` ⇒ `SP = 80 − 1 = 79`.
Per-level grant confirmed at `§1t1523s0§.as:2074-2075`:
```
§1t9713s0§(§1t9418s0§,1);   // SKILLPOINTS +1
§1t9713s0§(§1t9419s0§,3);   // STATPOINTS  +3
```
(79 levels gained from L1→L80 × 1 SP = 79; and 79 × 3 = 237 stat points, matching
claim 7.) The `+3 stat / +1 skill per level` half of the bullet is **correct**.

---

### 11. `progression/levelup-refill-and-cap` — **HELD** (A2)

**Claim.** "Full refill per level" is right and under-specified: `levelUp()` refills
HP **and** Chi **and** AP **and** duel tokens. Level cap 80 is enforced twice: XP is
simply not credited past it, and a level jump past it is treated as a cheat report.

**Cite.** `reference/decompiled/shs3_android/scripts/StatsManager.as:1646-1692` +
`:1619-1628` + `:76`; `LootDialog.as:644-647`.
```
StatsManager.as:76    public static var levelCap:int = 80;
StatsManager.as:1653  changeStat(STAT_SKILLPOINTS,1);
StatsManager.as:1653  changeStat(STAT_STATPOINTS,3);
StatsManager.as:1688  fullHealth();                                   // HP + Chi to max
StatsManager.as:1689  setStat(STAT_AP,getPlayerStats(STAT_MAXAP));    // AP to max
StatsManager.as:1690  setStat(STAT_DUELTOKENS,MAXDUELTOKENS);         // duel tokens to max
StatsManager.as:1619  if(!consoleEnabled && newlevel > levelCap) { …reportHack("changeXP levelcap"); }
LootDialog.as:644     if(StatsManager.getLevel() < StatsManager.levelCap) { this.lootXP.changeIntValue(num); }
```
**Also new:** an **auto-assign** mode exists (`autoAssignStats`, `StatsManager.as:1655-1687`)
that round-robins the 3 points through `[MAXHP, MAXCHI, ATTACK, DEFENSE, SPEED, MAXAP]`
starting at `getLevel() % 6` — absent from the ledger.
**Also new:** rebirth Dan is capped at 9 (`if(getPlayerStats(STAT_DAN) < 9) changeStat(STAT_DAN,1)`,
`StatsManager.as:2209`) ⇒ **10 Dan ranks (0–9)**, and rebirth pays `+5` gold, or `+20`
at Dan 8 (`:2201-2208`). *(Cross-lane gift: rebirth-elements blocker ③ "Dan-rank
count/titles (garbled source)" — the COUNT is now held; the titles are not.)*

---

### 12. `progression/def-mitigation-is-flat` — **HELD** (A2) · OVERTURNS blocker ① (DEF half)

**Claim.** There is **no DEF mitigation curve**. Defense is **flat subtraction from
incoming damage**, floored at the attack's own `minDamage`, with a single modifier:
**Heavy stance multiplies your defense by 0.8**.

**Ledger text overturned** (line 200): *"① DEF mitigation curve + SPD range/cooldown
scaling (wiki gives only direction) — *measure per-point deltas in a build.*"*

**Cite.** `reference/decompiled/shs3_payload/scripts/§1t99s0§.as:3284-3291` and `:3484-3488` (web):
```
internal function §1t4477s0§() : int
{
   if(this.stance == §1t12222s0§) { return defense * 0.8; }
   return defense;
}
…
_loc5_ -= this.§1t4477s0§();
if(_loc5_ < param2.§1t1088s0§()) { _loc5_ = param2.§1t1088s0§(); }
```
clear-named at `reference/decompiled/shs3_android/scripts/MCSPlayer.as:3231-3237` and `:3415-3419`:
```
internal function getDefense() : int
{
   if(this.stance == HEAVY_STANCE) { return defense * 0.8; }
   return defense;
}
…
damage -= this.getDefense();
if(damage < damageObj.getMinDamage()) { damage = damageObj.getMinDamage(); }
```
Independently corroborated by the resolved string table: skill 1002 *Heavy Stance
Mastery* desc ends **"Defense -20%"** (`docs/gauntlet/L0/index/resolved_names.json`,
skilldata id 1002).

---

### 13. `progression/spd-scaling` — **HELD** (A2) · OVERTURNS blocker ① (SPD half)

**Claim.** All three SPD transfer functions are held verbatim. SPD touches **reach**,
**slash-meter reload** and **skill cooldown** — never damage.

```
slash length (reach) : 120 + floor((90 + Dan*5) * spd / (20 + spd))     [both builds]
slash reload bar     : 48 + spd * 6                                     [both builds]
skill cooldown mult  : 1 - min(spd, 600)/600 * 0.5     ← WEB v0.717
                       1 - min(spd, 300)/300 * 0.5     ← ANDROID v0.682  (drift)
speed buff           : spd *= 1.5 before either curve
```

**Cite (web).** `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2276`,
`:2286-2296`, `:2344-2347`:
```
:2276  return 48 + (§1t7356s0§(§1t9410s0§) + §1t7358s0§(§1t9410s0§)) * 6;
:2295  return 1 - param1 / 600 * 0.5;
:2346  var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5;
:2347  return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));
```
**Cite (android, clear-named).** `reference/decompiled/shs3_android/scripts/StatsManager.as:1841`,
`:1854-1861`, `:1915-1919`:
```
:1841  return 48 + (getPlayerStats(STAT_SPEED) + findBonusStat(STAT_SPEED)) * 6;
:1860  return 1 - speed / 300 * 0.5;
:1917  var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
:1918  return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
```
**Cross-lane gift → L1 combat-core.** `120 + floor((90 + Dan*5)*spd/(20+spd))` is the
**base slash-length (reach) getter**. Combat-core's blocker ① ("reach cap in stage px
per stance — the one value the whole model needs") is a *stat* formula with a hard
floor of 120 and a Dan-0 asymptote of 210, per-stance modifiers applied on top.

**ATK, for completeness** (`StatsManager.as:1863-1886`): `minDamage = ATK +
weaponItem.mindamage`, `damageRange = weapon.maxdamage − weapon.mindamage` — the
ledger's `atkPlusWeapon` term is literal, and `ATTACK_DMG_PER_POINT = 3` in
`src/config/stats.ts` is consistent with claim 5.

---

### 14. `progression/xp-income-model` — **HELD** (A2) · OVERTURNS blocker ④

**Claim.** The full XP-income model is held: base XP per mob, a grey-level cutoff, an
over-level cutoff, symmetric under/over-level scaling, elite and low-level multipliers,
and a buff multiplier.

**Ledger text overturned** (line 200): *"④ full XP-income model (quest/gather/dungeon,
not just kills)."*

**Cite.** `reference/decompiled/shs3_android/scripts/NPC.as:166-190`:
```
public static function calcXP(playerLevel:int, mobLevel:int, xp:int, elite:Boolean) : *
{
   if(mobLevel <= getGreyLevel())      { return 0; }
   if(mobLevel - playerLevel > 3)      { return 0; }
   var finalXP:int = xp;
   if(playerLevel < mobLevel)      { finalXP = xp * (1 + 0.05 * (mobLevel - playerLevel)); }
   else if(playerLevel > mobLevel) { finalXP = xp * (1 - (playerLevel - mobLevel) / getZeroDifference()); }
   if(elite) { finalXP *= 2; }
   return finalXP;
}
```
plus, all first-hand:
- **base mob XP** `NPC.as:218` / `:252` — `this.xp = this.level * 2 + 20;`
  (web parity: `shs3_payload/scripts/§1t4574s0§.as:39` `xp = level * 2 + 20;`)
- **duellist / PvP base XP** `EnemyPlayer.as` + `ConnectionPIO.as:643` — `lvl * 5 + 45`
  (web parity: `shs3_payload/scripts/§1t4902s0§.as:26` `xp = level * 5 + 45;`) —
  already in config as `XP_PER_LEVEL=5` / `XP_REWARD_BASE=45` (`src/config/duel.ts:55-56`) ✓
- **new-player boost** `EnemyPlayer.as:1307-1327` (`rewardXP`, branch at `:1316`) — a duellist kill below player
  level 10 pays `calcXP(…, elite=false) * 3`; at level ≥10 it pays `elite=true` (×2):
```
if(playerlevel < 10) { …addLootXP(calcXP(StatsManager.getLevel(),level,xp,false) * 3); }
else                 { …addLootXP(calcXP(StatsManager.getLevel(),level,xp,true));      }
```
- **XP buff** `LootDialog.as:640-642` — `if(hasBuff(BUFF_XP) || hasBuff(BUFF_MODERATOR)) num *= 1.5;`
- **grey-level cutoff** `NPC.as:94-109` — `<6 ⇒ 0`; `<40 ⇒ L − floor(L/10) − 5`;
  `<60 ⇒ L − floor(L/5) − 1`; else `L − 9`
- **zero-difference ladder** `NPC.as:112-164` — 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17
  at level thresholds <8, <10, <12, <16, <20, <30, <40, <45, <50, <55, <60, ≥60

---

### 15. `progression/quest-xp-tabled` — **HELD** (A2)

**Claim.** Quest XP is not a formula but a table, and it is on disk: **69 `<exp>`
reward rows across the 61 quests, range 100–3000**, attached to quest *steps*.

**Cite.** `docs/gauntlet/L0/index/questdata.json` path `questdata/quest/step/reward/exp`
(count 69, numeric range 100.0–3000.0), and verbatim at
`reference/extracted/questdata.xml:214-216`:
```
    <reward>
      <exp>290</exp>
    </reward>
```
and `:411-413`:
```
    <reward>
      <exp>200</exp>
    </reward>
```
Consumed at `Overworld.as:318` — `overworldHUD.lootDialog.addLootXP(reward.exp);`

---

### 16. `progression/unlock-cadence-to-l80` — **HELD** (A2)

**Claim.** "Unlock cadence" is Ready only up to L10 in the ledger's evidence base
(both longplays stop there). The payload holds the **complete L3→L80 unlock ladder**
— 33 character-level gates — plus a 52-row skill **prerequisite graph** the ledger
never mentions.

**Cite.** `reference/extracted/skilldata.xml`, `<lvlreq>` rows (33), resolved against
`docs/gauntlet/L0/index/resolved_names.json`. Verbatim endpoints:
`skilldata.xml:257` `<lvlreq>3</lvlreq>` (id 1004 *Roll*) …
`skilldata.xml:1640` `<lvlreq>80</lvlreq>` (id 1055 *Mass Shadow Clone*).

Full ladder as measured this pass:
```
L 3 Roll · L 5 Focus, Skill Slots+, Carrying Weight+, Coin Purse+, Farming, Scavenging, Mining
L10 Throw Kunai · L15 Slash Wave, Lay Trap
L20 Smoke Bomb, Fire Breath, Ground Punch, Wind Combo, Water Stomp
L25 Chi Kick · L30 Windmill Shuriken · L35 Spirit Thief · L40 Flashbang · L45 Chi Burst
L50 Shadow Clone, Chi Charge, Inferno, Tsunami, Tornado, Earthquake
L55 Charged Shot · L60 Stealth · L65 Heavenly Sword · L70 Substitution Jutsu
L75 Deadly Touch · L80 Mass Shadow Clone
```
Prerequisite graph: `docs/gauntlet/L0/index/skilldata.json` paths
`skilldata/skill/req/has/id` (52) + `…/qty` (52, range 1–60).
Two of these gates are themselves progression systems:
`getSkillSlotCount() = 3 + getStat(1008)` and
`getCarryingWeight() = 100 + getStat(1009) * 20` (`StatsManager.as:2293-2295`, `:2298-2300`) —
the frame's `WEIGHT: 73 / 100` (claim 4) is the un-upgraded base ✓.

---

### 17. `progression/campaign-level-band` — **HELD** (A2)

**Claim.** The campaign's own intended level band is tabled: 142 `<wave><enemy><lvl>`
rows spanning **levels 2–35**, plus escort/ally `<friend><lvl>` up to 80. The
"both longplays cap at L10" observation is a *capture* limit, not a content limit.

**Cite.** `docs/gauntlet/L0/index/questdata.json`, path
`questdata/quest/step/wave/enemy/lvl` — count 142, numeric range 2.0–35.0;
`questdata/quest/step/wave/friend/lvl` — count 9, range 25.0–80.0;
`questdata/quest/step/roomobj/property/obj/property/xml/wave/enemy/lvl` — count 18, all 25.

---

### 18. `progression/ap-regen` — **HELD** (A2) · cross-lane gift to world-exploration

**Claim.** AP regenerates **+1 per 60 seconds** of server time, doubled by the AP
buff, hard-stopped at MAXAP. MAXAP starts at 30 and is a spendable stat (claims 5–6).

**Cite.** `reference/decompiled/shs3_android/scripts/StatsManager.as:158`
`internal static var APINTERVAL:int = 60;` and `:1090-1115`:
```
diff = Math.floor(timeDiff / APINTERVAL) + 1;
if(StatsManager.hasBuff(StatsManager.BUFF_AP)) { diff *= 2; }
newAP = changeAP(diff);
```
Web parity: `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:192`
`internal static const §1t9396s0§:int = 60;` (the same constant handed to
`setNextAPUpdate` inside the web `addMaxAP`).
*(This is world-exploration blocker ④ "AP regen rate + cap" — handing it over.)*

---

### 19. `progression/levels-81-99` — **STILL_UNHELD**

**Claim attempted.** Whether levels 81–99 were ever reachable. `expArray` carries 99
entries (up to 29,395,800) but `levelCap = 80` gates both XP credit and level-up, and
`getLevel()` would happily return up to 99. I can see the **data** exists past the
cap; I have **no artifact** showing the cap was ever raised, nor any UI, quest, item
or string referencing a level above 80.

**Honest verdict: STILL_UNHELD.** Treat entries 81–98 as dead headroom unless an
artifact says otherwise. Do not port them as reachable.

---

### 20. `progression/xp-from-gather-and-dungeon` — **PARTIAL**

**Claim attempted.** The ledger's blocker ④ names "quest/gather/dungeon" XP. Quest XP
is fully tabled (claim 15) and kill XP is fully formulated (claim 14). For **gathering**
(mine/farm/forage) I found the *consumer* side only — `XMLQuestOutcome.as:66`
`OverworldHUD.instance.lootDialog.addLootXP(this.modify);` and
`InventoryUI.as:906` `StatsManager.changeXP(item.modifierXML[i].value);` (an
XP-granting item modifier) — i.e. gathering XP, where it exists, arrives as a quest
outcome or an item modifier value, not a dedicated gather-XP formula. This is
consistent with video segment `A-04` line 32: *"XP bar unmoved at 2098/2950 (level 3)
for entire segment — no XP awarded from mining or quest steps shown."*

**Verdict: PARTIAL.** The plumbing is held; a dedicated "XP per gather action"
number is **not** held and, on the A-04 evidence, may not exist.

---

## Recommended ledger rewrite for §4 `### progression`

```
### progression — 88
- Ready: full L1–L99 XP table (payload, both builds byte-identical); level cap 80;
  +3 stat/+1 skill per level; full HP+Chi+AP+duel-token refill on level-up;
  per-point magnitudes HP+10/Chi+5/AP+5/ATK+3/DEF+3/SPD+3 (WEB build — frame-verified);
  per-stat level caps (271 = ATK/DEF/SPD at L80); free total respec; start pools
  HP10/Chi10/AP30/ATK1/DEF1/SPD1; SP = (level-1) + Dan*79 (79 first run, 790 lifetime,
  Dan capped at 9); complete kill-XP model (base lvl*2+20 / duellist lvl*5+45, grey-level
  cutoff, +3-level cutoff, ±scaling, elite x2, sub-L10 x3, buff x1.5); 69 tabled quest
  XP rewards; 33-gate L3–L80 skill unlock ladder + 52-row prerequisite graph;
  DEF = flat subtraction floored at attack minDamage, Heavy stance x0.8;
  SPD -> reach / reload / cooldown formulas; AP regen +1/60 s.
- Blockers: ① whether levels 81–99 (18 unused expArray entries) were ever reachable.
  ② dedicated gather/mine/farm XP values — plumbing held, numbers may not exist.
  ③ nothing else. Blockers ①–④ of the 2026-07-20 pass are all CLOSED.
- Surface: `src/config/xp.ts` XP_DELTA_STEP=500 is now REFUTED (-61.3% at L80) —
  replace the extrapolation with the real 99-entry table and delete the INFERRED label.
  Port progression numbers from shs3_payload (WEB v0.717); shs3_android v0.682 is a
  DECODER RING ONLY — it is differently tuned (see claim 5).
```

## Recommended §6 rewrite

Delete the line *"**L11–80 XP curve** — no table published; a solo build likely can't
reach L11+; keep the extrapolation labeled INFERRED."* It is held in full (claim 1).

---

*Surveyor note on method: every AS3 cite above was read in the file, not inferred from
a summary. The one place a frame and a payload disagreed (claim 5, Android per-point
magnitudes vs the on-screen level-4 stat panel) is called out explicitly and resolved
in the frame's favour, per the standing invariant.*
