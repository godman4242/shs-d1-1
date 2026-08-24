# Blind critic — cite lens — packet `t1-overturns-03` (s27e)

**Packet size 7 · judged 7 · skipped 0 · refuted 1 · survived 6 · new findings 7**

All seven claims are `citelint: RESOLVES`, artifact class A2, and all seven assert a ledger
overturn. I opened every cited file myself. Under §0 nothing here is admissible on another
agent's word, so every verdict below names the artifact **I** opened.

---

## Verdict table

| # | claim | refuted | overturn upheld | severity of defect |
|---|-------|---------|-----------------|--------------------|
| nf1 | stance mastery cap is 10 | **no** | yes | minor |
| nf2 | mastery floors at 1, not 0 | **no** | yes | minor (under-claimed) |
| nf3 | slash budget is spent in stage px, web-side | **no** | yes | minor (wrong RR line in prose) |
| nf4 | per-kill XP formula is in the web build | **no** | yes (XP clause only) | **material** (lane_impact over-claim + off-by-one anchors) |
| nf5 | NodeGenerator carries a territory→**room** transform | **YES** | **no** | **material** |
| nf6 | war-board adjacency is in code | **no** | yes | minor (hedge is dischargeable) |
| nf7 | 271 cap is neither gear- nor rebirth-inclusive | **no** | yes | minor |

---

## nf1 — mastery cap is 10 — **HOLDS**

Cites are byte-exact. I parsed `reference/extracted/skilldata.xml` rather than eyeballing it:
skills 1000/1001/1002 are `passive=1`, categories 1/2/3, each with exactly **ten** `<level>`
rows, `<value>` 1..10, `<required>` 1,1,2,3,4,5,6,7,8,9. Skill 1000 does occupy lines 3–80.
The gating lines resolve exactly where claimed —
`:1238 <req><has><id>1000</id><qty>10</qty></has></req>`, `:1254` for 1001, `:1270` for 1002.
A tree cannot require ten ranks of a mastery capped at nine.

The web corroboration is not a coincidence argument, it is arithmetic on lines I read:
`§1t99s0§.as:3262` is verbatim `_loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);` and
`:3265` `… * (1 + 0.2 * this.§1t4422s0§ * 0.1);`. That is 0.5+0.04·m and 1+0.02·m.
At **m=10** → 0.9 and 1.2, the ledger's own printed numbers. At m=9 → 0.86 and 1.18.
I also checked the reach side: `:3116` `… * (0.5 + 0.4 * this.§1t4423s0§ * 0.1)` reaches the
ledger's own Heavy `×0.9` ceiling only at m=10.

**RR:155's "MASTERY-9 CEILING" label falls; its numbers survive.**

Defect (minor, non-refuting): reading `<required>` as *character* level is an inference —
I found no code in either build consuming that column. Ship `MASTERY_CAP = 10` as CONTRACT,
the "level 9 unlocks rank 10" gate as INFERRED.

## nf2 — mastery floors at 1 — **HOLDS, and is under-claimed**

`StatsManager.as:2144-2146` is verbatim `skillStats.push(new IntStat(1000,1));` / `(1001,1)` /
`(1002,1)`, and `:1834` passes `getStat(1000)/(1001)/(1002)` into `initPlayer`. I checked the
argument positions rather than trusting the mapping: the web signature at `§1t99s0§.as:183`
takes 15 params, `:196-198` assigns param12/13/14 into `§1t4421s0§/§1t4422s0§/§1t4423s0§`, and the
android call site puts the three `getStat` reads at exactly positions 12/13/14. Those are the
same three slots the damage formulas and the Heavy-reach formula read.

So m ≥ 1 always → **Light ×0.54, Balanced ×1.02**, Heavy genuinely fixed at 1.4 (`:3270`).
RR:156's first two multipliers fall; its "Heavy is fixed" clause stands.
The lane_impact's Heavy-reach note checks out at `:3116-3119`.

**The C2 hedge it books is unnecessary** — see new finding `nfx1`: the WEB payload seeds the
identical three masteries at 1, at `§1t1523s0§.as:1058-1060` (creation) and `:2586-2588` (respec).

## nf3 — slash budget in stage pixels — **HOLDS**

Both quoted lines are byte-exact (`:51 internal static var maxDistance:int = 200;` and the
full `:349` bounds test). I closed the gap the finding leaves implicit: `§1t10094s0§` at
`:106-109` does nothing but `maxDistance = param1;`, and `:202` loads the per-stroke budget
`§1t10078s0§` from `maxDistance` on mouse-down — so the per-stance `slashLength` pushed at
`§1t99s0§.as:3158` *is* the budget, spent at `:363-367` by `sqrt` of the squared step.

The coordinate space is settled by `:343-344` (pointer de-offset and de-scaled) and `:349`
(bounds-tested against `§1t1523s0§.stageWidth/stageHeight`) — and I read that stage:
`§1t1523s0§.as:104 stageWidth = 800`, `:106 stageHeight = 480`, **in the web payload**.
RR:190 ①'s "units of unknown scale" premise is dead; the 100 px Heavy floor is 1/8 stage width.

Defect (minor, prose only): the finding credits "RR:169" with the 800×480 note. RR:169 is the
stance-coloured portrait ring; the resolution note is RR:171. Irrelevant to the verdict — the
resolution is in the payload source, not in the ledger.

## nf4 — per-kill XP formula exists web-side — **HOLDS, with a material scope defect**

The claim is true. `§1t68s0§.as` carries `§1t12070s0§` = calcXP, and android `NPC.as:166-190`
is the named twin — including `§1t12068s0§`=`getGreyLevel` and `§1t12069s0§`=`getZeroDifference`.
It is invoked on death at `:888` with `(§1t1523s0§.getLevel(), this.level, this.xp, false)`,
exactly as quoted. **RR:215's clause "20+ samples show no XP formula either" is refuted.**

Two defects:

1. **Every per-line anchor is off by one.** The `1 + 0.05` line is **198**, not 197. The
   `1 - (…)/…` line is **202**, not 201. The guards are 187-190 and 191-194, not 186-189 /
   190-193. Elite doubling is 204-207, not 203-206. The formal cite *range* 184-207 does
   contain 198 and 202, so the cite resolves — but the anchors must be corrected before this
   text reaches the ledger.
2. **`lane_impact` over-claims.** "delete RR:215 blocker (1) whole" is wrong. Blocker ① is two
   assertions; nothing in `§1t68s0§.as` or `NPC.as` says anything about coins-per-kill or the
   `=8` seed. **Strike the XP clause; leave the coins clause open.**

## nf5 — "NodeGenerator carries the territory→room transform" — **REFUTED**

Its line cites are verbatim-exact and the floor/mod-6 transform is real. That is not the
problem. The problem is the sentence the overturn rests on, written in capitals:
*"A SECTOR IS A ROOM, ONE TO ONE."* **The same file contradicts it.**

- `NodeGenerator.as:1434-1436` — `roomData.roomid = 0; roomDataVector.push(roomData);`
  `if(hasMoreRooms && generateInnerRooms)` … and it keeps generating **inner** rooms into the
  same vector.
- `:1464-1480` hand that vector to `createDungeon` / `createTempleDungeon` / `createCave` /
  `createMine` / `createRuins`.
- `:1710` indexes `QuestEngine.getNodeData(nodeid).getRoomData()[roomid]`.
- `:1791-1795` `getShiftedRoomId` packs a room id in **8 bits**, a different id space from the
  nodeid's 12-bit packing.

One sector owns an **array** of rooms. The transform at `:300` / `:318` is therefore
territory ↔ **SECTOR**, which is the pair `RR:224` already lists under **Ready**
("territory/sector coord system"). `RR:225 ⑤` asks the *further* sector↔room question, and this
artifact does not answer it. So the ledger does **not** invert the vocabulary, and applying the
finding's edit would introduce an error into a line that is currently correct.

Its stated disproof of "one-screen-per-sector" is also a non-sequitur — "36 rooms per
territory" is 36 **sectors** per territory. The real disproof is `:1777`,
`return 800 + RNG.getRandAfterXTimes(nodeid,3,800);`: a room is 800–1600 px wide, i.e. **one to
two** 800 px screens.

**Salvage:** the floor/mod-6 territory↔sector transform is genuine, general (keyed on a raw
nodeid, so town and wilderness alike), and web-corroborated at `§1t7785s0§.as:196-198`
(`(mapid>>12 & 0xFFF) * 6`). Keep that; discard the room identity and the RR:225 overturn.
Recorded as new finding `nfx3` so the salvage is not lost with the refutation.

## nf6 — war-board adjacency — **HOLDS, and its hedge is dischargeable**

`WarHexUI.as:445/449/453` are byte-exact. The rule is as described: xpos 0 → (tx−1,ty),
xpos 5 → (tx+1,ty), ypos 0 → (tx,ty−1), ypos 5 → (tx,ty+1), interior returns 0 — four-neighbour
orthogonal territory adjacency on a 341-origin war map. I checked both consumer sites:
`:211-222` gates the left/right road art on `getExitOwner(i,j) != -1` inside a 6×6 `i/j` fill
loop (`:206-207`, 55 px pitch), and `:259` feeds `adjacentTerrOwner` into the
spawn-point/frontline logic. **Both halves of RR:245 ② fall together.**

The finding says "the getExitOwner body was not separately line-cited web-side — C2 hedge
stands on this one". It does not stand: `§1t7785s0§.as:478-499` is the same function in the
**web** payload, same `- 341` origin at `:480-481`, same 0/5 edge dispatch at `:482-497`.
Recorded as `nfx2`.

## nf7 — the 271 cap — **HOLDS on both adjectives**

Every cite is byte-exact, including the twin pair: `§1t401s0§.as:1112` and
`InteractUI.as:1104` sit in identical surrounding context (weapon `13022` → `weaponlevel = 59`
→ `if(weaponlevel < 30)`), which does establish `§1t9714s0§` = `getStat`.

**Gear.** Rather than rest on that chain, I opened `§1t9714s0§` itself at `§1t1523s0§.as:4593`.
Its PLAYERSTAT branch special-cases id 10 (level) and 91/92, then ends
`:4618 return §1t7356s0§(param1);` — the base accessor at `:958-961` — with **no**
`§1t7358s0§`/findBonusStat term anywhere in the branch. Gear is added at the point of use
(`:2336 §1t7356s0§(§1t9410s0§) + §1t7358s0§(§1t9410s0§)`). So the cap gate at `:3344-3346`
compares **base** ATK/DEF/SPD against `1 + (level+10)*3` = **271** at level 80.

**Rebirth.** Android `:2135 (getLevel() - 1) * 3` has no `STAT_DAN` term while `:2156` does —
and the **web** build repeats the same pointed contrast: `§1t5957s0§.as:3461 (getLevel()-1)*3`
against `§1t1523s0§.as:2598 getLevel() - 1 + §1t7356s0§(§1t9426s0§) * (§1t9470s0§ - 1)`.
Rebirth multiplies **skill** points, not **stat** points.

**RR:201's sentence falls whole.** Its 237-vs-271 arithmetic is correct but proves only that a
first-run character cannot reach a validation ceiling.

---

## New findings (7)

| id | what | ledger effect |
|----|------|---------------|
| `nfx1` | web payload seeds all three stance masteries at 1 (`§1t1523s0§.as:1058-1060`, `:2586-2588`) | removes nf2's C2 hedge |
| `nfx2` | web payload carries `getExitOwner` verbatim (`§1t7785s0§.as:478-499`) | removes nf6's C2 hedge |
| `nfx3` | a sector owns a **room vector** (`NodeGenerator.as:1434-1436`, `:1464`, `:1710`, `:1777`) | **RR:225 ⑤ STAYS OPEN** |
| `nfx4` | `getStat` PLAYERSTAT branch is base-only (`§1t1523s0§.as:4605-4618`) | pure-web proof for RR:201 |
| `nfx5` | stage is declared **800×480** in the payload (`§1t1523s0§.as:104`, `:106`) | RR:235 ①'s "read it in a build" is already satisfied |
| `nfx6` | base slash length `120 + floor((90 + dan*5)*spd/(20+spd))` is web-confirmed (`§1t1523s0§.as:2346-2347`) | RR:190 ① closes on **value**, not just unit |
| `nfx7` | reach multipliers **invert** the damage ones — Light reaches furthest (`§1t99s0§.as:3094` `×1.4` fixed), Heavy shortest (`:3116-3120`, 100 px floor) | RR:190 ① — drop the "measure from footage" close-path |

`nfx7` also explains the ledger's 300/200/100 ordering without any footage: the stance that
hits hardest reaches shortest, and each stance's reach is governed by its **own** mastery.

## Standing-invariant note

No frame-vs-doc conflict arose in this packet — all seven claims are A2 payload rows, and I
judged them against the payload. No file outside this journal path was modified.
