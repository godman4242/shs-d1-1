# progression — CITE LENS (blind critic, run 3)

**Bottom line: 0 of 20 claims refuted.** I opened every cited artifact myself. Every
file exists, every anchor line number resolves, every quoted string appears verbatim,
and no claim asserts a name that only exists as a numeric ID. This is the cleanest
citation record I have audited in this gauntlet. What follows is (a) the per-claim
verification trail, (b) six real-but-minor cite defects that do not overturn anything,
and (c) seven findings the surveyor missed — two of which close a blocker in ANOTHER
lane outright.

---

## A. What I opened, and what it said

### The XP curve (claims 1, 2, 3, 4)

`grep -n` on `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as`:

```
362:      public static const §1t9470s0§:int = 80;
364:      public static const §1t5923s0§:Array = [0,550,1450,2950,5150,8350,…,29395800];
```

`reference/decompiled/shs3_android/scripts/StatsManager.as:76` `levelCap:int = 80`,
`:78` `expArray:Array = [...]`. Parsed both with Python:

```
len 99 · [11]=37400 · [20]=108000 · [40]=507300 · [60]=1508800 · [80]=4285800 · [98]=29395800
android identical: True 99
```

Duplicate confirmed at `§1t29s0§.as:28`. **Claim 1 HELD** — the L11–80 curve the ledger
put under §6 "structurally UNRECOVERABLE" (line 350) is a literal on disk in both builds.

`src/config/xp.ts:28` is `export const XP_DELTA_STEP = 500;` (grep-verified). I re-ran
the extrapolation from `src/core/xp.ts`'s own algorithm:

| L | real | shipped extrapolation | error |
|---|---|---|---|
| 11 | 37,400 | 37,400 | 0.0% |
| 12 | 43,500 | 43,900 | +0.9% |
| 20 | 108,000 | 113,900 | +5.5% |
| 40 | 507,300 | 428,900 | −15.5% |
| 60 | 1,508,800 | 943,900 | −37.4% |
| 80 | 4,285,800 | 1,658,900 | **−61.3%** |

**Claim 2 HELD**, to the decimal.

A3 check, `npx vitest run tests/xp.test.ts --reporter=verbose`:

```
 ✓ tests/xp.test.ts > XP_THRESHOLDS — the frame-backed L1–L10 table > pins all ten observed cumulative caps exactly 1ms
 ✓ tests/xp.test.ts > xpThreshold — cumulative cap to finish a level > extrapolates L11+ by growing the per-level delta by XP_DELTA_STEP (INFERRED) 0ms
 Test Files  1 passed (1)      Tests  11 passed (11)
```

Config table `[550,1450,2950,5150,8350,12150,16350,20900,25900,31400]` is byte-for-byte
`expArray[1..10]`. **Claim 3 HELD.**

**Claim 4 — I pulled the frames myself.** `ffmpeg -ss 1600 -i reference/videos/zFtCaTO0_1M.mp4`,
crop `iw*0.62:ih*0.55:iw*0.36:ih*0.10` @1.6× lanczos. Visibly in that crop: fan badge **4**,
gold bar **5110 / 5150** captioned EXPERIENCE POINTS, AVAILABLE STAT POINTS: **0**,
HP **20 / 20**, CHI **9 / 15**, AP **15 / 30**, ATK **10**, DEF **10 + 13** (orange),
SPD **4**, WEIGHT **73 / 100**, GOLD **3**. Same crop at `-ss 655`: badge **3**,
**2098 / 2950**, STAT POINTS **0**, WEIGHT **38 / 100**. 5150 = `expArray[4]`,
2950 = `expArray[3]`. **Claim 4 HELD — payload and frame agree; no adjudication needed.**

### Per-point magnitudes and the build split (claim 5)

I verified the decoder ring is real before trusting any web↔android mapping — the
obfuscated constants carry identical numeric values:

| web `§1t1523s0§.as` | value | android `StatsManager.as` |
|---|---|---|
| `§1t9403s0§` :206 | 1 | `STAT_MAXHP` :172 |
| `§1t9406s0§` :212 | 4 | `STAT_MAXCHI` :178 |
| `§1t9408s0§` :216 | 6 | `STAT_ATTACK` :182 |
| `§1t9409s0§` :218 | 7 | `STAT_DEFENSE` :184 |
| `§1t9410s0§` :220 | 8 | `STAT_SPEED` :186 |
| `§1t9411s0§` :224 | 10 | `STAT_LEVEL` :190 |
| `§1t9415s0§` :232 | 14 | `STAT_MAXAP` :198 |
| `§1t9418s0§` :238 | 17 | `STAT_SKILLPOINTS` :204 |
| `§1t9419s0§` :240 | 18 | `STAT_STATPOINTS` :206 |
| `§1t9426s0§` :254 | 25 | `STAT_DAN` :220 |

`§1t9609s0§` (web :2807) is `changeStat(MAXAP, n)` — i.e. `addMaxAP`, matching android
`:2361`. So web `§1t9609s0§(5)` really is **+5 max AP**, and the ledger's "+1AP" really
is wrong. The frame arbitration reproduces exactly: at L4 the 9-point budget
`(4−1)×3` buys HP 20 (1pt) · Chi 15 (1pt) · AP 30 (0) · ATK 10 (3pt) · DEF 10 (3pt) ·
SPD 4 (1pt) = **9** under web magnitudes; **24** under android's. **Claim 5 HELD**, and
it is the load-bearing claim of the whole lane — everything downstream depends on
"port from web, use android only as a decoder ring."

### Caps, respec, rebirth, SP (claims 6–11)

`§1t5957s0§.as:3341-3346` reads exactly as quoted; `:3344` is
`< 1 + (_loc2_ + 10) * 3` and `_loc2_` is `getStat(§1t9411s0§)` = `STAT_LEVEL`.
1+(80+10)×3 = **271**. **Claims 6 and 7 HELD.**

`§1t1523s0§.as:2577` `§1t7357s0§(§1t9419s0§,(getLevel() - 1) * 3);` ✓ ·
`:2598` `§1t7357s0§(§1t9418s0§,getLevel() - 1 + §1t7356s0§(§1t9426s0§) * (§1t9470s0§ - 1));` ✓ ·
android `StatsManager.as:2156` clear-named counterpart ✓. **Claims 8, 9 HELD.**

`doRebirth()` at `StatsManager.as:2195` calls `unAssignStatPoints()` (:2229) and **not**
`unAssignSkillPoints()` — verified by reading the whole function. Dan gate `< 9` at :2209,
HGOLD +20/+5 at :2203/:2207. The surveyor's lane_impact is correct.

**Claim 10 I tried hardest to break.** If any quest, item or event granted skill points,
"79" would be a floor, not a total. It does not: the only three writers of
`STAT_SKILLPOINTS` in the entire android bundle are `:711` (new char = 0), `:1652`
(+1 per levelUp) and `:2156` (the respec closed form). `questdata.json` shows quest
`reward` carries only `exp` (69) and `loot` (19) — no skill-point path.
**79 is right; the ledger's "80 SP first run" is off by one. HELD.**

`levelUp()` at `:1646`: `changeStat(STAT_SKILLPOINTS,1)` `:1652`,
`changeStat(STAT_STATPOINTS,3)` `:1653`, then `fullHealth()` `:1689` (which sets HP **and**
Chi, `:1698-1699`), `setStat(STAT_AP,maxAP)` `:1690`, `setStat(STAT_DUELTOKENS,MAXDUELTOKENS)`
`:1691`. **Claim 11 HELD** (see defect D3 and finding N5 for two corrections).

### DEF and SPD (claims 12, 13)

Every line exact. Web `§1t99s0§.as:3284-3291` `getDefense`, `:3484-3488` the subtraction
and floor; android `MCSPlayer.as:3231` / `:3415`. Corroborated independently by the
resolved string table: skill 1002 "Heavy Stance Mastery" desc ends `Defense -20%`.
**Claim 12 HELD.**

SPD, all six anchors grep-verified:
`StatsManager.as:1841` reload `48 + spd*6` · `:1860` `1 - speed / 300 * 0.5` ·
`:1915-1918` slash length · web `§1t1523s0§.as:2276` · `:2295` (`/600`) · `:2346-2347`.
The web/android cooldown divisor really does differ (600 vs 300) and the surveyor
flagged it. Dan-0 asymptote 120+90 = 210, floor 120. **Claim 13 HELD.**

### XP income, quests, unlocks (claims 14–18)

`NPC.as:166-190` calcXP, `:94-109` getGreyLevel, `:218` and `:252` `xp = level*2+20`,
web parity `§1t4574s0§.as:39`; duellist `ConnectionPIO.as:643` and web `§1t4902s0§.as:26`
both `lvl * 5 + 45`; `EnemyPlayer.as:1316` the sub-10 ×3; `LootDialog.as:640-642` the
×1.5 buff and `:644` the levelCap gate. `src/config/duel.ts:55-56` really are
`XP_PER_LEVEL = 5` / `XP_REWARD_BASE = 45`. **Claim 14 HELD** (and see N3 — I found the
web parity the surveyor omitted).

`questdata.xml:214-216` and `:411-413` are the `<reward><exp>290|200</exp></reward>`
rows quoted; index path `questdata/quest/step/reward/exp` = 69 rows, range 100–3000.
**Claim 15 HELD.**

**Claim 16 I reconstructed from scratch** rather than trusting the list. Parsing
`skilldata.xml` and joining `docs/gauntlet/L0/index/resolved_names.json`:

```
L3 Roll · L5 Focus, Skill Slots+, Carrying Weight+, Coin Purse+, Farming, Scavenging, Mining
L10 Throw Kunai · L15 Slash Wave, Lay Trap · L20 Smoke Bomb, Fire Breath, Ground Punch,
Wind Combo, Water Stomp · L25 Chi Kick · L30 Windmill Shuriken · L35 Spirit Thief
L40 Flashbang · L45 Chi Burst · L50 Shadow Clone, Chi Charge, Inferno, Tsunami, Tornado,
Earthquake · L55 Charged Shot · L60 Stealth · L65 Heavenly Sword · L70 Substitution Jutsu
L75 Deadly Touch · L80 Mass Shadow Clone          total gates 33
```

Identical to the surveyor's list, name for name, gate for gate. `getSkillSlotCount()`
`:2293-2295` and `getCarryingWeight()` `:2298-2300` are exactly as quoted.
**Claim 16 HELD** (see defect D6 on build labelling).

Index confirms `wave/enemy/lvl` 142 rows range 2–35, `wave/friend/lvl` 9 rows range
25–80, `roomobj/…/wave/enemy/lvl` 18 rows all 25. **Claim 17 HELD** (see D5).

`StatsManager.as:158` `APINTERVAL:int = 60` (grep-exact), web `§1t1523s0§.as:192`
`§1t9396s0§:int = 60`, `regenAP` at `:1091` with the catch-up `floor(timeDiff/60)+1`,
`×2` buff, and the `newAP >= maxAP → setStat(STAT_AP,maxAP)` stop. **Claim 18 HELD.**

### The two honest unknowns (claims 19, 20)

`XMLQuestOutcome.as:66` and `InventoryUI.as:906` both resolve exactly.
`docs/research/video-study/segments/A-04-mines-takahasi-coal-mining-quest.md` **line 32**
is verbatim: *"XP bar unmoved at 2098/2950 (level 3) for entire segment — no XP awarded
from mining or quest steps shown."* PARTIAL is the correct verdict. `itemdata/item/minlvl`
tops out at 79, consistent with "nothing references a level above 80."
**Claims 19, 20 accepted as honest.** N7 below upgrades 19 from STILL_UNHELD to a lead.

---

## B. Cite defects found (real, all minor — none overturns a claim)

- **D1 — the frame crop in claim 4 is mis-stated.** I ran the stated crop
  (`crop=iw*0.55:ih*0.20:iw*0.42:ih*0.16`) verbatim: it yields a 1056×216 band that
  contains the XP bar and HP/CHI rows and **cuts off AP, SPD and WEIGHT entirely**.
  All the readings are nonetheless real — I confirmed every one with a taller crop
  (`ih*0.55` at `ih*0.10`). §0 requires stating the crop you used; state the one that
  actually contains the evidence.
- **D2 — android sub-line labels in claim 5 are off by one for four of six handlers.**
  `addMaxAP(1)` is `:2432` not `:2431`; `STAT_ATTACK,1` is `:2439` not `:2438`;
  `STAT_SPEED,1` is `:2453` not `:2452`. Cause: `HPaddHandle`/`CHIaddHandle` put the
  stat write first, the other four put `STATPOINTS,-1` first, and the numbers look
  arithmetically derived rather than read. The cited range `2417-2453` contains
  everything, so nothing is lost.
- **D3 — same drift in claim 11.** `fullHealth()` is `:1689` (claim says 1688),
  `setStat(STAT_AP,…)` `:1690` (says 1689), `setStat(STAT_DUELTOKENS,…)` `:1691`
  (says 1690). Range `:1646-1692` covers them.
- **D4 — claim 18's quote labels lines 1099-1103; the content is at 1100-1105.** The
  anchor cites (`:158`, web `:192`) are exact.
- **D5 — claim 17 says it overturns "both longplays cap at L10."** That sentence is
  *true* and stays true; what the 142 quest-wave rows overturn is the *inference* drawn
  from it. The surveyor's own lane_impact says this correctly — the `overturns_ledger`
  flag overstates it. (Blocker ② dies anyway, via claim 1.)
- **D6 — claim 16 lists 33 skill NAMES without labelling the build.** Every name is
  correct, but they resolve through `118_Mobile_Lang_EN.bin`, the **Android v0.682**
  string table. S0-3 explicitly requires labelling which build a ported string came
  from — and this same lane's claim 5 is the proof that v0.682 is differently tuned.
  Label the ladder "names: Android v0.682 string table; gates: web-parity XML."

Also worth noting on **claim 6**: the cite is the `+` button's `.visible` gate, so the
formula caps the **assignable base stat**, not the displayed total. The t=1600 frame
shows `DEF 10 + 13` — gear rides on top of the cap. Claim 7 scopes this correctly
("a hard per-stat UI ceiling"); claim 6's bare "Stats are hard-capped" would mislead
anyone who implements a clamp on base+gear. State it as an assignment cap.

---

## C. Seven things the surveyor missed

**N1 (biggest — kills a blocker in another lane).** Claim 12 says DEF is flat
subtraction "with exactly one modifier." True for *physical* damage only. Elemental
damage is a **parallel four-channel pipeline that never touches `getDefense()`**:

```
MCSPlayer.as:3347  var fireDamage:int  = damageObj.fireDamage  - STAT_FIREDEF;
MCSPlayer.as:3348  var waterDamage:int = damageObj.waterDamage - STAT_WATERDEF;
MCSPlayer.as:3349  var windDamage:int  = damageObj.windDamage  - STAT_WINDDEF;
MCSPlayer.as:3350  var earthDamage:int = damageObj.earthDamage - STAT_EARTHDEF;
   … each floored at 1 if the attack carried that element, else clamped to 0 (:3351-3357)
MCSPlayer.as:3415  damage -= this.getDefense();          ← physical only
MCSPlayer.as:3420  setHP(getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
```

And the per-element defenses are **cross-wired to the opposite element's ATK stat**:

```
StatsManager.as:1836  player.initElementDefenseStats(
    getPlayerStats(STAT_WATERATK) + findBonusStat(STAT_FIREDEF),    // fireDef  ← waterAtk
    getPlayerStats(STAT_EARTHATK) + findBonusStat(STAT_WINDDEF),    // windDef  ← earthAtk
    getPlayerStats(STAT_WINDATK)  + findBonusStat(STAT_WATERDEF),   // waterDef ← windAtk
    getPlayerStats(STAT_FIREATK)  + findBonusStat(STAT_EARTHDEF));  // earthDef ← fireAtk
```

Web parity is exact — `§1t1523s0§.as:2270` with the same argument order, and the
constants match one-for-one (`§1t1235s0§`=28=FIREATK … `§1t1242s0§`=203=EARTHDEF vs
android `:226`–`:256`). That is the counter-wheel **Water▸Fire, Earth▸Wind, Wind▸Water,
Fire▸Earth**, and it is **rebirth-elements blocker ② "elemental ATK-vs-DEF formula"**
(REBUILD_READINESS.md:205) — held, in both builds, formula and all.

**N2 — there is a SECOND progression curve, two lines below the one the surveyor read.**
`§1t29s0§.as:28` is the character expArray the surveyor cited; `§1t29s0§.as:30` is
`§1t12498s0§:Array = [0,300,900,2100,4800,10200,21000,42600,85800,172200,345000]`, an
11-entry cumulative curve with its own cap `§1t12495s0§:int = 10` at `:20`, its own
level lookup (`:299`), its own "XP to next" (`:328`), its own bar fraction (`:347`) and
its own clamp (`:396-406`). **No android counterpart** — `grep -rn "0,300,900,2100,4800"
reference/decompiled/shs3_android/scripts/` returns nothing. Which track it belongs to
is STILL_UNHELD; that a second 10-level XP track *exists* is held, and the ledger's
progression block has no second track at all.

**N3 — the XP-income model has full WEB parity; the surveyor left it android-only.**
Given this lane's own finding that v0.682 is differently tuned, sourcing claim 14
almost entirely from android was the weak spot. It isn't one:
`§1t68s0§.as:185` `§1t12070s0§(param1,param2,param3,param4)` is calcXP verbatim —
`:187` grey cutoff, `:191` the +3 cutoff, `:198` `* (1 + 0.05 * (param2 - param1))`,
`:202` `* (1 - (param1 - param2) / §1t12069s0§())`, `:205-207` elite `*= 2`. And
`§1t68s0§.as:113-129` is getGreyLevel verbatim (`<6⇒0`, `<40⇒L−⌊L/10⌋−5`,
`<60⇒L−⌊L/5⌋−1`, else `L−9`). The S0-3 parity caveat is discharged for this system.

**N4 — the complete new-character table is on disk; the ledger's "start pools
(HP10/Chi10/AP30)" bullet is a third of it.** `StatsManager.as:695-714`:
MAXHP 10 · **HPREGEN 1** (`:696`) · CHI/MAXCHI 10 · **CHIREGEN 1** (`:699`) ·
ATK/DEF/SPD 1 · XP 0 · LEVEL 1 · **GOLD 100** (`:705`, = the COINS currency) ·
**HGOLD 0** (`:706`, = the "GOLD" medallion the t=1600 frame shows as `GOLD 3`) ·
AP/MAXAP 30 (`:708`) · **DUELTOKENS/MAXDUELTOKENS 20** (`:709-710`) · SKILLPOINTS 0
(`:711`) · STATPOINTS 0 · **LOCATION 8382465** (`:713`) — the same node id `doRebirth`
teleports to at `:2230`, i.e. rebirth returns you to the character-creation spawn.

**N5 — correction to claim 11's duel-token refill.** `levelUp()` sets tokens to the
class constant `MAXDUELTOKENS` — and `StatsManager.as:166` is
`internal static var MAXDUELTOKENS:int = 30;`, while a new character starts at
`STAT_MAXDUELTOKENS = 20` (`:710`). So the **first level-up raises the token pool from
20 to 30**. Port the constant 30, not the stat.

**N6 — a second, independent level confirms the web per-point magnitudes.**
`A-04-mines-takahasi-coal-mining-quest.md` line 29 (t=10:55, primary video): *"HP 20/20,
CHI 10/10, AP 30/30, ATK 7, DEF 7 (+2 from equipment), SPD 4, 'AVAILABLE STAT POINTS: 0'"*
— and line 32 pins the same session at level 3 (I re-confirmed level 3 / STAT POINTS 0 /
WEIGHT 38/100 in my own t=655 crop). Budget `(3−1)×3 = 6`. Web magnitudes cost
`1+0+0+2+2+1 = 6` ✓; android magnitudes cost `2+0+0+6+6+3 = 17` ✗. Better still, the
L3→L4 delta between the two panels is ATK +3, DEF +3, Chi +5 = exactly **3 points** =
the per-level grant. Claim 5's arbitration now rests on two levels, not one.

**N7 — a real lead on claim 19 (levels 81–99), enough to move it off STILL_UNHELD.**
`§1t29s0§.as:350-358` (`§1t550s0§`) clamps its accumulator at
`int(§1t5923s0§[§1t1523s0§.§1t9470s0§])` = `expArray[80]` = **4,285,800**, and `:361-372`
clamps a level-parameterised variant at `min(param2, levelCap)`. Combined with android
`changeXP`'s `newlevel > levelCap → reportHack("changeXP levelcap")` (`:1619`) and
`LootDialog.as:644`'s `getLevel() < levelCap` gate, the shipped builds have three
separate stops before index 81. **But I am not closing it:** `§1t29s0§` is the XP-bar
MovieClip (`[Embed(source="/_assets/assets.swf", symbol="symbol2123")]`) and its index
`§1t24s0§.§1t8755s0§` is **0**, a bar slot, not `STAT_XP` (=9) — so this clamps the
*bar*, not provably the stored stat. PARTIAL, not HELD. Treat `expArray[81..98]` as
dead headroom, as the surveyor already advised.

---

## D. Verdict on the score

88 is defensible and if anything conservative. N1 and N3 both strengthen the lane; N2
and N7 are the only things that argue *against* raising it, and both are honest
unknowns rather than errors. The six cite defects are all clerical and all contained
within ranges the surveyor cited correctly. No claim in this unit is refuted.
