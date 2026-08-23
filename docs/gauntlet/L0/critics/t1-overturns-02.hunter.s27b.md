# t1-overturns-02 — HUNTER LENS review (s27b)

Packet: `docs/gauntlet/L0/worklist/t1-overturns-02.json` — 7 findings, all claiming a
REBUILD_READINESS overturn. **Judged: 7 of 7. Skipped: none. Refuted: none.**
Overturn upheld: 7 of 7, two of them explicitly PARTIAL by the finding's own wording,
which is the correct scoping and not a defect.

Every verdict below rests on an artifact I opened myself. No verdict here was formed
from another agent's prose; I did not open `critics/` or `sources/`.

---

## Summary table

| # | claim | refuted | overturn | severity |
|---|---|---|---|---|
| 1 | web-parity-for-the-per-kill-xp-formula | no | upheld (partial by design) | minor |
| 2 | web-parity-for-the-three-tier-reinforce | no | upheld | material |
| 3 | the-271-cap-IS-the-shipped-level-80-base-stat-cap | no | upheld | **fatal** |
| 4 | web-offline-save-reset-enumerates-the-same-nineteen-fields | no | upheld | material |
| 5 | web-payload-carries-the-same-xp-lvl-times-2-plus-20-setLevel | no | upheld (partial by design) | material |
| 6 | war-room-battlefield-board-is-a-hardcoded-6x6-grid | no | upheld | minor |
| 7 | heavy-stance-damage-is-flat-and-only-heavy-reach-scales | no | upheld | material |

A zero-refutation packet is unusual and I treated it as a warning sign, so I spent the
review trying to break each one at its weakest joint rather than confirming it. The
joints I attacked were: the android-string dependency in #2, the gear-inclusiveness of
the stat read in #3, the "positionally aligned" hand-wave in #4, the word "hardcoded"
in #6, and the stance identities in #7. Four survived intact; #6's adjective did not
survive the port to the target build, which is why it is graded minor rather than clean.

---

## 1 & 5 — per-kill XP = level × 2 + 20 (the same claim, twice)

Both hold. I opened `reference/decompiled/shs3_payload/scripts/§1t68s0§.as` and read
:237 and :258–277 directly. The two quoted lines are verbatim, and the whole `setLevel`
is a statement-for-statement twin of android `NPC.as:239-260` — factor `lvl/level`, the
`×0.9` pre-scale below level 21, the xp line, and the clamp of damage/defense/hp to `1`
at or below level 10.

I re-derived the census rather than trusting it:

```
$ grep -rn '\* 2 + 20' reference/decompiled/shs3_payload/scripts/
§1t4574s0§.as:39  ·  §1t4570s0§.as:34  ·  §1t4555s0§.as:62  ·  §1t4523s0§.as:66
§1t68s0§.as:237   ·  §1t68s0§.as:271   ·  §1t122s0§.as:103
```

Seven sites. Claim #5 says seven and is right. Claim #1 says "**six** further web classes"
and then lists **five** — a miscount, graded minor, not a refutation.

**Overturn.** RR:215 ① reads *"coins-per-kill reality (`=8` is an unconfirmed INFERRED
seed; 20+ samples show no XP formula either)."* The `no XP formula either` clause dies at
the target build. The coins-per-kill clause is untouched and both findings say so
themselves — that self-limitation is why I upheld rather than trimmed them.

**One scope correction for the rewrite.** Claim #5's lane_impact says the same twin
supplies RR:220 ① *enemy level→stat formula* and ② *per-enemy HP*. It supplies the
**scaling rule** (multiply damage/defense/hp by `lvl/baseLevel`, ×0.9 below 21, floor at
1 below 11) but **not the base stats it scales** — those live in the npcdata rows, which
are v0.682 under correction C2. So ① closes; ② closes only for the sub-level-11 band,
where hp is literally `1`.

---

## 2 — reinforce has three material tiers (and I closed its android dependency)

Every display line checks at the exact number in `§1t401s0§.as`: :662 `getString(848,
[_loc1_ * 10])`, :667 the null / itemID 0 / itemID 13000 bail, :672 `getLevel()`,
:673–675 forcing 59 for itemID 13022, and :677 / :681 / :685 branching `<30 / <60 / else`
onto strings 850 / 851 / 852. `strings.json["850"|"851"|"852"]` are Silver Ore, Titanium
Ore and Uncut Diamond, each reading `Cost: 5000 coins`.

**The joint I attacked.** The cite leans on the **android** string table (S0-3, v0.682)
for the material *names* while asserting *web* behaviour. That is a real parity hole and
it is the reason this claim could have fallen.

**It is now shut, without the string table.** I found the web *transaction* handler at
`§1t401s0§.as:1087-1140`. The decompiler kept its plain names:

```
:1087  cost = 5000;
:1105  weaponlevel = weapon.getLevel();
:1106  if(weapon.§1t483s0§() == 13022)
:1108      weaponlevel = 59;
:1110  if(weaponlevel < 30)      -> consumes item 20064
:1122  else if(weaponlevel < 60) -> consumes item 20065
:1134  else                      -> consumes item 20066
```

`resolved_names.json` → 20064 **Silver Ore**, 20065 **Titanium Ore**, 20066 **Uncut
Diamond**, matching strings 850/851/852 one for one. The three-tier reinforce is now
web-native evidence end to end, and itemID 13022 resolves to **Pickaxe** — the game
hard-codes the pickaxe to level 59 so it reinforces with Titanium Ore rather than diamond.

**Overturn upheld.** RR:80's `Reinforce 5000c+1 silver ore` is the lowest of three tiers,
keyed on *weapon* level (not player level), at a flat 5000c.

---

## 3 — the 271 cap. The only *fatal* grade in the packet.

`§1t5957s0§.as:3340` reads the level into `_loc2_`; :3341–3346 are six add-button gates,
assigned in the same order to the six `statsPanel` buttons at :3347–3352 (`HPadd` is
plain-named, which anchors the whole mapping). :3344 is verbatim as quoted.

```
1 + (80 + 10) * 3 = 271        exactly
HP    10 + (80+10)*10 = 910
CHI   10 + (80+10)*5  = 460
AP    30 + (80+10)*5  = 480
```

**The joint I attacked:** if the read were gear-inclusive, the ledger would survive. It
is not. The android twin uses `StatsManager.getStat`, and `StatsManager.as:3927-3951`
shows `getStat` on a PLAYERSTAT falling through to `getPlayerStats(id)`, with gear held
in a *separate* term (`findBonusStat`, :1932). So 271 is a **base, gear-exclusive** panel
ceiling.

RR:201 — *"The '271 cap' is gear/rebirth-inclusive (237-point first-run budget makes it
impossible in one stat)"* — is not under-specified, it is **wrong about what 271 is**.
Graded fatal because that sentence asserts a false provenance for a number the config is
meant to ship.

**One honest limit to carry into the rewrite:** the ceiling caps *point-bought* base stat.
Equipment can still push the effective stat past 271. Write it as
`STAT_CAP_BASE_ATK/DEF/SPD`, not "hard ceiling".

---

## 4 — the 19-field offline save (and a better twin than the one cited)

Verified at every named line in `§1t1832s0§.as`: :2811 the function, :2813
`SharedObject.getLocal(... + "_" + param1)`, :2818 `playerLevel`, :2820 `equipment`,
:2823 `inventory`, :2824 `stash`, :2831/:2832/:2833 `playerlocation` / `taunt` /
`friends`. I counted the blanked members myself — **2815 through 2833 inclusive is
nineteen**.

**The joint I attacked:** "the remaining thirteen web members are obfuscated but
positionally aligned" is exactly the kind of assertion that should not be taken on
trust. So I went looking for a tighter twin than the cited `QueryManagerBase.as:2912-2930`
save path, and found `deleteCharCookieData` at **`QueryManagerBase.as:2936-2961`** —
same `saved = false` preamble, nineteen blanked fields, identical order.

Checked positionally: android index 4 `playerLevel`, 6 `equipment`, 9 `inventory`,
10 `stash`, 17/18/19 `playerlocation`/`taunt`/`friends`. All six plain-named web members
land on the same index as their android namesake. The thirteen obfuscated web members are
therefore **nameable**, not merely countable — a strictly stronger result than the finding
claimed.

**Overturn upheld.** §6 is headed *"What is structurally UNRECOVERABLE"* and :351 says
*"Server-sim topology & save format — nothing to copy."* There is now a complete,
copyable 19-field SharedObject schema in the target build, with order and per-field
serializer. The finding correctly leaves the *server-sim topology* clause standing.

---

## 6 — the War-Room 6×6 board. True; one adjective does not survive.

Android side is exact. I confirmed the exclusivity claim rather than accepting it:
`grep '\bht\b\|\bwt\b' WarHexUI.as` returns declarations at :73/:75, assignments **only**
at :175/:176, and every other use is a loop bound or the bounds check at :507
(`xpos < 0 || xpos >= this.wt || ypos < 0 || ypos >= this.ht`). Line :218
(`else if(i == 5 && ...)`) independently pins `wt = 6`.

**Two things I add rather than subtract.**

1. **Adjacency is not an inference.** It is explicit at `WarHexUI.as:677-689`
   `isNextToPlayer`: same `y` with `|dx| <= 1`, or same `x` with `|dy| <= 1`. Despite the
   "hex" naming this is a **4-connected square grid**, and `getExitOwner` applies the same
   4-neighbour rule one level up at territory scale.

2. **"Hardcoded" does not survive the port.** The web twin is
   `§1t7785s0§.as:162`:
   `public function §1t7835s0§(param1:String, param2:Array, param3:int, param4:int = 6, param5:int = 6)`
   with :176–177 `this.ht = param4; this.wt = param5;` — **parameterised, with defaults of
   6 and 6**. I grepped every call site: exactly one, `§1t6483s0§.as:588`, passing three
   arguments, so both defaults always apply. Pitch, origin, record format and adjacency
   are identical on web (:208–209, :246, :261–262, :719–723).

So the finding is **true and its android-only build label is now unnecessary** — I
discharged its own hedge. Only the adjective is build-specific, hence minor.

**Overturn upheld.** RR:245 ② names *board* and *adjacency*; both are now sourced. It
stays PARTIAL in the sense the finding itself states: the per-hex ownership/strength feed
is still server-side, and the world-map territory **set** (RR:115) is untouched.

---

## 7 — the stance tables. Verified twice over.

Reach, `§1t99s0§.as:3091-3121`: :3094 light `= base * 1.4`, **no mastery term**; :3105
balanced `= base * (1 + 0.2*m*0.1)`; :3116 heavy `= base * (0.5 + 0.4*m*0.1)` with
:3117–3119 clamping to a floor of **100**.
Damage, `§1t99s0§.as:3255-3274`: :3262 light scales, :3265 balanced scales, :3267–3270
three cases falling through to `_loc2_ = _loc1_ * 1.4` with **no mastery term**.

**The joint I attacked:** the stance identities are obfuscated constants. If
`§1t12222s0§` were not Heavy the whole finding inverts. I pinned them independently at
`§1t5957s0§.as:2722-2748`, the stats-panel readout carrying the same six formulas plus
two tells — `§1t12222s0§` alone gets `:2746 _loc47_ = 0.8;`, which is RR:74's
*"Heavy defender Defense ×0.8 (one way)"*; and the mastery stat ids run 1000 / 1001 / 1002
in the order 12220 / 12221 / 12222. Mastery-9 substitution then reproduces RR:155's own
damage triple (0.86 ≈ 0.9, 1.18 ≈ 1.2, 1.4), which confirms the mapping from the ledger's
side.

**The arithmetic claim also checks.** At mastery 9 the reach multipliers are 1.4 / 1.18 /
0.86, so 300/1.4 = 214.3, 200/1.18 = 169.5, 100/0.86 = 116.3 — no single base yields
300/200/100.

**Overturn upheld.** RR:155's headline — *"reach 300/200/100 are MASTERY-9 CEILING
values"* — is false: **light reach has no mastery term at all**, so 300 cannot be its
mastery-9 ceiling, and heavy reach at low mastery is pinned by a hard 100 floor the
ledger never names.

**One rhetorical overreach I decline to refute on.** The text says the ledger "gets the
pairing backwards". It does not — the ledger correctly pairs Heavy-fixed with *damage*
and Heavy-scaling with *reach*. Its real defect is **silence about light and balanced
reach**, which is what the finding then proves. Substance holds; drop that phrase.

---

# New findings (Lens 2a — what nobody has claimed)

Five, four HELD and one honestly PARTIAL. All from artifacts I opened while judging.

### N1 · Forge is a node-level formula, not the economy static RR:80 ships — **HELD**
`§1t401s0§.as:1954` reads the **current node** level, :1955–1957 clamps it to 80, :1959
sets `param1 = _loc3_ * 100`, and the sword you receive is a random sword *of that level*.
Materials branch on the same node level at :1968 / :1980 / :1993 — `<30`: 2× 20061;
`<60`: 1× 20062 + 2× 20063; else 2× 20061 + 2× 20060 + 1× 20065 → Iron Ore / Tin Ore +
Copper Ore / Iron Ore + Coal + Titanium Ore, matching strings 845 / 846 / 847 exactly.
Android `InteractUI.as:1003` `level = StageManager.getCurrentNodeLevel();` and :1008
`cost = level * 100;` supply the plain names that identify the obfuscated web accessor.
**RR:80's "Forge 700c+2 ore" is a node-level-7 blacksmith forging an iron sword** — the
lowest of three tiers, presented as a constant. Ship `FORGE_COST = min(nodeLevel,80)*100`.

### N2 · Repair-Weapon cost = nodeLevel × 10 — RR:215 ③ **CLOSES** — **HELD**
`§1t401s0§.as:1058` `cost = §1t1525s0§.§1t9936s0§() * 10;` — the same node-level accessor
the forge block uses at :1954 — with the menu copy at :662 formatting `getString(848)`
with `[_loc1_ * 10]`. Android `InteractUI.as:1058` is unobfuscated:
`cost = StageManager.getCurrentNodeLevel() * 10;`. The repair is a **durability reset**,
not a stat restore (`:1073-1075 if(weapon.uses > 1) { weapon.uses = 1; }`), refused on a
null weapon or itemID 0 / 13000. RR:215 blocker ③ *"Repair-Weapon cost (never captured)"*
is captured; no Ruffle session is needed for it.

### N3 · Web and Android per-stat ceilings diverge by 3× — **HELD** (lane methodology)
The first **measured instance** of the S0-3 parity hole.

| stat | web v0.717 `§1t5957s0§.as:3341-3346` | android v0.682 `InventoryUI.as:2407-2412` | @L80 |
|---|---|---|---|
| HP | `10 + (lvl+10)*10` | `10 + (lvl+10)*5` | 910 vs 460 |
| CHI | `10 + (lvl+10)*5` | `10 + (lvl+10)*5` | 460 vs 460 |
| AP | `30 + (lvl+10)*5` | `20 + (lvl+10)` | 480 vs 90 |
| ATK/DEF/SPD | `1 + (lvl+10)*3` | `lvl + 10` | **271 vs 90** |

The two blocks are otherwise line-for-line twins (same six buttons, same order, same
"more than two capped" nag), so this is deliberate retuning between builds, not a
decompiler artifact. **Only CHI survives the version change unchanged.** Consequence:
"android says X" is never by itself evidence about v0.717 for a *tuning* number.

### N4 · CRIT ×1.3 and Heavy-defender ×0.8 are in target-build source — **HELD**
RR:153–154 keeps `CRIT_MULT=1.3` on **wiki** authority and asks for one more artifact —
*"(Read a real OG crit popup to fully seal it.)"* The seal is in source.
`§1t99s0§.as:3274` `return _loc2_ * 1.3 + this.§1t1243s0§;` is the return path of the
stance damage roll, taken when :3272's equality holds; and `§1t5957s0§.as:2727 / :2736 /
:2745` each set `_loc42_ = 1.3;` for all three stances, applied at :2751–2752. The same
block seals RR:74's other clause at :2746 `_loc47_ = 0.8;`, set **only** in the heavy
branch. **Still open:** the crit *proc* rule (RR:159 ⑤) — :3272 tests an equality between
two obfuscated members, not a probability.

### N5 · Heavy reach has a hard 100 px floor; "reach cap in px" is **half** closed — **PARTIAL**
Closed: the per-stance multipliers, the mastery curve on each, and one absolute px
quantity — `§1t99s0§.as:3117-3119` clamps heavy reach to **100**, the first reach number
this lane has in pixels from *source* rather than from a video measurement.
Still open: the base `§1t4420s0§` all three multiply, which is set elsewhere and which I
did not resolve. RR:88's *"reach cap in px per stance"* therefore survives in reduced
form. I record this PARTIAL deliberately: without the base, the multipliers cannot be
turned into pixels for light or balanced. **Do not ship 300/200/100 as px.** The
remaining measurement is one number, not three.

---

## Standing-invariant note

No measurement-doc-vs-frame conflict arose in this packet — every finding here is an A2
payload/AS3 claim and I judged all seven against the decompiled source directly. No frame
was needed and none was cited, so the "frame wins" rule was never engaged.
