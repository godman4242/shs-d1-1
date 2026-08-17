# L0 SOURCE SURVEY — `npcdata` (orthogonal sweep)

**Unit:** `reference/extracted/npcdata.xml` (228,413 bytes, 9,625 lines, 495 `<npc>`)
**Document under audit:** `docs/research/REBUILD_READINESS.md` (2026-07-20, avg ~42)
**Surveyor:** L0 source lane. Method: index JSON first (`docs/gauntlet/L0/index/npcdata.json`),
then exhaustive first-hand parse of the XML with line numbers, then cross-resolve ids via
`docs/gauntlet/L0/index/resolved_names.json` + `strings.json` (⚠ ANDROID build v0.682, S0-3 caveat).

Counts re-derived first-hand and matching the index exactly: 495 `<npc>`, 425 `<ai>`,
**647 `<skill>`** (all inside 96 `<skills>` blocks, all of the strict form
`<skill><id>N</id><lvl>M</lvl></skill>`), 403 `<hp>`, 406 `<attack>`, 394 `<defense>`,
402 `<lvl>`, 490 `<name>`, 131 `<loot>`, 66 `<reward>`, 495 `<mcs>`.

---

## HEADLINE — the ledger's #1 enemies-ai blocker is DEAD

> **REBUILD_READINESS.md §4 enemies-ai, Blockers ①:**
> *"enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred)."*
> (echoed in §2's table: *"enemy level→stat formula; per-enemy HP"*)

**It is not absent. It is in the payload, and it is EXACT.**

`npcdata.xml` contains five structurally identical 57-unit armies at id blocks
`200–256`, `300–356`, `400–456`, `500–556`, `600–656`. Every unit carries
`<lvl>`, `<hp>`, `<attack>`, `<defense>`. Regressing them yields a closed form that
reproduces **225 of 225** rows at lvl ≥ 11 with **zero** violations:

| level band | hp | attack | defense |
|---|---|---|---|
| 1–5   | `1` (pinned) | `lvl` | `lvl` |
| 6–10  | `lvl` | `lvl` | `lvl` |
| 11–40 | `ceil(2.5 × lvl)` | `ceil(2.4 × lvl)` | `ceil(2.4 × lvl)` |
| 45–60 (Heavy Soldier) | `ceil(2.5 × lvl)` | `ceil(2.5 × lvl)` | `ceil(2.8 × lvl)` |
| 70 (Castle Guard) | `2.5 × lvl` | `2.5 × lvl` | `2.5 × lvl` |

Verbatim anchor rows (block 2, `reference/extracted/npcdata.xml`):

```
4665  <id>212</id> <lvl>11</lvl> <hp>28</hp>  <attack>27</attack>  <defense>27</defense>   ceil(2.5*11)=28  ceil(2.4*11)=27
4861  <id>223</id> <lvl>20</lvl> <hp>50</hp>  <attack>48</attack>  <defense>48</defense>
5298  <id>247</id> <lvl>40</lvl> <hp>100</hp> <attack>96</attack>  <defense>96</defense>
5317  <id>248</id> <lvl>45</lvl> <hp>113</hp> <attack>113</attack> <defense>126</defense>  ceil(2.8*45)=126
5392  <id>252</id> <lvl>70</lvl> <hp>175</hp> <attack>175</attack> <defense>175</defense>
```

Verification command output:

```
checked 225 army NPCs lvl>=11 across all five blocks; formula violations: 0
low band (lvl<=10) distinct (lvl,hp,atk,def):
 [(1,'1','1','1'),(2,'1','2','2'),(3,'1','3','3'),(4,'1','4','4'),(5,'1','5','5'),
  (6,'6','6','6'),(7,'7','7','7'),(8,'8','8','8'),(9,'9','9','9'),(10,'10','10','10')]
```

**Consequence:** enemies-ai's 34/100 is not a floor, it is wrong. The single value the whole
roster's balance funnels through is held, verbatim, at A2.

---

## CLAIM LEDGER

### C1 — enemy level→stat formula is HELD (overturns §2/§4 enemies-ai ①)
**Class A2 · cite** `reference/extracted/npcdata.xml` — `<npc>` blocks starting at lines
4665, 4861, 5298, 5317, 5392 (fields sit at block-start + 3…6)
**Quote (block 4665, npc 212)** `<lvl>11</lvl> <hp>28</hp> <attack>27</attack> <defense>27</defense>`
See headline table. 225/225 rows reproduced by the closed form, across five independent armies.
**Overturns:** *"enemy **level→stat formula** (governs the whole roster's balance — absent, not just inferred)"*
**Lane:** enemies-ai (blocker ① closed). Also progression — the same 2.4/2.5/2.8-per-level
shape is the only observed stat-vs-level transfer function in the payload.

### C2 — per-enemy HP is HELD for 403 of 495 NPCs (overturns §4 enemies-ai ②)
**Class A2 · cite** `reference/extracted/npcdata.xml:3125` (and 402 sibling rows)
**Quote** `npc 144 "Hiroshi": <lvl>80</lvl> <hp>1000</hp> <attack>200</attack> <defense>200</defense>`
Named-boss HP, all authored, all first-hand:
Hiroshi L80 hp1000 · Mad Cultist L23 hp800 (`:4076`) · Amaya L30 hp600 (`:3846`) ·
Tadao L10 hp200 (`:3446`) · Wolf L15 hp100 (`:1848`) · Bear L8 hp60 (`:1951`) ·
Bandit Leader L10 hp30 (`:499`) · Guardian L10 hp30 (`:4115`) · Training Dummy L5 hp10 (`:2689`).
The 92 NPCs with no `<hp>` are non-combat (shopkeepers, quest-givers, wardrobe entries).
**Overturns:** *"② per-enemy HP"* listed as a blocker.
**Lane:** enemies-ai.

### C3 — a LIVE CONFIG COMMENT is factually wrong: named-enemy HP *is* authored
**Class A2 · cite** `reference/extracted/npcdata.xml:3125` vs `src/config/combat-sim.ts` `ENEMY_BASE`
**Quote (config, verbatim):** *"Named-enemy HP is not authored at all — it is recomputed at spawn
as `effPlayerDmg × K`, and the source's own data authors trash HP as `<hp>1</hp>` and lets
`max(scaledBase, …)` be a no-op."*
The first half of that sentence is false. `<hp>1</hp>` is real (42 rows, C4) but it is the *trash*
tier only; 361 further rows carry authored non-1 HP, including every named boss. The `max()`
reasoning that justified `hp: 1` therefore rests on a claim the payload contradicts.
**No file was modified** (this lane is read-only, §4 NO-TOUCH). Flagged for the build lane.
**Lane:** enemies-ai, combat-core.

### C4 — the "1-HP field trash" reading is CONFIRMED at A2, with an exact census
**Class A2 · cite** `reference/extracted/npcdata.xml:26, :4455, :4542, :1659, :149, :1991, :2087, :2710`
**Quote** `npc 1 "Ruffian": <lvl>3</lvl> <hp>1</hp> <ai>1</ai> <attack>3</attack> <defense>0</defense>`
42 NPCs have `<hp>1</hp>`: Soldier ×25, Ruffian ×5, Elite Soldier ×5, Novice Swordsman ×3,
Thug ×1, Deer ×1, Fox ×1, Training Dummy ×1. Every one dies to any hit ≥ 1.
**Upgrades** the ledger's enemies-ai *Surface* bullet (*"the shipped `AI_TIERS`/`ENEMY_BASE` are a
PvP-duel dummy (hp 150), not the ~1-HP-chip field trash the video shows; every PvE number lives
only in notes"*) from "notes" to A2 payload. Note `src/config/combat-sim.ts` already ships `hp: 1`.
**Lane:** enemies-ai, combat-core.

### C5 — a 34-profile AI archetype table is HELD (partial on §4 enemies-ai ④)
**Class A2 · cite** `reference/extracted/npcdata.xml:27` and 424 sibling rows
**Quote** `<ai>1</ai>`
425 NPCs carry `<ai>`; 34 distinct ids in 1..37 (**10, 15 and 16 are never used**). Distribution:
ai1 ×56, ai2 ×48, ai3 ×52, ai4 ×47, ai5 ×48 (the five generic soldier ranks) · ai9 ×73
(Elite/Heavy/Castle Guard) · ai28 ×24 · ai14 ×15 (captains/leaders) · ai26 ×8 (Undead) ·
ai6 ×3 (Ninja/Kurai/Jonin) · one-off creature profiles ai8/11 Wolf, ai12 Horse, ai17 Bear,
ai18 Boar, ai19 Deer, ai21 Stag, ai22/23/25 Oni, ai24 Fox · ai13 Training Dummy ·
boss-unique ai29–ai37 (Aboshi, Magoichi, Gojo Takamori, Mitsuo, Mad Cultist, Guardian,
Tadao, Amaya).
**Honest limit:** the *assignment* is held; the *behaviour bodies* (aggro radius, leash, spawn
geometry) are not in this file — they live in the AS3 bundles and remain STILL_UNHELD here.
**Lane:** enemies-ai (blocker ④ half-closed: the taxonomy is now a table, not a guess).

### C6 — drop tables with exact probabilities are HELD (overturns §1 known-unknown "loot/drop tables")
**Class A2 · cite** `reference/extracted/npcdata.xml:39-42, :530-532, :1859-1861, :1975-1982`
**Quote** `<loot> <id>2</id> <qty>1</qty> <chance>1</chance> </loot>` (npc 17 Bandit Leader, `:530`)
66 NPCs carry `<reward>`, holding 131 `<loot>` rows. `<chance>` domain is exactly
{0.05, 0.1, 0.3, 0.4, 0.5, 1}; `<qty>` ∈ {1,2,3,5}. Two clear authoring patterns:
- **elite/boss guaranteed drop** — `id=2, qty=1, chance=1` on Bandit Leader 17, Soldier 25,
  Ninja 32, Cultist 46, Wolf 67, Inokichi, Tadao, Aboshi, Mad Cultist, Guardian;
- **animal butchery** — Boar/Deer `2113 Meat` 0.3 + `2112 Small Meat` 0.3; Stag `2114 Large
  Meat` 0.4; Wolf `20028 Animal Fang` 0.5 (`:1859`).
**Honest limit:** loot `<id>` 0/1/2/3 are **table references**, not item ids (real item ids in the
same field are 5-digit: 2112/2113/2114/20028). What tables 0–3 resolve to is **STILL_UNHELD**
from this file.
**Overturns:** §1 KNOWN-UNKNOWNS *"Systems formulas: … loot/drop tables"*.
**Lane:** items-equipment, economy, enemies-ai.

### C7 — enemy skill loadouts (647 rows, 39 skills, with ranks) are HELD
**Class A2 · cite** `reference/extracted/npcdata.xml:535, :1040, :3898, :3934`
**Quote (npc 17, `:535`)** `<skills><skill><id>1000</id><lvl>10</lvl></skill><skill><id>1001</id><lvl>10</lvl></skill><skill><id>1002</id><lvl>10</lvl></skill><skill><id>1003</id><lvl>1</lvl></skill><skill><id>1004</id><lvl>5</lvl></skill><skill><id>1006</id><lvl>1</lvl></skill></skills>`
96 NPCs carry `<skills>`; **647** `<skill>` rows; **39** distinct skill ids, 37 of which resolve
against `skilldata.xml` + the string table — i.e. enemies draw from the **same** skill pool as the
player. Frequency (top): Jump ×95, Roll ×95, Heavy Stance Mastery ×79, Slash Wave ×79, Balanced
Stance Mastery ×77, Light Stance Mastery ×76, Dash Right ×16, Dash Left ×16.
Only `1500` (×5) and `1501` (×2) fail to resolve — both are `<category>11</category>` stubs in
`skilldata.xml:1948, :1960` with empty `<chi>`, `<cooldown>` and `<desc>`, carried by Aboshi,
Magoichi and Gojo Takamori. Their identity is **STILL_UNHELD**.
Boss loadouts are individually authored, e.g.:
- `:3898` **Magoichi** — Shunpo(1039), Slash Wave@2, Chi Punch, Chi Kick, Spirit Thief,
  Heavenly Sword@3, Back Throw, Air Stab
- `:3934` **Gojo Takamori** — the same set **plus `<id>1068</id>` "Undying"**
- `:3436` **Fumio** — Heavy Stance Mastery@3, Stab, Heavy Stance Launch, Deflect(1038),
  Deadly Cleave, Ground Punch@2
- `:3662` **Aboshi** — Throw Kunai, Smoke Bomb@2, Substitution Jutsu@2, Shadow Clone(1053)
**Overturns** the framing that enemy movesets are "taxonomy + notes": they are a per-NPC,
per-rank data table. Also lands on **skills-meters blocker ②** — Shunpo is real, is skill 1039,
and its description is held: *"Ultimate Light Stance technique. Hold down the skill icon to
increase the damage it inflicts. This skill can only be used when in Light Stance."*
**Lane:** enemies-ai, skills-meters.

### C8 — FIVE parallel clan armies are HELD (partially overturns §4 meta-social ①)
**Class A2 · cite** `reference/extracted/npcdata.xml:4460, :5495, :6530, :7565, :8600`
(blocks starting at 4451 / 5486 / 6521 / 7556 / 8591)
**Quote** npc 200 `:4460 <armor>4038</armor>` · npc 300 `:5495 <armor>4041</armor>` ·
npc 400 `:6530 <armor>4044</armor>` · npc 500 `:7565 <armor>4047</armor>` ·
npc 600 `:8600 <armor>4053</armor>` — every other field identical
(`<name>5053</name><lvl>1</lvl><hp>1</hp><ai>1</ai><attack>1</attack><defense>1</defense>`,
same hair pool, `<pants>11006</pants>`, `<shoes>12002</shoes>`, `<weapon>13109</weapon>`).
Five blocks × 57 units. Each block uses its own 4-id livery set drawn from the armor band:
block2 {4038,4039,4040,4055} · block3 {4041,4042,4043,4056} · block4 {4044,4045,4046,4057} ·
block5 {4047,4048,4049,4058} · block6 {4005,4051,4052,4053}. The livery ids resolve to the
*same* display names across blocks ("Garment", "Light Armor") — i.e. **armor id is the clan
heraldry channel**, one recolour per faction.
**Honest limit / conflict:** the string table names only **four** clans —
`275 "Clan Aka Ryu"`, `276 "Clan Midori Ken"`, `277 "Clan Aoi Hoiru"`, `278 "Clan Ki Sensu"`.
Which faction the fifth army belongs to is **STILL_UNHELD**.
**Bearing on** *"① **server-authoritative simulation** … **unrecoverable at 1:1**"* — the
simulation logic is indeed not here, but the war's **unit roster, level ladder and per-clan
livery are fully held**, which is most of what a rebuilt offline sim needs to be populated with.
**Lane:** meta-social, enemies-ai, items-equipment.

### C9 — the paperdoll is 12 render slots, not 9 (corrects §4 items-equipment "Ready")
**Class A2 · cite** `reference/extracted/npcdata.xml:7-19` (npc 0, the reference paperdoll)
**Quote**
```
7  <mcs>
8    <armor>4031</armor>   9 <gloves>5005</gloves>  10 <hair>6001</hair>   11 <hat>7052</hat>
12   <head>8008</head>    13 <mask>9000</mask>      14 <neck>10004</neck>  15 <pants>11030</pants>
16   <shoes>12015</shoes> 17 <weapon>13012</weapon> 18 <prop1>13012</prop1>
19 </mcs>
```
Plus `<prop2>` at `:3954`. That is **12** distinct `<mcs>` child tags. Cross-checked against
`itemdata.xml`, the id-band ↔ `<type>` map is perfectly clean:

| id band | `<type>` | slot | items |
|---|---|---|---|
| 4000s | *(no `<type>` tag)* | armor | 152 |
| 5000s | 1 | gloves | 35 |
| 6000s | 2 | hair | 73 |
| 7000s | 3 | hat | 97 |
| 8000s | 4 | head | 38 |
| 9000s | 5 | mask | 60 |
| 10000s | 6 | neck | 14 |
| 11000s | 7 | pants | 93 |
| 12000s | 8 | shoes | 55 |
| 13000s | 9 | weapon / prop1 / prop2 | 177 |
| 2000s | 10 | consumable | 98 |
| 3000s | 11 | (9 items, unclassified) | 9 |
| 20000s | 12 | material | 79 |

**Corrects:** *"**Ready:** 9-slot paperdoll"* — there are **10 wearable slots** (armor + types 1–9)
and **12 render slots** once `prop1`/`prop2` are counted.
**Honest limit:** this gives the slot *set* and the id *namespace*, not the **layer order** —
`<mcs>` children are emitted alphabetically (armor, gloves, hair, hat, head, mask, neck, pants,
shoes, weapon, prop1, prop2), which is an authoring artefact, not z-order. The
"sprite-compositing contract (layer order)" half of items-equipment blocker ⑤ is **STILL_UNHELD**.
**Lane:** items-equipment, art-anim-audio-feel.

### C10 — NPC appearance is a RANDOMISED wardrobe roll; the ledger has nothing on this
**Class A2 · cite** `reference/extracted/npcdata.xml:31, :505, :506`
**Quote (npc 1, `:31`)** `<hair>6000,6001,6002,6003,6004,6007,6008,6009,6013,6014,6015.6017,6018,6019</hair>`
**Quote (npc 17, `:506`)** `<hat>0,0,0,0,0,0,0,0,0,7003,7008,7009,7010,7011,7012,7013,7014,7015,7016,7017</hat>`
741 of 3,210 `<mcs>` slot rows (**23.1%**) are comma-separated **pools**, not single ids. The
repeated `0` entries in the `<hat>` pool are a **weighting device** — 9 zeros to 11 real hats
means ~45% of that archetype spawns bare-headed. So a single `<npc>` row is a *generator*: one
archetype spawns visually varied instances by rolling each slot independently against its pool.
Nothing in REBUILD_READINESS models this; it is a from-scratch-art and RNG-contract requirement
that a system-siloed reader would never see, because it sits between items-equipment,
enemies-ai and art-anim.
**Lane:** art-anim-audio-feel, items-equipment, enemies-ai.

### C11 — per-NPC render SCALE is HELD and reaches 2.0×; absent from the ledger
**Class A2 · cite** `reference/extracted/npcdata.xml:4136-4137` (npc 802 Guardian),
`:3880-3881` (npc 187 Yohei), `:3408-3409` (npc 162 Inokichi)
**Quote (`:4136-4137`)** `<scalex>2</scalex>` `<scaley>2</scaley>`
Exactly **16** NPCs carry explicit render scale; the domain is {0.95, 0.99, 1, 1.1, 1.3, 2}. Notables:
Guardian **2.0 / 2.0** (a double-height boss — the only 2× entity in the file), Yohei **1.3 / 1.3**,
Inokichi **1.3 / 1.1** (non-uniform — a *wide* fighter), Fumio / Mitsuo **1.0 / 0.95** (squat),
Shou **0.99 / 0.99**. Non-uniform x≠y scaling means the renderer must scale axes independently.
The ledger's art-anim §4 ("proportions", "fighter proportions") assumes one fighter size.
**Lane:** art-anim-audio-feel, enemies-ai.

### C12 — elemental typing exists ON NPCs, at 4 rows
**Class A2 · cite** `reference/extracted/npcdata.xml:3380` (fire), `:3439, :4039, :4272` (earth)
**Quote** `<fire>10</fire>` (npc 161 Satoshi) · `<earth>10</earth>` (npc 164 Fumio, 197 Mitsuo, 809 Mitsuo)
Only four rows in 495, both valued `10`. Each of the four also carries a matching elemental
*skill*: Satoshi has `1013 "Fire Breath"` — *"Close-ranged fire attack"*; Fumio/Mitsuo have
`1033 "Ground Punch"` — *"Close-ranged earth attack."*
**Bearing on** rebirth-elements blocker ② (*"elemental ATK-vs-DEF **formula**"*): the *field*
exists on the NPC side and pairs with elemental skills, so elements are a live combat channel
in v0.682 data, not a rebirth-only cosmetic. What the scalar `10` means (resist? affinity?
damage bonus?) is **STILL_UNHELD** — no `water`/`wind` sibling appears anywhere in this file.
**Lane:** rebirth-elements, combat-core.

### C13 — the payload ships REAL DATA BUGS a rebuilder must handle
**Class A2 · cite** `reference/extracted/npcdata.xml:1644`, `:4371`, and 355 rows containing `6015.6017`
**Quote (`:1644`)** `<hair>6.5006501650265E+47</hair>`
**Quote (`:4371`)** `<id>815</id> <name>5001</name> <attack>7092</attack>`
Three distinct authoring defects, all shipped:
1. `:1644` — an entire hair pool has been coerced to a **float** by the authoring tool
   (`6.5006501650265E+47`). Unparseable as ids. 1 occurrence.
2. **355 occurrences** of `6015.6017` — a period typed for a comma inside hair pools, silently
   collapsing two ids (6015, 6017) into one bogus token. Present in the block-2..6 army rows,
   i.e. in the most-instantiated NPC in the game.
3. `:4371, :4389, :4408, :4425` — NPCs 815–818 carry `<attack>` values of **7092 / 7076 / 7077 /
   7040**, all inside the **hat** id band (7000s), while each also has a real `<hat>`. These four
   plus 814 have no `<lvl>`, `<hp>`, `<defense>` or `<ai>` — they are non-combat display entries
   whose `<attack>` field is holding a mis-keyed second headwear id.
**Consequence:** the index's `npcdata/npc/attack` `numeric_range [1.0, 7092.0]` is an artefact of
defect 3, **not** a real 7,092-attack enemy. A naive importer would ship a boss with 7092 ATK.
**Lane:** enemies-ai, items-equipment, art-anim-audio-feel.

### C14 — stance mastery caps at rank **10**, contesting §3 correction #3's "mastery-9"
**Class A2 · cite** `reference/extracted/npcdata.xml:535` + `reference/extracted/skilldata.xml` skills 1000/1001/1002
**Quote** `<skill><id>1000</id><lvl>10</lvl></skill><skill><id>1001</id><lvl>10</lvl></skill><skill><id>1002</id><lvl>10</lvl></skill>`
Every elite NPC ships the three stance masteries at rank **10**, and `skilldata.xml` gives each of
1000/1001/1002 exactly **10** `<level>` rows. Resolved names confirm the mapping:
1000 = "Light Stance Mastery", 1001 = "Balanced Stance Mastery", 1002 = "Heavy Stance Mastery".
**Contests:** §3 #3 *"The stance tables (dmg 0.9/1.2/1.4, reach 300/200/100) are **MASTERY-9
CEILING** values, not base."* The ceiling rank is 10, not 9 — so either the wiki numbers are the
rank-**10** ceiling, or they are a mid-curve row. **PARTIAL:** I hold the rank cap; I do **not**
hold which rank the 300/200/100 reach figures belong to. That still needs the skilldata `<value>`
rows read against the wiki.
**Lane:** combat-core, skills-meters.

### C15 — Heavy stance's defence penalty is confirmed verbatim at −20%
**Class A2 · cite** skill 1002 (carried by 79 NPCs, e.g. `reference/extracted/npcdata.xml:535`),
resolved through `docs/gauntlet/L0/index/strings.json`
**Quote** *"Slow but powerful stance. Damage inflicted is increased but slash range is shorter.\nEffective against Balanced Stance.\n**Defense -20%**"*
Confirms §1's *"Heavy defender Defense ×0.8 (one way)"* with a first-party string rather than a
wiki restatement. Also confirms the stance rock-paper-scissors ring verbatim:
Light *"Effective against Heavy Stance"* → Heavy *"Effective against Balanced Stance"* →
Balanced *"Effective against Light Stance"*.
⚠ ANDROID build v0.682 copy (S0-3). Web v0.717 parity not established.
**Lane:** combat-core.

### C16 — four "omitted bosses" the ledger names are absent from BOTH the roster and the string table
**Class A2 (negative) · cite** `docs/gauntlet/L0/index/resolved_names.json` (484 resolved npc names)
+ `docs/gauntlet/L0/index/strings.json` (2,533 entries)
**Quote (ledger, enemies-ai Surface)** *"Boss table omits Hachisuka Kano, Honda Shizuka, Zabuza, Tengu Hotaru."*
Zero hits for `Hachisuka`, `Honda`, `Zabuza`, `Tengu`, `Kano`, `Shizuka`, `Hotaru` — and zero for
`Shira Tancho` (§4 meta-social's *"+ Shira Tancho story-only"*) — across the full 2,533-entry EN
string table and the 484 resolved NPC names. The payload's actual named-boss roster is:
Hiroshi, Amaya, Tadao, Mad Cultist, Guardian, Gojo Takamori, Magoichi, Yohei, Aboshi, Mitsuo,
Kojuro, Chikako, Yuudai, Fumio, Satoshi, Hachimaru, Shou, Inokichi, Boss Tanaka, Den Boss,
General Daisuke, Lady Oiwa, Nian Monster, Santa, Jinbei, Kurai, Jonin.
**PARTIAL, deliberately.** Absence from the **Android v0.682** table is not proof of absence from
web v0.717, and those four names may be wiki/fan or predecessor-game material. But they are
currently **unsourced against any artifact we hold**, and the ledger presents them as a known gap
in our boss table — which implies we know they exist. We do not.
**Lane:** enemies-ai, quests-story.

### C17 — FRAME MEASUREMENT: the longplay frames carry a 52 px pillarbox each side
**Class A1 · cite** `reference/frames/duel_dense/Nr4fQstqHDM_428.0.png` (1920×1080 PNG).
**Crop used:** two crops at 3× nearest-neighbour upscale — `crop=960:400:0:380` (left half) and
`crop=960:400:960:380` (right half); then a full-frame per-column luminance scan.
**Visibly in the crops:** a solid black vertical band at the extreme left of the left crop and at
the extreme right of the right crop; game art (stone-wall backdrop, straw-hat fighter, blood
spray) between them; a yellow **"SOUND360TM"** recorder watermark mid-frame.
**Measured:** per-column mean luminance is `0.0–1.1` for columns 0–51, jumps to `40.9` at column
**52** and `86.5` at 53; falls to `33.2` at column **1867** and `1.3` at 1868, staying ≤1.3 to
1919. Identical on `Nr4fQstqHDM_432.0.png`. Active picture = **columns 52..1867 = 1816 × 1080**,
aspect **1.6815 : 1**. That is not 16:9 (1.7778); it is within 0.9% of **5:3 (1.6667)**.
**Confirms** §3 correction #12 (*"Native resolution is 800×480 (5:3), not 16:9 — HUD x-fractions
measured off 1920×1080 video may be pillarbox-compressed"*) and lands directly on **ui-hud blocker
①** (*"aspect-ratio truth (5:3 native → are x-fractions pillarbox-wrong?)"*). Any HUD x-fraction
taken against the full 1920 is wrong by an offset of 52 px and a scale of 1816/1920 = **0.9458**.
**Honest limit:** a single frame cannot separate a Flash-stage pillarbox from the screen
recorder's own letterboxing of a browser window — and the `SOUND360TM` watermark proves a
recorder overlay was present. The **existence and exact width** of the bars is HELD; their
**origin** is STILL_UNHELD.
**THE FRAME WINS:** where any HUD-geometry doc quotes an x-fraction of 1920, the frame says the
picture is 1816 wide starting at x=52 — take the frame.
**Lane:** ui-hud, art-anim-audio-feel.

### C18 — the only unresolved NPC name, and what it is attached to
**Class A2 · cite** `reference/extracted/npcdata.xml:1560, :1576, :1592, :1608, :1624, :1640`
**Quote** `<name>5017</name>`
Six NPCs (ids 50–55) reference string id `5017`, which has **no entry** in the 2,533-key Android
EN table — the only 6 misses in 490 `<name>` rows (484/490 resolved). All six are non-combat:
no `<lvl>`, no `<hp>`, no `<attack>`, no `<defense>`, no `<reward>`, and `<weapon>0</weapon>`.
Four carry `<ai>7</ai>` (`:1561, :1577, :1593, :1609`) — the profile otherwise used only by
"Peasant" and "Charcoal Burner", i.e. a **civilian idle** behaviour; the last two carry
`<ai>32</ai>` (`:1625`) and `<ai>33</ai>` (`:1641`), the Kojuro and Chikako profiles.
Only npc 55 (`:1646, :1648`) uses a **500-offset body sub-band** —
`<head>8500,8501,8502,8503,8504,8505,8506</head>` and `<pants>11503</pants>` — head/pants ids
that no other NPC in the file touches.
**STILL_UNHELD:** what archetype 5017 is. The ai-7 civilian pairing points at a townsfolk type
and the 500-band body parts at a second body rig (the payload's `MCSCharacter_*` blobs, S0-4,
would settle it), but I will not guess.
**Lane:** art-anim-audio-feel, enemies-ai.

---

## WHAT I LOOKED FOR AND DID **NOT** FIND IN THIS FILE (STILL_UNHELD)

Recorded so the next lane does not re-open them against `npcdata.xml`:

- **Telegraph / active / recovery / stagger frames** (enemies-ai ③) — no timing field of any kind
  exists in `npcdata.xml`. Not here.
- **Aggro radius, leash distance, spawn geometry** (enemies-ai ④) — `<ai>` is an *index*; the
  behaviour bodies are in the AS3 bundles, not this file.
- **Undead damage-reflect probability** (enemies-ai ⑤) — the 9 Undead NPCs carry ordinary
  `<hp>/<attack>/<defense>` and no reflect field. Skill `1068 "Undying"` (Gojo Takamori `:3934`,
  Aboshi `:4349`) is the closest candidate and has **no `<desc>`** in the string table.
- **Arrow arc physics** — no projectile field.
- **XP or coin reward per kill** — `<reward>` holds **only** `<loot>`. There is no `<xp>` and no
  `<coins>` tag anywhere in the file. The economy ledger's *"coins-per-kill reality (`=8` is an
  unconfirmed INFERRED seed)"* gets **no help** from npcdata; that number is not authored here.
- **Sprite layer / z-order** (items-equipment ⑤) — see C9's honest limit.
- **Which clan the fifth army belongs to** — see C8.
- **Meaning of loot table ids 0–3** — see C6.
- **Meaning of the elemental scalar `10`** — see C12.

---

## SCORING NOTE

On the strength of C1+C2+C5+C6+C7 alone, **enemies-ai's 34/100 is indefensible**. Four of its
five listed blockers are wholly or half closed by one 228 KB file that predates the score by
nothing — it was sitting in `reference/extracted/` unread. The document's own staleness banner
already concedes this direction; this survey supplies the A2 cites it asked for.
