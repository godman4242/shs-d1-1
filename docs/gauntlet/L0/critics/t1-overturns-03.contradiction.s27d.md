# t1-overturns-03 — LENS 3 (CONTRADICTION), blind critic s27d

**Packet:** `docs/gauntlet/L0/worklist/t1-overturns-03.json` · 7 findings, all claiming a ledger overturn.
**Judged:** 7 of 7. **Skipped:** none.
**Result:** 7 survive, 0 refuted. 4 of the 7 were sitting on live contradictions with already-UPHELD
findings; I settled every one of them from an artifact rather than by counting critics. 6 new findings.

I opened no `critics/*.md` and no `sources/*.md` (§3.2). Everything below is a file I opened myself.

---

## The four live contradictions, and which side falls

### 1. `s27b/stance-ceilings-are-mastery-10-not-mastery-9` **vs** `combat-core/v0717-stance-table`

This is the sharpest one in the packet, and it is a coin flip sitting in the rewrite queue right now.

`combat-core/v0717-stance-table` (UPHELD, 1 critic) closes with:

> "At mastery 9 the damage row is 0.86/1.18/1.4, i.e. the wiki's 0.9/1.2/1.4 rounded, which
> **CONFIRMS** the ledger's mastery-9 reading rather than overturning it."

Five other UPHELD findings say the ceiling is 10 (`combat-core/mastery-caps-at-ten`,
`combat-core/mastery-caps-at-10-per-the-string-table`, `combat-core/mastery-is-ten-level-skill`,
`npcdata/stance-mastery-rank-10`, `skills-meters/stance-damage-ceiling-is-mastery-10`). Both cannot
be true. A writer picking between them gets a 0.86 or a 0.90 by arbitrary choice.

**Settled from the artifact.** `reference/extracted/skilldata.xml` skill 1000 (stance mastery) spans
:10–:79 with exactly ten `<level>` blocks. The tenth block is:

```
74: 			<value>10</value>
75: 			<required>9</required>
```

That single row is the entire origin of "mastery-9": the ledger read the **`<required>`** column
(the skill-point prerequisite, 1..9) where the scale is the **`<value>`** column (1..10). And the web
multipliers land on the ledger's own printed numbers *exactly* at m=10 and *miss* them at m=9 —
`§1t99s0§.as:3262` `(0.5 + 0.4 * m * 0.1)` → **0.86** at 9, **0.90** at 10;
`:3265` `(1 + 0.2 * m * 0.1)` → **1.18** at 9, **1.20** at 10.

An exact hit beats a rounded one. **`combat-core/v0717-stance-table`'s reconciliation clause is the
defective half** and must be struck before the rewrite absorbs it. The rest of that finding (the
complete v0.717 table, Heavy defence ×0.8) is untouched.

The packet finding is also *honest in the right direction*: it declines to close the web-side mastery
cap (skilldata is android-sourced, C2 undischarged) and argues disjunctively instead. That is the
STILL_UNHELD discipline §0 asks for, and RR:155's "−9" label falls on either horn.

### 2. `lens3/271-is-reachable-in-one-stat` **vs** `s26c/the-271-cap-IS-the-shipped-level-80-base-stat-cap`

`s26c/...` (UPHELD, 4 critics) says 271 "is unreachable in one stat … the panel stops granting".
`progression/271-cap-explained` (UPHELD, 9 critics) says it "IS reachable in one stat on a first run".

**Settled by one comparison operator.** `§1t5957s0§.as:3344` gates the ATK add-button on

```
3344:          var _loc6_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9408s0§) < 1 + (_loc2_ + 10) * 3;
```

a **strict** `<`, and `:3422` grants exactly +3. Base ATK is 1 — `§1t1523s0§.as:2567` sets it on reset,
and `§1t5957s0§.as:3457` independently pins it by auditing spend as `(ATK - 1) / 3`. So the reachable
set is {1, 4, 7, …, 268, **271**} and 271 = 1 + 3×90 sits *on* the lattice: at 268 the gate is still
open, the grant fires, ATK becomes 271, and only then does the button hide. "Unreachable because the
panel stops granting" inverts what a strict `<` does — it hides the button **after** the cap is
reached, not before.

The budget half is not close either: `§1t1523s0§.as:2577` sets the pool to `(getLevel() - 1) * 3`
= 237 at the level cap of 80 (`:362 public static const §1t9470s0§:int = 80;`), against a 90-point
cost. **147 points to spare.** `progression/271-cap-explained` wins; the ledger's parenthetical is dead.

Robustness check: `getLevel()` (`:2007-2019`) walks a **99-entry** XP array at `:364`, so I could not
confirm 80 as the *only* cap from that function. It does not matter — at level 98 the budget is 291
against a cost of 108. The conclusion survives either number.

### 3. `lens3/coins-per-kill-half-of-RR215-is-also-dead` **vs** two surviving riders

Two UPHELD findings carry riders that would re-freeze a dead blocker:

- `hunter-s26c/web-parity-for-the-per-kill-xp-formula`: "The coins-per-kill half of the same sentence **still stands**."
- `hunter-s26a/per-enemy-xp-formula-is-lvl-times-2-plus-20`: "the clause **survives** on coins-per-kill."

Both are refuted forty lines below the line that finding itself quoted:

```
861:                if(_loc7_ == 0)
863:                   §1t406s0§.instance.§1t6488s0§.§1t5846s0§(1 * _loc8_);
865:                else if(_loc7_ == 1)
867:                   §1t406s0§.instance.§1t6488s0§.§1t5846s0§(5 * _loc8_);
```

with the android twin naming the call in the clear (`NPC.as:839` `addLootCoins(1 * qty)`, `:843`
`addLootCoins(5 * qty)`), and `:869-879` / `:845-855` handing types 2/3/else to quest item,
level-scaled random item and literal item id. Coins per kill are a rolled loot table in **v0.717**,
not an INFERRED flat 8. The riders also contradict three UPHELD siblings — one of which,
`economy/coins-per-kill-and-xp`, cites *this exact web range*. **Both riders fall; both halves of
RR:215 ① fall together.**

### 4. `lens3/reinforce-tiers-are-web-code` **vs** `payload/repair-cost-formula-is-node-level-times-10`

That UPHELD finding carries "Reinforce = flat 5000 (**1 Silver Ore under weapon level 30, 1 Titanium
Ore at 30+**)" — a **two**-tier clause. The web action block has three, and the else-branch is
unambiguous:

```
1110:                if(weaponlevel < 30)          → 1120: §1t9713s0§(20064,-1)
1122:                else if(weaponlevel < 60)     → 1132: §1t9713s0§(20065,-1)
1134:                else                          → 1144: §1t9713s0§(20066,-1)
```

`itemdata.xml:10420/10429/10438` name those ids 4241/4242/4243 → `strings.json` "Silver Ore",
"Titanium Ore", "Uncut Diamond" (I printed all three). **The two-tier clause falls.**

---

## Verdicts, one line each

| # | claim | verdict | overturn |
|---|---|---|---|
| 1 | `hunter-s27b/the-reach-cap-in-stage-px…` | **HELD** | upheld |
| 2 | `lens3/271-is-reachable-in-one-stat…` | **HELD** | upheld |
| 3 | `lens3/coins-per-kill-half-of-RR215…` | **HELD** | upheld |
| 4 | `lens3/reinforce-tiers-are-web-code…` | **HELD** (2 minor defects) | upheld |
| 5 | `lens3/web-parity-for-the-6x6-war-board…` | **HELD** | upheld |
| 6 | `s27b/a-territory-is-six-rooms-by-six-rooms…` | **HELD** | upheld |
| 7 | `s27b/stance-ceilings-are-mastery-10…` | **HELD** | upheld |

### #1 — the reach cap. Every cite resolves, and I closed the hole it left open.

`§1t4420s0§` is declared `internal var §1t4420s0§:int = 10;` at `:105`. If that default were live the
whole model would sink — Light would be 14 px and the Heavy floor would clamp always. It is not live:
`:194` assigns it from `param10` of `§1t4443s0§` (`:183`), and **the sole caller is
`§1t1523s0§.as:2268`**, which passes `§1t9592s0§()` into param10 and `§1t9714s0§(1000)/(1001)/(1002)`
into param12/13/14 — so `§1t4421s0§/4422/4423` really are light/balanced/heavy mastery, and the
stance mapping both this finding and #7 rely on is correct.

`§1t9592s0§` (`:2334-2341`) reads SPD and applies the ×1.5 speed buff; `§1t9593s0§` (`:2344-2348`) is
`int(120 + Math.floor((90 + STAT_DAN*5) * SPD / (20 + SPD)))` — the 120 px floor, 210 px asymptote at
Dan 0, +5 px per rebirth, exactly as stated. Arithmetic verified: Light 1.4×[120,210] = [168, 294];
Balanced [120, 252]; Heavy (0.5..0.9)×[120,210] = [60, 189] floored to 100.

**MINOR, non-fatal:** the lane_impact re-read glosses "200" as *Balanced-at-base* where three UPHELD
web findings compute 1.0×210 = **210**, and glosses "100" as the Heavy *floor* where they compute
0.5×210 = **105**. That is wording inside one model, not a contradiction, and the overturn does not
depend on it.

**Build-parity check (C2), which is where a false contradiction would have come from:**
`combat-core/300-200-100-is-base-not-ceiling` reproduces the wiki triple as **android** 200 ×
{1.5, 1.0, 0.5}; `combat-core/reach-table-is-mastery-zero-not-a-ceiling` reproduces 294/210/105 as
**web** 210 × {1.4, 1.0, 0.5}. Two builds, not a disagreement — and I confirmed the divergence is
real at `MCSPlayer.as:3030/3041/3052` (android `1.5`, `1 + 0.005m`, `0.5 + 0.005m` on a 0–100 scale).
This finding **declares** its own build in the `build` field rather than hiding it, which is the
behaviour C2(c) asks for.

### #5 — the 6×6 war board. I ran the call-site grep myself.

`§1t7835s0§` appears **exactly twice** in the entire payload: the declaration at `§1t7785s0§.as:162`
(`param4:int = 6, param5:int = 6`) and one call, `§1t6483s0§.as:588`
`this.§1t8003s0§.§1t7835s0§(param1,param3,param4);` — **three arguments, both defaults taken.**
Class identity is not in doubt: `msgBoard` at `:192`, `leftRoad`/`rightRoad` at `:193-194`, the mapid
sector math at `:196-198`, the `§1t4646s0§` survivalmodedata embed at `:13`, and the identical layout
transform at `:208-209` (`x = 90 + i*55`, `y = 92 + j*55`) against android `:206-207`.

The "defaults, not literals" distinction is worth banking precisely because a citation audit hunting
a literal `6` in the web file finds nothing and would wrongly conclude the board is server-supplied.

### #6 — a territory is 6×6 rooms. I pushed one level past what the finding cites.

The finding asserts the war hexes *are* rooms but does not cite the step. I closed it:
`NodeGenerator.as:1780-1783` `getShiftedNodeId` is the **same function the exploration graph uses for
room exits** at `:703-706` (`destN/destS/destE/destW`), and `WarHexUI.as:209` feeds its result to
`NodeGenerator.instance.getRoomBG(nodeid)` and `territoryData.getLocationType(nodeid)`. So the war
board and the room graph share one coordinate space, `×6` on both axes makes each territory a 6×6
block of node ids, and RR:225 ⑤'s "wilderness = one-screen-per-sector" is dead.

**Independent arithmetic check I ran myself:** `110_Mobile_MapBitmapData.bin` decodes as a 63×72 GIF
with exactly **735** lit pixels (one per territory). 735 × 36 = **26,460** — precisely the
"26,460-sector world" figure a separate upheld finding banked from the node generator. Three
artifacts (a GIF, a UI class, a generator) agree to the unit.

### #4 — the two minor defects, recorded so the rewrite does not inherit them.

1. "**every** reinforce finding so far has carried [the android hedge] (they all read the tiers out of
   the ANDROID string table)" is **false**. `hunter-s26c/web-parity-for-the-three-tier-reinforce`
   (UPHELD, 4 critics, build web v0.717) already discharged it, and I opened its cite —
   `§1t401s0§.as:664-688` is real and branches `<30 / <60 / else` onto
   `getString(850)/(851)/(852)`.
2. lane_impact's "**No android caveat needed**" is right for the mechanic and the item IDs (both web)
   but not for the **names**, which still resolve through android-sourced `itemdata.xml` +
   `strings.json` under C2.

Neither defect touches the core, and the finding is a genuine **strengthening** rather than a
duplicate: `:664-688` proves what the menu *says*; `:1110-1147` proves what the transaction *takes*,
by item id, which is what a rebuild has to ship. That distinction is banked as a new finding below.

---

## New findings (6)

| id | one line |
|---|---|
| `lens3-s27d/v0717-stance-table-carries-a-mastery-9-reconciliation-that-fights-five-upheld-siblings` | Strike the mastery-9 reconciliation clause; `skilldata.xml:74/:75` shows the ledger read `<required>` where the scale is `<value>`. |
| `lens3-s27d/the-271-gate-is-a-strict-less-than-so-the-panel-lands-on-271-not-short-of-it` | Bank the **operator**, not just the formula — a rebuild shipping `<=` produces a 274 cap. |
| `lens3-s27d/the-web-input-manager-keeps-the-clear-name-maxdistance-so-reach-needs-no-android-cite` | `§1t1541s0§.as:106-108` `{ maxDistance = param1; }` — the whole reach chain is web-side; drop the C2 hedge every reach finding carries. |
| `lens3-s27d/base-slash-length-is-halved-by-a-timed-debuff-nobody-has-claimed` | `§1t99s0§.as:223` `this.§1t4420s0§ *= 0.5;` — a curse on its own timer halves reach *and* ATK *and* DEF. No reach finding models it. |
| `lens3-s27d/the-reinforce-materials-are-spent-by-item-id-the-banked-web-cite-only-proves-what-is-printed` | Re-cite the reinforce findings onto the action block `:1087-1147`. |
| `lens3-s27d/735-territories-times-36-nodes-is-exactly-the-banked-26460-node-world` | The world's node count is **derivable**, not measured. |

The debuff one is the most consequential of the six for L5: every reach finding in the corpus models
`base → stance → floor` with no debuff term, and the real pipeline is
`base × (0.5 if cursed) × stanceMult`, floored at 100 for Heavy.

---

## What I compared against (an empty contradiction result is only credible if this list is full)

Searched `LEDGER_EVIDENCE.md` (3,574 lines) and `SEEN_CLAIM_IDS.txt` (1,736 lines) **by artifact**,
not by wording — `§1t99s0§`, `§1t1523s0§`, `§1t5957s0§`, `§1t68s0§`, `§1t401s0§`, `WarHexUI`,
`InputManager`, `NPC.as`, `skilldata.xml`, `itemdata.xml`, plus the numeric strings 271, 237, 5000,
6x6, 300/200/100, 0.9/1.2/1.4, and the ledger line numbers 155/190/201/215/225/245.

Neighbours examined and found **compatible**: `combat-core/300-200-100-is-base-not-ceiling` (android,
C2 — not a contradiction), `combat-core/reach-table-is-mastery-zero-not-a-ceiling`,
`combat-core/stance-reach-is-mastery-zero-base`, `skills-meters/reach-triple-is-a-floor-not-a-ceiling`,
`parity/stance-tables-diverge-web-vs-android`, the `/2.25` letterbox correction (its frame-measured
bands 194–201 / 97–109 / 81–86 sit at or below the source caps, which is exactly what a
body-to-endpoint distance should do against an **arc-length** budget — it corroborates #1 rather than
fighting it), `s26d/war-room-battlefield-board-is-a-hardcoded-6x6-grid`,
`bindata/territory-12bit-packing-and-6x6-nodes`, `meta-social/frame-shows-6x6-sector-board`,
the world-map-bitmap finding (territory layer vs per-territory hex layer — different layers),
`economy/coins-per-kill-and-xp`, `enemies-ai/kill-rewards-close-two-economy-blockers`,
`itemdata/coins-per-kill-is-1-or-5`, `actionscript/coins-per-kill-is-data`,
`hunter-s26c/web-parity-for-the-three-tier-reinforce`,
`payload/reinforce-has-three-material-tiers-not-two`, `progression/271-cap-explained`,
`hunter-s26c/the-271-cap-is-the-web-per-stat-cap-at-level-80`.

Also swept the **Rejected overturns** section (`:3373-3557`) for the six ledger sentences this packet
names. Nothing there undercuts any of these seven overturns.

**Stage-0 corrections check (C1/C3):** no finding in this packet assumes a universal XOR key of 109,
assumes all 42 blobs are UTF-16LE, or treats the audio as unrecoverable. All seven are ActionScript
and XML claims. C1/C3 do not bite. **S0-3** does not bite either — no finding here asserts that
item/skill/npc names are unresolvable numeric IDs; #4 in fact *uses* the resolved table.
