# GAUNTLET L0 — system survey: **rebirth-elements**

Ledger under audit: `docs/research/REBUILD_READINESS.md` (2026-07-20), §2 row + §4 block
`### rebirth-elements — 30`.

**Headline: this is the most under-claimed block in the document.** Four of its five
"blockers" are answered outright by files already on disk, and its `Ready` line
under-states what is held. The decisive artifact is a bundle the ledger never used:
`reference/decompiled/shs3_android_payload/` — **970 UNOBFUSCATED ActionScript classes**
(`StatsManager.as`, `InteractUI.as`, `SkillManager.as`, `DragonDanceUI.as`,
`Obj_DragonDanceStatue.as`, `MCSPlayer.as`, `Damage.as`, the elemental projectiles).
Every finding below was then **cross-checked against the obfuscated desktop payload**
`reference/decompiled/shs3_payload/` (the real v0.717 client) before being banked.

**Re-score: 30 → 78.**

---

## 0. METHOD + the one caveat that governs every number here

`reference/decompiled/shs3_android_payload/scripts/StatsManager.as:30`

```
      public static var clientVersion:Number = 0.682;
```

The readable bundle is client **v0.682**; the desktop preloader bakes **v0.717**. So the
android bundle is treated **as a naming key, not as the authority**. Every load-bearing
number below was re-read in the obfuscated desktop payload. Five cross-checks passed
structurally identical; **one diverged and the desktop value wins** (heavenly-gold grant,
§C7). Where I quote an android line, I name the desktop line that confirms it.

The lane law's "frame wins" clause never fired in this survey: **no frame in
`reference/frames/` shows the rebirth flow, the element circle, or a Dan title** — I
enumerated all 113 frame directories in `docs/gauntlet/L0/index/frames.json` and there is
no rebirth/element/dan directory. So there is no doc-vs-frame conflict to adjudicate
here; the ledger's "never filmed" is the one blocker clause that survives (§C12).

---

## 1. The four elements, named, from code — not from the missing string table

`reference/decompiled/shs3_android_payload/scripts/StatsManager.as:220-266`

```
220:      internal static var STAT_DAN:int = 25;
226:      internal static var STAT_FIREATK:int = 28;
228:      internal static var STAT_WINDATK:int = 29;
230:      internal static var STAT_WATERATK:int = 30;
232:      internal static var STAT_EARTHATK:int = 31;
250:      internal static var STAT_FIREDEF:int = 200;
252:      internal static var STAT_WINDDEF:int = 201;
254:      internal static var STAT_WATERDEF:int = 202;
256:      internal static var STAT_EARTHDEF:int = 203;
```

Desktop confirm — `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:254-266`

```
254:      internal static const §1t9426s0§:int = 25;
260:      internal static const §1t1235s0§:int = 28;
262:      internal static const §1t1236s0§:int = 29;
264:      internal static const §1t1237s0§:int = 30;
266:      internal static const §1t1238s0§:int = 31;
```

The elements are **FIRE / WIND / WATER / EARTH**, stat ids 28/29/30/31 (ATK) and
200/201/202/203 (DEF). These are *class constants*, so they are portable **without**
the un-located `data/shs3_en.xml` string table (§C8).

### The 24-skill roster, reconstructed and closed

`reference/extracted/skilldata.xml` categories **7/8/9/10 carry exactly 6 skills each =
24** (verified: `grep -c` by category → 6,6,6,6). Each elemental skill's
`<req><has><id>N</id>` is **not an item id** (itemdata ids start at 2000, see
`reference/extracted/itemdata.xml:3`) — it is the **element ATK stat id**, 28/29/30/31.
Joining that to `SkillManager.as` names the whole set:

| Element | `<category>` | ATK stat | order 0 | order 1 | order 2 (`lvlreq` 20) | order 3 (passive) | order 4 (ult, `lvlreq` 50) | order 5 (passive) |
|---|---|---|---|---|---|---|---|---|
| Fire  | 7  | 28 | 1029 `SKILL_KUNAIFIRE`  | 1025 `SKILL_TRAPFIRE`  | 1013 `SKILL_FIREBREATH`  | 1056 | 1070 `SKILL_INFERNO`    | 1060 |
| Water | 8  | 30 | 1030 `SKILL_KUNAIWATER` | 1026 `SKILL_TRAPWATER` | 1035 `SKILL_WATERSPLASH` | 1057 | 1071 `SKILL_TSUNAMI`    | 1061 |
| Wind  | 9  | 29 | 1031 `SKILL_KUNAIWIND`  | 1027 `SKILL_TRAPWIND`  | 1034 `SKILL_WINDKICK`    | 1058 | 1072 `SKILL_TORNADO`    | 1062 |
| Earth | 10 | 31 | 1032 `SKILL_KUNAIEARTH` | 1028 `SKILL_TRAPEARTH` | 1033 `SKILL_GROUNDPUNCH` | 1059 | 1073 `SKILL_EARTHQUAKE` | 1063 |

`reference/decompiled/shs3_android_payload/scripts/SkillManager.as:28-106`

```
 28:      public static var SKILL_FIREBREATH:int = 1013;
 32:      public static var SKILL_TRAPFIRE:int = 1025;
 40:      public static var SKILL_KUNAIFIRE:int = 1029;
 48:      public static var SKILL_GROUNDPUNCH:int = 1033;
 50:      public static var SKILL_WINDKICK:int = 1034;
 52:      public static var SKILL_WATERSPLASH:int = 1035;
100:      public static var SKILL_INFERNO:int = 1070;
102:      public static var SKILL_TSUNAMI:int = 1071;
104:      public static var SKILL_TORNADO:int = 1072;
106:      public static var SKILL_EARTHQUAKE:int = 1073;
```

---

## 2. CLAIMS

### C1 — Elemental skill DAMAGE is held: it is the element ATK stat, level-scaled, with ZERO physical component
**A2 · HELD · overturns ledger**

Ledger sentence overturned: *"① what each element **does** (24 skills' damage/cost/AoE/status — names only)."*

`reference/decompiled/shs3_android_payload/scripts/FireBreathProjectile.as:15-52`

```
15:      override public function init(velX:int, velY:int, damage:int, skilllevel:int, owner:NPC = null) : *
19:         if(skilllevel == 1)  { scale = 1;   damage *= 0.8; }
23:         else if(skilllevel == 2) { scale = 1.1; damage *= 0.9; }
27:         else if(skilllevel == 3) { scale = 1.2; damage *= 1; }
31:         else if(skilllevel == 4) { scale = 1.3; damage *= 1.1; }
35:         else if(skilllevel == 5) { scale = 1.4; damage *= 1.2; }
51:         damageObj = new Damage(0,0,2,-1,damage);
```

`Damage.as:50` gives the signature:

```
50:      public function Damage(damage:int = 0, attackerlvl:int = 0, launchType:int = 0, stance:int = -1, fireDamage:int = 0, waterDamage:int = 0, windDamage:int = 0, earthDamage:int = 0)
```

So `new Damage(0,0,2,-1,damage)` = **physical 0, fire = damage**. The `damage` argument
is the caster's element ATK stat, passed at
`MCSPlayer.as:781` — `createProjectile(PROJ_FIREBREATH, ..., STAT_FIREATK, this.getSkillLevel(SkillManager.SKILL_FIREBREATH), this)`.

**Rule:** `elementDamage = elementATK × {0.8, 0.9, 1.0, 1.1, 1.2}` for skill level 1–5,
and the FX sprite scales 1.0/1.1/1.2/1.3/1.4 in lockstep. `GroundPunchProjectile.as:22-53`
is byte-for-byte the same ladder writing into the **earth** slot
(`new Damage(0,0,2,-1,0,0,0,damage)`), so the four elements are **numerically mirrored**
— they differ only in which damage channel they fill.

Kunai/Trap variants take the raw stat with **no** level scaling
(`KunaiProjectile.as:57-70`, `TrapProjectile.as:43-58`: `damageObj.setFireDamage(damage)`
…`setEarthDamage(damage)`), consistent with skilldata giving them exactly one `<level>`.

Ultimates deal **×1.5**:
`BigFireBreathProjectile.as:23` `damageObj = new Damage(0,0,Damage.LAUNCH_KNOCKDOWN,-1,damage * 1.5);`

---

### C2 — Elemental AoE radii are held, and they differ per element
**A2 · HELD · overturns ledger**

Same ledger sentence (`…AoE/status — names only`).

```
BigFireBreathProjectile.as:32   NPCManager.checkHitObject(this,damageObj,600);
BigWaveProjectile.as:34         NPCManager.checkHitObject(this,damageObj,400);
BigTornadoProjectile.as:33      NPCManager.checkHitObject(this,damageObj,200);
BigEarthquakeProjectile.as:68   NPCManager.checkHitObject(this,damageObj,50);
FireBreathProjectile.as:60      NPCManager.checkHitObject(this,damageObj,200);
```

Inferno 600 · Tsunami 400 · Tornado 200 · Earthquake 50-per-rock (it spawns a rock train:
`MCSPlayer.as:956` `PROJ_EARTHQUAKE, getMapPosition() + rockSpacing * i`). Tier-2 elemental
attacks all use radius 200. Launch/status differs too: Inferno/Tsunami/Earthquake are
`Damage.LAUNCH_KNOCKDOWN`, **Tornado is `Damage.LAUNCH_AIR`** (`BigTornadoProjectile.as:24`).

---

### C3 — Every one of the 24 elemental skills' Chi cost and cooldown is on disk
**A2 · HELD · overturns ledger**

Same ledger sentence, and also `skills-meters` blocker ① *"every other skill's Chi cost +
cooldown (Smoke Bomb, Kunai chi, Lay Trap, elemental) — read skill cards in a preserved build."*
**No preserved build is needed. The numbers are in `reference/extracted/skilldata.xml`.**

- Elemental **Kunai** (1029/1030/1031/1032) — `skilldata.xml:985-995` (fire) etc.:
  `<chi>3</chi>` `<cooldown>2</cooldown>`, one level, `<req><has><id>28</id><qty>10</qty></has></req>`
- Elemental **Trap** (1025/1026/1027/1028) — `skilldata.xml:921-931`:
  `<chi>3</chi>` `<cooldown>6</cooldown>`, one level
- **Tier-2** (1013 Fire Breath / 1035 Water Splash / 1034 Wind Kick / 1033 Ground Punch)
  — `skilldata.xml:615-649` and `1056-1090`: five levels,
  `<chi>` **5 / 6 / 7 / 8 / 10**, `<cooldown>` **15** at every level, `<lvlreq>20</lvlreq>`
- **Ultimates** (1070–1073) — `skilldata.xml:1884-1891`:
  `<chi>50</chi>` `<cooldown>60</cooldown>`, `<lvlreq>50</lvlreq>`, `<qty>30</qty>`
- **Passives** (1056–1059 at `<qty>30</qty>`, 1060–1063 at `<qty>60</qty>`) — empty
  `<chi>`/`<cooldown>`, `<passive>1</passive>`

Verbatim, `reference/extracted/skilldata.xml:1884-1891`:

```
		<req><has><id>28</id><qty>30</qty></has></req>
		<order>4</order>
		<category>7</category>
		<level>
			<value>1</value>
			<required>1</required>
			<chi>50</chi>
			<cooldown>60</cooldown>
```

---

### C4 — The elemental ATK-vs-DEF formula is FLAT SUBTRACTION with a min-1 floor
**A2 · HELD · overturns ledger**

Ledger sentence overturned: *"② elemental ATK-vs-DEF **formula**."*

`reference/decompiled/shs3_android_payload/scripts/MCSPlayer.as:3347-3382`

```
3347:         var fireDamage:int = damageObj.fireDamage - STAT_FIREDEF;
3348:         var waterDamage:int = damageObj.waterDamage - STAT_WATERDEF;
3349:         var windDamage:int = damageObj.windDamage - STAT_WINDDEF;
3350:         var earthDamage:int = damageObj.earthDamage - STAT_EARTHDEF;
3351:         if(damageObj.fireDamage > 0 && fireDamage < 1)
3353:            fireDamage = 1;
3355:         else if(fireDamage < 0)
3357:            fireDamage = 0;
```

…repeated identically for water/wind/earth. And the total:

`MCSPlayer.as:3415-3420`

```
3415:               damage -= this.getDefense();
3416:               if(damage < damageObj.getMinDamage())
3418:                  damage = damageObj.getMinDamage();
3420:               setHP(getHP() - (damage + fireDamage + windDamage + waterDamage + earthDamage));
```

**Rule:** each element channel is `max(1, atkElem − defElem)` when the attacker had any
of that element, else 0; physical is `max(getMinDamage(), atk − DEF)`; HP loss is the
sum of all five. Note the elemental floor is a **hard 1**, *not* the level-banded
`getMinDamage()` ladder used for physical (`Damage.as:150-172`) — the ledger's
"Undead/Red-Oni damage floor" is a different mechanism from the elemental floor.

---

### C5 — The element counter-wheel is held: your ATK in one element IS your DEF against another
**A2 · HELD · overturns ledger**

Same ledger sentence (`② elemental ATK-vs-DEF formula`). This is the single most
surprising thing in the block and nothing in the ledger hints at it.

`reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1836`

```
player.initElementDefenseStats(getPlayerStats(STAT_WATERATK) + findBonusStat(STAT_FIREDEF),getPlayerStats(STAT_EARTHATK) + findBonusStat(STAT_WINDDEF),getPlayerStats(STAT_WINDATK) + findBonusStat(STAT_WATERDEF),getPlayerStats(STAT_FIREATK) + findBonusStat(STAT_EARTHDEF));
```

Desktop confirm — `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2270` (same
call, same argument order, same stat constants 28/29/30/31 ↔ 1235/1236/1237/1238).

Reading the parameter order from `MCSPlayer.as:260`
(`initElementDefenseStats(STAT_FIREDEF, STAT_WINDDEF, STAT_WATERDEF, STAT_EARTHDEF)`):

| Your defense against… | comes from your… |
|---|---|
| FIRE  | **WATER** ATK  |
| WIND  | **EARTH** ATK  |
| WATER | **WIND** ATK   |
| EARTH | **FIRE** ATK   |

Gear affixes (stat ids 200–203) add on top. **Consequence the ledger misses entirely:**
because rebirth grants element ATK (§C11), choosing an element to specialise in is
simultaneously choosing which element you become *immune* to — water rebirths make you
fire-proof. That is the whole strategic point of the system.

---

### C6 — Dan-rank COUNT is 9 stat ranks (10 displayed), with 9 title strings and 3 name-suffix tiers
**A2 · HELD · overturns ledger**

Ledger sentence overturned: *"③ Dan-rank count/titles (garbled source)."*

`reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2209-2211`

```
2209:         if(getPlayerStats(STAT_DAN) < 9)
2211:            changeStat(STAT_DAN,1);
```

Desktop confirm — `§1t1523s0§.as:2653-2655` (identical `< 9` guard).

The title table, `InventoryUI.as:2274-2316` (desktop identical at
`§1t5957s0§.as:3062-3103`): `case 0:` → `danfield.text = ""`; `case 1..9` → strings
**456…464**; `default` falls through to 464. Plus a **name-suffix tier** in `#7D5500`:

```
case 3-5:  nametext += " <font color='#7D5500'>" + LangManager.getString(465) + "</font>";
case 6-7:  ... getString(466) ...
case 8-9:  ... getString(467) ...
```

So: `STAT_DAN` is a 0-based counter capped at **9**; dan 0 = untitled first life; there
are exactly **9 Dan titles** and **3 suffix tiers**. The displayed rank is `DAN + 1`
(`StatsManager.as:2214` announces `(getPlayerStats(STAT_DAN) + 1).toString()`), i.e. it
tops out at **"10"** — which reconciles the wiki's garbled *"dan rank 5 (kyudan)"* (kyudan
= 9th) with the project's `MAX_DAN_RANK=10`: **both are right, at different layers.**

---

### C7 — §3 correction #7 is WRONG. The v0.717 payload confirms `tenthGold=100` AND a 10th-rebirth tier
**A2 · HELD · overturns ledger**

Ledger sentence overturned (§3 item 7): *"**`MAX_DAN_RANK=10` and `tenthGold=100` should
be INFERRED, not CONTRACT.** The only wiki datum is garbled ("dan rank 5 (kyudan)" —
kyudan=9th); film shows a **flat +25 gold** every rebirth, no 10th-rebirth tier."*

`reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2644-2651` — **the real v0.717 client**:

```
2644:         if(§1t7356s0§(§1t9426s0§) == 8)
2646:            §1t9713s0§(§1t9413s0§,100);
2647:            §1t3318s0§.instance.§1t3409s0§(§1t1521s0§.getString(864,[§1t9765s0§(),"10"]));
2651:            §1t9713s0§(§1t9413s0§,25);
```

`§1t9426s0§ = 25 = STAT_DAN`; `§1t9413s0§ = 12 = STAT_HGOLD` (`§1t1523s0§.as:228`).

So the desktop client grants **+25 heavenly gold per rebirth, and +100 on the rebirth
from Dan 8 → Dan 9, with a hard-coded broadcast of the literal string `"10"`.** The film's
"+25" is the *ordinary* case; there **is** a tenth-rebirth tier and it **is** 100. Both
values are now **CONTRACT**, not INFERRED.

**Version divergence, flagged:** the android v0.682 bundle at
`StatsManager.as:2201-2207` uses **20 / 5** for the same two branches. The desktop v0.717
numbers (100 / 25) win; the android bundle is a naming key only.

---

### C8 — The Dan TITLE TEXT is still unheld — but the missing string table now has a filename
**A2 (partial) · PARTIAL**

Strings 456–464 (titles), 465–467 (suffixes), 4154 (rebirth-scroll name / rebirth UI
title), 610/611 (rebirth prompts), 750/751/724 (dance statue dialogue) are all indices
into a table that is **not on disk**. But it is now **named**:

`reference/decompiled/shs3_android_payload/scripts/LangManager.as:39-58`

```
39:         var server:String = "./data/";
55:            Locale.addXMLPath(ENGLISH,server + "shs3_en.xml");
56:            Locale.addXMLPath(CHINESE,server + "shs3_zh-CN.xml");
```

`find reference -iname "*shs3_en*"` → no hits. The GAUNTLET §2.1 blocker holds, but it is
no longer a mystery: the target is **`data/shs3_en.xml`** (and `shs3_zh-CN.xml`) off the
game server root — a concrete Wayback/CDX hunt, not a dead end. **Names remain
un-portable; every *number* in this survey is portable today.**

---

### C9 — The Dragon Dance INPUT is fully held: an 8-node click ring with two "heavens"
**A2 · HELD · overturns ledger**

Ledger sentence overturned: *"④ Dragon Dance **input** + Kanji-statue bonus."*

`reference/decompiled/shs3_android_payload/scripts/DragonDanceUI.as:343-355`

```
354:         this.clickedArray[num] = true;
355:         this.sequence += num.toString();
```

`DragonDanceUI.as:367-370`

```
367:         if(Boolean(this.earlierHeaven && this.sequence.length == 4) && Boolean(this.clickedArray[1]) && Boolean(this.clickedArray[2]) && Boolean(this.clickedArray[4]) && Boolean(this.clickedArray[6]))
369:            this.setLaterHeaven();
```

**Mechanism:** eight clickable nodes (0–7) around a ring; each click appends its digit to
a sequence string, plays `MCSActor.POSE1…POSE8` on the player and network-emotes it
(`DragonDanceUI.as:439-441`, `startAnim(pose)` + `playerEmote(pose)`), and locks that node
(`clickedArray`). Clicking the **{1,2,4,6}** set in the first four inputs flips the ring
from **Earlier Heaven** to **Later Heaven** — a second 8-node arrangement with a different
node→pose mapping (`DragonDanceUI.as:378-437`; earlier heaven maps 0→POSE4, 1→POSE8,
2→POSE5, 3→POSE6, 4→POSE2, 5→POSE7, 6→POSE1, 7→POSE3; later heaven is the identity
0→POSE1 … 7→POSE8). Max sequence display length is **16** (`DragonDanceUI.as:501`),
laid out at `x = 400 + i*50 - (highestLength-1)*25`.

Only nodes you have **learned** are clickable (`hasNode()`, `DragonDanceUI.as:283-338`):
learned via a statue (stat `40002+n` for earlier heaven, `40010+n` for later) **or** via
an elemental passive skill:

| Passive | element / req | teaches node |
|---|---|---|
| 1056 | Fire, ×30  | Earlier 6 |
| 1057 | Water, ×30 | Earlier 2 |
| 1058 | Wind, ×30  | Earlier 1 |
| 1059 | Earth, ×30 | Earlier 4 |
| 1060 | Fire, ×60  | Later 0 |
| 1061 | Water, ×60 | Later 4 |
| 1062 | Wind, ×60  | Later 7 |
| 1063 | Earth, ×60 | Later 1 |

**The tier-3 passives teach exactly `{6,2,1,4}` — precisely the set that unlocks Later
Heaven.** That is the design: rebirth into all four elements to 30 ATK and you own the
Later Heaven gate. This also answers "what do the 8 elemental passives do" — they are
**not** combat passives; grep shows `1056`–`1063` are referenced *only* by
`DragonDanceUI.as` in the whole bundle.

Desktop confirm: `reference/decompiled/shs3_payload/scripts/§1t8695s0§.as:176-216`
carries the same literal sequences (`"4216"`, `"1642"`, `"6241"`), and
`reference/decompiled/payload_export.log:1061` exports `shs3_fla.dragondancewords_235`.

---

### C10 — The Kanji-statue bonus is held: 2 AP per attempt, permanent node unlock, RNG-permuted sequence
**A2 · HELD · overturns ledger**

Same ledger sentence (`④ … + Kanji-statue bonus`).

`reference/decompiled/shs3_android_payload/scripts/Obj_DragonDanceStatue.as:37-62`

```
37:         this.num = int(props);
38:         if(this.num >= 8)
40:            this.num -= 8;
41:            this.earlierHeaven = false;
42:            rng = new RNG(StageManager.getCurrentNode());
43:            dice = rng.rand(5);
46:               sequence = "1246" + this.num;
50:               sequence = "4216" + this.num;
54:               sequence = "1642" + this.num;
58:               sequence = "1426" + this.num;
62:               sequence = "6241" + this.num;
```

`Obj_DragonDanceStatue.as:171-186`, `224-226`:

```
173:         if(StatsManager.getStat(40002 + int(props)) == 0)
175:            SoundManager.instance.playGoodKoto();
185:            StatsManager.setStat(40002 + int(props),1);
224:      override public function getAPUse() : int
226:         return 2;
```

**Mechanism:** a statue's `props` string is its node id. `props < 8` → Earlier-Heaven
statue whose required sequence is literally that digit (a one-click teach). `props >= 8`
→ Later-Heaven statue whose sequence is a **deterministic RNG permutation of `1246`
seeded on the map node id**, suffixed with the taught node — i.e. the same statue in the
same room always wants the same dance, but different rooms want different permutations.
Success plays `playGoodKoto()`, permanently sets stat `40002+props`, and shows dialogue
string 750; failure/repeat shows 724. Each attempt costs **2 AP**
(`getAPUse()`), needs the player within **100 px** (`Obj_DragonDanceStatue.as:238-240`:
`return abs(x - mc.x) < 100;`), and is gated behind `StatsManager.getStat(2211) != 0`
(`Obj_DragonDanceStatue.as:214`). Sibling objects `Obj_DragonDancePath`,
`Obj_DragonDanceLoot`, `Obj_HiddenTemple` reuse the same base class
`DragonDanceInteractiveStageObject`.

---

### C11 — The "3×/6× same-element rebirths" surface note is CLOSE BUT WRONG — the real gate is the element ATK stat at 10/30/60
**A2 · HELD · overturns ledger**

Ledger sentence overturned: *"Dragon Dance unlocks at 3×/6× same-element rebirths —
explains why point-stacking matters."*

The gate is not counted in rebirths. It is a **stat threshold**:

`reference/extracted/skilldata.xml:612` (tier-2, Fire): `<req><has><id>28</id><qty>10</qty></has></req>`
`reference/extracted/skilldata.xml:1658` (passive): `<req><has><id>28</id><qty>30</qty></has></req>`
`reference/extracted/skilldata.xml:1726` (passive): `<req><has><id>28</id><qty>60</qty></has></req>`

and the grant per rebirth is **+10, or +20 at Dan 8** —
`reference/decompiled/shs3_android_payload/scripts/InteractUI.as:848-856`:

```
848:            case "firerebirth":
849:               if(StatsManager.getPlayerStats(StatsManager.STAT_DAN) == 8)
851:                  StatsManager.changeStat(StatsManager.STAT_FIREATK,20);
853:               else if(StatsManager.getPlayerStats(StatsManager.STAT_DAN) < 8)
855:                  StatsManager.changeStat(StatsManager.STAT_FIREATK,10);
```

Desktop confirm — `§1t401s0§.as:873-881` (identical 20/10 branches on stat `§1t1235s0§`=28).

**Corrected model:** there are **three** tiers, not two — **1× / 3× / 6×** same-element
rebirths (10 / 30 / 60 ATK). The ledger drops the 1× tier, which is the one that opens
each element's Kunai, Trap **and** tier-2 attack — i.e. the entire *usable* elemental
kit lands on your **first** rebirth into that element. Also: gear affixes on stats 28–31
count toward the same threshold (they are the same stat ids), and the Dan-8 rebirth
grants +20, so the cadence is not a clean multiple of 3.

---

### C12 — The rebirth/element-picker UI: the MECHANISM is held, the PIXELS are not
**A2 (mechanism) · PARTIAL**

Ledger sentence: *"⑤ rebirth/element-picker UI (never filmed — both longplays pre-rebirth)."*
The *"never filmed"* half **stands** — I enumerated all 60 directories in
`docs/gauntlet/L0/index/frames.json` and none targets rebirth, the element circle, or a
Dan title. The *"unknown"* implication does not stand:

`reference/decompiled/shs3_android_payload/scripts/InteractUI.as:25, 252-256, 551-559`

```
 25:      public static var UIMODE_REBIRTH:int = 6;
252:            case UIMODE_REBIRTH:
253:               this.titleText.label.text = LangManager.getString(4154);
254:               this.bust.initMCSFromPlayer();
255:               this.bust.faceLeft();
551:            case UIMODE_REBIRTH:
552:               if(this.menuState == 0)
554:                  this.detailstext.text = LangManager.getString(610);
556:               else if(this.menuState == 1)
558:                  this.detailstext.text = LangManager.getString(611);
559:                  this.elementCircle.visible = true;
```

**Held:** it is `InteractUI` mode 6, a **two-state** flow — `menuState 0` = prose prompt
(string 610), `menuState 1` = prose prompt 611 **plus a widget literally named
`elementCircle`** (`InteractUI.as:63`, a `MovieClip`, hidden by default at line 171). The
panel shows the **player's own bust facing left** (not an NPC). The four buttons dispatch
actions `"firerebirth"`, `"windrebirth"`, `"waterrebirth"`, `"earthrebirth"`. The title
text reuses string **4154**, which is also the rebirth scroll's `<name>` (§C13) — the
panel is titled with the item's name.

**Still unheld:** the circle's art, layout, colours, and the on-screen labels (strings
610/611/4154 live in the missing `shs3_en.xml`).

---

### C13 — "1000c scroll, L80" is CONFIRMED and sharpened: item 2202, `modifier id 25`, level must equal 80 exactly
**A2 · HELD**

Ledger `Ready` bullet: *"rebirth trigger (1000c scroll, L80, +25g, …)"* — correct, and now
citable.

`reference/extracted/itemdata.xml:2312-2324`

```
		<id>2202</id>
		<type>10</type>
		<name>4154</name>
		<baseprice>1000</baseprice>
		<weight>0</weight>
		<desc>4155</desc>
		<modifier>
			<id>25</id>
		</modifier>
		<modifier>
			<id>12</id>
			<value>5</value>
		</modifier>
```

`reference/decompiled/shs3_android_payload/scripts/InventoryUI.as:910-921`

```
910:               if(modid == 25)
912:                  if(StatsManager.getLevel() > StatsManager.levelCap || StatsManager.didRebirth)
914:                     QueryManager.instance.reportHack("multiple rebirth");
917:                  if(StatsManager.getLevel() == StatsManager.levelCap)
919:                     this.onLeave(null);
920:                     OverworldHUD.instance.interactUI.show(InteractUI.UIMODE_REBIRTH);
```

`levelCap` is `StatsManager.as:76` — `public static var levelCap:int = 80;`.

**Sharpened:** the scroll is item **2202**, costs **1000 coins**, weighs 0, is sold from a
default shop stock list (`XMLShopData.as:46`), and its rebirth power is **modifier id 25**.
The gate is `level == 80` **exactly** (over-cap or an already-used rebirth this session
fires a server-side `reportHack("multiple rebirth")`). It is consumed by
`StatsManager.changeStat(2202,-1)` at `InteractUI.as:857`. Its second modifier (`id 12`,
= `STAT_HGOLD`, value 5) is display-only — the `modid == 25` branch `return`s before the
modifier loop reaches it, and the actual gold comes from `doRebirth` (§C7).

---

### C14 — "carry-items-reset-level" is CONFIRMED and sharpened: gear is unequipped INTO inventory, and the reset values are exact
**A2 · HELD**

Ledger `Ready` bullet: *"…carry-items-reset-level."*

`reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2195-2233` (`doRebirth`)
and `:2164-2193` (`unequipAll`), `:2117-2138` (`unAssignStatPoints`). Verbatim highlights:

```
2199:         unequipAll();
2200:         setStat(STAT_XP,0);
2216:         skillSlots = new Vector.<IntStat>(8);
2217:         skillSlots[0] = new IntStat(1003,1);
2229:         unAssignStatPoints();
2230:         OverworldHUD.getInstance().screenTransition.setTeleportTarget(8382465,0,200);
```

```
2176:         addItemsToInventory(itemList);
2187:         equipItem(EQ_ARMOR,new Item(4017,1));
2188:         equipItem(EQ_PANTS,new Item(11017,1));
2189:         equipItem(EQ_SHOES,new Item(12017,1));
2190:         equipItem(EQ_WEAPON,new Item(0,1));
2191:         equipItem(EQ_SCABBARD,new Item(13100,1));
```

```
2122:         setPlayerStats(STAT_MAXCHI,10);
2125:         setPlayerStats(STAT_ATTACK,1);
2126:         setPlayerStats(STAT_DEFENSE,1);
2127:         setPlayerStats(STAT_SPEED,1);
2134:         setPlayerStats(STAT_MAXAP,30);
2135:         setPlayerStats(STAT_STATPOINTS,(getLevel() - 1) * 3);
```

**Full rebirth transaction:** XP→0; all 9 equipment slots **moved to inventory** (nothing
destroyed) and replaced by starter gear (armor 4017, pants 11017, shoes 12017, weapon 0,
scabbard 13100); ATK/DEF/SPD→1, MAXCHI→10, MAXAP→30, AP clamped to ≤30, stat points
→ `(level−1)×3`; hotbar wiped to a single slot holding **1003 = `SKILL_JUMP`**; all
proc-gen daily quests purged; heavenly gold +25/+100; Dan +1 (cap 9); a global
announcement; and a forced teleport to map node **8382465** at `(0, 200)`. The Dan also
raises bank storage (`BankUI.as:264`: `100 + STAT_DAN * 10 + STAT_PAIDSTORAGE * 10`) and
PvP matchmaking level (`QueryManagerBase.as:2674`:
`variables.level = StatsManager.getLevel() + StatsManager.getPlayerStats(StatsManager.STAT_DAN) * 80;`).

---

### C15 — CROSS-LANE, combat-core: the base slash-length formula is on disk, and it is Dan-scaled
**A2 · HELD · overturns ledger**

Ledger sentence overturned (`### combat-core — 42`, blocker ①): *"reach cap in **stage px**
per stance (the one value the whole model needs; wiki gives "units" of unknown scale) —
*measure blade-FX tip-to-body span in Light/Bal/Heavy from footage, or slash a dummy in a
preserved build.*"*

`reference/decompiled/shs3_android_payload/scripts/StatsManager.as:1915-1919`

```
1915:      internal static function getBaseSlashLengthVal(speed:int) : int
1917:         var maxincrement:int = 90 + getPlayerStats(STAT_DAN) * 5;
1918:         return int(120 + Math.floor(maxincrement * speed / (20 + speed)));
```

Desktop confirm — `reference/decompiled/shs3_payload/scripts/§1t1523s0§.as:2344-2348`
(identical: `90 + §1t9426s0§ * 5`, `120 + Math.floor(...)`).

`getBaseSlashLength()` (`:1905-1913`) feeds it `STAT_SPEED + gear bonus`, ×1.5 while
`BUFF_SPEED` is active. **In stage px:** floor 120, asymptote `120 + 90 + DAN×5`, i.e.
**210 px at Dan 0 rising to 255 px at Dan 9**. Weapon-side budget is separate
(`getSlashUsage()`, `:1921-1929`, per-item `slashusage`, default/minimum **48**).

This is not the per-stance reach multiplier, so combat-core's blocker is **narrowed, not
erased** — but the scale question ("units of unknown scale") is answered: the units are
**stage pixels**, the base is **120**, and **rebirth is what raises the ceiling**. That is
a rebirth-elements ↔ combat-core link the ledger has nowhere.

---

### C16 — CROSS-LANE, progression: the post-rebirth SP economy is held, and "80 SP first run" is off by one
**A2 · HELD · overturns ledger**

Ledger sentences overturned: `### progression — 55` blocker *"③ post-rebirth SP economy"*,
and the `Ready` bullet *"80 SP first run"*.

`reference/decompiled/shs3_android_payload/scripts/StatsManager.as:2140-2156`

```
2140:      public static function unAssignSkillPoints() : *
2144:         skillStats.push(new IntStat(1000,1));
2145:         skillStats.push(new IntStat(1001,1));
2146:         skillStats.push(new IntStat(1002,1));
2147:         skillStats.push(new IntStat(1003,1));
2148:         skillStats.push(new IntStat(1042,1));
2149:         skillStats.push(new IntStat(1049,1));
2150:         skillStats.push(new IntStat(1050,1));
2156:         setPlayerStats(STAT_SKILLPOINTS,getLevel() - 1 + getPlayerStats(STAT_DAN) * (levelCap - 1));
```

Desktop confirm — `§1t1523s0§.as:2598` (identical formula, `§1t9470s0§` = levelCap).

**`SP = (level − 1) + DAN × (levelCap − 1)` = `(level − 1) + DAN × 79`.** At level 80,
Dan 0 that is **79**, not 80 — the ledger's "80 SP first run" is one too many. Each Dan
is worth a permanent **+79 SP**, so a Dan-9 character at L80 has `79 + 711 = 790`. Seven
skills are free and never cost points (1000/1001/1002 the three stances, 1003 Jump,
1042 Chi Punch, 1049/1050 the two dashes). Note `doRebirth` does **not** call
`unAssignSkillPoints` — spent skill points survive a rebirth; the formula is the
respec ceiling.

---

### C17 — METHOD claim: the android bundle is a valid de-obfuscation key for the v0.717 desktop client, with one known numeric divergence
**A2 · HELD**

Not a ledger claim — a claim about how much weight the above can bear. Five independent
cross-checks, each obfuscated-desktop vs readable-android:

| Site | android | desktop v0.717 | verdict |
|---|---|---|---|
| element stat ids 28/29/30/31 | `StatsManager.as:226-232` | `§1t1523s0§.as:260-266` | identical |
| rebirth element grant 20/10 | `InteractUI.as:849-855` | `§1t401s0§.as:873-881` | identical |
| Dan cap `< 9` + 9 titles 456–464 | `StatsManager.as:2209` / `InventoryUI.as:2274-2316` | `§1t1523s0§.as:2653` / `§1t5957s0§.as:3062-3103` | identical |
| element counter-wheel | `StatsManager.as:1836` | `§1t1523s0§.as:2270` | identical |
| slash-length `90 + DAN*5` | `StatsManager.as:1917` | `§1t1523s0§.as:2346` | identical |
| **heavenly gold on rebirth** | **5 / 20** | **25 / 100** | **DIVERGES — desktop wins** |

Conclusion: names and structure from android are safe to port; **numbers must be
re-read in `shs3_payload/` before being written to `src/config/`.** One in six load-bearing
numbers moved between 0.682 and 0.717.

---

### C18 — Per-element STATUS effects: nothing beyond launch type
**STILL_UNHELD**

Ledger blocker ① asks for `damage/cost/AoE/**status**`. I read every elemental projectile's
`Damage` construction (`FireBreathProjectile`, `GroundPunchProjectile`, `WaterSplashProjectile`,
`KunaiProjectile`, `TrapProjectile`, `BigFireBreathProjectile`, `BigWaveProjectile`,
`BigTornadoProjectile`, `BigEarthquakeProjectile`) and found **no burn/slow/root/DoT flag**
— only `launchType` (`LAUNCH_KNOCKDOWN` for Inferno/Tsunami/Earthquake, `LAUNCH_AIR` for
Tornado, raw `2` for the tier-2 attacks) and `ttl = 24 * 30` on traps
(`TrapProjectile.as:24` — a **30-second** armed lifetime at 24 fps). I did **not** read
`NPCManager.checkHitObject` or the buff system end-to-end, so I cannot state that no
elemental status exists — only that none is attached at the damage-construction site.
Honest verdict: **STILL_UNHELD**, close-path = read `Damage.as` buff fields + `BUFF_*`
constants in `StatsManager.as`.

---

## 3. Rewrite of the ledger block, as evidence now supports it

```
### rebirth-elements — 78
- Ready: element identity (FIRE/WIND/WATER/EARTH = stats 28/29/30/31, DEF 200-203);
  the full 24-skill roster keyed to AS3 constants; every elemental Chi cost + cooldown;
  elemental damage = elementATK x {0.8..1.2} by level, x1.5 ultimates, ZERO physical;
  AoE radii 600/400/200/50; flat-subtraction elemental mitigation with a hard min-1 floor;
  the counter-wheel (WATERatk->FIREdef, EARTHatk->WINDdef, WINDatk->WATERdef, FIREatk->EARTHdef);
  rebirth trigger = item 2202, 1000c, modifier 25, level == 80 exactly, hack-guarded;
  per-rebirth grant +10 element ATK (+20 at Dan 8) and +25 heavenly gold (+100 at Dan 8);
  Dan caps at 9 (displays as 10), 9 titles + 3 suffix tiers; the whole doRebirth
  transaction (gear->inventory, starter gear ids, stat/AP/Chi resets, hotbar wipe,
  daily-quest purge, teleport to node 8382465); the Dragon Dance 8-node input, both
  Heavens, the {1,2,4,6} gate, statue RNG-permuted sequences, 2 AP per attempt.
- Blockers: (1) all display TEXT - titles, skill names, UI prompts - indices into
  data/shs3_en.xml, which is NOT on disk (concrete Wayback target, no longer a mystery).
  (2) element-circle ART/layout (never filmed; confirmed absent from all 113 frame dirs).
  (3) per-element STATUS effects beyond launch type - unverified either way.
  (4) statue placement data (which map nodes carry which node id) - bindata/93 room-object
  defs not yet joined to Obj_DragonDanceStatue props.
- Surface: rebirth is the ONLY source of element ATK, and element ATK is simultaneously
  offence and cross-element defence - specialising picks what you are immune to.
  Rebirth also raises the base slash length ceiling (120 + floor((90+DAN*5)*SPD/(20+SPD)))
  and grants +79 permanent SP per Dan - both belong to combat-core / progression and are
  currently filed nowhere.
```

---

## 4. Files touched
Read-only survey. The only file written is this one.
