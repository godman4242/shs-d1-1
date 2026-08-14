# GAUNTLET L0 — system survey: **rebirth-elements** (PASS 2, post-S0-3)

Ledger under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20), §2 row + §4 block
`### rebirth-elements — 30`, plus §3 correction #7.

> **This file replaces the PASS-1 survey banked in commit `c3ea839` (marked UNVERIFIED).**
> PASS 1 was largely right and its projectile/statue work is carried forward below,
> **re-verified line by line** (§B). Two of its claims are **WRONG and are retracted here**
> (§C): its `C8` asserted the display-string table is "not on disk", and its `C6` counted
> "9 Dan titles" without resolving them. STAGE-0b finding **S0-3** killed that blocker —
> the table is `reference/extracted/android/118_Mobile_Lang_EN.bin`, 2,533 entries,
> pre-resolved to `docs/gauntlet/L0/index/strings.json`. Every string index PASS 1 left
> dangling is resolved verbatim below.

**Re-score: 30 → 88.**

---

## §0 METHOD + the caveat that governs every number

Two bundles are in play:

- `reference/decompiled/shs3_payload/` — the **real desktop client, v0.717**, fully obfuscated
  (`§1t….as` symbol names).
- `reference/decompiled/shs3_android/` == `…/shs3_android_payload/` — client **v0.682**,
  970 classes, **unobfuscated**. Used as a *naming key*, never as the numeric authority.

Every load-bearing number below was re-read in the desktop payload before being banked.
Six cross-checks passed structurally identical; **one diverged and the desktop value wins**
(heavenly gold, §A7).

The XML data files in `reference/extracted/` (`skilldata.xml`, `itemdata.xml`) are the
**web/desktop** payload's own bindata. The string table is **android-sourced** — so *names
and UI copy* carry the v0.682 label, while *skill numbers* are v0.717.

**The "frame wins" clause never fired.** I enumerated all **113** frame directories in
`docs/gauntlet/L0/index/frames.json`: none shows the rebirth flow, the element circle, or a
Dan title. There is no doc-vs-frame conflict to adjudicate in this lane. (PASS 1 said "60
directories" in its C12 and "113" in its §0 — the correct count is **113**.)

---

## §A NEW FINDINGS (pass 2)

### A1 — The whole display-string layer for this system is RESOLVED. PASS-1 `C8` is RETRACTED.
**A2 · HELD · overturns PASS-1 journal + ledger**

PASS 1 wrote: *"Strings 456–464 (titles), 465–467 (suffixes), 4154 …, 610/611 … are all
indices into a table that is **not on disk**."* **False.** `docs/gauntlet/L0/index/strings.json`
resolves all of them, from `reference/extracted/android/118_Mobile_Lang_EN.bin`:

```
455 = '(初段)'   456 = '(弐段)'   457 = '(参段)'   458 = '(四段)'   459 = '(五段)'
460 = '(六段)'   461 = '(七段)'   462 = '(八段)'   463 = '(九段)'   464 = '(十段)'
465 = 'Renshi'   466 = 'Kyoshi'   467 = 'Hanshi'
4154 = 'Scroll of Rebirth'
4155 = 'New Game +\nProgress on to the next Dan Rank and specialize in an element. \nLevel 80 required.'
 610 = 'Are you ready to attain the next dan rank?\n\nYou will be reborn as a level 1
        character while retaining your inventory, skill points and clan rank. Your current
        equipment will be automatically unequipped.\n\nSlash length and bank storage is
        increased with each dan rank.'
 750 = 'You learnt a new dragon dance step!'
 864 = '[0] has rebirthed and is now Dan [1]!'
8041 = 'Rebirth'   8042 = 'Renshi'   8043 = 'Kyoshi'   8044 = 'Ultimate Warrior'
```

⚠ Android build v0.682 copy. Label any ported string accordingly.

---

### A2 — The complete Dan ladder, exact: 10 displayed ranks, kanji titles 初段…十段, shogo Renshi/Kyoshi/Hanshi
**A2 · HELD · overturns ledger AND corrects PASS-1 `C6`**

Ledger sentence overturned: *"③ Dan-rank count/titles (garbled source)."*
PASS-1 sentence corrected: *"there are exactly **9 Dan titles** and **3 suffix tiers**."*
There are **ten** title strings (455–464); the switch skips 455, so the *reachable* set is
nine, but the ladder is a 10-rung 初段→十段 ladder and the ledger's `MAX_DAN_RANK=10` is right.

`reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:2274-2316` (desktop
identical, `§1t5957s0§.as:3062-3103`), joined to the resolved strings:

| `STAT_DAN` | `danfield.text` | resolved | displayed rank | name suffix (`#7D5500`) |
|---|---|---|---|---|
| 0 | `""` | — | Dan 1 (untitled) | — |
| 1 | `getString(456)` | 弐段 Nidan | Dan 2 | — |
| 2 | `getString(457)` | 参段 Sandan | Dan 3 | — |
| 3 | `getString(458)` | 四段 Yondan | Dan 4 | **Renshi** (465) |
| 4 | `getString(459)` | 五段 Godan | Dan 5 | Renshi |
| 5 | `getString(460)` | 六段 Rokudan | Dan 6 | Renshi |
| 6 | `getString(461)` | 七段 Shichidan | Dan 7 | **Kyoshi** (466) |
| 7 | `getString(462)` | 八段 Hachidan | Dan 8 | Kyoshi |
| 8 | `getString(463)` | 九段 **Kyudan** | Dan 9 | **Hanshi** (467) |
| 9 | `getString(464)` | 十段 Judan | Dan 10 | Hanshi |

Verbatim, `InventoryUI.as:2285-2288`:

```
            case 3:
               nametext += " <font color=\'#7D5500\'>" + LangManager.getString(465) + "</font>";
               this.danfield.text = LangManager.getString(458);
```

Renshi 錬士 / Kyoshi 教士 / Hanshi 範士 is the real kendo *shogo* ladder. **This finally
explains the wiki garble** the ledger complains about — *"dan rank 5 (kyudan)"*: 九段
(kyudan) is `STAT_DAN` **8**, displayed **Dan 9**; the wiki collapsed two numbering layers.

Cap, verbatim — `StatsManager.as:2209-2211` (desktop `§1t1523s0§.as:2653-2655`):

```
2209:         if(getPlayerStats(STAT_DAN) < 9)
2211:            changeStat(STAT_DAN,1);
```

---

### A3 — Third independent proof of the 10-rank ladder: the achievement rows
**A2 · HELD**

`reference/extracted/android/114_Mobile_AchievementData.bin:436-470` (`<stat>25</stat>` =
`STAT_DAN`), joined to strings 8041–8044 / 8121–8124:

```
436: <achievement>          445: <achievement>          454: <achievement>          463: <achievement>
437: <id>48</id>            446: <id>49</id>            455: <id>50</id>            464: <id>51</id>
439: <name>8041</name>      448: <name>8042</name>      457: <name>8043</name>      466: <name>8044</name>
440: <desc>8121</desc>      449: <desc>8122</desc>      458: <desc>8123</desc>      467: <desc>8124</desc>
441: <stat>25</stat>        450: <stat>25</stat>        459: <stat>25</stat>        468: <stat>25</stat>
442: <val>1</val>           451: <val>2</val>           460: <val>5</val>           469: <val>9</val>
```

→ "Rebirth" / "Reach Dan 2." · "Renshi" / "Reach Dan 3." · "Kyoshi" / "Reach Dan 6." ·
**"Ultimate Warrior" / "Reach Dan 10."** at `STAT_DAN == 9`.

`val 9 ⇒ "Reach Dan 10."` is the decisive artifact: **displayed = `STAT_DAN` + 1, max 10.**
The achievement titles also mirror the shogo tiers exactly (Renshi at the first tier, Kyoshi
at the second) — the achievements are *named after the rank you just earned*.

---

### A4 — The rebirth / element-picker UI DATA is on disk: two menus, four labelled buttons, in order, with icons
**A2 · HELD · overturns ledger**

Ledger sentence overturned: *"⑤ rebirth/element-picker UI (never filmed — both longplays
pre-rebirth)."* The *"never filmed"* half stands. Everything else is now held **as data**,
not inferred from code — `reference/extracted/android/90_InteractUI_UIData.bin:94-105`:

```
 94:		<title>rebirth</title>
 95:		<menu>
 96:		<option><label>1</label><icon>12</icon><condition><has><id>25</id><qty>9</qty><comp>lt</comp></has></condition><action><id>goto</id><param>1</param></action></option> <!-- "yes" useicon-->
 97:		<option><label>1</label><icon>12</icon><condition><has><id>25</id><qty>9</qty><comp>gte</comp></has></condition><action><id>firerebirth</id></action></option> <!-- "yes" useicon >=10 dan, no element boost-->
 98:		<option><label>0</label><icon>14</icon><action><id>close</id></action></option> <!-- "no" leaveicon-->
 99:		</menu>
100:		<menu>
101:		<option><label>507</label><icon>24</icon><action><id>firerebirth</id></action></option> <!-- "fire" fireicon-->
102:		<option><label>510</label><icon>27</icon><action><id>earthrebirth</id></action></option> <!-- "earth" fireicon-->
103:		<option><label>508</label><icon>25</icon><action><id>windrebirth</id></action></option> <!-- "wind" fireicon-->
104:		<option><label>509</label><icon>26</icon><action><id>waterrebirth</id></action></option> <!-- "water" fireicon-->
105:		</menu>
```

Resolved labels: `1`="Yes", `0`="No", **`507`="Fire ATK", `508`="Wind ATK", `509`="Water ATK",
`510`="Earth ATK"**.

Held now: the flow (menu 0 → prompt string 610 + Yes/No; menu 1 → the four element buttons);
the **on-screen order — Fire, Earth, Wind, Water** (not the stat-id order 28/29/30/31); the
per-button **icon ids 24/25/26/27**; and the **`STAT_DAN >= 9` short-circuit** — at Dan 10 the
"Yes" button skips the element menu entirely and rebirths with **no element boost**. The
shipped dev comment on line 97 (`>=10 dan, no element boost`) is a **fourth** independent
confirmation that the ladder tops out at a displayed **Dan 10**.

Still unheld: the `elementCircle` widget's art, layout and colours (no frame, no exported symbol).

---

### A5 — All 24 elemental skills are NAMED and DESCRIBED, and the four ultimates state their own AoE + magnitude in words
**A2 · HELD · overturns ledger**

Ledger sentence overturned: *"① what each element **does** (24 skills' damage/cost/AoE/status
— names only)."* Not "names only" — the shipped tooltips are on disk:

```
6143 = 'Area of Effect Fire Attack\n\nFire Damage: 150% Fire ATK'
6144 = 'Area of Effect Water Attack\n\nWater Damage: 150% Water ATK'
6145 = 'Area of Effect Wind Attack\n\nWind Damage: 150% Wind ATK'
6146 = 'Area of Effect Earth Attack\n\nEarth Damage: 150% Earth ATK'
6062 = 'Lay a trap that deals fire damage when triggered.\n\nRequires kunai ammo.'
6070 = 'Throws a kunai that deals fire damage.\n\nRequires kunai ammo.'
6075 = 'Close-ranged earth attack.'
```

The player-facing text **independently confirms** PASS-1 `C1` (ultimates ×1.5 of the element
ATK stat, zero physical) and `C2` (they are AoE). It also confirms the traps/kunai consume
**kunai ammo** on top of Chi — a cost the ledger never records.

Full roster with resolved names (`reference/extracted/skilldata.xml`, categories 7–10, six
skills each = **24**; names via `docs/gauntlet/L0/index/resolved_names.json`):

| element | cat | order 0 | order 1 | order 2 | order 3 (passive) | order 4 (ult) | order 5 (passive) |
|---|---|---|---|---|---|---|---|
| Fire  | 7  | 1029 Fire Kunai  | 1025 Fire Element Trap  | 1013 Fire Breath  | 1056 Dragon Dance Step: Fire  | 1070 **Inferno**    | 1060 …Fire II |
| Water | 8  | 1030 Water Kunai | 1026 Water Element Trap | 1035 Water Stomp  | 1057 …Water                   | 1071 **Tsunami**    | 1061 …Water II |
| Wind  | 9  | 1031 Wind Kunai  | 1027 Wind Element Trap  | 1034 Wind Combo   | 1058 …Wind                    | 1072 **Tornado**    | 1062 …Wind II |
| Earth | 10 | 1032 Earth Kunai | 1028 Earth Element Trap | 1033 Ground Punch | 1059 …Earth                   | 1073 **Earthquake** | 1063 …Earth II |

Costs, verbatim `reference/extracted/skilldata.xml`:

- Kunai (`:985-998` Fire 1029, `:1001-1014` Water 1030, …): `<chi>3</chi><cooldown>2</cooldown>`, one level
- Trap (`:921-934` etc.): `<chi>3</chi><cooldown>6</cooldown>`, one level
- Ultimate (`:1880-1893` etc.): `<lvlreq>50</lvlreq>`, `<chi>50</chi><cooldown>60</cooldown>`
- Passives (`:1655-1668`, `:1723-1736`): `<passive>1</passive>`, empty chi/cooldown

```
1880		<id>1070</id>
1881		<displayname>6138</displayname>
1882		<lvlreq>50</lvlreq>
1883		<desc>6143</desc>
1884		<req><has><id>28</id><qty>30</qty></has></req>
1889			<chi>50</chi>
1890			<cooldown>60</cooldown>
```

---

### A6 — Dragon Dance steps are a TEACHABLE social skill, and there are two named bagua arrangements
**A2 · HELD · overturns ledger**

Ledger blocker ④ frames Dragon Dance as an unknown *input*. Resolved descs 6117–6131 show it
is also a **transmission** mechanic the ledger has nowhere:

```
6116 = 'Dragon Dance Step: Fire'
6117 = 'Unlocks the Dragon Dance Step for Fire and gives you the ability to teach it to others.'
6124 = 'Dragon Dance Step: Fire II'
6125 = 'Unlocks the Dragon Dance Step for Fire (Later Heaven) and gives you the ability to teach it to others.'
 750 = 'You learnt a new dragon dance step!'
```

**"Later Heaven"** (後天八卦) is the shipped name for the second arrangement — which matches
`DragonDanceUI.as:70-71` exactly (§B3). Tier-3 passives = **Earlier Heaven**; tier-6 = **Later
Heaven**. A player who owns a step can teach it to another player, so the Dragon Dance is a
player-to-player propagation system, not a solo unlock.

---

### A7 — §3 correction #7 is WRONG: the v0.717 client pays +25 gold per rebirth and +100 on the tenth
**A2 · HELD · overturns ledger** *(carried from PASS 1, independently re-verified)*

Ledger sentence overturned (§3 item 7): *"**`MAX_DAN_RANK=10` and `tenthGold=100` should be
INFERRED, not CONTRACT.** … film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."*

`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2652` — the **real v0.717 client**:

```
2644:         if(§1t7356s0§(§1t9426s0§) == 8)
2646:            §1t9713s0§(§1t9413s0§,100);
2647:            §1t3318s0§.instance.§1t3409s0§(§1t1521s0§.getString(864,[§1t9765s0§(),"10"]));
2651:            §1t9713s0§(§1t9413s0§,25);
```

`§1t9426s0§ = 25 = STAT_DAN` (`:254`); `§1t9413s0§ = 12 = STAT_HGOLD` (`:228`). The literal
`"10"` on line 2647 is the announcement's rank argument. **+25 gold every rebirth, +100 on the
Dan 8→9 (displayed 9→10) rebirth. Both become CONTRACT.**

**Version divergence, flagged:** the android v0.682 bundle at `StatsManager.as:2201-2207` uses
**20 / 5** for the same branches. Desktop wins. This is the concrete evidence for the S0-3
caveat that *"combat tuning parity is NOT established"* — one in six checked numbers moved.

---

### A8 — CROSS-LANE: Dan rank raises SLASH LENGTH and BANK WEIGHT — and the game says so in its own prompt
**A2 · HELD · overturns ledger (combat-core blocker ①)**

Ledger sentence overturned (`### combat-core — 42`): *"① reach cap in **stage px** per stance
(the one value the whole model needs; wiki gives "units" of unknown scale)."*

`reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1915-1919`, desktop-confirmed
at `§1t1523s0§.as:2344-2348`:

```
1915:      internal static function getBaseSlashLengthVal(speed:int) : int
1917:         var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
1918:         return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
```

`baseSlashLength = 120 + floor((90 + DAN×5) × SPD / (20 + SPD))` — **stage pixels**, floor 120,
asymptote **210 px at Dan 0 → 255 px at Dan 9**. `getBaseSlashLength()` (`:1905-1913`) feeds it
`STAT_SPEED + gear`, ×1.5 under `BUFF_SPEED`.

Bank — `BankUI.as:264`:

```
264:         this.storageMaxWeight = 100 + StatsManager.getPlayerStats(StatsManager.STAT_DAN) * 10 + StatsManager.getPlayerStats(StatsManager.STAT_PAIDSTORAGE) * 10;
```

And the **designer's own words**, string 610: *"Slash length and bank storage is increased with
each dan rank."* Code and shipped copy agree.

Per-stance multipliers on top (`MCSPlayer.as:3029-3078`):

```
3030:               this.slashLength = this.baseSlashLength * 1.5;                                    // LIGHT
3041:               this.slashLength = this.baseSlashLength * (1 + 0.5 * this.balancedMastery * 0.01); // BALANCED
3052:               this.slashLength = this.baseSlashLength * (0.5 + 0.5 * this.heavyMastery * 0.01);  // HEAVY
3053:               if(this.slashLength < 100) this.slashLength = 100;
3067:               this.slashLength = this.baseSlashLength * 1.5;                                    // REVERSED
3078:               this.slashLength = this.baseSlashLength;                                          // DUAL, floored 100
```

⚠ **Parity NOT established for this block.** I grepped the entire `shs3_payload/` tree for
`0.5 + 0.5 *`, `1 + 0.5 *` and `0.005` — **zero hits**. The multipliers are android-only so far;
the desktop equivalent is either differently constant-folded or in a class I did not locate.
Treat the stance multipliers as **v0.682, unconfirmed for v0.717**. Note also that **mastery is
0–100 here, not 0–9** — the ledger's *"mastery-9 ceiling"* framing needs re-checking in its own
lane.

---

### A9 — CROSS-LANE: post-rebirth SP economy, and "80 SP first run" is off by one
**A2 · HELD · overturns ledger (progression blocker ③)**

`StatsManager.as:2156`, desktop-confirmed `§1t1523s0§.as:2598`:

```
2156:         setPlayerStats(STAT_SKILLPOINTS,getLevel() - 1 + getPlayerStats(STAT_DAN) * (levelCap - 1));
```

`levelCap = 80` (`StatsManager.as:76`; desktop `§1t9470s0§ = 80` at `:362`).
**`SP = (level − 1) + DAN × 79`.** At L80/Dan 0 that is **79**, not the ledger's "80 SP first
run". Each Dan is a permanent **+79 SP**; a Dan-10 L80 character has **790**.

---

### A10 — The Dragon Dance unlock gate is a STAT threshold at 10 / 30 / 60, so the usable kit lands on the FIRST rebirth
**A2 · HELD · overturns ledger** *(carried from PASS 1, independently re-verified)*

Ledger sentence overturned (Surface bullet): *"Dragon Dance unlocks at 3×/6× same-element
rebirths — explains why point-stacking matters."*

`<req><has><id>28</id><qty>N</qty></has></req>` — id 28 is **`STAT_FIREATK`**, not an item
(`StatsManager.as:226`). Thresholds are **10** (kunai/trap/tier-2), **30** (Dragon Dance Step
+ ultimate), **60** (Step II). The grant is +10 per same-element rebirth
(`InteractUI.as:849-855`, desktop `§1t401s0§.as:873-881`), +20 at `STAT_DAN == 8`.

→ **three** tiers, **1× / 3× / 6×**. The ledger drops the 1× tier — the one that opens each
element's entire *usable* kit on the very first rebirth into it. Gear affixes on stats 28–31
count toward the same threshold, and the Dan-8 +20 breaks the clean multiple.

---

## §B CARRIED FORWARD FROM PASS 1 — each re-verified this pass

### B1 — Elemental damage = elementATK × {0.8, 0.9, 1.0, 1.1, 1.2} by skill level, ZERO physical
**A2 · HELD** — re-read `FireBreathProjectile.as:15-52` first-hand; the ladder is exactly as
PASS 1 quoted (`skilllevel 1..5` → `damage *= 0.8/0.9/1.0/1.1/1.2`, FX `scale` 1.0→1.4 in
lockstep), and `Damage.as:50`'s signature confirms `new Damage(0,0,2,-1,damage)` puts it all in
the **fire** channel with **physical 0**. Ultimates ×1.5 (`BigFireBreathProjectile.as:23`).

### B2 — AoE radii differ per element, and Tornado's launch type differs
**A2 · HELD** — re-verified verbatim:

```
BigFireBreathProjectile.as:32   NPCManager.checkHitObject(this,damageObj,600);
BigWaveProjectile.as:34         NPCManager.checkHitObject(this,damageObj,400);
BigTornadoProjectile.as:33      NPCManager.checkHitObject(this,damageObj,200);
BigEarthquakeProjectile.as:68   NPCManager.checkHitObject(this,damageObj,50);
```

Inferno 600 · Tsunami 400 · Tornado 200 · Earthquake 50 per rock. Tornado is `LAUNCH_AIR`;
the rest are `LAUNCH_KNOCKDOWN`.

### B3 — Dragon Dance input: an 8-node bagua ring with two Heavens
**A2 · HELD** — `DragonDanceUI.as:70-71`:

```
70:         this.earlierHeavenLabel = ["sky","wind","water","mountain","earth","thunder","fire","lake"];
71:         this.laterHeavenLabel = ["fire","earth","lake","sky","water","mountain","thunder","wind"];
```

`:354-355` appends each click's digit to `sequence`; `:367-369` flips to Later Heaven when the
first four clicks are exactly **{1,2,4,6}** — i.e. wind + water + earth + fire, the four
elemental nodes; `:447` fires `validSequence()` on an exact match. Node→skill mapping
(`:302-334`) is: Earlier 6/2/1/4 ← skills 1056/1057/1058/1059 (fire/water/wind/earth); Later
0/4/7/1 ← 1060/1061/1062/1063. **The four tier-3 passives teach precisely the {6,2,1,4} set
that opens Later Heaven** — that is the design.

### B4 — Kanji-statue bonus: 2 AP, 100 px range, RNG-permuted sequence seeded on the map node
**A2 · HELD** — re-verified `Obj_DragonDanceStatue.as:37-62` (five permutations `1246 / 4216 /
1642 / 1426 / 6241`, `dice = rng.rand(5)` on `new RNG(StageManager.getCurrentNode())`),
`:224-226` `return 2;` (AP cost), `:238-240` `abs(x - mc.x) < 100` (range), `:185`
`setStat(40002 + int(props),1)` (permanent unlock).

### B5 — Elemental mitigation: flat subtraction, hard min-1 floor, summed with physical
**A2 · HELD** — `MCSPlayer.as:3347-3357` re-read verbatim:

```
3347:         var fireDamage:int = damageObj.fireDamage - STAT_FIREDEF;
3351:         if(damageObj.fireDamage > 0 && fireDamage < 1)
3353:            fireDamage = 1;
3355:         else if(fireDamage < 0)
3357:            fireDamage = 0;
```

`:3420` `setHP(getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));`
The elemental floor is a **hard 1**, distinct from the physical `getMinDamage()` ladder.

### B6 — The element counter-wheel
**A2 · HELD** — `StatsManager.as:1836`, desktop `§1t1523s0§.as:2270`; parameter order from
`MCSPlayer.as:260 initElementDefenseStats(STAT_FIREDEF, STAT_WINDDEF, STAT_WATERDEF, STAT_EARTHDEF)`:

| defence against | comes from your |
|---|---|
| FIRE | **WATER** ATK |
| WIND | **EARTH** ATK |
| WATER | **WIND** ATK |
| EARTH | **FIRE** ATK |

Choosing a rebirth element simultaneously chooses what you become immune to.

### B7 — Scroll of Rebirth: item 2202, 1000c, modifier 25, `level == 80` exactly
**A2 · HELD** — `reference/extracted/itemdata.xml:2311-2324`:

```
2312		<id>2202</id>
2313		<type>10</type>
2314		<name>4154</name>        → 'Scroll of Rebirth'
2315		<baseprice>1000</baseprice>
2316		<weight>0</weight>
2317		<desc>4155</desc>        → 'New Game + … Level 80 required.'
2318		<modifier><id>25</id></modifier>
2320		<modifier><id>12</id><value>5</value></modifier>
```

Gate at `InventoryUI.as:910-920` (`level == levelCap` exactly; over-cap or a repeat fires
`reportHack("multiple rebirth")`), consumed by `changeStat(2202,-1)` (`InteractUI.as:857`).

### B8 — The full `doRebirth` transaction
**A2 · HELD** — `StatsManager.as:2195-2233`: `unequipAll()` (gear → inventory, nothing
destroyed, starter gear 4017/11017/12017/0/13100 re-equipped), `setStat(STAT_XP,0)`, gold,
`DAN+1` (cap 9), global announcement 864, hotbar wiped to a single slot holding **1003 = Jump**,
proc-gen daily quests purged, `unAssignStatPoints()` (ATK/DEF/SPD→1, MAXCHI→10, MAXAP→30,
statpoints→`(level−1)×3`), forced teleport to map node **8382465** at `(0,200)`.
String 610 states the player-facing contract: *"reborn as a level 1 character while retaining
your inventory, skill points and clan rank. Your current equipment will be automatically
unequipped."*

---

## §C RETRACTIONS OF THE PASS-1 JOURNAL

| PASS-1 claim | status | why |
|---|---|---|
| `C8` — "the missing string table … `data/shs3_en.xml` … not on disk; names remain un-portable" | **RETRACTED** | S0-3: `reference/extracted/android/118_Mobile_Lang_EN.bin`, 2,533 entries, pre-resolved in `docs/gauntlet/L0/index/strings.json`. Every index PASS 1 listed resolves. `LangManager.as:55` naming `shs3_en.xml` is the *runtime* path, not evidence of absence. |
| `C6` — "exactly **9 Dan titles** and 3 suffix tiers", titles unresolved | **CORRECTED** | Ten title strings exist (455–464 = 初段…十段); the switch reaches nine of them. Suffixes resolve to **Renshi / Kyoshi / Hanshi**. |
| `C12` — "all **60** directories in `frames.json`" | **CORRECTED** | The index has **113** directories. Conclusion (no rebirth frame) is unchanged. |
| rewrite block — "Blockers: (1) all display TEXT … NOT on disk" | **RETRACTED** | Same as `C8`. |

---

## §D STILL_UNHELD (honest)

1. **Per-element STATUS effects** beyond launch type. No burn/slow/DoT flag appears at any
   elemental `Damage` construction site; but I did not read `NPCManager.checkHitObject` or the
   `BUFF_*` system end to end. Cannot assert none exists. Close-path: `Damage.as` buff fields +
   `BUFF_*` constants in `StatsManager.as`.
2. **The `elementCircle` art** — no frame in any of the 113 frame directories, no exported
   symbol located. The ledger's *"never filmed"* stands.
3. **Statue placement** — which map nodes carry which statue `props`. Requires joining
   `bindata/93` room-object defs (S0-1) and `112_Mobile_NodeData` (S0-4) to
   `Obj_DragonDanceStatue`. Not attempted.
4. **v0.717 parity for the per-stance slash multipliers** (§A8) — grepped and not found in the
   desktop bundle. Android-only until re-located.

---

## §E Rewrite of the ledger block, as evidence now supports it

```
### rebirth-elements — 88
- Ready: elements FIRE/WIND/WATER/EARTH = ATK stats 28/29/30/31, DEF 200-203; all 24
  elemental skills NAMED + DESCRIBED (strings 6056-6146) with Chi/cooldown/level-req
  (kunai 3/2, trap 3/6, ultimates 50/60 @ lvlreq 50) and a kunai-ammo cost; damage =
  elementATK x {0.8..1.2} by skill level, x1.5 ultimates, ZERO physical component;
  AoE radii 600/400/200/50; flat-subtraction mitigation, hard min-1 floor, summed with
  physical; the counter-wheel (WATERatk->FIREdef, EARTHatk->WINDdef, WINDatk->WATERdef,
  FIREatk->EARTHdef); trigger = item 2202, 1000c, modifier 25, level == 80 exactly,
  hack-guarded; grant +10 element ATK (+20 at Dan 8) and +25 gold (+100 at Dan 8);
  Dan ladder complete - STAT_DAN 0..9 displays as Dan 1..10, kanji titles 初段..十段
  (455-464) plus shogo Renshi/Kyoshi/Hanshi (465/467) at Dan 4-6/7-8/9-10, four
  achievements at DAN 1/2/5/9; the full doRebirth transaction; the element-picker UI
  data (two menus, buttons "Fire ATK"/"Earth ATK"/"Wind ATK"/"Water ATK" in that order,
  icons 24/27/25/26, Dan-10 short-circuit); Dragon Dance 8-node bagua input, Earlier +
  Later Heaven label arrays, the {1,2,4,6} gate, statue RNG-permuted sequences, 2 AP and
  100 px per attempt, and the teach-it-to-others transmission mechanic.
- Blockers: (1) elementCircle ART/layout - never filmed, absent from all 113 frame dirs.
  (2) per-element STATUS effects beyond launch type - unverified either way.
  (3) statue placement data (map node -> statue props) - not yet joined.
  (4) v0.717 parity for the per-stance slash multipliers (android-only so far).
- Surface: rebirth is the ONLY source of element ATK, and element ATK is simultaneously
  offence and cross-element defence. Rebirth ALSO raises the base slash-length ceiling
  (120 + floor((90+DAN*5)*SPD/(20+SPD)), 210px -> 255px) and grants +79 permanent SP per
  Dan and +10 bank weight - all three belong to combat-core / progression / economy and
  are currently filed nowhere. String 610 says it in the game's own words.
- ALL UI COPY IS ANDROID v0.682. Skill/item NUMBERS are web v0.717. Label ported strings.
```

---

## §F Files touched
Read-only survey. The only file written is this one.
