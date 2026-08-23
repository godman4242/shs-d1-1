# Blind cite-lens review — packet `t1-overturns-02` (pass s27b)

**Packet size 7 · judged 7 · skipped 0 · refuted 0 · overturns upheld 7/7 (one narrowly).**

All seven arrived `citelint: RESOLVES`, so the machine had already cleared paths and line
numbers. My job was the part a script cannot do: open each artifact and ask whether it
*says* what the claim says it says. I opened all of them. Below, every line I quote I read
myself.

---

## Summary table

| # | Claim | Verdict | The one thing I found |
|---|---|---|---|
| 1 | `hunter-s26c/web-parity-for-the-per-kill-xp-formula` | **HELD** | "Six further web classes" is five. Off-by-one in prose. |
| 2 | `hunter-s26c/web-parity-for-the-three-tier-reinforce` | **HELD (half-caveated)** | The three-tier *branch* is web. The *5000c and the ore names* are android-only. |
| 3 | `s26c/the-271-cap-IS-the-shipped-level-80-base-stat-cap` | **HELD** | Its soft spot — "`_loc2_` = level" — I closed independently via the android twin. |
| 4 | `s26c/web-offline-save-reset-enumerates-the-same-nineteen-fields` | **HELD** | "Thirteen obfuscated members" is twelve. Count of 19 itself is exact. |
| 5 | `s26c/web-payload-carries-the-same-xp-lvl-times-2-plus-20-setLevel` | **HELD** | Its grep enumeration is exactly right — 7 sites, 7 named, no phantoms. |
| 6 | `s26d/war-room-battlefield-board-is-a-hardcoded-6x6-grid` | **HELD (understated)** | Tagged android-only; web v0.717 carries 6x6 as *default parameters*. |
| 7 | `skills-meters/heavy-stance-damage-is-flat-and-only-heavy-reach-scales` | **HELD, one charge struck** | "Gets the pairing backwards" is FALSE — the ledger's pairing is correct. |

---

## 1 + 5 — the per-kill XP formula (near-duplicates, same artifact)

`reference/decompiled/shs3_payload/scripts/§1t68s0§.as` (1,323 lines). Both quoted lines are
verbatim:

- `:237` `this.xp = this.level * 2 + 20;` — inside `:230 public function init(param1:§1t76s0§) : *`
- `:271` `this.xp = param1 * 2 + 20;` — inside `:258 public function setLevel(param1:int) : *`

The "line for line twin" claim is not rhetoric. Web `:260-278` against android
`NPC.as:241-259`:

| web | android |
|---|---|
| `:260 var _loc2_:Number = param1 / this.level;` | `:241 var factor:Number = lvl / this.level;` |
| `:261-264 if(param1 <= 20){ _loc2_ *= 0.9; }` | `:242-245 if(lvl <= 20){ factor *= 0.9; }` |
| `:266-268 damage/defense/§1t3257s0§ *= _loc2_` | `:247-249 damage/defense/maxhp *= factor` |
| `:271 this.xp = param1 * 2 + 20;` | `:252 this.xp = lvl * 2 + 20;` |
| `:272-278 if(param1 <= 10){ 1/1/1 }` | `:253-259 if(lvl <= 10){ 1/1/1 }` |

`§1t3257s0§` sits in android's `maxhp` slot in five separate positions, which is why the
sub-level-11 one-HP clamp reads through.

**The one defect (claim 1 only).** Its prose says "Six further web classes repeat the
literal" and then lists five files. I ran the grep:

```
$ grep -rn '\* 2 + 20' reference/decompiled/shs3_payload/scripts/
§1t4574s0§.as:39 · §1t4570s0§.as:34 · §1t4555s0§.as:62 · §1t4523s0§.as:66
§1t68s0§.as:237 · §1t68s0§.as:271 · §1t122s0§.as:103
```

Seven sites, six files, **five** beyond `§1t68s0§`. Claim 5 states this correctly as
"SEVEN web sites" and names all seven. Claim 1's "six" is an off-by-one that changes no
conclusion, so it is a note, not a refutation. Claim 5 is the cleaner of the pair.

**Overturn.** RR:215 ① reads verbatim `20+ samples show no XP formula either`. The target
build ships one. That clause falls; both claims scope themselves to it and leave the
coins-per-kill half alone. Upheld.

---

## 2 — three-tier Reinforce: structure is web, *content* is not

Every web line is exact in `§1t401s0§.as` (2,019 lines): `:667` the null/0/13000 bail,
`:672 _loc4_ = _loc3_.getLevel();`, `:673-676` forcing `59` for itemID `13022`, then
`:677 if(_loc4_ < 30)` / `:681 else if(_loc4_ < 60)` / `:685 else` onto `getString(850)`,
`(851)`, `(852)`. Android `InteractUI.as:649-673` is the same code with plain names
(`weaponlevel`, `StatsManager.EQ_WEAPON`). `strings.json["851"]` matches the quote
character for character.

**But I have to say the parity part out loud.** The three-tier *branch* is web v0.717
code and is fully held. The *content* of those tiers — 5000 coins, Silver Ore / Titanium
Ore / Uncut Diamond — exists only in the string table, and:

```
$ find reference -iname '*Lang_EN*'
reference/extracted/android/118_Mobile_Lang_EN.bin
reference/decompiled/shs3_android/scripts/Mobile_Lang_EN.as
reference/decompiled/shs3_android_payload/scripts/Mobile_Lang_EN.as
```

Android, all three. There is no web-side lang bin among the 27 files in
`reference/extracted/bindata/`, and the single occurrence of "unbreakable" in the 329 MB
web `payload.xml` (line 2,634,709) is an unrelated `DefineEditTextTag` reading *"would you
like to make it unbreakable for 5 gold?"* — a different prompt entirely.

So **"three tiers keyed on weapon level, 13022 pinned to level 59, in v0.717"** is held.
**"A flat 5000c in the target build"** still carries the undischarged S0-3 caveat. The
claim's `cite` field does name `strings.json` as the source, so this is scope creep in the
`lane_impact` wording, not a mis-cite.

**Overturn upheld either way:** RR:80 lists `Reinforce 5000c+1 silver ore` as one flat
economy static. The web code proves it is the lowest of three level-keyed branches.

---

## 3 — the 271 cap

`§1t5957s0§.as:3344` verbatim:

```
var _loc6_:Boolean = §1t1523s0§.§1t9714s0§(§1t1523s0§.§1t9408s0§) < 1 + (_loc2_ + 10) * 3;
```

`:3345` and `:3346` repeat it on `§1t9409s0§` and `§1t9410s0§`; `:3350-3352` wire all three
to the ATK/DEF/SPD add-button `.visible` flags.

The claim's weakest link was asserting `_loc2_` is the level. **I did not take that on
trust.** The android twin `InventoryUI.as:2398 public function showStatUpButtons(points:int)`
opens with the identical six `addEventListener` lines and then, in exactly the slot web
`:3340` occupies:

```
:2406  var charlevel:int = StatsManager.getStat(StatsManager.STAT_LEVEL);
```

`_loc2_` is the character level. `1 + (80 + 10) * 3 = 271` exactly, and RR:199 already
carries `cap 80` as Ready. Companion ceilings verbatim: `:3341` HP `10 + (lvl+10)*10` = 910,
`:3342` Chi `10 + (lvl+10)*5` = 460, `:3343` AP `30 + (lvl+10)*5` = 480.

One hair of overreach: this gates the **add button**, so it is an *allocation* ceiling —
whether gear can push a stat past 271 is untouched. The claim calls it a "hard ceiling" but
then correctly says the mechanism is "the panel stops granting", so the substance is right.

**Overturn upheld.** RR:201's `The "271 cap" is gear/rebirth-inclusive (237-point first-run
budget makes it impossible in one stat)` is a wrong explanation of a number the target
build derives in a single line of arithmetic.

---

## 4 — the 19-field offline save

`§1t1832s0§.as:2811` opens `internal function §1t2002s0§(param1:String) : *`; `:2813` is the
quoted `SharedObject.getLocal`; `:2814` sets `saved = false`; then `:2815`–`:2833` blank
members. `2833 − 2815 + 1 = 19`. The count is exact.

**I found a tighter twin than the one cited.** The claim points at android
`QueryManagerBase.as:2912-2930` (the *save* block). The real mirror is
`deleteCharCookieData` at `:2936`, which blanks `:2941-2959` — also nineteen — and aligns
19-for-19 **in order**:

```
nextAPUpdate · nextDTUpdate · lastUpdate · playerLevel · playerStats · equipment ·
skillStats · skillSlots · inventory · stash · questItems · intStats · achievementStats ·
booleanStats · activeQuestList · completedQuestList · playerlocation · taunt · friends
```

against web `:2815`–`:2833` slot for slot, with all seven plain-named web members
(`playerLevel :2818`, `equipment :2820`, `inventory :2823`, `stash :2824`,
`playerlocation :2831`, `taunt :2832`, `friends :2833`) landing on their android namesakes.
The cited save block enumerates the same nineteen in the same order, so the cite still
supports the claim — it is just not the tightest artifact available.

**One arithmetic slip:** "the remaining thirteen web members are obfuscated" — there are
**twelve**. 7 plain + 12 obfuscated = 19. Non-fatal.

**Overturn upheld.** RR:351 reads `Server-sim topology & save format — nothing to copy`.
There is a schema to copy and it is web-side. The claim explicitly leaves the server-sim
half standing, which is the honest scoping.

---

## 6 — the 6×6 war board (the claim *understates* itself)

Every quoted line in `WarHexUI.as` (2,524 lines) is exact: `:175 this.ht = 6;`
`:176 this.wt = 6;` `:206-207` and `:253-254` the `90 + n*55` / `92 + n*55` transforms,
`:229` the array push, `:239 if(strArray.length == 7)`.

The exclusivity sub-claim survives my own grep: 22 mentions of `wt`/`ht` in the file, of
which exactly **two** are assignments (`:175`, `:176`). The rest are loop bounds and the
`:507` bounds check `xpos < 0 || xpos >= this.wt || ypos < 0 || ypos >= this.ht`. Two
corroborations the claim did not use: `:218 else if(i == 5 && ...)` hard-codes the last
column index, and `:195-196` derive the origin as `sector * 6` on both axes.

**Then I checked the web parity the claim did not claim, and it comes out better than
advertised.** `§1t7785s0§.as:162`:

```
public function §1t7835s0§(param1:String, param2:Array, param3:int, param4:int = 6, param5:int = 6) : *
```

v0.717 refactored the dimensions into **default parameters of 6 and 6**; the identical 55 px
pitch and `(90, 92)` origin sit at `:208-209`; and the only caller in the entire payload
(`§1t6483s0§.as:588`) passes three arguments, so both defaults apply. The board is 6×6 at
the target build too. The claim's `android v0.682` build tag is honest but conservative.

Loose prose: "a 7-field record of xpos, ypos, owner, side and strength" — five names for
seven fields (`[3]`, `[4]`, `[5]` go unnamed into the `WarHex` constructor at `:243`).
Incomplete, not wrong; §3 forbids refuting for incompleteness.

**Overturn upheld.** RR:245 ② lists `War-Room map topology (board/adjacency)` as a blocker.
The board half is recoverable from shipped code.

---

## 7 — stance damage vs reach: held, with one charge struck

The measured facts are exact. `§1t99s0§.as`, damage at `:3255`:

```
:3261 case §1t12220s0§:  _loc2_ = _loc1_ * (0.5 + 0.4 * this.§1t4421s0§ * 0.1);
:3264 case §1t12221s0§:  _loc2_ = _loc1_ * (1 + 0.2 * this.§1t4422s0§ * 0.1);
:3267-3270 case 12222/12223/12224:  _loc2_ = _loc1_ * 1.4;      // no mastery term
```

Reach at `:3091` is the mirror image: `:3094` light is a flat `* 1.4`, `:3105` balanced
scales on `§1t4422s0§`, `:3116` heavy scales on `§1t4423s0§` **and** `:3117-3119` clamps
`if(this.§1t4417s0§ < 100){ this.§1t4417s0§ = 100; }`. Stance identity is corroborated by
the rock-paper-scissors triangle at `§1t4904s0§.as:419/:427` cycling 12220→12221→12222→12220.

So *"exactly one of the three stances is mastery-flat in each table, and it is a different
stance in each"* is **true**.

**What fails is the opening charge.** The claim says RR:155 "gets the pairing backwards". I
read RR:155-156 verbatim: `(Heavy is fixed)` attaches to the damage triple, and
`Heavy's *reach* also scales ×0.5→×0.9` attaches to reach. **Both are exactly what the code
does.** The pairing is right; the ledger is merely *silent* on light-reach and
balanced-reach. The claim's own closing sentence concedes precisely this — its headline and
its conclusion disagree with each other.

What genuinely survives as an overturn is the reach half. I checked the arithmetic: the
triple 300/200/100 is not reproducible from ×1.4 / ×(1.0→1.2) / ×(0.5→0.9) at any single
base. A base of 214.3 yields light 300 but balanced 214.3, not 200. And heavy's 100 is a
hard clamp, not a table entry.

Refuting this for one bad sentence would destroy four correct measured formulas. **HELD,
with the "backwards pairing" charge struck.** Overturn upheld *narrowly*: the
`reach 300/200/100` clause of RR:155 falls; the damage clause of the same sentence stands.

---

## Three new findings, all from artifacts I opened while judging

**N1 — `s27b/stance-ceilings-are-mastery-10-not-mastery-9`.** RR:155 calls 0.9/1.2/1.4 the
*mastery-9* ceilings. `§1t99s0§.as:3262` is `0.5 + 0.04m` → **0.86** at m=9, 0.9 only at
m=10; `:3265` is `1 + 0.02m` → **1.18** at m=9, 1.20 only at m=10. Either the scale runs
0–10 and the "-9" label is off by one, or the scale stops at 9 and the printed ceilings are
unreachable. Both readings force a ledger edit. The mastery cap itself is **STILL_UNHELD**
from this file.

**N2 — `s27b/v0717-rebalanced-the-manual-stat-caps-upward-vs-v0682`.** A hard counterexample
to build parity, found while checking claim 3. Same function, different formulas:

| stat | android `InventoryUI.as` | @L80 | web `§1t5957s0§.as` | @L80 |
|---|---|---|---|---|
| ATK/DEF/SPD | `:2410-2412` `charlevel + 10` | 90 | `:3344-3346` `1 + (lvl+10)*3` | **271** |
| MAXHP | `:2407` `10 + (lvl+10)*5` | 460 | `:3341` `10 + (lvl+10)*10` | **910** |
| MAXAP | `:2409` `20 + (lvl+10)` | 110 | `:3343` `30 + (lvl+10)*5` | **480** |
| MAXCHI | `:2408` `10 + (lvl+10)*5` | 460 | `:3342` `10 + (lvl+10)*5` | 460 |

Four of six caps diverge; only Chi is identical. This turns ⚠ S0-3 from a hedge into a
proven hazard — the data XMLs match row for row, but progression tuning demonstrably does
not. Any INFERRED progression number ported from an android artifact must be re-derived
web-side before it is called CONTRACT.

**N3 — `s27b/a-territory-is-six-rooms-by-six-rooms-in-both-builds`.** `WarHexUI.as:195-196`
`zeronodex = (mapid >> 12 & 0x0FFF) * 6` / `zeronodey = (mapid & 0x0FFF) * 6`, packed at
`:197` and walked at `:208` via `getShiftedNodeId(zeronodeid, i, j)`. The `* 6` is what makes
each territory occupy a 6×6 block of node ids — **the war hex grid IS the room grid, one hex
per room**. Web carries the identical transform at `§1t7785s0§.as:196-197`. This bears on
RR:225 ⑤ `sector↔room mapping rule`: the rule is 6×6 rooms per sector, node id
`= (sectorX*6 + i) << 12 | (sectorY*6 + j)`, and the war board and exploration room graph
are one coordinate space, not two systems to reconcile.

---

## Method note

No `docs/gauntlet/L0/critics/*.md` or `docs/gauntlet/L0/sources/*.md` was opened (§3.2).
Every verdict above rests on a decompiled script, a payload row, or a ledger line I read
myself. Nothing outside
`docs/gauntlet/L0/critics/t1-overturns-02.cite.s27b.{json,md}` was modified.
