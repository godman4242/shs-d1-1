# t1-overturns-01 — HUNTER LENS review (s27d)

**Packet:** 7 claims · **Judged:** 7 · **Skipped:** 0
**Structured verdicts:** `docs/gauntlet/L0/critics/t1-overturns-01.hunter.s27d.json` (written first, before this file)
**My own cites:** 13 claims through `scripts/gauntlet/citeLint.py` — **13 RESOLVES · 0 BROKEN · 0 QUOTE_UNVERIFIED · 0 UNCHECKABLE**

---

## Headline

| # | Claim | refuted | overturn_upheld | severity |
|---|---|---|---|---|
| 1 | cannot-change-stance-is-the-focus-bar-low-end-label | **no** | **YES** | fatal |
| 2 | focus-meter-numerics-are-fully-recovered-in-web-v0717 | **no** | **YES** | material |
| 3 | stance-damage-ceiling-is-mastery-10-not-mastery-9 | **no** | **YES** (narrow) | material |
| 4 | crit-1.3-is-sealed-in-the-web-payload | **no** | **NO — inflated** | minor |
| 5 | stance-reach-is-asymmetric-…-hard-floor-of-100 | **no** | **NO — inflated** | material |
| 6 | the-in-combat-stance-gate-is-reload-48-of-a-192-max | **no** | **YES** | material |
| 7 | the-real-in-combat-stance-rule-is-actionstate-gate-AND-meter-48 | **no** | **YES** | fatal |

Five claims carry a **sub-claim I refuted from my own artifact** even though the headline survived. Those
corrections are the load-bearing part of this review — see §"What must not reach the ledger".

Two claims (#4, #5) are **true but pointed at sentences they do not falsify.** Per the Lens-2 brief, that
is exactly as valuable to catch as a false claim: 203 claimed overturns are about to rewrite
`REBUILD_READINESS.md`, and these two would have struck out lines that the evidence *confirms*.

---

## The one thing that made this review possible

`reference/decompiled/shs3_android/scripts/MCSPlayer.as:182` is **un-obfuscated** and declares:

```
public function initPlayer(controlledBy:int, hp:int, maxhp:int, chi:int, maxchi:int, defense:int,
  baseReload:int, minDamage:int, damageRange:int, baseSlashLength:int, slashUsage:int,
  lightMastery:int, balancedMastery:int, heavyMastery:int, level:int) : *
```

The web payload's `§1t99s0§.as:183` declares the **same 15-slot signature**, and the two call sites are
structurally identical (`StatsManager.as:1834` vs `§1t1523s0§.as:2268`). Reading `§1t99s0§.as:185-199`
slot by slot decodes the whole combat block: `§1t4419s0§`=baseReload, `§1t4420s0§`=**baseSlashLength**,
`§1t4421/22/23s0§`=light/balanced/heavyMastery. The per-frame twins add `§1t4414s0§`=reload,
`§1t4415s0§`=maxreload, `§1t4469s0§`=**canChangeStance**, `§1t4472s0§`=**nextStance**,
`§1t1243s0§`=STAT_CRITICALDMG.

**This is not the circularity C2 forbids.** C2 bars diffing the four data XMLs against the Android blobs
because those XMLs *are* Android. This is two independently decompiled AS3 *code* bundles, one obfuscated
and one not. **The names transfer; the numbers do not** — and §"Parity" below shows exactly how badly the
numbers diverge.

---

## Claim-by-claim

### 1 — "CANNOT CHANGE STANCE" is the Focus bar's low-end label · HELD · overturn UPHELD · fatal

I reproduced **both** halves first-hand.

**Code.** `§1t113s0§.as:110-111` verbatim: `§1t5203s0§` is black + `getString(175)`, `§1t5204s0§` is
`#BBBBBB` grey + `getString(960)`. `:328` `var _loc3_:Number = (param1 - 48) / (param2 - 48);` then a
strict three-way — `:336 if(_loc3_ == 0)` shows the **grey** string and forces visible; `:344` hides the
label entirely for `0 < x < 1`; `:348 else if(_loc3_ >= 1)` fires `Snd_criticalDamage` and shows the
**black** string. `strings.json["175"]` = `Critical Hit`; the table has **no key "960"** (2,533 entries,
checked programmatically).

**Frame.** I cut exactly the crop the claim states — PIL box `(0,920)-(620,1080)` of the 1920×1080
`reference/frames/duel_dense/Nr4fQstqHDM_429.0.png`, LANCZOS 3×, then a second 6× pass on the third bar
alone. Green **20/20**, blue **26/26**, and beneath them a third bar: a uniform dark gold/brown track with
**no fill segment anywhere across its width**, carrying **CANNOT CHANGE STANCE** in light-grey caps. The
yellow **150% DAMAGE** buff sits *below* the bar stack, not in it. Every visual particular the claim asserts
is there.

**The frame and the code do not disagree.** An empty third bar *is* `_loc3_ == 0`, the only branch that
prints a grey label — and the same meter at ≥ 48 opens `§1t4470s0§`.

**Overturn.** `SHSD_MASTER_REFERENCE.md:388` reads verbatim
`| **In combat** | **Hard lock** — "CANNOT CHANGE STANCE" appears the instant a fight starts | [CONTRACT] |`,
`:2099` repeats it, `RR:158` carries the same bold claim. A caption the code shows and hides as a function
of a live meter is an **affordability message**, not a lock. The [CONTRACT] grade on all three falls.

**Label this on the way in:** *"that label is `getString(960)`"* is a **code+frame join**, not a string-table
lookup — 960 is absent from the Android table. The join is sound (only one branch prints a grey label, and
the frame is in that branch), but it must enter the ledger as a **derived identification**, not a quoted row.

### 2 — Focus numerics fully recovered · HELD · overturn UPHELD · material

Every number verbatim: `:249 = 8 * 24`, `:250 = 0`, `:1203-1205` `++`, `:3162 -= 48`, `:3302 /2`,
`:3306 ×1`, `:3310 ×1.5`, `:3320 += 6`.

**I settled the one thing the claim asserts without proving — that this meter is FOCUS.**
`§1t120s0§.as:18` `§1t10128s0§:int = 1005;` and `:230-231` `case §1t10128s0§: param3.§1t4414s0§ =
param3.§1t4415s0§ - 1;`. `skilldata.xml` skill **1005** carries `<displayname>6008</displayname>` and
`<desc>6011</desc>`; `strings.json["6008"]` = **"Focus"**, `["6011"]` = **"Instantly recharges your focus
bar."** The skill whose own description says it recharges the focus bar writes exactly this variable.

**I also cleared a hole the claim didn't see.** `§1t4419s0§` = `baseReload` = `48 + SPD*6`
(`§1t1523s0§.as:2274-2277`) is assigned at `:191` and **never read on the player** — so the flat +1/tick is
the *complete* fill rule, not a partial one. That strengthens the claim.

RR:195 blocker ③ names three quantities; the web payload hands over all three. **Blocker falls.**

### 3 — Ceiling is mastery-10, not mastery-9 · HELD · overturn UPHELD (narrow) · material

The claim pointed at a string but never proved the scale caps at 10. **I proved it two ways.**

1. `§1t1523s0§.as:2268` passes `§1t9714s0§(1000/1001/1002)` as params 12/13/14; the Android twin
   `StatsManager.as:1834` passes `getStat(1000/1001/1002)` into the same slots, which `MCSPlayer.as:182`
   names `lightMastery/balancedMastery/heavyMastery`. **Mastery = the player's level in skills 1000/1001/1002.**
2. `skilldata.xml` gives skills 1000/1001/1002 (displaynames 6000/6002/6004 = Light/Balanced/Heavy Stance
   Mastery) **exactly ten** `<level><value>` rows, 1..10.

So m ∈ 0..10. m=10 → **0.9 / 1.2 / 1.4** = RR:155's ceiling table exactly. m=9 → 0.86 / 1.18 = nothing.

**Narrow overturn, and I say so.** What falls in RR:155 is the two characters **"-9"**. The sentence's
substance — *"these are CEILING values, not base"* — **survives intact**, and the reach half of the same
sentence (300/200/100) is untouched by this function. The claim's own PARTIAL verdict and lane_impact
concede exactly that, which is why I am not scoring it as inflated. RR:157's fork dissolves either way.

**Sub-claim REFUTED:** *"Android … on a 0-100 mastery scale."* Wrong. Android's masteries come from the
same `getStat(1000/1001/1002)` 10-level skills, and `MCSPlayer.as:3166-3168` gates perks at
`lightMastery >= 3 / >= 4 / >= 5` — **identical thresholds to web** `§1t99s0§.as:3223-3225`. Thresholds of
3/4/5 are incoherent on a 0-100 scale. Android's divergence is the **coefficient** (0.01 vs 0.1) and the
Heavy constant (1.5 vs 1.4), which makes its Light cap 0.55 and its Balanced cap 1.05. The conclusion
*"must not be ported"* survives — and is stronger than claimed.

### 4 — Crit 1.3 sealed · TRUE · **overturn REFUTED as inflated** · minor

First: citelint's `QUOTE_NOT_LOCATED` on this claim is a **formatting artifact**. I located both quoted
lines verbatim — `:3272 if(this.§1t4414s0§ == this.§1t4415s0§)` and `:3274 return _loc2_ * 1.3 +
this.§1t1243s0§;`, with `:3295-3297` zeroing the meter on the same equality. The cite **resolves**.

**But read RR:150-154 in context and the sentence does not fall — it is confirmed.** The ledger already
writes *"Keep `CRIT_MULT=1.3`."* The code agrees with the ledger. Nothing there becomes false.

What the evidence actually retires is (a) the parenthetical **action item** *"(Read a real OG crit popup to
fully seal it.)"* — an instruction, not a claim — and (b) two blockers on **other lines**: RR:190
combat-core ② and RR:195 skills-meters ⑤.

Worse for the overturn: RR:153's compounding explanation — *"1.3× compounded with the per-stance
crit-damage stat (Heavy ×1.82) + item crit-damage"* — is **corroborated** by this very code. 1.4 stance ×
1.3 crit = **1.82** exactly, and `§1t1243s0§` is the additive item crit-damage term (Android name
`STAT_CRITICALDMG`, `MCSPlayer.as:3219`). **The claim confirms the paragraph it says it overturns.**

Real value, wrong target: promote `CRIT_MULT=1.3` from wiki-authority to web-payload CONTRACT and close
RR:190 ② / RR:195 ⑤ — but do **not** record RR:150-154 as overturned. Note 1.3 is web-only; Android is
1.2 non-Light / 1.5 Light.

### 5 — Reach is asymmetric with damage, 100 floor · TRUE · **overturn REFUTED as inflated** · material

Verbatim confirmed: `:3094` Light reach `= §1t4420s0§ * 1.4` with **no mastery term**; `:3105` Balanced
`* (1 + 0.2 * §1t4422s0§ * 0.1)`; `:3116` Heavy `* (0.5 + 0.4 * §1t4423s0§ * 0.1)` with `:3117-3120`
`if(this.§1t4417s0§ < 100){ this.§1t4417s0§ = 100; }`. The damage switch at `:3259-3271` is the exact mirror.

I also nailed down the stance identities the claim assumes: `§1t406s0§.as:3087-3100` cycles 12220→12221
printing `getString(644)`, 12221→12222 printing `getString(645)`, 12222→12220 printing `getString(643)`,
and `strings.json` gives 643/644/645 = **Light / Balanced / Heavy Stance**. The mapping is right.

**Now the overturn.** RR:156 reads: *"A level-1 Shugyosha does Light ×0.5 / Balanced ×1.0 / Heavy ×1.4
(Heavy is fixed); Heavy's reach also scales ×0.5→×0.9."* **Every clause of that is correct against this
code.** The claim says the low endpoint is wrong because *"m=1 gives 0.54"* — that **conflates character
level 1 with mastery 1.** A level-1 Shugyosha has not learned skills 1000-1002, so m=0; at m=0 Heavy reach
is exactly ×0.5 and at m=10 exactly ×0.9.

**The claim's own sibling in this packet contradicts it**: `stance-damage-ceiling` says *"mastery 0 gives
Light 0.5 / Balanced 1.0 / Heavy 1.4 — exactly RR:156's level-1 Shugyosha row."* One of the two is wrong,
and it is this one.

The only genuine qualification to RR:156 is the **100-unit floor**, which the sentence omits. An omission
is not a falsification and I do not refute for incompleteness.

The claim's *second* argument — 1.4/1.2/0.9 is not 3:2:1, so 300/200/100 cannot be a ceiling row — is
**sound**, and I confirm it independently below. But it attacks **RR:155**, not the RR:156 sentence in
`ledger_text`. Keep the reach formulas; do not record RR:156 as overturned.

### 6 — Gate is 48 of a 192 max · HELD · overturn UPHELD · **one load-bearing sentence REFUTED** · material

citelint said QUOTE_UNVERIFIED; I located all three quotes verbatim (`:3050`, `:249`, `:3060`). The cycle
body `:3064-3079` steps −1→12220→12221→12222→12220 and pushes at `:3080`, as described.

**Build attribution proved, not assumed:** `§1t1523s0§.as:36` `public static var §1t9323s0§:Number = 0.717;`
This payload **is v0.717**, so the overturn of RR:158's *"HARD-LOCKED in v0.717"* lands on the right build.

**REFUTED sub-claim — must not reach the ledger:** *"the in-combat stance switch costs no Focus and no Chi."*
**It costs 48 Focus.** `§1t99s0§.as:3160-3166` — `if(§1t1525s0§.§1t9948s0§()){ this.§1t4414s0§ -= 48; … }` —
and `§1t1525s0§.as:1152-1155` defines `§1t9948s0§()` as `actionState == §1t9903s0§`, with `§1t9903s0§ = 2`
at `:53`: **the in-battle state.** The debit fires exactly and only in combat.

And the meter is not a nameless "reload meter": `§1t120s0§.as:230-231` has the skill whose description reads
*"Instantly recharges your focus bar"* write `§1t4414s0§`. **"reload" is only the engine's internal
identifier**; the player-facing resource is Focus. Correct port: in combat, **require ≥48 AND spend 48** of
a 192 Focus bar. Porting *"costs no Focus"* ships a free switch and a wrong economy.

### 7 — actionState gate AND meter ≥ 48 · HELD · overturn UPHELD · fatal

**The cleaner of the two hard-lock kills** — it states the rule positively and makes no cost error. Every
cited line resolves and reads as described despite the claim carrying no `quote` field. `:3045` is a
six-state whitelist with the `§1t3251s0§` previous-state check on the first four. `:3050` ANDs it with
`>= 48`. `:3060` re-guards. `:3266-3270` does give 12222/12223/12224 the same flat ×1.4.
`§1t113s0§.as:468-480` verbatim: `:470` gate → `:472` `Snd_smallClick` + `:473` `§1t4472s0§()`, else `:478`
`Snd_error`. Both sounds real.

**Extra corroboration I found:** the button is genuinely live in the battle HUD (`§1t113s0§.as:379-381`
hit-tests `§1t5158s0§` and calls `§1t5207s0§`), and `Keyboard.SPACE` routes to the same gated pair
(`§1t1541s0§.as:605-616`).

**Decisive:** the un-obfuscated Android build **names these two functions outright** —
`MCSPlayer.as:2965 public function canChangeStance() : Boolean` with the identical six-state whitelist
(IDLE/POSE/RUN/WALK/SKILL_CHICHARGE/FLINCH-with-prev), and `MCSPlayer.as:2975 public function nextStance()`.
**A shipped function literally called `canChangeStance()`, returning true whenever the meter is at 48+,
ends the "HARD-LOCKED" reading** of RR:158 and of `SHSD_MASTER_REFERENCE.md:388/:2099`.

---

## What must not reach the ledger

Five corrections, each from an artifact I opened:

1. **"costs no Focus and no Chi"** (claim 6) — false. In combat it spends **48**. `§1t99s0§.as:3160-3166`.
2. **"reload meter"** as the resource's name (claim 6) — that is the engine identifier. The game calls it
   **Focus**. `§1t120s0§.as:230-231` + `skilldata.xml` skill 1005 + `strings.json["6008"/"6011"]`.
3. **"Android uses a 0-100 mastery scale"** (claim 3) — false. Same 0..10 skill levels; the divergence is
   the coefficient. `MCSPlayer.as:3166-3168` vs `§1t99s0§.as:3223-3225`.
4. **RR:150-154 marked overturned** (claim 4) — it is *confirmed*, not overturned.
5. **RR:156 marked overturned** (claim 5) — it is *correct as written*; the endpoint objection is a
   level/mastery conflation.

---

## Hunter part (a): what I went and found

Six new findings, all in the JSON. Three matter most.

### baseSlashLength is a closed formula — RR:190 blocker ① falls

RR:190 calls the per-stance reach cap *"the one value the whole model needs"* and prescribes measuring
blade-FX span from footage. **It does not need measuring.** `§1t1523s0§.as:2334-2348`:

```
§1t9593s0§(p):  var _loc2_:int = 90 + §1t7356s0§(§1t9426s0§) * 5;
                return int(120 + Math.floor(_loc2_ * param1 / (20 + param1)));
```

The Android twin names every term — `StatsManager.as:1915-1919`
`getBaseSlashLengthVal(speed) { var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
return int(120 + Math.floor(maxincrement * speed / (20 + speed))); }`.

**BASE_SLASH_LENGTH = 120 + floor((90 + DAN×5) × SPD / (20 + SPD))** — saturating: SPD 0 → 120, SPD 20 → 165,
SPD→large → 210 at DAN 0. Reach = base × stance, Heavy floored at 100.

**This also settles the 300/200/100 triple.** At a high-SPD, DAN-0 base of ~210 the **mastery-ZERO** row is
294 / 210 / 105 — the ledger's 300/200/100. The triple is a mastery-**zero** row, not a mastery-ceiling row;
ceiling multipliers 1.4/1.2/0.9 cannot make 3:2:1 off any single base. Independently confirms claim 5's
arithmetic (while its *other* objection stays refuted). Still open: the unit→stage-px scale factor, which
wants one frame measurement.

### RR:159 is inverted

RR:159-160: *"The out-of-combat switch costing Focus IS real; the in-combat switch is a recreation
divergence."* **Backwards.** Out-of-combat (`§1t406s0§.as:3064-3104`, MouseEvent.CLICK at `:944`) cycles with
**no meter test and no debit** — free. In-combat costs 48 (`§1t99s0§.as:3160-3166`, gated on the battle
actionState). The recreation's Focus-gated in-combat switch **is the original behaviour**; the thing the
ledger calls real does not exist.

### Parity: the web build doubled the meter

A first-hand, non-circular measurement of the S0-3 hole, on this exact system.

| | web v0.717 | android v0.682 |
|---|---|---|
| max | `8*24` = **192** (`§1t99s0§.as:249`) | `5*24` = **120** (`MCSPlayer.as:239`) |
| stance threshold | **48** (`:3050`, `:3060`) | `maxreload/6` = **20** (`MCSPlayer.as:2977`) |
| HUD zero-point | **48** (`§1t113s0§.as:328`) | **24** (`MCSPlayer.as:1163-1168`) |
| crit | flat **×1.3** (`:3274`) | ×1.2 non-Light / ×1.5 Light (`:3219-3221`) |

Web raised the ceiling, doubled the threshold, and **repaired a gate/HUD mismatch that Android shipped with**
(20 vs 24). Every Focus, crit and stance-cost number must be read from the web payload; none may be ported.

### Also filed

- **Crit is deterministic** — `if(reload == maxreload)`, no dice anywhere in `§1t4475s0§` except the base
  damage roll; `§1t4478s0§` zeroes the bar so crits cannot chain. Closes RR:195 blocker ⑤
  (*"entirely absent"*).
- **SPACE is the stance-cycle key** (`§1t1541s0§.as:605-616`) — filed **PARTIAL**, because the SPACE path
  re-guards on `≥48` *unconditionally* (`:3060`, not wrapped in the battle test) while the portrait-click
  path is unconditional. That splits `SHSD_MASTER_REFERENCE.md:387`'s single [CONTRACT] cell in two — but
  I have not proved that handler is live outside battle, so I did not grade it as proved.
- **The Android decoder key** itself (§"The one thing that made this review possible").

---

## Self-audit

- Every verdict carries an `own_cite` naming an artifact **I** opened; all 13 pass `citeLint.py` clean.
- I did **not** open `docs/gauntlet/L0/critics/*.md` or `sources/*.md` (§3.2).
- I modified **no** file outside my two journal paths.
- I opened the frame and cut the crop myself rather than grading claim 1 from its prose (the standing
  invariant). The frame and the code agreed — I say so above rather than leaving it implied.
- **Zero claims refuted outright.** That is an unusual result and I want it on the record as a
  *finding*, not a rubber stamp: this packet's claims are unusually well-cited, and the real defects were
  **inside** them — two inflated overturns and three false sub-claims that would have shipped wrong config.
  I hunted for a wholesale refutation on each of the seven and did not find one.
