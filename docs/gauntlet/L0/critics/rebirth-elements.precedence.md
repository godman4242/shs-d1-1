# rebirth-elements — PRECEDENCE LENS critic (blind)

Reviewer opened every artifact first-hand. No verdict below rests on the surveyor's text.

**Headline:** this is a strong survey. 17 of 19 claims survive verbatim re-reading, several are
more precise than they needed to be. Two claims fail, both for the same root cause: **a
symbol/scope error that a second lookup would have caught.**

- **Claim 7 (`tenth-gold-is-100`) — REFUTED, material.** The AS3 is quoted correctly but the
  *currency is misidentified*. Stat 12 is **Heavenly Gold** (premium/PayVault), not gold/coins.
- **Claim 17 (`stance-slash-multipliers-parity`) — REFUTED, material.** The "zero hits in the
  desktop tree" negative grep is unsound. The v0.717 formulas **do exist**, in the obfuscated
  MCSPlayer, and they **differ**. Parity is not *unestablished* — it is *disproven*.

Claim 17's failure turned out to be the most productive thread in the lane: chasing it recovered
the real v0.717 stance numbers and overturned a separate ledger claim (§3 item 3).

---

## 1. Claim 7 — rebirth pays HEAVENLY GOLD, not gold

The quoted block at `§1t1523s0§.as:2644-2652` is verbatim correct. The mapping
`§1t9413s0§ = 12` is also correct (`:228`). But 12 is not the coin purse:

```
StatsManager.as:192   internal static var STAT_GOLD:int  = 11;
StatsManager.as:194   internal static var STAT_HGOLD:int = 12;
```

Stat 12's accessors name it outright, and they are wired to the microtransaction vault:

```
StatsManager.as:2668  public static function getHeavenlyGold() : int
StatsManager.as:2674     hgold += QueryManagerPIO.instance.getPayVaultCoins();
StatsManager.as:2679  public static function addHeavenlyGold(num:int) : *
StatsManager.as:2698     QueryManagerPIO.instance.debitPayVaultCoins(deductgold, ...)
```

I read the whole desktop `doRebirth` body: it writes **only** stat 12. It never touches stat 11.
So the +25 / +100 is premium hard currency, and rebirth grants **no coins at all**.

Why this matters rather than being pedantry — the repo's config binds these names to coins:

```
tests/config-values.test.ts:521  expect(REBIRTH).toEqual({ earlyGold: 25, tenthGold: 100, ... });
tests/progression.test.ts:183    expect(p.gold).toBe((MAX_DAN_RANK - 1) * REBIRTH.earlyGold);
tests/progression.test.ts:192    expect(p.gold).toBe(... + REBIRTH.tenthGold);
```

Promoting `earlyGold`/`tenthGold` from INFERRED to **CONTRACT** on this evidence would stamp
"verified against the original" onto a mapping that sends a premium-currency reward into `p.gold`.

**Independent corroboration that stat 12 is the rebirth currency** — the android anti-cheat
threshold is exactly the maximum a legitimate player can accumulate by rebirthing:

```
OverworldHUD.as:1333  if(StatsManager.getStat(STAT_HGOLD) > 60 && StatsManager.getStat(STAT_DAN) < 9)
                         QueryManager.instance.reportHack("gold");
```

Android pays 5 per rebirth for DAN 0–7 and 20 at DAN 8 → 8×5 + 20 = **60**, precisely the
trip-wire. Note the same line proves the desktop's 25/100 could not run against a `>60` check
(8×25 + 100 = 300) — further evidence the two builds' rebirth economies genuinely diverge.

**What survives:** the numbers 25/100, and `MAX_DAN_RANK = 10`. The Dan-10 ceiling is quadruply
attested and I confirm all four: `DAN < 9` increment guard (`§1t1523s0§.as:2654`), achievement 51
`<val>9</val>` = "Reach Dan 10.", the UIData comment `>=10 dan, no element boost`, and
`getString(864, [..., "10"])`. **Only the currency label fails.**

---

## 2. Claim 17 — the desktop stance formulas exist, and they differ

The claim rests on a negative: *"I grepped the whole v0.717 desktop tree for the identical
expressions and got zero hits."* I reproduced the grep — the three patterns really do return
nothing, across every non-android bundle. But the inference is invalid: **the desktop tree is
obfuscated, so identifier-bearing expressions cannot survive a literal grep.** Only numeric
literals do. Absence of the *string* is not absence of the *code*.

I located the class positionally instead. Desktop MCSPlayer is `§1t99s0§.as` — it is the file
defining both `§1t4443s0§` (initPlayer) and `§1t4446s0§` (initElementDefenseStats), the two
methods claim 8 and claim 15 already call from `StatsManager`. Its stance switch:

| stance | android v0.682 `MCSPlayer.as` | desktop v0.717 `§1t99s0§.as` |
|---|---|---|
| Light | `:3030` × **1.5** | `:3094` × **1.4** |
| Balanced | `:3041` × (1 + 0.5·m·0.01) = **1+0.005m** | `:3105` × (1 + 0.2·m·0.1) = **1+0.02m** |
| Heavy | `:3052` × (0.5 + 0.5·m·0.01) = **0.5+0.005m** | `:3116` × (0.5 + 0.4·m·0.1) = **0.5+0.04m** |
| 4th case | `:3067` × 1.5 | `:3131` × 1.4 |
| 5th case | `:3078` × 1.0, floor 100 | `:3142` × 1.0, floor 100 |

Verbatim, desktop:

```
3094:  this.§1t4417s0§ = this.§1t4420s0§ * 1.4;
3105:  this.§1t4417s0§ = this.§1t4420s0§ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
3116:  this.§1t4417s0§ = this.§1t4420s0§ * (0.5 + 0.4 * this.§1t4423s0§ * 0.1);
```

The claim's *conclusion* ("parity is NOT established") points the right way, so this is not a
guess-refutation — but the claim understates its own finding and leaves recoverable v0.717
numbers on the table. Per the precedent claim 7 itself sets ("the desktop value wins"), the
recreation should take **Light ×1.4**, not ×1.5.

### 2b. The sub-claim "mastery is a 0-100 percentage" is refuted in both builds

Claim 17's `lane_impact` asserts *"mastery is a 0-100 percentage here, not 0-9."* That is inferred
from the `* 0.01` alone, and both builds contradict it — abilities gate on single-digit mastery:

```
android  MCSPlayer.as:3166-3168   canLaunch = lightMastery >= 3;  canDeflect >= 4;  canAirCombo >= 5;
android  MCSPlayer.as:3174-3176   canFlipUp = balancedMastery >= 3; ... >= 4; canLaunch >= 5;
android  MCSPlayer.as:3182-3184   canLaunch = heavyMastery >= 3;  ... >= 4;  canStab >= 5;
desktop  §1t99s0§.as:3231-3233 / 3239-3241   same >= 3 / >= 4 / >= 5 gates
```

A 0-100 scale would put every ability unlock inside the first 5% of the track. Mastery is a small
integer, consistent with the ledger's "mastery-9" *scale* — though not with its *ceiling* reading,
which §3 below overturns.

---

## 3. NEW — the ledger's "stance reach 300/200/100 = MASTERY-9 CEILING" is wrong (overturns §3 item 3)

`REBUILD_READINESS.md:155` states: *"The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are
MASTERY-9 CEILING values, not base."* The reach half is refuted by the code above.

**Structural argument (decisive on its own):** Light-stance reach carries **no mastery term** in
either build — it is a bare constant (`× 1.4` desktop, `× 1.5` android). A number that cannot vary
with mastery cannot be a "mastery-9 ceiling". So the wiki's Light = 300 is a mastery-invariant value.

**Numeric argument:** normalise the desktop multipliers.

- at **mastery 0** → 1.4 : 1.0 : 0.5 = **2.8 : 2.0 : 1.0**  ≈ the wiki's 3 : 2 : 1
- at **mastery 9** → 1.4 : 1.18 : 0.86 = **1.63 : 1.37 : 1.0**  — nothing like 3 : 2 : 1

The 300/200/100 table reproduces the **mastery-zero base**, not a ceiling. It also lands on the
Heavy floor exactly: `getBaseSlashLengthVal` tops out at 210 px at Dan 0, and 210 × 0.5 = 105,
clamped by the shipped `if (slashLength < 100) slashLength = 100`.

Consequence for combat-core: the remediation at `REBUILD_READINESS.md:320` ("relabel mastery-9")
is backwards — the tables should be labelled **mastery-0 base**, with mastery as a modest additive
bonus on Balanced/Heavy only.

---

## 4. Smaller corrections

**String 455 is never displayed (claim 2).** The claim lists the kanji titles as "初段…十段
(strings 455–464)" for STAT_DAN 0..9. `InventoryUI.as:2276-2278` sets `danfield.text = ""` at
case 0, and `grep -rn "getString(455)"` over the android tree returns **zero** call sites. The
displayed set is **456–464 for STAT_DAN 1..9, blank at Dan 0**. `455 = '(初段)'` is shipped-but-dead
string data. The ladder and shogo mapping are otherwise exactly right.

**Claim 13 is stronger than filed.** The surveyor cited only android `DragonDanceUI.as:70-71`.
The desktop carries byte-identical arrays at `§1t5495s0§.as:70-71` — same order, same strings.
This is the one android-only claim in the lane that I can upgrade to confirmed cross-build parity.

**Unverified sub-clause (not refuted).** Claim 5's aside that "traps/kunai consume kunai AMMO on
top of Chi" is outside its cited lines; I did not test it. Flagging, not scoring.

**Claim 8's "stage pixels" is properly grounded** — I checked the consumers rather than taking it
on trust: `slashLength` feeds `Vector.<Point>` geometry, `canvas.graphics.lineStyle`
(`InputManager.as:485-492`), and `startX = getTargetPosition() ± slashLength/3`
(`MCSPlayer.as:4663-4681`). Display coordinates. The unit call is correct.

---

## 5. On the two STILL_UNHELD claims

Both are correct and should not be pushed further.

- `element-circle-art` — `frames.json` carries **113** directories; every one is combat/duel/map or
  a session analysis burst. None is rebirth, Dan or element related, consistent with the ledger's
  own "both longplays pre-rebirth". **The "frame wins" rule never fired anywhere in this lane,
  because no frame in the corpus depicts the rebirth flow at all.** Honest STILL_UNHELD.
- `element-status-effects` — I confirmed the `Damage` constructor (`Damage.as:50`) takes eight
  purely numeric parameters with no status/buff field, and that none of the four elemental
  construction sites passes one. That is still not proof no status system exists elsewhere, and
  the surveyor's refusal to assert absence without reading `BUFF_*` is the right call.

---

## 6. Scoring note

The surveyor's 88 is close but slightly generous. Both refutations touch numbers the claim
proposed to promote to **CONTRACT** (`tenthGold`, and the stance multipliers feeding combat-core's
reach model), which is the highest-consequence category on the board. The evidence recovery in
this lane is genuinely excellent — but two of the numbers it hands downstream are mislabelled, and
one of those would have written a premium-currency value into the coin purse. **83.**
