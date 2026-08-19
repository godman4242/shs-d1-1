# L0 SOURCE SURVEY — `npcdata` (orthogonal sweep)

**Unit:** `reference/extracted/npcdata.xml` (228,413 bytes · 9,625 lines · 495 `<npc>`)
**Document under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20, avg ~42)
**Surveyor:** source-lane agent. Counts taken from `docs/gauntlet/L0/index/npcdata.json`
(authoritative) and re-derived by parse where a new axis was needed.

**Cross-source parsers used (all A2):**
`reference/decompiled/shs3_android_payload/scripts/XMLNpc.as` — the shipped parser for THIS file
`.../NPCManager.as` · `.../NPC.as` · `.../XMLReward.as` · `.../XMLLoot.as` · `.../MCSCharacter.as`

**Android-vs-web caveat (S0-3): CLOSED FOR THIS FILE.** See claim `npcdata/build-parity`.

---

## Structural map of the file (first-hand, re-derived)

| id range | n | what it is |
|---|---:|---|
| 0 | 1 | bare paperdoll template, no name/ai/lvl (line 3) |
| 1–91 | 90 | the hand-authored campaign bestiary (Ruffian → Undead → Oni → animals) |
| 100–199 | 99 | named story NPCs + townsfolk (Beggar, Sensei, Hachi, Yasuka, Jinbei…) |
| **200–256** | 57 | **clan army A** |
| **300–356** | 57 | **clan army B** |
| **400–456** | 57 | **clan army C** |
| **500–556** | 57 | **clan army D** |
| **600–656** | 57 | **clan army E** |
| 800–819 | 20 | late-added bosses (Mad Cultist, Guardian, General Daisuke) + 6 mannequins |

Direct `<npc>` child-tag census (mine): `id` 495 · `name` 490 · `ai` 425 · `attack` 406 ·
`hp` 403 · `lvl` 402 · `defense` 394 · `scalex`/`scaley` 16 · `earth` 3 · `fire` 1.
**No `<speed>`, no `<chi>`, no `<exp>`, no `<water>`, no `<wind>` anywhere in the file.**

---

## CLAIMS

### 1. `npcdata/level-stat-formula` — **HELD (A2) — OVERTURNS §2 + §4 enemies-ai blocker ①**

Ledger sentence overturned (§4 enemies-ai — 34):
> "**Blockers:** ① enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred)."

The formula is not absent. `npcdata.xml` carries a **contiguous, unbroken level-11→40
ladder** (the `<name>5053</name>` "Soldier" rows, ids 212–247 and their four clan
duplicates) whose stats are an exact closed form:

```
HP  = ceil(2.5 × lvl)
ATK = ceil(2.4 × lvl)
DEF = ceil(2.4 × lvl)      (ATK == DEF for every row in the band)
```

Verified against **all 30 levels 11–40 with zero exceptions** (script re-derivation over the
parsed rows). Verbatim anchor, `reference/extracted/npcdata.xml:4666-4672`:

```
		<id>212</id>
		<name>5053</name>
		<lvl>11</lvl>
		<hp>28</hp>
		<ai>1</ai>
		<attack>27</attack>
		<defense>27</defense>
```
ceil(2.5×11)=28 ✓ · ceil(2.4×11)=27 ✓ (and lvl 12 at :4685-4689 → 30/29/29 ✓).

**Lane impact — enemies-ai (L?):** blocker ① is dead. The whole roster's balance is now
codeable as two constants.

### 2. `npcdata/high-band-coefficients` — **HELD (A2)**

The coefficient is **per-tier, not global** — a builder who extrapolates 2.5/2.4 past L40 is wrong.

| band | rows | HP | ATK | DEF |
|---|---|---|---|---|
| lvl 11–40 ("Soldier") | 30 levels | ceil(2.5·L) | ceil(2.4·L) | ceil(2.4·L) |
| lvl 45–60 ("Heavy Soldier") | 4 levels | ceil(2.5·L) | ceil(2.5·L) | **2.8·L** (exact) |
| lvl 70 ("Castle Guard") | 1 level | 2.5·L | 2.5·L | 2.5·L |

Anchor `npcdata.xml:5318-5324` (Heavy Soldier id 248): `<lvl>45</lvl> <hp>113</hp>
<attack>113</attack> <defense>126</defense>` — 2.5×45=112.5→113, 2.8×45=126 exactly.
Anchor `:5393-5399` (Castle Guard id 252, lvl 70): 175/175/175.

### 3. `npcdata/per-enemy-hp` — **HELD (A2) — OVERTURNS enemies-ai blocker ②**

Ledger: *"② per-enemy HP."* — 403 `<hp>` rows on disk, range 1…1000.

- `npcdata.xml:22-27` Ruffian (lvl 3): `<hp>1</hp>` — **1 HP.** Independently corroborates the
  SESSION-11 measured finding that field mobs die in ONE hit.
- Highest: Hiroshi `:3121` lvl 80 `<hp>1000</hp>`; Mad Cultist `:4072` lvl 23 `<hp>800</hp>`;
  Amaya `:3842` lvl 30 `<hp>600</hp>`; Tadao `:3442` lvl 10 `<hp>200</hp>`.

Ledger §4 "Surface" line — *"the shipped `AI_TIERS`/`ENEMY_BASE` are a PvP-duel dummy (hp 150)"* —
is now checkable: **hp 150 appears in the roster only at lvl 60** (Heavy Soldier). Nothing in the
495-row roster is an hp-150 low-level enemy.

### 4. `npcdata/ai-taxonomy` — **HELD (A2) — the complete 38-class AI table**

`<ai>` is not an opaque tier number: `NPCManager.as:516-634` is a `switch(xml.ai)` that maps
**ai 0–37 one-to-one onto named actor classes**. Verbatim (`NPCManager.as:521-525`):

```
            case 1:
               actor = new EnemyKnife(MCSPool.getMCS());
               break;
            case 2:
               actor = new EnemyArcher(MCSPool.getMCS());
```

Full map, cross-tabbed against which npcdata rows use it:

| ai | class | rows | example NPCs |
|---:|---|---:|---|
|0|EnemyPlayer (networked duelist)|0|set at runtime, `XMLNpc.as:315`|
|1|EnemyKnife|56|Ruffian, Bandit, Soldier|
|2|**EnemyArcher**|48|Thug, Bandit, Cultist|
|3|EnemyKatana|52|Duelist, Guard, Mercenery|
|4|EnemySpear|47|Soldier, Ninja|
|5|EnemyShield|48|Bandit, Cultist|
|6|EnemyNinja|3|Kurai, Jonin, Ninja|
|7|EnemyCivilian|6|Peasant, Charcoal Burner|
|8|EnemyWolf|2|Wolf|
|9|EnemyPlayer (AI, non-elite)|73|Elite/Heavy Soldier, Castle Guard, Santa|
|10|EnemyWolf2|**0**|— unused in data|
|11|EnemyWolfAlpha|1|Wolf (lvl 15, hp 100)|
|12|EnemyHorse|1|Horse|
|13|EnemyTrainingDummy|1|Training Dummy|
|14|EnemyPlayer (elite flag)|15|Bandit Leader, Bounty Hunters, General Daisuke|
|15|EnemyPlayerGiant|**0**|— unused in data|
|16|EnemyNianMonster|**0**|— unused (the Nian Monster row uses ai 28)|
|17|EnemyBear|1|Bear|
|18|EnemyBoar|1|Boar|
|19|EnemyDeer|1|Deer|
|20|**EnemyVegePatch**|1|id 64 — a farm plot modelled as a 10-HP enemy|
|21|EnemyStag|1|Stag|
|22|EnemyGoblin|1|Oni|
|23|EnemyOgre|1|Oni|
|24|EnemyFox|1|Fox|
|25|EnemyGoblinThrower|1|Oni|
|26|EnemyZombie|8|Undead|
|27|EnemyJiangSi|1|Undead|
|28|EnemySpearElite|24|Hiroshi, Bear(L60), Blacksmith, Nian Monster|
|29|EnemyElite|10|Aboshi, Gojo Takamori, Magoichi, Yohei|
|30|**FriendlyElite**|8|Satoshi, Fumio, Hachimaru, Shou, Scout, Old Guard|
|31|**FriendlySpearElite**|1|Yuudai|
|32|EnemyCivilianOld|2|Kojuro|
|33|EnemyCivilianFemale|2|Chikako|
|34|**FriendlyArcher**|3|Mitsuo|
|35|EnemySorcererBoss|1|Mad Cultist|
|36|**EnemyKanjiGuardian**|1|Guardian (scale 2.0)|
|37|EnemySpearElite(variant)|2|Tadao, Amaya|

Secondary A2: `XMLNpc.as:647` — `return this.ai == 8 || this.ai == 10 || this.ai == 11 ||
this.ai == 12 || this.ai == 16 || this.ai == 17 || this.ai == 18 || this.ai == 19 ||
this.ai == 21 || this.ai == 24;` — the animal set, in code.

### 5. `npcdata/friendly-npcs` — **HELD (A2) — a whole actor category the ledger never mentions**

12 npcdata rows use **ally** AI ids (30 FriendlyElite / 31 FriendlySpearElite / 34 FriendlyArcher).
`§4 enemies-ai` has no ally concept at all — it describes only enemies and "independent-aggro
(no coordination)". Escort/ally combatants are shipped content: Satoshi (`:3365`), Fumio (`:3424`),
Mitsuo (`:4021`, `:4256`), Hachimaru (`:3760`), Shou (`:3777`), Scout (`:4313`), Old Guard (`:2418`),
Yuudai (`:3506`), Chikako (`:3573`).

### 6. `npcdata/elemental-wheel` — **HELD (A2) — OVERTURNS rebirth-elements blocker ②**

Ledger: *"② elemental ATK-vs-DEF **formula**."*
`XMLNpc.as:194-213` — each element tag sets **an attack stat AND the defence stat of a
different element**, a hard identity:

```
         if(xml.fire.toString() != "")
         {
            this.STAT_FIREATK = xml.fire;
            this.STAT_EARTHDEF = xml.fire;
         }
```
…and the same pattern for `wind → WINDATK + WATERDEF`, `water → WATERATK + FIREDEF`,
`earth → EARTHATK + WINDDEF`. Re-stated for players at `XMLNpc.as:334-337`:
`STAT_FIREDEF = stats[STAT_WATERATK] …; STAT_EARTHDEF = stats[STAT_FIREATK] …`.

**The wheel: your Water-attack IS your Fire-defence · Fire-attack IS your Earth-defence ·
Earth-attack IS your Wind-defence · Wind-attack IS your Water-defence.** There is no separate
elemental-defence stat to find. Blocker ② is closed structurally.

### 7. `npcdata/elemental-roster-empty` — **HELD (A2, negative)**

Only **4 of 495** NPCs carry any elemental value, and **all four are player ALLIES**:
Satoshi `:3380 <fire>10</fire>` (ai 30), Fumio `:3439 <earth>10</earth>` (ai 30),
Mitsuo `:4039` and `:4272` `<earth>10</earth>` (ai 34). Zero `<water>`, zero `<wind>` in the file.
→ **No enemy in the shipped roster is elemental.** Elemental combat is a player/ally-side system
in v0.717 data, not an enemy-typing system.

### 8. `npcdata/loot-enum-and-coins-per-kill` — **HELD (A2) — OVERTURNS economy blocker ①**

Ledger (§4 economy — 48): *"① coins-per-kill reality (`=8` is an **unconfirmed INFERRED seed**…)."*

`NPC.as:837-856` resolves the small loot ids that make `npcdata`'s reward blocks unreadable:

```
               if(lootType == 0)
               {
                  OverworldHUD.instance.lootDialog.addLootCoins(1 * qty);
               }
               else if(lootType == 1)
               {
                  OverworldHUD.instance.lootDialog.addLootCoins(5 * qty);
               }
               else if(lootType == 2)
               {
                  OverworldHUD.instance.lootDialog.addQuestLootItem();
               }
               else if(lootType == 3)
               {
                  OverworldHUD.instance.lootDialog.addRandomLootItem(this.level,false,true);
               }
               else
               {
                  OverworldHUD.instance.lootDialog.addLootItemBasic(lootType,qty);
               }
```
Roll rule `NPC.as:805-806`: `chance = loot.chance * 100; if(chance == 100 || Math.random()*100 < chance)`
— per-entry independent roll; `<chance>1</chance>` is guaranteed.

Expected coins per kill, computed over the 66 NPCs that carry `<reward>`:

| NPC (line) | lvl | EV coins | non-coin loot |
|---|---:|---:|---|
| Ruffian `:22` | 3 | **1.0** | — |
| Thug `:145` | 2 | 1.5 | — |
| Bandit `:273` | 10 | **0.75** | 10% random-item-at-enemy-level |
| Soldier `:581` | 10 | 0.75 | 10% random item |
| Ninja `:841` | 10 | 2.5 | — |
| Mercenery `:1043` | 6 | 5.0 | — |
| Mercenery Captain `:1216` | 10 | **10.0** | — |
| Boar/Deer `:1961/:1987` | 8 | 0 | 30% Meat / 30% Small Meat |
| Wolf `:1844` | 15 | 0 | 50% Animal Fang + guaranteed quest item |
| bosses (Tadao, Aboshi, Mad Cultist, Guardian) | — | 0 | guaranteed quest item |

**Field trash yields ~0.75–2.5 coins per kill, not 8.** `COINS_PER_KILL=8` matches nothing except a
Mercenery Captain. Also: `addRandomLootItem(this.level, …)` — item drops roll off the **enemy's level**,
which is the missing hook for items-equipment blocker ① (stat-vs-level curve).

### 9. `npcdata/no-kill-xp` — **HELD (A2, negative)**

`XMLReward.as` parses an `<exp>` field. `grep -c "<exp>" reference/extracted/npcdata.xml` → **0**.
And **429 of 495 NPCs have no `<reward>` block at all** — including all 285 clan-army rows.
→ Kill-XP is not in this file. §4 progression blocker ④ ("full XP-income model") stays open on the
XP side; the *coin* side is closed by claim 8.

### 10. `npcdata/paperdoll-13-slots` — **HELD (A2) — CONTRADICTS the ledger's "9-slot paperdoll"**

Ledger §1 KNOWN-KNOWNS: *"9-slot paperdoll + affix prefix pool + soul-infusion rules"*;
§4 items-equipment "Ready: **9-slot paperdoll**".

`<mcs>` in npcdata carries **12 slot tags**: `armor gloves hair hat head mask neck pants shoes
weapon prop1 prop2` (index counts: armor 479, gloves 58, hair 462, hat 287, head 115, mask 131,
neck 29, pants 489, shoes 472, weapon 470, prop1 217, prop2 1). Plus per-slot colour overrides
`armorpcolor/armorscolor/pantspcolor/pantsscolor/hatpcolor/hatscolor` (`MCSCharacter.as:524-547`).

The equipment vector is **13 wide** — `XMLNpc.as:705` `new Vector.<Item>(13)`, and
`XMLNpc.as:36`:
```
      public static var DEFAULT_EQSTRING:String = "4017|0|6019|0|8005|0|0|11017|12017|13002|13002|0|0";
```
(armor|gloves|hair|hat|head|mask|neck|pants|shoes|weapon|scabbard|·|·). Slot→ID-band contract:
**4000 armor · 5000 gloves · 6000 hair · 7000 hat · 8000 head · 9000 mask · 10000 neck ·
11000 pants · 12000 shoes · 13000 weapon/prop**; the 6500/8500/11500 sub-bands are the female art set.

### 11. `npcdata/compositing-contract` — **HELD (A2) — OVERTURNS items-equipment blocker ⑤**

Ledger: *"⑤ **sprite-compositing contract** (layer order, per-slot body render — a from-scratch-art blocker)."*

It is not a flat layer stack — it is a **bone tree**, and each equipment slot paints multiple bones.
`MCSCharacter.as` attach points (grep of `addChild`/`setChildIndex` in the component setters):

- `head` ← component@index 0, `headMask`@1, `hatHair`@2, `hair`@3 (`:682-755` — explicit z-order)
- `hat`, `neck`, `l_hand`, `r_hand`, `l_foot`, `r_foot`, `weapon`, `prop`, `prop2`
- armor band paints `torso`, `stomach`, `l_uparm`, `r_uparm`, `l_lowarm`, `r_lowarm`, `pelvic`
- pants band paints `crotch`, `l_thigh`, `r_thigh`, `l_calf`, `r_calf`
- shoes band paints `l_foot`, `r_foot`; `l_calf`/`r_calf` also take a shoe component at child-index 0

Independently corroborated by the **web** payload's surviving un-obfuscated class names
(`reference/decompiled/shs3_payload/scripts/`): `torso4000.as stomach4000.as pelvic4000.as
uparm4000.as lowarm4000.as hand5000.as hair6000.as hat7000.as head8000.as mask9000.as
neck10000.as thigh11000.as crotch11000.as calf11000.as foot12000.as foottop12000.as
weapon13000.as prop13000.as` — i.e. the band number IS the bone-art prefix.

One more indirection to carry: `MCSCharacter.as:585-592` — the sprite key is **`xmlItem.art`,
not the item id** (`var xmlItem:XMLItem = QuestEngine.getItemData(id); … art = xmlItem.art;`),
which is why five clans can share one string name and differ visually (claim 15).

### 12. `npcdata/random-appearance-weighting` — **HELD (A2)**

The comma lists in `<mcs>` are not "the NPC wears all of these" — they are a uniform random pick,
and repeated `0` entries are a **weighting device for "wear nothing"**.
`MCSCharacter.as:574-579`:
```
      internal function processString(xmlstring:String) : int
      {
         var selectArray:Array = new Array();
         selectArray = xmlstring.split(",");
         return selectArray[int(Math.random() * selectArray.length)];
      }
```
Applied to `npcdata.xml:155`:
```
			<hat>0,0,0,0,0,7003,7008,7009,7010,7011,7012,7013,7014,7015,7016,7017,7020</hat>
```
→ a lvl-2 Thug is bald with probability **5/17 ≈ 29.4%**, else one of 12 hats. Every "0,0,0,…" run
in this file is a shipped probability, not padding. (Same pattern hard-coded in
`XMLNpc.as:510/532/544` for procedural townsfolk.)

### 13. `npcdata/shipped-bugs` — **HELD (A2) — three original defects, replicable for 1:1**

**(a) `6015.6017` — period for comma.** Present in the data on ~100 hair lines, e.g.
`npcdata.xml:31`:
```
			<hair>6000,6001,6002,6003,6004,6007,6008,6009,6013,6014,6015.6017,6018,6019</hair>
```
and — decisively — **also in the shipped ActionScript source**, `XMLNpc.as:460`:
```
            hairlist = [6000,6001,6002,6003,6004,6007,6008,6009,6013,6014,6015.6017,6018,6019];
```
(also `:486`, `:497`, `:531`). Effect: hair 6016 and 6017 never spawn on those archetypes;
the token evaluates to 6015. This is an ORIGINAL bug, not an extraction artifact.

**(b) `npcdata.xml:1644` — a whole pool collapsed into a float.**
```
			<hair>6.5006501650265E+47</hair>
```
This is NPC id 55 (a female civilian, ai 33). The intended pool was
`6500,6501,…,6519`; the file ships the scientific-notation collapse of it.

**(c) `npcdata.xml:4368-4430` — hat ids typed into `<attack>`.** NPCs 815–818 carry
`<attack>7092</attack>`, `<attack>7076</attack>`, `<attack>7077</attack>`, `<attack>7040</attack>`
while their `<hat>` reads 7093/7094/7095/7096. `XMLNpc.as:161` reads `this.attack = xml.attack`
unconditionally. These are showcase mannequins (no lvl/hp/ai), so it never fired in play — but a
faithful port must decide whether to reproduce it.

### 14. `npcdata/build-parity` — **HELD (A3) — CLOSES the S0-3 android caveat for this file**

S0-3 warns *"this is the ANDROID build, clientVersion 0.682 … combat tuning parity is NOT
established."* For npcdata it now is. Byte-comparison (run this turn):

```
web bytes 218792 android(no decl) bytes 218793
IDENTICAL: True
```
(`reference/extracted/npcdata.xml` vs `reference/extracted/android/125_Mobile_NpcData.bin`,
after normalising CRLF→LF and stripping the Android copy's `<?xml …?>` declaration.)

→ Every number in claims 1–13 is the **web v0.717** number, not an Android approximation.
It also proves the three defects in claim 13 shipped in both builds.

### 15. `npcdata/five-clan-armies` — **HELD (A2) — FIVE factions, not four**

Ledger §4 meta-social: *"**Ready:** 4 clans (heraldry/masks/daimyo/capitals) + Shira Tancho story-only."*

ids **200–256, 300–356, 400–456, 500–556, 600–656** are five *identical* 57-NPC ladders
(lvl 1→70, ai 1/2/3/4/5/9/28), **285 rows = 58% of the whole file**, differing **only** by
equipment item id:

| clan block | base Soldier `<armor>` | Castle Guard `<armor>` / `<hat>` |
|---|---|---|
| 200s (`:4451`) | 4038 | 4040 / 7024 |
| 300s (`:5486`) | 4041 | 4043 / 7025 |
| 400s (`:6521`) | 4044 | 4046 / 7026 |
| 500s (`:7556`) | 4047 | 4049 / 7027 |
| 600s (`:8591`) | 4053 | 4052 / 7029 |

All five armor ids resolve to the same string ("Garment" / "Medium Armor") — the differentiation is
**per-item ART, not a tint** (see claim 11's `xmlItem.art` indirection). This is the War-Room /
clan-war army roster, with a shared level curve — a topology the ledger calls
*"② War-Room **map topology**"* and *"① server-authoritative simulation"*. The armies themselves
are recoverable. **None of the 285 rows carries a `<reward>`** — clan-war kills drop nothing.

### 16. `npcdata/procgen-town` — **HELD (A2)**

`XMLNpc.initProcGenNPC` (`:403-597`) is the town-population generator that fills every room the
authored roster does not. `XMLNpc.as:415-418`:
```
         var seed:int = nodeid * date + roomid * (index + 3);
         var rng:RNG = new RNG(seed);
         var male:Boolean = true;
         dice = rng.rand(8);
```
Six archetypes with a shipped weighting: `rand(8)` → {0,6}=COMMONER, 1=OLDCOMMONER, 2=NOBLE,
3=FATNOBLE, 4=FEMALE, {5,7}=SAMURAI (`:419-442`); female samurai at `rand(3)==2` (`:449-453`);
OLDCOMMONER gets `ai = 32` on a coin flip (`:477-480`); FEMALE always `ai = 33` (`:523`).

Two consequences the 12-system ledgers miss:
- **`date` is in the seed** → the town's population changes with the real-world day. This is the
  concrete hook for world-exploration blocker ③ *"real-world **'day'** length"*.
- **NPC names come from the bindata name tables** (S0-1's blobs 94–98): `NameGenerator.getInstance()
  .getCommonerName(rng,male)` / `getNobleName` / `getSamuraiName` / `getSentryBotName`
  (`:296, :458, :484, :529`). The five name generators are wired to a specific consumer.

### 17. `npcdata/boss-movesets` — **HELD (A2)**

96 NPCs carry `<skills>` (647 `<skill>` rows), collapsing to **16 distinct movesets**, all
resolvable through `docs/gauntlet/L0/index/strings.json`. Verbatim, `npcdata.xml:535`:
```
		<skills><skill><id>1000</id><lvl>10</lvl></skill><skill><id>1001</id><lvl>10</lvl></skill><skill><id>1002</id><lvl>10</lvl></skill><skill><id>1003</id><lvl>1</lvl></skill><skill><id>1004</id><lvl>5</lvl></skill><skill><id>1006</id><lvl>1</lvl></skill></skills>
```
= Light/Balanced/Heavy Stance Mastery @10, Jump @1, Roll @5, Slash Wave @1 — the standard
elite kit, shared by 73 NPCs.

Boss kits are individual, e.g. Gojo Takamori (`:3917`): *?1501@3, Jump, Roll@3, Dash R/L, **Shunpo**,
Slash Wave@2, Chi Punch, Chi Kick, Spirit Thief, **Heavenly Sword@3**, Back Throw, Air Stab, **Undying***.
Chikako (`:3573`): Balanced Mastery@3 … Smoke Bomb@2, Substitution Jutsu@2, **Flashbang**, **Shadow Clone**.
Satoshi (`:3365`, an ally): … Thousand Stabs, **Fire Breath@2**.

Two orthogonal facts fall out:
- **Shunpo is a real, assignable skill** carried by Hachimaru/Shou/Magoichi/Gojo — skills-meters
  blocker ② ("Shunpo's real effect") now has a skilldata row to read, not just a name.
- **Skill category 11 is an enemy-only bucket**: Back Throw, Air Stab, Bull Charge, Punch Lunge,
  Undying, **1500**, **1501** — and 1500/1501 have **no string-table entry at all**
  (`skilldata.xml:1948` and `:1960`, both with empty `<chi>`/`<cooldown>`/`<desc>`). They are used
  only by Aboshi/Magoichi (1500) and Gojo Takamori (1501). Together with the bindata
  `dual_stance` / `reversed_stance` animation sets (S0-1), the shipped game has **five stance
  masteries, two of them boss-only and unnamed** — not three.

### 18. `npcdata/damage-is-a-range` — **PARTIAL (A2)**

Ledger §1: *"Damage math: Physical = (ATK + WeaponDMG) × stanceMult."*
`XMLNpc.as:352-364` shows the weapon term is a **range**, and exposes a hard floor constant:
```
            this.minDamage = this.attack;
            this.damageRange = 0;
            this.slashUsage = 48;
         }
         else
         {
            this.minDamage = this.attack + itemdata.mindamage;
            this.damageRange = itemdata.maxdamage - itemdata.mindamage;
            this.slashUsage = itemdata.slashusage;
            if(this.slashUsage < 48)
            {
               this.slashUsage = 48;
            }
```
→ `damage ∈ [attack + item.mindamage, attack + item.maxdamage]`, and **`slashUsage` is clamped to
a minimum of 48**. Marked PARTIAL because this is the *PvP duelist* init path (`initDuelist`);
whether the PvE `NPC.init(xml)` path applies the same range is not established here, and no
stance multiplier appears in this function.

### 19. `frames/pillarbox-confirmed` — **HELD (A1) — ANSWERS ui-hud blocker ①. THE FRAME WINS.**

Ledger §1 UNKNOWN-UNKNOWNS: *"**Aspect-ratio truth** — native canvas is **800×480 (5:3)**, so HUD
x-fractions measured off 16:9 video may be pillarbox-wrong."* §4 ui-hud blocker ①:
*"① **aspect-ratio truth** (5:3 native → are x-fractions pillarbox-wrong?) — *inspect `unt.png`
for side-bars*."*

Opened the frame and looked. **The side bars are there.**
Crops used: `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (1920×1080), crop
`(960,300)-(1920,760)` upscaled ×2 — a black vertical band is plainly visible down the right edge
of the crop, against the stone-wall background. Column-brightness profile of the full frame
(mean RGB per column, sampled every 3rd row):

```
left  cols : (48, 1.1) (50, 0.5) (52, 36.7) (54, 78.5) (56, 78.5) …
right cols : … (1864, 87.3) (1866, 69.0) (1868, 1.1) (1870, 1.3) (1872, 0.4)
```
→ game content occupies **x ≈ 53 … 1866** (1,814 px of 1,920), full height 1080, both bars ~53 px.
Same measurement on `Nr4fQstqHDM_431.5.png`: identical, x 52…1867.

Measured aspect **1814/1080 = 1.680**, which is 5:3 (1.667) within video-scaling error and nowhere
near 16:9 (1.778). **Any HUD x-fraction taken as `x_pixel / 1920` is wrong by ~5.5%** and must be
re-based on `(x_pixel − 53) / 1814`. Ledger §3 item 12 ("native is 800×480") is corroborated;
the unknown-unknown is closed.

*(Also visible in the same crop and worth logging: an orange **coin-pouch loot projectile in
mid-air**, and a bloodied kasa-wearing enemy collapsing bottom-left — the visual counterpart of
`NPC.createLoot()` / `ProjectileManager.createLootProjectile` from claim 8.)*

### 20. `npcdata/no-speed-no-chi` — **HELD (A2, negative)**

`XMLNpc.as:151-182` defaults `chi = 1` and `speed = 1` when the tags are absent. Tag census over
all 495 `<npc>` blocks: **zero `<chi>`, zero `<speed>`.**
→ **Every NPC in the game ships with speed 1 and chi 1.** Enemy attack cadence/cooldowns are
therefore *not* data-driven per-NPC — they live in the per-AI-class code (`EnemyKnife`,
`EnemyArcher`, …). §4 enemies-ai blocker ③ ("telegraph/active/recovery + stagger frames") is
**not** closable from npcdata; it is closable from those 38 classes. Recording as a lead, not a claim.

---

## STILL_UNHELD from this source

- **Aggro / leash / spawn geometry** (enemies-ai blocker ④). npcdata carries no position, radius or
  spawn field. It is not in this file. Lead: the per-AI-class scripts + `112_Mobile_NodeData`.
- **Telegraph / active / recovery / stagger frames** (blocker ③) — see claim 20.
- **Undead damage-reflect probability** (blocker ⑤) — no such field in npcdata; `EnemyZombie` /
  `EnemyJiangSi` are the places to look.
- **NPC name id 5017** (6 rows, ids 50–55) is the one string-table miss in this file
  (`resolved_names.json` → `misses: 6`, all id 5017). Unresolved; do not guess it.
