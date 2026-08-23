# t1-overturns-03 — CITE LENS (blind critic s27d)

**Packet:** `docs/gauntlet/L0/worklist/t1-overturns-03.json` · 7 findings, all `overturns_ledger = true`, all machine-audited `RESOLVES`.
**Judged:** 7 / 7. **Skipped:** none.
**Result:** 7 upheld, 0 refuted. 1 minor mis-cite flagged inside an upheld finding. 2 new findings.

This is an unusual packet. Seven survivors out of seven is a number I would normally distrust, so I say up front
*why* it happened rather than asking anyone to take it: every one of these findings cites **decompiled ActionScript
from the target build**, and AS3 does not admit interpretation. There is no crop to argue about and no ledger to
work second-hand from. I opened all 14 distinct files, matched every quoted line character-for-character, and
in six of the seven cases went and opened **the link the finding asserted but did not cite** — which is where an
over-claim would actually be hiding. None of them broke. Where a finding hedged, it hedged honestly.

---

## 1. `hunter-s27b/the-reach-cap-in-stage-px…` — **UPHELD**, overturn holds

Ledger target: RR:190 combat-core blocker ① *"reach cap in stage px per stance (the one value the whole model
needs) — measure blade-FX tip-to-body span … from footage."*

Quotes verbatim at `§1t99s0§.as:3094` (`* 1.4`), `:3105` (`* (1 + 0.2 * §1t4422s0§ * 0.1)`), `:3116-3119`
(`* (0.5 + 0.4 * §1t4423s0§ * 0.1)` with the hard clamp to 100).

The finding's weight rests on two links it *asserts*. I checked both:

- **`§1t4420s0§` really is `baseSlashLength`.** `:105` declares it `= 10`; `:194` assigns it from `param10`;
  and `§1t1523s0§.as:2268` passes `§1t9592s0§()` in **argument slot 10** of the initPlayer twin. The android
  line has that same slot named `baseSlashLength` (`MCSPlayer.as:182` signature, `:193` assignment,
  `StatsManager.as:1834` call). Slot-for-slot.
- **The formula is the same function in both builds.** `§1t1523s0§.as:2344-2348` is
  `var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5; return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));`
  and `StatsManager.as:1915-1918` is the identical body with the ids resolved:
  `var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5; return int(120 + Math.floor(maxincrement * speed / (20 + speed)));`,
  preceded by the `if(hasBuff(BUFF_SPEED)) speed *= 1.5;` the finding cites at `:2336-2341`. So its
  "`§1t9426s0§` = STAT_DAN, `param1` = SPD" is **derived, not guessed**.

One improvement on the finding: it proves the "length budget, not hitbox radius" semantics from *android*
`InputManager`. It doesn't have to. The **web** twin `§1t1541s0§.as:51` carries the same unobfuscated
`internal static var maxDistance:int = 200;` and `:106` is the setter invoked from `§1t99s0§.as:3158`. The
semantics are web-native.

Arithmetic re-derived: dan 0 → base 120 px at SPD 0, asymptote 210 px; **Light 168-294, Balanced 120-252,
Heavy max(100, 60-189)**, +5 px asymptote per dan. Matches.

**Blocker ① closes as CONTRACT and the "measure it from footage" close-path should be struck.** Two residual
notes that do *not* refute: the ranges assume mastery 10 (settled in §7 below), and the model omits the INJURED
×0.5 on `baseSlashLength` (new finding B).

> The finding's `lane_impact` also re-reads RR:155's `reach 300/200/100` as "Light-at-max / Balanced-at-base /
> Heavy FLOOR". Light-at-max computes to **294**, not 300, and Balanced-at-base to **120**, not 200. That reading
> is speculative and should not be carried into the ledger; the formulas should. It is a rider, not the claim,
> so it does not touch the verdict.

## 2. `lens3/271-is-reachable-in-one-stat…` — **UPHELD**, overturn holds

Ledger target: RR:201 *"The '271 cap' is gear/rebirth-inclusive (237-point first-run budget makes it impossible
in one stat)."*

All four quotes verbatim: `:3344` `< 1 + (_loc2_ + 10) * 3`, `:3422` `(…§1t9408s0§,3)`, `:3457`
`(… §1t9408s0§) - 1) / 3`, `:3461` `(getLevel() - 1) * 3`.

The load-bearing unstated step is **"`_loc2_` at `:3340` is the level."** If that were the Dan rank the whole
271 falls apart. It is the level: the android twin of the identical six-line visibility block opens with
`var charlevel:int = StatsManager.getStat(StatsManager.STAT_LEVEL);` (`InventoryUI.as:2406`) followed by the same
six `.visible` assignments at `:2407-2412`. So `§1t9411s0§` = `STAT_LEVEL`.

Then it is pure arithmetic and it is decisive: base 1, step 3, cap `1 + 90*3 = 271` under a **strict `<`**, so the
ladder 1, 4, … 268 grants once more and lands exactly on 271, costing `(271-1)/3 = 90` of a `(80-1)*3 = 237`
budget. **147 points to spare.**

Both halves of the parenthetical die, not just the one the finding names: the cap is not gear-inclusive either,
because `:3344` tests `§1t9714s0§` (base `getStat`) while the gear bonus `§1t7358s0§` is added separately at
`§1t1523s0§.as:2268`.

## 3. `lens3/coins-per-kill-half-of-RR215…` — **UPHELD**, overturn holds

Ledger target: RR:215 blocker ① *"coins-per-kill reality (`=8` is an unconfirmed INFERRED seed; 20+ samples show
no XP formula either)."*

Quotes verbatim on both sides (`§1t68s0§.as:863/:867`, `NPC.as:839/:843`). But the lines that actually kill the
"=8 seed" are the twenty the finding *didn't* quote, and I opened them: `:820-828` walk `this.reward.loot`,
read type / qty / `chance` per entry, and roll
`if(_loc6_ == 100 || Math.random() * 100 < _loc6_)`. Coins per kill in v0.717 is a **per-NPC rolled loot table**
paying 1× or 5× qty. A constant 8 is not in the code.

The finding also asserts the **XP** half already fell elsewhere. I refused to take that on trust and checked:
`NPC.as:218` `this.xp = this.level * 2 + 20;` and `:166` `calcXP(playerLevel, mobLevel, xp, elite)` with the
level-difference scaling at `:179`/`:183`, consumed at `:863`. The formula exists. **Delete the whole blocker,
not half of it** — which is precisely what the finding asked for.

*Caveat recorded:* coins is proven web-side; the XP formula I verified is android v0.682.

## 4. `lens3/reinforce-tiers-are-web-code…` — **UPHELD**, overturn holds · ⚠ one minor mis-cite

Ledger target: RR:80 *"Reinforce 5000c+1 silver ore."*

This is the strongest evidence class this lane can produce — **web build, in code, literals** — and it all
resolves: `§1t401s0§.as:1087 'cost = 5000;'`; `:1105` reads `weapon.getLevel()` with `:1106-1108` forcing itemID
13022 to level 59; three demand-and-spend branches at `:1110/:1112/:1120` (20064, <30), `:1122/:1124/:1132`
(20065, <60), `:1134/:1136/:1144` (20066, else); then `:1146` charges `-cost` and `:1147` sets `weapon.uses = 0`.
`itemdata.xml` `<id>20064</id>` at `:10420`, 20065 at `:10429`, 20066 at `:10438`; `strings.json` gives
`4241` = *Silver Ore*, `4242` = *Titanium Ore*, `4243` = *Uncut Diamond* — I read all three back out of the index.

The **S0-3 android hedge is genuinely discharged here**, because the tier selection itself is web code, not a
string-table inference.

⚠ **The nit.** The `quote` field says `itemdata.xml:10421 '<name>4241</name>'`. Line 10421 is `<type>12</type>`;
`<name>4241</name>` is at **:10422**. The declared cite range `10418-10442` does contain it and the id→name
mapping is right, so this is an off-by-one in a supporting detail, not a mis-cite that changes the claim.
**Fix the number when the row is written into the ledger** — citeLint on the ledger will otherwise flag it.

## 5. `lens3/web-parity-for-the-6x6-war-board…` — **UPHELD**, overturn holds (with the finding's own scope)

Ledger target: RR:245 blocker ② *"War-Room map topology (board/adjacency)."*

I reproduced the grep the whole claim rests on. `§1t7835s0§` appears **exactly twice** in the entire payload: the
declaration at `§1t7785s0§.as:162` (`param4:int = 6, param5:int = 6`) and the single call site
`§1t6483s0§.as:588` `this.§1t8003s0§.§1t7835s0§(param1,param3,param4);` — **three arguments**, both dimension
defaults taken. So ht = wt = 6 in v0.717 by default parameter, with no literal in the web class at all. That
distinction is exactly the kind of thing a citation audit trips over, and recording it is a service.

The structural-twin argument survives inspection too: web `:200-204` bound by param5/param4 sit where
`WarHexUI.as:199-202` bound by wt/ht do, and pitch/origin match line-for-line (`x = 90 + i * 55`,
`y = 92 + j * 55` on both sides). Android's `this.ht = 6;` / `this.wt = 6;` at `:175-176` are indeed its only two
*assignments*; every other `ht`/`wt` hit is a read.

**Ledger edit, scoped as the finding itself scopes it:** the **board** half of blocker ② closes at the target
build (6×6, 55 px pitch, origin 90,92). Per-hex ownership/exit state still comes from `territoryData`
(`§1t7785s0§.as:211` / `WarHexUI.as:209`), so the blocker is rewritten, not deleted.

## 6. `s27b/a-territory-is-six-rooms-by-six-rooms…` — **UPHELD**, overturn holds

Ledger target: RR:225 blocker ⑤ *"sector↔room mapping rule (town=fixed sector vs wilderness=one-screen-per-sector)."*

Quotes verbatim at `WarHexUI.as:195-197, :208`, web twin at `§1t7785s0§.as:196-198` + `:210`.

The step this one asserts without opening is `getShiftedNodeId`, and it is the step the whole formula depends on.
I opened it — `NodeGenerator.as:1780-1789`:

```
var xpart:int = (currentNodeID >> 12 & 0x0FFF) + shiftX;
var ypart:int = (currentNodeID & 0x0FFF) + shiftY;
…
return xpart << 12 | ypart;
```

which makes the packed id exactly `(sectorX*6 + i) << 12 | (sectorY*6 + j)` — the formula the finding states,
now grounded. That a node **is a room** is settled by the consumer: `:209` calls
`NodeGenerator.instance.getRoomBG(nodeid)`, declared at `:1570`.

So a territory occupies a 6×6 block of room node ids: **36 rooms per sector, uniformly.** That answers the
blocker and refutes the "one-screen-per-sector" alternative it holds open. Narrow parity caveat: the loop is
android, but the web transform at `§1t7785s0§.as:196-198` is byte-equivalent.

## 7. `s27b/stance-ceilings-are-mastery-10-not-mastery-9` — **UPHELD**, overturn holds, **and I closed its open fork**

Ledger target: RR:155 *"The stance tables (dmg 0.9/1.2/1.4 …) are MASTERY-9 CEILING values."*

Verbatim: `:3262` `(0.5 + 0.4 * §1t4421s0§ * 0.1)`, `:3265` `(1 + 0.2 * §1t4422s0§ * 0.1)`, `:3270` flat `1.4`
(shared by three cases), `:3116` heavy reach on the same shape. Field ids check out: `:107/:109/:111` declare the
three in the slot order the android twin names `lightMastery` / `balancedMastery` / `heavyMastery`.

0.5 + 0.04m → **0.86 at m=9**, 0.90 at m=10. 1 + 0.02m → **1.18 at m=9**, 1.20 at m=10. The `-9` label cannot
stand beside these formulas on either horn of the finding's fork. Overturn holds.

The finding then said, honestly, that the mastery cap is `STILL_UNHELD` from that file alone. **It is held from
another one** — see new finding A. The fork resolves to the first horn.

---

# NEW FINDINGS

## A. Mastery runs **1 to 10** — so RR:155's *floor* is wrong too, not just its ceiling label

`skilldata.xml` skills **1000** (`:4`), **1001** (`:83`), **1002** (`:162`) — the three passive stance masteries
fed to `initPlayer` as `getStat(1000/1001/1002)` — each carry **exactly ten `<level>` rows valued 1…10**. The cap
is 10, so 0.90 and 1.20 are real, reachable ceilings and the ledger's `-9` is a plain off-by-one.

And the floor is **1, not 0**: the web build seeds all three at value 1 —
`§1t1523s0§.as:1058-1060` `push(new §1t100s0§(1000,1))` / `(1001,1)` / `(1002,1)`, mirrored at `:2586-2588`.

So RR:155-156's *"A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 … Heavy's reach also scales ×0.5→×0.9"*
is wrong at **both** ends. The real domain is m ∈ [1,10]:

| | m=1 (fresh) | m=10 (cap) |
|---|---|---|
| Light dmg `0.5 + 0.04m` | **×0.54** | ×0.90 |
| Balanced dmg `1 + 0.02m` | **×1.02** | ×1.20 |
| Heavy dmg | ×1.4 flat | ×1.4 flat |
| Heavy reach `0.5 + 0.04m` | **×0.54** | ×0.90 |

**Ship the two formulas, not the triple.** This also kills the RR:157 escape hatch *"decide-and-flag: the build
targets mastery-9"* — there is a curve, and it is two lines of code.

*(Caveat: the ten-row count is android-sourced `skilldata.xml` per correction C2. The formulas and the seed value
are web v0.717. The two agree that the design tops out at exactly 0.9/1.2 at m=10, which is not a coincidence a
0-9 scale can produce.)*

## B. The **INJURED** debuff halves reach — and no reach finding carries it

Found while auditing finding 1, which builds the entire stage-px model out of `baseSlashLength` and never
mentions that a status effect halves it. Immediately after the buff chain at `§1t99s0§.as:215-218`, the web
player init runs `else if(§1t1523s0§.§1t9725s0§(§1t1523s0§.§1t9463s0§))` and applies **three** halvings:

```
:221  this.minDamage *= 0.5;
:222  this.defense   *= 0.5;
:223  this.§1t4420s0§ *= 0.5;     // baseSlashLength
```

The android twin `MCSPlayer.as:218-223` names the branch `StatsManager.hasBuff(StatsManager.BUFF_INJURED)`,
which is what identifies the obfuscated `§1t9463s0§`.

Consequences for the row that comes out of RR:190 ①: INJURED is a ×0.5 on **`baseSlashLength`**, so it scales
every stance at once — Light drops to 84-147 px, Balanced to 60-126, Heavy to its 100 floor across the whole
range. It applies at init, *before* the stance branch at `:3094/:3105/:3116` reads the field, so it composes
multiplicatively and the Heavy clamp still fires last. It is also **exclusive** with the speed-buff branch
(`else if`) — the same field the SPD ×1.5 feeds through.

Free bonus: the same three lines are CONTRACT values for the injured **damage** and **defense** penalties
(both ×0.5), which combat-core and enemies-ai currently lack.

---

## Discipline notes

- **No ledger-vs-frame conflict arose in this packet** — it is entirely A2 code evidence, no visual claims. The
  standing "frame wins" invariant was never engaged.
- **C2 respected.** Two upheld findings lean partly on android artifacts; both are flagged in their verdicts.
  Findings 2, 4 and 7 are web-native and *discharge* android hedges rather than inheriting them — finding 4
  explicitly so.
- **Over-refusal risk considered.** Finding 7 declares its own key input `STILL_UNHELD`; I treated that as the
  correct answer under §0, upheld it, and closed the gap myself rather than penalising the honesty.
