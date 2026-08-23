# t1-overturns-03 — Hunter Lens (s27d)

**Packet:** 7 claimed ledger overturns · **Judged:** 7 · **Skipped:** 0
**Refuted:** 0 · **Overturns upheld:** 7/7 · **New findings:** 8
**My own cites:** 15, all RESOLVES under `scripts/gauntlet/citeLint.py`, 0 BROKEN.

---

## Headline

This is the strongest packet I have seen in this lane, and I went in expecting to
break it. Every one of the seven findings survived, and — this is the part that
matters for the rewrite — **every claimed overturn is not merely upheld but
UNDER-stated**. In five of the seven cases I found the finding had left a genuine
hole in its own argument (an android-only cite standing under a web claim, a
half-blocker it never addressed, a fork it declared unresolvable), and in every
one of those five the hole closed in the finding's favour when I went and looked.

That is a Lens-2(a) result, not a rubber stamp. The eight new findings are the
product of hunting the under-claims, and three of them (nf1, nf2, nf7) overturn
ledger sentences that **nobody in this packet claimed**.

**Zero refutations is a result I distrust on principle, so here is my honesty
check:** I did find defects. Three of them (a loose reconciliation in claim 1's
lane_impact, an off-by-one branch range in claim 3, an off-by-one quote line in
claim 4). None is a reason to destroy a correct, well-cited claim — §3 says refute
for WRONG, UNGROUNDED or MIS-CITED, and over-refuting honest work is itself a
failure — so they are recorded as `severity: minor` with the correction attached.

---

## The overturn check, one by one

### 1. Reach cap in stage px — RR:190 blocker ① — **UPHELD**

All four AS3 cites are exact. Light `* 1.4` at `§1t99s0§.as:3094`, Balanced
`* (1 + 0.2 * m * 0.1)` at `:3105`, Heavy `* (0.5 + 0.4 * m * 0.1)` at `:3116`
with the hard floor of 100 at `:3117-3119`. The base is
`§1t1523s0§.as:2346-2347`, `90 + STAT_DAN * 5` then
`int(120 + Math.floor(_loc2_ * param1 / (20 + param1)))`.

I refused to take the obfuscated-id mapping on trust and resolved it myself:
`§1t9426s0§ = 25` and `§1t9410s0§ = 8` (`§1t1523s0§.as:254`, `:220`), against
android `StatsManager.as:186`/`:220` giving `STAT_SPEED = 8`, `STAT_DAN = 25`,
with `StatsManager.as:1915-1918 getBaseSlashLengthVal(speed)` carrying the
byte-identical formula. The arithmetic checks out: 120 px at SPD 0, a 210 px
asymptote at dan 0, +5 px of asymptote per dan.

**The hole I found, and what happened to it.** The finding proves the
"length budget, not hitbox radius" reading from the **ANDROID** `InputManager`
only — a live C2/S0-3 parity hole sitting under a claim about **WEB** units. It
closes, and better than the finding argued. `§1t99s0§.as:3158` feeds slashLength
into `§1t1541s0§.§1t10094s0§()`, and `§1t1541s0§.as:51` is
`internal static var maxDistance:int = 200;` **in the web payload**. Then
`§1t1541s0§.as:343-344` converts the pointer into stage space and `:349` bounds
it against `stageWidth`/`stageHeight` before a single unit is spent.

> The budget is consumed in **literal stage pixels** — precisely the unit RR:190
> calls "of unknown scale".

Every clause of RR:190 ① is now false: it is not a constant to be measured, it is
a formula in SPD/DAN/mastery, in the target build, in stage px. **Strike the
close-path instruction.**

**Caution, flagged not fatal.** The `lane_impact` re-reads 300/200/100 as
"Light-at-max, Balanced-at-base, Heavy FLOOR". The Heavy floor of 100 is exact
and Light-at-max 294 is near 300, but *Balanced-at-base is 210* at dan 0, not
200 — 200 is the InputManager's **default** `maxDistance`, a different number that
happens to collide. Ship the formulas; do not ship that three-way reconciliation
as if measured.

### 2. 271 reachable in one stat — RR:201 — **UPHELD**

Four exact cites, arithmetic sound. `:3344` gates the ATK button at
`< 1 + (level + 10) * 3` = 271 at level 80; `:3421-3422` spends one stat point
for +3; `:3457` pins base = 1 and step = 3 via `(ATK - 1) / 3`; `:3461` sets the
budget to `(level - 1) * 3` = 237. 1 → 271 costs **90 of 237**, the gate is a
strict `<` so the last grant fires at 268 and lands exactly on 271. 147 to spare.

I confirmed `§1t9408s0§ = 6 = STAT_ATTACK` myself, and pulled independent
cross-build corroboration the finding did not cite: android
`StatsManager.as:2125-2127` sets ATK/DEF/SPD to **1** on reset, `:2135` sets the
budget to `(getLevel() - 1) * 3`.

The parenthetical is the *stated reason* for the sentence's headline, so the
sentence falls with it. **And the half nobody claimed falls too** — see nf7.

### 3. Coins per kill — RR:215 blocker ① — **UPHELD, BOTH HALVES**

`§1t68s0§.as:863`/`:867` pay `1 * qty` and `5 * qty`, twinned at android
`NPC.as:839`/`:843`. I walked upstream, which the finding did not: `:820-828`
loops `this.reward.loot` reading type / `getQty()` / `chance * 100` against
`Math.random() * 100`. It is a **per-NPC probabilistic loot table** —
`npcdata.xml:39-42` is a real row, 2 coins on a coin-flip. There is no constant,
so there is nothing for `=8` to be a seed *of*.

**The XP half.** The finding asserts it falls but sources that to *another
agent's finding*, which under §0 I may not accept. So I went and got it:

> `§1t68s0§.as:184-207` is the **calcXP twin, in the web build** — zero XP beyond
> a 3-level gap (`:190-193`), `* (1 + 0.05 * (mobLevel - playerLevel))` above
> (`:197`), `* (1 - (playerLevel - mobLevel) / §1t12069s0§())` below (`:201`),
> `* 2` for elites — called at `:888`.

"20+ samples show no XP formula either" is dead. **Delete RR:215 ① whole.**

Nit: the tail branches run to `:877-880`, not `:869-875`. Off by one branch.

### 4. Reinforce is three-tier — RR:80 — **UPHELD**

The cleanest cite in the packet: I counted every line and all of them land.
`:1087 cost = 5000` · `:1110 / :1112 / :1120` for 20064 · `:1122 / :1124 / :1132`
for 20065 · `:1134 / :1136 / :1144` for 20066 · `:1146` charges · `:1147` resets
uses. The 13022 override at `:1105-1107` is real. `strings.json` resolves
4241/4242/4243 = Silver Ore / Titanium Ore / Uncut Diamond — I ran the lookup.

**I closed the one thing the finding inferred.** It reads the obfuscated
`case §1t1056s0§.§1t9114s0§(§1t1056s0§.§1t9093s0§)` as Reinforce from structure
alone. It is provable: android `InteractUI.as:1082 case "reinforceweapon":` opens
a line-for-line identical block. That twin *also* proves `§1t9714s0§ = getStat`
and `§1t9713s0§ = changeStat`, which I then reused on claim 2 and nf7.

RR:80's "Reinforce 5000c+1 silver ore" is only the sub-30 tier — a level-70
weapon costs an Uncut Diamond. False as written across most of the level range.
The 5000c survives. And because this is `shs3_payload`, the **S0-3/C2 hedge every
prior reinforce finding carried is discharged**.

Nit: `itemdata.xml:10421` is `<type>12</type>`; the name sits at `:10422`.

### 5. 6×6 war board web-side — RR:245 blocker ② — **UPHELD, BOTH HALVES**

The load-bearing claim is that the `= 6` defaults survive because there is exactly
one call site. **I ran the grep myself:** the whole payload returns precisely two
lines — the declaration at `§1t7785s0§.as:162` and `§1t6483s0§.as:588`, three
arguments, both dimensions defaulted. Pitch and origin match across builds
(`:208-209` vs `WarHexUI.as:206-207`). And android really does hardcode
`this.ht = 6; this.wt = 6;` at `:175-176` as the **only two assignments** in a file
with eighteen reads — I checked all twenty.

**The half it never argued.** RR:245 ② reads "board/**adjacency**". I expected the
blocker to partially survive on adjacency. It does not:

> `WarHexUI.as:443-463 getExitOwner` **is** the adjacency rule — territory coords
> as `(mapid >> 12 & 0x0FFF) - 341`, then edge cells resolving to
> `getOwner(territoryx ± 1, territoryy)` and `(territoryx, territoryy ± 1)`,
> interior cells returning 0.

Four-neighbour orthogonal adjacency with an explicit 341 origin, driving the
frontline logic at `:213-218`/`:259-307`. **Delete RR:245 ② whole**, not half.
What remains open is the live per-hex feed, already covered by RR:245 ①.

### 6. A territory is 6 rooms × 6 rooms — RR:225 blocker ⑤ — **UPHELD**

`WarHexUI.as:195-197` and `:208` exact; the web twin carries the identical
transform at `§1t7785s0§.as:196-198`. I resolved `getShiftedNodeId`
(`NodeGenerator.as:1780-1789`) rather than assume it, which makes the finding's
stated rule — `node id = (sectorX*6 + i) << 12 | (sectorY*6 + j)` — exactly right.

**This finding under-claims, and the stronger version is nf5.** Read alone, the
war-hex path proves the rule only for contested **war** territories, which would
leave the ledger's "town=fixed sector" half alive. It does not, because the
transform is general and keyed on nothing but a raw nodeid:
`NodeGenerator.as:296-320` gives `floor(sectorx / 6)` and `sectorx % 6`, both
directions, town or wilderness.

**A vocabulary correction the rewrite must carry.** The ledger's own phrase names
the wrong two levels. In `NodeGenerator` the packed nodeid fields are literally
`sectorx`/`sectory` — **a sector IS a room, one to one** — and the 6×6 container
is the **territory**. RR:225 ⑤ should read *territory↔room*, and the answer is
floor/modulo 6, 36 rooms per territory. "One-screen-per-sector" is refuted.

### 7. Stance ceilings are mastery-10 — RR:155 — **UPHELD**

`§1t99s0§.as:3262` = `0.5 + 0.04m` → **0.86** at m=9, 0.90 only at m=10.
`:3265` = `1 + 0.02m` → **1.18** at m=9, 1.20 only at m=10. `:3270` flat 1.4.
Reach same shape at `:3116`. I verified the light/balanced/heavy field mapping
rather than assume it: `§1t99s0§.as:183` declares the 15-parameter initPlayer twin
and `:196-198` assign param12/13/14, matching android's
`(..., lightMastery, balancedMastery, heavyMastery, level)` tail exactly.

**The finding declares the mastery cap STILL_UNHELD and says the fork cannot be
settled from that file. Under Lens 2(a) I went and found it.**

> `skilldata.xml`: skills **1000/1001/1002** — the three stance masteries,
> passive, categories 1/2/3 — each carry exactly **TEN** `<level>` rows, values
> 1..10 (skill 1000 spans `:3-80`). The three stance ultimates gate on it:
> `skilldata.xml:1238 <req><has><id>1000</id><qty>10</qty></has></req>`, with
> 1040/1041 doing the same for 1001/1002.

**THE CAP IS 10.** The fork resolves to the first branch: RR:155's printed
ceilings are the right *numbers* with the wrong *label*, reached at mastery 10.
"MASTERY-9" is off by one — now positively known wrong, not merely unsupportable.

Honest caveat: the 10-level table is android v0.682 data under C2. It is
corroborated web-side by the formulas themselves, which land on the round numbers
0.90 and 1.20 at exactly m=10 and on nothing round at m=9. That is design intent
speaking through the web build.

---

## New findings (8) — the under-claims I hunted down

| id | overturns | one line |
|---|---|---|
| nf1 | RR:155 | **Mastery cap = 10**, from the skill tree — resolves claim 7's declared unknown |
| nf2 | RR:156 | Mastery **floors at 1**, so a fresh character is ×0.54 / ×1.02, not ×0.5 / ×1.0 |
| nf3 | RR:190 | The slash budget is spent in **literal stage px**, proven **web-side** |
| nf4 | RR:215 | The **per-kill XP formula is in the web build** (`§1t68s0§.as:184-207`) |
| nf5 | RR:225 | `NodeGenerator` carries the **general** territory↔room transform, towns included |
| nf6 | RR:245 | **Adjacency is in code** too (`getExitOwner`), not just the board dimensions |
| nf7 | RR:201 | 271 is **neither gear- nor rebirth-inclusive** — the half nobody claimed |
| nf8 | RR:215 | Coins per kill is a **per-NPC table** of (type, qty, chance), not a scalar |

Three of these (nf1, nf2, nf7) overturn ledger sentences no packet finding
claimed. nf7 is the one I would flag hardest to the rewrite: claim 2 kills only
RR:201's parenthetical, leaving "The '271 cap' is gear/rebirth-inclusive"
standing. Both adjectives are false — gear rides a **separate** accessor
(`§1t7358s0§`/`findBonusStat`) that never enters the cap comparison, and
`StatsManager.as:2135` grants stat points with **no `STAT_DAN` term**, in pointed
contrast to the skill budget twenty lines later at `:2156` which does carry one.
Rebirth multiplies *skill* points, not *stat* points.

---

## Build-parity discipline (C2 / S0-3)

Called out per finding rather than blanket-hedged:

- **Discharged** (web v0.717 code, no hedge): claim 1 (+ nf3), claim 2, claim 3
  (+ nf4), claim 4, claim 5's board half, claim 7's formulas.
- **Hedge stands**: nf5 and nf6 rest on android `NodeGenerator` / `WarHexUI`
  bodies; nf1's 10-level table and nf8's loot rows are android-sourced XML under
  C2; nf2's mastery seed is android-side.

Per C2 I did **not** cite any `reference/extracted/*.xml` ↔ android-blob diff as
parity evidence anywhere in this review.

---

## Nothing to report as STILL_UNHELD

Every finding in this packet arrived with `verdict: HELD` and a `RESOLVES`
citelint status, and none downgraded on inspection. The one item that was
honestly self-declared STILL_UNHELD inside claim 7 — the mastery cap — I found,
and it is 10 (nf1). No claim in this packet is left unjudged.
